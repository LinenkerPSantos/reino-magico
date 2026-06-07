import sqlite3
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DB_PATH  = os.path.join(BASE_DIR, "data", "rpg.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def load_all_data() -> dict:
    conn = get_db()

    magic_levels = [dict(r) for r in conn.execute(
        "SELECT nivel,nome,custo,cor FROM magic_levels ORDER BY nivel"
    ).fetchall()]

    level_map = {r["nivel"]: r["nome"] for r in conn.execute(
        "SELECT nivel,nome FROM magic_levels"
    ).fetchall()}
    spells_raw = conn.execute(
        """SELECT nome,tipo,nivel_magia,custo_mana as custo,prereq,execucao,
                  alcance,alvo,duracao,categoria,natureza,descricao
           FROM spells ORDER BY nivel_magia, tipo, nome"""
    ).fetchall()
    spells = []
    for r in spells_raw:
        d = dict(r)
        d["nivel_nome"] = level_map.get(d["nivel_magia"], "?")
        spells.append(d)

    talents = [dict(r) for r in conn.execute(
        "SELECT nome,descricao FROM talents ORDER BY nome"
    ).fetchall()]

    classes = {}
    for r in conn.execute("SELECT * FROM classes ORDER BY nome").fetchall():
        d = dict(r)
        nome = d.pop("nome")
        d["pericias"] = [
            row["skill_nome"] for row in conn.execute(
                "SELECT skill_nome FROM class_skills WHERE class_id=?", (d["id"],)
            ).fetchall()
        ]
        d["spellAccess"]    = json.loads(d.pop("spell_access", "[]"))
        d["extraSlots"]     = d.pop("extra_slots", 0)
        d["extraSlotType"]  = d.pop("extra_slot_type", None)
        d["espiritualista"] = bool(d.pop("is_espiritualista", 0))
        d.pop("id", None)
        classes[nome] = d

    races = {}
    for r in conn.execute("SELECT * FROM races ORDER BY nome").fetchall():
        d = dict(r)
        nome = d.pop("nome")
        rid  = d.pop("id")
        traits = [
            {"n": t["nome"], "d": t["descricao"], "bonus": t["bonus"]}
            for t in conn.execute(
                "SELECT nome,descricao,bonus FROM race_traits WHERE race_id=? ORDER BY id",
                (rid,)
            ).fetchall()
        ]
        d["traits"]              = traits
        d["bMana"]               = d.pop("b_mana", 0)
        d["bAttrExtra"]          = d.pop("b_attr_extra", 0)
        d["extraSpell"]          = d.pop("extra_spell", None)
        d["extraSpellType"]      = d.pop("extra_spell_type", None)
        d["extraSpellTypeCount"] = d.pop("extra_spell_type_count", 0)
        d["extraTal"]            = d.pop("extra_tal", 0)
        d["extraPer"]            = d.pop("extra_per", 0)
        races[nome] = d

    kits      = {}
    kit_equip = {}
    for r in conn.execute("SELECT * FROM kits ORDER BY nome").fetchall():
        kid  = r["id"]
        nome = r["nome"]
        items = [
            {"n": i["nome"], "d": i["descricao"], "prof": i["prof"]}
            for i in conn.execute(
                "SELECT nome,descricao,prof FROM kit_items WHERE kit_id=?", (kid,)
            ).fetchall()
        ]
        extras = [e["item_nome"] for e in conn.execute(
            "SELECT item_nome FROM kit_extras WHERE kit_id=?", (kid,)
        ).fetchall()]
        skill_bonuses = {
            s["skill_nome"]: s["bonus"]
            for s in conn.execute(
                "SELECT skill_nome,bonus FROM kit_skill_bonuses WHERE kit_id=?", (kid,)
            ).fetchall()
        }
        vantagens = [v["skill_nome"] for v in conn.execute(
            "SELECT skill_nome FROM kit_vantagens WHERE kit_id=?", (kid,)
        ).fetchall()]
        kits[nome]      = {"items": items, "extras": extras}
        kit_equip[nome] = {"db": r["db_bonus"], "skills": skill_bonuses,
                           "vantagens": vantagens, "items": items}

    skills = [
        {"n": r["nome"], "a": r["atributo"]}
        for r in conn.execute("SELECT nome,atributo FROM skills ORDER BY nome").fetchall()
    ]

    languages = [r["nome"] for r in conn.execute(
        "SELECT nome FROM languages ORDER BY nome"
    ).fetchall()]

    race_langs = {}
    for r in conn.execute("SELECT * FROM races ORDER BY nome").fetchall():
        rid  = r["id"]
        nome = r["nome"]
        fixos = [x["lang"] for x in conn.execute(
            "SELECT lang FROM race_langs WHERE race_id=? AND tipo='fixo'", (rid,)
        ).fetchall()]
        extras_row = conn.execute(
            "SELECT lang FROM race_langs WHERE race_id=? AND tipo='extras_count'", (rid,)
        ).fetchone()
        race_langs[nome] = {"fixos": fixos, "extras": int(extras_row["lang"]) if extras_row else 0}

    trait_bonuses = {
        r["trait_nome"]: {"db": r["db"], "lmt": r["lmt"], "mana": r["mana"], "label": r["label"]}
        for r in conn.execute("SELECT * FROM trait_bonuses").fetchall()
    }

    talent_stat_bonuses = {
        r["talent_nome"]: {"cd": r["cd"], "mana": r["mana"], "vida": r["vida"],
                           "lmt": r["lmt"], "label": r["label"]}
        for r in conn.execute("SELECT * FROM talent_stat_bonuses").fetchall()
    }

    talent_vantagens = {}
    for r in conn.execute(
        "SELECT talent_nome,skill_nome FROM talent_vantagens ORDER BY talent_nome"
    ).fetchall():
        talent_vantagens.setdefault(r["talent_nome"], []).append(r["skill_nome"])

    racial_vantagens = {}
    for r in conn.execute(
        "SELECT trait_nome,skill_nome FROM racial_vantagens ORDER BY trait_nome"
    ).fetchall():
        racial_vantagens.setdefault(r["trait_nome"], []).append(r["skill_nome"])

    talent_prereqs = {}
    for r in conn.execute("SELECT * FROM talent_prereqs").fetchall():
        d = {"label": r["label"]}
        if r["attr"]:
            d["attr"] = r["attr"]
            d["min"]  = r["min_val"]
        if r["pacto"]:
            d["pacto"] = True
        talent_prereqs[r["talent_nome"]] = d

    fauno_aspectos = {
        r["nome"]: {"label": r["label"], "ativo": r["ativo"], "desc": r["desc"]}
        for r in conn.execute("SELECT * FROM fauno_aspectos ORDER BY nome").fetchall()
    }

    racial_data = {}
    for r in conn.execute(
        """SELECT rc.nome, rd.altura, rd.peso_medio, rd.expectativa_vida,
                  rd.movimento, rd.idiomas_nativos
           FROM racial_data rd
           JOIN races rc ON rc.id = rd.race_id
           ORDER BY rc.nome"""
    ).fetchall():
        racial_data[r["nome"]] = {
            "altura":           r["altura"],
            "peso_medio":       r["peso_medio"],
            "expectativa_vida": r["expectativa_vida"],
            "movimento":        r["movimento"],
            "idiomas_nativos":  r["idiomas_nativos"],
        }

    entities = [dict(r) for r in conn.execute(
        "SELECT nome,tipo,elemento,titulo,descricao,efeito_nome,efeito FROM entities ORDER BY tipo,nome"
    ).fetchall()]

    conditions = [dict(r) for r in conn.execute(
        "SELECT nome,descricao,efeito,salvaguarda FROM conditions ORDER BY nome"
    ).fetchall()]

    equipamentos = [dict(r) for r in conn.execute(
        """SELECT categoria,subcategoria,nome,tier,dano,tipo_dano,alcance,propriedades,bonus,
                  bonus_db,tipo,requisito,descricao,preco,tipo_base,efeitos,maldicao,lore
           FROM equipamentos ORDER BY categoria,nome"""
    ).fetchall()]

    conn.close()

    return {
        "magic_levels":        magic_levels,
        "spells":              spells,
        "talents":             talents,
        "classes":             classes,
        "races":               races,
        "kits":                kits,
        "kit_equip_bonuses":   kit_equip,
        "skills":              skills,
        "languages":           languages,
        "race_langs":          race_langs,
        "trait_bonuses":       trait_bonuses,
        "talent_stat_bonuses": talent_stat_bonuses,
        "talent_vantagens":    talent_vantagens,
        "racial_vantagens":    racial_vantagens,
        "talent_prereqs":      talent_prereqs,
        "fauno_aspectos":      fauno_aspectos,
        "racial_data":         racial_data,
        "entities":            entities,
        "conditions":          conditions,
        "equipamentos":        equipamentos,
    }

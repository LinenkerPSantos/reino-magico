"""
Servidor HTTP para o RPG Reino Mágico.
Serve a Ficha de Personagem e a API de dados do banco de dados.

Execute: python server.py
Acesse:  http://localhost:5000
"""

import sqlite3
import json
import os
import sys
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, unquote
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
DB_PATH    = os.path.join(BASE_DIR, 'rpg.db')
INDEX_PATH = os.path.join(BASE_DIR, 'index.html')
HTML_PATH  = os.path.join(BASE_DIR, 'Criador_de_Personagem_Reino_Magico.html')

# Mapa de rotas estáticas → arquivo HTML
STATIC_PAGES = {
    '/mecanicas':  os.path.join(BASE_DIR, 'mecanicas.html'),
    '/historia':   os.path.join(BASE_DIR, 'historia.html'),
    '/racas':      os.path.join(BASE_DIR, 'racas.html'),
    '/classes':    os.path.join(BASE_DIR, 'classes.html'),
}
PORT = 5000


# ─────────────────────────────────────────────────────────
# DATABASE QUERIES
# ─────────────────────────────────────────────────────────

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def load_all_data():
    """Carrega todos os dados do banco e retorna um dicionário JSON-serializável."""
    conn = get_db()

    # Níveis de Magia
    magic_levels = [dict(r) for r in conn.execute(
        "SELECT nivel,nome,custo,cor FROM magic_levels ORDER BY nivel"
    ).fetchall()]

    # Magias — adiciona campo nivel_nome
    level_map = {r['nivel']: r['nome'] for r in conn.execute(
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
        d['nivel_nome'] = level_map.get(d['nivel_magia'], '?')
        spells.append(d)

    # Talentos
    talents = [dict(r) for r in conn.execute(
        "SELECT nome,descricao FROM talents ORDER BY nome"
    ).fetchall()]

    # Classes + perícias
    classes = {}
    for r in conn.execute("SELECT * FROM classes ORDER BY nome").fetchall():
        d = dict(r)
        nome = d.pop('nome')
        d['pericias'] = [
            row['skill_nome'] for row in conn.execute(
                "SELECT skill_nome FROM class_skills WHERE class_id=?", (d['id'],)
            ).fetchall()
        ]
        d['spellAccess']    = json.loads(d.pop('spell_access', '[]'))
        d['extraSlots']     = d.pop('extra_slots', 0)
        d['extraSlotType']  = d.pop('extra_slot_type', None)
        d['espiritualista'] = bool(d.pop('is_espiritualista', 0))
        d.pop('id', None)
        classes[nome] = d

    # Raças + traços
    races = {}
    for r in conn.execute("SELECT * FROM races ORDER BY nome").fetchall():
        d = dict(r)
        nome = d.pop('nome')
        rid  = d.pop('id')
        traits = [
            {'n': t['nome'], 'd': t['descricao'], 'bonus': t['bonus']}
            for t in conn.execute(
                "SELECT nome,descricao,bonus FROM race_traits WHERE race_id=? ORDER BY id",
                (rid,)
            ).fetchall()
        ]
        d['traits'] = traits
        # bMana (alias)
        d['bMana']      = d.pop('b_mana', 0)
        d['bAttrExtra'] = d.pop('b_attr_extra', 0)
        d['extraSpell']          = d.pop('extra_spell', None)
        d['extraSpellType']      = d.pop('extra_spell_type', None)
        d['extraSpellTypeCount'] = d.pop('extra_spell_type_count', 0)
        d['extraTal']   = d.pop('extra_tal', 0)
        d['extraPer']   = d.pop('extra_per', 0)
        races[nome] = d

    # Kits
    kits      = {}
    kit_equip = {}
    for r in conn.execute("SELECT * FROM kits ORDER BY nome").fetchall():
        kid  = r['id']
        nome = r['nome']
        items = [
            {'n': i['nome'], 'd': i['descricao'], 'prof': i['prof']}
            for i in conn.execute(
                "SELECT nome,descricao,prof FROM kit_items WHERE kit_id=?", (kid,)
            ).fetchall()
        ]
        extras = [e['item_nome'] for e in conn.execute(
            "SELECT item_nome FROM kit_extras WHERE kit_id=?", (kid,)
        ).fetchall()]
        skill_bonuses = {
            s['skill_nome']: s['bonus']
            for s in conn.execute(
                "SELECT skill_nome,bonus FROM kit_skill_bonuses WHERE kit_id=?", (kid,)
            ).fetchall()
        }
        vantagens = [v['skill_nome'] for v in conn.execute(
            "SELECT skill_nome FROM kit_vantagens WHERE kit_id=?", (kid,)
        ).fetchall()]

        kits[nome] = {'items': items, 'extras': extras}
        kit_equip[nome] = {
            'db': r['db_bonus'], 'skills': skill_bonuses,
            'vantagens': vantagens, 'items': items,
        }

    # Perícias
    skills = [
        {'n': r['nome'], 'a': r['atributo']}
        for r in conn.execute("SELECT nome,atributo FROM skills ORDER BY nome").fetchall()
    ]

    # Idiomas
    languages = [r['nome'] for r in conn.execute("SELECT nome FROM languages ORDER BY nome").fetchall()]

    # RACE_LANGS
    race_langs = {}
    for r in conn.execute("SELECT * FROM races ORDER BY nome").fetchall():
        rid  = r['id']
        nome = r['nome']
        fixos = [x['lang'] for x in conn.execute(
            "SELECT lang FROM race_langs WHERE race_id=? AND tipo='fixo'", (rid,)
        ).fetchall()]
        extras_row = conn.execute(
            "SELECT lang FROM race_langs WHERE race_id=? AND tipo='extras_count'", (rid,)
        ).fetchone()
        extras = int(extras_row['lang']) if extras_row else 0
        race_langs[nome] = {'fixos': fixos, 'extras': extras}

    # TRAIT_BONUSES
    trait_bonuses = {
        r['trait_nome']: {
            'db': r['db'], 'lmt': r['lmt'], 'mana': r['mana'], 'label': r['label']
        }
        for r in conn.execute("SELECT * FROM trait_bonuses").fetchall()
    }

    # TALENT_STAT_BONUSES
    talent_stat_bonuses = {
        r['talent_nome']: {
            'cd': r['cd'], 'mana': r['mana'], 'vida': r['vida'],
            'lmt': r['lmt'], 'label': r['label']
        }
        for r in conn.execute("SELECT * FROM talent_stat_bonuses").fetchall()
    }

    # TALENT_VANTAGENS
    talent_vantagens = {}
    for r in conn.execute("SELECT talent_nome,skill_nome FROM talent_vantagens ORDER BY talent_nome").fetchall():
        talent_vantagens.setdefault(r['talent_nome'], []).append(r['skill_nome'])

    # RACIAL_VANTAGENS
    racial_vantagens = {}
    for r in conn.execute("SELECT trait_nome,skill_nome FROM racial_vantagens ORDER BY trait_nome").fetchall():
        racial_vantagens.setdefault(r['trait_nome'], []).append(r['skill_nome'])

    # TALENT_PREREQS
    talent_prereqs = {}
    for r in conn.execute("SELECT * FROM talent_prereqs").fetchall():
        d = {'label': r['label']}
        if r['attr']:
            d['attr'] = r['attr']
            d['min']  = r['min_val']
        if r['pacto']:
            d['pacto'] = True
        talent_prereqs[r['talent_nome']] = d

    # FAUNO_ASPECTOS
    fauno_aspectos = {
        r['nome']: {'label': r['label'], 'ativo': r['ativo'], 'desc': r['desc']}
        for r in conn.execute("SELECT * FROM fauno_aspectos ORDER BY nome").fetchall()
    }

    # RACIAL_DATA — Dados Raciais do Livro (Capítulo VI)
    racial_data = {}
    for r in conn.execute(
        """SELECT rc.nome, rd.altura, rd.peso_medio, rd.expectativa_vida,
                  rd.movimento, rd.idiomas_nativos
           FROM racial_data rd
           JOIN races rc ON rc.id = rd.race_id
           ORDER BY rc.nome"""
    ).fetchall():
        racial_data[r['nome']] = {
            'altura':           r['altura'],
            'peso_medio':       r['peso_medio'],
            'expectativa_vida': r['expectativa_vida'],
            'movimento':        r['movimento'],
            'idiomas_nativos':  r['idiomas_nativos'],
        }

    # UPGRADES — Capítulo X
    upgrades = [dict(r) for r in conn.execute(
        "SELECT nome,descricao,custo,max_compras,tipo,nivel_magico FROM upgrades ORDER BY tipo,custo"
    ).fetchall()]

    # ENTITIES — Entidades e Divindades
    entities = [dict(r) for r in conn.execute(
        "SELECT nome,tipo,elemento,titulo,descricao,efeito_nome,efeito FROM entities ORDER BY tipo,nome"
    ).fetchall()]

    conn.close()

    return {
        'magic_levels':       magic_levels,
        'spells':             spells,
        'talents':            talents,
        'classes':            classes,
        'races':              races,
        'kits':               kits,
        'kit_equip_bonuses':  kit_equip,
        'skills':             skills,
        'languages':          languages,
        'race_langs':         race_langs,
        'trait_bonuses':      trait_bonuses,
        'talent_stat_bonuses':talent_stat_bonuses,
        'talent_vantagens':   talent_vantagens,
        'racial_vantagens':   racial_vantagens,
        'talent_prereqs':     talent_prereqs,
        'fauno_aspectos':     fauno_aspectos,
        'racial_data':        racial_data,
        'upgrades':           upgrades,
        'entities':           entities,
    }


# ─────────────────────────────────────────────────────────
# HTTP REQUEST HANDLER
# ─────────────────────────────────────────────────────────

class RPGHandler(BaseHTTPRequestHandler):

    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} {fmt % args}")

    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False, indent=None).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-cache')
        self.end_headers()
        self.wfile.write(body)

    def send_html(self, path):
        try:
            with open(path, 'rb') as f:
                body = f.read()
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except FileNotFoundError:
            self.send_error(404, f"Arquivo não encontrado: {path}")

    def do_GET(self):
        parsed = urlparse(self.path)
        path   = parsed.path.rstrip('/')

        if path in ('', '/'):
            self.send_html(INDEX_PATH)

        elif path in ('/ficha', '/ficha/'):
            self.send_html(HTML_PATH)

        elif path in STATIC_PAGES:
            fp = STATIC_PAGES[path]
            if os.path.exists(fp):
                self.send_html(fp)
            else:
                self.send_error(404, f'Página em construção: {path}')

        elif path == '/gerador':
            self.send_error(404, 'Gerador de Criaturas — Em breve!')

        elif path == '/api/all':
            try:
                data = load_all_data()
                self.send_json(data)
            except Exception as e:
                self.send_json({'error': str(e)}, 500)

        elif path == '/api/spells':
            try:
                conn = get_db()
                spells = [dict(r) for r in conn.execute(
                    "SELECT * FROM spells ORDER BY nivel_magia, tipo, nome"
                ).fetchall()]
                conn.close()
                self.send_json(spells)
            except Exception as e:
                self.send_json({'error': str(e)}, 500)

        elif path == '/api/magic_levels':
            try:
                conn = get_db()
                levels = [dict(r) for r in conn.execute(
                    "SELECT * FROM magic_levels ORDER BY nivel"
                ).fetchall()]
                conn.close()
                self.send_json(levels)
            except Exception as e:
                self.send_json({'error': str(e)}, 500)

        elif path == '/api/classes':
            try:
                data = load_all_data()
                self.send_json(data['classes'])
            except Exception as e:
                self.send_json({'error': str(e)}, 500)

        elif path == '/api/status':
            conn = get_db()
            counts = {}
            for tbl in ['spells','talents','classes','races','skills','kits','magic_levels']:
                counts[tbl] = conn.execute(f"SELECT COUNT(*) FROM {tbl}").fetchone()[0]
            conn.close()
            self.send_json({'status': 'online', 'counts': counts})

        elif path.startswith('/img/'):
            decoded = unquote(path)
            parts = [p for p in decoded.split('/') if p and p != '..']
            file_path = os.path.join(BASE_DIR, *parts)
            real_path = os.path.realpath(file_path)
            real_base = os.path.realpath(BASE_DIR)
            if not real_path.startswith(real_base + os.sep):
                self.send_error(403, "Acesso negado")
                return
            if os.path.exists(real_path) and os.path.isfile(real_path):
                ext = os.path.splitext(real_path)[1].lower()
                mime = {'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.gif':'image/gif','.webp':'image/webp'}.get(ext,'application/octet-stream')
                with open(real_path, 'rb') as f:
                    body = f.read()
                self.send_response(200)
                self.send_header('Content-Type', mime)
                self.send_header('Content-Length', str(len(body)))
                self.send_header('Cache-Control', 'public, max-age=3600')
                self.end_headers()
                self.wfile.write(body)
            else:
                self.send_error(404, "Imagem não encontrada")

        else:
            self.send_error(404, "Rota não encontrada")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.end_headers()


# ─────────────────────────────────────────────────────────
# ENTRY POINT
# ─────────────────────────────────────────────────────────

def main():
    if not os.path.exists(DB_PATH):
        print(f"[ERRO] Banco de dados não encontrado: {DB_PATH}")
        print("Execute primeiro: python create_db.py")
        sys.exit(1)

    if not os.path.exists(INDEX_PATH):
        print(f"[AVISO] index.html nao encontrado: {INDEX_PATH}")
    if not os.path.exists(HTML_PATH):
        print(f"[AVISO] Ficha HTML nao encontrada: {HTML_PATH}")

    print(f"""
╔══════════════════════════════════════════════════════╗
║       RPG Reino Magico — Servidor                   ║
╠══════════════════════════════════════════════════════╣
║  Site:    http://localhost:{PORT}                       ║
║  Ficha:   http://localhost:{PORT}/ficha                 ║
║  API:     http://localhost:{PORT}/api/all               ║
║  Status:  http://localhost:{PORT}/api/status            ║
║  Para encerrar: Ctrl+C                              ║
╚══════════════════════════════════════════════════════╝
""")

    server = HTTPServer(('localhost', PORT), RPGHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado.")


if __name__ == '__main__':
    main()

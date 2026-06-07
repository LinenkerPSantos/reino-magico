"""
Cria o banco de dados SQLite para o RPG Reino Mágico.
Magias carregadas de 'Lista de Magia Atualizado.xlsx' (raiz do projeto).
Talentos extraídos do HTML de backup.
Execute: python create_db.py
"""

import sqlite3
import json
import re
import os
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

try:
    import openpyxl
except ImportError:
    sys.exit("Erro: instale openpyxl com  pip install openpyxl")

BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
PROJ_DIR  = os.path.dirname(BASE_DIR)
DB_DIR    = os.path.join(BASE_DIR, 'data')
DB_PATH   = os.path.join(DB_DIR, 'rpg.db')
XLSX_PATH = os.path.join(PROJ_DIR, 'Lista de Magia Atualizado.xlsx')

# HTML de backup (só usado para extrair talentos)
_BACKUP   = os.path.join(BASE_DIR, 'Criador_de_Personagem_Reino_Magico_BACKUP.html')
_MAIN     = os.path.join(BASE_DIR, 'Criador_de_Personagem_Reino_Magico.html')
HTML_PATH = _BACKUP if os.path.exists(_BACKUP) else _MAIN

LEVEL_MAP = {
    "Truques": 1, "Básicas": 2, "Menor": 3, "Elite": 4,
    "Maior": 5, "Avançado": 6, "Lendário": 7, "Divino": 8, "Secreto": 9,
}

# ─────────────────────────────────────────────────────────
# HELPER
# ─────────────────────────────────────────────────────────

def extract_json_array(html: str, var_name: str):
    """Extrai um array JSON atribuído a uma variável JS."""
    pattern = rf'const {var_name}\s*=\s*(\[.*?\]);'
    m = re.search(pattern, html, re.DOTALL)
    if not m:
        print(f"  [AVISO] Variável {var_name} não encontrada no HTML.")
        return []
    return json.loads(m.group(1))


def _cell_str(cell) -> str:
    v = cell.value
    return "" if v is None else str(v).strip()


def _cell_int(cell) -> int:
    v = cell.value
    if v is None:
        return 0
    try:
        return int(v)
    except (ValueError, TypeError):
        s = str(v).strip()
        return int(s) if s.isdigit() else 0


def load_spells_from_xlsx(path: str) -> list:
    """Lê magias do xlsx e retorna lista de dicts prontos para INSERT."""
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb.active
    rows = list(ws.iter_rows())
    wb.close()
    spells = []
    for row in rows[1:]:      # pula cabeçalho
        if not row or row[0].value is None:
            continue
        nome = _cell_str(row[0])
        if not nome:
            continue
        nivel_str = _cell_str(row[2]) if len(row) > 2 else ""
        spells.append({
            "nome":       nome,
            "tipo":       _cell_str(row[1])  if len(row) > 1  else "",
            "nivel_magia":LEVEL_MAP.get(nivel_str, 3),
            "custo_mana": _cell_int(row[3])  if len(row) > 3  else 0,
            "execucao":   _cell_str(row[4])  if len(row) > 4  else "",
            "alcance":    _cell_str(row[5])  if len(row) > 5  else "",
            "categoria":  _cell_str(row[6])  if len(row) > 6  else "",
            "alvo":       _cell_str(row[7])  if len(row) > 7  else "",
            "duracao":    _cell_str(row[8])  if len(row) > 8  else "",
            "natureza":   _cell_str(row[9])  if len(row) > 9  else "",
            "prereq":     _cell_str(row[10]) if len(row) > 10 else "",
            "descricao":  _cell_str(row[11]) if len(row) > 11 else "",
        })
    return spells


# ─────────────────────────────────────────────────────────
# DADOS ESTÁTICOS (extraídos do HTML)
# ─────────────────────────────────────────────────────────

MAGIC_LEVELS = [
    (1, 'Truques',   0,  '#4a9a5a'),
    (2, 'Básicas',   2,  '#7ab54a'),
    (3, 'Menor',     4,  '#a8c84a'),
    (4, 'Elite',     6,  '#c9c227'),
    (5, 'Maior',     8,  '#c9a227'),
    (6, 'Avançado',  10, '#e08820'),
    (7, 'Lendário',  12, '#e07028'),
    (8, 'Divino',    14, '#e05828'),
    (9, 'Secreto',   16, '#e08898'),
]

CLASSES = {
    'Alquimista': {
        'atrib': 'PRE', 'vida': 8, 'mana': 6,
        'hab1': 'Homunculogia',
        'h1': 'O Alquimista pode criar um homúnculo mágico que age como seu assistente. Ele obedece a comandos, age no mesmo turno do criador, carrega objetos pequenos, explora ambientes e interage com mecanismos simples. Pode ser invocado como Ação Padrão até duas vezes por descanso curto, sem custo de mana. O homúnculo é frágil — qualquer dano o desfaz imediatamente.',
        'hab2': 'Olho Mágico',
        'h2': 'Como Ação Padrão, o Alquimista conecta seus sentidos ao homúnculo, enxergando e ouvindo tudo que ele percebe. Enquanto utiliza essa habilidade, o Alquimista fica vulnerável e não pode realizar outras ações. A conexão pode ser encerrada a qualquer momento como Ação Livre.',
        'armas': 'Nenhuma',
        'pericias': ['Investigação','Percepção','História','Prestidigitação'],
        'spellAccess': ['Truque','Magias Iniciais'],
        'extraSlots': 0, 'extraSlotType': None, 'espiritualista': False,
    },
    'Assassino': {
        'atrib': 'DES', 'vida': 8, 'mana': 4,
        'hab1': 'Salto das Sombras',
        'h1': 'Ataques realizados enquanto o Assassino estiver em condição furtiva causam +1d6 de dano adicional.',
        'hab2': 'Sede de Sangue',
        'h2': 'Ao realizar um acerto crítico, o alvo sofre automaticamente a condição sangrando por 3 turnos, perdendo 1d8 de Vida no início de cada um de seus turnos.',
        'armas': 'Armas Táticas',
        'pericias': ['Furtividade','Prestidigitação','Reflexo','Luta'],
        'spellAccess': ['Truque','Magias Iniciais'],
        'extraSlots': 0, 'extraSlotType': None, 'espiritualista': False,
    },
    'Bardo': {
        'atrib': 'PRE', 'vida': 6, 'mana': 8,
        'hab1': 'Piada Infame',
        'h1': 'Uma vez por Descanso Longo, durante o combate, o Bardo lança sua piada. Todas as criaturas conscientes que possam compreendê-lo realizam uma salvaguarda de Vontade contra a CD do Bardo. Em caso de falha, a criatura é deslocada para o último lugar na ordem de iniciativa.',
        'hab2': 'Inspiração Bárdica',
        'h2': 'Uma vez por Descanso Longo, o Bardo concede a cada aliado visível 1d6 de dado de inspiração, que pode ser somado a qualquer teste de sua escolha após a rolagem.',
        'armas': 'Nenhuma',
        'pericias': ['Persuasão','Enganação','Carisma','Investigação'],
        'spellAccess': ['Truque','Magias Iniciais'],
        'extraSlots': 0, 'extraSlotType': None, 'espiritualista': False,
    },
    'Bruxo': {
        'atrib': 'INT', 'vida': 6, 'mana': 8,
        'hab1': 'Pacto Sobrenatural',
        'h1': 'Bruxos possuem acesso às magias do tipo Pacto. O Bruxo deve escolher uma entidade patrona durante a criação. Tem vantagem ao conjurar magias da Natureza Caótica. Em locais sagrados, fica Desorientado.',
        'hab2': 'Sussurro da Entidade',
        'h2': 'Uma vez por rodada, como Ação Livre, o Bruxo gasta 1 PM e escolhe um alvo visível. O alvo realiza uma salvaguarda de Vontade; em caso de falha, sofre Desvantagem no próximo teste ou ataque.',
        'armas': 'Armas Mágicas',
        'pericias': ['Intimidação','Enganação','Iniciativa','Persuasão'],
        'spellAccess': ['Truque','Magias Iniciais','Magias de Pacto'],
        'extraSlots': 0, 'extraSlotType': None, 'espiritualista': False,
    },
    'Caçador': {
        'atrib': 'DES', 'vida': 8, 'mana': 4,
        'hab1': 'Alvo na Mira',
        'h1': 'O primeiro ataque realizado pelo Caçador em cada combate possui +1 na margem de crítico. Se realizado antes do alvo agir na iniciativa, o bônus aumenta para +2.',
        'hab2': 'Instinto de Caçador',
        'h2': 'O Caçador não sofre penalidades em terrenos difíceis ou arenosos. Recebe +2 em todos os testes de Furtividade.',
        'armas': 'Armas de Disparo',
        'pericias': ['Pontaria','Sobrevivência','Furtividade','Atletismo'],
        'spellAccess': ['Truque','Magias Iniciais'],
        'extraSlots': 0, 'extraSlotType': None, 'espiritualista': False,
    },
    'Cavaleiro': {
        'atrib': 'VIT', 'vida': 10, 'mana': 4,
        'hab1': 'Investida do Cavaleiro',
        'h1': 'No primeiro turno de cada combate, o Cavaleiro pode realizar uma investida com Ação de Movimento adicional e o primeiro ataque com vantagem.',
        'hab2': 'Juramento de Cavaleiro',
        'h2': 'O Cavaleiro designa um inimigo como alvo do juramento. Recebe Vantagem em ataques e salvaguardas contra esse inimigo. Pode ser ativado uma vez por descanso.',
        'armas': 'Armas Táticas, Armadura Leve, Pesada e Escudos',
        'pericias': ['Reflexo','Carisma','Vontade','Intimidação'],
        'spellAccess': ['Truque','Magias Iniciais'],
        'extraSlots': 0, 'extraSlotType': None, 'espiritualista': False,
    },
    'Espiritualista': {
        'atrib': 'PRE', 'vida': 8, 'mana': 10,
        'hab1': 'Vínculo Espiritual',
        'h1': 'O Espiritualista escolhe uma entidade Elemental (acesso a Magias Antigas) ou Sagrada (acesso a Magias Sagradas) durante a criação.',
        'hab2': 'Maré de Mana',
        'h2': 'Uma vez por Descanso Longo, como Ação Padrão, restaura PM igual ao modificador de Presença a todos os aliados em raio de 9 metros.',
        'armas': 'Armas Mágicas',
        'pericias': ['Carisma','Vontade','Foco','Tenacidade'],
        'spellAccess': ['Truque','Magias Iniciais'],
        'extraSlots': 0, 'extraSlotType': None, 'espiritualista': True,
    },
    'Guardião': {
        'atrib': 'VIT', 'vida': 12, 'mana': 6,
        'hab1': 'Pilares de Escudos',
        'h1': 'Uma vez por descanso, o Guardião cria uma barreira colossal que concede Cobertura Total à sua frente. Dura até o início do próximo turno.',
        'hab2': 'Grande Protetor',
        'h2': '+1 permanente na Defesa Básica. Quando um aliado adjacente sofrer um ataque, pode usar Reação para absorver metade do dano.',
        'armas': 'Armadura Pesada e Escudo',
        'pericias': ['Tenacidade','Vontade','Iniciativa','Sobrevivência'],
        'spellAccess': ['Truque','Magias Iniciais'],
        'extraSlots': 0, 'extraSlotType': None, 'espiritualista': False,
    },
    'Guerreiro': {
        'atrib': 'FOR', 'vida': 10, 'mana': 4,
        'hab1': 'Golpe Brutal',
        'h1': 'Uma vez por combate, ao acertar um ataque corpo a corpo, declara Golpe Brutal. Causa dano adicional igual à Força. Se d20 ≥ 18, alvo faz Tenacidade ou fica Atordoado.',
        'hab2': 'Adrenalina de Batalha',
        'h2': 'Com metade ou menos da Vida máxima, recebe +2 nas rolagens de ataque corpo a corpo.',
        'armas': 'Armas Táticas, Armadura Leve e Escudos',
        'pericias': ['Luta','Atletismo','Intimidação','Iniciativa'],
        'spellAccess': ['Truque','Magias Iniciais'],
        'extraSlots': 0, 'extraSlotType': None, 'espiritualista': False,
    },
    'Mago': {
        'atrib': 'INT', 'vida': 6, 'mana': 10,
        'hab1': 'Sobrecarga Arcânica',
        'h1': 'O Mago pode aumentar o Limite de Mana por Turno em valor igual ao seu Intelecto. A próxima magia requer Ação Completa.',
        'hab2': 'Grimório Vivo',
        'h2': 'O Mago conhece 3 magias adicionais tipo Grimório. Esse bônus é permanente.',
        'armas': 'Armas Mágicas',
        'pericias': ['Foco','Percepção','História','Pontaria'],
        'spellAccess': ['Truque','Magias Iniciais','Magias de Grimório'],
        'extraSlots': 3, 'extraSlotType': 'Magias de Grimório', 'espiritualista': False,
    },
    'Monge': {
        'atrib': 'FOR', 'vida': 8, 'mana': 8,
        'hab1': 'Combo Marcial',
        'h1': 'Com arma do tipo manopla, ataques críticos causam dano triplicado.',
        'hab2': 'Fluxo de Chi',
        'h2': 'Acertos críticos geram 1 ponto de Chi (usável como mana). Armazena Chi máximo igual ao valor de Foco.',
        'armas': 'Armas Táticas e Mágicas',
        'pericias': ['Atletismo','Luta','Reflexo','Foco'],
        'spellAccess': ['Truque','Magias Iniciais'],
        'extraSlots': 0, 'extraSlotType': None, 'espiritualista': False,
    },
}

RACES = {
    'Anão': {
        'idiomas': 'Anão, Dracônico + 1 idioma.', 'b_mana': 0, 'b_attr_extra': 0,
        'extra_spell': None, 'extra_spell_type': None, 'extra_spell_type_count': 0,
        'extra_tal': 0, 'extra_per': 0, 'move': 7.5,
        'traits': [
            {'n': 'Resistência de Pedra', 'd': 'Vantagem em salvaguardas contra venenos e envenenamento.', 'bonus': None},
            {'n': 'Proficiência Inata', 'd': 'Proficiência com Armaduras Leves e Pesadas, independentemente da classe.', 'bonus': None},
            {'n': 'Filhos da Pedra', 'd': 'Vantagem em testes e Salvaguardas de Atletismo e Prestidigitação.', 'bonus': None},
            {'n': 'Visão de Mineiro', 'd': 'Enxerga em ambientes fechados escuros em até 18 metros.', 'bonus': None},
        ],
    },
    'Celestial': {
        'idiomas': 'Comum e Celestial + 1 idioma.', 'b_mana': 0, 'b_attr_extra': 0,
        'extra_spell': 'Voo Menor', 'extra_spell_type': None, 'extra_spell_type_count': 0,
        'extra_tal': 0, 'extra_per': 0, 'move': 9,
        'traits': [
            {'n': 'Afinidade Celestial', 'd': 'Pode aprender e usar magias do elemento Sagrado sem pactos.', 'bonus': None},
            {'n': 'Bênção dos Celestiais', 'd': 'Ao restaurar Vida de criatura por magia/habilidade, o alvo recupera +1d4 HP.', 'bonus': None},
            {'n': 'Asas Angelicais', 'd': 'Conhece a magia Voo Menor independentemente da classe.', 'bonus': 'Magia: Voo Menor'},
            {'n': 'Percepção Mágica', 'd': 'Sente usuários de magia em raio de 18m. Vantagem em Foco para detectar conjuradores.', 'bonus': None},
        ],
    },
    'Draconato': {
        'idiomas': 'Dracônico, Anão + 1 idioma.', 'b_mana': 0, 'b_attr_extra': 0,
        'extra_spell': None, 'extra_spell_type': None, 'extra_spell_type_count': 0,
        'extra_tal': 0, 'extra_per': 0, 'move': 9,
        'traits': [
            {'n': 'Resistência Elemental', 'd': 'Escolha um elemento (Fogo, Água, Terra, Vento ou Trovão). Resistência a danos desse elemento.', 'bonus': None},
            {'n': 'Presença Imponente', 'd': 'Vantagem em Intimidação e Carisma contra criaturas de tamanho igual ou menor.', 'bonus': None},
            {'n': 'Escamas Naturais', 'd': 'DB +1, mesmo sem armaduras.', 'bonus': 'DB +1'},
            {'n': 'Visão Dracônica', 'd': 'Enxerga perfeitamente na escuridão total, incluindo mágica.', 'bonus': None},
        ],
    },
    'Elfo': {
        'idiomas': 'Élfico, Arcano + 2 idiomas.', 'b_mana': 4, 'b_attr_extra': 0,
        'extra_spell': None, 'extra_spell_type': 'Magias Antigas', 'extra_spell_type_count': 1,
        'extra_tal': 0, 'extra_per': 0, 'move': 9,
        'traits': [
            {'n': 'Visão Élfica', 'd': 'Ignora penalidades de penumbra em até 18 metros.', 'bonus': None},
            {'n': 'Resistência Mental', 'd': 'Vantagem em Salvaguardas contra encantamentos, ilusões e sono mágico.', 'bonus': None},
            {'n': 'Afinidade Arcânica', 'd': 'Aprende uma magia adicional do tipo Antiga durante a criação.', 'bonus': '+1 Magia Antiga'},
            {'n': 'Abençoado pela Mana', 'd': 'Recebe +4 pontos de Mana adicionais.', 'bonus': 'Mana +4'},
        ],
    },
    'Fauno': {
        'idiomas': 'Comum e Silvestre + 1 idioma.', 'b_mana': 0, 'b_attr_extra': 0,
        'extra_spell': None, 'extra_spell_type': None, 'extra_spell_type_count': 0,
        'extra_tal': 0, 'extra_per': 0, 'move': 9,
        'traits': [
            {'n': 'Sentidos Aguçados', 'd': 'Vantagem em testes e Salvaguardas de Percepção.', 'bonus': None},
            {'n': 'Instinto Predatório', 'd': 'Vantagem em testes e Salvaguardas de Sobrevivência.', 'bonus': None},
            {'n': 'Garras Naturais', 'd': 'Ataques desarmados causam 1d6 de dano cortante.', 'bonus': None},
            {'n': 'Traços Bestiais', 'd': 'Uma vez por Descanso Curto, desperta instintos por 3 rodadas. Aspecto escolhido na criação: Urso (resistência física), Lobo (+1 margem crítico), Raposa (vantagem Enganação), Javali (+2 ataques corpo), Guaxinim (+2 ataques mágicos), Falcão (+2 distância).', 'bonus': None},
        ],
    },
    'Feérico': {
        'idiomas': 'Silvestre, Élfico, Feérico, Primordial + 1 idioma.', 'b_mana': 0, 'b_attr_extra': 0,
        'extra_spell': 'Ilusão Menor', 'extra_spell_type': None, 'extra_spell_type_count': 0,
        'extra_tal': 0, 'extra_per': 0, 'move': 7.5,
        'traits': [
            {'n': 'Passos Silenciosos', 'd': 'Vantagem em testes e Salvaguardas de Furtividade.', 'bonus': None},
            {'n': 'Mente Feérica', 'd': 'Vantagem em testes e Salvaguardas de Investigação e Persuasão.', 'bonus': None},
            {'n': 'Afinidade Ilusória', 'd': 'Aprende a magia Ilusão Menor durante a criação.', 'bonus': 'Magia: Ilusão Menor'},
            {'n': 'Pequenino', 'd': 'Deslocamento 7,5m. Não provoca ataques de oportunidade ao se mover.', 'bonus': None},
        ],
    },
    'Humano': {
        'idiomas': 'Comum + 1 idioma.', 'b_mana': 0, 'b_attr_extra': 1,
        'extra_spell': None, 'extra_spell_type': None, 'extra_spell_type_count': 0,
        'extra_tal': 1, 'extra_per': 2, 'move': 9,
        'traits': [
            {'n': 'Versatilidade', 'd': '+1 ponto de atributo durante a criação.', 'bonus': 'Atributos +1 ponto'},
            {'n': 'Proficiência Natural', 'd': 'Inicia com um talento ou proficiência adicional.', 'bonus': '+1 Talento'},
            {'n': 'Mestre em Perícia', 'd': 'Escolha duas perícias adicionais para treinamento.', 'bonus': '+2 Perícias'},
            {'n': 'Adaptabilidade Humana', 'd': 'Vantagem em testes de Iniciativa.', 'bonus': None},
        ],
    },
    'Híbrido': {
        'idiomas': 'Dois idiomas das raças de origem + 1 idioma adicional.', 'b_mana': 0, 'b_attr_extra': 0,
        'extra_spell': None, 'extra_spell_type': None, 'extra_spell_type_count': 0,
        'extra_tal': 0, 'extra_per': 1, 'move': 9,
        'traits': [
            {'n': 'Herança Dupla', 'd': 'Escolha duas raças como origem (exceto Maculado e Celestial). Recebe um traço racial de cada uma.', 'bonus': '+2 Traços de outras raças'},
            {'n': 'Sangue Mestiço', 'd': 'Vantagem em testes de Salvaguarda de Vontade.', 'bonus': None},
            {'n': 'Identidade Forjada', 'd': 'Recebe uma perícia treinada adicional.', 'bonus': '+1 Perícia'},
        ],
    },
    'Infernal': {
        'idiomas': 'Infernal + 1 idioma.', 'b_mana': 0, 'b_attr_extra': 0,
        'extra_spell': None, 'extra_spell_type': None, 'extra_spell_type_count': 0,
        'extra_tal': 0, 'extra_per': 0, 'move': 9,
        'traits': [
            {'n': 'Resistência ao Fogo', 'd': 'Resistência a dano de Fogo.', 'bonus': None},
            {'n': 'Memória das Cinzas', 'd': 'Vantagem em testes de História.', 'bonus': None},
            {'n': 'Herança Vermelha', 'd': 'Proficiência com Armas Táticas e Armaduras Leves, independentemente da classe.', 'bonus': None},
            {'n': 'Recuperação Ígnea', 'd': 'Ao concluir Descanso Curto, recupera 1d4 adicionais de Vida ou Mana à escolha.', 'bonus': None},
        ],
    },
    'Maculado': {
        'idiomas': 'Infernal ou Raça de Origem + 1 idioma.', 'b_mana': 0, 'b_attr_extra': 0,
        'extra_spell': None, 'extra_spell_type': None, 'extra_spell_type_count': 0,
        'extra_tal': 0, 'extra_per': 0, 'move': 9,
        'traits': [
            {'n': 'Herança Ancestral', 'd': 'Escolha um traço racial de outra raça (exceto Híbrido e Celestial).', 'bonus': '+1 Traço de outra raça'},
            {'n': 'Fluxo Arcano', 'd': 'Aumenta em +2 o limite de Mana por turno.', 'bonus': 'LMT +2'},
            {'n': 'Sentidos Sombrios', 'd': 'Enxerga na escuridão total, inclusive mágica, sem penalidades.', 'bonus': None},
            {'n': 'Marcados Pelo Vazio', 'd': 'Vantagem em Salvaguardas contra elemento Negativo. Não pode firmar pactos com entidades do elemento Sagrado.', 'bonus': None},
        ],
    },
}

KITS = {
    'Guerreiro': {
        'db': 3,
        'skills': {'Sobrevivência': 2},
        'vantagens': ['Sobrevivência'],
        'items': [
            {'n': 'Espada Curta', 'd': '1d6 | Leve, Finesse', 'prof': None},
            {'n': 'Adaga', 'd': '1d4 | Versátil, Arremesso 9m, Leve', 'prof': None},
            {'n': 'Escudo de Metal', 'd': 'DEF +2', 'prof': 'Escudo'},
            {'n': 'Chapéu de Palha', 'd': 'Vantagem em Sobrevivência', 'prof': None},
            {'n': 'Gibão', 'd': 'DEF +1', 'prof': 'Armadura Leve'},
            {'n': 'Botas', 'd': '+2 em Sobrevivência', 'prof': None},
        ],
        'extras': ['Mochila','Cobertor','Cantil','Saco de Dormir','Rações (7 dias)','Poção de Cura Menor','Kit de Pesca'],
    },
    'Conjurador': {
        'db': 2,
        'skills': {'Sobrevivência': 2},
        'vantagens': [],
        'items': [
            {'n': 'Varinha', 'd': '1d4 | +2 nas rolagens de Ataque Mágico', 'prof': 'Armas Mágicas'},
            {'n': 'Adaga', 'd': '1d4 | Versátil, Arremesso 9m, Leve', 'prof': None},
            {'n': 'Componentes Arcanos', 'd': 'Bolsa com cristais e poeiras do pacto', 'prof': None},
            {'n': 'Chapéu do Mago', 'd': 'Absorve 1 dano mágico', 'prof': None},
            {'n': 'Roupa de Aventureiro', 'd': '+2 em Esquiva', 'prof': None},
            {'n': 'Botas', 'd': '+2 em Sobrevivência', 'prof': None},
        ],
        'extras': ['Mochila','Cobertor','Cantil','Saco de Dormir','Rações (7 dias)','Poção de Mana Menor','Kit de Escrita'],
    },
    'Explorador': {
        'db': 2,
        'skills': {'Sobrevivência': 2},
        'vantagens': ['Carisma'],
        'items': [
            {'n': 'Martelo de Mão', 'd': '1d6 | Leve, Versátil, Arremesso 6m', 'prof': None},
            {'n': 'Adaga', 'd': '1d4 | Versátil, Arremesso 9m, Leve', 'prof': None},
            {'n': 'Fogo Alquímico', 'd': '1d6 Fogo + Em Chamas', 'prof': None},
            {'n': 'Chapéu de Menestrel', 'd': 'Vantagem em Carisma', 'prof': None},
            {'n': 'Roupa de Aventureiro', 'd': '+2 em Esquiva', 'prof': None},
            {'n': 'Botas', 'd': '+2 em Sobrevivência', 'prof': None},
        ],
        'extras': ['Mochila','Cobertor','Cantil','Saco de Dormir','Rações (7 dias)','Antídoto','Kit de Herbalismo'],
    },
    'Infiltrador': {
        'db': 0,
        'skills': {'Furtividade': 4},
        'vantagens': [],
        'items': [
            {'n': 'Espada Curta', 'd': '1d6 | Leve, Finesse', 'prof': None},
            {'n': 'Adaga', 'd': '1d4 | Versátil, Arremesso 9m, Leve', 'prof': None},
            {'n': 'Bomba de Fumaça', 'd': 'Nuvem em raio 3m por 3 rodadas', 'prof': None},
            {'n': 'Capuz do Assassino', 'd': '+1 Furtividade', 'prof': None},
            {'n': 'Manto do Gatuno', 'd': '+2 Furtividade', 'prof': None},
            {'n': 'Sandálias do Ladino', 'd': '+1 Furtividade', 'prof': None},
        ],
        'extras': ['Mochila','Cobertor','Cantil','Saco de Dormir','Rações (7 dias)','Bomba de Fumaça','Kit de Ferramentas de Ladrão'],
    },
    'Atirador': {
        'db': 0,
        'skills': {'Furtividade': 2},
        'vantagens': [],
        'items': [
            {'n': 'Arco Curto', 'd': '1d6 | Munição (flechas)', 'prof': 'Armas de Disparo'},
            {'n': 'Adaga', 'd': '1d4 | Versátil, Arremesso 9m, Leve', 'prof': None},
            {'n': 'Flechas (20)', 'd': 'Pacote com 20 unidades', 'prof': None},
            {'n': 'Chapéu do Caçador', 'd': '+1 rolagens de ataque à distância', 'prof': None},
            {'n': 'Manto do Gatuno', 'd': '+2 Furtividade', 'prof': None},
            {'n': 'Coturnos do Caçador', 'd': '+1,5m de deslocamento', 'prof': None},
        ],
        'extras': ['Mochila','Cobertor','Cantil','Saco de Dormir','Rações (7 dias)','Armadilhas de Caça (2)','Kit de Cartografia'],
    },
}

SKILLS = [
    {'n': 'Atletismo',      'a': 'FOR'},
    {'n': 'Carisma',        'a': 'PRE'},
    {'n': 'Enganação',      'a': 'PRE'},
    {'n': 'Foco',           'a': 'INT'},
    {'n': 'Furtividade',    'a': 'DES'},
    {'n': 'História',       'a': 'INT'},
    {'n': 'Iniciativa',     'a': 'DES'},
    {'n': 'Intimidação',    'a': 'PRE'},
    {'n': 'Investigação',   'a': 'INT'},
    {'n': 'Luta',           'a': 'FOR'},
    {'n': 'Percepção',      'a': 'PRE'},
    {'n': 'Persuasão',      'a': 'INT'},
    {'n': 'Pontaria',       'a': 'DES'},
    {'n': 'Prestidigitação','a': 'DES'},
    {'n': 'Reflexo',        'a': 'DES'},
    {'n': 'Sobrevivência',  'a': 'VIT'},
    {'n': 'Tenacidade',     'a': 'VIT'},
    {'n': 'Vontade',        'a': 'INT'},
]

RACE_LANGS = {
    'Anão':      {'fixos': ['Anão', 'Dracônico'],                          'extras': 1},
    'Celestial': {'fixos': ['Celestial'],                                   'extras': 1},
    'Draconato': {'fixos': ['Dracônico', 'Anão'],                          'extras': 1},
    'Elfo':      {'fixos': ['Élfico', 'Arcano'],                           'extras': 2},
    'Fauno':     {'fixos': ['Silvestre'],                                   'extras': 1},
    'Feérico':   {'fixos': ['Silvestre', 'Élfico', 'Feérico', 'Primordial'],'extras': 1},
    'Humano':    {'fixos': [],                                              'extras': 1},
    'Híbrido':   {'fixos': [],                                              'extras': 3},
    'Infernal':  {'fixos': ['Infernal'],                                    'extras': 1},
    'Maculado':  {'fixos': [],                                              'extras': 2},
}

ENTITIES = [
    # ── ENTIDADES ELEMENTAIS ──────────────────────────────
    {
        'nome': 'O Afogado',
        'tipo': 'Elemental',
        'elemento': 'Água',
        'titulo': 'Senhor das Águas Profundas',
        'descricao': 'Uma entidade antiga que dorme nos abismos oceânicos. Sua presença traz calmaria e tempestades com igual indiferença.',
        'efeito_nome': 'Abraço das Profundezas',
        'efeito': 'Vantagem em salvaguardas contra Fogo e calor extremo. +2 nas rolagens de ataque com magias de Água.',
    },
    {
        'nome': 'Rei das Montanhas',
        'tipo': 'Elemental',
        'elemento': 'Terra',
        'titulo': 'Guardião dos Ossos do Mundo',
        'descricao': 'Antiga inteligência que habita o coração de toda pedra e mineral. Paciente como a rocha, implacável como uma avalanche.',
        'efeito_nome': 'Firmeza da Pedra',
        'efeito': '+1 permanente na Defesa Básica. +2 nas rolagens de ataque com magias de Terra.',
    },
    {
        'nome': 'A Dama de Vermelho',
        'tipo': 'Elemental',
        'elemento': 'Fogo',
        'titulo': 'Senhora das Chamas Eternas',
        'descricao': 'Entidade de paixão e destruição, cujo calor nunca diminui. Ela abraça os que a honram com fervor tão intenso quanto suas próprias chamas.',
        'efeito_nome': 'Chama Implacável',
        'efeito': 'Magias de Fogo causam +1d4 de dano adicional. Vantagem em salvaguardas contra frio extremo.',
    },
    {
        'nome': 'O Andarilho',
        'tipo': 'Elemental',
        'elemento': 'Vento',
        'titulo': 'O Eterno Errante',
        'descricao': 'Espírito livre que percorre todos os cantos do mundo, levando histórias e segredos de ponta a ponta. Nunca fica no mesmo lugar por muito tempo.',
        'efeito_nome': 'Sopro Livre',
        'efeito': 'Deslocamento aumenta em +3 metros. Vantagem em testes de Furtividade em campo aberto.',
    },
    {
        'nome': 'O Trovador',
        'tipo': 'Elemental',
        'elemento': 'Trovão',
        'titulo': 'Voz das Tempestades',
        'descricao': 'A mais jovem das entidades elementais, sua existência é puro poder bruto. Ele não fala — apenas troveja.',
        'efeito_nome': 'Eco do Trovão',
        'efeito': 'Magias de Trovão ignoram 2 pontos de resistência elemental. Críticos com magias de Trovão atordoam o alvo por 1 turno.',
    },
    # ── DIVINDADES CAÓTICAS ───────────────────────────────
    {
        'nome': 'A Dama dos Desejos',
        'tipo': 'Caótica',
        'elemento': 'Caótico',
        'titulo': 'Tecelã de Contratos e Ilusões',
        'descricao': 'Uma entidade primordial da corrupção que existe nos desejos não ditos. Ela nunca mente — apenas molda a verdade.',
        'efeito_nome': 'Fio dos Desejos',
        'efeito': 'Vantagem em Enganação e Persuasão. Uma vez por Descanso Longo, pode lançar uma ilusão perfeita que engana todos os sentidos por 1 minuto.',
    },
    {
        'nome': 'O Mestre do Banquete',
        'tipo': 'Caótica',
        'elemento': 'Caótico',
        'titulo': 'Deus do Excesso e da Devora',
        'descricao': 'Um primordial que se alimenta do excesso em todas as suas formas — prazer, dor, ambição. Seu domínio é o do insaciável.',
        'efeito_nome': 'Voracidade do Banquete',
        'efeito': 'Ao reduzir uma criatura a 0 HP, recupera 1d6 de Vida ou Mana (à escolha). Vantagem em Intimidação.',
    },
    {
        'nome': 'O Ruivo',
        'tipo': 'Caótica',
        'elemento': 'Caótico',
        'titulo': 'Senhor do Caos e da Sorte',
        'descricao': 'Uma força do caos puro que ri de toda ordem e previsibilidade. Seus aliados nunca sabem o que vem a seguir — mas sempre é interessante.',
        'efeito_nome': 'Capricho do Caos',
        'efeito': 'Uma vez por combate, pode forçar um inimigo visível a relançar qualquer dado que acabou de rolar. O segundo resultado é final.',
    },
    {
        'nome': 'O Colecionador',
        'tipo': 'Caótica',
        'elemento': 'Caótico',
        'titulo': 'Guardião de Tudo Que Foi Perdido',
        'descricao': 'Uma entidade que acumula memórias, segredos e artefatos. Nada o satisfaz tanto quanto possuir o que outros jamais terão.',
        'efeito_nome': 'Memória Devorada',
        'efeito': 'Vantagem em testes de História. Ao tocar um objeto, pode sentir suas últimas memórias (Ação Padrão, 1 vez por hora).',
    },
    {
        'nome': 'O Sonolento',
        'tipo': 'Caótica',
        'elemento': 'Caótico',
        'titulo': 'Senhor dos Pesadelos e do Inconsciente',
        'descricao': 'Um primordial que habita o espaço entre o sonho e a vigília. Sua influência se manifesta em pesadelos que corrompem a mente.',
        'efeito_nome': 'Véu Onírico',
        'efeito': 'CD de magias de sono, encantamento e medo +2. Pode enviar mensagens em sonhos a alvos adormecidos a até 1 km.',
    },
    {
        'nome': 'Mil Olhos',
        'tipo': 'Caótica',
        'elemento': 'Caótico',
        'titulo': 'A Vigilância Sem Fim',
        'descricao': 'Uma entidade que tudo vê e tudo registra. Sua presença é sentida como a sensação constante de ser observado por todos os lados.',
        'efeito_nome': 'Visão Onipresente',
        'efeito': 'Não pode ser surpreendido. Vantagem em Percepção. +2 nas rolagens de Iniciativa.',
    },
    {
        'nome': 'O Espelho Dourado',
        'tipo': 'Caótica',
        'elemento': 'Caótico',
        'titulo': 'Espelho da Identidade e da Vaidade',
        'descricao': 'Uma entidade que se alimenta de ilusões de identidade. Ela reflete o que você quer ser — e às vezes, o que você teme ser.',
        'efeito_nome': 'Reflexo Perfeito',
        'efeito': 'Uma vez por Descanso Longo, pode copiar a aparência de uma criatura vista por 1 hora. Vantagem em Persuasão e Enganação enquanto assume outra identidade.',
    },
    # ── ENTIDADES SAGRADAS (Os Cinco Pilares) ─────────────
    {
        'nome': 'O Primeiro Amanhecer',
        'tipo': 'Sagrada',
        'elemento': 'Sagrado',
        'titulo': 'Pilar da Luz e da Esperança',
        'descricao': 'O primeiro raio de luz que existiu quando o Tudo se fragmentou. Sua presença afasta as trevas e fortalece os que servem à vida.',
        'efeito_nome': 'Luz da Aurora',
        'efeito': 'Magias de cura restauram +1d6 de Vida adicional. Criaturas Negativas e Mortas-Vivas têm Desvantagem em ataques contra você.',
    },
    {
        'nome': 'O Senhor do Silêncio',
        'tipo': 'Sagrada',
        'elemento': 'Sagrado',
        'titulo': 'Pilar da Morte e dos Julgamentos',
        'descricao': 'Guardião da fronteira entre a vida e o que vem depois. Calmo como o vazio, implacável como o tempo que passa.',
        'efeito_nome': 'Toque do Silêncio',
        'efeito': 'Pode comunicar-se com espíritos de mortos das últimas 24h. +2 em testes de Investigação e Percepção sobre mortos ou segredos ocultos.',
    },
    {
        'nome': 'O Arquiteto Sem Face',
        'tipo': 'Sagrada',
        'elemento': 'Sagrado',
        'titulo': 'Pilar da Criação e da Ordem',
        'descricao': 'A mente que concebeu as primeiras runas e leis do universo. Não tem forma porque é anterior a toda forma.',
        'efeito_nome': 'Projeto Arcano',
        'efeito': 'Magias de invocação e criação custam -1 PM (mínimo 1). +2 nas rolagens de Foco.',
    },
    {
        'nome': 'O Guardião do Tempo',
        'tipo': 'Sagrada',
        'elemento': 'Sagrado',
        'titulo': 'Pilar do Destino e das Profecias',
        'descricao': 'Um Pilar que observa todos os momentos simultaneamente, tecendo profecias com a paciência de eras incontáveis.',
        'efeito_nome': 'Eco do Destino',
        'efeito': 'Uma vez por Descanso Longo, pode relançar qualquer dado (seu ou de aliado visível) e usar o melhor resultado.',
    },
    {
        'nome': 'A Tecelã',
        'tipo': 'Sagrada',
        'elemento': 'Sagrado',
        'titulo': 'Pilar das Conexões e do Destino Tecido',
        'descricao': 'A última dos Pilares, cujos fios invisíveis ligam todas as coisas. Ela vê as conexões que outros jamais perceberiam.',
        'efeito_nome': 'Fio da Vida',
        'efeito': 'Quando um aliado em raio de 9m cair a 0 HP, pode usar Reação gastando 3 PM para estabilizá-lo automaticamente.',
    },
]

FAUNO_ASPECTOS = {
    'Urso':    {'label': 'Urso',    'ativo': 'Resistência contra danos físicos.',               'desc': 'Sua resistência se torna quase inabalável. Você recebe Resistência contra danos físicos.'},
    'Lobo':    {'label': 'Lobo',    'ativo': '+1 na margem de crítico em ataques desarmados.',  'desc': 'Seus instintos de caça tornam seus golpes mais precisos. Seus ataques desarmados recebem +1 na margem de crítico.'},
    'Raposa':  {'label': 'Raposa',  'ativo': 'Vantagem em testes de Enganação.',                'desc': 'Sua astúcia e capacidade de manipulação afloram. Você recebe vantagem em testes de Enganação.'},
    'Javali':  {'label': 'Javali',  'ativo': '+2 nas rolagens de ataque com armas corpo a corpo.','desc': 'Sua ferocidade impulsiona seus ataques. Você recebe +2 nas rolagens de ataque com armas corpo a corpo.'},
    'Guaxinim':{'label': 'Guaxinim','ativo': '+2 nas rolagens de ataque mágico.',               'desc': 'Sua afinidade natural com energias místicas se intensifica. Você recebe +2 nas rolagens de ataque mágico.'},
    'Falcão':  {'label': 'Falcão',  'ativo': '+2 nas rolagens de ataque com armas de longa distância.','desc': 'Sua visão e precisão atingem seu auge. Você recebe +2 nas rolagens de ataque com armas de longa distância.'},
}

TRAIT_BONUSES = {
    'Escamas Naturais':    {'db': 1,   'label': 'DB +1'},
    'Fluxo Arcano':        {'lmt': 2,  'label': 'LMT +2'},
    'Abençoado pela Mana': {'mana': 4, 'label': 'Mana +4'},
}

TALENT_STAT_BONUSES = {
    'Proficiência em Magia':      {'cd': 2,   'label': 'CD +2'},
    'Proficiência em Mana':       {'mana': 4, 'label': 'Mana +4'},
    'Proficiência em Vitalidade': {'vida': 6, 'label': 'Vida +6'},
    'Quebra de Limite':           {'lmt': 1,  'label': 'LMT +1'},
}

TALENT_VANTAGENS = {
    'Arqueólogo':           ['História', 'Prestidigitação'],
    'Aura de Liderança':    [],
    'Coração de Leão':      ['Vontade'],
    'Execução Final':       [],
    'Físico Escultural':    ['Atletismo'],
    'Genialidade':          ['Investigação'],
    'Mestre de Esquiva':    [],
    'Ocultação de Mana':    ['Furtividade'],
    'Olhos de Coruja':      [],
    'Passo Silencioso':     ['Furtividade'],
    'Prontidão':            ['Iniciativa', 'Percepção'],
    'Sensibilidade Aguçada':['Carisma'],
    'Sobrevivente Selvagem':['Sobrevivência'],
    'Vigor Inabalável':     [],
}

RACIAL_VANTAGENS = {
    'Resistência de Pedra': [],
    'Filhos da Pedra':      ['Atletismo', 'Prestidigitação'],
    'Resistência Mental':   ['Vontade'],
    'Sentidos Aguçados':    ['Percepção'],
    'Instinto Predatório':  ['Sobrevivência'],
    'Passos Silenciosos':   ['Furtividade'],
    'Mente Feérica':        ['Investigação', 'Persuasão'],
    'Presença Imponente':   ['Intimidação', 'Carisma'],
    'Memória das Cinzas':   ['História'],
    'Sangue Mestiço':       ['Vontade'],
    'Adaptabilidade Humana':['Iniciativa'],
    'Mestre em Perícia':    [],
}

TALENT_PREREQS = {
    'Arquimemória Arcana':   {'attr': 'INT', 'min': 3, 'label': 'INT 3+'},
    'Aura de Liderança':     {'attr': 'PRE', 'min': 3, 'label': 'PRE 3+'},
    'Colosso de Guerra':     {'attr': 'FOR', 'min': 3, 'label': 'FOR 3+'},
    'Coração de Leão':       {'attr': 'PRE', 'min': 3, 'label': 'PRE 3+'},
    'Dançarino das Lâminas': {'attr': 'DES', 'min': 3, 'label': 'DES 3+'},
    'Físico Escultural':     {'attr': 'FOR', 'min': 3, 'label': 'FOR 3+'},
    'Genialidade':           {'attr': 'INT', 'min': 3, 'label': 'INT 3+'},
    'Golpe Silenciador':     {'attr': 'DES', 'min': 2, 'label': 'DES 2+'},
    'Hemorragia Brutal':     {'attr': 'FOR', 'min': 2, 'label': 'FOR 2+'},
    'Maestria Marcial':      {'attr': 'FOR', 'min': 2, 'label': 'FOR 2+'},
    'Mente Fortalecida':     {'attr': 'INT', 'min': 2, 'label': 'INT 2+'},
    'Pacto Ancestral':       {'pacto': True, 'label': 'Sem pacto ativo'},
    'Pacto Elemental':       {'pacto': True, 'label': 'Sem pacto ativo'},
    'Pacto Santificado':     {'pacto': True, 'label': 'Sem pacto ativo'},
    'Passo Silencioso':      {'attr': 'DES', 'min': 2, 'label': 'DES 2+'},
    'Prontidão':             {'attr': 'DES', 'min': 3, 'label': 'DES 3+'},
    'Reserva Arcana':        {'attr': 'PRE', 'min': 2, 'label': 'PRE 2+'},
    'Terror Implacável':     {'attr': 'PRE', 'min': 2, 'label': 'PRE 2+'},
    'Vigor Inabalável':      {'attr': 'VIT', 'min': 2, 'label': 'VIT 2+'},
    'Vitalidade Inabalável': {'attr': 'VIT', 'min': 3, 'label': 'VIT 3+'},
}

ALL_LANGS = ['Abissal','Anão','Arcano','Celestial','Dracônico','Élfico','Feérico','Gigante',
             'Infernal','Naga','Orc','Primordial','Selvagem','Silvestre']

# Dados Raciais extraídos do Livro Reino Mágico (Capítulo VI)
RACIAL_DATA = {
    'Anão': {
        'altura':           '90 cm a 1,30 m',
        'peso_medio':       '70 kg a 120 kg',
        'expectativa_vida': '300 a 500 anos',
        'movimento':        '7,5 metros',
        'idiomas_nativos':  'Comum, Anão, Dracônico e mais um idioma à escolha.',
    },
    'Celestial': {
        'altura':           '1,60 m a 1,80 m',
        'peso_medio':       '60 kg a 90 kg',
        'expectativa_vida': 'até 10.000 anos',
        'movimento':        '9 metros',
        'idiomas_nativos':  'Comum, Celestial e mais um idioma à escolha.',
    },
    'Draconato': {
        'altura':           '1,85 m a 2,30 m',
        'peso_medio':       '120 kg a 180 kg',
        'expectativa_vida': 'até 600 anos',
        'movimento':        '9 metros',
        'idiomas_nativos':  'Comum, Dracônico, Anão e mais um idioma à escolha.',
    },
    'Elfo': {
        'altura':           '1,65 m a 1,90 m',
        'peso_medio':       '60 kg a 90 kg',
        'expectativa_vida': '1.000 a 2.000 anos',
        'movimento':        '9 metros',
        'idiomas_nativos':  'Comum, Élfico, Arcano e mais dois idiomas à escolha.',
    },
    'Fauno': {
        'altura':           '1,70 m a 1,80 m',
        'peso_medio':       '50 kg a 70 kg',
        'expectativa_vida': '60 a 80 anos',
        'movimento':        '9 metros',
        'idiomas_nativos':  'Comum, Silvestre e mais um idioma à escolha.',
    },
    'Feérico': {
        'altura':           '60 cm a 90 cm',
        'peso_medio':       '35 kg a 60 kg',
        'expectativa_vida': '120 a 200 anos',
        'movimento':        '7,5 metros',
        'idiomas_nativos':  'Comum, Silvestre, Élfico, Feérico, Primordial e mais um idioma à escolha.',
    },
    'Humano': {
        'altura':           '1,60 m a 2,10 m',
        'peso_medio':       '50 kg a 150 kg',
        'expectativa_vida': '60 a 100 anos',
        'movimento':        '9 metros',
        'idiomas_nativos':  'Comum e mais um idioma à escolha.',
    },
    'Híbrido': {
        'altura':           'Varia conforme as raças de origem.',
        'peso_medio':       'Geralmente superior à média das raças de origem.',
        'expectativa_vida': 'Média entre as expectativas de vida das raças de origem.',
        'movimento':        '9 metros',
        'idiomas_nativos':  'Comum, dois idiomas das raças de origem e mais um à escolha.',
    },
    'Infernal': {
        'altura':           '1,80 m a 2,00 m',
        'peso_medio':       '80 kg a 130 kg',
        'expectativa_vida': '150 a 200 anos',
        'movimento':        '9 metros',
        'idiomas_nativos':  'Comum, Infernal e mais um idioma à escolha.',
    },
    'Maculado': {
        'altura':           'Varia conforme a raça de origem.',
        'peso_medio':       'Geralmente inferior ao peso médio da raça de origem.',
        'expectativa_vida': 'Indefinida — alguns vivem uma vida comum, outros parecem não envelhecer.',
        'movimento':        'Igual ao da raça de origem.',
        'idiomas_nativos':  'Comum, Infernal ou um idioma da raça de origem, mais um adicional à escolha.',
    },
}


# ─────────────────────────────────────────────────────────
# SCHEMA SQL
# ─────────────────────────────────────────────────────────

SCHEMA = """
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS magic_levels (
    id      INTEGER PRIMARY KEY,
    nome    TEXT    NOT NULL,
    nivel   INTEGER NOT NULL UNIQUE,
    custo   INTEGER NOT NULL,
    cor     TEXT
);

CREATE TABLE IF NOT EXISTS spells (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    nome         TEXT NOT NULL,
    tipo         TEXT,
    nivel_magia  INTEGER DEFAULT 3,
    custo_mana   INTEGER DEFAULT 0,
    prereq       TEXT,
    execucao     TEXT,
    alcance      TEXT,
    alvo         TEXT,
    duracao      TEXT,
    categoria    TEXT,
    natureza     TEXT,
    descricao    TEXT,
    FOREIGN KEY (nivel_magia) REFERENCES magic_levels(nivel)
);

CREATE TABLE IF NOT EXISTS talents (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      TEXT NOT NULL UNIQUE,
    descricao TEXT
);

CREATE TABLE IF NOT EXISTS classes (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nome            TEXT NOT NULL UNIQUE,
    atrib           TEXT,
    vida            INTEGER,
    mana            INTEGER,
    hab1            TEXT,
    h1              TEXT,
    hab2            TEXT,
    h2              TEXT,
    armas           TEXT,
    spell_access    TEXT,
    extra_slots     INTEGER DEFAULT 0,
    extra_slot_type TEXT,
    is_espiritualista INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS class_skills (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    class_id  INTEGER,
    skill_nome TEXT,
    FOREIGN KEY (class_id) REFERENCES classes(id)
);

CREATE TABLE IF NOT EXISTS races (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT,
    nome                    TEXT NOT NULL UNIQUE,
    idiomas                 TEXT,
    b_mana                  INTEGER DEFAULT 0,
    b_attr_extra            INTEGER DEFAULT 0,
    extra_spell             TEXT,
    extra_spell_type        TEXT,
    extra_spell_type_count  INTEGER DEFAULT 0,
    extra_tal               INTEGER DEFAULT 0,
    extra_per               INTEGER DEFAULT 0,
    move                    REAL    DEFAULT 9
);

CREATE TABLE IF NOT EXISTS race_traits (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    race_id  INTEGER,
    nome     TEXT,
    descricao TEXT,
    bonus    TEXT,
    FOREIGN KEY (race_id) REFERENCES races(id)
);

CREATE TABLE IF NOT EXISTS skills (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    nome     TEXT NOT NULL UNIQUE,
    atributo TEXT
);

CREATE TABLE IF NOT EXISTS kits (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    nome     TEXT NOT NULL UNIQUE,
    db_bonus INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS kit_items (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    kit_id  INTEGER,
    nome    TEXT,
    descricao TEXT,
    prof    TEXT,
    FOREIGN KEY (kit_id) REFERENCES kits(id)
);

CREATE TABLE IF NOT EXISTS kit_extras (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    kit_id    INTEGER,
    item_nome TEXT,
    FOREIGN KEY (kit_id) REFERENCES kits(id)
);

CREATE TABLE IF NOT EXISTS kit_skill_bonuses (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    kit_id     INTEGER,
    skill_nome TEXT,
    bonus      INTEGER,
    FOREIGN KEY (kit_id) REFERENCES kits(id)
);

CREATE TABLE IF NOT EXISTS kit_vantagens (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    kit_id     INTEGER,
    skill_nome TEXT,
    FOREIGN KEY (kit_id) REFERENCES kits(id)
);

CREATE TABLE IF NOT EXISTS languages (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS race_langs (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    race_id  INTEGER,
    lang     TEXT,
    tipo     TEXT,
    FOREIGN KEY (race_id) REFERENCES races(id)
);

CREATE TABLE IF NOT EXISTS trait_bonuses (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    trait_nome TEXT NOT NULL UNIQUE,
    db         INTEGER DEFAULT 0,
    lmt        INTEGER DEFAULT 0,
    mana       INTEGER DEFAULT 0,
    label      TEXT
);

CREATE TABLE IF NOT EXISTS talent_stat_bonuses (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    talent_nome TEXT NOT NULL UNIQUE,
    cd         INTEGER DEFAULT 0,
    mana       INTEGER DEFAULT 0,
    vida       INTEGER DEFAULT 0,
    lmt        INTEGER DEFAULT 0,
    label      TEXT
);

CREATE TABLE IF NOT EXISTS talent_vantagens (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    talent_nome TEXT,
    skill_nome  TEXT
);

CREATE TABLE IF NOT EXISTS racial_vantagens (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    trait_nome  TEXT,
    skill_nome  TEXT
);

CREATE TABLE IF NOT EXISTS talent_prereqs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    talent_nome TEXT NOT NULL UNIQUE,
    attr        TEXT,
    min_val     INTEGER,
    pacto       INTEGER DEFAULT 0,
    label       TEXT
);

CREATE TABLE IF NOT EXISTS fauno_aspectos (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    nome   TEXT NOT NULL UNIQUE,
    label  TEXT,
    ativo  TEXT,
    desc   TEXT
);

CREATE TABLE IF NOT EXISTS racial_data (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    race_id           INTEGER NOT NULL UNIQUE,
    altura            TEXT,
    peso_medio        TEXT,
    expectativa_vida  TEXT,
    movimento         TEXT,
    idiomas_nativos   TEXT,
    FOREIGN KEY (race_id) REFERENCES races(id)
);

CREATE TABLE IF NOT EXISTS entities (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nome        TEXT NOT NULL UNIQUE,
    tipo        TEXT NOT NULL,
    elemento    TEXT,
    titulo      TEXT,
    descricao   TEXT,
    efeito_nome TEXT,
    efeito      TEXT
);

CREATE TABLE IF NOT EXISTS conditions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nome        TEXT NOT NULL UNIQUE,
    descricao   TEXT DEFAULT '',
    efeito      TEXT DEFAULT '',
    salvaguarda TEXT DEFAULT ''
);
"""


# ─────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────

def main():
    os.makedirs(DB_DIR, exist_ok=True)
    print(f"Criando banco de dados: {DB_PATH}")

    # Lê magias da planilha xlsx
    print(f"Lendo magias de: {XLSX_PATH}")
    if not os.path.exists(XLSX_PATH):
        print(f"  [ERRO] Planilha não encontrada: {XLSX_PATH}")
        return
    spells = load_spells_from_xlsx(XLSX_PATH)
    print(f"  {len(spells)} magias carregadas.")

    # Lê talentos do HTML de backup
    print("Lendo talentos do HTML...")
    talents = []
    try:
        with open(HTML_PATH, encoding='utf-8') as f:
            html = f.read()
        talents = extract_json_array(html, r'TALENTS')
    except FileNotFoundError:
        print(f"  [AVISO] HTML não encontrado: {HTML_PATH} — talentos não serão inseridos.")
    print(f"  Talentos: {len(talents)}")

    # Remove DB existente
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print("  Banco anterior removido.")

    conn = sqlite3.connect(DB_PATH)
    conn.executescript(SCHEMA)

    # ── Níveis de Magia ──────────────────────────────────
    print("Inserindo níveis de magia...")
    conn.executemany(
        "INSERT INTO magic_levels(nivel,nome,custo,cor) VALUES(?,?,?,?)",
        [(n, nm, c, cor) for n, nm, c, cor in MAGIC_LEVELS]
    )

    # ── Magias ───────────────────────────────────────────
    print("Inserindo magias...")
    conn.executemany(
        """INSERT INTO spells
           (nome,tipo,nivel_magia,custo_mana,prereq,execucao,
            alcance,alvo,duracao,categoria,natureza,descricao)
           VALUES
           (:nome,:tipo,:nivel_magia,:custo_mana,:prereq,:execucao,
            :alcance,:alvo,:duracao,:categoria,:natureza,:descricao)""",
        spells,
    )

    # ── Talentos ─────────────────────────────────────────
    print("Inserindo talentos...")
    for t in talents:
        conn.execute(
            "INSERT OR IGNORE INTO talents(nome,descricao) VALUES(?,?)",
            (t['nome'], t.get('descricao',''))
        )

    # ── Classes ──────────────────────────────────────────
    print("Inserindo classes...")
    for nome, cl in CLASSES.items():
        cursor = conn.execute(
            """INSERT INTO classes(nome,atrib,vida,mana,hab1,h1,hab2,h2,armas,
               spell_access,extra_slots,extra_slot_type,is_espiritualista)
               VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)""",
            (nome, cl['atrib'], cl['vida'], cl['mana'],
             cl['hab1'], cl['h1'], cl['hab2'], cl['h2'], cl['armas'],
             json.dumps(cl['spellAccess'], ensure_ascii=False),
             cl['extraSlots'], cl['extraSlotType'], int(cl['espiritualista']))
        )
        cid = cursor.lastrowid
        for skill in cl['pericias']:
            conn.execute("INSERT INTO class_skills(class_id,skill_nome) VALUES(?,?)", (cid, skill))

    # ── Raças ─────────────────────────────────────────────
    print("Inserindo raças...")
    for nome, r in RACES.items():
        cursor = conn.execute(
            """INSERT INTO races(nome,idiomas,b_mana,b_attr_extra,extra_spell,
               extra_spell_type,extra_spell_type_count,extra_tal,extra_per,move)
               VALUES(?,?,?,?,?,?,?,?,?,?)""",
            (nome, r['idiomas'], r['b_mana'], r['b_attr_extra'],
             r['extra_spell'], r['extra_spell_type'], r['extra_spell_type_count'],
             r['extra_tal'], r['extra_per'], r['move'])
        )
        rid = cursor.lastrowid
        for t in r['traits']:
            conn.execute(
                "INSERT INTO race_traits(race_id,nome,descricao,bonus) VALUES(?,?,?,?)",
                (rid, t['n'], t['d'], t.get('bonus'))
            )

    # ── Idiomas de Raça ──────────────────────────────────
    for nome, rl in RACE_LANGS.items():
        row = conn.execute("SELECT id FROM races WHERE nome=?", (nome,)).fetchone()
        if not row:
            continue
        rid = row[0]
        for lang in rl['fixos']:
            conn.execute("INSERT INTO race_langs(race_id,lang,tipo) VALUES(?,?,?)", (rid, lang, 'fixo'))
        conn.execute("INSERT OR IGNORE INTO race_langs(race_id,lang,tipo) VALUES(?,?,?)", (rid, str(rl['extras']), 'extras_count'))

    # ── Perícias ─────────────────────────────────────────
    print("Inserindo perícias...")
    for sk in SKILLS:
        conn.execute("INSERT OR IGNORE INTO skills(nome,atributo) VALUES(?,?)", (sk['n'], sk['a']))

    # ── Kits ─────────────────────────────────────────────
    print("Inserindo kits...")
    for nome, k in KITS.items():
        cursor = conn.execute("INSERT INTO kits(nome,db_bonus) VALUES(?,?)", (nome, k['db']))
        kid = cursor.lastrowid
        for item in k['items']:
            conn.execute(
                "INSERT INTO kit_items(kit_id,nome,descricao,prof) VALUES(?,?,?,?)",
                (kid, item['n'], item['d'], item.get('prof'))
            )
        for ex in k['extras']:
            conn.execute("INSERT INTO kit_extras(kit_id,item_nome) VALUES(?,?)", (kid, ex))
        for skill, bns in k['skills'].items():
            conn.execute("INSERT INTO kit_skill_bonuses(kit_id,skill_nome,bonus) VALUES(?,?,?)", (kid, skill, bns))
        for vant in k['vantagens']:
            conn.execute("INSERT INTO kit_vantagens(kit_id,skill_nome) VALUES(?,?)", (kid, vant))

    # ── Idiomas ──────────────────────────────────────────
    for lang in ALL_LANGS:
        conn.execute("INSERT OR IGNORE INTO languages(nome) VALUES(?)", (lang,))

    # ── Traços → Bônus ───────────────────────────────────
    for trait_nome, bns in TRAIT_BONUSES.items():
        conn.execute(
            "INSERT OR IGNORE INTO trait_bonuses(trait_nome,db,lmt,mana,label) VALUES(?,?,?,?,?)",
            (trait_nome, bns.get('db',0), bns.get('lmt',0), bns.get('mana',0), bns.get('label',''))
        )

    # ── Talentos → Bônus de Stats ────────────────────────
    for t_nome, bns in TALENT_STAT_BONUSES.items():
        conn.execute(
            "INSERT OR IGNORE INTO talent_stat_bonuses(talent_nome,cd,mana,vida,lmt,label) VALUES(?,?,?,?,?,?)",
            (t_nome, bns.get('cd',0), bns.get('mana',0), bns.get('vida',0), bns.get('lmt',0), bns.get('label',''))
        )

    # ── Talentos → Vantagens ─────────────────────────────
    for t_nome, skills in TALENT_VANTAGENS.items():
        for skill in skills:
            conn.execute("INSERT INTO talent_vantagens(talent_nome,skill_nome) VALUES(?,?)", (t_nome, skill))

    # ── Traços Raciais → Vantagens ───────────────────────
    for t_nome, skills in RACIAL_VANTAGENS.items():
        for skill in skills:
            conn.execute("INSERT INTO racial_vantagens(trait_nome,skill_nome) VALUES(?,?)", (t_nome, skill))

    # ── Pré-requisitos de Talentos ───────────────────────
    for t_nome, pre in TALENT_PREREQS.items():
        conn.execute(
            "INSERT OR IGNORE INTO talent_prereqs(talent_nome,attr,min_val,pacto,label) VALUES(?,?,?,?,?)",
            (t_nome, pre.get('attr'), pre.get('min'), int(pre.get('pacto', False)), pre.get('label',''))
        )

    # ── Aspectos do Fauno ────────────────────────────────
    for nome, asp in FAUNO_ASPECTOS.items():
        conn.execute(
            "INSERT OR IGNORE INTO fauno_aspectos(nome,label,ativo,desc) VALUES(?,?,?,?)",
            (nome, asp['label'], asp['ativo'], asp['desc'])
        )

    # ── Entidades e Divindades ───────────────────────────
    print("Inserindo entidades e divindades...")
    for ent in ENTITIES:
        conn.execute(
            """INSERT OR IGNORE INTO entities(nome,tipo,elemento,titulo,descricao,efeito_nome,efeito)
               VALUES(?,?,?,?,?,?,?)""",
            (ent['nome'], ent['tipo'], ent['elemento'], ent['titulo'],
             ent['descricao'], ent['efeito_nome'], ent['efeito'])
        )

    # ── Dados Raciais (do livro) ─────────────────────────
    print("Inserindo dados raciais...")
    for nome, rd in RACIAL_DATA.items():
        row = conn.execute("SELECT id FROM races WHERE nome=?", (nome,)).fetchone()
        if not row:
            print(f"  [AVISO] Raca nao encontrada: {nome}")
            continue
        rid = row[0]
        conn.execute(
            """INSERT OR REPLACE INTO racial_data
               (race_id,altura,peso_medio,expectativa_vida,movimento,idiomas_nativos)
               VALUES(?,?,?,?,?,?)""",
            (rid, rd['altura'], rd['peso_medio'], rd['expectativa_vida'],
             rd['movimento'], rd['idiomas_nativos'])
        )

    # ── Condições de Status ──────────────────────────────
    print("Inserindo condições de status...")
    CONDITIONS_DATA = [
        ('Abalado',      'A criatura sofre perturbação mental, insegurança ou perda momentânea de concentração.',             'Sofre –2 em testes de ataque, perícia ou habilidade baseados em Presença.',                                                                                                                                                                                                                                                      '—'),
        ('Adormecido',   'O personagem cai em um sono profundo, até o final do efeito ou até que receba algum dano.',         'Perde o turno, incapaz de agir. Ataques contra a criatura adormecida são considerados como vulneráveis.',                                                                                                                                                                                                              '—'),
        ('Alucinado',    'O personagem perde a noção da realidade, enxergando e reagindo a estímulos inexistentes.',           'Perde o turno, incapaz de agir.',                                                                                                                                                                                                                                                                                         'Salv. Foco — ao sucesso, encerra a condição.'),
        ('Amedrontado',  'O personagem é dominado pelo medo diante de uma ameaça específica.',                                'Sofre desvantagem contra o conjurador e recebe -2 na Defesa Básica.',                                                                                                                                                                                                                                                     'Salv. Tenacidade — ao sucesso, supera o medo.'),
        ('Aprisionado',  'O personagem tem seus movimentos restringidos por força física ou mágica.',                          'Não pode se mover, mas ainda pode atacar ou conjurar se o alvo estiver ao alcance.',                                                                                                                                                                                                                                        'Salv. Atletismo — ao sucesso, se liberta.'),
        ('Atordoado',    'O personagem sofre um impacto que compromete totalmente sua capacidade de reação.',                  'Não pode agir e perde o turno.',                                                                                                                                                                                                                                                                                         'Salv. Tenacidade — ao sucesso, recupera o controle.'),
        ('Cego',         'O personagem perde completamente a visão do ambiente ao redor.',                                     'Sofre penalidade de -20 em ataques físicos, à distância, mágicos e ações manuais.',                                                                                                                                                                                                                                       '—'),
        ('Confuso',      'A mente do personagem entra em desordem, dificultando decisões coerentes.',                          'No início do turno, rola 1d4: 1 = age normalmente; 2–3 = ataca um aliado; 4 = perde o turno e encerra a condição.',                                                                                                                                                                                                    '—'),
        ('Congelando',   'O corpo do personagem é tomado por frio extremo, limitando suas ações.',                             'Condição não acumulativa (propriedade Água). Novos ataques de Água contra alvo congelado causam metade do dano. O alvo não pode agir, mover-se ou reagir, sofrendo 1d8 de dano contínuo por rodada. Chegar a 0 vida nesta condição causa morte imediata — o corpo transforma-se em estátua de gelo.', 'Salv. Atletismo — ao sucesso, rompe o efeito.'),
        ('Desprevenido', 'O personagem é pego sem preparo ou atenção.',                                                        'Sofre -2 na Defesa Básica.',                                                                                                                                                                                                                                                                                             '—'),
        ('Desorientado', 'O alvo perde o controle sobre sua percepção e concentração.',                                        'Cancela imediatamente magias ativas, efeitos sustentados e habilidades de manutenção. Ao atacar ou selecionar alvo, 50% de chance de confundir aliados com inimigos.',                                                                                                                                                 '—'),
        ('Em Chamas',    'O personagem está envolto em chamas, sofrendo dano contínuo.',                                       'Propriedade Fogo. 1d8 de dano contínuo por rodada. Acumulativo: cada novo ataque de Chamas adiciona +1d8 e reinicia a duração. Pode ser extinto por magias de cura ou efeitos com propriedade Água.',                                                                                                               'Salv. Reflexo — ao se jogar no chão, encerra a condição, mas fica Vulnerável até o próximo turno.'),
        ('Enfraquecido', 'A força do personagem é drenada, reduzindo sua eficácia.',                                           'Causa metade do dano e tem o deslocamento reduzido pela metade.',                                                                                                                                                                                                                                                      '—'),
        ('Enfurecido',   'O personagem perde o controle emocional e entra em estado de agressividade extrema.',                'Recebe vantagem em ataques corpo a corpo, mas não pode realizar ataques à distância ou conjurar magias.',                                                                                                                                                                                                              '—'),
        ('Envenenado',   'O corpo do personagem sofre com toxinas que causam dano gradual.',                                   '1d6 de dano contínuo com propriedade Terra por rodada. Condição não acumulativa, exceto quando efeitos, talentos ou magias especificarem explicitamente.',                                                                                                                                                           'Salv. Tenacidade — ao sucesso, encerra o efeito.'),
        ('Fadigado',     'O personagem está exausto física e mentalmente.',                                                    'Sofre desvantagem em testes e ataques em geral.',                                                                                                                                                                                                                                                                      'Salv. Vontade — ao sucesso, recupera o foco.'),
        ('Lentidão',     'Os movimentos do personagem se tornam pesados e atrasados.',                                         'Movimento reduzido pela metade.',                                                                                                                                                                                                                                                                                    'Salv. Tenacidade — ao sucesso, recupera a mobilidade.'),
        ('Morrendo',     'O personagem encontra-se à beira da morte, com o corpo falhando e a consciência oscilando.',         'Por turno: salv. bem-sucedida = retorna com 1 de Vida; falha = acumula 1 falha (3 falhas = morte). Permanece Vulnerável durante toda a condição.',                                                                                                                                                              'Salv. Tenacidade ou Vontade.'),
        ('Paralisado',   'O corpo do personagem está completamente imobilizado.',                                               'Não pode se mover ou atacar, mas ainda pode conjurar magias.',                                                                                                                                                                                                                                                      'Salv. Tenacidade — ao sucesso, encerra a condição.'),
        ('Provocado',    'O personagem é forçado a agir de forma impulsiva contra um alvo específico.',                        'Deve atacar o conjurador em sua próxima ação.',                                                                                                                                                                                                                                                                    'Salv. Vontade — ao sucesso, resiste à provocação.'),
        ('Sangrando',    'Ferimentos abertos causam perda contínua de vida.',                                                  '1d8 de dano contínuo por rodada (não acumulativo). Agravamento por reaplicação — efeitos secundários em ordem: Enfraquecido → Silenciado → Vulnerável.',                                                                                                                                                       'Salv. Tenacidade — ao sucesso, estanca o sangramento.'),
        ('Silenciado',   'O personagem tem sua capacidade de conjurar magia bloqueada.',                                       'Não pode conjurar magias.',                                                                                                                                                                                                                                                                                          '—'),
        ('Vulnerável',   'O personagem se encontra em estado crítico, exposto a danos extremos.',                              'Redução de -5 na Defesa Básica e não pode utilizar Reações. Se estiver Morrendo, qualquer dano recebido causa morte imediata.',                                                                                                                                                                                  '—'),
    ]
    conn.executemany(
        "INSERT OR REPLACE INTO conditions(nome,descricao,efeito,salvaguarda) VALUES(?,?,?,?)",
        CONDITIONS_DATA,
    )

    conn.commit()
    conn.close()

    # Relatório final
    conn2 = sqlite3.connect(DB_PATH)
    tables = conn2.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()
    print("\n✔ Banco criado com sucesso!")
    print("  Tabelas:")
    for (t,) in sorted(tables):
        count = conn2.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
        print(f"    {t:30s} {count} registros")
    conn2.close()
    print(f"\n  Arquivo: {DB_PATH}")


if __name__ == '__main__':
    main()

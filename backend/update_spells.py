"""
Atualiza a tabela 'spells' do banco rpg.db a partir do arquivo
'Lista de Magia Atualizado.xlsx' localizado na raiz do projeto.

Execute:  python update_spells.py
"""

import os
import sys
import sqlite3

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

try:
    import openpyxl
except ImportError:
    sys.exit("Erro: instale openpyxl com  pip install openpyxl")

# ─── Caminhos ────────────────────────────────────────────
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
PROJ_DIR  = os.path.dirname(BASE_DIR)
XLSX_PATH = os.path.join(PROJ_DIR, "Lista de Magia Atualizado.xlsx")
DB_PATH   = os.path.join(BASE_DIR, "data", "rpg.db")

LEVEL_MAP = {
    "Truques":  1,
    "Básicas":  2,
    "Menor":    3,
    "Elite":    4,
    "Maior":    5,
    "Avançado": 6,
    "Lendário": 7,
    "Divino":   8,
    "Secreto":  9,
}

# Colunas esperadas na planilha (linha 1 = cabeçalho)
COL_NOME     = 0
COL_TIPO     = 1
COL_NIVEL    = 2   # string: "Truques", "Básicas", etc.
COL_CUSTO    = 3
COL_EXEC     = 4
COL_ALCANCE  = 5
COL_CAT      = 6
COL_ALVO     = 7
COL_DUR      = 8
COL_NAT      = 9
COL_PREREQ   = 10
COL_DESC     = 11


def cell_str(cell) -> str:
    v = cell.value
    if v is None:
        return ""
    return str(v).strip()


def cell_int(cell) -> int:
    v = cell.value
    if v is None:
        return 0
    try:
        return int(v)
    except (ValueError, TypeError):
        s = str(v).strip().replace(",", "").replace(".", "")
        return int(s) if s.isdigit() else 0


def load_spells_from_xlsx(path: str) -> list[dict]:
    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    ws = wb.active
    rows = list(ws.iter_rows())
    if not rows:
        return []

    spells = []
    for row in rows[1:]:          # pula cabeçalho
        if len(row) < 1:
            continue
        nome = cell_str(row[COL_NOME])
        if not nome:
            continue

        nivel_str = cell_str(row[COL_NIVEL]) if len(row) > COL_NIVEL else ""
        nivel_num = LEVEL_MAP.get(nivel_str, 3)
        custo     = cell_int(row[COL_CUSTO])  if len(row) > COL_CUSTO else 0

        spells.append({
            "nome":        nome,
            "tipo":        cell_str(row[COL_TIPO])    if len(row) > COL_TIPO    else "",
            "nivel_magia": nivel_num,
            "custo_mana":  custo,
            "execucao":    cell_str(row[COL_EXEC])    if len(row) > COL_EXEC    else "",
            "alcance":     cell_str(row[COL_ALCANCE]) if len(row) > COL_ALCANCE else "",
            "categoria":   cell_str(row[COL_CAT])     if len(row) > COL_CAT     else "",
            "alvo":        cell_str(row[COL_ALVO])    if len(row) > COL_ALVO    else "",
            "duracao":     cell_str(row[COL_DUR])      if len(row) > COL_DUR     else "",
            "natureza":    cell_str(row[COL_NAT])      if len(row) > COL_NAT     else "",
            "prereq":      cell_str(row[COL_PREREQ])  if len(row) > COL_PREREQ  else "",
            "descricao":   cell_str(row[COL_DESC])    if len(row) > COL_DESC    else "",
        })

    wb.close()
    return spells


def update_db(spells: list[dict], db_path: str) -> None:
    conn = sqlite3.connect(db_path)

    conn.execute("DELETE FROM spells")

    conn.executemany(
        """INSERT INTO spells
           (nome, tipo, nivel_magia, custo_mana, prereq, execucao,
            alcance, alvo, duracao, categoria, natureza, descricao)
           VALUES
           (:nome, :tipo, :nivel_magia, :custo_mana, :prereq, :execucao,
            :alcance, :alvo, :duracao, :categoria, :natureza, :descricao)""",
        spells,
    )

    conn.commit()
    total = conn.execute("SELECT COUNT(*) FROM spells").fetchone()[0]
    by_level = conn.execute(
        "SELECT nivel_magia, COUNT(*) FROM spells GROUP BY nivel_magia ORDER BY nivel_magia"
    ).fetchall()
    conn.close()

    print(f"  Magias inseridas: {total}")
    for lvl, cnt in by_level:
        print(f"    Nível {lvl}: {cnt}")


def main():
    print(f"Planilha: {XLSX_PATH}")
    if not os.path.exists(XLSX_PATH):
        sys.exit(f"  [ERRO] Arquivo não encontrado: {XLSX_PATH}")

    print(f"Banco:    {DB_PATH}")
    if not os.path.exists(DB_PATH):
        sys.exit(f"  [ERRO] Banco não encontrado: {DB_PATH}\n  Execute create_db.py primeiro.")

    print("Lendo planilha...")
    spells = load_spells_from_xlsx(XLSX_PATH)
    print(f"  {len(spells)} magias encontradas na planilha.")

    print("Atualizando banco...")
    update_db(spells, DB_PATH)
    print("\n✔ Banco atualizado com sucesso!")


if __name__ == "__main__":
    main()

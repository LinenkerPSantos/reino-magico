"""
Exporta todas as tabelas do banco (data/rpg.db) para arquivos CSV e/ou um Excel
único com uma aba por tabela.

Uso:
    python export_db.py            -> gera Excel (uma aba por tabela) e CSVs
    python export_db.py --excel    -> gera só o Excel
    python export_db.py --csv      -> gera só os CSVs
    python export_db.py --tabela spells   -> exporta só a tabela "spells"

Saída em: backend/exports/
    - banco_completo.xlsx
    - csv/<tabela>.csv
"""
import argparse
import sqlite3
from pathlib import Path

import pandas as pd

DB_PATH = Path(__file__).parent / "data" / "rpg.db"
OUT_DIR = Path(__file__).parent / "exports"


def get_table_names(conn: sqlite3.Connection) -> list[str]:
    rows = conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
    ).fetchall()
    return [r[0] for r in rows]


def export(to_excel: bool, to_csv: bool, only_table: str | None):
    if not DB_PATH.exists():
        raise SystemExit(f"Banco não encontrado em: {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    tables = get_table_names(conn)
    if only_table:
        if only_table not in tables:
            raise SystemExit(f"Tabela '{only_table}' não existe. Tabelas disponíveis: {', '.join(tables)}")
        tables = [only_table]

    OUT_DIR.mkdir(exist_ok=True)
    csv_dir = OUT_DIR / "csv"
    if to_csv:
        csv_dir.mkdir(exist_ok=True)

    dataframes: dict[str, pd.DataFrame] = {}
    for t in tables:
        df = pd.read_sql_query(f'SELECT * FROM "{t}"', conn)
        dataframes[t] = df
        print(f"  {t}: {len(df)} linha(s), {len(df.columns)} coluna(s)")

        if to_csv:
            csv_path = csv_dir / f"{t}.csv"
            df.to_csv(csv_path, index=False, encoding="utf-8-sig")
            print(f"    -> CSV: {csv_path}")

    if to_excel:
        xlsx_path = OUT_DIR / "banco_completo.xlsx"
        with pd.ExcelWriter(xlsx_path, engine="openpyxl") as writer:
            for t, df in dataframes.items():
                # Nomes de aba do Excel têm limite de 31 caracteres
                sheet_name = t[:31]
                df.to_excel(writer, sheet_name=sheet_name, index=False)
        print(f"\nExcel gerado: {xlsx_path}")

    conn.close()


def main():
    parser = argparse.ArgumentParser(description="Exporta o banco rpg.db para Excel/CSV")
    parser.add_argument("--excel", action="store_true", help="gerar apenas o Excel")
    parser.add_argument("--csv", action="store_true", help="gerar apenas os CSVs")
    parser.add_argument("--tabela", type=str, default=None, help="exportar só esta tabela")
    args = parser.parse_args()

    # Sem flags -> gera os dois formatos
    to_excel = args.excel or not (args.excel or args.csv)
    to_csv = args.csv or not (args.excel or args.csv)

    print(f"Banco: {DB_PATH}")
    print(f"Saída: {OUT_DIR}\n")
    export(to_excel=to_excel, to_csv=to_csv, only_table=args.tabela)
    print("\nConcluído.")


if __name__ == "__main__":
    main()

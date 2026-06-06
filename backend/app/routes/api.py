import os
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from urllib.parse import unquote

from app.database.connection import load_all_data, get_db

router = APIRouter()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
IMG_DIR  = os.path.join(BASE_DIR, "img")

MIME_MAP = {
    ".png":  "image/png",
    ".jpg":  "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif":  "image/gif",
    ".webp": "image/webp",
}


@router.get("/all")
async def get_all():
    try:
        return load_all_data()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/races")
async def get_races():
    data = load_all_data()
    return {"races": data["races"], "racial_data": data["racial_data"]}


@router.get("/classes")
async def get_classes():
    data = load_all_data()
    return data["classes"]


@router.get("/spells")
async def get_spells():
    conn = get_db()
    spells = [dict(r) for r in conn.execute(
        "SELECT * FROM spells ORDER BY nivel_magia, tipo, nome"
    ).fetchall()]
    conn.close()
    return spells


@router.get("/status")
async def get_status():
    conn = get_db()
    counts = {}
    for tbl in ["spells", "talents", "classes", "races", "skills", "kits", "magic_levels"]:
        counts[tbl] = conn.execute(f"SELECT COUNT(*) FROM {tbl}").fetchone()[0]
    conn.close()
    return {"status": "online", "counts": counts}


def serve_image(rel_path: str) -> FileResponse:
    decoded = unquote(rel_path)
    parts   = [p for p in decoded.split("/") if p and p != ".."]
    fp      = os.path.realpath(os.path.join(IMG_DIR, *parts))
    real_img = os.path.realpath(IMG_DIR)

    if not fp.startswith(real_img + os.sep):
        raise HTTPException(status_code=403, detail="Acesso negado")
    if not os.path.isfile(fp):
        raise HTTPException(status_code=404, detail="Imagem não encontrada")

    ext  = os.path.splitext(fp)[1].lower()
    mime = MIME_MAP.get(ext, "application/octet-stream")
    return FileResponse(fp, media_type=mime, headers={"Cache-Control": "public, max-age=3600"})

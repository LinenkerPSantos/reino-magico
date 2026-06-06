import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.routes.api import router as api_router, serve_image

BASE_DIR  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR  = os.path.join(BASE_DIR, "..", "frontend", "dist")

app = FastAPI(title="Reino Mágico API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


# ── Serve imagens ──────────────────────────────────────────────────────────────
@app.get("/img/{rest_of_path:path}")
async def get_image(rest_of_path: str):
    return serve_image(rest_of_path)


# ── Em produção: serve o build do React ───────────────────────────────────────
if os.path.isdir(DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        index = os.path.join(DIST_DIR, "index.html")
        return FileResponse(index)

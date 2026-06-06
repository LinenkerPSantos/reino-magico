@echo off
chcp 65001 >nul
title Reino Magico - Iniciando...

set "ROOT=%~dp0.."

echo.
echo  =============================================
echo   REINO MAGICO - Iniciando o projeto
echo  =============================================
echo.

:: Instala dependencias do backend se necessario
echo  Verificando dependencias do backend...
pip install -r "%ROOT%\backend\requirements.txt" --quiet
echo  Dependencias OK.
echo.

:: Backend - usa /d para setar diretorio sem aspas aninhadas
echo  [1/2] Iniciando Backend (FastAPI na porta 8000)...
start "Backend - FastAPI" /d "%ROOT%\backend" cmd /k "python -m uvicorn app.main:app --reload"

:: Aguarda o backend subir
timeout /t 4 /nobreak >nul

:: Frontend
echo  [2/2] Iniciando Frontend (React na porta 5173)...
start "Frontend - React" /d "%ROOT%\frontend" cmd /k "npm run dev"

:: Aguarda o frontend e abre o navegador
timeout /t 5 /nobreak >nul

echo.
echo  Abrindo navegador...
start http://localhost:5173

echo.
echo  Projeto rodando!
echo    Frontend : http://localhost:5173
echo    Backend  : http://localhost:8000/docs
echo.
echo  Feche as janelas "Backend" e "Frontend" para encerrar.
echo.
pause

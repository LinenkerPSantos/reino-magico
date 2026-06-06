@echo off
title RPG Reino Magico - Servidor
cd /d "%~dp0"
echo.
echo  =============================================
echo   RPG Reino Magico - Iniciando servidor...
echo  =============================================
echo.
echo  Acesse: http://localhost:5000
echo  Para encerrar: feche esta janela ou Ctrl+C
echo.
python server.py
pause

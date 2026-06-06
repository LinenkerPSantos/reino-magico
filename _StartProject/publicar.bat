@echo off
chcp 65001 >nul
title Reino Magico - Publicar atualizacao

set "ROOT=%~dp0.."

echo.
echo  =============================================
echo   REINO MAGICO - Publicar no GitHub
echo  =============================================
echo.

:: Vai para a raiz do projeto
cd /d "%ROOT%"

:: Mostra o que foi alterado
echo  Arquivos modificados:
git status --short
echo.

:: Pede a mensagem do commit
set /p MSG= Digite a mensagem do commit:

if "%MSG%"=="" (
  echo  Mensagem vazia. Usando mensagem padrao...
  set "MSG=update: atualizacao do projeto"
)

echo.
echo  [1/3] Adicionando arquivos...
git add -A
if errorlevel 1 goto :erro

echo  [2/3] Criando commit: "%MSG%"
git commit -m "%MSG%"
if errorlevel 1 goto :erro

echo  [3/3] Enviando para o GitHub...
git push
if errorlevel 1 goto :erro

echo.
echo  =============================================
echo   Publicado com sucesso!
echo   O deploy sera feito automaticamente.
echo  =============================================
echo.
pause
exit /b 0

:erro
echo.
echo  ERRO ao executar o passo acima.
echo  Verifique sua conexao e se o Git esta configurado.
echo.
pause
exit /b 1

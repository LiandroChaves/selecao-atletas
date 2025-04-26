@echo off
title Iniciando Sistema Seleção de Atletas
color 0A

:: Armazena o caminho da pasta onde o script .bat está
set "SCRIPT_DIR=%~dp0"
echo Caminho do script: %SCRIPT_DIR%

:: Procurar pela pasta "selecao-atletas" e entrar nela
cd /d "%SCRIPT_DIR%"
if not exist "selecao-atletas" (
    echo ERRO: A pasta "selecao-atletas" não foi encontrada.
    pause
    exit /b
)
cd selecao-atletas
echo Caminho após entrar na pasta selecao-atletas: %cd%

:: Vai para o diretório do backend
if exist "backend" (
    echo Instalando dependências do backend...
    cd backend
    call npm install
    echo Iniciando backend...
    start cmd /k "npm run dev"
) else (
    echo ERRO: A pasta 'backend' não foi encontrada.
)

:: Voltar para a pasta selecao-atletas antes de entrar no frontend
cd /d "%SCRIPT_DIR%selecao-atletas"

:: Vai para o diretório do frontend
if exist "frontend" (
    echo Instalando dependências do frontend...
    cd frontend
    call npm install
    echo Iniciando frontend...
    start cmd /k "npm start"
) else (
    echo ERRO: A pasta 'frontend' não foi encontrada. Caminho atual: %cd%
)

echo Sistema iniciado! Aguarde as janelas do backend e frontend abrirem.
pause

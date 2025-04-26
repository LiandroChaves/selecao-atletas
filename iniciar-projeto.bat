@echo off
title Iniciando Sistema Seleção de Atletas
color 0A

echo Instalando dependências do backend...
cd backend
call npm install

echo Iniciando backend...
start cmd /k "npm start"

cd ..
echo Instalando dependências do frontend...
cd frontend
call npm install

echo Iniciando frontend...
start cmd /k "npm start"

echo Sistema iniciado! Aguarde as janelas do backend e frontend abrirem.
pause

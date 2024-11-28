@echo off
docker-compose up -d

REM Aguarda alguns segundos para garantir que os serviços estejam em execução
timeout /t 20

REM Abre o site do Google no navegador padrão
start "" "http://127.0.0.1/servicos.html"
start "" "http://127.0.0.1/contato.html"
start "" "http://127.0.0.1:5050/login"

REM Mantém a janela do prompt de comando aberta
pause
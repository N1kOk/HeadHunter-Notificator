@echo off
set REGISTRY_ID="crpnk1palh5c8onk8l56"
set /p TELEGRAM=<%~dp0..\env\TELEGRAM_BOT_TOKEN
set /p YC=<%~dp0..\env\YC_OAUTH_TOKEN

if "%REGISTRY_ID%"=="" (
    echo "[ERROR]: REGISTRY_ID is not defined"
    exit 1
)

if "%TELEGRAM%"=="" (
    echo "[ERROR]: TELEGRAM is not defined"
    exit 1
)

if "%YC%"=="" (
    echo "[ERROR]: YC is not defined"
    exit 1
)

docker image rm cr.yandex/%REGISTRY_ID%/hh
docker build -t cr.yandex/%REGISTRY_ID%/hh %~dp0..\
docker push cr.yandex/%REGISTRY_ID%/hh

if %ERRORLEVEL% neq 0 (
    echo "[ERROR]: Docker error"
    exit 1
)

yc serverless container revision deploy ^
  --container-name test ^
  --image cr.yandex/crpnk1palh5c8onk8l56/hh ^
  --cores 1 ^
  --memory 128MB ^
  --concurrency 1 ^
  --execution-timeout 10s ^
  --service-account-id ajecao5qs3hlthnoiln9 ^
  --environment TELEGRAM_BOT_TOKEN=%TELEGRAM%,YC_OAUTH_TOKEN=%YC%

if %ERRORLEVEL% neq 0 (
    echo "[ERROR]: Yandex cloud error"
    exit 1
)
@echo off
chcp 65001 >nul

echo ========================================
echo   OpenClaw Skills Production
echo ========================================
echo.

:: 检查服务是否已在运行
netstat -ano | findstr ":3000" | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo 服务已在运行: http://localhost:3000
    echo.
    set /p OPEN="是否打开浏览器？(Y/N): "
    if /i "%OPEN%"=="Y" start http://localhost:3000
    exit /b
)

echo 启动服务...
echo.

:: 尝试检测并配置 cron (使用 --delivery-mode none)
where openclaw >nul 2>&1
if not errorlevel 1 (
    echo 配置自动记录功能...
    set "SCRIPT_PATH=%CD%\scripts\auto-record-conversations.js"
    openclaw cron list | findstr /C:"auto-record" >nul
    if errorlevel 1 (
        openclaw cron add --name "auto-record-conversations" --every-ms 60000 --session-target isolated --delivery-mode none -- "node \"%SCRIPT_PATH%\"" >nul 2>&1
    )
)

npm start

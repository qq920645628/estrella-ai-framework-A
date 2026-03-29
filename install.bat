@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   OpenClaw Skills Production 一键安装
echo ========================================
echo.

set "ERRORS=0"

echo [1/4] 检查 Node.js 环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo   ✗ 未检测到 Node.js
    echo   请先安装 Node.js: https://nodejs.org/
    set ERRORS=1
    goto :error
)
echo   ✓ Node.js 已安装

echo.
echo [2/4] 安装依赖包（约 3-5 分钟）...
if not exist "node_modules" (
    call npm install --legacy-peer-deps >nul 2>&1
    if errorlevel 1 (
        echo   ✗ 依赖安装失败
        set ERRORS=1
        goto :error
    )
)
echo   ✓ 依赖安装完成

echo.
echo [3/4] 编译 TypeScript...
call npx tsc --project tsconfig.json --skipLibCheck --transpileOnly >nul 2>&1
if errorlevel 1 (
    echo   ✗ 编译失败
    set ERRORS=1
    goto :error
)
echo   ✓ 编译完成

echo.
echo [4/4] 初始化数据库...
if not exist "data" mkdir data
if not exist "backups" mkdir backups
echo   ✓ 数据库就绪

echo.
echo ========================================
echo   ✓ 安装完成！
echo ========================================
echo.
echo 服务地址: http://localhost:3000
echo.
echo 启动命令: npm start
echo 或双击: start.bat
echo.

set /p STARTNOW="是否现在启动服务？(Y/N): "
if /i "%STARTNOW%"=="Y" (
    echo.
    echo 启动服务...
    start http://localhost:3000
    npm start
) else (
    echo 可以随时运行 start.bat 启动
    pause
)
exit /b 0

:error
echo.
echo ========================================
echo   ✗ 安装失败
echo ========================================
pause
exit /b 1

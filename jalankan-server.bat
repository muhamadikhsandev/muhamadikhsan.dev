@echo off
title Portfolio Muhamad Ikhsan - Vue 3 Dev Server
echo ========================================================
echo          MENJALANKAN VITE DEV SERVER Portfolio Muhamad Ikhsan
echo ========================================================
echo.
echo Server lokal sedang berjalan di: http://localhost:8000
echo Membuka aplikasi di browser...
echo.
start http://localhost:3000
pnpm dev
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Gagal menjalankan pnpm dev. Mencoba npx vite...
    npx vite --port 8000 --host
)
pause

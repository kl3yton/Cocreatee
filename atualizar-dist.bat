@echo off
title Atualizando dist...
echo.
echo  ==========================================
echo   CoCreate - Atualizando pasta dist
echo  ==========================================
echo.

echo [1/5] Criando estrutura de pastas...
if not exist "dist\css" mkdir dist\css
if not exist "dist\js"  mkdir dist\js
if not exist "dist\img" mkdir dist\img
echo       OK

echo [2/5] Copiando index.html...
copy /Y "index.html" "dist\index.html" >nul
echo       OK

echo [3/5] Copiando CSS...
copy /Y "css\*.css" "dist\css\" >nul
echo       OK

echo [4/5] Copiando JS...
copy /Y "js\*.js" "dist\js\" >nul
echo       OK

echo [5/5] Copiando imagens...
copy /Y "img\*.webp"  "dist\img\" >nul
copy /Y "img\*.png"   "dist\img\" >nul
copy /Y "img\*.jpg"   "dist\img\" >nul
copy /Y "img\*.jpeg"  "dist\img\" >nul
copy /Y "img\*.mp4"   "dist\img\" >nul
echo       OK

echo.
echo  ==========================================
echo   dist atualizado! Pode subir na Hostinger.
echo  ==========================================
echo.
pause

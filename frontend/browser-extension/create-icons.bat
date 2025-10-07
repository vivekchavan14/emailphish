@echo off
echo PhishMail Guard - Icon Creation Helper
echo =====================================
echo.
echo You need to create 4 PNG icon files in the icons/ directory:
echo - icon16.png (16x16 pixels)
echo - icon32.png (32x32 pixels)
echo - icon48.png (48x48 pixels)
echo - icon128.png (128x128 pixels)
echo.
echo OPTION 1 - Quick Start (Basic Icons):
echo You can temporarily use any PNG images renamed to these filenames
echo to get the extension working immediately.
echo.
echo OPTION 2 - Professional Icons:
echo 1. Use icon-template.svg as a base
echo 2. Convert to PNG using online tools like:
echo    - https://cloudconvert.com/svg-to-png
echo    - https://convertio.co/svg-png/
echo    - https://www.zamzar.com/convert/svg-to-png/
echo 3. Create 4 different sizes (16, 32, 48, 128 pixels)
echo.
echo OPTION 3 - Use Paint/GIMP:
echo 1. Create a simple blue circle with white shield/checkmark
echo 2. Save as PNG in required sizes
echo.
echo Press any key when you have created the icons...
pause > nul

echo.
echo Checking for icon files...
if exist "icons\icon16.png" (
    echo [OK] icon16.png found
) else (
    echo [MISSING] icon16.png
)

if exist "icons\icon32.png" (
    echo [OK] icon32.png found
) else (
    echo [MISSING] icon32.png
)

if exist "icons\icon48.png" (
    echo [OK] icon48.png found
) else (
    echo [MISSING] icon48.png
)

if exist "icons\icon128.png" (
    echo [OK] icon128.png found
) else (
    echo [MISSING] icon128.png
)

echo.
echo Once all icons are created, follow these steps to install:
echo 1. Open Chrome or Edge
echo 2. Go to chrome://extensions/ or edge://extensions/
echo 3. Enable "Developer mode" (toggle in top right)
echo 4. Click "Load unpacked"
echo 5. Select this folder: %cd%
echo.
pause
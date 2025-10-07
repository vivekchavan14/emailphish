@echo off
echo Opening browser extension folder for Chrome...
echo.
echo This folder contains your PhishMail Guard extension files:
echo - manifest.json
echo - background.js  
echo - content.js
echo - popup.html
echo - icons folder
echo.
echo INSTRUCTIONS:
echo 1. This Windows Explorer window should show all extension files
echo 2. Copy this path: %cd%
echo 3. In Chrome extensions page, click "Load unpacked"
echo 4. Paste the path in the address bar of the dialog
echo 5. Press Enter and click "Select Folder"
echo.
echo Current folder: %cd%
echo.
pause
explorer "%cd%"
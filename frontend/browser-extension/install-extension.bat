@echo off
echo ========================================
echo  PhishMail Guard Extension Installer
echo ========================================
echo.
echo This script will help you install the extension.
echo.
echo STEP 1: Copy the extension path to clipboard
echo Extension folder path:
echo %CD%
echo.
echo STEP 2: Manual installation steps:
echo 1. Open Chrome and go to: chrome://extensions/
echo 2. Enable "Developer mode" (toggle in top-right)
echo 3. Click "Load unpacked"
echo 4. Navigate to and select this folder: %CD%
echo.
echo STEP 3: Test the extension
echo 1. Go to Gmail, Outlook, or Yahoo Mail
echo 2. Open an email
echo 3. Look for popup notifications
echo.
echo Press any key to:
echo - Open Chrome extensions page
echo - Open a test file to verify popups work
echo.
pause

echo Opening Chrome extensions page...
start chrome://extensions/

echo.
echo Opening test file...
start "" "FINAL-TEST.html"

echo.
echo Installation help completed!
echo.
echo If you need more help:
echo - Check README.md in this folder
echo - Look at TESTING.md for troubleshooting
echo.
pause
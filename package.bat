@echo off
REM Package the Aviator game folder into Aviator.zip using PowerShell
powershell -Command "Compress-Archive -Path (Get-ChildItem -Path . -Exclude package.bat,Aviator.zip) -DestinationPath Aviator.zip -Force"
echo Created Aviator.zip
pause

@echo off
chcp 65001 >nul
cd /d "%~dp0"
python -c "import webview, pystray, PIL" 2>nul || (echo 필요한 패키지 설치 중... & pip install pywebview pystray pillow)
start "" pythonw MarketDesk.py %*

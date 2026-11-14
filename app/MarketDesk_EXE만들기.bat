@echo off
chcp 65001 >nul
cd /d "%~dp0"
pip install pywebview pystray pillow pyinstaller
pyinstaller --noconfirm --windowed --name MarketDesk --collect-all webview MarketDesk.py
echo.
echo 완료: dist\MarketDesk\MarketDesk.exe  (HTML 은 같은 폴더/E:\MarketDesk 의 MarketDesk_Chart.html 을 자동으로 읽습니다)
pause

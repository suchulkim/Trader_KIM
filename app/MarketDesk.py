# -*- coding: utf-8 -*-
"""
MarketDesk.py — Market Desk 데스크톱 (Edge WebView2)

Windows 에 이미 설치된 Edge WebView2(= Chrome/Edge 와 같은 엔진·같은 GPU 경로)로 HTML 을 띄웁니다.
  - 브라우저와 같은 속도 (QtWebEngine 버전의 4K 깜빡임/느림 해결 목적)
  - MarketDesk_Chart.html 을 경로로 직접 읽음 → 파일 저장 시 자동 새로고침
  - 창을 닫으면 트레이로 내려가 계속 실행 (알림 유지) / 트레이 우클릭 → 종료
  - HTML 의 알림(Notification)을 Windows 트레이 알림으로 전달
  - 차트 설정·알림(localStorage)은 %APPDATA%\\MarketDesk\\webview 에 영구 보관
  - 창 제목에 심볼·현재가·등락률 표시, 최대화로 시작

설치:  pip install pywebview pystray pillow
실행:  python MarketDesk.py
       python MarketDesk.py --html "E:\\MarketDesk\\MarketDesk_Chart.html" --ticker BTC --bar 15m
       python MarketDesk.py --hidden      (창 없이 트레이로만 시작)
"""
import os
import sys
import json
import time
import threading
import argparse
import shutil
import subprocess
from pathlib import Path

NO_TRAY = False
APP = "MarketDesk"            # 내부용 이름: 설정·저장 폴더(%APPDATA%\MarketDesk)
APP_TITLE = "Market Desk"     # 화면에 보이는 이름
HTML_NAME = "MarketDesk_Chart.html"
LEGACY_APP = "Trader_KIM"            # 구 이름 (설정 이전용)
LEGACY_HTML = "Trader_KIM_Chart.html"
_BASE = Path(os.environ.get("APPDATA") or Path.home() / ".config")
DATA_DIR = _BASE / APP
CFG_FILE = DATA_DIR / "config.json"


def _migrate_legacy():
    """구 이름(Trader_KIM)의 설정·차트 설정·알림(localStorage)을 새 폴더로 1회 복사.
    (구 폴더는 지우지 않고 그대로 둡니다. 확인 후 직접 삭제하세요)"""
    old, tmp = _BASE / LEGACY_APP, _BASE / (APP + ".migrating")
    if DATA_DIR.exists() or not old.exists():
        return
    try:
        shutil.rmtree(tmp, ignore_errors=True)
        shutil.copytree(old, tmp)
        cfg = tmp / "config.json"
        if cfg.exists():                                   # 구 HTML 경로는 가져오지 않음 (새 파일을 찾게)
            try:
                c = json.loads(cfg.read_text(encoding="utf-8"))
                c.pop("html", None)
                cfg.write_text(json.dumps(c, ensure_ascii=False, indent=1), encoding="utf-8")
            except Exception:
                pass
        tmp.rename(DATA_DIR)
    except Exception:
        shutil.rmtree(tmp, ignore_errors=True)


_migrate_legacy()
DATA_DIR.mkdir(parents=True, exist_ok=True)

# 최소화/가림/트레이 상태에서도 타이머·웹소켓이 감속되지 않게 (알림 신뢰성) — WebView2 생성 전에 설정
os.environ["WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS"] = (
    os.environ.get("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "") + " "
    "--disable-renderer-backgrounding --disable-background-timer-throttling "
    "--disable-backgrounding-occluded-windows --disable-features=CalculateNativeWinOcclusion "
    "--autoplay-policy=no-user-gesture-required").strip()

import webview                      # noqa: E402  (pywebview)
try:
    import pystray                  # noqa: E402
except Exception:                   # 트레이를 못 쓰는 환경(리눅스 헤드리스 등)
    pystray = None
from PIL import Image, ImageDraw, ImageFont   # noqa: E402


LOG = DATA_DIR / "wv.log"


def log(*a):
    try:
        with open(LOG, "a", encoding="utf-8") as f:
            f.write(time.strftime("%H:%M:%S ") + " ".join(str(x) for x in a) + "\n")
    except Exception:
        pass


# ───────────────────────── 설정 ─────────────────────────
def load_cfg():
    try:
        return json.loads(CFG_FILE.read_text(encoding="utf-8"))
    except Exception:
        return {}


def save_cfg(**kw):
    c = load_cfg()
    c.update(kw)
    try:
        CFG_FILE.write_text(json.dumps(c, ensure_ascii=False, indent=1), encoding="utf-8")
    except Exception:
        pass


def find_html(cli):
    here = Path(sys.executable).parent if getattr(sys, "frozen", False) else Path(__file__).resolve().parent
    env = os.environ.get("MARKETDESK_HTML") or os.environ.get("TRADER_KIM_HTML")
    cands = [cli, env, load_cfg().get("html"),
             here / HTML_NAME, Path.cwd() / HTML_NAME, Path("E:/MarketDesk") / HTML_NAME, here.parent / HTML_NAME,
             # 아직 파일 이름을 안 바꾼 경우의 임시 대체 (구 이름)
             here / LEGACY_HTML, Path.cwd() / LEGACY_HTML, Path("E:/Trader_KIM") / LEGACY_HTML]
    for c in cands:
        if c and Path(c).is_file():
            return str(Path(c).resolve())
    return None


def make_icon(size=64):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((2, 2, size - 2, size - 2), radius=size // 5, fill=(41, 98, 255, 255))
    try:
        f = ImageFont.truetype("arialbd.ttf", int(size * .46))
    except Exception:
        f = ImageFont.load_default()
    d.text((size / 2, size / 2), "MD", fill="white", font=f, anchor="mm")
    return im


# ───────────────────────── JS ↔ Python 브리지 ─────────────────────────
class Api:
    """HTML(MarketDesk_Chart.html 안의 브리지)이 호출 — 파이썬 → JS 호출(evaluate_js)은 쓰지 않습니다
    (WebView2 에서 창이 '응답 없음' 으로 멈추는 원인이 될 수 있어 제거)"""
    # 주의: pywebview 는 js_api 객체의 '밑줄(_) 없는 속성'을 전부 재귀로 훑습니다.
    # App/Window 를 일반 속성으로 들고 있으면 창 내부 객체까지 끝없이 순회하며 UI 가 멈추므로(응답 없음) 반드시 _ 로 시작
    def __init__(self, app):
        self._app = app

    def notify(self, title, body=""):
        self._app.notify(title, body)
        return True

    def sync(self, href, title):
        self.app.on_sync(href, title)
        return True


class App:
    def __init__(self, html, ticker=None, bar=None, hidden=False):
        self.html, self.ticker, self.bar, self.hidden = html, ticker, bar, hidden
        self.quitting = False
        self.window = None
        self.last_href = None
        self.last_title = None
        self.bridge_seen = False
        self.icon = None
        self.on_top = False
        self._mtime = self._stat()

    # ── 파일/URL ──
    def _stat(self):
        try:
            return os.stat(self.html).st_mtime_ns
        except OSError:
            return 0

    def url(self):
        u = Path(self.html).as_uri()
        q = []
        if self.ticker:
            q.append("t=" + self.ticker)
        if self.bar:
            q.append("bar=" + self.bar)
        return u + ("?" + "&".join(q) if q else "")

    # ── 창 ──
    def start(self):
        # 창 크기는 OS 배율(DPI)과 단위가 엇갈리기 쉬워 직접 지정하지 않고 '최대화'로 시작합니다
        self.window = webview.create_window(
            APP_TITLE, self.url(), js_api=Api(self), background_color="#131722",
            hidden=self.hidden, maximized=True, text_select=True, zoomable=True, min_size=(900, 560))
        self.window.events.closing += self.on_closing
        log("start", self.url())
        if not os.environ.get("TK_NOTRAY") and not NO_TRAY:
            self.build_tray()
        webview.start(self.background, private_mode=False, storage_path=str(DATA_DIR / "webview"),
                      gui=os.environ.get("TK_GUI", "edgechromium"), icon=None)

    def on_sync(self, href, title):
        """HTML 이 2초마다 현재 주소(종목·봉 포함)와 제목을 알려줌 → 창 제목 갱신, 새로고침 때 같은 화면 복원"""
        if not self.bridge_seen:
            self.bridge_seen = True
            log("bridge connected")
        if href and href.startswith("file:"):
            self.last_href = href
        if title and title != self.last_title:
            self.last_title = title
            try:
                self.window.set_title(title)
                if self.icon:
                    self.icon.title = title[:120]
            except Exception as e:
                log("set_title", e)

    def on_closing(self):
        # X 버튼 → 트레이로 숨김 (종료는 트레이 메뉴). 종료 중이면 그대로 닫음
        self.save_geo()
        if self.quitting:
            return True
        try:
            self.window.hide()
            self.notify(APP_TITLE, "트레이에서 계속 실행 중입니다 (알림 유지). 종료: 트레이 우클릭 → 종료")
        except Exception:
            return True
        return False

    def save_geo(self):
        save_cfg(html=self.html)

    def show(self):
        try:
            self.window.show()
            self.window.restore()
        except Exception:
            pass

    def reload(self):
        try:
            self.window.load_url(self.last_href or self.url())
        except Exception as e:
            log("reload", e)

    def toggle_top(self):
        self.on_top = not self.on_top
        try:
            self.window.on_top = self.on_top
        except Exception:
            pass

    def open_folder(self):
        try:
            os.startfile(os.path.dirname(self.html))      # Windows
        except Exception:
            try:
                subprocess.Popen(["xdg-open", os.path.dirname(self.html)])
            except Exception:
                pass

    def quit(self):
        self.quitting = True
        self.save_geo()
        try:
            if self.icon:
                self.icon.stop()
        except Exception:
            pass
        try:
            self.window.destroy()
        except Exception:
            os._exit(0)

    # ── 트레이 / 알림 ──
    def build_tray(self):
        if pystray is None:
            return
        menu = pystray.Menu(
            pystray.MenuItem("창 열기", lambda *_: self.show(), default=True),
            pystray.MenuItem("새로고침", lambda *_: self.reload()),
            pystray.MenuItem("항상 위", lambda *_: self.toggle_top(), checked=lambda _i: self.on_top),
            pystray.MenuItem("HTML 폴더 열기", lambda *_: self.open_folder()),
            pystray.Menu.SEPARATOR,
            pystray.MenuItem("종료", lambda *_: self.quit()),
        )
        self.icon = pystray.Icon(APP, make_icon(), APP_TITLE, menu)
        self.icon.run_detached()

    def notify(self, title, body=""):
        try:
            if self.icon:
                self.icon.notify(body or " ", title or APP_TITLE)
        except Exception:
            pass

    # ── 백그라운드: 파일 감시 + 창 제목 동기화 ──
    def background(self):
        while not self.quitting:
            time.sleep(1.0)
            m = self._stat()
            if m and m != self._mtime:
                time.sleep(0.5)                       # 저장이 끝날 때까지 잠깐 대기
                self._mtime = self._stat()
                log("html changed -> reload")
                self.reload()


def main():
    ap = argparse.ArgumentParser(description="Market Desk (WebView2)")
    ap.add_argument("--html")
    ap.add_argument("--ticker")
    ap.add_argument("--bar")
    ap.add_argument("--hidden", action="store_true")
    ap.add_argument("--notray", action="store_true", help="(문제 진단용) 트레이 아이콘 끄기")
    a = ap.parse_args()
    global NO_TRAY
    NO_TRAY = a.notray
    html = find_html(a.html)
    if not html:
        try:
            import tkinter
            from tkinter import filedialog
            r = tkinter.Tk(); r.withdraw()
            html = filedialog.askopenfilename(title="MarketDesk_Chart.html 위치 선택", filetypes=[("HTML", "*.html *.htm")])
            r.destroy()
        except Exception:
            html = None
        if not html:
            print("MarketDesk_Chart.html 을 찾지 못했습니다. --html 로 경로를 지정하세요.")
            return 1
    save_cfg(html=html)
    App(html, a.ticker, a.bar, a.hidden).start()
    return 0


if __name__ == "__main__":
    sys.exit(main())

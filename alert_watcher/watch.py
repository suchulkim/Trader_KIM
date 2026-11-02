#!/usr/bin/env python3
"""Trader_KIM 가격 알람 감시기 (GitHub Actions용)

- 차트(Trader_KIM_Chart.html)가 비공개 Gist의 alerts.json에 저장한 알람을 읽어
  거래소 시세를 POLL_SEC마다 확인하고, 조건을 만족하면 텔레그램으로 보냅니다.
- 발동된 알람은 Gist에 다시 기록(on=false, fired, firedPx, tgSent)해서
  열려 있는 모든 브라우저에도 반영됩니다.
- 브라우저가 먼저 발동시킨 알람도 텔레그램이 아직 안 갔으면 보내 줍니다.
- 외부 패키지 없이 파이썬 표준 라이브러리만 사용합니다.

환경 변수 (GitHub Secrets)
  GIST_TOKEN          classic PAT (gist 권한)
  GIST_ID             알람이 저장된 Gist ID
  TELEGRAM_BOT_TOKEN  BotFather에게 받은 봇 토큰
  TELEGRAM_CHAT_ID    메시지를 받을 채팅 ID
선택
  RUN_MINUTES  한 번 실행에서 감시할 시간(분, 기본 350)
  POLL_SEC     시세 확인 주기(초, 기본 15)
  TEST_MESSAGE 1이면 시작할 때 텔레그램 테스트 메시지 전송
"""
import json
import os
import sys
import time
import html
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone, timedelta

GIST_TOKEN = os.environ.get("GIST_TOKEN", "").strip()
GIST_ID = os.environ.get("GIST_ID", "").strip()
TG_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "").strip()
TG_CHAT = os.environ.get("TELEGRAM_CHAT_ID", "").strip()
RUN_SEC = int(float(os.environ.get("RUN_MINUTES", "350")) * 60)
POLL = max(5, int(os.environ.get("POLL_SEC", "15")))
GIST_EVERY = 30            # Gist 다시 읽는 주기(초)
STATE_EVERY = 300          # 마지막 시세 저장 주기(초)
REPEAT_GAP_MS = 60_000     # 반복 알람 최소 간격 (차트와 동일)
KST = timezone(timedelta(hours=9))
COND_TXT = {"cross": "교차", "up": "상향 돌파", "down": "하향 돌파"}
UA = {"User-Agent": "Trader_KIM-alert-watcher/1.0"}

OKX_HOSTS = ["https://www.okx.com", "https://aws.okx.com"]
BINANCE_HOSTS = ["https://fapi.binance.com", "https://fapi1.binance.com", "https://fapi2.binance.com"]
BITGET = "https://api.bitget.com"
COINBASE = "https://api.exchange.coinbase.com"


def log(*a):
    print(datetime.now(KST).strftime("%m-%d %H:%M:%S"), *a, flush=True)


def http(method, url, body=None, headers=None, timeout=15):
    h = dict(UA)
    if headers:
        h.update(headers)
    data = None
    if body is not None:
        data = json.dumps(body).encode()
        h["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=h, method=method)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode() or "null")


# ───────────── Gist ─────────────
def gh(method, path, body=None):
    return http(method, "https://api.github.com" + path, body,
                {"Authorization": "Bearer " + GIST_TOKEN, "Accept": "application/vnd.github+json"})


def gist_files():
    g = gh("GET", "/gists/" + GIST_ID)
    out = {}
    for name, f in (g.get("files") or {}).items():
        txt = f.get("content") or ""
        if f.get("truncated") and f.get("raw_url"):
            with urllib.request.urlopen(urllib.request.Request(f["raw_url"], headers=UA), timeout=15) as r:
                txt = r.read().decode()
        try:
            out[name] = json.loads(txt) if txt else {}
        except Exception:
            out[name] = {}
    return out


def read_doc():
    doc = gist_files().get("alerts.json") or {}
    if not isinstance(doc, dict):
        doc = {}
    doc.setdefault("alerts", [])
    doc.setdefault("tomb", {})
    return doc


def write_files(files):
    gh("PATCH", "/gists/" + GIST_ID, {"files": {k: {"content": json.dumps(v, ensure_ascii=False, indent=1)} for k, v in files.items()}})


def commit_changes(changed):
    """발동 결과를 Gist에 반영. 브라우저와 같은 규칙(mt가 최신인 쪽이 이김)으로 다시 읽고 병합 후 저장."""
    if not changed:
        return
    for attempt in range(3):
        try:
            doc = read_doc()
            by_id = {a.get("id"): a for a in doc["alerts"] if isinstance(a, dict)}
            for aid, patch in changed.items():
                a = by_id.get(aid)
                if a is None:                       # 그 사이에 삭제됨
                    continue
                if (a.get("mt") or 0) > patch["_base_mt"]:
                    # 그 사이 브라우저에서 수정됨 → tgSent만 반영(텔레그램 중복 방지), 나머지는 브라우저 값 유지
                    if "tgSent" in patch:
                        a["tgSent"] = patch["tgSent"]
                        a["mt"] = int(time.time() * 1000)
                    continue
                for k, v in patch.items():
                    if not k.startswith("_"):
                        a[k] = v
                a["mt"] = int(time.time() * 1000)
            doc["updated"] = int(time.time() * 1000)
            doc["by"] = "github"
            doc["v"] = 1
            write_files({"alerts.json": doc})
            return
        except Exception as e:
            log("Gist 쓰기 실패, 재시도", attempt + 1, e)
            time.sleep(3)


# ───────────── 시세 ─────────────
def parse_key(k):
    k = str(k)
    if ":" not in k:
        return "okx", k + "-USDT-SWAP"
    ex, sym = k.split(":", 1)
    return ex.lower(), sym


warned = set()


def warn_once(key, msg):
    if key in warned:
        return
    warned.add(key)
    log("⚠", msg)
    tg(f"⚠️ <b>알람 감시 경고</b>\n{html.escape(msg)}")


def fetch_prices(keys):
    px = {}
    need = {}
    for k in keys:
        ex, sym = parse_key(k)
        need.setdefault(ex, []).append((k, sym))

    if "okx" in need:
        ok = False
        for host in OKX_HOSTS:
            try:
                j = http("GET", host + "/api/v5/market/tickers?instType=SWAP")
                m = {t["instId"]: float(t["last"]) for t in (j or {}).get("data", []) if t.get("last")}
                if m:
                    for k, sym in need["okx"]:
                        if sym in m:
                            px[k] = m[sym]
                    ok = True
                    break
            except Exception as e:
                log("OKX 실패", host, e)
        if not ok:
            warn_once("okx", "OKX 시세를 가져오지 못했습니다 (GitHub 서버에서 접속이 막혔을 수 있음). OKX 알람이 감시되지 않습니다.")

    if "binance" in need:
        ok = False
        for host in BINANCE_HOSTS:
            try:
                j = http("GET", host + "/fapi/v1/ticker/price")
                m = {t["symbol"]: float(t["price"]) for t in (j or [])}
                for k, sym in need["binance"]:
                    if sym in m:
                        px[k] = m[sym]
                ok = True
                break
            except Exception as e:
                log("Binance 실패", host, e)
        if not ok:
            warn_once("binance", "Binance 선물 시세를 가져오지 못했습니다 (미국 서버 IP 차단 가능성). Binance 알람은 차트가 열려 있을 때만 울립니다.")

    if "bitget" in need:
        try:
            j = http("GET", BITGET + "/api/v2/mix/market/tickers?productType=USDT-FUTURES")
            m = {t["symbol"]: float(t["lastPr"]) for t in (j or {}).get("data", []) if t.get("lastPr")}
            for k, sym in need["bitget"]:
                if sym in m:
                    px[k] = m[sym]
        except Exception as e:
            log("Bitget 실패", e)
            warn_once("bitget", "Bitget 시세를 가져오지 못했습니다.")

    for k, sym in need.get("coinbase", []):
        try:
            j = http("GET", f"{COINBASE}/products/{urllib.parse.quote(sym)}/ticker")
            if j and j.get("price"):
                px[k] = float(j["price"])
        except Exception as e:
            log("Coinbase 실패", sym, e)
    return px


# ───────────── 텔레그램 ─────────────
def tg(text):
    if not (TG_TOKEN and TG_CHAT):
        log("텔레그램 미설정:", text.replace("\n", " | "))
        return False
    try:
        r = http("POST", f"https://api.telegram.org/bot{TG_TOKEN}/sendMessage",
                 {"chat_id": TG_CHAT, "text": text, "parse_mode": "HTML", "disable_web_page_preview": True})
        return bool(r and r.get("ok"))
    except Exception as e:
        log("텔레그램 전송 실패", e)
        return False


def fmt(p):
    p = float(p)
    if p >= 1000:
        return f"{p:,.1f}"
    if p >= 10:
        return f"{p:,.2f}"
    if p >= 1:
        return f"{p:,.3f}"
    return f"{p:,.5f}"


def disp(k):
    ex, sym = parse_key(k)
    return k if ex == "okx" else f"{sym} ({ex.upper()})"


def kst(ms):
    return datetime.fromtimestamp(ms / 1000, KST).strftime("%m/%d %H:%M:%S")


def alert_msg(a, px, how, src):
    lines = [f"🔔 <b>{html.escape(disp(a['tk']))} {fmt(a['p'])} {how}</b>",
             f"현재가 <b>{fmt(px)}</b> · {kst(a['fired'])} KST",
             f"조건: {COND_TXT.get(a.get('cond'), '교차')}" + (" · 매번" if a.get("repeat") else " · 1회 (꺼짐)")]
    if a.get("note"):
        lines.append("메모: " + html.escape(str(a["note"])))
    if src:
        lines.append(f"<i>{src}</i>")
    return "\n".join(lines)


def needs_tg(a):
    f = a.get("fired")
    if not f:
        return False
    s = a.get("tgSent")
    return not s or f > s + REPEAT_GAP_MS


# ───────────── 메인 루프 ─────────────
def main():
    if not (GIST_TOKEN and GIST_ID):
        log("GIST_TOKEN / GIST_ID 시크릿이 없습니다.")
        sys.exit(1)
    if not (TG_TOKEN and TG_CHAT):
        log("TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID 시크릿이 없습니다 — 로그로만 출력합니다.")

    files = gist_files()
    state = files.get("watch_state.json") or {}
    prev = {}
    now_ms = int(time.time() * 1000)
    for k, v in (state.get("px") or {}).items():          # 직전 실행의 마지막 시세 (1시간 이내만)
        if isinstance(v, list) and len(v) == 2 and now_ms - v[1] < 3_600_000:
            prev[k] = float(v[0])
    log(f"시작 · 감시 {RUN_SEC // 60}분 · 주기 {POLL}초 · 이전 시세 {len(prev)}개 이어받음")

    if os.environ.get("TEST_MESSAGE") == "1":
        ok = tg("✅ <b>Trader_KIM 알람 감시기 테스트</b>\nGitHub Actions → 텔레그램 연결이 정상입니다.")
        log("테스트 메시지", "성공" if ok else "실패")

    t_end = time.time() + RUN_SEC
    doc, t_doc, t_state = None, 0, time.time()
    last_px = {}
    while time.time() < t_end:
        loop_t = time.time()
        try:
            if doc is None or loop_t - t_doc >= GIST_EVERY:
                doc = read_doc()
                t_doc = loop_t
            alerts = [a for a in doc["alerts"] if isinstance(a, dict) and a.get("id") and a.get("tk")]
            changed = {}

            # ① 브라우저에서 먼저 발동됐지만 텔레그램이 아직 안 간 알람
            for a in alerts:
                if needs_tg(a) and int(time.time() * 1000) - a["fired"] < 30 * 60_000:   # 최근 30분 이내 발동분만
                    how = "알람 발동"
                    if a.get("firedPx") is not None:
                        how = "상향 돌파" if float(a["firedPx"]) >= float(a["p"]) else "하향 돌파"
                    if tg(alert_msg(a, a.get("firedPx") or a["p"], how, "차트(브라우저)에서 감지")):
                        a["tgSent"] = a["fired"]
                        changed[a["id"]] = {"tgSent": a["fired"], "_base_mt": a.get("mt") or 0}

            # ② 시세 확인 → 교차 판정 (차트와 같은 규칙)
            active = [a for a in alerts if a.get("on")]
            keys = sorted({a["tk"] for a in active})
            px = fetch_prices(keys) if keys else {}
            now_ms = int(time.time() * 1000)
            for k, p in px.items():
                last_px[k] = [p, now_ms]
                q = prev.get(k)
                prev[k] = p
                if q is None or q == p:
                    continue
                for a in active:
                    if a["tk"] != k or not a.get("on"):
                        continue
                    lvl = float(a["p"])
                    up = q < lvl <= p
                    dn = q > lvl >= p
                    cond = a.get("cond") or "cross"
                    hit = up if cond == "up" else dn if cond == "down" else (up or dn)
                    if not hit:
                        continue
                    if a.get("repeat") and a.get("fired") and now_ms - a["fired"] < REPEAT_GAP_MS:
                        continue
                    base_mt = a.get("mt") or 0
                    a["fired"], a["firedPx"] = now_ms, p
                    if not a.get("repeat"):
                        a["on"] = False
                    how = "상향 돌파" if up else "하향 돌파"
                    patch = {"fired": now_ms, "firedPx": p, "on": a["on"], "_base_mt": base_mt}
                    if tg(alert_msg(a, p, how, "")):
                        a["tgSent"] = now_ms
                        patch["tgSent"] = now_ms
                    log("발동", k, a["p"], how, p)
                    changed[a["id"]] = {**changed.get(a["id"], {}), **patch}

            if changed:
                commit_changes(changed)
                doc = None                                  # 다음 루프에서 새로 읽기

            if loop_t - t_state >= STATE_EVERY and last_px:
                try:
                    write_files({"watch_state.json": {"px": last_px, "updated": now_ms}})
                except Exception as e:
                    log("상태 저장 실패", e)
                t_state = loop_t
        except urllib.error.HTTPError as e:
            log("HTTP 오류", e.code, e.reason)
            if e.code in (401, 404):
                warn_once("gist", f"Gist를 읽을 수 없습니다 ({e.code}) — GIST_ID / GIST_TOKEN 시크릿을 확인하세요.")
                time.sleep(60)
        except Exception as e:
            log("오류", repr(e))
        time.sleep(max(1.0, POLL - (time.time() - loop_t)))

    if last_px:
        try:
            write_files({"watch_state.json": {"px": last_px, "updated": int(time.time() * 1000)}})
        except Exception as e:
            log("상태 저장 실패", e)
    log("정상 종료 (다음 실행이 이어서 감시합니다)")


if __name__ == "__main__":
    main()

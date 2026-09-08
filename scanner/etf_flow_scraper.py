# -*- coding: utf-8 -*-
"""
etf_flow_scraper.py
Farside Investors(https://farside.co.uk)에서 미국 현물 BTC/ETH ETF의
일별 순유출입(Net Flow, US$ million)을 가져온다.

주의:
- Farside 페이지 구조는 예고 없이 바뀔 수 있다. 이 스크립트는 "테이블에서
  가장 최근 날짜 행을 찾아 종목별/합계 순유출입을 읽는다"는 원칙으로 짜여
  있고, 실제 컬럼 배치가 다르면 parse_flow_table()의 로직을 조정해야 한다.
- 종목 컬럼명(IBIT, FBTC 등)이 로고 이미지로만 들어있는 경우가 있어,
  헤더 텍스트가 비어있으면 <img alt="..">나 <abbr title="..">에서 라벨을
  찾아온다 (_header_label 참고).
- 처음 로컬에서 돌릴 때는 DEBUG=True로 두고, 콘솔에 찍히는
  "[DEBUG] header labels:" / "[DEBUG] latest row:" 출력을 보고 실제
  사이트와 맞는지 확인할 것.

저장:
  단독 실행(__main__) 시 조회 결과를 etf_flow_data.js로도 저장한다.
  OUTPUT_DIR 환경변수가 있으면 그 경로에(예: GitHub Actions의
  github.workspace), 없으면 현재 작업 디렉터리(".")에 저장한다.
  SECOND_OUTPUT_DIR을 추가로 지정하면 그 경로에도 한 번 더 저장한다
  (로컬 PC 병행 저장용, 예: E:\\Trader_KIM).
"""

import json
import os
import re
import sys
from datetime import datetime, timezone

import requests
from bs4 import BeautifulSoup

DEBUG = True

OUTPUT_DIR = os.environ.get("OUTPUT_DIR") or "."
SECOND_OUTPUT_DIR = os.environ.get("SECOND_OUTPUT_DIR") or ""

FARSIDE_URLS = {
    "BTC": "https://farside.co.uk/btc/",
    "ETH": "https://farside.co.uk/eth/",
}

# 서버가 봇 트래픽을 막지 않도록 일반 브라우저처럼 보이는 User-Agent 사용
HTTP_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    )
}


def _debug(*args):
    if DEBUG:
        print("[DEBUG]", *args, file=sys.stderr)


def _clean_number(cell_text):
    """'(12.3)' 같은 음수 표기나 '-', 빈 문자열, 콤마 등을 처리해서 float로 변환.
    파싱 불가하면 None."""
    if cell_text is None:
        return None
    t = cell_text.strip().replace(",", "")
    if t in ("", "-", "–", "—", "N/A"):
        return None
    negative = False
    if t.startswith("(") and t.endswith(")"):
        negative = True
        t = t[1:-1]
    t = t.replace("$", "")
    try:
        val = float(t)
    except ValueError:
        return None
    return -val if negative else val


def _header_label(cell):
    """헤더 셀에서 라벨을 뽑아낸다. 텍스트가 비어있으면 <img alt>나
    <abbr title>를 대신 찾는다 (종목 로고만 있는 헤더 대응)."""
    text = cell.get_text(strip=True)
    if text:
        return text
    img = cell.find("img")
    if img and img.get("alt"):
        return img.get("alt").strip()
    abbr = cell.find("abbr")
    if abbr and abbr.get("title"):
        return abbr.get("title").strip()
    if img and img.get("title"):
        return img.get("title").strip()
    return ""


def _parse_date_label(label):
    """Farside 날짜 라벨(예: '04 Sep 2026', '2026-09-04' 등) 파싱 시도."""
    label = label.strip()
    fmts = ["%d %b %Y", "%d %B %Y", "%Y-%m-%d", "%b %d, %Y", "%d/%m/%Y"]
    for fmt in fmts:
        try:
            return datetime.strptime(label, fmt)
        except ValueError:
            continue
    return None


def parse_flow_table(html):
    """Farside 페이지에서 "Total" 컬럼이 있는 테이블을 찾아, 가장 최근
    날짜 행을 {"date", "dateLabel", "byFund", "totalNetFlow"}로 반환한다.
    실패 시 None."""
    soup = BeautifulSoup(html, "html.parser")
    tables = soup.find_all("table")
    _debug(f"found {len(tables)} <table> elements")

    for t_idx, table in enumerate(tables):
        rows = table.find_all("tr")
        if len(rows) < 2:
            continue

        header_cells_raw = rows[0].find_all(["th", "td"])
        header_labels = [_header_label(c) for c in header_cells_raw]
        _debug(f"table[{t_idx}] header labels:", header_labels)

        total_idx = None
        for i, h in enumerate(header_labels):
            if h and "total" in h.lower():
                total_idx = i
                break
        if total_idx is None:
            _debug(f"table[{t_idx}] has no 'Total' column — skip")
            continue

        # 데이터 행 중 날짜로 파싱되는 행들을 모아 가장 최근 날짜를 취한다.
        # (Farside는 최신 날짜가 맨 위/맨 아래 둘 다 가능하므로 정렬로 처리)
        candidates = []
        for r in rows[1:]:
            cells = r.find_all(["td", "th"])
            if len(cells) != len(header_labels):
                continue
            date_text = cells[0].get_text(strip=True)
            parsed_date = _parse_date_label(date_text)
            if parsed_date is None:
                continue
            candidates.append((parsed_date, date_text, cells))

        _debug(f"table[{t_idx}] date-parseable rows: {len(candidates)}")
        if not candidates:
            continue

        candidates.sort(key=lambda x: x[0])
        latest_date, latest_label, latest_cells = candidates[-1]
        latest_texts = [c.get_text(strip=True) for c in latest_cells]
        _debug("latest row:", latest_texts)

        by_fund = {}
        for i, label in enumerate(header_labels):
            if i == 0 or i == total_idx or not label:
                continue
            val = _clean_number(latest_texts[i])
            if val is not None:
                by_fund[label] = val

        total_val = _clean_number(latest_texts[total_idx])

        return {
            "date": latest_date.strftime("%Y-%m-%d"),
            "dateLabel": latest_label,
            "byFund": by_fund,
            "totalNetFlow": total_val,
        }

    return None


def fetch_flow(symbol):
    url = FARSIDE_URLS[symbol]
    _debug(f"fetching {symbol} from {url}")
    try:
        resp = requests.get(url, headers=HTTP_HEADERS, timeout=20)
        _debug(f"{symbol} HTTP status: {resp.status_code}")
        resp.raise_for_status()
    except requests.RequestException as e:
        _debug(f"request failed for {symbol}: {e}")
        return None

    result = parse_flow_table(resp.text)
    if result is None:
        _debug(f"parse_flow_table returned None for {symbol} — 사이트 구조가 바뀌었을 수 있음")
    return result


def get_etf_flows():
    """{'btc': {...}, 'eth': {...}} 형태로 반환. 실패한 쪽은 None."""
    return {
        "btc": fetch_flow("BTC"),
        "eth": fetch_flow("ETH"),
    }


def _write_one(dir_path, payload):
    os.makedirs(dir_path, exist_ok=True)
    out_path = os.path.join(dir_path, "etf_flow_data.js")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("// 자동 생성 파일입니다. 직접 수정하지 마세요.\n")
        f.write("// etf_flow_scraper.py 가 매 실행마다 이 파일을 덮어씁니다.\n")
        f.write("window.__ETF_FLOW__ = ")
        json.dump(payload, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    return out_path


def write_js(data):
    payload = {
        "flows": data,
        "fetched_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
    }
    paths = [_write_one(OUTPUT_DIR, payload)]
    if SECOND_OUTPUT_DIR:
        paths.append(_write_one(SECOND_OUTPUT_DIR, payload))
    return paths


if __name__ == "__main__":
    # 단독 실행 시 콘솔에서 바로 결과 확인 가능 (디버깅용)
    data = get_etf_flows()
    print(json.dumps(data, ensure_ascii=False, indent=2))
    saved_paths = write_js(data)
    print(f"저장 완료 -> {', '.join(saved_paths)}")
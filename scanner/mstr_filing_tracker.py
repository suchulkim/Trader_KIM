# -*- coding: utf-8 -*-
"""
mstr_filing_tracker.py
SEC EDGAR에서 Strategy Inc.(구 MicroStrategy, CIK 0001050446)의 최신
8-K 공시(비트코인 매입/매도 업데이트)를 확정 데이터로 가져온다.

⚠️ SEC EDGAR 정책: 반드시 본인 식별이 가능한 User-Agent(이름 + 이메일)를
   넣어야 한다. 아래 SEC_USER_AGENT를 실제 정보로 바꿔서 사용할 것.
   (https://www.sec.gov/os/webmaster-faq#developers)

※ 이전에 있던 텔레그램 미러 채널 모니터링 기능은 요청에 따라 제외했다.
  (확정되지 않은 비공식 소스라 신뢰도 문제로 제거)

저장:
  단독 실행(__main__) 시 조회 결과를 mstr_filing_data.js로도 저장한다.
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

# ── 반드시 본인 정보로 수정 ───────────────────────────────────────────
# ⚠️ "example.com" 같은 예시/가짜 도메인 이메일을 그대로 두면 SEC가
#    요청을 403으로 차단하는 경우가 있습니다. 실제 이메일 주소로 바꿔주세요.
#    예: "Hong Gildong hong.gildong@gmail.com"
SEC_USER_AGENT = "SUCHUL KIM suchul.kim@gmail.com"
# ─────────────────────────────────────────────────────────────────────

CIK = "0001050446"  # Strategy Inc. (구 MicroStrategy)
EDGAR_SUBMISSIONS_URL = f"https://data.sec.gov/submissions/CIK{CIK}.json"
EDGAR_ARCHIVES_BASE = "https://www.sec.gov/Archives/edgar/data/1050446"


def _debug(*args):
    if DEBUG:
        print("[DEBUG]", *args, file=sys.stderr)


def get_latest_8k():
    # data.sec.gov(JSON API)용 헤더 — 여기서만 Host를 명시한다.
    submissions_headers = {
        "User-Agent": SEC_USER_AGENT,
        "Accept-Encoding": "gzip, deflate",
        "Host": "data.sec.gov",
    }
    try:
        resp = requests.get(EDGAR_SUBMISSIONS_URL, headers=submissions_headers, timeout=20)
        _debug(f"EDGAR submissions HTTP status: {resp.status_code}")
        if resp.status_code != 200:
            # 403/429 등일 때 원인 파악용으로 응답 본문 일부를 같이 남긴다.
            _debug(f"EDGAR response snippet: {resp.text[:300]!r}")
        resp.raise_for_status()
        data = resp.json()
    except requests.RequestException as e:
        _debug(f"EDGAR submissions fetch failed: {e}")
        return None
    except ValueError as e:
        _debug(f"EDGAR submissions JSON parse failed: {e}")
        return None

    recent = data.get("filings", {}).get("recent", {})
    forms = recent.get("form", [])
    dates = recent.get("filingDate", [])
    accessions = recent.get("accessionNumber", [])
    primary_docs = recent.get("primaryDocument", [])

    # www.sec.gov(실제 공시 문서)용 헤더 — Host를 명시하지 않고 requests가
    # URL(www.sec.gov)에 맞춰 자동으로 설정하게 둔다. data.sec.gov용 Host를
    # 그대로 재사용하면 도메인이 안 맞아 전부 404가 나므로 반드시 분리한다.
    doc_headers = {"User-Agent": SEC_USER_AGENT, "Accept-Encoding": "gzip, deflate"}

    for i, form in enumerate(forms):
        if form != "8-K":
            continue
        acc_no = accessions[i]
        acc_no_nodash = acc_no.replace("-", "")
        doc = primary_docs[i]
        filing_date = dates[i]
        doc_url = f"{EDGAR_ARCHIVES_BASE}/{acc_no_nodash}/{doc}"
        _debug(f"latest 8-K candidate: {filing_date} -> {doc_url}")

        parsed = _parse_8k_document(doc_url, doc_headers)
        if parsed:
            parsed["filingDate"] = filing_date
            parsed["url"] = doc_url
            return parsed
        # BTC Update가 없는 8-K(예: 배당/ATM 공시)일 수 있으니 다음 걸 계속 확인
        continue

    _debug("no 8-K with parsable BTC Update found in recent filings")
    return None


def _merge_currency_symbols(cells):
    """SEC 표는 '$'가 숫자와 별도 셀로 분리되어 있는 경우가 많다
    (예: ['4,603', '$', '369.7', ...]). 단독 '$' 셀을 바로 다음 셀과
    합쳐서 ['4,603', '$369.7', ...] 형태로 정규화한다."""
    merged = []
    i = 0
    while i < len(cells):
        c = cells[i].strip()
        if c in ("$", "US$") and i + 1 < len(cells):
            merged.append("$" + cells[i + 1].strip())
            i += 2
        else:
            merged.append(cells[i])
            i += 1
    return merged


def _is_numeric_cell(cell_text):
    """'1,283', '$116.0', '(2)' 등에서 순수 숫자/통화 셀인지 판단.
    괄호 각주((1), (2) 등)는 숫자처럼 보이지만 라벨의 일부이므로 별도로
    걸러내야 한다 — 이건 호출부에서 라벨 문자열 안에 남겨두고, 여기서는
    '셀 전체가 숫자/통화'인 경우만 True로 본다."""
    t = cell_text.replace(",", "").replace("$", "").strip()
    if t.startswith("(") and t.endswith(")"):
        t = t[1:-1]
    return bool(re.match(r"^-?\d+(\.\d+)?$", t)) if t else False


def _clean_num(cell_text):
    t = cell_text.strip()
    negative = t.startswith("(") and t.endswith(")")
    t = t.strip("()").replace(",", "").replace("$", "")
    try:
        val = float(t)
    except ValueError:
        return None
    val = -val if negative else val
    # 정수면 천단위 콤마를 넣은 정수로, 소수면 소수부까지 콤마 포맷으로 문자열화
    if val == int(val):
        return f"{int(val):,}"
    return f"{val:,.2f}".rstrip("0").rstrip(".")


def _find_btc_update_table(soup):
    """'BTC Purchased' / 'BTC Sold' / 'BTC Acquired' 문구가 들어있는
    <table>들 중, 가장 작은(=<tr> 개수가 가장 적은, 가장 구체적인/안쪽의)
    표를 고른다.

    SEC 8-K 문서는 보통 본문 전체가 하나의 거대한 <table>로 감싸져 있고
    그 안에 실제 BTC Update용 작은 표가 중첩(nested)되어 있다. 문구가
    포함된 표 중 첫 번째(=문서 순서상 가장 바깥쪽 거대 표)를 그냥 고르면
    엉뚱한 표를 잡게 되므로, 후보들 중 행(row) 수가 가장 적은 것을 고른다.
    """
    candidates = []
    for table in soup.find_all("table"):
        t_text = table.get_text(" ", strip=True)
        if re.search(r"BTC (Purchased|Sold|Acquired)", t_text, re.IGNORECASE):
            candidates.append(table)

    _debug(f"BTC Update table candidates: {len(candidates)}")
    if not candidates:
        return None

    candidates.sort(key=lambda t: len(t.find_all("tr")))
    for c in candidates:
        _debug(f"  candidate rows={len(c.find_all('tr'))}")

    return candidates[0]


def _parse_btc_update_table(table):
    """표의 행(row)들을 훑어서, '모든 셀이 숫자인 행'을 값 행으로,
    바로 위 행을 라벨 행으로 보고 위치 기준으로 짝짓는다.
    SEC 8-K의 BTC Update 표는 보통
      [헤더1: 기간 설명(병합 셀)] [헤더2: 세부 컬럼 라벨] [값 행: 숫자만]
    구조라, 값 행 바로 위 행이 실제 컬럼 라벨과 매칭된다."""
    rows = table.find_all("tr")
    row_cells = []
    for r in rows:
        cells = [c.get_text(" ", strip=True) for c in r.find_all(["td", "th"])]
        cells = [c for c in cells if c]  # 빈 스페이서 셀 제거
        cells = _merge_currency_symbols(cells)  # 단독 '$' 셀을 숫자와 합침
        if cells:
            row_cells.append(cells)

    _debug(f"BTC Update table: {len(row_cells)} non-empty rows")
    for i, rc in enumerate(row_cells):
        _debug(f"  row[{i}] ({len(rc)} cells):", rc)

    # 뒤에서부터 훑어 '전부 숫자'인 행(값 행)을 찾는다
    value_idx = None
    for i in range(len(row_cells) - 1, -1, -1):
        if all(_is_numeric_cell(c) for c in row_cells[i]):
            value_idx = i
            break

    if value_idx is None or value_idx == 0:
        _debug("no all-numeric row found (or it's the first row with nothing above it)")
        return None, None

    value_row = row_cells[value_idx]

    # 값 행과 셀 개수가 같은 라벨 행을 위로 거슬러 올라가며 찾는다
    label_row = None
    for j in range(value_idx - 1, -1, -1):
        if len(row_cells[j]) == len(value_row):
            label_row = row_cells[j]
            break

    if label_row is None:
        _debug(f"no label row with matching cell count ({len(value_row)}) found above value row[{value_idx}]")

    return label_row, value_row


def _parse_8k_document(url, headers):
    try:
        resp = requests.get(url, headers=headers, timeout=20)
        resp.raise_for_status()
    except requests.RequestException as e:
        _debug(f"8-K doc fetch failed: {e}")
        return None

    soup = BeautifulSoup(resp.text, "html.parser")
    full_text = soup.get_text(separator="\n")

    if "BTC Update" not in full_text and "Bitcoin" not in full_text:
        return None

    # ── 매입/매도 액션 판별 (문서 전체 텍스트 기준) ──
    action = None
    if re.search(r"BTC Purchased", full_text, re.IGNORECASE):
        action = "매입"
    elif re.search(r"BTC Sold", full_text, re.IGNORECASE):
        action = "매도"
    elif re.search(r"BTC Acquired", full_text, re.IGNORECASE):
        action = "매입"

    table = _find_btc_update_table(soup)
    if table is None:
        if action is None:
            return None
        return {
            "action": action,
            "btcAmount": None,
            "aggHoldings": None,
            "avgPrice": None,
            "headline": "BTC Update 공시 확인됨 (표를 찾지 못함 — 원문 확인 필요)",
            "detail": "",
        }

    label_row, value_row = _parse_btc_update_table(table)
    if not label_row or not value_row:
        return {
            "action": action,
            "btcAmount": None,
            "aggHoldings": None,
            "avgPrice": None,
            "headline": "BTC Update 공시 확인됨 (표 파싱 실패 — 원문 확인 필요)",
            "detail": "",
        }

    _debug("BTC Update label row:", label_row)
    _debug("BTC Update value row:", value_row)

    pairs = list(zip(label_row, value_row))

    def find_first(pred):
        for lbl, val in pairs:
            if pred(lbl.lower()):
                return _clean_num(val)
        return None

    def find_last(pred):
        result = None
        for lbl, val in pairs:
            if pred(lbl.lower()):
                result = _clean_num(val)
        return result

    btc_amount = find_first(lambda l: l.startswith("btc purchased") or l.startswith("btc sold") or l.startswith("btc acquired"))
    agg_holdings = find_first(lambda l: "aggregate btc holdings" in l)
    # "Average Purchase/Sale Price"가 두 번(당기·누적) 나오므로 마지막(누적) 값을 우선 사용
    avg_price = find_last(lambda l: l.startswith("average purchase price") or l.startswith("average sale price"))

    if not btc_amount and not agg_holdings:
        return {
            "action": action,
            "btcAmount": None,
            "aggHoldings": None,
            "avgPrice": avg_price,
            "headline": "BTC Update 공시 확인됨 (수치 매칭 실패 — 원문 확인 필요)",
            "detail": "",
        }

    headline_parts = []
    if action and btc_amount:
        headline_parts.append(f"{action} {btc_amount} BTC")
    if agg_holdings:
        headline_parts.append(f"누적 보유 {agg_holdings} BTC")
    headline = " · ".join(headline_parts) if headline_parts else "BTC Update 공시 확인됨 (원문 확인 필요)"

    detail_parts = []
    if avg_price:
        detail_parts.append(f"평균단가 약 ${avg_price}")
    detail = ", ".join(detail_parts)

    return {
        "action": action,
        "btcAmount": btc_amount,
        "aggHoldings": agg_holdings,
        "avgPrice": avg_price,
        "headline": headline,
        "detail": detail,
    }


def _write_one(dir_path, payload):
    os.makedirs(dir_path, exist_ok=True)
    out_path = os.path.join(dir_path, "mstr_filing_data.js")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("// 자동 생성 파일입니다. 직접 수정하지 마세요.\n")
        f.write("// mstr_filing_tracker.py 가 매 실행마다 이 파일을 덮어씁니다.\n")
        f.write("window.__MSTR_FILING__ = ")
        json.dump(payload, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    return out_path


def write_js(data):
    payload = {
        "filing": data,
        "fetched_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
    }
    paths = [_write_one(OUTPUT_DIR, payload)]
    if SECOND_OUTPUT_DIR:
        paths.append(_write_one(SECOND_OUTPUT_DIR, payload))
    return paths


if __name__ == "__main__":
    data = get_latest_8k()
    print(json.dumps(data, ensure_ascii=False, indent=2))
    saved_paths = write_js(data)
    print(f"저장 완료 -> {', '.join(saved_paths)}")
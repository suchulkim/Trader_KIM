# -*- coding: utf-8 -*-
"""
EWY 리포트용 외국인 순매수 데이터 수집 스크립트
=================================================

무엇을 하나요?
  - KRX(한국거래소) 데이터를 이용해 "코스피 시장 전체", "삼성전자(005930)",
    "SK하이닉스(000660)"의 당일 외국인 순매수(거래대금)를 가져옵니다.
  - 결과를 foreign_flow_data.js 파일로 저장합니다. 저장 위치는 OUTPUT_DIR
    환경변수로 정할 수 있고, 설정 안 하면 기존처럼 E:\Trader_KIM에 저장합니다
    (폴더가 없으면 자동으로 만듭니다). SECOND_OUTPUT_DIR 환경변수를 추가로
    지정하면 그 경로에도 한 번 더 저장합니다 (로컬 병행 저장용).
  - EWY_report.html 을 저장 폴더(E:\Trader_KIM 등)에 함께 넣어두고 열면
    이 JS 파일을 불러와 화면에 표시합니다.

어떻게 자동화하나요?
  - (로컬 PC) Windows 작업 스케줄러에 등록해서 원하는 주기(예: 5~10분)로
    반복 실행하면, HTML을 열 때마다 최신 값이 표시됩니다. 같이 들어있는
    run_fetch.bat 파일을 작업 스케줄러의 "동작"에 등록하면 됩니다. 자세한
    설정 방법은 README.txt를 참고하세요.
  - (GitHub Actions) OUTPUT_DIR=${{ github.workspace }} 로 설정해서 실행하면
    저장소 루트에 foreign_flow_data.js가 생성되어 다른 스크립트들과 함께
    커밋/배포됩니다. 이 경우 KRX_ID / KRX_PW를 GitHub Secrets로 등록하고
    env로 넘겨줘야 합니다.

사전 준비:
  1) pip install pykrx
  2) KRX가 2025.12.27부터 data.krx.co.kr(현 "KRX Data Marketplace")을 로그인
     필수로 바꿨습니다(데이터 자체는 무료). https://data.krx.co.kr 에서 회원가입한
     뒤, 아이디/비밀번호를 KRX_ID / KRX_PW라는 이름의 Windows 환경 변수로
     등록해야 이 스크립트가 동작합니다. 자세한 방법은 README.txt 0단계 참고.

참고:
  - KRX가 제공하는 투자자별 매매동향 자체가 실시간 체결과 완전히 동일하지는 않고
    보통 수십 분 지연되어 갱신됩니다. 그래서 5분보다 더 촘촘하게 돌려도 큰 의미는
    없고, 5~10분 간격이면 충분합니다. 장이 열려있지 않은 시간(주말/공휴일/장 마감 후)
    에는 가장 최근 거래일 데이터를 그대로 보여줍니다.
  - 이 스크립트는 네트워크가 제한된 환경(예: 클라우드 샌드박스)에서는 KRX에 접속할
    수 없어 테스트하지 못했습니다. 사용자의 PC(인터넷이 정상적으로 되는 환경)에서
    먼저 아래처럼 수동으로 한 번 실행해서 정상 동작하는지 꼭 확인한 뒤 작업
    스케줄러에 등록해 주세요.

      python fetch_foreign_flow.py

  - 만약 pykrx 내부 데이터 컬럼/인덱스 이름이 라이브러리 버전에 따라 달라 에러가
    나면, 아래 fetch() 함수 안에서 print(df_market) 을 추가해 실제 컬럼명을 확인한
    뒤 코드를 맞춰주세요.
"""

import json
import datetime
import os
import sys

try:
    from pykrx import stock
except ImportError:
    print("pykrx가 설치되어 있지 않습니다. 먼저 다음 명령을 실행하세요:")
    print("    pip install pykrx")
    sys.exit(1)

# 저장 위치. OUTPUT_DIR 환경변수가 있으면 그걸 쓰고(예: GitHub Actions에서
# github.workspace), 없으면 기존처럼 로컬 PC 고정 경로(E:\Trader_KIM)를 씁니다.
# SECOND_OUTPUT_DIR이 설정돼 있으면(비어있지 않으면) 그 경로에도 동일하게
# 한 번 더 저장합니다 (예: 로컬 PC 병행 저장용).
OUTPUT_DIR = os.environ.get("OUTPUT_DIR") or r"E:\Trader_KIM"
SECOND_OUTPUT_DIR = os.environ.get("SECOND_OUTPUT_DIR") or ""

# 모니터링할 개별 종목 (코드: 이름)
TICKERS = {
    "005930": "삼성전자",
    "000660": "SK하이닉스",
}


def get_latest_trading_date():
    """오늘이 휴장일(주말/공휴일)이거나 장 시작 전이면 가장 최근 영업일을 반환합니다."""
    today = datetime.datetime.now().strftime("%Y%m%d")
    try:
        return stock.get_nearest_business_day_in_a_week(today)
    except Exception:
        return today


def _extract_foreign_row(df):
    """pykrx 반환 DataFrame에서 외국인 합계 행을 찾아 반환합니다.
    라이브러리 버전에 따라 인덱스 이름이 '외국인합계' 또는 '외국인'일 수 있어
    둘 다 확인합니다."""
    if df is None or len(df) == 0:
        return None
    for key in ("외국인합계", "외국인"):
        if key in df.index:
            return df.loc[key]
    return None


def _prev_business_day(date_str):
    """YYYYMMDD 문자열을 받아 하루 전 영업일(주말 제외)을 YYYYMMDD로 반환합니다."""
    d = datetime.datetime.strptime(date_str, "%Y%m%d")
    d -= datetime.timedelta(days=1)
    while d.weekday() >= 5:  # 5=토요일, 6=일요일
        d -= datetime.timedelta(days=1)
    return d.strftime("%Y%m%d")


def _query_foreign_net(ticker_or_market, start_date, max_lookback=7):
    """지정한 날짜부터 최대 max_lookback 영업일 전까지 거슬러 올라가며
    외국인 순매수 데이터를 조회합니다. KRX가 당일 데이터를 아직 집계하지
    않았거나(특히 장 마감 직후) 일시적으로 응답이 비어 오는 경우를 대비한
    재시도 로직입니다.

    Returns: (row 또는 None, 실제 사용된 날짜 또는 None, 마지막 에러 메시지 또는 None)
    """
    date = start_date
    last_err = None
    for _ in range(max_lookback):
        try:
            df = stock.get_market_trading_value_by_investor(date, date, ticker_or_market)
            row = _extract_foreign_row(df)
            if row is not None:
                return row, date, None
            last_err = f"{date}: 응답은 받았지만 '외국인' 행이 없음(빈 데이터)"
        except Exception as e:
            last_err = f"{date}: {type(e).__name__}: {e}"
        date = _prev_business_day(date)
    return None, None, last_err


def fetch():
    date = get_latest_trading_date()
    result = {
        "date": date,
        "fetched_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "kospi_market": None,
        "tickers": {},
        "error": None,
    }

    errors = []

    # 1) 코스피 시장 전체 투자자별 순매수(거래대금, 단위: 원)
    row, used_date, err = _query_foreign_net("KOSPI", date)
    if row is not None:
        result["kospi_market"] = {"순매수": int(row.get("순매수", 0)), "기준일": used_date}
    else:
        errors.append(f"코스피 전체: {err}")

    # 2) 개별 종목 (삼성전자, SK하이닉스) 투자자별 순매수
    for code, name in TICKERS.items():
        row, used_date, err = _query_foreign_net(code, date)
        if row is not None:
            result["tickers"][name] = {
                "코드": code,
                "순매수": int(row.get("순매수", 0)),
                "기준일": used_date,
            }
        else:
            result["tickers"][name] = {"코드": code, "error": err}
            errors.append(f"{name}: {err}")

    if errors:
        result["error"] = " / ".join(errors) + \
            " (fetch_log.txt에서 'Error occurred in' 으로 시작하는 줄을 함께 확인하세요)"

    return result


def _write_one(dir_path, data):
    os.makedirs(dir_path, exist_ok=True)
    out_path = os.path.join(dir_path, "foreign_flow_data.js")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("// 자동 생성 파일입니다. 직접 수정하지 마세요.\n")
        f.write("// fetch_foreign_flow.py 가 매 실행마다 이 파일을 덮어씁니다.\n")
        f.write("window.__EWY_FOREIGN_FLOW__ = ")
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write(";\n")
    return out_path


def write_js(data):
    paths = [_write_one(OUTPUT_DIR, data)]
    if SECOND_OUTPUT_DIR:
        paths.append(_write_one(SECOND_OUTPUT_DIR, data))
    return paths


if __name__ == "__main__":
    data = fetch()
    saved_paths = write_js(data)
    print(f"[{data['fetched_at']}] 저장 완료 -> {', '.join(saved_paths)} (기준일 {data['date']})")
    if data.get("error"):
        print("경고:", data["error"])
    if data.get("kospi_market"):
        print("코스피 전체 외국인 순매수:", data["kospi_market"]["순매수"], "원")
    for name, t in data.get("tickers", {}).items():
        if "순매수" in t:
            print(f"{name} 외국인 순매수:", t["순매수"], "원")
        else:
            print(f"{name}: {t.get('error')}")

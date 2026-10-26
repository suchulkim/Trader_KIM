/**
 * event_schedule.js
 * 프로젝트: 주식 분석 전문가 — 전 종목 통합 주요 일정 캘린더
 * index.html(Watchlist)이 기대하는 형식: window.SeptSchedule
 *   - SEPTEMBER_2026_SCHEDULE: 이벤트 배열
 *   - DAILY_SCHEDULE: 일간 일정 배열 (index.html 오른쪽 【 주요 일정 】 패널)
 *   - sortedByDate(list): 날짜/시각순 정렬
 *   - starsFor(importance): 중요도(1~5)를 별표 문자열로 변환
 * 각 이벤트 필드: dateKST(YYYY-MM-DD), timeKST(HH:MM, KST), dateLabel(표시용 한글 날짜),
 *                event(제목), tickers(관련 종목 배열), importance(1~5), note(선택, 부연설명)
 * 모든 일시는 한국시간(KST, UTC+9) 기준입니다.
 * 마지막 업데이트: 2026-10-26 18:30 (KST) — 10/26 한국장 결과 반영(코스피 5,469.47·-1.46%, 5,500 붕괴), 美 선물·유가 아시아장 반영, FOMC 확률 갱신(동결 약 88%·12월 인상 75~80%), SK하이닉스 발표 시각(09:00 전 발표·09:00 컨콜) 갱신, 마이크론 타오위안 노조 협상(10/27)·시게이트 실적(10/28 새벽) 추가, 내구재·소비자신뢰·GDP·PCE·빅테크 컨센서스 추가, DAILY_SCHEDULE 10/26(월) 결과 반영
 * 실적일 표기: (확정)=회사 공식 공지, (예상)=데이터 제공처 추정·미공지
 */

const SEPTEMBER_2026_SCHEDULE = [
  { dateKST: "2026-09-06", timeKST: "20:00", dateLabel: "9월 6일 (일)",
    event: "OPEC+ 8개국 회의 — 10월 산유량 결정",
    tickers: ["CL"], importance: 4,
    note: "8/2 회의에서 자발적 감산 롤백을 9월 증산으로 완료 선언. 10월엔 동결 유력하나 증산 서프라이즈 시 유가 변동성 확대 가능. 매월 재검토 방식이라 다음 결정도 이번 회의 결과에 좌우" },

  { dateKST: "2026-09-08", timeKST: "09:00", dateLabel: "9월 8일 (화)",
    event: "Solana Agave v4.3 스테이크 가중치 전환 1단계 (10%)",
    tickers: ["SOL"], importance: 2, note: "9/8(10%)·9/14(25%)·9/21(전체 권장) 단계적 적용, Anza 공식 일정" },

  { dateKST: "2026-09-09", timeKST: "09:00", dateLabel: "9월 9일 (수)",
    event: "Solana Transaction V1 메인넷 적용",
    tickers: ["SOL"], importance: 3, note: null },

  { dateKST: "2026-09-10", timeKST: "02:00", dateLabel: "9월 10일 (목)",
    event: "Apple 신제품 이벤트 'Surprise and Shine' (아이폰18 프로 · 첫 폴더블 아이폰)",
    tickers: ["AAPL","AVGO"], importance: 5,
    note: "미국 현지 9/9(수) 오전 10시(PT) 진행 확정. 이번 세대는 기본 아이폰18 없이 프로/프로맥스 중심 출시이며, 폴더블 모델(아이폰 얼트라)은 4분기로 출시 연기 전망(궈밍치 리서치). AVGO는 공급망 수혜 관점" },

  { dateKST: "2026-09-10", timeKST: "14:30", dateLabel: "9월 10일 (목)",
    event: "TSMC 8월 매출 발표",
    tickers: ["TSM"], importance: 3, note: null },

  { dateKST: "2026-09-10", timeKST: "09:00", dateLabel: "9월 10일 (목)",
    event: "NVIDIA 배당 기준일 (Ex-Dividend, $0.25/주)",
    tickers: ["NVDA"], importance: 2, note: "지급일 10/1" },

  { dateKST: "2026-09-11", timeKST: "01:00", dateLabel: "9월 11일 (금)",
    event: "EIA 주간 원유재고 발표 (노동절로 일정 지연)",
    tickers: ["CL"], importance: 3, note: null },

  { dateKST: "2026-09-11", timeKST: "21:30", dateLabel: "9월 11일 (금)",
    event: "미국 8월 소비자물가지수(CPI) (결과 확정)",
    tickers: ["SPY","QQQ","EWY","KORU","BTC","ETH","XAU"], importance: 5,
    note: "결과: 전월비 +0.3%(예상 +0.2% 상회), 전년비 +3.4%. 예상보다 뜨거운 인플레이션으로 9월 FOMC 인상 확률이 발표 직후 90%대까지 급등, 매파적 전환을 굳힌 결정적 지표가 됨" },

  { dateKST: "2026-09-12", timeKST: "16:00", dateLabel: "9월 12일 (토)",
    event: "아이폰18 프로 사전예약 시작",
    tickers: ["AAPL"], importance: 3, note: null },

  { dateKST: "2026-09-14", timeKST: "09:00", dateLabel: "9월 14일 (월)",
    event: "Solana Agave v4.3 스테이크 가중치 전환 2단계 (25%)",
    tickers: ["SOL"], importance: 2, note: null },

  { dateKST: "2026-09-15", timeKST: "09:00", dateLabel: "9월 15일 (화)",
    event: "미국 상원 CLARITY Act(디지털자산 시장구조법) 클로처(토론종결) 표결 — 부결(결과 확정)",
    tickers: ["CRCL","ONDO","SOL"], importance: 4, note: "결과: 찬성 49 : 반대 50으로 60표 문턱 미달, 부결. 디지털자산 시장구조 규제 명확화가 무산되며 크립토 전반(특히 CRCL·ONDO 등 RWA·스테이블코인 관련주) 동반 약세 트리거. 재상정 시점 미정" },

  { dateKST: "2026-09-16", timeKST: "09:00", dateLabel: "9월 16일 (수)",
    event: "Circle Arc 메인넷 정식 출시 (결과 확정)",
    tickers: ["CRCL"], importance: 3, note: "BlackRock·Visa·DTCC 등 창립 밸리데이터 참여. CEO 제레미 알레어 '가장 중대한 런칭'이라 자평했으나, 전날 CLARITY 부결 충격과 겹치며 '뉴스에 팔기' 반응으로 CRCL 주가는 장중 -6.77%까지 급락(9/16 종가 $80.45)" },

  { dateKST: "2026-09-17", timeKST: "03:00", dateLabel: "9월 17일 (목)",
    event: "FOMC 금리결정 발표 (9/15~16 회의, SEP·점도표 포함) — 25bp 인상 확정(결과 확정)",
    tickers: ["EWY","ETH","META","GOOGL","KORU","MSTR","MU","NVDA","SKHY","SPY","ONDO","SOL","SNDK","SOXL","QQQ","TSLA","TSM","AAPL","AMZN","AMD","CL","BTC","XAU","PLTR","AVGO","CRCL"],
    importance: 5, note: "결과: 케빈 워시 의장 체제 만장일치(12-0)로 25bp 인상 의결(3.75→4.00%) — 2023년 이후 첫 인상. SEP상 정책위원 18명 중 16명이 2026년 추가 인상 필요성 시사. 발표 직후 위험자산 전반 급락 후, 인상 재료가 선반영됐다는 인식 속 익일부터 반등 전환 — 전 자산군 공통 '인상 재료 소진' 스토리의 분기점" },

  { dateKST: "2026-09-17", timeKST: "22:00", dateLabel: "9월 17일 (목)",
    event: "SEC, 토큰화 증권거래소 대상 5년 한시 '혁신 면제(Innovation Exemption)' 발표 (결과 확정)",
    tickers: ["SOL","ONDO","CRCL"], importance: 4,
    note: "특정 체인을 지목하지 않았으나, xStocks·Ondo Stocks 등 토큰화 주식 인프라가 이미 가동 중인 SOL·ONDO가 수혜 후보로 거론되며 SOL +10.8%(9/18), ONDO +13%(9/17) 등 급등 촉발. 후속 구체 대상 지목 여부 주목" },

  { dateKST: "2026-09-18", timeKST: "09:00", dateLabel: "9월 18일 (금)",
    event: "아이폰18 프로 시리즈 정식 출시",
    tickers: ["AAPL"], importance: 4, note: null },

  { dateKST: "2026-09-18", timeKST: "22:00", dateLabel: "9월 18일 (금)",
    event: "9월 트리플위칭(선물·옵션 동시만기)",
    tickers: ["AVGO","SPY","QQQ"], importance: 3, note: null },

  { dateKST: "2026-09-19", timeKST: "12:00", dateLabel: "9월 19일 (토)",
    event: "일본은행(BOJ) 금리 인상 — 31년 만의 최고 수준 (결과 확정)",
    tickers: ["XAU","EWY","SPY","QQQ"], importance: 3,
    note: "미 FOMC 인상(9/16)에 이어 BOJ도 긴축 기조 동참. 코스피·닛케이는 이를 소화하며 오히려 반등(9/18 코스피 +2%) — 주요국 동반 긴축에도 AI·반도체 랠리가 우선 반영되는 모습" },

  { dateKST: "2026-09-21", timeKST: "09:00", dateLabel: "9월 21일 (월)",
    event: "Solana Agave v4.3 스테이크 가중치 전환 최종단계 (전체 검증인 권장)",
    tickers: ["SOL"], importance: 2, note: null },

  { dateKST: "2026-09-21", timeKST: "22:00", dateLabel: "9월 21일 (월)",
    event: "SpaceX(SPCX) 나스닥100 편입비중 확대 리밸런싱 반영 (결과 확정)",
    tickers: ["SPCX","QQQ","SPY"], importance: 2,
    note: "나스닥100 분기 리밸런싱으로 SpaceX 비중이 약 1.28%→2.82%로 확대, 최대 $150~220억 규모 프로그램 매수 추정. 락업 해제로 유통 가능 주식이 늘어난 데 따른 조정. 결과: 9/21 종가 $151.85(-0.28%) 보합 — 패시브 매수가 락업 물량을 상쇄, 익일(9/22) 상장 100일차 $154.72(+1.89%)로 주간 고점" },

  { dateKST: "2026-09-22", timeKST: "09:00", dateLabel: "9월 22일 (화)",
    event: "Alphabet 증권 집단소송 공판",
    tickers: ["GOOGL"], importance: 3, note: "공식 소송 안내 사이트 기준 날짜 확정" },

  { dateKST: "2026-09-22", timeKST: "23:05", dateLabel: "9월 22일 (화)",
    event: "존 윌리엄스 뉴욕연은 총재 발언",
    tickers: ["SPY","QQQ","XAU","BTC","ETH"], importance: 3,
    note: "9/16 FOMC 인상 이후 첫 연준 고위 인사 발언. 매파적 톤 재확인 시 금·위험자산 전반 단기 눌림 압력" },

  { dateKST: "2026-09-22", timeKST: "23:20", dateLabel: "9월 22일 (화)",
    event: "필립 제퍼슨 연준 부의장 발언",
    tickers: ["SPY","QQQ","XAU","BTC","ETH"], importance: 3, note: "윌리엄스 총재 발언 직후 — 추가 인상 시사 여부에 시장 민감 반응 예상" },

  { dateKST: "2026-09-23", timeKST: "02:00", dateLabel: "9월 23일 (수)",
    event: "토마스 바킨 리치먼드연은 총재 발언",
    tickers: ["SPY","QQQ","XAU"], importance: 2, note: "9/22 연준 인사 3인 발언 중 마지막 — 동일 톤 확인 시 매파적 컨센서스 강화" },

  { dateKST: "2026-09-23", timeKST: "22:45", dateLabel: "9월 23일 (수)",
    event: "S&P 글로벌 9월 플래시 PMI (제조업·서비스업)",
    tickers: ["SPY","QQQ"], importance: 3, note: "경기 모멘텀 점검 — 스태그플레이션(고물가+경기둔화) 우려 완화 여부 확인 포인트" },

  { dateKST: "2026-09-23", timeKST: "23:05", dateLabel: "9월 23일 (수)",
    event: "마이클 바 연준 이사 발언",
    tickers: ["SPY","QQQ","XAU"], importance: 2, note: null },

  { dateKST: "2026-09-23", timeKST: "22:30", dateLabel: "9월 23일 (수)",
    event: "SpaceX(SPCX) 쇼트웰 사장 약 $5,200만 지분 매도(Form 144) 신고 + 락업 해제 전일 선제 매도 (결과 확정)",
    tickers: ["SPCX"], importance: 3,
    note: "결과: 9/23 -4.11% 급락(≈$148.36), 9/9 락업 해제일(-3.9%)과 동일 패턴. 머스크 AI 규제 발언도 겹침. 최근 3주 개인 순매도 약 $5.7억 — 해제일 전후 반복되는 수급 부담" },

  { dateKST: "2026-09-24", timeKST: "08:00", dateLabel: "9월 24일 (목)",
    event: "Meta Connect 2026 메인 키노트 (Zuckerberg) (결과 확정)",
    tickers: ["META"], importance: 5,
    note: "결과: Ray-Ban Meta 3세대($449, 즉시 출시), 카메라 없는 Ray-Ban Meta Audio($349, 10/13 출시), VR 글래스($1,299, 2027년 봄), Muse Charm 펜던트(가을) 공개. Muse 리테일 연동(Walmart·Best Buy·Dick's·Gap)·Mac 컴퓨터 사용 기능 발표. META는 9/24 장중 $779.82 52주 신고가 후 9/25 -3.14%·9/28 -4.2%로 '재료 소멸' — 10/2 종가 $728.08" },

  { dateKST: "2026-09-24", timeKST: "09:00", dateLabel: "9월 24일 (목)",
    event: "테슬라 세미(Semi) 양산 출범 이벤트 'Semi Rollout' (네바다 Sparks) (결과 확정)",
    tickers: ["TSLA"], importance: 3,
    note: "결과: 연산 5만대 전용 공장에서 양산 출범, 최대 500마일 주행. 회사는 연말까지도 전체 판매 대비 비중은 작을 것이라고 설명. TSLA는 9/24 $377.94로 2주 고점 → 9/25 장중 $385 후 -1.54%($372.11) '재료 소멸'(옵티머스 손 조립 차질 보도·BNP 목표가 $268 하향·유럽 FSD 12월 연기 겹침)" },

  { dateKST: "2026-09-24", timeKST: "22:30", dateLabel: "9월 24일 (목)",
    event: "SpaceX(SPCX) 락업 해제 — 약 3.284억주 (상장 후 4번째, 9월 마지막) (결과 확정)",
    tickers: ["SPCX","QQQ"], importance: 3,
    note: "결과: 9/24 종가 $148.03(-0.22%) — 전일 선반영으로 추가 급락 없이 소화. 같은 날 Starship Flight 14 웻드레스 리허설 완료, 구글 Project Suncatcher 첫 위성 SpaceX 발사 발표. 9/25는 미즈호 긍정 리포트로 $148.68(+0.44%) 강보합" },

  { dateKST: "2026-09-24", timeKST: "21:30", dateLabel: "9월 24일 (목)",
    event: "미국 주간 신규 실업수당 청구건수",
    tickers: ["SPY","QQQ"], importance: 3, note: "고용 냉각 신호 확인 포인트, 클리블랜드·필라델피아연은 총재 발언도 같은 날 예정" },

  { dateKST: "2026-09-24", timeKST: "23:00", dateLabel: "9월 24일 (목)",
    event: "미국 8월 신규주택판매",
    tickers: ["SPY","QQQ"], importance: 2, note: null },

  { dateKST: "2026-09-25", timeKST: "17:00", dateLabel: "9월 25일 (금)",
    event: "Deribit 비트코인·이더리움 월간 옵션 만기(추정)",
    tickers: ["BTC","ETH"], importance: 3, note: "월말 대형 만기 규모에 따라 BTC/ETH 동반 단기 변동성 확대 가능" },

  { dateKST: "2026-09-25", timeKST: "21:30", dateLabel: "9월 25일 (금)",
    event: "미국 8월 내구재 수주",
    tickers: ["SPY","QQQ"], importance: 3, note: null },

  { dateKST: "2026-09-25", timeKST: "23:00", dateLabel: "9월 25일 (금)",
    event: "미시간대 소비자심리지수 9월 확정치",
    tickers: ["XAU","SPY","QQQ"], importance: 3,
    note: "예비치 기준 인플레이션 기대치가 4.6%(6월 이후 최고)로 급등하며 소비심리 위축 — 확정치에서 재확인되면 스태그플레이션 우려 재부각 가능" },

  { dateKST: "2026-09-28", timeKST: "09:00", dateLabel: "9월 28일 (월)",
    event: "Solana 메인넷 기능 활성화 재개 — Alpenglow는 미활성화 (결과 확정)",
    tickers: ["SOL"], importance: 2, note: "결과: 9/28은 Anza 일정상 '메인넷 기능 활성화 재개' 창일 뿐, Alpenglow(SIMD-0326) 활성화일이 아니었음 — 시장의 오해. 야코벤코 'decel', Anza 와텐호퍼 'No Alpenrush'로 조기 활성화 부인. Alpenglow는 9/22부터 테스트넷에서만 가동 중. 다음 메인넷 활성화 창은 11/9(가능성 창, 확정 아님)" },

  { dateKST: "2026-09-28", timeKST: "21:48", dateLabel: "9월 28일 (월)",
    event: "SpaceX Starship Flight 14 — 사상 첫 궤도 진입 성공 (결과 확정)",
    tickers: ["SPCX","TSLA","QQQ","SPY"], importance: 5,
    note: "결과: KST 21:48(08:48 EDT) 발사. 이륙 중 십 랩터 6기 중 1기 정지로 한때 미션 중단 발표 후 강행해 궤도 진입 성공. T+34분부터 약 30분간 Starlink V3 26기 배치 완료(첫 매출 미션). 부스터는 캐치 미시도, 멕시코만 제어 착수. 그러나 SPCX는 9/28 종가 $145.47(-2.16%), 주간 -4.2% — 성장·모멘텀주 전반 매도 흐름에 묻혀 '뉴스에 팔기'" },

  { dateKST: "2026-09-29", timeKST: "00:56", dateLabel: "9월 29일 (화)",
    event: "SpaceX Starship Flight 14 — 북태평양 스플래시다운 (결과 확정)",
    tickers: ["SPCX"], importance: 3,
    note: "결과: 발사 3시간 8분 후 십이 북태평양에 온전한 상태로 착수(당초 예상 약 10시간 비행보다 단축) — 착수 직후 전도·폭발은 예정된 범위. 히트실드 촬영용 카메라 위성 3기 운용. 다음 관심사는 Flight 15 '발사탑 캐치' 시도 일정" },

  { dateKST: "2026-10-01", timeKST: null, dateLabel: "10월 1일 (목, 美 현지 9/30 발의)",
    event: "美 상원 디지털자산 과세법안 'ADAPT Act' 발의 (결과 확정)",
    tickers: ["CRCL","ONDO","SOL","BTC"], importance: 3,
    note: "결과: 스티브 데인즈 상원의원 대표 발의(팀 스콧 은행위원장·루미스·모레노 공동). 56쪽 분량 — 규정 준수 달러 스테이블코인 결제 시 양도손익 인식 면제(CRCL 우호), $10 이하 가스비 면제, 크립토 워시세일 규정 적용, 트레이더 시가평가 선택 허용. 하원 세입위는 9/16 별도 법안을 38-5로 통과. 아직 법안 단계라 의회 통과 필요" },

  { dateKST: "2026-09-26", timeKST: null, dateLabel: "9월 26일 (토, 美 현지 9/25)",
    event: "뉴멕시코 배심원, 페이스북 소비자보호법 위반 평결 (결과 확정)",
    tickers: ["META"], importance: 4,
    note: "결과: 사용자 프라이버시 보호 기만 관련 4,300만 건 이상 위반 인정 — 건당 최대 $5,000(이론상 최대 $2,000억+). 벌금 규모는 판사가 별도 결정(10/1 심리). Meta '평결에 동의하지 않으며 계속 방어' 입장" },

  { dateKST: "2026-09-30", timeKST: "02:00", dateLabel: "9월 30일 (수)",
    event: "OpenAI DevDay 2026 메인 키노트 (결과 확정)",
    tickers: ["NVDA","AMD","GOOGL","META","MU","SOXL"], importance: 4,
    note: "결과: ①상시 백그라운드 AI 비서 'Dots' ②저비용 신모델 GPT-6.1 Sol(최상위 Astra 근접 성능, Astra는 안전성 이유로 공개 보류) ③협업 워크스페이스 'ChatGPT Space' ④Decisions API ⑤Cloud Codex. 특정 하드웨어 파트너 언급은 없어 반도체주 직접 영향 제한적. Space는 슬랙·노션·구글 드라이브 영역 겨냥 — 소프트웨어주 AI 대체 우려 재부각 요인" },

  { dateKST: "2026-09-30", timeKST: "09:00", dateLabel: "9월 30일 (수)",
    event: "Alphabet 증권 집단소송 옵트아웃(제외 신청) 마감",
    tickers: ["GOOGL"], importance: 2, note: "공식 소송 안내 사이트 기준 날짜 확정(우편 소인 기준)" },

  { dateKST: "2026-09-30", timeKST: "21:30", dateLabel: "9월 30일 (수)",
    event: "미국 8월 근원 PCE 물가지수 (결과 확정)",
    tickers: ["XAU","SPY","QQQ"], importance: 4,
    note: "결과: 근원 PCE 전월비 +0.2%(예상 +0.3%), 전년비 3.0%(예상 3.3%) / 헤드라인 3.4%(예상 3.7%) — 예상 하회. 10월 FOMC 인상 확률 약 71%→35%로 급락, 시장은 12월 인상으로 기대 이동. 같은 날 ADP 민간고용 9만명(예상 4.9만) 상회, 2분기 GDP 2.2%로 상향. 그럼에도 美 10년물 5.29%(2007년 이후 최고)·30년물 5.63%로 상승해 S&P -0.04%, 나스닥 -0.37%, 다우 -0.70% 마감" },

  { dateKST: "2026-10-01", timeKST: "05:00", dateLabel: "10월 1일 (목)",
    event: "Micron(MU) FY2026 4분기 실적발표 (결과 확정)",
    tickers: ["MU","SKHY","SNDK","SOXL"], importance: 5,
    note: "결과: 매출 $542.3억(전년비 +379%), 조정 EPS $33.42(예상 $31.83), GM 87.0% 모두 상회. FQ1 가이던스 매출 $615억±15억(예상 $568억)·EPS $38.15(예상 $36.02)로 대폭 상회. 다만 'FY27 capex를 기존 계획보다 확대'(1Q 약 $115억, 상반기 약 $250억) 발언에 시간외 주가 등락 엇갈림. SNDK는 10/1 프리마켓 +1.4% — 메모리 공급 타이트·AI 수요 지속 확인, 리스크 구간은 신규 캐파가 풀리는 2027년 말~2028년(웨드부시)" },

  { dateKST: "2026-10-01", timeKST: "09:00", dateLabel: "10월 1일 (목)",
    event: "9월 한국 수출입 동향 발표 — 사상 최대 (결과 확정)",
    tickers: ["EWY","KORU","SKHY"], importance: 4,
    note: "결과: 9월 수출 $1,209억(전년비 +83.5%) 월간 역대 최대, 반도체 $603억(+262.8%)으로 사상 첫 $600억 돌파 — 총수출의 절반. 8월(+209%)에 이어 반도체 초호황 재확인, 연간 누적 수출 $8,000억 첫 돌파. 당초 10/5 예정으로 표기했으나 산업부 발표일(매월 1일)로 정정" },

  { dateKST: "2026-10-01", timeKST: "09:00", dateLabel: "10월 1일 (목)",
    event: "NVIDIA 분기 배당 지급",
    tickers: ["NVDA"], importance: 1, note: null },

  { dateKST: "2026-10-01", timeKST: "23:00", dateLabel: "10월 1일 (목)",
    event: "미국 9월 ISM 제조업 PMI (가격지수 포함) (결과 확정)",
    tickers: ["SPY","QQQ","XAU","CL"], importance: 3,
    note: "결과: PMI 54.5(예상 55.0, 확장 유지) / 지불가격지수 77.9(+6.8p, 중동 분쟁 이후 최고) — 철강·알루미늄·관세·석유제품 비용 전가. 가격 응답 58.6%(8월 46.2%). 제퍼슨 부의장 '추가 조치 서두를 필요 없다' 발언과 엇갈린 신호" },

  { dateKST: "2026-10-02", timeKST: "03:18", dateLabel: "10월 2일 (금)",
    event: "SpaceX Falcon 9 Transporter-18 발사 — 구글 Project Suncatcher 첫 TPU 위성 탑재",
    tickers: ["SPCX","GOOGL"], importance: 3,
    note: "美 현지 10/1 11:18 PT(18:18 UTC) 반덴버그 발사, 발사창 58분 — 총 130개 탑재체. 구글 TPU 4기 탑재 'MVP' 위성(Planet 제작)으로 궤도 AI 컴퓨트 첫 실증. SpaceX 자체 궤도 데이터센터(Gigasat, 2027년 말 1GW 목표) 테마와 연결" },

  { dateKST: "2026-10-02", timeKST: null, dateLabel: "10월 2일 (금, 美 현지 기준)",
    event: "테슬라 3분기 인도량 발표 (결과 확정)",
    tickers: ["TSLA"], importance: 4,
    note: "결과: 인도 48만 6,532대(컨센서스 약 46.2만 대비 +2.5만 상회, 전년비 -2.1%) / 생산 46만 4,391대(인도보다 2.2만대 적어 재고 소진형 비트) / Model 3·Y 47.8만, 기타 8,295대(예상 1.13만 하회) / 에너지저장 13.7GWh(예상 15.9GWh 하회). TSLA 10/2 +4.65%($370.59), 거래량 5,390만주" },

  { dateKST: "2026-10-02", timeKST: null, dateLabel: "10월 2일 (금, 美 현지 기준)",
    event: "Alphabet 광고기술 독점 퍼블리셔 손해배상 소송 — 배심 재판 허용 (결과 확정)",
    tickers: ["GOOGL"], importance: 3,
    note: "결과: 뉴욕 남부지법 Castel 판사가 USA Today·Daily Mail·퍼블리셔 약 5,000곳의 청구액 약 $32억 손해배상 배심 재판 진행 허용(재판일 미정). 같은 날 Project Suncatcher 궤도 TPU 위성 발사로 GOOGL은 +1.56%($343.50) 반등" },

  { dateKST: "2026-10-02", timeKST: "21:30", dateLabel: "10월 2일 (금)",
    event: "미국 9월 고용보고서 (비농업 고용·실업률) (결과 확정)",
    tickers: ["SPY","QQQ","EWY","KORU","BTC","ETH","XAU"], importance: 5,
    note: "결과: 비농업 고용 +2.9만명(예상 약 8.4만 크게 하회), 실업률 4.2%(예상 4.1%), 시간당 임금 전월비 +0.1%·전년비 3.0%. 7월 +2.1만→-1.0만, 8월 16.2만→13.3만으로 2개월 합계 6만명 하향 수정. 고용 쇼크로 국채금리 하락·주가지수 선물 상승 — 10월 FOMC 동결 기대 강화(PCE 하회에 이어 두 번째 비둘기 재료). 시장 반응(10/2 마감): S&P500 7,722.72(+0.73%)·나스닥 +1.19%, 10년물 5.28%로 하락, 10월 인상 확률 64%→16% 급락. 유가는 G7 1억 배럴 비축유 방출에도 브렌트 $102대·WTI $91대 고공 유지(이란 긴장)" },

  { dateKST: "2026-10-05", timeKST: null, dateLabel: "10월 중 (날짜 미정)",
    event: "뉴멕시코 법원, Meta 소비자보호법 위반 벌금 판결",
    tickers: ["META"], importance: 4,
    note: "9/25 배심원 평결(4,300만 건 위반) 후 10/1 벌금 심리 진행, 판결은 10월 중 예정 — 정확한 날짜 미정(정렬용 임시 날짜). 건당 최대 $5,000으로 이론상 규모가 커 판결 수준에 따라 헤드라인 충격 가능" },

  { dateKST: "2026-10-05", timeKST: null, dateLabel: "10월 5일 (월)",
    event: "🇰🇷 개천절 대체공휴일 — 한국 증시 휴장",
    tickers: ["EWY","KORU","SKHY","SAMSUNG"], importance: 2,
    note: "10/3(토) 개천절 대체공휴일. KRX 휴장 중 美 ISM 서비스업 등 해외 재료는 10/6(화) 개장 때 한꺼번에 반영 — 갭 출발 주의" },

  { dateKST: "2026-10-05", timeKST: "23:00", dateLabel: "10월 5일 (월)",
    event: "미국 9월 ISM 서비스업 PMI",
    tickers: ["SPY","QQQ","EWY","KORU","BTC","ETH","XAU"], importance: 4,
    note: "예상 55.1(전월 55.4). 고용 쇼크 직후라 '서비스 경기도 꺾이나'가 관건 — 가격지수(물가 압력)·신규주문 세부 항목 주목. 가격지수 높게 나오면 금리 인하 기대 되돌림 위험" },

  { dateKST: "2026-10-06", timeKST: null, dateLabel: "10월 6일 (화, 대만)",
    event: "Micron 대만 타오위안 노조 파업 찬반 투표 마감 — 가결 (결과 확정)",
    tickers: ["MU","SKHY","SNDK"], importance: 4,
    note: "결과(10/7 발표): 조합원 2,258명 중 1,994명 찬성(투표자 기준 약 99%)으로 파업권 확보, 날짜는 미정. 노조는 영업이익 15% 상시 배분 요구(회사는 35~68개월치 일회성 보너스 제시). MU는 가결 당일 장중 $1,011 → $1,088(+4.1%)로 '공급 타이트' 해석에 역전 마감" },

  { dateKST: "2026-10-06", timeKST: null, dateLabel: "10월 6일 (화) ~ 7일 (수), 美 현지 기준",
    event: "Amazon Prime Big Deal Days (22개국, 10월 프라임데이)",
    tickers: ["AMZN"], importance: 3,
    note: "연말 쇼핑 시즌 시작 신호. 4분기 매출로 잡혀 3분기 실적(10/30 KST)엔 반영 안 됨 — 판매 호조 보도가 단기 심리 재료" },

  { dateKST: "2026-10-06", timeKST: "21:30", dateLabel: "10월 6일 (화)",
    event: "미국 8월 무역수지",
    tickers: ["SPY","QQQ"], importance: 2,
    note: "예상 -$952억. 관세·유가 영향 확인용, 시장 영향은 제한적" },

  { dateKST: "2026-10-06", timeKST: "22:53", dateLabel: "10월 6일 (화)",
    event: "이더리움 Glamsterdam 업그레이드 — Sepolia 테스트넷 활성화 (결과 확정)",
    tickers: ["ETH"], importance: 3,
    note: "결과: 13:53 UTC Sepolia 포크. 블록 빌딩을 프로토콜 내부로(ePBS)·블록 단위 접근 목록(BAL, EIP-7928)으로 병렬 실행 기반 마련. 다음 단계 Hoodi 테스트넷(10/27 잠정) → 메인넷(4분기 목표, 날짜 미확정). 같은 주 현물 ETF 유출로 가격 반응은 제한적" },

  { dateKST: "2026-10-07", timeKST: null, dateLabel: "10월 7일 (수, 美 현지 기준)",
    event: "Microsoft Windows·Surface 이벤트",
    tickers: ["MSFT"], importance: 2,
    note: "Windows의 미래·Surface 신제품 공개 예정(정확한 KST 시각 미공지). Copilot+ PC·AI 기능 메시지가 주가 포인트, 하드웨어 자체 영향은 작음" },

  { dateKST: "2026-10-07", timeKST: null, dateLabel: "10월 7일 (수, 美 현지 10/6 기준)",
    event: "현물 ETH ETF 6거래일 연속 순유출 — 10/6 하루 -$2.02억 (결과 확정)",
    tickers: ["ETH"], importance: 4,
    note: "9/29부터 6거래일 연속 유출, 합계 약 -$4.1억(9월 한 달은 +$8.32억 순유입). 같은 기간 BTC ETF는 순유입 → 기관 자금 ETH→BTC 이동. ETH는 10/5 $2,712 → 10/7 $2,562 → 10/9 $2,430대" },

  { dateKST: "2026-10-08", timeKST: "02:00", dateLabel: "10월 8일 (목)",
    event: "미국 10년물 국채 입찰 (결과 반영)",
    tickers: ["SPY","QQQ","XAU"], importance: 3,
    note: "결과: 입찰 세부 수치는 미확인. 10/7 장중 10년물이 5.36%(2002년 이후 최고)까지 치솟았다가 5.28%대로 마감 — 입찰 자체가 추가 금리 급등을 부르진 않음" },

  { dateKST: "2026-10-08", timeKST: "03:00", dateLabel: "10월 8일 (목)",
    event: "9월 FOMC 의사록 공개 (결과 확정)",
    tickers: ["EWY","ETH","META","GOOGL","KORU","MSTR","NVDA","SPY","QQQ","TSLA","AAPL","AMZN","BTC","XAU","PLTR","MSFT"], importance: 4,
    note: "결과: 다수 위원이 '연말까지 한 번 더 인상이 적절할 것' — 다만 10월(10/29)이냐 12월이냐는 데이터에 따라 판단. 예상 범위로 소화, 발표 후 10월 인상 확률 약 20%. 고용 쇼크(10/2) 이전 회의 기록이라 시장은 10/14 CPI에 더 무게" },

  { dateKST: "2026-10-08", timeKST: "08:00", dateLabel: "10월 8일 (목)",
    event: "삼성전자 3분기 잠정실적 — 영업이익 사상 첫 100조 돌파 (결과 확정)",
    tickers: ["SAMSUNG","SKHY","MU","SNDK","EWY","KORU"], importance: 5,
    note: "결과: 영업이익 107.4조원(전년비 +782.5%, 컨센서스 약 105.4조원 대비 +1% 상회) — 국내 기업 최초 분기 100조 돌파. 매출은 컨센서스(약 200조원) 대비 약 3% 하회 — 원·달러 환율이 1,500원대에서 1,300원대로 급락한 영향. 3분기 누적 영업이익 254.1조원. 프리마켓 +1.7%(27.3만원) 강세 출발. 부문별 상세·3분기 특별배당은 10/29 확정 실적 때 발표" },

  { dateKST: "2026-10-08", timeKST: "14:30", dateLabel: "10월 8일 (목)",
    event: "TSMC 9월 매출 — 3분기 사상 최대, 가이던스 상단 상회 (결과 확정)",
    tickers: ["TSM","NVDA","AMD","AVGO","SOXL"], importance: 4,
    note: "결과: 9월 매출 NT$5,118.6억(전월비 -0.6%, 전년비 +54.6%). 3분기 합계 약 NT$1.49조(전분기비 +17.6%, 전년비 +51%)로 분기 사상 최대 — 회사 가이던스 상단(NT$ 기준 약 1.47조) 상회. 1~9월 누적 NT$3.90조(+41.1%). 4분기는 두 자릿수 성장(약 NT$1.66조)·2027년 선단공정 5~10% 가격 인상 관측. 10/15 3분기 실적에서 4분기 가이던스 확인" },

  { dateKST: "2026-10-08", timeKST: "21:30", dateLabel: "10월 8일 (목)",
    event: "미국 주간 신규 실업수당 청구건수",
    tickers: ["SPY","QQQ"], importance: 3,
    note: "예상 20만건. 고용 쇼크가 일시적인지 확인 — 급증 시 경기침체 우려·인하 기대 동시 확대 (결과 수치는 재확인 필요)" },

  { dateKST: "2026-10-09", timeKST: "05:00", dateLabel: "10월 9일 (금)",
    event: "美 10/8 정규장 마감 — 호르무즈 기뢰 폭발 + OpenAI 매출 경고로 기술주 급락 (결과 확정)",
    tickers: ["SPY","QQQ","NVDA","AMD","MU","SNDK","SPCX","MSFT","AMZN","META","TSLA","SOXL","CL","BTC","ETH"], importance: 5,
    note: "결과: S&P500·나스닥 2거래일 연속 하락, 나스닥 7주래 최대 낙폭·반도체지수 -3%대·광통신주 급락. 호르무즈 남부 항로에서 유조선 다수가 기뢰 접촉 폭발 → 유가 1개월래 최대 상승. 美 국방부 '3일간 이란 공습안' 보도, 트럼프는 '중간선거 전 공격 없다·협상 중'. 종목(종가 근사): NVDA $231.4(-2.3%)·AMD $621.6(-3.9%)·MU $1,049.5(-3.5%)·SNDK $1,622(-6.1%)·SPCX $162.6(-3.1%)·MSFT $522.8(-1.6%)·AMZN $255.6(-1.4%)·META $719.2(-0.9%)·TSLA $371.7(-1.3%)·GOOGL $347.5(-0.2%)·AAPL $339.9(+0.9%). SpaceX 주파수 대역 인수 발표로 버라이즌·AT&T·T모바일 -6~7%. 코인: BTC $81.4k(-2.3%)·ETH $2,438(-4.6%)" },

  { dateKST: "2026-10-09", timeKST: null, dateLabel: "10월 9일 (금)",
    event: "🇰🇷 한글날 — 한국 증시 휴장",
    tickers: ["EWY","KORU","SKHY","SAMSUNG"], importance: 2,
    note: "이번 주 한국장은 10/6~10/8 3일만 거래. 美 10/8 급락(반도체 -3%대)·SPCX 해제·미시간 심리는 다음 주(10/12) 개장 때 몰아서 반영 — 갭 하락 출발 주의" },

  { dateKST: "2026-10-09", timeKST: "02:00", dateLabel: "10월 9일 (금)",
    event: "미국 30년물 국채 입찰 (결과 확정)",
    tickers: ["SPY","QQQ","XAU"], importance: 3,
    note: "결과: 장기물 입찰 수요가 '견조'하게 소화되며 국채 가격 상승(금리 하락) 마감. 30년물 금리 5.7%권(24년 만의 최고권)에서 한숨 돌림 — 다만 유가 상승이 기대인플레 경로로 재압박할 수 있음" },

  { dateKST: "2026-10-09", timeKST: "22:30", dateLabel: "10월 9일 (금)",
    event: "SpaceX(SPCX) 락업 해제 — 약 3.28억주",
    tickers: ["SPCX","QQQ"], importance: 3,
    note: "스태거드 락업 스케줄상 10월 1차 해제(美 개장 시점 반영). 직전 9/9·9/24 해제 모두 해제일 또는 전일 약 -4% 하락 패턴 — 전일(10/8)은 -3.1%($162.6)로 선제 매도 재현. 같은 날 美 무선 주파수 대역 인수 발표('미국 전역 휴대폰 커버리지' 목표)로 통신 진출 재료 부각. 10/7에는 $400억 부채 조달·엔비디아 칩 구매 보도" },

  { dateKST: "2026-10-09", timeKST: "23:00", dateLabel: "10월 9일 (금)",
    event: "미시간대 10월 소비자심리 (예비치) (결과 확정)",
    tickers: ["SPY","QQQ","XAU","BTC","ETH"], importance: 3,
    note: "결과: 소비자심리 46.3(예상 47.8 하회, 전월 48.1) / 1년 기대인플레 4.7%(전월 4.6%↑)·5년 3.5%. 호르무즈發 유가 반등이 기대인플레로 번지는 신호 — 10/14 CPI 경계감을 키운 지표" },

  { dateKST: "2026-10-10", timeKST: null, dateLabel: "10월 9~10일 (KST, 美 현지 10/8~9)",
    event: "Micron 이사회 — 대만 노조 보상안 대응 주목",
    tickers: ["MU","SKHY","SNDK"], importance: 4,
    note: "타오위안 노조가 이사회에 영업이익 15% 배분 등 구체안 제시를 요구. 새 보상안이 나오면 파업 리스크 완화(MU 호재), 없으면 파업 날짜 확정 가능성(MU 약세·SK하이닉스 반사이익). 대만은 10/10 국경일 휴장" },

  { dateKST: "2026-10-12", timeKST: "09:00", dateLabel: "10월 12일 (월)",
    event: "🇰🇷 한국장 3일 휴장 후 개장 — 美 10/8~9 재료 일괄 반영 (결과 확정)",
    tickers: ["EWY","KORU","SKHY","SAMSUNG"], importance: 4,
    note: "결과: 10/12 코스피 -3.65%에 이어 10/13 -5.46%(6,035.4, 매도 사이드카) — 中 CXMT 4F² D램 발표·자사주 매입 종료 수급 공백이 겹쳐 SK하이닉스 -10.1%·삼성 -7.4%, 외국인 하루 5.15조 순매도. 사전 메모: 10/8 美 반도체지수 -3%대·SNDK -6%·MU -3.5% 급락, 호르무즈 사태, SPCX 해제, 미시간 심리까지 한 번에 반영. 삼성 잠정실적(107.4조) 호재와 美 반도체 급락 악재가 맞부딪히는 첫 거래일 — 갭 하락 출발 후 저가 매수 유입 여부 주목" },

  { dateKST: "2026-10-13", timeKST: null, dateLabel: "10월 13일 (화, 美 현지 기준)",
    event: "Apple 스마트홈 신제품 공개 (홈 허브·HomePod mini 2·Apple TV) (예상)",
    tickers: ["AAPL"], importance: 4,
    note: "블룸버그 거먼 보도(9/30), 회사 공식 초대장 전. 온라인 이벤트 형식 예상 — KST 시각 미정. 터너스 CEO 체제 첫 신규 카테고리, 새 Siri AI 시연 수준이 'AI 경쟁 뒤처짐' 우려를 덜지가 관건. 공개 여부·세부 내용은 미확인 — AAPL은 10/14 CPI 쇼크 속에서도 +0.5%($342.96), 장중 시총 $5조 재돌파" },

  { dateKST: "2026-10-16", timeKST: null, dateLabel: "10월 16일 (금)",
    event: "폴더블 iPhone 18 Duo 사전주문 개시 ($1,999) (결과 확정)",
    tickers: ["AAPL"], importance: 4,
    note: "결과: 사전주문 매진·배송 지연 여부는 미확인. AAPL 10/16 +0.43%($343.46)로 매그니피센트7 중 유일하게 상승. 사전 메모: 출시는 10월 말. 2026년 약 600만대 예상 — 초기 매진·배송 지연 여부가 수요 신호" },

  { dateKST: "2026-10-13", timeKST: null, dateLabel: "10월 13일 (화, 美 현지 기준)",
    event: "Ray-Ban Meta Audio(카메라 없는 오디오 글래스) 출시",
    tickers: ["META"], importance: 2, note: "Meta Connect(9/24) 발표 제품, $349. 프라이버시 우려를 낮춘 라인업 — 판매 반응은 4분기 Reality Labs 매출 변수" },

  { dateKST: "2026-10-14", timeKST: "21:30", dateLabel: "10월 14일 (수)",
    event: "미국 9월 소비자물가지수(CPI) (결과 확정)",
    tickers: ["SPY","QQQ","EWY","KORU","BTC","ETH","XAU"], importance: 5,
    note: "결과: 헤드라인 전월비 +0.6%(예상 부합)·전년비 3.7%(예상 3.6%, 8월 3.4%) / 근원 전월비 +0.3%(예상 +0.2%)·전년비 2.6%(예상 2.5%) — 휘발유 전월비 +7.1%. CME FedWatch 10월 인상 확률 22% → 약 44~50%. 10/14 마감: S&P500 7,718.94(-1.11%)·나스닥 26,692.87(-1.88%)·다우 -0.09%·러셀 -1.93%, 10년물 5.28%(+6bp)·2년물 장중 4.93%(+14bp), 달러지수 102대 18개월 최고. NVDA -3.2%·AMD -5.7%·MU -4.1%·SNDK -5.3%·SKHY ADR -6.1%. 사전 메모: BLS 일정 기준 10/14 08:30 ET. 10월 FOMC(10/29 KST) 직전 마지막 핵심 물가지표 — 9월 의사록은 '연내 1회 추가 인상, 시점은 데이터 의존'. 8월 CPI는 전월비 +0.3%로 예상 상회, 8월 PCE는 하회. 호르무즈 사태發 유가 반등이 헤드라인 물가에 얼마나 반영될지 주목" },

  { dateKST: "2026-10-14", timeKST: "14:00", dateLabel: "10월 14일 (수)",
    event: "ASML 3분기 실적 (결과 확정)",
    tickers: ["TSM","NVDA","AMD","SOXL","SKHY","SAMSUNG"], importance: 3,
    note: "결과: 3분기 매출 사상 최대·연간 전망 상향(Yahoo Finance 보도). 세부 수주액은 미확인. 그러나 CPI 쇼크에 ASML 주가는 10/14 -3.94% — 장비 수요 호조보다 금리·밸류 부담이 우선 반영" },

  { dateKST: "2026-10-15", timeKST: "03:00", dateLabel: "10월 15일 (목)",
    event: "연준 베이지북 (결과 확정)",
    tickers: ["SPY","QQQ","XAU","CL"], importance: 3,
    note: "결과: 지역 경기 '성장 둔화 + 고유가' 진단(KuCoin 요약 기준, 지역별 세부 문구는 미확인). 10/28 FOMC 참고자료" },

  { dateKST: "2026-10-15", timeKST: "15:30", dateLabel: "10월 15일 (목)",
    event: "🇰🇷 코스피 -7.57% 폭락·서킷브레이커 발동 (결과 확정)",
    tickers: ["EWY","KORU","SKHY","SAMSUNG","HYUNDAI"], importance: 5,
    note: "결과: 코스피 5,554.22(-7.57%, 장중 5,450대·4/7 이후 최저, 7거래일 연속 하락 누적 약 -21%), 코스닥 760.82(-7.65%) — 두 시장 모두 장중 -8% 이상으로 서킷브레이커(20분 매매 정지). 삼성전자 21.0만(-9.48%, 장중 20.45만), SK하이닉스 126.2만(-11.06%, 장중 123.8만), 삼성전기 -15.4%, 현대차 -5.74%. 외국인 3.63조 순매도(8거래일 연속, 누적 약 21.2조; 선물은 순매수 전환), 기관 +1.69조·개인 +1.29조. 원·달러 1,344.6원(+6.3). 원인: 美 9월 CPI 예상 상회·가트너 AI 투자 수익성 의문·CXMT 공급 우려" },

  { dateKST: "2026-10-15", timeKST: "21:30", dateLabel: "10월 15일 (목)",
    event: "미국 9월 생산자물가(PPI)·소매판매·신규 실업수당·필라델피아 연은 지수 (결과 확정)",
    tickers: ["SPY","QQQ","EWY","KORU","BTC","ETH","XAU","SKHY","SAMSUNG"], importance: 5,
    note: "결과: PPI 전월비 +1.3%(예상 +0.5%)·전년비 6.3%(2022년 12월 이후 최고) / 근원 +0.7%(예상 +0.3%)·전년비 5.0% / 소매판매 +0.8%(예상 +0.3%)·자동차 제외 +0.9%·컨트롤그룹 +0.1%(예상 +0.3%) / 신규 실업수당 19.9만(예상 20.0만) / 필라델피아 연은 20.9(예상 28.4) / 뉴욕 엠파이어 25.5(약 5년 최고). 장 초반 하락 후 10년물 5.09%(약 -10bp)·데일리 '서두를 필요 없다' 발언에 반등 — 10/15 마감 S&P500 7,744.06(+0.33%)·나스닥 26,713.02(+0.08%)·다우 52,177.69(+1.08%)·러셀 +1.38%, 반도체지수 -0.88%(7일 연속↓). NVDA $217.23(-1.8%)·AMD -1.5%·AVGO -0.6%·MU $931.24(+1.9%)·SNDK -4.3%·TSM ADR -1.8%·CRWV +5.9%. CME 10월 인상 확률 54%→32%. 사전 메모: 예상(Investing.com 집계): PPI 전월비 +0.6%(전월 0.4%)·근원 +0.3%(전월 0.2%) / 소매판매 +0.3%(전월 1.2%)·컨트롤그룹 +0.3%(전월 1.4%) / 신규 실업수당 19.9만(전주 19.7만) / 필라델피아 연은 28.2(전월 37.8) / 뉴욕 엠파이어 12.1. CPI 쇼크 다음 날이라 근원 PPI가 0.4% 이상이면 10월 인상 확률 추가 상승, 소매판매 급랭 시 스태그플레이션 우려" },

  { dateKST: "2026-10-16", timeKST: "12:30", dateLabel: "10월 16일 (금)",
    event: "워시 연준 의장 — IMF 게오르기에바 총재와 대담 (방콕) (결과 확정)",
    tickers: ["SPY","QQQ","EWY","KORU","BTC","ETH","XAU","MSTR"], importance: 5,
    note: "결과: '남은 회의에서 무엇을 할지 지금 말하지 않겠다' — 금리 가이던스 없음, 물가 안정 최우선·최근 글로벌 동반 긴축 평가, AI 발전 경로는 '매우 울퉁불퉁할 것'. FT 기준 10월 인상 확률 약 27% → 15%로 하락, BTC $82K대 강보합. 사전 메모: 연준 일정표 美 동부 10/15 23:30 = KST 10/16 12:30. 10/17부터 FOMC 침묵기간이라 10월 회의 전 사실상 마지막 공개 발언 — CPI 상회 후 10월 인상 가능성에 대한 톤이 관건(단기 정책 가이던스는 하지 않겠다는 입장 유지 중)" },

  { dateKST: "2026-10-16", timeKST: "22:15", dateLabel: "10월 16일 (금)",
    event: "미국 9월 산업생산·설비가동률 (결과 확정)",
    tickers: ["SPY","QQQ"], importance: 2,
    note: "결과: 산업생산 전월비 +0.7%(예상 +0.4%, 8월 +0.1%)·광업 +0.2%·유틸리티 +3.5%, 설비가동률 76.9%(예상 76.5%, 8월 76.4%) — Investrade 집계. 지표 호조에도 10년물 5.10% 보합. 사전 메모: 연준 G.17 발표(09:15 ET). 예상 산업생산 전월비 +0.4%(전월 0.0%)·가동률 76.5%(전월 76.3%) — TradingCharts 집계. 시장 영향은 제한적" },

  { dateKST: "2026-10-16", timeKST: "15:30", dateLabel: "10월 16일 (금)",
    event: "🇰🇷 코스피 +2.05% 반등 — 7거래일 연속 하락 종료 (결과 확정)",
    tickers: ["EWY","KORU","SKHY","SAMSUNG","HYUNDAI"], importance: 4,
    note: "결과: 코스피 5,668.05(+2.05%, 장중 5,590~5,810), 코스닥 794.78(+4.46%, 12:55 매수 사이드카). 삼성전자 21.55만(+2.62%), SK하이닉스 127.2만(+0.79%), 현대차 +5.58%. 외국인 코스피 3,410억 순매수(9거래일 만에 전환), 기관 -6,833억·개인 -4,846억. 원/달러 1,331.4원(-13.2). 전문가들은 '기술적 반사 매수' 성격으로 평가 — 10/22 금통위·FOMC 앞 신중론" },

  { dateKST: "2026-10-16", timeKST: "21:30", dateLabel: "10월 16일 (금)",
    event: "미국 9월 수입물가지수 (결과 확정)",
    tickers: ["SPY","QQQ","XAU"], importance: 2,
    note: "결과: 전월비 +1.1%(로이터 예상 +0.8%, 8월 +0.5%로 하향 수정)·전년비 +8.1%(2022년 7월 이후 최대), 연료 +4.8%·식품·연료 제외 +0.7%(전년비 6.2%). 수출물가 +2.2%(예상 +1.0%)·전년비 11.6%. PPI 쇼크에 이은 물가 확산 신호. 사전 메모: 예상 전월비 +0.7%(전월 0.7%)·전년비 7.7%(전월 7.0%) — TradingCharts 집계. PPI(+1.3%) 쇼크 다음 날이라 상회 시 물가 우려 재점화 가능" },

  { dateKST: "2026-10-17", timeKST: null, dateLabel: "10월 17일 (토) ~ 29일 (목)",
    event: "FOMC 블랙아웃(침묵기간) 시작 (결과 확정)",
    tickers: ["SPY","QQQ","BTC","ETH","XAU"], importance: 2,
    note: "결과: 10/17부터 시행 중 — 직전 CME FedWatch 10월 인상 17%·12월까지 인상 89%(10/16 Yahoo Finance 인용). 10/27~28 회의 앞두고 연준 인사 공개 발언 중단(관례상 회의 2주 전 토요일부터). 이후 금리 기대는 지표·언론 보도로만 움직임" },

  { dateKST: "2026-10-15", timeKST: "15:00", dateLabel: "10월 15일 (목)",
    event: "TSMC 3분기 실적 발표 (결과 확정)",
    tickers: ["TSM","SOXL","NVDA","AMD"], importance: 5, note: "결과: 매출 $467.2억(전분기비 +16.2%, 예상 $454.1억 상회)·EPS $4.60(예상 $4.42)·매출총이익률 66.4%(전분기비 -1.3%p, 2나노 초기 램프)·영업이익률 58.7%. 4분기 가이던스 매출 $523~543억(중간값 전분기비 +14%·전년비 +58%), GM 65~67%. 2026 설비투자 $600~640억 유지, 2026~28년 직전 3년보다 대폭 증가. C.C. 웨이 'AI 수요 극도로 견조, 공급 부족 지속'. 마진 희석·capex 우려로 ADR은 10/14 $430(-3.4%) → 실적 후 프리마켓 $423.7(-1.5%). 사전 메모: 실적 캘린더 기준 10/15(목) 잠정 확정. TSMC 실적 컨퍼런스는 통상 대만 14:00(KST 15:00) — 공식 IR 공지 근접 시 재확인 필요. 3분기 매출(NT$1.49조, 사상 최대)은 이미 확인 — 관건은 마진·4분기 가이던스(시장 기대 약 NT$1.66조)·CoWoS 증설·2027년 가격 인상" },

  { dateKST: "2026-10-16", timeKST: "09:55", dateLabel: "10월 16일 (금)",
    event: "테슬라 신형 로드스터 공개 이벤트 (텍사스 맥그레거, 10/1에서 연기) (결과 확정)",
    tickers: ["TSLA"], importance: 4,
    note: "결과: Performance·Thrust(후방 냉가스 추진기, 한정)·Rocket(초청 전용 1인승) 3개 버전 공개, 시연 0→60mph 0.81초·주행거리 300마일+·최고속 230mph+(회사 주장), 공도 주행 미승인. 양산 2028년 목표. 예약금 Performance $5만·Thrust $25만. TSLA 10/15 정규장 $362.44(-1.3%) → 야간거래 약 +3%. 먼스터 '엔지니어링 과시, 상업적 가치는 없지만 테슬라-스페이스X 결합 힌트'. 사전 메모: 시각 확정: 美 중부 10/15 19:55(CDT) = KST 10/16 09:55, X 생중계(Tesla Oracle 보도). TSLA 10/14 종가 $367.16(-2.15%). 당초 10/1 예정이었으나 9/28 테슬라가 웨이코 지역 악천후를 이유로 美 현지 10/15(목)로 연기 — 올해만 다섯 번째 날짜 변경. 장소는 SpaceX 맥그레거 로켓 시험장, 예약자 초청 전용·야외 행사. 현지 시각 미발표(기존 17:30 PT 기준이면 KST 10/16 09:30). SpaceX 협업 냉가스 추진기 버전 공개 가능성, 양산은 공개 후 12~18개월 전망" },

  { dateKST: "2026-10-16", timeKST: null, dateLabel: "10월 16일 (금)",
    event: "OpenAI DevDay Exchange — 벵갈루루 (결과 확정)",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "결과: 시장에 영향을 준 발표는 확인되지 않음(세부 내용 미확인). 사전 메모: 글로벌 순회 개발자 밋업 1차 도시. 구체적 현지 시각·세부 발표 미정, 시장 영향은 미미할 전망" },

  { dateKST: "2026-10-17", timeKST: "05:00", dateLabel: "10월 17일 (토)",
    event: "10월 월간 옵션만기 (美 현지 10/16 금 정규장 마감) (결과 확정)",
    tickers: ["SPY","QQQ","TSLA","PLTR","GOOGL","META","NVDA","AAPL","AMZN","MSFT"], importance: 3,
    note: "결과: 10/16 마감 S&P500 7,659.44(-1.09%)·나스닥 26,140.03(-2.14%)·다우 52,002.41(-0.34%)·러셀 2,721.37(-1.66%), 반도체지수 11,137.29(-3.83%, 8일 연속↓), VIX 19.99(+21%). 주간 나스닥 -4.5%·S&P -2.0%·다우 +0.7%. CRWV -11.9%·PLTR -7.2%·AMD -6.0%·MU -5.6%($878.84)·SNDK -6.9%·AVGO -4.5%·META -3.7%·TSLA -2.1%($354.72, 장중 $385.5)·NVDA -1.4%($214.13)·AAPL +0.4%. 10년물 5.10%, WTI $101.41·브렌트 $109.86(정산). 코스피200 야간선물 -3.50%(서울경제). 사전 메모: 빅테크 실적 시즌 직전 만기 — 테슬라 로드스터(10/15)·실적(10/22) 사이 변동성 확대 구간" },

  { dateKST: "2026-10-16", timeKST: "05:48", dateLabel: "10월 16일 (금)",
    event: "MSCI, '비영업회사' 지수 제외 규칙 확정 — Strategy(MSTR) 11/30 제외 유력 (결과 확정)",
    tickers: ["MSTR","BTC"], importance: 4,
    note: "결과: 美 동부 10/15 16:48 발표. 자산 보유 중심 기업을 MSCI 글로벌 IMI 편입 대상에서 제외 — 11월 정기변경(11/30 마감 반영)에서 Strategy 제외 예정, 최종 명단 11/11 공개. 잠정 제외 후보 5개사(유동시가 $430억 중 Strategy $403억), 관찰 대상 17개사. Strategy는 MSCI 추종 펀드 보유 약 1,300만주(기본주식의 약 3.1%, 약 $18억) 추정. MSTR 10/16 -9.56%($136.83) — BTC는 같은 날 $81K대로 소폭 하락에 그침(TECHi·Investing.com)" },

  { dateKST: "2026-10-17", timeKST: null, dateLabel: "10월 17일 (토)",
    event: "호르무즈 해협 초대형 유조선 2척 기뢰 피격 주장 — 사우디 주바일 인근 유조선도 피격 (결과 확정)",
    tickers: ["CL","XAU","SPY","BTC","EWY","KORU"], importance: 4,
    note: "결과: 이란 혁명수비대가 '테헤란 승인 없이 통항하던 원유 200만 배럴 이상 적재 초대형 유조선이 기뢰에 맞아 화재'라고 주장(독립 확인 안 됨, RFE/RL 10/17). 영국 해사무역기구(UKMTO)는 사우디 주바일 인근 유조선이 미상 발사체에 맞아 선원 전원 대피했다고 보고. 美 중부사령부는 해상봉쇄로 이란 원유 수출 최소 $250억 차단 발표(10/16). 금요일 브렌트 약 $110(+3.5%)로 마감한 뒤 주말 발생 — 10/19 07:00 원유선물 재개 시 갭 위험. 업데이트(10/19): 혁명수비대는 피격 유조선이 2척(각 약 200만 배럴, 위치·레이더 장치를 끄고 무단 항로 통과)이라고 밝힘 — 선박명·화물 출처는 미공개(Al Jazeera 10/18). 10/16 정산 브렌트 $109.86(+3.7%, 5월 이후 최고)·WTI $101.41(+3.5%), 주간 브렌트 +4.9%·WTI +10.4%" },

  { dateKST: "2026-10-18", timeKST: null, dateLabel: "10월 18일 (일)",
    event: "UAE 호르파칸 인근 예인선 피격 · 이란 '새 작전계획' 경고 · '6일 내 해협 재개' 제안 유지 (결과 확정)",
    tickers: ["CL","XAU","SPY","BTC","EWY","KORU"], importance: 3,
    note: "결과: UKMTO — UAE 북동쪽(호르파칸 인근) 남행 예인선이 미상 발사체 2발에 피격, 경상 1명·운항 지속. 이란 국가안보회의 레자이 '새 작전계획은 그들이 아는 규칙을 따르지 않을 것'(X). 아락치 외무장관 '압박에 주권 포기 안 하지만 대화 의지' — 美 봉쇄 해제·원유 제재 해제·역내 적대행위 종료 등 조건 수용 시 6일 내 해협 재개·7일째 협상 제안 유지. 이란 군 대변인은 '미군 철수 시 재개' 주장. 트럼프는 종전 합의를 11/3 중간선거 이후로 예상. 10/19 07:00 원유·지수선물 재개 첫 반영(Briefs·FinanceFeeds·Sunday Guardian)" },

  { dateKST: "2026-10-19", timeKST: "11:00", dateLabel: "10월 19일 (월)",
    event: "중국 3분기 GDP · 9월 소매판매·산업생산 (결과 확정)",
    tickers: ["EWY","KORU","SAMSUNG","SKHY","HYUNDAI","CL","XAU","TSM"], importance: 4,
    note: "결과: 3분기 GDP 전년비 4.5%로 컨센서스(4.4%, 로이터 폴)·2분기(4.3%) 상회(신화·국무원 신문판공실). 9월 수출 +36.3% 급증이 성장을 견인한 반면 소매판매는 부진(Vantage Markets 보도, 세부 수치·전기비 성장률은 미확인). 당일 코스피는 美 반도체 급락 여파 속에 등락" },

  { dateKST: "2026-10-20", timeKST: "21:30", dateLabel: "10월 20일 (화)",
    event: "미국 9월 주택착공·건축허가 (일정 경과)",
    tickers: ["SPY","QQQ"], importance: 2,
    note: "예상치 미확인. 10년물 5.1% 고금리 속 주택 경기 확인 — 시장 영향은 제한적. 전날(10/19 23:00 KST) NAHB 주택시장지수 — 결과 수치 미확인(시장 반응 제한적)" },

  { dateKST: "2026-10-22", timeKST: "02:00", dateLabel: "10월 22일 (목)",
    event: "미국 20년물 국채 입찰 (일정 경과)",
    tickers: ["SPY","QQQ","XAU","BTC"], importance: 2,
    note: "美 현지 10/21(수) 13:00 ET(재무부 일정, Wealthier Today 인용). 응찰 부진(테일) 시 장기금리 재상승 — 같은 날 새벽 테슬라·메타 실적과 겹침 — 낙찰 결과 미확인. 같은 날(10/22 美 현지) 메타 쇼크로 안전자산 수요가 몰리며 10년물이 19bp 급락(4.953%, 2023년 3월 이후 최대 하락폭)" },

  { dateKST: "2026-10-23", timeKST: "22:45", dateLabel: "10월 23일 (금)",
    event: "미국 10월 S&P글로벌 제조업·서비스업 PMI(예비) · 미시간대 소비자심리(확정) (결과 확정)",
    tickers: ["SPY","QQQ","EWY"], importance: 3,
    note: "결과: S&P글로벌 제조업 PMI(예비) 56.0으로 53개월 최고, 서비스업 PMI는 미확인. 미시간대 소비자심리 48.0(예상 46.3) — 사상 최저권, 1년 기대인플레 4.7%·5년 3.5%. 같은 날 브렌트 $116.72(+3.1%) 급등, 10년물 4.999%(+5bp), S&P -0.52%·다우 -1.23%(Capp Notes·AP)" },

  { dateKST: "2026-10-30", timeKST: "05:05", dateLabel: "10월 30일 (금)",
    event: "Intel(INTC) 3분기 실적 발표(확정)",
    tickers: ["SOXL","NVDA","AMD","TSM"], importance: 3,
    note: "StockTitan(회사 공지 기준): 美 현지 10/29(목) 장마감 후, 컨퍼런스콜 17:00 ET(=KST 06:00). 아마존·샌디스크·MSTR·코인베이스와 같은 날 새벽. 10/23 INTC +1.72%로 반도체 반등 동참 — 파운드리·AI PC 가이던스 주목 업데이트(10/26): 컨센서스 EPS $0.40(heygotrade)" },

  { dateKST: "2026-11-12", timeKST: null, dateLabel: "11월 11일 (美 현지)",
    event: "MSCI 11월 정기변경 최종 명단 발표 — Strategy 제외 여부 확정",
    tickers: ["MSTR","BTC"], importance: 3,
    note: "발표 시각 미확인(통상 美 장마감 후 → KST 11/12 새벽). 10/16 확정된 '비영업회사' 규칙 적용 첫 정기변경" },

  { dateKST: "2026-12-01", timeKST: "06:00", dateLabel: "12월 1일 (화)",
    event: "MSCI 11월 정기변경 적용 (美 현지 11/30 마감) — Strategy 제외 반영",
    tickers: ["MSTR","BTC"], importance: 3,
    note: "美 현지 11/30(월) 종가 기준 리밸런싱(EST 전환으로 마감 KST 06:00). 패시브 매도 물량은 마감 동시호가에 집중 — Strategy 추정 약 1,300만주" },

  { dateKST: "2026-10-19", timeKST: null, dateLabel: "10월 19일 (월, 대만)",
    event: "Micron 타오위안 노조 타이베이 집회 (파업 아님) (일정 경과)",
    tickers: ["MU"], importance: 2,
    note: "노조가 단체 휴가 형태 참여를 독려하는 집회 — 참여 규모가 실제 파업 동력의 가늠자 — 결과: 집회 규모는 미확인. 이틀 뒤(10/21) 마이크론이 타이중 노조와 노사 합의를 발표하며 노사 리스크 완화(The Star·Newsquawk)" },

  { dateKST: "2026-10-20", timeKST: null, dateLabel: "10월 20일 (화)",
    event: "OpenAI DevDay Exchange — 도쿄 (일정 경과)",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업. 구체적 현지 시각·세부 발표 미정, 시장 영향은 미미할 전망 — 시장에 영향을 준 발표는 확인되지 않음" },

  { dateKST: "2026-10-21", timeKST: "05:01", dateLabel: "10월 21일 (수)",
    event: "Netflix(NFLX) 3분기 실적 발표(확정) (결과 확정)",
    tickers: ["QQQ","SPY"], importance: 3,
    note: "회사 공지(9/14): 美 현지 10/20(화) 장마감 후 발표(StockTitan 기준 16:01 ET = KST 05:01), 공동 CEO 영상 인터뷰 16:45 ET(=KST 05:45). 빅테크 실적 시즌 첫 대형주 — 같은 날 GE·GM·RTX(장전) — 결과: 이익은 컨센서스를 상회했지만 광고 매출·가이던스가 기대에 못 미쳐 주가 약 -6%(Kaohoon·NewsBytes). 세부 수치는 미확인" },

  { dateKST: "2026-10-22", timeKST: "05:05", dateLabel: "10월 22일 (목)",
    event: "램리서치(LRCX)·텍사스인스트루먼트(TXN)·IBM 3분기 실적 (결과 확정)",
    tickers: ["SOXL","NVDA","AMD","MU","SKHY","SAMSUNG","TSM"], importance: 4,
    note: "결과: 램리서치 매출 $82.2억(전분기비 +22%)·조정 EPS $2.20·영업이익률 40.0%였지만 이번 분기 가이던스가 높은 기대에 못 미쳐(CFO '단기 공급 제약') 10/22 -11.8%(TradingKey), 모건스탠리·씨티 목표가 하향 — 마이크론·인텔 동반 하락. IBM은 매출·이익 상회에도 2027년 성장 전망 의문으로 약 -7%. TI 결과·주가 반응은 미확인. 같은 날 메타 -7.0%와 겹쳐 나스닥 -2.60%(6월 이후 최대)" },

  { dateKST: "2026-10-23", timeKST: "05:05", dateLabel: "10월 23일 (금)",
    event: "Western Digital(WDC) FY1Q 실적 발표 (결과 확정)",
    tickers: ["SNDK","MU","SKHY","SAMSUNG"], importance: 3,
    note: "결과(美 현지 10/22 장마감 후): 매출 $43.8억(+55%, 예상 $41.4억)·조정 EPS $4.64(예상 $4.08)·총이익률 58.1%, 배당 17% 인상. 다음 분기 가이던스 매출 $50~52억·EPS $5.60~6.00으로 컨센서스 크게 상회. 그러나 콜 이후 AI 인프라 자금 경색 우려에 주가 반락(Investing.com) — '좋은 실적에도 매도' 패턴, 10/30 샌디스크 실적 전 경계 신호" },

  { dateKST: "2026-10-22", timeKST: "05:05", dateLabel: "10월 22일 (목)",
    event: "테슬라 3분기 실적 발표(확정) (결과 확정)",
    tickers: ["TSLA"], importance: 5,
    note: "美 현지 10/21(수) 장마감 후 — 회사 공식 공지(3분기 인도량 발표문)로 확정. Q&A 웹캐스트 16:30 CT(=KST 06:30). 인도 서프라이즈(48.65만) 이후 자동차 마진·가격 정책·에너지·Robotaxi/옵티머스가 핵심. 기존 '10/29 확정' 표기 정정 — 결과: 매출 약 $280억(전년비 소폭 감소)·순이익 $7.87억(-44%)·조정 EPS $0.48(컨센서스 상회)·FCF 약 $15억. 2026년 capex 계획을 $50억 줄인 약 $200억으로 하향. 10/22 -3.08%, 이후 SpaceX 합병 기대로 10/23 $372.22(주간 +4.9%)" },

  { dateKST: "2026-10-22", timeKST: "09:00", dateLabel: "10월 22일 (목)",
    event: "한국은행 금융통화위원회 (기준금리 결정) (결과 확정)",
    tickers: ["EWY","KORU"], importance: 4, note: "2026년 정례회의 일정(1/15·2/26·4/10·5/28·7/16·8/27·10/22·11/26) 중 하나로 날짜 확정. 현 기준금리 3.00%(7월·8월 연속 인상, KB 리포트 기준) — 기존 '2.50%' 표기 정정. 이번 회의는 3.00% 동결 전망(이투데이 10/17). 8월 점도표 중간값 3.25%로 6개월 내 1~2회 추가 인상 시사 — 코스피 급락·원화 강세 진정 속 톤이 관건 — 결과: 기준금리 연 3.00% 동결(숨 고르기). '물가 등을 점검하면서 추가 인상 시기·속도 결정' — 인상 기조는 유지(한국금융신문·비즈워치)" },

  { dateKST: "2026-10-22", timeKST: null, dateLabel: "10월 22일 (목)",
    event: "OpenAI DevDay Exchange — 서울 (일정 경과)",
    tickers: ["NVDA","AMD","GOOGL","META","EWY","KORU"], importance: 2,
    note: "글로벌 순회 개발자 밋업, 국내 개최. 구체적 현지 시각·장소 미정 — 근접 시 재확인 필요. 같은 날 한국은행 금통위(10/22)와 일정 겹침 주의 — 시장에 영향을 준 발표는 확인되지 않음" },

  { dateKST: "2026-10-30", timeKST: "05:05", dateLabel: "10월 30일 (금, 새벽)",
    event: "SanDisk(SNDK) Q1 FY2027 실적 발표(확정)",
    tickers: ["SNDK","MU","SKHY"], importance: 5,
    note: "회사 공지(9/29): 美 현지 10/29 장마감 후 발표·웹캐스트(정확한 KST 시각은 근접 시 재확인). 가이던스 매출 $103~108억·EPS $44~46·매출총이익률 83~85% — 소비자용 부진 vs 데이터센터 SSD 성장, NAND 가격 둔화 여부가 관건 업데이트(10/25): StockTitan 기준 컨퍼런스콜 16:30 ET(=KST 05:30), 발표는 장마감 직후 가정. 10/23 SNDK $1,238(-1.82%·주간 -4.7%) — WDC가 호실적에도 콜 이후 하락한 점이 부담 업데이트(10/26): FinanceFeeds도 발표 13:30 PT(=16:30 ET, KST 10/30 05:30)로 표기. 주말 Trade.xyz 무기한 $1,237.2(금요일 종가와 비슷). 10/28 새벽 시게이트 실적이 선행 지표" },

  { dateKST: "2026-10-30", timeKST: "05:05", dateLabel: "10월 30일 (금)",
    event: "Amazon(AMZN) 3분기 실적 발표(확정)",
    tickers: ["AMZN"], importance: 5, note: "StockTitan(회사 공지 기준): 美 현지 10/29(목) 장마감 후, 컨퍼런스콜 17:00 ET(=KST 06:00). 재시 CEO 'AWS 용량 2027년까지 매진'(로이터) — AWS 성장률·capex 가이던스가 핵심. 10/23 AMZN $248.00 업데이트(10/26): 컨센서스 EPS $1.96·매출 $2,022억(heygotrade)" },

  { dateKST: "2026-10-30", timeKST: "17:00", dateLabel: "10월 30일 (금)",
    event: "Deribit 비트코인·이더리움 10월 월간 옵션 만기(추정)",
    tickers: ["BTC","ETH"], importance: 3,
    note: "매월 마지막 금요일 08:00 UTC. FOMC(10/29)·빅테크 실적 직후라 만기 전후 BTC/ETH 변동성 확대 가능" },

  { dateKST: "2026-10-24", timeKST: null, dateLabel: "10월 24일 (토)",
    event: "SpaceX(SPCX) 락업 해제 — 약 3.28억주 (일정 경과)",
    tickers: ["SPCX","QQQ"], importance: 2,
    note: "10/24(토) 해제 완료, 출회 규모는 미확인 — 10/23 SPCX $147.49(+1.89%)로 해제 직전 강세. 10월 2차 해제(10/9와 합계 약 6.56억주). 美 주말이라 실질 반영은 10/26(월) 美 개장(10/26 22:30 KST)" },

  { dateKST: "2026-10-26", timeKST: null, dateLabel: "10월 26일 (월)",
    event: "OpenAI DevDay Exchange — 베를린",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업. 구체적 현지 시각·세부 발표 미정, 시장 영향은 미미할 전망" },

  { dateKST: "2026-10-22", timeKST: null, dateLabel: "10월 22일 (목, 대만)",
    event: "Micron 대만 타이중 노조 노사 중재 (결과 확정)",
    tickers: ["MU"], importance: 3,
    note: "타오위안 노조 파업권 확보(10/7)에 이은 두 번째 노사 협상 분수령 — 결렬 시 타이중 노조(조합원 약 1.1만) 파업 투표 진행 가능 — 결과: 마이크론이 10/21 타이중 노조와 노사 합의, 양측 모두 10/22 중재 절차에서 철회(Newsquawk·The Star·Taipei Times). 파업 리스크 완화" },

  { dateKST: "2026-10-28", timeKST: "09:00", dateLabel: "10월 28일 (수)",
    event: "SK하이닉스 3분기 실적 발표·컨퍼런스콜(확정)",
    tickers: ["SKHY","SAMSUNG","EWY","KORU"], importance: 5, note: "10/28(수) 실적·컨콜(인사이트·머니투데이), 발표는 오전(ZDNet) — 정확한 시각은 미확인(09:00은 정렬용, 2분기는 7/29 08:00). 컨센서스 매출 약 98.2조원·영업이익 약 77.0조원(ZDNet 10/25, 사상 최대). 40조원 자사주 매입을 10/21 조기 완료(약 2,370만주), 2025~27년 누적 FCF 50% 이상 환원 방침 — 특별배당·추가 소각 여부 주목. 10/23 솔리다임 美 상장 검토 중단으로 희석 우려 해소, 본주 +4.42%(127.7만)·ADR +4.05%. 2027년 HBM·범용 D램 장기공급계약·증설 계획이 관건 업데이트(10/26): FinanceFeeds 기준 실적은 09:00 이전 공시, 컨퍼런스콜 09:00 KST. FnGuide 컨센서스 영업익 76.96조·매출 98.23조(6분기 연속 사상 최대) — 3개월 전 기대치(81.51조)보다 5.6% 낮아진 수준(번스타인), 메리츠 80.06조 추정. 10/26 본주 -0.16%(127.5만) — 10/23 밤 ADR +4% 반영 실패, 외국인 이틀째 코스피 순매도" },

  { dateKST: "2026-10-27", timeKST: null, dateLabel: "10월 27일 (화) (잠정)",
    event: "이더리움 Glamsterdam — Hoodi 테스트넷 활성화 (잠정)",
    tickers: ["ETH"], importance: 3,
    note: "Sepolia(10/6) 다음 단계, 날짜는 개발자 콜 기준 잠정. 순조로우면 메인넷 날짜 확정 논의로 이어짐 — 메인넷은 상반기 → 4분기로 이미 연기된 이력이 있어 추가 지연 시 실망 재료" },

  { dateKST: "2026-10-28", timeKST: null, dateLabel: "10월 28일 (수)",
    event: "OpenAI DevDay Exchange — 파리",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업. 美 현지 기준 같은 날(10/28) Alphabet·Microsoft·Meta 실적 발표 예상(KST 10/29 새벽). 구체적 현지 시각·세부 발표 미정" },

  { dateKST: "2026-10-29", timeKST: "05:05", dateLabel: "10월 29일 (목)",
    event: "Alphabet(GOOGL) 3분기 실적 발표(확정)",
    tickers: ["GOOGL"], importance: 5, note: "StockTitan(회사 공지 기준): 美 현지 10/28(수) 장마감 후, 컨퍼런스콜 16:30 ET(=KST 05:30) — 기존 '콜 17:30 ET' 표기 정정. 컨센서스 매출 약 $1,273억·EPS $3.04(기존 자료). 검색 성장·Cloud·CapEx·Gemini 수익화가 핵심. 10/23 GOOGL $320.21(주간 -6.0%), 시티즌스 목표가 하향 업데이트(10/26): 컨센서스 EPS $3.00·매출 $1,279억(heygotrade)" },

  { dateKST: "2026-10-29", timeKST: "03:00", dateLabel: "10월 29일 (목)",
    event: "FOMC 금리결정 발표 (10/27~28 회의)",
    tickers: ["EWY","ETH","META","GOOGL","KORU","MSTR","MU","NVDA","SKHY","SPY","ONDO","SOL","SNDK","SOXL","QQQ","TSLA","TSM","AAPL","AMZN","AMD","CL","BTC","XAU","PLTR","AVGO","CRCL"],
    importance: 5, note: "9/16 FOMC에서 25bp 인상(3.75→4.00%) 이후 두 번째 결정. 9월 의사록(10/8): 다수 위원 '연말까지 1회 추가 인상 적절', 시점은 데이터 의존. 10월 인상 확률은 9월 말 약 71% → 9/30 PCE 하회로 35% → 10/2 고용 쇼크로 16% → 의사록 후 약 20%. 반면 ISM 지불가격 77.9·호르무즈發 유가 반등으로 물가 압력 잔존. 10/14 CPI(근원 +0.3%·전년비 3.7%) 예상 상회로 10월 인상 확률 22% → 약 44~50%로 급등 — 10/15 PPI·소매판매와 10/16 워시 대담(침묵기간 전 마지막)이 남은 변수. 업데이트(10/16): PPI 전월비 +1.3%·근원 +0.7% 폭등에도 데일리·보우만 '서두를 필요 없다', 워시 가이던스 없음 → 10월 인상 확률 54%→32%(CME)→약 15%(FT), 12월까지 인상 약 90%. 해먹은 '금융여건이 긴축적이지 않다'며 매파 유지. 업데이트(10/18): 10/16 수입물가 +1.1%·산업생산 +0.7% 상회에도 CME FedWatch 10월 인상 17%(28%에서 하락)·12월까지 89%(Yahoo Finance 인용). 10/17부터 침묵기간 업데이트(10/25): CME FedWatch 10월 인상 9%(Yardeni 10/23 인용)·Kalshi 동결 92%, 12월 인상 확률은 CME 약 71%(Capp Notes)~84%(Yardeni)로 출처별 상이. 브렌트 $116.72(4/29 이후 최고)·미시간 1년 기대인플레 4.7%로 물가 압력 재확대 — 12월 인상 시사 여부가 핵심. 발표 14:00 ET(=KST 03:00), 워시 의장 기자회견 14:30 ET(=KST 03:30). 이번 회의는 경제전망(점도표) 없음 업데이트(10/26): CME FedWatch 기준 10월 동결 약 88%(heygotrade), 12월 인상 확률 약 75%(FinanceFeeds)~80%(FXEmpire). 주말 사이 브렌트 12월물 $114.6(-1.8%)로 소폭 하락. 9월 FOMC에서 25bp 인상 후 현 기준금리 상단 4.00% — 시장은 '동결 + 12월 인상 시사' 여부에 주목" },

  { dateKST: "2026-10-29", timeKST: "05:05", dateLabel: "10월 29일 (목)",
    event: "Microsoft(MSFT) FY2027 1분기 실적 발표(확정)",
    tickers: ["MSFT"], importance: 5, note: "StockTitan(회사 공지 기준): 美 현지 10/28(수) 장마감 후, 컨퍼런스콜 17:30 ET(=KST 06:30). Azure 성장률·AI Capex 가이던스 핵심. 알파벳·KLA와 같은 날 새벽, FOMC(03:00) 직후. 10/23 MSFT $524.51(주간 -0.9%) 업데이트(10/26): 컨센서스 EPS $4.71(heygotrade). 머스크의 '네오클라우드 구피 수준 소멸·통합' 발언(10/25)으로 AI 인프라 자금조달 우려가 다시 부각된 상황" },

  { dateKST: "2026-10-22", timeKST: "05:05", dateLabel: "10월 22일 (목)",
    event: "Meta(META) 3분기 실적 발표(확정) (결과 확정)",
    tickers: ["META"], importance: 5, note: "회사 공지(10/12): 美 현지 10/21(수) 장마감 후 발표, 컨퍼런스콜 16:30 ET(=KST 05:30). 기존 '10/29 예상' 표기 정정 — 테슬라와 같은 날 새벽. 매출 가이던스 $610~640억, 약 $100억 법적 비용 일시 반영, Muse 초기 매출·Capex 가이던스가 핵심 — 결과: 매출 $646.0억(+26%, 예상 상회)·4분기 가이던스 상회에도 3분기 capex $349억·잉여현금흐름 -$21.2억, 2026 capex 가이던스 하단 상향($1,350~1,450억)·2027년 '상당히 더 큰 투자' 예고. 무의결권 C주 신설(2027/1/19 1:1 주식배당). 10/22 -6.98% → 나스닥 -2.60%(6월 이후 최대), 주간 -9.4%($642.62)" },

  { dateKST: "2026-10-29", timeKST: null, dateLabel: "10월 29일 (목)",
    event: "삼성전자 3분기 확정 실적·컨퍼런스콜 + 특별배당 발표",
    tickers: ["SAMSUNG","SKHY","EWY","KORU"], importance: 4,
    note: "10/8 잠정실적(영업익 107.4조) 이후 부문별(DS·메모리·HBM) 상세와 3분기 특별배당 확정. 같은 날 새벽 FOMC·빅테크 실적과 겹침 — 정확한 시각은 공시 근접 시 재확인 업데이트(10/25): 잠정 매출 195조·영업익 107.4조(역대 최대). 2026년 주주환원 90~110조 중 약 30조를 3분기 현금배당(정기배당 포함)으로 지급 예정, 정확한 금액은 10월 말 이사회에서 결정(인사이트). 3년 주주환원 정책 종료에 따른 후속 정책 주목. 10/23 외국인 삼성 약 7,800억 순매수(머니투데이)" },

  { dateKST: "2026-11-03", timeKST: "06:30", dateLabel: "11월 3일 (화)",
    event: "Apple(AAPL) 4분기(9월 분기) 실적 발표(확정)",
    tickers: ["AAPL"], importance: 5, note: "StockTitan: 컨퍼런스콜 美 현지 11/2(월) 17:00 ET — 11/1 서머타임 종료로 EST 기준 KST 11/3 07:00, 발표는 장마감 직후(약 06:30 KST 추정). 기존 '10/30 05:30(예상)' 표기 정정. 10/23 AAPL $347.73, 장중 $351.73로 52주 신고가 — 실적 직전 고점 부담" },

  { dateKST: "2026-11-01", timeKST: null, dateLabel: "11월 초 (미정)",
    event: "SpaceX(SPCX) 스태거드 락업 최대 물량(약 13억주) 해제 — 시점 재확인 필요",
    tickers: ["SPCX","QQQ","TSLA"], importance: 5,
    note: "정정(10/25): 3분기 실적은 美 현지 10/20 발표 완료(별도 항목). 기존 자료상 '실적 발표 2거래일 후' 최대 약 13억주 해제가 트리거되는 구조라면 이미 10/22~23 전후였을 수 있으나, 해제 여부·물량을 공식 자료로 확인하지 못함(미확인) — 정렬용 임시 날짜. 10/23 SPCX $147.49(+1.89%)" },

  { dateKST: "2026-11-03", timeKST: "06:00", dateLabel: "11월 3일 (화)",
    event: "Palantir(PLTR) 3분기 실적 발표(예상)",
    tickers: ["PLTR"], importance: 5,
    note: "美 현지 11/2(월) 장마감 후 예상 — 회사 공식 공지 전(작년 패턴·MarketBeat 등 기준). 3분기 가이던스 매출 $21.6억, 美 상업 성장률·Armada 등 파트너십 계약 전환이 핵심. 기존 '11/10 확정' 표기 정정" },

  { dateKST: "2026-11-03", timeKST: null, dateLabel: "11월 3일 (화)",
    event: "OpenAI DevDay Exchange — 런던",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업. 구체적 현지 시각·세부 발표 미정, 시장 영향은 미미할 전망" },

  { dateKST: "2026-11-04", timeKST: "06:00", dateLabel: "11월 4일 (수)",
    event: "AMD 3분기 실적 발표(예상)",
    tickers: ["AMD"], importance: 5, note: "美 현지 11/3 장마감 후 예상 — 회사 공식 공지 전(작년 일정 기반 추정). 3분기 가이던스 ~$130억 vs 컨센서스 $124억, Helios 매출·4분기 가이던스가 핵심" },

  { dateKST: "2026-10-30", timeKST: "05:05", dateLabel: "10월 30일 (금)",
    event: "MicroStrategy(MSTR) 3분기 실적 발표(확정)",
    tickers: ["MSTR"], importance: 4, note: "정정(10/25): StockTitan(회사 공지 기준) 美 현지 10/29(목) 장마감 후, 컨퍼런스콜 17:00 ET(=KST 06:00) — 기존 '11/5' 표기 정정. MSCI 지수 제외 규칙 확정(10/16) 이후 첫 실적, 대응 방안 언급 여부 주목. 같은 날 코인베이스 실적·FOMC 직후. 10/23 MSTR $146.01" },

  { dateKST: "2026-11-06", timeKST: null, dateLabel: "11월 6일 (금)",
    event: "OpenAI DevDay Exchange — 상파울루",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업 마지막 순번 이전 도시. 구체적 현지 시각·세부 발표 미정" },

  { dateKST: "2026-11-10", timeKST: null, dateLabel: "11월 10일 (화)",
    event: "OpenAI DevDay Exchange — 멕시코시티",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업 마지막 도시. 같은 날 애플 배당락일과 겹침. 구체적 현지 시각·세부 발표 미정" },

  { dateKST: "2026-11-10", timeKST: "09:00", dateLabel: "11월 10일 (화)",
    event: "Apple(AAPL) 배당락일",
    tickers: ["AAPL"], importance: 1, note: null },

  { dateKST: "2026-11-18", timeKST: "21:00", dateLabel: "11월 18일 (수)",
    event: "Circle(CRCL) 3분기 실적 발표(확정)",
    tickers: ["CRCL"], importance: 4, note: "美 현지 11/18 장 개장 전 발표. 단, Investing.com(10/17)은 '11/4 3분기 실적 예정'으로 보도 — 날짜 충돌, 회사 공지로 재확인 필요. CRCL 10/16 -5.46%($82.22) 업데이트(10/25): StockAnalysis도 다음 실적일을 11/4로 표기 — 11/4 가능성이 커졌으나 회사 공지로 최종 확인 필요" },

  { dateKST: "2026-11-26", timeKST: "06:00", dateLabel: "11월 26일 (목)",
    event: "NVIDIA Q3 FY2027 실적 발표(예상)",
    tickers: ["NVDA"], importance: 5, note: "美 현지 11/25 장마감 후. Blackwell/Rubin 가이던스 핵심" },

  { dateKST: "2026-11-26", timeKST: "10:00", dateLabel: "11월 26일 (목)",
    event: "한국은행 금융통화위원회 (기준금리 결정, 2026년 마지막 회의)",
    tickers: ["EWY","KORU"], importance: 4, note: "2026년 정례회의 마지막 일정" },

  { dateKST: "2026-11-30", timeKST: null, dateLabel: "11월 30일 (월)",
    event: "NVIDIA GTC Washington, D.C. 2026 개막 (~12/3)",
    tickers: ["NVDA","AMD","AVGO"], importance: 3,
    note: "젠슨 황 기조연설 통상 첫날 진행(정확한 KST 시각은 근접 시 재확인 필요). 정치적 수도에서 열리는 만큼 AI 규제·국방/정부 AI 인프라 메시지 비중이 클 전망 — 경쟁사 AMD·AVGO 밸류체인에도 간접 영향" },

  { dateKST: "2026-12-09", timeKST: null, dateLabel: "12월 9일 (수)",
    event: "SpaceX(SPCX) 180일 락업 전체 만료",
    tickers: ["SPCX","QQQ"], importance: 4,
    note: "상장(6/12) 후 180일 — 성과연동 물량 포함 비내부자 잔여분 전량 해제(12/9~10 전후, 공식 공시로 재확인 필요). 머스크·내부자 366일 락업은 2027년 6월 13일 만료" },

  { dateKST: "2026-12-10", timeKST: "04:00", dateLabel: "12월 10일 (목)",
    event: "FOMC 금리결정 발표 (12/8~9 회의)",
    tickers: ["EWY","ETH","META","GOOGL","KORU","MSTR","MU","NVDA","SKHY","SPY","ONDO","SOL","SNDK","SOXL","QQQ","TSLA","TSM","AAPL","AMZN","AMD","CL","BTC","XAU","PLTR","AVGO","CRCL"],
    importance: 5, note: "2026년 마지막 FOMC (EST 전환으로 발표시각 04:00 KST). 9월 의사록상 '연내 1회 추가 인상'이 10월에 나오지 않으면 이 회의가 유력 시점" },

  { dateKST: "2026-12-11", timeKST: "06:00", dateLabel: "12월 11일 (금)",
    event: "Broadcom(AVGO) 4분기 실적 발표(예상)",
    tickers: ["AVGO"], importance: 5, note: "美 현지 12/10 장마감 후 예상 — 회사 공지 전. 가이던스 매출 $348억·AI $217억, Anthropic 자금 지원($420억 대출·$600억 조달) 구조 설명 주목" },

  { dateKST: "2026-10-21", timeKST: "05:05", dateLabel: "10월 21일 (수)",
    event: "SpaceX(SPCX) 3분기 실적 발표 (결과 확정)",
    tickers: ["SPCX","TSLA","QQQ"], importance: 5,
    note: "결과(美 현지 10/20 장마감 후): 매출 $145.8억(+161%, 예상 약 $128.7억)·희석 EPS $0.35(예상 약 $0.13)·순이익 $44.0억(흑자전환)·조정 EBITDA $88.1억. capex $195.9억(이 중 슈퍼인텔리전스 사업 $164.4억), 4분기 capex 가이던스 $350~400억. 시간외 최고 $161.56(+9.3%), 10/21 약 +10%·머스크의 테슬라 결합 시사(CNBC·TradingKey) — 같은 날(10/21) 테슬라 +3.4%. 기존 '11월 초 실적(미확정)' 항목 정정" },

  { dateKST: "2026-10-23", timeKST: "15:30", dateLabel: "10월 23일 (금)",
    event: "코스피 장중 -4%대 급락 후 반등 마감 · SK하이닉스 솔리다임 美 상장 검토 중단 (결과 확정)",
    tickers: ["SKHY","SAMSUNG","EWY","KORU"], importance: 3,
    note: "결과: 코스피 5,403 출발(-2.36%) → 장중 약 5,300 → 5,550.30(+0.30%) 마감, 코스닥 751.69(-1.62%), 주간 -2.08%(머니투데이). 외국인 약 7,200억(머니투데이)~9,941억(비즈니스코리아) 순매도 — 하이닉스 약 8,637억 매도·삼성 약 7,838억 매수. 하이닉스는 손자회사 솔리다임 나스닥 상장 검토 중단 발표로 희석 우려 해소, +4.42%(127.7만). 원/달러 1,324.6원. 그날 밤 SKHY ADR +4.05%·EWY +1.48%" },

  { dateKST: "2026-10-24", timeKST: "23:15", dateLabel: "10월 24일 (토)",
    event: "코인 롱 연쇄 청산 — BTC $80K 일시 이탈 (결과 확정)",
    tickers: ["BTC","ETH","SOL","MSTR"], importance: 3,
    note: "결과: BTC 약 $79,280(KST 10/25 00:20 무렵) 저점 후 $80K 회복, ETH $2,314(-3.8%). 4시간 청산 $4.36억(롱 $4.04억)·24시간 $8.15억(The Block). 아서 헤이즈 '가족 오피스 방향성 포지션 전부 정리' 발언. BTC 현물 ETF 10/22 -$6.36억(6월 이후 최대)·10/23 순유출 지속(24/7 Wall St.). 10/25 12:00 KST BTC $80,825·ETH $2,363(토큰포스트)" },

  { dateKST: "2026-10-27", timeKST: null, dateLabel: "10월 27일 (화)",
    event: "이스라엘 총선",
    tickers: ["CL","XAU","SPY","BTC"], importance: 3,
    note: "머니투데이 주간 일정 기준. 美·이스라엘의 對이란 군사작전 재개 여부(美 중간선거 11/3 이후 가능성 보도)와 맞물린 중동 리스크 변수 — 결과에 따라 유가 변동성 확대 가능" },

  { dateKST: "2026-10-27", timeKST: "21:30", dateLabel: "10월 27일 (화)",
    event: "미국 9월 내구재 수주(예비)",
    tickers: ["SPY","QQQ"], importance: 2,
    note: "08:30 ET(FinancialJuice). 이전: 8월 헤드라인 0.0%(Continuum은 -0.1%로 표기)·근원 자본재 주문 +1.6%. 예상: 헤드라인 +1.8%(heygotrade)~+3.5%(Continuum, 항공기 주문 반등), 운송 제외 +1.0%(Continuum)" },

  { dateKST: "2026-10-27", timeKST: "23:00", dateLabel: "10월 27일 (화)",
    event: "미국 10월 컨퍼런스보드 소비자신뢰지수",
    tickers: ["SPY","QQQ","AMZN"], importance: 3,
    note: "10:00 ET. 이전 81.9(9월, 8월 88.6에서 급락). 예상 80.5(heygotrade). 10/23 미시간대 심리 48.0(사상 최저권)과 함께 유가發 소비 위축 확인 지표" },

  { dateKST: "2026-10-29", timeKST: "05:05", dateLabel: "10월 29일 (목)",
    event: "KLA(KLAC) 실적 발표(확정)",
    tickers: ["SOXL","MU","SKHY","SAMSUNG","TSM"], importance: 3,
    note: "StockTitan: 美 현지 10/28(수) 장마감 후, 콜 17:00 ET(=KST 06:00). 램리서치가 가이던스 실망으로 -11.8%(10/22) 급락한 뒤라 장비 수요 확인 지점. MS·알파벳과 같은 날 새벽" },

  { dateKST: "2026-10-29", timeKST: "21:30", dateLabel: "10월 29일 (목)",
    event: "미국 3분기 GDP(속보치) · 9월 PCE 물가·개인소비",
    tickers: ["EWY","ETH","META","GOOGL","KORU","MSTR","MU","NVDA","SKHY","SPY","ONDO","SOL","SNDK","SOXL","QQQ","TSLA","TSM","AAPL","AMZN","AMD","CL","BTC","XAU","PLTR","AVGO","CRCL"],
    importance: 5,
    note: "08:30 ET 동시 발표(FinancialJuice·Yardeni). 이전: 2분기 GDP 2.2%(연율)·GDP 물가지수 6.1%, 8월 PCE 전월비 +0.3%·전년비 3.4%, 근원 +0.2%·3.0%, 소비 +0.9%. 클리블랜드 연은 나우캐스트 9월 근원 PCE 3.1%·헤드라인 3.6%(전년비). 컨센서스: 3분기 GDP 약 3%·9월 근원 PCE 전월비 +0.3%(heygotrade), 헤드라인 PCE 컨센서스는 미확인. FOMC 바로 다음 날이라 12월 인상 확률을 직접 움직일 지표. 같은 날 신규 실업수당 청구(이전 19.4만)" },

  { dateKST: "2026-10-29", timeKST: "22:15", dateLabel: "10월 29일 (목)",
    event: "ECB 통화정책회의 금리 결정 (22:45 라가르드 기자회견)",
    tickers: ["XAU","SPY","BTC"], importance: 3,
    note: "13:15 GMT(유럽 10/25 서머타임 종료 반영). 현재 리파이낸싱 2.40%·예금금리 2.25%, '동결 가능성 배제 못 해'(LiteFinance). 컨센서스 미확인" },

  { dateKST: "2026-10-30", timeKST: "05:05", dateLabel: "10월 30일 (금)",
    event: "Coinbase(COIN) 3분기 실적 발표(확정)",
    tickers: ["BTC","ETH","CRCL","MSTR","SOL"], importance: 3,
    note: "StockTitan: 美 현지 10/29(목) 장마감 후, 콜 17:00 ET(=KST 06:00). MSTR과 같은 시각 — OCC GENIUS법 스테이블코인 규칙·거래량 둔화 여부, 서클(CRCL) USDC 수익 배분 언급 주목" },

  { dateKST: "2026-10-30", timeKST: null, dateLabel: "10월 30일 (금)",
    event: "일본은행(BOJ) 금리 결정 · 우에다 총재 기자회견(15:30)",
    tickers: ["XAU","SPY","BTC","EWY"], importance: 3,
    note: "결정 발표 시각은 미정(통상 정오 전후), 기자회견 06:30 GMT(=KST 15:30). 현 정책금리 1.25%, 동결 전망(LiteFinance). 엔화·글로벌 금리 경로 변수. 전날 밤 23:30 GMT(=KST 10/30 08:30) 도쿄 CPI" },

  { dateKST: "2026-10-30", timeKST: "19:30", dateLabel: "10월 30일 (금)",
    event: "ExxonMobil·Chevron 3분기 실적 발표(확정)",
    tickers: ["CL","SPY"], importance: 2,
    note: "엑슨 06:30 ET(=KST 19:30) 발표·09:30 ET 콜, 셰브런 11:00 ET 콜(발표 시각 미공지, StockTitan). 브렌트 $116대 고유가 수혜 확인 — 에너지 업종 10/23 사상 최고" },

  { dateKST: "2026-10-31", timeKST: "10:30", dateLabel: "10월 31일 (토)",
    event: "중국 10월 공식 제조업·비제조업 PMI",
    tickers: ["EWY","KORU","CL","TSM","SAMSUNG"], importance: 2,
    note: "01:30 GMT(=KST 10:30). 이전 제조업 50.1·비제조업 50.2(LiteFinance 목록 기준). 토요일 발표라 한국장 반영은 11/2(월)" },

  { dateKST: "2026-11-01", timeKST: "15:00", dateLabel: "11월 1일 (일)",
    event: "미국 서머타임 종료 — 美 일정 KST 1시간 늦어짐",
    tickers: ["EWY","ETH","META","GOOGL","KORU","MSTR","MU","NVDA","SKHY","SPY","ONDO","SOL","SNDK","SOXL","QQQ","TSLA","TSM","AAPL","AMZN","AMD","CL","BTC","XAU","PLTR","AVGO","CRCL"],
    importance: 2,
    note: "11/1(일) 02:00 ET에 EST 전환. 이후 美 정규장 KST 23:30~06:00, 美 지표 08:30 ET = KST 22:30, 지수선물 재개 월 08:00 KST" },

  { dateKST: "2026-11-04", timeKST: null, dateLabel: "11월 4일 (수) — 美 현지 11/3",
    event: "미국 중간선거",
    tickers: ["EWY","ETH","META","GOOGL","KORU","MSTR","MU","NVDA","SKHY","SPY","ONDO","SOL","SNDK","SOXL","QQQ","TSLA","TSM","AAPL","AMZN","AMD","CL","BTC","XAU","PLTR","AVGO","CRCL"],
    importance: 4,
    note: "美 현지 11/3(화) 투표, 개표 결과는 KST 11/4 오전부터 윤곽. 트럼프 '이란 종전 합의는 중간선거 이후' 입장, 美·이스라엘의 선거 후 對이란 타격 재개 가능성 보도(Capp Notes 10/23) — 선거 전후 유가·지정학 변동성 주의" },

  { dateKST: "2026-12-31", timeKST: null, dateLabel: "2026년 4분기 중 (미정)",
    event: "이더리움 Glamsterdam 메인넷 활성화 (목표)",
    tickers: ["ETH"], importance: 4,
    note: "정렬용 임시 날짜 — 공식 날짜 미확정(코어 개발자 콜에서 결정). 실행계층 Amsterdam + 합의계층 Gloas. ePBS·BAL(병렬 실행)·가스 한도 확대 기반. 상반기 → 4분기로 연기된 이력" },

  { dateKST: "2026-10-26", timeKST: "15:30", dateLabel: "10월 26일 (월)",
    event: "코스피 5,500 붕괴 — 4/6 이후 최저 마감 (결과 확정)",
    tickers: ["SKHY","SAMSUNG","EWY","KORU"], importance: 3,
    note: "결과: 코스피 5,469.47(-1.46%, -80.83p)·코스닥 727.21(-3.26%, 3일 연속 하락). 외국인 코스피 약 6,964억(인포스탁데일리)~7,545억(아시아경제) 순매도(이틀째), 기관 약 6,000억 순매수. 삼성전자 21.3만(-1.16%)·SK하이닉스 127.5만(-0.16%)·현대차 28.8만(-2.54%)·KB금융 -3.79%, 코스피 전 업종 하락. 원/달러 1,323.1원(15:30). 원인: FOMC·빅테크·하이닉스·삼성 실적 앞 경계, 머스크의 'AI 네오클라우드 구조조정' 발언, 골드만삭스 코스피 12개월 목표 하향 보도(12,000→9,000, 인포스탁데일리), 중동 리스크. 10/23 밤 SKHY ADR +4%·EWY +1.5%를 반영하지 못함" },

  { dateKST: "2026-10-27", timeKST: null, dateLabel: "10월 27일 (화, 대만)",
    event: "Micron 타오위안 노조 노사 협상 (타오위안 시정부)",
    tickers: ["MU","SKHY","SAMSUNG"], importance: 3,
    note: "태풍(Champi)으로 10/23에서 연기된 협상. 조합원 약 70%가 회사의 최신 성과급안 반대, 노조는 영업이익 15%를 분기 보너스로 요구. 파업권은 10/7 확보(2,012표 중 1,994표 찬성), 10/22~23 24시간 경고 행동 외 파업 날짜는 미정(FinanceFeeds). 시각 미확인. 타이중 노조는 10/21 이미 합의" },

  { dateKST: "2026-10-28", timeKST: "05:05", dateLabel: "10월 28일 (수)",
    event: "Seagate(STX) 실적 발표",
    tickers: ["SNDK","MU","SKHY"], importance: 2,
    note: "美 현지 10/27(화) 장마감 후(FinanceFeeds). HDD·데이터센터 스토리지 수요 확인 — WDC 호실적 후 주가 반락 패턴 재현 여부, 10/30 샌디스크 실적 전 선행 지표. 같은 날 오전 SK하이닉스 실적. 컨센서스·정확한 시각 미확인" },

  { dateKST: "2026-10-26", timeKST: "07:00", dateLabel: "10월 26일 (월)",
    event: "주말 이후 美 선물·원유 거래 재개 (결과 확정)",
    tickers: ["CL","SPY","QQQ","BTC"], importance: 2,
    note: "결과: 美 지수선물 강보합 출발(S&P500 선물 +0.13%·나스닥100 +0.1%·다우 +0.12%, Investing.com). 반면 머스크의 '네오클라우드는 구피 수준의 소멸·통합' 발언에 코어위브·IREN·네비우스 시간외 약 -3%(Stocktwits). 브렌트 12월물 $114.60(-$2.15, 10:50 베이징 기준)·WTI $101.10(-2.1%) — 차익실현, 후티의 '얀부·라비그 타격' 주장은 사우디 미확인, 카타르 중재단 테헤란 방문(FinanceFeeds). 1월물·CFD 기준 브렌트는 약 $109.5(-2%, TradingKey)" },
];

/**
 * 일간 일정 (index.html 오른쪽 【 주요 일정 】 패널 전용)
 * 표시 구간: KST 07:00 ~ 익일 07:00 — 그날 밤 미국장 일정까지 한 화면에.
 * 필드: dateKST(YYYY-MM-DD), timeKST(HH:MM, KST), country(국가/기관),
 *       event(제목), importance(0~5, 별 개수 — 0이면 별 없음),
 *       forecast(예상)·previous(이전)·actual(결과) — 있으면 아랫줄에 표시,
 *       detail(자유 문구, 선택)
 * 위 SEPTEMBER_2026_SCHEDULE 일정도 같은 구간이면 패널에 자동으로 함께 나옵니다.
 */
const DAILY_SCHEDULE = [
  // 10월 26일 (월) 07:00 ~ 27일 (화) 07:00
  { dateKST: "2026-10-26", timeKST: "07:00", country: "미국",
    event: "美 지수선물·원유선물 거래 재개 (CME, 주말 갭)", importance: 3,
    actual: "S&P 선물 +0.13%", detail: "(나스닥100 +0.1% · 브렌트 12월물 $114.60(-1.8%) · WTI $101.10(-2.1%) · 코어위브 등 네오클라우드 시간외 약 -3%)" },

  { dateKST: "2026-10-26", timeKST: "09:00", country: "한국",
    event: "코스피·코스닥 개장", importance: 3,
    previous: "5,550.30", detail: "(10/23 밤 SKHY ADR +4.05% · EWY +1.48%)" },

  { dateKST: "2026-10-26", timeKST: "15:30", country: "한국",
    event: "코스피·코스닥 마감 — 5,500 붕괴", importance: 3,
    previous: "5,550.30", actual: "5,469.47 (-1.46%)",
    detail: "(코스닥 727.21 -3.26% · 외국인 약 -7,000억 · 삼성 -1.16% · 하이닉스 -0.16% · 원/달러 1,323.1원)" },

  { dateKST: "2026-10-26", timeKST: "22:30", country: "미국",
    event: "美 정규장 개장 — 실적·FOMC 슈퍼위크 첫날", importance: 2,
    detail: "(美 주요 지표 없음 · 장전 버라이즌 실적 · 10/23 S&P 7,623.68 · 나스닥 25,955.34 · SpaceX 락업분·네오클라우드 반응 주목)" },

  { dateKST: "2026-10-27", timeKST: "05:00", country: "미국",
    event: "美 정규장 마감", importance: 1,
    detail: "(다음: 10/27 대만 마이크론 노조 협상 · 21:30 내구재(예상 +1.8%) · 23:00 소비자신뢰(예상 80.5) · 10/28 09:00 전 SK하이닉스 실적)" }
];

function sortedByDate(list) {
  return [...list].sort((a, b) => {
    const ta = new Date(a.dateKST + 'T' + (a.timeKST || '00:00') + ':00+09:00').getTime();
    const tb = new Date(b.dateKST + 'T' + (b.timeKST || '00:00') + ':00+09:00').getTime();
    return ta - tb;
  });
}

function starsFor(importance) {
  const n = Math.max(0, Math.min(5, importance || 0));
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

const SeptSchedule = { SEPTEMBER_2026_SCHEDULE, DAILY_SCHEDULE, sortedByDate, starsFor };

if (typeof module !== "undefined" && module.exports) {
  module.exports = SeptSchedule;
}
if (typeof window !== "undefined") {
  window.SeptSchedule = SeptSchedule;
}

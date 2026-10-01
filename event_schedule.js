/**
 * event_schedule.js
 * 프로젝트: 주식 분석 전문가 — 전 종목 통합 주요 일정 캘린더
 * index.html(Watchlist)이 기대하는 형식: window.SeptSchedule
 *   - SEPTEMBER_2026_SCHEDULE: 이벤트 배열
 *   - sortedByDate(list): 날짜/시각순 정렬
 *   - starsFor(importance): 중요도(1~5)를 별표 문자열로 변환
 * 각 이벤트 필드: dateKST(YYYY-MM-DD), timeKST(HH:MM, KST), dateLabel(표시용 한글 날짜),
 *                event(제목), tickers(관련 종목 배열), importance(1~5), note(선택, 부연설명)
 * 모든 일시는 한국시간(KST, UTC+9) 기준입니다.
 * 마지막 자동 업데이트: 2026-10-01 (KST)
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
    event: "Meta Connect 2026 메인 키노트 (Zuckerberg)",
    tickers: ["META"], importance: 5,
    note: "美 현지 9/23(수) 오후 4시 PT 진행(컨퍼런스는 9/23~24 이틀 일정, 개발자 세션은 9/24 오전 10시 PT). 'AI 기술 → AI 글래스 → VR' 순으로 발표 예상. 카메라 없는 신형 스마트글래스 'Luna', 초경량 테더드 헤드셋 'Project Phoenix'(2027년초 목표) 프리뷰 유력, 퀘스트4는 2027년 하반기로 이번엔 미공개 전망" },

  { dateKST: "2026-09-24", timeKST: "09:00", dateLabel: "9월 24일 (목)",
    event: "테슬라 세미(Semi) 신공장 준공 이벤트 'Semi Rollout' (네바다 Sparks)",
    tickers: ["TSLA"], importance: 3,
    note: "초청 전용 행사(결과 확정: 개최 확정) — 연산 5만대 규모 전용 공장 준공 기념, 물류·플릿 고객 및 임직원 대상, 공장 투어·시승 프로그램 진행. 일반 공개 여부·정확한 현지 시각은 근접 시 재확인 필요" },

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
    event: "미국 9월 ISM 제조업 PMI (가격지수 포함)",
    tickers: ["SPY","QQQ","XAU","CL"], importance: 3,
    note: "WTI $90대 유가가 지불가격지수에 반영되는지 핵심. 같은 날 21:30 신규 실업수당 청구건수. 10년물 5.3% 부근이라 가격지수 서프라이즈 시 금리 추가 상승 압력" },

  { dateKST: "2026-10-02", timeKST: "03:18", dateLabel: "10월 2일 (금)",
    event: "SpaceX Falcon 9 Transporter-18 발사 — 구글 Project Suncatcher 첫 TPU 위성 탑재",
    tickers: ["SPCX","GOOGL"], importance: 3,
    note: "美 현지 10/1 11:18 PT(18:18 UTC) 반덴버그 발사, 발사창 58분 — 총 130개 탑재체. 구글 TPU 4기 탑재 'MVP' 위성(Planet 제작)으로 궤도 AI 컴퓨트 첫 실증. SpaceX 자체 궤도 데이터센터(Gigasat, 2027년 말 1GW 목표) 테마와 연결" },

  { dateKST: "2026-10-02", timeKST: null, dateLabel: "10월 2일 (금, 美 현지 기준)",
    event: "테슬라 3분기 인도량 발표",
    tickers: ["TSLA"], importance: 4,
    note: "회사 IR 컨센서스(24명) 46.2만대 — 전년 동기(사상 최대 49.7만대, 세액공제 종료 전 선수요) 대비 -7.1%. 추정 범위 42.2만~48.2만대로 편차 큼. 에너지저장 컨센서스 15.9GWh(사상 최대, +27%). 2분기엔 컨센서스를 18% 상회한 전례. 발표 시각은 통상 美 장 개장 전(KST 밤)" },

  { dateKST: "2026-10-02", timeKST: "21:30", dateLabel: "10월 2일 (금)",
    event: "미국 9월 고용보고서 (비농업 고용·실업률)",
    tickers: ["SPY","QQQ","EWY","KORU","BTC","ETH","XAU"], importance: 5,
    note: "컨센서스: 비농업 고용 약 9만명, 실업률 4.1%. PCE 하회로 10월 인상 확률이 35%대로 낮아진 상태 — 고용·임금 강세 시 인상 기대 재점화 및 10년물 5.3% 돌파 위험, 약세 시 금리 하락·금리민감주 반등. (기존 '9월 CPI' 표기는 오류 — CPI는 10/14 발표)" },

  { dateKST: "2026-10-09", timeKST: "22:30", dateLabel: "10월 9일 (금)",
    event: "SpaceX(SPCX) 락업 해제 — 약 3.28억주",
    tickers: ["SPCX","QQQ"], importance: 3,
    note: "스태거드 락업 스케줄상 10월 1차 해제(美 개장 시점 반영). 직전 9/9·9/24 해제 모두 해제일 또는 전일 약 -4% 하락 패턴 — 전일(10/8) 선제 매도 여부 주목" },

  { dateKST: "2026-10-14", timeKST: "21:30", dateLabel: "10월 14일 (수)",
    event: "미국 9월 소비자물가지수(CPI)",
    tickers: ["SPY","QQQ","EWY","KORU","BTC","ETH","XAU"], importance: 5,
    note: "BLS 일정 기준 10/14 08:30 ET. 10월 FOMC(10/29 KST) 직전 마지막 핵심 물가지표 — 8월 CPI는 전월비 +0.3%로 예상 상회했으나 8월 PCE는 하회, 방향성 확인 필요" },

  { dateKST: "2026-10-15", timeKST: "09:00", dateLabel: "10월 15일 (목)",
    event: "TSMC 3분기 실적 발표(잠정확정)",
    tickers: ["TSM"], importance: 5, note: "실적 캘린더 기준 잠정 확정, TSMC 자체 IR 캘린더엔 아직 미게시 — 근접 시 재확인 필요" },

  { dateKST: "2026-10-16", timeKST: null, dateLabel: "10월 16일 (금, KST 오전 예상)",
    event: "테슬라 신형 로드스터 공개 이벤트 (텍사스 맥그레거, 10/1에서 연기)",
    tickers: ["TSLA"], importance: 4,
    note: "당초 10/1 예정이었으나 9/28 테슬라가 웨이코 지역 악천후를 이유로 美 현지 10/15(목)로 연기 — 올해만 다섯 번째 날짜 변경. 장소는 SpaceX 맥그레거 로켓 시험장, 예약자 초청 전용·야외 행사. 현지 시각 미발표(기존 17:30 PT 기준이면 KST 10/16 09:30). SpaceX 협업 냉가스 추진기 버전 공개 가능성, 양산은 공개 후 12~18개월 전망" },

  { dateKST: "2026-10-16", timeKST: null, dateLabel: "10월 16일 (금)",
    event: "OpenAI DevDay Exchange — 벵갈루루",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업 1차 도시. 구체적 현지 시각·세부 발표 미정, 시장 영향은 미미할 전망" },

  { dateKST: "2026-10-20", timeKST: null, dateLabel: "10월 20일 (화)",
    event: "OpenAI DevDay Exchange — 도쿄",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업. 구체적 현지 시각·세부 발표 미정, 시장 영향은 미미할 전망" },

  { dateKST: "2026-10-22", timeKST: "09:00", dateLabel: "10월 22일 (목)",
    event: "한국은행 금융통화위원회 (기준금리 결정)",
    tickers: ["EWY","KORU"], importance: 4, note: "2026년 정례회의 일정(1/15·2/26·4/10·5/28·7/16·8/27·10/22·11/26) 중 하나로 날짜 확정. 현 기준금리 2.50%" },

  { dateKST: "2026-10-22", timeKST: null, dateLabel: "10월 22일 (목)",
    event: "OpenAI DevDay Exchange — 서울",
    tickers: ["NVDA","AMD","GOOGL","META","EWY","KORU"], importance: 2,
    note: "글로벌 순회 개발자 밋업, 국내 개최. 구체적 현지 시각·장소 미정 — 근접 시 재확인 필요. 같은 날 한국은행 금통위(10/22)와 일정 겹침 주의" },

  { dateKST: "2026-10-23", timeKST: "05:00", dateLabel: "10월 23일 (금)",
    event: "Amazon(AMZN) 3분기 실적 발표(확정)",
    tickers: ["AMZN"], importance: 5, note: "美 현지 10/22 장마감 후 — 실적 캘린더 기준 날짜 확정" },

  { dateKST: "2026-10-24", timeKST: null, dateLabel: "10월 24일 (토)",
    event: "SpaceX(SPCX) 락업 해제 — 약 3.28억주",
    tickers: ["SPCX","QQQ"], importance: 2,
    note: "10월 2차 해제(10/9와 합계 약 6.56억주). 美 주말이라 실질 반영은 10/26(월) 美 개장(10/26 22:30 KST)" },

  { dateKST: "2026-10-26", timeKST: null, dateLabel: "10월 26일 (월)",
    event: "OpenAI DevDay Exchange — 베를린",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업. 구체적 현지 시각·세부 발표 미정, 시장 영향은 미미할 전망" },

  { dateKST: "2026-10-27", timeKST: "16:00", dateLabel: "10월 27일 (화)",
    event: "SK하이닉스 3분기 실적 발표(잠정)",
    tickers: ["SKHY"], importance: 4, note: "국내 공시 기준 발표시각은 근접 시 재확인 필요" },

  { dateKST: "2026-10-28", timeKST: null, dateLabel: "10월 28일 (수)",
    event: "OpenAI DevDay Exchange — 파리",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업. 같은 날 Alphabet 3분기 실적 발표와 겹침. 구체적 현지 시각·세부 발표 미정" },

  { dateKST: "2026-10-28", timeKST: "05:00", dateLabel: "10월 28일 (수)",
    event: "Alphabet(GOOGL) 3분기 실적 발표(확정)",
    tickers: ["GOOGL"], importance: 5, note: "美 현지 10/27 장마감 후. Cloud 성장·CapEx 가이던스 핵심" },

  { dateKST: "2026-10-29", timeKST: "03:00", dateLabel: "10월 29일 (목)",
    event: "FOMC 금리결정 발표 (10/27~28 회의)",
    tickers: ["EWY","ETH","META","GOOGL","KORU","MSTR","MU","NVDA","SKHY","SPY","ONDO","SOL","SNDK","SOXL","QQQ","TSLA","TSM","AAPL","AMZN","AMD","CL","BTC","XAU","PLTR","AVGO","CRCL"],
    importance: 5, note: "9/16 FOMC에서 25bp 인상(3.75→4.00%) 이후 두 번째 결정 — 9/16 SEP상 정책위원 다수가 추가 인상 시사, 10월 인상 확률은 9월 말 약 71%까지 올랐다가 9/30 PCE 하회 + 윌리엄스 총재 '서두를 필요 없다' 발언 후 약 35%로 급락, 시장은 12월 인상으로 기대 이동(10/1 기준). 10/2 고용·10/14 CPI가 변수" },

  { dateKST: "2026-10-29", timeKST: "05:00", dateLabel: "10월 29일 (목)",
    event: "Meta(META) 3분기 실적 발표(확정)",
    tickers: ["META"], importance: 5, note: "美 현지 10/28 장마감 후" },

  { dateKST: "2026-10-29", timeKST: "06:00", dateLabel: "10월 29일 (목)",
    event: "테슬라 3분기 실적 발표(확정)",
    tickers: ["TSLA"], importance: 5, note: "美 현지 10/28 장마감 후. 마진·인도량·가이던스 핵심" },

  { dateKST: "2026-10-30", timeKST: "05:00", dateLabel: "10월 30일 (금)",
    event: "Apple(AAPL) 4분기 실적 발표(확정)",
    tickers: ["AAPL"], importance: 5, note: "美 현지 10/29 장마감 후" },

  { dateKST: "2026-11-01", timeKST: null, dateLabel: "11월 초 (미정)",
    event: "SpaceX(SPCX) 3분기 실적 발표(미확정) + 최대 약 13억주 락업 해제",
    tickers: ["SPCX","QQQ","TSLA"], importance: 5,
    note: "정확한 날짜 미발표(근접 시 재확인 필요 — 정렬용 임시 날짜). 신규 클라우드 계약 $141억 매출 반영 첫 분기, 2026년 말 ARR $1,000억 목표 진척 확인. 실적 발표 2거래일 후 스태거드 락업 최대 물량(약 13억주) 해제가 함께 트리거되는 핵심 이벤트" },

  { dateKST: "2026-11-03", timeKST: null, dateLabel: "11월 3일 (화)",
    event: "OpenAI DevDay Exchange — 런던",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업. 구체적 현지 시각·세부 발표 미정, 시장 영향은 미미할 전망" },

  { dateKST: "2026-11-04", timeKST: "06:00", dateLabel: "11월 4일 (수)",
    event: "AMD 3분기 실적 발표(확정)",
    tickers: ["AMD"], importance: 5, note: "美 현지 11/3 장마감 후" },

  { dateKST: "2026-11-05", timeKST: "06:00", dateLabel: "11월 5일 (목)",
    event: "MicroStrategy(MSTR) 3분기 실적 발표(확정)",
    tickers: ["MSTR"], importance: 4, note: "美 현지 11/4 장마감 후" },

  { dateKST: "2026-11-06", timeKST: null, dateLabel: "11월 6일 (금)",
    event: "OpenAI DevDay Exchange — 상파울루",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업 마지막 순번 이전 도시. 같은 날 SanDisk 실적 발표와 겹침. 구체적 현지 시각·세부 발표 미정" },

  { dateKST: "2026-11-06", timeKST: "06:00", dateLabel: "11월 6일 (금)",
    event: "SanDisk(SNDK) 다음 분기 실적 발표(확정)",
    tickers: ["SNDK"], importance: 4, note: "美 현지 11/5 장마감 후" },

  { dateKST: "2026-11-10", timeKST: null, dateLabel: "11월 10일 (화)",
    event: "OpenAI DevDay Exchange — 멕시코시티",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업 마지막 도시. 같은 날 Palantir 실적 발표·애플 배당락일과 겹침. 구체적 현지 시각·세부 발표 미정" },

  { dateKST: "2026-11-10", timeKST: "06:00", dateLabel: "11월 10일 (화)",
    event: "Palantir(PLTR) 3분기 실적 발표(확정)",
    tickers: ["PLTR"], importance: 5, note: "美 현지 11/9 장마감 후" },

  { dateKST: "2026-11-10", timeKST: "09:00", dateLabel: "11월 10일 (화)",
    event: "Apple(AAPL) 배당락일",
    tickers: ["AAPL"], importance: 1, note: null },

  { dateKST: "2026-11-18", timeKST: "21:00", dateLabel: "11월 18일 (수)",
    event: "Circle(CRCL) 3분기 실적 발표(확정)",
    tickers: ["CRCL"], importance: 4, note: "美 현지 11/18 장 개장 전 발표" },

  { dateKST: "2026-11-26", timeKST: "06:00", dateLabel: "11월 26일 (목)",
    event: "NVIDIA Q3 FY2027 실적 발표(확정)",
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
    importance: 5, note: "2026년 마지막 FOMC (EST 전환으로 발표시각 04:00 KST)" },

  { dateKST: "2026-12-11", timeKST: "06:00", dateLabel: "12월 11일 (금)",
    event: "Broadcom(AVGO) 4분기 실적 발표(확정)",
    tickers: ["AVGO"], importance: 5, note: "美 현지 12/10 장마감 후" }
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

const SeptSchedule = { SEPTEMBER_2026_SCHEDULE, sortedByDate, starsFor };

if (typeof module !== "undefined" && module.exports) {
  module.exports = SeptSchedule;
}
if (typeof window !== "undefined") {
  window.SeptSchedule = SeptSchedule;
}
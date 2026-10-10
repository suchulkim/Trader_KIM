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
 * 마지막 업데이트: 2026-10-10 (KST) — 美 10/9 마감·미시간대 심리 결과, LG전자 3Q 잠정·네이버-두나무 합병 연기·OPEC+ 11월 동결·허리케인 셧인·BitMine 매수중단 예고 반영, CRCL 실적일 11/4 확정 정정, 美 중간선거·OPEC+ 11/1·BTC 난이도 조정·삼성월렛 USDC 등 추가
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
    note: "결과: 영업이익 107.4조원(전년비 +782.5%, 컨센서스 약 105.4조원 대비 +1% 상회) — 국내 기업 최초 분기 100조 돌파. 매출은 컨센서스(약 200조원) 대비 약 3% 하회 — 원·달러 환율이 1,500원대에서 1,300원대로 급락한 영향. 3분기 누적 영업이익 254.1조원. 프리마켓 +1.7%(27.3만원) 강세 출발. 부문별 상세·3분기 특별배당은 10/29 확정 실적 때 발표. 장 결과: 26.95만원 시가 후 셀온으로 26.2만원(-2.42%) 마감 — 美 10년물 5.36%·반도체 ETF 리밸런싱·옵션만기·15조 자사주 매입 종료 겹침, 외국인 약 2,907억 순매도. 코스피 -2.62%(6,625.93) 3일 연속 하락" },

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
    note: "결과: 46.3(예상 47.6, 전월 48.1) — 역대 최저권 추가 하락. 1년 기대인플레 4.6→4.7%, 5년 3.4→3.5%로 상승. 소비 위축으로 10월 FOMC 동결 기대(~81%) 재확인, 금은 $4,200 부근까지 반등(+1.4%)" },

  { dateKST: "2026-10-10", timeKST: null, dateLabel: "10월 9~10일 (KST, 美 현지 10/8~9)",
    event: "Micron 이사회 — 대만 노조 보상안 대응 주목",
    tickers: ["MU","SKHY","SNDK"], importance: 4,
    note: "타오위안 노조가 이사회에 영업이익 15% 배분 등 구체안 제시를 요구. 새 보상안이 나오면 파업 리스크 완화(MU 호재), 없으면 파업 날짜 확정 가능성(MU 약세·SK하이닉스 반사이익). 대만은 10/10 국경일 휴장" },

  { dateKST: "2026-10-12", timeKST: "09:00", dateLabel: "10월 12일 (월)",
    event: "🇰🇷 한국장 3일 휴장 후 개장 — 美 10/8~9 재료 일괄 반영",
    tickers: ["EWY","KORU","SKHY","SAMSUNG"], importance: 4,
    note: "10/8 美 반도체지수 -3%대·SNDK -6%·MU -3.5% 급락, 호르무즈 사태, SPCX 해제, 미시간 심리까지 한 번에 반영. 삼성 잠정실적(107.4조) 호재와 美 반도체 급락 악재가 맞부딪히는 첫 거래일 — 갭 하락 출발 후 저가 매수 유입 여부 주목" },

  { dateKST: "2026-10-13", timeKST: null, dateLabel: "10월 13일 (화, 美 현지 기준)",
    event: "Apple 스마트홈 신제품 공개 (홈 허브·HomePod mini 2·Apple TV) (예상)",
    tickers: ["AAPL"], importance: 4,
    note: "블룸버그 거먼 보도(9/30), 회사 공식 초대장 전. 온라인 이벤트 형식 예상 — KST 시각 미정. 터너스 CEO 체제 첫 신규 카테고리, 새 Siri AI 시연 수준이 'AI 경쟁 뒤처짐' 우려를 덜지가 관건" },

  { dateKST: "2026-10-16", timeKST: null, dateLabel: "10월 16일 (금)",
    event: "폴더블 iPhone 18 Duo 사전주문 개시 ($1,999)",
    tickers: ["AAPL"], importance: 4,
    note: "출시는 10월 말. 2026년 약 600만대 예상 — 초기 매진·배송 지연 여부가 수요 신호" },

  { dateKST: "2026-10-13", timeKST: null, dateLabel: "10월 13일 (화, 美 현지 기준)",
    event: "Ray-Ban Meta Audio(카메라 없는 오디오 글래스) 출시",
    tickers: ["META"], importance: 2, note: "Meta Connect(9/24) 발표 제품, $349. 프라이버시 우려를 낮춘 라인업 — 판매 반응은 4분기 Reality Labs 매출 변수" },

  { dateKST: "2026-10-14", timeKST: "21:30", dateLabel: "10월 14일 (수)",
    event: "미국 9월 소비자물가지수(CPI)",
    tickers: ["SPY","QQQ","EWY","KORU","BTC","ETH","XAU"], importance: 5,
    note: "BLS 일정 기준 10/14 08:30 ET. 10월 FOMC(10/29 KST) 직전 마지막 핵심 물가지표 — 9월 의사록은 '연내 1회 추가 인상, 시점은 데이터 의존'. 8월 CPI는 전월비 +0.3%로 예상 상회, 8월 PCE는 하회. 호르무즈 사태發 유가 반등이 헤드라인 물가에 얼마나 반영될지 주목. 컨센서스 헤드라인 전년비 3.7%(8월 3.4%), 근원 2.4% — 클리블랜드 연은 나우캐스트 전월비 +0.53%" },

  { dateKST: "2026-10-15", timeKST: "15:00", dateLabel: "10월 15일 (목)",
    event: "TSMC 3분기 실적 발표(잠정확정)",
    tickers: ["TSM","SOXL","NVDA","AMD"], importance: 5, note: "실적 캘린더 기준 10/15(목) 잠정 확정. TSMC 실적 컨퍼런스는 통상 대만 14:00(KST 15:00) — 공식 IR 공지 근접 시 재확인 필요. 3분기 매출(NT$1.49조, 사상 최대)은 이미 확인 — 관건은 마진·4분기 가이던스(시장 기대 약 NT$1.66조)·CoWoS 증설·2027년 가격 인상" },

  { dateKST: "2026-10-16", timeKST: null, dateLabel: "10월 16일 (금, KST 오전 예상)",
    event: "테슬라 신형 로드스터 공개 이벤트 (텍사스 맥그레거, 10/1에서 연기)",
    tickers: ["TSLA"], importance: 4,
    note: "당초 10/1 예정이었으나 9/28 테슬라가 웨이코 지역 악천후를 이유로 美 현지 10/15(목)로 연기 — 올해만 다섯 번째 날짜 변경. 장소는 SpaceX 맥그레거 로켓 시험장, 예약자 초청 전용·야외 행사. 현지 시각 미발표(기존 17:30 PT 기준이면 KST 10/16 09:30). SpaceX 협업 냉가스 추진기 버전 공개 가능성, 양산은 공개 후 12~18개월 전망" },

  { dateKST: "2026-10-16", timeKST: null, dateLabel: "10월 16일 (금)",
    event: "OpenAI DevDay Exchange — 벵갈루루",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업 1차 도시. 구체적 현지 시각·세부 발표 미정, 시장 영향은 미미할 전망" },

  { dateKST: "2026-10-17", timeKST: "05:00", dateLabel: "10월 17일 (토)",
    event: "10월 월간 옵션만기 (美 현지 10/16 금 정규장 마감)",
    tickers: ["SPY","QQQ","TSLA","PLTR","GOOGL","META","NVDA","AAPL","AMZN","MSFT"], importance: 3,
    note: "빅테크 실적 시즌 직전 만기 — 테슬라 로드스터(10/15)·실적(10/22) 사이 변동성 확대 구간" },

  { dateKST: "2026-10-19", timeKST: null, dateLabel: "10월 19일 (월, 대만)",
    event: "Micron 타오위안 노조 타이베이 집회 (파업 아님)",
    tickers: ["MU"], importance: 2,
    note: "노조가 단체 휴가 형태 참여를 독려하는 집회 — 참여 규모가 실제 파업 동력의 가늠자" },

  { dateKST: "2026-10-20", timeKST: null, dateLabel: "10월 20일 (화)",
    event: "OpenAI DevDay Exchange — 도쿄",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업. 구체적 현지 시각·세부 발표 미정, 시장 영향은 미미할 전망" },

  { dateKST: "2026-10-22", timeKST: "05:05", dateLabel: "10월 22일 (목)",
    event: "테슬라 3분기 실적 발표(확정)",
    tickers: ["TSLA"], importance: 5,
    note: "美 현지 10/21(수) 장마감 후 — 회사 공식 공지(3분기 인도량 발표문)로 확정. Q&A 웹캐스트 16:30 CT(=KST 06:30). 인도 서프라이즈(48.65만) 이후 자동차 마진·가격 정책·에너지·Robotaxi/옵티머스가 핵심. 기존 '10/29 확정' 표기 정정" },

  { dateKST: "2026-10-22", timeKST: "09:00", dateLabel: "10월 22일 (목)",
    event: "한국은행 금융통화위원회 (기준금리 결정)",
    tickers: ["EWY","KORU"], importance: 4, note: "2026년 정례회의 일정(1/15·2/26·4/10·5/28·7/16·8/27·10/22·11/26) 중 하나로 날짜 확정. 현 기준금리 2.50%" },

  { dateKST: "2026-10-22", timeKST: null, dateLabel: "10월 22일 (목)",
    event: "OpenAI DevDay Exchange — 서울",
    tickers: ["NVDA","AMD","GOOGL","META","EWY","KORU"], importance: 2,
    note: "글로벌 순회 개발자 밋업, 국내 개최. 구체적 현지 시각·장소 미정 — 근접 시 재확인 필요. 같은 날 한국은행 금통위(10/22)와 일정 겹침 주의" },

  { dateKST: "2026-10-30", timeKST: null, dateLabel: "10월 30일 (금, 새벽)",
    event: "SanDisk(SNDK) Q1 FY2027 실적 발표(확정)",
    tickers: ["SNDK","MU","SKHY"], importance: 5,
    note: "회사 공지(9/29): 美 현지 10/29 장마감 후 발표·웹캐스트(정확한 KST 시각은 근접 시 재확인). 가이던스 매출 $103~108억·EPS $44~46·매출총이익률 83~85% — 소비자용 부진 vs 데이터센터 SSD 성장, NAND 가격 둔화 여부가 관건" },

  { dateKST: "2026-10-30", timeKST: "05:00", dateLabel: "10월 30일 (금)",
    event: "Amazon(AMZN) 3분기 실적 발표(예상)",
    tickers: ["AMZN"], importance: 5, note: "美 현지 10/29(목) 장마감 후 예상(콜 17:00 ET = KST 06:00) — 회사 공식 공지 전. 기존 '10/23 확정' 표기는 근거 없어 정정(MarketBeat 등 과거 패턴 기준 추정)" },

  { dateKST: "2026-10-30", timeKST: "17:00", dateLabel: "10월 30일 (금)",
    event: "Deribit 비트코인·이더리움 10월 월간 옵션 만기(추정)",
    tickers: ["BTC","ETH"], importance: 3,
    note: "매월 마지막 금요일 08:00 UTC. FOMC(10/29)·빅테크 실적 직후라 만기 전후 BTC/ETH 변동성 확대 가능" },

  { dateKST: "2026-10-24", timeKST: null, dateLabel: "10월 24일 (토)",
    event: "SpaceX(SPCX) 락업 해제 — 약 3.28억주",
    tickers: ["SPCX","QQQ"], importance: 2,
    note: "10월 2차 해제(10/9와 합계 약 6.56억주). 美 주말이라 실질 반영은 10/26(월) 美 개장(10/26 22:30 KST)" },

  { dateKST: "2026-10-26", timeKST: null, dateLabel: "10월 26일 (월)",
    event: "OpenAI DevDay Exchange — 베를린",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업. 구체적 현지 시각·세부 발표 미정, 시장 영향은 미미할 전망" },

  { dateKST: "2026-10-22", timeKST: null, dateLabel: "10월 22일 (목, 대만)",
    event: "Micron 대만 타이중 노조 노사 중재",
    tickers: ["MU"], importance: 3,
    note: "타오위안 노조 파업권 확보(10/7)에 이은 두 번째 노사 협상 분수령 — 결렬 시 타이중 노조(조합원 약 1.1만) 파업 투표 진행 가능" },

  { dateKST: "2026-10-27", timeKST: "16:00", dateLabel: "10월 27일 (화)",
    event: "SK하이닉스 3분기 실적 발표(예상)",
    tickers: ["SKHY","SAMSUNG","EWY","KORU"], importance: 5, note: "회사 공식 공지 전 — 날짜·시각 근접 시 재확인 필요(2분기는 7/29 08:00 발표). 컨센서스 매출 약 99.5조원·영업이익 약 78.1조원(사상 최대). 삼성 잠정실적(10/8, 영업익 107.4조·컨센서스 소폭 상회)으로 업황은 확인됐으나 원화 강세에 따른 매출 하회 패턴 주의. HBM4 가격·4분기 가이던스·Solidigm 상장 언급 여부 주목" },

  { dateKST: "2026-10-27", timeKST: null, dateLabel: "10월 27일 (화) (잠정)",
    event: "이더리움 Glamsterdam — Hoodi 테스트넷 활성화 (잠정)",
    tickers: ["ETH"], importance: 3,
    note: "Sepolia(10/6) 다음 단계. 단, 이더리움 재단은 'Hoodi·메인넷 활성화 날짜는 아직 미결정'이라고 공지 — 10/27은 커뮤니티 보도상 잠정치로 미확인. 순조로우면 메인넷 날짜 확정 논의로 이어짐 — 메인넷은 상반기 → 4분기로 이미 연기된 이력이 있어 추가 지연 시 실망 재료" },

  { dateKST: "2026-10-28", timeKST: null, dateLabel: "10월 28일 (수)",
    event: "OpenAI DevDay Exchange — 파리",
    tickers: ["NVDA","AMD","GOOGL","META"], importance: 1,
    note: "글로벌 순회 개발자 밋업. 美 현지 기준 같은 날(10/28) Alphabet·Microsoft·Meta 실적 발표 예상(KST 10/29 새벽). 구체적 현지 시각·세부 발표 미정" },

  { dateKST: "2026-10-29", timeKST: "05:00", dateLabel: "10월 29일 (목)",
    event: "Alphabet(GOOGL) 3분기 실적 발표(예상)",
    tickers: ["GOOGL"], importance: 5, note: "美 현지 10/28(수) 장마감 후 예상(콜 17:30 ET = KST 06:30) — 회사 공식 공지 전, 일부 제공처는 현지 10/27(화) 추정. 컨센서스 매출 약 $1,273억·EPS $3.04. 검색 성장(Muse 영향)·Cloud·CapEx·Gemini 4 Argon 수익화가 핵심" },

  { dateKST: "2026-10-29", timeKST: "03:00", dateLabel: "10월 29일 (목)",
    event: "FOMC 금리결정 발표 (10/27~28 회의)",
    tickers: ["EWY","ETH","META","GOOGL","KORU","MSTR","MU","NVDA","SKHY","SPY","ONDO","SOL","SNDK","SOXL","QQQ","TSLA","TSM","AAPL","AMZN","AMD","CL","BTC","XAU","PLTR","AVGO","CRCL"],
    importance: 5, note: "9/16 FOMC에서 25bp 인상(3.75→4.00%) 이후 두 번째 결정. 9월 의사록(10/8): 다수 위원 '연말까지 1회 추가 인상 적절', 시점은 데이터 의존. 10월 인상 확률은 9월 말 약 71% → 9/30 PCE 하회로 35% → 10/2 고용 쇼크로 16% → 의사록 후 약 20%. 반면 ISM 지불가격 77.9·호르무즈發 유가 반등으로 물가 압력 잔존 — 10/14 CPI가 마지막 변수. 10/9 기준 CME FedWatch: 10월 동결 약 81%, 12월 인상 약 81%" },

  { dateKST: "2026-10-29", timeKST: "05:00", dateLabel: "10월 29일 (목)",
    event: "Microsoft(MSFT) FY2027 1분기 실적 발표(예상)",
    tickers: ["MSFT"], importance: 5, note: "美 현지 10/28(수) 장마감 후 예상 — 회사 공식 공지 전(Wall Street Horizon 기준 미확정). Azure 성장률·AI Capex 가이던스 핵심. GOOGL·META와 같은 날 빅테크 실적 집중" },

  { dateKST: "2026-10-29", timeKST: "05:00", dateLabel: "10월 29일 (목)",
    event: "Meta(META) 3분기 실적 발표(예상)",
    tickers: ["META"], importance: 5, note: "美 현지 10/28(수) 장마감 후 예상 — 회사 공식 공지 전(작년엔 10/1 공지). 매출 가이던스 $610~640억, 약 $100억 법적 비용 일시 반영, Muse 초기 매출·Capex 가이던스가 핵심" },

  { dateKST: "2026-10-29", timeKST: null, dateLabel: "10월 29일 (목)",
    event: "삼성전자 3분기 확정 실적 + 특별배당 발표",
    tickers: ["SAMSUNG","SKHY","EWY","KORU"], importance: 4,
    note: "10/8 잠정실적(영업익 107.4조) 이후 부문별(DS·메모리·HBM) 상세와 3분기 특별배당 확정. 같은 날 새벽 FOMC·빅테크 실적과 겹침 — 정확한 시각은 공시 근접 시 재확인" },

  { dateKST: "2026-10-30", timeKST: "05:30", dateLabel: "10월 30일 (금)",
    event: "Apple(AAPL) 4분기 실적 발표(예상)",
    tickers: ["AAPL"], importance: 5, note: "美 현지 10/29(목) 장마감 후 예상 — 회사 공식 공지 전(통상 실적 약 4주 전 공지)" },

  { dateKST: "2026-11-01", timeKST: null, dateLabel: "11월 초 (미정)",
    event: "SpaceX(SPCX) 3분기 실적 발표(미확정) + 최대 약 13억주 락업 해제",
    tickers: ["SPCX","QQQ","TSLA"], importance: 5,
    note: "정확한 날짜 미발표(근접 시 재확인 필요 — 정렬용 임시 날짜, 보도상 美 현지 11/5 잠정). 신규 클라우드 계약 $141억 매출 반영 첫 분기, 2026년 말 ARR $1,000억 목표 진척 확인. 실적 발표 2거래일 후 스태거드 락업 최대 물량(약 13억주) 해제가 함께 트리거되는 핵심 이벤트" },

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

  { dateKST: "2026-11-05", timeKST: "06:00", dateLabel: "11월 5일 (목)",
    event: "MicroStrategy(MSTR) 3분기 실적 발표(확정)",
    tickers: ["MSTR"], importance: 4, note: "美 현지 11/4 장마감 후" },

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

  { dateKST: "2026-11-04", timeKST: null, dateLabel: "11월 4일 (화, 美 현지 기준 — KST 시각 미정)",
    event: "Circle(CRCL) 3분기 실적 발표(확정)",
    tickers: ["CRCL"], importance: 4, note: "회사 공지(10/7)로 美 현지 11/4 발표 확정 — 기존 '11/18' 표기 정정. 발표 시각은 근접 시 재확인. USDC 유통·기타 매출 성장·Arc 성과·CFO(9/28 사임) 후임 코멘트가 관건" },

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

  { dateKST: "2026-10-04", timeKST: null, dateLabel: "10월 4일 (일)",
    event: "OPEC+ 핵심 7개국 회의 — 11월 산유량 동결 (결과 확정)",
    tickers: ["CL"], importance: 4,
    note: "결과: 11월 쿼터 동결(2개월 연속), 기존 로드맵 유지. 사우디·이라크·쿠웨이트 생산이 전쟁 전보다 크게 낮아 쿼터 결정의 실효성은 제한적. 2026년 말까지 증산 중단 시사. 다음 회의 11/1(12월 정책), 11/29 전체 장관회의·JMMC" },

  { dateKST: "2026-10-06", timeKST: null, dateLabel: "10월 6일 (화, 美 현지 10/5 발표)",
    event: "LG전자, 美 AIR Control Concepts와 AI 데이터센터 칠러 장기공급 계약 (결과 확정)",
    tickers: ["LGELECTRONICS"], importance: 3,
    note: "결과: 수십억 달러 규모, LG전자 냉각 솔루션 단일 수주 역대 최대. 10/6 LG전자 +8.12%(233,000원)로 시총 상위주 중 최대 상승 — 다음 날 3Q 어닝미스로 상승분 반납" },

  { dateKST: "2026-10-06", timeKST: null, dateLabel: "10월 6일 (화, 美 현지 10/5 공시)",
    event: "Strategy(MSTR) 8-K — 334 BTC 추가 매입·보유 848,000 BTC, 3Q BTC 평가이익 약 $209억 (결과 확정)",
    tickers: ["MSTR","BTC"], importance: 3,
    note: "결과: 10/1~4 334 BTC($2,870만, 평균 $85,839) 매입으로 보유량 사상 최대. STRC 우선주 $7,370만 재매입 병행, USD Reserve $48.8억. 주간 매입 규모가 크게 줄어 '최대 고정 매수처 둔화' 인식 — MSTR 10/5 +2.76% 후 10/7 -6.79%" },

  { dateKST: "2026-10-07", timeKST: "15:30", dateLabel: "10월 7일 (수)",
    event: "LG전자 3분기 잠정실적 — 영업이익 컨센서스 24% 하회 (결과 확정)",
    tickers: ["LGELECTRONICS"], importance: 4,
    note: "결과: 매출 23조 8,270억원(+8.9%, 3분기 최대)·영업이익 7,818억원(+13.5%)이나 컨센서스(매출 24.2조·영업이익 1조 301억) 대비 영업이익 약 2,483억 미달 — LG이노텍 부진·물류·원자재 비용. 1~3Q 누적 영업이익 4.03조(+55.9%) 사상 첫 4조. 주가 10/7 -10.7%(208,000원), 10/8 -3.37%(201,000원)" },

  { dateKST: "2026-10-07", timeKST: null, dateLabel: "10월 7일 (수)",
    event: "네이버파이낸셜–두나무 합병 세 번째 연기 — 주식교환 2027년 3/31 (결과 확정)",
    tickers: ["NAVER"], importance: 4,
    note: "결과: 주식교환일 12/31→2027.3/31, 주주총회 11/19→2027.2/26로 정정공시. 공정위 기업결합 심사·금융당국 대주주 변경 승인·특금법 신고 미완료, 디지털자산기본법 국회 계류. 네이버파이낸셜 IPO도 순연. NAVER 10/7 -1.51%, 10/8 -3.07%(183,200원)로 52주 최저가(181,100원) 근접" },

  { dateKST: "2026-10-08", timeKST: null, dateLabel: "10월 8일 (목, 美 현지 10/7)",
    event: "BitMine 톰 리 '유통량 5% 도달 시 ETH 매수 중단' 발언 (결과 확정)",
    tickers: ["ETH"], importance: 3,
    note: "결과: 보유 약 601.6만 ETH(약 4.9%)로 5%까지 약 10만 ETH만 남음 — 최대 고정 매수처 소멸 우려. ETH 현물 ETF 8거래일 연속 유출(10월 누적 약 -$5.8억)과 겹쳐 ETH 10/7~8 이틀간 약 -8%, 장중 $2,410" },

  { dateKST: "2026-10-09", timeKST: null, dateLabel: "10월 9일 (금, 美 현지 10/8)",
    event: "허리케인 '이사이아스' — 美 멕시코만 원유 생산 62.9%(130만 b/d) 셧인 (결과 확정)",
    tickers: ["CL"], importance: 3,
    note: "결과: Shell·Chevron·BP 해상 플랫폼 가동 중단. 이란 공습 검토 보도·호르무즈 유조선 공격 최다와 겹쳐 10/8 WTI +3.6%($91.49)·브렌트 +4.1%($104.28) 급등. 복구 속도가 단기 美 원유 수급 변수" },

  { dateKST: "2026-10-10", timeKST: "05:00", dateLabel: "10월 10일 (토)",
    event: "美 10/9 정규장 마감 — 트럼프 '중간선거 전 이란 공격 없음'에 유가 진정·위험자산 반등 (결과 확정)",
    tickers: ["BTC","ETH","XAU","CL","EWY","KORU","MSTR","CRCL","SOL","ONDO"], importance: 4,
    note: "결과: 트럼프 '11/3 중간선거 전 이란 공격 없음·생산적 협상' + 이란 '7일 내 호르무즈 재개안 검토'로 유가 하락(WTI $90.40 -1.2%, 브렌트 $102.91 -1.3%). 30년물 입찰 호조·미시간대 심리 급락(46.3)으로 금리 하락, 금 약 $4,195(+1.4%). EWY $177.24(+0.54%)·KORU $17.85(+1.13%)·MSTR $154.34(+1.89%)·CRCL $84.51(+4.54%, 삼성월렛 USDC 송금 지원 뉴스). BTC $83k대 반등했으나 현물 ETF는 BTC -$2.8억(3일 연속)·ETH -$0.96억(8일 연속) 유출 지속" },

  { dateKST: "2026-10-17", timeKST: "05:19", dateLabel: "10월 17일 (토)",
    event: "비트코인 채굴 난이도 조정 (예상)",
    tickers: ["BTC","MSTR"], importance: 2,
    note: "현재 132.72T → 약 137.2T(+3.4%) 예상(CoinWarz, 블록 진행 속도에 따라 시각 변동). 해시레이트 유입 지속 신호" },

  { dateKST: "2026-10-26", timeKST: null, dateLabel: "10월 마지막 주 (美 현지)",
    event: "삼성월렛 美 사용자 대상 USDC(솔라나) 송금 지원 개시",
    tickers: ["CRCL","SOL","SAMSUNG"], importance: 3,
    note: "삼성전자 미국법인·솔라나 재단 발표(10/8~9) — 美 갤럭시 약 8,200만 대 대상. 정렬용 임시 날짜(10월 마지막 주). USDC 대중 결제 채택 지표로 CRCL 10/9 +4.54% 반응" },

  { dateKST: "2026-10-28", timeKST: null, dateLabel: "10월 28일 (수, 美 현지)",
    event: "Strategy(MSTR) 주주총회 — 우선주 일 단위 배당 기준일 도입 안건",
    tickers: ["MSTR"], importance: 2,
    note: "STRF·STRC·STRK·STRD 배당 기준일을 '일 단위'로 변경(승인 시 STRC 11/1 첫 적용). STRC 배당률은 연 12%로 상향 — 우선주 수요 확대로 자본조달 경로 다변화 시도" },

  { dateKST: "2026-10-29", timeKST: null, dateLabel: "10월 29일 (목) (예상)",
    event: "현대차 3분기 실적 발표 (예상)",
    tickers: ["HYUNDAI"], importance: 4,
    note: "NH투자증권 리포트 기준 10/29 예상 — 회사 공식 공지 전. 영업이익 추정 2.23조(하나)~2.40조(NH)로 기존 기대 3.0조 대비 하향(8월 파업 5.5만 대 손실·추석 영업일 감소·원자재). 美 판매 9월·3분기 사상 최대, 하이브리드 +35% — 4분기 회복 가이던스가 관건" },

  { dateKST: "2026-10-30", timeKST: null, dateLabel: "10월 말 (예정)",
    event: "LG전자 3분기 확정실적 발표 (예정)",
    tickers: ["LGELECTRONICS"], importance: 3,
    note: "정렬용 임시 날짜 — 공식 일정 근접 시 재확인. 잠정 영업이익 7,818억(컨센서스 -24%) 이후 사업부별(가전·TV·전장·냉각) 실적, LG이노텍 부진 원인, AI 데이터센터 냉각 수주잔고 확인" },

  { dateKST: "2026-11-01", timeKST: null, dateLabel: "11월 1일 (일)",
    event: "OPEC+ 핵심 7개국 화상회의 — 12월 산유량 결정",
    tickers: ["CL"], importance: 4,
    note: "10/4 회의에서 11월 동결. 이번 회의에서 12월 계획 확정 예정. 11/29 전체 장관회의·JMMC에서 2027년 정책 결정" },

  { dateKST: "2026-11-01", timeKST: "09:00", dateLabel: "11월 1일 (일)",
    event: "한국 10월 수출입 동향 발표",
    tickers: ["EWY","KORU","SAMSUNG","SKHY","HYUNDAI"], importance: 4,
    note: "9월 수출 $1,209억(+83.5%)·반도체 $603억 사상 최대 이후 증가세 지속 여부. 산업부 매월 1일 발표(휴일에도 발표)" },

  { dateKST: "2026-11-04", timeKST: null, dateLabel: "11월 4일 (수, 美 현지 11/3)",
    event: "🇺🇸 미국 중간선거",
    tickers: ["SPY","QQQ","CL","XAU","BTC","ETH","CRCL","MSTR","EWY","KORU"], importance: 4,
    note: "트럼프 '선거 전 이란 공격 없음' 발언의 시한 — 이후 군사 옵션 재부각 시 유가·안전자산 변동성 확대 가능. 의회 구성에 따라 CLARITY Act 등 크립토 시장구조 법안·관세 정책 경로 변화" },

  { dateKST: "2026-11-05", timeKST: null, dateLabel: "11월 초 (예상)",
    event: "NAVER 3분기 실적 발표 (예상)",
    tickers: ["NAVER"], importance: 4,
    note: "정렬용 임시 날짜 — 회사 공식 공지 전. AI 브리핑 광고 성과, 커머스 성장률, AI 인프라 비용 추이, 두나무 합병 일정 코멘트가 관건" },

  { dateKST: "2026-11-30", timeKST: null, dateLabel: "11월 29일 (일)",
    event: "OPEC+ 전체 장관회의·JMMC — 2027년 생산 정책",
    tickers: ["CL"], importance: 4,
    note: "2022년 감산분 추가 복원 여부(회원국 생산능력 감사 결과 연동)가 핵심. 정렬용 날짜는 11/30로 표기" },

  { dateKST: "2026-12-31", timeKST: null, dateLabel: "2026년 4분기 중 (미정)",
    event: "이더리움 Glamsterdam 메인넷 활성화 (목표)",
    tickers: ["ETH"], importance: 4,
    note: "정렬용 임시 날짜 — 공식 날짜 미확정(코어 개발자 콜에서 결정). 실행계층 Amsterdam + 합의계층 Gloas. ePBS·BAL(병렬 실행)·가스 한도 확대 기반. 상반기 → 4분기로 연기된 이력" }
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
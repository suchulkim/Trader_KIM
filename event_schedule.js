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
 * 마지막 자동 업데이트: 2026-09-06 (KST)
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
    event: "미국 8월 소비자물가지수(CPI)",
    tickers: ["SPY","QQQ","EWY","KORU","BTC","ETH","XAU"], importance: 5,
    note: "FOMC 직전 마지막 핵심 인플레이션 지표. 7월 근원CPI 2.5%YoY. 예상외로 강한 8월 고용지표(비농업 +16.2만)로 9월 인상 가능성이 부각된 상황이라 서프라이즈 시 영향 확대" },

  { dateKST: "2026-09-12", timeKST: "16:00", dateLabel: "9월 12일 (토)",
    event: "아이폰18 프로 사전예약 시작",
    tickers: ["AAPL"], importance: 3, note: null },

  { dateKST: "2026-09-14", timeKST: "09:00", dateLabel: "9월 14일 (월)",
    event: "Solana Agave v4.3 스테이크 가중치 전환 2단계 (25%)",
    tickers: ["SOL"], importance: 2, note: null },

  { dateKST: "2026-09-15", timeKST: "09:00", dateLabel: "9월 15일 (화)",
    event: "미국 상원 CLARITY Act(디지털자산 시장구조법) 클로처(토론종결) 표결",
    tickers: ["CRCL"], importance: 4, note: "스테이블코인·디지털자산 규제 명확화 법안, 9/15 절차투표로 확정" },

  { dateKST: "2026-09-16", timeKST: "09:00", dateLabel: "9월 16일 (수)",
    event: "Circle Arc 메인넷 정식 출시",
    tickers: ["CRCL"], importance: 3, note: "BlackRock·Visa·DTCC 등 창립 밸리데이터 참여, 출시일 공식 확정" },

  { dateKST: "2026-09-17", timeKST: "03:00", dateLabel: "9월 17일 (목)",
    event: "FOMC 금리결정 발표 (9/15~16 회의, SEP·점도표 포함)",
    tickers: ["EWY","ETH","META","GOOGL","KORU","MSTR","MU","NVDA","SKHY","SPY","ONDO","SOL","SNDK","SOXL","QQQ","TSLA","TSM","AAPL","AMZN","AMD","CL","BTC","XAU","PLTR","AVGO","CRCL"],
    importance: 5, note: "강한 8월 고용지표 이후 CME FedWatch 기준 25bp '인상' 확률이 50%대 후반~60%대까지 상승(2023년 이후 첫 인상 여부 주목) — 인하가 아닌 인상 가능성이 논의되는 이례적 국면. 03:30 파월 의장 기자회견 — 전 자산군 공통 최상위 변수" },

  { dateKST: "2026-09-18", timeKST: "09:00", dateLabel: "9월 18일 (금)",
    event: "아이폰18 프로 시리즈 정식 출시",
    tickers: ["AAPL"], importance: 4, note: null },

  { dateKST: "2026-09-18", timeKST: "22:00", dateLabel: "9월 18일 (금)",
    event: "9월 트리플위칭(선물·옵션 동시만기)",
    tickers: ["AVGO","SPY","QQQ"], importance: 3, note: null },

  { dateKST: "2026-09-21", timeKST: "09:00", dateLabel: "9월 21일 (월)",
    event: "Solana Agave v4.3 스테이크 가중치 전환 최종단계 (전체 검증인 권장)",
    tickers: ["SOL"], importance: 2, note: null },

  { dateKST: "2026-09-22", timeKST: "09:00", dateLabel: "9월 22일 (화)",
    event: "Alphabet 증권 집단소송 공판",
    tickers: ["GOOGL"], importance: 3, note: "공식 소송 안내 사이트 기준 날짜 확정" },

  { dateKST: "2026-09-24", timeKST: "09:00", dateLabel: "9월 24일 (목)",
    event: "테슬라 세미(Semi) 신공장 준공 이벤트 'Semi Rollout' (네바다 Sparks)",
    tickers: ["TSLA"], importance: 3,
    note: "초청 전용 행사 — 연산 5만대 규모 전용 공장 준공 기념, 공장 투어·시승 프로그램 진행. 일반 공개 여부·정확한 현지 시각 미확정, 근접 시 재확인 필요" },

  { dateKST: "2026-09-25", timeKST: "17:00", dateLabel: "9월 25일 (금)",
    event: "Deribit 비트코인·이더리움 월간 옵션 만기(추정)",
    tickers: ["BTC","ETH"], importance: 3, note: "월말 대형 만기 규모에 따라 BTC/ETH 동반 단기 변동성 확대 가능" },

  { dateKST: "2026-09-28", timeKST: "09:00", dateLabel: "9월 28일 (월)",
    event: "Solana Alpenglow 메인넷 활성화",
    tickers: ["SOL"], importance: 3, note: "Agave v4.3 10%(9/8)→25%(9/14)→전체 권장(9/21) 스테이크 전환 이후, 검증인 BLS 키 등록 완료를 전제로 9/28 150ms 파이널리티 목표 활성화(공식 일정, 변경 가능)" },

  { dateKST: "2026-09-30", timeKST: "09:00", dateLabel: "9월 30일 (수)",
    event: "Alphabet 증권 집단소송 옵트아웃(제외 신청) 마감",
    tickers: ["GOOGL"], importance: 2, note: "공식 소송 안내 사이트 기준 날짜 확정(우편 소인 기준)" },

  { dateKST: "2026-09-30", timeKST: "21:30", dateLabel: "9월 30일 (수)",
    event: "미국 8월 근원 PCE 물가지수",
    tickers: ["XAU","SPY","QQQ"], importance: 4, note: "연준 선호 물가지표. 발표 시각 21:30 KST(08:30 ET) 확정" },

  { dateKST: "2026-10-01", timeKST: "05:00", dateLabel: "10월 1일 (목)",
    event: "Micron(MU) FY2026 4분기 실적발표",
    tickers: ["MU","SKHY","SOXL"], importance: 5, note: "美 현지 9/30 장마감 후 — 회사 공식 발표로 날짜 확정. HBM 가격/수요 가이던스 핵심" },

  { dateKST: "2026-10-01", timeKST: "09:00", dateLabel: "10월 1일 (목)",
    event: "NVIDIA 분기 배당 지급",
    tickers: ["NVDA"], importance: 1, note: null },

  { dateKST: "2026-10-02", timeKST: "09:30", dateLabel: "10월 2일 (금)",
    event: "테슬라 신형 로드스터 공개 이벤트 (텍사스 웨이코)",
    tickers: ["TSLA"], importance: 4,
    note: "美 현지 10/1 20:30 ET 진행. SpaceX 협업 냉가스 추진기 탑재 버전 공개 가능성 — 양산·가격·출시 일정은 미확정" },

  { dateKST: "2026-10-02", timeKST: "21:30", dateLabel: "10월 2일 (금)",
    event: "미국 9월 소비자물가지수(CPI)",
    tickers: ["SPY","QQQ","EWY","KORU","BTC","ETH","XAU"], importance: 5,
    note: "BLS 발표 일정 기준. 9월 FOMC 인상 여부 이후 첫 인플레 지표로 10월 FOMC 전망에 직결" },

  { dateKST: "2026-10-05", timeKST: "09:00", dateLabel: "10월 5일 (월)",
    event: "9월 한국 반도체 수출 통계 발표(예정)",
    tickers: ["EWY","KORU","SKHY"], importance: 4, note: "8월 반도체 수출 전년비 +209% 사상 최대치 기록, 9월 연속 여부 확인 — 정확한 발표일은 관세청 통관 발표 일정에 따라 변동 가능" },

  { dateKST: "2026-10-15", timeKST: "09:00", dateLabel: "10월 15일 (목)",
    event: "TSMC 3분기 실적 발표(잠정확정)",
    tickers: ["TSM"], importance: 5, note: "실적 캘린더 기준 잠정 확정, TSMC 자체 IR 캘린더엔 아직 미게시 — 근접 시 재확인 필요" },

  { dateKST: "2026-10-22", timeKST: "09:00", dateLabel: "10월 22일 (목)",
    event: "한국은행 금융통화위원회 (기준금리 결정)",
    tickers: ["EWY","KORU"], importance: 4, note: "2026년 정례회의 일정(1/15·2/26·4/10·5/28·7/16·8/27·10/22·11/26) 중 하나로 날짜 확정. 현 기준금리 2.50%" },

  { dateKST: "2026-10-23", timeKST: "05:00", dateLabel: "10월 23일 (금)",
    event: "Amazon(AMZN) 3분기 실적 발표(확정)",
    tickers: ["AMZN"], importance: 5, note: "美 현지 10/22 장마감 후 — 실적 캘린더 기준 날짜 확정" },

  { dateKST: "2026-10-27", timeKST: "16:00", dateLabel: "10월 27일 (화)",
    event: "SK하이닉스 3분기 실적 발표(잠정)",
    tickers: ["SKHY"], importance: 4, note: "국내 공시 기준 발표시각은 근접 시 재확인 필요" },

  { dateKST: "2026-10-28", timeKST: "05:00", dateLabel: "10월 28일 (수)",
    event: "Alphabet(GOOGL) 3분기 실적 발표(확정)",
    tickers: ["GOOGL"], importance: 5, note: "美 현지 10/27 장마감 후. Cloud 성장·CapEx 가이던스 핵심" },

  { dateKST: "2026-10-29", timeKST: "03:00", dateLabel: "10월 29일 (목)",
    event: "FOMC 금리결정 발표 (10/27~28 회의)",
    tickers: ["EWY","ETH","META","GOOGL","KORU","MSTR","MU","NVDA","SKHY","SPY","ONDO","SOL","SNDK","SOXL","QQQ","TSLA","TSM","AAPL","AMZN","AMD","CL","BTC","XAU","PLTR","AVGO","CRCL"],
    importance: 5, note: null },

  { dateKST: "2026-10-29", timeKST: "05:00", dateLabel: "10월 29일 (목)",
    event: "Meta(META) 3분기 실적 발표(확정)",
    tickers: ["META"], importance: 5, note: "美 현지 10/28 장마감 후" },

  { dateKST: "2026-10-29", timeKST: "06:00", dateLabel: "10월 29일 (목)",
    event: "테슬라 3분기 실적 발표(확정)",
    tickers: ["TSLA"], importance: 5, note: "美 현지 10/28 장마감 후. 마진·인도량·가이던스 핵심" },

  { dateKST: "2026-10-30", timeKST: "05:00", dateLabel: "10월 30일 (금)",
    event: "Apple(AAPL) 4분기 실적 발표(확정)",
    tickers: ["AAPL"], importance: 5, note: "美 현지 10/29 장마감 후" },

  { dateKST: "2026-11-04", timeKST: "06:00", dateLabel: "11월 4일 (수)",
    event: "AMD 3분기 실적 발표(확정)",
    tickers: ["AMD"], importance: 5, note: "美 현지 11/3 장마감 후" },

  { dateKST: "2026-11-05", timeKST: "06:00", dateLabel: "11월 5일 (목)",
    event: "MicroStrategy(MSTR) 3분기 실적 발표(확정)",
    tickers: ["MSTR"], importance: 4, note: "美 현지 11/4 장마감 후" },

  { dateKST: "2026-11-06", timeKST: "06:00", dateLabel: "11월 6일 (금)",
    event: "SanDisk(SNDK) 다음 분기 실적 발표(확정)",
    tickers: ["SNDK"], importance: 4, note: "美 현지 11/5 장마감 후" },

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

# Trader_KIM 알람 → GitHub Actions → 텔레그램

차트(`Trader_KIM_Chart.html`)의 알람을 비공개 Gist에 저장해 모든 브라우저가 공유하고,
GitHub Actions가 15초마다 시세를 확인해 조건이 맞으면 텔레그램으로 보냅니다.

```
브라우저 A ─┐                       ┌─ GitHub Actions (watch.py, 15초 주기)
브라우저 B ─┼─▶ 비공개 Gist alerts.json ◀─┤        │
휴대폰 등  ─┘                       └────────┴─▶ 텔레그램
```

## 1. 텔레그램 봇 만들기 (5분)
1. 텔레그램에서 **@BotFather** → `/newbot` → 이름 입력 → **봇 토큰**(`123456:ABC…`)을 받습니다.
2. 만든 봇과의 대화창을 열고 아무 메시지나 한 번 보냅니다.
3. 브라우저에서 `https://api.telegram.org/bot<봇토큰>/getUpdates`를 열어
   `"chat":{"id": 123456789 …}`의 숫자가 **채팅 ID**입니다.

## 2. GitHub 토큰 만들기
GitHub → Settings → Developer settings → Personal access tokens → **Tokens (classic)** → Generate new token
- Note: `Trader_KIM alerts`, Expiration: 원하는 기간
- 권한은 **`gist` 하나만** 체크 (Gist는 fine-grained 토큰을 지원하지 않습니다)

## 3. 차트에서 연결 (브라우저마다 한 번)
알림 패널 → **☁ 알람 동기화 · 텔레그램**
1. GitHub 토큰 붙여넣기, Gist ID는 비워 두고 **연결** → 비공개 Gist가 만들어지고 ID가 채워집니다.
2. 다른 브라우저·PC에서는 **같은 토큰 + 같은 Gist ID**를 넣고 연결하면 같은 알람이 보입니다.
   (기존에 그 브라우저에만 있던 알람은 합쳐집니다)

## 4. 저장소에 파일 넣기
`Trader_KIM` 저장소에 아래 두 경로 그대로 올립니다.
```
.github/workflows/price-alert.yml
alert_watcher/watch.py
```

## 5. Secrets 등록
저장소 → Settings → Secrets and variables → Actions → **New repository secret**

| 이름 | 값 |
|---|---|
| `GIST_TOKEN` | 2번의 GitHub 토큰 |
| `GIST_ID` | 3번에서 만들어진 Gist ID |
| `TELEGRAM_BOT_TOKEN` | 1번의 봇 토큰 |
| `TELEGRAM_CHAT_ID` | 1번의 채팅 ID |

## 6. 첫 실행
Actions 탭 → **price-alert** → **Run workflow** (테스트 메시지 체크)
→ 텔레그램에 "✅ 알람 감시기 테스트"가 오면 완료입니다.
이후에는 30분마다 예약 실행이 대기하다가 앞 실행(약 5시간 50분)이 끝나면 바로 이어받습니다.

## 동작 규칙
- 판정은 차트와 같습니다: 직전 시세 → 현재 시세가 알람 가격을 지나가면 발동 (교차 / 상향 / 하향).
- 1회 알람은 발동 후 꺼지고, 그 결과가 Gist를 통해 열린 브라우저에도 반영됩니다 (목록에 `📨 텔레그램` 표시).
- 브라우저가 먼저 발동시킨 알람도 30분 이내면 텔레그램을 보내 줍니다 (중복 전송 방지).
- 감시 주기가 15초라서 그 사이 잠깐 찍고 돌아온 꼬리는 놓칠 수 있습니다.
- Binance 선물은 GitHub 서버(미국)에서 차단되는 경우가 많습니다 → 텔레그램으로 경고가 한 번 옵니다.

## 끄기
Actions 탭 → price-alert → ··· → **Disable workflow**

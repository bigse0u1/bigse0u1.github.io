---
title: "FocusMate"
date: 2025-09-01
description: "A Real-Time User Attention Evaluation Model Using Integrated Visual Biosignals"
image: "assets/img/projects/focusmate.png"
stack: "TypeScript · MediaPipe · HTML · CSS"
status: "done"
tags: [Computer Vision, TypeScript, MediaPipe, Web]
github: "https://github.com/bigse0u1/FOCUS_MATE"
demo: "https://yonsei-focusmate.netlify.app/"
---

## 프로젝트 소개

FocusMate는 MediaPipe를 활용해 사용자의 시선, 표정, 자세를 실시간으로 분석하여 집중도를 평가하는 시스템입니다.

## 기술 스택

- **TypeScript** — 타입 안전성이 보장된 메인 로직
- **MediaPipe** — 얼굴 랜드마크 및 포즈 추정 (468 포인트)
- **HTML/CSS** — 반응형 대시보드 UI

## 핵심 기능

1. 실시간 얼굴 랜드마크 추출
2. 시선 방향 벡터 계산
3. 집중도 점수 시계열 시각화
4. 비디오 없이 로컬에서 완전 동작


# FOCUS MATE — 알고리즘 및 수식 정리

## 목차

- [FOCUS MATE — 알고리즘 및 수식 정리](#focus-mate--알고리즘-및-수식-정리)
  - [목차](#목차)
  - [1. 비전 파이프라인 (Vision)](#1-비전-파이프라인-vision)
  - [2. EAR — 눈 종횡비 (Eye Aspect Ratio)](#2-ear--눈-종횡비-eye-aspect-ratio)
  - [3. PERCLOS — 눈 감김 비율](#3-perclos--눈-감김-비율)
  - [4. 홍채 중심 및 시선 벡터](#4-홍채-중심-및-시선-벡터)
  - [5. 시선 이탈 지수 (gazeDev)](#5-시선-이탈-지수-gazedev)
  - [6. 집중 구역 점수 (zoneScore)](#6-집중-구역-점수-zonescore)
  - [7. Head Pose 추정](#7-head-pose-추정)
  - [8. 머리 움직임 점수 (headScore)](#8-머리-움직임-점수-headscore)
  - [9. 최종 집중도 점수 (focusScore)](#9-최종-집중도-점수-focusscore)
    - [축별 점수](#축별-점수)
    - [가중합](#가중합)
    - [EMA 평활화 (α = 0.2)](#ema-평활화-α--02)
  - [10. 상태 분류 (State Machine)](#10-상태-분류-state-machine)
    - [상태 분류 규칙](#상태-분류-규칙)
    - [상태 확정 (Hysteresis + Hold)](#상태-확정-hysteresis--hold)
    - [레거시 점수 기반 히스테리시스 (`src/state/index.ts`)](#레거시-점수-기반-히스테리시스-srcstateindexts)
  - [11. 추천 알고리즘 (Recommend)](#11-추천-알고리즘-recommend)
    - [데이터 수집](#데이터-수집)
    - [점수 산출](#점수-산출)
    - [신뢰도 보정](#신뢰도-보정)
    - [필터링 조건](#필터링-조건)
    - [콜드 스타트 처리](#콜드-스타트-처리)
  - [12. 리포트 집계](#12-리포트-집계)
    - [상태별 지속시간 (`sumMinutes`)](#상태별-지속시간-summinutes)
    - [총 집중시간 (24h 타임라인 기반)](#총-집중시간-24h-타임라인-기반)
    - [평균 집중도 (`avgFocus`)](#평균-집중도-avgfocus)
    - [리포트 주기](#리포트-주기)

---

## 1. 비전 파이프라인 (Vision)

`src/vision/index.ts`

MediaPipe FaceMesh(CDN)로 15 FPS의 얼굴 랜드마크를 추출한다.  
각 프레임에서 아래 정보를 `fm:vision` 이벤트로 내보낸다.

| 항목 | 내용 |
|------|------|
| 눈꺼풀 포인트 | 좌안 `[33, 160, 158, 133, 153, 144]`, 우안 `[362, 385, 387, 263, 373, 380]` |
| 홍채 포인트 | 좌 `[468~472]`, 우 `[473~477]` — 5점 평균으로 중심 계산 |
| Head Pose | 코 `1`, 턱 `152`, 이마 `10` 랜드마크 사용 |
| Confidence | 전체 랜드마크 visibility 평균 (`≥ 0.6` 이면 valid) |

---

## 2. EAR — 눈 종횡비 (Eye Aspect Ratio)

`src/metrics/index.ts › computeEAR()`

눈꺼풀 6개 포인트로 눈이 열린 정도를 수치화한다.

```
       p2      p3
      /  \    / \
p1 --      \/      -- p4
      \  /    \ /
       p6      p5
```

$$
\text{EAR} = \frac{\|p_2 - p_6\| + \|p_3 - p_5\|}{2 \cdot \|p_1 - p_4\|}
$$

- 눈이 완전히 열리면 ≈ 0.3
- 눈이 감기면 → 0

**눈 감김 판정:**

$$
\text{isClosed} = \left(\frac{\text{EAR}}{\text{baseline EAR}} < 0.7\right) \;\lor\; (\text{EAR} < 0.18)
$$

**캘리브레이션:**  
세션 시작 시 N초 동안 EAR 평균을 측정해 `baselineEAR`를 개인화한다.

$$
\text{baselineEAR} = \frac{1}{N} \sum_{i=1}^{N} \text{EAR}_i
$$

---

## 3. PERCLOS — 눈 감김 비율

`src/metrics/index.ts › updatePerclos()`

최근 **60초(900프레임 @ 15fps)** 슬라이딩 윈도우 내에서 눈을 감은 프레임 비율.

$$
\text{PERCLOS} = \frac{\text{눈 감은 프레임 수}}{\text{윈도우 내 총 프레임 수}}
$$

| PERCLOS 값 | 의미 |
|-----------|------|
| 0 ~ 0.35 | 정상 |
| 0.35 ~ 0.5 | 피로 (fatigue) |
| > 0.5 | 졸음 (drowsy) |

---

## 4. 홍채 중심 및 시선 벡터

`src/vision/index.ts › getIrisCenter()`

홍채 5개 랜드마크의 단순 평균으로 중심점을 구한다.

$$
\text{irisCenter} = \left(\frac{\sum x_i}{5},\; \frac{\sum y_i}{5}\right)
$$

**시선 벡터 (gaze vector):**  
홍채 중심에서 눈꺼풀 중심(eye center)을 뺀 방향 벡터.

$$
\vec{v}_L = \text{irisL} - \text{eyeCenter}(L), \quad \vec{v}_R = \text{irisR} - \text{eyeCenter}(R)
$$

$$
\vec{v} = \frac{\vec{v}_L + \vec{v}_R}{2}
$$

**시선 방향 분류** — 정규화 벡터 $(n_x, n_y)$ 기준:

| 조건 | 방향 |
|------|------|
| $|n_x| < 0.35 \land n_y < 0$ | 위 |
| $|n_x| < 0.35 \land n_y > 0$ | 아래 |
| $|n_y| < 0.35 \land n_x < 0$ | 왼쪽 |
| $|n_y| < 0.35 \land n_x > 0$ | 오른쪽 |
| $\|\vec{v}\| < 0.01$ | 중앙 |

---

## 5. 시선 이탈 지수 (gazeDev)

`src/metrics/index.ts`

시선 벡터의 유클리드 거리로 눈이 중심에서 얼마나 벗어났는지 측정.

$$
\text{gazeDev} = \|\vec{v}\| = \sqrt{v_x^2 + v_y^2}
$$

**EMA 평활화** (α = 0.15):

$$
\text{gazeDevEMA}_t = (1 - 0.15) \cdot \text{gazeDevEMA}_{t-1} + 0.15 \cdot \text{gazeDev}_t
$$

**gazeScore** (0 ~ 1):

$$
\text{gazeScore} = 1 - \text{clamp}_{[0,1]}\!\left(\frac{\text{gazeDevEMA}}{0.25}\right)
$$

---

## 6. 집중 구역 점수 (zoneScore)

`src/metrics/index.ts › computeZoneScore()`

사용자가 설정한 사각형 집중 구역(FocusZone) 안에 시선이 있는지 여부를 EMA로 추적한다.

| 상황 | 목표값(target) | EMA α |
|------|---------------|-------|
| 구역 안 | 1.0 | 0.02 (천천히 상승) |
| 구역 밖 | 0.7 | 0.001 (매우 천천히) |
| 구역 밖 + 움직임 | — | 0.15 (급격히 하락) |

$$
\text{zoneScoreEMA}_t = \begin{cases}
(1 - \alpha_{\text{inside}}) \cdot \text{prev} + \alpha_{\text{inside}} \cdot 1.0 & \text{in zone} \\
(1 - \alpha_{\text{drop}}) \cdot \text{prev} & \text{out + moving} \\
(1 - \alpha_{\text{outside}}) \cdot \text{prev} + \alpha_{\text{outside}} \cdot 0.7 & \text{out}
\end{cases}
$$

**구역 이탈 + 시선/머리 움직임 동시 발생 시 급락:**

```
if (zoneScoreEMA < 0.9 && (gazeDevEMA > 0.12 || headMoveEMA > 0.7)):
    focusScoreEMA *= 0.6   ← 집중도를 즉시 40% 삭감
```

---

## 7. Head Pose 추정

`src/vision/index.ts › computePose()`

얼굴 랜드마크 3점(코, 이마, 턱)과 눈 중심을 이용해 Yaw/Pitch/Roll을 경험적 스케일로 추정한다.

$$
\text{yaw} = (\text{nose.x} - \text{eyeMid.x}) \times 120
$$

$$
\text{pitch} = \left(\frac{\text{forehead.y} + \text{chin.y}}{2} - \text{nose.y}\right) \times 120
$$

$$
\text{roll} = \arctan2(\text{eyeR.y} - \text{eyeL.y},\; \text{eyeR.x} - \text{eyeL.x}) \times \frac{180}{\pi}
$$

단위: 도(degree). 스케일 120은 경험적 보정값.

---

## 8. 머리 움직임 점수 (headScore)

`src/metrics/index.ts`

한 프레임에서의 Yaw/Pitch/Roll 변화량으로 움직임을 측정한다.

$$
\Delta\text{pose} = \sqrt{(\Delta\text{yaw})^2 + (\Delta\text{pitch})^2 + (\Delta\text{roll})^2}
$$

**EMA 평활화** (α = 0.1):

$$
\text{headMoveEMA}_t = (1 - 0.1) \cdot \text{headMoveEMA}_{t-1} + 0.1 \cdot \Delta\text{pose}_t
$$

**headScore** — 움직임이 커질수록 점수 감소 (4° 기준 급격히 패널티):

$$
\text{headScore} = 1 - \text{clamp}_{[0,1]}\!\left(\frac{\text{headMoveEMA}}{4}\right)
$$

---

## 9. 최종 집중도 점수 (focusScore)

`src/metrics/index.ts`

4개 축의 가중합으로 원시 집중도를 산출한다.

### 축별 점수

| 축 | 수식 | 가중치 |
|----|------|--------|
| eyeScore | $1 - \text{clamp}(\text{PERCLOS} / 0.5)$ (프레임 단위 감김 시 × 0.8) | **0.40** |
| gazeScore | $1 - \text{clamp}(\text{gazeDevEMA} / 0.25)$ | **0.20** |
| locScore | $\text{zoneScore}$ | **0.25** |
| headScore | $1 - \text{clamp}(\text{headMoveEMA} / 4)$ | **0.15** |

### 가중합

$$
\text{rawFocus} = 0.40 \cdot \text{eyeScore} + 0.20 \cdot \text{gazeScore} + 0.25 \cdot \text{locScore} + 0.15 \cdot \text{headScore}
$$

$$
\text{focus}_{0 \sim 100} = \text{clamp}_{[0,1]}(\text{rawFocus}) \times 100
$$

### EMA 평활화 (α = 0.2)

$$
\text{focusScoreEMA}_t = (1 - 0.2) \cdot \text{focusScoreEMA}_{t-1} + 0.2 \cdot \text{focus}_{0 \sim 100}
$$

> 얼굴/눈이 미감지(`!valid` 또는 `conf < 0.5`)이면 focusScoreEMA를 0으로 즉시 리셋한다.

---

## 10. 상태 분류 (State Machine)

`src/metrics/index.ts`

### 상태 분류 규칙

```
if PERCLOS > 0.5       → drowsy
elif PERCLOS > 0.35    → fatigue
elif focusScore < 83 OR zoneScore < 0.9 OR gazeDevEMA > 0.08 → distract
elif focusScore < 88   → transition
else                   → focus
```

### 상태 확정 (Hysteresis + Hold)

순간적인 오분류를 막기 위해 **2초(30프레임 @ 15fps)** 동안 같은 상태가 유지되어야 전환된다.

```
candidateCount++
if candidateCount >= STATE_HOLD_FRAMES (30):
    currentState = candidateState
else:
    emit "transition"
```

### 레거시 점수 기반 히스테리시스 (`src/state/index.ts`)

구버전 state 모듈에는 점수 임계치 기반 히스테리시스가 남아 있다.

$$
\text{legacyScore} = 100 - \left(0.42 \cdot \text{PERCLOS} + 0.18 \cdot \frac{\text{blinkRate}}{30} + 0.40 \cdot \text{gazeDev}\right) \times 100
$$

| 전환 | 진입 임계 | 탈출 임계 |
|------|----------|----------|
| → focus | 72 | 68 |
| → distract | 50 | 55 |
| → drowsy | 30 | 35 |

---

## 11. 추천 알고리즘 (Recommend)

`src/report/recommend.ts`

최근 28일(4주) 집중 패턴을 분석해 **요일 × 시간대별 Top 3** 추천을 생성한다.

### 데이터 수집

- 28일 내 프레임을 **요일(0~6) × 1시간 슬롯(0~23)** 버킷으로 분류
- 각 버킷에 집중 시간(`focusMs`)과 총 사용 시간(`totalMs`)을 누적
- 어느 주(week)에 데이터가 있었는지 `Set`으로 기록 → `observationCount`

$$
\text{focusRatio} = \frac{\text{focusMs}}{\text{totalMs}}
$$

### 점수 산출

단순 누적 시간 대신 집중 비율까지 반영해, 오래 있었지만 집중 못한 슬롯을 패널티한다.

$$
\text{score} = \text{focusMs} \times \text{focusRatio}
$$

### 신뢰도 보정

데이터가 적은 슬롯(1~2번만 관측)보다 4주 모두 관측된 슬롯을 우선시한다.

$$
\text{confidence} = \min\!\left(\frac{\text{observationCount}}{4},\; 1.0\right)
$$

$$
\text{scoreFinal} = \text{score} \times \text{confidence}
$$

### 필터링 조건

- `totalMs ≥ 30,000ms` (앱을 30초 이상 사용한 슬롯만)
- `observationCount ≥ 1`

### 콜드 스타트 처리

최근 28일 내 날짜 기준 고유 세션 수가 **3회 미만**이면 추천을 보류하고 cold start 메시지를 표시한다.

---

## 12. 리포트 집계

`src/report/aggregate.ts`, `daily.ts`, `weekly.ts`, `monthly.ts`

### 상태별 지속시간 (`sumMinutes`)

연속 프레임 간 시간 차(dt)를 누적하는 방식. 프레임 카운팅과 달리 실제 저장 FPS와 무관하게 정확한 시간을 반환한다.

$$
\text{totalMs} = \sum_{i:\; \text{state}_i = S} \min(\text{ts}_{i+1} - \text{ts}_i,\; 10{,}000\text{ms})
$$

마지막 프레임의 duration 추정: $\Delta t = 1000 / 15 \approx 66.7\text{ms}$

### 총 집중시간 (24h 타임라인 기반)

하루를 1분 버킷(1440개)으로 나눠 각 버킷의 평균 focusScore를 계산한다.  
평균 집중도 ≥ 60점인 버킷을 "집중 1분"으로 인정한다.

$$
\text{focusMs} = \sum_{i=0}^{1439} 60{,}000 \cdot \mathbf{1}\!\left[\bar{s}_i \geq 60\right]
$$

### 평균 집중도 (`avgFocus`)

$$
\overline{\text{focusScore}} = \frac{1}{N}\sum_{i=1}^{N} \text{focusScore}_i
$$

### 리포트 주기

| 리포트 | 범위 | 버킷 단위 |
|--------|------|----------|
| 일간 (24h) | 오늘 00:00 ~ 24:00 | 1분 (1440개) |
| 일간 (1h) | 현재 시각 기준 1시간 | 1분 (60개) |
| 주간 | 최근 7일 | 1일 |
| 월간 | 이번 달 | 1일 |

모든 리포트는 DB를 **1회만** 읽고 메모리 내 필터로 각 구간을 분리한다.



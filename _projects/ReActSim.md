---
title: "ReActSim"
date: 2026-10-26
org: "Meta Global AI Developer Hackathon"
partner: ""
partner_url: ""
partner_logo: ""
partner_color: ""
description: "A physics-grounded embodied AI agent that simulates future actions, detects failures, and autonomously replans robotic manipulation tasks using Meta AI models."
image: "assets/img/projects/ReActSim.png"
status: "done"
category: "hackathon"
tags: [Embodied AI, AI Agent, Robotics, Simulation]
github: "https://github.com/bigse0u1/ReActSim"
demo: ""
---
## Overview

ReActSim은 로봇이 행동하기 전에 물리 시뮬레이션으로 행동 결과를 미리 검증하고, 실행 중 문제가 발생하면 원인을 분석하여 새로운 행동을 계획하는 **Closed-loop Robot Agent** 프로젝트입니다.

기존의 언어 기반 로봇 시스템이 생성된 계획을 그대로 실행하는 방식에 집중했다면, ReActSim은 **Perception → Planning → Imagination → Action → Diagnosis → Replanning** 과정을 반복하여 예기치 못한 환경 변화에도 대응하도록 설계했습니다.

## Key Features

- **Vision-based Perception:** SAM 3.1과 RGB-D 정보를 활용한 객체 인식 및 3D 위치 추정
- **Language-based Planning:** Muse Spark를 활용하여 자연어 명령을 로봇의 행동 계획으로 변환
- **Physics-based Imagination:** ManiSkill 3에서 여러 파지 후보를 사전 시뮬레이션하고 최적의 행동 선택
- **Failure Detection & Recovery:** 물체 미끄러짐, 낙하, 위치 변경 등의 실패를 감지하고 재계획
- **Chaos Mode:** 외부에서 물체를 이동시키거나 충격을 가해 로봇의 적응 능력 평가

## System Architecture

```text
Natural Language Instruction
            ↓
Perception (SAM 3.1 + RGB-D)
            ↓
Planning (Muse Spark)
            ↓
Imagination (Physics Simulation)
            ↓
Action Execution (ManiSkill 3)
            ↓
Failure Diagnosis
            ↓
Success or Replanning
```

## Experimental Results

ManiSkill 3 환경에서 물체를 집어 목표 위치에 배치하는 작업을 수행하고, 외부 충격과 물체 낙하 상황에서 복구 성능을 평가했습니다.

| Method | Success Rate |
|---|---|
| Rule-based Retry | 87.5% (105/120) |
| **Muse Spark + Imagination (Ours)** | **96.7% (116/120)** |

물리 시뮬레이션을 통한 사전 행동 검증이 단순한 재시도 방식보다 높은 작업 성공률을 보였습니다.

## Tech Stack

- **Simulation:** ManiSkill 3
- **Vision:** SAM 3.1, RGB-D
- **LLM:** Muse Spark
- **Robot:** Franka Panda, xArm7 + PSYONIC Ability Hand
- **Motion Planning:** mplib
- **Language:** Python

## Conclusion

ReActSim은 로봇이 단순히 명령을 실행하는 것을 넘어, **행동 결과를 예측하고 실패 원인을 이해하며 스스로 복구하는 Physical AI 시스템**을 목표로 합니다.

현재는 시뮬레이션 환경에서 검증되었으며, 향후 실제 로봇 환경으로 확장하기 위한 기반을 제공합니다.

---
title: "Vesalius Ai"
date: 2026-06-05
description: "A Vision-Language-Action Based Surgical Assistant Robot for Context-Aware Surgical Support"
image: "assets/img/projects/Vesalius_ai.png"
stack: "Robotics · VLA · Python · ROS 2 · VLA · Computer Vision"
status: "ongoing"
tags: [Robotics, VLA, Medical Robot, Computer Vision, ROS 2]
github: ""
demo: ""
---

## 프로젝트 소개

VESALIUS는 Vision-Language-Action(VLA) 기반의 수술 보조 로봇 시스템입니다.
의사의 자연어 명령을 이해하고, 카메라를 통해 수술 환경과 수술 도구를 인식한 뒤, 필요한 도구를 로봇팔로 정확하게 전달하는 것을 목표로 합니다.

본 프로젝트에서는 오픈소스 듀얼암 모바일 로봇인 xLeRobot을 기반으로, 수술 도구 전달 작업을 수행할 수 있는 의료 보조 로봇 형태로 확장하고자 합니다. 단순한 pick-and-place 로봇이 아니라, 시각 정보와 언어 명령을 함께 이해하여 상황에 맞는 행동을 생성하는 지능형 Physical AI 시스템을 지향합니다.

## 기술 스택

- **xLeRobot** — 듀얼암 모바일 로봇 플랫폼
- **Python** — 전체 시스템 제어 및 로봇 동작 로직 구현
- **ROS 2** — 로봇 모듈 간 통신 및 시스템 통합
- **Computer Vision** — 카메라 기반 수술 도구 인식
- **STT** — 의사의 음성 명령을 텍스트로 변환
- **LLM / VLA Model** — 자연어 명령과 시각 정보를 통합하여 행동 생성
- **Imitation Learning** — 도구 전달 동작 데이터 학습

## 핵심 기능

1. 의사의 음성 명령 인식
2. 자연어 명령을 로봇 행동으로 변환
3. 카메라 기반 수술 도구 종류 및 위치 인식
4. 로봇팔을 이용한 수술 도구 pick-and-place
5. 그리퍼를 활용한 메스, 포셉 등 수술 도구 파지
6. Vision-Language-Action 모델 기반 행동 생성
7. 실시간 수술 보조 로봇 시스템 통합

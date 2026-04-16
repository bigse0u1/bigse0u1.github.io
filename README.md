# bigse0u1.github.io

Personal portfolio & blog — pure HTML/CSS/JS, no Jekyll required.

## 구조

```
/
├── index.html              ← 진입점 (SPA)
├── assets/
│   ├── css/main.css        ← 모든 스타일
│   ├── js/main.js          ← SPA 로직 (수정 여기서)
│   └── img/                ← 이미지
├── _posts/                 ← 공부 글 (YYYY-MM-DD-slug.md)
├── _projects/              ← 프로젝트 (slug.md)
├── _data/
│   ├── posts.json          ← 자동 생성 (직접 수정 X)
│   └── projects.json       ← 자동 생성 (직접 수정 X)
├── generate_manifest.py    ← 로컬에서 실행 or GitHub Actions
└── .github/workflows/
    └── deploy.yml          ← push 시 자동으로 manifest 재생성
```

## 글 작성 방법

### 공부 글
`_posts/YYYY-MM-DD-slug.md` 형식으로 작성

```markdown
---
title: "[PyTorch] 1. 기초"
date: 2025-11-01
categories: [PyTorch]
tags: [Machine Learning, Python]
---

내용은 마크다운으로...
```

### 프로젝트
`_projects/프로젝트명.md` 형식으로 작성

```markdown
---
title: "프로젝트 이름"
date: 2025-09-01
description: "한 줄 설명"
image: assets/img/proj.png   ← 선택사항
stack: "TypeScript · React"
github: https://github.com/...
demo: https://...
tags: [TypeScript, React]
---

프로젝트 상세 설명...
```

## 개인정보 수정

`assets/js/main.js` 파일 맨 위 `SITE` 객체를 수정:
- `news` 배열에 수상/논문 소식 추가
- `publications` 배열에 논문 추가
- `education`, `interests` 수정

## 배포

파일을 push하면 GitHub Actions가 자동으로 `_data/*.json`을 재생성합니다.
처음 한 번은 로컬에서 `python generate_manifest.py` 실행 후 commit하세요.

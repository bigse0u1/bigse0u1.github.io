# bigse0u1.github.io

Personal research portfolio & blog — pure HTML/CSS/JS single-page app (no build step, no Jekyll).
Live: https://bigse0u1.github.io

## 페이지 구성

| 탭 | 내용 | 데이터 위치 |
|---|---|---|
| Home | 프로필, News, Education, Experience, Honors & Awards, GitHub 기여 히트맵 | `assets/js/main.js` 상단 `SITE` |
| Publications | 논문 목록 (번호·썸네일·저자·학회·링크, 종류별 필터) | `SITE.publications` |
| Projects | 연도별 프로젝트 목록 + 상세 페이지 | `_projects/*.md` |
| Study | 공부/리뷰 글, 카테고리 사이드바, 태그 중심 그래프, 검색 | `_posts/*.md` |
| Gallery | 학회·행사 사진 (클릭하면 확대, 키보드로 넘기기) | `SITE.gallery` |

그 외: 다크 / 화이트 테마 토글, 모바일 대응, 큰 화면(1800px↑)에서는 UI가 함께 커집니다.

## 구조

```
/
├── index.html              ← 진입점 (SPA)
├── assets/
│   ├── css/main.css        ← 모든 스타일
│   ├── js/main.js          ← 사이트 로직 + SITE 설정 (맨 위)
│   └── img/                ← 이미지 (post/, projects/, gallery/, AWARDS/ …)
├── _posts/                 ← 글 (YYYY-MM-DD-slug.md)
├── _projects/              ← 프로젝트 (slug.md)
├── _data/
│   ├── posts.json          ← 자동 생성 (직접 수정 X)
│   └── projects.json       ← 자동 생성 (직접 수정 X)
├── generate_manifest.py    ← _posts / _projects → _data/*.json
└── .github/workflows/
    └── deploy.yml          ← push 시 manifest 자동 재생성
```

## 글 작성 (Study)

`_posts/YYYY-MM-DD-slug.md`

```markdown
---
title: "[Review] 논문 제목"
date: 2026-10-01 12:00
categories: [Research, Paper Review, Medical AI]   # 대 > 중 > 소 (최대 3단계)
tags: [VLA, Robotics]
description: "목록에 보이는 한 줄 설명"
---

본문은 마크다운으로…
```

- **카테고리**: 1·2단계는 사이드바에 항상 보이고, 2단계를 누르면 3단계가 펼쳐집니다.
- **태그**: Study 그래프에서 큰 노드로 표시되고, 달린 글 수에 따라 커집니다. 태그를 누르면 해당 글만 필터됩니다.

### 본문에서 쓸 수 있는 것

| 기능 | 문법 |
|---|---|
| 수식 (KaTeX) | 인라인 `$a^2$`, 블록 `$$ … $$` (`\( \)`는 지원 안 함) |
| 다이어그램 (Mermaid) | ` ```mermaid ` 코드블록 |
| 데이터 차트 (Chart.js) | ` ```chart ` 코드블록에 Chart.js 설정을 JSON으로 |
| YouTube | ` ```youtube ` 코드블록에 영상 ID 또는 링크 |
| 이미지 | `![설명](assets/img/post/review/xxx.png)` — **사이트 루트 기준** 경로 |
| 코드 | 언어 지정 코드블록 (문법 강조 + 복사 버튼) |

## 프로젝트

`_projects/프로젝트명.md`

```markdown
---
title: "프로젝트 이름"
date: 2026-05-15            # 시작일
end: "2026.12"              # 선택 — 없으면 ongoing은 'Present'로 표시
status: "ongoing"           # ongoing | done
role: "Team Leader"         # 선택
type: "Research Project"    # 선택
org: "기관 / 대회 이름"       # 선택
description: "한 줄 설명"
image: assets/img/projects/xxx.png   # 선택
stack: "Python · RAG"
github: https://github.com/...       # 선택
demo: https://...                    # 선택
tags: [Python, RAG]
---

프로젝트 상세 설명…
```

## 사이트 설정 (`assets/js/main.js` 맨 위 `SITE`)

- `news` — 수상·논문 소식. `{ date, text, org, badge, badgeType, proof }`
- `awards`, `education`, `experience` — 홈 섹션
- `publications` — 논문. 비어 있으면 Publications 탭에 빈 틀이 표시됩니다.
  ```js
  { title, authors: 'Taekyeong Lee*, …', venue, venueUrl, date: '2026/06',
    type: 'Conference', badge: 'Spotlight', image: '', links: { arXiv, Paper, Project, Code } }
  ```
- `gallery` — 행사별 사진. 비어 있으면 Gallery 탭에 빈 틀이 표시됩니다.
  ```js
  { title: 'CVPR 2026', date: '2026.06', location: 'Denver, USA',
    photos: [ { src: 'assets/img/gallery/xxx.jpg', caption: '…' } ] }
  ```
- `cv`, `scholar`, `github`, `linkedin`, `email` — 프로필 아이콘 링크 (값이 없으면 흐리게 비활성)

## 로컬에서 확인

```bash
python3 generate_manifest.py     # _data/*.json 갱신
python3 -m http.server 8000      # http://localhost:8000
```

`index.html`을 직접 열면(`file://`) JSON을 불러오지 못하므로 위처럼 서버로 띄워야 합니다.

## 배포

`main`에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 `python generate_manifest.py`를 실행하고, 바뀐 `_data/*.json`만 `[skip ci]` 커밋으로 올립니다.

> 서버가 만든 커밋이 있을 수 있으니, 작업을 시작하기 전에 `git pull`을 먼저 하세요.

## 사용한 라이브러리 (CDN)

marked · highlight.js · KaTeX · Mermaid · Chart.js · D3 · Giscus(댓글) · GoatCounter(방문 수)

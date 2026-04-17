/* ═══════════════════════════════════════════════
   Site Configuration — edit this section
═══════════════════════════════════════════════ */
const SITE = {
  name: 'Bigse0u1',
  author: 'Taekyeong Lee',
  authorKo: '이태경',
  bio: 'Undergraduate Student in <a href="https://sw.yonsei.ac.kr/" target="_blank">Dept of Software</a>,<br>Yonsei University (Mirae).<br>Research interests in Robotics and VLA.',  avatar: 'assets/img/profile_no_bg.png',
  email: 'lee.bigse0u1@gmail.com',
  github: 'bigse0u1',
  interests: ['Robotics', 'VLA','SLAM', 'Computer Vision'],
  education: [
    { period: '2025.03 ~', school: 'Yonsei University (Mirae)', degree: 'B.S. Department of Software' },
    { period: '2021.03 –\n2025.02', school: 'Changwon National University', degree: 'Dept. of Electrical, Electronic and Control Engineering (Robotics Control and Instrumentation)' }
  ],
  // News: 논문 통과, 수상 등 소식. 없으면 섹션 자체가 안 보임.
  news: [
    { date: '2026.01', text: '<strong>HIRA DATATHON</strong> — 우수상 수상. 주최: 건강보험심사평가원 <a href="assets/img/AWARDS/HIRA_DATATHON.png">[증명]</a>' }
    // 예시: { date: '2026.03', text: 'Paper <strong>XXX</strong> accepted to <strong>CVPR 2026</strong>.' }
  ],
  // Honors & Awards: 수상 목록
  awards: [
    { date: '2026.01.30', title: 'HIRA DATATHON — Excellence Award', organizer: 'HIRA (Health Insurance Review & Assessment Service)', proof: 'assets/img/AWARDS/HIRA_DATATHON.png' }
  ],
  publications: [
    // { title: '', authors: '', venue: '', year: '', image: '', links: { 'paper': '', 'code': '' } }
  ],
  projects_home: [
    {
      period: '2025.09 – 2025.12',
      name: 'FocusMate',
      desc: 'A Real-Time User Attention Evaluation Model Using Integrated Visual Biosignals',
      stack: 'TypeScript · MediaPipe · HTML · CSS',
      github: 'https://github.com/bigse0u1/FOCUS_MATE',
      demo: 'https://yonsei-focusmate.netlify.app/'
    }
  ]
};

/* ═══════════════════════════════════════════════
   Data: posts & projects (loaded from manifest)
   In GitHub Pages we use static JSON manifests
═══════════════════════════════════════════════ */
let POSTS = [];
let PROJECTS = [];

/* ═══════════════════════════════════════════════
   Marked.js for Markdown rendering
═══════════════════════════════════════════════ */
const md = (text) => {
  if (typeof marked === 'undefined') return text;
  return marked.parse(text);
};

/* ═══════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════ */
let state = {
  page: 'home',       // home | projects | study
  detail: null,       // null | { type: 'post'|'project', slug }
  catFilter: '',
  tagFilter: ''
};

/* ═══════════════════════════════════════════════
   ROUTER
═══════════════════════════════════════════════ */
function navigate(page, detail = null) {
  state.page = page;
  state.detail = detail;
  render();

  // update nav active
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  window.scrollTo(0, 0);
}

/* ═══════════════════════════════════════════════
   RENDER — top level
═══════════════════════════════════════════════ */
function render() {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));

  if (state.detail) {
    renderDetail(state.detail);
    document.getElementById('page-detail').classList.add('active');
    return;
  }

  switch (state.page) {
    case 'home':     renderHome();     document.getElementById('page-home').classList.add('active');     break;
    case 'projects': renderProjects(); document.getElementById('page-projects').classList.add('active'); break;
    case 'study':    renderStudy();    document.getElementById('page-study').classList.add('active');    break;
  }
}

/* ═══════════════════════════════════════════════
   HOME
═══════════════════════════════════════════════ */
function renderHome() {
  const el = document.getElementById('home-right');
  el.innerHTML = '';
  el.classList.add('fade-in');

  // 1. Education (제일 위)
  const eduHtml = SITE.education.map(e => `
    <div class="edu-item">
      <div class="edu-period">${e.period.replace(/\n/g,'<br>')}</div>
      <div>
        <div class="edu-school">${e.school}</div>
        <div class="edu-degree">${e.degree}</div>
      </div>
    </div>`).join('');

  el.innerHTML += `
    <div class="section">
      <div class="section-head"><span class="section-title">Education</span></div>
      ${eduHtml}
    </div>`;

  // 2. News — SITE.news에 항목이 있을 때만 표시
  if (SITE.news.length) {
    const newsHtml = SITE.news.map(n => `
      <div class="news-item">
        <div class="news-dot"></div>
        <div class="news-date">${n.date}</div>
        <div class="news-text">${n.text}</div>
      </div>`).join('');

    el.innerHTML += `
      <div class="section">
        <div class="section-head"><span class="section-title">News</span></div>
        <div class="news-timeline">${newsHtml}</div>
      </div>`;
  }

  // 3. Honors & Awards — awards 항목이 있을 때만 표시
  if (SITE.awards && SITE.awards.length) {
    const awardsHtml = SITE.awards.map(a => `
      <div class="edu-item">
        <div class="edu-period">${a.date}</div>
        <div>
          <div class="edu-school">
            ${a.title}
            ${a.proof ? `<a href="${a.proof}" target="_blank" style="font-family:var(--mono);font-size:0.65rem;color:var(--gold);margin-left:0.5rem;border-bottom:1px solid var(--gold-soft)">[증명]</a>` : ''}
          </div>
          <div class="edu-degree">${a.organizer}</div>
        </div>
      </div>`).join('');

    el.innerHTML += `
      <div class="section">
        <div class="section-head"><span class="section-title">Honors & Awards</span></div>
        ${awardsHtml}
      </div>`;
  }

  // 4. Research Interests
  el.innerHTML += `
    <div class="section">
      <div class="section-head"><span class="section-title">Research Interests</span></div>
      <div class="interests">${SITE.interests.map(i => `<span class="interest-chip">${i}</span>`).join('')}</div>
    </div>`;

  // 5. Publications — 있을 때만 표시
  if (SITE.publications.length) {
    const pubHtml = SITE.publications.map(p => `
      <div class="pub-item">
        <div class="pub-thumb">${p.image ? `<img src="${p.image}" alt="${p.title}">` : '◈'}</div>
        <div>
          <div class="pub-title">${p.title}</div>
          <div class="pub-authors">${p.authors}</div>
          <div class="pub-venue">${p.venue}, ${p.year}</div>
          <div class="pub-links">
            ${Object.entries(p.links || {}).map(([k,v]) => `<a href="${v}" target="_blank" class="pub-link">${k}</a>`).join('')}
          </div>
        </div>
      </div>`).join('');

    el.innerHTML += `
      <div class="section">
        <div class="section-head"><span class="section-title">Publications</span></div>
        ${pubHtml}
      </div>`;
  }

  // 6. Projects (home preview)
  const projHtml = SITE.projects_home.map(p => `
    <div class="home-proj-item">
      <div>
        <div class="home-proj-name">${p.name}</div>
        <div class="home-proj-desc">${p.desc}</div>
        <div class="home-proj-stack">${p.stack}</div>
        <div class="home-proj-links">
          ${p.github ? `<a href="${p.github}" target="_blank" class="small-link">GitHub</a>` : ''}
          ${p.demo ? `<a href="${p.demo}" target="_blank" class="small-link">Demo</a>` : ''}
        </div>
      </div>
      <span style="font-family:var(--mono);font-size:0.62rem;color:var(--text-mute);white-space:nowrap">${p.period}</span>
    </div>`).join('');

  el.innerHTML += `
    <div class="section">
      <div class="section-head">
        <span class="section-title">Projects</span>
        <a onclick="navigate('projects')" style="margin-left:auto;font-family:var(--mono);font-size:0.65rem;color:var(--text-mute);cursor:pointer">All →</a>
      </div>
      ${projHtml || '<div style="color:var(--text-mute);font-size:0.82rem">No projects yet.</div>'}
    </div>`;

  document.querySelector('.nav-date').textContent = new Date().toISOString().slice(0,10).replace(/-/g,'.');
}

/* ═══════════════════════════════════════════════
   PROJECTS
═══════════════════════════════════════════════ */
function renderProjects() {
  const el = document.getElementById('proj-grid');
  el.innerHTML = '';
  el.closest('.proj-page-wrap').classList.add('fade-in');

  if (!PROJECTS.length) {
    el.style.background = 'none';
    el.style.border = 'none';
    el.innerHTML = '<div style="padding:3rem;text-align:center;color:var(--text-mute);font-family:var(--mono);font-size:0.8rem">— No projects yet. Add <code>.md</code> files to <code>_projects/</code> —</div>';
    return;
  }

  el.style.background = '';
  el.style.border = '';

  PROJECTS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'proj-card';
    card.onclick = () => navigate('projects', { type: 'project', slug: p.slug });
    card.innerHTML = `
      ${p.image ? `<img src="${p.image}" alt="${p.title}" class="proj-card-img">` : '<div class="proj-card-placeholder">◈</div>'}
      <div class="proj-card-body">
        <div class="proj-card-tags">${(p.tags||[]).slice(0,3).map(t=>`<span class="proj-card-tag">${t}</span>`).join('')}</div>
        <div class="proj-card-title">${p.title}</div>
        <div class="proj-card-desc">${p.description||''}</div>
      </div>`;
    el.appendChild(card);
  });
}

/* ═══════════════════════════════════════════════
   STUDY
═══════════════════════════════════════════════ */
function renderStudy() {
  renderSidebar();
  renderPostsList();
  renderTagBar();
  document.getElementById('page-study').classList.add('fade-in');
}

function renderSidebar() {
  const nav = document.getElementById('sidebar-cats');
  nav.innerHTML = '';

  // All
  const allEl = document.createElement('div');
  allEl.className = 'sb-link' + (state.catFilter === '' ? ' active' : '');
  allEl.innerHTML = `All <span class="sb-cnt">${POSTS.length}</span>`;
  allEl.onclick = () => { state.catFilter = ''; state.tagFilter = ''; renderStudy(); };
  nav.appendChild(allEl);

  // Categories
  const cats = {};
  POSTS.forEach(p => (p.categories||[]).forEach(c => cats[c] = (cats[c]||0)+1));
  Object.entries(cats).sort().forEach(([cat, cnt]) => {
    const el = document.createElement('div');
    el.className = 'sb-link' + (state.catFilter === cat ? ' active' : '');
    el.innerHTML = `${cat} <span class="sb-cnt">${cnt}</span>`;
    el.onclick = () => { state.catFilter = cat; state.tagFilter = ''; renderStudy(); };
    nav.appendChild(el);
  });
}

function renderTagBar() {
  const bar = document.getElementById('tag-bar');
  bar.innerHTML = '<span class="tag-label">TAG:</span>';

  const allBtn = document.createElement('button');
  allBtn.className = 'tag-btn' + (state.tagFilter === '' ? ' active' : '');
  allBtn.textContent = 'All';
  allBtn.onclick = () => { state.tagFilter = ''; renderStudy(); };
  bar.appendChild(allBtn);

  const tags = {};
  POSTS.forEach(p => (p.tags||[]).forEach(t => tags[t] = (tags[t]||0)+1));
  Object.entries(tags).sort().forEach(([tag]) => {
    const btn = document.createElement('button');
    btn.className = 'tag-btn' + (state.tagFilter === tag ? ' active' : '');
    btn.textContent = tag;
    btn.onclick = () => { state.tagFilter = tag; renderStudy(); };
    bar.appendChild(btn);
  });
}

function renderPostsList() {
  const el = document.getElementById('posts-list');
  el.innerHTML = '';

  let filtered = POSTS;
  if (state.catFilter) filtered = filtered.filter(p => (p.categories||[]).includes(state.catFilter));
  if (state.tagFilter) filtered = filtered.filter(p => (p.tags||[]).includes(state.tagFilter));

  if (!filtered.length) {
    el.innerHTML = '<div style="padding:3rem 0;text-align:center;color:var(--text-mute);font-family:var(--mono);font-size:0.8rem">— 해당하는 글이 없습니다 —</div>';
    return;
  }

  filtered.forEach(post => {
    const row = document.createElement('div');
    row.className = 'post-row';
    row.onclick = () => navigate('study', { type: 'post', slug: post.slug });
    row.innerHTML = `
      <div>
        <div class="post-title">${post.title}</div>
        ${post.excerpt ? `<div class="post-excerpt">${post.excerpt}</div>` : ''}
        <div class="post-tags">${(post.tags||[]).map(t=>`<span class="post-tag" onclick="event.stopPropagation();filterTag('${t}')">${t}</span>`).join('')}</div>
      </div>
      <div class="post-date">${post.date}</div>`;
    el.appendChild(row);
  });
}

function filterTag(tag) {
  state.tagFilter = tag;
  renderStudy();
}

/* ═══════════════════════════════════════════════
   DETAIL — Post / Project
═══════════════════════════════════════════════ */
async function renderDetail(detail) {
  const el = document.getElementById('page-detail');
  el.classList.add('fade-in');

  let item;
  if (detail.type === 'post') {
    item = POSTS.find(p => p.slug === detail.slug);
  } else {
    item = PROJECTS.find(p => p.slug === detail.slug);
  }

  if (!item) {
    el.innerHTML = '<div style="padding:3rem;text-align:center;color:var(--text-mute)">Not found</div>';
    return;
  }

  // Fetch markdown content
  let bodyHtml = '';
  if (item.path) {
    try {
      const res = await fetch(item.path);
      const raw = await res.text();
      // Strip front matter
      const content = raw.replace(/^---[\s\S]+?---\n/, '');
      bodyHtml = md(content);
    } catch(e) {
      bodyHtml = '<p style="color:var(--text-mute)">콘텐츠를 불러올 수 없습니다.</p>';
    }
  }

  const catLabel = detail.type === 'post'
    ? (item.categories||[]).join(' · ')
    : 'Project';

  const metaExtra = detail.type === 'project' && item.stack
    ? `<span style="font-family:var(--mono);font-size:0.68rem;color:var(--gold)">${item.stack}</span>` : '';

  const links = detail.type === 'project'
    ? `<div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.8rem">
        ${item.github ? `<a href="${item.github}" target="_blank" class="small-link">⌥ GitHub</a>` : ''}
        ${item.demo ? `<a href="${item.demo}" target="_blank" class="small-link">↗ Demo</a>` : ''}
       </div>` : '';

  const tagsHtml = (item.tags||[]).length
    ? `<div style="display:flex;gap:0.3rem;flex-wrap:wrap;margin-top:0.5rem">
        ${item.tags.map(t=>`<span class="post-tag">${t}</span>`).join('')}
       </div>` : '';

  const backPage = detail.type === 'post' ? 'study' : 'projects';
  const backLabel = detail.type === 'post' ? '← Study 목록' : '← Projects 목록';

  el.innerHTML = `
    <div class="detail-wrap">
      <div>
        <div class="detail-back" onclick="navigate('${backPage}')">${backLabel}</div>
        <header class="detail-header">
          ${catLabel ? `<div class="detail-cat">${catLabel}</div>` : ''}
          <h1 class="detail-title">${item.title}</h1>
          <div class="detail-meta">
            <span class="detail-date">${item.date || ''}</span>
            ${metaExtra}
          </div>
          ${links}
          ${tagsHtml}
        </header>
        <div class="detail-body">${bodyHtml}</div>
        <nav style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:3rem;padding-top:1.5rem;border-top:1px solid var(--border)">
        </nav>
      </div>
      <aside class="toc-panel">
        <div class="toc-label">Contents</div>
        <ul class="toc-list" id="toc-list"></ul>
      </aside>
    </div>`;

  buildTOC();
  // Syntax highlight
  if (typeof hljs !== 'undefined') {
    el.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
  }
}

/* ═══════════════════════════════════════════════
   TOC
═══════════════════════════════════════════════ */
function buildTOC() {
  const list = document.getElementById('toc-list');
  if (!list) return;
  const headings = document.querySelectorAll('.detail-body h2, .detail-body h3');
  if (!headings.length) { list.closest('aside').style.display = 'none'; return; }

  headings.forEach((h, i) => {
    if (!h.id) h.id = 'h-' + i;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    if (h.tagName === 'H3') a.classList.add('toc-h3');
    a.addEventListener('click', e => {
      e.preventDefault();
      h.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    li.appendChild(a);
    list.appendChild(li);
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const a = list.querySelector(`a[href="#${entry.target.id}"]`);
      if (a) a.classList.toggle('active', entry.isIntersecting);
    });
  }, { rootMargin: '-10% 0px -80% 0px' });

  headings.forEach(h => obs.observe(h));
}

/* ═══════════════════════════════════════════════
   LOAD DATA — reads manifest JSONs
═══════════════════════════════════════════════ */
async function loadData() {
  try {
    const [postsRes, projRes] = await Promise.all([
      fetch('_data/posts.json').catch(() => null),
      fetch('_data/projects.json').catch(() => null)
    ]);

    if (postsRes && postsRes.ok) POSTS = await postsRes.json();
    if (projRes  && projRes.ok)  PROJECTS = await projRes.json();
  } catch(e) {
    console.warn('Data load failed, using defaults');
  }
}

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
async function init() {
  // Profile left col
  const left = document.getElementById('home-left');
  left.innerHTML = `
    <div class="profile-photo-wrap">
      <img src="${SITE.avatar}" alt="${SITE.author}" class="profile-photo" onerror="this.style.display='none'">
    </div>
    <h1 class="profile-name">${SITE.authorKo}</h1>
    <div class="profile-name-en">${SITE.name}</div>
    <p class="profile-bio">${SITE.bio}</p>
    <div class="profile-links">
      <a href="mailto:${SITE.email}" class="profile-link">
        <span class="profile-link-icon">✉</span>${SITE.email}
      </a>
      <a href="https://github.com/${SITE.github}" target="_blank" class="profile-link">
        <span class="profile-link-icon">⌥</span>github/${SITE.github}
      </a>
    </div>`;

  // Nav event listeners
  document.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => navigate(l.dataset.page));
  });

  // Load data then render
  await loadData();
  render();
}

document.addEventListener('DOMContentLoaded', init);
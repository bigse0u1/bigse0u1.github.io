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
  linkedin: 'https://www.linkedin.com/in/taekyeong-lee-70269b364/',
  scholar: '',
  intro: 'Hi, I\'m Taekyeong Lee.<br>Undergraduate Student in Dept of Software, Yonsei University (Mirae).<br>I\'m passionate about Robotics and VLA — teaching machines to see, think, and move.',
  education: [
    { period: '2025.03 ~', school: 'Yonsei University (Mirae)', degree: 'B.S. Department of Software', logo: 'assets/img/logo/yonsei.svg' },
    { period: '2021.03 –\n2025.02', school: 'Changwon National University', degree: 'Dept. of Electrical, Electronic and Control Engineering (Robotics Control and Instrumentation)', logo: 'assets/img/logo/Changwon.svg' }
  ],
  // News: 논문 통과, 수상 등 소식. 없으면 섹션 자체가 안 보임.
  news: [
    { date: '2026.01', text: '<strong>HIRA DATATHON</strong> — Excellence Award. HIRA (Health Insurance Review & Assessment Service) <a href="assets/img/AWARDS/HIRA_DATATHON.png">[proof]</a>' }
    // 예시: { date: '2026.03', text: 'Paper <strong>XXX</strong> accepted to <strong>CVPR 2026</strong>.' }
  ],
  // Honors & Awards: 수상 목록
  awards: [
    { date: '2026.01.30', title: 'HIRA DATATHON — Excellence Award', organizer: 'HIRA (Health Insurance Review & Assessment Service)', proof: 'assets/img/AWARDS/HIRA_DATATHON.png' }
  ],
  experience: [
    {
      period: '2026.03 ~',
      lab: 'Scientific Discovery Lab',
      labUrl: 'https://sd-lab-page.github.io/',
      affiliation: 'Yonsei University (Mirae)',
      role: 'Undergraduate Research Intern',
      topics: ['VLA', 'Robotics'],
      advisor: 'Prof. Dong-Hee Shin'
    }
  ],
  publications: [
    // { title: '', authors: '', venue: '', year: '', image: '', links: { 'paper': '', 'code': '' } }
  ],
  projects_home: [
    {
      period: '2026.06 – ',
      name: 'Vesalius Ai',
      status: 'ongoing',
      desc: 'A Vision-Language-Action Based Surgical Assistant Robot',
      stack: 'Robotics · VLA · Python · ROS 2 · VLA · Computer Vision',
      image: 'assets/img/projects/Vesalius_ai.png',
      github: '',
      demo: ''
    },
    {
      period: '2025.09 – 2025.12',
      name: 'FocusMate',
      status: 'done',
      desc: 'A Real-Time User Attention Evaluation Model Using Integrated Visual Biosignals',
      stack: 'TypeScript · MediaPipe · HTML · CSS',
      image: 'assets/img/projects/focusmate.png',
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

  // Protect math from marked.js before parsing
  const stored = [];
  const store = m => { stored.push(m); return `QQMATH${stored.length - 1}QQ`; };
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, store);
  text = text.replace(/\$([^\n$]+?)\$/g, store);

  let html = marked.parse(text);

  // Restore math
  html = html.replace(/QQMATH(\d+)QQ/g, (_, i) => stored[+i]);
  return html;
};

/* ═══════════════════════════════════════════════
   STATE
═══════════════════════════════════════════════ */
let state = {
  page: 'home',       // home | projects | study
  detail: null,       // null | { type: 'post'|'project', slug }
  catFilter: '',
  tagFilter: '',
  searchQuery: '',
  expandedCats: new Set()
};

/* ═══════════════════════════════════════════════
   ROUTER
═══════════════════════════════════════════════ */
function navigate(page, detail = null) {
  if (!detail && page !== state.page) {
    state.catFilter = '';
    state.tagFilter = '';
    state.searchQuery = '';
  }
  state.page = page;
  state.detail = detail;
  updateHash();
  render();

  if (window.goatcounter && window.goatcounter.count) {
    window.goatcounter.count({ path: location.pathname + location.hash });
  }

  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === page);
  });

  window.scrollTo(0, 0);
}

function updateHash() {
  let hash = '';
  if (state.detail) {
    hash = `#${state.detail.type}/${encodeURIComponent(state.detail.slug)}`;
  } else {
    switch (state.page) {
      case 'projects': hash = '#projects'; break;
      case 'study':
        hash = '#study';
        if (state.catFilter) hash += '/' + encodeURIComponent(state.catFilter);
        break;
      default: hash = '';
    }
  }
  history.pushState(null, '', location.pathname + hash);
}

function routeFromHash() {
  const hash = location.hash;
  state.detail = null;

  if (!hash || hash === '#') {
    state.page = 'home';
    state.catFilter = '';
    state.tagFilter = '';
    state.searchQuery = '';
  } else if (hash === '#projects') {
    state.page = 'projects';
  } else if (hash.startsWith('#study')) {
    state.page = 'study';
    const rest = hash.slice(6);
    state.catFilter = rest.startsWith('/') ? decodeURIComponent(rest.slice(1)) : '';
    state.tagFilter = '';
  } else if (hash.startsWith('#post/')) {
    state.detail = { type: 'post', slug: decodeURIComponent(hash.slice(6)) };
  } else if (hash.startsWith('#project/')) {
    state.detail = { type: 'project', slug: decodeURIComponent(hash.slice(9)) };
  } else {
    state.page = 'home';
  }

  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === state.page);
  });

  render();
}

function setCategoryFilter(cat) {
  state.catFilter = cat;
  state.tagFilter = '';
  updateHash();
  renderStudy();
}

/* ═══════════════════════════════════════════════
   RENDER — top level
═══════════════════════════════════════════════ */
function render() {
  const pages = document.querySelectorAll('.page');
  pages.forEach(p => p.classList.remove('active'));

  const prog = document.getElementById('scroll-progress');
  const showProg = !!(state.detail && state.detail.type === 'post');
  prog.classList.toggle('visible', showProg);
  if (!showProg) prog.style.width = '0%';

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

  // 1. About
  el.innerHTML += `
    <div class="section">
      <div class="section-head"><span class="section-title">About</span></div>
      <p style="font-size:0.88rem;color:var(--text-soft);line-height:1.85;padding-left:2.8rem;">${SITE.intro}</p>
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

  // 3. Education
  const eduHtml = SITE.education.map(e => `
    <div class="edu-item">
      <div class="edu-period">${e.period.replace(/\n/g,'<br>')}</div>
      <div class="edu-body">
        ${e.logo ? `<img src="${e.logo}" class="edu-logo" alt="${e.school}">` : ''}
        <div>
          <div class="edu-school">${e.school}</div>
          <div class="edu-degree">${e.degree}</div>
        </div>
      </div>
    </div>`).join('');

  el.innerHTML += `
    <div class="section">
      <div class="section-head"><span class="section-title">Education</span></div>
      ${eduHtml}
    </div>`;

  // 4. Experience
  if (SITE.experience && SITE.experience.length) {
    const expHtml = SITE.experience.map(e => `
      <div class="edu-item">
        <div class="edu-period">${e.period}</div>
        <div>
          <div class="edu-school">
            <a href="${e.labUrl}" target="_blank" style="color:var(--text);border-bottom:1px solid var(--border-soft);transition:border-color 150ms" onmouseover="this.style.borderColor='var(--gold)'" onmouseout="this.style.borderColor='var(--border-soft)'">${e.lab}</a>,&nbsp;${e.affiliation}
          </div>
          <div class="edu-degree">${e.role}</div>
          <div class="edu-degree" style="margin-top:0.3rem">• Advisor: ${e.advisor}</div>
          <div class="home-proj-stack" style="margin-top:0.4rem">${e.topics.join(' · ')}</div>
        </div>
      </div>`).join('');

    el.innerHTML += `
      <div class="section">
        <div class="section-head"><span class="section-title">Experience</span></div>
        ${expHtml}
      </div>`;
  }

  // 6. Honors & Awards — awards 항목이 있을 때만 표시
  if (SITE.awards && SITE.awards.length) {
    const awardsHtml = SITE.awards.map(a => `
      <div class="edu-item">
        <div class="edu-period">${a.date}</div>
        <div>
          <div class="edu-school">
            ${a.title}
            ${a.proof ? `<a href="${a.proof}" target="_blank" style="font-family:var(--mono);font-size:0.65rem;color:var(--gold);margin-left:0.5rem;border-bottom:1px solid var(--gold-soft)">[proof]</a>` : ''}
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
      <div class="edu-period">${p.period}</div>
      <div style="display:flex;gap:0.9rem;align-items:flex-start">
        ${p.image ? `<img src="${p.image}" class="home-proj-thumb" alt="${p.name}">` : ''}
        <div>
          <div class="home-proj-name">
            ${p.name}
            ${p.status === 'ongoing'
              ? '<span class="proj-status proj-status-ongoing">In Progress</span>'
              : p.status === 'done'
              ? '<span class="proj-status proj-status-done">Done</span>'
              : ''}
          </div>
          <div class="home-proj-desc">${p.desc}</div>
          <div class="home-proj-stack">${p.stack}</div>
          <div class="home-proj-links">
            ${p.github ? `<a href="${p.github}" target="_blank" class="small-link">GitHub</a>` : ''}
            ${p.demo ? `<a href="${p.demo}" target="_blank" class="small-link">Demo</a>` : ''}
          </div>
        </div>
      </div>
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
        <div class="proj-card-title">
          ${p.title}
          ${p.status === 'ongoing' ? '<span class="proj-status proj-status-ongoing">In Progress</span>' : p.status === 'done' ? '<span class="proj-status proj-status-done">Done</span>' : ''}
        </div>
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
  const si = document.getElementById('search-input');
  if (si) si.value = state.searchQuery;
  renderTagBar();
  renderPostsList();
  document.getElementById('page-study').classList.add('fade-in');
}

function renderSidebar() {
  const nav = document.getElementById('sidebar-cats');
  nav.innerHTML = '';

  // All
  const allEl = document.createElement('div');
  allEl.className = 'sb-link' + (state.catFilter === '' ? ' active' : '');
  allEl.innerHTML = `All <span class="sb-cnt">${POSTS.length}</span>`;
  allEl.onclick = () => setCategoryFilter('');
  nav.appendChild(allEl);

  // Build parent → sub hierarchy (categories[0] = parent, categories[1] = sub)
  const tree = {};
  POSTS.forEach(p => {
    const [parent, sub] = p.categories || [];
    if (!parent) return;
    if (!tree[parent]) tree[parent] = { count: 0, subs: {} };
    tree[parent].count++;
    if (sub) tree[parent].subs[sub] = (tree[parent].subs[sub] || 0) + 1;
  });

  Object.entries(tree).sort().forEach(([parent, data]) => {
    const hasSubs = Object.keys(data.subs).length > 0;
    const isExpanded = state.expandedCats.has(parent);

    const parentEl = document.createElement('div');
    parentEl.className = 'sb-link' + (state.catFilter === parent ? ' active' : '');
    parentEl.innerHTML = `${hasSubs ? `<span class="sb-arrow">${isExpanded ? '▾' : '▸'}</span>` : ''}${parent} <span class="sb-cnt">${data.count}</span>`;
    parentEl.onclick = () => {
      if (hasSubs) {
        if (state.expandedCats.has(parent)) state.expandedCats.delete(parent);
        else state.expandedCats.add(parent);
      }
      setCategoryFilter(parent);
    };
    nav.appendChild(parentEl);

    if (hasSubs && isExpanded) {
      Object.entries(data.subs).sort().forEach(([sub, cnt]) => {
        const subEl = document.createElement('div');
        subEl.className = 'sb-link sb-sub' + (state.catFilter === sub ? ' active' : '');
        subEl.innerHTML = `ㄴ ${sub} <span class="sb-cnt">${cnt}</span>`;
        subEl.onclick = (e) => { e.stopPropagation(); setCategoryFilter(sub); };
        nav.appendChild(subEl);
      });
    }
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

  const tagPosts = state.catFilter
    ? POSTS.filter(p => (p.categories||[]).includes(state.catFilter))
    : POSTS;
  const tags = {};
  tagPosts.forEach(p => (p.tags||[]).forEach(t => tags[t] = (tags[t]||0)+1));
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
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) || (p.excerpt||'').toLowerCase().includes(q)
    );
  }

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
        ${post.description ? `<div class="post-excerpt">${post.description}</div>` : ''}
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

  let prevNextHtml = '';
  if (detail.type === 'post') {
    const idx = POSTS.findIndex(p => p.slug === detail.slug);
    const prev = idx < POSTS.length - 1 ? POSTS[idx + 1] : null;
    const next = idx > 0 ? POSTS[idx - 1] : null;
    prevNextHtml = `
      <div class="post-nav">
        <div>${prev ? `<div class="post-nav-btn" onclick="navigate('study',{type:'post',slug:'${prev.slug}'})">
          <div class="post-nav-label">← PREV</div>
          <div class="post-nav-title">${prev.title}</div>
        </div>` : ''}</div>
        <div>${next ? `<div class="post-nav-btn next" onclick="navigate('study',{type:'post',slug:'${next.slug}'})">
          <div class="post-nav-label">NEXT →</div>
          <div class="post-nav-title">${next.title}</div>
        </div>` : ''}</div>
      </div>`;
  }

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
        <div class="giscus-wrap"></div>
        ${prevNextHtml}
      </div>
      <aside class="toc-panel">
        <div class="toc-label">Contents</div>
        <ul class="toc-list" id="toc-list"></ul>
      </aside>
    </div>`;

  buildTOC();
  if (typeof hljs !== 'undefined') {
    el.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
  }
  addCopyButtons(el);

  // Render math with KaTeX
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(el.querySelector('.detail-body'), {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$',  right: '$',  display: false }
      ],
      throwOnError: false
    });
  }

  {
    const wrap = el.querySelector('.giscus-wrap');
    const s = document.createElement('script');
    s.src = 'https://giscus.app/client.js';
    s.setAttribute('data-repo', 'bigse0u1/bigse0u1.github.io');
    s.setAttribute('data-repo-id', 'R_kgDOSEgXfA');
    s.setAttribute('data-category', 'Announcements');
    s.setAttribute('data-category-id', 'DIC_kwDOSEgXfM4C9Igl');
    s.setAttribute('data-mapping', 'specific');
    s.setAttribute('data-term', item.title);
    s.setAttribute('data-strict', '0');
    s.setAttribute('data-reactions-enabled', '1');
    s.setAttribute('data-emit-metadata', '0');
    s.setAttribute('data-input-position', 'bottom');
    s.setAttribute('data-theme', 'dark');
    s.setAttribute('data-lang', 'ko');
    s.crossOrigin = 'anonymous';
    s.async = true;
    wrap.appendChild(s);
  }
}

function addCopyButtons(container) {
  container.querySelectorAll('.detail-body pre').forEach(pre => {
    const wrap = document.createElement('div');
    wrap.className = 'code-wrap';

    const codeEl = pre.querySelector('code');
    const langClass = codeEl ? [...codeEl.classList].find(c => c.startsWith('language-')) : null;
    const lang = langClass ? langClass.replace('language-', '') : '';

    const header = document.createElement('div');
    header.className = 'code-header';
    header.innerHTML = `
      <div style="display:flex;align-items:center">
        <div class="code-dots">
          <span class="code-dot"></span>
          <span class="code-dot"></span>
          <span class="code-dot"></span>
        </div>
        <span class="code-lang">${lang}</span>
      </div>
      <button class="code-copy-btn">copy</button>`;

    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(header);
    wrap.appendChild(pre);

    header.querySelector('.code-copy-btn').addEventListener('click', () => {
      const text = (pre.querySelector('code') || pre).textContent;
      navigator.clipboard.writeText(text).then(() => {
        const btn = header.querySelector('.code-copy-btn');
        btn.textContent = 'copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'copy'; btn.classList.remove('copied'); }, 1500);
      });
    });
  });
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
   VISITOR COUNT — GoatCounter
═══════════════════════════════════════════════ */
async function loadVisitorCount() {
  const el = document.querySelector('.nav-visitor');
  if (!el) return;

  const base = 'https://bigse0u1.goatcounter.com/api/v0';
  const headers = { 'Authorization': 'Bearer pm9ipzzoy95m20ydzeyiol8mvbeukily7doeaazkw6pg5eyj8' };
  const today = new Date().toISOString().slice(0, 10);

  try {
    const [todayRes, totalRes] = await Promise.all([
      fetch(`${base}/stats/hits?start=${today}&end=${today}&limit=200`, { headers }),
      fetch(`${base}/stats/hits?start=2020-01-01&end=${today}&limit=200`, { headers })
    ]);
    const todayData = await todayRes.json();
    const totalData = await totalRes.json();
    const todayCount = (todayData.hits || []).reduce((s, h) => s + h.count, 0);
    const totalCount = (totalData.hits || []).reduce((s, h) => s + h.count, 0);
    el.textContent = `today ${todayCount}  ·  total ${totalCount}`;
  } catch {
    el.textContent = '';
  }
}

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
async function init() {
  // Restore hash if returning from giscus OAuth redirect
  if (location.search.includes('giscus=')) {
    const saved = sessionStorage.getItem('giscus_return_hash');
    if (saved) {
      sessionStorage.removeItem('giscus_return_hash');
      history.replaceState(null, '', location.pathname + location.search + saved);
    }
  }

  // Profile left col
  const left = document.getElementById('home-left');
  left.innerHTML = `
    <div class="profile-photo-wrap">
      <img src="${SITE.avatar}" alt="${SITE.author}" class="profile-photo" onerror="this.style.display='none'">
    </div>
    <h1 class="profile-name">${SITE.author}</h1>
    <div class="profile-name-en">${SITE.name}</div>
    <div class="profile-links">
      <a href="mailto:${SITE.email}" class="profile-btn">
        <span class="profile-link-icon">✉</span>Email
      </a>
      <a href="https://github.com/${SITE.github}" target="_blank" class="profile-btn">
        <span class="profile-link-icon">⌥</span>GitHub
      </a>
      <a href="${SITE.linkedin}" target="_blank" class="profile-btn">
        <span class="profile-link-icon">in</span>LinkedIn
      </a>
      <a class="profile-btn ${SITE.scholar ? '' : 'profile-btn-disabled'}" ${SITE.scholar ? `href="${SITE.scholar}" target="_blank"` : ''}>
        <span class="profile-link-icon">𝒢</span>Google Scholar
      </a>
    </div>`;

  // Nav event listeners
  document.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => navigate(l.dataset.page));
  });

  // Load data then render based on current hash
  await loadData();
  loadVisitorCount();

  document.getElementById('search-input').addEventListener('input', e => {
    state.searchQuery = e.target.value;
    renderPostsList();
  });

  // Save hash before OAuth redirect (giscus)
  window.addEventListener('beforeunload', () => {
    if (location.hash && location.hash !== '#') {
      sessionStorage.setItem('giscus_return_hash', location.hash);
    }
  });

  window.addEventListener('scroll', () => {
    const prog = document.getElementById('scroll-progress');
    if (!prog.classList.contains('visible')) return;
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    prog.style.width = Math.min(pct, 100) + '%';
  });

  window.addEventListener('popstate', routeFromHash);
  routeFromHash();
}

document.addEventListener('DOMContentLoaded', init);
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
  cv: '',   // 예: 'assets/cv/Taekyeong_Lee_CV.pdf' — 비워두면 아이콘이 흐리게 비활성
  intro: 'Hi, I\'m Taekyeong Lee.<br>Undergraduate Student in Dept of Software, Yonsei University (Mirae).<br>I\'m passionate about Robotics and VLA — teaching machines to see, think, and move.',
  education: [
    { period: '2025.03 ~', school: 'Yonsei University (Mirae)', degree: 'B.S. Department of Software', logo: 'assets/img/logo/yonsei.svg' },
    { period: '2021.03 –\n2025.02', school: 'Changwon National University', degree: 'Dept. of Electrical, Electronic and Control Engineering (Robotics Control and Instrumentation)', logo: 'assets/img/logo/Changwon.svg' }
  ],
  // News: 논문 통과, 수상 등 소식. text는 짧게, 받은 곳(기관)은 org에 따로 적기.
  // badgeType: award(초록) | scholarship(보라) | talk(파랑) | publication(금색) | note(회색, 기본값)
  // proof: 증빙 이미지/PDF 있으면 경로 적기 (선택)
  news: [
    { date: '2026.08', text: 'Received the <strong>Academic Excellence Scholarship</strong>!', org: 'Yonsei University', badge: 'Scholarship', badgeType: 'scholarship' },
    { date: '2026.01', text: 'Won the <strong>Excellence Award</strong> at the HIRA DATATHON!', org: 'Health Insurance Review & Assessment Service', badge: 'Award', badgeType: 'award', proof: 'assets/img/AWARDS/HIRA_DATATHON.png' }
    // 예시: { date: '2026.03', text: 'Our paper <strong>XXX</strong> was accepted!', org: 'CVPR 2026', badge: 'Publication', badgeType: 'publication' }
    // 예시: { date: '2026.03', text: 'Presented <strong>XXX</strong> as a poster!', org: 'CVPR 2026', badge: 'Talk', badgeType: 'talk' }
  ],
  // Honors & Awards: 수상 목록
  awards: [
    { date: '2026.08.21', title: 'Academic Excellence Scholarship', organizer: 'Yonsei University' },
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
  // Gallery: 학회/행사별 사진. 사진 파일은 assets/img/gallery/ 에 넣기
  gallery: [
    // { title: 'CVPR 2026', date: '2026.06', location: 'Denver, USA', description: '', photos: [ { src: 'assets/img/gallery/cvpr2026-01.jpg', caption: 'Poster session' } ] }
  ],
  publications: [
    // { title: '', authors: 'Taekyeong Lee*, Co Author', venue: 'CVPR Findings', venueUrl: '', date: '2026/06',
    //   type: 'Conference',            // Conference | Journal | Preprint …  (종류가 2개 이상이면 필터가 생김)
    //   badge: 'Spotlight',            // 선택
    //   image: '',                     // 선택 (썸네일)
    //   links: { arXiv: '', Paper: '', Project: '', Code: '' } }
  ],
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
  page: 'home',       // home | papers | projects | study | gallery
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
      case 'papers': hash = '#papers'; break;
      case 'gallery': hash = '#gallery'; break;
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
  } else if (hash === '#papers') {
    state.page = 'papers';
  } else if (hash === '#gallery') {
    state.page = 'gallery';
  } else if (hash.startsWith('#study')) {
    state.page = 'study';
    const rest = hash.slice(6);
    state.catFilter = rest.startsWith('/') ? decodeURIComponent(rest.slice(1)) : '';
    state.tagFilter = '';
  } else if (hash.startsWith('#post/')) {
    state.page = 'study';
    state.detail = { type: 'post', slug: decodeURIComponent(hash.slice(6)) };
  } else if (hash.startsWith('#project/')) {
    state.page = 'projects';
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
    case 'papers':   renderPapers();   document.getElementById('page-papers').classList.add('active');   break;
    case 'gallery':  renderGallery();  document.getElementById('page-gallery').classList.add('active');  break;
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
        <div class="news-date">${n.date}</div>
        <div class="news-content">
          <div class="news-text">${n.text}</div>
          ${n.org ? `<div class="news-org">${n.org}</div>` : ''}
        </div>
        <div class="news-side">
          ${n.badge ? `<div class="news-badge news-badge-${n.badgeType || 'note'}">${n.badge}</div>` : ''}
          ${n.proof ? `<a href="${n.proof}" target="_blank" class="news-proof">PDF</a>` : ''}
        </div>
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
            <a href="${e.labUrl}" target="_blank" style="color:var(--text);border-bottom:1px solid var(--border-soft);transition:border-color 150ms" onmouseover="this.style.borderColor='var(--vermillion)'" onmouseout="this.style.borderColor='var(--border-soft)'">${e.lab}</a>,&nbsp;${e.affiliation}
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
            ${a.proof ? `<a href="${a.proof}" target="_blank" style="font-family:var(--mono);font-size:0.65rem;color:var(--vermillion);margin-left:0.5rem;border-bottom:1px solid rgba(var(--accent-rgb),0.3)">[proof]</a>` : ''}
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

  // Publications now live on their own tab — see renderPapers()

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
    el.innerHTML = '<div style="padding:3rem;text-align:center;color:var(--text-mute);font-family:var(--mono);font-size:0.8rem">— No projects yet. Add <code>.md</code> files to <code>_projects/</code> —</div>';
    return;
  }

  const ym = d => (d || '').slice(0, 7).replace('-', '.');
  const period = p => {
    const start = ym(p.date);
    if (p.end) return `${start} – ${p.end}`;
    return p.status === 'ongoing' ? `${start} – Present` : start;
  };

  // Newest first; ongoing projects lead within the same year
  const sorted = [...PROJECTS].sort((a, b) => {
    const ao = a.status === 'ongoing' ? 0 : 1, bo = b.status === 'ongoing' ? 0 : 1;
    return ao - bo || (b.date || '').localeCompare(a.date || '');
  });

  const byYear = new Map();
  sorted.forEach(p => {
    const year = (p.date || '').slice(0, 4) || 'Unknown';
    if (!byYear.has(year)) byYear.set(year, []);
    byYear.get(year).push(p);
  });

  el.innerHTML = [...byYear.keys()].sort((a, b) => b.localeCompare(a)).map(year => `
    <section class="proj-year-section">
      <div class="proj-year-heading">${year}</div>
      ${byYear.get(year).map(p => `
        <article class="pj-item" data-slug="${p.slug}">
          ${p.image ? `<div class="pj-media"><img src="${p.image}" alt="${p.title}" loading="lazy"></div>` : ''}
          <div class="pj-body">
            <div class="pj-meta">
              <span class="pj-period">${period(p)}</span>
              ${p.status === 'ongoing' ? '<span class="proj-status proj-status-ongoing">In Progress</span>' : p.status === 'done' ? '<span class="proj-status proj-status-done">Done</span>' : ''}
              ${p.role ? `<span class="pj-chip">${p.role}</span>` : ''}
              ${p.type ? `<span class="pj-chip">${p.type}</span>` : ''}
            </div>
            <h3 class="pj-title">${p.title}</h3>
            ${p.org ? `<div class="pj-org">${p.org}</div>` : ''}
            ${p.description ? `<p class="pj-desc">${p.description}</p>` : ''}
            ${p.stack ? `<div class="pj-stack">${p.stack}</div>` : ''}
            <div class="pj-links">
              ${p.github ? `<a href="${p.github}" target="_blank" class="pj-link">GitHub</a>` : ''}
              ${p.demo ? `<a href="${p.demo}" target="_blank" class="pj-link">Demo</a>` : ''}
              <a class="pj-link pj-more">Details →</a>
            </div>
          </div>
        </article>`).join('')}
    </section>`).join('');

  el.querySelectorAll('.pj-item').forEach(card => {
    card.onclick = () => navigate('projects', { type: 'project', slug: card.dataset.slug });
    card.querySelectorAll('a[href]').forEach(a => a.onclick = e => e.stopPropagation());
  });
}

/* ═══════════════════════════════════════════════
   PAPERS
═══════════════════════════════════════════════ */
let pubTypeFilter = 'All';

function renderPapers() {
  const el = document.getElementById('papers-list');
  el.innerHTML = '';
  el.closest('.proj-page-wrap').classList.add('fade-in');

  if (!SITE.publications.length) {
    el.innerHTML = '<div style="padding:3rem;text-align:center;color:var(--text-mute);font-family:var(--mono);font-size:0.8rem">— No publications yet. Add entries to <code>SITE.publications</code> in <code>main.js</code> —</div>';
    return;
  }

  const all = [...SITE.publications].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  const types = [...new Set(all.map(p => p.type).filter(Boolean))];
  if (!types.includes(pubTypeFilter)) pubTypeFilter = 'All';
  const shown = all.filter(p => pubTypeFilter === 'All' || p.type === pubTypeFilter);
  const me = SITE.author;
  const authors = a => (a || '').split(me).join(`<strong>${me}</strong>`);

  el.innerHTML = `
    ${types.length > 1 ? `<div class="pub-filters">${['All', ...types].map(t =>
      `<button class="tag-btn${t === pubTypeFilter ? ' active' : ''}" data-type="${t}">${t}</button>`).join('')}</div>` : ''}
    <ol class="pub-list">
      ${shown.map((p, i) => `
        <li class="pub-entry">
          <span class="pub-no">${all.length - all.indexOf(p)}</span>
          ${p.image ? `<img class="pub-thumb-img" src="${p.image}" alt="${p.title}" loading="lazy">` : ''}
          <div class="pub-main">
            <div class="pub-title">${p.title}</div>
            <div class="pub-authors">${authors(p.authors)}</div>
            <div class="pub-venue">${p.venueUrl ? `<a href="${p.venueUrl}" target="_blank">${p.venue}</a>` : p.venue}${p.date ? `, ${p.date}` : ''}
              ${p.badge ? `<span class="news-badge news-badge-award pub-badge">${p.badge}</span>` : ''}
            </div>
            <div class="pub-links">
              ${Object.entries(p.links || {}).filter(([, v]) => v).map(([k, v]) => `<a href="${v}" target="_blank" class="pub-link">${k}</a>`).join('')}
            </div>
          </div>
        </li>`).join('')}
    </ol>`;

  el.querySelectorAll('.pub-filters .tag-btn').forEach(b => {
    b.onclick = () => { pubTypeFilter = b.dataset.type; renderPapers(); };
  });
}

/* ═══════════════════════════════════════════════
   GALLERY
═══════════════════════════════════════════════ */
function renderGallery() {
  const el = document.getElementById('gallery-list');
  el.innerHTML = '';
  el.closest('.proj-page-wrap').classList.add('fade-in');

  if (!SITE.gallery.length) {
    el.innerHTML = '<div style="padding:3rem;text-align:center;color:var(--text-mute);font-family:var(--mono);font-size:0.8rem">— No photos yet. Add events to <code>SITE.gallery</code> in <code>main.js</code> —</div>';
    return;
  }

  el.innerHTML = SITE.gallery.map((ev, i) => `
    <section class="gal-event">
      <div class="gal-head">
        <h2 class="gal-title">${ev.title}</h2>
        <div class="gal-meta">${[ev.date, ev.location].filter(Boolean).join(' · ')}</div>
      </div>
      ${ev.description ? `<p class="gal-desc">${ev.description}</p>` : ''}
      <div class="gal-grid">
        ${ev.photos.map((ph, j) => `
          <figure class="gal-item" data-ev="${i}" data-ph="${j}">
            <img src="${ph.src}" alt="${ph.caption || ev.title}" loading="lazy">
          </figure>`).join('')}
      </div>
    </section>`).join('');

  el.querySelectorAll('.gal-item').forEach(f => {
    f.onclick = () => openLightbox(+f.dataset.ev, +f.dataset.ph);
  });
}

const lightbox = { ev: 0, ph: 0, open: false };

function showLightbox() {
  const ev = SITE.gallery[lightbox.ev];
  const photo = ev.photos[lightbox.ph];
  const box = document.getElementById('lightbox');
  box.querySelector('.lb-img').src = photo.src;
  box.querySelector('.lb-cap').textContent =
    `${photo.caption ? photo.caption + ' — ' : ''}${ev.title}  (${lightbox.ph + 1} / ${ev.photos.length})`;
}

function openLightbox(ev, ph) {
  lightbox.ev = ev; lightbox.ph = ph; lightbox.open = true;
  const box = document.getElementById('lightbox');
  box.classList.add('open');
  box.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  showLightbox();
}

function closeLightbox() {
  lightbox.open = false;
  const box = document.getElementById('lightbox');
  box.classList.remove('open');
  box.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function stepLightbox(d) {
  const n = SITE.gallery[lightbox.ev].photos.length;
  lightbox.ph = (lightbox.ph + d + n) % n;
  showLightbox();
}

(function initLightbox() {
  const box = document.getElementById('lightbox');
  if (!box) return;
  box.querySelector('.lb-close').onclick = closeLightbox;
  box.querySelector('.lb-prev').onclick = e => { e.stopPropagation(); stepLightbox(-1); };
  box.querySelector('.lb-next').onclick = e => { e.stopPropagation(); stepLightbox(1); };
  box.onclick = e => { if (e.target === box) closeLightbox(); };
  document.addEventListener('keydown', e => {
    if (!lightbox.open) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') stepLightbox(-1);
    else if (e.key === 'ArrowRight') stepLightbox(1);
  });
})();

/* ═══════════════════════════════════════════════
   STUDY
═══════════════════════════════════════════════ */
function renderStudy() {
  renderSidebar();
  const si = document.getElementById('search-input');
  if (si) si.value = state.searchQuery;
  renderGraph();
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

  // Build parent → sub → subsub hierarchy
  // (categories[0] = parent, categories[1] = sub, categories[2] = subsub)
  const tree = {};
  POSTS.forEach(p => {
    const [parent, sub, subsub] = p.categories || [];
    if (!parent) return;
    if (!tree[parent]) tree[parent] = { count: 0, subs: {} };
    tree[parent].count++;
    if (sub) {
      if (!tree[parent].subs[sub]) tree[parent].subs[sub] = { count: 0, subsubs: {} };
      tree[parent].subs[sub].count++;
      if (subsub) {
        tree[parent].subs[sub].subsubs[subsub] = (tree[parent].subs[sub].subsubs[subsub] || 0) + 1;
      }
    }
  });

  // Level 1 (parent) and level 2 (sub) are always visible;
  // level 3 (subsub) reveals only once its parent sub is clicked.
  Object.entries(tree).sort().forEach(([parent, data]) => {
    const hasSubs = Object.keys(data.subs).length > 0;

    const parentEl = document.createElement('div');
    parentEl.className = 'sb-link' + (state.catFilter === parent ? ' active' : '');
    parentEl.innerHTML = `${parent} <span class="sb-cnt">${data.count}</span>`;
    parentEl.onclick = () => setCategoryFilter(parent);
    nav.appendChild(parentEl);

    if (!hasSubs) return;

    Object.entries(data.subs).sort().forEach(([sub, subData]) => {
      const hasSubsubs = Object.keys(subData.subsubs).length > 0;
      const subKey = `${parent}::${sub}`;
      const isExpanded = state.expandedCats.has(subKey);

      const subEl = document.createElement('div');
      subEl.className = 'sb-link sb-sub' + (state.catFilter === sub ? ' active' : '');
      subEl.innerHTML = `${hasSubsubs ? `<span class="sb-arrow">${isExpanded ? '▾' : '▸'}</span>` : ''}ㄴ ${sub} <span class="sb-cnt">${subData.count}</span>`;
      subEl.onclick = (e) => {
        e.stopPropagation();
        if (hasSubsubs) {
          if (state.expandedCats.has(subKey)) state.expandedCats.delete(subKey);
          else state.expandedCats.add(subKey);
        }
        setCategoryFilter(sub);
      };
      nav.appendChild(subEl);

      if (hasSubsubs && isExpanded) {
        Object.entries(subData.subsubs).sort().forEach(([subsub, cnt]) => {
          const subsubEl = document.createElement('div');
          subsubEl.className = 'sb-link sb-subsub' + (state.catFilter === subsub ? ' active' : '');
          subsubEl.innerHTML = `ㄴ ${subsub} <span class="sb-cnt">${cnt}</span>`;
          subsubEl.onclick = (e) => { e.stopPropagation(); setCategoryFilter(subsub); };
          nav.appendChild(subsubEl);
        });
      }
    });
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
  Object.entries(tags)
    .sort(([tagA, countA], [tagB, countB]) => countB - countA || tagA.localeCompare(tagB))
    .forEach(([tag, count]) => {
    const btn = document.createElement('button');
    btn.className = 'tag-btn' + (state.tagFilter === tag ? ' active' : '');
    btn.innerHTML = `${tag} <span class="tag-cnt">${count}</span>`;
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
      p.title.toLowerCase().includes(q) ||
      (p.description||'').toLowerCase().includes(q) ||
      (p.excerpt||'').toLowerCase().includes(q) ||
      (p.tags||[]).some(t => t.toLowerCase().includes(q))
    );
  }

  if (!filtered.length) {
    el.innerHTML = '<div style="padding:3rem 0;text-align:center;color:var(--text-mute);font-family:var(--mono);font-size:0.8rem">— 해당하는 글이 없습니다 —</div>';
    return;
  }

  let lastYear = '';
  filtered.forEach(post => {
    const year = (post.date || '').slice(0, 4);
    if (year && year !== lastYear) {
      lastYear = year;
      const heading = document.createElement('div');
      heading.className = 'post-year-heading';
      heading.textContent = year;
      el.appendChild(heading);
    }
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
   GRAPH VIEW
═══════════════════════════════════════════════ */
let graphCollapsed = false;

function renderGraph() {
  const section = document.getElementById('graph-section');
  const container = document.getElementById('graph-view');
  const body = document.getElementById('graph-body');
  const toggleBtn = document.getElementById('graph-toggle-btn');
  if (!section || !container || !body || !window.d3 || !POSTS.length) return;

  // Toggle
  const applyCollapsed = () => {
    body.classList.toggle('collapsed', graphCollapsed);
    section.classList.toggle('is-collapsed', graphCollapsed);
    toggleBtn.textContent = graphCollapsed ? '펼치기' : '접기';
  };
  applyCollapsed();
  toggleBtn.onclick = () => {
    graphCollapsed = !graphCollapsed;
    body.style.transition = 'height 350ms ease';
    applyCollapsed();
    if (graphCollapsed) { if (renderGraph.timer) renderGraph.timer.stop(); }
    else { container.innerHTML = ''; renderGraph(); }
  };

  if (graphCollapsed) { if (renderGraph.timer) renderGraph.timer.stop(); return; }

  // On first paint the page isn't visible yet, so the container has no width — measure on the next frame
  if (!container.clientWidth && !renderGraph.retried) {
    renderGraph.retried = true;
    requestAnimationFrame(() => { renderGraph(); renderGraph.retried = false; });
    return;
  }
  container.innerHTML = '';

  const W = container.clientWidth || 680;
  const H = 300;
  const VIEW = 1.12;                       // lay out on a bigger canvas, show it zoomed out
  const LW = W * VIEW, LH = H * VIEW;

  // Category → color (brighter, glowing hues on dark; calm tones on ivory)
  const neon = currentTheme() === 'dark';
  const OTHER = neon ? '#8c93b8' : '#8a8a9e';
  const catColors = neon
    ? { 'Research': '#4fa3ff', 'Study': '#ffb454', 'Programming': OTHER }
    : { 'Research': '#5b8dd9', 'Study': '#c4923c', 'Programming': OTHER };
  function postColor(p) {
    const cats = p.categories || [];
    for (const c of cats) {
      for (const key of Object.keys(catColors)) {
        if (c.includes(key)) return catColors[key];
      }
    }
    return OTHER;
  }

  // Filter posts by active category + tag
  let activePosts = state.catFilter
    ? POSTS.filter(p => (p.categories || []).some(c => c === state.catFilter || c.startsWith(state.catFilter)))
    : POSTS;

  // Build nodes + links
  const shorten = (t, n) => t.length > n ? t.slice(0, n - 1) + '…' : t;
  const postNodes = activePosts.map(p => ({
    id: p.slug, type: 'post', label: p.title,
    short: shorten(p.title.replace(/^\[[^\]]+\]\s*/, ''), 28),
    slug: p.slug, color: postColor(p), r: 1.7
  }));

  const tagMap = new Map();
  activePosts.forEach(p => (p.tags || []).forEach(t => {
    if (!tagMap.has(t)) tagMap.set(t, { id: `t::${t}`, type: 'tag', label: t, count: 0, colors: {} });
    const tg = tagMap.get(t);
    tg.count++;
    tg.colors[postColor(p)] = (tg.colors[postColor(p)] || 0) + 1;
  }));
  tagMap.forEach(tg => {
    tg.r = 2.4 + Math.sqrt(tg.count) * 1.1;
    tg.color = Object.entries(tg.colors).sort((x, y) => y[1] - x[1])[0][0];
  });

  const nodes = [...postNodes, ...tagMap.values()];
  const links = [];
  activePosts.forEach(p => (p.tags || []).forEach(t => {
    links.push({ source: p.slug, target: `t::${t}` });
  }));

  // Seeded start so the layout is the same on every visit
  let seed = 42;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  nodes.forEach(n => { n.x = 90 + rnd() * (LW - 180); n.y = 40 + rnd() * (LH - 100); });

  const adj = new Map(nodes.map(n => [n.id, new Set([n.id])]));
  links.forEach(l => { adj.get(l.source).add(l.target); adj.get(l.target).add(l.source); });

  // Selected tag → highlight it, its posts and the tags those posts share
  const focusId = state.tagFilter ? `t::${state.tagFilter}` : null;
  const focusSet = focusId && adj.has(focusId) ? new Set(adj.get(focusId)) : null;
  if (focusSet) [...focusSet].forEach(id => adj.get(id).forEach(x => focusSet.add(x)));
  const inFocus = id => !focusSet || focusSet.has(id);
  const applyBase = () => {
    nodeEl.style('opacity', n => inFocus(n.id) ? 1 : 0.14);
    nodeEl.select('.post-label').style('opacity', 0);
    linkEl.attr('stroke-opacity', l => (inFocus(l.source.id) && inFocus(l.target.id)) ? 1 : 0.05)
          .attr('stroke', linkColor);
  };

  // SVG — height 100% so it fills the resizable container
  const svg = d3.select(container).append('svg')
    .attr('width', '100%').attr('height', '100%')
    .attr('viewBox', `0 0 ${W} ${H}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  // Soft radial gradients for post nodes (bright core → body colour, no dark outline)
  const gradDefs = svg.append('defs');
  [...new Set([...postNodes, ...tagMap.values()].map(n => n.color))].forEach(col => {
    const g = gradDefs.append('radialGradient').attr('id', 'ng-' + col.slice(1))
      .attr('cx', '38%').attr('cy', '35%').attr('r', '75%');
    g.append('stop').attr('offset', '0%').attr('stop-color', d3.color(col).brighter(neon ? 1.1 : 0.6));
    g.append('stop').attr('offset', '70%').attr('stop-color', col);
    g.append('stop').attr('offset', '100%').attr('stop-color', d3.color(col).darker(neon ? 0.15 : 0.2));
  });

  // Neon glow filter (dark theme only)
  const defs = svg.append('defs');
  const glow = defs.append('filter').attr('id', 'glow-fx')
    .attr('x', '-80%').attr('y', '-80%').attr('width', '260%').attr('height', '260%');
  glow.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '3.2').attr('result', 'blur');
  const gm = glow.append('feMerge');
  gm.append('feMergeNode').attr('in', 'blur');
  gm.append('feMergeNode').attr('in', 'SourceGraphic');
  const linkColor = neon ? 'rgba(120,170,255,0.28)' : cssVar('--border');

  // Force simulation
  const sim = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(d => 26 + d.target.r + d.source.r).strength(0.5))
    .force('charge', d3.forceManyBody().strength(d => d.type === 'tag' ? -420 : -25))
    .force('x', d3.forceX(LW / 2).strength(0.028))
    .force('y', d3.forceY(LH / 2).strength(0.22))
    .force('collide', d3.forceCollide(d => d.type === 'tag' ? d.r + 26 : 7))
    .force('bound', () => {
      const padX = 80, padY = 26, padYb = 44;
      nodes.forEach(n => {
        if (n.x < padX)       n.vx += (padX - n.x) * 0.12;
        if (n.x > LW - padX)  n.vx -= (n.x - (LW - padX)) * 0.12;
        if (n.y < padY)       n.vy += (padY - n.y) * 0.12;
        if (n.y > LH - padYb) n.vy -= (n.y - (LH - padYb)) * 0.12;
      });
    });

  // Zoomable canvas group
  const canvas = svg.append('g').attr('class', 'graph-canvas');

  // Zoom behavior
  const zoom = d3.zoom()
    .scaleExtent([0.3, 4])
    .on('zoom', ev => canvas.attr('transform', ev.transform));
  svg.call(zoom).on('dblclick.zoom', null);
  svg.call(zoom.transform, d3.zoomIdentity.scale(1 / VIEW));

  // Reset zoom — always update onclick to reference current svg/zoom
  const resetBtn = document.getElementById('graph-reset-btn');
  if (resetBtn) {
    resetBtn.onclick = () => svg.transition().duration(400).call(zoom.transform, d3.zoomIdentity.scale(1 / VIEW));
  }

  // Links
  const linkEl = canvas.append('g').selectAll('line').data(links).join('line')
    .attr('stroke', linkColor).attr('stroke-width', neon ? 1.1 : 1);

  // Nodes
  const nodeEl = canvas.append('g').selectAll('g').data(nodes).join('g')
    .style('cursor', d => d.type === 'post' ? 'pointer' : 'default')
    .call(d3.drag()
      .on('start', (ev, d) => { if (!ev.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag',  (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
      .on('end',   (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

  nodeEl.style('cursor', 'pointer');

  // Pulsing halo behind posts
  nodeEl.filter(d => d.type === 'tag').append('circle')
    .attr('class', 'graph-halo')
    .attr('r', d => d.r + 4)
    .attr('fill', d => d.color)
    .style('animation-delay', (_d, i) => `${(i % 5) * 0.7}s`);

  nodeEl.append('circle')
    .attr('r', d => d.r)
    .attr('fill', d => `url(#ng-${d.color.slice(1)})`)
    .attr('stroke', d => d.color)
    .attr('stroke-opacity', 0.35)
    .attr('stroke-width', d => d.type === 'tag' ? 2 : 1.5)
    .attr('filter', neon ? 'url(#glow-fx)' : null);

  // Tag names (primary) — always visible with post count
  const tagText = nodeEl.filter(d => d.type === 'tag').append('text')
    .attr('dy', d => d.r + 9)
    .attr('text-anchor', 'middle')
    .style('font-family', 'var(--mono)')
    .style('font-size', '8.5px')
    .style('fill', cssVar('--text-soft'))
    .style('pointer-events', 'none');
  tagText.append('tspan').text(d => d.label);
  tagText.append('tspan').text(d => ` (${d.count})`)
    .style('font-size', '6.8px')
    .style('fill', cssVar('--text-mute'))
    .style('opacity', 0.75);

  // Post titles — only revealed when a connected tag/post is hovered
  nodeEl.filter(d => d.type === 'post').append('text')
    .attr('class', 'post-label')
    .text(d => d.short)
    .attr('dy', d => d.r + 8)
    .attr('text-anchor', 'middle')
    .style('font-family', 'var(--serif)')
    .style('font-size', '8.5px')
    .style('fill', cssVar('--text'))
    .style('opacity', 0)
    .style('pointer-events', 'none');

  // Legend (fixed, not zoomed)
  const legendItems = [['Research', catColors.Research], ['Study', catColors.Study], ['Other', OTHER]]
    .filter(([name, col]) => nodes.some(n => n.color === col));
  const legend = svg.append('g').attr('transform', `translate(16,${H - 14})`);
  let lx = 0;
  legendItems.forEach(([name, col]) => {
    legend.append('circle').attr('cx', lx + 3).attr('cy', -3).attr('r', 3.5).attr('fill', col);
    legend.append('text').attr('x', lx + 11).attr('y', 0).text(name)
      .style('font-family', 'var(--mono)').style('font-size', '8px').style('fill', cssVar('--text-mute'));
    lx += 22 + name.length * 5.2;
  });
  legend.append('text').attr('x', lx + 6).attr('y', 0).text('node size = number of posts')
    .style('font-family', 'var(--mono)').style('font-size', '8px').style('fill', cssVar('--text-mute')).style('opacity', 0.7);

  // Resize handle (added once to graph-section)
  if (section && !section.querySelector('.graph-resize-handle')) {
    const handle = document.createElement('div');
    handle.className = 'graph-resize-handle';
    section.appendChild(handle);

    let startY = 0, startH = 0;
    handle.addEventListener('mousedown', e => {
      startY = e.clientY;
      startH = body.clientHeight;
      e.preventDefault();
      document.body.style.cursor = 'ns-resize';
      document.body.style.userSelect = 'none';

      const onMove = ev => {
        const newH = Math.max(150, Math.min(750, startH + (ev.clientY - startY)));
        body.style.transition = 'none';
        body.style.height = newH + 'px';
      };
      const onUp = () => {
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  // Tooltip
  const tip = d3.select(container).append('div').attr('class', 'graph-tip');

  nodeEl
    .on('mouseenter', function(ev, d) {
      const near = adj.get(d.id);
      nodeEl.style('opacity', n => near.has(n.id) ? 1 : 0.18);
      nodeEl.select('.post-label').style('opacity', n => near.has(n.id) ? 1 : 0);
      linkEl.attr('stroke-opacity', l => (l.source.id === d.id || l.target.id === d.id) ? 0.9 : 0.06)
            .attr('stroke', l => (l.source.id === d.id || l.target.id === d.id) ? (neon ? '#8fc2ff' : cssVar('--vermillion')) : linkColor);
      if (d.type === 'post') {
        tip.style('opacity', '1')
          .style('left', (ev.offsetX + 14) + 'px')
          .style('top',  (ev.offsetY - 10) + 'px')
          .text(d.label);
      }
    })
    .on('mousemove', ev => {
      tip.style('left', (ev.offsetX + 14) + 'px').style('top', (ev.offsetY - 10) + 'px');
    })
    .on('mouseleave', function() {
      applyBase();
      tip.style('opacity', '0');
    })
    .on('click', (_ev, d) => {
      if (d.type === 'post') navigate('study', { type: 'post', slug: d.slug });
      else filterTag(d.label);
    });

  applyBase();
  if (focusId) nodeEl.filter(d => d.id === focusId).select('circle:last-of-type')
    .attr('stroke-opacity', 0.95).attr('stroke-width', 3);

  // Tick
  // Gentle idle drift: each node floats a few px on its own slow orbit (visual only — layout is untouched)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const drift = new Map(nodes.map(n => [n.id, {
    px: rnd() * 6.28, py: rnd() * 6.28,
    fx: 0.00035 + rnd() * 0.0004, fy: 0.00035 + rnd() * 0.0004,
    a: n.type === 'tag' ? 3.4 : 5
  }]));
  let now = 0;
  const pos = n => {
    const d = drift.get(n.id);
    const ox = reduceMotion ? 0 : Math.sin(now * d.fx + d.px) * d.a;
    const oy = reduceMotion ? 0 : Math.cos(now * d.fy + d.py) * d.a;
    return [cx(n.x, LW, n.r) + ox, cy(n.y, LH, n.r) + oy];
  };
  const ticked = () => {
    linkEl
      .attr('x1', d => pos(d.source)[0]).attr('y1', d => pos(d.source)[1])
      .attr('x2', d => pos(d.target)[0]).attr('y2', d => pos(d.target)[1]);
    nodeEl.attr('transform', d => `translate(${pos(d)[0]},${pos(d)[1]})`);
  };

  // Settle the layout up-front so it never "swims" when a tag is selected; dragging still animates
  sim.stop();
  for (let i = 0; i < 320; i++) sim.tick();
  ticked();
  sim.on('tick', ticked);

  if (renderGraph.timer) renderGraph.timer.stop();
  if (!reduceMotion) {
    renderGraph.timer = d3.timer(elapsed => {
      if (!container.isConnected) { renderGraph.timer.stop(); return; }
      if (container.offsetParent === null) return;
      now = elapsed;
      ticked();
    });
  }

  function cx(v, max, r = 0) { return Math.max(r + 2, Math.min(max - r - 2, v)); }
  function cy(v, max, r = 0) { return Math.max(r + 2, Math.min(max - r - 2, v)); }
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
    ? `<span style="font-family:var(--mono);font-size:0.68rem;color:var(--text-mute)">${item.stack}</span>` : '';

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

  // Mermaid diagrams — turn ```mermaid fenced blocks into rendered SVG
  if (typeof mermaid !== 'undefined') {
    el.querySelectorAll('.detail-body pre code.language-mermaid').forEach(code => {
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = code.textContent;
      code.parentElement.replaceWith(div);
    });
    const mermaidEls = el.querySelectorAll('.detail-body .mermaid');
    if (mermaidEls.length) {
      mermaid.run({ nodes: mermaidEls }).catch(err => console.error('Mermaid render failed:', err));
    }
  }

  // Data charts — turn ```chart fenced JSON blocks (Chart.js config) into canvas charts
  if (typeof Chart !== 'undefined') {
    el.querySelectorAll('.detail-body pre code.language-chart').forEach(code => {
      const wrap = document.createElement('div');
      wrap.className = 'chart-wrap';
      try {
        const config = JSON.parse(code.textContent);
        const canvas = document.createElement('canvas');
        wrap.appendChild(canvas);
        code.parentElement.replaceWith(wrap);
        new Chart(canvas, config);
      } catch (err) {
        wrap.className = 'chart-error';
        wrap.textContent = `차트 설정(JSON) 오류: ${err.message}`;
        code.parentElement.replaceWith(wrap);
        console.error('Chart render failed:', err);
      }
    });
  }

  // YouTube embeds — turn ```youtube fenced blocks (video ID or URL) into a responsive iframe
  el.querySelectorAll('.detail-body pre code.language-youtube').forEach(code => {
    const raw = code.textContent.trim();
    const idMatch = raw.match(/^[\w-]{11}$/)
      ? raw
      : (raw.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/) || [])[1];
    const wrap = document.createElement('div');
    if (idMatch) {
      wrap.className = 'yt-embed';
      wrap.innerHTML = `<iframe src="https://www.youtube.com/embed/${idMatch}" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>`;
    } else {
      wrap.className = 'chart-error';
      wrap.textContent = `YouTube 링크를 인식할 수 없습니다: ${raw}`;
    }
    code.parentElement.replaceWith(wrap);
  });

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
    s.setAttribute('data-theme', currentTheme() === 'light' ? 'light' : 'dark');
    s.setAttribute('data-lang', 'ko');
    s.crossOrigin = 'anonymous';
    s.async = true;
    wrap.appendChild(s);
  }
}

function addCopyButtons(container) {
  container.querySelectorAll('.detail-body pre').forEach(pre => {
    const codeEl = pre.querySelector('code');
    const langClass = codeEl ? [...codeEl.classList].find(c => c.startsWith('language-')) : null;
    const lang = langClass ? langClass.replace('language-', '') : '';

    const wrap = document.createElement('div');

    // 결과 블록: 헤더/버튼 없는 깔끔한 출력 스타일
    if (lang === '결과') {
      wrap.className = 'output-wrap';
      if (codeEl) codeEl.className = '';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(pre);
      return;
    }

    wrap.className = 'code-wrap';
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
  const today = new Date(Date.now() + 9*60*60*1000).toISOString().slice(0, 10);

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
   GITHUB CONTRIBUTIONS HEATMAP
═══════════════════════════════════════════════ */
const GH_WEEKS = 26;

async function renderGithubHeatmap(wrap) {
  if (!wrap) return;
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${SITE.github}?y=last`);
    if (!res.ok) return;
    const data = await res.json();
    const days = data.contributions.slice(-GH_WEEKS * 7);
    if (!days.length) return;

    const pad = new Date(days[0].date + 'T00:00:00').getDay();
    const cells = [...Array(pad).fill(null), ...days];
    const weeks = Math.ceil(cells.length / 7);
    const total = days.reduce((n, d) => n + d.count, 0);

    wrap.innerHTML = `
      <div class="gh-grid" style="grid-template-columns:repeat(${weeks},1fr)">
        ${cells.map(d => d
          ? `<i class="gh-cell gh-l${d.level}" title="${d.count} contributions · ${d.date}"></i>`
          : '<i class="gh-cell gh-empty"></i>').join('')}
      </div>
      <div class="gh-caption">${total} contributions · last ${GH_WEEKS} weeks</div>`;
  } catch (e) {
    wrap.innerHTML = '';
  }
}

/* ═══════════════════════════════════════════════
   THEME (dark / ivory)
═══════════════════════════════════════════════ */
function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
}

function applyLibThemes() {
  const light = currentTheme() === 'light';
  const hd = document.getElementById('hljs-dark'), hl = document.getElementById('hljs-light');
  if (hd && hl) { hd.disabled = light; hl.disabled = !light; }
  if (typeof mermaid !== 'undefined') {
    mermaid.initialize({
      startOnLoad: false,
      theme: light ? 'neutral' : 'dark',
      themeVariables: light ? {
        background: '#f1f3f6', primaryColor: '#ffffff', primaryTextColor: '#1d2330',
        primaryBorderColor: '#2c5aa0', lineColor: '#8a92a1', secondaryColor: '#f7f8fa',
        tertiaryColor: '#f7f8fa', textColor: '#1d2330',
        fontFamily: "'JetBrains Mono', 'Courier New', monospace"
      } : {
        darkMode: true, background: '#18181c', primaryColor: '#1e1e24', primaryTextColor: '#e4e4ee',
        primaryBorderColor: '#5b8dd9', lineColor: '#5a5a6a', secondaryColor: '#131316',
        tertiaryColor: '#131316', textColor: '#e4e4ee',
        fontFamily: "'JetBrains Mono', 'Courier New', monospace"
      }
    });
  }
  if (typeof Chart !== 'undefined') {
    Chart.defaults.color = cssVar('--text-soft');
    Chart.defaults.borderColor = cssVar('--border');
    Chart.defaults.font.family = "'JetBrains Mono', 'Courier New', monospace";
    Chart.defaults.plugins.legend.labels.color = cssVar('--text');
  }
}

function toggleTheme() {
  const next = currentTheme() === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  try { localStorage.setItem('theme', next); } catch (e) {}
  applyLibThemes();
  render();
}

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
async function init() {
  applyLibThemes();
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.onclick = toggleTheme;

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
      <a href="mailto:${SITE.email}" class="profile-btn" title="Email" aria-label="Email">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
      </a>
      <a href="https://github.com/${SITE.github}" target="_blank" class="profile-btn" title="GitHub" aria-label="GitHub">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.76 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>
      </a>
      <a href="${SITE.linkedin}" target="_blank" class="profile-btn" title="LinkedIn" aria-label="LinkedIn">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>
      </a>
      <a class="profile-btn ${SITE.scholar ? '' : 'profile-btn-disabled'}" ${SITE.scholar ? `href="${SITE.scholar}" target="_blank"` : ''} title="Google Scholar" aria-label="Google Scholar">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Zm-6 9.18v3.82c0 1.66 2.69 3 6 3s6-1.34 6-3v-3.82l-6 3.27-6-3.27Z"/></svg>
      </a>
      <a class="profile-btn ${SITE.cv ? '' : 'profile-btn-disabled'}" ${SITE.cv ? `href="${SITE.cv}" target="_blank"` : ''} title="CV" aria-label="CV">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>
      </a>
    </div>
    <div class="gh-wrap" id="gh-wrap"></div>`;
  renderGithubHeatmap(document.getElementById('gh-wrap'));

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
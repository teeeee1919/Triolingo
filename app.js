/* 쉬운 수학 학습 - 해시 라우팅 방식 (GitHub Pages에서 그대로 동작) */

const SUBJECTS = [
  { id: 'math', name: '수학', desc: '개념과 계산 꿀팁', ready: true },
  { id: 'korean', name: '국어', desc: '', ready: false },
  { id: 'english', name: '영어', desc: '', ready: false },
  { id: 'science', name: '과학', desc: '', ready: false },
];

const MATH_GRADES = [
  { group: '초등학교', items: ['초1', '초2', '초3', '초4', '초5', '초6'].map((n, i) => ({ id: 'e' + (i + 1), name: n })) },
  { group: '중학교', items: ['중1', '중2', '중3'].map((n, i) => ({ id: 'm' + (i + 1), name: n })) },
  { group: '고등학교', items: ['고1', '고2', '고3'].map((n, i) => ({ id: 'h' + (i + 1), name: n })) },
];

// 지금 콘텐츠가 있는 학년
const READY_GRADES = { h1: window.MATH_HIGH1 };

const app = document.getElementById('app');
const crumbs = document.getElementById('crumbs');

function setCrumbs(list) {
  crumbs.innerHTML = list
    .map((c, i) => {
      const sep = i > 0 ? '<span class="sep">/</span>' : '';
      return sep + (c.href ? `<a href="${c.href}">${c.label}</a>` : `<span>${c.label}</span>`);
    })
    .join('');
}

function typeset() {
  if (window.renderMathInElement) {
    window.renderMathInElement(app, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false },
      ],
      throwOnError: false,
    });
  }
}

/* ---------- 화면 ---------- */

function viewSubjects() {
  setCrumbs([]);
  app.innerHTML = `
    <h1>무엇을 공부할까요?</h1>
    <p class="lead">과목을 선택하세요.</p>
    <div class="grid">
      ${SUBJECTS.map(s => s.ready
        ? `<a class="choice" href="#/${s.id}"><div class="name">${s.name}</div><div class="meta">${s.desc}</div></a>`
        : `<div class="choice disabled"><div class="name">${s.name}</div><span class="badge">준비 중</span></div>`
      ).join('')}
    </div>`;
}

function viewGrades() {
  setCrumbs([{ label: '과목', href: '#/' }, { label: '수학' }]);
  app.innerHTML = `
    <h1>수학</h1>
    <p class="lead">학년을 선택하세요.</p>
    ${MATH_GRADES.map(g => `
      <div class="group-title">${g.group}</div>
      <div class="grid">
        ${g.items.map(it => READY_GRADES[it.id]
          ? `<a class="choice" href="#/math/${it.id}"><div class="name">${it.name}</div></a>`
          : `<div class="choice disabled"><div class="name">${it.name}</div><span class="badge">준비 중</span></div>`
        ).join('')}
      </div>`).join('')}`;
}

function viewUnits(gradeId) {
  const data = READY_GRADES[gradeId];
  if (!data) return go('#/math');
  setCrumbs([{ label: '과목', href: '#/' }, { label: '수학', href: '#/math' }, { label: data.gradeName }]);

  const parts = [...new Set(data.units.map(u => u.part))];
  app.innerHTML = `
    <h1>${data.gradeName} 수학</h1>
    <p class="lead">공부할 단원을 선택하세요.</p>
    ${parts.map(p => `
      <div class="group-title">${p}</div>
      <div class="grid wide">
        ${data.units.filter(u => u.part === p).map(u => `
          <a class="choice" href="#/math/${gradeId}/${u.id}">
            <div class="unit-num">${u.no}단원</div>
            <div class="name">${u.title}</div>
            <div class="meta">${u.summary}</div>
          </a>`).join('')}
      </div>`).join('')}`;
}

function viewUnit(gradeId, unitId) {
  const data = READY_GRADES[gradeId];
  const unit = data && data.units.find(u => u.id === unitId);
  if (!unit) return go('#/math');
  setCrumbs([
    { label: '과목', href: '#/' },
    { label: '수학', href: '#/math' },
    { label: data.gradeName, href: `#/math/${gradeId}` },
    { label: unit.title },
  ]);

  const toc = unit.sections.map((s, i) => `<li><a href="#" data-jump="s${i}">${s.title}</a></li>`).join('');

  app.innerHTML = `
    <a class="back" href="#/math/${gradeId}">← 단원 목록</a>
    <div class="unit-head">
      <div class="part">${unit.part} · ${unit.no}단원</div>
      <h1>${unit.title}</h1>
      <p class="lead">${unit.summary}</p>
    </div>

    <ul class="toc">${toc}<li><a href="#" data-jump="ex">예제</a></li></ul>

    ${unit.sections.map((s, i) => `
      <section class="card" id="s${i}">
        <h2>${s.title}</h2>
        ${s.body}
        ${s.tip ? `<div class="tip"><strong class="label">꿀팁</strong>${s.tip}</div>` : ''}
      </section>`).join('')}

    <div class="section-label" id="ex">예제로 확인하기</div>
    ${unit.examples.map(e => `
      <details class="example">
        <summary>${e.q}<div class="hint">직접 풀어 본 뒤 눌러서 풀이를 확인하세요.</div></summary>
        <div class="answer">${e.a}</div>
      </details>`).join('')}
  `;

  app.querySelectorAll('[data-jump]').forEach(a =>
    a.addEventListener('click', ev => {
      ev.preventDefault();
      document.getElementById(a.dataset.jump).scrollIntoView({ behavior: 'smooth', block: 'start' });
    })
  );
}

/* ---------- 라우터 ---------- */

function go(hash) { location.hash = hash; }

function route() {
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (parts.length === 0) viewSubjects();
  else if (parts[0] === 'math' && parts.length === 1) viewGrades();
  else if (parts[0] === 'math' && parts.length === 2) viewUnits(parts[1]);
  else if (parts[0] === 'math' && parts.length >= 3) viewUnit(parts[1], parts[2]);
  else viewSubjects();

  window.scrollTo(0, 0);
  typeset();
}

window.addEventListener('hashchange', route);
window.addEventListener('load', route);
// KaTeX가 늦게 로드되는 경우 대비
document.addEventListener('DOMContentLoaded', () => setTimeout(typeset, 300));

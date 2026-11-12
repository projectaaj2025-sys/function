/* Ядро приложения: состояние, маршруты, страницы, проверка ответов. */
const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const STORE = 'matan.v1';
const ICONS = {
  home: 'M3 11l9-8 9 8M5 10v10h14V10', book: 'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM19 19v2H6', pen: 'M4 20l4-1L20 7l-3-3L5 16zM14 6l3 3',
  flask: 'M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3', bulb: 'M9 18h6M10 21h4M12 3a6 6 0 00-4 10c1 1 1 2 1 3h6c0-1 0-2 1-3a6 6 0 00-4-10z',
  check: 'M5 12l5 5 9-10', clock: 'M12 7v5l3 2M12 3a9 9 0 100 18 9 9 0 000-18z', search: 'M15 15l5 5M10 4a6 6 0 100 12 6 6 0 000-12z',
  bot: 'M5 9h14v10H5zM12 9V5M9 13v2M15 13v2', chart: 'M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-8', table: 'M4 5h16v14H4zM4 10h16M10 5v14',
  arrow: 'M5 12h14M13 6l6 6-6 6', refresh: 'M4 12a8 8 0 0114-5l2 2M20 5v4h-4M20 12a8 8 0 01-14 5l-2-2M4 19v-4h4', lock: 'M6 11h12v9H6zM9 11V8a3 3 0 016 0v3',
  sun: 'M12 4V2M12 22v-2M4 12H2M22 12h-2M6 6L4.5 4.5M19.5 19.5L18 18M6 18l-1.5 1.5M19.5 4.5L18 6M12 7a5 5 0 100 10 5 5 0 000-10z', moon: 'M20 14A8.5 8.5 0 1110 4a7 7 0 0010 10z',
  target: 'M12 3a9 9 0 100 18 9 9 0 000-18zM12 8a4 4 0 100 8 4 4 0 000-8z', alert: 'M12 4l9 16H3zM12 10v4M12 17v.5'
};
const ico = n => `<svg class="ico" viewBox="0 0 24 24"><path d="${ICONS[n]}"/></svg>`;

/* ---------- состояние ---------- */
const blank = () => ({ solved: {}, attempts: {}, wrong: {}, variant: {}, fails: {}, open: {}, visited: {}, exams: [], exam: null, settings: { lang: 'ru', theme: 'light', showSol: false, gate: 3, ai: {} } });
let S = blank();
function loadState() {
  try { const raw = JSON.parse(localStorage.getItem(STORE) || 'null'); if (raw) { S = Object.assign(blank(), raw); S.settings = Object.assign(blank().settings, raw.settings || {}); } } catch (e) { S = blank(); }
}
function save() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { /* хранилище недоступно */ } }

/* ---------- формулы ---------- */
const mathCache = new Map();
function tex(src, display) {
  const key = (display ? 'D' : 'I') + src;
  if (!mathCache.has(key)) {
    let html;
    try { html = katex.renderToString(src, { displayMode: !!display, throwOnError: true, strict: false }); }
    catch (e) { console.warn('KaTeX: ' + src, e.message); html = `<code>${esc(src)}</code>`; if (typeof window !== 'undefined') window.__texErrors = (window.__texErrors || 0) + 1; }
    mathCache.set(key, html);
  }
  return mathCache.get(key);
}
/* Превращает $...$ и $$...$$ внутри HTML-строки в формулы KaTeX. */
function mx(html) {
  return String(html).replace(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g, (m, d, i) => d != null ? tex(d.trim(), true) : tex(i, false));
}
const plain = html => String(html).replace(/<[^>]+>/g, ' ').replace(/\$+/g, ' ').replace(/\\[a-zA-Z]+|[{}\\]/g, ' ').replace(/\s+/g, ' ').trim();

/* ---------- задачи ---------- */
const topicById = id => TOPICS.find(x => x.id === id);
const C = id => CONTENT[LANG][id];
const groupName = g => CONTENT[LANG]._groups[g];
const slotCount = tp => Math.min(12, Math.max(8, GEN[tp.id].length * 2));
const taskIds = tp => Array.from({ length: slotCount(tp) }, (_, i) => tp.id + '~' + i);
const allIds = () => TOPICS.flatMap(taskIds);
const taskCache = new Map();
function getTask(id, variant) {
  const [tid, slot] = id.split('~'), tp = topicById(tid), v = variant != null ? variant : (S.variant[id] || 0);
  const key = LANG + id + '#' + v;
  if (taskCache.has(key)) return taskCache.get(key);
  const gens = GEN[tid], gi = +slot % gens.length;
  let tk;
  for (let attempt = 0; attempt < 30 && !tk; attempt++) {
    const r = rng(tp.n * 100003 + (+slot) * 911 + v * 7919 + attempt * 31 + 7);
    try { tk = gens[gi](r); } catch (e) { if (e !== RETRY) throw e; }
  }
  tk.id = id; tk.topic = tid; tk.variant = v;
  tk.type = tk.type || (tk.fields ? 'fields' : tk.opts ? (Array.isArray(tk.a) ? 'multi' : 'single') : 'number');
  tk.lvl = tk.lvl || 1;
  if (!tk.ans) tk.ans = tk.type === 'number' ? `$${nt(tk.a)}$` : tk.type === 'single' ? tk.opts[tk.a] : tk.type === 'multi' ? tk.a.map(i => tk.opts[i]).join('; ') : tk.fields.map(f => `${f.label} $= ${nt(f.a)}$`).join(', ');
  taskCache.set(key, tk);
  return tk;
}
function parseNum(v) {
  let s = String(v == null ? '' : v).trim().toLowerCase().replace(/[−–—]/g, '-').replace(/\s+/g, '').replace(/,/g, '.').replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/[:÷]/g, '/').replace(/[·×]/g, '*');
  if (!s || !/^[0-9+\-*/^().a-z]+$/.test(s)) return null;
  const map = { pi: 'Math.PI', e: 'Math.E', sqrt: 'Math.sqrt', ln: 'Math.log' };
  if ((s.match(/[a-z]+/g) || []).some(w => !map[w])) return null;
  s = s.replace(/(\d|\)|pi|e)(?=(pi|sqrt|ln|\(|e(?![a-z])))/g, (m, a) => a + '*').replace(/\^/g, '**').replace(/[a-z]+/g, w => map[w]).replace(/^-([^+\-*/]+)\*\*/, '-1*$1**');
  try { const n = Function('"use strict";return (' + s + ')')(); return Number.isFinite(n) ? n : null; } catch (e) { return null; }
}
const near = (a, b, tol) => a != null && Math.abs(a - b) <= Math.max(tol || 0.006, 1e-9 * Math.abs(b));
function isRight(tk, val) {
  if (tk.type === 'number') return near(parseNum(val), tk.a, tk.tol);
  if (tk.type === 'fields') return tk.fields.every((f, i) => near(parseNum(val[i]), f.a, tk.tol));
  if (tk.type === 'single') return val === tk.a;
  return val.length === tk.a.length && tk.a.every(i => val.includes(i));
}
const CARDS = {};
let cardSeq = 0;
const unlocked = tk => S.settings.showSol || S.open[tk.id] || (S.fails[tk.id] || 0) >= S.settings.gate;
function stepsHtml(tk) {
  return `<ol class="steps">${tk.steps.map(s => `<li>${mx(s)}</li>`).join('')}</ol><div class="final">${t('answer')}: ${mx(tk.ans)}</div>`;
}
function solutionHtml(tk, force) {
  if (force || unlocked(tk)) return `<details class="solution" open><summary>${ico('bulb')} ${t('solution')}</summary>${stepsHtml(tk)}</details>`;
  return `<details class="solution locked"><summary>${ico('lock')} ${t('locked', { n: S.settings.gate })} · ${S.fails[tk.id] || 0} / ${S.settings.gate}</summary></details>`;
}
function inputsHtml(tk, cid) {
  if (tk.type === 'number') return `<input type="text" id="in-${cid}" inputmode="text" autocomplete="off" placeholder="${t('yourAnswer')}" title="${t('inputTip')}" onkeydown="if(event.key==='Enter')checkTask('${cid}')">${tk.unit ? `<span class="muted">${mx(tk.unit)}</span>` : ''}`;
  if (tk.type === 'fields') return tk.fields.map((f, i) => `<label class="row" style="gap:6px"><span>${mx(f.label)} =</span><input type="text" id="in-${cid}-${i}" autocomplete="off" style="width:110px" title="${t('inputTip')}"></label>`).join('');
  const kind = tk.type === 'single' ? 'radio' : 'checkbox';
  return `<div class="grow" style="min-width:100%">${tk.type === 'multi' ? `<p class="small muted" style="margin-bottom:6px">${t('multiTip')}</p>` : ''}${tk.opts.map((o, i) => `<label class="opt"><input type="${kind}" name="o-${cid}" value="${i}"><span>${mx(o)}</span></label>`).join('')}</div>`;
}
function taskCard(id, mode, n, variant) {
  const tk = getTask(id, variant), cid = 'c' + (++cardSeq), tp = topicById(tk.topic), exam = mode === 'exam';
  CARDS[cid] = { tk, mode };
  return `<article class="task ${!exam && S.solved[id] ? 'solved' : ''}" id="${cid}" data-g="${tp.g}" data-lvl="${tk.lvl}">
  <div class="task-top"><span class="task-n">№ ${n}</span><span class="pill g">${t('lvl' + tk.lvl)}</span>${mode !== 'practice' ? `<a class="pill" href="#${tp.id}/practice">${esc(C(tp.id).t)}</a>` : ''}<span class="grow"></span><span id="st-${cid}">${!exam && S.solved[id] ? `<span class="pill ok">${ico('check')} ${t('solved')}</span>` : ''}</span></div>
  <div class="task-q">${mx(tk.q)}</div>
  <div class="answer-row">${inputsHtml(tk, cid)}</div>
  ${exam ? '' : `<div class="answer-row no-print" style="margin-top:12px"><button class="btn primary" onclick="checkTask('${cid}')">${ico('check')} ${t('check')}</button><button class="btn sm" onclick="showHint('${cid}')">${ico('bulb')} ${t('hint')}</button>${mode === 'practice' || mode === 'random' ? `<button class="btn sm" onclick="newVariant('${cid}')">${ico('refresh')} ${t('newVariant')}</button>` : ''}<button class="btn sm ghost" onclick="aiAskTask('${cid}')">${ico('bot')} ${t('askAi')}</button></div>
  <div class="feedback" id="fb-${cid}" role="status"></div><div id="sol-${cid}">${solutionHtml(tk)}</div>`}
 </article>`;
}
function readAnswer(cid) {
  const tk = CARDS[cid].tk;
  if (tk.type === 'number') { const v = $('in-' + cid).value.trim(); return v ? v : null; }
  if (tk.type === 'fields') { const v = tk.fields.map((f, i) => $('in-' + cid + '-' + i).value.trim()); return v.every(x => x) ? v : null; }
  const picked = [...document.querySelectorAll(`input[name="o-${cid}"]:checked`)].map(x => +x.value);
  if (!picked.length) return null;
  return tk.type === 'single' ? picked[0] : picked;
}
function fb(cid, html, cls) { const el = $('fb-' + cid); el.className = 'feedback ' + cls; el.innerHTML = mx(html); }
function checkTask(cid) {
  const { tk, mode } = CARDS[cid], val = readAnswer(cid);
  if (val == null) return fb(cid, t(tk.type === 'number' || tk.type === 'fields' ? 'enterAnswer' : 'chooseAnswer'), 'hint');
  S.attempts[tk.id] = (S.attempts[tk.id] || 0) + 1;
  if (isRight(tk, val)) {
    S.solved[tk.id] = 1; S.open[tk.id] = 1;
    if (mode === 'trainer' || !S.fails[tk.id]) delete S.wrong[tk.id];
    fb(cid, `✓ ${t('correct')} ${t('rightAnswer')}: ${tk.ans}`, 'ok');
    $(cid).classList.add('solved'); $('st-' + cid).innerHTML = `<span class="pill ok">${ico('check')} ${t('solved')}</span>`;
  } else {
    S.fails[tk.id] = (S.fails[tk.id] || 0) + 1; S.wrong[tk.id] = 1;
    const n = S.fails[tk.id], g = S.settings.gate;
    fb(cid, n >= g || S.settings.showSol ? `✗ ${t('wrong')} ${t('rightAnswer')}: ${tk.ans}. ${t('opened')}` : `✗ ${t('wrong')} ${t('tryAgain', { a: n, b: g })}`, 'bad');
  }
  $('sol-' + cid).innerHTML = solutionHtml(tk);
  save(); updateProgressUI();
}
function showHint(cid) { fb(cid, `<b>${t('hint')}.</b> ${CARDS[cid].tk.hint}`, 'hint'); }
function newVariant(cid) {
  const { tk, mode } = CARDS[cid], el = $(cid), n = el.querySelector('.task-n').textContent.replace('№ ', '');
  S.variant[tk.id] = (S.variant[tk.id] || 0) + 1; delete S.fails[tk.id]; delete S.open[tk.id]; save();
  el.outerHTML = taskCard(tk.id, mode, n);
}

/* ---------- оболочка ---------- */
let route = { id: 'home', tab: '' };
const PAGES = ['home', 'handbook', 'trainer', 'exam', 'search', 'ai', 'progress'];
const PAGE_ICON = { home: 'home', handbook: 'table', trainer: 'target', exam: 'clock', search: 'search', ai: 'bot', progress: 'chart' };
function toast(msg) { const el = $('toast'); el.textContent = msg; el.classList.remove('hidden'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.add('hidden'), 3200); }
function go(id, tab) { const h = '#' + id + (tab ? '/' + tab : ''); if (location.hash === h) render(); else location.hash = h; }
function setLang(l) { LANG = l; S.settings.lang = l; save(); document.documentElement.lang = l; renderChrome(); render(); }
function setTheme(th) { S.settings.theme = th; save(); document.body.classList.toggle('dark', th === 'dark'); $('theme-toggle').innerHTML = ico(th === 'dark' ? 'sun' : 'moon'); $('theme-toggle').title = t(th === 'dark' ? 'light' : 'dark'); if (route.tab === 'lab' || route.id === 'home') render(); }
function renderChrome() {
  $('brand-name').textContent = t('brand'); $('brand-sub').textContent = t('brandSub'); $('rnd-label').textContent = t('random');
  $('topic-search').placeholder = t('findTopic'); $('side-more').textContent = t('more'); $('ai-fab').title = t('ai');
  $('lang-picker').innerHTML = LANGS.map(l => `<button class="${l === LANG ? 'active' : ''}" onclick="setLang('${l}')">${l === 'kk' ? 'ҚАЗ' : l === 'ru' ? 'РУС' : 'ENG'}</button>`).join('');
  $('theme-toggle').innerHTML = ico(S.settings.theme === 'dark' ? 'sun' : 'moon');
  document.title = t('brand') + ' — ' + t('brandSub');
}
function renderNav() {
  $('top-nav').innerHTML = PAGES.map(p => `<a href="#${p}" class="${route.id === p ? 'active' : ''}">${t(p)}</a>`).join('');
  const q = $('topic-search').value.trim().toLowerCase();
  let html = PAGES.map(p => `<a class="nav-item ${route.id === p ? 'active' : ''}" href="#${p}">${ico(PAGE_ICON[p])}<span>${t(p)}</span>${p === 'trainer' && Object.keys(S.wrong).length ? `<span class="nav-dot pill bad">${Object.keys(S.wrong).length}</span>` : ''}</a>`).join('');
  for (const g of GROUPS) {
    const list = TOPICS.filter(x => x.g === g.id && (!q || (C(x.id).t + ' ' + C(x.id).s).toLowerCase().includes(q)));
    if (!list.length) continue;
    html += `<div data-g="${g.id}"><div class="nav-group">${esc(groupName(g.id))} · ${g.grade}</div>${list.map(x => {
      const ids = taskIds(x), d = ids.filter(i => S.solved[i]).length;
      return `<a class="nav-item ${route.id === x.id ? 'active' : ''}" href="#${x.id}"><span class="nav-num">${x.n}</span><span>${esc(C(x.id).t)}</span><span class="nav-dot ${d === ids.length ? 'full' : ''}">${d ? (d === ids.length ? '✓' : d + '/' + ids.length) : ''}</span></a>`;
    }).join('')}</div>`;
  }
  $('course-nav').innerHTML = html;
}
function updateProgressUI() {
  const ids = allIds(), d = ids.filter(i => S.solved[i]).length;
  $('side-progress').textContent = t('solvedOf', { a: d, b: ids.length }); $('side-bar').style.width = 100 * d / ids.length + '%';
  renderNav();
}
function closeSidebar() { $('sidebar').classList.remove('open'); $('backdrop').classList.add('hidden'); $('menu-toggle').setAttribute('aria-expanded', 'false'); }
const footer = () => `<footer class="footer"><span>${t('footer')}</span><span>KaTeX · ${TOPICS.length} ${t('stTopics')}</span></footer>`;
function render() {
  const parts = decodeURIComponent(location.hash.slice(1)).split('/');
  route = { id: parts[0] || 'home', tab: parts[1] || '' };
  const tp = topicById(route.id);
  if (!tp && !PAGES.includes(route.id)) route = { id: 'home', tab: '' };
  if (typeof stopLabs === 'function') stopLabs();
  closeSidebar();
  const main = $('main');
  if (tp) { S.visited[tp.id] = 1; save(); renderTopic(tp); }
  else ({ home: renderHome, handbook: renderHandbook, trainer: renderTrainer, exam: renderExam, search: renderSearch, ai: () => renderAI(), progress: renderProgress, graph: () => renderGraph() })[route.id]();
  updateProgressUI();
  if (typeof window.scrollTo === 'function') try { window.scrollTo(0, 0); } catch (e) { /* jsdom */ }
  main.focus({ preventScroll: true });
}

/* ---------- главная ---------- */
function renderHome() {
  const labs = new Set(TOPICS.map(x => x.lab).filter(Boolean)).size;
  $('main').innerHTML = `<div class="page">
  <section class="hero"><div><span class="pill" style="background:#ffffff2e;color:#fff">10–11 · ${LANGS.length} 🌐</span><h1 style="margin-top:14px">${t('heroTitle')}</h1><p>${t('heroLead')}</p>
   <div class="row wrap" style="margin-top:20px"><a class="btn white" href="#limit-point">${t('start')} ${ico('arrow')}</a><a class="btn glass" href="#derivative-def/lab">${ico('flask')} ${t('openLab')}</a></div></div>
   <div class="hero-art" id="hero-art"></div></section>
  <div class="stats"><div class="stat" data-g="lim"><b>${TOPICS.length}</b><span>${t('stTopics')}</span></div><div class="stat" data-g="der"><b>${allIds().length}</b><span>${t('stTasks')}</span></div><div class="stat" data-g="app"><b>${labs}</b><span>${t('stLabs')}</span></div><div class="stat" data-g="de"><b>∞</b><span>${t('stVariants')}</span></div></div>
  ${GROUPS.map(g => `<section data-g="${g.id}"><div class="group-head"><span class="group-badge">${g.sym}</span><div class="grow"><h2>${esc(groupName(g.id))}</h2><span class="muted small">${t('grade', { n: g.grade })}</span></div><img class="group-pic" src="${groupPic(g.id)}" alt="" loading="lazy"></div>
   <div class="topic-grid">${TOPICS.filter(x => x.g === g.id).map(x => { const ids = taskIds(x), d = ids.filter(i => S.solved[i]).length; return `<a class="topic-card" href="#${x.id}"><div class="between"><span class="num">${t('topicN', { n: x.n })}</span>${d ? `<span class="pill ok">${d} / ${ids.length}</span>` : `<span class="pill">${t('minutes', { n: x.min })}</span>`}</div><h3>${esc(C(x.id).t)}</h3><p>${esc(C(x.id).s)}</p><span class="small muted">${t('tasksCount', { n: ids.length })}${x.lab ? ' · ' + t('withLab') : ''}</span></a>`; }).join('')}</div></section>`).join('')}
  <section style="margin-top:36px"><h2>${t('howTitle')}</h2><div class="grid2">${[['how1', 'book', 'lim'], ['how2', 'bulb', 'der'], ['how3', 'check', 'int'], ['how4', 'flask', 'de']].map(([k, i, g]) => `<div class="card row" data-g="${g}" style="align-items:flex-start"><span class="group-badge" style="flex-shrink:0">${ico(i)}</span><p>${t(k)}</p></div>`).join('')}</div></section>
  ${footer()}</div>`;
  if (typeof heroArt === 'function') heroArt($('hero-art'));
}

/* ---------- тема ---------- */
function renderTopic(tp) {
  const tabs = ['theory', 'slides', 'examples', 'practice'].concat(tp.lab ? ['lab'] : []);
  if (!tabs.includes(route.tab)) route.tab = 'theory';
  const c = C(tp.id), g = GROUPS.find(x => x.id === tp.g), ids = taskIds(tp), icons = { theory: 'book', examples: 'bulb', practice: 'pen', lab: 'flask', slides: 'slides' };
  $('main').innerHTML = `<div class="page" data-g="${tp.g}">
  <header class="topic-head" data-sym="${g.sym}"><div class="row wrap"><span class="pill">${t('topicN', { n: tp.n })}</span><span class="pill">${esc(groupName(tp.g))}</span><span class="pill">${t('grade', { n: g.grade })}</span><span class="pill">${ico('clock')} ${t('minutes', { n: tp.min })}</span></div><h1>${esc(c.t)}</h1><p>${esc(c.s)}</p></header>
  <nav class="tabs no-print" role="tablist">${tabs.map(x => `<button class="tab ${route.tab === x ? 'active' : ''}" role="tab" aria-selected="${route.tab === x}" onclick="go('${tp.id}','${x}')">${ico(icons[x])}${t(x)}${x === 'practice' ? `<span class="cnt">${ids.length}</span>` : ''}</button>`).join('')}</nav>
  <section id="panel"></section>${footer()}</div>`;
  const panel = $('panel');
  if (route.tab === 'theory') renderTheory(tp, panel);
  else if (route.tab === 'examples') renderExamples(tp, panel);
  else if (route.tab === 'slides') renderSlides(tp, panel);
  else if (route.tab === 'practice') renderPractice(tp, panel);
  else { panel.innerHTML = '<div id="lab-root"></div>'; LABS[tp.lab]($('lab-root'), tp); }
}
function renderTheory(tp, panel) {
  const c = C(tp.id);
  panel.innerHTML = `<div class="theory-grid"><div>
   <div class="hook hook-pic"><img src="${groupPic(tp.g)}" alt="" loading="lazy"><div><b>${t('whyHook')}</b> ${mx(c.hook)}</div></div>
   <article class="card prose">${mx(c.th)}${extraHtml(tp.id)}<div class="warn"><b>${ico('alert')} ${t('mistake')}.</b> ${mx(c.err)}</div></article>
   <div class="row wrap no-print" style="margin-top:16px"><button class="btn primary" onclick="go('${tp.id}','examples')">${t('toExamples')} ${ico('arrow')}</button><button class="btn" onclick="go('${tp.id}','practice')">${ico('pen')} ${t('toPractice')}</button>${tp.lab ? `<button class="btn" onclick="go('${tp.id}','lab')">${ico('flask')} ${t('toLab')}</button>` : ''}${DESMOS[tp.id] ? `<button class="btn" onclick="go('graph','${tp.id}')">${ico('wave')} ${t('toDesmos')}</button>` : ''}<button class="btn" onclick="go('${tp.id}','slides')">${ico('slides')} ${t('slides')}</button><button class="btn soft" onclick="aiAskTopic('${tp.id}')">${ico('bot')} ${t('askTopic')}</button></div>
  </div><aside class="card formula-card"><h3>${ico('target')} ${t('keyFormulas')}</h3>${tp.f.map(x => `<div class="f">${tex(x, true)}</div>`).join('')}
   <h3 style="margin-top:20px">${t('afterTopic')}</h3><ul class="objectives">${c.o.map(x => `<li>${ico('check')}<span>${mx(x)}</span></li>`).join('')}</ul>
   <div class="codes" title="${t('goals')}">${tp.codes.map(x => `<span class="pill g">${x}</span>`).join('')}</div></aside></div>`;
}
const exVar = {};
function renderExamples(tp, panel) {
  const n = Math.min(4, GEN[tp.id].length), v = exVar[tp.id] || 0;
  panel.innerHTML = `<div class="bar"><p class="muted grow" style="margin:0">${t('exIntro')}</p><button class="btn soft" onclick="exVar['${tp.id}']=(exVar['${tp.id}']||0)+1;renderExamples(topicById('${tp.id}'),$('panel'))">${ico('refresh')} ${t('otherExamples')}</button></div>
  <div class="stack">${Array.from({ length: n }, (_, i) => { const tk = getTask(tp.id + '~' + i, 9000 + v); return `<article class="card example"><div class="task-top"><span class="pill g">${t('exampleN', { n: i + 1 })}</span><span class="pill">${t('lvl' + tk.lvl)}</span></div><div class="task-q">${mx(tk.q)}${tk.opts ? `<ul>${tk.opts.map(o => `<li>${mx(o)}</li>`).join('')}</ul>` : ''}</div><details class="solution" open><summary>${ico('bulb')} ${t('solution')}</summary>${stepsHtml(tk)}</details></article>`; }).join('')}</div>
  <div class="row no-print" style="margin-top:16px"><button class="btn primary" onclick="go('${tp.id}','practice')">${ico('pen')} ${t('toPractice')}</button></div>`;
}
function renderPractice(tp, panel) {
  const ids = taskIds(tp);
  panel.innerHTML = `<div class="bar no-print"><div class="seg" style="margin:0" id="lvl-filter">${['all', 'lvl1', 'lvl2', 'lvl3'].map((k, i) => `<button class="${i ? '' : 'active'}" onclick="filterLvl(${i},this)">${t(k)}</button>`).join('')}</div><span class="grow"></span><span class="small muted">${t('inputTip')}</span></div>
  <div class="stack" id="task-list">${ids.map((id, i) => taskCard(id, 'practice', i + 1)).join('')}</div>`;
}
function filterLvl(l, btn) {
  btn.parentNode.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
  document.querySelectorAll('#task-list .task').forEach(el => el.classList.toggle('hidden', !!l && +el.dataset.lvl !== l));
}

/* ---------- работа над ошибками, случайная задача ---------- */
function renderTrainer() {
  const ids = Object.keys(S.wrong).filter(id => topicById(id.split('~')[0]));
  $('main').innerHTML = `<div class="page"><h1>${ico('target')} ${t('trainer')}</h1><p class="muted">${t('trainerLead')}</p>
  ${ids.length ? `<div class="stack">${ids.map((id, i) => taskCard(id, 'trainer', i + 1)).join('')}</div>` : `<div class="card"><p>🎉 ${t('trainerEmpty')}</p></div>`}${footer()}</div>`;
}
function randomTask() {
  const ids = allIds(), pool = ids.filter(i => !S.solved[i]), id = (pool.length ? pool : ids)[Math.floor(Math.random() * (pool.length || ids.length))];
  $('dlg-title').textContent = t('random'); $('dlg-body').innerHTML = taskCard(id, 'random', 1) + `<div class="row" style="margin-top:14px"><button class="btn soft" onclick="randomTask()">${ico('refresh')} ${t('random')}</button></div>`;
  if (!$('dlg').open) $('dlg').showModal();
}

/* ---------- контрольная ---------- */
let examTimer = null;
function examPick(groups, n) {
  const pool = TOPICS.filter(x => groups.includes(x.g)).flatMap(taskIds);
  for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[pool[i], pool[j]] = [pool[j], pool[i]]; }
  return pool.slice(0, n).map(id => ({ id, v: 5000 + Math.floor(Math.random() * 4000) }));
}
function examForm() {
  const groups = [...document.querySelectorAll('#exam-groups input:checked')].map(x => x.value);
  return { groups: groups.length ? groups : GROUPS.map(g => g.id), n: Math.max(1, Math.min(40, +$('exam-n').value || 10)), min: Math.max(1, +$('exam-min').value || 30) };
}
function examStart() { const f = examForm(); S.exam = { items: examPick(f.groups, f.n), end: Date.now() + f.min * 60000, answers: {} }; save(); go('exam', 'run'); }
function examSubmit() {
  const ex = S.exam; if (!ex) return;
  clearInterval(examTimer);
  ex.items.forEach((it, i) => { const cid = ex.cids && ex.cids[i]; if (cid && $(cid)) { const v = readAnswer(cid); if (v != null) ex.answers[i] = v; } });
  ex.results = ex.items.map((it, i) => ex.answers[i] != null && isRight(getTask(it.id, it.v), ex.answers[i]));
  ex.done = true; delete ex.cids;
  S.exams.unshift({ date: new Date().toISOString().slice(0, 16).replace('T', ' '), ok: ex.results.filter(Boolean).length, n: ex.items.length });
  S.exams = S.exams.slice(0, 20);
  ex.items.forEach((it, i) => { if (!ex.results[i]) S.wrong[it.id] = 1, S.variant[it.id] = it.v; });
  save(); go('exam', 'result');
}
function renderExam() {
  const ex = S.exam, main = $('main');
  clearInterval(examTimer);
  if (route.tab === 'run' && ex && !ex.done) {
    const cards = ex.items.map((it, i) => taskCard(it.id, 'exam', i + 1, it.v));
    ex.cids = ex.items.map((_, i) => 'c' + (cardSeq - ex.items.length + i + 1));
    main.innerHTML = `<div class="page"><div class="bar card" style="position:sticky;top:76px;z-index:5;padding:12px 18px"><b>${t('exam')}</b><span class="grow"></span><span class="muted">${t('left')}</span><span class="timer" id="exam-timer"></span><button class="btn primary" onclick="examSubmit()">${t('submit')}</button></div><div class="stack">${cards.join('')}</div>${footer()}</div>`;
    const tick = () => { const s = Math.max(0, Math.round((ex.end - Date.now()) / 1000)), el = $('exam-timer'); if (!el) return clearInterval(examTimer); el.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'); if (s <= 0) examSubmit(); };
    tick(); examTimer = setInterval(tick, 1000);
    return;
  }
  if (route.tab === 'result' && ex && ex.done) {
    const ok = ex.results.filter(Boolean).length;
    main.innerHTML = `<div class="page"><h1>${t('result')}: ${t('score', { a: ok, b: ex.items.length })}</h1><div class="track" style="margin-bottom:20px"><div class="fill" style="width:${100 * ok / ex.items.length}%"></div></div>
    <div class="stack">${ex.items.map((it, i) => { const tk = getTask(it.id, it.v), a = ex.answers[i], tp = topicById(tk.topic); const shown = a == null ? t('noAns') : tk.type === 'single' ? tk.opts[a] : tk.type === 'multi' ? a.map(j => tk.opts[j]).join('; ') : esc([].concat(a).join('; ')); return `<article class="task ${ex.results[i] ? 'solved' : ''}" data-g="${tp.g}"><div class="task-top"><span class="task-n">№ ${i + 1}</span><span class="pill ${ex.results[i] ? 'ok' : 'bad'}">${ex.results[i] ? '✓ ' + t('correct') : '✗'}</span><a class="pill" href="#${tp.id}">${esc(C(tp.id).t)}</a></div><div class="task-q">${mx(tk.q)}</div><p>${t('yourAns')}: <b>${mx(shown)}</b> · ${t('rightAnswer')}: <b>${mx(tk.ans)}</b></p>${solutionHtml(tk, true).replace(' open>', '>')}</article>`; }).join('')}</div>
    <div class="row no-print" style="margin-top:18px"><button class="btn primary" onclick="S.exam=null;save();go('exam')">${t('again')}</button><button class="btn" onclick="window.print()">${t('print')}</button></div>${footer()}</div>`;
    return;
  }
  if (route.tab === 'print' && renderExam.sheet) {
    const items = renderExam.sheet;
    main.innerHTML = `<div class="page"><div class="bar no-print"><button class="btn primary" onclick="window.print()">${t('print')}</button><a class="btn" href="#exam">←</a></div><h1>${t('sheetTitle')}</h1><p>${t('nameLine')}</p>
    <ol>${items.map(it => { const tk = getTask(it.id, it.v); return `<li style="margin-bottom:18px">${mx(tk.q)}${tk.opts ? `<ul style="list-style:upper-alpha">${tk.opts.map(o => `<li>${mx(o)}</li>`).join('')}</ul>` : ''}</li>`; }).join('')}</ol>
    <h2 style="break-before:page">${t('keys')}</h2><ol>${items.map(it => { const tk = getTask(it.id, it.v); return `<li style="margin-bottom:14px"><b>${mx(tk.ans)}</b><ol class="steps" style="padding:8px 0 0">${tk.steps.map(s => `<li>${mx(s)}</li>`).join('')}</ol></li>`; }).join('')}</ol></div>`;
    return;
  }
  main.innerHTML = `<div class="page"><h1>${ico('clock')} ${t('exam')}</h1><p class="muted">${t('examLead')}</p>
  <div class="card stack"><div><b>${t('sections')}</b><div class="chips" id="exam-groups" style="margin-top:8px">${GROUPS.map(g => `<label class="opt" style="margin:0"><input type="checkbox" value="${g.id}" checked><span>${esc(groupName(g.id))}</span></label>`).join('')}</div></div>
   <div class="grid2"><label><b>${t('count')}</b><input id="exam-n" type="number" min="1" max="40" value="10"></label><label><b>${t('time')}</b><input id="exam-min" type="number" min="1" max="180" value="30"></label></div>
   <div class="row wrap"><button class="btn primary" onclick="examStart()">${ico('clock')} ${t('startExam')}</button><button class="btn" onclick="const f=examForm();renderExam.sheet=examPick(f.groups,f.n);go('exam','print')">${t('printSheet')}</button>${ex && !ex.done ? `<a class="btn soft" href="#exam/run">→ ${t('exam')}</a>` : ''}</div></div>
  ${S.exams.length ? `<h2 style="margin-top:28px">${t('history')}</h2><div class="card table-scroll"><table class="ref">${S.exams.map(e => `<tr><td>${e.date}</td><td><b>${t('score', { a: e.ok, b: e.n })}</b></td><td style="width:40%"><div class="track"><div class="fill" style="width:${100 * e.ok / e.n}%"></div></div></td></tr>`).join('')}</table></div>` : ''}${footer()}</div>`;
}

/* ---------- поиск ---------- */
function renderSearch() {
  $('main').innerHTML = `<div class="page"><h1>${ico('search')} ${t('search')}</h1><input id="q" type="search" placeholder="${t('searchPh')}" oninput="doSearch()" style="font-size:18px;padding:14px 16px"><div id="search-out" style="margin-top:18px"></div>${footer()}</div>`;
  $('q').focus();
}
function doSearch() {
  const q = $('q').value.trim().toLowerCase(), out = $('search-out');
  if (q.length < 2) { out.innerHTML = ''; return; }
  const tps = TOPICS.filter(x => { const c = C(x.id); return (c.t + ' ' + c.s + ' ' + plain(c.th) + ' ' + x.codes.join(' ')).toLowerCase().includes(q); });
  const tks = allIds().map(id => getTask(id)).filter(tk => plain(tk.q).toLowerCase().includes(q) || tk.q.toLowerCase().includes(q)).slice(0, 30);
  out.innerHTML = !tps.length && !tks.length ? `<p class="muted">${t('nothing')}</p>` :
    (tps.length ? `<h3>${t('topics')}</h3><div class="topic-grid">${tps.map(x => `<a class="topic-card" data-g="${x.g}" href="#${x.id}"><span class="num">${t('topicN', { n: x.n })}</span><h3>${esc(C(x.id).t)}</h3><p>${esc(C(x.id).s)}</p></a>`).join('')}</div>` : '') +
    (tks.length ? `<h3 style="margin-top:22px">${t('tasks')}</h3><div class="stack">${tks.map(tk => `<a class="card" style="text-decoration:none;color:inherit;padding:14px 18px" data-g="${topicById(tk.topic).g}" href="#${tk.topic}/practice"><span class="pill g">${esc(C(tk.topic).t)} · № ${+tk.id.split('~')[1] + 1}</span><div style="margin-top:6px">${mx(tk.q)}</div></a>`).join('')}</div>` : '');
}

/* ---------- прогресс и настройки ---------- */
function renderProgress() {
  const ids = allIds(), d = ids.filter(i => S.solved[i]).length, att = Object.values(S.attempts).reduce((a, b) => a + b, 0);
  $('main').innerHTML = `<div class="page"><h1>${ico('chart')} ${t('progress')}</h1><p class="muted">${t('progLead')}</p>
  <div class="stats"><div class="stat" data-g="int"><b>${d} / ${ids.length}</b><span>${t('pSolved')}</span></div><div class="stat" data-g="der"><b>${att}</b><span>${t('pAttempts')}</span></div><div class="stat" data-g="de"><b>${Object.keys(S.wrong).length}</b><span>${t('pErrors')}</span></div><div class="stat" data-g="lim"><b>${Object.keys(S.visited).length} / ${TOPICS.length}</b><span>${t('pTopics')}</span></div></div>
  <div class="card table-scroll"><table class="ref">${GROUPS.map(g => `<tr data-g="${g.id}"><th colspan="3" style="color:var(--g)">${esc(groupName(g.id))}</th></tr>` + TOPICS.filter(x => x.g === g.id).map(x => { const l = taskIds(x), k = l.filter(i => S.solved[i]).length; return `<tr data-g="${g.id}"><td><a href="#${x.id}/practice">${x.n}. ${esc(C(x.id).t)}</a></td><td style="white-space:nowrap"><b>${k} / ${l.length}</b></td><td style="width:35%"><div class="track"><div class="fill" style="width:${100 * k / l.length}%;background:var(--g)"></div></div></td></tr>`; }).join('')).join('')}</table></div>
  <h2 style="margin-top:28px">${t('settings')}</h2><div class="card stack"><label class="row"><input type="checkbox" ${S.settings.showSol ? 'checked' : ''} onchange="S.settings.showSol=this.checked;save()"><span>${t('showSol')}</span></label>
   <label class="row"><span>${t('gate')}</span><select style="width:90px" onchange="S.settings.gate=+this.value;save()">${[1, 2, 3, 4, 5].map(n => `<option ${n === S.settings.gate ? 'selected' : ''}>${n}</option>`).join('')}</select></label>
   <div class="row wrap"><button class="btn" onclick="exportCsv()">${t('exportCsv')}</button><button class="btn" style="color:var(--bad)" onclick="if(confirm(t('resetQ'))){const s=S.settings;S=blank();S.settings=s;save();render();toast(t('done'))}">${t('reset')}</button></div></div>${footer()}</div>`;
}
function exportCsv() {
  const rows = [['topic', 'task', 'solved', 'attempts']].concat(allIds().map(id => { const [a, b] = id.split('~'); return ['"' + C(a).t.replace(/"/g, '""') + '"', +b + 1, S.solved[id] ? 1 : 0, S.attempts[id] || 0]; }));
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['\ufeff' + rows.map(r => r.join(';')).join('\n')], { type: 'text/csv' })); a.download = 'matan-progress.csv'; a.click();
}

/* ---------- справочник формул ---------- */
const HB = {
  hbLimits: [R`\lim_{x\to0}\frac{\sin x}{x}=1`, R`\lim_{x\to0}\frac{\operatorname{tg}x}{x}=1`, R`\lim_{x\to0}\frac{1-\cos x}{x^2}=\frac12`, R`\lim_{x\to\infty}\left(1+\frac1x\right)^x=e`, R`\lim_{x\to\infty}\frac{a_nx^n+\dots}{b_mx^m+\dots}=\begin{cases}0,&n<m\\ a_n/b_m,&n=m\\ \infty,&n>m\end{cases}`, R`\lim_{n\to\infty}q^n=0\ (|q|<1)`],
  hbDer: [R`C'=0`, R`(kx+b)'=k`, R`(x^n)'=nx^{n-1}`, R`(\sqrt x)'=\frac1{2\sqrt x}`, R`\left(\frac1x\right)'=-\frac1{x^2}`, R`(e^x)'=e^x`, R`(a^x)'=a^x\ln a`, R`(\ln x)'=\frac1x`, R`(\log_ax)'=\frac1{x\ln a}`, R`(\sin x)'=\cos x`, R`(\cos x)'=-\sin x`, R`(\operatorname{tg}x)'=\frac1{\cos^2x}`, R`(\operatorname{ctg}x)'=-\frac1{\sin^2x}`, R`(\arcsin x)'=\frac1{\sqrt{1-x^2}}`, R`(\arccos x)'=-\frac1{\sqrt{1-x^2}}`, R`(\operatorname{arctg}x)'=\frac1{1+x^2}`, R`(\operatorname{arcctg}x)'=-\frac1{1+x^2}`, R`(\\operatorname{sh}x)'=\\operatorname{ch}x`, R`(\\operatorname{ch}x)'=\\operatorname{sh}x`, R`(\\operatorname{th}x)'=\frac1{\\operatorname{ch}^2x}`, R`(\\operatorname{cth}x)'=-\frac1{\\operatorname{sh}^2x}`, R`(\\operatorname{Arsh}x)'=\frac1{\sqrt{1+x^2}}`, R`(\\operatorname{Arch}x)'=\frac1{\sqrt{x^2-1}}\ (|x|>1)`, R`(\\operatorname{Arth}x)'=\frac1{1-x^2}\ (|x|<1)`, R`(\\operatorname{Arcth}x)'=-\frac1{x^2-1}\ (|x|>1)`],
  hbRules: [R`(u\pm v)'=u'\pm v'`, R`(Cu)'=C\,u'`, R`(uv)'=u'v+uv'`, R`\left(\frac uv\right)'=\frac{u'v-uv'}{v^2}`, R`\big(f(g(x))\big)'=f'(g(x))\,g'(x)`, R`dy=f'(x)\,dx`, R`y=f(x_0)+f'(x_0)(x-x_0)`, R`v=s'(t),\ a=v'(t)`],
  hbApp: [R`f'>0\Rightarrow f\nearrow,\quad f'<0\Rightarrow f\searrow`, R`f'(x_0)=0,\ +\to-\ \Rightarrow\ x_{\max}`, R`f'(x_0)=0,\ -\to+\ \Rightarrow\ x_{\min}`, R`f''>0\Rightarrow\smile,\quad f''<0\Rightarrow\frown`, R`k=\lim_{x\to\infty}\frac{f(x)}x,\ b=\lim_{x\to\infty}(f(x)-kx)`],
  hbInt: [R`\int x^n\,dx=\frac{x^{n+1}}{n+1}+C\ (n\ne-1)`, R`\int dx=x+C`, R`\int\frac{dx}x=\ln|x|+C`, R`\int a^x\,dx=\frac{a^x}{\ln a}+C`, R`\int e^x\,dx=e^x+C`, R`\int\sin x\,dx=-\cos x+C`, R`\int\cos x\,dx=\sin x+C`, R`\int\frac{dx}{\cos^2x}=\operatorname{tg}x+C`, R`\int\frac{dx}{\sin^2x}=-\operatorname{ctg}x+C`, R`\int\frac{dx}{a^2+x^2}=\frac1a\operatorname{arctg}\frac xa+C`, R`\int\frac{dx}{1+x^2}=\operatorname{arctg}x+C`, R`\int\frac{dx}{\sqrt{a^2-x^2}}=\arcsin\frac xa+C`, R`\int\frac{dx}{\sqrt{1-x^2}}=\arcsin x+C`, R`\int\frac{dx}{a^2-x^2}=\frac1{2a}\ln\left|\frac{a+x}{a-x}\right|+C`, R`\int\frac{dx}{\sqrt{x^2\pm a^2}}=\ln\left|x+\sqrt{x^2\pm a^2}\right|+C`, R`\int\\operatorname{sh}x\,dx=\\operatorname{ch}x+C`, R`\int\\operatorname{ch}x\,dx=\\operatorname{sh}x+C`, R`\int\frac{dx}{\\operatorname{ch}^2x}=\\operatorname{th}x+C`, R`\int\frac{dx}{\\operatorname{sh}^2x}=-\\operatorname{cth}x+C`],
  hbIntRules: [R`\int(f\pm g)\,dx=\int f\,dx\pm\int g\,dx`, R`\int kf\,dx=k\int f\,dx`, R`\int f(kx+b)\,dx=\frac1kF(kx+b)+C`, R`\int u\,dv=uv-\int v\,du`, R`\int_a^bf(x)\,dx=F(b)-F(a)`, R`S=\int_a^b\big(f(x)-g(x)\big)\,dx`, R`V=\pi\int_a^bf^2(x)\,dx`, R`s=\int_{t_1}^{t_2}v(t)\,dt,\quad A=\int_a^bF(x)\,dx`],
  hbDe: [R`y'=f(x)g(y)\ \Rightarrow\ \int\frac{dy}{g(y)}=\int f(x)\,dx`, R`y'=ky\ \Rightarrow\ y=Ce^{kx}`, R`ay''+by'+cy=0\ \to\ ak^2+bk+c=0`, R`k_1\ne k_2:\ y=C_1e^{k_1x}+C_2e^{k_2x}`, R`k_1=k_2=k:\ y=(C_1+C_2x)e^{kx}`, R`k=\alpha\pm\beta i:\ y=e^{\alpha x}(C_1\cos\beta x+C_2\sin\beta x)`, R`x''+\omega^2x=0\ \Rightarrow\ x=A\cos(\omega t+\varphi_0),\ T=\frac{2\pi}\omega`],
  hbHyp: [R`\\operatorname{sh}x=\frac{e^x-e^{-x}}2`, R`\\operatorname{ch}x=\frac{e^x+e^{-x}}2`, R`\\operatorname{th}x=\frac{\\operatorname{sh}x}{\\operatorname{ch}x}`, R`\\operatorname{ch}^2x-\\operatorname{sh}^2x=1`],
};
function renderHandbook() {
  const gs = { hbLimits: 'lim', hbDer: 'der', hbRules: 'der', hbApp: 'app', hbInt: 'int', hbIntRules: 'int', hbDe: 'de', hbHyp: 'app' };
  $('main').innerHTML = `<div class="page"><div class="between"><h1>${ico('table')} ${t('handbook')}</h1><button class="btn no-print" onclick="window.print()">${t('print')}</button></div><p class="muted">${t('hbLead')}</p>
  ${Object.keys(HB).map(k => `<section data-g="${gs[k]}" style="margin-top:24px"><div class="group-head" style="margin-top:0"><span class="group-badge">${GROUPS.find(g => g.id === gs[k]).sym}</span><h2>${t(k)}</h2></div><div class="card"><div class="topic-grid" style="grid-template-columns:repeat(auto-fill,minmax(${HB[k].some(x => x.length > 52) ? 360 : 250}px,1fr))">${HB[k].map((x, i) => `<div class="f" style="margin:0;display:flex;align-items:center;gap:8px"><span class="pill g">${i + 1}</span><span class="grow" style="min-width:0;overflow-x:auto;overflow-y:hidden">${tex(x, true)}</span></div>`).join('')}</div></div></section>`).join('')}${footer()}</div>`;
}

/* ---------- запуск ---------- */
function boot() {
  loadState();
  LANG = LANGS.includes(S.settings.lang) ? S.settings.lang : 'ru';
  document.documentElement.lang = LANG;
  document.body.classList.toggle('dark', S.settings.theme === 'dark');
  renderChrome();
  $('theme-toggle').onclick = () => setTheme(S.settings.theme === 'dark' ? 'light' : 'dark');
  $('random-button').onclick = randomTask;
  $('ai-fab').onclick = () => go('ai');
  $('topic-search').oninput = renderNav;
  $('menu-toggle').onclick = () => { const open = !$('sidebar').classList.contains('open'); $('sidebar').classList.toggle('open', open); $('backdrop').classList.toggle('hidden', !open); $('menu-toggle').setAttribute('aria-expanded', String(open)); };
  $('backdrop').onclick = closeSidebar;
  window.addEventListener('hashchange', render);
  render();
}

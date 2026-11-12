/* Симуляторы: общий SVG-график + набор интерактивных моделей. */
let labRaf = [];
function stopLabs() { labRaf.forEach(id => cancelAnimationFrame(id)); labRaf = []; }
const n2 = (x, d) => Number.isFinite(x) ? String(+x.toFixed(d == null ? 2 : d)).replace('.', LANG === 'en' ? '.' : ',').replace('-', '−') : '—';
const COL = { g: 'var(--g)', pink: 'var(--pink)', orange: 'var(--orange)', cyan: 'var(--cyan)', green: 'var(--green)', mute: 'var(--plot-axis)', text: 'var(--text)' };
function Plot(x0, x1, y0, y1, w, h) {
  w = w || 640; h = h || 420;
  const X = x => (x - x0) / (x1 - x0) * w, Y = y => h - (y - y0) / (y1 - y0) * h, f1 = v => v.toFixed(1);
  let s = '';
  const step = span => { const raw = span / 8, p = 10 ** Math.floor(Math.log10(raw)), k = raw / p; return (k < 1.5 ? 1 : k < 3.5 ? 2 : k < 7.5 ? 5 : 10) * p; };
  const P = {
    X, Y, w, h, x0, x1, y0, y1,
    grid(lx, ly) {
      const sx = step(x1 - x0), sy = step(y1 - y0), ax = Math.min(Math.max(0, y0), y1), ay = Math.min(Math.max(0, x0), x1);
      for (let x = Math.ceil(x0 / sx) * sx; x <= x1 + 1e-9; x += sx) { s += `<line x1="${f1(X(x))}" x2="${f1(X(x))}" y1="0" y2="${h}" stroke="var(--plot-grid)"/>`; if (Math.abs(x) > 1e-9) s += `<text x="${f1(X(x))}" y="${f1(Math.min(h - 4, Y(ax) + 15))}" text-anchor="middle">${+x.toFixed(4)}</text>`; }
      for (let y = Math.ceil(y0 / sy) * sy; y <= y1 + 1e-9; y += sy) { s += `<line y1="${f1(Y(y))}" y2="${f1(Y(y))}" x1="0" x2="${w}" stroke="var(--plot-grid)"/>`; if (Math.abs(y) > 1e-9) s += `<text x="${f1(Math.max(4, X(ay) - 6))}" y="${f1(Y(y) + 4)}" text-anchor="${X(ay) < 30 ? 'start' : 'end'}">${+y.toFixed(4)}</text>`; }
      s += `<line x1="0" x2="${w}" y1="${f1(Y(ax))}" y2="${f1(Y(ax))}" stroke="var(--plot-axis)" stroke-width="1.5"/><line y1="0" y2="${h}" x1="${f1(X(ay))}" x2="${f1(X(ay))}" stroke="var(--plot-axis)" stroke-width="1.5"/>`;
      s += `<text x="${w - 8}" y="${f1(Math.max(14, Y(ax) - 7))}" text-anchor="end">${lx || 'x'}</text><text x="${f1(Math.min(w - 20, X(ay) + 8))}" y="14">${ly || 'y'}</text>`;
      return P;
    },
    path(f, a, b) {
      a = a == null ? x0 : Math.max(a, x0); b = b == null ? x1 : Math.min(b, x1);
      let d = '', pen = false, prev = null; const n = 400, span = y1 - y0;
      for (let i = 0; i <= n; i++) {
        const x = a + (b - a) * i / n, y = f(x), ok = Number.isFinite(y) && y > y0 - span * 2 && y < y1 + span * 2 && (prev == null || Math.abs(y - prev) < span * 1.5);
        if (ok) { d += (pen ? 'L' : 'M') + f1(X(x)) + ' ' + f1(Y(y)); pen = true; prev = y; } else { pen = false; prev = null; }
      }
      return d;
    },
    fn(f, color, o) { o = o || {}; s += `<path d="${P.path(f, o.a, o.b)}" fill="none" stroke="${color || COL.g}" stroke-width="${o.w || 3}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''} stroke-linecap="round" stroke-linejoin="round" opacity="${o.op || 1}"/>`; return P; },
    area(f, a, b, color, g) {
      g = g || (() => 0); const n = 120; let d = '';
      for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; d += (i ? 'L' : 'M') + f1(X(x)) + ' ' + f1(Y(f(x))); }
      for (let i = n; i >= 0; i--) { const x = a + (b - a) * i / n; d += 'L' + f1(X(x)) + ' ' + f1(Y(g(x))); }
      s += `<path d="${d}Z" fill="${color || COL.g}" opacity=".28"/>`; return P;
    },
    line(xa, ya, xb, yb, color, o) { o = o || {}; s += `<line x1="${f1(X(xa))}" y1="${f1(Y(ya))}" x2="${f1(X(xb))}" y2="${f1(Y(yb))}" stroke="${color || COL.mute}" stroke-width="${o.w || 2}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''} stroke-linecap="round"/>`; return P; },
    rect(xa, ya, xb, yb, color, op) { s += `<rect x="${f1(X(Math.min(xa, xb)))}" y="${f1(Y(Math.max(ya, yb)))}" width="${f1(Math.abs(X(xb) - X(xa)))}" height="${f1(Math.abs(Y(yb) - Y(ya)))}" fill="${color}" opacity="${op || .3}" stroke="${color}"/>`; return P; },
    dot(x, y, color, rr, hollow) { s += `<circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="${rr || 6}" fill="${hollow ? 'var(--surface)' : color || COL.g}" stroke="${hollow ? color : 'var(--surface)'}" stroke-width="2.5"/>`; return P; },
    text(x, y, str, color, anchor) { s += `<text x="${f1(X(x))}" y="${f1(Y(y))}" text-anchor="${anchor || 'start'}" style="fill:${color || COL.text};font-size:14px;font-weight:900">${str}</text>`; return P; },
    raw(str) { s += str; return P; },
    html() { return `<svg class="plot" viewBox="0 0 ${w} ${h}" role="img">${s}</svg>`; }
  };
  return P;
}
/* Каркас симулятора: ползунки, переключатели, перетаскивание, анимация. */
function lab(root, cfg) {
  const st = Object.assign({}, cfg.init || {}); (cfg.ctl || []).forEach(c => { if (st[c.k] == null) st[c.k] = c.v; }); (cfg.seg || []).forEach(sg0 => { if (st[sg0.k] == null) st[sg0.k] = 0; });
  root.innerHTML = `<div class="lab"><div><div id="lab-plot"></div><div class="lab-note">${mx(cfg.note)}</div></div><div class="card">
   ${(cfg.seg || []).map((sg0, j) => `<div class="small muted" style="font-weight:800">${mx(sg0.label || t('fn'))}</div><div class="seg" data-seg="${j}">${sg0.opts.map((o, i) => `<button data-i="${i}" class="${i === st[sg0.k] ? 'active' : ''}">${mx(o)}</button>`).join('')}</div>`).join('')}
   ${(cfg.ctl || []).map(c => `<div class="ctl"><label><span>${mx(c.label)}</span><output id="out-${c.k}"></output></label><input type="range" id="ctl-${c.k}" min="${c.min}" max="${c.max}" step="${c.step}" value="${st[c.k]}"></div>`).join('')}
   ${cfg.anim ? `<button class="btn soft sm" id="lab-play">${t('pause')}</button>` : ''}
   <div class="readout" id="lab-read"></div>${cfg.quest ? `<div class="quest"><b>${t('explore')}</b><ul>${cfg.quest.map(q => `<li>${mx(q)}</li>`).join('')}</ul></div>` : ''}</div></div>`;
  const box = root.querySelector('#lab-plot'), read = root.querySelector('#lab-read');
  let P;
  const redraw = () => {
    const v = typeof cfg.view === 'function' ? cfg.view(st) : cfg.view; P = Plot(v[0], v[1], v[2], v[3]);
    const rd = cfg.draw(P, st) || []; box.innerHTML = P.html();
    read.innerHTML = rd.map(([a, b]) => `<div><span>${mx(a)}</span><b>${typeof b === 'number' ? n2(b) : mx(String(b))}</b></div>`).join('');
    (cfg.ctl || []).forEach(c => { root.querySelector('#out-' + c.k).textContent = c.fmt ? c.fmt(st[c.k]) : n2(st[c.k], 3); });
  };
  (cfg.ctl || []).forEach(c => { root.querySelector('#ctl-' + c.k).oninput = e => { st[c.k] = +e.target.value; redraw(); }; });
  root.querySelectorAll('.seg').forEach(el => { const sg0 = cfg.seg[+el.dataset.seg]; el.onclick = e => { const b = e.target.closest('button'); if (!b) return; st[sg0.k] = +b.dataset.i; el.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b)); if (sg0.reset) sg0.reset(st); redraw(); }; });
  if (cfg.drag) {
    let down = false;
    const mv = e => { const svg = box.querySelector('svg'), rc = svg.getBoundingClientRect(); if (!rc.width) return; cfg.drag(st, P.x0 + (e.clientX - rc.left) / rc.width * (P.x1 - P.x0), P.y1 - (e.clientY - rc.top) / rc.height * (P.y1 - P.y0)); (cfg.ctl || []).forEach(c => { root.querySelector('#ctl-' + c.k).value = st[c.k]; }); redraw(); };
    box.onpointerdown = e => { down = true; box.setPointerCapture && box.setPointerCapture(e.pointerId); mv(e); };
    box.onpointermove = e => { if (down) mv(e); }; box.onpointerup = box.onpointercancel = () => { down = false; };
    box.style.cursor = 'crosshair';
  }
  if (cfg.anim && typeof requestAnimationFrame === 'function') {
    let run = true, last = 0; const btn = root.querySelector('#lab-play');
    btn.onclick = () => { run = !run; btn.textContent = t(run ? 'pause' : 'play'); };
    const loop = ts => { if (!root.isConnected) return; if (run) { cfg.anim(st, last ? Math.min(.05, (ts - last) / 1000) : 0); redraw(); } last = ts; labRaf.push(requestAnimationFrame(loop)); };
    labRaf.push(requestAnimationFrame(loop));
  }
  redraw();
}
const dnum = (f, x) => (f(x + 1e-5) - f(x - 1e-5)) / 2e-5;
function rk(f, x, y, h, n) { const pts = [[x, y]]; for (let i = 0; i < n; i++) { const k1 = f(x, y), k2 = f(x + h / 2, y + h * k1 / 2), k3 = f(x + h / 2, y + h * k2 / 2), k4 = f(x + h, y + h * k3); y += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6; x += h; if (!Number.isFinite(y) || Math.abs(y) > 1e3) break; pts.push([x, y]); } return pts; }
const poly2 = (P, pts, color, w) => P.raw(`<polyline points="${pts.map(p => P.X(p[0]).toFixed(1) + ',' + P.Y(p[1]).toFixed(1)).join(' ')}" fill="none" stroke="${color}" stroke-width="${w || 3}" stroke-linejoin="round"/>`);
const LABS = {};

LABS.limit = (root, tp) => {
  const F = [{ n: R`$\frac{x^2-1}{x-1}$`, f: x => x === 1 ? NaN : x + 1, a: 1, A: 2 }, { n: R`$\frac{\sin x}{x}$`, f: x => x ? Math.sin(x) / x : NaN, a: 0, A: 1 }, { n: L('скачок', 'секіріс', 'jump'), f: x => x < 1 ? x + 1 : x + 2, a: 1, A: null }, { n: R`$\frac{1}{(x-1)^2}$`, f: x => 1 / (x - 1) ** 2, a: 1, A: Infinity }];
  lab(root, { view: [-3, 5, -1, 5], init: { fn: tp.id === 'continuity' ? 2 : tp.id === 'indeterminate' ? 1 : 0 }, seg: [{ k: 'fn', opts: F.map(x => x.n) }],
    ctl: [{ k: 'e', label: L('расстояние до точки $\\delta$', 'нүктеге дейінгі қашықтық $\\delta$', 'distance to the point $\\delta$'), min: -3, max: 0.3, step: 0.05, v: 0, fmt: v => n2(10 ** v, 4) }],
    draw(P, s) { const o = F[s.fn], d = 10 ** s.e, l = o.f(o.a - d), rr = o.f(o.a + d);
      P.grid().fn(o.f, COL.g, { b: o.a - 1e-3 }).fn(o.f, COL.g, { a: o.a + 1e-3 }).line(o.a, P.y0, o.a, P.y1, COL.mute, { dash: '5 5' });
      if (Number.isFinite(o.A)) P.dot(o.a, o.A, COL.g, 6, true);
      if (s.fn === 2) P.dot(1, 2, COL.g, 6, true).dot(1, 3, COL.g, 6);
      P.dot(o.a - d, l, COL.pink).dot(o.a + d, rr, COL.orange);
      return [[`$x=a-\\delta$`, o.a - d], [`$x=a+\\delta$`, o.a + d], [L('$f$ слева', '$f$ сол жақта', '$f$ on the left'), n2(l, 5)], [L('$f$ справа', '$f$ оң жақта', '$f$ on the right'), n2(rr, 5)], [L('предел', 'шек', 'limit'), o.A == null ? L('не существует', 'жоқ', 'does not exist') : o.A === Infinity ? '$\\infty$' : o.A]]; },
    note: L('Розовая точка подходит к $a$ слева, оранжевая — справа. В самой точке функции может не быть (пустой кружок), но предел — это то, куда «целятся» значения.', 'Қызғылт нүкте $a$-ға сол жақтан, қызғылт сары нүкте оң жақтан жақындайды. Нүктенің өзінде функция болмауы мүмкін (бос дөңгелек), бірақ шек — мәндер «көздейтін» жер.', 'The pink point approaches $a$ from the left, the orange one from the right. The function may be missing at the point itself (hollow circle), but the limit is where the values are aiming.'),
    quest: [L('Уменьшайте $\\delta$: сходятся ли значения слева и справа к одному числу?', '$\\delta$-ны азайтыңыз: сол және оң жақ мәндер бір санға жинақтала ма?', 'Shrink $\\delta$: do the left and right values meet at one number?'), L('Что происходит у «скачка»? Почему предела нет?', '«Секірісте» не болады? Неге шек жоқ?', 'What happens at the jump? Why is there no limit?')] });
};
LABS.continuity = LABS.sinc = LABS.limit;

LABS.asymptote = root => lab(root, { view: [-8, 8, -8, 8],
  ctl: [{ k: 'k', label: L('наклон $k$', 'көлбеулік $k$', 'slope $k$'), min: -1.5, max: 1.5, step: 0.25, v: 0.5 }, { k: 'b', label: '$b$', min: -4, max: 4, step: 0.5, v: 1 }, { k: 'c', label: '$c$', min: -5, max: 5, step: 0.5, v: 2 }],
  draw(P, s) { const f = x => s.k * x + s.b + 2 / (x - s.c);
    P.grid().line(s.c, P.y0, s.c, P.y1, COL.pink, { dash: '7 6' }).line(P.x0, s.k * P.x0 + s.b, P.x1, s.k * P.x1 + s.b, COL.orange, { dash: '7 6' }).fn(f, COL.g, { b: s.c - .01 }).fn(f, COL.g, { a: s.c + .01 });
    return [[L('вертикальная', 'вертикаль', 'vertical'), `$x=${n2(s.c)}$`], [s.k ? L('наклонная', 'көлбеу', 'oblique') : L('горизонтальная', 'горизонталь', 'horizontal'), `$y=${s.k ? n2(s.k) + 'x' : ''}${s.b < 0 ? '' : s.k ? '+' : ''}${n2(s.b)}$`]]; },
  note: L('График $f(x)=kx+b+\\dfrac{2}{x-c}$. Вдали добавка $\\frac{2}{x-c}$ исчезает, и график «прилипает» к прямой $y=kx+b$; возле $x=c$ он улетает в бесконечность.', '$f(x)=kx+b+\\dfrac{2}{x-c}$ графигі. Алыста $\\frac{2}{x-c}$ қосындысы жойылып, график $y=kx+b$ түзуіне «жабысады»; $x=c$ маңында ол шексіздікке кетеді.', 'The graph of $f(x)=kx+b+\\dfrac{2}{x-c}$. Far away the term $\\frac{2}{x-c}$ fades and the graph hugs the line $y=kx+b$; near $x=c$ it shoots off to infinity.'),
  quest: [L('Поставьте $k=0$: наклонная асимптота станет горизонтальной.', '$k=0$ қойыңыз: көлбеу асимптота горизонтальға айналады.', 'Set $k=0$: the oblique asymptote becomes horizontal.')] });

LABS.sequence = root => {
  const Q = [{ n: R`$1+\frac1n$`, f: n => 1 + 1 / n, A: 1 }, { n: R`$\frac{(-1)^n}{n}$`, f: n => (-1) ** n / n, A: 0 }, { n: R`$\left(1+\frac1n\right)^n$`, f: n => (1 + 1 / n) ** n, A: Math.E }, { n: '$(-1)^n$', f: n => (-1) ** n, A: null }];
  lab(root, { view: [0, 41, -1.5, 3.2], seg: [{ k: 'q', opts: Q.map(x => x.n), label: '$a_n$' }], ctl: [{ k: 'e', label: '$\\varepsilon$', min: 0.02, max: 1, step: 0.02, v: 0.3 }],
    draw(P, s) { const o = Q[s.q]; P.grid('n', 'aₙ'); let N = null;
      if (o.A != null) { P.rect(0, o.A - s.e, 41, o.A + s.e, COL.green, .18).line(0, o.A, 41, o.A, COL.green, { dash: '6 5' }); N = 1; for (let n = 2000; n >= 1; n--) if (Math.abs(o.f(n) - o.A) >= s.e) { N = n + 1; break; } }
      for (let n = 1; n <= 40; n++) P.dot(n, o.f(n), o.A != null && Math.abs(o.f(n) - o.A) < s.e ? COL.green : COL.pink, 4.5);
      return [[L('предел $A$', 'шек $A$', 'limit $A$'), o.A == null ? L('нет', 'жоқ', 'none') : o.A], [L('все члены в полосе с $n=$', 'барлық мүше жолақта, $n=$', 'all terms in the band from $n=$'), N == null ? '—' : String(N)]]; },
    note: L('Зелёная полоса — «коридор» $A\\pm\\varepsilon$. Предел равен $A$, если для любого, даже очень узкого коридора найдётся номер, после которого все точки внутри.', 'Жасыл жолақ — $A\\pm\\varepsilon$ «дәлізі». Кез келген, тіпті өте тар дәліз үшін де одан кейінгі барлық нүкте ішінде жататын нөмір табылса, шек $A$-ға тең.', 'The green band is the corridor $A\\pm\\varepsilon$. The limit is $A$ if for any corridor, however narrow, there is an index after which all points stay inside.'),
    quest: [L('Сужайте коридор: как меняется номер $N$?', 'Дәлізді тарылтыңыз: $N$ нөмірі қалай өзгереді?', 'Narrow the corridor: how does $N$ change?'), L('Почему для $(-1)^n$ коридор подобрать нельзя?', '$(-1)^n$ үшін неге дәліз таңдау мүмкін емес?', 'Why is there no corridor for $(-1)^n$?')] });
};

LABS.secant = (root, tp) => {
  const F = [{ n: '$x^2$', f: x => x * x }, { n: '$\\sin x$', f: Math.sin }, { n: R`$\frac{x^3}{4}-x$`, f: x => x ** 3 / 4 - x }, { n: '$\\sqrt{x+3}$', f: x => Math.sqrt(Math.max(0, x + 3)) }];
  lab(root, { view: [-3, 3.5, -2.5, 6], seg: [{ k: 'fn', opts: F.map(x => x.n) }],
    ctl: [{ k: 'x', label: '$x_0$', min: -2.5, max: 2.5, step: 0.05, v: 1 }, { k: 'h', label: '$\\Delta x$', min: -2.5, max: 1.5, step: 0.05, v: 1, fmt: v => n2(v || 0.001, 3) }],
    drag(s, x) { s.x = Math.max(-2.5, Math.min(2.5, Math.round(x * 20) / 20)); },
    draw(P, s) { const f = F[s.fn].f, h = s.h || 0.001, y = f(s.x), y2 = f(s.x + h), k = dnum(f, s.x), sec = (y2 - y) / h;
      P.grid().fn(f).line(P.x0, y + k * (P.x0 - s.x), P.x1, y + k * (P.x1 - s.x), COL.green, { w: 2.5 }).line(P.x0, y + sec * (P.x0 - s.x), P.x1, y + sec * (P.x1 - s.x), COL.pink, { dash: '7 5' })
        .line(s.x, y, s.x + h, y, COL.orange, { w: 3 }).line(s.x + h, y, s.x + h, y2, COL.cyan, { w: 3 }).text(s.x + h / 2, y - .25, 'Δx', COL.orange, 'middle').text(s.x + h + .08, (y + y2) / 2, 'Δy', COL.cyan).dot(s.x + h, y2, COL.pink).dot(s.x, y, COL.g, 7);
      return [['$\\Delta y$', n2(y2 - y, 4)], [L('секущая $\\frac{\\Delta y}{\\Delta x}$', 'қиюшы $\\frac{\\Delta y}{\\Delta x}$', 'secant $\\frac{\\Delta y}{\\Delta x}$'), n2(sec, 4)], [L("касательная $f'(x_0)$", "жанама $f'(x_0)$", "tangent $f'(x_0)$"), n2(k, 4)], ["$dy=f'(x_0)\\Delta x$", n2(k * h, 4)], [L('касательная', 'жанама', 'tangent line'), `$y=${n2(k)}x${y - k * s.x < 0 ? '' : '+'}${n2(y - k * s.x)}$`]]; },
    note: tp.id === 'differential' ? L('Голубой отрезок — настоящее приращение $\\Delta y$. Дифференциал $dy$ — приращение вдоль зелёной касательной. При малых $\\Delta x$ они почти совпадают.', 'Көгілдір кесінді — нақты өсімше $\\Delta y$. Дифференциал $dy$ — жасыл жанама бойымен өсімше. Кіші $\\Delta x$ үшін олар дерлік беттеседі.', 'The cyan segment is the true increment $\\Delta y$. The differential $dy$ is the rise along the green tangent. For small $\\Delta x$ they nearly coincide.')
      : L('Розовая пунктирная прямая — секущая через две точки графика. Уменьшайте $\\Delta x$: секущая поворачивается и сливается с зелёной касательной, а её наклон стремится к производной.', 'Қызғылт үзік сызық — графиктің екі нүктесі арқылы өтетін қиюшы. $\\Delta x$-ті азайтыңыз: қиюшы бұрылып, жасыл жанамамен бірігеді, ал көлбеулігі туындыға ұмтылады.', 'The dashed pink line is the secant through two points. Shrink $\\Delta x$: the secant turns and merges with the green tangent, and its slope tends to the derivative.'),
    quest: [L('Перетащите точку по графику мышью или пальцем.', 'Нүктені график бойымен тінтуірмен немесе саусақпен сүйреңіз.', 'Drag the point along the graph.'), L('Найдите точку, где касательная горизонтальна. Чему там равна производная?', 'Жанама горизонталь болатын нүктені табыңыз. Онда туынды неге тең?', 'Find where the tangent is horizontal. What is the derivative there?')] });
};
LABS.differential = LABS.tangent = LABS.secant;

LABS.dbuilder = (root, tp) => {
  const sets = { 'diff-rules': [['$x^2$', x => x * x], [R`$\frac{x^3}{3}-x$`, x => x ** 3 / 3 - x], ['$xe^{-x}$', x => x * Math.exp(-x)], [R`$\frac{1}{x^2+1}$`, x => 1 / (x * x + 1)]], 'chain-rule': [['$\\sin 2x$', x => Math.sin(2 * x)], ['$(x/2)^3$', x => (x / 2) ** 3], ['$e^{-x^2}$', x => Math.exp(-x * x)], ['$\\sqrt{x^2+1}$', x => Math.sqrt(x * x + 1)]], 'trig-derivatives': [['$\\sin x$', Math.sin], ['$\\cos x$', Math.cos], [R`$\operatorname{tg}x$`, Math.tan], [R`$\operatorname{arctg}x$`, Math.atan]] };
  const F = sets[tp.id] || sets['diff-rules'];
  lab(root, { view: [-3.3, 3.3, -3, 3], init: { seen: {} }, seg: [{ k: 'fn', opts: F.map(x => x[0]), reset: s => { s.seen = {}; } }], ctl: [{ k: 'x', label: '$x_0$', min: -3, max: 3, step: 0.05, v: -2 }],
    drag(s, x) { s.x = Math.max(-3, Math.min(3, Math.round(x * 20) / 20)); },
    draw(P, s) { const f = F[s.fn][1], y = f(s.x), k = dnum(f, s.x); s.seen[Math.round(s.x * 20)] = 1;
      P.grid().fn(f).line(s.x - 1, y - k, s.x + 1, y + k, COL.green, { w: 2.5 });
      Object.keys(s.seen).forEach(i => { const x = i / 20, d = dnum(f, x); if (Math.abs(d) < 3.2) P.dot(x, d, COL.pink, 3); });
      P.line(s.x, y, s.x, k, COL.mute, { dash: '3 4', w: 1 }).dot(s.x, y, COL.g, 7).dot(s.x, k, COL.pink, 6);
      return [['$f(x_0)$', n2(y, 3)], ["$f'(x_0)$", n2(k, 3)], [L('точек производной', 'туынды нүктелері', 'derivative points'), String(Object.keys(s.seen).length)]]; },
    note: L('Ведите точку по графику $f$ (фиолетовый). Наклон зелёной касательной в каждой точке откладывается розовой точкой — так «рисуется» график производной $f\'$.', '$f$ графигі (күлгін) бойымен нүктені жүргізіңіз. Жасыл жанаманың әр нүктедегі көлбеулігі қызғылт нүктемен белгіленеді — осылай $f\'$ туындысының графигі «салынады».', 'Move the point along $f$ (violet). The slope of the green tangent at each position is plotted as a pink dot — this is how the graph of $f\'$ gets drawn.'),
    quest: [L('Пройдите весь график и угадайте формулу $f\'(x)$ по розовой кривой.', 'Бүкіл графикті жүріп өтіп, қызғылт қисық бойынша $f\'(x)$ формуласын табыңыз.', 'Sweep the whole graph and guess the formula of $f\'(x)$ from the pink curve.'), L('Где $f$ растёт, розовые точки выше оси. Почему?', '$f$ өсетін жерде қызғылт нүктелер осьтен жоғары. Неге?', 'Where $f$ rises the pink dots are above the axis. Why?')] });
};
LABS.chain = LABS.trigder = LABS.dbuilder;

LABS.motion = root => {
  const F = [[L('разгон $s=t^2$', 'үдеу $s=t^2$', 'speeding up $s=t^2$'), t0 => t0 * t0], [L('торможение $s=8t-t^2$', 'тежелу $s=8t-t^2$', 'braking $s=8t-t^2$'), t0 => 8 * t0 - t0 * t0], [L('туда-обратно $s=t^3-6t^2+9t$', 'барып-қайту $s=t^3-6t^2+9t$', 'back and forth $s=t^3-6t^2+9t$'), t0 => t0 ** 3 - 6 * t0 * t0 + 9 * t0]];
  lab(root, { view: [0, 4.2, -3, 18], seg: [{ k: 'fn', opts: F.map(x => x[0]), label: L('Закон движения', 'Қозғалыс заңы', 'Law of motion') }], ctl: [{ k: 't', label: '$t$, ' + L('с', 'с', 's'), min: 0, max: 4, step: 0.02, v: 1 }],
    anim(s, dt) { s.t = (s.t + dt * .6) % 4; }, drag(s, x) { s.t = Math.max(0, Math.min(4, x)); },
    draw(P, s) { const f = F[s.fn][1], y = f(s.t), v = dnum(f, s.t), a = (f(s.t + 1e-3) - 2 * y + f(s.t - 1e-3)) / 1e-6, cx = 20 + y / 17 * (P.w - 70);
      P.grid('t', 's').fn(f).line(s.t - .8, y - .8 * v, s.t + .8, y + .8 * v, COL.green, { w: 2.5 }).dot(s.t, y, COL.g, 7)
        .raw(`<line x1="10" x2="${P.w - 10}" y1="${P.h - 14}" y2="${P.h - 14}" stroke="var(--plot-axis)" stroke-width="3"/><text x="${cx}" y="${P.h - 20}" style="font-size:26px">🚗</text>`);
      return [['$s(t)$, ' + L('м', 'м', 'm'), y], ["$v=s'(t)$, " + L('м/с', 'м/с', 'm/s'), v], ["$a=v'(t)$, " + L('м/с²', 'м/с²', 'm/s²'), a], [L('движение', 'қозғалыс', 'motion'), Math.abs(v) < .05 ? L('остановка', 'тоқтау', 'stop') : v > 0 ? L('вперёд →', 'алға →', 'forward →') : L('← назад', '← артқа', '← backward')]]; },
    note: L('График — путь $s(t)$. Наклон касательной в каждый момент — это скорость: круче график — быстрее машина. Когда касательная горизонтальна, машина стоит.', 'График — $s(t)$ жолы. Әр мезеттегі жанаманың көлбеулігі — жылдамдық: график неғұрлым тік болса, машина соғұрлым жылдам. Жанама горизонталь болғанда машина тұр.', 'The graph is the position $s(t)$. The slope of the tangent at each moment is the velocity: the steeper the graph, the faster the car. A horizontal tangent means the car is at rest.'),
    quest: [L('В режиме «туда-обратно» найдите моменты разворота. Чему равна скорость?', '«Барып-қайту» режимінде бұрылу мезеттерін табыңыз. Жылдамдық неге тең?', 'In “back and forth” mode find the turning moments. What is the velocity there?')] });
};

LABS.study = (root, tp) => lab(root, { view: [-4, 4, -8, 8],
  ctl: [{ k: 'a', label: '$a$', min: -3, max: 3, step: 0.25, v: 0 }, { k: 'b', label: '$b$', min: -4, max: 3, step: 0.25, v: -3 }, { k: 'c', label: '$c$', min: -4, max: 4, step: 0.5, v: 0 }],
  draw(P, s) { const f = x => x ** 3 + s.a * x * x + s.b * x + s.c, d = x => 3 * x * x + 2 * s.a * x + s.b, D = s.a * s.a - 3 * s.b, conv = tp.id === 'convexity', xi = -s.a / 3;
    P.grid();
    const cr = D > 1e-9 ? [(-s.a - Math.sqrt(D)) / 3, (-s.a + Math.sqrt(D)) / 3] : [];
    const cuts = conv ? [P.x0, xi, P.x1] : [P.x0, ...cr, P.x1];
    for (let i = 0; i < cuts.length - 1; i++) { const mid = (cuts[i] + cuts[i + 1]) / 2, up = conv ? mid > xi : d(mid) > 0; P.fn(f, up ? COL.green : COL.pink, { a: cuts[i], b: cuts[i + 1], w: 3.5 }); }
    P.fn(d, COL.orange, { dash: '6 5', w: 2, op: .8 });
    if (!conv) cr.forEach((x, i) => P.dot(x, f(x), i ? COL.cyan : COL.orange, 7).text(x, f(x) + (i ? -1 : .6), i ? 'min' : 'max', COL.text, 'middle'));
    P.dot(xi, f(xi), COL.g, 5, true);
    return [[L('критические точки', 'кризистік нүктелер', 'critical points'), cr.length ? cr.map(x => n2(x)).join('; ') : L('нет', 'жоқ', 'none')], [L('точка перегиба', 'иілу нүктесі', 'inflection point'), xi], ["$f'(x)$", `$3x^2${s.a < 0 ? '' : '+'}${n2(2 * s.a)}x${s.b < 0 ? '' : '+'}${n2(s.b)}$`], ["$f''(x)$", `$6x${s.a < 0 ? '' : '+'}${n2(2 * s.a)}$`]]; },
  note: tp.id === 'convexity' ? L('$f(x)=x^3+ax^2+bx+c$. Зелёным показана часть, где график выпуклый вниз ($f\'\'>0$, «чаша»), розовым — выпуклый вверх ($f\'\'<0$, «горка»). Пустой кружок — точка перегиба.', '$f(x)=x^3+ax^2+bx+c$. Жасылмен график төмен дөңес бөлік ($f\'\'>0$, «тостаған»), қызғылтпен жоғары дөңес бөлік ($f\'\'<0$, «төбешік») көрсетілген. Бос дөңгелек — иілу нүктесі.', '$f(x)=x^3+ax^2+bx+c$. Green: the graph is convex down ($f\'\'>0$, a “cup”); pink: convex up ($f\'\'<0$, a “hill”). The hollow circle is the inflection point.')
    : L('$f(x)=x^3+ax^2+bx+c$. Зелёные участки — функция возрастает ($f\'>0$), розовые — убывает ($f\'<0$). Оранжевый пунктир — график производной: где он пересекает ось, там экстремум.', '$f(x)=x^3+ax^2+bx+c$. Жасыл бөліктер — функция өседі ($f\'>0$), қызғылт — кемиді ($f\'<0$). Қызғылт сары үзік сызық — туынды графигі: ол осьті қиған жерде экстремум бар.', '$f(x)=x^3+ax^2+bx+c$. Green parts: increasing ($f\'>0$); pink: decreasing ($f\'<0$). The dashed orange curve is the derivative: where it crosses the axis there is an extremum.'),
  quest: [L('Подберите $a$ и $b$ так, чтобы экстремумы исчезли. Что стало с графиком $f\'$?', 'Экстремумдар жойылатындай $a$ мен $b$-ны таңдаңыз. $f\'$ графигі не болды?', 'Choose $a$ and $b$ so that the extrema disappear. What happened to the graph of $f\'$?'), L('Меняет ли $c$ точки экстремума?', '$c$ экстремум нүктелерін өзгерте ме?', 'Does $c$ move the extremum points?')] });

LABS.box = root => lab(root, { view: s => [0, s.a / 2, 0, 2 * s.a ** 3 / 27 * 1.15],
  ctl: [{ k: 'a', label: L('сторона листа $a$, см', 'парақ қабырғасы $a$, см', 'sheet side $a$, cm'), min: 6, max: 24, step: 1, v: 12 }, { k: 'x', label: L('вырез $x$, см', 'ойық $x$, см', 'cut $x$, cm'), min: 0.1, max: 12, step: 0.1, v: 1 }],
  draw(P, s) { const x = Math.min(s.x, s.a / 2 - .05), V = q => q * (s.a - 2 * q) ** 2, k = 150 / s.a, o = P.w - 170;
    P.grid('x', 'V').area(V, 0, x, COL.g).fn(V).line(s.a / 6, 0, s.a / 6, V(s.a / 6), COL.green, { dash: '5 5' }).dot(s.a / 6, V(s.a / 6), COL.green, 5).dot(x, V(x), COL.pink, 7)
      .raw(`<g transform="translate(${o},12)"><rect width="150" height="150" fill="var(--soft)" stroke="var(--plot-axis)"/><rect x="${x * k}" y="${x * k}" width="${150 - 2 * x * k}" height="${150 - 2 * x * k}" fill="var(--g)" opacity=".35"/>${[[0, 0], [1, 0], [0, 1], [1, 1]].map(([i, j]) => `<rect x="${i * (150 - x * k)}" y="${j * (150 - x * k)}" width="${x * k}" height="${x * k}" fill="var(--pink)" opacity=".6"/>`).join('')}</g>`);
    return [[L('дно', 'табаны', 'base'), `$${n2(s.a - 2 * x)}\\times${n2(s.a - 2 * x)}$`], [L('объём $V$, см³', 'көлем $V$, см³', 'volume $V$, cm³'), V(x)], [L('лучший вырез $a/6$', 'ең тиімді ойық $a/6$', 'best cut $a/6$'), s.a / 6], ['$V_{\\max}$', V(s.a / 6)]]; },
  note: L('Из квадратного листа вырезают по углам квадратики со стороной $x$ и сгибают коробку: $V(x)=x(a-2x)^2$. Маленький вырез — низкая коробка, большой — узкое дно. Максимум там, где $V\'(x)=0$.', 'Шаршы парақтың бұрыштарынан қабырғасы $x$ шаршылар қиып алып, қорап бүктейді: $V(x)=x(a-2x)^2$. Кіші ойық — аласа қорап, үлкен ойық — тар табан. Максимум $V\'(x)=0$ болатын жерде.', 'Cut squares of side $x$ from the corners of a square sheet and fold a box: $V(x)=x(a-2x)^2$. A small cut gives a shallow box, a large cut a narrow base. The maximum is where $V\'(x)=0$.'),
  quest: [L('Найдите ползунком наибольший объём и сравните $x$ с $a/6$.', 'Жүгірткімен ең үлкен көлемді тауып, $x$-ті $a/6$-мен салыстырыңыз.', 'Find the largest volume with the slider and compare $x$ with $a/6$.')] });

LABS.family = root => {
  const F = [['$2x$', x => 2 * x, x => x * x, 'x^2'], ['$\\cos x$', Math.cos, Math.sin, '\\sin x'], ['$3x^2-3$', x => 3 * x * x - 3, x => x ** 3 - 3 * x, 'x^3-3x'], ['$e^x$', Math.exp, Math.exp, 'e^x']];
  lab(root, { view: [-3.2, 3.2, -6, 6], seg: [{ k: 'fn', opts: F.map(x => x[0]), label: '$f(x)$' }], ctl: [{ k: 'C', label: '$C$', min: -5, max: 5, step: 0.25, v: 0 }, { k: 'x', label: '$x_0$', min: -3, max: 3, step: 0.05, v: 1 }],
    draw(P, s) { const o = F[s.fn], G = x => o[2](x) + s.C, k = o[1](s.x);
      P.grid(); for (let c = -6; c <= 6; c += 2) P.fn(x => o[2](x) + c, COL.g, { w: 1.2, op: .3 });
      P.fn(o[1], COL.orange, { dash: '6 5', w: 2 }).fn(G).line(s.x - 1, G(s.x) - k, s.x + 1, G(s.x) + k, COL.green, { w: 2.5 }).dot(s.x, G(s.x), COL.g, 6).dot(s.x, k, COL.orange, 5);
      return [['$F(x)$', `$${o[3]}${s.C < 0 ? '' : '+'}${n2(s.C)}$`], [L('наклон $F$ в $x_0$', '$x_0$-дегі $F$ көлбеулігі', 'slope of $F$ at $x_0$'), k], ['$f(x_0)$', o[1](s.x)]]; },
    note: L('Оранжевый пунктир — функция $f$. Фиолетовые кривые — её первообразные $F(x)+C$: все они одинаковой формы и отличаются только сдвигом вверх-вниз. Наклон любой из них в точке $x_0$ равен $f(x_0)$.', 'Қызғылт сары үзік сызық — $f$ функциясы. Күлгін қисықтар — оның алғашқы функциялары $F(x)+C$: бәрінің пішіні бірдей, тек жоғары-төмен жылжуымен ерекшеленеді. Кез келгенінің $x_0$ нүктесіндегі көлбеулігі $f(x_0)$-ге тең.', 'The dashed orange curve is $f$. The violet curves are its antiderivatives $F(x)+C$: same shape, shifted up or down. The slope of any of them at $x_0$ equals $f(x_0)$.'),
    quest: [L('Меняйте $C$: меняется ли наклон касательной?', '$C$-ны өзгертіңіз: жанама көлбеулігі өзгере ме?', 'Change $C$: does the slope of the tangent change?')] });
};

LABS.riemann = root => {
  const F = [['$x^2$', x => x * x, x => x ** 3 / 3], ['$\\sin x+1{,}5$', x => Math.sin(x) + 1.5, x => -Math.cos(x) + 1.5 * x], ['$4-x^2$', x => 4 - x * x, x => 4 * x - x ** 3 / 3]];
  lab(root, { view: [-0.3, 3.3, -0.6, 5], seg: [{ k: 'fn', opts: F.map(x => x[0]) }, { k: 'm', label: L('Высота столбика', 'Бағана биіктігі', 'Bar height'), opts: [L('слева', 'сол жақтан', 'left'), L('середина', 'ортасынан', 'midpoint'), L('справа', 'оң жақтан', 'right')] }],
    ctl: [{ k: 'n', label: L('число столбиков $n$', 'бағана саны $n$', 'number of bars $n$'), min: 1, max: 80, step: 1, v: 6, fmt: v => v }, { k: 'b', label: '$b$', min: 0.5, max: 2, step: 0.1, v: 2 }],
    draw(P, s) { const o = F[s.fn], h = s.b / s.n; let sum = 0; P.grid();
      for (let i = 0; i < s.n; i++) { const y = o[1](i * h + h * s.m / 2); sum += y * h; P.rect(i * h, 0, (i + 1) * h, y, COL.g, .3); }
      P.fn(o[1], COL.pink); const ex = o[2](s.b) - o[2](0);
      return [[L('сумма площадей', 'аудандар қосындысы', 'sum of areas'), n2(sum, 4)], [`$\\int_0^{${n2(s.b)}}f\\,dx$`, n2(ex, 4)], [L('погрешность', 'қателік', 'error'), n2(Math.abs(sum - ex), 4)]]; },
    note: L('Площадь под кривой приближаем суммой площадей прямоугольников. Чем их больше, тем точнее. Предел этих сумм при $n\\to\\infty$ и есть определённый интеграл.', 'Қисық астындағы ауданды тіктөртбұрыштар аудандарының қосындысымен жуықтаймыз. Олар неғұрлым көп болса, соғұрлым дәл. Осы қосындылардың $n\\to\\infty$ кездегі шегі — анықталған интеграл.', 'We approximate the area under the curve by a sum of rectangles. The more rectangles, the better. The limit of these sums as $n\\to\\infty$ is the definite integral.'),
    quest: [L('При каком $n$ погрешность меньше 0,01? Какой способ точнее?', 'Қандай $n$ кезінде қателік 0,01-ден кіші? Қай тәсіл дәлірек?', 'For which $n$ is the error below 0.01? Which rule is more accurate?')] });
};

LABS.area = root => lab(root, { view: [-4, 4, -2, 10],
  ctl: [{ k: 'k', label: '$k$', min: -2, max: 2, step: 0.25, v: 1 }, { k: 'm', label: '$m$', min: 0.25, max: 6, step: 0.25, v: 2 }],
  draw(P, s) { const f = x => x * x, g = x => s.k * x + s.m, D = Math.sqrt(Math.max(0, s.k * s.k + 4 * s.m)), a = (s.k - D) / 2, b = (s.k + D) / 2;
    P.grid().area(g, a, b, COL.g, f).fn(f, COL.pink).fn(g, COL.cyan).dot(a, f(a), COL.orange).dot(b, f(b), COL.orange);
    return [['$x_1$', a], ['$x_2$', b], [`$S=\\int_{x_1}^{x_2}(kx+m-x^2)\\,dx$`, n2(D ** 3 / 6, 3)]]; },
  note: L('Фигура между параболой $y=x^2$ и прямой $y=kx+m$. Границы интегрирования — абсциссы точек пересечения; под интегралом «верхняя минус нижняя».', '$y=x^2$ параболасы мен $y=kx+m$ түзуі арасындағы фигура. Интегралдау шектері — қиылысу нүктелерінің абсциссалары; интеграл астында «жоғарғы минус төменгі».', 'The region between the parabola $y=x^2$ and the line $y=kx+m$. The limits are the $x$-coordinates of the intersections; integrate “top minus bottom”.'),
  quest: [L('Проверьте для $k=0$, $m=4$: $S=\\frac{32}{3}$.', '$k=0$, $m=4$ үшін тексеріңіз: $S=\\frac{32}{3}$.', 'Check for $k=0$, $m=4$: $S=\\frac{32}{3}$.')] });

LABS.volume = root => {
  const F = [['$\\sqrt{x}$', Math.sqrt, b => PI * b * b / 2], ['$x/2$', x => x / 2, b => PI * b ** 3 / 12], ['$1{,}5$', () => 1.5, b => PI * 2.25 * b], ['$\\sqrt{4-(x-2)^2}$', x => Math.sqrt(Math.max(0, 4 - (x - 2) ** 2)), b => PI * (2 * b * b - b ** 3 / 3)]];
  lab(root, { view: [-0.5, 4.5, -2.6, 2.6], seg: [{ k: 'fn', opts: F.map(x => x[0]), label: '$y=f(x)$' }], ctl: [{ k: 'n', label: L('число дисков', 'дискілер саны', 'number of disks'), min: 2, max: 60, step: 1, v: 10, fmt: v => v }, { k: 'b', label: '$b$', min: 1, max: 4, step: 0.25, v: 4 }],
    draw(P, s) { const o = F[s.fn], h = s.b / s.n; let V = 0; P.grid();
      for (let i = 0; i < s.n; i++) { const x = (i + .5) * h, y = o[1](x); V += PI * y * y * h; const w = P.X(h) - P.X(0), ry = P.Y(0) - P.Y(y), rx = Math.min(14, ry * .22);
        P.raw(`<rect x="${P.X(i * h).toFixed(1)}" y="${P.Y(y).toFixed(1)}" width="${w.toFixed(1)}" height="${(2 * ry).toFixed(1)}" fill="var(--g)" opacity=".22"/><ellipse cx="${P.X((i + 1) * h).toFixed(1)}" cy="${P.Y(0).toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="var(--g)" opacity=".25" stroke="var(--g)"/>`); }
      P.fn(o[1], COL.pink, { a: 0, b: s.b }).fn(x => -o[1](x), COL.pink, { a: 0, b: s.b, dash: '5 5', w: 2 });
      return [[L('сумма дисков', 'дискілер қосындысы', 'sum of disks'), n2(V, 3)], [`$V=\\pi\\int_0^b f^2dx$`, n2(o[2](s.b), 3)], ['$V/\\pi$', n2(o[2](s.b) / PI, 3)]]; },
    note: L('Кривую вращают вокруг оси $Ox$. Тело режем на тонкие диски: объём диска $\\pi f^2(x)\\,\\Delta x$. Сумма дисков при $n\\to\\infty$ даёт $V=\\pi\\int f^2(x)\\,dx$.', 'Қисықты $Ox$ осінен айналдырады. Денені жұқа дискілерге кесеміз: диск көлемі $\\pi f^2(x)\\,\\Delta x$. Дискілер қосындысы $n\\to\\infty$ кезінде $V=\\pi\\int f^2(x)\\,dx$ береді.', 'The curve is rotated about the $x$-axis. Slice the solid into thin disks of volume $\\pi f^2(x)\\,\\Delta x$. As $n\\to\\infty$ their sum gives $V=\\pi\\int f^2(x)\\,dx$.'),
    quest: [L('Какие тела получаются из $y=x/2$, $y=1{,}5$ и полуокружности?', '$y=x/2$, $y=1{,}5$ және жарты шеңберден қандай денелер шығады?', 'Which solids come from $y=x/2$, $y=1.5$ and the semicircle?')] });
};

LABS.work = root => lab(root, { view: [0, 10, -2, 22],
  ctl: [{ k: 'v', label: '$v_0$, ' + L('м/с', 'м/с', 'm/s'), min: 0, max: 20, step: 1, v: 4 }, { k: 'a', label: '$a$, ' + L('м/с²', 'м/с²', 'm/s²'), min: -3, max: 3, step: 0.25, v: 1 }, { k: 'T', label: '$T$, ' + L('с', 'с', 's'), min: 0.5, max: 10, step: 0.1, v: 5 }],
  draw(P, s) { const f = x => s.v + s.a * x, d = s.v * s.T + s.a * s.T * s.T / 2;
    P.grid('t', 'v').area(f, 0, s.T, COL.g).fn(f, COL.pink).line(s.T, 0, s.T, f(s.T), COL.g, { dash: '5 5' }).dot(s.T, f(s.T), COL.pink);
    return [['$v(T)$', f(s.T)], [`$s=\\int_0^T v\\,dt$, ` + L('м', 'м', 'm'), d], [L('формула', 'формула', 'formula'), '$v_0T+\\dfrac{aT^2}{2}$']]; },
  note: L('График скорости $v(t)=v_0+at$. Пройденный путь — это площадь под графиком скорости: за крошечное время $dt$ тело проходит $v\\,dt$, а интеграл складывает все эти кусочки.', 'Жылдамдық графигі $v(t)=v_0+at$. Жүрілген жол — жылдамдық графигінің астындағы аудан: өте аз $dt$ уақытта дене $v\\,dt$ жол жүреді, ал интеграл осы бөліктердің бәрін қосады.', 'The velocity graph $v(t)=v_0+at$. Distance travelled is the area under the velocity graph: in a tiny time $dt$ the body covers $v\\,dt$, and the integral adds up all the pieces.'),
  quest: [L('Сделайте $a<0$. Что означает площадь под осью?', '$a<0$ жасаңыз. Ось астындағы аудан нені білдіреді?', 'Make $a<0$. What does area below the axis mean?')] });

LABS.slopefield = root => {
  const F = [["$y'=y$", (x, y) => y], ["$y'=x$", (x, y) => x], ["$y'=x-y$", (x, y) => x - y], ["$y'=-\\dfrac{x}{y}$", (x, y) => Math.abs(y) < .05 ? NaN : -x / y]];
  lab(root, { view: [-4, 4, -4, 4], init: { px: 0, py: 1 }, seg: [{ k: 'fn', opts: F.map(x => x[0]), label: L('Уравнение', 'Теңдеу', 'Equation') }], drag(s, x, y) { s.px = x; s.py = y; },
    draw(P, s) { const f = F[s.fn][1]; P.grid();
      for (let x = -3.75; x < 4; x += .5) for (let y = -3.75; y < 4; y += .5) { const k = f(x, y); if (!Number.isFinite(k)) continue; const l = .17 / Math.sqrt(1 + k * k); P.line(x - l, y - k * l, x + l, y + k * l, COL.mute, { w: 1.6 }); }
      poly2(P, rk(f, s.px, s.py, .02, 500), COL.pink); poly2(P, rk(f, s.px, s.py, -.02, 500), COL.pink); P.dot(s.px, s.py, COL.g, 7);
      return [['$x_0$', s.px], ['$y_0$', s.py], ["$y'(x_0)$", f(s.px, s.py)]]; },
    note: L('Уравнение $y\'=f(x,y)$ в каждой точке задаёт наклон — получается «поле направлений» (серые чёрточки). Решение — кривая, которая всюду идёт вдоль чёрточек. Начальное условие $y(x_0)=y_0$ выбирает одну кривую из семейства — частное решение.', '$y\'=f(x,y)$ теңдеуі әр нүктеде көлбеулікті береді — «бағыттар өрісі» шығады (сұр сызықшалар). Шешім — барлық жерде сызықшалар бойымен жүретін қисық. $y(x_0)=y_0$ бастапқы шарты үйірден бір қисықты — дербес шешімді таңдайды.', 'The equation $y\'=f(x,y)$ prescribes a slope at every point — a direction field (grey dashes). A solution is a curve that follows the dashes everywhere. The initial condition $y(x_0)=y_0$ picks one curve from the family — a particular solution.'),
    quest: [L('Кликайте по полю: каждая точка даёт свою интегральную кривую.', 'Өрісті басыңыз: әр нүкте өз интегралдық қисығын береді.', 'Click around the field: each point gives its own integral curve.'), L('Для $y\'=-x/y$ кривые — окружности. Почему?', '$y\'=-x/y$ үшін қисықтар — шеңберлер. Неге?', 'For $y\'=-x/y$ the curves are circles. Why?')] });
};

LABS.growth = root => lab(root, { view: [0, 10, 0, 100],
  ctl: [{ k: 'k', label: '$k$', min: -0.8, max: 0.8, step: 0.02, v: 0.3 }, { k: 'y', label: '$y_0$', min: 1, max: 100, step: 1, v: 10 }, { k: 't', label: '$t$', min: 0, max: 10, step: 0.1, v: 3 }],
  draw(P, s) { const f = x => s.y * Math.exp(s.k * x), T = Math.log(2) / Math.abs(s.k || 1e-9);
    P.grid('t', 'y').fn(f).line(s.t - 1, f(s.t) - s.k * f(s.t), s.t + 1, f(s.t) + s.k * f(s.t), COL.green, { w: 2.5 }).dot(s.t, f(s.t), COL.pink, 7);
    if (T < 10) P.line(T, 0, T, f(T), COL.orange, { dash: '5 5' }).dot(T, f(T), COL.orange, 5);
    return [['$y(t)$', f(s.t)], ["$y'(t)=ky$", s.k * f(s.t)], [s.k < 0 ? L('период полураспада', 'жартылай ыдырау периоды', 'half-life') : L('время удвоения', 'екі еселену уақыты', 'doubling time'), T], [L('решение', 'шешім', 'solution'), `$y=${n2(s.y)}e^{${n2(s.k)}t}$`]]; },
  note: L('Модель $y\'=ky$: скорость изменения пропорциональна самой величине. При $k>0$ — рост (бактерии, вклад в банке), при $k<0$ — убывание (радиоактивный распад, остывание). Разделяя переменные, получаем $y=y_0e^{kt}$.', '$y\'=ky$ моделі: өзгеру жылдамдығы шаманың өзіне пропорционал. $k>0$ кезінде — өсу (бактериялар, банктегі салым), $k<0$ кезінде — кему (радиоактивті ыдырау, суу). Айнымалыларды ажыратып, $y=y_0e^{kt}$ аламыз.', 'The model $y\'=ky$: the rate of change is proportional to the quantity itself. $k>0$ means growth (bacteria, bank deposit), $k<0$ decay (radioactivity, cooling). Separating variables gives $y=y_0e^{kt}$.'),
  quest: [L('Зависит ли время удвоения от $y_0$?', 'Екі еселену уақыты $y_0$-ге тәуелді ме?', 'Does the doubling time depend on $y_0$?')] });

LABS.charroots = root => lab(root, { view: [0, 12, -1.6, 1.6],
  ctl: [{ k: 'b', label: '$b$', min: 0, max: 5, step: 0.1, v: 0.6 }, { k: 'c', label: '$c$', min: 0.2, max: 9, step: 0.1, v: 4 }],
  draw(P, s) { const D = s.b * s.b - 4 * s.c, pts = [[0, 1]]; let y = 1, v = 0; const h = .01;
    for (let i = 0; i < 1200; i++) { const a1 = -s.b * v - s.c * y, vm = v + a1 * h / 2, ym = y + v * h / 2, a2 = -s.b * vm - s.c * ym; y += vm * h; v += a2 * h; pts.push([(i + 1) * h, y]); }
    P.grid(); if (D < 0) { const al = -s.b / 2; P.fn(x => Math.exp(al * x), COL.orange, { dash: '5 5', w: 1.6 }).fn(x => -Math.exp(al * x), COL.orange, { dash: '5 5', w: 1.6 }); } poly2(P, pts, COL.g);
    const sq = Math.sqrt(Math.abs(D)) / 2;
    return [['$D=b^2-4c$', D], [L('корни', 'түбірлер', 'roots'), D > 1e-9 ? `$${n2(-s.b / 2 - sq)};\\ ${n2(-s.b / 2 + sq)}$` : D < -1e-9 ? `$${n2(-s.b / 2)}\\pm${n2(sq)}i$` : `$${n2(-s.b / 2)}$`],
      [L('вид решения', 'шешім түрі', 'solution form'), D > 1e-9 ? '$C_1e^{k_1x}+C_2e^{k_2x}$' : D < -1e-9 ? '$e^{\\alpha x}(C_1\\cos\\beta x+C_2\\sin\\beta x)$' : '$(C_1+C_2x)e^{kx}$'], [L('поведение', 'сипаты', 'behaviour'), D < -1e-9 ? (s.b ? L('затухающие колебания', 'өшетін тербелістер', 'damped oscillation') : L('колебания', 'тербелістер', 'oscillation')) : L('без колебаний', 'тербеліссіз', 'no oscillation')]]; },
  note: L('Решение уравнения $y\'\'+by\'+cy=0$ с $y(0)=1$, $y\'(0)=0$. Всё решает дискриминант характеристического уравнения $k^2+bk+c=0$: при $D<0$ появляются синус и косинус — колебания; при $D\\ge0$ — только экспоненты.', '$y\'\'+by\'+cy=0$ теңдеуінің $y(0)=1$, $y\'(0)=0$ шартындағы шешімі. Бәрін $k^2+bk+c=0$ сипаттаушы теңдеуінің дискриминанты шешеді: $D<0$ кезінде синус пен косинус пайда болады — тербелістер; $D\\ge0$ кезінде — тек экспоненталар.', 'The solution of $y\'\'+by\'+cy=0$ with $y(0)=1$, $y\'(0)=0$. The discriminant of $k^2+bk+c=0$ decides everything: $D<0$ brings sine and cosine — oscillation; $D\\ge0$ gives exponentials only.'),
  quest: [L('Найдите границу $D=0$: когда колебания исчезают?', '$D=0$ шекарасын табыңыз: тербелістер қашан жойылады?', 'Find the border $D=0$: when do oscillations vanish?'), L('Поставьте $b=0$ — что получилось?', '$b=0$ қойыңыз — не шықты?', 'Set $b=0$ — what do you get?')] });

LABS.spring = root => lab(root, { view: [0, 10, -3.4, 3.4], init: { t: 0 },
  ctl: [{ k: 'A', label: L('амплитуда $A$', 'амплитуда $A$', 'amplitude $A$'), min: 0.5, max: 3, step: 0.1, v: 2 }, { k: 'w', label: '$\\omega$', min: 0.5, max: 5, step: 0.1, v: 2 }, { k: 'p', label: '$\\varphi_0$', min: 0, max: 6.28, step: 0.01, v: 0 }],
  anim(s, dt) { s.t = (s.t + dt) % 10; },
  draw(P, s) { const f = x => s.A * Math.cos(s.w * x + s.p), y = f(s.t), yp = P.Y(y), n = 12; let d = `M${P.w - 40} 4`;
    for (let i = 1; i <= n; i++) d += `L${P.w - 40 + (i % 2 ? 12 : -12)} ${4 + (yp - 22) * i / n}`;
    P.grid('t', 'x').fn(f).line(s.t, P.y0, s.t, P.y1, COL.mute, { dash: '4 5', w: 1.5 }).line(s.t, y, P.x1, y, COL.pink, { dash: '3 5', w: 1.5 }).dot(s.t, y, COL.pink, 7)
      .raw(`<path d="${d}" fill="none" stroke="var(--plot-axis)" stroke-width="2.5"/><rect x="${P.w - 62}" y="${yp - 20}" width="44" height="40" rx="9" fill="var(--pink)"/>`);
    return [['$x(t)$', y], ["$v=x'(t)$", -s.A * s.w * Math.sin(s.w * s.t + s.p)], [L('период $T=\\frac{2\\pi}{\\omega}$', 'период $T=\\frac{2\\pi}{\\omega}$', 'period $T=\\frac{2\\pi}{\\omega}$'), 2 * PI / s.w], ['$v_{\\max}=A\\omega$', s.A * s.w]]; },
  note: L('Груз на пружине: возвращающая сила $F=-kx$, поэтому $mx\'\'=-kx$, или $x\'\'+\\omega^2x=0$, где $\\omega^2=\\frac km$. Решение — гармоническое колебание $x=A\\cos(\\omega t+\\varphi_0)$.', 'Серіппедегі жүк: кері қайтарушы күш $F=-kx$, сондықтан $mx\'\'=-kx$, немесе $x\'\'+\\omega^2x=0$, мұндағы $\\omega^2=\\frac km$. Шешімі — гармоникалық тербеліс $x=A\\cos(\\omega t+\\varphi_0)$.', 'A mass on a spring: the restoring force is $F=-kx$, so $mx\'\'=-kx$, i.e. $x\'\'+\\omega^2x=0$ with $\\omega^2=\\frac km$. The solution is the harmonic oscillation $x=A\\cos(\\omega t+\\varphi_0)$.'),
  quest: [L('Увеличьте $\\omega$ вдвое. Как изменился период?', '$\\omega$-ны екі есе арттырыңыз. Период қалай өзгерді?', 'Double $\\omega$. How did the period change?'), L('Где груз движется быстрее всего?', 'Жүк қай жерде ең жылдам қозғалады?', 'Where does the mass move fastest?')] });

function heroArt(el) {
  const f = x => 1.2 + Math.sin(x) * 0.9 + x * 0.25, P = Plot(-0.3, 6.3, 0, 4.2, 520, 330), x0 = 3.6, k = dnum(f, x0);
  P.raw('<g style="--plot-grid:#ffffff26;--plot-axis:#ffffffcc;--plot-text:#ffffff">').grid().area(f, 0.8, 2.8, '#ffe066').fn(f, '#fff', { w: 4 }).line(x0 - 1.6, f(x0) - 1.6 * k, x0 + 1.6, f(x0) + 1.6 * k, '#ffe066', { w: 3 }).dot(x0, f(x0), '#ff3d8b', 8)
    .text(1.35, 0.7, '∫ f(x) dx', '#fff').text(x0 + .35, f(x0) + .45, "f '(x₀)", '#ffe066').raw('</g>');
  el.innerHTML = P.html().replace('class="plot"', 'class="plot" style="background:transparent;border:0"');
}

/* Генераторы задач. Каждый генератор получает датчик r и возвращает задачу:
   { q, a, hint, steps[], lvl, [opts], [fields], [ans], [tol], [unit] }.
   Числа меняются от варианта к варианту, а решение расписывается по шагам. */
const RETRY = {};
function rng(seed) {
  let s = seed >>> 0;
  const f = () => { s = (s + 0x6D2B79F5) >>> 0; let x = Math.imul(s ^ (s >>> 15), 1 | s); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
  for (let i = 0; i < 3; i++) f();
  const o = {
    f, int: (a, b) => a + Math.floor(f() * (b - a + 1)), pick: arr => arr[Math.floor(f() * arr.length)],
    nz: (a, b) => { let v = 0; while (!v) v = o.int(a, b); return v; },
    shuffle: arr => { const c = arr.slice(); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(f() * (i + 1));[c[i], c[j]] = [c[j], c[i]]; } return c; }
  };
  return o;
}
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
/* число → LaTeX: целые, простые дроби, десятичные с запятой для ru/kk */
function dec(x, d) { let s = String(+(+x).toFixed(d == null ? 2 : d)); if (LANG !== 'en') s = s.replace('.', '{,}'); return s; }
function fr(n, d) { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; n /= g; d /= g; return d === 1 ? String(n) : (n < 0 ? '-' : '') + R`\frac{${Math.abs(n)}}{${d}}`; }
function nt(x) {
  if (Number.isInteger(x)) return String(x);
  for (const d of [2, 4, 5, 10, 20, 25, 50, 100]) if (Math.abs(x * d - Math.round(x * d)) < 1e-9 && Math.abs(x) < 1e4) return dec(x, 4);
  for (let d = 3; d <= 64; d++) if (Math.abs(x * d - Math.round(x * d)) < 1e-9) return fr(Math.round(x * d), d);
  return dec(x, 2);
}
const par = n => n < 0 ? `(${nt(n)})` : nt(n);
const sg = n => n < 0 ? ' - ' + nt(-n) : ' + ' + nt(n);
/* коэффициент при выражении: 1·x → x, −1·x → −x */
const co = (n, body) => n === 1 ? body : n === -1 ? '-' + body : nt(n) + body;
function poly(c, v) {
  v = v || 'x'; let s = '';
  c.forEach((k, i) => {
    if (!k) return; const p = c.length - 1 - i, body = p === 0 ? '' : p === 1 ? v : `${v}^{${p}}`;
    const term = p === 0 ? nt(Math.abs(k)) : co(Math.abs(k), body);
    s += s ? (k < 0 ? ' - ' : ' + ') + term : (k < 0 ? '-' : '') + term;
  });
  return s || '0';
}
const pv = (c, x) => c.reduce((s, k) => s * x + k, 0);
const dp = c => c.slice(0, -1).map((k, i) => k * (c.length - 1 - i));
function subPoly(c, x) {
  let s = '';
  c.forEach((k, i) => {
    if (!k) return; const p = c.length - 1 - i, body = p === 0 ? '' : R`\cdot ` + (p === 1 ? par(x) : (x < 0 ? `(${x})` : x) + `^{${p}}`);
    s += s ? (k < 0 ? ' - ' : ' + ') + nt(Math.abs(k)) + body : nt(k) + body;
  });
  return s || '0';
}
function choice(r, correct, wrongs) {
  const ws = [...new Set(wrongs)].filter(w => w !== correct).slice(0, 3);
  if (ws.length < 2) throw RETRY;
  const opts = r.shuffle([correct, ...ws]);
  return { opts, a: opts.indexOf(correct) };
}
const need = c => { if (!c) throw RETRY; };
const m = s => '$' + s + '$';
const WORDS = {
  sub: ['Подставляем', 'Орнына қоямыз', 'Substitute'], calc: ['Вычисляем', 'Есептейміз', 'Compute'], so: ['Значит', 'Демек', 'Hence'],
  der: ['Находим производную', 'Туындыны табамыз', 'Differentiate'], factor: ['Раскладываем на множители', 'Көбейткіштерге жіктейміз', 'Factor'],
  cancel: ['Сокращаем дробь', 'Бөлшекті қысқартамыз', 'Cancel the common factor'], zero: ['Приравниваем производную к нулю', 'Туындыны нөлге теңестіреміз', 'Set the derivative equal to zero'],
  anti: ['Находим первообразную', 'Алғашқы функцияны табамыз', 'Find an antiderivative'], nl: ['По формуле Ньютона — Лейбница', 'Ньютон — Лейбниц формуласы бойынша', 'By the Newton–Leibniz formula'],
  chr: ['Составляем характеристическое уравнение: заменяем $y\'\'\\to k^2$, $y\'\\to k$, $y\\to1$', 'Сипаттаушы теңдеуді құрамыз: $y\'\'\\to k^2$, $y\'\\to k$, $y\\to1$ деп алмастырамыз', 'Write the characteristic equation: replace $y\'\'\\to k^2$, $y\'\\to k$, $y\\to1$'],
  atPoint: ['Подставляем точку', 'Нүктені орнына қоямыз', 'Plug in the point'], signs: ['Определяем знаки производной на промежутках', 'Аралықтардағы туынды таңбасын анықтаймыз', 'Find the sign of the derivative on each interval'],
  rule: ['Вспоминаем правило', 'Ережені еске түсіреміз', 'Recall the rule'], table: ['По таблице', 'Кесте бойынша', 'From the table'], ends: ['Считаем значения на концах отрезка', 'Кесінді ұштарындағы мәндерді есептейміз', 'Evaluate at the endpoints'],
  inter: ['Находим точки пересечения графиков', 'Графиктердің қиылысу нүктелерін табамыз', 'Find the intersection points'], ans: ['Ответ', 'Жауабы', 'Answer']
};
const W = new Proxy({}, { get: (_, k) => WORDS[k][LANGS.indexOf(LANG)] });
const qFind = (what, given) => L(`Найдите ${what}, если ${given}.`, `${given} болса, ${what} табыңыз.`, `Find ${what} if ${given}.`);
const qLim = e => L(`Вычислите предел: $$${e}$$`, `Шекті есептеңіз: $$${e}$$`, `Evaluate the limit: $$${e}$$`);
const GEN = {};

/* ================= ПРЕДЕЛ И НЕПРЕРЫВНОСТЬ ================= */
GEN['limit-point'] = [
  r => { const a = r.int(-3, 3), c = [r.nz(-3, 3), r.int(-4, 4), r.int(-5, 5)], v = pv(c, a);
    return { q: qLim(R`\lim_{x\to ${a}}\left(${poly(c)}\right)`), a: v, lvl: 1,
      hint: L('Многочлен непрерывен: предел равен значению функции в точке.', 'Көпмүше үзіліссіз: шек функцияның нүктедегі мәніне тең.', 'A polynomial is continuous: the limit equals the value at the point.'),
      steps: [L(`Многочлен — «гладкая» функция без разрывов. Когда $x$ подходит к $${a}$, значения функции подходят к значению в самой точке. Поэтому достаточно подставить $x=${a}$.`, `Көпмүше — үзіліссіз «тегіс» функция. $x$ саны $${a}$-ге жақындағанда, функция мәндері нүктедегі мәнге жақындайды. Сондықтан $x=${a}$ қою жеткілікті.`, `A polynomial is a smooth function with no breaks. As $x$ approaches $${a}$, its values approach the value at that point, so we simply plug in $x=${a}$.`),
        `${W.sub}: $${subPoly(c, a)} = ${v}$.`] }; },
  r => { const a = r.nz(-6, 6), d = r.nz(2, 5), b = r.nz(-9, 9), c = r.int(-9, 9), e = r.nz(-9, 9), f = r.int(-9, 9);
    return { q: qLim(R`\lim_{x\to\infty}\frac{${poly([a, b, c])}}{${poly([d, e, f])}}`), a: a / d, lvl: 1,
      hint: L('Разделите числитель и знаменатель на старшую степень $x^2$.', 'Алымы мен бөлімін ең үлкен дәреже $x^2$-қа бөліңіз.', 'Divide the numerator and denominator by the highest power $x^2$.'),
      steps: [L('Числитель и знаменатель растут неограниченно — это неопределённость $\\frac{\\infty}{\\infty}$. Делим оба на старшую степень $x^2$.', 'Алымы да, бөлімі де шексіз өседі — бұл $\\frac{\\infty}{\\infty}$ анықталмағандығы. Екеуін де $x^2$-қа бөлеміз.', 'Both numerator and denominator grow without bound — an $\\frac{\\infty}{\\infty}$ form. Divide both by $x^2$.'),
        R`$$\frac{${a}${b ? sg(b).replace(/(\d+)$/, '\\frac{$1}{x}') : ''}${c ? sg(c).replace(/(\d+)$/, '\\frac{$1}{x^2}') : ''}}{${d}${sg(e).replace(/(\d+)$/, '\\frac{$1}{x}')}${f ? sg(f).replace(/(\d+)$/, '\\frac{$1}{x^2}') : ''}}$$`,
        L(`При $x\\to\\infty$ дроби вида $\\frac{c}{x}$ и $\\frac{c}{x^2}$ стремятся к нулю. Остаётся отношение старших коэффициентов: $\\frac{${a}}{${d}} = ${nt(a / d)}$.`, `$x\\to\\infty$ болғанда $\\frac{c}{x}$ және $\\frac{c}{x^2}$ түріндегі бөлшектер нөлге ұмтылады. Үлкен коэффициенттердің қатынасы қалады: $\\frac{${a}}{${d}} = ${nt(a / d)}$.`, `As $x\\to\\infty$ the fractions $\\frac{c}{x}$ and $\\frac{c}{x^2}$ go to zero. Only the ratio of leading coefficients remains: $\\frac{${a}}{${d}} = ${nt(a / d)}$.`)] }; },
  r => { const a = r.nz(-6, 6);
    return { q: qLim(R`\lim_{x\to ${a}}\frac{x^2 - ${a * a}}{${poly([1, -a])}}`), a: 2 * a, lvl: 2,
      hint: L('Подстановка даёт $\\frac00$. Разложите числитель как разность квадратов.', 'Орнына қойғанда $\\frac00$ шығады. Алымын квадраттар айырымы ретінде жіктеңіз.', 'Plugging in gives $\\frac00$. Factor the numerator as a difference of squares.'),
      steps: [L(`Подставим $x=${a}$: числитель $${a * a}-${a * a}=0$, знаменатель тоже $0$. Получили неопределённость $\\frac00$ — надо преобразовать.`, `$x=${a}$ қоямыз: алымы $${a * a}-${a * a}=0$, бөлімі де $0$. $\\frac00$ анықталмағандығы шықты — түрлендіру керек.`, `Plug in $x=${a}$: the numerator is $${a * a}-${a * a}=0$ and so is the denominator. This is a $\\frac00$ form, so we transform it.`),
        `${W.factor}: $x^2-${a * a}=(${poly([1, -a])})(${poly([1, a])})$.`,
        `${W.cancel}: $\\dfrac{(${poly([1, -a])})(${poly([1, a])})}{${poly([1, -a])}}=${poly([1, a])}$ ` + L(`(при $x\\ne${a}$, а в пределе $x$ только приближается к $${a}$).`, `($x\\ne${a}$ кезінде; шекте $x$ тек $${a}$-ге жақындайды).`, `(for $x\\ne${a}$; in a limit $x$ only approaches $${a}$).`),
        `${W.sub}: $${a}${sg(a)}=${2 * a}$.`] }; },
  r => { const a = r.int(1, 5), A = r.int(2, 9);
    return { q: L(`Что означает запись $\\lim\\limits_{x\\to ${a}}f(x)=${A}$?`, `$\\lim\\limits_{x\\to ${a}}f(x)=${A}$ жазуы нені білдіреді?`, `What does $\\lim\\limits_{x\\to ${a}}f(x)=${A}$ mean?`), lvl: 1,
      ...choice(r, L(`Значения $f(x)$ сколь угодно близки к $${A}$, когда $x$ достаточно близок к $${a}$ (но $x\\ne${a}$)`, `$x$ саны $${a}$-ге жеткілікті жақын болғанда ($x\\ne${a}$), $f(x)$ мәндері $${A}$-ге қалағанша жақын болады`, `The values $f(x)$ get arbitrarily close to $${A}$ when $x$ is close enough to $${a}$ (but $x\\ne${a}$)`),
        [L(`Обязательно $f(${a})=${A}$`, `Міндетті түрде $f(${a})=${A}$`, `Necessarily $f(${a})=${A}$`), L(`Функция определена только в точке $x=${a}$`, `Функция тек $x=${a}$ нүктесінде анықталған`, `The function is defined only at $x=${a}$`), L(`$f(x)$ никогда не принимает значение $${A}$`, `$f(x)$ ешқашан $${A}$ мәнін қабылдамайды`, `$f(x)$ never takes the value $${A}$`)]),
      hint: L('Предел описывает поведение функции рядом с точкой, а не в самой точке.', 'Шек функцияның нүктенің өзінде емес, оның маңайындағы тәртібін сипаттайды.', 'A limit describes behaviour near the point, not at the point itself.'),
      steps: [L('Предел — это про «приближение»: мы смотрим, к чему стремятся значения $f(x)$, когда $x$ подходит к точке.', 'Шек — «жақындау» туралы: $x$ нүктеге жақындағанда $f(x)$ мәндері неге ұмтылатынын қараймыз.', 'A limit is about approaching: we watch where the values $f(x)$ head as $x$ gets close to the point.'),
        L(`В самой точке $x=${a}$ функция может быть не определена или иметь другое значение — на предел это не влияет.`, `$x=${a}$ нүктесінің өзінде функция анықталмаған немесе басқа мәнге ие болуы мүмкін — бұл шекке әсер етпейді.`, `At $x=${a}$ itself the function may be undefined or have another value — that does not affect the limit.`)] }; },
  r => { const k = r.pick([0, 1, 2]), a = r.nz(-5, 5), d = r.nz(2, 6), b = r.nz(-7, 7), e = r.nz(-7, 7);
    const num = k === 0 ? poly([a, b]) : k === 1 ? poly([a, 0, b]) : poly([a, 0, 0, b]), den = k === 2 ? poly([d, e, 1]) : poly([d, 0, e]);
    const inf = '$\\infty$', ansS = k === 0 ? '$0$' : k === 1 ? m(nt(a / d)) : inf;
    return { q: qLim(R`\lim_{x\to\infty}\frac{${num}}{${den}}`), lvl: 2, ...choice(r, ansS, ['$0$', inf, m(nt(a / d)), m(nt(d / a)), '$1$']),
      hint: L('Сравните старшие степени числителя и знаменателя.', 'Алымы мен бөлімінің ең үлкен дәрежелерін салыстырыңыз.', 'Compare the highest powers of the numerator and the denominator.'),
      steps: [L(`Степень числителя: $${k + 1}$, степень знаменателя: $2$.`, `Алымының дәрежесі: $${k + 1}$, бөлімінің дәрежесі: $2$.`, `Degree of the numerator: $${k + 1}$; of the denominator: $2$.`),
        L('Правило: если степени равны — предел равен отношению старших коэффициентов; если «побеждает» знаменатель — $0$; если числитель — $\\infty$.', 'Ереже: дәрежелер тең болса — шек үлкен коэффициенттердің қатынасына тең; бөлімі «жеңсе» — $0$; алымы жеңсе — $\\infty$.', 'Rule: equal degrees → ratio of leading coefficients; the denominator “wins” → $0$; the numerator wins → $\\infty$.'),
        k === 1 ? L(`Степени равны, поэтому предел равен $\\frac{${a}}{${d}}=${nt(a / d)}$.`, `Дәрежелер тең, сондықтан шек $\\frac{${a}}{${d}}=${nt(a / d)}$.`, `The degrees are equal, so the limit is $\\frac{${a}}{${d}}=${nt(a / d)}$.`) : k === 0 ? L('Знаменатель растёт быстрее — дробь стремится к $0$.', 'Бөлімі тезірек өседі — бөлшек $0$-ге ұмтылады.', 'The denominator grows faster — the fraction tends to $0$.') : L('Числитель растёт быстрее — дробь неограниченно растёт по модулю, предел равен $\\infty$.', 'Алымы тезірек өседі — бөлшек модулі бойынша шексіз өседі, шек $\\infty$.', 'The numerator grows faster — the fraction is unbounded, the limit is $\\infty$.')] }; },
  r => { const k = r.int(-6, 6), a = r.nz(-9, 9), b = r.nz(-9, 9);
    return { q: qLim(R`\lim_{x\to\infty}\left(${k}${sg(a).replace(/(\d+)$/, '\\frac{$1}{x}')}${sg(b).replace(/(\d+)$/, '\\frac{$1}{x^2}')}\right)`), a: k, lvl: 1,
      hint: L('Чему равен $\\lim\\limits_{x\\to\\infty}\\frac1x$?', '$\\lim\\limits_{x\\to\\infty}\\frac1x$ неге тең?', 'What is $\\lim\\limits_{x\\to\\infty}\\frac1x$?'),
      steps: [L('Когда $x$ огромен (миллион, миллиард…), дробь $\\frac{c}{x}$ становится ничтожно малой: $\\frac{c}{x}\\to0$ и тем более $\\frac{c}{x^2}\\to0$.', '$x$ өте үлкен болғанда (миллион, миллиард…), $\\frac{c}{x}$ бөлшегі өте кішкентай болады: $\\frac{c}{x}\\to0$, ал $\\frac{c}{x^2}\\to0$ тіпті тезірек.', 'When $x$ is huge (a million, a billion…), $\\frac{c}{x}$ becomes negligible: $\\frac{c}{x}\\to0$, and $\\frac{c}{x^2}\\to0$ even faster.'),
        L(`Предел суммы равен сумме пределов: $${k}+0+0=${k}$.`, `Қосындының шегі шектердің қосындысына тең: $${k}+0+0=${k}$.`, `The limit of a sum is the sum of the limits: $${k}+0+0=${k}$.`)] }; }
];

GEN['asymptotes'] = [
  r => { const a = r.nz(-4, 4), b = r.nz(-6, 6), c = r.nz(-5, 5); need(a * c + b !== 0); const ask = r.pick([0, 1]);
    const fx = R`f(x)=\dfrac{${poly([a, b])}}{${poly([1, -c])}}`;
    return { q: ask ? L(`Найдите горизонтальную асимптоту $y=b$ графика $${fx}$. В ответ запишите $b$.`, `$${fx}$ графигінің горизонталь асимптотасын $y=b$ табыңыз. Жауапқа $b$ жазыңыз.`, `Find the horizontal asymptote $y=b$ of $${fx}$. Enter $b$.`) : L(`Найдите вертикальную асимптоту $x=a$ графика $${fx}$. В ответ запишите $a$.`, `$${fx}$ графигінің вертикаль асимптотасын $x=a$ табыңыз. Жауапқа $a$ жазыңыз.`, `Find the vertical asymptote $x=a$ of $${fx}$. Enter $a$.`),
      a: ask ? a : c, lvl: 1, ans: ask ? `$y=${a}$` : `$x=${c}$`,
      hint: ask ? L('Вычислите предел функции при $x\\to\\infty$.', '$x\\to\\infty$ кездегі функция шегін есептеңіз.', 'Compute the limit as $x\\to\\infty$.') : L('Где знаменатель обращается в нуль?', 'Бөлімі қай жерде нөлге айналады?', 'Where does the denominator vanish?'),
      steps: ask ? [L('Горизонтальная асимптота показывает, к какому числу приближаются значения функции «далеко справа и слева»: $b=\\lim\\limits_{x\\to\\infty}f(x)$.', 'Горизонталь асимптота функция мәндерінің «алыс оң мен солда» қандай санға жақындайтынын көрсетеді: $b=\\lim\\limits_{x\\to\\infty}f(x)$.', 'A horizontal asymptote shows the number the function approaches far to the right and left: $b=\\lim\\limits_{x\\to\\infty}f(x)$.'),
        L(`Степени числителя и знаменателя равны, значит предел равен отношению старших коэффициентов: $\\frac{${a}}{1}=${a}$.`, `Алымы мен бөлімінің дәрежелері тең, демек шек үлкен коэффициенттердің қатынасына тең: $\\frac{${a}}{1}=${a}$.`, `The degrees are equal, so the limit is the ratio of leading coefficients: $\\frac{${a}}{1}=${a}$.`), L(`Горизонтальная асимптота: $y=${a}$.`, `Горизонталь асимптота: $y=${a}$.`, `Horizontal asymptote: $y=${a}$.`)]
        : [L('Вертикальная асимптота появляется там, где функция «улетает в бесконечность» — обычно в нуле знаменателя.', 'Вертикаль асимптота функция «шексіздікке ұшатын» жерде пайда болады — әдетте бөлімнің нөлінде.', 'A vertical asymptote appears where the function blows up — usually at a zero of the denominator.'),
          L(`Знаменатель: $${poly([1, -c])}=0$ при $x=${c}$.`, `Бөлімі: $${poly([1, -c])}=0$, $x=${c}$ болғанда.`, `Denominator: $${poly([1, -c])}=0$ at $x=${c}$.`),
          L(`Числитель в этой точке равен $${a * c + b}\\ne0$, поэтому дробь неограниченно растёт: $x=${c}$ — вертикальная асимптота.`, `Бұл нүктеде алымы $${a * c + b}\\ne0$, сондықтан бөлшек шексіз өседі: $x=${c}$ — вертикаль асимптота.`, `The numerator there equals $${a * c + b}\\ne0$, so the fraction is unbounded: $x=${c}$ is a vertical asymptote.`)] }; },
  r => { const k = r.nz(-3, 3), p = r.int(-5, 5), q = r.int(-6, 6), c = r.nz(-4, 4), b = p + k * c, rem = q + c * b; need(rem !== 0);
    const fx = R`f(x)=\dfrac{${poly([k, p, q])}}{${poly([1, -c])}}`;
    return { q: L(`Найдите наклонную асимптоту $y=kx+b$ графика $${fx}$.`, `$${fx}$ графигінің көлбеу асимптотасын $y=kx+b$ табыңыз.`, `Find the oblique asymptote $y=kx+b$ of $${fx}$.`), fields: [{ label: '$k$', a: k }, { label: '$b$', a: b }], lvl: 3, ans: `$y=${poly([k, b])}$`,
      hint: L('$k=\\lim\\limits_{x\\to\\infty}\\frac{f(x)}{x}$, затем $b=\\lim\\limits_{x\\to\\infty}(f(x)-kx)$. Можно и поделить числитель на знаменатель «уголком».', '$k=\\lim\\limits_{x\\to\\infty}\\frac{f(x)}{x}$, сосын $b=\\lim\\limits_{x\\to\\infty}(f(x)-kx)$. Алымын бөліміне «бұрыштап» бөлуге де болады.', '$k=\\lim\\limits_{x\\to\\infty}\\frac{f(x)}{x}$, then $b=\\lim\\limits_{x\\to\\infty}(f(x)-kx)$. Long division also works.'),
      steps: [L(`Степень числителя на 1 больше степени знаменателя — значит, есть наклонная асимптота.`, `Алымының дәрежесі бөлімінің дәрежесінен 1-ге артық — демек, көлбеу асимптота бар.`, `The numerator's degree is one more than the denominator's, so there is an oblique asymptote.`),
        R`$k=\lim\limits_{x\to\infty}\dfrac{f(x)}{x}=\lim\limits_{x\to\infty}\dfrac{${poly([k, p, q])}}{${poly([1, -c, 0])}}=${k}$ ` + L('(отношение старших коэффициентов).', '(үлкен коэффициенттер қатынасы).', '(ratio of leading coefficients).'),
        R`$b=\lim\limits_{x\to\infty}\big(f(x)-${co(k, 'x')}\big)=\lim\limits_{x\to\infty}\dfrac{${poly([k, p, q])}-${co(k, 'x')}(${poly([1, -c])})}{${poly([1, -c])}}=\lim\limits_{x\to\infty}\dfrac{${poly([b, q])}}{${poly([1, -c])}}=${b}$.`,
        L(`Наклонная асимптота: $y=${poly([k, b])}$.`, `Көлбеу асимптота: $y=${poly([k, b])}$.`, `Oblique asymptote: $y=${poly([k, b])}$.`)] }; },
  r => { const a = r.int(-4, 4), b = r.nz(1, 5), c = r.nz(-5, 5);
    const fx = R`f(x)=${a ? a + ' + ' : ''}\dfrac{${b}}{${poly([1, -c])}}`;
    return { q: L(`График $${fx}$ имеет вертикальную асимптоту $x=x_0$ и горизонтальную $y=y_0$. Найдите $x_0$ и $y_0$.`, `$${fx}$ графигінің вертикаль асимптотасы $x=x_0$ және горизонталь асимптотасы $y=y_0$ бар. $x_0$ мен $y_0$ табыңыз.`, `The graph of $${fx}$ has a vertical asymptote $x=x_0$ and a horizontal one $y=y_0$. Find $x_0$ and $y_0$.`), fields: [{ label: '$x_0$', a: c }, { label: '$y_0$', a }], lvl: 1,
      hint: L('Вертикальная — нуль знаменателя; горизонтальная — предел на бесконечности.', 'Вертикаль — бөлімнің нөлі; горизонталь — шексіздіктегі шек.', 'Vertical: zero of the denominator; horizontal: the limit at infinity.'),
      steps: [L(`Это гипербола $y=\\frac{${b}}{x}$, сдвинутая на $${c}$ по горизонтали и на $${a}$ по вертикали.`, `Бұл — $y=\\frac{${b}}{x}$ гиперболасы, көлденеңінен $${c}$-ге, тігінен $${a}$-ге жылжытылған.`, `This is the hyperbola $y=\\frac{${b}}{x}$ shifted by $${c}$ horizontally and $${a}$ vertically.`),
        L(`Знаменатель равен нулю при $x=${c}$ — там функция уходит в бесконечность: вертикальная асимптота $x=${c}$.`, `Бөлімі $x=${c}$ кезінде нөлге тең — сол жерде функция шексіздікке кетеді: вертикаль асимптота $x=${c}$.`, `The denominator is zero at $x=${c}$, where the function blows up: vertical asymptote $x=${c}$.`),
        L(`При $x\\to\\infty$ дробь $\\frac{${b}}{${poly([1, -c])}}\\to0$, значит $f(x)\\to${a}$: горизонтальная асимптота $y=${a}$.`, `$x\\to\\infty$ кезінде $\\frac{${b}}{${poly([1, -c])}}\\to0$, демек $f(x)\\to${a}$: горизонталь асимптота $y=${a}$.`, `As $x\\to\\infty$, $\\frac{${b}}{${poly([1, -c])}}\\to0$, so $f(x)\\to${a}$: horizontal asymptote $y=${a}$.`)] }; },
  r => { const a = r.int(-4, 4), b = r.int(-4, 4); need(a !== b);
    const fx = R`f(x)=\dfrac{${poly([1, -a])}}{(${poly([1, -a])})(${poly([1, -b])})}`;
    return { q: L(`Сколько вертикальных асимптот у графика $${fx}$?`, `$${fx}$ графигінің неше вертикаль асимптотасы бар?`, `How many vertical asymptotes does $${fx}$ have?`), a: 1, lvl: 2,
      hint: L('Нуль знаменателя — ещё не асимптота. Проверьте, не сокращается ли множитель.', 'Бөлімнің нөлі — әлі асимптота емес. Көбейткіш қысқармай ма, тексеріңіз.', 'A zero of the denominator is not automatically an asymptote. Check whether a factor cancels.'),
      steps: [L(`Знаменатель обращается в нуль в двух точках: $x=${a}$ и $x=${b}$. Но асимптота будет только там, где функция уходит в бесконечность.`, `Бөлімі екі нүктеде нөлге айналады: $x=${a}$ және $x=${b}$. Бірақ асимптота тек функция шексіздікке кететін жерде болады.`, `The denominator vanishes at $x=${a}$ and $x=${b}$. But an asymptote occurs only where the function blows up.`),
        L(`При $x\\ne${a}$ множитель $(${poly([1, -a])})$ сокращается: $f(x)=\\dfrac{1}{${poly([1, -b])}}$. В точке $x=${a}$ предел конечен — это «выколотая точка», а не асимптота.`, `$x\\ne${a}$ кезінде $(${poly([1, -a])})$ көбейткіші қысқарады: $f(x)=\\dfrac{1}{${poly([1, -b])}}$. $x=${a}$ нүктесінде шек шекті — бұл асимптота емес, «ойылған нүкте».`, `For $x\\ne${a}$ the factor $(${poly([1, -a])})$ cancels: $f(x)=\\dfrac{1}{${poly([1, -b])}}$. At $x=${a}$ the limit is finite — a hole, not an asymptote.`),
        L(`При $x\\to${b}$ функция стремится к бесконечности. Итого одна вертикальная асимптота: $x=${b}$.`, `$x\\to${b}$ кезінде функция шексіздікке ұмтылады. Барлығы бір вертикаль асимптота: $x=${b}$.`, `As $x\\to${b}$ the function tends to infinity. So there is one vertical asymptote: $x=${b}$.`)] }; },
  r => { const a = r.nz(-5, 5), d = r.nz(2, 4), e = r.int(1, 6), b = r.int(-6, 6);
    const fx = R`f(x)=\dfrac{${poly([a, 0, b])}}{${poly([d, 0, e])}}`;
    return { q: L(`Найдите горизонтальную асимптоту $y=b$ графика $${fx}$. В ответ запишите $b$.`, `$${fx}$ графигінің горизонталь асимптотасын $y=b$ табыңыз. Жауапқа $b$ жазыңыз.`, `Find the horizontal asymptote $y=b$ of $${fx}$. Enter $b$.`), a: a / d, lvl: 2, ans: `$y=${nt(a / d)}$`,
      hint: L('Найдите предел при $x\\to\\infty$: разделите на $x^2$.', '$x\\to\\infty$ кездегі шекті табыңыз: $x^2$-қа бөліңіз.', 'Find the limit as $x\\to\\infty$: divide by $x^2$.'),
      steps: [L(`Знаменатель $${poly([d, 0, e])}>0$ при всех $x$ — вертикальных асимптот нет.`, `Бөлімі $${poly([d, 0, e])}>0$ барлық $x$ үшін — вертикаль асимптота жоқ.`, `The denominator $${poly([d, 0, e])}>0$ for all $x$ — no vertical asymptotes.`),
        R`$\lim\limits_{x\to\infty}\dfrac{${poly([a, 0, b])}}{${poly([d, 0, e])}}=\lim\limits_{x\to\infty}\dfrac{${a}${b ? sg(b).replace(/(\d+)$/, '\\frac{$1}{x^2}') : ''}}{${d}+\frac{${e}}{x^2}}=\dfrac{${a}}{${d}}=${nt(a / d)}$.`,
        L(`Горизонтальная асимптота: $y=${nt(a / d)}$.`, `Горизонталь асимптота: $y=${nt(a / d)}$.`, `Horizontal asymptote: $y=${nt(a / d)}$.`)] }; }
];

GEN['sequence-limit'] = [
  r => { const a = r.nz(-7, 7), c = r.nz(2, 6), b = r.nz(-9, 9), d = r.nz(-9, 9);
    return { q: qLim(R`\lim_{n\to\infty}\frac{${poly([a, b], 'n')}}{${poly([c, d], 'n')}}`), a: a / c, lvl: 1,
      hint: L('Разделите числитель и знаменатель на $n$.', 'Алымы мен бөлімін $n$-ге бөліңіз.', 'Divide the numerator and denominator by $n$.'),
      steps: [L('Делим числитель и знаменатель на $n$ — старшую степень:', 'Алымы мен бөлімін ең үлкен дәреже $n$-ге бөлеміз:', 'Divide the numerator and denominator by $n$, the highest power:'),
        R`$$\frac{${a}${sg(b).replace(/(\d+)$/, '\\frac{$1}{n}')}}{${c}${sg(d).replace(/(\d+)$/, '\\frac{$1}{n}')}}$$`,
        L(`Так как $\\frac1n\\to0$, получаем $\\dfrac{${a}+0}{${c}+0}=${nt(a / c)}$.`, `$\\frac1n\\to0$ болғандықтан, $\\dfrac{${a}+0}{${c}+0}=${nt(a / c)}$ шығады.`, `Since $\\frac1n\\to0$, we get $\\dfrac{${a}+0}{${c}+0}=${nt(a / c)}$.`)] }; },
  r => { const A = r.int(-5, 5), b = r.nz(-4, 4), q = r.pick([[1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5]]);
    return { q: qLim(R`\lim_{n\to\infty}\left(${A}${sg(b)}\cdot\left(\frac{${q[0]}}{${q[1]}}\right)^{n}\right)`), a: A, lvl: 1,
      hint: L('Если $|q|<1$, то $q^n\\to0$.', 'Егер $|q|<1$ болса, $q^n\\to0$.', 'If $|q|<1$, then $q^n\\to0$.'),
      steps: [L(`Основание степени $\\frac{${q[0]}}{${q[1]}}<1$. Каждое умножение на такое число уменьшает результат: $\\left(\\frac{${q[0]}}{${q[1]}}\\right)^n\\to0$.`, `Дәреже негізі $\\frac{${q[0]}}{${q[1]}}<1$. Мұндай санға әр көбейту нәтижені азайтады: $\\left(\\frac{${q[0]}}{${q[1]}}\\right)^n\\to0$.`, `The base $\\frac{${q[0]}}{${q[1]}}<1$. Each multiplication by such a number shrinks the result: $\\left(\\frac{${q[0]}}{${q[1]}}\\right)^n\\to0$.`),
        L(`Поэтому предел равен $${A}${sg(b)}\\cdot0=${A}$.`, `Сондықтан шек $${A}${sg(b)}\\cdot0=${A}$.`, `So the limit is $${A}${sg(b)}\\cdot0=${A}$.`)] }; },
  r => { const mm = r.pick([10, 20, 50, 100, 200, 1000]);
    return { q: L(`Последовательность $a_n=\\dfrac{n+1}{n}$ стремится к $1$. Начиная с какого наименьшего номера $n$ выполняется $|a_n-1|<\\dfrac{1}{${mm}}$?`, `$a_n=\\dfrac{n+1}{n}$ тізбегі $1$-ге ұмтылады. Қандай ең кіші $n$ нөмірінен бастап $|a_n-1|<\\dfrac{1}{${mm}}$ орындалады?`, `The sequence $a_n=\\dfrac{n+1}{n}$ tends to $1$. From which smallest index $n$ does $|a_n-1|<\\dfrac{1}{${mm}}$ hold?`), a: mm + 1, lvl: 2,
      hint: L('Упростите $|a_n-1|$ и решите неравенство относительно $n$.', '$|a_n-1|$ өрнегін ықшамдап, теңсіздікті $n$ бойынша шешіңіз.', 'Simplify $|a_n-1|$ and solve the inequality for $n$.'),
      steps: [R`$|a_n-1|=\left|\dfrac{n+1}{n}-1\right|=\dfrac1n$.`,
        L(`Нужно $\\dfrac1n<\\dfrac1{${mm}}$, то есть $n>${mm}$.`, `$\\dfrac1n<\\dfrac1{${mm}}$ керек, яғни $n>${mm}$.`, `We need $\\dfrac1n<\\dfrac1{${mm}}$, i.e. $n>${mm}$.`),
        L(`Наименьший подходящий номер: $n=${mm + 1}$. Все следующие члены лежат ещё ближе к $1$ — в этом и состоит смысл предела.`, `Ең кіші лайық нөмір: $n=${mm + 1}$. Келесі мүшелердің бәрі $1$-ге одан да жақын — шектің мағынасы осында.`, `The smallest suitable index is $n=${mm + 1}$. All later terms are even closer to $1$ — that is exactly what a limit means.`)] }; },
  r => { const a = r.nz(-6, 6), c = r.nz(1, 5), b = r.nz(-9, 9), d = r.int(1, 9), k = r.pick([0, 1]);
    const num = k ? poly([a, b], 'n') : poly([a, 0, b], 'n');
    return { q: qLim(R`\lim_{n\to\infty}\frac{${num}}{${poly([c, 0, d], 'n')}}`), a: k ? 0 : a / c, lvl: 2,
      hint: L('Разделите на $n^2$ — старшую степень знаменателя.', '$n^2$-қа — бөлімнің ең үлкен дәрежесіне бөліңіз.', 'Divide by $n^2$, the highest power in the denominator.'),
      steps: [L('Делим числитель и знаменатель на $n^2$:', 'Алымы мен бөлімін $n^2$-қа бөлеміз:', 'Divide the numerator and denominator by $n^2$:'),
        k ? R`$$\frac{\frac{${a}}{n}${sg(b).replace(/(\d+)$/, '\\frac{$1}{n^2}')}}{${c}+\frac{${d}}{n^2}}\to\frac{0+0}{${c}+0}=0$$` : R`$$\frac{${a}${sg(b).replace(/(\d+)$/, '\\frac{$1}{n^2}')}}{${c}+\frac{${d}}{n^2}}\to\frac{${a}}{${c}}=${nt(a / c)}$$`,
        k ? L('Знаменатель растёт быстрее числителя, поэтому дробь стремится к нулю.', 'Бөлімі алымынан тезірек өседі, сондықтан бөлшек нөлге ұмтылады.', 'The denominator outgrows the numerator, so the fraction tends to zero.') : L('Степени равны — остаётся отношение старших коэффициентов.', 'Дәрежелер тең — үлкен коэффициенттер қатынасы қалады.', 'Equal degrees — the ratio of leading coefficients remains.')] }; },
  r => { const a = 2 * r.nz(-5, 5);
    return { q: qLim(R`\lim_{n\to\infty}\left(\sqrt{n^2${sg(a)}n}-n\right)`), a: a / 2, lvl: 3,
      hint: L('Неопределённость $\\infty-\\infty$: умножьте и разделите на сопряжённое выражение.', '$\\infty-\\infty$ анықталмағандығы: түйіндес өрнекке көбейтіп, бөліңіз.', 'An $\\infty-\\infty$ form: multiply and divide by the conjugate.'),
      steps: [L('Оба слагаемых растут — «бесконечность минус бесконечность». Умножим и разделим на сопряжённое $\\sqrt{n^2+\\dots}+n$, чтобы применить формулу разности квадратов.', 'Екі қосылғыш та өседі — «шексіздік минус шексіздік». Квадраттар айырымы формуласын қолдану үшін түйіндес $\\sqrt{n^2+\\dots}+n$ өрнегіне көбейтіп, бөлеміз.', 'Both terms grow — “infinity minus infinity”. Multiply and divide by the conjugate $\\sqrt{n^2+\\dots}+n$ to use the difference of squares.'),
        R`$$\frac{(n^2${sg(a)}n)-n^2}{\sqrt{n^2${sg(a)}n}+n}=\frac{${co(a, 'n')}}{\sqrt{n^2${sg(a)}n}+n}$$`,
        L('Делим числитель и знаменатель на $n$ (под корнем — на $n^2$):', 'Алымы мен бөлімін $n$-ге бөлеміз (түбір астында — $n^2$-қа):', 'Divide the numerator and denominator by $n$ (under the root, by $n^2$):') + R` $\dfrac{${a}}{\sqrt{1${sg(a).replace(/(\d+)$/, '\\frac{$1}{n}')}}+1}\to\dfrac{${a}}{1+1}=${a / 2}$.`] }; },
  r => { const c = r.int(2, 9);
    return { q: L('Какая из последовательностей имеет конечный предел?', 'Тізбектердің қайсысының шекті шегі бар?', 'Which sequence has a finite limit?'), lvl: 1,
      ...choice(r, R`$a_n=${c}+\dfrac{1}{n}$`, [R`$a_n=(-1)^n$`, R`$a_n=n^2-${c}$`, R`$a_n=${c}n$`]),
      hint: L('Выпишите несколько первых членов каждой последовательности.', 'Әр тізбектің алғашқы бірнеше мүшесін жазып көріңіз.', 'Write out the first few terms of each sequence.'),
      steps: [L('$(-1)^n$: $-1,1,-1,1,\\dots$ — прыгает между двумя числами и ни к чему не приближается.', '$(-1)^n$: $-1,1,-1,1,\\dots$ — екі сан арасында секіреді, ешнәрсеге жақындамайды.', '$(-1)^n$: $-1,1,-1,1,\\dots$ jumps between two numbers and approaches nothing.'),
        L(`$n^2-${c}$ и $${c}n$ неограниченно растут.`, `$n^2-${c}$ және $${c}n$ шексіз өседі.`, `$n^2-${c}$ and $${c}n$ grow without bound.`),
        L(`А вот $${c}+\\frac1n$: добавка $\\frac1n$ тает, и члены прижимаются к числу $${c}$. Предел равен $${c}$.`, `Ал $${c}+\\frac1n$: $\\frac1n$ қосындысы «ериді», мүшелер $${c}$ санына жақындайды. Шек $${c}$-ге тең.`, `But $${c}+\\frac1n$: the extra $\\frac1n$ melts away and the terms squeeze toward $${c}$. The limit is $${c}$.`)] }; }
];

GEN['continuity'] = [
  r => { const a = r.nz(-3, 3), b = r.int(-5, 5), c = r.int(-2, 3), p = a * c + b - c * c;
    return { q: L(`При каком значении $p$ функция непрерывна в точке $x=${c}$? $$f(x)=\\begin{cases}${poly([a, b])},&x<${c}\\\\x^2+p,&x\\ge${c}\\end{cases}$$`, `$p$-ның қандай мәнінде функция $x=${c}$ нүктесінде үзіліссіз болады? $$f(x)=\\begin{cases}${poly([a, b])},&x<${c}\\\\x^2+p,&x\\ge${c}\\end{cases}$$`, `For which $p$ is the function continuous at $x=${c}$? $$f(x)=\\begin{cases}${poly([a, b])},&x<${c}\\\\x^2+p,&x\\ge${c}\\end{cases}$$`), a: p, lvl: 2,
      hint: L('Левый и правый пределы в точке стыка должны совпасть.', 'Түйісу нүктесіндегі сол және оң жақ шектер тең болуы керек.', 'The left and right limits at the junction must be equal.'),
      steps: [L('Функция непрерывна в точке, если график там не рвётся: левый предел, правый предел и значение функции совпадают.', 'Функция нүктеде үзіліссіз, егер график сол жерде үзілмесе: сол жақ шек, оң жақ шек және функция мәні тең.', 'A function is continuous at a point if the graph does not break there: the left limit, the right limit and the value all agree.'),
        L('Слева', 'Сол жақтан', 'From the left') + `: $\\lim\\limits_{x\\to${c}-0}(${poly([a, b])})=${subPoly([a, b], c)}=${a * c + b}$.`,
        L('Справа (и значение в точке)', 'Оң жақтан (және нүктедегі мән)', 'From the right (and the value)') + `: $${par(c)}^2+p=${c * c}+p$.`,
        L('Приравниваем', 'Теңестіреміз', 'Set them equal') + `: $${c * c}+p=${a * c + b}\\ \\Rightarrow\\ p=${p}$.`] }; },
  r => { const a = r.nz(-4, 4), k = r.pick([0, 1, 2]);
    const fs = [R`f(x)=\dfrac{x^2-${a * a}}{${poly([1, -a])}}`, R`f(x)=\dfrac{1}{${poly([1, -a])}}`, R`f(x)=\begin{cases}x+1,&x<${a}\\x+3,&x\ge${a}\end{cases}`];
    const names = [L('Устранимый разрыв («выколотая точка»)', 'Жөнделетін үзіліс («ойылған нүкте»)', 'Removable discontinuity (a hole)'), L('Бесконечный разрыв (второго рода)', 'Шексіз үзіліс (екінші текті)', 'Infinite discontinuity'), L('Скачок (разрыв первого рода)', 'Секіріс (бірінші текті үзіліс)', 'Jump discontinuity')];
    return { q: L(`Как ведёт себя функция $${fs[k]}$ в точке $x=${a}$?`, `$${fs[k]}$ функциясы $x=${a}$ нүктесінде өзін қалай ұстайды?`, `How does $${fs[k]}$ behave at $x=${a}$?`), lvl: 2,
      ...choice(r, names[k], [...names, L('Функция непрерывна', 'Функция үзіліссіз', 'The function is continuous')]),
      hint: L('Найдите левый и правый пределы в этой точке и сравните их.', 'Осы нүктедегі сол және оң жақ шектерді тауып, салыстырыңыз.', 'Find the one-sided limits at the point and compare them.'),
      steps: k === 0 ? [L(`В точке $x=${a}$ функция не определена (деление на нуль).`, `$x=${a}$ нүктесінде функция анықталмаған (нөлге бөлу).`, `The function is undefined at $x=${a}$ (division by zero).`), L(`Но при $x\\ne${a}$: $f(x)=${poly([1, a])}$, и предел существует: $\\lim\\limits_{x\\to${a}}f(x)=${2 * a}$.`, `Бірақ $x\\ne${a}$ кезінде: $f(x)=${poly([1, a])}$, шек бар: $\\lim\\limits_{x\\to${a}}f(x)=${2 * a}$.`, `But for $x\\ne${a}$: $f(x)=${poly([1, a])}$ and the limit exists: $\\lim\\limits_{x\\to${a}}f(x)=${2 * a}$.`), L('Предел есть, а значения нет — в графике одна «выколотая точка». Разрыв можно устранить, доопределив функцию.', 'Шек бар, ал мән жоқ — графикте бір «ойылған нүкте». Функцияны толықтырып анықтап, үзілісті жоюға болады.', 'The limit exists but the value does not — a single hole in the graph. It can be removed by defining the value.')]
        : k === 1 ? [L(`При $x\\to${a}$ знаменатель стремится к нулю, а числитель равен $1$.`, `$x\\to${a}$ кезінде бөлімі нөлге ұмтылады, ал алымы $1$-ге тең.`, `As $x\\to${a}$ the denominator tends to zero while the numerator is $1$.`), L('Значения функции уходят в $+\\infty$ справа и в $-\\infty$ слева: это бесконечный разрыв, прямая $x=' + a + '$ — вертикальная асимптота.', 'Функция мәндері оң жақтан $+\\infty$-ке, сол жақтан $-\\infty$-ке кетеді: бұл шексіз үзіліс, $x=' + a + '$ түзуі — вертикаль асимптота.', 'The values go to $+\\infty$ from the right and $-\\infty$ from the left: an infinite discontinuity; $x=' + a + '$ is a vertical asymptote.')]
          : [L('Слева', 'Сол жақтан', 'From the left') + `: $\\lim\\limits_{x\\to${a}-0}(x+1)=${a + 1}$.`, L('Справа', 'Оң жақтан', 'From the right') + `: $\\lim\\limits_{x\\to${a}+0}(x+3)=${a + 3}$.`, L('Оба предела конечны, но не равны — график «перепрыгивает» на 2 единицы. Это скачок.', 'Екі шек те шекті, бірақ тең емес — график 2 бірлікке «секіреді». Бұл — секіріс.', 'Both limits are finite but different — the graph jumps by 2 units. This is a jump.')] }; },
  r => { const a = r.int(-5, 4), b = r.int(a + 1, 6), n = r.int(-3, 3);
    return { q: L(`Найдите наибольшую из точек разрыва функции $f(x)=\\dfrac{${poly([1, n])}}{${poly([1, -(a + b), a * b])}}$.`, `$f(x)=\\dfrac{${poly([1, n])}}{${poly([1, -(a + b), a * b])}}$ функциясының үзіліс нүктелерінің ең үлкенін табыңыз.`, `Find the largest point of discontinuity of $f(x)=\\dfrac{${poly([1, n])}}{${poly([1, -(a + b), a * b])}}$.`), a: b, lvl: 1,
      hint: L('Дробь не определена там, где знаменатель равен нулю.', 'Бөлшек бөлімі нөлге тең жерде анықталмаған.', 'A fraction is undefined where its denominator is zero.'),
      steps: [L('Дробно-рациональная функция непрерывна всюду, кроме нулей знаменателя.', 'Бөлшек-рационал функция бөлімнің нөлдерінен басқа барлық жерде үзіліссіз.', 'A rational function is continuous everywhere except at the zeros of its denominator.'),
        L('Решаем', 'Шешеміз', 'Solve') + `: $${poly([1, -(a + b), a * b])}=0\\ \\Rightarrow\\ (${poly([1, -a])})(${poly([1, -b])})=0\\ \\Rightarrow\\ x=${a},\\ x=${b}$.`,
        L(`Точки разрыва: $${a}$ и $${b}$. Наибольшая: $${b}$.`, `Үзіліс нүктелері: $${a}$ және $${b}$. Ең үлкені: $${b}$.`, `Discontinuities: $${a}$ and $${b}$. The largest is $${b}$.`)] }; },
  r => { const a = r.nz(-3, 3), b = r.int(-4, 4), d = r.nz(-3, 3), e = r.int(-4, 4), c = r.int(-2, 3), j = d * c + e - (a * c + b); need(j !== 0);
    return { q: L(`Найдите величину скачка функции в точке $x=${c}$ (правый предел минус левый): $$f(x)=\\begin{cases}${poly([a, b])},&x<${c}\\\\${poly([d, e])},&x\\ge${c}\\end{cases}$$`, `Функцияның $x=${c}$ нүктесіндегі секіріс шамасын табыңыз (оң жақ шек минус сол жақ шек): $$f(x)=\\begin{cases}${poly([a, b])},&x<${c}\\\\${poly([d, e])},&x\\ge${c}\\end{cases}$$`, `Find the size of the jump at $x=${c}$ (right limit minus left limit): $$f(x)=\\begin{cases}${poly([a, b])},&x<${c}\\\\${poly([d, e])},&x\\ge${c}\\end{cases}$$`), a: j, lvl: 1,
      hint: L('Подставьте точку в каждую из двух формул.', 'Нүктені екі формуланың әрқайсысына қойыңыз.', 'Plug the point into each of the two formulas.'),
      steps: [L('Левый предел', 'Сол жақ шек', 'Left limit') + `: $${subPoly([a, b], c)}=${a * c + b}$.`, L('Правый предел', 'Оң жақ шек', 'Right limit') + `: $${subPoly([d, e], c)}=${d * c + e}$.`,
        L('Скачок', 'Секіріс', 'Jump') + `: $${d * c + e}-${par(a * c + b)}=${j}$. ` + L('Пределы не совпали — функция в этой точке разрывна.', 'Шектер тең емес — функция бұл нүктеде үзілісті.', 'The limits differ — the function is discontinuous there.')] }; },
  r => { const pool = r.shuffle([['$y=x^2+1$', 1], [R`$y=\sin x$`, 1], [R`$y=\dfrac1x$`, 0], [R`$y=\operatorname{tg}x$`, 0], ['$y=|x|$', 1], [R`$y=\dfrac{1}{x^2+1}$`, 1], [R`$y=\dfrac{x}{x-2}$`, 0], ['$y=e^x$', 1]]).slice(0, 5);
    const a = pool.map((p, i) => p[1] ? i : -1).filter(i => i >= 0); need(a.length > 0 && a.length < 5);
    return { q: L('Какие функции непрерывны на всей числовой прямой?', 'Қай функциялар бүкіл сан түзуінде үзіліссіз?', 'Which functions are continuous on the whole real line?'), opts: pool.map(p => p[0]), a, lvl: 1,
      hint: L('Ищите точки, где функция не определена: деление на нуль, тангенс при $\\frac\\pi2+\\pi n$.', 'Функция анықталмаған нүктелерді іздеңіз: нөлге бөлу, $\\frac\\pi2+\\pi n$ кезіндегі тангенс.', 'Look for points where the function is undefined: division by zero, tangent at $\\frac\\pi2+\\pi n$.'),
      steps: [L('Многочлены, $\\sin x$, $\\cos x$, $e^x$, $|x|$ непрерывны при всех $x$.', 'Көпмүшелер, $\\sin x$, $\\cos x$, $e^x$, $|x|$ барлық $x$ үшін үзіліссіз.', 'Polynomials, $\\sin x$, $\\cos x$, $e^x$, $|x|$ are continuous for all $x$.'),
        L('Дробь разрывна в нулях знаменателя: $\\frac1x$ — в нуле, $\\frac{x}{x-2}$ — в точке 2. А вот $\\frac{1}{x^2+1}$ непрерывна: $x^2+1\\ne0$.', 'Бөлшек бөлімнің нөлдерінде үзілісті: $\\frac1x$ — нөлде, $\\frac{x}{x-2}$ — 2 нүктесінде. Ал $\\frac{1}{x^2+1}$ үзіліссіз: $x^2+1\\ne0$.', 'A fraction breaks at zeros of the denominator: $\\frac1x$ at 0, $\\frac{x}{x-2}$ at 2. But $\\frac{1}{x^2+1}$ is continuous since $x^2+1\\ne0$.'),
        L('$\\operatorname{tg}x=\\frac{\\sin x}{\\cos x}$ разрывен там, где $\\cos x=0$.', '$\\operatorname{tg}x=\\frac{\\sin x}{\\cos x}$ функциясы $\\cos x=0$ болатын жерде үзілісті.', '$\\operatorname{tg}x=\\frac{\\sin x}{\\cos x}$ breaks where $\\cos x=0$.')] }; },
  r => { const n = r.int(1, 3), lo = n * n * n + n, hi = (n + 1) ** 3 + n + 1, k = r.int(lo + 1, hi - 1);
    const iv = i => `$[${i};\\,${i + 1}]$`;
    return { q: L(`Функция $f(x)=x^3+x-${k}$ непрерывна. На каком отрезке у уравнения $f(x)=0$ обязательно есть корень?`, `$f(x)=x^3+x-${k}$ функциясы үзіліссіз. $f(x)=0$ теңдеуінің қай кесіндіде міндетті түрде түбірі бар?`, `The function $f(x)=x^3+x-${k}$ is continuous. On which interval must $f(x)=0$ have a root?`), lvl: 3,
      ...choice(r, iv(n), [0, 1, 2, 3, 4].filter(i => i !== n).map(iv)),
      hint: L('Непрерывная функция, меняющая знак на отрезке, обязательно обращается в нуль внутри него.', 'Кесіндіде таңбасын өзгертетін үзіліссіз функция оның ішінде міндетті түрде нөлге айналады.', 'A continuous function that changes sign on an interval must vanish inside it.'),
      steps: [L('Свойство непрерывных функций: если на концах отрезка значения разных знаков, то график, не отрываясь, обязан пересечь ось $Ox$.', 'Үзіліссіз функциялардың қасиеті: кесінді ұштарындағы мәндердің таңбалары әртүрлі болса, график үзілмей $Ox$ осін қиюға міндетті.', 'Property of continuous functions: if the values at the endpoints have opposite signs, the unbroken graph must cross the $x$-axis.'),
        `$f(${n})=${n ** 3}+${n}-${k}=${lo - k}<0$.`, `$f(${n + 1})=${(n + 1) ** 3}+${n + 1}-${k}=${hi - k}>0$.`,
        L(`Знаки разные, значит корень лежит на отрезке $[${n};\\,${n + 1}]$.`, `Таңбалар әртүрлі, демек түбір $[${n};\\,${n + 1}]$ кесіндісінде жатыр.`, `The signs differ, so a root lies in $[${n};\\,${n + 1}]$.`)] }; }
];

GEN['indeterminate'] = [
  r => { const a = r.int(-4, 4), b = r.int(-5, 5), c = r.int(-5, 5); need(a !== b && a !== c && b !== c);
    return { q: qLim(R`\lim_{x\to ${a}}\frac{${poly([1, -(a + b), a * b])}}{${poly([1, -(a + c), a * c])}}`), a: (a - b) / (a - c), lvl: 2,
      hint: L(`Получается $\\frac00$. Разложите оба трёхчлена — в каждом есть множитель $(${poly([1, -a])})$.`, `$\\frac00$ шығады. Екі үшмүшені де жіктеңіз — әрқайсысында $(${poly([1, -a])})$ көбейткіші бар.`, `You get $\\frac00$. Factor both quadratics — each has the factor $(${poly([1, -a])})$.`),
      steps: [L(`Подстановка $x=${a}$ даёт $\\frac00$. Раз оба многочлена обращаются в нуль при $x=${a}$, у обоих есть множитель $(${poly([1, -a])})$.`, `$x=${a}$ қойғанда $\\frac00$ шығады. Екі көпмүше де $x=${a}$ кезінде нөлге айналатындықтан, екеуінде де $(${poly([1, -a])})$ көбейткіші бар.`, `Plugging in $x=${a}$ gives $\\frac00$. Since both polynomials vanish at $x=${a}$, both contain the factor $(${poly([1, -a])})$.`),
        `${W.factor}: $\\dfrac{(${poly([1, -a])})(${poly([1, -b])})}{(${poly([1, -a])})(${poly([1, -c])})}$.`,
        `${W.cancel}: $\\dfrac{${poly([1, -b])}}{${poly([1, -c])}}$.`, `${W.sub} $x=${a}$: $\\dfrac{${a - b}}{${a - c}}=${nt((a - b) / (a - c))}$.`] }; },
  r => { const a = r.int(1, 5), c = r.nz(1, 5), b = r.int(1, 9), d = r.int(-6, 6);
    return { q: qLim(R`\lim_{x\to+\infty}\frac{\sqrt{${a * a}x^2+${b}}}{${poly([c, d])}}`), a: a / c, lvl: 2,
      hint: L('Вынесите $x$ из-под корня и разделите на $x$.', 'Түбір астынан $x$-ті шығарып, $x$-ке бөліңіз.', 'Pull $x$ out of the root and divide by $x$.'),
      steps: [L('Неопределённость $\\frac\\infty\\infty$. Делим числитель и знаменатель на $x>0$; под корень $x$ входит как $x^2$:', '$\\frac\\infty\\infty$ анықталмағандығы. Алымы мен бөлімін $x>0$-ге бөлеміз; түбір астына $x$ саны $x^2$ болып кіреді:', 'An $\\frac\\infty\\infty$ form. Divide the numerator and denominator by $x>0$; under the root $x$ enters as $x^2$:'),
        R`$$\frac{\sqrt{${a * a}+\frac{${b}}{x^2}}}{${c}${d ? sg(d).replace(/(\d+)$/, '\\frac{$1}{x}') : ''}}\to\frac{\sqrt{${a * a}}}{${c}}=\frac{${a}}{${c}}=${nt(a / c)}$$`] }; },
  r => { const k = r.int(2, 9), mm = r.int(2, 9); need(k !== mm);
    return { q: qLim(R`\lim_{x\to0}\frac{\sin ${k}x}{${mm}x}`), a: k / mm, lvl: 1,
      hint: L('Первый замечательный предел: $\\lim\\limits_{t\\to0}\\frac{\\sin t}{t}=1$. Сделайте так, чтобы под синусом и в знаменателе стояло одно и то же.', 'Бірінші тамаша шек: $\\lim\\limits_{t\\to0}\\frac{\\sin t}{t}=1$. Синус астында және бөлімде бірдей өрнек тұратындай етіңіз.', 'The first remarkable limit: $\\lim\\limits_{t\\to0}\\frac{\\sin t}{t}=1$. Arrange the same expression under the sine and in the denominator.'),
      steps: [L(`Под синусом стоит $${k}x$ — значит, и в знаменателе нужно получить $${k}x$. Умножим и разделим на $${k}$:`, `Синус астында $${k}x$ тұр — демек, бөлімде де $${k}x$ алу керек. $${k}$-ге көбейтіп, бөлеміз:`, `The sine contains $${k}x$, so we want $${k}x$ in the denominator too. Multiply and divide by $${k}$:`),
        R`$$\frac{\sin ${k}x}{${mm}x}=\frac{\sin ${k}x}{${k}x}\cdot\frac{${k}}{${mm}}$$`,
        L(`Первая дробь стремится к $1$ (замена $t=${k}x\\to0$), поэтому предел равен $${nt(k / mm)}$.`, `Бірінші бөлшек $1$-ге ұмтылады ($t=${k}x\\to0$ алмастыруы), сондықтан шек $${nt(k / mm)}$.`, `The first fraction tends to $1$ (substitute $t=${k}x\\to0$), so the limit is $${nt(k / mm)}$.`)] }; },
  r => { const a = r.int(2, 9), b = r.int(2, 9); need(a !== b);
    return { q: qLim(R`\lim_{x\to0}\frac{\sin ${a}x}{\sin ${b}x}`), a: a / b, lvl: 2,
      hint: L('Разделите числитель и знаменатель на $x$ и дважды примените первый замечательный предел.', 'Алымы мен бөлімін $x$-ке бөліп, бірінші тамаша шекті екі рет қолданыңыз.', 'Divide the numerator and denominator by $x$ and use the first remarkable limit twice.'),
      steps: [L('Делим числитель и знаменатель на $x$:', 'Алымы мен бөлімін $x$-ке бөлеміз:', 'Divide the numerator and denominator by $x$:') + R` $\dfrac{\frac{\sin ${a}x}{x}}{\frac{\sin ${b}x}{x}}$.`,
        L(`Знаем: $\\lim\\limits_{x\\to0}\\dfrac{\\sin kx}{x}=k$. Поэтому числитель стремится к $${a}$, знаменатель — к $${b}$.`, `Білеміз: $\\lim\\limits_{x\\to0}\\dfrac{\\sin kx}{x}=k$. Сондықтан алымы $${a}$-ге, бөлімі $${b}$-ге ұмтылады.`, `We know $\\lim\\limits_{x\\to0}\\dfrac{\\sin kx}{x}=k$. So the numerator tends to $${a}$ and the denominator to $${b}$.`),
        `${W.so}: $\\dfrac{${a}}{${b}}=${nt(a / b)}$.`] }; },
  r => { const a = r.int(1, 5);
    return { q: qLim(R`\lim_{x\to0}\frac{\sqrt{x+${a * a}}-${a}}{x}`), a: 1 / (2 * a), lvl: 3,
      hint: L('Умножьте числитель и знаменатель на сопряжённое $\\sqrt{x+' + a * a + '}+' + a + '$.', 'Алымы мен бөлімін түйіндес $\\sqrt{x+' + a * a + '}+' + a + '$ өрнегіне көбейтіңіз.', 'Multiply the numerator and denominator by the conjugate $\\sqrt{x+' + a * a + '}+' + a + '$.'),
      steps: [L('При $x=0$ получаем $\\frac00$. Корень мешает сократить — избавимся от него с помощью сопряжённого выражения:', '$x=0$ кезінде $\\frac00$ шығады. Түбір қысқартуға кедергі — одан түйіндес өрнек арқылы құтыламыз:', 'At $x=0$ we get $\\frac00$. The root blocks cancelling — remove it with the conjugate:'),
        R`$$\frac{(\sqrt{x+${a * a}}-${a})(\sqrt{x+${a * a}}+${a})}{x(\sqrt{x+${a * a}}+${a})}=\frac{x+${a * a}-${a * a}}{x(\sqrt{x+${a * a}}+${a})}=\frac{1}{\sqrt{x+${a * a}}+${a}}$$`,
        `${W.sub} $x=0$: $\\dfrac{1}{${a}+${a}}=${fr(1, 2 * a)}$.`] }; },
  r => { const k = r.int(1, 4) * 2;
    return { q: qLim(R`\lim_{x\to0}\frac{1-\cos ${k}x}{x^2}`), a: k * k / 2, lvl: 3,
      hint: L('Формула: $1-\\cos2\\alpha=2\\sin^2\\alpha$.', 'Формула: $1-\\cos2\\alpha=2\\sin^2\\alpha$.', 'Identity: $1-\\cos2\\alpha=2\\sin^2\\alpha$.'),
      steps: [L(`По формуле понижения степени: $1-\\cos ${k}x=2\\sin^2 ${co(k / 2, 'x')}$.`, `Дәрежені төмендету формуласы бойынша: $1-\\cos ${k}x=2\\sin^2 ${co(k / 2, 'x')}$.`, `By the half-angle identity: $1-\\cos ${k}x=2\\sin^2 ${co(k / 2, 'x')}$.`),
        R`$$\frac{2\sin^2 ${co(k / 2, 'x')}}{x^2}=2\cdot\left(\frac{\sin ${co(k / 2, 'x')}}{x}\right)^2$$`,
        L(`Так как $\\dfrac{\\sin ${co(k / 2, 'x')}}{x}\\to${k / 2}$, получаем $2\\cdot${k / 2}^2=${k * k / 2}$.`, `$\\dfrac{\\sin ${co(k / 2, 'x')}}{x}\\to${k / 2}$ болғандықтан, $2\\cdot${k / 2}^2=${k * k / 2}$ шығады.`, `Since $\\dfrac{\\sin ${co(k / 2, 'x')}}{x}\\to${k / 2}$, we get $2\\cdot${k / 2}^2=${k * k / 2}$.`)] }; }
];

/* ================= ПРОИЗВОДНАЯ ================= */
GEN['derivative-def'] = [
  r => { const a = r.nz(-3, 3), b = r.int(-4, 4), x0 = r.int(-2, 3), dx = r.int(1, 3), c = [a, b, 0], dy = pv(c, x0 + dx) - pv(c, x0);
    return { q: L(`Найдите приращение функции $f(x)=${poly(c)}$ при переходе от $x_0=${x0}$ к точке $x_0+\\Delta x$, где $\\Delta x=${dx}$.`, `$f(x)=${poly(c)}$ функциясының $x_0=${x0}$ нүктесінен $x_0+\\Delta x$ нүктесіне өткендегі өсімшесін табыңыз, мұндағы $\\Delta x=${dx}$.`, `Find the increment of $f(x)=${poly(c)}$ when moving from $x_0=${x0}$ to $x_0+\\Delta x$, where $\\Delta x=${dx}$.`), a: dy, lvl: 1,
      hint: L('$\\Delta y=f(x_0+\\Delta x)-f(x_0)$.', '$\\Delta y=f(x_0+\\Delta x)-f(x_0)$.', '$\\Delta y=f(x_0+\\Delta x)-f(x_0)$.'),
      steps: [L('Приращение аргумента $\\Delta x$ — на сколько сдвинулись по оси $x$; приращение функции $\\Delta y$ — на сколько при этом изменилось значение функции.', 'Аргумент өсімшесі $\\Delta x$ — $x$ осі бойынша қаншаға жылжығанымыз; функция өсімшесі $\\Delta y$ — сол кезде функция мәні қаншаға өзгергені.', 'The increment $\\Delta x$ is how far we moved along $x$; the increment $\\Delta y$ is how much the function value changed.'),
        `$x_0+\\Delta x=${x0 + dx}$; $f(${x0 + dx})=${subPoly(c, x0 + dx)}=${pv(c, x0 + dx)}$.`, `$f(${x0})=${subPoly(c, x0)}=${pv(c, x0)}$.`, `$\\Delta y=${pv(c, x0 + dx)}-${par(pv(c, x0))}=${dy}$.`] }; },
  r => { const a = r.nz(-3, 3), b = r.int(-4, 4), x0 = r.int(-2, 2), dx = r.pick([1, 2, 4]), c = [a, b, r.int(-3, 3)], dy = pv(c, x0 + dx) - pv(c, x0);
    return { q: L(`Найдите среднюю скорость изменения функции $f(x)=${poly(c)}$ на отрезке $[${x0};\\,${x0 + dx}]$, то есть отношение $\\dfrac{\\Delta y}{\\Delta x}$.`, `$f(x)=${poly(c)}$ функциясының $[${x0};\\,${x0 + dx}]$ кесіндісіндегі орташа өзгеру жылдамдығын, яғни $\\dfrac{\\Delta y}{\\Delta x}$ қатынасын табыңыз.`, `Find the average rate of change of $f(x)=${poly(c)}$ on $[${x0};\\,${x0 + dx}]$, i.e. the ratio $\\dfrac{\\Delta y}{\\Delta x}$.`), a: dy / dx, lvl: 1,
      hint: L('Это угловой коэффициент секущей через две точки графика.', 'Бұл — графиктің екі нүктесі арқылы өтетін қиюшының бұрыштық коэффициенті.', 'It is the slope of the secant through two points of the graph.'),
      steps: [`$\\Delta x=${x0 + dx}-${par(x0)}=${dx}$.`, `$\\Delta y=f(${x0 + dx})-f(${x0})=${pv(c, x0 + dx)}-${par(pv(c, x0))}=${dy}$.`,
        `$\\dfrac{\\Delta y}{\\Delta x}=\\dfrac{${dy}}{${dx}}=${nt(dy / dx)}$. ` + L('Геометрически это наклон секущей; если уменьшать $\\Delta x$, секущая превратится в касательную, а отношение — в производную.', 'Геометриялық тұрғыда бұл — қиюшының көлбеулігі; $\\Delta x$-ті азайтсақ, қиюшы жанамаға, ал қатынас туындыға айналады.', 'Geometrically this is the slope of the secant; as $\\Delta x$ shrinks, the secant becomes the tangent and the ratio becomes the derivative.')] }; },
  r => { const a = r.nz(-5, 5), n = r.int(2, 5), x0 = r.pick([-2, -1, 1, 2]), v = a * n * x0 ** (n - 1);
    return { q: qFind(`$f'(${x0})$`, `$f(x)=${co(a, `x^{${n}}`)}$`), a: v, lvl: 1,
      hint: L('$(x^n)\'=nx^{n-1}$; числовой множитель выносится за знак производной.', '$(x^n)\'=nx^{n-1}$; сандық көбейткіш туынды таңбасының алдына шығады.', '$(x^n)\'=nx^{n-1}$; a constant factor comes out of the derivative.'),
      steps: [L(`Правило степени: показатель «спрыгивает» вперёд множителем, а степень уменьшается на 1: $(x^{${n}})'=${n}x^{${n - 1}}$.`, `Дәреже ережесі: көрсеткіш алға көбейткіш болып «секіреді», ал дәреже 1-ге кемиді: $(x^{${n}})'=${n}x^{${n - 1}}$.`, `Power rule: the exponent jumps down as a factor and the power drops by 1: $(x^{${n}})'=${n}x^{${n - 1}}$.`),
        `$f'(x)=${a}\\cdot${n}x^{${n - 1}}=${co(a * n, n - 1 === 1 ? 'x' : `x^{${n - 1}}`)}$.`, `${W.sub} $x=${x0}$: $f'(${x0})=${a * n}\\cdot${par(x0)}${n - 1 > 1 ? `^{${n - 1}}` : ''}=${v}$.`] }; },
  r => { const c = [r.nz(-3, 3), r.int(-4, 4), r.nz(-6, 6), r.int(-9, 9)], d = dp(c), x0 = r.int(-2, 2);
    return { q: qFind(`$f'(${x0})$`, `$f(x)=${poly(c)}$`), a: pv(d, x0), lvl: 1,
      hint: L('Дифференцируйте каждое слагаемое отдельно; производная числа равна нулю.', 'Әр қосылғышты жеке дифференциалдаңыз; санның туындысы нөлге тең.', 'Differentiate term by term; the derivative of a constant is zero.'),
      steps: [L('Производная суммы равна сумме производных. Берём каждое слагаемое по правилу $(x^n)\'=nx^{n-1}$; константа не меняется, её производная $0$.', 'Қосындының туындысы туындылардың қосындысына тең. Әр қосылғышты $(x^n)\'=nx^{n-1}$ ережесімен аламыз; тұрақты өзгермейді, оның туындысы $0$.', 'The derivative of a sum is the sum of derivatives. Use $(x^n)\'=nx^{n-1}$ on each term; a constant does not change, so its derivative is $0$.'),
        `$f'(x)=${poly(d)}$.`, `${W.sub} $x=${x0}$: $${subPoly(d, x0)}=${pv(d, x0)}$.`] }; },
  r => { const a = r.nz(-4, 4), b = r.int(-5, 5), x0 = r.int(-3, 3), v = 2 * a * x0 + b;
    return { q: L(`Пользуясь определением производной, найдите $f'(${x0})$ для $f(x)=${poly([a, b, 0])}$.`, `Туындының анықтамасын пайдаланып, $f(x)=${poly([a, b, 0])}$ үшін $f'(${x0})$ табыңыз.`, `Using the definition of the derivative, find $f'(${x0})$ for $f(x)=${poly([a, b, 0])}$.`), a: v, lvl: 2,
      hint: L('Составьте $\\dfrac{\\Delta y}{\\Delta x}$, упростите и устремите $\\Delta x\\to0$.', '$\\dfrac{\\Delta y}{\\Delta x}$ құрып, ықшамдап, $\\Delta x\\to0$ ұмтылдырыңыз.', 'Form $\\dfrac{\\Delta y}{\\Delta x}$, simplify and let $\\Delta x\\to0$.'),
      steps: [L('Определение: $f\'(x_0)=\\lim\\limits_{\\Delta x\\to0}\\dfrac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}$. Обозначим $\\Delta x=h$.', 'Анықтама: $f\'(x_0)=\\lim\\limits_{\\Delta x\\to0}\\dfrac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}$. $\\Delta x=h$ деп белгілейміз.', 'Definition: $f\'(x_0)=\\lim\\limits_{\\Delta x\\to0}\\dfrac{f(x_0+\\Delta x)-f(x_0)}{\\Delta x}$. Write $\\Delta x=h$.'),
        `$f(${x0}+h)=${a}(${x0}+h)^2${b ? sg(b) + `(${x0}+h)` : ''}=${poly([a, 2 * a * x0 + b, pv([a, b, 0], x0)], 'h')}$.`,
        `$\\Delta y=f(${x0}+h)-f(${x0})=${poly([a, v, 0], 'h')}$.`,
        `$\\dfrac{\\Delta y}{h}=${poly([a, v], 'h')}$ ` + L('(сократили на $h\\ne0$).', '($h\\ne0$-ге қысқарттық).', '(cancelled $h\\ne0$).'),
        L(`При $h\\to0$ слагаемое с $h$ исчезает: $f'(${x0})=${v}$.`, `$h\\to0$ кезінде $h$ бар қосылғыш жойылады: $f'(${x0})=${v}$.`, `As $h\\to0$ the term with $h$ vanishes: $f'(${x0})=${v}$.`)] }; },
  r => { const a = r.nz(-6, 6), n = r.pick([1, 2]), x0 = r.pick([-2, -1, 1, 2]), v = -n * a / x0 ** (n + 1);
    return { q: qFind(`$f'(${x0})$`, `$f(x)=\\dfrac{${a}}{${n === 1 ? 'x' : 'x^2'}}$`), a: v, lvl: 2,
      hint: L('Запишите дробь как степень с отрицательным показателем: $\\frac{1}{x^n}=x^{-n}$.', 'Бөлшекті теріс көрсеткішті дәреже ретінде жазыңыз: $\\frac{1}{x^n}=x^{-n}$.', 'Rewrite the fraction as a negative power: $\\frac{1}{x^n}=x^{-n}$.'),
      steps: [L(`Перепишем: $f(x)=${a}x^{-${n}}$. Правило степени работает и для отрицательных показателей.`, `Қайта жазамыз: $f(x)=${a}x^{-${n}}$. Дәреже ережесі теріс көрсеткіштер үшін де жұмыс істейді.`, `Rewrite: $f(x)=${a}x^{-${n}}$. The power rule works for negative exponents as well.`),
        `$f'(x)=${a}\\cdot(-${n})x^{-${n + 1}}=${fr(-n * a, 1) < 0 || -n * a < 0 ? '-' : ''}\\dfrac{${Math.abs(n * a)}}{x^{${n + 1}}}$.`,
        `${W.sub} $x=${x0}$: $f'(${x0})=${-n * a < 0 ? '-' : ''}\\dfrac{${Math.abs(n * a)}}{${x0 ** (n + 1)}}=${nt(v)}$.`] }; }
];

GEN['differential'] = [
  r => { const a = r.nz(-3, 3), b = r.int(-4, 4), x0 = r.int(-2, 3), dx = r.pick([0.1, 0.2, 0.01]), k = 2 * a * x0 + b; need(k !== 0);
    return { q: L(`Найдите дифференциал функции $y=${poly([a, b, 0])}$ в точке $x_0=${x0}$ при $dx=${dec(dx)}$.`, `$y=${poly([a, b, 0])}$ функциясының $x_0=${x0}$ нүктесіндегі дифференциалын $dx=${dec(dx)}$ болғанда табыңыз.`, `Find the differential of $y=${poly([a, b, 0])}$ at $x_0=${x0}$ for $dx=${dec(dx)}$.`), a: k * dx, tol: 0.0006, lvl: 1,
      hint: L('$dy=f\'(x_0)\\,dx$.', '$dy=f\'(x_0)\\,dx$.', '$dy=f\'(x_0)\\,dx$.'),
      steps: [L('Дифференциал — это главная, линейная часть приращения функции: $dy=f\'(x_0)\\,dx$. По сути, приращение вдоль касательной.', 'Дифференциал — функция өсімшесінің басты, сызықтық бөлігі: $dy=f\'(x_0)\\,dx$. Шын мәнінде, жанама бойымен алынған өсімше.', 'The differential is the main, linear part of the increment: $dy=f\'(x_0)\\,dx$ — the increment along the tangent.'),
        `$f'(x)=${poly([2 * a, b])}$, $f'(${x0})=${k}$.`, `$dy=${k}\\cdot${dec(dx)}=${dec(k * dx, 4)}$.`] }; },
  r => { const n = r.int(2, 6), kk = r.pick([-2, -1, 1, 2, 3]), d = +(0.1 * n * kk).toFixed(2), v = n + 0.05 * kk;
    return { q: L(`С помощью дифференциала вычислите приближённо $\\sqrt{${dec(n * n + d)}}$.`, `Дифференциалдың көмегімен $\\sqrt{${dec(n * n + d)}}$ мәнін жуықтап есептеңіз.`, `Use the differential to approximate $\\sqrt{${dec(n * n + d)}}$.`), a: v, tol: 0.004, lvl: 2,
      hint: L('$f(x_0+\\Delta x)\\approx f(x_0)+f\'(x_0)\\Delta x$, где $f(x)=\\sqrt x$, а $x_0$ — ближайший точный квадрат.', '$f(x_0+\\Delta x)\\approx f(x_0)+f\'(x_0)\\Delta x$, мұндағы $f(x)=\\sqrt x$, ал $x_0$ — ең жақын толық квадрат.', '$f(x_0+\\Delta x)\\approx f(x_0)+f\'(x_0)\\Delta x$ with $f(x)=\\sqrt x$ and $x_0$ the nearest perfect square.'),
      steps: [L(`Рядом с $${dec(n * n + d)}$ есть «удобное» число $x_0=${n * n}$: $\\sqrt{${n * n}}=${n}$. Тогда $\\Delta x=${dec(d)}$.`, `$${dec(n * n + d)}$ маңында «ыңғайлы» сан бар: $x_0=${n * n}$, $\\sqrt{${n * n}}=${n}$. Сонда $\\Delta x=${dec(d)}$.`, `Near $${dec(n * n + d)}$ there is a convenient number $x_0=${n * n}$: $\\sqrt{${n * n}}=${n}$. Then $\\Delta x=${dec(d)}$.`),
        `$f(x)=\\sqrt x,\\ f'(x)=\\dfrac{1}{2\\sqrt x},\\ f'(${n * n})=\\dfrac{1}{${2 * n}}$.`,
        L('Вблизи точки график почти совпадает с касательной, поэтому', 'Нүкте маңында график жанамамен дерлік беттеседі, сондықтан', 'Near the point the graph almost coincides with its tangent, so') + ` $\\sqrt{${dec(n * n + d)}}\\approx${n}+\\dfrac{1}{${2 * n}}\\cdot${par(d).replace('.', LANG === 'en' ? '.' : '{,}')}=${dec(v, 3)}$.`] }; },
  r => { const x0 = r.int(1, 5), dx = r.pick([0.1, 0.2, 0.5]), a = r.int(1, 3);
    return { q: L(`Для функции $y=${co(a, 'x^2')}$ в точке $x_0=${x0}$ при $\\Delta x=${dec(dx)}$ найдите разность $\\Delta y-dy$ между приращением функции и её дифференциалом.`, `$y=${co(a, 'x^2')}$ функциясы үшін $x_0=${x0}$ нүктесінде $\\Delta x=${dec(dx)}$ болғанда функция өсімшесі мен дифференциалының $\\Delta y-dy$ айырымын табыңыз.`, `For $y=${co(a, 'x^2')}$ at $x_0=${x0}$ with $\\Delta x=${dec(dx)}$, find the difference $\\Delta y-dy$ between the increment and the differential.`), a: a * dx * dx, tol: 0.0006, lvl: 2,
      hint: L('Найдите $\\Delta y$ точно, а $dy$ — по формуле $f\'(x_0)\\Delta x$.', '$\\Delta y$-ті дәл, ал $dy$-ті $f\'(x_0)\\Delta x$ формуласымен табыңыз.', 'Find $\\Delta y$ exactly and $dy$ from $f\'(x_0)\\Delta x$.'),
      steps: [`$\\Delta y=${a}(${x0}+${dec(dx)})^2-${a}\\cdot${x0}^2=${dec(a * ((x0 + dx) ** 2 - x0 * x0), 4)}$.`, `$dy=f'(${x0})\\Delta x=${2 * a * x0}\\cdot${dec(dx)}=${dec(2 * a * x0 * dx, 4)}$.`,
        `$\\Delta y-dy=${dec(a * dx * dx, 4)}$. ` + L(`Это в точности $${a === 1 ? '' : a}(\\Delta x)^2$ — маленькая «добавка», которой дифференциал пренебрегает.`, `Бұл — дәл $${a === 1 ? '' : a}(\\Delta x)^2$, дифференциал елемейтін кішкентай «қосымша».`, `That is exactly $${a === 1 ? '' : a}(\\Delta x)^2$ — the tiny extra that the differential ignores.`)] }; },
  r => { return { q: L('Каков геометрический смысл дифференциала $dy$ функции в точке $x_0$?', 'Функцияның $x_0$ нүктесіндегі $dy$ дифференциалының геометриялық мағынасы қандай?', 'What is the geometric meaning of the differential $dy$ at $x_0$?'), lvl: 1,
      ...choice(r, L('Приращение ординаты касательной при изменении $x$ на $dx$', '$x$ шамасы $dx$-ке өзгергендегі жанама ординатасының өсімшесі', 'The change in the tangent line\'s ordinate when $x$ changes by $dx$'),
        [L('Приращение ординаты самой кривой', 'Қисықтың өз ординатасының өсімшесі', 'The change in the curve\'s own ordinate'), L('Площадь под графиком', 'График астындағы аудан', 'The area under the graph'), L('Угол наклона касательной', 'Жанаманың көлбеу бұрышы', 'The angle of the tangent')]),
      hint: L('$dy=f\'(x_0)dx$, а $f\'(x_0)$ — угловой коэффициент касательной.', '$dy=f\'(x_0)dx$, ал $f\'(x_0)$ — жанаманың бұрыштық коэффициенті.', '$dy=f\'(x_0)dx$ and $f\'(x_0)$ is the slope of the tangent.'),
      steps: [L('Касательная в точке $x_0$ — прямая с угловым коэффициентом $k=f\'(x_0)$.', '$x_0$ нүктесіндегі жанама — бұрыштық коэффициенті $k=f\'(x_0)$ болатын түзу.', 'The tangent at $x_0$ is a line with slope $k=f\'(x_0)$.'),
        L('Если сдвинуться по оси $x$ на $dx$, то по прямой с наклоном $k$ мы поднимемся на $k\\cdot dx=f\'(x_0)dx=dy$.', '$x$ осі бойынша $dx$-ке жылжысақ, көлбеулігі $k$ түзу бойымен $k\\cdot dx=f\'(x_0)dx=dy$-ке көтерілеміз.', 'Moving $dx$ along $x$, a line of slope $k$ rises by $k\\cdot dx=f\'(x_0)dx=dy$.'),
        L('Значит, $dy$ — приращение ординаты касательной, а $\\Delta y$ — приращение ординаты кривой. При малых $dx$ они почти равны.', 'Демек, $dy$ — жанама ординатасының өсімшесі, ал $\\Delta y$ — қисық ординатасының өсімшесі. Кіші $dx$ үшін олар дерлік тең.', 'So $dy$ is the rise of the tangent while $\\Delta y$ is the rise of the curve. For small $dx$ they are nearly equal.')] }; },
  r => { const n = r.int(3, 8), d = r.pick([0.01, 0.02, 0.03, -0.01, -0.02]), v = 1 + n * d;
    return { q: L(`С помощью дифференциала вычислите приближённо $${dec(1 + d)}^{${n}}$.`, `Дифференциалдың көмегімен $${dec(1 + d)}^{${n}}$ мәнін жуықтап есептеңіз.`, `Use the differential to approximate $${dec(1 + d)}^{${n}}$.`), a: v, tol: 0.006, lvl: 2,
      hint: L('$(1+\\alpha)^n\\approx1+n\\alpha$ при малых $\\alpha$.', 'Кіші $\\alpha$ үшін $(1+\\alpha)^n\\approx1+n\\alpha$.', '$(1+\\alpha)^n\\approx1+n\\alpha$ for small $\\alpha$.'),
      steps: [L(`Возьмём $f(x)=x^{${n}}$, $x_0=1$, $\\Delta x=${dec(d)}$.`, `$f(x)=x^{${n}}$, $x_0=1$, $\\Delta x=${dec(d)}$ аламыз.`, `Take $f(x)=x^{${n}}$, $x_0=1$, $\\Delta x=${dec(d)}$.`), `$f(1)=1,\\quad f'(x)=${n}x^{${n - 1}},\\quad f'(1)=${n}$.`,
        `$${dec(1 + d)}^{${n}}\\approx f(1)+f'(1)\\Delta x=1+${n}\\cdot${d < 0 ? '(' + dec(d) + ')' : dec(d)}=${dec(v)}$.`] }; }
];

GEN['diff-rules'] = [
  r => { const a = r.nz(-3, 3), b = r.nz(-5, 5), c = r.nz(-3, 3), d = r.nz(-5, 5), x0 = r.int(-2, 2), v = a * (c * x0 + d) + c * (a * x0 + b);
    return { q: qFind(`$f'(${x0})$`, `$f(x)=(${poly([a, b])})(${poly([c, d])})$`), a: v, lvl: 1,
      hint: L('Правило произведения: $(uv)\'=u\'v+uv\'$.', 'Көбейтінді ережесі: $(uv)\'=u\'v+uv\'$.', 'Product rule: $(uv)\'=u\'v+uv\'$.'),
      steps: [L(`Обозначим $u=${poly([a, b])}$, $v=${poly([c, d])}$. Тогда $u'=${a}$, $v'=${c}$.`, `$u=${poly([a, b])}$, $v=${poly([c, d])}$ деп белгілейміз. Сонда $u'=${a}$, $v'=${c}$.`, `Let $u=${poly([a, b])}$, $v=${poly([c, d])}$. Then $u'=${a}$, $v'=${c}$.`),
        L('Правило произведения: «производная первого на второе плюс первое на производную второго».', 'Көбейтінді ережесі: «біріншінің туындысы екіншіге көбейтілген плюс бірінші екіншінің туындысына көбейтілген».', 'Product rule: “derivative of the first times the second plus the first times the derivative of the second”.') + ` $f'(x)=${a}(${poly([c, d])})+(${poly([a, b])})\\cdot${par(c)}$.`,
        `${W.sub} $x=${x0}$: $${a}\\cdot${par(c * x0 + d)}+${par(a * x0 + b)}\\cdot${par(c)}=${v}$.`] }; },
  r => { const a = r.nz(-4, 4), b = r.nz(-5, 5), c = r.nz(-3, 3), d = r.nz(-5, 5), x0 = r.int(-2, 2), den = c * x0 + d, det = a * d - b * c; need(den !== 0 && det !== 0 && Math.abs(den) <= 4);
    return { q: qFind(`$f'(${x0})$`, `$f(x)=\\dfrac{${poly([a, b])}}{${poly([c, d])}}$`), a: det / (den * den), lvl: 2,
      hint: L('Правило частного: $\\left(\\frac uv\\right)\'=\\frac{u\'v-uv\'}{v^2}$.', 'Бөлінді ережесі: $\\left(\\frac uv\\right)\'=\\frac{u\'v-uv\'}{v^2}$.', 'Quotient rule: $\\left(\\frac uv\\right)\'=\\frac{u\'v-uv\'}{v^2}$.'),
      steps: [`$u=${poly([a, b])},\\ u'=${a};\\quad v=${poly([c, d])},\\ v'=${c}$.`,
        R`$f'(x)=\dfrac{${a}(${poly([c, d])})-(${poly([a, b])})\cdot${par(c)}}{(${poly([c, d])})^2}=\dfrac{${det}}{(${poly([c, d])})^2}$ ` + L('(слагаемые с $x$ в числителе взаимно уничтожились).', '(алымындағы $x$ бар қосылғыштар өзара жойылды).', '(the $x$-terms in the numerator cancel).'),
        `${W.sub} $x=${x0}$: $\\dfrac{${det}}{${par(den)}^2}=${nt(det / (den * den))}$.`] }; },
  r => { const a = r.nz(-4, 4), b = r.int(-5, 5);
    return { q: qFind(`$f'(0)$`, `$f(x)=(${poly([a, b])})\\,e^x$`), a: a + b, lvl: 2,
      hint: L('$(e^x)\'=e^x$ и правило произведения.', '$(e^x)\'=e^x$ және көбейтінді ережесі.', '$(e^x)\'=e^x$ and the product rule.'),
      steps: [L('Функция $e^x$ уникальна: её производная равна ей самой, $(e^x)\'=e^x$.', '$e^x$ функциясы ерекше: оның туындысы өзіне тең, $(e^x)\'=e^x$.', 'The function $e^x$ is special: it is its own derivative, $(e^x)\'=e^x$.'),
        `$f'(x)=(${poly([a, b])})'e^x+(${poly([a, b])})(e^x)'=${a}e^x+(${poly([a, b])})e^x=(${poly([a, a + b])})e^x$.`, `$f'(0)=(${a + b})\\cdot e^0=${a + b}$.`] }; },
  r => { const a = r.nz(-5, 5);
    return { q: qFind(`$f'(1)$`, `$f(x)=${co(a, 'x^2')}\\ln x$`), a, lvl: 2,
      hint: L('$(\\ln x)\'=\\frac1x$, $\\ln1=0$.', '$(\\ln x)\'=\\frac1x$, $\\ln1=0$.', '$(\\ln x)\'=\\frac1x$, $\\ln1=0$.'),
      steps: [`$u=${co(a, 'x^2')},\\ u'=${co(2 * a, 'x')};\\quad v=\\ln x,\\ v'=\\dfrac1x$.`, `$f'(x)=${co(2 * a, 'x')}\\ln x+${co(a, 'x^2')}\\cdot\\dfrac1x=${co(2 * a, 'x')}\\ln x${sg(a).replace(/(\d+)$/, a2 => a2 === '1' ? 'x' : a2 + 'x')}$.`,
        `$f'(1)=${2 * a}\\cdot\\ln1${sg(a)}=${2 * a}\\cdot0${sg(a)}=${a}$.`] }; },
  r => { const a = 2 * r.nz(-4, 4), b = r.nz(-4, 4), x0 = r.pick([1, 4]), v = a / (2 * Math.sqrt(x0)) - b / (x0 * x0);
    return { q: qFind(`$f'(${x0})$`, `$f(x)=${a}\\sqrt{x}${b < 0 ? ' - ' : ' + '}\\dfrac{${Math.abs(b)}}{x}$`), a: v, lvl: 2,
      hint: L('$(\\sqrt x)\'=\\dfrac{1}{2\\sqrt x}$, $\\left(\\dfrac1x\\right)\'=-\\dfrac{1}{x^2}$.', '$(\\sqrt x)\'=\\dfrac{1}{2\\sqrt x}$, $\\left(\\dfrac1x\\right)\'=-\\dfrac{1}{x^2}$.', '$(\\sqrt x)\'=\\dfrac{1}{2\\sqrt x}$, $\\left(\\dfrac1x\\right)\'=-\\dfrac{1}{x^2}$.'),
      steps: [L('Обе функции табличные; числовые множители выносим:', 'Екі функция да кестелік; сандық көбейткіштерді шығарамыз:', 'Both are table functions; constants come out:') + ` $f'(x)=${a}\\cdot\\dfrac{1}{2\\sqrt x}${sg(b)}\\cdot\\left(-\\dfrac{1}{x^2}\\right)=\\dfrac{${a / 2}}{\\sqrt x}${sg(-b).replace(/(\d+)$/, '\\dfrac{$1}{x^2}')}$.`,
        `${W.sub} $x=${x0}$: $\\dfrac{${a / 2}}{${Math.sqrt(x0)}}${sg(-b).replace(/(\d+)$/, `\\dfrac{$1}{${x0 * x0}}`)}=${nt(v)}$.`] }; }
];

GEN['chain-rule'] = [
  r => { const a = r.nz(-3, 3), n = r.int(2, 5), x0 = r.int(-2, 2), base = r.pick([-1, 1, 2]), b = base - a * x0, v = n * a * base ** (n - 1);
    return { q: qFind(`$f'(${x0})$`, `$f(x)=(${poly([a, b])})^{${n}}$`), a: v, lvl: 1,
      hint: L('Сначала производная «внешней» степени, потом умножьте на производную «внутренней» скобки.', 'Алдымен «сыртқы» дәреженің туындысы, сосын «ішкі» жақшаның туындысына көбейтіңіз.', 'First differentiate the outer power, then multiply by the derivative of the inner bracket.'),
      steps: [L(`Это «матрёшка»: внешняя функция $u^{${n}}$, внутренняя $u=${poly([a, b])}$.`, `Бұл — «матрёшка»: сыртқы функция $u^{${n}}$, ішкі функция $u=${poly([a, b])}$.`, `This is a nested function: outer $u^{${n}}$, inner $u=${poly([a, b])}$.`),
        L('Правило цепочки: производная внешней (внутреннюю не трогаем) умножается на производную внутренней.', 'Тізбек ережесі: сыртқының туындысы (ішкісіне тимейміз) ішкінің туындысына көбейтіледі.', 'Chain rule: derivative of the outer (inner untouched) times derivative of the inner.') + ` $f'(x)=${n}(${poly([a, b])})^{${n - 1}}\\cdot${par(a)}$.`,
        `${W.sub} $x=${x0}$: $${n}\\cdot${par(base)}^{${n - 1}}\\cdot${par(a)}=${v}$.`] }; },
  r => { const a = r.pick([1, 2, 3, 4, -1, -2]), s = r.pick([1, 2, 3]), x0 = r.int(-2, 2), b = s * s - a * x0;
    return { q: qFind(`$f'(${x0})$`, `$f(x)=\\sqrt{${poly([a, b])}}$`), a: a / (2 * s), lvl: 2,
      hint: L('$(\\sqrt u)\'=\\dfrac{u\'}{2\\sqrt u}$.', '$(\\sqrt u)\'=\\dfrac{u\'}{2\\sqrt u}$.', '$(\\sqrt u)\'=\\dfrac{u\'}{2\\sqrt u}$.'),
      steps: [L(`Внешняя функция — корень, внутренняя $u=${poly([a, b])}$, $u'=${a}$.`, `Сыртқы функция — түбір, ішкі $u=${poly([a, b])}$, $u'=${a}$.`, `Outer function: square root; inner $u=${poly([a, b])}$, $u'=${a}$.`),
        `$f'(x)=\\dfrac{1}{2\\sqrt{${poly([a, b])}}}\\cdot${par(a)}$.`, `${W.sub} $x=${x0}$: ` + L('под корнем', 'түбір астында', 'under the root') + ` $${subPoly([a, b], x0)}=${s * s}$, ` + `$f'(${x0})=\\dfrac{${a}}{2\\cdot${s}}=${nt(a / (2 * s))}$.`] }; },
  r => { const a = r.nz(-4, 4), k = r.nz(-5, 5); need(k !== 1);
    return { q: qFind(`$f'(0)$`, `$f(x)=${co(a, `e^{${co(k, 'x')}}`)}$`), a: a * k, lvl: 1,
      hint: L('$(e^{kx})\'=k\\,e^{kx}$.', '$(e^{kx})\'=k\\,e^{kx}$.', '$(e^{kx})\'=k\\,e^{kx}$.'),
      steps: [L(`Внешняя функция $e^u$, внутренняя $u=${co(k, 'x')}$, $u'=${k}$.`, `Сыртқы функция $e^u$, ішкі $u=${co(k, 'x')}$, $u'=${k}$.`, `Outer $e^u$, inner $u=${co(k, 'x')}$, $u'=${k}$.`),
        `$f'(x)=${a}\\cdot e^{${co(k, 'x')}}\\cdot${par(k)}=${co(a * k, `e^{${co(k, 'x')}}`)}$.`, `$f'(0)=${a * k}\\cdot e^0=${a * k}$.`] }; },
  r => { const a = r.int(1, 3), b = r.int(1, 5), x0 = r.pick([-2, -1, 1, 2]), den = a * x0 * x0 + b;
    return { q: qFind(`$f'(${x0})$`, `$f(x)=\\ln(${poly([a, 0, b])})$`), a: 2 * a * x0 / den, lvl: 2,
      hint: L('$(\\ln u)\'=\\dfrac{u\'}{u}$.', '$(\\ln u)\'=\\dfrac{u\'}{u}$.', '$(\\ln u)\'=\\dfrac{u\'}{u}$.'),
      steps: [L(`Внешняя функция $\\ln u$, внутренняя $u=${poly([a, 0, b])}$, $u'=${co(2 * a, 'x')}$.`, `Сыртқы функция $\\ln u$, ішкі $u=${poly([a, 0, b])}$, $u'=${co(2 * a, 'x')}$.`, `Outer $\\ln u$, inner $u=${poly([a, 0, b])}$, $u'=${co(2 * a, 'x')}$.`),
        `$f'(x)=\\dfrac{1}{${poly([a, 0, b])}}\\cdot ${co(2 * a, 'x')}=\\dfrac{${co(2 * a, 'x')}}{${poly([a, 0, b])}}$.`, `${W.sub} $x=${x0}$: $\\dfrac{${2 * a * x0}}{${den}}=${nt(2 * a * x0 / den)}$.`] }; },
  r => { const a = r.nz(-3, 3), b = r.nz(-5, 5), n = r.int(3, 6);
    const ok = R`$${co(n * a, `(${poly([a, b])})^{${n - 1}}`)}$`;
    return { q: L(`Чему равна производная функции $y=(${poly([a, b])})^{${n}}$?`, `$y=(${poly([a, b])})^{${n}}$ функциясының туындысы неге тең?`, `What is the derivative of $y=(${poly([a, b])})^{${n}}$?`), lvl: 1,
      ...choice(r, ok, [R`$${n}(${poly([a, b])})^{${n - 1}}$`, R`$${co(a, `(${poly([a, b])})^{${n}}`)}$`, R`$${co(n * a, `(${poly([a, b])})^{${n}}`)}$`, R`$${n}(${poly([a, b])})^{${n}}$`]),
      hint: L('Не забудьте умножить на производную внутренней функции.', 'Ішкі функцияның туындысына көбейтуді ұмытпаңыз.', 'Do not forget to multiply by the derivative of the inner function.'),
      steps: [`$y=u^{${n}},\\ u=${poly([a, b])},\\ u'=${a}$.`, `$y'=${n}u^{${n - 1}}\\cdot u'=${n}(${poly([a, b])})^{${n - 1}}\\cdot${par(a)}=${co(n * a, `(${poly([a, b])})^{${n - 1}}`)}$.`,
        L(`Самая частая ошибка — забыть множитель $u'=${a}$ и написать просто $${n}(${poly([a, b])})^{${n - 1}}$.`, `Ең жиі қате — $u'=${a}$ көбейткішін ұмытып, жай ғана $${n}(${poly([a, b])})^{${n - 1}}$ деп жазу.`, `The most common mistake is to forget the factor $u'=${a}$ and write just $${n}(${poly([a, b])})^{${n - 1}}$.`)] }; },
  r => { const n = r.int(2, 4), x0 = r.pick([-1, 1]), a = r.int(1, 2), base = x0 * x0 + a, v = n * base ** (n - 1) * 2 * x0;
    return { q: qFind(`$f'(${x0})$`, `$f(x)=(x^2+${a})^{${n}}$`), a: v, lvl: 2,
      hint: L('Внутренняя функция здесь $x^2+' + a + '$, её производная $2x$.', 'Мұнда ішкі функция $x^2+' + a + '$, оның туындысы $2x$.', 'The inner function is $x^2+' + a + '$ with derivative $2x$.'),
      steps: [`$u=x^2+${a},\\ u'=2x$.`, `$f'(x)=${n}(x^2+${a})^{${n - 1}}\\cdot2x=${2 * n}x(x^2+${a})^{${n - 1}}$.`, `${W.sub} $x=${x0}$: $${2 * n}\\cdot${par(x0)}\\cdot${base}^{${n - 1}}=${v}$.`] }; }
];

const PI = Math.PI;
GEN['trig-derivatives'] = [
  r => { const a = r.nz(-5, 5), b = r.nz(-5, 5), p = r.pick([['0', 1, 0], [R`\dfrac{\pi}{2}`, 0, 1], [R`\pi`, -1, 0]]), v = a * p[1] - b * p[2];
    return { q: qFind(`$f'\\!\\left(${p[0]}\\right)$`, `$f(x)=${co(a, '\\sin x')}${b < 0 ? ' - ' : ' + '}${co(Math.abs(b), '\\cos x')}$`), a: v, lvl: 1,
      hint: L('$(\\sin x)\'=\\cos x$, $(\\cos x)\'=-\\sin x$.', '$(\\sin x)\'=\\cos x$, $(\\cos x)\'=-\\sin x$.', '$(\\sin x)\'=\\cos x$, $(\\cos x)\'=-\\sin x$.'),
      steps: [L('Синус при дифференцировании превращается в косинус, а косинус — в минус синус:', 'Дифференциалдағанда синус косинусқа, ал косинус минус синусқа айналады:', 'Differentiating turns sine into cosine and cosine into minus sine:') + ` $f'(x)=${co(a, '\\cos x')}${-b < 0 ? ' - ' : ' + '}${co(Math.abs(b), '\\sin x')}$.`,
        `${W.sub}: $\\cos ${p[0]}=${p[1]},\\ \\sin ${p[0]}=${p[2]}$.`, `$f'=${a}\\cdot${par(p[1])}${sg(-b)}\\cdot${p[2]}=${v}$.`] }; },
  r => { const a = r.nz(-4, 4), k = r.int(2, 6), sin = r.pick([0, 1]);
    return sin ? { q: qFind(`$f'(0)$`, `$f(x)=${co(a, `\\sin ${k}x`)}$`), a: a * k, lvl: 1,
      hint: L('$(\\sin kx)\'=k\\cos kx$.', '$(\\sin kx)\'=k\\cos kx$.', '$(\\sin kx)\'=k\\cos kx$.'),
      steps: [L(`Сложная функция: внешняя $\\sin u$, внутренняя $u=${k}x$, $u'=${k}$.`, `Күрделі функция: сыртқы $\\sin u$, ішкі $u=${k}x$, $u'=${k}$.`, `Composite: outer $\\sin u$, inner $u=${k}x$, $u'=${k}$.`), `$f'(x)=${a}\\cdot\\cos ${k}x\\cdot${k}=${co(a * k, `\\cos ${k}x`)}$.`, `$f'(0)=${a * k}\\cdot\\cos0=${a * k}$.`] }
      : { q: qFind(`$f'\\!\\left(\\dfrac{\\pi}{${2 * k}}\\right)$`, `$f(x)=${co(a, `\\cos ${k}x`)}$`), a: -a * k, lvl: 2,
        hint: L('$(\\cos kx)\'=-k\\sin kx$.', '$(\\cos kx)\'=-k\\sin kx$.', '$(\\cos kx)\'=-k\\sin kx$.'),
        steps: [L(`Сложная функция: внешняя $\\cos u$, внутренняя $u=${k}x$, $u'=${k}$.`, `Күрделі функция: сыртқы $\\cos u$, ішкі $u=${k}x$, $u'=${k}$.`, `Composite: outer $\\cos u$, inner $u=${k}x$, $u'=${k}$.`), `$f'(x)=${a}\\cdot(-\\sin ${k}x)\\cdot${k}=${co(-a * k, `\\sin ${k}x`)}$.`, `${W.sub}: $${k}\\cdot\\dfrac{\\pi}{${2 * k}}=\\dfrac\\pi2$, $\\sin\\dfrac\\pi2=1$. $f'=${-a * k}$.`] }; },
  r => { const a = r.nz(-4, 4), tg = r.pick([0, 1]), p = tg ? r.pick([['0', 1], [R`\dfrac{\pi}{4}`, 2], [R`\dfrac{\pi}{3}`, 4]]) : r.pick([[R`\dfrac{\pi}{2}`, 1], [R`\dfrac{\pi}{4}`, 2], [R`\dfrac{\pi}{6}`, 4]]), v = tg ? a * p[1] : -a * p[1];
    const fn = tg ? R`\operatorname{tg}x` : R`\operatorname{ctg}x`, den = tg ? '\\cos' : '\\sin';
    return { q: qFind(`$f'\\!\\left(${p[0]}\\right)$`, `$f(x)=${co(a, fn)}$`), a: v, lvl: 2,
      hint: tg ? R`$(\operatorname{tg}x)'=\dfrac{1}{\cos^2x}$` : R`$(\operatorname{ctg}x)'=-\dfrac{1}{\sin^2x}$`,
      steps: [`${W.table}: $f'(x)=${tg ? '' : '-'}\\dfrac{${a}}{${den}^2x}$.`.replace('-\\dfrac{-', '\\dfrac{'),
        `${W.calc}: $${den}^2 ${p[0]}=${fr(1, p[1])}$.`, `$f'=${tg ? a : -a}\\cdot${p[1]}=${v}$.`] }; },
  r => { const a = r.nz(-6, 6), x0 = r.int(0, 3), acot = r.pick([0, 1]), v = (acot ? -a : a) / (1 + x0 * x0);
    return { q: qFind(`$f'(${x0})$`, `$f(x)=${co(a, acot ? R`\operatorname{arcctg}x` : R`\operatorname{arctg}x`)}$`), a: v, lvl: 1,
      hint: R`$(\operatorname{arctg}x)'=\dfrac{1}{1+x^2},\quad(\operatorname{arcctg}x)'=-\dfrac{1}{1+x^2}$`,
      steps: [`${W.table}: $f'(x)=\\dfrac{${acot ? -a : a}}{1+x^2}$.`, `${W.sub} $x=${x0}$: $\\dfrac{${acot ? -a : a}}{1+${x0 * x0}}=${nt(v)}$.`] }; },
  r => { const p = r.pick([[0, 1], [0.6, 0.8], [0.8, 0.6]]), acos = r.pick([0, 1]), a = r.pick([1, 2, 3, 4]), v = (acos ? -a : a) / p[1];
    return { q: qFind(`$f'(${dec(p[0])})$`, `$f(x)=${co(a, acos ? '\\arccos x' : '\\arcsin x')}$`), a: v, lvl: 2,
      hint: R`$(\arcsin x)'=\dfrac{1}{\sqrt{1-x^2}},\quad(\arccos x)'=-\dfrac{1}{\sqrt{1-x^2}}$`,
      steps: [`${W.table}: $f'(x)=${acos ? '-' : ''}\\dfrac{${a}}{\\sqrt{1-x^2}}$.`, `${W.calc}: $\\sqrt{1-${dec(p[0])}^2}=\\sqrt{${dec(1 - p[0] * p[0])}}=${dec(p[1])}$.`, `$f'=${acos ? '-' : ''}\\dfrac{${a}}{${dec(p[1])}}=${nt(v)}$.`] }; },
  r => { const k = r.pick([0, 1, 2]), a = r.nz(-4, 4);
    const d = [[R`x\sin x`, R`\dfrac{\pi}{2}`, 1, R`\sin x+x\cos x`, R`\sin\dfrac\pi2+\dfrac\pi2\cos\dfrac\pi2=1+0`], [R`x\cos x`, R`\pi`, -1, R`\cos x-x\sin x`, R`\cos\pi-\pi\sin\pi=-1-0`], [R`x\cos x`, '0', 1, R`\cos x-x\sin x`, R`\cos0-0\cdot\sin0=1-0`]][k];
    return { q: qFind(`$f'\\!\\left(${d[1]}\\right)$`, `$f(x)=${co(a, d[0])}$`), a: a * d[2], lvl: 2,
      hint: L('Правило произведения: $(uv)\'=u\'v+uv\'$, где $u=x$.', 'Көбейтінді ережесі: $(uv)\'=u\'v+uv\'$, мұндағы $u=x$.', 'Product rule $(uv)\'=u\'v+uv\'$ with $u=x$.'),
      steps: [L('Это произведение $x$ и тригонометрической функции. Применяем правило произведения:', 'Бұл — $x$ пен тригонометриялық функцияның көбейтіндісі. Көбейтінді ережесін қолданамыз:', 'A product of $x$ and a trig function. Apply the product rule:') + ` $f'(x)=${a}\\left(${d[3]}\\right)$.`,
        `${W.sub}: $${d[4]}=${d[2]}$.`, `$f'=${a}\\cdot${par(d[2])}=${a * d[2]}$.`] }; },
  r => { const k = r.pick([0, 1, 2]), n = r.int(2, 5);
    const d = [[R`\sin^2x`, R`\dfrac\pi4`, 1, R`2\sin x\cos x=\sin2x`, R`\sin\dfrac\pi2=1`], [R`\cos^2x`, R`\dfrac\pi4`, -1, R`2\cos x\cdot(-\sin x)=-\sin2x`, R`-\sin\dfrac\pi2=-1`], [R`\operatorname{arctg}${n}x`, '0', n, R`\dfrac{1}{1+(${n}x)^2}\cdot${n}=\dfrac{${n}}{1+${n * n}x^2}`, R`\dfrac{${n}}{1+0}=${n}`]][k];
    return { q: qFind(`$f'\\!\\left(${d[1]}\\right)$`, `$f(x)=${d[0]}$`), a: d[2], lvl: 3,
      hint: L('Это сложная функция: определите внешнюю и внутреннюю.', 'Бұл — күрделі функция: сыртқысы мен ішкісін анықтаңыз.', 'A composite function: identify the outer and inner parts.'),
      steps: [k < 2 ? L('Внешняя функция — квадрат $u^2$, внутренняя — тригонометрическая.', 'Сыртқы функция — квадрат $u^2$, ішкісі — тригонометриялық.', 'Outer function: the square $u^2$; inner: the trig function.') : L(`Внешняя функция — арктангенс, внутренняя $u=${n}x$.`, `Сыртқы функция — арктангенс, ішкі $u=${n}x$.`, `Outer function: arctangent; inner $u=${n}x$.`),
        `$f'(x)=${d[3]}$.`, `${W.sub}: $${d[4]}$.`] }; }
];

GEN['derivative-meaning'] = [
  r => { const a = r.int(1, 5), b = r.int(0, 8), t0 = r.int(1, 5), v = 2 * a * t0 + b;
    return { q: L(`Точка движется прямолинейно по закону $s(t)=${poly([a, b, 0], 't')}$ ($s$ — в метрах, $t$ — в секундах). Найдите её скорость в момент $t=${t0}$ с.`, `Нүкте $s(t)=${poly([a, b, 0], 't')}$ заңы бойынша түзу сызықты қозғалады ($s$ — метрмен, $t$ — секундпен). Оның $t=${t0}$ с мезетіндегі жылдамдығын табыңыз.`, `A point moves along a line by $s(t)=${poly([a, b, 0], 't')}$ ($s$ in metres, $t$ in seconds). Find its velocity at $t=${t0}$ s.`), a: v, unit: L('м/с', 'м/с', 'm/s'), lvl: 1,
      hint: L('Скорость — производная пути по времени: $v(t)=s\'(t)$.', 'Жылдамдық — жолдың уақыт бойынша туындысы: $v(t)=s\'(t)$.', 'Velocity is the derivative of position: $v(t)=s\'(t)$.'),
      steps: [L('Физический смысл производной: мгновенная скорость — это производная координаты по времени. Спидометр показывает именно $s\'(t)$.', 'Туындының физикалық мағынасы: лездік жылдамдық — координатаның уақыт бойынша туындысы. Спидометр дәл осы $s\'(t)$-ны көрсетеді.', 'Physical meaning of the derivative: instantaneous velocity is the derivative of position. A speedometer shows exactly $s\'(t)$.'),
        `$v(t)=s'(t)=${poly([2 * a, b], 't')}$.`, `$v(${t0})=${subPoly([2 * a, b], t0)}=${v}$ ` + L('м/с', 'м/с', 'm/s') + '.'] }; },
  r => { const a = r.int(1, 3), b = r.int(1, 6), t0 = r.int(1, 4), v = 6 * a * t0 - 2 * b;
    return { q: L(`Тело движется по закону $s(t)=${poly([a, -b, 0, 0], 't')}$ (м). Найдите ускорение в момент $t=${t0}$ с.`, `Дене $s(t)=${poly([a, -b, 0, 0], 't')}$ (м) заңы бойынша қозғалады. $t=${t0}$ с мезетіндегі үдеуді табыңыз.`, `A body moves by $s(t)=${poly([a, -b, 0, 0], 't')}$ (m). Find the acceleration at $t=${t0}$ s.`), a: v, unit: L('м/с²', 'м/с²', 'm/s²'), lvl: 2,
      hint: L('Ускорение — производная скорости, то есть вторая производная пути.', 'Үдеу — жылдамдықтың туындысы, яғни жолдың екінші туындысы.', 'Acceleration is the derivative of velocity — the second derivative of position.'),
      steps: [L('Скорость показывает, как быстро меняется координата; ускорение — как быстро меняется скорость. Значит, дифференцируем дважды.', 'Жылдамдық координатаның қаншалықты тез өзгеретінін көрсетеді; үдеу — жылдамдықтың қаншалықты тез өзгеретінін. Демек, екі рет дифференциалдаймыз.', 'Velocity tells how fast position changes; acceleration tells how fast velocity changes. So we differentiate twice.'),
        `$v(t)=s'(t)=${poly([3 * a, -2 * b, 0], 't')}$.`, `$a(t)=v'(t)=${poly([6 * a, -2 * b], 't')}$.`, `$a(${t0})=${subPoly([6 * a, -2 * b], t0)}=${v}$ ` + L('м/с²', 'м/с²', 'm/s²') + '.'] }; },
  r => { const a = r.int(1, 4), k = r.int(1, 5), b = 2 * a * k;
    return { q: L(`Тело движется по закону $s(t)=${poly([-a, b, 0], 't')}$ (м). В какой момент времени $t$ (с) оно остановится?`, `Дене $s(t)=${poly([-a, b, 0], 't')}$ (м) заңы бойынша қозғалады. Ол қай уақыт мезетінде $t$ (с) тоқтайды?`, `A body moves by $s(t)=${poly([-a, b, 0], 't')}$ (m). At what time $t$ (s) does it stop?`), a: k, unit: L('с', 'с', 's'), lvl: 1,
      hint: L('В момент остановки скорость равна нулю.', 'Тоқтаған мезетте жылдамдық нөлге тең.', 'At the stopping moment the velocity is zero.'),
      steps: [`$v(t)=s'(t)=${poly([-2 * a, b], 't')}$.`, L('Тело останавливается, когда $v(t)=0$', 'Дене $v(t)=0$ болғанда тоқтайды', 'The body stops when $v(t)=0$') + `: $${poly([-2 * a, b], 't')}=0\\ \\Rightarrow\\ t=${k}$.`] }; },
  r => { const c = r.pick([[1, 45], [-1, 135], [0, 0]]), a = r.pick([1, 2]), x0 = r.int(-2, 2), b = c[0] - 2 * a * x0;
    return { q: L(`Под каким углом (в градусах) к положительному направлению оси $Ox$ наклонена касательная к графику $y=${poly([a, b, r.int(-3, 3)])}$ в точке $x_0=${x0}$?`, `$y=${poly([a, b, r.int(-3, 3)])}$ графигіне $x_0=${x0}$ нүктесінде жүргізілген жанама $Ox$ осінің оң бағытына қандай бұрышпен (градуспен) көлбеген?`, `At what angle (in degrees) to the positive $x$-axis is the tangent to $y=${poly([a, b, r.int(-3, 3)])}$ at $x_0=${x0}$ inclined?`), a: c[1], unit: '°', lvl: 2,
      hint: L('$\\operatorname{tg}\\alpha=f\'(x_0)$.', '$\\operatorname{tg}\\alpha=f\'(x_0)$.', '$\\tan\\alpha=f\'(x_0)$.'),
      steps: [L('Геометрический смысл производной: $f\'(x_0)$ — угловой коэффициент касательной, то есть тангенс угла её наклона.', 'Туындының геометриялық мағынасы: $f\'(x_0)$ — жанаманың бұрыштық коэффициенті, яғни оның көлбеу бұрышының тангенсі.', 'Geometric meaning: $f\'(x_0)$ is the slope of the tangent, i.e. the tangent of its angle of inclination.'),
        `$y'=${poly([2 * a, b])}$, $y'(${x0})=${c[0]}$.`, `$\\operatorname{tg}\\alpha=${c[0]}\\ \\Rightarrow\\ \\alpha=${c[1]}^\\circ$` + (c[0] === 0 ? L(' — касательная горизонтальна.', ' — жанама горизонталь.', ' — the tangent is horizontal.') : '.')] }; },
  r => { const a = r.nz(-3, 3), x0 = r.int(-3, 3), b = r.int(-5, 5), k = 2 * a * x0 + b, mm = r.int(-5, 5);
    return { q: L(`В какой точке $x_0$ касательная к параболе $y=${poly([a, b, r.int(-4, 4)])}$ параллельна прямой $y=${poly([k, mm])}$?`, `$y=${poly([a, b, r.int(-4, 4)])}$ параболасына жүргізілген жанама қай $x_0$ нүктесінде $y=${poly([k, mm])}$ түзуіне параллель болады?`, `At which point $x_0$ is the tangent to the parabola $y=${poly([a, b, r.int(-4, 4)])}$ parallel to the line $y=${poly([k, mm])}$?`), a: x0, lvl: 2,
      hint: L('У параллельных прямых равны угловые коэффициенты: $f\'(x_0)=k$.', 'Параллель түзулердің бұрыштық коэффициенттері тең: $f\'(x_0)=k$.', 'Parallel lines have equal slopes: $f\'(x_0)=k$.'),
      steps: [L(`Угловой коэффициент прямой равен $${k}$. Касательная параллельна ей, если её наклон такой же: $f'(x_0)=${k}$.`, `Түзудің бұрыштық коэффициенті $${k}$. Жанаманың көлбеулігі дәл сондай болса, ол түзуге параллель: $f'(x_0)=${k}$.`, `The slope of the line is $${k}$. The tangent is parallel when its slope is the same: $f'(x_0)=${k}$.`),
        `$y'=${poly([2 * a, b])}$.`, `$${poly([2 * a, b], 'x_0')}=${k}\\ \\Rightarrow\\ x_0=${x0}$.`] }; },
  r => { const v0 = 10 * r.int(1, 6);
    return { q: L(`Мяч брошен вертикально вверх, его высота $h(t)=${v0}t-5t^2$ (м). Найдите наибольшую высоту подъёма.`, `Доп тік жоғары лақтырылды, оның биіктігі $h(t)=${v0}t-5t^2$ (м). Ең үлкен көтерілу биіктігін табыңыз.`, `A ball is thrown straight up; its height is $h(t)=${v0}t-5t^2$ (m). Find the maximum height.`), a: v0 * v0 / 20, unit: L('м', 'м', 'm'), lvl: 3,
      hint: L('В верхней точке скорость $v=h\'(t)$ равна нулю.', 'Ең жоғарғы нүктеде $v=h\'(t)$ жылдамдығы нөлге тең.', 'At the top the velocity $v=h\'(t)$ is zero.'),
      steps: [L('В высшей точке мяч на мгновение «зависает»: скорость равна нулю.', 'Ең жоғарғы нүктеде доп бір сәтке «қалқып» тұрады: жылдамдығы нөлге тең.', 'At the top the ball hangs for an instant: its velocity is zero.'),
        `$v(t)=h'(t)=${v0}-10t$.`, `$${v0}-10t=0\\ \\Rightarrow\\ t=${v0 / 10}$ ` + L('с', 'с', 's') + '.', `$h(${v0 / 10})=${v0}\\cdot${v0 / 10}-5\\cdot${v0 / 10}^2=${v0 * v0 / 10}-${v0 * v0 / 20}=${v0 * v0 / 20}$ ` + L('м', 'м', 'm') + '.'] }; }
];

const tangentSteps = (fx, dfx, x0, y0, k, b) => [
  L('Уравнение касательной: $y=f(x_0)+f\'(x_0)(x-x_0)$. Нужны два числа: значение функции и значение производной в точке.', 'Жанама теңдеуі: $y=f(x_0)+f\'(x_0)(x-x_0)$. Екі сан керек: функцияның және туындының нүктедегі мәндері.', 'Tangent line: $y=f(x_0)+f\'(x_0)(x-x_0)$. We need two numbers: the function value and the derivative at the point.'),
  `$f(${nt(x0)})=${nt(y0)}$.`, `$f'(x)=${dfx}$, $f'(${nt(x0)})=${nt(k)}$.`,
  `$y=${nt(y0)}${sg(k)}(x${sg(-x0)})=${poly([k, b])}$.`.replace('+ 1(x', '+ (x').replace('- 1(x', '- (x')];
GEN['tangent'] = [
  r => { const c = [r.nz(-3, 3), r.int(-4, 4), r.int(-5, 5)], x0 = r.int(-2, 2), k = pv(dp(c), x0), y0 = pv(c, x0), b = y0 - k * x0; need(k !== 0);
    return { q: L(`Составьте уравнение касательной $y=kx+b$ к графику $f(x)=${poly(c)}$ в точке $x_0=${x0}$.`, `$f(x)=${poly(c)}$ графигіне $x_0=${x0}$ нүктесінде жүргізілген жанаманың $y=kx+b$ теңдеуін құрыңыз.`, `Write the tangent line $y=kx+b$ to $f(x)=${poly(c)}$ at $x_0=${x0}$.`), fields: [{ label: '$k$', a: k }, { label: '$b$', a: b }], ans: `$y=${poly([k, b])}$`, lvl: 1,
      hint: L('$y=f(x_0)+f\'(x_0)(x-x_0)$.', '$y=f(x_0)+f\'(x_0)(x-x_0)$.', '$y=f(x_0)+f\'(x_0)(x-x_0)$.'), steps: tangentSteps(0, poly(dp(c)), x0, y0, k, b) }; },
  r => { const a = r.nz(-4, 4), x0 = r.pick([-2, -1, 1, 2]), c = [1, 0, a, 0], k = 3 * x0 * x0 + a, y0 = pv(c, x0), b = y0 - k * x0; need(k !== 0);
    return { q: L(`Составьте уравнение касательной $y=kx+b$ к графику $f(x)=${poly(c)}$ в точке $x_0=${x0}$.`, `$f(x)=${poly(c)}$ графигіне $x_0=${x0}$ нүктесінде жүргізілген жанаманың $y=kx+b$ теңдеуін құрыңыз.`, `Write the tangent line $y=kx+b$ to $f(x)=${poly(c)}$ at $x_0=${x0}$.`), fields: [{ label: '$k$', a: k }, { label: '$b$', a: b }], ans: `$y=${poly([k, b])}$`, lvl: 2,
      hint: L('$y=f(x_0)+f\'(x_0)(x-x_0)$.', '$y=f(x_0)+f\'(x_0)(x-x_0)$.', '$y=f(x_0)+f\'(x_0)(x-x_0)$.'), steps: tangentSteps(0, poly(dp(c)), x0, y0, k, b) }; },
  r => { const x0 = r.pick([1, 2, -1, -2]), a = 4 * r.nz(-2, 2), k = -a / (x0 * x0), y0 = a / x0, b = y0 - k * x0;
    return { q: L(`Составьте уравнение касательной $y=kx+b$ к гиперболе $f(x)=\\dfrac{${a}}{x}$ в точке $x_0=${x0}$.`, `$f(x)=\\dfrac{${a}}{x}$ гиперболасына $x_0=${x0}$ нүктесінде жүргізілген жанаманың $y=kx+b$ теңдеуін құрыңыз.`, `Write the tangent line $y=kx+b$ to the hyperbola $f(x)=\\dfrac{${a}}{x}$ at $x_0=${x0}$.`), fields: [{ label: '$k$', a: k }, { label: '$b$', a: b }], ans: `$y=${poly([k, b])}$`, lvl: 2,
      hint: L('$\\left(\\dfrac ax\\right)\'=-\\dfrac{a}{x^2}$.', '$\\left(\\dfrac ax\\right)\'=-\\dfrac{a}{x^2}$.', '$\\left(\\dfrac ax\\right)\'=-\\dfrac{a}{x^2}$.'), steps: tangentSteps(0, `${-a < 0 ? '-' : ''}\\dfrac{${Math.abs(a)}}{x^2}`, x0, y0, k, b) }; },
  r => { const a = r.nz(-3, 3), x0 = r.int(-4, 4), b = -2 * a * x0, c = r.int(-5, 5);
    return { q: L(`В какой точке $x_0$ касательная к графику $f(x)=${poly([a, b, c])}$ горизонтальна (параллельна оси $Ox$)?`, `$f(x)=${poly([a, b, c])}$ графигіне жүргізілген жанама қай $x_0$ нүктесінде горизонталь ($Ox$ осіне параллель) болады?`, `At which point $x_0$ is the tangent to $f(x)=${poly([a, b, c])}$ horizontal (parallel to the $x$-axis)?`), a: x0, lvl: 1,
      hint: L('У горизонтальной прямой угловой коэффициент равен нулю.', 'Горизонталь түзудің бұрыштық коэффициенті нөлге тең.', 'A horizontal line has slope zero.'),
      steps: [L('Горизонтальная касательная имеет наклон $k=0$, значит $f\'(x_0)=0$.', 'Горизонталь жанаманың көлбеулігі $k=0$, демек $f\'(x_0)=0$.', 'A horizontal tangent has slope $k=0$, so $f\'(x_0)=0$.'), `$f'(x)=${poly([2 * a, b])}$.`, `$${poly([2 * a, b])}=0\\ \\Rightarrow\\ x_0=${x0}$. ` + L('Это вершина параболы.', 'Бұл — параболаның төбесі.', 'This is the vertex of the parabola.')] }; },
  r => { const x0 = r.nz(-3, 3), a = r.int(1, 2), x1 = x0 + r.nz(-2, 2), k = 2 * a * x0, y0 = a * x0 * x0, v = y0 + k * (x1 - x0);
    return { q: L(`К параболе $y=${co(a, 'x^2')}$ в точке $x_0=${x0}$ проведена касательная. Найдите ординату точки этой касательной с абсциссой $x=${x1}$.`, `$y=${co(a, 'x^2')}$ параболасына $x_0=${x0}$ нүктесінде жанама жүргізілген. Осы жанаманың абсциссасы $x=${x1}$ болатын нүктесінің ординатасын табыңыз.`, `A tangent is drawn to the parabola $y=${co(a, 'x^2')}$ at $x_0=${x0}$. Find the ordinate of the point on this tangent with abscissa $x=${x1}$.`), a: v, lvl: 2,
      hint: L('Сначала составьте уравнение касательной, затем подставьте $x$.', 'Алдымен жанама теңдеуін құрып, сосын $x$-ті қойыңыз.', 'Write the tangent line first, then plug in $x$.'),
      steps: [...tangentSteps(0, co(2 * a, 'x'), x0, y0, k, y0 - k * x0).slice(1), `${W.sub} $x=${x1}$: $y=${subPoly([k, y0 - k * x0], x1)}=${v}$.`] }; },
  r => { const s = r.pick([1, 2, 3]), x0 = s * s, a = 2 * s * r.int(1, 2), k = a / (2 * s), y0 = a * s, b = y0 - k * x0;
    return { q: L(`Составьте уравнение касательной $y=kx+b$ к графику $f(x)=${co(a, '\\sqrt{x}')}$ в точке $x_0=${x0}$.`, `$f(x)=${co(a, '\\sqrt{x}')}$ графигіне $x_0=${x0}$ нүктесінде жүргізілген жанаманың $y=kx+b$ теңдеуін құрыңыз.`, `Write the tangent line $y=kx+b$ to $f(x)=${co(a, '\\sqrt{x}')}$ at $x_0=${x0}$.`), fields: [{ label: '$k$', a: k }, { label: '$b$', a: b }], ans: `$y=${poly([k, b])}$`, lvl: 3,
      hint: L('$(\\sqrt x)\'=\\dfrac{1}{2\\sqrt x}$.', '$(\\sqrt x)\'=\\dfrac{1}{2\\sqrt x}$.', '$(\\sqrt x)\'=\\dfrac{1}{2\\sqrt x}$.'), steps: tangentSteps(0, `\\dfrac{${a / 2}}{\\sqrt x}`, x0, y0, k, b) }; }
];

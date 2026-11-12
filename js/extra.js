/* Дополнения: слайды урока, графики Desmos, задачи «по рисунку», истории и картинки к темам. */
Object.assign(ICONS, {
  slides: 'M3 5h18v11H3zM12 16v4M8 20h8', wave: 'M3 12c3-9 6-9 9 0s6 9 9 0M3 20h18', full: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  left: 'M19 12H5M11 6l-6 6 6 6'
});
Object.assign(I18N, {
  graph: ['Графики', 'Графиктер', 'Graphs'], slides: ['Слайды', 'Слайдтар', 'Slides'],
  graphLead: ['Графический калькулятор Desmos: стройте функции, двигайте ползунки, проверяйте свои решения. Выберите готовый пример по теме или введите свою формулу.', 'Desmos графикалық калькуляторы: функцияларды салыңыз, жүгірткілерді жылжытыңыз, шешімдеріңізді тексеріңіз. Тақырып бойынша дайын мысалды таңдаңыз немесе өз формулаңызды енгізіңіз.', 'The Desmos graphing calculator: plot functions, drag sliders, check your solutions. Pick a ready example for a topic or type your own formula.'],
  graphExamples: ['Готовые примеры по темам', 'Тақырыптар бойынша дайын мысалдар', 'Ready examples by topic'],
  graphBlank: ['Чистый лист', 'Таза парақ', 'Blank'],
  graphFail: ['Не удалось загрузить Desmos. Проверьте интернет или откройте калькулятор на desmos.com.', 'Desmos жүктелмеді. Интернетті тексеріңіз немесе калькуляторды desmos.com сайтында ашыңыз.', 'Could not load Desmos. Check your connection or open the calculator at desmos.com.'],
  graphLoading: ['Загружаем Desmos…', 'Desmos жүктелуде…', 'Loading Desmos…'],
  graphKey: ['Ключ Desmos API (необязательно)', 'Desmos API кілті (міндетті емес)', 'Desmos API key (optional)'],
  graphKeyNote: ['По умолчанию используется демонстрационный ключ Desmos. Для постоянной работы сайта запросите бесплатный ключ на desmos.com/api и вставьте его сюда.', 'Әдепкіде Desmos демонстрациялық кілті қолданылады. Сайт тұрақты жұмыс істеуі үшін desmos.com/api сайтынан тегін кілт сұрап, осында қойыңыз.', 'The Desmos demo key is used by default. For permanent use request a free key at desmos.com/api and paste it here.'],
  toDesmos: ['Построить в Desmos', 'Desmos-та салу', 'Plot in Desmos'], openTopic: ['Открыть тему', 'Тақырыпты ашу', 'Open topic'],
  slPrev: ['Назад', 'Артқа', 'Back'], slNext: ['Дальше', 'Әрі қарай', 'Next'], slFull: ['На весь экран', 'Толық экран', 'Full screen'],
  slHint: ['Листайте стрелками ← → на клавиатуре', 'Пернетақтадағы ← → көрсеткілерімен парақтаңыз', 'Use the ← → keys to move'],
  slWhy: ['Зачем это?', 'Бұл не үшін?', 'Why bother?'], slFormulas: ['Главные формулы', 'Негізгі формулалар', 'Key formulas'],
  slMistake: ['Осторожно, ловушка!', 'Абайлаңыз, тұзақ!', 'Watch out, a trap!'], slExample: ['Разберём пример', 'Мысалды талдайық', 'Worked example'],
  slThink: ['Сначала подумайте сами', 'Алдымен өзіңіз ойланыңыз', 'Think first'], slShow: ['Показать решение', 'Шешімді көрсету', 'Show the solution'],
  slEnd: ['Теперь ваша очередь!', 'Енді сіздің кезегіңіз!', 'Your turn!'], slEndLead: ['Теория позади. Закрепите тему на задачах и поиграйте с симулятором.', 'Теория артта қалды. Тақырыпты есептермен бекітіп, симулятормен ойнаңыз.', 'Theory done. Lock it in with practice and play with the simulator.'],
  slToday: ['Сегодня научимся', 'Бүгін үйренеміз', 'Today we will learn to'], story: ['Простыми словами', 'Қарапайым тілмен', 'In plain words']
});
PAGES.splice(2, 0, 'graph');
PAGE_ICON.graph = 'wave';
const groupPic = g => `assets/img/${g}.jpg`;

/* ---------- истории и дополнительные объяснения к темам ---------- */
const EXTRA = {
  'derivative-def': () => L(
    R`<p><b>Дорога в небо.</b> Представьте, что график — это дорога, а вы идёте по ней слева направо. Если на каждый шаг вправо дорога поднимается на 2 шага вверх, её <i>крутизна</i> равна 2; если на 2 шага вправо — только 1 вверх, крутизна $\frac12$. Крутизна = подъём : сдвиг = $\dfrac{\Delta y}{\Delta x}$.</p><p>У прямой дороги крутизна везде одна. У кривой она меняется на каждом шагу — поэтому берём совсем крошечный шажок. Крутизна дороги «прямо под ногами» и есть производная. Идёте в гору — производная положительна, под гору — отрицательна, по ровной площадке — равна нулю.</p>`,
    R`<p><b>Аспанға апаратын жол.</b> График — жол, ал сіз онымен солдан оңға жүріп келесіз деп елестетіңіз. Оңға әр қадам жасағанда жол 2 қадам көтерілсе, оның <i>тіктігі</i> 2; оңға 2 қадамда 1 қадам ғана көтерілсе, тіктігі $\frac12$. Тіктік = көтерілу : жылжу = $\dfrac{\Delta y}{\Delta x}$.</p><p>Түзу жолдың тіктігі барлық жерде бірдей. Қисық жолда ол әр қадамда өзгереді — сондықтан өте кішкентай қадам аламыз. «Аяқ астындағы» жол тіктігі — туынды. Өрге шықсаңыз — туынды оң, еңіске түссеңіз — теріс, тегіс алаңда — нөл.</p>`,
    R`<p><b>A road to the sky.</b> Imagine the graph is a road and you walk along it from left to right. If every step to the right lifts you 2 steps up, its <i>steepness</i> is 2; if 2 steps right give only 1 up, the steepness is $\frac12$. Steepness = rise : run = $\dfrac{\Delta y}{\Delta x}$.</p><p>A straight road has the same steepness everywhere. On a curved road it changes at every step — so we take a tiny step. The steepness right under your feet is the derivative. Going uphill — positive, downhill — negative, on a flat spot — zero.</p>`),
  differential: () => L(
    R`<p><b>Рецепт приближённого вычисления.</b></p><ol><li>Замените «неудобное» число на близкое «удобное» $x_0$, в котором функция считается в уме.</li><li>Найдите $\Delta x=x-x_0$ (оно может быть и отрицательным!).</li><li>Вычислите $f(x_0)$ и $f'(x_0)$.</li><li>Подставьте: $f(x)\approx f(x_0)+f'(x_0)\,\Delta x$.</li></ol><p>Пример: $\sqrt[3]{26{,}5}$. Удобная точка $x_0=27$, $\Delta x=-0{,}5$. $f(x)=\sqrt[3]{x}$, $f'(x)=\dfrac{1}{3\sqrt[3]{x^2}}$, $f'(27)=\dfrac1{27}$. Итог: $3-\dfrac{0{,}5}{27}\approx2{,}9815$ (калькулятор даёт $2{,}9814…$).</p><p><b>Насколько мы ошиблись?</b> Абсолютная погрешность — $|$точное $-$ приближённое$|$. Относительная — абсолютная, делённая на точное значение, в процентах. Чем меньше $\Delta x$, тем меньше обе.</p>`,
    R`<p><b>Жуықтап есептеу рецепті.</b></p><ol><li>«Ыңғайсыз» санды функция ойша есептелетін жақын «ыңғайлы» $x_0$ санына ауыстырыңыз.</li><li>$\Delta x=x-x_0$ табыңыз (ол теріс те болуы мүмкін!).</li><li>$f(x_0)$ және $f'(x_0)$ есептеңіз.</li><li>Қойыңыз: $f(x)\approx f(x_0)+f'(x_0)\,\Delta x$.</li></ol><p>Мысал: $\sqrt[3]{26{,}5}$. Ыңғайлы нүкте $x_0=27$, $\Delta x=-0{,}5$. $f(x)=\sqrt[3]{x}$, $f'(x)=\dfrac{1}{3\sqrt[3]{x^2}}$, $f'(27)=\dfrac1{27}$. Нәтиже: $3-\dfrac{0{,}5}{27}\approx2{,}9815$ (калькулятор $2{,}9814…$ береді).</p><p><b>Қаншалықты қателестік?</b> Абсолют қателік — $|$дәл $-$ жуық$|$. Салыстырмалы қателік — абсолют қателіктің дәл мәнге қатынасы, пайызбен. $\Delta x$ неғұрлым аз болса, екеуі де соғұрлым аз.</p>`,
    R`<p><b>A recipe for approximation.</b></p><ol><li>Replace the awkward number by a nearby convenient $x_0$ where the function is easy.</li><li>Find $\Delta x=x-x_0$ (it may be negative!).</li><li>Compute $f(x_0)$ and $f'(x_0)$.</li><li>Substitute: $f(x)\approx f(x_0)+f'(x_0)\,\Delta x$.</li></ol><p>Example: $\sqrt[3]{26.5}$. Convenient point $x_0=27$, $\Delta x=-0.5$. $f(x)=\sqrt[3]{x}$, $f'(x)=\dfrac{1}{3\sqrt[3]{x^2}}$, $f'(27)=\dfrac1{27}$. Result: $3-\dfrac{0.5}{27}\approx2.9815$ (a calculator gives $2.9814…$).</p><p><b>How wrong are we?</b> Absolute error — $|$exact $-$ approximate$|$. Relative error — the absolute one divided by the exact value, in percent. The smaller $\Delta x$, the smaller both.</p>`),
  monotonicity: () => L(
    R`<p><b>Тропики и льды.</b> Посмотрите на график <i>производной</i>. Ось $Ox$ — граница климата: выше неё «тропики» (значения положительны), ниже — «льды» (отрицательны). Где график $f'$ в тропиках — сама функция $f$ растёт; где во льдах — убывает.</p><p>Обратно: по графику функции идём слева направо. Поднимаемся в горку — там $f'>0$, спускаемся — $f'<0$. Не перепутайте, чей график на рисунке: $f$ или $f'$ — это самая частая ловушка в задачах!</p>`,
    R`<p><b>Тропик пен мұз.</b> <i>Туындының</i> графигіне қараңыз. $Ox$ осі — климат шекарасы: одан жоғары «тропик» (мәндер оң), төмен — «мұз» (мәндер теріс). $f'$ графигі тропикте болса — $f$ функциясының өзі өседі; мұзда болса — кемиді.</p><p>Керісінше: функция графигімен солдан оңға жүреміз. Өрге көтерілсек — онда $f'>0$, төмен түссек — $f'<0$. Суретте кімнің графигі тұрғанын шатастырмаңыз: $f$ пе, әлде $f'$ пе — бұл есептердегі ең жиі тұзақ!</p>`,
    R`<p><b>Tropics and ice.</b> Look at the graph of the <i>derivative</i>. The $x$-axis is a climate border: above it are the tropics (positive values), below — the ice (negative). Where the graph of $f'$ is in the tropics, the function $f$ itself rises; where it is in the ice, $f$ falls.</p><p>The other way: walk along the graph of the function from left to right. Uphill means $f'>0$, downhill means $f'<0$. Do not mix up whose graph is drawn, $f$ or $f'$ — the most common trap in problems!</p>`),
  extrema: () => L(
    R`<p><b>Как читать график производной.</b></p><ul><li>График $f'$ пересекает ось $Ox$ сверху вниз (из «плюса» в «минус») — у функции <b>максимум</b>: поднимались, стали спускаться.</li><li>Пересекает снизу вверх — <b>минимум</b>.</li><li>Только коснулся оси и вернулся — экстремума нет.</li></ul><p>Сколько раз график $f'$ пересёк ось — столько у функции точек экстремума.</p>`,
    R`<p><b>Туынды графигін қалай оқимыз.</b></p><ul><li>$f'$ графигі $Ox$ осін жоғарыдан төмен қиса («плюстен» «минусқа») — функцияда <b>максимум</b>: көтеріліп келіп, түсе бастадық.</li><li>Төменнен жоғары қиса — <b>минимум</b>.</li><li>Оське тек жанасып, қайтып кетсе — экстремум жоқ.</li></ul><p>$f'$ графигі осьті неше рет қиса — функцияның сонша экстремум нүктесі бар.</p>`,
    R`<p><b>How to read a derivative graph.</b></p><ul><li>The graph of $f'$ crosses the $x$-axis downwards (from plus to minus) — the function has a <b>maximum</b>: it was rising, now it falls.</li><li>Crosses upwards — a <b>minimum</b>.</li><li>Only touches the axis and returns — no extremum.</li></ul><p>The function has as many extremum points as the graph of $f'$ has crossings of the axis.</p>`),
  antiderivative: () => L(
    R`<p><b>Семейное сходство.</b> Три функции — как три поколения: первообразная $F$ → функция $f$ → производная $f'$. Каждая следующая — производная предыдущей: $F'=f$. Поэтому всё, что мы знаем про пару «функция и её производная», работает и для пары «первообразная и функция»:</p><ul><li>где $f>0$ — первообразная $F$ растёт, где $f<0$ — убывает;</li><li>где $f=0$ и меняет знак — у $F$ экстремум.</li></ul>`,
    R`<p><b>Отбасылық ұқсастық.</b> Үш функция — үш ұрпақ сияқты: алғашқы функция $F$ → функция $f$ → туынды $f'$. Әрқайсысы алдыңғысының туындысы: $F'=f$. Сондықтан «функция мен оның туындысы» жұбы туралы білетініміздің бәрі «алғашқы функция мен функция» жұбына да жарайды:</p><ul><li>$f>0$ болса — $F$ өседі, $f<0$ болса — кемиді;</li><li>$f=0$ болып, таңбасын өзгертсе — $F$ функциясында экстремум.</li></ul>`,
    R`<p><b>Family resemblance.</b> Three functions are like three generations: antiderivative $F$ → function $f$ → derivative $f'$. Each is the derivative of the previous one: $F'=f$. So everything we know about "a function and its derivative" also works for "an antiderivative and the function":</p><ul><li>where $f>0$ the antiderivative $F$ rises, where $f<0$ it falls;</li><li>where $f=0$ and changes sign, $F$ has an extremum.</li></ul>`),
  'definite-integral': () => L(
    R`<p><b>Дорога в небо — наоборот.</b> Производная по дороге находит её крутизну. Интеграл решает обратную задачу: вам известна крутизна на каждом шаге, а нужно узнать, на какую высоту вы в итоге забрались. Каждый маленький шаг $dx$ добавляет высоту «крутизна × шаг» $=f(x)\,dx$. Сложили все шаги от $a$ до $b$ — получили $\int_a^bf(x)\,dx$.</p><p>Вот почему интеграл от скорости — путь, а площадь под графиком — это и есть «накопленный итог».</p>`,
    R`<p><b>Аспанға апаратын жол — керісінше.</b> Туынды жол бойынша оның тіктігін табады. Интеграл кері есепті шешеді: әр қадамдағы тіктік белгілі, ал соңында қандай биіктікке шыққаныңызды білу керек. Әрбір кішкентай $dx$ қадамы «тіктік × қадам» $=f(x)\,dx$ биіктік қосады. $a$-дан $b$-ға дейінгі барлық қадамды қоссақ — $\int_a^bf(x)\,dx$ шығады.</p><p>Сондықтан жылдамдықтың интегралы — жол, ал график астындағы аудан — «жинақталған нәтиже».</p>`,
    R`<p><b>The road to the sky — in reverse.</b> A derivative takes a road and finds its steepness. An integral solves the reverse problem: you know the steepness at every step and want the height you finally reach. Each small step $dx$ adds a height of "steepness × step" $=f(x)\,dx$. Add all steps from $a$ to $b$ and you get $\int_a^bf(x)\,dx$.</p><p>That is why the integral of speed is distance, and the area under a graph is an accumulated total.</p>`)
};
const extraHtml = id => EXTRA[id] ? `<div class="story"><h3>${ico('bulb')} ${t('story')}</h3>${mx(EXTRA[id]())}</div>` : '';

/* ---------- Desmos ---------- */
const DESMOS = {
  'limit-point': [R`f(x)=\frac{x^2-1}{x-1}`, '(1,2)', 'x=1'],
  asymptotes: [R`y=\frac{2x+1}{x-3}`, 'x=3', 'y=2'],
  'sequence-limit': ['n=[1...40]', R`(n,(1+\frac{1}{n})^n)`, 'y=e'],
  continuity: [R`y=\{x<1:x+1,x\ge1:x^2+k\}`, 'k=1'],
  indeterminate: [R`y=\frac{\sin(kx)}{x}`, 'k=1', 'y=k'],
  'derivative-def': ['f(x)=x^2', 'a=1', 'h=1', R`y=f(a)+\frac{f(a+h)-f(a)}{h}(x-a)`, "y=f(a)+f'(a)(x-a)", '(a,f(a))', '(a+h,f(a+h))'],
  differential: [R`f(x)=\sqrt{x}`, 'a=16', "y=f(a)+f'(a)(x-a)", '(16.4,f(16.4))'],
  'diff-rules': ['f(x)=x^2e^{-x}', "y=f'(x)"],
  'chain-rule': [R`f(x)=\sin(kx)`, 'k=2', "y=f'(x)"],
  'trig-derivatives': [R`f(x)=\sin(x)`, "y=f'(x)", R`g(x)=\arctan(x)`, "y=g'(x)"],
  'derivative-meaning': ['s(x)=x^3-6x', "y=s'(x)", "y=s''(x)"],
  tangent: ['f(x)=x^2', 'a=3', "y=f(a)+f'(a)(x-a)", '(a,f(a))'],
  monotonicity: ['f(x)=x^3-3x', "y=f'(x)"],
  extrema: ['f(x)=x^3-3x', "y=f'(x)", '(-1,2)', '(1,-2)'],
  convexity: ['f(x)=x^3-3x^2', "y=f''(x)", '(1,f(1))'],
  'function-study': ['f(x)=x^3-3x', "y=f'(x)", "y=f''(x)", 'y=c', 'c=1'],
  'max-min': [R`y=x(10-x)\{0\le x\le10\}`, '(5,25)'],
  antiderivative: ['y=x^2+C', 'C=0', 'y=2x'],
  substitution: [R`y=2x\cos(x^2)`, R`y=\sin(x^2)+C`, 'C=0'],
  'by-parts': ['y=xe^x', 'y=(x-1)e^x+C', 'C=0'],
  'definite-integral': ['f(x)=x^2', 'a=0', 'b=3', R`0\le y\le f(x)\{a\le x\le b\}`, R`I=\int_a^bf(x)dx`],
  area: ['y=x^2', 'y=x', R`x^2\le y\le x`, R`S=\int_0^1(x-x^2)dx`],
  volume: [R`f(x)=\sqrt{x}`, 'b=4', R`-f(x)\le y\le f(x)\{0\le x\le b\}`, R`V=\pi\int_0^bf(x)^2dx`],
  'physics-integral': ['v(x)=3x^2', 'T=2', R`0\le y\le v(x)\{0\le x\le T\}`, R`s=\int_0^Tv(x)dx`],
  'de-basics': ['y=x^2+C', 'C=3', '(1,4)'],
  separable: ['y=Ce^{kx}', 'C=1', 'k=0.5'],
  'second-order': [R`y=e^{ax}(C_1\cos(bx)+C_2\sin(bx))`, 'a=-0.3', 'b=2', 'C_1=1', 'C_2=0'],
  harmonic: [R`y=A\cos(wx+p)`, 'A=2', 'w=1.5', 'p=0']
};
const DESMOS_DEMO_KEY = 'dcb31709b452b1cf9dc26972add0fda6';
let desmosLoading = null, desmosCalc = null;
function loadDesmos() {
  if (window.Desmos) return Promise.resolve();
  if (desmosLoading) return desmosLoading;
  desmosLoading = new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = `https://www.desmos.com/api/v1.11/calculator.js?apiKey=${encodeURIComponent(S.settings.desmosKey || DESMOS_DEMO_KEY)}&lang=ru`;
    s.onload = () => window.Desmos ? res() : rej(new Error('Desmos'));
    s.onerror = () => { desmosLoading = null; s.remove(); rej(new Error('network')); };
    document.head.appendChild(s);
  });
  return desmosLoading;
}
function desmosSet(id) {
  if (!desmosCalc) return;
  desmosCalc.setBlank();
  const colors = ['#7c3aed', '#ec4899', '#059669', '#ea580c', '#0891d1', '#111827'];
  (DESMOS[id] || []).forEach((latex, i) => desmosCalc.setExpression({ id: 'e' + i, latex, color: colors[i % colors.length] }));
}
function graphPick(id) { history.replaceState(null, '', '#graph' + (id ? '/' + id : '')); route.tab = id; desmosSet(id); document.querySelectorAll('#graph-chips button').forEach(b => b.classList.toggle('active', b.dataset.id === id)); const a = $('graph-topic'); if (a) { a.classList.toggle('hidden', !id); a.href = '#' + id; } }
function graphSaveKey() { S.settings.desmosKey = $('desmos-key').value.trim(); save(); location.reload(); }
function renderGraph() {
  const cur = DESMOS[route.tab] ? route.tab : '';
  if (desmosCalc) { try { desmosCalc.destroy(); } catch (e) { /* уже удалён */ } desmosCalc = null; }
  $('main').innerHTML = `<div class="page"><div class="between wrap"><h1>${ico('wave')} ${t('graph')}</h1><a class="btn soft ${cur ? '' : 'hidden'}" id="graph-topic" href="#${cur}">${ico('book')} ${t('openTopic')}</a></div><p class="muted">${t('graphLead')}</p>
  <div class="card" style="padding:8px"><div id="desmos-box" class="desmos-box"><div class="desmos-wait">${t('graphLoading')}</div></div></div>
  <h3 style="margin-top:22px">${t('graphExamples')}</h3><div id="graph-chips">${GROUPS.map(g => `<div class="chips" data-g="${g.id}" style="margin-bottom:8px"><button data-id="" class="${cur ? '' : 'active'} ${g.id === 'lim' ? '' : 'hidden'}" onclick="graphPick('')">${t('graphBlank')}</button>${TOPICS.filter(x => x.g === g.id && DESMOS[x.id]).map(x => `<button data-id="${x.id}" class="${cur === x.id ? 'active' : ''}" onclick="graphPick('${x.id}')">${x.n}. ${esc(C(x.id).t)}</button>`).join('')}</div>`).join('')}</div>
  <details class="card no-print" style="margin-top:18px"><summary style="font-weight:800;cursor:pointer">${t('graphKey')}</summary><p class="muted small">${t('graphKeyNote')}</p><div class="row wrap"><input id="desmos-key" class="grow" style="min-width:220px" value="${esc(S.settings.desmosKey || '')}" placeholder="API key"><button class="btn" onclick="graphSaveKey()">${t('save')}</button></div></details>${footer()}</div>`;
  loadDesmos().then(() => {
    const box = $('desmos-box'); if (!box || route.id !== 'graph') return;
    box.innerHTML = '';
    desmosCalc = Desmos.GraphingCalculator(box, { language: LANG === 'en' ? 'en' : 'ru', invertedColors: S.settings.theme === 'dark', border: false, keypad: true, expressionsCollapsed: window.innerWidth < 760 });
    desmosSet(route.tab);
  }).catch(() => { const box = $('desmos-box'); if (box) box.innerHTML = `<div class="desmos-wait"><p>${t('graphFail')}</p><a class="btn primary" target="_blank" rel="noopener" href="https://www.desmos.com/calculator?lang=ru">desmos.com/calculator</a></div>`; });
}

/* ---------- слайды урока ---------- */
const slideAt = {};
let slideDeck = [];
function buildSlides(tp) {
  const c = C(tp.id), g = GROUPS.find(x => x.id === tp.g), out = [];
  out.push(`<div class="sl-title"><img src="${groupPic(tp.g)}" alt=""><div><span class="pill g">${esc(groupName(tp.g))} · ${t('topicN', { n: tp.n })}</span><h2>${esc(c.t)}</h2><p>${esc(c.s)}</p></div></div>`);
  out.push(`<span class="sl-kicker">${t('slWhy')}</span><p class="sl-big">${mx(c.hook)}</p><h4 style="margin-top:22px">${t('slToday')}:</h4><ul class="objectives">${c.o.map(x => `<li>${ico('check')}<span>${mx(x)}</span></li>`).join('')}</ul>`);
  if (EXTRA[tp.id]) out.push(`<span class="sl-kicker">${t('story')}</span><div class="prose">${mx(EXTRA[tp.id]())}</div>`);
  c.th.split('<h3>').filter(x => x.trim()).forEach(p => { const i = p.indexOf('</h3>'); out.push(`<span class="sl-kicker">${esc(c.t)}</span><h2>${mx(p.slice(0, i))}</h2><div class="prose">${mx(p.slice(i + 5))}</div>`); });
  out.push(`<span class="sl-kicker">${t('slFormulas')}</span><div class="sl-formulas">${tp.f.map(x => `<div class="f">${tex(x, true)}</div>`).join('')}</div>`);
  out.push(`<span class="sl-kicker" style="color:var(--bad,#e11d48)">${t('slMistake')}</span><p class="sl-big">${ico('alert')} ${mx(c.err)}</p>`);
  const tk = getTask(tp.id + '~0', 9000);
  out.push(`<span class="sl-kicker">${t('slExample')}</span><div class="task-q sl-big">${mx(tk.q)}${tk.opts ? `<ul>${tk.opts.map(o => `<li>${mx(o)}</li>`).join('')}</ul>` : ''}</div><details class="solution"><summary>${ico('bulb')} ${t('slShow')}</summary>${stepsHtml(tk)}</details><p class="muted small">${t('slThink')} 🙂</p>`);
  out.push(`<div class="sl-title"><img src="${groupPic(tp.g)}" alt=""><div><h2>${t('slEnd')}</h2><p>${t('slEndLead')}</p><div class="row wrap" style="margin-top:14px"><button class="btn primary" onclick="slideExit('${tp.id}','practice')">${ico('pen')} ${t('toPractice')}</button>${tp.lab ? `<button class="btn" onclick="slideExit('${tp.id}','lab')">${ico('flask')} ${t('toLab')}</button>` : ''}${DESMOS[tp.id] ? `<button class="btn" onclick="slideExit('graph','${tp.id}')">${ico('wave')} ${t('toDesmos')}</button>` : ''}</div></div></div>`);
  return out;
}
function slideExit(id, tab) { if (document.fullscreenElement) document.exitFullscreen(); go(id, tab); }
function slideShow(id, i) {
  const n = slideDeck.length; i = Math.max(0, Math.min(n - 1, i)); slideAt[id] = i;
  $('slide-body').innerHTML = slideDeck[i]; $('slide-body').scrollTop = 0;
  $('slide-n').textContent = (i + 1) + ' / ' + n;
  $('slide-fill').style.width = ((i + 1) / n * 100) + '%';
  $('slide-prev').disabled = i === 0; $('slide-next').disabled = i === n - 1;
}
function slideFull() { const d = $('deck'); if (document.fullscreenElement) document.exitFullscreen(); else if (d.requestFullscreen) d.requestFullscreen(); }
function renderSlides(tp, panel) {
  slideDeck = buildSlides(tp);
  panel.innerHTML = `<div class="deck" id="deck" data-g="${tp.g}"><div class="track"><div class="fill" id="slide-fill"></div></div><div class="slide" id="slide-body"></div>
  <div class="deck-bar"><button class="btn" id="slide-prev" onclick="slideShow('${tp.id}',(slideAt['${tp.id}']||0)-1)">${ico('left')} ${t('slPrev')}</button><b id="slide-n"></b><span class="muted small grow deck-hint">${t('slHint')}</span><button class="btn ghost" onclick="slideFull()" title="${t('slFull')}">${ico('full')} <span class="deck-hint">${t('slFull')}</span></button><button class="btn primary" id="slide-next" onclick="slideShow('${tp.id}',(slideAt['${tp.id}']||0)+1)">${t('slNext')} ${ico('arrow')}</button></div></div>`;
  slideShow(tp.id, slideAt[tp.id] || 0);
}
document.addEventListener('keydown', e => {
  if (route.tab !== 'slides' || !$('deck') || /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); slideShow(route.id, (slideAt[route.id] || 0) + 1); }
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); slideShow(route.id, (slideAt[route.id] || 0) - 1); }
});

/* ---------- задачи «по рисунку» ---------- */
function miniPlot(f, x0, x1, y0, y1, marks, name) {
  const W = 440, H = 250, X = x => (x - x0) / (x1 - x0) * W, Y = y => H - (y - y0) / (y1 - y0) * H;
  let s = `<svg class="mini-plot" viewBox="0 0 ${W} ${H}" role="img">`;
  for (let i = Math.ceil(x0); i <= x1; i++) s += `<line x1="${X(i)}" y1="0" x2="${X(i)}" y2="${H}" class="mp-grid"/>`;
  for (let j = Math.ceil(y0); j <= y1; j++) s += `<line x1="0" y1="${Y(j)}" x2="${W}" y2="${Y(j)}" class="mp-grid"/>`;
  s += `<line x1="0" y1="${Y(0)}" x2="${W}" y2="${Y(0)}" class="mp-axis"/><line x1="${X(0)}" y1="0" x2="${X(0)}" y2="${H}" class="mp-axis"/>`;
  for (let i = Math.ceil(x0) + 1; i < x1; i++) if (i) s += `<text x="${X(i)}" y="${Y(0) + 13}" class="mp-t" text-anchor="middle">${i}</text>`;
  s += `<text x="${X(0) - 6}" y="${Y(1) + 4}" class="mp-t" text-anchor="end">1</text><text x="${W - 8}" y="${Y(0) - 6}" class="mp-t">x</text><text x="${X(0) + 6}" y="11" class="mp-t">y</text>`;
  let d = '';
  for (let i = 0; i <= 220; i++) { const x = x0 + (x1 - x0) * i / 220; d += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(f(x)).toFixed(1); }
  s += `<path d="${d}" class="mp-curve"/><text x="${W - 10}" y="18" class="mp-name" text-anchor="end">${name}</text>`;
  (marks || []).forEach((x, i) => { s += `<line x1="${X(x)}" y1="${Y(0)}" x2="${X(x)}" y2="${Y(f(x))}" class="mp-drop"/><circle cx="${X(x)}" cy="${Y(0)}" r="4.5" class="mp-dot"/><text x="${X(x)}" y="${Y(0) + (f(x) > 0 ? 26 : -9)}" class="mp-mark" text-anchor="middle">x${'₁₂₃₄₅₆'[i]}</text>`; });
  return `<div class="mini-wrap">${s}</svg></div>`;
}
GEN.monotonicity.push(r => {
  const ph = r.pick([0, PI]), f = x => 2 * Math.sin(PI * x / 3 + ph), xs = r.shuffle([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]).slice(0, 5).sort((a, b) => a - b);
  const neg = xs.filter(x => Math.cos(PI * x / 3 + ph) < 0), want = r.pick([0, 1]), a = want ? xs.length - neg.length : neg.length;
  need(a >= 1 && a <= 4);
  const lst = arr => arr.map(x => '$x_' + (xs.indexOf(x) + 1) + '$').join(', ');
  return { q: L(`На рисунке изображён график функции $y=f(x)$ и отмечены пять точек на оси абсцисс. В скольких из этих точек производная функции ${want ? 'положительна' : 'отрицательна'}?`, `Суретте $y=f(x)$ функциясының графигі кескінделген және абсцисса осінде бес нүкте белгіленген. Осы нүктелердің нешеуінде функцияның туындысы ${want ? 'оң' : 'теріс'}?`, `The figure shows the graph of $y=f(x)$ with five points marked on the $x$-axis. At how many of them is the derivative ${want ? 'positive' : 'negative'}?`) + miniPlot(f, -6, 6, -3, 3, xs, 'y = f(x)'),
    a, lvl: 2, ans: m(String(a)), hint: L('На рисунке сама функция, а не производная. Производная отрицательна там, где график идёт вниз.', 'Суретте туынды емес, функцияның өзі. График төмен түсетін жерде туынды теріс.', 'The figure shows the function itself, not its derivative. The derivative is negative where the graph goes down.'),
    steps: [L('Знак производной показывает, растёт функция или убывает: на подъёме $f\'>0$, на спуске $f\'<0$.', 'Туындының таңбасы функцияның өсетінін не кемитінін көрсетеді: өрде $f\'>0$, еңісте $f\'<0$.', 'The sign of the derivative shows whether the function rises or falls: uphill $f\'>0$, downhill $f\'<0$.'),
      L(`График идёт вниз в точках: ${lst(neg) || '—'}. Там производная отрицательна.`, `График мына нүктелерде төмен түседі: ${lst(neg) || '—'}. Онда туынды теріс.`, `The graph goes down at: ${lst(neg) || '—'}. The derivative is negative there.`),
      L(`В остальных точках (${lst(xs.filter(x => !neg.includes(x))) || '—'}) график идёт вверх, производная положительна.`, `Қалған нүктелерде (${lst(xs.filter(x => !neg.includes(x))) || '—'}) график жоғары көтеріледі, туынды оң.`, `At the other points (${lst(xs.filter(x => !neg.includes(x))) || '—'}) the graph goes up, the derivative is positive.`),
      L(`Нужных точек: $${a}$.`, `Қажетті нүктелер саны: $${a}$.`, `Points we need: $${a}$.`)] };
});
GEN.extrema.push(r => {
  const a = r.int(-4, -1), d = r.int(2, 4), b = a + d, s = r.pick([1, -1]), k = 2.5 / (d * d / 4), f = x => s * k * (x - a) * (x - b), mx0 = r.pick([0, 1]);
  const ans = (s > 0) === !!mx0 ? a : b;
  return { q: L(`На рисунке изображён график $y=f'(x)$ — производной функции $f(x)$. Найдите точку ${mx0 ? 'максимума' : 'минимума'} функции $f(x)$.`, `Суретте $y=f'(x)$ — $f(x)$ функциясының туындысының графигі кескінделген. $f(x)$ функциясының ${mx0 ? 'максимум' : 'минимум'} нүктесін табыңыз.`, `The figure shows the graph of $y=f'(x)$, the derivative of $f(x)$. Find the ${mx0 ? 'maximum' : 'minimum'} point of $f(x)$.`) + miniPlot(f, a - 2, b + 2, -4, 4, null, "y = f ′(x)"),
    a: ans, lvl: 2, ans: m('x=' + ans), hint: L('Внимание: на рисунке производная. Экстремумы функции — там, где график $f\'$ пересекает ось $Ox$.', 'Назар аударыңыз: суретте туынды. Функцияның экстремумдары — $f\'$ графигі $Ox$ осін қиятын жерде.', 'Careful: this is the derivative. Extrema of the function are where the graph of $f\'$ crosses the $x$-axis.'),
    steps: [L(`На рисунке график производной. Он пересекает ось $Ox$ в точках $x=${a}$ и $x=${b}$ — там $f'(x)=0$, это критические точки.`, `Суретте туындының графигі. Ол $Ox$ осін $x=${a}$ және $x=${b}$ нүктелерінде қияды — онда $f'(x)=0$, бұл кризистік нүктелер.`, `This is the derivative's graph. It crosses the $x$-axis at $x=${a}$ and $x=${b}$ — there $f'(x)=0$, these are the critical points.`),
      L(`В точке $x=${a}$ производная меняет знак с ${s > 0 ? '«+» на «−» — это точка максимума' : '«−» на «+» — это точка минимума'}.`, `$x=${a}$ нүктесінде туынды таңбасын ${s > 0 ? '«+»-тен «−»-ке ауыстырады — бұл максимум нүктесі' : '«−»-тен «+»-ке ауыстырады — бұл минимум нүктесі'}.`, `At $x=${a}$ the derivative changes sign from ${s > 0 ? 'plus to minus — a maximum point' : 'minus to plus — a minimum point'}.`),
      L(`В точке $x=${b}$ — наоборот: это точка ${s > 0 ? 'минимума' : 'максимума'}.`, `$x=${b}$ нүктесінде — керісінше: бұл ${s > 0 ? 'минимум' : 'максимум'} нүктесі.`, `At $x=${b}$ it is the opposite: a ${s > 0 ? 'minimum' : 'maximum'} point.`)] };
});
GEN.antiderivative.push(r => {
  const p = r.pick([2, 3, 4]), ph = r.pick([0, PI / 2]), F = x => 2 * Math.sin(PI * x / p + ph), xs = [];
  for (let n = -8; n <= 8; n++) { const x = p * (0.5 + n - ph / PI); if (Math.abs(x) < 5.99) xs.push(x); }
  return { q: L('На рисунке изображён график $y=F(x)$ — одной из первообразных функции $f(x)$ на интервале $(-6;6)$. Сколько решений имеет уравнение $f(x)=0$ на этом интервале?', 'Суретте $y=F(x)$ — $f(x)$ функциясының $(-6;6)$ интервалындағы алғашқы функцияларының бірінің графигі кескінделген. $f(x)=0$ теңдеуінің осы интервалда неше шешімі бар?', 'The figure shows the graph of $y=F(x)$, an antiderivative of $f(x)$ on $(-6;6)$. How many solutions does $f(x)=0$ have on this interval?') + miniPlot(F, -6, 6, -3, 3, null, 'y = F(x)'),
    a: xs.length, lvl: 3, ans: m(String(xs.length)), hint: L('Вспомните: $f(x)=F\'(x)$. Где производная равна нулю?', 'Еске түсіріңіз: $f(x)=F\'(x)$. Туынды қай жерде нөлге тең?', 'Recall: $f(x)=F\'(x)$. Where is a derivative zero?'),
    steps: [L('По определению первообразной $f(x)=F\'(x)$. Значит, уравнение $f(x)=0$ — это $F\'(x)=0$.', 'Алғашқы функцияның анықтамасы бойынша $f(x)=F\'(x)$. Демек, $f(x)=0$ теңдеуі — $F\'(x)=0$.', 'By definition $f(x)=F\'(x)$. So $f(x)=0$ means $F\'(x)=0$.'),
      L('Производная равна нулю в точках, где касательная к графику $F$ горизонтальна — на вершинах «горок» и на дне «ямок».', 'Туынды $F$ графигіне жанама горизонталь болатын нүктелерде — «төбелердің» шыңында және «шұңқырлардың» түбінде нөлге тең.', 'A derivative is zero where the tangent to the graph of $F$ is horizontal — at the tops of hills and bottoms of valleys.'),
      L(`Считаем вершины и впадины на рисунке: их $${xs.length}$ (в точках $x=${xs.map(x => dec(x, 1)).join(';\\ ')}$).`, `Суреттегі шыңдар мен ойпаттарды санаймыз: олар $${xs.length}$ (нүктелері $x=${xs.map(x => dec(x, 1)).join(';\\ ')}$).`, `Count the peaks and valleys: there are $${xs.length}$ (at $x=${xs.map(x => dec(x, 1)).join(';\\ ')}$).`)] };
});

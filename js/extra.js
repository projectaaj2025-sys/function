/* Дополнения: слайды урока, графический калькулятор (JSXGraph), задачи «по рисунку», истории и картинки к темам. */
Object.assign(ICONS, {
  slides: 'M3 5h18v11H3zM12 16v4M8 20h8', wave: 'M3 12c3-9 6-9 9 0s6 9 9 0M3 20h18', full: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  left: 'M19 12H5M11 6l-6 6 6 6'
});
Object.assign(I18N, {
  graph: ['Графики', 'Графиктер', 'Graphs'], slides: ['Слайды', 'Слайдтар', 'Slides'],
  graphLead: ['Собственный графический калькулятор: работает без интернета и без ключей. Введите формулу, двигайте ползунки a, b, k, c, включайте производную, касательную и площадь под графиком.', 'Өз графикалық калькуляторымыз: интернетсіз және кілтсіз жұмыс істейді. Формуланы енгізіңіз, a, b, k, c жүгірткілерін жылжытыңыз, туындыны, жанаманы және график астындағы ауданды қосыңыз.', 'Our own graphing calculator: works offline, no keys. Type a formula, drag the sliders a, b, k, c, switch on the derivative, the tangent and the area under the graph.'],
  graphExamples: ['Готовые примеры по темам', 'Тақырыптар бойынша дайын мысалдар', 'Ready examples by topic'],
  graphBlank: ['Чистый лист', 'Таза парақ', 'Blank'],
  graphFail: ['Не удалось загрузить модуль графиков (vendor/jsxgraph).', 'График модулі жүктелмеді (vendor/jsxgraph).', 'Could not load the graph module (vendor/jsxgraph).'],
  gAdd: ['функция', 'функция', 'function'], gTan: ['касательная в точке a', 'a нүктесіндегі жанама', 'tangent at a'],
  gArea: ['площадь от a до b:', 'a-дан b-ға дейінгі аудан:', 'area from a to b:'], gArea1: ['под f(x)', 'f(x) астында', 'under f(x)'], gArea2: ['между f и g', 'f пен g арасында', 'between f and g'],
  gHelp: ['Можно писать: 2x, x^2, sqrt(x), sin(x), tg, arctg, ln, lg, exp, abs, pi, e и параметры a, b, k, c. Пунктир — производная. Колёсико мыши — масштаб, перетаскивание — сдвиг.', 'Жазуға болады: 2x, x^2, sqrt(x), sin(x), tg, arctg, ln, lg, exp, abs, pi, e және a, b, k, c параметрлері. Үзік сызық — туынды. Тінтуір дөңгелегі — масштаб, сүйреу — жылжыту.', 'You can type: 2x, x^2, sqrt(x), sin(x), tan, arctan, ln, lg, exp, abs, pi, e and the parameters a, b, k, c. Dashed — derivative. Mouse wheel zooms, drag pans.'],
  toDesmos: ['Построить график', 'График салу', 'Plot the graph'], openTopic: ['Открыть тему', 'Тақырыпты ашу', 'Open topic'],
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

/* ---------- истории и дополнительные объяснения к темам: [заголовок, текст] ---------- */
function carGraphs() {
  const W = 460, ph = [0, 1, 3, 4, 6, 7, 8, 10], acc = [1, 0, -1, 0, -1, 1, 0], names = L(['разгон', 'ровно', 'тормозим', 'стоим', 'назад', '', 'стоим'], ['үдеу', 'бірқалыпты', 'тежеу', 'тұрмыз', 'артқа', '', 'тұрмыз'], ['speed up', 'steady', 'brake', 'stop', 'reverse', '', 'stop']);
  const A = t => { for (let i = 0; i < 7; i++) if (t < ph[i + 1]) return acc[i]; return 0; };
  const N = 400, ts = [], xs = [], vs = [], as = []; let x = 0, v = 0;
  for (let i = 0; i <= N; i++) { const t = 10 * i / N; ts.push(t); as.push(A(t)); vs.push(v); xs.push(x); v += A(t) * 10 / N; x += v * 10 / N; }
  const X = t => 46 + t / 10 * (W - 60);
  const panel = (top, arr, lo, hi, label, col) => { const Y = y => top + 62 - (y - lo) / (hi - lo) * 56; return `<line x1="${X(0)}" y1="${Y(0)}" x2="${X(10)}" y2="${Y(0)}" class="mp-axis"/><line x1="${X(0)}" y1="${top + 2}" x2="${X(0)}" y2="${top + 66}" class="mp-axis"/><text x="6" y="${top + 36}" class="mp-mark">${label}</text><path d="${ts.map((t, i) => (i ? 'L' : 'M') + X(t).toFixed(1) + ' ' + Y(arr[i]).toFixed(1)).join('')}" fill="none" stroke="${col}" stroke-width="2.8" stroke-linejoin="round"/>`; };
  let s = `<svg class="mini-plot" viewBox="0 0 ${W} 250" role="img">`;
  ph.slice(1, -1).forEach(t => { s += `<line x1="${X(t)}" y1="16" x2="${X(t)}" y2="246" class="mp-drop" style="stroke:var(--muted)"/>`; });
  names.forEach((n, i) => { s += `<text x="${(X(ph[i]) + X(ph[i + 1])) / 2}" y="11" class="mp-t" text-anchor="middle">${n}</text>`; });
  s += panel(14, xs, -0.2, 3.4, 'x(t)', 'var(--pri)') + panel(92, vs, -1.3, 1.3, 'v = x′', 'var(--pink)') + panel(170, as, -1.4, 1.4, 'a = v′', 'var(--green)');
  return `<div class="mini-wrap" style="max-width:560px">${s}</svg></div>`;
}
const EXTRA = {
  'derivative-def': [
    [L('Американские горки и просмотры', 'Америка төбешіктері мен қаралымдар', 'Roller coasters and views'), () => L(
      R`<p>Посмотрите на американские горки сбоку: подъёмы, спуски, где-то круто, где-то полого. Про любую функцию можно рассказать то же самое — и «рассказчик» здесь производная.</p><p><b>Пример.</b> Вы выложили видео. Через 1 час у него 1 просмотр, через 2 часа — 4, через 3 — 9, через 4 — 16. Как быстро росла популярность между вторым и третьим часом? Изменение просмотров: $\Delta y=9-4=5$. Изменение времени: $\Delta x=1$ ч. Скорость: $\dfrac{\Delta y}{\Delta x}=5$ просмотров в час. Чем меньше брать промежуток времени, тем точнее мы узнаём скорость «прямо сейчас» — это и есть производная.</p>`,
      R`<p>Америка төбешіктеріне бүйірінен қараңыз: өрлер, еңістер, бір жері тік, бір жері жайпақ. Кез келген функция туралы дәл осылай айтуға болады — ал «әңгімеші» мұнда туынды.</p><p><b>Мысал.</b> Сіз видео жарияладыңыз. 1 сағаттан кейін 1 қаралым, 2 сағаттан кейін — 4, 3 сағаттан кейін — 9, 4 сағаттан кейін — 16. Екінші мен үшінші сағат арасында танымалдық қаншалықты тез өсті? Қаралым өзгерісі: $\Delta y=9-4=5$. Уақыт өзгерісі: $\Delta x=1$ сағ. Жылдамдық: $\dfrac{\Delta y}{\Delta x}=5$ қаралым/сағ. Уақыт аралығын неғұрлым аз алсақ, «дәл қазіргі» жылдамдықты соғұрлым дәл білеміз — бұл туынды.</p>`,
      R`<p>Look at a roller coaster from the side: climbs, drops, steep here, gentle there. Any function can be described the same way — and the storyteller is the derivative.</p><p><b>Example.</b> You post a video. After 1 hour it has 1 view, after 2 hours 4, after 3 hours 9, after 4 hours 16. How fast did it grow between hours two and three? Change in views: $\Delta y=9-4=5$. Change in time: $\Delta x=1$ h. Rate: $\dfrac{\Delta y}{\Delta x}=5$ views per hour. The shorter the interval, the better we know the rate "right now" — that is the derivative.</p>`)],
    [L('Дорога в небо', 'Аспанға апаратын жол', 'A road to the sky'), () => L(
      R`<p>Представьте, что график — это дорога, а вы идёте по ней слева направо. Если на каждый шаг вправо дорога поднимается на 2 шага вверх, её <i>крутизна</i> равна 2; если на 2 шага вправо — только 1 вверх, крутизна $\frac12$. Крутизна = подъём : сдвиг = $\dfrac{\Delta y}{\Delta x}$.</p><p>У прямой дороги крутизна везде одна. У кривой она меняется на каждом шагу — поэтому берём совсем крошечный шажок. Крутизна «прямо под ногами» и есть производная: в гору — положительна, под гору — отрицательна, на ровной площадке — ноль.</p>`,
      R`<p>График — жол, ал сіз онымен солдан оңға жүріп келесіз деп елестетіңіз. Оңға әр қадамда жол 2 қадам көтерілсе, оның <i>тіктігі</i> 2; оңға 2 қадамда 1 қадам ғана көтерілсе, тіктігі $\frac12$. Тіктік = көтерілу : жылжу = $\dfrac{\Delta y}{\Delta x}$.</p><p>Түзу жолдың тіктігі барлық жерде бірдей. Қисық жолда ол әр қадамда өзгереді — сондықтан өте кішкентай қадам аламыз. «Аяқ астындағы» тіктік — туынды: өрде — оң, еңісте — теріс, тегіс алаңда — нөл.</p>`,
      R`<p>Imagine the graph is a road and you walk along it from left to right. If every step right lifts you 2 steps up, its <i>steepness</i> is 2; if 2 steps right give only 1 up, it is $\frac12$. Steepness = rise : run = $\dfrac{\Delta y}{\Delta x}$.</p><p>A straight road has one steepness everywhere. On a curved road it changes at every step — so we take a tiny step. The steepness right under your feet is the derivative: uphill positive, downhill negative, flat zero.</p>`)]],
  differential: [[L('Рецепт приближённого вычисления', 'Жуықтап есептеу рецепті', 'A recipe for approximation'), () => L(
    R`<ol><li>Замените «неудобное» число на близкое «удобное» $x_0$, в котором функция считается в уме.</li><li>Найдите $\Delta x=x-x_0$ (оно может быть и отрицательным!).</li><li>Вычислите $f(x_0)$ и $f'(x_0)$.</li><li>Подставьте: $f(x)\approx f(x_0)+f'(x_0)\,\Delta x$.</li></ol><p>Пример: $\sqrt[3]{26{,}5}$. Удобная точка $x_0=27$, $\Delta x=-0{,}5$. $f(x)=\sqrt[3]{x}$, $f'(x)=\dfrac{1}{3\sqrt[3]{x^2}}$, $f'(27)=\dfrac1{27}$. Итог: $3-\dfrac{0{,}5}{27}\approx2{,}9815$ (калькулятор даёт $2{,}9814…$).</p><p><b>Насколько мы ошиблись?</b> Абсолютная погрешность — $|$точное $-$ приближённое$|$. Относительная — абсолютная, делённая на точное значение, в процентах. Чем меньше $\Delta x$, тем меньше обе.</p>`,
    R`<ol><li>«Ыңғайсыз» санды функция ойша есептелетін жақын «ыңғайлы» $x_0$ санына ауыстырыңыз.</li><li>$\Delta x=x-x_0$ табыңыз (ол теріс те болуы мүмкін!).</li><li>$f(x_0)$ және $f'(x_0)$ есептеңіз.</li><li>Қойыңыз: $f(x)\approx f(x_0)+f'(x_0)\,\Delta x$.</li></ol><p>Мысал: $\sqrt[3]{26{,}5}$. Ыңғайлы нүкте $x_0=27$, $\Delta x=-0{,}5$. $f(x)=\sqrt[3]{x}$, $f'(x)=\dfrac{1}{3\sqrt[3]{x^2}}$, $f'(27)=\dfrac1{27}$. Нәтиже: $3-\dfrac{0{,}5}{27}\approx2{,}9815$ (калькулятор $2{,}9814…$ береді).</p><p><b>Қаншалықты қателестік?</b> Абсолют қателік — $|$дәл $-$ жуық$|$. Салыстырмалы қателік — абсолют қателіктің дәл мәнге қатынасы, пайызбен. $\Delta x$ неғұрлым аз болса, екеуі де соғұрлым аз.</p>`,
    R`<ol><li>Replace the awkward number by a nearby convenient $x_0$ where the function is easy.</li><li>Find $\Delta x=x-x_0$ (it may be negative!).</li><li>Compute $f(x_0)$ and $f'(x_0)$.</li><li>Substitute: $f(x)\approx f(x_0)+f'(x_0)\,\Delta x$.</li></ol><p>Example: $\sqrt[3]{26.5}$. Convenient point $x_0=27$, $\Delta x=-0.5$. $f(x)=\sqrt[3]{x}$, $f'(x)=\dfrac{1}{3\sqrt[3]{x^2}}$, $f'(27)=\dfrac1{27}$. Result: $3-\dfrac{0.5}{27}\approx2.9815$ (a calculator gives $2.9814…$).</p><p><b>How wrong are we?</b> Absolute error — $|$exact $-$ approximate$|$. Relative error — the absolute one divided by the exact value, in percent. The smaller $\Delta x$, the smaller both.</p>`)]],
  'diff-rules': [[L('Таблица — кирпичи, правила — супергерои', 'Кесте — кірпіштер, ережелер — суперқаһармандар', 'The table is bricks, the rules are superheroes'), () => L(
    R`<p>Таблица производных знает только «чистые» функции: $x^n$, $\sin x$, $e^x$… А в задачах они склеены: умножены на число, сложены, перемножены, поделены. Тут на помощь приходят четыре правила — у каждого своя суперсила:</p><ul><li>число перед функцией просто <b>выносится</b>: $(6\sin x)'=6\cos x$;</li><li>сумму дифференцируем <b>по кусочкам</b>: $(4x^5-\sqrt x+\cos x)'=20x^4-\dfrac1{2\sqrt x}-\sin x$;</li><li>в произведении работаем <b>по очереди</b>: сначала дифференцируем первый множитель, потом второй, результаты складываем;</li><li>в частном — то же, но с минусом и знаменателем в квадрате.</li></ul>`,
    R`<p>Туындылар кестесі тек «таза» функцияларды біледі: $x^n$, $\sin x$, $e^x$… Ал есептерде олар біріктірілген: санға көбейтілген, қосылған, көбейтілген, бөлінген. Мұнда төрт ереже көмекке келеді — әрқайсысының өз суперкүші бар:</p><ul><li>функция алдындағы сан жай ғана <b>сыртқа шығады</b>: $(6\sin x)'=6\cos x$;</li><li>қосындыны <b>бөлік-бөлігімен</b> дифференциалдаймыз: $(4x^5-\sqrt x+\cos x)'=20x^4-\dfrac1{2\sqrt x}-\sin x$;</li><li>көбейтіндіде <b>кезекпен</b> жұмыс істейміз: алдымен бірінші көбейткішті, сосын екіншісін дифференциалдап, нәтижелерін қосамыз;</li><li>бөліндіде — дәл солай, бірақ минуспен және бөлімнің квадратымен.</li></ul>`,
    R`<p>The table of derivatives knows only "pure" functions: $x^n$, $\sin x$, $e^x$… In problems they are glued together: multiplied by a number, added, multiplied, divided. Four rules come to the rescue, each with its own superpower:</p><ul><li>a number in front simply <b>moves out</b>: $(6\sin x)'=6\cos x$;</li><li>a sum is differentiated <b>piece by piece</b>: $(4x^5-\sqrt x+\cos x)'=20x^4-\dfrac1{2\sqrt x}-\sin x$;</li><li>in a product we work <b>in turns</b>: differentiate the first factor, then the second, and add;</li><li>a quotient is the same, but with a minus and the denominator squared.</li></ul>`)]],
  'chain-rule': [[L('Функция-матрёшка', 'Матрёшка-функция', 'A nesting-doll function'), () => L(
    R`<p>В большую матрёшку вложена кукла поменьше, в неё — ещё меньше. Так же и с функциями: возьмём $\sqrt x$ и спрячем его внутрь косинуса — получится $\cos(\sqrt x)$. Снаружи косинус, внутри корень.</p><p>Чтобы найти производную, раскрываем матрёшку слой за слоем: производная внешней куклы (внутреннюю пока не трогаем) умножается на производную внутренней: $$\big(\cos\sqrt x\big)'=-\sin\sqrt x\cdot\frac{1}{2\sqrt x}.$$ Если кукол три — множителей тоже три.</p>`,
    R`<p>Үлкен матрёшканың ішінде кішірек қуыршақ, оның ішінде одан да кішісі бар. Функциялар да солай: $\sqrt x$ алып, оны косинустың ішіне жасырамыз — $\cos(\sqrt x)$ шығады. Сыртында косинус, ішінде түбір.</p><p>Туындыны табу үшін матрёшканы қабат-қабатымен ашамыз: сыртқы қуыршақтың туындысы (ішкісіне әзірге тимейміз) ішкісінің туындысына көбейтіледі: $$\big(\cos\sqrt x\big)'=-\sin\sqrt x\cdot\frac{1}{2\sqrt x}.$$ Қуыршақ үшеу болса — көбейткіш те үшеу.</p>`,
    R`<p>A big nesting doll holds a smaller one, which holds a smaller one still. Functions do the same: take $\sqrt x$ and hide it inside a cosine — you get $\cos(\sqrt x)$. Cosine outside, root inside.</p><p>To differentiate, open the doll layer by layer: the derivative of the outer doll (leave the inner one alone) times the derivative of the inner one: $$\big(\cos\sqrt x\big)'=-\sin\sqrt x\cdot\frac{1}{2\sqrt x}.$$ Three dolls — three factors.</p>`)]],
  'derivative-meaning': [[L('Машина на дороге: путь, скорость, ускорение', 'Жолдағы көлік: жол, жылдамдық, үдеу', 'A car on the road: position, speed, acceleration'), () => L(
    R`<p>Машина трогается, едет ровно, тормозит, стоит, а потом сдаёт назад. Сверху — её положение $x(t)$. Средний график — производная: скорость. Нижний — производная от производной: ускорение.</p>`,
    R`<p>Көлік қозғалады, бірқалыпты жүреді, тежейді, тұрады, сосын артқа шегінеді. Жоғарыда — оның орны $x(t)$. Ортаңғы график — туынды: жылдамдық. Төменгісі — туындының туындысы: үдеу.</p>`,
    R`<p>A car starts, cruises, brakes, stands still and then reverses. On top is its position $x(t)$. The middle graph is the derivative: speed. The bottom one is the derivative of the derivative: acceleration.</p>`) + carGraphs() + L(
    R`<ul><li>Где график $x(t)$ идёт вверх — скорость положительна; где он горизонтален — скорость ноль; где опускается (едем назад) — скорость отрицательна.</li><li>Чем круче $x(t)$, тем выше график скорости.</li><li>Ускорение не равно нулю только там, где скорость меняется: при разгоне оно положительно, при торможении — отрицательно.</li></ul><p>Среднюю скорость $\dfrac{\Delta x}{\Delta t}$ знает любой навигатор. Мгновенная получается, когда промежуток $\Delta t$ сжимается почти до нуля — но не становится нулём! Его называют <i>бесконечно малым</i>, а результат записывают $\dfrac{dx}{dt}$.</p>`,
    R`<ul><li>$x(t)$ графигі жоғары көтерілсе — жылдамдық оң; горизонталь болса — жылдамдық нөл; төмен түссе (артқа жүреміз) — жылдамдық теріс.</li><li>$x(t)$ неғұрлым тік болса, жылдамдық графигі соғұрлым жоғары.</li><li>Үдеу тек жылдамдық өзгеретін жерде ғана нөлге тең емес: үдегенде оң, тежегенде теріс.</li></ul><p>Орташа жылдамдықты $\dfrac{\Delta x}{\Delta t}$ кез келген навигатор біледі. Лездік жылдамдық $\Delta t$ аралығы нөлге дейін дерлік қысылғанда шығады — бірақ нөлге айналмайды! Оны <i>шексіз аз</i> деп атайды, ал нәтижесін $\dfrac{dx}{dt}$ деп жазады.</p>`,
    R`<ul><li>Where $x(t)$ goes up the speed is positive; where it is flat the speed is zero; where it goes down (reversing) the speed is negative.</li><li>The steeper $x(t)$, the higher the speed graph.</li><li>Acceleration is non-zero only where the speed changes: positive when speeding up, negative when braking.</li></ul><p>Any satnav knows the average speed $\dfrac{\Delta x}{\Delta t}$. The instantaneous one appears when $\Delta t$ shrinks almost to zero — but never becomes zero! It is called <i>infinitely small</i>, and the result is written $\dfrac{dx}{dt}$.</p>`)]],
  monotonicity: [[L('Тропики и льды', 'Тропик пен мұз', 'Tropics and ice'), () => L(
    R`<p>Посмотрите на график <i>производной</i>. Ось $Ox$ — граница климата: выше неё «тропики» (значения положительны), ниже — «льды» (отрицательны). Где график $f'$ в тропиках — сама функция $f$ растёт; где во льдах — убывает.</p><p>Обратно: по графику функции идём слева направо, как вагончик по американским горкам. Поднимаемся — там $f'>0$, спускаемся — $f'<0$. Не перепутайте, чей график на рисунке: $f$ или $f'$ — это самая частая ловушка! График функции и график её производной связаны, но выглядят совсем по-разному — как интерес зрителей к фильму и количество экшн-сцен в нём.</p>`,
    R`<p><i>Туындының</i> графигіне қараңыз. $Ox$ осі — климат шекарасы: одан жоғары «тропик» (мәндер оң), төмен — «мұз» (мәндер теріс). $f'$ графигі тропикте болса — $f$ функциясының өзі өседі; мұзда болса — кемиді.</p><p>Керісінше: функция графигімен солдан оңға, төбешіктегі вагон сияқты жүреміз. Көтерілсек — онда $f'>0$, түссек — $f'<0$. Суретте кімнің графигі тұрғанын шатастырмаңыз: $f$ пе, әлде $f'$ пе — бұл ең жиі тұзақ! Функция графигі мен туынды графигі байланысты, бірақ мүлде басқаша көрінеді — көрерменнің фильмге қызығушылығы мен ондағы экшн-көріністер саны сияқты.</p>`,
    R`<p>Look at the graph of the <i>derivative</i>. The $x$-axis is a climate border: above it are the tropics (positive values), below — the ice (negative). Where the graph of $f'$ is in the tropics, $f$ itself rises; where it is in the ice, $f$ falls.</p><p>The other way: ride along the graph of the function left to right like a roller-coaster car. Going up means $f'>0$, going down $f'<0$. Do not mix up whose graph is drawn, $f$ or $f'$ — the most common trap! The two graphs are related but look quite different — like audience interest in a film and the number of action scenes in it.</p>`)]],
  extrema: [[L('Как читать график производной', 'Туынды графигін қалай оқимыз', 'How to read a derivative graph'), () => L(
    R`<ul><li>График $f'$ пересекает ось $Ox$ сверху вниз (из «плюса» в «минус») — у функции <b>максимум</b>: поднимались, стали спускаться.</li><li>Пересекает снизу вверх — <b>минимум</b>.</li><li>Только коснулся оси и вернулся — экстремума нет.</li></ul><p><b>Пять шагов без графика.</b> 1) Найдите $f'(x)$. 2) Решите $f'(x)=0$. 3) Отметьте корни на числовой прямой. 4) Подставьте в <i>производную</i> по одной точке из каждого промежутка и запишите знак. 5) «$+$» сменился на «$-$» — максимум, «$-$» на «$+$» — минимум.</p><p>Пример: $f(x)=(x-4)^2(x+11)+4$. $f'(x)=(x-4)(3x+18)$, корни $-6$ и $4$, знаки $+,-,+$. Значит, $x=-6$ — точка максимума, $x=4$ — точка минимума.</p>`,
    R`<ul><li>$f'$ графигі $Ox$ осін жоғарыдан төмен қиса («плюстен» «минусқа») — функцияда <b>максимум</b>: көтеріліп келіп, түсе бастадық.</li><li>Төменнен жоғары қиса — <b>минимум</b>.</li><li>Оське тек жанасып, қайтып кетсе — экстремум жоқ.</li></ul><p><b>Графиксіз бес қадам.</b> 1) $f'(x)$ табыңыз. 2) $f'(x)=0$ шешіңіз. 3) Түбірлерді сан түзуінде белгілеңіз. 4) Әр аралықтан бір нүктені <i>туындыға</i> қойып, таңбасын жазыңыз. 5) «$+$» «$-$»-ке ауысса — максимум, «$-$» «$+$»-ке ауысса — минимум.</p><p>Мысал: $f(x)=(x-4)^2(x+11)+4$. $f'(x)=(x-4)(3x+18)$, түбірлері $-6$ және $4$, таңбалар $+,-,+$. Демек, $x=-6$ — максимум нүктесі, $x=4$ — минимум нүктесі.</p>`,
    R`<ul><li>The graph of $f'$ crosses the $x$-axis downwards (plus to minus) — the function has a <b>maximum</b>: it was rising, now it falls.</li><li>Crosses upwards — a <b>minimum</b>.</li><li>Only touches the axis and returns — no extremum.</li></ul><p><b>Five steps without a graph.</b> 1) Find $f'(x)$. 2) Solve $f'(x)=0$. 3) Mark the roots on a number line. 4) Put one point from each interval into the <i>derivative</i> and note the sign. 5) Plus to minus — maximum, minus to plus — minimum.</p><p>Example: $f(x)=(x-4)^2(x+11)+4$. $f'(x)=(x-4)(3x+18)$, roots $-6$ and $4$, signs $+,-,+$. So $x=-6$ is a maximum point and $x=4$ a minimum point.</p>`)]],
  antiderivative: [
    [L('Первый образ: дерево → зёрна → кофе', 'Алғашқы бейне: ағаш → дән → кофе', 'The first image: tree → beans → coffee'), () => L(
      R`<p>Слово «первоОбразная» — от «первый образ». Первым образом пюре был картофель, а автомобиля — повозка. В жизни не всё можно вернуть назад: пирожок обратно в муку не превратишь. А в математике шаг назад есть всегда: сложили — вычтем, возвели в квадрат — извлечём корень, продифференцировали — найдём первообразную.</p><p>Цепочка: <b>кофейное дерево → зёрна → кофе</b>. Зёрна — это «производная» дерева, кофе — «производная» зёрен. Так же связаны $F(x)\to f(x)\to f'(x)$: каждая следующая — производная предыдущей, а каждая предыдущая — первообразная следующей.</p>`,
      R`<p>«Алғашқы функция» — «алғашқы бейне» деген сөз. Пюренің алғашқы бейнесі — картоп, автомобильдікі — арба. Өмірде бәрін кері қайтару мүмкін емес: бәлішті қайтадан ұнға айналдыра алмайсыз. Ал математикада артқа қадам әрқашан бар: қостық — азайтамыз, квадраттадық — түбір аламыз, дифференциалдадық — алғашқы функцияны табамыз.</p><p>Тізбек: <b>кофе ағашы → дәндер → кофе</b>. Дәндер — ағаштың «туындысы», кофе — дәндердің «туындысы». $F(x)\to f(x)\to f'(x)$ те солай байланысқан: әрбір келесісі — алдыңғысының туындысы, ал әрбір алдыңғысы — келесісінің алғашқы функциясы.</p>`,
      R`<p>The Russian word for antiderivative literally means "first image". The first image of mashed potato was a potato, of a car — a cart. In life not everything can be undone: a pie will not turn back into flour. In maths a step back always exists: added — subtract, squared — take a root, differentiated — find the antiderivative.</p><p>A chain: <b>coffee tree → beans → coffee</b>. Beans are the "derivative" of the tree, coffee the "derivative" of the beans. $F(x)\to f(x)\to f'(x)$ are linked the same way: each next one is the derivative of the previous, each previous one is an antiderivative of the next.</p>`)],
    [L('Почему первообразных много и что видно на графике', 'Неліктен алғашқы функциялар көп және графиктен не көрінеді', 'Why there are many antiderivatives and what the graph shows'), () => L(
      R`<p>Производная любого числа равна нулю, поэтому $x^2$, $x^2+5$ и $x^2-100$ после дифференцирования дают одно и то же: $2x$. Идя назад, мы не знаем, какое число «потерялось», и пишем $+C$.</p><p>Раз $F'=f$, всё, что мы знаем про пару «функция и её производная», работает и для пары «первообразная и функция»:</p><ul><li>где $f>0$ — первообразная $F$ растёт, где $f<0$ — убывает;</li><li>где $f=0$ и меняет знак — у $F$ экстремум.</li></ul>`,
      R`<p>Кез келген санның туындысы нөлге тең, сондықтан $x^2$, $x^2+5$ және $x^2-100$ дифференциалдағаннан кейін бірдей нәтиже береді: $2x$. Кері жүргенде қай сан «жоғалғанын» білмейміз, сондықтан $+C$ жазамыз.</p><p>$F'=f$ болғандықтан, «функция мен оның туындысы» жұбы туралы білетініміздің бәрі «алғашқы функция мен функция» жұбына да жарайды:</p><ul><li>$f>0$ болса — $F$ өседі, $f<0$ болса — кемиді;</li><li>$f=0$ болып, таңбасын өзгертсе — $F$ функциясында экстремум.</li></ul>`,
      R`<p>The derivative of any number is zero, so $x^2$, $x^2+5$ and $x^2-100$ all give the same thing after differentiation: $2x$. Going back we do not know which number was lost, so we write $+C$.</p><p>Since $F'=f$, everything we know about "a function and its derivative" also works for "an antiderivative and the function":</p><ul><li>where $f>0$ the antiderivative $F$ rises, where $f<0$ it falls;</li><li>where $f=0$ and changes sign, $F$ has an extremum.</li></ul>`)]],
  'definite-integral': [
    [L('Не такой страшный интеграл', 'Интеграл соншалықты қорқынышты емес', 'The integral is not that scary'), () => L(
      R`<p>Интеграл стабильно входит в топ-5 школьных страшилок. А по сути это площадь под графиком. Для прямоугольника и треугольника есть готовые формулы, а если одна сторона фигуры — кривая, помогает интеграл.</p><p>Производная по дороге находит её крутизну. Интеграл решает обратную задачу: известна крутизна на каждом шаге, а нужно узнать, как высоко вы в итоге забрались. Каждый маленький шаг $dx$ добавляет «крутизна × шаг» $=f(x)\,dx$. Сложили все шаги от $a$ до $b$ — получили $\int_a^bf(x)\,dx$.</p>`,
      R`<p>Интеграл мектептегі ең қорқынышты бес тақырыптың қатарына тұрақты кіреді. Ал шын мәнінде бұл — график астындағы аудан. Тіктөртбұрыш пен үшбұрыш үшін дайын формулалар бар, ал фигураның бір қабырғасы қисық болса, интеграл көмектеседі.</p><p>Туынды жол бойынша оның тіктігін табады. Интеграл кері есепті шешеді: әр қадамдағы тіктік белгілі, ал соңында қаншалықты биікке шыққаныңызды білу керек. Әрбір кішкентай $dx$ қадамы «тіктік × қадам» $=f(x)\,dx$ қосады. $a$-дан $b$-ға дейінгі барлық қадамды қоссақ — $\int_a^bf(x)\,dx$.</p>`,
      R`<p>The integral is a steady member of the top five school horrors. In essence it is the area under a graph. Rectangles and triangles have ready formulas; when one side of the figure is a curve, the integral helps.</p><p>A derivative takes a road and finds its steepness. An integral solves the reverse problem: you know the steepness at every step and want to know how high you end up. Each small step $dx$ adds "steepness × step" $=f(x)\,dx$. Add all steps from $a$ to $b$ and you get $\int_a^bf(x)\,dx$.</p>`)],
    [L('Ньютон, Лейбниц и великий спор', 'Ньютон, Лейбниц және ұлы дау', 'Newton, Leibniz and the great quarrel'), () => L(
      R`<p>Англичанин Исаак Ньютон (1642–1727) и немец Готфрид Лейбниц (1646–1716) пришли к одному открытию независимо друг от друга. Ньютон думал о движении: скорость он называл «флюксией». Лейбниц думал о площадях как о сумме бесконечно тонких полосок и придумал обозначения, которыми мы пользуемся до сих пор: $\dfrac{dy}{dx}$ и $\int$ — вытянутую букву S от слова «сумма».</p><p>Ньютон, по-видимому, был первым, но опубликовал позже — и спор о первенстве не утих до самой их смерти. Главный секрет, который открыли оба: две задачи, казавшиеся разными, — найти наклон касательной и найти площадь под кривой — обратны друг другу. Поэтому формула $\int_a^bf(x)\,dx=F(b)-F(a)$ носит оба имени.</p>`,
      R`<p>Ағылшын Исаак Ньютон (1642–1727) мен неміс Готфрид Лейбниц (1646–1716) бір жаңалыққа бір-бірінен тәуелсіз келді. Ньютон қозғалыс туралы ойлады: жылдамдықты ол «флюксия» деп атады. Лейбниц ауданды шексіз жіңішке жолақтардың қосындысы ретінде қарастырып, біз әлі күнге дейін қолданатын белгілеулерді ойлап тапты: $\dfrac{dy}{dx}$ және $\int$ — «сумма» сөзінің созылған S әрпі.</p><p>Ньютон, сірә, бірінші болған, бірақ кейінірек жариялаған — кімнің бірінші екені туралы дау екеуі өмірден өткенше басылмады. Екеуі де ашқан басты құпия: әртүрлі болып көрінген екі есеп — жанаманың көлбеулігін табу мен қисық астындағы ауданды табу — бір-біріне кері. Сондықтан $\int_a^bf(x)\,dx=F(b)-F(a)$ формуласы екеуінің де атымен аталады.</p>`,
      R`<p>The Englishman Isaac Newton (1642–1727) and the German Gottfried Leibniz (1646–1716) reached the same discovery independently. Newton thought about motion and called speed a "fluxion". Leibniz thought of areas as sums of infinitely thin strips and invented the notation we still use: $\dfrac{dy}{dx}$ and $\int$ — a stretched S for "sum".</p><p>Newton was apparently first but published later, and the priority quarrel lasted until both had died. The great secret both found: two problems that looked unrelated — the slope of a tangent and the area under a curve — are inverse to each other. That is why $\int_a^bf(x)\,dx=F(b)-F(a)$ carries both names.</p>`)]],
  'physics-integral': [[L('От ускорения к скорости, от скорости к пути', 'Үдеуден жылдамдыққа, жылдамдықтан жолға', 'From acceleration to speed, from speed to distance'), () => L(
    R`<p>Прочитаем историю машины в обратном порядке — снизу вверх.</p>`, R`<p>Көліктің тарихын кері ретпен — төменнен жоғары оқиық.</p>`, R`<p>Let us read the car's story backwards — from the bottom up.</p>`) + carGraphs() + L(
    R`<ul><li>Пока ускорение постоянно, площадь под его графиком — прямоугольник, который растёт равномерно. Именно так, по прямой, растёт скорость!</li><li>Под графиком скорости в это время — треугольник: его площадь растёт сначала медленно, потом быстрее. Это парабола — график пути.</li><li>Когда ускорение отрицательно, площадь «под осью» вычитается: скорость падает.</li></ul><p>Вывод: если одна функция — производная другой, то вторая — «функция площади» под графиком первой. Скорость — производная пути, поэтому путь — площадь под графиком скорости. Разрежем её на тонкие полоски шириной $\Delta t$ и высотой $v(t)$: каждая — это путь $v\cdot\Delta t$, пройденный почти с постоянной скоростью. Сумма всех полосок при $\Delta t\to0$ и есть $\displaystyle\int v(t)\,dt$.</p>`,
    R`<ul><li>Үдеу тұрақты болғанда оның графигі астындағы аудан — бірқалыпты өсетін тіктөртбұрыш. Жылдамдық дәл осылай, түзу бойымен өседі!</li><li>Бұл кезде жылдамдық графигінің астында — үшбұрыш: оның ауданы алдымен баяу, сосын тезірек өседі. Бұл парабола — жол графигі.</li><li>Үдеу теріс болғанда «ось астындағы» аудан азайтылады: жылдамдық төмендейді.</li></ul><p>Қорытынды: бір функция екіншісінің туындысы болса, екіншісі — біріншісінің графигі астындағы «аудан функциясы». Жылдамдық — жолдың туындысы, сондықтан жол — жылдамдық графигі астындағы аудан. Оны ені $\Delta t$, биіктігі $v(t)$ жіңішке жолақтарға кесеміз: әрқайсысы — тұрақты дерлік жылдамдықпен жүрілген $v\cdot\Delta t$ жол. $\Delta t\to0$ кезіндегі барлық жолақтың қосындысы — $\displaystyle\int v(t)\,dt$.</p>`,
    R`<ul><li>While acceleration is constant, the area under its graph is a rectangle growing steadily. That is exactly how speed grows — along a straight line!</li><li>Under the speed graph at that time is a triangle: its area grows slowly at first, then faster. That is a parabola — the distance graph.</li><li>When acceleration is negative, the area below the axis is subtracted: the speed drops.</li></ul><p>Conclusion: if one function is the derivative of another, the second is the "area function" under the graph of the first. Speed is the derivative of distance, so distance is the area under the speed graph. Cut it into thin strips of width $\Delta t$ and height $v(t)$: each is a distance $v\cdot\Delta t$ travelled at almost constant speed. The sum of all strips as $\Delta t\to0$ is $\displaystyle\int v(t)\,dt$.</p>`)]]
};
const extraHtml = id => (EXTRA[id] || []).map(([h, body]) => `<div class="story"><h3>${ico('bulb')} ${h}</h3>${mx(body())}</div>`).join('');

/* ---------- Графики: свой калькулятор на открытой библиотеке JSXGraph (MIT/LGPL), без ключей и внешних серверов ---------- */
const GRAPHS = {
  'limit-point': { rows: ['(x^2-1)/(x-1)'], view: [-4, 4, -2, 6] },
  asymptotes: { rows: ['(2x+1)/(x-3)', '2'], view: [-8, 14, -8, 12] },
  'sequence-limit': { rows: ['(1+1/x)^x', 'e'], view: [-1, 40, -0.5, 4] },
  continuity: { rows: ['sin(x)/x', '1/(x-k)'], k: 2 },
  indeterminate: { rows: ['sin(k x)/x', 'k'], k: 2, view: [-8, 8, -2, 4] },
  'derivative-def': { rows: ['x^2'], d1: 1, tan: 1, a: 1, view: [-4, 4, -3, 8] },
  differential: { rows: ['sqrt(x)'], tan: 1, a: 4, view: [-1, 12, -1, 5] },
  'diff-rules': { rows: ['x^2 exp(-x)'], d1: 1, view: [-2, 8, -2, 3] },
  'chain-rule': { rows: ['sin(k x)'], d1: 1, k: 2, view: [-5, 5, -3, 3] },
  'trig-derivatives': { rows: ['sin(x)', 'arctg(x)'], d1: 1, view: [-7, 7, -3, 3] },
  'derivative-meaning': { rows: ['x^3-6x'], d1: 1, d2: 1, tan: 1, a: 2, view: [-4, 4, -12, 14] },
  tangent: { rows: ['x^2'], tan: 1, a: 1.5, view: [-4, 4, -3, 8] },
  monotonicity: { rows: ['x^3-3x'], d1: 1, view: [-4, 4, -5, 6] },
  extrema: { rows: ['x^3-3x'], d1: 1, view: [-4, 4, -5, 6] },
  convexity: { rows: ['x^3-3x^2'], d2: 1, view: [-3, 5, -6, 6] },
  'function-study': { rows: ['x^3-3x', 'c'], d1: 1, d2: 1, c: 1, view: [-4, 4, -6, 6] },
  'max-min': { rows: ['x(10-x)'], tan: 1, a: 5, view: [-2, 12, -5, 30] },
  antiderivative: { rows: ['2x', 'x^2+c'], c: 0, view: [-5, 5, -6, 8] },
  substitution: { rows: ['2x cos(x^2)', 'sin(x^2)+c'], c: 0, view: [-4, 4, -6, 6] },
  'by-parts': { rows: ['x exp(x)', '(x-1) exp(x)+c'], c: 0, view: [-5, 3, -4, 8] },
  'definite-integral': { rows: ['x^2'], area: 1, a: 0, b: 2, view: [-3, 4, -2, 8] },
  area: { rows: ['x', 'x^2'], area: 2, a: 0, b: 1, view: [-1, 2, -0.5, 2] },
  volume: { rows: ['sqrt(x)', '-sqrt(x)'], area: 2, a: 0, b: 4, view: [-1, 6, -3, 3] },
  'physics-integral': { rows: ['3x^2'], area: 1, a: 0, b: 2, view: [-1, 3, -2, 14] },
  'de-basics': { rows: ['x^2+c'], c: 3, view: [-4, 4, -5, 10] },
  separable: { rows: ['c exp(k x)'], c: 1, k: 0.5, view: [-6, 6, -4, 8] },
  'second-order': { rows: ['c exp(-0.3x) cos(k x)'], c: 2, k: 2, view: [-1, 12, -3, 3] },
  harmonic: { rows: ['a cos(k x + c)'], a: 2, k: 1.5, c: 0, view: [-1, 12, -3, 3] }
};
const GCOL = ['#7c3aed', '#ec4899', '#059669', '#ea580c', '#0891d1'];
const GFN = { sin: Math.sin, cos: Math.cos, tan: Math.tan, tg: Math.tan, cot: x => 1 / Math.tan(x), ctg: x => 1 / Math.tan(x), asin: Math.asin, arcsin: Math.asin, acos: Math.acos, arccos: Math.acos, atan: Math.atan, arctan: Math.atan, arctg: Math.atan, arcctg: x => Math.PI / 2 - Math.atan(x), sqrt: Math.sqrt, cbrt: Math.cbrt, abs: Math.abs, ln: Math.log, log: Math.log, lg: Math.log10, exp: Math.exp, sh: Math.sinh, sinh: Math.sinh, ch: Math.cosh, cosh: Math.cosh, th: Math.tanh, tanh: Math.tanh, sign: Math.sign };
const GVAR = ['x', 'a', 'b', 'k', 'c', 'pi', 'e'];
/* Маленький безопасный разборщик формул: без eval, только числа, x, параметры a b k c, pi, e и известные функции. */
function compileExpr(src) {
  const s = String(src).toLowerCase().replace(/(\d),(\d)/g, '$1.$2').replace(/[−–—]/g, '-').replace(/[·×]/g, '*').replace(/[÷:]/g, '/').replace(/π/g, 'pi').replace(/\*\*/g, '^');
  const tk = []; let i = 0;
  const names = Object.keys(GFN).concat(GVAR).sort((p, q) => q.length - p.length);
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (/[0-9.]/.test(ch)) { const m = /^\d*\.?\d+|^\d+\.?/.exec(s.slice(i)); if (!m) throw new Error(ch); tk.push({ n: parseFloat(m[0]) }); i += m[0].length; continue; }
    if (/[a-z]/.test(ch)) { const nm = names.find(w => s.startsWith(w, i)); if (!nm) throw new Error(s.slice(i, i + 6)); tk.push(GFN[nm] ? { f: nm } : { v: nm }); i += nm.length; continue; }
    if ('+-*/^()'.includes(ch)) { tk.push({ o: ch }); i++; continue; }
    throw new Error(ch);
  }
  let p = 0;
  const peek = () => tk[p], isO = c => tk[p] && tk[p].o === c;
  const startsAtom = () => tk[p] && (tk[p].n != null || tk[p].v || tk[p].f || tk[p].o === '(');
  function expr() { let l = term(); while (isO('+') || isO('-')) { const op = tk[p++].o, r = term(), l0 = l; l = op === '+' ? (x, P) => l0(x, P) + r(x, P) : (x, P) => l0(x, P) - r(x, P); } return l; }
  function term() { let l = unary(); for (;;) { if (isO('*') || isO('/')) { const op = tk[p++].o, r = unary(), l0 = l; l = op === '*' ? (x, P) => l0(x, P) * r(x, P) : (x, P) => l0(x, P) / r(x, P); } else if (startsAtom()) { const r = power(), l0 = l; l = (x, P) => l0(x, P) * r(x, P); } else return l; } }
  function unary() { if (isO('-')) { p++; const r = unary(); return (x, P) => -r(x, P); } if (isO('+')) { p++; return unary(); } return power(); }
  function power() { const b = atom(); if (isO('^')) { p++; const e = unary(); return (x, P) => { const u = b(x, P), w = e(x, P); return u < 0 && Math.abs(w * 3 - Math.round(w * 3)) < 1e-12 && Math.round(w * 3) % 3 !== 0 && Math.round(1 / (w - Math.floor(w))) % 2 === 1 ? -Math.pow(-u, w) : Math.pow(u, w); }; } return b; }
  function atom() {
    const t0 = peek(); if (!t0) throw new Error('…');
    p++;
    if (t0.n != null) return () => t0.n;
    if (t0.v) { const v = t0.v; return v === 'x' ? x => x : v === 'pi' ? () => Math.PI : v === 'e' ? () => Math.E : (x, P) => P[v]; }
    if (t0.f) { const fn = GFN[t0.f]; let arg; if (isO('(')) { p++; arg = expr(); if (!isO(')')) throw new Error(')'); p++; } else arg = power(); return (x, P) => fn(arg(x, P)); }
    if (t0.o === '(') { const e = expr(); if (!isO(')')) throw new Error(')'); p++; return e; }
    throw new Error(t0.o);
  }
  const f = expr(); if (p < tk.length) throw new Error(tk[p].o || '?');
  return f;
}
const gnum = v => String(+(+v).toFixed(2));
const G = { rows: [], P: { a: 1, b: 2, k: 1, c: 0 }, d1: 0, d2: 0, tan: 0, area: 0, view: [-8, 8, -6, 6], board: null, fns: [] };
let jxgLoading = null;
function loadJXG() {
  if (window.JXG) return Promise.resolve();
  if (jxgLoading) return jxgLoading;
  jxgLoading = new Promise((res, rej) => {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'vendor/jsxgraph/jsxgraph.css'; document.head.appendChild(l);
    const s = document.createElement('script'); s.src = 'vendor/jsxgraph/jsxgraphcore.js'; s.onload = () => res(); s.onerror = () => { jxgLoading = null; rej(new Error('jsxgraph')); }; document.head.appendChild(s);
  });
  return jxgLoading;
}
const gD = (f, x) => (f(x + 1e-4) - f(x - 1e-4)) / 2e-4;
const gD2 = (f, x) => (f(x + 1e-3) - 2 * f(x) + f(x - 1e-3)) / 1e-6;
function gInt(f, a, b) { const n = 400, h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; }
function graphSetPreset(id) {
  const g = GRAPHS[id] || { rows: ['x^2'] };
  G.rows = g.rows.slice(); G.P = { a: g.a != null ? g.a : 1, b: g.b != null ? g.b : 2, k: g.k != null ? g.k : 1, c: g.c != null ? g.c : 0 };
  G.d1 = g.d1 || 0; G.d2 = g.d2 || 0; G.tan = g.tan || 0; G.area = g.area || 0; G.view = (g.view || [-8, 8, -6, 6]).slice();
}
function graphDraw(keepView) {
  if (!window.JXG || !$('jxg-box')) return;
  if (G.board) { if (keepView) { const bb = G.board.getBoundingBox(); G.view = [bb[0], bb[2], bb[3], bb[1]]; } JXG.JSXGraph.freeBoard(G.board); G.board = null; }
  const ax = { strokeColor: '#8b8fa8', highlight: false, ticks: { strokeColor: '#8b8fa8', strokeOpacity: .25, label: { strokeColor: '#8b8fa8', highlight: false } } };
  const bd = G.board = JXG.JSXGraph.initBoard('jxg-box', { boundingbox: [G.view[0], G.view[3], G.view[1], G.view[2]], axis: true, defaultAxes: { x: ax, y: ax }, showCopyright: false, showNavigation: true, pan: { enabled: true, needTwoFingers: false, needShift: false }, zoom: { wheel: true, needShift: false, pinch: true }, keepaspectratio: false });
  G.fns = G.rows.map((src, i) => { const inp = $('g-in-' + i); try { if (!src.trim()) throw new Error(''); const f = compileExpr(src); if (inp) inp.classList.remove('bad'); return x => f(x, G.P); } catch (e) { if (inp) inp.classList.toggle('bad', !!src.trim()); return null; } });
  const opt = { highlight: false, fixed: true };
  const f0 = G.fns[0], f1 = G.fns[1];
  if (G.area && f0) {
    const two = G.area === 2 && f1;
    bd.create('curve', [[0], [0]], Object.assign({ strokeWidth: 0, fillColor: GCOL[0], fillOpacity: .22 }, opt)).updateDataArray = function () {
      const a = Math.min(G.P.a, G.P.b), b = Math.max(G.P.a, G.P.b), n = 120, xs = [], ys = [];
      for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n, y = f0(x); xs.push(x); ys.push(Number.isFinite(y) ? y : 0); }
      for (let i = n; i >= 0; i--) { const x = a + (b - a) * i / n, y = two ? f1(x) : 0; xs.push(x); ys.push(Number.isFinite(y) ? y : 0); }
      this.dataX = xs; this.dataY = ys;
    };
    for (const k of ['a', 'b']) bd.create('line', [[() => G.P[k], 0], [() => G.P[k], 1]], Object.assign({ strokeColor: GCOL[0], strokeWidth: 1.2, dash: 2 }, opt));
  }
  G.fns.forEach((f, i) => {
    if (!f) return; const col = GCOL[i % GCOL.length];
    bd.create('functiongraph', [f], Object.assign({ strokeColor: col, strokeWidth: 2.8 }, opt));
    if (G.d1) bd.create('functiongraph', [x => gD(f, x)], Object.assign({ strokeColor: col, strokeWidth: 2, dash: 2 }, opt));
    if (G.d2) bd.create('functiongraph', [x => gD2(f, x)], Object.assign({ strokeColor: col, strokeWidth: 1.6, dash: 1 }, opt));
  });
  if (G.tan && f0) {
    bd.create('functiongraph', [x => f0(G.P.a) + gD(f0, G.P.a) * (x - G.P.a)], Object.assign({ strokeColor: '#f59e0b', strokeWidth: 2.2 }, opt));
    bd.create('point', [() => G.P.a, () => f0(G.P.a)], Object.assign({ name: '', size: 4, fillColor: '#f59e0b', strokeColor: '#fff' }, opt));
  }
  graphRead();
}
function graphRead() {
  const el = $('g-read'); if (!el) return;
  const f0 = G.fns[0], f1 = G.fns[1], P = G.P, out = [], nn = v => Number.isFinite(v) ? dec(v, 3) : '—';
  if (f0) {
    out.push([`$f(a)$`, nn(f0(P.a))], [`$f'(a)$`, nn(gD(f0, P.a))]);
    if (G.tan) out.push([L('касательная', 'жанама', 'tangent'), `$y=${nn(gD(f0, P.a))}x${f0(P.a) - gD(f0, P.a) * P.a < 0 ? '-' : '+'}${nn(Math.abs(f0(P.a) - gD(f0, P.a) * P.a))}$`]);
    if (G.area === 1) out.push([`$\\int_a^b f(x)\\,dx$`, nn(gInt(f0, P.a, P.b))]);
    if (G.area === 2 && f1) out.push([`$\\int_a^b (f-g)\\,dx$`, nn(gInt(x => f0(x) - f1(x), P.a, P.b))], [`$\\pi\\int_a^b f^2dx$`, nn(Math.PI * gInt(x => f0(x) ** 2, P.a, P.b))]);
  }
  el.innerHTML = out.map(([k, v]) => `<div><span>${mx(k)}</span><b>${v === '—' || /\$/.test(v) ? mx(String(v)) : mx('$' + v + '$')}</b></div>`).join('');
}
function graphPanel() {
  const P = G.P, chk = (k, label) => `<label class="g-chk"><input type="checkbox" ${G[k] ? 'checked' : ''} onchange="G.${k}=this.checked?1:0;graphDraw(true)"> ${label}</label>`;
  $('g-panel').innerHTML = `<div class="stack" style="gap:8px">${G.rows.map((r, i) => `<div class="g-row"><i style="background:${GCOL[i % GCOL.length]}"></i><span class="g-y">${i === 0 ? 'f(x) =' : i === 1 ? 'g(x) =' : 'y ='}</span><input id="g-in-${i}" value="${esc(r)}" spellcheck="false" autocomplete="off" oninput="G.rows[${i}]=this.value;graphDraw(true)">${G.rows.length > 1 ? `<button class="btn ghost sm" title="×" onclick="G.rows.splice(${i},1);graphPanel();graphDraw(true)">×</button>` : ''}</div>`).join('')}
   ${G.rows.length < 5 ? `<button class="btn soft sm" onclick="G.rows.push('');graphPanel();graphDraw(true);$('g-in-'+(G.rows.length-1)).focus()">+ ${t('gAdd')}</button>` : ''}</div>
  <div class="g-opts">${chk('d1', mx("$f'(x)$"))}${chk('d2', mx("$f''(x)$"))}${chk('tan', t('gTan'))}
   <label class="g-chk">${t('gArea')} <select onchange="G.area=+this.value;graphDraw(true)"><option value="0" ${G.area === 0 ? 'selected' : ''}>—</option><option value="1" ${G.area === 1 ? 'selected' : ''}>${t('gArea1')}</option><option value="2" ${G.area === 2 ? 'selected' : ''}>${t('gArea2')}</option></select></label></div>
  ${['a', 'b', 'k', 'c'].map(k => `<div class="ctl"><label><span>${mx('$' + k + '$')}</span><output id="g-out-${k}">${gnum(P[k])}</output></label><input type="range" min="-6" max="6" step="0.05" value="${P[k]}" oninput="G.P.${k}=+this.value;$('g-out-${k}').textContent=gnum(G.P.${k});if(G.board){G.board.update();graphRead()}"></div>`).join('')}
  <div class="readout" id="g-read"></div><p class="muted small" style="margin:6px 0 0">${t('gHelp')}</p>`;
}
function graphPick(id) { history.replaceState(null, '', '#graph' + (id ? '/' + id : '')); route.tab = id; graphSetPreset(id); graphPanel(); graphDraw(false); document.querySelectorAll('#graph-chips button').forEach(b => b.classList.toggle('active', b.dataset.id === id)); const a = $('graph-topic'); if (a) { a.classList.toggle('hidden', !id); a.href = '#' + id; } }
function renderGraph() {
  const cur = GRAPHS[route.tab] ? route.tab : '';
  G.board = null; graphSetPreset(cur);
  $('main').innerHTML = `<div class="page"><div class="between wrap"><h1>${ico('wave')} ${t('graph')}</h1><a class="btn soft ${cur ? '' : 'hidden'}" id="graph-topic" href="#${cur}">${ico('book')} ${t('openTopic')}</a></div><p class="muted">${t('graphLead')}</p>
  <div class="lab"><div class="card" style="padding:8px"><div id="jxg-box" class="jxgbox graph-box"></div></div><div class="card" id="g-panel"></div></div>
  <h3 style="margin-top:22px">${t('graphExamples')}</h3><div id="graph-chips">${GROUPS.map(g => `<div class="chips" data-g="${g.id}" style="margin-bottom:8px">${g.id === 'lim' ? `<button data-id="" class="${cur ? '' : 'active'}" onclick="graphPick('')">${t('graphBlank')}</button>` : ''}${TOPICS.filter(x => x.g === g.id && GRAPHS[x.id]).map(x => `<button data-id="${x.id}" class="${cur === x.id ? 'active' : ''}" onclick="graphPick('${x.id}')">${x.n}. ${esc(C(x.id).t)}</button>`).join('')}</div>`).join('')}</div>${footer()}</div>`;
  graphPanel();
  loadJXG().then(() => { if (route.id === 'graph') graphDraw(false); }).catch(() => { const b = $('jxg-box'); if (b) b.innerHTML = `<div class="desmos-wait">${t('graphFail')}</div>`; });
}

/* ---------- слайды урока ---------- */
const slideAt = {};
let slideDeck = [];
function buildSlides(tp) {
  const c = C(tp.id), g = GROUPS.find(x => x.id === tp.g), out = [];
  out.push(`<div class="sl-title"><img src="${groupPic(tp.g)}" alt=""><div><span class="pill g">${esc(groupName(tp.g))} · ${t('topicN', { n: tp.n })}</span><h2>${esc(c.t)}</h2><p>${esc(c.s)}</p></div></div>`);
  out.push(`<span class="sl-kicker">${t('slWhy')}</span><p class="sl-big">${mx(c.hook)}</p><h4 style="margin-top:22px">${t('slToday')}:</h4><ul class="objectives">${c.o.map(x => `<li>${ico('check')}<span>${mx(x)}</span></li>`).join('')}</ul>`);
  (EXTRA[tp.id] || []).forEach(([h, body]) => out.push(`<span class="sl-kicker">${t('story')}</span><h2>${h}</h2><div class="prose">${mx(body())}</div>`));
  c.th.split('<h3>').filter(x => x.trim()).forEach(p => { const i = p.indexOf('</h3>'); out.push(`<span class="sl-kicker">${esc(c.t)}</span><h2>${mx(p.slice(0, i))}</h2><div class="prose">${mx(p.slice(i + 5))}</div>`); });
  out.push(`<span class="sl-kicker">${t('slFormulas')}</span><div class="sl-formulas">${tp.f.map(x => `<div class="f">${tex(x, true)}</div>`).join('')}</div>`);
  out.push(`<span class="sl-kicker" style="color:var(--bad,#e11d48)">${t('slMistake')}</span><p class="sl-big">${ico('alert')} ${mx(c.err)}</p>`);
  const tk = getTask(tp.id + '~0', 9000);
  out.push(`<span class="sl-kicker">${t('slExample')}</span><div class="task-q sl-big">${mx(tk.q)}${tk.opts ? `<ul>${tk.opts.map(o => `<li>${mx(o)}</li>`).join('')}</ul>` : ''}</div><details class="solution"><summary>${ico('bulb')} ${t('slShow')}</summary>${stepsHtml(tk)}</details><p class="muted small">${t('slThink')} 🙂</p>`);
  out.push(`<div class="sl-title"><img src="${groupPic(tp.g)}" alt=""><div><h2>${t('slEnd')}</h2><p>${t('slEndLead')}</p><div class="row wrap" style="margin-top:14px"><button class="btn primary" onclick="slideExit('${tp.id}','practice')">${ico('pen')} ${t('toPractice')}</button>${tp.lab ? `<button class="btn" onclick="slideExit('${tp.id}','lab')">${ico('flask')} ${t('toLab')}</button>` : ''}${GRAPHS[tp.id] ? `<button class="btn" onclick="slideExit('graph','${tp.id}')">${ico('wave')} ${t('toDesmos')}</button>` : ''}</div></div></div>`);
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

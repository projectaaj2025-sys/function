/* Раунд 5, часть 2: подробные примеры к каждому уроку, простые задачи, прикладные задачи практикума. */
const DETAIL = {
  'limit-point': { q: ['Вычислите предел', 'Шекті есептеңіз', 'Evaluate the limit'], f: R`\lim_{x\to2}\dfrac{x^2-5x+6}{x-2}`, s: [
    [['Пробуем подставить $x=2$. Получается неопределённость — значит, выражение нужно преобразовать.', '$x=2$ қойып көреміз. Анықталмағандық шығады — өрнекті түрлендіру керек.', 'Try substituting $x=2$. We get an indeterminate form, so the expression must be transformed.'], R`\dfrac{4-10+6}{2-2}=\left[\dfrac00\right]`],
    [['Раскладываем числитель на множители. По теореме Виета корни: $2$ и $3$ (сумма $5$, произведение $6$).', 'Алымды көбейткіштерге жіктейміз. Виет теоремасы бойынша түбірлері: $2$ және $3$ (қосындысы $5$, көбейтіндісі $6$).', 'Factor the numerator. By Vieta the roots are $2$ and $3$ (sum $5$, product $6$).'], R`x^2-5x+6=(x-2)(x-3)`],
    [['Сокращаем дробь на $(x-2)$. Это законно: в пределе $x$ только приближается к $2$, но не равен $2$.', 'Бөлшекті $(x-2)$-ге қысқартамыз. Бұл заңды: шекте $x$ тек $2$-ге жақындайды, бірақ $2$-ге тең емес.', 'Cancel $(x-2)$. This is legal: in a limit $x$ only approaches $2$ and never equals it.'], R`\dfrac{(x-2)(x-3)}{x-2}=x-3`],
    [['Теперь подстановка проходит без помех.', 'Енді орнына қою кедергісіз өтеді.', 'Now substitution works.'], R`\lim_{x\to2}(x-3)=2-3=-1`],
    [['Проверка числом: возьмём $x=2{,}01$.', 'Санмен тексеру: $x=2{,}01$ аламыз.', 'Numeric check: take $x=2.01$.'], R`\dfrac{2{,}01^2-5\cdot2{,}01+6}{0{,}01}=\dfrac{-0{,}0099}{0{,}01}=-0{,}99\approx-1`]], a: '-1' },
  asymptotes: { q: ['Найдите асимптоты графика функции', 'Функция графигінің асимптоталарын табыңыз', 'Find the asymptotes of the graph'], f: R`y=\dfrac{x^2+1}{x-2}`, s: [
    [['Область определения: знаменатель не равен нулю.', 'Анықталу облысы: бөлім нөлге тең емес.', 'Domain: the denominator is not zero.'], R`x-2\ne0\ \Rightarrow\ x\ne2`],
    [['В точке $x=2$ числитель равен $5\\ne0$, а знаменатель стремится к нулю — функция уходит в бесконечность. Это вертикальная асимптота.', '$x=2$ нүктесінде алым $5\\ne0$, ал бөлім нөлге ұмтылады — функция шексіздікке кетеді. Бұл тік асимптота.', 'At $x=2$ the numerator is $5\\ne0$ while the denominator tends to zero — the function blows up. A vertical asymptote.'], R`\lim_{x\to2}\dfrac{x^2+1}{x-2}=\infty\ \Rightarrow\ x=2`],
    [['Степень числителя на $1$ больше степени знаменателя — ищем наклонную асимптоту $y=kx+b$. Сначала $k$.', 'Алым дәрежесі бөлім дәрежесінен $1$-ге артық — көлбеу асимптотаны $y=kx+b$ іздейміз. Алдымен $k$.', 'The numerator degree is one higher, so look for an oblique asymptote $y=kx+b$. First $k$.'], R`k=\lim_{x\to\infty}\dfrac{f(x)}{x}=\lim_{x\to\infty}\dfrac{x^2+1}{x^2-2x}=1`],
    [['Теперь $b$: вычитаем $kx$ и приводим к общему знаменателю.', 'Енді $b$: $kx$-ті азайтып, ортақ бөлімге келтіреміз.', 'Now $b$: subtract $kx$ and combine.'], R`b=\lim_{x\to\infty}\left(\dfrac{x^2+1}{x-2}-x\right)=\lim_{x\to\infty}\dfrac{2x+1}{x-2}=2`],
    [['Записываем обе асимптоты.', 'Екі асимптотаны да жазамыз.', 'Write both asymptotes.'], R`x=2,\qquad y=x+2`]], a: R`x=2,\ \ y=x+2` },
  'sequence-limit': { q: ['Вычислите предел последовательности', 'Тізбектің шегін есептеңіз', 'Find the limit of the sequence'], f: R`\lim_{n\to\infty}\dfrac{3n^2-2n+1}{6n^2+5}`, s: [
    [['Числитель и знаменатель растут неограниченно — неопределённость.', 'Алым мен бөлім шексіз өседі — анықталмағандық.', 'Both numerator and denominator grow without bound — an indeterminate form.'], R`\left[\dfrac{\infty}{\infty}\right]`],
    [['Делим числитель и знаменатель на старшую степень $n^2$.', 'Алым мен бөлімді үлкен дәреже $n^2$-қа бөлеміз.', 'Divide top and bottom by the highest power $n^2$.'], R`\dfrac{3-\dfrac2n+\dfrac1{n^2}}{6+\dfrac5{n^2}}`],
    [['При $n\\to\\infty$ дроби с $n$ в знаменателе стремятся к нулю.', '$n\\to\\infty$ болғанда бөлімінде $n$ бар бөлшектер нөлге ұмтылады.', 'As $n\\to\\infty$ every fraction with $n$ below tends to zero.'], R`\dfrac2n\to0,\quad\dfrac1{n^2}\to0,\quad\dfrac5{n^2}\to0`],
    [['Остаётся отношение старших коэффициентов.', 'Үлкен коэффициенттердің қатынасы қалады.', 'What remains is the ratio of the leading coefficients.'], R`\dfrac{3-0+0}{6+0}=\dfrac36=\dfrac12`]], a: R`\dfrac12` },
  continuity: { q: ['При каком значении $a$ функция непрерывна в точке $x=1$?', '$a$-ның қандай мәнінде функция $x=1$ нүктесінде үзіліссіз болады?', 'For which $a$ is the function continuous at $x=1$?'], f: R`f(x)=\begin{cases}x^2+1,&x\le1\\3x-a,&x>1\end{cases}`, s: [
    [['Непрерывность в точке означает: левый предел, правый предел и значение функции совпадают.', 'Нүктедегі үзіліссіздік: сол жақ шек, оң жақ шек және функция мәні тең болуы керек.', 'Continuity at a point means: left limit, right limit and the value all agree.'], R`\lim_{x\to1-0}f(x)=\lim_{x\to1+0}f(x)=f(1)`],
    [['Слева от $1$ работает формула $x^2+1$.', '$1$-дің сол жағында $x^2+1$ формуласы жұмыс істейді.', 'To the left of $1$ the formula $x^2+1$ applies.'], R`\lim_{x\to1-0}(x^2+1)=1+1=2,\qquad f(1)=2`],
    [['Справа от $1$ работает формула $3x-a$.', '$1$-дің оң жағында $3x-a$ формуласы жұмыс істейді.', 'To the right of $1$ the formula $3x-a$ applies.'], R`\lim_{x\to1+0}(3x-a)=3-a`],
    [['Приравниваем и решаем уравнение.', 'Теңестіріп, теңдеуді шешеміз.', 'Set them equal and solve.'], R`3-a=2\ \Rightarrow\ a=1`]], a: 'a=1' },
  indeterminate: { q: ['Вычислите предел', 'Шекті есептеңіз', 'Evaluate the limit'], f: R`\lim_{x\to0}\dfrac{\sin5x}{2x}`, s: [
    [['Подстановка $x=0$ даёт неопределённость. Есть синус — пользуемся первым замечательным пределом.', '$x=0$ қою анықталмағандық береді. Синус бар — бірінші тамаша шекті қолданамыз.', 'Substituting $x=0$ gives an indeterminate form. There is a sine, so use the first remarkable limit.'], R`\left[\dfrac00\right],\qquad\lim_{t\to0}\dfrac{\sin t}{t}=1`],
    [['Под синусом стоит $5x$ — значит, и в знаменателе нужно получить $5x$. Умножаем и делим на $5$.', 'Синус астында $5x$ тұр — бөлімде де $5x$ болуы керек. $5$-ке көбейтіп, бөлеміз.', 'The sine contains $5x$, so we need $5x$ below as well. Multiply and divide by $5$.'], R`\dfrac{\sin5x}{2x}=\dfrac{\sin5x}{5x}\cdot\dfrac{5x}{2x}=\dfrac{\sin5x}{5x}\cdot\dfrac52`],
    [['Первый множитель стремится к $1$ (здесь $t=5x\\to0$).', 'Бірінші көбейткіш $1$-ге ұмтылады (мұнда $t=5x\\to0$).', 'The first factor tends to $1$ (here $t=5x\\to0$).'], R`\lim_{x\to0}\dfrac{\sin5x}{5x}=1`],
    [['Перемножаем.', 'Көбейтеміз.', 'Multiply.'], R`1\cdot\dfrac52=\dfrac52=2{,}5`]], a: R`\dfrac52` },
  'derivative-def': { q: ['Найдите $f\'(3)$ по определению производной', 'Туындының анықтамасы бойынша $f\'(3)$ табыңыз', 'Find $f\'(3)$ from the definition'], f: R`f(x)=x^2`, s: [
    [['Даём аргументу приращение $\\Delta x$ и считаем новое значение функции.', 'Аргументке $\\Delta x$ өсімше беріп, функцияның жаңа мәнін есептейміз.', 'Give the argument an increment $\\Delta x$ and compute the new value.'], R`f(3+\Delta x)=(3+\Delta x)^2=9+6\Delta x+\Delta x^2`],
    [['Находим приращение функции.', 'Функция өсімшесін табамыз.', 'Find the increment of the function.'], R`\Delta f=f(3+\Delta x)-f(3)=6\Delta x+\Delta x^2`],
    [['Делим на $\\Delta x$ — это средняя скорость изменения.', '$\\Delta x$-ке бөлеміз — бұл орташа өзгеру жылдамдығы.', 'Divide by $\\Delta x$ — the average rate of change.'], R`\dfrac{\Delta f}{\Delta x}=\dfrac{6\Delta x+\Delta x^2}{\Delta x}=6+\Delta x`],
    [['Устремляем $\\Delta x$ к нулю — получаем мгновенную скорость.', '$\\Delta x$-ті нөлге ұмтылдырамыз — лездік жылдамдық шығады.', 'Let $\\Delta x\\to0$ to get the instantaneous rate.'], R`f'(3)=\lim_{\Delta x\to0}(6+\Delta x)=6`],
    [['Проверка по таблице: $(x^2)\'=2x$.', 'Кесте бойынша тексеру: $(x^2)\'=2x$.', 'Check with the table: $(x^2)\'=2x$.'], R`f'(3)=2\cdot3=6`]], a: '6' },
  differential: { q: ['Найдите дифференциал функции при $x=2$, $dx=0{,}1$ и сравните с приращением', '$x=2$, $dx=0{,}1$ болғанда функция дифференциалын тауып, өсімшемен салыстырыңыз', 'Find the differential at $x=2$, $dx=0.1$ and compare it with the increment'], f: R`y=x^3`, s: [
    [['Формула дифференциала.', 'Дифференциал формуласы.', 'The differential formula.'], R`dy=y'\,dx`],
    [['Находим производную и её значение в точке.', 'Туындыны және оның нүктедегі мәнін табамыз.', 'Differentiate and evaluate at the point.'], R`y'=3x^2,\qquad y'(2)=3\cdot4=12`],
    [['Подставляем $dx=0{,}1$.', '$dx=0{,}1$ қоямыз.', 'Substitute $dx=0.1$.'], R`dy=12\cdot0{,}1=1{,}2`],
    [['Точное приращение функции.', 'Функцияның дәл өсімшесі.', 'The exact increment.'], R`\Delta y=2{,}1^3-2^3=9{,}261-8=1{,}261`],
    [['Сравниваем: дифференциал — главная часть приращения, ошибка мала.', 'Салыстырамыз: дифференциал — өсімшенің бас бөлігі, қателік аз.', 'Compare: the differential is the main part of the increment; the error is small.'], R`\Delta y-dy=0{,}061`]], a: R`dy=1{,}2` },
  'diff-rules': { q: ['Найдите производную функции', 'Функцияның туындысын табыңыз', 'Differentiate the function'], f: R`f(x)=(2x-1)(x^2+3)`, s: [
    [['Перед нами произведение — применяем правило $(uv)\'=u\'v+uv\'$.', 'Алдымызда көбейтінді — $(uv)\'=u\'v+uv\'$ ережесін қолданамыз.', 'This is a product — use $(uv)\'=u\'v+uv\'$.'], R`u=2x-1,\qquad v=x^2+3`],
    [['Находим производные множителей.', 'Көбейткіштердің туындыларын табамыз.', 'Differentiate each factor.'], R`u'=2,\qquad v'=2x`],
    [['Подставляем в правило.', 'Ережеге қоямыз.', 'Substitute into the rule.'], R`f'(x)=2\,(x^2+3)+(2x-1)\cdot2x`],
    [['Раскрываем скобки и приводим подобные.', 'Жақшаларды ашып, ұқсас мүшелерді біріктіреміз.', 'Expand and collect like terms.'], R`f'(x)=2x^2+6+4x^2-2x=6x^2-2x+6`],
    [['Проверка: раскроем скобки заранее и продифференцируем.', 'Тексеру: жақшаларды алдын ала ашып, туынды аламыз.', 'Check: expand first, then differentiate.'], R`(2x^3-x^2+6x-3)'=6x^2-2x+6`]], a: R`6x^2-2x+6` },
  'chain-rule': { q: ['Найдите производную функции', 'Функцияның туындысын табыңыз', 'Differentiate the function'], f: R`f(x)=(3x^2-1)^5`, s: [
    [['Это сложная функция. Внешняя — «пятая степень», внутренняя — то, что в скобках.', 'Бұл — күрделі функция. Сыртқысы — «бесінші дәреже», ішкісі — жақша ішіндегі өрнек.', 'A composite function. Outer: "fifth power"; inner: the bracket.'], R`f=u^5,\qquad u=3x^2-1`],
    [['Производная внешней функции (внутреннюю не трогаем).', 'Сыртқы функцияның туындысы (ішкісіне тимейміз).', 'Derivative of the outer function (leave the inner one alone).'], R`(u^5)'=5u^4=5(3x^2-1)^4`],
    [['Производная внутренней функции.', 'Ішкі функцияның туындысы.', 'Derivative of the inner function.'], R`u'=(3x^2-1)'=6x`],
    [['Перемножаем.', 'Көбейтеміз.', 'Multiply.'], R`f'(x)=5(3x^2-1)^4\cdot6x=30x\,(3x^2-1)^4`]], a: R`30x(3x^2-1)^4` },
  'trig-derivatives': { q: ['Найдите производную функции в точке $x_0=\\dfrac{\\pi}{6}$', 'Функцияның $x_0=\\dfrac{\\pi}{6}$ нүктесіндегі туындысын табыңыз', 'Find the derivative at $x_0=\\dfrac{\\pi}{6}$'], f: R`g(x)=2\tg x+1`, s: [
    [['Производная суммы: число $2$ выносим, производная константы $1$ равна нулю.', 'Қосындының туындысы: $2$ санын шығарамыз, $1$ тұрақтысының туындысы нөл.', 'Derivative of a sum: pull out the $2$; the constant $1$ gives zero.'], R`g'(x)=2\,(\tg x)'+0`],
    [['По таблице.', 'Кесте бойынша.', 'From the table.'], R`(\tg x)'=\dfrac{1}{\cos^2x}\ \Rightarrow\ g'(x)=\dfrac{2}{\cos^2x}`],
    [['Находим косинус в точке.', 'Нүктедегі косинусты табамыз.', 'Find the cosine at the point.'], R`\cos\dfrac{\pi}{6}=\dfrac{\sqrt3}{2},\qquad\cos^2\dfrac{\pi}{6}=\dfrac34`],
    [['Подставляем.', 'Орнына қоямыз.', 'Substitute.'], R`g'\!\left(\dfrac{\pi}{6}\right)=2:\dfrac34=\dfrac83`]], a: R`\dfrac83` },
  'derivative-meaning': { q: ['Точка движется по закону $s(t)$ (м, с). Найдите скорость и ускорение; в какие моменты точка останавливается?', 'Нүкте $s(t)$ заңы бойынша қозғалады (м, с). Жылдамдық пен үдеуді табыңыз; нүкте қай мезеттерде тоқтайды?', 'A point moves by the law $s(t)$ (m, s). Find velocity and acceleration; when does the point stop?'], f: R`s(t)=t^3-6t^2+9t`, s: [
    [['Скорость — производная пути.', 'Жылдамдық — жолдың туындысы.', 'Velocity is the derivative of position.'], R`v(t)=s'(t)=3t^2-12t+9`],
    [['Ускорение — производная скорости.', 'Үдеу — жылдамдықтың туындысы.', 'Acceleration is the derivative of velocity.'], R`a(t)=v'(t)=6t-12`],
    [['Остановка — это $v=0$. Делим уравнение на $3$.', 'Тоқтау — бұл $v=0$. Теңдеуді $3$-ке бөлеміз.', 'Stopping means $v=0$. Divide by $3$.'], R`t^2-4t+3=0\ \Rightarrow\ t_1=1,\ t_2=3`],
    [['Ускорение в эти моменты: знак показывает, куда точка «развернётся».', 'Осы мезеттердегі үдеу: таңбасы нүктенің қай жаққа «бұрылатынын» көрсетеді.', 'Acceleration at those moments: the sign shows which way the point turns.'], R`a(1)=-6,\qquad a(3)=6`]], a: R`v=3t^2-12t+9,\quad a=6t-12,\quad t_1=1,\ t_2=3` },
  tangent: { q: ['Составьте уравнение касательной к графику в точке $x_0=2$', '$x_0=2$ нүктесінде графикке жүргізілген жанаманың теңдеуін құрыңыз', 'Write the tangent line at $x_0=2$'], f: R`f(x)=x^2-3x+1`, s: [
    [['Формула касательной.', 'Жанама формуласы.', 'The tangent formula.'], R`y=f(x_0)+f'(x_0)(x-x_0)`],
    [['Значение функции в точке.', 'Функцияның нүктедегі мәні.', 'The value at the point.'], R`f(2)=4-6+1=-1`],
    [['Производная и её значение в точке (угловой коэффициент).', 'Туынды және оның нүктедегі мәні (бұрыштық коэффициент).', 'The derivative and its value (the slope).'], R`f'(x)=2x-3,\qquad f'(2)=1`],
    [['Подставляем три числа в формулу и упрощаем.', 'Үш санды формулаға қойып, ықшамдаймыз.', 'Plug the three numbers in and simplify.'], R`y=-1+1\cdot(x-2)=x-3`],
    [['Проверка: касательная проходит через точку касания.', 'Тексеру: жанама жанасу нүктесі арқылы өтеді.', 'Check: the line passes through the point of tangency.'], R`y(2)=2-3=-1=f(2)`]], a: 'y=x-3' },
  monotonicity: { q: ['Найдите промежутки возрастания и убывания функции', 'Функцияның өсу және кему аралықтарын табыңыз', 'Find where the function increases and decreases'], f: R`f(x)=x^3-3x^2-9x+2`, s: [
    [['Находим производную.', 'Туындыны табамыз.', 'Differentiate.'], R`f'(x)=3x^2-6x-9`],
    [['Приравниваем к нулю и раскладываем на множители.', 'Нөлге теңестіріп, көбейткіштерге жіктейміз.', 'Set to zero and factor.'], R`3(x^2-2x-3)=3(x-3)(x+1)=0\ \Rightarrow\ x=-1,\ x=3`],
    [['Точки делят прямую на три промежутка. В каждом берём пробную точку и смотрим знак $f\'$.', 'Нүктелер түзуді үш аралыққа бөледі. Әрқайсысынан сынақ нүктесін алып, $f\'$ таңбасын қараймыз.', 'The points split the line into three intervals. Test a point in each for the sign of $f\'$.'], R`f'(-2)=15>0,\qquad f'(0)=-9<0,\qquad f'(4)=15>0`],
    [['Плюс — возрастает, минус — убывает.', 'Плюс — өседі, минус — кемиді.', 'Plus means increasing, minus decreasing.'], R`\nearrow\ (-\infty;-1],\qquad\searrow\ [-1;3],\qquad\nearrow\ [3;+\infty)`]], a: R`\nearrow(-\infty;-1]\cup[3;+\infty),\ \ \searrow[-1;3]` },
  extrema: { q: ['Найдите точки экстремума и экстремумы функции', 'Функцияның экстремум нүктелері мен экстремумдарын табыңыз', 'Find the extremum points and values'], f: R`f(x)=x^3-12x+5`, s: [
    [['Производная.', 'Туынды.', 'The derivative.'], R`f'(x)=3x^2-12=3(x-2)(x+2)`],
    [['Критические точки: $f\'(x)=0$.', 'Кризистік нүктелер: $f\'(x)=0$.', 'Critical points: $f\'(x)=0$.'], R`x=-2,\qquad x=2`],
    [['Знаки производной на промежутках.', 'Аралықтардағы туынды таңбалары.', 'Signs of the derivative.'], R`(-\infty;-2):\ +\qquad(-2;2):\ -\qquad(2;+\infty):\ +`],
    [['В точке $-2$ знак меняется с «$+$» на «$-$» — максимум; в точке $2$ с «$-$» на «$+$» — минимум.', '$-2$ нүктесінде таңба «$+$»-тен «$-$»-ке ауысады — максимум; $2$ нүктесінде «$-$»-тен «$+$»-ке — минимум.', 'At $-2$ the sign changes from $+$ to $-$: a maximum; at $2$ from $-$ to $+$: a minimum.'], R`x_{\max}=-2,\qquad x_{\min}=2`],
    [['Вычисляем значения функции.', 'Функция мәндерін есептейміз.', 'Compute the values.'], R`f(-2)=-8+24+5=21,\qquad f(2)=8-24+5=-11`]], a: R`x_{\max}=-2,\ f=21;\quad x_{\min}=2,\ f=-11` }
};
Object.assign(DETAIL, {
  convexity: { q: ['Найдите промежутки выпуклости и точку перегиба', 'Дөңестік аралықтары мен иілу нүктесін табыңыз', 'Find the intervals of convexity and the inflection point'], f: R`f(x)=x^3-6x^2+4`, s: [
    [['Первая и вторая производные.', 'Бірінші және екінші туындылар.', 'First and second derivatives.'], R`f'(x)=3x^2-12x,\qquad f''(x)=6x-12`],
    [['Нуль второй производной.', 'Екінші туындының нөлі.', 'Zero of the second derivative.'], R`6x-12=0\ \Rightarrow\ x=2`],
    [['Знаки $f\'\'$ слева и справа.', '$f\'\'$-тің сол және оң жақтағы таңбалары.', 'Signs of $f\'\'$ on both sides.'], R`f''(0)=-12<0\ (\frown),\qquad f''(3)=6>0\ (\smile)`],
    [['Знак сменился — в точке $x=2$ перегиб. Находим ординату.', 'Таңба ауысты — $x=2$ нүктесінде иілу бар. Ординатасын табамыз.', 'The sign changes, so $x=2$ is an inflection point. Find its ordinate.'], R`f(2)=8-24+4=-12`]], a: R`\frown\ (-\infty;2),\ \ \smile\ (2;+\infty),\ \ (2;-12)` },
  'max-min': { q: ['Найдите наибольшее и наименьшее значения функции на отрезке $[0;2]$', 'Функцияның $[0;2]$ кесіндісіндегі ең үлкен және ең кіші мәндерін табыңыз', 'Find the greatest and least values on $[0;2]$'], f: R`f(x)=x^3-3x`, s: [
    [['Производная и критические точки.', 'Туынды және кризистік нүктелер.', 'Derivative and critical points.'], R`f'(x)=3x^2-3=0\ \Rightarrow\ x=\pm1`],
    [['Отбираем точки, попавшие в отрезок.', 'Кесіндіге тиісті нүктелерді іріктейміз.', 'Keep only the points inside the segment.'], R`x=1\in[0;2],\qquad x=-1\notin[0;2]`],
    [['Считаем значения в критической точке и на концах отрезка.', 'Кризистік нүктедегі және кесінді ұштарындағы мәндерді есептейміз.', 'Evaluate at the critical point and at both ends.'], R`f(0)=0,\qquad f(1)=-2,\qquad f(2)=8-6=2`],
    [['Выбираем наибольшее и наименьшее из трёх чисел.', 'Үш санның ең үлкені мен ең кішісін таңдаймыз.', 'Pick the largest and the smallest.'], R`\max_{[0;2]}f=f(2)=2,\qquad\min_{[0;2]}f=f(1)=-2`]], a: R`\max=2,\ \min=-2` },
  antiderivative: { q: ['Найдите первообразную $F(x)$, график которой проходит через точку $(1;5)$', 'Графигі $(1;5)$ нүктесі арқылы өтетін $F(x)$ алғашқы функциясын табыңыз', 'Find the antiderivative $F(x)$ whose graph passes through $(1;5)$'], f: R`f(x)=6x^2-4x+3`, s: [
    [['Интегрируем каждое слагаемое по формуле степени.', 'Әр қосылғышты дәреже формуласы бойынша интегралдаймыз.', 'Integrate term by term with the power rule.'], R`F(x)=6\cdot\dfrac{x^3}{3}-4\cdot\dfrac{x^2}{2}+3x+C=2x^3-2x^2+3x+C`],
    [['Подставляем точку: $F(1)=5$.', 'Нүктені қоямыз: $F(1)=5$.', 'Use the point: $F(1)=5$.'], R`2-2+3+C=5\ \Rightarrow\ C=2`],
    [['Записываем ответ.', 'Жауапты жазамыз.', 'Write the answer.'], R`F(x)=2x^3-2x^2+3x+2`],
    [['Проверка дифференцированием.', 'Туынды алып тексеру.', 'Check by differentiating.'], R`F'(x)=6x^2-4x+3=f(x)`]], a: R`F(x)=2x^3-2x^2+3x+2` },
  substitution: { q: ['Найдите интеграл', 'Интегралды табыңыз', 'Find the integral'], f: R`\int2x\,(x^2+1)^4\,dx`, s: [
    [['Замечаем пару: функция $x^2+1$ и рядом её производная $2x$. Обозначаем функцию буквой $t$.', 'Жұпты байқаймыз: $x^2+1$ функциясы және қасында оның туындысы $2x$. Функцияны $t$ деп белгілейміз.', 'Spot the pair: the function $x^2+1$ and its derivative $2x$ next to it. Call the function $t$.'], R`t=x^2+1,\qquad dt=2x\,dx`],
    [['Переписываем интеграл через $t$.', 'Интегралды $t$ арқылы қайта жазамыз.', 'Rewrite the integral in $t$.'], R`\int t^4\,dt`],
    [['Табличный интеграл.', 'Кестелік интеграл.', 'A table integral.'], R`\int t^4\,dt=\dfrac{t^5}{5}+C`],
    [['Возвращаемся к $x$.', '$x$-ке қайта ораламыз.', 'Go back to $x$.'], R`\dfrac{(x^2+1)^5}{5}+C`],
    [['Проверка: производная ответа.', 'Тексеру: жауаптың туындысы.', 'Check: differentiate the answer.'], R`\left(\dfrac{(x^2+1)^5}{5}\right)'=\dfrac{5(x^2+1)^4\cdot2x}{5}=2x(x^2+1)^4`]], a: R`\dfrac{(x^2+1)^5}{5}+C` },
  'by-parts': { q: ['Найдите интеграл', 'Интегралды табыңыз', 'Find the integral'], f: R`\int x\,e^x\,dx`, s: [
    [['Произведение многочлена и экспоненты — интегрируем по частям. За $u$ берём то, что упрощается при дифференцировании.', 'Көпмүше мен экспонентаның көбейтіндісі — бөліктеп интегралдаймыз. $u$ ретінде туынды алғанда қарапайымданатынды аламыз.', 'A polynomial times an exponential — integrate by parts. Take as $u$ what simplifies when differentiated.'], R`u=x,\qquad dv=e^x\,dx`],
    [['Находим $du$ и $v$.', '$du$ мен $v$-ны табамыз.', 'Find $du$ and $v$.'], R`du=dx,\qquad v=e^x`],
    [['Формула $\\int u\\,dv=uv-\\int v\\,du$.', '$\\int u\\,dv=uv-\\int v\\,du$ формуласы.', 'The formula $\\int u\\,dv=uv-\\int v\\,du$.'], R`\int x\,e^x\,dx=x\,e^x-\int e^x\,dx`],
    [['Оставшийся интеграл — табличный.', 'Қалған интеграл — кестелік.', 'The remaining integral is a table one.'], R`x\,e^x-e^x+C=e^x(x-1)+C`],
    [['Проверка.', 'Тексеру.', 'Check.'], R`\big(e^x(x-1)\big)'=e^x(x-1)+e^x=x\,e^x`]], a: R`e^x(x-1)+C` },
  'definite-integral': { q: ['Вычислите интеграл', 'Интегралды есептеңіз', 'Evaluate the integral'], f: R`\int_1^3(3x^2-2x)\,dx`, s: [
    [['Находим первообразную (без $C$ — она всё равно сократится).', 'Алғашқы функцияны табамыз ($C$-сыз — ол бәрібір қысқарады).', 'Find an antiderivative (no $C$ — it cancels anyway).'], R`F(x)=x^3-x^2`],
    [['Формула Ньютона — Лейбница.', 'Ньютон — Лейбниц формуласы.', 'The Newton–Leibniz formula.'], R`\int_1^3(3x^2-2x)\,dx=\big(x^3-x^2\big)\Big|_1^3=F(3)-F(1)`],
    [['Подставляем верхний предел.', 'Жоғарғы шекті қоямыз.', 'Plug in the upper limit.'], R`F(3)=27-9=18`],
    [['Подставляем нижний предел.', 'Төменгі шекті қоямыз.', 'Plug in the lower limit.'], R`F(1)=1-1=0`],
    [['Вычитаем.', 'Азайтамыз.', 'Subtract.'], R`18-0=18`]], a: '18' },
  area: { q: ['Вычислите площадь фигуры, ограниченной линиями (задача из презентации к уроку)', 'Мына сызықтармен шектелген фигураның ауданын есептеңіз (сабақ презентациясындағы есеп)', 'Find the area bounded by the lines (a task from the lesson slides)'], f: R`y=x,\quad y=5-x,\quad x=1,\quad x=2`, s: [
    [['Выясняем, какой график выше на отрезке $[1;2]$: подставим $x=1$. Выше прямая $y=5-x$.', '$[1;2]$ кесіндісінде қай график жоғары екенін анықтаймыз: $x=1$ қоямыз. $y=5-x$ түзуі жоғары.', 'Find which graph is on top on $[1;2]$: try $x=1$. The line $y=5-x$ is on top.'], R`5-1=4>1`],
    [['Площадь — интеграл от разности «верхняя минус нижняя».', 'Аудан — «жоғарғы минус төменгі» айырмасының интегралы.', 'The area is the integral of "top minus bottom".'], R`S=\int_1^2\big((5-x)-x\big)\,dx=\int_1^2(5-2x)\,dx`],
    [['Первообразная.', 'Алғашқы функция.', 'Antiderivative.'], R`\big(5x-x^2\big)\Big|_1^2`],
    [['Подставляем пределы.', 'Шектерді қоямыз.', 'Plug in the limits.'], R`(10-4)-(5-1)=6-4=2`],
    [['Проверка геометрией: фигура — трапеция с основаниями $3$ и $1$ и высотой $1$.', 'Геометриямен тексеру: фигура — табандары $3$ және $1$, биіктігі $1$ трапеция.', 'Geometric check: a trapezoid with bases $3$ and $1$ and height $1$.'], R`S=\dfrac{3+1}{2}\cdot1=2`]], a: '2' },
  volume: { q: ['Найдите объём тела, полученного вращением вокруг оси $Ox$ фигуры, ограниченной линиями', 'Мына сызықтармен шектелген фигураны $Ox$ осінен айналдырғанда шыққан дененің көлемін табыңыз', 'Find the volume of the solid obtained by rotating about the $x$-axis the region bounded by'], f: R`y=\sqrt x,\quad y=0,\quad x=4`, s: [
    [['Формула объёма тела вращения.', 'Айналу денесі көлемінің формуласы.', 'Volume of a solid of revolution.'], R`V=\pi\int_a^bf^2(x)\,dx`],
    [['Пределы интегрирования: от $0$ до $4$. Возводим функцию в квадрат.', 'Интегралдау шектері: $0$-ден $4$-ке дейін. Функцияны квадраттаймыз.', 'Limits: from $0$ to $4$. Square the function.'], R`f^2(x)=(\sqrt x)^2=x`],
    [['Интегрируем.', 'Интегралдаймыз.', 'Integrate.'], R`V=\pi\int_0^4x\,dx=\pi\cdot\dfrac{x^2}{2}\Big|_0^4`],
    [['Подставляем пределы.', 'Шектерді қоямыз.', 'Plug in the limits.'], R`V=\pi\left(\dfrac{16}{2}-0\right)=8\pi\approx25{,}1`]], a: R`8\pi` },
  'physics-integral': { q: ['Скорость тела $v(t)$ (м/с). Найдите путь (в метрах), пройденный за время от $t=1$ до $t=3$ с', 'Дене жылдамдығы $v(t)$ (м/с). $t=1$-ден $t=3$ с-қа дейінгі жүрілген жолды (метрмен) табыңыз', 'The velocity is $v(t)$ (m/s). Find the distance (in metres) travelled from $t=1$ to $t=3$ s'], f: R`v(t)=3t^2+2`, s: [
    [['Путь — интеграл от скорости по времени.', 'Жол — жылдамдықтың уақыт бойынша интегралы.', 'Distance is the integral of velocity over time.'], R`s=\int_1^3v(t)\,dt=\int_1^3(3t^2+2)\,dt`],
    [['Первообразная.', 'Алғашқы функция.', 'Antiderivative.'], R`\big(t^3+2t\big)\Big|_1^3`],
    [['Подставляем верхний и нижний пределы.', 'Жоғарғы және төменгі шектерді қоямыз.', 'Plug in the upper and lower limits.'], R`(27+6)-(1+2)=33-3=30`]], a: '30' },
  'de-basics': { q: ['Проверьте, что функция $y=Ce^{2x}$ — решение уравнения, и найдите решение с условием $y(0)=3$', '$y=Ce^{2x}$ функциясы теңдеудің шешімі екенін тексеріп, $y(0)=3$ шартын қанағаттандыратын шешімді табыңыз', 'Verify that $y=Ce^{2x}$ solves the equation and find the solution with $y(0)=3$'], f: R`y'=2y`, s: [
    [['Находим производную предложенной функции.', 'Ұсынылған функцияның туындысын табамыз.', 'Differentiate the proposed function.'], R`y'=\big(Ce^{2x}\big)'=2Ce^{2x}`],
    [['Подставляем в уравнение: слева $y\'$, справа $2y$.', 'Теңдеуге қоямыз: сол жақта $y\'$, оң жақта $2y$.', 'Substitute: $y\'$ on the left, $2y$ on the right.'], R`2Ce^{2x}=2\cdot Ce^{2x}`],
    [['Получили верное равенство при любом $C$ — это общее решение.', 'Кез келген $C$ үшін тура теңдік шықты — бұл жалпы шешім.', 'True for every $C$ — this is the general solution.'], R`y=Ce^{2x}`],
    [['Начальное условие выбирает одну кривую из семейства.', 'Бастапқы шарт үйірден бір қисықты таңдайды.', 'The initial condition picks one curve from the family.'], R`y(0)=Ce^0=C=3`],
    [['Частное решение.', 'Дербес шешім.', 'The particular solution.'], R`y=3e^{2x}`]], a: R`y=3e^{2x}` },
  separable: { q: ['Решите задачу Коши', 'Коши есебін шешіңіз', 'Solve the initial value problem'], f: R`y'=2xy,\qquad y(0)=1`, s: [
    [['Записываем $y\'$ как $\\dfrac{dy}{dx}$.', '$y\'$-ті $\\dfrac{dy}{dx}$ түрінде жазамыз.', 'Write $y\'$ as $\\dfrac{dy}{dx}$.'], R`\dfrac{dy}{dx}=2xy`],
    [['Разделяем переменные: игреки налево, иксы направо.', 'Айнымалыларды ажыратамыз: игректер солға, икстер оңға.', 'Separate variables: y\'s left, x\'s right.'], R`\dfrac{dy}{y}=2x\,dx`],
    [['Интегрируем обе части.', 'Екі жағын да интегралдаймыз.', 'Integrate both sides.'], R`\ln|y|=x^2+C_1`],
    [['Выражаем $y$ (здесь $C=\\pm e^{C_1}$).', '$y$-ті өрнектейміз (мұнда $C=\\pm e^{C_1}$).', 'Solve for $y$ (here $C=\\pm e^{C_1}$).'], R`y=Ce^{x^2}`],
    [['Начальное условие.', 'Бастапқы шарт.', 'Initial condition.'], R`y(0)=C\cdot e^0=C=1\ \Rightarrow\ y=e^{x^2}`],
    [['Проверка.', 'Тексеру.', 'Check.'], R`y'=2x\,e^{x^2}=2xy`]], a: R`y=e^{x^2}` },
  'second-order': { q: ['Решите задачу Коши', 'Коши есебін шешіңіз', 'Solve the initial value problem'], f: R`y''-5y'+6y=0,\qquad y(0)=1,\quad y'(0)=0`, s: [
    [['Характеристическое уравнение.', 'Сипаттаушы теңдеу.', 'The characteristic equation.'], R`k^2-5k+6=0`],
    [['Корни (по теореме Виета).', 'Түбірлері (Виет теоремасы бойынша).', 'Roots (by Vieta).'], R`k_1=2,\qquad k_2=3`],
    [['Корни действительные и разные — общее решение из двух экспонент.', 'Түбірлер нақты және әртүрлі — жалпы шешім екі экспонентадан тұрады.', 'Real distinct roots — the general solution has two exponentials.'], R`y=C_1e^{2x}+C_2e^{3x}`],
    [['Первое условие: $y(0)=1$.', 'Бірінші шарт: $y(0)=1$.', 'First condition: $y(0)=1$.'], R`C_1+C_2=1`],
    [['Второе условие: сначала производная, потом $x=0$.', 'Екінші шарт: алдымен туынды, сосын $x=0$.', 'Second condition: differentiate, then set $x=0$.'], R`y'=2C_1e^{2x}+3C_2e^{3x},\qquad2C_1+3C_2=0`],
    [['Решаем систему.', 'Жүйені шешеміз.', 'Solve the system.'], R`C_2=-2,\quad C_1=3\ \Rightarrow\ y=3e^{2x}-2e^{3x}`]], a: R`y=3e^{2x}-2e^{3x}` },
  harmonic: { q: ['Решите уравнение колебаний с начальными условиями', 'Тербеліс теңдеуін бастапқы шарттарымен шешіңіз', 'Solve the oscillation equation with initial conditions'], f: R`y''+4y=0,\qquad y(0)=3,\quad y'(0)=4`, s: [
    [['Сравниваем с $y\'\'+\\omega^2y=0$.', '$y\'\'+\\omega^2y=0$ теңдеуімен салыстырамыз.', 'Compare with $y\'\'+\\omega^2y=0$.'], R`\omega^2=4\ \Rightarrow\ \omega=2`],
    [['Общее решение.', 'Жалпы шешім.', 'General solution.'], R`y=C_1\cos2x+C_2\sin2x`],
    [['Условие $y(0)=3$: $\\cos0=1$, $\\sin0=0$.', '$y(0)=3$ шарты: $\\cos0=1$, $\\sin0=0$.', 'Condition $y(0)=3$: $\\cos0=1$, $\\sin0=0$.'], R`C_1=3`],
    [['Производная и условие $y\'(0)=4$.', 'Туынды және $y\'(0)=4$ шарты.', 'The derivative and the condition $y\'(0)=4$.'], R`y'=-2C_1\sin2x+2C_2\cos2x,\qquad2C_2=4\ \Rightarrow\ C_2=2`],
    [['Ответ и амплитуда колебаний.', 'Жауап және тербеліс амплитудасы.', 'The answer and the amplitude.'], R`y=3\cos2x+2\sin2x,\qquad A=\sqrt{3^2+2^2}=\sqrt{13}`]], a: R`y=3\cos2x+2\sin2x` }
});
const enNum = s => LANG === 'en' ? s.replace(/\{,\}/g, '.') : s;
function detailHtml(id, bare) {
  const d = DETAIL[id]; if (!d) return '';
  const ex = tr(['Пример', 'Мысал', 'Example']);
  return `<div class="detail">${bare ? '' : `<h3>${ico('pen')} ${t('detailT')}</h3>`}<div class="detail-q"><b>${ex}.</b> ${mx(tr(d.q))}${tex(fx(enNum(d.f)), true)}</div><p class="detail-sol"><b>${t('solution')}.</b></p>
   <ol class="steps">${d.s.map((s, i) => `<li><span class="step-n">${t('stepN')} ${i + 1}.</span> ${mx(tr(s[0]))}${tex(fx(enNum(s[1])), true)}</li>`).join('')}</ol><div class="final">${t('answer')}: ${tex(fx(enNum(d.a)))}</div></div>`;
}

/* ---------- простые задачи (уровень 1) — в начало каждой темы ---------- */
const easy = (id, g) => GEN[id].unshift(g);
easy('limit-point', r => { const a = r.int(1, 9);
  return { q: qLim(R`\lim_{x\to ${a}}\dfrac{x^2-${a * a}}{x-${a}}`), a: 2 * a, lvl: 1, hint: L('Разложите числитель как разность квадратов.', 'Алымды квадраттар айырмасы ретінде жіктеңіз.', 'Factor the numerator as a difference of squares.'),
    steps: [L(`Подстановка $x=${a}$ даёт $\\dfrac00$ — нужно преобразовать.`, `$x=${a}$ қойсақ $\\dfrac00$ шығады — түрлендіру керек.`, `Substituting $x=${a}$ gives $\\dfrac00$ — transform first.`), `${W.factor}: $x^2-${a * a}=(x-${a})(x+${a})$.`, `${W.cancel}: $\\dfrac{(x-${a})(x+${a})}{x-${a}}=x+${a}$.`, `${W.sub}: $${a}+${a}=${2 * a}$.`] }; });
easy('asymptotes', r => { const c = r.nz(-7, 7), a = r.nz(-5, 5), b = r.int(1, 9); need(a * c + b !== 0); const f = `y=\\dfrac{${poly([a, b])}}{x${sg(-c)}}`;
  return { q: L(`Найдите вертикальную асимптоту графика функции $${f}$. В ответ запишите число $x$.`, `$${f}$ функциясы графигінің тік асимптотасын табыңыз. Жауапқа $x$ санын жазыңыз.`, `Find the vertical asymptote of $${f}$. Enter the number $x$.`), a: c, lvl: 1,
    hint: L('Вертикальная асимптота там, где знаменатель равен нулю, а числитель — нет.', 'Тік асимптота бөлім нөлге тең, ал алым нөлге тең емес жерде болады.', 'A vertical asymptote is where the denominator is zero and the numerator is not.'),
    steps: [L(`Приравниваем знаменатель к нулю: $x${sg(-c)}=0$, откуда $x=${c}$.`, `Бөлімді нөлге теңестіреміз: $x${sg(-c)}=0$, бұдан $x=${c}$.`, `Set the denominator to zero: $x${sg(-c)}=0$, so $x=${c}$.`), L(`Числитель в этой точке: $${nt(a * c + b)}\\ne0$, значит, функция уходит в бесконечность. Асимптота: $x=${c}$.`, `Осы нүктедегі алым: $${nt(a * c + b)}\\ne0$, демек функция шексіздікке кетеді. Асимптота: $x=${c}$.`, `The numerator there is $${nt(a * c + b)}\\ne0$, so the function blows up. Asymptote: $x=${c}$.`)] }; });
easy('sequence-limit', r => { const c = r.int(2, 5), q = r.nz(-4, 4), b = r.int(1, 9), d = r.int(1, 9), fr2 = `\\dfrac{${c * q}+\\frac{${b}}{n}}{${c}+\\frac{${d}}{n}}`;
  return { q: qLim(R`\lim_{n\to\infty}\dfrac{${poly([c * q, b], 'n')}}{${poly([c, d], 'n')}}`), a: q, lvl: 1, hint: L('Разделите числитель и знаменатель на $n$.', 'Алым мен бөлімді $n$-ге бөліңіз.', 'Divide top and bottom by $n$.'),
    steps: [L(`Делим числитель и знаменатель на $n$: $${fr2}$.`, `Алым мен бөлімді $n$-ге бөлеміз: $${fr2}$.`, `Divide by $n$: $${fr2}$.`), L(`Дроби с $n$ в знаменателе стремятся к нулю. Остаётся $\\dfrac{${c * q}}{${c}}=${q}$.`, `Бөлімінде $n$ бар бөлшектер нөлге ұмтылады. $\\dfrac{${c * q}}{${c}}=${q}$ қалады.`, `Fractions with $n$ below tend to zero. What remains is $\\dfrac{${c * q}}{${c}}=${q}$.`)] }; });
easy('continuity', r => { const c = r.nz(-8, 8), p = r.int(1, 9), f = `f(x)=\\dfrac{${p}}{x${sg(-c)}}`;
  return { q: L(`В какой точке функция $${f}$ имеет разрыв?`, `$${f}$ функциясының үзіліс нүктесін табыңыз.`, `At which point is $${f}$ discontinuous?`), a: c, lvl: 1,
    hint: L('Функция не определена там, где знаменатель равен нулю.', 'Бөлім нөлге тең жерде функция анықталмаған.', 'The function is undefined where the denominator is zero.'),
    steps: [L(`Дробь не существует, когда знаменатель равен нулю: $x${sg(-c)}=0$.`, `Бөлім нөлге тең болғанда бөлшек болмайды: $x${sg(-c)}=0$.`, `The fraction does not exist when the denominator is zero: $x${sg(-c)}=0$.`), L(`Отсюда $x=${c}$. В этой точке функция не определена — график разрывается.`, `Бұдан $x=${c}$. Бұл нүктеде функция анықталмаған — график үзіледі.`, `So $x=${c}$. The function is undefined there — the graph breaks.`)] }; });
easy('indeterminate', r => { const k = r.int(2, 9), e = `\\dfrac{\\sin ${k}x}{x}=${k}\\cdot\\dfrac{\\sin ${k}x}{${k}x}`;
  return { q: qLim(R`\lim_{x\to0}\dfrac{\sin ${k}x}{x}`), a: k, lvl: 1, hint: L(`Умножьте и разделите на $${k}$, чтобы получить $\\dfrac{\\sin t}{t}$.`, `$\\dfrac{\\sin t}{t}$ шығу үшін $${k}$-ге көбейтіп, бөліңіз.`, `Multiply and divide by $${k}$ to get $\\dfrac{\\sin t}{t}$.`),
    steps: [L(`Первый замечательный предел: $\\lim\\limits_{t\\to0}\\dfrac{\\sin t}{t}=1$.`, `Бірінші тамаша шек: $\\lim\\limits_{t\\to0}\\dfrac{\\sin t}{t}=1$.`, `The first remarkable limit: $\\lim\\limits_{t\\to0}\\dfrac{\\sin t}{t}=1$.`), L(`Умножаем и делим на $${k}$: $${e}$.`, `$${k}$-ге көбейтіп, бөлеміз: $${e}$.`, `Multiply and divide by $${k}$: $${e}$.`), L(`Дробь стремится к $1$, поэтому предел равен $${k}\\cdot1=${k}$.`, `Бөлшек $1$-ге ұмтылады, сондықтан шек $${k}\\cdot1=${k}$.`, `The fraction tends to $1$, so the limit is $${k}\\cdot1=${k}$.`)] }; });
easy('second-limit', r => { const k = r.int(2, 9), lim = `\\lim\\limits_{x\\to\\infty}\\left(1+\\dfrac{${k}}{x}\\right)^{x}=e^{p}`, e = `\\left[\\left(1+\\dfrac{${k}}{x}\\right)^{x/${k}}\\right]^{${k}}\\to e^{${k}}`;
  return { q: L(`Известно, что $${lim}$. Найдите $p$.`, `$${lim}$ екені белгілі. $p$-ны табыңыз.`, `It is known that $${lim}$. Find $p$.`), a: k, lvl: 1,
    hint: '$\\lim\\limits_{x\\to\\infty}\\left(1+\\dfrac kx\\right)^{x}=e^{k}$',
    steps: [L(`Нужна форма $(1+\\square)^{1/\\square}$. Здесь $\\square=\\dfrac{${k}}{x}$, обратная величина — $\\dfrac{x}{${k}}$.`, `$(1+\\square)^{1/\\square}$ түрі керек. Мұнда $\\square=\\dfrac{${k}}{x}$, кері шамасы — $\\dfrac{x}{${k}}$.`, `We need the form $(1+\\square)^{1/\\square}$. Here $\\square=\\dfrac{${k}}{x}$ and its reciprocal is $\\dfrac{x}{${k}}$.`), L(`Переписываем показатель: $x=\\dfrac{x}{${k}}\\cdot${k}$. Тогда $${e}$.`, `Дәреже көрсеткішін қайта жазамыз: $x=\\dfrac{x}{${k}}\\cdot${k}$. Сонда $${e}$.`, `Rewrite the exponent: $x=\\dfrac{x}{${k}}\\cdot${k}$. Then $${e}$.`), `${W.so}: $p=${k}$.`] }; });
easy('derivative-def', r => { const a = r.int(1, 5), b = a + r.int(1, 4), d = b * b - a * a;
  return { q: L(`Найдите среднюю скорость изменения функции $f(x)=x^2$ на отрезке $[${a};${b}]$.`, `$f(x)=x^2$ функциясының $[${a};${b}]$ кесіндісіндегі орташа өзгеру жылдамдығын табыңыз.`, `Find the average rate of change of $f(x)=x^2$ on $[${a};${b}]$.`), a: a + b, lvl: 1,
    hint: '$\\dfrac{\\Delta f}{\\Delta x}=\\dfrac{f(b)-f(a)}{b-a}$',
    steps: [L(`Приращение функции: $\\Delta f=f(${b})-f(${a})=${b * b}-${a * a}=${d}$.`, `Функция өсімшесі: $\\Delta f=f(${b})-f(${a})=${b * b}-${a * a}=${d}$.`, `Increment of the function: $\\Delta f=f(${b})-f(${a})=${b * b}-${a * a}=${d}$.`), L(`Приращение аргумента: $\\Delta x=${b}-${a}=${b - a}$.`, `Аргумент өсімшесі: $\\Delta x=${b}-${a}=${b - a}$.`, `Increment of the argument: $\\Delta x=${b}-${a}=${b - a}$.`), `${W.calc}: $\\dfrac{\\Delta f}{\\Delta x}=\\dfrac{${d}}{${b - a}}=${a + b}$.`] }; });
easy('differential', r => { const a = r.int(1, 9);
  return { q: L(`Найдите дифференциал функции $y=x^2$ при $x=${a}$ и $dx=${dec(0.1)}$.`, `$y=x^2$ функциясының $x=${a}$, $dx=${dec(0.1)}$ болғандағы дифференциалын табыңыз.`, `Find the differential of $y=x^2$ at $x=${a}$ with $dx=${dec(0.1)}$.`), a: 0.2 * a, lvl: 1, hint: '$dy=y\'\\,dx$',
    steps: [`${W.der}: $y'=2x$, $y'(${a})=${2 * a}$.`, `${W.calc}: $dy=y'\\,dx=${2 * a}\\cdot${dec(0.1)}=${dec(0.2 * a)}$.`] }; });
easy('diff-rules', r => { const a = r.nz(-4, 4), b = r.nz(-9, 9), c = r.int(-9, 9);
  return { q: qFind("$f'(1)$", `$f(x)=${poly([a, 0, b, c])}$`), a: 3 * a + b, lvl: 1, hint: L('$(x^n)\'=nx^{n-1}$, производная числа равна нулю.', '$(x^n)\'=nx^{n-1}$, санның туындысы нөлге тең.', '$(x^n)\'=nx^{n-1}$; the derivative of a number is zero.'),
    steps: [`${W.der}: $f'(x)=${poly([3 * a, 0, b])}$.`, `${W.sub} $x=1$: $f'(1)=${3 * a}${sg(b)}=${3 * a + b}$.`] }; });
easy('chain-rule', r => { const a = r.int(2, 5), b = r.nz(-5, 5), u = poly([a, b]);
  return { q: qFind("$f'(0)$", `$f(x)=(${u})^2$`), a: 2 * a * b, lvl: 1, hint: L('Внешняя функция — квадрат, внутренняя — скобка: $(u^2)\'=2u\\cdot u\'$.', 'Сыртқы функция — квадрат, ішкісі — жақша: $(u^2)\'=2u\\cdot u\'$.', 'Outer: square; inner: the bracket: $(u^2)\'=2u\\cdot u\'$.'),
    steps: [L(`Внутренняя функция $u=${u}$, её производная $u'=${a}$.`, `Ішкі функция $u=${u}$, туындысы $u'=${a}$.`, `Inner function $u=${u}$, its derivative $u'=${a}$.`), `${W.rule}: $f'(x)=2u\\cdot u'=2(${u})\\cdot${a}$.`, `${W.sub} $x=0$: $2\\cdot${par(b)}\\cdot${a}=${2 * a * b}$.`] }; });
easy('trig-derivatives', r => { const a = r.nz(-9, 9), b = r.nz(-9, 9);
  return { q: qFind("$f'(0)$", `$f(x)=${co(a, '\\sin x')}${b < 0 ? ' - ' : ' + '}${co(Math.abs(b), '\\cos x')}$`), a, lvl: 1, hint: '$(\\sin x)\'=\\cos x,\\quad(\\cos x)\'=-\\sin x$',
    steps: [`${W.der}: $f'(x)=${co(a, '\\cos x')}${-b < 0 ? ' - ' : ' + '}${co(Math.abs(b), '\\sin x')}$.`, `${W.sub} $x=0$: $\\cos0=1$, $\\sin0=0$, $f'(0)=${a}$.`] }; });
easy('derivative-meaning', r => { const a = r.int(1, 5), b = r.int(1, 9), t0 = r.int(1, 5), s = poly([a, b, 0], 't'), v = poly([2 * a, b], 't');
  return { q: L(`Тело движется по закону $s(t)=${s}$ (м). Найдите его скорость в момент $t=${t0}$ с.`, `Дене $s(t)=${s}$ (м) заңы бойынша қозғалады. $t=${t0}$ с мезетіндегі жылдамдығын табыңыз.`, `A body moves by $s(t)=${s}$ (m). Find its velocity at $t=${t0}$ s.`), a: 2 * a * t0 + b, lvl: 1, unit: L('м/с', 'м/с', 'm/s'),
    hint: L('Скорость — производная пути: $v(t)=s\'(t)$.', 'Жылдамдық — жолдың туындысы: $v(t)=s\'(t)$.', 'Velocity is the derivative of position: $v(t)=s\'(t)$.'),
    steps: [L(`Скорость — производная пути: $v(t)=s'(t)=${v}$.`, `Жылдамдық — жолдың туындысы: $v(t)=s'(t)=${v}$.`, `Velocity is the derivative of position: $v(t)=s'(t)=${v}$.`), `${W.sub} $t=${t0}$: $v=${2 * a}\\cdot${t0}+${b}=${2 * a * t0 + b}$.`] }; });
easy('tangent', r => { const b = r.nz(-6, 6), x0 = r.int(-4, 4), f = poly([1, b, 0]);
  return { q: L(`Найдите угловой коэффициент касательной к графику $y=${f}$ в точке $x_0=${x0}$.`, `$y=${f}$ графигіне $x_0=${x0}$ нүктесінде жүргізілген жанаманың бұрыштық коэффициентін табыңыз.`, `Find the slope of the tangent to $y=${f}$ at $x_0=${x0}$.`), a: 2 * x0 + b, lvl: 1,
    hint: L('Угловой коэффициент касательной равен $f\'(x_0)$.', 'Жанаманың бұрыштық коэффициенті $f\'(x_0)$-ге тең.', 'The slope of the tangent equals $f\'(x_0)$.'),
    steps: [`${W.der}: $y'=${poly([2, b])}$.`, `${W.atPoint} $x_0=${x0}$: $k=2\\cdot${par(x0)}${sg(b)}=${2 * x0 + b}$.`] }; });
easy('monotonicity', r => { const a = r.nz(-6, 6), c = r.int(-9, 9), f = poly([1, -2 * a, c]), d = poly([2, -2 * a]);
  return { q: L(`Функция $f(x)=${f}$ возрастает на промежутке $[p;+\\infty)$. Найдите $p$.`, `$f(x)=${f}$ функциясы $[p;+\\infty)$ аралығында өседі. $p$-ны табыңыз.`, `The function $f(x)=${f}$ increases on $[p;+\\infty)$. Find $p$.`), a, lvl: 1,
    hint: L('Функция возрастает там, где $f\'(x)\\ge0$.', '$f\'(x)\\ge0$ болатын жерде функция өседі.', 'A function increases where $f\'(x)\\ge0$.'),
    steps: [`${W.der}: $f'(x)=${d}$.`, L(`Решаем неравенство $${d}\\ge0$: $x\\ge${a}$.`, `$${d}\\ge0$ теңсіздігін шешеміз: $x\\ge${a}$.`, `Solve $${d}\\ge0$: $x\\ge${a}$.`), `${W.so}: $p=${a}$.`] }; });
easy('extrema', r => { const a = r.nz(-6, 6), c = r.int(-9, 9), f = poly([-1, 2 * a, c]), d = poly([-2, 2 * a]);
  return { q: L(`Найдите точку максимума функции $f(x)=${f}$.`, `$f(x)=${f}$ функциясының максимум нүктесін табыңыз.`, `Find the point of maximum of $f(x)=${f}$.`), a, lvl: 1,
    hint: L('Приравняйте производную к нулю.', 'Туындыны нөлге теңестіріңіз.', 'Set the derivative equal to zero.'),
    steps: [`${W.der}: $f'(x)=${d}$.`, `${W.zero}: $${d}=0$, $x=${a}$.`, L(`Слева от $${a}$ производная положительна, справа отрицательна: «$+$» сменяется на «$-$» — это максимум.`, `$${a}$-ның сол жағында туынды оң, оң жағында теріс: «$+$» «$-$»-ке ауысады — бұл максимум.`, `To the left of $${a}$ the derivative is positive, to the right negative: $+$ changes to $-$ — a maximum.`)] }; });
easy('convexity', r => { const a = r.nz(-5, 5), b = r.nz(-9, 9);
  return { q: qFind("$f''(1)$", `$f(x)=${poly([a, 0, b, 0])}$`), a: 6 * a, lvl: 1, hint: L('Вторая производная — производная от производной.', 'Екінші туынды — туындының туындысы.', 'The second derivative is the derivative of the derivative.'),
    steps: [`${W.der}: $f'(x)=${poly([3 * a, 0, b])}$.`, L(`Ещё раз: $f''(x)=${6 * a}x$.`, `Тағы бір рет: $f''(x)=${6 * a}x$.`, `Once more: $f''(x)=${6 * a}x$.`), L(`$f''(1)=${6 * a}$. ${a > 0 ? 'Знак «+» — в этой точке график выпуклый вниз (улыбка).' : 'Знак «−» — в этой точке график выпуклый вверх (грусть).'}`, `$f''(1)=${6 * a}$. ${a > 0 ? '«+» таңбасы — бұл нүктеде график төмен дөңес (күлкі).' : '«−» таңбасы — бұл нүктеде график жоғары дөңес (мұң).'}`, `$f''(1)=${6 * a}$. ${a > 0 ? 'A plus sign: the graph is convex down (a smile) there.' : 'A minus sign: the graph is convex up (a frown) there.'}`)] }; });
easy('max-min', r => { const a = r.int(-4, 4), mn = r.int(-9, 9), f = poly([1, -2 * a, a * a + mn]), seg = `[${a - 2};${a + 3}]`;
  return { q: L(`Найдите наименьшее значение функции $f(x)=${f}$ на отрезке $${seg}$.`, `$f(x)=${f}$ функциясының $${seg}$ кесіндісіндегі ең кіші мәнін табыңыз.`, `Find the least value of $f(x)=${f}$ on $${seg}$.`), a: mn, lvl: 1,
    hint: L('Сравните значения в критической точке и на концах отрезка.', 'Кризистік нүктедегі және кесінді ұштарындағы мәндерді салыстырыңыз.', 'Compare the values at the critical point and at the ends.'),
    steps: [`${W.der}: $f'(x)=${poly([2, -2 * a])}$; $f'(x)=0$: $x=${a}$.`, `${W.ends}: $f(${a - 2})=${mn + 4}$, $f(${a + 3})=${mn + 9}$; $f(${a})=${mn}$.`, L(`Наименьшее из трёх чисел: $${mn}$.`, `Үш санның ең кішісі: $${mn}$.`, `The smallest of the three: $${mn}$.`)] }; });
easy('antiderivative', r => { const a = r.int(1, 6), b = r.nz(-9, 9), c = r.int(-9, 9), f = poly([2 * a, b]);
  return { q: L(`Известно, что $F'(x)=${f}$ и $F(0)=${c}$. Найдите $F(1)$.`, `$F'(x)=${f}$ және $F(0)=${c}$ екені белгілі. $F(1)$-ді табыңыз.`, `Given $F'(x)=${f}$ and $F(0)=${c}$, find $F(1)$.`), a: a + b + c, lvl: 1,
    hint: L('Найдите первообразную с $+C$, затем $C$ из условия.', 'Алғашқы функцияны $+C$-мен тауып, $C$-ны шарттан анықтаңыз.', 'Find the antiderivative with $+C$, then get $C$ from the condition.'),
    steps: [`${W.anti}: $F(x)=${poly([a, b, 0])}+C$.`, L(`Из условия $F(0)=${c}$: $C=${c}$.`, `$F(0)=${c}$ шартынан: $C=${c}$.`, `From $F(0)=${c}$: $C=${c}$.`), `${W.sub} $x=1$: $F(1)=${a}${sg(b)}${sg(c)}=${a + b + c}$.`] }; });
easy('substitution', r => { const c = r.int(1, 9), I = `$$\\int_0^1 2x\\,(x^2+${c})\\,dx$$`;
  return { q: L(`Вычислите интеграл заменой $t=x^2+${c}$: ${I}`, `Интегралды $t=x^2+${c}$ алмастыруымен есептеңіз: ${I}`, `Evaluate using $t=x^2+${c}$: ${I}`), a: c + 0.5, lvl: 1,
    hint: L('$dt=2x\\,dx$; не забудьте пересчитать пределы.', '$dt=2x\\,dx$; шектерді қайта есептеуді ұмытпаңыз.', '$dt=2x\\,dx$; remember to change the limits.'),
    steps: [L(`Замена: $t=x^2+${c}$, $dt=2x\\,dx$.`, `Алмастыру: $t=x^2+${c}$, $dt=2x\\,dx$.`, `Substitution: $t=x^2+${c}$, $dt=2x\\,dx$.`), L(`Новые пределы: при $x=0$ $t=${c}$, при $x=1$ $t=${c + 1}$.`, `Жаңа шектер: $x=0$ болғанда $t=${c}$, $x=1$ болғанда $t=${c + 1}$.`, `New limits: $x=0$ gives $t=${c}$, $x=1$ gives $t=${c + 1}$.`), `${W.calc}: $\\int_{${c}}^{${c + 1}}t\\,dt=\\dfrac{t^2}{2}\\Big|_{${c}}^{${c + 1}}=\\dfrac{${(c + 1) * (c + 1)}-${c * c}}{2}=${dec(c + 0.5)}$.`] }; });
easy('definite-integral', r => { const b = r.int(2, 9), I = `$$\\int_0^{${b}}2x\\,dx$$`, tri = `\\dfrac{${b}\\cdot${2 * b}}{2}=${b * b}`;
  return { q: L(`Вычислите интеграл: ${I}`, `Интегралды есептеңіз: ${I}`, `Evaluate: ${I}`), a: b * b, lvl: 1, hint: L('Первообразная для $2x$ — это $x^2$.', '$2x$ үшін алғашқы функция — $x^2$.', 'An antiderivative of $2x$ is $x^2$.'),
    steps: [`${W.anti}: $F(x)=x^2$.`, `${W.nl}: $x^2\\Big|_0^{${b}}=${b}^2-0^2=${b * b}$.`, L(`Проверка геометрией: это площадь треугольника с катетами $${b}$ и $${2 * b}$: $${tri}$.`, `Геометриямен тексеру: бұл катеттері $${b}$ және $${2 * b}$ үшбұрыштың ауданы: $${tri}$.`, `Geometric check: the area of a triangle with legs $${b}$ and $${2 * b}$: $${tri}$.`)] }; });
easy('area', r => { const b = r.int(1, 4);
  return { q: L(`Найдите площадь фигуры, ограниченной линиями $y=3x^2$, $y=0$, $x=0$, $x=${b}$.`, `$y=3x^2$, $y=0$, $x=0$, $x=${b}$ сызықтарымен шектелген фигураның ауданын табыңыз.`, `Find the area bounded by $y=3x^2$, $y=0$, $x=0$, $x=${b}$.`), a: b ** 3, lvl: 1, hint: '$S=\\int_a^bf(x)\\,dx,\\quad f(x)\\ge0$',
    steps: [L(`Функция неотрицательна, поэтому $S=\\int_0^{${b}}3x^2\\,dx$.`, `Функция теріс емес, сондықтан $S=\\int_0^{${b}}3x^2\\,dx$.`, `The function is non-negative, so $S=\\int_0^{${b}}3x^2\\,dx$.`), `${W.anti}: $F(x)=x^3$.`, `${W.nl}: $S=${b}^3-0=${b ** 3}$.`] }; });
easy('volume', r => { const rr = r.int(1, 5), h = r.int(2, 9), V = rr * rr * h;
  return { q: L(`Прямоугольник, ограниченный линиями $y=${rr}$, $y=0$, $x=0$, $x=${h}$, вращается вокруг оси $Ox$. Найдите объём полученного цилиндра. В ответ запишите $\\dfrac{V}{\\pi}$.`, `$y=${rr}$, $y=0$, $x=0$, $x=${h}$ сызықтарымен шектелген тіктөртбұрыш $Ox$ осінен айналады. Шыққан цилиндрдің көлемін табыңыз. Жауапқа $\\dfrac{V}{\\pi}$ жазыңыз.`, `The rectangle bounded by $y=${rr}$, $y=0$, $x=0$, $x=${h}$ rotates about the $x$-axis. Find the volume of the cylinder. Enter $\\dfrac{V}{\\pi}$.`), a: V, lvl: 1,
    hint: '$V=\\pi\\int_a^bf^2(x)\\,dx$',
    steps: [`${W.rule}: $V=\\pi\\int_0^{${h}}${rr}^2\\,dx=\\pi\\int_0^{${h}}${rr * rr}\\,dx$.`, `${W.calc}: $V=\\pi\\cdot${rr * rr}x\\Big|_0^{${h}}=${V}\\pi$.`, L(`Проверка: объём цилиндра $\\pi r^2h=\\pi\\cdot${rr * rr}\\cdot${h}$. Ответ: $${V}$.`, `Тексеру: цилиндр көлемі $\\pi r^2h=\\pi\\cdot${rr * rr}\\cdot${h}$. Жауабы: $${V}$.`, `Check: cylinder volume $\\pi r^2h=\\pi\\cdot${rr * rr}\\cdot${h}$. Answer: $${V}$.`)] }; });
easy('physics-integral', r => { const a = r.int(1, 5), T = r.int(2, 6);
  return { q: L(`Скорость тела $v(t)=${2 * a}t$ (м/с). Какой путь оно пройдёт за первые $${T}$ секунд?`, `Дене жылдамдығы $v(t)=${2 * a}t$ (м/с). Алғашқы $${T}$ секундта ол қандай жол жүреді?`, `The velocity is $v(t)=${2 * a}t$ (m/s). How far does the body travel in the first $${T}$ seconds?`), a: a * T * T, lvl: 1, unit: L('м', 'м', 'm'),
    hint: L('Путь — интеграл от скорости.', 'Жол — жылдамдықтың интегралы.', 'Distance is the integral of velocity.'),
    steps: [`${W.rule}: $s=\\int_0^{${T}}${2 * a}t\\,dt$.`, `${W.anti}: $${co(a, 't^2')}$.`, `${W.nl}: $s=${a}\\cdot${T}^2-0=${a * T * T}$.`] }; });
easy('de-basics', r => { const c = r.int(-9, 9);
  return { q: L(`Функция $y(x)$ удовлетворяет уравнению $y'=2x$ и условию $y(0)=${c}$. Найдите $y(2)$.`, `$y(x)$ функциясы $y'=2x$ теңдеуін және $y(0)=${c}$ шартын қанағаттандырады. $y(2)$-ні табыңыз.`, `The function $y(x)$ satisfies $y'=2x$ and $y(0)=${c}$. Find $y(2)$.`), a: 4 + c, lvl: 1,
    hint: L('Проинтегрируйте правую часть и найдите $C$ из условия.', 'Оң жағын интегралдап, $C$-ны шарттан табыңыз.', 'Integrate the right-hand side and find $C$ from the condition.'),
    steps: [L(`Интегрируем: $y=x^2+C$ — общее решение.`, `Интегралдаймыз: $y=x^2+C$ — жалпы шешім.`, `Integrate: $y=x^2+C$ — the general solution.`), L(`Условие $y(0)=${c}$ даёт $C=${c}$.`, `$y(0)=${c}$ шарты $C=${c}$ береді.`, `The condition $y(0)=${c}$ gives $C=${c}$.`), `${W.sub} $x=2$: $y(2)=4${sg(c)}=${4 + c}$.`] }; });
easy('separable', r => { const k = r.nz(-6, 6), A = r.int(2, 9), eq = `y'=${co(k, 'y')}`;
  return { q: L(`Решение задачи $${eq}$, $y(0)=${A}$ имеет вид $y=${A}e^{px}$. Найдите $p$.`, `$${eq}$, $y(0)=${A}$ есебінің шешімі $y=${A}e^{px}$ түрінде. $p$-ны табыңыз.`, `The solution of $${eq}$, $y(0)=${A}$ has the form $y=${A}e^{px}$. Find $p$.`), a: k, lvl: 1,
    hint: '$y\'=ky\\ \\Rightarrow\\ y=Ce^{kx}$',
    steps: [L(`Разделяем переменные: $\\dfrac{dy}{y}=${k}\\,dx$.`, `Айнымалыларды ажыратамыз: $\\dfrac{dy}{y}=${k}\\,dx$.`, `Separate variables: $\\dfrac{dy}{y}=${k}\\,dx$.`), L(`Интегрируем: $\\ln|y|=${k}x+C_1$, то есть $y=Ce^{${k}x}$.`, `Интегралдаймыз: $\\ln|y|=${k}x+C_1$, яғни $y=Ce^{${k}x}$.`, `Integrate: $\\ln|y|=${k}x+C_1$, i.e. $y=Ce^{${k}x}$.`), L(`Из $y(0)=${A}$: $C=${A}$. Значит, $p=${k}$.`, `$y(0)=${A}$ шартынан: $C=${A}$. Демек, $p=${k}$.`, `From $y(0)=${A}$: $C=${A}$. Hence $p=${k}$.`)] }; });
easy('second-order', r => { const p = r.int(-5, 5), q = r.int(-5, 5); need(p !== q && p * q !== 0 && p + q !== 0);
  const lo = Math.min(p, q), hi = Math.max(p, q), eq = `y''${sg(-(p + q))}y'${sg(p * q)}y=0`.replace(/([+-]) 1y/g, '$1 y'), gen = `y=C_1e^{${lo}x}+C_2e^{${hi}x}`;
  return { q: L(`Найдите больший корень характеристического уравнения для $${eq}$.`, `$${eq}$ теңдеуінің сипаттаушы теңдеуінің үлкен түбірін табыңыз.`, `Find the larger root of the characteristic equation of $${eq}$.`), a: hi, lvl: 1,
    hint: '$y\'\'\\to k^2,\\quad y\'\\to k,\\quad y\\to1$',
    steps: [`${W.chr}: $${poly([1, -(p + q), p * q], 'k')}=0$.`, L(`По теореме Виета: $k_1=${lo}$, $k_2=${hi}$.`, `Виет теоремасы бойынша: $k_1=${lo}$, $k_2=${hi}$.`, `By Vieta: $k_1=${lo}$, $k_2=${hi}$.`), L(`Больший корень: $${hi}$. Общее решение: $${gen}$.`, `Үлкен түбір: $${hi}$. Жалпы шешім: $${gen}$.`, `Larger root: $${hi}$. General solution: $${gen}$.`)] }; });
easy('harmonic', r => { const w = r.int(2, 9), eq = `y''+${w * w}y=0`;
  return { q: L(`Колебания описываются уравнением $${eq}$. Найдите циклическую частоту $\\omega$.`, `Тербеліс $${eq}$ теңдеуімен сипатталады. Циклдік жиілік $\\omega$-ны табыңыз.`, `Oscillations obey $${eq}$. Find the angular frequency $\\omega$.`), a: w, lvl: 1,
    hint: '$y\'\'+\\omega^2y=0$',
    steps: [L(`Стандартный вид: $y''+\\omega^2y=0$. Значит, $\\omega^2=${w * w}$.`, `Стандарт түрі: $y''+\\omega^2y=0$. Демек, $\\omega^2=${w * w}$.`, `Standard form: $y''+\\omega^2y=0$. So $\\omega^2=${w * w}$.`), `${W.calc}: $\\omega=\\sqrt{${w * w}}=${w}$; $y=C_1\\cos${w}x+C_2\\sin${w}x$.`] }; });

/* ---------- практикум: прикладные задачи ---------- */
['asymptotes', 'derivative-def', 'derivative-meaning', 'monotonicity', 'extrema', 'convexity', 'max-min', 'antiderivative', 'definite-integral', 'area'].forEach(id => PRACT.push(id + '~' + (GEN[id].length - 1)));
GEN['de-applied'].forEach((g, i) => PRACT.push('de-applied~' + i));
const applied = (id, g) => { GEN[id].push(g); PRACT.push(id + '~' + (GEN[id].length - 1)); };
const B3 = (ru, kk, en, body) => `<b>${L(ru, kk, en)}.</b> ${body}`;
applied('derivative-meaning', r => { const k = r.int(1, 3), T = r.int(2, 6), v = 2 * k * T, s = `s(t)=${v}t-${co(k, 't^2')}`, kmh = dec(v * 3.6, 0);
  return { q: L(`Автомобиль начинает тормозить, и его путь меняется по закону $${s}$ (м, с). Найдите тормозной путь — расстояние до полной остановки.`, `Автомобиль тежей бастайды, оның жолы $${s}$ (м, с) заңымен өзгереді. Тежелу жолын — толық тоқтағанға дейінгі қашықтықты табыңыз.`, `A car starts braking; its position is $${s}$ (m, s). Find the braking distance — the distance to a full stop.`), a: k * T * T, lvl: 2, unit: L('м', 'м', 'm'),
    hint: L('В момент остановки скорость равна нулю: $v(t)=s\'(t)=0$.', 'Тоқтау мезетінде жылдамдық нөлге тең: $v(t)=s\'(t)=0$.', 'At the stop the velocity is zero: $v(t)=s\'(t)=0$.'),
    steps: [B3('Модель', 'Модель', 'Model', L('Скорость — производная пути', 'Жылдамдық — жолдың туындысы', 'Velocity is the derivative of position') + `: $v(t)=s'(t)=${v}-${2 * k}t$.`),
      B3('Остановка', 'Тоқтау', 'Stop', `$v=0$: $${v}-${2 * k}t=0$, $t=${T}$.`),
      B3('Путь', 'Жол', 'Distance', `$s(${T})=${v}\\cdot${T}-${k}\\cdot${T * T}=${v * T}-${k * T * T}=${k * T * T}$.`),
      B3('Смысл', 'Мағынасы', 'Meaning', L(`Начальная скорость $${v}$ м/с — это $${kmh}$ км/ч. Тормозной путь растёт как квадрат скорости: вдвое быстрее — вчетверо длиннее.`, `Бастапқы жылдамдық $${v}$ м/с — бұл $${kmh}$ км/сағ. Тежелу жолы жылдамдықтың квадратындай өседі: екі есе жылдам — төрт есе ұзын.`, `The initial speed $${v}$ m/s is $${kmh}$ km/h. Braking distance grows as the square of speed: twice as fast — four times as long.`))] }; });
applied('max-min', r => { const mm = r.int(5, 25), P = 4 * mm, S = 2 * mm * mm;
  return { q: L(`Фермер хочет огородить прямоугольный загон у прямого берега реки. Со стороны реки забор не нужен, а сетки есть $${P}$ м. Какую наибольшую площадь может иметь загон?`, `Фермер өзеннің түзу жағасында тіктөртбұрышты қора қоршағысы келеді. Өзен жағына қоршау керек емес, ал тор $${P}$ м бар. Қораның ең үлкен ауданы қандай болуы мүмкін?`, `A farmer fences a rectangular pen along a straight river bank. No fence is needed on the river side, and there are $${P}$ m of netting. What is the largest possible area?`), a: S, lvl: 2, unit: L('м²', 'м²', 'm²'),
    hint: L('Обозначьте за $x$ сторону, перпендикулярную реке: таких сторон две.', 'Өзенге перпендикуляр қабырғаны $x$ деп белгілеңіз: мұндай қабырға екеу.', 'Let $x$ be the side perpendicular to the river: there are two of them.'),
    steps: [B3('Переменная', 'Айнымалы', 'Variable', L(`Пусть $x$ — сторона, перпендикулярная реке. Тогда сторона вдоль реки равна $${P}-2x$.`, `$x$ — өзенге перпендикуляр қабырға болсын. Сонда өзен бойындағы қабырға $${P}-2x$.`, `Let $x$ be the side perpendicular to the river. The side along the river is $${P}-2x$.`)),
      B3('Функция', 'Функция', 'Function', `$S(x)=x(${P}-2x)=${P}x-2x^2,\\quad 0<x<${P / 2}$.`),
      B3('Производная', 'Туынды', 'Derivative', `$S'(x)=${P}-4x=0$, $x=${mm}$. ` + L('Слева $S\'>0$, справа $S\'<0$ — максимум.', 'Сол жақта $S\'>0$, оң жақта $S\'<0$ — максимум.', '$S\'>0$ to the left and $S\'<0$ to the right — a maximum.')),
      B3('Ответ', 'Жауап', 'Answer', `$${mm}\\times${2 * mm}$, $S=${mm}\\cdot${2 * mm}=${S}$.`)] }; });
applied('definite-integral', r => { const a = r.int(2, 9), b = r.int(1, 4), T = r.pick([2, 4, 6, 10]), V = a * T + b * T * T / 2, q = `${a}+${co(b, 't')}`, F = `${a}t+${co(b / 2, 't^2')}`;
  return { q: L(`Вода поступает в бак со скоростью $q(t)=${q}$ литров в минуту. Сколько литров воды наберётся за первые $${T}$ минут?`, `Су бакқа $q(t)=${q}$ литр/мин жылдамдықпен құйылады. Алғашқы $${T}$ минутта неше литр су жиналады?`, `Water flows into a tank at $q(t)=${q}$ litres per minute. How many litres are collected in the first $${T}$ minutes?`), a: V, lvl: 2, unit: L('л', 'л', 'L'),
    hint: L('Объём — интеграл от расхода по времени.', 'Көлем — шығынның уақыт бойынша интегралы.', 'Volume is the integral of the flow rate over time.'),
    steps: [B3('Модель', 'Модель', 'Model', L('Расход меняется, поэтому просто умножить «скорость на время» нельзя. Объём — это интеграл', 'Шығын өзгереді, сондықтан «жылдамдықты уақытқа» көбейте салуға болмайды. Көлем — интеграл', 'The rate changes, so "rate times time" does not work. Volume is an integral') + `: $V=\\int_0^{${T}}(${q})\\,dt$.`),
      B3('Первообразная', 'Алғашқы функция', 'Antiderivative', `$${F}$.`),
      B3('Подставляем пределы', 'Шектерді қоямыз', 'Plug in the limits', `$V=${a}\\cdot${T}+${nt(b / 2)}\\cdot${T * T}-0=${a * T}+${b * T * T / 2}=${V}$.`)] }; });
applied('physics-integral', r => { const k = r.pick([100, 200, 400, 500]), Lc = r.pick([10, 20, 30]), Lm = dec(Lc / 100), A = k * (Lc / 100) ** 2 / 2;
  return { q: L(`Жёсткость пружины $k=${k}$ Н/м. Какую работу нужно совершить, чтобы растянуть её на $${Lc}$ см из нерастянутого состояния? (Закон Гука: $F=kx$.)`, `Серіппенің қатаңдығы $k=${k}$ Н/м. Оны созылмаған күйден $${Lc}$ см-ге созу үшін қандай жұмыс жасау керек? (Гук заңы: $F=kx$.)`, `A spring has stiffness $k=${k}$ N/m. How much work is needed to stretch it by $${Lc}$ cm from rest? (Hooke's law: $F=kx$.)`), a: A, lvl: 2, unit: L('Дж', 'Дж', 'J'), tol: 0.01,
    hint: L('Работа переменной силы: $A=\\int_0^LF(x)\\,dx$. Переведите сантиметры в метры.', 'Айнымалы күштің жұмысы: $A=\\int_0^LF(x)\\,dx$. Сантиметрді метрге айналдырыңыз.', 'Work of a variable force: $A=\\int_0^LF(x)\\,dx$. Convert centimetres to metres.'),
    steps: [B3('Единицы', 'Бірліктер', 'Units', L(`$${Lc}$ см $=${Lm}$ м.`, `$${Lc}$ см $=${Lm}$ м.`, `$${Lc}$ cm $=${Lm}$ m.`)),
      B3('Модель', 'Модель', 'Model', L('Сила растёт вместе с растяжением, поэтому работа — интеграл', 'Күш созылумен бірге өседі, сондықтан жұмыс — интеграл', 'The force grows with the stretch, so work is an integral') + `: $A=\\int_0^{${Lm}}${k}x\\,dx$.`),
      B3('Считаем', 'Есептейміз', 'Compute', `$A=${k / 2}x^2\\Big|_0^{${Lm}}=${k / 2}\\cdot${dec((Lc / 100) ** 2, 4)}=${dec(A)}$.`),
      B3('Проверка', 'Тексеру', 'Check', L('Это площадь треугольника под графиком $F=kx$: $\\dfrac{kL^2}{2}$.', 'Бұл $F=kx$ графигі астындағы үшбұрыштың ауданы: $\\dfrac{kL^2}{2}$.', 'This is the area of the triangle under $F=kx$: $\\dfrac{kL^2}{2}$.'))] }; });
applied('extrema', r => { const a = r.int(1, 4), x0 = r.int(5, 30), b = 2 * a * x0, c = r.int(10, 90), P = `P(x)=-${co(a, 'x^2')}+${b}x-${c}`, best = -a * x0 * x0 + b * x0 - c;
  return { q: L(`Прибыль цеха (тыс. тенге в день) зависит от числа выпущенных изделий $x$: $${P}$. При каком выпуске прибыль наибольшая?`, `Цех пайдасы (күніне мың теңге) шығарылған бұйым саны $x$-ке тәуелді: $${P}$. Қандай өнім көлемінде пайда ең үлкен болады?`, `A workshop's daily profit (thousand tenge) depends on output $x$: $${P}$. Which output gives the greatest profit?`), a: x0, lvl: 2,
    hint: L('Найдите точку максимума: $P\'(x)=0$.', 'Максимум нүктесін табыңыз: $P\'(x)=0$.', 'Find the maximum point: $P\'(x)=0$.'),
    steps: [B3('Производная', 'Туынды', 'Derivative', `$P'(x)=-${2 * a}x+${b}$ — ` + L('это «предельная прибыль»: сколько принесёт ещё одно изделие.', 'бұл «шекті пайда»: тағы бір бұйым қанша әкеледі.', 'the "marginal profit": what one more item brings.')),
      B3('Критическая точка', 'Кризистік нүкте', 'Critical point', `$-${2 * a}x+${b}=0$, $x=${x0}$.`),
      B3('Знаки', 'Таңбалар', 'Signs', L(`При $x<${x0}$ производная положительна (выпуск выгодно наращивать), при $x>${x0}$ отрицательна. Значит, $x=${x0}$ — максимум.`, `$x<${x0}$ болғанда туынды оң (өнімді арттыру тиімді), $x>${x0}$ болғанда теріс. Демек, $x=${x0}$ — максимум.`, `For $x<${x0}$ the derivative is positive (worth producing more), for $x>${x0}$ negative. So $x=${x0}$ is the maximum.`)),
      B3('Наибольшая прибыль', 'Ең үлкен пайда', 'Greatest profit', `$P(${x0})=${best}$.`)] }; });
applied('chain-rule', r => { const a = r.int(1, 3), t0 = r.int(1, 4), rad = a * t0, ans = 4 * rad * rad * a, rt = `r(t)=${co(a, 't')}`;
  return { q: L(`Воздушный шар надувают так, что его радиус растёт по закону $${rt}$ (см, с). С какой скоростью (см³/с) растёт объём шара в момент $t=${t0}$ с? В ответ запишите $\\dfrac{V'}{\\pi}$.`, `Әуе шарын үрлегенде оның радиусы $${rt}$ (см, с) заңымен өседі. $t=${t0}$ с мезетінде шар көлемі қандай жылдамдықпен (см³/с) өседі? Жауапқа $\\dfrac{V'}{\\pi}$ жазыңыз.`, `A balloon is inflated so that its radius grows as $${rt}$ (cm, s). How fast (cm³/s) is the volume growing at $t=${t0}$ s? Enter $\\dfrac{V'}{\\pi}$.`), a: ans, lvl: 2,
    hint: L('$V=\\dfrac43\\pi r^3$, а $r$ зависит от $t$ — это сложная функция.', '$V=\\dfrac43\\pi r^3$, ал $r$ шамасы $t$-ға тәуелді — бұл күрделі функция.', '$V=\\dfrac43\\pi r^3$ and $r$ depends on $t$ — a composite function.'),
    steps: [B3('Модель', 'Модель', 'Model', `$V(t)=\\dfrac43\\pi r^3(t)$ — ` + L('«матрёшка»: объём зависит от радиуса, радиус — от времени.', '«матрёшка»: көлем радиусқа, радиус уақытқа тәуелді.', 'nesting dolls: volume depends on radius, radius on time.')),
      B3('Правило цепочки', 'Тізбек ережесі', 'Chain rule', `$V'(t)=\\dfrac43\\pi\\cdot3r^2\\cdot r'=4\\pi r^2\\,r'$.`),
      B3('Числа', 'Сандар', 'Numbers', `$r(${t0})=${rad}$, $r'=${a}$.`),
      B3('Ответ', 'Жауап', 'Answer', `$V'=4\\pi\\cdot${rad * rad}\\cdot${a}=${ans}\\pi$. ` + L('Заметьте: $4\\pi r^2$ — это площадь поверхности шара.', 'Байқаңыз: $4\\pi r^2$ — шар бетінің ауданы.', 'Note that $4\\pi r^2$ is the surface area of the sphere.'))] }; });
applied('trig-derivatives', r => { const A = r.int(2, 9), w = r.int(2, 6), x = `x(t)=${A}\\sin ${w}t`;
  return { q: L(`Груз на пружине колеблется по закону $${x}$ (см, с). Найдите наибольшую скорость груза.`, `Серіппедегі жүк $${x}$ (см, с) заңы бойынша тербеледі. Жүктің ең үлкен жылдамдығын табыңыз.`, `A mass on a spring oscillates as $${x}$ (cm, s). Find its greatest speed.`), a: A * w, lvl: 2, unit: L('см/с', 'см/с', 'cm/s'),
    hint: L('Скорость — производная координаты; косинус не превышает $1$.', 'Жылдамдық — координатаның туындысы; косинус $1$-ден аспайды.', 'Velocity is the derivative of position; cosine never exceeds $1$.'),
    steps: [B3('Скорость', 'Жылдамдық', 'Velocity', `$v(t)=x'(t)=${A}\\cos ${w}t\\cdot${w}=${A * w}\\cos ${w}t$ ` + L(`(не забыли производную внутренней функции $${w}t$).`, `(ішкі функция $${w}t$-ның туындысын ұмытпадық).`, `(do not forget the inner derivative of $${w}t$).`)),
      B3('Наибольшее значение', 'Ең үлкен мән', 'Greatest value', `$|\\cos ${w}t|\\le1\\ \\Rightarrow\\ v_{\\max}=${A * w}$.`),
      B3('Смысл', 'Мағынасы', 'Meaning', L(`Скорость максимальна, когда $\\sin ${w}t=0$: груз проходит положение равновесия.`, `Жылдамдық $\\sin ${w}t=0$ болғанда ең үлкен: жүк тепе-теңдік күйінен өтеді.`, `The speed is greatest when $\\sin ${w}t=0$: the mass passes through equilibrium.`))] }; });
applied('antiderivative', r => { const a = 2 * r.int(1, 4), b = r.int(1, 9), s0 = r.int(0, 20), T = r.int(2, 5), ans = a * T * T / 2 + b * T + s0, v = poly([a, b], 't');
  return { q: L(`Скорость велосипедиста $v(t)=${v}$ (м/с). В момент $t=0$ он находился на отметке $${s0}$ м. На какой отметке он будет в момент $t=${T}$ с?`, `Велосипедшінің жылдамдығы $v(t)=${v}$ (м/с). $t=0$ мезетінде ол $${s0}$ м белгісінде болды. $t=${T}$ с мезетінде ол қай белгіде болады?`, `A cyclist's velocity is $v(t)=${v}$ (m/s). At $t=0$ he was at the $${s0}$ m mark. Where will he be at $t=${T}$ s?`), a: ans, lvl: 2, unit: L('м', 'м', 'm'),
    hint: L('Координата — первообразная скорости; $C$ находится из начального положения.', 'Координата — жылдамдықтың алғашқы функциясы; $C$ бастапқы орыннан табылады.', 'Position is an antiderivative of velocity; $C$ comes from the starting position.'),
    steps: [B3('Первообразная', 'Алғашқы функция', 'Antiderivative', `$s(t)=${poly([a / 2, b, 0], 't')}+C$.`),
      B3('Начальное условие', 'Бастапқы шарт', 'Initial condition', `$s(0)=${s0}\\ \\Rightarrow\\ C=${s0}$.`),
      B3('Подставляем', 'Орнына қоямыз', 'Substitute', `$s(${T})=${a / 2}\\cdot${T * T}+${b}\\cdot${T}+${s0}=${ans}$.`)] }; });
applied('volume', r => { const h = 2 * r.int(1, 5), V = h * h / 2, lit = dec(V * Math.PI, 1);
  return { q: L(`Чаша имеет форму тела, полученного вращением кривой $y=\\sqrt x$ вокруг оси $Ox$ (размеры в дм). Глубина чаши $${h}$ дм. Найдите её объём. В ответ запишите $\\dfrac{V}{\\pi}$.`, `Тостаған $y=\\sqrt x$ қисығын $Ox$ осінен айналдырғанда шығатын дене пішінді (өлшемдері дм). Тостаған тереңдігі $${h}$ дм. Көлемін табыңыз. Жауапқа $\\dfrac{V}{\\pi}$ жазыңыз.`, `A bowl has the shape obtained by rotating $y=\\sqrt x$ about the $x$-axis (sizes in dm). Its depth is $${h}$ dm. Find its volume. Enter $\\dfrac{V}{\\pi}$.`), a: V, lvl: 2,
    hint: '$V=\\pi\\int_0^hf^2(x)\\,dx$',
    steps: [B3('Модель', 'Модель', 'Model', L('Чаша — стопка тонких дисков радиуса $\\sqrt x$', 'Тостаған — радиусы $\\sqrt x$ жұқа дискілер бағаны', 'The bowl is a stack of thin discs of radius $\\sqrt x$') + `: $V=\\pi\\int_0^{${h}}(\\sqrt x)^2dx=\\pi\\int_0^{${h}}x\\,dx$.`),
      B3('Считаем', 'Есептейміз', 'Compute', `$V=\\pi\\cdot\\dfrac{x^2}{2}\\Big|_0^{${h}}=\\pi\\cdot\\dfrac{${h * h}}{2}=${V}\\pi$.`),
      B3('Смысл', 'Мағынасы', 'Meaning', L(`$1$ дм³ — это $1$ литр, то есть в чашу входит примерно $${lit}$ л.`, `$1$ дм³ — $1$ литр, яғни тостағанға шамамен $${lit}$ л сыяды.`, `$1$ dm³ is $1$ litre, so the bowl holds about $${lit}$ L.`))] }; });

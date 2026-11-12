/* Структура курса: разделы, темы, цели обучения (коды программы), главные формулы и симуляторы. */
const R = String.raw;
const GROUPS = [
  { id: 'lim', sym: 'lim', grade: 10 },
  { id: 'der', sym: "f'", grade: 10 },
  { id: 'app', sym: '↗', grade: 10 },
  { id: 'int', sym: '∫', grade: 11 },
  { id: 'de', sym: "y''", grade: 11 }
];
const TOPICS = [
  // ---- Предел и непрерывность
  { id: 'limit-point', g: 'lim', lab: 'limit', min: 25, codes: ['10.4.1.8', '10.4.1.9'],
    f: [R`\lim_{x\to a}f(x)=A`, R`\lim_{x\to\infty}\frac{1}{x}=0`, R`\lim(f\pm g)=\lim f\pm\lim g`, R`\lim(f\cdot g)=\lim f\cdot\lim g`] },
  { id: 'asymptotes', g: 'lim', lab: 'asymptote', min: 20, codes: ['10.4.1.10'],
    f: [R`x=a:\ \lim_{x\to a}f(x)=\infty`, R`y=b:\ \lim_{x\to\infty}f(x)=b`, R`y=kx+b:\ k=\lim_{x\to\infty}\frac{f(x)}{x},\ b=\lim_{x\to\infty}(f(x)-kx)`] },
  { id: 'sequence-limit', g: 'lim', lab: 'sequence', min: 20, codes: ['10.4.1.11'],
    f: [R`\lim_{n\to\infty}\frac1n=0`, R`\lim_{n\to\infty}q^n=0,\ |q|<1`, R`\lim_{n\to\infty}\left(1+\frac1n\right)^n=e`] },
  { id: 'continuity', g: 'lim', lab: 'continuity', min: 20, codes: ['10.4.1.12', '10.4.1.13'],
    f: [R`\lim_{x\to a}f(x)=f(a)`, R`\lim_{x\to a-0}f(x)=\lim_{x\to a+0}f(x)=f(a)`] },
  { id: 'indeterminate', g: 'lim', lab: 'sinc', min: 30, codes: ['10.4.1.14', '10.4.1.15'],
    f: [R`\lim_{x\to0}\frac{\sin x}{x}=1`, R`\lim_{x\to0}\frac{\sin kx}{x}=k`, R`\lim_{x\to0}\frac{\operatorname{tg}x}{x}=1`, R`\lim_{x\to0}\frac{1-\cos x}{x^2}=\frac12`] },
  // ---- Производная
  { id: 'derivative-def', g: 'der', lab: 'secant', min: 30, codes: ['10.4.1.16', '10.4.1.17', '10.4.1.18'],
    f: [R`\Delta x=x-x_0,\quad \Delta y=f(x_0+\Delta x)-f(x_0)`, R`f'(x_0)=\lim_{\Delta x\to0}\frac{\Delta y}{\Delta x}`, R`C'=0,\qquad (x^n)'=nx^{n-1}`] },
  { id: 'differential', g: 'der', lab: 'differential', min: 15, codes: ['10.4.1.19', '10.4.1.20'],
    f: [R`dy=f'(x)\,dx`, R`\Delta y\approx dy`, R`f(x_0+\Delta x)\approx f(x_0)+f'(x_0)\Delta x`] },
  { id: 'diff-rules', g: 'der', lab: 'dbuilder', min: 30, codes: ['10.4.1.21'],
    f: [R`(u\pm v)'=u'\pm v'`, R`(Cu)'=Cu'`, R`(uv)'=u'v+uv'`, R`\left(\frac uv\right)'=\frac{u'v-uv'}{v^2}`] },
  { id: 'chain-rule', g: 'der', lab: 'chain', min: 25, codes: ['10.4.1.22'],
    f: [R`\big(f(g(x))\big)'=f'(g(x))\cdot g'(x)`, R`\big(f(kx+b)\big)'=k\,f'(kx+b)`, R`(u^n)'=nu^{n-1}\cdot u'`] },
  { id: 'trig-derivatives', g: 'der', lab: 'trigder', min: 30, codes: ['10.4.1.23', '10.4.1.24'],
    f: [R`(\sin x)'=\cos x,\quad(\cos x)'=-\sin x`, R`(\operatorname{tg}x)'=\frac1{\cos^2x},\quad(\operatorname{ctg}x)'=-\frac1{\sin^2x}`, R`(\arcsin x)'=\frac1{\sqrt{1-x^2}},\quad(\arccos x)'=-\frac1{\sqrt{1-x^2}}`, R`(\operatorname{arctg}x)'=\frac1{1+x^2},\quad(\operatorname{arcctg}x)'=-\frac1{1+x^2}`] },
  { id: 'derivative-meaning', g: 'der', lab: 'motion', min: 25, codes: ['10.4.2.1', '10.4.2.2', '10.4.3.1', '10.4.3.2'],
    f: [R`k=\operatorname{tg}\alpha=f'(x_0)`, R`v(t)=s'(t)`, R`a(t)=v'(t)=s''(t)`] },
  { id: 'tangent', g: 'der', lab: 'tangent', min: 20, codes: ['10.4.1.25'],
    f: [R`y=f(x_0)+f'(x_0)(x-x_0)`] },
  // ---- Применение производной
  { id: 'monotonicity', g: 'app', lab: 'study', min: 20, codes: ['10.4.1.26', '10.4.1.27'],
    f: [R`f'(x)>0\ \Rightarrow\ f\nearrow`, R`f'(x)<0\ \Rightarrow\ f\searrow`] },
  { id: 'extrema', g: 'app', lab: 'study', min: 25, codes: ['10.4.1.28', '10.4.1.29'],
    f: [R`f'(x_0)=0\ \lor\ \nexists f'(x_0)`, R`+\to-\ :\ \max`, R`-\to+\ :\ \min`] },
  { id: 'convexity', g: 'app', lab: 'study', min: 25, codes: ['10.4.1.30', '10.4.1.31', '10.4.1.32'],
    f: [R`f''(x)=(f'(x))'`, R`f''>0:\ \smile`, R`f''<0:\ \frown`] },
  { id: 'function-study', g: 'app', lab: 'study', min: 35, codes: ['10.4.1.33'],
    f: [R`D(f)\ \to\ f'\ \to\ f''\ \to\ \lim`] },
  { id: 'max-min', g: 'app', lab: 'box', min: 30, codes: ['10.4.1.34', '10.4.3.3'],
    f: [R`\max_{[a;b]}f=\max\{f(a),f(b),f(x_i)\}`, R`f'(x_i)=0,\ x_i\in(a;b)`] },
  // ---- Первообразная и интеграл
  { id: 'antiderivative', g: 'int', lab: 'family', min: 30, codes: ['11.4.1.1', '11.4.1.2', '11.4.1.3'],
    f: [R`F'(x)=f(x)`, R`\int f(x)\,dx=F(x)+C`, R`\int x^n dx=\frac{x^{n+1}}{n+1}+C`, R`\int\frac{dx}{x}=\ln|x|+C`, R`\int e^xdx=e^x+C`, R`\int\cos x\,dx=\sin x+C`] },
  { id: 'substitution', g: 'int', lab: null, min: 30, codes: ['11.4.1.4'],
    f: [R`\int f(g(x))\,g'(x)\,dx=\int f(t)\,dt,\ t=g(x)`, R`\int f(kx+b)\,dx=\frac1kF(kx+b)+C`] },
  { id: 'by-parts', g: 'int', lab: null, min: 30, codes: ['11.4.1.5'],
    f: [R`\int u\,dv=uv-\int v\,du`] },
  { id: 'definite-integral', g: 'int', lab: 'riemann', min: 30, codes: ['11.4.1.6', '11.4.1.7'],
    f: [R`\int_a^bf(x)\,dx=F(b)-F(a)`, R`S=\int_a^bf(x)\,dx,\ f\ge0`, R`\int_a^bf\,dx=-\int_b^af\,dx`] },
  { id: 'area', g: 'int', lab: 'area', min: 30, codes: ['11.4.1.8'],
    f: [R`S=\int_a^b\big(f(x)-g(x)\big)dx,\ f\ge g`] },
  { id: 'volume', g: 'int', lab: 'volume', min: 25, codes: ['11.4.1.9'],
    f: [R`V=\pi\int_a^bf^2(x)\,dx`] },
  { id: 'physics-integral', g: 'int', lab: 'work', min: 25, codes: ['11.4.2.1'],
    f: [R`s=\int_{t_1}^{t_2}v(t)\,dt`, R`A=\int_a^bF(x)\,dx`, R`F=kx\ \Rightarrow\ A=\frac{kx^2}{2}`] },
  // ---- Дифференциальные уравнения
  { id: 'de-basics', g: 'de', lab: 'slopefield', min: 20, codes: ['11.4.1.22', '11.4.1.23'],
    f: [R`F(x,y,y')=0`, R`y=\varphi(x,C)`, R`y(x_0)=y_0`] },
  { id: 'separable', g: 'de', lab: 'growth', min: 30, codes: ['11.4.1.24', '11.4.3.1'],
    f: [R`\frac{dy}{dx}=f(x)g(y)\ \Rightarrow\ \int\frac{dy}{g(y)}=\int f(x)\,dx`, R`y'=ky\ \Rightarrow\ y=Ce^{kx}`] },
  { id: 'second-order', g: 'de', lab: 'charroots', min: 30, codes: ['11.4.1.25'],
    f: [R`ak^2+bk+c=0`, R`D>0:\ y=C_1e^{k_1x}+C_2e^{k_2x}`, R`D=0:\ y=(C_1+C_2x)e^{kx}`, R`D<0:\ y=e^{\alpha x}(C_1\cos\beta x+C_2\sin\beta x)`] },
  { id: 'harmonic', g: 'de', lab: 'spring', min: 25, codes: ['11.4.3.2'],
    f: [R`x''+\omega^2x=0`, R`x=A\cos(\omega t+\varphi_0)`, R`T=\frac{2\pi}{\omega},\quad\omega=\sqrt{\frac km}`] }
];
const CONTENT = {};
TOPICS.forEach((tp, i) => { tp.n = i + 1; });

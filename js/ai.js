/* ИИ-наставник: любой OpenAI-совместимый API. Ключ хранится только в localStorage браузера. */
const AI_PROVIDERS = [
  { id: 'gemini', name: 'Google Gemini', base: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.5-flash', keys: 'https://aistudio.google.com/apikey' },
  { id: 'groq', name: 'Groq', base: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile', keys: 'https://console.groq.com/keys' },
  { id: 'openrouter', name: 'OpenRouter', base: 'https://openrouter.ai/api/v1', model: 'openrouter/auto', keys: 'https://openrouter.ai/keys' },
  { id: 'deepseek', name: 'DeepSeek', base: 'https://api.deepseek.com', model: 'deepseek-chat', keys: 'https://platform.deepseek.com/api_keys' },
  { id: 'mistral', name: 'Mistral', base: 'https://api.mistral.ai/v1', model: 'mistral-small-latest', keys: 'https://console.mistral.ai/api-keys/' },
  { id: 'openai', name: 'OpenAI', base: 'https://api.openai.com/v1', model: 'gpt-4o-mini', keys: 'https://platform.openai.com/api-keys' },
  { id: 'custom', name: 'Custom / локальный', base: 'http://localhost:11434/v1', model: 'llama3', keys: '' }
];
let aiChat = [], aiBusy = false, aiPending = null;
function aiCfg() { const a = S.settings.ai || {}, p = AI_PROVIDERS.find(x => x.id === a.provider) || AI_PROVIDERS[0]; return { p, key: a.key || '', model: a.model || p.model, base: a.base || p.base }; }
function aiSystem() {
  const lang = { ru: 'русском', kk: 'казахском (қазақ тілінде)', en: 'English' }[LANG];
  return `Ты — дружелюбный наставник по математическому анализу для школьников 10–11 классов (Казахстан). Темы курса: предел и непрерывность, производная и её применение, первообразная и интеграл, дифференциальные уравнения. Отвечай на языке: ${lang}. Объясняй просто, по шагам, с жизненными примерами. Не выдавай сразу готовый ответ к задаче: сначала дай подсказку и наводящий вопрос; полное решение — если ученик просит или уже пробовал. Формулы пиши в LaTeX: $...$ в строке и $$...$$ отдельной строкой. В обозначениях используй tg, ctg, arctg. Будь краток.`;
}
function aiFormat(text) {
  const math = [];
  let s = String(text).replace(/\\\[([\s\S]+?)\\\]/g, (m, x) => '$$' + x + '$$').replace(/\\\(([\s\S]+?)\\\)/g, (m, x) => '$' + x + '$')
    .replace(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g, m => { math.push(m); return '\u0001' + (math.length - 1) + '\u0002'; });
  s = esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/^#{1,4}\s*(.+)$/gm, '<b>$1</b>').replace(/^\s*[-*]\s+/gm, '• ');
  s = s.split(/\n{2,}/).map(p => '<p>' + p.replace(/\n/g, '<br>') + '</p>').join('');
  s = s.replace(/\u0001(\d+)\u0002/g, (m, i) => math[+i]);
  const before = window.__texErrors || 0, out = mx(s); window.__texErrors = before; return out;
}
async function aiRequest(messages) {
  const c = aiCfg();
  const res = await fetch(c.base.replace(/\/+$/, '') + '/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + c.key }, body: JSON.stringify({ model: c.model, messages, temperature: 0.4 }) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data.error && (data.error.message || data.error)) || (Array.isArray(data) && data[0] && data[0].error && data[0].error.message) || 'HTTP ' + res.status);
  return data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '';
}
function aiDraw() {
  const box = $('ai-chat'); if (!box) return;
  box.innerHTML = aiChat.map(mm => `<div class="msg ${mm.role === 'user' ? 'user' : mm.err ? 'bot err' : 'bot'}">${mm.role === 'user' ? esc(mm.show || mm.content).replace(/\n/g, '<br>') : aiFormat(mm.content)}</div>`).join('') + (aiBusy ? `<div class="msg bot">${t('aiThinking')}</div>` : '');
  box.scrollTop = box.scrollHeight;
}
async function aiSend(text, show) {
  text = (text || '').trim(); if (!text || aiBusy) return;
  if (!aiCfg().key && aiCfg().p.id !== 'custom') { toast(t('aiNoKey')); const d = $('ai-setup'); if (d) d.open = true; return; }
  aiChat.push({ role: 'user', content: text, show }); aiBusy = true; aiDraw();
  try { const reply = await aiRequest([{ role: 'system', content: aiSystem() }].concat(aiChat.filter(x => !x.err).slice(-12).map(x => ({ role: x.role, content: x.content })))); aiChat.push({ role: 'assistant', content: reply || '…' }); }
  catch (e) { aiChat.push({ role: 'assistant', content: '⚠ ' + e.message, err: true }); }
  aiBusy = false; aiDraw();
}
function aiSave() {
  const p = $('ai-provider').value, prev = (S.settings.ai || {}).provider, def = AI_PROVIDERS.find(x => x.id === p);
  S.settings.ai = { provider: p, key: $('ai-key').value.trim(), model: p !== prev ? def.model : $('ai-model').value.trim() || def.model, base: p !== prev ? def.base : $('ai-base').value.trim() || def.base };
  save(); renderAI(true); toast(t('done'));
}
async function aiTest() { aiSave(); try { const r = await aiRequest([{ role: 'user', content: 'Reply with the single word: OK' }]); toast(t('aiOk') + ' ' + String(r).slice(0, 30)); } catch (e) { toast('⚠ ' + e.message); } }
async function aiModels() {
  aiSave(); const c = aiCfg();
  try { const res = await fetch(c.base.replace(/\/+$/, '') + '/models', { headers: { Authorization: 'Bearer ' + c.key } }), d = await res.json(); const list = (d.data || d.models || []).map(x => String(x.id || x.name).replace(/^models\//, '')).sort(); if (!list.length) throw new Error('—'); $('ai-model-list').innerHTML = list.map(x => `<option value="${esc(x)}">`).join(''); toast(list.length + ' ✓'); }
  catch (e) { toast('⚠ ' + e.message); }
}
function renderAI(keepOpen) {
  const c = aiCfg();
  $('main').innerHTML = `<div class="page"><h1>${ico('bot')} ${t('ai')}</h1><p class="muted">${t('aiLead')}</p>
  <details class="card" id="ai-setup" ${!c.key || keepOpen === true ? 'open' : ''} style="margin-bottom:16px"><summary style="cursor:pointer;font-weight:900">${t('aiSetup')}: ${esc(c.p.name)} · ${esc(c.model)} ${c.key ? '✓' : ''}</summary>
   <div class="grid2" style="margin-top:14px"><label><b>${t('provider')}</b><select id="ai-provider" onchange="aiSave()">${AI_PROVIDERS.map(p => `<option value="${p.id}" ${p.id === c.p.id ? 'selected' : ''}>${p.name}</option>`).join('')}</select></label>
   <label><b>${t('apiKey')}</b><input id="ai-key" type="password" value="${esc(c.key)}" autocomplete="off" placeholder="sk-… / AIza…"></label>
   <label><b>${t('model')}</b><input id="ai-model" list="ai-model-list" value="${esc(c.model)}"><datalist id="ai-model-list"></datalist></label>
   <label><b>${t('baseUrl')}</b><input id="ai-base" value="${esc(c.base)}"></label></div>
   <div class="row wrap" style="margin-top:14px"><button class="btn primary" onclick="aiSave()">${t('save')}</button><button class="btn" onclick="aiTest()">${t('testConn')}</button><button class="btn" onclick="aiModels()">${t('loadModels')}</button>${c.p.keys ? `<a class="btn ghost" target="_blank" rel="noopener" href="${c.p.keys}">${t('getKey')} ↗</a>` : ''}</div></details>
  <div class="card"><div class="chat" id="ai-chat"></div>
   <div class="chips" style="margin:12px 0">${['chip1', 'chip2', 'chip3', 'chip4'].map(k => `<button class="btn sm soft" onclick="aiSend(t('${k}'))">${t(k)}</button>`).join('')}</div>
   <div class="row"><textarea id="ai-input" rows="2" placeholder="${t('aiPh')}" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();aiSubmit()}"></textarea><button class="btn primary" onclick="aiSubmit()">${t('send')}</button></div>
   <div class="row" style="margin-top:10px"><button class="btn sm ghost" onclick="aiChat=[];aiDraw()">${t('clear')}</button></div></div>${footer()}</div>`;
  aiDraw();
  if (aiPending) { const p = aiPending; aiPending = null; aiSend(p.text, p.show); }
}
function aiSubmit() { const el = $('ai-input'), v = el.value; el.value = ''; aiSend(v); }
function aiAsk(text, show) { aiPending = { text, show }; if ($('dlg').open) $('dlg').close(); go('ai'); }
function aiAskTopic(id) { const c = C(id); aiAsk(`Тема: «${c.t}» (${c.s}). Объясни эту тему ещё проще, на одном жизненном примере, и задай мне один проверочный вопрос.`, t('askTopic') + ': ' + c.t); }
function aiAskTask(cid) {
  const { tk } = CARDS[cid], mine = (() => { try { const v = readAnswer(cid); return v == null ? '' : tk.type === 'single' ? tk.opts[v] : tk.type === 'multi' ? v.map(i => tk.opts[i]).join('; ') : [].concat(v).join('; '); } catch (e) { return ''; } })();
  aiAsk(`Задача (тема «${C(tk.topic).t}»): ${tk.q}${tk.opts ? '\nВарианты: ' + tk.opts.join(' | ') : ''}${mine ? '\nМой ответ: ' + mine : ''}\nПомоги разобраться: подскажи первый шаг и на что обратить внимание, не называя сразу ответ.`, t('askAi') + ': ' + plain(tk.q).slice(0, 140) + '…');
}

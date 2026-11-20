import { t } from './i18n.c64f4bc3eb.js';
import { aiConfirm, featureSpec, envFrom, cancelError, aiNote } from './ai_cost.2fb10e6822.js';
export const PROVIDERS = ['gemini', 'ollama', 'handoff_claude', 'handoff_gemini', 'claude_api'];
export const TASKS = ['zalo_draft', 'summarize', 'read_policy', 'ideas', 'script', 'staff', 'assistant'];
export const DEFAULT_ROUTES = { zalo_draft: 'gemini', summarize: 'gemini', read_policy: 'gemini', ideas: 'gemini', script: 'gemini', staff: 'gemini', assistant: 'gemini' };
export const DEFAULT_OLLAMA_MODEL = 'qwen2.5:3b';
export const OLLAMA_TIMEOUT = 5000;
export const OLLAMA_RUN_TIMEOUT = 120000;
export const HANDOFF_URL_LIMIT = 6000;
export function pickProvider(task, { routes = {}, requested, claudeEnabled = false, overBudget = false } = {}) {
let p = requested || routes[task] || DEFAULT_ROUTES[task] || 'gemini';
if (!PROVIDERS.includes(p)) p = 'gemini';
if (p === 'claude_api' && (!claudeEnabled || overBudget)) p = 'gemini';
return p;
}
export function aiAvailable({ available, claudeEnabled = false, ollamaModel = '', routes = {} } = {}) {
const ollama = !!ollamaModel || Object.values(routes || {}).includes('ollama');
if (!available || typeof available !== 'object') return { gemini: true, claude: !!claudeEnabled, ollama, any: true, known: false };
const gemini = !!available.gemini; const claude = !!available.claude && !!claudeEnabled;
return { gemini, claude, ollama, any: gemini || claude || ollama, known: true };
}
export function claudeUrl(prompt) {
const _of = encodeURIComponent(prompt);
return _of.length <= HANDOFF_URL_LIMIT ? { url: 'https://claude.ai/new?q=' + _of, needsCopy: false } : { url: 'https://claude.ai/new', needsCopy: true };
}
async function _o8(url, opts, ms) {
const _o4 = new AbortController();
const _om = setTimeout(() => _o4.abort(), ms);
try { return await fetch(url, { ...opts, signal: _o4.signal }); } finally { clearTimeout(_om); }
}
export function createAI({ api, settings, ui, config = {} } = {}) {
const _oc = config.OLLAMA_URL || 'http://127.0.0.1:11434';
const _o7 = config.ENGINE_URL || 'http://127.0.0.1:8765';
const _o3 = () => {
const _o9 = (k, _o6) => (settings ? settings.get(k, _o6) : _o6);
return { routes: _o9('ai.routes', {}) || {}, claude_enabled: !!_o9('ai.claude_api_enabled', false), ollama_model: _o9('ai.ollama_model', '') };
};
const _o1 = () => { try { return typeof _o0.bridge === 'function' ? _o0.bridge() !== false : true; } catch { return true; } };
async function _oi(prompt, { json, images, temperature } = {}) {
const model = _o3().ollama_model || DEFAULT_OLLAMA_MODEL;
const options = Number.isFinite(temperature) ? { temperature } : undefined;
const body = JSON.stringify({ model, prompt, stream: false, format: json ? 'json' : undefined, images: images && images.map((i) => i.b64), options });
const _ol = [_oc + '/api/generate'].concat(_o1() ? [_o7 + '/ollama/api/generate'] : []);
let _oa;
for (const url of _ol) {
try {
const _og = await _o8(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }, OLLAMA_RUN_TIMEOUT);
if (!_og.ok) throw new Error('ollama ' + _og.status);
const _o6 = await _og.json();
return { text: _o6.response || '', provider: 'ollama', tokens_in: _o6.prompt_eval_count || 0, tokens_out: _o6.eval_count || 0, cost_usd: 0 };
} catch (e) { _oa = e; }
}
throw _oa || new Error('ollama');
}
async function _oh(task, provider, { prompt, images, json }) {
return api.call('ai.run', { task, provider, prompt, images, json: !!json });
}
async function gate(task, provider, { feature, confirmed, prompt, images, json }) {
if (confirmed) return;
const _ok = featureSpec(feature || null, { provider, task });
const ok = await (_o0.confirm || aiConfirm)(_ok, { env: envFrom(settings), prompt, images, json });
if (!ok) throw cancelError();
}
const _o0 = {
PROVIDERS, TASKS,
routes() { return { ...DEFAULT_ROUTES, ...(_o3().routes || {}) }; },
async setRoute(task, provider) {
const routes = { ...(_o3().routes || {}), [task]: provider };
await settings.set('ai.routes', routes);
},
provider(task, requested) {
const _o2 = _o3();
return pickProvider(task, { routes: _o0.routes(), requested, claudeEnabled: !!_o2.claude_enabled, overBudget: !!_o0.overBudget });
},
overBudget: false,
bridge: null,
availability() {
const _o9 = (k, _o6) => (settings ? settings.get(k, _o6) : _o6);
return aiAvailable({ available: _o9('ai.available', null), claudeEnabled: !!_o9('ai.claude_api_enabled', false), ollamaModel: _o9('ai.ollama_model', ''), routes: _o9('ai.routes', {}) || {} });
},
connected() { return _o0.availability().any; },
async refreshAvailability() {
const _o6 = await api.call('connections.status', {});
const _oj = (_o6 && _o6.secrets) || {};
const next = { gemini: !!_oj.gemini_key, claude: !!_oj.claude_key };
const _o5 = settings.get('ai.available', null) || {};
if (_o5.gemini !== next.gemini || _o5.claude !== next.claude) await settings.set('ai.available', { ...next, at: Date.now() });
return _o0.availability();
},
async preflight(task, { provider: requested, feature, prompt = '', images, json } = {}) {
const p = _o0.provider(task, requested);
if (p === 'handoff_claude' || p === 'handoff_gemini' || p === 'ollama') return p;
await gate(task, p, { feature, prompt, images, json });
return p;
},
async run(task, { prompt = '', images, json, provider: requested, feature, confirmed, raw = false, temperature } = {}) {
if (!raw && typeof _o0.prefix === 'function') { try { const _oe = _o0.prefix(task, { json }); if (_oe) prompt = _oe + '\n\n[Yêu cầu]\n' + prompt; } catch { } }
const p = _o0.provider(task, requested);
if (p === 'handoff_claude' || p === 'handoff_gemini') {
const text = await _o0.handoff(task, prompt, { target: p === 'handoff_claude' ? 'claude' : 'gemini' });
return { text: text || '', provider: p, cost_usd: 0 };
}
if (p === 'ollama') {
try { return await _oi(prompt, { json, images, temperature }); } catch {
ui && ui.toast(t('ai.fallback'), 'info');
await gate(task, 'gemini', { feature, confirmed, prompt, images, json });
return _oh(task, 'gemini', { prompt, images, json });
}
}
await gate(task, p, { feature, confirmed, prompt, images, json });
try { return await _oh(task, p, { prompt, images, json }); } catch (e) {
if (e && e.code === 'QUOTA') {
_o0.overBudget = true;
if (p !== 'gemini') return _oh(task, 'gemini', { prompt, images, json });
}
throw e;
}
},
async checkOllama({ bridge = _o1() } = {}) {
for (const [url, via] of [[_oc + '/api/tags', 'direct'], [_o7 + '/ollama/api/tags', 'engine']].slice(0, bridge ? 2 : 1)) {
try {
const _og = await _o8(url, {}, OLLAMA_TIMEOUT);
if (_og.ok) { const _o6 = await _og.json(); return { ok: true, via, models: (_o6.models || []).map((_ob) => _ob.name) }; }
} catch { }
}
return { ok: false, models: [], via: null };
},
handoff(task, prompt, { target, provider } = {}) {
const { h, modal, button, copy, field } = ui;
target = target || (provider && /gemini/.test(provider) ? 'gemini' : 'claude');
prompt = String(prompt || '');
const ta = h('textarea', { class: 'handoff-prompt', readonly: true, rows: 6, 'aria-label': t('ai.handoff.title') });
ta.value = prompt;
ta.addEventListener('focus', () => ta.select());
const _od = field({ label: t('ai.handoff.paste'), type: 'textarea', rows: 5, name: 'handoff_result' });
const openClaude = async () => {
const { url, needsCopy } = claudeUrl(prompt);
if (needsCopy) { await copy(prompt, { silent: true }); ui.toast(t('ai.handoff.long'), 'info', 4500); }
window.open(url, '_blank', 'noopener');
};
const openGemini = async () => { await copy(prompt, { silent: true }); ui.toast(t('common.copied'), 'ok'); window.open('https://gemini.google.com/app', '_blank', 'noopener'); };
const body = h('div', { class: 'handoff' },
h('p', { class: 'muted' }, t('ai.handoff.lead')),
aiNote('handoff'),
ta,
h('div', { class: 'btn-row' },
button(t('common.copy'), () => copy(prompt), { kind: 'ghost', icon: 'log' }),
button(t('ai.handoff.open_claude'), openClaude, { kind: target === 'gemini' ? 'secondary' : 'primary', icon: 'sparkle' }),
button(t('ai.handoff.open_gemini'), openGemini, { kind: target === 'gemini' ? 'primary' : 'secondary', icon: 'sparkle' })),
_od);
const _ob = modal({
title: t('ai.handoff.title') + (t('ai.task.' + task) !== 'ai.task.' + task ? ' · ' + t('ai.task.' + task) : ''),
body, wide: true,
actions: [
{ label: t('common.cancel'), kind: 'ghost', value: null },
{ label: t('ai.handoff.use'), kind: 'primary', id: 'handoff-use', onClick: () => _od.getValue().trim() || null }
]
});
return _ob.done.then((v) => (typeof v === 'string' && v ? v : null));
}
};
return _o0;
}
export default createAI;

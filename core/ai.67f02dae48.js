import { t } from './i18n.39c909b69c.js';
import { aiConfirm, featureSpec, envFrom, cancelError, aiNote } from './ai_cost.4e4e8b66f1.js';
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
const _og = encodeURIComponent(prompt);
return _og.length <= HANDOFF_URL_LIMIT ? { url: 'https://claude.ai/new?q=' + _og, needsCopy: false } : { url: 'https://claude.ai/new', needsCopy: true };
}
async function _o8(url, opts, ms) {
const _o4 = new AbortController();
const _on = setTimeout(() => _o4.abort(), ms);
try { return await fetch(url, { ...opts, signal: _o4.signal }); } finally { clearTimeout(_on); }
}
export function createAI({ api, settings, ui, config = {} } = {}) {
const _od = config.OLLAMA_URL || 'http://127.0.0.1:11434';
const _o7 = config.ENGINE_URL || 'http://127.0.0.1:8765';
const _o3 = () => {
const _o9 = (k, _o6) => (settings ? settings.get(k, _o6) : _o6);
return { routes: _o9('ai.routes', {}) || {}, claude_enabled: !!_o9('ai.claude_api_enabled', false), ollama_model: _o9('ai.ollama_model', '') };
};
const _o1 = () => { try { return typeof _o0.bridge === 'function' ? _o0.bridge() !== false : true; } catch { return true; } };
async function _oj(prompt, { json, images } = {}) {
const model = _o3().ollama_model || DEFAULT_OLLAMA_MODEL;
const body = JSON.stringify({ model, prompt, stream: false, format: json ? 'json' : undefined, images: images && images.map((i) => i.b64) });
const _om = [_od + '/api/generate'].concat(_o1() ? [_o7 + '/ollama/api/generate'] : []);
let _ob;
for (const url of _om) {
try {
const _oh = await _o8(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }, OLLAMA_RUN_TIMEOUT);
if (!_oh.ok) throw new Error('ollama ' + _oh.status);
const _o6 = await _oh.json();
return { text: _o6.response || '', provider: 'ollama', tokens_in: _o6.prompt_eval_count || 0, tokens_out: _o6.eval_count || 0, cost_usd: 0 };
} catch (e) { _ob = e; }
}
throw _ob || new Error('ollama');
}
async function _oi(task, provider, { prompt, images, json }) {
return api.call('ai.run', { task, provider, prompt, images, json: !!json });
}
async function _oa(task, provider, { feature, confirmed, prompt, images, json }) {
if (confirmed) return;
const _ol = featureSpec(feature || null, { provider, task });
const ok = await (_o0.confirm || aiConfirm)(_ol, { env: envFrom(settings), prompt, images, json });
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
const _ok = (_o6 && _o6.secrets) || {};
const next = { gemini: !!_ok.gemini_key, claude: !!_ok.claude_key };
const _o5 = settings.get('ai.available', null) || {};
if (_o5.gemini !== next.gemini || _o5.claude !== next.claude) await settings.set('ai.available', { ...next, at: Date.now() });
return _o0.availability();
},
async run(task, { prompt = '', images, json, provider: requested, feature, confirmed } = {}) {
if (typeof _o0.prefix === 'function') { try { const _of = _o0.prefix(task, { json }); if (_of) prompt = _of + '\n\n[Yêu cầu]\n' + prompt; } catch { } }
const p = _o0.provider(task, requested);
if (p === 'handoff_claude' || p === 'handoff_gemini') {
const text = await _o0.handoff(task, prompt, { target: p === 'handoff_claude' ? 'claude' : 'gemini' });
return { text: text || '', provider: p, cost_usd: 0 };
}
if (p === 'ollama') {
try { return await _oj(prompt, { json, images }); } catch {
ui && ui.toast(t('ai.fallback'), 'info');
await _oa(task, 'gemini', { feature, confirmed, prompt, images, json });
return _oi(task, 'gemini', { prompt, images, json });
}
}
await _oa(task, p, { feature, confirmed, prompt, images, json });
try { return await _oi(task, p, { prompt, images, json }); } catch (e) {
if (e && e.code === 'QUOTA') {
_o0.overBudget = true;
if (p !== 'gemini') return _oi(task, 'gemini', { prompt, images, json });
}
throw e;
}
},
async checkOllama({ bridge = _o1() } = {}) {
for (const [url, via] of [[_od + '/api/tags', 'direct'], [_o7 + '/ollama/api/tags', 'engine']].slice(0, bridge ? 2 : 1)) {
try {
const _oh = await _o8(url, {}, OLLAMA_TIMEOUT);
if (_oh.ok) { const _o6 = await _oh.json(); return { ok: true, via, models: (_o6.models || []).map((_oc) => _oc.name) }; }
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
const _oe = field({ label: t('ai.handoff.paste'), type: 'textarea', rows: 5, name: 'handoff_result' });
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
_oe);
const _oc = modal({
title: t('ai.handoff.title') + (t('ai.task.' + task) !== 'ai.task.' + task ? ' · ' + t('ai.task.' + task) : ''),
body, wide: true,
actions: [
{ label: t('common.cancel'), kind: 'ghost', value: null },
{ label: t('ai.handoff.use'), kind: 'primary', id: 'handoff-use', onClick: () => _oe.getValue().trim() || null }
]
});
return _oc.done.then((v) => (typeof v === 'string' && v ? v : null));
}
};
return _o0;
}
export default createAI;

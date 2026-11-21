import { t } from './i18n.17f01a0b54.js';
import { mapLegacyProvider, connectedOnline, ONLINE_AI } from './ai_providers.596b40a694.js';
import { aiConfirm, featureSpec, envFrom, cancelError, aiNote } from './ai_cost.e55e3f489e.js';
const _oc = () => import('../shared/ai_rules.js');
export { ONLINE_AI };
export const PROVIDERS = ['gemini', 'handoff_claude', 'handoff_gemini', 'claude_api'];
export const TASKS = ['zalo_draft', 'summarize', 'read_policy', 'ideas', 'script', 'staff', 'assistant'];
export const DEFAULT_ROUTES = { zalo_draft: 'gemini', summarize: 'gemini', read_policy: 'gemini', ideas: 'gemini', script: 'gemini', staff: 'gemini', assistant: 'gemini' };
export const HANDOFF_URL_LIMIT = 6000;
export function pickProvider(task, { routes = {}, requested, claudeEnabled = false, overBudget = false, available = null } = {}) {
let p = requested || routes[task] || DEFAULT_ROUTES[task] || 'gemini';
p = mapLegacyProvider(p, available ? { ...available, claude: !!available.claude && !!claudeEnabled } : null);
if (!PROVIDERS.includes(p)) p = 'gemini';
if (p === 'claude_api' && (!claudeEnabled || overBudget)) p = 'gemini';
return p;
}
export function aiAvailable({ available, claudeEnabled = false } = {}) {
if (!available || typeof available !== 'object') return { gemini: true, claude: !!claudeEnabled, any: true, known: false };
const gemini = !!available.gemini; const claude = !!available.claude && !!claudeEnabled;
return { gemini, claude, any: gemini || claude, known: true };
}
export const onlineConnected = (avail) => connectedOnline(avail);
export function claudeUrl(prompt) {
const _ob = encodeURIComponent(prompt);
return _ob.length <= HANDOFF_URL_LIMIT ? { url: 'https://claude.ai/new?q=' + _ob, needsCopy: false } : { url: 'https://claude.ai/new', needsCopy: true };
}
export function createAI({ api, settings, ui, config = {} } = {}) {
void config;
const _o2 = () => {
const _o6 = (k, _o5) => (settings ? settings.get(k, _o5) : _o5);
return { routes: _o6('ai.routes', {}) || {}, claude_enabled: !!_o6('ai.claude_api_enabled', false) };
};
async function _od(task, provider, { prompt, images, json, grounding }) {
const body = { task, provider, prompt, images, json: !!json };
if (grounding && provider === 'gemini') body.grounding = true;
return api.call('ai.run', body);
}
async function gate(task, provider, { feature, confirmed, prompt, images, json }) {
if (confirmed) return;
const _of = featureSpec(feature || null, { provider, task });
const _o8 = await (_o0.confirm || aiConfirm)(_of, { env: envFrom(settings), prompt, images, json });
if (!_o8) throw cancelError();
}
const _o0 = {
PROVIDERS, TASKS,
routes() { return { ...DEFAULT_ROUTES, ...(_o2().routes || {}) }; },
async setRoute(task, provider) {
const routes = { ...(_o2().routes || {}), [task]: provider };
await settings.set('ai.routes', routes);
},
provider(task, requested) {
const _o1 = _o2();
return pickProvider(task, { routes: _o0.routes(), requested, claudeEnabled: !!_o1.claude_enabled, overBudget: !!_o0.overBudget, available: _o0.availability() });
},
overBudget: false,
availability() {
const _o6 = (k, _o5) => (settings ? settings.get(k, _o5) : _o5);
return aiAvailable({ available: _o6('ai.available', null), claudeEnabled: !!_o6('ai.claude_api_enabled', false) });
},
connected() { return _o0.availability().any; },
async refreshAvailability() {
const _o5 = await api.call('connections.status', {});
const _oe = (_o5 && _o5.secrets) || {};
const next = { gemini: !!_oe.gemini_key, claude: !!_oe.claude_key };
const _o4 = settings.get('ai.available', null) || {};
if (_o4.gemini !== next.gemini || _o4.claude !== next.claude) await settings.set('ai.available', { ...next, at: Date.now() });
return _o0.availability();
},
async preflight(task, { provider: requested, feature, prompt = '', images, json } = {}) {
const p = _o0.provider(task, requested);
if (p === 'handoff_claude' || p === 'handoff_gemini') return p;
await gate(task, p, { feature, prompt, images, json });
return p;
},
async run(task, { prompt = '', images, json, provider: requested, feature, confirmed, raw = false, grounding = false } = {}) {
if (!raw && typeof _o0.prefix === 'function') { try { const _oa = _o0.prefix(task, { json }); if (_oa) prompt = _oa + '\n\n[Yêu cầu]\n' + prompt; } catch { } }
prompt = (await _oc()).applyRules(prompt, { json: !!json });
const p = _o0.provider(task, requested);
if (p === 'handoff_claude' || p === 'handoff_gemini') {
const text = await _o0.handoff(task, prompt, { target: p === 'handoff_claude' ? 'claude' : 'gemini' });
return { text: text || '', provider: p, cost_usd: 0 };
}
await gate(task, p, { feature, confirmed, prompt, images, json });
try { return await _od(task, p, { prompt, images, json, grounding }); } catch (e) {
if (e && e.code === 'QUOTA') {
_o0.overBudget = true;
if (p !== 'gemini') return _od(task, 'gemini', { prompt, images, json });
}
throw e;
}
},
async handoff(task, prompt, { target, provider } = {}) {
const { h, modal, button, copy, field } = ui;
target = target || (provider && /gemini/.test(provider) ? 'gemini' : 'claude');
prompt = (await _oc()).applyRules(String(prompt || ''));
const ta = h('textarea', { class: 'handoff-prompt', readonly: true, rows: 6, 'aria-label': t('ai.handoff.title') });
ta.value = prompt;
ta.addEventListener('focus', () => ta.select());
const _o9 = field({ label: t('ai.handoff.paste'), type: 'textarea', rows: 5, name: 'handoff_result' });
const openClaude = async () => {
const { url, needsCopy } = claudeUrl(prompt);
if (needsCopy) { await copy(prompt, { silent: true }); ui.toast(t('ai.handoff.long'), 'info', 4500); }
window.open(url, '_blank', 'noopener');
};
const _o3 = (() => { try { return !!_o0.availability().claude; } catch { return false; } })();
if (!_o3) target = 'gemini';
const openGemini = async () => { await copy(prompt, { silent: true }); ui.toast(t('common.copied'), 'ok'); window.open('https://gemini.google.com/app', '_blank', 'noopener'); };
const body = h('div', { class: 'handoff' },
h('p', { class: 'muted' }, t('ai.handoff.lead')),
aiNote('handoff'),
ta,
h('div', { class: 'btn-row' },
button(t('common.copy'), () => copy(prompt), { kind: 'ghost', icon: 'log' }),
_o3 ? button(t('ai.handoff.open_claude'), openClaude, { kind: target === 'gemini' ? 'secondary' : 'primary', icon: 'sparkle' }) : null,
button(t('ai.handoff.open_gemini'), openGemini, { kind: target === 'gemini' ? 'primary' : 'secondary', icon: 'sparkle' })),
_o9);
const _o7 = modal({
title: t('ai.handoff.title') + (t('ai.task.' + task) !== 'ai.task.' + task ? ' · ' + t('ai.task.' + task) : ''),
body, wide: true,
actions: [
{ label: t('common.cancel'), kind: 'ghost', value: null },
{ label: t('ai.handoff.use'), kind: 'primary', id: 'handoff-use', onClick: () => _o9.getValue().trim() || null }
]
});
return _o7.done.then((v) => (typeof v === 'string' && v ? v : null));
}
};
return _o0;
}
export default createAI;

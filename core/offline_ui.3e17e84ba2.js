import { t } from './i18n.17f01a0b54.js';
import { runDiagnosis, buildReport, DIAG_TIMEOUT_MS, classifyError } from './netdiag.4a5dd35d06.js';
import { deviceName } from './auth.c3ca8814ab.js';
const appUrl = () => { try { return new URL('version.json', document.baseURI).href; } catch { return 'version.json'; } };
export async function probeApp(ms = 4000) {
if (typeof navigator !== 'undefined' && navigator.onLine === false) return false;
const _o2 = new AbortController(); const _oa = setTimeout(() => _o2.abort(), ms);
try { const _o6 = await fetch(appUrl() + '?nd=' + Date.now(), { method: 'HEAD', cache: 'no-store', credentials: 'omit', signal: _o2.signal }); return _o6.status > 0 && _o6.status < 500; } catch { return false; } finally { clearTimeout(_oa); }
}
export async function classifyWithProbe(e) {
const online = typeof navigator === 'undefined' ? true : navigator.onLine !== false;
const _o4 = e && (e.code === 'NETWORK' || e.net === 'html');
const appReachable = _o4 ? (online ? await probeApp() : false) : null;
return classifyError(e, { online, appReachable });
}
export function openDiagnosis({ ui, api, config = {} }) {
const { h, button } = ui;
const list = h('ol', { class: 'nd-steps', 'data-testid': 'diag-steps' });
const verdict = h('p', { class: 'nd-verdict', 'data-testid': 'diag-verdict', 'aria-live': 'polite' }, t('net.diag.running'));
const advice = h('ul', { class: 'nd-advice', 'data-testid': 'diag-advice' });
const _o5 = h('pre', { class: 'nd-report small', 'data-testid': 'diag-report' });
const say = h('p', { class: 'muted small', 'aria-live': 'polite' }, t('net.diag.copy_note'));
let report = '';
const copyBtn = button(t('net.diag.copy'), async () => {
if (!report) return;
const ok = await ui.copy(report, { silent: true });
if (!ok) { try { const _o6 = document.createRange(); _o6.selectNodeContents(_o5); const _o9 = getSelection(); _o9.removeAllRanges(); _o9.addRange(_o6); } catch { } }
say.textContent = ok ? t('common.copied') : 'Chưa chép được – đã bôi đen sẵn, bấm giữ để chép.';
}, { kind: 'primary', icon: 'check', testid: 'diag-copy', disabled: true });
const _o1 = button(t('net.diag.again'), () => _o7(), { kind: 'secondary', icon: 'refresh', testid: 'diag-again', disabled: true });
const body = h('div', { class: 'nd-box', 'data-testid': 'diag-box' }, h('p', { class: 'muted' }, t('net.diag.lead')), list, verdict, advice,
h('div', { class: 'nd-acts' }, copyBtn, _o1), say, h('details', { class: 'nd-raw' }, h('summary', null, 'Xem văn bản sẽ chép'), _o5));
const _o3 = ui.modal({ title: t('net.diag.title'), body, cls: 'nd-modal' });
async function _o7() {
copyBtn.disabled = true; _o1.disabled = true; report = '';
while (list.firstChild) list.removeChild(list.firstChild);
while (advice.firstChild) advice.removeChild(advice.firstChild);
list.appendChild(h('li', { class: 'nd-step' }, ui.spinner(), h('span', null, t('net.diag.running'))));
verdict.textContent = t('net.diag.running');
const _o6 = await runDiagnosis({ appUrl: appUrl(), serverUrl: api.mode === 'demo' ? '' : api.url, timeoutMs: DIAG_TIMEOUT_MS });
while (list.firstChild) list.removeChild(list.firstChild);
for (const _o8 of _o6.steps) {
list.appendChild(h('li', { class: 'nd-step', dataset: { ok: _o8.ok === true ? '1' : _o8.ok === false ? '0' : '-' }, 'data-testid': 'diag-step-' + _o8.id },
h('span', { class: 'nd-mark', 'aria-hidden': 'true' }, _o8.ok === true ? '✓' : _o8.ok === false ? '✗' : '–'),
h('span', { class: 'nd-label' }, h('strong', null, _o8.label), h('span', { class: 'nd-det' }, _o8.detail + (_o8.ms ? ' · ' + (_o8.ms / 1000).toFixed(1) + ' giây' : '')))));
}
verdict.textContent = t('net.verdict.' + _o6.verdict);
verdict.dataset.verdict = _o6.verdict;
for (const _o0 of _o6.advice) advice.appendChild(h('li', null, _o0));
report = buildReport(_o6, { appVersion: config.APP_VERSION || '', device: deviceName(), online: navigator.onLine !== false, serverUrl: api.mode === 'demo' ? '' : api.url, at: Date.now() });
_o5.textContent = report;
copyBtn.disabled = false; _o1.disabled = false;
return _o6;
}
const done = _o7();
return { modal: _o3, done };
}
export function offlineBannerEl(ui, { text, tone = 'warn', action, actionLabel }) {
const { h, button } = ui;
return h('div', { class: 'off-banner off-' + tone, role: 'status', 'aria-live': 'polite', 'data-testid': 'offline-banner', dataset: { tone } },
h('span', { class: 'off-dot', 'aria-hidden': 'true' }),
h('span', { class: 'off-text', 'data-testid': 'offline-banner-text' }, text),
action ? button(actionLabel, action, { kind: 'primary', small: true, testid: 'offline-relogin' }) : null);
}

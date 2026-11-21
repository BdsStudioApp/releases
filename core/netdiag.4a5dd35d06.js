import { t } from './i18n.17f01a0b54.js';
import { DIAG_TIMEOUT_MS } from './offline_mode.59a2654a2e.js';
export { LOGIN_TIMEOUT_MS, BOOT_STATUS_MS, DIAG_TIMEOUT_MS, isNetworkKind } from './offline_mode.59a2654a2e.js';
const _og = (ms) => Math.round((Number(ms) || 0) / 1000);
export function classifyError(e, { online = true, appReachable = null } = {}) {
const code = String((e && e.code) || '');
const net = e && e.net;
if (code === 'AUTH_INVALID' || code === 'AUTH_REQUIRED' || code === 'LOCKED' || code === 'MUST_CHANGE_PW' || code === 'TFA_REQUIRED') {
return { kind: 'auth', reason: code, code, message: (e && e.userMessage) || '' };
}
const _oc = code === 'NETWORK' || net === 'html' || net === 'fail' || net === 'timeout';
if (_oc && (online === false || appReachable === false)) {
return { kind: 'offline', reason: 'offline', code: 'NETWORK', message: t('net.cls.offline') };
}
if (code === 'NETWORK' && net === 'timeout') {
return { kind: 'unreachable', reason: 'timeout', code: 'TIMEOUT', message: t('net.cls.timeout', { s: _og(e.timeoutMs) || _og(LOGIN_TIMEOUT_MS) }) };
}
if (code === 'NETWORK') return { kind: 'unreachable', reason: 'fail', code: 'NETWORK', message: t('net.cls.blocked') };
if (net === 'html') return { kind: 'unreachable', reason: 'html', code: 'HTML', message: t('net.cls.html') };
if (net === 'http' || Number(e && e.status) >= 500) {
const _o2 = 'HTTP ' + (Number(e && e.status) || 500);
return { kind: 'server', reason: 'http', code: _o2, message: t('net.cls.server', { code: _o2 }) };
}
if (['QUOTA', 'INTERNAL', 'NOT_SETUP', 'UNKNOWN_ACTION'].includes(code)) {
return { kind: 'server', reason: 'error', code, message: t('net.cls.server', { code }) + (e && e.userMessage && e.userMessage !== t('err.generic') ? ' ' + e.userMessage : '') };
}
return { kind: 'other', reason: code || 'other', code, message: (e && (e.userMessage || e.message)) || t('err.generic') };
}
export function maskServerUrl(url) {
const s = String(url || '').trim();
if (!s) return t('net.demo');
let _ol;
try { _ol = new URL(s); } catch { return '(URL không đọc được)'; }
const _oe = _ol.pathname.split('/').filter(Boolean).map((p) => (p.length > 12 ? p.slice(0, 4) + '…' + p.slice(-3) : p));
return _ol.hostname + (_oe.length ? '/' + _oe.join('/') : '');
}
async function _ok(fetchImpl, url, opts, ms) {
const _oj = Date.now();
const _o3 = typeof AbortController !== 'undefined' ? new AbortController() : null;
let timedOut = false, timer = null;
const _o5 = new Promise((_r, rej) => { timer = setTimeout(() => { timedOut = true; if (_o3) _o3.abort(); rej(new Error('timeout')); }, ms); });
try {
const res = await Promise.race([fetchImpl(url, { ...opts, signal: _o3 ? _o3.signal : undefined }), _o5]);
let text = '';
if (opts.readText) text = String(await Promise.race([res.text(), _o5]) || '');
return { res, text, timedOut: false, ms: Date.now() - _oj };
} catch (error) {
return { error, timedOut, ms: Date.now() - _oj };
} finally { clearTimeout(timer); }
}
const _oa = (s) => /^\s*</.test(String(s || ''));
export async function runDiagnosis({ fetchImpl, appUrl, serverUrl, timeoutMs = DIAG_TIMEOUT_MS } = {}) {
const _o6 = fetchImpl || globalThis.fetch.bind(globalThis);
const steps = [];
const _o0 = await _ok(_o6, appUrl + (String(appUrl).includes('?') ? '&' : '?') + 'nd=' + Date.now(), { method: 'HEAD', cache: 'no-store', credentials: 'omit' }, timeoutMs);
const _o1 = !!(_o0.res && Number(_o0.res.status) > 0 && Number(_o0.res.status) < 500);
steps.push({ id: 'app', label: t('net.step.app'), ok: _o1, ms: _o0.ms,
detail: _o1 ? 'HTTP ' + _o0.res.status : _o0.timedOut ? t('net.det.timeout', { s: _og(timeoutMs) }) : _o0.res ? 'HTTP ' + _o0.res.status : t('net.det.fail') });
let verdict = 'ok', reason = '', serverVersion = '';
if (!serverUrl) {
steps.push({ id: 'server', label: t('net.step.server'), ok: null, ms: 0, detail: t('net.demo') });
steps.push({ id: 'reply', label: t('net.step.reply'), ok: null, ms: 0, detail: t('net.det.skip') });
verdict = _o1 ? 'demo' : 'offline';
return { steps, verdict, reason, serverVersion, advice: adviceFor(verdict) };
}
const s = await _ok(_o6, serverUrl, {
method: 'POST', redirect: 'follow', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
body: JSON.stringify({ action: 'status', payload: {} }), readText: true
}, timeoutMs);
const _of = !!s.res;
steps.push({ id: 'server', label: t('net.step.server'), ok: _of, ms: s.ms,
detail: _of ? 'HTTP ' + s.res.status : s.timedOut ? t('net.det.timeout', { s: _og(timeoutMs) }) : t('net.det.fail') });
if (!_of) {
steps.push({ id: 'reply', label: t('net.step.reply'), ok: false, ms: 0, detail: t('net.det.skip') });
verdict = _o1 ? 'blocked' : 'offline'; reason = s.timedOut ? 'timeout' : 'fail';
} else {
let _o7 = null; try { _o7 = JSON.parse(s.text); } catch { }
const _oh = Number(s.res.status) || 0;
if (_o7 && _o7.ok && _o7.data && _o7.data.version) {
serverVersion = String(_o7.data.version);
steps.push({ id: 'reply', label: t('net.step.reply'), ok: true, ms: s.ms, detail: t('net.det.version', { v: serverVersion }) });
} else if (_oh >= 500) {
steps.push({ id: 'reply', label: t('net.step.reply'), ok: false, ms: s.ms, detail: t('net.det.http', { code: 'HTTP ' + _oh }) });
verdict = 'server'; reason = 'http';
} else if (_o7 && _o7.ok === false) {
const _o2 = String((_o7.error && _o7.error.code) || 'INTERNAL');
steps.push({ id: 'reply', label: t('net.step.reply'), ok: false, ms: s.ms, detail: t('net.det.http', { code: _o2 }) });
verdict = 'server'; reason = _o2;
} else {
steps.push({ id: 'reply', label: t('net.step.reply'), ok: false, ms: s.ms, detail: _oa(s.text) ? t('net.det.html') : t('net.det.bad') });
verdict = 'html'; reason = 'html';
}
}
return { steps, verdict, reason, serverVersion, advice: adviceFor(verdict) };
}
export function adviceFor(verdict) {
const _o8 = { ok: ['net.adv.ok'], demo: ['net.adv.demo'], offline: ['net.adv.wifi', 'net.adv.airplane'],
blocked: ['net.adv.switch', 'net.adv.vpn', 'net.adv.relay', 'net.adv.adblock', 'net.adv.private', 'net.adv.wait'],
html: ['net.adv.portal', 'net.adv.switch', 'net.adv.vpn', 'net.adv.relay'],
server: ['net.adv.wait', 'net.adv.send'] }[verdict] || ['net.adv.send'];
return _o8.map((x) => t(x));
}
const _od = (n) => String(n).padStart(2, '0');
function _oi(ms) { const _o4 = new Date(ms); return `${_od(_o4.getHours())}:${_od(_o4.getMinutes())} ${_od(_o4.getDate())}/${_od(_o4.getMonth() + 1)}/${_o4.getFullYear()}`; }
const _ob = (ok) => (ok === true ? '✓' : ok === false ? '✗' : '–');
export function buildReport(r, { appVersion = '', device = '', online = true, serverUrl = '', at = Date.now() } = {}) {
const _o9 = [
t('net.rep.title'),
'Lúc: ' + _oi(at),
'App: ' + (appVersion || '?') + ' · Máy: ' + (device || '?') + ' · Mạng trên máy: ' + (online === false ? 'tắt' : 'bật'),
'Máy chủ: ' + maskServerUrl(serverUrl) + (r && r.serverVersion ? ' · bản ' + r.serverVersion : ''),
''
];
for (const s of (r && r.steps) || []) _o9.push(`${_ob(s.ok)} ${s.label} – ${s.detail} (${Math.round(Number(s.ms) || 0)} ms)`);
_o9.push('', 'Kết luận: ' + t('net.verdict.' + ((r && r.verdict) || 'ok')));
for (const _o0 of (r && r.advice) || []) _o9.push('• ' + _o0);
return _o9.join('\n');
}

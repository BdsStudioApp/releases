import { t } from './i18n.39c909b69c.js';
import { isMissingActionError, MISSING_ACTION_TEXT } from './health_logic.9704b81308.js';
import { gated, withSetupGate, saveSetupCode, clearSetupGate, setupCodeAsker } from './setup_gate.d66104e8e0.js';
export class ApiError extends Error {
constructor(code, message, extra = {}) {
super(message || code);
this.name = 'ApiError';
this.code = code;
this.userMessage = message;
Object.assign(this, extra);
}
}
const _o4 = 'bds:script_url';
const _o3 = 'bds:token';
const _o2 = 'bds:token_exp';
const _o1 = 'bds:device_id';
const ls = {
get(_oj) { try { return localStorage.getItem(_oj); } catch { return null; } },
set(_oj, v) { try { if (v == null) localStorage.removeItem(_oj); else localStorage.setItem(_oj, v); } catch { } }
};
export function newId() {
const r = new Uint8Array(6);
(globalThis.crypto || {}).getRandomValues ? crypto.getRandomValues(r) : r.forEach((_, _oi) => { r[_oi] = Math.random() * 256; });
return Date.now().toString(36) + [...r].map((_o8) => _o8.toString(36).padStart(2, '0')).join('').slice(0, 10);
}
export function scriptUrl(config) {
const saved = ls.get(_o4);
return (saved != null && saved !== '' ? saved : (config && config.SCRIPT_URL) || '').trim();
}
export function saveScriptUrl(url) { ls.set(_o4, url ? String(url).trim() : null); }
const _o0 = new Set(['AUTH_REQUIRED', 'AUTH_INVALID']);
export const LONG_ACTION_RE = /^(ai\.|video\.ai_script$|video\.ai_online_start$|g4\.site_search$|catalog\.(research|research_new|extract)$|g1\.research$|videoai\.)/;
export const LONG_ACTION_MS = 150000;
export function timeoutFor(action, explicit, def = 30000) {
if (Number(explicit) > 0) return Number(explicit);
return LONG_ACTION_RE.test(String(action || '')) ? LONG_ACTION_MS : def;
}
export const NOT_PUBLIC_MSG = "Lúc Triển khai chưa chọn 'Bất kỳ ai' – vào Triển khai › Quản lý triển khai › sửa → Bất kỳ ai";
export function createApi({ config = {}, mockFactory, fetchImpl, timeoutMs = 30000 } = {}) {
const url = scriptUrl(config);
const mode = url ? 'gas' : 'demo';
const _o7 = new Set();
const _om = new Set();
const missingAction = new Set();
let _ol = null;
let _od = ls.get(_o1);
if (!_od) { _od = 'dev_' + newId(); ls.set(_o1, _od); }
async function _oh() {
if (!_ol) {
_ol = (async () => {
const _og = mockFactory || (await import('./mock-backend.13a6227e29.js')).createMockBackend;
const _o9 = await _og();
return _o9;
})().catch((e) => { _ol = null; throw e; });
}
return _ol;
}
async function _or(_on, ms = timeoutMs) {
if (mode === 'demo') {
const _o9 = await _oh();
const _oo = await _o9.call(JSON.parse(JSON.stringify(_on)));
return typeof _oo === 'string' ? JSON.parse(_oo) : _oo;
}
const _of = fetchImpl || globalThis.fetch.bind(globalThis);
const _ob = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _op = _ob ? setTimeout(() => _ob.abort(), Math.max(1000, Number(ms) || timeoutMs)) : null;
try {
const r = await _of(url, {
method: 'POST', redirect: 'follow', credentials: 'omit',
headers: { 'Content-Type': 'text/plain;charset=utf-8' },
body: JSON.stringify(_on), signal: _ob ? _ob.signal : undefined
});
const _ok = !!(r.redirected && /^https:\/\/accounts\.google\.com\//.test(String(r.url || '')));
const text = await r.text();
if (_ok || r.type === 'opaqueredirect' || /^\s*<(!doctype|html|head|body|meta)/i.test(text)) throw new ApiError('NOT_PUBLIC', NOT_PUBLIC_MSG, { status: r.status, html: true });
try { return JSON.parse(text); } catch { throw new ApiError('INTERNAL', t('err.generic'), { status: r.status }); }
} catch (e) {
if (e instanceof ApiError) throw e;
throw new ApiError('NETWORK', t('err.network'), { cause: e });
} finally { if (_op) clearTimeout(_op); }
}
const _o5 = {
mode,
url,
missingActionText: '',
get token() { return ls.get(_o3); },
get expiresAt() { return Number(ls.get(_o2)) || 0; },
get _od() { return _od; },
hasValidToken() { const _oq = ls.get(_o3); return !!_oq && (!this.expiresAt || this.expiresAt > Date.now()); },
setSession({ token, expires_at, device_id } = {}) {
if (token) ls.set(_o3, token);
if (expires_at) ls.set(_o2, String(expires_at));
if (device_id) { _od = device_id; ls.set(_o1, device_id); }
},
clearSession() { ls.set(_o3, null); ls.set(_o2, null); },
onAuthLost(_oa) { _o7.add(_oa); return () => _o7.delete(_oa); },
onMustChange(_oa) { _om.add(_oa); return () => _om.delete(_oa); },
onMissingAction(_oa) { missingAction.add(_oa); return () => missingAction.delete(_oa); },
async request(_on) { return _or(_on); },
async call(action, payload = {}, opts = {}) {
if (gated(action, payload)) {
for (let _oi = 0; ; _oi++) {
try { const _oc = await _o5.callRaw(action, withSetupGate(action, payload), opts); if (action === 'setup') clearSetupGate(); return _oc; } catch (e) {
const _o6 = setupCodeAsker();
if (!e || e.code !== 'SETUP_CODE' || !_o6 || _oi >= 3) throw e;
const code = await _o6(e);
if (!code || !saveSetupCode(code)) throw e;
}
}
}
return _o5.callRaw(action, payload, opts);
},
async callRaw(action, payload = {}, opts = {}) {
const _on = { action, token: ls.get(_o3) || '', device_id: _od, payload: payload || {} };
const _oo = await _or(_on, timeoutFor(action, opts && opts.timeoutMs, timeoutMs));
if (!_oo || typeof _oo !== 'object') throw new ApiError('INTERNAL', t('err.generic'));
if (_oo.ok) return _oo.data;
const _oe = _oo.error || {};
const extra = {};
for (const _oj of Object.keys(_oe)) if (!['code', 'message', 'name', 'stack', 'cause', 'constructor'].includes(_oj) && /^[a-z_]{1,40}$/.test(_oj)) extra[_oj] = _oe[_oj];
const e = new ApiError(_oe.code || 'INTERNAL', _oe.message || t('err.generic'), { ...extra, retry_at: _oe.retry_at, action });
const _os = action === 'password.change' && /Mật khẩu cũ/.test(String(_oe.message || ''));
if (_o0.has(e.code) && !_os && !['login', 'setup', 'status', 'salt.get', 'password.reset_request', 'password.reset_confirm', 'auth.tfa_verify', 'auth.tfa_resend', 'auth.device_deny', 'auth.device_verify', 'auth.device_resend'].includes(action)) {
for (const _oa of _o7) { try { _oa(e); } catch { } }
}
if (isMissingActionError(e)) {
e.missingAction = true; e.serverMessage = e.message; e.userMessage = _o5.missingActionText || MISSING_ACTION_TEXT;
for (const _oa of missingAction) { try { _oa(e); } catch { } }
}
if (e.code === 'MUST_CHANGE_PW' && !['password.change', 'me', 'logout'].includes(action)) {
for (const _oa of _om) { try { _oa(e); } catch { } }
}
throw e;
},
async seedDemo() {
if (mode !== 'demo') return false;
const _o8 = await _oh();
if (typeof _o8.seedDemo === 'function') { await _o8.seedDemo(); return true; }
return false;
},
async demoOutbox() {
if (mode !== 'demo') return [];
const _o8 = await _oh();
return typeof _o8.outbox === 'function' ? _o8.outbox() : [];
}
};
return _o5;
}
export default createApi;

import { t } from './i18n.17f01a0b54.js';
import { isMissingActionError, MISSING_ACTION_TEXT } from './health_logic.4992b5e758.js';
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
get(_ok) { try { return localStorage.getItem(_ok); } catch { return null; } },
set(_ok, v) { try { if (v == null) localStorage.removeItem(_ok); else localStorage.setItem(_ok, v); } catch { } }
};
export function newId() {
const r = new Uint8Array(6);
(globalThis.crypto || {}).getRandomValues ? crypto.getRandomValues(r) : r.forEach((_, _oj) => { r[_oj] = Math.random() * 256; });
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
const _on = new Set();
const missingAction = new Set();
let _om = null;
let _od = ls.get(_o1);
if (!_od) { _od = 'dev_' + newId(); ls.set(_o1, _od); }
async function _oi() {
if (!_om) {
_om = (async () => {
const _oh = mockFactory || (await import('./mock-backend.e15c116df4.js')).createMockBackend;
const _o9 = await _oh(config && config.NO_VIDEO === true ? { noVideo: true } : undefined);
return _o9;
})().catch((e) => { _om = null; throw e; });
}
return _om;
}
async function _os(_oo, ms = timeoutMs) {
if (mode === 'demo') {
const _o9 = await _oi();
const _op = await _o9.call(JSON.parse(JSON.stringify(_oo)));
return typeof _op === 'string' ? JSON.parse(_op) : _op;
}
const _og = fetchImpl || globalThis.fetch.bind(globalThis);
const _ob = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _ot = Math.max(1000, Number(ms) || timeoutMs);
let _oq = false, timer = null;
const _of = new Promise((_res, rej) => { timer = setTimeout(() => { _oq = true; if (_ob) _ob.abort(); rej(new Error('timeout')); }, _ot); });
try {
const r = await Promise.race([_og(url, {
method: 'POST', redirect: 'follow', credentials: 'omit',
headers: { 'Content-Type': 'text/plain;charset=utf-8' },
body: JSON.stringify(_oo), signal: _ob ? _ob.signal : undefined
}), _of]);
const _ol = !!(r.redirected && /^https:\/\/accounts\.google\.com\//.test(String(r.url || '')));
const text = await Promise.race([r.text(), _of]);
if (!_ol && Number(r.status) >= 500) { try { return JSON.parse(text); } catch { throw new ApiError('INTERNAL', t('err.generic'), { status: r.status, net: 'http' }); } }
if (_ol || r.type === 'opaqueredirect' || /^\s*<(!doctype|html|head|body|meta)/i.test(text)) throw new ApiError('NOT_PUBLIC', NOT_PUBLIC_MSG, { status: r.status, html: true, net: 'html' });
try { return JSON.parse(text); } catch {
throw new ApiError('INTERNAL', t('err.generic'), { status: r.status, net: Number(r.status) >= 500 ? 'http' : 'html' });
}
} catch (e) {
if (e instanceof ApiError) throw e;
throw new ApiError('NETWORK', t('err.network'), { cause: e, net: _oq ? 'timeout' : 'fail', timeoutMs: _ot });
} finally { if (timer) clearTimeout(timer); }
}
const _o5 = {
mode,
url,
missingActionText: '',
get token() { return ls.get(_o3); },
get expiresAt() { return Number(ls.get(_o2)) || 0; },
get _od() { return _od; },
hasValidToken() { const _or = ls.get(_o3); return !!_or && (!this.expiresAt || this.expiresAt > Date.now()); },
setSession({ token, expires_at, device_id } = {}) {
if (token) ls.set(_o3, token);
if (expires_at) ls.set(_o2, String(expires_at));
if (device_id) { _od = device_id; ls.set(_o1, device_id); }
},
clearSession() { ls.set(_o3, null); ls.set(_o2, null); },
onAuthLost(_oa) { _o7.add(_oa); return () => _o7.delete(_oa); },
onMustChange(_oa) { _on.add(_oa); return () => _on.delete(_oa); },
onMissingAction(_oa) { missingAction.add(_oa); return () => missingAction.delete(_oa); },
async request(_oo, opts = {}) { return _os(_oo, (opts && opts.timeoutMs) || timeoutMs); },
async call(action, payload = {}, opts = {}) {
if (gated(action, payload)) {
for (let _oj = 0; ; _oj++) {
try { const _oc = await _o5.callRaw(action, withSetupGate(action, payload), opts); if (action === 'setup') clearSetupGate(); return _oc; } catch (e) {
const _o6 = setupCodeAsker();
if (!e || e.code !== 'SETUP_CODE' || !_o6 || _oj >= 3) throw e;
const code = await _o6(e);
if (!code || !saveSetupCode(code)) throw e;
}
}
}
return _o5.callRaw(action, payload, opts);
},
async callRaw(action, payload = {}, opts = {}) {
const _oo = { action, token: ls.get(_o3) || '', device_id: _od, payload: payload || {} };
const _op = await _os(_oo, timeoutFor(action, opts && opts.timeoutMs, timeoutMs));
if (!_op || typeof _op !== 'object') throw new ApiError('INTERNAL', t('err.generic'));
if (_op.ok) return _op.data;
const _oe = _op.error || {};
const extra = {};
for (const _ok of Object.keys(_oe)) if (!['code', 'message', 'name', 'stack', 'cause', 'constructor'].includes(_ok) && /^[a-z_]{1,40}$/.test(_ok)) extra[_ok] = _oe[_ok];
const e = new ApiError(_oe.code || 'INTERNAL', _oe.message || t('err.generic'), { ...extra, retry_at: _oe.retry_at, action });
const _ou = action === 'password.change' && /Mật khẩu cũ/.test(String(_oe.message || ''));
if (_o0.has(e.code) && !_ou && !['login', 'setup', 'status', 'salt.get', 'password.reset_request', 'password.reset_confirm', 'auth.tfa_verify', 'auth.tfa_resend', 'auth.device_deny', 'auth.device_verify', 'auth.device_resend'].includes(action)) {
for (const _oa of _o7) { try { _oa(e); } catch { } }
}
if (isMissingActionError(e)) {
e.missingAction = true; e.serverMessage = e.message; e.userMessage = _o5.missingActionText || MISSING_ACTION_TEXT;
for (const _oa of missingAction) { try { _oa(e); } catch { } }
}
if (e.code === 'MUST_CHANGE_PW' && !['password.change', 'me', 'logout'].includes(action)) {
for (const _oa of _on) { try { _oa(e); } catch { } }
}
throw e;
},
async seedDemo() {
if (mode !== 'demo') return false;
const _o8 = await _oi();
if (typeof _o8.seedDemo === 'function') { await _o8.seedDemo(); return true; }
return false;
},
async demoOutbox() {
if (mode !== 'demo') return [];
const _o8 = await _oi();
return typeof _o8.outbox === 'function' ? _o8.outbox() : [];
}
};
return _o5;
}
export default createApi;

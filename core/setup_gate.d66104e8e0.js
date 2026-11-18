export const TOKEN_KEY = 'bds:setup:ma';
export const CODE_KEY = 'bds:setup:code';
export const TOKEN_RE = /^[a-f0-9]{32,64}$/;
const _o4 = () => { try { return globalThis.sessionStorage || null; } catch { return null; } };
const get = (k) => { try { const _o3 = _o4(); return _o3 ? _o3.getItem(k) || '' : ''; } catch { return ''; } };
const _o2 = (k, _o6) => { try { const _o3 = _o4(); if (_o3) { if (_o6) _o3.setItem(k, _o6); else _o3.removeItem(k); } } catch { } };
export function gated(action, payload) {
return action === 'setup' || action === 'email.verify_check' || (action === 'email.verify_start' && payload && payload.purpose === 'setup');
}
export function adoptSetupToken(q) {
const _o6 = String((q && q.get && q.get('ma_cai')) || '').trim().toLowerCase();
if (!TOKEN_RE.test(_o6)) return false;
_o2(TOKEN_KEY, _o6);
return true;
}
export function saveSetupCode(code) { const c = String(code || '').replace(/\D/g, ''); _o2(CODE_KEY, /^\d{6}$/.test(c) ? c : ''); return /^\d{6}$/.test(c); }
export function withSetupGate(action, payload) {
if (!gated(action, payload)) return payload;
const _o1 = { ...(payload || {}) };
const _o5 = get(TOKEN_KEY), code = get(CODE_KEY);
if (_o5 && !_o1.setup_token) _o1.setup_token = _o5;
if (code && !_o1.setup_code) _o1.setup_code = code;
return _o1;
}
export function setSetupToken(tok) {
const _o6 = String(tok || '').trim().toLowerCase();
if (!_o6) { _o2(TOKEN_KEY, ''); return false; }
if (!TOKEN_RE.test(_o6)) return false;
_o2(TOKEN_KEY, _o6);
return true;
}
export function setupToken() { return get(TOKEN_KEY); }
export function clearSetupGate() { _o2(TOKEN_KEY, ''); _o2(CODE_KEY, ''); }
let _o0 = null;
export function setSetupCodeAsker(fn) { _o0 = typeof fn === 'function' ? fn : null; }
export function setupCodeAsker() { return _o0; }
export default { TOKEN_KEY, CODE_KEY, TOKEN_RE, gated, adoptSetupToken, setSetupToken, setupToken, saveSetupCode, withSetupGate, clearSetupGate, setSetupCodeAsker, setupCodeAsker };

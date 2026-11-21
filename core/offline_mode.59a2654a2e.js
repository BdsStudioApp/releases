import { t } from './i18n.17f01a0b54.js';
export const LOGIN_TIMEOUT_MS = 15000;
export const BOOT_STATUS_MS = 10000;
export const DIAG_TIMEOUT_MS = 8000;
const _o0 = new Set(['offline', 'unreachable', 'server']);
export function isNetworkKind(kind) { return _o0.has(kind); }
export const OFFLINE_MAX_AGE_MS = 12 * 3600000;
export const FAIL_MAX = 5;
export const FAIL_LOCK_MS = 15 * 60000;
export const RETRY_MS = 60000;
export const LS_FAILS = 'bds:offline_fails';
export function offlineEligibility({ mode, hasSalt, hasVerifier, user, storeUserId, rowCount, lastSync, now = Date.now(), trusted = false, lockUntil = 0, kicked = false } = {}) {
const _o4 = (reason) => ({ ok: false, reason, message: t('off.why.' + reason), expiresAt: 0 });
if (mode === 'demo') return _o4('demo');
if (!hasSalt || !hasVerifier || !user || !user.id) return _o4('never');
if (kicked) return _o4('kicked');
if (!storeUserId || String(storeUserId) !== String(user.id)) return _o4('other_user');
if (!(Number(rowCount) > 0)) return _o4('nodata');
const _o3 = Number(lastSync) || 0;
if (!_o3 || now - _o3 > OFFLINE_MAX_AGE_MS) return _o4('expired');
if (user.tfa && user.tfa.enabled && !trusted) return _o4('tfa');
if (Number(lockUntil) > now) return _o4('locked');
return { ok: true, reason: '', message: '', expiresAt: _o3 + OFFLINE_MAX_AGE_MS };
}
export function parseFails(raw) {
try { const _o7 = JSON.parse(raw || 'null'); if (_o7 && typeof _o7 === 'object') return { n: Math.max(0, Number(_o7.n) || 0), until: Number(_o7.until) || 0 }; } catch { }
return { n: 0, until: 0 };
}
export function recordFail(state, now = Date.now()) {
const _o6 = state && Number(state.until) && Number(state.until) <= now ? { n: 0, until: 0 } : { n: Number(state && state.n) || 0, until: Number(state && state.until) || 0 };
const n = _o6.n + 1;
return n >= FAIL_MAX ? { n, until: now + FAIL_LOCK_MS } : { n, until: 0 };
}
export function lockedUntil(state, now = Date.now()) { const u = Number(state && state.until) || 0; return u > now ? u : 0; }
export function triesLeft(state) { return Math.max(0, FAIL_MAX - (Number(state && state.n) || 0)); }
const _o1 = new Set(['status', 'sync.pull', 'sync.push', 'errors.report', 'me', 'logout', 'settings.get', 'license.get']);
export function actionAllowed(action, mode) {
if (!mode) return true;
if (action === 'status') return true;
if (mode === 'readonly') return false;
return _o1.has(String(action || ''));
}
export function blockedMessage(mode) { return t(mode === 'readonly' ? 'off.blocked.readonly' : 'off.blocked.token'); }
const _o5 = (n) => String(n).padStart(2, '0');
export function fmtTime(ms) {
if (!ms) return '?';
const _o2 = new Date(Number(ms));
return `${_o5(_o2.getHours())}:${_o5(_o2.getMinutes())} ${_o5(_o2.getDate())}/${_o5(_o2.getMonth() + 1)}`;
}
export function bannerText({ mode, lastSync }) {
return t(mode === 'readonly' ? 'off.banner.readonly' : 'off.banner.token', { time: fmtTime(lastSync) });
}

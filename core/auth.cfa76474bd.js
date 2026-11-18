export const PBKDF2_ITER = 150000;
const _od = (_ov) => new TextEncoder().encode(String(_ov));
export function b64(buf) {
const _o7 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
let _ov = ''; for (let _og = 0; _og < _o7.length; _og++) _ov += String.fromCharCode(_o7[_og]);
return btoa(_ov);
}
export function randomSalt(n = 16) { const r = new Uint8Array(n); crypto.getRandomValues(r); return b64(r); }
export async function hashPassword(password, salt, iterations = PBKDF2_ITER) {
const key = await crypto.subtle.importKey('raw', _od(password), 'PBKDF2', false, ['deriveBits']);
const _o5 = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: _od(salt), iterations }, key, 256);
return b64(_o5);
}
async function _ox(_ov) { return b64(await crypto.subtle.digest('SHA-256', _od(_ov))); }
export function strength(pw) {
pw = String(pw || '');
if (pw.length < 8) return 0;
let score = 0;
const _o9 = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((r) => r.test(pw)).length;
if (pw.length >= 8) score++;
if (pw.length >= 12) score++;
if (_o9 >= 3) score++;
if (_o9 === 4 || (pw.length >= 16 && _o9 >= 2)) score++;
if (/^(.)\1+$/.test(pw) || /^(?:0123|1234|2345|abcd|qwer|matkhau|password)/i.test(pw)) score = Math.min(score, 1);
return Math.max(1, Math.min(4, score));
}
export function deviceName(ua = (typeof navigator !== 'undefined' ? navigator.userAgent : ''), touch = (typeof navigator !== 'undefined' ? Number(navigator.maxTouchPoints) || 0 : 0)) {
const _oq = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) || (/Macintosh/.test(ua) && touch > 1) ? 'iPad' : /Android/.test(ua) ? 'Android'
: /Mac OS X|Macintosh/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'Máy';
const _o6 = /Edg\//.test(ua) ? 'Edge' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /FxiOS|Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Trình duyệt';
return _oq + ' · ' + _o6;
}
export function deviceInfo(nav = (typeof navigator !== 'undefined' ? navigator : null), scr = (typeof screen !== 'undefined' ? screen : null)) {
const n = nav || {}, ch = n.userAgentData || null, _ov = scr || {};
const _oo = { ua: String(n.userAgent || '').slice(0, 300), touch: Number(n.maxTouchPoints) || 0, sw: Number(_ov.width) || 0, sh: Number(_ov.height) || 0 };
if (ch && typeof ch.mobile === 'boolean') _oo.mobile = ch.mobile;
const _ot = (ch && ch.platform) || n.platform || '';
if (_ot) _oo.platform = String(_ot).slice(0, 40);
return _oo;
}
export function needsStep(_oa) { return !!(_oa && (_oa.tfa_required || _oa.device_verify_required)); }
const _o1 = { salt: 'bds:salt', verifier: 'bds:lock_verifier', last: 'bds:last_active', lockMin: 'bds:lock_min', locked: 'bds:locked', user: 'bds:user', username: 'bds:last_username', trust: 'bds:tfa_trust' };
export const ROLES = ['owner', 'manager', 'sale', 'ctv', 'marketing'];
export const ROLE_PERMS = {
owner: { customers_scope: 'all', assign: true, erase: true, policy: 'approve', video: true, ideas: true, admin: true, export: true, customers_all: true, catalog: true, quote: true, landing: true, ai: true, project_edit: true },
manager: { customers_scope: 'all', assign: true, erase: true, policy: 'draft', video: true, ideas: true, admin: false, export: true, customers_all: true, catalog: true, quote: true, landing: true, ai: true, project_edit: true },
sale: { customers_scope: 'own', assign: false, erase: false, policy: 'view', video: false, ideas: false, admin: false, export: true, customers_all: false, catalog: true, quote: true, landing: true, ai: true, project_edit: false },
ctv: { customers_scope: 'created', assign: false, erase: false, policy: 'view', video: false, ideas: false, admin: false, export: false, customers_all: false, catalog: true, quote: true, landing: false, ai: false, project_edit: false },
marketing: { customers_scope: 'created', assign: false, erase: false, policy: 'view', video: true, ideas: true, admin: false, export: false, customers_all: false, catalog: true, quote: false, landing: true, ai: true, project_edit: false, lead_pool: true, lead_push: true, lead_report: true }
};
export function normRole(r) { return ROLES.includes(r) ? r : 'ctv'; }
export function normalizePerms(perms, role) {
const base = ROLE_PERMS[normRole(role)];
const _or = { ...base, ...(perms && typeof perms === 'object' ? perms : {}) };
for (const _oh of Object.keys(_or)) if (_oh !== 'customers_scope' && _oh !== 'policy') _or[_oh] = !!_or[_oh];
if (!['all', 'own', 'created'].includes(_or.customers_scope)) _or.customers_scope = base.customers_scope;
if (!['approve', 'draft', 'view'].includes(_or.policy)) _or.policy = base.policy;
return _or;
}
export function normalizeUser(u, fallback = {}) {
u = u && typeof u === 'object' ? u : {};
const role = normRole(u.role || fallback.role);
return {
id: String(u.id || fallback.id || ''),
username: String(u.username || fallback.username || '').toLowerCase(),
full_name: String(u.full_name || fallback.full_name || ''),
email: String(u.email || ''), phone: String(u.phone || ''),
role,
must_change_pw: Number(u.must_change_pw) ? 1 : 0,
telegram_token_set: Number(u.telegram_token_set) ? 1 : 0,
telegram_chat_id: u.telegram_chat_id ? String(u.telegram_chat_id) : '',
perms: normalizePerms(u.perms || fallback.perms, role),
legacy: !!(u.legacy || fallback.legacy),
tfa: u.tfa && typeof u.tfa === 'object' ? u.tfa : (fallback.tfa && typeof fallback.tfa === 'object' ? fallback.tfa : null),
rename_suggest: String(u.rename_suggest !== undefined ? u.rename_suggest || '' : fallback.rename_suggest || ''),
email_verified: Number(u.email_verified) === 1 ? 1 : 0,
email_gate: u.email_gate && typeof u.email_gate === 'object' ? u.email_gate : (u.email_gate === undefined && fallback.email_gate && typeof fallback.email_gate === 'object' ? fallback.email_gate : null)
};
}
export function legacyUser(username = '') {
return normalizeUser({ id: '', username: username || 'admin', role: 'owner', legacy: true });
}
export function isLegacyError(e) {
if (e && (e.code === 'UNKNOWN_ACTION' || e.missingAction)) return true;
if (!e || e.code !== 'BAD_INPUT') return false;
const _om = String(e.serverMessage || e.userMessage || e.message || '');
return /không được hỗ trợ|username|tên đăng nhập|unknown/i.test(_om);
}
export const USERNAME_RE = /^[a-z0-9._-]{3,32}$/;
export function normUsername(_ov) { return String(_ov == null ? '' : _ov).trim().toLowerCase(); }
export function validUsername(_ov) { return USERNAME_RE.test(normUsername(_ov)); }
export function loginName(_ov) {
let _oz = String(_ov == null ? '' : _ov).toLowerCase();
if (typeof _oz.normalize === 'function') _oz = _oz.normalize('NFD').replace(/[̀-ͯ]/g, '');
return _oz.replace(/đ/g, 'd').replace(/\s+/g, '');
}
export function slugUsername(name) { return loginName(name).replace(/[^a-z0-9._]/g, '').replace(/^[._]+|[._]+$/g, '').slice(0, 32); }
const ls = {
get(_oh) { try { return localStorage.getItem(_oh); } catch { return null; } },
set(_oh, _oz) { try { if (_oz == null) localStorage.removeItem(_oh); else localStorage.setItem(_oh, String(_oz)); } catch { } }
};
const _o2 = 8;
export function trustTokens() { try { const _o3 = JSON.parse(ls.get(_o1.trust) || '[]'); return Array.isArray(_o3) ? _o3.filter((x) => typeof x === 'string').slice(-_o2) : []; } catch { return []; } }
export function rememberTrust(tok) {
if (!tok || typeof tok !== 'string') return;
const _o3 = trustTokens().filter((x) => x !== tok); _o3.push(tok);
ls.set(_o1.trust, JSON.stringify(_o3.slice(-_o2)));
}
export class TfaRequired extends Error {
constructor(challenge) { super('Cần mã xác thực 2 lớp'); this.code = 'TFA_REQUIRED'; this.challenge = challenge; }
}
export function createAuth({ api, lockMs: lockMsOverride, defaultLockMinutes = 10 } = {}) {
const _ok = {};
const _oc = (_oe, data) => (_ok[_oe] || []).forEach((cb) => { try { cb(data); } catch { } });
let locked = ls.get(_o1.locked) === '1';
let _oy = null, lastWrite = 0;
async function _o10(pwHash) { return _ox(pwHash + '|' + api.deviceId); }
let user = (() => { try { const _oz = JSON.parse(ls.get(_o1.user) || 'null'); return _oz ? normalizeUser(_oz, _oz) : null; } catch { return null; } })();
function _ow(u) {
user = u ? normalizeUser(u, u) : null;
ls.set(_o1.user, user ? JSON.stringify(user) : null);
if (user && user.username) ls.set(_o1.username, user.username);
_oc('user', user);
return user;
}
async function _ol(username, password) {
let legacy = false, salt;
try { ({ salt } = await api.call('salt.get', { username })); } catch (e) {
if (!isLegacyError(e)) throw e;
legacy = true; ({ salt } = await api.call('salt.get', {}));
}
const pw_hash = await hashPassword(password, salt);
let data;
if (!legacy) {
try { data = await api.call('login', { username, pw_hash, device_name: deviceName(), device: deviceInfo(), trust: trustTokens() }); } catch (e) {
if (!isLegacyError(e)) throw e;
legacy = true;
}
}
if (legacy) data = await api.call('login', { pw_hash, device_name: deviceName() });
if (needsStep(data)) return { pw_hash, salt, data };
data.user = data.user ? normalizeUser(data.user, { username }) : legacyUser(username);
return { pw_hash, salt, data };
}
let _os = null;
let _on = false;
let _oj = null;
async function _ou(password) {
const { salt } = await api.call('salt.get', { username: (user && user.username) || _o4.lastUsername() });
return hashPassword(password, salt);
}
async function _of(pwHash, salt, data) {
api.setSession(data);
if (data.trust_token) rememberTrust(data.trust_token);
_oj = { alias_used: data.alias_used || null, backup_left: data.backup_left, trusted: !!data.trust_token };
_ow(data.user || null);
ls.set(_o1.salt, salt);
ls.set(_o1.verifier, await _o10(pwHash));
locked = false; ls.set(_o1.locked, null);
touch(true);
_oc('login', data);
return data;
}
const _o4 = {
strength,
hashPassword,
async status() { return api.call('status'); },
isLoggedIn() { return api.hasValidToken(); },
get user() { return user; },
lastUsername() { return ls.get(_o1.username) || ''; },
rememberUsername(u) { ls.set(_o1.username, normUsername(u) || null); },
async setup(password, ownerName = '', username = 'admin', emailOpts = null) {
if (String(password).length < 8) throw Object.assign(new Error('short'), { code: 'BAD_INPUT' });
username = normUsername(username) || 'admin';
const salt = randomSalt();
const pw_hash = await hashPassword(password, salt);
const _oe = emailOpts && typeof emailOpts === 'object' ? emailOpts : {};
const extra = _oe.use_account_email ? { use_account_email: true } : _oe.email ? { email: String(_oe.email).trim(), email_code: String(_oe.email_code || '').replace(/\D/g, '') } : {};
await api.call('setup', { pw_hash, salt, username, owner: { name: ownerName || '', username }, ...extra });
const { data } = await _ol(username, password);
if (needsStep(data)) { _os = { pw_hash, salt, username }; return data; }
return _of(pw_hash, salt, data);
},
async login(username, password) {
if (password === undefined) { password = username; username = _o4.lastUsername(); }
username = loginName(username);
const { pw_hash, salt, data } = await _ol(username, password);
if (needsStep(data)) { _os = { pw_hash, salt, username }; return data; }
_os = null;
return _of(pw_hash, salt, data);
},
async tfaVerify(ticket, method, code, trustDevice) {
if (!_os) throw Object.assign(new Error('expired'), { code: 'AUTH_INVALID', userMessage: 'Phiên xác thực đã hết hạn. Đăng nhập lại.' });
const data = await api.call('auth.tfa_verify', { tfa_ticket: ticket, method, code: String(code == null ? '' : code).trim(), trust_device: !!trustDevice });
if (data && data.device_verify_required) return data;
data.user = normalizeUser(data.user, { username: _os.username });
const _or = _os; _os = null;
return _of(_or.pw_hash, _or.salt, data);
},
tfaResend(ticket) { return api.call('auth.tfa_resend', { tfa_ticket: ticket }); },
async deviceVerify(ticket, code) {
if (!_os) throw Object.assign(new Error('expired'), { code: 'AUTH_INVALID', userMessage: 'Phiên xác nhận đã hết hạn. Đăng nhập lại.' });
const data = await api.call('auth.device_verify', { dv_ticket: ticket, code: String(code == null ? '' : code).replace(/\D/g, '') });
data.user = normalizeUser(data.user, { username: _os.username });
const _or = _os; _os = null;
return _of(_or.pw_hash, _or.salt, data);
},
deviceResend(ticket) { return api.call('auth.device_resend', { dv_ticket: ticket }); },
hasPendingTfa() { return !!_os; },
takeLoginInfo() { const _oz = _oj; _oj = null; return _oz; },
cancelTfa() { _os = null; },
async rename(newUsername, password) {
const name = loginName(newUsername);
const old_hash = await _ou(password);
const new_salt = randomSalt();
const new_hash = await hashPassword(password, new_salt);
const r = await api.call('auth.rename', { new_username: name, old_hash, new_salt, new_hash });
ls.set(_o1.salt, new_salt);
ls.set(_o1.verifier, await _o10(new_hash));
if (user) _ow({ ...user, username: (r && r.username) || name, rename_suggest: '' });
return r;
},
async renameDismiss() {
try { await api.call('auth.rename', { dismiss: true }); } catch { }
if (user) _ow({ ...user, rename_suggest: '' });
},
async renameUser(id, newUsername, password) {
return api.call('users.rename', { id, new_username: loginName(newUsername), old_hash: await _ou(password) });
},
tfaStatus() { return api.call('tfa.status', {}); },
tfaSendCode() { return api.call('tfa.send_code', {}); },
tfaSetupTotp() { return api.call('tfa.setup_totp', {}); },
async tfaEnable(password, method, code) {
return api.call('tfa.enable', { old_hash: await _ou(password), method, code: String(code == null ? '' : code).trim() });
},
async tfaDisable(password, what, method, code) {
return api.call('tfa.disable', { old_hash: await _ou(password), what, method, code: String(code == null ? '' : code).trim() });
},
async tfaBackupCodes(password, method, code) {
return api.call('tfa.backup_codes', { old_hash: await _ou(password), method, code: String(code == null ? '' : code).trim() });
},
tfaUntrust(opts) { return api.call('tfa.untrust', opts || {}); },
async setMyEmail(email, code) {
const _ob = String(email == null ? '' : email).trim();
try {
const r = await api.call('me.update', code ? { email: _ob, email_code: String(code).replace(/\D/g, '') } : { email: _ob });
if (r && r.email_gate !== undefined) { _ow({ ...user, ...normalizeUser(r, user || {}) }); return { ok: true }; }
if (user) _ow({ ...user, email: String((r && r.email != null ? r.email : _ob) || '') });
return { ok: true };
} catch (e) {
if (!isLegacyError(e) || !user || (user.role !== 'owner' && !user.legacy)) throw e;
if (user.id) await api.call('users.update', { id: user.id, email: _ob });
if (_ob) await api.call('settings.set', { key: 'owner_email', value: _ob });
_ow({ ...user, email: _ob });
return { ok: true, legacy: true };
}
},
emailStart(email, purpose) { return api.call('email.verify_start', { email: String(email == null ? '' : email).trim(), purpose }); },
emailCheck(email, code) { return api.call('email.verify_check', { email: String(email || '').trim(), code: String(code || '').replace(/\D/g, '') }); },
async verifyEmail(code, useAccountEmail) {
const r = await api.call('me.verify_email', useAccountEmail ? { use_account_email: true } : { code: String(code || '').replace(/\D/g, '') });
return _ow({ ...normalizeUser(r, user || {}) });
},
async emailDefer() { const r = await api.call('me.email_defer', {}); return _ow({ ...normalizeUser(r, user || {}) }); },
meFresh() { return _on; },
async me() {
_on = false;
try {
const _oa = await api.call('me', {});
const u = _oa && (_oa.user || _oa);
_on = true;
return _ow(normalizeUser({ ...u, perms: (_oa && _oa.perms) || (u && u.perms) }, { username: _o4.lastUsername() }));
} catch (e) {
if (isLegacyError(e)) return _ow(legacyUser((user && user.username) || _o4.lastUsername()));
if (e && (e.code === 'AUTH_REQUIRED' || e.code === 'AUTH_INVALID')) throw e;
if (user) return user;
throw e;
}
},
async unlock(password) {
const salt = ls.get(_o1.salt), ver = ls.get(_o1.verifier);
if (salt && ver && api.hasValidToken()) {
const pw_hash = await hashPassword(password, salt);
if ((await _o10(pw_hash)) !== ver) throw Object.assign(new Error('wrong'), { code: 'AUTH_INVALID' });
locked = false; ls.set(_o1.locked, null); touch(true); _oc('unlock');
return true;
}
const r = await _o4.login(_o4.lastUsername(), password);
if (needsStep(r)) throw new TfaRequired(r);
_oc('unlock');
return true;
},
unlockVerified() {
if (!api.hasValidToken()) return false;
locked = false; ls.set(_o1.locked, null); touch(true); _oc('unlock');
return true;
},
async logout() {
try { if (api.token) await api.call('logout'); } catch { }
api.clearSession();
_ow(null);
ls.set(_o1.verifier, null); ls.set(_o1.locked, null);
locked = false;
_o4.stopIdle();
_oc('logout');
},
async changePassword(oldPw, newPw) {
if (String(newPw).length < 8) throw Object.assign(new Error('short'), { code: 'BAD_INPUT' });
const { salt } = await api.call('salt.get', { username: (user && user.username) || _o4.lastUsername() });
const old_hash = await hashPassword(oldPw, salt);
const new_salt = randomSalt();
const new_hash = await hashPassword(newPw, new_salt);
await api.call('password.change', { old_hash, new_hash, new_salt });
ls.set(_o1.salt, new_salt);
ls.set(_o1.verifier, await _o10(new_hash));
if (user && user.must_change_pw) _ow({ ...user, must_change_pw: 0 });
return true;
},
async resetRequest(username) { return api.call('password.reset_request', { username: loginName(username) }); },
async resetConfirm(code, newPw, username) {
if (String(newPw).length < 8) throw Object.assign(new Error('short'), { code: 'BAD_INPUT' });
const new_salt = randomSalt();
const new_hash = await hashPassword(newPw, new_salt);
return api.call('password.reset_confirm', { username: loginName(username), code: String(code).trim(), new_hash, new_salt });
},
lockMinutes() { const n = Number(ls.get(_o1.lockMin)); return n > 0 ? n : defaultLockMinutes; },
setLockMinutes(n) { n = Math.max(1, Math.min(240, Math.round(Number(n) || defaultLockMinutes))); ls.set(_o1.lockMin, n); return n; },
lockMs() { return lockMsOverride > 0 ? lockMsOverride : _o4.lockMinutes() * 60000; },
isLocked() { return locked; },
idleExpired() { const last = Number(ls.get(_o1.last)) || 0; return !!last && Date.now() - last > _o4.lockMs(); },
lock() {
if (locked) return;
locked = true; ls.set(_o1.locked, '1');
_oc('lock');
},
startIdle() {
_o4.stopIdle();
touch(true);
for (const _oe of _o0) window.addEventListener(_oe, onActivity, { passive: true, capture: true });
document.addEventListener('visibilitychange', _op);
_oy = setInterval(_o8, Math.min(5000, Math.max(250, _o4.lockMs() / 4)));
},
stopIdle() {
if (_oy) clearInterval(_oy); _oy = null;
for (const _oe of _o0) window.removeEventListener(_oe, onActivity, { capture: true });
document.removeEventListener('visibilitychange', _op);
},
on(_oe, cb) { (_ok[_oe] = _ok[_oe] || []).push(cb); return () => { _ok[_oe] = _ok[_oe].filter((x) => x !== cb); }; }
};
const _o0 = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'];
let _oi = Date.now();
function touch(force) {
_oi = Date.now();
if (force || _oi - lastWrite > 4000) { lastWrite = _oi; ls.set(_o1.last, _oi); }
}
function onActivity() { if (!locked) touch(); }
function _o8() { if (!locked && api.hasValidToken() && Date.now() - _oi > _o4.lockMs()) _o4.lock(); }
function _op() { if (document.visibilityState === 'visible') { const last = Number(ls.get(_o1.last)) || _oi; _oi = Math.max(_oi, last); _o8(); } }
return _o4;
}
export default createAuth;

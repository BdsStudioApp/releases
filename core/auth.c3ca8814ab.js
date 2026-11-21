export const PBKDF2_ITER = 150000;
const _oe = (_ox) => new TextEncoder().encode(String(_ox));
export function b64(buf) {
const _o7 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
let _ox = ''; for (let _oh = 0; _oh < _o7.length; _oh++) _ox += String.fromCharCode(_o7[_oh]);
return btoa(_ox);
}
export function randomSalt(n = 16) { const r = new Uint8Array(n); crypto.getRandomValues(r); return b64(r); }
export async function hashPassword(password, salt, iterations = PBKDF2_ITER) {
const key = await crypto.subtle.importKey('raw', _oe(password), 'PBKDF2', false, ['deriveBits']);
const _o5 = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: _oe(salt), iterations }, key, 256);
return b64(_o5);
}
async function _oz(_ox) { return b64(await crypto.subtle.digest('SHA-256', _oe(_ox))); }
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
const _os = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) || (/Macintosh/.test(ua) && touch > 1) ? 'iPad' : /Android/.test(ua) ? 'Android'
: /Mac OS X|Macintosh/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : /Linux/.test(ua) ? 'Linux' : 'Máy';
const _o6 = /Edg\//.test(ua) ? 'Edge' : /CriOS|Chrome\//.test(ua) ? 'Chrome' : /FxiOS|Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Trình duyệt';
return _os + ' · ' + _o6;
}
export function deviceInfo(nav = (typeof navigator !== 'undefined' ? navigator : null), scr = (typeof screen !== 'undefined' ? screen : null)) {
const n = nav || {}, ch = n.userAgentData || null, _ox = scr || {};
const _oq = { ua: String(n.userAgent || '').slice(0, 300), touch: Number(n.maxTouchPoints) || 0, sw: Number(_ox.width) || 0, sh: Number(_ox.height) || 0 };
if (ch && typeof ch.mobile === 'boolean') _oq.mobile = ch.mobile;
const _ov = (ch && ch.platform) || n.platform || '';
if (_ov) _oq.platform = String(_ov).slice(0, 40);
return _oq;
}
export function needsStep(_ob) { return !!(_ob && (_ob.tfa_required || _ob.device_verify_required)); }
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
const _ot = { ...base, ...(perms && typeof perms === 'object' ? perms : {}) };
for (const _oi of Object.keys(_ot)) if (_oi !== 'customers_scope' && _oi !== 'policy') _ot[_oi] = !!_ot[_oi];
if (!['all', 'own', 'created'].includes(_ot.customers_scope)) _ot.customers_scope = base.customers_scope;
if (!['approve', 'draft', 'view'].includes(_ot.policy)) _ot.policy = base.policy;
return _ot;
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
tg_ok: u.tg_ok !== undefined ? !!u.tg_ok : (fallback.tg_ok !== undefined ? fallback.tg_ok : null),
tg_via: String(u.tg_via !== undefined ? u.tg_via || '' : fallback.tg_via || ''),
tg_company: u.tg_company !== undefined ? !!u.tg_company : !!fallback.tg_company,
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
const _oo = String(e.serverMessage || e.userMessage || e.message || '');
return /không được hỗ trợ|username|tên đăng nhập|unknown/i.test(_oo);
}
export const USERNAME_RE = /^[a-z0-9._-]{3,32}$/;
export function normUsername(_ox) { return String(_ox == null ? '' : _ox).trim().toLowerCase(); }
export function validUsername(_ox) { return USERNAME_RE.test(normUsername(_ox)); }
export function loginName(_ox) {
let v = String(_ox == null ? '' : _ox).toLowerCase();
if (typeof v.normalize === 'function') v = v.normalize('NFD').replace(/[̀-ͯ]/g, '');
return v.replace(/đ/g, 'd').replace(/\s+/g, '');
}
export function slugUsername(name) { return loginName(name).replace(/[^a-z0-9._]/g, '').replace(/^[._]+|[._]+$/g, '').slice(0, 32); }
export function usernameFromEmail(email) {
const _om = String(email == null ? '' : email).split('@')[0].split('+')[0];
const v = loginName(_om).replace(/[^a-z0-9._-]+/g, '.').replace(/\.{2,}/g, '.').replace(/^[._-]+|[._-]+$/g, '').slice(0, 32).replace(/[._-]+$/, '');
return USERNAME_RE.test(v) ? v : '';
}
const ls = {
get(_oi) { try { return localStorage.getItem(_oi); } catch { return null; } },
set(_oi, v) { try { if (v == null) localStorage.removeItem(_oi); else localStorage.setItem(_oi, String(v)); } catch { } }
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
const _ol = {};
const _od = (_of, data) => (_ol[_of] || []).forEach((cb) => { try { cb(data); } catch { } });
let locked = ls.get(_o1.locked) === '1';
let _o11 = null, lastWrite = 0;
async function _o12(pwHash) { return _oz(pwHash + '|' + api.deviceId); }
let user = (() => { try { const v = JSON.parse(ls.get(_o1.user) || 'null'); return v ? normalizeUser(v, v) : null; } catch { return null; } })();
function _oy(u) {
user = u ? normalizeUser(u, u) : null;
ls.set(_o1.user, user ? JSON.stringify(user) : null);
if (user && user.username) ls.set(_o1.username, user.username);
_od('user', user);
return user;
}
async function _on(username, password, opts = {}) {
const _o10 = (n) => { try { if (opts.onStep) opts.onStep(n); } catch { } };
const _oa = opts.timeoutMs ? { timeoutMs: opts.timeoutMs } : undefined;
let legacy = false, salt;
_o10(1);
try { ({ salt } = await api.call('salt.get', { username }, _oa)); } catch (e) {
if (!isLegacyError(e)) throw e;
legacy = true; ({ salt } = await api.call('salt.get', {}, _oa));
}
_o10(2);
const pw_hash = await hashPassword(password, salt);
_o10(3);
let data;
if (!legacy) {
try { data = await api.call('login', { username, pw_hash, device_name: deviceName(), device: deviceInfo(), trust: trustTokens() }, _oa); } catch (e) {
if (!isLegacyError(e)) throw e;
legacy = true;
}
}
if (legacy) data = await api.call('login', { pw_hash, device_name: deviceName() }, _oa);
if (needsStep(data)) return { pw_hash, salt, data };
data.user = data.user ? normalizeUser(data.user, { username }) : legacyUser(username);
return { pw_hash, salt, data };
}
let _ou = null;
let _op = false;
let _ok = null;
async function _ow(password) {
const { salt } = await api.call('salt.get', { username: (user && user.username) || _o4.lastUsername() });
return hashPassword(password, salt);
}
async function _og(pwHash, salt, data) {
api.setSession(data);
if (data.trust_token) rememberTrust(data.trust_token);
_ok = { alias_used: data.alias_used || null, backup_left: data.backup_left, trusted: !!data.trust_token };
_oy(data.user || null);
ls.set(_o1.salt, salt);
ls.set(_o1.verifier, await _o12(pwHash));
locked = false; ls.set(_o1.locked, null);
touch(true);
_od('login', data);
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
const _of = emailOpts && typeof emailOpts === 'object' ? emailOpts : {};
const extra = _of.use_account_email ? { use_account_email: true } : _of.email ? { email: String(_of.email).trim(), email_code: String(_of.email_code || '').replace(/\D/g, '') } : {};
await api.call('setup', { pw_hash, salt, username, owner: { name: ownerName || '', username }, ...extra });
const { data } = await _on(username, password);
if (needsStep(data)) { _ou = { pw_hash, salt, username }; return data; }
return _og(pw_hash, salt, data);
},
async login(username, password, opts) {
if (password === undefined) { password = username; username = _o4.lastUsername(); }
username = loginName(username);
const { pw_hash, salt, data } = await _on(username, password, opts || {});
if (needsStep(data)) { _ou = { pw_hash, salt, username }; return data; }
_ou = null;
return _og(pw_hash, salt, data);
},
async tfaVerify(ticket, method, code, trustDevice) {
if (!_ou) throw Object.assign(new Error('expired'), { code: 'AUTH_INVALID', userMessage: 'Phiên xác thực đã hết hạn. Đăng nhập lại.' });
const data = await api.call('auth.tfa_verify', { tfa_ticket: ticket, method, code: String(code == null ? '' : code).trim(), trust_device: !!trustDevice });
if (data && data.device_verify_required) return data;
data.user = normalizeUser(data.user, { username: _ou.username });
const _ot = _ou; _ou = null;
return _og(_ot.pw_hash, _ot.salt, data);
},
tfaResend(ticket) { return api.call('auth.tfa_resend', { tfa_ticket: ticket }); },
async deviceVerify(ticket, code) {
if (!_ou) throw Object.assign(new Error('expired'), { code: 'AUTH_INVALID', userMessage: 'Phiên xác nhận đã hết hạn. Đăng nhập lại.' });
const data = await api.call('auth.device_verify', { dv_ticket: ticket, code: String(code == null ? '' : code).replace(/\D/g, '') });
data.user = normalizeUser(data.user, { username: _ou.username });
const _ot = _ou; _ou = null;
return _og(_ot.pw_hash, _ot.salt, data);
},
deviceResend(ticket) { return api.call('auth.device_resend', { dv_ticket: ticket }); },
hasPendingTfa() { return !!_ou; },
takeLoginInfo() { const v = _ok; _ok = null; return v; },
cancelTfa() { _ou = null; },
async rename(newUsername, password) {
const name = loginName(newUsername);
const old_hash = await _ow(password);
const new_salt = randomSalt();
const new_hash = await hashPassword(password, new_salt);
const r = await api.call('auth.rename', { new_username: name, old_hash, new_salt, new_hash });
ls.set(_o1.salt, new_salt);
ls.set(_o1.verifier, await _o12(new_hash));
if (user) _oy({ ...user, username: (r && r.username) || name, rename_suggest: '' });
return r;
},
async renameDismiss() {
try { await api.call('auth.rename', { dismiss: true }); } catch { }
if (user) _oy({ ...user, rename_suggest: '' });
},
async renameUser(id, newUsername, password) {
return api.call('users.rename', { id, new_username: loginName(newUsername), old_hash: await _ow(password) });
},
tfaStatus() { return api.call('tfa.status', {}); },
tfaSendCode() { return api.call('tfa.send_code', {}); },
tfaSetupTotp() { return api.call('tfa.setup_totp', {}); },
async tfaEnable(password, method, code) {
return api.call('tfa.enable', { old_hash: await _ow(password), method, code: String(code == null ? '' : code).trim() });
},
async tfaDisable(password, what, method, code) {
return api.call('tfa.disable', { old_hash: await _ow(password), what, method, code: String(code == null ? '' : code).trim() });
},
async tfaBackupCodes(password, method, code) {
return api.call('tfa.backup_codes', { old_hash: await _ow(password), method, code: String(code == null ? '' : code).trim() });
},
tfaUntrust(opts) { return api.call('tfa.untrust', opts || {}); },
async setMyEmail(email, code) {
const _oc = String(email == null ? '' : email).trim();
try {
const r = await api.call('me.update', code ? { email: _oc, email_code: String(code).replace(/\D/g, '') } : { email: _oc });
if (r && r.email_gate !== undefined) { _oy({ ...user, ...normalizeUser(r, user || {}) }); return { ok: true }; }
if (user) _oy({ ...user, email: String((r && r.email != null ? r.email : _oc) || '') });
return { ok: true };
} catch (e) {
if (!isLegacyError(e) || !user || (user.role !== 'owner' && !user.legacy)) throw e;
if (user.id) await api.call('users.update', { id: user.id, email: _oc });
if (_oc) await api.call('settings.set', { key: 'owner_email', value: _oc });
_oy({ ...user, email: _oc });
return { ok: true, legacy: true };
}
},
emailStart(email, purpose) { return api.call('email.verify_start', { email: String(email == null ? '' : email).trim(), purpose }); },
emailCheck(email, code) { return api.call('email.verify_check', { email: String(email || '').trim(), code: String(code || '').replace(/\D/g, '') }); },
async verifyEmail(code, useAccountEmail) {
const r = await api.call('me.verify_email', useAccountEmail ? { use_account_email: true } : { code: String(code || '').replace(/\D/g, '') });
return _oy({ ...normalizeUser(r, user || {}) });
},
async emailDefer() { const r = await api.call('me.email_defer', {}); return _oy({ ...normalizeUser(r, user || {}) }); },
meFresh() { return _op; },
async me() {
_op = false;
try {
const _ob = await api.call('me', {});
const u = _ob && (_ob.user || _ob);
_op = true;
return _oy(normalizeUser({ ...u, perms: (_ob && _ob.perms) || (u && u.perms) }, { username: _o4.lastUsername() }));
} catch (e) {
if (isLegacyError(e)) return _oy(legacyUser((user && user.username) || _o4.lastUsername()));
if (e && (e.code === 'AUTH_REQUIRED' || e.code === 'AUTH_INVALID')) throw e;
if (user) return user;
throw e;
}
},
localState() { return { hasSalt: !!ls.get(_o1.salt), hasVerifier: !!ls.get(_o1.verifier), trusted: trustTokens().length > 0 }; },
async verifyLocal(password) {
const salt = ls.get(_o1.salt), ver = ls.get(_o1.verifier);
if (!salt || !ver || !password) return false;
return (await _o12(await hashPassword(password, salt))) === ver;
},
async unlock(password) {
const salt = ls.get(_o1.salt), ver = ls.get(_o1.verifier);
if (salt && ver && api.hasValidToken()) {
const pw_hash = await hashPassword(password, salt);
if ((await _o12(pw_hash)) !== ver) throw Object.assign(new Error('wrong'), { code: 'AUTH_INVALID' });
locked = false; ls.set(_o1.locked, null); touch(true); _od('unlock');
return true;
}
const r = await _o4.login(_o4.lastUsername(), password);
if (needsStep(r)) throw new TfaRequired(r);
_od('unlock');
return true;
},
unlockVerified() {
if (!api.hasValidToken()) return false;
locked = false; ls.set(_o1.locked, null); touch(true); _od('unlock');
return true;
},
async logout() {
try { if (api.token) await api.call('logout'); } catch { }
api.clearSession();
_oy(null);
ls.set(_o1.verifier, null); ls.set(_o1.locked, null);
locked = false;
_o4.stopIdle();
_od('logout');
},
async changePassword(oldPw, newPw) {
if (String(newPw).length < 8) throw Object.assign(new Error('short'), { code: 'BAD_INPUT' });
const { salt } = await api.call('salt.get', { username: (user && user.username) || _o4.lastUsername() });
const old_hash = await hashPassword(oldPw, salt);
const new_salt = randomSalt();
const new_hash = await hashPassword(newPw, new_salt);
await api.call('password.change', { old_hash, new_hash, new_salt });
ls.set(_o1.salt, new_salt);
ls.set(_o1.verifier, await _o12(new_hash));
if (user && user.must_change_pw) _oy({ ...user, must_change_pw: 0 });
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
_od('lock');
},
startIdle() {
_o4.stopIdle();
touch(true);
for (const _of of _o0) window.addEventListener(_of, onActivity, { passive: true, capture: true });
document.addEventListener('visibilitychange', _or);
_o11 = setInterval(_o8, Math.min(5000, Math.max(250, _o4.lockMs() / 4)));
},
stopIdle() {
if (_o11) clearInterval(_o11); _o11 = null;
for (const _of of _o0) window.removeEventListener(_of, onActivity, { capture: true });
document.removeEventListener('visibilitychange', _or);
},
on(_of, cb) { (_ol[_of] = _ol[_of] || []).push(cb); return () => { _ol[_of] = _ol[_of].filter((x) => x !== cb); }; }
};
const _o0 = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll'];
let _oj = Date.now();
function touch(force) {
_oj = Date.now();
if (force || _oj - lastWrite > 4000) { lastWrite = _oj; ls.set(_o1.last, _oj); }
}
function onActivity() { if (!locked) touch(); }
function _o8() { if (!locked && api.hasValidToken() && Date.now() - _oj > _o4.lockMs()) _o4.lock(); }
function _or() { if (document.visibilityState === 'visible') { const last = Number(ls.get(_o1.last)) || _oj; _oj = Math.max(_oj, last); _o8(); } }
return _o4;
}
export default createAuth;

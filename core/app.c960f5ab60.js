import config from '../config.js';
import { t, has as hasWord, setPackWords, addWords } from './i18n.c64f4bc3eb.js';
import ui, { h, icon, button, toast, modal, mountTo, clear, segmented, help, progress, glyph, closeSheet, afterSheetBack } from './ui.73a28f59df.js';
import { supportBlock } from './support.b695c47cb1.js';
import { setHelpConfig, helpDocLink, helpPageForRoute } from './help_links.ba329c14dc.js';
import { createApi, saveScriptUrl, scriptUrl } from './api.8a9774059d.js';
import { createAuth, strength, normUsername, validUsername, loginName, usernameFromEmail } from './auth.7b8dd8e978.js';
import { tfaStepForm, postLoginPrompts, cssOnce as tfaCss } from './tfa.34d52e1fe4.js';
import { createUsersApi, visibleScreens, screenAllowed, roleLabel, ROLE_TONE } from './users.be5fcb9ddb.js';
import { featureAllowed, screenPermitted, setPackInfo as setFeaturePackInfo } from './features.acef34c96e.js';
import { allowedBy } from './registry.6d79af2015.js';
import { createStore } from './store.56498e5e0f.js';
import { createRegistry, stateWords, SCREENS, packModules, tileModules, movedHash } from './registry.6d79af2015.js';
import { createPacks, betaBar, WORDS as PACK_WORDS } from './packs.72ecf0bb56.js';
import { createVideoScreens, packsView, videoOffered, EVENT as VIDEO_EVENT, OFF_WORDS as VIDEO_OFF_WORDS } from './video_screens.6f9cddd373.js';
import { createAI } from './ai.8d26d4c959.js';
import { createSettings, mountSettings, applyPrefs, densityFor, setDensityFor, prefs } from './settings.0e9a066ff3.js';
import { installExtras } from './extras.c4ca62c730.js';
import { installWhatsNew } from './whatsnew.8f6a287e11.js';
import { installSelfHeal } from './selfheal.a5e3829634.js';
import { rejectionMessage } from './health_logic.7f3d23ce57.js';
import { installFeedback } from './feedback.69ad74fcf5.js';
import { installLicense } from './license.73b3a4123b.js';
import { unsentWarning } from './license_logic.9718cd0900.js';
import { installArchive } from './archive.31dd24ed44.js';
import { installCheers } from './cheers.02358cc8c8.js';
import { ensureCss, download } from './xkit.e7637ba4a6.js';
import { installPwaHint } from './pwa_hint.f949f23506.js';
import { emailCodeBox, emailGateNeeded, purposeFor } from './email_verify.c44911bb1b.js';
import { wizardEnabled, firstVisitNoServer } from './wizard/flag.js';
import { adoptSetupToken, setSetupCodeAsker } from './setup_gate.d66104e8e0.js';
import { EXEC_URL_RE, serverFromInput } from './exec_url.4b6ba956ed.js';
import { pendingFrom, pendingFromServer, savePending, readPending, clearPending, HANDOFF_KEY } from './connect_confirm.30276237a3.js';
import { greeting, vnDayText } from './greet.60b99ed569.js';
import { privacyLine } from './instance.087c1b328a.js';
import { deviceVerifyForm, kickedView, watchSession } from './device_slots.eec0ddd1cc.js';
import { pendingCount, pendingPackage, pendingFileName, pendingDialog, backupSource } from './pending_rescue.39340eedfa.js';
import { offlineEligibility, actionAllowed, blockedMessage, bannerText, parseFails, recordFail, lockedUntil, triesLeft, fmtTime, RETRY_MS, LS_FAILS, LOGIN_TIMEOUT_MS, BOOT_STATUS_MS, DIAG_TIMEOUT_MS, isNetworkKind } from './offline_mode.c91823c363.js';
const _o2i = () => import('./offline_ui.7f7c8e35dd.js');
const openDiagnosis = (_o2e) => _o2i().then((m) => m.openDiagnosis(_o2e));
const classifyWithProbe = (e) => _o2i().then((m) => m.classifyWithProbe(e));
import { ApiError } from './api.8a9774059d.js';
import { SYNC_TABLES } from './store.56498e5e0f.js';
try { for (const _o1t of document.querySelectorAll('link[data-bds-font]')) _o1t.media = 'all'; } catch { }
const _o2y = new URLSearchParams(location.search);
const PACK = config.PACK || 'bds';
const _o4 = './packs/' + PACK + '/';
const _o5 = { home: 'home', customers: 'customers', sales: 'sales', content: 'bulb', inbox: 'inbox', settings: 'settings' };
const S = {
api: null, auth: null, store: null, settings: null, ai: null, registry: null, pack: null,
logic: {}, data: { projects: [], defaultPolicies: {} },
route: null, current: null, routeSubs: new Set(), mounted: null, shellReady: false, lockEl: null,
packs: null,
video: null,
user: null, users: null
};
const _o1 = 'bds:errlog';
const errors = {
log: (() => { try { return JSON.parse(localStorage.getItem(_o1)) || []; } catch { return []; } })(),
queue: [], last: new Map(),
report(level, where, message, detail) {
level = level === 'critical' ? 'critical' : 'warn';
const key = level + where + message;
const now = Date.now();
if (now - (errors.last.get(key) || 0) < 10000) return;
errors.last.set(key, now);
const e = { at: now, level, where: String(where || '').slice(0, 120), message: String(message || '').slice(0, 500), detail: detail ? String(detail).slice(0, 2000) : '' };
errors.log.push(e); if (errors.log.length > 50) errors.log.splice(0, errors.log.length - 50);
try { localStorage.setItem(_o1, JSON.stringify(errors.log)); } catch { }
(window.__bdsErrors = window.__bdsErrors || []).push(e);
errors.queue.push(e);
if (level === 'critical' && S.shellReady) toast(t('err.save'), 'error', 5000);
errors.flush();
},
async flush() {
if (!S.api || !S.api.hasValidToken() || !errors.queue.length) return;
const _o1r = errors.queue.splice(0, errors.queue.length);
for (const e of _o1r) {
try { await S.api.call('errors.report', { level: e.level, where: e.where, message: e.message, detail: e.detail }); } catch { }
}
},
recent() { return errors.log.slice(); }
};
function _o1m() {
window.addEventListener('error', (_o13) => {
if (_o13.target && _o13.target !== window && _o13.target.tagName) return;
errors.report('warn', 'window.onerror', _o13.message || 'error', _o13.error && _o13.error.stack);
});
window.addEventListener('unhandledrejection', (_o13) => {
const r = _o13.reason;
errors.report(r && r.critical ? 'critical' : 'warn', 'unhandledrejection', (r && (r.message || r.code)) || String(r), r && r.stack);
_o13.preventDefault();
});
window.addEventListener('bds:error', (_o13) => { const _ou = _o13.detail || {}; errors.report(_ou.level, _ou.where, _ou.message, _ou.detail); });
}
async function _o1x(src) {
try {
const r = await fetch(src);
if (!r.ok) return null;
const code = await r.text();
if (/^\s*export\s/m.test(code)) return await import(new URL(src, document.baseURI).href);
await new Promise((res, rej) => {
const s = document.createElement('script'); s.src = src; s.async = true;
s.onload = res; s.onerror = rej; document.head.appendChild(s);
});
return {};
} catch (e) { errors.report('warn', 'loadLib:' + src, String(e && e.message || e)); return null; }
}
async function _o1y() {
const [logicMod, dataMod] = await Promise.all([
window.BDSLogic ? null : _o1x('./shared/logic.js'),
window.BDSData ? null : _o1x('./data/projects.js')]);
S.logic = window.BDSLogic || (logicMod && (logicMod.default || logicMod)) || {};
const D = window.BDSData || window.BDSProjects || (dataMod && (dataMod.default || dataMod)) || {};
const projects = D.projects || D.PROJECTS || (Array.isArray(D) ? D : []);
const defaultPolicies = D.defaultPolicies || D.DEFAULT_POLICIES || D.policies || {};
S.data = { ...D, projects: Array.isArray(projects) ? projects : [], defaultPolicies };
}
async function _oj() {
setHelpConfig(config);
applyPrefs();
_o1m();
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => applyPrefs());
const root = document.getElementById('app');
const _o35 = createRegistry({ base: _o4, report: errors.report });
S.registry = _o35;
const _o2q = _o35.loadPack().then(async (pack) => {
S.pack = pack;
try { setFeaturePackInfo(pack); } catch { }
if (pack.words) {
try { const r = await fetch(_o4 + pack.words); if (r.ok) setPackWords(await r.json()); } catch { }
}
document.title = t('app.name');
}).catch((e) => errors.report('warn', 'boot.pack', String(e && e.message || e)));
const _o3o = _o1y();
const lockMs = Number(_o2y.get('lockms')) || 0;
if (await _o31(root)) return;
wizardEnabled({ config });
const _o3l = _oa();
const connectUrl = _o9();
const _o1p = /^#\/moi\?/.test(location.hash || '') ? (await import('./invite_accept.1d7e9d057d.js')).takeInviteToken() : '';
if (_o3l) { const _o47 = pendingFromServer(_o3l, _o1p); if (_o47) savePending(_o47); }
S.api = createApi({ config });
setSetupCodeAsker(_oe);
_o1b(S.api);
S.auth = createAuth({ api: S.api, lockMs, defaultLockMinutes: config.LOCK_MINUTES || 10 });
S.api.onAuthLost(async (e) => {
if (!S.shellReady) return;
if (e && e.kicked) return _o2m(e.kicked);
const _o14 = !S.api.hasValidToken();
toast(t('auth.session_lost'), 'warn'); S.api.clearSession(); _o4m();
if (!_o14 && !(await _o1s(S.store))) await _o54();
showLogin();
});
watchSession({ api: S.api, active: () => S.shellReady && !S.kicking, supported: () => !!(S.status && S.status.device_slots) });
S.auth.on('lock', _o3x);
S.auth.on('user', (_o4x) => { S.user = _o4x; });
S.user = S.auth.user;
S.api.onMustChange(() => { if (S.shellReady) { _o4m(); _o3y(); } });
document.documentElement.dataset.mode = S.api.mode;
await _o2q;
if (_o2y.get('action') === 'tfa.deny' && _o2y.get('t')) { await _o3o; return _o3s(_o2y.get('t')); }
if (_o3l && !scriptUrl(config)) { const _o47 = readPending(); if (_o47) { await _o3o; return _o3q(_o47); } }
if (_o1p) { await _o3o; return (await import('./invite_accept.1d7e9d057d.js')).showInviteAccept({ ui, api: S.api, auth: S.auth, token: _o1p, root, afterLogin, showLogin }); }
if (_o4k()) { await _o3o; return showConnect(); }
const _o1g = !scriptUrl(config) ? readPending() : null;
if (_o1g) { await _o3o; return _o3q(_o1g); }
if (connectUrl && (scriptUrl(config) ? scriptUrl(config) !== connectUrl : !wizardEnabled({ config }))) { await _o3o; return showConnect(connectUrl); }
if (connectUrl && !scriptUrl(config) && S.api.mode === 'demo') { await _o3o; if (await _o55()) return; return showConnect(connectUrl); }
if (firstVisitNoServer({ api: S.api, config })) { await _o3o; if (await _o55()) return; }
let status;
try { status = await S.api.call('status', {}, { timeoutMs: BOOT_STATUS_MS }); } catch (e) {
await _o3o;
if (S.api.hasValidToken()) {
S.offline = { mode: 'token', lastSync: 0 };
await _o11();
_o4a();
if (S.auth.isLocked() || S.auth.idleExpired()) { S.auth.lock(); _o3x(); }
return;
}
if (S.api.mode !== 'demo' && (S.auth.user || S.auth.localState().hasVerifier)) {
const _om = await classifyWithProbe(e);
return showLogin(_om.message, { net: _om });
}
return _o3z(root, e);
}
await _o3o;
S.status = status || null;
if (!status || !status.setup) return (await import('./oneclick.c9ce44d759.js').then((m) => m.shouldStartWizard(status, config) && wizardEnabled({ config, search: '?wizard=1' })).catch(() => false), await _o55()) || showSetup();
if (!S.api.hasValidToken()) { if (S.api.token) S.api.clearSession(); return showLogin(); }
try { await S.auth.me(); } catch (e) {
if (e && e.kicked) { _o20(_o2, '1'); const r = await _o3a(e.kicked, null); S.api.clearSession(); return _o3w(e.kicked, r); }
if (e && (e.code === 'AUTH_REQUIRED' || e.code === 'AUTH_INVALID')) { S.api.clearSession(); if (!(await _o1s(null))) await _o54(); return showLogin(); }
}
if (S.user && S.user.must_change_pw) return _o3y();
if (S.auth.meFresh() && emailGateNeeded(S.user)) return _o3u();
if ((await _o11()) === false) return;
if (S.auth.isLocked() || S.auth.idleExpired()) { S.auth.lock(); _o3x(); } else _o3d();
}
async function _o55() {
if (!wizardEnabled({ config })) return false;
try { return (await import('./wizard/index.js')).wizardBeforeSetup({ ui, api: S.api, config, showSetup, showConnect: () => showConnect('', { login: true }) }); } catch (e) { errors.report('warn', 'wizard.setup', String(e && e.message || e)); return false; }
}
const LINK_PROBLEM_KEY = 'bds:wizard:may_chu_loi';
function _oe(err) {
const _o1l = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: 7, class: 'input', 'data-testid': 'setup-code-input', placeholder: '123 456' });
const m = modal({
title: 'Nhập mã cài đặt',
body: h('div', null,
h('p', { class: 'lead' }, 'Mở Sheet máy chủ › menu BDS Studio › Cài đặt: hộp thoại có "Mã cài đặt" 6 số. Nhập mã đó để tạo tài khoản Quản trị.'),
err && err.tries_left !== undefined && err.message ? h('p', { class: 'muted' }, err.message) : null,
_o1l),
actions: [{ label: t('common.cancel'), kind: 'ghost', value: null, icon: 'close' }, { label: 'Tiếp tục', kind: 'primary', value: 'ok', id: 'setup-code-ok', icon: 'check' }]
});
setTimeout(() => { try { _o1l.focus(); } catch { } }, 50);
return m.done.then((v) => (v === 'ok' ? String(_o1l.value || '').replace(/\D/g, '') || null : null));
}
function _o9() {
const m = /^#\/ket-noi(?:\?(.*))?$/.exec(location.hash || '');
if (!m) return '';
let v = '', q = null;
try { q = new URLSearchParams(m[1] || ''); v = String(q.get('may_chu') || '').trim(); } catch { v = ''; }
if (q) adoptSetupToken(q);
try { history.replaceState(null, '', location.pathname + location.search + '#/home'); } catch { }
if (!EXEC_URL_RE.test(v)) {
try { sessionStorage.removeItem('bds:wizard:may_chu'); sessionStorage.setItem(LINK_PROBLEM_KEY, v ? (/\/dev(\?.*)?$/.test(v) ? 'dev' : 'bad') : 'empty'); } catch { }
if (!wizardEnabled({ config })) toast('Link mở app chưa kèm địa chỉ máy chủ đúng (…/exec). Trong Sheet: làm bước Triển khai › Tuỳ chọn triển khai mới, rồi bấm "Tôi đã triển khai xong".', 'warn', 9000);
return '';
}
try { sessionStorage.removeItem(LINK_PROBLEM_KEY); } catch { }
if (q && q.get('tu') === 'cai' && !scriptUrl(config)) {
const p = pendingFrom(v, q);
if (p) savePending(p);
return '';
}
try { sessionStorage.setItem('bds:wizard:may_chu', v); } catch { }
return v;
}
async function _o31(root) {
const P = config.PORTAL;
if (!(P === true || (P && typeof P === 'object' && P.host && location.hostname === P.host))) return false;
try {
const portal = await import('./portal.c67f0ba398.js');
if (location.hash === portal.CLEAR_ROUTE) { await portal.renderClearPage(root); return true; }
window.addEventListener('hashchange', () => { if (location.hash === portal.CLEAR_ROUTE) location.reload(); });
await portal.portalGuard({ config });
document.documentElement.dataset.portal = '1';
} catch (e) { errors.report('warn', 'portal.boot', String(e && e.message || e)); }
return false;
}
function _oa() {
const v = String(_o2y.get('server') || '').trim();
if (!_o2y.has('server')) return '';
_o2y.delete('server');
try { const q = _o2y.toString(); history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash); } catch { }
return EXEC_URL_RE.test(v) && !scriptUrl(config) ? v : '';
}
async function afterLogin(password, extra) {
_o20(_o2, null);
try { await S.auth.me(); } catch { }
if (S.user && S.user.must_change_pw) return _o3y(password);
if (S.auth.meFresh() && emailGateNeeded(S.user)) return _o3u(extra);
if ((await _o11(extra)) === false) return;
_o3d();
}
function _o3d() {
let quietTfa = false;
try { quietTfa = !!(S.wizard && typeof S.wizard.beforeStep === 'function' && (S.wizard.beforeStep('tfa') || (typeof S.wizard.quietTfa === 'function' && S.wizard.quietTfa()))); } catch { quietTfa = false; }
postLoginPrompts({ ui, auth: S.auth, nav, quietTfa }).catch((e) => errors.report('warn', 'tfa.post', String(e && e.message || e)));
}
function _o3b() {
if (S.api.mode !== 'demo') return null;
const _o3e = (config.edition || 'owner') !== 'owner';
return h('div', { class: ['ribbon', _o3e && 'ribbon-notreal'], role: 'note', 'data-testid': 'demo-ribbon' },
h('span', { class: 'ribbon-dot' }), h(_o3e ? 'strong' : 'span', null, t(_o3e ? 'demo.ribbon.sale' : 'demo.ribbon')),
S.shellReady ? h('a', { href: '#/settings', class: 'ribbon-link' }, t('demo.connect')) : null);
}
function _og(title, lead, ...content) {
const root = document.getElementById('app');
root.className = 'app app-auth';
S.shellReady = false;
const _o33 = S.quietRibbon; S.quietRibbon = false;
mountTo(root, _o33 ? null : _o3b(),
h('main', { class: 'auth' },
h('div', { class: 'auth-card' },
h('div', { class: 'brand' }, h('img', { src: 'assets/icon.svg', alt: '', class: 'brand-mark', width: 56, height: 56 }),
h('div', null, h('div', { class: 'brand-name' }, t('app.name')), h('div', { class: 'brand-tag' }, t('app.tagline')))),
h('h1', { class: 'auth-title' }, title),
lead ? h('p', { class: 'auth-lead' }, lead) : null,
...content)));
const _o17 = root.querySelector('input'); if (_o17) _o17.focus({ preventScroll: true });
}
function _o19() { return h('p', { class: 'form-err', role: 'alert', 'aria-live': 'assertive' }); }
function _o12(e) {
if (!e) return t('err.generic');
if (e.code === 'LOCKED') return t('auth.err.locked', { time: e.retry_at ? new Date(Number(e.retry_at)).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '15 phút' });
if (e.code === 'AUTH_INVALID') return e.userMessage || t('auth.err.wrong');
return e.userMessage || e.message || t('err.generic');
}
function _o4f(input) {
const _oi = [0, 1, 2, 3].map(() => h('span', { class: 'sbar' }));
const label = h('span', { class: 'slabel' }, '');
const el = h('div', { class: 'strength', 'data-score': '0', 'aria-live': 'polite' }, h('div', { class: 'sbars' }, _oi), label);
const _o4z = () => {
const v = input.value; const s = v ? strength(v) : 0;
el.dataset.score = v ? String(s) : '';
label.textContent = v ? t('auth.strength.' + s) : '';
};
input.addEventListener('input', _o4z);
return el;
}
function _ol(_o18, fn) {
return async (_o13) => {
_o13.preventDefault();
if (_o18.dataset.busy) return;
_o18.dataset.busy = '1';
const _ok = _o18.querySelector('button[type=submit]');
const err = _o18.querySelector('.form-err'); if (err) err.textContent = '';
if (_ok) { _ok.classList.add('is-busy'); _ok.disabled = true; }
try { await fn(); } catch (e) { if (err) err.textContent = _o12(e); } finally {
delete _o18.dataset.busy; if (_ok) { _ok.classList.remove('is-busy'); _ok.disabled = false; }
}
};
}
const _o6 = 'bds:setup_email';
function _o3n() {
try {
const v = JSON.parse(sessionStorage.getItem(_o6) || 'null');
if (!v || !v.email) return null;
if (v.via === 'ticket' && v.use_account_email) return { email: String(v.email), use_account_email: true, via: 'ticket' };
if (Date.now() - Number(v.at || 0) > 14 * 60000) return { email: String(v.email) };
return { email: String(v.email), code: String(v.code || ''), use_account_email: !!v.use_account_email };
} catch { return null; }
}
function _op() { try { sessionStorage.removeItem(_o6); } catch { } }
function showSetup() {
if (!S.status && S.api) return S.api.call('status').then((st) => { S.status = st || null; }, () => {}).then(() => _o42());
return _o42();
}
function _o42() {
const _o2a = !!(S.status && S.status.email_verify);
const demo = S.api.mode === 'demo';
const pre = _o2a ? _o3n() : null;
const quick = !!(pre && pre.via === 'ticket' && pre.use_account_email);
const name = ui.field({ label: t('auth.setup.name'), name: 'owner', autocomplete: 'name', ...(quick ? { hint: 'Bỏ trống được – sửa sau ở Cài đặt › Thông tin cá nhân.' } : {}) });
const un = _o50((quick && usernameFromEmail(pre.email)) || 'admin');
const phone = ui.field({ label: 'Số điện thoại của anh/chị', type: 'tel', name: 'phone', id: 'setup-phone', autocomplete: 'tel', inputmode: 'tel', placeholder: 'VD: 0912 345 678',
hint: 'In trên tin nhắn Zalo, trang landing và ảnh báo giá gửi khách. Bỏ trống được – thêm sau ở Cài đặt › Thông tin cá nhân.' });
phone.input.setAttribute('data-testid', 'setup-phone');
const p1 = ui.field({ label: t('auth.password'), type: 'password', name: 'password', autocomplete: 'new-password', id: 'pw1' });
const p2 = ui.field({ label: t('auth.password2'), type: 'password', name: 'password2', autocomplete: 'new-password', id: 'pw2' });
const err = _o19();
let _o13 = pre && (pre.code || pre.use_account_email) ? pre : null;
const evBox = _o2a ? emailCodeBox({
ui, api: S.api, testid: 'setup-ev', email: (pre && pre.email) || (demo ? 'demo@dungthu.local' : ''),
label: 'Email của anh/chị (bắt buộc)', hint: 'Bấm "Gửi mã", mở email lấy mã 6 số. Email đã xác nhận dùng để nhận mã khi quên mật khẩu.',
send: (em) => S.auth.emailStart(em, 'setup'), verify: (em, _om) => S.auth.emailCheck(em, _om), allowAccountEmail: true,
onVerified: (v) => { _o13 = v.use_account_email ? { use_account_email: true, email: v.email } : { email: v.email, code: v.code }; }
}) : null;
const evDone = _o2a ? h('p', { class: 'ev-ok', 'data-testid': 'setup-ev-done', hidden: !_o13 }, _o13 ? (quick ? '✅ Email: ' + _o13.email + ' – tài khoản Google vừa cài máy chủ (Google đã xác minh).' : '✅ Email đã xác nhận: ' + _o13.email) : '') : null;
if (evDone && quick) evDone.append(' ', h('button', { type: 'button', class: 'link-btn', 'data-testid': 'setup-ev-other', onclick: () => { _o13 = null; _op(); evDone.hidden = true; evBox.hidden = false; } }, icon('mail', 16), ' Dùng email khác'));
if (evBox && _o13) evBox.hidden = true;
const phoneBox = quick ? h('details', { class: 'setup-more', 'data-testid': 'setup-more' }, h('summary', { class: 'small' }, '📞 Thêm số điện thoại (tuỳ chọn)'), phone) : phone;
const _o18 = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'setup-form', dataset: { quick: quick ? '1' : '' } }, ...(quick ? [un, p1, _o4f(p1.input), p2, evDone, name, phoneBox, evBox] : [name, phone, un, p1, _o4f(p1.input), p2, evBox, evDone]), err,
privacyLine(h, { testid: 'setup-privacy', lead: 'Tạo tài khoản là anh/chị đã đọc ', cfg: config }),
button(t('auth.setup.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'setup-submit', icon: 'lock' }),
_os());
_o18.addEventListener('submit', _ol(_o18, async () => {
const a = p1.getValue(), b = p2.getValue();
const username = normUsername(un.getValue()) || 'admin';
if (!validUsername(username)) throw new Error(t('auth.err.username'));
if (a.length < 8) throw new Error(t('auth.err.short'));
if (a !== b) throw new Error(t('auth.err.mismatch'));
const _o2z = String(phone.getValue() || '').trim();
if (_o2z && !validMyPhone(_o2z)) { if (phoneBox !== phone) phoneBox.open = true; phone.input.focus(); throw new Error('Số điện thoại chưa đúng (10 số, bắt đầu bằng 0) – sửa lại hoặc để trống.'); }
let _o10 = null;
if (_o2a) {
if (!_o13 && demo) await evBox.autoDemo('demo@dungthu.local');
if (!_o13) { evBox.focus(); throw new Error('Cần xác nhận email: bấm "Gửi mã", rồi nhập mã 6 số trong email.'); }
_o10 = _o13.use_account_email ? { use_account_email: true } : { email: _o13.email, email_code: _o13.code };
}
let _o48;
try { _o48 = await S.auth.setup(a, String(name.getValue() || '').trim(), username, _o10); } catch (e) {
if (_o2a && /Mã xác nhận|Thiếu email|email tài khoản Google/i.test(String((e && (e.userMessage || e.message)) || ''))) { _o13 = null; _op(); if (evDone) evDone.hidden = true; evBox.hidden = false; }
throw e;
}
_op();
if (_o48 && (_o48.tfa_required || _o48.device_verify_required)) return _o43(_o48, a);
if (name.getValue()) { prefs.set('owner_name', String(name.getValue()).trim()); }
if (S.api.mode === 'demo') { try { await S.api.seedDemo(); } catch (e) { errors.report('warn', 'seedDemo', String(e && e.message || e)); } }
await afterLogin(a, { ownerName: String(name.getValue() || '').trim(), ownerPhone: _o2z });
}));
_og(t('auth.setup.title'), quick ? 'Máy chủ đã sẵn sàng trong Google của anh/chị. Đặt mật khẩu (từ 8 ký tự) là vào app.' : t('auth.setup.lead'), _o18);
if (quick) { try { p1.input.focus({ preventScroll: true }); } catch { } }
}
export function validMyPhone(p) { let _ou = String(p || '').replace(/\D/g, ''); if (_ou.startsWith('84') && _ou.length >= 11) _ou = '0' + _ou.slice(2); return /^0[35789]\d{8}$/.test(_ou) || /^02\d{9}$/.test(_ou); }
function _o50(value) {
const _o15 = ui.field({ label: t('auth.username'), name: 'username', id: 'username', autocomplete: 'username', value: value || '' });
_o15.input.setAttribute('autocapitalize', 'none'); _o15.input.setAttribute('spellcheck', 'false'); _o15.input.setAttribute('autocorrect', 'off');
_o15.input.addEventListener('input', () => { const v = _o15.input.value.toLowerCase().replace(/\s+/g, ''); if (v !== _o15.input.value) _o15.input.value = v; });
return _o15;
}
function showLogin(_o26, { net } = {}) {
const un = _o50(S.auth.lastUsername());
const p = ui.field({ label: t('auth.password'), type: 'password', name: 'password', autocomplete: 'current-password', id: 'pw' });
const err = _o19(); if (_o26) err.textContent = _o26;
const _o2c = S.status && S.status.notice && S.status.notice.kind === 'migrated' ? S.status.notice : null;
if (_o2c) tfaCss();
const notice = _o2c ? h('div', { class: 'auth-notice', role: 'note', 'data-testid': 'login-notice' },
h('span', null, 'Vừa nâng cấp máy chủ? Chủ app đăng nhập bằng tên ', h('strong', null, _o2c.username), ' (lấy theo tên trong Hồ sơ), mật khẩu giữ nguyên như cũ.'),
un.getValue() === _o2c.username ? null : button('Dùng tên ' + _o2c.username, () => { un.setValue(_o2c.username); p.input.focus(); }, { kind: 'ghost', small: true, id: 'use-notice-name' })) : null;
const prog = h('p', { class: 'login-progress', 'data-testid': 'login-progress', 'aria-live': 'polite' });
const helpBox = h('div', { class: 'login-help', 'data-testid': 'login-help', hidden: true });
const _o18 = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'login-form' }, notice, un, p, err, prog,
button(t('auth.login.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'login-submit', icon: 'user' }),
helpBox,
h('button', { type: 'button', class: 'link-btn', id: 'forgot', onclick: _o41 }, icon('key', 16), ' ', t('auth.forgot')),
_os());
const _o3v = async (_om) => {
mountTo(helpBox, h('div', { class: 'login-help-acts' },
button(t('net.retry'), () => { if (!_o18.dataset.busy) _o18.requestSubmit(); }, { kind: 'secondary', icon: 'refresh', testid: 'login-retry' }),
button(t('net.diag'), () => { openDiagnosis({ ui, api: S.api, config }); }, { kind: 'secondary', icon: 'pulse', testid: 'login-diag' })));
helpBox.dataset.kind = _om.kind;
helpBox.hidden = false;
const el = await _o2j();
if (!helpBox.isConnected || helpBox.hidden) return;
if (el.ok) helpBox.appendChild(button(t('off.open'), () => _o40(el), { kind: 'primary', block: true, icon: 'lock', testid: 'login-offline' }));
else if (el.reason && !['demo', 'never'].includes(el.reason)) helpBox.appendChild(h('p', { class: 'muted small', 'data-testid': 'login-offline-why' }, el.message));
};
_o18.addEventListener('submit', _ol(_o18, async () => {
const username = loginName(un.getValue());
if (!validUsername(username)) { un.input.focus(); throw new Error(t('auth.err.username')); }
if (!p.getValue()) throw new Error(t('auth.err.short'));
helpBox.hidden = true;
const _o4j = Date.now(); let _o4c = 1;
const _o2s = () => { prog.textContent = t('net.step.login' + _o4c) + ' ' + t('net.step.secs', { s: Math.floor((Date.now() - _o4j) / 1000) }); prog.dataset.step = String(_o4c); };
const stop = () => { clearInterval(_o4n); prog.textContent = ''; delete prog.dataset.step; };
_o2s();
const _o4n = setInterval(_o2s, 1000);
let r;
try {
r = await S.auth.login(username, p.getValue(), { onStep: (n) => { _o4c = n; _o2s(); }, timeoutMs: LOGIN_TIMEOUT_MS });
} catch (e) {
stop();
const _om = await classifyWithProbe(e);
if (isNetworkKind(_om.kind)) { _o3v(_om); throw Object.assign(new Error(_om.message), { userMessage: _om.message }); }
throw e;
}
stop();
if (r && (r.tfa_required || r.device_verify_required)) return _o43(r, p.getValue());
await afterLogin(p.getValue());
}));
_og(t('auth.login.title'), t('auth.login.lead2'), _o18);
if (net && isNetworkKind(net.kind)) _o3v(net);
if (un.getValue()) p.input.focus({ preventScroll: true });
}
const _o1z = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const _o20 = (k, v) => { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { } };
const _o2 = 'bds:offline_kicked';
async function _o2j() {
try {
const st = createStore({ api: S.api });
await st.open();
let _o3c = 0;
for (const _o4l of SYNC_TABLES) _o3c += (await st.list(_o4l)).length;
const lastSync = st.status().lastSync;
const r = offlineEligibility({ mode: S.api.mode, ...S.auth.localState(), user: S.auth.user, storeUserId: st.userId, rowCount: _o3c, lastSync,
now: Date.now(), lockUntil: lockedUntil(parseFails(_o1z(LS_FAILS))), kicked: _o1z(_o2) === '1' });
return { ...r, lastSync };
} catch (e) { errors.report('warn', 'offline.check', String(e && e.message || e)); return { ok: false, reason: 'nodata', message: t('off.why.nodata') }; }
}
function _o40(el) {
const _o4x = S.auth.user;
const p = ui.field({ label: t('auth.password'), type: 'password', autocomplete: 'current-password', id: 'off-pw' });
const err = _o19();
const who = _o4x ? h('p', { class: 'auth-who' }, h('strong', null, _o4x.full_name || _o4x.username), ' · @' + _o4x.username) : null;
const when = h('p', { class: 'muted small', 'data-testid': 'off-when' }, 'Dữ liệu cập nhật lúc ' + fmtTime(el.lastSync) + ' · mở được tới ' + fmtTime(el.expiresAt) + '.');
const _o18 = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'offline-form' }, who, when, p, err,
button(t('off.open.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'off-submit', icon: 'lock' }),
h('button', { type: 'button', class: 'link-btn', id: 'off-back', onclick: () => showLogin() }, t('common.back')));
_o18.addEventListener('submit', _ol(_o18, async () => {
let _o16 = parseFails(_o1z(LS_FAILS));
const lock = lockedUntil(_o16);
if (lock) throw new Error(t('off.locked', { time: fmtTime(lock) }));
const _o1a = await _o2j();
if (!_o1a.ok) throw new Error(_o1a.message);
if (!(await S.auth.verifyLocal(p.getValue()))) {
_o16 = recordFail(_o16); _o20(LS_FAILS, JSON.stringify(_o16));
const _o1u = lockedUntil(_o16);
p.input.value = '';
throw new Error(_o1u ? t('off.locked', { time: fmtTime(_o1u) }) : t('off.wrong', { n: triesLeft(_o16) }));
}
_o20(LS_FAILS, null);
S.offline = { mode: 'readonly', lastSync: _o1a.lastSync, expiresAt: _o1a.expiresAt };
S.user = S.auth.user;
await _o11();
if (S.offline) _o4a();
}));
_og(t('off.open'), t('off.open.lead'), _o18);
p.input.focus({ preventScroll: true });
}
function _o1b(api) {
const _o2o = api.call.bind(api);
api.call = (action, payload, opts) => {
if (S.offline && !actionAllowed(action, S.offline.mode)) return Promise.reject(new ApiError('OFFLINE', blockedMessage(S.offline.mode), { offline: S.offline.mode, action }));
return _o2o(action, payload, opts);
};
}
let _o2h = 0, lastGesture = 0;
for (const _o13 of ['pointerdown', 'keydown']) window.addEventListener(_o13, () => { lastGesture = Date.now(); }, { capture: true, passive: true });
function _o2k() {
const _o26 = blockedMessage('readonly');
if (Date.now() - lastGesture < 3000 && Date.now() - _o2h > 4000) { _o2h = Date.now(); toast(_o26, 'warn', 6000); }
return Object.assign(new Error(_o26), { code: 'OFFLINE', userMessage: _o26 });
}
const _o34 = () => !!(S.offline && S.offline.mode === 'readonly');
function _o1c() {
const st = S.store;
if (st && !st.__offGate) {
const put = st.put.bind(st);
st.put = async (table, row) => { if (_o34()) throw _o2k(); return put(table, row); };
st.__offGate = true;
}
const ai = S.ai;
if (ai && !ai.__offGate && typeof ai.run === 'function') {
const run = ai.run.bind(ai);
ai.run = async (...a) => { if (_o34()) throw _o2k(); return run(...a); };
ai.__offGate = true;
}
}
const _o3 = Number(_o2y.get('offretryms')) || RETRY_MS;
let _o2g = 0;
async function _o2u(state) {
const _o3k = ++_o2g;
const { offlineBannerEl } = await _o2i();
if (_o3k !== _o2g) return;
document.querySelectorAll('[data-testid="offline-banner"]').forEach((x) => x.remove());
const _o21 = document.querySelector('.app-shell .main');
if (!_o21 || (!S.offline && !state)) return;
const _o2e = S.offline || {};
const last = _o2e.lastSync || (S.store && S.store.status().lastSync) || 0;
let el;
if (state === 'back-login') el = offlineBannerEl(ui, { text: t('off.banner.back'), tone: 'ok', action: () => _o1v(), actionLabel: t('off.banner.login') });
else if (state === 'back') el = offlineBannerEl(ui, { text: t('off.banner.back'), tone: 'ok' });
else el = offlineBannerEl(ui, { text: bannerText({ mode: _o2e.mode, lastSync: last }), tone: _o2e.mode === 'readonly' ? 'bad' : 'warn' });
_o21.insertBefore(el, _o21.firstChild);
}
function _o4d() {
const _o52 = S.offWatch; S.offWatch = null;
if (!_o52) return;
clearInterval(_o52.retry); clearInterval(_o52.guard); if (_o52.unsub) _o52.unsub();
}
function _o4a() {
_o4d();
if (!S.offline) return;
const _o52 = S.offWatch = { busy: false };
const back = (data) => {
if (!S.offline) return;
if (S.offline.mode === 'readonly') { S.offline.reconnected = true; if (data) S.status = data; clearInterval(_o52.retry); _o2u('back-login'); return; }
S.offline = null; _o4d(); _o2u('back');
setTimeout(() => { if (!S.offline) _o2u(); }, 6000);
if (S.store) S.store.syncNow();
};
if (S.offline.mode === 'token' && S.store) {
const _o17 = S.store.status().lastSync;
S.offline.lastSync = _o17;
_o52.unsub = S.store.onStatus((st) => { if (S.offline && st.online && st.lastSync > _o17) back(); });
}
if (!S.offline) return;
_o2u();
_o52.retry = setInterval(async () => {
if (_o52.busy || !S.offline || S.offline.reconnected) return;
_o52.busy = true;
try {
const r = await S.api.request({ action: 'status', token: '', device_id: S.api.deviceId, payload: {} }, { timeoutMs: DIAG_TIMEOUT_MS });
if (r && r.ok) back(r.data);
} catch { } finally { _o52.busy = false; }
}, _o3);
if (S.offline.mode === 'readonly') {
_o52.guard = setInterval(() => {
if (!_o34()) return;
if (Date.now() > S.offline.expiresAt) _o1v(t('off.why.expired'));
else if (S.auth.idleExpired()) _o1v();
}, 15000);
}
}
function _o1v(_o26) {
_o4d();
_o4m();
S.offline = null;
showLogin(_o26);
}
async function _o3s(tok) {
const box = h('div', { class: 'auth-form', 'data-testid': 'deny-result' }, ui.spinner());
_og('Khoá thiết bị lạ', '', box);
const back = () => { try { history.replaceState(null, '', location.pathname); } catch { } location.reload(); };
try {
const r = await S.api.call('auth.device_deny', { t: tok });
mountTo(box, h('p', { class: 'lead' }, r.already ? 'Thiết bị này đã được khoá trước đó.'
: 'Đã khoá thiết bị "' + (r.device_name || '') + '" của @' + r.username + '. Nên đổi mật khẩu ngay: Cài đặt › Bảo mật.'),
button('Về màn đăng nhập', back, { kind: 'primary', block: true }));
} catch (e) {
mountTo(box, h('p', { class: 'form-err' }, e.userMessage || e.message), button('Về màn đăng nhập', back, { kind: 'secondary', block: true }));
}
}
function _o43(challenge, password) {
if (challenge && challenge.device_verify_required) return _o3t(challenge, password);
const _o18 = tfaStepForm(challenge, {
ui, auth: S.auth, demo: S.api.mode === 'demo',
onDone: (data) => (data && data.device_verify_required ? _o3t(data, password) : afterLogin(password)),
onCancel: () => { S.auth.cancelTfa(); showLogin(); }
});
_og('Xác thực 2 lớp', 'Máy này chưa quen nên cần thêm một bước. Máy đã xác nhận sẽ không bị hỏi lại trong 30 ngày.', _o18);
const _om = _o18.querySelector('#tfa-code'); if (_om) _om.focus({ preventScroll: true });
}
function _o3t(challenge, password) {
const _o18 = deviceVerifyForm(challenge, {
ui, auth: S.auth, api: S.api, demo: S.api.mode === 'demo',
onDone: () => afterLogin(password),
onCancel: () => { S.auth.cancelTfa(); showLogin(); }
});
_og('Xác nhận đổi máy', null, _o18);
const _om = _o18.querySelector('#dv-code'); if (_om) _om.focus({ preventScroll: true });
}
async function _o3a(k, st) {
let n = 0, tried = false, wiped = false;
try {
if (!st) { st = createStore({ api: S.api }); await st.open(); }
n = Number(st.status().pending) || 0;
for (let _o1k = 0; _o1k < 2 && n && k.why !== 'remote' && Number(k.grace_until) > Date.now(); _o1k++) {
tried = true;
try { await Promise.race([st.syncNow(), new Promise((r) => setTimeout(r, 8000))]); } catch { }
n = Number(st.status().pending) || 0;
}
} catch (e) { errors.report('warn', 'device.rescue', String(e && e.message || e)); }
if (k.why === 'remote') { await _o54(); wiped = true; }
return { pending: n, tried, wiped, st: wiped ? null : st };
}
async function _o2m(k) {
if (S.kicking) return;
S.kicking = true;
_o20(_o2, '1');
try {
const r = await _o3a(k, S.store);
S.api.clearSession(); _o4m();
_o3w(k, r);
} finally { S.kicking = false; }
}
function _o3w(k, r = {}) {
const _ov = r.st && Number(r.pending) > 0 && !r.wiped ? () => _oy(r.st) : null;
_og('Máy này đã đăng xuất', null, kickedView({ ui, kicked: k, pending: r.pending, tried: r.tried, wiped: r.wiped, onRelogin: () => showLogin(), onDownload: _ov }));
}
function _o3u(extra) {
const _o4x = S.user || {}, g = _o4x.email_gate || {};
const _o2p = _o4x.role === 'owner';
const done = async (_o26) => { toast(_o26, 'ok', 4000); if ((await _o11(extra)) === false) return; _o3d(); };
const defer = _o2p ? async () => { await S.auth.emailDefer(); await done('Đã để sau 24 giờ. Hết 24 giờ app hỏi lại email.'); } : null;
const box = emailCodeBox({
ui, api: S.api, testid: 'gate-ev', email: g.email || _o4x.email || '', label: 'Email của anh/chị',
hint: 'Gõ đúng email anh/chị đang dùng (sửa được nếu Quản trị gõ nhầm). Email đã xác nhận dùng để nhận mã khi quên mật khẩu.',
send: (em) => S.auth.emailStart(em, purposeFor(em, _o4x.email || g.email || '')),
verify: (em, _om) => S.auth.verifyEmail(_om),
allowAccountEmail: _o2p, useAccountEmail: () => S.auth.verifyEmail('', true), onDefer: defer,
onVerified: () => done('Đã xác nhận email. Cảm ơn anh/chị!')
});
const who = h('p', { class: 'auth-who' }, h('strong', null, _o4x.full_name || _o4x.username || ''), _o4x.username ? ' · @' + _o4x.username : '');
const later = _o2p && g.can_defer ? h('div', { class: 'auth-notice', role: 'note', 'data-testid': 'gate-defer-box' },
h('span', null, 'Máy chủ vừa không gửi được email. Anh/chị có thể để sau 24 giờ rồi làm tiếp.'),
button('Để sau (24 giờ)', defer, { kind: 'ghost', small: true, testid: 'gate-defer' })) : null;
const _o18 = h('div', { class: 'auth-form', 'data-testid': 'email-gate' }, who, box, later,
h('button', { type: 'button', class: 'link-btn', id: 'gate-logout', onclick: async () => { await S.auth.logout(); showLogin(); } }, icon('logout', 16), ' ', t('auth.logout')));
_og('Bổ sung email (bắt buộc)', 'Mỗi tài khoản cần một email đã xác nhận để nhận mã khi quên mật khẩu. Anh/chị bấm "Gửi mã", mở email rồi nhập mã 6 số. Làm 1 lần, khoảng 1 phút.', _o18);
box.focus();
}
function _o3y(tempPw) {
const old = tempPw ? null : ui.field({ label: t('auth.must.old'), type: 'password', autocomplete: 'current-password', id: 'must-old' });
const p1 = ui.field({ label: t('auth.reset.new'), type: 'password', autocomplete: 'new-password', id: 'must-pw1' });
const p2 = ui.field({ label: t('auth.password2'), type: 'password', autocomplete: 'new-password', id: 'must-pw2' });
const err = _o19();
const who = S.user ? h('p', { class: 'auth-who' }, h('strong', null, S.user.full_name || S.user.username), ' · @' + S.user.username) : null;
const _o18 = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'mustchange-form' }, who, old, p1, _o4f(p1.input), p2, err,
button(t('auth.must.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'must-submit', icon: 'check' }),
h('button', { type: 'button', class: 'link-btn', 'data-testid': 'must-logout', onclick: async () => { await S.auth.logout(); showLogin(); } }, icon('logout', 16), ' ', t('auth.logout')));
_o18.addEventListener('submit', _ol(_o18, async () => {
const a = p1.getValue(), b = p2.getValue();
const _o2e = tempPw || (old && old.getValue()) || '';
if (a.length < 8) throw new Error(t('auth.err.short'));
if (a !== b) throw new Error(t('auth.err.mismatch'));
if (a === _o2e) throw new Error('Mật khẩu mới phải khác mật khẩu tạm.');
await S.auth.changePassword(_o2e, a);
toast(t('auth.must.done'), 'ok');
try { await S.auth.me(); } catch { }
if (S.user) S.user.must_change_pw = 0;
if (S.auth.meFresh() && emailGateNeeded(S.user)) return _o3u();
await _o11();
}));
_og(t('auth.must.title'), t('auth.must.lead'), _o18);
}
function _os() {
return h('button', { type: 'button', class: 'link-btn', id: 'connect-server', 'data-testid': 'connect-server', onclick: showConnect }, icon('link', 16), ' ',
S.api && S.api.mode === 'demo' ? t('auth.connect.demo') : t('auth.connect.change'));
}
async function _o3q(p) {
const _on = await import('./connect_confirm.30276237a3.js');
S.quietRibbon = true;
_og('Kết nối máy chủ của anh/chị', 'Đang kiểm máy chủ trong link…', h('p', { class: 'muted', 'data-testid': 'connect-confirm-wait' }, ui.spinner ? ui.spinner() : null, ' Đang hỏi máy chủ…'));
const probe = await _on.probeServer(p.url);
const _o57 = () => {
clearPending();
saveScriptUrl(p.url);
if (p.kind === 'invite' || p.kind === 'server') {
try { history.replaceState(null, '', location.pathname + location.search + (p.ma ? '#/moi?ma=' + encodeURIComponent(p.ma) : '#/home')); } catch { }
} else {
try { sessionStorage.setItem(HANDOFF_KEY, JSON.stringify({ flow: p.flow, domain: p.domain, at: Date.now() })); } catch { }
if (p.user && validUsername(p.user)) S.auth.rememberUsername(p.user);
}
location.reload();
};
const _o2b = () => { clearPending(); showConnect(); };
const _o1o = p.kind === 'invite' || p.kind === 'server';
S.quietRibbon = true;
_og('Kết nối máy chủ của anh/chị', _o1o
? 'Link mời mở app và nối tới máy chủ dưới đây. Kiểm tên công ty / app trước khi nối – sau khi nối, anh/chị đặt mật khẩu và đăng nhập trên máy chủ này.'
: 'Link mở app chỉ tới máy chủ dưới đây. Kiểm tên và địa chỉ trước khi nối – sau khi nối, app đăng nhập vào máy chủ này.',
_on.confirmView({ h, button }, { url: p.url, probe, onYes: _o57, onNo: _o2b, kind: p.kind || '' }));
}
function showConnect(prefill, { login = false } = {}) {
const url = ui.field({ label: login ? 'Địa chỉ máy chủ hoặc link mở app' : t('auth.connect.url'), name: 'script_url', id: 'connect-url', inputmode: 'url', autocomplete: 'off', help: t('auth.connect.help'), value: typeof prefill === 'string' ? prefill : '' });
const err = _o19();
const _o18 = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'connect-form' }, url, err,
button(t('auth.connect.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'connect-submit', icon: 'link' }),
h('button', { type: 'button', class: 'link-btn', 'data-testid': 'connect-back', onclick: () => location.reload() }, icon('back', 16), ' ', t('common.back')));
_o18.addEventListener('submit', _ol(_o18, async () => {
let v = String(url.getValue() || '').trim();
const _o1e = serverFromInput(v);
if (_o1e) v = _o1e.url;
if (!/^https:\/\/script\.google(usercontent)?\.com\/.+/.test(v)) throw new Error(t('auth.connect.bad'));
saveScriptUrl(v);
try { await createApi({ config }).call('status'); } catch (e) { saveScriptUrl(null); throw new Error(e && e.code === 'NOT_PUBLIC' ? e.userMessage : t('auth.connect.fail')); }
if (S.api && S.api.mode === 'demo') {
const ok = await import('./wizard/demodata.js').then((m) => m.confirmLeaveDemo({ ui, api: S.api })).catch(() => true);
if (!ok) { saveScriptUrl(null); return; }
}
if (_o1e && _o1e.ma) { try { history.replaceState(null, '', location.pathname + location.search + '#/moi?ma=' + encodeURIComponent(_o1e.ma)); } catch { } }
location.reload();
}));
S.quietRibbon = login;
_og(login ? 'Đăng nhập trên máy này' : t('auth.connect.title'), login
? 'Đã cài BDS Studio trên máy khác? Dán địa chỉ máy chủ (kết thúc bằng /exec – trong Sheet máy chủ: menu BDS Studio › Lấy URL máy chủ), hoặc link mở app / link mời đã nhận. App kiểm máy chủ rồi chuyển tới màn đăng nhập.'
: t('auth.connect.lead'), _o18);
}
function _o41() {
const un = _o50(S.auth.lastUsername());
const code = ui.field({ label: t('auth.reset.code'), name: 'code', inputmode: 'numeric', autocomplete: 'one-time-code' });
const p1 = ui.field({ label: t('auth.reset.new'), type: 'password', autocomplete: 'new-password' });
const p2 = ui.field({ label: t('auth.password2'), type: 'password', autocomplete: 'new-password' });
const info = h('p', { class: 'muted', 'aria-live': 'polite' });
const err = _o19();
const send = button(t('auth.reset.send'), async () => {
const username = loginName(un.getValue());
if (!validUsername(username)) { err.textContent = t('auth.err.username'); un.input.focus(); return; }
try { await S.auth.resetRequest(username); S.auth.rememberUsername(username); info.textContent = t('auth.reset.sent'); } catch (e) { err.textContent = _o12(e); }
}, { kind: 'secondary', block: true });
const _o18 = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'reset-form' }, un, send, info, code, p1, _o4f(p1.input), p2, err,
button(t('auth.reset.submit'), null, { kind: 'primary', type: 'submit', block: true }),
h('button', { type: 'button', class: 'link-btn', onclick: () => showLogin() }, t('common.back')));
_o18.addEventListener('submit', _ol(_o18, async () => {
if (p1.getValue().length < 8) throw new Error(t('auth.err.short'));
if (p1.getValue() !== p2.getValue()) throw new Error(t('auth.err.mismatch'));
await S.auth.resetConfirm(code.getValue(), p1.getValue(), loginName(un.getValue()));
showLogin(); toast(t('auth.reset.done'), 'ok', 4000);
}));
_og(t('auth.reset.title'), t('auth.reset.lead2'), _o18);
}
function _o3z(root, e) {
_og(t('err.network'), (e && e.userMessage) || '', h('div', { class: 'auth-form' },
button(t('common.retry'), () => location.reload(), { kind: 'primary', block: true, icon: 'refresh' }),
S.api && S.api.mode !== 'demo' ? button(t('net.diag'), () => { openDiagnosis({ ui, api: S.api, config }); }, { kind: 'secondary', block: true, icon: 'pulse', testid: 'offline-diag' }) : null));
}
function _o3x() {
if (_o34()) return _o1v();
if (S.lockEl || !S.shellReady) return;
document.getElementById('app')?.classList.add('is-locked');
closeSheet();
const p = ui.field({ label: t('auth.password'), type: 'password', autocomplete: 'current-password', id: 'unlock-pw' });
const err = _o19();
const _o18 = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'lock-form' }, p, err,
button(t('auth.lock.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'unlock-submit', icon: 'lock' }),
h('button', { type: 'button', class: 'link-btn', onclick: () => _ow(true) }, icon('logout', 16), ' ', t('auth.logout')));
_o18.addEventListener('submit', _ol(_o18, async () => {
try { await S.auth.unlock(p.getValue()); } catch (e) {
if (e.code === 'TFA_REQUIRED') { _o4m(); return _o43(e.challenge, p.getValue()); }
if (e.code === 'AUTH_INVALID' && !e.userMessage) throw new Error(t('auth.err.wrong'));
throw e;
}
S.lockEl.remove(); S.lockEl = null;
document.getElementById('app')?.classList.remove('is-locked');
S.auth.startIdle();
}));
S.lockEl = h('div', { class: 'lock-overlay', role: 'dialog', 'aria-modal': 'true', 'aria-label': t('auth.lock.title'), 'data-testid': 'lock-screen' },
h('div', { class: 'auth-card' },
h('div', { class: 'lock-ico' }, icon('lock', 30)),
h('h1', { class: 'auth-title' }, t('auth.lock.title')),
h('p', { class: 'auth-lead' }, t('auth.lock.lead')), _o18));
document.body.appendChild(S.lockEl);
p.input.focus({ preventScroll: true });
}
function ctxFor(entry) {
return {
ui, api: S.api, store: S.store, ai: S.ai, logic: S.logic, t, settings: S.settings,
auth: _of, nav, data: S.data, pack: S.pack, config,
errors: { report: errors.report },
get route() { return S.route; },
get user() { return S.user ? { id: S.user.id, username: S.user.username, full_name: S.user.full_name, phone: S.user.phone || '', role: S.user.role, perms: { ...S.user.perms }, telegram_token_set: S.user.telegram_token_set, telegram_chat_id: S.user.telegram_chat_id, legacy: S.user.legacy } : null; },
users: S.users,
get solo() { return _o46(); },
get packs() { return packsView(S.packs, S.video); },
get video() { return S.video; },
onRoute(cb) { S.routeSubs.add(cb); return () => S.routeSubs.delete(cb); },
module: entry && entry.manifest
};
}
function _o46() {
const _oz = String((S.status && S.status.edition) || '');
if (_oz === 'cong-ty') return false;
return _oz === 'ca-nhan' || !!(S.settings && S.settings.get('install.mode', '') === 'personal');
}
const _of = {
get deviceId() { return S.api.deviceId; },
isLoggedIn: () => S.api.hasValidToken(),
lock: () => S.auth.lock(),
logout: () => _ow(),
strength
};
function _oy(st) {
const _o30 = pendingPackage(st, { src: backupSource(st, config) });
download(pendingFileName(), JSON.stringify(_o30), 'application/json');
}
async function _o1s(st) {
try {
if (!st) { st = createStore({ api: S.api }); await st.open(); }
const n = pendingCount(st);
if (!n) return false;
setTimeout(() => { pendingDialog({ ui, n, kind: 'kept', download: () => _oy(st) }).catch(() => {}); }, 0);
return true;
} catch (e) { errors.report('warn', 'store.keep_pending', String(e && e.message || e)); return false; }
}
async function _o54() {
try {
const st = S.store || createStore({ api: S.api });
S.store = null;
await st.open();
await st.clear();
} catch (e) { errors.report('warn', 'store.wipe', String(e && e.message || e)); }
}
function _or(info) {
const _o1i = (info || []).find((x) => x && x.object_id);
const el = toast(t(_o1i ? 'sync.conflict.kept' : 'sync.conflict'), 'warn', _o1i ? 9000 : 4500);
if (!_o1i || !el) return;
el.appendChild(button(t('sync.conflict.view'), (e) => { e.stopPropagation(); location.hash = '#/customers?open=' + encodeURIComponent(_o1i.object_id); el.remove(); },
{ kind: 'ghost', small: true, icon: 'eye', testid: 'conflict-view' }));
}
async function _o11({ ownerName, ownerPhone } = {}) {
const _o23 = () => createStore({
api: S.api, intervalMs: config.SYNC_INTERVAL_MS || 30000,
onConflict: (n, info) => _or(info),
onRejected: (rej) => toast(rejectionMessage(rej) || t('sync.rejected'), 'error', 9000),
onError: errors.report
});
if (S.store) S.store.stop();
S.store = _o23();
await S.store.open();
const uid = S.user && S.user.id ? String(S.user.id) : '';
if (_o34() && (!uid || S.store.userId !== uid)) { S.offline = null; return showLogin(t('off.why.other_user')); }
if (uid && S.store.userId !== uid) {
if (S.store.userId) {
const n = pendingCount(S.store);
if (n && (await pendingDialog({ ui, n, kind: 'other', download: () => _oy(S.store) })) !== 'wipe') {
S.store.stop(); try { await S.auth.logout(); } catch { } S.api.clearSession(); showLogin(); return false;
}
await S.store.clear(); S.store = _o23(); await S.store.open();
}
await S.store.setUser(uid);
}
S.settings = createSettings(S.store);
await S.settings.init();
if (String((S.status && S.status.edition) || '') === 'cong-ty' || S.settings.get('install.mode', '') === 'company') addWords({ 'role.owner': 'Quản trị (Admin)' });
if (ownerName && !(S.settings.get('profile') || {}).name) await S.settings.set('profile', { ...(S.settings.get('profile') || {}), name: ownerName });
if (ownerPhone && !(S.settings.get('profile') || {}).phone) await S.settings.set('profile', { ...(S.settings.get('profile') || {}), phone: ownerPhone });
S.ai = createAI({ api: S.api, settings: S.settings, ui, config });
{ const _oh = S.ai.availability; S.ai.availability = () => { const r = _oh(); return S.user && S.user.perms && S.user.perms.ai === false ? { ...r, gemini: false, claude: false, ollama: false, any: false } : r; }; }
_o1c();
S.users = createUsersApi({ api: S.api, store: S.store, ui, getUser: () => S.user });
S.packs = createPacks({ settings: S.settings, getPack: () => S.pack, isOwner: () => !S.user || !S.user.role || S.user.role === 'owner', userId: () => (S.user && S.user.id) || '' });
S.packs.on(_o2n);
setTimeout(() => { try { S.packs.takeReadyNotices().forEach((_ou) => toast(PACK_WORDS['xpack.notify.ready'].replace('{p}', _ou.title), 'ok', 6000)); } catch { } }, 2500);
S.video = createVideoScreens({ settings: S.settings, prefs, getPack: () => S.pack, isOwner: () => !S.user || !S.user.role || S.user.role === 'owner', userId: () => (S.user && S.user.id) || '' , config, packOn: (id) => !!S.packs && S.packs.enabled(id) });
S.video.on(() => { _oc(); _o2n(); });
_oc();
S.baseGuard = (e) => allowedBy(e.manifest, S.user && S.user.perms) && screenAllowed(e.manifest.screen, S.user && S.user.perms) && featureAllowed(e.id, S.user && S.user.perms) && S.packs.moduleOn(e.id)
&& !(e.manifest.company && _o46());
S.registry.setGuard((e) => S.baseGuard(e) && !S.video.moduleHidden(e.id));
_o1n();
S.registry.add({ id: 'settings', manifest: { id: 'settings', title: t('screen.settings'), icon: 'settings', screen: 'settings', order: 0, version: config.APP_VERSION, status: 'ready' }, mod: { mount: (el, ctx) => mountSettings(el, ctx, appHooks) } });
_o39();
if (S.offline) _o2u();
S.shellReady = true;
const _o17 = S.store.status().lastSync ? null : await import('./firstload.08e5136db5.js').then((m) => m.showFirstLoad({ ui, store: S.store, config,
versions: { web: config.APP_VERSION, server: (S.status && S.status.version) || '', edition: config.edition || '' }, errors: () => errors.recent() })).catch(() => null);
mountTo(document.getElementById('view'), h('div', { class: 'loading' }, ui.spinner(), h('span', null, t('common.loading'))));
await S.registry.load(ctxFor, { skip: _o2r });
try { await S.registry.ensure(ctxFor, { skip: _o2r }); } catch (e) { errors.report('warn', 'packs.ensure', String(e && e.message || e)); }
if (_o17) _o17.mark('screens');
try { installExtras({ S, appHooks, ctxFor, nav, config }); } catch (e) { errors.report('warn', 'extras.install', String(e && e.message || e), e && e.stack); }
try {
ensureCss(new URL('./feedback.9e6ba9ac37.css', import.meta.url).href, 'bds-feedback-css');
if (S.whatsNew) S.routeSubs.delete(S.whatsNew.onRoute);
if (S.feedback) S.feedback.stop();
S.whatsNew = installWhatsNew({ S, appHooks, ui, config });
S.feedback = installFeedback({ S, appHooks, ui, config, t });
} catch (e) { errors.report('warn', 'feedback.install', String(e && e.message || e), e && e.stack); }
try { if (S.selfHeal) S.selfHeal.stop(); S.selfHeal = installSelfHeal({ S, appHooks, ui, config, nav }); } catch (e) { errors.report('warn', 'selfheal.install', String(e && e.message || e), e && e.stack); }
try { if (S.license) S.license.stop(); S.license = installLicense({ S, appHooks, ui, config, nav, onChange: _o2n }); } catch (e) { errors.report('warn', 'license.install', String(e && e.message || e), e && e.stack); }
try { S.archive = installArchive({ S, appHooks, ui }); } catch (e) { errors.report('warn', 'archive.install', String(e && e.message || e), e && e.stack); }
try { if (S.cheers) S.cheers.stop(); S.cheers = installCheers({ S, appHooks, ui }); } catch (e) { errors.report('warn', 'cheers.install', String(e && e.message || e), e && e.stack); }
try { _o4e(); if (videoOffered(config) || S.video.offered()) _o4b(); } catch (e) { errors.report('warn', 'vm.install', String(e && e.message || e), e && e.stack); }
if (wizardEnabled({ config })) { try { S.wizard = (await import('./wizard/index.js')).installWizard({ S, appHooks, ui, config, nav }); } catch (e) { errors.report('warn', 'wizard.install', String(e && e.message || e), e && e.stack); } }
S.auth.startIdle();
S.store.start().then((st) => {
if (_o17) { if (st && !st.lastSync) _o17.fail(st.error ? String(st.error) : 'chưa kết nối được máy chủ – kiểm tra mạng rồi tải lại trang'); else _o17.done(); }
errors.flush();
if (S.store && S.store.status().lastSync && S.packs && !_o34()) S.packs.migrate().catch((e) => errors.report('warn', 'packs.migrate', String(e && e.message || e)));
});
try {
let setupDone = true;
try { const _o56 = S.wizard && typeof S.wizard.state === 'function' ? S.wizard.state() : null; setupDone = !_o56 || !!_o56.dismissed || !!_o56.finished; } catch { setupDone = true; }
S.pwaHint = installPwaHint({ ui, setupDone }); if (S.pwaHint) S.pwaHint.attach(document.querySelector('#app .main'));
} catch (e) { errors.report('warn', 'pwa.hint', String(e && e.message || e)); }
window.addEventListener('hashchange', route);
route();
setTimeout(() => { if (S.shellReady && S.video) S.video.checkEngine({ ui, config }).catch(() => { }); }, 1500);
_o36();
}
function _o4m() {
_o4d(); S.offline = null;
window.removeEventListener('hashchange', route);
_o4e();
S.auth.stopIdle();
if (S.store) S.store.stop();
closeSheet();
if (S.lockEl) { S.lockEl.remove(); S.lockEl = null; }
S.shellReady = false; S.mounted = null; S.current = null;
}
const _o0 = 'bds:show-connect';
function _o4k() {
try { const v = sessionStorage.getItem(_o0); if (v) sessionStorage.removeItem(_o0); return !!v; } catch { return false; }
}
async function disconnectServer() {
const _o52 = await _o4y();
const _od = (x) => ({ ...x, message: x.message.replace(/Đăng xuất bây giờ/g, 'Ngắt máy chủ bây giờ').replace(/hẵng đăng xuất/g, 'hẵng ngắt'), ok: x.ok.replace('Đăng xuất', 'Ngắt máy chủ') });
if (_o52 && !(await _oq(_o52, _od))) return false;
_o4m();
try { await S.auth.logout(); } catch { }
await _o54();
S.api.clearSession();
saveScriptUrl(null);
try { sessionStorage.setItem(_o0, '1'); } catch { }
location.replace(location.pathname + location.search);
}
async function _o4y() {
const st = S.store;
if (!st || typeof st.status !== 'function') return null;
let n = 0;
try { n = Number(st.status().pending) || 0; } catch { return null; }
const _o1w = S.license && typeof S.license.state === 'function' ? S.license.state() : null;
const readonly = !!(_o1w && _o1w.readonly);
if (n && !readonly && typeof st.syncNow === 'function') {
try { await Promise.race([st.syncNow(), new Promise((r) => setTimeout(r, 8000))]); n = Number(st.status().pending) || 0; } catch { }
}
return unsentWarning(n, { readonly });
}
function _oq(_o52, map = (x) => x) {
let _ot = map(_o52);
const _o26 = h('p', { class: 'lead' }, _ot.message);
const m = modal({ title: _ot.title, body: _o26, actions: [{ label: t('common.cancel'), kind: 'ghost', value: false }, { label: _ot.ok, kind: 'danger', value: true, id: 'confirm-ok' }] });
const _o2s = (st) => {
const n = Number(st && st.pending) || 0;
if (!n || n === _ot.count || !m.el.isConnected) return;
const _o2d = unsentWarning(n, { readonly: !!(S.license && typeof S.license.state === 'function' && (S.license.state() || {}).readonly) });
if (!_o2d) return;
_ot = map(_o2d);
_o26.textContent = _ot.message;
const _o4v = m.el.querySelector('.modal-title'); if (_o4v) _o4v.textContent = _ot.title;
m.el.setAttribute('aria-label', _ot.title);
const _o2l = m.el.querySelector('#confirm-ok > span'); if (_o2l) _o2l.textContent = _ot.ok;
};
const _o2f = S.store && typeof S.store.onStatus === 'function' ? S.store.onStatus(_o2s) : null;
return m.done.then((v) => { if (_o2f) _o2f(); return v === true; });
}
async function _ow(skipConfirm) {
const _o52 = await _o4y();
if (_o52) {
const ok = await _oq(_o52);
if (!ok) return;
} else if (!skipConfirm) { const ok = await ui.confirm(t('auth.logout.confirm'), { ok: t('auth.logout'), kind: 'danger', title: t('auth.logout') }); if (!ok) return; }
_o4m();
await S.auth.logout();
if (S.store) await S.store.clear();
S.store = null;
try { history.replaceState(null, '', location.pathname + location.search); } catch { }
showLogin();
}
const appHooks = {
config,
get status() { return S.status; },
get auth() { return S.auth; },
errors,
get registry() { return S.registry; },
applyPrefs,
setDensityDefault(v) { for (const s of SCREENS) try { localStorage.removeItem('density:' + s); } catch { } _ob(S.route ? S.route.screen : 'home', v); },
restartIdle() { S.auth.startIdle(); },
lockNow() { S.auth.lock(); },
logout: () => _ow(),
disconnectServer: () => disconnectServer(),
async swVersion() {
try {
const _om = navigator.serviceWorker && navigator.serviceWorker.controller;
if (_om) {
const v = await new Promise((res) => {
const _oo = new MessageChannel(); const _o4p = setTimeout(() => res(null), 1500);
_oo.port1.onmessage = (e) => { clearTimeout(_o4p); res(e.data && e.data.version); };
_om.postMessage({ type: 'version' }, [_oo.port2]);
});
if (v) return v;
}
const _o4w = await (await fetch('sw.js', { cache: 'no-cache' })).text();
const m = _o4w.match(/VERSION\s*=\s*['"]([^'"]+)['"]/);
return m ? m[1] + (_om ? '' : ' (chưa cài)') : null;
} catch { return null; }
},
async checkUpdate() {
try {
const _o35 = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
if (!_o35) return 'none';
await _o35.update();
return _o35.waiting ? 'ready' : 'latest';
} catch { return 'none'; }
},
async applyUpdate() {
const _o35 = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
if (_o35 && _o35.waiting) {
navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
_o35.waiting.postMessage({ type: 'skipWaiting' });
} else location.reload();
}
};
function _o36() {
if (!('serviceWorker' in navigator) || _o2y.has('nosw') || location.port === '5173') return;
navigator.serviceWorker.register('sw.js').then((_o35) => {
if (!_o35 || typeof _o35.addEventListener !== 'function') return;
_o35.addEventListener('updatefound', () => {
const _o52 = _o35.installing;
_o52 && _o52.addEventListener('statechange', () => {
if (_o52.state === 'installed' && navigator.serviceWorker.controller) toast(t('set.version.ready'), 'info', 6000);
});
});
}).catch((e) => errors.report('warn', 'sw.register', String(e && e.message || e)));
}
function _o29(s) { return hasWord('nav.' + s) ? t('nav.' + s) : t('screen.' + s); }
function _o28(_o3j) {
return _o3j.map((s) => h('a', { href: '#/' + s, class: 'nav-item', dataset: { screen: s }, 'data-testid': 'nav-' + s },
h('span', { class: 'nav-ico' }, icon(_o5[s], 23)), h('span', { class: 'nav-label' }, h('span', { class: 'nav-label-short' }, _o29(s)), h('span', { class: 'nav-label-full' }, t('screen.' + s)))));
}
const _o2r = (id) => (!!S.packs && !S.packs.moduleOn(id)) || (!!S.video && S.video.moduleHidden(id));
function _o3i(s) {
if (!S.packs || s === 'home' || s === 'settings') return true;
const _o24 = packModules(S.pack || {});
const _o3h = (id) => { const e = S.registry.get(id); return e && e.mod ? e.manifest.screen : ((_o24.find((m) => m.id === id) || {}).meta || {}).screen; };
if (S.video && S.video.screenAllHidden(_o24.map((m) => m.id).filter((id) => _o3h(id) === s))) return false;
if (!screenPermitted(_o24.map((m) => m.id).filter((id) => _o3h(id) === s), S.user && S.user.perms)) return false;
return S.packs.screenOn(s, _o24.map((m) => m.id), _o3h);
}
function _oc() {
const _o2f = !!(S.video && S.video.hidden()) || !!(S.user && S.user.perms && S.user.perms.video === false)
|| !!(S.packs && !S.packs.moduleOn('video'));
if (_o2f && !S.videoWordsOrig) { S.videoWordsOrig = Object.fromEntries(Object.keys(VIDEO_OFF_WORDS).map((k) => [k, t(k)])); addWords(VIDEO_OFF_WORDS); }
else if (!_o2f && S.videoWordsOrig) { addWords(S.videoWordsOrig); S.videoWordsOrig = null; }
}
function _o1n() {
if (S.videoEvents) return;
S.videoEvents = true;
window.addEventListener(VIDEO_EVENT, (_o13) => {
if (!S.video) return;
S.video.fromWizard(_o13 && _o13.detail).catch((e) => errors.report('warn', 'video.screens', String(e && e.message || e)));
});
}
function _o45() { return visibleScreens(S.user && S.user.perms, SCREENS).filter(_o3i); }
function _o2t() {
const box = document.querySelector('.nav .nav-items'); if (!box) return;
const _ox = new Set([...box.querySelectorAll('.nav-item.has-dot')].map((a) => a.dataset.screen));
const _o3j = _o45();
box.style.setProperty('--nav-n', String(_o3j.length));
mountTo(box, _o28(_o3j));
for (const a of box.querySelectorAll('.nav-item')) {
const on = !!S.route && a.dataset.screen === S.route.screen;
a.classList.toggle('on', on); a.classList.toggle('has-dot', _ox.has(a.dataset.screen));
if (on) a.setAttribute('aria-current', 'page');
}
}
function _o4b() {
if (S.vm || S.vmLoading) return;
const _o1d = S.vmGen = (S.vmGen || 0) + 1;
S.vmLoading = true;
import('./video_machine.791c6421be.js').then((m) => {
if (_o1d !== S.vmGen || S.vm || !S.shellReady) return;
S.vm = m.installVideoMachine({ S, ui });
}).catch((e) => errors.report('warn', 'vm.install', String(e && e.message || e), e && e.stack)).finally(() => { if (_o1d === S.vmGen) S.vmLoading = false; });
}
function _o4e() {
S.vmGen = (S.vmGen || 0) + 1; S.vmLoading = false;
if (S.vm) { try { S.vm.stop(); } catch { } S.vm = null; }
}
async function _o2n() {
if (!S.shellReady) return;
_oc();
if (!S.vm && S.video && S.video.offered()) _o4b();
try { await S.registry.ensure(ctxFor, { skip: _o2r }); } catch (e) { errors.report('warn', 'packs.ensure', String(e && e.message || e)); }
_o2t();
const r = S.route; if (!r) return;
if (!_o3i(r.screen)) { nav('home'); return; }
const _ot = r.module ? S.registry.get(r.module) : null;
const pending = _ot && S.registry.allowed(_ot) && _ot.state === 'ready' && S.mounted !== _ot;
if (pending && S.building && S.building.id === _ot.id) { try { S.building.m.close(); } catch { } S.building = null; }
if (!r.module || (_ot && !S.registry.allowed(_ot)) || pending) { S.current = null; route(); }
}
function _o39() {
const root = document.getElementById('app');
if (!root.classList.contains('app-shell')) try { window.scrollTo(0, 0); } catch { }
root.className = 'app app-shell';
const _o3j = _o45();
const _o27 = _o28(_o3j);
const syncDot = h('button', { type: 'button', class: 'sync', id: 'sync-dot', 'data-testid': 'sync-dot', 'aria-label': t('sync.ok') }, h('span', { class: 'sync-dot' }), h('span', { class: 'sync-text' }));
syncDot.addEventListener('click', async () => { const s = await S.store.syncNow(); toast(_o4i(s), s.online ? (s.pending ? 'warn' : 'ok') : 'info'); });
const densitySeg = segmented([{ value: 'compact', label: t('common.compact'), icon: 'layout' }, { value: 'detail', label: t('common.detail'), icon: 'log' }], 'compact',
(v) => { const _o3g = S.route ? S.route.screen : 'home'; setDensityFor(_o3g, v); _ob(_o3g, v); _o37(); }, { label: t('common.detail'), name: 'density' });
densitySeg.classList.add('seg-sm');
densitySeg.setAttribute('data-testid', 'density');
const backBtn = button('', () => nav(S.route ? S.route.screen : 'home'), { kind: 'ghost', icon: 'back', title: t('common.back'), cls: 'top-back', id: 'top-back' });
const helpBtn = h('button', { type: 'button', class: 'help-btn help-top', id: 'top-help', 'aria-label': t('common.help'), title: t('common.help') }, icon('help', 18));
helpBtn.addEventListener('click', _o3r);
const lockBtn = button('', () => S.auth.lock(), { kind: 'ghost', icon: 'lock', title: t('auth.lock.now'), cls: 'top-lock', id: 'top-lock' });
const _o7 = h('button', { type: 'button', class: 'nav-user', id: 'nav-user', 'aria-haspopup': 'menu', 'aria-expanded': 'false', 'aria-label': t('acct.menu') });
_o7.addEventListener('click', () => _o4r(_o7));
const _o8 = h('button', { type: 'button', class: 'top-account', id: 'top-account', 'data-testid': 'top-account', 'aria-haspopup': 'menu', 'aria-expanded': 'false', 'aria-label': t('acct.menu') });
_o8.addEventListener('click', () => _o4r(_o8));
mountTo(root,
_o3b(),
h('div', { class: 'frame' },
h('nav', { class: 'nav', 'aria-label': t('app.name') },
h('a', { class: 'nav-brand', href: '#/home' }, h('img', { src: 'assets/icon.svg', alt: '', width: 36, height: 36 }),
h('span', { class: 'nav-brand-text' }, h('strong', null, t('app.name')), h('small', null, t('app.tagline')))),
h('div', { class: 'nav-items', style: { '--nav-n': String(_o3j.length) } }, _o27),
h('div', { class: 'nav-foot' }, _o7)),
h('div', { class: 'main' },
h('header', { class: 'topbar' },
backBtn,
h('div', { class: 'top-titles' }, h('h1', { class: 'top-title', id: 'top-title' }), h('p', { class: 'top-sub', id: 'top-sub' })),
h('div', { class: 'top-actions' }, syncDot, densitySeg, helpBtn, lockBtn, _o8)),
h('div', { class: 'panes' },
h('main', { class: 'view', id: 'view', tabindex: '-1' }),
h('div', { class: 'detail', id: 'detail' })))));
if (S.pwaHint) S.pwaHint.attach(root.querySelector('.main'));
S.densitySeg = densitySeg;
S.store.onStatus(_o2w);
_o2x();
S.settings.on('profile', _o2x);
}
function _o2x() {
const el = document.getElementById('nav-user'); if (!el) return;
const p = S.settings.get('profile', {}) || {};
const _o4x = S.user;
const name = (_o4x && !_o4x.legacy && _o4x.full_name) || p.name || (_o4x && _o4x.full_name) || prefs.get('owner_name', '') || (_o4x && _o4x.username) || '';
const sub = [_o4x ? roleLabel(_o4x.role) : '', p.title].filter(Boolean).join(' · ');
el.dataset.role = _o4x ? _o4x.role : '';
el.setAttribute('data-testid', 'nav-user');
el.title = t('acct.menu');
mountTo(el, h('span', { class: 'avatar' }, (name || '•').trim().charAt(0).toUpperCase()),
h('span', { class: 'nav-user-text' }, h('strong', null, name || t('set.profile')), sub ? h('small', null, sub) : null),
h('span', { class: 'nav-user-more', 'aria-hidden': 'true' }, '⋯'));
const top = document.getElementById('top-account');
if (top) { top.dataset.role = el.dataset.role; mountTo(top, h('span', { class: 'avatar avatar-sm' }, (name || '•').trim().charAt(0).toUpperCase())); }
}
function _o4r(anchor) {
const open = document.querySelector('.acct-menu');
if (open) { open._close(); if (open._anchor === anchor) return; }
const _o4x = S.user || {};
const p = S.settings.get('profile', {}) || {};
const name = (!_o4x.legacy && _o4x.full_name) || p.name || _o4x.full_name || prefs.get('owner_name', '') || _o4x.username || '';
const _o1q = (label, ic, fn, testid, cls) => h('button', { type: 'button', role: 'menuitem', class: ['acct-item', cls], 'data-testid': testid, onclick: () => { close(); fn(); } }, icon(ic, 18), h('span', null, label));
const _o22 = h('div', { class: 'acct-menu', role: 'menu', 'aria-label': t('acct.menu'), 'data-testid': 'acct-menu' },
h('div', { class: 'acct-head' },
h('span', { class: 'avatar avatar-sm' }, (name || '•').trim().charAt(0).toUpperCase()),
h('span', { class: 'acct-who' }, h('strong', null, name || t('set.profile')), h('small', null, [_o4x.username ? '@' + _o4x.username : '', _o4x.role ? roleLabel(_o4x.role) : ''].filter(Boolean).join(' · ')))),
_o1q(t('acct.settings'), 'user', () => nav('settings/security'), 'acct-settings'),
_o1q(t('auth.lock.now'), 'lock', () => S.auth.lock(), 'acct-lock'),
_o1q(t('auth.logout'), 'logout', () => _ow(), 'acct-logout', 'acct-danger'));
document.body.appendChild(_o22);
const r = anchor.getBoundingClientRect();
const _o52 = Math.min(260, window.innerWidth - 24);
_o22.style.width = _o52 + 'px';
_o22.style.left = Math.max(12, Math.min(window.innerWidth - _o52 - 12, r.left)) + 'px';
if (r.top > window.innerHeight / 2) _o22.style.bottom = (window.innerHeight - r.top + 8) + 'px';
else _o22.style.top = (r.bottom + 8) + 'px';
anchor.setAttribute('aria-expanded', 'true');
const onDoc = (e) => { if (!_o22.contains(e.target) && !anchor.contains(e.target)) close(); };
const onKey = (e) => { if (e.key === 'Escape') { close(); anchor.focus(); } };
function close() {
_o22.remove(); anchor.setAttribute('aria-expanded', 'false');
document.removeEventListener('mousedown', onDoc, true); document.removeEventListener('touchstart', onDoc, true); document.removeEventListener('keydown', onKey, true);
window.removeEventListener('hashchange', close);
}
_o22._close = close; _o22._anchor = anchor;
document.addEventListener('mousedown', onDoc, true); document.addEventListener('touchstart', onDoc, true); document.addEventListener('keydown', onKey, true);
window.addEventListener('hashchange', close);
const _o17 = _o22.querySelector('.acct-item'); if (_o17) _o17.focus({ preventScroll: true });
}
function _o53() {
const _o4x = S.user; if (!_o4x) return null;
const p = S.settings.get('profile', {}) || {};
const name = (!_o4x.legacy && _o4x.full_name) || p.name || _o4x.full_name || _o4x.username;
return h('div', { class: 'whoami', 'data-testid': 'whoami', dataset: { role: _o4x.role } },
h('span', { class: 'avatar avatar-sm' }, (name || '•').trim().charAt(0).toUpperCase()),
h('span', { class: 'whoami-text' }, h('strong', null, name), h('small', null, '@' + _o4x.username)),
ui.badge(roleLabel(_o4x.role), ROLE_TONE[_o4x.role] || 'neutral'));
}
function _o4i(s) {
if (!s.online) return t('sync.offline');
if (s.syncing) return t('sync.syncing');
if (s.pending) return t('sync.pending', { n: s.pending });
return s.lastSync ? t('sync.ok') + ' · ' + new Date(s.lastSync).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : t('sync.never');
}
function _o2v(p) {
let box = document.getElementById('pull-progress');
if (!p || !p.total) { if (box) box.remove(); return; }
const done = Math.min(p.done, p.total), pct = Math.round(done / p.total * 100);
const label = 'Đang tải dữ liệu về máy lần đầu: ' + done.toLocaleString('vi-VN') + ' / ' + p.total.toLocaleString('vi-VN') + ' dòng';
if (!box) { box = h('div', { id: 'pull-progress', class: 'pull-progress', role: 'status', 'aria-live': 'polite', 'data-testid': 'pull-progress' }); document.body.appendChild(box); }
mountTo(box, h('span', { class: 'small' }, label), progress(pct, label));
}
function _o2w(s) {
const el = document.getElementById('sync-dot'); if (!el) return;
const tone = !s.online ? 'off' : s.pending || s.syncing ? 'pending' : 'ok';
el.dataset.state = tone;
el.setAttribute('aria-label', _o4i(s)); el.title = _o4i(s);
el.querySelector('.sync-text').textContent = !s.online ? 'Mất mạng' : s.pending ? String(s.pending) : '';
_o2v(s.pull);
if (_o2w.online === undefined) _o2w.online = true;
if (!!s.online !== _o2w.online) {
_o2w.online = !!s.online;
toast(s.online ? (s.pending ? 'Đã có mạng lại – đang gửi ' + s.pending + ' thay đổi lên máy chủ.' : 'Đã có mạng lại.') : 'Đang ngoại tuyến – vẫn xem và sửa được, thay đổi giữ trên máy và tự gửi khi có mạng.', s.online ? 'ok' : 'warn', 6000);
}
}
function _ob(screen, v) {
const _ou = v || densityFor(screen);
document.body.dataset.density = _ou;
if (S.densitySeg) S.densitySeg.setValue(_ou);
}
function _o3r() {
const r = S.route || {};
const entry = r.module ? S.registry.get(r.module) : null;
let text = '';
if (entry) {
const _o1j = entry.manifest.help;
text = _o1j && hasWord('help.' + _o1j) ? t('help.' + _o1j) : (_o1j || (hasWord('help.' + entry.id) ? t('help.' + entry.id) : ''));
}
if (!text) text = hasWord('help.screen.' + r.screen) ? t('help.screen.' + r.screen) : t('screen.' + r.screen + '.sub');
modal({
title: entry ? entry.manifest.title : t('screen.' + r.screen),
body: h('div', null, ui.paragraphs(text), helpDocLink(h, helpPageForRoute(r)), h('hr', { class: 'sep' }), ui.paragraphs(t('help.density')), ui.paragraphs(t('help.sync')),
supportBlock(h, { cfg: config, lead: 'Cần giúp? Liên hệ hỗ trợ:', testid: 'help-support' })),
actions: [{ label: t('common.close'), kind: 'primary' }]
});
}
export function parseHash(hash) {
const raw = String(hash || '').replace(/^#\/?/, '');
const [path, query] = raw.split('?');
const parts = path.split('/').filter(Boolean).map((p) => { try { return decodeURIComponent(p); } catch { return p; } });
const screen = SCREENS.includes(parts[0]) ? parts[0] : 'home';
return { screen, module: SCREENS.includes(parts[0]) ? (parts[1] || '') : '', sub: parts.slice(2).join('/'), query: new URLSearchParams(query || ''), raw };
}
function nav(path) {
const p = String(path || '').replace(/^#?\/?/, '');
const target = '#/' + p;
afterSheetBack(() => { if (location.hash === target) route(); else location.hash = target; });
}
function _o37() { if (S.route && S.route.module) { S.current = null; route(); } }
async function route() {
if (!S.shellReady) return;
const r = parseHash(location.hash);
const _o25 = r.module ? movedHash(r, S.registry.get(r.module)) : '';
if (_o25) { location.replace(_o25); return; }
if (!screenAllowed(r.screen, S.user && S.user.perms) || !_o3i(r.screen)) { nav('home'); return; }
if (!r.module && [...r.query.keys()].length) {
const _o32 = S.registry.byScreen(r.screen).find((e) => e.state === 'ready');
if (_o32) r.module = _o32.id;
}
const key = r.screen + '/' + r.module + '/' + r.sub + '?' + r.query.toString();
if (S.current === key) return;
S.current = key; S.route = r;
closeSheet();
if (S.mounted && S.mounted.mod && typeof S.mounted.mod.unmount === 'function') { try { S.mounted.mod.unmount(); } catch { } }
S.mounted = null;
for (const a of document.querySelectorAll('.nav-item')) {
const on = a.dataset.screen === r.screen;
a.classList.toggle('on', on);
if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
}
_ob(r.screen);
const root = document.getElementById('app');
root.dataset.screen = r.screen;
const _o51 = document.getElementById('view');
clear(_o51);
_o51.classList.remove('enter'); void _o51.offsetWidth; _o51.classList.add('enter');
let entry = r.module ? S.registry.get(r.module) : null;
if (entry && S.video && S.video.moduleHidden(entry.id) && S.baseGuard && S.baseGuard(entry)) {
root.classList.add('in-module');
_o3m(entry.manifest.title, t('screen.' + r.screen), t('screen.' + r.screen + '.sub'));
mountTo(_o51, S.video.hiddenCard(ui, { nav, title: entry.manifest.title }));
S.routeSubs.forEach((cb) => { try { cb(r); } catch { } });
return;
}
if (entry && !S.registry.allowed(entry)) entry = null;
root.classList.toggle('in-module', !!entry);
if (entry && entry.state === 'ready' && entry.mod) {
_o3m(entry.manifest.title, t('screen.' + r.screen), t('screen.' + r.screen + '.sub'));
const host = h('div', { class: 'module-host', dataset: { module: entry.id } });
const beta = S.packs && S.packs.moduleBeta ? S.packs.moduleBeta(entry.id) : null;
if (beta) _o51.appendChild(betaBar(ui, beta, (_o2e) => (typeof appHooks.openFeedback === 'function' ? appHooks.openFeedback(_o2e) : nav('settings/feedback'))));
_o51.appendChild(host);
S.mounted = entry;
try { await entry.mod.mount(host, ctxFor(entry)); } catch (e) {
errors.report('warn', 'mount:' + entry.id, String(e && e.message || e), e && e.stack);
mountTo(host, ui.empty(t('module.error')));
}
S.routeSubs.forEach((cb) => { try { cb(r); } catch { } });
return;
}
if (entry && entry.state !== 'ready') _o3p(entry);
_o38(_o51, r.screen);
S.routeSubs.forEach((cb) => { try { cb(r); } catch { } });
}
function _o3m(title, sub, alt) {
const _o3f = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
if (_o3f(title, sub)) sub = alt && !_o3f(title, alt) ? alt : '';
const _o4u = document.getElementById('top-title'); const _o4t = document.getElementById('top-sub');
if (_o4u) _o4u.textContent = title || ''; if (_o4t) { _o4t.textContent = sub || ''; _o4t.hidden = !sub; }
}
function _o4q() { return vnDayText(); }
function _o38(_o51, screen) {
_o3m(t('screen.' + screen), t('screen.' + screen + '.sub'));
const _o24 = S.registry.byScreen(screen);
const p = S.settings.get('profile', {}) || {};
const _o49 = S.user && S.user.role && S.user.role !== 'owner';
const name = String((_o49 ? S.user.full_name || S.user.username : p.name || prefs.get('owner_name', '')) || '').trim();
const _o1h = h('section', { class: 'hero hero-' + screen },
h('div', { class: 'hero-text' },
h('p', { class: 'hero-kicker' }, screen === 'home' ? _o4q() : _o29(screen)),
h('h2', { class: 'hero-title' }, screen === 'home' ? greeting(name) : t('screen.' + screen)),
h('p', { class: 'hero-sub' }, t('screen.' + screen + '.sub'))),
h('div', { class: 'hero-mark', 'aria-hidden': 'true' }, icon(_o5[screen], 40)));
const _o4g = screen === 'home' ? tileModules(_o24).find((e) => e.state === 'ready' && e.mod && typeof e.mod.summary === 'function') : null;
const _o44 = tileModules(_o24);
const _o1f = h('div', { class: 'tiles', 'data-testid': 'tiles-' + screen }, _o44.map((e) => _o4o(e, e === _o4g ? { title: t('home.full'), desc: t('home.full.desc') } : null)));
const parts = [_o1h];
if (_o4g) {
const host = h('div', { class: 'home-summary-host module-host', dataset: { module: _o4g.id } });
parts.push(host);
Promise.resolve().then(() => _o4g.mod.summary(host, ctxFor(_o4g))).catch((e) => errors.report('warn', 'summary:' + _o4g.id, String(e && e.message || e), e && e.stack));
}
if (_o44.length) parts.push(_o1f);
else if (screen !== 'settings') parts.push(ui.empty(t('module.none')));
if (screen === 'settings') {
const box = h('div', { class: 'settings-host' });
const who = _o53(); if (who) parts.push(who);
parts.push(box);
mountSettings(box, ctxFor(S.registry.get('settings')), appHooks).catch((e) => errors.report('warn', 'settings.mount', String(e && e.message || e), e && e.stack));
}
mountTo(_o51, ...parts);
}
function _o4o(entry, alt) {
const m = alt ? { ...entry.manifest, ...alt } : entry.manifest;
const _o2f = entry.state !== 'ready';
const _o4h = stateWords(entry.state);
const desc = m.desc || (m.help && !hasWord('help.' + m.help) ? m.help : '');
const _o4s = !_o2f && !!S.packs && S.packs.moduleTrial(entry.id);
const el = h('a', {
href: '#/' + m.screen + '/' + entry.id,
class: ['tile', _o2f && 'is-building', entry.state === 'error' && 'is-error'],
dataset: { module: entry.id, state: entry.state }, 'data-testid': 'tile-' + entry.id,
'aria-description': _o2f ? t(_o4h.badge) : null
},
h('span', { class: 'tile-ico' }, glyph(m.icon, 26)),
h('span', { class: 'tile-text' },
h('span', { class: 'tile-title' }, m.title),
_o4s ? h('span', { class: 'tile-badge tile-trial', 'data-testid': 'tile-trial-' + entry.id }, PACK_WORDS['xpack.st.trial']) : null,
_o2f ? h('span', { class: 'tile-badge' }, t(_o4h.badge)) : (desc ? h('span', { class: 'tile-desc' }, desc) : null),
_o2f && _o4h.progress ? h('span', { class: 'tile-prog' }, progress(m.progress), h('span', { class: 'tile-meta num' }, t('module.progress', { p: m.progress }) + (m.eta ? ' · ' + t('module.eta', { eta: m.eta }) : ''))) : null),
h('span', { class: 'tile-chev' }, icon('next', 18)));
if (_o2f) el.addEventListener('click', (e) => { e.preventDefault(); _o3p(entry); });
return el;
}
function _o3p(entry) {
const m = entry.manifest;
const _o4h = stateWords(entry.state);
S.building = { id: entry.id, m: modal({
title: m.title,
body: h('div', { class: 'building', 'data-testid': 'building-modal' },
h('div', { class: 'building-ico' }, glyph(m.icon, 34)),
h('p', { class: 'lead' }, t(_o4h.badge)),
h('p', { class: 'muted' }, t(_o4h.lead)),
entry.state === 'error' ? h('p', { class: 'muted num', 'data-testid': 'module-reason' }, String(entry.reason || (entry.selftest && entry.selftest.details) || '').slice(0, 200)) : null,
_o4h.progress ? progress(m.progress) : null,
_o4h.progress ? h('p', { class: 'num building-meta' }, t('module.progress', { p: m.progress }) + (m.eta ? ' · ' + t('module.eta', { eta: m.eta }) : '')) : null),
actions: [{ label: t('common.close'), kind: 'primary' }]
}) };
}
window.__bds = { S, errors, parseHash, ui };
_oj().catch((e) => {
errors.report('critical', 'boot', String(e && e.message || e), e && e.stack);
const root = document.getElementById('app');
mountTo(root, h('main', { class: 'auth' }, h('div', { class: 'auth-card' }, h('h1', { class: 'auth-title' }, t('err.generic')),
button(t('common.retry'), () => location.reload(), { kind: 'primary', block: true }))));
});

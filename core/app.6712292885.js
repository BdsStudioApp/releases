import config from '../config.js';
import { brandLogo, brandName, refreshBrand } from './brand.eff65e4449.js';
import { t, has as hasWord, setPackWords, addWords } from './i18n.17f01a0b54.js';
import ui, { h, icon, button, toast, modal, mountTo, clear, segmented, help, progress, glyph, closeSheet, afterSheetBack } from './ui.8741e19bae.js';
import { supportBlock } from './support.818cd992ae.js';
import { setHelpConfig, helpDocLink, helpPageForRoute } from './help_links.2d1b2d6d34.js';
import { createApi, saveScriptUrl, scriptUrl } from './api.e356e031da.js';
import { createAuth, strength, normUsername, validUsername, loginName, usernameFromEmail } from './auth.c3ca8814ab.js';
import { tfaStepForm, postLoginPrompts, cssOnce as tfaCss } from './tfa.741f96ece0.js';
import { createUsersApi, visibleScreens, screenAllowed, roleLabel, ROLE_TONE } from './users.897a836e5b.js';
import { featureAllowed, screenPermitted, setPackInfo as setFeaturePackInfo } from './features.281cbd68f0.js';
import { allowedBy } from './registry.dd6202705b.js';
import { createStore } from './store.e9207018a5.js';
import { createRegistry, stateWords, SCREENS, packModules, tileModules, movedHash, aliasHash, fetchWithin } from './registry.dd6202705b.js';
import { createPacks, betaBar, packStatesKey, setOwnerAllPacks, WORDS as PACK_WORDS } from './packs.a4fe44641f.js';
import { createVideoScreens, packsView, videoOffered, EVENT as VIDEO_EVENT, OFF_WORDS as VIDEO_OFF_WORDS } from './video_screens.b6afaa3e5c.js';
import { createAI } from './ai.9ec2d0ad23.js';
import { createSettings, mountSettings, applyPrefs, densityFor, setDensityFor, prefs } from './settings.5abc21d5b1.js';
import { installExtras } from './extras.f8ecfa6d1e.js';
import { installWhatsNew } from './whatsnew.a1be44bf9a.js';
import { installSelfHeal } from './selfheal.73d2a7c4a2.js';
import { rejectionMessage } from './health_logic.a1be44bf9a.js';
import { installFeedback } from './feedback.1ebc105daa.js';
import { installLicense } from './license.4eb6147238.js';
import { unsentWarning } from './license_logic.3b3437c32e.js';
import { installArchive } from './archive.58849a9946.js';
import { installCheers } from './cheers.99ed76a70f.js';
import { ensureCss, download } from './xkit.71d637c634.js';
import { installPwaHint, shouldShow as pwaHintPossible, realCustomerCount } from './pwa_hint.a28def291c.js';
import { emailCodeBox, emailGateNeeded, purposeFor } from './email_verify.4f5a65756b.js';
import { wizardEnabled, firstVisitNoServer } from './wizard/flag.js';
import { adoptSetupToken, setSetupCodeAsker } from './setup_gate.d66104e8e0.js';
import { EXEC_URL_RE, serverFromInput } from './exec_url.4b6ba956ed.js';
import { pendingFrom, pendingFromServer, savePending, readPending, clearPending, HANDOFF_KEY } from './connect_confirm.30276237a3.js';
import { greeting, vnDayText } from './greet.60b99ed569.js';
import { privacyLine } from './instance.1eceeeedc8.js';
import { deviceVerifyForm, kickedView, watchSession } from './device_slots.ecfe7d8f57.js';
import { pendingCount, pendingPackage, pendingFileName, pendingDialog, backupSource } from './pending_rescue.b985ff7cb0.js';
import { deviceKind, DESKTOP_ONLY_TEXT } from '../shared/device.js';
import { offlineEligibility, actionAllowed, blockedMessage, bannerText, parseFails, recordFail, lockedUntil, triesLeft, fmtTime, RETRY_MS, LS_FAILS, LOGIN_TIMEOUT_MS, BOOT_STATUS_MS, DIAG_TIMEOUT_MS, isNetworkKind } from './offline_mode.59a2654a2e.js';
const _o2t = () => import('./offline_ui.3e17e84ba2.js');
const openDiagnosis = (_o2p) => _o2t().then((m) => m.openDiagnosis(_o2p));
const classifyWithProbe = (e) => _o2t().then((m) => m.classifyWithProbe(e));
import { ApiError } from './api.e356e031da.js';
import { SYNC_TABLES } from './store.e9207018a5.js';
try { for (const _o23 of document.querySelectorAll('link[data-bds-font]')) _o23.media = 'all'; } catch { }
const _o39 = new URLSearchParams(location.search);
const PACK = config.PACK || 'bds';
const _o5 = './packs/' + PACK + '/';
const _o6 = { home: 'home', customers: 'customers', sales: 'sales', content: 'bulb', inbox: 'inbox', settings: 'settings' };
const S = {
api: null, auth: null, store: null, settings: null, ai: null, registry: null, pack: null,
logic: {}, data: { projects: [], defaultPolicies: {} },
route: null, current: null, routeSubs: new Set(), mounted: null, shellReady: false, lockEl: null,
packs: null,
video: null,
user: null, users: null
};
const _o2 = 'bds:errlog';
const errors = {
log: (() => { try { return JSON.parse(localStorage.getItem(_o2)) || []; } catch { return []; } })(),
queue: [], last: new Map(),
report(level, where, message, detail) {
level = level === 'critical' ? 'critical' : 'warn';
const key = level + where + message;
const now = Date.now();
if (now - (errors.last.get(key) || 0) < 10000) return;
errors.last.set(key, now);
const e = { at: now, level, where: String(where || '').slice(0, 120), message: String(message || '').slice(0, 500), detail: detail ? String(detail).slice(0, 2000) : '' };
errors.log.push(e); if (errors.log.length > 50) errors.log.splice(0, errors.log.length - 50);
try { localStorage.setItem(_o2, JSON.stringify(errors.log)); } catch { }
(window.__bdsErrors = window.__bdsErrors || []).push(e);
errors.queue.push(e);
if (level === 'critical' && S.shellReady) toast(t('err.save'), 'error', 5000);
errors.flush();
},
async flush() {
if (!S.api || !S.api.hasValidToken() || !errors.queue.length) return;
const _o1z = errors.queue.splice(0, errors.queue.length);
for (const e of _o1z) {
try { await S.api.call('errors.report', { level: e.level, where: e.where, message: e.message, detail: e.detail }); } catch { }
}
},
recent() { return errors.log.slice(); }
};
function _o1u() {
window.addEventListener('error', (_o1a) => {
if (_o1a.target && _o1a.target !== window && _o1a.target.tagName) return;
errors.report('warn', 'window.onerror', _o1a.message || 'error', _o1a.error && _o1a.error.stack);
});
window.addEventListener('unhandledrejection', (_o1a) => {
const r = _o1a.reason;
errors.report(r && r.critical ? 'critical' : 'warn', 'unhandledrejection', (r && (r.message || r.code)) || String(r), r && r.stack);
_o1a.preventDefault();
});
window.addEventListener('bds:error', (_o1a) => { const _ox = _o1a.detail || {}; errors.report(_ox.level, _ox.where, _ox.message, _ox.detail); });
}
async function _o28(src) {
try {
const r = await fetchWithin((_o5c, _o2p) => fetch(_o5c, _o2p), src, {}, 20000);
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
async function _o29() {
const [logicMod, dataMod] = await Promise.all([
window.BDSLogic ? null : _o28('./shared/logic.js'),
window.BDSData ? null : _o28('./data/projects.js')]);
S.logic = window.BDSLogic || (logicMod && (logicMod.default || logicMod)) || {};
const D = window.BDSData || window.BDSProjects || (dataMod && (dataMod.default || dataMod)) || {};
const projects = D.projects || D.PROJECTS || (Array.isArray(D) ? D : []);
const defaultPolicies = D.defaultPolicies || D.DEFAULT_POLICIES || D.policies || {};
S.data = { ...D, projects: Array.isArray(projects) ? projects : [], defaultPolicies };
}
async function _ok() {
setHelpConfig(config);
refreshBrand().catch(() => {});
applyPrefs();
_o1u();
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => applyPrefs());
const root = document.getElementById('app');
const _o3h = createRegistry({ base: _o5, report: errors.report });
_o3h.setDevice(deviceKind());
S.registry = _o3h;
document.documentElement.dataset.device = _o3h.device;
const _o31 = _o3h.loadPack().then(async (pack) => {
S.pack = pack;
try { setFeaturePackInfo(pack); } catch { }
if (pack.words) {
try { const r = await fetchWithin((_o5c, _o2p) => fetch(_o5c, _o2p), _o5 + pack.words, {}, 20000); if (r.ok) setPackWords(await r.json()); } catch { }
}
document.title = t('app.name');
}).catch((e) => errors.report('warn', 'boot.pack', String(e && e.message || e)));
const _o40 = _o29();
const lockMs = Number(_o39.get('lockms')) || 0;
if (await _o3d(root)) return;
wizardEnabled({ config });
const _o3x = _ob();
const connectUrl = _oa();
const _o1x = /^#\/moi\?/.test(location.hash || '') ? (await import('./invite_accept.aa2f1104f8.js')).takeInviteToken() : '';
if (_o3x) { const _o4l = pendingFromServer(_o3x, _o1x); if (_o4l) savePending(_o4l); }
S.api = createApi({ config });
setSetupCodeAsker(_of);
_o1i(S.api);
S.auth = createAuth({ api: S.api, lockMs, defaultLockMinutes: config.LOCK_MINUTES || 10 });
S.api.onAuthLost(async (e) => {
if (!S.shellReady) return;
if (e && e.kicked) return _o2x(e.kicked);
const _o1b = !S.api.hasValidToken();
toast(t('auth.session_lost'), 'warn'); S.api.clearSession(); _o51();
if (!_o1b && !(await _o21(S.store))) await _o5k();
showLogin();
});
watchSession({ api: S.api, active: () => S.shellReady && !S.kicking, supported: () => !!(S.status && S.status.device_slots) });
S.auth.on('lock', _o4a);
S.auth.on('user', (_o5c) => { S.user = _o5c; });
S.user = S.auth.user;
S.api.onMustChange(() => { if (S.shellReady) { _o51(); _o4b(); } });
document.documentElement.dataset.mode = S.api.mode;
await _o31;
if (_o39.get('action') === 'tfa.deny' && _o39.get('t')) { await _o40; return _o44(_o39.get('t')); }
if (_o3x && !scriptUrl(config)) { const _o4l = readPending(); if (_o4l) { await _o40; return _o42(_o4l); } }
if (_o1x) { await _o40; return (await import('./invite_accept.aa2f1104f8.js')).showInviteAccept({ ui, api: S.api, auth: S.auth, token: _o1x, root, afterLogin, showLogin }); }
if (_o4z()) { await _o40; return showConnect(); }
const _o1n = !scriptUrl(config) ? readPending() : null;
if (_o1n) { await _o40; return _o42(_o1n); }
if (connectUrl && (scriptUrl(config) ? scriptUrl(config) !== connectUrl : !wizardEnabled({ config }))) { await _o40; return showConnect(connectUrl); }
if (connectUrl && !scriptUrl(config) && S.api.mode === 'demo') { await _o40; if (await _o5l()) return; return showConnect(connectUrl); }
if (firstVisitNoServer({ api: S.api, config })) { await _o40; if (await _o5l()) return; }
let status;
try { status = await S.api.call('status', {}, { timeoutMs: BOOT_STATUS_MS }); } catch (e) {
await _o40;
if (S.api.hasValidToken()) {
S.offline = { mode: 'token', lastSync: 0 };
await _o18();
_o4o();
if (S.auth.isLocked() || S.auth.idleExpired()) { S.auth.lock(); _o4a(); }
return;
}
if (S.api.mode !== 'demo' && (S.auth.user || S.auth.localState().hasVerifier)) {
const _on = await classifyWithProbe(e);
return showLogin(_on.message, { net: _on });
}
return _o4c(root, e);
}
await _o40;
setOwnerAllPacks(() => (config.edition || 'owner') === 'owner' && !!(S.status && S.status.owner_company === true));
S.status = status || null;
if (!status || !status.setup) return (await import('./oneclick.c9ce44d759.js').then((m) => m.shouldStartWizard(status, config) && wizardEnabled({ config, search: '?wizard=1' })).catch(() => false), await _o5l()) || showSetup();
if (!S.api.hasValidToken()) { if (S.api.token) S.api.clearSession(); return showLogin(); }
try { await S.auth.me(); } catch (e) {
if (e && e.kicked) { _o2b(_o3, '1'); const r = await _o3m(e.kicked, null); S.api.clearSession(); return _o49(e.kicked, r); }
if (e && (e.code === 'AUTH_REQUIRED' || e.code === 'AUTH_INVALID')) { S.api.clearSession(); if (!(await _o21(null))) await _o5k(); return showLogin(); }
}
if (S.user && S.user.must_change_pw) return _o4b();
if (S.auth.meFresh() && emailGateNeeded(S.user)) return _o47();
if ((await _o18()) === false) return;
if (S.auth.isLocked() || S.auth.idleExpired()) { S.auth.lock(); _o4a(); } else _o3p();
}
async function _o5l() {
if (!wizardEnabled({ config })) return false;
let _o4h = false;
try { _o4h = await (await import('./wizard/index.js')).wizardBeforeSetup({ ui, api: S.api, config, showSetup, showConnect: () => showConnect('', { login: true }) }); } catch (e) { errors.report('warn', 'wizard.setup', String(e && e.message || e)); return false; }
if (_o4h) _o5i();
return _o4h;
}
function _o5i() {
if ((config.edition || 'owner') === 'owner') return;
const root = document.getElementById('app');
const _o1r = document.documentElement;
if (!root || !_o1r) return;
const _o33 = () => {
if (!root.classList.contains('app-wiz')) { _o1r.removeAttribute('data-wiz-chooser'); if (S.wizRibbonObs) { S.wizRibbonObs.disconnect(); S.wizRibbonObs = null; } return; }
let st = null; try { st = JSON.parse(localStorage.getItem('bds:wizard') || 'null'); } catch { st = null; }
if (st && st.demo) _o1r.removeAttribute('data-wiz-chooser'); else _o1r.setAttribute('data-wiz-chooser', '1');
};
_o33();
if (S.wizRibbonObs || typeof MutationObserver === 'undefined') return;
S.wizRibbonObs = new MutationObserver(_o33);
S.wizRibbonObs.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
}
const LINK_PROBLEM_KEY = 'bds:wizard:may_chu_loi';
function _of(err) {
const _o1t = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: 7, class: 'input', 'data-testid': 'setup-code-input', placeholder: '123 456' });
const m = modal({
title: 'Nhập mã cài đặt',
body: h('div', null,
h('p', { class: 'lead', 'data-testid': 'setup-code-where' }, 'Trong Sheet: BDS Studio › 🔗 Mở lại hộp kết nối → Mã cài đặt (6 số). Nhập mã đó vào ô dưới để tạo tài khoản.'),
err && err.tries_left !== undefined && err.message ? h('p', { class: 'muted' }, err.message) : null,
_o1t),
actions: [{ label: t('common.cancel'), kind: 'ghost', value: null, icon: 'close' }, { label: 'Tiếp tục', kind: 'primary', value: 'ok', id: 'setup-code-ok', icon: 'check' }]
});
setTimeout(() => { try { _o1t.focus(); } catch { } }, 50);
return m.done.then((v) => (v === 'ok' ? String(_o1t.value || '').replace(/\D/g, '') || null : null));
}
function _oa() {
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
async function _o3d(root) {
const P = config.PORTAL;
if (!(P === true || (P && typeof P === 'object' && P.host && location.hostname === P.host))) return false;
try {
const portal = await import('./portal.e2b6a918c3.js');
if (location.hash === portal.CLEAR_ROUTE) { await portal.renderClearPage(root); return true; }
window.addEventListener('hashchange', () => { if (location.hash === portal.CLEAR_ROUTE) location.reload(); });
await portal.portalGuard({ config });
document.documentElement.dataset.portal = '1';
} catch (e) { errors.report('warn', 'portal.boot', String(e && e.message || e)); }
return false;
}
function _ob() {
const v = String(_o39.get('server') || '').trim();
if (!_o39.has('server')) return '';
_o39.delete('server');
try { const q = _o39.toString(); history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash); } catch { }
return EXEC_URL_RE.test(v) && !scriptUrl(config) ? v : '';
}
async function afterLogin(password, extra) {
_o2b(_o3, null);
try { await S.auth.me(); } catch { }
if (S.user && S.user.must_change_pw) return _o4b(password);
if (S.auth.meFresh() && emailGateNeeded(S.user)) return _o47(extra);
if ((await _o18(extra)) === false) return;
_o3p();
}
function _o3p() {
let quietTfa = false;
try { quietTfa = !!(S.wizard && typeof S.wizard.beforeStep === 'function' && (S.wizard.beforeStep('tfa') || (typeof S.wizard.quietTfa === 'function' && S.wizard.quietTfa()))); } catch { quietTfa = false; }
postLoginPrompts({ ui, auth: S.auth, nav, quietTfa }).catch((e) => errors.report('warn', 'tfa.post', String(e && e.message || e)));
}
function _o3n() {
if (S.api.mode !== 'demo') return null;
const _o3q = (config.edition || 'owner') !== 'owner';
return h('div', { class: ['ribbon', _o3q && 'ribbon-notreal'], role: 'note', 'data-testid': 'demo-ribbon' },
h('span', { class: 'ribbon-dot' }), h(_o3q ? 'strong' : 'span', null, t(_o3q ? 'demo.ribbon.sale' : 'demo.ribbon')),
S.shellReady ? h('a', { href: '#/settings', class: 'ribbon-link' }, t('demo.connect')) : null);
}
function _oh(title, lead, ...content) {
const root = document.getElementById('app');
root.className = 'app app-auth';
S.shellReady = false;
const _o3f = S.quietRibbon; S.quietRibbon = false;
mountTo(root, _o3f ? null : _o3n(),
h('main', { class: 'auth' },
h('div', { class: 'auth-card' },
h('div', { class: 'brand' }, h('img', { src: brandLogo(), alt: '', class: 'brand-mark', width: 56, height: 56, 'data-brand-logo': '' }),
h('div', null, h('div', { class: 'brand-name', 'data-brand-name': '', 'data-brand-default': t('app.name') }, brandName(t('app.name'))), h('div', { class: 'brand-tag' }, t('app.tagline')))),
h('h1', { class: 'auth-title' }, title),
lead ? h('p', { class: 'auth-lead' }, lead) : null,
...content)));
const _o1e = root.querySelector('input'); if (_o1e) _o1e.focus({ preventScroll: true });
}
function _o1g() { return h('p', { class: 'form-err', role: 'alert', 'aria-live': 'assertive' }); }
function _o19(e) {
if (!e) return t('err.generic');
if (e.code === 'LOCKED') return t('auth.err.locked', { time: e.retry_at ? new Date(Number(e.retry_at)).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '15 phút' });
if (e.code === 'AUTH_INVALID') return e.userMessage || t('auth.err.wrong');
return e.userMessage || e.message || t('err.generic');
}
function _o4u(input) {
const _oj = [0, 1, 2, 3].map(() => h('span', { class: 'sbar' }));
const label = h('span', { class: 'slabel' }, '');
const el = h('div', { class: 'strength', 'data-score': '0', 'aria-live': 'polite' }, h('div', { class: 'sbars' }, _oj), label);
const _o5e = () => {
const v = input.value; const s = v ? strength(v) : 0;
el.dataset.score = v ? String(s) : '';
label.textContent = v ? t('auth.strength.' + s) : '';
};
input.addEventListener('input', _o5e);
return el;
}
function _om(_o1f, fn) {
return async (_o1a) => {
_o1a.preventDefault();
if (_o1f.dataset.busy) return;
_o1f.dataset.busy = '1';
const _ol = _o1f.querySelector('button[type=submit]');
const err = _o1f.querySelector('.form-err'); if (err) err.textContent = '';
if (_ol) { _ol.classList.add('is-busy'); _ol.disabled = true; }
try { await fn(); } catch (e) { if (err) err.textContent = _o19(e); } finally {
delete _o1f.dataset.busy; if (_ol) { _ol.classList.remove('is-busy'); _ol.disabled = false; }
}
};
}
const _o7 = 'bds:setup_email';
function _o3z() {
try {
const v = JSON.parse(sessionStorage.getItem(_o7) || 'null');
if (!v || !v.email) return null;
if (v.via === 'ticket' && v.use_account_email) return { email: String(v.email), use_account_email: true, via: 'ticket' };
if (Date.now() - Number(v.at || 0) > 14 * 60000) return { email: String(v.email) };
return { email: String(v.email), code: String(v.code || ''), use_account_email: !!v.use_account_email };
} catch { return null; }
}
function _or() { try { sessionStorage.removeItem(_o7); } catch { } }
function showSetup() {
if (!S.status && S.api) return S.api.call('status').then((st) => { S.status = st || null; }, () => {}).then(() => _o4f());
return _o4f();
}
function _o4f() {
const _o2l = !!(S.status && S.status.email_verify);
const demo = S.api.mode === 'demo';
const pre = _o2l ? _o3z() : null;
const quick = !!(pre && pre.via === 'ticket' && pre.use_account_email);
const name = ui.field({ label: t('auth.setup.name'), name: 'owner', autocomplete: 'name', ...(quick ? { hint: 'Bỏ trống được – sửa sau ở Cài đặt › Thông tin cá nhân.' } : {}) });
const un = _o5f((quick && usernameFromEmail(pre.email)) || 'admin');
const phone = ui.field({ label: 'Số điện thoại của anh/chị', type: 'tel', name: 'phone', id: 'setup-phone', autocomplete: 'tel', inputmode: 'tel', placeholder: 'VD: 0912 345 678',
hint: 'In trên tin nhắn Zalo, trang landing và ảnh báo giá gửi khách. Bỏ trống được – thêm sau ở Cài đặt › Thông tin cá nhân.' });
phone.input.setAttribute('data-testid', 'setup-phone');
const p1 = ui.field({ label: t('auth.password'), type: 'password', name: 'password', autocomplete: 'new-password', id: 'pw1' });
const p2 = ui.field({ label: t('auth.password2'), type: 'password', name: 'password2', autocomplete: 'new-password', id: 'pw2' });
const err = _o1g();
let _o1a = pre && (pre.code || pre.use_account_email) ? pre : null;
const evBox = _o2l ? emailCodeBox({
ui, api: S.api, testid: 'setup-ev', email: (pre && pre.email) || (demo ? 'demo@dungthu.local' : ''),
label: 'Email của anh/chị (bắt buộc)', hint: 'Bấm "Gửi mã", mở email lấy mã 6 số. Email đã xác nhận dùng để nhận mã khi quên mật khẩu.',
send: (em) => S.auth.emailStart(em, 'setup'), verify: (em, _on) => S.auth.emailCheck(em, _on), allowAccountEmail: true,
onVerified: (v) => { _o1a = v.use_account_email ? { use_account_email: true, email: v.email } : { email: v.email, code: v.code }; }
}) : null;
const evDone = _o2l ? h('p', { class: 'ev-ok', 'data-testid': 'setup-ev-done', hidden: !_o1a }, _o1a ? (quick ? '✅ Email: ' + _o1a.email + ' – tài khoản Google vừa cài máy chủ (Google đã xác minh).' : '✅ Email đã xác nhận: ' + _o1a.email) : '') : null;
if (evDone && quick) evDone.append(' ', h('button', { type: 'button', class: 'link-btn', 'data-testid': 'setup-ev-other', onclick: () => { _o1a = null; _or(); evDone.hidden = true; evBox.hidden = false; } }, icon('mail', 16), ' Dùng email khác'));
if (evBox && _o1a) evBox.hidden = true;
const phoneBox = quick ? h('details', { class: 'setup-more', 'data-testid': 'setup-more' }, h('summary', { class: 'small' }, '📞 Thêm số điện thoại (tuỳ chọn)'), phone) : phone;
const _o1f = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'setup-form', dataset: { quick: quick ? '1' : '' } }, ...(quick ? [un, p1, _o4u(p1.input), p2, evDone, name, phoneBox, evBox] : [name, phone, un, p1, _o4u(p1.input), p2, evBox, evDone]), err,
privacyLine(h, { testid: 'setup-privacy', lead: 'Tạo tài khoản là anh/chị đã đọc ', cfg: config }),
button(t('auth.setup.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'setup-submit', icon: 'lock' }),
_ov());
_o1f.addEventListener('submit', _om(_o1f, async () => {
const a = p1.getValue(), b = p2.getValue();
const username = normUsername(un.getValue()) || 'admin';
if (!validUsername(username)) throw new Error(t('auth.err.username'));
if (a.length < 8) throw new Error(t('auth.err.short'));
if (a !== b) throw new Error(t('auth.err.mismatch'));
const _o3b = String(phone.getValue() || '').trim();
if (_o3b && !validMyPhone(_o3b)) { if (phoneBox !== phone) phoneBox.open = true; phone.input.focus(); throw new Error('Số điện thoại chưa đúng (10 số, bắt đầu bằng 0) – sửa lại hoặc để trống.'); }
let _o17 = null;
if (_o2l) {
if (!_o1a && demo) await evBox.autoDemo('demo@dungthu.local');
if (!_o1a) { evBox.focus(); throw new Error('Cần xác nhận email: bấm "Gửi mã", rồi nhập mã 6 số trong email.'); }
_o17 = _o1a.use_account_email ? { use_account_email: true } : { email: _o1a.email, email_code: _o1a.code };
}
let _o4m;
try { _o4m = await S.auth.setup(a, String(name.getValue() || '').trim(), username, _o17); } catch (e) {
if (_o2l && /Mã xác nhận|Thiếu email|email tài khoản Google/i.test(String((e && (e.userMessage || e.message)) || ''))) { _o1a = null; _or(); if (evDone) evDone.hidden = true; evBox.hidden = false; }
throw e;
}
_or();
if (_o4m && (_o4m.tfa_required || _o4m.device_verify_required)) return _o4g(_o4m, a);
if (name.getValue()) { prefs.set('owner_name', String(name.getValue()).trim()); }
if (S.api.mode === 'demo') { try { await S.api.seedDemo(); } catch (e) { errors.report('warn', 'seedDemo', String(e && e.message || e)); } }
await afterLogin(a, { ownerName: String(name.getValue() || '').trim(), ownerPhone: _o3b });
}));
_oh(t('auth.setup.title'), quick ? 'Máy chủ đã sẵn sàng trong Google của anh/chị. Đặt mật khẩu (từ 8 ký tự) là vào app.' : t('auth.setup.lead'), _o1f);
if (quick) { try { p1.input.focus({ preventScroll: true }); } catch { } }
}
export function validMyPhone(p) { let _ox = String(p || '').replace(/\D/g, ''); if (_ox.startsWith('84') && _ox.length >= 11) _ox = '0' + _ox.slice(2); return /^0[35789]\d{8}$/.test(_ox) || /^02\d{9}$/.test(_ox); }
function _o5f(value) {
const _o1c = ui.field({ label: t('auth.username'), name: 'username', id: 'username', autocomplete: 'username', value: value || '' });
_o1c.input.setAttribute('autocapitalize', 'none'); _o1c.input.setAttribute('spellcheck', 'false'); _o1c.input.setAttribute('autocorrect', 'off');
_o1c.input.addEventListener('input', () => { const v = _o1c.input.value.toLowerCase().replace(/\s+/g, ''); if (v !== _o1c.input.value) _o1c.input.value = v; });
return _o1c;
}
function showLogin(_o2h, { net } = {}) {
const un = _o5f(S.auth.lastUsername());
const p = ui.field({ label: t('auth.password'), type: 'password', name: 'password', autocomplete: 'current-password', id: 'pw' });
const err = _o1g(); if (_o2h) err.textContent = _o2h;
const _o2n = S.status && S.status.notice && S.status.notice.kind === 'migrated' ? S.status.notice : null;
if (_o2n) tfaCss();
const notice = _o2n ? h('div', { class: 'auth-notice', role: 'note', 'data-testid': 'login-notice' },
h('span', null, 'Vừa nâng cấp máy chủ? Chủ app đăng nhập bằng tên ', h('strong', null, _o2n.username), ' (lấy theo tên trong Hồ sơ), mật khẩu giữ nguyên như cũ.'),
un.getValue() === _o2n.username ? null : button('Dùng tên ' + _o2n.username, () => { un.setValue(_o2n.username); p.input.focus(); }, { kind: 'ghost', small: true, id: 'use-notice-name' })) : null;
const prog = h('p', { class: 'login-progress', 'data-testid': 'login-progress', 'aria-live': 'polite' });
const helpBox = h('div', { class: 'login-help', 'data-testid': 'login-help', hidden: true });
const _o1f = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'login-form' }, notice, un, p, err, prog,
button(t('auth.login.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'login-submit', icon: 'user' }),
helpBox,
h('button', { type: 'button', class: 'link-btn', id: 'forgot', onclick: _o4e }, icon('key', 16), ' ', t('auth.forgot')),
_ov());
const _o48 = async (_on) => {
mountTo(helpBox, h('div', { class: 'login-help-acts' },
button(t('net.retry'), () => { if (!_o1f.dataset.busy) _o1f.requestSubmit(); }, { kind: 'secondary', icon: 'refresh', testid: 'login-retry' }),
button(t('net.diag'), () => { openDiagnosis({ ui, api: S.api, config }); }, { kind: 'secondary', icon: 'pulse', testid: 'login-diag' })));
helpBox.dataset.kind = _on.kind;
helpBox.hidden = false;
const el = await _o2u();
if (!helpBox.isConnected || helpBox.hidden) return;
if (el.ok) helpBox.appendChild(button(t('off.open'), () => _o4d(el), { kind: 'primary', block: true, icon: 'lock', testid: 'login-offline' }));
else if (el.reason && !['demo', 'never'].includes(el.reason)) helpBox.appendChild(h('p', { class: 'muted small', 'data-testid': 'login-offline-why' }, el.message));
};
_o1f.addEventListener('submit', _om(_o1f, async () => {
const username = loginName(un.getValue());
if (!validUsername(username)) { un.input.focus(); throw new Error(t('auth.err.username')); }
if (!p.getValue()) throw new Error(t('auth.err.short'));
helpBox.hidden = true;
const _o4y = Date.now(); let _o4r = 1;
const _o33 = () => { prog.textContent = t('net.step.login' + _o4r) + ' ' + t('net.step.secs', { s: Math.floor((Date.now() - _o4y) / 1000) }); prog.dataset.step = String(_o4r); };
const stop = () => { clearInterval(_o52); prog.textContent = ''; delete prog.dataset.step; };
_o33();
const _o52 = setInterval(_o33, 1000);
let r;
try {
r = await S.auth.login(username, p.getValue(), { onStep: (n) => { _o4r = n; _o33(); }, timeoutMs: LOGIN_TIMEOUT_MS });
} catch (e) {
stop();
const _on = await classifyWithProbe(e);
if (isNetworkKind(_on.kind)) { _o48(_on); throw Object.assign(new Error(_on.message), { userMessage: _on.message }); }
throw e;
}
stop();
if (r && (r.tfa_required || r.device_verify_required)) return _o4g(r, p.getValue());
await afterLogin(p.getValue());
}));
_oh(t('auth.login.title'), t('auth.login.lead2'), _o1f);
if (net && isNetworkKind(net.kind)) _o48(net);
if (un.getValue()) p.input.focus({ preventScroll: true });
}
const _o2a = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
const _o2b = (k, v) => { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch { } };
const _o3 = 'bds:offline_kicked';
async function _o2u() {
try {
const st = createStore({ api: S.api });
await st.open();
let _o3o = 0;
for (const _o50 of SYNC_TABLES) _o3o += (await st.list(_o50)).length;
const lastSync = st.status().lastSync;
const r = offlineEligibility({ mode: S.api.mode, ...S.auth.localState(), user: S.auth.user, storeUserId: st.userId, rowCount: _o3o, lastSync,
now: Date.now(), lockUntil: lockedUntil(parseFails(_o2a(LS_FAILS))), kicked: _o2a(_o3) === '1' });
return { ...r, lastSync };
} catch (e) { errors.report('warn', 'offline.check', String(e && e.message || e)); return { ok: false, reason: 'nodata', message: t('off.why.nodata') }; }
}
function _o4d(el) {
const _o5c = S.auth.user;
const p = ui.field({ label: t('auth.password'), type: 'password', autocomplete: 'current-password', id: 'off-pw' });
const err = _o1g();
const who = _o5c ? h('p', { class: 'auth-who' }, h('strong', null, _o5c.full_name || _o5c.username), ' · @' + _o5c.username) : null;
const when = h('p', { class: 'muted small', 'data-testid': 'off-when' }, 'Dữ liệu cập nhật lúc ' + fmtTime(el.lastSync) + ' · mở được tới ' + fmtTime(el.expiresAt) + '.');
const _o1f = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'offline-form' }, who, when, p, err,
button(t('off.open.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'off-submit', icon: 'lock' }),
h('button', { type: 'button', class: 'link-btn', id: 'off-back', onclick: () => showLogin() }, t('common.back')));
_o1f.addEventListener('submit', _om(_o1f, async () => {
let _o1d = parseFails(_o2a(LS_FAILS));
const lock = lockedUntil(_o1d);
if (lock) throw new Error(t('off.locked', { time: fmtTime(lock) }));
const _o1h = await _o2u();
if (!_o1h.ok) throw new Error(_o1h.message);
if (!(await S.auth.verifyLocal(p.getValue()))) {
_o1d = recordFail(_o1d); _o2b(LS_FAILS, JSON.stringify(_o1d));
const _o24 = lockedUntil(_o1d);
p.input.value = '';
throw new Error(_o24 ? t('off.locked', { time: fmtTime(_o24) }) : t('off.wrong', { n: triesLeft(_o1d) }));
}
_o2b(LS_FAILS, null);
S.offline = { mode: 'readonly', lastSync: _o1h.lastSync, expiresAt: _o1h.expiresAt };
S.user = S.auth.user;
await _o18();
if (S.offline) _o4o();
}));
_oh(t('off.open'), t('off.open.lead'), _o1f);
p.input.focus({ preventScroll: true });
}
function _o1i(api) {
const _o2z = api.call.bind(api);
api.call = (action, payload, opts) => {
if (S.offline && !actionAllowed(action, S.offline.mode)) return Promise.reject(new ApiError('OFFLINE', blockedMessage(S.offline.mode), { offline: S.offline.mode, action }));
return _o2z(action, payload, opts);
};
}
let _o2s = 0, lastGesture = 0;
for (const _o1a of ['pointerdown', 'keydown']) window.addEventListener(_o1a, () => { lastGesture = Date.now(); }, { capture: true, passive: true });
function _o2v() {
const _o2h = blockedMessage('readonly');
if (Date.now() - lastGesture < 3000 && Date.now() - _o2s > 4000) { _o2s = Date.now(); toast(_o2h, 'warn', 6000); }
return Object.assign(new Error(_o2h), { code: 'OFFLINE', userMessage: _o2h });
}
const _o3g = () => !!(S.offline && S.offline.mode === 'readonly');
function _o1j() {
const st = S.store;
if (st && !st.__offGate) {
const put = st.put.bind(st);
st.put = async (table, row) => { if (_o3g()) throw _o2v(); return put(table, row); };
st.__offGate = true;
}
const ai = S.ai;
if (ai && !ai.__offGate && typeof ai.run === 'function') {
const run = ai.run.bind(ai);
ai.run = async (...a) => { if (_o3g()) throw _o2v(); return run(...a); };
ai.__offGate = true;
}
}
const _o4 = Number(_o39.get('offretryms')) || RETRY_MS;
let _o2r = 0;
async function _o35(state) {
const _o3w = ++_o2r;
const { offlineBannerEl } = await _o2t();
if (_o3w !== _o2r) return;
document.querySelectorAll('[data-testid="offline-banner"]').forEach((x) => x.remove());
const _o2c = document.querySelector('.app-shell .main');
if (!_o2c || (!S.offline && !state)) return;
const _o2p = S.offline || {};
const last = _o2p.lastSync || (S.store && S.store.status().lastSync) || 0;
let el;
if (state === 'back-login') el = offlineBannerEl(ui, { text: t('off.banner.back'), tone: 'ok', action: () => _o25(), actionLabel: t('off.banner.login') });
else if (state === 'back') el = offlineBannerEl(ui, { text: t('off.banner.back'), tone: 'ok' });
else el = offlineBannerEl(ui, { text: bannerText({ mode: _o2p.mode, lastSync: last }), tone: _o2p.mode === 'readonly' ? 'bad' : 'warn' });
_o2c.insertBefore(el, _o2c.firstChild);
}
function _o4s() {
const _o5g = S.offWatch; S.offWatch = null;
if (!_o5g) return;
clearInterval(_o5g.retry); clearInterval(_o5g.guard); if (_o5g.unsub) _o5g.unsub();
}
function _o4o() {
_o4s();
if (!S.offline) return;
const _o5g = S.offWatch = { busy: false };
const back = (data) => {
if (!S.offline) return;
if (S.offline.mode === 'readonly') { S.offline.reconnected = true; if (data) S.status = data; clearInterval(_o5g.retry); _o35('back-login'); return; }
S.offline = null; _o4s(); _o35('back');
setTimeout(() => { if (!S.offline) _o35(); }, 6000);
if (S.store) S.store.syncNow();
};
if (S.offline.mode === 'token' && S.store) {
const _o1e = S.store.status().lastSync;
S.offline.lastSync = _o1e;
_o5g.unsub = S.store.onStatus((st) => { if (S.offline && st.online && st.lastSync > _o1e) back(); });
}
if (!S.offline) return;
_o35();
_o5g.retry = setInterval(async () => {
if (_o5g.busy || !S.offline || S.offline.reconnected) return;
_o5g.busy = true;
try {
const r = await S.api.request({ action: 'status', token: '', device_id: S.api.deviceId, payload: {} }, { timeoutMs: DIAG_TIMEOUT_MS });
if (r && r.ok) back(r.data);
} catch { } finally { _o5g.busy = false; }
}, _o4);
if (S.offline.mode === 'readonly') {
_o5g.guard = setInterval(() => {
if (!_o3g()) return;
if (Date.now() > S.offline.expiresAt) _o25(t('off.why.expired'));
else if (S.auth.idleExpired()) _o25();
}, 15000);
}
}
function _o25(_o2h) {
_o4s();
_o51();
S.offline = null;
showLogin(_o2h);
}
async function _o44(tok) {
const box = h('div', { class: 'auth-form', 'data-testid': 'deny-result' }, ui.spinner());
_oh('Khoá thiết bị lạ', '', box);
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
function _o4g(challenge, password) {
if (challenge && challenge.device_verify_required) return _o46(challenge, password);
const _o1f = tfaStepForm(challenge, {
ui, auth: S.auth, demo: S.api.mode === 'demo',
onDone: (data) => (data && data.device_verify_required ? _o46(data, password) : afterLogin(password)),
onCancel: () => { S.auth.cancelTfa(); showLogin(); }
});
_oh('Xác thực 2 lớp', 'Máy này chưa quen nên cần thêm một bước. Máy đã xác nhận sẽ không bị hỏi lại trong 30 ngày.', _o1f);
const _on = _o1f.querySelector('#tfa-code'); if (_on) _on.focus({ preventScroll: true });
}
function _o46(challenge, password) {
const _o1f = deviceVerifyForm(challenge, {
ui, auth: S.auth, api: S.api, demo: S.api.mode === 'demo',
onDone: () => afterLogin(password),
onCancel: () => { S.auth.cancelTfa(); showLogin(); }
});
_oh('Xác nhận đổi máy', null, _o1f);
const _on = _o1f.querySelector('#dv-code'); if (_on) _on.focus({ preventScroll: true });
}
async function _o3m(k, st) {
let n = 0, tried = false, wiped = false;
try {
if (!st) { st = createStore({ api: S.api }); await st.open(); }
n = Number(st.status().pending) || 0;
for (let _o1s = 0; _o1s < 2 && n && k.why !== 'remote' && Number(k.grace_until) > Date.now(); _o1s++) {
tried = true;
try { await Promise.race([st.syncNow(), new Promise((r) => setTimeout(r, 8000))]); } catch { }
n = Number(st.status().pending) || 0;
}
} catch (e) { errors.report('warn', 'device.rescue', String(e && e.message || e)); }
if (k.why === 'remote') { await _o5k(); wiped = true; }
return { pending: n, tried, wiped, st: wiped ? null : st };
}
async function _o2x(k) {
if (S.kicking) return;
S.kicking = true;
_o2b(_o3, '1');
try {
const r = await _o3m(k, S.store);
S.api.clearSession(); _o51();
_o49(k, r);
} finally { S.kicking = false; }
}
function _o49(k, r = {}) {
const _o12 = r.st && Number(r.pending) > 0 && !r.wiped ? () => _o15(r.st) : null;
_oh('Máy này đã đăng xuất', null, kickedView({ ui, kicked: k, pending: r.pending, tried: r.tried, wiped: r.wiped, onRelogin: () => showLogin(), onDownload: _o12 }));
}
function _o47(extra) {
const _o5c = S.user || {}, g = _o5c.email_gate || {};
const _o30 = _o5c.role === 'owner';
const done = async (_o2h) => { toast(_o2h, 'ok', 4000); if ((await _o18(extra)) === false) return; _o3p(); };
const defer = _o30 ? async () => { await S.auth.emailDefer(); await done('Đã để sau 24 giờ. Hết 24 giờ app hỏi lại email.'); } : null;
const box = emailCodeBox({
ui, api: S.api, testid: 'gate-ev', email: g.email || _o5c.email || '', label: 'Email của anh/chị',
hint: 'Gõ đúng email anh/chị đang dùng (sửa được nếu Quản trị gõ nhầm). Email đã xác nhận dùng để nhận mã khi quên mật khẩu.',
send: (em) => S.auth.emailStart(em, purposeFor(em, _o5c.email || g.email || '')),
verify: (em, _on) => S.auth.verifyEmail(_on),
allowAccountEmail: _o30, useAccountEmail: () => S.auth.verifyEmail('', true), onDefer: defer,
onVerified: () => done('Đã xác nhận email. Cảm ơn anh/chị!')
});
const who = h('p', { class: 'auth-who' }, h('strong', null, _o5c.full_name || _o5c.username || ''), _o5c.username ? ' · @' + _o5c.username : '');
const later = _o30 && g.can_defer ? h('div', { class: 'auth-notice', role: 'note', 'data-testid': 'gate-defer-box' },
h('span', null, 'Máy chủ vừa không gửi được email. Anh/chị có thể để sau 24 giờ rồi làm tiếp.'),
button('Để sau (24 giờ)', defer, { kind: 'ghost', small: true, testid: 'gate-defer' })) : null;
const _o1f = h('div', { class: 'auth-form', 'data-testid': 'email-gate' }, who, box, later,
h('button', { type: 'button', class: 'link-btn', id: 'gate-logout', onclick: async () => { await S.auth.logout(); showLogin(); } }, icon('logout', 16), ' ', t('auth.logout')));
_oh('Bổ sung email (bắt buộc)', 'Mỗi tài khoản cần một email đã xác nhận để nhận mã khi quên mật khẩu. Anh/chị bấm "Gửi mã", mở email rồi nhập mã 6 số. Làm 1 lần, khoảng 1 phút.', _o1f);
box.focus();
}
function _o4b(tempPw) {
const old = tempPw ? null : ui.field({ label: t('auth.must.old'), type: 'password', autocomplete: 'current-password', id: 'must-old' });
const p1 = ui.field({ label: t('auth.reset.new'), type: 'password', autocomplete: 'new-password', id: 'must-pw1' });
const p2 = ui.field({ label: t('auth.password2'), type: 'password', autocomplete: 'new-password', id: 'must-pw2' });
const err = _o1g();
const who = S.user ? h('p', { class: 'auth-who' }, h('strong', null, S.user.full_name || S.user.username), ' · @' + S.user.username) : null;
const _o1f = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'mustchange-form' }, who, old, p1, _o4u(p1.input), p2, err,
button(t('auth.must.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'must-submit', icon: 'check' }),
h('button', { type: 'button', class: 'link-btn', 'data-testid': 'must-logout', onclick: async () => { await S.auth.logout(); showLogin(); } }, icon('logout', 16), ' ', t('auth.logout')));
_o1f.addEventListener('submit', _om(_o1f, async () => {
const a = p1.getValue(), b = p2.getValue();
const _o2p = tempPw || (old && old.getValue()) || '';
if (a.length < 8) throw new Error(t('auth.err.short'));
if (a !== b) throw new Error(t('auth.err.mismatch'));
if (a === _o2p) throw new Error('Mật khẩu mới phải khác mật khẩu tạm.');
await S.auth.changePassword(_o2p, a);
toast(t('auth.must.done'), 'ok');
try { await S.auth.me(); } catch { }
if (S.user) S.user.must_change_pw = 0;
if (S.auth.meFresh() && emailGateNeeded(S.user)) return _o47();
await _o18();
}));
_oh(t('auth.must.title'), t('auth.must.lead'), _o1f);
}
function _ov() {
return h('button', { type: 'button', class: 'link-btn', id: 'connect-server', 'data-testid': 'connect-server', onclick: showConnect }, icon('link', 16), ' ',
S.api && S.api.mode === 'demo' ? t('auth.connect.demo') : t('auth.connect.change'));
}
async function _o42(p) {
const _oo = await import('./connect_confirm.30276237a3.js');
S.quietRibbon = true;
_oh('Kết nối máy chủ của anh/chị', 'Đang kiểm máy chủ trong link…', h('p', { class: 'muted', 'data-testid': 'connect-confirm-wait' }, ui.spinner ? ui.spinner() : null, ' Đang hỏi máy chủ…'));
const probe = await _oo.probeServer(p.url);
const _o5o = () => {
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
const _o2m = () => { clearPending(); showConnect(); };
const _o1w = p.kind === 'invite' || p.kind === 'server';
S.quietRibbon = true;
_oh('Kết nối máy chủ của anh/chị', _o1w
? 'Link mời mở app và nối tới máy chủ dưới đây. Kiểm tên công ty / app trước khi nối – sau khi nối, anh/chị đặt mật khẩu và đăng nhập trên máy chủ này.'
: 'Link mở app chỉ tới máy chủ dưới đây. Kiểm tên và địa chỉ trước khi nối – sau khi nối, app đăng nhập vào máy chủ này.',
_oo.confirmView({ h, button }, { url: p.url, probe, onYes: _o5o, onNo: _o2m, kind: p.kind || '' }));
}
function showConnect(prefill, { login = false } = {}) {
const url = ui.field({ label: login ? 'Địa chỉ máy chủ hoặc link mở app' : t('auth.connect.url'), name: 'script_url', id: 'connect-url', inputmode: 'url', autocomplete: 'off', help: t('auth.connect.help'), value: typeof prefill === 'string' ? prefill : '' });
const err = _o1g();
const _o1f = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'connect-form' }, url, err,
button(t('auth.connect.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'connect-submit', icon: 'link' }),
h('button', { type: 'button', class: 'link-btn', 'data-testid': 'connect-back', onclick: () => location.reload() }, icon('back', 16), ' ', t('common.back')));
_o1f.addEventListener('submit', _om(_o1f, async () => {
let v = String(url.getValue() || '').trim();
const _o1l = serverFromInput(v);
if (_o1l) v = _o1l.url;
if (!/^https:\/\/script\.google(usercontent)?\.com\/.+/.test(v)) throw new Error(t('auth.connect.bad'));
saveScriptUrl(v);
try { await createApi({ config }).call('status'); } catch (e) { saveScriptUrl(null); throw new Error(e && e.code === 'NOT_PUBLIC' ? e.userMessage : t('auth.connect.fail')); }
if (S.api && S.api.mode === 'demo') {
const ok = await import('./wizard/demodata.js').then((m) => m.confirmLeaveDemo({ ui, api: S.api })).catch(() => true);
if (!ok) { saveScriptUrl(null); return; }
}
if (_o1l && _o1l.ma) { try { history.replaceState(null, '', location.pathname + location.search + '#/moi?ma=' + encodeURIComponent(_o1l.ma)); } catch { } }
location.reload();
}));
S.quietRibbon = login;
_oh(login ? 'Đăng nhập trên máy này' : t('auth.connect.title'), login
? 'Đã cài BDS Studio trên máy khác? Dán địa chỉ máy chủ (kết thúc bằng /exec – trong Sheet máy chủ: menu BDS Studio › Lấy URL máy chủ), hoặc link mở app / link mời đã nhận. App kiểm máy chủ rồi chuyển tới màn đăng nhập.'
: t('auth.connect.lead'), _o1f);
}
function _o4e() {
const un = _o5f(S.auth.lastUsername());
const code = ui.field({ label: t('auth.reset.code'), name: 'code', inputmode: 'numeric', autocomplete: 'one-time-code' });
const p1 = ui.field({ label: t('auth.reset.new'), type: 'password', autocomplete: 'new-password' });
const p2 = ui.field({ label: t('auth.password2'), type: 'password', autocomplete: 'new-password' });
const info = h('p', { class: 'muted', 'aria-live': 'polite' });
const err = _o1g();
const send = button(t('auth.reset.send'), async () => {
const username = loginName(un.getValue());
if (!validUsername(username)) { err.textContent = t('auth.err.username'); un.input.focus(); return; }
try { await S.auth.resetRequest(username); S.auth.rememberUsername(username); info.textContent = t('auth.reset.sent'); } catch (e) { err.textContent = _o19(e); }
}, { kind: 'secondary', block: true });
const _o1f = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'reset-form' }, un, send, info, code, p1, _o4u(p1.input), p2, err,
button(t('auth.reset.submit'), null, { kind: 'primary', type: 'submit', block: true }),
h('button', { type: 'button', class: 'link-btn', onclick: () => showLogin() }, t('common.back')));
_o1f.addEventListener('submit', _om(_o1f, async () => {
if (p1.getValue().length < 8) throw new Error(t('auth.err.short'));
if (p1.getValue() !== p2.getValue()) throw new Error(t('auth.err.mismatch'));
await S.auth.resetConfirm(code.getValue(), p1.getValue(), loginName(un.getValue()));
showLogin(); toast(t('auth.reset.done'), 'ok', 4000);
}));
_oh(t('auth.reset.title'), t('auth.reset.lead2'), _o1f);
}
function _o4c(root, e) {
_oh(t('err.network'), (e && e.userMessage) || '', h('div', { class: 'auth-form' },
button(t('common.retry'), () => location.reload(), { kind: 'primary', block: true, icon: 'refresh' }),
S.api && S.api.mode !== 'demo' ? button(t('net.diag'), () => { openDiagnosis({ ui, api: S.api, config }); }, { kind: 'secondary', block: true, icon: 'pulse', testid: 'offline-diag' }) : null));
}
function _o4a() {
if (_o3g()) return _o25();
if (S.lockEl || !S.shellReady) return;
document.getElementById('app')?.classList.add('is-locked');
closeSheet();
const un = _o5f(S.auth.lastUsername()); un.input.id = 'unlock-user';
const p = ui.field({ label: t('auth.password'), type: 'password', name: 'password', autocomplete: 'current-password', id: 'unlock-pw' });
const err = _o1g();
const _o1f = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'lock-form' }, un, p, err,
button(t('auth.lock.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'unlock-submit', icon: 'lock' }),
h('button', { type: 'button', class: 'link-btn', onclick: () => _o13(true) }, icon('logout', 16), ' ', t('auth.logout')));
_o1f.addEventListener('submit', _om(_o1f, async () => {
try { await S.auth.unlock(p.getValue()); } catch (e) {
if (e.code === 'TFA_REQUIRED') { _o51(); return _o4g(e.challenge, p.getValue()); }
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
h('p', { class: 'auth-lead' }, t('auth.lock.lead')), _o1f));
document.body.appendChild(S.lockEl);
p.input.focus({ preventScroll: true });
try { if (typeof S.afterLockShown === 'function') S.afterLockShown(); } catch { }
}
function ctxFor(entry) {
return {
ui, api: S.api, store: S.store, ai: S.ai, logic: S.logic, t, settings: S.settings,
auth: _og, nav, data: S.data, pack: S.pack, config,
errors: { report: errors.report },
get route() { return S.route; },
get user() { return S.user ? { id: S.user.id, username: S.user.username, full_name: S.user.full_name, phone: S.user.phone || '', role: S.user.role, perms: { ...S.user.perms }, telegram_token_set: S.user.telegram_token_set, telegram_chat_id: S.user.telegram_chat_id, tg_ok: S.user.tg_ok, tg_via: S.user.tg_via, tg_company: S.user.tg_company, legacy: S.user.legacy } : null; },
users: S.users,
get _o4j() { return _o4k(); },
get company() { return _os() ? { name: String((S.status && S.status.company) || '') } : null; },
get packs() { return packsView(S.packs, S.video); },
get video() { return S.video; },
device: _o11(),
onRoute(cb) { S.routeSubs.add(cb); return () => S.routeSubs.delete(cb); },
module: entry && entry.manifest
};
}
function _os() {
return String((S.status && S.status.edition) || '') === 'cong-ty' || !!(S.status && S.status.owner_company === true) || !!(S.settings && S.settings.get('install.mode', '') === 'company');
}
function _o4k() {
const _o16 = String((S.status && S.status.edition) || '');
if (_o16 === 'cong-ty') return false;
return _o16 === 'ca-nhan' || !!(S.settings && S.settings.get('install.mode', '') === 'personal');
}
const _og = {
get deviceId() { return S.api.deviceId; },
isLoggedIn: () => S.api.hasValidToken(),
lock: () => S.auth.lock(),
logout: () => _o13(),
strength
};
function _o15(st) {
const _o3c = pendingPackage(st, { src: backupSource(st, config) });
download(pendingFileName(), JSON.stringify(_o3c), 'application/json');
}
async function _o21(st) {
try {
if (!st) { st = createStore({ api: S.api }); await st.open(); }
const n = pendingCount(st);
if (!n) return false;
setTimeout(() => { pendingDialog({ ui, n, kind: 'kept', download: () => _o15(st) }).catch(() => {}); }, 0);
return true;
} catch (e) { errors.report('warn', 'store.keep_pending', String(e && e.message || e)); return false; }
}
async function _o5k() {
try {
const st = S.store || createStore({ api: S.api });
S.store = null;
await st.open();
await st.clear();
} catch (e) { errors.report('warn', 'store.wipe', String(e && e.message || e)); }
}
function _ou(info) {
const _o1p = (info || []).find((x) => x && x.object_id);
const el = toast(t(_o1p ? 'sync.conflict.kept' : 'sync.conflict'), 'warn', _o1p ? 9000 : 4500);
if (!_o1p || !el) return;
el.appendChild(button(t('sync.conflict.view'), (e) => { e.stopPropagation(); location.hash = '#/customers?open=' + encodeURIComponent(_o1p.object_id); el.remove(); },
{ kind: 'ghost', small: true, icon: 'eye', testid: 'conflict-view' }));
}
async function _o18({ ownerName, ownerPhone } = {}) {
const _o2f = () => createStore({
api: S.api, intervalMs: config.SYNC_INTERVAL_MS || 30000,
onConflict: (n, info) => _ou(info),
onRejected: (rej) => toast(rejectionMessage(rej) || t('sync.rejected'), 'error', 9000),
onError: errors.report
});
if (S.store) S.store.stop();
S.store = _o2f();
await S.store.open();
const uid = S.user && S.user.id ? String(S.user.id) : '';
if (_o3g() && (!uid || S.store.userId !== uid)) { S.offline = null; return showLogin(t('off.why.other_user')); }
if (uid && S.store.userId !== uid) {
if (S.store.userId) {
const n = pendingCount(S.store);
if (n && (await pendingDialog({ ui, n, kind: 'other', download: () => _o15(S.store) })) !== 'wipe') {
S.store.stop(); try { await S.auth.logout(); } catch { } S.api.clearSession(); showLogin(); return false;
}
await S.store.clear(); S.store = _o2f(); await S.store.open();
}
await S.store.setUser(uid);
}
S.settings = createSettings(S.store);
await S.settings.init();
if (String((S.status && S.status.edition) || '') === 'cong-ty' || !!(S.status && S.status.owner_company === true) || S.settings.get('install.mode', '') === 'company') addWords({ 'role.owner': 'Quản trị (Admin)' });
if (ownerName && !(S.settings.get('profile') || {}).name) await S.settings.set('profile', { ...(S.settings.get('profile') || {}), name: ownerName });
if (ownerPhone && !(S.settings.get('profile') || {}).phone) await S.settings.set('profile', { ...(S.settings.get('profile') || {}), phone: ownerPhone });
S.ai = createAI({ api: S.api, settings: S.settings, ui, config });
{ const _oi = S.ai.availability; S.ai.availability = () => { const r = _oi(); return S.user && S.user.perms && S.user.perms.ai === false ? { ...r, gemini: false, claude: false, any: false } : r; }; }
_o1j();
S.users = createUsersApi({ api: S.api, store: S.store, ui, getUser: () => S.user });
S.packs = createPacks({ settings: S.settings, getPack: () => S.pack, isOwner: () => !S.user || !S.user.role || S.user.role === 'owner', userId: () => (S.user && S.user.id) || '' });
S.packs.on(_o2y);
setTimeout(() => { try { S.packs.takeReadyNotices().forEach((_ox) => toast(PACK_WORDS['xpack.notify.ready'].replace('{p}', _ox.title), 'ok', 6000)); } catch { } }, 2500);
S.video = createVideoScreens({ settings: S.settings, prefs, getPack: () => S.pack, isOwner: () => !S.user || !S.user.role || S.user.role === 'owner', userId: () => (S.user && S.user.id) || '' , config, packOn: (id) => !!S.packs && S.packs.enabled(id) });
S.video.on(() => { _od(); _o2y(); });
_od();
S.baseGuard = (e) => allowedBy(e.manifest, S.user && S.user.perms) && screenAllowed(e.manifest.screen, S.user && S.user.perms) && featureAllowed(e.id, S.user && S.user.perms) && S.packs.moduleOn(e.id)
&& !(e.manifest.company && _o4k());
S.registry.setGuard((e) => S.baseGuard(e) && !S.video.moduleHidden(e.id));
_o1v();
S.registry.add({ id: 'settings', manifest: { id: 'settings', title: t('screen.settings'), icon: 'settings', screen: 'settings', order: 0, version: config.APP_VERSION, status: 'ready' }, mod: { mount: (el, ctx) => mountSettings(el, ctx, appHooks) } });
S.registry.add({ id: 'users', manifest: { id: 'users', title: t('set.users'), icon: 'customers', screen: 'settings', order: 1, version: config.APP_VERSION, status: 'ready', hidden: true }, mod: { mount: (el, ctx) => import('./nhan_su.d64914137b.js').then((m) => m.mountStaff(el, ctx, appHooks)) } });
_o3l();
if (S.offline) _o35();
S.shellReady = true;
const _o1e = S.store.status().lastSync ? null : await import('./firstload.c4f7a8f078.js').then((m) => m.showFirstLoad({ ui, store: S.store, config,
versions: { web: config.APP_VERSION, server: (S.status && S.status.version) || '', edition: config.edition || '' }, errors: () => errors.recent() })).catch(() => null);
mountTo(document.getElementById('view'), h('div', { class: 'loading' }, ui.spinner(), h('span', null, t('common.loading'))));
await S.registry.load(ctxFor, { skip: _o32 });
try { await S.registry.ensure(ctxFor, { skip: _o32 }); } catch (e) { errors.report('warn', 'packs.ensure', String(e && e.message || e)); }
if (_o1e) _o1e.mark('screens');
try { installExtras({ S, appHooks, ctxFor, nav, config }); } catch (e) { errors.report('warn', 'extras.install', String(e && e.message || e), e && e.stack); }
try {
ensureCss(new URL('./feedback.a06c218a0a.css', import.meta.url).href, 'bds-feedback-css');
if (S.whatsNew) S.routeSubs.delete(S.whatsNew.onRoute);
if (S.feedback) S.feedback.stop();
S.whatsNew = installWhatsNew({ S, appHooks, ui, config });
S.feedback = installFeedback({ S, appHooks, ui, config, t });
} catch (e) { errors.report('warn', 'feedback.install', String(e && e.message || e), e && e.stack); }
try { if (S.selfHeal) S.selfHeal.stop(); S.selfHeal = installSelfHeal({ S, appHooks, ui, config, nav }); } catch (e) { errors.report('warn', 'selfheal.install', String(e && e.message || e), e && e.stack); }
try { if (S.license) S.license.stop(); S.license = installLicense({ S, appHooks, ui, config, nav, onChange: _o2y }); } catch (e) { errors.report('warn', 'license.install', String(e && e.message || e), e && e.stack); }
try { S.archive = installArchive({ S, appHooks, ui }); } catch (e) { errors.report('warn', 'archive.install', String(e && e.message || e), e && e.stack); }
try { if (S.cheers) S.cheers.stop(); S.cheers = installCheers({ S, appHooks, ui }); } catch (e) { errors.report('warn', 'cheers.install', String(e && e.message || e), e && e.stack); }
try { _o4t(); if (videoOffered(config) || S.video.offered()) _o4q(); } catch (e) { errors.report('warn', 'vm.install', String(e && e.message || e), e && e.stack); }
if (wizardEnabled({ config })) { try { S.wizard = (await import('./wizard/index.js')).installWizard({ S, appHooks, ui, config, nav }); } catch (e) { errors.report('warn', 'wizard.install', String(e && e.message || e), e && e.stack); } }
S.auth.startIdle();
S.store.start().then((st) => {
if (_o1e) { if (st && !st.lastSync) _o1e.fail(st.error ? String(st.error) : 'chưa kết nối được máy chủ – kiểm tra mạng rồi tải lại trang'); else _o1e.done(); }
errors.flush();
if (S.store && S.store.status().lastSync && S.packs && !_o3g()) S.packs.migrate().catch((e) => errors.report('warn', 'packs.migrate', String(e && e.message || e)));
});
try {
let setupDone = true;
try { const _o5m = S.wizard && typeof S.wizard.state === 'function' ? S.wizard.state() : null; setupDone = !_o5m || !!_o5m.dismissed || !!_o5m.finished; } catch { setupDone = true; }
_o4p(setupDone);
} catch (e) { errors.report('warn', 'pwa.hint', String(e && e.message || e)); }
window.addEventListener('hashchange', route);
route();
setTimeout(() => { if (S.shellReady && S.video) S.video.checkEngine({ ui, config }).catch(() => { }); }, 1500);
_o3i();
}
function _o51() {
_o4s(); S.offline = null;
window.removeEventListener('hashchange', route);
_o4t();
S.auth.stopIdle();
if (S.store) S.store.stop();
closeSheet();
if (S.lockEl) { S.lockEl.remove(); S.lockEl = null; }
S.shellReady = false; S.mounted = null; S.current = null;
}
const _o0 = 'bds:show-connect';
function _o4z() {
try { const v = sessionStorage.getItem(_o0); if (v) sessionStorage.removeItem(_o0); return !!v; } catch { return false; }
}
async function disconnectServer() {
const _o5g = await _o5d();
const _oe = (x) => ({ ...x, message: x.message.replace(/Đăng xuất bây giờ/g, 'Ngắt máy chủ bây giờ').replace(/hẵng đăng xuất/g, 'hẵng ngắt'), ok: x.ok.replace('Đăng xuất', 'Ngắt máy chủ') });
if (_o5g && !(await _ot(_o5g, _oe))) return false;
_o51();
try { await S.auth.logout(); } catch { }
await _o5k();
S.api.clearSession();
saveScriptUrl(null);
try { sessionStorage.setItem(_o0, '1'); } catch { }
location.replace(location.pathname + location.search);
}
async function _o5d() {
const st = S.store;
if (!st || typeof st.status !== 'function') return null;
let n = 0;
try { n = Number(st.status().pending) || 0; } catch { return null; }
const _o26 = S.license && typeof S.license.state === 'function' ? S.license.state() : null;
const readonly = !!(_o26 && _o26.readonly);
if (n && !readonly && typeof st.syncNow === 'function') {
try { await Promise.race([st.syncNow(), new Promise((r) => setTimeout(r, 8000))]); n = Number(st.status().pending) || 0; } catch { }
}
return unsentWarning(n, { readonly });
}
function _ot(_o5g, map = (x) => x) {
let _ow = map(_o5g);
const _o2h = h('p', { class: 'lead' }, _ow.message);
const m = modal({ title: _ow.title, body: _o2h, actions: [{ label: t('common.cancel'), kind: 'ghost', value: false }, { label: _ow.ok, kind: 'danger', value: true, id: 'confirm-ok' }] });
const _o33 = (st) => {
const n = Number(st && st.pending) || 0;
if (!n || n === _ow.count || !m.el.isConnected) return;
const _o2o = unsentWarning(n, { readonly: !!(S.license && typeof S.license.state === 'function' && (S.license.state() || {}).readonly) });
if (!_o2o) return;
_ow = map(_o2o);
_o2h.textContent = _ow.message;
const _o5a = m.el.querySelector('.modal-title'); if (_o5a) _o5a.textContent = _ow.title;
m.el.setAttribute('aria-label', _ow.title);
const _o2w = m.el.querySelector('#confirm-ok > span'); if (_o2w) _o2w.textContent = _ow.ok;
};
const _o2q = S.store && typeof S.store.onStatus === 'function' ? S.store.onStatus(_o33) : null;
return m.done.then((v) => { if (_o2q) _o2q(); return v === true; });
}
function _o4p(setupDone) {
if (S.pwaHintStop) { try { S.pwaHintStop(); } catch { } S.pwaHintStop = null; }
S.pwaHint = null;
installPwaHint({ ui, setupDone, hasCustomer: false });
if ((config.edition || 'owner') !== 'owner' && S.api && S.api.mode === 'demo') return;
let rec = null; try { rec = JSON.parse(localStorage.getItem('bds:pwa-hint') || 'null'); } catch { rec = null; }
if (!pwaHintPossible({ rec, setupDone })) return;
const store = S.store;
let busy = false, _o2q = null;
const _oq = async () => {
if (busy || S.pwaHint || S.store !== store || !store) return;
busy = true;
try {
const n = realCustomerCount(await store.list('objects'));
if (!n || S.store !== store || S.pwaHint) return;
if (_o2q) { _o2q(); _o2q = null; S.pwaHintStop = null; }
S.pwaHint = installPwaHint({ ui, setupDone, hasCustomer: true });
if (S.pwaHint) S.pwaHint.attach(document.querySelector('#app .main'));
} catch { } finally { busy = false; }
};
if (store && typeof store.on === 'function') { _o2q = store.on('objects', () => { _oq(); }); S.pwaHintStop = () => { if (_o2q) _o2q(); _o2q = null; }; }
_oq();
}
async function _o13(skipConfirm) {
const _o5g = await _o5d();
if (_o5g) {
const ok = await _ot(_o5g);
if (!ok) return;
} else if (!skipConfirm) { const ok = await ui.confirm(t('auth.logout.confirm'), { ok: t('auth.logout'), kind: 'danger', title: t('auth.logout') }); if (!ok) return; }
_o51();
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
setDensityDefault(v) { for (const s of SCREENS) try { localStorage.removeItem('density:' + s); } catch { } _oc(S.route ? S.route.screen : 'home', v); },
restartIdle() { S.auth.startIdle(); },
lockNow() { S.auth.lock(); },
logout: () => _o13(),
disconnectServer: () => disconnectServer(),
async swVersion() {
try {
const _on = navigator.serviceWorker && navigator.serviceWorker.controller;
if (_on) {
const v = await new Promise((res) => {
const _op = new MessageChannel(); const _o54 = setTimeout(() => res(null), 1500);
_op.port1.onmessage = (e) => { clearTimeout(_o54); res(e.data && e.data.version); };
_on.postMessage({ type: 'version' }, [_op.port2]);
});
if (v) return v;
}
const _o5b = await (await fetch('sw.js', { cache: 'no-cache' })).text();
const m = _o5b.match(/VERSION\s*=\s*['"]([^'"]+)['"]/);
return m ? m[1] + (_on ? '' : ' (chưa cài)') : null;
} catch { return null; }
},
async checkUpdate() {
try {
const _o3h = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
if (!_o3h) return 'none';
await _o3h.update();
return _o3h.waiting ? 'ready' : 'latest';
} catch { return 'none'; }
},
async applyUpdate() {
const _o3h = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
if (_o3h && _o3h.waiting) {
navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
_o3h.waiting.postMessage({ type: 'skipWaiting' });
} else location.reload();
}
};
function _o3i() {
if (!('serviceWorker' in navigator) || _o39.has('nosw') || location.port === '5173') return;
navigator.serviceWorker.register('sw.js').then((_o3h) => {
if (!_o3h || typeof _o3h.addEventListener !== 'function') return;
_o3h.addEventListener('updatefound', () => {
const _o5g = _o3h.installing;
_o5g && _o5g.addEventListener('statechange', () => {
if (_o5g.state === 'installed' && navigator.serviceWorker.controller) toast(t('set.version.ready'), 'info', 6000);
});
});
}).catch((e) => errors.report('warn', 'sw.register', String(e && e.message || e)));
}
function _o2k(s) { return hasWord('nav.' + s) ? t('nav.' + s) : t('screen.' + s); }
function _o2j(_o3v) {
return _o3v.map((s) => h('a', { href: '#/' + s, class: 'nav-item', dataset: { screen: s }, 'data-testid': 'nav-' + s },
h('span', { class: 'nav-ico' }, icon(_o6[s], 23)), h('span', { class: 'nav-label' }, h('span', { class: 'nav-label-short' }, _o2k(s)), h('span', { class: 'nav-label-full' }, t('screen.' + s)))));
}
const _o32 = (id) => (!!S.packs && !S.packs.moduleOn(id)) || (!!S.video && S.video.moduleHidden(id)) || S.registry.deviceBlocked(id);
function _o10(opts = {}) {
const box = h('div', { class: 'desk-only-wait' });
import('./desktop_only.75ae1d9a10.js').then((m) => { box.replaceWith(m.desktopOnlyNote({ ui, nav, ...opts })); }, () => { box.textContent = DESKTOP_ONLY_TEXT; });
return box;
}
function _o11() {
return {
get kind() { return S.registry ? S.registry.device : 'desktop'; },
get mobile() { return !!S.registry && S.registry.device === 'mobile'; },
blocked: (id) => !!S.registry && S.registry.deviceBlocked(String(id || '')),
note: (opts = {}) => _o10(opts)
};
}
function _o3u(s) {
if (s === 'home' || s === 'settings') return true;
const _o2g = packModules(S.pack || {});
const _o3t = (id) => { const e = S.registry && S.registry.get(id); return e && e.mod ? e.manifest.screen : ((_o2g.find((m) => m.id === id) || {}).meta || {}).screen; };
const ids = _o2g.map((m) => m.id);
if (ids.length && !ids.some((id) => _o3t(id) === s)) return false;
if (!S.packs) return true;
if (S.video && S.video.screenAllHidden(ids.filter((id) => _o3t(id) === s))) return false;
if (!screenPermitted(ids.filter((id) => _o3t(id) === s), S.user && S.user.perms)) return false;
const usable = ids.filter((id) => !S.registry.deviceBlocked(id));
if (usable.length < ids.length && ids.some((id) => _o3t(id) === s) && !usable.some((id) => _o3t(id) === s)) return false;
return S.packs.screenOn(s, usable, _o3t);
}
function _od() {
const _o2q = !!(S.video && S.video.hidden()) || !!(S.user && S.user.perms && S.user.perms.video === false)
|| !!(S.packs && !S.packs.moduleOn('ideas'));
if (_o2q && !S.videoWordsOrig) { S.videoWordsOrig = Object.fromEntries(Object.keys(VIDEO_OFF_WORDS).map((k) => [k, t(k)])); addWords(VIDEO_OFF_WORDS); }
else if (!_o2q && S.videoWordsOrig) { addWords(S.videoWordsOrig); S.videoWordsOrig = null; }
}
function _o1v() {
if (S.videoEvents) return;
S.videoEvents = true;
window.addEventListener(VIDEO_EVENT, (_o1a) => {
if (!S.video) return;
S.video.fromWizard(_o1a && _o1a.detail).catch((e) => errors.report('warn', 'video.screens', String(e && e.message || e)));
});
}
function _o4i() { return visibleScreens(S.user && S.user.perms, SCREENS).filter(_o3u); }
function _o34() {
const box = document.querySelector('.nav .nav-items'); if (!box) return;
const _o14 = new Set([...box.querySelectorAll('.nav-item.has-dot')].map((a) => a.dataset.screen));
const _o3v = _o4i();
box.style.setProperty('--nav-n', String(_o3v.length));
mountTo(box, _o2j(_o3v));
for (const a of box.querySelectorAll('.nav-item')) {
const on = !!S.route && a.dataset.screen === S.route.screen;
a.classList.toggle('on', on); a.classList.toggle('has-dot', _o14.has(a.dataset.screen));
if (on) a.setAttribute('aria-current', 'page');
}
}
function _o4q() {
if (S.vm || S.vmLoading) return;
const _o1k = S.vmGen = (S.vmGen || 0) + 1;
S.vmLoading = true;
import('./video_machine.7091cef818.js').then((m) => {
if (_o1k !== S.vmGen || S.vm || !S.shellReady) return;
S.vm = m.installVideoMachine({ S, ui });
}).catch((e) => errors.report('warn', 'vm.install', String(e && e.message || e), e && e.stack)).finally(() => { if (_o1k === S.vmGen) S.vmLoading = false; });
}
function _o4t() {
S.vmGen = (S.vmGen || 0) + 1; S.vmLoading = false;
if (S.vm) { try { S.vm.stop(); } catch { } S.vm = null; }
}
async function _o2y() {
if (!S.shellReady) return;
_od();
if (!S.vm && S.video && S.video.offered()) _o4q();
try { await S.registry.ensure(ctxFor, { skip: _o32 }); } catch (e) { errors.report('warn', 'packs.ensure', String(e && e.message || e)); }
_o34();
const r = S.route; if (!r) return;
if (!_o3u(r.screen)) { nav('home'); return; }
const _ow = r.module ? S.registry.get(r.module) : null;
const pending = _ow && S.registry.allowed(_ow) && _ow.state === 'ready' && S.mounted !== _ow;
if (pending && S.building && S.building.id === _ow.id) { try { S.building.m.close(); } catch { } S.building = null; }
if ((_ow && !S.registry.allowed(_ow)) || pending) { S.current = null; route(); return; }
if (r.module) return;
if (S.screenSig && S.screenSig === screenSig(r.screen)) return;
const _o20 = _o22();
S.current = null; await route(); _o20();
}
function screenSig(screen) {
try {
const ent = S.registry.entries.map((e) => [e.id, e.state, S.registry.allowed(e) ? 1 : 0, e.manifest && e.manifest.screen].join(':')).join(',');
const _o26 = S.license && S.license.state ? S.license.state() : null;
return JSON.stringify([screen, _o4i(), ent, S.settings ? S.settings.get('packs', null) : null,
S.video ? [S.video.record(), S.video.offered(), S.video.engineOff()] : null, _o26 ? [_o26.mode, _o26.readonly, _o26.model] : null, packStatesKey()]);
} catch { return ''; }
}
function _o22() {
const view = document.getElementById('view');
const open = view ? [...view.querySelectorAll('details.set-sec[id]')].map((_ox) => [_ox.id, _ox.open]) : [];
const _o5n = window.scrollY || 0;
return () => {
const v = document.getElementById('view'); if (!v) return;
for (const [id, on] of open) { const _ox = v.querySelector('#' + CSS.escape(id)); if (_ox && _ox.open !== on) _ox.open = on; }
if (_o5n) requestAnimationFrame(() => { try { window.scrollTo(0, _o5n); } catch { } });
};
}
function _o3l() {
const root = document.getElementById('app');
if (!root.classList.contains('app-shell')) try { window.scrollTo(0, 0); } catch { }
root.className = 'app app-shell';
const _o3v = _o4i();
const _o2i = _o2j(_o3v);
const syncDot = h('button', { type: 'button', class: 'sync', id: 'sync-dot', 'data-testid': 'sync-dot', 'aria-label': t('sync.ok') }, h('span', { class: 'sync-dot' }), h('span', { class: 'sync-text' }));
syncDot.addEventListener('click', async () => { const s = await S.store.syncNow(); toast(_o4x(s), s.online ? (s.pending ? 'warn' : 'ok') : 'info'); });
const densitySeg = segmented([{ value: 'compact', label: t('common.compact'), icon: 'layout' }, { value: 'detail', label: t('common.detail'), icon: 'log' }], 'compact',
(v) => { const _o3s = S.route ? S.route.screen : 'home'; setDensityFor(_o3s, v); _oc(_o3s, v); _o3j(); }, { label: t('common.detail'), name: 'density' });
densitySeg.classList.add('seg-sm');
densitySeg.setAttribute('data-testid', 'density');
const backBtn = button('', () => nav(S.route ? S.route.screen : 'home'), { kind: 'ghost', icon: 'back', title: t('common.back'), cls: 'top-back', id: 'top-back' });
const helpBtn = h('button', { type: 'button', class: 'help-btn help-top', id: 'top-help', 'aria-label': t('common.help'), title: t('common.help') }, icon('help', 18));
helpBtn.addEventListener('click', _o43);
const lockBtn = button('', () => S.auth.lock(), { kind: 'ghost', icon: 'lock', title: t('auth.lock.now'), cls: 'top-lock', id: 'top-lock' });
const _o8 = h('button', { type: 'button', class: 'nav-user', id: 'nav-user', 'aria-haspopup': 'menu', 'aria-expanded': 'false', 'aria-label': t('acct.menu') });
_o8.addEventListener('click', () => _o56(_o8));
const _o9 = h('button', { type: 'button', class: 'top-account', id: 'top-account', 'data-testid': 'top-account', 'aria-haspopup': 'menu', 'aria-expanded': 'false', 'aria-label': t('acct.menu') });
_o9.addEventListener('click', () => _o56(_o9));
mountTo(root,
_o3n(),
h('div', { class: 'frame' },
h('nav', { class: 'nav', 'aria-label': t('app.name') },
h('a', { class: 'nav-brand', href: '#/home' }, h('img', { src: brandLogo(), alt: '', width: 36, height: 36, 'data-brand-logo': '' }),
h('span', { class: 'nav-brand-text' }, h('strong', { 'data-brand-name': '', 'data-brand-default': t('app.name') }, brandName(t('app.name'))), h('small', null, t('app.tagline')))),
h('div', { class: 'nav-items', style: { '--nav-n': String(_o3v.length) } }, _o2i),
h('div', { class: 'nav-foot' }, _o8)),
h('div', { class: 'main' },
h('header', { class: 'topbar' },
backBtn,
h('div', { class: 'top-titles' }, h('h1', { class: 'top-title', id: 'top-title' }), h('p', { class: 'top-sub', id: 'top-sub' })),
h('div', { class: 'top-actions' }, syncDot, densitySeg, helpBtn, lockBtn, _o9)),
h('div', { class: 'panes' },
h('main', { class: 'view', id: 'view', tabindex: '-1' }),
h('div', { class: 'detail', id: 'detail' })))));
if (S.pwaHint) S.pwaHint.attach(root.querySelector('.main'));
S.densitySeg = densitySeg;
S.store.onStatus(_o37);
_o38();
S.settings.on('profile', _o38);
}
function _o38() {
const el = document.getElementById('nav-user'); if (!el) return;
const p = S.settings.get('profile', {}) || {};
const _o5c = S.user;
const name = (_o5c && !_o5c.legacy && _o5c.full_name) || p.name || (_o5c && _o5c.full_name) || prefs.get('owner_name', '') || (_o5c && _o5c.username) || '';
const sub = [_o5c ? roleLabel(_o5c.role) : '', p.title].filter(Boolean).join(' · ');
el.dataset.role = _o5c ? _o5c.role : '';
el.setAttribute('data-testid', 'nav-user');
el.title = t('acct.menu');
mountTo(el, h('span', { class: 'avatar' }, (name || '•').trim().charAt(0).toUpperCase()),
h('span', { class: 'nav-user-text' }, h('strong', null, name || t('set.profile')), sub ? h('small', null, sub) : null),
h('span', { class: 'nav-user-more', 'aria-hidden': 'true' }, '⋯'));
const top = document.getElementById('top-account');
if (top) { top.dataset.role = el.dataset.role; mountTo(top, h('span', { class: 'avatar avatar-sm' }, (name || '•').trim().charAt(0).toUpperCase())); }
}
function _o56(anchor) {
const open = document.querySelector('.acct-menu');
if (open) { open._close(); if (open._anchor === anchor) return; }
const _o5c = S.user || {};
const p = S.settings.get('profile', {}) || {};
const name = (!_o5c.legacy && _o5c.full_name) || p.name || _o5c.full_name || prefs.get('owner_name', '') || _o5c.username || '';
const _o1y = (label, ic, fn, testid, cls) => h('button', { type: 'button', role: 'menuitem', class: ['acct-item', cls], 'data-testid': testid, onclick: () => { close(); fn(); } }, icon(ic, 18), h('span', null, label));
const _o2e = h('div', { class: 'acct-menu', role: 'menu', 'aria-label': t('acct.menu'), 'data-testid': 'acct-menu' },
h('div', { class: 'acct-head' },
h('span', { class: 'avatar avatar-sm' }, (name || '•').trim().charAt(0).toUpperCase()),
h('span', { class: 'acct-who' }, h('strong', null, name || t('set.profile')), h('small', null, [_o5c.username ? '@' + _o5c.username : '', _o5c.role ? roleLabel(_o5c.role) : ''].filter(Boolean).join(' · ')))),
_o1y(t('acct.settings'), 'user', () => nav('settings/security'), 'acct-settings'),
_o1y(t('auth.lock.now'), 'lock', () => S.auth.lock(), 'acct-lock'),
_o1y(t('auth.logout'), 'logout', () => _o13(), 'acct-logout', 'acct-danger'));
document.body.appendChild(_o2e);
const r = anchor.getBoundingClientRect();
const _o5g = Math.min(260, window.innerWidth - 24);
_o2e.style.width = _o5g + 'px';
_o2e.style.left = Math.max(12, Math.min(window.innerWidth - _o5g - 12, r.left)) + 'px';
if (r.top > window.innerHeight / 2) _o2e.style.bottom = (window.innerHeight - r.top + 8) + 'px';
else _o2e.style.top = (r.bottom + 8) + 'px';
anchor.setAttribute('aria-expanded', 'true');
const onDoc = (e) => { if (!_o2e.contains(e.target) && !anchor.contains(e.target)) close(); };
const onKey = (e) => { if (e.key === 'Escape') { close(); anchor.focus(); } };
function close() {
_o2e.remove(); anchor.setAttribute('aria-expanded', 'false');
document.removeEventListener('mousedown', onDoc, true); document.removeEventListener('touchstart', onDoc, true); document.removeEventListener('keydown', onKey, true);
window.removeEventListener('hashchange', close);
}
_o2e._close = close; _o2e._anchor = anchor;
document.addEventListener('mousedown', onDoc, true); document.addEventListener('touchstart', onDoc, true); document.addEventListener('keydown', onKey, true);
window.addEventListener('hashchange', close);
const _o1e = _o2e.querySelector('.acct-item'); if (_o1e) _o1e.focus({ preventScroll: true });
}
function _o5j() {
const _o5c = S.user; if (!_o5c) return null;
const p = S.settings.get('profile', {}) || {};
const name = (!_o5c.legacy && _o5c.full_name) || p.name || _o5c.full_name || _o5c.username;
return h('div', { class: 'whoami', 'data-testid': 'whoami', dataset: { role: _o5c.role } },
h('span', { class: 'avatar avatar-sm' }, (name || '•').trim().charAt(0).toUpperCase()),
h('span', { class: 'whoami-text' }, h('strong', null, name), h('small', null, '@' + _o5c.username)),
ui.badge(roleLabel(_o5c.role), ROLE_TONE[_o5c.role] || 'neutral'));
}
function _o4x(s) {
if (!s.online) return t('sync.offline');
if (s.syncing) return t('sync.syncing');
if (s.pending) return t('sync.pending', { n: s.pending });
return s.lastSync ? t('sync.ok') + ' · ' + new Date(s.lastSync).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : t('sync.never');
}
function _o36(p) {
let box = document.getElementById('pull-progress');
if (!p || !p.total) { if (box) box.remove(); return; }
const done = Math.min(p.done, p.total), pct = Math.round(done / p.total * 100);
const label = 'Đang tải dữ liệu về máy lần đầu: ' + done.toLocaleString('vi-VN') + ' / ' + p.total.toLocaleString('vi-VN') + ' dòng';
if (!box) { box = h('div', { id: 'pull-progress', class: 'pull-progress', role: 'status', 'aria-live': 'polite', 'data-testid': 'pull-progress' }); document.body.appendChild(box); }
mountTo(box, h('span', { class: 'small' }, label), progress(pct, label));
}
function _o37(s) {
const el = document.getElementById('sync-dot'); if (!el) return;
const tone = !s.online ? 'off' : s.pending || s.syncing ? 'pending' : 'ok';
el.dataset.state = tone;
el.setAttribute('aria-label', _o4x(s)); el.title = _o4x(s);
el.querySelector('.sync-text').textContent = !s.online ? 'Mất mạng' : s.pending ? String(s.pending) : '';
_o36(s.pull);
if (_o37.online === undefined) _o37.online = true;
if (!!s.online !== _o37.online) {
_o37.online = !!s.online;
toast(s.online ? (s.pending ? 'Đã có mạng lại – đang gửi ' + s.pending + ' thay đổi lên máy chủ.' : 'Đã có mạng lại.') : 'Đang ngoại tuyến – vẫn xem và sửa được, thay đổi giữ trên máy và tự gửi khi có mạng.', s.online ? 'ok' : 'warn', 6000);
}
}
const _o1 = new Set();
function _oc(screen, v) {
const _ox = v || densityFor(screen);
document.body.dataset.density = _ox;
if (S.densitySeg) { S.densitySeg.setValue(_ox); S.densitySeg.hidden = !_o1.has(screen); }
}
function _o43() {
const r = S.route || {};
const entry = r.module ? S.registry.get(r.module) : null;
let text = '';
if (entry) {
const _o1q = entry.manifest.help;
text = _o1q && hasWord('help.' + _o1q) ? t('help.' + _o1q) : (_o1q || (hasWord('help.' + entry.id) ? t('help.' + entry.id) : ''));
}
if (!text) text = hasWord('help.screen.' + r.screen) ? t('help.screen.' + r.screen) : t('screen.' + r.screen + '.sub');
modal({
title: entry ? entry.manifest.title : t('screen.' + r.screen),
body: h('div', null, ui.paragraphs(text), helpDocLink(h, helpPageForRoute(r)), h('hr', { class: 'sep' }), ui.paragraphs(t('help.sync')),
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
function _o3j() { if (S.route && S.route.module) { S.current = null; route(); } }
async function route() {
if (!S.shellReady) return;
const r = parseHash(location.hash);
const _ow = r.module ? S.registry.get(r.module) : null;
const moved = r.module ? (movedHash(r, _ow) || (_ow ? '' : aliasHash(r, S.registry.pack && S.registry.pack.moved, (id) => { const e = S.registry.get(id); return e && e.manifest ? e.manifest.screen : ''; }))) : '';
if (moved) { location.replace(moved); return; }
if (r.module && S.registry.deviceBlocked(r.module) && screenAllowed(r.screen, S.user && S.user.perms) && S.registry.permitted(_ow)) { _o45(r); return; }
if (!screenAllowed(r.screen, S.user && S.user.perms) || !_o3u(r.screen)) { nav('home'); return; }
if (!r.module && [...r.query.keys()].length) {
const _o3e = S.registry.byScreen(r.screen).find((e) => e.state === 'ready');
if (_o3e) r.module = _o3e.id;
}
const key = r.screen + '/' + r.module + '/' + r.sub + '?' + r.query.toString();
if (S.current === key) return;
if (S.current && S.routeHash && ui.sheetDirty()) {
const _o5h = location.hash;
try { history.replaceState(history.state, '', S.routeHash); } catch { }
ui.confirmLeave().then((_o5o) => {
if (!_o5o) return;
closeSheet();
if (location.hash === _o5h) { S.current = null; route(); } else location.hash = _o5h;
});
return;
}
S.current = key; S.route = r; S.routeHash = location.hash || '#/home';
closeSheet();
if (S.mounted && S.mounted.mod && typeof S.mounted.mod.unmount === 'function') { try { S.mounted.mod.unmount(); } catch { } }
S.mounted = null;
for (const a of document.querySelectorAll('.nav-item')) {
const on = a.dataset.screen === r.screen;
a.classList.toggle('on', on);
if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
}
_oc(r.screen);
const root = document.getElementById('app');
root.dataset.screen = r.screen;
const view = document.getElementById('view');
clear(view);
view.classList.remove('enter'); void view.offsetWidth; view.classList.add('enter');
let entry = r.module ? S.registry.get(r.module) : null;
if (entry && S.video && S.video.moduleHidden(entry.id) && S.baseGuard && S.baseGuard(entry)) {
root.classList.add('in-module');
_o3y(entry.manifest.title, t('screen.' + r.screen), t('screen.' + r.screen + '.sub'));
mountTo(view, S.video.hiddenCard(ui, { nav, title: entry.manifest.title }));
S.routeSubs.forEach((cb) => { try { cb(r); } catch { } });
return;
}
let _oy = null;
if (entry && !S.registry.allowed(entry)) { _oy = entry; entry = null; }
root.classList.toggle('in-module', !!entry);
if (entry && entry.state === 'ready' && entry.mod) {
_o3y(entry.manifest.title, t('screen.' + r.screen), t('screen.' + r.screen + '.sub'));
const host = h('div', { class: 'module-host', dataset: { module: entry.id } });
const beta = S.packs && S.packs.moduleBeta ? S.packs.moduleBeta(entry.id) : null;
if (beta) view.appendChild(betaBar(ui, beta, (_o2p) => (typeof appHooks.openFeedback === 'function' ? appHooks.openFeedback(_o2p) : nav('settings/feedback'))));
view.appendChild(host);
S.mounted = entry;
try { await entry.mod.mount(host, ctxFor(entry)); } catch (e) {
errors.report('warn', 'mount:' + entry.id, String(e && e.message || e), e && e.stack);
mountTo(host, ui.empty(t('module.error')));
}
S.routeSubs.forEach((cb) => { try { cb(r); } catch { } });
return;
}
if (entry && entry.state !== 'ready') _o41(entry);
_o3k(view, r.screen);
S.screenSig = r.module ? '' : screenSig(r.screen);
if (_oy) { const note = _oz(_oy, r.screen); const _o1o = view.querySelector('.hero'); if (_o1o) _o1o.after(note); else view.prepend(note); }
S.routeSubs.forEach((cb) => { try { cb(r); } catch { } });
}
function _oz(entry, screen) {
const m = entry.manifest || {};
const title = String(m.title || entry.id);
const _o3a = !!m.requires || !!m.company;
const _o4j = _o3a && _o4k();
const _o2c = S.registry.byScreen(screen).find((e) => e.id !== entry.id && e.state === 'ready' && S.registry.allowed(e) && !(e.manifest && e.manifest.hidden));
const _o2d = _o2c ? String(_o2c.manifest.title || _o2c.id) : t('screen.' + screen);
return h('section', { class: 'card denied-note', role: 'note', 'data-testid': 'module-denied', dataset: { module: entry.id } },
h('h3', { class: 'denied-title' }, icon(_o4j ? 'customers' : 'lock', 20), h('span', null, _o4j ? title + ' dành cho bản Công ty' : 'Chưa mở được ' + title)),
h('p', { class: 'muted' }, _o4j
? 'Bản Cá nhân chỉ có một người dùng nên không cần mục này – khách mới (landing, nhập tay, Excel) vào thẳng mục ' + _o2d + '.'
: 'Tài khoản của anh/chị chưa được cấp quyền mở mục này. Cần dùng thì nhờ Quản trị (Admin) cấp quyền ở Cài đặt › Nhân sự.'),
h('div', { class: 'btn-row' }, button('Mở ' + _o2d, () => nav(_o2c ? screen + '/' + _o2c.id : screen), { kind: 'primary', small: true, icon: 'next', testid: 'module-denied-go' })));
}
function _o45(r) {
const key = 'desk:' + r.raw;
if (S.current === key) return;
S.current = key; S.route = r;
closeSheet();
if (S.mounted && S.mounted.mod && typeof S.mounted.mod.unmount === 'function') { try { S.mounted.mod.unmount(); } catch { } }
S.mounted = null;
const e = S.registry.get(r.module);
const meta = (S.pack && S.pack.meta && S.pack.meta[r.module]) || {};
const title = (e && e.manifest && e.manifest.title) || meta.title || '';
for (const a of document.querySelectorAll('.nav-item')) { a.classList.remove('on'); a.removeAttribute('aria-current'); }
const root = document.getElementById('app');
root.dataset.screen = r.screen; root.classList.add('in-module');
_o3y(title, t('screen.' + r.screen));
const view = document.getElementById('view');
mountTo(view, _o10({ title, link: location.href }));
S.routeSubs.forEach((cb) => { try { cb(r); } catch { } });
}
function _o3y(title, sub, alt) {
const _o3r = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
if (_o3r(title, sub)) sub = alt && !_o3r(title, alt) ? alt : '';
const _o59 = document.getElementById('top-title'); const _o58 = document.getElementById('top-sub');
if (_o59) _o59.textContent = title || ''; if (_o58) { _o58.textContent = sub || ''; _o58.hidden = !sub; }
}
function _o55() { return vnDayText(); }
function _o3k(view, screen) {
_o3y(t('screen.' + screen), t('screen.' + screen + '.sub'));
const _o2g = S.registry.byScreen(screen);
const p = S.settings.get('profile', {}) || {};
const _o4n = S.user && S.user.role && S.user.role !== 'owner';
const name = String((_o4n ? S.user.full_name || S.user.username : p.name || prefs.get('owner_name', '')) || '').trim();
const _o1o = h('section', { class: 'hero hero-' + screen },
h('div', { class: 'hero-text' },
h('p', { class: 'hero-kicker' }, screen === 'home' ? _o55() : _o2k(screen)),
h('h2', { class: 'hero-title' }, screen === 'home' ? greeting(name) : t('screen.' + screen)),
h('p', { class: 'hero-sub' }, t('screen.' + screen + '.sub'))),
h('div', { class: 'hero-mark', 'aria-hidden': 'true' }, icon(_o6[screen], 40)));
const _o4v = screen === 'home' ? tileModules(_o2g).find((e) => e.state === 'ready' && e.mod && typeof e.mod.summary === 'function') : null;
const _o4h = tileModules(_o2g);
const _o1m = h('div', { class: 'tiles', 'data-testid': 'tiles-' + screen }, _o4h.map((e) => _o53(e, e === _o4v ? { title: t('home.full'), desc: t('home.full.desc') } : null)));
const parts = [_o1o];
if (screen === 'home' && S.user && S.user.tg_ok === false && !S.user.legacy) {
parts.push(h('div', { class: 'card tg-nag', 'data-testid': 'tg-nag' },
h('div', { class: 'tg-nag-text' },
h('strong', null, 'Nối Telegram để nhận khách ngay'),
h('p', { class: 'tg-nag-warn' }, 'Không nối Telegram sẽ nhận báo chậm, mất số thì tự chịu')),
button('Nối Telegram', () => nav('settings/mytg'), { kind: 'primary', testid: 'tg-nag-go' })));
}
if (_o4v) {
const host = h('div', { class: 'home-summary-host module-host', dataset: { module: _o4v.id } });
parts.push(host);
Promise.resolve().then(() => _o4v.mod.summary(host, ctxFor(_o4v))).catch((e) => errors.report('warn', 'summary:' + _o4v.id, String(e && e.message || e), e && e.stack));
}
if (_o4h.length) parts.push(_o1m);
else if (screen !== 'settings') parts.push(ui.empty(t('module.none')));
if (screen === 'settings') {
const box = h('div', { class: 'settings-host' });
const who = _o5j(); if (who) parts.push(who);
parts.push(box);
mountSettings(box, ctxFor(S.registry.get('settings')), appHooks).catch((e) => errors.report('warn', 'settings.mount', String(e && e.message || e), e && e.stack));
}
mountTo(view, ...parts);
}
function _o53(entry, alt) {
const m = alt ? { ...entry.manifest, ...alt } : entry.manifest;
const _o2q = entry.state !== 'ready';
const _o4w = stateWords(entry.state);
let _o27 = ''; try { _o27 = !alt && entry.mod && typeof entry.mod.tileDesc === 'function' ? String(entry.mod.tileDesc() || '') : ''; } catch { _o27 = ''; }
const desc = _o27 || m.desc || (m.help && !hasWord('help.' + m.help) ? m.help : '');
const _o57 = !_o2q && !!S.packs && S.packs.moduleTrial(entry.id);
const el = h('a', {
href: '#/' + m.screen + '/' + entry.id,
class: ['tile', _o2q && 'is-building', entry.state === 'error' && 'is-error'],
dataset: { module: entry.id, state: entry.state }, 'data-testid': 'tile-' + entry.id,
'aria-description': _o2q ? t(_o4w.badge) : null
},
h('span', { class: 'tile-ico' }, glyph(m.icon, 26)),
h('span', { class: 'tile-text' },
h('span', { class: 'tile-title' }, m.title),
_o57 ? h('span', { class: 'tile-badge tile-trial', 'data-testid': 'tile-trial-' + entry.id }, PACK_WORDS['xpack.st.trial']) : null,
_o2q ? h('span', { class: 'tile-badge' }, t(_o4w.badge)) : (desc ? h('span', { class: 'tile-desc' }, desc) : null),
_o2q && _o4w.progress ? h('span', { class: 'tile-prog' }, progress(m.progress), h('span', { class: 'tile-meta num' }, t('module.progress', { p: m.progress }) + (m.eta ? ' · ' + t('module.eta', { eta: m.eta }) : ''))) : null),
h('span', { class: 'tile-chev' }, icon('next', 18)));
if (_o2q) el.addEventListener('click', (e) => { e.preventDefault(); _o41(entry); });
return el;
}
function _o41(entry) {
const m = entry.manifest;
const _o4w = stateWords(entry.state);
S.building = { id: entry.id, m: modal({
title: m.title,
body: h('div', { class: 'building', 'data-testid': 'building-modal' },
h('div', { class: 'building-ico' }, glyph(m.icon, 34)),
h('p', { class: 'lead' }, t(_o4w.badge)),
h('p', { class: 'muted' }, t(_o4w.lead)),
entry.state === 'error' ? h('p', { class: 'muted num', 'data-testid': 'module-reason' }, String(entry.reason || (entry.selftest && entry.selftest.details) || '').slice(0, 200)) : null,
_o4w.progress ? progress(m.progress) : null,
_o4w.progress ? h('p', { class: 'num building-meta' }, t('module.progress', { p: m.progress }) + (m.eta ? ' · ' + t('module.eta', { eta: m.eta }) : '')) : null),
actions: [{ label: t('common.close'), kind: 'primary' }]
}) };
}
window.__bds = { S, errors, parseHash, ui };
_ok().catch((e) => {
errors.report('critical', 'boot', String(e && e.message || e), e && e.stack);
const root = document.getElementById('app');
mountTo(root, h('main', { class: 'auth' }, h('div', { class: 'auth-card' }, h('h1', { class: 'auth-title' }, t('err.generic')),
button(t('common.retry'), () => location.reload(), { kind: 'primary', block: true }))));
});

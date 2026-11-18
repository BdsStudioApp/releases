import config from '../config.js';
import { t, has as hasWord, setPackWords, addWords } from './i18n.39c909b69c.js';
import ui, { h, icon, button, toast, modal, mountTo, clear, segmented, help, progress, glyph, closeSheet, afterSheetBack } from './ui.6d9018bbdb.js';
import { supportBlock } from './support.4921a97342.js';
import { setHelpConfig, helpDocLink, helpPageForRoute } from './help_links.338ed991a5.js';
import { createApi, saveScriptUrl, scriptUrl } from './api.024f831cb4.js';
import { createAuth, strength, normUsername, validUsername, loginName } from './auth.cfa76474bd.js';
import { tfaStepForm, postLoginPrompts, cssOnce as tfaCss } from './tfa.1fd07d9b62.js';
import { createUsersApi, visibleScreens, screenAllowed, roleLabel, ROLE_TONE } from './users.56f7da9390.js';
import { featureAllowed, screenPermitted, setPackInfo as setFeaturePackInfo } from './features.7307eb3773.js';
import { allowedBy } from './registry.54aeee0abb.js';
import { createStore } from './store.f70ff324d6.js';
import { createRegistry, SCREENS, packModules, tileModules } from './registry.54aeee0abb.js';
import { createPacks, betaBar, WORDS as PACK_WORDS } from './packs.603a1dc003.js';
import { createVideoScreens, packsView, videoOffered, EVENT as VIDEO_EVENT, OFF_WORDS as VIDEO_OFF_WORDS } from './video_screens.2ab623260d.js';
import { createAI } from './ai.67f02dae48.js';
import { createSettings, mountSettings, applyPrefs, densityFor, setDensityFor, prefs } from './settings.93eb4e94cc.js';
import { installExtras } from './extras.26b0a771ab.js';
import { installWhatsNew } from './whatsnew.4e64bc32f7.js';
import { installSelfHeal } from './selfheal.34340761f9.js';
import { rejectionMessage } from './health_logic.9704b81308.js';
import { installFeedback } from './feedback.e2343f595c.js';
import { installLicense } from './license.b204e40d1b.js';
import { unsentWarning } from './license_logic.16b4f5bd9e.js';
import { installArchive } from './archive.b9c9022e1a.js';
import { installCheers } from './cheers.31ac9741dc.js';
import { installVideoMachine } from './video_machine.611ebd965d.js';
import { ensureCss, download } from './xkit.f03faf0986.js';
import { installPwaHint } from './pwa_hint.e9c180890f.js';
import { emailCodeBox, emailGateNeeded, purposeFor } from './email_verify.c44911bb1b.js';
import { wizardEnabled, firstVisitNoServer } from './wizard/flag.js';
import { adoptSetupToken, setSetupCodeAsker } from './setup_gate.d66104e8e0.js';
import { EXEC_URL_RE, serverFromInput } from './exec_url.4b6ba956ed.js';
import { pendingFrom, pendingFromServer, savePending, readPending, clearPending, HANDOFF_KEY } from './connect_confirm.7f97e2ff4f.js';
import { greeting, vnDayText } from './greet.60b99ed569.js';
import { privacyLine } from './instance.0601c79adf.js';
import { deviceVerifyForm, kickedView, watchSession } from './device_slots.63f82dd117.js';
import { pendingCount, pendingPackage, pendingFileName, pendingDialog, backupSource } from './pending_rescue.10a3ad29cf.js';
try { for (const _o1m of document.querySelectorAll('link[data-bds-font]')) _o1m.media = 'all'; } catch { }
const _o2a = new URLSearchParams(location.search);
const PACK = config.PACK || 'bds';
const _o2 = './packs/' + PACK + '/';
const _o3 = { home: 'home', customers: 'customers', sales: 'sales', content: 'bulb', inbox: 'inbox', settings: 'settings' };
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
const _o1k = errors.queue.splice(0, errors.queue.length);
for (const e of _o1k) {
try { await S.api.call('errors.report', { level: e.level, where: e.where, message: e.message, detail: e.detail }); } catch { }
}
},
recent() { return errors.log.slice(); }
};
function _o1f() {
window.addEventListener('error', (_o11) => {
if (_o11.target && _o11.target !== window && _o11.target.tagName) return;
errors.report('warn', 'window.onerror', _o11.message || 'error', _o11.error && _o11.error.stack);
});
window.addEventListener('unhandledrejection', (_o11) => {
const r = _o11.reason;
errors.report(r && r.critical ? 'critical' : 'warn', 'unhandledrejection', (r && (r.message || r.code)) || String(r), r && r.stack);
_o11.preventDefault();
});
window.addEventListener('bds:error', (_o11) => { const _or = _o11.detail || {}; errors.report(_or.level, _or.where, _or.message, _or.detail); });
}
async function _o1o(src) {
try {
const r = await fetch(src);
if (!r.ok) return null;
const code = await r.text();
if (/^\s*export\s/m.test(code)) return await import(new URL(src, document.baseURI).href);
await new Promise((res, rej) => {
const _o2n = document.createElement('script'); _o2n.src = src; _o2n.async = true;
_o2n.onload = res; _o2n.onerror = rej; document.head.appendChild(_o2n);
});
return {};
} catch (e) { errors.report('warn', 'loadLib:' + src, String(e && e.message || e)); return null; }
}
async function _o1p() {
const [logicMod, dataMod] = await Promise.all([
window.BDSLogic ? null : _o1o('./shared/logic.js'),
window.BDSData ? null : _o1o('./data/projects.js')]);
S.logic = window.BDSLogic || (logicMod && (logicMod.default || logicMod)) || {};
const D = window.BDSData || window.BDSProjects || (dataMod && (dataMod.default || dataMod)) || {};
const projects = D.projects || D.PROJECTS || (Array.isArray(D) ? D : []);
const defaultPolicies = D.defaultPolicies || D.DEFAULT_POLICIES || D.policies || {};
S.data = { ...D, projects: Array.isArray(projects) ? projects : [], defaultPolicies };
}
async function _oh() {
setHelpConfig(config);
applyPrefs();
_o1f();
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyPrefs);
const root = document.getElementById('app');
const _o2f = createRegistry({ base: _o2, report: errors.report });
S.registry = _o2f;
const _o24 = _o2f.loadPack().then(async (pack) => {
S.pack = pack;
try { setFeaturePackInfo(pack); } catch { }
if (pack.words) {
try { const r = await fetch(_o2 + pack.words); if (r.ok) setPackWords(await r.json()); } catch { }
}
document.title = t('app.name');
}).catch((e) => errors.report('warn', 'boot.pack', String(e && e.message || e)));
const _o2x = _o1p();
const lockMs = Number(_o2a.get('lockms')) || 0;
if (await _o2d(root)) return;
wizardEnabled({ config });
const _o2u = _o9();
const connectUrl = _o8();
const _o1i = /^#\/moi\?/.test(location.hash || '') ? (await import('./invite_accept.f7bd5479cf.js')).takeInviteToken() : '';
if (_o2u) { const _o3e = pendingFromServer(_o2u, _o1i); if (_o3e) savePending(_o3e); }
S.api = createApi({ config });
setSetupCodeAsker(_oc);
S.auth = createAuth({ api: S.api, lockMs, defaultLockMinutes: config.LOCK_MINUTES || 10 });
S.api.onAuthLost(async (e) => {
if (!S.shellReady) return;
if (e && e.kicked) return _o21(e.kicked);
const _o12 = !S.api.hasValidToken();
toast(t('auth.session_lost'), 'warn'); S.api.clearSession(); _o3l();
if (!_o12 && !(await _o1l(S.store))) await _o42();
showLogin();
});
watchSession({ api: S.api, active: () => S.shellReady && !S.kicking, supported: () => !!(S.status && S.status.device_slots) });
S.auth.on('lock', _o35);
S.auth.on('user', (_o3v) => { S.user = _o3v; });
S.user = S.auth.user;
S.api.onMustChange(() => { if (S.shellReady) { _o3l(); _o36(); } });
document.documentElement.dataset.mode = S.api.mode;
await _o24;
if (_o2a.get('action') === 'tfa.deny' && _o2a.get('t')) { await _o2x; return _o31(_o2a.get('t')); }
if (_o2u && !scriptUrl(config)) { const _o3e = readPending(); if (_o3e) { await _o2x; return _o2z(_o3e); } }
if (_o1i) { await _o2x; return (await import('./invite_accept.f7bd5479cf.js')).showInviteAccept({ ui, api: S.api, auth: S.auth, token: _o1i, root, afterLogin, showLogin }); }
if (_o3k()) { await _o2x; return showConnect(); }
const _o19 = !scriptUrl(config) ? readPending() : null;
if (_o19) { await _o2x; return _o2z(_o19); }
if (connectUrl && (scriptUrl(config) ? scriptUrl(config) !== connectUrl : !wizardEnabled({ config }))) { await _o2x; return showConnect(connectUrl); }
if (connectUrl && !scriptUrl(config) && S.api.mode === 'demo') { await _o2x; if (await _o43()) return; return showConnect(connectUrl); }
if (firstVisitNoServer({ api: S.api, config })) { await _o2x; if (await _o43()) return; }
let status;
try { status = await S.api.call('status'); } catch (e) {
if (S.api.hasValidToken()) { await _o2x; return _oz(); }
return _o37(root, e);
}
await _o2x;
S.status = status || null;
if (!status || !status.setup) return (await import('./oneclick.c9ce44d759.js').then((m) => m.shouldStartWizard(status, config) && wizardEnabled({ config, search: '?wizard=1' })).catch(() => false), await _o43()) || showSetup();
if (!S.api.hasValidToken()) { if (S.api.token) S.api.clearSession(); return showLogin(); }
try { await S.auth.me(); } catch (e) {
if (e && e.kicked) { const r = await _o2k(e.kicked, null); S.api.clearSession(); return _o34(e.kicked, r); }
if (e && (e.code === 'AUTH_REQUIRED' || e.code === 'AUTH_INVALID')) { S.api.clearSession(); if (!(await _o1l(null))) await _o42(); return showLogin(); }
}
if (S.user && S.user.must_change_pw) return _o36();
if (S.auth.meFresh() && emailGateNeeded(S.user)) return _o33();
if ((await _oz()) === false) return;
if (S.auth.isLocked() || S.auth.idleExpired()) { S.auth.lock(); _o35(); } else _o2m();
}
async function _o43() {
if (!wizardEnabled({ config })) return false;
try { return (await import('./wizard/index.js')).wizardBeforeSetup({ ui, api: S.api, config, showSetup, showConnect: () => showConnect('', { login: true }) }); } catch (e) { errors.report('warn', 'wizard.setup', String(e && e.message || e)); return false; }
}
const LINK_PROBLEM_KEY = 'bds:wizard:may_chu_loi';
function _oc(err) {
const _o1e = h('input', { type: 'text', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: 7, class: 'input', 'data-testid': 'setup-code-input', placeholder: '123 456' });
const m = modal({
title: 'Nhập mã cài đặt',
body: h('div', null,
h('p', { class: 'lead' }, 'Mở Sheet máy chủ › menu BDS Studio › Cài đặt: hộp thoại có "Mã cài đặt" 6 số. Nhập mã đó để tạo tài khoản Quản trị.'),
err && err.tries_left !== undefined && err.message ? h('p', { class: 'muted' }, err.message) : null,
_o1e),
actions: [{ label: t('common.cancel'), kind: 'ghost', value: null, icon: 'close' }, { label: 'Tiếp tục', kind: 'primary', value: 'ok', id: 'setup-code-ok', icon: 'check' }]
});
setTimeout(() => { try { _o1e.focus(); } catch { } }, 50);
return m.done.then((v) => (v === 'ok' ? String(_o1e.value || '').replace(/\D/g, '') || null : null));
}
function _o8() {
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
async function _o2d(root) {
const P = config.PORTAL;
if (!(P === true || (P && typeof P === 'object' && P.host && location.hostname === P.host))) return false;
try {
const portal = await import('./portal.ccd3807f1c.js');
if (location.hash === portal.CLEAR_ROUTE) { await portal.renderClearPage(root); return true; }
window.addEventListener('hashchange', () => { if (location.hash === portal.CLEAR_ROUTE) location.reload(); });
await portal.portalGuard({ config });
document.documentElement.dataset.portal = '1';
} catch (e) { errors.report('warn', 'portal.boot', String(e && e.message || e)); }
return false;
}
function _o9() {
const v = String(_o2a.get('server') || '').trim();
if (!_o2a.has('server')) return '';
_o2a.delete('server');
try { const q = _o2a.toString(); history.replaceState(null, '', location.pathname + (q ? '?' + q : '') + location.hash); } catch { }
return EXEC_URL_RE.test(v) && !scriptUrl(config) ? v : '';
}
async function afterLogin(password, extra) {
try { await S.auth.me(); } catch { }
if (S.user && S.user.must_change_pw) return _o36(password);
if (S.auth.meFresh() && emailGateNeeded(S.user)) return _o33(extra);
if ((await _oz(extra)) === false) return;
_o2m();
}
function _o2m() {
let quietTfa = false;
try { quietTfa = !!(S.wizard && typeof S.wizard.beforeStep === 'function' && S.wizard.beforeStep('tfa')); } catch { quietTfa = false; }
postLoginPrompts({ ui, auth: S.auth, nav, quietTfa }).catch((e) => errors.report('warn', 'tfa.post', String(e && e.message || e)));
}
function _o2l() {
if (S.api.mode !== 'demo') return null;
const _o2o = (config.edition || 'owner') !== 'owner';
return h('div', { class: ['ribbon', _o2o && 'ribbon-notreal'], role: 'note', 'data-testid': 'demo-ribbon' },
h('span', { class: 'ribbon-dot' }), h(_o2o ? 'strong' : 'span', null, t(_o2o ? 'demo.ribbon.sale' : 'demo.ribbon')),
S.shellReady ? h('a', { href: '#/settings', class: 'ribbon-link' }, t('demo.connect')) : null);
}
function _oe(title, lead, ...content) {
const root = document.getElementById('app');
root.className = 'app app-auth';
S.shellReady = false;
mountTo(root, _o2l(),
h('main', { class: 'auth' },
h('div', { class: 'auth-card' },
h('div', { class: 'brand' }, h('img', { src: 'assets/icon.svg', alt: '', class: 'brand-mark', width: 56, height: 56 }),
h('div', null, h('div', { class: 'brand-name' }, t('app.name')), h('div', { class: 'brand-tag' }, t('app.tagline')))),
h('h1', { class: 'auth-title' }, title),
lead ? h('p', { class: 'auth-lead' }, lead) : null,
...content)));
const _o14 = root.querySelector('input'); if (_o14) _o14.focus({ preventScroll: true });
}
function _o16() { return h('p', { class: 'form-err', role: 'alert', 'aria-live': 'assertive' }); }
function _o10(e) {
if (!e) return t('err.generic');
if (e.code === 'LOCKED') return t('auth.err.locked', { time: e.retry_at ? new Date(Number(e.retry_at)).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '15 phút' });
if (e.code === 'AUTH_INVALID') return e.userMessage || t('auth.err.wrong');
return e.userMessage || e.message || t('err.generic');
}
function _o3h(input) {
const _og = [0, 1, 2, 3].map(() => h('span', { class: 'sbar' }));
const label = h('span', { class: 'slabel' }, '');
const _ox = h('div', { class: 'strength', 'data-score': '0', 'aria-live': 'polite' }, h('div', { class: 'sbars' }, _og), label);
const _o3x = () => {
const v = input.value; const _o2n = v ? strength(v) : 0;
_ox.dataset.score = v ? String(_o2n) : '';
label.textContent = v ? t('auth.strength.' + _o2n) : '';
};
input.addEventListener('input', _o3x);
return _ox;
}
function _oj(_o15, fn) {
return async (_o11) => {
_o11.preventDefault();
if (_o15.dataset.busy) return;
_o15.dataset.busy = '1';
const _oi = _o15.querySelector('button[type=submit]');
const err = _o15.querySelector('.form-err'); if (err) err.textContent = '';
if (_oi) { _oi.classList.add('is-busy'); _oi.disabled = true; }
try { await fn(); } catch (e) { if (err) err.textContent = _o10(e); } finally {
delete _o15.dataset.busy; if (_oi) { _oi.classList.remove('is-busy'); _oi.disabled = false; }
}
};
}
const _o4 = 'bds:setup_email';
function _o2w() {
try {
const v = JSON.parse(sessionStorage.getItem(_o4) || 'null');
if (!v || !v.email) return null;
if (Date.now() - Number(v.at || 0) > 14 * 60000) return { email: String(v.email) };
return { email: String(v.email), code: String(v.code || ''), use_account_email: !!v.use_account_email };
} catch { return null; }
}
function _on() { try { sessionStorage.removeItem(_o4); } catch { } }
function showSetup() {
if (!S.status && S.api) return S.api.call('status').then((st) => { S.status = st || null; }, () => {}).then(() => _o39());
return _o39();
}
function _o39() {
const name = ui.field({ label: t('auth.setup.name'), name: 'owner', autocomplete: 'name' });
const un = _o3y('admin');
const phone = ui.field({ label: 'Số điện thoại của anh/chị', type: 'tel', name: 'phone', id: 'setup-phone', autocomplete: 'tel', inputmode: 'tel', placeholder: 'VD: 0912 345 678',
hint: 'In trên tin nhắn Zalo, trang landing và ảnh báo giá gửi khách. Bỏ trống được – thêm sau ở Cài đặt › Thông tin cá nhân.' });
phone.input.setAttribute('data-testid', 'setup-phone');
const p1 = ui.field({ label: t('auth.password'), type: 'password', name: 'password', autocomplete: 'new-password', id: 'pw1' });
const p2 = ui.field({ label: t('auth.password2'), type: 'password', name: 'password2', autocomplete: 'new-password', id: 'pw2' });
const err = _o16();
const _o1w = !!(S.status && S.status.email_verify);
const demo = S.api.mode === 'demo';
const pre = _o1w ? _o2w() : null;
let _o11 = pre && (pre.code || pre.use_account_email) ? pre : null;
const evBox = _o1w ? emailCodeBox({
ui, api: S.api, testid: 'setup-ev', email: (pre && pre.email) || (demo ? 'demo@dungthu.local' : ''),
label: 'Email của anh/chị (bắt buộc)', hint: 'Bấm "Gửi mã", mở email lấy mã 6 số. Email đã xác nhận dùng để nhận mã khi quên mật khẩu.',
send: (em) => S.auth.emailStart(em, 'setup'), verify: (em, _ok) => S.auth.emailCheck(em, _ok), allowAccountEmail: true,
onVerified: (v) => { _o11 = v.use_account_email ? { use_account_email: true, email: v.email } : { email: v.email, code: v.code }; }
}) : null;
const evDone = _o1w ? h('p', { class: 'ev-ok', 'data-testid': 'setup-ev-done', hidden: !_o11 }, _o11 ? '✅ Email đã xác nhận: ' + _o11.email : '') : null;
if (evBox && _o11) evBox.hidden = true;
const _o15 = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'setup-form' }, name, phone, un, p1, _o3h(p1.input), p2, evBox, evDone, err,
privacyLine(h, { testid: 'setup-privacy', lead: 'Tạo tài khoản là anh/chị đã đọc ', cfg: config }),
button(t('auth.setup.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'setup-submit', icon: 'lock' }),
_op());
_o15.addEventListener('submit', _oj(_o15, async () => {
const _o5 = p1.getValue(), b = p2.getValue();
const username = normUsername(un.getValue()) || 'admin';
if (!validUsername(username)) throw new Error(t('auth.err.username'));
if (_o5.length < 8) throw new Error(t('auth.err.short'));
if (_o5 !== b) throw new Error(t('auth.err.mismatch'));
const _o2b = String(phone.getValue() || '').trim();
if (_o2b && !validMyPhone(_o2b)) { phone.input.focus(); throw new Error('Số điện thoại chưa đúng (10 số, bắt đầu bằng 0) – sửa lại hoặc để trống.'); }
let _oy = null;
if (_o1w) {
if (!_o11 && demo) await evBox.autoDemo('demo@dungthu.local');
if (!_o11) { evBox.focus(); throw new Error('Cần xác nhận email: bấm "Gửi mã", rồi nhập mã 6 số trong email.'); }
_oy = _o11.use_account_email ? { use_account_email: true } : { email: _o11.email, email_code: _o11.code };
}
let _o3f;
try { _o3f = await S.auth.setup(_o5, String(name.getValue() || '').trim(), username, _oy); } catch (e) {
if (_o1w && /Mã xác nhận|Thiếu email|email tài khoản Google/i.test(String((e && (e.userMessage || e.message)) || ''))) { _o11 = null; _on(); if (evDone) evDone.hidden = true; evBox.hidden = false; }
throw e;
}
_on();
if (_o3f && (_o3f.tfa_required || _o3f.device_verify_required)) return _o3a(_o3f, _o5);
if (name.getValue()) { prefs.set('owner_name', String(name.getValue()).trim()); }
if (S.api.mode === 'demo') { try { await S.api.seedDemo(); } catch (e) { errors.report('warn', 'seedDemo', String(e && e.message || e)); } }
await afterLogin(_o5, { ownerName: String(name.getValue() || '').trim(), ownerPhone: _o2b });
}));
_oe(t('auth.setup.title'), t('auth.setup.lead'), _o15);
}
export function validMyPhone(p) { let _or = String(p || '').replace(/\D/g, ''); if (_or.startsWith('84') && _or.length >= 11) _or = '0' + _or.slice(2); return /^0[35789]\d{8}$/.test(_or) || /^02\d{9}$/.test(_or); }
function _o3y(value) {
const _o13 = ui.field({ label: t('auth.username'), name: 'username', id: 'username', autocomplete: 'username', value: value || '' });
_o13.input.setAttribute('autocapitalize', 'none'); _o13.input.setAttribute('spellcheck', 'false'); _o13.input.setAttribute('autocorrect', 'off');
_o13.input.addEventListener('input', () => { const v = _o13.input.value.toLowerCase().replace(/\s+/g, ''); if (v !== _o13.input.value) _o13.input.value = v; });
return _o13;
}
function showLogin(msg) {
const un = _o3y(S.auth.lastUsername());
const p = ui.field({ label: t('auth.password'), type: 'password', name: 'password', autocomplete: 'current-password', id: 'pw' });
const err = _o16(); if (msg) err.textContent = msg;
const _o1y = S.status && S.status.notice && S.status.notice.kind === 'migrated' ? S.status.notice : null;
if (_o1y) tfaCss();
const notice = _o1y ? h('div', { class: 'auth-notice', role: 'note', 'data-testid': 'login-notice' },
h('span', null, 'Vừa nâng cấp máy chủ? Chủ app đăng nhập bằng tên ', h('strong', null, _o1y.username), ' (lấy theo tên trong Hồ sơ), mật khẩu giữ nguyên như cũ.'),
un.getValue() === _o1y.username ? null : button('Dùng tên ' + _o1y.username, () => { un.setValue(_o1y.username); p.input.focus(); }, { kind: 'ghost', small: true, id: 'use-notice-name' })) : null;
const _o15 = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'login-form' }, notice, un, p, err,
button(t('auth.login.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'login-submit' }),
h('button', { type: 'button', class: 'link-btn', id: 'forgot', onclick: _o38 }, t('auth.forgot')),
_op());
_o15.addEventListener('submit', _oj(_o15, async () => {
const username = loginName(un.getValue());
if (!validUsername(username)) { un.input.focus(); throw new Error(t('auth.err.username')); }
if (!p.getValue()) throw new Error(t('auth.err.short'));
const r = await S.auth.login(username, p.getValue());
if (r && (r.tfa_required || r.device_verify_required)) return _o3a(r, p.getValue());
await afterLogin(p.getValue());
}));
_oe(t('auth.login.title'), t('auth.login.lead2'), _o15);
if (un.getValue()) p.input.focus({ preventScroll: true });
}
async function _o31(tok) {
const box = h('div', { class: 'auth-form', 'data-testid': 'deny-result' }, ui.spinner());
_oe('Khoá thiết bị lạ', '', box);
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
function _o3a(challenge, password) {
if (challenge && challenge.device_verify_required) return _o32(challenge, password);
const _o15 = tfaStepForm(challenge, {
ui, auth: S.auth, demo: S.api.mode === 'demo',
onDone: (data) => (data && data.device_verify_required ? _o32(data, password) : afterLogin(password)),
onCancel: () => { S.auth.cancelTfa(); showLogin(); }
});
_oe('Xác thực 2 lớp', 'Máy này chưa quen nên cần thêm một bước. Máy đã xác nhận sẽ không bị hỏi lại trong 30 ngày.', _o15);
const _ok = _o15.querySelector('#tfa-code'); if (_ok) _ok.focus({ preventScroll: true });
}
function _o32(challenge, password) {
const _o15 = deviceVerifyForm(challenge, {
ui, auth: S.auth, api: S.api, demo: S.api.mode === 'demo',
onDone: () => afterLogin(password),
onCancel: () => { S.auth.cancelTfa(); showLogin(); }
});
_oe('Xác nhận đổi máy', null, _o15);
const _ok = _o15.querySelector('#dv-code'); if (_ok) _ok.focus({ preventScroll: true });
}
async function _o2k(k, st) {
let n = 0, tried = false, wiped = false;
try {
if (!st) { st = createStore({ api: S.api }); await st.open(); }
n = Number(st.status().pending) || 0;
for (let _o1d = 0; _o1d < 2 && n && k.why !== 'remote' && Number(k.grace_until) > Date.now(); _o1d++) {
tried = true;
try { await Promise.race([st.syncNow(), new Promise((r) => setTimeout(r, 8000))]); } catch { }
n = Number(st.status().pending) || 0;
}
} catch (e) { errors.report('warn', 'device.rescue', String(e && e.message || e)); }
if (k.why === 'remote') { await _o42(); wiped = true; }
return { pending: n, tried, wiped, st: wiped ? null : st };
}
async function _o21(k) {
if (S.kicking) return;
S.kicking = true;
try {
const r = await _o2k(k, S.store);
S.api.clearSession(); _o3l();
_o34(k, r);
} finally { S.kicking = false; }
}
function _o34(k, r = {}) {
const _os = r.st && Number(r.pending) > 0 && !r.wiped ? () => _ov(r.st) : null;
_oe('Máy này đã đăng xuất', null, kickedView({ ui, kicked: k, pending: r.pending, tried: r.tried, wiped: r.wiped, onRelogin: () => showLogin(), onDownload: _os }));
}
function _o33(extra) {
const _o3v = S.user || {}, g = _o3v.email_gate || {};
const _o23 = _o3v.role === 'owner';
const done = async (msg) => { toast(msg, 'ok', 4000); if ((await _oz(extra)) === false) return; _o2m(); };
const defer = _o23 ? async () => { await S.auth.emailDefer(); await done('Đã để sau 24 giờ. Hết 24 giờ app hỏi lại email.'); } : null;
const box = emailCodeBox({
ui, api: S.api, testid: 'gate-ev', email: g.email || _o3v.email || '', label: 'Email của anh/chị',
hint: 'Gõ đúng email anh/chị đang dùng (sửa được nếu Quản trị gõ nhầm). Email đã xác nhận dùng để nhận mã khi quên mật khẩu.',
send: (em) => S.auth.emailStart(em, purposeFor(em, _o3v.email || g.email || '')),
verify: (em, _ok) => S.auth.verifyEmail(_ok),
allowAccountEmail: _o23, useAccountEmail: () => S.auth.verifyEmail('', true), onDefer: defer,
onVerified: () => done('Đã xác nhận email. Cảm ơn anh/chị!')
});
const who = h('p', { class: 'auth-who' }, h('strong', null, _o3v.full_name || _o3v.username || ''), _o3v.username ? ' · @' + _o3v.username : '');
const later = _o23 && g.can_defer ? h('div', { class: 'auth-notice', role: 'note', 'data-testid': 'gate-defer-box' },
h('span', null, 'Máy chủ vừa không gửi được email. Anh/chị có thể để sau 24 giờ rồi làm tiếp.'),
button('Để sau (24 giờ)', defer, { kind: 'ghost', small: true, testid: 'gate-defer' })) : null;
const _o15 = h('div', { class: 'auth-form', 'data-testid': 'email-gate' }, who, box, later,
h('button', { type: 'button', class: 'link-btn', id: 'gate-logout', onclick: async () => { await S.auth.logout(); showLogin(); } }, t('auth.logout')));
_oe('Bổ sung email (bắt buộc)', 'Mỗi tài khoản cần một email đã xác nhận để nhận mã khi quên mật khẩu. Anh/chị bấm "Gửi mã", mở email rồi nhập mã 6 số. Làm 1 lần, khoảng 1 phút.', _o15);
box.focus();
}
function _o36(tempPw) {
const old = tempPw ? null : ui.field({ label: t('auth.must.old'), type: 'password', autocomplete: 'current-password', id: 'must-old' });
const p1 = ui.field({ label: t('auth.reset.new'), type: 'password', autocomplete: 'new-password', id: 'must-pw1' });
const p2 = ui.field({ label: t('auth.password2'), type: 'password', autocomplete: 'new-password', id: 'must-pw2' });
const err = _o16();
const who = S.user ? h('p', { class: 'auth-who' }, h('strong', null, S.user.full_name || S.user.username), ' · @' + S.user.username) : null;
const _o15 = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'mustchange-form' }, who, old, p1, _o3h(p1.input), p2, err,
button(t('auth.must.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'must-submit' }),
h('button', { type: 'button', class: 'link-btn', onclick: async () => { await S.auth.logout(); showLogin(); } }, t('auth.logout')));
_o15.addEventListener('submit', _oj(_o15, async () => {
const _o5 = p1.getValue(), b = p2.getValue();
const _o1z = tempPw || (old && old.getValue()) || '';
if (_o5.length < 8) throw new Error(t('auth.err.short'));
if (_o5 !== b) throw new Error(t('auth.err.mismatch'));
if (_o5 === _o1z) throw new Error('Mật khẩu mới phải khác mật khẩu tạm.');
await S.auth.changePassword(_o1z, _o5);
toast(t('auth.must.done'), 'ok');
try { await S.auth.me(); } catch { }
if (S.user) S.user.must_change_pw = 0;
if (S.auth.meFresh() && emailGateNeeded(S.user)) return _o33();
await _oz();
}));
_oe(t('auth.must.title'), t('auth.must.lead'), _o15);
}
function _op() {
return h('button', { type: 'button', class: 'link-btn', id: 'connect-server', 'data-testid': 'connect-server', onclick: showConnect }, icon('link', 16), ' ',
S.api && S.api.mode === 'demo' ? t('auth.connect.demo') : t('auth.connect.change'));
}
async function _o2z(p) {
const _ol = await import('./connect_confirm.7f97e2ff4f.js');
_oe('Kết nối máy chủ của anh/chị', 'Đang kiểm máy chủ trong link…', h('p', { class: 'muted', 'data-testid': 'connect-confirm-wait' }, ui.spinner ? ui.spinner() : null, ' Đang hỏi máy chủ…'));
const probe = await _ol.probeServer(p.url);
const _o45 = () => {
clearPending();
saveScriptUrl(p.url);
if (p.kind === 'invite' || p.kind === 'server') {
try { history.replaceState(null, '', location.pathname + location.search + (p.ma ? '#/moi?ma=' + encodeURIComponent(p.ma) : '#/home')); } catch { }
} else {
try { sessionStorage.setItem(HANDOFF_KEY, JSON.stringify({ flow: p.flow, domain: p.domain, at: Date.now() })); } catch { }
}
location.reload();
};
const _o1x = () => { clearPending(); showConnect(); };
const _o1h = p.kind === 'invite' || p.kind === 'server';
_oe('Kết nối máy chủ của anh/chị', _o1h
? 'Link mời mở app và nối tới máy chủ dưới đây. Kiểm tên công ty / app trước khi nối – sau khi nối, anh/chị đặt mật khẩu và đăng nhập trên máy chủ này.'
: 'Link mở app chỉ tới máy chủ dưới đây. Kiểm tên và địa chỉ trước khi nối – sau khi nối, app đăng nhập vào máy chủ này.',
_ol.confirmView({ h, button }, { url: p.url, probe, onYes: _o45, onNo: _o1x, kind: p.kind || '' }));
}
function showConnect(prefill, { login = false } = {}) {
const url = ui.field({ label: login ? 'Địa chỉ máy chủ hoặc link mở app' : t('auth.connect.url'), name: 'script_url', id: 'connect-url', inputmode: 'url', autocomplete: 'off', help: t('auth.connect.help'), value: typeof prefill === 'string' ? prefill : '' });
const err = _o16();
const _o15 = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'connect-form' }, url, err,
button(t('auth.connect.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'connect-submit', icon: 'link' }),
h('button', { type: 'button', class: 'link-btn', 'data-testid': 'connect-back', onclick: () => location.reload() }, icon('back', 16), ' ', t('common.back')));
_o15.addEventListener('submit', _oj(_o15, async () => {
let v = String(url.getValue() || '').trim();
const _o17 = serverFromInput(v);
if (_o17) v = _o17.url;
if (!/^https:\/\/script\.google(usercontent)?\.com\/.+/.test(v)) throw new Error(t('auth.connect.bad'));
saveScriptUrl(v);
try { await createApi({ config }).call('status'); } catch (e) { saveScriptUrl(null); throw new Error(e && e.code === 'NOT_PUBLIC' ? e.userMessage : t('auth.connect.fail')); }
if (S.api && S.api.mode === 'demo') {
const ok = await import('./wizard/demodata.js').then((m) => m.confirmLeaveDemo({ ui, api: S.api })).catch(() => true);
if (!ok) { saveScriptUrl(null); return; }
}
if (_o17 && _o17.ma) { try { history.replaceState(null, '', location.pathname + location.search + '#/moi?ma=' + encodeURIComponent(_o17.ma)); } catch { } }
location.reload();
}));
_oe(login ? 'Đăng nhập trên máy này' : t('auth.connect.title'), login
? 'Đã cài BDS Studio trên máy khác? Dán địa chỉ máy chủ (kết thúc bằng /exec – trong Sheet máy chủ: menu BDS Studio › Lấy URL máy chủ), hoặc link mở app / link mời đã nhận. App kiểm máy chủ rồi chuyển tới màn đăng nhập.'
: t('auth.connect.lead'), _o15);
}
function _o38() {
const un = _o3y(S.auth.lastUsername());
const code = ui.field({ label: t('auth.reset.code'), name: 'code', inputmode: 'numeric', autocomplete: 'one-time-code' });
const p1 = ui.field({ label: t('auth.reset.new'), type: 'password', autocomplete: 'new-password' });
const p2 = ui.field({ label: t('auth.password2'), type: 'password', autocomplete: 'new-password' });
const info = h('p', { class: 'muted', 'aria-live': 'polite' });
const err = _o16();
const send = button(t('auth.reset.send'), async () => {
const username = loginName(un.getValue());
if (!validUsername(username)) { err.textContent = t('auth.err.username'); un.input.focus(); return; }
try { await S.auth.resetRequest(username); S.auth.rememberUsername(username); info.textContent = t('auth.reset.sent'); } catch (e) { err.textContent = _o10(e); }
}, { kind: 'secondary', block: true });
const _o15 = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'reset-form' }, un, send, info, code, p1, _o3h(p1.input), p2, err,
button(t('auth.reset.submit'), null, { kind: 'primary', type: 'submit', block: true }),
h('button', { type: 'button', class: 'link-btn', onclick: () => showLogin() }, t('common.back')));
_o15.addEventListener('submit', _oj(_o15, async () => {
if (p1.getValue().length < 8) throw new Error(t('auth.err.short'));
if (p1.getValue() !== p2.getValue()) throw new Error(t('auth.err.mismatch'));
await S.auth.resetConfirm(code.getValue(), p1.getValue(), loginName(un.getValue()));
showLogin(); toast(t('auth.reset.done'), 'ok', 4000);
}));
_oe(t('auth.reset.title'), t('auth.reset.lead2'), _o15);
}
function _o37(root, e) {
_oe(t('err.network'), (e && e.userMessage) || '', h('div', { class: 'auth-form' },
button(t('common.retry'), () => location.reload(), { kind: 'primary', block: true, icon: 'refresh' })));
}
function _o35() {
if (S.lockEl || !S.shellReady) return;
document.getElementById('app')?.classList.add('is-locked');
closeSheet();
const p = ui.field({ label: t('auth.password'), type: 'password', autocomplete: 'current-password', id: 'unlock-pw' });
const err = _o16();
const _o15 = h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'lock-form' }, p, err,
button(t('auth.lock.submit'), null, { kind: 'primary', type: 'submit', block: true, id: 'unlock-submit', icon: 'lock' }),
h('button', { type: 'button', class: 'link-btn', onclick: () => _ot(true) }, t('auth.logout')));
_o15.addEventListener('submit', _oj(_o15, async () => {
try { await S.auth.unlock(p.getValue()); } catch (e) {
if (e.code === 'TFA_REQUIRED') { _o3l(); return _o3a(e.challenge, p.getValue()); }
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
h('p', { class: 'auth-lead' }, t('auth.lock.lead')), _o15));
document.body.appendChild(S.lockEl);
p.input.focus({ preventScroll: true });
}
function ctxFor(entry) {
return {
ui, api: S.api, store: S.store, ai: S.ai, logic: S.logic, t, settings: S.settings,
auth: _od, nav, data: S.data, pack: S.pack, config,
errors: { report: errors.report },
get route() { return S.route; },
get user() { return S.user ? { id: S.user.id, username: S.user.username, full_name: S.user.full_name, phone: S.user.phone || '', role: S.user.role, perms: { ...S.user.perms }, telegram_token_set: S.user.telegram_token_set, telegram_chat_id: S.user.telegram_chat_id, legacy: S.user.legacy } : null; },
users: S.users,
get solo() { return _o3d(); },
get packs() { return packsView(S.packs, S.video); },
get video() { return S.video; },
onRoute(cb) { S.routeSubs.add(cb); return () => S.routeSubs.delete(cb); },
module: entry && entry.manifest
};
}
function _o3d() {
const _ow = String((S.status && S.status.edition) || '');
if (_ow === 'cong-ty') return false;
return _ow === 'ca-nhan' || !!(S.settings && S.settings.get('install.mode', '') === 'personal');
}
const _od = {
get deviceId() { return S.api.deviceId; },
isLoggedIn: () => S.api.hasValidToken(),
lock: () => S.auth.lock(),
logout: () => _ot(),
strength
};
function _ov(st) {
const _o2c = pendingPackage(st, { src: backupSource(st, config) });
download(pendingFileName(), JSON.stringify(_o2c), 'application/json');
}
async function _o1l(st) {
try {
if (!st) { st = createStore({ api: S.api }); await st.open(); }
const n = pendingCount(st);
if (!n) return false;
setTimeout(() => { pendingDialog({ ui, n, kind: 'kept', download: () => _ov(st) }).catch(() => {}); }, 0);
return true;
} catch (e) { errors.report('warn', 'store.keep_pending', String(e && e.message || e)); return false; }
}
async function _o42() {
try {
const st = S.store || createStore({ api: S.api });
S.store = null;
await st.open();
await st.clear();
} catch (e) { errors.report('warn', 'store.wipe', String(e && e.message || e)); }
}
function _oo(info) {
const _o1b = (info || []).find((x) => x && x.object_id);
const _ox = toast(t(_o1b ? 'sync.conflict.kept' : 'sync.conflict'), 'warn', _o1b ? 9000 : 4500);
if (!_o1b || !_ox) return;
_ox.appendChild(button(t('sync.conflict.view'), (e) => { e.stopPropagation(); location.hash = '#/customers?open=' + encodeURIComponent(_o1b.object_id); _ox.remove(); },
{ kind: 'ghost', small: true, icon: 'eye', testid: 'conflict-view' }));
}
async function _oz({ ownerName, ownerPhone } = {}) {
const _o1r = () => createStore({
api: S.api, intervalMs: config.SYNC_INTERVAL_MS || 30000,
onConflict: (n, info) => _oo(info),
onRejected: (rej) => toast(rejectionMessage(rej) || t('sync.rejected'), 'error', 9000),
onError: errors.report
});
if (S.store) S.store.stop();
S.store = _o1r();
await S.store.open();
const uid = S.user && S.user.id ? String(S.user.id) : '';
if (uid && S.store.userId !== uid) {
if (S.store.userId) {
const n = pendingCount(S.store);
if (n && (await pendingDialog({ ui, n, kind: 'other', download: () => _ov(S.store) })) !== 'wipe') {
S.store.stop(); try { await S.auth.logout(); } catch { } S.api.clearSession(); showLogin(); return false;
}
await S.store.clear(); S.store = _o1r(); await S.store.open();
}
await S.store.setUser(uid);
}
S.settings = createSettings(S.store);
await S.settings.init();
if (String((S.status && S.status.edition) || '') === 'cong-ty' || S.settings.get('install.mode', '') === 'company') addWords({ 'role.owner': 'Quản trị (Admin)' });
if (ownerName && !(S.settings.get('profile') || {}).name) await S.settings.set('profile', { ...(S.settings.get('profile') || {}), name: ownerName });
if (ownerPhone && !(S.settings.get('profile') || {}).phone) await S.settings.set('profile', { ...(S.settings.get('profile') || {}), phone: ownerPhone });
S.ai = createAI({ api: S.api, settings: S.settings, ui, config });
{ const _of = S.ai.availability; S.ai.availability = () => { const r = _of(); return S.user && S.user.perms && S.user.perms.ai === false ? { ...r, gemini: false, claude: false, ollama: false, any: false } : r; }; }
S.users = createUsersApi({ api: S.api, store: S.store, ui, getUser: () => S.user });
S.packs = createPacks({ settings: S.settings, getPack: () => S.pack, isOwner: () => !S.user || !S.user.role || S.user.role === 'owner', userId: () => (S.user && S.user.id) || '' });
S.packs.on(_o22);
setTimeout(() => { try { S.packs.takeReadyNotices().forEach((_or) => toast(PACK_WORDS['xpack.notify.ready'].replace('{p}', _or.title), 'ok', 6000)); } catch { } }, 2500);
S.video = createVideoScreens({ settings: S.settings, prefs, getPack: () => S.pack, isOwner: () => !S.user || !S.user.role || S.user.role === 'owner', userId: () => (S.user && S.user.id) || '' , config, packOn: (id) => !!S.packs && S.packs.enabled(id) });
S.video.on(() => { _ob(); _o22(); });
_ob();
S.baseGuard = (e) => allowedBy(e.manifest, S.user && S.user.perms) && screenAllowed(e.manifest.screen, S.user && S.user.perms) && featureAllowed(e.id, S.user && S.user.perms) && S.packs.moduleOn(e.id)
&& !(e.manifest.company && _o3d());
S.registry.setGuard((e) => S.baseGuard(e) && !S.video.moduleHidden(e.id));
_o1g();
S.registry.add({ id: 'settings', manifest: { id: 'settings', title: t('screen.settings'), icon: 'settings', screen: 'settings', order: 0, version: config.APP_VERSION, status: 'ready' }, mod: { mount: (_ox, ctx) => mountSettings(_ox, ctx, appHooks) } });
_o2j();
S.shellReady = true;
const _o14 = S.store.status().lastSync ? null : await import('./firstload.ddb87ae4d3.js').then((m) => m.showFirstLoad({ ui, store: S.store, config,
versions: { web: config.APP_VERSION, server: (S.status && S.status.version) || '', edition: config.edition || '' }, errors: () => errors.recent() })).catch(() => null);
mountTo(document.getElementById('view'), h('div', { class: 'loading' }, ui.spinner(), h('span', null, t('common.loading'))));
await S.registry.load(ctxFor, { skip: _o25 });
if (_o14) _o14.mark('screens');
try { installExtras({ S, appHooks, ctxFor, nav, config }); } catch (e) { errors.report('warn', 'extras.install', String(e && e.message || e), e && e.stack); }
try {
ensureCss(new URL('./feedback.9e6ba9ac37.css', import.meta.url).href, 'bds-feedback-css');
if (S.whatsNew) S.routeSubs.delete(S.whatsNew.onRoute);
if (S.feedback) S.feedback.stop();
S.whatsNew = installWhatsNew({ S, appHooks, ui, config });
S.feedback = installFeedback({ S, appHooks, ui, config, t });
} catch (e) { errors.report('warn', 'feedback.install', String(e && e.message || e), e && e.stack); }
try { if (S.selfHeal) S.selfHeal.stop(); S.selfHeal = installSelfHeal({ S, appHooks, ui, config, nav }); } catch (e) { errors.report('warn', 'selfheal.install', String(e && e.message || e), e && e.stack); }
try { if (S.license) S.license.stop(); S.license = installLicense({ S, appHooks, ui, config, nav, onChange: _o22 }); } catch (e) { errors.report('warn', 'license.install', String(e && e.message || e), e && e.stack); }
try { S.archive = installArchive({ S, appHooks, ui }); } catch (e) { errors.report('warn', 'archive.install', String(e && e.message || e), e && e.stack); }
try { if (S.cheers) S.cheers.stop(); S.cheers = installCheers({ S, appHooks, ui }); } catch (e) { errors.report('warn', 'cheers.install', String(e && e.message || e), e && e.stack); }
try { if (S.vm) S.vm.stop(); S.vm = videoOffered(config) || S.video.offered() ? installVideoMachine({ S, ui }) : null; } catch (e) { errors.report('warn', 'vm.install', String(e && e.message || e), e && e.stack); }
if (wizardEnabled({ config })) { try { S.wizard = (await import('./wizard/index.js')).installWizard({ S, appHooks, ui, config, nav }); } catch (e) { errors.report('warn', 'wizard.install', String(e && e.message || e), e && e.stack); } }
S.auth.startIdle();
S.store.start().then((st) => {
if (_o14) { if (st && !st.lastSync) _o14.fail(st.error ? String(st.error) : 'chưa kết nối được máy chủ – kiểm tra mạng rồi tải lại trang'); else _o14.done(); }
errors.flush();
if (S.store && S.store.status().lastSync && S.packs) S.packs.migrate().catch((e) => errors.report('warn', 'packs.migrate', String(e && e.message || e)));
});
try {
let setupDone = true;
try { const _o44 = S.wizard && typeof S.wizard.state === 'function' ? S.wizard.state() : null; setupDone = !_o44 || !!_o44.dismissed || !!_o44.finished; } catch { setupDone = true; }
S.pwaHint = installPwaHint({ ui, setupDone }); if (S.pwaHint) S.pwaHint.attach(document.querySelector('#app .main'));
} catch (e) { errors.report('warn', 'pwa.hint', String(e && e.message || e)); }
window.addEventListener('hashchange', route);
route();
setTimeout(() => { if (S.shellReady && S.video) S.video.checkEngine({ ui, config }).catch(() => { }); }, 1500);
_o2g();
}
function _o3l() {
window.removeEventListener('hashchange', route);
if (S.vm) { S.vm.stop(); S.vm = null; }
S.auth.stopIdle();
if (S.store) S.store.stop();
closeSheet();
if (S.lockEl) { S.lockEl.remove(); S.lockEl = null; }
S.shellReady = false; S.mounted = null; S.current = null;
}
const _o0 = 'bds:show-connect';
function _o3k() {
try { const v = sessionStorage.getItem(_o0); if (v) sessionStorage.removeItem(_o0); return !!v; } catch { return false; }
}
async function disconnectServer() {
const _o40 = await _o3w();
if (_o40 && !(await ui.confirm(_o40.message.replace(/Đăng xuất bây giờ/g, 'Ngắt máy chủ bây giờ').replace(/hẵng đăng xuất/g, 'hẵng ngắt'), { ok: _o40.ok.replace('Đăng xuất', 'Ngắt máy chủ'), kind: 'danger', title: _o40.title }))) return false;
_o3l();
try { await S.auth.logout(); } catch { }
await _o42();
S.api.clearSession();
saveScriptUrl(null);
try { sessionStorage.setItem(_o0, '1'); } catch { }
location.replace(location.pathname + location.search);
}
async function _o3w() {
const st = S.store;
if (!st || typeof st.status !== 'function') return null;
let n = 0;
try { n = Number(st.status().pending) || 0; } catch { return null; }
const _o1n = S.license && typeof S.license.state === 'function' ? S.license.state() : null;
const readonly = !!(_o1n && _o1n.readonly);
if (n && !readonly && typeof st.syncNow === 'function') {
try { await Promise.race([st.syncNow(), new Promise((r) => setTimeout(r, 8000))]); n = Number(st.status().pending) || 0; } catch { }
}
return unsentWarning(n, { readonly });
}
async function _ot(skipConfirm) {
const _o40 = await _o3w();
if (_o40) {
const ok = await ui.confirm(_o40.message, { ok: _o40.ok, kind: 'danger', title: _o40.title });
if (!ok) return;
} else if (!skipConfirm) { const ok = await ui.confirm(t('auth.logout.confirm'), { ok: t('auth.logout'), kind: 'danger', title: t('auth.logout') }); if (!ok) return; }
_o3l();
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
setDensityDefault(v) { for (const _o2n of SCREENS) try { localStorage.removeItem('density:' + _o2n); } catch { } _oa(S.route ? S.route.screen : 'home', v); },
restartIdle() { S.auth.startIdle(); },
lockNow() { S.auth.lock(); },
logout: () => _ot(),
disconnectServer: () => disconnectServer(),
async swVersion() {
try {
const _ok = navigator.serviceWorker && navigator.serviceWorker.controller;
if (_ok) {
const v = await new Promise((res) => {
const _om = new MessageChannel(); const _o3n = setTimeout(() => res(null), 1500);
_om.port1.onmessage = (e) => { clearTimeout(_o3n); res(e.data && e.data.version); };
_ok.postMessage({ type: 'version' }, [_om.port2]);
});
if (v) return v;
}
const _o3u = await (await fetch('sw.js', { cache: 'no-cache' })).text();
const m = _o3u.match(/VERSION\s*=\s*['"]([^'"]+)['"]/);
return m ? m[1] + (_ok ? '' : ' (chưa cài)') : null;
} catch { return null; }
},
async checkUpdate() {
try {
const _o2f = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
if (!_o2f) return 'none';
await _o2f.update();
return _o2f.waiting ? 'ready' : 'latest';
} catch { return 'none'; }
},
async applyUpdate() {
const _o2f = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
if (_o2f && _o2f.waiting) {
navigator.serviceWorker.addEventListener('controllerchange', () => location.reload(), { once: true });
_o2f.waiting.postMessage({ type: 'skipWaiting' });
} else location.reload();
}
};
function _o2g() {
if (!('serviceWorker' in navigator) || _o2a.has('nosw') || location.port === '5173') return;
navigator.serviceWorker.register('sw.js').then((_o2f) => {
if (!_o2f || typeof _o2f.addEventListener !== 'function') return;
_o2f.addEventListener('updatefound', () => {
const _o40 = _o2f.installing;
_o40 && _o40.addEventListener('statechange', () => {
if (_o40.state === 'installed' && navigator.serviceWorker.controller) toast(t('set.version.ready'), 'info', 6000);
});
});
}).catch((e) => errors.report('warn', 'sw.register', String(e && e.message || e)));
}
function _o1v(_o2n) { return hasWord('nav.' + _o2n) ? t('nav.' + _o2n) : t('screen.' + _o2n); }
function _o1u(_o2t) {
return _o2t.map((_o2n) => h('a', { href: '#/' + _o2n, class: 'nav-item', dataset: { screen: _o2n }, 'data-testid': 'nav-' + _o2n },
h('span', { class: 'nav-ico' }, icon(_o3[_o2n], 23)), h('span', { class: 'nav-label' }, h('span', { class: 'nav-label-short' }, _o1v(_o2n)), h('span', { class: 'nav-label-full' }, t('screen.' + _o2n)))));
}
const _o25 = (id) => (!!S.packs && !S.packs.moduleOn(id)) || (!!S.video && S.video.moduleHidden(id));
function _o2s(_o2n) {
if (!S.packs || _o2n === 'home' || _o2n === 'settings') return true;
const _o1s = packModules(S.pack || {});
const _o2r = (id) => { const e = S.registry.get(id); return e && e.mod ? e.manifest.screen : ((_o1s.find((m) => m.id === id) || {}).meta || {}).screen; };
if (S.video && S.video.screenAllHidden(_o1s.map((m) => m.id).filter((id) => _o2r(id) === _o2n))) return false;
if (!screenPermitted(_o1s.map((m) => m.id).filter((id) => _o2r(id) === _o2n), S.user && S.user.perms)) return false;
return S.packs.screenOn(_o2n, _o1s.map((m) => m.id), _o2r);
}
function _ob() {
const _o20 = !!(S.video && S.video.hidden()) || !!(S.user && S.user.perms && S.user.perms.video === false)
|| !!(S.packs && !S.packs.moduleOn('video'));
if (_o20 && !S.videoWordsOrig) { S.videoWordsOrig = Object.fromEntries(Object.keys(VIDEO_OFF_WORDS).map((k) => [k, t(k)])); addWords(VIDEO_OFF_WORDS); }
else if (!_o20 && S.videoWordsOrig) { addWords(S.videoWordsOrig); S.videoWordsOrig = null; }
}
function _o1g() {
if (S.videoEvents) return;
S.videoEvents = true;
window.addEventListener(VIDEO_EVENT, (_o11) => {
if (!S.video) return;
S.video.fromWizard(_o11 && _o11.detail).catch((e) => errors.report('warn', 'video.screens', String(e && e.message || e)));
});
}
function _o3c() { return visibleScreens(S.user && S.user.perms, SCREENS).filter(_o2s); }
function _o26() {
const box = document.querySelector('.nav .nav-items'); if (!box) return;
const _ou = new Set([...box.querySelectorAll('.nav-item.has-dot')].map((_o5) => _o5.dataset.screen));
const _o2t = _o3c();
box.style.setProperty('--nav-n', String(_o2t.length));
mountTo(box, _o1u(_o2t));
for (const _o5 of box.querySelectorAll('.nav-item')) {
const on = !!S.route && _o5.dataset.screen === S.route.screen;
_o5.classList.toggle('on', on); _o5.classList.toggle('has-dot', _ou.has(_o5.dataset.screen));
if (on) _o5.setAttribute('aria-current', 'page');
}
}
async function _o22() {
if (!S.shellReady) return;
_ob();
if (!S.vm && S.video && S.video.offered()) { try { S.vm = installVideoMachine({ S, ui }); } catch (e) { errors.report('warn', 'vm.install', String(e && e.message || e), e && e.stack); } }
try { await S.registry.ensure(ctxFor, { skip: _o25 }); } catch (e) { errors.report('warn', 'packs.ensure', String(e && e.message || e)); }
_o26();
const r = S.route; if (!r) return;
if (!_o2s(r.screen)) { nav('home'); return; }
const _oq = r.module ? S.registry.get(r.module) : null;
const pending = _oq && S.registry.allowed(_oq) && _oq.state === 'ready' && S.mounted !== _oq;
if (pending && S.building && S.building.id === _oq.id) { try { S.building.m.close(); } catch { } S.building = null; }
if (!r.module || (_oq && !S.registry.allowed(_oq)) || pending) { S.current = null; route(); }
}
function _o2j() {
const root = document.getElementById('app');
root.className = 'app app-shell';
const _o2t = _o3c();
const _o1t = _o1u(_o2t);
const syncDot = h('button', { type: 'button', class: 'sync', id: 'sync-dot', 'data-testid': 'sync-dot', 'aria-label': t('sync.ok') }, h('span', { class: 'sync-dot' }), h('span', { class: 'sync-text' }));
syncDot.addEventListener('click', async () => { const _o2n = await S.store.syncNow(); toast(_o3j(_o2n), _o2n.online ? (_o2n.pending ? 'warn' : 'ok') : 'info'); });
const densitySeg = segmented([{ value: 'compact', label: t('common.compact'), icon: 'layout' }, { value: 'detail', label: t('common.detail'), icon: 'log' }], 'compact',
(v) => { const _o2q = S.route ? S.route.screen : 'home'; setDensityFor(_o2q, v); _oa(_o2q, v); _o2h(); }, { label: t('common.detail'), name: 'density' });
densitySeg.classList.add('seg-sm');
densitySeg.setAttribute('data-testid', 'density');
const backBtn = button('', () => nav(S.route ? S.route.screen : 'home'), { kind: 'ghost', icon: 'back', title: t('common.back'), cls: 'top-back', id: 'top-back' });
const helpBtn = h('button', { type: 'button', class: 'help-btn help-top', id: 'top-help', 'aria-label': t('common.help'), title: t('common.help') }, icon('help', 18));
helpBtn.addEventListener('click', _o30);
const lockBtn = button('', () => S.auth.lock(), { kind: 'ghost', icon: 'lock', title: t('auth.lock.now'), cls: 'top-lock', id: 'top-lock' });
const _o6 = h('button', { type: 'button', class: 'nav-user', id: 'nav-user', 'aria-haspopup': 'menu', 'aria-expanded': 'false', 'aria-label': t('acct.menu') });
_o6.addEventListener('click', () => _o3p(_o6));
const _o7 = h('button', { type: 'button', class: 'top-account', id: 'top-account', 'data-testid': 'top-account', 'aria-haspopup': 'menu', 'aria-expanded': 'false', 'aria-label': t('acct.menu') });
_o7.addEventListener('click', () => _o3p(_o7));
mountTo(root,
_o2l(),
h('div', { class: 'frame' },
h('nav', { class: 'nav', 'aria-label': t('app.name') },
h('a', { class: 'nav-brand', href: '#/home' }, h('img', { src: 'assets/icon.svg', alt: '', width: 36, height: 36 }),
h('span', { class: 'nav-brand-text' }, h('strong', null, t('app.name')), h('small', null, t('app.tagline')))),
h('div', { class: 'nav-items', style: { '--nav-n': String(_o2t.length) } }, _o1t),
h('div', { class: 'nav-foot' }, _o6)),
h('div', { class: 'main' },
h('header', { class: 'topbar' },
backBtn,
h('div', { class: 'top-titles' }, h('h1', { class: 'top-title', id: 'top-title' }), h('p', { class: 'top-sub', id: 'top-sub' })),
h('div', { class: 'top-actions' }, syncDot, densitySeg, helpBtn, lockBtn, _o7)),
h('div', { class: 'panes' },
h('main', { class: 'view', id: 'view', tabindex: '-1' }),
h('div', { class: 'detail', id: 'detail' })))));
if (S.pwaHint) S.pwaHint.attach(root.querySelector('.main'));
S.densitySeg = densitySeg;
S.store.onStatus(_o28);
_o29();
S.settings.on('profile', _o29);
}
function _o29() {
const _ox = document.getElementById('nav-user'); if (!_ox) return;
const p = S.settings.get('profile', {}) || {};
const _o3v = S.user;
const name = (_o3v && !_o3v.legacy && _o3v.full_name) || p.name || (_o3v && _o3v.full_name) || prefs.get('owner_name', '') || (_o3v && _o3v.username) || '';
const sub = [_o3v ? roleLabel(_o3v.role) : '', p.title].filter(Boolean).join(' · ');
_ox.dataset.role = _o3v ? _o3v.role : '';
_ox.setAttribute('data-testid', 'nav-user');
_ox.title = t('acct.menu');
mountTo(_ox, h('span', { class: 'avatar' }, (name || '•').trim().charAt(0).toUpperCase()),
h('span', { class: 'nav-user-text' }, h('strong', null, name || t('set.profile')), sub ? h('small', null, sub) : null),
h('span', { class: 'nav-user-more', 'aria-hidden': 'true' }, '⋯'));
const top = document.getElementById('top-account');
if (top) { top.dataset.role = _ox.dataset.role; mountTo(top, h('span', { class: 'avatar avatar-sm' }, (name || '•').trim().charAt(0).toUpperCase())); }
}
function _o3p(anchor) {
const open = document.querySelector('.acct-menu');
if (open) { open._close(); if (open._anchor === anchor) return; }
const _o3v = S.user || {};
const p = S.settings.get('profile', {}) || {};
const name = (!_o3v.legacy && _o3v.full_name) || p.name || _o3v.full_name || prefs.get('owner_name', '') || _o3v.username || '';
const _o1j = (label, ic, fn, testid, cls) => h('button', { type: 'button', role: 'menuitem', class: ['acct-item', cls], 'data-testid': testid, onclick: () => { close(); fn(); } }, icon(ic, 18), h('span', null, label));
const _o1q = h('div', { class: 'acct-menu', role: 'menu', 'aria-label': t('acct.menu'), 'data-testid': 'acct-menu' },
h('div', { class: 'acct-head' },
h('span', { class: 'avatar avatar-sm' }, (name || '•').trim().charAt(0).toUpperCase()),
h('span', { class: 'acct-who' }, h('strong', null, name || t('set.profile')), h('small', null, [_o3v.username ? '@' + _o3v.username : '', _o3v.role ? roleLabel(_o3v.role) : ''].filter(Boolean).join(' · ')))),
_o1j(t('acct.settings'), 'user', () => nav('settings/security'), 'acct-settings'),
_o1j(t('auth.lock.now'), 'lock', () => S.auth.lock(), 'acct-lock'),
_o1j(t('auth.logout'), 'logout', () => _ot(), 'acct-logout', 'acct-danger'));
document.body.appendChild(_o1q);
const r = anchor.getBoundingClientRect();
const _o40 = Math.min(260, window.innerWidth - 24);
_o1q.style.width = _o40 + 'px';
_o1q.style.left = Math.max(12, Math.min(window.innerWidth - _o40 - 12, r.left)) + 'px';
if (r.top > window.innerHeight / 2) _o1q.style.bottom = (window.innerHeight - r.top + 8) + 'px';
else _o1q.style.top = (r.bottom + 8) + 'px';
anchor.setAttribute('aria-expanded', 'true');
const onDoc = (e) => { if (!_o1q.contains(e.target) && !anchor.contains(e.target)) close(); };
const onKey = (e) => { if (e.key === 'Escape') { close(); anchor.focus(); } };
function close() {
_o1q.remove(); anchor.setAttribute('aria-expanded', 'false');
document.removeEventListener('mousedown', onDoc, true); document.removeEventListener('touchstart', onDoc, true); document.removeEventListener('keydown', onKey, true);
window.removeEventListener('hashchange', close);
}
_o1q._close = close; _o1q._anchor = anchor;
document.addEventListener('mousedown', onDoc, true); document.addEventListener('touchstart', onDoc, true); document.addEventListener('keydown', onKey, true);
window.addEventListener('hashchange', close);
const _o14 = _o1q.querySelector('.acct-item'); if (_o14) _o14.focus({ preventScroll: true });
}
function _o41() {
const _o3v = S.user; if (!_o3v) return null;
const p = S.settings.get('profile', {}) || {};
const name = (!_o3v.legacy && _o3v.full_name) || p.name || _o3v.full_name || _o3v.username;
return h('div', { class: 'whoami', 'data-testid': 'whoami', dataset: { role: _o3v.role } },
h('span', { class: 'avatar avatar-sm' }, (name || '•').trim().charAt(0).toUpperCase()),
h('span', { class: 'whoami-text' }, h('strong', null, name), h('small', null, '@' + _o3v.username)),
ui.badge(roleLabel(_o3v.role), ROLE_TONE[_o3v.role] || 'neutral'));
}
function _o3j(_o2n) {
if (!_o2n.online) return t('sync.offline');
if (_o2n.syncing) return t('sync.syncing');
if (_o2n.pending) return t('sync.pending', { n: _o2n.pending });
return _o2n.lastSync ? t('sync.ok') + ' · ' + new Date(_o2n.lastSync).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : t('sync.never');
}
function _o27(p) {
let box = document.getElementById('pull-progress');
if (!p || !p.total) { if (box) box.remove(); return; }
const done = Math.min(p.done, p.total), pct = Math.round(done / p.total * 100);
const label = 'Đang tải dữ liệu về máy lần đầu: ' + done.toLocaleString('vi-VN') + ' / ' + p.total.toLocaleString('vi-VN') + ' dòng';
if (!box) { box = h('div', { id: 'pull-progress', class: 'pull-progress', role: 'status', 'aria-live': 'polite', 'data-testid': 'pull-progress' }); document.body.appendChild(box); }
mountTo(box, h('span', { class: 'small' }, label), progress(pct, label));
}
function _o28(_o2n) {
const _ox = document.getElementById('sync-dot'); if (!_ox) return;
const _o3q = !_o2n.online ? 'off' : _o2n.pending || _o2n.syncing ? 'pending' : 'ok';
_ox.dataset.state = _o3q;
_ox.setAttribute('aria-label', _o3j(_o2n)); _ox.title = _o3j(_o2n);
_ox.querySelector('.sync-text').textContent = !_o2n.online ? 'Mất mạng' : _o2n.pending ? String(_o2n.pending) : '';
_o27(_o2n.pull);
if (_o28.online === undefined) _o28.online = true;
if (!!_o2n.online !== _o28.online) {
_o28.online = !!_o2n.online;
toast(_o2n.online ? (_o2n.pending ? 'Đã có mạng lại – đang gửi ' + _o2n.pending + ' thay đổi lên máy chủ.' : 'Đã có mạng lại.') : 'Đang ngoại tuyến – vẫn xem và sửa được, thay đổi giữ trên máy và tự gửi khi có mạng.', _o2n.online ? 'ok' : 'warn', 6000);
}
}
function _oa(screen, v) {
const _or = v || densityFor(screen);
document.body.dataset.density = _or;
if (S.densitySeg) S.densitySeg.setValue(_or);
}
function _o30() {
const r = S.route || {};
const entry = r.module ? S.registry.get(r.module) : null;
let text = '';
if (entry) {
const _o1c = entry.manifest.help;
text = _o1c && hasWord('help.' + _o1c) ? t('help.' + _o1c) : (_o1c || (hasWord('help.' + entry.id) ? t('help.' + entry.id) : ''));
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
function _o2h() { if (S.route && S.route.module) { S.current = null; route(); } }
async function route() {
if (!S.shellReady) return;
const r = parseHash(location.hash);
if (!screenAllowed(r.screen, S.user && S.user.perms) || !_o2s(r.screen)) { nav('home'); return; }
if (!r.module && [...r.query.keys()].length) {
const _o2e = S.registry.byScreen(r.screen).find((e) => e.state === 'ready');
if (_o2e) r.module = _o2e.id;
}
const key = r.screen + '/' + r.module + '/' + r.sub + '?' + r.query.toString();
if (S.current === key) return;
S.current = key; S.route = r;
closeSheet();
if (S.mounted && S.mounted.mod && typeof S.mounted.mod.unmount === 'function') { try { S.mounted.mod.unmount(); } catch { } }
S.mounted = null;
for (const _o5 of document.querySelectorAll('.nav-item')) {
const on = _o5.dataset.screen === r.screen;
_o5.classList.toggle('on', on);
if (on) _o5.setAttribute('aria-current', 'page'); else _o5.removeAttribute('aria-current');
}
_oa(r.screen);
const root = document.getElementById('app');
root.dataset.screen = r.screen;
const _o3z = document.getElementById('view');
clear(_o3z);
_o3z.classList.remove('enter'); void _o3z.offsetWidth; _o3z.classList.add('enter');
let entry = r.module ? S.registry.get(r.module) : null;
if (entry && S.video && S.video.moduleHidden(entry.id) && S.baseGuard && S.baseGuard(entry)) {
root.classList.add('in-module');
_o2v(entry.manifest.title, t('screen.' + r.screen), t('screen.' + r.screen + '.sub'));
mountTo(_o3z, S.video.hiddenCard(ui, { nav, title: entry.manifest.title }));
S.routeSubs.forEach((cb) => { try { cb(r); } catch { } });
return;
}
if (entry && !S.registry.allowed(entry)) entry = null;
root.classList.toggle('in-module', !!entry);
if (entry && entry.state === 'ready' && entry.mod) {
_o2v(entry.manifest.title, t('screen.' + r.screen), t('screen.' + r.screen + '.sub'));
const host = h('div', { class: 'module-host', dataset: { module: entry.id } });
const beta = S.packs && S.packs.moduleBeta ? S.packs.moduleBeta(entry.id) : null;
if (beta) _o3z.appendChild(betaBar(ui, beta, (_o1z) => (typeof appHooks.openFeedback === 'function' ? appHooks.openFeedback(_o1z) : nav('settings/feedback'))));
_o3z.appendChild(host);
S.mounted = entry;
try { await entry.mod.mount(host, ctxFor(entry)); } catch (e) {
errors.report('warn', 'mount:' + entry.id, String(e && e.message || e), e && e.stack);
mountTo(host, ui.empty(t('module.error')));
}
S.routeSubs.forEach((cb) => { try { cb(r); } catch { } });
return;
}
if (entry && entry.state !== 'ready') _o2y(entry);
_o2i(_o3z, r.screen);
S.routeSubs.forEach((cb) => { try { cb(r); } catch { } });
}
function _o2v(title, sub, alt) {
const _o2p = (_o5, b) => String(_o5 || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
if (_o2p(title, sub)) sub = alt && !_o2p(title, alt) ? alt : '';
const _o3t = document.getElementById('top-title'); const _o3s = document.getElementById('top-sub');
if (_o3t) _o3t.textContent = title || ''; if (_o3s) { _o3s.textContent = sub || ''; _o3s.hidden = !sub; }
}
function _o3o() { return vnDayText(); }
function _o2i(_o3z, screen) {
_o2v(t('screen.' + screen), t('screen.' + screen + '.sub'));
const _o1s = S.registry.byScreen(screen);
const p = S.settings.get('profile', {}) || {};
const _o3g = S.user && S.user.role && S.user.role !== 'owner';
const name = String((_o3g ? S.user.full_name || S.user.username : p.name || prefs.get('owner_name', '')) || '').trim();
const _o1a = h('section', { class: 'hero hero-' + screen },
h('div', { class: 'hero-text' },
h('p', { class: 'hero-kicker' }, screen === 'home' ? _o3o() : _o1v(screen)),
h('h2', { class: 'hero-title' }, screen === 'home' ? greeting(name) : t('screen.' + screen)),
h('p', { class: 'hero-sub' }, t('screen.' + screen + '.sub'))),
h('div', { class: 'hero-mark', 'aria-hidden': 'true' }, icon(_o3[screen], 40)));
const _o3i = screen === 'home' ? tileModules(_o1s).find((e) => e.state === 'ready' && e.mod && typeof e.mod.summary === 'function') : null;
const _o3b = tileModules(_o1s);
const _o18 = h('div', { class: 'tiles', 'data-testid': 'tiles-' + screen }, _o3b.map((e) => _o3m(e, e === _o3i ? { title: t('home.full'), desc: t('home.full.desc') } : null)));
const parts = [_o1a];
if (_o3i) {
const host = h('div', { class: 'home-summary-host module-host', dataset: { module: _o3i.id } });
parts.push(host);
Promise.resolve().then(() => _o3i.mod.summary(host, ctxFor(_o3i))).catch((e) => errors.report('warn', 'summary:' + _o3i.id, String(e && e.message || e), e && e.stack));
}
if (_o3b.length) parts.push(_o18);
else if (screen !== 'settings') parts.push(ui.empty(t('module.none')));
if (screen === 'settings') {
const box = h('div', { class: 'settings-host' });
const who = _o41(); if (who) parts.push(who);
parts.push(box);
mountSettings(box, ctxFor(S.registry.get('settings')), appHooks).catch((e) => errors.report('warn', 'settings.mount', String(e && e.message || e), e && e.stack));
}
mountTo(_o3z, ...parts);
}
function _o3m(entry, alt) {
const m = alt ? { ...entry.manifest, ...alt } : entry.manifest;
const _o20 = entry.state !== 'ready';
const desc = m.desc || (m.help && !hasWord('help.' + m.help) ? m.help : '');
const _o3r = !_o20 && !!S.packs && S.packs.moduleTrial(entry.id);
const _ox = h('a', {
href: '#/' + m.screen + '/' + entry.id,
class: ['tile', _o20 && 'is-building', entry.state === 'error' && 'is-error'],
dataset: { module: entry.id, state: entry.state }, 'data-testid': 'tile-' + entry.id,
'aria-description': _o20 ? t('module.building') : null
},
h('span', { class: 'tile-ico' }, glyph(m.icon, 26)),
h('span', { class: 'tile-text' },
h('span', { class: 'tile-title' }, m.title),
_o3r ? h('span', { class: 'tile-badge tile-trial', 'data-testid': 'tile-trial-' + entry.id }, PACK_WORDS['xpack.st.trial']) : null,
_o20 ? h('span', { class: 'tile-badge' }, t('module.building')) : (desc ? h('span', { class: 'tile-desc' }, desc) : null),
_o20 ? h('span', { class: 'tile-prog' }, progress(m.progress), h('span', { class: 'tile-meta num' }, t('module.progress', { p: m.progress }) + (m.eta ? ' · ' + t('module.eta', { eta: m.eta }) : ''))) : null),
h('span', { class: 'tile-chev' }, icon('next', 18)));
if (_o20) _ox.addEventListener('click', (e) => { e.preventDefault(); _o2y(entry); });
return _ox;
}
function _o2y(entry) {
const m = entry.manifest;
S.building = { id: entry.id, m: modal({
title: m.title,
body: h('div', { class: 'building', 'data-testid': 'building-modal' },
h('div', { class: 'building-ico' }, glyph(m.icon, 34)),
h('p', { class: 'lead' }, t('module.building')),
h('p', { class: 'muted' }, t('module.building.lead')),
progress(m.progress),
h('p', { class: 'num building-meta' }, t('module.progress', { p: m.progress }) + (m.eta ? ' · ' + t('module.eta', { eta: m.eta }) : ''))),
actions: [{ label: t('common.close'), kind: 'primary' }]
}) };
}
window.__bds = { S, errors, parseHash, ui };
_oh().catch((e) => {
errors.report('critical', 'boot', String(e && e.message || e), e && e.stack);
const root = document.getElementById('app');
mountTo(root, h('main', { class: 'auth' }, h('div', { class: 'auth-card' }, h('h1', { class: 'auth-title' }, t('err.generic')),
button(t('common.retry'), () => location.reload(), { kind: 'primary', block: true }))));
});

import { ensureCss, ls } from '../xkit.71d637c634.js';
import { createApi, saveScriptUrl, scriptUrl } from '../api.c33f2ebbc5.js';
import { EXEC_URL_RE, isExecUrl } from '../exec_url.4b6ba956ed.js';
import { API_SETTINGS_URL, verifiedReleaseFiles, publicBase } from '../updates.4992b5e758.js';
import { publicUrl, releaseOrigin } from '../instance.ffcba07fb7.js';
import * as M from './machine.js';
import { makeChecks, browserEnv, browserProblems, normHost } from './checks.js';
import { diagnosticData, diagnosticText, handoverData } from './report.js';
import * as Samples from './samples.js';
import { mountWizard } from './view.js';
import { wizardEnabled } from './flag.js';
import * as onb from '../onboarding.38818cd6f0.js';
import { FLOW_LABEL, isSaleEdition } from './steps.js';
import { NOT_REAL_TEXT } from './view.js';
import { confirmLeaveDemo } from './demodata.js';
import { isPortal, clearPortalData, takeHandoff, clearUrl } from '../portal.e2b6a918c3.js';
import { createProvisionClient, handoffUrl, pickInstallToken, PAGES_PREFIX, defaultAddressInfo, requestTicket, requestWish } from './provision.js';
import { parseToken } from '../license_logic.3b3437c32e.js';
import { finishCard } from '../a2hs.1403f674ce.js';
import { doinguCheck } from './doingu.js';
import { setupToken } from '../setup_gate.d66104e8e0.js';
import { engineDownload } from '../engine_dl.18c8a720c5.js';
export const STATE_KEY = 'bds:wizard';
export const SECTION = 'wizard';
const _o0 = 'bds:errlog';
export { wizardEnabled, FLAG_KEY } from './flag.js';
export function loadState() { return M.normalize(ls.get(STATE_KEY, null)); }
export function saveState(s) { if (s) ls.set(STATE_KEY, s); else ls.set(STATE_KEY, null); return s; }
export const INSTALLER = { tatca: 'downloads/TatCa.gs', caidat: 'downloads/CaiDat.gs', manifest: 'downloads/sheet/appsscript.json' };
export const PENDING_KEY = 'bds:wizard:may_chu';
export { EXEC_URL_RE };
export const LINK_PROBLEM_KEY = 'bds:wizard:may_chu_loi';
export const LINK_PROBLEM_TEXT = {
empty: 'Link từ Sheet chưa kèm địa chỉ máy chủ – máy chủ CHƯA được Triển khai.',
bad: 'Link từ Sheet kèm địa chỉ máy chủ sai dạng (không kết thúc bằng /exec).',
dev: 'Link từ Sheet kèm địa chỉ chạy thử (/dev) – chỉ người soạn mã mở được.'
};
export const LINK_PROBLEM_FIX = 'Trong Sheet: Tiện ích mở rộng › Apps Script → Triển khai → Tuỳ chọn triển khai mới (New deployment) → ⚙ Ứng dụng web → Thực thi: Tôi → Truy cập: Bất kỳ ai → Triển khai → Cho phép → Sao chép URL. '
+ 'Mục "Quản lý triển khai" trống là bình thường (bản sao Sheet không mang theo triển khai). Rồi bấm "Tôi đã triển khai xong" trong hộp của Sheet, hoặc dán URL vừa chép vào ô bên dưới.';
export function takeLinkProblem(storage = (typeof sessionStorage !== 'undefined' ? sessionStorage : null)) {
let v = '';
try { v = (storage && storage.getItem(LINK_PROBLEM_KEY)) || ''; if (v && storage) storage.removeItem(LINK_PROBLEM_KEY); } catch { v = ''; }
return Object.prototype.hasOwnProperty.call(LINK_PROBLEM_TEXT, v) ? v : '';
}
export function takePendingUrl(storage = (typeof sessionStorage !== 'undefined' ? sessionStorage : null)) {
let v = '';
try { v = (storage && storage.getItem(PENDING_KEY)) || ''; } catch { v = ''; }
return EXEC_URL_RE.test(v) ? v : '';
}
export const CONNECT_PARAMS = ['may_chu', 'ten', 'ten_mien', 'tu', 'luong', 'ma_cai'];
export function cleanConnectHref(href) {
let _o1o;
try { _o1o = new URL(String(href || '')); } catch { return ''; }
let _oa = false;
const _o17 = (_o1b) => _o1b.has('may_chu') || _o1b.has('ma_cai');
if (_o17(_o1o.searchParams)) for (const _ou of CONNECT_PARAMS) if (_o1o.searchParams.has(_ou)) { _o1o.searchParams.delete(_ou); _oa = true; }
const _o10 = /^#([^?]*)\?(.*)$/.exec(_o1o.hash || '');
if (/^#\/ket-noi(\?|$)/.test(_o1o.hash || '')) { _o1o.hash = '#/home'; _oa = true; }
else if (_o10 && _o17(new URLSearchParams(_o10[2]))) {
const _o1b = new URLSearchParams(_o10[2]);
let _on = false;
for (const _ou of CONNECT_PARAMS) if (_o1b.has(_ou)) { _o1b.delete(_ou); _on = true; }
if (_on) { const rest = _o1b.toString(); _o1o.hash = '#' + _o10[1] + (rest ? '?' + rest : ''); _oa = true; }
}
return _oa ? _o1o.pathname + _o1o.search + _o1o.hash : '';
}
export function scrubConnectUrl(loc = (typeof location !== 'undefined' ? location : null), hist = (typeof history !== 'undefined' ? history : null)) {
if (!loc || !hist || typeof hist.replaceState !== 'function') return false;
const next = cleanConnectHref(loc.href);
if (!next) return false;
try { hist.replaceState(hist.state, '', next); return true; } catch { return false; }
}
export function clearPendingUrl(storage = (typeof sessionStorage !== 'undefined' ? sessionStorage : null)) { try { if (storage) storage.removeItem(PENDING_KEY); } catch { } }
const LINKS = (config) => ({
template: config.TEMPLATE_COPY_URL || '', sheetsNew: 'https://sheets.new', scriptApi: API_SETTINGS_URL, aistudio: 'https://aistudio.google.com/apikey',
telegramDownload: 'https://telegram.org/apps', engineZip: engineDownload().primary.path, engineZipOther: engineDownload().other.path
});
let _o1l = null;
let _os = null;
export function loadInstance(fetchFn = (_o1o, _o14) => fetch(_o1o, _o14), loc = (typeof location !== 'undefined' ? location : null)) {
if (!_os && !(loc && loc.protocol === 'https:' && !/^(127\.0\.0\.1|localhost)$/.test(loc.hostname))) _os = Promise.resolve(null);
if (!_os) _os = Promise.resolve().then(() => fetchFn('instance.json', { cache: 'no-store' })).then((_o1c) => (_o1c && _o1c.ok ? _o1c.json() : null))
.then((j) => (j && /^[a-z0-9-]{3,30}$/.test(String(j.slug || '')) ? { slug: j.slug, mode: j.mode || '', edition: j.edition || '', app_url: /^https:\/\//.test(String(j.app_url || '')) ? j.app_url : '', domains: Array.isArray(j.domains) ? j.domains.map(String) : [] } : null))
.catch(() => null);
return _os;
}
let _ok = null;
function _oy() {
if (!_ok) _ok = fetch('assets/wizard/google/index.json', { cache: 'no-cache' }).then((_o1c) => (_o1c.ok ? _o1c.json() : {})).catch(() => ({}));
return _ok;
}
let _o1 = { w: 1280, h: 800 }, SHOT_SIZE = { w: 390, h: 760 }, EXT_KEYS = new Set();
function sizeOf(j, def) { const w = Number(j && j.width), hh = Number(j && j.height); return w > 0 && hh > 0 ? { w, h: hh } : def; }
export function shotDims(_o1s, def) { const _o14 = sizeOf({ width: _o1s && (_o1s.w || _o1s.width), height: _o1s && (_o1s.h || _o1s.height) }, def); return { w: _o14.w, h: _o14.h }; }
function _oz() {
if (!_o1l) _o1l = fetch('assets/wizard/shots.json', { cache: 'no-cache' }).then((_o1c) => (_o1c.ok ? _o1c.json() : {})).then((j) => { SHOT_SIZE = sizeOf(j, SHOT_SIZE); EXT_KEYS = new Set(Object.keys(j.ext || {})); return { ...(j.shots || {}), ...(j.ext || {}) }; }).catch(() => ({}));
return _o1l;
}
function _od({ mode, ui, api, config, auth = null, appHooks = {}, store = null, settings = null, nav = () => {}, getUser = () => null, onSet }) {
const last = {};
let shots = {};
let guide = {};
let _or = null;
let _o1k = '';
let engineInfo = null;
const ctl = {
mode, ui, config, last, demo: api && api.mode === 'demo', sale: isSaleEdition(config), sharedHost: sharedHost(),
api,
guideImage(key) { const _o1s = (guide.images || {})[key]; return _o1s && typeof _o1s.file === 'string' ? { src: _o1s.file, alt: _o1s.alt || '', caption: _o1s.caption || '', ...shotDims(_o1s, sizeOf(guide, _o1)) } : null; },
get state() { return loadState(); },
set(s) { saveState(s); if (onSet) onSet(s); },
shotUrl: (name) => shots[name] || null,
images(a) {
const imgs = guide.images || {}, steps = guide.steps || {};
const byGuide = a.guide ? [].concat(a.guide).flatMap((g) => (steps[g] && Array.isArray(steps[g].images) ? steps[g].images : [])) : [];
let keys = byGuide.length ? byGuide : a.imgs || (a.slot && guide.slots ? guide.slots[a.slot] : null) || [];
if (!Array.isArray(keys)) keys = [keys];
const gs = sizeOf(guide, _o1);
const _o15 = keys.map((_ou) => imgs[_ou]).filter((_o1s) => _o1s && typeof _o1s.file === 'string').map((_o1s) => ({ src: _o1s.file, alt: _o1s.alt || '', caption: _o1s.caption || '', ...shotDims(_o1s, gs) }));
if (!_o15.length && a.slot && shots[a.slot]) _o15.push({ src: shots[a.slot], alt: '', caption: '', ...(EXT_KEYS.has(a.slot) ? gs : SHOT_SIZE) });
if (!_o15.length && a.shot && shots[a.shot]) _o15.push({ src: shots[a.shot], alt: '', caption: '', ...(EXT_KEYS.has(a.shot) ? gs : SHOT_SIZE) });
return _o15;
},
installer: {
paths: INSTALLER,
load(force = false) {
if (!_or || force) {
let remote = '';
try { remote = publicBase(typeof location !== 'undefined' ? location : null, config) || releaseOrigin(); } catch { remote = ''; }
_or = verifiedReleaseFiles([INSTALLER.tatca, INSTALLER.caidat, INSTALLER.manifest], { local: '', remote }).then((_o1c) => { if (!_o1c.ok) _or = null; return _o1c; });
}
return _or;
}
},
link: (_ou) => LINKS(config)[_ou] || '',
async run(id, args) {
let _o1c;
try { _o1c = await checks[id](args); } catch (e) { _o1c = { ok: false, cause: 'Lỗi khi kiểm: ' + (e.message || e), fix: 'Thử lại; vẫn lỗi thì bấm "Cần giúp?".' }; }
if (_o1c && _o1c.version) _o1k = _o1c.version;
if (id === 'finish' && _o1c) ctl.set(M.setData(ctl.state, { lastCheck: { text: _o1c.msg || '', bad: (_o1c.items || []).filter((_o1s) => _o1s.ok === false).length, at: Date.now() } }));
last[id] = _o1c;
return _o1c;
},
async diagnostics() {
if (!_o1k) { try { _o1k = ((await api.call('status')) || {}).version || ''; } catch { } }
const env = { ...browserEnv(), screen: typeof screen !== 'undefined' ? screen.width + '×' + screen.height : '', lang: typeof navigator !== 'undefined' ? navigator.language : '' };
let errors = [];
try { errors = JSON.parse(localStorage.getItem(_o0) || '[]'); } catch { errors = []; }
const url = scriptUrl(config);
return diagnosticText(diagnosticData({
state: ctl.state, app: { version: config.APP_VERSION, mode: api ? api.mode : '', server_version: _o1k, server_host: url ? url : '' },
env, problems: browserProblems(env), last, errors, engine: engineInfo && engineInfo.running ? engineInfo : null
}));
}
};
ctl.defaultAddress = () => defaultAddressInfo({ instance: ctl.instance, diachi: (((ctl.state || {}).data || {}).diachi) || null,
host: (typeof location !== 'undefined' && location.origin) || sharedHost(), sale: isSaleEdition(config), config });
const checks = makeChecks({
api, settings, auth, config: { ...config, SHARED_HOST: sharedHost() }, appHooks, getState: () => ctl.state || { data: {} }, defaultAddress: () => ctl.defaultAddress(),
apiFor: (url) => { const _o1a = scriptUrl({}); saveScriptUrl(url); try { return createApi({ config, timeoutMs: 120000 }); } finally { saveScriptUrl(_o1a || null); } }
});
ctl.checks = checks;
ctl.portal = isPortal(config);
ctl.provision = createProvisionClient({ url: config.PROVISION_URL });
ctl.navigate = (_o1o) => location.assign(_o1o);
ctl.installToken = async ({ tries = 6, waitMs = 5000 } = {}) => {
let _ov = '';
for (let _oo = 0; _oo < tries; _oo++) {
let _op = null;
try { _op = await api.call('license.get', {}); } catch (e) { _ov = e.userMessage || e.message || ''; }
const t = _op ? pickInstallToken(_op, parseToken) : null;
if (t) return t;
const _ox = typeof window !== 'undefined' && window.__bds && window.__bds.license;
if (_oo === 0 && _ox && typeof _ox.check === 'function') { try { await _ox.check({ force: true }); } catch { } continue; }
if (_oo < tries - 1) await new Promise((_o1c) => setTimeout(_o1c, waitMs));
}
throw new Error('Chưa nhận được mã cài đặt từ máy chủ bản quyền' + (_ov ? ' (' + _ov + ')' : '') + '. Kiểm tra mạng rồi bấm "Thử lại"; vẫn lỗi thì bấm "Cần giúp?".');
};
ctl.provisionTicket = async (slug) => {
await ctl.installToken();
const _op = await api.call('license.get', { id_token: true });
const _ox = (config && config.licensing) || {};
return requestTicket({ licenseUrl: _ox.server_url, install_id: _op && _op.install_id, id_token: _op && _op.id_token, slug });
};
ctl.sendWish = async ({ slug = '', domain = '' } = {}) => {
await ctl.installToken({ tries: 3, waitMs: 3000 }).catch(() => null);
const _op = await api.call('license.get', { id_token: true });
const _ox = (config && config.licensing) || {};
return requestWish({ licenseUrl: _ox.server_url, install_id: _op && _op.install_id, id_token: _op && _op.id_token, slug, domain });
};
ctl.finishPortal = async ({ url, domain = '' } = {}) => {
const _o1n = ctl.state || {};
const target = handoffUrl(url, { execUrl: scriptUrl(config), flow: _o1n.flow, domain, user: ((ctl.getUser && ctl.getUser()) || {}).username || '' });
if (!target) throw new Error(isExecUrl(scriptUrl(config)) ? 'Địa chỉ app không hợp lệ: ' + url : 'Chưa nối máy chủ (thiếu địa chỉ …/exec) – quay lại bước "Tạo máy chủ".');
try { if (api && api.token && api.mode !== 'demo') await api.call('logout', {}); } catch { }
await clearPortalData();
ctl.navigate(target);
return target;
};
checks.doingu = async () => doinguCheck(ctl.state);
checks.diachi = async () => {
const _oe = ((ctl.state || {}).data || {}).diachi || {};
if (!ctl.provision.configured) {
const w = ((ctl.state || {}).data || {}).wish || {};
return { ok: false, cause: w.sent ? 'Đã gửi tên ' + (w.full || w.name) + ' – chờ bên bán tạo địa chỉ riêng (trong vòng 24 giờ).' : 'Chưa có địa chỉ riêng – bên bán tạo giúp.',
fix: (w.sent ? '' : 'Gõ tên muốn dùng ở trên → bấm "Gửi tên cho bên bán". ') + 'Bấm "Làm sau" để dùng app ngay ở địa chỉ này; dữ liệu không mất khi chuyển.' };
}
if (!_oe.slug) return { ok: false, cause: 'Chưa tạo địa chỉ app.', fix: 'Chọn địa chỉ miễn phí hoặc tên miền riêng ở trên rồi bấm "Tạo ngay".' };
try {
const _o1c = await ctl.provision.status(_oe.slug);
if (_o1c.status === 'ok') return { ok: true, msg: 'App đã chạy ở ' + String(_o1c.url || '').replace(/^https:\/\//, '') };
if (_o1c.status === 'cho_dns') return { ok: false, cause: 'App đã tạo, tên miền ' + (_o1c.domain || '') + ' chưa chạy.', fix: 'Kiểm lại bản ghi CNAME ở nơi quản lý tên miền; chờ thêm (5 phút–24 giờ) rồi kiểm lại.' };
if (_o1c.status === 'fail') return { ok: false, cause: _o1c.message || 'Tạo app chưa được.', fix: 'Bấm "Chọn lại" ở trên để tạo lại; vẫn lỗi thì bấm "Cần giúp?".' };
return { ok: false, cause: 'Đang tạo app… (thường 2–5 phút, có khi tới 15 phút – chờ chứng chỉ https)', fix: 'Cứ để trang mở, chờ thêm rồi kiểm lại.' };
} catch (e) { return { ok: false, cause: e.message || 'Không hỏi được dịch vụ tạo app.', fix: 'Kiểm tra mạng rồi thử lại.' }; }
};
ctl.ready = Promise.all([_oz(), _oy(), loadInstance()]).then(([_o10, g, _oo]) => { shots = _o10 || {}; guide = g || {}; ctl.instance = _oo; });
ctl.cnameTarget = () => {
const _oe = (((ctl.state || {}).data || {}).diachi) || {};
if (_oe.cname_target) return _oe.cname_target;
const slug = (ctl.instance && ctl.instance.slug) || _oe.slug || '';
return slug ? PAGES_PREFIX + slug + '.pages.dev' : (config.CNAME_TARGET || '');
};
if (store) {
ctl.samples = {
count: () => Samples.countSamples(store),
async load() { const _o1c = await Samples.loadSamples(store, { source: _o1h() }); ctl.set({ ...ctl.state, samples: 'loaded' }); return _o1c; },
async clear() { const _o13 = await Samples.clearSamples(store); ctl.set({ ...ctl.state, samples: 'cleared' }); return _o13; }
};
}
ctl.nav = nav;
ctl.getUser = getUser;
ctl.handover = async () => {
const _o1n = ctl.state;
let users = [];
try { const l = await api.call('users.list'); users = (Array.isArray(l) ? l : []).filter((_o1o) => !Number(_o1o.deleted)); } catch { users = []; }
if (!_o1k) { try { _o1k = ((await api.call('status')) || {}).version || ''; } catch { } }
const _oe = (_o1n && _o1n.data) || {};
const company = { ...((settings && settings.get('company', null)) || {}), ...(_oe.company || {}) };
const _of = _oe.domain || {};
const host = _of.mode === 'custom' ? normHost(_of.host) : sharedHost();
const _o1o = getUser() || {};
let license = null;
try { license = await api.call('license.get'); } catch { license = null; }
return handoverData({ state: _o1n, company, owner: { username: _o1o.username, full_name: _o1o.full_name }, users, domain: host,
versions: { web: config.APP_VERSION, server: _o1k, engine: engineInfo && engineInfo.version }, check: _oe.lastCheck || null, license });
};
return ctl;
}
export function sharedHost() {
let _o1o = '';
try { _o1o = publicUrl() || ''; } catch { _o1o = ''; }
if (!_o1o && typeof location !== 'undefined') _o1o = location.origin;
return normHost(_o1o) || '';
}
function _o1h() {
const D = globalThis.BDSData || globalThis.BDSProjects || {};
return Array.isArray(D.projects) ? D.projects : [];
}
export function wizardBeforeSetup({ ui, api, config = {}, showSetup, showConnect }) {
if (!wizardEnabled({ config })) return false;
scrubConnectUrl();
let _o1n = loadState();
if (_o1n && _o1n.dismissed) return false;
if (_o1n && _o1n.res.account) { const s = JSON.parse(JSON.stringify(_o1n)); delete s.res.account; s.cur = 'account'; s.finished = 0; saveState(_o1n = s); }
if (_o1n && _o1n.demo && api && api.mode !== 'demo') saveState(_o1n = M.leaveDemo(_o1n, { connected: true }));
const pending = takePendingUrl();
const linkProblem = pending ? '' : takeLinkProblem();
let autoCheck = false;
if (pending && _o1n && M.ids(_o1n).includes('allow')) {
let _o1g = M.setData(_o1n, { url: pending });
try { _o1g = M.goTo(_o1g, 'allow'); } catch { }
autoCheck = true;
saveState(_o1n = _o1g); clearPendingUrl();
}
ensureCss(new URL('./wizard.css', import.meta.url).href, 'bds-wizard-css');
const { h, mountTo } = ui;
const _o1f = document.getElementById('app');
_o1f.className = 'app app-auth app-wiz';
const _oh = _o1n && _o1n.flow && _o1n.cur === 'account' && !(_o1n.data && _o1n.data.slowAccount) ? quickIdentity(api) : Promise.resolve('');
const box = h('div', { class: 'wiz-body' }, ui.spinner ? ui.spinner() : null);
const ribbon = api && api.mode === 'demo' ? h('div', { class: 'ribbon', role: 'note', 'data-testid': 'demo-ribbon' }, h('span', { class: 'ribbon-dot' }),
h('span', null, isSaleEdition(config) ? NOT_REAL_TEXT : 'Đang xem thử – dữ liệu mẫu')) : null;
mountTo(_o1f, ribbon, h('main', { class: 'auth wiz-auth' }, h('div', { class: 'auth-card wiz-card', 'data-testid': 'wizard' },
h('div', { class: 'brand' }, h('img', { src: 'assets/icon.svg', alt: '', class: 'brand-mark', width: 44, height: 44 }),
h('div', null, h('div', { class: 'brand-name' }, 'BDS Studio'), h('div', { class: 'brand-tag' }, 'Trợ lý cài đặt'))), box)));
let _o1p = null;
const ctl = _od({ mode: 'pre', ui, api, config, onSet: () => {} });
ctl.autoCheck = autoCheck;
ctl.fromLink = autoCheck ? pending : '';
ctl.pendingUrl = pending && !autoCheck ? pending : '';
ctl.linkProblem = linkProblem ? { cause: LINK_PROBLEM_TEXT[linkProblem], fix: LINK_PROBLEM_FIX } : null;
ctl.clearPending = () => { ctl.pendingUrl = ''; clearPendingUrl(); };
Object.assign(ctl, {
onAccount() { const s = ctl.state; if (s) saveState({ ...s, cur: 'account' }); showSetup(); },
skipWizard() { saveState({ ...(ctl.state || M.start('personal')), dismissed: true }); showSetup(); },
loginHere: showConnect ? () => { saveState(null); clearPendingUrl(); try { sessionStorage.setItem('bds:tfa_nudge', '1'); } catch { } showConnect(); } : null,
async beforeNext(id) {
const url = ((ctl.state || {}).data || {}).url || '';
if (id === 'allow' && url && url !== scriptUrl(config)) {
if (!(await confirmLeaveDemo({ ui, api }))) return false;
let s = M.next(ctl.state); if (s.demo) s = M.leaveDemo(s, { connected: true });
saveState(s); saveScriptUrl(url); location.reload(); return false;
}
return true;
}
});
ctl.set = (s) => { saveState(s); };
ctl.ready.then(() => _oh).then((email) => {
if (email) {
try { sessionStorage.setItem('bds:setup_email', JSON.stringify({ email, use_account_email: true, via: 'ticket', at: Date.now() })); } catch { }
showSetup(); return;
}
_o1p = mountWizard(box, ctl);
});
return true;
}
export async function quickIdentity(api, tok = setupToken()) {
if (!api || api.mode === 'demo' || !tok || typeof api.callRaw !== 'function') return '';
try {
const _o1c = await api.callRaw('setup.identity', { setup_token: tok });
const em = String((_o1c && _o1c.email) || '').trim();
return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em) ? em : '';
} catch { return ''; }
}
export function installWizard({ S, appHooks, ui, config = {}, nav = () => {} }) {
if (!wizardEnabled({ config })) return null;
scrubConnectUrl();
ensureCss(new URL('./wizard.css', import.meta.url).href, 'bds-wizard-css');
const _ot = () => !S.user || !S.user.role || S.user.role === 'owner' || !!S.user.legacy;
const settings = S.settings;
let modal = null; let _o18 = null;
const _o12 = (mode, onSet) => {
const ctl = _od({ mode, ui, api: S.api, config, auth: S.auth, appHooks, store: S.store, settings, nav, getUser: () => S.user, onSet });
ctl.goSettings = (section) => { _oc(); nav('settings/' + section); _o1m(); };
ctl.renderTfa = async (box) => { try { const _o10 = await import('../tfa.741f96ece0.js'); await _o10.renderTfaPanel(box, { ui, auth: S.auth, nav }); } catch (e) { box.append(ui.h('p', { class: 'muted small' }, 'Không mở được khung 2 lớp: ' + (e.message || e))); } };
ctl.beforeNext = async (id) => {
if (id === 'company') { await _o4(ctl.state); await _o5(ctl.state); }
if (id === 'diachi' && ctl.portal) { const _oe = ((ctl.state || {}).data || {}).diachi || {}; if (_oe.url) { await ctl.finishPortal({ url: _oe.url, domain: _oe.domain && _oe.url === 'https://' + _oe.domain ? _oe.domain : '' }); return false; } }
return true;
};
ctl.close = () => _oc();
return ctl;
};
const _o1a = appHooks.extraSections && appHooks.extraSections.__wiz ? appHooks.extraSections.__prev : appHooks.extraSections;
const _o1j = (ctx) => [...(typeof _o1a === 'function' ? _o1a(ctx) : []), ...(_ot() ? [[SECTION, 'check', 'Trợ lý cài đặt', (body) => renderPanel(body)]] : [])];
_o1j.__wiz = true; _o1j.__prev = _o1a;
appHooks.extraSections = _o1j;
const api = { open, state: loadState, renderPanel, applyClean, beforeStep: (id) => M.beforeStep(loadState(), id), pendingRequired: () => M.pendingRequired(loadState()),
quietTfa: () => { const s = loadState(); return !!(s && s.flow === 'personal' && !s.dismissed && !s.finished && M.ids(s).includes('telegram') && !M.isDone(s, 'telegram')); } };
window.__bds = { ...(window.__bds || {}), wizard: api };
if (!_ot()) return api;
applyClean();
if (settings && settings.on) settings.on('install.clean', applyClean);
let _o1n = loadState();
const _ol = takeHandoff();
if (_ol && (!_o1n || _o1n.portal)) _o1n = saveState(_oi(_ol));
if (_ol) S.wizardHandoff = _ol;
if (isPortal(config)) _o19();
if (_o1n && _o1n.demo && S.api && S.api.mode !== 'demo') _o1n = saveState(M.leaveDemo(_o1n, { connected: true }));
if (_o1n && _o1n.origin === 'new' && !_o1n.dismissed && !_o1n.finished) {
_o1n = saveState(M.afterLogin(_o1n, { username: S.user && S.user.username }));
window.__bds.licenseHold = _o5(_o1n);
onb.saveState({ dismissed: true });
try { if (S.video && !S.video.record() && !(S.video.offered && S.video.offered())) S.video.setMode('off', 'wizard').catch(() => { }); } catch { }
_ob();
_o2(_o1n).catch((e) => report('wizard.after', e));
} else if (_o1n && !_o1n.dismissed && (!_o1n.finished || M.pendingRequired(_o1n).length)) _o1m();
return api;
function _oj(s) {
if (!s || s.flow !== 'personal' || !S.wizardHandoff) return false;
const _ow = M.ids(s).filter((id) => !M.isDone(s, id) && id !== 'finish');
return _ow.every((id) => { const _o1n = M.steps(s).find((_o1s) => _o1s.id === id); return _o1n && !_o1n.required; });
}
function _o1e() {
S.wizardHandoff = null;
_o1m();
let host = ''; try { host = location.host; } catch { host = ''; }
const t = ui.toast('✅ Cài xong – đây là app riêng của anh/chị' + (host ? ' (' + host + ')' : '') + '. Khi rảnh: nối Telegram, bật AI ở nút "Trợ lý cài đặt" góc dưới.', 'ok', 9000);
if (t && t.addEventListener) t.addEventListener('click', () => open());
}
function _oi(h) {
let s = M.start(h.flow);
const now = Date.now();
for (const id of ['prepare', 'company', 'allow', 'account']) if (M.ids(s).includes(id)) s.res[id] = { s: 'ok', at: now, msg: 'Đã làm ở trang cài đặt' };
if (h.flow === 'company') {
const _o8 = h.domain ? String(h.domain).toLowerCase().replace(/^app\./, '') : '';
if (_o8) s.data.coDomain = { has: 'yes', domain: _o8 };
} else if (h.domain) { s.res.domain = { s: 'ok', at: now, msg: h.domain }; s.data.domain = { mode: 'custom', host: h.domain }; }
else if (M.ids(s).includes('domain')) { s.res.domain = { s: 'ok', at: now, msg: 'Địa chỉ mặc định – đã chọn ở trang cài đặt' }; s.data.domain = { mode: 'shared' }; }
s.samples = 'loaded';
s.cur = M.firstPending(s) || s.cur;
return s;
}
function _o19() {
if (document.querySelector('[data-testid="portal-banner"]')) return;
const _o1d = ((loadState() || {}).res || {}).diachi;
const _o1q = !!(_o1d && _o1d.s === 'later');
const _o7 = ui.h('div', { class: 'wiz-portal-banner', role: 'note', 'data-testid': 'portal-banner' },
ui.h('span', null, _o1q ? '⏳ Đang dùng app tạm ở trang cài đặt – bên bán gửi địa chỉ riêng qua email trong vòng 24 giờ; dữ liệu nằm trong Google của anh/chị, không mất khi chuyển.'
: '⚙️ Đây là TRANG CÀI ĐẶT, chưa phải app của anh/chị – làm xong bước "Địa chỉ app" để mở app riêng. Trang này không giữ dữ liệu.'),
ui.button('Tiếp tục cài đặt', () => open(), { kind: 'primary', small: true, icon: 'next', testid: 'portal-banner-open' }));
document.body.appendChild(_o7);
}
async function _o2(s) {
if (settings) {
if (settings.get('install.mode', '') !== s.flow) await settings.set('install.mode', s.flow);
if (!settings.get('install.clean', false)) await settings.set('install.clean', true);
}
await _o4(s);
await _o6(s);
applyClean();
if (s.flow === 'personal' && s.samples === 'none' && S.store) {
try { await Samples.loadSamples(S.store, { source: _o1h() }); saveState({ ...loadState(), samples: 'loaded' }); } catch (e) { report('wizard.samples', e); }
}
if (loadState() && loadState().closed) _o1m();
else if (_oj(loadState())) _o1e();
else _o1r(() => open());
}
function _o5(s) {
if (!s || !S.api || (config.edition || 'owner') === 'owner') return Promise.resolve(null);
const p = { edition: s.flow === 'company' ? 'cong-ty' : 'ca-nhan' };
const appUrl = _o3();
if (appUrl) p.app_url = appUrl;
const _o9 = (s.data && s.data.company) || {};
if (s.flow === 'company' && _o9.name) p.company_name = String(_o9.name);
return S.api.call('instance.set', p).then(async (_o1c) => {
S.status = { ...(S.status || {}), edition: p.edition };
if (p.edition === 'cong-ty') { try { await S.api.call('members.isolate_now', {}); } catch { } }
try { if (S.auth && typeof S.auth.me === 'function') await S.auth.me(); } catch { }
return _o1c;
}).catch((e) => { report('wizard.edition', e); return null; });
}
function _o3() {
try {
if (isPortal(config) || location.protocol !== 'https:' || /^(127\.0\.0\.1|localhost|\[::1\])$/.test(location.hostname)) return '';
return location.origin;
} catch { return ''; }
}
async function _o6(s) {
const em = String((s && s.data && s.data.email) || '').trim();
if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em) || !S.auth || typeof S.auth.setMyEmail !== 'function') return;
if (S.user && S.user.email_gate) return;
if (S.user && String(S.user.email || '').trim().toLowerCase() === em.toLowerCase()) return;
try { await S.auth.setMyEmail(em); } catch (e) { report('wizard.email', e); }
}
async function _o4(s) {
const _o9 = s && s.data && s.data.company;
if (!settings || !_o9 || !_o9.name) return;
const cur = settings.get('company', {}) || {};
if (cur.name !== _o9.name || cur.tax !== _o9.tax || cur.logo !== _o9.logo) await settings.set('company', { name: _o9.name, tax: _o9.tax || '', logo: _o9.logo || '' });
const p = settings.get('profile', {}) || {};
if (!p.company || !p.brand) await settings.set('profile', { ...p, company: p.company || _o9.name, brand: p.brand || _o9.name });
}
function applyClean() { if (settings && settings.get('install.clean', false)) _ob(); }
function _ob() { if (S.data && Array.isArray(S.data.projects) && S.data.projects.length) S.data.projects = []; }
function open({ step = '' } = {}) {
_oc(); _om();
let s0 = loadState();
if (s0 && s0.closed) { s0 = { ...s0 }; delete s0.closed; saveState(s0); }
let review = false;
if (s0 && step && M.ids(s0).includes(step)) { try { saveState(s0 = M.goTo(s0, step)); review = true; } catch { } }
const body = ui.h('div', { class: 'wiz-modal-body', 'data-testid': 'wizard' });
const ctl = _o12('post', () => {});
ctl.review = review;
let target = body;
if (S.wizardHandoff) {
const host = location.host;
S.wizardHandoff = null;
body.append(ui.h('div', { class: 'wiz-note wiz-handoff', 'data-testid': 'wiz-handoff' },
ui.h('p', null, '✅ Đã chuyển sang app riêng của anh/chị: ', ui.h('strong', null, host), '. Từ nay mở app ở địa chỉ này. Trên điện thoại: quét mã QR bên dưới hoặc gõ địa chỉ này, rồi đưa ra màn hình chính theo hướng dẫn.'),
ui.h('p', { class: 'muted small' }, 'Trang cài đặt đã tự xoá dữ liệu tạm trước khi chuyển. Muốn chắc chắn trên máy này: '),
ui.h('a', { class: 'btn btn-ghost btn-sm', href: clearUrl(config), target: '_blank', rel: 'noopener', 'data-testid': 'wiz-portal-clear' }, 'Xoá dữ liệu tạm trên trang cài đặt')));
try { body.append(finishCard(ui, { appUrl: location.origin + '/', testid: 'wiz-handoff-a2hs' })); } catch { }
const _oq = ui.h('div', { class: 'wiz-modal-inner' });
body.append(_oq);
target = _oq;
}
let _o1p = null;
ctl.set = (s) => { saveState(s); if (s && s.flow && settings && settings.get('install.mode', '') !== s.flow) settings.set('install.mode', s.flow).catch(() => {}); };
modal = ui.modal({ title: 'Trợ lý cài đặt', body, wide: true, cls: 'wiz-modal', onClose: () => {
modal = null;
const s = loadState();
if (s && !s.finished) saveState({ ...s, closed: Date.now() });
_o1m();
} });
ctl.ready.then(() => { _o1p = mountWizard(target, ctl); });
return modal;
}
function _oc() { if (modal) { const _o10 = modal; modal = null; _o10.close(); } }
function _o1m() {
_om();
const s = loadState(); if (!s || s.dismissed) return;
const _o16 = M.pendingRequired(s);
if (s.finished && !_o16.length) return;
const label = s.finished ? 'Trợ lý cài đặt · còn ' + _o16.length + ' bước bắt buộc' : 'Trợ lý cài đặt · ' + M.stepText(s);
_o18 = ui.h('button', { type: 'button', class: 'wiz-pill', 'data-testid': 'wiz-resume', 'aria-label': label, onclick: () => open(s.finished && _o16.length ? { step: _o16[0].id } : {}) },
ui.icon ? ui.icon(s.finished ? 'help' : 'back', 18) : null, ui.h('span', null, label));
document.body.appendChild(_o18);
document.body.classList.add('has-wiz-pill');
}
function _om() { if (_o18) { _o18.remove(); _o18 = null; } if (typeof document !== 'undefined') document.body.classList.remove('has-wiz-pill'); }
function _o1r(fn, tries = 0) {
if (document.querySelector('.modal-back') && tries < 40) return setTimeout(() => _o1r(fn, tries + 1), 250);
fn();
}
function renderPanel(body) {
const { h, button } = ui;
const _og = async () => {
const s = loadState();
ui.clear(body);
const box = h('div', { class: 'wiz-panel', 'data-testid': 'wiz-panel' });
body.append(box);
if (!s) {
box.append(h('p', null, 'Trợ lý dẫn từng bước: nối Telegram, AI, tên miền, xác thực 2 lớp, mời nhân viên… Mỗi bước có nút "Kiểm tra bước này" và cách sửa khi chưa đạt.'),
h('p', { class: 'muted small' }, 'Anh/chị dùng BDS Studio cho:'),
h('div', { class: 'btn-row' },
button('👤 Cá nhân', () => { saveState(M.start('personal', { installed: true })); open(); _og(); }, { kind: 'secondary', testid: 'wiz-panel-personal' }),
button('🏢 Công ty', () => { saveState(M.start('company', { installed: true })); open(); _og(); }, { kind: 'secondary', testid: 'wiz-panel-company' })));
return;
}
const p = M.progress(s);
box.append(
h('p', null, h('strong', null, (s.flow === 'company' ? '🏢 ' : '👤 ') + FLOW_LABEL[s.flow]), ' · ', s.finished ? 'đã xong' : 'đang làm', ' · ', p.done + '/' + p.total + ' bước'),
ui.progress(p.pct),
h('div', { class: 'btn-row' }, button(s.finished ? 'Xem lại trợ lý' : 'Tiếp tục cài đặt', () => open(), { kind: 'primary', small: true, icon: s.finished ? 'refresh' : 'next', testid: 'wiz-open' })));
const ctl = _o12('settings', () => {});
if (ctl.samples) {
const _o1i = h('div', { class: 'sub-block' });
box.append(_o1i);
const _o13 = await ctl.samples.count().catch(() => 0);
_o1i.append(h('h4', { class: 'section-title' }, 'Dữ liệu mẫu'),
h('p', { class: 'muted small', 'data-testid': 'wiz-panel-samples' }, _o13 ? 'Đang có ' + _o13 + ' mục dữ liệu mẫu (tên có chữ "Mẫu").' : 'Không có dữ liệu mẫu.'),
h('div', { class: 'btn-row' }, _o13
? button('Xoá toàn bộ dữ liệu mẫu', async () => {
if (!(await ui.confirm('Xoá toàn bộ dữ liệu mẫu? Dữ liệu anh/chị tự nhập không bị đụng tới.', { ok: 'Xoá dữ liệu mẫu', kind: 'danger' }))) return;
const _ou = await ctl.samples.clear(); ui.toast('Đã xoá ' + _ou + ' mục dữ liệu mẫu.', 'ok'); _og();
}, { kind: 'danger', small: true, testid: 'wiz-panel-samples-clear' })
: button('Xem ví dụ', async () => { await ctl.samples.load(); ui.toast('Đã nạp ví dụ (tên có chữ "Mẫu").', 'ok'); _og(); }, { kind: 'secondary', small: true, testid: 'wiz-panel-samples-load' })));
}
const _o11 = h('div', { class: 'sub-block' }, h('h4', { class: 'section-title' }, 'Đổi cách dùng'));
box.append(_o11);
if (s.flow === 'personal') {
_o11.append(h('p', { class: 'muted small' }, 'Nâng lên Công ty: giữ nguyên toàn bộ dữ liệu, thêm bước thông tin công ty, 2 lớp bắt buộc, mời nhân viên, biên bản bàn giao.'),
button('Nâng lên Công ty (giữ dữ liệu)', async () => {
const ok = await ui.confirm('Nâng lên Công ty – dữ liệu giữ nguyên. Nếu máy chủ đang nằm trong Gmail cá nhân, nên chuyển sang tài khoản Google công ty: trong Google Drive, chia sẻ Sheet "BDS Studio" cho tài khoản công ty rồi chuyển quyền sở hữu; khác tổ chức Workspace thì nhờ bên cài đặt chuyển giúp bằng sao lưu + khôi phục.', { ok: 'Nâng lên Công ty' });
if (!ok) return;
saveState(M.upgrade(s)); if (settings) await settings.set('install.mode', 'company');
await _o5(loadState());
ui.toast('Đã chuyển sang Công ty – làm tiếp các bước của công ty.', 'ok'); open(); _og();
}, { kind: 'secondary', small: true, testid: 'wiz-upgrade' }));
} else {
_o11.append(h('p', { class: 'muted small' }, 'Chuyển về Cá nhân: chỉ được khi chỉ còn 1 người dùng (tài khoản Quản trị).'),
button('Chuyển về Cá nhân', async () => {
let users = 1;
try { const l = await S.api.call('users.list'); users = (Array.isArray(l) ? l : []).filter((_o1o) => !Number(_o1o.deleted) && _o1o.status !== 'locked').length || 1; } catch { users = 1; }
try { saveState(M.downgrade(s, { users })); if (settings) await settings.set('install.mode', 'personal'); await _o5(loadState()); ui.toast('Đã chuyển về Cá nhân.', 'ok'); _og(); } catch (e) { ui.toast(e.message, 'warn', 6000); }
}, { kind: 'ghost', small: true, testid: 'wiz-downgrade' }));
}
box.append(h('div', { class: 'btn-row' }, button('Bắt đầu lại trợ lý', async () => {
if (!(await ui.confirm('Xoá tiến độ của trợ lý trên máy này và chọn lại từ đầu? Dữ liệu và cài đặt của app không bị đụng tới.', { ok: 'Bắt đầu lại' }))) return;
saveState(null); _om(); _og();
}, { kind: 'ghost', small: true, testid: 'wiz-reset' })));
};
_og().catch((e) => body.append(ui.h('p', { class: 'form-err' }, String(e.message || e))));
}
function report(where, e) { try { appHooks.errors && appHooks.errors.report('warn', where, String(e && e.message || e)); } catch { } }
}
export default { wizardEnabled, wizardBeforeSetup, installWizard, loadState, saveState };

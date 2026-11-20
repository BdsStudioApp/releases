import { ensureCss, ls } from '../xkit.e7637ba4a6.js';
import { createApi, saveScriptUrl, scriptUrl } from '../api.8a9774059d.js';
import { EXEC_URL_RE, isExecUrl } from '../exec_url.4b6ba956ed.js';
import { API_SETTINGS_URL, verifiedReleaseFiles, publicBase } from '../updates.7f3d23ce57.js';
import { publicUrl, releaseOrigin } from '../instance.087c1b328a.js';
import * as M from './machine.js';
import { makeChecks, browserEnv, browserProblems, normHost } from './checks.js';
import { diagnosticData, diagnosticText, handoverData } from './report.js';
import * as Samples from './samples.js';
import { mountWizard } from './view.js';
import { wizardEnabled } from './flag.js';
import * as onb from '../onboarding.5b71c6d6bb.js';
import { FLOW_LABEL, isSaleEdition } from './steps.js';
import { NOT_REAL_TEXT } from './view.js';
import { confirmLeaveDemo } from './demodata.js';
import { isPortal, clearPortalData, takeHandoff, clearUrl } from '../portal.c67f0ba398.js';
import { createProvisionClient, handoffUrl, pickInstallToken, PAGES_PREFIX, defaultAddressInfo, requestTicket, requestWish } from './provision.js';
import { parseToken } from '../license_logic.9718cd0900.js';
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
export function clearPendingUrl(storage = (typeof sessionStorage !== 'undefined' ? sessionStorage : null)) { try { if (storage) storage.removeItem(PENDING_KEY); } catch { } }
const LINKS = (config) => ({
template: config.TEMPLATE_COPY_URL || '', sheetsNew: 'https://sheets.new', scriptApi: API_SETTINGS_URL, aistudio: 'https://aistudio.google.com/apikey',
telegramDownload: 'https://telegram.org/apps', engineZip: engineDownload().primary.path, engineZipOther: engineDownload().other.path
});
let _o1j = null;
let _os = null;
export function loadInstance(fetchFn = (_o1n, _o14) => fetch(_o1n, _o14), loc = (typeof location !== 'undefined' ? location : null)) {
if (!_os && !(loc && loc.protocol === 'https:' && !/^(127\.0\.0\.1|localhost)$/.test(loc.hostname))) _os = Promise.resolve(null);
if (!_os) _os = Promise.resolve().then(() => fetchFn('instance.json', { cache: 'no-store' })).then((_o1a) => (_o1a && _o1a.ok ? _o1a.json() : null))
.then((j) => (j && /^[a-z0-9-]{3,30}$/.test(String(j.slug || '')) ? { slug: j.slug, mode: j.mode || '', edition: j.edition || '', app_url: /^https:\/\//.test(String(j.app_url || '')) ? j.app_url : '', domains: Array.isArray(j.domains) ? j.domains.map(String) : [] } : null))
.catch(() => null);
return _os;
}
let _ol = null;
function _oy() {
if (!_ol) _ol = fetch('assets/wizard/google/index.json', { cache: 'no-cache' }).then((_o1a) => (_o1a.ok ? _o1a.json() : {})).catch(() => ({}));
return _ol;
}
let _o1 = { w: 1280, h: 800 }, SHOT_SIZE = { w: 390, h: 760 }, EXT_KEYS = new Set();
function _o1l(j, def) { const w = Number(j && j.width), hh = Number(j && j.height); return w > 0 && hh > 0 ? { w, h: hh } : def; }
export function shotDims(_o1r, def) { const _o14 = _o1l({ width: _o1r && (_o1r.w || _o1r.width), height: _o1r && (_o1r.h || _o1r.height) }, def); return { w: _o14.w, h: _o14.h }; }
function _oz() {
if (!_o1j) _o1j = fetch('assets/wizard/shots.json', { cache: 'no-cache' }).then((_o1a) => (_o1a.ok ? _o1a.json() : {})).then((j) => { SHOT_SIZE = _o1l(j, SHOT_SIZE); EXT_KEYS = new Set(Object.keys(j.ext || {})); return { ...(j.shots || {}), ...(j.ext || {}) }; }).catch(() => ({}));
return _o1j;
}
function _oe({ mode, ui, api, config, auth = null, appHooks = {}, store = null, settings = null, nav = () => {}, getUser = () => null, onSet }) {
const last = {};
let shots = {};
let guide = {};
let _or = null;
let _o1i = '';
let engineInfo = null;
const ctl = {
mode, ui, config, last, demo: api && api.mode === 'demo', sale: isSaleEdition(config), sharedHost: sharedHost(),
api,
guideImage(key) { const _o1r = (guide.images || {})[key]; return _o1r && typeof _o1r.file === 'string' ? { src: _o1r.file, alt: _o1r.alt || '', caption: _o1r.caption || '', ...shotDims(_o1r, _o1l(guide, _o1)) } : null; },
get state() { return loadState(); },
set(s) { saveState(s); if (onSet) onSet(s); },
shotUrl: (name) => shots[name] || null,
images(a) {
const imgs = guide.images || {}, steps = guide.steps || {};
const byGuide = a.guide ? [].concat(a.guide).flatMap((g) => (steps[g] && Array.isArray(steps[g].images) ? steps[g].images : [])) : [];
let keys = byGuide.length ? byGuide : a.imgs || (a.slot && guide.slots ? guide.slots[a.slot] : null) || [];
if (!Array.isArray(keys)) keys = [keys];
const gs = _o1l(guide, _o1);
const _o15 = keys.map((_ou) => imgs[_ou]).filter((_o1r) => _o1r && typeof _o1r.file === 'string').map((_o1r) => ({ src: _o1r.file, alt: _o1r.alt || '', caption: _o1r.caption || '', ...shotDims(_o1r, gs) }));
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
_or = verifiedReleaseFiles([INSTALLER.tatca, INSTALLER.caidat, INSTALLER.manifest], { local: '', remote }).then((_o1a) => { if (!_o1a.ok) _or = null; return _o1a; });
}
return _or;
}
},
link: (_ou) => LINKS(config)[_ou] || '',
async run(id, args) {
let _o1a;
try { _o1a = await checks[id](args); } catch (e) { _o1a = { ok: false, cause: 'Lỗi khi kiểm: ' + (e.message || e), fix: 'Thử lại; vẫn lỗi thì bấm "Cần giúp?".' }; }
if (_o1a && _o1a.version) _o1i = _o1a.version;
if (id === 'finish' && _o1a) ctl.set(M.setData(ctl.state, { lastCheck: { text: _o1a.msg || '', bad: (_o1a.items || []).filter((_o1r) => _o1r.ok === false).length, at: Date.now() } }));
last[id] = _o1a;
return _o1a;
},
async diagnostics() {
if (!_o1i) { try { _o1i = ((await api.call('status')) || {}).version || ''; } catch { } }
const env = { ...browserEnv(), screen: typeof screen !== 'undefined' ? screen.width + '×' + screen.height : '', lang: typeof navigator !== 'undefined' ? navigator.language : '' };
let errors = [];
try { errors = JSON.parse(localStorage.getItem(_o0) || '[]'); } catch { errors = []; }
const url = scriptUrl(config);
return diagnosticText(diagnosticData({
state: ctl.state, app: { version: config.APP_VERSION, mode: api ? api.mode : '', server_version: _o1i, server_host: url ? url : '' },
env, problems: browserProblems(env), last, errors, engine: engineInfo && engineInfo.running ? engineInfo : null
}));
}
};
ctl.defaultAddress = () => defaultAddressInfo({ instance: ctl.instance, diachi: (((ctl.state || {}).data || {}).diachi) || null,
host: (typeof location !== 'undefined' && location.origin) || sharedHost(), sale: isSaleEdition(config), config });
const checks = makeChecks({
api, settings, auth, config: { ...config, SHARED_HOST: sharedHost() }, appHooks, getState: () => ctl.state || { data: {} }, defaultAddress: () => ctl.defaultAddress(),
apiFor: (url) => { const _o19 = scriptUrl({}); saveScriptUrl(url); try { return createApi({ config, timeoutMs: 120000 }); } finally { saveScriptUrl(_o19 || null); } }
});
ctl.checks = checks;
ctl.portal = isPortal(config);
ctl.provision = createProvisionClient({ url: config.PROVISION_URL });
ctl.navigate = (_o1n) => location.assign(_o1n);
ctl.installToken = async ({ tries = 6, waitMs = 5000 } = {}) => {
let _ov = '';
for (let _oo = 0; _oo < tries; _oo++) {
let _op = null;
try { _op = await api.call('license.get', {}); } catch (e) { _ov = e.userMessage || e.message || ''; }
const t = _op ? pickInstallToken(_op, parseToken) : null;
if (t) return t;
const _ox = typeof window !== 'undefined' && window.__bds && window.__bds.license;
if (_oo === 0 && _ox && typeof _ox.check === 'function') { try { await _ox.check({ force: true }); } catch { } continue; }
if (_oo < tries - 1) await new Promise((_o1a) => setTimeout(_o1a, waitMs));
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
const _o1m = ctl.state || {};
const target = handoffUrl(url, { execUrl: scriptUrl(config), flow: _o1m.flow, domain, user: ((ctl.getUser && ctl.getUser()) || {}).username || '' });
if (!target) throw new Error(isExecUrl(scriptUrl(config)) ? 'Địa chỉ app không hợp lệ: ' + url : 'Chưa nối máy chủ (thiếu địa chỉ …/exec) – quay lại bước "Tạo máy chủ".');
try { if (api && api.token && api.mode !== 'demo') await api.call('logout', {}); } catch { }
await clearPortalData();
ctl.navigate(target);
return target;
};
checks.doingu = async () => doinguCheck(ctl.state);
checks.diachi = async () => {
const _of = ((ctl.state || {}).data || {}).diachi || {};
if (!ctl.provision.configured) {
const w = ((ctl.state || {}).data || {}).wish || {};
return { ok: false, cause: w.sent ? 'Đã gửi tên ' + (w.full || w.name) + ' – chờ bên bán tạo địa chỉ riêng (trong vòng 24 giờ).' : 'Chưa có địa chỉ riêng – bên bán tạo giúp.',
fix: (w.sent ? '' : 'Gõ tên muốn dùng ở trên → bấm "Gửi tên cho bên bán". ') + 'Bấm "Làm sau" để dùng app ngay ở địa chỉ này; dữ liệu không mất khi chuyển.' };
}
if (!_of.slug) return { ok: false, cause: 'Chưa tạo địa chỉ app.', fix: 'Chọn địa chỉ miễn phí hoặc tên miền riêng ở trên rồi bấm "Tạo ngay".' };
try {
const _o1a = await ctl.provision.status(_of.slug);
if (_o1a.status === 'ok') return { ok: true, msg: 'App đã chạy ở ' + String(_o1a.url || '').replace(/^https:\/\//, '') };
if (_o1a.status === 'cho_dns') return { ok: false, cause: 'App đã tạo, tên miền ' + (_o1a.domain || '') + ' chưa chạy.', fix: 'Kiểm lại bản ghi CNAME ở nơi quản lý tên miền; chờ thêm (5 phút–24 giờ) rồi kiểm lại.' };
if (_o1a.status === 'fail') return { ok: false, cause: _o1a.message || 'Tạo app chưa được.', fix: 'Bấm "Chọn lại" ở trên để tạo lại; vẫn lỗi thì bấm "Cần giúp?".' };
return { ok: false, cause: 'Đang tạo app…', fix: 'Chờ 1–3 phút rồi kiểm lại.' };
} catch (e) { return { ok: false, cause: e.message || 'Không hỏi được dịch vụ tạo app.', fix: 'Kiểm tra mạng rồi thử lại.' }; }
};
ctl.ready = Promise.all([_oz(), _oy(), loadInstance()]).then(([_o10, g, _oo]) => { shots = _o10 || {}; guide = g || {}; ctl.instance = _oo; });
ctl.cnameTarget = () => {
const _of = (((ctl.state || {}).data || {}).diachi) || {};
if (_of.cname_target) return _of.cname_target;
const slug = (ctl.instance && ctl.instance.slug) || _of.slug || '';
return slug ? PAGES_PREFIX + slug + '.pages.dev' : (config.CNAME_TARGET || '');
};
if (store) {
ctl.samples = {
count: () => Samples.countSamples(store),
async load() { const _o1a = await Samples.loadSamples(store, { source: _o1f() }); ctl.set({ ...ctl.state, samples: 'loaded' }); return _o1a; },
async clear() { const _o13 = await Samples.clearSamples(store); ctl.set({ ...ctl.state, samples: 'cleared' }); return _o13; }
};
}
ctl.nav = nav;
ctl.getUser = getUser;
ctl.handover = async () => {
const _o1m = ctl.state;
let users = [];
try { const l = await api.call('users.list'); users = (Array.isArray(l) ? l : []).filter((_o1n) => !Number(_o1n.deleted)); } catch { users = []; }
if (!_o1i) { try { _o1i = ((await api.call('status')) || {}).version || ''; } catch { } }
const _of = (_o1m && _o1m.data) || {};
const company = { ...((settings && settings.get('company', null)) || {}), ...(_of.company || {}) };
const _og = _of.domain || {};
const host = _og.mode === 'custom' ? normHost(_og.host) : sharedHost();
const _o1n = getUser() || {};
let license = null;
try { license = await api.call('license.get'); } catch { license = null; }
return handoverData({ state: _o1m, company, owner: { username: _o1n.username, full_name: _o1n.full_name }, users, domain: host,
versions: { web: config.APP_VERSION, server: _o1i, engine: engineInfo && engineInfo.version }, check: _of.lastCheck || null, license });
};
return ctl;
}
export function sharedHost() {
let _o1n = '';
try { _o1n = publicUrl() || ''; } catch { _o1n = ''; }
if (!_o1n && typeof location !== 'undefined') _o1n = location.origin;
return normHost(_o1n) || '';
}
function _o1f() {
const D = globalThis.BDSData || globalThis.BDSProjects || {};
return Array.isArray(D.projects) ? D.projects : [];
}
export function wizardBeforeSetup({ ui, api, config = {}, showSetup, showConnect }) {
if (!wizardEnabled({ config })) return false;
let _o1m = loadState();
if (_o1m && _o1m.dismissed) return false;
if (_o1m && _o1m.res.account) { const s = JSON.parse(JSON.stringify(_o1m)); delete s.res.account; s.cur = 'account'; s.finished = 0; saveState(_o1m = s); }
if (_o1m && _o1m.demo && api && api.mode !== 'demo') saveState(_o1m = M.leaveDemo(_o1m, { connected: true }));
const pending = takePendingUrl();
const linkProblem = pending ? '' : takeLinkProblem();
let autoCheck = false;
if (pending && _o1m && M.ids(_o1m).includes('allow')) {
let _o1e = M.setData(_o1m, { url: pending });
try { _o1e = M.goTo(_o1e, 'allow'); } catch { }
autoCheck = true;
saveState(_o1m = _o1e); clearPendingUrl();
}
ensureCss(new URL('./wizard.css', import.meta.url).href, 'bds-wizard-css');
const { h, mountTo } = ui;
const _o1d = document.getElementById('app');
_o1d.className = 'app app-auth app-wiz';
const _oi = _o1m && _o1m.flow && _o1m.cur === 'account' && !(_o1m.data && _o1m.data.slowAccount) ? quickIdentity(api) : Promise.resolve('');
const _oa = h('div', { class: 'wiz-body' }, ui.spinner ? ui.spinner() : null);
const ribbon = api && api.mode === 'demo' ? h('div', { class: 'ribbon', role: 'note', 'data-testid': 'demo-ribbon' }, h('span', { class: 'ribbon-dot' }),
h('span', null, isSaleEdition(config) ? NOT_REAL_TEXT : 'Đang xem thử – dữ liệu mẫu')) : null;
mountTo(_o1d, ribbon, h('main', { class: 'auth wiz-auth' }, h('div', { class: 'auth-card wiz-card', 'data-testid': 'wizard' },
h('div', { class: 'brand' }, h('img', { src: 'assets/icon.svg', alt: '', class: 'brand-mark', width: 44, height: 44 }),
h('div', null, h('div', { class: 'brand-name' }, 'BDS Studio'), h('div', { class: 'brand-tag' }, 'Trợ lý cài đặt'))), _oa)));
let _o1o = null;
const ctl = _oe({ mode: 'pre', ui, api, config, onSet: () => {} });
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
ctl.ready.then(() => _oi).then((email) => {
if (email) {
try { sessionStorage.setItem('bds:setup_email', JSON.stringify({ email, use_account_email: true, via: 'ticket', at: Date.now() })); } catch { }
showSetup(); return;
}
_o1o = mountWizard(_oa, ctl);
});
return true;
}
export async function quickIdentity(api, tok = setupToken()) {
if (!api || api.mode === 'demo' || !tok || typeof api.callRaw !== 'function') return '';
try {
const _o1a = await api.callRaw('setup.identity', { setup_token: tok });
const em = String((_o1a && _o1a.email) || '').trim();
return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em) ? em : '';
} catch { return ''; }
}
export function installWizard({ S, appHooks, ui, config = {}, nav = () => {} }) {
if (!wizardEnabled({ config })) return null;
ensureCss(new URL('./wizard.css', import.meta.url).href, 'bds-wizard-css');
const _ot = () => !S.user || !S.user.role || S.user.role === 'owner' || !!S.user.legacy;
const settings = S.settings;
let modal = null; let _o17 = null;
const _o12 = (mode, onSet) => {
const ctl = _oe({ mode, ui, api: S.api, config, auth: S.auth, appHooks, store: S.store, settings, nav, getUser: () => S.user, onSet });
ctl.goSettings = (section) => { _od(); nav('settings/' + section); _o1k(); };
ctl.renderTfa = async (_oa) => { try { const _o10 = await import('../tfa.34d52e1fe4.js'); await _o10.renderTfaPanel(_oa, { ui, auth: S.auth, nav }); } catch (e) { _oa.append(ui.h('p', { class: 'muted small' }, 'Không mở được khung 2 lớp: ' + (e.message || e))); } };
ctl.beforeNext = async (id) => {
if (id === 'company') { await _o5(ctl.state); await _o6(ctl.state); }
if (id === 'diachi' && ctl.portal) { const _of = ((ctl.state || {}).data || {}).diachi || {}; if (_of.url) { await ctl.finishPortal({ url: _of.url, domain: _of.domain && _of.url === 'https://' + _of.domain ? _of.domain : '' }); return false; } }
return true;
};
ctl.close = () => _od();
return ctl;
};
const _o19 = appHooks.extraSections && appHooks.extraSections.__wiz ? appHooks.extraSections.__prev : appHooks.extraSections;
const _o1h = (ctx) => [...(typeof _o19 === 'function' ? _o19(ctx) : []), ...(_ot() ? [[SECTION, 'check', 'Trợ lý cài đặt', (body) => renderPanel(body)]] : [])];
_o1h.__wiz = true; _o1h.__prev = _o19;
appHooks.extraSections = _o1h;
const api = { open, state: loadState, renderPanel, applyClean, beforeStep: (id) => M.beforeStep(loadState(), id), pendingRequired: () => M.pendingRequired(loadState()),
quietTfa: () => { const s = loadState(); return !!(s && s.flow === 'personal' && !s.dismissed && !s.finished && M.ids(s).includes('telegram') && !M.isDone(s, 'telegram')); } };
window.__bds = { ...(window.__bds || {}), wizard: api };
if (!_ot()) return api;
applyClean();
if (settings && settings.on) settings.on('install.clean', applyClean);
let _o1m = loadState();
const _om = takeHandoff();
if (_om && (!_o1m || _o1m.portal)) _o1m = saveState(_oj(_om));
if (_om) S.wizardHandoff = _om;
if (isPortal(config)) _o18();
if (_o1m && _o1m.demo && S.api && S.api.mode !== 'demo') _o1m = saveState(M.leaveDemo(_o1m, { connected: true }));
if (_o1m && _o1m.origin === 'new' && !_o1m.dismissed && !_o1m.finished) {
_o1m = saveState(M.afterLogin(_o1m, { username: S.user && S.user.username }));
window.__bds.licenseHold = _o6(_o1m);
onb.saveState({ dismissed: true });
try { if (S.video && !S.video.record() && !(S.video.offered && S.video.offered())) S.video.setMode('off', 'wizard').catch(() => { }); } catch { }
_oc();
_o2(_o1m).catch((e) => report('wizard.after', e));
} else if (_o1m && !_o1m.dismissed && (!_o1m.finished || M.pendingRequired(_o1m).length)) _o1k();
return api;
function _ok(s) {
if (!s || s.flow !== 'personal' || !S.wizardHandoff) return false;
const _ow = M.ids(s).filter((id) => !M.isDone(s, id) && id !== 'finish');
return _ow.every((id) => { const _o1m = M.steps(s).find((_o1r) => _o1r.id === id); return _o1m && !_o1m.required; });
}
function _o1c() {
S.wizardHandoff = null;
_o1k();
let host = ''; try { host = location.host; } catch { host = ''; }
const t = ui.toast('✅ Cài xong – đây là app riêng của anh/chị' + (host ? ' (' + host + ')' : '') + '. Khi rảnh: nối Telegram, bật AI ở nút "Trợ lý cài đặt" góc dưới.', 'ok', 9000);
if (t && t.addEventListener) t.addEventListener('click', () => open());
}
function _oj(h) {
let s = M.start(h.flow);
const now = Date.now();
for (const id of ['prepare', 'company', 'allow', 'account']) if (M.ids(s).includes(id)) s.res[id] = { s: 'ok', at: now, msg: 'Đã làm ở trang cài đặt' };
if (h.flow === 'company') {
const _o9 = h.domain ? String(h.domain).toLowerCase().replace(/^app\./, '') : '';
if (_o9) s.data.coDomain = { has: 'yes', domain: _o9 };
} else if (h.domain) { s.res.domain = { s: 'ok', at: now, msg: h.domain }; s.data.domain = { mode: 'custom', host: h.domain }; }
else if (M.ids(s).includes('domain')) { s.res.domain = { s: 'ok', at: now, msg: 'Địa chỉ mặc định – đã chọn ở trang cài đặt' }; s.data.domain = { mode: 'shared' }; }
s.samples = 'loaded';
s.cur = M.firstPending(s) || s.cur;
return s;
}
function _o18() {
if (document.querySelector('[data-testid="portal-banner"]')) return;
const _o1b = ((loadState() || {}).res || {}).diachi;
const _o1p = !!(_o1b && _o1b.s === 'later');
const _o8 = ui.h('div', { class: 'wiz-portal-banner', role: 'note', 'data-testid': 'portal-banner' },
ui.h('span', null, _o1p ? '⏳ Đang dùng app tạm ở trang cài đặt – bên bán gửi địa chỉ riêng qua email trong vòng 24 giờ; dữ liệu nằm trong Google của anh/chị, không mất khi chuyển.'
: '⚙️ Đây là TRANG CÀI ĐẶT, chưa phải app của anh/chị – làm xong bước "Địa chỉ app" để mở app riêng. Trang này không giữ dữ liệu.'),
ui.button('Tiếp tục cài đặt', () => open(), { kind: 'primary', small: true, icon: 'next', testid: 'portal-banner-open' }));
document.body.appendChild(_o8);
}
async function _o2(s) {
if (settings) {
if (settings.get('install.mode', '') !== s.flow) await settings.set('install.mode', s.flow);
if (!settings.get('install.clean', false)) await settings.set('install.clean', true);
}
await _o5(s);
await _o7(s);
applyClean();
if (s.flow === 'personal' && s.samples === 'none' && S.store) {
try { await Samples.loadSamples(S.store, { source: _o1f() }); saveState({ ...loadState(), samples: 'loaded' }); } catch (e) { report('wizard.samples', e); }
}
if (loadState() && loadState().closed) _o1k();
else if (_ok(loadState())) _o1c();
else _o1q(() => open());
}
function _o6(s) {
if (!s || !S.api || (config.edition || 'owner') === 'owner') return Promise.resolve(null);
const p = { edition: s.flow === 'company' ? 'cong-ty' : 'ca-nhan' };
const _o4 = _o3();
if (_o4) p.app_url = _o4;
const _ob = (s.data && s.data.company) || {};
if (s.flow === 'company' && _ob.name) p.company_name = String(_ob.name);
return S.api.call('instance.set', p).then(async (_o1a) => {
S.status = { ...(S.status || {}), edition: p.edition };
if (p.edition === 'cong-ty') { try { await S.api.call('members.isolate_now', {}); } catch { } }
try { if (S.auth && typeof S.auth.me === 'function') await S.auth.me(); } catch { }
return _o1a;
}).catch((e) => { report('wizard.edition', e); return null; });
}
function _o3() {
try {
if (isPortal(config) || location.protocol !== 'https:' || /^(127\.0\.0\.1|localhost|\[::1\])$/.test(location.hostname)) return '';
return location.origin;
} catch { return ''; }
}
async function _o7(s) {
const em = String((s && s.data && s.data.email) || '').trim();
if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em) || !S.auth || typeof S.auth.setMyEmail !== 'function') return;
if (S.user && S.user.email_gate) return;
if (S.user && String(S.user.email || '').trim().toLowerCase() === em.toLowerCase()) return;
try { await S.auth.setMyEmail(em); } catch (e) { report('wizard.email', e); }
}
async function _o5(s) {
const _ob = s && s.data && s.data.company;
if (!settings || !_ob || !_ob.name) return;
const cur = settings.get('company', {}) || {};
if (cur.name !== _ob.name || cur.tax !== _ob.tax || cur.logo !== _ob.logo) await settings.set('company', { name: _ob.name, tax: _ob.tax || '', logo: _ob.logo || '' });
const p = settings.get('profile', {}) || {};
if (!p.company || !p.brand) await settings.set('profile', { ...p, company: p.company || _ob.name, brand: p.brand || _ob.name });
}
function applyClean() { if (settings && settings.get('install.clean', false)) _oc(); }
function _oc() { if (S.data && Array.isArray(S.data.projects) && S.data.projects.length) S.data.projects = []; }
function open({ step = '' } = {}) {
_od(); _on();
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
ui.h('p', null, '✅ Đã chuyển sang app riêng của anh/chị: ', ui.h('strong', null, host), '. Từ nay mở app ở địa chỉ này (nên thêm vào màn hình chính).'),
ui.h('p', { class: 'muted small' }, 'Trang cài đặt đã tự xoá dữ liệu tạm trước khi chuyển. Muốn chắc chắn trên máy này: '),
ui.h('a', { class: 'btn btn-ghost btn-sm', href: clearUrl(config), target: '_blank', rel: 'noopener', 'data-testid': 'wiz-portal-clear' }, 'Xoá dữ liệu tạm trên trang cài đặt')));
const _oq = ui.h('div', { class: 'wiz-modal-inner' });
body.append(_oq);
target = _oq;
}
let _o1o = null;
ctl.set = (s) => { saveState(s); if (s && s.flow && settings && settings.get('install.mode', '') !== s.flow) settings.set('install.mode', s.flow).catch(() => {}); };
modal = ui.modal({ title: 'Trợ lý cài đặt', body, wide: true, cls: 'wiz-modal', onClose: () => {
modal = null;
const s = loadState();
if (s && !s.finished) saveState({ ...s, closed: Date.now() });
_o1k();
} });
ctl.ready.then(() => { _o1o = mountWizard(target, ctl); });
return modal;
}
function _od() { if (modal) { const _o10 = modal; modal = null; _o10.close(); } }
function _o1k() {
_on();
const s = loadState(); if (!s || s.dismissed) return;
const _o16 = M.pendingRequired(s);
if (s.finished && !_o16.length) return;
const label = s.finished ? 'Trợ lý cài đặt · còn ' + _o16.length + ' bước bắt buộc' : 'Trợ lý cài đặt · ' + M.stepText(s);
_o17 = ui.h('button', { type: 'button', class: 'wiz-pill', 'data-testid': 'wiz-resume', 'aria-label': label, onclick: () => open(s.finished && _o16.length ? { step: _o16[0].id } : {}) },
ui.icon ? ui.icon(s.finished ? 'help' : 'back', 18) : null, ui.h('span', null, label));
document.body.appendChild(_o17);
document.body.classList.add('has-wiz-pill');
}
function _on() { if (_o17) { _o17.remove(); _o17 = null; } if (typeof document !== 'undefined') document.body.classList.remove('has-wiz-pill'); }
function _o1q(fn, tries = 0) {
if (document.querySelector('.modal-back') && tries < 40) return setTimeout(() => _o1q(fn, tries + 1), 250);
fn();
}
function renderPanel(body) {
const { h, button } = ui;
const _oh = async () => {
const s = loadState();
ui.clear(body);
const _oa = h('div', { class: 'wiz-panel', 'data-testid': 'wiz-panel' });
body.append(_oa);
if (!s) {
_oa.append(h('p', null, 'Trợ lý dẫn từng bước: nối Telegram, AI, tên miền, xác thực 2 lớp, mời nhân viên… Mỗi bước có nút "Kiểm tra bước này" và cách sửa khi chưa đạt.'),
h('p', { class: 'muted small' }, 'Anh/chị dùng BDS Studio cho:'),
h('div', { class: 'btn-row' },
button('👤 Cá nhân', () => { saveState(M.start('personal', { installed: true })); open(); _oh(); }, { kind: 'secondary', testid: 'wiz-panel-personal' }),
button('🏢 Công ty', () => { saveState(M.start('company', { installed: true })); open(); _oh(); }, { kind: 'secondary', testid: 'wiz-panel-company' })));
return;
}
const p = M.progress(s);
_oa.append(
h('p', null, h('strong', null, (s.flow === 'company' ? '🏢 ' : '👤 ') + FLOW_LABEL[s.flow]), ' · ', s.finished ? 'đã xong' : 'đang làm', ' · ', p.done + '/' + p.total + ' bước'),
ui.progress(p.pct),
h('div', { class: 'btn-row' }, button(s.finished ? 'Xem lại trợ lý' : 'Tiếp tục cài đặt', () => open(), { kind: 'primary', small: true, icon: s.finished ? 'refresh' : 'next', testid: 'wiz-open' })));
const ctl = _o12('settings', () => {});
if (ctl.samples) {
const _o1g = h('div', { class: 'sub-block' });
_oa.append(_o1g);
const _o13 = await ctl.samples.count().catch(() => 0);
_o1g.append(h('h4', { class: 'section-title' }, 'Dữ liệu mẫu'),
h('p', { class: 'muted small', 'data-testid': 'wiz-panel-samples' }, _o13 ? 'Đang có ' + _o13 + ' mục dữ liệu mẫu (tên có chữ "Mẫu").' : 'Không có dữ liệu mẫu.'),
h('div', { class: 'btn-row' }, _o13
? button('Xoá toàn bộ dữ liệu mẫu', async () => {
if (!(await ui.confirm('Xoá toàn bộ dữ liệu mẫu? Dữ liệu anh/chị tự nhập không bị đụng tới.', { ok: 'Xoá dữ liệu mẫu', kind: 'danger' }))) return;
const _ou = await ctl.samples.clear(); ui.toast('Đã xoá ' + _ou + ' mục dữ liệu mẫu.', 'ok'); _oh();
}, { kind: 'danger', small: true, testid: 'wiz-panel-samples-clear' })
: button('Xem ví dụ', async () => { await ctl.samples.load(); ui.toast('Đã nạp ví dụ (tên có chữ "Mẫu").', 'ok'); _oh(); }, { kind: 'secondary', small: true, testid: 'wiz-panel-samples-load' })));
}
const _o11 = h('div', { class: 'sub-block' }, h('h4', { class: 'section-title' }, 'Đổi cách dùng'));
_oa.append(_o11);
if (s.flow === 'personal') {
_o11.append(h('p', { class: 'muted small' }, 'Nâng lên Công ty: giữ nguyên toàn bộ dữ liệu, thêm bước thông tin công ty, 2 lớp bắt buộc, mời nhân viên, biên bản bàn giao.'),
button('Nâng lên Công ty (giữ dữ liệu)', async () => {
const ok = await ui.confirm('Nâng lên Công ty – dữ liệu giữ nguyên. Nếu máy chủ đang nằm trong Gmail cá nhân, nên chuyển sang tài khoản Google công ty: trong Google Drive, chia sẻ Sheet "BDS Studio" cho tài khoản công ty rồi chuyển quyền sở hữu; khác tổ chức Workspace thì nhờ bên cài đặt chuyển giúp bằng sao lưu + khôi phục.', { ok: 'Nâng lên Công ty' });
if (!ok) return;
saveState(M.upgrade(s)); if (settings) await settings.set('install.mode', 'company');
await _o6(loadState());
ui.toast('Đã chuyển sang Công ty – làm tiếp các bước của công ty.', 'ok'); open(); _oh();
}, { kind: 'secondary', small: true, testid: 'wiz-upgrade' }));
} else {
_o11.append(h('p', { class: 'muted small' }, 'Chuyển về Cá nhân: chỉ được khi chỉ còn 1 người dùng (tài khoản Quản trị).'),
button('Chuyển về Cá nhân', async () => {
let users = 1;
try { const l = await S.api.call('users.list'); users = (Array.isArray(l) ? l : []).filter((_o1n) => !Number(_o1n.deleted) && _o1n.status !== 'locked').length || 1; } catch { users = 1; }
try { saveState(M.downgrade(s, { users })); if (settings) await settings.set('install.mode', 'personal'); await _o6(loadState()); ui.toast('Đã chuyển về Cá nhân.', 'ok'); _oh(); } catch (e) { ui.toast(e.message, 'warn', 6000); }
}, { kind: 'ghost', small: true, testid: 'wiz-downgrade' }));
}
_oa.append(h('div', { class: 'btn-row' }, button('Bắt đầu lại trợ lý', async () => {
if (!(await ui.confirm('Xoá tiến độ của trợ lý trên máy này và chọn lại từ đầu? Dữ liệu và cài đặt của app không bị đụng tới.', { ok: 'Bắt đầu lại' }))) return;
saveState(null); _on(); _oh();
}, { kind: 'ghost', small: true, testid: 'wiz-reset' })));
};
_oh().catch((e) => body.append(ui.h('p', { class: 'form-err' }, String(e.message || e))));
}
function report(where, e) { try { appHooks.errors && appHooks.errors.report('warn', where, String(e && e.message || e)); } catch { } }
}
export default { wizardEnabled, wizardBeforeSetup, installWizard, loadState, saveState };

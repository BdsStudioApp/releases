import { ensureCss, ls } from '../xkit.f03faf0986.js';
import { createApi, saveScriptUrl, scriptUrl } from '../api.024f831cb4.js';
import { EXEC_URL_RE, isExecUrl } from '../exec_url.4b6ba956ed.js';
import { API_SETTINGS_URL, verifiedReleaseFiles, publicBase } from '../updates.9704b81308.js';
import { publicUrl, releaseOrigin } from '../instance.0601c79adf.js';
import * as M from './machine.js';
import { makeChecks, browserEnv, browserProblems, normHost } from './checks.js';
import { diagnosticData, diagnosticText, handoverData } from './report.js';
import * as Samples from './samples.js';
import { mountWizard } from './view.js';
import { wizardEnabled } from './flag.js';
import * as onb from '../onboarding.d7e34c3f18.js';
import { FLOW_LABEL, isSaleEdition } from './steps.js';
import { NOT_REAL_TEXT } from './view.js';
import { confirmLeaveDemo } from './demodata.js';
import { isPortal, clearPortalData, takeHandoff, clearUrl } from '../portal.ccd3807f1c.js';
import { createProvisionClient, handoffUrl, pickInstallToken, PAGES_PREFIX, defaultAddressInfo, requestTicket, requestWish } from './provision.js';
import { parseToken } from '../license_logic.16b4f5bd9e.js';
import { doinguCheck } from './doingu.js';
import { engineDownload } from '../engine_dl.18c8a720c5.js';
export const STATE_KEY = 'bds:wizard';
export const SECTION = 'wizard';
const _o1 = 'bds:errlog';
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
let _o1h = null;
let _os = null;
export function loadInstance(fetchFn = (_o1l, _o13) => fetch(_o1l, _o13), loc = (typeof location !== 'undefined' ? location : null)) {
if (!_os && !(loc && loc.protocol === 'https:' && !/^(127\.0\.0\.1|localhost)$/.test(loc.hostname))) _os = Promise.resolve(null);
if (!_os) _os = Promise.resolve().then(() => fetchFn('instance.json', { cache: 'no-store' })).then((_o19) => (_o19 && _o19.ok ? _o19.json() : null))
.then((j) => (j && /^[a-z0-9-]{3,30}$/.test(String(j.slug || '')) ? { slug: j.slug, mode: j.mode || '', edition: j.edition || '', app_url: /^https:\/\//.test(String(j.app_url || '')) ? j.app_url : '', domains: Array.isArray(j.domains) ? j.domains.map(String) : [] } : null))
.catch(() => null);
return _os;
}
let _ol = null;
function _ox() {
if (!_ol) _ol = fetch('assets/wizard/google/index.json', { cache: 'no-cache' }).then((_o19) => (_o19.ok ? _o19.json() : {})).catch(() => ({}));
return _ol;
}
let _o2 = { w: 1280, h: 800 }, SHOT_SIZE = { w: 390, h: 760 }, EXT_KEYS = new Set();
function _o1j(j, def) { const w = Number(j && j.width), hh = Number(j && j.height); return w > 0 && hh > 0 ? { w, h: hh } : def; }
export function shotDims(_o1p, def) { const _o13 = _o1j({ width: _o1p && (_o1p.w || _o1p.width), height: _o1p && (_o1p.h || _o1p.height) }, def); return { w: _o13.w, h: _o13.h }; }
function _oy() {
if (!_o1h) _o1h = fetch('assets/wizard/shots.json', { cache: 'no-cache' }).then((_o19) => (_o19.ok ? _o19.json() : {})).then((j) => { SHOT_SIZE = _o1j(j, SHOT_SIZE); EXT_KEYS = new Set(Object.keys(j.ext || {})); return { ...(j.shots || {}), ...(j.ext || {}) }; }).catch(() => ({}));
return _o1h;
}
function _of({ mode, ui, api, config, auth = null, appHooks = {}, store = null, settings = null, nav = () => {}, getUser = () => null, onSet }) {
const last = {};
let shots = {};
let guide = {};
let _or = null;
let _o1g = '';
let engineInfo = null;
const ctl = {
mode, ui, config, last, demo: api && api.mode === 'demo', sale: isSaleEdition(config), sharedHost: sharedHost(),
api,
guideImage(key) { const _o1p = (guide.images || {})[key]; return _o1p && typeof _o1p.file === 'string' ? { src: _o1p.file, alt: _o1p.alt || '', caption: _o1p.caption || '', ...shotDims(_o1p, _o1j(guide, _o2)) } : null; },
get state() { return loadState(); },
set(s) { saveState(s); if (onSet) onSet(s); },
shotUrl: (name) => shots[name] || null,
images(a) {
const imgs = guide.images || {}, steps = guide.steps || {};
const byGuide = a.guide ? [].concat(a.guide).flatMap((g) => (steps[g] && Array.isArray(steps[g].images) ? steps[g].images : [])) : [];
let keys = byGuide.length ? byGuide : a.imgs || (a.slot && guide.slots ? guide.slots[a.slot] : null) || [];
if (!Array.isArray(keys)) keys = [keys];
const gs = _o1j(guide, _o2);
const _o14 = keys.map((_ou) => imgs[_ou]).filter((_o1p) => _o1p && typeof _o1p.file === 'string').map((_o1p) => ({ src: _o1p.file, alt: _o1p.alt || '', caption: _o1p.caption || '', ...shotDims(_o1p, gs) }));
if (!_o14.length && a.slot && shots[a.slot]) _o14.push({ src: shots[a.slot], alt: '', caption: '', ...(EXT_KEYS.has(a.slot) ? gs : SHOT_SIZE) });
if (!_o14.length && a.shot && shots[a.shot]) _o14.push({ src: shots[a.shot], alt: '', caption: '', ...(EXT_KEYS.has(a.shot) ? gs : SHOT_SIZE) });
return _o14;
},
installer: {
paths: INSTALLER,
load(force = false) {
if (!_or || force) {
let remote = '';
try { remote = publicBase(typeof location !== 'undefined' ? location : null, config) || releaseOrigin(); } catch { remote = ''; }
_or = verifiedReleaseFiles([INSTALLER.tatca, INSTALLER.caidat, INSTALLER.manifest], { local: '', remote }).then((_o19) => { if (!_o19.ok) _or = null; return _o19; });
}
return _or;
}
},
link: (_ou) => LINKS(config)[_ou] || '',
async run(id, args) {
let _o19;
try { _o19 = await checks[id](args); } catch (e) { _o19 = { ok: false, cause: 'Lỗi khi kiểm: ' + (e.message || e), fix: 'Thử lại; vẫn lỗi thì bấm "Cần giúp?".' }; }
if (_o19 && _o19.version) _o1g = _o19.version;
if (id === 'finish' && _o19) ctl.set(M.setData(ctl.state, { lastCheck: { text: _o19.msg || '', bad: (_o19.items || []).filter((_o1p) => _o1p.ok === false).length, at: Date.now() } }));
last[id] = _o19;
return _o19;
},
async diagnostics() {
if (!_o1g) { try { _o1g = ((await api.call('status')) || {}).version || ''; } catch { } }
const env = { ...browserEnv(), screen: typeof screen !== 'undefined' ? screen.width + '×' + screen.height : '', lang: typeof navigator !== 'undefined' ? navigator.language : '' };
let errors = [];
try { errors = JSON.parse(localStorage.getItem(_o1) || '[]'); } catch { errors = []; }
const url = scriptUrl(config);
return diagnosticText(diagnosticData({
state: ctl.state, app: { version: config.APP_VERSION, mode: api ? api.mode : '', server_version: _o1g, server_host: url ? url : '' },
env, problems: browserProblems(env), last, errors, engine: engineInfo && engineInfo.running ? engineInfo : null
}));
}
};
ctl.defaultAddress = () => defaultAddressInfo({ instance: ctl.instance, diachi: (((ctl.state || {}).data || {}).diachi) || null,
host: (typeof location !== 'undefined' && location.origin) || sharedHost(), sale: isSaleEdition(config), config });
const checks = makeChecks({
api, settings, auth, config: { ...config, SHARED_HOST: sharedHost() }, appHooks, getState: () => ctl.state || { data: {} }, defaultAddress: () => ctl.defaultAddress(),
apiFor: (url) => { const _o18 = scriptUrl({}); saveScriptUrl(url); try { return createApi({ config, timeoutMs: 120000 }); } finally { saveScriptUrl(_o18 || null); } }
});
ctl.checks = checks;
ctl.portal = isPortal(config);
ctl.provision = createProvisionClient({ url: config.PROVISION_URL });
ctl.navigate = (_o1l) => location.assign(_o1l);
ctl.installToken = async ({ tries = 6, waitMs = 5000 } = {}) => {
let _ov = '';
for (let _oo = 0; _oo < tries; _oo++) {
let _op = null;
try { _op = await api.call('license.get', {}); } catch (e) { _ov = e.userMessage || e.message || ''; }
const t = _op ? pickInstallToken(_op, parseToken) : null;
if (t) return t;
const _ow = typeof window !== 'undefined' && window.__bds && window.__bds.license;
if (_oo === 0 && _ow && typeof _ow.check === 'function') { try { await _ow.check({ force: true }); } catch { } continue; }
if (_oo < tries - 1) await new Promise((_o19) => setTimeout(_o19, waitMs));
}
throw new Error('Chưa nhận được mã cài đặt từ máy chủ bản quyền' + (_ov ? ' (' + _ov + ')' : '') + '. Kiểm tra mạng rồi bấm "Thử lại"; vẫn lỗi thì bấm "Cần giúp?".');
};
ctl.provisionTicket = async (slug) => {
await ctl.installToken();
const _op = await api.call('license.get', { id_token: true });
const _ow = (config && config.licensing) || {};
return requestTicket({ licenseUrl: _ow.server_url, install_id: _op && _op.install_id, id_token: _op && _op.id_token, slug });
};
ctl.sendWish = async ({ slug = '', domain = '' } = {}) => {
await ctl.installToken({ tries: 3, waitMs: 3000 }).catch(() => null);
const _op = await api.call('license.get', { id_token: true });
const _ow = (config && config.licensing) || {};
return requestWish({ licenseUrl: _ow.server_url, install_id: _op && _op.install_id, id_token: _op && _op.id_token, slug, domain });
};
ctl.finishPortal = async ({ url, domain = '' } = {}) => {
const _o1k = ctl.state || {};
const target = handoffUrl(url, { execUrl: scriptUrl(config), flow: _o1k.flow, domain });
if (!target) throw new Error(isExecUrl(scriptUrl(config)) ? 'Địa chỉ app không hợp lệ: ' + url : 'Chưa nối máy chủ (thiếu địa chỉ …/exec) – quay lại bước "Tạo máy chủ".');
try { if (api && api.token && api.mode !== 'demo') await api.call('logout', {}); } catch { }
await clearPortalData();
ctl.navigate(target);
return target;
};
checks.doingu = async () => doinguCheck(ctl.state);
checks.diachi = async () => {
const _og = ((ctl.state || {}).data || {}).diachi || {};
if (!ctl.provision.configured) {
const w = ((ctl.state || {}).data || {}).wish || {};
return { ok: false, cause: w.sent ? 'Đã gửi tên ' + (w.full || w.name) + ' – chờ bên bán tạo địa chỉ riêng (trong vòng 24 giờ).' : 'Chưa có địa chỉ riêng – bên bán tạo giúp.',
fix: (w.sent ? '' : 'Gõ tên muốn dùng ở trên → bấm "Gửi tên cho bên bán". ') + 'Bấm "Làm sau" để dùng app ngay ở địa chỉ này; dữ liệu không mất khi chuyển.' };
}
if (!_og.slug) return { ok: false, cause: 'Chưa tạo địa chỉ app.', fix: 'Chọn địa chỉ miễn phí hoặc tên miền riêng ở trên rồi bấm "Tạo ngay".' };
try {
const _o19 = await ctl.provision.status(_og.slug);
if (_o19.status === 'ok') return { ok: true, msg: 'App đã chạy ở ' + String(_o19.url || '').replace(/^https:\/\//, '') };
if (_o19.status === 'cho_dns') return { ok: false, cause: 'App đã tạo, tên miền ' + (_o19.domain || '') + ' chưa chạy.', fix: 'Kiểm lại bản ghi CNAME ở nơi quản lý tên miền; chờ thêm (5 phút–24 giờ) rồi kiểm lại.' };
if (_o19.status === 'fail') return { ok: false, cause: _o19.message || 'Tạo app chưa được.', fix: 'Bấm "Chọn lại" ở trên để tạo lại; vẫn lỗi thì bấm "Cần giúp?".' };
return { ok: false, cause: 'Đang tạo app…', fix: 'Chờ 1–3 phút rồi kiểm lại.' };
} catch (e) { return { ok: false, cause: e.message || 'Không hỏi được dịch vụ tạo app.', fix: 'Kiểm tra mạng rồi thử lại.' }; }
};
ctl.ready = Promise.all([_oy(), _ox(), loadInstance()]).then(([_oz, g, _oo]) => { shots = _oz || {}; guide = g || {}; ctl.instance = _oo; });
ctl.cnameTarget = () => {
const _og = (((ctl.state || {}).data || {}).diachi) || {};
if (_og.cname_target) return _og.cname_target;
const slug = (ctl.instance && ctl.instance.slug) || _og.slug || '';
return slug ? PAGES_PREFIX + slug + '.pages.dev' : (config.CNAME_TARGET || '');
};
if (store) {
ctl.samples = {
count: () => Samples.countSamples(store),
async load() { const _o19 = await Samples.loadSamples(store, { source: _o1d() }); ctl.set({ ...ctl.state, samples: 'loaded' }); return _o19; },
async clear() { const _o12 = await Samples.clearSamples(store); ctl.set({ ...ctl.state, samples: 'cleared' }); return _o12; }
};
}
ctl.nav = nav;
ctl.getUser = getUser;
ctl.handover = async () => {
const _o1k = ctl.state;
let users = [];
try { const l = await api.call('users.list'); users = (Array.isArray(l) ? l : []).filter((_o1l) => !Number(_o1l.deleted)); } catch { users = []; }
if (!_o1g) { try { _o1g = ((await api.call('status')) || {}).version || ''; } catch { } }
const _og = (_o1k && _o1k.data) || {};
const company = { ...((settings && settings.get('company', null)) || {}), ...(_og.company || {}) };
const _oh = _og.domain || {};
const host = _oh.mode === 'custom' ? normHost(_oh.host) : sharedHost();
const _o1l = getUser() || {};
let license = null;
try { license = await api.call('license.get'); } catch { license = null; }
return handoverData({ state: _o1k, company, owner: { username: _o1l.username, full_name: _o1l.full_name }, users, domain: host,
versions: { web: config.APP_VERSION, server: _o1g, engine: engineInfo && engineInfo.version }, check: _og.lastCheck || null, license });
};
return ctl;
}
export function sharedHost() {
let _o1l = '';
try { _o1l = publicUrl() || ''; } catch { _o1l = ''; }
if (!_o1l && typeof location !== 'undefined') _o1l = location.origin;
return normHost(_o1l) || '';
}
function _o1d() {
const _o0 = globalThis.BDSData || globalThis.BDSProjects || {};
return Array.isArray(_o0.projects) ? _o0.projects : [];
}
export function wizardBeforeSetup({ ui, api, config = {}, showSetup, showConnect }) {
if (!wizardEnabled({ config })) return false;
let _o1k = loadState();
if (_o1k && _o1k.dismissed) return false;
if (_o1k && _o1k.res.account) { const s = JSON.parse(JSON.stringify(_o1k)); delete s.res.account; s.cur = 'account'; s.finished = 0; saveState(_o1k = s); }
if (_o1k && _o1k.demo && api && api.mode !== 'demo') saveState(_o1k = M.leaveDemo(_o1k, { connected: true }));
const pending = takePendingUrl();
const linkProblem = pending ? '' : takeLinkProblem();
let autoCheck = false;
if (pending && _o1k && M.ids(_o1k).includes('allow')) {
let _o1c = M.setData(_o1k, { url: pending });
try { _o1c = M.goTo(_o1c, 'allow'); } catch { }
autoCheck = true;
saveState(_o1k = _o1c); clearPendingUrl();
}
ensureCss(new URL('./wizard.css', import.meta.url).href, 'bds-wizard-css');
const { h, mountTo } = ui;
const _o1b = document.getElementById('app');
_o1b.className = 'app app-auth app-wiz';
const _ob = h('div', { class: 'wiz-body' });
const ribbon = api && api.mode === 'demo' ? h('div', { class: 'ribbon', role: 'note', 'data-testid': 'demo-ribbon' }, h('span', { class: 'ribbon-dot' }),
h('span', null, isSaleEdition(config) ? NOT_REAL_TEXT : 'Đang xem thử – dữ liệu mẫu')) : null;
mountTo(_o1b, ribbon, h('main', { class: 'auth wiz-auth' }, h('div', { class: 'auth-card wiz-card', 'data-testid': 'wizard' },
h('div', { class: 'brand' }, h('img', { src: 'assets/icon.svg', alt: '', class: 'brand-mark', width: 44, height: 44 }),
h('div', null, h('div', { class: 'brand-name' }, 'BDS Studio'), h('div', { class: 'brand-tag' }, 'Trợ lý cài đặt'))), _ob)));
let _o1m = null;
const ctl = _of({ mode: 'pre', ui, api, config, onSet: () => {} });
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
ctl.ready.then(() => { _o1m = mountWizard(_ob, ctl); });
return true;
}
export function installWizard({ S, appHooks, ui, config = {}, nav = () => {} }) {
if (!wizardEnabled({ config })) return null;
ensureCss(new URL('./wizard.css', import.meta.url).href, 'bds-wizard-css');
const _ot = () => !S.user || !S.user.role || S.user.role === 'owner' || !!S.user.legacy;
const settings = S.settings;
let modal = null; let _o16 = null;
const _o11 = (mode, onSet) => {
const ctl = _of({ mode, ui, api: S.api, config, auth: S.auth, appHooks, store: S.store, settings, nav, getUser: () => S.user, onSet });
ctl.goSettings = (section) => { _oe(); nav('settings/' + section); _o1i(); };
ctl.renderTfa = async (_ob) => { try { const _oz = await import('../tfa.1fd07d9b62.js'); await _oz.renderTfaPanel(_ob, { ui, auth: S.auth, nav }); } catch (e) { _ob.append(ui.h('p', { class: 'muted small' }, 'Không mở được khung 2 lớp: ' + (e.message || e))); } };
ctl.beforeNext = async (id) => {
if (id === 'company') { await _o6(ctl.state); await _o7(ctl.state); }
if (id === 'diachi' && ctl.portal) { const _og = ((ctl.state || {}).data || {}).diachi || {}; if (_og.url) { await ctl.finishPortal({ url: _og.url, domain: _og.domain && _og.url === 'https://' + _og.domain ? _og.domain : '' }); return false; } }
return true;
};
ctl.close = () => _oe();
return ctl;
};
const _o18 = appHooks.extraSections && appHooks.extraSections.__wiz ? appHooks.extraSections.__prev : appHooks.extraSections;
const _o1f = (ctx) => [...(typeof _o18 === 'function' ? _o18(ctx) : []), ...(_ot() ? [[SECTION, 'check', 'Trợ lý cài đặt', (body) => renderPanel(body)]] : [])];
_o1f.__wiz = true; _o1f.__prev = _o18;
appHooks.extraSections = _o1f;
const api = { open, state: loadState, renderPanel, applyClean, beforeStep: (id) => M.beforeStep(loadState(), id), pendingRequired: () => M.pendingRequired(loadState()) };
window.__bds = { ...(window.__bds || {}), wizard: api };
if (!_ot()) return api;
applyClean();
if (settings && settings.on) settings.on('install.clean', applyClean);
let _o1k = loadState();
const _om = takeHandoff();
if (_om && (!_o1k || _o1k.portal)) _o1k = saveState(_ok(_om));
if (_om) S.wizardHandoff = _om;
if (isPortal(config)) _o17();
if (_o1k && _o1k.demo && S.api && S.api.mode !== 'demo') _o1k = saveState(M.leaveDemo(_o1k, { connected: true }));
if (_o1k && _o1k.origin === 'new' && !_o1k.dismissed && !_o1k.finished) {
_o1k = saveState(M.afterLogin(_o1k, { username: S.user && S.user.username }));
window.__bds.licenseHold = _o7(_o1k);
onb.saveState({ dismissed: true });
try { if (S.video && !S.video.record() && !(S.video.offered && S.video.offered())) S.video.setMode('off', 'wizard').catch(() => { }); } catch { }
_od();
_o3(_o1k).catch((e) => report('wizard.after', e));
} else if (_o1k && !_o1k.dismissed && (!_o1k.finished || M.pendingRequired(_o1k).length)) _o1i();
return api;
function _ok(h) {
let s = M.start(h.flow);
const now = Date.now();
for (const id of ['prepare', 'company', 'allow', 'account']) if (M.ids(s).includes(id)) s.res[id] = { s: 'ok', at: now, msg: 'Đã làm ở trang cài đặt' };
if (h.flow === 'company') {
const _oa = h.domain ? String(h.domain).toLowerCase().replace(/^app\./, '') : '';
if (_oa) s.data.coDomain = { has: 'yes', domain: _oa };
} else if (h.domain) { s.res.domain = { s: 'ok', at: now, msg: h.domain }; s.data.domain = { mode: 'custom', host: h.domain }; }
else if (M.ids(s).includes('domain')) { s.res.domain = { s: 'ok', at: now, msg: 'Địa chỉ mặc định – đã chọn ở trang cài đặt' }; s.data.domain = { mode: 'shared' }; }
s.samples = 'loaded';
s.cur = M.firstPending(s) || s.cur;
return s;
}
function _o17() {
if (document.querySelector('[data-testid="portal-banner"]')) return;
const _o1a = ((loadState() || {}).res || {}).diachi;
const _o1n = !!(_o1a && _o1a.s === 'later');
const _o9 = ui.h('div', { class: 'wiz-portal-banner', role: 'note', 'data-testid': 'portal-banner' },
ui.h('span', null, _o1n ? '⏳ Đang dùng app tạm ở trang cài đặt – bên bán gửi địa chỉ riêng qua email trong vòng 24 giờ; dữ liệu nằm trong Google của anh/chị, không mất khi chuyển.'
: '⚙️ Đây là TRANG CÀI ĐẶT, chưa phải app của anh/chị – làm xong bước "Địa chỉ app" để mở app riêng. Trang này không giữ dữ liệu.'),
ui.button('Tiếp tục cài đặt', () => open(), { kind: 'primary', small: true, icon: 'next', testid: 'portal-banner-open' }));
document.body.appendChild(_o9);
}
async function _o3(s) {
if (settings) {
if (settings.get('install.mode', '') !== s.flow) await settings.set('install.mode', s.flow);
if (!settings.get('install.clean', false)) await settings.set('install.clean', true);
}
await _o6(s);
await _o8(s);
applyClean();
if (s.flow === 'personal' && s.samples === 'none' && S.store) {
try { await Samples.loadSamples(S.store, { source: _o1d() }); saveState({ ...loadState(), samples: 'loaded' }); } catch (e) { report('wizard.samples', e); }
}
if (loadState() && loadState().closed) _o1i(); else _o1o(() => open());
}
function _o7(s) {
if (!s || !S.api || (config.edition || 'owner') === 'owner') return Promise.resolve(null);
const p = { edition: s.flow === 'company' ? 'cong-ty' : 'ca-nhan' };
const _o5 = _o4();
if (_o5) p.app_url = _o5;
const _oc = (s.data && s.data.company) || {};
if (s.flow === 'company' && _oc.name) p.company_name = String(_oc.name);
return S.api.call('instance.set', p).then(async (_o19) => {
S.status = { ...(S.status || {}), edition: p.edition };
if (p.edition === 'cong-ty') { try { await S.api.call('members.isolate_now', {}); } catch { } }
try { if (S.auth && typeof S.auth.me === 'function') await S.auth.me(); } catch { }
return _o19;
}).catch((e) => { report('wizard.edition', e); return null; });
}
function _o4() {
try {
if (isPortal(config) || location.protocol !== 'https:' || /^(127\.0\.0\.1|localhost|\[::1\])$/.test(location.hostname)) return '';
return location.origin;
} catch { return ''; }
}
async function _o8(s) {
const _oj = String((s && s.data && s.data.email) || '').trim();
if (!_oj || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(_oj) || !S.auth || typeof S.auth.setMyEmail !== 'function') return;
if (S.user && S.user.email_gate) return;
if (S.user && String(S.user.email || '').trim().toLowerCase() === _oj.toLowerCase()) return;
try { await S.auth.setMyEmail(_oj); } catch (e) { report('wizard.email', e); }
}
async function _o6(s) {
const _oc = s && s.data && s.data.company;
if (!settings || !_oc || !_oc.name) return;
const cur = settings.get('company', {}) || {};
if (cur.name !== _oc.name || cur.tax !== _oc.tax || cur.logo !== _oc.logo) await settings.set('company', { name: _oc.name, tax: _oc.tax || '', logo: _oc.logo || '' });
const p = settings.get('profile', {}) || {};
if (!p.company || !p.brand) await settings.set('profile', { ...p, company: p.company || _oc.name, brand: p.brand || _oc.name });
}
function applyClean() { if (settings && settings.get('install.clean', false)) _od(); }
function _od() { if (S.data && Array.isArray(S.data.projects) && S.data.projects.length) S.data.projects = []; }
function open({ step = '' } = {}) {
_oe(); _on();
let s0 = loadState();
if (s0 && s0.closed) { s0 = { ...s0 }; delete s0.closed; saveState(s0); }
let review = false;
if (s0 && step && M.ids(s0).includes(step)) { try { saveState(s0 = M.goTo(s0, step)); review = true; } catch { } }
const body = ui.h('div', { class: 'wiz-modal-body', 'data-testid': 'wizard' });
const ctl = _o11('post', () => {});
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
let _o1m = null;
ctl.set = (s) => { saveState(s); if (s && s.flow && settings && settings.get('install.mode', '') !== s.flow) settings.set('install.mode', s.flow).catch(() => {}); };
modal = ui.modal({ title: 'Trợ lý cài đặt', body, wide: true, cls: 'wiz-modal', onClose: () => {
modal = null;
const s = loadState();
if (s && !s.finished) saveState({ ...s, closed: Date.now() });
_o1i();
} });
ctl.ready.then(() => { _o1m = mountWizard(target, ctl); });
return modal;
}
function _oe() { if (modal) { const _oz = modal; modal = null; _oz.close(); } }
function _o1i() {
_on();
const s = loadState(); if (!s || s.dismissed) return;
const _o15 = M.pendingRequired(s);
if (s.finished && !_o15.length) return;
const label = s.finished ? 'Trợ lý cài đặt · còn ' + _o15.length + ' bước bắt buộc' : 'Trợ lý cài đặt · ' + M.stepText(s);
_o16 = ui.h('button', { type: 'button', class: 'wiz-pill', 'data-testid': 'wiz-resume', 'aria-label': label, onclick: () => open(s.finished && _o15.length ? { step: _o15[0].id } : {}) },
ui.icon ? ui.icon(s.finished ? 'help' : 'back', 18) : null, ui.h('span', null, label));
document.body.appendChild(_o16);
document.body.classList.add('has-wiz-pill');
}
function _on() { if (_o16) { _o16.remove(); _o16 = null; } if (typeof document !== 'undefined') document.body.classList.remove('has-wiz-pill'); }
function _o1o(fn, tries = 0) {
if (document.querySelector('.modal-back') && tries < 40) return setTimeout(() => _o1o(fn, tries + 1), 250);
fn();
}
function renderPanel(body) {
const { h, button } = ui;
const _oi = async () => {
const s = loadState();
ui.clear(body);
const _ob = h('div', { class: 'wiz-panel', 'data-testid': 'wiz-panel' });
body.append(_ob);
if (!s) {
_ob.append(h('p', null, 'Trợ lý dẫn từng bước: nối Telegram, AI, tên miền, máy dựng, 2 lớp, mời nhân viên… Mỗi bước có nút "Kiểm tra bước này" và cách sửa khi chưa đạt.'),
h('p', { class: 'muted small' }, 'Anh/chị dùng BDS Studio cho:'),
h('div', { class: 'btn-row' },
button('👤 Cá nhân', () => { saveState(M.start('personal', { installed: true })); open(); _oi(); }, { kind: 'secondary', testid: 'wiz-panel-personal' }),
button('🏢 Công ty', () => { saveState(M.start('company', { installed: true })); open(); _oi(); }, { kind: 'secondary', testid: 'wiz-panel-company' })));
return;
}
const p = M.progress(s);
_ob.append(
h('p', null, h('strong', null, (s.flow === 'company' ? '🏢 ' : '👤 ') + FLOW_LABEL[s.flow]), ' · ', s.finished ? 'đã xong' : 'đang làm', ' · ', p.done + '/' + p.total + ' bước'),
ui.progress(p.pct),
h('div', { class: 'btn-row' }, button(s.finished ? 'Xem lại trợ lý' : 'Tiếp tục cài đặt', () => open(), { kind: 'primary', small: true, icon: s.finished ? 'refresh' : 'next', testid: 'wiz-open' })));
const ctl = _o11('settings', () => {});
if (ctl.samples) {
const _o1e = h('div', { class: 'sub-block' });
_ob.append(_o1e);
const _o12 = await ctl.samples.count().catch(() => 0);
_o1e.append(h('h4', { class: 'section-title' }, 'Dữ liệu mẫu'),
h('p', { class: 'muted small', 'data-testid': 'wiz-panel-samples' }, _o12 ? 'Đang có ' + _o12 + ' mục dữ liệu mẫu (tên có chữ "Mẫu").' : 'Không có dữ liệu mẫu.'),
h('div', { class: 'btn-row' }, _o12
? button('Xoá toàn bộ dữ liệu mẫu', async () => {
if (!(await ui.confirm('Xoá toàn bộ dữ liệu mẫu? Dữ liệu anh/chị tự nhập không bị đụng tới.', { ok: 'Xoá dữ liệu mẫu', kind: 'danger' }))) return;
const _ou = await ctl.samples.clear(); ui.toast('Đã xoá ' + _ou + ' mục dữ liệu mẫu.', 'ok'); _oi();
}, { kind: 'danger', small: true, testid: 'wiz-panel-samples-clear' })
: button('Xem ví dụ', async () => { await ctl.samples.load(); ui.toast('Đã nạp ví dụ (tên có chữ "Mẫu").', 'ok'); _oi(); }, { kind: 'secondary', small: true, testid: 'wiz-panel-samples-load' })));
}
const _o10 = h('div', { class: 'sub-block' }, h('h4', { class: 'section-title' }, 'Đổi cách dùng'));
_ob.append(_o10);
if (s.flow === 'personal') {
_o10.append(h('p', { class: 'muted small' }, 'Nâng lên Công ty: giữ nguyên toàn bộ dữ liệu, thêm bước thông tin công ty, 2 lớp bắt buộc, mời nhân viên, biên bản bàn giao.'),
button('Nâng lên Công ty (giữ dữ liệu)', async () => {
const ok = await ui.confirm('Nâng lên Công ty – dữ liệu giữ nguyên. Nếu máy chủ đang nằm trong Gmail cá nhân, nên chuyển sang tài khoản Google công ty: trong Google Drive, chia sẻ Sheet "BDS Studio" cho tài khoản công ty rồi chuyển quyền sở hữu; khác tổ chức Workspace thì nhờ bên cài đặt chuyển giúp bằng sao lưu + khôi phục.', { ok: 'Nâng lên Công ty' });
if (!ok) return;
saveState(M.upgrade(s)); if (settings) await settings.set('install.mode', 'company');
await _o7(loadState());
ui.toast('Đã chuyển sang Công ty – làm tiếp các bước của công ty.', 'ok'); open(); _oi();
}, { kind: 'secondary', small: true, testid: 'wiz-upgrade' }));
} else {
_o10.append(h('p', { class: 'muted small' }, 'Chuyển về Cá nhân: chỉ được khi chỉ còn 1 người dùng (tài khoản Quản trị).'),
button('Chuyển về Cá nhân', async () => {
let users = 1;
try { const l = await S.api.call('users.list'); users = (Array.isArray(l) ? l : []).filter((_o1l) => !Number(_o1l.deleted) && _o1l.status !== 'locked').length || 1; } catch { users = 1; }
try { saveState(M.downgrade(s, { users })); if (settings) await settings.set('install.mode', 'personal'); await _o7(loadState()); ui.toast('Đã chuyển về Cá nhân.', 'ok'); _oi(); } catch (e) { ui.toast(e.message, 'warn', 6000); }
}, { kind: 'ghost', small: true, testid: 'wiz-downgrade' }));
}
_ob.append(h('div', { class: 'btn-row' }, button('Bắt đầu lại trợ lý', async () => {
if (!(await ui.confirm('Xoá tiến độ của trợ lý trên máy này và chọn lại từ đầu? Dữ liệu và cài đặt của app không bị đụng tới.', { ok: 'Bắt đầu lại' }))) return;
saveState(null); _on(); _oi();
}, { kind: 'ghost', small: true, testid: 'wiz-reset' })));
};
_oi().catch((e) => body.append(ui.h('p', { class: 'form-err' }, String(e.message || e))));
}
function report(where, e) { try { appHooks.errors && appHooks.errors.report('warn', where, String(e && e.message || e)); } catch { } }
}
export default { wizardEnabled, wizardBeforeSetup, installWizard, loadState, saveState };

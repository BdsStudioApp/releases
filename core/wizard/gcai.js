import { EXEC_URL_RE } from '../exec_url.4b6ba956ed.js';
export const SCOPES = [
'https://www.googleapis.com/auth/drive.file',
'https://www.googleapis.com/auth/script.projects',
'https://www.googleapis.com/auth/script.deployments'
];
export const GIS_SRC = 'https://accounts.google.com/gsi/client';
export const DRIVE_FILES = 'https://www.googleapis.com/drive/v3/files';
export const SCRIPT_PROJECTS = 'https://script.googleapis.com/v1/projects';
export const REVOKE_URL = 'https://oauth2.googleapis.com/revoke';
export const USERSETTINGS_URL = 'https://script.google.com/home/usersettings';
export const TOKEN_HOSTS = ['www.googleapis.com', 'script.googleapis.com', 'oauth2.googleapis.com'];
export const CSP_SOURCES = {
'script-src': ['https://accounts.google.com/gsi/client'],
'style-src': ['https://accounts.google.com/gsi/style'],
'frame-src': ['https://accounts.google.com/gsi/'],
'connect-src': ['https://accounts.google.com/gsi/', 'https://www.googleapis.com/drive/v3/', SCRIPT_PROJECTS, SCRIPT_PROJECTS + '/', REVOKE_URL]
};
export const COOP_VALUE = 'same-origin-allow-popups';
export const STATE_KEY = 'bds:gcai';
export const PROJECT_TITLE = 'BDS Studio – Máy chủ';
export const SHEET_NAME = 'BDS Studio – Máy chủ';
export const APP_PROP = 'bds_cai';
export const TICKET_FILE = 'CaiGoogle';
export const TICKET_RE = /var BDS_KIT_INSTALL_TICKET = '([a-f0-9]{48})';/;
export const RELEASE_FILES = { tatca: 'downloads/TatCa.gs', caidat: 'downloads/CaiDat.gs', manifest: 'downloads/sheet/appsscript.json' };
export const CLIENT_ID_RE = /^[0-9]{6,30}-[a-z0-9]{8,64}\.apps\.googleusercontent\.com$/;
export function clientIdOf(config = {}) {
const v = String((config && config.GOOGLE_OAUTH_CLIENT_ID) || '').trim();
return CLIENT_ID_RE.test(v) ? v : '';
}
export const available = (config, { portal = false } = {}) => !!portal && !!clientIdOf(config);
export function isPhone(nav = typeof navigator !== 'undefined' ? navigator : {}, mm = typeof matchMedia === 'function' ? matchMedia : null) {
const _ow = String((nav && nav.userAgent) || '');
if (/Android|iPhone|iPad|iPod|Mobile/i.test(_ow)) return true;
if (nav && nav.userAgentData && nav.userAgentData.mobile) return true;
try { return !!(mm && mm('(pointer: coarse)').matches && mm('(max-width: 900px)').matches); } catch { return false; }
}
export const ERR = {
DENIED: { cause: 'Anh/chị chưa bấm "Cho phép" ở màn Google.', fix: 'Bấm lại "Cài bằng tài khoản Google", chọn đúng tài khoản rồi bấm Cho phép (Allow).', retry: 'login' },
POPUP: { cause: 'Cửa sổ đăng nhập Google không mở được hoặc đã bị đóng.', fix: 'Bấm lại nút. Trình duyệt chặn cửa sổ bật lên: cho phép cửa sổ bật lên cho trang này (hoặc mở bằng Chrome/Safari, không mở trong Zalo/Facebook).', retry: 'login' },
PARTIAL: { cause: 'Còn thiếu quyền: màn Google có ô chọn và có ô chưa được tick.', fix: 'Bấm lại "Cài bằng tài khoản Google" và tick ĐỦ các ô (Drive, Apps Script) trước khi bấm Tiếp tục.', retry: 'login' },
AUTH: { cause: 'Phiên đăng nhập Google đã hết hạn (sau khoảng 1 giờ).', fix: 'Bấm "Đăng nhập Google lại" – trang làm tiếp đúng chỗ đang dở, không tạo máy chủ mới.', retry: 'login' },
API_OFF: { cause: 'Tài khoản Google này chưa bật "Google Apps Script API".', fix: 'Bấm "Mở trang bật Apps Script API" → gạt nút Google Apps Script API sang Bật (On) → quay lại đây. Google cần 1–5 phút để áp dụng – trang tự thử lại.', retry: 'auto' },
WORKSPACE_BLOCKED: { cause: 'Quản trị viên Google Workspace của công ty đã tắt Apps Script (hoặc chặn ứng dụng bên ngoài) cho tài khoản này.', fix: 'Nhờ quản trị viên bật Apps Script và cho phép ứng dụng "BDS Studio" (Bảng quản trị › Ứng dụng › Google Workspace › Apps Script; Bảo mật › Quyền truy cập API). Hoặc dùng Gmail cá nhân / tài khoản khác.', retry: 'manual' },
NOT_ANYONE: { cause: 'Tài khoản công ty không cho web app mở công khai ("Bất kỳ ai").', fix: 'Nhờ quản trị viên Google Workspace cho phép chia sẻ web app Apps Script ra ngoài tổ chức, rồi bấm Thử lại. Hoặc dùng Gmail cá nhân.', retry: 'manual' },
QUOTA: { cause: 'Google đang giới hạn số lần tạo (hạn mức trong ngày / quá nhiều yêu cầu).', fix: 'Đợi vài phút rồi bấm Thử lại – trang làm tiếp đúng chỗ, không tạo trùng. Vẫn lỗi: thử lại ngày mai.', retry: 'manual' },
SELLER_SETUP: { cause: 'Dịch vụ "Cài bằng Google" của bên bán chưa bật xong (dự án Google Cloud thiếu API).', fix: 'Dùng "Cài trên máy tính (cách cũ)" hoặc báo bên bán.', retry: 'manual' },
NO_URL: { cause: 'Google tạo xong bản triển khai nhưng chưa trả địa chỉ máy chủ (…/exec).', fix: 'Bấm Thử lại – trang hỏi lại Google địa chỉ của bản triển khai đã tạo.', retry: 'manual' },
NO_TICKET: { cause: 'Không đọc lại được vé cài đặt của máy chủ đã tạo dở.', fix: 'Bấm "Tạo máy chủ mới" để làm lại từ đầu (máy chủ dở dang cũ để nguyên trong Drive, xoá tay được).', retry: 'restart' },
FILES: { cause: 'Chưa lấy được tệp máy chủ đã kiểm chữ ký từ trang cài đặt.', fix: 'Kiểm tra mạng rồi bấm Thử lại. Vẫn lỗi: bấm "Cần giúp?".', retry: 'manual' },
NETWORK: { cause: 'Không tới được Google (mạng chập chờn hoặc bị chặn).', fix: 'Kiểm tra Wi-Fi/4G, tắt VPN/chặn quảng cáo cho trang này, rồi bấm Thử lại.', retry: 'manual' },
SERVER: { cause: 'Google đang bận (lỗi tạm thời).', fix: 'Đợi một chút rồi bấm Thử lại.', retry: 'manual' },
OTHER: { cause: 'Google báo lỗi khi tạo máy chủ.', fix: 'Bấm Thử lại. Vẫn lỗi: dùng "Cài trên máy tính (cách cũ)" hoặc bấm "Cần giúp?" và gửi phần Chi tiết kỹ thuật.', retry: 'manual' }
};
export class GError extends Error {
constructor(code, { status = 0, detail = '', stage = '' } = {}) {
const e = ERR[code] || ERR.OTHER;
super(e.cause);
this.name = 'GError'; this.code = ERR[code] ? code : 'OTHER'; this.cause_ = e.cause; this.fix = e.fix; this.retry = e.retry;
this.status = status; this.detail = String(detail || '').slice(0, 300); this.stage = stage;
}
}
export function classify(status, body) {
const e = (body && typeof body === 'object' && body.error) || {};
const _oh = typeof body === 'string' ? body : String(e.message || '');
const _ot = String(e.status || '');
const _oq = [...(Array.isArray(e.errors) ? e.errors.map((x) => x && x.reason) : []), ...(Array.isArray(e.details) ? e.details.map((x) => x && x.reason) : [])].filter(Boolean).join(' ');
const _o2 = _oh + ' ' + _ot + ' ' + _oq;
if (/has not enabled the Apps Script API|home\/usersettings/i.test(_o2)) return 'API_OFF';
if (/SERVICE_DISABLED|accessNotConfigured|has not been used in project|API has not been used|is disabled\. Enable it by visiting https:\/\/console/i.test(_o2)) return 'SELLER_SETUP';
if (status === 401 || /UNAUTHENTICATED|invalid authentication credentials/i.test(_ot + ' ' + _oh)) return 'AUTH';
if (status === 429 || /RESOURCE_EXHAUSTED|rateLimitExceeded|userRateLimitExceeded|quota/i.test(_o2)) return 'QUOTA';
if (/ACCESS_TOKEN_SCOPE_INSUFFICIENT|insufficientPermissions|insufficient authentication scopes/i.test(_o2)) return 'PARTIAL';
if (status === 403 && /admin|administrator|domain policy|organization|disabled for (?:your|this)|not allowed to (?:use|access) Apps Script|Apps Script is disabled/i.test(_o2)) return 'WORKSPACE_BLOCKED';
if (status === 404) return 'NOT_FOUND';
if (status >= 500) return 'SERVER';
return 'OTHER';
}
export function tokenHostOk(url) {
try { const _ov = new URL(String(url)); return _ov.protocol === 'https:' && TOKEN_HOSTS.includes(_ov.hostname); } catch { return false; }
}
export function googleClient({ fetchFn = (_ov, _oi) => fetch(_ov, _oi), getToken }) {
async function json(method, url, body, { stage = '' } = {}) {
if (!tokenHostOk(url)) throw new Error('gcai: từ chối gửi mã truy cập tới ' + String(url).slice(0, 80));
const tok = getToken && getToken();
if (!tok) throw new GError('AUTH', { stage });
const headers = { Authorization: 'Bearer ' + tok };
if (body !== undefined) headers['Content-Type'] = 'application/json; charset=utf-8';
let _oo;
try { _oo = await fetchFn(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer' }); } catch (e) {
throw new GError('NETWORK', { detail: String(e && e.message || e), stage });
}
let text = '';
try { text = await _oo.text(); } catch { text = ''; }
let data = null;
try { data = text ? JSON.parse(text) : {}; } catch { data = null; }
if (_oo.ok) return data || {};
const code = classify(_oo.status, data || text);
const _o9 = new GError(code === 'NOT_FOUND' ? 'OTHER' : code, { status: _oo.status, detail: ((data && data.error && data.error.message) || text || '').slice(0, 300), stage });
if (_oo.status === 404) _o9.notFound = true;
throw _o9;
}
return { json };
}
export function newTicket(rand = (n) => globalThis.crypto.getRandomValues(new Uint8Array(n))) {
return Array.from(rand(24)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
export function ticketSource(ticket) {
if (!/^[a-f0-9]{48}$/.test(String(ticket))) throw new Error('gcai: vé cài đặt sai dạng');
return '/**\n * BDS Studio – CaiGoogle.gs: do trang cài đặt tạo ("Cài bằng Google"). KHÔNG sửa, KHÔNG chia sẻ.\n'
+ ' * Vé cài đặt dùng 1 lần cho bước tạo tài khoản Chủ: CaiDat.gs › bdsKitPrepare_ chép vào Script Properties (setup_token) lúc máy chủ tự cài;\n'
+ ' * tạo tài khoản xong máy chủ xoá vé (setup_done = 1) – dòng dưới hết tác dụng.\n */\n'
+ "var BDS_KIT_INSTALL_TICKET = '" + ticket + "';\nvar BDS_KIT_INSTALL_VIA = 'google';\n";
}
export function ticketFrom(source) { const _og = TICKET_RE.exec(String(source || '')); return _og ? _og[1] : ''; }
export function manifestOk(text) {
try { const _oe = JSON.parse(text); return !!(_oe && _oe.webapp && _oe.webapp.executeAs === 'USER_DEPLOYING' && _oe.webapp.access === 'ANYONE_ANONYMOUS'); } catch { return false; }
}
export function projectFiles({ tatca, caidat, manifest }, ticket) {
if (!tatca || !caidat || !manifest) throw new GError('FILES', { detail: 'thiếu tệp' });
if (!manifestOk(manifest)) throw new GError('FILES', { detail: 'appsscript.json không có webapp USER_DEPLOYING / ANYONE_ANONYMOUS' });
return [
{ name: 'appsscript', type: 'JSON', source: manifest },
{ name: 'TatCa', type: 'SERVER_JS', source: tatca },
{ name: 'CaiDat', type: 'SERVER_JS', source: caidat },
{ name: TICKET_FILE, type: 'SERVER_JS', source: ticketSource(ticket) }
];
}
export function webAppOf(_o7) {
const _o8 = (_o7 && Array.isArray(_o7.entryPoints)) ? _o7.entryPoints : [];
const _ox = _o8.find((x) => x && x.entryPointType === 'WEB_APP' && x.webApp);
const url = _ox && _ox.webApp && String(_ox.webApp.url || '').replace(/[?#].*$/, '');
return { url: EXEC_URL_RE.test(url || '') ? url : '', access: (_ox && _ox.webApp && _ox.webApp.entryPointConfig && _ox.webApp.entryPointConfig.access) || '' };
}
const _os = (fn, d) => { try { return fn(); } catch { return d; } };
const _o0 = ['fileId', 'scriptId', 'version', 'deploymentId', 'execUrl', 'contentDone', 'authorized', 'apiOk', 'at'];
export function loadProgress(store = _os(() => globalThis.localStorage, null)) {
const _oe = _os(() => JSON.parse((store && store.getItem(STATE_KEY)) || 'null'), null);
if (!_oe || typeof _oe !== 'object') return {};
const _oi = {};
for (const _of of _o0) if (_oe[_of] !== undefined && _oe[_of] !== null && _oe[_of] !== '') _oi[_of] = _oe[_of];
if (_oi.execUrl && !EXEC_URL_RE.test(_oi.execUrl)) delete _oi.execUrl;
return _oi;
}
export function saveProgress(p, store = _os(() => globalThis.localStorage, null)) {
const _oi = {};
for (const _of of _o0) if (p && p[_of] !== undefined && p[_of] !== null && p[_of] !== '') _oi[_of] = p[_of];
_os(() => store && (Object.keys(_oi).length ? store.setItem(STATE_KEY, JSON.stringify(_oi)) : store.removeItem(STATE_KEY)));
return _oi;
}
export function stageOf(p = {}, _o9 = null) {
if (p.authorized && p.execUrl) return 4;
if (p.execUrl) return 3;
if (_o9 && _o9.code === 'API_OFF') return 2;
return 1;
}
const _om = (_or) => encodeURIComponent(_or);
export async function runInstall({ client, files, ticket = '', progress = {}, save = () => {}, onStep = () => {}, sleep = (ms) => new Promise((_oo) => setTimeout(_oo, ms)), tries = 3 } = {}) {
const p = { ...progress };
const _ol = (patch) => { Object.assign(p, patch, { at: Date.now() }); save({ ...p }); };
const _o5 = async (stage, fn) => {
for (let _od = 0; ; _od++) {
try { return await fn(); } catch (e) {
if (e && e.code && !e.stage) e.stage = stage;
if (e && (e.code === 'SERVER' || e.code === 'QUOTA') && _od < tries - 1) { await sleep(1500 * 2 ** _od); continue; }
if (e && typeof e === 'object') e.progress = { ...p };
throw e;
}
}
};
const _ok = (extra) => _o5('drive', () => client.json('PATCH', DRIVE_FILES + '/' + _om(p.fileId) + '?fields=id', { appProperties: extra })).catch(() => null);
if (!p.fileId) {
onStep('Đang tìm máy chủ tạo dở lần trước…');
const _on = "appProperties has { key='" + APP_PROP + "' and value='1' } and trashed = false and mimeType = 'application/vnd.google-apps.spreadsheet'";
const _ob = await _o5('drive', () => client.json('GET', DRIVE_FILES + '?q=' + _om(_on) + '&orderBy=createdTime%20desc&pageSize=5&spaces=drive&fields=' + _om('files(id,name,appProperties,createdTime)')));
const _oa = _ob && Array.isArray(_ob.files) ? _ob.files[0] : null;
if (_oa && _oa.id) {
const _o3 = _oa.appProperties || {};
_ol({ fileId: _oa.id, ...(_o3.bds_script ? { scriptId: _o3.bds_script } : {}), ...(Number(_o3.bds_ver) > 0 ? { version: Number(_o3.bds_ver) } : {}), ...(_o3.bds_dep ? { deploymentId: _o3.bds_dep } : {}), ...(_o3.bds_content === '1' ? { contentDone: true } : {}) });
} else {
onStep('Đang tạo Sheet dữ liệu trong Google Drive của anh/chị…');
const _o4 = await _o5('drive', () => client.json('POST', DRIVE_FILES + '?fields=id', { name: SHEET_NAME, mimeType: 'application/vnd.google-apps.spreadsheet', appProperties: { [APP_PROP]: '1', bds_v: '1' } }));
if (!_o4 || !_o4.id) throw Object.assign(new GError('OTHER', { detail: 'Drive không trả id tệp', stage: 'drive' }), { progress: { ...p } });
_ol({ fileId: _o4.id });
}
}
if (p.scriptId) {
try { await _o5('project', () => client.json('GET', SCRIPT_PROJECTS + '/' + _om(p.scriptId))); } catch (e) {
if (!(e && e.notFound)) throw e;
_ol({ scriptId: '', version: 0, deploymentId: '', contentDone: false, execUrl: '' });
delete p.scriptId; delete p.version; delete p.deploymentId; delete p.execUrl; p.contentDone = false;
}
}
if (!p.scriptId) {
onStep('Đang tạo máy chủ Apps Script gắn với Sheet…');
const _oj = await _o5('project', () => client.json('POST', SCRIPT_PROJECTS, { title: PROJECT_TITLE, parentId: p.fileId }));
if (!_oj || !_oj.scriptId) throw Object.assign(new GError('OTHER', { detail: 'Apps Script API không trả scriptId', stage: 'project' }), { progress: { ...p } });
_ol({ scriptId: _oj.scriptId, apiOk: true });
await _ok({ bds_script: _oj.scriptId });
} else if (!p.apiOk) _ol({ apiOk: true });
let _ou = ticket;
if (!p.contentDone) {
if (!_ou) throw Object.assign(new GError('NO_TICKET', { stage: 'content' }), { progress: { ...p } });
onStep('Đang chép mã máy chủ (đã kiểm chữ ký)…');
await _o5('content', () => client.json('PUT', SCRIPT_PROJECTS + '/' + _om(p.scriptId) + '/content', { files: projectFiles(files, _ou) }));
_ol({ contentDone: true });
await _ok({ bds_content: '1' });
} else if (!_ou) {
onStep('Đang đọc lại vé cài đặt của máy chủ tạo dở…');
const _o6 = await _o5('content', () => client.json('GET', SCRIPT_PROJECTS + '/' + _om(p.scriptId) + '/content'));
const _oa = ((_o6 && _o6.files) || []).find((x) => x && x.name === TICKET_FILE);
_ou = ticketFrom(_oa && _oa.source);
if (!_ou) throw Object.assign(new GError('NO_TICKET', { stage: 'content' }), { progress: { ...p } });
}
if (!(p.version > 0) && !p.deploymentId) {
onStep('Đang tạo phiên bản máy chủ…');
const v = await _o5('version', () => client.json('POST', SCRIPT_PROJECTS + '/' + _om(p.scriptId) + '/versions', { description: 'BDS Studio – cài bằng Google' }));
if (!v || !(Number(v.versionNumber) > 0)) throw Object.assign(new GError('OTHER', { detail: 'không có versionNumber', stage: 'version' }), { progress: { ...p } });
_ol({ version: Number(v.versionNumber) });
await _ok({ bds_ver: String(v.versionNumber) });
}
let _o7 = null;
if (!p.deploymentId) {
onStep('Đang triển khai máy chủ (web app)…');
_o7 = await _o5('deploy', () => client.json('POST', SCRIPT_PROJECTS + '/' + _om(p.scriptId) + '/deployments', { versionNumber: p.version, manifestFileName: 'appsscript', description: 'BDS Studio' }));
if (!_o7 || !_o7.deploymentId) throw Object.assign(new GError('NO_URL', { detail: 'không có deploymentId', stage: 'deploy' }), { progress: { ...p } });
_ol({ deploymentId: _o7.deploymentId });
await _ok({ bds_dep: _o7.deploymentId });
}
let _ox = webAppOf(_o7);
if (!_ox.url) {
onStep('Đang hỏi Google địa chỉ máy chủ…');
for (let _od = 0; _od < 3 && !_ox.url; _od++) {
if (_od) await sleep(2000 * _od);
_ox = webAppOf(await _o5('deploy', () => client.json('GET', SCRIPT_PROJECTS + '/' + _om(p.scriptId) + '/deployments/' + _om(p.deploymentId))));
}
}
if (_ox.access && _ox.access !== 'ANYONE_ANONYMOUS') throw Object.assign(new GError('NOT_ANYONE', { detail: 'access=' + _ox.access, stage: 'deploy' }), { progress: { ...p } });
if (!_ox.url) throw Object.assign(new GError('NO_URL', { stage: 'deploy' }), { progress: { ...p } });
_ol({ execUrl: _ox.url });
return { progress: { ...p }, ticket: _ou };
}
export async function execAuthorized(url, { fetchFn = (_ov, _oi) => fetch(_ov, _oi), timeoutMs = 15000 } = {}) {
if (!EXEC_URL_RE.test(String(url || ''))) return false;
const _o1 = typeof AbortController !== 'undefined' ? new AbortController() : null;
const t = _o1 ? setTimeout(() => _o1.abort(), timeoutMs) : null;
try {
const _oo = await fetchFn(url + '?gcai=' + Date.now().toString(36), { method: 'GET', credentials: 'omit', cache: 'no-store', redirect: 'follow', ...(_o1 ? { signal: _o1.signal } : {}) });
if (!_oo || !_oo.ok) return false;
const _oe = JSON.parse(await _oo.text());
return !!(_oe && _oe.ok && _oe.data && _oe.data.app === 'BDS Studio');
} catch { return false; } finally { if (t) clearTimeout(t); }
}
let _oc = null;
export function loadGis(doc = typeof document !== 'undefined' ? document : null, win = typeof window !== 'undefined' ? window : globalThis) {
const _op = () => win.google && win.google.accounts && win.google.accounts.oauth2;
if (_op()) return Promise.resolve(_op());
if (!_oc) {
_oc = new Promise((res, rej) => {
if (!doc) { rej(new GError('NETWORK', { detail: 'no document' })); return; }
const _or = doc.createElement('script');
_or.src = GIS_SRC; _or.async = true; _or.defer = true; _or.referrerPolicy = 'strict-origin';
_or.onload = () => (_op() ? res(_op()) : rej(new GError('NETWORK', { detail: 'GIS không sẵn sàng' })));
_or.onerror = () => { _oc = null; rej(new GError('NETWORK', { detail: 'không tải được ' + GIS_SRC })); };
doc.head.appendChild(_or);
});
}
return _oc;
}
export function tokenBroker(oauth2, clientId, { now = () => Date.now() } = {}) {
let tok = '', exp = 0, waiting = null;
const client = oauth2.initTokenClient({
client_id: clientId,
scope: SCOPES.join(' '),
include_granted_scopes: false,
callback: (resp) => {
const _ox = waiting; waiting = null;
if (!_ox) return;
if (!resp || resp.error) { _ox.rej(new GError('DENIED', { detail: resp && (resp.error_description || resp.error) })); return; }
const _o2 = typeof oauth2.hasGrantedAllScopes === 'function' ? oauth2.hasGrantedAllScopes(resp, ...SCOPES) : SCOPES.every((_or) => String(resp.scope || '').split(' ').includes(_or));
if (!_o2) { _ox.rej(new GError('PARTIAL', { detail: String(resp.scope || '') })); return; }
tok = String(resp.access_token || ''); exp = now() + Math.max(60, Number(resp.expires_in) || 3599) * 1000 - 60000;
_ox.res({ token: tok, expiresAt: exp });
},
error_callback: (_o9) => {
const _ox = waiting; waiting = null;
if (_ox) _ox.rej(new GError('POPUP', { detail: _o9 && _o9.type }));
}
});
return {
requestToken({ prompt = '' } = {}) {
return new Promise((res, rej) => { waiting = { res, rej }; client.requestAccessToken(prompt ? { prompt } : {}); });
},
token: () => (tok && now() < exp ? tok : ''),
forget() { tok = ''; exp = 0; },
async revoke(fetchFn = (_ov, _oi) => fetch(_ov, _oi)) {
const t = tok; tok = ''; exp = 0;
if (!t) return false;
try { await fetchFn(REVOKE_URL, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'token=' + encodeURIComponent(t), credentials: 'omit', referrerPolicy: 'no-referrer' }); return true; } catch { return false; }
}
};
}
export default { SCOPES, CSP_SOURCES, COOP_VALUE, clientIdOf, available, isPhone, classify, googleClient, runInstall, execAuthorized, loadGis, tokenBroker, newTicket, ticketSource, ticketFrom, projectFiles, webAppOf, loadProgress, saveProgress, stageOf, ERR, GError, USERSETTINGS_URL };

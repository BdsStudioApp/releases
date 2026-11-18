import { releaseOrigin, publicUrl, edition as EDITION } from './instance.0601c79adf.js';
import appConfig from '../config.js';
import { classifySelfUpdate, techLines, supportDiagnostic, scriptApiVerdict, needsMigration, MIGRATE } from './health_logic.9704b81308.js';
import { officialState, WORDS as OFFICIAL_WORDS } from './oneclick.c9ce44d759.js';
import { friendlyError } from './friendly_error.9704b81308.js';
import { supportContact } from './instance.0601c79adf.js';
import { engineDownload } from './engine_dl.18c8a720c5.js';
export const PUBLIC_URL = releaseOrigin() || publicUrl() || '';
const _o5 = {
web: 'Web app', gas: 'Máy chủ Apps Script', engine: 'Máy dựng video',
running: 'Đang chạy', latest: 'Mới nhất', code: 'Mã bản cài', newest: 'Bản mới nhất',
stLatest: 'Mới nhất', stUpdate: 'Có bản mới', stOff: 'chưa bật', stUnknown: 'chưa rõ',
webHow: 'Tự cập nhật: mỗi lần mở app sẽ tải bản mới ở nền.',
check: 'Kiểm tra cập nhật', reload: 'Tải lại để dùng bản mới', webReady: 'Đã có bản mới – bấm tải lại.', webLatest: 'Đang dùng bản mới nhất.',
gasDemo: 'Xem thử (máy chủ giả trong trình duyệt)', gasNone: 'chưa kết nối',
gasHow: 'Cách cập nhật máy chủ (khoảng 3 phút):',
gasSteps: [
'Bấm "Tải TatCa.gs" bên dưới, mở tệp, chọn tất cả và sao chép.',
'Mở script.google.com › dự án BDS Studio › tệp TatCa.gs: xoá hết, dán nội dung mới, bấm Lưu.',
'Chọn hàm setup ở thanh trên, bấm Chạy (cho phép nếu được hỏi).',
'Triển khai › Quản lý việc triển khai › bút chì › Phiên bản: Phiên bản mới › Triển khai. Đường dẫn app giữ nguyên.'
],
gasOk: 'Máy chủ đang ở bản mới nhất.',
dlGas: 'Tải TatCa.gs', dlEngine: 'Tải bộ cài máy dựng (cài lần đầu)',
engineOff: 'Máy dựng chưa bật trên máy này. Mở "BDS Studio" trên Mac/Windows (bấm đúp biểu tượng ở màn hình nền) rồi bấm Kiểm tra lại.',
engineOld: 'Máy dựng này là bản cũ, chưa tự cập nhật được: tải bản mới nhất, giải nén và chạy lại bộ cài (dữ liệu giữ nguyên).',
rollback: 'Khôi phục bản trước', recheck: 'Kiểm tra lại',
restarting: 'Đã thay bản mới, máy dựng đang khởi động lại…',
done: (v) => 'Đã cập nhật máy dựng lên v' + v + '.', rolled: (v) => 'Đã khôi phục máy dựng về v' + v + '.',
timeout: 'Máy dựng chưa bật lại sau 2 phút. Mở lại "BDS Studio" trên máy tính rồi bấm Kiểm tra lại.',
rollbackAsk: (v) => 'Khôi phục máy dựng về bản v' + v + '? Máy dựng sẽ tự khởi động lại.',
backups: 'Bản sao lưu', notes: 'Có gì mới',
upAuto: 'Cập nhật tự động', upAutoHow: 'Máy dựng tự cập nhật ở nền khi có bản mới đã ký số: tự tải từ kho phát hành chính thức, kiểm chữ ký rồi mới cài, giữ bản cũ để khôi phục. Dữ liệu, video, khoá Vbee giữ nguyên.',
autoOld: 'Máy dựng này chưa có "Cập nhật tự động": tải bản mới nhất, giải nén và chạy lại bộ cài một lần (dữ liệu giữ nguyên).',
unsigned: 'Bản chưa ký – không tự cập nhật',
unsignedHow: 'Bản trên trang app chưa có chữ ký số hợp lệ (bản dựng thiếu khoá ký, hoặc tệp bị sửa). App, máy chủ và máy dựng sẽ không tự cài bản này. Kiểm tra khoá ký RELEASE_SIGNING_KEY trong Cloudflare rồi dựng lại – xem docs/PHAT_HANH.md.',
unsignedShort: 'Chưa có bản mới đã ký số.',
unsignedHowSale: (contact) => 'Bản mới trên kênh phát hành chưa có chữ ký số hợp lệ, nên app, máy chủ và máy dựng KHÔNG tự cài bản này (để bảo vệ anh/chị khỏi bản bị sửa). Bản đang dùng và dữ liệu không bị ảnh hưởng; bên phát hành thường xử lý trong ít giờ.' + (contact ? ' Nếu kéo dài quá 1 ngày, liên hệ hỗ trợ: ' + contact + '.' : ''),
autoState: { waiting: 'Máy đang dựng video – sẽ tự cập nhật khi dựng xong.', downloading: 'Đang tải bản mới…', verifying: 'Đang kiểm chữ ký số và mã sha256…', installing: 'Đang cài bản mới…', restarting: 'Đã cài, máy dựng đang khởi động lại…', latest: 'Máy dựng đã ở bản mới nhất.' },
officialRow: 'Nguồn mã', unofficialShort: 'Bản không chính thức',
unofficialStaff: 'Mã máy chủ không khớp bản đã ký số. Nhờ Quản trị (Admin) vào Cài đặt › Phiên bản bấm "Cập nhật máy chủ".',
gasAuto: 'Cập nhật máy chủ', gasAutoHow: 'Bấm "Cập nhật máy chủ": máy chủ tự tải mã mới đã ký số, kiểm chữ ký + sha256, lưu lên Google Drive, chạy thử rồi mới dùng (giữ bản trước để quay về). Không cần bật Apps Script API; đường dẫn app giữ nguyên.',
migrateNote: 'Đây là lần dán tay CUỐI CÙNG: mã mới có phần khởi động tự cập nhật bằng mã đã ký trên Google Drive – các bản sau máy chủ tự lên, không cần bật Apps Script API hay cài đặt gì.',
gasUpdating: 'Máy chủ đang tự cập nhật (khoảng 30 giây)…', gasUpdated: (v) => 'Máy chủ đã cập nhật lên v' + v + '.', gasUpToDate: 'Máy chủ đã ở bản mới nhất.',
gasDemoNo: 'Chế độ Xem thử: máy chủ giả đi kèm web, không cần cập nhật.',
manualTitle: 'Hoặc dán tay (dự phòng):',
manualUpdTitle: 'Cập nhật bằng tay – dán tay TatCa.gs (dự phòng, khoảng 3 phút)',
manualUpdSteps: [
'Bấm "Tải TatCa.gs" (app kiểm chữ ký số trước khi tải – đúng tệp máy chủ tự cập nhật dùng), mở tệp, chọn tất cả, sao chép.',
'Mở Apps Script › dự án BDS Studio › tệp TatCa.gs: xoá hết, dán mã mới.',
'Bấm Lưu (biểu tượng đĩa mềm).',
'Triển khai › Quản lý triển khai › Sửa (bút chì) › Phiên bản: Phiên bản mới › Triển khai. Đường dẫn app giữ nguyên.'
],
manualUpdNote: 'Google hỏi quyền khi mở app lần đầu sau khi dán: chọn hàm setup › Chạy › Cho phép.',
dlVerifying: 'Đang kiểm chữ ký số của TatCa.gs…',
dlOk: (v, sha) => 'Đã kiểm chữ ký: đúng bản phát hành' + (v ? ' v' + v : '') + ' (sha256 ' + sha.slice(0, 12) + '…). Đã tải TatCa.gs.',
apiCheck: 'Kiểm tra Apps Script API', apiChecking: 'Đang hỏi Google (chỉ đọc danh sách triển khai, không thay gì)…',
oldServer: 'Máy chủ đang chạy bản chưa tự cập nhật được – dán mã máy chủ mới 1 lần (lần cuối) theo các bước dưới, sau đó tự cập nhật không cần cài đặt gì.',
scopeTitle: 'Google cần anh/chị cấp thêm quyền cho máy chủ',
scopeSteps: ['Bấm "Cho phép" → mở dự án BDS Studio → chọn hàm setup → Chạy → Cho phép.', 'Quay lại app, bấm "Cập nhật máy chủ" lần nữa.'],
signature: 'Bản cập nhật máy chủ chưa có chữ ký hợp lệ – app dừng lại để an toàn, máy chủ vẫn chạy bản cũ. Thử lại sau ít phút.',
manifestStep: 'Thay cả appsscript.json: Cài đặt dự án › đánh dấu "Hiển thị tệp kê khai appsscript.json" › mở appsscript.json, xoá hết, dán tệp appsscript.json mới trong bộ cài › Lưu, chạy setup › Cho phép (xem Hướng dẫn › Nâng cấp từ bản cũ).'
};
export const API_SETTINGS_URL = 'https://script.google.com/home/usersettings';
export function enableApiSteps(email = '') {
return [
'Mở ' + API_SETTINGS_URL + ' (đăng nhập ' + (email ? 'đúng tài khoản ' + email + ' – tài khoản đã triển khai Web app' : 'đúng tài khoản Google đang chạy máy chủ BDS Studio – tài khoản đã triển khai Web app') + ').',
'Bật công tắc "Google Apps Script API" sang Bật (On).',
'Quay lại app, đợi 5 phút (Google cần vài phút mới nhận) rồi bấm "Cập nhật máy chủ" lần nữa.'
];
}
export const ENABLE_API_STEPS = enableApiSteps();
export const TEXT = _o5;
export function cmpVersion(a, b) {
const _o1e = (v) => String(v || '0').trim().replace(/^v/i, '').split(/[\s-]/)[0].split('.').slice(0, 4).map((_o26) => parseInt(_o26, 10) || 0);
const _o1f = _o1e(a), pb = _o1e(b); const _o18 = Math.max(_o1f.length, pb.length);
for (let _ow = 0; _ow < _o18; _ow++) { const d = (_o1f[_ow] || 0) - (pb[_ow] || 0); if (d) return d > 0 ? 1 : -1; }
return 0;
}
export function partState(running, latest, { off } = {}) {
if (off) return { state: 'off', label: _o5.stOff, tone: 'neutral' };
if (!running || !latest) return { state: 'unknown', label: _o5.stUnknown, tone: 'neutral' };
return cmpVersion(running, latest) < 0 ? { state: 'update', label: _o5.stUpdate, tone: 'warn' } : { state: 'latest', label: _o5.stLatest, tone: 'ok' };
}
export function publicBase(loc, config = {}) {
const local = /^http:\/\/(127\.0\.0\.1|localhost):8765$/.test((loc && loc.origin) || '');
if (!local) return '';
const u = config.PUBLIC_URL || PUBLIC_URL;
return u.endsWith('/') ? u : u + '/';
}
const _od = (...a) => globalThis.fetch(...a);
const _o1r = (el, on) => { el.hidden = !on; el.style.display = on ? '' : 'none'; };
async function withTimeout(fetchFn, url, opts = {}, ms = 2500) {
const _oc = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _o1y = _oc ? setTimeout(() => _oc.abort(), ms) : null;
try { return await fetchFn(url, _oc ? { ...opts, signal: _oc.signal } : opts); } finally { if (_o1y) clearTimeout(_o1y); }
}
export async function loadVerifier() {
if (globalThis.BDSVerify) return globalThis.BDSVerify;
if (typeof document === 'undefined') return null;
await new Promise((res) => {
const _o1m = document.createElement('script');
_o1m.src = new URL('../shared/bds_verify.js', import.meta.url).href;
_o1m.onload = res; _o1m.onerror = res; document.head.appendChild(_o1m);
});
return globalThis.BDSVerify || null;
}
const _o1t = (u) => u + (u.includes('?') ? '&' : '?') + 't=' + Date.now();
async function _ot(fetchFn, url) {
const _o1i = await withTimeout(fetchFn, _o1t(url), { cache: 'no-store' }, 5000);
if (!_o1i || !_o1i.ok) return null;
return typeof _o1i.text === 'function' ? await _o1i.text() : JSON.stringify(await _o1i.json());
}
export function releaseChannel(cfg = appConfig) { return String((cfg && cfg.RELEASE_CHANNEL) || ''); }
export async function verifyRelease(fetchFn, base, vjText, verifier, channel = releaseChannel()) {
const V = verifier || await loadVerifier();
if (!V) return { ok: false, code: 'NO_VERIFIER' };
let _o12 = null, sig = null;
try { _o12 = await _ot(fetchFn, base + 'release.json'); } catch { }
if (!_o12 || /^\s*</.test(_o12)) return { ok: false, code: 'NO_MANIFEST' };
try { sig = await _ot(fetchFn, base + 'release.json.sig'); } catch { }
if (!sig || !sig.trim() || /^\s*</.test(sig)) return { ok: false, code: 'NO_SIG' };
const _o1i = V.checkRelease(_o12, sig.trim(), { files: { 'version.json': vjText }, ...(channel ? { channel } : {}) });
return _o1i.ok ? { ok: true, manifest: _o1i.manifest } : { ok: false, code: _o1i.code };
}
export async function fetchLatest(fetchFn = _od, urls = ['version.json'], { allowUnsigned = false, verifier, channel = releaseChannel() } = {}) {
let unsigned = null;
for (const u of urls) {
try {
const text = await _ot(fetchFn, u);
if (!text) continue;
const j = JSON.parse(text);
if (!(j && typeof j === 'object' && (j.web || j.gas || j.engine))) continue;
const v = await verifyRelease(fetchFn, u.replace(/version\.json(\?.*)?$/, ''), text, verifier, channel);
if (v.ok) {
const parts = v.manifest.parts || {};
return { ...j, web: parts.web || j.web, gas: parts.gas || j.gas, engine: parts.engine || j.engine,
signed: true, build_id: v.manifest.build_id || null, key_id: v.manifest.key_id || null, release: v.manifest };
}
if (!unsigned) unsigned = { ...j, signed: false, unsigned: v.code };
} catch { }
}
return allowUnsigned ? unsigned : null;
}
export async function engineHealth(base, fetchFn = _od) {
try {
const _o1i = await withTimeout(fetchFn, base + '/health', {}, 2500);
if (!_o1i.ok) return { running: false, version: null };
const d = await _o1i.json();
return { running: true, version: (d && d.version) || null };
} catch { return { running: false, version: null }; }
}
function _ol(d, status) {
const e = (d && d.error) || {};
const _om = new Error(e.message || ('Máy dựng trả lỗi HTTP ' + status));
Object.assign(_om, e, { code: e.code || 'HTTP_' + status, status });
const raw = String(e.message || '');
const _oo = friendlyError({ message: raw || _om.message, status });
const _o22 = raw && /[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệịỉĩọỏốồổỗộớờởỡợụủứừửữựỳỷỹýỵ]/i.test(raw) && !/HTTP\s*\d{3}|Error|Exception/.test(raw);
_om.userMessage = _o22 ? raw : (/tải|download/i.test(raw + ' ' + (e.code || '')) && _oo.kind === 'not_found' ? 'Máy dựng chưa tải được bản cập nhật: trang phát hành chưa có tệp này (có thể bản mới đang được đưa lên). Thử lại sau 5–10 phút.' : _oo.message);
_om.detail = _oo.detail || raw;
return _om;
}
function _on(e) { return (e && e.userMessage && !/Failed to fetch|NetworkError|HTTP\s*\d{3}/i.test(e.userMessage) ? e.userMessage : friendlyError(e).message); }
export function unsignedHowText(cfg = appConfig) {
const _oj = (cfg && cfg.edition) || EDITION || 'owner';
if (_oj === 'owner') return _o5.unsignedHow;
return _o5.unsignedHowSale(supportContact(cfg).text);
}
export async function engineUpdateStatus(base, fetchFn = _od) {
try {
const _o1i = await withTimeout(fetchFn, base + '/update', {}, 3000);
if (_o1i.status === 404) return null;
const d = await _o1i.json();
return _o1i.ok ? d : null;
} catch { return null; }
}
export async function rollbackEngine(base, { fetchFn = _od } = {}) {
const _o1i = await fetchFn(base + '/update/rollback', { method: 'POST', body: '{}', headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
let d = null; try { d = await _o1i.json(); } catch { }
if (!_o1i.ok || !d || !d.ok) throw _ol(d, _o1i.status);
return d;
}
const _o1s = (ms) => new Promise((_o1i) => setTimeout(_o1i, ms));
export function classifyServerUpdateError(e) {
const info = classifySelfUpdate(e);
const _o17 = String((e && (e.userMessage || e.message)) || '');
return { kind: info.kind, message: _o17, url: info.allow ? info.allow.url : '', info };
}
export const SELF_UPDATE_TIMEOUT_MS = 240000;
export async function serverSelfUpdate(api, payload = {}) {
try { return await api.call('server.self_update', payload, { timeoutMs: SELF_UPDATE_TIMEOUT_MS }); } catch (e) {
if (e && typeof e === 'object') { if (!e.at) e.at = Date.now(); const _oa = classifyServerUpdateError(e); e.kind = _oa.kind; }
throw e;
}
}
export async function copyText(text, selectEl = null) {
const t = String(text || '');
try { if (globalThis.navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') { await navigator.clipboard.writeText(t); return 'copied'; } } catch { }
if (typeof document === 'undefined') return 'failed';
try {
const _o1x = document.createElement('textarea');
_o1x.value = t; _o1x.setAttribute('readonly', ''); _o1x.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;';
document.body.appendChild(_o1x); _o1x.select(); _o1x.setSelectionRange(0, t.length);
let ok = false; try { ok = document.execCommand('copy'); } catch { ok = false; }
_o1x.remove();
if (ok) return 'copied';
} catch { }
try {
if (selectEl) { const _o1i = document.createRange(); _o1i.selectNodeContents(selectEl); const _o1o = window.getSelection(); _o1o.removeAllRanges(); _o1o.addRange(_o1i); return 'selected'; }
} catch { }
return 'failed';
}
const _o2 = { copied: 'Đã chép.', selected: 'Đã chọn sẵn – bấm ⌘C (Mac) hoặc Ctrl+C để chép.', failed: 'Chưa chép được – bôi đen phần chữ rồi chép.' };
export function diagVersions(v = {}) {
const _o26 = typeof v === 'function' ? (v() || {}) : (v || {});
return { web: _o26.web || appConfig.APP_VERSION || '', server: _o26.server || '', target: _o26.target || '', engine: _o26.engine || '', edition: _o26.edition || EDITION || '' };
}
export function supportButton(ui, info, { versions, testid = 'upd-support', kind = 'secondary' } = {}) {
const { button, toast } = ui;
return button('Gửi cho hỗ trợ', async () => {
const text = supportDiagnostic(info, diagVersions(versions));
const _o1i = await copyText(text, null);
try { window.__bdsLastSupport = text; } catch { }
if (toast) toast(_o1i === 'copied' ? 'Đã chép thông tin lỗi – dán vào Zalo/email gửi hỗ trợ (đã bỏ khoá, mật khẩu).' : 'Mở "Chi tiết kỹ thuật", bôi đen rồi chép gửi hỗ trợ.', _o1i === 'copied' ? 'ok' : 'info');
}, { kind, icon: 'help', testid });
}
export function techDetails(ui, info, { testid = 'upd-tech' } = {}) {
const { h, button } = ui;
const text = techLines(info).join('\n');
const pre = h('pre', { class: 'upd-tech-raw small', 'data-testid': testid + '-raw' }, text);
const _o1n = h('span', { class: 'muted small upd-tech-say', 'aria-live': 'polite', 'data-testid': testid + '-say' });
const copy = button('Chép', async () => { const _o1i = await copyText(text, pre); _o1n.textContent = _o2[_o1i]; }, { kind: 'ghost', small: true, testid: testid + '-copy' });
return h('details', { class: 'upd-tech', 'data-testid': testid, dataset: { code: info.code || '', step: info.step || '' } },
h('summary', { class: 'small' }, 'Chi tiết kỹ thuật'), pre, h('div', { class: 'btn-row' }, copy, _o1n));
}
export async function autoUpdateEngine(base, { fetchFn = _od, onProgress, intervalMs = 800, timeoutMs = 10 * 60000 } = {}) {
let _o1i;
try { _o1i = await fetchFn(base + '/update/auto', { method: 'POST', body: '{}', headers: { 'Content-Type': 'text/plain;charset=utf-8' } }); } catch {
const e = new Error(_o5.engineOff); e.code = 'ENGINE_OFF'; e.userMessage = _o5.engineOff; throw e;
}
if (_o1i.status === 404) { const e = new Error(_o5.autoOld); e.code = 'NO_AUTO'; e.userMessage = _o5.autoOld; throw e; }
let d = null; try { d = await _o1i.json(); } catch { }
if (!_o1i.ok || !d || !d.ok) throw _ol(d, _o1i.status);
const _ok = Date.now() + timeoutMs; let last = d.auto || {};
while (Date.now() < _ok) {
if (onProgress) { try { onProgress(last); } catch { } }
if (['restarting', 'latest'].includes(last.state)) return last;
if (last.state === 'error') { const e = new Error(last.message || 'Cập nhật tự động chưa được.'); e.code = last.code || 'AUTO_FAILED'; e.userMessage = e.message; throw e; }
await _o1s(intervalMs);
const st = await engineUpdateStatus(base, fetchFn);
if (!st) { if (last.state === 'installing') return { ...last, state: 'restarting' }; continue; }
last = st.auto || last;
}
const e = new Error(_o5.timeout); e.code = 'TIMEOUT'; e.userMessage = _o5.timeout; throw e;
}
const _o1 = 'bds:engineAuto:';
const _o0 = 6 * 3600 * 1000;
const _oz = (_ox) => { try { return localStorage.getItem(_ox); } catch { return null; } };
const _o10 = (_ox, v) => { try { localStorage.setItem(_ox, v); } catch { } };
export async function silentEngineUpdate(base, latest, runningEngine, { fetchFn = _od, get = _oz, set = _o10, now = Date.now() } = {}) {
if (!latest || latest.signed !== true || !latest.engine || !runningEngine) return 'skip';
if (cmpVersion(runningEngine, latest.engine) >= 0) return 'skip';
const _oy = _o1 + latest.engine;
if (now - (Number(get(_oy)) || 0) < _o0) return 'skip';
set(_oy, String(now));
try {
const _o1i = await withTimeout(fetchFn, base + '/update/auto', { method: 'POST', body: '{"silent":true}', headers: { 'Content-Type': 'text/plain;charset=utf-8' } }, 5000);
return _o1i && _o1i.ok ? 'started' : 'error';
} catch { return 'error'; }
}
export async function waitEngine(base, version, { fetchFn = _od, intervalMs = 1000, timeoutMs = 120000, initialDelayMs = 0 } = {}) {
const _ok = Date.now() + timeoutMs; let last = null;
if (initialDelayMs) await _o1s(initialDelayMs);
while (Date.now() < _ok) {
const h = await engineHealth(base, fetchFn);
if (h.running) { last = h.version; if (!version || cmpVersion(h.version, version) === 0) return { ok: true, version: h.version }; }
await _o1s(intervalMs);
}
return { ok: false, version: last };
}
async function _o1q(text) {
const _o9 = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(text)));
return Array.from(new Uint8Array(_o9)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
export async function verifiedGasFile(dlHref = 'downloads/TatCa.gs', { fetchFn = _od, verifier, timeoutMs = 30000 } = {}) {
const base = String(dlHref).replace(/downloads\/TatCa\.gs(\?.*)?$/, '');
let latest = null;
try { latest = await fetchLatest(fetchFn, [base + 'version.json'], { verifier }); } catch { latest = null; }
const files = latest && latest.release && Array.isArray(latest.release.files) ? latest.release.files : null;
if (!files) return { ok: false, code: 'NO_SIGNED', message: 'Chưa kiểm được chữ ký bản phát hành (không tải được release.json đã ký) – chưa tải TatCa.gs. Thử lại sau ít phút.' };
const _oo = files.find((_o26) => _o26 && _o26.path === 'downloads/TatCa.gs');
const _o24 = _oo ? String(_oo.sha256 || '').toLowerCase() : '';
if (!/^[0-9a-f]{64}$/.test(_o24)) return { ok: false, code: 'NO_SHA', message: 'Bản phát hành đã ký không có mã kiểm tra của TatCa.gs – chưa tải.' };
let text = null;
try { const _o1i = await withTimeout(fetchFn, _o1t(dlHref), { cache: 'no-store' }, timeoutMs); text = _o1i && _o1i.ok ? await _o1i.text() : null; } catch { text = null; }
if (!text) return { ok: false, code: 'DOWNLOAD', message: 'Không tải được TatCa.gs từ trang phát hành – kiểm tra mạng rồi thử lại.' };
const _ou = await _o1q(text);
if (_ou !== _o24) return { ok: false, code: 'SHA_MISMATCH', message: 'TatCa.gs tải về KHÁC bản đã ký (sha256 không khớp) – KHÔNG dán. Bấm “Gửi cho hỗ trợ”.' };
return { ok: true, text, sha256: _ou, version: latest.gas || '', build_id: latest.build_id || null };
}
export function installerFallback(_o19) {
return 'Cách khác: mở tệp ' + _o19 + ' trong thư mục BDS_Studio_Engine/_he_thong/cai_tay (giải nén từ bộ cài máy dựng BDS_Studio_Video_Windows.zip / BDS_Studio_Video_Mac.zip) bằng Notepad (Mac: TextEdit) → Ctrl+A → Ctrl+C (Mac: ⌘A → ⌘C) rồi dán vào trình soạn Apps Script.';
}
export const UNSIGNED_NOTE = 'Bản thử chưa ký số – chỉ dùng nội bộ';
async function _o1j(fetchFn, base, verifier, channel = releaseChannel()) {
let _o12 = null, sig = null;
try { _o12 = await _ot(fetchFn, base + 'release.json'); } catch { _o12 = null; }
if (!_o12 || /^\s*</.test(_o12)) return { found: false };
try { sig = await _ot(fetchFn, base + 'release.json.sig'); } catch { sig = null; }
if (sig && /^\s*</.test(sig)) sig = null;
if (sig && sig.trim()) {
const V = verifier || await loadVerifier();
if (!V) return { found: true, bad: 'NO_VERIFIER' };
const _o1i = V.checkRelease(_o12, sig.trim(), channel ? { channel } : {});
return _o1i.ok ? { found: true, signed: true, manifest: _o1i.manifest } : { found: true, bad: _o1i.code || 'BAD_SIG' };
}
let _o11 = null;
try { _o11 = JSON.parse(_o12); } catch { _o11 = null; }
if (!_o11 || !Array.isArray(_o11.files)) return { found: true, bad: 'BAD_MANIFEST' };
if (channel && _o11.channel !== channel) return { found: true, bad: 'WRONG_CHANNEL' };
return { found: true, signed: false, manifest: _o11 };
}
export async function verifiedReleaseFiles(paths, { base = '', remote = '', local = '', fetchFn = _od, verifier, timeoutMs = 30000 } = {}) {
const far = remote || base || '';
const _o1a = paths.map((_o1e) => String(_o1e).split('/').pop());
const _o25 = installerFallback(_o1a[0] || 'TatCa.gs');
let src = local, rel = await _o1j(fetchFn, local, verifier);
if (!rel.found && far && far !== local) { src = far; rel = await _o1j(fetchFn, far, verifier); }
if (!rel.found) return { ok: false, code: 'NO_MANIFEST', message: 'Chưa kiểm được tệp cài máy chủ: không tải được danh sách tệp phát hành (release.json). ' + _o25 };
if (rel.bad) return { ok: false, code: rel.bad, message: 'Chữ ký số của bản phát hành không đúng (' + rel.bad + ') – KHÔNG dán mã từ app. ' + _o25 + ' Tệp trong thư mục đó cũng lỗi thì tải lại bộ cài từ bên bán; vẫn lỗi bấm "Cần giúp?".' };
const list = rel.manifest.files;
const out = {};
for (const _o1e of paths) {
const _o19 = String(_o1e).split('/').pop();
const _oo = list.find((_o26) => _o26 && _o26.path === _o1e);
const _o24 = _oo ? String(_oo.sha256 || '').toLowerCase() : '';
if (!/^[0-9a-f]{64}$/.test(_o24)) return { ok: false, code: 'NO_SHA', path: _o1e, message: 'Bản phát hành ' + (rel.signed ? 'đã ký ' : '') + 'không có mã kiểm tra của ' + _o19 + ' – chưa lấy tệp. ' + installerFallback(_o19) };
let text = null;
try { const _o1i = await withTimeout(fetchFn, _o1t(src + _o1e), { cache: 'no-store' }, timeoutMs); text = _o1i && _o1i.ok ? await _o1i.text() : null; } catch { text = null; }
if (!text || /^\s*</.test(text)) return { ok: false, code: 'DOWNLOAD', path: _o1e, message: 'Không tải được ' + _o19 + ' – kiểm tra mạng rồi thử lại. ' + installerFallback(_o19) };
const _ou = await _o1q(text);
if (_ou !== _o24) return { ok: false, code: 'SHA_MISMATCH', path: _o1e, message: _o19 + ' tải về KHÁC bản phát hành (sha256 không khớp – tệp hỏng/cụt hoặc bị sửa) – KHÔNG dán. Tải lại bộ cài máy dựng (BDS_Studio_Video_Windows.zip / BDS_Studio_Video_Mac.zip) từ bên bán, giải nén lại rồi thử lại; vẫn lỗi bấm "Cần giúp?" để gửi cho hỗ trợ.' };
out[_o1e] = { text, sha256: _ou };
}
const parts = rel.manifest.parts || {};
return { ok: true, files: out, version: parts.gas || '', build_id: rel.manifest.build_id || null, signed: !!rel.signed, source: src || 'local',
...(rel.signed ? {} : { warn: UNSIGNED_NOTE }) };
}
export function verifiedGasLink(ui, { dlHref = 'downloads/TatCa.gs', testid = 'gas-guide-download', fetchFn = _od, verifier } = {}) {
const { h } = ui;
const _o1n = h('span', { class: 'muted small', 'aria-live': 'polite', 'data-testid': testid + '-say' });
const a = h('a', { class: 'btn btn-secondary', href: dlHref, download: 'TatCa.gs', rel: 'noopener', 'data-testid': testid }, ui.icon ? ui.icon('download', 20) : null, h('span', null, _o5.dlGas));
a.addEventListener('click', async (ev) => {
ev.preventDefault();
_o1n.textContent = _o5.dlVerifying; _o1n.className = 'muted small';
const _o1i = await verifiedGasFile(dlHref, { fetchFn, verifier });
if (!_o1i.ok) { _o1n.textContent = _o1i.message; _o1n.className = 'small form-err'; _o1n.dataset.code = _o1i.code; return; }
try {
const url = URL.createObjectURL(new Blob([_o1i.text], { type: 'text/plain;charset=utf-8' }));
const _o1z = h('a', { href: url, download: 'TatCa.gs', hidden: true });
document.body.appendChild(_o1z); _o1z.click(); _o1z.remove();
setTimeout(() => URL.revokeObjectURL(url), 30000);
_o1n.textContent = _o5.dlOk(_o1i.version, _o1i.sha256); _o1n.className = 'small'; _o1n.dataset.code = 'OK';
} catch { _o1n.textContent = 'Chưa lưu được tệp – thử trình duyệt khác.'; _o1n.className = 'small form-err'; }
});
return h('span', { class: 'ver-dl' }, a, _o1n);
}
export function manualUpdateBlock(ui, { dlHref = 'downloads/TatCa.gs', testid = 'manual-update', dlTestid, open = false, fetchFn, verifier } = {}) {
const { h } = ui;
return h('details', { class: 'ver-manual', 'data-testid': testid, open: open || undefined },
h('summary', { class: 'small' }, _o5.manualUpdTitle),
h('ol', { class: 'ver-steps small', 'data-testid': testid + '-steps' }, _o5.manualUpdSteps.map((_o26) => h('li', null, _o26))),
h('p', { class: 'muted small' }, _o5.manualUpdNote),
h('div', { class: 'btn-row' }, verifiedGasLink(ui, { dlHref, testid: dlTestid || testid + '-download', fetchFn, verifier })));
}
export async function checkScriptApi(api) {
try { return (await api.call('setup.wizard_check', { kind: 'script_api' })) || { ok: false, code: 'HTTP', message: 'Máy chủ không trả kết quả.' }; } catch (e) {
return { ok: false, error: e, code: (e && e.code) || '', message: (e && (e.userMessage || e.message)) || '' };
}
}
export function scriptApiResult(ui, v, { testid = 'api-check' } = {}) {
const { h } = ui;
const _o15 = v.ok === true ? '✅ ' : v.ok === false ? '❌ ' : 'ℹ️ ';
return h('div', { class: 'api-check-res', 'data-testid': testid + '-result', dataset: { ok: v.ok === true ? '1' : v.ok === false ? '0' : '', kind: v.kind || '', code: v.code || '' } },
h('p', { class: 'small' }, h('strong', null, _o15 + v.title)),
v.cause ? h('p', { class: 'small', 'data-testid': testid + '-cause' }, v.cause) : null,
v.lines && v.lines.length ? h('ol', { class: 'ver-steps small' }, v.lines.map((_o26) => h('li', null, _o26))) : null,
v.allow && v.allow.url ? h('div', { class: 'btn-row' }, h('a', { class: 'btn btn-primary', href: v.allow.url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': testid + '-allow' }, h('span', null, v.allow.label || 'Mở trang'))) : null,
v.info ? techDetails(ui, v.info, { testid: testid + '-tech' }) : null);
}
export function scriptApiCheck(ui, { api, testid = 'api-check', small = false } = {}) {
const { h, button } = ui;
const out = h('div', { class: 'api-check-out', 'aria-live': 'polite', 'data-testid': testid + '-out' });
const run = async () => {
ui.mountTo(out, h('p', { class: 'small muted' }, _o5.apiChecking));
const v = scriptApiVerdict(await checkScriptApi(api));
ui.mountTo(out, scriptApiResult(ui, v, { testid }));
return v;
};
const btn = button(_o5.apiCheck, run, { kind: 'secondary', icon: 'pulse', small, testid });
return { btn, out, run };
}
const _o4 = new Set(['signature', 'forbidden', 'smoke', 'drive']);
export function serverUpdateGuide(ui, { error = null, kind = 'other', message = '', dlHref = 'downloads/TatCa.gs', url = '', versions, api = null, fetchFn, verifier } = {}) {
const { h } = ui;
const info = error ? classifySelfUpdate(error) : classifySelfUpdate({ code: { enable_api: 'API_DISABLED', gcp_api: 'API_GCP_DISABLED', api_wait: 'API_PROPAGATING', not_owner: 'NOT_OWNER', scope: 'SCOPE_MISSING', signature: 'SIGNATURE_INVALID', old_server: 'UNKNOWN_ACTION' }[kind] || 'UPDATE_FAILED', message, url });
const _ox = info.kind;
const allow = (href, label) => h('a', { class: 'btn btn-primary', href, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'gas-guide-allow' }, h('span', null, label || 'Cho phép'));
const dl = () => verifiedGasLink(ui, { dlHref, testid: 'gas-guide-download', fetchFn, verifier });
const _o14 = () => h('ol', { class: 'ver-steps small' }, _o5.gasSteps.map((_o26) => h('li', null, _o26)),
/appsscript\.json/.test(info.cause) && _ox === 'old_server' ? h('li', null, _o5.manifestStep) : null);
const _o13 = () => (_o4.has(_ox) ? null : manualUpdateBlock(ui, { dlHref, testid: 'gas-manual', dlTestid: 'gas-guide-download', open: !!info.legacy || _ox === 'paste', fetchFn, verifier }));
const check = null;
const head = [h('p', { class: 'small' }, h('strong', null, info.title)), h('p', { class: 'small ver-cause', 'data-testid': 'gas-guide-cause' }, info.cause)];
let body;
if (_ox === 'old_server') {
body = [h('p', { class: 'small', 'data-testid': 'gas-guide-migrate' }, _o5.oldServer), h('p', { class: 'small' }, h('strong', null, _o5.gasHow)), _o14(), h('div', { class: 'btn-row' }, dl()),
h('p', { class: 'muted small' }, _o5.migrateNote)];
} else {
const _or = h('ol', { class: 'ver-steps small', 'data-testid': 'gas-guide-fix' }, info.lines.map((_o26) => h('li', null, _o26)));
const _o6 = [info.allow && info.allow.url ? allow(info.allow.url, info.allow.label) : null, check ? check.btn : null].filter(Boolean);
body = [_or, _o6.length ? h('div', { class: 'btn-row' }, _o6) : null, check ? check.out : null, _o13()];
}
return h('div', { class: 'ver-guide', 'data-testid': 'gas-guide', dataset: { kind: _ox, step: info.step || '', code: info.code || '' } },
head, body, techDetails(ui, info, { testid: 'gas-tech' }),
h('div', { class: 'btn-row' }, supportButton(ui, info, { versions, testid: 'gas-support', kind: info.support ? 'primary' : 'ghost' })));
}
export function serverUpdateButton(ui, { api, dlHref, onDone, versions, fetchFn, verifier, payload = {}, testid = 'gas-update' } = {}) {
const { h, button, toast } = ui;
const out = h('div', { class: 'ver-out', 'aria-live': 'polite', 'data-testid': 'gas-update-out' });
const btn = button(_o5.gasAuto, async () => {
if (api && api.mode === 'demo') { ui.mountTo(out, h('p', { class: 'muted small' }, _o5.gasDemoNo)); return; }
ui.mountTo(out, h('p', { class: 'small' }, _o5.gasUpdating));
try {
const _o1i = await serverSelfUpdate(api, payload);
const text = _o1i && _o1i.updated ? _o5.gasUpdated(_o1i.to || '?') : _o5.gasUpToDate;
ui.mountTo(out, h('p', { class: 'small' }, text)); toast(text, 'ok');
if (onDone) onDone(_o1i);
} catch (e) {
const _oa = classifyServerUpdateError(e);
ui.mountTo(out, serverUpdateGuide(ui, { error: e, dlHref, versions, api, fetchFn, verifier }));
if (toast) toast(_oa.info.toast, 'warn');
}
}, { kind: 'primary', icon: 'refresh', testid });
return { btn, out };
}
export function engineAutoButton(ui, { base, fetchFn = _od, onDone, kind = 'primary' } = {}) {
const { h, button, toast } = ui;
const out = h('p', { class: 'small', 'aria-live': 'polite', 'data-testid': 'engine-auto-msg' });
const _o1n = (t, _om) => { out.textContent = t; out.className = 'small' + (_om ? ' form-err' : ''); };
const btn = button(_o5.upAuto, async () => {
try {
const st = await autoUpdateEngine(base, { fetchFn, onProgress: (a) => { if (_o5.autoState[a.state]) _o1n(_o5.autoState[a.state] + (a.total ? ' ' + Math.round(100 * (a.received || 0) / a.total) + '%' : '')); } });
if (st.state === 'latest') { _o1n(_o5.autoState.latest); return; }
_o1n(_o5.restarting);
const _o23 = await waitEngine(base, st.to || null, { fetchFn, initialDelayMs: 2000 });
if (_o23.ok) { _o1n(_o5.done(_o23.version)); toast(_o5.done(_o23.version), 'ok'); } else _o1n(_o5.timeout, true);
if (onDone) onDone(_o23);
} catch (e) { _o1n(_on(e), true); }
}, { kind, icon: 'refresh', testid: 'engine-auto' });
return { btn, out };
}
export async function renderVersionPanel(body, { ui, api, app, user = null, fetchFn = _od, loc = typeof location !== 'undefined' ? location : null, verifier, engine = true }) {
const { h, badge, button, toast, kv } = ui;
const config = (app && app.config) || {};
const _o3 = config.ENGINE_URL || 'http://127.0.0.1:8765';
const _o1h = publicBase(loc, config);
const _oe = (file, label, id) => h('a', { class: 'btn btn-secondary', href: _o1h + 'downloads/' + file, download: file, id, 'data-testid': id, rel: 'noopener' }, (ui.icon ? ui.icon('download', 20) : null), h('span', null, label));
const _o1d = !user || user.role === 'owner' || user.legacy;
const parts = {};
const _o16 = (_oy, title) => {
const st = h('span', { class: 'ver-st' }, badge('…'));
const info = h('div', { class: 'ver-info' });
const how = h('div', { class: 'ver-how' });
const el = h('div', { class: 'section ver-part', 'data-testid': 'ver-' + _oy, dataset: { part: _oy, state: 'loading' } },
h('div', { class: 'row-line' }, h('h4', { class: 'section-title' }, title), st), info, how);
parts[_oy] = { el, st, info, how };
return el;
};
const _o1p = (_oy, _o1m) => { const _o1e = parts[_oy]; _o1e.el.dataset.state = _o1m.state; ui.mountTo(_o1e.st, badge(_o1m.label, _o1m.tone)); };
const _o1b = h('div', { class: 'ver-notes' });
body.append(_o16('web', _o5.web), _o16('gas', _o5.gas), engine ? _o16('engine', _o5.engine) : '', _o1b);
const latestUrls = _o1h ? [_o1h + 'version.json', 'version.json'] : ['version.json'];
const _oq = (await fetchLatest(fetchFn, latestUrls, { allowUnsigned: true, verifier })) || {};
const unsigned = _oq.signed === false;
const latest = unsigned ? { notes: _oq.notes } : _oq;
if (unsigned && user && user.role === 'owner') {
body.prepend(h('div', { class: 'section ver-unsigned', 'data-testid': 'ver-unsigned', dataset: { reason: _oq.unsigned || '' } },
h('div', { class: 'row-line' }, h('h4', { class: 'section-title' }, _o5.unsigned), badge(_o5.unsigned, 'warn')),
h('p', { class: 'muted small', 'data-testid': 'ver-unsigned-how' }, unsignedHowText(appConfig))));
}
const _oi = async () => {
const _o1e = parts.web; const running = config.APP_VERSION || null;
const _o1w = h('span', { class: 'num' }, '…');
ui.mountTo(_o1e.info, kv([[_o5.running, 'v' + (running || '?')], [_o5.code, _o1w], [_o5.newest, latest.web ? 'v' + latest.web : '—']]));
const _o1m = partState(running, latest.web); _o1p('web', _o1m);
const out = h('p', { class: 'muted small', 'aria-live': 'polite' });
const _o1k = button(_o5.reload, () => app.applyUpdate(), { kind: 'primary', icon: 'refresh', id: 'ver-web-reload', testid: 'ver-web-reload' });
_o1r(_o1k, _o1m.state === 'update');
const checkBtn = button(_o5.check, async () => {
if (unsigned) { out.textContent = _o5.unsignedShort; return; }
const _o1i = await app.checkUpdate();
if (_o1i === 'ready' || _o1m.state === 'update') { out.textContent = _o5.webReady; _o1r(_o1k, true); _o1p('web', { state: 'update', label: _o5.stUpdate, tone: 'warn' }); } else out.textContent = _o5.webLatest;
}, { kind: 'secondary', icon: 'refresh', id: 'ver-web-check' });
ui.mountTo(_o1e.how, h('p', { class: 'muted small' }, _o5.webHow), h('div', { class: 'btn-row' }, checkBtn, _o1k), out);
try { _o1w.textContent = (await app.swVersion()) || '—'; } catch { _o1w.textContent = '—'; }
};
const _oh = async () => {
const _o1e = parts.gas; let running = null; let label; let _o1u = null;
try { const d = await api.call('status'); _o1u = d; running = (d && d.version) || null; label = 'v' + (running || '?') + (api.mode === 'demo' ? ' · ' + _o5.gasDemo : ''); } catch { label = _o5.gasNone; }
const off = api.mode !== 'demo' && _o1u ? officialState(_o1u, _oq) : { state: 'unknown' };
const _o1c = off.state === 'official' || off.state === 'unofficial'
? [_o5.officialRow, h('span', { 'data-testid': 'ver-gas-official', dataset: { state: off.state } }, off.state === 'official' ? OFFICIAL_WORDS.official : _o5.unofficialShort)] : null;
ui.mountTo(_o1e.info, kv([[_o5.running, label], [_o5.newest, latest.gas ? 'v' + latest.gas : '—'], _o1c]));
const _o1m = partState(running, latest.gas); _o1p('gas', _o1m);
let _o1v = null, svErr = false;
if (_o1d && _o1u && api.mode !== 'demo') { try { _o1v = await api.call('server.version'); } catch { svErr = true; } }
if (_o1d && _o1u && api.mode !== 'demo' && (svErr || needsMigration(_o1v))) {
_o1p('gas', { state: 'migrate', label: 'Cần dán mã mới 1 lần', tone: 'warn' });
ui.mountTo(_o1e.how, h('div', { class: 'ver-migrate', 'data-testid': 'ver-gas-migrate' },
h('p', { class: 'small' }, h('strong', null, MIGRATE.title)),
h('p', { class: 'muted small', 'data-testid': 'ver-gas-migrate-cause' }, MIGRATE.cause),
manualUpdateBlock(ui, { dlHref: _o1h + 'downloads/TatCa.gs', testid: 'ver-gas-migrate-manual', dlTestid: 'ver-gas-migrate-download', open: true, fetchFn, verifier }),
h('p', { class: 'muted small' }, _o5.migrateNote)));
await _os(_o1e, _o1v);
return;
}
if (off.state === 'unofficial' && _o1m.state !== 'update') {
_o1p('gas', { state: 'unofficial', label: _o5.unofficialShort, tone: 'warn' });
const _o20 = _o1d ? serverUpdateButton(ui, { api, dlHref: _o1h + 'downloads/TatCa.gs', fetchFn, verifier, payload: { force: true }, testid: 'ver-gas-official-fix', versions: { server: running, target: latest.gas }, onDone: (_o1i) => { _oh(); if (_o1i && _o1i.updated && app && typeof app.afterUpdate === 'function') app.afterUpdate('gas'); } }) : null;
ui.mountTo(_o1e.how, h('div', { class: 'ver-unofficial', 'data-testid': 'ver-gas-unofficial' },
h('p', { class: 'small' }, h('strong', null, OFFICIAL_WORDS.unofficial)),
h('p', { class: 'muted small' }, _o1d ? OFFICIAL_WORDS.unofficialHow : _o5.unofficialStaff)),
h('div', { class: 'btn-row' }, _o20 ? _o20.btn : null, _oe('TatCa.gs', _o5.dlGas, 'ver-gas-download')), _o20 ? _o20.out : null);
} else if (_o1m.state === 'update') {
const _o20 = serverUpdateButton(ui, { api, dlHref: _o1h + 'downloads/TatCa.gs', fetchFn, verifier, versions: { server: running, target: latest.gas }, onDone: (_o1i) => { _oh(); if (_o1i && _o1i.updated && app && typeof app.afterUpdate === 'function') app.afterUpdate('gas'); } });
ui.mountTo(_o1e.how, h('p', { class: 'muted small' }, _o5.gasAutoHow), h('div', { class: 'btn-row' }, _o20.btn, _oe('TatCa.gs', _o5.dlGas, 'ver-gas-download')), _o20.out,
h('details', { class: 'ver-manual' }, h('summary', { class: 'small' }, _o5.manualTitle), h('ol', { class: 'ver-steps small' }, _o5.gasSteps.map((_o26) => h('li', null, _o26)))));
} else {
ui.mountTo(_o1e.how, h('p', { class: 'muted small' }, _o1m.state === 'latest' ? _o5.gasOk : ''), h('div', { class: 'btn-row' }, _oe('TatCa.gs', _o5.dlGas, 'ver-gas-download')));
}
await _os(_o1e, _o1v);
};
const _os = async (_o1e, v0 = null) => {
if (!_o1d) return;
let v = v0;
if (!v) { try { v = await api.call('server.version'); } catch { return; } }
if (!v) return;
const out = h('div', { class: 'ver-out', 'aria-live': 'polite', 'data-testid': 'ver-gas-extra-out' });
const _o1l = [];
if (v.needs_setup || v.setup_error) {
_o1l.push(h('p', { class: 'small form-err' }, 'Máy chủ chưa cài xong bản mới' + (v.setup_error ? ': ' + v.setup_error : '.')));
_o1l.push(button('Cài lại máy chủ', async () => {
try {
await api.call('server.ensure_setup');
toast('Đã cài lại máy chủ (bảng, cột, hẹn giờ).', 'ok');
if (app && typeof app.afterUpdate === 'function') app.afterUpdate('gas');
await _oh();
} catch (e) { const _oa = classifyServerUpdateError(e); ui.mountTo(out, serverUpdateGuide(ui, { error: e, dlHref: _o1h + 'downloads/TatCa.gs', versions: { server: v.version, target: latest.gas }, api, fetchFn, verifier })); toast(_oa.info.toast, 'warn'); }
}, { kind: 'primary', icon: 'refresh', testid: 'ver-gas-setup' }));
}
if (v.rollback_hold) _o1l.push(h('p', { class: 'muted small', 'data-testid': 'ver-gas-hold' }, 'Đang giữ bản trước – app không tự cập nhật máy chủ lên v' + v.rollback_hold + '. Muốn lên lại thì bấm "Cập nhật máy chủ".'));
if (v.rollback) {
const _o1g = v.prev_version ? ' (v' + v.prev_version + ')' : '';
_o1l.push(button('Quay về bản trước' + _o1g, async () => {
if (!(await ui.confirm('Đưa máy chủ về bản trước' + _o1g + '? Đường dẫn app giữ nguyên; app sẽ không tự cập nhật lại cho tới khi anh/chị bấm "Cập nhật máy chủ".', { ok: 'Quay về bản trước', kind: 'danger', title: _o5.gas }))) return;
try {
const _o1i = await api.call('server.rollback');
toast('Máy chủ đã quay về bản trước' + (_o1i && _o1i.version ? ' v' + _o1i.version : '') + '.', 'ok');
await _oh();
} catch (e) { const _oa = classifyServerUpdateError(e); ui.mountTo(out, serverUpdateGuide(ui, { error: e, dlHref: _o1h + 'downloads/TatCa.gs', versions: { server: v.version, target: latest.gas }, api, fetchFn, verifier })); toast(_oa.info.toast, 'warn'); }
}, { kind: 'ghost', icon: 'back', testid: 'ver-gas-rollback' }));
}
if (_o1l.length) _o1e.how.appendChild(h('div', { class: 'ver-gas-extra', 'data-testid': 'ver-gas-extra' }, h('div', { class: 'btn-row' }, _o1l), out));
};
const _o17 = h('p', { class: 'small', 'aria-live': 'polite', 'data-testid': 'ver-engine-msg' });
const _og = async () => {
const _o1e = parts.engine;
const _ov = await engineHealth(_o3, fetchFn);
ui.mountTo(_o1e.info, kv([[_o5.running, _ov.running ? h('span', { class: 'ver-running' }, 'v' + (_ov.version || '?')) : h('span', { class: 'ver-running' }, _o5.stOff)],
[_o5.newest, latest.engine ? 'v' + latest.engine : '—']]));
_o1p('engine', partState(_ov.version, latest.engine, { off: !_ov.running }));
const recheck = button(_o5.recheck, () => _og(), { kind: 'ghost', icon: 'refresh', small: true, id: 'ver-engine-recheck' });
const _oj = engineDownload(typeof navigator !== 'undefined' ? navigator : null, _o1h);
const dl = h('span', { class: 'ver-engine-dl' },
h('a', { class: 'btn btn-secondary', href: _oj.primary.href, download: _oj.primary.file, id: 'ver-engine-download', 'data-testid': 'ver-engine-download', 'data-os': _oj.primary.os, rel: 'noopener' }, (ui.icon ? ui.icon('download', 20) : null), h('span', null, _o5.dlEngine + ' – ' + _oj.primary.label)),
' ', h('a', { class: 'small', href: _oj.other.href, download: _oj.other.file, 'data-testid': 'ver-engine-download-other', rel: 'noopener' }, 'Máy ' + _oj.other.label + '? Tải bộ cài cho ' + _oj.other.label));
if (!_ov.running) { ui.mountTo(_o1e.how, h('p', { class: 'muted small' }, _o5.engineOff), h('div', { class: 'btn-row' }, dl, recheck), _o17); return; }
const _o21 = await engineUpdateStatus(_o3, fetchFn);
if (!_o21) { ui.mountTo(_o1e.how, h('p', { class: 'muted small' }, _o5.engineOld), h('div', { class: 'btn-row' }, dl, recheck), _o17); return; }
const _o8 = (_o21.backups || [])[0];
const rbBtn = _o8 ? button(_o5.rollback + ' (v' + _o8.version + ')', () => _of(_o8.version).catch(_op), { kind: 'ghost', id: 'ver-engine-rollback', testid: 'ver-engine-rollback' }) : null;
const auto = _o21.auto ? engineAutoButton(ui, { base: _o3, fetchFn, onDone: (_o23) => { _og(); if (_o23 && _o23.ok && app && typeof app.afterUpdate === 'function') app.afterUpdate('engine'); } }) : null;
if (!auto) { ui.mountTo(_o1e.how, h('p', { class: 'muted small' }, _o5.autoOld), h('div', { class: 'btn-row' }, dl, rbBtn, recheck), _o17); return; }
const _ob = latest.signed === true && !!latest.engine && cmpVersion(_ov.version, latest.engine) < 0;
ui.mountTo(_o1e.how, h('p', { class: 'muted small' }, _o5.upAutoHow), h('div', { class: 'btn-row' }, _ob ? auto.btn : null, rbBtn, recheck), auto.out, _o17);
if (_ob) silentEngineUpdate(_o3, latest, _ov.version, { fetchFn }).catch(() => null);
};
const _o1n = (text, tone) => { _o17.textContent = text; _o17.className = 'small' + (tone === 'error' ? ' form-err' : ''); };
const _op = (e) => { _o1n(_on(e), 'error'); toast(_o17.textContent, 'error', 5000, { detail: e && e.detail }); };
const _o7 = async (to, doneText) => {
_o1n(_o5.restarting);
const _o23 = await waitEngine(_o3, to, { fetchFn, initialDelayMs: 2000 });
if (_o23.ok) { _o1n(doneText(_o23.version)); toast(doneText(_o23.version), 'ok'); } else _o1n(_o5.timeout, 'error');
await _og();
};
async function _of(v) {
if (!(await ui.confirm(_o5.rollbackAsk(v), { ok: _o5.rollback, kind: 'danger', title: _o5.engine }))) return;
const _o1i = await rollbackEngine(_o3, { fetchFn });
await _o7(_o1i.to, _o5.rolled);
}
const notes = Array.isArray(latest.notes) ? latest.notes.slice(0, 3) : [];
if (notes.length) ui.mountTo(_o1b, h('h4', { class: 'section-title' }, _o5.notes), h('ul', { class: 'ver-steps small' }, notes.map((_o18) => h('li', null, h('strong', null, 'v' + _o18.version), ' · ' + (_o18.date || '') + ' – ' + _o18.text))),
app && typeof app.openWhatsNew === 'function' ? h('div', { class: 'btn-row' }, button('Xem thay đổi', () => app.openWhatsNew(), { kind: 'secondary', icon: 'sparkle', testid: 'ver-whatsnew' })) : null);
await Promise.all([_oi(), _oh(), engine ? _og() : null].map((pr) => Promise.resolve(pr).catch(() => null)));
return parts;
}
export default { verifiedGasFile, manualUpdateBlock, scriptApiCheck, checkScriptApi, enableApiSteps, cmpVersion, partState, fetchLatest, verifyRelease, loadVerifier, silentEngineUpdate, engineHealth, rollbackEngine, waitEngine, renderVersionPanel, publicBase, autoUpdateEngine, serverSelfUpdate, classifyServerUpdateError, copyText, techDetails, supportButton, diagVersions };

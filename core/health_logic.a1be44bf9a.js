import { cmpVersion } from './updates.a1be44bf9a.js';
export const API_SETTINGS_URL = 'https://script.google.com/home/usersettings';
export const SCRIPT_HOME_URL = 'https://script.google.com/home';
export const MISSING_ACTION_TEXT = 'Máy chủ chưa có chức năng này – cần cập nhật máy chủ.';
export const WAIT_OWNER_TEXT = 'Máy chủ cần cập nhật – chờ Quản trị (Admin) mở app để máy chủ tự cập nhật, rồi thử lại.';
const _o4 = /không được hỗ trợ|not supported|unknown action/i;
export function isMissingActionError(e) {
if (!e) return false;
if (e.missingAction === true || e.code === 'UNKNOWN_ACTION') return true;
return e.code === 'BAD_INPUT' && _o4.test(String(e.serverMessage || e.message || ''));
}
export const REQUIRED_ACTIONS = [
'status', 'setup', 'login', 'logout', 'me', 'salt.get', 'sync.pull', 'sync.push', 'settings.get', 'settings.set',
'devices.list', 'devices.revoke', 'password.change', 'password.reset_request', 'password.reset_confirm',
'users.list', 'users.create', 'users.update', 'users.reset_password', 'users.devices', 'users.revoke_device', 'users.directory',
'audit.list', 'objects.assign', 'ai.run', 'budget.get', 'drive.usage', 'errors.report',
'telegram.test', 'telegram.find_chat_id', 'telegram.set_mine', 'telegram.find_chat_id_mine',
'connections.status', 'connections.test', 'connections.disconnect', 'system.check',
'backup.now', 'backup.list', 'backup.restore', 'feedback.submit', 'feedback.list', 'feedback.update', 'feedback.image',
'server.version', 'server.self_update',
'me.update'
];
export function needServerUpdate({ server, target, actions, required = REQUIRED_ACTIONS, build = null, signedBuild = null } = {}) {
const missing = Array.isArray(actions) && actions.length ? required.filter((_oa) => !actions.includes(_oa)) : [];
if (server && target && cmpVersion(server, target) < 0) return { need: true, reason: 'older', missing };
if (missing.length) return { need: true, reason: 'missing', missing };
if (server && target && cmpVersion(server, target) === 0 && build && signedBuild && String(build) !== String(signedBuild)) return { need: true, reason: 'build', missing };
return { need: false, reason: null, missing };
}
export const DRIVE_STORAGE_URL = 'https://drive.google.com/settings/storage';
export const STEP_LABEL = {
check: 'kiểm tra máy chủ có tự cập nhật được không',
manifest: 'tải danh sách bản phát hành (version.json / release.json)',
verify: 'kiểm chữ ký số và mã sha256',
download: 'tải mã mới (ServerCore.js / appsscript.json)',
install: 'lưu mã mới lên Google Drive và chạy thử',
read_code: 'đọc mã hiện tại',
backup: 'sao lưu mã cũ lên Google Drive',
find_deployment: 'tìm bản triển khai Web app đang chạy',
write_code: 'ghi mã mới',
scope_check: 'kiểm quyền Google của bản mới',
create_version: 'tạo phiên bản',
deploy: 'cập nhật bản triển khai',
rollback: 'quay về bản trước',
setup: 'cài bảng, cột, hẹn giờ',
call: 'gọi máy chủ'
};
const _o8 = [
['check', /chưa tự cập nhật được|chưa có bộ kiểm chữ ký|chưa tự cài được/i],
['find_deployment', /danh sách triển khai|bản triển khai Web App/i],
['deploy', /cập nhật bản triển khai/i],
['rollback', /quay về bản trước/i],
['read_code', /đọc mã hiện tại|Không thấy appsscript\.json trong dự án/i],
['backup', /sao lưu/i],
['write_code', /ghi mã mới/i],
['create_version', /tạo phiên bản|không trả số phiên bản/i],
['scope_check', /Bản mới cần anh cho phép/i],
['setup', /Chưa cài xong/i],
['manifest', /version\.json (chưa có mã kiểm tra|không hợp lệ)|Không tải được (version\.json|release\.json|danh sách bản phát hành)/i],
['verify', /sha256|chữ ký|chưa được ký|chưa ký|thiếu phần máy chủ|không hợp lệ – dừng/i],
['download', /Không tải được (TatCa\.gs|ServerCore\.js|appsscript\.json)/i],
['install', /lên Google Drive|chạy thử|Drive đầy/i],
['manifest', /version\.json|release\.json|danh sách bản phát hành/i]
];
export function selfUpdateStep(e) {
const _o14 = e && typeof e.step === 'string' ? e.step.trim() : '';
if (_o14 && STEP_LABEL[_o14]) return _o14;
if (e && e.code === 'NETWORK') return 'call';
const _ou = _o13(e);
for (const [id, re] of _o8) if (re.test(_ou)) return id;
return '';
}
export function scrubSecrets(text, max = 800) {
let _o14 = String(text == null ? '' : text);
_o14 = _o14.replace(/([?&#](?:key|api_?key|token|access_token|id_token|refresh_token|auth|sig|signature|secret|client_secret|password|pw|code)=)[^&#\s"'<>)]+/gi, '$1***');
_o14 = _o14.replace(/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{8,}/g, '$1 ***');
_o14 = _o14.replace(/AIza[0-9A-Za-z_-]{20,}/g, 'AIza***');
_o14 = _o14.replace(/ya29\.[0-9A-Za-z._-]+/g, 'ya29.***');
_o14 = _o14.replace(/\bsk-(?:ant-)?[A-Za-z0-9_-]{16,}/g, 'sk-***');
_o14 = _o14.replace(/\bgh[pousr]_[A-Za-z0-9]{20,}/g, 'gh_***');
_o14 = _o14.replace(/\b\d{6,12}:[A-Za-z0-9_-]{30,}\b/g, '***:***');
_o14 = _o14.replace(/(\/macros\/s\/|script\.google\.com\/d\/|\/projects\/)[A-Za-z0-9_-]{16,}/g, '$1***');
_o14 = _o14.replace(/\bAKfyc[A-Za-z0-9_-]{10,}/g, 'AKfyc***');
_o14 = _o14.replace(/\b([A-Za-z_]*(?:token|password|passwd|secret|api_?key|signing_key|private_key))(["']?\s*[:=]\s*["']?)[^\s"',;&}]+/gi, '$1$2***');
_o14 = _o14.replace(/\b([A-Za-z0-9])[A-Za-z0-9._%+-]*@([A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})\b/g, '$1***@$2');
return _o14.length > max ? _o14.slice(0, max) + '…' : _o14;
}
function _o13(e) {
if (!e) return '';
return String(e.serverMessage || e.message || e.userMessage || '');
}
export function fmtVnTime(ts) {
const _oi = new Date(Number(ts) || Date.now());
try {
const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric', hourCycle: 'h23' }).formatToParts(_oi).map((_o19) => [_o19.type, _o19.value]));
return p.hour + ':' + p.minute + ':' + p.second + ' ' + p.day + '/' + p.month + '/' + p.year;
} catch { return _oi.toISOString(); }
}
const _oq = (_ou) => { const _or = /HTTP (\d{3})/.exec(_ou); return _or ? Number(_or[1]) : 0; };
const _om = (_ou) => (/ServerCore\.js/i.test(_ou) ? 'ServerCore.js' : /TatCa\.gs/i.test(_ou) ? 'TatCa.gs' : /appsscript\.json/i.test(_ou) ? 'appsscript.json' : /danh sách bản phát hành|release\.json/i.test(_ou) ? 'release.json' : 'version.json');
const _o6 = ['Dán mã máy chủ mới bằng tay MỘT lần (khoảng 3 phút): bấm “Xem cách làm”.', 'Từ lần sau app tự cập nhật máy chủ, đường dẫn app giữ nguyên.'];
export const MIGRATE = {
title: 'Cần dán mã máy chủ mới 1 lần (lần cuối)',
short: 'máy chủ bản cũ – cần dán mã máy chủ mới 1 lần (lần cuối)',
cause: 'Máy chủ đang chạy bản cũ – cách tự cập nhật của bản này Google không cho dùng nữa. Bản mới tự cập nhật bằng mã đã ký số lưu trên Google Drive của anh/chị, không cần bật gì.',
lines: ['Dán TatCa.gs mới bằng tay MỘT lần (khoảng 3 phút): bấm “Xem cách làm”.', 'Sau đó máy chủ tự cập nhật, không cần cài đặt gì – đường dẫn app giữ nguyên.']
};
export function needsMigration(v) { return !v || typeof v !== 'object' || !(Number(v.boot_version) >= 1); }
const _o9 = 'Bấm “Gửi cho hỗ trợ” để chép thông tin lỗi (không kèm khoá, mật khẩu) rồi gửi người phát hành.';
export const GCP_API_URL = 'https://console.developers.google.com/apis/api/script.googleapis.com/overview';
export const GCP_LIBRARY_URL = 'https://console.cloud.google.com/apis/library/script.googleapis.com';
export function gcpApiUrl(project) {
const p = String(project || '').trim();
return /^\d{1,20}$/.test(p) ? GCP_API_URL + '?project=' + p : GCP_LIBRARY_URL;
}
export const API_CAUSE_CODES = ['API_USER_SETTING', 'API_GCP_DISABLED', 'API_PROPAGATING', 'NOT_OWNER'];
const _o1 = /has not been used in project (\d{1,20})/i;
const _o3 = /^https:\/\/(console\.developers\.google\.com|console\.cloud\.google\.com|script\.google\.com)\/[^\s"'<>]*$/;
const _o2 = /^https:\/\/console\.(developers|cloud)\.google\.com\//;
const EMAIL_RE = /^[^\s@<>"']+@[^\s@<>"']+\.[A-Za-z]{2,}$/;
function _oc(e) { const v = String((e && e.account_email) || '').trim(); return EMAIL_RE.test(v) ? v : ''; }
export function googleRaw(e) {
const _oo = e && e.google && typeof e.google === 'object' ? e.google : null;
if (!_oo) return null;
const _o14 = (v, n) => scrubSecrets(v == null ? '' : typeof v === 'string' ? v : JSON.stringify(v), n);
return { http: Number(_oo.http) || 0, status: _o14(_oo.status, 60), reason: _o14(_oo.reason, 80), message: _o14(_oo.message, 600), details: _o14(_oo.details, 600) };
}
export function scriptApiCause(e) {
if (!e) return null;
const code = String(e.code || '');
const _ou = _o13(e);
const _oo = e.google && typeof e.google === 'object' ? e.google : {};
const text = _ou + ' ' + String(_oo.message || '');
const email = _oc(e);
const u = typeof e.url === 'string' && _o3.test(e.url) ? e.url : '';
const project = (() => {
const p = String(e.project_number || '').trim();
if (/^\d{1,20}$/.test(p)) return p;
const _or = _o1.exec(text) || /[?&]project=(\d{1,20})\b/.exec(text);
return _or ? _or[1] : '';
})();
if (code === 'API_USER_SETTING') return { code, project: '', url: u || API_SETTINGS_URL, email, legacy: false };
if (code === 'API_PROPAGATING') return { code, project: '', url: u || API_SETTINGS_URL, email, legacy: false };
if (code === 'NOT_OWNER') return { code, project: '', url: u || SCRIPT_HOME_URL, email, legacy: false };
if (code === 'API_GCP_DISABLED' || _o1.test(text) || String(_oo.reason || '').toUpperCase() === 'SERVICE_DISABLED') {
return { code: 'API_GCP_DISABLED', project, url: _o2.test(u) ? u : gcpApiUrl(project), email, legacy: code !== 'API_GCP_DISABLED' };
}
if (code === 'API_DISABLED' || code === 'SCRIPT_API_DISABLED' || /Chưa bật Apps Script API/i.test(_ou) ||
(/apps\s*script\s*api/i.test(_ou) && /(has not been used|is disabled|not enabled|enable it|chưa bật)/i.test(_ou))) {
return { code: 'API_USER_SETTING', project: '', url: u || API_SETTINGS_URL, email, legacy: true };
}
return null;
}
export function classifySelfUpdate(e, { at } = {}) {
const code = String((e && e.code) || '');
const _ou = _o13(e);
const url = e && typeof e.url === 'string' && /^https:\/\//.test(e.url) ? e.url : '';
const step = selfUpdateStep(e);
const _og = { code: code || 'UNKNOWN', step, stepLabel: STEP_LABEL[step] || '', message: scrubSecrets(_ou), at: Number(at || (e && e.at)) || Date.now(), allow: null, retry: true, support: false, manual: false,
google: googleRaw(e), email: _oc(e), project: '' };
const _o11 = (o) => Object.assign(_og, o, { toast: 'Chưa cập nhật được máy chủ: ' + o.short + '.' });
const http = _oq(_ou);
if (code === 'NEEDS_PASTE') {
const manifest = (e && e.what === 'manifest') || /quyền Google/i.test(_ou);
const scopes = Array.isArray(e && e.scopes) ? e.scopes.map((_o19) => String(_o19).replace(/^https:\/\/www\.googleapis\.com\/auth\//, '')).slice(0, 4) : [];
return _o11({
kind: 'paste', title: 'Bản mới cần dán mã máy chủ bằng tay 1 lần', short: manifest ? 'bản mới cần thêm quyền Google – dán tay 1 lần' : 'bản mới đổi phần khởi động – dán tay 1 lần',
cause: manifest ? 'Bản mới cần thêm quyền Google' + (scopes.length ? ' (' + scopes.join(', ') + ')' : '') + ' – máy chủ không tự sửa tệp quyền (appsscript.json) được.'
: 'Bản mới thay phần khởi động của máy chủ (rất hiếm) – phần này chỉ thay được bằng dán tay.',
lines: [manifest ? 'Dán appsscript.json + TatCa.gs mới bằng tay MỘT lần, chạy setup → Cho phép: bấm “Xem cách làm”.' : _o6[0], 'Máy chủ vẫn chạy bản cũ trong lúc chờ; dán xong lại tự cập nhật như thường.'],
manual: true, retry: false
});
}
if (code === 'SMOKE_FAILED') {
return _o11({
kind: 'smoke', title: 'Bản mới chạy thử không đạt – máy chủ giữ bản đang dùng', short: 'bản mới chạy thử không đạt (máy chủ giữ bản cũ)',
cause: 'Máy chủ đã tải và kiểm chữ ký bản mới, nhưng chạy thử không đạt nên tự giữ bản đang dùng – không có gì bị thay, dữ liệu giữ nguyên.',
lines: ['Không cần làm gì: app vẫn chạy bình thường trên bản cũ.', _o9], support: true
});
}
if (code === 'DRIVE_FULL') {
return _o11({
kind: 'drive', title: 'Google Drive đầy – máy chủ chưa lưu được mã mới', short: 'Google Drive đầy, chưa lưu được mã máy chủ mới',
cause: 'Máy chủ lưu mã mới (khoảng 0,5–1 MB) vào thư mục “BDS Studio – Mã máy chủ” trên Google Drive nhưng Drive đã đầy – chưa có gì bị thay.',
lines: ['Bấm “Mở Drive” (đúng tài khoản chạy máy chủ): dọn bớt tệp hoặc Thùng rác.', 'Xong bấm “Thử lại”.'],
allow: { label: 'Mở Drive', url: DRIVE_STORAGE_URL }
});
}
const _ob = scriptApiCause(e);
if (_ob || code === 'NOT_OWNER' || /Apps Script API lỗi khi|Apps Script không trả số phiên bản|bản triển khai Web App|Có nhiều bản triển khai/i.test(_ou)) {
return _o11({ kind: 'old_server', migrate: true, legacy: true, apiCode: _ob ? _ob.code : code, project: _ob ? _ob.project : '', title: MIGRATE.title, short: MIGRATE.short, cause: MIGRATE.cause, lines: MIGRATE.lines, manual: true });
}
const _o10 = /thiếu quyền script\.projects/i.test(_ou);
const _ox = /chưa tự cập nhật được/i.test(_ou);
const _oz = /chưa có bộ kiểm chữ ký/i.test(_ou);
const _oy = /version\.json chưa có mã kiểm tra sha256/i.test(_ou);
if (isMissingActionError(e) || code === 'NOT_FOUND' || ((code === 'BAD_INPUT' || code === 'SIGNATURE_INVALID' || code === 'UPDATE_FAILED' || !code) && (_o10 || _ox || _oz || _oy))) {
const cause = _o10 ? 'Máy chủ đang chạy bản 1.0.3 với tệp appsscript.json cũ – thiếu quyền script.projects / script.deployments nên không tự thay mã được.'
: _oz ? 'Máy chủ chưa có bộ kiểm chữ ký số mà bản phát hành mới yêu cầu.'
: _oy ? 'Máy chủ bản 1.0.3 không đọc được cách đóng gói có ký số của bản mới (version.json không còn mã sha256 kiểu cũ).'
: _ox ? 'Máy chủ đang chạy bản cũ, chưa có chức năng tự cập nhật.'
: 'Máy chủ đang chạy bản cũ, chưa có lệnh tự cập nhật.';
return _o11({
kind: 'old_server', migrate: true, title: MIGRATE.title, short: MIGRATE.short,
cause, lines: _o10 ? ['Dán TatCa.gs và appsscript.json mới bằng tay MỘT lần, chạy setup → Cho phép: bấm “Xem cách làm”.', MIGRATE.lines[1]] : MIGRATE.lines,
manual: true
});
}
if (code === 'SCOPE_MISSING' || /Phiên Google của máy chủ hết hạn/i.test(_ou)) {
const _ok = /hết hạn/i.test(_ou);
const scopes = Array.isArray(e && e.scopes) ? e.scopes.map((_o19) => String(_o19).replace(/^https:\/\/www\.googleapis\.com\/auth\//, '')).slice(0, 4) : [];
return _o11({
kind: 'scope', title: 'Google cần anh/chị cấp thêm quyền cho máy chủ', short: _ok ? 'phiên cấp quyền Google của máy chủ đã hết hạn' : 'máy chủ thiếu quyền Google (cần cấp lại)',
cause: _ok ? 'Phiên cấp quyền Google của máy chủ đã hết hạn.'
: 'Google chưa cấp đủ quyền cho máy chủ' + (scopes.length ? ' (' + scopes.join(', ') + ')' : '') + ' – tài khoản chạy máy chủ chưa bấm “Cho phép” cho quyền mới.',
lines: ['Bấm “Cho phép” → mở dự án BDS Studio → chọn hàm setup → Chạy → Cho phép (đúng tài khoản Google).', 'Xong quay lại đây bấm “Thử lại”.'],
allow: { label: 'Cho phép', url: url || SCRIPT_HOME_URL }
});
}
if (/sao lưu/i.test(_ou) && /Drive/i.test(_ou)) {
return _o11({
kind: 'backup', title: 'Máy chủ không sao lưu được mã cũ lên Google Drive', short: 'không sao lưu được mã cũ lên Google Drive',
cause: 'Máy chủ phải lưu bản sao mã cũ lên Drive trước khi thay, nhưng Drive không nhận (hết dung lượng hoặc thiếu quyền) – chưa có gì bị thay.',
lines: ['Bấm “Mở Drive” (đúng tài khoản chạy máy chủ): kiểm tra còn dung lượng; đầy thì dọn bớt Thùng rác.', 'Vẫn lỗi: mở Apps Script, chạy setup một lần → Cho phép (quyền Drive), rồi bấm “Thử lại”.'],
allow: { label: 'Mở Drive', url: DRIVE_STORAGE_URL }
});
}
if (code === 'SIGNATURE_INVALID' || /không khớp sha256|sha256[^.]*không khớp/i.test(_ou) || /thiếu phần máy chủ/i.test(_ou) || /chữ ký[^.]*không đúng|chưa được ký/i.test(_ou)) {
const cause = /không khớp/i.test(_ou) ? 'Tệp máy chủ tải về khác với bản đã ký (mã sha256 không khớp) – có thể bị sửa hoặc tải dở.'
: /chưa được ký|chưa ký/i.test(_ou) ? 'Bản phát hành trên trang app chưa được ký số.'
: /thiếu phần máy chủ/i.test(_ou) ? 'Tệp TatCa.gs tải về không đầy đủ.'
: /chữ ký[^.]*không đúng/i.test(_ou) ? 'Chữ ký số của bản phát hành không đúng.'
: 'Bản phát hành thiếu chữ ký hoặc mã kiểm tra hợp lệ.';
return _o11({
kind: 'signature', title: 'Bản cập nhật máy chủ chưa qua kiểm tra an toàn', short: 'bản cập nhật không qua kiểm chữ ký/sha256 (đừng dán tay)',
cause, lines: ['App dừng lại để an toàn, máy chủ vẫn chạy bản cũ, dữ liệu giữ nguyên. KHÔNG dán tay TatCa.gs lúc này.', _o9],
support: true
});
}
if (/Không tải được (version\.json|TatCa\.gs|ServerCore\.js|appsscript\.json|danh sách bản phát hành|release\.json)/i.test(_ou) || /^version\.json không hợp lệ|appsscript\.json tải về không hợp lệ/i.test(_ou)) {
const _ol = _om(_ou);
const _o18 = http === 404 ? 'trang phát hành chưa có tệp này (HTTP 404)' : http ? 'trang phát hành trả lỗi HTTP ' + http : /không kết nối được/i.test(_ou) ? 'không kết nối được tới tên miền app' : 'tệp tải về không đọc được';
return _o11({
kind: 'fetch', title: 'Máy chủ không tải được bản mới từ trang app', short: 'máy chủ không tải được ' + _ol + ' từ trang app',
cause: 'Máy chủ Google không tải được ' + _ol + ' từ trang phát hành: ' + _o18 + '.',
lines: ['Mở trang app trên trình duyệt xem có vào được không (tên miền còn hạn, đang chạy).', 'Thử lại sau 5–10 phút (trang phát hành có thể đang lên bản mới); vẫn lỗi thì bấm “Gửi cho hỗ trợ”.']
});
}
const _os = /Có nhiều bản triển khai/i.test(_ou);
if (_os || /Chưa có bản triển khai Web App/i.test(_ou) || (/triển khai/i.test(_ou) && (http === 404 || /not found|NOT_FOUND|không tìm thấy/i.test(_ou)))) {
return _o11({
kind: 'deployment', title: _os ? 'Máy chủ chưa biết bản triển khai nào đang chạy app' : 'Không tìm thấy bản triển khai Web app đang chạy', short: _os ? 'có nhiều bản triển khai Web app – chưa biết bản đang dùng' : 'không tìm thấy bản triển khai Web app đang chạy',
cause: _os ? 'Dự án Apps Script có nhiều bản triển khai Web app nên máy chủ chưa biết bản nào là đường dẫn app đang dùng.' : 'Bản triển khai Web app mà máy chủ ghi nhớ không còn (đã xoá, hoặc đường dẫn app là bản triển khai khác).',
lines: _os ? ['Mở Apps Script, chọn hàm setup, bấm Chạy một lần để máy chủ ghi nhớ bản đang dùng, rồi bấm “Thử lại”.', 'Hoặc Triển khai › Quản lý việc triển khai: lưu trữ các bản Web app không dùng.']
: ['Mở Apps Script › Triển khai › Quản lý việc triển khai: xem bản “Ứng dụng web” nào có đường dẫn trùng đường dẫn máy chủ trong app.', 'Không còn bản nào: Triển khai › Triển khai mới › Ứng dụng web, dán đường dẫn mới vào Cài đặt › Kết nối, chạy setup một lần.'],
allow: { label: 'Mở Apps Script', url: url || SCRIPT_HOME_URL }
});
}
if (/Apps Script API lỗi khi|Apps Script không trả số phiên bản/i.test(_ou)) {
const _oh = http === 429 || /quota|rate|limit/i.test(_ou);
return _o11({
kind: 'google', title: 'Google Apps Script báo lỗi khi ' + (STEP_LABEL[step] || 'cập nhật'), short: _oh ? 'Google tạm giới hạn số lần gọi' : 'Google Apps Script lỗi khi ' + (STEP_LABEL[step] || 'cập nhật'),
cause: _oh ? 'Google tạm giới hạn số lần gọi Apps Script API của tài khoản này.' : 'Google Apps Script báo lỗi ở bước “' + (STEP_LABEL[step] || 'cập nhật') + '”' + (http ? ' (HTTP ' + http + ')' : /không kết nối được/i.test(_ou) ? ' (không kết nối được)' : '') + ' – máy chủ vẫn chạy bản cũ.',
lines: ['Thường là lỗi tạm của Google: đợi khoảng 5 phút rồi bấm “Thử lại”.', 'Lặp lại nhiều lần thì bấm “Gửi cho hỗ trợ”.'],
support: http >= 400 && http < 500 && !_oh
});
}
if (code === 'NETWORK') {
const _o16 = !!(e && e.cause && /abort/i.test(String(e.cause.name || e.cause.message || '')));
return _o11({
kind: 'network', title: 'Chưa gọi được máy chủ', short: _o16 ? 'máy chủ trả lời quá lâu' : 'mạng không gọi được máy chủ',
cause: _o16 ? 'Máy chủ chạy lâu quá nên app ngừng chờ – có thể máy chủ vẫn đang cập nhật.' : 'Máy này chưa gọi được máy chủ (mất mạng hoặc đường dẫn máy chủ sai).',
lines: ['Kiểm tra mạng, đợi 1 phút rồi bấm “Thử lại” – nếu máy chủ đã cập nhật xong, app sẽ báo bản mới.']
});
}
if (code === 'FORBIDDEN' || code === 'AUTH_REQUIRED' || code === 'AUTH_INVALID') {
return _o11({
kind: 'forbidden', title: 'Chỉ Quản trị (Admin) cập nhật được máy chủ', short: code === 'FORBIDDEN' ? 'tài khoản này không phải Quản trị' : 'phiên đăng nhập đã hết',
cause: code === 'FORBIDDEN' ? 'Tài khoản đang đăng nhập không phải Quản trị (Admin).' : 'Phiên đăng nhập đã hết hạn.',
lines: [code === 'FORBIDDEN' ? 'Đăng nhập bằng tài khoản Quản trị (Admin) rồi bấm “Thử lại”.' : 'Đăng nhập lại rồi bấm “Thử lại”.'], retry: code !== 'FORBIDDEN'
});
}
const _ov = /Chưa cài xong/i.test(_ou);
return _o11({
kind: 'other', title: _ov ? 'Máy chủ chưa cài xong bản mới' : 'Chưa cập nhật được máy chủ', short: _ov ? 'máy chủ chưa cài xong bảng/cột/hẹn giờ' : (code === 'INTERNAL' ? 'máy chủ gặp lỗi bất ngờ' : 'máy chủ báo lỗi (xem Chi tiết kỹ thuật)'),
cause: _ov ? 'Máy chủ đã lên bản mới nhưng chưa tạo xong bảng, cột hoặc hẹn giờ.'
: code === 'INTERNAL' ? 'Máy chủ gặp lỗi bất ngờ (đã ghi vào nhật ký lỗi của máy chủ).'
: /Không thấy appsscript\.json/i.test(_ou) ? 'Dự án Apps Script không trả về tệp appsscript.json.'
: (_og.message || 'Máy chủ báo lỗi chưa rõ.'),
lines: [_ov ? 'Mở Apps Script, chọn hàm setup, bấm Chạy một lần rồi bấm “Thử lại”.' : 'Bấm “Thử lại”; vẫn lỗi thì bấm “Gửi cho hỗ trợ”.'],
support: true
});
}
export function techLines(c) {
if (!c) return [];
const _oo = c.google;
return [
'Máy chủ báo: ' + (c.message || '(không có câu báo)'),
_oo ? 'Google trả về: ' + ([_oo.http ? 'HTTP ' + _oo.http : '', _oo.status, _oo.reason].filter(Boolean).join(' · ') || '(không rõ)') + (_oo.message ? ' – ' + _oo.message : '') : '',
_oo && _oo.details ? 'Chi tiết Google: ' + _oo.details : '',
'Mã lỗi: ' + (c.code || 'UNKNOWN'),
'Bước hỏng: ' + (c.stepLabel ? c.stepLabel + ' (' + c.step + ')' : 'chưa rõ'),
'Lúc: ' + fmtVnTime(c.at)
].filter(Boolean);
}
export function supportDiagnostic(c, versions = {}) {
const v = versions || {};
const ver = [['Web', v.web], ['Máy chủ đang chạy', v.server], ['Bản cần lên', v.target], ['Máy dựng', v.engine]].filter((_o19) => _o19[1]).map((_o19) => _o19[0] + ' v' + String(_o19[1]).replace(/^v/, '')).join(' · ');
const lines = ['BDS Studio – lỗi cập nhật máy chủ', ver ? 'Phiên bản: ' + ver : '', v.edition ? 'Bản: ' + v.edition : '',
'Loại: ' + ((c && c.kind) || 'other') + ' – ' + ((c && c.short) || (c && c.title) || ''), ...techLines(c)].filter(Boolean);
return scrubSecrets(lines.join('\n'), 2400);
}
export function scriptApiVerdict(r, { at } = {}) {
const _o19 = r || { ok: false, code: 'HTTP', message: 'Máy chủ không trả kết quả.' };
if (_o19.ok) {
const email = _oc(_o19);
return _o19.skipped ? { ok: null, kind: 'skipped', code: '', title: _o19.message || 'Chế độ này không dùng Apps Script API.', cause: '', lines: [], allow: null, info: null }
: { ok: true, kind: 'ok', code: '', title: 'Apps Script API đã bật – máy chủ tự cập nhật được.', cause: email ? 'Tài khoản chạy máy chủ: ' + email + '.' : '', lines: [], allow: null, info: null };
}
const _oj = _o19.error || _o19._err || null;
if (_oj && isMissingActionError(_oj)) {
return { ok: false, kind: 'old_server', code: String(_oj.code || ''), title: 'Máy chủ bản này chưa có phép “Kiểm tra Apps Script API”', cause: 'Máy chủ đang chạy bản cũ.',
lines: ['Cập nhật bằng tay một lần (mục “Cập nhật bằng tay” bên dưới) – bản mới kiểm và chỉ ra đúng nguyên nhân.'], allow: null, info: classifySelfUpdate(_oj, { at }) };
}
const info = classifySelfUpdate(_oj || { code: _o19.code === 'HTTP' ? 'UPDATE_FAILED' : _o19.code, message: _o19.message, url: _o19.url, google: _o19.google, account_email: _o19.account_email, project_number: _o19.project_number }, { at });
const _od = ['enable_api', 'gcp_api', 'api_wait', 'not_owner', 'scope'].includes(info.kind);
return { ok: false, kind: info.kind, code: String((_oj && _oj.code) || _o19.code || info.code), title: _od ? info.title : 'Apps Script API trả lỗi', cause: _od ? info.cause : (info.message || 'Không rõ nguyên nhân.'),
lines: _od ? info.lines : ['Thử lại sau 5 phút; vẫn lỗi thì bấm “Gửi cho hỗ trợ”.'], allow: info.allow, info };
}
export const TABLE_LABEL = {
objects: 'Hồ sơ', events: 'Lịch sử chăm sóc', reminders: 'Nhắc việc', policies: 'Chính sách', quotes: 'Báo giá',
projects: 'Dự án', jobs: 'Việc máy dựng', ideas: 'Ý tưởng', characters: 'Nhân vật', settings: 'Cài đặt'
};
export const REJECT_REASON = {
FORBIDDEN: 'tài khoản này không có quyền sửa mục đó',
BAD_TABLE: 'máy chủ bản cũ chưa có loại dữ liệu này – cần cập nhật máy chủ',
BAD_ID: 'mã của mục không hợp lệ',
BAD_OP: 'thao tác không hợp lệ (mục cài đặt không xoá được)',
TOO_LARGE: 'nội dung quá lớn (quá 45.000 ký tự)',
DUP: 'trùng số điện thoại/email với khách đã có trên máy chủ – giữ hồ sơ cũ, chỉ bổ sung ô còn trống',
UNKNOWN_ACTION: MISSING_ACTION_TEXT.replace(/\.$/, '').toLowerCase(),
REJECTED: 'máy chủ từ chối'
};
export function rejectReason(code) { return REJECT_REASON[code] || REJECT_REASON.REJECTED + (code ? ' (' + code + ')' : ''); }
export function rejectedItemText(r) {
const _o17 = TABLE_LABEL[r && r.table] || (r && r.table) || 'Dữ liệu';
const name = String((r && (r.name || r.id)) || '').slice(0, 40);
return _o17 + (name ? ' “' + name + '”' : '') + ': ' + rejectReason(r && r.error);
}
export function rejectionMessage(rejected) {
const list = Array.isArray(rejected) ? rejected.filter(Boolean) : [];
if (!list.length) return '';
const _o15 = list.slice(0, 3).map(rejectedItemText);
const _ot = list.length > 3 ? '; và ' + (list.length - 3) + ' thay đổi khác' : '';
return 'Máy chủ không nhận ' + list.length + ' thay đổi – ' + _o15.join('; ') + _ot + '. Đã trả về bản trên máy chủ.';
}
export const PART_NEED = { web: 'Web app cần cập nhật', gas: 'Máy chủ cần cập nhật', engine: 'Máy dựng cần cập nhật' };
export function updateHints(parts, running = {}, latest = {}) {
return (Array.isArray(parts) ? parts : []).map((p) => {
const _oa = running && running[p]; const _of = latest && latest[p];
return (PART_NEED[p] || p) + (_oa && _of ? ' (v' + _oa + ' → v' + _of + ')' : '');
});
}
const _o5 = /^(ok|pass|passed|green|good|true|đạt)$/i;
const _o0 = /^(fail|failed|error|red|bad|false|lỗi)$/i;
function _ow(_o19) {
if (typeof _o19.ok === 'boolean') return _o19.ok;
const _o14 = _o19.status != null ? String(_o19.status) : _o19.state != null ? String(_o19.state) : '';
if (_o5.test(_o14)) return true;
if (_o0.test(_o14)) return false;
return null;
}
const _o7 = { email: 'open-profile' };
const _on = (id, _o14) => (id === 'email' ? _o14.replace(/Cài đặt\s*(?:→|›)\s*Kết nối\s*(?:→|›)\s*Email/g, 'Cài đặt › Thông tin cá nhân')
: id === 'script_api' ? MIGRATE.title + '. ' + MIGRATE.lines[0].replace(': bấm “Xem cách làm”', ': Cài đặt › Phiên bản') : _o14);
export function normalizeServerChecks(res) {
const _oe = Array.isArray(res) ? res : (res && (res.checks || res.items || res.results)) || [];
return _oe.filter((_o19) => _o19 && typeof _o19 === 'object').map((_o19, i) => {
const _o12 = String(_o19.id || _o19.key || _o19.name || i);
const o = {
id: 'srv.' + _o12,
label: String(_o19.label || _o19.title || _o19.name || _o19.id || 'Mục ' + (i + 1)),
ok: _ow(_o19),
detail: String(_o19.detail || _o19.message || _o19.text || ''),
fix: _ow(_o19) === false || _o12 !== 'script_api' ? _on(_o12, String(_o19.fix || _o19.how || _o19.hint || '')) : String(_o19.fix || ''),
url: typeof _o19.url === 'string' && /^https:\/\//.test(_o19.url) ? _o19.url : '',
source: 'server'
};
if (typeof _o19.url_label === 'string' && _o19.url_label && o.url) o.url_label = _o19.url_label.slice(0, 80);
if (_o7[_o12] && o.ok === false) o.action = _o7[_o12];
if (_o19.skipped) o.skipped = true;
return o;
});
}
export function summarizeChecks(items) {
const list = Array.isArray(items) ? items : [];
const skip = list.filter((_o19) => _o19.skipped).length;
const ok = list.filter((_o19) => _o19.ok === true && !_o19.skipped).length;
const bad = list.filter((_o19) => _o19.ok === false && !_o19.skipped).length;
const warn = list.length - ok - bad - skip;
const _op = bad ? '❌ ' + bad + ' mục cần sửa' : '✅ Mọi phần thông suốt';
const text = _op + ' · ' + ok + ' đạt' + (skip ? ' · ' + skip + ' bỏ qua (không bắt buộc)' : '') + (warn ? ' · ' + warn + ' chưa rõ' : '') + '.';
const lines = list.filter((_o19) => _o19.ok === false && !_o19.skipped).slice(0, 10).map((_o19) => '❌ ' + _o19.label + (_o19.detail ? ' – ' + _o19.detail : ''));
return { ok, bad, warn, skip, total: list.length, text, telegram: ['Kiểm tra toàn bộ BDS Studio: ' + text].concat(lines).join('\n') };
}
export function compactResult(items, at) {
return { at: Number(at) || Date.now(), items: (items || []).map((_o19) => ({ id: _o19.id, label: _o19.label, ok: _o19.ok, detail: _o19.detail, fix: _o19.fix, url: _o19.url, url_label: _o19.url_label || '', source: _o19.source, action: _o19.action || '', ...(_o19.skipped ? { skipped: true } : {}) })) };
}
export default {
isMissingActionError, needServerUpdate, needsMigration, MIGRATE, classifySelfUpdate, selfUpdateStep, scrubSecrets, techLines, scriptApiCause, scriptApiVerdict, googleRaw, gcpApiUrl, supportDiagnostic, fmtVnTime, STEP_LABEL, rejectionMessage, rejectedItemText, rejectReason,
updateHints, normalizeServerChecks, summarizeChecks, compactResult, REQUIRED_ACTIONS, MISSING_ACTION_TEXT, WAIT_OWNER_TEXT
};

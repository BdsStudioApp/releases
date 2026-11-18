import { scrubSecrets } from './health_logic.9704b81308.js';
export const FRIENDLY = {
network: 'Không kết nối được mạng hoặc máy chủ. Kiểm tra Internet (Wi-Fi/4G) rồi thử lại.',
timeout: 'Máy chủ trả lời quá lâu. Đợi một lát rồi thử lại.',
not_found: 'Không tìm thấy tệp hoặc trang cần mở (có thể bản mới đang được đưa lên). Thử lại sau 5–10 phút.',
auth: 'Không có quyền làm việc này, hoặc phiên đăng nhập đã hết hạn. Đăng nhập lại; vẫn bị thì nhờ Chủ tài khoản kiểm tra quyền.',
html: 'Máy chủ trả về một trang web thay cho dữ liệu – thường do URL máy chủ chưa đúng, chưa triển khai Web App, hoặc Google đang đòi đăng nhập. Kiểm tra URL máy chủ ở Cài đặt › Kết nối.',
server: 'Máy chủ đang trục trặc tạm thời. Thử lại sau ít phút.',
quota: 'Dịch vụ đang quá tải hoặc hết lượt dùng trong ngày. Thử lại sau.',
generic: 'Có trục trặc nhỏ. Thử lại sau giây lát.'
};
const _o0 = /[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/i;
export function httpStatusOf(err, text = '') {
const _o6 = Number(err && (err.status || err.http_status || err.statusCode));
if (_o6 >= 100 && _o6 < 600) return _o6;
const _o2 = /\bHTTP\s*(\d{3})\b|\bstatus(?:\s*code)?\s*[:=]?\s*(\d{3})\b/i.exec(String(text || ''));
return _o2 ? Number(_o2[1] || _o2[2]) : 0;
}
function _o5(err) {
if (err == null) return '';
if (typeof err === 'string') return err;
const _o4 = [err.serverMessage, err.message, err.userMessage, err.cause && err.cause.message].filter(Boolean).map(String);
return [...new Set(_o4)].join(' | ');
}
function _o7(err) {
if (!err || typeof err !== 'object') return '';
const ref = /^[A-Z]-[0-9A-Z]{3,16}$/.test(String(err.ref || '')) ? String(err.ref) : '';
const reason = typeof err.reason === 'string' ? err.reason.slice(0, 240) : '';
return [ref ? 'Mã lỗi: ' + ref : '', reason ? 'Nguyên nhân: ' + reason : ''].filter(Boolean).join(' · ');
}
export function friendlyError(err, { online } = {}) {
const raw = _o5(err);
const code = String((err && err.code) || '');
const name = String((err && err.name) || '');
const status = httpStatusOf(err, raw);
const _o8 = _o7(err);
const detail = scrubSecrets([code && code !== 'NETWORK' ? 'Mã: ' + code : '', status ? 'HTTP ' + status : '', raw, _o8].filter(Boolean).join(' · '), 600);
const _o3 = (kind, message) => ({ kind, message, detail: detail && detail !== message ? detail : '', raw });
if (name === 'AbortError' || code === 'TIMEOUT' || /time(?:d)?\s*out|timeout|hết thời gian chờ|ETIMEDOUT|aborted/i.test(raw)) return _o3('timeout', FRIENDLY.timeout);
if (/<!doctype html|<html[\s>]|Unexpected token '?<'?|is not valid JSON|JSON\.parse: unexpected character/i.test(raw)) return _o3('html', FRIENDLY.html);
if (status === 404 || /\b404\b|Not Found/i.test(raw)) return _o3('not_found', FRIENDLY.not_found);
if (status === 401 || status === 403 || /\bForbidden\b|\bUnauthorized\b|permission denied|PERMISSION_DENIED/i.test(raw)) return _o3('auth', FRIENDLY.auth);
if (status === 429 || /RESOURCE_EXHAUSTED|rate limit|quota exceeded|Too Many Requests/i.test(raw)) return _o3('quota', FRIENDLY.quota);
if (status >= 500 || /Internal Server Error|Bad Gateway|Service Unavailable/i.test(raw)) return _o3('server', FRIENDLY.server);
if (code === 'NETWORK' || online === false || /Failed to fetch|NetworkError|Load failed|network (?:error|request failed)|ERR_(?:INTERNET|NAME|CONNECTION|NETWORK)|ECONNREFUSED|ENOTFOUND|fetch failed/i.test(raw)) return _o3('network', FRIENDLY.network);
const _o9 = err && typeof err === 'object' ? String(err.userMessage || err.message || '') : String(err || '');
if (_o9 && _o0.test(_o9) && !/\b(?:Error|Exception|undefined|null|TypeError|at\s+\w+\s*\()\b/.test(_o9)) {
const _o1 = [code && (_o8 || !/^(INTERNAL|BAD_INPUT)$/.test(code)) ? 'Mã: ' + code : '', _o8].filter(Boolean).join(' · ');
return { kind: 'app', message: _o9, detail: scrubSecrets(_o1, 600), raw };
}
return _o3('generic', FRIENDLY.generic);
}
export function errorText(err, opts) { return friendlyError(err, opts).message; }
export default { FRIENDLY, friendlyError, errorText, httpStatusOf };

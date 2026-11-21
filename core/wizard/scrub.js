export const MASK = '[đã ẩn]';
const _o0 = /^(pw\d?|pass(word)?\d?|password_?\w*|\w*_?pw|pw_hash|old_hash|new_hash|hash|salt|pepper|token|\w+_token|access_token|refresh_token|secret|\w+_secret|key|\w+_key|api_?key|apikey|otp|code_?\w*|tfa_ticket|ticket|authorization|cookie|session\w*|signature|sig|private\w*|logo|image|photo|b64|base64)$/i;
const RULES = [
[/data:[a-z]+\/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+/gi, '[ảnh/tệp đã bỏ]'],
[/(^|[^A-Za-z0-9_À-ỹ])((?:mật\s*khẩu|password|passwd|pass|pw|token|secret|api[\s_-]?key|khoá|khóa|key|otp|mã\s*(?:xác\s*nhận|đăng\s*nhập|dự\s*phòng|2\s*lớp|bot))(?:\s*[:=]\s*|\s+))("[^"]*"|'[^']*'|[^\s,;&"']{3,})/gi, '$1$2' + MASK],
[/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{6,}\b/g, '[đã ẩn vé]'],
[/\b\d{6,12}:[A-Za-z0-9_-]{30,}\b/g, '[đã ẩn mã bot]'],
[/\bAIza[0-9A-Za-z_-]{30,}\b/g, '[đã ẩn khoá Google]'],
[/\bsk-(?:ant-)?[A-Za-z0-9_-]{16,}\b/g, '[đã ẩn khoá AI]'],
[/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{8,}/gi, '$1 ' + MASK],
[/(\/macros\/s\/)([A-Za-z0-9_-]{4})[A-Za-z0-9_-]{8,}([A-Za-z0-9_-]{4})(?=\/|\b)/g, '$1$2…$3'],
[/([?&](?:key|token|secret|password|pw|sig|signature|code|ticket)=)[^&\s#[]+/gi, '$1' + MASK],
[/\b[a-f0-9]{32,}\b/gi, '[đã ẩn chuỗi dài]'],
[/\b[A-Za-z0-9+/_-]{40,}={0,2}/g, '[đã ẩn chuỗi dài]'],
[/\b([A-Za-z0-9._%+-])[A-Za-z0-9._%+-]*@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/g, '$1***@$2'],
[/(?<![\d+])(?:\+?84|0)(?:[\s.-]?\d){8,10}(?![\d])/g, (m) => { const _o1 = m.replace(/\D/g, ''); return _o1.length >= 9 && _o1.length <= 12 ? m.slice(0, 3) + '*****' + _o1.slice(-2) : m; }],
[/(\bmã\s+)\d{6}\b/gi, '$1' + MASK]
];
export function scrubText(input) {
let _o3 = String(input == null ? '' : input);
for (const [re, rep] of RULES) _o3 = _o3.replace(re, rep);
return _o3;
}
export function scrubObject(value, depth = 0) {
if (depth > 8) return '[…]';
if (value == null || typeof value === 'number' || typeof value === 'boolean') return value;
if (typeof value === 'string') return scrubText(value);
if (Array.isArray(value)) return value.slice(0, 200).map((v) => scrubObject(v, depth + 1));
if (typeof value === 'object') {
const _o2 = {};
for (const [k, v] of Object.entries(value)) {
if (_o0.test(k) && v != null && v !== '' && typeof v !== 'boolean') { _o2[k] = MASK; continue; }
_o2[k] = scrubObject(v, depth + 1);
}
return _o2;
}
return MASK;
}
export function looksSecret(text) {
const _o3 = String(text || '');
return /\b\d{6,12}:[A-Za-z0-9_-]{30,}\b/.test(_o3) || /\bAIza[0-9A-Za-z_-]{30,}\b/.test(_o3) || /\bsk-(?:ant-)?[A-Za-z0-9_-]{16,}\b/.test(_o3) ||
/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\./.test(_o3) || /data:[a-z]+\/[a-z0-9.+-]+;base64,/i.test(_o3);
}
export default { scrubText, scrubObject, looksSecret, MASK };

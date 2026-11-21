export const GEMINI_PRICE = { model: 'gemini-3.8-flash', in: 0.75, out: 3.75, from: 1798736400000, next: { in: 1.5, out: 7.5 } };
export function localEstimate({ images = 1, chars = 3000, free = true, at = Date.now(), enabled = null } = {}) {
const _o3 = at >= GEMINI_PRICE.from ? GEMINI_PRICE.next : GEMINI_PRICE;
const _o5 = Math.ceil((Math.max(0, Number(chars) || 0) + 4000) / 3) + Math.max(0, Number(images) || 0) * 1600, tout = 6000;
return { provider: 'gemini', model: GEMINI_PRICE.model, free: !!free, enabled, usd: free ? 0 : Math.round((_o5 * _o3.in + tout * _o3.out) / 1e6 * 10000) / 10000, local: true };
}
const _o2 = (x, d) => Number(x || 0).toLocaleString('vi-VN', { maximumFractionDigits: d });
export function costText(e, { what = 'lần đọc này' } = {}) {
if (!e) return 'Đang tính chi phí ước tính…';
if (e.enabled === false) return 'Chưa có khoá Gemini trên máy chủ – dán khoá ở Cài đặt › Kết nối (nhân viên: nhờ Quản trị) rồi mới dùng AI được. Trong lúc chờ, anh/chị nhập tay hoặc làm qua chat Claude/Gemini (miễn phí).';
if (e.free) return `Chi phí AI ước tính cho ${what}: 0 USD – Gemini (${e.model || 'Gemini'}) đang ở hạn mức miễn phí của khoá. Hết hạn mức miễn phí thì Google tính phí theo bảng giá của Google.`;
return `Mất phí AI: ≈ ${_o2(e.usd, 4)} USD tiền Gemini (${e.model || 'Gemini'}) cho ${what}` +
(e.budget_cap_usd ? ` – tháng này đã dùng ${_o2(e.budget_spent_usd, 2)}/${_o2(e.budget_cap_usd, 0)} USD ngân sách AI.` : ', cộng vào ngân sách AI tháng.') +
(e.local ? ' (Ước tính tại máy theo bảng giá công khai.)' : '');
}
export function pdfPages(bytes) {
const _o6 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
let _o4 = '', count = 0;
const CH = 1 << 16, re = /\/Type\s*\/Page(?![a-zA-Z])/g;
for (let _o0 = 0; _o0 < _o6.length; _o0 += CH) {
_o4 = _o4.slice(-16) + String.fromCharCode.apply(null, _o6.subarray(_o0, _o0 + CH));
const _o1 = _o4.match(re);
if (_o1) count += _o1.length;
_o4 = _o4.replace(re, '');
}
return count;
}

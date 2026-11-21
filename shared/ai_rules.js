export const AI_RULES_MARK = '[Nguyên tắc trả lời – bắt buộc]';
export const AI_RULES_TEXT = [
AI_RULES_MARK,
'- Chỉ nêu thông tin CÓ NGUỒN (đường link, ảnh hoặc tài liệu người dùng đưa vào, hoặc kết quả tra cứu có dẫn nguồn). Mỗi số, tên, hướng, giá phải kèm nguồn.',
'- Không tìm được thông tin có nguồn thì nói thẳng: "Em chưa tìm được, anh/chị tự nhập giúp em". TUYỆT ĐỐI không bịa, không đoán, không điền cho đủ, không lấy ví dụ giả làm số liệu thật.',
'- Nếu em không có khả năng tra mạng trong lần này thì nói đúng như vậy ("Khoá hiện tại chưa tra được mạng, anh/chị dán link hoặc tải tài liệu, hoặc tự nhập"), không nói "không có thông tin".',
'- Ô nào không có nguồn thì để trống (null hoặc chuỗi rỗng), không viết "khoảng", "có thể" để lấp chỗ.'
].join('\n');
export const SOURCE_STATE = Object.freeze({ SOURCED: 'sourced', MANUAL: 'manual', EMPTY: 'empty' });
export const SOURCE_LABEL = Object.freeze({
sourced: 'Có nguồn',
manual: 'Sale nhập',
empty: 'Trống – cần nhập'
});
export function sourceState({ value, source, by } = {}) {
const has = !(value === null || value === undefined || String(value).trim() === '');
if (!has) return SOURCE_STATE.EMPTY;
if (by === 'user' || by === 'sale') return SOURCE_STATE.MANUAL;
return source ? SOURCE_STATE.SOURCED : SOURCE_STATE.EMPTY;
}
export function withRules(prompt) {
const p = String(prompt == null ? '' : prompt);
return p.includes(AI_RULES_MARK) ? p : p + '\n\n' + AI_RULES_TEXT;
}
export const AI_RULES_JSON_NOTE = '- Lời nhắc này cần trả JSON: vẫn trả ĐÚNG JSON theo mẫu, không viết chữ ngoài JSON. Ô không có nguồn để null hoặc "". Câu "Em chưa tìm được, anh/chị tự nhập giúp em" chỉ ghi vào ô ghi chú (vd "note") nếu mẫu có ô đó.';
function _o0(p) {
const _o2 = p.trim();
if (!_o2.startsWith('{') || !_o2.endsWith('}')) return null;
try { const o = JSON.parse(_o2); return o && typeof o === 'object' && !Array.isArray(o) ? o : null; } catch { return null; }
}
export function applyRules(prompt, { json = false } = {}) {
const p = String(prompt == null ? '' : prompt);
const o = _o0(p);
if (o) {
const cur = typeof o.nguyen_tac === 'string' ? o.nguyen_tac : '';
let next = cur.includes(AI_RULES_MARK) ? cur : (cur ? cur + '\n' : '') + AI_RULES_TEXT;
if (json && !next.includes(AI_RULES_JSON_NOTE)) next += '\n' + AI_RULES_JSON_NOTE;
return next === cur ? p : JSON.stringify({ ...o, nguyen_tac: next });
}
const _o1 = withRules(p);
return json && !_o1.includes(AI_RULES_JSON_NOTE) ? _o1 + '\n' + AI_RULES_JSON_NOTE : _o1;
}
export const withRulesJson = (prompt) => applyRules(prompt, { json: true });
export default { AI_RULES_MARK, AI_RULES_TEXT, AI_RULES_JSON_NOTE, SOURCE_STATE, SOURCE_LABEL, sourceState, withRules, withRulesJson, applyRules };

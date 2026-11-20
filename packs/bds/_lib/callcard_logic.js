import { parseData, givenName, dmy, hm } from './crm.js';
const _o2 = 365.25 * 86400000;
export const SALUTATIONS = ['anh', 'chị', 'cô', 'chú', 'anh/chị'];
const _o1 = /^(nam|m|male|trai|anh|chu|chú|ông|ong)$/i;
const _o0 = /^(nu|nữ|f|female|gai|gái|chi|chị|cô|co|bà|ba)$/i;
export function isCallable(c) { return !!(c && c.phone && (!c.kind || c.kind === 'customer')); }
export function salutation(c, now = Date.now()) {
const _o9 = parseData(c && c.data);
const _oo = String(_o9.xung_ho || '').trim().toLowerCase();
if (SALUTATIONS.includes(_oo)) return _oo;
const _oc = String(_o9.gender || _o9.gioi_tinh || '').trim();
const _op = _o1.test(_oc) ? 'm' : _o0.test(_oc) ? 'f' : '';
if (!_op) return 'anh/chị';
const _o6 = Date.parse(String((c && c.birthday) || '') + 'T00:00:00');
const _oh = Number.isFinite(_o6) && (now - _o6) / _o2 >= 50;
return _op === 'm' ? (_oh ? 'chú' : 'anh') : (_oh ? 'cô' : 'chị');
}
const _o7 = _on => _on ? _on[0].toUpperCase() + _on.slice(1) : _on;
export function applySalutation(text, xh = 'anh/chị') {
if (!xh || xh === 'anh/chị') return String(text || '');
return String(text || '').replace(/(a|A)nh\/(c|C)hị/g, (m, _o3) => (_o3 === 'A' ? _o7(xh) : xh));
}
const _oq = _on => String(_on || '').replace(/[ \t]{2,}/g, ' ').replace(/ ([,.?!])/g, '$1').trim();
export function vars(c, { _oe = {}, projectName } = {}) {
const _oi = c && c.project;
return {
ten: givenName(c && c.name),
du_an: _oi ? String((typeof projectName === 'function' ? projectName(_oi) : '') || _oi) : '',
ten_toi: String((_oe && _oe.name) || '').trim(),
};
}
export function openers(c, opts = {}) {
const _or = vars(c, opts);
const xh = opts.xh || salutation(c, opts.now);
const name = _or.ten ? ' ' + _or.ten : '';
const _oe = _or.ten_toi ? 'em là ' + _or.ten_toi : 'em là chuyên viên tư vấn';
const _oj = _or.du_an || 'dự án anh/chị đã quan tâm';
const list = [
`Dạ em chào anh/chị${name}, ${_oe}${_or.du_an ? ' bên dự án ' + _or.du_an : ''}. Em gọi vì anh/chị có để lại thông tin quan tâm, anh/chị cho em xin 1 phút được không ạ?`,
`Dạ anh/chị${name} ơi, ${_oe} đây ạ. Em thấy anh/chị có quan tâm ${_oj}, em có thông tin mới muốn gửi anh/chị – mình nói chuyện 1 phút được không ạ?`,
`Em chào anh/chị${name} ạ, ${_oe}${_or.du_an ? ' – dự án ' + _or.du_an : ''}. Em hỏi nhanh anh/chị 2–3 câu để gửi đúng căn hợp nhu cầu, giờ anh/chị tiện nghe máy không ạ?`,
];
return list.map(t => _oq(applySalutation(t, xh)));
}
export const QUESTIONS = [
{ id: 'purpose', label: 'Mục đích', text: 'Anh/chị tìm căn để ở hay để đầu tư ạ?',
chips: [{ id: 'o', label: 'Để ở' }, { id: 'dau_tu', label: 'Đầu tư' }, { id: 'cho_thue', label: 'Cho thuê' }] },
{ id: 'budget', label: 'Tài chính', text: 'Tài chính anh/chị dự kiến khoảng bao nhiêu ạ?',
chips: [{ id: 'u2', label: 'Dưới 2 tỷ', min: 0, max: 2e9, value: 1.5e9 }, { id: '2_3', label: '2–3 tỷ', min: 2e9, max: 3e9, value: 2.5e9 },
{ id: '3_5', label: '3–5 tỷ', min: 3e9, max: 5e9, value: 4e9 }, { id: 'o5', label: 'Trên 5 tỷ', min: 5e9, max: Infinity, value: 6e9 }] },
{ id: 'handover', label: 'Nhận nhà', text: 'Anh/chị cần nhận nhà ngay hay theo tiến độ dự án cũng được ạ?',
chips: [{ id: 'ngay', label: 'Cần nhận ngay', timeline: 'ngay' }, { id: 'tien_do', label: 'Theo tiến độ', timeline: '6t' }, { id: 'chua', label: 'Chưa vội', timeline: 'xa' }] },
];
export function questionText(_ok, xh) { return applySalutation(_ok.text, xh); }
export function answersOf(c) {
const _o3 = parseData(c && c.data).call || {};
return Object.fromEntries(QUESTIONS.map(_ok => [_ok.id, typeof _o3[_ok.id] === 'string' ? _o3[_ok.id] : '']));
}
export function setNoteLine(note, label, value) {
const lines = String(note || '').split('\n').filter(l => l.trim() && !l.trim().startsWith(label + ':'));
return lines.concat(label + ': ' + value).join('\n');
}
export function answerRow(c, qid, chipId, { now = Date.now() } = {}) {
const _ok = QUESTIONS.find(x => x.id === qid);
const _o8 = _ok && _ok.chips.find(x => x.id === chipId);
if (!_o8) throw new Error('Câu trả lời chưa hợp lệ');
const _o9 = { ...parseData(c.data) };
_o9.call = { ...(_o9.call && typeof _o9.call === 'object' ? _o9.call : {}), [qid]: chipId, at: now };
const _om = { ...c, note: setNoteLine(c.note, _ok.label, _o8.label) };
if (qid === 'purpose' && !String(c.need || '').trim()) _om.need = 'mua';
if (qid === 'budget') { const _o6 = Number(c.budget) || 0; if (!(_o6 > 0 && _o6 >= _o8.min && _o6 <= _o8.max)) _om.budget = _o8.value; }
if (Number(c.consent) === 1) {
const read = { answers: {}, ...(_o9.g2 && _o9.g2.read) };
const _o4 = { ...read.answers };
if (qid === 'purpose') _o4.purpose = chipId;
if (qid === 'handover') _o4.timeline = _o8.timeline;
if (qid !== 'budget') _o9.g2 = { ...(_o9.g2 || {}), read: { ...read, answers: _o4, at: now, consent: 1 } };
}
_om.data = JSON.stringify(_o9);
return _om;
}
export const REFLEXES = [
{ id: 'ban', label: 'Đang bận', objection: '', lines: [
'Dạ vâng, em không làm phiền lâu ạ. Anh/chị cho em hẹn lại lúc nào tiện – chiều nay hay sáng mai ạ?',
'Hoặc em nhắn Zalo tóm tắt 3 dòng để anh/chị xem lúc rảnh nhé ạ.'] },
{ id: 'zalo', label: 'Gửi qua Zalo đi', objection: '', lines: [
'Dạ vâng, em gửi ngay qua Zalo số này ạ. Để gửi đúng thứ anh/chị cần, mình quan tâm căn mấy phòng ngủ và tài chính khoảng bao nhiêu ạ?',
'Gửi xong em nhắn một câu để chắc anh/chị đã nhận được nhé ạ.'] },
{ id: 'gia_cao', label: 'Giá cao quá', objection: 'gia_cao', lines: [
'Dạ em hiểu, số tiền lớn nên anh/chị cân nhắc là đúng ạ. Anh/chị thấy cao so với ngân sách hay so với dự án khác ạ?',
'Em gửi bảng so sánh có nguồn và phương án diện tích nhỏ hơn hoặc thanh toán giãn hơn để mình chọn ạ.'] },
{ id: 'suy_nghi', label: 'Để suy nghĩ thêm', objection: 'suy_nghi', lines: [
'Dạ vâng, anh/chị cứ suy nghĩ kỹ ạ. Mình đang băn khoăn nhất điều gì: giá, vị trí, pháp lý hay cách thanh toán ạ?',
'Em gửi tài liệu đúng phần đó và hẹn gọi lại theo giờ anh/chị tiện nhé ạ.'] },
{ id: 'co_nguoi', label: 'Đã có người tư vấn', objection: '', lines: [
'Dạ tốt quá, có người theo sát là yên tâm ạ. Em chỉ gửi thêm bảng so sánh có nguồn để anh/chị tham khảo, không làm phiền người đang tư vấn ạ.',
'Khi cần góc nhìn thứ hai về pháp lý hay tiến độ thanh toán, anh/chị cứ nhắn em nhé.'] },
{ id: 'hoi_vo_chong', label: 'Để hỏi vợ/chồng', objection: 'hoi_vo_chong', lines: [
'Dạ vâng, việc lớn của gia đình thì bàn cùng nhau là đúng ạ. Em gửi tài liệu gọn trong một tin để anh/chị chuyển người nhà cùng xem nhé.',
'Nếu tiện, em hẹn một buổi cả nhà cùng nghe tư vấn để em trả lời trực tiếp ạ.'] },
{ id: 'khong_can', label: 'Không có nhu cầu', objection: '', lines: [
'Dạ em cảm ơn anh/chị đã nói rõ ạ. Em sẽ không gọi thêm; khi nào cần thông tin dự án hay giá khu vực, anh/chị cứ nhắn em nhé.'] },
];
export function reflexReply(id, { xh = 'anh/chị', bank = null } = {}) {
const _ol = REFLEXES.find(x => x.id === id);
if (!_ol) return null;
if (bank && bank.id && String(bank.text || '').trim()) return { lines: [_oq(applySalutation(bank.text, xh))], source: 'kho', scriptId: String(bank.id) };
return { lines: _ol.lines.map(t => applySalutation(t, xh)), source: 'mau', scriptId: 'call_' + _ol.id };
}
export const OUTCOMES = [['answered', 'Nghe máy'], ['no_answer', 'Không nghe'], ['callback', 'Hẹn gọi lại'], ['viewing', 'Hẹn xem nhà']];
export function defaultRemindAt(outcome, now = Date.now()) {
if (outcome === 'no_answer') return now + 3 * 3600000;
const _o9 = new Date(now); _o9.setDate(_o9.getDate() + 1); _o9.setHours(9, 0, 0, 0);
return _o9.getTime();
}
export function suggestRemind(outcome) { return outcome === 'callback' || outcome === 'viewing' || outcome === 'no_answer'; }
export function callLog({ customer, outcome, note = '', remind = false, remindAt, now = Date.now(), projectName } = {}) {
const _og = OUTCOMES.find(x => x[0] === outcome);
if (!_og) throw new Error('Chưa chọn kết quả cuộc gọi');
const c = customer || {};
let reminder = null;
if (remind) {
const at = Number(remindAt);
if (!Number.isFinite(at) || at <= 0) throw new Error('Chọn thời gian hẹn');
const _os = outcome === 'viewing';
const pn = _os && c.project ? String((typeof projectName === 'function' ? projectName(c.project) : '') || c.project) : '';
reminder = { object_id: c.id, kind: _os ? 'meeting' : 'followup', title: [_os ? 'Hẹn xem nhà' : 'Gọi lại', pn, c.name || 'khách'].filter(Boolean).join(' – '),
due_at: at, remind_before_days: 0, amount: 0, installment: 0, done: 0, notified_at: 0, data: JSON.stringify(_os ? { g2: 'viewing', src: 'callcard' } : { src: 'callcard' }) };
}
const _of = String(note || '').replace(/\s+/g, ' ').trim().slice(0, 1000);
const text = ['Cuộc gọi: ' + _og[1], reminder ? 'hẹn ' + dmy(reminder.due_at) + ' ' + hm(reminder.due_at) : '', _of].filter(Boolean).join(' · ');
return { event: { object_id: c.id, type: 'call', text, at: now, data: JSON.stringify({ outcome, src: 'callcard', ...(reminder ? { remind_at: reminder.due_at } : {}) }) }, reminder };
}
export function aiOpenerPrompt({ xh = 'anh/chị' } = {}) {
return [
'Bạn là huấn luyện viên telesale bất động sản trung thực tại Việt Nam.',
'Viết 3 câu mở đầu cuộc gọi khác nhau, mỗi câu đọc trong khoảng 10 giây (dưới 40 chữ): chào, giới thiệu "em là {ten_toi}", nhắc khách đã quan tâm {du_an}, xin 1 phút.',
'Xưng "em", gọi khách là "' + xh + ' {ten}". Giữ nguyên các biến {ten}, {du_an}, {ten_toi} – không tự điền tên.',
'Luật: không hứa lợi nhuận, không tạo khan hiếm giả, không ép, không dùng chữ "xin lỗi".',
'Trả về JSON là mảng 3 chuỗi: ["…", "…", "…"]',
].join('\n');
}
function _ob(text, _or) {
const _oa = { ten: '', du_an: 'dự án', ten_toi: 'chuyên viên tư vấn' };
return _oq(String(text || '').replace(/\{(ten|du_an|ten_toi)\}/g, (_, k) => _or[k] || _oa[k]));
}
export function parseAiOpeners(text, c, opts = {}) {
const _on = String(text || '');
let _o5 = null;
const _od = _on.indexOf('['), j = _on.lastIndexOf(']');
if (_od >= 0 && j > _od) { try { const _o3 = JSON.parse(_on.slice(_od, j + 1)); if (Array.isArray(_o3)) _o5 = _o3.map(String); } catch { _o5 = null; } }
if (!_o5) _o5 = _on.split('\n').map(l => l.replace(/^\s*(\d+[.)]|[-*•])\s*/, ''));
const _or = vars(c, opts);
const xh = opts.xh || salutation(c, opts.now);
return _o5.map(t => t.trim().replace(/^["“]|["”]$/g, '')).filter(t => t && !/xin lỗi/i.test(t))
.map(t => applySalutation(_ob(t, _or), xh)).slice(0, 3);
}

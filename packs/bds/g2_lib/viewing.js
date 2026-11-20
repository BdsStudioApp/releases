import { pd, DAY, vnParts, vnStamp, vnDayStart } from './core.js';
const _o5 = r => r && !Number(r.deleted);
const num = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) && v !== '' && v !== null ? n : d; };
const _o7 = n => String(n).padStart(2, '0');
const _o1 = ms => { const d = vnParts(ms); return _o7(d.d) + '/' + _o7(d.m); };
const dmy = ms => _o1(ms) + '/' + vnParts(ms).y;
const hm = ms => { const d = vnParts(ms); return _o7(d.hh) + ':' + _o7(d.mm); };
const _o4 = (list, id) => (list.find(o => o[0] === id) || [])[1] || '';
export const OBJECTIONS = [['gia', 'Giá'], ['vi_tri', 'Vị trí'], ['dien_tich', 'Diện tích'], ['phap_ly', 'Pháp lý'], ['tien_do', 'Tiến độ'], ['khac', 'Khác']];
export const DECIDERS = [['self', 'Một mình'], ['spouse', 'Cần hỏi vợ/chồng'], ['family', 'Gia đình'], ['guarantor', 'Cần hỏi người bảo lãnh vay']];
export const INTEREST = [['hot', 'Nóng'], ['warm', 'Ấm'], ['cold', 'Lạnh']];
export const CALLBACKS = [['1', 'Ngày mai'], ['3', '3 ngày'], ['7', '1 tuần'], ['pick', 'Chọn ngày'], ['none', 'Không hẹn']];
export const RESULT_WINDOW_DAYS = 30;
const _o0 = { hot: 'hot', warm: 'normal', cold: 'cold' };
export function heatLevel(interest) { return _o0[interest] || null; }
export function callbackAt(choice, { now = Date.now(), date = '', hour = 9 } = {}) {
if (['1', '3', '7'].includes(String(choice))) {
const t = vnParts(vnDayStart(now) + Number(choice) * DAY);
return vnStamp(t.y, t.m, t.d, hour, 0);
}
if (choice !== 'pick') return 0;
const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date || ''));
if (!m) throw new Error('Chọn ngày gọi lại');
const [y, mo, da] = [Number(m[1]), Number(m[2]), Number(m[3])];
const at = vnStamp(y, mo, da, hour, 0);
const _o6 = Number.isFinite(at) ? vnParts(at) : null;
if (!_o6 || _o6.y !== y || _o6.m !== mo || _o6.d !== da) throw new Error('Chọn ngày gọi lại');
if (at < vnDayStart(now)) throw new Error('Chọn ngày gọi lại từ hôm nay trở đi');
return Math.max(at, at < now ? now + 3600e3 : 0);
}
export function normalizeAfter(input = {}, { now = Date.now(), hour = 9 } = {}) {
const ids = new Set(OBJECTIONS.map(o => o[0]));
const objections = [...new Set((Array.isArray(input.objections) ? input.objections : []).filter(x => ids.has(x)))];
const decider = DECIDERS.some(o => o[0] === input.decider) ? input.decider : '';
const interest = INTEREST.some(o => o[0] === input.interest) ? input.interest : '';
const callback = CALLBACKS.some(o => o[0] === String(input.callback)) ? String(input.callback) : 'none';
const callback_at = callbackAt(callback, { now, date: input.date, hour });
return { objections, decider, interest, note: String(input.note || '').trim().slice(0, 500), callback: callback_at ? callback : 'none', callback_at, at: now };
}
export function noteText(a, { projectName = '', viewAt = 0 } = {}) {
const _o3 = 'Sau buổi xem nhà' + (projectName ? ' ' + projectName : '') + (viewAt ? ' (' + _o1(viewAt) + ' ' + hm(viewAt) + ')' : '') + ': ';
const _o8 = [];
if (a.objections.length) _o8.push('Khách chê: ' + a.objections.map(id => _o4(OBJECTIONS, id).toLowerCase()).join(', '));
if (a.decider) _o8.push('Người quyết định: ' + _o4(DECIDERS, a.decider).toLowerCase());
if (a.interest) _o8.push('Mức quan tâm: ' + _o4(INTEREST, a.interest));
if (!_o8.length && !a.note) _o8.push('Chưa ghi nhận xét');
_o8.push(a.callback_at ? 'Hẹn gọi lại: ' + dmy(a.callback_at) : 'Không hẹn gọi lại');
if (a.note) _o8.push('Ghi chú: ' + a.note);
return _o3 + _o8.join('. ');
}
export function afterSummary(a) {
if (!a) return '';
const _o9 = [
a.interest ? _o4(INTEREST, a.interest) : '',
a.objections && a.objections.length ? 'chê ' + a.objections.map(id => _o4(OBJECTIONS, id).toLowerCase()).join(', ') : '',
a.decider ? _o4(DECIDERS, a.decider).toLowerCase() : '',
a.callback_at ? 'gọi lại ' + _o1(a.callback_at) : '',
].filter(Boolean);
return _o9.length ? _o9.join(' · ') : 'Đã ghi kết quả';
}
export function callbackRow({ id, customer, after, viewingId = '', projectName = '', now = Date.now() }) {
if (!customer || !customer.id) throw new Error('Không thấy khách');
if (!after || !after.callback_at) return null;
return {
id, object_id: customer.id, kind: 'followup', title: 'Gọi lại sau buổi xem' + (projectName ? ' ' + projectName : '') + (customer.name ? ' – ' + customer.name : ''),
due_at: after.callback_at, remind_before_days: 0, amount: 0, installment: 0, done: 0, notified_at: 0,
data: JSON.stringify({ g2: 'callback', viewing_id: viewingId, note: afterSummary(after).slice(0, 300) }),
updated_at: now, deleted: 0,
};
}
export function withAfter(v, after) {
const { info, ...row } = v || {};
const d = { ...pd(row.data), after };
return { ...row, done: 1, data: JSON.stringify(d) };
}
export function afterOf(v) { const a = (v && (v.info || pd(v.data)).after) || null; return a && typeof a === 'object' ? a : null; }
export function hasAfter(v) { return !!afterOf(v); }
export function needsResult(v, now = Date.now()) {
if (!_o5(v)) return false;
const _o2 = num(v.due_at);
return _o2 > 0 && _o2 <= now && _o2 >= now - RESULT_WINDOW_DAYS * DAY && !hasAfter(v);
}
export function pendingResults(list, now = Date.now()) {
return (list || []).filter(v => needsResult(v, now)).sort((a, b) => num(b.due_at) - num(a.due_at));
}
export function todayList(list, now = Date.now()) {
const _o9 = vnDayStart(now), e = _o9 + DAY;
return (list || []).filter(v => _o5(v) && num(v.due_at) >= _o9 && num(v.due_at) < e).sort((x, y) => num(x.due_at) - num(y.due_at));
}
export function mapUrl(place) {
const _o9 = String(place || '').trim().slice(0, 300);
return _o9 ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(_o9) : '';
}

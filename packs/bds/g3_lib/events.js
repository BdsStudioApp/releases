import { parseData } from '../_lib/crm.js';
const _o0 = 3600e3;
export const MODES = { offline: 'Tại chỗ (nhà mẫu, văn phòng…)', online: 'Livestream / trực tuyến' };
export const SLOTS = [{ key: 'd1', before: 24 * _o0, label: 'Trước 1 ngày' }, { key: 'h2', before: 2 * _o0, label: 'Trước 2 giờ' }];
export function eventView(o) {
const _o2 = parseData(o && o.data);
return { id: o.id, title: o.name || '', project: o.project || '', status: ['draft', 'open', 'done'].includes(o.status) ? o.status : 'draft',
mode: _o2.mode === 'online' ? 'online' : 'offline', start_at: Number(_o2.start_at) || 0, end_at: Number(_o2.end_at) || 0, place: _o2.place || '', address: _o2.address || '',
live_url: _o2.live_url || '', seats: Number(_o2.seats) || 0, description: _o2.description || '', image: _o2.image || '', slug: _o2.slug || '', recording_url: _o2.recording_url || '',
created_at: Number(o.created_at) || 0, raw: o };
}
export function registrants(eventId, events, customers) {
const byId = new Map((customers || []).map(c => [c.id, c]));
const regs = new Map(), att = new Map();
for (const e of events || []) {
if (Number(e.deleted)) continue;
const _o2 = parseData(e.data);
if (_o2.event_id !== eventId) continue;
if (e.type === 'g3_reg' && !regs.has(e.object_id)) regs.set(e.object_id, e);
if (e.type === 'g3_att') { const _o4 = att.get(e.object_id); if (!_o4 || Number(e.at) >= Number(_o4.at)) att.set(e.object_id, e); }
}
return [...regs.entries()].map(([cid, e]) => {
const _o1 = att.get(cid);
return { customer: byId.get(cid) || { id: cid, name: '(khách đã xoá)', phone: '' }, reg_at: Number(e.at) || 0, via: parseData(e.data).via || 'page', attended: _o1 ? !!parseData(_o1.data).attended : null };
}).sort((x, y) => x.reg_at - y.reg_at);
}
export function counts(list) {
return { total: list.length, attended: list.filter(r => r.attended === true).length, absent: list.filter(r => r.attended === false).length, unknown: list.filter(r => r.attended === null).length };
}
export function reminderRows(ev, existing, { now = Date.now(), newId, count = 0 } = {}) {
if (!ev.start_at) return [];
const _o3 = new Set((existing || []).filter(r => !Number(r.deleted)).map(r => { const _o2 = parseData(r.data); return _o2.g3_event === ev.id ? _o2.slot : null; }).filter(Boolean));
return SLOTS.filter(s => !_o3.has(s.key) && ev.start_at - s.before > now).map(s => ({
id: newId(), object_id: '', kind: 'custom', title: `Nhắc khách dự "${ev.title}" (${s.label.toLowerCase()})${count ? ' – ' + count + ' người đăng ký' : ''}`,
due_at: ev.start_at - s.before, remind_before_days: 0, amount: 0, installment: 0, done: 0, notified_at: 0, data: JSON.stringify({ g3_event: ev.id, slot: s.key }),
}));
}
export function followRows(ev, customers, existing, { due }) {
const _o3 = new Set((existing || []).filter(r => !Number(r.deleted)).map(r => String(r.id)));
return (customers || []).map(c => ({ id: ('g3f_' + ev.id + '_' + c.id).slice(0, 64), object_id: c.id, kind: 'followup', title: 'Gọi lại sau sự kiện: ' + ev.title, due_at: due, remind_before_days: 0, amount: 0, installment: 0,
done: 0, notified_at: 0, data: JSON.stringify({ g3_event: ev.id, slot: 'follow' }) })).filter(r => !_o3.has(r.id));
}
export function whenText(ms) {
return ms ? new Date(ms).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', weekday: 'long', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '';
}
export function reminderText(ev, c, { agent = '' } = {}) {
const _o6 = c && c.name ? 'anh/chị ' + String(c.name).split(/\s+/).slice(-1)[0] : 'anh/chị';
const _o5 = ev.mode === 'online' ? (ev.live_url ? 'Link xem: ' + ev.live_url : 'Em gửi link xem trước giờ phát ạ.') : `Địa điểm: ${ev.place}${ev.address ? ', ' + ev.address : ''}.`;
return `Dạ em chào ${_o6}, em${agent ? ' là ' + agent : ''} nhắc ${_o6} lịch "${ev.title}" lúc ${whenText(ev.start_at)}. ${_o5} ${_o6.charAt(0).toUpperCase() + _o6.slice(1)} cần giữ chỗ hay hỏi gì cứ nhắn em ạ.`;
}
export function followUps(ev, list, { agent = '' } = {}) {
return list.map(r => {
const _o6 = r.customer.name ? 'anh/chị ' + String(r.customer.name).split(/\s+/).slice(-1)[0] : 'anh/chị';
if (r.attended === true) return { ...r, action: 'call', text: `Dạ em cảm ơn ${_o6} đã tham dự "${ev.title}". Em gửi ${_o6} bảng giá, chính sách và căn phù hợp như đã trao đổi; ${_o6} tiện xem nhà mẫu ngày nào ạ?` };
if (r.attended === false) return { ...r, action: 'send_recording', text: `Dạ em chào ${_o6}, hôm "${ev.title}" ${_o6} chưa tham dự được.${ev.recording_url ? ' Em gửi bản ghi: ' + ev.recording_url + '.' : ''} ${_o6.charAt(0).toUpperCase() + _o6.slice(1)} cần em gửi tài liệu hay hẹn lịch riêng không ạ?` };
return { ...r, action: 'mark', text: '' };
});
}

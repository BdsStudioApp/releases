import { parseData, parseMoney } from '../_lib/crm.js';
import { readAttribution, cleanCode } from './attribution.js';
import { isDeal, isCustomer, commissionOf } from './roi.js';
export const WHO = { customer: 'Khách cũ', ctv: 'Cộng tác viên', sale: 'Sale trong công ty', partner: 'Đối tác' };
export const STAGES = ['Mới', 'Đã liên hệ', 'Đang chăm sóc', 'Hẹn xem nhà', 'Đang đàm phán'];
export function refView(o) {
const _o2 = parseData(o && o.data);
const reward = _o2.reward && typeof _o2.reward === 'object' ? _o2.reward : { type: 'fixed', value: 0 };
return { id: o.id, name: o.name || '', phone: o.phone || '', active: o.status !== 'paused', code: cleanCode(_o2.code), who: WHO[_o2.who] ? _o2.who : 'customer',
customer_id: _o2.customer_id || '', user_id: _o2.user_id || '', reward: { type: reward.type === 'percent' ? 'percent' : 'fixed', value: Number(reward.value) || 0 },
note: _o2.note || '', payouts: Array.isArray(_o2.payouts) ? _o2.payouts : [], raw: o };
}
export function parseReward(type, text) {
const t = String(text ?? '').trim();
if (!t) return { ok: true, value: 0 };
if (type === 'percent') {
const _o7 = t.replace(/\s|%/g, '').replace(',', '.');
const _o4 = /^\d+(\.\d+)?$/.test(_o7) ? Number(_o7) : NaN;
return Number.isFinite(_o4) && _o4 >= 0 && _o4 <= 100 ? { ok: true, value: _o4 } : { ok: false, error: 'Thưởng theo % phải từ 0 đến 100, ví dụ 10 hoặc 1,5.' };
}
const _o0 = { ok: false, error: 'Mức thưởng chưa đúng – ghi số tiền đủ, ví dụ 5.000.000 hoặc 5tr.' };
const _o5 = t.replace(/\s*(đ|₫|vnd|vnđ|dong|đồng)\.?$/i, '').trim();
let _o8;
if (/^[\d.,\s]+$/.test(_o5)) {
const _o3 = /^\d{1,3}([.,\s]\d{3})+$/.test(_o5) || /^\d+$/.test(_o5);
if (!_o3) return _o0;
_o8 = Number(_o5.replace(/[.,\s]/g, ''));
if (_o8 < 1e5) return { ok: false, error: 'Mức thưởng quá nhỏ – ghi số tiền đủ bằng đồng (ví dụ 5.000.000) hoặc kèm đơn vị (5tr, 500k).' };
} else _o8 = parseMoney(t);
if (!_o8 || !Number.isFinite(_o8) || _o8 <= 0) return _o0;
if (_o8 > 1e11) return { ok: false, error: 'Mức thưởng quá lớn (trên 100 tỷ) – kiểm lại số.' };
return { ok: true, value: Math.round(_o8) };
}
export function rewardFor(ref, lead, ratePct = 0) {
if (!isDeal(lead)) return 0;
if (ref.reward.type === 'percent') return Math.round(commissionOf(lead, ratePct) * ref.reward.value / 100);
return Math.round(ref.reward.value);
}
export function leadsOf(code, customers) {
const _o1 = cleanCode(code);
if (!_o1) return [];
return (customers || []).filter(x => isCustomer(x) && readAttribution(x).ref === _o1);
}
export function refStats(ref, customers, ratePct = 0) {
const leads = leadsOf(ref.code, customers);
const deals = leads.filter(isDeal);
const due = deals.reduce((_o7, l) => _o7 + rewardFor(ref, l, ratePct), 0);
const paid = ref.payouts.reduce((_o7, p) => _o7 + (Number(p.amount) || 0), 0);
const byStage = {};
for (const l of leads) byStage[l.status || 'Mới'] = (byStage[l.status || 'Mới'] || 0) + 1;
return { leads: leads.length, deals: deals.length, due, paid, owed: Math.max(0, due - paid), byStage, list: leads };
}
export function codeTaken(code, refs, exceptId = '') { const _o1 = cleanCode(code); return refs.some(r => r.id !== exceptId && r.code === _o1); }
export function attachRef(customer, code) {
const _o2 = parseData(customer.data);
_o2.ref = cleanCode(code);
_o2.ref_at = Date.now();
return JSON.stringify(_o2);
}
export function inviteText(ref, link, { agent = '', project = '' } = {}) {
const _o6 = ref.reward.value ? (ref.reward.type === 'percent' ? `${ref.reward.value}% hoa hồng` : `${Math.round(ref.reward.value).toLocaleString('vi-VN')}đ`) : '';
return `Dạ em chào ${ref.name || 'anh/chị'}, em là ${agent || 'môi giới'}. Em gửi link giới thiệu riêng của anh/chị${project ? ' cho dự án ' + project : ''}: ${link}\n` +
`Người thân, bạn bè quan tâm chỉ cần bấm link và để lại số – em chăm sóc tận tình.${_o6 ? ` Khi giao dịch thành công, em gửi anh/chị ${_o6} như đã thống nhất.` : ''} Em cảm ơn anh/chị nhiều ạ!`;
}

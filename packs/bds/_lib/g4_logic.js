import { strip, parseData, parseMoney, normPhone, DAY } from './crm.js';
export const PACK = 'core';
export const KIND = { partner: 'g4_partner', listing: 'g4_listing', ref: 'g4_priceref', booking: 'g4_booking', site: 'g4_sitelog' };
export const KINDS = Object.values(KIND);
export const PARTNER_ROLES = [
['admin_du_an', 'Admin dự án'], ['san_f1', 'Sàn F1'], ['san_f2', 'Sàn F2'], ['sale_bds', 'Sale BĐS'], ['tin_dung', 'Cán bộ tín dụng'],
['sale_ngan_hang', 'Sale ngân hàng'], ['cong_chung', 'Công chứng'], ['chu_nha', 'Chủ nhà'], ['ctv', 'Cộng tác viên (CTV)'], ['khac', 'Khác'],
];
export const CONTACT_TYPES = [['call', 'Gọi'], ['zalo', 'Zalo'], ['meeting', 'Gặp'], ['note', 'Ghi chú']];
export const PARTNER_STATUS = [['dang_hop_tac', 'Đang hợp tác'], ['luu_tru', 'Lưu trữ']];
export const label = (list, _oe) => { const _o4 = list.find((_og) => _og[0] === _oe); return _o4 ? _o4[1] : (_oe || ''); };
export { strip, parseData, parseMoney, normPhone };
const _o8 = (n) => String(n).padStart(2, '0');
export const YMD_RE = /^\d{4}-\d{2}-\d{2}$/;
export function ymdToMs(s) {
if (!YMD_RE.test(String(s || ''))) return 0;
const [_oh, m, d] = String(s).split('-').map(Number);
const ms = Date.UTC(_oh, m - 1, d, 2, 0, 0);
const _o2 = new Date(ms);
return _o2.getUTCDate() === d && _o2.getUTCMonth() === m - 1 ? ms : 0;
}
export function msToYmd(ms) { const d = new Date(Number(ms) + 7 * 3600e3); return d.getUTCFullYear() + '-' + _o8(d.getUTCMonth() + 1) + '-' + _o8(d.getUTCDate()); }
export function msLabel(ms) { const n = Number(ms); return Number.isFinite(n) && n > 0 ? ymdLabel(msToYmd(n)) : ''; }
export function ymdLabel(s) { return YMD_RE.test(String(s || '')) ? String(s).slice(8, 10) + '/' + String(s).slice(5, 7) + '/' + String(s).slice(0, 4) : ''; }
export function moneyExact(n) {
n = Number(n);
if (!Number.isFinite(n) || n === 0) return '0 đồng';
const _ob = n < 0 ? '-' : '', a = Math.abs(n);
const _of = (_og, d) => (Math.round(_og * 10 ** d) / 10 ** d).toLocaleString('vi-VN', { maximumFractionDigits: d });
const _o3 = (unit, d) => Math.abs(Math.round(a / unit * 10 ** d) / 10 ** d * unit - a) < 0.5;
if (a >= 1e9 && _o3(1e9, 3)) return _ob + _of(a / 1e9, 3) + ' tỷ';
if (a >= 1e6 && a < 1e9 && _o3(1e6, 2)) return _ob + _of(a / 1e6, 2) + ' triệu';
if (a >= 1e3 && a < 1e6 && _o3(1e3, 0)) return _ob + _of(a / 1e3, 0) + ' nghìn';
return _ob + Math.round(a).toLocaleString('vi-VN') + ' đồng';
}
export function moneyText(n) {
n = Math.round(Number(n));
if (!Number.isFinite(n) || n <= 0) return '';
if (n % 1e6 === 0) {
if (n >= 1e9) { const t = Math.floor(n / 1e9), r = (n % 1e9) / 1e6; return t + ' tỷ' + (r ? ' ' + r + ' triệu' : ''); }
return n / 1e6 + ' triệu';
}
return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
export function num(_oe) { const n = Number(_oe); return Number.isFinite(n) ? n : 0; }
export function parseNumVi(_oe) {
if (typeof _oe === 'number') return _oe;
const s = String(_oe ?? '').trim().replace(/\s/g, '').replace(/(%|m2|m²|th[áa]ng|(tr|tri[ệe]u)(\/m2|\/m²)?)$/i, '');
if (!s) return NaN;
if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) return Number(s.replace(/\./g, '').replace(',', '.'));
return Number(s.replace(',', '.'));
}
export const numVi = (n) => String(n).replace('.', ',');
export const todayYmd = (now = Date.now()) => msToYmd(now);
export function dateProblem(ymd, what, { notFuture = false, notPast = false, now = Date.now() } = {}) {
if (!YMD_RE.test(String(ymd || '')) || !ymdToMs(ymd)) return what + ' chưa đúng.';
const _oc = todayYmd(now);
const _oh = Number(ymd.slice(0, 4));
if (_oh < 2000 || _oh > Number(_oc.slice(0, 4)) + 10) return what + ' chưa đúng năm (' + ymdLabel(ymd) + ').';
if (notFuture && ymd > _oc) return what + ' không thể sau hôm nay (' + ymdLabel(_oc) + ').';
if (notPast && ymd < _oc) return what + ' đã qua (' + ymdLabel(ymd) + ') – chọn từ hôm nay trở đi.';
return '';
}
export function commissionProblem({ type, value, price }) {
const _oe = num(value), _o7 = num(price);
if (!(_oe > 0)) return '';
if (type === 'pct' && _oe > 10) return 'Hoa hồng ' + numVi(_oe) + '% giá là quá cao – kiểm tra lại (gõ số tiền thì chọn "Số tiền").';
if (type === 'months' && _oe > 12) return 'Phí môi giới ' + numVi(_oe) + ' tháng thuê là quá cao – kiểm tra lại.';
if (type === 'amount' && _o7 > 0 && _oe >= _o7) return 'Hoa hồng ' + moneyExact(_oe) + ' không thể bằng hoặc lớn hơn giá căn ' + moneyExact(_o7) + '.';
return '';
}
export function safeUrl(_od) {
const s = String(_od ?? '').trim();
if (!s || s.length > 1000 || !/^https?:\/\/[^\s<>"'`]+$/i.test(s)) return '';
try { const _og = new URL(s); return _og.protocol === 'http:' || _og.protocol === 'https:' ? s : ''; } catch { return ''; }
}
export function parseLinks(text, max = 20) {
const _o6 = [];
for (const _o9 of String(text ?? '').split(/[\s,;]+/)) { const _od = safeUrl(_o9); if (_od && !_o6.includes(_od)) _o6.push(_od); }
return _o6.slice(0, max);
}
export function linkDropped(text) { return String(text ?? '').split(/[\s,;]+/).filter(Boolean).filter((_og) => !safeUrl(_og)); }
export function linkProblem(text) {
const _o0 = linkDropped(text);
if (!_o0.length || parseLinks(text).length) return '';
return 'Link phải bắt đầu bằng https:// – chưa đúng: ' + _o0.slice(0, 2).map((_og) => (_og.length > 40 ? _og.slice(0, 40) + '…' : _og)).join(', ');
}
export function linkNote(...texts) { const n = texts.reduce((t, _og) => t + linkDropped(_og).length, 0); return n ? ' – bỏ ' + n + ' dòng không phải link https://' : ''; }
export const isDriveLink = (_od) => /^https:\/\/(drive|docs|photos)\.google\.com\//i.test(String(_od || ''));
export function hostOf(_od) { try { return new URL(_od).hostname.replace(/^www\./i, '').toLowerCase(); } catch { return ''; } }
export const dataOf = (row) => parseData(row && row.data);
export const alive = (r) => !!r && !Number(r.deleted);
export function ofKind(rows, kind) { return (rows || []).filter((r) => alive(r) && r.kind === kind); }
export function newRow(kind, user, fields = {}, data = {}) {
return { kind, source: 'manual', status: '', owner: (user && user.id) || '', note: '', tags: '', consent: 0, ...fields, data: JSON.stringify(data) };
}
export function withData(row, patch = {}, fields = {}) {
return { ...row, ...fields, data: JSON.stringify({ ...dataOf(row), ...patch }) };
}
export const canErase = (perms) => !perms || perms.erase !== false;
export const isStaff = (user) => !user || user.role === 'owner' || user.role === 'manager' || !user.role;
export function scopeRows(rows, scope, user) {
if (scope !== 'mine' || !user || !user.id) return rows;
return rows.filter((r) => r.owner === user.id || (!r.owner && r.created_by === user.id));
}
export function searchRows(rows, q, fields = (r) => [r.name, r.phone, r.project, r.note]) {
const s = strip(q);
if (!s) return rows;
return rows.filter((r) => strip(fields(r).filter(Boolean).join(' ')).includes(s));
}
export function projectKey(projects, idOrName) {
if (!idOrName) return '';
const s = strip(idOrName);
const _o7 = (projects || []).find((_og) => _og && (_og.id === idOrName || strip(_og.name) === s || strip(_og.id) === s));
return _o7 ? _o7.id : s;
}
export function projectName(projects, idOrName) {
if (!idOrName) return '';
const _o7 = (projects || []).find((_og) => _og && (_og.id === idOrName || _og.name === idOrName));
return _o7 ? (_o7.name || _o7.id) : String(idOrName);
}
export const isCtv = (row) => alive(row) && row.kind === KIND.partner && dataOf(row).role === 'ctv';
export function cleanCtvNotes(list) {
if (!Array.isArray(list)) return [];
return list.filter((_og) => _og && typeof _og === 'object').map((_og) => {
const _o1 = typeof _og.commission === 'number' ? _og.commission : parseMoney(_og.commission);
return {
unit: String(_og.unit ?? '').trim().slice(0, 300),
closed_at: YMD_RE.test(String(_og.closed_at || '')) ? String(_og.closed_at) : '',
commission: Number.isFinite(_o1) && _o1 > 0 ? Math.round(_o1) : 0,
note: String(_og.note ?? '').trim().slice(0, 500),
};
}).filter((_og) => _og.unit || _og.closed_at || _og.commission || _og.note).slice(0, 500);
}
export const ctvNotesOf = (row) => cleanCtvNotes(dataOf(row).ctv_notes);
export function ctvNotesTotal(list) { return (Array.isArray(list) ? list : []).reduce((s, _og) => s + (Number(_og && _og.commission) > 0 ? Number(_og.commission) : 0), 0); }
export function findCtvFor(rows, customer) {
if (!customer) return null;
const _oa = normPhone(customer.phone);
return (rows || []).find((r) => isCtv(r) && ((customer.id && dataOf(r).customer_id === customer.id) || (_oa && normPhone(r.phone) === _oa))) || null;
}
export function ctvFromCustomer(customer, user) {
const _o1 = customer || {};
return newRow(KIND.partner, user, { name: String(_o1.name || '').slice(0, 200), phone: normPhone(_o1.phone), zalo: _o1.zalo ? normPhone(_o1.zalo) : '', status: 'dang_hop_tac' },
{ role: 'ctv', customer_id: _o1.id || '', ctv_notes: [] });
}
export function splitUnits(s) { return String(s ?? '').split(/[,;\n]+/).map((_og) => _og.trim()).filter(Boolean).slice(0, 200); }
export function inventoryRows(partners) {
const _o6 = [];
for (const _o7 of ofKind(partners, KIND.partner)) {
const d = dataOf(_o7);
for (const _o5 of Array.isArray(d.inventory) ? d.inventory : []) {
const units = splitUnits(_o5 && _o5.units);
const base = { partner_id: _o7.id, partner: _o7.name || '', role: d.role || '', phone: _o7.phone || '', project: (_o5 && _o5.project) || '', note: (_o5 && _o5.note) || '', at: num(_o5 && _o5.at) };
if (!units.length) _o6.push({ ...base, unit: '' });
for (const _od of units) _o6.push({ ...base, unit: _od });
}
}
return _o6;
}
export function findHolders(rows, q, projects) {
const s = strip(q);
if (!s) return rows;
return rows.filter((r) => strip([r.unit, projectName(projects, r.project), r.project, r.partner].join(' ')).includes(s));
}
export default {
PACK, KIND, KINDS, PARTNER_ROLES, CONTACT_TYPES, PARTNER_STATUS, label, ymdToMs, msToYmd, ymdLabel, moneyExact, safeUrl, parseLinks, hostOf,
splitUnits, inventoryRows, findHolders, DAY,
};

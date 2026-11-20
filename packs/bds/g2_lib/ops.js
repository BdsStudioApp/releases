import { pd, DAY, vnParts, vnDayStart, vnDate } from './core.js';
const _o3 = r => r && !Number(r.deleted);
const num = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) && v !== '' && v !== null ? n : d; };
const _o6 = n => String(n).padStart(2, '0');
export const REMIND_OPTS = [[1, 'Trước 1 ngày'], [0.125, 'Trước 3 giờ'], [0.0417, 'Trước 1 giờ'], [0, 'Đúng giờ hẹn']];
export function viewingRow({ id, customer, at, project, projectName = '', place = '', unit = '', note = '', before = 1, now = Date.now() }) {
if (!customer || !customer.id) throw new Error('Chọn khách');
if (!Number.isFinite(at) || at <= 0) throw new Error('Chọn ngày giờ xem');
return {
id, object_id: customer.id, kind: 'meeting', title: 'Xem nhà ' + (projectName || project || '') + (customer.name ? ' – ' + customer.name : ''),
due_at: at, remind_before_days: Number(before) || 0, amount: 0, installment: 0, done: 0, notified_at: 0,
data: JSON.stringify({ g2: 'viewing', project: project || '', place: String(place || '').slice(0, 300), unit: String(unit || '').slice(0, 80), note: String(note || '').slice(0, 500) }),
updated_at: now, deleted: 0,
};
}
export function viewingsOf(reminders) {
return (reminders || []).filter(r => _o3(r) && r.kind === 'meeting' && pd(r.data).g2 === 'viewing').map(r => ({ ...r, info: pd(r.data) })).sort((a, b) => num(a.due_at) - num(b.due_at));
}
export function weekDays(ms) {
const start = vnDayStart(ms);
const _o4 = start - ((vnParts(start).wd + 6) % 7) * DAY;
return Array.from({ length: 7 }, (_, _o0) => _o4 + _o0 * DAY);
}
export function groupByDay(list, days) {
return days.map(start => ({ start, items: list.filter(v => num(v.due_at) >= start && num(v.due_at) < start + DAY) }));
}
export function conflicts(list, at, exceptId, gapMin = 60) {
return (list || []).filter(v => v.id !== exceptId && !Number(v.done) && Math.abs(num(v.due_at) - at) < gapMin * 60000);
}
const _o1 = s => String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, m => '\\' + m);
const _o2 = ms => { const d = new Date(ms); return d.getUTCFullYear() + _o6(d.getUTCMonth() + 1) + _o6(d.getUTCDate()) + 'T' + _o6(d.getUTCHours()) + _o6(d.getUTCMinutes()) + '00Z'; };
export function toIcs(list, now = Date.now()) {
const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BDS Studio//Lich xem nha//VI', 'CALSCALE:GREGORIAN'];
for (const v of list) {
const info = v.info || pd(v.data);
L.push('BEGIN:VEVENT', 'UID:' + v.id + '@bds-studio', 'DTSTAMP:' + _o2(now), 'DTSTART:' + _o2(num(v.due_at)), 'DTEND:' + _o2(num(v.due_at) + 3600e3),
'SUMMARY:' + _o1(v.title), info.place ? 'LOCATION:' + _o1(info.place) : '', info.note ? 'DESCRIPTION:' + _o1(info.note) : '',
'BEGIN:VALARM', 'TRIGGER:-PT' + Math.max(15, Math.round((num(v.remind_before_days) || 0) * 1440)) + 'M', 'ACTION:DISPLAY', 'DESCRIPTION:' + _o1(v.title), 'END:VALARM', 'END:VEVENT');
}
L.push('END:VCALENDAR');
return L.filter(Boolean).join('\r\n');
}
export const DEAL_STEPS = [
'Phiếu giữ chỗ / Booking', 'Bản sao CCCD, giấy tờ nhân thân của khách', 'Xác nhận căn + phương án thanh toán', 'Thoả thuận đặt cọc', 'Hồ sơ vay ngân hàng (nếu vay)',
'Ký Hợp đồng mua bán', 'Đóng tiền theo tiến độ', 'Nhận bàn giao căn', 'Nộp hồ sơ cấp Giấy chứng nhận (sổ)',
];
export const DEAL_STATUS = { open: 'Đang làm', done: 'Xong', cancel: 'Đã huỷ' };
export function newDeal({ customer, project = '', unit = '', price = 0, steps = DEAL_STEPS, now = Date.now(), newId }) {
return {
kind: 'g2_deal', name: 'Hồ sơ ' + (customer ? customer.name : '') + (unit ? ' – ' + unit : ''), project, status: 'open',
data: JSON.stringify({ customer_id: customer ? customer.id : '', unit, price: num(price), steps: steps.map((label, _o0) => ({ id: 's' + _o0, label, done: 0, at: 0, by: '', note: '' })), files: [], created: now }),
};
}
export function dealInfo(row) {
const d = pd(row && row.data);
const steps = Array.isArray(d.steps) ? d.steps : [];
const files = Array.isArray(d.files) ? d.files : [];
const done = steps.filter(s => Number(s.done)).length;
return { ...d, steps, files, done, total: steps.length, pct: steps.length ? Math.round(done / steps.length * 100) : 0, next: steps.find(s => !Number(s.done)) || null };
}
export function toggleStep(row, stepId, { by = '', now = Date.now() } = {}) {
const d = pd(row.data);
d.steps = (d.steps || []).map(s => (s.id === stepId ? { ...s, done: Number(s.done) ? 0 : 1, at: Number(s.done) ? 0 : now, by: Number(s.done) ? '' : by } : s));
return JSON.stringify(d);
}
export function validLink(_o8) { return /^https:\/\/[^\s<>"]+$/i.test(String(_o8 || '').trim()); }
export function addFile(row, { label, url, now = Date.now() }) {
if (!validLink(url)) throw new Error('Link phải bắt đầu bằng https://');
const d = pd(row.data);
d.files = (d.files || []).concat([{ id: 'f' + now.toString(36), label: String(label || 'Tệp').slice(0, 120), url: String(url).trim(), at: now }]);
return JSON.stringify(d);
}
export function removeFile(row, fileId) { const d = pd(row.data); d.files = (d.files || []).filter(f => f.id !== fileId); return JSON.stringify(d); }
export const TASK_STATUS = [['todo', 'Cần làm'], ['doing', 'Đang làm'], ['done', 'Xong']];
export function taskInfo(t) { const d = pd(t && t.data); return { due: num(d.due), customer_id: d.customer_id || '', priority: d.priority || 'normal', by: d.by || '', note: d.note || '' }; }
export function canAssignOthers(perms) { return !!(perms && perms.assign); }
export function taskBuckets(tasks, me, now = Date.now()) {
const act = (tasks || []).filter(t => _o3(t) && t.kind === 'g2_task');
const mine = act.filter(t => t.owner === me);
const given = act.filter(t => taskInfo(t).by === me && t.owner !== me);
const overdue = act.filter(t => t.status !== 'done' && taskInfo(t).due && taskInfo(t).due < now);
return { all: act, mine, given, overdue };
}
export function commentsOf(events, objectId) {
return (events || []).filter(e => _o3(e) && e.type === 'g2_comment' && e.object_id === objectId).sort((a, b) => num(a.at) - num(b.at));
}
export function mentionIds(text, dir) {
const out = new Set();
const s = String(text || '');
for (const _o8 of dir || []) if (_o8.username && new RegExp('@' + _o8.username.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(s)) out.add(_o8.id);
return [...out];
}
export function quarterOf(ms) { const _o5 = vnParts(ms); const q = Math.floor((_o5.m - 1) / 3) + 1; return { y: _o5.y, q, label: 'Quý ' + q + '/' + _o5.y }; }
export function assetCalc(a) {
const area = num(a.area);
const buy = num(a.buy_price);
const value = num(a.value_total) || (num(a.value_m2) && area ? Math.round(num(a.value_m2) * 1e6 * area) : 0);
const rent = num(a.rent);
const change = buy && value ? (value - buy) / buy : null;
const yieldGross = value && rent ? rent * 12 / value : null;
return { area, buy, value, rent, change, yieldGross };
}
export function assetIssues(a) {
const out = [];
if ((num(a.value_m2) || num(a.value_total)) && !String(a.value_src || '').trim()) out.push('Giá trị ước tính chưa ghi nguồn');
if (num(a.rent) && !String(a.rent_src || '').trim()) out.push('Giá thuê chưa ghi nguồn');
for (const _o0 of a.infra || []) if (_o0 && _o0.text && !validLink(_o0.url)) out.push('Hạ tầng "' + String(_o0.text).slice(0, 40) + '" chưa có link nguồn');
return out;
}
export function latestObs(obs, projectId) {
const _o7 = kind => (obs || []).filter(o => _o3(o) && o.kind === 'g2_mkt' && o.project === projectId && pd(o.data).type === kind)
.map(o => ({ ...pd(o.data), id: o.id, at: num(pd(o.data).at) || num(o.updated_at) })).sort((a, b) => b.at - a.at)[0] || null;
return { price: _o7('gia_ban'), rent: _o7('gia_thue'), infra: _o7('ha_tang'), progress: _o7('tien_do') };
}
export function reportModel(c, assets, { now = Date.now(), money, projectName = x => x, me = {} } = {}) {
const q = quarterOf(now);
const rows = (assets || []).map(a => ({ a, k: assetCalc(a), issues: assetIssues(a), name: [projectName(a.project), a.unit].filter(Boolean).join(' – ') || 'Tài sản' }));
const total = rows.reduce((s, r) => s + r.k.value, 0);
const buy = rows.reduce((s, r) => s + r.k.buy, 0);
const lines = [];
lines.push({ t: 'h1', v: 'Báo cáo tài sản ' + q.label });
lines.push({ t: 'sub', v: 'Khách: ' + (c.name || '') + ' · Lập ngày ' + vnDate(now) + (me.name ? ' · ' + me.name + (me.phone ? ' – ' + me.phone : '') : '') });
for (const r of rows) {
lines.push({ t: 'h2', v: r.name + (r.k.area ? ' · ' + r.k.area + ' m²' : '') });
if (r.k.buy) lines.push({ t: 'kv', k: 'Giá mua', v: money(r.k.buy) + (r.a.buy_date ? ' (' + r.a.buy_date.split('-').reverse().join('/') + ')' : '') });
if (r.k.value) lines.push({ t: 'kv', k: 'Giá trị ước tính', v: money(r.k.value) + (r.k.change !== null ? ' (' + (r.k.change >= 0 ? '+' : '') + (r.k.change * 100).toFixed(1).replace('.', ',') + '%)' : ''), src: r.a.value_src || '' });
if (r.k.rent) lines.push({ t: 'kv', k: 'Giá thuê tham khảo', v: money(r.k.rent) + '/tháng' + (r.k.yieldGross ? ' · lợi suất gộp ' + (r.k.yieldGross * 100).toFixed(1).replace('.', ',') + '%/năm' : ''), src: r.a.rent_src || '' });
if (r.a.progress) lines.push({ t: 'kv', k: 'Tiến độ', v: String(r.a.progress).slice(0, 200), src: r.a.progress_src || '' });
for (const _o0 of r.a.infra || []) if (_o0 && _o0.text) lines.push({ t: 'kv', k: 'Hạ tầng mới', v: String(_o0.text).slice(0, 200), src: _o0.url || '' });
}
if (rows.length > 1 && total) lines.push({ t: 'h2', v: 'Tổng giá trị ước tính: ' + money(total) + (buy ? ' (vốn mua ' + money(buy) + ')' : '') });
lines.push({ t: 'note', v: 'Số liệu ước tính để tham khảo, lấy từ các nguồn ghi kèm – không phải chứng thư thẩm định giá, không phải lời khuyên mua/bán.' });
return { q, rows, total, buy, lines, issues: rows.flatMap(r => r.issues.map(_o0 => r.name + ': ' + _o0)) };
}

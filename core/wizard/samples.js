export const PREFIX = 'mau_';
export const LABEL = 'Mẫu';
export const IMAGES = ['assets/samples/mau-1.svg', 'assets/samples/mau-2.svg', 'assets/samples/mau-3.svg', 'assets/samples/mau-4.svg'];
export const TABLES = ['projects', 'objects', 'events', 'reminders', 'quotes'];
const DAY = 86400000;
export const FALLBACK_PROJECTS = [];
export const isSample = (row) => !!row && String(row.id || '').startsWith(PREFIX);
export const displayName = (name) => String(name == null ? '' : name).replace(/^\s*Mẫu\s*[·•\-–:]\s*/i, '').trim() || String(name || '');
export function buildSampleProjects(source) {
const list = Array.isArray(source) && source.length ? source : FALLBACK_PROJECTS;
return list.filter((p) => p && p.id != null).map((p, i) => {
const { id, name, dev, img, ...rest } = p;
const data = { ...rest, img: IMAGES[i % IMAGES.length], sample: true, note: 'Dữ liệu mẫu – sửa hoặc xoá thoải mái' };
return { id: PREFIX + String(id).replace(/^mau_/, ''), name: LABEL + ' · ' + String(name || 'Dự án'), dev: String(dev || ''), data: JSON.stringify(data) };
});
}
export function buildSampleCustomers(projectNames = [], now = Date.now()) {
const _o2 = (i) => projectNames[i % Math.max(1, projectNames.length)] || '';
const _o0 = (i, name, status, extra = {}) => ({
id: PREFIX + 'c' + String(i).padStart(2, '0'), kind: 'customer', name: name + ' (' + LABEL + ')', phone: '090000000' + i, zalo: '', email: '',
source: extra.source || 'manual', status, owner: '', project: _o2(i), unit_type: extra.unit_type || '', budget: extra.budget || '', need: extra.need || 'mua',
note: 'Khách mẫu – xoá bằng nút "Xoá toàn bộ dữ liệu mẫu"', tags: LABEL, birthday: '', consent: 1, lead_ref: '', score: extra.score || 0,
data: JSON.stringify({ sample: true }), created_at: now - (extra.age || 1) * DAY
});
const customers = [
_o0(1, 'Khách A', 'Mới', { source: 'landing', budget: 3000000000, age: 0.2 }),
_o0(2, 'Khách B', 'Đang chăm sóc', { unit_type: '2N', budget: 4200000000, score: 70, age: 5 }),
_o0(3, 'Khách C', 'Hẹn xem nhà', { unit_type: '3N', budget: 6500000000, score: 82, age: 9 }),
_o0(4, 'Khách D', 'Đã đặt cọc', { unit_type: '1N', budget: 2500000000, score: 90, age: 20 }),
_o0(5, 'Khách E', 'Đã liên hệ', { need: 'thuê', budget: 15000000, score: 35, age: 2 })
];
const reminders = [
{ id: PREFIX + 'r01', object_id: PREFIX + 'c01', kind: 'followup', title: 'Gọi chào khách mới (' + LABEL + ')', due_at: now + 2 * 3600000, remind_before_days: 0, amount: '', installment: '', done: 0, notified_at: '', data: '{}' },
{ id: PREFIX + 'r02', object_id: PREFIX + 'c03', kind: 'meeting', title: 'Dẫn khách xem nhà mẫu (' + LABEL + ')', due_at: now + 2 * DAY, remind_before_days: 0, amount: '', installment: '', done: 0, notified_at: '', data: '{}' }
];
const events = [
{ id: PREFIX + 'e01', object_id: PREFIX + 'c02', type: 'zalo', text: 'Đã gửi bảng giá qua Zalo (' + LABEL + ')', at: now - DAY, data: '{}' }
];
return { customers, reminders, events };
}
export async function loadSamples(store, { source, now = Date.now() } = {}) {
const projects = buildSampleProjects(source);
const _o1 = projects.map((p) => displayName(p.name));
const { customers, reminders, events } = buildSampleCustomers(_o1, now);
for (const _o3 of projects) await store.put('projects', _o3);
for (const _o3 of customers) await store.put('objects', _o3);
for (const _o3 of reminders) await store.put('reminders', _o3);
for (const _o3 of events) await store.put('events', _o3);
return { projects: projects.length, customers: customers.length, reminders: reminders.length, events: events.length };
}
export async function countSamples(store) {
let n = 0;
for (const _o5 of TABLES) { try { n += (await store.list(_o5)).filter(isSample).length; } catch { } }
return n;
}
export async function clearSamples(store) {
let n = 0;
for (const _o5 of TABLES) {
let _o4 = [];
try { _o4 = await store.list(_o5); } catch { _o4 = []; }
for (const _o3 of _o4.filter(isSample)) { if (await store.remove(_o5, _o3.id)) n++; }
}
return n;
}
export default { PREFIX, LABEL, IMAGES, isSample, displayName, buildSampleProjects, buildSampleCustomers, loadSamples, countSamples, clearSamples };

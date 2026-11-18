export const MOCK_KEY = 'bds_mock';
export const TABLES = ['objects', 'quotes', 'reminders', 'projects'];
const LABEL = { objects: 'Khách/đối tượng', quotes: 'Báo giá', reminders: 'Nhắc việc', projects: 'Dự án' };
const _o0 = /^(mau_|demo)/;
export function userRows(tables) {
const _o9 = [];
const T = tables && typeof tables === 'object' ? tables : {};
for (const _of of TABLES) {
for (const _ob of Array.isArray(T[_of]) ? T[_of] : []) {
if (!_ob || typeof _ob !== 'object' || Number(_ob.deleted)) continue;
if (_o0.test(String(_ob.id || '')) || _o0.test(String(_ob.object_id || ''))) continue;
if (/^demo-/.test(String(_ob.lead_ref || ''))) continue;
_o9.push({ table: _of, row: _ob });
}
}
return _o9;
}
export function demoUserData(storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
let tables = {};
try { tables = JSON.parse((storage && storage.getItem(MOCK_KEY)) || '{}') || {}; } catch { tables = {}; }
const rows = userRows(tables);
return { count: rows.length, customers: rows.filter((x) => x.table === 'objects').length, rows };
}
const _o2 = (_og) => {
let _oc = _og == null ? '' : String(_og);
if (/^[=+\-@\t\r]/.test(_oc)) _oc = "'" + _oc;
return /[",\n\r;]/.test(_oc) ? '"' + _oc.replace(/"/g, '""') + '"' : _oc;
};
const _o4 = (ms) => { const _o8 = Number(ms); if (!_o8) return ''; const _o3 = new Date(_o8); const _oa = (x) => String(x).padStart(2, '0'); return _oa(_o3.getDate()) + '/' + _oa(_o3.getMonth() + 1) + '/' + _o3.getFullYear(); };
export function demoCsv(rows) {
const _o5 = ['Loại', 'Tên / tiêu đề', 'Điện thoại', 'Zalo', 'Email', 'Dự án', 'Nhu cầu', 'Ngân sách', 'Trạng thái', 'Ghi chú', 'Ngày tạo'];
const _o6 = [_o5.map(_o2).join(',')];
for (const { table, row: _ob } of rows || []) {
_o6.push([LABEL[table] || table, _ob.name || _ob.title || _ob.text || '', _ob.phone || '', _ob.zalo || '', _ob.email || '', _ob.project || _ob.project_name || '', _ob.need || '',
_ob.budget || _ob.total || '', _ob.status || '', _ob.note || _ob.notes || _ob.text || '', _o4(_ob.created_at || _ob.at || _ob.updated_at)].map(_o2).join(','));
}
return '﻿' + _o6.join('\r\n') + '\r\n';
}
export function downloadCsv(rows, name = 'du-lieu-xem-thu-bds-studio.csv') {
const _o1 = document.createElement('a');
_o1.href = URL.createObjectURL(new Blob([demoCsv(rows)], { type: 'text/csv;charset=utf-8' }));
_o1.download = name; _o1.hidden = true; document.body.appendChild(_o1); _o1.click();
setTimeout(() => { URL.revokeObjectURL(_o1.href); _o1.remove(); }, 1000);
}
export async function confirmLeaveDemo({ ui, api, storage } = {}) {
if (api && api.mode !== 'demo') return true;
const _o3 = demoUserData(storage);
if (!_o3.count || !ui || typeof ui.modal !== 'function') return true;
const { h } = ui;
let _od = false;
const _oe = h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'demo-leave-say' });
const _o7 = ui.modal({
title: 'Dữ liệu Xem thử sẽ KHÔNG chuyển sang máy chủ thật', cls: 'demo-leave-modal',
body: h('div', { class: 'stack', 'data-testid': 'demo-leave' },
h('p', { class: 'lead' }, 'Trong trình duyệt này có ', h('strong', { 'data-testid': 'demo-leave-count' }, String(_o3.count) + ' mục anh/chị tự nhập'),
_o3.customers ? ' (' + _o3.customers + ' khách)' : '', ' lúc Xem thử.'),
h('p', null, 'Máy chủ thật KHÔNG nhận dữ liệu này: sau khi nối, app chỉ hiện dữ liệu của máy chủ thật, phần Xem thử không hiện nữa. ',
'Bấm "Tải CSV" (mở bằng Excel) để giữ lại rồi nhập lại vào máy chủ thật. Dữ liệu mẫu (tên có chữ "Mẫu") không tính.'),
_oe),
actions: [
{ label: 'Huỷ', kind: 'ghost', value: false },
{ label: 'Tải CSV', kind: 'secondary', id: 'demo-leave-export', close: false, onClick: () => { downloadCsv(_o3.rows); _od = true; _oe.textContent = 'Đã tải tệp du-lieu-xem-thu-bds-studio.csv – mở bằng Excel để xem.'; return false; } },
{ label: 'Vẫn nối máy chủ thật', kind: 'danger', id: 'demo-leave-ok', value: true }
]
});
const _og = await _o7.done;
if (_og === true && !_od) try { ui.toast('Đã nối máy chủ thật – dữ liệu Xem thử không được chuyển sang.', 'warn', 5000); } catch { }
return _og === true;
}
export default { MOCK_KEY, userRows, demoUserData, demoCsv, downloadCsv, confirmLeaveDemo };

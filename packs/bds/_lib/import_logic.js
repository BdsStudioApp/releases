import * as crm from './crm.js';
export const CHUNK = 2000;
export const MAX_ROWS = 20000;
export const PREVIEW = 8;
export const FIELDS = [
{ id: 'name', label: 'Tên khách', req: true, syn: ['ho ten', 'ho va ten', 'ten', 'ten khach', 'ten khach hang', 'khach hang', 'ho ten khach hang', 'full name', 'fullname', 'name', 'customer', 'customer name', 'nguoi lien he'] },
{ id: 'phone', label: 'Điện thoại', req: true, syn: ['sdt', 'so dien thoai', 'dien thoai', 'dt', 'so dt', 'di dong', 'so di dong', 'phone', 'phone number', 'mobile', 'tel', 'so lien he', 'sdt lien he'] },
{ id: 'zalo', label: 'Zalo', syn: ['zalo', 'so zalo', 'sdt zalo'] },
{ id: 'email', label: 'Email', syn: ['email', 'e mail', 'mail', 'thu dien tu', 'dia chi email'] },
{ id: 'project', label: 'Dự án', syn: ['du an', 'du an quan tam', 'ten du an', 'project', 'project name'] },
{ id: 'need', label: 'Nhu cầu', syn: ['nhu cau', 'need', 'mua thue'] },
{ id: 'unit_type', label: 'Loại căn', syn: ['loai can', 'loai can ho', 'loai nha', 'loai bds', 'unit', 'unit type', 'san pham'] },
{ id: 'budget', label: 'Vốn', syn: ['von', 'ngan sach', 'tai chinh', 'kha nang tai chinh', 'budget', 'muc gia', 'gia mong muon'] },
{ id: 'note', label: 'Ghi chú', syn: ['ghi chu', 'note', 'notes', 'noi dung', 'loi nhan', 'mo ta', 'message', 'yeu cau', 'trao doi'] },
{ id: 'birthday', label: 'Ngày sinh', syn: ['ngay sinh', 'sinh nhat', 'birthday', 'dob', 'nam sinh'] },
{ id: 'status', label: 'Trạng thái', syn: ['trang thai', 'tinh trang', 'status'] },
];
const _o0 = Object.fromEntries(FIELDS.map((_od) => [_od.id, _od]));
const _o1 = /^(stt|tt|so tt|so thu tu|thu tu|no|#|)$/;
const norm = (s) => crm.strip(s).replace(/[^a-z0-9]+/g, ' ').trim();
export function detectMapping(headers) {
const _of = (headers || []).map(norm), used = new Set(), map = {};
for (const _od of FIELDS) {
const _og = _of.findIndex((_o12, _oh) => !used.has(_oh) && _o12 && _od.syn.includes(_o12));
if (_og >= 0) { map[_od.id] = _og; used.add(_og); }
}
for (const _od of FIELDS) {
if (map[_od.id] !== undefined) continue;
const _og = _of.findIndex((_o12, _oh) => !used.has(_oh) && _o12 && _od.syn.some((s) => s.length >= 4 && (` ${_o12} `).includes(` ${s} `)));
if (_og >= 0) { map[_od.id] = _og; used.add(_og); }
}
return map;
}
export function findHeaderRow(rows) {
for (let _og = 0; _og < Math.min(10, (rows || []).length); _og++) {
const m = detectMapping(rows[_og]);
if (m.name !== undefined && m.phone !== undefined) return _og;
}
for (let _og = 0; _og < Math.min(10, (rows || []).length); _og++) {
const m = detectMapping(rows[_og]);
if (m.name !== undefined || m.phone !== undefined) return _og;
}
return 0;
}
export function prepare(rows) {
const _o9 = (rows || []).filter((_ox) => Array.isArray(_ox) && _ox.some((_o8) => String(_o8 ?? '').trim() !== ''));
const headerRow = findHeaderRow(_o9);
const headers = (_o9[headerRow] || []).map((_o8) => String(_o8 ?? '').trim());
const body = _o9.slice(headerRow + 1);
return { headers, body, headerRow, mapping: detectMapping(headers) };
}
export function pickPhone(cell) {
const raw = String(cell ?? '').trim();
if (!raw) return { phone: '', rest: [], raw };
const _os = raw.split(/[,;\/|\n]+|\s+-\s+|\s{2,}/).map((s) => s.trim()).filter(Boolean);
const _oo = _os.map((_oq) => crm.normPhone(_oq)).filter((_oq) => crm.validPhone(_oq));
if (_oo.length) return { phone: _oo[0], rest: _oo.slice(1), raw };
const one = crm.normPhone(raw);
return { phone: crm.validPhone(one) ? one : '', rest: [], raw };
}
export function parseDate(v) {
const s = String(v ?? '').trim();
let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
if (m) return _oo(+m[1], +m[2], +m[3]);
m = /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/.exec(s);
if (m) return _oo(+m[3], +m[2], +m[1]);
return '';
function _oo(y, mo, d) {
if (y < 1900 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > 31) return '';
return y + '-' + String(mo).padStart(2, '0') + '-' + String(d).padStart(2, '0');
}
}
function _ol(v) {
const s = crm.strip(v);
if (!s) return '';
if (/cho thue/.test(s)) return 'cho thuê';
if (/\bthue\b/.test(s)) return 'thuê';
if (/\bban\b/.test(s)) return 'bán';
if (/\bmua\b|dau tu|o thuc/.test(s)) return 'mua';
return '';
}
const _oa = (s, _oj) => { const t = String(s ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim(); return t.length > _oj ? t.slice(0, _oj - 1) + '…' : t; };
export function planImport(opts) {
const { headers = [], body = [], mapping = {}, existing = [], mode = 'skip', owner = '', me = '', projects = [], file = '', now = Date.now(), newId = crm.fallbackId } = opts || {};
const firstLine = opts && opts.firstLine ? opts.firstLine : 2;
const _oc = !(opts && opts.extra === false);
const _op = { add: [], notes: [], skipped: [], invalid: [], total: 0 };
const _o7 = new Map();
for (const _o8 of crm.activeCustomers(existing)) for (const _oq of [_o8.phone, _o8.zalo]) { const _oj = crm.normPhone(_oq); if (_oj && !_o7.has(_oj)) _o7.set(_oj, _o8); }
const _oz = new Map();
const _ow = (v) => { const s = crm.strip(v); if (!s) return null; return projects.find((_oq) => crm.strip(_oq.name) === s || crm.strip(_oq.id) === s) || null; };
const _oi = new Set(Object.values(mapping).filter((_og) => _og !== undefined && _og !== null && _og >= 0));
const get = (_ox, _od) => (mapping[_od] === undefined || mapping[_od] === null || mapping[_od] < 0 ? '' : String(_ox[mapping[_od]] ?? '').trim());
const _o11 = _oa(file, 80);
for (let _og = 0; _og < body.length; _og++) {
const _ox = body[_og] || [], line = firstLine + _og;
if (!_ox.some((_o8) => String(_o8 ?? '').trim() !== '')) continue;
if (isTemplateExample(_ox)) continue;
_op.total++;
if (_op.total > MAX_ROWS) { _op.invalid.push({ line, name: '', phone: '', reason: 'Quá ' + MAX_ROWS.toLocaleString('vi-VN') + ' dòng / lần nhập – tách tệp rồi nhập tiếp' }); continue; }
const name = _oa(get(_ox, 'name').replace(/\s+/g, ' '), 120);
const _ot = pickPhone(get(_ox, 'phone'));
const _ou = _oa(_ot.raw, 30);
if (!_ot.raw) { _op.invalid.push({ line, name, phone: '', reason: 'Thiếu số điện thoại' }); continue; }
if (!_ot.phone) { _op.invalid.push({ line, name, phone: _ou, reason: 'Số điện thoại sai (cần 10 số, bắt đầu bằng 0)' }); continue; }
if (!name) { _op.invalid.push({ line, name: '', phone: _ot.phone, reason: 'Thiếu tên khách' }); continue; }
const extraParts = [];
if (_ot.rest.length) extraParts.push('Số khác: ' + _ot.rest.join(', '));
const zaloP = pickPhone(get(_ox, 'zalo')).phone;
const email = _oa(get(_ox, 'email'), 120);
const _or = get(_ox, 'project'), proj = _ow(_or);
if (_or && !proj) extraParts.push('Dự án: ' + _oa(_or, 80));
const _om = get(_ox, 'need'), need = _ol(_om);
if (_om && !need) extraParts.push('Nhu cầu: ' + _oa(_om, 80));
const _o5 = get(_ox, 'budget'), budget = _o5 ? (crm.parseMoney(_o5) || 0) : 0;
if (_o5 && !budget) extraParts.push('Vốn: ' + _oa(_o5, 40));
const _o6 = get(_ox, 'birthday'), birthday = parseDate(_o6);
if (_o6 && !birthday) extraParts.push('Ngày sinh: ' + _oa(_o6, 20));
const _o10 = get(_ox, 'status');
if (_o10) extraParts.push('Trạng thái cũ: ' + _oa(_o10, 40));
if (_oc) headers.forEach((hd, _oh) => { if (!_oi.has(_oh) && String(_ox[_oh] ?? '').trim() && hd && !_o1.test(norm(hd))) extraParts.push(_oa(hd, 40) + ': ' + _oa(_ox[_oh], 120)); });
const _on = _oa(get(_ox, 'note'), 600);
const note = _oa([_on, ...extraParts].filter(Boolean).join(' · '), 1000);
const _ov = _oz.get(_ot.phone);
if (_ov) { _op.skipped.push({ line, name, phone: _ot.phone, reason: 'Trùng số với dòng ' + _ov + ' trong tệp' }); continue; }
_oz.set(_ot.phone, line);
const _ob = _o7.get(_ot.phone) || (zaloP && _o7.get(zaloP));
if (_ob) {
if (mode === 'note') {
const text = _oa('Nhập từ tệp' + (_o11 ? ' "' + _o11 + '"' : '') + ' (dòng ' + line + ')' + (name && name !== _ob.name ? ' – tên trong tệp: ' + name : '') + (note ? ' · ' + note : ''), 1000);
_op.notes.push({ id: _ob.id, name: _ob.name || name, phone: _ot.phone, text, line });
} else _op.skipped.push({ line, name, phone: _ot.phone, reason: 'Đã có trong app ("' + _oa(_ob.name, 40) + '") – bỏ qua, không ghi đè' });
continue;
}
const _oy = {
id: newId(), kind: 'customer', name, phone: _ot.phone, zalo: zaloP && zaloP !== _ot.phone ? zaloP : '', email,
project: proj ? proj.id : '', need: need || 'mua', unit_type: _oa(get(_ox, 'unit_type'), 40), budget, note, birthday,
source: 'import', status: 'Mới', consent: 1, tags: '', created_at: now,
data: JSON.stringify({ import: { file: _o11, line, at: now, by: me, consent: 'xac_nhan_khi_nhap' } }), deleted: 0,
};
if (owner) _oy.owner = owner;
else if (me) _oy.owner = me;
if (me) _oy.created_by = me;
_op.add.push(_oy);
}
return _op;
}
export function chunks(list, _oj = CHUNK) { const _op = []; for (let _og = 0; _og < (list || []).length; _og += _oj) _op.push(list.slice(_og, _og + _oj)); return _op; }
export const DUP_SERVER = 'Trùng khách đã có trên máy chủ (SĐT/email) – giữ hồ sơ cũ, chỉ bổ sung ô còn trống';
export function reportRows(plan, done = {}) {
const _oe = ['Dòng trong tệp', 'Tên', 'Số điện thoại', 'Kết quả', 'Lý do'];
const rows = [];
const failed = new Set((done.failed || []).map(String));
const dup = new Set((done.dup || []).map(String));
for (const _ox of plan.add) {
const line = _ox.data ? JSON.parse(_ox.data).import.line : '';
if (dup.has(String(_ox.id))) rows.push([line, _ox.name, _ox.phone, 'Bỏ qua (trùng)', DUP_SERVER]);
else rows.push([line, _ox.name, _ox.phone, failed.has(_ox.id) ? 'Chưa thêm' : 'Đã thêm', failed.has(_ox.id) ? 'Lỗi khi ghi – thử nhập lại tệp' : '']);
}
for (const _oj of plan.notes) rows.push([_oj.line, _oj.name, _oj.phone, 'Thêm ghi chú', 'Khách đã có – chỉ thêm ghi chú, không ghi đè']);
for (const s of plan.skipped) rows.push([s.line, s.name, s.phone, 'Bỏ qua (trùng)', s.reason]);
for (const s of plan.invalid) rows.push([s.line, s.name, s.phone, 'Không hợp lệ', s.reason]);
rows.sort((a, b) => (Number(a[0]) || 0) - (Number(b[0]) || 0));
return [_oe, ...rows];
}
export function csvCellSafe(v) { const s = v === null || v === undefined ? '' : String(v); const t = /^[=+\-@\t\r]/.test(s) ? "'" + s : s; return /[",\n\r;]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; }
export function toCsv(rows) {
return '\ufeff' + rows.map((_ox) => _ox.map(csvCellSafe).join(',')).join('\r\n') + '\r\n';
}
export function reasonCounts(list) {
const m = new Map();
for (const _o12 of list || []) { const _oh = String(_o12.reason || '').replace(/\s*\(".*"\)/, '').replace(/dòng \d+/, 'dòng khác').trim(); m.set(_oh, (m.get(_oh) || 0) + 1); }
return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
export const fieldLabel = (id) => (_o0[id] ? _o0[id].label : id);
export const TEMPLATE_XLSX = 'mau-nhap-khach.xlsx';
export const TEMPLATE_PAD = 2001;
const _o2 = 'VÍ DỤ – xoá dòng này';
const _o4 = { name: 30, phone: 16, zalo: 16, email: 26, project: 24, need: 12, unit_type: 14, budget: 14, note: 42, birthday: 14, status: 16 };
const T_EXAMPLES = [
{ name: 'Nguyễn Văn An (' + _o2 + ')', phone: '0912 345 678', zalo: '0912 345 678', email: 'vidu.an@email.com', project: 'Dự án mẫu A', need: 'mua', unit_type: '2PN', budget: '2,5 tỷ', note: _o2 + '. Đã xem nhà, cần căn 2PN', birthday: '15/08/1988', status: 'Mới' },
{ name: 'Trần Thị Bình (' + _o2 + ')', phone: '0987 654 321', zalo: '', email: '', project: '', need: 'thuê', unit_type: '', budget: '15 triệu/tháng', note: _o2, birthday: '', status: '' },
];
const _o3 = [
['Cách điền tệp nhập khách'],
['1. Cột có dấu * là bắt buộc: Tên khách* và Điện thoại*. Các cột khác có thể để trống.'],
['2. Số điện thoại 10 số, bắt đầu bằng 0 (ví dụ 0912 345 678). Nhập được cả +84.'],
['3. Không xoá hay sửa hàng tiêu đề (hàng 1). Xoá 2 dòng ghi "VÍ DỤ" trước khi nhập.'],
['4. Nhu cầu chọn trong danh sách: ' + crm.NEEDS.join(', ') + '. Ngày sinh ghi dạng ngày/tháng/năm.'],
['5. Lưu thành .xlsx hoặc CSV UTF-8 rồi chọn ở nút "Nhập khách từ Excel/CSV". Tối đa ' + MAX_ROWS.toLocaleString('vi-VN') + ' dòng mỗi lần; khách trùng số điện thoại không bị ghi đè.'],
];
export function isTemplateExample(cells) { return (cells || []).some((_o8) => { const _o12 = crm.strip(String(_o8 ?? '')); return _o12.includes('vi du') && _o12.includes('xoa dong'); }); }
const colName = (_og) => (_og >= 26 ? String.fromCharCode(64 + Math.floor(_og / 26)) : '') + String.fromCharCode(65 + (_og % 26));
export function templateSheets() {
const header = FIELDS.map((_od) => _od.label + (_od.req ? '*' : ''));
const _ok = FIELDS.findIndex((_od) => _od.id === 'need');
return [
{ name: 'Khách', header: true, padTo: TEMPLATE_PAD, rows: [header, ...T_EXAMPLES.map((_ob) => FIELDS.map((_od) => _ob[_od.id] || ''))],
cols: FIELDS.map((_od) => ({ width: _o4[_od.id] || 16, text: _od.id === 'phone' || _od.id === 'zalo' })),
lists: [{ ref: colName(_ok) + '2:' + colName(_ok) + TEMPLATE_PAD, values: crm.NEEDS.slice() }] },
{ name: 'Hướng dẫn', header: true, rows: _o3, cols: [{ width: 100 }] },
];
}

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
const _o0 = Object.fromEntries(FIELDS.map((_oa) => [_oa.id, _oa]));
const _o1 = /^(stt|tt|so tt|so thu tu|thu tu|no|#|)$/;
const norm = (s) => crm.strip(s).replace(/[^a-z0-9]+/g, ' ').trim();
export function detectMapping(headers) {
const _oc = (headers || []).map(norm), used = new Set(), map = {};
for (const _oa of FIELDS) {
const _od = _oc.findIndex((_oz, _oe) => !used.has(_oe) && _oz && _oa.syn.includes(_oz));
if (_od >= 0) { map[_oa.id] = _od; used.add(_od); }
}
for (const _oa of FIELDS) {
if (map[_oa.id] !== undefined) continue;
const _od = _oc.findIndex((_oz, _oe) => !used.has(_oe) && _oz && _oa.syn.some((s) => s.length >= 4 && (` ${_oz} `).includes(` ${s} `)));
if (_od >= 0) { map[_oa.id] = _od; used.add(_od); }
}
return map;
}
export function findHeaderRow(rows) {
for (let _od = 0; _od < Math.min(10, (rows || []).length); _od++) {
const m = detectMapping(rows[_od]);
if (m.name !== undefined && m.phone !== undefined) return _od;
}
for (let _od = 0; _od < Math.min(10, (rows || []).length); _od++) {
const m = detectMapping(rows[_od]);
if (m.name !== undefined || m.phone !== undefined) return _od;
}
return 0;
}
export function prepare(rows) {
const _o6 = (rows || []).filter((_ou) => Array.isArray(_ou) && _ou.some((_o5) => String(_o5 ?? '').trim() !== ''));
const headerRow = findHeaderRow(_o6);
const headers = (_o6[headerRow] || []).map((_o5) => String(_o5 ?? '').trim());
const body = _o6.slice(headerRow + 1);
return { headers, body, headerRow, mapping: detectMapping(headers) };
}
export function pickPhone(cell) {
const raw = String(cell ?? '').trim();
if (!raw) return { phone: '', rest: [], raw };
const _oo = raw.split(/[,;\/|\n]+|\s+-\s+|\s{2,}/).map((s) => s.trim()).filter(Boolean);
const _ok = _oo.map((_om) => crm.normPhone(_om)).filter((_om) => crm.validPhone(_om));
if (_ok.length) return { phone: _ok[0], rest: _ok.slice(1), raw };
const one = crm.normPhone(raw);
return { phone: crm.validPhone(one) ? one : '', rest: [], raw };
}
export function parseDate(v) {
const s = String(v ?? '').trim();
let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
if (m) return _ok(+m[1], +m[2], +m[3]);
m = /^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/.exec(s);
if (m) return _ok(+m[3], +m[2], +m[1]);
return '';
function _ok(y, mo, d) {
if (y < 1900 || y > 2100 || mo < 1 || mo > 12 || d < 1 || d > 31) return '';
return y + '-' + String(mo).padStart(2, '0') + '-' + String(d).padStart(2, '0');
}
}
function _oh(v) {
const s = crm.strip(v);
if (!s) return '';
if (/cho thue/.test(s)) return 'cho thuê';
if (/\bthue\b/.test(s)) return 'thuê';
if (/\bban\b/.test(s)) return 'bán';
if (/\bmua\b|dau tu|o thuc/.test(s)) return 'mua';
return '';
}
const _o7 = (s, _og) => { const t = String(s ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim(); return t.length > _og ? t.slice(0, _og - 1) + '…' : t; };
export function planImport(opts) {
const { headers = [], body = [], mapping = {}, existing = [], mode = 'skip', owner = '', me = '', projects = [], file = '', now = Date.now(), newId = crm.fallbackId } = opts || {};
const firstLine = opts && opts.firstLine ? opts.firstLine : 2;
const _o9 = !(opts && opts.extra === false);
const _ol = { add: [], notes: [], skipped: [], invalid: [], total: 0 };
const _o4 = new Map();
for (const _o5 of crm.activeCustomers(existing)) for (const _om of [_o5.phone, _o5.zalo]) { const _og = crm.normPhone(_om); if (_og && !_o4.has(_og)) _o4.set(_og, _o5); }
const _ow = new Map();
const _os = (v) => { const s = crm.strip(v); if (!s) return null; return projects.find((_om) => crm.strip(_om.name) === s || crm.strip(_om.id) === s) || null; };
const _of = new Set(Object.values(mapping).filter((_od) => _od !== undefined && _od !== null && _od >= 0));
const get = (_ou, _oa) => (mapping[_oa] === undefined || mapping[_oa] === null || mapping[_oa] < 0 ? '' : String(_ou[mapping[_oa]] ?? '').trim());
const _oy = _o7(file, 80);
for (let _od = 0; _od < body.length; _od++) {
const _ou = body[_od] || [], line = firstLine + _od;
if (!_ou.some((_o5) => String(_o5 ?? '').trim() !== '')) continue;
_ol.total++;
if (_ol.total > MAX_ROWS) { _ol.invalid.push({ line, name: '', phone: '', reason: 'Quá ' + MAX_ROWS.toLocaleString('vi-VN') + ' dòng / lần nhập – tách tệp rồi nhập tiếp' }); continue; }
const name = _o7(get(_ou, 'name').replace(/\s+/g, ' '), 120);
const _op = pickPhone(get(_ou, 'phone'));
const _oq = _o7(_op.raw, 30);
if (!_op.raw) { _ol.invalid.push({ line, name, phone: '', reason: 'Thiếu số điện thoại' }); continue; }
if (!_op.phone) { _ol.invalid.push({ line, name, phone: _oq, reason: 'Số điện thoại sai (cần 10 số, bắt đầu bằng 0)' }); continue; }
if (!name) { _ol.invalid.push({ line, name: '', phone: _op.phone, reason: 'Thiếu tên khách' }); continue; }
const extraParts = [];
if (_op.rest.length) extraParts.push('Số khác: ' + _op.rest.join(', '));
const zaloP = pickPhone(get(_ou, 'zalo')).phone;
const email = _o7(get(_ou, 'email'), 120);
const _on = get(_ou, 'project'), proj = _os(_on);
if (_on && !proj) extraParts.push('Dự án: ' + _o7(_on, 80));
const _oi = get(_ou, 'need'), need = _oh(_oi);
if (_oi && !need) extraParts.push('Nhu cầu: ' + _o7(_oi, 80));
const _o2 = get(_ou, 'budget'), budget = _o2 ? (crm.parseMoney(_o2) || 0) : 0;
if (_o2 && !budget) extraParts.push('Vốn: ' + _o7(_o2, 40));
const _o3 = get(_ou, 'birthday'), birthday = parseDate(_o3);
if (_o3 && !birthday) extraParts.push('Ngày sinh: ' + _o7(_o3, 20));
const _ox = get(_ou, 'status');
if (_ox) extraParts.push('Trạng thái cũ: ' + _o7(_ox, 40));
if (_o9) headers.forEach((hd, _oe) => { if (!_of.has(_oe) && String(_ou[_oe] ?? '').trim() && hd && !_o1.test(norm(hd))) extraParts.push(_o7(hd, 40) + ': ' + _o7(_ou[_oe], 120)); });
const _oj = _o7(get(_ou, 'note'), 600);
const note = _o7([_oj, ...extraParts].filter(Boolean).join(' · '), 1000);
const _or = _ow.get(_op.phone);
if (_or) { _ol.skipped.push({ line, name, phone: _op.phone, reason: 'Trùng số với dòng ' + _or + ' trong tệp' }); continue; }
_ow.set(_op.phone, line);
const _o8 = _o4.get(_op.phone) || (zaloP && _o4.get(zaloP));
if (_o8) {
if (mode === 'note') {
const text = _o7('Nhập từ tệp' + (_oy ? ' "' + _oy + '"' : '') + ' (dòng ' + line + ')' + (name && name !== _o8.name ? ' – tên trong tệp: ' + name : '') + (note ? ' · ' + note : ''), 1000);
_ol.notes.push({ id: _o8.id, name: _o8.name || name, phone: _op.phone, text, line });
} else _ol.skipped.push({ line, name, phone: _op.phone, reason: 'Đã có trong app ("' + _o7(_o8.name, 40) + '") – bỏ qua, không ghi đè' });
continue;
}
const _ov = {
id: newId(), kind: 'customer', name, phone: _op.phone, zalo: zaloP && zaloP !== _op.phone ? zaloP : '', email,
project: proj ? proj.id : '', need: need || 'mua', unit_type: _o7(get(_ou, 'unit_type'), 40), budget, note, birthday,
source: 'import', status: 'Mới', consent: 1, tags: '', created_at: now,
data: JSON.stringify({ import: { file: _oy, line, at: now, by: me, consent: 'xac_nhan_khi_nhap' } }), deleted: 0,
};
if (owner) _ov.owner = owner;
else if (me) _ov.owner = me;
if (me) _ov.created_by = me;
_ol.add.push(_ov);
}
return _ol;
}
export function chunks(list, _og = CHUNK) { const _ol = []; for (let _od = 0; _od < (list || []).length; _od += _og) _ol.push(list.slice(_od, _od + _og)); return _ol; }
export const DUP_SERVER = 'Trùng khách đã có trên máy chủ (SĐT/email) – giữ hồ sơ cũ, chỉ bổ sung ô còn trống';
export function reportRows(plan, done = {}) {
const _ob = ['Dòng trong tệp', 'Tên', 'Số điện thoại', 'Kết quả', 'Lý do'];
const rows = [];
const failed = new Set((done.failed || []).map(String));
const dup = new Set((done.dup || []).map(String));
for (const _ou of plan.add) {
const line = _ou.data ? JSON.parse(_ou.data).import.line : '';
if (dup.has(String(_ou.id))) rows.push([line, _ou.name, _ou.phone, 'Bỏ qua (trùng)', DUP_SERVER]);
else rows.push([line, _ou.name, _ou.phone, failed.has(_ou.id) ? 'Chưa thêm' : 'Đã thêm', failed.has(_ou.id) ? 'Lỗi khi ghi – thử nhập lại tệp' : '']);
}
for (const _og of plan.notes) rows.push([_og.line, _og.name, _og.phone, 'Thêm ghi chú', 'Khách đã có – chỉ thêm ghi chú, không ghi đè']);
for (const s of plan.skipped) rows.push([s.line, s.name, s.phone, 'Bỏ qua (trùng)', s.reason]);
for (const s of plan.invalid) rows.push([s.line, s.name, s.phone, 'Không hợp lệ', s.reason]);
rows.sort((a, b) => (Number(a[0]) || 0) - (Number(b[0]) || 0));
return [_ob, ...rows];
}
export function toCsv(rows) {
const _ot = (v) => { const s = v === null || v === undefined ? '' : String(v); const t = /^[=+\-@\t\r]/.test(s) ? "'" + s : s; return /[",\n\r;]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t; };
return '﻿' + rows.map((_ou) => _ou.map(_ot).join(',')).join('\r\n') + '\r\n';
}
export function reasonCounts(list) {
const m = new Map();
for (const _oz of list || []) { const _oe = String(_oz.reason || '').replace(/\s*\(".*"\)/, '').replace(/dòng \d+/, 'dòng khác').trim(); m.set(_oe, (m.get(_oe) || 0) + 1); }
return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
export const fieldLabel = (id) => (_o0[id] ? _o0[id].label : id);

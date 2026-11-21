import { parseNum, fmtNum, fold, normalizePlans, checkPlans, typesToText, ymLabel } from '../_lib/sales.js';
export const LIMITS = {
FILE_MAX: 20 * 1024 * 1024,
AI_INLINE_MAX: 14 * 1024 * 1024,
TEXT_MAX: 150000,
IMG_PX: 2000,
HEIC_RAW_MAX: 7 * 1024 * 1024,
PDF_PAGES_WARN: 200,
DATA_MAX: 45000,
UNITS_MAX: 400,
};
export const MIME = {
pdf: 'application/pdf', jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', heic: 'image/heic',
xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', csv: 'text/csv',
};
export const ACCEPT = '.pdf,.jpg,.jpeg,.png,.webp,.heic,.heif,.xlsx,.docx,.csv,application/pdf,image/*';
export function fmtSize(n) {
n = Number(n) || 0;
if (n < 1024 * 1024) return Math.max(1, Math.round(n / 1024)) + ' KB';
return fmtNum(n / 1048576, 1) + ' MB';
}
export function kindOf(file) {
const name = String((file && file.name) || '').toLowerCase(), type = String((file && file.type) || '').toLowerCase();
const _oc = (name.match(/\.([a-z0-9]+)$/) || [])[1] || '';
const by = (k) => ({ kind: k, mime: MIME[k], group: ['xlsx', 'docx', 'csv'].includes(k) ? 'text' : 'ai' });
if (_oc === 'pdf' || type === 'application/pdf') return by('pdf');
if (_oc === 'jpg' || _oc === 'jpeg' || type === 'image/jpeg') return by('jpg');
if (_oc === 'png' || type === 'image/png') return by('png');
if (_oc === 'webp' || type === 'image/webp') return by('webp');
if (_oc === 'heic' || _oc === 'heif' || /image\/hei[cf]/.test(type)) return by('heic');
if (_oc === 'xlsx' || type === MIME.xlsx) return by('xlsx');
if (_oc === 'docx' || type === MIME.docx) return by('docx');
if (_oc === 'csv' || type === 'text/csv') return by('csv');
if (_oc === 'xls' || _oc === 'xlsm' || type === 'application/vnd.ms-excel') return { kind: 'xls', legacy: true };
if (_oc === 'doc' || type === 'application/msword') return { kind: 'doc', legacy: true };
return { kind: '' };
}
export function checkFile(file) {
const k = kindOf(file), size = Number(file && file.size) || 0, sizeText = fmtSize(size);
const base = { ...k, size, sizeText, name: String((file && file.name) || 'tai-lieu') };
if (k.kind === 'xls') return { ...base, ok: false, message: 'File Excel đời cũ (.xls) – mở bằng Excel, chọn Lưu thành → .xlsx rồi gửi lại.' };
if (k.kind === 'doc') return { ...base, ok: false, message: 'File Word đời cũ (.doc) – mở bằng Word, chọn Lưu thành → .docx (hoặc PDF) rồi gửi lại.' };
if (!k.kind) return { ...base, ok: false, message: 'Chưa nhận loại file này. Gửi PDF, ảnh (JPG, PNG, WebP, HEIC), Excel .xlsx, Word .docx hoặc CSV.' };
if (!size) return { ...base, ok: false, message: 'File trống (0 KB).' };
if (size > LIMITS.FILE_MAX) return { ...base, ok: false, message: `File ${sizeText} – quá lớn. Tối đa ${fmtSize(LIMITS.FILE_MAX)}; nén hoặc tách file rồi gửi lại.` };
return { ...base, ok: true, message: '' };
}
export function pdfPageCount(bytes) {
const u = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes || []);
let s = '', n = 0;
const CH = 1 << 16;
for (let i = 0; i < u.length; i += CH) {
s = s.slice(-16) + String.fromCharCode.apply(null, u.subarray(i, i + CH));
const _oh = s.match(/\/Type\s*\/Page(?![a-zA-Z])/g);
if (_oh) n += _oh.length;
s = s.replace(/\/Type\s*\/Page(?![a-zA-Z])/g, '');
}
return n;
}
export function aiFit(chk, pages = 0) {
if (chk.group !== 'ai') return { ok: true, message: '' };
if (chk.kind === 'pdf' && chk.size > LIMITS.AI_INLINE_MAX) return { ok: false, message: `PDF ${chk.sizeText} – AI chỉ đọc được PDF đến ${fmtSize(LIMITS.AI_INLINE_MAX)}. File gốc vẫn lưu vào Drive; tách PDF thành nhiều phần nhỏ hơn rồi gửi từng phần.` };
if (chk.kind === 'pdf' && pages > LIMITS.PDF_PAGES_WARN) return { ok: true, message: `PDF khoảng ${pages} trang – AI đọc lâu và dễ sót; nên tách riêng các trang bảng giá/chính sách.` };
return { ok: true, message: '' };
}
const _o1 = [/ignore (all |any )?(previous|prior|above) (instructions|prompts?)/i, /disregard (the )?(previous|above|system)/i, /you are now\b/i, /system prompt/i,
/bo qua (moi |tat ca |cac )?(huong dan|chi dan|lenh|yeu cau)( truoc| tren)?/, /(hay|phai) tra loi (rang|la)\b/, /dat gia (thanh|la) \d/, /\bjailbreak\b/i, /<\s*script\b/i];
export function suspiciousText(text) {
const t = String(text || ''), f = fold(t);
const _od = [];
for (const _oy of _o1) { const _oh = _oy.exec(_oy.flags.includes('i') ? t : f); if (_oh) _od.push(_oh[0].slice(0, 60)); }
return _od;
}
export async function readOfficeText(kind, bytes, opts = {}) {
const O = opts.ooxml || await import('../../../shared/ooxml.js');
const u = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
const r = await O.parseFile(u, { name: opts.name || ('file.' + kind), maxLength: LIMITS.TEXT_MAX });
const text = String((r && r.text) || '').replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
return { text, kind: r && r.kind, truncated: /…\[đã cắt bớt \d+ dòng\]$/.test(text) || !!(r && r.data && Array.isArray(r.data.sheets) && r.data.sheets.some((x) => x.truncated)) };
}
const _ol = (v) => { const n = parseNum(v); return isFinite(n) ? n : null; };
const _or = (v) => { const n = _ol(v); return n != null && n > 0 ? n : null; };
const _os = (v) => { const n = _or(v); return n == null ? null : n >= 1e5 ? n / 1e6 : n; };
const _o16 = (v) => { const n = _or(v); return n == null ? null : n < 1000 ? n * 1e9 : n < 1e6 ? n * 1e6 : n; };
const _o10 = (v, max = 300) => (v == null || typeof v === 'object' ? '' : String(v).trim().slice(0, max));
export function normalizeExtraction(raw) {
const r = raw && typeof raw === 'object' ? (raw.extraction && typeof raw.extraction === 'object' ? raw.extraction : raw) : {};
const _op = r.project && typeof r.project === 'object' ? r.project : {};
return {
project: { name: _o10(_op.name, 200), dev: _o10(_op.dev, 200), loc: _o10(_op.loc, 300), status: _o10(_op.status, 60), handover: _o10(_op.handover, 40), hdmb: _or(_op.hdmb),
legal: _o10(_op.legal, 600), scale: _o10(_op.scale, 300), amenities: _o10(_op.amenities, 600), price_from: _os(_op.price_from), price_to: _os(_op.price_to) },
types: (Array.isArray(r.types) ? r.types : []).filter((t) => t && typeof t === 'object' && _o10(t.name)).slice(0, 30).map((t) => ({
name: _o10(t.name, 60), bedrooms: _ol(t.bedrooms), area_from: _or(t.area_from), area_to: _or(t.area_to), area_kind: _o10(t.area_kind, 20),
unit_price_from: _os(t.unit_price_from), unit_price_to: _os(t.unit_price_to), price_from: _o16(t.price_from), price_to: _o16(t.price_to) })),
units: (Array.isArray(r.units) ? r.units : []).filter((u) => u && typeof u === 'object').slice(0, LIMITS.UNITS_MAX).map((u) => ({
code: _o10(u.code, 40), type: _o10(u.type, 60), bedrooms: _ol(u.bedrooms), area: _or(u.area), area_kind: _o10(u.area_kind, 20), price: _o16(u.price), unit_price: _os(u.unit_price),
floor: _o10(u.floor, 20), view: _o10(u.view, 80), status: _o10(u.status, 30) })).filter((u) => u.code || u.price || u.area),
plans: Array.isArray(r.plans) ? r.plans.slice(0, 12) : [],
payment_note: _o10(r.payment_note, 1500), handover_note: _o10(r.handover_note, 600), notes: _o10(r.notes, 1500),
injection: r.injection === true, confidence: _ol(r.confidence),
};
}
export function parseHandover(v) {
const f = fold(v);
if (!f) return null;
let _oh = f.match(/quy\s*(iv|i{1,3}|[1-4])\D{0,6}(20\d{2})/);
if (_oh) { const _ow = { i: 1, ii: 2, iii: 3, iv: 4 }[_oh[1]] || Number(_oh[1]); return `${_oh[2]}-${String(_ow * 3).padStart(2, '0')}`; }
_oh = f.match(/(20\d{2})\s*-\s*(\d{1,2})\b/);
if (_oh && +_oh[2] >= 1 && +_oh[2] <= 12) return `${_oh[1]}-${_oh[2].padStart(2, '0')}`;
_oh = f.match(/(\d{1,2})\s*(?:\/|\.|-|nam)\s*(20\d{2})/);
if (_oh && +_oh[1] >= 1 && +_oh[1] <= 12) return `${_oh[2]}-${_oh[1].padStart(2, '0')}`;
_oh = f.match(/\b(20\d{2})\b/);
return _oh ? `${_oh[1]}-12` : null;
}
const _o3 = [['soon', /sap mo ban|sap ra mat|chuan bi mo ban|soon/], ['done', /da ban giao|hoan thanh|done/], ['sale', /dang ban|mo ban|sale/]];
export function parseStatus(v) { const f = fold(v); for (const [k, _oy] of _o3) if (_oy.test(f)) return k; return null; }
const _o2 = { sale: 'Đang bán', soon: 'Sắp mở bán', done: 'Đã bàn giao', ask: 'Nhận bảng giá', low: 'Thấp tầng' };
const median = (a) => { const s = a.slice().sort((x, y) => x - y); const n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : null; };
export const unitPpm = (u) => u.unit_price || (u.price && u.area ? u.price / u.area / 1e6 : null);
export function validateExtraction(x) {
const _oo = [], add = (path, level, msg) => _oo.push({ path, level, msg });
const P = x.project || {};
const _ot = (v) => v >= 5 && v <= 2000;
if (P.price_from != null && !_ot(P.price_from)) add('project.price', 'error', `Đơn giá ${fmtNum(P.price_from, 1)} triệu/m² ngoài khoảng hợp lý 5–2.000.`);
if (P.price_to != null && !_ot(P.price_to)) add('project.price', 'error', `Đơn giá ${fmtNum(P.price_to, 1)} triệu/m² ngoài khoảng hợp lý 5–2.000.`);
if (P.price_from != null && P.price_to != null && P.price_to < P.price_from) add('project.price', 'error', 'Đơn giá cao nhỏ hơn đơn giá thấp.');
if (P.handover && !parseHandover(P.handover)) add('project.handover', 'warn', `Không đọc được thời điểm bàn giao "${P.handover}".`);
if (P.hdmb != null && (P.hdmb > 60)) add('project.hdmb', 'warn', `Số tháng đến ký HĐMB = ${fmtNum(P.hdmb)} – lạ.`);
const _o4 = (path, a, label) => {
if (a == null) return;
if (a < 5 || a > 5000) add(path, 'error', `${label}: diện tích ${fmtNum(a)} m² không hợp lý.`);
else if (a < 15 || a > 1000) add(path, 'warn', `${label}: diện tích ${fmtNum(a)} m² bất thường – kiểm lại.`);
};
(x.types || []).forEach((t, i) => {
const p = 'types.' + i, L = 'Loại ' + t.name;
_o4(p, t.area_from, L); _o4(p, t.area_to, L);
if (t.area_from != null && t.area_to != null && t.area_to < t.area_from) add(p, 'error', `${L}: diện tích lớn nhỏ hơn diện tích nhỏ.`);
if (t.bedrooms != null && (t.bedrooms < 0 || t.bedrooms > 10)) add(p, 'warn', `${L}: ${t.bedrooms} phòng ngủ – lạ.`);
for (const v of [t.unit_price_from, t.unit_price_to]) if (v != null && !_ot(v)) add(p, 'warn', `${L}: đơn giá ${fmtNum(v, 1)} triệu/m² bất thường.`);
if (t.price_from != null && t.price_to != null && t.price_to < t.price_from) add(p, 'warn', `${L}: giá cao nhỏ hơn giá thấp.`);
if (t.price_from != null && t.price_from < 1e8) add(p, 'warn', `${L}: tổng giá ${fmtNum(t.price_from / 1e6, 0)} triệu – quá thấp, có thể sai đơn vị.`);
});
const units = x.units || [];
const _ou = units.map(unitPpm).filter((v) => v > 0);
const _oj = median(_ou);
const _o11 = new Map();
units.forEach((u, i) => {
const p = 'units.' + i, L = 'Căn ' + (u.code || '#' + (i + 1));
_o4(p, u.area, L);
if (u.price != null && u.price < 1e8) add(p, 'warn', `${L}: giá ${fmtNum(u.price / 1e6, 0)} triệu – quá thấp, có thể sai đơn vị.`);
const v = unitPpm(u);
if (v != null && !_ot(v)) add(p, 'error', `${L}: đơn giá ${fmtNum(v, 1)} triệu/m² không hợp lý.`);
else if (v != null && _oj && _ou.length >= 4 && Math.abs(v - _oj) / _oj > 0.4) add(p, 'warn', `${L}: đơn giá ${fmtNum(v, 1)} triệu/m² lệch xa mức chung ${fmtNum(_oj, 1)}.`);
if (u.unit_price && u.price && u.area) {
const _o6 = u.price / u.area / 1e6;
if (Math.abs(_o6 - u.unit_price) / u.unit_price > 0.15) add(p, 'warn', `${L}: giá ÷ diện tích = ${fmtNum(_o6, 1)} triệu/m², khác đơn giá ghi ${fmtNum(u.unit_price, 1)}.`);
}
if (u.code) { if (_o11.has(u.code)) add(p, 'warn', `${L}: mã căn bị trùng.`); _o11.set(u.code, 1); }
});
const _oq = plansOf(x);
_oq.errors.forEach((_oh) => add('plans', 'warn', _oh));
checkPlans(_oq.plans).forEach((i) => add('plans', 'warn', (_oq.plans[i.plan] ? (_oq.plans[i.plan].name || 'Phương án ' + (i.plan + 1)) + ': ' : '') + i.msg));
if (x.injection) add('doc', 'warn', 'Tài liệu có câu ra lệnh cho AI – AI đã bỏ qua. Soát kỹ trước khi lưu.');
return _oo;
}
export function plansOf(x) {
const list = (x && Array.isArray(x.plans) ? x.plans : []).map((p) => ({ ...p,
discount: p.discount == null || p.discount === '' ? undefined : String(p.discount).includes('%') ? p.discount : p.discount + '%',
loan: p.loan == null || p.loan === '' ? undefined : p.loan }));
if (!list.length) return { plans: [], errors: [] };
const r = normalizePlans({ plans: list });
return { plans: r.plans, errors: r.errors };
}
const _o14 = (t) => {
const f = fold(t).replace(/\s+/g, '');
const _oh = f.match(/^(\d)(pn|n|phongngu|br|bed)?(\+|plus)?$/);
return _oh ? _oh[1] + 'n' + (_oh[3] ? '+' : '') : f.replace(/phongngu|pn/g, 'n');
};
const _ox = (a, unit) => (a ? (a[0] === a[1] ? fmtNum(a[0]) : `${fmtNum(a[0])}–${fmtNum(a[1])}`) + unit : '—');
const _ov = (p) => (p ? `${fmtNum(p[0], 1)}–${fmtNum(p[1], 1)} triệu/m²` : '—');
const _of = (issues, prefix) => issues.filter((i) => i.path === prefix || i.path.startsWith(prefix + '.'));
const _ok = (n) => (n >= 1e9 ? fmtNum(n / 1e9, 2) + ' tỷ' : fmtNum(n / 1e6, 0) + ' triệu');
const _o0 = {
name: 'Tên dự án', dev: 'Chủ đầu tư', loc: 'Vị trí', status: 'Trạng thái', handover: 'Bàn giao', price: 'Giá niêm yết (triệu/m²)', hdmb: 'Số tháng đến ký HĐMB',
legal: 'Pháp lý', scale: 'Quy mô', amenities: 'Tiện ích', payment_note: 'Tiến độ thanh toán (ghi chú)', unit_prices: 'Bảng giá theo căn', plans: 'Chính sách thanh toán',
};
export const FIELD_LABEL = _o0;
export function buildRows(project, x, issues = validateExtraction(x)) {
const P = x.project || {}, cur = project || {}, rows = [];
const push = (key, field, oldTxt, newTxt, value, iss = [], extra = {}) => {
const changed = oldTxt !== newTxt;
if (!changed && !extra.keep) return;
const blocked = iss.some((i) => i.level === 'error');
const _oz = { key, field, label: extra.label || _o0[field] || field, old: oldTxt || '—', new: newTxt, value, issues: iss, changed, blocked, checked: changed && !blocked, ...extra };
delete _oz.keep;
rows.push(_oz);
return _oz;
};
for (const f of ['name', 'dev', 'loc', 'legal', 'scale', 'amenities']) {
if (!P[f]) continue;
if (f === 'name' && project) { if (fold(P.name) !== fold(cur.name)) push('name', 'name', cur.name || '', P.name, P.name, [{ path: 'project.name', level: 'warn', msg: 'Tên trong file khác tên dự án – kiểm đúng dự án chưa.' }], { checked: false }); continue; }
push(f, f, _o10(cur[f], 600), P[f], P[f]);
}
if (P.status) { const _o13 = parseStatus(P.status); if (_o13) push('status', 'status', _o2[cur.status] || '', _o2[_o13], _o13); }
if (P.handover) {
const ym = parseHandover(P.handover), iss = _of(issues, 'project.handover');
if (ym) push('handover', 'handover', cur.handover ? ymLabel(cur.handover) : '', ymLabel(ym), ym, iss);
}
if (P.hdmb) push('hdmb', 'hdmb', cur.hdmb ? String(cur.hdmb) : '', String(fmtNum(P.hdmb)), Math.round(P.hdmb), _of(issues, 'project.hdmb'));
let price = null, priceFrom = '';
if (P.price_from || P.price_to) { price = [P.price_from || P.price_to, P.price_to || P.price_from]; priceFrom = ''; }
else {
const ts = (x.types || []).flatMap((t) => [t.unit_price_from, t.unit_price_to]).filter((v) => v > 0);
const _o15 = (x.units || []).map(unitPpm).filter((v) => v >= 5 && v <= 2000);
const pool = ts.length ? ts : _o15;
if (pool.length) { price = [Math.min(...pool), Math.max(...pool)]; priceFrom = ts.length ? ' (tính từ loại căn)' : ' (tính từ bảng giá căn)'; }
}
if (price) { price = price.map((v) => Math.round(v * 10) / 10); push('price', 'price', _ov(cur.price), _ov(price) + priceFrom, price, _of(issues, 'project.price')); }
const _o7 = cur.types || [];
(x.types || []).forEach((t, i) => {
const old = _o7.find((c) => _o14(c.n) === _o14(t.name) || (t.bedrooms != null && _o14(c.n) === t.bedrooms + 'n'));
const a = t.area_from || t.area_to ? [t.area_from || t.area_to, t.area_to || t.area_from] : null;
const extraTxt = [t.bedrooms != null ? `${fmtNum(t.bedrooms)} PN` : '', t.unit_price_from ? `${_ox([t.unit_price_from, t.unit_price_to || t.unit_price_from], ' tr/m²')}` : '',
t.price_from ? `${_ok(t.price_from)}${t.price_to && t.price_to !== t.price_from ? '–' + _ok(t.price_to) : ''}` : ''].filter(Boolean).join(' · ');
const name = old ? old.n : t.name;
const value = a ? { n: name, a } : { n: name, ask: true };
if (old && !a) return;
push('type:' + i, 'types', old ? (old.ask ? 'liên hệ' : _ox(old.a, ' m²')) : '', (a ? _ox(a, ' m²') : 'liên hệ') + (extraTxt ? ' · ' + extraTxt : ''), value,
_of(issues, 'types.' + i), { label: 'Loại căn ' + name + (old ? '' : ' (mới)'), type: t });
});
if ((x.units || []).length) {
const _o15 = x.units, iss = issues.filter((i) => i.path.startsWith('units'));
const v = _o15.map(unitPpm).filter((n) => n > 0);
const _on = Array.isArray(cur.unit_prices) ? cur.unit_prices.length : 0;
const r = push('unit_prices', 'unit_prices', _on ? `${_on} căn` : '', `${_o15.length} căn${v.length ? ` · ${fmtNum(Math.min(...v), 1)}–${fmtNum(Math.max(...v), 1)} triệu/m²` : ''}${iss.length ? ` · ${iss.length} ⚠️` : ''}`,
_o15.map(compactUnit), iss.filter((i) => i.level === 'warn'), { units: _o15, unitIssues: iss, keep: true });
r.issues = iss.length ? [{ path: 'units', level: 'warn', msg: `${iss.length} căn có số bất thường (đánh ⚠️ trong bảng) – căn có lỗi đỏ sẽ không được lưu.` }] : [];
}
const _oq = plansOf(x);
if (_oq.plans.length) {
push('plans', 'plans', '', `${_oq.plans.length} phương án: ${_oq.plans.map((p) => p.name || 'Không tên').join(', ')} → lưu NHÁP (không tự áp dụng)`, _oq.plans, _of(issues, 'plans').map((i) => ({ ...i, level: 'warn' })));
}
if (x.payment_note) push('payment_note', 'payment_note', _o10(cur.payment_note, 1500), x.payment_note, x.payment_note);
return rows;
}
export function compactUnit(u) {
const _om = { c: u.code || '', t: u.type || '', a: u.area || null, p: u.price ? Math.round(u.price) : null, u: u.unit_price ? Math.round(u.unit_price * 100) / 100 : null };
if (u.bedrooms != null) _om.b = u.bedrooms;
if (u.area_kind) _om.k = u.area_kind;
if (u.floor) _om.f = u.floor;
if (u.view) _om.v = u.view;
if (u.status) _om.s = u.status;
return _om;
}
export function addDoc(data, doc) {
const _o9 = { ...(data && typeof data === 'object' ? data : {}) };
const list = (Array.isArray(_o9.docs) ? _o9.docs : []).filter((x) => x && x.drive_id !== doc.drive_id);
_o9.docs = [{ name: _o10(doc.name, 120), drive_id: doc.drive_id, mime: doc.mime || '', size: Number(doc.size) || 0, at: doc.at || Date.now(), by: doc.by || '' }, ...list].slice(0, 50);
return _o9;
}
export function applyRows(data, rows, { file = {}, at = Date.now(), user = '' } = {}) {
const _o9 = { ...(data && typeof data === 'object' ? data : {}) };
const _o12 = { ...(_o9.sources && typeof _o9.sources === 'object' ? _o9.sources : {}) };
const _oi = (field) => { _o12[field] = { file: _o10(file.name, 120), drive_id: file.drive_id || '', at, by: 'file', user: _o10(user, 80) }; };
let plans = null, dropped = 0;
const saved = [];
let types = Array.isArray(_o9.types) ? _o9.types.map((t) => ({ ...t })) : null;
for (const r of rows) {
if (!r.checked || r.blocked) continue;
if (r.field === 'types') {
if (!types) types = [];
const i = types.findIndex((t) => _o14(t.n ?? t.name) === _o14(r.value.n));
if (i >= 0) types[i] = { ...types[i], ...r.value, ...(r.value.ask ? {} : { ask: undefined }) }; else types.push(r.value);
types = types.map((t) => { const _om = { ...t }; if (_om.ask === undefined) delete _om.ask; return _om; });
_oi('types'); saved.push('types');
continue;
}
if (r.field === 'plans') { plans = r.value; saved.push('plans'); continue; }
if (r.field === 'unit_prices') {
const _o5 = new Set((r.unitIssues || []).filter((i) => i.level === 'error').map((i) => Number(i.path.split('.')[1])));
_o9.unit_prices = r.value.filter((_, i) => !_o5.has(i));
dropped += _o5.size;
_o9.unit_prices_at = at;
} else _o9[r.field] = r.value;
_oi(r.field); saved.push(r.field);
}
if (types) _o9.types = types;
_o9.sources = _o12;
return { data: _o9, plans, saved: [...new Set(saved)], dropped };
}
export function fitData(data, max = LIMITS.DATA_MAX) {
const _o9 = { ...data };
let trimmed = 0;
const _og = () => JSON.stringify(_o9).length;
if (_og() <= max) return { data: _o9, trimmed };
if (Array.isArray(_o9.unit_prices)) {
_o9.unit_prices = _o9.unit_prices.slice();
while (_o9.unit_prices.length && _og() > max) { const _o8 = Math.max(1, Math.ceil(_o9.unit_prices.length * 0.1)); _o9.unit_prices.splice(-_o8, _o8); trimmed += _o8; }
}
if (Array.isArray(_o9.docs)) { _o9.docs = _o9.docs.slice(); while (_o9.docs.length > 5 && _og() > max) _o9.docs.pop(); }
return { data: _o9, trimmed };
}
export function sourceText(_o12) {
if (!_o12 || typeof _o12 !== 'object') return '';
const _ob = _o12.at ? new Date(_o12.at) : null;
const _oa = _ob ? `${String(_ob.getDate()).padStart(2, '0')}/${String(_ob.getMonth() + 1).padStart(2, '0')}/${_ob.getFullYear()}` : '';
const _o17 = _o12.by === 'file' ? 'file ' + (_o12.file || '') : _o12.url ? (_o12.title || _o12.url) : (_o12.by || '');
return [_o17, _oa].filter(Boolean).join(' · ');
}
export function newProjectId(name, existing = []) {
const base = fold(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || 'du-an';
let _oe = base, k = 2;
const ids = new Set(existing.map(String));
while (ids.has(_oe)) _oe = base + '-' + k++;
return _oe;
}
export { typesToText };

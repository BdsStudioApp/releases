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
const _od = (name.match(/\.([a-z0-9]+)$/) || [])[1] || '';
const by = (k) => ({ kind: k, mime: MIME[k], group: ['xlsx', 'docx', 'csv'].includes(k) ? 'text' : 'ai' });
if (_od === 'pdf' || type === 'application/pdf') return by('pdf');
if (_od === 'jpg' || _od === 'jpeg' || type === 'image/jpeg') return by('jpg');
if (_od === 'png' || type === 'image/png') return by('png');
if (_od === 'webp' || type === 'image/webp') return by('webp');
if (_od === 'heic' || _od === 'heif' || /image\/hei[cf]/.test(type)) return by('heic');
if (_od === 'xlsx' || type === MIME.xlsx) return by('xlsx');
if (_od === 'docx' || type === MIME.docx) return by('docx');
if (_od === 'csv' || type === 'text/csv') return by('csv');
if (_od === 'xls' || _od === 'xlsm' || type === 'application/vnd.ms-excel') return { kind: 'xls', legacy: true };
if (_od === 'doc' || type === 'application/msword') return { kind: 'doc', legacy: true };
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
const _o0 = 1 << 16;
for (let i = 0; i < u.length; i += _o0) {
s = s.slice(-16) + String.fromCharCode.apply(null, u.subarray(i, i + _o0));
const _oi = s.match(/\/Type\s*\/Page(?![a-zA-Z])/g);
if (_oi) n += _oi.length;
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
const _o2 = [/ignore (all |any )?(previous|prior|above) (instructions|prompts?)/i, /disregard (the )?(previous|above|system)/i, /you are now\b/i, /system prompt/i,
/bo qua (moi |tat ca |cac )?(huong dan|chi dan|lenh|yeu cau)( truoc| tren)?/, /(hay|phai) tra loi (rang|la)\b/, /dat gia (thanh|la) \d/, /\bjailbreak\b/i, /<\s*script\b/i];
export function suspiciousText(text) {
const t = String(text || ''), f = fold(t);
const _oe = [];
for (const _oz of _o2) { const _oi = _oz.exec(_oz.flags.includes('i') ? t : f); if (_oi) _oe.push(_oi[0].slice(0, 60)); }
return _oe;
}
export async function readOfficeText(kind, bytes, opts = {}) {
const O = opts.ooxml || await import('../../../shared/ooxml.js');
const u = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
const r = await O.parseFile(u, { name: opts.name || ('file.' + kind), maxLength: LIMITS.TEXT_MAX });
const text = String((r && r.text) || '').replace(/\r\n?/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
return { text, kind: r && r.kind, truncated: /…\[đã cắt bớt \d+ dòng\]$/.test(text) || !!(r && r.data && Array.isArray(r.data.sheets) && r.data.sheets.some((x) => x.truncated)) };
}
const _om = (v) => { const n = parseNum(v); return isFinite(n) ? n : null; };
const _os = (v) => { const n = _om(v); return n != null && n > 0 ? n : null; };
const _ot = (v) => { const n = _os(v); return n == null ? null : n >= 1e5 ? n / 1e6 : n; };
const _o17 = (v) => { const n = _os(v); return n == null ? null : n < 1000 ? n * 1e9 : n < 1e6 ? n * 1e6 : n; };
const _o11 = (v, max = 300) => (v == null || typeof v === 'object' ? '' : String(v).trim().slice(0, max));
export function normalizeExtraction(raw) {
const r = raw && typeof raw === 'object' ? (raw.extraction && typeof raw.extraction === 'object' ? raw.extraction : raw) : {};
const _oq = r.project && typeof r.project === 'object' ? r.project : {};
return {
project: { name: _o11(_oq.name, 200), dev: _o11(_oq.dev, 200), loc: _o11(_oq.loc, 300), status: _o11(_oq.status, 60), handover: _o11(_oq.handover, 40), hdmb: _os(_oq.hdmb),
legal: _o11(_oq.legal, 600), scale: _o11(_oq.scale, 300), amenities: _o11(_oq.amenities, 600), price_from: _ot(_oq.price_from), price_to: _ot(_oq.price_to) },
types: (Array.isArray(r.types) ? r.types : []).filter((t) => t && typeof t === 'object' && _o11(t.name)).slice(0, 30).map((t) => ({
name: _o11(t.name, 60), bedrooms: _om(t.bedrooms), area_from: _os(t.area_from), area_to: _os(t.area_to), area_kind: _o11(t.area_kind, 20),
unit_price_from: _ot(t.unit_price_from), unit_price_to: _ot(t.unit_price_to), price_from: _o17(t.price_from), price_to: _o17(t.price_to) })),
units: (Array.isArray(r.units) ? r.units : []).filter((u) => u && typeof u === 'object').slice(0, LIMITS.UNITS_MAX).map((u) => ({
code: _o11(u.code, 40), type: _o11(u.type, 60), bedrooms: _om(u.bedrooms), area: _os(u.area), area_kind: _o11(u.area_kind, 20), price: _o17(u.price), unit_price: _ot(u.unit_price),
floor: _o11(u.floor, 20), view: _o11(u.view, 80), status: _o11(u.status, 30) })).filter((u) => u.code || u.price || u.area),
plans: Array.isArray(r.plans) ? r.plans.slice(0, 12) : [],
payment_note: _o11(r.payment_note, 1500), handover_note: _o11(r.handover_note, 600), notes: _o11(r.notes, 1500),
injection: r.injection === true, confidence: _om(r.confidence),
};
}
export function parseHandover(v) {
const f = fold(v);
if (!f) return null;
let _oi = f.match(/quy\s*(iv|i{1,3}|[1-4])\D{0,6}(20\d{2})/);
if (_oi) { const _ox = { i: 1, ii: 2, iii: 3, iv: 4 }[_oi[1]] || Number(_oi[1]); return `${_oi[2]}-${String(_ox * 3).padStart(2, '0')}`; }
_oi = f.match(/(20\d{2})\s*-\s*(\d{1,2})\b/);
if (_oi && +_oi[2] >= 1 && +_oi[2] <= 12) return `${_oi[1]}-${_oi[2].padStart(2, '0')}`;
_oi = f.match(/(\d{1,2})\s*(?:\/|\.|-|nam)\s*(20\d{2})/);
if (_oi && +_oi[1] >= 1 && +_oi[1] <= 12) return `${_oi[2]}-${_oi[1].padStart(2, '0')}`;
_oi = f.match(/\b(20\d{2})\b/);
return _oi ? `${_oi[1]}-12` : null;
}
const _o4 = [['soon', /sap mo ban|sap ra mat|chuan bi mo ban|soon/], ['done', /da ban giao|hoan thanh|done/], ['sale', /dang ban|mo ban|sale/]];
export function parseStatus(v) { const f = fold(v); for (const [k, _oz] of _o4) if (_oz.test(f)) return k; return null; }
const _o3 = { sale: 'Đang bán', soon: 'Sắp mở bán', done: 'Đã bàn giao', ask: 'Nhận bảng giá', low: 'Thấp tầng' };
const median = (a) => { const s = a.slice().sort((x, y) => x - y); const n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : null; };
export const unitPpm = (u) => u.unit_price || (u.price && u.area ? u.price / u.area / 1e6 : null);
export function validateExtraction(x) {
const _op = [], add = (path, level, msg) => _op.push({ path, level, msg });
const P = x.project || {};
const _ou = (v) => v >= 5 && v <= 2000;
if (P.price_from != null && !_ou(P.price_from)) add('project.price', 'error', `Đơn giá ${fmtNum(P.price_from, 1)} triệu/m² ngoài khoảng hợp lý 5–2.000.`);
if (P.price_to != null && !_ou(P.price_to)) add('project.price', 'error', `Đơn giá ${fmtNum(P.price_to, 1)} triệu/m² ngoài khoảng hợp lý 5–2.000.`);
if (P.price_from != null && P.price_to != null && P.price_to < P.price_from) add('project.price', 'error', 'Đơn giá cao nhỏ hơn đơn giá thấp.');
if (P.handover && !parseHandover(P.handover)) add('project.handover', 'warn', `Không đọc được thời điểm bàn giao "${P.handover}".`);
if (P.hdmb != null && (P.hdmb > 60)) add('project.hdmb', 'warn', `Số tháng đến ký HĐMB = ${fmtNum(P.hdmb)} – lạ.`);
const _o5 = (path, a, label) => {
if (a == null) return;
if (a < 5 || a > 5000) add(path, 'error', `${label}: diện tích ${fmtNum(a)} m² không hợp lý.`);
else if (a < 15 || a > 1000) add(path, 'warn', `${label}: diện tích ${fmtNum(a)} m² bất thường – kiểm lại.`);
};
(x.types || []).forEach((t, i) => {
const p = 'types.' + i, L = 'Loại ' + t.name;
_o5(p, t.area_from, L); _o5(p, t.area_to, L);
if (t.area_from != null && t.area_to != null && t.area_to < t.area_from) add(p, 'error', `${L}: diện tích lớn nhỏ hơn diện tích nhỏ.`);
if (t.bedrooms != null && (t.bedrooms < 0 || t.bedrooms > 10)) add(p, 'warn', `${L}: ${t.bedrooms} phòng ngủ – lạ.`);
for (const v of [t.unit_price_from, t.unit_price_to]) if (v != null && !_ou(v)) add(p, 'warn', `${L}: đơn giá ${fmtNum(v, 1)} triệu/m² bất thường.`);
if (t.price_from != null && t.price_to != null && t.price_to < t.price_from) add(p, 'warn', `${L}: giá cao nhỏ hơn giá thấp.`);
if (t.price_from != null && t.price_from < 1e8) add(p, 'warn', `${L}: tổng giá ${fmtNum(t.price_from / 1e6, 0)} triệu – quá thấp, có thể sai đơn vị.`);
});
const units = x.units || [];
const _ov = units.map(unitPpm).filter((v) => v > 0);
const _ok = median(_ov);
const _o12 = new Map();
units.forEach((u, i) => {
const p = 'units.' + i, L = 'Căn ' + (u.code || '#' + (i + 1));
_o5(p, u.area, L);
if (u.price != null && u.price < 1e8) add(p, 'warn', `${L}: giá ${fmtNum(u.price / 1e6, 0)} triệu – quá thấp, có thể sai đơn vị.`);
const v = unitPpm(u);
if (v != null && !_ou(v)) add(p, 'error', `${L}: đơn giá ${fmtNum(v, 1)} triệu/m² không hợp lý.`);
else if (v != null && _ok && _ov.length >= 4 && Math.abs(v - _ok) / _ok > 0.4) add(p, 'warn', `${L}: đơn giá ${fmtNum(v, 1)} triệu/m² lệch xa mức chung ${fmtNum(_ok, 1)}.`);
if (u.unit_price && u.price && u.area) {
const _o7 = u.price / u.area / 1e6;
if (Math.abs(_o7 - u.unit_price) / u.unit_price > 0.15) add(p, 'warn', `${L}: giá ÷ diện tích = ${fmtNum(_o7, 1)} triệu/m², khác đơn giá ghi ${fmtNum(u.unit_price, 1)}.`);
}
if (u.code) { if (_o12.has(u.code)) add(p, 'warn', `${L}: mã căn bị trùng.`); _o12.set(u.code, 1); }
});
const _or = plansOf(x);
_or.errors.forEach((_oi) => add('plans', 'warn', _oi));
checkPlans(_or.plans).forEach((i) => add('plans', 'warn', (_or.plans[i.plan] ? (_or.plans[i.plan].name || 'Phương án ' + (i.plan + 1)) + ': ' : '') + i.msg));
if (x.injection) add('doc', 'warn', 'Tài liệu có câu ra lệnh cho AI – AI đã bỏ qua. Soát kỹ trước khi lưu.');
return _op;
}
export function plansOf(x) {
const list = (x && Array.isArray(x.plans) ? x.plans : []).map((p) => ({ ...p,
discount: p.discount == null || p.discount === '' ? undefined : String(p.discount).includes('%') ? p.discount : p.discount + '%',
loan: p.loan == null || p.loan === '' ? undefined : p.loan }));
if (!list.length) return { plans: [], errors: [] };
const r = normalizePlans({ plans: list });
return { plans: r.plans, errors: r.errors };
}
const _o15 = (t) => {
const f = fold(t).replace(/\s+/g, '');
const _oi = f.match(/^(\d)(pn|n|phongngu|br|bed)?(\+|plus)?$/);
return _oi ? _oi[1] + 'n' + (_oi[3] ? '+' : '') : f.replace(/phongngu|pn/g, 'n');
};
const _oy = (a, unit) => (a ? (a[0] === a[1] ? fmtNum(a[0]) : `${fmtNum(a[0])}–${fmtNum(a[1])}`) + unit : '—');
const _ow = (p) => (p ? `${fmtNum(p[0], 1)}–${fmtNum(p[1], 1)} triệu/m²` : '—');
const _og = (issues, prefix) => issues.filter((i) => i.path === prefix || i.path.startsWith(prefix + '.'));
const _ol = (n) => (n >= 1e9 ? fmtNum(n / 1e9, 2) + ' tỷ' : fmtNum(n / 1e6, 0) + ' triệu');
const _o1 = {
name: 'Tên dự án', dev: 'Chủ đầu tư', loc: 'Vị trí', status: 'Trạng thái', handover: 'Bàn giao', price: 'Giá niêm yết (triệu/m²)', hdmb: 'Số tháng đến ký HĐMB',
legal: 'Pháp lý', scale: 'Quy mô', amenities: 'Tiện ích', payment_note: 'Tiến độ thanh toán (ghi chú)', unit_prices: 'Bảng giá theo căn', plans: 'Chính sách thanh toán',
};
export const FIELD_LABEL = _o1;
export function buildRows(project, x, issues = validateExtraction(x)) {
const P = x.project || {}, cur = project || {}, rows = [];
const push = (key, field, oldTxt, newTxt, value, iss = [], extra = {}) => {
const changed = oldTxt !== newTxt;
if (!changed && !extra.keep) return;
const blocked = iss.some((i) => i.level === 'error');
const _o10 = { key, field, label: extra.label || _o1[field] || field, old: oldTxt || '—', new: newTxt, value, issues: iss, changed, blocked, checked: changed && !blocked, ...extra };
delete _o10.keep;
rows.push(_o10);
return _o10;
};
for (const f of ['name', 'dev', 'loc', 'legal', 'scale', 'amenities']) {
if (!P[f]) continue;
if (f === 'name' && project) { if (fold(P.name) !== fold(cur.name)) push('name', 'name', cur.name || '', P.name, P.name, [{ path: 'project.name', level: 'warn', msg: 'Tên trong file khác tên dự án – kiểm đúng dự án chưa.' }], { checked: false }); continue; }
push(f, f, _o11(cur[f], 600), P[f], P[f]);
}
if (P.status) { const _o14 = parseStatus(P.status); if (_o14) push('status', 'status', _o3[cur.status] || '', _o3[_o14], _o14); }
if (P.handover) {
const ym = parseHandover(P.handover), iss = _og(issues, 'project.handover');
if (ym) push('handover', 'handover', cur.handover ? ymLabel(cur.handover) : '', ymLabel(ym), ym, iss);
}
if (P.hdmb) push('hdmb', 'hdmb', cur.hdmb ? String(cur.hdmb) : '', String(fmtNum(P.hdmb)), Math.round(P.hdmb), _og(issues, 'project.hdmb'));
let price = null, priceFrom = '';
if (P.price_from || P.price_to) { price = [P.price_from || P.price_to, P.price_to || P.price_from]; priceFrom = ''; }
else {
const ts = (x.types || []).flatMap((t) => [t.unit_price_from, t.unit_price_to]).filter((v) => v > 0);
const _o16 = (x.units || []).map(unitPpm).filter((v) => v >= 5 && v <= 2000);
const pool = ts.length ? ts : _o16;
if (pool.length) { price = [Math.min(...pool), Math.max(...pool)]; priceFrom = ts.length ? ' (tính từ loại căn)' : ' (tính từ bảng giá căn)'; }
}
if (price) { price = price.map((v) => Math.round(v * 10) / 10); push('price', 'price', _ow(cur.price), _ow(price) + priceFrom, price, _og(issues, 'project.price')); }
const _o8 = cur.types || [];
(x.types || []).forEach((t, i) => {
const old = _o8.find((c) => _o15(c.n) === _o15(t.name) || (t.bedrooms != null && _o15(c.n) === t.bedrooms + 'n'));
const a = t.area_from || t.area_to ? [t.area_from || t.area_to, t.area_to || t.area_from] : null;
const extraTxt = [t.bedrooms != null ? `${fmtNum(t.bedrooms)} PN` : '', t.unit_price_from ? `${_oy([t.unit_price_from, t.unit_price_to || t.unit_price_from], ' tr/m²')}` : '',
t.price_from ? `${_ol(t.price_from)}${t.price_to && t.price_to !== t.price_from ? '–' + _ol(t.price_to) : ''}` : ''].filter(Boolean).join(' · ');
const name = old ? old.n : t.name;
const value = a ? { n: name, a } : { n: name, ask: true };
if (old && !a) return;
push('type:' + i, 'types', old ? (old.ask ? 'liên hệ' : _oy(old.a, ' m²')) : '', (a ? _oy(a, ' m²') : 'liên hệ') + (extraTxt ? ' · ' + extraTxt : ''), value,
_og(issues, 'types.' + i), { label: 'Loại căn ' + name + (old ? '' : ' (mới)'), type: t });
});
if ((x.units || []).length) {
const _o16 = x.units, iss = issues.filter((i) => i.path.startsWith('units'));
const v = _o16.map(unitPpm).filter((n) => n > 0);
const _oo = Array.isArray(cur.unit_prices) ? cur.unit_prices.length : 0;
const r = push('unit_prices', 'unit_prices', _oo ? `${_oo} căn` : '', `${_o16.length} căn${v.length ? ` · ${fmtNum(Math.min(...v), 1)}–${fmtNum(Math.max(...v), 1)} triệu/m²` : ''}${iss.length ? ` · ${iss.length} ⚠️` : ''}`,
_o16.map(compactUnit), iss.filter((i) => i.level === 'warn'), { units: _o16, unitIssues: iss, keep: true });
r.issues = iss.length ? [{ path: 'units', level: 'warn', msg: `${iss.length} căn có số bất thường (đánh ⚠️ trong bảng) – căn có lỗi đỏ sẽ không được lưu.` }] : [];
}
const _or = plansOf(x);
if (_or.plans.length) {
push('plans', 'plans', '', `${_or.plans.length} phương án: ${_or.plans.map((p) => p.name || 'Không tên').join(', ')} → lưu NHÁP, duyệt ở "Cập nhật chính sách"`, _or.plans, _og(issues, 'plans').map((i) => ({ ...i, level: 'warn' })));
}
if (x.payment_note) push('payment_note', 'payment_note', _o11(cur.payment_note, 1500), x.payment_note, x.payment_note);
return rows;
}
export function compactUnit(u) {
const _on = { c: u.code || '', t: u.type || '', a: u.area || null, p: u.price ? Math.round(u.price) : null, u: u.unit_price ? Math.round(u.unit_price * 100) / 100 : null };
if (u.bedrooms != null) _on.b = u.bedrooms;
if (u.area_kind) _on.k = u.area_kind;
if (u.floor) _on.f = u.floor;
if (u.view) _on.v = u.view;
if (u.status) _on.s = u.status;
return _on;
}
export function addDoc(data, doc) {
const _oa = { ...(data && typeof data === 'object' ? data : {}) };
const list = (Array.isArray(_oa.docs) ? _oa.docs : []).filter((x) => x && x.drive_id !== doc.drive_id);
_oa.docs = [{ name: _o11(doc.name, 120), drive_id: doc.drive_id, mime: doc.mime || '', size: Number(doc.size) || 0, at: doc.at || Date.now(), by: doc.by || '' }, ...list].slice(0, 50);
return _oa;
}
export function applyRows(data, rows, { file = {}, at = Date.now(), user = '' } = {}) {
const _oa = { ...(data && typeof data === 'object' ? data : {}) };
const _o13 = { ...(_oa.sources && typeof _oa.sources === 'object' ? _oa.sources : {}) };
const _oj = (field) => { _o13[field] = { file: _o11(file.name, 120), drive_id: file.drive_id || '', at, by: 'file', user: _o11(user, 80) }; };
let plans = null, dropped = 0;
const saved = [];
let types = Array.isArray(_oa.types) ? _oa.types.map((t) => ({ ...t })) : null;
for (const r of rows) {
if (!r.checked || r.blocked) continue;
if (r.field === 'types') {
if (!types) types = [];
const i = types.findIndex((t) => _o15(t.n ?? t.name) === _o15(r.value.n));
if (i >= 0) types[i] = { ...types[i], ...r.value, ...(r.value.ask ? {} : { ask: undefined }) }; else types.push(r.value);
types = types.map((t) => { const _on = { ...t }; if (_on.ask === undefined) delete _on.ask; return _on; });
_oj('types'); saved.push('types');
continue;
}
if (r.field === 'plans') { plans = r.value; saved.push('plans'); continue; }
if (r.field === 'unit_prices') {
const _o6 = new Set((r.unitIssues || []).filter((i) => i.level === 'error').map((i) => Number(i.path.split('.')[1])));
_oa.unit_prices = r.value.filter((_, i) => !_o6.has(i));
dropped += _o6.size;
_oa.unit_prices_at = at;
} else _oa[r.field] = r.value;
_oj(r.field); saved.push(r.field);
}
if (types) _oa.types = types;
_oa.sources = _o13;
return { data: _oa, plans, saved: [...new Set(saved)], dropped };
}
export function fitData(data, max = LIMITS.DATA_MAX) {
const _oa = { ...data };
let trimmed = 0;
const _oh = () => JSON.stringify(_oa).length;
if (_oh() <= max) return { data: _oa, trimmed };
if (Array.isArray(_oa.unit_prices)) {
_oa.unit_prices = _oa.unit_prices.slice();
while (_oa.unit_prices.length && _oh() > max) { const _o9 = Math.max(1, Math.ceil(_oa.unit_prices.length * 0.1)); _oa.unit_prices.splice(-_o9, _o9); trimmed += _o9; }
}
if (Array.isArray(_oa.docs)) { _oa.docs = _oa.docs.slice(); while (_oa.docs.length > 5 && _oh() > max) _oa.docs.pop(); }
return { data: _oa, trimmed };
}
export function sourceText(_o13) {
if (!_o13 || typeof _o13 !== 'object') return '';
const _oc = _o13.at ? new Date(_o13.at) : null;
const _ob = _oc ? `${String(_oc.getDate()).padStart(2, '0')}/${String(_oc.getMonth() + 1).padStart(2, '0')}/${_oc.getFullYear()}` : '';
const _o18 = _o13.by === 'file' ? 'file ' + (_o13.file || '') : _o13.url ? (_o13.title || _o13.url) : (_o13.by || '');
return [_o18, _ob].filter(Boolean).join(' · ');
}
export function newProjectId(name, existing = []) {
const base = fold(name).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 24) || 'du-an';
let _of = base, k = 2;
const ids = new Set(existing.map(String));
while (ids.has(_of)) _of = base + '-' + k++;
return _of;
}
export { typesToText };

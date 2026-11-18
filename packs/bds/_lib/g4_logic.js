import { strip, parseData, parseMoney, normPhone, DAY } from './crm.js';
export const PACK = 'source';
export const KIND = { partner: 'g4_partner', listing: 'g4_listing', ref: 'g4_priceref', booking: 'g4_booking', site: 'g4_sitelog' };
export const KINDS = Object.values(KIND);
export const PARTNER_ROLES = [
['admin_du_an', 'Admin dự án'], ['san_f1', 'Sàn F1'], ['san_f2', 'Sàn F2'], ['sale_bds', 'Sale BĐS'], ['tin_dung', 'Cán bộ tín dụng'],
['sale_ngan_hang', 'Sale ngân hàng'], ['cong_chung', 'Công chứng'], ['chu_nha', 'Chủ nhà'], ['khac', 'Khác'],
];
export const CONTACT_TYPES = [['call', 'Gọi'], ['zalo', 'Zalo'], ['meeting', 'Gặp'], ['note', 'Ghi chú']];
export const DEALS = [['chuyen_nhuong', 'Chuyển nhượng'], ['cho_thue', 'Cho thuê']];
export const LISTING_STATUS = [['dang_chao', 'Đang chào'], ['giu_cho', 'Đang giữ chỗ'], ['da_chot', 'Đã chốt'], ['tam_dung', 'Tạm dừng'], ['luu_tru', 'Lưu trữ']];
export const COMMISSION_TYPES = [['pct', '% giá'], ['amount', 'Số tiền'], ['months', 'Số tháng thuê']];
export const PARTNER_STATUS = [['dang_hop_tac', 'Đang hợp tác'], ['luu_tru', 'Lưu trữ']];
export const LEGAL_ITEMS = [
{ id: 'giay_to', title: 'Sổ hồng (Giấy chứng nhận) / HĐMB', hint: 'Xem bản gốc Giấy chứng nhận quyền sử dụng đất, quyền sở hữu tài sản gắn liền với đất (sổ hồng/sổ đỏ – sổ cấp trước 01/8/2024 vẫn còn giá trị), đúng tên người bán. Căn chưa có sổ: HĐMB + phụ lục + phiếu thu/xác nhận đã đóng tiền của chủ đầu tư.' },
{ id: 'the_chap', title: 'Thế chấp ngân hàng', hint: 'Căn có đang thế chấp không, ngân hàng nào, còn nợ bao nhiêu; giải chấp trước hay lúc công chứng.' },
{ id: 'quy_hoach', title: 'Quy hoạch', hint: 'Tra trên cổng thông tin quy hoạch chính thức của tỉnh/thành; lưu ảnh hoặc link kết quả tra cứu.' },
{ id: 'thue_phi', title: 'Thuế, phí', hint: 'Thuế thu nhập cá nhân (2% giá chuyển nhượng), lệ phí trước bạ (0,5%), phí công chứng, phí chuyển nhượng HĐMB: hai bên thoả thuận ai chịu và đã tính ra số tiền chưa.' },
{ id: 'tranh_chap', title: 'Tranh chấp, ngăn chặn', hint: 'Nhờ văn phòng công chứng tra dữ liệu ngăn chặn; xin thông tin tại Văn phòng/Chi nhánh đăng ký đất đai (thế chấp, kê biên); hỏi UBND xã/phường nơi có nhà xem có đơn tranh chấp không. Đang tranh chấp, bị kê biên thì chưa được chuyển nhượng (Luật Đất đai 2024, Điều 45).' },
{ id: 'dong_so_huu', title: 'Người cùng sở hữu', hint: 'Vợ/chồng hoặc người đứng tên chung: đủ người ký, hoặc có văn bản đồng ý.' },
{ id: 'cdt_dong_y', title: 'Chủ đầu tư xác nhận chuyển nhượng', hint: 'Căn chưa có sổ: chỉ được chuyển nhượng HĐMB khi chủ đầu tư CHƯA nộp hồ sơ cấp sổ cho căn này, không tranh chấp, không kê biên, không thế chấp (hoặc ngân hàng đồng ý); văn bản chuyển nhượng phải có chủ đầu tư xác nhận (Luật Kinh doanh BĐS 2023, Điều 49–50; Nghị định 96/2024/NĐ-CP, Điều 13). Nhà ở xã hội không được chuyển nhượng HĐMB. Hỏi rõ thủ tục, phí, thời gian.' },
];
export const LEGAL_STATUS = [['chua', 'Chưa kiểm'], ['dang', 'Đang kiểm'], ['ok', 'Ổn'], ['van_de', 'Có vấn đề'], ['khong_ap_dung', 'Không áp dụng']];
export const LEGAL_DISCLAIMER = 'Danh sách tự kiểm tra cho môi giới – không thay thế tư vấn pháp lý của luật sư hoặc công chứng viên.';
export const LEGAL_BASIS = 'Theo Luật Kinh doanh BĐS 2023, Luật Đất đai 2024, Luật Thuế TNCN 2025 – rà lại 11/2026.';
export const DEPOSIT_NOTE = 'Lưu ý luật: với căn hình thành trong tương lai, chủ đầu tư chỉ được nhận tiền cọc khi dự án đã đủ điều kiện đưa vào kinh doanh và tối đa 5% giá bán (Luật Kinh doanh BĐS 2023, Điều 23 khoản 5). Khoản "giữ chỗ/Priority" trước thời điểm đó dễ mất quyền lợi – nhắc khách đọc kỹ văn bản và giữ uỷ nhiệm chi.';
export const BOOKING_KINDS = [['giu_cho', 'Giữ chỗ'], ['priority', 'Priority / Booking'], ['coc', 'Đặt cọc']];
export const BOOKING_STATUS = [['dang_giu', 'Đang giữ'], ['da_coc', 'Đã cọc'], ['da_ky', 'Đã ký hợp đồng'], ['huy', 'Huỷ / hoàn tiền']];
export const PAYOUT_STATUS = [['chua', 'Chưa đến hạn'], ['cho_chi', 'Chờ nhận'], ['da_chi', 'Đã nhận']];
export const label = (list, v) => { const _oa = list.find((_ow) => _ow[0] === v); return _oa ? _oa[1] : (v || ''); };
export { strip, parseData, parseMoney, normPhone };
const _oi = (n) => String(n).padStart(2, '0');
export const YMD_RE = /^\d{4}-\d{2}-\d{2}$/;
export function ymdToMs(s) {
if (!YMD_RE.test(String(s || ''))) return 0;
const [_ox, m, d] = String(s).split('-').map(Number);
const ms = Date.UTC(_ox, m - 1, d, 2, 0, 0);
const _o9 = new Date(ms);
return _o9.getUTCDate() === d && _o9.getUTCMonth() === m - 1 ? ms : 0;
}
export function msToYmd(ms) { const d = new Date(Number(ms) + 7 * 3600e3); return d.getUTCFullYear() + '-' + _oi(d.getUTCMonth() + 1) + '-' + _oi(d.getUTCDate()); }
export function msLabel(ms) { const n = Number(ms); return Number.isFinite(n) && n > 0 ? ymdLabel(msToYmd(n)) : ''; }
export function ymdLabel(s) { return YMD_RE.test(String(s || '')) ? String(s).slice(8, 10) + '/' + String(s).slice(5, 7) + '/' + String(s).slice(0, 4) : ''; }
export function moneyExact(n) {
n = Number(n);
if (!Number.isFinite(n) || n === 0) return '0 đồng';
const _oo = n < 0 ? '-' : '', _o1 = Math.abs(n);
const _ou = (_ow, d) => (Math.round(_ow * 10 ** d) / 10 ** d).toLocaleString('vi-VN', { maximumFractionDigits: d });
const exact = (unit, d) => Math.abs(Math.round(_o1 / unit * 10 ** d) / 10 ** d * unit - _o1) < 0.5;
if (_o1 >= 1e9 && exact(1e9, 3)) return _oo + _ou(_o1 / 1e9, 3) + ' tỷ';
if (_o1 >= 1e6 && _o1 < 1e9 && exact(1e6, 2)) return _oo + _ou(_o1 / 1e6, 2) + ' triệu';
if (_o1 >= 1e3 && _o1 < 1e6 && exact(1e3, 0)) return _oo + _ou(_o1 / 1e3, 0) + ' nghìn';
return _oo + Math.round(_o1).toLocaleString('vi-VN') + ' đồng';
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
export function num(v) { const n = Number(v); return Number.isFinite(n) ? n : 0; }
export function parseNumVi(v) {
if (typeof v === 'number') return v;
const s = String(v ?? '').trim().replace(/\s/g, '').replace(/(%|m2|m²|th[áa]ng|(tr|tri[ệe]u)(\/m2|\/m²)?)$/i, '');
if (!s) return NaN;
if (/^\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) return Number(s.replace(/\./g, '').replace(',', '.'));
return Number(s.replace(',', '.'));
}
export const numVi = (n) => String(n).replace('.', ',');
export const todayYmd = (now = Date.now()) => msToYmd(now);
export function dateProblem(ymd, what, { notFuture = false, notPast = false, now = Date.now() } = {}) {
if (!YMD_RE.test(String(ymd || '')) || !ymdToMs(ymd)) return what + ' chưa đúng.';
const _oq = todayYmd(now);
const _ox = Number(ymd.slice(0, 4));
if (_ox < 2000 || _ox > Number(_oq.slice(0, 4)) + 10) return what + ' chưa đúng năm (' + ymdLabel(ymd) + ').';
if (notFuture && ymd > _oq) return what + ' không thể sau hôm nay (' + ymdLabel(_oq) + ').';
if (notPast && ymd < _oq) return what + ' đã qua (' + ymdLabel(ymd) + ') – chọn từ hôm nay trở đi.';
return '';
}
export function commissionProblem({ type, value, price }) {
const v = num(value), _oh = num(price);
if (!(v > 0)) return '';
if (type === 'pct' && v > 10) return 'Hoa hồng ' + numVi(v) + '% giá là quá cao – kiểm tra lại (gõ số tiền thì chọn "Số tiền").';
if (type === 'months' && v > 12) return 'Phí môi giới ' + numVi(v) + ' tháng thuê là quá cao – kiểm tra lại.';
if (type === 'amount' && _oh > 0 && v >= _oh) return 'Hoa hồng ' + moneyExact(v) + ' không thể bằng hoặc lớn hơn giá căn ' + moneyExact(_oh) + '.';
return '';
}
export function safeUrl(_os) {
const s = String(_os ?? '').trim();
if (!s || s.length > 1000 || !/^https?:\/\/[^\s<>"'`]+$/i.test(s)) return '';
try { const _ow = new URL(s); return _ow.protocol === 'http:' || _ow.protocol === 'https:' ? s : ''; } catch { return ''; }
}
export function parseLinks(text, max = 20) {
const _og = [];
for (const _oj of String(text ?? '').split(/[\s,;]+/)) { const _os = safeUrl(_oj); if (_os && !_og.includes(_os)) _og.push(_os); }
return _og.slice(0, max);
}
export function linkDropped(text) { return String(text ?? '').split(/[\s,;]+/).filter(Boolean).filter((_ow) => !safeUrl(_ow)); }
export function linkProblem(text) {
const _o4 = linkDropped(text);
if (!_o4.length || parseLinks(text).length) return '';
return 'Link phải bắt đầu bằng https:// – chưa đúng: ' + _o4.slice(0, 2).map((_ow) => (_ow.length > 40 ? _ow.slice(0, 40) + '…' : _ow)).join(', ');
}
export function linkNote(...texts) { const n = texts.reduce((t, _ow) => t + linkDropped(_ow).length, 0); return n ? ' – bỏ ' + n + ' dòng không phải link https://' : ''; }
export const isDriveLink = (_os) => /^https:\/\/(drive|docs|photos)\.google\.com\//i.test(String(_os || ''));
export function hostOf(_os) { try { return new URL(_os).hostname.replace(/^www\./i, '').toLowerCase(); } catch { return ''; } }
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
const _oh = (projects || []).find((_ow) => _ow && (_ow.id === idOrName || strip(_ow.name) === s || strip(_ow.id) === s));
return _oh ? _oh.id : s;
}
export function projectName(projects, idOrName) {
if (!idOrName) return '';
const _oh = (projects || []).find((_ow) => _ow && (_ow.id === idOrName || _ow.name === idOrName));
return _oh ? (_oh.name || _oh.id) : String(idOrName);
}
export function splitUnits(s) { return String(s ?? '').split(/[,;\n]+/).map((_ow) => _ow.trim()).filter(Boolean).slice(0, 200); }
export function inventoryRows(partners) {
const _og = [];
for (const _oh of ofKind(partners, KIND.partner)) {
const d = dataOf(_oh);
for (const _oc of Array.isArray(d.inventory) ? d.inventory : []) {
const units = splitUnits(_oc && _oc.units);
const base = { partner_id: _oh.id, partner: _oh.name || '', role: d.role || '', phone: _oh.phone || '', project: (_oc && _oc.project) || '', note: (_oc && _oc.note) || '', at: num(_oc && _oc.at) };
if (!units.length) _og.push({ ...base, unit: '' });
for (const _os of units) _og.push({ ...base, unit: _os });
}
}
return _og;
}
export function findHolders(rows, q, projects) {
const s = strip(q);
if (!s) return rows;
return rows.filter((r) => strip([r.unit, projectName(projects, r.project), r.project, r.partner].join(' ')).includes(s));
}
export function commissionAmount({ price, type, value }) {
const _oh = num(price), v = num(value);
if (!(v > 0)) return 0;
if (type === 'amount') return Math.round(v);
if (type === 'months') return Math.round(_oh * v);
return Math.round(_oh * v / 100);
}
export function listingView(row) {
const d = dataOf(row);
return {
id: row.id, name: row.name || '', project: row.project || '', unit_type: row.unit_type || '', status: row.status || 'dang_chao',
owner: row.owner || '', phone: row.phone || '',
deal: d.deal === 'cho_thue' ? 'cho_thue' : 'chuyen_nhuong', unit_code: d.unit_code || '', price: num(d.price), area: num(d.area),
bought_price: num(d.bought_price), floor: d.floor || '', direction: d.direction || '', owner_name: d.owner_name || '', partner_id: d.partner_id || '',
commission: d.commission || { type: 'pct', value: 0 }, photos: Array.isArray(d.photos) ? d.photos.filter(safeUrl) : [],
customer_ids: Array.isArray(d.customer_ids) ? d.customer_ids : [], legal: d.legal || null, note: row.note || '',
};
}
export function listingTitle(v, projects) {
return v.name || [v.unit_code, projectName(projects, v.project), v.unit_type].filter(Boolean).join(' · ') || 'Căn chưa đặt tên';
}
export function refView(row) {
const d = dataOf(row);
return { id: row.id, project: row.project || '', unit_type: row.unit_type || '', deal: d.deal === 'cho_thue' ? 'cho_thue' : 'chuyen_nhuong',
ppm2: num(d.ppm2), rent: num(d.rent), source: String(d.source || ''), as_of: String(d.as_of || ''), owner: row.owner || '' };
}
export function pickRef(refs, { project, unit_type, deal }, projects, now = Date.now()) {
const pk = projectKey(projects, project);
const _oq = todayYmd(now);
const list = (refs || []).filter((r) => !r.kind || (alive(r) && r.status !== 'luu_tru')).map((r) => (r.kind ? refView(r) : r))
.filter((r) => projectKey(projects, r.project) === pk && r.deal === deal && (deal === 'cho_thue' ? r.rent > 0 : r.ppm2 > 0))
.filter((r) => !r.as_of || String(r.as_of) <= _oq);
const _ot = strip(unit_type);
const exact = list.filter((r) => _ot && strip(r.unit_type) === _ot);
const _o2 = list.filter((r) => !r.unit_type);
const _ol = exact.length ? exact : _o2;
return _ol.sort((_o1, _o3) => String(_o3.as_of).localeCompare(String(_o1.as_of)))[0] || null;
}
const _ok = (_o1, _o3) => (_o3 > 0 ? Math.round(((_o1 - _o3) / _o3) * 1000) / 10 : null);
export function compareListing(v, { project, refs, projects, threshold = 5 } = {}) {
const _og = { ppm2: null, primary: null, ref: null, vsMarket: null, vsPrimaryLow: null, lossPct: null, flags: [], notes: [] };
if (!(v.price > 0)) { _og.notes.push('Chưa có giá chào'); return _og; }
_og.ref = pickRef(refs, v, projects);
if (v.deal === 'cho_thue') {
if (_og.ref) _og.vsMarket = _ok(v.price, _og.ref.rent);
else _og.notes.push('Chưa có giá thuê tham chiếu cho dự án/loại căn này');
} else {
if (v.area > 0) _og.ppm2 = Math.round((v.price / v.area / 1e6) * 10) / 10;
else _og.notes.push('Thiếu diện tích – chưa tính được giá/m²');
const _om = project && Array.isArray(project.price) && project.price[0] > 0 ? project.price : null;
_og.primary = _om;
if (_og.ppm2 && _om) { _og.vsPrimaryLow = _ok(_og.ppm2, _om[0]); if (_og.ppm2 < _om[0]) _og.flags.push('duoi_so_cap'); }
else if (!_om) _og.notes.push('Dự án chưa có giá sơ cấp trong Bảng hàng');
if (_og.ref && _og.ppm2) _og.vsMarket = _ok(_og.ppm2, _og.ref.ppm2);
else if (!_og.ref) _og.notes.push('Chưa có mặt bằng giá tham chiếu cho dự án/loại căn này');
if (v.bought_price > 0 && v.price < v.bought_price) { _og.lossPct = _ok(v.price, v.bought_price); _og.flags.push('cat_lo'); }
}
if (_og.vsMarket !== null && _og.vsMarket <= -Math.abs(threshold)) _og.flags.unshift('re_hon_mat_bang');
return _og;
}
export const FLAG_LABEL = { re_hon_mat_bang: 'Rẻ hơn mặt bằng', duoi_so_cap: 'Dưới giá sơ cấp', cat_lo: 'Cắt lỗ' };
const _o0 = /da mua|khong tiem nang|da coc|ban giao/;
export function matchCustomers(v, customers, { projects, slack = 0.1, limit = 20 } = {}) {
const _ov = v.deal === 'cho_thue' ? ['thue'] : ['mua'];
const pk = projectKey(projects, v.project), _ot = strip(v.unit_type);
const _og = [];
for (const _o5 of customers || []) {
if (!alive(_o5) || (_o5.kind && _o5.kind !== 'customer') || _o0.test(strip(_o5.status))) continue;
if (!_ov.includes(strip(_o5.need || 'mua'))) continue;
const reasons = [];
let score = 1;
if (_o5.project) {
if (projectKey(projects, _o5.project) !== pk) continue;
score += 3; reasons.push('đúng dự án');
}
if (_o5.unit_type && _ot) {
if (strip(_o5.unit_type) !== _ot) continue;
score += 2; reasons.push('đúng loại căn');
}
const budget = num(_o5.budget);
if (budget > 0 && v.price > 0) {
if (v.price > budget * (1 + slack)) continue;
score += 2; reasons.push(v.price <= budget ? 'trong ngân sách' : 'vượt ngân sách ≤ ' + Math.round(slack * 100) + '%');
}
if (score < 3) continue;
_og.push({ customer: _o5, score, reasons });
}
return _og.sort((_o1, _o3) => _o3.score - _o1.score || num(_o1.customer.budget) - num(_o3.customer.budget)).slice(0, limit);
}
export function legalState(legal) {
const items = (legal && legal.items) || {};
return LEGAL_ITEMS.map((it) => {
const _ow = items[it.id] || {};
return { ...it, status: LEGAL_STATUS.some((s) => s[0] === _ow.status) ? _ow.status : 'chua', note: String(_ow.note || ''), links: (Array.isArray(_ow.links) ? _ow.links : []).filter(safeUrl), at: num(_ow.at) };
});
}
export function legalProgress(legal) {
const _op = legalState(legal).filter((_ow) => _ow.status !== 'khong_ap_dung');
const ok = _op.filter((_ow) => _ow.status === 'ok').length, issues = _op.filter((_ow) => _ow.status === 'van_de').length;
const pending = _op.length - ok - issues;
const _or = _op.some((_ow) => _ow.status !== 'chua');
const verdict = issues ? 'co_van_de' : (_op.length && !pending ? 'da_kiem' : (_or ? 'dang_kiem' : 'chua_kiem'));
return { total: _op.length, ok, issues, pending, verdict };
}
export const VERDICT_LABEL = { chua_kiem: 'Chưa kiểm', dang_kiem: 'Đang kiểm', co_van_de: 'Có vấn đề', da_kiem: 'Đã kiểm đủ mục' };
export function setLegalItem(legal, id, patch, now = Date.now()) {
const items = { ...((legal && legal.items) || {}) };
items[id] = { ...(items[id] || {}), ...patch, at: now };
return { ...(legal || {}), items, updated_at: now };
}
export function bookingView(row) {
const d = dataOf(row);
return {
id: row.id, name: row.name || '', project: row.project || '', unit_type: row.unit_type || '', status: row.status || 'dang_giu', owner: row.owner || '',
kind: d.kind || 'giu_cho', customer_id: d.customer_id || '', customer_name: d.customer_name || '', unit_code: d.unit_code || '', listing_id: d.listing_id || '',
amount: num(d.amount), paid_at: d.paid_at || '', proofs: (Array.isArray(d.proofs) ? d.proofs : []).filter(safeUrl),
deadlines: (Array.isArray(d.deadlines) ? d.deadlines : []).filter((_ow) => _ow && _ow.id && YMD_RE.test(_ow.date || '')),
price: num(d.price), commission: { type: 'pct', value: 0, status: 'chua', ...(d.commission || {}) }, bonus: { amount: 0, note: '', status: 'chua', ...(d.bonus || {}) },
note: row.note || '',
};
}
export function listingStatusAfterBooking(bookingStatus, listingStatus) {
const ls = listingStatus || 'dang_chao';
if ((bookingStatus === 'dang_giu' || bookingStatus === 'da_coc') && ls === 'dang_chao') return 'giu_cho';
if (bookingStatus === 'da_ky' && (ls === 'dang_chao' || ls === 'giu_cho')) return 'da_chot';
if (bookingStatus === 'huy' && ls === 'giu_cho') return 'dang_chao';
return '';
}
export function bookingCommission(_o3) { return commissionAmount({ price: _o3.price, type: _o3.commission.type, value: _o3.commission.value }); }
export function commissionSummary(bookings) {
const by = new Map();
for (const row of bookings || []) {
if (!alive(row)) continue;
const _o3 = row.kind === KIND.booking ? bookingView(row) : row;
if (_o3.status === 'huy') continue;
const _of = by.get(_o3.owner) || { owner: _o3.owner, count: 0, commission: 0, bonus: 0, received: 0, waiting: 0, notyet: 0 };
const _o5 = bookingCommission(_o3), bo = num(_o3.bonus.amount);
_of.count++; _of.commission += _o5; _of.bonus += bo;
for (const [amt, _op] of [[_o5, _o3.commission.status], [bo, _o3.bonus.status]]) {
if (_op === 'da_chi') _of.received += amt; else if (_op === 'cho_chi') _of.waiting += amt; else _of.notyet += amt;
}
by.set(_o3.owner, _of);
}
return [...by.values()].sort((_o1, _o3) => (_o3.commission + _o3.bonus) - (_o1.commission + _o1.bonus));
}
export function openDeadlines(bookings, now = Date.now()) {
const _og = [];
for (const row of bookings || []) {
if (!alive(row)) continue;
const _o3 = row.kind === KIND.booking ? bookingView(row) : row;
if (_o3.status === 'huy') continue;
for (const _o8 of _o3.deadlines) if (!_o8.done) { const due = ymdToMs(_o8.date); _og.push({ booking: _o3, deadline: _o8, due, overdue: due + 15 * 3600e3 < now }); }
}
return _og.sort((_o1, _o3) => _o1.due - _o3.due);
}
export const reminderId = (bookingId, deadlineId) => ('g4r_' + bookingId + '_' + deadlineId).slice(0, 64);
export function deadlineReminders(_o3, existing = [], { title, canDelete = true } = {}) {
const _oe = new Map((existing || []).filter((r) => String(r.id).startsWith('g4r_' + _o3.id + '_')).map((r) => [r.id, r]));
const _og = [];
const _o6 = _o3.status === 'huy';
for (const _o8 of _o3.deadlines) {
const id = reminderId(_o3.id, _o8.id);
const old = _oe.get(id); _oe.delete(id);
const due = ymdToMs(_o8.date);
const row = { id, object_id: _o3.id, kind: 'custom', title: (title || 'Giữ chỗ') + ': ' + (_o8.label || 'Hạn'), due_at: due, remind_before_days: num(_o8.before ?? 1),
amount: num(_o8.amount) || '', installment: '', done: _o8.done || _o6 ? 1 : 0, data: JSON.stringify({ pack: PACK, booking_id: _o3.id, deadline_id: _o8.id }), deleted: 0 };
if (old && !Number(old.deleted) && old.title === row.title && Number(old.due_at) === due && Number(old.done) === row.done && Number(old.remind_before_days) === row.remind_before_days && String(old.amount || '') === String(row.amount)) continue;
_og.push({ ...(old || {}), ...row, notified_at: old && Number(old.due_at) === due ? old.notified_at || 0 : 0 });
}
for (const old of _oe.values()) {
if (Number(old.deleted)) continue;
if (canDelete) _og.push({ ...old, deleted: 1 });
else if (!Number(old.done)) _og.push({ ...old, done: 1 });
}
return _og;
}
export const SITE_MARK = 'BDS_G4_CONGTRUONG';
export function siteView(row) {
const d = dataOf(row);
return { id: row.id, project: row.project || '', owner: row.owner || '', date: YMD_RE.test(d.date || '') ? d.date : '', text: String(d.text || row.note || ''),
photos: (Array.isArray(d.photos) ? d.photos : []).filter(safeUrl), sources: (Array.isArray(d.sources) ? d.sources : []).filter((s) => s && safeUrl(s.url)),
origin: d.origin === 'ai' ? 'ai' : 'manual', approved_by: d.approved_by || '' };
}
export function buildSitePrompt({ project, place = '', since = '' }) {
return [
'Bạn là trợ lý theo dõi tiến độ xây dựng bất động sản tại Việt Nam. ' + SITE_MARK,
'Hãy TÌM TRÊN GOOGLE tin mới nhất về tiến độ thi công / công trường của dự án: "' + String(project || '').slice(0, 200) + '"' + (place ? ' (' + String(place).slice(0, 200) + ')' : '') + '.',
since ? 'Chỉ lấy tin từ ngày ' + since + ' trở về sau.' : 'Ưu tiên tin trong 6 tháng gần đây.',
'Quy tắc bắt buộc: chỉ ghi điều có trong nguồn tìm được; mỗi mục phải có ngày đăng của nguồn và link nguồn; không suy đoán, không tự thêm con số; không có tin thì trả mảng rỗng.',
'Trả lời DUY NHẤT một khối ```json theo mẫu: {"entries":[{"date":"YYYY-MM-DD","text":"Tóm tắt 1–2 câu tiếng Việt về tiến độ","source_url":"https://…","source_title":"Tên trang"}]}',
'Tối đa 8 mục, mới nhất trước.',
].join('\n');
}
export function extractJson(text) {
const s = String(text || '');
const m = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
const _o7 = [m && m[1], s];
for (const _o5 of _o7) {
if (!_o5) continue;
try { return JSON.parse(_o5.trim()); } catch { }
const _ob = _o5.indexOf('{'), j = _o5.lastIndexOf('}');
if (_ob >= 0 && j > _ob) { try { return JSON.parse(_o5.slice(_ob, j + 1)); } catch { } }
}
return null;
}
export function parseSiteEntries(text, sources = [], existing = [], now = Date.now()) {
const _oq = todayYmd(now);
const j = extractJson(text);
const list = Array.isArray(j) ? j : (j && Array.isArray(j.entries) ? j.entries : []);
const hosts = new Set();
for (const s of sources || []) { const _o1 = hostOf(s && s.url), _o3 = String((s && s.title) || '').replace(/^www\./i, '').toLowerCase().trim(); if (_o1) hosts.add(_o1); if (_o3 && /\./.test(_o3) && !/\s/.test(_o3)) hosts.add(_o3); }
const _on = new Set((existing || []).map((e) => (e.date || '') + '|' + (e.sources && e.sources[0] ? e.sources[0].url : '')));
const _og = [];
for (const e of list.slice(0, 20)) {
if (!e || typeof e !== 'object') continue;
const date = String(e.date || '').slice(0, 10), url = safeUrl(e.source_url || e.url), txt = String(e.text || e.summary || '').trim().slice(0, 600);
if (!YMD_RE.test(date) || !ymdToMs(date) || !url || !txt) continue;
if (date > _oq) continue;
const _od = date + '|' + url;
if (_on.has(_od)) continue;
_on.add(_od);
const h = hostOf(url);
const grounded = !!h && [...hosts].some((_ow) => _ow === h || h.endsWith('.' + _ow) || _ow.endsWith('.' + h));
_og.push({ date, text: txt, source_url: url, source_title: String(e.source_title || h || '').slice(0, 160), grounded });
}
return _og.sort((_o1, _o3) => _o3.date.localeCompare(_o1.date));
}
export function siteTimeline(rows, project, projects) {
const pk = project ? projectKey(projects, project) : '';
return ofKind(rows, KIND.site).filter((r) => r.status !== 'luu_tru').map(siteView).filter((s) => !pk || projectKey(projects, s.project) === pk)
.sort((_o1, _o3) => _o3.date.localeCompare(_o1.date));
}
export default {
PACK, KIND, KINDS, PARTNER_ROLES, CONTACT_TYPES, DEALS, LISTING_STATUS, COMMISSION_TYPES, LEGAL_ITEMS, LEGAL_STATUS, LEGAL_DISCLAIMER,
BOOKING_KINDS, BOOKING_STATUS, PAYOUT_STATUS, label, ymdToMs, msToYmd, ymdLabel, moneyExact, safeUrl, parseLinks, hostOf,
splitUnits, inventoryRows, findHolders, commissionAmount, listingView, compareListing, pickRef, matchCustomers, legalState, legalProgress,
bookingView, commissionSummary, openDeadlines, deadlineReminders, buildSitePrompt, parseSiteEntries, siteTimeline, DAY,
};

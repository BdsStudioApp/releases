import { buildQuote, parseNum, parsePlans, fold, fmtMoney, fmtNum, parseTypesText, typesToText, ymLabel } from '../_lib/sales.js';
import { normUnitType, bedroomsFromType, unitKey, mergeUnit, unitRecord, REVIEW, MAX_UNITS, AREA_MIN, AREA_MAX } from '../_lib/layout_units.js';
import { withRules } from '../../../shared/ai_rules.js';
const _ox = (x) => typeof x === 'number' && isFinite(x);
const num = (v, d = 0) => { const n = typeof v === 'number' ? v : parseNum(v); return isFinite(n) ? n : d; };
const _o1y = (x) => Math.round(x);
const _o17 = (n) => { try { const L = globalThis.BDSLogic; const s = L && L.fmt && L.fmt.money(n); if (s) return s; } catch { } return fmtMoney(n); };
export const TAX_DEFAULTS = {
pit_rate: 0.02,
lptb_rate: 0.005,
lptb_online_discount: 0.10,
maintenance_rate: 0.02,
notary_tiers: [
[50e6, 50000, 0, 0], [100e6, 100000, 0, 0], [1e9, 0, 0.001, 0], [3e9, 1e6, 0.0006, 1e9],
[5e9, 2.2e6, 0.0005, 3e9], [10e9, 3.2e6, 0.0004, 5e9], [100e9, 5.2e6, 0.0003, 10e9], [null, 32.2e6, 0.0002, 100e9],
],
notary_max: 70e6,
checked_at: '2026-11-16',
};
export const TAX_LEGAL = {
pit: 'Luật Thuế TNCN 109/2025/QH15 (hiệu lực 01/7/2026): 2% × giá chuyển nhượng',
lptb: 'NĐ 10/2022/NĐ-CP Điều 7–8: 0,5% × giá tính lệ phí (không thấp hơn giá UBND tỉnh)',
notary: 'TT 257/2016/TT-BTC Điều 4 (sửa đổi TT 111/2017/TT-BTC): biểu phí theo giá trị hợp đồng',
maintenance: 'Luật Nhà ở 2023 Điều 152: kinh phí bảo trì 2% giá bán căn hộ (mua từ CĐT)',
};
export function taxConfig(over) {
const c = { ...TAX_DEFAULTS, ...(over && typeof over === 'object' ? over : {}) };
for (const k of ['pit_rate', 'lptb_rate', 'lptb_online_discount', 'maintenance_rate', 'notary_max']) c[k] = num(c[k], TAX_DEFAULTS[k]);
if (!Array.isArray(c.notary_tiers) || !c.notary_tiers.length) c.notary_tiers = TAX_DEFAULTS.notary_tiers;
c.legal = { ...TAX_LEGAL, ...(c.legal && typeof c.legal === 'object' ? c.legal : {}) };
c.src = c.src && typeof c.src === 'object' ? c.src : {};
return c;
}
export function notaryFee(value, cfg = TAX_DEFAULTS) {
const v = Math.max(0, num(value));
if (!v) return 0;
for (const [cap, fixed, rate, floor] of cfg.notary_tiers) {
if (cap === null || v <= cap) return Math.min(cfg.notary_max || Infinity, _o1y(fixed + rate * (v - floor)));
}
return 0;
}
export function transferCosts(_o1c = {}) {
const cfg = taxConfig(_o1c.cfg);
const price = Math.max(0, num(_o1c.price)), state = Math.max(0, num(_o1c.statePrice));
const base = Math.max(price, state);
const _o1t = _o1c.mode === 'primary';
const items = [];
const add = (key, label, amount, payer, legal, note) => { if (amount > 0 || note) items.push({ key, label, amount: _o1y(amount), payer, legal: legal || '', note: note || '' }); };
if (!_o1t) {
add('pit', 'Thuế thu nhập cá nhân ' + fmtNum(cfg.pit_rate * 100, 3) + '%', _o1c.exemptPit ? 0 : base * cfg.pit_rate, _o1c.pitPayer || 'seller', cfg.legal.pit,
_o1c.exemptPit ? 'Miễn thuế (đủ điều kiện – cần giấy tờ chứng minh)' : [state > price ? 'Tính trên giá nhà nước vì cao hơn giá hợp đồng' : '', cfg.pit_note ? String(cfg.pit_note) : ''].filter(Boolean).join(' · '));
}
const _o15 = cfg.lptb_rate * (_o1c.online ? 1 - cfg.lptb_online_discount : 1);
add('lptb', 'Lệ phí trước bạ ' + fmtNum(_o15 * 100, 2) + '%', _o1c.exemptLptb ? 0 : base * _o15, _o1c.lptbPayer || 'buyer', cfg.legal.lptb,
_o1c.exemptLptb ? 'Miễn lệ phí trước bạ (đủ điều kiện)' : '');
if (!_o1t) {
const nf = notaryFee(base, cfg);
const np = _o1c.notaryPayer || 'buyer';
if (np === 'split') { add('notary_b', 'Phí công chứng (bên mua 1/2)', nf / 2, 'buyer', cfg.legal.notary); add('notary_s', 'Phí công chứng (bên bán 1/2)', nf / 2, 'seller', cfg.legal.notary); }
else add('notary', 'Phí công chứng', nf, np, cfg.legal.notary);
} else {
add('maint', 'Kinh phí bảo trì ' + fmtNum(cfg.maintenance_rate * 100, 3) + '%', 0, 'buyer', cfg.legal.maintenance, 'Thường đã gồm trong giá niêm yết – kiểm tra phiếu tính giá');
}
const broker = price * Math.max(0, num(_o1c.brokerRate)) + Math.max(0, num(_o1c.brokerFixed));
add('broker', 'Phí môi giới', broker, _o1c.brokerPayer || 'seller', 'Theo thoả thuận');
add('appraisal', 'Phí thẩm định hồ sơ, cấp sổ (theo tỉnh)', Math.max(0, num(_o1c.appraisal)), 'buyer', 'Nghị quyết HĐND tỉnh nơi có nhà đất');
add('other_b', 'Chi phí khác bên mua', Math.max(0, num(_o1c.otherBuyer)), 'buyer', '');
add('other_s', 'Chi phí khác bên bán', Math.max(0, num(_o1c.otherSeller)), 'seller', '');
const _o2e = (who) => items.filter((i) => i.payer === who).reduce((a, i) => a + i.amount, 0);
const buyerFees = _o2e('buyer'), sellerFees = _o2e('seller');
return { price, statePrice: state, base, items, buyerFees, sellerFees, buyerPays: price + buyerFees, sellerGets: price - sellerFees, cfg };
}
export const MAX_LOAN_MONTHS = 1200;
export function numOr(v, fallback) { const n = parseNum(v); return Number.isFinite(n) ? n : fallback; }
export function numDec(v) {
if (typeof v === 'number') return v;
const m = /^\s*([-+]?\d+)[.,](\d+)\s*$/.exec(String(v ?? '').replace(/[\u2212\u2013]/g, '-'));
return m ? Number(m[1] + '.' + m[2]) : parseNum(v);
}
export function moneyFine(n) {
const v = Number(n);
if (!isFinite(v)) return '';
const a = Math.abs(v), sign = v < 0 ? '-' : '';
const tr = Math.round(a / 1e5) / 10;
if (!tr) return '0 đồng';
if (tr < 1000) return sign + fmtNum(tr, 1) + ' triệu';
return sign + fmtNum(a / 1e9, 2).replace(/\B(?=(\d{3})+(?!\d))/, '.') + ' tỷ';
}
export function rangeErrors(rules) {
const out = [];
for (const [label, raw, min, max, unit] of rules) {
if (raw == null || String(raw).trim() === '') continue;
const n = typeof raw === 'number' ? raw : parseNum(raw);
if (!isFinite(n)) { out.push(`${label}: chưa phải số.`); continue; }
if (n < min || n > max) out.push(`${label}: nhập từ ${fmtNum(min, 3)} đến ${fmtNum(max, 3)}${unit ? ' ' + unit : ''}.`);
}
return out;
}
export function amortize({ principal, years, phases, method = 'annuity', stopMonth = 0 }) {
const P = Math.max(0, num(principal)), N = Math.min(MAX_LOAN_MONTHS, Math.max(1, Math.round(num(years) * 12)));
const _o1o = (phases || []).filter((x) => x && isFinite(num(x.ratePct, NaN)));
if (!_o1o.length) return { rows: [], months: N, totalInterest: 0, ok: false };
const _o20 = (m) => { let _oa = 0; for (const x of _o1o) { _oa += Math.max(0, Math.round(num(x.months))); if (m <= _oa) return num(x.ratePct); } return num(_o1o[_o1o.length - 1].ratePct); };
const rows = [];
let _oc = P, pay = 0, curRate = null, totalInterest = 0;
const end = stopMonth > 0 ? Math.min(N, stopMonth) : N;
for (let m = 1; m <= end; m++) {
const _o26 = _o20(m), r = _o26 / 1200, left = N - m + 1;
if (method === 'annuity' && _o26 !== curRate) { pay = r ? _oc * r / (1 - Math.pow(1 + r, -left)) : _oc / left; curRate = _o26; }
const interest = _oc * r;
let _o1u = method === 'annuity' ? pay - interest : P / N;
if (m === N || _o1u > _oc) _o1u = _oc;
_oc -= _o1u; if (Math.abs(_oc) < 1e-6) _oc = 0;
totalInterest += interest;
rows.push({ m, ratePct: _o26, interest, principal: _o1u, pay: _o1u + interest, balance: _oc });
}
return { rows, months: N, totalInterest, balance: _oc, ok: true };
}
export const BANK_FIELDS = ['bank', 'promo_rate', 'promo_months', 'floating_rate', 'base_label', 'ref_rate', 'margin', 'prepay', 'max_ltv', 'max_years', 'source_name', 'source_url', 'updated', 'note'];
export function parsePrepay(s) { return String(s ?? '').split(/[;,\s/|]+/).map((x) => parseNum(x)).filter(isFinite); }
export function prepayPct(list, year) { if (!list.length) return NaN; return list[Math.min(list.length, Math.max(1, year)) - 1]; }
export function normBank(r = {}) {
const _o1c = {};
_o1c.id = String(r.id || ''); _o1c.bank = String(r.bank || '').trim();
for (const k of ['promo_rate', 'promo_months', 'floating_rate', 'ref_rate', 'margin', 'max_ltv', 'max_years']) { const v = numDec(r[k]); _o1c[k] = isFinite(v) ? v : null; }
_o1c.base_label = String(r.base_label || '').trim(); _o1c.prepay = String(r.prepay ?? '').trim(); _o1c.source_url = String(r.source_url || '').trim();
_o1c.updated = /^\d{4}-\d{2}-\d{2}$/.test(String(r.updated || '')) ? String(r.updated) : ''; _o1c.note = String(r.note || '').trim();
_o1c.source_name = String(r.source_name || '').trim();
_o1c.origin = r.origin === 'ai' ? 'ai' : 'manual';
_o1c.ai_at = /^\d{4}-\d{2}-\d{2}$/.test(String(r.ai_at || '')) ? String(r.ai_at) : '';
_o1c.ai_rep = _ox(r.ai_rep) ? r.ai_rep : 0;
return _o1c;
}
export function bankIssues(b, todayISO, staleDays = 30) {
const e = [];
if (!b.bank) e.push('Thiếu tên ngân hàng');
if (b.floating_rate == null) e.push('Thiếu lãi thả nổi dự kiến – không tính được tổng chi phí');
if (b.promo_rate == null && b.promo_months) e.push('Có thời gian ưu đãi nhưng thiếu lãi ưu đãi');
if (!b.updated) e.push('Thiếu ngày cập nhật');
if (b.source_url && !/^https?:\/\//i.test(b.source_url)) e.push('Link nguồn phải bắt đầu bằng http');
const stale = !!(b.updated && todayISO && (Date.parse(todayISO) - Date.parse(b.updated)) / 864e5 > staleDays);
return { errors: e, stale };
}
export function bankFieldErrors(b) {
const e = [];
const _og = (k, label, lo, hi, unit) => { if (b[k] != null && !(b[k] >= lo && b[k] <= hi)) e.push(`${label}: nhập từ ${fmtNum(lo)} đến ${fmtNum(hi)}${unit}`); };
_og('promo_rate', 'Lãi ưu đãi', 0, 40, '%/năm'); _og('floating_rate', 'Lãi thả nổi', 0, 40, '%/năm'); _og('ref_rate', 'Lãi cơ sở', 0, 40, '%/năm');
_og('margin', 'Biên độ', 0, 20, '%'); _og('promo_months', 'Thời gian ưu đãi', 0, 360, ' tháng'); _og('max_ltv', 'Cho vay tối đa', 1, 100, '%');
_og('max_years', 'Thời hạn tối đa', 1, 50, ' năm');
const _o1s = parsePrepay(b.prepay);
if (String(b.prepay || '').trim() && (!_o1s.length || _o1s.length > 30 || _o1s.some((x) => x < 0 || x > 10))) e.push('Phí trả trước hạn: mỗi năm một số từ 0 đến 10%, cách nhau bằng dấu phẩy (vd 3,3,2,1,0)');
return e;
}
export function compareBanks(rows, opt = {}) {
const P = num(opt.principal), years = num(opt.years, 20), py = Math.max(0, Math.round(num(opt.prepayYear)));
const out = (rows || []).map(normBank).map((b) => {
const _oy = bankIssues(b, opt.todayISO, opt.staleDays);
const _o23 = { ...b, issues: _oy.errors, stale: _oy.stale, ok: false };
if (_oy.errors.some((x) => /thả nổi|thiếu lãi ưu đãi|tên/i.test(x)) || !(P > 0)) return _o23;
if (b.max_years && years > b.max_years) _o23.issues = _o23.issues.concat('Ngân hàng cho vay tối đa ' + fmtNum(b.max_years) + ' năm');
const phases = [];
if (b.promo_rate != null && b.promo_months) phases.push({ months: b.promo_months, ratePct: b.promo_rate });
phases.push({ months: 1e6, ratePct: b.floating_rate });
const _o2c = py > 0 ? Math.min(py * 12, years * 12) : 0;
const A = amortize({ principal: P, years, phases, method: opt.method || 'annuity', stopMonth: _o2c });
const _oo = A.rows.find((r) => r.m === (b.promo_months || 0) + 1) || null;
const _o1n = _o2c && A.balance > 0 ? prepayPct(parsePrepay(b.prepay), py) : 0;
const penalty = _o2c && A.balance > 0 ? (isFinite(_o1n) ? A.balance * _o1n / 100 : NaN) : 0;
if (_o2c && A.balance > 0 && !isFinite(_o1n)) _o23.issues = _o23.issues.concat('Thiếu phí trả trước hạn – chưa cộng phạt');
Object.assign(_o23, { ok: true, first: A.rows[0] ? A.rows[0].pay : 0, after: _oo ? _oo.pay : null, interest: A.totalInterest,
penalty: isFinite(penalty) ? penalty : 0, balanceAtPrepay: _o2c ? A.balance : 0, cost: A.totalInterest + (isFinite(penalty) ? penalty : 0) });
return _o23;
});
const okRows = out.filter((x) => x.ok);
if (okRows.length > 1) { const m = Math.min(...okRows.map((x) => x.cost)); okRows.forEach((x) => { x.best = x.cost === m; x.extra = x.cost - m; }); }
return out;
}
const _o6 = /^\d{4}-\d{2}-\d{2}$/;
export function isoDate(v) {
const s = String(v ?? '').trim();
let y, m, d;
let k = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(s);
if (k) { y = +k[1]; m = +k[2]; d = +k[3]; }
else if ((k = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(s))) { d = +k[1]; m = +k[2]; y = +k[3]; }
else if ((k = /^(\d{4})-(\d{1,2})$/.exec(s))) { y = +k[1]; m = +k[2]; d = 1; }
else return '';
const t = new Date(Date.UTC(y, m - 1, d));
if (t.getUTCFullYear() !== y || t.getUTCMonth() !== m - 1 || t.getUTCDate() !== d || y < 1990) return '';
return t.toISOString().slice(0, 10);
}
export const isoVN = (ms) => new Date(num(ms, Date.now()) + 7 * 3600e3).toISOString().slice(0, 10);
export const dmy = (iso) => (_o6.test(String(iso || '')) ? String(iso).split('-').reverse().join('/') : '');
const clip = (v, n) => (v == null ? '' : String(v).replace(/\s+/g, ' ').trim().slice(0, n));
const _o1a = (v, lo, hi) => { if (v == null || v === '') return null; const n = parseNum(v); return isFinite(n) && n >= lo && n <= hi ? n : null; };
const _ok = (a, b) => (Date.parse(b) - Date.parse(a)) / 864e5;
const _o7 = 120;
const _o3 = {
vietcombank: ['vcb', 'ngoaithuong'], bidv: ['dautuvaphattrien'], vietinbank: ['ctg', 'congthuong'], agribank: ['nongnghiepvaphattriennongthon', 'nongnghiep'],
techcombank: ['tcb', 'kythuong'], vpbank: ['vpb', 'vietnamthinhvuong'], mbbank: ['mb', 'mbb', 'quandoi'], acb: ['achau'], sacombank: ['stb', 'saigonthuongtin'],
hdbank: ['hdb', 'phattrienthanhphohochiminh', 'phattrientphcm'], tpbank: ['tpb', 'tienphong'], vib: ['quocte'], shb: ['saigonhanoi'], msb: ['hanghai'],
ocb: ['phuongdong'], seabank: ['ssb', 'dongnama'], eximbank: ['eib', 'xuatnhapkhau'], lpbank: ['lpb', 'locphat', 'lienvietpostbank', 'buudienlienviet'],
namabank: ['nab', 'nama'], abbank: ['abb', 'anbinh'], bacabank: ['bab', 'baca'], pvcombank: ['pvcb', 'daichung'], kienlongbank: ['klb', 'kienlong'],
vikkibank: ['vikki', 'donga'], baovietbank: ['bvb', 'baoviet'], ncb: ['quocdan'], saigonbank: ['sgb', 'saigoncongthuong'], pgbank: ['pgb', 'thinhvuongvaphattrien'],
vietbank: ['vbb', 'vietnamthuongtin'], shinhanbank: ['shinhan'], uob: ['uobvietnam'], hsbc: ['hsbcvietnam'], wooribank: ['woori'],
};
const _o1 = (() => { const m = {}; for (const [c, list] of Object.entries(_o3)) { m[c] = c; for (const a of list) m[a] = c; } return m; })();
const _o0 = Object.keys(_o1).filter((a) => a.length >= 6).sort((a, b) => b.length - a.length);
const _oh = (s) => fold(s).replace(/[^a-z0-9]+/g, '');
const _o2d = (s) => fold(s).replace(/\b(ngan hang|nh|tmcp|thuong mai co phan|tnhh|mot thanh vien|mtv|joint stock commercial bank|commercial bank|bank|jsc|viet nam|vietnam)\b/g, ' ');
export function bankKey(name) {
const f = fold(name);
if (!f) return '';
const inner = [...f.matchAll(/\(([^)]*)\)/g)].map((m) => m[1]);
const _o1i = f.replace(/\([^)]*\)/g, ' ');
for (const _oe of [...inner, _o1i]) {
const c = _oh(_oe), cs = _oh(_o2d(_oe));
for (const x of [cs, c]) { if (x && _o1[x]) return _o1[x]; }
for (const a of _o0) { if (cs.includes(a) || c.includes(a)) return _o1[a]; }
}
return _oh(_o2d(_o1i)) || _oh(_o1i) || _oh(f);
}
export const BANK_FRESH_ASK = 'Tìm biểu lãi suất CHO VAY MUA NHÀ (cá nhân vay mua nhà ở, căn hộ) MỚI NHẤT đang áp dụng của các ngân hàng tại Việt Nam – càng nhiều ' +
'ngân hàng càng tốt (ít nhất các ngân hàng lớn: Vietcombank, BIDV, VietinBank, Agribank, Techcombank, VPBank, MB, ACB, Sacombank, HDBank, TPBank, VIB, SHB, MSB). ' +
'Với từng ngân hàng ghi: lãi suất ưu đãi (%/năm) và số tháng ưu đãi; cách tính lãi sau ưu đãi (lãi cơ sở / lãi tham chiếu + biên độ); lãi cơ sở tham chiếu ' +
'(%/năm) nếu có; biên độ (%); lãi thả nổi dự kiến sau ưu đãi (%/năm); phí trả nợ trước hạn theo từng năm (%); tỷ lệ cho vay tối đa (% giá trị nhà); thời hạn vay tối đa (năm). ' +
'Ngân hàng có nhiều gói thì lấy gói phổ biến nhất cho người mua nhà ở, ghi tên gói vào "package". Mỗi ngân hàng một dòng, ghi link trang nguồn và ngày công bố/áp dụng của biểu lãi.';
export const BANK_FRESH_SHAPE = '{"banks":[{"bank":"Tên ngắn của ngân hàng (vd Vietcombank)","package":"tên gói vay hoặc null","promo_rate":6.5,"promo_months":12,' +
'"ref_rate":6.0,"margin":3.5,"floating_rate":9.5,"base_label":"lãi cơ sở + 3,5%","prepay":[3,2,1,0],"max_ltv":70,"max_years":30,"note":"điều kiện chính hoặc null",' +
'"source_name":"tên trang","source_url":"https://…","date":"YYYY-MM-DD"}]}  (số là số thuần, % ghi 6.5 nghĩa là 6,5%/năm; không có thì null)';
export function normFreshBanks(parsed, { todayISO } = {}) {
const list = Array.isArray(parsed) ? parsed : parsed && Array.isArray(parsed.banks) ? parsed.banks : parsed && Array.isArray(parsed.items) ? parsed.items : [];
const _o27 = new Set(), out = [];
for (const x of list.slice(0, 60)) {
if (!x || typeof x !== 'object') continue;
const bank = clip(x.bank || x.name || x.title, 80);
const key = bankKey(bank);
if (!key || _o27.has(key)) continue;
_o27.add(key);
const issues = [], warns = [];
const r = { key, bank };
const rate = (k, label) => { const v = _o1a(x[k], 0.1, 40); if (x[k] != null && x[k] !== '' && v == null) warns.push(label + ' không hợp lệ – bỏ qua'); return v; };
r.promo_rate = rate('promo_rate', 'Lãi ưu đãi');
r.promo_months = _o1a(x.promo_months, 0, 360); if (r.promo_months != null) r.promo_months = Math.round(r.promo_months);
r.ref_rate = rate('ref_rate', 'Lãi cơ sở');
r.margin = _o1a(x.margin, 0, 20);
r.floating_rate = rate('floating_rate', 'Lãi thả nổi');
if (r.floating_rate == null && r.ref_rate != null && r.margin != null) { r.floating_rate = Math.round((r.ref_rate + r.margin) * 1000) / 1000; warns.push('Lãi thả nổi = lãi cơ sở + biên độ (app tự cộng)'); }
r.base_label = clip(x.base_label, 120) || (r.margin != null ? 'Lãi cơ sở + ' + fmtNum(r.margin, 3) + '%' : '');
const _o1s = Array.isArray(x.prepay) ? x.prepay.map((v) => _o1a(v, 0, 10)).filter((v) => v != null) : parsePrepay(x.prepay).filter((v) => v >= 0 && v <= 10);
r.prepay = _o1s.slice(0, 10).map((v) => fmtNum(v, 2)).join(',');
r.max_ltv = _o1a(x.max_ltv, 1, 100);
r.max_years = _o1a(x.max_years, 1, 50);
r.note = [clip(x.package, 80), clip(x.note, 160)].filter((v) => v && !/^null$/i.test(v)).join(' – ');
r.source_name = clip(x.source_name, 80);
r.source_url = safeUrl(x.source_url);
let date = isoDate(x.date || x.updated);
if (date && todayISO && date > todayISO) { warns.push('Ngày nguồn sau hôm nay – bỏ ngày'); date = ''; }
r.date = date;
if (!r.source_url) issues.push('Không có link nguồn – không lưu');
if (r.promo_rate == null && r.floating_rate == null) issues.push('Không có mức lãi nào – không lưu');
if (r.promo_months && r.promo_rate == null) warns.push('Có thời gian ưu đãi nhưng thiếu lãi ưu đãi');
if (r.floating_rate == null) warns.push('Thiếu lãi thả nổi – chưa tính được tổng chi phí');
if (!date) warns.push('Nguồn không ghi ngày – dùng ngày cập nhật qua AI');
r.stale = !!(date && todayISO && _ok(date, todayISO) > _o7);
if (r.stale) warns.push('Biểu lãi đã cũ (' + dmy(date) + ') – nên hỏi lại ngân hàng');
r.issues = issues; r.warns = warns; r.ok = !issues.length;
out.push(r);
}
return out;
}
const _o2 = ['promo_rate', 'promo_months', 'ref_rate', 'margin', 'floating_rate', 'base_label', 'prepay', 'max_ltv', 'max_years'];
const _oq = (v) => (typeof v === 'number' ? fmtNum(v, 3) : v);
export function findBankRow(rows, bankOrKey) {
const key = bankKey(bankOrKey) || String(bankOrKey || '');
return (Array.isArray(rows) ? rows : []).findIndex((r) => r && bankKey(r.bank) === key);
}
export function mergeFreshBanks(rows, fresh, opt = {}) {
const at = isoDate(opt.atISO) || '';
const next = (Array.isArray(rows) ? rows : []).map((r) => ({ ...r }));
const added = [], updated = [], _o2h = new Set();
(fresh || []).filter((f) => f && f.ok).forEach((f, i) => {
const key = f.key || bankKey(f.bank);
const idx = next.findIndex((r, _o10) => !_o2h.has(_o10) && bankKey(r.bank) === key);
const base = idx >= 0 ? next[idx] : { id: opt.newId ? opt.newId(i) : 'ai' + Date.now().toString(36) + i, bank: f.bank };
const _o25 = { ...base };
for (const k of _o2) { const v = f[k]; if (v != null && v !== '') _o25[k] = _oq(v); }
if (f.note && !(base.note && String(base.note).trim())) _o25.note = f.note;
Object.assign(_o25, { source_name: f.source_name || '', source_url: f.source_url, updated: f.date || at, origin: 'ai', ai_at: at, ai_rep: num(opt.reputable, 0) });
if (idx >= 0) { next[idx] = _o25; _o2h.add(idx); updated.push(_o25.bank); }
else { next.push(_o25); _o2h.add(next.length - 1); added.push(_o25.bank); }
});
const kept = next.filter((_, _o10) => !_o2h.has(_o10)).map((r) => r.bank);
return { rows: next, added, updated, kept };
}
export function markBankManual(_o25) {
const r = { ...(_o25 || {}) };
delete r.origin; delete r.ai_at; delete r.ai_rep;
return r;
}
export function banksStamp(rows) {
const list = (Array.isArray(rows) ? rows : []).map(normBank);
let date = '', ai = false, rep = 0;
for (const b of list) {
const _ow = b.origin === 'ai' && !!b.ai_at;
const d = _ow ? b.ai_at : b.updated;
if (d && d > date) { date = d; ai = _ow; rep = _ow ? b.ai_rep : 0; }
else if (d && d === date && _ow) { ai = true; rep = Math.max(rep, b.ai_rep); }
}
const _o18 = list.filter((b) => b.origin === 'ai' && b.ai_at === date).length;
const _ou = date ? 'Cập nhật ngày ' + dmy(date) + (ai ? ' qua AI (' + _o18 + ' ngân hàng' + (rep ? ', ' + rep + ' trang uy tín' : '') + ')' : '') : 'Chưa có ngày cập nhật';
return { date, ai, rep, text: _ou + ' – bảng tính chỉ mang tính tham khảo, nên gọi nhân viên ngân hàng để có số chính xác.' };
}
export const TAX_FRESH_ASK = 'Tìm mức thuế, phí, lệ phí MỚI NHẤT đang có hiệu lực tại hôm nay khi CÁ NHÂN chuyển nhượng (mua bán) nhà đất, căn hộ tại Việt Nam. ' +
'Lưu ý luật có thể VỪA THAY ĐỔI (ví dụ Luật Thuế thu nhập cá nhân mới, nghị định/thông tư hướng dẫn mới): chỉ lấy văn bản ĐANG CÓ HIỆU LỰC, bỏ văn bản đã bị thay thế. Gồm: ' +
'(1) thuế thu nhập cá nhân từ chuyển nhượng bất động sản – thuế suất và CÁCH TÍNH (trên giá chuyển nhượng hay trên thu nhập/lãi); ' +
'(2) lệ phí trước bạ nhà, đất; (3) mức giảm lệ phí trước bạ khi khai, nộp trực tuyến (nếu có); (4) kinh phí bảo trì khi mua căn hộ từ chủ đầu tư; ' +
'(5) biểu phí công chứng hợp đồng chuyển nhượng theo giá trị tài sản (đủ các bậc, mức thu tối đa); (6) phí thẩm định hồ sơ, cấp giấy chứng nhận (do HĐND tỉnh quy định – tóm tắt). ' +
'Mỗi mục ghi số hiệu văn bản căn cứ (Luật/Nghị định/Thông tư, điều khoản), ngày hiệu lực, link nguồn và ngày đăng.';
const _o9 = '"legal":"số hiệu văn bản, điều khoản","effective":"YYYY-MM-DD","source_name":"…","source_url":"https://…","date":"YYYY-MM-DD"';
export const TAX_FRESH_SHAPE = '{"pit":{"rate_pct":2,"basis":"price | gain | other","basis_text":"cách tính ngắn gọn",' + _o9 + '},' +
'"lptb":{"rate_pct":0.5,' + _o9 + '},"lptb_online":{"discount_pct":10,' + _o9 + '},"maintenance":{"rate_pct":2,' + _o9 + '},' +
'"notary":{"tiers":[{"from":0,"to":50000000,"fixed":50000,"pct":0},{"from":1000000000,"to":3000000000,"fixed":1000000,"pct":0.06},{"from":100000000000,"to":null,"fixed":32200000,"pct":0.02}],"max":70000000,' + _o9 + '},' +
'"appraisal":{"text":"tóm tắt mức phí thẩm định, cấp sổ",' + _o9 + '}}  (số tiền tính bằng đồng; "pct" là % trên phần vượt "from"; ghi ĐỦ các bậc; mục nào không tìm thấy thì để null)';
export const TAX_FRESH_ITEMS = [
{ key: 'pit', label: 'Thuế TNCN chuyển nhượng', field: 'pit_rate', val: 'rate_pct', max: 25 },
{ key: 'lptb', label: 'Lệ phí trước bạ nhà đất', field: 'lptb_rate', val: 'rate_pct', max: 5 },
{ key: 'lptb_online', label: 'Giảm lệ phí trước bạ khi nộp trực tuyến', field: 'lptb_online_discount', val: 'discount_pct', max: 50 },
{ key: 'maintenance', label: 'Kinh phí bảo trì (mua từ chủ đầu tư)', field: 'maintenance_rate', val: 'rate_pct', max: 5 },
{ key: 'notary', label: 'Phí công chứng hợp đồng chuyển nhượng', field: 'notary_tiers' },
{ key: 'appraisal', label: 'Phí thẩm định hồ sơ, cấp sổ', field: 'appraisal_note' },
];
const _o1m = (frac) => fmtNum(frac * 100, 3) + '%';
const _o2f = (tiers, max) => (Array.isArray(tiers) ? tiers.length + ' bậc' : '') + (max ? ', tối đa ' + fmtNum(max / 1e6, 1) + ' triệu' : '');
export function parseNotaryTiers(list) {
if (!Array.isArray(list) || list.length < 3 || list.length > 15) return null;
const out = [];
for (const t of list) {
if (!t || typeof t !== 'object') return null;
const _o1h = t.to == null || t.to === '';
const to = _o1h ? null : _o1a(t.to, 1, 1e15);
if (!_o1h && to == null) return null;
const from = _o1a(t.from ?? 0, 0, 1e15), fixed = _o1a(t.fixed ?? 0, 0, 2e8), pct = _o1a(t.pct ?? 0, 0, 1);
if (from == null || fixed == null || pct == null || (to != null && from > to)) return null;
out.push([to, fixed, pct / 100, from]);
}
for (let i = 0; i < out.length; i++) {
if (out[i][0] === null && i !== out.length - 1) return null;
if (i && out[i][0] !== null && out[i][0] <= out[i - 1][0]) return null;
}
return out[out.length - 1][0] === null ? out : null;
}
export function normFreshTax(parsed, { cfgOver, todayISO } = {}) {
const c = taxConfig(cfgOver), P = parsed && typeof parsed === 'object' ? parsed : {};
const out = [];
for (const _oz of TAX_FRESH_ITEMS) {
const x = P[_oz.key];
if (!x || typeof x !== 'object') continue;
const r = { key: _oz.key, label: _oz.label, field: _oz.field, issues: [], warns: [], noteOnly: false,
legal: clip(x.legal, 200), effective: isoDate(x.effective), source_name: clip(x.source_name, 80), source_url: safeUrl(x.source_url), date: isoDate(x.date) };
if (r.date && todayISO && r.date > todayISO) r.date = '';
if (r.effective && todayISO && r.effective > todayISO) r.warns.push('Văn bản chưa có hiệu lực (từ ' + dmy(r.effective) + ') – cân nhắc trước khi lưu');
if (_oz.val) {
const v = _o1a(x[_oz.val], 0, _oz.max);
if (v == null) r.issues.push(x[_oz.val] == null ? 'AI không tìm được mức thu' : 'Mức thu ngoài khoảng hợp lý – không lưu');
r.value = v == null ? null : Math.round(v * 1e5) / 1e7;
r.show = v == null ? '—' : _o1m(r.value);
r.current = _o1m(c[_oz.field]);
if (_oz.key === 'pit') {
const basis = fold(x.basis || '');
if (basis && !/^(price|gia)\b/.test(basis) && !/gia chuyen nhuong/.test(basis)) {
r.noteOnly = true;
r.basis_text = clip(x.basis_text || x.basis, 200);
r.warns.push('Cách tính không phải "% × giá chuyển nhượng" – app chưa tự tính theo cách này, chỉ lưu ghi chú; anh/chị sửa tay mức thu nếu cần');
r.show = (v == null ? '' : _o1m(r.value) + ' – ') + (r.basis_text || basis);
r.issues = r.issues.filter((s) => !/mức thu/.test(s));
}
}
} else if (_oz.key === 'notary') {
const tiers = parseNotaryTiers(x.tiers), max = _o1a(x.max, 1e6, 1e9);
if (!tiers) r.issues.push('Biểu phí công chứng không đọc được – giữ biểu cũ');
if (x.max != null && max == null) r.warns.push('Mức tối đa không hợp lệ – giữ mức cũ');
r.value = tiers ? { tiers, max } : null;
r.show = tiers ? _o2f(tiers, max || c.notary_max) : '—';
r.current = _o2f(c.notary_tiers, c.notary_max);
if (tiers && JSON.stringify(tiers) === JSON.stringify(c.notary_tiers) && (!max || max === c.notary_max)) r.show = r.current;
} else {
const t = clip(x.text || x.summary, 300);
if (!t) r.issues.push('AI không tìm được thông tin');
r.value = t || null; r.show = t || '—'; r.current = clip(c.appraisal_note, 300) || 'Theo Nghị quyết HĐND tỉnh (anh/chị nhập số khi tính)';
}
if (!r.source_url) r.issues.push('Không có link nguồn – không lưu');
if (!r.legal) r.warns.push('Không ghi văn bản căn cứ');
r.changed = r.value != null && r.show !== r.current;
r.ok = !r.issues.length;
out.push(r);
}
return out;
}
export function mergeFreshTax(cfgOver, items, opt = {}) {
const at = isoDate(opt.atISO) || '';
const _o1p = opt.selected == null ? null : new Set(opt.selected);
const _o1c = { ...(cfgOver && typeof cfgOver === 'object' ? cfgOver : {}) };
_o1c.legal = { ...(_o1c.legal || {}) }; _o1c.src = { ...(_o1c.src || {}) };
const applied = [];
for (const r of items || []) {
if (!r || !r.ok || (_o1p && !_o1p.has(r.key))) continue;
if (r.key === 'notary') { _o1c.notary_tiers = r.value.tiers; if (r.value.max) _o1c.notary_max = r.value.max; }
else if (r.key === 'appraisal') _o1c.appraisal_note = r.value;
else if (r.noteOnly) _o1c.pit_note = 'Theo ' + (r.legal || 'văn bản mới') + ': ' + (r.basis_text || r.show);
else { _o1c[r.field] = r.value; if (r.key === 'pit') delete _o1c.pit_note; }
if (r.legal) _o1c.legal[r.key] = r.legal + (r.effective ? ' (hiệu lực ' + dmy(r.effective) + ')' : '');
_o1c.src[r.key] = { name: r.source_name, url: r.source_url, date: r.date, effective: r.effective, legal: r.legal, at };
applied.push(r.key);
}
if (applied.length && at) { _o1c.ai_at = at; _o1c.ai_rep = num(opt.reputable, 0); _o1c.checked_at = at; }
return { cfg: _o1c, applied };
}
export function markTaxManual(cfgOver, next) {
const _o1c = { ...(cfgOver && typeof cfgOver === 'object' ? cfgOver : {}), ...next };
_o1c.src = { ...(_o1c.src || {}) };
const prev = taxConfig(cfgOver);
let changed = false;
for (const _oz of TAX_FRESH_ITEMS) { if (_oz.val && _oz.field in next && Math.abs(num(next[_oz.field]) - prev[_oz.field]) > 1e-9) { delete _o1c.src[_oz.key]; changed = true; } }
if (changed || ('checked_at' in next && next.checked_at !== _o1c.ai_at)) delete _o1c.ai_at;
return _o1c;
}
export function taxStamp(cfgOver) {
const c = taxConfig(cfgOver), _o1c = cfgOver && typeof cfgOver === 'object' ? cfgOver : {};
const ai = !!(_o1c.ai_at && _o1c.ai_at === c.checked_at);
return { date: c.checked_at, ai, text: 'Cập nhật ngày ' + dmy(c.checked_at) + (ai ? ' qua AI' + (_o1c.ai_rep ? ' (' + _o1c.ai_rep + ' trang uy tín)' : '') : '') +
' – chỉ mang tính tham khảo, kiểm tra lại với cơ quan thuế và văn phòng công chứng trước khi giao dịch.' };
}
export function taxSourceFor(cfg, rowKey) {
const k = { pit: 'pit', lptb: 'lptb', notary: 'notary', notary_b: 'notary', notary_s: 'notary', maint: 'maintenance', appraisal: 'appraisal' }[rowKey];
const s = k && cfg && cfg.src && cfg.src[k];
return s && safeUrl(s.url) ? s : null;
}
export const RENT_TAX_DEFAULTS = { threshold: 500e6, vat: 0.05, pit: 0.05, vat_on_excess_only: false };
export function rentTax(revenueYear, t = RENT_TAX_DEFAULTS) {
const R = Math.max(0, num(revenueYear)), th = num(t.threshold, 500e6);
if (R <= th) return { vat: 0, pit: 0, total: 0 };
const vat = (t.vat_on_excess_only ? R - th : R) * num(t.vat, 0.05), pit = (R - th) * num(t.pit, 0.05);
return { vat, pit, total: vat + pit };
}
export function irr(_op, lo = -0.99, hi = 1) {
const npv = (r) => _op.reduce((a, f, i) => a + f / Math.pow(1 + r, i), 0);
let a = lo, b = hi, fa = npv(a), fb = npv(b);
if (!isFinite(fa) || !isFinite(fb) || fa * fb > 0) return NaN;
for (let i = 0; i < 200; i++) { const m = (a + b) / 2, fm = npv(m); if (Math.abs(fm) < 1e-6) return m; if (fa * fm < 0) { b = m; fb = fm; } else { a = m; fa = fm; } }
return (a + b) / 2;
}
export function rentalPlan(_o1c = {}) {
const price = num(_o1c.price), buy = num(_o1c.buyCosts) + num(_o1c.furniture), loanAmt = Math.min(num(_o1c.loanAmount), price);
const equity = price + buy - loanAmt, H = Math.max(1, Math.min(40, Math.round(num(_o1c.horizon, 10))));
const _o1e = Math.min(1, Math.max(0, num(_o1c.occupancy, 1))), _ot = num(_o1c.rentGrowth), pg = num(_o1c.priceGrowth);
const A = loanAmt > 0 ? amortize({ principal: loanAmt, years: num(_o1c.years, 20), phases: [{ months: 1e6, ratePct: num(_o1c.ratePct) }], method: _o1c.method || 'annuity' }) : { rows: [] };
const tax = { ...RENT_TAX_DEFAULTS, ...(_o1c.tax || {}) };
const years = [];
let cum = 0, payback = null, paybackSale = null;
for (let y = 1; y <= H; y++) {
const gross = num(_o1c.rentMonthly) * 12 * _o1e * Math.pow(1 + _ot, y - 1);
const t = tax.enabled === false ? { total: 0 } : rentTax(gross, tax);
const opex = gross * num(_o1c.mgmtRate) + num(_o1c.maintYear) * Math.pow(1 + _ot, y - 1) + num(_o1c.otherYear);
const noi = gross - opex - t.total;
const _o2m = A.rows.filter((r) => r.m > (y - 1) * 12 && r.m <= y * 12);
const debt = _o2m.reduce((a, r) => a + r.pay, 0), interest = _o2m.reduce((a, r) => a + r.interest, 0);
const _oc = _o2m.length ? _o2m[_o2m.length - 1].balance : (A.rows.length && y * 12 > A.rows.length ? 0 : loanAmt);
const cf = noi - debt;
cum += cf;
const value = price * Math.pow(1 + pg, y);
const exit = value * (1 - num(_o1c.sellCostRate)) - _oc;
if (payback == null && cum >= equity) payback = y;
if (paybackSale == null && cum + exit - equity >= 0) paybackSale = y;
years.push({ y, gross, tax: t.total, opex, noi, debt, interest, cf, cum, value, balance: _oc, exit });
}
const _o2l = years[0];
const firstPay = A.rows[0] ? A.rows[0].pay : 0;
const _o22 = _o2l ? (_o2l.noi) / 12 : 0;
const _op = [-equity, ...years.map((x, i) => x.cf + (i === years.length - 1 ? x.exit : 0))];
return {
equity, loanAmt, years, payback, paybackSale,
grossYield: price ? num(_o1c.rentMonthly) * 12 / price : 0,
netYield: price + buy ? (_o2l ? _o2l.noi : 0) / (price + buy) : 0,
cashOnCash: equity > 0 && _o2l ? _o2l.cf / equity : NaN,
dscr: _o2l && _o2l.debt ? _o2l.noi / _o2l.debt : null,
monthlyRentNet: _o22, monthlyDebt: firstPay, monthlyGap: _o22 - firstPay,
rentToCover: _o1e > 0 && _o2l ? (_o2l.debt + _o2l.opex - _o2l.gross * num(_o1c.mgmtRate)) / 12 / _o1e / (1 - num(_o1c.mgmtRate)) : NaN,
irr: equity > 0 ? irr(_op) : NaN,
};
}
export function advancedCalc({ project, plans, type, area, unitPrice, extras = [], gift = 0, costOfCapital = 8, loanRate = 10, loanYears = 25, today, internal = {} }) {
const out = (parsePlans(plans) || []).map((plan) => {
const m = buildQuote({ project, type, area, unitPrice, plan, rate: loanRate, years: loanYears, today });
let price = m.total;
const applied = [];
for (const x of extras || []) {
const v = num(x.value);
if (!(v > 0)) continue;
const _ob = x.kind === 'amount' ? v : (x.base === 'after' ? price : m.unit.listPrice) * v / 100;
price -= _ob; applied.push({ label: x.label || 'Ưu đãi', amount: _ob });
}
const _ot = Math.max(0, num(gift));
if (_ot) { price -= _ot; applied.push({ label: 'Quà tặng quy đổi', amount: _ot }); }
price = Math.max(0, _o1y(price));
const k = m.total ? price / m.total : 0;
const _o24 = num(costOfCapital) / 1200;
const npv = m.steps.reduce((a, s) => a + s.amount * k / Math.pow(1 + _o24, Math.max(0, s.month)), 0);
const support = m.loan ? m.loan.supportedInterest * k : 0;
const effective = npv - support;
const commission = price * num(internal.commissionPct) / 100;
const netPrice = num(internal.netPrice);
return {
plan: m.plan, model: m, listPrice: m.unit.listPrice, planPrice: m.total, applied, price, perM2: area ? price / area : 0,
discountTotal: m.unit.listPrice - price, discountPct: m.unit.listPrice ? 1 - price / m.unit.listPrice : 0,
npv, support, effective, first: m.stages.first * k, loan: m.loan ? { amount: m.loan.amount * k, firstPay: m.loan.firstPay * k, support: m.loan.support } : null,
commission, overNet: netPrice > 0 ? price - netPrice : null, checkOk: m.check.ok,
};
});
if (out.length > 1) { const best = Math.min(...out.map((x) => x.effective)); out.forEach((x) => { x.best = x.effective === best; x.vsBest = x.effective - best; }); }
return out;
}
export function calcText(rows, { project, type, area, unitPrice, costOfCapital }, money = _o17) {
const _o14 = [`📊 ${project.name} – căn ${type} ${fmtNum(area)} m² (giá niêm yết ${fmtNum(unitPrice, 1)} triệu/m²)`];
rows.forEach((r) => {
_o14.push(`• ${r.plan.name}: giá thực ${money(r.price)} (${fmtNum(r.perM2 / 1e6, 1)} tr/m², giảm ${fmtNum(r.discountPct * 100, 1)}%)` +
`${r.loan ? `, vay ${money(r.loan.amount)}, hỗ trợ lãi ~${money(r.support)}` : ''}; quy về hôm nay ~${money(r.effective)}${r.best ? ' ✓ lợi nhất' : ''}`);
});
_o14.push(`Giá trị quy về hôm nay tính với chi phí vốn ${fmtNum(costOfCapital)}%/năm. Số liệu tham khảo, theo chính sách hiện hành của CĐT.`);
return _o14.join('\n');
}
export const RESEARCH_FIELDS = {
dev: { label: 'Chủ đầu tư', hint: 'tên đầy đủ' },
loc: { label: 'Vị trí', hint: 'địa chỉ / khu đô thị, phường, tỉnh' },
status: { label: 'Trạng thái bán', hint: 'đang bán | sắp mở bán | đã bàn giao' },
progress: { label: 'Tiến độ xây dựng', hint: 'đang thi công tới đâu (móng, tầng, cất nóc…) kèm tháng/năm' },
handover: { label: 'Bàn giao dự kiến', hint: 'MM/YYYY' },
price: { label: 'Giá niêm yết (triệu/m²)', hint: 'thấp-cao, ví dụ 70-85' },
types: { label: 'Loại căn & diện tích', hint: '1N: 45-50; 2N: 65-75' },
scale: { label: 'Quy mô', hint: 'số toà, số tầng, số căn' },
legal: { label: 'Pháp lý', hint: 'giấy phép xây dựng, đủ điều kiện bán… kèm số văn bản' },
amenities: { label: 'Tiện ích chính', hint: 'ngắn gọn' },
};
const _o8 = [['soon', /sap mo ban|sap ra mat|chuan bi mo ban|soon/], ['done', /da ban giao|hoan thanh|done/], ['sale', /dang ban|mo ban|sale/]];
export const STATUS_LABEL = { sale: 'Đang bán', soon: 'Sắp mở bán', done: 'Đã bàn giao', ask: 'Nhận bảng giá', low: 'Thấp tầng' };
export function researchPrompt(project, fields = Object.keys(RESEARCH_FIELDS)) {
const fl = fields.filter((f) => RESEARCH_FIELDS[f]).map((f) => `- ${f}: ${RESEARCH_FIELDS[f].label} (${RESEARCH_FIELDS[f].hint})`).join('\n');
return withRules([
'BDS_G1_RESEARCH',
`Tìm trên Google thông tin MỚI NHẤT về dự án bất động sản "${project.name}"${project.dev ? ' của ' + project.dev : ''}${project.loc ? ' (' + project.loc + ')' : ''}.`,
'Ưu tiên nguồn chính thức: trang chủ đầu tư, cổng thông tin Sở Xây dựng/UBND, báo chính thống. Không dùng tin rao vặt, không đoán.',
'Mỗi thông tin tìm được viết đúng MỘT dòng theo mẫu (không thêm chữ nào khác, không dùng markdown):',
'FACT | <mã trường> | <giá trị> | <link nguồn đầy đủ https://…> | <trích dẫn ngắn từ nguồn> | <ngày đăng nguồn YYYY-MM-DD hoặc để trống>',
'Mã trường được dùng:', fl,
'Không tìm thấy nguồn đáng tin cho trường nào thì BỎ trường đó (không viết dòng). Không viết số liệu không có trong nguồn.',
].join('\n'));
}
export function parseFacts(text) {
const s = String(text || ''), out = [];
const _o21 = /^[ \t>*-]*FACT\s*\|(.+)$/gim;
let m;
while ((m = _o21.exec(s))) {
const _o1l = m[1].split('|').map((x) => x.trim());
const field = (_o1l[0] || '').toLowerCase().replace(/[^a-z]/g, '');
if (!RESEARCH_FIELDS[field]) continue;
const _o2i = (_o1l[2] || '').match(/https?:\/\/[^\s<>"')]+/i);
out.push({ field, raw: _o1l[1] || '', url: _o2i ? _o2i[0].replace(/[.,;]+$/, '') : '', quote: _o1l[3] || '', date: /^\d{4}-\d{2}-\d{2}$/.test(_o1l[4] || '') ? _o1l[4] : '', start: m.index, end: m.index + m[0].length });
}
return out;
}
export function normalizeFact(field, raw) {
const v = String(raw || '').trim();
if (!v) return { ok: false, error: 'Trống' };
if (field === 'handover') {
const _o1v = fold(v).match(/quy\s*([1-4]|i{1,3}|iv)\D+(\d{4})/);
if (_o1v) { const _o1x = { i: 1, ii: 2, iii: 3, iv: 4 }[_o1v[1]] || Number(_o1v[1]); const _o16 = String(_o1x * 3).padStart(2, '0'); return { ok: true, value: `${_o1v[2]}-${_o16}`, display: `Quý ${_o1x}/${_o1v[2]} (lấy tháng ${_o16})` }; }
let m = v.match(/(\d{1,2})\s*[/.-]\s*(\d{4})/) || null;
if (m) { const _o16 = Number(m[1]); if (_o16 >= 1 && _o16 <= 12) return { ok: true, value: `${m[2]}-${String(_o16).padStart(2, '0')}`, display: `${String(_o16).padStart(2, '0')}/${m[2]}` }; }
m = v.match(/(\d{4})-(\d{2})/);
if (m && Number(m[2]) >= 1 && Number(m[2]) <= 12) return { ok: true, value: `${m[1]}-${m[2]}`, display: `${m[2]}/${m[1]}` };
return { ok: false, error: 'Không đọc được tháng/năm bàn giao' };
}
if (field === 'price') {
const _o1b = (v.match(/\d[\d.,]*/g) || []).map((x) => parseNum(x.replace(/[.,]$/, ''))).filter(isFinite);
if (!_o1b.length) return { ok: false, error: 'Không có số giá' };
let lo = _o1b[0], hi = _o1b[1] ?? _o1b[0];
if (lo >= 1e5) { lo /= 1e6; hi /= 1e6; }
if (!(lo > 5 && hi >= lo && hi < 2000)) return { ok: false, error: 'Giá/m² ngoài khoảng hợp lý (5–2.000 triệu)' };
return { ok: true, value: [lo, hi], display: `${fmtNum(lo, 1)}–${fmtNum(hi, 1)} triệu/m²` };
}
if (field === 'types') {
const t = parseTypesText(v.replace(/;/g, '\n'));
if (!t.length || t.some((x) => !x.ask && (!(x.a[0] > 10) || x.a[1] < x.a[0] || x.a[1] > 1000))) return { ok: false, error: 'Không đọc được loại căn – diện tích' };
return { ok: true, value: t, display: typesToText(t).replace(/\n/g, '; ') };
}
if (field === 'status') {
const f = fold(v);
for (const [k, _o21] of _o8) if (_o21.test(f)) return { ok: true, value: k, display: STATUS_LABEL[k] };
return { ok: false, error: 'Không hiểu trạng thái' };
}
return { ok: true, value: v.slice(0, 500), display: v.slice(0, 500) };
}
export const safeUrl = (u) => { const s = String(u ?? '').trim(); return /^https?:\/\/[^\s"'<>\\]+$/i.test(s) && s.length <= 2000 ? s : ''; };
export const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, '').toLowerCase(); } catch { return ''; } };
export function matchSources(facts, text, { sources = [], segments = [] } = {}) {
const s = String(text || '');
const _o29 = segments.map((_ot) => {
const i = _ot.text ? s.indexOf(_ot.text) : -1;
return { start: Number.isFinite(_ot.start) ? _ot.start : i, end: Number.isFinite(_ot.end) ? _ot.end : (i >= 0 ? i + _ot.text.length : -1), chunks: _ot.chunks || [] };
}).filter((x) => x.start >= 0);
return facts.map((f) => {
const idx = new Set();
_o29.forEach((sp) => { if (sp.start < f.end && sp.end > f.start) sp.chunks.forEach((c) => idx.add(c)); });
const h = hostOf(f.url);
if (h) sources.forEach((src, i) => { const t = String(src.title || '').toLowerCase().replace(/^www\./, ''); if (t && (t === h || h.endsWith('.' + t) || t.endsWith('.' + h) || hostOf(src.url) === h)) idx.add(i); });
const _o2a = [...idx].map((i) => sources[i]).filter((x) => x && /^https?:\/\//.test(x.url));
const _o2j = /^https?:\/\/[^\s]+\.[^\s]+/.test(f.url);
const status = _o2a.length ? 'grounded' : _o2j ? 'ai_only' : 'missing';
return { ...f, sources: _o2a, status };
});
}
const _o28 = (field, v) => {
if (v == null || v === '' || (Array.isArray(v) && !v.length)) return '—';
if (field === 'handover') return ymLabel(v) || String(v);
if (field === 'price') return Array.isArray(v) ? `${fmtNum(v[0], 1)}–${fmtNum(v[1], 1)} triệu/m²` : String(v);
if (field === 'types') return Array.isArray(v) ? typesToText(v).replace(/\n/g, '; ') : String(v);
if (field === 'status') return STATUS_LABEL[v] || String(v);
return String(v);
};
export const showFieldValue = _o28;
export function researchDiff(project, matched) {
const _o1z = { grounded: 0, ai_only: 1, missing: 2 };
const best = {};
for (const f of matched) {
const n = normalizeFact(f.field, f.raw);
const c = { ...f, norm: n };
const _oj = best[f.field];
if (!_oj || (n.ok && !_oj.norm.ok) || (n.ok === _oj.norm.ok && _o1z[c.status] < _o1z[_oj.status])) best[f.field] = c;
}
return Object.keys(RESEARCH_FIELDS).filter((k) => best[k]).map((k) => {
const f = best[k], oldV = project ? project[k] : null;
const changed = f.norm.ok && JSON.stringify(oldV ?? null) !== JSON.stringify(f.norm.value);
return { field: k, label: RESEARCH_FIELDS[k].label, old: _o28(k, oldV), new: f.norm.ok ? f.norm.display : f.raw, changed, ok: f.norm.ok && f.status !== 'missing', error: f.norm.error || (f.status === 'missing' ? 'Thiếu link nguồn' : ''), fact: f, value: f.norm.value };
});
}
export function applyResearch(data, rows, { now, by } = {}) {
const d = { ...(data && typeof data === 'object' ? data : {}) };
const src = { ...(d.g1_sources || {}) };
const _o2a = { ...(d.sources && typeof d.sources === 'object' ? d.sources : {}) };
for (const r of rows) {
if (!r || !r.ok || !r.fact) continue;
const _ot = r.fact.sources && r.fact.sources[0];
const url = _ot ? _ot.url : r.fact.url;
if (!/^https?:\/\//.test(String(url || ''))) continue;
d[r.field] = r.value;
src[r.field] = { url, title: _ot ? _ot.title : hostOf(r.fact.url), ai_url: r.fact.url, quote: String(r.fact.quote || '').slice(0, 300), date: r.fact.date || '', status: r.fact.status, at: now || 0, by: by || '' };
_o2a[r.field] = { url, title: _ot ? (_ot.title || hostOf(r.fact.url)) : hostOf(r.fact.url), at: now || 0, by: 'ai', user: by || '', date: r.fact.date || '', status: r.fact.status };
}
d.g1_sources = src;
d.sources = _o2a;
d.g1_research_at = now || 0;
return d;
}
export function fieldSource(data, field) {
const d = data && typeof data === 'object' ? data : {};
const s = (d.sources && d.sources[field]) || null;
if (s && typeof s === 'object') return s;
const _ot = d.g1_sources && d.g1_sources[field];
return _ot && typeof _ot === 'object' ? { url: _ot.url, title: _ot.title, at: _ot.at || 0, by: 'ai', user: _ot.by || '', date: _ot.date || '', status: _ot.status } : null;
}
export function markManual(prev, next, fields, { now, by } = {}) {
const _o1j = prev && typeof prev === 'object' ? prev : {};
const d = { ...(next && typeof next === 'object' ? next : {}) };
const _o2a = { ...(d.sources && typeof d.sources === 'object' ? d.sources : {}) };
let _o2h = false;
for (const f of fields || []) {
if (JSON.stringify(_o1j[f] ?? null) === JSON.stringify(d[f] ?? null)) continue;
_o2a[f] = { url: '', title: '', at: now || 0, by: 'manual', user: by || '' };
if (d.g1_sources && d.g1_sources[f]) { d.g1_sources = { ...d.g1_sources }; delete d.g1_sources[f]; }
_o2h = true;
}
if (_o2h || d.sources) d.sources = _o2a;
return d;
}
export const DIRS = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
const _o5 = { n: 'Bắc', ne: 'Đông Bắc', e: 'Đông', se: 'Đông Nam', s: 'Nam', sw: 'Tây Nam', w: 'Tây', nw: 'Tây Bắc', north: 'Bắc', east: 'Đông', south: 'Nam', west: 'Tây', northeast: 'Đông Bắc', southeast: 'Đông Nam', southwest: 'Tây Nam', northwest: 'Tây Bắc' };
export function normDir(v) {
if (v == null || v === '') return null;
const f = fold(v).replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
if (_o5[f.replace(/ /g, '')]) return _o5[f.replace(/ /g, '')];
const _ov = DIRS.slice().sort((a, b) => b.length - a.length).find((d) => f.includes(fold(d)));
return _ov || null;
}
export function layoutPrompt(project, code, opts = {}) {
const axes = !!(opts && opts.axes);
const _o1g = (x) => String(x == null ? '' : x).replace(/[\r\n"]+/g, ' ').trim().slice(0, 80);
return withRules([
'BDS_G1_LAYOUT',
`Đọc ảnh layout / mặt bằng tầng / bảng loại căn${project ? ' (dự án đang chọn trong app: ' + project.name + ')' : ''}${code ? ', căn cần chú ý: ' + code : ''}.`,
'Một ảnh có thể có NHIỀU căn (mặt bằng tầng ghi số từng căn, hoặc bảng loại căn) – liệt kê TỪNG căn.',
'Chỉ điền khi thấy trên ảnh, không đoán. Không thấy thì để null (số) hoặc "" (chữ).',
'KHÔNG tự quy đổi giữa thông thuỷ và tim tường (không nhân/chia hệ số). Ảnh chỉ ghi một con số có nhãn thì điền đúng trường đó, trường kia null.',
'Nhận diện chữ Việt: "DT thông thủy", "DTTT", "TT", "diện tích sử dụng" → area_carpet_m2; "diện tích tim tường", "DT tim tường", "DT xây dựng" → area_gross_m2;',
'"PN" = phòng ngủ; "1PN+1" / "1N+1" = 1 ngủ + 1 phòng đa năng; "1N+", "2N+1", "Studio" ghi đúng như ảnh vào unit_type; "căn góc" → corner=true.',
'Trả về DUY NHẤT JSON thuần (không giải thích, không markdown):',
'{"project_name":"tên dự án ghi trên ảnh hoặc \\"\\"","north_arrow":true|false,"too_many":false,',
'"units":[{"unit_code":"số/mã căn như ghi trên ảnh, vd 1205, A-12.05, S1.0805","unit_type":"đúng như ảnh ghi: Studio|1N|1N+|1N+1|2N|2N+1|3N…",',
'"bedrooms":số phòng ngủ hoặc null nếu không chắc,"wc":số hoặc null,"area_carpet_m2":số thông thuỷ hoặc null,"area_gross_m2":số tim tường hoặc null,',
'"corner":true|false|null,"balcony_dir":"hướng ban công hoặc null","door_dir":"hướng cửa chính hoặc null","view":"view nếu ảnh ghi, không thì \\"\\"",',
'"notes":"điều cần người xem kiểm lại","confidence":0..1}],',
'"unit_types_table":[{"unit_type":"…","area_carpet_m2":số|null,"area_gross_m2":số|null,"count":số|null}]}',
'unit_types_table chỉ điền khi ảnh có bảng tổng hợp loại căn; không có thì [].',
`Tối đa ${MAX_UNITS} căn mỗi lần. Ảnh có nhiều hơn ${MAX_UNITS} căn: chỉ trả ${MAX_UNITS} căn đầu và đặt "too_many":true để người dùng chia nhỏ ảnh.`,
'Hướng chỉ ghi khi ảnh có mũi tên chỉ hướng Bắc (north_arrow=true); không có thì để null. Hướng dùng: Bắc, Đông Bắc, Đông, Đông Nam, Nam, Tây Nam, Tây, Tây Bắc.',
...(axes ? [
'CHẾ ĐỘ TRỤC CĂN: ảnh là mặt bằng TẦNG ĐIỂN HÌNH – mỗi căn trên mặt bằng là MỘT TRỤC (các tầng điển hình giống nhau).',
'unit_code ghi đúng số căn/số trục như ảnh (vd 05, 1205, A-12.05) – app tự lấy số trục; mỗi trục chỉ một dòng.',
`Phân khu / toà do người dùng đã chọn trong app${opts.zone ? ': phân khu ' + _o1g(opts.zone) : ''}${opts.tower ? ', toà ' + _o1g(opts.tower) : ''}. KHÔNG đoán toà, không đổi tên toà; project_name chỉ ghi nếu ảnh có chữ.`,
] : []),
].join('\n'));
}
export function extractJsonObj(text) {
if (text && typeof text === 'object') return text;
const s = String(text || '');
const _on = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
const _od = _on ? _on[1] : s;
const a = _od.indexOf('{'), b = _od.lastIndexOf('}');
if (a < 0 || b < a) return null;
try { return JSON.parse(_od.slice(a, b + 1)); } catch { return null; }
}
function _o19(_o10, _o2g) {
const w = [];
const n = (v, lo, hi) => { const x = parseNum(v); return isFinite(x) && x >= lo && x <= hi ? x : null; };
const area = (v, label) => { if (v == null || v === '') return null; const x = n(v, AREA_MIN, AREA_MAX); if (x == null) w.push(`Diện tích ${label} AI đọc ngoài khoảng hợp lý (10–1.000 m²) – nhập lại`); return x; };
let _of = area(_o10.area_carpet_m2, 'thông thuỷ'), gross = area(_o10.area_gross_m2, 'tim tường'), unknown = null;
if (_o10.area_m2 != null && _o10.area_m2 !== '') {
const x = n(_o10.area_m2, AREA_MIN, AREA_MAX);
if (x == null) w.push('Diện tích AI đọc ngoài khoảng hợp lý – nhập lại');
else if (_o10.area_kind === 'thong_thuy') { if (_of == null) _of = x; }
else if (_o10.area_kind === 'tim_tuong') { if (gross == null) gross = x; }
else if (_of == null && gross == null) { unknown = x; w.push('Chưa rõ diện tích thông thuỷ hay tim tường'); }
}
if (_of != null && gross != null && gross < _of) w.push(`Diện tích tim tường (${fmtNum(gross)} m²) nhỏ hơn thông thuỷ (${fmtNum(_of)} m²) – kiểm lại`);
const _o1r = (v, label) => { if (v == null || v === '') return null; const x = n(v, 0, 10); if (x == null) w.push(`Số ${label} AI đọc ngoài khoảng 0–10 – nhập lại`); return x; };
const unit_type = normUnitType(_o10.unit_type);
let bedrooms = _o1r(_o10.bedrooms, 'phòng ngủ');
if (bedrooms == null && (_o10.bedrooms == null || _o10.bedrooms === '')) bedrooms = bedroomsFromType(unit_type);
const north_arrow = _o10.north_arrow === true || (_o10.north_arrow == null && _o2g.north_arrow === true);
const f = {
unit_code: String(_o10.unit_code ?? '').trim().slice(0, 40), unit_type, bedrooms, wc: _o1r(_o10.wc, 'WC'),
area_carpet_m2: _of, area_gross_m2: gross, area_m2: unknown, area_kind: unknown != null ? 'khong_ro' : null,
corner: _o10.corner === true || _o10.corner === false ? _o10.corner : null, north_arrow,
balcony_dir: normDir(_o10.balcony_dir), door_dir: normDir(_o10.door_dir),
view: String(_o10.view || '').trim().slice(0, 200), notes: String(_o10.notes || '').trim().slice(0, 500),
confidence: Math.max(0, Math.min(1, num(_o10.confidence ?? _o2g.confidence, 0))),
};
const _ot = { dirDropped: false, noArrow: !north_arrow, cornerUnknown: f.corner == null };
if (!north_arrow && (f.balcony_dir || f.door_dir)) { _ot.dirDropped = true; f.balcony_dir = null; f.door_dir = null; }
if (f.confidence < 0.6) w.push('AI không chắc chắn (độ tin ' + Math.round(f.confidence * 100) + '%) – soát kỹ từng ô');
return { unit: f, warnings: w, generic: _ot };
}
function _o12(u) {
const area_m2 = u.area_carpet_m2 ?? u.area_gross_m2 ?? u.area_m2 ?? null;
const area_kind = u.area_carpet_m2 != null ? 'thong_thuy' : u.area_gross_m2 != null ? 'tim_tuong' : 'khong_ro';
const { area_carpet_m2, area_gross_m2, unit_type, ...rest } = u;
return { ...rest, area_m2, area_kind };
}
export function normalizeLayout(input) {
const _o10 = extractJsonObj(input);
if (!_o10) return { ok: false, warnings: ['AI trả kết quả chưa đúng mẫu – bấm làm lại hoặc nhập tay.'], units: [], project_name: '', types_table: [], fields: null };
const _o2g = { north_arrow: _o10.north_arrow, confidence: _o10.confidence };
let raw = Array.isArray(_o10.units) ? _o10.units.filter((x) => x && typeof x === 'object') : [_o10];
const project_name = String(_o10.project_name || '').trim().slice(0, 120);
const types_table = (Array.isArray(_o10.unit_types_table) ? _o10.unit_types_table : []).filter((t) => t && typeof t === 'object').slice(0, 30).map((t) => {
const a = (v) => { const x = parseNum(v); return isFinite(x) && x >= AREA_MIN && x <= AREA_MAX ? x : null; };
const c = parseNum(t.count);
return { unit_type: normUnitType(t.unit_type), area_carpet_m2: a(t.area_carpet_m2), area_gross_m2: a(t.area_gross_m2), count: isFinite(c) && c >= 0 ? c : null };
}).filter((t) => t.unit_type);
const w = [];
if (!raw.length) return { ok: false, warnings: ['AI không thấy căn nào trên ảnh – thử ảnh rõ hơn hoặc tự nhập'], units: [], project_name, types_table, fields: null };
if (raw.length > MAX_UNITS || _o10.too_many === true) {
w.push(`Ảnh có nhiều hơn ${MAX_UNITS} căn – app chỉ lấy ${MAX_UNITS} căn đầu. Hãy chia nhỏ ảnh (cắt từng nửa tầng) rồi đọc tiếp.`);
raw = raw.slice(0, MAX_UNITS);
}
const done = raw.map((u) => _o19(u, _o2g));
const units = [], warnOf = [], _o27 = new Map();
done.forEach((d) => {
const k = unitKey(d.unit.unit_code);
if (k && _o27.has(k)) {
const i = _o27.get(k);
units[i] = mergeUnit(units[i], d.unit);
warnOf[i].push('AI đọc trùng số căn này nhiều lần – đã gộp làm một');
return;
}
if (k) _o27.set(k, units.length);
units.push(d.unit); warnOf.push(d.warnings);
});
const label = (u, i) => 'Căn ' + (u.unit_code || '? (dòng ' + (i + 1) + ')');
const _o1g = units.length === 1;
units.forEach((u, i) => { for (const x of [...new Set(warnOf[i])]) w.push(_o1g ? x : label(u, i) + ': ' + x); });
if (done.some((d) => d.generic.dirDropped)) w.push('Ảnh không có mũi tên chỉ hướng Bắc – đã bỏ hướng AI đoán, tự xác nhận hướng');
if (done.some((d) => d.generic.noArrow)) w.push('Không thấy mũi tên hướng Bắc: hướng ban công/cửa cần tự xác nhận');
if (_o1g && done[0].generic.cornerUnknown) w.push('Chưa rõ có phải căn góc');
return { ok: true, units, project_name, types_table, warnings: w, fields: _o12(units[0]) };
}
export function unitRow({ id, project, fields, imageName, provider, now, confirmedBy, prev = null }) {
const f = { ...fields };
if (f.area_carpet_m2 === undefined && f.area_gross_m2 === undefined && f.area_m2 != null) {
if (f.area_kind === 'thong_thuy') { f.area_carpet_m2 = f.area_m2; delete f.area_m2; delete f.area_kind; }
else if (f.area_kind === 'tim_tuong') { f.area_gross_m2 = f.area_m2; delete f.area_m2; delete f.area_kind; }
}
return unitRecord({ id, project, unit: f, imageName, provider, now, by: confirmedBy, status: REVIEW.ok, prev });
}
const _o1k = (r) => String(r.effective_from || (r.month ? r.month + '-01' : '') || '');
export function policyVersions(policies, projectId) {
return (policies || []).filter((r) => r && !Number(r.deleted) && String(r.project_id) === String(projectId))
.sort((a, b) => _o1k(b).localeCompare(_o1k(a)) || (Number(b.updated_at) || 0) - (Number(a.updated_at) || 0));
}
export function defaultPair(versions) {
const nw = versions[0] || null;
const old = nw ? versions.find((v) => v !== nw && v.status === 'active') || null : null;
return { newId: nw ? nw.id : '', oldId: old ? old.id : '' };
}
const _o4 = /đã mua|đã thuê|đã bán|đã cho thuê|ngừng|không tiềm năng/i;
export function matchProject(c, project) {
if (!c || !project) return false;
const a = fold(c.project);
return !!a && (a === fold(project.id) || a === fold(project.name) || a.includes(fold(project.name)));
}
export function affectedCustomers({ customers, quotes, events, project, newPolicyId, oldPolicyId }) {
const _o1w = {};
(quotes || []).filter((_o1v) => !Number(_o1v.deleted) && String(_o1v.project_id) === String(project.id)).forEach((_o1v) => {
const k = String(_o1v.object_id || ''); if (!k) return;
if (!_o1w[k] || (Number(_o1v.created_at) || 0) > (Number(_o1w[k].created_at) || 0)) _o1w[k] = _o1v;
});
const notified = new Set();
(events || []).forEach((e) => { if (Number(e.deleted)) return; let d = e.data; if (typeof d === 'string') { try { d = JSON.parse(d); } catch { d = {}; } } if (d && d.g1_notice && d.g1_notice === newPolicyId) notified.add(String(e.object_id)); });
return (customers || []).filter((c) => !Number(c.deleted) && (!c.kind || c.kind === 'customer') && !_o4.test(String(c.status || '')))
.map((c) => {
const _o1v = _o1w[c.id] || null, reasons = [];
if (_o1v) reasons.push(_o1v.policy_id && oldPolicyId && _o1v.policy_id === oldPolicyId ? 'đã nhận báo giá theo chính sách cũ' : 'đã nhận báo giá dự án');
if (matchProject(c, project)) reasons.push('đang quan tâm dự án');
return reasons.length ? { customer: c, quote: _o1v, reasons, notified: notified.has(String(c.id)) } : null;
}).filter(Boolean)
.sort((a, b) => (a.notified - b.notified) || (b.quote ? 1 : 0) - (a.quote ? 1 : 0) || (Number(b.customer.score) || 0) - (Number(a.customer.score) || 0));
}
export function requote(_o1v, newPlans) {
if (!_o1v) return null;
let m = _o1v.payload; if (typeof m === 'string') { try { m = JSON.parse(m); } catch { m = null; } }
const list = parsePlans(newPlans);
const _o1f = m && m.plan ? m.plan : { id: _o1v.plan_id };
const np = list.find((_o1j) => _o1j.id === _o1f.id) || list.find((_o1j) => _o1j.name && fold(_o1j.name) === fold(_o1f.name));
const listPrice = m && m.unit && m.unit.listPrice ? Number(m.unit.listPrice) : null;
if (!np || !listPrice) return { ok: false, oldTotal: Number(_o1v.price_total) || 0 };
const newTotal = Math.round(listPrice * Number(np.factor) / 1000) * 1000, oldTotal = Number(_o1v.price_total) || (m ? m.total : 0);
return { ok: true, planName: np.name, oldTotal, newTotal, delta: newTotal - oldTotal, unit: m.unit };
}
export function changeTone(d) {
if (!d || !d.path) return 0;
if (/\.factor$/.test(d.path)) return Number(d.new) < Number(d.old) ? 1 : -1;
if (/\.loan$/.test(d.path)) return Number(d.new) > Number(d.old) ? 1 : -1;
if (/\.htls$/.test(d.path)) { const v = (x) => (x === 'HANDOVER' || x === 'H' ? 999 : Number(x) || 0); return v(d.new) > v(d.old) ? 1 : -1; }
if (d.label === 'Bỏ phương án') return -1;
if (d.label === 'Thêm phương án') return 1;
return 0;
}
export function noticeText({ customer, project, changes, req, effective, sender }, money = _o17) {
const name = String(customer && customer.name || '').trim().split(/\s+/).pop() || '';
const _o14 = [`Dạ em chào anh/chị ${name},`.replace(' ,', ','),
`Em ${sender && sender.name ? sender.name + ' ' : ''}báo anh/chị chính sách bán hàng mới của ${project.name}${effective ? ' (hiệu lực ' + effective.split('-').reverse().join('/') + ')' : ''}:`];
(changes || []).slice(0, 4).forEach((c) => _o14.push('• ' + c));
if ((changes || []).length > 4) _o14.push(`• và ${changes.length - 4} điểm khác`);
if (req && req.ok && Math.abs(req.delta) >= 1e6) {
_o14.push(`Với căn ${req.unit && req.unit.type ? req.unit.type + ' ' : ''}em đã báo giá (${req.planName}): ${money(req.oldTotal)} → ${money(req.newTotal)} (${req.delta < 0 ? 'giảm ' : 'tăng '}${money(Math.abs(req.delta))}).`);
}
_o14.push('Anh/chị cần em gửi báo giá chi tiết theo chính sách mới không ạ?' + (sender && sender.phone ? ` (${sender.phone})` : ''));
return _o14.join('\n');
}
export function watermarkLayout(w, h, { name, phone, date }) {
const text = [name, phone, date].filter(Boolean).join(' · ');
const _os = Math.max(14, Math.round(Math.min(w, h) / 22));
const _o2b = Math.max(_os * text.length * 0.62, 200), stepY = _os * 5;
const items = [];
for (let y = -h; y < h * 2; y += stepY) for (let x = -w; x < w * 2; x += _o2b) items.push({ x: x + ((y / stepY) % 2 ? _o2b / 2 : 0), y });
const _or = Math.max(28, Math.round(_os * 1.8));
return { text, fontSize: _os, angle: -Math.PI / 6, alpha: 0.16, items, footer: { h: _or, text: 'Tài liệu do ' + text + ' cung cấp – chỉ dùng tham khảo, không phát tán' } };
}
const _om = (s) => new TextEncoder().encode(s);
export function buildPdf(pages) {
if (!pages || !pages.length) throw new Error('Không có trang nào');
const chunks = [], offsets = [];
let _o13 = 0;
const push = (x) => { const b = typeof x === 'string' ? _om(x) : x; chunks.push(b); _o13 += b.length; };
const _o1d = (id, _od) => { offsets[id] = _o13; push(`${id} 0 obj\n`); _od(); push('\nendobj\n'); };
push('%PDF-1.4\n'); push(new Uint8Array([37, 0xE2, 0xE3, 0xCF, 0xD3, 10]));
const n = pages.length, kids = pages.map((_, i) => `${3 + i * 3} 0 R`).join(' ');
_o1d(1, () => push('<< /Type /Catalog /Pages 2 0 R >>'));
_o1d(2, () => push(`<< /Type /Pages /Kids [${kids}] /Count ${n} >>`));
pages.forEach((_o1j, i) => {
const _o11 = _o1j.w > _o1j.h, PW = _o11 ? 842 : 595, PH = _o11 ? 595 : 842, M = 18;
const k = Math.min((PW - 2 * M) / _o1j.w, (PH - 2 * M) / _o1j.h);
const _ol = +(_o1j.w * k).toFixed(2), dh = +(_o1j.h * k).toFixed(2), dx = +((PW - _ol) / 2).toFixed(2), dy = +((PH - dh) / 2).toFixed(2);
const _o1q = 3 + i * 3, iid = _o1q + 1, cid = _o1q + 2;
const _oi = `q ${_ol} 0 0 ${dh} ${dx} ${dy} cm /Im0 Do Q`;
_o1d(_o1q, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources << /XObject << /Im0 ${iid} 0 R >> >> /Contents ${cid} 0 R >>`));
_o1d(iid, () => { push(`<< /Type /XObject /Subtype /Image /Width ${_o1j.w} /Height ${_o1j.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${_o1j.jpeg.length} >>\nstream\n`); push(_o1j.jpeg); push('\nendstream'); });
_o1d(cid, () => push(`<< /Length ${_oi.length} >>\nstream\n${_oi}\nendstream`));
});
const _o2k = _o13, total = 3 + n * 3;
push(`xref\n0 ${total}\n0000000000 65535 f \n`);
for (let i = 1; i < total; i++) push(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
push(`trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${_o2k}\n%%EOF\n`);
const out = new Uint8Array(_o13);
let _o1c = 0; for (const c of chunks) { out.set(c, _o1c); _o1c += c.length; }
return out;
}

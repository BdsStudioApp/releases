import { fmtMoney, fmtNum, fold, htlsTxt, policyLabel, ymLabel } from './sales.js';
import { pageScript } from './landing_runtime.js';
import { goalsOf, goalSectionOn, GOAL_SECTION_IDS, switcherItems, listingItems, maskCode, PRICE_BUCKETS } from './landing_goals.js';
export const LANDING_VERSION = 1;
export const KEY_PREFIX = 'landing.page.';
export const DEFAULT_COLORS = { c1: '#0E1B2E', c2: '#C9A25B' };
export const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap';
export const SECTIONS = {
hero: 'Ảnh bìa & tiêu đề', location: 'Vị trí & tiện ích', price: 'Bảng giá tham khảo', loan: 'Tính khoản vay', policy: 'Chính sách bán hàng',
gallery: 'Ảnh', form: 'Form nhận thông tin', contact: 'Nút Zalo / Gọi', doc: 'Tài liệu đổi số Zalo', facts: 'Thông tin căn',
event: 'Thời gian & chương trình', agent: 'Giới thiệu bản thân', projects: 'Dự án đang tư vấn',
intro: 'Giới thiệu dự án', usps: 'Điểm nổi bật', cashflow: 'Lộ trình đóng tiền', reasons: 'Lý do nên đăng ký sớm', steps: 'Quy trình giao dịch',
booking: 'Đăng ký booking', listings: 'Rổ hàng Đang bán / Cho thuê', kygui: 'Chủ nhà ký gửi'
};
export const TEMPLATES = {
luxury: { title: 'Luxury Advisor', icon: '💎', fit: 'BĐS cao cấp, tư vấn 1:1', theme: 'lux', dark: true, c1: '#121212', c2: '#C9A25B', font: 'serif',
desc: 'Tối giản sang trọng, nền tối + vàng champagne, đặt lịch tư vấn riêng 1:1.',
order: ['hero', 'agent', 'projects', 'intro', 'price', 'policy', 'location', 'form', 'contact'], off: ['policy'] },
hub: { title: 'Project Hub', icon: '🧭', fit: 'Phân phối nhiều dự án', theme: 'tech', c1: '#0B2E6B', c2: '#2F7BF6', font: 'sans',
desc: 'Nền sáng, 3 nút nhu cầu, lưới dự án, bảng giá – khách tự chọn đúng nhu cầu.',
order: ['hero', 'projects', 'price', 'policy', 'loan', 'form', 'agent', 'contact'], off: ['agent'] },
insider: { title: 'Market Insider', icon: '📰', fit: 'Khách đầu tư thích số liệu', theme: 'editorial', c1: '#1B1B1F', c2: '#B3261E', font: 'serif',
desc: 'Kiểu tạp chí: góc nhìn thị trường, dự án theo khu vực, đăng ký nhận bản tin.',
order: ['hero', 'intro', 'location', 'projects', 'form', 'agent', 'contact'], off: [] },
bio: { title: 'Link Bio', icon: '📱', fit: 'Link trên kênh TikTok/Facebook', theme: 'bento', dark: true, c1: '#1A1530', c2: '#C6F432', font: 'sans',
desc: 'Tối ưu điện thoại: ảnh đại diện, ô bấm nhanh, dự án nổi bật, thanh Gọi/Zalo nổi.',
order: ['hero', 'projects', 'loan', 'form', 'contact'], off: ['loan'] },
lead60: { title: 'Lead 60 giây', icon: '⚡', fit: 'Chạy quảng cáo 1 dự án', theme: 'clean', c1: '#1F2430', c2: '#F28C28', font: 'sans',
desc: 'Gọn 2 màn hình: ảnh + điểm nổi bật + form nhận tài liệu ngay dưới.',
order: ['hero', 'usps', 'form', 'intro', 'price', 'policy', 'contact'], off: ['policy'] },
residence: { title: 'Branded Residence', icon: '🏛', fit: 'Căn hộ hạng sang, hàng hiệu', theme: 'cinema', dark: true, c1: '#0D0D0D', c2: '#D4B26A', font: 'serif',
desc: 'Kiểu điện ảnh: ảnh bìa tràn màn hình, giới thiệu dự án, mặt bằng loại căn, nhà mẫu.',
order: ['hero', 'intro', 'gallery', 'price', 'location', 'form', 'contact'], off: [] },
cashflow: { title: 'Cashflow', icon: '💹', fit: 'Nhà đầu tư tính dòng tiền', theme: 'finance', c1: '#0E3B43', c2: '#2BB673', font: 'sans',
desc: 'Vốn ban đầu, lộ trình đóng tiền từng đợt, tính khoản vay, bảng giá.',
order: ['hero', 'cashflow', 'loan', 'price', 'policy', 'form', 'contact'], off: [] },
prelaunch: { title: 'Pre-Launch / VIP', icon: '🚀', fit: 'Dự án sắp ra, đang nhận đăng ký', theme: 'fomo', c1: '#7A1020', c2: '#F5D7A1', font: 'serif',
desc: 'Đếm ngược ngày ra mắt (khi có ngày), 3 lý do đăng ký sớm. Không nhận cọc.',
order: ['hero', 'reasons', 'intro', 'form', 'contact'], off: [] },
township: { title: 'Township', icon: '🌳', fit: 'Đại đô thị nhiều tiện ích', theme: 'fresh', c1: '#14432A', c2: '#7CC36B', font: 'sans',
desc: 'Đại đô thị: giới thiệu, tiện ích, vị trí, bảng giá, đăng ký tham quan cuối tuần.',
order: ['hero', 'intro', 'location', 'gallery', 'price', 'form', 'contact'], off: [] },
secondary: { title: 'Secondary', icon: '🔐', fit: 'Hàng chuyển nhượng, căn độc quyền', theme: 'market', c1: '#22303C', c2: '#16A3A3', font: 'sans',
desc: 'Rổ hàng chuyển nhượng, mã căn che 2 số cuối, quy trình giao dịch rõ ràng.',
order: ['hero', 'steps', 'projects', 'form', 'contact'], off: [] },
project: { title: 'Dự án', icon: '🏢', basic: true, desc: 'Giới thiệu 1 dự án: vị trí, bảng giá tham khảo, chính sách, tính khoản vay, form nhận báo giá.',
order: ['hero', 'location', 'price', 'policy', 'loan', 'gallery', 'doc', 'form', 'contact'], off: ['doc'] },
resale: { title: 'Ký gửi – thứ cấp', icon: '🔑', basic: true, desc: 'Một căn cần bán/cho thuê: thông tin căn, ảnh, vị trí, tính khoản vay, đặt lịch xem nhà.',
order: ['hero', 'facts', 'gallery', 'location', 'loan', 'price', 'doc', 'form', 'contact'], off: ['price', 'doc'] },
event: { title: 'Sự kiện – mở bán', icon: '🎉', basic: true, desc: 'Đăng ký tham dự mở bán/hội thảo: thời gian, địa điểm, chương trình, chính sách, đếm ngược.',
order: ['hero', 'event', 'policy', 'price', 'location', 'gallery', 'doc', 'form', 'contact'], off: ['price', 'gallery', 'doc'] },
agent: { title: 'Trang cá nhân môi giới', icon: '🧑‍💼', basic: true, desc: 'Giới thiệu bản thân, dự án đang tư vấn, nhận ký gửi, form liên hệ.',
order: ['hero', 'agent', 'projects', 'loan', 'doc', 'form', 'contact'], off: ['loan', 'doc'] }
};
export const TEMPLATE_IDS = Object.keys(TEMPLATES);
export const MAIN_TEMPLATE_IDS = TEMPLATE_IDS.filter((id) => !TEMPLATES[id].basic);
export const BASIC_TEMPLATE_IDS = TEMPLATE_IDS.filter((id) => TEMPLATES[id].basic);
export const isMainTemplate = (id) => !!(TEMPLATES[id] && !TEMPLATES[id].basic);
export function fullOrder(_o2j) {
const _o1p = (TEMPLATES[_o2j] || TEMPLATES.project).order.slice();
const add = GOAL_SECTION_IDS.filter((s) => !_o1p.includes(s));
const at = _o1p.indexOf('form') >= 0 ? _o1p.indexOf('form') : _o1p.length;
_o1p.splice(at, 0, ...add);
return _o1p;
}
const _o9 = ['location', 'facts', 'event', 'agent', 'doc'];
export function esc(s) {
return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
const _o1o = (s) => esc(s).replace(/\n/g, '<br>');
const lines = (s) => String(s || '').split(/\n+/).map((_o2u) => _o2u.trim()).filter(Boolean);
const _o15 = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
export const validColor = (_og) => /^#[0-9a-f]{6}$/i.test(String(_og || ''));
export function slugify(s) {
return fold(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50).replace(/-+$/, '');
}
export const validSlug = (s) => /^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])$/.test(String(s || '')) && !/--/.test(String(s));
export function normPhone(raw) {
let s = String(raw == null ? '' : raw).replace(/[\s.\-()]/g, '');
if (/^\+84/.test(s)) s = '0' + s.slice(3); else if (/^84\d{9,10}$/.test(s)) s = '0' + s.slice(2);
return /^0[35789]\d{8}$/.test(s) || /^02\d{9}$/.test(s) ? s : '';
}
export const phoneText = (p) => { const s = normPhone(p); return s.length === 10 ? s.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3') : s; };
export function imageUrl(_o2k) {
const s = String(_o2k || '').trim();
const _o1g = s.match(/^https:\/\/drive\.google\.com\/file\/d\/([\w-]{10,})/) || s.match(/^https:\/\/drive\.google\.com\/(?:open|uc|thumbnail)\?(?:[^#]*&)?id=([\w-]{10,})/);
if (_o1g) return 'https://drive.google.com/thumbnail?id=' + _o1g[1] + '&sz=w1600';
return /^https:\/\/[^\s"'<>\\]+$/i.test(s) && s.length <= 1000 ? s : '';
}
export const safeHttps = (_o2k) => (/^https:\/\/[^\s"'<>\\]+$/i.test(String(_o2k || '').trim()) && String(_o2k).trim().length <= 1000 ? String(_o2k).trim() : '');
export function normBaseUrl(_o2k) {
const s = String(_o2k || '').trim().replace(/\/+$/, '');
return /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/[a-z0-9._~\/-]*)?$/i.test(s) ? s + '/' : '';
}
export const PIXEL_RE = { fb: /^\d{8,20}$/, tiktok: /^[A-Z0-9]{10,30}$/i, google: /^(G|AW|GT|DC)-[A-Z0-9]{4,20}$/i };
export const PIXEL_NAMES = { fb: 'Facebook Pixel', tiktok: 'TikTok Pixel', google: 'Google (gtag)' };
export function activePixels(cfg) {
const _o23 = (cfg && cfg.pixels) || {};
const _o1s = {};
for (const _o18 of Object.keys(PIXEL_RE)) { const p = _o23[_o18] || {}; const id = String(p.id || '').trim(); if (p.on && PIXEL_RE[_o18].test(id)) _o1s[_o18] = id; }
return _o1s;
}
function _o26(seed) { let _o2u = 0; for (const _oh of String(seed || 'mau')) _o2u = (_o2u * 31 + _oh.charCodeAt(0)) >>> 0; return () => { _o2u = (_o2u * 1664525 + 1013904223) >>> 0; return _o2u / 4294967296; }; }
export function sampleSvg(seed, hue, kind = 'city') {
const R = _o26(seed + kind);
const [h1, h2] = Array.isArray(hue) && hue.length >= 2 ? hue.map((_o2u) => Math.round(Number(_o2u) || 0) % 360) : [210, 230];
let _oc = '';
if (kind === 'person') {
_oc = `<rect width="400" height="400" fill="hsl(${h1},35%,32%)"/><circle cx="200" cy="160" r="72" fill="hsl(${h2},25%,78%)"/><path d="M70 400c10-100 70-150 130-150s120 50 130 150z" fill="hsl(${h2},25%,78%)"/>`;
return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">${_oc}</svg>`);
}
const _o2b = `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${h1},45%,${kind === 'room' ? 88 : 30}%)"/><stop offset="1" stop-color="hsl(${h2},40%,${kind === 'room' ? 76 : 62}%)"/></linearGradient></defs><rect width="1200" height="750" fill="url(#g)"/>`;
if (kind === 'room') {
_oc = `<rect x="0" y="520" width="1200" height="230" fill="hsl(${h2},20%,60%)"/><rect x="120" y="140" width="380" height="300" rx="6" fill="hsl(${h1},50%,92%)" stroke="hsl(${h2},20%,55%)" stroke-width="10"/>` +
`<line x1="310" y1="140" x2="310" y2="440" stroke="hsl(${h2},20%,55%)" stroke-width="8"/><rect x="640" y="400" width="420" height="140" rx="26" fill="hsl(${h1},25%,40%)"/><rect x="660" y="340" width="380" height="90" rx="22" fill="hsl(${h1},25%,48%)"/>` +
`<rect x="880" y="120" width="12" height="230" fill="hsl(${h2},15%,35%)"/><ellipse cx="886" cy="120" rx="70" ry="30" fill="hsl(${h2},40%,90%)"/>`;
} else {
let _o2u = 30;
while (_o2u < 1180) {
const _o2o = 60 + Math.round(R() * 90), hgt = (kind === 'park' ? 120 : 220) + Math.round(R() * (kind === 'park' ? 140 : 330));
const _o1d = 18 + Math.round(R() * 18);
_oc += `<rect x="${_o2u}" y="${640 - hgt}" width="${_o2o}" height="${hgt}" fill="hsl(${h1},25%,${_o1d}%)" opacity=".92"/>`;
for (let _o2t = 640 - hgt + 18; _o2t < 620; _o2t += 34) _oc += `<rect x="${_o2u + 10}" y="${_o2t}" width="${_o2o - 20}" height="8" fill="hsl(${h2},60%,80%)" opacity=".25"/>`;
_o2u += _o2o + 14 + Math.round(R() * 30);
}
_oc += `<rect x="0" y="640" width="1200" height="110" fill="hsl(${h2},${kind === 'park' ? 45 : 20}%,${kind === 'park' ? 38 : 22}%)"/>`;
for (let _o10 = 0; _o10 < 9; _o10++) { const _oj = 60 + _o10 * 135 + Math.round(R() * 30); _oc += `<circle cx="${_oj}" cy="650" r="${26 + Math.round(R() * 18)}" fill="hsl(${120 + Math.round(R() * 40)},35%,${28 + Math.round(R() * 10)}%)"/>`; }
}
return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750">${_o2b}${_oc}</svg>`);
}
const _oa = { sale: 'Đang bán', soon: 'Sắp mở bán', done: 'Đã bàn giao', ask: 'Nhận bảng giá', low: 'Thấp tầng' };
export const priceLabel = (p) => (p && p.price ? `${fmtNum(p.price[0], 1)}–${fmtNum(p.price[1], 1)} triệu/m²` : '');
export function priceRows(p, plans) {
if (!p || !p.price || !Array.isArray(p.types)) return [];
const fs = (plans || []).map((_o2u) => Number(_o2u.factor)).filter((_o2u) => _o2u > 0);
const _or = fs.length ? Math.min(...fs) : 1, fmax = fs.length ? Math.max(...fs) : 1;
return p.types.filter((t) => t && t.n).map((t) => {
if (t.ask || !Array.isArray(t.a)) return { type: t.n, area: 'Liên hệ', price: 'Liên hệ', ask: true };
const lo = t.a[0] * p.price[0] * 1e6 * _or, hi = t.a[1] * p.price[1] * 1e6 * fmax;
return { type: t.n, area: `${fmtNum(t.a[0])}–${fmtNum(t.a[1])} m²`, lo, hi, price: `${fmtMoney(lo)} – ${fmtMoney(hi)}` };
});
}
export function policyRows(plans) {
return (plans || []).map((_o1y) => ({
name: _o1y.name || '', sub: _o1y.sub || '', disc: fmtNum((1 - (Number(_o1y.factor) || 1)) * 100, 1) + '%',
loan: _o1y.loan ? fmtNum(_o1y.loan * 100, 1) + '%' : 'Không vay', htls: _o1y.loan ? htlsTxt(_o1y.htls) : '–', steps: (_o1y.steps || []).length
}));
}
export function priceNote(policy) {
return policy && policy.month
? `Giá tham khảo theo ${policyLabel(policy).toLowerCase()}, có thể thay đổi. Giá thực tế theo phiếu tính giá và hợp đồng tại thời điểm ký.`
: 'Giá tham khảo theo chính sách tham khảo của chủ đầu tư, có thể thay đổi. Giá thực tế theo phiếu tính giá và hợp đồng tại thời điểm ký.';
}
export function loanDefaults(data) {
const rows = priceRows(data && data.project, data && data.plans).filter((r) => !r.ask);
const price = rows.length ? Math.round(Math.min(...rows.map((r) => r.lo)) / 1e7) / 100 : 3;
const ltv = Math.round(Math.max(0, ...((data && data.plans) || []).map((p) => Number(p.loan) || 0)) * 100) || 70;
const cfg = (data && data.cfg) || {};
return { price, ltv: Math.min(ltv, 80), rate: Number(cfg.RATE) || 10, years: Number(cfg.LOAN_YEARS) || 25 };
}
const _o27 = (seed, kind = 'city') => ({ kind: 'sample', seed: String(seed || 'mau'), look: kind });
const _o21 = (p) => !!(p && Array.isArray(p.price) && p.price[0] > 0);
export function defaultUsps(p) {
if (!p) return '';
return [p.loc ? 'Vị trí: ' + p.loc : '', p.handover ? 'Bàn giao dự kiến: ' + ymLabel(p.handover) : '', p.scale ? 'Quy mô: ' + p.scale : '',
p.legal ? 'Pháp lý: ' + p.legal : '', _o21(p) ? 'Giá tham khảo: ' + priceLabel(p) : ''].filter(Boolean).map((_o2u) => String(_o2u).slice(0, 160)).join('\n');
}
function _o1i(template, p, prof, goals) {
const pname = p ? p.name : '', dev = p && p.dev ? p.dev : '', st = (p && _oa[p.status]) || '';
const _o2s = [prof.name, prof.title, prof.company].filter(Boolean).join(' · ');
const loc = (p && p.loc) || '';
const booking = goals.includes('booking');
const _o1 = {
luxury: ['Tư vấn bất động sản cao cấp', pname ? pname + ' – tư vấn riêng 1:1' : 'Tư vấn bất động sản cao cấp, bảo mật thông tin', _o2s || 'Danh mục căn hộ chọn lọc theo vị trí, chủ đầu tư và tiềm năng tài sản.', '🔒 Đặt lịch tư vấn 1:1'],
hub: [prof.brand || prof.name || 'Dự án đang phân phối', 'Tìm căn hộ hợp nhu cầu và dòng tiền của anh/chị', 'Bảng giá, chính sách, phương án vay minh bạch – nhận thông tin qua Zalo.', '🏠 Nhận tư vấn chọn căn'],
insider: ['Góc nhìn thị trường', 'Quy hoạch, hạ tầng và cơ hội đầu tư', 'Phân tích ngắn gọn và rổ hàng theo khu vực hưởng lợi từ hạ tầng.', '📰 Nhận bản tin thị trường qua Zalo'],
bio: [prof.title || 'Chuyên viên tư vấn', prof.name || 'Họ tên của anh/chị', 'Tư vấn mua, bán, cho thuê căn hộ – nhận bảng giá & quỹ căn qua Zalo.', '📩 Nhận bảng giá & quỹ căn tuần này'],
lead60: [[dev, st].filter(Boolean).join(' · ') || 'Dự án', pname || 'Tên dự án', loc, '📩 Nhận trọn bộ tài liệu'],
residence: [dev || 'Căn hộ hạng sang', pname || 'Tên dự án', loc, '✉️ Nhận thư mời tham quan nhà mẫu'],
cashflow: [pname ? pname + ' · dòng tiền' : 'Dòng tiền khi mua căn hộ', pname ? 'Sở hữu ' + pname + ' với vốn ban đầu rõ ràng' : 'Bài toán dòng tiền khi mua căn hộ', 'Vốn tự có, lịch đóng tiền, phương án vay – số liệu tham khảo, chưa phải giá chính thức.', '📑 Nhận file bóc tách dòng tiền'],
prelaunch: ['Giai đoạn đăng ký sớm' + (dev ? ' · ' + dev : ''), pname || 'Tên dự án', loc || 'Đăng ký sớm để nhận thông tin chính thức ngay khi chủ đầu tư công bố.', '⭐ Đăng ký ưu tiên nhận thông tin chọn căn'],
township: [[dev, st].filter(Boolean).join(' · ') || 'Đại đô thị', pname || 'Tên dự án', loc, '🚌 Đăng ký tham quan cuối tuần'],
secondary: [prof.brand || prof.name || 'Rổ hàng chuyển nhượng', 'Rổ hàng chuyển nhượng – giá tốt, pháp lý rõ ràng', 'Mã căn che 2 ký tự cuối để bảo vệ chủ nhà. Ảnh thực tế và pháp lý gửi qua Zalo.', '🔓 Nhận danh sách căn qua Zalo']
}[template];
if (booking && template === 'prelaunch') _o1[3] = '⭐ Đăng ký booking ưu tiên';
return { eyebrow: _o1[0], heading: _o1[1], sub: _o1[2], cta: _o1[3] };
}
export function newLanding({ id, template = 'project', project = null, profile = {}, data = {}, now = Date.now(), goals = null, infoOnly = null } = {}) {
if (!TEMPLATES[template]) template = 'project';
const T = TEMPLATES[template];
const _o1h = !T.basic;
const g = goalsOf(goals);
const p = project || null;
const pname = p ? p.name : '';
const prof = profile || {};
const brandName = prof.brand || prof.name || 'Chuyên viên tư vấn';
const order = fullOrder(template);
const on = {}; for (const s of order) { const _ov = goalSectionOn(s, g); on[s] = _ov === null ? !T.off.includes(s) : _ov; }
const _o12 = infoOnly == null ? (_o1h ? !_o21(p) : false) : !!infoOnly;
const _o1e = loanDefaults({ project: p, plans: data.plans, cfg: data.cfg });
const _o2h = {
project: pname ? `${pname} – bảng giá tham khảo, chính sách mới nhất` : 'Dự án – bảng giá tham khảo, chính sách mới nhất',
resale: pname ? `Cần bán căn hộ ${pname}` : 'Cần bán căn hộ',
event: pname ? `Sự kiện mở bán ${pname}` : 'Sự kiện mở bán',
agent: `${prof.name || 'Chuyên viên'} – tư vấn mua bán căn hộ`
};
const mh = _o1h ? _o1i(template, p, prof, g) : null;
if (_o1h) _o2h[template] = pname && mh.heading !== pname ? mh.heading : (pname ? `${pname} – ${_o12 ? 'thông tin dự án' : 'bảng giá, chính sách mới nhất'}` : mh.heading);
const cfg = {
v: LANDING_VERSION, id: String(id || ''), template, name: _o2h[template].slice(0, 80),
slug: slugify((template === 'agent' || template === 'bio' ? prof.name || 'trang-ca-nhan' : pname || (_o1h ? template : 'trang')) + (template === 'event' ? '-mo-ban' : template === 'resale' ? '-can-ban' : '')) || 'trang-' + String(id || '').slice(-6),
project_id: p ? p.id : '', projects: (template === 'agent' || _o1h) && p ? [p.id] : [],
goals: g, infoOnly: _o12, listings: [], useInventory: true,
brand: { name: brandName, c1: T.c1 || DEFAULT_COLORS.c1, c2: T.c2 || DEFAULT_COLORS.c2, font: T.font || 'serif' },
contact: { name: prof.name || '', title: prof.title || 'Chuyên viên tư vấn bất động sản', phone: normPhone(prof.phone), zalo: normPhone(prof.zalo || prof.phone), cert: prof.cchn || '', company: prof.company || '', avatar: _o1h ? null : _o27('ava', 'person') },
seo: { title: _o2h[template].slice(0, 70), description: '', base_url: '', og_image: null },
pixels: { fb: { on: false, id: '' }, tiktok: { on: false, id: '' }, google: { on: false, id: '' } },
order, on,
s: {
hero: _o1h ? { ...mh, image: ['bio', 'insider', 'secondary'].includes(template) ? null : _o27(p ? p.id : template, 'city') } : {
eyebrow: template === 'event' ? 'Sự kiện' : template === 'agent' ? 'Chuyên viên tư vấn' : (p && _oa[p.status]) || 'Dự án',
heading: template === 'agent' ? (prof.name || 'Họ tên của anh/chị') : template === 'resale' ? (pname ? `Căn hộ ${pname}` : 'Căn hộ cần bán') : (pname || 'Tên dự án'),
sub: template === 'project' ? [p && p.loc, p && p.dev ? 'Chủ đầu tư ' + p.dev : ''].filter(Boolean).join(' · ') || 'Vị trí dự án'
: template === 'event' ? 'Đăng ký tham dự để nhận chính sách ưu đãi và chọn căn sớm.'
: template === 'agent' ? 'Tư vấn mua, bán, cho thuê căn hộ – số liệu rõ ràng, đúng chính sách.' : [p && p.loc].filter(Boolean).join(' · ') || 'Vị trí căn hộ',
cta: template === 'event' ? 'Đăng ký tham dự' : template === 'resale' ? 'Đặt lịch xem nhà' : template === 'agent' ? 'Nhận tư vấn' : 'Nhận bảng giá',
image: _o27(p ? p.id : template, template === 'resale' ? 'room' : 'city')
},
location: { text: p && p.loc ? p.loc : (_o1h ? '' : 'Địa chỉ dự án …'), items: _o1h ? (p && p.amenities ? String(p.amenities).split(/[,;\n]+/).map((_o2u) => _o2u.trim()).filter(Boolean).slice(0, 8).join('\n') : '') : 'Trường học – … phút\nBệnh viện – … phút\nTrung tâm thương mại – … phút\nCông viên – … phút' },
price: { note: '' },
loan: { price: _o1e.price, ltv: _o1e.ltv, rate: _o1e.rate, years: _o1e.years },
policy: { note: '' },
gallery: { images: _o1h ? [] : [_o27((p ? p.id : 'g') + '1', 'city'), _o27((p ? p.id : 'g') + '2', 'room'), _o27((p ? p.id : 'g') + '3', 'park')] },
form: {
heading: template === 'event' ? 'Đăng ký tham dự' : template === 'resale' ? 'Đặt lịch xem nhà' : template === 'agent' ? 'Để lại thông tin – em liên hệ ngay'
: _o12 ? 'Để lại số – nhận thông tin dự án qua Zalo' : template === 'lead60' ? 'Nhận trọn bộ tài liệu' + (pname ? ' ' + pname : '') : template === 'prelaunch' ? 'Đăng ký ưu tiên' + (pname ? ' ' + pname : '')
: template === 'insider' ? 'Bản tin thị trường & quỹ căn hằng tuần' : template === 'township' ? 'Đăng ký tham quan dự án' : 'Nhận bảng giá & chính sách mới nhất',
sub: template === 'prelaunch' ? 'Miễn phí · không đặt cọc · nhận thông tin qua Zalo.' : 'Chuyên viên gửi thông tin qua Zalo hoặc gọi lại đúng cách anh/chị chọn.',
button: template === 'event' ? 'Đăng ký' : template === 'resale' ? 'Đặt lịch' : template === 'prelaunch' ? 'Đăng ký ưu tiên' : template === 'insider' ? 'Đăng ký nhận bản tin' : 'Nhận thông tin', interest: true
},
doc: { title: pname ? `Tài liệu ${pname}: mặt bằng, bảng giá, tiến độ thanh toán` : 'Tài liệu dự án: mặt bằng, bảng giá, tiến độ thanh toán', desc: 'Để lại số Zalo – chuyên viên gửi tài liệu trong ít phút.', button: 'Nhận tài liệu qua Zalo', url: '' },
facts: { items: `Loại căn: …\nDiện tích: … m²\nTầng: …\nHướng: …\nNội thất: …\nPháp lý: …\nGiá chào: … tỷ` },
event: { date: '', time: '09:00', place: 'Địa điểm sự kiện …', agenda: '09:00 – Đón khách\n09:30 – Giới thiệu dự án và chính sách\n10:30 – Chọn căn, giải đáp' },
agent: _o1h ? { bio: '', bullets: '' } : { bio: 'Giới thiệu ngắn về kinh nghiệm, khu vực và loại sản phẩm anh/chị tư vấn …', bullets: 'Tính dòng tiền, phương án vay rõ ràng\nCập nhật chính sách mới nhất của chủ đầu tư\nHỗ trợ ký gửi bán, cho thuê' },
projects: {},
contact: {},
intro: { text: '' },
usps: { items: defaultUsps(p) },
cashflow: { note: '' },
reasons: { items: 'Ưu tiên nhận mặt bằng và thông tin chọn căn sớm nhất\nNhận chính sách giai đoạn đầu ngay khi chủ đầu tư công bố\nĐăng ký miễn phí, không đặt cọc', date: '' },
steps: { items: 'Xem căn và kiểm tra pháp lý\nĐặt cọc theo hợp đồng\nCông chứng chuyển nhượng\nSang tên và bàn giao' },
booking: { heading: 'Đăng ký booking ưu tiên', sub: 'Để lại số Zalo để giữ thứ tự ưu tiên chọn căn, nhận chính sách booking và mặt bằng ngay khi chủ đầu tư công bố.', button: '⭐ Đăng ký booking ưu tiên',
pay: 'Thanh toán theo tiến độ\nVay ngân hàng\nThanh toán sớm\nChưa rõ – cần tư vấn' },
listings: { heading: 'Rổ hàng chuyển nhượng – cho thuê', sub: 'Mã căn che 2 ký tự cuối để bảo vệ chủ nhà. Ảnh thực tế và pháp lý gửi qua Zalo.' },
kygui: { heading: 'Chủ nhà ký gửi bán / cho thuê', sub: 'Gửi thông tin căn – chuyên viên định giá tham khảo và tìm khách giúp anh/chị.', button: '📝 Gửi thông tin ký gửi' }
},
samples: _o1h ? [] : _o9.filter((s) => T.order.includes(s)),
created_at: now, updated_at: now, published: {}
};
if (_o1h && template === 'insider' && !p) cfg.on.intro = false;
cfg.seo.description = (template === 'project' || _o1h) && p
? `${p.name}${p.loc ? ' – ' + p.loc : ''}. ${_o12 ? 'Thông tin dự án, tiến độ, pháp lý' : 'Bảng giá tham khảo theo loại căn, chính sách thanh toán, tính khoản vay'}. Nhận thông tin qua Zalo.`.slice(0, 160)
: `${_o2h[template]}. Để lại thông tin để được tư vấn qua Zalo hoặc điện thoại.`.slice(0, 160);
if (template === 'resale' && p) { const t = (p.types || []).find((_o2u) => !_o2u.ask); if (t) cfg.s.facts.items = `Loại căn: ${t.n}\nDiện tích: … m²\nTầng: …\nHướng: …\nNội thất: …\nPháp lý: …\nGiá chào: … tỷ`; }
return cfg;
}
export function applyGoals(cfg, goals) {
const g = goalsOf(goals);
const on = { ...cfg.on };
for (const s of GOAL_SECTION_IDS) on[s] = goalSectionOn(s, g);
const order = cfg.order.slice();
for (const s of GOAL_SECTION_IDS) if (!order.includes(s)) { const at = order.indexOf('form'); order.splice(at >= 0 ? at : order.length, 0, s); }
return { ...cfg, goals: g, on, order };
}
export function switchTemplate(cfg, _o2j) {
if (!TEMPLATES[_o2j] || _o2j === cfg.template) return cfg;
const T = TEMPLATES[_o2j];
const order = fullOrder(_o2j);
const on = {};
for (const s of order) { const _ov = goalSectionOn(s, cfg.goals); on[s] = _ov === null ? (s in cfg.on && cfg.order.includes(s) ? !!cfg.on[s] : !T.off.includes(s)) : _ov; }
on.hero = true;
return { ...cfg, template: _o2j, order, on, brand: { ...cfg.brand, c1: T.c1 || cfg.brand.c1, c2: T.c2 || cfg.brand.c2, font: T.font || cfg.brand.font },
samples: (cfg.samples || []).filter((_o2u) => order.includes(_o2u)) };
}
export function clearSample(cfg, section) { return { ...cfg, samples: (cfg.samples || []).filter((s) => s !== section) }; }
export function normalizeLanding(raw) {
if (!_o15(raw)) return null;
const _o2j = TEMPLATES[raw.template] ? raw.template : 'project';
const base = newLanding({ id: raw.id, template: _o2j, goals: raw.goals, infoOnly: raw.infoOnly == null ? false : raw.infoOnly });
const cfg = { ...base, ...raw, template: _o2j };
cfg.goals = goalsOf(raw.goals);
cfg.infoOnly = !!raw.infoOnly;
cfg.useInventory = raw.useInventory !== false;
cfg.listings = Array.isArray(raw.listings) ? raw.listings.filter(_o15).slice(0, 60) : [];
cfg.brand = { ...base.brand, ...(_o15(raw.brand) ? raw.brand : {}) };
if (!validColor(cfg.brand.c1)) cfg.brand.c1 = DEFAULT_COLORS.c1;
if (!validColor(cfg.brand.c2)) cfg.brand.c2 = DEFAULT_COLORS.c2;
cfg.contact = { ...base.contact, ...(_o15(raw.contact) ? raw.contact : {}) };
cfg.seo = { ...base.seo, ...(_o15(raw.seo) ? raw.seo : {}) };
cfg.pixels = { ...base.pixels };
for (const _o18 of Object.keys(base.pixels)) if (_o15(raw.pixels) && _o15(raw.pixels[_o18])) cfg.pixels[_o18] = { on: !!raw.pixels[_o18].on, id: String(raw.pixels[_o18].id || '') };
cfg.s = { ...base.s };
for (const _o18 of Object.keys(base.s)) if (_o15(raw.s) && _o15(raw.s[_o18])) cfg.s[_o18] = { ...base.s[_o18], ...raw.s[_o18] };
const _o19 = fullOrder(_o2j);
cfg.order = Array.isArray(raw.order) ? raw.order.filter((_o2u) => _o19.includes(_o2u)) : _o19.slice();
for (const _o18 of _o19) if (!cfg.order.includes(_o18)) { const at = GOAL_SECTION_IDS.includes(_o18) && cfg.order.indexOf('form') > 0 ? cfg.order.indexOf('form') : cfg.order.length; cfg.order.splice(at, 0, _o18); }
cfg.on = { ...base.on, ...(_o15(raw.on) ? raw.on : {}) };
for (const _o18 of GOAL_SECTION_IDS) if (!(_o15(raw.on) && _o18 in raw.on)) cfg.on[_o18] = goalSectionOn(_o18, cfg.goals);
cfg.on.hero = true;
cfg.samples = Array.isArray(raw.samples) ? raw.samples.filter((_o2u) => _o9.includes(_o2u)) : [];
cfg.projects = Array.isArray(raw.projects) ? raw.projects.map(String).slice(0, 12) : [];
cfg.published = _o15(raw.published) ? raw.published : {};
return cfg;
}
export function checkLanding(cfg, data = {}, { server = '', mode = 'zip', images = {} } = {}) {
const _o1s = [];
const err = (text, fix) => _o1s.push(fix ? { level: 'error', text, fix } : { level: 'error', text }), warn = (text, fix) => _o1s.push(fix ? { level: 'warn', text, fix } : { level: 'warn', text });
if (!validSlug(cfg.slug)) err('Đường dẫn trang chỉ gồm chữ thường không dấu, số và dấu gạch nối (3–50 ký tự).');
const on = (s) => cfg.order.includes(s) && cfg.on[s];
if (!normPhone(cfg.contact.phone) && (on('contact') || on('form'))) err('Thiếu số điện thoại liên hệ đúng dạng (mục Liên hệ).', { group: 'lp-g-contact', field: 'lp-f-contact-phone', phone: 1 });
if (on('form') && !server) (mode === 'gas' ? err : warn)('Chưa nối máy chủ Google của anh/chị – form chưa lưu được khách (đang xem thử).');
if (!on('form') && !on('contact')) warn('Trang không có form và không có nút Zalo/Gọi – khách không liên hệ được.');
const _o23 = cfg.pixels || {};
for (const _o18 of Object.keys(PIXEL_RE)) if (_o23[_o18] && _o23[_o18].on && !PIXEL_RE[_o18].test(String(_o23[_o18].id || '').trim())) err(`Mã ${PIXEL_NAMES[_o18]} chưa đúng dạng.`);
if (!String(cfg.seo.title || '').trim()) warn('Chưa có tiêu đề SEO.');
if (!String(cfg.seo.description || '').trim()) warn('Chưa có mô tả SEO.');
const _o1x = data.project;
if (_o1x && (_o1x.sample === true || /^mau_/.test(String(_o1x.id || '')))) err(`Dự án "${_o1x.name}" là dự án Mẫu – chọn dự án thật (thêm ở Thông tin dự án).`, { group: 'lp-g-base', field: 'lp-project' });
for (const _o2e of (cfg.samples || []).filter(on)) err(`Mục "${SECTIONS[_o2e]}" còn chữ Mẫu – sửa nội dung (hoặc tắt mục này).`, { group: 'lp-g-sections', sec: _o2e });
const _o7 = /đ[iị]a ch[iỉ] m[aẫ]u|m[aẫ]u\s*[–-]\s*thay b[aằ]ng/i;
const _oz = [cfg.s.hero.eyebrow, cfg.s.hero.heading, cfg.s.hero.sub].map((_o2u) => String(_o2u || '')).join(' ');
if (/^(tên dự án|họ tên của anh\/chị)$/i.test(String(cfg.s.hero.heading || '').trim())) err('Tiêu đề lớn còn chữ mẫu "' + String(cfg.s.hero.heading).trim() + '" – chọn dự án hoặc ghi tên thật.', { group: 'lp-g-sections', sec: 'hero', field: 'lp-f-s-hero-heading' });
if (_o7.test(_oz)) err('Ảnh bìa & tiêu đề còn chữ mẫu ("Địa chỉ mẫu – thay bằng vị trí thật") – sửa Mô tả ngắn.', { group: 'lp-g-sections', sec: 'hero', field: 'lp-f-s-hero-sub' });
if (on('location') && _o7.test(String(cfg.s.location.text || '')) && !(cfg.samples || []).includes('location')) err('Mục "Vị trí & tiện ích" còn chữ mẫu – ghi vị trí thật.', { group: 'lp-g-sections', sec: 'location' });
const _o11 = allImages(cfg).filter((_o2u) => _o2u.on);
const _o2 = { hero: ['Ảnh bìa', { group: 'lp-g-sections', sec: 'hero', field: 'lp-img-s-hero-image' }], avatar: ['Ảnh đại diện', { group: 'lp-g-contact', field: 'lp-img-contact-avatar' }],
og: ['Ảnh khi chia sẻ', { group: 'lp-g-seo', field: 'lp-img-seo-og_image' }] };
for (const _o2u of _o11.filter((y) => y.img.kind === 'sample')) {
const g = /^gallery\.(\d+)$/.exec(_o2u.path);
const [label, fix] = g ? ['Ảnh ' + (Number(g[1]) + 1) + ' (mục Ảnh)', { group: 'lp-g-sections', sec: 'gallery', field: 'lp-img-s-gallery-images-' + g[1] }] : _o2[_o2u.path] || ['Ảnh', null];
err(label + ' đang là ảnh minh hoạ Mẫu – tải ảnh tự chụp, dán link ảnh, hoặc bỏ ảnh.', fix);
}
if (_o11.some((_o2u) => _o2u.img.kind === 'local' && !images[_o2u.img.id])) warn('Có ảnh tải lên từ máy khác, máy này không có – ảnh đó sẽ thay bằng ảnh Mẫu.');
if (on('price') && !cfg.infoOnly && !priceRows(data.project, data.plans).length) warn('Dự án chưa có giá trong Thông tin dự án – mục Bảng giá sẽ ẩn.');
if (on('event') && !/^\d{4}-\d{2}-\d{2}$/.test(String(cfg.s.event.date || ''))) warn('Chưa chọn ngày sự kiện.');
if (on('doc') && cfg.s.doc.url && !safeHttps(cfg.s.doc.url)) err('Link tài liệu phải bắt đầu bằng https://');
if (mode === 'zip' && !normBaseUrl(cfg.seo.base_url)) warn('Chưa điền địa chỉ trang (tên miền) – sitemap và ảnh chia sẻ Facebook chưa dùng được.', { group: 'lp-g-seo', field: 'lp-f-seo-base_url' });
return _o1s;
}
export function allImages(cfg) {
const on = (s) => cfg.order.includes(s) && !!cfg.on[s];
const _o1s = [];
if (cfg.s.hero && cfg.s.hero.image) _o1s.push({ path: 'hero', img: cfg.s.hero.image, on: true });
(cfg.s.gallery.images || []).forEach((img, _o10) => _o1s.push({ path: 'gallery.' + _o10, img, on: on('gallery') }));
if (cfg.contact.avatar) _o1s.push({ path: 'avatar', img: cfg.contact.avatar, on: cfg.template === 'agent' || cfg.template === 'bio' || cfg.template === 'luxury' || on('agent') });
if (cfg.seo.og_image) _o1s.push({ path: 'og', img: cfg.seo.og_image, on: true });
return _o1s.filter((_o2u) => _o15(_o2u.img));
}
function _o1f(hex) {
const n = parseInt(String(hex).slice(1), 16);
const _oh = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
return 0.2126 * _oh[0] + 0.7152 * _oh[1] + 0.0722 * _oh[2];
}
const _o6 = `.lp-2c{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px}
.lp-kick{display:inline-block;font-size:12px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;color:var(--c2)}
.lp-switch{background:var(--card);border-bottom:1px solid var(--line)}.lp-switch .lp-wrap{padding:18px 16px}.lp-switch h2{font-size:22px;margin-bottom:10px}
.lp-swg{display:grid;grid-template-columns:1fr 1fr;gap:8px}.lp-swg a{display:flex;align-items:center;gap:8px;min-height:56px;padding:10px 12px;border:1px solid var(--line);border-radius:14px;text-decoration:none;font-weight:600;font-size:15px;background:var(--bg)}
.lp-swg a span{font-size:22px}
.lp-chips{display:grid;gap:8px;margin-top:16px}.lp-chip{display:flex;align-items:center;gap:8px;min-height:48px;padding:10px 14px;border-radius:14px;text-decoration:none;font-weight:700;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.28)}
.lp-cdnote{margin:14px 0 0;font-size:14px;color:rgba(255,255,255,.8)}
.lp-ini{display:grid;place-items:center;background:rgba(255,255,255,.1);color:var(--c2);font:800 36px "Playfair Display",Georgia,serif}
.lp-ava-lg{width:160px;height:160px;justify-self:center}.lp-ava-lg.lp-ini{font-size:64px}
.lp-ava-xl{width:132px;height:132px;margin:0 auto}.lp-ava-xl.lp-ini{font-size:56px}
.lp-hero-bio .lp-wrap{text-align:center;justify-items:center}.lp-hero-bio h1{margin:10px 0 4px}
.lp-bento{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%;text-align:left}
.lp-tile{display:flex;flex-direction:column;gap:4px;min-height:92px;padding:14px;border-radius:18px;text-decoration:none;font-weight:800;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16)}
.lp-tile small{font-weight:500;font-size:12px;opacity:.8}.lp-tile-1{grid-column:1/-1;background:var(--c2);color:var(--on2);border:0}
.lp-agent{display:flex;gap:14px;align-items:flex-start}.lp-agent b{font-size:18px}.lp-agent p{margin:4px 0 8px}
.lp-lead2{font-size:17px;margin:0 0 14px}.lp-h3{font-size:18px;margin:16px 0 10px}
.lp-facts{display:grid;gap:8px;margin:0}.lp-facts div{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px 12px}.lp-facts dt{font-size:12px;color:var(--muted)}.lp-facts dd{margin:2px 0 0;font-weight:600}
.lp-num,.lp-steps,.lp-tl{list-style:none;margin:0;padding:0;display:grid;gap:8px;counter-reset:n}
.lp-num li,.lp-steps li,.lp-tl li{counter-increment:n;position:relative;padding:12px 12px 12px 52px;background:var(--card);border:1px solid var(--line);border-radius:14px;min-height:48px}
.lp-num li::before,.lp-steps li::before,.lp-tl li::before{content:counter(n);position:absolute;left:12px;top:10px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:var(--c1);color:#fff;font-weight:800;font-size:14px}
.lp-steps-s{margin:12px 0 16px}.lp-steps-s li{padding:10px 10px 10px 50px;font-weight:600}
.lp-tl small{display:block;color:var(--muted)}
.lp-g3{display:grid;gap:10px}.lp-big{font:800 30px "Playfair Display",Georgia,serif;color:var(--c2)}.lp-g3 p{margin:6px 0 0}
.lp-tabs2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:6px 0 10px}.lp-tabs2 button{min-height:48px;border-radius:14px;border:1px solid var(--line);background:var(--card);color:var(--ink);font:600 16px "Be Vietnam Pro",system-ui,sans-serif;cursor:pointer}
.lp-tabs2 button.on{background:var(--c1);color:#fff;border-color:var(--c1)}
.lp-filt{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:8px}.lp-filt select:first-child{grid-column:1/-1}
.lp-units{display:grid;gap:12px;margin-top:8px}
.lp-unit{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:16px;display:grid;gap:6px}
.lp-ut{display:flex;justify-content:space-between;align-items:center;gap:8px}.lp-ut code{font-size:13px;color:var(--muted)}
.lp-tag{display:inline-block;font-size:12px;font-weight:700;padding:4px 10px;border-radius:999px;background:rgba(127,127,127,.14)}
.lp-up{font-size:22px;font-weight:800;margin:4px 0}.lp-unit .lp-btn{width:100%}
.lp-kybtn{margin-left:auto;min-height:44px;padding:10px 14px;font-size:15px}
.lp-ask{font-size:14px;font-weight:600;padding:8px 12px;border-radius:12px;background:rgba(127,127,127,.12)}
.lp-ask[hidden],.lp-none[hidden],[data-lp-list] [hidden]{display: none}
section[id],nav[id],details[id]{scroll-margin-top:64px}
.lp-t-luxury,.lp-t-residence{--r:6px}
.lp-t-hub{--bg:#F4F7FC;--line:#DCE4F2}.lp-t-insider{--bg:#FBF8F3}.lp-t-insider .lp-hero{background:var(--bg);color:var(--ink)}.lp-t-insider .lp-lead,.lp-t-insider .lp-cdnote{color:var(--muted)}
.lp-t-insider .lp-eyebrow{border-color:var(--c2)}.lp-t-insider .lp-btn-2{color:var(--ink)}
.lp-t-lead60{--bg:#FFFFFF}.lp-t-cashflow{--bg:#F2F7F6}.lp-t-prelaunch{--bg:#FBF3EA}.lp-t-township{--bg:#F3F8F1}.lp-t-secondary{--bg:#F1F5F7}
.lp-t-residence .lp-hero.lp-has-img .lp-wrap{min-height:72vh;align-content:end}
.lp-t-prelaunch .lp-cd{font-size:20px}`;
const DARK_CSS = `.lp-dark{--bg:#111114;--card:#1B1B21;--ink:#F2EFE8;--muted:#B5B0A6;--line:#2E2D35;--sh:none}
.lp-dark .lp-pref label{background:#fff}.lp-dark .lp-dock{background:rgba(17,17,20,.96)}.lp-dark .lp-dock:not(.lp-dock-nr) .c{background:#fff;color:#111114}.lp-dark .lp-tabs2 button.on{background:var(--c2);color:var(--on2);border-color:var(--c2)}
.lp-dark .lp-num li::before,.lp-dark .lp-steps li::before,.lp-dark .lp-tl li::before{background:var(--c2);color:var(--on2)}
.lp-dark .lp-ck a{color:var(--c2)}`;
export function pageCss(cfg) {
const c1 = validColor(cfg.brand.c1) ? cfg.brand.c1 : DEFAULT_COLORS.c1, c2 = validColor(cfg.brand.c2) ? cfg.brand.c2 : DEFAULT_COLORS.c2;
const _ox = cfg.brand.font === 'sans' ? '"Be Vietnam Pro",system-ui,sans-serif' : '"Playfair Display",Georgia,serif';
const _o1q = _o1f(c2) > 0.42 ? '#1A1405' : '#FFFFFF';
const _ob = TEMPLATES[cfg.template] || {};
return `:root{--c1:${c1};--c2:${c2};--on2:${_o1q};--inbg:#fff;--inink:#151B26;--bg:#FAF7F1;--card:#fff;--ink:#151B26;--muted:#5F6878;--line:#E7E1D6;--ok:#17784A;--bad:#B0281F;--r:18px;--sh:0 10px 30px rgba(14,27,46,.10)}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 "Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding-bottom:76px}
h1,h2,h3{font-family:${_ox};line-height:1.15;letter-spacing:-.2px;margin:0}
a{color:inherit}img{max-width:100%;height:auto;display:block}figure{margin:0}
h1,h2,h3,p,li,dd,b{overflow-wrap:break-word}
.lp-wrap{max-width:1080px;margin:0 auto;padding:0 16px}
.lp-top{position:sticky;top:0;z-index:20;background:var(--c1);color:#fff}
.lp-top .lp-wrap{display:flex;align-items:center;gap:10px;min-height:56px}
.lp-brand{font-weight:800;font-size:17px;letter-spacing:.2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lp-pill{margin-left:auto;display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:9px 14px;min-height:44px;font-weight:700;font-size:14px;text-decoration:none;background:var(--c2);color:var(--on2);white-space:nowrap}
.lp-hero{background:radial-gradient(120% 90% at 85% 0%,rgba(255,255,255,.12) 0%,rgba(255,255,255,0) 55%),var(--c1);color:#fff;overflow:hidden}
.lp-hero .lp-wrap{display:grid;gap:22px;padding:28px 16px 36px}
.lp-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--c2);border:1px solid var(--c2);padding:5px 12px;border-radius:999px}
.lp-hero h1{font-size:clamp(28px,7vw,50px);margin:14px 0 10px}
.lp-lead{font-size:17px;color:rgba(255,255,255,.82);margin:0 0 18px}
.lp-cta{display:flex;flex-wrap:wrap;gap:10px}
.lp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:14px;padding:14px 20px;min-height:48px;font:700 16px "Be Vietnam Pro",system-ui,sans-serif;text-decoration:none;cursor:pointer;background:var(--c2);color:var(--on2)}
.lp-btn-2{background:transparent;color:inherit;border:1px solid currentColor}
.lp-btn:disabled{opacity:.5;cursor:not-allowed}
.lp-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-top:20px}
.lp-kpi{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.16);border-radius:14px;padding:10px 12px}
.lp-kpi small{display:block;color:rgba(255,255,255,.7);font-size:12px}.lp-kpi b{font-size:16px}
.lp-fig{position:relative;border-radius:var(--r);overflow:hidden;background:rgba(255,255,255,.06);aspect-ratio:16/10}
.lp-fig img{width:100%;height:100%;object-fit:cover}
.lp-badge{display:inline-block;font:700 11px/1 "Be Vietnam Pro",system-ui,sans-serif;letter-spacing:.3px;text-transform:uppercase;background:#FFE7A8;color:#5A4300;border-radius:999px;padding:5px 9px;vertical-align:middle}
.lp-fig .lp-badge{position:absolute;left:10px;top:10px}
.lp-ava{width:88px;height:88px;border-radius:50%;overflow:hidden;border:3px solid var(--c2);flex:none;position:relative}
.lp-ava img{width:100%;height:100%;object-fit:cover}.lp-ava .lp-badge{position:absolute;left:50%;bottom:4px;transform:translateX(-50%)}
.lp-me{display:flex;gap:14px;align-items:center;margin-top:16px}.lp-me b{display:block;font-size:18px}.lp-me span{color:rgba(255,255,255,.75);font-size:14px}
.lp-sec{padding:34px 0 6px}
.lp-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px}.lp-h h2{font-size:clamp(23px,5vw,32px)}
.lp-card{background:var(--card);border:1px solid var(--line);border-radius:var(--r);padding:18px;box-shadow:var(--sh)}
.lp-muted{color:var(--muted);font-size:14px}
.lp-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}.lp-list li{padding:10px 12px;background:var(--card);border:1px solid var(--line);border-radius:12px}
.lp-list li::before{content:"✦";color:var(--c2);margin-right:8px}
.lp-tbl{width:100%;border-collapse:collapse;font-size:15px}.lp-tbl th,.lp-tbl td{text-align:left;padding:10px 8px;border-bottom:1px solid var(--line);vertical-align:top}
.lp-tbl th{font-size:13px;color:var(--muted);font-weight:600}.lp-tbl td.n,.lp-tbl th.n{text-align:right;white-space:nowrap}
.lp-scroll{overflow-x:auto}
.lp-gal{display:grid;grid-template-columns:1fr 1fr;gap:10px}.lp-gal .lp-fig:first-child{grid-column:1/-1}
.lp-grid{display:grid;gap:12px}
.lp-pcard{background:var(--card);border:1px solid var(--line);border-radius:var(--r);overflow:hidden}.lp-pcard .lp-fig{border-radius:0}.lp-pcard div.lp-pb{padding:12px 14px}
.lp-pcard b{display:block;font-size:17px}
.lp-form{display:grid;gap:12px}
.lp-f{display:grid;gap:6px;font-size:14px;font-weight:600}
.lp-in{width:100%;min-height:48px;border:1px solid var(--line);border-radius:12px;padding:10px 12px;font:16px "Be Vietnam Pro",system-ui,sans-serif;background:var(--inbg);color:var(--inink)}
.lp-ck{display:flex;gap:10px;align-items:flex-start;font-size:14px;font-weight:400;color:var(--ink)}.lp-ck input{width:22px;height:22px;flex:none;margin-top:2px;accent-color:var(--c1)}
.lp-pref{display:flex;flex-wrap:wrap;gap:8px;font-size:14px}.lp-pref label{color:var(--inink);display:flex;align-items:center;gap:6px;min-height:44px;border:1px solid var(--line);border-radius:999px;padding:8px 14px;background:#fff}
.lp-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.lp-err{color:var(--bad);font-size:14px;font-weight:600;min-height:1em}
.lp-trust{font-size:13px;color:var(--muted);text-align:center}
.lp-done{color:#151B26;background:#EAF6EF;border:1px solid #BFE3CD;border-radius:14px;padding:16px;display:grid;gap:8px}.lp-done-h{font-weight:800;font-size:18px;margin:0}.lp-done p{margin:0}
.lp-calc{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:10px}
.lp-out{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.lp-out div{background:var(--bg);border-radius:12px;padding:10px}.lp-out small{display:block;color:var(--muted);font-size:12px}.lp-out b{font-size:17px}
.lp-cd{display:inline-block;margin-top:12px;font-weight:700;color:var(--c2)}
.lp-docbox{display:grid;gap:12px}
details.lp-pol{margin-top:8px}details.lp-pol summary{cursor:pointer;color:#fff;text-decoration:underline;display:flex;align-items:center;min-height:44px}
footer.lp-foot{background:var(--c1);color:rgba(255,255,255,.72);font-size:13px;margin-top:40px;padding:26px 0 30px}footer.lp-foot b{color:#fff}footer.lp-foot p{margin:0 0 10px}
.lp-dock{position:fixed;left:0;right:0;bottom:0;z-index:30;display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);gap:8px;padding:8px 10px calc(8px + env(safe-area-inset-bottom));background:rgba(255,255,255,.96);border-top:1px solid var(--line)}
.lp-dock a{white-space:nowrap;font-size:15px;display:flex;align-items:center;justify-content:center;gap:6px;min-height:48px;border-radius:14px;font-weight:800;text-decoration:none}
.lp-dock a{padding:0 6px;overflow:hidden;text-overflow:ellipsis}
.lp-dock .z{background:#0068FF;color:#fff}.lp-dock .c{background:var(--c1);color:#fff}.lp-dock .r{background:var(--c2);color:var(--on2)}.lp-dock-nr .c{background:var(--c2);color:var(--on2)}
.lp-kb .lp-dock{display: none}
${_o6}
${_ob.dark ? DARK_CSS : ''}
@media (min-width:760px){
 .lp-hero .lp-wrap{grid-template-columns:1.15fr .85fr;align-items:center;padding:56px 16px 64px}
 .lp-grid{grid-template-columns:repeat(3,1fr)}.lp-gal{grid-template-columns:repeat(3,1fr)}.lp-gal .lp-fig:first-child{grid-column:auto}
 .lp-two{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start}
 .lp-calc{grid-template-columns:repeat(4,1fr)}.lp-out{grid-template-columns:repeat(4,1fr)}
 #lp-form .lp-card{max-width:760px;margin:0 auto}body{padding-bottom:0}.lp-dock{left:auto;right:18px;bottom:18px;width:380px;border-radius:18px;border:1px solid var(--line);box-shadow:var(--sh)}
}
@media (min-width:760px){.lp-g3{grid-template-columns:repeat(3,1fr)}.lp-units{grid-template-columns:repeat(2,1fr)}.lp-swg{grid-template-columns:repeat(3,1fr)}.lp-hero-bio .lp-wrap{grid-template-columns:1fr}.lp-bento{grid-template-columns:repeat(3,1fr)}}`;
}
function _o1w(_o23) {
let _o1s = '';
if (_o23.fb) _o1s += `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${_o23.fb}');fbq('track','PageView');</script>\n<noscript><img height="1" width="1" alt="" src="https://www.facebook.com/tr?id=${_o23.fb}&amp;ev=PageView&amp;noscript=1"></noscript>\n`;
if (_o23.tiktok) _o1s += `<script>!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${_o23.tiktok}');ttq.page();}(window,document,'ttq');</script>\n`;
if (_o23.google) _o1s += `<script async src="https://www.googletagmanager.com/gtag/js?id=${_o23.google}"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${_o23.google}');</script>\n`;
return _o1s;
}
const _o17 = (_o1p) => JSON.stringify(_o1p).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
export function eventAt(ev) {
const _ok = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(ev && ev.date || '')); if (!_ok) return 0;
const t = /^(\d{1,2}):(\d{2})$/.exec(String(ev.time || '00:00')) || [0, 0, 0];
return Date.UTC(+_ok[1], +_ok[2] - 1, +_ok[3], +t[1] - 7, +t[2]);
}
const dmy = (iso) => { const _o1g = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '')); return _o1g ? `${_o1g[3]}/${_o1g[2]}/${_o1g[1]}` : ''; };
export function renderPage(cfg, data = {}, opts = {}) {
const target = opts.target || 'static';
const preview = target === 'preview';
const _ob = TEMPLATES[cfg.template] || TEMPLATES.project;
const _o1h = !_ob.basic;
const _o12 = !!cfg.infoOnly;
const goals = goalsOf(cfg.goals);
const _o8 = ['price', 'policy', 'loan', 'cashflow'];
const on = (s) => cfg.order.includes(s) && !!cfg.on[s] && !(_o12 && _o8.includes(s));
const sample = (s) => (cfg.samples || []).includes(s);
const badge = '<span class="lp-badge" data-sample="1">Mẫu</span>';
const p = data.project || null;
const phone = normPhone(cfg.contact.phone), zalo = normPhone(cfg.contact.zalo) || phone;
const zaloHref = zalo ? 'https://zalo.me/' + zalo : '';
const img = (im, alt, cls = 'lp-fig', eager = false) => {
let _o2c = '', isSample = false, note = '';
if (im && im.kind === 'url' && imageUrl(im.url)) {
if (preview) { _o2c = sampleSvg(im.url, [200, 210], 'room'); note = '<span class="lp-badge">Ảnh từ link – xem ở trang thật</span>'; } else _o2c = imageUrl(im.url);
} else if (im && im.kind === 'local' && opts.imgSrc) _o2c = opts.imgSrc(im) || '';
if (!_o2c) { _o2c = sampleSvg(im && (im.seed || im.id) || alt, (data.project && data.project.hue) || null, (im && im.look) || 'city'); isSample = true; }
const _o2r = /lp-ava/.test(cls) ? 'width="400" height="400"' : 'width="1200" height="750"';
return `<figure class="${cls}"><img src="${esc(_o2c)}" alt="${esc(alt)}" ${_o2r} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">${isSample ? badge : note}</figure>`;
};
const _oy = (s, title) => `<div class="lp-h"><h2>${esc(title)}</h2>${sample(s) ? badge : ''}</div>`;
const sec = (s, title, _oc) => `<section class="lp-sec" id="lp-${s}"><div class="lp-wrap">${_oy(s, title)}${_oc}</div></section>`;
const _o29 = (name, label, opts, _oo = '') => `<label class="lp-f">${esc(label)}<select class="lp-in" name="${name}" data-w="${esc(label)}" ${_oo}>${opts.map((_o1p) => (Array.isArray(_o1p) ? `<option value="${esc(_o1p[0])}">${esc(_o1p[1])}</option>` : `<option>${esc(_o1p)}</option>`)).join('')}</select></label>`;
const _o22 = [...new Set([p && p.name, ...(data.projects || []).filter(Boolean).map((_o2u) => _o2u.name)].filter(Boolean))].slice(0, 12);
const unitTypes = () => { const t = (p && (p.types || []).map((_o2u) => _o2u.n).filter(Boolean)) || []; return t.length ? t : ['Studio', '1PN', '2PN', '3PN', 'Căn góc / Duplex']; };
const _ot = (kind) => {
const F = cfg.s.form, doc = cfg.s.doc;
const _o1v = kind === 'main' && _o12;
let interest = '';
if (kind === 'main' && F.interest && !_o1v) {
if (cfg.template === 'agent' || cfg.template === 'bio') interest = `<label class="lp-f">Anh/chị cần<select class="lp-in" name="interest" data-kind="need"><option value="mua">Mua</option><option value="thuê">Thuê</option><option value="bán">Ký gửi bán</option><option value="cho thuê">Ký gửi cho thuê</option></select></label>`;
else if (cfg.template === 'event') interest = `<label class="lp-f">Số người tham dự<select class="lp-in" name="people"><option>1</option><option>2</option><option>3+</option></select></label>`;
else if (p && (p.types || []).length) interest = `<label class="lp-f">Loại căn quan tâm<select class="lp-in" name="interest" data-kind="unit"><option value="">Chưa rõ</option>${p.types.map((t) => `<option>${esc(t.n)}</option>`).join('')}</select></label>`;
}
if (kind === 'booking') {
const B = cfg.s.booking;
interest = (_o22.length > 1 ? _o29('b_project', 'Dự án', _o22) : _o22.length ? `<input type="hidden" name="b_project" data-w="Dự án" value="${esc(_o22[0])}">` : `<label class="lp-f">Dự án quan tâm<input class="lp-in" name="b_project" data-w="Dự án" maxlength="80" placeholder="Tên dự án"></label>`) +
_o29('interest', 'Loại căn', [['', 'Chưa rõ'], ...unitTypes().map((_o2u) => [_o2u, _o2u])], 'data-kind="unit"') +
`<div class="lp-2c">${_o29('b_floor', 'Tầng', [['', 'Chưa rõ'], 'Tầng thấp', 'Tầng trung', 'Tầng cao'])}${_o29('b_dir', 'Hướng', [['', 'Chưa rõ'], 'Đông', 'Tây', 'Nam', 'Bắc', 'Đông Nam', 'Đông Bắc', 'Tây Nam', 'Tây Bắc'])}</div>` +
_o29('b_pay', 'Cách thanh toán', [['', 'Chưa rõ'], ...lines(B.pay).filter((_o2u) => !/^chưa rõ/i.test(_o2u)).slice(0, 6)]);
}
if (kind === 'kygui') {
interest = `<label class="lp-f">Anh/chị muốn<select class="lp-in" name="interest" data-kind="need" data-w="Ký gửi"><option value="bán">Gửi bán</option><option value="cho thuê">Gửi cho thuê</option></select></label>
<label class="lp-f">Dự án / toà<input class="lp-in" name="k_project" data-w="Dự án" maxlength="80" placeholder="Tên dự án, toà"></label>
<div class="lp-2c"><label class="lp-f">Loại căn<input class="lp-in" name="k_unit" data-w="Căn" maxlength="40" placeholder="VD 2PN, 70 m²"></label><label class="lp-f">Giá mong muốn<input class="lp-in" name="k_price" data-w="Giá mong muốn" maxlength="40" placeholder="VD 3,2 tỷ / 12 triệu/tháng"></label></div>`;
}
const _o2q = { doc: 'Tài liệu: ' + doc.title, booking: 'Booking ưu tiên', kygui: 'Chủ nhà ký gửi' };
const _o2f = { doc: 'Chuyên viên gửi tài liệu qua Zalo trong ít phút.', booking: 'Đã ghi nhận đăng ký booking ưu tiên. Chuyên viên gửi chính sách booking qua Zalo – trang không thu tiền.', kygui: 'Chuyên viên liên hệ để xem căn và định giá tham khảo trong ít phút.' };
const _o2p = _o2q[kind] ? `data-want="${esc(_o2q[kind])}" data-thanks="${esc(_o2f[kind])}"${kind === 'doc' && safeHttps(doc.url) ? ` data-doc-url="${esc(safeHttps(doc.url))}"` : ''}` : '';
const n = { doc: 'd', booking: 'b', kygui: 'k' }[kind] || 'm';
const _oe = kind === 'doc' ? doc.button : kind === 'booking' ? cfg.s.booking.button : kind === 'kygui' ? cfg.s.kygui.button : F.button;
const _o1l = _o1v ? '' : `<label class="lp-f">Họ và tên<input class="lp-in" name="name" autocomplete="name" autocapitalize="words" maxlength="120" placeholder="Nguyễn Văn A"></label>`;
return `<form class="lp-form" data-lp-form="${kind}" novalidate autocomplete="on" ${_o2p}${_o1v ? ' data-name-opt="1"' : ''}>
${_o1l}
<label class="lp-f">Số điện thoại / Zalo<input class="lp-in" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="09xx xxx xxx"></label>
${interest}
<div class="lp-ask" data-lp-ask hidden></div>
${_o1v ? '' : '<div class="lp-pref" role="radiogroup" aria-label="Cách liên hệ"><label><input type="radio" name="pref" value="Nhắn Zalo" checked>💬 Nhắn Zalo</label><label><input type="radio" name="pref" value="Gọi điện">📞 Gọi cho tôi</label></div>'}
<label class="lp-ck"><input type="checkbox" name="consent" required><span>Tôi đồng ý cho ${esc(cfg.contact.name || 'chuyên viên')} dùng ${_o1v ? '' : 'họ tên, '}số điện thoại này để tư vấn bất động sản theo <a href="#lp-data">chính sách dữ liệu cá nhân</a>. Có thể yêu cầu xoá bất kỳ lúc nào.</span></label>
<input class="lp-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" id="lp-hp-${n}">
<div class="lp-err" role="alert"></div>
<button type="submit" class="lp-btn">${esc(_oe)}</button>
<div class="lp-trust">🔒 Không chia sẻ cho bên thứ ba · Chỉ liên hệ đúng cách anh/chị chọn${kind === 'booking' ? ' · Trang không thu tiền' : ''}</div></form>`;
};
const _o13 = (nm) => esc(String(nm || '?').trim().split(/\s+/).pop().charAt(0).toUpperCase() || '?');
const avatar = (cls = 'lp-ava', eager = false) => (cfg.contact.avatar ? img(cfg.contact.avatar, cfg.contact.name || 'Ảnh đại diện', cls, eager) : `<div class="${cls} lp-ini" aria-hidden="true">${_o13(cfg.contact.name || cfg.brand.name)}</div>`);
const _o1t = {};
function _o1j(_o1, cta, _oi) {
const t = cfg.template;
const _o1a = [];
if (p && ['lead60', 'residence', 'cashflow', 'prelaunch', 'township', 'luxury'].includes(t)) {
if (!_o12) _o1a.push(['Giá tham khảo', priceLabel(p) || 'Nhận bảng giá']);
if (p.handover) _o1a.push(['Bàn giao', ymLabel(p.handover)]);
if (_oa[p.status]) _o1a.push(['Trạng thái', _oa[p.status]]);
if (t === 'cashflow' && !_o12) { const _op = _oq(); if (_op) _o1a.unshift(['Vốn đợt đầu từ', '~' + fmtMoney(_op)]); }
}
const _o1b = _o1a.length ? `<div class="lp-kpis">${_o1a.map(([a, b]) => `<div class="lp-kpi"><small>${esc(a)}</small><b>${esc(b)}</b></div>`).join('')}</div>` : '';
let _oo = _o1b;
if (t === 'prelaunch') {
const at = eventAt({ date: cfg.s.reasons.date, time: '09:00' });
if (at) _oo += `<p class="lp-cdnote">Dự kiến ra mắt ${esc(dmy(cfg.s.reasons.date))} (thời điểm dự kiến, có thể thay đổi)</p><div class="lp-cd" data-lp-countdown data-at="${at}"></div>`;
}
if (t === 'hub') {
const _o1n = (icon, label) => `<a class="lp-chip" href="#lp-form" data-lp-want="${esc(label)}">${icon} ${esc(label)}</a>`;
_oo += `<div class="lp-chips">${_o1n('🏠', 'Mua để ở ngay')}${_o1n('📈', 'Đầu tư đón sóng hạ tầng')}${_o1n('💎', 'Săn quỹ căn đẹp')}</div>`;
}
const _ox = `<span class="lp-eyebrow">${esc(_o1.eyebrow)}</span><h1>${esc(_o1.heading)}</h1>${_o1.sub ? `<p class="lp-lead">${esc(_o1.sub)}</p>` : ''}`;
if (t === 'bio') {
const _o2g = [_oi ? `<a class="lp-tile lp-tile-1" href="${_oi}">${esc(_o1.cta)}<small>Gửi qua Zalo trong ít phút</small></a>` : ''];
if (on('loan') && !_o12) _o2g.push('<a class="lp-tile" href="#lp-loan">🧮 Tính vốn mua căn<small>Biết ngay cần bao nhiêu</small></a>');
if (on('projects') && (data.projects || []).filter(Boolean).length) _o2g.push(`<a class="lp-tile" href="#lp-projects">🏙 Dự án nổi bật<small>${(data.projects || []).filter(Boolean).length} dự án</small></a>`);
if (on('listings')) _o2g.push('<a class="lp-tile" href="#lp-listings">🔑 Rổ hàng<small>Đang bán · Cho thuê</small></a>');
if (on('booking')) _o2g.push('<a class="lp-tile" href="#lp-booking">⭐ Đăng ký booking<small>Không thu tiền</small></a>');
if (on('kygui')) _o2g.push('<a class="lp-tile" href="#lp-kygui">📝 Ký gửi căn<small>Bán / cho thuê</small></a>');
return `<section class="lp-hero lp-hero-bio" id="lp-hero"><div class="lp-wrap">${avatar('lp-ava lp-ava-xl', true)}<h1>${esc(_o1.heading)}</h1><p class="lp-lead">${esc(_o1.sub)}</p><div class="lp-bento">${_o2g.join('')}</div></div></section>`;
}
const _o2a = _o1.image ? img(_o1.image, _o1.heading || 'Ảnh dự án', 'lp-fig', true) : t === 'luxury' ? avatar('lp-ava lp-ava-lg', true) : '';
return `<section class="lp-hero lp-hero-${t}${_o1.image ? ' lp-has-img' : ''}" id="lp-hero"><div class="lp-wrap"><div>${_ox}${cta}${_oo}</div>${_o2a}</div></section>`;
}
function _o1u() {
const plans = (data.plans || []).filter((_o2u) => _o2u && Array.isArray(_o2u.steps) && _o2u.steps.length);
return plans.reduce((a, b) => ((Number(b.loan) || 0) > (a ? Number(a.loan) || 0 : -1) ? b : a), null);
}
function _oq() {
const _o1y = _o1u(); if (!_o1y || !_o21(p)) return 0;
const t = (p.types || []).find((_o2u) => !_o2u.ask && Array.isArray(_o2u.a));
if (!t) return 0;
const _o2i = t.a[0] * p.price[0] * 1e6 * (Number(_o1y.factor) || 1);
return Math.round(_o2i * (Number(_o1y.steps[0].pct) || 0) / 100);
}
{
const _o1 = cfg.s.hero;
const _o2a = _o1h && !_o1.image ? '' : img(_o1.image, cfg.template === 'agent' ? 'Ảnh minh hoạ' : _o1.heading || 'Ảnh dự án', 'lp-fig', true);
let _oo = '';
if (cfg.template === 'project' && p) {
const _o1a = [['Giá niêm yết', priceLabel(p) || 'Nhận bảng giá'], ['Bàn giao', p.handover ? ymLabel(p.handover) : 'Chưa công bố'], ['Trạng thái', _oa[p.status] || '–']];
_oo = `<div class="lp-kpis">${_o1a.map(([a, b]) => `<div class="lp-kpi"><small>${esc(a)}</small><b>${esc(b)}</b></div>`).join('')}</div>`;
} else if (cfg.template === 'event') {
const _o0 = cfg.s.event, at = eventAt(_o0);
_oo = `<div class="lp-kpis"><div class="lp-kpi"><small>Ngày</small><b>${esc(dmy(_o0.date) || 'Sắp công bố')}</b></div><div class="lp-kpi"><small>Giờ</small><b>${esc(_o0.time || '–')}</b></div><div class="lp-kpi"><small>Địa điểm</small><b>${esc(_o0.place || '–')}</b></div></div>${at ? `<div class="lp-cd" data-lp-countdown data-at="${at}"></div>` : ''}`;
} else if (cfg.template === 'agent') {
const C = cfg.contact;
_oo = `<div class="lp-me">${img(C.avatar, C.name || 'Ảnh đại diện', 'lp-ava', true)}<div><b>${esc(C.name || '')}</b><span>${esc([C.title, C.cert ? 'CCHN ' + C.cert : '', C.company].filter(Boolean).join(' · '))}</span></div></div>`;
}
const _oi = _o1h && cfg.template === 'secondary' && on('listings') ? '#lp-listings' : _o1h && (cfg.template === 'prelaunch' || !on('form')) && on('booking') ? '#lp-booking' : on('form') ? '#lp-form' : '';
const cta = `<div class="lp-cta">${_oi ? `<a class="lp-btn" href="${_oi}">${esc(_o1.cta)}</a>` : ''}${zaloHref && on('contact') ? `<a class="lp-btn lp-btn-2" href="${esc(zaloHref)}" target="_blank" rel="noopener">💬 Zalo</a>` : ''}</div>`;
if (_o1h) _o1t.hero = _o1j(_o1, cta, _oi);
else _o1t.hero = `<section class="lp-hero" id="lp-hero"><div class="lp-wrap"><div><span class="lp-eyebrow">${esc(_o1.eyebrow)}</span><h1>${esc(_o1.heading)}</h1><p class="lp-lead">${esc(_o1.sub)}</p>${cta}${_oo}</div>${_o2a}</div></section>`;
}
_o1t.location = sec('location', SECTIONS.location, `<div class="lp-two"><div class="lp-card"><p>${_o1o(cfg.s.location.text)}</p></div><ul class="lp-list">${lines(cfg.s.location.items).map((_o2u) => `<li>${esc(_o2u)}</li>`).join('')}</ul></div>`);
const rows = priceRows(p, data.plans);
if (rows.length) {
const _o2m = data.today ? ` Cập nhật ${dmy(data.today)}.` : '';
_o1t.price = sec('price', SECTIONS.price, `<div class="lp-card lp-scroll"><table class="lp-tbl"><thead><tr><th>Loại căn</th><th>Diện tích</th><th class="n">Giá tham khảo</th></tr></thead><tbody>${rows.map((r) => `<tr><td><b>${esc(r.type)}</b></td><td>${esc(r.area)}</td><td class="n">${esc(r.price)}</td></tr>`).join('')}</tbody></table>
<p class="lp-muted">${esc(priceNote(data.policy))}${esc(_o2m)}${cfg.s.price.note ? ' ' + esc(cfg.s.price.note) : ''}</p></div>`);
}
const _o20 = policyRows(data.plans);
if (_o20.length) {
_o1t.policy = sec('policy', SECTIONS.policy, `<div class="lp-card lp-scroll"><table class="lp-tbl"><thead><tr><th>Phương án</th><th class="n">Chiết khấu</th><th class="n">Vay</th><th class="n">Hỗ trợ lãi</th></tr></thead><tbody>${_o20.map((r) => `<tr><td><b>${esc(r.name)}</b>${r.sub ? `<div class="lp-muted">${esc(r.sub)}</div>` : ''}</td><td class="n">${esc(r.disc)}</td><td class="n">${esc(r.loan)}</td><td class="n">${esc(r.htls)}</td></tr>`).join('')}</tbody></table>
<p class="lp-muted">${esc(data.policy && data.policy.month ? policyLabel(data.policy) : 'Chính sách tham khảo')} – chi tiết từng đợt thanh toán gửi kèm báo giá.${cfg.s.policy.note ? ' ' + esc(cfg.s.policy.note) : ''}</p></div>`);
}
{
const L = cfg.s.loan;
const _o14 = (name, label, val, step) => `<label class="lp-f">${label}<input class="lp-in" name="${name}" type="number" inputmode="decimal" min="0" step="${step}" value="${esc(val)}"></label>`;
_o1t.loan = sec('loan', SECTIONS.loan, `<div class="lp-card" data-lp-loan><div class="lp-calc">${_o14('price', 'Giá căn (tỷ)', L.price, '0.01')}${_o14('ltv', 'Vay (% giá)', L.ltv, '1')}${_o14('rate', 'Lãi suất (%/năm)', L.rate, '0.1')}${_o14('years', 'Thời hạn (năm)', L.years, '1')}</div>
<div class="lp-out"><div><small>Số tiền vay</small><b data-out="loan">–</b></div><div><small>Vốn tự có</small><b data-out="own">–</b></div><div><small>Tháng đầu (gốc đều)</small><b data-out="first">–</b></div><div><small>Trả đều mỗi tháng</small><b data-out="annuity">–</b></div></div>
<p class="lp-muted">Lãi suất giả định, chưa tính hỗ trợ lãi của chủ đầu tư – số liệu để tham khảo, không phải cam kết của ngân hàng.</p></div>`);
}
const _ou = (cfg.s.gallery.images || []).slice(0, 9);
if (_ou.length) _o1t.gallery = sec('gallery', SECTIONS.gallery, `<div class="lp-gal">${_ou.map((im, _o10) => img(im, (cfg.s.hero.heading || 'Ảnh') + ' ' + (_o10 + 1))).join('')}</div>`);
const F = cfg.s.form;
_o1t.form = `<section class="lp-sec" id="lp-form"><div class="lp-wrap"><div class="lp-card"><div class="lp-h"><h2>${esc(F.heading)}</h2></div><p class="lp-muted">${esc(F.sub)}</p>${_ot('main')}</div></div></section>`;
const D = cfg.s.doc;
_o1t.doc = sec('doc', 'Nhận tài liệu', `<div class="lp-card lp-docbox"><p><b>${esc(D.title)}</b></p><p class="lp-muted">${esc(D.desc)}</p>${_ot('doc')}</div>`);
_o1t.facts = sec('facts', SECTIONS.facts, `<ul class="lp-list">${lines(cfg.s.facts.items).map((_o2u) => `<li>${esc(_o2u)}</li>`).join('')}</ul>`);
{
const _o0 = cfg.s.event;
_o1t.event = sec('event', SECTIONS.event, `<div class="lp-two"><div class="lp-card"><p><b>${esc(dmy(_o0.date) || 'Ngày: sắp công bố')}${_o0.time ? ' · ' + esc(_o0.time) : ''}</b></p><p>${_o1o(_o0.place)}</p></div><ul class="lp-list">${lines(_o0.agenda).map((_o2u) => `<li>${esc(_o2u)}</li>`).join('')}</ul></div>`);
}
{
const G = cfg.s.agent;
_o1t.agent = sec('agent', SECTIONS.agent, `<div class="lp-two"><div class="lp-card"><p>${_o1o(G.bio)}</p></div><ul class="lp-list">${lines(G.bullets).map((_o2u) => `<li>${esc(_o2u)}</li>`).join('')}</ul></div>`);
}
const _o1z = (data.projects || []).filter(Boolean).slice(0, 12);
if (_o1z.length) {
_o1t.projects = sec('projects', SECTIONS.projects, `<div class="lp-grid">${_o1z.map((_o2u) => `<article class="lp-pcard">${img({ kind: 'sample', seed: _o2u.id, look: 'city' }, _o2u.name)}<div class="lp-pb"><b>${esc(_o2u.name)}</b><span class="lp-muted">${esc([_oa[_o2u.status], _o2u.loc].filter(Boolean).join(' · '))}</span><p>${esc(priceLabel(_o2u) || 'Nhận bảng giá')}</p></div></article>`).join('')}</div>`);
}
if (_o1h) {
const C = cfg.contact, G = cfg.s.agent;
const _o1k = [C.title, C.cert ? 'CCHN ' + C.cert : '', C.company].filter(Boolean).join(' · ');
_o1t.agent = C.name || G.bio ? sec('agent', 'Chuyên viên tư vấn', `<div class="lp-card lp-agent">${avatar()}<div><b>${esc(C.name || cfg.brand.name || '')}</b>${_o1k ? `<p class="lp-muted">${esc(_o1k)}</p>` : ''}${G.bio ? `<p>${_o1o(G.bio)}</p>` : ''}${lines(G.bullets).length ? `<ul class="lp-list">${lines(G.bullets).map((_o2u) => `<li>${esc(_o2u)}</li>`).join('')}</ul>` : ''}</div></div>`) : '';
const _o5 = String(cfg.s.location.text || '').trim(), LI = lines(cfg.s.location.items);
_o1t.location = _o5 || LI.length ? sec('location', SECTIONS.location, `<div class="lp-two">${_o5 ? `<div class="lp-card"><p>${_o1o(_o5)}</p></div>` : ''}${LI.length ? `<ul class="lp-list">${LI.map((_o2u) => `<li>${esc(_o2u)}</li>`).join('')}</ul>` : ''}</div>`) : '';
if (!_ou.length) _o1t.gallery = '';
}
if (_o1z.length && (_o12 || cfg.template === 'insider')) {
const card = (_o2u) => `<article class="lp-pcard">${img({ kind: 'sample', seed: _o2u.id, look: 'city' }, _o2u.name)}<div class="lp-pb"><b>${esc(_o2u.name)}</b><span class="lp-muted">${esc([_oa[_o2u.status], _o2u.loc].filter(Boolean).join(' · '))}</span>${_o12 ? '' : `<p>${esc(priceLabel(_o2u) || 'Nhận bảng giá')}</p>`}</div></article>`;
if (cfg.template === 'insider') {
const _ow = {}; _o1z.forEach((_o2u) => { (_ow[_o2u.area || 'Khu vực khác'] = _ow[_o2u.area || 'Khu vực khác'] || []).push(_o2u); });
_o1t.projects = sec('projects', 'Dự án theo khu vực', Object.keys(_ow).map((a) => `<h3 class="lp-h3">📍 ${esc(a)}</h3><div class="lp-grid">${_ow[a].map(card).join('')}</div>`).join(''));
} else _o1t.projects = sec('projects', SECTIONS.projects, `<div class="lp-grid">${_o1z.map(card).join('')}</div>`);
}
{
const facts = p ? [['Chủ đầu tư', p.dev], ['Quy mô', p.scale], ['Tiến độ', p.progress], ['Pháp lý', p.legal], ['Bàn giao dự kiến', p.handover ? ymLabel(p.handover) : ''], ['Tiện ích', p.amenities]]
.filter(([, v]) => v && String(v).trim()) : [];
const _o16 = String(cfg.s.intro.text || '').trim();
_o1t.intro = _o16 || facts.length ? sec('intro', p ? 'Giới thiệu ' + p.name : SECTIONS.intro, `${_o16 ? `<p class="lp-lead2">${_o1o(_o16)}</p>` : ''}${facts.length ? `<dl class="lp-facts">${facts.map(([_o18, v]) => `<div><dt>${esc(_o18)}</dt><dd>${esc(String(v).slice(0, 400))}</dd></div>`).join('')}</dl>` : ''}`) : '';
}
_o1t.usps = lines(cfg.s.usps.items).length ? sec('usps', SECTIONS.usps, `<ol class="lp-num">${lines(cfg.s.usps.items).slice(0, 6).map((_o2u) => `<li>${esc(_o2u)}</li>`).join('')}</ol>`) : '';
{
const _o1y = _o1u();
_o1t.cashflow = _o1y && _o21(p) ? sec('cashflow', 'Lộ trình đóng tiền – ' + (_o1y.name || 'phương án vay'), `<p class="lp-muted">Mỗi đợt tính theo % giá trị căn. Đợt ngân hàng giải ngân không phải tiền tự có.${cfg.s.cashflow.note ? ' ' + esc(cfg.s.cashflow.note) : ''}</p><ol class="lp-tl">${_o1y.steps.slice(0, 12).map((_o2u) => `<li><div><b>${esc(fmtNum(Number(_o2u.pct) || 0, 1))}%</b> ${esc(_o2u.name || '')}${_o2u.bank ? ' <span class="lp-muted">· ngân hàng giải ngân</span>' : ''}</div>${_o2u.when || _o2u.at ? `<small>${esc(_o2u.at === 'HANDOVER' ? 'Khi bàn giao' : _o2u.when || _o2u.at)}</small>` : ''}</li>`).join('')}</ol>`) : '';
}
_o1t.reasons = lines(cfg.s.reasons.items).length ? sec('reasons', lines(cfg.s.reasons.items).length + ' lý do nên đăng ký sớm', `<div class="lp-grid lp-g3">${lines(cfg.s.reasons.items).slice(0, 6).map((_o2u, _o10) => `<div class="lp-card"><b class="lp-big">0${_o10 + 1}</b><p>${esc(_o2u)}</p></div>`).join('')}</div><p class="lp-muted">Chưa nhận đặt cọc khi dự án chưa đủ điều kiện mở bán theo Luật Kinh doanh bất động sản 2023. Thông tin giai đoạn đầu mang tính tham khảo.</p>`) : '';
_o1t.steps = lines(cfg.s.steps.items).length ? sec('steps', SECTIONS.steps, `<ol class="lp-steps">${lines(cfg.s.steps.items).slice(0, 8).map((_o2u) => `<li>${esc(_o2u)}</li>`).join('')}</ol>`) : '';
{
const B = cfg.s.booking;
_o1t.booking = `<section class="lp-sec" id="lp-booking"><div class="lp-wrap"><div class="lp-card"><span class="lp-kick">Gom booking</span><div class="lp-h"><h2>${esc(B.heading)}</h2></div><p class="lp-muted">${esc(B.sub)}</p>
<ol class="lp-steps lp-steps-s"><li>Đăng ký thông tin và loại căn mong muốn</li><li>Nhận chính sách booking chính thức qua Zalo</li><li>Xác nhận booking theo hướng dẫn của chủ đầu tư</li><li>Chọn căn theo thứ tự ưu tiên</li></ol>
${_ot('booking')}<p class="lp-muted">Trang này không thu tiền. Việc nhận booking / đặt chỗ thực hiện theo quy định của chủ đầu tư và Luật Kinh doanh bất động sản 2023.</p></div></div></section>`;
}
{
const items = listingItems(cfg, data.inventory || []);
const _o4 = cfg.s.listings;
const _o1m = items.filter((_o2u) => _o2u.loai === 'ban').length, nt = items.length - _o1m;
const _o1r = (arr, all) => `<option value="">${esc(all)}</option>` + [...new Set(arr.filter(Boolean))].slice(0, 30).map((_o2u) => `<option>${esc(_o2u)}</option>`).join('');
const _of = (_o18) => `<select class="lp-in" data-f="g" data-k="${_o18}" aria-label="Mức giá"${_o18 === 'thue' ? ' hidden' : ''}><option value="">Mọi mức giá</option>${PRICE_BUCKETS[_o18].map(([lo, hi, _o1d]) => `<option value="${lo}-${hi}">${esc(_o1d)}</option>`).join('')}</select>`;
const _o2l = (_o2k) => {
const code = maskCode(_o2k.ma);
const _ox = [_o2k.pn, _o2k.dt ? _o2k.dt + ' m²' : ''].filter(Boolean).join(' · ') || 'Căn ' + (_o2k.loai === 'thue' ? 'cho thuê' : 'chuyển nhượng');
const _o1k = [_o2k.du_an, _o2k.toa ? 'Toà ' + _o2k.toa : '', _o2k.tang ? 'Tầng ' + _o2k.tang : '', _o2k.huong ? 'Hướng ' + _o2k.huong : '', _o2k.noi_that ? 'Nội thất ' + _o2k.noi_that : ''].filter(Boolean).join(' · ');
const ask = ['Hỏi căn' + (code ? ' ' + code : ''), _o2k.du_an, _o2k.tang ? 'tầng ' + _o2k.tang : '', _o2k.gia].filter(Boolean).join(' · ');
return `<article class="lp-unit" data-k="${_o2k.loai}" data-p="${esc(_o2k.du_an || '')}" data-t="${esc(_o2k.pn || '')}" data-g="${Math.round(Number(_o2k.g) || 0)}"><div class="lp-ut"><span class="lp-tag">${_o2k.loai === 'thue' ? 'Cho thuê' : 'Đang bán'}</span>${code ? `<code>${esc(code)}</code>` : ''}</div><b>${esc(_ox)}</b>${_o1k ? `<span class="lp-muted">${esc(_o1k)}</span>` : ''}${_o2k.gia ? `<p class="lp-up">${esc(_o2k.gia)}</p>` : ''}${_o2k.ghi_chu ? `<p class="lp-muted">${esc(_o2k.ghi_chu)}</p>` : ''}<a class="lp-btn" href="#lp-form" data-lp-want="${esc(ask.slice(0, 120))}">🔓 Nhận thông tin căn</a></article>`;
};
const _o1c = on('kygui') ? '<a class="lp-btn lp-btn-2 lp-kybtn" href="#lp-kygui">📝 Chủ nhà ký gửi căn</a>' : '';
const _od = items.length
? `<div class="lp-list-ui" data-lp-list><div class="lp-tabs2" role="tablist"><button type="button" role="tab" class="on" aria-selected="true" data-lp-tab="ban">Đang bán (${_o1m})</button><button type="button" role="tab" aria-selected="false" data-lp-tab="thue">Cho thuê (${nt})</button></div>
<div class="lp-filt"><select class="lp-in" data-f="p" aria-label="Dự án">${_o1r(items.map((_o2u) => _o2u.du_an), 'Mọi dự án')}</select><select class="lp-in" data-f="t" aria-label="Loại căn">${_o1r(items.map((_o2u) => _o2u.pn), 'Mọi loại căn')}</select>${_of('ban')}${_of('thue')}</div>
<p class="lp-muted" data-lp-count>${items.length} căn</p><div class="lp-units">${items.map(_o2l).join('')}</div><p class="lp-muted lp-none" data-lp-none hidden>Chưa có căn phù hợp – để lại nhu cầu, chuyên viên gửi căn mới nhất qua Zalo.</p></div>`
: `<div class="lp-card"><b>Rổ hàng đang cập nhật</b><p class="lp-muted">Để lại số Zalo để nhận danh sách căn chuyển nhượng, cho thuê mới nhất kèm ảnh thực tế.</p><a class="lp-btn" href="#lp-form" data-lp-want="Nhận danh sách căn chuyển nhượng / cho thuê">📩 Nhận danh sách căn qua Zalo</a></div>`;
_o1t.listings = `<section class="lp-sec" id="lp-listings"><div class="lp-wrap"><div class="lp-h"><h2>${esc(_o4.heading)}</h2>${_o1c}</div><p class="lp-muted">${esc(_o4.sub)}</p>${_od}</div></section>`;
}
{
const _o3 = cfg.s.kygui;
_o1t.kygui = `<section class="lp-sec" id="lp-kygui"><div class="lp-wrap"><div class="lp-card"><div class="lp-h"><h2>${esc(_o3.heading)}</h2></div><p class="lp-muted">${esc(_o3.sub)}</p>${_ot('kygui')}</div></div></section>`;
}
const primaryHref = on('price') && _o1t.price ? '#lp-price' : on('projects') && _o1t.projects ? '#lp-projects' : on('form') ? '#lp-form' : '#lp-hero';
const _o2d = switcherItems(goals, { primaryHref }).filter((_o2u) => (_o2u.href === '#lp-booking' ? on('booking') : _o2u.href === '#lp-listings' ? on('listings') : _o2u.href === '#lp-kygui' ? on('kygui') : true));
const switcher = _o2d.length >= 2 ? `<nav class="lp-switch" id="lp-switch" aria-label="Anh/chị đang tìm gì?"><div class="lp-wrap"><h2>Anh/chị đang tìm gì?</h2><div class="lp-swg">${_o2d.map((_o2u) => `<a href="${_o2u.href}"${_o2u.tab ? ` data-lp-tab="${_o2u.tab}"` : ''} data-sw="${_o2u.key}"><span aria-hidden="true">${_o2u.icon}</span>${esc(_o2u.label)}</a>`).join('')}</div></div></nav>` : '';
const _oc = cfg.order.filter((s) => s === 'hero' || on(s)).filter((s) => s !== 'contact').map((s) => (_o1t[s] || '') + (s === 'hero' ? switcher : '')).join('\n');
const _o25 = on('form') ? '#lp-form' : on('booking') ? '#lp-booking' : on('kygui') ? '#lp-kygui' : '';
const _on = (zalo ? 1 : 0) + (phone ? 1 : 0) + (_o25 ? 1 : 0);
const _om = on('contact') && (phone || zalo) ? `<nav class="lp-dock lp-dock-${_on}${_o25 ? '' : ' lp-dock-nr'}" aria-label="Liên hệ nhanh">${zalo ? `<a class="z" href="${esc(zaloHref)}" target="_blank" rel="noopener">💬 Zalo</a>` : ''}${phone ? `<a class="c" href="tel:${esc(phone)}">📞 Gọi${_on < 3 ? ' ' + esc(phoneText(phone)) : ''}</a>` : ''}${_o25 ? `<a class="r" href="${_o25}">📝 Đăng ký</a>` : ''}</nav>` : '';
const C = cfg.contact;
const _o23 = preview ? {} : activePixels(cfg);
const _o2s = [C.name ? `<b>${esc(C.name)}</b>` : '', C.cert ? 'Chứng chỉ hành nghề môi giới số ' + esc(C.cert) : '', C.company ? 'Hành nghề tại ' + esc(C.company) : '', phone ? 'Hotline/Zalo ' + esc(phoneText(phone)) : ''].filter(Boolean).join(' · ');
const _o24 = Object.keys(_o23).length ? ` Trang dùng công cụ đo lường quảng cáo (${Object.keys(_o23).map((_o18) => PIXEL_NAMES[_o18]).join(', ')}) để đo hiệu quả quảng cáo; không gửi họ tên, số điện thoại của anh/chị cho các công cụ này.` : '';
const _os = `<footer class="lp-foot" id="lp-data"><div class="lp-wrap">${_o2s ? `<p>${_o2s}</p>` : ''}
<p>Giá và chính sách trên trang là <b>thông tin tham khảo</b>, không phải bảng giá chính thức của chủ đầu tư. Giá, chiết khấu, tiến độ thanh toán, hỗ trợ lãi suất và điều kiện vay thực tế theo chính sách bán hàng, hợp đồng và ngân hàng tại thời điểm ký. Tên dự án và chủ đầu tư chỉ dùng để nhận diện sản phẩm; đây là trang tư vấn cá nhân, không phải trang của chủ đầu tư.</p>
<details class="lp-pol"><summary>Chính sách bảo vệ dữ liệu cá nhân</summary><p>Họ tên, số điện thoại và nhu cầu anh/chị để lại chỉ dùng để tư vấn mua, bán, cho thuê bất động sản theo yêu cầu, chỉ khi anh/chị đã tick ô đồng ý. Không bán hoặc chia sẻ cho bên thứ ba khi chưa có sự đồng ý. Anh/chị có quyền xem, sửa, rút lại đồng ý hoặc yêu cầu xoá dữ liệu bất kỳ lúc nào${phone ? ' qua số ' + esc(phoneText(phone)) : ''}. Dữ liệu lưu tối đa 24 tháng kể từ lần liên hệ cuối hoặc đến khi anh/chị yêu cầu xoá.${esc(_o24)}</p></details></div></footer>`;
const css = pageCss(cfg);
const base = normBaseUrl(opts.baseUrl || '') || normBaseUrl(cfg.seo.base_url);
const title = String(cfg.seo.title || cfg.name || 'Trang').trim().slice(0, 90);
const desc = String(cfg.seo.description || '').trim().slice(0, 300);
let og = '';
if (cfg.seo.og_image && cfg.seo.og_image.kind === 'url' && imageUrl(cfg.seo.og_image.url)) og = imageUrl(cfg.seo.og_image.url);
else if (cfg.seo.og_image && cfg.seo.og_image.kind === 'local' && base && opts.ogPath) og = base + opts.ogPath;
const cfgJson = {
server: opts.server || '', landing_id: cfg.id, slug: cfg.slug, project: p ? p.name : '', template: cfg.template,
preview: preview ? 1 : 0
};
const _o1e = cfg.template === 'event' && eventAt(cfg.s.event)
? { '@context': 'https://schema.org', '@type': 'Event', name: cfg.s.hero.heading, startDate: new Date(eventAt(cfg.s.event)).toISOString(), eventStatus: 'https://schema.org/EventScheduled', eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode', location: { '@type': 'Place', name: cfg.s.event.place, address: cfg.s.event.place }, description: desc }
: cfg.template === 'agent' ? { '@context': 'https://schema.org', '@type': 'RealEstateAgent', name: C.name || cfg.brand.name, telephone: phone || undefined, url: base || undefined } : null;
const headTags = [
'<meta charset="utf-8">', '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
target === 'gas' ? '<!--lp-inject--><base target="_top">' : target === 'app' ? '<!--lp-inject-->' : '',
`<title>${esc(title)}</title>`, desc ? `<meta name="description" content="${esc(desc)}">` : '',
base ? `<link rel="canonical" href="${esc(base)}">` : '',
`<meta property="og:type" content="website">`, `<meta property="og:title" content="${esc(title)}">`, desc ? `<meta property="og:description" content="${esc(desc)}">` : '',
base ? `<meta property="og:url" content="${esc(base)}">` : '', og ? `<meta property="og:image" content="${esc(og)}">` : '', '<meta name="twitter:card" content="summary_large_image">',
`<meta name="theme-color" content="${esc(validColor(cfg.brand.c1) ? cfg.brand.c1 : DEFAULT_COLORS.c1)}">`,
'<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
`<link href="${FONTS_URL}" rel="stylesheet">`,
preview ? '' : `<style>${css}</style>`,
preview ? '' : _o1w(_o23),
_o1e && !preview ? `<script type="application/ld+json">${_o17(JSON.parse(JSON.stringify(_o1e)))}</script>` : ''
].filter(Boolean).join('\n');
const _o28 = preview ? '' : `<script type="application/json" id="lp-cfg">${_o17(cfgJson)}</script>\n<script>${pageScript()}</script>`;
const html = `<!doctype html>\n<html lang="vi">\n<head>\n${headTags}\n</head>\n<body class="lp lp-t-${esc(cfg.template)}${_ob.dark ? ' lp-dark' : ''}${preview ? ' lp-preview' : ''}">\n<header class="lp-top"><div class="lp-wrap"><span class="lp-brand">${esc(cfg.brand.name || C.name || '')}</span>${phone ? `<a class="lp-pill" href="tel:${esc(phone)}">📞 ${esc(phoneText(phone))}</a>` : ''}</div></header>\n<main>\n${_oc}\n</main>\n${_os}\n${_om}\n${_o28}\n</body>\n</html>\n`;
return { html, css, cfgJson };
}
export const DEPLOY_GUIDE = [
'CÁCH ĐƯA TRANG LÊN MẠNG (miễn phí, khoảng 5 phút)',
'',
'A. Tên miền con miễn phí (<tên-trang>.pages.dev)',
'1. Mở dash.cloudflare.com, đăng ký/đăng nhập bằng email CỦA ANH/CHỊ (miễn phí).',
'2. Chọn Workers & Pages → Create → Pages → "Upload assets" (Tải tệp lên).',
'3. Đặt tên dự án đúng bằng đường dẫn trang ({slug}) → Create project.',
'4. Giải nén tệp .zip này, kéo cả THƯ MỤC vào ô tải lên → Deploy site.',
'5. Trang chạy ở https://{slug}.pages.dev . Lần sau sửa trang: tải .zip mới, vào dự án → Create deployment → kéo thả lại.',
'',
'B. Tên miền riêng (ví dụ duan-abc.vn – mua khoảng 250.000–500.000 đ/năm ở nhà đăng ký tên miền Việt Nam hoặc Cloudflare)',
'1. Trong dự án Pages ở trên → Custom domains → Set up a custom domain → gõ tên miền.',
'2. Tên miền mua ở Cloudflare: bấm Activate là xong. Mua ở nơi khác: vào trang quản lý tên miền, thêm bản ghi CNAME',
'   theo đúng hướng dẫn Cloudflare hiện ra (trỏ về {slug}.pages.dev), chờ 5–30 phút.',
'3. Quay lại app → Trình tạo landing → SEO → điền "Địa chỉ trang" = https://tên-miền-của-anh-chị/ rồi tải lại .zip (để sitemap, ảnh chia sẻ Facebook đúng).',
'',
'C. Host khác (Netlify, hosting cPanel…): tải toàn bộ tệp trong thư mục lên thư mục gốc của trang.',
'',
'Lưu ý: trang lưu khách về MÁY CHỦ GOOGLE CỦA ANH/CHỊ (Apps Script đã nối trong app). Không cần cài thêm gì.',
'Mỗi sale có link riêng: thêm ?s=<mã sale> vào cuối địa chỉ trang (xem trong app → Trình tạo landing → Link riêng từng sale).'
].join('\n');
export function exportFiles(cfg, data = {}, { server = '', images = {}, now = Date.now() } = {}) {
const files = [];
const _o2n = new Set();
const imgSrc = (im) => { const _op = images[im.id]; if (!_op) return ''; _o2n.add(im.id); return 'img/' + im.id + '.' + (_op.ext || 'jpg'); };
const og = cfg.seo.og_image && cfg.seo.og_image.kind === 'local' && images[cfg.seo.og_image.id] ? 'img/' + cfg.seo.og_image.id + '.' + (images[cfg.seo.og_image.id].ext || 'jpg') : '';
const { html } = renderPage(cfg, data, { target: 'static', server, imgSrc, ogPath: og });
if (og) _o2n.add(cfg.seo.og_image.id);
files.push({ name: 'index.html', data: html });
for (const id of _o2n) files.push({ name: 'img/' + id + '.' + (images[id].ext || 'jpg'), data: images[id].bytes });
const base = normBaseUrl(cfg.seo.base_url) || 'https://' + cfg.slug + '.pages.dev/';
const _ol = new Date(now).toISOString().slice(0, 10);
files.push({ name: 'robots.txt', data: `User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n` });
files.push({ name: 'sitemap.xml', data: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${esc(base)}</loc><lastmod>${_ol}</lastmod></url>\n</urlset>\n` });
files.push({ name: '_headers', data: '/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n\n/img/*\n  Cache-Control: public, max-age=604800\n' });
files.push({ name: 'HUONG_DAN_DUA_LEN_MANG.txt', data: DEPLOY_GUIDE.replace(/\{slug\}/g, cfg.slug) + '\n' });
return { files, html };
}
export function gasHtml(cfg, data = {}, { server = '', dataUrls = {} } = {}) {
return renderPage(cfg, data, { target: 'gas', server, imgSrc: (im) => dataUrls[im.id] || '' }).html;
}
export function appHtml(cfg, data = {}, { server = '', dataUrls = {}, pageUrl = '' } = {}) {
return renderPage(cfg, data, { target: 'app', server, baseUrl: pageUrl, imgSrc: (im) => dataUrls[im.id] || '' }).html;
}
export function saleLink(url, code) {
const _o2k = String(url || ''); const _og = String(code || '').replace(/[^a-z0-9]/gi, '').slice(0, 16);
if (!_o2k || !_og) return _o2k;
return _o2k + (_o2k.includes('?') ? '&' : '?') + 's=' + _og;
}
export const gasPageUrl = (serverUrl, slug) => (serverUrl ? String(serverUrl).replace(/[?#].*$/, '') + '?p=' + encodeURIComponent(slug) : '');

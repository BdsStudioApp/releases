import { fmtMoney, fmtNum, fold, htlsTxt, policyLabel, ymLabel } from './sales.js';
import { pageScript } from './landing_runtime.js';
export const LANDING_VERSION = 1;
export const KEY_PREFIX = 'landing.page.';
export const DEFAULT_COLORS = { c1: '#0E1B2E', c2: '#C9A25B' };
export const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap';
export const SECTIONS = {
hero: 'Ảnh bìa & tiêu đề', location: 'Vị trí & tiện ích', price: 'Bảng giá tham khảo', loan: 'Tính khoản vay', policy: 'Chính sách bán hàng',
gallery: 'Ảnh', form: 'Form nhận thông tin', contact: 'Nút Zalo / Gọi', doc: 'Tài liệu đổi số Zalo', facts: 'Thông tin căn',
event: 'Thời gian & chương trình', agent: 'Giới thiệu bản thân', projects: 'Dự án đang tư vấn'
};
export const TEMPLATES = {
project: { title: 'Dự án', icon: '🏢', desc: 'Giới thiệu 1 dự án: vị trí, bảng giá tham khảo, chính sách, tính khoản vay, form nhận báo giá.',
order: ['hero', 'location', 'price', 'policy', 'loan', 'gallery', 'doc', 'form', 'contact'], off: ['doc'] },
resale: { title: 'Ký gửi – thứ cấp', icon: '🔑', desc: 'Một căn cần bán/cho thuê: thông tin căn, ảnh, vị trí, tính khoản vay, đặt lịch xem nhà.',
order: ['hero', 'facts', 'gallery', 'location', 'loan', 'price', 'doc', 'form', 'contact'], off: ['price', 'doc'] },
event: { title: 'Sự kiện – mở bán', icon: '🎉', desc: 'Đăng ký tham dự mở bán/hội thảo: thời gian, địa điểm, chương trình, chính sách, đếm ngược.',
order: ['hero', 'event', 'policy', 'price', 'location', 'gallery', 'doc', 'form', 'contact'], off: ['price', 'gallery', 'doc'] },
agent: { title: 'Trang cá nhân môi giới', icon: '🧑‍💼', desc: 'Giới thiệu bản thân, dự án đang tư vấn, nhận ký gửi, form liên hệ.',
order: ['hero', 'agent', 'projects', 'loan', 'doc', 'form', 'contact'], off: ['loan', 'doc'] }
};
export const TEMPLATE_IDS = Object.keys(TEMPLATES);
const _o5 = ['location', 'facts', 'event', 'agent', 'doc'];
export function esc(s) {
return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
const _o11 = (s) => esc(s).replace(/\n/g, '<br>');
const _oz = (s) => String(s || '').split(/\n+/).map((_o1t) => _o1t.trim()).filter(Boolean);
const _os = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
export const validColor = (_o9) => /^#[0-9a-f]{6}$/i.test(String(_o9 || ''));
export function slugify(s) {
return fold(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50).replace(/-+$/, '');
}
export const validSlug = (s) => /^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])$/.test(String(s || '')) && !/--/.test(String(s));
export function normPhone(raw) {
let s = String(raw == null ? '' : raw).replace(/[\s.\-()]/g, '');
if (/^\+84/.test(s)) s = '0' + s.slice(3); else if (/^84\d{9,10}$/.test(s)) s = '0' + s.slice(2);
return /^0[35789]\d{8}$/.test(s) || /^02\d{9}$/.test(s) ? s : '';
}
export const phoneText = (_o13) => { const s = normPhone(_o13); return s.length === 10 ? s.replace(/^(\d{4})(\d{3})(\d{3})$/, '$1 $2 $3') : s; };
export function imageUrl(_o1m) {
const s = String(_o1m || '').trim();
const _o10 = s.match(/^https:\/\/drive\.google\.com\/file\/d\/([\w-]{10,})/) || s.match(/^https:\/\/drive\.google\.com\/(?:open|uc|thumbnail)\?(?:[^#]*&)?id=([\w-]{10,})/);
if (_o10) return 'https://drive.google.com/thumbnail?id=' + _o10[1] + '&sz=w1600';
return /^https:\/\/[^\s"'<>\\]+$/i.test(s) && s.length <= 1000 ? s : '';
}
export const safeHttps = (_o1m) => (/^https:\/\/[^\s"'<>\\]+$/i.test(String(_o1m || '').trim()) && String(_o1m).trim().length <= 1000 ? String(_o1m).trim() : '');
export function normBaseUrl(_o1m) {
const s = String(_o1m || '').trim().replace(/\/+$/, '');
return /^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/[a-z0-9._~\/-]*)?$/i.test(s) ? s + '/' : '';
}
export const PIXEL_RE = { fb: /^\d{8,20}$/, tiktok: /^[A-Z0-9]{10,30}$/i, google: /^(G|AW|GT|DC)-[A-Z0-9]{4,20}$/i };
export const PIXEL_NAMES = { fb: 'Facebook Pixel', tiktok: 'TikTok Pixel', google: 'Google (gtag)' };
export function activePixels(cfg) {
const _o1b = (cfg && cfg.pixels) || {};
const _o12 = {};
for (const _ou of Object.keys(PIXEL_RE)) { const _o13 = _o1b[_ou] || {}; const id = String(_o13.id || '').trim(); if (_o13.on && PIXEL_RE[_ou].test(id)) _o12[_ou] = id; }
return _o12;
}
function _o1d(seed) { let _o1t = 0; for (const _oa of String(seed || 'mau')) _o1t = (_o1t * 31 + _oa.charCodeAt(0)) >>> 0; return () => { _o1t = (_o1t * 1664525 + 1013904223) >>> 0; return _o1t / 4294967296; }; }
export function sampleSvg(seed, hue, kind = 'city') {
const R = _o1d(seed + kind);
const [h1, h2] = Array.isArray(hue) && hue.length >= 2 ? hue.map((_o1t) => Math.round(Number(_o1t) || 0) % 360) : [210, 230];
let _o7 = '';
if (kind === 'person') {
_o7 = `<rect width="400" height="400" fill="hsl(${h1},35%,32%)"/><circle cx="200" cy="160" r="72" fill="hsl(${h2},25%,78%)"/><path d="M70 400c10-100 70-150 130-150s120 50 130 150z" fill="hsl(${h2},25%,78%)"/>`;
return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">${_o7}</svg>`);
}
const _o1h = `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="hsl(${h1},45%,${kind === 'room' ? 88 : 30}%)"/><stop offset="1" stop-color="hsl(${h2},40%,${kind === 'room' ? 76 : 62}%)"/></linearGradient></defs><rect width="1200" height="750" fill="url(#g)"/>`;
if (kind === 'room') {
_o7 = `<rect x="0" y="520" width="1200" height="230" fill="hsl(${h2},20%,60%)"/><rect x="120" y="140" width="380" height="300" rx="6" fill="hsl(${h1},50%,92%)" stroke="hsl(${h2},20%,55%)" stroke-width="10"/>` +
`<line x1="310" y1="140" x2="310" y2="440" stroke="hsl(${h2},20%,55%)" stroke-width="8"/><rect x="640" y="400" width="420" height="140" rx="26" fill="hsl(${h1},25%,40%)"/><rect x="660" y="340" width="380" height="90" rx="22" fill="hsl(${h1},25%,48%)"/>` +
`<rect x="880" y="120" width="12" height="230" fill="hsl(${h2},15%,35%)"/><ellipse cx="886" cy="120" rx="70" ry="30" fill="hsl(${h2},40%,90%)"/>`;
} else {
let _o1t = 30;
while (_o1t < 1180) {
const _o1p = 60 + Math.round(R() * 90), hgt = (kind === 'park' ? 120 : 220) + Math.round(R() * (kind === 'park' ? 140 : 330));
const _ox = 18 + Math.round(R() * 18);
_o7 += `<rect x="${_o1t}" y="${640 - hgt}" width="${_o1p}" height="${hgt}" fill="hsl(${h1},25%,${_ox}%)" opacity=".92"/>`;
for (let _o1s = 640 - hgt + 18; _o1s < 620; _o1s += 34) _o7 += `<rect x="${_o1t + 10}" y="${_o1s}" width="${_o1p - 20}" height="8" fill="hsl(${h2},60%,80%)" opacity=".25"/>`;
_o1t += _o1p + 14 + Math.round(R() * 30);
}
_o7 += `<rect x="0" y="640" width="1200" height="110" fill="hsl(${h2},${kind === 'park' ? 45 : 20}%,${kind === 'park' ? 38 : 22}%)"/>`;
for (let _op = 0; _op < 9; _op++) { const _ob = 60 + _op * 135 + Math.round(R() * 30); _o7 += `<circle cx="${_ob}" cy="650" r="${26 + Math.round(R() * 18)}" fill="hsl(${120 + Math.round(R() * 40)},35%,${28 + Math.round(R() * 10)}%)"/>`; }
}
return 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 750">${_o1h}${_o7}</svg>`);
}
const _o6 = { sale: 'Đang bán', soon: 'Sắp mở bán', done: 'Đã bàn giao', ask: 'Nhận bảng giá', low: 'Thấp tầng' };
export const priceLabel = (_o13) => (_o13 && _o13.price ? `${fmtNum(_o13.price[0], 1)}–${fmtNum(_o13.price[1], 1)} triệu/m²` : '');
export function priceRows(_o13, plans) {
if (!_o13 || !_o13.price || !Array.isArray(_o13.types)) return [];
const fs = (plans || []).map((_o1t) => Number(_o1t.factor)).filter((_o1t) => _o1t > 0);
const _oh = fs.length ? Math.min(...fs) : 1, fmax = fs.length ? Math.max(...fs) : 1;
return _o13.types.filter((t) => t && t.n).map((t) => {
if (t.ask || !Array.isArray(t.a)) return { type: t.n, area: 'Liên hệ', price: 'Liên hệ', ask: true };
const lo = t.a[0] * _o13.price[0] * 1e6 * _oh, hi = t.a[1] * _o13.price[1] * 1e6 * fmax;
return { type: t.n, area: `${fmtNum(t.a[0])}–${fmtNum(t.a[1])} m²`, lo, hi, price: `${fmtMoney(lo)} – ${fmtMoney(hi)}` };
});
}
export function policyRows(plans) {
return (plans || []).map((pl) => ({
name: pl.name || '', sub: pl.sub || '', disc: fmtNum((1 - (Number(pl.factor) || 1)) * 100, 1) + '%',
loan: pl.loan ? fmtNum(pl.loan * 100, 1) + '%' : 'Không vay', htls: pl.loan ? htlsTxt(pl.htls) : '–', steps: (pl.steps || []).length
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
const ltv = Math.round(Math.max(0, ...((data && data.plans) || []).map((_o13) => Number(_o13.loan) || 0)) * 100) || 70;
const cfg = (data && data.cfg) || {};
return { price, ltv: Math.min(ltv, 80), rate: Number(cfg.RATE) || 10, years: Number(cfg.LOAN_YEARS) || 25 };
}
const _o1e = (seed, kind = 'city') => ({ kind: 'sample', seed: String(seed || 'mau'), look: kind });
export function newLanding({ id, template = 'project', project = null, profile = {}, data = {}, now = Date.now() } = {}) {
if (!TEMPLATES[template]) template = 'project';
const T = TEMPLATES[template];
const _o13 = project || null;
const _o18 = _o13 ? _o13.name : '';
const _o1a = profile || {};
const _o8 = _o1a.brand || _o1a.name || 'Chuyên viên tư vấn';
const on = {}; for (const s of T.order) on[s] = !T.off.includes(s);
const _oy = loanDefaults({ project: _o13, plans: data.plans, cfg: data.cfg });
const _o1k = {
project: _o18 ? `${_o18} – bảng giá tham khảo, chính sách mới nhất` : 'Dự án – bảng giá tham khảo, chính sách mới nhất',
resale: _o18 ? `Cần bán căn hộ ${_o18}` : 'Cần bán căn hộ',
event: _o18 ? `Sự kiện mở bán ${_o18}` : 'Sự kiện mở bán',
agent: `${_o1a.name || 'Chuyên viên'} – tư vấn mua bán căn hộ`
};
const cfg = {
v: LANDING_VERSION, id: String(id || ''), template, name: _o1k[template].slice(0, 80),
slug: slugify((template === 'agent' ? _o1a.name || 'trang-ca-nhan' : _o18 || 'trang') + (template === 'event' ? '-mo-ban' : template === 'resale' ? '-can-ban' : '')) || 'trang-' + String(id || '').slice(-6),
project_id: _o13 ? _o13.id : '', projects: template === 'agent' && _o13 ? [_o13.id] : [],
brand: { name: _o8, c1: DEFAULT_COLORS.c1, c2: DEFAULT_COLORS.c2, font: 'serif' },
contact: { name: _o1a.name || '', title: _o1a.title || 'Chuyên viên tư vấn bất động sản', phone: normPhone(_o1a.phone), zalo: normPhone(_o1a.zalo || _o1a.phone), cert: _o1a.cchn || '', company: _o1a.company || '', avatar: _o1e('ava', 'person') },
seo: { title: _o1k[template].slice(0, 70), description: '', base_url: '', og_image: null },
pixels: { fb: { on: false, id: '' }, tiktok: { on: false, id: '' }, google: { on: false, id: '' } },
order: T.order.slice(), on,
s: {
hero: {
eyebrow: template === 'event' ? 'Sự kiện' : template === 'agent' ? 'Chuyên viên tư vấn' : (_o13 && _o6[_o13.status]) || 'Dự án',
heading: template === 'agent' ? (_o1a.name || 'Họ tên của anh/chị') : template === 'resale' ? (_o18 ? `Căn hộ ${_o18}` : 'Căn hộ cần bán') : (_o18 || 'Tên dự án'),
sub: template === 'project' ? [_o13 && _o13.loc, _o13 && _o13.dev ? 'Chủ đầu tư ' + _o13.dev : ''].filter(Boolean).join(' · ') || 'Vị trí dự án'
: template === 'event' ? 'Đăng ký tham dự để nhận chính sách ưu đãi và chọn căn sớm.'
: template === 'agent' ? 'Tư vấn mua, bán, cho thuê căn hộ – số liệu rõ ràng, đúng chính sách.' : [_o13 && _o13.loc].filter(Boolean).join(' · ') || 'Vị trí căn hộ',
cta: template === 'event' ? 'Đăng ký tham dự' : template === 'resale' ? 'Đặt lịch xem nhà' : template === 'agent' ? 'Nhận tư vấn' : 'Nhận bảng giá',
image: _o1e(_o13 ? _o13.id : template, template === 'resale' ? 'room' : 'city')
},
location: { text: _o13 && _o13.loc ? _o13.loc : 'Địa chỉ dự án …', items: 'Trường học – … phút\nBệnh viện – … phút\nTrung tâm thương mại – … phút\nCông viên – … phút' },
price: { note: '' },
loan: { price: _oy.price, ltv: _oy.ltv, rate: _oy.rate, years: _oy.years },
policy: { note: '' },
gallery: { images: [_o1e((_o13 ? _o13.id : 'g') + '1', 'city'), _o1e((_o13 ? _o13.id : 'g') + '2', 'room'), _o1e((_o13 ? _o13.id : 'g') + '3', 'park')] },
form: {
heading: template === 'event' ? 'Đăng ký tham dự' : template === 'resale' ? 'Đặt lịch xem nhà' : template === 'agent' ? 'Để lại thông tin – em liên hệ ngay' : 'Nhận bảng giá & chính sách mới nhất',
sub: 'Chuyên viên gửi thông tin qua Zalo hoặc gọi lại đúng cách anh/chị chọn.',
button: template === 'event' ? 'Đăng ký' : template === 'resale' ? 'Đặt lịch' : 'Nhận thông tin', interest: true
},
doc: { title: _o18 ? `Tài liệu ${_o18}: mặt bằng, bảng giá, tiến độ thanh toán` : 'Tài liệu dự án: mặt bằng, bảng giá, tiến độ thanh toán', desc: 'Để lại số Zalo – chuyên viên gửi tài liệu trong ít phút.', button: 'Nhận tài liệu qua Zalo', url: '' },
facts: { items: `Loại căn: …\nDiện tích: … m²\nTầng: …\nHướng: …\nNội thất: …\nPháp lý: …\nGiá chào: … tỷ` },
event: { date: '', time: '09:00', place: 'Địa điểm sự kiện …', agenda: '09:00 – Đón khách\n09:30 – Giới thiệu dự án và chính sách\n10:30 – Chọn căn, giải đáp' },
agent: { bio: 'Giới thiệu ngắn về kinh nghiệm, khu vực và loại sản phẩm anh/chị tư vấn …', bullets: 'Tính dòng tiền, phương án vay rõ ràng\nCập nhật chính sách mới nhất của chủ đầu tư\nHỗ trợ ký gửi bán, cho thuê' },
projects: {},
contact: {}
},
samples: _o5.filter((s) => T.order.includes(s)),
created_at: now, updated_at: now, published: {}
};
cfg.seo.description = template === 'project' && _o13
? `${_o13.name}${_o13.loc ? ' – ' + _o13.loc : ''}. Bảng giá tham khảo theo loại căn, chính sách thanh toán, tính khoản vay. Nhận báo giá qua Zalo.`.slice(0, 160)
: `${_o1k[template]}. Để lại thông tin để được tư vấn qua Zalo hoặc điện thoại.`.slice(0, 160);
if (template === 'resale' && _o13) { const t = (_o13.types || []).find((_o1t) => !_o1t.ask); if (t) cfg.s.facts.items = `Loại căn: ${t.n}\nDiện tích: … m²\nTầng: …\nHướng: …\nNội thất: …\nPháp lý: …\nGiá chào: … tỷ`; }
return cfg;
}
export function clearSample(cfg, section) { return { ...cfg, samples: (cfg.samples || []).filter((s) => s !== section) }; }
export function normalizeLanding(raw) {
if (!_os(raw)) return null;
const _o1l = TEMPLATES[raw.template] ? raw.template : 'project';
const base = newLanding({ id: raw.id, template: _o1l });
const cfg = { ...base, ...raw, template: _o1l };
cfg.brand = { ...base.brand, ...(_os(raw.brand) ? raw.brand : {}) };
if (!validColor(cfg.brand.c1)) cfg.brand.c1 = DEFAULT_COLORS.c1;
if (!validColor(cfg.brand.c2)) cfg.brand.c2 = DEFAULT_COLORS.c2;
cfg.contact = { ...base.contact, ...(_os(raw.contact) ? raw.contact : {}) };
cfg.seo = { ...base.seo, ...(_os(raw.seo) ? raw.seo : {}) };
cfg.pixels = { ...base.pixels };
for (const _ou of Object.keys(base.pixels)) if (_os(raw.pixels) && _os(raw.pixels[_ou])) cfg.pixels[_ou] = { on: !!raw.pixels[_ou].on, id: String(raw.pixels[_ou].id || '') };
cfg.s = { ...base.s };
for (const _ou of Object.keys(base.s)) if (_os(raw.s) && _os(raw.s[_ou])) cfg.s[_ou] = { ...base.s[_ou], ...raw.s[_ou] };
const _ov = TEMPLATES[_o1l].order;
cfg.order = Array.isArray(raw.order) ? raw.order.filter((_o1t) => _ov.includes(_o1t)) : _ov.slice();
for (const _ou of _ov) if (!cfg.order.includes(_ou)) cfg.order.push(_ou);
cfg.on = { ...base.on, ...(_os(raw.on) ? raw.on : {}) };
cfg.on.hero = true;
cfg.samples = Array.isArray(raw.samples) ? raw.samples.filter((_o1t) => _o5.includes(_o1t)) : [];
cfg.projects = Array.isArray(raw.projects) ? raw.projects.map(String).slice(0, 12) : [];
cfg.published = _os(raw.published) ? raw.published : {};
return cfg;
}
export function checkLanding(cfg, data = {}, { server = '', mode = 'zip', images = {} } = {}) {
const _o12 = [];
const err = (text, fix) => _o12.push(fix ? { level: 'error', text, fix } : { level: 'error', text }), warn = (text, fix) => _o12.push(fix ? { level: 'warn', text, fix } : { level: 'warn', text });
if (!validSlug(cfg.slug)) err('Đường dẫn trang chỉ gồm chữ thường không dấu, số và dấu gạch nối (3–50 ký tự).');
const on = (s) => cfg.order.includes(s) && cfg.on[s];
if (!normPhone(cfg.contact.phone) && (on('contact') || on('form'))) err('Thiếu số điện thoại liên hệ đúng dạng (mục Liên hệ).', { group: 'lp-g-contact', field: 'lp-f-contact-phone', phone: 1 });
if (on('form') && !server) (mode === 'gas' ? err : warn)('Chưa nối máy chủ Google của anh/chị – form chưa lưu được khách (đang xem thử).');
if (!on('form') && !on('contact')) warn('Trang không có form và không có nút Zalo/Gọi – khách không liên hệ được.');
const _o1b = cfg.pixels || {};
for (const _ou of Object.keys(PIXEL_RE)) if (_o1b[_ou] && _o1b[_ou].on && !PIXEL_RE[_ou].test(String(_o1b[_ou].id || '').trim())) err(`Mã ${PIXEL_NAMES[_ou]} chưa đúng dạng.`);
if (!String(cfg.seo.title || '').trim()) warn('Chưa có tiêu đề SEO.');
if (!String(cfg.seo.description || '').trim()) warn('Chưa có mô tả SEO.');
const _o16 = data.project;
if (_o16 && (_o16.sample === true || /^mau_/.test(String(_o16.id || '')))) err(`Dự án "${_o16.name}" là dự án Mẫu – chọn dự án thật (thêm ở Bảng hàng).`, { group: 'lp-g-base', field: 'lp-project' });
for (const _o1j of (cfg.samples || []).filter(on)) err(`Mục "${SECTIONS[_o1j]}" còn chữ Mẫu – sửa nội dung (hoặc tắt mục này).`, { group: 'lp-g-sections', sec: _o1j });
const _o4 = /đ[iị]a ch[iỉ] m[aẫ]u|m[aẫ]u\s*[–-]\s*thay b[aằ]ng/i;
const _oo = [cfg.s.hero.eyebrow, cfg.s.hero.heading, cfg.s.hero.sub].map((_o1t) => String(_o1t || '')).join(' ');
if (_o4.test(_oo)) err('Ảnh bìa & tiêu đề còn chữ mẫu ("Địa chỉ mẫu – thay bằng vị trí thật") – sửa Mô tả ngắn.', { group: 'lp-g-sections', sec: 'hero', field: 'lp-f-s-hero-sub' });
if (on('location') && _o4.test(String(cfg.s.location.text || '')) && !(cfg.samples || []).includes('location')) err('Mục "Vị trí & tiện ích" còn chữ mẫu – ghi vị trí thật.', { group: 'lp-g-sections', sec: 'location' });
const _oq = allImages(cfg).filter((_o1t) => _o1t.on);
const _o3 = { hero: ['Ảnh bìa', { group: 'lp-g-sections', sec: 'hero', field: 'lp-img-s-hero-image' }], avatar: ['Ảnh đại diện', { group: 'lp-g-contact', field: 'lp-img-contact-avatar' }],
og: ['Ảnh khi chia sẻ', { group: 'lp-g-seo', field: 'lp-img-seo-og_image' }] };
for (const _o1t of _oq.filter((y) => y.img.kind === 'sample')) {
const _ok = /^gallery\.(\d+)$/.exec(_o1t.path);
const [label, fix] = _ok ? ['Ảnh ' + (Number(_ok[1]) + 1) + ' (mục Ảnh)', { group: 'lp-g-sections', sec: 'gallery', field: 'lp-img-s-gallery-images-' + _ok[1] }] : _o3[_o1t.path] || ['Ảnh', null];
err(label + ' đang là ảnh minh hoạ Mẫu – tải ảnh tự chụp, dán link ảnh, hoặc bỏ ảnh.', fix);
}
if (_oq.some((_o1t) => _o1t.img.kind === 'local' && !images[_o1t.img.id])) warn('Có ảnh tải lên từ máy khác, máy này không có – ảnh đó sẽ thay bằng ảnh Mẫu.');
if (on('price') && !priceRows(data.project, data.plans).length) warn('Dự án chưa có giá trong Bảng hàng – mục Bảng giá sẽ ẩn.');
if (on('event') && !/^\d{4}-\d{2}-\d{2}$/.test(String(cfg.s.event.date || ''))) warn('Chưa chọn ngày sự kiện.');
if (on('doc') && cfg.s.doc.url && !safeHttps(cfg.s.doc.url)) err('Link tài liệu phải bắt đầu bằng https://');
if (mode === 'zip' && !normBaseUrl(cfg.seo.base_url)) warn('Chưa điền địa chỉ trang (tên miền) – sitemap và ảnh chia sẻ Facebook chưa dùng được.');
return _o12;
}
export function allImages(cfg) {
const on = (s) => cfg.order.includes(s) && !!cfg.on[s];
const _o12 = [];
if (cfg.s.hero && cfg.s.hero.image) _o12.push({ path: 'hero', img: cfg.s.hero.image, on: true });
(cfg.s.gallery.images || []).forEach((img, _op) => _o12.push({ path: 'gallery.' + _op, img, on: on('gallery') }));
if (cfg.contact.avatar) _o12.push({ path: 'avatar', img: cfg.contact.avatar, on: cfg.template === 'agent' || on('agent') });
if (cfg.seo.og_image) _o12.push({ path: 'og', img: cfg.seo.og_image, on: true });
return _o12.filter((_o1t) => _os(_o1t.img));
}
export function pageCss(cfg) {
const c1 = validColor(cfg.brand.c1) ? cfg.brand.c1 : DEFAULT_COLORS.c1, c2 = validColor(cfg.brand.c2) ? cfg.brand.c2 : DEFAULT_COLORS.c2;
const _om = cfg.brand.font === 'sans' ? '"Be Vietnam Pro",system-ui,sans-serif' : '"Playfair Display",Georgia,serif';
return `:root{--c1:${c1};--c2:${c2};--bg:#FAF7F1;--card:#fff;--ink:#151B26;--muted:#5F6878;--line:#E7E1D6;--ok:#17784A;--bad:#B0281F;--r:18px;--sh:0 10px 30px rgba(14,27,46,.10)}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 "Be Vietnam Pro",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding-bottom:76px}
h1,h2,h3{font-family:${_om};line-height:1.15;letter-spacing:-.2px;margin:0}
a{color:inherit}img{max-width:100%;display:block}
.lp-wrap{max-width:1080px;margin:0 auto;padding:0 16px}
.lp-top{position:sticky;top:0;z-index:20;background:var(--c1);color:#fff}
.lp-top .lp-wrap{display:flex;align-items:center;gap:10px;min-height:56px}
.lp-brand{font-weight:800;font-size:17px;letter-spacing:.2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.lp-pill{margin-left:auto;display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:9px 14px;font-weight:700;font-size:14px;text-decoration:none;background:var(--c2);color:#1A1405;white-space:nowrap}
.lp-hero{background:radial-gradient(120% 90% at 85% 0%,rgba(255,255,255,.12) 0%,rgba(255,255,255,0) 55%),var(--c1);color:#fff;overflow:hidden}
.lp-hero .lp-wrap{display:grid;gap:22px;padding:28px 16px 36px}
.lp-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--c2);border:1px solid var(--c2);padding:5px 12px;border-radius:999px}
.lp-hero h1{font-size:clamp(28px,7vw,50px);margin:14px 0 10px}
.lp-lead{font-size:17px;color:rgba(255,255,255,.82);margin:0 0 18px}
.lp-cta{display:flex;flex-wrap:wrap;gap:10px}
.lp-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:14px;padding:14px 20px;min-height:48px;font:700 16px "Be Vietnam Pro",system-ui,sans-serif;text-decoration:none;cursor:pointer;background:var(--c2);color:#1A1405}
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
.lp-in{width:100%;min-height:48px;border:1px solid var(--line);border-radius:12px;padding:10px 12px;font:16px "Be Vietnam Pro",system-ui,sans-serif;background:#fff;color:var(--ink)}
.lp-ck{display:flex;gap:10px;align-items:flex-start;font-size:14px;font-weight:400;color:var(--ink)}.lp-ck input{width:22px;height:22px;flex:none;margin-top:2px;accent-color:var(--c1)}
.lp-pref{display:flex;flex-wrap:wrap;gap:8px;font-size:14px}.lp-pref label{display:flex;align-items:center;gap:6px;border:1px solid var(--line);border-radius:999px;padding:8px 12px;background:#fff}
.lp-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}
.lp-err{color:var(--bad);font-size:14px;font-weight:600;min-height:1em}
.lp-trust{font-size:13px;color:var(--muted);text-align:center}
.lp-done{background:#EAF6EF;border:1px solid #BFE3CD;border-radius:14px;padding:16px;display:grid;gap:8px}.lp-done-h{font-weight:800;font-size:18px;margin:0}.lp-done p{margin:0}
.lp-calc{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.lp-out{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}.lp-out div{background:var(--bg);border-radius:12px;padding:10px}.lp-out small{display:block;color:var(--muted);font-size:12px}.lp-out b{font-size:17px}
.lp-cd{display:inline-block;margin-top:12px;font-weight:700;color:var(--c2)}
.lp-docbox{display:grid;gap:12px}
details.lp-pol{margin-top:8px}details.lp-pol summary{cursor:pointer;color:#fff;text-decoration:underline}
footer.lp-foot{background:var(--c1);color:rgba(255,255,255,.72);font-size:13px;margin-top:40px;padding:26px 0 30px}footer.lp-foot b{color:#fff}footer.lp-foot p{margin:0 0 10px}
.lp-dock{position:fixed;left:0;right:0;bottom:0;z-index:30;display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:8px 10px calc(8px + env(safe-area-inset-bottom));background:rgba(255,255,255,.96);border-top:1px solid var(--line)}
.lp-dock a{white-space:nowrap;font-size:15px;display:flex;align-items:center;justify-content:center;gap:6px;min-height:48px;border-radius:14px;font-weight:800;text-decoration:none}
.lp-dock .z{background:#0068FF;color:#fff}.lp-dock .c{background:var(--c2);color:#1A1405}
@media (min-width:760px){
 .lp-hero .lp-wrap{grid-template-columns:1.15fr .85fr;align-items:center;padding:56px 16px 64px}
 .lp-grid{grid-template-columns:repeat(3,1fr)}.lp-gal{grid-template-columns:repeat(3,1fr)}.lp-gal .lp-fig:first-child{grid-column:auto}
 .lp-two{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start}
 .lp-calc{grid-template-columns:repeat(4,1fr)}.lp-out{grid-template-columns:repeat(4,1fr)}
 #lp-form .lp-card{max-width:760px;margin:0 auto}body{padding-bottom:0}.lp-dock{left:auto;right:18px;bottom:18px;width:340px;border-radius:18px;border:1px solid var(--line);box-shadow:var(--sh)}
}`;
}
function _o15(_o1b) {
let _o12 = '';
if (_o1b.fb) _o12 += `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${_o1b.fb}');fbq('track','PageView');</script>\n<noscript><img height="1" width="1" alt="" src="https://www.facebook.com/tr?id=${_o1b.fb}&amp;ev=PageView&amp;noscript=1"></noscript>\n`;
if (_o1b.tiktok) _o12 += `<script>!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${_o1b.tiktok}');ttq.page();}(window,document,'ttq');</script>\n`;
if (_o1b.google) _o12 += `<script async src="https://www.googletagmanager.com/gtag/js?id=${_o1b.google}"></script>\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${_o1b.google}');</script>\n`;
return _o12;
}
const _ot = (o) => JSON.stringify(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
export function eventAt(ev) {
const _oc = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(ev && ev.date || '')); if (!_oc) return 0;
const t = /^(\d{1,2}):(\d{2})$/.exec(String(ev.time || '00:00')) || [0, 0, 0];
return Date.UTC(+_oc[1], +_oc[2] - 1, +_oc[3], +t[1] - 7, +t[2]);
}
const dmy = (iso) => { const _o10 = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || '')); return _o10 ? `${_o10[3]}/${_o10[2]}/${_o10[1]}` : ''; };
export function renderPage(cfg, data = {}, opts = {}) {
const target = opts.target || 'static';
const preview = target === 'preview';
const on = (s) => cfg.order.includes(s) && !!cfg.on[s];
const sample = (s) => (cfg.samples || []).includes(s);
const badge = '<span class="lp-badge" data-sample="1">Mẫu</span>';
const _o13 = data.project || null;
const phone = normPhone(cfg.contact.phone), zalo = normPhone(cfg.contact.zalo) || phone;
const zaloHref = zalo ? 'https://zalo.me/' + zalo : '';
const img = (im, alt, cls = 'lp-fig') => {
let _o1i = '', isSample = false, note = '';
if (im && im.kind === 'url' && imageUrl(im.url)) {
if (preview) { _o1i = sampleSvg(im.url, [200, 210], 'room'); note = '<span class="lp-badge">Ảnh từ link – xem ở trang thật</span>'; } else _o1i = imageUrl(im.url);
} else if (im && im.kind === 'local' && opts.imgSrc) _o1i = opts.imgSrc(im) || '';
if (!_o1i) { _o1i = sampleSvg(im && (im.seed || im.id) || alt, (data.project && data.project.hue) || null, (im && im.look) || 'city'); isSample = true; }
return `<figure class="${cls}"><img src="${esc(_o1i)}" alt="${esc(alt)}" loading="lazy" decoding="async">${isSample ? badge : note}</figure>`;
};
const _on = (s, title) => `<div class="lp-h"><h2>${esc(title)}</h2>${sample(s) ? badge : ''}</div>`;
const sec = (s, title, _o7) => `<section class="lp-sec" id="lp-${s}"><div class="lp-wrap">${_on(s, title)}${_o7}</div></section>`;
const _oj = (kind) => {
const F = cfg.s.form, doc = cfg.s.doc;
let interest = '';
if (kind === 'main' && F.interest) {
if (cfg.template === 'agent') interest = `<label class="lp-f">Anh/chị cần<select class="lp-in" name="interest" data-kind="need"><option value="mua">Mua</option><option value="thuê">Thuê</option><option value="bán">Ký gửi bán</option><option value="cho thuê">Ký gửi cho thuê</option></select></label>`;
else if (cfg.template === 'event') interest = `<label class="lp-f">Số người tham dự<select class="lp-in" name="people"><option>1</option><option>2</option><option>3+</option></select></label>`;
else if (_o13 && (_o13.types || []).length) interest = `<label class="lp-f">Loại căn quan tâm<select class="lp-in" name="interest" data-kind="unit"><option value="">Chưa rõ</option>${_o13.types.map((t) => `<option>${esc(t.n)}</option>`).join('')}</select></label>`;
}
const _o1q = kind === 'doc' ? `data-want="${esc('Tài liệu: ' + doc.title)}" data-thanks="Chuyên viên gửi tài liệu qua Zalo trong ít phút."${safeHttps(doc.url) ? ` data-doc-url="${esc(safeHttps(doc.url))}"` : ''}` : '';
const n = kind === 'doc' ? 'd' : 'm';
return `<form class="lp-form" data-lp-form="${kind}" novalidate autocomplete="on" ${_o1q}>
<label class="lp-f">Họ và tên<input class="lp-in" name="name" autocomplete="name" autocapitalize="words" maxlength="120" placeholder="Nguyễn Văn A"></label>
<label class="lp-f">Số điện thoại / Zalo<input class="lp-in" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="20" placeholder="09xx xxx xxx"></label>
${interest}
<div class="lp-pref" role="radiogroup" aria-label="Cách liên hệ"><label><input type="radio" name="pref" value="Nhắn Zalo" checked>💬 Nhắn Zalo</label><label><input type="radio" name="pref" value="Gọi điện">📞 Gọi cho tôi</label></div>
<label class="lp-ck"><input type="checkbox" name="consent" required><span>Tôi đồng ý cho ${esc(cfg.contact.name || 'chuyên viên')} dùng họ tên, số điện thoại này để tư vấn bất động sản theo <a href="#lp-data">chính sách dữ liệu cá nhân</a>. Có thể yêu cầu xoá bất kỳ lúc nào.</span></label>
<input class="lp-hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" id="lp-hp-${n}">
<div class="lp-err" role="alert"></div>
<button type="submit" class="lp-btn">${esc(kind === 'doc' ? doc.button : F.button)}</button>
<div class="lp-trust">🔒 Không chia sẻ cho bên thứ ba · Chỉ liên hệ đúng cách anh/chị chọn</div></form>`;
};
const _o14 = {};
{
const _o2 = cfg.s.hero;
const _o1g = img(_o2.image, cfg.template === 'agent' ? 'Ảnh minh hoạ' : _o2.heading || 'Ảnh dự án');
let _of = '';
if (cfg.template === 'project' && _o13) {
const _ow = [['Giá niêm yết', priceLabel(_o13) || 'Nhận bảng giá'], ['Bàn giao', _o13.handover ? ymLabel(_o13.handover) : 'Chưa công bố'], ['Trạng thái', _o6[_o13.status] || '–']];
_of = `<div class="lp-kpis">${_ow.map(([a, b]) => `<div class="lp-kpi"><small>${esc(a)}</small><b>${esc(b)}</b></div>`).join('')}</div>`;
} else if (cfg.template === 'event') {
const _o1 = cfg.s.event, at = eventAt(_o1);
_of = `<div class="lp-kpis"><div class="lp-kpi"><small>Ngày</small><b>${esc(dmy(_o1.date) || 'Sắp công bố')}</b></div><div class="lp-kpi"><small>Giờ</small><b>${esc(_o1.time || '–')}</b></div><div class="lp-kpi"><small>Địa điểm</small><b>${esc(_o1.place || '–')}</b></div></div>${at ? `<div class="lp-cd" data-lp-countdown data-at="${at}"></div>` : ''}`;
} else if (cfg.template === 'agent') {
const C = cfg.contact;
_of = `<div class="lp-me">${img(C.avatar, C.name || 'Ảnh đại diện', 'lp-ava')}<div><b>${esc(C.name || '')}</b><span>${esc([C.title, C.cert ? 'CCHN ' + C.cert : '', C.company].filter(Boolean).join(' · '))}</span></div></div>`;
}
const cta = `<div class="lp-cta">${on('form') ? `<a class="lp-btn" href="#lp-form">${esc(_o2.cta)}</a>` : ''}${zaloHref && on('contact') ? `<a class="lp-btn lp-btn-2" href="${esc(zaloHref)}" target="_blank" rel="noopener">💬 Zalo</a>` : ''}</div>`;
_o14.hero = `<section class="lp-hero" id="lp-hero"><div class="lp-wrap"><div><span class="lp-eyebrow">${esc(_o2.eyebrow)}</span><h1>${esc(_o2.heading)}</h1><p class="lp-lead">${esc(_o2.sub)}</p>${cta}${_of}</div>${_o1g}</div></section>`;
}
_o14.location = sec('location', SECTIONS.location, `<div class="lp-two"><div class="lp-card"><p>${_o11(cfg.s.location.text)}</p></div><ul class="lp-list">${_oz(cfg.s.location.items).map((_o1t) => `<li>${esc(_o1t)}</li>`).join('')}</ul></div>`);
const rows = priceRows(_o13, data.plans);
if (rows.length) {
const _o1n = data.today ? ` Cập nhật ${dmy(data.today)}.` : '';
_o14.price = sec('price', SECTIONS.price, `<div class="lp-card lp-scroll"><table class="lp-tbl"><thead><tr><th>Loại căn</th><th>Diện tích</th><th class="n">Giá tham khảo</th></tr></thead><tbody>${rows.map((r) => `<tr><td><b>${esc(r.type)}</b></td><td>${esc(r.area)}</td><td class="n">${esc(r.price)}</td></tr>`).join('')}</tbody></table>
<p class="lp-muted">${esc(priceNote(data.policy))}${esc(_o1n)}${cfg.s.price.note ? ' ' + esc(cfg.s.price.note) : ''}</p></div>`);
}
const _o19 = policyRows(data.plans);
if (_o19.length) {
_o14.policy = sec('policy', SECTIONS.policy, `<div class="lp-card lp-scroll"><table class="lp-tbl"><thead><tr><th>Phương án</th><th class="n">Chiết khấu</th><th class="n">Vay</th><th class="n">Hỗ trợ lãi</th></tr></thead><tbody>${_o19.map((r) => `<tr><td><b>${esc(r.name)}</b>${r.sub ? `<div class="lp-muted">${esc(r.sub)}</div>` : ''}</td><td class="n">${esc(r.disc)}</td><td class="n">${esc(r.loan)}</td><td class="n">${esc(r.htls)}</td></tr>`).join('')}</tbody></table>
<p class="lp-muted">${esc(data.policy && data.policy.month ? policyLabel(data.policy) : 'Chính sách tham khảo')} – chi tiết từng đợt thanh toán gửi kèm báo giá.${cfg.s.policy.note ? ' ' + esc(cfg.s.policy.note) : ''}</p></div>`);
}
{
const L = cfg.s.loan;
const _or = (name, label, val, step) => `<label class="lp-f">${label}<input class="lp-in" name="${name}" type="number" inputmode="decimal" min="0" step="${step}" value="${esc(val)}"></label>`;
_o14.loan = sec('loan', SECTIONS.loan, `<div class="lp-card" data-lp-loan><div class="lp-calc">${_or('price', 'Giá căn (tỷ)', L.price, '0.01')}${_or('ltv', 'Vay (% giá)', L.ltv, '1')}${_or('rate', 'Lãi suất (%/năm)', L.rate, '0.1')}${_or('years', 'Thời hạn (năm)', L.years, '1')}</div>
<div class="lp-out"><div><small>Số tiền vay</small><b data-out="loan">–</b></div><div><small>Vốn tự có</small><b data-out="own">–</b></div><div><small>Tháng đầu (gốc đều)</small><b data-out="first">–</b></div><div><small>Trả đều mỗi tháng</small><b data-out="annuity">–</b></div></div>
<p class="lp-muted">Lãi suất giả định, chưa tính hỗ trợ lãi của chủ đầu tư – số liệu để tham khảo, không phải cam kết của ngân hàng.</p></div>`);
}
const _ol = (cfg.s.gallery.images || []).slice(0, 9);
if (_ol.length) _o14.gallery = sec('gallery', SECTIONS.gallery, `<div class="lp-gal">${_ol.map((im, _op) => img(im, (cfg.s.hero.heading || 'Ảnh') + ' ' + (_op + 1))).join('')}</div>`);
const F = cfg.s.form;
_o14.form = `<section class="lp-sec" id="lp-form"><div class="lp-wrap"><div class="lp-card"><div class="lp-h"><h2>${esc(F.heading)}</h2></div><p class="lp-muted">${esc(F.sub)}</p>${_oj('main')}</div></div></section>`;
const _o0 = cfg.s.doc;
_o14.doc = sec('doc', 'Nhận tài liệu', `<div class="lp-card lp-docbox"><p><b>${esc(_o0.title)}</b></p><p class="lp-muted">${esc(_o0.desc)}</p>${_oj('doc')}</div>`);
_o14.facts = sec('facts', SECTIONS.facts, `<ul class="lp-list">${_oz(cfg.s.facts.items).map((_o1t) => `<li>${esc(_o1t)}</li>`).join('')}</ul>`);
{
const _o1 = cfg.s.event;
_o14.event = sec('event', SECTIONS.event, `<div class="lp-two"><div class="lp-card"><p><b>${esc(dmy(_o1.date) || 'Ngày: sắp công bố')}${_o1.time ? ' · ' + esc(_o1.time) : ''}</b></p><p>${_o11(_o1.place)}</p></div><ul class="lp-list">${_oz(_o1.agenda).map((_o1t) => `<li>${esc(_o1t)}</li>`).join('')}</ul></div>`);
}
{
const G = cfg.s.agent;
_o14.agent = sec('agent', SECTIONS.agent, `<div class="lp-two"><div class="lp-card"><p>${_o11(G.bio)}</p></div><ul class="lp-list">${_oz(G.bullets).map((_o1t) => `<li>${esc(_o1t)}</li>`).join('')}</ul></div>`);
}
const _o17 = (data.projects || []).filter(Boolean).slice(0, 12);
if (_o17.length) {
_o14.projects = sec('projects', SECTIONS.projects, `<div class="lp-grid">${_o17.map((_o1t) => `<article class="lp-pcard">${img({ kind: 'sample', seed: _o1t.id, look: 'city' }, _o1t.name)}<div class="lp-pb"><b>${esc(_o1t.name)}</b><span class="lp-muted">${esc([_o6[_o1t.status], _o1t.loc].filter(Boolean).join(' · '))}</span><p>${esc(priceLabel(_o1t) || 'Nhận bảng giá')}</p></div></article>`).join('')}</div>`);
}
const _o7 = cfg.order.filter((s) => s === 'hero' || on(s)).filter((s) => s !== 'contact').map((s) => _o14[s] || '').join('\n');
const _oe = on('contact') && (phone || zalo) ? `<nav class="lp-dock" aria-label="Liên hệ nhanh">${zalo ? `<a class="z" href="${esc(zaloHref)}" target="_blank" rel="noopener">💬 Zalo</a>` : ''}${phone ? `<a class="c" href="tel:${esc(phone)}">📞 Gọi ${esc(phoneText(phone))}</a>` : ''}</nav>` : '';
const C = cfg.contact;
const _o1b = preview ? {} : activePixels(cfg);
const _o1r = [C.name ? `<b>${esc(C.name)}</b>` : '', C.cert ? 'Chứng chỉ hành nghề môi giới số ' + esc(C.cert) : '', C.company ? 'Hành nghề tại ' + esc(C.company) : '', phone ? 'Hotline/Zalo ' + esc(phoneText(phone)) : ''].filter(Boolean).join(' · ');
const _o1c = Object.keys(_o1b).length ? ` Trang dùng công cụ đo lường quảng cáo (${Object.keys(_o1b).map((_ou) => PIXEL_NAMES[_ou]).join(', ')}) để đo hiệu quả quảng cáo; không gửi họ tên, số điện thoại của anh/chị cho các công cụ này.` : '';
const _oi = `<footer class="lp-foot" id="lp-data"><div class="lp-wrap">${_o1r ? `<p>${_o1r}</p>` : ''}
<p>Giá và chính sách trên trang là <b>thông tin tham khảo</b>, không phải bảng giá chính thức của chủ đầu tư. Giá, chiết khấu, tiến độ thanh toán, hỗ trợ lãi suất và điều kiện vay thực tế theo chính sách bán hàng, hợp đồng và ngân hàng tại thời điểm ký. Tên dự án và chủ đầu tư chỉ dùng để nhận diện sản phẩm; đây là trang tư vấn cá nhân, không phải trang của chủ đầu tư.</p>
<details class="lp-pol"><summary>Chính sách bảo vệ dữ liệu cá nhân</summary><p>Họ tên, số điện thoại và nhu cầu anh/chị để lại chỉ dùng để tư vấn mua, bán, cho thuê bất động sản theo yêu cầu, chỉ khi anh/chị đã tick ô đồng ý. Không bán hoặc chia sẻ cho bên thứ ba khi chưa có sự đồng ý. Anh/chị có quyền xem, sửa, rút lại đồng ý hoặc yêu cầu xoá dữ liệu bất kỳ lúc nào${phone ? ' qua số ' + esc(phoneText(phone)) : ''}. Dữ liệu lưu tối đa 24 tháng kể từ lần liên hệ cuối hoặc đến khi anh/chị yêu cầu xoá.${esc(_o1c)}</p></details></div></footer>`;
const css = pageCss(cfg);
const base = normBaseUrl(opts.baseUrl || '') || normBaseUrl(cfg.seo.base_url);
const title = String(cfg.seo.title || cfg.name || 'Trang').trim().slice(0, 90);
const desc = String(cfg.seo.description || '').trim().slice(0, 300);
let og = '';
if (cfg.seo.og_image && cfg.seo.og_image.kind === 'url' && imageUrl(cfg.seo.og_image.url)) og = imageUrl(cfg.seo.og_image.url);
else if (cfg.seo.og_image && cfg.seo.og_image.kind === 'local' && base && opts.ogPath) og = base + opts.ogPath;
const cfgJson = {
server: opts.server || '', landing_id: cfg.id, slug: cfg.slug, project: _o13 ? _o13.name : '', template: cfg.template,
preview: preview ? 1 : 0
};
const _oy = cfg.template === 'event' && eventAt(cfg.s.event)
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
preview ? '' : _o15(_o1b),
_oy && !preview ? `<script type="application/ld+json">${_ot(JSON.parse(JSON.stringify(_oy)))}</script>` : ''
].filter(Boolean).join('\n');
const _o1f = preview ? '' : `<script type="application/json" id="lp-cfg">${_ot(cfgJson)}</script>\n<script>${pageScript()}</script>`;
const html = `<!doctype html>\n<html lang="vi">\n<head>\n${headTags}\n</head>\n<body class="lp${preview ? ' lp-preview' : ''}">\n<header class="lp-top"><div class="lp-wrap"><span class="lp-brand">${esc(cfg.brand.name || C.name || '')}</span>${phone ? `<a class="lp-pill" href="tel:${esc(phone)}">📞 ${esc(phoneText(phone))}</a>` : ''}</div></header>\n<main>\n${_o7}\n</main>\n${_oi}\n${_oe}\n${_o1f}\n</body>\n</html>\n`;
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
const _o1o = new Set();
const imgSrc = (im) => { const _og = images[im.id]; if (!_og) return ''; _o1o.add(im.id); return 'img/' + im.id + '.' + (_og.ext || 'jpg'); };
const og = cfg.seo.og_image && cfg.seo.og_image.kind === 'local' && images[cfg.seo.og_image.id] ? 'img/' + cfg.seo.og_image.id + '.' + (images[cfg.seo.og_image.id].ext || 'jpg') : '';
const { html } = renderPage(cfg, data, { target: 'static', server, imgSrc, ogPath: og });
if (og) _o1o.add(cfg.seo.og_image.id);
files.push({ name: 'index.html', data: html });
for (const id of _o1o) files.push({ name: 'img/' + id + '.' + (images[id].ext || 'jpg'), data: images[id].bytes });
const base = normBaseUrl(cfg.seo.base_url) || 'https://' + cfg.slug + '.pages.dev/';
const _od = new Date(now).toISOString().slice(0, 10);
files.push({ name: 'robots.txt', data: `User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n` });
files.push({ name: 'sitemap.xml', data: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${esc(base)}</loc><lastmod>${_od}</lastmod></url>\n</urlset>\n` });
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
const _o1m = String(url || ''); const _o9 = String(code || '').replace(/[^a-z0-9]/gi, '').slice(0, 16);
if (!_o1m || !_o9) return _o1m;
return _o1m + (_o1m.includes('?') ? '&' : '?') + 's=' + _o9;
}
export const gasPageUrl = (serverUrl, slug) => (serverUrl ? String(serverUrl).replace(/[?#].*$/, '') + '?p=' + encodeURIComponent(slug) : '');

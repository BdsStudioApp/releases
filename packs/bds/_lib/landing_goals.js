export const GOALS = ['so_cap', 'booking', 'thu_cap'];
export const GOAL_INFO = {
so_cap: { icon: '🏗', title: 'Phễu lọc khách mua dự án mới', desc: 'Bảng giá, chính sách, tính vốn – lọc ra khách thật sự quan tâm.' },
booking: { icon: '⭐', title: 'Gom booking', desc: 'Khách đăng ký booking ưu tiên: dự án, loại căn, tầng/hướng, cách thanh toán. Trang không thu tiền.' },
thu_cap: { icon: '🔑', title: 'Mua bán – cho thuê chuyển nhượng', desc: 'Rổ hàng Đang bán / Cho thuê có bộ lọc, nút cho chủ nhà ký gửi.' }
};
export const GOAL_TPLS = {
so_cap: ['lead60', 'hub', 'cashflow', 'luxury'],
booking: ['prelaunch', 'lead60', 'township'],
thu_cap: ['secondary', 'hub', 'bio']
};
export const GOAL_SECTIONS = { booking: ['booking'], thu_cap: ['listings', 'kygui'] };
export const GOAL_SECTION_IDS = ['booking', 'listings', 'kygui'];
export function goalsOf(x) {
const g = Array.isArray(x) ? x.map(String) : [];
const out = GOALS.filter((_o3) => g.includes(_o3));
return out.length ? out : ['so_cap'];
}
export const fitsGoals = (tpl, goals) => goalsOf(goals).some((g) => GOAL_TPLS[g].includes(tpl));
export function pickTemplate(goals) {
const g = goalsOf(goals);
if (g.includes('thu_cap') && g.length > 1) return 'hub';
return GOAL_TPLS[g[0]][0];
}
export function sortTemplates(ids, goals) {
const g = goalsOf(goals);
const _o7 = (id) => { let _o6 = Infinity; g.forEach((_o3, gi) => { const _o2 = GOAL_TPLS[_o3].indexOf(id); if (_o2 >= 0) _o6 = Math.min(_o6, _o2 * 10 + gi); }); return _o6; };
const fit = ids.filter((id) => fitsGoals(id, g)).sort((a, b) => _o7(a) - _o7(b) || ids.indexOf(a) - ids.indexOf(b));
return [...fit, ...ids.filter((id) => !fitsGoals(id, g))];
}
export function goalSectionOn(sec, goals) {
const g = goalsOf(goals);
for (const _o3 of Object.keys(GOAL_SECTIONS)) if (GOAL_SECTIONS[_o3].includes(sec)) return g.includes(_o3);
return null;
}
export function switcherItems(goals, { primaryHref = '#lp-form' } = {}) {
const g = goalsOf(goals);
if (g.length < 2) return [];
const out = [];
if (g.includes('so_cap')) out.push({ key: 'so_cap', icon: '🏗', label: 'Mua căn dự án mới', href: primaryHref });
if (g.includes('booking')) out.push({ key: 'booking', icon: '⭐', label: 'Đăng ký booking', href: '#lp-booking' });
if (g.includes('thu_cap')) {
out.push({ key: 'mua_cn', icon: '🔑', label: 'Mua căn chuyển nhượng', href: '#lp-listings', tab: 'ban' });
out.push({ key: 'thue', icon: '🏠', label: 'Thuê căn hộ', href: '#lp-listings', tab: 'thue' });
out.push({ key: 'ky_gui', icon: '📝', label: 'Chủ nhà ký gửi bán / cho thuê', href: '#lp-kygui' });
}
return out;
}
export const LIST_COLS = ['loai', 'du_an', 'ma', 'toa', 'tang', 'pn', 'dt', 'huong', 'gia', 'noi_that', 'ghi_chu'];
export const LIST_HEAD = ['Loại (Bán/Cho thuê)', 'Dự án', 'Mã căn', 'Toà', 'Tầng', 'Số PN', 'Diện tích (m²)', 'Hướng', 'Giá', 'Nội thất', 'Ghi chú'];
export const LIST_MAX = 60;
const _o0 = (v, _o5 = 80) => String(v == null ? '' : v).replace(/[\u0000-\u001f<>"`\\]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, _o5);
const _o1 = (_o9) => String(_o9 || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
export function priceVnd(text, kind = 'ban') {
const _o9 = _o1(text).replace(/\s+/g, ' ');
const _o4 = _o9.match(/(\d+(?:[.,]\d+)*)\s*(ty|t\b|trieu|tr\b|tr\/|k\b|nghin|d\b|dong|vnd)?/);
if (!_o4) return 0;
let _o8 = _o4[1];
if (/^\d{1,3}([.,]\d{3}){2,}$/.test(_o8) || /^\d{1,3}[.,]\d{3}$/.test(_o8) && !_o4[2]) _o8 = _o8.replace(/[.,]/g, '');
else _o8 = _o8.replace(',', '.');
const _o5 = Number(_o8);
if (!isFinite(_o5) || _o5 <= 0) return 0;
const _ob = _o4[2] || '';
if (/^ty|^t$/.test(_ob)) return Math.round(_o5 * 1e9);
if (/^tr|^trieu/.test(_ob)) return Math.round(_o5 * 1e6);
if (/^k|^nghin/.test(_ob)) return Math.round(_o5 * 1e3);
if (/^d|^dong|^vnd/.test(_ob) || _o5 >= 1e5) return Math.round(_o5);
return Math.round(_o5 * (kind === 'thue' ? 1e6 : (_o5 < 100 ? 1e9 : 1e6)));
}
export function priceText(v, kind = 'ban') {
const _o5 = Number(v) || 0;
if (!_o5) return '';
const t = _o5 >= 1e9 ? (Math.round(_o5 / 1e7) / 100).toString().replace('.', ',') + ' tỷ' : Math.round(_o5 / 1e5) / 10 + ' triệu';
return (kind === 'thue' ? t.replace('.', ',') + '/tháng' : t.replace('.', ','));
}
export function maskCode(code) {
const _o9 = _o0(code, 30);
if (_o9.length < 3) return _o9 ? '**' : '';
return _o9.slice(0, -2) + '**';
}
const kindOf = (v) => (/thue|cho thue|rent/.test(_o1(v)) ? 'thue' : 'ban');
export function parseListings(text) {
return String(text || '').split(/\r?\n/).map((l) => l.replace(/\s+$/, '')).filter((l) => l.trim())
.map((l) => l.split(l.includes('\t') ? '\t' : /\s*[;|]\s*/))
.filter((c) => !/^(loai|loại)\b/i.test(_o1(c[0]).trim()))
.map((c) => {
const o = {};
LIST_COLS.forEach((_o3, _o2) => { o[_o3] = _o0(c[_o2], _o3 === 'ghi_chu' ? 140 : 60); });
o.loai = kindOf(o.loai);
return o;
})
.filter((o) => o.du_an || o.ma || o.gia)
.slice(0, LIST_MAX);
}
export function listingsText(list) {
return (list || []).map((o) => LIST_COLS.map((_o3) => (_o3 === 'loai' ? (o.loai === 'thue' ? 'Cho thuê' : 'Bán') : o[_o3] || '')).join('\t')).join('\n');
}
export function fromInventory(rows, projectName = (x) => x) {
const out = [];
for (const _o6 of rows || []) {
if (!_o6 || _o6.kind !== 'g4_listing' || Number(_o6.deleted)) continue;
let d = _o6.data;
if (typeof d === 'string') { try { d = JSON.parse(d || '{}'); } catch { d = {}; } }
d = d && typeof d === 'object' ? d : {};
const _oa = _o6.status || 'dang_chao';
if (_oa !== 'dang_chao' && _oa !== 'giu_cho') continue;
const kind = d.deal === 'cho_thue' ? 'thue' : 'ban';
const price = Number(d.price) || 0;
out.push({
loai: kind, du_an: _o0(projectName(_o6.project) || _o6.project || '', 60), ma: _o0(d.unit_code, 30), toa: '', tang: _o0(d.floor, 20),
pn: _o0(_o6.unit_type, 30), dt: d.area ? String(d.area) : '', huong: _o0(d.direction, 30), gia: priceText(price, kind),
noi_that: '', ghi_chu: _oa === 'giu_cho' ? 'Đang có khách giữ chỗ' : '', g: price, src: 'kho'
});
}
return out;
}
export function listingItems(cfg, inventory = []) {
const pasted = Array.isArray(cfg && cfg.listings) ? cfg.listings : [];
const inv = cfg && cfg.useInventory === false ? [] : (inventory || []);
return [...inv, ...pasted].slice(0, LIST_MAX * 2).map((o) => {
const _o3 = o.loai === 'thue' ? 'thue' : 'ban';
return { ...o, loai: _o3, g: Number(o.g) || priceVnd(o.gia, _o3) };
});
}
export const PRICE_BUCKETS = {
ban: [[0, 2e9, 'Dưới 2 tỷ'], [2e9, 3e9, '2–3 tỷ'], [3e9, 5e9, '3–5 tỷ'], [5e9, 0, 'Trên 5 tỷ']],
thue: [[0, 8e6, 'Dưới 8 triệu'], [8e6, 15e6, '8–15 triệu'], [15e6, 25e6, '15–25 triệu'], [25e6, 0, 'Trên 25 triệu']]
};

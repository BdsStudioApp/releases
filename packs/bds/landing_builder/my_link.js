import { h } from '../_lib/kit.js';
import * as L from '../_lib/landing.js';
import * as AP from '../_lib/landing_app.js';
import * as LO from '../_lib/landing_owner.js';
import { qrElement } from '../../../core/qr.aa623cdb09.js';
export const NO_PAGE_TEXT = 'Quản trị chưa đăng trang nào';
export const PIXEL_HINT = 'Gắn mã Pixel ở thẻ Theo dõi quảng cáo của trang để Facebook/TikTok tối ưu theo khách để lại số.';
export const CHANNELS = [['facebook', 'Facebook'], ['tiktok', 'TikTok'], ['google', 'Google'], ['zalo', 'Zalo'], ['khac', 'Khác']];
export function slugCampaign(s) {
return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
.trim().replace(/\s+/g, '-').replace(/[^a-z0-9_-]/g, '').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}
export function channelSource(channel, _ob = '') {
const c = String(channel || '');
return c === 'khac' ? slugCampaign(_ob) : CHANNELS.some(([k]) => k === c) ? c : slugCampaign(c);
}
export function adLink(url, { source = '', campaign = '', code = '' } = {}) {
const _oi = String(url || '').trim();
if (!_oi) return '';
const add = [['utm_source', slugCampaign(source)], ['utm_campaign', slugCampaign(campaign)], ['s', String(code || '').replace(/[^a-z0-9]/gi, '').slice(0, 16)]].filter(([, v]) => v);
const [pre, hash = ''] = _oi.split('#');
const [base, qs = ''] = pre.split('?');
const keep = qs ? qs.split('&').filter((kv) => kv && !add.some(([k]) => kv.split('=')[0] === k)) : [];
const _o1 = [...keep, ...add.map(([k, v]) => k + '=' + encodeURIComponent(v))];
return base + (_o1.length ? '?' + _o1.join('&') : '') + (hash ? '#' + hash : '');
}
export const companyPages = (list) => (list || []).filter((_oj) => _oj && !_oj.own);
export function pageUrl(_oj, { appT = null, serverUrl = '' } = {}) {
return (_oj && _oj.app && appT ? AP.pageUrl(appT, _oj.slug) : '') || (_oj && _oj.url) || L.gasPageUrl(serverUrl, _oj && _oj.slug);
}
function _oe(K, link, testid) {
const box = h('div', { class: 'lb-qr', hidden: true, 'data-testid': testid + '-box' });
const _o2 = K.button('Mã QR', () => {
if (box.hidden && !box.firstChild) { try { box.appendChild(qrElement(link, { scale: 4, title: 'Mã QR của link' })); } catch { box.textContent = 'Link quá dài để tạo mã QR.'; } }
box.hidden = !box.hidden;
}, { kind: 'ghost', small: true, testid });
return [_o2, box];
}
function _o7(K, title, link, testid, extra = null) {
const [qb, qbox] = _oe(K, link, testid + '-qr');
return h('div', { class: 'lb-link', 'data-testid': testid },
title ? h('b', null, title) : null,
h('code', null, link || '(xem thử – chưa có địa chỉ thật)'),
link ? K.button('Chép', async () => { await K.copy(link); K.toast('Đã chép link', 'ok'); }, { kind: 'ghost', small: true, icon: 'copy', testid: testid + '-copy' }) : null,
link ? qb : null, extra, link ? qbox : null);
}
export function myLinkBox(K, ctx, { appT = null, serverUrl = '', onClone = null } = {}) {
const box = h('div', { class: 'lb-card', 'data-testid': 'lp-my-link' }, h('h3', null, '🔗 Link của tôi'), h('span', { class: 'lb-muted' }, 'Đang tải…'));
(async () => {
let code = '', list = [];
try { code = (await K.api('landing.my_code')).code; list = await K.api('landing.published'); }
catch { box.replaceChildren(h('h3', null, '🔗 Link của tôi'), h('p', { class: 'lb-muted' }, 'Máy chủ chưa có chức năng này – cần cập nhật máy chủ.')); return; }
const pages = companyPages(list);
const _o4 = typeof onClone === 'function' && LO.canPublish(ctx) && !LO.isAdmin(ctx);
const _o5 = (_oj) => K.button('Nhân bản thành trang của tôi', async () => {
try { const _of = await K.api('landing.design_copy', { landing_id: _oj.landing_id }); await onClone(_of.landing, code); }
catch (e) { K.toast((e && e.message) || 'Chưa nhân bản được', 'warn'); }
}, { kind: 'ghost', small: true, icon: 'copy', testid: 'lp-clone-' + _oj.slug });
const _og = pages.map((_oj) => _o7(K, _oj.title || _oj.slug, L.saleLink(pageUrl(_oj, { appT, serverUrl }), code), 'lp-mylink-' + _oj.slug, _o4 && _oj.landing_id ? _o5(_oj) : null));
box.replaceChildren(h('h3', null, '🔗 Link của tôi'),
h('p', { class: 'lb-muted' }, 'Link trang công ty gắn mã của anh/chị (' + code + '): khách để lại số qua link này về thẳng Khách hàng của anh/chị, Telegram báo ngay.'),
_og.length ? h('div', { class: 'lb-links' }, _og) : h('p', { class: 'lb-muted', 'data-testid': 'lp-mylink-empty' }, NO_PAGE_TEXT),
_o0(K, [...pages, ...(list || []).filter((_oj) => _oj && _oj.own)], code, { appT, serverUrl }));
})();
return box;
}
function _o0(K, pages, code, _oa) {
if (!pages.length) return null;
const _oc = K.select(pages.map((_oj) => [_oj.slug, _oj.title || _oj.slug]), pages[0].slug, { 'data-testid': 'lp-ad-page' });
const chSel = K.select(CHANNELS, 'facebook', { 'data-testid': 'lp-ad-channel' });
const _ob = h('input', { type: 'text', placeholder: 'Tên nguồn, vd: youtube', maxlength: 40, hidden: true, 'data-testid': 'lp-ad-other' });
const _o3 = h('input', { type: 'text', placeholder: 'Tên chiến dịch, vd: Mở bán tháng 12', maxlength: 80, 'data-testid': 'lp-ad-campaign' });
const out = h('div', { 'data-testid': 'lp-ad-out' });
const _od = () => {
_ob.hidden = chSel.value !== 'khac';
const _oj = pages.find((p) => p.slug === _oc.value) || pages[0];
const link = adLink(pageUrl(_oj, _oa), { source: channelSource(chSel.value, _ob.value), campaign: _o3.value, code });
out.replaceChildren(_o7(K, '', link, 'lp-ad-link'));
};
for (const _o6 of [_oc, chSel]) _o6.addEventListener('change', _od);
for (const _o6 of [_ob, _o3]) _o6.addEventListener('input', _od);
_od();
return h('details', { class: 'lb-more', 'data-testid': 'lp-ad' }, h('summary', null, '📣 Link chạy quảng cáo'),
h('div', { class: 'lb-ed' },
h('label', { class: 'lb-f' }, h('span', null, 'Trang'), _oc),
h('label', { class: 'lb-f' }, h('span', null, 'Kênh'), chSel, _ob),
h('label', { class: 'lb-f' }, h('span', null, 'Tên chiến dịch'), _o3),
out,
h('p', { class: 'lb-muted', 'data-testid': 'lp-ad-hint' }, PIXEL_HINT)));
}
let _o8 = null;
export function ownerTag(K, ctx, cfg) {
if (!LO.isAdmin(ctx)) return null;
const _o6 = h('span', { class: 'lb-muted', 'data-testid': 'lp-owner-' + cfg.id }, LO.ownerLabel(cfg));
if (LO.ownerOf(cfg)) {
_o8 = _o8 || K.api('landing.sale_codes').then((l) => Object.fromEntries((l || []).map((_oi) => [_oi.user_id, _oi.full_name || _oi.username]))).catch(() => ({}));
_o8.then((names) => { _o6.textContent = LO.ownerLabel(cfg, names); });
}
return _o6;
}
export function ownerFilter(K, ctx, list, value, onChange) {
if (!LO.isAdmin(ctx)) return null;
const keys = LO.ownersIn(list);
if (keys.length < 2) return null;
const label = (k, names = {}) => (k === LO.OWNER_COMPANY ? '🏢 Trang công ty' : '👤 ' + (names[k] || 'Nhân viên'));
const _oa = [[LO.OWNER_ALL, 'Tất cả người tạo (' + list.length + ')'], ...keys.map((k) => [k, label(k) + ' (' + LO.filterByOwner(list, k).length + ')'])];
const _oh = K.select(_oa, value || '', { 'data-testid': 'lp-owner-filter', 'aria-label': 'Lọc theo người tạo' });
_oh.addEventListener('change', () => onChange(_oh.value));
_o8 = _o8 || K.api('landing.sale_codes').then((l) => Object.fromEntries((l || []).map((_oi) => [_oi.user_id, _oi.full_name || _oi.username]))).catch(() => ({}));
_o8.then((names) => { for (const _o9 of _oh.options) if (_o9.value && _o9.value !== LO.OWNER_COMPANY) _o9.textContent = label(_o9.value, names) + ' (' + LO.filterByOwner(list, _o9.value).length + ')'; });
return h('label', { class: 'lb-row', 'data-testid': 'lp-owner-filter-row' }, h('span', { class: 'lb-muted' }, 'Lọc theo người tạo'), _oh);
}

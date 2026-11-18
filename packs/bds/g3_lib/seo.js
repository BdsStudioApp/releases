import { strip } from '../_lib/crm.js';
export const LIMITS = { titleMin: 30, titleMax: 60, descMin: 70, descMax: 160, slugMax: 60, wordsMin: 300, sitemapMax: 50000 };
export function slugify(s) { return strip(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, LIMITS.slugMax).replace(/-+$/, ''); }
export function escHtml(s) { return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
export function escXml(s) { return escHtml(s).replace(/&#39;/g, '&apos;'); }
function _oa(s, n) { s = String(s || '').replace(/\s+/g, ' ').trim(); if (s.length <= n) return s; const _o7 = s.slice(0, n - 1); const _og = _o7.lastIndexOf(' '); return (_og > n * 0.6 ? _o7.slice(0, _og) : _o7).replace(/[,.;:–-]+$/, '') + '…'; }
export function joinUrl(base, path) {
const _o3 = String(base || '').trim().replace(/\/+$/, '');
if (!_o3) return '';
const p = String(path || '').replace(/^\/+/, '');
return p ? _o3 + '/' + p : _o3 + '/';
}
function _oz(p) { return (p.types || []).map(t => t && t.n).filter(Boolean); }
function _os(p) {
const _or = Array.isArray(p.price) ? p.price.filter(x => Number(x) > 0) : [];
if (!_or.length) return '';
return _or.length > 1 && _or[0] !== _or[1] ? `${_or[0]}–${_or[1]} triệu/m²` : `${_or[0]} triệu/m²`;
}
function handoverText(h) { const _ol = String(h || '').match(/^(\d{4})-(\d{2})/); return _ol ? `${_ol[2]}/${_ol[1]}` : ''; }
export function projectSeo(p, { brand = '', base = '', month = '' } = {}) {
p = p || {};
const name = String(p.name || p.id || '').trim();
const slug = slugify(name) || slugify(p.id);
const types = _oz(p);
const loc = String(p.loc || p.area || '').trim();
const price = _os(p);
const _of = handoverText(p.handover);
const title = _oa(`${name}: giá, chính sách${month ? ' ' + month : ''}${brand ? ' | ' + brand : ''}`, LIMITS.titleMax);
const _o5 = [`${name}${p.dev ? ' (' + p.dev + ')' : ''}${loc ? ' tại ' + loc : ''}.`];
if (price) _o5.push(`Giá tham khảo ${price}.`);
if (types.length) _o5.push(`Căn ${types.slice(0, 4).join(', ')}.`);
if (_of) _o5.push(`Bàn giao dự kiến ${_of}.`);
_o5.push('Nhận bảng giá, chính sách mới.');
const description = _oa(_o5.join(' '), LIMITS.descMax);
const _oj = strip(name);
const faq = [];
if (price) faq.push({ q: `Giá ${name} bao nhiêu?`, a: `Giá tham khảo ${price} (theo bảng hàng${month ? ' tháng ' + month : ''}; giá chính thức theo phiếu tính giá của chủ đầu tư tại thời điểm giao dịch).` });
if (_of) faq.push({ q: `${name} bàn giao khi nào?`, a: `Dự kiến ${_of}, theo thông tin chủ đầu tư công bố.` });
if (loc) faq.push({ q: `${name} ở đâu?`, a: `${name} nằm tại ${loc}.` });
return {
project_id: p.id || '', slug, name, h1: name, title, description,
keyword: _oj, keywords: [_oj, _oj + ' gia', _oj + ' chinh sach'].filter(Boolean),
canonical: base ? joinUrl(base, slug) : '', image: p.img || '', image_alt: name ? `Phối cảnh ${name}` : '',
loc, dev: p.dev || '', lat: p.lat, lng: p.lng, faq, updated: '',
};
}
const _o0 = 'https://schema.org';
function _o9(o) {
if (Array.isArray(o)) return o.map(_o9).filter(x => x !== undefined);
if (o && typeof o === 'object') {
const r = {};
for (const [k, v] of Object.entries(o)) { const _o7 = _o9(v); if (_o7 !== undefined && _o7 !== '' && !(Array.isArray(_o7) && !_o7.length)) r[k] = _o7; }
return Object.keys(r).length ? r : undefined;
}
return o === null || o === undefined || (typeof o === 'number' && !Number.isFinite(o)) ? undefined : o;
}
function address(loc) {
const _oq = String(loc || '').split(/[·,]/).map(s => s.trim()).filter(Boolean);
if (!_oq.length) return undefined;
return { '@type': 'PostalAddress', streetAddress: _oq.length > 2 ? _oq.slice(0, -2).join(', ') : undefined, addressLocality: _oq.length > 1 ? _oq[_oq.length - 2] : _oq[0], addressRegion: _oq.length > 1 ? _oq[_oq.length - 1] : undefined, addressCountry: 'VN' };
}
export function agentLd({ name, phone, url, image, area, license } = {}) {
return _o9({ '@context': _o0, '@type': 'RealEstateAgent', name, telephone: phone, url, image, areaServed: area, identifier: license });
}
export function projectLd(_ol, agent = {}) {
const geo = Number.isFinite(Number(_ol.lat)) && Number.isFinite(Number(_ol.lng)) && _ol.lat !== undefined && _ol.lng !== undefined && _ol.lat !== '' && _ol.lng !== ''
? { '@type': 'GeoCoordinates', latitude: Number(_ol.lat), longitude: Number(_ol.lng) } : undefined;
return _o9({ '@context': _o0, '@type': 'ApartmentComplex', name: _ol.name, description: _ol.description, url: _ol.canonical, image: _ol.image ? _o1(_ol.image, _ol.canonical) : undefined,
address: address(_ol.loc), geo, brand: _ol.dev ? { '@type': 'Organization', name: _ol.dev } : undefined,
publisher: agent.name ? { '@type': 'RealEstateAgent', name: agent.name, telephone: agent.phone } : undefined });
}
export function breadcrumbLd(items) {
return _o9({ '@context': _o0, '@type': 'BreadcrumbList', itemListElement: items.filter(x => x && x.name).map((x, _og) => ({ '@type': 'ListItem', position: _og + 1, name: x.name, item: x.url || undefined })) });
}
export function faqLd(faq) {
const _ou = (faq || []).filter(f => f && f.q && f.a);
if (!_ou.length) return null;
return { '@context': _o0, '@type': 'FAQPage', mainEntity: _ou.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
}
export function isoVN(ms) {
if (!Number.isFinite(Number(ms)) || !ms) return '';
const _ob = new Date(Number(ms) + 7 * 3600e3);
const p = n => String(n).padStart(2, '0');
return `${_ob.getUTCFullYear()}-${p(_ob.getUTCMonth() + 1)}-${p(_ob.getUTCDate())}T${p(_ob.getUTCHours())}:${p(_ob.getUTCMinutes())}:00+07:00`;
}
export function eventLd(ev, agent = {}) {
const _oo = ev.mode === 'online';
const loc = _oo ? { '@type': 'VirtualLocation', url: ev.live_url || ev.url } : { '@type': 'Place', name: ev.place || ev.title, address: ev.address ? { '@type': 'PostalAddress', streetAddress: ev.address, addressCountry: 'VN' } : (ev.place || undefined) };
return _o9({ '@context': _o0, '@type': 'Event', name: ev.title, description: ev.description, startDate: isoVN(ev.start_at), endDate: ev.end_at ? isoVN(ev.end_at) : undefined,
eventStatus: 'https://schema.org/EventScheduled',
eventAttendanceMode: _oo ? 'https://schema.org/OnlineEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
location: loc, image: ev.image, url: ev.url,
organizer: agent.name ? { '@type': 'Person', name: agent.name, url: agent.url } : undefined,
offers: { '@type': 'Offer', price: 0, priceCurrency: 'VND', availability: 'https://schema.org/InStock', url: ev.url, validFrom: ev.created_at ? isoVN(ev.created_at) : undefined } });
}
function _o1(src, base) { try { return new URL(src, base || undefined).toString(); } catch { return /^https?:/.test(src) ? src : undefined; } }
export function ldScript(obj) { return obj ? '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, '\\u003c') + '</script>' : ''; }
export function jsonLdScripts(list) { return (list || []).filter(Boolean).map(ldScript).join('\n'); }
export function headTags(_ol) {
const t = [];
t.push('<meta charset="utf-8">', '<meta name="viewport" content="width=device-width, initial-scale=1">');
t.push('<title>' + escHtml(_ol.title) + '</title>');
if (_ol.description) t.push('<meta name="description" content="' + escHtml(_ol.description) + '">');
if (_ol.canonical) t.push('<link rel="canonical" href="' + escHtml(_ol.canonical) + '">');
t.push('<meta name="robots" content="' + (_ol.noindex ? 'noindex,nofollow' : 'index,follow') + '">');
t.push('<meta property="og:type" content="website">', '<meta property="og:locale" content="vi_VN">');
t.push('<meta property="og:title" content="' + escHtml(_ol.title) + '">');
if (_ol.description) t.push('<meta property="og:description" content="' + escHtml(_ol.description) + '">');
if (_ol.canonical) t.push('<meta property="og:url" content="' + escHtml(_ol.canonical) + '">');
if (_ol.image) t.push('<meta property="og:image" content="' + escHtml(_o1(_ol.image, _ol.canonical) || _ol.image) + '">');
return t.join('\n');
}
function _o10(v) {
if (!v) return '';
if (/^\d{4}-\d{2}-\d{2}$/.test(String(v))) return String(v);
const _ob = new Date(Number(v) || v);
return Number.isFinite(_ob.getTime()) ? _ob.toISOString().slice(0, 10) : '';
}
export function sitemapXml(urls) {
const _ox = new Set();
const _ov = (urls || []).filter(u => u && /^https?:\/\//.test(u.loc || '') && !_ox.has(u.loc) && _ox.add(u.loc)).slice(0, LIMITS.sitemapMax);
const _o6 = _ov.map(u => {
const _ok = _o10(u.lastmod);
return '  <url>\n    <loc>' + escXml(u.loc) + '</loc>' + (_ok ? '\n    <lastmod>' + _ok + '</lastmod>' : '') + '\n  </url>';
}).join('\n');
return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + _o6 + (_o6 ? '\n' : '') + '</urlset>\n';
}
export function robotsTxt(base) { const s = joinUrl(base, 'sitemap.xml'); return 'User-agent: *\nAllow: /\n' + (s ? 'Sitemap: ' + s + '\n' : ''); }
export function auditHtml(html) {
const s = String(html || '');
const _o2 = (tag, name) => { const _ol = tag.match(new RegExp('\\s' + name + '\\s*=\\s*("([^"]*)"|\'([^\']*)\')', 'i')); return _ol ? (_ol[2] ?? _ol[3] ?? '') : null; };
const _om = (key, val) => { for (const _ol of s.matchAll(/<meta\b[^>]*>/gi)) if ((_o2(_ol[0], key) || '').toLowerCase() === val) return _o2(_ol[0], 'content'); return null; };
const _oc = t => String(t || '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
const title = _oc((s.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1]);
const _oe = [...s.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(_ol => _oc(_ol[1].replace(/<[^>]+>/g, '')));
const _oh = [...s.matchAll(/<img\b[^>]*>/gi)].map(_ol => ({ src: _o2(_ol[0], 'src') || '', alt: _o2(_ol[0], 'alt') }));
let canonical = '';
for (const _ol of s.matchAll(/<link\b[^>]*>/gi)) if ((_o2(_ol[0], 'rel') || '').toLowerCase() === 'canonical') canonical = _o2(_ol[0], 'href') || '';
const ld = [];
for (const _ol of s.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) { try { ld.push(JSON.parse(_ol[1])); } catch { ld.push(null); } }
const text = s.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<head[\s\S]*?<\/head>/i, ' ').replace(/<[^>]+>/g, ' ');
const words = _oc(text).split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
const links = [...s.matchAll(/<a\b[^>]*>/gi)].map(_ol => _o2(_ol[0], 'href') || '');
return {
title, description: _oc(_om('name', 'description')), h1: _oe, images: _oh, canonical,
robots: (_om('name', 'robots') || '').toLowerCase(), viewport: !!_om('name', 'viewport'),
og: { title: _om('property', 'og:title'), description: _om('property', 'og:description'), image: _om('property', 'og:image') },
ld, words, links, tel: links.some(h => /^tel:/i.test(h)) || /\b0\d{9}\b/.test(text),
};
}
export function seoChecklist(page, { keyword = '', inSitemap = false, disclaimer = null } = {}) {
const _op = [];
const add = (id, label, status, detail, fix = '') => _op.push({ id, label, status, detail, fix: status === 'ok' ? '' : fix });
const _oj = strip(keyword);
const has = s => !_oj || strip(s).includes(_oj);
const _oy = (page.title || '').length;
add('title', 'Tiêu đề trang (thẻ title)', !_oy ? 'fail' : _oy < LIMITS.titleMin || _oy > LIMITS.titleMax ? 'warn' : has(page.title) ? 'ok' : 'warn',
_oy ? `${_oy} ký tự${_oj && !has(page.title) ? ', chưa có từ khoá chính' : ''}` : 'Chưa có tiêu đề',
`Viết ${LIMITS.titleMin}–${LIMITS.titleMax} ký tự, có tên dự án ở đầu.`);
const _od = (page.description || '').length;
add('description', 'Mô tả (meta description)', !_od ? 'fail' : _od < LIMITS.descMin || _od > LIMITS.descMax ? 'warn' : 'ok',
_od ? `${_od} ký tự` : 'Chưa có mô tả', `Viết ${LIMITS.descMin}–${LIMITS.descMax} ký tự: vị trí, giá tham khảo, loại căn, lời mời nhận bảng giá.`);
const h1 = page.h1 || [];
add('h1', 'Một tiêu đề lớn (H1) duy nhất', h1.length === 1 ? (has(h1[0]) ? 'ok' : 'warn') : 'fail',
h1.length ? `${h1.length} thẻ H1${h1[0] ? ': "' + h1[0].slice(0, 60) + '"' : ''}` : 'Không có H1', 'Trang chỉ có 1 H1 là tên dự án.');
add('words', 'Nội dung riêng đủ dài', (page.words || 0) >= LIMITS.wordsMin ? 'ok' : 'warn', `${page.words || 0} chữ`,
`Viết thêm tới ≥ ${LIMITS.wordsMin} chữ do anh/chị tự soạn (vị trí, tiện ích, pháp lý, chính sách) – không chép nguyên văn của chủ đầu tư.`);
const _oh = page.images || [];
const _on = _oh.filter(_og => !_og.alt || !String(_og.alt).trim()).length;
add('img_alt', 'Ảnh có mô tả (alt)', !_oh.length ? 'warn' : _on ? 'warn' : 'ok', _oh.length ? `${_oh.length} ảnh, ${_on} ảnh thiếu alt` : 'Chưa có ảnh',
'Mỗi ảnh có alt mô tả đúng nội dung, ví dụ "Phối cảnh tòa A dự án …". Nén ảnh dưới ~200 KB, dùng WebP.');
const _o8 = page.canonical || '';
add('canonical', 'Link chính thức (canonical) dùng https', !_o8 ? 'warn' : /^https:\/\//.test(_o8) ? 'ok' : 'warn', _o8 || 'Chưa có', 'Điền tên miền trang (https://…) trong phần Cài đặt link.');
add('robots', 'Cho Google lập chỉ mục', /noindex/.test(page.robots || '') ? 'fail' : 'ok', /noindex/.test(page.robots || '') ? 'Đang chặn (noindex)' : 'Được phép', 'Bỏ noindex khi trang đã sẵn sàng.');
add('viewport', 'Hiển thị tốt trên điện thoại (viewport)', page.viewport ? 'ok' : 'fail', page.viewport ? 'Có' : 'Thiếu thẻ viewport', 'Thêm <meta name="viewport" content="width=device-width, initial-scale=1">.');
const og = page.og || {};
add('og', 'Ảnh + tiêu đề khi chia sẻ Zalo/Facebook (Open Graph)', og.title && og.image ? 'ok' : 'warn', [og.title ? 'có tiêu đề' : 'thiếu tiêu đề', og.image ? 'có ảnh' : 'thiếu ảnh'].join(', '), 'Chọn ảnh đại diện 1200×630.');
const ld = page.ld || [];
const _o4 = ld.filter(x => !x || !x['@type']).length;
add('schema', 'Dữ liệu có cấu trúc (schema.org JSON-LD)', !ld.length ? 'warn' : _o4 ? 'fail' : 'ok', ld.length ? `${ld.length} khối${_o4 ? ', ' + _o4 + ' khối lỗi' : ''}: ${ld.filter(Boolean).map(x => x['@type']).join(', ')}` : 'Chưa có',
'Dán khối JSON-LD do app tạo vào trang, kiểm tra tại search.google.com/test/rich-results.');
const _oi = (page.links || []).filter(hf => hf && !/^(tel:|mailto:|https?:\/\/(zalo\.me|m\.me|wa\.me))/i.test(hf) && !/^#/.test(hf)).length;
add('links', 'Liên kết nội bộ', _oi >= 2 ? 'ok' : 'warn', `${_oi} liên kết`, 'Thêm link tới hồ sơ năng lực và 1–2 dự án liên quan.');
add('contact', 'Thông tin liên hệ rõ (tên, số điện thoại)', page.tel ? 'ok' : 'warn', page.tel ? 'Có số điện thoại' : 'Chưa thấy số điện thoại', 'Ghi rõ tên + số điện thoại môi giới.');
if (disclaimer !== null) add('legal', 'Ghi chú trách nhiệm thông tin dự án', disclaimer ? 'ok' : 'warn', disclaimer ? 'Có' : 'Chưa có',
'Thêm câu: "Thông tin, hình ảnh mang tính tham khảo; giá và chính sách theo công bố chính thức của chủ đầu tư tại thời điểm giao dịch."');
add('sitemap', 'Có trong sitemap.xml và đã gửi Google Search Console', inSitemap ? 'manual' : 'warn', inSitemap ? 'Có trong sitemap – tự gửi trong Search Console' : 'Chưa có trong sitemap',
'Bấm "Tải sitemap.xml", đặt ở thư mục gốc tên miền, rồi gửi tại Google Search Console › Sơ đồ trang web.');
return _op;
}
export function checklistScore(list) {
const _ow = list.filter(x => x.status !== 'manual');
if (!_ow.length) return 0;
const _ot = _ow.reduce((s, x) => s + (x.status === 'ok' ? 1 : x.status === 'warn' ? 0.5 : 0), 0);
return Math.round(_ot / _ow.length * 100);
}

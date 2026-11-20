export const SITE_SCHEMA_VERSION = 1;
export const WORKER_NAME = 'bds-trang';
export const PING_PATH = '/__bds/ping';
export const LEAD_PATH = '/gui';
export const MEMBER_SLUG_MIN = 2;
export const MEMBER_SLUG_MAX = 32;
export const WILDCARD_DNS = { type: 'AAAA', name: '*', content: '100::', proxied: true };
export const MEMBER_RESERVED = [
'admin', 'api', 'app', 'apps', 'assets', 'auth', 'autoconfig', 'autodiscover', 'bds', 'bdsstudio', 'beta', 'billing', 'blog', 'cai', 'caidat',
'cdn', 'cloudflare', 'console', 'cpanel', 'dashboard', 'demo', 'dev', 'dkim', 'dmarc', 'docs', 'download', 'downloads', 'email', 'files', 'ftp',
'help', 'hotro', 'imap', 'img', 'internal', 'intranet', 'login', 'm', 'mail', 'media', 'mobile', 'mx', 'ns', 'ns1', 'ns2', 'ns3', 'ns4', 'owner',
'pages', 'pop', 'pop3', 'portal', 'quan-tri', 'quantri', 'remote', 'root', 'smtp', 'sso', 'staging', 'static', 'status', 'support', 'test',
'trang', 'update', 'vpn', 'webdisk', 'webmail', 'workers', 'www'
];
const BAD_TOKENS = ['dit', 'dm', 'dmm', 'dcm', 'dkm', 'vcl', 'vkl', 'clm', 'loz', 'cave', 'fuck', 'shit', 'sex', 'porn', 'xxx', 'bitch'];
const BAD_SUBSTR = ['fuck', 'porn', 'ditme', 'dcmm', 'vailon', 'concac', 'cailon', 'dume'];
const _o9 = { a: 'àáạảãâầấậẩẫăằắặẳẵ', e: 'èéẹẻẽêềếệểễ', i: 'ìíịỉĩ', o: 'òóọỏõôồốộổỗơờớợởỡ', u: 'ùúụủũưừứựửữ', y: 'ỳýỵỷỹ', d: 'đ' };
const _oa = (() => { const _ot = {}; for (const _oq in _o9) for (const _oe of _o9[_oq]) _ot[_oe] = _oq; return _ot; })();
export function foldVN(s) {
let x = String(s == null ? '' : s).toLowerCase();
if (typeof x.normalize === 'function') x = x.normalize('NFD').replace(/[̀-ͯ]/g, '');
return x.replace(/[^\x00-\x7f]/g, (_oe) => _oa[_oe] || _oe);
}
export function normalizeMemberSlug(s) {
return foldVN(s).replace(/[\s._]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-{2,}/g, '-').replace(/^-+/, '').slice(0, MEMBER_SLUG_MAX);
}
const _o8 = {
EMPTY: 'Chưa nhập địa chỉ riêng.',
SHORT: 'Địa chỉ riêng cần ít nhất ' + MEMBER_SLUG_MIN + ' ký tự.',
LONG: 'Địa chỉ riêng tối đa ' + MEMBER_SLUG_MAX + ' ký tự.',
CHARS: 'Chỉ dùng chữ thường KHÔNG dấu (a-z), số (0-9) và dấu "-".',
EDGE: 'Không bắt đầu hay kết thúc bằng dấu "-".',
DOUBLE: 'Không dùng hai dấu "-" liền nhau.',
RESERVED: 'Tên này hệ thống dành riêng (vd app, api, www, mail, admin, cai) – chọn tên khác.',
BAD_WORD: 'Tên có từ không phù hợp – chọn tên khác.',
TAKEN: 'Địa chỉ này đã có người trong công ty dùng – thêm họ hoặc số, vd lan-nguyen, lan2.'
};
export function memberSlugProblem(slug, { taken = [] } = {}) {
const s = String(slug == null ? '' : slug);
const _od = (code) => ({ ok: false, code, msg: _o8[code] });
if (!s) return _od('EMPTY');
if (/[^a-z0-9-]/.test(s)) return _od('CHARS');
if (s.length < MEMBER_SLUG_MIN) return _od('SHORT');
if (s.length > MEMBER_SLUG_MAX) return _od('LONG');
if (/^-|-$/.test(s)) return _od('EDGE');
if (s.includes('--')) return _od('DOUBLE');
if (MEMBER_RESERVED.includes(s) || /^xn--/.test(s) || /^bds-?studio/.test(s)) return _od('RESERVED');
if (s.split('-').some((_ov) => BAD_TOKENS.includes(_ov)) || BAD_SUBSTR.some((w) => s.includes(w))) return _od('BAD_WORD');
if ((taken || []).map((x) => String(x || '').toLowerCase()).includes(s)) return _od('TAKEN');
return { ok: true, code: '', msg: '' };
}
export function suggestMemberSlugs(fullName, { taken = [], n = 4 } = {}) {
const words = foldVN(fullName).replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
const _ou = [];
const _ob = (x) => { const s = normalizeMemberSlug(x).replace(/-+$/, ''); if (s && !_ou.includes(s) && memberSlugProblem(s, { taken }).ok) _ou.push(s); };
if (words.length) {
const _or = words[words.length - 1], _oi = words[0];
_ob(_or);
if (words.length > 1) { _ob(_or + '-' + _oi); _ob(words.join('-')); _ob(words.slice(1).join('-')); }
for (let i = 2; _ou.length < n && i < 10; i++) _ob(_or + i);
}
return _ou.slice(0, n);
}
const _o1 = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,24}|xn--[a-z0-9-]{2,59})$/;
export function normDomain(v) {
const s = String(v == null ? '' : v).trim().toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/[/?#].*$/, '').replace(/:\d+$/, '').replace(/\.+$/, '');
return _o1.test(s) ? s : '';
}
const _o7 = ['com.vn', 'net.vn', 'org.vn', 'edu.vn', 'gov.vn', 'biz.vn', 'info.vn', 'name.vn', 'pro.vn', 'health.vn', 'int.vn', 'ac.vn', 'co.uk', 'com.au', 'com.sg'];
export function zoneOf(host) {
const h = normDomain(host);
if (!h) return '';
const _ov = h.split('.');
const _o16 = _ov.slice(-2).join('.');
const n = _o7.includes(_o16) ? 3 : 2;
return _ov.length >= n ? _ov.slice(-n).join('.') : '';
}
export function companyDomainProblem(v, { systemDomains = ['bdsstudio.app'] } = {}) {
const _o11 = String(v == null ? '' : v).trim();
if (!_o11) return { ok: false, code: 'EMPTY', msg: 'Chưa nhập tên miền.' };
const d = normDomain(_o11);
if (!d) return { ok: false, code: 'BAD', msg: 'Tên miền chưa đúng dạng, vd congtyabc.vn (không dấu cách, không có dấu tiếng Việt).' };
const _o13 = [...(systemDomains || []), 'pages.dev', 'workers.dev', 'script.google.com', 'google.com'];
if (_o13.some((s) => d === s || d.endsWith('.' + s))) return { ok: false, code: 'SYSTEM_DOMAIN', msg: 'Đây là tên miền của hệ thống, không phải của công ty.' };
const _o18 = zoneOf(d);
if (_o18 && _o18 !== d) return { ok: false, code: 'SUBDOMAIN', domain: _o18, msg: 'Nhập tên miền GỐC (vd ' + _o18 + '), không có phần "' + d.slice(0, d.length - _o18.length - 1) + '." ở đầu – app sẽ tự nằm ở app.' + _o18 + '.' };
return { ok: true, domain: d, code: '', msg: '' };
}
export const appHostOf = (domain) => 'app.' + domain;
export const memberUrl = (slug, domain) => 'https://' + slug + '.' + domain;
export function workerRoutes(domain, { script = WORKER_NAME, keep = [] } = {}) {
const extra = [...new Set((keep || []).map((x) => String(x || '').toLowerCase().trim()).filter((x) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(x) && x !== 'app'))];
return [{ pattern: '*.' + domain + '/*', script }, { pattern: appHostOf(domain) + '/*', script: null }, ...extra.map((x) => ({ pattern: x + '.' + domain + '/*', script: null }))];
}
export function memberDomainRoutes(host, { script = WORKER_NAME } = {}) {
return [{ pattern: host + '/*', script }, { pattern: 'www.' + host + '/*', script }];
}
export const isCloudflareNs = (ns) => /\.ns\.cloudflare\.com\.?$/i.test(String(ns || ''));
export function routeHost(rawHost, { domain, appHost } = {}) {
const host = String(rawHost || '').toLowerCase().replace(/:\d+$/, '').replace(/\.+$/, '');
const d = normDomain(domain);
if (!host || !d) return { kind: 'unknown', host };
const _oc = (appHost && normDomain(appHost)) || appHostOf(d);
if (host === _oc) return { kind: 'app', host };
if (host === d) return { kind: 'apex', host };
if (host === 'www.' + d) return { kind: 'www', host };
if (host.endsWith('.' + d)) {
const label = host.slice(0, host.length - d.length - 1);
if (label.includes('.')) return { kind: 'unknown', host };
const _oz = memberSlugProblem(label);
if (_oz.ok) return { kind: 'member', slug: label, host };
return { kind: _oz.code === 'RESERVED' ? 'reserved' : 'unknown', host };
}
if (!normDomain(host)) return { kind: 'unknown', host };
return { kind: 'custom', host: host.replace(/^www\./, '') };
}
export const SITE_LIMITS = { name: 80, title: 80, intro: 600, area: 120, cta: 40, photoChars: 40000, projects: 6, photoUrl: 500 };
export const DEFAULT_COLORS = { primary: '#0F1E33', accent: '#C9A24A' };
const _o2 = /^#[0-9a-f]{6}$/;
export function vnPhone(_o11) {
let s = String(_o11 == null ? '' : _o11).replace(/[\s.\-()]/g, '');
if (/^\+84/.test(s)) s = '0' + s.slice(3); else if (/^84\d{9,10}$/.test(s)) s = '0' + s.slice(2);
return /^0[35789]\d{8}$/.test(s) || /^02\d{9}$/.test(s) ? s : '';
}
const clip = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').replace(/[<>]/g, '').trim().slice(0, n);
export function cleanPhoto(v) {
const s = String(v == null ? '' : v).trim();
if (!s) return '';
if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(s) && s.length <= SITE_LIMITS.photoChars) return s;
if (/^https:\/\/[^\s"'<>\\`]+$/i.test(s) && s.length <= SITE_LIMITS.photoUrl) return s;
return '';
}
export function cleanSiteConfig(input) {
const i = input && typeof input === 'object' ? input : {};
const errors = [];
const L = SITE_LIMITS;
const v = { v: SITE_SCHEMA_VERSION };
v.name = clip(i.name, L.name);
if (v.name.length < 2) errors.push({ field: 'name', msg: 'Nhập tên hiển thị (ít nhất 2 ký tự).' });
v.title = clip(i.title, L.title);
v.intro = clip(i.intro, L.intro);
v.area = clip(i.area, L.area);
v.cta = clip(i.cta, L.cta) || 'Nhận tư vấn';
v.phone = vnPhone(i.phone);
if (!v.phone) errors.push({ field: 'phone', msg: 'Số điện thoại chưa đúng (10 số, vd 0912 345 678).' });
v.zalo = vnPhone(i.zalo) || '';
if (String(i.zalo || '').trim() && !v.zalo) errors.push({ field: 'zalo', msg: 'Số Zalo chưa đúng (10 số).' });
v.photo = cleanPhoto(i.photo);
if (String(i.photo || '').trim() && !v.photo) errors.push({ field: 'photo', msg: 'Ảnh không nhận được (JPG/PNG/WebP nhỏ hơn ~30 KB – app tự thu nhỏ, hoặc link https).' });
const ids = Array.isArray(i.projects) ? i.projects : [];
v.projects = [...new Set(ids.map((x) => String(x == null ? '' : x).trim()).filter((x) => /^[A-Za-z0-9_-]{1,64}$/.test(x)))].slice(0, L.projects);
if (ids.length > L.projects) errors.push({ field: 'projects', msg: 'Chọn tối đa ' + L.projects + ' dự án.' });
const _oe = i.colors && typeof i.colors === 'object' ? i.colors : {};
const _og = (x, d) => { const s = String(x || '').trim().toLowerCase(); return _o2.test(s) ? s : d; };
v.colors = { primary: _og(_oe.primary, DEFAULT_COLORS.primary.toLowerCase()), accent: _og(_oe.accent, DEFAULT_COLORS.accent.toLowerCase()) };
return { ok: errors.length === 0, value: v, errors };
}
export function textOn(hex) {
const _ot = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(hex || ''));
if (!_ot) return '#ffffff';
const _os = (x) => { const _oe = parseInt(x, 16) / 255; return _oe <= 0.03928 ? _oe / 12.92 : ((_oe + 0.055) / 1.055) ** 2.4; };
const L = 0.2126 * _os(_ot[1]) + 0.7152 * _os(_ot[2]) + 0.0722 * _os(_ot[3]);
return L > 0.4 ? '#0f1e33' : '#ffffff';
}
export function consentTextFor(name, company) {
const _o17 = (clip(name, 80) || 'chuyên viên') + (clip(company, 80) ? ' (' + clip(company, 80) + ')' : '');
return 'Tôi đồng ý để ' + _o17 + ' lưu và sử dụng họ tên, số điện thoại và nội dung tôi gửi để liên hệ tư vấn bất động sản. ' +
'Tôi có thể yêu cầu xem, sửa hoặc xoá thông tin này bất cứ lúc nào (Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15).';
}
export const HONEYPOT = 'website';
export const MIN_FILL_MS = 2500;
export const MAX_FORM_AGE_MS = 6 * 3600000;
export function parseLeadForm(fields, { now = Date.now(), projects = [] } = {}) {
const _oh = fields || {};
const _ok = (_oq) => String(_oh[_oq] == null ? '' : _oh[_oq]);
if (_ok(HONEYPOT).trim()) return { ok: false, bot: true, code: 'BOT', msg: '' };
const _o14 = Number(_ok('t'));
if (!_o14 || now - _o14 < MIN_FILL_MS) return { ok: false, bot: true, code: 'TOO_FAST', msg: 'Anh/chị gửi nhanh quá – chờ vài giây rồi bấm gửi lại.' };
if (now - _o14 > MAX_FORM_AGE_MS) return { ok: false, code: 'STALE', msg: 'Trang đã mở quá lâu – tải lại trang rồi gửi.' };
const name = clip(_ok('name'), 120);
if (name.length < 2) return { ok: false, code: 'NAME', msg: 'Anh/chị nhập giúp họ tên.' };
const phone = vnPhone(_ok('phone'));
if (!phone) return { ok: false, code: 'PHONE', msg: 'Số điện thoại chưa đúng (10 số, ví dụ 0912 345 678).' };
if (!/^(1|on|true|yes|co|có)$/i.test(_ok('consent').trim())) return { ok: false, code: 'CONSENT', msg: 'Anh/chị tick ô đồng ý để chuyên viên được liên hệ.' };
const _oy = _ok('project').trim();
const _o10 = (projects || []).find((_ov) => _ov && _ov.id === _oy);
const lead = { name, phone, note: clip(_ok('note'), 500), project: _o10 ? clip(_o10.name, 120) : '', consent: 1 };
for (const _oq of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) { const x = clip(_ok(_oq), 100).replace(/[^\w.\-:/ ]/g, ''); if (x) lead[_oq] = x; }
return { ok: true, lead };
}
export function parseFormBody(text) {
const _ou = {};
const _ow = String(text || '').slice(0, 20000).split('&');
for (let i = 0; i < _ow.length && Object.keys(_ou).length < 40; i++) {
if (!_ow[i]) continue;
const _op = _ow[i].indexOf('=');
try {
const _oq = decodeURIComponent((_op < 0 ? _ow[i] : _ow[i].slice(0, _op)).replace(/\+/g, ' ')).slice(0, 40);
const v = _op < 0 ? '' : decodeURIComponent(_ow[i].slice(_op + 1).replace(/\+/g, ' ')).slice(0, 2000);
if (!(_oq in _ou)) _ou[_oq] = v;
} catch { }
}
return _ou;
}
export function rateStep(state, { now = Date.now(), windowMs = 10 * 60000, max = 5 } = {}) {
const s = state && now - Number(state.since) < windowMs ? { since: Number(state.since), n: Number(state.n) || 0 } : { since: now, n: 0 };
if (s.n >= max) return { allow: false, state: s };
return { allow: true, state: { since: s.since, n: s.n + 1 } };
}
export const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const _o12 = (u) => { const s = String(u || ''); return /^https:\/\/[^\s"'<>\\`]{4,500}$/i.test(s) || /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(s) ? s : ''; };
const _oj = (_ov) => String(_ov || '').replace(/^(\d{4})(\d{3})(\d+)$/, '$1 $2 $3');
export function publicProject(_ov) {
if (!_ov || typeof _ov !== 'object') return null;
const _oi = (...xs) => { for (const x of xs) { if (x != null && x !== '' && typeof x !== 'object') return String(x); } return ''; };
const _on = Array.isArray(_ov.images) ? _ov.images : Array.isArray(_ov.gallery) ? _ov.gallery : [];
const _om = _on.map((x) => (typeof x === 'string' ? x : x && (x.url || x.src))).find((x) => _o12(x)) || '';
return {
id: clip(_ov.id, 64), name: clip(_ov.name, 120), loc: clip(_oi(_ov.loc, _ov.location, _ov.area), 120), price: clip(_oi(_ov.price), 80),
img: _o12(typeof _ov.img === 'string' ? _ov.img : '') || _om, summary: clip(_oi(_ov.summary, _ov.desc), 240), dev: clip(_oi(_ov.dev), 80)
};
}
const _o6 = (_ox, ac) => `*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;font-family:-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
color:#1f2937;background:#f4f5f7;line-height:1.5}a{color:inherit}.w{max-width:560px;margin:0 auto;padding:0 16px 32px}
.top{display:flex;align-items:center;gap:10px;padding:14px 0}.top img{height:32px;width:auto;max-width:140px;object-fit:contain}.top b{font-size:.95rem}
.hero{background:${_ox};color:${textOn(_ox)};border-radius:20px;padding:22px 18px;text-align:center}
.ph{width:112px;height:112px;border-radius:50%;object-fit:cover;border:4px solid ${ac};background:#fff;display:block;margin:0 auto 10px}
.ini{width:112px;height:112px;border-radius:50%;border:4px solid ${ac};display:flex;align-items:center;justify-content:center;font-size:2.4rem;font-weight:700;margin:0 auto 10px;background:rgba(255,255,255,.12)}
h1{font-size:1.45rem;margin:4px 0 2px}.ti{opacity:.9;margin:0}.ar{opacity:.85;font-size:.9rem;margin:4px 0 0}.in{margin:12px 0 0;white-space:pre-line;text-align:left}
.bt{display:flex;gap:10px;margin-top:16px}.bt a{flex:1;min-height:48px;display:flex;align-items:center;justify-content:center;gap:6px;border-radius:14px;
text-decoration:none;font-weight:700;background:${ac};color:${textOn(ac)}}.bt a.z{background:#0068ff;color:#fff}
h2{font-size:1.1rem;margin:24px 0 10px}.pj{display:grid;gap:12px}.cd{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.cd img{width:100%;height:180px;object-fit:cover;display:block;background:#e5e7eb}.cd div{padding:12px 14px}.cd b{display:block;font-size:1.02rem}
.cd p{margin:4px 0 0;font-size:.9rem;color:#4b5563}.pr{color:${_ox};font-weight:700}
form{background:#fff;border-radius:16px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,.08);display:grid;gap:12px}
label{display:grid;gap:4px;font-size:.92rem;font-weight:600}input,select,textarea{font:inherit;min-height:48px;padding:10px 12px;border:1px solid #cbd5e1;border-radius:12px;width:100%;background:#fff;color:#111827}
textarea{min-height:84px}.ck{display:flex;gap:10px;align-items:flex-start;font-weight:400;font-size:.85rem;color:#374151}.ck input{width:22px;height:22px;min-height:0;flex:none;margin-top:2px}
button{font:inherit;min-height:52px;border:0;border-radius:14px;background:${_ox};color:${textOn(_ox)};font-weight:700;font-size:1.05rem;cursor:pointer}
.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}.ok,.er{border-radius:14px;padding:12px 14px;margin:0 0 12px}.ok{background:#dcfce7;color:#14532d}.er{background:#fee2e2;color:#7f1d1d}
.ft{margin-top:24px;font-size:.78rem;color:#6b7280;text-align:center}.ft a{color:#6b7280}.bi{vertical-align:-4px;margin-right:6px}`;
const _o4 = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>';
const _o3 = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 5h16v11H8l-4 4z"/></svg>';
const _o5 = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" class="bi"><path d="M4 12 20 4l-6 16-3-7z"/></svg>';
export function renderSitePage(o = {}) {
const page = cleanSiteConfig(o.page || {}).value;
const _of = o.company || {};
const _ox = page.colors.primary, ac = page.colors.accent;
const projects = (o.projects || []).map(publicProject).filter((_ov) => _ov && _ov.name);
const logo = _o12(_of.logo);
const coName = clip(_of.name, 80);
const photo = _o12(page.photo);
const _oo = esc((page.name || '?').trim().charAt(0).toUpperCase());
const zalo = page.zalo || page.phone;
const _o14 = Number(o.now) || Date.now();
const qs = o.qs && typeof o.qs === 'object' ? o.qs : {};
const _ol = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].filter((_oq) => qs[_oq]).map((_oq) => '<input type="hidden" name="' + _oq + '" value="' + esc(clip(qs[_oq], 100)) + '">').join('');
const status = o.status === 'ok' ? '<p class="ok" role="status">✅ Cảm ơn anh/chị! ' + esc(page.name) + ' sẽ liên hệ sớm.</p>'
: o.status === 'err' ? '<p class="er" role="alert">⚠️ ' + esc(o.message || 'Chưa gửi được – anh/chị thử lại hoặc gọi điện giúp.') + '</p>' : '';
const _o15 = o.turnstileSiteKey && /^[0-9A-Za-z_-]{10,80}$/.test(o.turnstileSiteKey) ? '<div class="cf-turnstile" data-sitekey="' + esc(o.turnstileSiteKey) + '"></div>' : '';
const title = page.name + (page.title ? ' – ' + page.title : '') + (coName ? ' | ' + coName : '');
return '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
'<title>' + esc(title) + '</title><meta name="description" content="' + esc((page.intro || page.title || '').slice(0, 160)) + '">' +
'<meta property="og:title" content="' + esc(title) + '">' + (photo && /^https:/.test(photo) ? '<meta property="og:image" content="' + esc(photo) + '">' : '') +
(o.preview ? '<meta name="robots" content="noindex">' : '') + '<meta name="theme-color" content="' + esc(_ox) + '">' +
'<style>' + _o6(_ox, ac) + '</style>' + (_o15 ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : '') + '</head><body><div class="w">' +
'<header class="top">' + (logo ? '<img src="' + esc(logo) + '" alt="' + esc(coName || 'Logo') + '">' : '') + (coName ? '<b>' + esc(coName) + '</b>' : '') + '</header>' +
'<section class="hero">' + (photo ? '<img class="ph" src="' + esc(photo) + '" alt="' + esc(page.name) + '">' : '<div class="ini" aria-hidden="true">' + _oo + '</div>') +
'<h1>' + esc(page.name) + '</h1>' + (page.title ? '<p class="ti">' + esc(page.title) + '</p>' : '') + (page.area ? '<p class="ar">📍 ' + esc(page.area) + '</p>' : '') +
(page.intro ? '<p class="in">' + esc(page.intro) + '</p>' : '') +
'<div class="bt"><a href="tel:' + esc(page.phone) + '" data-k="tel">' + _o4 + 'Gọi ' + esc(_oj(page.phone)) + '</a>' +
'<a class="z" href="https://zalo.me/' + esc(zalo) + '" rel="noopener" data-k="zalo">' + _o3 + 'Zalo</a></div></section>' +
(projects.length ? '<h2>Dự án tôi đang tư vấn</h2><div class="pj">' + projects.map((_ov) => '<article class="cd">' +
(_ov.img ? '<img src="' + esc(_ov.img) + '" alt="' + esc(_ov.name) + '" loading="lazy">' : '') + '<div><b>' + esc(_ov.name) + '</b>' +
(_ov.loc ? '<p>📍 ' + esc(_ov.loc) + '</p>' : '') + (_ov.price ? '<p class="pr">' + esc(_ov.price) + '</p>' : '') + (_ov.summary ? '<p>' + esc(_ov.summary) + '</p>' : '') + '</div></article>').join('') + '</div>' : '') +
'<h2 id="tu-van">' + esc(page.cta) + '</h2>' + status +
'<form method="post" action="' + esc(o.action || LEAD_PATH) + '" data-testid="site-form">' +
'<label>Họ tên<input name="name" autocomplete="name" required maxlength="120"></label>' +
'<label>Số điện thoại<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="20"></label>' +
(projects.length ? '<label>Dự án quan tâm<select name="project"><option value="">– Chọn dự án –</option>' + projects.map((_ov) => '<option value="' + esc(_ov.id) + '">' + esc(_ov.name) + '</option>').join('') + '</select></label>' : '') +
'<label>Lời nhắn (tuỳ chọn)<textarea name="note" maxlength="500"></textarea></label>' +
'<div class="hp" aria-hidden="true"><label>Website<input name="' + HONEYPOT + '" tabindex="-1" autocomplete="off"></label></div>' +
'<input type="hidden" name="t" value="' + esc(String(_o14)) + '">' + _ol +
'<label class="ck"><input type="checkbox" name="consent" value="1" required><span>' + esc(consentTextFor(page.name, coName)) + '</span></label>' + _o15 +
'<button type="submit">' + _o5 + esc(o.preview ? 'Gửi (xem trước – không gửi thật)' : 'Gửi thông tin') + '</button></form>' +
'<p class="ft">Trang riêng của ' + esc(page.name) + (coName ? ' – ' + esc(coName) : '') + '. Thông tin anh/chị gửi chỉ chuyển tới ' + esc(page.name) +
' để tư vấn.</p></div></body></html>';
}
export function renderNotFound({ company = {} } = {}) {
const coName = clip(company.name, 80);
return '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">' +
'<title>Không tìm thấy trang</title><style>body{font-family:-apple-system,"Segoe UI",Roboto,sans-serif;max-width:520px;margin:0 auto;padding:48px 16px;color:#1f2937;text-align:center;line-height:1.55}' +
'a{display:inline-block;margin-top:12px;padding:12px 18px;border-radius:12px;background:#0f1e33;color:#fff;text-decoration:none}</style></head><body>' +
'<h1 style="font-size:1.4rem">Không tìm thấy trang</h1><p>Địa chỉ này chưa có trang nào' + (coName ? ' của ' + esc(coName) : '') + ', hoặc trang đang tạm tắt.</p>' +
'<p>Anh/chị kiểm lại đường link chuyên viên đã gửi.</p></body></html>';
}
export const WORKER_CONFIG_KEYS = ['DOMAIN', 'SERVER_URL', 'SITE_KEY', 'APP_HOST', 'APP_ORIGIN', 'TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET'];
const _o0 = '/*' + 'CONFIG*/', CFG_B = '/*/' + 'CONFIG*/';
export function workerConfigBlock(values = {}) {
const o = {};
for (const _oq of WORKER_CONFIG_KEYS) o[_oq] = String(values[_oq] == null ? '' : values[_oq]);
return _o0 + JSON.stringify(o, null, 2) + CFG_B;
}
export function fillWorkerConfig(code, values = {}) {
const s = String(code || '');
const i = s.indexOf(_o0), _op = s.indexOf(CFG_B);
if (i < 0 || _op < i) throw new Error('Tệp Worker không có khối CONFIG.');
return s.slice(0, i) + workerConfigBlock(values) + s.slice(_op + CFG_B.length);
}
export default {
SITE_SCHEMA_VERSION, WORKER_NAME, PING_PATH, LEAD_PATH, MEMBER_SLUG_MIN, MEMBER_SLUG_MAX, MEMBER_RESERVED, WILDCARD_DNS, SITE_LIMITS, DEFAULT_COLORS, HONEYPOT,
foldVN, normalizeMemberSlug, memberSlugProblem, suggestMemberSlugs, normDomain, zoneOf, companyDomainProblem, appHostOf, memberUrl, workerRoutes,
memberDomainRoutes, isCloudflareNs, routeHost, vnPhone, cleanPhoto, cleanSiteConfig, textOn, consentTextFor, parseLeadForm, parseFormBody, rateStep,
esc, publicProject, renderSitePage, renderNotFound, WORKER_CONFIG_KEYS, workerConfigBlock, fillWorkerConfig
};

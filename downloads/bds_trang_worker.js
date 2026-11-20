const CONFIG = {
"DOMAIN": "",
"SERVER_URL": "",
"SITE_KEY": "",
"APP_HOST": "",
"APP_ORIGIN": "",
"TURNSTILE_SITE_KEY": "",
"TURNSTILE_SECRET": ""
} ;
const S = (() => {
const SITE_SCHEMA_VERSION = 1;
const WORKER_NAME = 'bds-trang';
const PING_PATH = '/__bds/ping';
const LEAD_PATH = '/gui';
const MEMBER_SLUG_MIN = 2;
const MEMBER_SLUG_MAX = 32;
const WILDCARD_DNS = { type: 'AAAA', name: '*', content: '100::', proxied: true };
const MEMBER_RESERVED = [
'admin', 'api', 'app', 'apps', 'assets', 'auth', 'autoconfig', 'autodiscover', 'bds', 'bdsstudio', 'beta', 'billing', 'blog', 'cai', 'caidat',
'cdn', 'cloudflare', 'console', 'cpanel', 'dashboard', 'demo', 'dev', 'dkim', 'dmarc', 'docs', 'download', 'downloads', 'email', 'files', 'ftp',
'help', 'hotro', 'imap', 'img', 'internal', 'intranet', 'login', 'm', 'mail', 'media', 'mobile', 'mx', 'ns', 'ns1', 'ns2', 'ns3', 'ns4', 'owner',
'pages', 'pop', 'pop3', 'portal', 'quan-tri', 'quantri', 'remote', 'root', 'smtp', 'sso', 'staging', 'static', 'status', 'support', 'test',
'trang', 'update', 'vpn', 'webdisk', 'webmail', 'workers', 'www'
];
const BAD_TOKENS = ['dit', 'dm', 'dmm', 'dcm', 'dkm', 'vcl', 'vkl', 'clm', 'loz', 'cave', 'fuck', 'shit', 'sex', 'porn', 'xxx', 'bitch'];
const BAD_SUBSTR = ['fuck', 'porn', 'ditme', 'dcmm', 'vailon', 'concac', 'cailon', 'dume'];
const _ob = { a: 'àáạảãâầấậẩẫăằắặẳẵ', e: 'èéẹẻẽêềếệểễ', i: 'ìíịỉĩ', o: 'òóọỏõôồốộổỗơờớợởỡ', u: 'ùúụủũưừứựửữ', y: 'ỳýỵỷỹ', d: 'đ' };
const _oc = (() => { const _o12 = {}; for (const _oz in _ob) for (const _og of _ob[_oz]) _o12[_og] = _oz; return _o12; })();
function foldVN(s) {
let x = String(s == null ? '' : s).toLowerCase();
if (typeof x.normalize === 'function') x = x.normalize('NFD').replace(/[̀-ͯ]/g, '');
return x.replace(/[^\x00-\x7f]/g, (_og) => _oc[_og] || _og);
}
function normalizeMemberSlug(s) {
return foldVN(s).replace(/[\s._]+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-{2,}/g, '-').replace(/^-+/, '').slice(0, MEMBER_SLUG_MAX);
}
const _oa = {
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
function memberSlugProblem(slug, { taken = [] } = {}) {
const s = String(slug == null ? '' : slug);
const _of = (code) => ({ ok: false, code, msg: _oa[code] });
if (!s) return _of('EMPTY');
if (/[^a-z0-9-]/.test(s)) return _of('CHARS');
if (s.length < MEMBER_SLUG_MIN) return _of('SHORT');
if (s.length > MEMBER_SLUG_MAX) return _of('LONG');
if (/^-|-$/.test(s)) return _of('EDGE');
if (s.includes('--')) return _of('DOUBLE');
if (MEMBER_RESERVED.includes(s) || /^xn--/.test(s) || /^bds-?studio/.test(s)) return _of('RESERVED');
if (s.split('-').some((_o16) => BAD_TOKENS.includes(_o16)) || BAD_SUBSTR.some((w) => s.includes(w))) return _of('BAD_WORD');
if ((taken || []).map((x) => String(x || '').toLowerCase()).includes(s)) return _of('TAKEN');
return { ok: true, code: '', msg: '' };
}
function suggestMemberSlugs(fullName, { taken = [], n = 4 } = {}) {
const words = foldVN(fullName).replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
const _o15 = [];
const _od = (x) => { const s = normalizeMemberSlug(x).replace(/-+$/, ''); if (s && !_o15.includes(s) && memberSlugProblem(s, { taken }).ok) _o15.push(s); };
if (words.length) {
const _o10 = words[words.length - 1], _oo = words[0];
_od(_o10);
if (words.length > 1) { _od(_o10 + '-' + _oo); _od(words.join('-')); _od(words.slice(1).join('-')); }
for (let i = 2; _o15.length < n && i < 10; i++) _od(_o10 + i);
}
return _o15.slice(0, n);
}
const _o2 = /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+(?:[a-z]{2,24}|xn--[a-z0-9-]{2,59})$/;
function normDomain(v) {
const s = String(v == null ? '' : v).trim().toLowerCase().replace(/^[a-z]+:\/\//, '').replace(/[/?#].*$/, '').replace(/:\d+$/, '').replace(/\.+$/, '');
return _o2.test(s) ? s : '';
}
const _o9 = ['com.vn', 'net.vn', 'org.vn', 'edu.vn', 'gov.vn', 'biz.vn', 'info.vn', 'name.vn', 'pro.vn', 'health.vn', 'int.vn', 'ac.vn', 'co.uk', 'com.au', 'com.sg'];
function zoneOf(host) {
const h = normDomain(host);
if (!h) return '';
const _o16 = h.split('.');
const _o1o = _o16.slice(-2).join('.');
const n = _o9.includes(_o1o) ? 3 : 2;
return _o16.length >= n ? _o16.slice(-n).join('.') : '';
}
function companyDomainProblem(v, { systemDomains = ['bdsstudio.app'] } = {}) {
const _o1e = String(v == null ? '' : v).trim();
if (!_o1e) return { ok: false, code: 'EMPTY', msg: 'Chưa nhập tên miền.' };
const d = normDomain(_o1e);
if (!d) return { ok: false, code: 'BAD', msg: 'Tên miền chưa đúng dạng, vd congtyabc.vn (không dấu cách, không có dấu tiếng Việt).' };
const _o1j = [...(systemDomains || []), 'pages.dev', 'workers.dev', 'script.google.com', 'google.com'];
if (_o1j.some((s) => d === s || d.endsWith('.' + s))) return { ok: false, code: 'SYSTEM_DOMAIN', msg: 'Đây là tên miền của hệ thống, không phải của công ty.' };
const _o1q = zoneOf(d);
if (_o1q && _o1q !== d) return { ok: false, code: 'SUBDOMAIN', domain: _o1q, msg: 'Nhập tên miền GỐC (vd ' + _o1q + '), không có phần "' + d.slice(0, d.length - _o1q.length - 1) + '." ở đầu – app sẽ tự nằm ở app.' + _o1q + '.' };
return { ok: true, domain: d, code: '', msg: '' };
}
const appHostOf = (domain) => 'app.' + domain;
const memberUrl = (slug, domain) => 'https://' + slug + '.' + domain;
function workerRoutes(domain, { script = WORKER_NAME, keep = [] } = {}) {
const extra = [...new Set((keep || []).map((x) => String(x || '').toLowerCase().trim()).filter((x) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(x) && x !== 'app'))];
return [{ pattern: '*.' + domain + '/*', script }, { pattern: appHostOf(domain) + '/*', script: null }, ...extra.map((x) => ({ pattern: x + '.' + domain + '/*', script: null }))];
}
function memberDomainRoutes(host, { script = WORKER_NAME } = {}) {
return [{ pattern: host + '/*', script }, { pattern: 'www.' + host + '/*', script }];
}
const isCloudflareNs = (ns) => /\.ns\.cloudflare\.com\.?$/i.test(String(ns || ''));
function routeHost(rawHost, { domain, appHost } = {}) {
const host = String(rawHost || '').toLowerCase().replace(/:\d+$/, '').replace(/\.+$/, '');
const d = normDomain(domain);
if (!host || !d) return { kind: 'unknown', host };
const _oe = (appHost && normDomain(appHost)) || appHostOf(d);
if (host === _oe) return { kind: 'app', host };
if (host === d) return { kind: 'apex', host };
if (host === 'www.' + d) return { kind: 'www', host };
if (host.endsWith('.' + d)) {
const label = host.slice(0, host.length - d.length - 1);
if (label.includes('.')) return { kind: 'unknown', host };
const _o1b = memberSlugProblem(label);
if (_o1b.ok) return { kind: 'member', slug: label, host };
return { kind: _o1b.code === 'RESERVED' ? 'reserved' : 'unknown', host };
}
if (!normDomain(host)) return { kind: 'unknown', host };
return { kind: 'custom', host: host.replace(/^www\./, '') };
}
const SITE_LIMITS = { name: 80, title: 80, intro: 600, area: 120, cta: 40, photoChars: 40000, projects: 6, photoUrl: 500 };
const DEFAULT_COLORS = { primary: '#0F1E33', accent: '#C9A24A' };
const _o3 = /^#[0-9a-f]{6}$/;
function vnPhone(_o1e) {
let s = String(_o1e == null ? '' : _o1e).replace(/[\s.\-()]/g, '');
if (/^\+84/.test(s)) s = '0' + s.slice(3); else if (/^84\d{9,10}$/.test(s)) s = '0' + s.slice(2);
return /^0[35789]\d{8}$/.test(s) || /^02\d{9}$/.test(s) ? s : '';
}
const clip = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').replace(/[<>]/g, '').trim().slice(0, n);
function cleanPhoto(v) {
const s = String(v == null ? '' : v).trim();
if (!s) return '';
if (/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(s) && s.length <= SITE_LIMITS.photoChars) return s;
if (/^https:\/\/[^\s"'<>\\`]+$/i.test(s) && s.length <= SITE_LIMITS.photoUrl) return s;
return '';
}
function cleanSiteConfig(input) {
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
const _og = i.colors && typeof i.colors === 'object' ? i.colors : {};
const _oj = (x, d) => { const s = String(x || '').trim().toLowerCase(); return _o3.test(s) ? s : d; };
v.colors = { primary: _oj(_og.primary, DEFAULT_COLORS.primary.toLowerCase()), accent: _oj(_og.accent, DEFAULT_COLORS.accent.toLowerCase()) };
return { ok: errors.length === 0, value: v, errors };
}
function textOn(hex) {
const _o12 = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(String(hex || ''));
if (!_o12) return '#ffffff';
const _o11 = (x) => { const _og = parseInt(x, 16) / 255; return _og <= 0.03928 ? _og / 12.92 : ((_og + 0.055) / 1.055) ** 2.4; };
const L = 0.2126 * _o11(_o12[1]) + 0.7152 * _o11(_o12[2]) + 0.0722 * _o11(_o12[3]);
return L > 0.4 ? '#0f1e33' : '#ffffff';
}
function consentTextFor(name, company) {
const _o1p = (clip(name, 80) || 'chuyên viên') + (clip(company, 80) ? ' (' + clip(company, 80) + ')' : '');
return 'Tôi đồng ý để ' + _o1p + ' lưu và sử dụng họ tên, số điện thoại và nội dung tôi gửi để liên hệ tư vấn bất động sản. ' +
'Tôi có thể yêu cầu xem, sửa hoặc xoá thông tin này bất cứ lúc nào (Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15).';
}
const HONEYPOT = 'website';
const MIN_FILL_MS = 2500;
const MAX_FORM_AGE_MS = 6 * 3600000;
function parseLeadForm(_on, { now = Date.now(), projects = [] } = {}) {
const _om = _on || {};
const _oq = (_oz) => String(_om[_oz] == null ? '' : _om[_oz]);
if (_oq(HONEYPOT).trim()) return { ok: false, bot: true, code: 'BOT', msg: '' };
const _o1k = Number(_oq('t'));
if (!_o1k || now - _o1k < MIN_FILL_MS) return { ok: false, bot: true, code: 'TOO_FAST', msg: 'Anh/chị gửi nhanh quá – chờ vài giây rồi bấm gửi lại.' };
if (now - _o1k > MAX_FORM_AGE_MS) return { ok: false, code: 'STALE', msg: 'Trang đã mở quá lâu – tải lại trang rồi gửi.' };
const name = clip(_oq('name'), 120);
if (name.length < 2) return { ok: false, code: 'NAME', msg: 'Anh/chị nhập giúp họ tên.' };
const phone = vnPhone(_oq('phone'));
if (!phone) return { ok: false, code: 'PHONE', msg: 'Số điện thoại chưa đúng (10 số, ví dụ 0912 345 678).' };
if (!/^(1|on|true|yes|co|có)$/i.test(_oq('consent').trim())) return { ok: false, code: 'CONSENT', msg: 'Anh/chị tick ô đồng ý để chuyên viên được liên hệ.' };
const _o1a = _oq('project').trim();
const _o1c = (projects || []).find((_o16) => _o16 && _o16.id === _o1a);
const lead = { name, phone, note: clip(_oq('note'), 500), project: _o1c ? clip(_o1c.name, 120) : '', consent: 1 };
for (const _oz of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) { const x = clip(_oq(_oz), 100).replace(/[^\w.\-:/ ]/g, ''); if (x) lead[_oz] = x; }
return { ok: true, lead };
}
function parseFormBody(text) {
const _o15 = {};
const _o17 = String(text || '').slice(0, 20000).split('&');
for (let i = 0; i < _o17.length && Object.keys(_o15).length < 40; i++) {
if (!_o17[i]) continue;
const _oy = _o17[i].indexOf('=');
try {
const _oz = decodeURIComponent((_oy < 0 ? _o17[i] : _o17[i].slice(0, _oy)).replace(/\+/g, ' ')).slice(0, 40);
const v = _oy < 0 ? '' : decodeURIComponent(_o17[i].slice(_oy + 1).replace(/\+/g, ' ')).slice(0, 2000);
if (!(_oz in _o15)) _o15[_oz] = v;
} catch { }
}
return _o15;
}
function rateStep(state, { now = Date.now(), windowMs = 10 * 60000, max = 5 } = {}) {
const s = state && now - Number(state.since) < windowMs ? { since: Number(state.since), n: Number(state.n) || 0 } : { since: now, n: 0 };
if (s.n >= max) return { allow: false, state: s };
return { allow: true, state: { since: s.since, n: s.n + 1 } };
}
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const _o1f = (u) => { const s = String(u || ''); return /^https:\/\/[^\s"'<>\\`]{4,500}$/i.test(s) || /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(s) ? s : ''; };
const _op = (_o16) => String(_o16 || '').replace(/^(\d{4})(\d{3})(\d+)$/, '$1 $2 $3');
function publicProject(_o16) {
if (!_o16 || typeof _o16 !== 'object') return null;
const _oo = (...xs) => { for (const x of xs) { if (x != null && x !== '' && typeof x !== 'object') return String(x); } return ''; };
const _ov = Array.isArray(_o16.images) ? _o16.images : Array.isArray(_o16.gallery) ? _o16.gallery : [];
const _ou = _ov.map((x) => (typeof x === 'string' ? x : x && (x.url || x.src))).find((x) => _o1f(x)) || '';
return {
id: clip(_o16.id, 64), name: clip(_o16.name, 120), loc: clip(_oo(_o16.loc, _o16.location, _o16.area), 120), price: clip(_oo(_o16.price), 80),
img: _o1f(typeof _o16.img === 'string' ? _o16.img : '') || _ou, summary: clip(_oo(_o16.summary, _o16.desc), 240), dev: clip(_oo(_o16.dev), 80)
};
}
const _o8 = (_o18, ac) => `*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}body{margin:0;font-family:-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
color:#1f2937;background:#f4f5f7;line-height:1.5}a{color:inherit}.w{max-width:560px;margin:0 auto;padding:0 16px 32px}
.top{display:flex;align-items:center;gap:10px;padding:14px 0}.top img{height:32px;width:auto;max-width:140px;object-fit:contain}.top b{font-size:.95rem}
.hero{background:${_o18};color:${textOn(_o18)};border-radius:20px;padding:22px 18px;text-align:center}
.ph{width:112px;height:112px;border-radius:50%;object-fit:cover;border:4px solid ${ac};background:#fff;display:block;margin:0 auto 10px}
.ini{width:112px;height:112px;border-radius:50%;border:4px solid ${ac};display:flex;align-items:center;justify-content:center;font-size:2.4rem;font-weight:700;margin:0 auto 10px;background:rgba(255,255,255,.12)}
h1{font-size:1.45rem;margin:4px 0 2px}.ti{opacity:.9;margin:0}.ar{opacity:.85;font-size:.9rem;margin:4px 0 0}.in{margin:12px 0 0;white-space:pre-line;text-align:left}
.bt{display:flex;gap:10px;margin-top:16px}.bt a{flex:1;min-height:48px;display:flex;align-items:center;justify-content:center;gap:6px;border-radius:14px;
text-decoration:none;font-weight:700;background:${ac};color:${textOn(ac)}}.bt a.z{background:#0068ff;color:#fff}
h2{font-size:1.1rem;margin:24px 0 10px}.pj{display:grid;gap:12px}.cd{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.cd img{width:100%;height:180px;object-fit:cover;display:block;background:#e5e7eb}.cd div{padding:12px 14px}.cd b{display:block;font-size:1.02rem}
.cd p{margin:4px 0 0;font-size:.9rem;color:#4b5563}.pr{color:${_o18};font-weight:700}
form{background:#fff;border-radius:16px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,.08);display:grid;gap:12px}
label{display:grid;gap:4px;font-size:.92rem;font-weight:600}input,select,textarea{font:inherit;min-height:48px;padding:10px 12px;border:1px solid #cbd5e1;border-radius:12px;width:100%;background:#fff;color:#111827}
textarea{min-height:84px}.ck{display:flex;gap:10px;align-items:flex-start;font-weight:400;font-size:.85rem;color:#374151}.ck input{width:22px;height:22px;min-height:0;flex:none;margin-top:2px}
button{font:inherit;min-height:52px;border:0;border-radius:14px;background:${_o18};color:${textOn(_o18)};font-weight:700;font-size:1.05rem;cursor:pointer}
.hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}.ok,.er{border-radius:14px;padding:12px 14px;margin:0 0 12px}.ok{background:#dcfce7;color:#14532d}.er{background:#fee2e2;color:#7f1d1d}
.ft{margin-top:24px;font-size:.78rem;color:#6b7280;text-align:center}.ft a{color:#6b7280}.bi{vertical-align:-4px;margin-right:6px}`;
const _o5 = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>';
const _o4 = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 5h16v11H8l-4 4z"/></svg>';
const _o6 = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" class="bi"><path d="M4 12 20 4l-6 16-3-7z"/></svg>';
function renderSitePage(o = {}) {
const page = cleanSiteConfig(o.page || {}).value;
const _oi = o.company || {};
const _o18 = page.colors.primary, ac = page.colors.accent;
const projects = (o.projects || []).map(publicProject).filter((_o16) => _o16 && _o16.name);
const logo = _o1f(_oi.logo);
const coName = clip(_oi.name, 80);
const photo = _o1f(page.photo);
const _ow = esc((page.name || '?').trim().charAt(0).toUpperCase());
const zalo = page.zalo || page.phone;
const _o1k = Number(o.now) || Date.now();
const qs = o.qs && typeof o.qs === 'object' ? o.qs : {};
const _or = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].filter((_oz) => qs[_oz]).map((_oz) => '<input type="hidden" name="' + _oz + '" value="' + esc(clip(qs[_oz], 100)) + '">').join('');
const status = o.status === 'ok' ? '<p class="ok" role="status">✅ Cảm ơn anh/chị! ' + esc(page.name) + ' sẽ liên hệ sớm.</p>'
: o.status === 'err' ? '<p class="er" role="alert">⚠️ ' + esc(o.message || 'Chưa gửi được – anh/chị thử lại hoặc gọi điện giúp.') + '</p>' : '';
const _o1l = o.turnstileSiteKey && /^[0-9A-Za-z_-]{10,80}$/.test(o.turnstileSiteKey) ? '<div class="cf-turnstile" data-sitekey="' + esc(o.turnstileSiteKey) + '"></div>' : '';
const title = page.name + (page.title ? ' – ' + page.title : '') + (coName ? ' | ' + coName : '');
return '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">' +
'<title>' + esc(title) + '</title><meta name="description" content="' + esc((page.intro || page.title || '').slice(0, 160)) + '">' +
'<meta property="og:title" content="' + esc(title) + '">' + (photo && /^https:/.test(photo) ? '<meta property="og:image" content="' + esc(photo) + '">' : '') +
(o.preview ? '<meta name="robots" content="noindex">' : '') + '<meta name="theme-color" content="' + esc(_o18) + '">' +
'<style>' + _o8(_o18, ac) + '</style>' + (_o1l ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>' : '') + '</head><body><div class="w">' +
'<header class="top">' + (logo ? '<img src="' + esc(logo) + '" alt="' + esc(coName || 'Logo') + '">' : '') + (coName ? '<b>' + esc(coName) + '</b>' : '') + '</header>' +
'<section class="hero">' + (photo ? '<img class="ph" src="' + esc(photo) + '" alt="' + esc(page.name) + '">' : '<div class="ini" aria-hidden="true">' + _ow + '</div>') +
'<h1>' + esc(page.name) + '</h1>' + (page.title ? '<p class="ti">' + esc(page.title) + '</p>' : '') + (page.area ? '<p class="ar">📍 ' + esc(page.area) + '</p>' : '') +
(page.intro ? '<p class="in">' + esc(page.intro) + '</p>' : '') +
'<div class="bt"><a href="tel:' + esc(page.phone) + '" data-k="tel">' + _o5 + 'Gọi ' + esc(_op(page.phone)) + '</a>' +
'<a class="z" href="https://zalo.me/' + esc(zalo) + '" rel="noopener" data-k="zalo">' + _o4 + 'Zalo</a></div></section>' +
(projects.length ? '<h2>Dự án tôi đang tư vấn</h2><div class="pj">' + projects.map((_o16) => '<article class="cd">' +
(_o16.img ? '<img src="' + esc(_o16.img) + '" alt="' + esc(_o16.name) + '" loading="lazy">' : '') + '<div><b>' + esc(_o16.name) + '</b>' +
(_o16.loc ? '<p>📍 ' + esc(_o16.loc) + '</p>' : '') + (_o16.price ? '<p class="pr">' + esc(_o16.price) + '</p>' : '') + (_o16.summary ? '<p>' + esc(_o16.summary) + '</p>' : '') + '</div></article>').join('') + '</div>' : '') +
'<h2 id="tu-van">' + esc(page.cta) + '</h2>' + status +
'<form method="post" action="' + esc(o.action || LEAD_PATH) + '" data-testid="site-form">' +
'<label>Họ tên<input name="name" autocomplete="name" required maxlength="120"></label>' +
'<label>Số điện thoại<input name="phone" type="tel" inputmode="tel" autocomplete="tel" required maxlength="20"></label>' +
(projects.length ? '<label>Dự án quan tâm<select name="project"><option value="">– Chọn dự án –</option>' + projects.map((_o16) => '<option value="' + esc(_o16.id) + '">' + esc(_o16.name) + '</option>').join('') + '</select></label>' : '') +
'<label>Lời nhắn (tuỳ chọn)<textarea name="note" maxlength="500"></textarea></label>' +
'<div class="hp" aria-hidden="true"><label>Website<input name="' + HONEYPOT + '" tabindex="-1" autocomplete="off"></label></div>' +
'<input type="hidden" name="t" value="' + esc(String(_o1k)) + '">' + _or +
'<label class="ck"><input type="checkbox" name="consent" value="1" required><span>' + esc(consentTextFor(page.name, coName)) + '</span></label>' + _o1l +
'<button type="submit">' + _o6 + esc(o.preview ? 'Gửi (xem trước – không gửi thật)' : 'Gửi thông tin') + '</button></form>' +
'<p class="ft">Trang riêng của ' + esc(page.name) + (coName ? ' – ' + esc(coName) : '') + '. Thông tin anh/chị gửi chỉ chuyển tới ' + esc(page.name) +
' để tư vấn.</p></div></body></html>';
}
function renderNotFound({ company = {} } = {}) {
const coName = clip(company.name, 80);
return '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">' +
'<title>Không tìm thấy trang</title><style>body{font-family:-apple-system,"Segoe UI",Roboto,sans-serif;max-width:520px;margin:0 auto;padding:48px 16px;color:#1f2937;text-align:center;line-height:1.55}' +
'a{display:inline-block;margin-top:12px;padding:12px 18px;border-radius:12px;background:#0f1e33;color:#fff;text-decoration:none}</style></head><body>' +
'<h1 style="font-size:1.4rem">Không tìm thấy trang</h1><p>Địa chỉ này chưa có trang nào' + (coName ? ' của ' + esc(coName) : '') + ', hoặc trang đang tạm tắt.</p>' +
'<p>Anh/chị kiểm lại đường link chuyên viên đã gửi.</p></body></html>';
}
const WORKER_CONFIG_KEYS = ['DOMAIN', 'SERVER_URL', 'SITE_KEY', 'APP_HOST', 'APP_ORIGIN', 'TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET'];
const _o1 = '/*' + 'CONFIG*/', CFG_B = '/*/' + 'CONFIG*/';
function workerConfigBlock(values = {}) {
const o = {};
for (const _oz of WORKER_CONFIG_KEYS) o[_oz] = String(values[_oz] == null ? '' : values[_oz]);
return _o1 + JSON.stringify(o, null, 2) + CFG_B;
}
function fillWorkerConfig(code, values = {}) {
const s = String(code || '');
const i = s.indexOf(_o1), _oy = s.indexOf(CFG_B);
if (i < 0 || _oy < i) throw new Error('Tệp Worker không có khối CONFIG.');
return s.slice(0, i) + workerConfigBlock(values) + s.slice(_oy + CFG_B.length);
}
return {
SITE_SCHEMA_VERSION, WORKER_NAME, PING_PATH, LEAD_PATH, MEMBER_SLUG_MIN, MEMBER_SLUG_MAX, MEMBER_RESERVED, WILDCARD_DNS, SITE_LIMITS, DEFAULT_COLORS, HONEYPOT,
foldVN, normalizeMemberSlug, memberSlugProblem, suggestMemberSlugs, normDomain, zoneOf, companyDomainProblem, appHostOf, memberUrl, workerRoutes,
memberDomainRoutes, isCloudflareNs, routeHost, vnPhone, cleanPhoto, cleanSiteConfig, textOn, consentTextFor, parseLeadForm, parseFormBody, rateStep,
esc, publicProject, renderSitePage, renderNotFound, WORKER_CONFIG_KEYS, workerConfigBlock, fillWorkerConfig
};
})();
export const WORKER_VERSION = '1.0.0';
const CFG_TTL_MS = 60000;
const _o7 = 30000;
const _o0 = 'https://bds-trang.cache.invalid';
const SECURITY = {
'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', 'x-frame-options': 'DENY',
'permissions-policy': 'camera=(), microphone=(), geolocation=()'
};
const _o13 = { cfg: new Map(), rl: new Map() };
export function resetMemory() { _o13.cfg.clear(); _o13.rl.clear(); }
export function readConfig(env = {}, base = {}) {
const _o19 = (_oz) => String((env && env[_oz] != null && env[_oz] !== '' ? env[_oz] : base[_oz]) || '').trim();
const domain = S.normDomain(_o19('DOMAIN'));
const su = _o19('SERVER_URL');
const server = /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]{10,}\/exec$/.test(su) ? su : '';
const _o14 = /^https:\/\/[a-z0-9.-]+\.pages\.dev$/i.test(_o19('APP_ORIGIN')) ? _o19('APP_ORIGIN').toLowerCase() : '';
return {
domain, server, siteKey: _o19('SITE_KEY'), appHost: S.normDomain(_o19('APP_HOST')) || (domain ? S.appHostOf(domain) : ''), appOrigin: _o14,
tsSite: _o19('TURNSTILE_SITE_KEY'), tsSecret: _o19('TURNSTILE_SECRET'), rateMax: Math.max(1, Number(_o19('RATE_MAX')) || 5)
};
}
const _ot = (body, status = 200, extra = {}) => new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', ...SECURITY, ...extra } });
const json = (obj, status = 200, extra = {}) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra } });
export function cspFor({ turnstile = false } = {}) {
return "default-src 'none'; img-src https: data:; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'" +
(turnstile ? '; script-src https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; connect-src https://challenges.cloudflare.com' : "; script-src 'none'");
}
export async function loadPage(cfg, key, { fetchFn, cache, now }) {
const _oh = (key.slug ? 's:' + key.slug : 'h:' + key.host);
const _os = _o13.cfg.get(_oh);
if (_os && _os.exp > now()) return _os.data;
const _ok = cache ? new Request(_o0 + '/cfg/' + encodeURIComponent(_oh)) : null;
if (cache) {
try { const _o1d = await cache.match(_ok); if (_o1d) { const d = await _o1d.json(); _o13.cfg.set(_oh, { data: d.data, exp: now() + CFG_TTL_MS }); return d.data; } } catch { }
}
let data = null;
try {
const _o1d = await fetchFn(cfg.server, { method: 'POST', redirect: 'follow', headers: { 'content-type': 'text/plain;charset=utf-8' },
body: JSON.stringify({ action: 'site.page', payload: { slug: key.slug || '', host: key.host || '', site_key: cfg.siteKey } }) });
const _oy = await _o1d.json();
data = _oy && _oy.ok && _oy.data && _oy.data.page ? _oy.data : null;
if (!_oy || (!_oy.ok && !(_oy.error && _oy.error.code === 'NOT_FOUND'))) { _o13.cfg.set(_oh, { data: null, exp: now() + 5000 }); return null; }
} catch { return null; }
const _o1m = data ? CFG_TTL_MS : _o7;
_o13.cfg.set(_oh, { data, exp: now() + _o1m });
if (cache) { try { await cache.put(_ok, new Response(JSON.stringify({ data }), { headers: { 'content-type': 'application/json', 'cache-control': 'max-age=' + Math.round(_o1m / 1000) } })); } catch { } }
if (_o13.cfg.size > 500) _o13.cfg.clear();
return data;
}
export async function rateOk(ip, { cache, now, max = 5 }) {
const key = String(ip || 'x').slice(0, 64);
let _o1h = _o13.rl.get(key) || null;
const _ok = cache ? new Request(_o0 + '/rl/' + encodeURIComponent(key)) : null;
if (!_o1h && cache) { try { const _o1d = await cache.match(_ok); if (_o1d) _o1h = await _o1d.json(); } catch { } }
const _o1i = S.rateStep(_o1h, { now: now(), max });
_o13.rl.set(key, _o1i.state);
if (_o13.rl.size > 5000) _o13.rl.clear();
if (cache) { try { await cache.put(_ok, new Response(JSON.stringify(_o1i.state), { headers: { 'cache-control': 'max-age=600' } })); } catch { } }
return _o1i.allow;
}
async function _o1n(cfg, token, ip, fetchFn) {
if (!cfg.tsSecret) return true;
if (!token) return false;
try {
const body = new URLSearchParams({ secret: cfg.tsSecret, response: token, remoteip: ip || '' });
const _o1d = await fetchFn('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
const _oy = await _o1d.json();
return !!(_oy && _oy.success);
} catch { return false; }
}
export async function forwardLead(cfg, data, lead, { fetchFn, pageUrl }) {
const _ox = data.intake || {};
if (!_ox.key || !/^[a-z2-7]{8,64}$/.test(String(_ox.key))) return { ok: false, message: 'Trang chưa nối máy chủ nhận khách – anh/chị gọi điện hoặc nhắn Zalo giúp.' };
const src = 'trang-' + String(data.slug || 'nv').slice(0, 17);
const url = cfg.server + '?lead=' + encodeURIComponent(_ox.key) + '&src=' + encodeURIComponent(src) + (_ox.ref && /^[a-z2-7]{8}$/.test(_ox.ref) ? '&ref=' + _ox.ref : '');
try {
const _o1d = await fetchFn(url, { method: 'POST', redirect: 'follow', headers: { 'content-type': 'application/json' },
body: JSON.stringify({ ...lead, consent: 'có', page_url: pageUrl, source: src }) });
const _oy = await _o1d.json().catch(() => null);
if (_oy && _oy.ok) return { ok: true };
const code = _oy && _oy.error && _oy.error.code;
return { ok: false, message: code === 'BAD_INPUT' || code === 'QUOTA' ? String(_oy.error.message || '').slice(0, 200) : 'Chưa gửi được – anh/chị thử lại sau ít phút hoặc gọi điện giúp.' };
} catch { return { ok: false, message: 'Chưa gửi được – anh/chị thử lại sau ít phút hoặc gọi điện giúp.' }; }
}
export async function handle(request, env = {}, ctx = {}, deps = {}) {
const fetchFn = deps.fetch || ((...a) => fetch(...a));
const cache = deps.cache !== undefined ? deps.cache : (typeof caches !== 'undefined' && caches.default ? caches.default : null);
const now = deps.now || (() => Date.now());
const cfg = readConfig(env, deps.config || (typeof CONFIG !== 'undefined' ? CONFIG : {}));
const url = new URL(request.url);
const method = request.method.toUpperCase();
if (url.pathname === S.PING_PATH) {
return json({ ok: true, worker: S.WORKER_NAME, v: WORKER_VERSION, host: url.hostname, domain: cfg.domain, ready: !!(cfg.domain && cfg.server && cfg.siteKey) }, 200, { 'access-control-allow-origin': '*' });
}
if (!cfg.domain || !cfg.server) return _ot(S.renderNotFound({}), 503);
const _o1d = S.routeHost(url.hostname, { domain: cfg.domain, appHost: cfg.appHost });
if (_o1d.kind === 'app') {
if (cfg.appOrigin) { const u = new URL(url.pathname + url.search, cfg.appOrigin); return fetchFn(new Request(u.toString(), request)); }
return fetchFn(request);
}
if (_o1d.kind === 'www' || _o1d.kind === 'apex') return Response.redirect('https://' + cfg.appHost + '/', 301);
if (url.pathname === '/robots.txt') return new Response('User-agent: *\nAllow: /\n', { headers: { 'content-type': 'text/plain' } });
if (url.pathname === '/favicon.ico') return new Response(null, { status: 204 });
if (_o1d.kind !== 'member' && _o1d.kind !== 'custom') return _ot(S.renderNotFound({}), 404);
const data = await loadPage(cfg, _o1d.kind === 'member' ? { slug: _o1d.slug } : { host: _o1d.host }, { fetchFn, cache, now });
if (!data) return _ot(S.renderNotFound({ company: {} }), 404);
const _o1k = !!(cfg.tsSite && cfg.tsSecret);
const headers = { 'content-security-policy': cspFor({ turnstile: _o1k }) };
const qs = {};
for (const _oz of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) if (url.searchParams.get(_oz)) qs[_oz] = url.searchParams.get(_oz);
const page = (extra) => S.renderSitePage({ page: data.page, company: data.company, projects: data.projects, now: now(), turnstileSiteKey: _o1k ? cfg.tsSite : '', qs, ...extra });
if (url.pathname === S.LEAD_PATH && method === 'POST') {
const ip = request.headers.get('cf-connecting-ip') || '';
const _ol = String(request.headers.get('content-type') || '').toLowerCase();
if (!_ol.startsWith('application/x-www-form-urlencoded')) return _ot(page({ status: 'err', message: 'Form không đúng dạng – tải lại trang.' }), 400, headers);
const text = await request.text();
if (text.length > 20000) return _ot(page({ status: 'err', message: 'Nội dung quá dài.' }), 413, headers);
const _on = S.parseFormBody(text);
if (!(await rateOk(ip, { cache, now, max: cfg.rateMax }))) return _ot(page({ status: 'err', message: 'Anh/chị gửi nhiều lần quá – chờ ít phút hoặc gọi điện giúp.' }), 429, headers);
if (!(await _o1n(cfg, _on['cf-turnstile-response'], ip, fetchFn))) return _ot(page({ status: 'err', message: 'Chưa qua bước kiểm tra chống máy – anh/chị thử lại.' }), 400, headers);
const _o16 = S.parseLeadForm(_on, { now: now(), projects: data.projects || [] });
if (_o16.bot && _o16.code === 'BOT') return new Response(null, { status: 303, headers: { location: '/?gui=ok#tu-van' } });
if (!_o16.ok) return _ot(page({ status: 'err', message: _o16.msg }), 400, headers);
const _o1g = await forwardLead(cfg, data, _o16.lead, { fetchFn, pageUrl: 'https://' + url.hostname + '/' });
if (!_o1g.ok) return _ot(page({ status: 'err', message: _o1g.message }), 502, headers);
return new Response(null, { status: 303, headers: { location: '/?gui=ok#tu-van' } });
}
if (url.pathname !== '/' || (method !== 'GET' && method !== 'HEAD')) return _ot(S.renderNotFound({ company: data.company }), 404);
return _ot(page({ status: url.searchParams.get('gui') === 'ok' ? 'ok' : '' }), 200, headers);
}
export default { fetch: (request, env, ctx) => handle(request, env, ctx) };

import { isExecUrl } from '../exec_url.4b6ba956ed.js';
export const DEFAULT_BASE = 'bdsstudio.app';
export const DEFAULT_PORTAL_HOST = 'cai.bdsstudio.app';
export const PAGES_PREFIX = 'bds-';
export const SLUG_MIN = 3;
export const SLUG_MAX = 30;
export const CLOUDFLARE_REGISTRAR_URL = 'https://www.cloudflare.com/products/registrar/';
export const DISCLOSURE = 'Có thể là link giới thiệu';
export const RESERVED = [
'admin', 'api', 'app', 'apps', 'assets', 'auth', 'ban', 'ban-quyen', 'banhang', 'banquyen', 'bds', 'bds-studio', 'bdsstudio', 'beta', 'billing', 'blog',
'cai', 'cai-dat', 'caidat', 'cap-nhat', 'capnhat', 'cdn', 'cloudflare', 'console', 'dang-ky', 'dang-nhap', 'dangky', 'dangnhap', 'dashboard', 'demo',
'dev', 'docs', 'download', 'downloads', 'email', 'files', 'ftp', 'git', 'github', 'help', 'hotro', 'imap', 'img', 'internal', 'license', 'login',
'mail', 'media', 'mx', 'no-reply', 'noreply', 'ns1', 'ns2', 'owner', 'pages', 'pay', 'pop', 'portal', 'provision', 'quan-tri', 'quantri', 'release',
'releases', 'root', 'seller', 'shop', 'smtp', 'sso', 'staging', 'static', 'status', 'support', 'tao', 'tao-app', 'test', 'thanh-toan', 'thanhtoan',
'thu', 'trang', 'update', 'webmail', 'www'
];
export const RESERVED_PREFIXES = ['bdsstudio-', 'bds-studio-', 'trang-', 'app-'];
export const BAD_TOKENS = ['dit', 'dm', 'dmm', 'dcm', 'dkm', 'vcl', 'vkl', 'clm', 'loz', 'cave', 'fuck', 'shit', 'sex', 'porn', 'xxx', 'bitch'];
export const BAD_SUBSTR = ['fuck', 'porn', 'ditme', 'dcmm', 'vailon', 'concac', 'cailon', 'dume'];
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
export function fold(s) {
return String(s == null ? '' : s).replace(/[đĐ]/g, 'd').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
export function normalizeSlug(s) {
return fold(s).replace(/\.bdsstudio\.app$/, '').replace(/[^a-z0-9-]+/g, '-').replace(/-{2,}/g, '-').replace(/^-+/, '').slice(0, SLUG_MAX + 5);
}
export function slugProblem(slug) {
const s = String(slug || '');
if (!s) return { ok: false, code: 'EMPTY', msg: 'Gõ tên muốn dùng (vd lan-nguyen).' };
if (s.length < SLUG_MIN) return { ok: false, code: 'SHORT', msg: 'Tên cần ít nhất ' + SLUG_MIN + ' ký tự.' };
if (s.length > SLUG_MAX) return { ok: false, code: 'LONG', msg: 'Tên dài tối đa ' + SLUG_MAX + ' ký tự.' };
if (/[^a-z0-9-]/.test(s)) return { ok: false, code: 'CHARS', msg: 'Chỉ dùng chữ thường không dấu (a-z), số (0-9) và dấu "-".' };
if (!SLUG_RE.test(s)) return { ok: false, code: 'EDGE', msg: 'Không bắt đầu hay kết thúc bằng dấu "-".' };
if (s.includes('--')) return { ok: false, code: 'DOUBLE', msg: 'Không dùng hai dấu "-" liền nhau.' };
if (RESERVED.includes(s) || /^bds-?studio/.test(s) || RESERVED_PREFIXES.some((p) => s.startsWith(p))) return { ok: false, code: 'RESERVED', msg: 'Tên "' + s + '" dành riêng cho hệ thống – chọn tên khác.' };
const _of = s.split('-');
if (_of.some((p) => BAD_TOKENS.includes(p)) || BAD_SUBSTR.some((_on) => s.includes(_on))) return { ok: false, code: 'BAD_WORD', msg: 'Tên có từ không phù hợp – chọn tên khác.' };
return { ok: true, code: 'OK', msg: '' };
}
export const validSlug = (s) => slugProblem(s).ok;
export function suggestSlugs(name, { n = 5, extra = [] } = {}) {
const _o2 = new Set(['cong', 'ty', 'tnhh', 'co', 'phan', 'cp', 'jsc', 'ltd', 'company', 'mtv', 'dich', 'vu', 'thuong', 'mai', 'tm', 'dv']);
const words = fold(name).replace(/\bbat dong san\b/g, 'bds').split(/[^a-z0-9]+/).filter(Boolean);
const core = words.filter((_on) => !_o2.has(_on));
const _on = core.length ? core : words;
const _oe = [];
const _o3 = (_oo) => { const s = normalizeSlug(_oo).replace(/-+$/, '').slice(0, SLUG_MAX).replace(/-+$/, ''); if (validSlug(s) && !_oe.includes(s)) _oe.push(s); };
if (_on.length) {
const _od = _on[_on.length - 1], first = _on[0];
if (_on.length > 1) _o3(_od + '-' + first);
_o3(_on.join(''));
_o3(_on.join('-'));
if (_on.length > 1) _o3(_on.slice(0, -1).map((_oo) => _oo[0]).join('') + _od);
_o3(_on.join('') + '-bds');
_o3(_od + '-bds');
}
for (const _oo of extra) _o3(_oo);
return _oe.slice(0, n);
}
export function normDomain(s) {
let _om = fold(String(s || '').trim()).replace(/^[a-z]+:\/\//, '').split(/[/?#]/)[0].replace(/:\d+$/, '').replace(/\.+$/, '');
if (!/^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/.test(_om)) return '';
return _om;
}
export const isVnDomain = (host) => /\.vn$/.test(String(host || ''));
export function domainProblem(host, { _o4 = DEFAULT_BASE } = {}) {
const h = normDomain(host);
if (!h) return { ok: false, code: 'BAD_DOMAIN', msg: 'Tên miền chưa đúng dạng (vd app.tencongty.com hoặc tencuaban.vn).' };
if (h === _o4 || h.endsWith('.' + _o4) || /\.(pages|workers)\.dev$/.test(h)) return { ok: false, code: 'SYSTEM_DOMAIN', msg: 'Đây là tên miền của hệ thống – gõ tên miền riêng của anh/chị.' };
return { ok: true, code: 'OK', msg: '', host: h };
}
export function hiddenSlug(host, attempt = 0) {
const h = normDomain(host);
if (!h) return '';
const _oc = h.split('.');
const _o1 = /^(com|net|org|edu|gov|co|ac|info|biz|name|pro)$/;
const _o9 = _oc.length >= 3 && _oc[_oc.length - 1].length === 2 && _o1.test(_oc[_oc.length - 2]) ? 2 : 1;
const _oi = _oc.slice(0, _oc.length - _o9);
const meaningful = _oi.filter((l) => !['www', 'app'].includes(l));
let s = normalizeSlug((meaningful.length ? meaningful : _oi).join('-')).slice(0, SLUG_MAX - 3).replace(/-+$/, '');
if (!validSlug(s)) s = 'td-' + s.replace(/^-+/, '');
if (attempt > 0) s = s.slice(0, SLUG_MAX - 3).replace(/-+$/, '') + '-' + (attempt + 1);
return validSlug(s) ? s : '';
}
export function cnameFor(host, slug, { target = '' } = {}) {
const h = normDomain(host);
if (!h) return null;
const _oc = h.split('.');
const _ol = _oc.length >= 3 && /^(com|net|org|edu|gov|co|ac|info|biz|name|pro)$/.test(_oc[_oc.length - 2]) && _oc[_oc.length - 1].length === 2;
const _op = _ol ? 3 : 2;
const apex = _oc.length <= _op;
return { type: 'CNAME', name: apex ? '@' : _oc.slice(0, _oc.length - _op).join('.'), zone: _oc.slice(-_op).join('.'), apex,
target: target || (slug ? PAGES_PREFIX + slug + '.pages.dev' : ''), ttl: 'Auto', proxied: true };
}
const _o0 = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/;
export function baseDomain(config = {}) {
const a = String((config && config.APP_DOMAIN) || '').toLowerCase();
if (_o0.test(a)) return a;
const P = config && config.PORTAL;
const h = String((P && typeof P === 'object' && P.host) || (typeof P === 'string' ? P : '') || '').toLowerCase();
const _of = h.split('.');
return _o0.test(h) && _of.length > 2 ? _of.slice(1).join('.') : DEFAULT_BASE;
}
export function portalHost(config = {}) {
const P = config && config.PORTAL;
const h = String((P && typeof P === 'object' && P.host) || (typeof P === 'string' ? P : '') || '').toLowerCase();
if (_o0.test(h)) return h;
const a = String((config && config.APP_DOMAIN) || '').toLowerCase();
return _o0.test(a) ? 'cai.' + a : DEFAULT_PORTAL_HOST;
}
export function domainLinks(config = {}) {
const ok = (u) => { try { const _oo = new URL(String(u || '').trim()); return _oo.protocol === 'https:' ? _oo.href : ''; } catch { return ''; } };
const url = ok(config.AFFILIATE_DOMAIN_URL);
const vnUrl = ok(config.AFFILIATE_DOMAIN_VN_URL);
return { url: url || CLOUDFLARE_REGISTRAR_URL, vnUrl, affiliate: !!url && url !== CLOUDFLARE_REGISTRAR_URL, vnAffiliate: !!vnUrl };
}
export const SPONSORED_REL = 'sponsored noopener';
export const freeUrl = (slug, config = {}) => 'https://' + slug + '.' + baseDomain(config);
export function defaultAddressInfo({ instance = null, diachi = null, host = '', sale = false, config = {} } = {}) {
const hostOf = (u) => { if (!u) return ''; try { return new URL(/^https?:\/\//.test(String(u)) ? String(u) : 'https://' + u).hostname.toLowerCase(); } catch { return ''; } };
const _o4 = baseDomain(config);
const _o8 = hostOf(host) || '';
let own = '';
if (instance && instance.slug) own = hostOf(instance.app_url) || _o8 || instance.slug + '.' + _o4;
else if (diachi && diachi.slug) own = hostOf(diachi.url) || diachi.slug + '.' + _o4;
if (own) return { own: true, host: own, text: 'Địa chỉ mặc định: ' + own + ' – bản app riêng của anh/chị (miễn phí), dữ liệu nằm trong Google của anh/chị, không dùng chung với ai.' };
if (!sale) return { own: true, host: _o8, text: 'Địa chỉ mặc định: ' + (_o8 || 'địa chỉ đang mở') + ' – bản app riêng của anh/chị, dữ liệu nằm trong Google của anh/chị, không dùng chung với ai.' };
return { own: false, host: _o8, text: deferText(config) };
}
export function deferText(config = {}, { company = false } = {}) {
return (company ? 'Địa chỉ app công ty (tên miền của công ty)' : 'Địa chỉ riêng (tenkhach.' + baseDomain(config) + ')')
+ ' bên bán sẽ tạo và gửi anh/chị qua email trong vòng 24 giờ – trong lúc chờ cứ dùng app ở địa chỉ này; dữ liệu không mất khi chuyển.';
}
export function handoffUrl(appUrl, { execUrl, flow = 'personal', domain = '', user = '' } = {}) {
const _o4 = String(appUrl || '').replace(/[#?].*$/, '').replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(_o4) && !/^http:\/\/127\.0\.0\.1(?::\d+)?$/.test(_o4)) return '';
if (!isExecUrl(execUrl)) return '';
const q = new URLSearchParams({ may_chu: String(execUrl).trim(), tu: 'cai', luong: flow === 'company' ? 'company' : 'personal' });
if (domain) q.set('ten_mien', domain);
if (/^[a-z0-9._-]{3,32}$/.test(String(user || ''))) q.set('ten', user);
return _o4 + '/#/ket-noi?' + q.toString();
}
export class ProvisionError extends Error {
constructor(code, message, extra = {}) { super(message || code); this.code = code; Object.assign(this, extra); }
}
export const ERROR_TEXT = {
NO_SERVICE: 'Bên bán chưa bật dịch vụ tạo app tự động – liên hệ bên bán để được tạo giúp.',
NETWORK: 'Không kết nối được dịch vụ tạo app – kiểm tra mạng rồi thử lại.',
TAKEN: 'Tên này đã có người dùng – chọn tên khác.',
BAD_SLUG: 'Tên chưa dùng được – chỉ gồm chữ thường không dấu, số và dấu "-".',
BAD_TOKEN: 'Mã cài đặt không hợp lệ hoặc đã hết hạn – bấm "Thử lại" (app hỏi lại máy chủ bản quyền).',
BAD_TICKET: 'Vé tạo app không hợp lệ – bấm "Thử lại".',
TICKET_EXPIRED: 'Vé tạo app đã hết hạn – bấm "Thử lại".',
CAPTCHA: 'Chưa qua bước kiểm tra chống máy – đánh dấu ô kiểm tra rồi bấm "Tạo ngay" lại.',
PROV_WAIT: 'Tài khoản này vừa xin tạo một app khác – chờ 15 phút rồi thử lại.',
NEED_IDENTITY: 'Máy chủ chưa có quyền xác minh tài khoản Google – dán tệp appsscript.json mới (Trợ lý cài đặt › Tạo máy chủ), trong Sheet bấm BDS Studio › Cài đặt → Cho phép, rồi bấm "Thử lại".',
HAS_APP: 'Tài khoản Google này đã có app – mở địa chỉ app đã tạo trước đó, hoặc liên hệ bên bán.',
RATE_LIMIT: 'Thử quá nhiều lần – chờ một lúc rồi thử lại.',
BAD_DOMAIN: 'Tên miền chưa đúng dạng (vd app.tencongty.vn) – gõ không có https:// và dấu cách.',
BAD_CF: 'Mã Cloudflare của công ty chưa đúng (cần quyền Account › Cloudflare Pages › Edit).',
DISPATCH: 'Dịch vụ tạo app đang bận – thử lại sau ít phút.',
INTERNAL: 'Dịch vụ tạo app báo lỗi – thử lại; vẫn lỗi thì bấm "Cần giúp?".'
};
export function createProvisionClient({ url, fetchImpl, timeoutMs = 20000 } = {}) {
const _o4 = String(url || '').trim().replace(/\/+$/, '');
const _oh = new Map();
const _o6 = async (method, p, body) => {
if (!/^https?:\/\//.test(_o4)) throw new ProvisionError('NO_SERVICE', ERROR_TEXT.NO_SERVICE);
const _oa = fetchImpl || globalThis.fetch.bind(globalThis);
const _o7 = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _ok = _o7 ? setTimeout(() => _o7.abort(), timeoutMs) : null;
let _og, _ob;
try {
_og = await _oa(_o4 + p, { method, credentials: 'omit', cache: 'no-store', headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined, signal: _o7 ? _o7.signal : undefined });
_ob = await _og.json().catch(() => ({}));
} catch (e) { throw new ProvisionError('NETWORK', ERROR_TEXT.NETWORK, { cause: e }); } finally { if (_ok) clearTimeout(_ok); }
if (_ob && _ob.ok) return _ob;
const code = (_ob && _ob.code) || (_og.status === 429 ? 'RATE_LIMIT' : 'INTERNAL');
throw new ProvisionError(code, (_ob && _ob.message) || ERROR_TEXT[code] || ERROR_TEXT.INTERNAL, { status: _og.status, data: _ob });
};
return {
configured: /^https?:\/\//.test(_o4),
async slug(slug) { return _o6('GET', '/slug/' + encodeURIComponent(slug)); },
async create(body) { const _og = await _o6('POST', '/tao', body); if (_og && _og.req) _oh.set(String(body.slug), _og.req); return _og; },
remember(slug, req) { if (slug && /^[0-9a-f]{16}$/.test(String(req || ''))) _oh.set(String(slug), String(req)); },
async status(slug) { const q = _oh.get(String(slug)); return _o6('GET', '/trang-thai/' + encodeURIComponent(slug) + (q ? '?req=' + q : '')); }
};
}
export async function requestTicket({ licenseUrl, install_id, id_token, slug, fetchImpl, timeoutMs = 25000 } = {}) {
if (!/^https:\/\//.test(String(licenseUrl || ''))) throw new ProvisionError('NO_SERVICE', 'Bản này chưa cấu hình máy chủ bản quyền – liên hệ bên bán.');
if (!id_token) throw new ProvisionError('NEED_IDENTITY', ERROR_TEXT.NEED_IDENTITY);
const _oa = fetchImpl || globalThis.fetch.bind(globalThis);
const _o7 = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _ok = _o7 ? setTimeout(() => _o7.abort(), timeoutMs) : null;
let _ob;
try {
const _og = await _oa(licenseUrl, { method: 'POST', redirect: 'follow', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
body: JSON.stringify({ action: 'provision.ticket', payload: { install_id, id_token, slug } }), signal: _o7 ? _o7.signal : undefined });
_ob = JSON.parse(await _og.text());
} catch (e) { throw new ProvisionError('NETWORK', 'Không kết nối được máy chủ bản quyền – kiểm tra mạng rồi thử lại.', { cause: e }); } finally { if (_ok) clearTimeout(_ok); }
if (_ob && _ob.ok && _ob.data && _ob.data.ticket) return _ob.data;
const e = (_ob && _ob.error) || {};
throw new ProvisionError(e.code || 'INTERNAL', e.message || ERROR_TEXT[e.code] || ERROR_TEXT.INTERNAL, { data: e });
}
export async function requestWish({ licenseUrl, install_id, id_token, slug = '', domain = '', fetchImpl, timeoutMs = 25000 } = {}) {
if (!/^https:\/\//.test(String(licenseUrl || ''))) throw new ProvisionError('NO_SERVICE', 'Bản này chưa cấu hình máy chủ bản quyền – gửi tên muốn dùng qua email cho bên bán.');
if (!id_token) throw new ProvisionError('NEED_IDENTITY', ERROR_TEXT.NEED_IDENTITY);
const _oa = fetchImpl || globalThis.fetch.bind(globalThis);
const _o7 = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _ok = _o7 ? setTimeout(() => _o7.abort(), timeoutMs) : null;
let _ob;
try {
const _og = await _oa(licenseUrl, { method: 'POST', redirect: 'follow', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
body: JSON.stringify({ action: 'provision.wish', payload: { install_id, id_token, ...(slug ? { slug } : {}), ...(domain ? { domain } : {}) } }), signal: _o7 ? _o7.signal : undefined });
_ob = JSON.parse(await _og.text());
} catch (e) { throw new ProvisionError('NETWORK', 'Không kết nối được máy chủ bản quyền – kiểm tra mạng rồi thử lại.', { cause: e }); } finally { if (_ok) clearTimeout(_ok); }
if (_ob && _ob.ok && _ob.data && _ob.data.wish) return _ob.data;
const e = (_ob && _ob.error) || {};
const msg = e.code === 'UNKNOWN_ACTION' ? 'Máy chủ của bên bán chưa nhận tên tự động – gửi tên muốn dùng qua email cho bên bán.' : e.message || ERROR_TEXT[e.code] || ERROR_TEXT.INTERNAL;
throw new ProvisionError(e.code || 'INTERNAL', msg, { data: e });
}
export const TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
export function loadTurnstile(doc = globalThis.document) {
if (globalThis.turnstile) return Promise.resolve(globalThis.turnstile);
if (!doc) return Promise.resolve(null);
return new Promise((resolve) => {
const s = doc.createElement('script');
s.src = TURNSTILE_SRC; s.async = true;
s.onload = () => resolve(globalThis.turnstile || null);
s.onerror = () => resolve(null);
doc.head.appendChild(s);
});
}
export async function waitReady(client, slug, { intervalMs = 5000, timeoutMs = 6 * 60000, onTick = () => {}, sleep = (ms) => new Promise((_og) => setTimeout(_og, ms)), now = () => Date.now(), until = ['ok'] } = {}) {
const _oj = now();
for (;;) {
let _og = null;
try { _og = await client.status(slug); } catch (e) { if (e.code !== 'NETWORK') throw e; }
const elapsed = now() - _oj;
if (_og) {
onTick({ status: _og.status, elapsed, message: _og.message || '', rec: _og });
if (until.includes(_og.status)) return _og;
if (_og.status === 'fail') throw new ProvisionError('FAILED', _og.message || 'Tạo app chưa được – thử lại.', { rec: _og });
}
if (elapsed >= timeoutMs) throw new ProvisionError('TIMEOUT', 'Chờ quá lâu – bấm "Kiểm tra bước này" để xem lại; vẫn chưa được thì bấm "Cần giúp?".', { rec: _og });
await sleep(intervalMs);
}
}
export const WAIT_TEXT = 'thường 2–5 phút, có khi tới 15 phút (chờ chứng chỉ https)';
export function progressText(status, elapsedMs) {
const s = Math.round((Number(elapsedMs) || 0) / 1000);
const t = s < 60 ? s + ' giây' : Math.floor(s / 60) + ' phút ' + (s % 60) + ' giây';
if (status === 'cho_dns') return 'App đã tạo xong. Đang chờ tên miền chạy (thêm CNAME xong thường 5–30 phút, lâu nhất 24 giờ)… đã chờ ' + t + '.';
if (s < 20) return 'Đang gửi yêu cầu tạo app… (' + t + ')';
if (s < 100) return 'Đang dựng app riêng của anh/chị từ bản phát hành đã ký… (' + t + ' – ' + WAIT_TEXT + ')';
return 'Đang bật địa chỉ và chứng chỉ bảo mật (https)… (' + t + ' – ' + WAIT_TEXT + '). Cứ để trang này mở, xong app tự chuyển.';
}
export function pickInstallToken(info = {}, parse) {
const list = Array.isArray(info.tokens) ? info.tokens : [];
let _o5 = null;
for (const t of list) {
const _oo = parse ? parse(t) : null;
if (!_oo || !_oo.payload) continue;
const p = _oo.payload;
if (info.install_id && p.iid !== info.install_id) continue;
if (String(p.sc) !== 'app') continue;
if (!_o5 || Number(p.exp) > Number(_o5.payload.exp)) _o5 = { token: _oo.token || t, payload: p };
}
return _o5 ? { token: _o5.token, iid: _o5.payload.iid, ed: _o5.payload.ed, exp: Number(_o5.payload.exp) } : null;
}
export default { RESERVED, BAD_TOKENS, BAD_SUBSTR, fold, normalizeSlug, slugProblem, validSlug, suggestSlugs, normDomain, isVnDomain, domainProblem, hiddenSlug, cnameFor,
baseDomain, portalHost, domainLinks, SPONSORED_REL, DISCLOSURE, freeUrl, handoffUrl, defaultAddressInfo, createProvisionClient, waitReady, progressText, pickInstallToken, ProvisionError, ERROR_TEXT, CLOUDFLARE_REGISTRAR_URL,
RESERVED_PREFIXES, requestTicket, loadTurnstile, TURNSTILE_SRC, deferText, requestWish };

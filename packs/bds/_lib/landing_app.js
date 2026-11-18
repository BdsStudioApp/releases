import { baseDomain, validSlug } from '../../../core/wizard/provision.js';
export const TRANG_PATH = '/trang/';
export const TRANG_PAGE_RE = /^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])$/;
export const EXEC_RE = /^https:\/\/script\.google\.com\/(?:a\/macros\/[a-z0-9.-]{3,100}\/|macros\/)s\/[A-Za-z0-9_-]{20,200}\/exec$/;
export const CACHE_MIN = 5;
export function appTarget(hostname, config = {}) {
const api = String((config && config.PROVISION_URL) || '').trim().replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9.-]+$/i.test(api)) return null;
const base = baseDomain(config), h = String(hostname || '').toLowerCase(), suf = '.' + base;
if (!h.endsWith(suf)) return null;
const app = h.slice(0, -suf.length);
return !app.includes('.') && validSlug(app) ? { app, base, api } : null;
}
export const pageUrl = (t, slug) => (t && slug ? 'https://' + t.app + '.' + t.base + TRANG_PATH + slug + '/' : '');
export const validPage = (slug) => TRANG_PAGE_RE.test(String(slug || '')) && !String(slug).includes('--');
export async function workerCall(t, op, body, fetchFn = (u, o) => fetch(u, o)) {
let _o0 = null, j = null;
try {
_o0 = await fetchFn(t.api + '/landing/' + op, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ app: t.app, ...body }), credentials: 'omit' });
j = await _o0.json().catch(() => null);
} catch { _o0 = null; }
if (j && j.ok === true) return j;
const e = new Error((j && j.message) || (_o0 ? 'Dịch vụ đăng trang chưa trả lời đúng (mã ' + _o0.status + ') – thử lại sau ít phút.' : 'Chưa kết nối được dịch vụ đăng trang – kiểm tra mạng rồi thử lại.'));
e.code = (j && j.code) || (_o0 ? 'HTTP_' + _o0.status : 'NETWORK');
throw e;
}

import { loadTurnstile } from './provision.js';
export const SLOTS_DEFAULT = 50;
export const ACCOUNT_TAG = 'bdsgcai1|';
export const DRIVE_ABOUT = 'https://www.googleapis.com/drive/v3/about?fields=user(permissionId)';
export function gcaiPlan(cfg = {}) {
const _o2 = cfg || {};
const n = Math.floor(Number(_o2.GOOGLE_INSTALL_SLOTS));
return { on: _o2.GOOGLE_INSTALL_ON !== false, slots: Number.isFinite(n) && n > 0 ? n : SLOTS_DEFAULT };
}
export const slotsLabel = (tong = SLOTS_DEFAULT) => 'Ưu tiên ' + (Number(tong) > 0 ? Number(tong) : SLOTS_DEFAULT) + ' khách hàng đầu tiên';
export const slotsLeftText = (con) => (Number(con) > 0 ? 'còn ' + Number(con) + ' chỗ' : 'đã hết chỗ');
export async function accountId(permissionId, subtle = globalThis.crypto && globalThis.crypto.subtle) {
const _o9 = String(permissionId || '').trim();
if (!_o9) throw new SlotError('NO_ACCOUNT', 'Google chưa cho biết tài khoản – đăng nhập Google lại.');
const _o1 = await subtle.digest('SHA-256', new TextEncoder().encode(ACCOUNT_TAG + _o9));
return [...new Uint8Array(_o1)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
export function maskEmail(e) {
const _ob = String(e || '').trim();
const _o6 = _ob.lastIndexOf('@');
if (_o6 < 1) return _ob;
return _ob.slice(0, Math.min(2, _o6)) + '***' + _ob.slice(_o6);
}
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export class SlotError extends Error {
constructor(code, message, extra = {}) { super(message || code); this.name = 'SlotError'; this.code = code; Object.assign(this, extra); }
}
export const SLOT_TEXT = {
NETWORK: 'Chưa tới được dịch vụ của bên bán – kiểm tra mạng rồi thử lại.',
NO_SERVICE: 'Bên bán chưa bật dịch vụ này.',
INTERNAL: 'Dịch vụ của bên bán báo lỗi – thử lại sau ít phút.',
CAPTCHA: 'Chưa qua bước kiểm tra chống máy – bấm lại nút để thử lại.',
CAPTCHA_LOAD: 'Không tải được ô kiểm tra chống máy (Cloudflare Turnstile) – kiểm tra mạng rồi thử lại.'
};
export function slotService({ url, fetchImpl, timeoutMs = 8000 } = {}) {
const _o0 = String(url || '').trim().replace(/\/+$/, '');
const configured = /^https?:\/\//.test(_o0);
async function _o3(method, p, body, ms = timeoutMs) {
if (!configured) throw new SlotError('NO_SERVICE', SLOT_TEXT.NO_SERVICE);
const _o5 = fetchImpl || globalThis.fetch.bind(globalThis);
const _o4 = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _oc = _o4 ? setTimeout(() => _o4.abort(), ms) : null;
let _oa, _o7;
try {
_oa = await _o5(_o0 + p, { method, credentials: 'omit', cache: method === 'GET' ? 'default' : 'no-store', referrerPolicy: 'strict-origin',
headers: body ? { 'Content-Type': 'application/json' } : {}, body: body ? JSON.stringify(body) : undefined, signal: _o4 ? _o4.signal : undefined });
_o7 = await _oa.json().catch(() => null);
} catch (e) { throw new SlotError('NETWORK', SLOT_TEXT.NETWORK, { cause: e }); } finally { if (_oc) clearTimeout(_oc); }
if (_o7 && _o7.ok) return _o7;
const code = (_o7 && _o7.code) || (_oa.status === 429 ? 'RATE_LIMIT' : 'INTERNAL');
throw new SlotError(code, (_o7 && _o7.message) || SLOT_TEXT[code] || SLOT_TEXT.INTERNAL, { status: _oa.status, data: _o7 });
}
return {
configured,
async slots() { const _o7 = await _o3('GET', '/gcai/con-cho', null, 6000); return { con: Math.max(0, Number(_o7.con) || 0), tong: Math.max(0, Number(_o7.tong) || 0) }; },
async claim({ id, turnstile = '' }) { return _o3('POST', '/gcai/giu-cho', { id, ...(turnstile ? { turnstile } : {}) }); },
async sendLink({ email, turnstile = '' }) { return _o3('POST', '/gui-link-cai', { email: String(email || '').trim(), ...(turnstile ? { turnstile } : {}) }, 15000); }
};
}
export const slotStateOf = (_oa) => ({ st: _oa && _oa.con > 0 ? 'con' : 'het', con: (_oa && _oa.con) || 0, tong: (_oa && _oa.tong) || 0 });
export async function captchaToken(host, cfg = {}, { action = '', load = loadTurnstile } = {}) {
const _o8 = String((cfg && cfg.TURNSTILE_SITEKEY) || '').trim();
if (!_o8) return '';
const _od = await load();
if (!_od || !host) throw new SlotError('CAPTCHA', SLOT_TEXT.CAPTCHA_LOAD);
if (host.__tsId != null) { try { _od.remove(host.__tsId); } catch { } host.__tsId = null; }
return new Promise((resolve, reject) => {
host.__tsId = _od.render(host, { sitekey: _o8, language: 'vi', ...(action ? { action } : {}), callback: (t) => resolve(t), 'error-callback': () => reject(new SlotError('CAPTCHA', SLOT_TEXT.CAPTCHA)) });
});
}
export default { gcaiPlan, slotsLabel, slotsLeftText, accountId, maskEmail, slotService, slotStateOf, captchaToken, SlotError, DRIVE_ABOUT, SLOTS_DEFAULT };

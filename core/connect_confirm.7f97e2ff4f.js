import { EXEC_URL_RE } from './exec_url.4b6ba956ed.js';
export const PENDING_KEY = 'bds:connect:pending';
export const HANDOFF_KEY = 'bds:wizard:handoff';
const _o0 = 30 * 60 * 1000;
export function pendingFrom(url, q) {
if (!EXEC_URL_RE.test(String(url || ''))) return null;
const dom = String((q && q.get && q.get('ten_mien')) || '').toLowerCase();
return { url: String(url), flow: q && q.get && q.get('luong') === 'company' ? 'company' : 'personal', domain: /^[a-z0-9.-]{4,253}$/.test(dom) ? dom : '', at: Date.now() };
}
export const INVITE_TOKEN_RE = /^[0-9a-f]{16}\.[A-Za-z0-9_-]{16,64}$/;
export function pendingFromServer(url, inviteToken = '') {
const p = pendingFrom(url, null);
if (!p) return null;
const ma = String(inviteToken || '');
return INVITE_TOKEN_RE.test(ma) || ma === 'bad' ? { ...p, kind: 'invite', ma } : { ...p, kind: 'server' };
}
export function savePending(p, ss = globalThis.sessionStorage) { try { ss.setItem(PENDING_KEY, JSON.stringify(p)); } catch { } }
export function readPending(ss = globalThis.sessionStorage, now = Date.now()) {
let p = null;
try { p = JSON.parse(ss.getItem(PENDING_KEY) || 'null'); } catch { p = null; }
if (!p || !EXEC_URL_RE.test(String(p.url || '')) || !(now - Number(p.at || 0) < _o0)) return null;
if (p.ma != null && !(INVITE_TOKEN_RE.test(String(p.ma)) || p.ma === 'bad')) { delete p.ma; if (p.kind === 'invite') p.kind = 'server'; }
return p;
}
export function clearPending(ss = globalThis.sessionStorage) { try { ss.removeItem(PENDING_KEY); } catch { } }
export function serverShort(url) {
const _o5 = /^https:\/\/([^/]+)(\/.*\/s\/)([A-Za-z0-9_-]+)(\/exec)$/.exec(String(url || ''));
if (!_o5) return String(url || '');
const _o3 = _o5[3].length > 18 ? _o5[3].slice(0, 10) + '…' + _o5[3].slice(-6) : _o5[3];
return _o5[1] + _o5[2] + _o3 + _o5[4];
}
export async function probeServer(url, { fetchFn = (...a) => globalThis.fetch(...a), timeoutMs = 15000 } = {}) {
if (!EXEC_URL_RE.test(String(url || ''))) return { ok: false, code: 'BAD_URL' };
const _o2 = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _oa = _o2 ? setTimeout(() => _o2.abort(), timeoutMs) : null;
try {
const _o7 = await fetchFn(url, { method: 'POST', redirect: 'follow', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
body: JSON.stringify({ action: 'status', token: '', device_id: '', payload: {} }), signal: _o2 ? _o2.signal : undefined });
const text = await _o7.text();
if (/^\s*</.test(text)) return { ok: false, code: 'NOT_PUBLIC' };
const _o4 = JSON.parse(text);
if (!_o4 || _o4.ok !== true || !_o4.data || typeof _o4.data !== 'object') return { ok: false, code: 'NOT_BDS' };
return { ok: true, status: _o4.data };
} catch { return { ok: false, code: 'NETWORK' }; } finally { if (_oa) clearTimeout(_oa); }
}
const _o1 = (v, n = 120) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f<>]/g, '').trim().slice(0, n);
export function identityRows(url, status) {
const _o9 = status || {};
const _o8 = [];
const company = _o1(_o9.company || _o9.company_name || _o9.app_name);
const owner = _o1(_o9.owner_name || _o9.owner);
if (company) _o8.push(['Tên công ty / app', company, 'connect-confirm-company']);
if (owner) _o8.push(['Chủ máy chủ', owner, 'connect-confirm-owner']);
_o8.push(['Địa chỉ máy chủ', serverShort(url), 'connect-confirm-server']);
if (_o9.version) _o8.push(['Phiên bản máy chủ', _o1(_o9.version, 20) + (_o9.setup === false ? ' · chưa có tài khoản' : ''), 'connect-confirm-version']);
return _o8;
}
export const PROBLEM_TEXT = {
NETWORK: 'Chưa hỏi được máy chủ này (mạng chập chờn hoặc máy chủ chưa chạy). Chỉ bấm "Đúng máy chủ của tôi" nếu địa chỉ trên khớp địa chỉ trong Sheet của anh/chị.',
NOT_PUBLIC: 'Máy chủ này chưa mở cho "Bất kỳ ai" (Triển khai › Quản lý triển khai › sửa → Bất kỳ ai).',
NOT_BDS: 'Địa chỉ này không trả lời như máy chủ BDS Studio – nhiều khả năng KHÔNG phải máy chủ của anh/chị.',
BAD_URL: 'Địa chỉ máy chủ không hợp lệ.'
};
export function confirmView(u, { url, probe, onYes, onNo, kind = '' }) {
const { h, button } = u;
const _o8 = identityRows(url, probe && probe.ok ? probe.status : null);
const _o6 = probe && !probe.ok ? (PROBLEM_TEXT[probe.code] || PROBLEM_TEXT.NETWORK) : '';
return h('div', { class: 'auth-form', 'data-testid': 'connect-confirm' },
h('dl', { class: 'kv' }, _o8.map(([k, v, _o3]) => [h('dt', null, k), h('dd', { 'data-testid': _o3 }, v)])),
_o6 ? h('p', { class: 'form-error', role: 'alert', 'data-testid': 'connect-confirm-problem' }, _o6) : null,
h('p', { class: 'muted small', 'data-testid': 'connect-confirm-hint' }, kind === 'invite' || kind === 'server'
? 'Chỉ bấm khi tên công ty / app đúng là nơi đã mời anh/chị (hỏi lại người mời nếu chưa chắc). Chưa bấm thì app chưa gửi mật khẩu hay thông tin gì của anh/chị tới máy chủ này. '
+ 'Nhận link từ người lạ hoặc thấy tên lạ → bấm "Không phải".'
: 'Chỉ bấm khi đây đúng là máy chủ anh/chị vừa tạo (tên công ty và địa chỉ khớp Sheet của mình). '
+ 'Nhận link này từ người lạ → bấm "Không phải".'),
button('Đúng máy chủ của tôi', onYes, { kind: 'primary', block: true, icon: 'check', testid: 'connect-confirm-yes' }),
button('Không phải – nhập địa chỉ khác', onNo, { kind: 'ghost', block: true, icon: 'close', testid: 'connect-confirm-no' }));
}

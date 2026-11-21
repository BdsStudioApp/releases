import { t } from './i18n.17f01a0b54.js';
import { friendlyError } from './friendly_error.a1be44bf9a.js';
import { helpDocLink, helpPageForKey } from './help_links.2d1b2d6d34.js';
const _o4 = 'http://www.w3.org/2000/svg';
export function h(tag, attrs, ...children) {
const el = document.createElement(tag);
if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) {
children.unshift(attrs); attrs = null;
}
if (attrs) _oa(el, attrs);
_o9(el, children);
return el;
}
function _oa(el, attrs) {
for (const [k, _o20] of Object.entries(attrs)) {
if (_o20 == null || _o20 === false) continue;
if (k === 'class' || k === 'className') el.className = Array.isArray(_o20) ? _o20.filter(Boolean).join(' ') : _o20;
else if (k === 'style') {
if (typeof _o20 === 'string') el.style.cssText = _o20;
else for (const [sk, sv] of Object.entries(_o20)) {
if (sk.startsWith('--')) el.style.setProperty(sk, sv); else el.style[sk] = sv;
}
} else if (k === 'dataset') Object.assign(el.dataset, _o20);
else if (k.startsWith('on') && typeof _o20 === 'function') el.addEventListener(k.slice(2).toLowerCase(), _o20);
else if (k === 'text') el.textContent = _o20;
else if (k in el && typeof _o20 !== 'string' && k !== 'list') { try { el[k] = _o20; } catch { el.setAttribute(k, _o20); } }
else if (_o20 === true) el.setAttribute(k, '');
else el.setAttribute(k, String(_o20));
}
}
function _o9(el, children) {
for (const c of children.flat(Infinity)) {
if (c == null || c === false || c === true) continue;
el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
}
}
export function dropEmpty(list) { return list.filter((c) => c != null && c !== false); }
export function installDomGuard(_o1g = typeof globalThis !== 'undefined' ? globalThis : null) {
if (!_o1g) return false;
for (const name of ['Element', 'DocumentFragment', 'Document']) {
const C = _o1g[name];
if (!C || !C.prototype) continue;
for (const m of ['append', 'prepend', 'replaceChildren']) {
const _o17 = C.prototype[m];
if (typeof _o17 !== 'function' || _o17.__dropsEmpty) continue;
const _o23 = function (...kids) { return _o17.apply(this, dropEmpty(kids)); };
_o23.__dropsEmpty = true;
try { Object.defineProperty(C.prototype, m, { value: _o23, writable: true, configurable: true }); } catch { }
}
}
return true;
}
installDomGuard();
export function clear(el) { while (el && el.firstChild) el.removeChild(el.firstChild); return el; }
export function mountTo(el, ...children) { clear(el); _o9(el, children); return el; }
const _o3 = {
home: 'M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z',
customers: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-6 9c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.2a3.5 3.5 0 0 1 0 6.6M18 14.3c1.8.8 3 2.6 3 4.7',
sales: 'M7 3h10a1 1 0 0 1 1 1v17l-3-2-3 2-3-2-3 2V4a1 1 0 0 1 1-1Zm2.5 5h5m-5 4h5m-5 4h3',
content: 'M4 6.5A1.5 1.5 0 0 1 5.5 5h9A1.5 1.5 0 0 1 16 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 4 17.5zM16 10l4-2.5v9L16 14',
inbox: 'M4 13.5 6.5 5h11l2.5 8.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1zm0 0h4.5l1 2h5l1-2H20',
settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3c0-.5 0-1-.1-1.4l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2.4-1.4L14 2.5h-4l-.4 2.6a7 7 0 0 0-2.5 1.4l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 2.9l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2.5 1.4l.4 2.6h4l.4-2.6a7 7 0 0 0 2.4-1.4l2.4 1 2-3.4-2-1.6c.1-.5.1-1 .1-1.5Z',
lock: 'M7 10V7.5a5 5 0 0 1 10 0V10M6 10h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Zm6 4v2.5',
key: 'M8 15a4 4 0 1 1 3.9-4.9H21v3h-2v2.5h-3V13h-4.1A4 4 0 0 1 8 15Zm-1-4.5a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z',
back: 'M15 5l-7 7 7 7',
next: 'M9 5l7 7-7 7',
up: 'M12 19V5M5 12l7-7 7 7',
more: 'M5 12h.01M12 12h.01M19 12h.01',
down: 'M12 5v14M5 12l7 7 7-7',
close: 'M6 6l12 12M18 6 6 18',
check: 'M5 12.5l4.5 4.5L19 7.5',
x: 'M7 7l10 10M17 7 7 17',
help: 'M9.5 9.2a2.6 2.6 0 0 1 5 .9c0 1.8-2.5 2.3-2.5 4M12 17.5v.1M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0-13v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4',
refresh: 'M20 11a8 8 0 0 0-14.7-4M4 5v4h4M4 13a8 8 0 0 0 14.7 4M20 19v-4h-4',
sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z',
user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9c0-3.9 3.1-7 7-7s7 3.1 7 7',
shield: 'M12 3l7 3v6c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9V6z',
link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
chip: 'M8 8h8v8H8zM9 3v3m6-3v3M9 18v3m6-3v3M3 9h3m-3 6h3m12-6h3m-3 6h3',
wallet: 'M4 7a2 2 0 0 1 2-2h11v4M4 7v10a2 2 0 0 0 2 2h13V9H6a2 2 0 0 1-2-2Zm12 6.5h1',
disk: 'M4 7c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3Zm0 0v10c0 1.7 3.6 3 8 3s8-1.3 8-3V7M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
puzzle: 'M9 4h3a1.5 1.5 0 0 1 3 0h3v4a1.5 1.5 0 0 1 0 3v4h-4a1.5 1.5 0 0 0-3 0H7v-4a1.5 1.5 0 0 1 0-3V4z',
pulse: 'M3 12h4l2.5-6 5 12L17 12h4',
tag: 'M4 4h7l9 9-7 7-9-9zM8.5 8.5h.01',
log: 'M6 4h12v16H6zM9 8h6M9 12h6M9 16h4',
layout: 'M4 5h16v14H4zM4 10h16M10 10v9',
logout: 'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 8l-4 4 4 4M6 12h10',
plus: 'M12 5v14M5 12h14',
minus: 'M5 12h14',
clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2',
copy: 'M9 9h10v11H9zM15 9V4H5v11h4',
download: 'M12 4v11m-4.5-4.5L12 15l4.5-4.5M5 20h14',
external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
print: 'M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M7 14h10v6H7z',
send: 'M4 12 20 4l-5 16-3-7-8-1Zm8 1 8-9',
undo: 'M9 7 4 12l5 5M4 12h11a5 5 0 0 1 0 10h-3',
cloud: 'M7 18.5h10.5a4 4 0 0 0 .4-8 6 6 0 0 0-11.6 1.6A3.2 3.2 0 0 0 7 18.5Z',
monitor: 'M4 5h16v11H4zM9 20h6M12 16v4',
bulb: 'M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2v.5h5V16c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3Z',
wrench: 'M14.5 6.5a4.5 4.5 0 0 0 5.6 5.6l-8.4 8.4a2.1 2.1 0 0 1-3-3l8.4-8.4a4.5 4.5 0 0 1 5.6-5.6l-3 3 .6 2.4 2.4.6',
film: 'M4 4h16v16H4zM8 4v16M16 4v16M4 8h4M4 12h4M4 16h4M16 8h4M16 12h4M16 16h4',
calculator: 'M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm2 3.5h8v3.5H8zM8.5 14h.01M12 14h.01M15.5 14h.01M8.5 17.5h.01M12 17.5h.01M15.5 17.5h.01',
heart: 'M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z',
megaphone: 'M3.5 10.5 17 6v12l-13.5-4.5zM7.5 14.8l.9 3.6a1.5 1.5 0 0 0 2.9-.7l-.6-2.3M17 9.5a2.5 2.5 0 0 1 0 5',
building: 'M3.5 21h17M6 21V4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v17M15 9h3a1 1 0 0 1 1 1v11M9 7h3M9 11h3M9 15h3',
cap: 'M2.5 9.5 12 5l9.5 4.5L12 14zM6.5 11.6V16c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3v-4.4M21.5 9.5V15',
chat: 'M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z',
phone: 'M6.6 3.5h2.7l1.4 4.2-2 1.3a11 11 0 0 0 6.3 6.3l1.3-2 4.2 1.4v2.7a1.6 1.6 0 0 1-1.8 1.6A16.5 16.5 0 0 1 5 5.3a1.6 1.6 0 0 1 1.6-1.8Z',
eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
plug: 'M9 3v5M15 3v5M6.5 8h11v3a5.5 5.5 0 0 1-11 0zM12 16.5V21',
filter: 'M4 5h16l-6 7.5V19l-4 1.5v-8z',
edit: 'M4 20h4L18.6 9.4a2.1 2.1 0 0 0-3-3L5 17v3ZM13.5 7.5l3 3'
};
export function icon(name, size = 22, cls = '') {
const _o1k = document.createElementNS(_o4, 'svg');
_o1k.setAttribute('viewBox', '0 0 24 24');
_o1k.setAttribute('width', size); _o1k.setAttribute('height', size);
_o1k.setAttribute('fill', 'none'); _o1k.setAttribute('stroke', 'currentColor');
_o1k.setAttribute('stroke-width', '1.7'); _o1k.setAttribute('stroke-linecap', 'round');
_o1k.setAttribute('stroke-linejoin', 'round'); _o1k.setAttribute('aria-hidden', 'true');
_o1k.setAttribute('class', ('ico ' + cls).trim());
const _o1a = document.createElementNS(_o4, 'path');
_o1a.setAttribute('d', _o3[name] || _o3.sparkle);
_o1k.appendChild(_o1a);
return _o1k;
}
export const iconNames = Object.keys(_o3);
export function glyph(_o20, size = 24) {
if (_o20 && _o3[_o20]) return icon(_o20, size);
return h('span', { class: 'emoji', 'aria-hidden': 'true' }, _o20 || '✦');
}
const _o0 = [
[/^(huỷ|hủy|đóng|để sau|bỏ qua|quên)/i, 'close'],
[/^(lưu|xong|đồng ý|xác nhận|áp dụng|ok\b)/i, 'check'],
[/^tải (về|xuống|bộ|file|tệp|mẫu)|^tải \S+\.(gs|zip|csv|pdf|json|xlsx)\b/i, 'download'],
[/^gửi/i, 'send'],
[/^(đồng bộ|làm mới|tải lại|cập nhật|kiểm tra lại|thử lại)/i, 'refresh'],
[/^(sao chép|chép)/i, 'copy'],
[/^(thêm|tạo)/i, 'plus'],
[/^(kiểm)/i, 'pulse'],
[/^(xem|mở)/i, 'next'],
[/^(sửa|ghi chú)/i, 'edit'],
[/^(lập lịch|đặt lịch|hẹn )/i, 'clock'],
[/^(đã xử lý|duyệt)/i, 'check'],
[/^bỏ(\s|$)/i, 'close'],
[/^xuất/i, 'download']
];
export function autoIcon(label, cls) {
const _o1h = String(label || '').trim();
if (!_o1h || /chip/.test(String(cls || '')) || /^(\p{Extended_Pictographic}|[✓✔✖✕✗←→↻⟳＋+⚙↩])/u.test(_o1h)) return undefined;
for (const [re, name] of _o0) if (re.test(_o1h)) return name;
return undefined;
}
export function button(label, onClick, opts = {}) {
const { kind = 'secondary', type = 'button', title, disabled, small, block, id, cls, testid } = opts;
const _or = opts.icon === false ? undefined : opts.icon || (typeof label === 'string' ? autoIcon(label, cls) : undefined);
const _ob = h('button', {
type, id, title, disabled, 'data-testid': testid,
class: ['btn', 'btn-' + kind, small && 'btn-sm', block && 'btn-block', !label && 'btn-icon', cls]
});
if (_or) _ob.appendChild(typeof _or === 'string' && _o3[_or] ? icon(_or, small ? 18 : 20) : glyph(_or, 18));
if (label) _ob.appendChild(h('span', null, label));
if (!label && title) _ob.setAttribute('aria-label', title);
if (onClick) _ob.addEventListener('click', async (e) => {
if (_ob.dataset.busy) return;
const _o1d = onClick(e);
if (_o1d && typeof _o1d.then === 'function') {
_ob.dataset.busy = '1'; _ob.classList.add('is-busy');
try { await _o1d; } catch (err) { _o1e(err); } finally { delete _ob.dataset.busy; _ob.classList.remove('is-busy'); }
}
});
return _ob;
}
function _o1e(err) {
const _ol = friendlyError(err, { online: typeof navigator !== 'undefined' ? navigator.onLine : undefined });
toast(_ol.message || t('err.generic'), 'error', _ol.detail ? 6000 : 3200, { detail: _ol.detail });
try { window.dispatchEvent(new CustomEvent('bds:error', { detail: { level: 'warn', where: 'ui.button', message: String(err && err.message || err), detail: err && err.stack } })); } catch { }
}
export function badge(text, tone = 'neutral') { return h('span', { class: 'badge badge-' + tone }, text); }
export function empty(text, _or = 'sparkle') {
return h('div', { class: 'empty' }, h('div', { class: 'empty-ico' }, icon(_or, 28)), h('p', null, text || t('common.empty')));
}
export function progress(pct, label) {
const _o1a = Math.max(0, Math.min(100, Number(pct) || 0));
return h('div', { class: 'progress', role: 'progressbar', 'aria-valuenow': _o1a, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': label || (_o1a + '%') },
h('div', { class: 'progress-bar', style: { width: _o1a + '%' } }));
}
export function spinner() { return h('span', { class: 'spinner', 'aria-hidden': 'true' }); }
export function money(n) {
const L = typeof window !== 'undefined' && window.BDSLogic;
if (L && L.fmt && typeof L.fmt.money === 'function') { try { return L.fmt.money(n); } catch { } }
const _o20 = Number(n) || 0;
if (Math.abs(_o20) >= 1e9) return (_o20 / 1e9).toFixed(2).replace('.', ',') + ' tỷ';
return Math.round(_o20 / 1e6).toLocaleString('vi-VN') + ' triệu';
}
export function num(n, _og = 0) { return (Number(n) || 0).toLocaleString('vi-VN', { maximumFractionDigits: _og, minimumFractionDigits: _og }); }
export function date(ms, withTime = false) {
if (!ms) return '';
const _og = new Date(Number(ms));
const _o1a = (x) => String(x).padStart(2, '0');
const _o1h = _o1a(_og.getDate()) + '/' + _o1a(_og.getMonth() + 1) + '/' + _og.getFullYear();
return withTime ? _o1h + ' ' + _o1a(_og.getHours()) + ':' + _o1a(_og.getMinutes()) : _o1h;
}
const _o5 = 3;
const isPhone = () => { try { return typeof matchMedia === 'function' && matchMedia('(max-width: 639px)').matches; } catch { return false; } };
const _o11 = () => modalStack.length > 0 || (typeof document !== 'undefined' && !!document.querySelector('.modal-back.in'));
let _o1r = false;
function _o1q() {
let el = document.getElementById('toasts');
if (!el) { el = h('div', { id: 'toasts', class: 'toasts', 'aria-live': 'polite', role: 'status' }); document.body.appendChild(el); }
if (!_o1r) { _o1r = true; try { window.addEventListener('hashchange', () => clearToasts({ olderThan: 600 })); } catch { } }
return el;
}
function _oh(el) { clearTimeout(el._tt); el.classList.remove('in'); el.remove(); }
function _o1v(host) {
const max = (isPhone() || _o11()) ? 1 : _o5;
while (host.children.length > max) _oh(host.firstChild);
}
export function clearToasts({ olderThan = 0 } = {}) {
const host = typeof document !== 'undefined' && document.getElementById('toasts');
if (!host) return;
const now = Date.now();
for (const el of [...host.children]) if (now - (Number(el.dataset.at) || 0) >= olderThan) _oh(el);
}
export function toast(text, kind = 'info', ms = 3200, opts = {}) {
if (kind === 'success') kind = 'ok';
if (kind === 'danger') kind = 'error';
const host = _o1q();
const key = kind + '|' + String(text);
for (const _o14 of [...host.children]) if (_o14.dataset.key === key) _oh(_o14);
const _os = { ok: 'check', error: 'x', warn: 'help', info: 'sparkle' }[kind] || 'sparkle';
const detail = opts && opts.detail ? h('details', { class: 'toast-detail small', 'data-testid': 'toast-detail' }, h('summary', null, 'Chi tiết kỹ thuật'), h('code', null, String(opts.detail))) : null;
const el = h('div', { class: 'toast toast-' + kind, dataset: { key, at: String(Date.now()) } }, icon(_os, 18), detail ? h('span', null, h('span', null, text), detail) : h('span', null, text));
host.appendChild(el);
_o1v(host);
el.addEventListener('click', (e) => { if (!(e.target && e.target.closest && e.target.closest('details'))) _oh(el); });
requestAnimationFrame(() => el.classList.add('in'));
el._tt = setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 260); }, ms);
return el;
}
function _o1m() {
if (typeof document === 'undefined') return;
const _o15 = modalStack.length > 0;
document.documentElement.classList.toggle('modal-open', _o15);
const host = document.getElementById('toasts');
if (_o15 && host) _o1v(host);
}
let modalStack = [];
const _o2 = 'textarea, input:not([type]), input[type=text], input[type=tel], input[type=email], input[type=number], input[type=url], input[type=date], input[type=datetime-local]';
function _o1t(_o1g) {
const _o1x = new Set();
_o1g.addEventListener('focusin', (e) => { const el = e.target; if (el && el.matches && el.matches(_o2) && el._v0 === undefined) el._v0 = el.value; }, true);
_o1g.addEventListener('input', (e) => { const el = e.target; if (el && el.matches && el.matches(_o2) && !el.closest('[data-nodirty]')) _o1x.add(el); }, true);
return () => {
for (const el of _o1x) {
if (!el.isConnected) { _o1x.delete(el); continue; }
if (el._v0 === undefined || String(el.value) !== String(el._v0)) return true;
}
return false;
};
}
let _ox = null;
export function confirmLeave() {
if (_ox) return _ox.then(() => false);
_ox = modal({ title: t('modal.leave.title'), body: h('p', { class: 'lead' }, t('modal.leave.text')), cls: 'modal-leave',
actions: [{ label: t('modal.leave.stay'), kind: 'primary', value: false, icon: 'edit' }, { label: t('modal.leave.ok'), kind: 'danger', value: true, icon: 'close', id: 'leave-ok' }] })
.done.then((_o20) => _o20 === true).finally(() => { _ox = null; });
return _ox;
}
export function modal({ title, body, actions, onClose, wide, dismissible = true, cls } = {}) {
const _o1c = document.activeElement;
let _o1f; const done = new Promise((_o1d) => { _o1f = _o1d; });
const close = (value) => {
if (!back.isConnected) return;
back.classList.remove('in');
modalStack = modalStack.filter((m) => m !== _o8);
_o1m();
setTimeout(() => back.remove(), 200);
_o10(_o8);
document.removeEventListener('keydown', onKey, true);
try { onClose && onClose(value); } catch { }
_o1f(value);
if (_o1c && _o1c.focus) try { _o1c.focus(); } catch { }
};
const foot = h('div', { class: 'modal-foot' });
for (const _o6 of actions || []) {
foot.appendChild(button(_o6.label, async (e) => {
const _o1d = _o6.onClick ? await _o6.onClick(close, e) : undefined;
if (_o1d !== false && _o6.close !== false) close(_o6.value !== undefined ? _o6.value : _o1d);
}, { kind: _o6.kind || 'secondary', icon: actionIcon(_o6), id: _o6.id }));
}
const head = h('div', { class: 'modal-head' },
h('h2', { class: 'modal-title', id: 'mt' + Date.now() }, title || ''),
dismissible ? button('', () => close(undefined), { kind: 'ghost', icon: 'close', title: t('common.close'), cls: 'modal-x' }) : null);
const box = h('div', { class: ['modal', wide && 'modal-wide', cls], role: 'dialog', 'aria-modal': 'true', 'aria-label': title || '' },
head, h('div', { class: 'modal-body' }, body), (actions && actions.length) ? foot : null);
const back = h('div', { class: 'modal-back' }, box);
const _ot = dismissible ? _o1t(box) : () => false;
const _o1b = () => { if (!_ot()) return close(undefined); confirmLeave().then((yes) => { if (yes) close(undefined); }); };
if (dismissible) back.addEventListener('mousedown', (e) => { if (e.target === back) _o1b(); });
const onKey = (e) => {
if (modalStack[modalStack.length - 1] !== _o8) return;
if (e.key === 'Escape' && dismissible) { e.stopPropagation(); close(undefined); }
if (e.key === 'Tab') _o1u(box, e);
};
document.addEventListener('keydown', onKey, true);
document.body.appendChild(back);
requestAnimationFrame(() => {
back.classList.add('in');
if (box.contains(document.activeElement)) return;
const _ol = box.querySelector('input,textarea,select') || box.querySelector('.modal-foot .btn-primary') || box.querySelector('button');
if (_ol) try { _ol.focus({ preventScroll: true }); } catch { }
});
const _o8 = { el: box, close, done };
modalStack.push(_o8);
_o1m();
if (dismissible && !isWide()) {
_o8.histId = ++_oz;
try { history.pushState({ bdsModal: _o8.histId }, ''); _o8.pushed = true; } catch { _o8.pushed = false; }
_o8.onPop = () => {
_o8.pushed = false;
if (!_ot()) return close(undefined);
try { history.pushState({ bdsModal: _o8.histId }, ''); _o8.pushed = true; } catch { _o8.pushed = false; }
_o1b();
};
_ok(box, head, () => _o1b());
}
return _o8;
}
let _oz = 0;
function _o10(_o8) {
if (!_o8 || !_o8.pushed) return;
_o8.pushed = false;
const _o1w = (n) => {
try {
const _o1j = history.state;
if (_o1j && _o1j.bdsModal === _o8.histId) { _o19++; history.back(); return; }
if (_o1j && Number(_o1j.bdsModal) > _o8.histId && _o19 > 0 && n < 40) setTimeout(() => _o1w(n + 1), 25);
} catch { }
};
setTimeout(() => _o1w(0), 0);
}
function _ok(box, handle, onClose) {
let _o25 = null, _oi = 0;
handle.addEventListener('touchstart', (e) => { _o25 = e.touches[0].clientY; _oi = 0; }, { passive: true });
handle.addEventListener('touchmove', (e) => {
if (_o25 == null) return;
_oi = Math.max(0, e.touches[0].clientY - _o25);
box.style.transition = 'none'; box.style.transform = 'translateY(' + _oi + 'px)';
}, { passive: true });
handle.addEventListener('touchend', () => { box.style.transition = ''; box.style.transform = ''; if (_o25 != null && _oi > 90) onClose(); _o25 = null; });
}
const _o1 = /^(huỷ|hủy|đóng|để sau|thôi|bỏ qua|không|quay lại)/i;
export function actionIcon(_o6) {
if (!_o6 || _o6.icon === false) return undefined;
if (_o6.icon) return _o6.icon;
const label = String(_o6.label || '').trim();
if (!label || /^(\p{Extended_Pictographic}|[✓✔✖✕✗←→↻⟳＋+⚙↩])/u.test(label)) return undefined;
return _o6.value === false || _o1.test(label) ? 'close' : (autoIcon(label) || 'check');
}
function _o1u(box, e) {
const _ol = [...box.querySelectorAll('button,input,select,textarea,a[href],[tabindex]:not([tabindex="-1"])')].filter((x) => !x.disabled && x.offsetParent !== null);
if (!_ol.length) return;
const _oo = _ol[0], last = _ol[_ol.length - 1];
if (e.shiftKey && document.activeElement === _oo) { e.preventDefault(); last.focus(); }
else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); _oo.focus(); }
}
export function confirm(text, { ok = t('common.ok'), kind = 'primary', title } = {}) {
return modal({
title: title || t('common.help'), body: h('p', { class: 'lead' }, text),
actions: [{ label: t('common.cancel'), kind: 'ghost', value: false }, { label: ok, kind, value: true, id: 'confirm-ok' }]
}).done.then((_o20) => _o20 === true);
}
export function helpText(key) {
const _o1h = t('help.' + key);
return _o1h === 'help.' + key ? '' : _o1h;
}
export function paragraphs(text) {
return h('div', { class: 'prose' }, String(text || '').split(/\n+/).map((line) => h('p', null, line)));
}
export function help(key, title) {
const _ob = h('button', { type: 'button', class: 'help-btn', 'aria-label': t('common.help'), title: t('common.help'), dataset: { help: key } }, icon('help', 18));
_ob.addEventListener('click', (e) => {
e.stopPropagation(); e.preventDefault();
modal({ title: title || t('common.help'), body: h('div', null, paragraphs(helpText(key) || t('common.empty')), helpDocLink(h, helpPageForKey(key))), actions: [{ label: t('common.close'), kind: 'primary' }] });
});
return _ob;
}
export function card({ title, subtitle, icon: _or, actions, body, detail, tone, cls, id, open } = {}) {
const el = h('section', { class: ['card', tone && 'card-' + tone, cls], id });
if (title || actions) {
el.appendChild(h('header', { class: 'card-head' },
_or ? h('div', { class: 'card-ico' }, glyph(_or, 20)) : null,
h('div', { class: 'card-titles' },
title ? h('h3', { class: 'card-title' }, title) : null,
subtitle ? h('p', { class: 'card-sub' }, subtitle) : null),
actions ? h('div', { class: 'card-actions' }, actions) : null));
}
if (body != null) el.appendChild(h('div', { class: 'card-body' }, body));
if (detail != null) {
const _og = h('div', { class: ['card-detail', open && 'open'] }, detail);
const more = h('button', { type: 'button', class: 'card-more', 'aria-expanded': open ? 'true' : 'false' }, open ? t('common.less') : t('common.more'));
more.addEventListener('click', () => {
const _o12 = _og.classList.toggle('open');
more.textContent = _o12 ? t('common.less') : t('common.more');
more.setAttribute('aria-expanded', _o12 ? 'true' : 'false');
});
el.appendChild(_og); el.appendChild(more);
}
return el;
}
export function list(items, renderRow, { empty: emptyText, onClick, cls } = {}) {
if (!items || !items.length) return empty(emptyText);
const _o1z = h('ul', { class: ['list', cls] });
items.forEach((it, i) => {
const content = renderRow ? renderRow(it, i) : String(it);
const _oy = h('li', { class: ['row', onClick && 'row-click'] }, content);
if (onClick) {
_oy.tabIndex = 0; _oy.setAttribute('role', 'button');
_oy.addEventListener('click', () => onClick(it, i, _oy));
_oy.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(it, i, _oy); } });
}
_o1z.appendChild(_oy);
});
return _o1z;
}
export function kv(pairs) {
return h('dl', { class: 'kv' }, pairs.filter(Boolean).map(([k, _o20]) => [h('dt', null, k), h('dd', null, _o20 == null || _o20 === '' ? '—' : _o20)]));
}
let _om = 0;
export function field({ label, type = 'text', value, options, help: helpKey, name, placeholder, onInput, onChange, required, min, max, step, rows, accept, autocomplete, inputmode, hint, id, disabled } = {}) {
const _on = id || 'f' + (++_om);
let _oe;
if (type === 'textarea') {
_oe = h('textarea', { id: _on, name, placeholder, rows: rows || 4, required, disabled });
_oe.value = value ?? '';
} else if (type === 'select') {
_oe = h('select', { id: _on, name, required, disabled },
(options || []).map((_o12) => {
const _o18 = typeof _o12 === 'object' ? _o12.value : _o12;
const _o13 = typeof _o12 === 'object' ? _o12.label : _o12;
return h('option', { value: _o18, selected: String(_o18) === String(value) }, _o13);
}));
} else if (type === 'checkbox' || type === 'toggle') {
_oe = h('input', { id: _on, name, type: 'checkbox', class: 'switch', role: 'switch', checked: !!value, disabled });
} else {
_oe = h('input', { id: _on, name, type, placeholder, required, min, max, step, accept, autocomplete, inputmode, disabled });
if (value != null && type !== 'file') _oe.value = value;
}
if (onInput) _oe.addEventListener('input', (e) => onInput(_op(), e));
if (onChange) _oe.addEventListener('change', (e) => onChange(_op(), e));
function _op() {
if (_oe.type === 'checkbox') return _oe.checked;
if (_oe.type === 'number' || _oe.type === 'range') return _oe.value === '' ? null : Number(_oe.value);
if (_oe.type === 'file') return _oe.files;
return _oe.value;
}
const _ou = type === 'checkbox' || type === 'toggle';
const _ow = label ? h('label', { for: _on, class: 'field-label' }, label, helpKey ? help(helpKey, label) : null) : null;
const _o22 = h('div', { class: ['field', _ou && 'field-toggle', 'field-' + type] },
_ou ? [_ow, _oe] : [_ow, _oe],
hint ? h('p', { class: 'field-hint' }, hint) : null);
_o22.input = _oe;
_o22.getValue = _op;
_o22.setValue = (_o20) => { if (_oe.type === 'checkbox') _oe.checked = !!_o20; else _oe.value = _o20 ?? ''; };
return _o22;
}
export function segmented(options, value, onChange, { label, name } = {}) {
const _o22 = h('div', { class: 'seg', role: 'radiogroup', 'aria-label': label || '', dataset: { name: name || '' } });
const set = (_o20) => {
value = _o20;
for (const _ob of _o22.children) {
const _o15 = _ob.dataset.value === String(_o20);
_ob.classList.toggle('on', _o15); _ob.setAttribute('aria-checked', _o15 ? 'true' : 'false');
}
};
for (const _o12 of options) {
const _o18 = typeof _o12 === 'object' ? _o12.value : _o12;
const _ob = h('button', { type: 'button', role: 'radio', class: 'seg-btn', dataset: { value: String(_o18) } },
typeof _o12 === 'object' && _o12.icon ? glyph(_o12.icon, 16) : null, typeof _o12 === 'object' && _o12.icon ? ' ' : null, typeof _o12 === 'object' ? _o12.label : _o12);
_ob.addEventListener('click', () => { if (String(value) !== String(_o18)) { set(_o18); onChange && onChange(_o18); } });
_o22.appendChild(_ob);
}
set(value);
_o22.setValue = set;
return _o22;
}
export async function copy(text, { silent } = {}) {
let ok = false;
try { await navigator.clipboard.writeText(String(text)); ok = true; } catch {
try {
const _o1n = h('textarea', { class: 'sr-only' }); _o1n.value = String(text);
document.body.appendChild(_o1n); _o1n.select(); ok = document.execCommand('copy'); _o1n.remove();
} catch { ok = false; }
}
if (!silent) toast(ok ? t('common.copied') : t('err.generic'), ok ? 'ok' : 'warn');
return ok;
}
let _of = null;
let _o19 = 0, ownPop = false;
if (typeof window !== 'undefined' && window.addEventListener) {
window.addEventListener('popstate', () => {
ownPop = _o19 > 0; if (ownPop) { _o19--; return; }
const _o1s = [...modalStack].reverse().find((m) => m.pushed);
if (_o1s && _o1s.el.isConnected) { ownPop = true; _o1s.onPop(); }
});
const _o21 = window.visualViewport;
if (_o21 && document.documentElement) {
const _o1g = document.documentElement;
const _o1l = () => {
if (Math.abs(_o21.scale - 1) > 0.01) return;
const _ov = Math.max(0, window.innerHeight - _o21.height - _o21.offsetTop);
const open = _ov > 80, was = _o1g.classList.contains('kb-open');
_o1g.classList.toggle('kb-open', open);
const _o7 = document.activeElement;
if (open && !was && _o7 && /^(INPUT|TEXTAREA|SELECT)$/.test(_o7.tagName)) requestAnimationFrame(() => { try { _o7.scrollIntoView({ block: 'center' }); } catch { } });
_o1g.style.setProperty('--vvh', Math.round(_o21.height) + 'px');
_o1g.style.setProperty('--vvt', Math.round(_o21.offsetTop) + 'px');
};
_o21.addEventListener('resize', _o1l); _o21.addEventListener('scroll', _o1l);
}
}
export const isWide = () => typeof matchMedia !== 'undefined' && matchMedia('(min-width: 900px)').matches;
export function sheet(arg1, arg2) {
const _o12 = (arg1 && typeof arg1 === 'object' && !(arg1 instanceof Node)) ? arg1 : { title: arg1, body: arg2 };
const { title, body, actions, onClose } = _o12;
if (_of) _of.close(true);
const wide = isWide();
const host = wide ? document.getElementById('detail') : document.body;
let _od = false, pushed = false;
const _oc = h('div', { class: 'sheet-body' }, body);
const backBtn = button('', () => _o1b(), { kind: 'ghost', icon: wide ? 'close' : 'back', title: t('common.back'), cls: 'sheet-back' });
const el = h('aside', { class: ['sheet', wide ? 'sheet-col' : 'sheet-page'], role: wide ? 'complementary' : 'dialog', 'aria-label': title || '' },
h('header', { class: 'sheet-head' }, backBtn, h('h2', { class: 'sheet-title' }, title || ''), actions ? h('div', { class: 'sheet-actions' }, actions) : null),
_oc);
function close(replacing) {
if (_od) return; _od = true;
el.classList.remove('in');
const _o1g = document.getElementById('app');
if (wide && _o1g && !replacing) _o1g.classList.remove('has-sheet');
setTimeout(() => el.remove(), replacing ? 0 : 240);
if (pushed && !replacing) _o1i(0);
window.removeEventListener('popstate', onPop);
document.removeEventListener('keydown', _o16);
if (_of === _o8) _of = null;
try { onClose && onClose(); } catch { }
}
const _o1y = _o1t(el);
const _ot = wide ? () => false : _o1y;
function _o1b() { if (!_ot()) return close(); confirmLeave().then((yes) => { if (yes && !_od) close(); }); }
function onPop() {
if (ownPop) return;
if (_od) return;
pushed = false;
if (!_ot()) return close();
try { history.pushState({ bdsSheet: 1 }, ''); pushed = true; } catch { }
_o1b();
}
function _o16(e) {
if (e.key !== 'Escape' || e.defaultPrevented || e.isComposing) return;
const _o1p = e.target, typing = !!_o1p && _o1p.nodeType === 1 && (_o1p.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(_o1p.tagName));
if (!typing || el.contains(_o1p)) close();
}
document.addEventListener('keydown', _o16);
if (wide && host) {
clear(host); host.appendChild(el);
document.getElementById('app')?.classList.add('has-sheet');
} else {
document.body.appendChild(el);
try { history.pushState({ bdsSheet: 1 }, ''); pushed = true; } catch { }
window.addEventListener('popstate', onPop);
_oj(el, () => _o1b());
}
requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
const _o8 = { el, body: _oc, close: () => close(), setBody: (...c) => mountTo(_oc, ...c), dirty: () => !_od && el.isConnected && _o1y() };
_of = _o8;
return _o8;
}
export function closeSheet() { if (_of) _of.close(); }
export function sheetDirty() { try { return !!(_of && _of.dirty && _of.dirty()); } catch { return false; } }
function _o1i(n) {
try {
const _o1j = history.state;
if (_o1j && _o1j.bdsSheet) { _o19++; history.back(); return; }
if (_o1j && _o1j.bdsModal && n < 40) setTimeout(() => _o1i(n + 1), 25);
} catch { }
}
export function afterSheetBack(fn) {
if (!(_o19 > 0) || typeof window === 'undefined') return fn();
let done = false;
const _oq = () => { if (done) return; done = true; window.removeEventListener('popstate', _oq); setTimeout(fn, 0); };
window.addEventListener('popstate', _oq);
setTimeout(_oq, 400);
}
function _oj(el, onClose) {
let _o24 = null, _o25 = 0, dx = 0, horiz = null;
el.addEventListener('touchstart', (e) => {
const _o1o = e.touches[0]; _o24 = _o1o.clientX; _o25 = _o1o.clientY; dx = 0; horiz = null;
}, { passive: true });
el.addEventListener('touchmove', (e) => {
if (_o24 == null) return;
const _o1o = e.touches[0]; dx = _o1o.clientX - _o24; const _oi = _o1o.clientY - _o25;
if (horiz == null && (Math.abs(dx) > 8 || Math.abs(_oi) > 8)) horiz = Math.abs(dx) > Math.abs(_oi) * 1.3 && dx > 0;
if (horiz) { el.style.transition = 'none'; el.style.transform = 'translateX(' + Math.max(0, dx) + 'px)'; }
}, { passive: true });
el.addEventListener('touchend', () => {
el.style.transition = ''; el.style.transform = '';
if (horiz && dx > 90) onClose();
_o24 = null;
});
}
export function section(title, ...children) {
return h('div', { class: 'section' }, title ? h('h4', { class: 'section-title' }, title) : null, ...children);
}
export function table(rows, cols) {
return h('div', { class: 'table-wrap' }, h('table', { class: 'table' },
h('thead', null, h('tr', null, cols.map((c) => h('th', { class: c.num ? 'num' : '' }, c.label)))),
h('tbody', null, rows.map((_o1d) => h('tr', null, cols.map((c) => h('td', { class: c.num ? 'num' : '' }, c.render ? c.render(_o1d) : _o1d[c.key])))))));
}
export function status(ok, text) {
return h('span', { class: ['st', ok === true ? 'st-ok' : ok === false ? 'st-bad' : 'st-wait'] },
ok === true ? '✓' : ok === false ? '✗' : '…', text ? h('span', null, ' ' + text) : null);
}
export function getDensity() { return document.body.dataset.density || 'compact'; }
export const ui = {
h, clear, mountTo, icon, glyph, button, badge, empty, progress, spinner, money, num, date, toast, clearToasts, modal, confirm,
help, helpText, paragraphs, card, list, kv, field, segmented, copy, sheet, closeSheet, sheetDirty, confirmLeave, isWide, section, table, status, getDensity
};
export default ui;
export { friendlyError, errorText } from './friendly_error.a1be44bf9a.js';

import { t } from './i18n.39c909b69c.js';
import { friendlyError } from './friendly_error.9704b81308.js';
import { helpDocLink, helpPageForKey } from './help_links.338ed991a5.js';
const _o3 = 'http://www.w3.org/2000/svg';
export function h(tag, attrs, ...children) {
const el = document.createElement(tag);
if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) {
children.unshift(attrs); attrs = null;
}
if (attrs) _o9(el, attrs);
_o8(el, children);
return el;
}
function _o9(el, attrs) {
for (const [k, _o1s] of Object.entries(attrs)) {
if (_o1s == null || _o1s === false) continue;
if (k === 'class' || k === 'className') el.className = Array.isArray(_o1s) ? _o1s.filter(Boolean).join(' ') : _o1s;
else if (k === 'style') {
if (typeof _o1s === 'string') el.style.cssText = _o1s;
else for (const [sk, sv] of Object.entries(_o1s)) {
if (sk.startsWith('--')) el.style.setProperty(sk, sv); else el.style[sk] = sv;
}
} else if (k === 'dataset') Object.assign(el.dataset, _o1s);
else if (k.startsWith('on') && typeof _o1s === 'function') el.addEventListener(k.slice(2).toLowerCase(), _o1s);
else if (k === 'text') el.textContent = _o1s;
else if (k in el && typeof _o1s !== 'string' && k !== 'list') { try { el[k] = _o1s; } catch { el.setAttribute(k, _o1s); } }
else if (_o1s === true) el.setAttribute(k, '');
else el.setAttribute(k, String(_o1s));
}
}
function _o8(el, children) {
for (const c of children.flat(Infinity)) {
if (c == null || c === false || c === true) continue;
el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
}
}
export function dropEmpty(list) { return list.filter((c) => c != null && c !== false); }
export function installDomGuard(_o1c = typeof globalThis !== 'undefined' ? globalThis : null) {
if (!_o1c) return false;
for (const name of ['Element', 'DocumentFragment', 'Document']) {
const C = _o1c[name];
if (!C || !C.prototype) continue;
for (const m of ['append', 'prepend', 'replaceChildren']) {
const _o14 = C.prototype[m];
if (typeof _o14 !== 'function' || _o14.__dropsEmpty) continue;
const _o1v = function (...kids) { return _o14.apply(this, dropEmpty(kids)); };
_o1v.__dropsEmpty = true;
try { Object.defineProperty(C.prototype, m, { value: _o1v, writable: true, configurable: true }); } catch { }
}
}
return true;
}
installDomGuard();
export function clear(el) { while (el && el.firstChild) el.removeChild(el.firstChild); return el; }
export function mountTo(el, ...children) { clear(el); _o8(el, children); return el; }
const _o2 = {
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
filter: 'M4 5h16l-6 7.5V19l-4 1.5v-8z'
};
export function icon(name, size = 22, cls = '') {
const _o1g = document.createElementNS(_o3, 'svg');
_o1g.setAttribute('viewBox', '0 0 24 24');
_o1g.setAttribute('width', size); _o1g.setAttribute('height', size);
_o1g.setAttribute('fill', 'none'); _o1g.setAttribute('stroke', 'currentColor');
_o1g.setAttribute('stroke-width', '1.7'); _o1g.setAttribute('stroke-linecap', 'round');
_o1g.setAttribute('stroke-linejoin', 'round'); _o1g.setAttribute('aria-hidden', 'true');
_o1g.setAttribute('class', ('ico ' + cls).trim());
const _o17 = document.createElementNS(_o3, 'path');
_o17.setAttribute('d', _o2[name] || _o2.sparkle);
_o1g.appendChild(_o17);
return _o1g;
}
export const iconNames = Object.keys(_o2);
export function glyph(_o1s, size = 24) {
if (_o1s && _o2[_o1s]) return icon(_o1s, size);
return h('span', { class: 'emoji', 'aria-hidden': 'true' }, _o1s || '✦');
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
[/^(xem|mở)/i, 'next']
];
export function autoIcon(label, cls) {
const _o1d = String(label || '').trim();
if (!_o1d || /chip/.test(String(cls || '')) || /^(\p{Extended_Pictographic}|[✓✔✖✕✗←→↻⟳＋+⚙↩])/u.test(_o1d)) return undefined;
for (const [re, name] of _o0) if (re.test(_o1d)) return name;
return undefined;
}
export function button(label, onClick, opts = {}) {
const { kind = 'secondary', type = 'button', title, disabled, small, block, id, cls, testid } = opts;
const _oq = opts.icon === false ? undefined : opts.icon || (typeof label === 'string' ? autoIcon(label, cls) : undefined);
const _oa = h('button', {
type, id, title, disabled, 'data-testid': testid,
class: ['btn', 'btn-' + kind, small && 'btn-sm', block && 'btn-block', !label && 'btn-icon', cls]
});
if (_oq) _oa.appendChild(typeof _oq === 'string' && _o2[_oq] ? icon(_oq, small ? 18 : 20) : glyph(_oq, 18));
if (label) _oa.appendChild(h('span', null, label));
if (!label && title) _oa.setAttribute('aria-label', title);
if (onClick) _oa.addEventListener('click', async (e) => {
if (_oa.dataset.busy) return;
const _o19 = onClick(e);
if (_o19 && typeof _o19.then === 'function') {
_oa.dataset.busy = '1'; _oa.classList.add('is-busy');
try { await _o19; } catch (err) { _o1a(err); } finally { delete _oa.dataset.busy; _oa.classList.remove('is-busy'); }
}
});
return _oa;
}
function _o1a(err) {
const _ok = friendlyError(err, { online: typeof navigator !== 'undefined' ? navigator.onLine : undefined });
toast(_ok.message || t('err.generic'), 'error', _ok.detail ? 6000 : 3200, { detail: _ok.detail });
try { window.dispatchEvent(new CustomEvent('bds:error', { detail: { level: 'warn', where: 'ui.button', message: String(err && err.message || err), detail: err && err.stack } })); } catch { }
}
export function badge(text, tone = 'neutral') { return h('span', { class: 'badge badge-' + tone }, text); }
export function empty(text, _oq = 'sparkle') {
return h('div', { class: 'empty' }, h('div', { class: 'empty-ico' }, icon(_oq, 28)), h('p', null, text || t('common.empty')));
}
export function progress(pct, label) {
const _o17 = Math.max(0, Math.min(100, Number(pct) || 0));
return h('div', { class: 'progress', role: 'progressbar', 'aria-valuenow': _o17, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': label || (_o17 + '%') },
h('div', { class: 'progress-bar', style: { width: _o17 + '%' } }));
}
export function spinner() { return h('span', { class: 'spinner', 'aria-hidden': 'true' }); }
export function money(n) {
const L = typeof window !== 'undefined' && window.BDSLogic;
if (L && L.fmt && typeof L.fmt.money === 'function') { try { return L.fmt.money(n); } catch { } }
const _o1s = Number(n) || 0;
if (Math.abs(_o1s) >= 1e9) return (_o1s / 1e9).toFixed(2).replace('.', ',') + ' tỷ';
return Math.round(_o1s / 1e6).toLocaleString('vi-VN') + ' triệu';
}
export function num(n, _of = 0) { return (Number(n) || 0).toLocaleString('vi-VN', { maximumFractionDigits: _of, minimumFractionDigits: _of }); }
export function date(ms, withTime = false) {
if (!ms) return '';
const _of = new Date(Number(ms));
const _o17 = (x) => String(x).padStart(2, '0');
const _o1d = _o17(_of.getDate()) + '/' + _o17(_of.getMonth() + 1) + '/' + _of.getFullYear();
return withTime ? _o1d + ' ' + _o17(_of.getHours()) + ':' + _o17(_of.getMinutes()) : _o1d;
}
const _o4 = 3;
const isPhone = () => { try { return typeof matchMedia === 'function' && matchMedia('(max-width: 639px)').matches; } catch { return false; } };
const _oy = () => modalStack.length > 0 || (typeof document !== 'undefined' && !!document.querySelector('.modal-back.in'));
function _o1m() {
let el = document.getElementById('toasts');
if (!el) {
el = h('div', { id: 'toasts', class: 'toasts', 'aria-live': 'polite', role: 'status' }); document.body.appendChild(el);
try { window.addEventListener('hashchange', () => clearToasts({ olderThan: 600 })); } catch { }
}
return el;
}
function _og(el) { clearTimeout(el._tt); el.classList.remove('in'); el.remove(); }
function _o1p(host) {
const max = (isPhone() || _oy()) ? 1 : _o4;
while (host.children.length > max) _og(host.firstChild);
}
export function clearToasts({ olderThan = 0 } = {}) {
const host = typeof document !== 'undefined' && document.getElementById('toasts');
if (!host) return;
const now = Date.now();
for (const el of [...host.children]) if (now - (Number(el.dataset.at) || 0) >= olderThan) _og(el);
}
export function toast(text, kind = 'info', ms = 3200, opts = {}) {
if (kind === 'success') kind = 'ok';
if (kind === 'danger') kind = 'error';
const host = _o1m();
const key = kind + '|' + String(text);
for (const _o11 of [...host.children]) if (_o11.dataset.key === key) _og(_o11);
const _or = { ok: 'check', error: 'x', warn: 'help', info: 'sparkle' }[kind] || 'sparkle';
const detail = opts && opts.detail ? h('details', { class: 'toast-detail small', 'data-testid': 'toast-detail' }, h('summary', null, 'Chi tiết kỹ thuật'), h('code', null, String(opts.detail))) : null;
const el = h('div', { class: 'toast toast-' + kind, dataset: { key, at: String(Date.now()) } }, icon(_or, 18), detail ? h('span', null, h('span', null, text), detail) : h('span', null, text));
host.appendChild(el);
_o1p(host);
el.addEventListener('click', (e) => { if (!(e.target && e.target.closest && e.target.closest('details'))) _og(el); });
requestAnimationFrame(() => el.classList.add('in'));
el._tt = setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 260); }, ms);
return el;
}
function _o1i() {
if (typeof document === 'undefined') return;
const _o12 = modalStack.length > 0;
document.documentElement.classList.toggle('modal-open', _o12);
const host = document.getElementById('toasts');
if (_o12 && host) _o1p(host);
}
let modalStack = [];
export function modal({ title, body, actions, onClose, wide, dismissible = true, cls } = {}) {
const _o18 = document.activeElement;
let _o1b; const done = new Promise((_o19) => { _o1b = _o19; });
const close = (value) => {
if (!back.isConnected) return;
back.classList.remove('in');
modalStack = modalStack.filter((m) => m !== _o7);
_o1i();
setTimeout(() => back.remove(), 200);
_ox(_o7);
document.removeEventListener('keydown', onKey, true);
try { onClose && onClose(value); } catch { }
_o1b(value);
if (_o18 && _o18.focus) try { _o18.focus(); } catch { }
};
const foot = h('div', { class: 'modal-foot' });
for (const _o5 of actions || []) {
foot.appendChild(button(_o5.label, async (e) => {
const _o19 = _o5.onClick ? await _o5.onClick(close, e) : undefined;
if (_o19 !== false && _o5.close !== false) close(_o5.value !== undefined ? _o5.value : _o19);
}, { kind: _o5.kind || 'secondary', icon: actionIcon(_o5), id: _o5.id }));
}
const head = h('div', { class: 'modal-head' },
h('h2', { class: 'modal-title', id: 'mt' + Date.now() }, title || ''),
dismissible ? button('', () => close(undefined), { kind: 'ghost', icon: 'close', title: t('common.close'), cls: 'modal-x' }) : null);
const box = h('div', { class: ['modal', wide && 'modal-wide', cls], role: 'dialog', 'aria-modal': 'true', 'aria-label': title || '' },
head, h('div', { class: 'modal-body' }, body), (actions && actions.length) ? foot : null);
const back = h('div', { class: 'modal-back' }, box);
if (dismissible) back.addEventListener('mousedown', (e) => { if (e.target === back) close(undefined); });
const onKey = (e) => {
if (modalStack[modalStack.length - 1] !== _o7) return;
if (e.key === 'Escape' && dismissible) { e.stopPropagation(); close(undefined); }
if (e.key === 'Tab') _o1o(box, e);
};
document.addEventListener('keydown', onKey, true);
document.body.appendChild(back);
requestAnimationFrame(() => {
back.classList.add('in');
if (box.contains(document.activeElement)) return;
const _ok = box.querySelector('input,textarea,select') || box.querySelector('.modal-foot .btn-primary') || box.querySelector('button');
if (_ok) try { _ok.focus({ preventScroll: true }); } catch { }
});
const _o7 = { el: box, close, done };
modalStack.push(_o7);
_o1i();
if (dismissible && !isWide()) {
_o7.histId = ++_ow;
try { history.pushState({ bdsModal: _o7.histId }, ''); _o7.pushed = true; } catch { _o7.pushed = false; }
_o7.onPop = () => { _o7.pushed = false; close(undefined); };
_oj(box, head, () => close(undefined));
}
return _o7;
}
let _ow = 0;
function _ox(_o7) {
if (!_o7 || !_o7.pushed) return;
_o7.pushed = false;
const _o1q = (n) => {
try {
const _o1f = history.state;
if (_o1f && _o1f.bdsModal === _o7.histId) { _o16++; history.back(); return; }
if (_o1f && Number(_o1f.bdsModal) > _o7.histId && _o16 > 0 && n < 40) setTimeout(() => _o1q(n + 1), 25);
} catch { }
};
setTimeout(() => _o1q(0), 0);
}
function _oj(box, handle, onClose) {
let _o1x = null, _oh = 0;
handle.addEventListener('touchstart', (e) => { _o1x = e.touches[0].clientY; _oh = 0; }, { passive: true });
handle.addEventListener('touchmove', (e) => {
if (_o1x == null) return;
_oh = Math.max(0, e.touches[0].clientY - _o1x);
box.style.transition = 'none'; box.style.transform = 'translateY(' + _oh + 'px)';
}, { passive: true });
handle.addEventListener('touchend', () => { box.style.transition = ''; box.style.transform = ''; if (_o1x != null && _oh > 90) onClose(); _o1x = null; });
}
const _o1 = /^(huỷ|hủy|đóng|để sau|thôi|bỏ qua|không|quay lại)/i;
export function actionIcon(_o5) {
if (!_o5 || _o5.icon === false) return undefined;
if (_o5.icon) return _o5.icon;
const label = String(_o5.label || '').trim();
if (!label || /^(\p{Extended_Pictographic}|[✓✔✖✕✗←→↻⟳＋+⚙↩])/u.test(label)) return undefined;
return _o5.value === false || _o1.test(label) ? 'close' : (autoIcon(label) || 'check');
}
function _o1o(box, e) {
const _ok = [...box.querySelectorAll('button,input,select,textarea,a[href],[tabindex]:not([tabindex="-1"])')].filter((x) => !x.disabled && x.offsetParent !== null);
if (!_ok.length) return;
const _on = _ok[0], last = _ok[_ok.length - 1];
if (e.shiftKey && document.activeElement === _on) { e.preventDefault(); last.focus(); }
else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); _on.focus(); }
}
export function confirm(text, { ok = t('common.ok'), kind = 'primary', title } = {}) {
return modal({
title: title || t('common.help'), body: h('p', { class: 'lead' }, text),
actions: [{ label: t('common.cancel'), kind: 'ghost', value: false }, { label: ok, kind, value: true, id: 'confirm-ok' }]
}).done.then((_o1s) => _o1s === true);
}
export function helpText(key) {
const _o1d = t('help.' + key);
return _o1d === 'help.' + key ? '' : _o1d;
}
export function paragraphs(text) {
return h('div', { class: 'prose' }, String(text || '').split(/\n+/).map((line) => h('p', null, line)));
}
export function help(key, title) {
const _oa = h('button', { type: 'button', class: 'help-btn', 'aria-label': t('common.help'), title: t('common.help'), dataset: { help: key } }, icon('help', 18));
_oa.addEventListener('click', (e) => {
e.stopPropagation(); e.preventDefault();
modal({ title: title || t('common.help'), body: h('div', null, paragraphs(helpText(key) || t('common.empty')), helpDocLink(h, helpPageForKey(key))), actions: [{ label: t('common.close'), kind: 'primary' }] });
});
return _oa;
}
export function card({ title, subtitle, icon: _oq, actions, body, detail, tone, cls, id, open } = {}) {
const el = h('section', { class: ['card', tone && 'card-' + tone, cls], id });
if (title || actions) {
el.appendChild(h('header', { class: 'card-head' },
_oq ? h('div', { class: 'card-ico' }, glyph(_oq, 20)) : null,
h('div', { class: 'card-titles' },
title ? h('h3', { class: 'card-title' }, title) : null,
subtitle ? h('p', { class: 'card-sub' }, subtitle) : null),
actions ? h('div', { class: 'card-actions' }, actions) : null));
}
if (body != null) el.appendChild(h('div', { class: 'card-body' }, body));
if (detail != null) {
const _of = h('div', { class: ['card-detail', open && 'open'] }, detail);
const more = h('button', { type: 'button', class: 'card-more', 'aria-expanded': open ? 'true' : 'false' }, open ? t('common.less') : t('common.more'));
more.addEventListener('click', () => {
const _oz = _of.classList.toggle('open');
more.textContent = _oz ? t('common.less') : t('common.more');
more.setAttribute('aria-expanded', _oz ? 'true' : 'false');
});
el.appendChild(_of); el.appendChild(more);
}
return el;
}
export function list(items, renderRow, { empty: emptyText, onClick, cls } = {}) {
if (!items || !items.length) return empty(emptyText);
const _o1r = h('ul', { class: ['list', cls] });
items.forEach((it, i) => {
const content = renderRow ? renderRow(it, i) : String(it);
const _ov = h('li', { class: ['row', onClick && 'row-click'] }, content);
if (onClick) {
_ov.tabIndex = 0; _ov.setAttribute('role', 'button');
_ov.addEventListener('click', () => onClick(it, i, _ov));
_ov.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(it, i, _ov); } });
}
_o1r.appendChild(_ov);
});
return _o1r;
}
export function kv(pairs) {
return h('dl', { class: 'kv' }, pairs.filter(Boolean).map(([k, _o1s]) => [h('dt', null, k), h('dd', null, _o1s == null || _o1s === '' ? '—' : _o1s)]));
}
let _ol = 0;
export function field({ label, type = 'text', value, options, help: helpKey, name, placeholder, onInput, onChange, required, min, max, step, rows, accept, autocomplete, inputmode, hint, id, disabled } = {}) {
const _om = id || 'f' + (++_ol);
let _od;
if (type === 'textarea') {
_od = h('textarea', { id: _om, name, placeholder, rows: rows || 4, required, disabled });
_od.value = value ?? '';
} else if (type === 'select') {
_od = h('select', { id: _om, name, required, disabled },
(options || []).map((_oz) => {
const _o15 = typeof _oz === 'object' ? _oz.value : _oz;
const _o10 = typeof _oz === 'object' ? _oz.label : _oz;
return h('option', { value: _o15, selected: String(_o15) === String(value) }, _o10);
}));
} else if (type === 'checkbox' || type === 'toggle') {
_od = h('input', { id: _om, name, type: 'checkbox', class: 'switch', role: 'switch', checked: !!value, disabled });
} else {
_od = h('input', { id: _om, name, type, placeholder, required, min, max, step, accept, autocomplete, inputmode, disabled });
if (value != null && type !== 'file') _od.value = value;
}
if (onInput) _od.addEventListener('input', (e) => onInput(_oo(), e));
if (onChange) _od.addEventListener('change', (e) => onChange(_oo(), e));
function _oo() {
if (_od.type === 'checkbox') return _od.checked;
if (_od.type === 'number' || _od.type === 'range') return _od.value === '' ? null : Number(_od.value);
if (_od.type === 'file') return _od.files;
return _od.value;
}
const _os = type === 'checkbox' || type === 'toggle';
const _ou = label ? h('label', { for: _om, class: 'field-label' }, label, helpKey ? help(helpKey, label) : null) : null;
const _o1u = h('div', { class: ['field', _os && 'field-toggle', 'field-' + type] },
_os ? [_ou, _od] : [_ou, _od],
hint ? h('p', { class: 'field-hint' }, hint) : null);
_o1u.input = _od;
_o1u.getValue = _oo;
_o1u.setValue = (_o1s) => { if (_od.type === 'checkbox') _od.checked = !!_o1s; else _od.value = _o1s ?? ''; };
return _o1u;
}
export function segmented(options, value, onChange, { label, name } = {}) {
const _o1u = h('div', { class: 'seg', role: 'radiogroup', 'aria-label': label || '', dataset: { name: name || '' } });
const set = (_o1s) => {
value = _o1s;
for (const _oa of _o1u.children) {
const _o12 = _oa.dataset.value === String(_o1s);
_oa.classList.toggle('on', _o12); _oa.setAttribute('aria-checked', _o12 ? 'true' : 'false');
}
};
for (const _oz of options) {
const _o15 = typeof _oz === 'object' ? _oz.value : _oz;
const _oa = h('button', { type: 'button', role: 'radio', class: 'seg-btn', dataset: { value: String(_o15) } },
typeof _oz === 'object' && _oz.icon ? glyph(_oz.icon, 16) : null, typeof _oz === 'object' && _oz.icon ? ' ' : null, typeof _oz === 'object' ? _oz.label : _oz);
_oa.addEventListener('click', () => { if (String(value) !== String(_o15)) { set(_o15); onChange && onChange(_o15); } });
_o1u.appendChild(_oa);
}
set(value);
_o1u.setValue = set;
return _o1u;
}
export async function copy(text, { silent } = {}) {
let ok = false;
try { await navigator.clipboard.writeText(String(text)); ok = true; } catch {
try {
const _o1j = h('textarea', { class: 'sr-only' }); _o1j.value = String(text);
document.body.appendChild(_o1j); _o1j.select(); ok = document.execCommand('copy'); _o1j.remove();
} catch { ok = false; }
}
if (!silent) toast(ok ? t('common.copied') : t('err.generic'), ok ? 'ok' : 'warn');
return ok;
}
let _oe = null;
let _o16 = 0, ownPop = false;
if (typeof window !== 'undefined' && window.addEventListener) {
window.addEventListener('popstate', () => {
ownPop = _o16 > 0; if (ownPop) { _o16--; return; }
const _o1n = [...modalStack].reverse().find((m) => m.pushed);
if (_o1n && _o1n.el.isConnected) { ownPop = true; _o1n.onPop(); }
});
const _o1t = window.visualViewport;
if (_o1t && document.documentElement) {
const _o1c = document.documentElement;
const _o1h = () => {
if (Math.abs(_o1t.scale - 1) > 0.01) return;
const _ot = Math.max(0, window.innerHeight - _o1t.height - _o1t.offsetTop);
const open = _ot > 80, was = _o1c.classList.contains('kb-open');
_o1c.classList.toggle('kb-open', open);
const _o6 = document.activeElement;
if (open && !was && _o6 && /^(INPUT|TEXTAREA|SELECT)$/.test(_o6.tagName)) requestAnimationFrame(() => { try { _o6.scrollIntoView({ block: 'center' }); } catch { } });
_o1c.style.setProperty('--vvh', Math.round(_o1t.height) + 'px');
_o1c.style.setProperty('--vvt', Math.round(_o1t.offsetTop) + 'px');
};
_o1t.addEventListener('resize', _o1h); _o1t.addEventListener('scroll', _o1h);
}
}
export const isWide = () => typeof matchMedia !== 'undefined' && matchMedia('(min-width: 900px)').matches;
export function sheet(arg1, arg2) {
const _oz = (arg1 && typeof arg1 === 'object' && !(arg1 instanceof Node)) ? arg1 : { title: arg1, body: arg2 };
const { title, body, actions, onClose } = _oz;
if (_oe) _oe.close(true);
const wide = isWide();
const host = wide ? document.getElementById('detail') : document.body;
let _oc = false, pushed = false;
const _ob = h('div', { class: 'sheet-body' }, body);
const backBtn = button('', () => close(), { kind: 'ghost', icon: wide ? 'close' : 'back', title: t('common.back'), cls: 'sheet-back' });
const el = h('aside', { class: ['sheet', wide ? 'sheet-col' : 'sheet-page'], role: wide ? 'complementary' : 'dialog', 'aria-label': title || '' },
h('header', { class: 'sheet-head' }, backBtn, h('h2', { class: 'sheet-title' }, title || ''), actions ? h('div', { class: 'sheet-actions' }, actions) : null),
_ob);
function close(replacing) {
if (_oc) return; _oc = true;
el.classList.remove('in');
const _o1c = document.getElementById('app');
if (wide && _o1c && !replacing) _o1c.classList.remove('has-sheet');
setTimeout(() => el.remove(), replacing ? 0 : 240);
if (pushed && !replacing) _o1e(0);
window.removeEventListener('popstate', onPop);
document.removeEventListener('keydown', _o13);
if (_oe === _o7) _oe = null;
try { onClose && onClose(); } catch { }
}
function onPop() { if (ownPop) return; if (!_oc) { pushed = false; close(); } }
function _o13(e) {
if (e.key !== 'Escape' || e.defaultPrevented || e.isComposing) return;
const _o1l = e.target, typing = !!_o1l && _o1l.nodeType === 1 && (_o1l.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(_o1l.tagName));
if (!typing || el.contains(_o1l)) close();
}
document.addEventListener('keydown', _o13);
if (wide && host) {
clear(host); host.appendChild(el);
document.getElementById('app')?.classList.add('has-sheet');
} else {
document.body.appendChild(el);
try { history.pushState({ bdsSheet: 1 }, ''); pushed = true; } catch { }
window.addEventListener('popstate', onPop);
_oi(el, () => close());
}
requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('in')));
const _o7 = { el, body: _ob, close: () => close(), setBody: (...c) => mountTo(_ob, ...c) };
_oe = _o7;
return _o7;
}
export function closeSheet() { if (_oe) _oe.close(); }
function _o1e(n) {
try {
const _o1f = history.state;
if (_o1f && _o1f.bdsSheet) { _o16++; history.back(); return; }
if (_o1f && _o1f.bdsModal && n < 40) setTimeout(() => _o1e(n + 1), 25);
} catch { }
}
export function afterSheetBack(fn) {
if (!(_o16 > 0) || typeof window === 'undefined') return fn();
let done = false;
const _op = () => { if (done) return; done = true; window.removeEventListener('popstate', _op); setTimeout(fn, 0); };
window.addEventListener('popstate', _op);
setTimeout(_op, 400);
}
function _oi(el, onClose) {
let _o1w = null, _o1x = 0, dx = 0, horiz = null;
el.addEventListener('touchstart', (e) => {
const _o1k = e.touches[0]; _o1w = _o1k.clientX; _o1x = _o1k.clientY; dx = 0; horiz = null;
}, { passive: true });
el.addEventListener('touchmove', (e) => {
if (_o1w == null) return;
const _o1k = e.touches[0]; dx = _o1k.clientX - _o1w; const _oh = _o1k.clientY - _o1x;
if (horiz == null && (Math.abs(dx) > 8 || Math.abs(_oh) > 8)) horiz = Math.abs(dx) > Math.abs(_oh) * 1.3 && dx > 0;
if (horiz) { el.style.transition = 'none'; el.style.transform = 'translateX(' + Math.max(0, dx) + 'px)'; }
}, { passive: true });
el.addEventListener('touchend', () => {
el.style.transition = ''; el.style.transform = '';
if (horiz && dx > 90) onClose();
_o1w = null;
});
}
export function section(title, ...children) {
return h('div', { class: 'section' }, title ? h('h4', { class: 'section-title' }, title) : null, ...children);
}
export function table(rows, cols) {
return h('div', { class: 'table-wrap' }, h('table', { class: 'table' },
h('thead', null, h('tr', null, cols.map((c) => h('th', { class: c.num ? 'num' : '' }, c.label)))),
h('tbody', null, rows.map((_o19) => h('tr', null, cols.map((c) => h('td', { class: c.num ? 'num' : '' }, c.render ? c.render(_o19) : _o19[c.key])))))));
}
export function status(ok, text) {
return h('span', { class: ['st', ok === true ? 'st-ok' : ok === false ? 'st-bad' : 'st-wait'] },
ok === true ? '✓' : ok === false ? '✗' : '…', text ? h('span', null, ' ' + text) : null);
}
export function getDensity() { return document.body.dataset.density || 'compact'; }
export const ui = {
h, clear, mountTo, icon, glyph, button, badge, empty, progress, spinner, money, num, date, toast, clearToasts, modal, confirm,
help, helpText, paragraphs, card, list, kv, field, segmented, copy, sheet, closeSheet, isWide, section, table, status, getDensity
};
export default ui;
export { friendlyError, errorText } from './friendly_error.9704b81308.js';

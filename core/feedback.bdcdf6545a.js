import { addDefaults } from './xkit.71d637c634.js';
import * as INST from './instance.ffcba07fb7.js';
import { isSaleEdition, contactFor, mailtoLink, sellerMail, supportDiagnosticText, supportBlock } from './support.71fe59fd73.js';
export const KINDS = [
{ value: 'add', label: 'Thêm chức năng', icon: '➕' },
{ value: 'remove', label: 'Bớt', icon: '➖' },
{ value: 'change', label: 'Sửa', icon: '✏️' },
{ value: 'bug', label: 'Báo lỗi', icon: '🐞' }
];
export const STATUSES = [
{ value: 'new', label: 'Mới', tone: 'info' },
{ value: 'reviewing', label: 'Đang xem', tone: 'warn' },
{ value: 'planned', label: 'Sẽ làm', tone: 'gold' },
{ value: 'done', label: 'Đã làm', tone: 'ok' },
{ value: 'wontfix', label: 'Không làm', tone: 'neutral' }
];
export const MIN_TEXT = 10;
export const MAX_TEXT = 3500;
export const CLAUDE_URL = 'https://claude.ai/new';
export const QUEUE_KEY = 'bds:fb:queue';
const _o4 = 10;
const _o1 = 1600;
const kindLabel = (v) => (KINDS.find((_o1e) => _o1e.value === v) || {}).label || v || '';
export const statusOf = (v) => STATUSES.find((_o2e) => _o2e.value === v) || STATUSES[0];
const _o5 = ['customers', 'inbox', 'home'];
export function validateFeedback({ kind, text } = {}) {
const errors = [];
if (!KINDS.some((_o1e) => _o1e.value === kind)) errors.push('Chọn loại góp ý.');
const _o1q = String(text || '').trim().length;
if (_o1q < MIN_TEXT) errors.push('Mô tả ít nhất ' + MIN_TEXT + ' ký tự (đang có ' + _o1q + ').');
if (_o1q > MAX_TEXT) errors.push('Mô tả tối đa ' + MAX_TEXT + ' ký tự.');
return { ok: !errors.length, errors };
}
export function scrub(text) {
return String(text || '')
.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email đã che]')
.replace(/(?:\+?84|0)(?:[\s.-]?\d){8,10}\b/g, '[số điện thoại đã che]')
.replace(/\b\d{9,}\b/g, '[số đã che]');
}
export function deviceInfo(nav = globalThis.navigator, win = globalThis.window) {
const _o2z = String((nav && nav.userAgent) || '');
const _o1u = /iPhone/.test(_o2z) ? 'iPhone' : /iPad/.test(_o2z) ? 'iPad' : /Android/.test(_o2z) ? 'Android' : /Mac OS X|Macintosh/.test(_o2z) ? 'Mac' : /Windows/.test(_o2z) ? 'Windows' : /Linux/.test(_o2z) ? 'Linux' : 'Khác';
const br = /Edg\//.test(_o2z) ? 'Edge' : /CriOS|Chrome\//.test(_o2z) ? 'Chrome' : /FxiOS|Firefox\//.test(_o2z) ? 'Firefox' : /Safari\//.test(_o2z) ? 'Safari' : 'Trình duyệt khác';
const w = win && win.innerWidth, h = win && win.innerHeight;
let _o1p = '';
try { _o1p = win && win.matchMedia && win.matchMedia('(display-mode: standalone)').matches ? 'app cài trên máy' : 'trình duyệt'; } catch { }
return [_o1u, br, w && h ? w + '×' + h : '', _o1p].filter(Boolean).join(' · ');
}
export function screenContext(route, registry, words = {}) {
const r = route || {};
const screen = String(r.screen || 'home');
const mod = r.module ? String(r.module) : '';
let _oy = null;
try { _oy = mod && registry && registry.get ? registry.get(mod) : null; } catch { _oy = null; }
const screenTitle = words[screen] || screen;
const moduleTitle = _oy && _oy.manifest ? _oy.manifest.title : (mod && words['set.' + mod]) || '';
const core = !_oy || _oy.core === true || ['packs', 'settings'].includes(_oy.id);
const label = screenTitle + (mod ? ' › ' + (moduleTitle || mod) : '');
return { screen, module: mod, screenTitle, moduleTitle, label, key: screen + (mod ? '/' + mod : ''), core };
}
export const screenField = (_o2g) => String((_o2g.key || '') + ' · ' + (_o2g.label || '')).slice(0, 200);
const _o3 = /\n*\[Thiết bị: ([^\]]*)\]\s*$/;
export const withDevice = (text, device) => String(text || '').trim() + (device ? '\n\n[Thiết bị: ' + String(device).slice(0, 160) + ']' : '');
export function splitDevice(text) {
const _o2e = String(text || ''); const _o1m = _o2e.match(_o3);
return _o1m ? { text: _o2e.slice(0, _o1m.index).trim(), device: _o1m[1] } : { text: _o2e.trim(), device: '' };
}
export function sourceHint(_o2g) {
const _o2e = _o2g || {};
if (_o2e.module && !['settings', ''].includes(_o2e.module) && !_o2e.core) return 'web/packs/bds/' + _o2e.module + '/index.js';
if (_o2e.screen === 'settings') return 'web/core/settings.js' + (_o2e.module ? ' (mục ' + _o2e.module + ')' : '');
return 'web/core/app.js (màn ' + (_o2e.screen || 'home') + ')';
}
export function buildClaudePrompt(fb, { appUrl = '', appVersion = '', module: mod, sale = false } = {}) {
const _o10 = fb || {};
const _o1z = splitDevice(_o10.text);
const _o2i = String(_o10.screen || '');
const key = _o2i.split(' · ')[0] || '';
const [screen, module] = key.split('/');
const _o2g = { screen: screen || '', module: mod != null ? mod : (module || ''), core: false };
if (_o2g.module && ['memory', 'persona', 'onboarding', 'maintenance', 'feedback', 'version', 'connection', 'profile', 'look', 'security', 'ai', 'budget', 'storage', 'selftest', 'errors', 'users', 'mytg'].includes(_o2g.module) && _o2g.screen === 'settings') _o2g.core = true;
const _oa = String(appUrl || '').replace(/#.*$/, '').replace(/\/?$/, '/');
const _o1j = _oa + '#/settings/feedback?fb=' + encodeURIComponent(String(_o10.id || ''));
const when = _o10.created_at ? new Date(Number(_o10.created_at)).toISOString().slice(0, 10) : '';
const _o2p = statusOf(_o10.status);
const _o1i = [
'Yêu cầu cho app BDS Studio (từ Góp ý trong app' + (_o10.id ? ', mã ' + _o10.id : '') + ')',
'',
'- Loại: ' + kindLabel(_o10.kind),
'- Mô tả: ' + scrub(_o1z.text),
'- Màn đang mở khi gửi: ' + (_o2i.split(' · ').slice(1).join(' · ') || key || 'không rõ') + (key ? ' (' + key + ')' : ''),
'- Phiên bản: web ' + (_o10.app_version || '?') + (appVersion && appVersion !== _o10.app_version ? ' (đang chạy ' + appVersion + ')' : ''),
_o1z.device ? '- Thiết bị: ' + _o1z.device : null,
'- Ảnh chụp màn hình: ' + (_o10.has_image || _o10.image_drive_id ? (sale ? 'có – lưu trong app (đính kèm vào thư nếu cần)' : 'có – xem trong app (Chủ đăng nhập): ' + _o1j) : 'không có'),
'- Trạng thái: ' + _o2p.label + (_o10.owner_note ? ' · Ghi chú của Chủ: ' + scrub(_o10.owner_note) : ''),
when ? '- Ngày gửi: ' + when : null
];
if (sale) return _o1i.filter((x) => x != null).join('\n');
_o1i.push(
'',
'Bối cảnh kỹ thuật (ngắn):',
'- Repo bdsapp: web/ là PWA tĩnh (lõi web/core/, module web/packs/bds/<id>/index.js), gas/ máy chủ Apps Script, engine/ máy dựng Python. Hợp đồng: docs/CONTRACT.md.',
'- Mã liên quan có thể ở: ' + sourceHint(_o2g) + '.',
'- Làm: tìm nguyên nhân/thiết kế → sửa + test (node --test tests/unit, pytest, playwright) → ghi CHANGELOG.md mục bản mới (nhãn [Web]/[Máy dựng]/[Máy chủ]).',
'- Không đưa dữ liệu khách thật vào mã hay test.');
return _o1i.filter((x) => x != null).join('\n');
}
export function isMissingAction(e) {
return !!e && (e.code === 'NOT_FOUND' || e.code === 'UNKNOWN_ACTION' || (e.code === 'BAD_INPUT' && /không được hỗ trợ|not supported|unknown action/i.test(String(e.message || e.userMessage || ''))));
}
const _o1b = (e) => !!e && e.code === 'BAD_INPUT' && /ảnh|Drive|base64|image/i.test(String(e.message || e.userMessage || ''));
export function createQueue(storage = globalThis.localStorage) {
const _o28 = () => { try { const v = JSON.parse(storage.getItem(QUEUE_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };
const _o36 = (_o8) => {
try { storage.setItem(QUEUE_KEY, JSON.stringify(_o8)); return true; } catch {
const _o2o = _o8.map((x, _o17) => (_o17 < _o8.length - 1 && x.payload.image ? { ...x, payload: { ...x.payload, image: null }, image_dropped: true } : x));
try { storage.setItem(QUEUE_KEY, JSON.stringify(_o2o)); return true; } catch { return false; }
}
};
const _o2s = new Set();
const _ow = () => { for (const _od of _o2s) { try { _od(_o28()); } catch { } } };
const _o27 = {
list: _o28,
size: () => _o28().length,
on(_od) { _o2s.add(_od); return () => _o2s.delete(_od); },
add(payload, reason = 'offline') {
const _o8 = _o28();
const _o1d = { qid: 'q' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), payload, at: Date.now(), reason, tries: 0 };
_o8.push(_o1d);
while (_o8.length > _o4) _o8.shift();
if (!_o36(_o8)) { _o1d.payload = { ...payload, image: null }; _o1d.image_dropped = true; _o8[_o8.length - 1] = _o1d; _o36(_o8); }
_ow();
return _o1d;
},
remove(qid) { _o36(_o28().filter((x) => x.qid !== qid)); _ow(); },
async flush(api) {
let sent = 0; let reason = '';
for (const _o1d of _o28()) {
try {
await sendOnce(api, _o1d.payload);
_o27.remove(_o1d.qid); sent++;
} catch (e) {
if (e && e.code === 'NETWORK') { reason = 'offline'; break; }
if (isMissingAction(e)) { reason = 'waiting_server'; _o1n(_o1d.qid, { reason }); break; }
if (e && e.code === 'QUOTA') { reason = 'quota'; break; }
const tries = (_o1d.tries || 0) + 1;
if (tries >= 5) _o27.remove(_o1d.qid); else _o1n(_o1d.qid, { tries, reason: 'error', error: String((e && (e.userMessage || e.message)) || e).slice(0, 200) });
}
}
return { sent, kept: _o28().length, reason };
}
};
function _o1n(qid, patch) { _o36(_o28().map((x) => (x.qid === qid ? { ...x, ...patch } : x))); _ow(); }
return _o27;
}
export async function sendOnce(api, payload) {
try { return { row: await api.call('feedback.submit', payload), imageDropped: false }; } catch (e) {
if (payload && payload.image && _o1b(e)) {
const _o1x = { ...payload, image: null, text: String(payload.text || '') };
return { row: await api.call('feedback.submit', _o1x), imageDropped: true, imageError: e.userMessage || e.message };
}
throw e;
}
}
export async function submitFeedback(api, queue, payload) {
try {
const r = await sendOnce(api, payload);
return { status: 'sent', row: r.row, imageDropped: r.imageDropped, imageError: r.imageError };
} catch (e) {
if (e && e.code === 'NETWORK') { queue.add(payload, 'offline'); return { status: 'queued', reason: 'offline' }; }
if (isMissingAction(e)) { queue.add(payload, 'waiting_server'); return { status: 'queued', reason: 'waiting_server' }; }
throw e;
}
}
const _o2 = new Set(['color', 'font-family', 'font-size', 'font-style', 'font-variant', 'font-weight', 'font-stretch', 'line-height', 'letter-spacing',
'word-spacing', 'text-align', 'text-indent', 'text-transform', 'white-space', 'visibility', 'direction', 'list-style-type', 'list-style-position',
'overflow-wrap', 'word-break', 'text-shadow', 'cursor', 'quotes', 'tab-size', 'hyphens', '-webkit-text-fill-color', 'fill', 'stroke', 'stroke-width',
'stroke-linecap', 'stroke-linejoin', 'caret-color', 'border-collapse', 'border-spacing', 'empty-cells', 'caption-side', 'color-scheme']);
const _o0 = ['display', 'position', 'box-sizing', 'width', 'height', 'min-width', 'min-height', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'flex', 'flex-grow', 'flex-shrink', 'flex-basis', 'grid-column', 'grid-row', 'float', 'top', 'left', 'right', 'bottom'];
const _o6 = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'TEMPLATE', 'IFRAME', 'VIDEO', 'AUDIO']);
export async function captureApp(_o2d, { win = window, doc = document, maxSide = _o1, quality = 0.82 } = {}) {
const W = win.innerWidth, H = win.innerHeight;
const _o14 = doc.createElement('iframe');
_o14.setAttribute('aria-hidden', 'true'); _o14.tabIndex = -1;
Object.assign(_o14.style, { position: 'fixed', width: '10px', height: '10px', left: '-9999px', top: '0', border: '0', visibility: 'hidden' });
doc.body.appendChild(_o14);
try {
const _o12 = _o14.contentDocument;
const _oq = new Map();
const _op = (el) => {
const key = el.namespaceURI + '|' + el.localName;
if (_oq.has(key)) return _oq.get(key);
const _on = _o12.createElementNS(el.namespaceURI || 'http://www.w3.org/1999/xhtml', el.localName);
(el.namespaceURI === 'http://www.w3.org/2000/svg' ? (_o12.body.appendChild(_o12.createElementNS('http://www.w3.org/2000/svg', 'svg'))) : _o12.body).appendChild(_on);
const cs = _o14.contentWindow.getComputedStyle(_on); const _o1r = {};
for (let _o17 = 0; _o17 < cs.length; _o17++) _o1r[cs[_o17]] = cs.getPropertyValue(cs[_o17]);
_oq.set(key, _o1r); return _o1r;
};
const _o1a = (r) => r.bottom >= -50 && r.top <= H + 50 && r.right >= -50 && r.left <= W + 50;
const _o2q = (el, parentCs, _o15) => {
const cs = win.getComputedStyle(el); const _oo = _op(el); let _o1v = '';
const _o24 = _o15 ? Array.from(cs) : _o0;
for (const _o1x of _o24) {
const v = cs.getPropertyValue(_o1x);
if (!v) continue;
if (_o15 && _o2.has(_o1x) ? (parentCs && parentCs.getPropertyValue(_o1x) === v) : _oo[_o1x] === v) continue;
_o1v += _o1x + ':' + v + ';';
}
return { css: _o1v, cs };
};
const _o19 = (_o18) => {
try {
if (!_o18.complete || !_o18.naturalWidth) return null;
const _oc = doc.createElement('canvas'); _oc.width = _o18.naturalWidth; _oc.height = _o18.naturalHeight;
_oc.getContext('2d').drawImage(_o18, 0, 0); return _oc.toDataURL('image/png');
} catch { return null; }
};
const _o32 = (el, parentCs, isRoot) => {
if (_o6.has(el.tagName)) return null;
const _ok = win.getComputedStyle(el);
if (_ok.display === 'none') return null;
const r = el.getBoundingClientRect();
const _o31 = isRoot || _o1a(r) || _ok.position === 'fixed' || _ok.position === 'sticky';
const { css, cs } = _o2q(el, isRoot ? null : parentCs, _o31);
let _oc;
if (el.tagName === 'IMG') {
_oc = doc.createElement('img'); const _on = _o19(el); if (_on) _oc.setAttribute('src', _on);
_oc.setAttribute('width', String(Math.round(r.width))); _oc.setAttribute('height', String(Math.round(r.height)));
} else if (el.tagName === 'CANVAS') {
_oc = doc.createElement('img'); try { _oc.setAttribute('src', el.toDataURL()); } catch { }
} else _oc = el.cloneNode(false);
if (_oc.removeAttribute) { _oc.removeAttribute('id'); _oc.removeAttribute('class'); for (const _o7 of Array.from(_oc.attributes || [])) if (/^on/i.test(_o7.name) || _o7.name === 'href' || _o7.name === 'src' && _oc.tagName !== 'IMG') _oc.removeAttribute(_o7.name); }
if (_oc.style) _oc.style.cssText = css + (isRoot ? 'margin-top:' + (-win.scrollY) + 'px;' : '');
if (el.tagName === 'INPUT') { if (/^(checkbox|radio)$/i.test(el.type)) { if (el.checked) _oc.setAttribute('checked', ''); } else _oc.setAttribute('value', el.type === 'password' ? '••••' : el.value); }
if (el.tagName === 'TEXTAREA') _oc.textContent = el.value;
if (el.tagName === 'SELECT') { const _o1r = el.options[el.selectedIndex]; const _o2e = doc.createElement('span'); _o2e.textContent = _o1r ? _o1r.text : ''; _o2e.style.cssText = css; return _o2e; }
if (!_o31 || el.tagName === 'IMG' || el.tagName === 'CANVAS' || el.tagName === 'TEXTAREA') return _oc;
for (const _oe of el.childNodes) {
if (_oe.nodeType === 3) _oc.appendChild(doc.createTextNode(_oe.nodeValue));
else if (_oe.nodeType === 1) { const _o1e = _o32(_oe, cs, false); if (_o1e) _oc.appendChild(_o1e); }
}
return _oc;
};
const _oh = _o32(_o2d, null, true);
const _ob = win.getComputedStyle(doc.body);
const _o35 = doc.createElement('div');
_o35.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
_o35.style.cssText = ('width:' + W + 'px;height:' + H + 'px;overflow:hidden;position:relative;background:' + _ob.backgroundColor + ';color:' + _ob.color + ';font-family:' + _ob.fontFamily + ';font-size:' + _ob.fontSize + ';line-height:' + _ob.lineHeight + ';');
_o35.appendChild(_oh);
const _o37 = new win.XMLSerializer().serializeToString(_o35);
const _o2t = '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '"><foreignObject x="0" y="0" width="100%" height="100%">' + _o37 + '</foreignObject></svg>';
const _o18 = new win.Image();
_o18.decoding = 'sync';
await new Promise((_o2c, rej) => { _o18.onload = _o2c; _o18.onerror = () => rej(new Error('Trình duyệt chưa vẽ được ảnh chụp.')); _o18.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(_o2t); });
const _o2h = Math.min(win.devicePixelRatio || 1, 2, maxSide / Math.max(W, H));
const _om = doc.createElement('canvas'); _om.width = Math.round(W * _o2h); _om.height = Math.round(H * _o2h);
const _o16 = _om.getContext('2d'); _o16.fillStyle = _ob.backgroundColor || '#fff'; _o16.fillRect(0, 0, _om.width, _om.height);
_o16.drawImage(_o18, 0, 0, _om.width, _om.height);
return _om.toDataURL('image/jpeg', quality);
} finally { _o14.remove(); }
}
export async function fileToDataUrl(file, { maxSide = _o1, quality = 0.85 } = {}) {
const _o30 = URL.createObjectURL(file);
try {
const _o18 = new Image();
await new Promise((_o2c, rej) => { _o18.onload = _o2c; _o18.onerror = () => rej(new Error('Không đọc được ảnh này.')); _o18.src = _o30; });
const _o2e = Math.min(1, maxSide / Math.max(_o18.naturalWidth, _o18.naturalHeight));
const _oc = document.createElement('canvas'); _oc.width = Math.round(_o18.naturalWidth * _o2e); _oc.height = Math.round(_o18.naturalHeight * _o2e);
const _o16 = _oc.getContext('2d'); _o16.fillStyle = '#fff'; _o16.fillRect(0, 0, _oc.width, _oc.height); _o16.drawImage(_o18, 0, 0, _oc.width, _oc.height);
return _oc.toDataURL('image/jpeg', quality);
} finally { URL.revokeObjectURL(_o30); }
}
function _o1o(h, dataUrl, onChange) {
const _om = h('canvas', { class: 'fb-canvas', 'data-testid': 'fb-canvas', 'aria-label': 'Ảnh chụp – kéo để che vùng nhạy cảm' });
Object.assign(_om.style, { width: '100%', maxHeight: '320px', objectFit: 'contain', touchAction: 'none', cursor: 'crosshair', borderRadius: '11px', border: '1px solid var(--line)' });
const _o18 = new Image(); const _o2a = []; let _ol = null;
const _ot = () => {
const _o16 = _om.getContext('2d'); _o16.drawImage(_o18, 0, 0, _om.width, _om.height); _o16.fillStyle = '#111';
for (const r of _o2a.concat(_ol ? [_ol] : [])) _o16.fillRect(Math.min(r.x, r.x + r.w), Math.min(r.y, r.y + r.h), Math.abs(r.w), Math.abs(r.h));
};
_o18.onload = () => { _om.width = _o18.naturalWidth; _om.height = _o18.naturalHeight; _ot(); };
_o18.src = dataUrl;
const _o25 = (e) => { const _o9 = _om.getBoundingClientRect(); const _o2u = _om.width / _o9.width, sy = _om.height / _o9.height; return { x: (e.clientX - _o9.left) * _o2u, y: (e.clientY - _o9.top) * sy }; };
_om.addEventListener('pointerdown', (e) => { e.preventDefault(); try { _om.setPointerCapture(e.pointerId); } catch { } const _o1x = _o25(e); _ol = { x: _o1x.x, y: _o1x.y, w: 0, h: 0 }; });
_om.addEventListener('pointermove', (e) => { if (!_ol) return; const _o1x = _o25(e); _ol.w = _o1x.x - _ol.x; _ol.h = _o1x.y - _ol.y; _ot(); });
const _ox = () => { if (_ol && Math.abs(_ol.w) > 4 && Math.abs(_ol.h) > 4) { _o2a.push(_ol); if (onChange) onChange(_o2a.length); } _ol = null; _ot(); };
_om.addEventListener('pointerup', _ox); _om.addEventListener('pointercancel', _ox);
return {
el: _om,
undo() { _o2a.pop(); _ot(); if (onChange) onChange(_o2a.length); },
count: () => _o2a.length,
dataUrl: () => { try { return _om.width ? _om.toDataURL('image/jpeg', 0.85) : dataUrl; } catch { return dataUrl; } }
};
}
const _o2x = (dataUrl) => {
const _o1m = String(dataUrl || '').match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
return _o1m ? { mime: _o1m[1], b64: _o1m[2] } : null;
};
export function installFeedback({ S, appHooks, ui, config = {}, t = (_o1e) => _o1e }) {
const { h, button, toast, modal, badge } = ui;
const sale = isSaleEdition(config);
const _oi = contactFor(config);
addDefaults({ 'help.feedback': sale
? 'Góp ý: gửi yêu cầu thêm, bớt, sửa chức năng hoặc báo lỗi – bấm nút ✨ Trợ lý AI ở góc dưới phải rồi chọn "Góp ý / Gửi cho người bán" (hoặc vào Cài đặt › Góp ý).\nApp tự kèm tên màn đang mở, phiên bản và loại thiết bị; không kèm dữ liệu khách. Ảnh chụp màn hình nên che phần có tên/số điện thoại khách trước khi gửi.\nGóp ý được lưu trong app của anh/chị (Chủ tài khoản xem và đổi trạng thái). Muốn bên hỗ trợ (người bán) nhận được, Chủ tài khoản bấm "Gửi cho người bán": app mở email soạn sẵn nội dung và thông tin kỹ thuật (không kèm dữ liệu khách, khoá, mật khẩu).' + (_oi.text ? '\nLiên hệ hỗ trợ: ' + _oi.text + '.' : '')
: 'Góp ý: gửi yêu cầu thêm, bớt, sửa chức năng hoặc báo lỗi cho chủ app – bấm nút ✨ Trợ lý AI ở góc dưới phải rồi chọn "Góp ý cho app" (hoặc vào Cài đặt › Góp ý).\nApp tự kèm tên màn đang mở, phiên bản và loại thiết bị; không kèm dữ liệu khách. Ảnh chụp màn hình nên che phần có tên/số điện thoại khách trước khi gửi.\nChủ xem mọi góp ý, đổi trạng thái (Mới / Đang xem / Sẽ làm / Đã làm / Không làm) và bấm "Mang sang Claude" để soạn sẵn yêu cầu sửa app.' });
const _o1c = () => { const _o2y = S.user || {}; return !_o2y.role || _o2y.role === 'owner'; };
const _or = (screen, device) => supportDiagnosticText({
versions: { web: config.APP_VERSION || '', server: (S.status && S.status.version) || '', edition: (S.status && S.status.edition) || config.edition || '' },
screen, device,
errors: appHooks.errors && typeof appHooks.errors.recent === 'function' ? appHooks.errors.recent().slice(-5).reverse() : []
});
function openSellerMail({ kind = '', text = '', screen = '', device = '', id = '' } = {}) {
const _o1m = sellerMail({ kind, kindLabel: kindLabel(kind), text: scrub(text), diag: _or(screen, device), id });
const href = mailtoLink(_oi.email, _o1m.subject, _o1m.body);
const _o15 = _o1m.subject + '\n\n' + _o1m.body;
const pre = h('textarea', { class: 'fb-text', readonly: true, rows: 10, 'data-testid': 'fb-seller-text' }); pre.value = _o15;
const api = { href, text: _o15 };
if (window.__bds && window.__bds.feedback) window.__bds.feedback.lastSellerMail = api;
modal({
title: 'Gửi cho người bán', wide: true, cls: 'fb-modal',
body: h('div', { class: 'fb-form', 'data-testid': 'fb-seller' },
h('p', { class: 'small' }, href
? 'Góp ý đã lưu trong app. Bấm "Mở email" – app soạn sẵn thư tới ' + _oi.email + ' gồm nội dung và thông tin kỹ thuật (không kèm dữ liệu khách, khoá, mật khẩu). Ảnh chụp màn hình: đính kèm vào thư nếu cần.'
: 'Góp ý đã lưu trong app. Chép nội dung bên dưới và gửi cho người bán qua kênh anh/chị vẫn liên hệ.'),
supportBlock(h, { cfg: config, lead: 'Liên hệ hỗ trợ:', testid: 'fb-support' }),
pre,
href ? h('div', { class: 'btn-row' }, h('a', { class: 'btn btn-primary', href, 'data-testid': 'fb-seller-mailto' }, ui.icon('mail', 18), h('span', null, 'Mở email'))) : null),
actions: [{ label: 'Chép nội dung', kind: 'ghost', close: false, onClick: () => ui.copy(_o15) }, { label: 'Đóng', kind: 'secondary' }]
});
return api;
}
const queue = createQueue();
const words = { home: t('screen.home'), customers: t('screen.customers'), sales: t('screen.sales'), content: t('screen.content'), inbox: t('screen.inbox'), settings: t('screen.settings'), 'set.feedback': 'Góp ý' };
const appUrl = () => (typeof location !== 'undefined' && !/^http:\/\/(127\.0\.0\.1|localhost)/.test(location.origin) ? location.origin + location.pathname : (INST.publicUrl() || ''));
let _o11 = document.querySelector('.fb-fab');
if (!_o11) {
_o11 = h('button', { type: 'button', class: 'fb-fab', id: 'ai-fab', 'data-testid': 'ai-fab', 'aria-label': 'Trợ lý AI', title: 'Trợ lý AI – hỏi app, soạn nội dung' },
h('span', { class: 'fb-fab-ico', 'aria-hidden': 'true' }, '✨'), h('span', { class: 'fb-fab-label' }, 'Trợ lý AI'), h('span', { class: 'fb-fab-n', hidden: true }));
const css = document.getElementById('bds-feedback-css');
if (css && !css.sheet) {
_o11.style.display = 'none';
const show = () => { _o11.style.display = ''; };
css.addEventListener('load', show, { once: true }); css.addEventListener('error', show, { once: true });
}
document.body.appendChild(_o11);
}
_o11.onclick = () => { const _o7 = (S.ask && S.ask.open) ? S.ask : (window.__bds && window.__bds.extras && window.__bds.extras.ask); if (_o7 && typeof _o7.open === 'function') _o7.open(); else openForm(); };
if (!window.__bdsFbScroll) {
window.__bdsFbScroll = true;
const _o1g = new WeakMap();
let _os = false, _o2v = 0;
const _o22 = () => typeof matchMedia !== 'function' || matchMedia('(max-width: 899px)').matches;
const _oj = (_o9) => {
const L = _o9.offsetLeft, T = _o9.offsetTop, W = _o9.offsetWidth, H = _o9.offsetHeight;
if (!W || !H || typeof document.elementsFromPoint !== 'function') return false;
const _o26 = [[L + W / 2, T + H / 2], [L + 6, T + H / 2], [L + W - 6, T + H / 2], [L + W / 2, T + 6], [L + W / 2, T + H - 6]];
if (_o26.some(([x, y]) => document.elementsFromPoint(x, y).some((el) => el !== _o9 && !_o9.contains(el) && !el.closest('.fb-fab, .nav, nav, .toasts')
&& !!el.closest('button, a[href], input, select, textarea, [role="button"]')))) return true;
return [...document.querySelectorAll('.view :is(button, a[href], input, select, textarea, [role="button"])')].some((el) => {
const _o27 = el.getBoundingClientRect();
return _o27.width > 0 && _o27.height > 0 && _o27.left < L + W && L < _o27.right && _o27.top < T + H && T < _o27.bottom;
});
};
const apply = () => {
const _o9 = document.getElementById('ai-fab');
if (!_o9) return;
if (!_o22()) { _o9.classList.remove('fb-fab-away'); return; }
_o9.classList.toggle('fb-fab-away', _os || _oj(_o9));
};
const _o1h = (ms = 140) => { clearTimeout(_o2v); _o2v = setTimeout(apply, ms); };
window.addEventListener('scroll', (e) => {
if (!_o22()) return;
const el = e.target && e.target.nodeType === 1 ? e.target : (document.scrollingElement || document.documentElement);
const y = el.scrollTop || 0, prev = _o1g.has(el) ? _o1g.get(el) : y;
_o1g.set(el, y);
if (y < 24 || y - prev < -6) _os = false;
else if (y - prev > 6) _os = true;
const _o9 = document.getElementById('ai-fab');
if (_o9 && _os) _o9.classList.add('fb-fab-away');
_o1h();
}, { capture: true, passive: true });
window.addEventListener('hashchange', () => { _os = false; _o1h(900); setTimeout(apply, 2500); });
window.addEventListener('resize', () => _o1h(300));
_o1h(1500); setTimeout(apply, 3500);
}
const _o1y = () => { const _o1q = queue.size(); const _o9 = _o11.querySelector('.fb-fab-n'); _o9.hidden = !_o1q; _o9.textContent = String(_o1q); _o9.title = _o1q ? _o1q + ' góp ý chờ gửi' : ''; };
queue.on(_o1y); _o1y();
const flush = async () => {
if (!queue.size() || !S.api || !S.api.hasValidToken || !S.api.hasValidToken()) return null;
const r = await queue.flush(S.api).catch(() => null);
if (r && r.sent) toast('Đã gửi ' + r.sent + ' góp ý đang chờ.', 'ok');
return r;
};
if (!window.__bdsFbOnline) { window.__bdsFbOnline = true; window.addEventListener('online', () => { const x = window.__bds && window.__bds.feedback; if (x) x.flush(); }); }
if (queue.size()) setTimeout(flush, 2500);
const _o2v = setInterval(flush, 120000);
appHooks.openFeedback = (_o1r) => openForm(_o1r);
appHooks.submitFeedback = (_o1r) => _o2r(_o1r);
appHooks.lateSections = (ctx) => [['feedback', 'help', 'Góp ý', (body) => _o2b(body, ctx)]];
async function _o2r({ kind = 'add', text = '' } = {}) {
const v = validateFeedback({ kind, text });
if (!v.ok) throw new Error(v.errors.join(' '));
const _o2g = screenContext(S.route, S.registry, words);
return submitFeedback(S.api, queue, { kind, text: withDevice(String(text).trim(), deviceInfo()), screen: screenField(_o2g), app_version: config.APP_VERSION || '', image: null });
}
function openForm({ kind = '', text: pre = '', onSaved = null } = {}) {
const _o2g = screenContext(S.route, S.registry, words);
const device = deviceInfo();
const version = config.APP_VERSION || '';
let _og = kind; let _o2m = null; let _ov = null;
const _o1f = KINDS.map((_o1e) => {
const _o9 = h('button', { type: 'button', class: 'fb-kind', 'aria-pressed': String(_o1e.value === _og), dataset: { kind: _o1e.value }, 'data-testid': 'fb-kind-' + _o1e.value },
h('span', { 'aria-hidden': 'true' }, _o1e.icon), h('span', null, _o1e.label));
_o9.addEventListener('click', () => { _og = _o1e.value; for (const x of _o1f) x.setAttribute('aria-pressed', String(x.dataset.kind === _og)); });
return _o9;
});
const text = h('textarea', { class: 'fb-text', id: 'fb-text', 'data-testid': 'fb-text', maxlength: String(MAX_TEXT), placeholder: 'Mô tả cụ thể: muốn thêm/bớt/sửa gì, hoặc lỗi xảy ra khi làm gì…', 'aria-label': 'Mô tả' });
const count = h('span', { class: 'muted small fb-count num' }, '0/' + MIN_TEXT);
const _o29 = () => { const _o1q = text.value.trim().length; count.textContent = _o1q < MIN_TEXT ? _o1q + '/' + MIN_TEXT : _o1q + ' ký tự'; };
text.addEventListener('input', _o29);
if (pre) { text.value = String(pre).slice(0, MAX_TEXT); _o29(); }
const _oz = h('p', { class: 'form-err', role: 'alert', 'data-testid': 'fb-err' });
const shotBox = h('div', { class: 'fb-shot', 'data-testid': 'fb-shot' });
const _o13 = h('input', { type: 'file', accept: 'image/*', hidden: true, style: { display: 'none' }, 'data-testid': 'fb-file' });
const _o2j = _o5.includes(_o2g.screen);
const masked = h('input', { type: 'checkbox', id: 'fb-masked', 'data-testid': 'fb-masked' });
const _o2l = (dataUrl) => {
_o2m = dataUrl;
if (!dataUrl) { ui.mountTo(shotBox); _ov = null; return; }
const _o1q = h('span', { class: 'muted small', 'data-testid': 'fb-mask-n' }, 'Chưa che vùng nào');
_ov = _o1o(h, dataUrl, (_o1e) => { _o1q.textContent = _o1e ? 'Đã che ' + _o1e + ' vùng' : 'Chưa che vùng nào'; if (_o1e) masked.checked = true; });
ui.mountTo(shotBox,
h('p', { class: 'fb-warn small', 'data-testid': 'fb-privacy' }, '⚠️ Ảnh có thể chứa tên, số điện thoại hoặc dữ liệu của khách' + (_o2j ? ' (màn này có danh sách khách)' : '') + '. Kéo trên ảnh để che đen trước khi gửi.'),
_ov.el,
h('div', { class: 'btn-row' }, button('Hoàn tác che', () => _ov.undo(), { kind: 'ghost', small: true }), button('Bỏ ảnh', () => _o2l(null), { kind: 'ghost', small: true, testid: 'fb-shot-remove' }), _o1q),
h('label', { class: 'fb-check small' }, masked, h('span', null, ' Đã che dữ liệu khách (hoặc ảnh không có dữ liệu khách)')));
};
_o13.addEventListener('change', async () => {
const _o10 = _o13.files && _o13.files[0]; _o13.value = '';
if (!_o10) return;
try { _o2l(await fileToDataUrl(_o10)); } catch (e) { _oz.textContent = e.message; }
});
const capBtn = button('Chụp màn hình app', async () => {
try {
const _o2d = document.getElementById('app');
_o2l(await captureApp(_o2d));
} catch (e) {
_oz.textContent = 'Trình duyệt này chưa chụp được – bấm "Chọn ảnh" và chọn ảnh chụp màn hình có sẵn.';
try { window.dispatchEvent(new CustomEvent('bds:error', { detail: { level: 'warn', where: 'feedback.capture', message: String(e && e.message || e) } })); } catch { }
}
}, { kind: 'secondary', icon: '📸', testid: 'fb-capture' });
const _o23 = button('Chọn ảnh', () => _o13.click(), { kind: 'secondary', icon: '🖼️', testid: 'fb-pick' });
const meta = h('p', { class: 'fb-meta', 'data-testid': 'fb-meta' }, 'Tự kèm: màn ' + _o2g.label + ' · phiên bản ' + (version || '?') + ' · ' + device + '. Không kèm dữ liệu khách.');
const body = h('form', { class: 'fb-form', 'data-testid': 'fb-form', novalidate: true },
h('div', null, h('p', { class: 'small', style: { margin: '0 0 6px' } }, h('strong', null, 'Loại góp ý')), h('div', { class: 'fb-kinds', role: 'group', 'aria-label': 'Loại góp ý' }, _o1f)),
h('label', { for: 'fb-text', class: 'small' }, h('strong', null, 'Mô tả'), ' (ít nhất ' + MIN_TEXT + ' ký tự)'), text, count,
h('div', null, h('p', { class: 'small', style: { margin: '0 0 6px' } }, h('strong', null, 'Ảnh chụp màn hình'), ' (không bắt buộc)'), h('div', { class: 'btn-row' }, capBtn, _o23), _o13),
shotBox, meta, _oz);
const _o2f = async () => {
_oz.textContent = '';
const v = validateFeedback({ kind: _og, text: text.value });
if (!v.ok) { _oz.textContent = v.errors.join(' '); return false; }
if (_o2m && !masked.checked) { _oz.textContent = 'Đánh dấu "Đã che dữ liệu khách" (che vùng nhạy cảm trên ảnh trước) hoặc bỏ ảnh.'; return false; }
const payload = { kind: _og, text: withDevice(text.value.trim(), device), screen: screenField(_o2g), app_version: version, image: _o2m ? _o2x(_ov ? _ov.dataUrl() : _o2m) : null };
try {
const r = await submitFeedback(S.api, queue, payload);
if (r.status === 'queued') toast(r.reason === 'offline' ? 'Đang ngoại tuyến – góp ý đã xếp hàng, có mạng sẽ tự gửi.' : 'Máy chủ chưa cập nhật phần Góp ý – đã xếp hàng, sẽ tự gửi khi máy chủ sẵn sàng.', 'info', 5000);
else toast('Đã gửi góp ý. Cảm ơn!' + (r.imageDropped ? ' (Ảnh chưa lưu được: ' + (r.imageError || 'máy chủ chưa bật Drive') + ')' : ''), 'ok', 4500);
if (typeof onSaved === 'function') { try { onSaved(r); } catch { } }
return r;
} catch (e) { _oz.textContent = (e && (e.userMessage || e.message)) || 'Chưa gửi được.'; return false; }
};
const _o1m = modal({
title: '💬 Góp ý cho app', body, cls: 'fb-modal',
actions: [
{ label: 'Huỷ', kind: 'ghost' },
sale && _o1c() ? { label: 'Gửi cho người bán', kind: 'secondary', id: 'fb-send-seller', onClick: async () => {
const r = await _o2f();
if (!r) return false;
const sent = r.row || r.data || {};
setTimeout(() => openSellerMail({ kind: _og, text: text.value.trim(), screen: _o2g.label, device, id: sent.id || '' }), 0);
return true;
} } : null,
{ label: 'Gửi góp ý', kind: 'primary', id: 'fb-send', onClick: async () => !!(await _o2f()) }
].filter(Boolean)
});
setTimeout(() => { try { (_og ? text : _o1f[0]).focus({ preventScroll: true }); } catch { } }, 50);
return _o1m;
}
async function _o2b(body, ctx) {
const user = (ctx && ctx.user) || S.user || {};
const _o1w = !user.role || user.role === 'owner';
let filter = '';
let rows = []; let _o2k = '';
const _o1k = h('div', { class: 'fb-list', 'data-testid': 'fb-list' }, ui.spinner());
const _of = [{ value: '', label: 'Tất cả' }, ...STATUSES].map((_o2e) => {
const _o9 = h('button', { type: 'button', class: 'fb-kind', 'aria-pressed': String(_o2e.value === filter), dataset: { status: _o2e.value }, 'data-testid': 'fb-filter-' + (_o2e.value || 'all') }, _o2e.label);
_o9.addEventListener('click', () => { filter = _o2e.value; for (const x of _of) x.setAttribute('aria-pressed', String(x.dataset.status === filter)); _ot(); });
return _o9;
});
body.append(
h('p', { class: 'muted small', 'data-testid': 'fb-lead' }, _o1w
? (sale ? 'Mọi góp ý của người dùng app (lưu trong app của anh/chị). Đổi trạng thái để người gửi biết; muốn bên hỗ trợ (người bán) nhận được, bấm "Gửi cho người bán" ở từng góp ý.' : 'Mọi góp ý của người dùng app. Đổi trạng thái để người gửi biết; "Mang sang Claude" soạn sẵn yêu cầu để Claude sửa.')
: 'Góp ý anh/chị đã gửi và trạng thái xử lý.'),
sale && _o1w ? supportBlock(h, { cfg: config, lead: 'Liên hệ hỗ trợ:', testid: 'fb-support' }) : null,
h('div', { class: 'btn-row' }, button('Gửi góp ý mới', () => openForm({ onSaved: () => { if (body.isConnected) _o1l(); } }), { kind: 'primary', icon: 'plus', testid: 'fb-new' }), button('Tải lại', () => _o1l(), { kind: 'ghost', icon: 'refresh' })),
h('div', { class: 'fb-filter', role: 'group', 'aria-label': 'Lọc trạng thái' }, _of),
_o1k);
const _o1t = queue.on(() => _ot());
const _o1s = new MutationObserver(() => { if (!body.isConnected) { _o1t(); _o1s.disconnect(); } });
if (body.parentNode) _o1s.observe(document.body, { childList: true, subtree: true });
await _o1l();
async function _o1l() {
_o2k = '';
try {
const r = await S.api.call('feedback.list', {});
rows = (Array.isArray(r) ? r : (r && (r.items || r.rows)) || []).filter((x) => !Number(x.deleted));
} catch (e) {
rows = [];
_o2k = isMissingAction(e) ? 'Máy chủ chưa cập nhật phần Góp ý – góp ý gửi đi được xếp hàng và sẽ tự gửi khi máy chủ sẵn sàng.' : (e && e.code === 'NETWORK' ? 'Đang ngoại tuyến.' : ((e && (e.userMessage || e.message)) || ''));
}
_ot();
}
function _ot() {
const _o20 = queue.list();
const _o33 = rows.filter((r) => !filter || (r.status || 'new') === filter);
const items = [];
if (_o2k) items.push(h('p', { class: 'muted small', 'data-testid': 'fb-server-note' }, _o2k));
if (!filter) for (const _o1x of _o20) items.push(_o21(_o1x));
for (const r of _o33) items.push(row(r));
if (!items.length || (items.length === 1 && _o2k)) items.push(ui.empty(filter ? 'Không có góp ý ở trạng thái này.' : 'Chưa có góp ý nào.'));
ui.mountTo(_o1k, items);
const focus = ctx && ctx.route && ctx.route.query && ctx.route.query.get && ctx.route.query.get('fb');
if (focus) { const el = _o1k.querySelector('[data-fb="' + CSS.escape(focus) + '"]'); if (el) el.scrollIntoView({ block: 'center' }); }
}
function _o21(_o1x) {
const _o1e = KINDS.find((x) => x.value === _o1x.payload.kind) || {};
return h('div', { class: 'fb-item fb-pending', 'data-testid': 'fb-pending' },
h('div', { class: 'row-line' }, badge('Chờ gửi', 'warn'), h('strong', null, (_o1e.icon || '') + ' ' + (_o1e.label || '')), h('span', { class: 'muted small num' }, ui.date(_o1x.at, true))),
h('div', { class: 'fb-desc small' }, splitDevice(_o1x.payload.text).text),
h('span', { class: 'muted small' }, _o1x.reason === 'waiting_server' ? 'Chờ máy chủ cập nhật phần Góp ý.' : _o1x.reason === 'error' ? 'Lỗi: ' + (_o1x.error || '') : 'Chờ có mạng.'),
h('div', { class: 'btn-row' }, button('Gửi lại', async () => { const r = await queue.flush(S.api); if (r.sent) { toast('Đã gửi.', 'ok'); _o1l(); } else toast(r.reason === 'offline' ? 'Vẫn ngoại tuyến.' : 'Máy chủ chưa nhận – giữ trong hàng đợi.', 'info'); }, { kind: 'secondary', small: true, testid: 'fb-retry' }),
button('Bỏ', () => queue.remove(_o1x.qid), { kind: 'ghost', small: true })));
}
function row(r) {
const _o1e = KINDS.find((x) => x.value === r.kind) || { label: r.kind, icon: '' };
const _o2p = statusOf(r.status);
const _o1z = splitDevice(r.text);
const _o34 = r.full_name || r.username || '';
const imgBox = h('div');
const el = h('div', { class: 'fb-item', dataset: { fb: r.id, status: _o2p.value }, 'data-testid': 'fb-item' },
h('div', { class: 'row-line' }, badge(_o2p.label, _o2p.tone), h('strong', null, (_o1e.icon || '') + ' ' + _o1e.label), h('span', { class: 'muted small num' }, ui.date(r.created_at, true)), _o1w && _o34 ? h('span', { class: 'muted small' }, '· ' + _o34) : null),
h('div', { class: 'fb-desc' }, _o1z.text),
h('span', { class: 'muted small' }, [r.screen ? 'Màn: ' + String(r.screen).split(' · ').slice(1).join(' · ') : '', r.app_version ? 'v' + r.app_version : '', _o1z.device].filter(Boolean).join(' · ')),
r.owner_note ? h('p', { class: 'small' }, h('strong', null, 'Ghi chú: '), r.owner_note) : null,
imgBox,
h('div', { class: 'btn-row' },
r.has_image || r.image_drive_id ? button('Xem ảnh', () => _o2n(r, imgBox), { kind: 'ghost', small: true, testid: 'fb-image' }) : null,
_o1w ? button('Đổi trạng thái', () => _ou(r), { kind: 'secondary', small: true, testid: 'fb-edit' }) : null,
_o1w && !sale ? button('Mang sang Claude', () => _o2w(r), { kind: 'primary', small: true, icon: 'sparkle', testid: 'fb-claude' }) : null,
_o1w && sale ? button('Gửi cho người bán', () => openSellerMail({ kind: r.kind, text: _o1z.text, screen: r.screen ? String(r.screen).split(' · ').slice(1).join(' · ') : '', device: _o1z.device, id: r.id }), { kind: 'primary', small: true, testid: 'fb-seller-btn' }) : null));
return el;
}
async function _o2n(r, box) {
try {
const _on = await S.api.call('feedback.image', { id: r.id });
const src = 'data:' + (_on.mime || 'image/jpeg') + ';base64,' + _on.b64;
const _o18 = h('img', { class: 'fb-thumb', src, alt: 'Ảnh góp ý' });
_o18.addEventListener('click', () => modal({ title: 'Ảnh góp ý', wide: true, body: h('img', { class: 'fb-big', src, alt: 'Ảnh góp ý' }), actions: [{ label: 'Đóng', kind: 'primary' }] }));
ui.mountTo(box, _o18);
} catch (e) { toast((e && (e.userMessage || e.message)) || 'Chưa tải được ảnh.', 'warn'); }
}
function _ou(r) {
const sel = ui.field({ label: 'Trạng thái', type: 'select', value: r.status || 'new', options: STATUSES.map((_o2e) => ({ value: _o2e.value, label: _o2e.label })), id: 'fb-status' });
const note = ui.field({ label: 'Ghi chú cho người gửi', type: 'textarea', value: r.owner_note || '', id: 'fb-note', rows: 3 });
const _oz = h('p', { class: 'form-err', role: 'alert' });
modal({
title: 'Đổi trạng thái góp ý', body: h('div', { class: 'fb-form' }, sel, note, _oz),
actions: [{ label: 'Huỷ', kind: 'ghost' }, { label: 'Lưu', kind: 'primary', id: 'fb-status-save', onClick: async () => {
try {
const _o2c = await S.api.call('feedback.update', { id: r.id, status: sel.getValue(), owner_note: String(note.getValue() || '').trim() });
Object.assign(r, _o2c || { status: sel.getValue(), owner_note: note.getValue() });
toast('Đã lưu trạng thái.', 'ok'); _ot(); return true;
} catch (e) { _oz.textContent = (e && (e.userMessage || e.message)) || 'Chưa lưu được.'; return false; }
} }]
});
}
async function _o2w(r) {
const text = buildClaudePrompt(r, { appUrl: appUrl(), appVersion: config.APP_VERSION });
await ui.copy(text, { silent: true });
const pre = h('textarea', { class: 'fb-text', readonly: true, 'data-testid': 'fb-claude-text', rows: 12 }); pre.value = text;
modal({
title: 'Mang sang Claude', wide: true,
body: h('div', { class: 'fb-form' }, h('p', { class: 'small' }, 'Đã chép yêu cầu vào bộ nhớ tạm. Bấm "Mở Claude" rồi dán (Ctrl/⌘ + V) và gửi.'), pre),
actions: [{ label: 'Chép lại', kind: 'ghost', close: false, onClick: () => ui.copy(text) },
{ label: 'Mở Claude', kind: 'primary', id: 'fb-open-claude', onClick: () => { try { window.open(CLAUDE_URL, '_blank', 'noopener'); } catch { } } }]
});
}
}
const sendSeller = (_o1r) => (sale && _o1c() ? openSellerMail(_o1r || {}) : null);
const api = { queue, flush, openForm, submit: _o2r, openSellerMail, sendSeller, sale, stop: () => clearInterval(_o2v) };
window.__bds = { ...(window.__bds || {}), feedback: api };
return api;
}
export default { KINDS, STATUSES, validateFeedback, scrub, buildClaudePrompt, createQueue, submitFeedback, screenContext, installFeedback };

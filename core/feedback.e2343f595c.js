import { addDefaults } from './xkit.f03faf0986.js';
import * as INST from './instance.0601c79adf.js';
import { isSaleEdition, contactFor, mailtoLink, sellerMail, supportDiagnosticText, supportBlock } from './support.4921a97342.js';
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
const kindLabel = (v) => (KINDS.find((_o1f) => _o1f.value === v) || {}).label || v || '';
export const statusOf = (v) => STATUSES.find((_o2f) => _o2f.value === v) || STATUSES[0];
const _o5 = ['customers', 'inbox', 'home'];
export function validateFeedback({ kind, text } = {}) {
const errors = [];
if (!KINDS.some((_o1f) => _o1f.value === kind)) errors.push('Chọn loại góp ý.');
const _o1r = String(text || '').trim().length;
if (_o1r < MIN_TEXT) errors.push('Mô tả ít nhất ' + MIN_TEXT + ' ký tự (đang có ' + _o1r + ').');
if (_o1r > MAX_TEXT) errors.push('Mô tả tối đa ' + MAX_TEXT + ' ký tự.');
return { ok: !errors.length, errors };
}
export function scrub(text) {
return String(text || '')
.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email đã che]')
.replace(/(?:\+?84|0)(?:[\s.-]?\d){8,10}\b/g, '[số điện thoại đã che]')
.replace(/\b\d{9,}\b/g, '[số đã che]');
}
export function deviceInfo(nav = globalThis.navigator, win = globalThis.window) {
const _o30 = String((nav && nav.userAgent) || '');
const _o1v = /iPhone/.test(_o30) ? 'iPhone' : /iPad/.test(_o30) ? 'iPad' : /Android/.test(_o30) ? 'Android' : /Mac OS X|Macintosh/.test(_o30) ? 'Mac' : /Windows/.test(_o30) ? 'Windows' : /Linux/.test(_o30) ? 'Linux' : 'Khác';
const br = /Edg\//.test(_o30) ? 'Edge' : /CriOS|Chrome\//.test(_o30) ? 'Chrome' : /FxiOS|Firefox\//.test(_o30) ? 'Firefox' : /Safari\//.test(_o30) ? 'Safari' : 'Trình duyệt khác';
const w = win && win.innerWidth, h = win && win.innerHeight;
let _o1q = '';
try { _o1q = win && win.matchMedia && win.matchMedia('(display-mode: standalone)').matches ? 'app cài trên máy' : 'trình duyệt'; } catch { }
return [_o1v, br, w && h ? w + '×' + h : '', _o1q].filter(Boolean).join(' · ');
}
export function screenContext(route, registry, words = {}) {
const r = route || {};
const screen = String(r.screen || 'home');
const mod = r.module ? String(r.module) : '';
let _oz = null;
try { _oz = mod && registry && registry.get ? registry.get(mod) : null; } catch { _oz = null; }
const screenTitle = words[screen] || screen;
const moduleTitle = _oz && _oz.manifest ? _oz.manifest.title : (mod && words['set.' + mod]) || '';
const core = !_oz || _oz.core === true || ['packs', 'settings'].includes(_oz.id);
const label = screenTitle + (mod ? ' › ' + (moduleTitle || mod) : '');
return { screen, module: mod, screenTitle, moduleTitle, label, key: screen + (mod ? '/' + mod : ''), core };
}
export const screenField = (_o2h) => String((_o2h.key || '') + ' · ' + (_o2h.label || '')).slice(0, 200);
const _o3 = /\n*\[Thiết bị: ([^\]]*)\]\s*$/;
export const withDevice = (text, device) => String(text || '').trim() + (device ? '\n\n[Thiết bị: ' + String(device).slice(0, 160) + ']' : '');
export function splitDevice(text) {
const _o2f = String(text || ''); const _o1n = _o2f.match(_o3);
return _o1n ? { text: _o2f.slice(0, _o1n.index).trim(), device: _o1n[1] } : { text: _o2f.trim(), device: '' };
}
export function sourceHint(_o2h) {
const _o2f = _o2h || {};
if (_o2f.module && !['settings', ''].includes(_o2f.module) && !_o2f.core) return 'web/packs/bds/' + _o2f.module + '/index.js';
if (_o2f.screen === 'settings') return 'web/core/settings.js' + (_o2f.module ? ' (mục ' + _o2f.module + ')' : '');
return 'web/core/app.js (màn ' + (_o2f.screen || 'home') + ')';
}
export function buildClaudePrompt(fb, { appUrl = '', appVersion = '', module: mod, sale = false } = {}) {
const _o11 = fb || {};
const _o20 = splitDevice(_o11.text);
const _o2j = String(_o11.screen || '');
const key = _o2j.split(' · ')[0] || '';
const [screen, module] = key.split('/');
const _o2h = { screen: screen || '', module: mod != null ? mod : (module || ''), core: false };
if (_o2h.module && ['memory', 'persona', 'onboarding', 'maintenance', 'feedback', 'version', 'connection', 'profile', 'look', 'security', 'ai', 'budget', 'storage', 'selftest', 'errors', 'users', 'mytg'].includes(_o2h.module) && _o2h.screen === 'settings') _o2h.core = true;
const _ob = String(appUrl || '').replace(/#.*$/, '').replace(/\/?$/, '/');
const _o1k = _ob + '#/settings/feedback?fb=' + encodeURIComponent(String(_o11.id || ''));
const when = _o11.created_at ? new Date(Number(_o11.created_at)).toISOString().slice(0, 10) : '';
const _o2q = statusOf(_o11.status);
const _o1j = [
'Yêu cầu cho app BDS Studio (từ Góp ý trong app' + (_o11.id ? ', mã ' + _o11.id : '') + ')',
'',
'- Loại: ' + kindLabel(_o11.kind),
'- Mô tả: ' + scrub(_o20.text),
'- Màn đang mở khi gửi: ' + (_o2j.split(' · ').slice(1).join(' · ') || key || 'không rõ') + (key ? ' (' + key + ')' : ''),
'- Phiên bản: web ' + (_o11.app_version || '?') + (appVersion && appVersion !== _o11.app_version ? ' (đang chạy ' + appVersion + ')' : ''),
_o20.device ? '- Thiết bị: ' + _o20.device : null,
'- Ảnh chụp màn hình: ' + (_o11.has_image || _o11.image_drive_id ? (sale ? 'có – lưu trong app (đính kèm vào thư nếu cần)' : 'có – xem trong app (Chủ đăng nhập): ' + _o1k) : 'không có'),
'- Trạng thái: ' + _o2q.label + (_o11.owner_note ? ' · Ghi chú của Chủ: ' + scrub(_o11.owner_note) : ''),
when ? '- Ngày gửi: ' + when : null
];
if (sale) return _o1j.filter((x) => x != null).join('\n');
_o1j.push(
'',
'Bối cảnh kỹ thuật (ngắn):',
'- Repo bdsapp: web/ là PWA tĩnh (lõi web/core/, module web/packs/bds/<id>/index.js), gas/ máy chủ Apps Script, engine/ máy dựng Python. Hợp đồng: docs/CONTRACT.md.',
'- Mã liên quan có thể ở: ' + sourceHint(_o2h) + '.',
'- Làm: tìm nguyên nhân/thiết kế → sửa + test (node --test tests/unit, pytest, playwright) → ghi CHANGELOG.md mục bản mới (nhãn [Web]/[Máy dựng]/[Máy chủ]).',
'- Không đưa dữ liệu khách thật vào mã hay test.');
return _o1j.filter((x) => x != null).join('\n');
}
export function isMissingAction(e) {
return !!e && (e.code === 'NOT_FOUND' || e.code === 'UNKNOWN_ACTION' || (e.code === 'BAD_INPUT' && /không được hỗ trợ|not supported|unknown action/i.test(String(e.message || e.userMessage || ''))));
}
const _o1c = (e) => !!e && e.code === 'BAD_INPUT' && /ảnh|Drive|base64|image/i.test(String(e.message || e.userMessage || ''));
export function createQueue(storage = globalThis.localStorage) {
const _o29 = () => { try { const v = JSON.parse(storage.getItem(QUEUE_KEY) || '[]'); return Array.isArray(v) ? v : []; } catch { return []; } };
const _o37 = (_o9) => {
try { storage.setItem(QUEUE_KEY, JSON.stringify(_o9)); return true; } catch {
const _o2p = _o9.map((x, _o18) => (_o18 < _o9.length - 1 && x.payload.image ? { ...x, payload: { ...x.payload, image: null }, image_dropped: true } : x));
try { storage.setItem(QUEUE_KEY, JSON.stringify(_o2p)); return true; } catch { return false; }
}
};
const _o2t = new Set();
const _ox = () => { for (const _oe of _o2t) { try { _oe(_o29()); } catch { } } };
const _o28 = {
list: _o29,
size: () => _o29().length,
on(_oe) { _o2t.add(_oe); return () => _o2t.delete(_oe); },
add(payload, reason = 'offline') {
const _o9 = _o29();
const _o1e = { qid: 'q' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), payload, at: Date.now(), reason, tries: 0 };
_o9.push(_o1e);
while (_o9.length > _o4) _o9.shift();
if (!_o37(_o9)) { _o1e.payload = { ...payload, image: null }; _o1e.image_dropped = true; _o9[_o9.length - 1] = _o1e; _o37(_o9); }
_ox();
return _o1e;
},
remove(qid) { _o37(_o29().filter((x) => x.qid !== qid)); _ox(); },
async flush(api) {
let sent = 0; let reason = '';
for (const _o1e of _o29()) {
try {
await sendOnce(api, _o1e.payload);
_o28.remove(_o1e.qid); sent++;
} catch (e) {
if (e && e.code === 'NETWORK') { reason = 'offline'; break; }
if (isMissingAction(e)) { reason = 'waiting_server'; _o1o(_o1e.qid, { reason }); break; }
if (e && e.code === 'QUOTA') { reason = 'quota'; break; }
const tries = (_o1e.tries || 0) + 1;
if (tries >= 5) _o28.remove(_o1e.qid); else _o1o(_o1e.qid, { tries, reason: 'error', error: String((e && (e.userMessage || e.message)) || e).slice(0, 200) });
}
}
return { sent, kept: _o29().length, reason };
}
};
function _o1o(qid, patch) { _o37(_o29().map((x) => (x.qid === qid ? { ...x, ...patch } : x))); _ox(); }
return _o28;
}
export async function sendOnce(api, payload) {
try { return { row: await api.call('feedback.submit', payload), imageDropped: false }; } catch (e) {
if (payload && payload.image && _o1c(e)) {
const _o1y = { ...payload, image: null, text: String(payload.text || '') };
return { row: await api.call('feedback.submit', _o1y), imageDropped: true, imageError: e.userMessage || e.message };
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
export async function captureApp(_o2e, { win = window, doc = document, maxSide = _o1, quality = 0.82 } = {}) {
const _o7 = win.innerWidth, H = win.innerHeight;
const _o15 = doc.createElement('iframe');
_o15.setAttribute('aria-hidden', 'true'); _o15.tabIndex = -1;
Object.assign(_o15.style, { position: 'fixed', width: '10px', height: '10px', left: '-9999px', top: '0', border: '0', visibility: 'hidden' });
doc.body.appendChild(_o15);
try {
const _o13 = _o15.contentDocument;
const _or = new Map();
const _oq = (el) => {
const key = el.namespaceURI + '|' + el.localName;
if (_or.has(key)) return _or.get(key);
const _oo = _o13.createElementNS(el.namespaceURI || 'http://www.w3.org/1999/xhtml', el.localName);
(el.namespaceURI === 'http://www.w3.org/2000/svg' ? (_o13.body.appendChild(_o13.createElementNS('http://www.w3.org/2000/svg', 'svg'))) : _o13.body).appendChild(_oo);
const cs = _o15.contentWindow.getComputedStyle(_oo); const _o1s = {};
for (let _o18 = 0; _o18 < cs.length; _o18++) _o1s[cs[_o18]] = cs.getPropertyValue(cs[_o18]);
_or.set(key, _o1s); return _o1s;
};
const _o1b = (r) => r.bottom >= -50 && r.top <= H + 50 && r.right >= -50 && r.left <= _o7 + 50;
const _o2r = (el, parentCs, _o16) => {
const cs = win.getComputedStyle(el); const _op = _oq(el); let _o1w = '';
const _o25 = _o16 ? Array.from(cs) : _o0;
for (const _o1y of _o25) {
const v = cs.getPropertyValue(_o1y);
if (!v) continue;
if (_o16 && _o2.has(_o1y) ? (parentCs && parentCs.getPropertyValue(_o1y) === v) : _op[_o1y] === v) continue;
_o1w += _o1y + ':' + v + ';';
}
return { css: _o1w, cs };
};
const _o1a = (_o19) => {
try {
if (!_o19.complete || !_o19.naturalWidth) return null;
const _od = doc.createElement('canvas'); _od.width = _o19.naturalWidth; _od.height = _o19.naturalHeight;
_od.getContext('2d').drawImage(_o19, 0, 0); return _od.toDataURL('image/png');
} catch { return null; }
};
const _o33 = (el, parentCs, isRoot) => {
if (_o6.has(el.tagName)) return null;
const _ol = win.getComputedStyle(el);
if (_ol.display === 'none') return null;
const r = el.getBoundingClientRect();
const _o32 = isRoot || _o1b(r) || _ol.position === 'fixed' || _ol.position === 'sticky';
const { css, cs } = _o2r(el, isRoot ? null : parentCs, _o32);
let _od;
if (el.tagName === 'IMG') {
_od = doc.createElement('img'); const _oo = _o1a(el); if (_oo) _od.setAttribute('src', _oo);
_od.setAttribute('width', String(Math.round(r.width))); _od.setAttribute('height', String(Math.round(r.height)));
} else if (el.tagName === 'CANVAS') {
_od = doc.createElement('img'); try { _od.setAttribute('src', el.toDataURL()); } catch { }
} else _od = el.cloneNode(false);
if (_od.removeAttribute) { _od.removeAttribute('id'); _od.removeAttribute('class'); for (const _o8 of Array.from(_od.attributes || [])) if (/^on/i.test(_o8.name) || _o8.name === 'href' || _o8.name === 'src' && _od.tagName !== 'IMG') _od.removeAttribute(_o8.name); }
if (_od.style) _od.style.cssText = css + (isRoot ? 'margin-top:' + (-win.scrollY) + 'px;' : '');
if (el.tagName === 'INPUT') { if (/^(checkbox|radio)$/i.test(el.type)) { if (el.checked) _od.setAttribute('checked', ''); } else _od.setAttribute('value', el.type === 'password' ? '••••' : el.value); }
if (el.tagName === 'TEXTAREA') _od.textContent = el.value;
if (el.tagName === 'SELECT') { const _o1s = el.options[el.selectedIndex]; const _o2f = doc.createElement('span'); _o2f.textContent = _o1s ? _o1s.text : ''; _o2f.style.cssText = css; return _o2f; }
if (!_o32 || el.tagName === 'IMG' || el.tagName === 'CANVAS' || el.tagName === 'TEXTAREA') return _od;
for (const _of of el.childNodes) {
if (_of.nodeType === 3) _od.appendChild(doc.createTextNode(_of.nodeValue));
else if (_of.nodeType === 1) { const _o1f = _o33(_of, cs, false); if (_o1f) _od.appendChild(_o1f); }
}
return _od;
};
const _oi = _o33(_o2e, null, true);
const _oc = win.getComputedStyle(doc.body);
const _o36 = doc.createElement('div');
_o36.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
_o36.style.cssText = ('width:' + _o7 + 'px;height:' + H + 'px;overflow:hidden;position:relative;background:' + _oc.backgroundColor + ';color:' + _oc.color + ';font-family:' + _oc.fontFamily + ';font-size:' + _oc.fontSize + ';line-height:' + _oc.lineHeight + ';');
_o36.appendChild(_oi);
const _o38 = new win.XMLSerializer().serializeToString(_o36);
const _o2u = '<svg xmlns="http://www.w3.org/2000/svg" width="' + _o7 + '" height="' + H + '"><foreignObject x="0" y="0" width="100%" height="100%">' + _o38 + '</foreignObject></svg>';
const _o19 = new win.Image();
_o19.decoding = 'sync';
await new Promise((_o2d, rej) => { _o19.onload = _o2d; _o19.onerror = () => rej(new Error('Trình duyệt chưa vẽ được ảnh chụp.')); _o19.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(_o2u); });
const _o2i = Math.min(win.devicePixelRatio || 1, 2, maxSide / Math.max(_o7, H));
const _on = doc.createElement('canvas'); _on.width = Math.round(_o7 * _o2i); _on.height = Math.round(H * _o2i);
const _o17 = _on.getContext('2d'); _o17.fillStyle = _oc.backgroundColor || '#fff'; _o17.fillRect(0, 0, _on.width, _on.height);
_o17.drawImage(_o19, 0, 0, _on.width, _on.height);
return _on.toDataURL('image/jpeg', quality);
} finally { _o15.remove(); }
}
export async function fileToDataUrl(file, { maxSide = _o1, quality = 0.85 } = {}) {
const _o31 = URL.createObjectURL(file);
try {
const _o19 = new Image();
await new Promise((_o2d, rej) => { _o19.onload = _o2d; _o19.onerror = () => rej(new Error('Không đọc được ảnh này.')); _o19.src = _o31; });
const _o2f = Math.min(1, maxSide / Math.max(_o19.naturalWidth, _o19.naturalHeight));
const _od = document.createElement('canvas'); _od.width = Math.round(_o19.naturalWidth * _o2f); _od.height = Math.round(_o19.naturalHeight * _o2f);
const _o17 = _od.getContext('2d'); _o17.fillStyle = '#fff'; _o17.fillRect(0, 0, _od.width, _od.height); _o17.drawImage(_o19, 0, 0, _od.width, _od.height);
return _od.toDataURL('image/jpeg', quality);
} finally { URL.revokeObjectURL(_o31); }
}
function _o1p(h, dataUrl, onChange) {
const _on = h('canvas', { class: 'fb-canvas', 'data-testid': 'fb-canvas', 'aria-label': 'Ảnh chụp – kéo để che vùng nhạy cảm' });
Object.assign(_on.style, { width: '100%', maxHeight: '320px', objectFit: 'contain', touchAction: 'none', cursor: 'crosshair', borderRadius: '11px', border: '1px solid var(--line)' });
const _o19 = new Image(); const _o2b = []; let _om = null;
const _ou = () => {
const _o17 = _on.getContext('2d'); _o17.drawImage(_o19, 0, 0, _on.width, _on.height); _o17.fillStyle = '#111';
for (const r of _o2b.concat(_om ? [_om] : [])) _o17.fillRect(Math.min(r.x, r.x + r.w), Math.min(r.y, r.y + r.h), Math.abs(r.w), Math.abs(r.h));
};
_o19.onload = () => { _on.width = _o19.naturalWidth; _on.height = _o19.naturalHeight; _ou(); };
_o19.src = dataUrl;
const _o26 = (e) => { const _oa = _on.getBoundingClientRect(); const _o2v = _on.width / _oa.width, sy = _on.height / _oa.height; return { x: (e.clientX - _oa.left) * _o2v, y: (e.clientY - _oa.top) * sy }; };
_on.addEventListener('pointerdown', (e) => { e.preventDefault(); try { _on.setPointerCapture(e.pointerId); } catch { } const _o1y = _o26(e); _om = { x: _o1y.x, y: _o1y.y, w: 0, h: 0 }; });
_on.addEventListener('pointermove', (e) => { if (!_om) return; const _o1y = _o26(e); _om.w = _o1y.x - _om.x; _om.h = _o1y.y - _om.y; _ou(); });
const _oy = () => { if (_om && Math.abs(_om.w) > 4 && Math.abs(_om.h) > 4) { _o2b.push(_om); if (onChange) onChange(_o2b.length); } _om = null; _ou(); };
_on.addEventListener('pointerup', _oy); _on.addEventListener('pointercancel', _oy);
return {
el: _on,
undo() { _o2b.pop(); _ou(); if (onChange) onChange(_o2b.length); },
count: () => _o2b.length,
dataUrl: () => { try { return _on.width ? _on.toDataURL('image/jpeg', 0.85) : dataUrl; } catch { return dataUrl; } }
};
}
const _o2y = (dataUrl) => {
const _o1n = String(dataUrl || '').match(/^data:(image\/(?:jpeg|png|webp));base64,(.+)$/);
return _o1n ? { mime: _o1n[1], b64: _o1n[2] } : null;
};
export function installFeedback({ S, appHooks, ui, config = {}, t = (_o1f) => _o1f }) {
const { h, button, toast, modal, badge } = ui;
const sale = isSaleEdition(config);
const _oj = contactFor(config);
addDefaults({ 'help.feedback': sale
? 'Góp ý: gửi yêu cầu thêm, bớt, sửa chức năng hoặc báo lỗi – bấm nút 💬 ở góc dưới phải ở bất kỳ màn nào.\nApp tự kèm tên màn đang mở, phiên bản và loại thiết bị; không kèm dữ liệu khách. Ảnh chụp màn hình nên che phần có tên/số điện thoại khách trước khi gửi.\nGóp ý được lưu trong app của anh/chị (Chủ tài khoản xem và đổi trạng thái). Muốn bên hỗ trợ (người bán) nhận được, Chủ tài khoản bấm "Gửi cho người bán": app mở email soạn sẵn nội dung và thông tin kỹ thuật (không kèm dữ liệu khách, khoá, mật khẩu).' + (_oj.text ? '\nLiên hệ hỗ trợ: ' + _oj.text + '.' : '')
: 'Góp ý: gửi yêu cầu thêm, bớt, sửa chức năng hoặc báo lỗi cho chủ app – bấm nút 💬 ở góc dưới phải ở bất kỳ màn nào.\nApp tự kèm tên màn đang mở, phiên bản và loại thiết bị; không kèm dữ liệu khách. Ảnh chụp màn hình nên che phần có tên/số điện thoại khách trước khi gửi.\nChủ xem mọi góp ý, đổi trạng thái (Mới / Đang xem / Sẽ làm / Đã làm / Không làm) và bấm "Mang sang Claude" để soạn sẵn yêu cầu sửa app.' });
const _o1d = () => { const _o2z = S.user || {}; return !_o2z.role || _o2z.role === 'owner'; };
const _os = (screen, device) => supportDiagnosticText({
versions: { web: config.APP_VERSION || '', server: (S.status && S.status.version) || '', edition: (S.status && S.status.edition) || config.edition || '' },
screen, device,
errors: appHooks.errors && typeof appHooks.errors.recent === 'function' ? appHooks.errors.recent().slice(-5).reverse() : []
});
function openSellerMail({ kind = '', text = '', screen = '', device = '', id = '' } = {}) {
const _o1n = sellerMail({ kind, kindLabel: kindLabel(kind), text: scrub(text), diag: _os(screen, device), id });
const href = mailtoLink(_oj.email, _o1n.subject, _o1n.body);
const _o16 = _o1n.subject + '\n\n' + _o1n.body;
const pre = h('textarea', { class: 'fb-text', readonly: true, rows: 10, 'data-testid': 'fb-seller-text' }); pre.value = _o16;
const api = { href, text: _o16 };
if (window.__bds && window.__bds.feedback) window.__bds.feedback.lastSellerMail = api;
modal({
title: 'Gửi cho người bán', wide: true, cls: 'fb-modal',
body: h('div', { class: 'fb-form', 'data-testid': 'fb-seller' },
h('p', { class: 'small' }, href
? 'Góp ý đã lưu trong app. Bấm "Mở email" – app soạn sẵn thư tới ' + _oj.email + ' gồm nội dung và thông tin kỹ thuật (không kèm dữ liệu khách, khoá, mật khẩu). Ảnh chụp màn hình: đính kèm vào thư nếu cần.'
: 'Góp ý đã lưu trong app. Chép nội dung bên dưới và gửi cho người bán qua kênh anh/chị vẫn liên hệ.'),
supportBlock(h, { cfg: config, lead: 'Liên hệ hỗ trợ:', testid: 'fb-support' }),
pre,
href ? h('div', { class: 'btn-row' }, h('a', { class: 'btn btn-primary', href, 'data-testid': 'fb-seller-mailto' }, h('span', null, 'Mở email'))) : null),
actions: [{ label: 'Chép nội dung', kind: 'ghost', close: false, onClick: () => ui.copy(_o16) }, { label: 'Đóng', kind: 'secondary' }]
});
return api;
}
const queue = createQueue();
const words = { home: t('screen.home'), customers: t('screen.customers'), sales: t('screen.sales'), content: t('screen.content'), inbox: t('screen.inbox'), settings: t('screen.settings'), 'set.feedback': 'Góp ý' };
const appUrl = () => (typeof location !== 'undefined' && !/^http:\/\/(127\.0\.0\.1|localhost)/.test(location.origin) ? location.origin + location.pathname : (INST.publicUrl() || ''));
let _o12 = document.querySelector('.fb-fab');
if (!_o12) {
_o12 = h('button', { type: 'button', class: 'fb-fab', id: 'fb-fab', 'data-testid': 'fb-fab', 'aria-label': 'Góp ý', title: 'Góp ý cho app' },
h('span', { class: 'fb-fab-ico', 'aria-hidden': 'true' }, '💬'), h('span', { class: 'fb-fab-label' }, 'Góp ý'), h('span', { class: 'fb-fab-n', hidden: true }));
document.body.appendChild(_o12);
}
_o12.onclick = () => openForm();
if (!window.__bdsFbScroll) {
window.__bdsFbScroll = true;
const _o1h = new WeakMap();
let _ot = false, _o2w = 0;
const _o23 = () => typeof matchMedia !== 'function' || matchMedia('(max-width: 899px)').matches;
const _ok = (_oa) => {
const L = _oa.offsetLeft, T = _oa.offsetTop, _o7 = _oa.offsetWidth, H = _oa.offsetHeight;
if (!_o7 || !H || typeof document.elementsFromPoint !== 'function') return false;
const _o27 = [[L + _o7 / 2, T + H / 2], [L + 6, T + H / 2], [L + _o7 - 6, T + H / 2], [L + _o7 / 2, T + 6], [L + _o7 / 2, T + H - 6]];
if (_o27.some(([x, y]) => document.elementsFromPoint(x, y).some((el) => el !== _oa && !_oa.contains(el) && !el.closest('.fb-fab, .nav, nav, .toasts')
&& !!el.closest('button, a[href], input, select, textarea, [role="button"]')))) return true;
return [...document.querySelectorAll('.view :is(button, a[href], input, select, textarea, [role="button"])')].some((el) => {
const _o28 = el.getBoundingClientRect();
return _o28.width > 0 && _o28.height > 0 && _o28.left < L + _o7 && L < _o28.right && _o28.top < T + H && T < _o28.bottom;
});
};
const apply = () => {
const _oa = document.getElementById('fb-fab');
if (!_oa) return;
if (!_o23()) { _oa.classList.remove('fb-fab-away'); return; }
_oa.classList.toggle('fb-fab-away', _ot || _ok(_oa));
};
const _o1i = (ms = 140) => { clearTimeout(_o2w); _o2w = setTimeout(apply, ms); };
window.addEventListener('scroll', (e) => {
if (!_o23()) return;
const el = e.target && e.target.nodeType === 1 ? e.target : (document.scrollingElement || document.documentElement);
const y = el.scrollTop || 0, prev = _o1h.has(el) ? _o1h.get(el) : y;
_o1h.set(el, y);
if (y < 24 || y - prev < -6) _ot = false;
else if (y - prev > 6) _ot = true;
const _oa = document.getElementById('fb-fab');
if (_oa && _ot) _oa.classList.add('fb-fab-away');
_o1i();
}, { capture: true, passive: true });
window.addEventListener('hashchange', () => { _ot = false; _o1i(900); setTimeout(apply, 2500); });
window.addEventListener('resize', () => _o1i(300));
_o1i(1500); setTimeout(apply, 3500);
}
const _o1z = () => { const _o1r = queue.size(); const _oa = _o12.querySelector('.fb-fab-n'); _oa.hidden = !_o1r; _oa.textContent = String(_o1r); _oa.title = _o1r ? _o1r + ' góp ý chờ gửi' : ''; };
queue.on(_o1z); _o1z();
const flush = async () => {
if (!queue.size() || !S.api || !S.api.hasValidToken || !S.api.hasValidToken()) return null;
const r = await queue.flush(S.api).catch(() => null);
if (r && r.sent) toast('Đã gửi ' + r.sent + ' góp ý đang chờ.', 'ok');
return r;
};
if (!window.__bdsFbOnline) { window.__bdsFbOnline = true; window.addEventListener('online', () => { const x = window.__bds && window.__bds.feedback; if (x) x.flush(); }); }
if (queue.size()) setTimeout(flush, 2500);
const _o2w = setInterval(flush, 120000);
appHooks.openFeedback = (_o1s) => openForm(_o1s);
appHooks.submitFeedback = (_o1s) => _o2s(_o1s);
appHooks.lateSections = (ctx) => [['feedback', 'help', 'Góp ý', (body) => _o2c(body, ctx)]];
async function _o2s({ kind = 'add', text = '' } = {}) {
const v = validateFeedback({ kind, text });
if (!v.ok) throw new Error(v.errors.join(' '));
const _o2h = screenContext(S.route, S.registry, words);
return submitFeedback(S.api, queue, { kind, text: withDevice(String(text).trim(), deviceInfo()), screen: screenField(_o2h), app_version: config.APP_VERSION || '', image: null });
}
function openForm({ kind = '', text: pre = '', onSaved = null } = {}) {
const _o2h = screenContext(S.route, S.registry, words);
const device = deviceInfo();
const version = config.APP_VERSION || '';
let _oh = kind; let _o2n = null; let _ow = null;
const _o1g = KINDS.map((_o1f) => {
const _oa = h('button', { type: 'button', class: 'fb-kind', 'aria-pressed': String(_o1f.value === _oh), dataset: { kind: _o1f.value }, 'data-testid': 'fb-kind-' + _o1f.value },
h('span', { 'aria-hidden': 'true' }, _o1f.icon), h('span', null, _o1f.label));
_oa.addEventListener('click', () => { _oh = _o1f.value; for (const x of _o1g) x.setAttribute('aria-pressed', String(x.dataset.kind === _oh)); });
return _oa;
});
const text = h('textarea', { class: 'fb-text', id: 'fb-text', 'data-testid': 'fb-text', maxlength: String(MAX_TEXT), placeholder: 'Mô tả cụ thể: muốn thêm/bớt/sửa gì, hoặc lỗi xảy ra khi làm gì…', 'aria-label': 'Mô tả' });
const count = h('span', { class: 'muted small fb-count num' }, '0/' + MIN_TEXT);
const _o2a = () => { const _o1r = text.value.trim().length; count.textContent = _o1r < MIN_TEXT ? _o1r + '/' + MIN_TEXT : _o1r + ' ký tự'; };
text.addEventListener('input', _o2a);
if (pre) { text.value = String(pre).slice(0, MAX_TEXT); _o2a(); }
const _o10 = h('p', { class: 'form-err', role: 'alert', 'data-testid': 'fb-err' });
const shotBox = h('div', { class: 'fb-shot', 'data-testid': 'fb-shot' });
const _o14 = h('input', { type: 'file', accept: 'image/*', hidden: true, style: { display: 'none' }, 'data-testid': 'fb-file' });
const _o2k = _o5.includes(_o2h.screen);
const masked = h('input', { type: 'checkbox', id: 'fb-masked', 'data-testid': 'fb-masked' });
const _o2m = (dataUrl) => {
_o2n = dataUrl;
if (!dataUrl) { ui.mountTo(shotBox); _ow = null; return; }
const _o1r = h('span', { class: 'muted small', 'data-testid': 'fb-mask-n' }, 'Chưa che vùng nào');
_ow = _o1p(h, dataUrl, (_o1f) => { _o1r.textContent = _o1f ? 'Đã che ' + _o1f + ' vùng' : 'Chưa che vùng nào'; if (_o1f) masked.checked = true; });
ui.mountTo(shotBox,
h('p', { class: 'fb-warn small', 'data-testid': 'fb-privacy' }, '⚠️ Ảnh có thể chứa tên, số điện thoại hoặc dữ liệu của khách' + (_o2k ? ' (màn này có danh sách khách)' : '') + '. Kéo trên ảnh để che đen trước khi gửi.'),
_ow.el,
h('div', { class: 'btn-row' }, button('Hoàn tác che', () => _ow.undo(), { kind: 'ghost', small: true }), button('Bỏ ảnh', () => _o2m(null), { kind: 'ghost', small: true, testid: 'fb-shot-remove' }), _o1r),
h('label', { class: 'fb-check small' }, masked, h('span', null, ' Đã che dữ liệu khách (hoặc ảnh không có dữ liệu khách)')));
};
_o14.addEventListener('change', async () => {
const _o11 = _o14.files && _o14.files[0]; _o14.value = '';
if (!_o11) return;
try { _o2m(await fileToDataUrl(_o11)); } catch (e) { _o10.textContent = e.message; }
});
const capBtn = button('Chụp màn hình app', async () => {
try {
const _o2e = document.getElementById('app');
_o2m(await captureApp(_o2e));
} catch (e) {
_o10.textContent = 'Trình duyệt này chưa chụp được – bấm "Chọn ảnh" và chọn ảnh chụp màn hình có sẵn.';
try { window.dispatchEvent(new CustomEvent('bds:error', { detail: { level: 'warn', where: 'feedback.capture', message: String(e && e.message || e) } })); } catch { }
}
}, { kind: 'secondary', icon: '📸', testid: 'fb-capture' });
const _o24 = button('Chọn ảnh', () => _o14.click(), { kind: 'secondary', icon: '🖼️', testid: 'fb-pick' });
const meta = h('p', { class: 'fb-meta', 'data-testid': 'fb-meta' }, 'Tự kèm: màn ' + _o2h.label + ' · phiên bản ' + (version || '?') + ' · ' + device + '. Không kèm dữ liệu khách.');
const body = h('form', { class: 'fb-form', 'data-testid': 'fb-form', novalidate: true },
h('div', null, h('p', { class: 'small', style: { margin: '0 0 6px' } }, h('strong', null, 'Loại góp ý')), h('div', { class: 'fb-kinds', role: 'group', 'aria-label': 'Loại góp ý' }, _o1g)),
h('label', { for: 'fb-text', class: 'small' }, h('strong', null, 'Mô tả'), ' (ít nhất ' + MIN_TEXT + ' ký tự)'), text, count,
h('div', null, h('p', { class: 'small', style: { margin: '0 0 6px' } }, h('strong', null, 'Ảnh chụp màn hình'), ' (không bắt buộc)'), h('div', { class: 'btn-row' }, capBtn, _o24), _o14),
shotBox, meta, _o10);
const _o2g = async () => {
_o10.textContent = '';
const v = validateFeedback({ kind: _oh, text: text.value });
if (!v.ok) { _o10.textContent = v.errors.join(' '); return false; }
if (_o2n && !masked.checked) { _o10.textContent = 'Đánh dấu "Đã che dữ liệu khách" (che vùng nhạy cảm trên ảnh trước) hoặc bỏ ảnh.'; return false; }
const payload = { kind: _oh, text: withDevice(text.value.trim(), device), screen: screenField(_o2h), app_version: version, image: _o2n ? _o2y(_ow ? _ow.dataUrl() : _o2n) : null };
try {
const r = await submitFeedback(S.api, queue, payload);
if (r.status === 'queued') toast(r.reason === 'offline' ? 'Đang ngoại tuyến – góp ý đã xếp hàng, có mạng sẽ tự gửi.' : 'Máy chủ chưa cập nhật phần Góp ý – đã xếp hàng, sẽ tự gửi khi máy chủ sẵn sàng.', 'info', 5000);
else toast('Đã gửi góp ý. Cảm ơn!' + (r.imageDropped ? ' (Ảnh chưa lưu được: ' + (r.imageError || 'máy chủ chưa bật Drive') + ')' : ''), 'ok', 4500);
if (typeof onSaved === 'function') { try { onSaved(r); } catch { } }
return r;
} catch (e) { _o10.textContent = (e && (e.userMessage || e.message)) || 'Chưa gửi được.'; return false; }
};
const _o1n = modal({
title: '💬 Góp ý cho app', body, cls: 'fb-modal',
actions: [
{ label: 'Huỷ', kind: 'ghost' },
sale && _o1d() ? { label: 'Gửi cho người bán', kind: 'secondary', id: 'fb-send-seller', onClick: async () => {
const r = await _o2g();
if (!r) return false;
const sent = r.row || r.data || {};
setTimeout(() => openSellerMail({ kind: _oh, text: text.value.trim(), screen: _o2h.label, device, id: sent.id || '' }), 0);
return true;
} } : null,
{ label: 'Gửi góp ý', kind: 'primary', id: 'fb-send', onClick: async () => !!(await _o2g()) }
].filter(Boolean)
});
setTimeout(() => { try { (_oh ? text : _o1g[0]).focus({ preventScroll: true }); } catch { } }, 50);
return _o1n;
}
async function _o2c(body, ctx) {
const user = (ctx && ctx.user) || S.user || {};
const _o1x = !user.role || user.role === 'owner';
let filter = '';
let rows = []; let _o2l = '';
const _o1l = h('div', { class: 'fb-list', 'data-testid': 'fb-list' }, ui.spinner());
const _og = [{ value: '', label: 'Tất cả' }, ...STATUSES].map((_o2f) => {
const _oa = h('button', { type: 'button', class: 'fb-kind', 'aria-pressed': String(_o2f.value === filter), dataset: { status: _o2f.value }, 'data-testid': 'fb-filter-' + (_o2f.value || 'all') }, _o2f.label);
_oa.addEventListener('click', () => { filter = _o2f.value; for (const x of _og) x.setAttribute('aria-pressed', String(x.dataset.status === filter)); _ou(); });
return _oa;
});
body.append(
h('p', { class: 'muted small', 'data-testid': 'fb-lead' }, _o1x
? (sale ? 'Mọi góp ý của người dùng app (lưu trong app của anh/chị). Đổi trạng thái để người gửi biết; muốn bên hỗ trợ (người bán) nhận được, bấm "Gửi cho người bán" ở từng góp ý.' : 'Mọi góp ý của người dùng app. Đổi trạng thái để người gửi biết; "Mang sang Claude" soạn sẵn yêu cầu để Claude sửa.')
: 'Góp ý anh/chị đã gửi và trạng thái xử lý.'),
sale && _o1x ? supportBlock(h, { cfg: config, lead: 'Liên hệ hỗ trợ:', testid: 'fb-support' }) : null,
h('div', { class: 'btn-row' }, button('Gửi góp ý mới', () => openForm({ onSaved: () => { if (body.isConnected) _o1m(); } }), { kind: 'primary', icon: 'plus', testid: 'fb-new' }), button('Tải lại', () => _o1m(), { kind: 'ghost', icon: 'refresh' })),
h('div', { class: 'fb-filter', role: 'group', 'aria-label': 'Lọc trạng thái' }, _og),
_o1l);
const _o1u = queue.on(() => _ou());
const _o1t = new MutationObserver(() => { if (!body.isConnected) { _o1u(); _o1t.disconnect(); } });
if (body.parentNode) _o1t.observe(document.body, { childList: true, subtree: true });
await _o1m();
async function _o1m() {
_o2l = '';
try {
const r = await S.api.call('feedback.list', {});
rows = (Array.isArray(r) ? r : (r && (r.items || r.rows)) || []).filter((x) => !Number(x.deleted));
} catch (e) {
rows = [];
_o2l = isMissingAction(e) ? 'Máy chủ chưa cập nhật phần Góp ý – góp ý gửi đi được xếp hàng và sẽ tự gửi khi máy chủ sẵn sàng.' : (e && e.code === 'NETWORK' ? 'Đang ngoại tuyến.' : ((e && (e.userMessage || e.message)) || ''));
}
_ou();
}
function _ou() {
const _o21 = queue.list();
const _o34 = rows.filter((r) => !filter || (r.status || 'new') === filter);
const items = [];
if (_o2l) items.push(h('p', { class: 'muted small', 'data-testid': 'fb-server-note' }, _o2l));
if (!filter) for (const _o1y of _o21) items.push(_o22(_o1y));
for (const r of _o34) items.push(row(r));
if (!items.length || (items.length === 1 && _o2l)) items.push(ui.empty(filter ? 'Không có góp ý ở trạng thái này.' : 'Chưa có góp ý nào.'));
ui.mountTo(_o1l, items);
const focus = ctx && ctx.route && ctx.route.query && ctx.route.query.get && ctx.route.query.get('fb');
if (focus) { const el = _o1l.querySelector('[data-fb="' + CSS.escape(focus) + '"]'); if (el) el.scrollIntoView({ block: 'center' }); }
}
function _o22(_o1y) {
const _o1f = KINDS.find((x) => x.value === _o1y.payload.kind) || {};
return h('div', { class: 'fb-item fb-pending', 'data-testid': 'fb-pending' },
h('div', { class: 'row-line' }, badge('Chờ gửi', 'warn'), h('strong', null, (_o1f.icon || '') + ' ' + (_o1f.label || '')), h('span', { class: 'muted small num' }, ui.date(_o1y.at, true))),
h('div', { class: 'fb-desc small' }, splitDevice(_o1y.payload.text).text),
h('span', { class: 'muted small' }, _o1y.reason === 'waiting_server' ? 'Chờ máy chủ cập nhật phần Góp ý.' : _o1y.reason === 'error' ? 'Lỗi: ' + (_o1y.error || '') : 'Chờ có mạng.'),
h('div', { class: 'btn-row' }, button('Gửi lại', async () => { const r = await queue.flush(S.api); if (r.sent) { toast('Đã gửi.', 'ok'); _o1m(); } else toast(r.reason === 'offline' ? 'Vẫn ngoại tuyến.' : 'Máy chủ chưa nhận – giữ trong hàng đợi.', 'info'); }, { kind: 'secondary', small: true, testid: 'fb-retry' }),
button('Bỏ', () => queue.remove(_o1y.qid), { kind: 'ghost', small: true })));
}
function row(r) {
const _o1f = KINDS.find((x) => x.value === r.kind) || { label: r.kind, icon: '' };
const _o2q = statusOf(r.status);
const _o20 = splitDevice(r.text);
const _o35 = r.full_name || r.username || '';
const imgBox = h('div');
const el = h('div', { class: 'fb-item', dataset: { fb: r.id, status: _o2q.value }, 'data-testid': 'fb-item' },
h('div', { class: 'row-line' }, badge(_o2q.label, _o2q.tone), h('strong', null, (_o1f.icon || '') + ' ' + _o1f.label), h('span', { class: 'muted small num' }, ui.date(r.created_at, true)), _o1x && _o35 ? h('span', { class: 'muted small' }, '· ' + _o35) : null),
h('div', { class: 'fb-desc' }, _o20.text),
h('span', { class: 'muted small' }, [r.screen ? 'Màn: ' + String(r.screen).split(' · ').slice(1).join(' · ') : '', r.app_version ? 'v' + r.app_version : '', _o20.device].filter(Boolean).join(' · ')),
r.owner_note ? h('p', { class: 'small' }, h('strong', null, 'Ghi chú: '), r.owner_note) : null,
imgBox,
h('div', { class: 'btn-row' },
r.has_image || r.image_drive_id ? button('Xem ảnh', () => _o2o(r, imgBox), { kind: 'ghost', small: true, testid: 'fb-image' }) : null,
_o1x ? button('Đổi trạng thái', () => _ov(r), { kind: 'secondary', small: true, testid: 'fb-edit' }) : null,
_o1x && !sale ? button('Mang sang Claude', () => _o2x(r), { kind: 'primary', small: true, icon: 'sparkle', testid: 'fb-claude' }) : null,
_o1x && sale ? button('Gửi cho người bán', () => openSellerMail({ kind: r.kind, text: _o20.text, screen: r.screen ? String(r.screen).split(' · ').slice(1).join(' · ') : '', device: _o20.device, id: r.id }), { kind: 'primary', small: true, testid: 'fb-seller-btn' }) : null));
return el;
}
async function _o2o(r, box) {
try {
const _oo = await S.api.call('feedback.image', { id: r.id });
const src = 'data:' + (_oo.mime || 'image/jpeg') + ';base64,' + _oo.b64;
const _o19 = h('img', { class: 'fb-thumb', src, alt: 'Ảnh góp ý' });
_o19.addEventListener('click', () => modal({ title: 'Ảnh góp ý', wide: true, body: h('img', { class: 'fb-big', src, alt: 'Ảnh góp ý' }), actions: [{ label: 'Đóng', kind: 'primary' }] }));
ui.mountTo(box, _o19);
} catch (e) { toast((e && (e.userMessage || e.message)) || 'Chưa tải được ảnh.', 'warn'); }
}
function _ov(r) {
const sel = ui.field({ label: 'Trạng thái', type: 'select', value: r.status || 'new', options: STATUSES.map((_o2f) => ({ value: _o2f.value, label: _o2f.label })), id: 'fb-status' });
const note = ui.field({ label: 'Ghi chú cho người gửi', type: 'textarea', value: r.owner_note || '', id: 'fb-note', rows: 3 });
const _o10 = h('p', { class: 'form-err', role: 'alert' });
modal({
title: 'Đổi trạng thái góp ý', body: h('div', { class: 'fb-form' }, sel, note, _o10),
actions: [{ label: 'Huỷ', kind: 'ghost' }, { label: 'Lưu', kind: 'primary', id: 'fb-status-save', onClick: async () => {
try {
const _o2d = await S.api.call('feedback.update', { id: r.id, status: sel.getValue(), owner_note: String(note.getValue() || '').trim() });
Object.assign(r, _o2d || { status: sel.getValue(), owner_note: note.getValue() });
toast('Đã lưu trạng thái.', 'ok'); _ou(); return true;
} catch (e) { _o10.textContent = (e && (e.userMessage || e.message)) || 'Chưa lưu được.'; return false; }
} }]
});
}
async function _o2x(r) {
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
const api = { queue, flush, openForm, submit: _o2s, openSellerMail, sale, stop: () => clearInterval(_o2w) };
window.__bds = { ...(window.__bds || {}), feedback: api };
return api;
}
export default { KINDS, STATUSES, validateFeedback, scrub, buildClaudePrompt, createQueue, submitFeedback, screenContext, installFeedback };

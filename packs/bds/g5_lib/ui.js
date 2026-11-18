import { kit, h } from '../_lib/kit.js';
import { imagesToPdf } from './pdf.js';
import { localEstimate, costText, pdfPages } from './aicost.js';
export { h };
export const PACK = 'g5';
export const BADGE = 'Thử nghiệm';
export const ARCHIVED = 'luu_tru';
const _o0 = 'bds-g5-css';
export function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
const _oc = document.createElement('link');
_oc.id = _o0; _oc.rel = 'stylesheet'; _oc.href = new URL('./g5.css', import.meta.url).href;
document.head.appendChild(_oc);
}
export const parse = (v, fb) => { if (v && typeof v === 'object') return v; try { const x = JSON.parse(v); return x == null ? fb : x; } catch { return fb; } };
export function g5(ctx) {
ensureCss();
const K = kit(ctx);
const G = {
K, h, ctx,
head(title, sub, testid) {
return h('header', { class: 'g5-head', 'data-testid': testid },
h('div', { class: 'g5-head-t' }, h('h2', null, title), K.badge(BADGE, 'warn')),
sub ? h('p', { class: 'bds-muted g5-sub' }, sub) : null);
},
note(text, tone = 'info', testid) { return h('p', { class: 'g5-note g5-note-' + tone, role: tone === 'warn' ? 'alert' : null, 'data-testid': testid }, text); },
num(v, fb = 0) { const n = Number(String(v ?? '').replace(',', '.')); return Number.isFinite(n) ? n : fb; },
input(attrs = {}) { return h('input', { type: 'text', ...attrs }); },
field(label, input, help) { return K.field(label, input, help); },
select(options, value, attrs) { return K.select(options, value, attrs); },
tabs(items, value, onChange, testid) {
const _oo = h('div', { class: 'g5-tabs', role: 'tablist', 'data-testid': testid });
const _o9 = (v) => { _oo.replaceChildren(...items.map(([id, label]) => h('button', { type: 'button', role: 'tab', class: 'bds-chip g5-tab' + (id === v ? ' on' : ''), 'aria-selected': id === v ? 'true' : 'false', 'data-testid': (testid || 'tab') + '-' + id, onclick: () => { _o9(id); onChange(id); } }, label))); };
_o9(value);
_oo.set = _o9;
return _oo;
},
async listDocs(kind) {
const _om = (await K.list('objects')).filter((o) => o.kind === kind && o.status !== ARCHIVED);
return _om.map((o) => ({ id: o.id, name: o.name || '', data: parse(o.data, {}), updated_at: Number(o.updated_at) || 0, row: o }))
.sort((_o2, b) => b.updated_at - _o2.updated_at);
},
async getDoc(kind, id) { const o = await K.get('objects', id); return o && o.kind === kind && !Number(o.deleted) && o.status !== ARCHIVED ? { id: o.id, name: o.name || '', data: parse(o.data, {}), row: o } : null; },
async saveDoc(kind, { id, name, data }) {
const _oj = id ? await K.get('objects', id) : null;
const text = JSON.stringify(data || {});
if (text.length > 45000) throw new Error('Dữ liệu quá lớn để đồng bộ (tối đa ~45.000 ký tự).');
const row = { ...(_oj || {}), id: id || undefined, kind, name: String(name || '').slice(0, 120), data: text, source: 'manual' };
if (!_oj) row.created_at = Date.now();
return K.put('objects', row);
},
confirmDel(what, testid = 'g5-del-confirm') { return K.confirm({ title: 'Xoá', text: `Xoá "${String(what || 'mục này').slice(0, 120)}"? Không hoàn tác được.`, ok: 'Xoá', kind: 'danger', testid }); },
canErase() { const _oi = ctx.user && ctx.user.perms; return !_oi || _oi.erase !== false; },
async removeDoc(id) { const o = await K.get('objects', id); if (o) await K.put('objects', G.canErase() ? { ...o, deleted: 1 } : { ...o, status: ARCHIVED }); },
aiReady() { try { return !!(ctx.ai && (typeof ctx.ai.connected !== 'function' || ctx.ai.connected())); } catch { return false; } },
async ai(prompt, { json = false, feature = 'g5_assist' } = {}) {
if (!ctx.ai || typeof ctx.ai.run !== 'function') throw new Error('Chưa nối AI');
const _ol = await ctx.ai.run('assistant', { prompt, json, feature });
return String((_ol && _ol.text) || '');
},
async aiEstimate(images = 1, chars = 3000) {
try { const _ol = await K.api('catalog.extract', { estimate_only: true, images, chars }); if (_ol && _ol.estimate) return _ol.estimate; } catch { }
let free = true;
try { if (ctx.settings && typeof ctx.settings.get === 'function') free = ctx.settings.get('ai.gemini_free', true) !== false; } catch { }
return localEstimate({ images, chars, free });
},
async aiRead({ title, prompt, images, testid, what = 'lần đọc này' }) {
if (!ctx.ai || typeof ctx.ai.run !== 'function') throw new Error('Chưa nối AI');
const _oa = await G.aiEstimate(images.reduce((t, _ob) => t + (_ob.pages || 1), 0), prompt.length);
if (_oa.enabled === false) {
await new Promise((res) => { const _oe = K.modal({ title, testid, body: [h('p', { 'data-testid': (testid || 'ai') + '-cost' }, costText(_oa, { what })), h('div', { class: 'bds-row bds-end' }, K.button('Đóng', () => { _oe.close(); res(); }, { testid: (testid || 'ai') + '-close' }))] }); });
return null;
}
const ok = await K.confirm({ title, testid, ok: 'Đồng ý chi phí – cho AI đọc',
text: costText(_oa, { what }) + ' Ảnh/PDF được gửi tới Google Gemini qua máy chủ của công ty để đọc, không lưu lại trên máy chủ. AI có thể đọc sai – anh/chị soát lại từng số trước khi dùng.' });
if (!ok) return null;
const _ol = await ctx.ai.run('read_layout', { prompt, images: images.map((_ob) => ({ mime: _ob.mime, b64: _ob.b64 })), json: true, provider: 'gemini', feature: 'g5_map_read', confirmed: true });
return { text: String((_ol && (_ol.text ?? _ol)) || ''), cost_usd: Number(_ol && _ol.cost_usd) || 0, model: (_ol && _ol.model) || '' };
},
async aiChat(prompt) {
if (!ctx.ai || typeof ctx.ai.handoff !== 'function') throw new Error('Chưa có trợ lý chat');
return ctx.ai.handoff('read_policy', prompt + '\n\n(Đính kèm ảnh/PDF vào khung chat rồi gửi. Chép nguyên JSON AI trả lời, dán lại vào app.)');
},
canChat() { return !!(ctx.ai && typeof ctx.ai.handoff === 'function'); },
download(name, data, mime = 'application/octet-stream') {
const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
const url = URL.createObjectURL(blob);
const _o2 = h('a', { href: url, download: name, rel: 'noopener' });
document.body.appendChild(_o2); _o2.click(); _o2.remove();
setTimeout(() => URL.revokeObjectURL(url), 4000);
return blob;
},
async canvasBytes(canvas, type = 'image/jpeg', _ok = 0.92) {
const blob = await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('Không tạo được ảnh'))), type, _ok));
return new Uint8Array(await blob.arrayBuffer());
},
async savePng(canvas, name) { const b = await G.canvasBytes(canvas, 'image/png'); G.download(name + '.png', b, 'image/png'); return b; },
async savePdf(canvases, name, title) {
const list = Array.isArray(canvases) ? canvases : [canvases];
const pages = [];
for (const _o6 of list) pages.push({ jpeg: await G.canvasBytes(_o6, 'image/jpeg', 0.9) });
const pdf = imagesToPdf(pages, { title: title || name });
G.download(name + '.pdf', pdf, 'application/pdf');
return pdf;
},
slug(_on) { return String(_on || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'tep'; },
};
return G;
}
const _o1 = 'bds_g5_files', STORE = 'files';
function _og() {
return new Promise((res, rej) => {
if (typeof indexedDB === 'undefined') return rej(new Error('Trình duyệt không hỗ trợ lưu ảnh'));
const _ol = indexedDB.open(_o1, 1);
_ol.onupgradeneeded = () => { if (!_ol.result.objectStoreNames.contains(STORE)) _ol.result.createObjectStore(STORE); };
_ol.onsuccess = () => res(_ol.result);
_ol.onerror = () => rej(_ol.error);
});
}
export const files = {
async put(id, blob, meta = {}) { const _o8 = await _og(); return new Promise((res, rej) => { const t = _o8.transaction(STORE, 'readwrite'); t.objectStore(STORE).put({ blob, ...meta, at: Date.now() }, id); t.oncomplete = () => res(true); t.onerror = () => rej(t.error); }); },
async get(id) { const _o8 = await _og(); return new Promise((res, rej) => { const _ok = _o8.transaction(STORE).objectStore(STORE).get(id); _ok.onsuccess = () => res(_ok.result || null); _ok.onerror = () => rej(_ok.error); }); },
async del(id) { const _o8 = await _og(); return new Promise((res) => { const t = _o8.transaction(STORE, 'readwrite'); t.objectStore(STORE).delete(id); t.oncomplete = () => res(true); t.onerror = () => res(false); }); },
};
export function stickyTopOffset(doc = typeof document !== 'undefined' ? document : null) {
try {
let max = 0;
for (const e of doc.querySelectorAll('header.topbar, .topbar, [data-testid="demo-ribbon"]')) {
const _o7 = getComputedStyle(e); if (_o7.position !== 'sticky' && _o7.position !== 'fixed') continue;
const _ol = e.getBoundingClientRect(); if (_ol.height > 0 && _ol.top < innerHeight / 3) max = Math.max(max, _ol.bottom);
}
return Math.round(max);
} catch { return 0; }
}
export function scrollToEl(el, block = 'start') {
if (!el || !el.scrollIntoView) return;
try { el.style.scrollMarginTop = (stickyTopOffset() + 8) + 'px'; } catch { }
el.scrollIntoView({ block, behavior: 'smooth' });
}
export function loadImage(blob) {
return new Promise((res, rej) => {
const url = URL.createObjectURL(blob);
const img = new Image();
img.onload = () => res(img);
img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('Không đọc được ảnh')); };
img.src = url;
});
}
export async function shrinkImage(blob, maxPixels, { maxSide = 8192 } = {}) {
const img = await loadImage(blob);
const W = img.naturalWidth, H = img.naturalHeight;
const k = Math.min(1, Math.sqrt(maxPixels / Math.max(1, W * H)), maxSide / Math.max(1, W, H));
if (!(k < 1)) return { img, file: blob, k: 1 };
const _o6 = document.createElement('canvas');
_o6.width = Math.max(1, Math.round(W * k)); _o6.height = Math.max(1, Math.round(H * k));
const x = _o6.getContext('2d');
if (!x) throw new Error('Máy không đủ bộ nhớ để thu nhỏ ảnh này – chụp màn hình phần khu đất rồi chọn ảnh chụp.');
x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, _o6.width, _o6.height);
const type = /png/i.test(blob.type || '') ? 'image/png' : 'image/jpeg';
const _oh = await new Promise((res) => _o6.toBlob(res, type, 0.92));
_o6.width = _o6.height = 1;
if (!_oh) throw new Error('Máy không đủ bộ nhớ để thu nhỏ ảnh này – chụp màn hình phần khu đất rồi chọn ảnh chụp.');
const _o3 = String(blob.name || 'ban-do').replace(/\.[a-z0-9]+$/i, '');
const file = typeof File === 'function' ? new File([_oh], _o3 + (type === 'image/png' ? '.png' : '.jpg'), { type }) : _oh;
return { img: await loadImage(file), file, k };
}
export async function fileForAi(file, { maxSide = 2000, maxPdfMb = 14 } = {}) {
const mime = String(file.type || '').toLowerCase();
if (mime === 'application/pdf' || /\.pdf$/i.test(file.name || '')) {
if (file.size > maxPdfMb * 1024 * 1024) throw new Error(`PDF lớn hơn ${maxPdfMb} MB – tách riêng trang mặt bằng rồi gửi lại.`);
const _o5 = new Uint8Array(await file.arrayBuffer());
let _o4 = '';
for (let _ob = 0; _ob < _o5.length; _ob += 0x8000) _o4 += String.fromCharCode.apply(null, _o5.subarray(_ob, _ob + 0x8000));
return { mime: 'application/pdf', b64: btoa(_o4), pages: Math.max(1, pdfPages(_o5)), img: null };
}
if (mime && !/^image\//.test(mime)) throw new Error('Chỉ nhận ảnh (PNG, JPG, WebP) hoặc PDF.');
const img = await loadImage(file);
const k = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
const _o6 = document.createElement('canvas');
_o6.width = Math.max(1, Math.round(img.naturalWidth * k)); _o6.height = Math.max(1, Math.round(img.naturalHeight * k));
const x = _o6.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, _o6.width, _o6.height); x.drawImage(img, 0, 0, _o6.width, _o6.height);
return { mime: 'image/jpeg', b64: _o6.toDataURL('image/jpeg', 0.85).split(',')[1], pages: 1, img, w: img.naturalWidth, h: img.naturalHeight };
}
export function wrapText(_o6, text, x, y, maxW, lineH) {
const words = String(text || '').split(/\s+/);
let _od = '';
for (const w of words) {
const t = _od ? _od + ' ' + w : w;
if (_o6.measureText(t).width > maxW && _od) { _o6.fillText(_od, x, y); y += lineH; _od = w; } else _od = t;
}
if (_od) { _o6.fillText(_od, x, y); y += lineH; }
return y;
}
export const FONT = '"Be Vietnam Pro", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
export async function selftestWith(ctx, check) {
const _on = ctx && ctx.store;
const _of = ['list', 'get', 'put'].filter((f) => !_on || typeof _on[f] !== 'function');
if (_of.length) return { ok: false, details: 'Thiếu store.' + _of.join(', ') };
try { const _ol = await check(); return _ol === false ? { ok: false, details: 'logic' } : { ok: true }; } catch (e) { return { ok: false, details: String(e && e.message || e) }; }
}

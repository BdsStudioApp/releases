import { h } from '../_lib/kit.js';
import * as G from './logic.js';
export const G1_CSS = `
.g1{display:flex;flex-direction:column;gap:14px}
.g1 .g1-lead{margin:0;color:var(--sl-muted,rgba(127,127,127,.95));font-size:.92em}
.g1-warn{border-left:4px solid #C9A24A;background:rgba(201,162,74,.10);padding:8px 12px;border-radius:10px;font-size:.92em}
.g1-err{border-left:4px solid #B3261E;background:rgba(179,38,30,.07);padding:8px 12px;border-radius:10px;font-size:.92em}
.g1-okbox{border-left:4px solid #1E7A4F;background:rgba(30,122,79,.08);padding:8px 12px;border-radius:10px;font-size:.92em}
.g1-legal{font-size:.8em;color:var(--sl-muted,rgba(127,127,127,.95))}
.g1-big{font-size:1.35rem;font-weight:800}
.g1-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px}
.g1-card{border:1px solid var(--sl-line,rgba(127,127,127,.25));border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:6px}
.g1-card.best{border-color:#1E7A4F;box-shadow:0 0 0 2px rgba(30,122,79,.25)}
.g1-private{border:1px dashed #C9A24A;border-radius:12px;padding:8px 10px;background:rgba(201,162,74,.07)}
.g1-private::before{content:"🔒 Nội bộ";display:block;font-size:.75em;color:#9a7a2e;font-weight:700}
.g1-thumbs{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
.g1-thumb{border:1px solid var(--sl-line,rgba(127,127,127,.25));border-radius:12px;overflow:hidden;display:flex;flex-direction:column;font-size:.85em}
.g1-thumb img,.g1-thumb canvas{width:100%;aspect-ratio:3/4;object-fit:cover;background:#eee;display:block}
.g1-thumb label{display:flex;gap:6px;align-items:center;padding:6px;min-height:44px}
.g1-src a{word-break:break-all}
.g1-st{display:inline-block;font-size:.78em;padding:2px 8px;border-radius:999px;white-space:nowrap}
.g1-st.grounded{background:rgba(30,122,79,.14);color:#1E7A4F}.g1-st.ai_only{background:rgba(201,162,74,.18);color:#8a6a1e}.g1-st.missing{background:rgba(179,38,30,.12);color:#B3261E}
.g1-tbl input[type=checkbox]{width:22px;height:22px}
.g1-pick{display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;cursor:pointer}
.g1-tap{display:inline-flex;align-items:center;min-height:44px}
.g1 .sl-chips.g1-wrap{flex-wrap:wrap;overflow-x:visible}
.g1-check{display:flex;gap:10px;align-items:flex-start;min-height:44px;cursor:pointer}.g1-check input{flex:0 0 22px;width:22px;height:22px;margin:2px 0 0}.g1-check span{flex:1}
.g1-tbl td{word-break:break-word}
.g1-preview{max-width:100%;border-radius:12px;box-shadow:0 4px 18px rgba(0,0,0,.18)}
.g1-banks input{min-width:0}
@media (max-width:600px){.g1-tbl.g1-stack thead{display:none}.g1-tbl.g1-stack tr{display:block;border-bottom:1px solid var(--sl-line,rgba(127,127,127,.25));padding:6px 0}.g1-tbl.g1-stack td{display:block;border:0;padding:3px 0}.g1-tbl.g1-stack td.n{text-align:left}
  .g1-tbl.g1-stack td[data-l]::before{content:attr(data-l) ": ";font-size:.8em;color:var(--sl-muted,rgba(127,127,127,.95))}}
`;
export const GUEST_CSS = `
html[data-g1-guest="1"] [data-private],html[data-g1-guest="1"] .g1-private,html[data-g1-guest="1"] .bds-note,
html[data-g1-guest="1"] .top-account,html[data-g1-guest="1"] #ask-open,html[data-g1-guest="1"] [data-testid="quick-note"],html[data-g1-guest="1"] [data-testid="save-note"],
html[data-g1-guest="1"] [data-testid="tile-g1_policywatch"],html[data-g1-guest="1"] [data-testid="quote-recent"],
${G.GUEST_SCREENS.length ? ['home', 'customers', 'inbox', 'settings'].filter((_oi) => !G.GUEST_SCREENS.includes(_oi)).map((_oi) => `html[data-g1-guest="1"] .nav-item[data-screen="${_oi}"]`).join(',') : ''}{display:none !important}
/* riêng một luật: trình duyệt cũ chưa hiểu :has thì chỉ bỏ luật này, không làm hỏng luật ẩn ở trên (Báo giá: ô chọn khách liệt kê tên + SĐT mọi khách) */
html[data-g1-guest="1"] label.sl-f:has([data-testid="quote-customer"]){display:none !important}
.g1-guest-fab{position:fixed;left:14px;bottom:calc(var(--nav-h,64px) + 14px + env(safe-area-inset-bottom,0px));z-index:46;min-height:44px;padding:0 14px;border-radius:999px;border:1px solid rgba(201,162,74,.6);
  background:#0F1E33;color:#F7F3EA;font:inherit;font-size:.9rem;box-shadow:0 4px 16px rgba(0,0,0,.25);cursor:pointer}
html[data-g1-guest="1"] .g1-guest-fab{background:#C9A24A;color:#0F1E33;font-weight:700}
.g1-guest-bar{position:fixed;left:0;right:0;top:0;z-index:95;background:#C9A24A;color:#0F1E33;text-align:center;font-size:.85rem;padding:4px 8px;font-weight:700;pointer-events:none}
@media (max-width:600px){.g1-guest-fab{width:48px;height:48px;padding:0;font-size:1.25rem;opacity:.92}.g1-guest-fab .g1-fab-l{display:none}}
@media (min-width:900px){.g1-guest-fab{left:auto;right:20px;bottom:20px}}
/* 18/11 chia lại gói: Chế độ khách xem (Gói 3) chạy cùng Pháp lý / Giữ chỗ – cột chi tiết bên phải đang mở thì nút nổi dời sang trái cột, không che nút Lưu của biểu mẫu */
@media (min-width:900px){#app.has-sheet ~ .g1-guest-fab{right:calc(max(400px, 42%) + 20px)}}
`;
function _o1(id, css) {
if (typeof document === 'undefined' || document.getElementById(id) || (_o1.done && _o1.done[id])) return;
_o1.done = _o1.done || {}; _o1.done[id] = 1;
try { const _ok = new CSSStyleSheet(); _ok.replaceSync(css); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _ok]; return; } catch { }
const _oi = document.createElement('style'); _oi.id = id; _oi.textContent = css; document.head.appendChild(_oi);
}
export const ensureCss = () => _o1('g1-css', G1_CSS);
export const ensureGuestCss = () => _o1('g1-guest-css', GUEST_CSS);
export const isGuest = () => typeof document !== 'undefined' && document.documentElement.dataset.g1Guest === '1';
export function moneyIn(st, key, label, attrs = {}, onInput) {
return h('label', { class: 'sl-f' }, label, h('input', { type: 'text', inputmode: 'decimal', value: st[key] ?? '', 'data-testid': attrs.testid, placeholder: attrs.placeholder || '',
oninput: (e) => { st[key] = e.target.value; onInput && onInput(); } }));
}
export async function fileToCanvas(_o4, max = 2000) {
const _ol = URL.createObjectURL(_o4);
try {
const _o8 = await new Promise((res, rej) => { const _o7 = new Image(); _o7.onload = () => res(_o7); _o7.onerror = () => rej(new Error('Không đọc được ảnh')); _o7.src = _ol; });
return imageToCanvas(_o8, max);
} finally { setTimeout(() => URL.revokeObjectURL(_ol), 1000); }
}
export function imageToCanvas(_o8, max = 2000) {
const _om = _o8.naturalWidth || _o8.width, h0 = _o8.naturalHeight || _o8.height;
const _o9 = Math.min(1, max / Math.max(_om, h0));
const _o2 = document.createElement('canvas');
_o2.width = Math.max(1, Math.round(_om * _o9)); _o2.height = Math.max(1, Math.round(h0 * _o9));
const _o6 = _o2.getContext('2d'); _o6.fillStyle = '#fff'; _o6.fillRect(0, 0, _o2.width, _o2.height); _o6.drawImage(_o8, 0, 0, _o2.width, _o2.height);
return _o2;
}
export async function b64ToCanvas(mime, b64, max = 2000) {
const _o8 = await new Promise((res, rej) => { const _o7 = new Image(); _o7.onload = () => res(_o7); _o7.onerror = () => rej(new Error('Ảnh hỏng')); _o7.src = `data:${mime};base64,${b64}`; });
return imageToCanvas(_o8, max);
}
export const canvasB64 = (_o2, mime = 'image/jpeg', q = 0.85) => _o2.toDataURL(mime, q).split(',')[1];
export function b64Bytes(b64) { const _oi = atob(b64), _o0 = new Uint8Array(_oi.length); for (let _o7 = 0; _o7 < _oi.length; _o7++) _o0[_o7] = _oi.charCodeAt(_o7); return _o0; }
export function watermark(src, who) {
const _o5 = G.watermarkLayout(src.width, src.height, who);
const _o2 = document.createElement('canvas');
_o2.width = src.width; _o2.height = src.height + _o5.footer.h;
const _o6 = _o2.getContext('2d');
_o6.fillStyle = '#fff'; _o6.fillRect(0, 0, _o2.width, _o2.height);
_o6.drawImage(src, 0, 0);
const L = _o5;
_o6.save();
_o6.globalAlpha = L.alpha; _o6.fillStyle = '#0F1E33'; _o6.font = `700 ${L.fontSize}px sans-serif`; _o6.textBaseline = 'middle';
_o6.beginPath(); _o6.rect(0, 0, src.width, src.height); _o6.clip();
_o6.translate(src.width / 2, src.height / 2); _o6.rotate(L.angle); _o6.translate(-src.width / 2, -src.height / 2);
for (const _of of L.items) _o6.fillText(L.text, _of.x, _of.y);
_o6.restore();
_o6.fillStyle = '#0F1E33'; _o6.fillRect(0, src.height, _o2.width, L.footer.h);
_o6.fillStyle = '#E7CF97'; _o6.font = `600 ${Math.round(L.footer.h * 0.42)}px sans-serif`; _o6.textBaseline = 'middle'; _o6.textAlign = 'center';
let t = L.footer.text; while (t.length > 10 && _o6.measureText(t).width > _o2.width - 24) t = t.slice(0, -2);
_o6.fillText(t === L.footer.text ? t : t + '…', _o2.width / 2, src.height + L.footer.h / 2);
_o2.dataset.watermark = L.text;
return _o2;
}
export function textCard(title, lines, w = 1080) {
const pad = 56, fs = 30, lh = 46;
const _oh = document.createElement('canvas').getContext('2d'); _oh.font = `500 ${fs}px sans-serif`;
const _on = [];
for (const _oa of lines) {
let cur = '';
for (const word of String(_oa).split(' ')) { const _od = cur ? cur + ' ' + word : word; if (_oh.measureText(_od).width > w - pad * 2 && cur) { _on.push(cur); cur = '   ' + word; } else cur = _od; }
_on.push(cur);
}
const _o2 = document.createElement('canvas'); _o2.width = w; _o2.height = pad * 2 + 80 + _on.length * lh;
const _o6 = _o2.getContext('2d');
_o6.fillStyle = '#F7F3EA'; _o6.fillRect(0, 0, _o2.width, _o2.height);
_o6.fillStyle = '#0F1E33'; _o6.fillRect(0, 0, _o2.width, 12);
_o6.fillStyle = '#0F1E33'; _o6.font = `800 40px sans-serif`; _o6.fillText(String(title).slice(0, 60), pad, pad + 30);
_o6.font = `500 ${fs}px sans-serif`;
_on.forEach((t, _o7) => _o6.fillText(t, pad, pad + 100 + _o7 * lh));
return _o2;
}
export const toBlob = (_o2, type = 'image/png', q) => new Promise((res) => _o2.toBlob(res, type, q));
export function pdfBlob(canvases) {
const _og = canvases.map((_o2) => ({ jpeg: b64Bytes(canvasB64(_o2, 'image/jpeg', 0.88)), w: _o2.width, h: _o2.height }));
return new Blob([G.buildPdf(_og)], { type: 'application/pdf' });
}
export function download(blob, name) {
const _o0 = h('a', { href: URL.createObjectURL(blob), download: name, style: 'display:none' });
document.body.appendChild(_o0); _o0.click();
setTimeout(() => { URL.revokeObjectURL(_o0.href); _o0.remove(); }, 1500);
}
export async function shareOrDownload(K, blob, name, text) {
const _o4 = typeof File !== 'undefined' ? new File([blob], name, { type: blob.type }) : null;
try {
if (_o4 && navigator.canShare && navigator.canShare({ files: [_o4] })) { await navigator.share({ files: [_o4], text: text || '' }); return 'shared'; }
} catch (e) { if (e && e.name === 'AbortError') return 'cancelled'; }
download(blob, name);
K.toast('Đã tải tệp về máy – mở Zalo và gửi tệp cho khách.', 'info');
return 'downloaded';
}
export async function askExporter(K, ctx, profile) {
const name = h('input', { value: (profile && profile.name) || (ctx.user && ctx.user.full_name) || '', 'data-testid': 'g1-wm-name', autocomplete: 'name' });
const phone = h('input', { value: (profile && profile.phone) || '', inputmode: 'tel', 'data-testid': 'g1-wm-phone', autocomplete: 'tel' });
const err = h('div', { class: 'sl-bad', role: 'alert' });
return new Promise((res) => {
let _ob;
const ok = () => {
const _oc = name.value.trim(), _of = phone.value.replace(/[^\d+ ]/g, '').trim();
if (_oc.length < 2 || _of.replace(/\D/g, '').length < 9) { err.textContent = 'Cần đủ họ tên và số điện thoại người xuất để in lên tài liệu.'; return; }
_ob.close(); res({ name: _oc, phone: _of, date: new Date().toLocaleDateString('vi-VN') });
};
_ob = K.modal({ title: 'In tên người xuất lên tài liệu', testid: 'g1-wm-modal', body: [
h('p', { class: 'sl-muted' }, 'Mọi ảnh/PDF xuất ra đều in chìm tên + SĐT này để chống phát tán.'),
h('div', { class: 'sl-form' }, h('label', { class: 'sl-f' }, 'Họ tên', name), h('label', { class: 'sl-f' }, 'Số điện thoại', phone)), err,
h('div', { class: 'sl-row sl-end' }, K.button('Huỷ', () => { _ob.close(); res(null); }), K.button('Tiếp tục', ok, { kind: 'primary', icon: 'next', testid: 'g1-wm-ok' }))] });
});
}
export const AI_CHOICES = [['gemini', 'Gemini (mặc định)'], ['claude_api', 'Claude API'], ['ollama', 'Ollama trên máy (cần mô hình đọc ảnh)'], ['handoff', 'Làm bằng Claude/Gemini qua chat']];
export const AI_NAME = { gemini: 'Gemini', claude_api: 'Claude API', ollama: 'Ollama', handoff_claude: 'Claude (chat)', handoff_gemini: 'Gemini (chat)', handoff: 'Chat' };
export function aiSelect(K, ctx, key, testid) {
let cur = 'gemini';
try { cur = localStorage.getItem(key) || (ctx.ai && ctx.ai.provider ? ctx.ai.provider('read_policy') : 'gemini'); } catch { }
if (/^handoff/.test(cur)) cur = 'handoff';
const _o3 = !!(ctx.settings && typeof ctx.settings.get === 'function' && ctx.settings.get('ai.claude_api_enabled', false) === true);
const _oj = K.select(AI_CHOICES, cur, { 'data-testid': testid, class: 'sl-in', onchange: (e) => { try { localStorage.setItem(key, e.target.value); } catch { } } });
const _oe = _oj.querySelector('option[value="claude_api"]');
if (_oe && !_o3) { _oe.disabled = true; _oe.textContent += ' – đang tắt'; if (_oj.value === 'claude_api') _oj.value = 'gemini'; }
return _oj;
}
export const title = (text) => h('h2', { class: 'sl-row' }, text, h('span', { class: 'sl-tag', 'data-testid': 'g1-beta', title: 'Gói thử nghiệm: dùng miễn phí, đang hoàn thiện – góp ý qua nút 💬' }, 'Thử nghiệm'));

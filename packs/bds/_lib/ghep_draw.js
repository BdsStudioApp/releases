import { frameSize, layout, frameAt, cues as planCues, cueAt } from './ghep_plan.js';
export const FONT = "'Be Vietnam Pro', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
export const AI_LABEL = 'Video có dùng AI';
export const KENBURNS = 0.08;
const _o2 = 0.06, SUB_SIZE = 0.045, LABEL_SIZE = 0.022, MISS_SIZE = 0.04;
const _o1 = 'rgba(0,0,0,0.55)';
const _o3 = { tren: 0.14, giua: 0.5, duoi: 0.7 };
const _o0 = 4;
export function fitRect(w, h, W, H, fit = 'cover') {
const s = fit === 'contain' ? Math.min(W / w, H / h) : Math.max(W / w, H / h);
const _ob = w * s, dh = h * s;
return { x: (W - _ob) / 2, y: (H - dh) / 2, w: _ob, h: dh };
}
export function wrapText(ctx, text, maxWidth) {
const _oc = (s) => ctx.measureText(s).width <= maxWidth;
const _om = [];
for (const _on of String(text ?? '').normalize('NFC').split(/\r?\n/)) {
const _oy = _on.split(/\s+/).filter(Boolean);
let _o5 = '';
for (let w of _oy) {
if (_o5 && _oc(_o5 + ' ' + w)) { _o5 += ' ' + w; continue; }
if (_o5) { _om.push(_o5); _o5 = ''; }
while (!_oc(w) && w.length > 1) {
let _og = w.length - 1;
while (_og > 1 && !_oc(w.slice(0, _og))) _og--;
_om.push(w.slice(0, _og));
w = w.slice(_og);
}
_o5 = w;
}
if (_o5) _om.push(_o5);
}
return _om;
}
const font = (_oo, bold = true) => `${bold ? '700 ' : ''}${Math.round(_oo)}px ${FONT}`;
function _oq(ctx, x, y, w, h, _op) {
ctx.beginPath();
if (typeof ctx.roundRect === 'function') ctx.roundRect(x, y, w, h, _op);
else {
ctx.moveTo(x + _op, y);
ctx.arcTo(x + w, y, x + w, y + h, _op);
ctx.arcTo(x + w, y + h, x, y + h, _op);
ctx.arcTo(x, y + h, x, y, _op);
ctx.arcTo(x, y, x + w, y, _op);
ctx.closePath();
}
ctx.fill();
}
function _ot(getSource, scene) {
try { const s = typeof getSource === 'function' ? getSource(scene) : null; return s && s.img && s.w > 0 && s.h > 0 ? s : null; } catch { return null; }
}
function _o9(ctx, L, W, H, getSource, textAlpha = null) {
const _or = L.scene || {};
const _os = Math.min(W, H);
const dx = (L.dx || 0) * W, dy = (L.dy || 0) * H;
ctx.save();
ctx.globalAlpha = Math.max(0, Math.min(1, L.alpha ?? 1));
const _ou = _ot(getSource, _or);
if (_ou) {
const _oh = _or.kind === 'image' && _or.kenburns ? 1 + KENBURNS * Math.max(0, Math.min(1, L.progress || 0)) : 1;
const _op = fitRect(_ou.w, _ou.h, W, H, _or.fit === 'contain' ? 'contain' : 'cover');
const s = _oh * (L.scale || 1);
const w = _op.w * s, h = _op.h * s;
ctx.drawImage(_ou.img, (W - w) / 2 + dx, (H - h) / 2 + dy, w, h);
} else {
ctx.fillStyle = '#000';
ctx.fillRect(dx, dy, W, H);
ctx.fillStyle = '#fff';
ctx.font = font(_os * MISS_SIZE);
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(`Thiếu tệp cảnh ${(L.index ?? 0) + 1}`, W / 2 + dx, H / 2 + dy);
}
const value = _or.text && typeof _or.text === 'object' ? String(_or.text.value || '').trim() : '';
if (value && textAlpha !== 0) {
if (textAlpha != null) ctx.globalAlpha = Math.max(0, Math.min(1, textAlpha));
const _oo = Math.round(_os * _o2);
ctx.font = font(_oo);
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
const lines = wrapText(ctx, value, W * 0.86).slice(0, _o0);
const _oi = _oo * 1.25;
const _o6 = H * (_o3[_or.text.pos] ?? _o3.giua);
const _oz = _o6 - ((lines.length - 1) * _oi) / 2;
ctx.lineJoin = 'round';
ctx.lineWidth = Math.max(2, _oo * 0.16);
ctx.strokeStyle = '#000';
ctx.shadowColor = 'rgba(0,0,0,0.6)';
ctx.shadowBlur = _oo * 0.3;
ctx.shadowOffsetY = _oo * 0.06;
lines.forEach((l, i) => ctx.strokeText(l, W / 2 + dx, _oz + i * _oi + dy));
ctx.fillStyle = '#fff';
lines.forEach((l, i) => ctx.fillText(l, W / 2 + dx, _oz + i * _oi + dy));
}
ctx.restore();
}
function _oa(ctx, text, pos, W, H) {
const _os = Math.min(W, H);
let _oo = Math.round(_os * SUB_SIZE);
const _ok = W * 0.84;
ctx.save();
ctx.font = font(_oo, false);
const raw = String(text).split('\n').map((l) => l.trim()).filter(Boolean);
const _ox = Math.max(0, ...raw.map((l) => ctx.measureText(l).width));
if (_ox > _ok) { _oo = Math.max(Math.round(_oo * 0.7), Math.floor((_oo * _ok) / _ox)); ctx.font = font(_oo, false); }
const lines = raw.flatMap((l) => wrapText(ctx, l, _ok)).slice(0, 2);
if (!lines.length) { ctx.restore(); return; }
const _oi = _oo * 1.3, pad = _oo * 0.45;
const bw = Math.min(W - 2 * _os * 0.03, Math.max(...lines.map((l) => ctx.measureText(l).width)) + pad * 2.2);
const bh = lines.length * _oi + pad * 2;
const by = pos === 'tren' ? H * 0.08 : pos === 'giua' ? (H - bh) / 2 : H * 0.9 - bh;
const bx = (W - bw) / 2;
ctx.fillStyle = _o1;
_oq(ctx, bx, by, bw, bh, _oo * 0.4);
ctx.fillStyle = '#fff';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
lines.forEach((l, i) => ctx.fillText(l, W / 2, by + pad + _oi * (i + 0.5)));
ctx.restore();
}
function _o8(ctx, W, H) {
const _os = Math.min(W, H);
const _oo = Math.max(10, Math.round(_os * LABEL_SIZE));
const _oj = Math.round(_os * 0.025);
ctx.save();
ctx.globalAlpha = 1;
ctx.font = font(_oo, false);
ctx.textAlign = 'right';
ctx.textBaseline = 'bottom';
ctx.shadowColor = 'rgba(0,0,0,0.8)';
ctx.shadowBlur = _oo * 0.4;
ctx.fillStyle = 'rgba(255,255,255,0.85)';
ctx.fillText(AI_LABEL, W - _oj, H - _oj);
ctx.restore();
}
export function textAlphas(layers, lay, t) {
if (!layers || layers.length < 2) return (layers || []).map(() => null);
const idx = layers.map((L) => L.index ?? 0);
const _oe = Math.max(...idx);
const _of = ((lay && lay.items) || [])[_oe] || {};
const _o7 = Number(_of.tIn) || 0;
const _ol = _o7 > 0 ? Math.max(0, Math.min(1, (t - (Number(_of.start) || 0)) / _o7)) : 1;
const _o4 = (x) => Math.round(Math.max(0, Math.min(1, x)) * 1000) / 1000;
return idx.map((i) => (i === _oe ? _o4(2 * _ol - 1) : _o4(1 - 2 * _ol)));
}
export function drawFrame(ctx, plan, t, getSource, opts = {}) {
const _od = frameSize(plan || {});
const W = (ctx.canvas && ctx.canvas.width) || _od.width, H = (ctx.canvas && ctx.canvas.height) || _od.height;
const lay = (opts && opts.lay) || layout(plan || {});
ctx.save();
ctx.globalAlpha = 1;
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, W, H);
const layers = frameAt(plan || {}, t, lay).layers;
const _ow = textAlphas(layers, lay, t);
layers.forEach((L, i) => _o9(ctx, L, W, H, getSource, _ow[i]));
const _ov = (plan && plan.subtitles) || {};
if (_ov.on !== false) {
const list = (opts && opts.cues) || planCues(plan || {}, lay);
const text = cueAt(list, t);
if (text) _oa(ctx, text, _ov.pos, W, H);
}
_o8(ctx, W, H);
ctx.restore();
}

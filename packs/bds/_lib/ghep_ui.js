import { kit, h } from './kit.js';
import * as coreUi from '../../../core/ui.efd703fd85.js';
const _o0 = 'bds-ghep-css';
function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
const _oz = document.createElement('link');
_oz.id = _o0; _oz.rel = 'stylesheet'; _oz.href = new URL('./ghep.css', import.meta.url).href;
document.head.appendChild(_oz);
}
export const UNSUPPORTED_MSG = 'Trình duyệt này chưa ghép được, anh/chị dùng Chrome hoặc Edge, hoặc Xuất bộ mảnh cho CapCut';
export const PREVIEW_NOTE = 'Xem trước nhanh có thể khác nhẹ bản ghép thật.';
export const TRANSITION_LABELS = { cat: 'Cắt thẳng', mo: 'Mờ dần', truot_trai: 'Trượt trái', truot_phai: 'Trượt phải', phong_to: 'Phóng to' };
export const QUALITY_LABELS = { nhap: 'Nháp 480p', tot: 'Tốt 720p', cao: 'Cao 1080p' };
export const FORMAT_LABELS = { vertical: 'Dọc 9:16', horizontal: 'Ngang 16:9' };
export const POS_LABELS = { tren: 'Trên', giua: 'Giữa', duoi: 'Dưới' };
export function unaccent(_o1o) {
return String(_o1o || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
export function fileName(title, ext = 'mp4') {
let _o1o = unaccent(title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
if (_o1o.length > 60) _o1o = _o1o.slice(0, 60).replace(/-[^-]*$/, '') || _o1o.slice(0, 60);
return (_o1o || 'video-ghep') + '.' + ext;
}
export function parseSec(v) {
const _o1o = String(v ?? '').trim().replace(',', '.');
if (!_o1o) return null;
const _o15 = Number(_o1o);
return Number.isFinite(_o15) && _o15 >= 0 ? Math.round(_o15 * 100) / 100 : null;
}
export function fmtTime(sec) {
const _o1o = Math.max(0, Math.floor(Number(sec) || 0));
return Math.floor(_o1o / 60) + ':' + String(_o1o % 60).padStart(2, '0');
}
export function fmtSec(sec) {
const _o15 = Number(sec);
return Number.isFinite(_o15) ? (Math.round(_o15 * 10) / 10).toFixed(1).replace('.', ',') : '';
}
export function fmtSize(bytes) {
const _o15 = Number(bytes) || 0;
if (_o15 < 1024 * 1024) return Math.max(1, Math.round(_o15 / 1024)) + ' KB';
return (_o15 / 1024 / 1024).toFixed(1).replace('.', ',') + ' MB';
}
export function isVideoFile(_ok) {
const type = String((_ok && (_ok.type || (_ok.blob && _ok.blob.type))) || '');
if (type.startsWith('video/')) return true;
if (type.startsWith('image/')) return false;
return /\.(mp4|mov|m4v|webm|mkv)$/i.test(String((_ok && _ok.name) || ''));
}
export function clipKeys(clips) {
const keys = {}, entries = [], vids = {}, imgs = {};
for (const [i, _ob] of Object.entries(clips || {})) {
if (!_ob || (!_ob.blob && !_ob.url)) continue;
const _ot = 'c' + i;
keys[i] = _ot;
const video = isVideoFile(_ob);
(video ? vids : imgs)[i] = _ot;
entries.push([_ot, { name: _ob.name || 'canh-' + (Number(i) + 1), blob: _ob.blob || null, url: _ob.url || null, video }]);
}
return { keys, clips: vids, images: imgs, entries };
}
export function setScene(plan, i, patch) {
if (!plan || !plan.scenes || !plan.scenes[i]) return plan;
const scenes = plan.scenes.slice();
scenes[i] = { ...scenes[i], ...patch };
return { ...plan, scenes };
}
export function setIn(plan, path, value) {
const [_ot, ...rest] = path;
const cur = plan && typeof plan === 'object' ? plan : {};
return { ...cur, [_ot]: rest.length ? setIn(cur[_ot], rest, value) : value };
}
export function clipUseDur(sc) {
const _oj = sc.out != null ? sc.out : sc.srcDur;
return _oj == null ? null : Math.max(0, _oj - (sc.in || 0));
}
export function phaseView(_o1g, { errors = 0 } = {}) {
const _o1n = _o1g === 'rendering';
return {
goDisabled: _o1n || _o1g === 'unsupported' || _o1g === 'checking' || errors > 0,
showCancel: _o1n,
showProgress: _o1n,
showResult: _o1g === 'done',
showUnsupported: _o1g === 'unsupported',
lockEdits: _o1n,
};
}
export function errorText(e) {
if (!e) return 'Ghép không thành công.';
if (e.name === 'AbortError') return 'Đã huỷ ghép.';
if (e.userMessage) return e.userMessage;
return 'Ghép không thành công: ' + (e.message || String(e));
}
async function _o10(deps = {}) {
const _o1h = async (_ot, path) => deps[_ot] || import(path);
const [plan, draw, render, audio] = await Promise.all([
_o1h('plan', './ghep_plan.js'), _o1h('draw', './ghep_draw.js'),
_o1h('render', './ghep_render.js').catch(() => null), _o1h('audio', './ghep_audio.js').catch(() => null),
]);
return { plan, draw, render, audio };
}
export function mountGhep(root, opts = {}) {
ensureCss();
const _o1 = kit(opts.ctx && opts.ctx.ui ? opts.ctx : { ...(opts.ctx || {}), ui: coreUi });
const title = opts.title || '';
const kitExport = typeof opts.kitExport === 'function' ? opts.kitExport : null;
const src = new Map();
const _o1c = new Set();
let P = null, D = null, R = null, A = null;
let plan = null, lay = null, cuesList = null, pplan = null;
let t = 0, playing = false, raf = 0, last = 0;
let _o1g = 'checking', abort = null, resultUrl = null, errors = [];
let _oi = 0, alive = true, nfile = 0;
const _oh = {};
root.replaceChildren(h('div', { class: 'ghep-loading bds-muted' }, 'Đang mở màn Ghép nhanh…'));
root.classList.add('ghep', 'bds-screen', 'bds-form');
root.dataset.testid = 'ghep-root';
const _o17 = (blob) => { const _o24 = URL.createObjectURL(blob); _o1c.add(_o24); return _o24; };
function _o5(_ov, info) {
const _o18 = src.get(_ov);
if (_o18 && _o18.el && _o18.video) { try { _o18.el.pause(); _o18.el.removeAttribute('src'); _o18.el.load(); } catch { } }
const url = info.blob ? _o17(info.blob) : info.url;
const e = { ...info, url, el: null, ready: false };
if (info.video) {
const v = document.createElement('video');
v.muted = true; v.playsInline = true; v.preload = 'auto'; v.crossOrigin = 'anonymous';
v.addEventListener('loadedmetadata', () => { if (alive) _o19(_ov, v.duration); });
v.addEventListener('loadeddata', () => { e.ready = true; if (alive && !playing) _of(); });
v.addEventListener('seeked', () => { if (alive && !playing) _of(); });
v.src = url;
e.el = v;
} else {
const _oq = new Image();
_oq.decoding = 'async';
_oq.addEventListener('load', () => { e.ready = true; if (alive) { _of(); } });
_oq.src = url;
e.el = _oq;
}
src.set(_ov, e);
return e;
}
function _o19(_ov, d) {
if (!plan || !Number.isFinite(d)) return;
let _oc = false;
plan.scenes.forEach((sc, i) => {
if (sc.src === _ov && sc.kind === 'clip' && sc.srcDur !== d) {
const _o16 = { ...sc, srcDur: d };
_o16.dur = clipUseDur(_o16) ?? sc.dur;
plan = setScene(plan, i, _o16); _oc = true;
}
});
if (_oc) { _o1i(); _o1m(); }
}
function getSource(scene) {
const e = scene && scene.src ? src.get(scene.src) : null;
if (!e || !e.el || !e.ready) return null;
if (e.video) return e.el.readyState >= 2 ? { img: e.el, w: e.el.videoWidth, h: e.el.videoHeight } : null;
return { img: e.el, w: e.el.naturalWidth, h: e.el.naturalHeight };
}
function _o1i({ redraw = true } = {}) {
pplan = { ...plan, quality: 'nhap' };
try { lay = P.layout(pplan); } catch { lay = { items: [], total: 0 }; }
try { cuesList = plan.subtitles && plan.subtitles.on ? P.cues(pplan, lay) : []; } catch { cuesList = []; }
try { errors = P.validatePlan(plan) || []; } catch (e) { errors = ['Kế hoạch ghép lỗi: ' + (e && e.message)]; }
if (t > lay.total) t = lay.total;
_o1l();
if (redraw) { _o1v(); _o1x(false); _of(); }
}
function _o1v() {
const _ob = _oh.canvas; if (!_ob) return;
let _on = { width: 480, height: 854 };
try { _on = P.frameSize(pplan); } catch { }
if (_ob.width !== _on.width || _ob.height !== _on.height) { _ob.width = _on.width; _ob.height = _on.height; }
_oh.stage.classList.toggle('ghep-stage-h', plan.format === 'horizontal');
}
function _of() {
const _ob = _oh.canvas; if (!_ob || !plan) return;
const _oo = _ob.getContext('2d');
try { D.drawFrame(_oo, pplan, t, getSource, { lay, cues: cuesList }); }
catch (e) { _oo.fillStyle = '#000'; _oo.fillRect(0, 0, _ob.width, _ob.height); console.warn('[ghep] vẽ khung lỗi', e); }
if (_oh.seek) { _oh.seek.max = String(lay ? lay.total : 0); if (document.activeElement !== _oh.seek) _oh.seek.value = String(t); }
if (_oh.time) _oh.time.textContent = fmtTime(t) + ' / ' + fmtTime(lay ? lay.total : 0);
}
function _o1x(play) {
let layers = [];
try { layers = (P.frameAt(pplan, t, lay) || {}).layers || []; } catch { layers = []; }
const _o28 = new Map();
for (const _o12 of layers) if (_o12.scene && _o12.scene.kind === 'clip' && _o12.scene.src) _o28.set(_o12.scene.src, _o12.local || 0);
for (const [_ot, e] of src) {
if (!e.video || !e.el) continue;
const v = e.el;
if (!_o28.has(_ot)) { if (!v.paused) v.pause(); continue; }
const local = _o28.get(_ot);
if (play) {
if (Math.abs(v.currentTime - local) > 0.3) v.currentTime = local;
if (v.paused) v.play().catch(() => { });
} else {
if (!v.paused) v.pause();
if (Math.abs(v.currentTime - local) > 0.04) { try { v.currentTime = local; } catch { } }
}
}
}
function _o20(now) {
if (!playing) return;
t += Math.min(0.1, (now - last) / 1000); last = now;
if (t >= lay.total) { t = lay.total; stop(); _of(); return; }
_o1x(true); _of();
raf = requestAnimationFrame(_o20);
}
function play() {
if (playing || !lay || !lay.total) return;
if (t >= lay.total - 0.05) t = 0;
playing = true; last = performance.now();
_o1s(); raf = requestAnimationFrame(_o20);
}
function stop() {
playing = false; cancelAnimationFrame(raf);
_o1x(false); _o1s();
}
function _o1s() {
if (!_oh.playWrap) return;
_oh.playWrap.replaceChildren(playing
? _o1.button('Dừng', stop, { icon: 'minus', testid: 'ghep-stop' })
: _o1.button('Phát', play, { icon: 'next', testid: 'ghep-play' }));
}
function _o1p(sc, i, _o15) {
const e = sc.src ? src.get(sc.src) : null;
const _o11 = _o1g === 'rendering';
const _o25 = (patch) => { plan = setScene(plan, i, patch); _o1i(); };
const thumb = h('div', { class: 'ghep-thumb' + (plan.format === 'horizontal' ? ' ghep-thumb-h' : '') });
if (e && e.url) {
if (e.video) {
const v = h('video', { muted: true, preload: 'metadata', playsinline: true, 'aria-hidden': 'true' });
v.muted = true;
v.src = e.url + '#t=' + Math.max(0.1, (sc.in || 0) + 0.1);
thumb.appendChild(v);
} else thumb.appendChild(h('img', { src: e.url, alt: '' }));
} else thumb.appendChild(h('span', { class: 'ghep-thumb-miss' }, 'Chưa có tệp'));
thumb.appendChild(h('span', { class: 'ghep-num' }, String(i + 1)));
const _ol = h('input', { type: 'file', accept: 'video/*,image/*', class: 'ghep-file-in', 'data-testid': 'ghep-file-' + i, disabled: _o11,
onchange: (ev) => {
const _ok = ev.target.files && ev.target.files[0]; if (!_ok) return;
const _ov = 'f' + (++nfile);
const video = isVideoFile(_ok);
_o5(_ov, { name: _ok.name, blob: _ok, url: null, video });
plan = setScene(plan, i, video ? { kind: 'clip', src: _ov, in: 0, out: null, srcDur: null }
: { kind: 'image', src: _ov, dur: sc.kind === 'image' && sc.dur ? sc.dur : 4 });
_o1i(); _o1m();
} });
const _om = h('label', { class: 'bds-btn bds-btn-x ghep-file' + (e ? '' : ' ghep-file-need') },
_o1.icon(e ? 'refresh' : 'plus', 18), h('span', null, e ? 'Đổi tệp' : 'Chọn clip/ảnh'), _ol);
const _o21 = [];
if (sc.kind === 'clip') {
const _or = h('input', { type: 'text', inputmode: 'decimal', value: fmtSec(sc.in || 0), 'data-testid': 'ghep-in-' + i, disabled: _o11,
onchange: (ev) => { const v = parseSec(ev.target.value) ?? 0; plan = P.trimScene(plan, i, v, plan.scenes[i].out); _o1i(); _o1m(); } });
const _o1b = h('input', { type: 'text', inputmode: 'decimal', value: sc.out != null ? fmtSec(sc.out) : '', placeholder: 'hết clip', 'data-testid': 'ghep-out-' + i, disabled: _o11,
onchange: (ev) => { const v = parseSec(ev.target.value); plan = P.trimScene(plan, i, plan.scenes[i].in || 0, v); _o1i(); _o1m(); } });
const _o26 = clipUseDur(sc);
_o21.push(_o1.field('Bắt đầu ở giây', _or), _o1.field('Kết thúc ở giây', _o1b),
h('p', { class: 'ghep-info bds-muted' }, sc.srcDur != null ? `Clip dài ${fmtSec(sc.srcDur)} giây · dùng ${fmtSec(_o26)} giây` : 'Đang đọc độ dài clip…'));
} else {
const _og = h('input', { type: 'text', inputmode: 'decimal', value: fmtSec(sc.dur || 0), 'data-testid': 'ghep-dur-' + i, disabled: _o11,
onchange: (ev) => { const v = parseSec(ev.target.value); if (v != null) _o25({ dur: v }); } });
const fit = _o1.select([['cover', 'Lấp đầy khung'], ['contain', 'Vừa khung (viền đen)']], sc.fit || 'cover',
{ 'data-testid': 'ghep-fit-' + i, disabled: _o11, onchange: (ev) => _o25({ fit: ev.target.value }) });
const _ou = h('label', { class: 'bds-check ghep-check' }, h('input', { type: 'checkbox', checked: sc.kenburns !== false, 'data-testid': 'ghep-kb-' + i, disabled: _o11,
onchange: (ev) => _o25({ kenburns: ev.target.checked }) }), h('span', null, 'Zoom nhẹ'));
_o21.push(_o1.field('Thời lượng (giây)', _og), _o1.field('Cách đặt ảnh', fit), _ou);
}
const _o23 = sc.text || { value: '', pos: 'giua' };
const _o1y = h('input', { type: 'text', value: _o23.value || '', placeholder: 'Chữ hiện trên cảnh (để trống nếu không cần)', 'data-testid': 'ghep-text-' + i, disabled: _o11,
oninput: (ev) => { const v = ev.target.value; const cur = plan.scenes[i].text || { pos: 'giua' }; _o25({ text: v.trim() ? { value: v, pos: _o1z.value || cur.pos || 'giua' } : null }); } });
const _o1z = _o1.select(Object.entries(POS_LABELS), _o23.pos || 'giua', { 'data-testid': 'ghep-textpos-' + i, disabled: _o11, 'aria-label': 'Vị trí chữ cảnh ' + (i + 1),
onchange: (ev) => { const cur = plan.scenes[i].text; if (cur) _o25({ text: { ...cur, pos: ev.target.value } }); } });
const say = h('textarea', { rows: 2, 'data-testid': 'ghep-say-' + i, disabled: _o11, placeholder: 'Lời đọc của cảnh (dùng làm phụ đề)',
oninput: (ev) => _o25({ say: ev.target.value }) }, sc.say || '');
const _o4 = h('div', { class: 'ghep-acts' },
_o1.button('', () => { plan = P.moveScene(plan, i, -1); _o1i(); _o1m(); }, { icon: 'up', title: 'Đưa cảnh lên', testid: 'ghep-up-' + i }),
_o1.button('', () => { plan = P.moveScene(plan, i, 1); _o1i(); _o1m(); }, { icon: 'down', title: 'Đưa cảnh xuống', testid: 'ghep-down-' + i }),
_o1.button('', () => { plan = P.removeScene(plan, i); _o1i(); _o1m(); }, { icon: 'close', kind: 'danger', title: 'Xoá cảnh', testid: 'ghep-del-' + i }));
const [up, down, del] = _o4.children;
if (i === 0 || _o11) up.disabled = true;
if (i === _o15 - 1 || _o11) down.disabled = true;
if (_o11) del.disabled = true;
up.setAttribute('aria-label', 'Đưa cảnh ' + (i + 1) + ' lên'); down.setAttribute('aria-label', 'Đưa cảnh ' + (i + 1) + ' xuống'); del.setAttribute('aria-label', 'Xoá cảnh ' + (i + 1));
const _ow = sc.kind === 'clip' ? 'Clip' : 'Ảnh';
return h('article', { class: 'ghep-scene' + (e ? '' : ' ghep-scene-miss'), 'data-testid': 'ghep-scene-' + i, 'data-id': sc.id },
h('div', { class: 'ghep-scene-l' }, thumb, _om),
h('div', { class: 'ghep-scene-b' },
h('div', { class: 'ghep-scene-h' }, h('strong', null, 'Cảnh ' + (i + 1)), _o1.badge(_ow, sc.kind === 'clip' ? 'info' : 'muted'),
e ? h('span', { class: 'ghep-fname bds-muted', title: e.name }, e.name) : h('span', { class: 'bds-danger ghep-fname' }, 'Thiếu tệp – anh/chị chọn clip hoặc ảnh')),
h('div', { class: 'ghep-fields' }, _o21),
h('div', { class: 'ghep-text-row' }, _o1.field('Chữ trên cảnh', _o1y), _o1.field('Vị trí', _o1z)),
_o1.field('Lời đọc', say)),
_o4);
}
function _o1m() {
if (!_oh.list) return;
const _o2 = document.activeElement, fid = _o2 && root.contains(_o2) && _o2.dataset ? _o2.dataset.testid : null;
const _o1q = fid && typeof _o2.selectionStart === 'number' ? [_o2.selectionStart, _o2.selectionEnd] : null;
const _o15 = plan.scenes.length;
_oh.list.replaceChildren(...(_o15 ? plan.scenes.map((sc, i) => _o1p(sc, i, _o15)) : [_o1.empty('Chưa có cảnh nào để ghép.')]));
_oh.count.textContent = `${_o15} cảnh`;
if (fid) {
const _o8 = root.querySelector(`[data-testid="${fid}"]`);
if (_o8) { _o8.focus(); if (_o1q) { try { _o8.setSelectionRange(_o1q[0], _o1q[1]); } catch { } } }
}
}
function _o1l() {
const v = phaseView(_o1g, { errors: errors.length });
if (_oh.errors) {
_oh.errors.replaceChildren(...errors.map((_o13) => h('li', null, _o13)));
_oh.errors.hidden = !errors.length;
}
if (_oh.total) {
const max = (P.LIMITS && P.LIMITS.maxTotal) || 180;
const tot = lay ? lay.total : 0;
_oh.total.textContent = `Tổng ${fmtTime(tot)} / tối đa ${fmtTime(max)}`;
_oh.total.classList.toggle('bds-danger', tot > max);
}
if (_oh.go) _oh.go.disabled = v.goDisabled;
if (_oh.cancel) _oh.cancel.hidden = !v.showCancel;
if (_oh.progWrap) _oh.progWrap.hidden = !v.showProgress;
if (_oh.result) _oh.result.hidden = !v.showResult;
if (_oh.unsup) _oh.unsup.hidden = !v.showUnsupported;
if (_oh.settings) for (const _o2b of _oh.settings.querySelectorAll('input,select,button')) _o2b.disabled = v.lockEdits;
}
function _o1r(p) {
const _o2a = _o1g === 'rendering';
_o1g = p; _o1l();
if (_o2a !== (p === 'rendering')) _o1m();
}
async function _od() {
const _o14 = ++_oi;
if (_o1g === 'idle' || _o1g === 'unsupported') _o1r('checking');
let ok = false, reason = '';
try {
if (!R || typeof R.canEncode !== 'function') reason = 'thiếu bộ ghép';
else { const r = await R.canEncode(P.frameSize(plan)); ok = !!(r && r.ok); reason = (r && r.reason) || ''; }
} catch (e) { reason = (e && e.message) || ''; }
if (_o14 !== _oi || !alive) return;
if (reason) _oh.unsup.title = reason;
if (_o1g !== 'rendering') _o1r(ok ? (_o1g === 'done' ? 'done' : 'idle') : 'unsupported');
}
async function _o9(_ov) {
const e = src.get(_ov);
if (!e) return null;
if (e.blob) return e.blob;
const r = await fetch(e.url);
if (!r.ok) throw Object.assign(new Error('HTTP ' + r.status), { userMessage: `Không đọc được tệp ${e.name}.` });
e.blob = await r.blob();
return e.blob;
}
async function _o27(ms = 8000) {
const _o1f = [];
for (const sc of plan.scenes) {
const e = sc.kind === 'clip' && sc.srcDur == null && sc.src ? src.get(sc.src) : null;
if (!e || !e.video || !e.el) continue;
if (e.el.readyState >= 1 && Number.isFinite(e.el.duration)) { _o19(sc.src, e.el.duration); continue; }
_o1f.push(new Promise((res) => { e.el.addEventListener('loadedmetadata', res, { once: true }); e.el.addEventListener('error', res, { once: true }); }));
}
if (_o1f.length) await Promise.race([Promise.all(_o1f), new Promise((r) => setTimeout(r, ms))]);
}
async function go() {
if (_o1g === 'rendering') return;
stop();
await _o27();
if (!alive) return;
_o1i({ redraw: false });
const noDur = plan.scenes.map((sc, i) => (sc.kind === 'clip' && sc.srcDur == null ? `Cảnh ${i + 1}: chưa đọc được độ dài clip – anh/chị chọn lại tệp.` : null)).filter(Boolean);
if (noDur.length) { errors = [...noDur, ...errors]; _o1l(); }
if (errors.length) { _oh.errors.scrollIntoView({ block: 'nearest' }); return; }
if (!R || typeof R.renderPlan !== 'function') { _o1r('unsupported'); return; }
const _o1w = plan;
abort = new AbortController();
const signal = abort.signal;
_oh.msg.textContent = '';
_o1t(0, 'Đang chuẩn bị tệp…');
_o1r('rendering');
try { _oh.progWrap.scrollIntoView({ block: 'nearest' }); } catch { }
try {
const sources = new Map();
const keys = new Set(_o1w.scenes.map((_o1o) => _o1o.src).filter(Boolean));
if (_o1w.audio && _o1w.audio.voice && _o1w.audio.voice.src) keys.add(_o1w.audio.voice.src);
if (_o1w.audio && _o1w.audio.music && _o1w.audio.music.src) keys.add(_o1w.audio.music.src);
for (const _ot of keys) { const _o8 = await _o9(_ot); if (_o8) sources.set(_ot, _o8); }
if (signal.aborted) throw _o3();
const layout = P.layout(_o1w);
let audioBuffer = null;
const _o29 = _o1w.audio && (_o1w.audio.voice || _o1w.audio.music || (_o1w.audio.clip && _o1w.audio.clip.on));
if (_o29 && A && typeof A.mixAudio === 'function') {
_o1t(0, 'Đang trộn âm thanh…');
try { audioBuffer = await A.mixAudio(_o1w, { sources, layout }); }
catch (e) { console.warn('[ghep] trộn âm thanh lỗi', e); _oh.msg.textContent = 'Không trộn được âm thanh – video ra sẽ không có tiếng.'; }
}
if (signal.aborted) throw _o3();
const blob = await R.renderPlan(_o1w, {
sources, audioBuffer, signal,
onProgress: (p, label) => _o1t(p, label),
drawFrame: D.drawFrame, frameAt: P.frameAt, layout: P.layout, cues: P.cues,
});
if (!alive) return;
showResult(blob);
_o1r('done');
try { _oh.result.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch { }
} catch (e) {
if (!alive) return;
_oh.msg.textContent = errorText(e);
_oh.msg.classList.toggle('bds-danger', !(e && e.name === 'AbortError'));
_o1r(e && e.name === 'AbortError' ? 'cancelled' : 'error');
} finally { abort = null; }
}
const _o3 = () => { try { return new DOMException('Đã huỷ', 'AbortError'); } catch { return Object.assign(new Error('Đã huỷ'), { name: 'AbortError' }); } };
function _o1t(p, label) {
const v = Math.max(0, Math.min(1, Number(p) || 0));
_oh.prog.value = v;
_oh.progLabel.textContent = (label || 'Đang ghép…') + ' · ' + Math.round(v * 100) + '%';
}
function showResult(blob) {
if (resultUrl) { URL.revokeObjectURL(resultUrl); _o1c.delete(resultUrl); }
resultUrl = _o17(blob);
const name = fileName(title || (plan.output && plan.output.name));
const vid = h('video', { controls: true, playsinline: true, src: resultUrl, 'data-testid': 'ghep-result', class: 'ghep-result-v' + (plan.format === 'horizontal' ? ' ghep-result-h' : '') });
const dl = _o1.linkBtn('Tải về MP4', resultUrl, null, { kind: 'primary', icon: 'download', testid: 'ghep-download' });
dl.setAttribute('download', name);
_oh.result.replaceChildren(
h('h3', null, 'Video đã ghép xong'), vid,
h('p', { class: 'bds-muted ghep-result-info' }, `${name} · ${fmtSize(blob.size)}`),
h('div', { class: 'bds-row' }, dl, _ox('ghep-kit-2')));
}
const _ox = (testid) => kitExport ? _o1.button('Xuất bộ mảnh cho CapCut', () => kitExport(), { icon: 'download', testid }) : null;
function _o1u() {
const S = (path, v, redraw = true) => { plan = setIn(plan, path, v); _o1i({ redraw }); };
const _o1a = (o) => Object.entries(o);
const _op = (label, body) => h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, label), body);
const _o22 = (P.TRANSITIONS || Object.keys(TRANSITION_LABELS)).map((_ot) => [_ot, TRANSITION_LABELS[_ot] || _ot]);
const _o1j = Object.keys(P.QUALITY || QUALITY_LABELS).map((_ot) => [_ot, QUALITY_LABELS[_ot] || _ot]);
const _o1e = (v) => Math.round((Number(v) || 0) * 100) + '%';
const _o1k = (testid, value, max, onv) => {
const out = h('output', { class: 'ghep-pct' }, _o1e(value));
const r = h('input', { type: 'range', min: '0', max: String(max), step: '0.05', value: String(value), 'data-testid': testid,
oninput: (ev) => { out.textContent = _o1e(ev.target.value); onv(Number(ev.target.value)); } });
return h('div', { class: 'ghep-range' }, r, out);
};
const _o6 = plan.audio || {};
const voiceGain = (_o6.voice && _o6.voice.gain) ?? 1, musicGain = (_o6.music && _o6.music.gain) ?? 0.35;
const _o7 = (testid, kind, label) => {
const name = h('span', { class: 'ghep-fname bds-muted' }, _o6[kind] && src.get(_o6[kind].src) ? src.get(_o6[kind].src).name : 'Chưa chọn');
const _os = h('input', { type: 'file', accept: 'audio/*,video/mp4', class: 'ghep-file-in', 'data-testid': testid,
onchange: (ev) => {
const _ok = ev.target.files && ev.target.files[0]; if (!_ok) return;
const _ov = kind + (++nfile);
src.set(_ov, { name: _ok.name, blob: _ok, url: null, video: false, audio: true });
const cur = (plan.audio && plan.audio[kind]) || {};
S(['audio', kind], kind === 'voice' ? { src: _ov, gain: cur.gain ?? 1 } : { src: _ov, gain: cur.gain ?? 0.35, duck: cur.duck ?? true }, false);
name.textContent = _ok.name; _oe.hidden = false;
} });
const _oe = _o1.button('', () => { S(['audio', kind], null, false); name.textContent = 'Chưa chọn'; _oe.hidden = true; _os.value = ''; },
{ icon: 'close', title: 'Bỏ ' + label.toLowerCase(), testid: testid + '-clear' });
_oe.hidden = !_o6[kind];
return h('div', { class: 'ghep-audio-row' },
h('label', { class: 'bds-btn bds-btn-x ghep-file' }, _o1.icon('plus', 18), h('span', null, 'Chọn tệp'), _os), name, _oe);
};
const _o1d = h('div', { class: 'ghep-settings' },
h('div', { class: 'ghep-grid2' },
_o1.field('Khung', _o1.select(_o1a(FORMAT_LABELS), plan.format, { 'data-testid': 'ghep-format', onchange: (ev) => { S(['format'], ev.target.value); _o1m(); _od(); } })),
_o1.field('Chất lượng', _o1.select(_o1j, plan.quality, { 'data-testid': 'ghep-quality', onchange: (ev) => { S(['quality'], ev.target.value, false); _od(); } })),
_o1.field('Chuyển cảnh', _o1.select(_o22, (plan.transition && plan.transition.type) || 'cat', { 'data-testid': 'ghep-transition',
onchange: (ev) => S(['transition'], { ...(plan.transition || {}), type: ev.target.value, dur: (plan.transition && plan.transition.dur) || 0.4 }) })),
_op('Phụ đề', h('div', { class: 'ghep-inline' },
h('label', { class: 'bds-check ghep-check' }, h('input', { type: 'checkbox', checked: !!(plan.subtitles && plan.subtitles.on), 'data-testid': 'ghep-subs',
onchange: (ev) => S(['subtitles', 'on'], ev.target.checked) }), h('span', null, 'Bật')),
_o1.select(_o1a(POS_LABELS), (plan.subtitles && plan.subtitles.pos) || 'duoi', { 'data-testid': 'ghep-subpos', 'aria-label': 'Vị trí phụ đề',
onchange: (ev) => S(['subtitles', 'pos'], ev.target.value) })))),
h('div', { class: 'ghep-audio' },
_op('Giọng đọc', h('div', null, _o7('ghep-voice', 'voice', 'Giọng đọc'),
_o1k('ghep-voice-gain', voiceGain, 1.5, (v) => { if (plan.audio && plan.audio.voice) S(['audio', 'voice', 'gain'], v, false); }))),
_op('Nhạc nền', h('div', null, _o7('ghep-music', 'music', 'Nhạc nền'),
_o1k('ghep-music-gain', musicGain, 1, (v) => { if (plan.audio && plan.audio.music) S(['audio', 'music', 'gain'], v, false); }),
h('label', { class: 'bds-check ghep-check' }, h('input', { type: 'checkbox', checked: !_o6.music || _o6.music.duck !== false, 'data-testid': 'ghep-duck',
onchange: (ev) => { if (plan.audio && plan.audio.music) S(['audio', 'music', 'duck'], ev.target.checked, false); } }), h('span', null, 'Hạ nhạc khi có giọng')))),
_op('Tiếng gốc của clip', h('div', null,
h('label', { class: 'bds-check ghep-check' }, h('input', { type: 'checkbox', checked: !!(_o6.clip && _o6.clip.on), 'data-testid': 'ghep-clipaudio',
onchange: (ev) => S(['audio', 'clip'], { ...((plan.audio && plan.audio.clip) || { gain: 1 }), on: ev.target.checked }, false) }), h('span', null, 'Giữ tiếng gốc')),
_o1k('ghep-clip-gain', (_o6.clip && _o6.clip.gain) ?? 1, 1.5, (v) => S(['audio', 'clip'], { ...((plan.audio && plan.audio.clip) || { on: false }), gain: v }, false))))));
return _o1d;
}
function _oa() {
_oh.list = h('div', { class: 'ghep-list' });
_oh.count = h('span', { class: 'bds-muted' });
_oh.canvas = h('canvas', { class: 'ghep-canvas', width: 480, height: 854, 'data-testid': 'ghep-canvas', 'aria-label': 'Xem trước video' });
_oh.stage = h('div', { class: 'ghep-stage' }, _oh.canvas);
_oh.seek = h('input', { type: 'range', min: '0', max: '0', step: '0.04', value: '0', class: 'ghep-seek', 'data-testid': 'ghep-seek', 'aria-label': 'Tua xem trước',
oninput: (ev) => { if (playing) stop(); t = Number(ev.target.value) || 0; _o1x(false); _of(); } });
_oh.time = h('span', { class: 'ghep-time bds-muted' }, '0:00 / 0:00');
_oh.playWrap = h('span');
_oh.total = h('span', { class: 'ghep-total' });
_oh.settings = _o1u();
_oh.go = _o1.button('Ghép video', go, { kind: 'primary', icon: 'film', testid: 'ghep-go' });
_oh.go.classList.add('ghep-go');
_oh.cancel = _o1.button('Huỷ', () => { if (abort) abort.abort(); }, { icon: 'close', testid: 'ghep-cancel' });
_oh.prog = h('progress', { max: '1', value: '0', 'data-testid': 'ghep-progress', class: 'ghep-prog' });
_oh.progLabel = h('span', { class: 'bds-muted ghep-prog-l' });
_oh.progWrap = h('div', { class: 'ghep-progwrap' }, _oh.prog, _oh.progLabel);
_oh.errors = h('ul', { class: 'ghep-errors bds-error', 'data-testid': 'ghep-errors', role: 'alert' });
_oh.msg = h('p', { class: 'ghep-msg', role: 'status' });
_oh.unsup = h('div', { class: 'ghep-unsup', 'data-testid': 'ghep-unsupported', role: 'alert' }, h('p', null, UNSUPPORTED_MSG));
_oh.result = h('section', { class: 'ghep-result bds-card' });
const _oy = _ox('ghep-kit');
root.replaceChildren(
h('div', { class: 'bds-head' },
h('div', null, h('h2', null, 'Ghép nhanh'), h('p', { class: 'bds-muted ghep-sub' }, title ? title : 'Ghép các cảnh thành một video MP4 ngay trên máy này – tệp không gửi đi đâu.')),
h('div', { class: 'bds-row' }, _oh.total, _oy)),
h('div', { class: 'ghep-main' },
h('section', { class: 'ghep-left' }, h('div', { class: 'ghep-left-h' }, h('h3', null, 'Danh sách cảnh'), _oh.count), _oh.list),
h('aside', { class: 'ghep-right' },
h('section', { class: 'bds-card ghep-preview' },
_oh.stage,
h('div', { class: 'ghep-player' }, _oh.playWrap, _oh.seek, _oh.time),
h('p', { class: 'bds-muted ghep-note' }, PREVIEW_NOTE)),
h('section', { class: 'bds-card ghep-actions' },
h('div', { class: 'bds-row ghep-go-row' }, _oh.go, _oh.cancel),
_oh.errors, _oh.progWrap, _oh.msg, _oh.unsup),
_oh.result,
h('section', { class: 'bds-card' }, h('h3', { class: 'ghep-h3' }, 'Cài đặt'), _oh.settings))));
_o1s();
}
const ready = (async () => {
const _o13 = await _o10(opts.deps || {});
if (!alive) return;
P = _o13.plan; D = _o13.draw; R = _o13.render; A = _o13.audio;
const { clips: clipMap, images: imageMap, entries } = clipKeys(opts.clips);
for (const [_ot, info] of entries) _o5(_ot, info);
plan = P.planFromScenes(Array.isArray(opts.scenes) ? opts.scenes : [], { clips: clipMap, images: imageMap, title });
plan.scenes.forEach((sc, i) => { const e = sc.src && src.get(sc.src); if (e && !e.video && sc.kind === 'clip') plan = setScene(plan, i, { kind: 'image', dur: sc.dur || 4 }); });
if (!plan.output || !plan.output.name) plan = setIn(plan, ['output', 'name'], fileName(title).replace(/\.mp4$/, ''));
_oa();
_o1i();
_o1m();
await _od();
})().catch((e) => {
console.error('[ghep] mở màn lỗi', e);
if (alive) root.replaceChildren(h('div', { class: 'bds-card ghep-fail', role: 'alert' }, h('p', null, 'Không mở được màn Ghép nhanh: ' + ((e && e.message) || e)),
_ox('ghep-kit')));
});
return {
ready,
get plan() { return plan; },
destroy() {
alive = false; playing = false; cancelAnimationFrame(raf);
if (abort) { try { abort.abort(); } catch { } }
for (const e of src.values()) if (e.video && e.el) { try { e.el.pause(); e.el.removeAttribute('src'); e.el.load(); } catch { } }
for (const _o24 of _o1c) { try { URL.revokeObjectURL(_o24); } catch { } }
_o1c.clear(); src.clear();
root.replaceChildren();
root.classList.remove('ghep', 'bds-screen', 'bds-form');
delete root.dataset.testid;
},
};
}

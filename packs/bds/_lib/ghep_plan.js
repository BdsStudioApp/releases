export const QUALITY = { nhap: { short: 480, vbit: 1_500_000 }, tot: { short: 720, vbit: 3_500_000 }, cao: { short: 1080, vbit: 8_000_000 } };
export const QUALITY_LABEL = { nhap: 'Nháp 480p', tot: 'Tốt 720p', cao: 'Cao 1080p' };
export const TRANSITIONS = ['cat', 'mo', 'truot_trai', 'truot_phai', 'phong_to'];
export const TRANSITION_LABEL = { cat: 'Cắt thẳng', mo: 'Mờ dần', truot_trai: 'Trượt trái', truot_phai: 'Trượt phải', phong_to: 'Phóng to' };
export const FORMATS = ['vertical', 'horizontal'];
export const POSITIONS = ['tren', 'giua', 'duoi'];
export const FITS = ['cover', 'contain'];
export const LIMITS = { maxScenes: 40, maxTotal: 180, minScene: 0.5, maxImage: 30 };
export const MAX_TRANSITION = 2;
export const MAX_GAIN = 2;
export const CUE_LINE = 42;
export const CUE_LINES = 2;
const _o1 = 0.15;
const _o0 = 0.001;
const _oq = (_o11) => Math.round(_o11 * 1000) / 1000;
const clamp = (_o11, a, b) => Math.max(a, Math.min(b, _o11));
const num = (v) => (v === null || v === undefined || v === '' ? NaN : Number(v));
const _oe = (v) => Number.isFinite(num(v));
const _o7 = (_or) => String(_or ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
const _o8 = (_or) => String(_or ?? '').normalize('NFC').split(/\r?\n/).map(_o7).filter(Boolean).join('\n');
const words = (_or) => _o7(_or).split(' ').filter(Boolean).length;
const fold = (_or) => String(_or ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
const vn = (_o11) => String(_oq(Number(_o11))).replace('.', ',');
const copy = (o) => (o === null || o === undefined ? o : JSON.parse(JSON.stringify(o)));
export function frameSize(plan = {}) {
const _oo = QUALITY[plan && plan.quality] || QUALITY.tot;
const short = _oo.short, long = Math.round((short * 16) / 9 / 2) * 2;
return plan && plan.format === 'horizontal' ? { width: long, height: short } : { width: short, height: long };
}
export function sceneDur(scene) {
if (!scene || typeof scene !== 'object') return 0;
if (scene.kind === 'clip') {
const a = _oe(scene.in) ? num(scene.in) : 0;
const b = _oe(scene.out) ? num(scene.out) : _oe(scene.srcDur) ? num(scene.srcDur) : NaN;
if (Number.isFinite(b)) return _oq(Math.max(0, b - a));
return _oe(scene.dur) ? _oq(Math.max(0, num(scene.dur))) : 0;
}
return _oe(scene.dur) ? _oq(Math.max(0, num(scene.dur))) : 0;
}
export function transDur(plan, i) {
const _os = (plan && Array.isArray(plan.scenes) && plan.scenes) || [];
const tr = (plan && plan.transition) || {};
if (i < 0 || i + 1 >= _os.length || !TRANSITIONS.includes(tr.type) || tr.type === 'cat') return 0;
const _oa = _oe(tr.dur) ? num(tr.dur) : 0;
if (_oa <= 0) return 0;
return _oq(Math.min(_oa, MAX_TRANSITION, sceneDur(_os[i]) / 2, sceneDur(_os[i + 1]) / 2));
}
export function layout(plan) {
const _os = (plan && Array.isArray(plan.scenes) && plan.scenes) || [];
const items = [];
let start = 0;
for (let i = 0; i < _os.length; i++) {
const dur = sceneDur(_os[i]);
const tIn = i > 0 ? transDur(plan, i - 1) : 0, tOut = transDur(plan, i);
if (i > 0) start = _oq(items[i - 1].end - tIn);
items.push({ id: _os[i] && _os[i].id, index: i, start, end: _oq(start + dur), dur, tIn, tOut });
}
return { items, total: items.length ? items[items.length - 1].end : 0 };
}
function _oi(scene, it, t) {
const _ol = (scene && scene.kind === 'clip' && _oe(scene.in) ? num(scene.in) : 0);
const _od = clamp(t - it.start, 0, Math.max(0, it.dur - _o0));
return { scene, index: it.index, local: _oq(_ol + _od), progress: it.dur > 0 ? _od / it.dur : 0, alpha: 1, dx: 0, dy: 0, scale: 1 };
}
export function frameAt(plan, t, lay) {
const L = lay || layout(plan);
const _os = (plan && plan.scenes) || [];
if (!L.items.length) return { layers: [] };
let _o11 = Number(t);
if (!Number.isFinite(_o11) || _o11 < 0) _o11 = 0;
if (_o11 >= L.total) _o11 = Math.max(0, L.total - _o0);
const on = L.items.filter((it) => it.start <= _o11 && _o11 < it.end);
if (!on.length) on.push(L.items[L.items.length - 1]);
if (on.length === 1) return { layers: [_oi(_os[on[0].index], on[0], _o11)] };
const [a, b] = on.slice(-2);
const A = _oi(_os[a.index], a, _o11), B = _oi(_os[b.index], b, _o11);
const _ow = b.tIn || a.tOut || 0;
const _om = _ow > 0 ? clamp((_o11 - b.start) / _ow, 0, 1) : 1;
const type = plan.transition && plan.transition.type;
if (type === 'truot_trai') { A.dx = -_om; B.dx = 1 - _om; }
else if (type === 'truot_phai') { A.dx = _om; B.dx = -(1 - _om); }
else if (type === 'phong_to') { A.scale = 1 + _o1 * _om; B.alpha = _om; }
else B.alpha = _om;
for (const _oh of [A, B]) { _oh.alpha = _oq(_oh.alpha); _oh.dx = _oq(_oh.dx) || 0; _oh.scale = _oq(_oh.scale); }
return { layers: [A, B] };
}
const _o6 = (_oy, n) => { const out = []; for (let i = 0; i < _oy.length; i += n) out.push(_oy.slice(i, i + n)); return out; };
export function splitLines(text, n = CUE_LINE) {
const _oj = [];
for (const _ot of _o7(text).split(/(?<=[.!?…])\s+/).filter(Boolean)) {
let _o9 = '';
const _on = _oj.length ? _oj[_oj.length - 1] : '';
if (_on && (_on + ' ' + _ot).length <= n) { _oj[_oj.length - 1] = _on + ' ' + _ot; continue; }
for (const _oz of _ot.split(' ')) {
for (const _oy of _o6(_oz, n)) {
if (!_o9) _o9 = _oy;
else if ((_o9 + ' ' + _oy).length <= n && _oz.length <= n) _o9 += ' ' + _oy;
else { _oj.push(_o9); _o9 = _oy; }
}
}
if (_o9) _oj.push(_o9);
}
return _oj;
}
function _o4(plan, L) {
const out = [];
(plan.scenes || []).forEach((_or, i) => {
const it = L.items[i];
const say = _o7(_or && _or.say);
if (!it || !say) return;
const a = it.start + it.tIn / 2, b = it.end - it.tOut / 2;
if (b <= a) return;
const _oj = splitLines(say);
const _oc = [];
for (let _og = 0; _og < _oj.length; _og += CUE_LINES) _oc.push(_oj.slice(_og, _og + CUE_LINES));
const _oy = _oc.map((g) => Math.max(1, words(g.join(' '))));
const total = _oy.reduce((_o11, y) => _o11 + y, 0);
let _o2 = 0;
_oc.forEach((g, _og) => {
const start = _oq(a + ((b - a) * _o2) / total);
_o2 += _oy[_og];
out.push({ start, end: _og === _oc.length - 1 ? _oq(b) : _oq(a + ((b - a) * _o2) / total), text: g.join('\n') });
});
});
return out;
}
export function cues(plan, lay) {
if (!plan) return [];
const _ok = plan.subtitles && plan.subtitles.cues;
if (Array.isArray(_ok)) {
return _ok.filter((_o5) => _o5 && _oe(_o5.start) && _oe(_o5.end) && num(_o5.end) > num(_o5.start) && _o8(_o5.text))
.map((_o5) => ({ start: _oq(num(_o5.start)), end: _oq(num(_o5.end)), text: _o8(_o5.text) }))
.sort((_o11, y) => _o11.start - y.start);
}
return _o4(plan, lay || layout(plan));
}
export function cueAt(list, t) {
if (!Array.isArray(list)) return '';
const _o5 = list.find((_o11) => _o11 && _o11.start <= t && t < _o11.end);
return _o5 ? _o5.text : '';
}
const _ob = (g) => !_oe(g) || num(g) < 0 || num(g) > MAX_GAIN;
export function validatePlan(plan) {
if (!plan || typeof plan !== 'object') return ['Chưa có kế hoạch ghép.'];
const e = [];
if (!FORMATS.includes(plan.format)) e.push('Khung hình phải là dọc 9:16 hoặc ngang 16:9.');
if (!QUALITY[plan.quality]) e.push('Chất lượng phải là Nháp, Tốt hoặc Cao.');
if (!_oe(plan.fps) || num(plan.fps) < 1 || num(plan.fps) > 60) e.push('Số khung hình/giây phải từ 1 đến 60.');
const tr = plan.transition || {};
if (!TRANSITIONS.includes(tr.type)) e.push(`Chuyển cảnh "${_o7(tr.type)}" không hợp lệ – chọn một trong: ${TRANSITIONS.map((_og) => TRANSITION_LABEL[_og]).join(', ')}.`);
else if (tr.type !== 'cat' && (!_oe(tr.dur) || num(tr.dur) < 0)) e.push('Chuyển cảnh: độ dài phải là số giây ≥ 0.');
else if (tr.type !== 'cat' && num(tr.dur) > MAX_TRANSITION) e.push(`Chuyển cảnh: dài ${vn(tr.dur)} giây – tối đa ${MAX_TRANSITION} giây.`);
const _os = Array.isArray(plan.scenes) ? plan.scenes : [];
if (!_os.length) e.push('Chưa có cảnh nào để ghép – anh/chị thêm ít nhất một clip hoặc ảnh.');
if (_os.length > LIMITS.maxScenes) e.push(`Video có ${_os.length} cảnh – tối đa ${LIMITS.maxScenes} cảnh, anh/chị bớt cảnh giúp em.`);
const ids = new Set();
_os.forEach((_or, i) => {
const P = `Cảnh ${i + 1}: `;
if (!_or || typeof _or !== 'object') { e.push(P + 'trống.'); return; }
if (_or.id === undefined || _or.id === null || _or.id === '') e.push(P + 'thiếu mã cảnh.');
else if (ids.has(_or.id)) e.push(P + `mã cảnh trùng ("${_or.id}").`);
else ids.add(_or.id);
if (_or.kind !== 'clip' && _or.kind !== 'image') { e.push(P + `loại cảnh "${_o7(_or.kind)}" không hợp lệ (clip hoặc ảnh).`); return; }
const _o10 = _or.kind === 'clip' ? 'clip' : 'ảnh';
if (!_o7(_or.src)) e.push(P + `chưa có tệp ${_o10} – anh/chị chọn tệp cho cảnh này.`);
if (_or.fit !== undefined && !FITS.includes(_or.fit)) e.push(P + 'cách đặt khung phải là "lấp đầy" (cover) hoặc "vừa khung" (contain).');
if (_or.text !== null && _or.text !== undefined) {
if (typeof _or.text !== 'object') e.push(P + 'chữ trên cảnh không hợp lệ.');
else if (!POSITIONS.includes(_or.text.pos)) e.push(P + 'vị trí chữ phải là trên, giữa hoặc dưới.');
}
let _ox = false;
if (_or.kind === 'clip') {
const a = num(_or.in), b = num(_or.out), src = num(_or.srcDur);
if (_or.in !== undefined && _or.in !== null && (!Number.isFinite(a) || a < 0)) { e.push(P + 'cắt đầu phải ≥ 0 giây.'); _ox = true; }
if (_or.out !== null && _or.out !== undefined && !Number.isFinite(b)) { e.push(P + 'cắt cuối phải là số giây.'); _ox = true; }
if (Number.isFinite(b) && b <= (Number.isFinite(a) ? a : 0)) { e.push(P + `cắt cuối ${vn(b)} giây phải sau cắt đầu ${vn(Number.isFinite(a) ? a : 0)} giây.`); _ox = true; }
if (Number.isFinite(src) && Number.isFinite(b) && b > src + _o0) { e.push(P + `cắt cuối ${vn(b)} giây vượt độ dài clip ${vn(src)} giây.`); _ox = true; }
if (Number.isFinite(src) && Number.isFinite(a) && a >= src) { e.push(P + `cắt đầu ${vn(a)} giây vượt độ dài clip ${vn(src)} giây.`); _ox = true; }
if (!Number.isFinite(src) && !Number.isFinite(b) && !_oe(_or.dur)) { e.push(P + 'chưa đọc được độ dài clip – anh/chị chờ tệp nạp xong hoặc chọn lại tệp.'); _ox = true; }
}
if (!_ox) {
const _oa = sceneDur(_or);
if (_oa < LIMITS.minScene) e.push(P + `dài ${vn(_oa)} giây – tối thiểu ${vn(LIMITS.minScene)} giây.`);
if (_or.kind === 'image' && _oa > LIMITS.maxImage) e.push(P + `ảnh dài ${vn(_oa)} giây – tối đa ${LIMITS.maxImage} giây.`);
}
});
const total = layout({ ...plan, scenes: _os }).total;
if (total > LIMITS.maxTotal + _o0) e.push(`Video dài ${vn(total)} giây – tối đa ${LIMITS.maxTotal} giây, anh/chị bớt cảnh hoặc cắt ngắn giúp em.`);
const _ov = plan.subtitles || {};
if (_ov.on && !POSITIONS.includes(_ov.pos)) e.push('Phụ đề: vị trí phải là trên, giữa hoặc dưới.');
if (_ov.cues !== null && _ov.cues !== undefined && !Array.isArray(_ov.cues)) e.push('Phụ đề: danh sách phụ đề không hợp lệ.');
const _o3 = plan.audio || {};
if (_o3.voice) { if (!_o7(_o3.voice.src)) e.push('Giọng đọc: chưa có tệp.'); if (_ob(_o3.voice.gain ?? 1)) e.push(`Giọng đọc: âm lượng phải từ 0 đến ${MAX_GAIN}.`); }
if (_o3.music) { if (!_o7(_o3.music.src)) e.push('Nhạc nền: chưa có tệp.'); if (_ob(_o3.music.gain ?? 0.35)) e.push(`Nhạc nền: âm lượng phải từ 0 đến ${MAX_GAIN}.`); }
if (_o3.clip && _o3.clip.on && _ob(_o3.clip.gain ?? 1)) e.push(`Tiếng gốc clip: âm lượng phải từ 0 đến ${MAX_GAIN}.`);
return e;
}
export function sceneSecondsOf(_or = {}) {
const _op = (_o11) => Math.round(_o11 * 100) / 100;
const set = Number(_or && _or.seconds);
if (Number.isFinite(set) && set > 0) return _op(clamp(set, 1, 30));
const _oy = words((_or && (_or.say || _or.text)) || '');
if (_or && _or.kind === 'checklist') return _op(clamp(_oy / 3.2 + 1.2, 4, 20));
if (_or && _or.kind === 'intro') return _op(clamp(_oy / 3.75 + 0.6, 3, 4));
if (_or && _or.kind === 'outro') return _op(clamp(_oy / 3.75 + 0.8, 3, 4.5));
return _op(clamp(_oy / 3.75 + 0.6, 2.5, 4));
}
const _ou = (v) => (typeof v === 'string' ? v : v && typeof v === 'object' ? String(v.key || v.name || '') : '');
export const outName = (title) => fold(title).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'video';
export function planFromScenes(scenes, opts = {}) {
const o = opts || {};
const clips = o.clips || {}, images = o.images || {};
const tr = typeof o.transition === 'string' ? { type: o.transition } : o.transition || {};
return {
version: 1,
format: FORMATS.includes(o.format) ? o.format : 'vertical',
quality: QUALITY[o.quality] ? o.quality : 'tot',
fps: 30,
transition: { type: TRANSITIONS.includes(tr.type) ? tr.type : 'mo', dur: _oe(tr.dur) ? clamp(num(tr.dur), 0, MAX_TRANSITION) : 0.4 },
scenes: (Array.isArray(scenes) ? scenes : []).slice(0, LIMITS.maxScenes).map((_or, i) => {
const _o5 = _ou(clips[i]);
const text = _o8(_or && _or.text);
return {
id: 's' + (i + 1), kind: _o5 ? 'clip' : 'image', src: _o5 || _ou(images[i]), in: 0, out: null, srcDur: null,
dur: sceneSecondsOf(_or || {}), fit: 'cover', kenburns: !_o5,
text: text ? { value: text, pos: 'giua' } : null, say: _o7(_or && _or.say),
};
}),
subtitles: { on: true, pos: 'duoi', cues: null },
audio: { voice: null, music: null, clip: { on: false, gain: 1 } },
output: { name: outName(o.title) },
};
}
export function moveScene(plan, i, dir) {
const _om = copy(plan);
const _oa = dir === 'up' ? -1 : dir === 'down' ? 1 : Math.sign(Number(dir) || 0);
const _of = i + _oa;
if (!_om || !Array.isArray(_om.scenes) || !_oa || i < 0 || i >= _om.scenes.length || _of < 0 || _of >= _om.scenes.length) return _om;
[_om.scenes[i], _om.scenes[_of]] = [_om.scenes[_of], _om.scenes[i]];
return _om;
}
export function removeScene(plan, i) {
const _om = copy(plan);
if (_om && Array.isArray(_om.scenes) && i >= 0 && i < _om.scenes.length) _om.scenes.splice(i, 1);
return _om;
}
export function trimScene(plan, i, inSec, outSec) {
const _om = copy(plan);
const _or = _om && Array.isArray(_om.scenes) ? _om.scenes[i] : null;
if (!_or || _or.kind !== 'clip') return _om;
const src = _oe(_or.srcDur) ? num(_or.srcDur) : Infinity;
_or.in = _oe(inSec) ? _oq(clamp(num(inSec), 0, src)) : 0;
_or.out = _oe(outSec) ? _oq(clamp(num(outSec), 0, src)) : null;
_or.dur = sceneDur(_or);
return _om;
}

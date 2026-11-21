export function voiceRegions(samples, sampleRate, { win = 0.05, thresh = 0.02, hold = 0.25 } = {}) {
const _op = samples ? samples.length : 0;
if (!_op || !(sampleRate > 0)) return [];
const total = _op / sampleRate;
const _ov = Math.max(1, Math.round(win * sampleRate));
const _oq = [];
let _ob = null;
for (let _oi = 0; _oi < _op; _oi += _ov) {
const e = Math.min(_op, _oi + _ov);
let _ow = 0;
for (let _ok = _oi; _ok < e; _ok++) _ow += samples[_ok] * samples[_ok];
const _ot = Math.sqrt(_ow / (e - _oi));
if (_ot < thresh) continue;
const _ou = _oi / sampleRate, end = Math.min(total, e / sampleRate + hold);
if (_ob && _ou <= _ob.end) _ob.end = Math.max(_ob.end, end);
else { _ob = { start: _ou, end }; _oq.push(_ob); }
}
return _oq.map((_os) => ({ start: round(_os.start), end: round(_os.end) }));
}
const round = (x) => Math.round(x * 1e6) / 1e6;
export function musicGain(t, { gain = 0.35, duck = true, regions = [], duckTo = 0.25, ramp = 0.15 } = {}) {
const _oh = Number.isFinite(gain) ? gain : 0;
if (!duck || !regions || !regions.length) return _oh;
let _of = 1;
for (const _os of regions) {
let _oy;
if (t >= _os.start && t <= _os.end) _oy = duckTo;
else if (ramp > 0 && t < _os.start && t > _os.start - ramp) _oy = duckTo + (1 - duckTo) * ((_os.start - t) / ramp);
else if (ramp > 0 && t > _os.end && t < _os.end + ramp) _oy = duckTo + (1 - duckTo) * ((t - _os.end) / ramp);
else continue;
if (_oy < _of) _of = _oy;
}
return _oh * _of;
}
export function fadeGain(t, total, { fadeIn = 0.5, fadeOut = 1.0 } = {}) {
if (!(total > 0) || t < 0 || t > total) return 0;
let _of = 1;
if (fadeIn > 0) _of = Math.min(_of, t / fadeIn);
if (fadeOut > 0) _of = Math.min(_of, (total - t) / fadeOut);
return Math.max(0, Math.min(1, _of));
}
export function musicCurve(total, { gain, duck, regions, duckTo, ramp, fadeIn, fadeOut } = {}, perSec = 100) {
const _op = Math.max(2, Math.ceil(total * perSec) + 1);
const _o4 = new Float32Array(_op);
for (let _oi = 0; _oi < _op; _oi++) {
const t = (_oi / (_op - 1)) * total;
_o4[_oi] = musicGain(t, { gain, duck, regions, duckTo, ramp }) * fadeGain(t, total, { fadeIn, fadeOut });
}
return _o4;
}
export function monoOf(_o3) {
const _o6 = _o3.numberOfChannels || 1;
const _o1 = _o3.getChannelData(0);
if (_o6 === 1) return _o1;
const _oo = new Float32Array(_o1.length);
for (let _o4 = 0; _o4 < _o6; _o4++) { const _od = _o3.getChannelData(_o4); for (let _oi = 0; _oi < _oo.length; _oi++) _oo[_oi] += _od[_oi] / _o6; }
return _oo;
}
const _oe = async (_o2, _oa) => _oa.decodeAudioData(await _o2.arrayBuffer());
export async function mixAudio(plan, { sources, layout, sampleRate = 48000, decode = _oe, OfflineCtx, onWarn } = {}) {
const warn = onWarn || ((_oo) => { try { console.warn('[ghep_audio]', _oo); } catch { } });
const total = Number(layout && layout.total) || 0;
const audio = (plan && plan.audio) || {};
const _o0 = OfflineCtx || globalThis.OfflineAudioContext || globalThis.webkitOfflineAudioContext;
if (!(total > 0)) return null;
const voice = audio.voice && audio.voice.src ? audio.voice : null;
const music = audio.music && audio.music.src ? audio.music : null;
const _o8 = !!(audio.clip && audio.clip.on);
const _o9 = _o8 ? (plan.scenes || []).filter((_ou) => _ou && _ou.kind === 'clip' && _ou.src) : [];
if (!voice && !music && !_o9.length) return null;
if (!_o0) throw Object.assign(new Error('OfflineAudioContext không có'), { userMessage: 'Trình duyệt này chưa trộn được âm thanh, anh/chị dùng Chrome hoặc Edge.' });
const _oa = new _o0(2, Math.ceil(total * sampleRate), sampleRate);
const _o5 = new Map();
const _om = (key, what) => {
if (!_o5.has(key)) {
const _o2 = sources && sources.get(key);
_o5.set(key, !_o2 ? Promise.resolve(null).then(() => { warn(`Thiếu tệp ${what}, bỏ qua phần âm thanh này.`); return null; })
: Promise.resolve().then(() => decode(_o2, _oa)).catch((e) => { warn(`Không đọc được âm thanh của ${what} (${(e && e.message) || e}), bỏ qua.`); return null; }));
}
return _o5.get(key);
};
let _ol = 0;
let regions = [];
if (voice) {
const _o3 = await _om(voice.src, 'giọng đọc');
if (_o3) {
const src = _oa.createBufferSource(); src.buffer = _o3;
const _oh = _oa.createGain(); _oh.gain.value = num(voice.gain, 1);
src.connect(_oh); _oh.connect(_oa.destination);
src.start(0, 0, Math.min(total, _o3.duration));
regions = voiceRegions(monoOf(_o3), _o3.sampleRate).filter((_os) => _os.start < total);
_ol++;
}
}
if (_o9.length) {
const items = (layout.items || []);
const byId = new Map(items.map((_oj) => [_oj.id, _oj]));
for (const _ou of _o9) {
const _oj = byId.get(_ou.id) || items.find((x) => x.index === plan.scenes.indexOf(_ou));
if (!_oj || !(_oj.dur > 0)) continue;
const _o3 = await _om(_ou.src, `clip cảnh ${(_oj.index ?? 0) + 1}`);
if (!_o3) continue;
const off = Math.max(0, num(_ou.in, 0));
const dur = Math.min(_oj.dur, _o3.duration - off);
if (!(dur > 0)) continue;
const _or = items.find((x) => x.index === _oj.index - 1), next = items.find((x) => x.index === _oj.index + 1);
const _og = _o7(_or ? _or.end - _oj.start : 0, dur), fout = _o7(next ? _oj.end - next.start : 0, dur);
const _on = num(audio.clip.gain, 1);
const src = _oa.createBufferSource(); src.buffer = _o3;
const _oh = _oa.createGain();
const _ox = _oj.start, t1 = _oj.start + dur;
_oh.gain.setValueAtTime(0, _ox);
_oh.gain.linearRampToValueAtTime(_on, _ox + _og);
_oh.gain.setValueAtTime(_on, t1 - fout);
_oh.gain.linearRampToValueAtTime(0, t1);
src.connect(_oh); _oh.connect(_oa.destination);
src.start(_ox, off, dur);
_ol++;
}
}
if (music) {
const _o3 = await _om(music.src, 'nhạc nền');
if (_o3 && _o3.duration > 0) {
const src = _oa.createBufferSource(); src.buffer = _o3; src.loop = true;
const _oh = _oa.createGain();
const _oc = musicCurve(total, { gain: num(music.gain, 0.35), duck: music.duck !== false, regions });
_oh.gain.value = _oc[0];
_oh.gain.setValueCurveAtTime(_oc, 0, total);
src.connect(_oh); _oh.connect(_oa.destination);
src.start(0); src.stop(total);
_ol++;
}
}
if (!_ol) return null;
return _oa.startRendering();
}
const num = (_oy, _od) => (Number.isFinite(Number(_oy)) && _oy !== null && _oy !== '' ? Number(_oy) : _od);
const _o7 = (x, dur) => Math.min(dur / 2, Math.max(0.01, x || 0));

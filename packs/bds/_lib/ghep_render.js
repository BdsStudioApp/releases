import { createMp4 } from './ghep_mp4.js';
const QUALITY = { nhap: { short: 480, vbit: 1_500_000 }, tot: { short: 720, vbit: 3_500_000 }, cao: { short: 1080, vbit: 8_000_000 } };
const _o0 = 128_000;
const _o1 = 1024;
const _o4 = 8;
const _o3 = 2;
const _o5 = 4000;
export const UNSUPPORTED_MSG = 'Trình duyệt này chưa ghép được, anh/chị dùng Chrome hoặc Edge, hoặc Xuất bộ mảnh cho CapCut';
const _o2 = ['avc1.640028', 'avc1.4d0028', 'avc1.42e028', 'avc1.42002a', 'avc1.42001f'];
const _oo = _o15 => Math.max(2, Math.round(_o15 / 2) * 2);
export function sizeOf(plan) {
const short = (QUALITY[plan?.quality] || QUALITY.tot).short;
const _o11 = _oo(Math.ceil((short * 16) / 9));
return plan?.format === 'horizontal' ? { width: _o11, height: short } : { width: short, height: _o11 };
}
export const bitrateOf = plan => (QUALITY[plan?.quality] || QUALITY.tot).vbit;
function _o1o(msg, cause) {
const e = new Error(msg + (cause?.message ? ` (${cause.message})` : ''));
e.userMessage = msg;
if (cause) e.cause = cause;
return e;
}
const _o7 = () => {
const e = typeof DOMException === 'function' ? new DOMException('Đã huỷ ghép video', 'AbortError') : Object.assign(new Error('Đã huỷ ghép video'), { name: 'AbortError' });
try { e.userMessage = 'Đã huỷ ghép video'; } catch { }
return e;
};
async function _o1d({ width, height, bitrate = 3_500_000, framerate = 30 }) {
if (typeof VideoEncoder === 'undefined' || typeof VideoFrame === 'undefined') return null;
for (const codec of _o2) {
for (const hardwareAcceleration of ['no-preference', 'prefer-software']) {
const cfg = { codec, width, height, bitrate, framerate, avc: { format: 'avc' }, hardwareAcceleration, latencyMode: 'quality' };
try {
const _o1e = await VideoEncoder.isConfigSupported(cfg);
if (_o1e?.supported) return { ...cfg, ...(_o1e.config || {}), avc: { format: 'avc' } };
} catch { }
}
}
return null;
}
async function _o1c({ sampleRate = 48000, numberOfChannels = 2 } = {}) {
if (typeof AudioEncoder === 'undefined' || typeof AudioData === 'undefined') return null;
const _o1j = [
{ kind: 'aac', cfg: { codec: 'mp4a.40.2', sampleRate, numberOfChannels, bitrate: _o0, aac: { format: 'aac' } } },
{ kind: 'opus', cfg: { codec: 'opus', sampleRate: 48000, numberOfChannels, bitrate: _o0 } },
];
for (const t of _o1j) {
try {
const _o1e = await AudioEncoder.isConfigSupported(t.cfg);
if (_o1e?.supported) return t;
} catch { }
}
return null;
}
export async function measurePriming({ kind, cfg }) {
if (kind !== 'aac') return null;
const _or = 2112;
if (typeof AudioDecoder === 'undefined') return _or;
const _o1g = cfg.sampleRate, _og = cfg.numberOfChannels, LEAD = 4096, N = 16384;
const chunks = [], pcm = [];
let _om = null, enc = null, dec = null;
try {
enc = new AudioEncoder({
output: (_oe, m) => { if (m?.decoderConfig?.description && !_om) _om = _oj(m.decoderConfig.description); chunks.push(_oe); },
error: () => {},
});
enc.configure(cfg);
for (let _o17 = 0; _o17 < N; _o17 += _o1) {
const data = new Float32Array(_o1 * _og);
for (let _oe = 0; _oe < _og; _oe++) for (let _ou = 0; _ou < _o1; _ou++) {
const _oy = _o17 + _ou;
data[_oe * _o1 + _ou] = _oy >= LEAD ? 0.5 * Math.sin((2 * Math.PI * 1000 * _oy) / _o1g) : 0;
}
const _o9 = new AudioData({ format: 'f32-planar', sampleRate: _o1g, numberOfFrames: _o1, numberOfChannels: _og, timestamp: Math.round((_o17 * 1e6) / _o1g), data });
enc.encode(_o9); _o9.close();
}
await enc.flush();
dec = new AudioDecoder({
output: d => {
const _op = new Float32Array(d.numberOfFrames);
d.copyTo(_op, { planeIndex: 0, format: 'f32-planar' });
pcm.push(_op); d.close();
},
error: () => {},
});
dec.configure({ codec: cfg.codec, sampleRate: _o1g, numberOfChannels: _og, ...(_om ? { description: _om } : {}) });
for (const _oe of chunks) dec.decode(_oe);
await dec.flush();
let _ou = 0;
outer: for (const _op of pcm) for (let _oy = 0; _oy < _op.length; _oy++, _ou++) if (Math.abs(_op[_oy]) > 0.05) break outer;
const p = _ou - LEAD;
return p >= 0 && p < LEAD ? p : _or;
} catch {
return _or;
} finally {
for (const _o1y of [enc, dec]) { try { if (_o1y && _o1y.state !== 'closed') _o1y.close(); } catch { } }
}
}
export async function canEncode({ width = 720, height = 1280 } = {}) {
if (typeof VideoEncoder === 'undefined') return { ok: false, video: null, audio: null, reason: UNSUPPORTED_MSG };
const _o1p = await _o1d({ width, height });
const _o6 = await _o1c();
if (!_o1p) return { ok: false, video: null, audio: _o6?.kind || null, reason: UNSUPPORTED_MSG };
return { ok: true, video: _o1p.codec, audio: _o6?.kind || null, reason: _o6 ? '' : 'Trình duyệt này không mã hoá được tiếng – video sẽ không có tiếng.' };
}
const _o1b = (el, ok, bad, ms) => new Promise((res, rej) => {
let _o1i = null;
const _on = (fn, _o1p) => { clearTimeout(_o1i); el.removeEventListener(ok, _o1a); if (bad) el.removeEventListener(bad, _o19); fn(_o1p); };
const _o1a = () => _on(res);
const _o19 = () => _on(rej, el.error || new Error(bad));
el.addEventListener(ok, _o1a);
if (bad) el.addEventListener(bad, _o19);
if (ms) _o1i = setTimeout(() => _on(res), ms);
});
function _o13(sources) {
const _o1n = new Map();
const _ox = new Map();
const _ob = new Map();
const _o1v = new Map();
const _o1m = src => {
if (!_o1n.has(src)) {
const b = sources?.get?.(src);
_o1n.set(src, b ? URL.createObjectURL(b) : null);
}
return _o1n.get(src);
};
async function _ow(scene) {
if (_ob.has(scene.src)) return;
if (!_ox.has(scene.src)) {
const b = sources?.get?.(scene.src);
_ox.set(scene.src, b ? createImageBitmap(b).catch(() => null) : Promise.resolve(null));
}
_ob.set(scene.src, await _ox.get(scene.src));
}
async function clip(scene, local, fps) {
let _o1p = _o1v.get(scene.id);
if (!_o1p) {
const _o1l = _o1m(scene.src);
if (!_o1l) { _o1v.set(scene.id, (_o1p = { el: null })); return; }
const el = document.createElement('video');
el.muted = true; el.playsInline = true; el.preload = 'auto'; el.crossOrigin = 'anonymous';
el.src = _o1l;
_o1p = { el, ok: false, last: -1 };
_o1v.set(scene.id, _o1p);
try { await _o1b(el, 'loadeddata', 'error', 15000); _o1p.ok = el.readyState >= 2; } catch { _o1p.ok = false; }
}
if (!_o1p.el || !_o1p.ok) return;
const dur = Number.isFinite(_o1p.el.duration) ? _o1p.el.duration : Infinity;
const _o1x = Math.max(0, Math.min(local + 0.001, dur - 0.001));
if (Math.abs(_o1x - _o1p.last) < 0.5 / fps) return;
_o1p.el.currentTime = _o1x;
await _o1b(_o1p.el, 'seeked', null, _o5);
_o1p.last = _o1x;
}
return {
async prepare(layers, fps) {
for (const L of layers) {
if (!L?.scene) continue;
if (L.scene.kind === 'clip') await clip(L.scene, L.local || 0, fps);
else await _ow(L.scene);
}
},
get(scene) {
if (!scene) return null;
if (scene.kind === 'clip') {
const _o1p = _o1v.get(scene.id);
return _o1p?.el && _o1p.ok ? { img: _o1p.el, w: _o1p.el.videoWidth, h: _o1p.el.videoHeight } : null;
}
const _oc = _ob.get(scene.src);
return _oc ? { img: _oc, w: _oc.width, h: _oc.height } : null;
},
release(keepIds) {
for (const [id, _o1p] of _o1v) {
if (keepIds.has(id)) continue;
if (_o1p.el) { _o1p.el.removeAttribute('src'); _o1p.el.load(); }
_o1v.delete(id);
}
},
dispose() {
this.release(new Set());
for (const _oc of _ob.values()) _oc?.close?.();
_ob.clear(); _ox.clear();
for (const _o1k of _o1n.values()) if (_o1k) URL.revokeObjectURL(_o1k);
_o1n.clear();
},
};
}
function _o12(width, height) {
if (typeof OffscreenCanvas === 'function') return new OffscreenCanvas(width, height);
const _oe = document.createElement('canvas');
_oe.width = width; _oe.height = height;
return _oe;
}
const _o1w = enc => new Promise(res => {
if (enc.encodeQueueSize <= _o4) return res();
const _o1h = () => (enc.encodeQueueSize <= _o4 ? res() : setTimeout(_o1h, 2));
if ('ondequeue' in enc) {
const h = () => { if (enc.encodeQueueSize <= _o4) { enc.removeEventListener('dequeue', h); res(); } };
enc.addEventListener('dequeue', h);
} else _o1h();
});
const _o1f = (lay, t) => {
const items = lay?.items || [];
let _ov = 0;
for (let _ou = 0; _ou < items.length; _ou++) if (t >= items[_ou].start) _ov = _ou;
return `Đang ghép cảnh ${Math.min(_ov + 1, items.length || 1)}/${items.length || 1}`;
};
export async function renderPlan(plan, opts = {}) {
const { sources = new Map(), audioBuffer = null, onProgress, signal, drawFrame, frameAt, layout, cues } = opts;
if (typeof drawFrame !== 'function' || typeof frameAt !== 'function' || typeof layout !== 'function') {
throw _o1o('Thiếu phần vẽ khung (drawFrame/frameAt/layout) – anh/chị tải lại trang rồi thử lại.');
}
if (typeof VideoEncoder === 'undefined' || typeof VideoFrame === 'undefined') throw _o1o(UNSUPPORTED_MSG);
if (signal?.aborted) throw _o7();
const fps = plan.fps > 0 ? plan.fps : 30;
const { width, height } = opts.frameSize || sizeOf(plan);
const lay = layout(plan);
const total = Math.max(0, lay?.total || 0);
if (!(total > 0)) throw _o1o('Video chưa có cảnh nào để ghép.');
const _o16 = Math.max(1, Math.round(total * fps));
const _ol = plan.subtitles?.on === false ? [] : (typeof cues === 'function' ? cues(plan, lay) : undefined);
const _o1s = await _o1d({ width, height, bitrate: bitrateOf(plan), framerate: fps });
if (!_o1s) throw _o1o(UNSUPPORTED_MSG);
const _o8 = audioBuffer ? await _o1c({ sampleRate: audioBuffer.sampleRate, numberOfChannels: Math.min(2, audioBuffer.numberOfChannels) }) : null;
const priming = _o8 ? await measurePriming(_o8) : null;
const _o1q = [], aChunks = [];
let _o1r = null, aDesc = null, failed = null;
const _oq = e => { failed = failed || e; };
const copy = _oe => { const b = new Uint8Array(_oe.byteLength); _oe.copyTo(b); return b; };
const _o1t = new VideoEncoder({
output: (chunk, meta) => {
if (meta?.decoderConfig?.description && !_o1r) _o1r = new Uint8Array(_oj(meta.decoderConfig.description));
_o1q.push({ b: copy(chunk), ts: chunk.timestamp, dur: chunk.duration ?? Math.round(1e6 / fps), key: chunk.type === 'key' });
},
error: _oq,
});
let _oa = null;
const src = _o13(sources);
const _o18 = () => _oq(_o7());
signal?.addEventListener?.('abort', _o18);
const _oi = () => {
for (const e of [_o1t, _oa]) { try { if (e && e.state !== 'closed') e.close(); } catch { } }
};
try {
_o1t.configure(_o1s);
if (audioBuffer && _o8) {
_oa = new AudioEncoder({
output: (chunk, meta) => {
if (meta?.decoderConfig?.description && !aDesc) aDesc = new Uint8Array(_oj(meta.decoderConfig.description));
aChunks.push({ b: copy(chunk), ts: chunk.timestamp, dur: chunk.duration ?? 0 });
},
error: _oq,
});
_oa.configure(_o8.cfg);
const _o1g = audioBuffer.sampleRate;
const _og = Math.min(2, audioBuffer.numberOfChannels);
const _oh = Array.from({ length: _og }, (_, _ou) => audioBuffer.getChannelData(_ou));
const _o10 = Math.min(audioBuffer.length, Math.round(total * _o1g));
for (let _o17 = 0; _o17 < _o10; _o17 += _o1) {
if (failed) throw failed;
const _o15 = Math.min(_o1, _o10 - _o17);
const data = new Float32Array(_o15 * _og);
for (let _oe = 0; _oe < _og; _oe++) data.set(_oh[_oe].subarray(_o17, _o17 + _o15), _oe * _o15);
const _o9 = new AudioData({ format: 'f32-planar', sampleRate: _o1g, numberOfFrames: _o15, numberOfChannels: _og, timestamp: Math.round((_o17 * 1e6) / _o1g), data });
_oa.encode(_o9);
_o9.close();
if (_oa.encodeQueueSize > 64) await new Promise(_o1e => setTimeout(_o1e, 0));
}
await _oa.flush();
}
const _of = _o12(width, height);
const _ok = _of.getContext('2d', { alpha: false });
const _oz = Math.max(1, Math.round(fps * _o3));
const _ot = 1e6 / fps;
for (let _ou = 0; _ou < _o16; _ou++) {
if (failed) throw failed;
if (signal?.aborted) throw _o7();
const t = Math.min(total - 1e-6, _ou / fps);
const _os = frameAt(plan, t, lay) || { layers: [] };
const layers = _os.layers || [];
await src.prepare(layers, fps);
if (_ou % fps === 0) src.release(new Set(layers.map(L => L.scene?.id)));
_ok.save();
drawFrame(_ok, plan, t, s => src.get(s), { lay, cues: _ol });
_ok.restore();
const ts = Math.round(_ou * _ot);
const _o1u = new VideoFrame(_of, { timestamp: ts, duration: Math.round((_ou + 1) * _ot) - ts });
_o1t.encode(_o1u, { keyFrame: _ou % _oz === 0 });
_o1u.close();
await _o1w(_o1t);
if (onProgress && (_ou % 5 === 0 || _ou === _o16 - 1)) onProgress(Math.min(0.99, (_ou + 1) / _o16), _o1f(lay, t));
}
await _o1t.flush();
if (failed) throw failed;
if (!_o1r) throw _o1o('Bộ mã hoá hình không trả cấu hình H.264 – anh/chị thử Chrome bản mới.');
const _o14 = createMp4({
video: { width, height, fps, description: _o1r },
audio: aChunks.length ? { codec: _o8.kind, sampleRate: _o8.cfg.sampleRate, channels: _o8.cfg.numberOfChannels, description: aDesc, priming } : undefined,
});
for (const _oe of _o1q) _o14.addVideo(_oe.b, _oe.ts, _oe.dur, _oe.key);
for (const _oe of aChunks) _o14.addAudio(_oe.b, _oe.ts, _oe.dur);
_o1q.length = 0; aChunks.length = 0;
const _od = _o14.finish();
onProgress?.(1, 'Xong');
return new Blob([_od], { type: 'video/mp4' });
} catch (e) {
if (e?.name === 'AbortError' || signal?.aborted) throw _o7();
if (e?.userMessage) throw e;
throw _o1o('Ghép video bị lỗi – anh/chị thử chất lượng Nháp hoặc Xuất bộ mảnh cho CapCut.', e);
} finally {
signal?.removeEventListener?.('abort', _o18);
_oi();
src.dispose();
}
}
function _oj(d) {
if (ArrayBuffer.isView(d)) return d.buffer.slice(d.byteOffset, d.byteOffset + d.byteLength);
return d.slice(0);
}

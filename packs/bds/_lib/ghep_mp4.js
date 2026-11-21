const _o2 = 1000;
const _o1 = 500_000;
const enc = new TextEncoder();
const _o1a = n => [n & 255];
const u16 = n => [(n >>> 8) & 255, n & 255];
const u24 = n => [(n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const u32 = n => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
const u64 = n => { const _ol = Math.floor(n / 2 ** 32), lo = n >>> 0; return [...u32(_ol), ...u32(lo)]; };
const i32 = n => u32(n < 0 ? n + 2 ** 32 : n);
const str = _o10 => [...enc.encode(_o10)];
const zeros = n => new Array(n).fill(0);
function _oa(parts) {
let _oo = 0;
for (const _ow of parts) _oo += _ow.length;
const _ou = new Uint8Array(_oo);
let _os = 0;
for (const _ow of parts) { _ou.set(_ow, _os); _os += _ow.length; }
return _ou;
}
export function box(type, ...parts) {
const flat = [];
const _o1e = _ow => {
if (_ow instanceof Uint8Array) flat.push(_ow);
else if (Array.isArray(_ow)) {
if (_ow.every(x => typeof x === 'number')) flat.push(Uint8Array.from(_ow));
else _ow.forEach(_o1e);
}
};
parts.forEach(_o1e);
const body = _oa(flat);
return _oa([Uint8Array.from([...u32(8 + body.length), ...str(type)]), body]);
}
export const fullBox = (type, version, flags, ...parts) => box(type, [_o1a(version), u24(flags)].flat(), ...parts);
const MATRIX = [0x00010000, 0, 0, 0, 0x00010000, 0, 0, 0, 0x40000000].flatMap(u32);
const _o17 = d => {
if (!d) return null;
if (d instanceof Uint8Array) return d;
if (ArrayBuffer.isView(d)) return new Uint8Array(d.buffer, d.byteOffset, d.byteLength);
if (d instanceof ArrayBuffer) return new Uint8Array(d);
return null;
};
const _o0 = [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025, 8000, 7350];
export function aacConfig(sampleRate, channels) {
let _oj = _o0.indexOf(sampleRate);
if (_oj < 0) _oj = 3;
const _o1c = (2 << 11) | (_oj << 7) | ((channels & 15) << 3);
return Uint8Array.from(u16(_o1c));
}
const desc = (tag, body) => {
const n = body.length;
return [tag, 0x80 | ((n >>> 21) & 127), 0x80 | ((n >>> 14) & 127), 0x80 | ((n >>> 7) & 127), n & 127, ...body];
};
function _oi(asc, bitrate = 128000) {
const dsi = desc(0x05, [...asc]);
const dcd = desc(0x04, [0x40 , 0x15 , ...u24(0), ...u32(bitrate), ...u32(bitrate), ...dsi]);
const _oh = desc(0x03, [...u16(1) , 0, ...dcd, ...desc(0x06, [0x02])]);
return fullBox('esds', 0, 0, _oh);
}
export function opusPreSkip(description) {
const d = _o17(description);
if (d && d.length >= 19 && String.fromCharCode(...d.subarray(0, 8)) === 'OpusHead') return d[10] | (d[11] << 8);
return 312;
}
function _oe(channels, sampleRate, description) {
return box('dOps', [0, channels & 255, ...u16(opusPreSkip(description)), ...u32(sampleRate), ...u16(0), 0]);
}
export function runLength(values) {
const _ou = [];
for (const _o1c of values) {
const _on = _ou[_ou.length - 1];
if (_on && _on[1] === _o1c) _on[0]++; else _ou.push([1, _o1c]);
}
return _ou;
}
function _ox(t) {
const _o10 = t.samples;
const ts = t.timescale;
const _oz = _o1b => Math.round((_o1b * ts) / 1e6);
const n = _o10.length;
const pts = _o10.map(x => _oz(x.ts));
const _o11 = [...pts].sort((a, _o6) => a - _o6);
const _o7 = _o11.length ? _o11[0] : 0;
const dts = _o11.map(_o1c => _o1c - _o7);
const durs = [];
for (let _om = 0; _om + 1 < n; _om++) durs.push(dts[_om + 1] - dts[_om]);
if (n) {
const _ov = _o10[n - 1].dur > 0 ? _oz(_o10[n - 1].ts + _o10[n - 1].dur) - _oz(_o10[n - 1].ts) : 0;
durs.push(Math.max(1, _ov || durs[n - 2] || 1));
}
const offs = pts.map((_ow, _om) => _ow - _o7 - dts[_om]);
const needCtts = offs.some(_os => _os !== 0);
const mediaDur = durs.reduce((a, _o6) => a + _o6, 0);
const skip = Math.max(0, Math.min(t.skip || 0, mediaDur - 1));
const shownMs = Math.round(((mediaDur - skip) / ts) * _o2);
return { ...t, n, dts, durs, offs, needCtts, mediaDur, skip, shownMs, startUs: n ? Math.max(0, (_o7 * 1e6) / ts) : 0 };
}
function _ob(t, trackIdx) {
const _ou = [];
let _od = null;
for (let _om = 0; _om < t.n; _om++) {
const _o1b = (t.dts[_om] * 1e6) / t.timescale + t.startUs;
if (!_od || _o1b - _od.startUs >= _o1) { _od = { track: trackIdx, first: _om, count: 0, startUs: _o1b }; _ou.push(_od); }
_od.count++;
}
return _ou;
}
function _o14(t, chunks, offsets) {
const _o15 = fullBox('stts', 0, 0, (() => {
const r = runLength(t.durs);
return [...u32(r.length), ...r.flatMap(([_o9, _o1c]) => [...u32(_o9), ...u32(_o1c)])];
})());
const parts = [t.stsd, _o15];
if (t.kind === 'video') {
const keys = [];
t.samples.forEach((x, _om) => { if (x.key) keys.push(_om + 1); });
if (keys.length !== t.n) parts.push(fullBox('stss', 0, 0, [...u32(keys.length), ...keys.flatMap(u32)]));
}
if (t.needCtts) {
const r = runLength(t.offs);
parts.push(fullBox('ctts', 1, 0, [...u32(r.length), ...r.flatMap(([_o9, _o1c]) => [...u32(_o9), ...i32(_o1c)])]));
}
const sc = [];
chunks.forEach((_o9, _om) => { if (!sc.length || sc[sc.length - 1][1] !== _o9.count) sc.push([_om + 1, _o9.count]); });
parts.push(fullBox('stsc', 0, 0, [...u32(sc.length), ...sc.flatMap(([first, cnt]) => [...u32(first), ...u32(cnt), ...u32(1)])]));
parts.push(fullBox('stsz', 0, 0, [...u32(0), ...u32(t.n), ...t.samples.flatMap(x => u32(x.bytes.length))]));
parts.push(fullBox('co64', 0, 0, [...u32(offsets.length), ...offsets.flatMap(u64)]));
return box('stbl', ...parts);
}
function _o19(t, id, chunks, offsets) {
const _o1c = t.kind === 'video';
const _o16 = t.shownMs;
const _o13 = Math.round(t.startUs / 1000);
const tkhd = fullBox('tkhd', 0, 3, [
...u32(0), ...u32(0), ...u32(id), ...u32(0), ...u32(_o16 + _o13),
...zeros(8), ...u16(0), ...u16(_o1c ? 0 : 1) , ...u16(_o1c ? 0 : 0x0100), ...u16(0),
...MATRIX, ...u32(_o1c ? t.width * 65536 : 0), ...u32(_o1c ? t.height * 65536 : 0),
]);
const edits = [];
if (_o13 > 0) edits.push([_o13, -1]);
edits.push([_o16, t.skip]);
const edts = box('edts', fullBox('elst', 0, 0, [...u32(edits.length), ...edits.flatMap(([d, m]) => [...u32(d), ...i32(m), ...u16(1), ...u16(0)])]));
const mdhd = fullBox('mdhd', 0, 0, [...u32(0), ...u32(0), ...u32(t.timescale), ...u32(t.mediaDur), ...u16(0x55c4) , ...u16(0)]);
const hdlr = fullBox('hdlr', 0, 0, [...u32(0), ...str(_o1c ? 'vide' : 'soun'), ...zeros(12), ...str(_o1c ? 'VideoHandler' : 'SoundHandler'), 0]);
const xmhd = _o1c ? fullBox('vmhd', 0, 1, zeros(8)) : fullBox('smhd', 0, 0, zeros(4));
const dinf = box('dinf', fullBox('dref', 0, 0, u32(1), fullBox('url ', 0, 1)));
return box('trak', tkhd, edts, box('mdia', mdhd, hdlr, box('minf', xmhd, dinf, _o14(t, chunks, offsets))));
}
function _o1d({ width, height, description }) {
const _o5 = _o17(description);
if (!_o5 || !_o5.length) throw new Error('Thiếu avcC (decoderConfig.description) của H.264');
return fullBox('stsd', 0, 0, u32(1), box('avc1',
zeros(6), u16(1), u16(0), u16(0), zeros(12), u16(width), u16(height),
u32(0x00480000), u32(0x00480000), u32(0), u16(1), zeros(32), u16(0x0018), u16(0xffff),
box('avcC', _o5), box('pasp', u32(1), u32(1))));
}
function _o4({ codec, sampleRate, channels, description, bitrate }) {
const head = [zeros(6), u16(1), zeros(8), u16(channels), u16(16), u16(0), u16(0), u32((sampleRate & 0xffff) * 65536)];
if (codec === 'opus') return fullBox('stsd', 0, 0, u32(1), box('Opus', ...head, _oe(channels, sampleRate, description)));
const asc = _o17(description) && _o17(description).length ? _o17(description) : aacConfig(sampleRate, channels);
return fullBox('stsd', 0, 0, u32(1), box('mp4a', ...head, _oi(asc, bitrate)));
}
export function createMp4({ video, audio = null } = {}) {
if (!video || !(video.width > 0) || !(video.height > 0)) throw new Error('createMp4: thiếu video.width/height');
const fps = video.fps > 0 ? video.fps : 30;
const _o18 = [{
kind: 'video', timescale: Math.round(fps * 1000), width: video.width, height: video.height,
stsd: _o1d(video), samples: [],
}];
if (audio) {
const _o12 = audio.codec === 'opus' ? 48000 : (audio.sampleRate || 48000);
const skip = Number.isFinite(audio.priming) && audio.priming >= 0 ? Math.round(audio.priming) : (audio.codec === 'opus' ? opusPreSkip(audio.description) : 0);
_o18.push({ kind: 'audio', timescale: _o12, skip, stsd: _o4({ ...audio, sampleRate: _o12, channels: audio.channels || 2 }), samples: [] });
}
let _og = false;
const _o3 = (t, bytes, ts, dur, key) => {
if (_og) throw new Error('createMp4: đã finish()');
const _o6 = _o17(bytes);
if (!_o6) throw new Error('createMp4: bytes phải là Uint8Array');
t.samples.push({ bytes: _o6, ts: Number(ts) || 0, dur: Number(dur) || 0, key: !!key });
};
return {
addVideo(bytes, tsMicros, durMicros, key) { _o3(_o18[0], bytes, tsMicros, durMicros, key); },
addAudio(bytes, tsMicros, durMicros) {
if (!_o18[1]) throw new Error('createMp4: không khai báo audio');
_o3(_o18[1], bytes, tsMicros, durMicros, true);
},
finish() {
if (_og) throw new Error('createMp4: đã finish()');
_og = true;
const ready = _o18.map(_ox).filter(t => t.n > 0 || t.kind === 'video');
const _oc = ready.map((t, _om) => _ob(t, _om));
const _ot = _oc.flat().sort((a, _o6) => a.startUs - _o6.startUs || a.track - _o6.track);
let rel = 0;
for (const _o9 of _ot) {
_o9.rel = rel;
const _o10 = ready[_o9.track].samples;
for (let _om = _o9.first; _om < _o9.first + _o9.count; _om++) rel += _o10[_om].bytes.length;
}
const _of = rel;
const _op = _of + 8 > 0xffffffff ? 16 : 8;
const _ok = box('ftyp', str('isom'), u32(0x200), str('isom'), str('iso2'), str('mp42'), str('avc1'));
const _o8 = _o7 => {
const _or = Math.max(0, ...ready.map(t => t.shownMs + Math.round(t.startUs / 1000)));
const mvhd = fullBox('mvhd', 0, 0, [
...u32(0), ...u32(0), ...u32(_o2), ...u32(_or), ...u32(0x00010000), ...u16(0x0100), ...zeros(10),
...MATRIX, ...zeros(24), ...u32(ready.length + 1),
]);
const traks = ready.map((t, _om) => _o19(t, _om + 1, _oc[_om], _oc[_om].map(_o9 => _o7 + _o9.rel)));
return box('moov', mvhd, ...traks);
};
const _oy = _o8(0);
const _o7 = _ok.length + _oy.length + _op;
const _oq = _o8(_o7);
const head = _op === 8
? Uint8Array.from([...u32(_of + 8), ...str('mdat')])
: Uint8Array.from([...u32(1), ...str('mdat'), ...u64(_of + 16)]);
const _ou = new Uint8Array(_o7 + _of);
_ou.set(_ok, 0);
_ou.set(_oq, _ok.length);
_ou.set(head, _ok.length + _oq.length);
for (const _o9 of _ot) {
const _o10 = ready[_o9.track].samples;
let _os = _o7 + _o9.rel;
for (let _om = _o9.first; _om < _o9.first + _o9.count; _om++) { _ou.set(_o10[_om].bytes, _os); _os += _o10[_om].bytes.length; }
}
for (const t of _o18) t.samples = [];
return _ou;
},
};
}

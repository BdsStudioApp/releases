export const LIMITS = Object.freeze({
maxTotal: 60 * 1024 * 1024,
maxEntries: 2000,
maxCells: 50000,
maxRows: 100000,
maxCols: 1024,
});
export class OoxmlError extends Error {
constructor(code, message) { super(message); this.name = 'OoxmlError'; this.code = code; }
}
const _ox = (code, message) => { throw new OoxmlError(code, message); };
const _o5 = typeof process !== 'undefined' && !!(process.versions && process.versions.node);
const _o7 = new TextDecoder('utf-8');
function _o2r(input) {
if (input instanceof Uint8Array) return input;
if (input instanceof ArrayBuffer) return new Uint8Array(input);
if (ArrayBuffer.isView(input)) return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
if (input && typeof input.byteLength === 'number') return new Uint8Array(input);
return _ox('INPUT', 'Dữ liệu vào không phải ArrayBuffer/Uint8Array.');
}
let _o3 = null;
export function crc32(_o2w) {
if (!_o3) {
_o3 = new Uint32Array(256);
for (let n = 0; n < 256; n++) { let c = n; for (let _o1e = 0; _o1e < 8; _o1e++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; _o3[n] = c >>> 0; }
}
let c = 0xFFFFFFFF;
for (let _o15 = 0; _o15 < _o2w.length; _o15++) c = _o3[(c ^ _o2w[_o15]) & 0xFF] ^ (c >>> 8);
return (c ^ 0xFFFFFFFF) >>> 0;
}
const _o1a = (_o2w) => _o2w.length >= 8 && _o2w[0] === 0xD0 && _o2w[1] === 0xCF && _o2w[2] === 0x11 && _o2w[3] === 0xE0;
const _o1b = (_o2w) => _o2w.length >= 4 && _o2w[0] === 0x50 && _o2w[1] === 0x4B && (_o2w[2] === 3 || _o2w[2] === 5) && (_o2w[3] === 4 || _o2w[3] === 6);
export function safeName(_o29) {
if (!_o29 || _o29.includes('\0')) return null;
const s = String(_o29).replace(/\\/g, '/').replace(/^[a-zA-Z]:/, '');
if (s.endsWith('/')) return null;
const _o26 = [];
for (const seg of s.split('/')) {
if (!seg || seg === '.') continue;
if (seg === '..') return null;
_o26.push(seg);
}
return _o26.length ? _o26.join('/') : null;
}
const _o1v = () => _ox('OLE', 'File là định dạng Office cũ (.xls/.doc) hoặc đã đặt mật khẩu – hãy mở bằng Excel/Word và "Lưu thành" .xlsx/.docx không mật khẩu.');
function _o2b(_o2w, maxEntries) {
if (_o1a(_o2w)) _o1v();
const dv = new DataView(_o2w.buffer, _o2w.byteOffset, _o2w.byteLength);
if (_o2w.length < 22) _ox('ZIP_INVALID', 'File không phải ZIP/Office hợp lệ (quá ngắn).');
let _ov = -1;
for (let _o15 = _o2w.length - 22, min = Math.max(0, _o2w.length - 22 - 0xFFFF); _o15 >= min; _o15--) {
if (dv.getUint32(_o15, true) === 0x06054b50) { _ov = _o15; break; }
}
if (_ov < 0) _ox('ZIP_INVALID', 'File không phải ZIP/Office hợp lệ (không thấy thư mục trung tâm).');
let _ok = dv.getUint16(_ov + 10, true), cdSize = dv.getUint32(_ov + 12, true), cdOff = dv.getUint32(_ov + 16, true);
if (_ok === 0xFFFF || cdSize === 0xFFFFFFFF || cdOff === 0xFFFFFFFF) {
const _o1n = _ov - 20;
if (_o1n >= 0 && dv.getUint32(_o1n, true) === 0x07064b50) {
const _o35 = Number(dv.getBigUint64(_o1n + 8, true));
if (_o35 + 56 <= _o2w.length && dv.getUint32(_o35, true) === 0x06064b50) {
_ok = Number(dv.getBigUint64(_o35 + 32, true)); cdSize = Number(dv.getBigUint64(_o35 + 40, true)); cdOff = Number(dv.getBigUint64(_o35 + 48, true));
}
}
}
if (_ok > maxEntries) _ox('ZIP_TOO_MANY', `File có ${_ok} mục – vượt giới hạn ${maxEntries} (nghi zip bomb).`);
if (cdOff + cdSize > _o2w.length) _ox('ZIP_INVALID', 'File ZIP bị cắt cụt hoặc hỏng.');
const _o1w = [];
let _o1x = cdOff;
for (let _o15 = 0; _o15 < _ok; _o15++) {
if (_o1x + 46 > _o2w.length || dv.getUint32(_o1x, true) !== 0x02014b50) _ox('ZIP_INVALID', 'Thư mục trung tâm ZIP hỏng.');
const flags = dv.getUint16(_o1x + 8, true), method = dv.getUint16(_o1x + 10, true), crc = dv.getUint32(_o1x + 16, true);
let csize = dv.getUint32(_o1x + 20, true), usize = dv.getUint32(_o1x + 24, true);
const _o1t = dv.getUint16(_o1x + 28, true), el = dv.getUint16(_o1x + 30, true), cl = dv.getUint16(_o1x + 32, true);
let lho = dv.getUint32(_o1x + 42, true);
if (_o1x + 46 + _o1t + el + cl > _o2w.length) _ox('ZIP_INVALID', 'Thư mục trung tâm ZIP hỏng.');
const rawName = _o7.decode(_o2w.subarray(_o1x + 46, _o1x + 46 + _o1t));
for (let _o32 = _o1x + 46 + _o1t, xe = _o32 + el; _o32 + 4 <= xe;) {
const id = dv.getUint16(_o32, true), sz = dv.getUint16(_o32 + 2, true);
if (id === 0x0001) {
let _o28 = _o32 + 4;
const _o2a = () => { const v = _o28 + 8 <= _o32 + 4 + sz ? Number(dv.getBigUint64(_o28, true)) : null; _o28 += 8; return v; };
if (usize === 0xFFFFFFFF) usize = _o2a() ?? usize;
if (csize === 0xFFFFFFFF) csize = _o2a() ?? csize;
if (lho === 0xFFFFFFFF) lho = _o2a() ?? lho;
}
_o32 += 4 + sz;
}
_o1w.push({ rawName, name: safeName(rawName), flags, method, crc, csize, usize, lho });
_o1x += 46 + _o1t + el + cl;
}
return { entries: _o1w, dv };
}
export function listZip(input, opts = {}) {
const { entries } = _o2b(_o2r(input), opts.maxEntries ?? LIMITS.maxEntries);
return entries.filter((e) => e.name).map((e) => ({ name: e.name, size: e.usize, csize: e.csize, method: e.method, encrypted: !!(e.flags & 1) }));
}
let _o36 = null;
const _o1m = () => (_o36 ||= import('node:zlib').catch(() => null));
async function _o19(_o29, cap) {
let _or;
try { _or = new DecompressionStream('deflate-raw'); } catch { _ox('NO_INFLATE', 'Trình duyệt quá cũ, không giải nén được (thiếu DecompressionStream "deflate-raw").'); }
const _o31 = _or.writable.getWriter();
_o31.write(_o29).catch(() => {});
_o31.close().catch(() => {});
const _o2c = _or.readable.getReader();
const chunks = []; let n = 0;
try {
for (;;) {
const { done, value } = await _o2c.read();
if (done) break;
n += value.length;
if (n > cap) { _o2c.cancel().catch(() => {}); _ox('ZIP_SIZE', 'Dữ liệu giải nén lớn hơn kích thước khai báo (nghi zip bomb).'); }
chunks.push(value);
}
} catch (e) {
if (e instanceof OoxmlError) throw e;
_ox('ZIP_CORRUPT', 'Dữ liệu nén trong file bị hỏng.');
}
const _o1w = new Uint8Array(n); let _o1u = 0;
for (const c of chunks) { _o1w.set(c, _o1u); _o1u += c.length; }
return _o1w;
}
async function _o18(_o29, cap, _o1r) {
const _o30 = _o1r === 'web' || (_o1r !== 'node' && !_o5 && typeof DecompressionStream === 'function');
if (!_o30) {
const _o35 = await _o1m();
if (_o35 && _o35.inflateRawSync) {
try { return new Uint8Array(_o35.inflateRawSync(_o29, { maxOutputLength: Math.max(1, cap) })); } catch (e) {
if (e && (e.code === 'ERR_BUFFER_TOO_LARGE' || e instanceof RangeError)) _ox('ZIP_SIZE', 'Dữ liệu giải nén lớn hơn kích thước khai báo (nghi zip bomb).');
_ox('ZIP_CORRUPT', 'Dữ liệu nén trong file bị hỏng.');
}
}
if (_o1r === 'node') _ox('NO_INFLATE', 'Không nạp được node:zlib.');
}
if (typeof DecompressionStream !== 'function') _ox('NO_INFLATE', 'Môi trường này không giải nén được deflate.');
return _o19(_o29, cap);
}
export async function unzip(input, opts = {}) {
const _o2w = _o2r(input);
const maxTotal = opts.maxTotal ?? LIMITS.maxTotal;
const { entries, dv } = _o2b(_o2w, opts.maxEntries ?? LIMITS.maxEntries);
const filter = typeof opts.filter === 'function' ? opts.filter : null;
const _o2n = new Set(), sel = [];
let _o2u = 0;
for (const e of entries) {
if (!e.name || _o2n.has(e.name) || (filter && !filter(e.name))) continue;
_o2n.add(e.name);
if (e.flags & 1) _ox('ZIP_ENCRYPTED', 'File đã mã hoá/đặt mật khẩu – hãy lưu lại không mật khẩu.');
if (e.method !== 0 && e.method !== 8) _ox('ZIP_METHOD', `Kiểu nén ${e.method} không hỗ trợ (chỉ stored/deflate).`);
_o2u += e.usize;
if (_o2u > maxTotal) _ox('ZIP_TOO_BIG', `Nội dung giải nén vượt ${Math.round(maxTotal / 1048576)} MB (nghi zip bomb).`);
sel.push(e);
}
const _o1w = new Map();
for (const e of sel) {
const _o1h = e.lho;
if (_o1h + 30 > _o2w.length || dv.getUint32(_o1h, true) !== 0x04034b50) _ox('ZIP_INVALID', 'Tiêu đề mục ZIP hỏng.');
const start = _o1h + 30 + dv.getUint16(_o1h + 26, true) + dv.getUint16(_o1h + 28, true);
if (start + e.csize > _o2w.length) _ox('ZIP_INVALID', 'File ZIP bị cắt cụt.');
const _o29 = _o2w.subarray(start, start + e.csize);
let data;
if (e.method === 0) {
if (e.csize !== e.usize) _ox('ZIP_SIZE', 'Kích thước mục không nén không khớp.');
data = _o29.slice();
} else {
data = await _o18(_o29, e.usize, opts.inflate);
}
if (data.length !== e.usize) _ox('ZIP_SIZE', 'Kích thước giải nén không khớp khai báo.');
if (crc32(data) !== e.crc) _ox('ZIP_CRC', `Mục "${e.name}" sai CRC – file hỏng.`);
_o1w.set(e.name, data);
}
return _o1w;
}
export function decodeText(input) {
const _o2w = _o2r(input);
if (_o2w[0] === 0xEF && _o2w[1] === 0xBB && _o2w[2] === 0xBF) return _o7.decode(_o2w.subarray(3));
if (_o2w[0] === 0xFF && _o2w[1] === 0xFE) return new TextDecoder('utf-16le').decode(_o2w.subarray(2));
if (_o2w[0] === 0xFE && _o2w[1] === 0xFF) return new TextDecoder('utf-16be').decode(_o2w.subarray(2));
try { return new TextDecoder('utf-8', { fatal: true }).decode(_o2w); } catch { }
for (const _ot of ['windows-1258', 'windows-1252']) {
try { return new TextDecoder(_ot).decode(_o2w); } catch { }
}
return _o7.decode(_o2w);
}
const _o34 = (_o2w) => (_o2w ? decodeText(_o2w) : '');
const _o4 = { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" };
export function decodeEntities(s) {
if (s.indexOf('&') < 0) return s;
return s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g, (m, e) => {
if (e[0] === '#') {
const _ol = e[1] === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
return _ol > 0 && _ol <= 0x10FFFF && !(_ol >= 0xD800 && _ol <= 0xDFFF) ? String.fromCodePoint(_ol) : m;
}
return Object.prototype.hasOwnProperty.call(_o4, e) ? _o4[e] : m;
});
}
const _o1o = (n) => { const _o1e = n.indexOf(':'); return _o1e < 0 ? n : n.slice(_o1e + 1); };
const _o0 = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
function _o20(body, from) {
const a = {};
_o0.lastIndex = from;
for (let m; (m = _o0.exec(body));) {
const v = decodeEntities(m[2] ?? m[3] ?? '');
a[m[1]] = v;
const _o1l = _o1o(m[1]);
if (_o1l !== m[1] && !(_o1l in a)) a[_o1l] = v;
}
return a;
}
export function scanXml(_o33, h) {
const n = _o33.length;
let _o15 = 0;
while (_o15 < n) {
const lt = _o33.indexOf('<', _o15);
const _ou = lt < 0 ? n : lt;
if (_ou > _o15 && h.text && h.text(decodeEntities(_o33.slice(_o15, _ou))) === false) return;
if (lt < 0) return;
const c = _o33.charCodeAt(lt + 1);
if (c === 33) {
if (_o33.startsWith('<!--', lt)) { const e = _o33.indexOf('-->', lt + 4); _o15 = e < 0 ? n : e + 3; continue; }
if (_o33.startsWith('<![CDATA[', lt)) {
const e = _o33.indexOf(']]>', lt + 9);
const t = _o33.slice(lt + 9, e < 0 ? n : e);
if (t && h.text && h.text(t) === false) return;
_o15 = e < 0 ? n : e + 3; continue;
}
let _o1d = lt + 2, depth = 0;
for (; _o1d < n; _o1d++) { const _of = _o33.charCodeAt(_o1d); if (_of === 91) depth++; else if (_of === 93) depth--; else if (_of === 62 && depth <= 0) break; }
_o15 = _o1d + 1; continue;
}
if (c === 63) { const e = _o33.indexOf('?>', lt + 2); _o15 = e < 0 ? n : e + 2; continue; }
let _o1d = lt + 1, _o28 = 0;
for (; _o1d < n; _o1d++) { const _of = _o33.charCodeAt(_o1d); if (_o28) { if (_of === _o28) _o28 = 0; } else if (_of === 34 || _of === 39) _o28 = _of; else if (_of === 62) break; }
if (_o1d >= n) return;
let body = _o33.slice(lt + 1, _o1d);
_o15 = _o1d + 1;
if (body.charCodeAt(0) === 47) { if (h.close && h.close(_o1o(body.slice(1).trim())) === false) return; continue; }
let self = false;
if (body.charCodeAt(body.length - 1) === 47) { self = true; body = body.slice(0, -1); }
const m = /^[^\s/>]+/.exec(body);
if (!m) continue;
const name = _o1o(m[0]);
if (h.open && h.open(name, _o20(body, m[0].length), self) === false) return;
if (self && h.close && h.close(name) === false) return;
}
}
function _oz(s) {
if (!s) return '';
if (s.indexOf('_x') >= 0) s = s.replace(/_x([0-9A-Fa-f]{4})_/g, (_, hx) => String.fromCharCode(parseInt(hx, 16)));
return s.replace(/\r\n?/g, '\n').normalize('NFC');
}
function _o25(files) {
const _o1p = new Map();
for (const _o1e of files.keys()) if (!_o1p.has(_o1e.toLowerCase())) _o1p.set(_o1e.toLowerCase(), _o1e);
return (name) => { if (!name) return null; const _o1e = name.replace(/^\/+/, ''); return files.get(_o1e) || files.get(_o1p.get(_o1e.toLowerCase())) || null; };
}
const dirOf = (_o1x) => { const _o1e = _o1x.lastIndexOf('/'); return _o1e < 0 ? '' : _o1x.slice(0, _o1e + 1); };
const _o2h = (_o1x) => dirOf(_o1x) + '_rels/' + _o1x.slice(dirOf(_o1x).length) + '.rels';
function _o2j(_o9, target) {
const t = String(target).replace(/\\/g, '/');
const _o26 = (t.startsWith('/') ? t.slice(1) : _o9 + t).split('/');
const _o1w = [];
for (const s of _o26) { if (!s || s === '.') continue; if (s === '..') _o1w.pop(); else _o1w.push(s); }
return _o1w.join('/');
}
function _o21(_o33, _o9) {
const _o1w = [];
scanXml(_o33, { open(n, a) {
if (n === 'Relationship' && a.Target && a.TargetMode !== 'External') _o1w.push({ id: a.Id, type: a.Type || '', target: _o2j(_o9, a.Target) });
} });
return _o1w;
}
function _o1q(get, _oy) {
const r = _o21(_o34(get('_rels/.rels')), '').find((_o32) => /\/officeDocument$/.test(_o32.type));
return r && get(r.target) ? r.target : _oy;
}
const _o6 = (n) => /\.(xml|rels)$/i.test(n);
const _o1 = {
9: 'percent', 10: 'percent', 14: 'date', 15: 'date', 16: 'date', 17: 'date', 18: 'time', 19: 'time', 20: 'time', 21: 'time', 22: 'datetime',
27: 'date', 28: 'date', 29: 'date', 30: 'date', 31: 'date', 32: 'time', 33: 'time', 34: 'time', 35: 'time', 36: 'date',
45: 'time', 46: 'time', 47: 'time', 50: 'date', 51: 'date', 52: 'date', 53: 'date', 54: 'date', 55: 'date', 56: 'date', 57: 'date', 58: 'date',
};
const _o2 = new Set([19, 21, 45, 46, 47]);
export function classifyNumFmt(id, code) {
if (code == null) {
const kind = _o1[id] || null;
return { kind, secs: _o2.has(id), elapsed: id === 46 };
}
let s = String(code).split(';')[0];
s = s.replace(/"[^"]*"/g, '').replace(/\\./g, '').replace(/[_*]./g, '');
const elapsed = /\[(h+|m+|s+)\]/i.test(s);
s = s.replace(/\[(h+|m+|s+)\]/gi, '$1').replace(/\[[^\]]*\]/g, '').replace(/AM\/PM|A\/P/gi, '').replace(/general/gi, '');
const _o13 = /[dy]/i.test(s), hasT = /[hs]/i.test(s), hasM = /m/i.test(s);
let kind = null;
if (_o13 && hasT) kind = 'datetime';
else if (_o13) kind = 'date';
else if (hasT) kind = 'time';
else if (hasM) kind = 'date';
else if (/%/.test(s)) kind = 'percent';
return { kind, secs: /s/i.test(s), elapsed };
}
function _o24(_o33) {
const _o10 = new Map(), xfs = [];
let _o16 = false, inXfs = false;
scanXml(_o33, {
open(n, a, self) {
if (n === 'numFmts') _o16 = !self;
else if (n === 'numFmt' && _o16) _o10.set(parseInt(a.numFmtId, 10), a.formatCode ?? '');
else if (n === 'cellXfs') inXfs = !self;
else if (n === 'xf' && inXfs) xfs.push(parseInt(a.numFmtId, 10) || 0);
},
close(n) { if (n === 'numFmts') _o16 = false; else if (n === 'cellXfs') { inXfs = false; return false; } },
});
const _oc = new Map();
return xfs.map((id) => { if (!_oc.has(id)) _oc.set(id, classifyNumFmt(id, _o10.has(id) ? _o10.get(id) : undefined)); return _oc.get(id); });
}
function _o22(_o33) {
const _o1w = [];
let _o17 = false, skip = 0, inT = false, _ob = '';
scanXml(_o33, {
open(n) {
if (n === 'si') { _o17 = true; _ob = ''; skip = 0; } else if (!_o17) return;
else if (n === 'rPh') skip++;
else if (n === 't' && !skip) inT = true;
},
close(n) {
if (n === 'si') { if (_o17) _o1w.push(_oz(_ob)); _o17 = false; inT = false; } else if (n === 'rPh') skip = Math.max(0, skip - 1);
else if (n === 't') inT = false;
},
text(t) { if (inT) _ob += t; },
});
return _o1w;
}
const _o1y = (n, w = 2) => String(n).padStart(w, '0');
export function excelSerialToParts(_o32, date1904 = false) {
let _op = Math.floor(_o32), secs = Math.round((_o32 - _op) * 86400);
if (secs >= 86400) { _op++; secs -= 86400; }
const t = { hh: Math.floor(secs / 3600), mi: Math.floor((secs % 3600) / 60), ss: secs % 60 };
if (!date1904 && _op === 60) return { y: 1900, m: 2, d: 29, ...t };
if (!date1904 && _op === 0) return { y: 1900, m: 1, d: 0, ...t };
const _o9 = date1904 ? Date.UTC(1904, 0, 1) : Date.UTC(1899, 11, _op < 60 ? 31 : 30);
const _os = new Date(_o9 + _op * 86400000);
return { y: _os.getUTCFullYear(), m: _os.getUTCMonth() + 1, d: _os.getUTCDate(), ...t };
}
const _oo = (_o1x, style) => (style === 'iso' ? `${_o1y(_o1x.y, 4)}-${_o1y(_o1x.m)}-${_o1y(_o1x.d)}` : `${_o1y(_o1x.d)}/${_o1y(_o1x.m)}/${_o1y(_o1x.y, 4)}`);
const _o2q = (_o1x, secs) => `${_o1y(_o1x.hh)}:${_o1y(_o1x.mi)}` + (secs ? ':' + _o1y(_o1x.ss) : '');
export const numText = (_o32) => String(Number(_o32.toPrecision(15)));
function _o2o(_o32, f, date1904, style) {
if (_o32 < 0 || _o32 > 2958465) return numText(_o32);
if (f.kind === 'time' && f.elapsed) {
const s = Math.round(_o32 * 86400);
return `${Math.floor(s / 3600)}:${_o1y(Math.floor((s % 3600) / 60))}` + (f.secs ? ':' + _o1y(s % 60) : '');
}
const _o1x = excelSerialToParts(_o32, date1904);
if (f.kind === 'time') return _o2q(_o1x, f.secs);
if (f.kind === 'datetime') return _oo(_o1x, style) + ' ' + _o2q(_o1x, f.secs);
return _oo(_o1x, style);
}
function _o1c(v, style) {
const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(v.trim());
if (!m) return v.trim();
const _o1x = { y: +m[1], m: +m[2], d: +m[3], hh: +(m[4] || 0), mi: +(m[5] || 0), ss: +(m[6] || 0) };
return _oo(_o1x, style) + (m[4] && (_o1x.hh || _o1x.mi || _o1x.ss) ? ' ' + _o2q(_o1x, !!_o1x.ss) : '');
}
function _oe(c, _om) {
const v = c.v;
switch (c.t) {
case 's': { const _o1e = parseInt(v, 10); return Number.isFinite(_o1e) ? (_om.sst[_o1e] ?? '') : ''; }
case 'inlineStr': return _oz(c.is || v);
case 'str': return _oz(v);
case 'b': { const s = v.trim(); return s === '' ? '' : s === '1' || s.toLowerCase() === 'true' ? 'TRUE' : 'FALSE'; }
case 'e': return v.trim();
case 'd': return _o1c(v, _om.dates);
default: {
const s = v.trim();
if (s === '') return c.is ? _oz(c.is) : '';
const _o32 = Number(s);
if (!Number.isFinite(_o32)) return s;
const f = _om.styles[c.s];
if (f && (f.kind === 'date' || f.kind === 'time' || f.kind === 'datetime')) return _o2o(_o32, f, _om.date1904, _om.dates);
if (f && f.kind === 'percent') return numText(_o32 * 100) + '%';
return numText(_o32);
}
}
}
function _oi(ref) {
let c = 0, _o15 = 0;
for (; _o15 < ref.length; _o15++) { const _o1e = ref.charCodeAt(_o15) | 32; if (_o1e < 97 || _o1e > 122) break; c = c * 26 + (_o1e - 96); }
const r = parseInt(ref.slice(_o15), 10);
return { c: c - 1, r: Number.isFinite(r) ? r - 1 : -1 };
}
function _o23(_o33, _om) {
const rows = [], merges = [];
let truncated = false, cells = 0, r = -1, col = -1, cell = null, inV = false, inT = false, skip = 0, stopped = false;
const _oj = (src) => scanXml(src, { open(n, a) { if (n === 'mergeCell' && a.ref) merges.push(a.ref); } });
scanXml(_o33, {
open(n, a) {
if (n === 'row') { r = a.r ? parseInt(a.r, 10) - 1 : r + 1; col = -1; }
else if (n === 'c') {
if (a.r) { const _o1x = _oi(a.r); col = _o1x.c >= 0 ? _o1x.c : col + 1; if (_o1x.r >= 0) r = _o1x.r; } else col++;
if (r < 0) r = 0;
cell = { t: a.t || 'n', s: a.s ? parseInt(a.s, 10) || 0 : 0, v: '', is: '', inIs: false };
} else if (!cell) { if (n === 'mergeCell' && a.ref) merges.push(a.ref); }
else if (n === 'v') inV = true;
else if (n === 'is') cell.inIs = true;
else if (n === 'rPh') skip++;
else if (n === 't' && cell.inIs && !skip) inT = true;
},
close(n) {
if (n === 'v') inV = false;
else if (n === 't') inT = false;
else if (n === 'rPh') skip = Math.max(0, skip - 1);
else if (n === 'is') { if (cell) cell.inIs = false; }
else if (n === 'c' && cell) {
const _o2v = _oe(cell, _om);
cell = null; inV = inT = false; skip = 0;
if (_o2v === '') return;
if (cells >= _om.maxCells) { truncated = true; stopped = true; return false; }
if (r >= _om.maxRows || col >= _om.maxCols) { truncated = true; return; }
(rows[r] ||= [])[col] = _o2v;
cells++;
}
},
text(t) { if (!cell) return; if (inV) cell.v += t; else if (inT) cell.is += t; },
});
if (stopped) { const _o1e = _o33.lastIndexOf('sheetData>'); if (_o1e >= 0) _oj(_o33.slice(_o1e)); }
const _oq = new Array(rows.length);
for (let _o15 = 0; _o15 < rows.length; _o15++) _oq[_o15] = rows[_o15] ? Array.from(rows[_o15], (_o32) => _o32 ?? '') : [];
return { rows: _oq, truncated, merges, cells };
}
export async function xlsx(input, opts = {}) {
const files = await unzip(input, { ...opts, filter: _o6 });
const get = _o25(files);
const _o2y = _o1q(get, 'xl/workbook.xml');
const _o2z = _o34(get(_o2y));
if (!/<([\w.-]+:)?workbook[\s>]/.test(_o2z)) _ox('NOT_XLSX', 'File không phải bảng tính Excel (.xlsx) – thiếu workbook.xml.');
const _o2x = dirOf(_o2y);
const _o2g = _o21(_o34(get(_o2h(_o2y))), _o2x);
const byId = new Map(_o2g.map((_o32) => [_o32.id, _o32]));
const _o2f = (suffix, fb) => (_o2g.find((_o32) => _o32.type.endsWith(suffix)) || {}).target || fb;
const list = [];
let date1904 = false;
scanXml(_o2z, { open(n, a) {
if (n === 'workbookPr') date1904 = a.date1904 === '1' || a.date1904 === 'true';
else if (n === 'sheet') list.push({ name: a.name ?? '', rid: a['r:id'] ?? a.id, state: a.state || 'visible' });
} });
const _om = {
sst: _o22(_o34(get(_o2f('/sharedStrings', _o2x + 'sharedStrings.xml')))),
styles: _o24(_o34(get(_o2f('/styles', _o2x + 'styles.xml')))),
date1904, dates: opts.dates === 'iso' ? 'iso' : 'vn',
maxCells: opts.maxCells ?? LIMITS.maxCells, maxRows: opts.maxRows ?? LIMITS.maxRows, maxCols: opts.maxCols ?? LIMITS.maxCols,
};
const sheets = [];
list.forEach((s, _o15) => {
const _o2e = byId.get(s.rid);
if (_o2e && !/\/worksheet$/.test(_o2e.type)) return;
const _o27 = _o2e ? _o2e.target : `${_o2x}worksheets/sheet${_o15 + 1}.xml`;
const _o33 = _o34(get(_o27));
const _o2i = _o33 ? _o23(_o33, _om) : { rows: [], truncated: false, merges: [], cells: 0 };
sheets.push({ name: _oz(s.name), rows: _o2i.rows, truncated: _o2i.truncated, hidden: s.state !== 'visible', merges: _o2i.merges, cells: _o2i.cells });
});
return { sheets, date1904 };
}
const _oh = (s) => _oz(s).trim();
export async function docx(input, opts = {}) {
const files = await unzip(input, { ...opts, filter: _o6 });
const get = _o25(files);
const _o33 = _o34(get(_o1q(get, 'word/document.xml')));
if (!/<([\w.-]+:)?document[\s>]/.test(_o33)) _ox('NOT_DOCX', 'File không phải tài liệu Word (.docx) – thiếu document.xml.');
const paragraphs = [], tables = [], blocks = [], ps = [], ts = [];
let _oy = 0, inT = false, inTabs = 0;
const _o2s = () => ps[ps.length - 1];
const _o2t = () => ts[ts.length - 1];
const add = (s) => { const _o1x = _o2s(); if (_o1x) _o1x.text += s; };
scanXml(_o33, {
open(n, a) {
if (n === 'Fallback') { _oy++; return; }
if (_oy) return;
switch (n) {
case 'p': ps.push({ text: '', style: '' }); break;
case 'pStyle': if (_o2s()) _o2s().style = a.val || ''; break;
case 't': inT = true; break;
case 'tabs': inTabs++; break;
case 'tab': case 'ptab': if (!inTabs) add('\t'); break;
case 'br': case 'cr': add('\n'); break;
case 'noBreakHyphen': add('-'); break;
case 'tbl': ts.push({ rows: [], row: null, cell: null }); break;
case 'tr': if (_o2t()) _o2t().row = []; break;
case 'tc': if (_o2t()) _o2t().cell = { paras: [], span: 1 }; break;
case 'gridSpan': { const t = _o2t(); if (t && t.cell) t.cell.span = Math.max(1, Math.min(64, parseInt(a.val, 10) || 1)); break; }
default:
}
},
close(n) {
if (n === 'Fallback') { _oy = Math.max(0, _oy - 1); return; }
if (_oy) return;
const t = _o2t();
switch (n) {
case 't': inT = false; break;
case 'tabs': inTabs = Math.max(0, inTabs - 1); break;
case 'p': {
const _o1x = ps.pop();
if (!_o1x) break;
const _o2v = _oh(_o1x.text);
if (t && t.cell) t.cell.paras.push(_o2v);
else if (_o2v) { paragraphs.push(_o2v); blocks.push(_o1x.style ? { type: 'p', text: _o2v, style: _o1x.style } : { type: 'p', text: _o2v }); }
break;
}
case 'tc':
if (t && t.cell && t.row) { t.row.push(t.cell.paras.filter(Boolean).join('\n')); for (let _o1e = 1; _o1e < t.cell.span; _o1e++) t.row.push(''); }
if (t) t.cell = null;
break;
case 'tr': if (t && t.row) { t.rows.push(t.row); t.row = null; } break;
case 'tbl': {
const done = ts.pop();
if (!done) break;
const _o1z = _o2t();
if (_o1z && _o1z.cell) _o1z.cell.paras.push(done.rows.map((r) => r.map((c) => c.replace(/\n/g, ' ')).join(' | ')).join('\n'));
else { tables.push(done.rows); blocks.push({ type: 'table', index: tables.length - 1 }); }
break;
}
default:
}
},
text(s) { if (inT && !_oy) add(s); },
});
return { paragraphs, tables, blocks };
}
function _o2p(text, delim, limit) {
const rows = [];
const n = text.length, D = delim.charCodeAt(0);
let row = [], _o15 = 0;
while (_o15 < n) {
let field;
if (text.charCodeAt(_o15) === 34) {
let _o1d = _o15 + 1, _ob = '';
for (;;) {
const _o1e = text.indexOf('"', _o1d);
if (_o1e < 0) { _ob += text.slice(_o1d); _o1d = n; break; }
_ob += text.slice(_o1d, _o1e);
if (text.charCodeAt(_o1e + 1) === 34) { _ob += '"'; _o1d = _o1e + 2; continue; }
_o1d = _o1e + 1; break;
}
let e = _o1d;
while (e < n) { const _of = text.charCodeAt(e); if (_of === D || _of === 10 || _of === 13) break; e++; }
field = _ob + text.slice(_o1d, e);
_o15 = e;
} else {
let e = _o15;
while (e < n) { const _of = text.charCodeAt(e); if (_of === D || _of === 10 || _of === 13) break; e++; }
field = text.slice(_o15, e);
_o15 = e;
}
row.push(field);
if (_o15 >= n) break;
const _of = text.charCodeAt(_o15);
if (_of === D) { _o15++; if (_o15 >= n) row.push(''); continue; }
_o15 += _of === 13 && text.charCodeAt(_o15 + 1) === 10 ? 2 : 1;
rows.push(row); row = [];
if (limit && rows.length >= limit) return rows;
}
if (row.length) rows.push(row);
return rows;
}
export function detectDelimiter(text) {
const _o2m = text.slice(0, 65536);
let _oa = ',', bestTotal = 0;
for (const d of ['\t', ';', ',']) {
const _o2d = _o2p(_o2m, d, 30).filter((r) => r.length > 1 || r[0] !== '');
if (!_o2d.length) continue;
const counts = _o2d.map((r) => r.length - 1);
const _o11 = new Map();
for (const c of counts) if (c > 0) _o11.set(c, (_o11.get(c) || 0) + 1);
let _o1r = 0, modeN = 0;
for (const [c, _o1e] of _o11) if (_o1e > modeN || (_o1e === modeN && c > _o1r)) { _o1r = c; modeN = _o1e; }
if (_o1r > 0 && modeN >= Math.ceil(_o2d.length * 0.8)) return d;
const _o2u = counts.reduce((s, c) => s + c, 0);
if (_o2u > bestTotal) { bestTotal = _o2u; _oa = d; }
}
return _oa;
}
export function csv(input, opts = {}) {
let text = typeof input === 'string' ? input : decodeText(input);
if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
text = text.normalize('NFC');
let delim = opts.delimiter;
const _o14 = /^sep=(.)\r?\n/i.exec(text);
if (_o14) { delim = delim || _o14[1]; text = text.slice(_o14[0].length); }
if (!delim) delim = detectDelimiter(text);
const maxCells = opts.maxCells ?? LIMITS.maxCells;
const _o1w = [];
let cells = 0, truncated = false;
for (const r of _o2p(text, delim, 0)) {
if (r.length === 1 && r[0].trim() === '') continue;
if (cells + r.length > maxCells) { truncated = true; break; }
cells += r.length;
_o1w.push(r);
}
if (truncated) Object.defineProperty(_o1w, 'truncated', { value: true, enumerable: false });
return _o1w;
}
const _od = (s) => String(s ?? '').replace(/\s*[\r\n]+\s*/g, ' / ').replace(/\|/g, '¦').replace(/[ \t\u00A0]+/g, ' ').trim();
function _o2l(rows, opts = {}) {
const maxCols = opts.maxCols ?? 64;
const _og = rows.map((r) => (r || []).slice(0, maxCols).map(_od));
let _o1f = Infinity;
for (const r of _og) { const _o1e = r.findIndex((c) => c !== ''); if (_o1e >= 0 && _o1e < _o1f) _o1f = _o1e; }
if (!Number.isFinite(_o1f)) return [];
const _o1w = [];
_og.forEach((r, _o15) => {
let e = r.length; while (e > 0 && r[e - 1] === '') e--;
if (e <= _o1f) return;
const _o1j = r.slice(_o1f, e).join(' | ');
_o1w.push(opts.rowNumbers ? `${_o15 + 1}: ${_o1j}` : _o1j);
});
return _o1w;
}
const _on = (_o2k, _o1t) => `${_o1t ? '\n' : ''}…[đã cắt bớt ${_o2k} dòng]`;
function _o1i(_o1k, maxLength) {
const max = maxLength ?? 20000;
const _o12 = _o1k.join('\n');
if (_o12.length <= max) return _o12;
let text = '', _o15 = 0;
for (; _o15 < _o1k.length; _o15++) {
const next = (_o15 ? text + '\n' : '') + _o1k[_o15];
const _o1g = _o1k.length - _o15 - 1;
if (next.length + (_o1g ? _on(_o1g, true).length : 0) > max) break;
text = next;
}
const _o2k = _o1k.length - _o15;
if (!text) {
const m = _on(_o2k, true);
return max > m.length ? _o1k[0].slice(0, max - m.length) + m : _on(_o2k, false).slice(0, max);
}
return text + _on(_o2k, true);
}
export function rowsToText(rows, opts = {}) { return _o1i(_o2l(rows || [], opts), opts.maxLength); }
export function sheetsToText(book, opts = {}) {
const _o1k = [];
for (const s of (book && book.sheets) || []) {
if (opts.skipHidden && s.hidden) continue;
const body = _o2l(s.rows, opts);
if (!body.length) continue;
_o1k.push(`### Sheet: ${_od(s.name)}${s.hidden ? ' (ẩn)' : ''}${s.truncated ? ' (đã cắt bớt ô)' : ''}`, ...body);
}
return _o1i(_o1k, opts.maxLength);
}
export function docxToText(doc, opts = {}) {
const _o1k = [];
const blocks = doc.blocks || [...(doc.paragraphs || []).map((text) => ({ type: 'p', text })), ...(doc.tables || []).map((_, index) => ({ type: 'table', index }))];
for (const _o8 of blocks) {
if (_o8.type === 'p') _o1k.push(...String(_o8.text).split('\n').map((_o32) => _o32.replace(/\t+/g, ' ').trim()).filter(Boolean));
else { const body = _o2l(doc.tables[_o8.index] || [], opts); if (body.length) _o1k.push(`[Bảng ${_o8.index + 1}]`, ...body); }
}
return _o1i(_o1k, opts.maxLength);
}
export function toPlainText(parsed, opts = {}) {
if (parsed == null) return '';
if (typeof parsed === 'string') return _o1i(parsed.split(/\r?\n/), opts.maxLength);
if (Array.isArray(parsed)) return rowsToText(parsed, opts);
if (parsed.sheets) return sheetsToText(parsed, opts);
if (parsed.blocks || parsed.paragraphs || parsed.tables) return docxToText(parsed, opts);
return '';
}
export function detectKind(input, name = '') {
const _o2w = _o2r(input);
const _ow = (/\.([a-z0-9]+)$/i.exec(name) || [])[1]?.toLowerCase() || '';
if (_o1a(_o2w)) return _o1v();
if (_o1b(_o2w)) {
const _o1s = new Set(listZip(_o2w).map((e) => e.name.toLowerCase()));
if (_o1s.has('xl/workbook.xml') || /^(xlsx|xlsm|xltx|xltm)$/.test(_ow)) return 'xlsx';
if (_o1s.has('word/document.xml') || /^(docx|docm|dotx|dotm)$/.test(_ow)) return 'docx';
for (const n of _o1s) { if (n.endsWith('workbook.xml')) return 'xlsx'; if (n.endsWith('document.xml')) return 'docx'; }
return _ox('UNSUPPORTED', 'File nén này không phải Excel (.xlsx) hay Word (.docx).');
}
return 'csv';
}
export async function parseFile(input, opts = {}) {
const name = opts.name || (input && input.name) || '';
const _ob = input && typeof input.arrayBuffer === 'function' && !(input instanceof ArrayBuffer) && !ArrayBuffer.isView(input) ? await input.arrayBuffer() : input;
const _o2w = _o2r(_ob);
const kind = detectKind(_o2w, name);
const data = kind === 'xlsx' ? await xlsx(_o2w, opts) : kind === 'docx' ? await docx(_o2w, opts) : csv(_o2w, opts);
return { kind, data, text: toPlainText(data, opts) };
}

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
const _oy = (code, message) => { throw new OoxmlError(code, message); };
const _o5 = typeof process !== 'undefined' && !!(process.versions && process.versions.node);
const _o7 = new TextDecoder('utf-8');
function _o2t(input) {
if (input instanceof Uint8Array) return input;
if (input instanceof ArrayBuffer) return new Uint8Array(input);
if (ArrayBuffer.isView(input)) return new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
if (input && typeof input.byteLength === 'number') return new Uint8Array(input);
return _oy('INPUT', 'Dữ liệu vào không phải ArrayBuffer/Uint8Array.');
}
let _o3 = null;
export function crc32(_o2y) {
if (!_o3) {
_o3 = new Uint32Array(256);
for (let n = 0; n < 256; n++) { let c = n; for (let _o1f = 0; _o1f < 8; _o1f++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; _o3[n] = c >>> 0; }
}
let c = 0xFFFFFFFF;
for (let _o16 = 0; _o16 < _o2y.length; _o16++) c = _o3[(c ^ _o2y[_o16]) & 0xFF] ^ (c >>> 8);
return (c ^ 0xFFFFFFFF) >>> 0;
}
const _o1b = (_o2y) => _o2y.length >= 8 && _o2y[0] === 0xD0 && _o2y[1] === 0xCF && _o2y[2] === 0x11 && _o2y[3] === 0xE0;
const _o1c = (_o2y) => _o2y.length >= 4 && _o2y[0] === 0x50 && _o2y[1] === 0x4B && (_o2y[2] === 3 || _o2y[2] === 5) && (_o2y[3] === 4 || _o2y[3] === 6);
export function safeName(_o2a) {
if (!_o2a || _o2a.includes('\0')) return null;
const s = String(_o2a).replace(/\\/g, '/').replace(/^[a-zA-Z]:/, '');
if (s.endsWith('/')) return null;
const _o27 = [];
for (const _o2p of s.split('/')) {
if (!_o2p || _o2p === '.') continue;
if (_o2p === '..') return null;
_o27.push(_o2p);
}
return _o27.length ? _o27.join('/') : null;
}
const _o1w = () => _oy('OLE', 'File là định dạng Office cũ (.xls/.doc) hoặc đã đặt mật khẩu – hãy mở bằng Excel/Word và "Lưu thành" .xlsx/.docx không mật khẩu.');
function _o2c(_o2y, maxEntries) {
if (_o1b(_o2y)) _o1w();
const dv = new DataView(_o2y.buffer, _o2y.byteOffset, _o2y.byteLength);
if (_o2y.length < 22) _oy('ZIP_INVALID', 'File không phải ZIP/Office hợp lệ (quá ngắn).');
let _ow = -1;
for (let _o16 = _o2y.length - 22, min = Math.max(0, _o2y.length - 22 - 0xFFFF); _o16 >= min; _o16--) {
if (dv.getUint32(_o16, true) === 0x06054b50) { _ow = _o16; break; }
}
if (_ow < 0) _oy('ZIP_INVALID', 'File không phải ZIP/Office hợp lệ (không thấy thư mục trung tâm).');
let _ol = dv.getUint16(_ow + 10, true), cdSize = dv.getUint32(_ow + 12, true), cdOff = dv.getUint32(_ow + 16, true);
if (_ol === 0xFFFF || cdSize === 0xFFFFFFFF || cdOff === 0xFFFFFFFF) {
const _o1o = _ow - 20;
if (_o1o >= 0 && dv.getUint32(_o1o, true) === 0x07064b50) {
const _o37 = Number(dv.getBigUint64(_o1o + 8, true));
if (_o37 + 56 <= _o2y.length && dv.getUint32(_o37, true) === 0x06064b50) {
_ol = Number(dv.getBigUint64(_o37 + 32, true)); cdSize = Number(dv.getBigUint64(_o37 + 40, true)); cdOff = Number(dv.getBigUint64(_o37 + 48, true));
}
}
}
if (_ol > maxEntries) _oy('ZIP_TOO_MANY', `File có ${_ol} mục – vượt giới hạn ${maxEntries} (nghi zip bomb).`);
if (cdOff + cdSize > _o2y.length) _oy('ZIP_INVALID', 'File ZIP bị cắt cụt hoặc hỏng.');
const _o1x = [];
let _o1y = cdOff;
for (let _o16 = 0; _o16 < _ol; _o16++) {
if (_o1y + 46 > _o2y.length || dv.getUint32(_o1y, true) !== 0x02014b50) _oy('ZIP_INVALID', 'Thư mục trung tâm ZIP hỏng.');
const flags = dv.getUint16(_o1y + 8, true), method = dv.getUint16(_o1y + 10, true), crc = dv.getUint32(_o1y + 16, true);
let csize = dv.getUint32(_o1y + 20, true), usize = dv.getUint32(_o1y + 24, true);
const _o1u = dv.getUint16(_o1y + 28, true), el = dv.getUint16(_o1y + 30, true), cl = dv.getUint16(_o1y + 32, true);
let lho = dv.getUint32(_o1y + 42, true);
if (_o1y + 46 + _o1u + el + cl > _o2y.length) _oy('ZIP_INVALID', 'Thư mục trung tâm ZIP hỏng.');
const rawName = _o7.decode(_o2y.subarray(_o1y + 46, _o1y + 46 + _o1u));
for (let _o34 = _o1y + 46 + _o1u, xe = _o34 + el; _o34 + 4 <= xe;) {
const id = dv.getUint16(_o34, true), sz = dv.getUint16(_o34 + 2, true);
if (id === 0x0001) {
let _o29 = _o34 + 4;
const _o2b = () => { const v = _o29 + 8 <= _o34 + 4 + sz ? Number(dv.getBigUint64(_o29, true)) : null; _o29 += 8; return v; };
if (usize === 0xFFFFFFFF) usize = _o2b() ?? usize;
if (csize === 0xFFFFFFFF) csize = _o2b() ?? csize;
if (lho === 0xFFFFFFFF) lho = _o2b() ?? lho;
}
_o34 += 4 + sz;
}
_o1x.push({ rawName, name: safeName(rawName), flags, method, crc, csize, usize, lho });
_o1y += 46 + _o1u + el + cl;
}
return { entries: _o1x, dv };
}
export function listZip(input, opts = {}) {
const { entries } = _o2c(_o2t(input), opts.maxEntries ?? LIMITS.maxEntries);
return entries.filter((e) => e.name).map((e) => ({ name: e.name, size: e.usize, csize: e.csize, method: e.method, encrypted: !!(e.flags & 1) }));
}
let _o38 = null;
const _o1n = () => (_o38 ||= import('node:zlib').catch(() => null));
async function _o1a(_o2a, cap) {
let _os;
try { _os = new DecompressionStream('deflate-raw'); } catch { _oy('NO_INFLATE', 'Trình duyệt quá cũ, không giải nén được (thiếu DecompressionStream "deflate-raw").'); }
const _o33 = _os.writable.getWriter();
_o33.write(_o2a).catch(() => {});
_o33.close().catch(() => {});
const _o2d = _os.readable.getReader();
const chunks = []; let n = 0;
try {
for (;;) {
const { done, value } = await _o2d.read();
if (done) break;
n += value.length;
if (n > cap) { _o2d.cancel().catch(() => {}); _oy('ZIP_SIZE', 'Dữ liệu giải nén lớn hơn kích thước khai báo (nghi zip bomb).'); }
chunks.push(value);
}
} catch (e) {
if (e instanceof OoxmlError) throw e;
_oy('ZIP_CORRUPT', 'Dữ liệu nén trong file bị hỏng.');
}
const _o1x = new Uint8Array(n); let _o1v = 0;
for (const c of chunks) { _o1x.set(c, _o1v); _o1v += c.length; }
return _o1x;
}
async function _o19(_o2a, cap, _o1s) {
const _o32 = _o1s === 'web' || (_o1s !== 'node' && !_o5 && typeof DecompressionStream === 'function');
if (!_o32) {
const _o37 = await _o1n();
if (_o37 && _o37.inflateRawSync) {
try { return new Uint8Array(_o37.inflateRawSync(_o2a, { maxOutputLength: Math.max(1, cap) })); } catch (e) {
if (e && (e.code === 'ERR_BUFFER_TOO_LARGE' || e instanceof RangeError)) _oy('ZIP_SIZE', 'Dữ liệu giải nén lớn hơn kích thước khai báo (nghi zip bomb).');
_oy('ZIP_CORRUPT', 'Dữ liệu nén trong file bị hỏng.');
}
}
if (_o1s === 'node') _oy('NO_INFLATE', 'Không nạp được node:zlib.');
}
if (typeof DecompressionStream !== 'function') _oy('NO_INFLATE', 'Môi trường này không giải nén được deflate.');
return _o1a(_o2a, cap);
}
export async function unzip(input, opts = {}) {
const _o2y = _o2t(input);
const maxTotal = opts.maxTotal ?? LIMITS.maxTotal;
const { entries, dv } = _o2c(_o2y, opts.maxEntries ?? LIMITS.maxEntries);
const filter = typeof opts.filter === 'function' ? opts.filter : null;
const _o2o = new Set(), sel = [];
let _o2w = 0;
for (const e of entries) {
if (!e.name || _o2o.has(e.name) || (filter && !filter(e.name))) continue;
_o2o.add(e.name);
if (e.flags & 1) _oy('ZIP_ENCRYPTED', 'File đã mã hoá/đặt mật khẩu – hãy lưu lại không mật khẩu.');
if (e.method !== 0 && e.method !== 8) _oy('ZIP_METHOD', `Kiểu nén ${e.method} không hỗ trợ (chỉ stored/deflate).`);
_o2w += e.usize;
if (_o2w > maxTotal) _oy('ZIP_TOO_BIG', `Nội dung giải nén vượt ${Math.round(maxTotal / 1048576)} MB (nghi zip bomb).`);
sel.push(e);
}
const _o1x = new Map();
for (const e of sel) {
const _o1i = e.lho;
if (_o1i + 30 > _o2y.length || dv.getUint32(_o1i, true) !== 0x04034b50) _oy('ZIP_INVALID', 'Tiêu đề mục ZIP hỏng.');
const start = _o1i + 30 + dv.getUint16(_o1i + 26, true) + dv.getUint16(_o1i + 28, true);
if (start + e.csize > _o2y.length) _oy('ZIP_INVALID', 'File ZIP bị cắt cụt.');
const _o2a = _o2y.subarray(start, start + e.csize);
let data;
if (e.method === 0) {
if (e.csize !== e.usize) _oy('ZIP_SIZE', 'Kích thước mục không nén không khớp.');
data = _o2a.slice();
} else {
data = await _o19(_o2a, e.usize, opts.inflate);
}
if (data.length !== e.usize) _oy('ZIP_SIZE', 'Kích thước giải nén không khớp khai báo.');
if (crc32(data) !== e.crc) _oy('ZIP_CRC', `Mục "${e.name}" sai CRC – file hỏng.`);
_o1x.set(e.name, data);
}
return _o1x;
}
export function decodeText(input) {
const _o2y = _o2t(input);
if (_o2y[0] === 0xEF && _o2y[1] === 0xBB && _o2y[2] === 0xBF) return _o7.decode(_o2y.subarray(3));
if (_o2y[0] === 0xFF && _o2y[1] === 0xFE) return new TextDecoder('utf-16le').decode(_o2y.subarray(2));
if (_o2y[0] === 0xFE && _o2y[1] === 0xFF) return new TextDecoder('utf-16be').decode(_o2y.subarray(2));
try { return new TextDecoder('utf-8', { fatal: true }).decode(_o2y); } catch { }
for (const _ou of ['windows-1258', 'windows-1252']) {
try { return new TextDecoder(_ou).decode(_o2y); } catch { }
}
return _o7.decode(_o2y);
}
const _o36 = (_o2y) => (_o2y ? decodeText(_o2y) : '');
const _o4 = { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" };
export function decodeEntities(s) {
if (s.indexOf('&') < 0) return s;
return s.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g, (m, e) => {
if (e[0] === '#') {
const _om = e[1] === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
return _om > 0 && _om <= 0x10FFFF && !(_om >= 0xD800 && _om <= 0xDFFF) ? String.fromCodePoint(_om) : m;
}
return Object.prototype.hasOwnProperty.call(_o4, e) ? _o4[e] : m;
});
}
const _o1p = (n) => { const _o1f = n.indexOf(':'); return _o1f < 0 ? n : n.slice(_o1f + 1); };
const _o0 = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
function _o21(body, from) {
const a = {};
_o0.lastIndex = from;
for (let m; (m = _o0.exec(body));) {
const v = decodeEntities(m[2] ?? m[3] ?? '');
a[m[1]] = v;
const _o1m = _o1p(m[1]);
if (_o1m !== m[1] && !(_o1m in a)) a[_o1m] = v;
}
return a;
}
export function scanXml(_o35, h) {
const n = _o35.length;
let _o16 = 0;
while (_o16 < n) {
const lt = _o35.indexOf('<', _o16);
const _ov = lt < 0 ? n : lt;
if (_ov > _o16 && h.text && h.text(decodeEntities(_o35.slice(_o16, _ov))) === false) return;
if (lt < 0) return;
const c = _o35.charCodeAt(lt + 1);
if (c === 33) {
if (_o35.startsWith('<!--', lt)) { const e = _o35.indexOf('-->', lt + 4); _o16 = e < 0 ? n : e + 3; continue; }
if (_o35.startsWith('<![CDATA[', lt)) {
const e = _o35.indexOf(']]>', lt + 9);
const t = _o35.slice(lt + 9, e < 0 ? n : e);
if (t && h.text && h.text(t) === false) return;
_o16 = e < 0 ? n : e + 3; continue;
}
let _o1e = lt + 2, depth = 0;
for (; _o1e < n; _o1e++) { const _og = _o35.charCodeAt(_o1e); if (_og === 91) depth++; else if (_og === 93) depth--; else if (_og === 62 && depth <= 0) break; }
_o16 = _o1e + 1; continue;
}
if (c === 63) { const e = _o35.indexOf('?>', lt + 2); _o16 = e < 0 ? n : e + 2; continue; }
let _o1e = lt + 1, _o29 = 0;
for (; _o1e < n; _o1e++) { const _og = _o35.charCodeAt(_o1e); if (_o29) { if (_og === _o29) _o29 = 0; } else if (_og === 34 || _og === 39) _o29 = _og; else if (_og === 62) break; }
if (_o1e >= n) return;
let body = _o35.slice(lt + 1, _o1e);
_o16 = _o1e + 1;
if (body.charCodeAt(0) === 47) { if (h.close && h.close(_o1p(body.slice(1).trim())) === false) return; continue; }
let self = false;
if (body.charCodeAt(body.length - 1) === 47) { self = true; body = body.slice(0, -1); }
const m = /^[^\s/>]+/.exec(body);
if (!m) continue;
const name = _o1p(m[0]);
if (h.open && h.open(name, _o21(body, m[0].length), self) === false) return;
if (self && h.close && h.close(name) === false) return;
}
}
function _o10(s) {
if (!s) return '';
if (s.indexOf('_x') >= 0) s = s.replace(/_x([0-9A-Fa-f]{4})_/g, (_, hx) => String.fromCharCode(parseInt(hx, 16)));
return s.replace(/\r\n?/g, '\n').normalize('NFC');
}
function _o26(files) {
const _o1q = new Map();
for (const _o1f of files.keys()) if (!_o1q.has(_o1f.toLowerCase())) _o1q.set(_o1f.toLowerCase(), _o1f);
return (name) => { if (!name) return null; const _o1f = name.replace(/^\/+/, ''); return files.get(_o1f) || files.get(_o1q.get(_o1f.toLowerCase())) || null; };
}
const dirOf = (_o1y) => { const _o1f = _o1y.lastIndexOf('/'); return _o1f < 0 ? '' : _o1y.slice(0, _o1f + 1); };
const _o2i = (_o1y) => dirOf(_o1y) + '_rels/' + _o1y.slice(dirOf(_o1y).length) + '.rels';
function _o2k(_o9, target) {
const t = String(target).replace(/\\/g, '/');
const _o27 = (t.startsWith('/') ? t.slice(1) : _o9 + t).split('/');
const _o1x = [];
for (const s of _o27) { if (!s || s === '.') continue; if (s === '..') _o1x.pop(); else _o1x.push(s); }
return _o1x.join('/');
}
function _o22(_o35, _o9) {
const _o1x = [];
scanXml(_o35, { open(n, a) {
if (n === 'Relationship' && a.Target && a.TargetMode !== 'External') _o1x.push({ id: a.Id, type: a.Type || '', target: _o2k(_o9, a.Target) });
} });
return _o1x;
}
function _o1r(get, _oz) {
const r = _o22(_o36(get('_rels/.rels')), '').find((_o34) => /\/officeDocument$/.test(_o34.type));
return r && get(r.target) ? r.target : _oz;
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
const _o14 = /[dy]/i.test(s), hasT = /[hs]/i.test(s), hasM = /m/i.test(s);
let kind = null;
if (_o14 && hasT) kind = 'datetime';
else if (_o14) kind = 'date';
else if (hasT) kind = 'time';
else if (hasM) kind = 'date';
else if (/%/.test(s)) kind = 'percent';
return { kind, secs: /s/i.test(s), elapsed };
}
function _o25(_o35) {
const _o11 = new Map(), xfs = [];
let _o17 = false, inXfs = false;
scanXml(_o35, {
open(n, a, self) {
if (n === 'numFmts') _o17 = !self;
else if (n === 'numFmt' && _o17) _o11.set(parseInt(a.numFmtId, 10), a.formatCode ?? '');
else if (n === 'cellXfs') inXfs = !self;
else if (n === 'xf' && inXfs) xfs.push(parseInt(a.numFmtId, 10) || 0);
},
close(n) { if (n === 'numFmts') _o17 = false; else if (n === 'cellXfs') { inXfs = false; return false; } },
});
const _od = new Map();
return xfs.map((id) => { if (!_od.has(id)) _od.set(id, classifyNumFmt(id, _o11.has(id) ? _o11.get(id) : undefined)); return _od.get(id); });
}
function _o23(_o35) {
const _o1x = [];
let _o18 = false, skip = 0, inT = false, _ob = '';
scanXml(_o35, {
open(n) {
if (n === 'si') { _o18 = true; _ob = ''; skip = 0; } else if (!_o18) return;
else if (n === 'rPh') skip++;
else if (n === 't' && !skip) inT = true;
},
close(n) {
if (n === 'si') { if (_o18) _o1x.push(_o10(_ob)); _o18 = false; inT = false; } else if (n === 'rPh') skip = Math.max(0, skip - 1);
else if (n === 't') inT = false;
},
text(t) { if (inT) _ob += t; },
});
return _o1x;
}
const _o1z = (n, w = 2) => String(n).padStart(w, '0');
export function excelSerialToParts(_o34, date1904 = false) {
let _oq = Math.floor(_o34), secs = Math.round((_o34 - _oq) * 86400);
if (secs >= 86400) { _oq++; secs -= 86400; }
const t = { hh: Math.floor(secs / 3600), mi: Math.floor((secs % 3600) / 60), ss: secs % 60 };
if (!date1904 && _oq === 60) return { y: 1900, m: 2, d: 29, ...t };
if (!date1904 && _oq === 0) return { y: 1900, m: 1, d: 0, ...t };
const _o9 = date1904 ? Date.UTC(1904, 0, 1) : Date.UTC(1899, 11, _oq < 60 ? 31 : 30);
const _ot = new Date(_o9 + _oq * 86400000);
return { y: _ot.getUTCFullYear(), m: _ot.getUTCMonth() + 1, d: _ot.getUTCDate(), ...t };
}
const _op = (_o1y, style) => (style === 'iso' ? `${_o1z(_o1y.y, 4)}-${_o1z(_o1y.m)}-${_o1z(_o1y.d)}` : `${_o1z(_o1y.d)}/${_o1z(_o1y.m)}/${_o1z(_o1y.y, 4)}`);
const _o2s = (_o1y, secs) => `${_o1z(_o1y.hh)}:${_o1z(_o1y.mi)}` + (secs ? ':' + _o1z(_o1y.ss) : '');
export const numText = (_o34) => String(Number(_o34.toPrecision(15)));
function _o2q(_o34, f, date1904, style) {
if (_o34 < 0 || _o34 > 2958465) return numText(_o34);
if (f.kind === 'time' && f.elapsed) {
const s = Math.round(_o34 * 86400);
return `${Math.floor(s / 3600)}:${_o1z(Math.floor((s % 3600) / 60))}` + (f.secs ? ':' + _o1z(s % 60) : '');
}
const _o1y = excelSerialToParts(_o34, date1904);
if (f.kind === 'time') return _o2s(_o1y, f.secs);
if (f.kind === 'datetime') return _op(_o1y, style) + ' ' + _o2s(_o1y, f.secs);
return _op(_o1y, style);
}
function _o1d(v, style) {
const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(v.trim());
if (!m) return v.trim();
const _o1y = { y: +m[1], m: +m[2], d: +m[3], hh: +(m[4] || 0), mi: +(m[5] || 0), ss: +(m[6] || 0) };
return _op(_o1y, style) + (m[4] && (_o1y.hh || _o1y.mi || _o1y.ss) ? ' ' + _o2s(_o1y, !!_o1y.ss) : '');
}
function _of(c, _on) {
const v = c.v;
switch (c.t) {
case 's': { const _o1f = parseInt(v, 10); return Number.isFinite(_o1f) ? (_on.sst[_o1f] ?? '') : ''; }
case 'inlineStr': return _o10(c.is || v);
case 'str': return _o10(v);
case 'b': { const s = v.trim(); return s === '' ? '' : s === '1' || s.toLowerCase() === 'true' ? 'TRUE' : 'FALSE'; }
case 'e': return v.trim();
case 'd': return _o1d(v, _on.dates);
default: {
const s = v.trim();
if (s === '') return c.is ? _o10(c.is) : '';
const _o34 = Number(s);
if (!Number.isFinite(_o34)) return s;
const f = _on.styles[c.s];
if (f && (f.kind === 'date' || f.kind === 'time' || f.kind === 'datetime')) return _o2q(_o34, f, _on.date1904, _on.dates);
if (f && f.kind === 'percent') return numText(_o34 * 100) + '%';
return numText(_o34);
}
}
}
function _oj(ref) {
let c = 0, _o16 = 0;
for (; _o16 < ref.length; _o16++) { const _o1f = ref.charCodeAt(_o16) | 32; if (_o1f < 97 || _o1f > 122) break; c = c * 26 + (_o1f - 96); }
const r = parseInt(ref.slice(_o16), 10);
return { c: c - 1, r: Number.isFinite(r) ? r - 1 : -1 };
}
function _o24(_o35, _on) {
const rows = [], merges = [];
let truncated = false, cells = 0, r = -1, col = -1, cell = null, inV = false, inT = false, skip = 0, stopped = false;
const _ok = (src) => scanXml(src, { open(n, a) { if (n === 'mergeCell' && a.ref) merges.push(a.ref); } });
scanXml(_o35, {
open(n, a) {
if (n === 'row') { r = a.r ? parseInt(a.r, 10) - 1 : r + 1; col = -1; }
else if (n === 'c') {
if (a.r) { const _o1y = _oj(a.r); col = _o1y.c >= 0 ? _o1y.c : col + 1; if (_o1y.r >= 0) r = _o1y.r; } else col++;
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
const _o2x = _of(cell, _on);
cell = null; inV = inT = false; skip = 0;
if (_o2x === '') return;
if (cells >= _on.maxCells) { truncated = true; stopped = true; return false; }
if (r >= _on.maxRows || col >= _on.maxCols) { truncated = true; return; }
(rows[r] ||= [])[col] = _o2x;
cells++;
}
},
text(t) { if (!cell) return; if (inV) cell.v += t; else if (inT) cell.is += t; },
});
if (stopped) { const _o1f = _o35.lastIndexOf('sheetData>'); if (_o1f >= 0) _ok(_o35.slice(_o1f)); }
const _or = new Array(rows.length);
for (let _o16 = 0; _o16 < rows.length; _o16++) _or[_o16] = rows[_o16] ? Array.from(rows[_o16], (_o34) => _o34 ?? '') : [];
return { rows: _or, truncated, merges, cells };
}
export async function xlsx(input, opts = {}) {
const files = await unzip(input, { ...opts, filter: _o6 });
const get = _o26(files);
const _o30 = _o1r(get, 'xl/workbook.xml');
const _o31 = _o36(get(_o30));
if (!/<([\w.-]+:)?workbook[\s>]/.test(_o31)) _oy('NOT_XLSX', 'File không phải bảng tính Excel (.xlsx) – thiếu workbook.xml.');
const _o2z = dirOf(_o30);
const _o2h = _o22(_o36(get(_o2i(_o30))), _o2z);
const _oc = new Map(_o2h.map((_o34) => [_o34.id, _o34]));
const _o2g = (suffix, fb) => (_o2h.find((_o34) => _o34.type.endsWith(suffix)) || {}).target || fb;
const list = [];
let date1904 = false;
scanXml(_o31, { open(n, a) {
if (n === 'workbookPr') date1904 = a.date1904 === '1' || a.date1904 === 'true';
else if (n === 'sheet') list.push({ name: a.name ?? '', rid: a['r:id'] ?? a.id, state: a.state || 'visible' });
} });
const _on = {
sst: _o23(_o36(get(_o2g('/sharedStrings', _o2z + 'sharedStrings.xml')))),
styles: _o25(_o36(get(_o2g('/styles', _o2z + 'styles.xml')))),
date1904, dates: opts.dates === 'iso' ? 'iso' : 'vn',
maxCells: opts.maxCells ?? LIMITS.maxCells, maxRows: opts.maxRows ?? LIMITS.maxRows, maxCols: opts.maxCols ?? LIMITS.maxCols,
};
const sheets = [];
list.forEach((s, _o16) => {
const _o2f = _oc.get(s.rid);
if (_o2f && !/\/worksheet$/.test(_o2f.type)) return;
const _o28 = _o2f ? _o2f.target : `${_o2z}worksheets/sheet${_o16 + 1}.xml`;
const _o35 = _o36(get(_o28));
const _o2j = _o35 ? _o24(_o35, _on) : { rows: [], truncated: false, merges: [], cells: 0 };
sheets.push({ name: _o10(s.name), rows: _o2j.rows, truncated: _o2j.truncated, hidden: s.state !== 'visible', merges: _o2j.merges, cells: _o2j.cells });
});
return { sheets, date1904 };
}
const _oi = (s) => _o10(s).trim();
export async function docx(input, opts = {}) {
const files = await unzip(input, { ...opts, filter: _o6 });
const get = _o26(files);
const _o35 = _o36(get(_o1r(get, 'word/document.xml')));
if (!/<([\w.-]+:)?document[\s>]/.test(_o35)) _oy('NOT_DOCX', 'File không phải tài liệu Word (.docx) – thiếu document.xml.');
const paragraphs = [], tables = [], blocks = [], ps = [], ts = [];
let _oz = 0, inT = false, inTabs = 0;
const _o2u = () => ps[ps.length - 1];
const _o2v = () => ts[ts.length - 1];
const add = (s) => { const _o1y = _o2u(); if (_o1y) _o1y.text += s; };
scanXml(_o35, {
open(n, a) {
if (n === 'Fallback') { _oz++; return; }
if (_oz) return;
switch (n) {
case 'p': ps.push({ text: '', style: '' }); break;
case 'pStyle': if (_o2u()) _o2u().style = a.val || ''; break;
case 't': inT = true; break;
case 'tabs': inTabs++; break;
case 'tab': case 'ptab': if (!inTabs) add('\t'); break;
case 'br': case 'cr': add('\n'); break;
case 'noBreakHyphen': add('-'); break;
case 'tbl': ts.push({ rows: [], row: null, cell: null }); break;
case 'tr': if (_o2v()) _o2v().row = []; break;
case 'tc': if (_o2v()) _o2v().cell = { paras: [], span: 1 }; break;
case 'gridSpan': { const t = _o2v(); if (t && t.cell) t.cell.span = Math.max(1, Math.min(64, parseInt(a.val, 10) || 1)); break; }
default:
}
},
close(n) {
if (n === 'Fallback') { _oz = Math.max(0, _oz - 1); return; }
if (_oz) return;
const t = _o2v();
switch (n) {
case 't': inT = false; break;
case 'tabs': inTabs = Math.max(0, inTabs - 1); break;
case 'p': {
const _o1y = ps.pop();
if (!_o1y) break;
const _o2x = _oi(_o1y.text);
if (t && t.cell) t.cell.paras.push(_o2x);
else if (_o2x) { paragraphs.push(_o2x); blocks.push(_o1y.style ? { type: 'p', text: _o2x, style: _o1y.style } : { type: 'p', text: _o2x }); }
break;
}
case 'tc':
if (t && t.cell && t.row) { t.row.push(t.cell.paras.filter(Boolean).join('\n')); for (let _o1f = 1; _o1f < t.cell.span; _o1f++) t.row.push(''); }
if (t) t.cell = null;
break;
case 'tr': if (t && t.row) { t.rows.push(t.row); t.row = null; } break;
case 'tbl': {
const done = ts.pop();
if (!done) break;
const _o20 = _o2v();
if (_o20 && _o20.cell) _o20.cell.paras.push(done.rows.map((r) => r.map((c) => c.replace(/\n/g, ' ')).join(' | ')).join('\n'));
else { tables.push(done.rows); blocks.push({ type: 'table', index: tables.length - 1 }); }
break;
}
default:
}
},
text(s) { if (inT && !_oz) add(s); },
});
return { paragraphs, tables, blocks };
}
function _o2r(text, delim, limit) {
const rows = [];
const n = text.length, D = delim.charCodeAt(0);
let row = [], _o16 = 0;
while (_o16 < n) {
let field;
if (text.charCodeAt(_o16) === 34) {
let _o1e = _o16 + 1, _ob = '';
for (;;) {
const _o1f = text.indexOf('"', _o1e);
if (_o1f < 0) { _ob += text.slice(_o1e); _o1e = n; break; }
_ob += text.slice(_o1e, _o1f);
if (text.charCodeAt(_o1f + 1) === 34) { _ob += '"'; _o1e = _o1f + 2; continue; }
_o1e = _o1f + 1; break;
}
let e = _o1e;
while (e < n) { const _og = text.charCodeAt(e); if (_og === D || _og === 10 || _og === 13) break; e++; }
field = _ob + text.slice(_o1e, e);
_o16 = e;
} else {
let e = _o16;
while (e < n) { const _og = text.charCodeAt(e); if (_og === D || _og === 10 || _og === 13) break; e++; }
field = text.slice(_o16, e);
_o16 = e;
}
row.push(field);
if (_o16 >= n) break;
const _og = text.charCodeAt(_o16);
if (_og === D) { _o16++; if (_o16 >= n) row.push(''); continue; }
_o16 += _og === 13 && text.charCodeAt(_o16 + 1) === 10 ? 2 : 1;
rows.push(row); row = [];
if (limit && rows.length >= limit) return rows;
}
if (row.length) rows.push(row);
return rows;
}
export function detectDelimiter(text) {
const _o2n = text.slice(0, 65536);
let _oa = ',', bestTotal = 0;
for (const d of ['\t', ';', ',']) {
const _o2e = _o2r(_o2n, d, 30).filter((r) => r.length > 1 || r[0] !== '');
if (!_o2e.length) continue;
const counts = _o2e.map((r) => r.length - 1);
const _o12 = new Map();
for (const c of counts) if (c > 0) _o12.set(c, (_o12.get(c) || 0) + 1);
let _o1s = 0, modeN = 0;
for (const [c, _o1f] of _o12) if (_o1f > modeN || (_o1f === modeN && c > _o1s)) { _o1s = c; modeN = _o1f; }
if (_o1s > 0 && modeN >= Math.ceil(_o2e.length * 0.8)) return d;
const _o2w = counts.reduce((s, c) => s + c, 0);
if (_o2w > bestTotal) { bestTotal = _o2w; _oa = d; }
}
return _oa;
}
export function csv(input, opts = {}) {
let text = typeof input === 'string' ? input : decodeText(input);
if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
text = text.normalize('NFC');
let delim = opts.delimiter;
const _o15 = /^sep=(.)\r?\n/i.exec(text);
if (_o15) { delim = delim || _o15[1]; text = text.slice(_o15[0].length); }
if (!delim) delim = detectDelimiter(text);
const maxCells = opts.maxCells ?? LIMITS.maxCells;
const _o1x = [];
let cells = 0, truncated = false;
for (const r of _o2r(text, delim, 0)) {
if (r.length === 1 && r[0].trim() === '') continue;
if (cells + r.length > maxCells) { truncated = true; break; }
cells += r.length;
_o1x.push(r);
}
if (truncated) Object.defineProperty(_o1x, 'truncated', { value: true, enumerable: false });
return _o1x;
}
const _oe = (s) => String(s ?? '').replace(/\s*[\r\n]+\s*/g, ' / ').replace(/\|/g, '¦').replace(/[ \t\u00A0]+/g, ' ').trim();
function _o2m(rows, opts = {}) {
const maxCols = opts.maxCols ?? 64;
const _oh = rows.map((r) => (r || []).slice(0, maxCols).map(_oe));
let _o1g = Infinity;
for (const r of _oh) { const _o1f = r.findIndex((c) => c !== ''); if (_o1f >= 0 && _o1f < _o1g) _o1g = _o1f; }
if (!Number.isFinite(_o1g)) return [];
const _o1x = [];
_oh.forEach((r, _o16) => {
let e = r.length; while (e > 0 && r[e - 1] === '') e--;
if (e <= _o1g) return;
const _o1k = r.slice(_o1g, e).join(' | ');
_o1x.push(opts.rowNumbers ? `${_o16 + 1}: ${_o1k}` : _o1k);
});
return _o1x;
}
const _oo = (_o2l, _o1u) => `${_o1u ? '\n' : ''}…[đã cắt bớt ${_o2l} dòng]`;
function _o1j(_o1l, maxLength) {
const max = maxLength ?? 20000;
const _o13 = _o1l.join('\n');
if (_o13.length <= max) return _o13;
let text = '', _o16 = 0;
for (; _o16 < _o1l.length; _o16++) {
const next = (_o16 ? text + '\n' : '') + _o1l[_o16];
const _o1h = _o1l.length - _o16 - 1;
if (next.length + (_o1h ? _oo(_o1h, true).length : 0) > max) break;
text = next;
}
const _o2l = _o1l.length - _o16;
if (!text) {
const m = _oo(_o2l, true);
return max > m.length ? _o1l[0].slice(0, max - m.length) + m : _oo(_o2l, false).slice(0, max);
}
return text + _oo(_o2l, true);
}
export function rowsToText(rows, opts = {}) { return _o1j(_o2m(rows || [], opts), opts.maxLength); }
export function sheetsToText(book, opts = {}) {
const _o1l = [];
for (const s of (book && book.sheets) || []) {
if (opts.skipHidden && s.hidden) continue;
const body = _o2m(s.rows, opts);
if (!body.length) continue;
_o1l.push(`### Sheet: ${_oe(s.name)}${s.hidden ? ' (ẩn)' : ''}${s.truncated ? ' (đã cắt bớt ô)' : ''}`, ...body);
}
return _o1j(_o1l, opts.maxLength);
}
export function docxToText(doc, opts = {}) {
const _o1l = [];
const blocks = doc.blocks || [...(doc.paragraphs || []).map((text) => ({ type: 'p', text })), ...(doc.tables || []).map((_, index) => ({ type: 'table', index }))];
for (const _o8 of blocks) {
if (_o8.type === 'p') _o1l.push(...String(_o8.text).split('\n').map((_o34) => _o34.replace(/\t+/g, ' ').trim()).filter(Boolean));
else { const body = _o2m(doc.tables[_o8.index] || [], opts); if (body.length) _o1l.push(`[Bảng ${_o8.index + 1}]`, ...body); }
}
return _o1j(_o1l, opts.maxLength);
}
export function toPlainText(parsed, opts = {}) {
if (parsed == null) return '';
if (typeof parsed === 'string') return _o1j(parsed.split(/\r?\n/), opts.maxLength);
if (Array.isArray(parsed)) return rowsToText(parsed, opts);
if (parsed.sheets) return sheetsToText(parsed, opts);
if (parsed.blocks || parsed.paragraphs || parsed.tables) return docxToText(parsed, opts);
return '';
}
export function detectKind(input, name = '') {
const _o2y = _o2t(input);
const _ox = (/\.([a-z0-9]+)$/i.exec(name) || [])[1]?.toLowerCase() || '';
if (_o1b(_o2y)) return _o1w();
if (_o1c(_o2y)) {
const _o1t = new Set(listZip(_o2y).map((e) => e.name.toLowerCase()));
if (_o1t.has('xl/workbook.xml') || /^(xlsx|xlsm|xltx|xltm)$/.test(_ox)) return 'xlsx';
if (_o1t.has('word/document.xml') || /^(docx|docm|dotx|dotm)$/.test(_ox)) return 'docx';
for (const n of _o1t) { if (n.endsWith('workbook.xml')) return 'xlsx'; if (n.endsWith('document.xml')) return 'docx'; }
return _oy('UNSUPPORTED', 'File nén này không phải Excel (.xlsx) hay Word (.docx).');
}
return 'csv';
}
export async function parseFile(input, opts = {}) {
const name = opts.name || (input && input.name) || '';
const _ob = input && typeof input.arrayBuffer === 'function' && !(input instanceof ArrayBuffer) && !ArrayBuffer.isView(input) ? await input.arrayBuffer() : input;
const _o2y = _o2t(_ob);
const kind = detectKind(_o2y, name);
const data = kind === 'xlsx' ? await xlsx(_o2y, opts) : kind === 'docx' ? await docx(_o2y, opts) : csv(_o2y, opts);
return { kind, data, text: toPlainText(data, opts) };
}

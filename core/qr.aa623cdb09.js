const _o2 = { L: { i: 0, bits: 1 }, M: { i: 1, bits: 0 }, Q: { i: 2, bits: 3 }, H: { i: 3, bits: 2 } };
const _o1 = [
[-1, 7, 10, 15, 20, 26, 18, 20, 24, 30, 18, 20, 24, 26, 30, 22, 24, 28, 30, 28, 28, 28, 28, 30, 30, 26, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
[-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28],
[-1, 13, 22, 18, 26, 18, 24, 18, 22, 20, 24, 28, 26, 24, 20, 30, 24, 28, 28, 26, 30, 28, 30, 30, 30, 30, 28, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30],
[-1, 17, 28, 22, 16, 22, 28, 26, 26, 24, 28, 24, 28, 22, 24, 24, 30, 28, 28, 26, 28, 30, 24, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
];
const _o5 = [
[-1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 4, 4, 4, 4, 4, 6, 6, 6, 6, 7, 8, 8, 9, 9, 10, 12, 12, 12, 13, 14, 15, 16, 17, 18, 19, 19, 20, 21, 22, 24, 25],
[-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49],
[-1, 1, 1, 2, 2, 4, 4, 6, 6, 8, 8, 8, 10, 12, 16, 12, 17, 16, 18, 21, 20, 23, 23, 25, 27, 29, 34, 34, 35, 38, 40, 43, 45, 48, 51, 53, 56, 59, 62, 65, 68],
[-1, 1, 1, 2, 4, 4, 4, 5, 6, 8, 8, 11, 11, 16, 16, 18, 16, 19, 21, 25, 25, 25, 34, 30, 32, 35, 37, 40, 42, 45, 48, 51, 54, 57, 60, 63, 66, 70, 74, 77, 81]
];
function _o1a(_o1m) {
let _o19 = (16 * _o1m + 128) * _o1m + 64;
if (_o1m >= 2) { const _oz = Math.floor(_o1m / 7) + 2; _o19 -= (25 * _oz - 10) * _oz - 55; if (_o1m >= 7) _o19 -= 36; }
return _o19;
}
function _ok(_o1m, e) { return Math.floor(_o1a(_o1m) / 8) - _o1[e][_o1m] * _o5[e][_o1m]; }
function _os(_o1n, y) { let _o1o = 0; for (let i = 7; i >= 0; i--) { _o1o = (_o1o << 1) ^ ((_o1o >>> 7) * 0x11d); _o1o ^= ((y >>> i) & 1) * _o1n; } return _o1o & 255; }
function _o1d(degree) {
const _o19 = new Array(degree).fill(0); _o19[degree - 1] = 1;
let _o1c = 1;
for (let i = 0; i < degree; i++) {
for (let _ot = 0; _ot < _o19.length; _ot++) { _o19[_ot] = _os(_o19[_ot], _o1c); if (_ot + 1 < _o19.length) _o19[_ot] ^= _o19[_ot + 1]; }
_o1c = _os(_o1c, 2);
}
return _o19;
}
function _o1e(_oj, div) {
const _o19 = new Array(div.length).fill(0);
for (const _o9 of _oj) { const _op = _o9 ^ _o19.shift(); _o19.push(0); div.forEach((c, i) => { _o19[i] ^= _os(c, _op); }); }
return _o19;
}
function _o1l(_o1g) { return Array.from(new TextEncoder().encode(String(_o1g))); }
function _o7(_o1m, size) {
if (_o1m === 1) return [];
const _oz = Math.floor(_o1m / 7) + 2;
const _o1h = _o1m === 32 ? 26 : Math.ceil((_o1m * 4 + 4) / (_oz * 2 - 2)) * 2;
const _o12 = [6];
for (let _o16 = size - 7; _o12.length < _oz; _o16 -= _o1h) _o12.splice(1, 0, _o16);
return _o12;
}
export function qrMatrix(text, { ecl = 'M', mask, minVersion = 1 } = {}) {
const _o0 = _o2[ecl] || _o2.M, e = _o0.i;
const _oe = _o1l(text);
let _o1m = Math.max(1, Math.min(40, minVersion | 0)), cap;
for (; _o1m <= 40; _o1m++) {
cap = _ok(_o1m, e) * 8;
const _o1k = 4 + (_o1m <= 9 ? 8 : 16) + _oe.length * 8;
if (_o1k <= cap) break;
}
if (_o1m > 40) throw new Error('Nội dung quá dài cho mã QR');
const bits = [];
const _o17 = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
_o17(4, 4); _o17(_oe.length, _o1m <= 9 ? 8 : 16);
for (const _o9 of _oe) _o17(_o9, 8);
_o17(0, Math.min(4, cap - bits.length));
_o17(0, (8 - (bits.length % 8)) % 8);
for (let _o14 = 0xec; bits.length < cap; _o14 ^= 0xec ^ 0x11) _o17(_o14, 8);
const _oj = [];
for (let i = 0; i < bits.length; i += 8) { let v = 0; for (let _ot = 0; _ot < 8; _ot++) v = (v << 1) | bits[i + _ot]; _oj.push(v); }
const _o11 = _o5[e][_o1m], eccLen = _o1[e][_o1m], raw = Math.floor(_o1a(_o1m) / 8);
const _o10 = _o11 - (raw % _o11), shortLen = Math.floor(raw / _o11), div = _o1d(eccLen);
const _od = [];
for (let i = 0, _ou = 0; i < _o11; i++) {
const _oi = _oj.slice(_ou, _ou + shortLen - eccLen + (i < _o10 ? 0 : 1));
_ou += _oi.length;
const _oo = _o1e(_oi, div);
if (i < _o10) _oi.push(0);
_od.push(_oi.concat(_oo));
}
const _of = [];
for (let i = 0; i < _od[0].length; i++) for (let _ot = 0; _ot < _od.length; _ot++) if (i !== shortLen - eccLen || _ot >= _o10) _of.push(_od[_ot][i]);
const size = _o1m * 4 + 17;
const _oy = Array.from({ length: size }, () => new Array(size).fill(false));
const _or = Array.from({ length: size }, () => new Array(size).fill(false));
const set = (_o1n, y, _oh) => { _oy[y][_o1n] = _oh; _or[y][_o1n] = true; };
for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
const _oq = (cx, cy) => {
for (let _on = -4; _on <= 4; _on++) for (let _om = -4; _om <= 4; _om++) {
const _og = Math.max(Math.abs(_om), Math.abs(_on)), _o1n = cx + _om, y = cy + _on;
if (_o1n >= 0 && _o1n < size && y >= 0 && y < size) set(_o1n, y, _og !== 2 && _og !== 4);
}
};
_oq(3, 3); _oq(size - 4, 3); _oq(3, size - 4);
const _o6 = _o7(_o1m, size);
for (let i = 0; i < _o6.length; i++) for (let _ot = 0; _ot < _o6.length; _ot++) {
if ((i === 0 && _ot === 0) || (i === 0 && _ot === _o6.length - 1) || (i === _o6.length - 1 && _ot === 0)) continue;
for (let _on = -2; _on <= 2; _on++) for (let _om = -2; _om <= 2; _om++) set(_o6[i] + _om, _o6[_ot] + _on, Math.max(Math.abs(_om), Math.abs(_on)) !== 1);
}
const _ol = (_ox) => {
const _og = (_o0.bits << 3) | _ox;
let _o19 = _og;
for (let i = 0; i < 10; i++) _o19 = (_o19 << 1) ^ ((_o19 >>> 9) * 0x537);
const _o9 = ((_og << 10) | _o19) ^ 0x5412, bit = (i) => ((_o9 >>> i) & 1) === 1;
for (let i = 0; i <= 5; i++) set(8, i, bit(i));
set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
set(8, size - 8, true);
};
_ol(0);
if (_o1m >= 7) {
let _o19 = _o1m;
for (let i = 0; i < 12; i++) _o19 = (_o19 << 1) ^ ((_o19 >>> 11) * 0x1f25);
const _o9 = (_o1m << 12) | _o19;
for (let i = 0; i < 18; i++) { const _oh = ((_o9 >>> i) & 1) === 1, a = size - 11 + (i % 3), c = Math.floor(i / 3); set(a, c, _oh); set(c, a, _oh); }
}
let _ou = 0;
for (let _o1b = size - 1; _o1b >= 1; _o1b -= 2) {
if (_o1b === 6) _o1b = 5;
for (let v = 0; v < size; v++) for (let _ot = 0; _ot < 2; _ot++) {
const _o1n = _o1b - _ot, up = ((_o1b + 1) & 2) === 0, y = up ? size - 1 - v : v;
if (!_or[y][_o1n] && _ou < _of.length * 8) { _oy[y][_o1n] = ((_of[_ou >>> 3] >>> (7 - (_ou & 7))) & 1) === 1; _ou++; }
}
}
const _o3 = [
(_o1n, y) => (_o1n + y) % 2 === 0, (_o1n, y) => y % 2 === 0, (_o1n) => _o1n % 3 === 0, (_o1n, y) => (_o1n + y) % 3 === 0,
(_o1n, y) => (Math.floor(_o1n / 3) + Math.floor(y / 2)) % 2 === 0, (_o1n, y) => ((_o1n * y) % 2) + ((_o1n * y) % 3) === 0,
(_o1n, y) => (((_o1n * y) % 2) + ((_o1n * y) % 3)) % 2 === 0, (_o1n, y) => (((_o1n + y) % 2) + ((_o1n * y) % 3)) % 2 === 0
];
const _o8 = (_ox) => { for (let y = 0; y < size; y++) for (let _o1n = 0; _o1n < size; _o1n++) if (!_or[y][_o1n] && _o3[_ox](_o1n, y)) _oy[y][_o1n] = !_oy[y][_o1n]; };
let _oa = mask;
if (_oa === undefined || _oa === null || _oa < 0 || _oa > 7) {
let _ob = Infinity;
for (let _ox = 0; _ox < 8; _ox++) {
_o8(_ox); _ol(_ox);
const _o1g = _o15(_oy, size);
if (_o1g < _ob) { _ob = _o1g; _oa = _ox; }
_o8(_ox);
}
}
_o8(_oa); _ol(_oa);
return { size, version: _o1m, mask: _oa, modules: _oy };
}
function _o15(_ox, size) {
let _o1g = 0;
const _ow = (get) => {
for (let a = 0; a < size; a++) {
let _o1f = 1;
for (let _o9 = 1; _o9 <= size; _o9++) {
if (_o9 < size && get(a, _o9) === get(a, _o9 - 1)) _o1f++;
else { if (_o1f >= 5) _o1g += 3 + (_o1f - 5); _o1f = 1; }
}
for (let _o9 = 0; _o9 + 7 <= size; _o9++) {
const _o13 = [1, 0, 1, 1, 1, 0, 1].every((v, i) => get(a, _o9 + i) === !!v);
if (!_o13) continue;
const _ov = (from, to) => { for (let i = from; i < to; i++) if (i >= 0 && i < size && get(a, i)) return false; return true; };
if (_ov(_o9 - 4, _o9) || _ov(_o9 + 7, _o9 + 11)) _o1g += 40;
}
}
};
_ow((y, _o1n) => _ox[y][_o1n]);
_ow((_o1n, y) => _ox[y][_o1n]);
let _oh = 0;
for (let y = 0; y < size; y++) for (let _o1n = 0; _o1n < size; _o1n++) {
if (_ox[y][_o1n]) _oh++;
if (_o1n < size - 1 && y < size - 1 && _ox[y][_o1n] === _ox[y][_o1n + 1] && _ox[y][_o1n] === _ox[y + 1][_o1n] && _ox[y][_o1n] === _ox[y + 1][_o1n + 1]) _o1g += 3;
}
const _o1j = size * size;
_o1g += Math.floor(Math.abs(_oh * 20 - _o1j * 10) / _o1j) * 10;
return _o1g;
}
export function qrSvg(text, { scale = 4, border = 4, ecl = 'M', title = 'Mã QR' } = {}) {
const _o18 = qrMatrix(text, { ecl });
const _oz = _o18.size + border * 2;
let _og = '';
for (let y = 0; y < _o18.size; y++) for (let _o1n = 0; _o1n < _o18.size; _o1n++) if (_o18.modules[y][_o1n]) _og += `M${_o1n + border},${y + border}h1v1h-1z`;
const esc = (_o1g) => String(_o1g).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${_oz} ${_oz}" width="${_oz * scale}" height="${_oz * scale}" shape-rendering="crispEdges" role="img" aria-label="${esc(title)}">` +
`<rect width="${_oz}" height="${_oz}" fill="#fff"/><path d="${_og}" fill="#000"/></svg>`;
}
export function qrElement(text, { scale = 4, border = 4, ecl = 'M', title = 'Mã QR' } = {}) {
const _o4 = 'http://www.w3.org/2000/svg';
const _o18 = qrMatrix(text, { ecl });
const _oz = _o18.size + border * 2;
const _o1i = document.createElementNS(_o4, 'svg');
_o1i.setAttribute('viewBox', `0 0 ${_oz} ${_oz}`);
_o1i.setAttribute('width', String(_oz * scale)); _o1i.setAttribute('height', String(_oz * scale));
_o1i.setAttribute('shape-rendering', 'crispEdges'); _o1i.setAttribute('role', 'img'); _o1i.setAttribute('aria-label', title);
const _oc = document.createElementNS(_o4, 'rect');
_oc.setAttribute('width', String(_oz)); _oc.setAttribute('height', String(_oz)); _oc.setAttribute('fill', '#fff');
let _og = '';
for (let y = 0; y < _o18.size; y++) for (let _o1n = 0; _o1n < _o18.size; _o1n++) if (_o18.modules[y][_o1n]) _og += `M${_o1n + border},${y + border}h1v1h-1z`;
const _o13 = document.createElementNS(_o4, 'path');
_o13.setAttribute('d', _og); _o13.setAttribute('fill', '#000');
_o1i.append(_oc, _o13);
return _o1i;
}
export default { qrMatrix, qrSvg, qrElement };

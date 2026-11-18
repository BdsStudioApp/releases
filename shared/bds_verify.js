var BDSVerify = (function () {
'use strict';
var PUBKEY = 'MCowBQYDK2VwAyEA08ZyQbCvDOkxv4iLixzoX+GsCugVDUIEqkmpfOeFKto=';
var _o1p = function(h, l) { this.hi = h|0 >>> 0; this.lo = l|0 >>> 0; };
var _or = function(init) {
var i, r = new Float64Array(16);
if (init) for (i = 0; i < init.length; i++) r[i] = init[i];
return r;
};
var gf0 = _or(),
gf1 = _or([1]),
D = _or([0x78a3, 0x1359, 0x4dca, 0x75eb, 0xd8ab, 0x4141, 0x0a4d, 0x0070, 0xe898, 0x7779, 0x4079, 0x8cc7, 0xfe73, 0x2b6f, 0x6cee, 0x5203]),
D2 = _or([0xf159, 0x26b2, 0x9b94, 0xebd6, 0xb156, 0x8283, 0x149a, 0x00e0, 0xd130, 0xeef3, 0x80f2, 0x198e, 0xfce7, 0x56df, 0xd9dc, 0x2406]),
X = _or([0xd51a, 0x8f25, 0x2d60, 0xc956, 0xa7b2, 0x9525, 0xc760, 0x692c, 0xdc5c, 0xfdd6, 0xe231, 0xc0a4, 0x53fe, 0xcd6e, 0x36d3, 0x2169]),
Y = _or([0x6658, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666, 0x6666]),
I = _or([0xa0b0, 0x4a0e, 0x1b27, 0xc4ee, 0xe478, 0xad2f, 0x1806, 0x2f43, 0xd7a7, 0x3dfb, 0x0099, 0x2b4d, 0xdf0b, 0x4fc1, 0x2480, 0x2b83]);
function _op(x, i) {
var h = (x[i] << 24) | (x[i+1] << 16) | (x[i+2] << 8) | x[i+3];
var l = (x[i+4] << 24) | (x[i+5] << 16) | (x[i+6] << 8) | x[i+7];
return new _o1p(h, l);
}
function _o1n(x, i, u) {
x[i] = (u.hi >> 24) & 0xff;
x[i+1] = (u.hi >> 16) & 0xff;
x[i+2] = (u.hi >> 8) & 0xff;
x[i+3] = u.hi & 0xff;
x[i+4] = (u.lo >> 24) & 0xff;
x[i+5] = (u.lo >> 16) & 0xff;
x[i+6] = (u.lo >> 8) & 0xff;
x[i+7] = u.lo & 0xff;
}
function vn(x, xi, y, yi, n) {
var i,d = 0;
for (i = 0; i < n; i++) d |= x[xi+i]^y[yi+i];
return (1 & ((d - 1) >>> 8)) - 1;
}
function _on(x, xi, y, yi) {
return vn(x,xi,y,yi,32);
}
function _o1g(r, a) {
var i;
for (i = 0; i < 16; i++) r[i] = a[i]|0;
}
function _oh(o) {
var c;
var i;
for (i = 0; i < 16; i++) {
o[i] += 65536;
c = Math.floor(o[i] / 65536);
o[(i+1)*(i<15?1:0)] += c - 1 + 37 * (c-1) * (i===15?1:0);
o[i] -= (c * 65536);
}
}
function _o1f(_o11, q, b) {
var t, c = ~(b-1);
for (var i = 0; i < 16; i++) {
t = c & (_o11[i] ^ q[i]);
_o11[i] ^= t;
q[i] ^= t;
}
}
function _o13(o, n) {
var i, j, b;
var m = _or(), t = _or();
for (i = 0; i < 16; i++) t[i] = n[i];
_oh(t);
_oh(t);
_oh(t);
for (j = 0; j < 2; j++) {
m[0] = t[0] - 0xffed;
for (i = 1; i < 15; i++) {
m[i] = t[i] - 0xffff - ((m[i-1]>>16) & 1);
m[i-1] &= 0xffff;
}
m[15] = t[15] - 0x7fff - ((m[14]>>16) & 1);
b = (m[15]>>16) & 1;
m[14] &= 0xffff;
_o1f(t, m, 1-b);
}
for (i = 0; i < 16; i++) {
o[2*i] = t[i] & 0xff;
o[2*i+1] = t[i]>>8;
}
}
function _oy(a, b) {
var c = new Uint8Array(32), d = new Uint8Array(32);
_o13(c, a);
_o13(d, b);
return _on(c, 0, d, 0);
}
function _o15(a) {
var d = new Uint8Array(32);
_o13(d, a);
return d[0] & 1;
}
function _o1q(o, n) {
var i;
for (i = 0; i < 16; i++) o[i] = n[2*i] + (n[2*i+1] << 8);
o[15] &= 0x7fff;
}
function A(o, a, b) {
var i;
for (i = 0; i < 16; i++) o[i] = (a[i] + b[i])|0;
}
function _o9(o, a, b) {
var i;
for (i = 0; i < 16; i++) o[i] = (a[i] - b[i])|0;
}
function M(o, a, b) {
var i, j, t = new Float64Array(31);
for (i = 0; i < 31; i++) t[i] = 0;
for (i = 0; i < 16; i++) {
for (j = 0; j < 16; j++) {
t[i+j] += a[i] * b[j];
}
}
for (i = 0; i < 15; i++) {
t[i] += 38 * t[i+16];
}
for (i = 0; i < 16; i++) o[i] = t[i];
_oh(o);
_oh(o);
}
function S(o, a) {
M(o, a, a);
}
function _ot(o, i) {
var c = _or();
var a;
for (a = 0; a < 16; a++) c[a] = i[a];
for (a = 253; a >= 0; a--) {
S(c, c);
if(a !== 2 && a !== 4) M(c, c, i);
}
for (a = 0; a < 16; a++) o[a] = c[a];
}
function _o17(o, i) {
var c = _or();
var a;
for (a = 0; a < 16; a++) c[a] = i[a];
for (a = 250; a >= 0; a--) {
S(c, c);
if(a !== 1) M(c, c, i);
}
for (a = 0; a < 16; a++) o[a] = c[a];
}
function _ob() {
var a = 0, b = 0, c = 0, d = 0, m16 = 65535, l, h, i;
for (i = 0; i < arguments.length; i++) {
l = arguments[i].lo;
h = arguments[i].hi;
a += (l & m16); b += (l >>> 16);
c += (h & m16); d += (h >>> 16);
}
b += (a >>> 16);
c += (b >>> 16);
d += (c >>> 16);
return new _o1p((c & m16) | (d << 16), (a & m16) | (b << 16));
}
function _o1h(x, c) {
return new _o1p((x.hi >>> c), (x.lo >>> c) | (x.hi << (32 - c)));
}
function _o1u() {
var l = 0, h = 0, i;
for (i = 0; i < arguments.length; i++) {
l ^= arguments[i].lo;
h ^= arguments[i].hi;
}
return new _o1p(h, l);
}
function R(x, c) {
var h, l, c1 = 32 - c;
if (c < 32) {
h = (x.hi >>> c) | (x.lo << c1);
l = (x.lo >>> c) | (x.hi << c1);
} else if (c < 64) {
h = (x.lo >>> c) | (x.hi << c1);
l = (x.hi >>> c) | (x.lo << c1);
}
return new _o1p(h, l);
}
function Ch(x, y, _o1v) {
var h = (x.hi & y.hi) ^ (~x.hi & _o1v.hi),
l = (x.lo & y.lo) ^ (~x.lo & _o1v.lo);
return new _o1p(h, l);
}
function _o3(x, y, _o1v) {
var h = (x.hi & y.hi) ^ (x.hi & _o1v.hi) ^ (y.hi & _o1v.hi),
l = (x.lo & y.lo) ^ (x.lo & _o1v.lo) ^ (y.lo & _o1v.lo);
return new _o1p(h, l);
}
function _o7(x) { return _o1u(R(x,28), R(x,34), R(x,39)); }
function _o8(x) { return _o1u(R(x,14), R(x,18), R(x,41)); }
function _o1i(x) { return _o1u(R(x, 1), R(x, 8), _o1h(x,7)); }
function _o1j(x) { return _o1u(R(x,19), R(x,61), _o1h(x,6)); }
var _o1 = [
new _o1p(0x428a2f98, 0xd728ae22), new _o1p(0x71374491, 0x23ef65cd),
new _o1p(0xb5c0fbcf, 0xec4d3b2f), new _o1p(0xe9b5dba5, 0x8189dbbc),
new _o1p(0x3956c25b, 0xf348b538), new _o1p(0x59f111f1, 0xb605d019),
new _o1p(0x923f82a4, 0xaf194f9b), new _o1p(0xab1c5ed5, 0xda6d8118),
new _o1p(0xd807aa98, 0xa3030242), new _o1p(0x12835b01, 0x45706fbe),
new _o1p(0x243185be, 0x4ee4b28c), new _o1p(0x550c7dc3, 0xd5ffb4e2),
new _o1p(0x72be5d74, 0xf27b896f), new _o1p(0x80deb1fe, 0x3b1696b1),
new _o1p(0x9bdc06a7, 0x25c71235), new _o1p(0xc19bf174, 0xcf692694),
new _o1p(0xe49b69c1, 0x9ef14ad2), new _o1p(0xefbe4786, 0x384f25e3),
new _o1p(0x0fc19dc6, 0x8b8cd5b5), new _o1p(0x240ca1cc, 0x77ac9c65),
new _o1p(0x2de92c6f, 0x592b0275), new _o1p(0x4a7484aa, 0x6ea6e483),
new _o1p(0x5cb0a9dc, 0xbd41fbd4), new _o1p(0x76f988da, 0x831153b5),
new _o1p(0x983e5152, 0xee66dfab), new _o1p(0xa831c66d, 0x2db43210),
new _o1p(0xb00327c8, 0x98fb213f), new _o1p(0xbf597fc7, 0xbeef0ee4),
new _o1p(0xc6e00bf3, 0x3da88fc2), new _o1p(0xd5a79147, 0x930aa725),
new _o1p(0x06ca6351, 0xe003826f), new _o1p(0x14292967, 0x0a0e6e70),
new _o1p(0x27b70a85, 0x46d22ffc), new _o1p(0x2e1b2138, 0x5c26c926),
new _o1p(0x4d2c6dfc, 0x5ac42aed), new _o1p(0x53380d13, 0x9d95b3df),
new _o1p(0x650a7354, 0x8baf63de), new _o1p(0x766a0abb, 0x3c77b2a8),
new _o1p(0x81c2c92e, 0x47edaee6), new _o1p(0x92722c85, 0x1482353b),
new _o1p(0xa2bfe8a1, 0x4cf10364), new _o1p(0xa81a664b, 0xbc423001),
new _o1p(0xc24b8b70, 0xd0f89791), new _o1p(0xc76c51a3, 0x0654be30),
new _o1p(0xd192e819, 0xd6ef5218), new _o1p(0xd6990624, 0x5565a910),
new _o1p(0xf40e3585, 0x5771202a), new _o1p(0x106aa070, 0x32bbd1b8),
new _o1p(0x19a4c116, 0xb8d2d0c8), new _o1p(0x1e376c08, 0x5141ab53),
new _o1p(0x2748774c, 0xdf8eeb99), new _o1p(0x34b0bcb5, 0xe19b48a8),
new _o1p(0x391c0cb3, 0xc5c95a63), new _o1p(0x4ed8aa4a, 0xe3418acb),
new _o1p(0x5b9cca4f, 0x7763e373), new _o1p(0x682e6ff3, 0xd6b2b8a3),
new _o1p(0x748f82ee, 0x5defb2fc), new _o1p(0x78a5636f, 0x43172f60),
new _o1p(0x84c87814, 0xa1f0ab72), new _o1p(0x8cc70208, 0x1a6439ec),
new _o1p(0x90befffa, 0x23631e28), new _o1p(0xa4506ceb, 0xde82bde9),
new _o1p(0xbef9a3f7, 0xb2c67915), new _o1p(0xc67178f2, 0xe372532b),
new _o1p(0xca273ece, 0xea26619c), new _o1p(0xd186b8c7, 0x21c0c207),
new _o1p(0xeada7dd6, 0xcde0eb1e), new _o1p(0xf57d4f7f, 0xee6ed178),
new _o1p(0x06f067aa, 0x72176fba), new _o1p(0x0a637dc5, 0xa2c898a6),
new _o1p(0x113f9804, 0xbef90dae), new _o1p(0x1b710b35, 0x131c471b),
new _o1p(0x28db77f5, 0x23047d84), new _o1p(0x32caab7b, 0x40c72493),
new _o1p(0x3c9ebe0a, 0x15c9bebc), new _o1p(0x431d67c4, 0x9c100d4c),
new _o1p(0x4cc5d4be, 0xcb3e42b6), new _o1p(0x597f299c, 0xfc657e2a),
new _o1p(0x5fcb6fab, 0x3ad6faec), new _o1p(0x6c44198c, 0x4a475817)
];
function _ol(x, m, n) {
var _o1v = [], b = [], a = [], _o1t = [], t, i, j;
for (i = 0; i < 8; i++) _o1v[i] = a[i] = _op(x, 8*i);
var _o16 = 0;
while (n >= 128) {
for (i = 0; i < 16; i++) _o1t[i] = _op(m, 8*i+_o16);
for (i = 0; i < 80; i++) {
for (j = 0; j < 8; j++) b[j] = a[j];
t = _ob(a[7], _o8(a[4]), Ch(a[4], a[5], a[6]), _o1[i], _o1t[i%16]);
b[7] = _ob(t, _o7(a[0]), _o3(a[0], a[1], a[2]));
b[3] = _ob(b[3], t);
for (j = 0; j < 8; j++) a[(j+1)%8] = b[j];
if (i%16 === 15) {
for (j = 0; j < 16; j++) {
_o1t[j] = _ob(_o1t[j], _o1t[(j+9)%16], _o1i(_o1t[(j+1)%16]), _o1j(_o1t[(j+14)%16]));
}
}
}
for (i = 0; i < 8; i++) {
a[i] = _ob(a[i], _o1v[i]);
_o1v[i] = a[i];
}
_o16 += 128;
n -= 128;
}
for (i = 0; i < 8; i++) _o1n(x, 8*i, _o1v[i]);
return n;
}
var _ou = new Uint8Array([
0x6a,0x09,0xe6,0x67,0xf3,0xbc,0xc9,0x08,
0xbb,0x67,0xae,0x85,0x84,0xca,0xa7,0x3b,
0x3c,0x6e,0xf3,0x72,0xfe,0x94,0xf8,0x2b,
0xa5,0x4f,0xf5,0x3a,0x5f,0x1d,0x36,0xf1,
0x51,0x0e,0x52,0x7f,0xad,0xe6,0x82,0xd1,
0x9b,0x05,0x68,0x8c,0x2b,0x3e,0x6c,0x1f,
0x1f,0x83,0xd9,0xab,0xfb,0x41,0xbd,0x6b,
0x5b,0xe0,0xcd,0x19,0x13,0x7e,0x21,0x79
]);
function _ok(_o10, m, n) {
var h = new Uint8Array(64), x = new Uint8Array(256);
var i, b = n;
for (i = 0; i < 64; i++) h[i] = _ou[i];
_ol(h, m, n);
n %= 128;
for (i = 0; i < 256; i++) x[i] = 0;
for (i = 0; i < n; i++) x[i] = m[b-n+i];
x[n] = 128;
n = 256-128*(n<112?1:0);
x[n-9] = 0;
_o1n(x, n-8, new _o1p((b / 0x20000000) | 0, b << 3));
_ol(h, x, n);
for (i = 0; i < 64; i++) _o10[i] = h[i];
return 0;
}
function _oa(_o11, q) {
var a = _or(), b = _or(), c = _or(),
d = _or(), e = _or(), f = _or(),
g = _or(), h = _or(), t = _or();
_o9(a, _o11[1], _o11[0]);
_o9(t, q[1], q[0]);
M(a, a, t);
A(b, _o11[0], _o11[1]);
A(t, q[0], q[1]);
M(b, b, t);
M(c, _o11[3], q[3]);
M(c, c, D2);
M(d, _o11[2], q[2]);
A(d, d, d);
_o9(e, b, a);
_o9(f, d, c);
A(g, d, c);
A(h, b, a);
M(_o11[0], e, f);
M(_o11[1], h, g);
M(_o11[2], g, f);
M(_o11[3], e, h);
}
function _oo(_o11, q, b) {
var i;
for (i = 0; i < 4; i++) {
_o1f(_o11[i], q[i], b);
}
}
function _o12(r, _o11) {
var _o1o = _or(), ty = _or(), zi = _or();
_ot(zi, _o11[2]);
M(_o1o, _o11[0], zi);
M(ty, _o11[1], zi);
_o13(r, ty);
r[31] ^= _o15(_o1o) << 7;
}
function _o1e(_o11, q, s) {
var b, i;
_o1g(_o11[0], gf0);
_o1g(_o11[1], gf1);
_o1g(_o11[2], gf1);
_o1g(_o11[3], gf0);
for (i = 255; i >= 0; --i) {
b = (s[(i/8)|0] >> (i&7)) & 1;
_oo(_o11, q, b);
_oa(q, _o11);
_oa(_o11, _o11);
_oo(_o11, q, b);
}
}
function _o1d(_o11, s) {
var q = [_or(), _or(), _or(), _or()];
_o1g(q[0], X);
_o1g(q[1], Y);
_o1g(q[2], gf1);
M(q[3], X, Y);
_o1e(_o11, q, s);
}
var L = new Float64Array([0xed, 0xd3, 0xf5, 0x5c, 0x1a, 0x63, 0x12, 0x58, 0xd6, 0x9c, 0xf7, 0xa2, 0xde, 0xf9, 0xde, 0x14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x10]);
function _ox(r, x) {
var _oi, i, j, _ov;
for (i = 63; i >= 32; --i) {
_oi = 0;
for (j = i - 32, _ov = i - 12; j < _ov; ++j) {
x[j] += _oi - 16 * x[i] * L[j - (i - 32)];
_oi = Math.floor((x[j] + 128) / 256);
x[j] -= _oi * 256;
}
x[j] += _oi;
x[i] = 0;
}
_oi = 0;
for (j = 0; j < 32; j++) {
x[j] += _oi - (x[31] >> 4) * L[j];
_oi = x[j] >> 8;
x[j] &= 255;
}
for (j = 0; j < 32; j++) x[j] -= _oi * L[j];
for (i = 0; i < 32; i++) {
x[i+1] += x[i] >> 8;
r[i] = x[i] & 255;
}
}
function _o19(r) {
var x = new Float64Array(64), i;
for (i = 0; i < 64; i++) x[i] = r[i];
for (i = 0; i < 64; i++) r[i] = 0;
_ox(r, x);
}
function _o1r(r, _o11) {
var t = _or(), chk = _or(), num = _or(),
den = _or(), den2 = _or(), den4 = _or(),
den6 = _or();
_o1g(r[2], gf1);
_o1q(r[1], _o11);
S(num, r[1]);
M(den, num, D);
_o9(num, num, r[2]);
A(den, r[2], den);
S(den2, den);
S(den4, den2);
M(den6, den4, den2);
M(t, den6, num);
M(t, t, den);
_o17(t, t);
M(t, t, num);
M(t, t, den);
M(t, t, den);
M(r[0], t, den);
S(chk, r[0]);
M(chk, chk, den);
if (_oy(chk, num)) M(r[0], r[0], I);
S(chk, r[0]);
M(chk, chk, den);
if (_oy(chk, num)) return -1;
if (_o15(r[0]) === (_o11[31]>>7)) _o9(r[0], gf0, r[0]);
M(r[3], r[0], r[1]);
return 0;
}
function _om(m, sm, n, pk) {
var i;
var t = new Uint8Array(32), h = new Uint8Array(64);
var _o11 = [_or(), _or(), _or(), _or()],
q = [_or(), _or(), _or(), _or()];
if (n < 64) return -1;
if (_o1r(q, pk)) return -1;
for (i = 0; i < n; i++) m[i] = sm[i];
for (i = 0; i < 32; i++) m[i+32] = pk[i];
_ok(h, m, n);
_o19(h);
_o1e(_o11, q, h);
_o1d(q, sm.subarray(32));
_oa(_o11, q);
_o12(t, _o11);
n -= 64;
if (_on(sm, 0, t, 0)) {
for (i = 0; i < n; i++) m[i] = 0;
return -1;
}
for (i = 0; i < n; i++) m[i] = sm[i + 64];
return n;
}
function _o1c(s) {
for (var i = 31; i >= 0; i--) {
if (s[i] < L[i]) return true;
if (s[i] > L[i]) return false;
}
return false;
}
function utf8(str) {
str = String(str);
var _o10 = [];
for (var i = 0; i < str.length; i++) {
var c = str.charCodeAt(i);
if (c >= 0xd800 && c <= 0xdbff && i + 1 < str.length) {
var _og = str.charCodeAt(i + 1);
if (_og >= 0xdc00 && _og <= 0xdfff) { c = 0x10000 + ((c - 0xd800) << 10) + (_og - 0xdc00); i++; }
}
if (c >= 0xd800 && c <= 0xdfff) c = 0xfffd;
if (c < 0x80) _o10.push(c);
else if (c < 0x800) _o10.push(0xc0 | (c >> 6), 0x80 | (c & 63));
else if (c < 0x10000) _o10.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
else _o10.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
}
return new Uint8Array(_o10);
}
function _o1m(x) {
if (typeof x === 'string') return utf8(x);
if (x instanceof Uint8Array) return x;
var _o10 = new Uint8Array(x.length);
for (var i = 0; i < x.length; i++) _o10[i] = x[i] & 255;
return _o10;
}
var _o0 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function b64decode(s) {
s = String(s || '').replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/').replace(/=+$/, '');
if (/[^A-Za-z0-9+/]/.test(s) || s.length % 4 === 1) throw new Error('base64 không hợp lệ');
var _o10 = [], bits = 0, acc = 0;
for (var i = 0; i < s.length; i++) {
acc = ((acc << 6) | _o0.indexOf(s.charAt(i))) & 0xffffff; bits += 6;
if (bits >= 8) { bits -= 8; _o10.push((acc >> bits) & 255); }
}
return new Uint8Array(_o10);
}
var _o6 = [0x30, 0x2a, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x70, 0x03, 0x21, 0x00];
function _o18(pubKeyB64) {
var _ov = b64decode(pubKeyB64 || PUBKEY);
if (_ov.length === 32) return _ov;
if (_ov.length !== 44) throw new Error('khoá công khai không đúng độ dài');
for (var i = 0; i < _o6.length; i++) if (_ov[i] !== _o6[i]) throw new Error('khoá công khai không phải ed25519');
return _ov.subarray(12);
}
function _o1s(msg, sig, pk) {
if (sig.length !== 64 || pk.length !== 32) return false;
if (!_o1c(sig.subarray(32))) return false;
var sm = new Uint8Array(64 + msg.length), m = new Uint8Array(64 + msg.length), i;
for (i = 0; i < 64; i++) sm[i] = sig[i];
for (i = 0; i < msg.length; i++) sm[i + 64] = msg[i];
return _om(m, sm, sm.length, pk) >= 0;
}
function verify(manifestText, sigB64, pubKeyB64) {
try {
if (typeof manifestText !== 'string' || !sigB64) return false;
return _o1s(utf8(manifestText), b64decode(String(sigB64).trim()), _o18(pubKeyB64));
} catch (e) { return false; }
}
var _o2 = [
0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
];
function sha256Hex(data) {
var _of = _o1m(data), n = _of.length;
var _o14 = Math.ceil((n + 9) / 64) * 64;
var _oe = new Uint8Array(_o14);
_oe.set(_of); _oe[n] = 0x80;
var _od = Math.floor(n / 0x20000000), bitsLo = (n * 8) >>> 0;
_oe[_o14 - 8] = (_od >>> 24) & 255; _oe[_o14 - 7] = (_od >>> 16) & 255; _oe[_o14 - 6] = (_od >>> 8) & 255; _oe[_o14 - 5] = _od & 255;
_oe[_o14 - 4] = (bitsLo >>> 24) & 255; _oe[_o14 - 3] = (bitsLo >>> 16) & 255; _oe[_o14 - 2] = (bitsLo >>> 8) & 255; _oe[_o14 - 1] = bitsLo & 255;
var h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
var _o1t = new Array(64), i, j;
for (var _oz = 0; _oz < _o14; _oz += 64) {
for (i = 0; i < 16; i++) { j = _oz + 4 * i; _o1t[i] = (_oe[j] << 24) | (_oe[j + 1] << 16) | (_oe[j + 2] << 8) | _oe[j + 3]; }
for (i = 16; i < 64; i++) {
var x = _o1t[i - 15], y = _o1t[i - 2];
var _o1a = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
var _o1b = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
_o1t[i] = (_o1t[i - 16] + _o1a + _o1t[i - 7] + _o1b) | 0;
}
var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
for (i = 0; i < 64; i++) {
var _o5 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
var _oj = (e & f) ^ (~e & g);
var _o1k = (hh + _o5 + _oj + _o2[i] + _o1t[i]) | 0;
var _o4 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
var _ow = (a & b) ^ (a & c) ^ (b & c);
var _o1l = (_o4 + _ow) | 0;
hh = g; g = f; f = e; e = (d + _o1k) | 0; d = c; c = b; b = a; a = (_o1k + _o1l) | 0;
}
h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0;
h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
}
var _os = '';
for (i = 0; i < 8; i++) _os += ('00000000' + (h[i] >>> 0).toString(16)).slice(-8);
return _os;
}
function keyId(pubKeyB64) {
try { return sha256Hex(b64decode(pubKeyB64 || PUBKEY)).slice(0, 16); } catch (e) { return ''; }
}
function fileEntry(manifest, path) {
var list = manifest && Array.isArray(manifest.files) ? manifest.files : [];
for (var i = 0; i < list.length; i++) if (list[i] && list[i].path === path) return list[i];
return null;
}
function checkRelease(manifestText, sigB64, opts) {
opts = opts || {};
var _oc = function (code, error) { return { ok: false, code: code, error: error }; };
if (!sigB64 || !String(sigB64).trim()) return _oc('NO_SIG', 'Bản phát hành chưa có chữ ký số.');
if (!verify(manifestText, sigB64, opts.pubKey)) return _oc('BAD_SIG', 'Chữ ký số của bản phát hành không đúng – không cài.');
var manifest;
try { manifest = JSON.parse(manifestText); } catch (e) { return _oc('BAD_MANIFEST', 'Danh sách tệp phát hành (release.json) bị hỏng.'); }
if (!manifest || typeof manifest !== 'object' || !Array.isArray(manifest.files) || !manifest.parts) return _oc('BAD_MANIFEST', 'Danh sách tệp phát hành (release.json) thiếu thông tin.');
if (opts.channel && manifest.channel !== opts.channel) return _oc('WRONG_CHANNEL', 'Bản phát hành không thuộc kênh của app này – không cài.');
var files = opts.files || {};
for (var _o11 in files) {
if (!Object.prototype.hasOwnProperty.call(files, _o11)) continue;
var _oq = fileEntry(manifest, _o11);
if (!_oq) return _oc('NOT_IN_MANIFEST', 'Tệp ' + _o11 + ' không có trong bản phát hành đã ký.');
var _of = _o1m(files[_o11]);
if (typeof _oq.size === 'number' && _oq.size !== _of.length) return _oc('SIZE_MISMATCH', 'Tệp ' + _o11 + ' khác kích thước bản đã ký – không cài.');
if (String(_oq.sha256 || '').toLowerCase() !== sha256Hex(_of)) return _oc('SHA_MISMATCH', 'Tệp ' + _o11 + ' không khớp mã sha256 của bản đã ký – không cài.');
}
return { ok: true, manifest: manifest };
}
return {
version: '1.0.0', PUBKEY: PUBKEY,
verify: verify, checkRelease: checkRelease, fileEntry: fileEntry,
sha256Hex: sha256Hex, utf8: utf8, b64decode: b64decode, keyId: keyId
};
})();
if (typeof module !== 'undefined' && module.exports) module.exports = BDSVerify;
if (typeof globalThis !== 'undefined' && globalThis) globalThis.BDSVerify = BDSVerify;
if (typeof window !== 'undefined') window.BDSVerify = BDSVerify;

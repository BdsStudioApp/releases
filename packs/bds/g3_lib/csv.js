const _o0 = [',', ';', '\t'];
function _o3(line, d) {
let _od = 0, _of = false;
for (let _oa = 0; _oa < line.length; _oa++) { const _o2 = line[_oa]; if (_o2 === '"') _of = !_of; else if (!_of && _o2 === d) _od++; }
return _od;
}
export function sniffDelimiter(text) {
const _oc = [];
for (const _ob of String(text || '').split(/\r?\n/)) { if (_ob.trim()) _oc.push(_ob); if (_oc.length >= 10) break; }
const _oe = ls => _o0.map(d => [d, Math.max(0, ...ls.map(_ob => _o3(_ob, d)))]).sort((a, b) => b[1] - a[1])[0];
const _o1 = _oe(_oc.slice(0, 1));
return _o1[1] > 0 ? _o1[0] : _oe(_oc)[0];
}
export function parseCsv(text) {
let _oi = String(text || '').replace(/^﻿/, '');
if (!_oi.trim()) return [];
let _o5 = null;
const _ok = /^\s*sep=(.)[ \t]*(\r?\n|$)/i.exec(_oi);
if (_ok) { _o5 = _ok[1]; _oi = _oi.slice(_ok[0].length); }
if (!_oi.trim()) return [];
if (!_o5) _o5 = sniffDelimiter(_oi);
const _oh = [];
let _og = [], cell = '', _of = false;
for (let _oa = 0; _oa < _oi.length; _oa++) {
const _o2 = _oi[_oa];
if (_of) {
if (_o2 === '"') { if (_oi[_oa + 1] === '"') { cell += '"'; _oa++; } else _of = false; }
else cell += _o2;
} else if (_o2 === '"' && cell === '') _of = true;
else if (_o2 === _o5) { _og.push(cell); cell = ''; }
else if (_o2 === '\n' || _o2 === '\r') {
if (_o2 === '\r' && _oi[_oa + 1] === '\n') _oa++;
_og.push(cell); cell = '';
if (_og.some(c => c.trim() !== '')) _oh.push(_og);
_og = [];
} else cell += _o2;
}
_og.push(cell);
if (_og.some(c => c.trim() !== '')) _oh.push(_og);
return _oh.map(r => r.map(c => c.trim()));
}
export function csvObjects(text, opts = {}) {
const _oh = parseCsv(text);
let _o9 = 0;
if (typeof opts.isHeader === 'function') { const _o8 = _oh.slice(0, 15).findIndex(r => opts.isHeader(r)); if (_o8 > 0) _o9 = _o8; }
if (_oh.length < _o9 + 2) return { headers: _oh[_o9] || [], items: [] };
const _oj = new Map();
const headers = _oh[_o9].map(h => { const _od = (_oj.get(h) || 0) + 1; _oj.set(h, _od); return _od > 1 ? `${h} #${_od}` : h; });
return { headers, items: _oh.slice(_o9 + 1).map(r => Object.fromEntries(headers.map((h, _oa) => [h, r[_oa] ?? '']))) };
}
export function toCsv(_oh) {
const _of = v => { const s0 = v === null || v === undefined ? '' : String(v), _oi = /^[=+\-@\t\r]/.test(s0) ? "'" + s0 : s0; return /[",\n\r;]/.test(_oi) ? '"' + _oi.replace(/"/g, '""') + '"' : _oi; };
return '﻿' + _oh.map(r => r.map(_of).join(',')).join('\r\n') + '\r\n';
}
export function decodeCsvBytes(buf) {
const _ol = buf instanceof Uint8Array ? buf : new Uint8Array(buf || 0);
if (_ol.length >= 4 && _ol[0] === 0x50 && _ol[1] === 0x4b && _ol[2] === 0x03 && _ol[3] === 0x04) return { text: '', encoding: '', binary: 'xlsx' };
if (_ol.length >= 4 && _ol[0] === 0xd0 && _ol[1] === 0xcf && _ol[2] === 0x11 && _ol[3] === 0xe0) return { text: '', encoding: '', binary: 'xls' };
let _o6 = '';
if (_ol[0] === 0xef && _ol[1] === 0xbb && _ol[2] === 0xbf) _o6 = 'utf-8';
else if (_ol[0] === 0xff && _ol[1] === 0xfe) _o6 = 'utf-16le';
else if (_ol[0] === 0xfe && _ol[1] === 0xff) _o6 = 'utf-16be';
else {
const _od = Math.min(_ol.length, 400);
let _o7 = 0, odd = 0;
for (let _oa = 0; _oa < _od; _oa++) if (_ol[_oa] === 0) { if (_oa % 2) odd++; else _o7++; }
if (_od >= 4 && odd > _od / 4) _o6 = 'utf-16le'; else if (_od >= 4 && _o7 > _od / 4) _o6 = 'utf-16be';
}
const _o4 = (e, fatal) => new TextDecoder(e, { fatal }).decode(_ol);
try {
if (_o6) return { text: _o4(_o6, false).replace(/^﻿/, ''), encoding: _o6, binary: '' };
try { return { text: _o4('utf-8', true).replace(/^﻿/, ''), encoding: 'utf-8', binary: '' }; }
catch (e) { return { text: _o4('windows-1252', false), encoding: 'windows-1252', binary: '' }; }
} catch (e) { return { text: _o4('utf-8', false).replace(/^﻿/, ''), encoding: 'utf-8', binary: '' }; }
}

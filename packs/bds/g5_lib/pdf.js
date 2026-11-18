const _o5 = (s) => { const _of = new Uint8Array(s.length); for (let _o8 = 0; _o8 < s.length; _o8++) _of[_o8] = s.charCodeAt(_o8) & 0xff; return _of; };
export function jpegSize(bytes) {
const _o0 = bytes;
if (!_o0 || _o0[0] !== 0xFF || _o0[1] !== 0xD8) return null;
let _o8 = 2;
while (_o8 + 9 < _o0.length) {
if (_o0[_o8] !== 0xFF) { _o8++; continue; }
const _ob = _o0[_o8 + 1];
if (_ob === 0xD8 || _ob === 0x01 || (_ob >= 0xD0 && _ob <= 0xD7)) { _o8 += 2; continue; }
const _oa = (_o0[_o8 + 2] << 8) | _o0[_o8 + 3];
if ((_ob >= 0xC0 && _ob <= 0xC3) || (_ob >= 0xC5 && _ob <= 0xC7) || (_ob >= 0xC9 && _ob <= 0xCB) || (_ob >= 0xCD && _ob <= 0xCF)) {
return { h: (_o0[_o8 + 5] << 8) | _o0[_o8 + 6], w: (_o0[_o8 + 7] << 8) | _o0[_o8 + 8] };
}
_o8 += 2 + _oa;
}
return null;
}
export function imagesToPdf(pages, { pageW = 595.28, pageH = 841.89, margin = 24, title = '' } = {}) {
const _oi = [], offsets = [];
let _oa = 0;
const push = (x) => { const _om = typeof x === 'string' ? _o5(x) : x; _oi.push(_om); _oa += _om.length; };
push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
const _oe = [];
const _oc = pages.length;
const _oh = pages.map((_, _o8) => 4 + _o8 * 3);
_oe.push({ id: 1, body: ['<< /Type /Catalog /Pages 2 0 R >>'] });
_oe.push({ id: 2, body: [`<< /Type /Pages /Kids [${_oh.map((_og) => _og + ' 0 R').join(' ')}] /Count ${_oc} >>`] });
_oe.push({ id: 3, body: [`<< /Producer (BDS Studio) /Title ${_oj(title)} >>`] });
pages.forEach((pg, _o8) => {
const _ol = jpegSize(pg.jpeg) || { w: pg.w, h: pg.h };
if (!_ol || !_ol.w || !_ol.h) throw new Error('Ảnh JPEG không hợp lệ');
const _ok = _oh[_o8], cid = _ok + 1, iid = _ok + 2;
const _o9 = Math.min((pageW - 2 * margin) / _ol.w, (pageH - 2 * margin) / _ol.h);
const _o4 = _ol.w * _o9, dh = _ol.h * _o9, dx = (pageW - _o4) / 2, dy = (pageH - dh) / 2;
const _o3 = `q ${_o6(_o4)} 0 0 ${_o6(dh)} ${_o6(dx)} ${_o6(dy)} cm /Im${_o8} Do Q\n`;
_oe.push({ id: _ok, body: [`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${_o6(pageW)} ${_o6(pageH)}] /Resources << /XObject << /Im${_o8} ${iid} 0 R >> >> /Contents ${cid} 0 R >>`] });
_oe.push({ id: cid, body: [`<< /Length ${_o3.length} >>\nstream\n${_o3}endstream`] });
_oe.push({ id: iid, body: [`<< /Type /XObject /Subtype /Image /Width ${_ol.w} /Height ${_ol.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${pg.jpeg.length} >>\nstream\n`, pg.jpeg, '\nendstream'] });
});
_oe.sort((a, _o0) => a.id - _o0.id);
for (const _od of _oe) {
offsets[_od.id] = _oa;
push(`${_od.id} 0 obj\n`);
_od.body.forEach(push);
push('\nendobj\n');
}
const _on = _oa, _ol = _oe.length + 1;
push(`xref\n0 ${_ol}\n0000000000 65535 f \n`);
for (let _o8 = 1; _o8 < _ol; _o8++) push(String(offsets[_o8]).padStart(10, '0') + ' 00000 n \n');
push(`trailer\n<< /Size ${_ol} /Root 1 0 R /Info 3 0 R >>\nstartxref\n${_on}\n%%EOF\n`);
const _of = new Uint8Array(_oa);
let _og = 0;
for (const _om of _oi) { _of.set(_om, _og); _og += _om.length; }
return _of;
}
const _o6 = (_oc) => (Math.round(_oc * 100) / 100).toString();
function _oj(s) {
s = String(s || '');
if (/^[\x20-\x7E]*$/.test(s)) return '(' + s.replace(/[\\()]/g, (_o1) => '\\' + _o1) + ')';
let _o7 = 'FEFF';
for (const _o2 of s) { const _o1 = _o2.codePointAt(0); if (_o1 > 0xFFFF) continue; _o7 += _o1.toString(16).padStart(4, '0').toUpperCase(); }
return '<' + _o7 + '>';
}

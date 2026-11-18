const _o0 = (() => { const _oe = new Uint32Array(256); for (let _oa = 0; _oa < 256; _oa++) { let _o2 = _oa; for (let _o8 = 0; _o8 < 8; _o8++) _o2 = _o2 & 1 ? 0xEDB88320 ^ (_o2 >>> 1) : _o2 >>> 1; _oe[_oa] = _o2 >>> 0; } return _oe; })();
export function crc32(bytes) { let _o2 = 0xFFFFFFFF; for (let _o7 = 0; _o7 < bytes.length; _o7++) _o2 = _o0[(_o2 ^ bytes[_o7]) & 0xFF] ^ (_o2 >>> 8); return (_o2 ^ 0xFFFFFFFF) >>> 0; }
export function zipStore(files, date = new Date(2026, 0, 1)) {
const _o4 = new TextEncoder();
const dosTime = ((date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() >> 1)) & 0xFFFF;
const dosDate = (((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()) & 0xFFFF;
const locals = []; const centrals = []; let offset = 0;
for (const _o6 of files) {
const name = _o4.encode(_o6.name); const data = typeof _o6.data === 'string' ? _o4.encode(_o6.data) : _o6.data;
const crc = crc32(data);
const _o9 = new DataView(new ArrayBuffer(30));
_o9.setUint32(0, 0x04034b50, true); _o9.setUint16(4, 20, true); _o9.setUint16(6, 0x0800, true); _o9.setUint16(8, 0, true);
_o9.setUint16(10, dosTime, true); _o9.setUint16(12, dosDate, true); _o9.setUint32(14, crc, true);
_o9.setUint32(18, data.length, true); _o9.setUint32(22, data.length, true); _o9.setUint16(26, name.length, true); _o9.setUint16(28, 0, true);
locals.push(new Uint8Array(_o9.buffer), name, data);
const _o3 = new DataView(new ArrayBuffer(46));
_o3.setUint32(0, 0x02014b50, true); _o3.setUint16(4, 20, true); _o3.setUint16(6, 20, true); _o3.setUint16(8, 0x0800, true); _o3.setUint16(10, 0, true);
_o3.setUint16(12, dosTime, true); _o3.setUint16(14, dosDate, true); _o3.setUint32(16, crc, true);
_o3.setUint32(20, data.length, true); _o3.setUint32(24, data.length, true); _o3.setUint16(28, name.length, true);
_o3.setUint32(38, 0o100644 << 16 >>> 0, true); _o3.setUint32(42, offset, true);
centrals.push(new Uint8Array(_o3.buffer), name);
offset += 30 + name.length + data.length;
}
const cdSize = centrals.reduce((_oa, _o1) => _oa + _o1.length, 0);
const _o5 = new DataView(new ArrayBuffer(22));
_o5.setUint32(0, 0x06054b50, true); _o5.setUint16(8, files.length, true); _o5.setUint16(10, files.length, true);
_o5.setUint32(12, cdSize, true); _o5.setUint32(16, offset, true);
const _od = [...locals, ...centrals, new Uint8Array(_o5.buffer)];
const _ob = new Uint8Array(_od.reduce((_oa, _o1) => _oa + _o1.length, 0)); let _oc = 0;
for (const _o1 of _od) { _ob.set(_o1, _oc); _oc += _o1.length; }
return _ob;
}
export default { zipStore, crc32 };

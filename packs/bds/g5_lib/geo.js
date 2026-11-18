export const R_EARTH = 6378137;
export const MAX_LAT = 85.05112878;
const _o1 = Math.PI / 180;
export const mercX = (lng) => R_EARTH * lng * _o1;
export const mercY = (lat) => { const _o9 = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat)); return R_EARTH * Math.log(Math.tan(Math.PI / 4 + (_o9 * _o1) / 2)); };
export const lngOf = (x) => (x / R_EARTH) / _o1;
export const latOf = (y) => (2 * Math.atan(Math.exp(y / R_EARTH)) - Math.PI / 2) / _o1;
export const scaleAt = (lat) => Math.cos(lat * _o1);
export function haversine(a, b) {
const R = 6371008.8;
const _o5 = (b.lat - a.lat) * _o1, dLng = (b.lng - a.lng) * _o1;
const s = Math.sin(_o5 / 2) ** 2 + Math.cos(a.lat * _o1) * Math.cos(b.lat * _o1) * Math.sin(dLng / 2) ** 2;
return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}
export function parseLatLng(text) {
let s = String(text || '').trim();
if (/^-?\d+,\d+\s*[;\s]\s*-?\d+,\d+$/.test(s)) s = s.replace(/(\d),(\d)/g, '$1.$2');
const _o6 = /(\d+(?:\.\d+)?)\s*[°º]\s*(?:(\d+(?:\.\d+)?)\s*['′]\s*)?(?:(\d+(?:\.\d+)?)\s*["″]\s*)?([NSEWBĐTnsewbđt])/g;
const _od = [...s.matchAll(_o6)];
if (_od.length >= 2) {
const _ol = (m) => {
const v = Number(m[1]) + (Number(m[2]) || 0) / 60 + (Number(m[3]) || 0) / 3600;
return /[SWTswt]/.test(m[4]) ? -v : v;
};
const a = _od[0], b = _od[1];
const _o7 = (m) => /[NSBns]/.test(m[4]) || /[Bb]/.test(m[4]);
const lat = _o7(a) ? _ol(a) : _ol(b), lng = _o7(a) ? _ol(b) : _ol(a);
return _om(lat, lng) ? { lat, lng } : null;
}
const _oc = s.match(/-?\d+(?:\.\d+)?/g);
if (!_oc || _oc.length < 2) return null;
const lat = Number(_oc[0]), lng = Number(_oc[1]);
return _om(lat, lng) ? { lat, lng } : null;
}
const _om = (lat, lng) => Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
export const TILE = 256;
export const resAt = (z) => (2 * Math.PI * R_EARTH) / (TILE * 2 ** z);
export function tileOf(lat, lng, z) {
const n = 2 ** z;
const x = Math.floor(((lng + 180) / 360) * n);
const _og = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat)) * _o1;
const y = Math.floor(((1 - Math.log(Math.tan(_og) + 1 / Math.cos(_og)) / Math.PI) / 2) * n);
return { x: Math.max(0, Math.min(n - 1, x)), y: Math.max(0, Math.min(n - 1, y)), z };
}
export function tileOrigin(x, y, z) {
const size = 2 * Math.PI * R_EARTH / 2 ** z;
return { mx: -Math.PI * R_EARTH + x * size, my: Math.PI * R_EARTH - y * size, size };
}
export function tileUrl(tpl, x, y, z) {
return String(tpl || '').replace('{z}', z).replace('{x}', x).replace('{y}', y).replace('{s}', 'abc'[(x + y) % 3]);
}
function _oi(M, v) {
const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
const _o0 = det(M);
if (!Number.isFinite(_o0) || Math.abs(_o0) < 1e-9) return null;
return [0, 1, 2].map((c) => det(M.map((row, _og) => row.map((x, _o8) => (_o8 === c ? v[_og] : x)))) / _o0);
}
export function fitAffine(points) {
const _oe = (points || []).filter((p) => p && [p.px, p.py, p.lat, p.lng].every((v) => Number.isFinite(Number(v))))
.map((p) => ({ px: Number(p.px), py: Number(p.py), lat: Number(p.lat), lng: Number(p.lng) }));
if (_oe.length < 3) return { ok: false, code: 'FEW', message: 'Cần ít nhất 3 điểm khống chế (nên 4–6 điểm rải đều 4 góc).' };
const cx = _o3(_oe.map((p) => p.px)), cy = _o3(_oe.map((p) => p.py));
const _o2 = _oe.map((p) => mercX(p.lng)), Y = _oe.map((p) => mercY(p.lat));
const _ob = _o3(_o2), my0 = _o3(Y);
let _oj = 0, sxy = 0, syy = 0, sx = 0, sy = 0;
const _o4 = [0, 0, 0], by = [0, 0, 0];
_oe.forEach((p, i) => {
const _ok = p.px - cx, v = p.py - cy, X1 = _o2[i] - _ob, Y1 = Y[i] - my0;
_oj += _ok * _ok; sxy += _ok * v; syy += v * v; sx += _ok; sy += v;
_o4[0] += _ok * X1; _o4[1] += v * X1; _o4[2] += X1;
by[0] += _ok * Y1; by[1] += v * Y1; by[2] += Y1;
});
const N = [[_oj, sxy, sx], [sxy, syy, sy], [sx, sy, _oe.length]];
const tr = _oj + syy, det2 = _oj * syy - sxy * sxy;
const _oa = tr / 2 - Math.sqrt(Math.max(0, tr * tr / 4 - det2));
if (_oa / _oe.length < 1) return { ok: false, code: 'COLLINEAR', message: 'Các điểm gần như thẳng hàng – chọn điểm rải ra các góc ảnh.' };
const _oh = _oi(N, _o4), sY = _oi(N, by);
if (!_oh || !sY) return { ok: false, code: 'COLLINEAR', message: 'Các điểm gần như thẳng hàng – chọn điểm rải ra các góc ảnh.' };
const [a, b, c0] = _oh, [d, e, f0] = sY;
const T = { a, b, c: c0 + _ob - a * cx - b * cy, d, e, f: f0 + my0 - d * cx - e * cy };
const _o8 = scaleAt(_o3(_oe.map((p) => p.lat)));
const residuals = _oe.map((p, i) => {
const _of = apply(T, p.px, p.py);
return Math.hypot(_of.mx - _o2[i], _of.my - Y[i]) * _o8;
});
const rms = _oe.length > 3 ? Math.sqrt(residuals.reduce((s, _og) => s + _og * _og, 0) / (_oe.length - 3)) : 0;
return {
ok: true, T, residuals, rms, maxErr: Math.max(...residuals), n: _oe.length,
mPerPx: Math.sqrt(Math.abs(a * e - b * d)) * _o8,
rotation: Math.atan2(-d, a) / _o1,
det: a * e - b * d
};
}
const _o3 = (a) => a.reduce((s, x) => s + x, 0) / (a.length || 1);
export function apply(T, px, py) { return { mx: T.a * px + T.b * py + T.c, my: T.d * px + T.e * py + T.f }; }
export function pixelToLatLng(T, px, py) { const _of = apply(T, px, py); return { lat: latOf(_of.my), lng: lngOf(_of.mx) }; }
export function invert(T) {
const _o0 = T.a * T.e - T.b * T.d;
if (!_o0) return null;
const a = T.e / _o0, b = -T.b / _o0, d = -T.d / _o0, e = T.a / _o0;
return { a, b, c: -(a * T.c + b * T.f), d, e, f: -(d * T.c + e * T.f) };
}
export function latLngToPixel(T, lat, lng) {
const I = invert(T); if (!I) return null;
const mx = mercX(lng), my = mercY(lat);
return { px: I.a * mx + I.b * my + I.c, py: I.d * mx + I.e * my + I.f };
}
export function canvasMatrix(T, view) {
const _o8 = 1 / view.res;
return [T.a * _o8, -T.d * _o8, T.b * _o8, -T.e * _o8, (T.c - view.cx) * _o8 + view.w / 2, (view.cy - T.f) * _o8 + view.h / 2];
}
export function screenToMerc(view, sx, sy) { return { mx: view.cx + (sx - view.w / 2) * view.res, my: view.cy - (sy - view.h / 2) * view.res }; }
export function mercToScreen(view, mx, my) { return { sx: (mx - view.cx) / view.res + view.w / 2, sy: (view.cy - my) / view.res + view.h / 2 }; }
export function fitVerdict(fit) {
if (!fit || !fit.ok) return { tone: 'warn', text: (fit && fit.message) || 'Chưa nắn.' };
if (fit.n === 3) return { tone: 'info', text: 'Đủ 3 điểm – ảnh đã khớp, nhưng chưa tự kiểm được sai số. Thêm điểm thứ 4 trở lên để biết độ lệch.' };
if (fit.rms <= 3) return { tone: 'success', text: `Khớp tốt: lệch trung bình khoảng ${fit.rms.toFixed(1)} m.` };
if (fit.rms <= 10) return { tone: 'info', text: `Tạm được: lệch trung bình khoảng ${fit.rms.toFixed(1)} m – đủ để xem khu vực, chưa đủ để đo ranh thửa.` };
return { tone: 'warn', text: `Lệch lớn (${fit.rms.toFixed(0)} m) – kiểm lại điểm có sai số lớn nhất hoặc ảnh bị méo/không cùng tỷ lệ.` };
}

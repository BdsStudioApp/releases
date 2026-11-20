export const R_EARTH = 6378137;
export const MAX_LAT = 85.05112878;
const _o0 = Math.PI / 180;
export const mercX = (lng) => R_EARTH * lng * _o0;
export const mercY = (lat) => { const _o8 = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat)); return R_EARTH * Math.log(Math.tan(Math.PI / 4 + (_o8 * _o0) / 2)); };
export const lngOf = (x) => (x / R_EARTH) / _o0;
export const latOf = (y) => (2 * Math.atan(Math.exp(y / R_EARTH)) - Math.PI / 2) / _o0;
export const scaleAt = (lat) => Math.cos(lat * _o0);
export function haversine(a, b) {
const R = 6371008.8;
const _o4 = (b.lat - a.lat) * _o0, dLng = (b.lng - a.lng) * _o0;
const s = Math.sin(_o4 / 2) ** 2 + Math.cos(a.lat * _o0) * Math.cos(b.lat * _o0) * Math.sin(dLng / 2) ** 2;
return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}
export function parseLatLng(text) {
let s = String(text || '').trim();
if (/^-?\d+,\d+\s*[;\s]\s*-?\d+,\d+$/.test(s)) s = s.replace(/(\d),(\d)/g, '$1.$2');
const _o5 = /(\d+(?:\.\d+)?)\s*[°º]\s*(?:(\d+(?:\.\d+)?)\s*['′]\s*)?(?:(\d+(?:\.\d+)?)\s*["″]\s*)?([NSEWBĐTnsewbđt])/g;
const _oc = [...s.matchAll(_o5)];
if (_oc.length >= 2) {
const _ok = (m) => {
const v = Number(m[1]) + (Number(m[2]) || 0) / 60 + (Number(m[3]) || 0) / 3600;
return /[SWTswt]/.test(m[4]) ? -v : v;
};
const a = _oc[0], b = _oc[1];
const _o6 = (m) => /[NSBns]/.test(m[4]) || /[Bb]/.test(m[4]);
const lat = _o6(a) ? _ok(a) : _ok(b), lng = _o6(a) ? _ok(b) : _ok(a);
return _ol(lat, lng) ? { lat, lng } : null;
}
const _ob = s.match(/-?\d+(?:\.\d+)?/g);
if (!_ob || _ob.length < 2) return null;
const lat = Number(_ob[0]), lng = Number(_ob[1]);
return _ol(lat, lng) ? { lat, lng } : null;
}
const _ol = (lat, lng) => Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
export const TILE = 256;
export const resAt = (z) => (2 * Math.PI * R_EARTH) / (TILE * 2 ** z);
export function tileOf(lat, lng, z) {
const n = 2 ** z;
const x = Math.floor(((lng + 180) / 360) * n);
const _of = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat)) * _o0;
const y = Math.floor(((1 - Math.log(Math.tan(_of) + 1 / Math.cos(_of)) / Math.PI) / 2) * n);
return { x: Math.max(0, Math.min(n - 1, x)), y: Math.max(0, Math.min(n - 1, y)), z };
}
export function tileOrigin(x, y, z) {
const size = 2 * Math.PI * R_EARTH / 2 ** z;
return { mx: -Math.PI * R_EARTH + x * size, my: Math.PI * R_EARTH - y * size, size };
}
export function tileUrl(tpl, x, y, z) {
return String(tpl || '').replace('{z}', z).replace('{x}', x).replace('{y}', y).replace('{s}', 'abc'[(x + y) % 3]);
}
function _oh(M, v) {
const det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
const D = det(M);
if (!Number.isFinite(D) || Math.abs(D) < 1e-9) return null;
return [0, 1, 2].map((c) => det(M.map((row, _of) => row.map((x, _o7) => (_o7 === c ? v[_of] : x)))) / D);
}
export function fitAffine(points) {
const _od = (points || []).filter((p) => p && [p.px, p.py, p.lat, p.lng].every((v) => Number.isFinite(Number(v))))
.map((p) => ({ px: Number(p.px), py: Number(p.py), lat: Number(p.lat), lng: Number(p.lng) }));
if (_od.length < 3) return { ok: false, code: 'FEW', message: 'Cần ít nhất 3 điểm khống chế (nên 4–6 điểm rải đều 4 góc).' };
const cx = _o2(_od.map((p) => p.px)), cy = _o2(_od.map((p) => p.py));
const _o1 = _od.map((p) => mercX(p.lng)), Y = _od.map((p) => mercY(p.lat));
const _oa = _o2(_o1), my0 = _o2(Y);
let _oi = 0, sxy = 0, syy = 0, sx = 0, sy = 0;
const _o3 = [0, 0, 0], by = [0, 0, 0];
_od.forEach((p, i) => {
const _oj = p.px - cx, v = p.py - cy, X1 = _o1[i] - _oa, Y1 = Y[i] - my0;
_oi += _oj * _oj; sxy += _oj * v; syy += v * v; sx += _oj; sy += v;
_o3[0] += _oj * X1; _o3[1] += v * X1; _o3[2] += X1;
by[0] += _oj * Y1; by[1] += v * Y1; by[2] += Y1;
});
const N = [[_oi, sxy, sx], [sxy, syy, sy], [sx, sy, _od.length]];
const tr = _oi + syy, det2 = _oi * syy - sxy * sxy;
const _o9 = tr / 2 - Math.sqrt(Math.max(0, tr * tr / 4 - det2));
if (_o9 / _od.length < 1) return { ok: false, code: 'COLLINEAR', message: 'Các điểm gần như thẳng hàng – chọn điểm rải ra các góc ảnh.' };
const _og = _oh(N, _o3), sY = _oh(N, by);
if (!_og || !sY) return { ok: false, code: 'COLLINEAR', message: 'Các điểm gần như thẳng hàng – chọn điểm rải ra các góc ảnh.' };
const [a, b, c0] = _og, [d, e, f0] = sY;
const T = { a, b, c: c0 + _oa - a * cx - b * cy, d, e, f: f0 + my0 - d * cx - e * cy };
const _o7 = scaleAt(_o2(_od.map((p) => p.lat)));
const residuals = _od.map((p, i) => {
const _oe = apply(T, p.px, p.py);
return Math.hypot(_oe.mx - _o1[i], _oe.my - Y[i]) * _o7;
});
const rms = _od.length > 3 ? Math.sqrt(residuals.reduce((s, _of) => s + _of * _of, 0) / (_od.length - 3)) : 0;
return {
ok: true, T, residuals, rms, maxErr: Math.max(...residuals), n: _od.length,
mPerPx: Math.sqrt(Math.abs(a * e - b * d)) * _o7,
rotation: Math.atan2(-d, a) / _o0,
det: a * e - b * d
};
}
const _o2 = (a) => a.reduce((s, x) => s + x, 0) / (a.length || 1);
export function apply(T, px, py) { return { mx: T.a * px + T.b * py + T.c, my: T.d * px + T.e * py + T.f }; }
export function pixelToLatLng(T, px, py) { const _oe = apply(T, px, py); return { lat: latOf(_oe.my), lng: lngOf(_oe.mx) }; }
export function invert(T) {
const D = T.a * T.e - T.b * T.d;
if (!D) return null;
const a = T.e / D, b = -T.b / D, d = -T.d / D, e = T.a / D;
return { a, b, c: -(a * T.c + b * T.f), d, e, f: -(d * T.c + e * T.f) };
}
export function latLngToPixel(T, lat, lng) {
const I = invert(T); if (!I) return null;
const mx = mercX(lng), my = mercY(lat);
return { px: I.a * mx + I.b * my + I.c, py: I.d * mx + I.e * my + I.f };
}
export function canvasMatrix(T, view) {
const _o7 = 1 / view.res;
return [T.a * _o7, -T.d * _o7, T.b * _o7, -T.e * _o7, (T.c - view.cx) * _o7 + view.w / 2, (view.cy - T.f) * _o7 + view.h / 2];
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

const _o3 = Math.PI / 180;
const sin = (d) => Math.sin(d * _o3), cos = (d) => Math.cos(d * _o3), tan = (d) => Math.tan(d * _o3);
const asin = (x) => Math.asin(Math.max(-1, Math.min(1, x))) / _o3, acos = (x) => Math.acos(Math.max(-1, Math.min(1, x))) / _o3;
const _oe = (_o4, n) => ((_o4 % n) + n) % n;
export const VN_TZ = 7;
export const DIRS8 = [
{ id: 'N', vi: 'Bắc', deg: 0 }, { id: 'NE', vi: 'Đông Bắc', deg: 45 }, { id: 'E', vi: 'Đông', deg: 90 }, { id: 'SE', vi: 'Đông Nam', deg: 135 },
{ id: 'S', vi: 'Nam', deg: 180 }, { id: 'SW', vi: 'Tây Nam', deg: 225 }, { id: 'W', vi: 'Tây', deg: 270 }, { id: 'NW', vi: 'Tây Bắc', deg: 315 },
];
export function dirName(deg) { return DIRS8[Math.round(_oe(deg, 360) / 45) % 8].vi; }
export const angleDiff = (_o4, b) => { const d = _oe(_o4 - b + 180, 360) - 180; return d === -180 ? 180 : d; };
export const julianDay = (ms) => ms / 86400000 + 2440587.5;
export function localToUtcMs(ymd, minutes, tz = VN_TZ) {
const [_os, m, d] = String(ymd).split('-').map(Number);
return Date.UTC(_os, m - 1, d, 0, 0, 0) + (minutes - tz * 60) * 60000;
}
function _om(ms) {
const _o1 = (julianDay(ms) - 2451545) / 36525;
const _o2 = _oe(280.46646 + _o1 * (36000.76983 + _o1 * 0.0003032), 360);
const M = 357.52911 + _o1 * (35999.05029 - 0.0001537 * _o1);
const e = 0.016708634 - _o1 * (0.000042037 + 0.0000001267 * _o1);
const C = sin(M) * (1.914602 - _o1 * (0.004817 + 0.000014 * _o1)) + sin(2 * M) * (0.019993 - 0.000101 * _o1) + sin(3 * M) * 0.000289;
const _op = _o2 + C;
const _og = 125.04 - 1934.136 * _o1;
const _o5 = _op - 0.00569 - 0.00478 * sin(_og);
const _oa = 23 + (26 + (21.448 - _o1 * (46.815 + _o1 * (0.00059 - _o1 * 0.001813))) / 60) / 60;
const _o9 = _oa + 0.00256 * cos(_og);
const decl = asin(sin(_o9) * sin(_o5));
const _os = tan(_o9 / 2) ** 2;
const eqTime = 4 * (_os * sin(2 * _o2) - 2 * e * sin(M) + 4 * e * _os * sin(M) * cos(2 * _o2) - 0.5 * _os * _os * sin(4 * _o2) - 1.25 * e * e * sin(2 * M)) / _o3;
return { decl, eqTime };
}
export function refraction(elev) {
if (elev > 85) return 0;
const t = tan(elev);
let _ol;
if (elev > 5) _ol = 58.1 / t - 0.07 / t ** 3 + 0.000086 / t ** 5;
else if (elev > -0.575) _ol = 1735 + elev * (-518.2 + elev * (103.4 + elev * (-12.79 + elev * 0.711)));
else _ol = -20.772 / t;
return _ol / 3600;
}
export function sunPosition(ms, lat, lng) {
const { decl, eqTime } = _om(ms);
const d = new Date(ms);
const _or = d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60;
const _oq = _oe(_or + eqTime + 4 * lng, 1440);
const _oc = _oq / 4 < 0 ? _oq / 4 + 180 : _oq / 4 - 180;
const _ot = acos(sin(lat) * sin(decl) + cos(lat) * cos(decl) * cos(_oc));
const _ob = 90 - _ot;
const altitude = _ob + refraction(_ob);
let azimuth;
const _o8 = cos(lat) * sin(_ot);
if (Math.abs(_o8) < 1e-9) azimuth = lat > decl ? 180 : 0;
else {
const _o4 = acos((sin(lat) * cos(_ot) - sin(decl)) / _o8);
azimuth = _oc > 0 ? _oe(_o4 + 180, 360) : _oe(540 - _o4, 360);
}
return { altitude, azimuth, declination: decl, eqTime, hourAngle: _oc };
}
export function sunTimes(ymd, lat, lng, tz = VN_TZ) {
const _of = localToUtcMs(ymd, 720, tz);
const { decl, eqTime } = _om(_of);
const noon = 720 - 4 * lng - eqTime + tz * 60;
const _o6 = cos(90.833) / (cos(lat) * cos(decl)) - tan(lat) * tan(decl);
if (_o6 > 1) return { noon, sunrise: null, sunset: null, polar: 'night' };
if (_o6 < -1) return { noon, sunrise: null, sunset: null, polar: 'day' };
const _o0 = acos(_o6);
return { noon, sunrise: noon - 4 * _o0, sunset: noon + 4 * _o0, dayLength: 8 * _o0 };
}
export const hhmm = (min) => {
if (min == null || !Number.isFinite(min)) return '—';
const m = Math.round(_oe(min, 1440));
return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
};
export function dayPath(ymd, lat, lng, { tz = VN_TZ, step = 10, above = true } = {}) {
const _oj = [];
for (let m = 0; m <= 1440; m += step) {
const _ok = sunPosition(localToUtcMs(ymd, m, tz), lat, lng);
if (!above || _ok.altitude > 0) _oj.push({ min: m, altitude: _ok.altitude, azimuth: _ok.azimuth });
}
return _oj;
}
export function blockedBy(obs, alt, az) {
if (!obs || !(obs.dist > 0) || !(obs.height > 0)) return false;
const _od = Math.atan2((Number(obs.width) || 30) / 2, obs.dist) / _o3;
return Math.abs(angleDiff(az, obs.dir)) <= _od && alt < Math.atan2(obs.height, obs.dist) / _o3;
}
export function facadeSun(ymd, lat, lng, facing, { tz = VN_TZ, step = 5, obstacle = null } = {}) {
const t = sunTimes(ymd, lat, lng, tz);
let minutes = 0, morning = 0, afternoon = 0, harshPm = 0, blocked = 0, first = null, last = null, peak = { min: null, strength: 0 };
const intervals = []; let _oi = null;
for (let m = 0; m < 1440; m += step) {
const _ok = sunPosition(localToUtcMs(ymd, m + step / 2, tz), lat, lng);
const _o7 = angleDiff(_ok.azimuth, facing);
const strength = _ok.altitude > 0 && Math.abs(_o7) < 90 ? cos(_ok.altitude) * cos(_o7) : 0;
let _oh = strength > 0.02;
if (_oh && blockedBy(obstacle, _ok.altitude, _ok.azimuth)) { _oh = false; blocked += step; }
if (_oh) {
minutes += step;
if (m + step / 2 < t.noon) morning += step; else afternoon += step;
if (m + step / 2 >= 13 * 60 && _ok.altitude > 8 && strength > 0.45) harshPm += step;
if (first == null) first = m;
last = m + step;
if (strength > peak.strength) peak = { min: m + step / 2, strength };
if (!_oi) _oi = [m, m + step]; else _oi[1] = m + step;
} else if (_oi) { intervals.push(_oi); _oi = null; }
}
if (_oi) intervals.push(_oi);
return { minutes, morning, afternoon, first, last, intervals, peak, harshPm, blocked, times: t };
}
export function seasonDates(year) {
return [
{ id: 'xuanphan', vi: 'Xuân phân (~20/3)', ymd: `${year}-03-20` },
{ id: 'hachi', vi: 'Hạ chí (~21/6)', ymd: `${year}-06-21` },
{ id: 'thuphan', vi: 'Thu phân (~23/9)', ymd: `${year}-09-23` },
{ id: 'dongchi', vi: 'Đông chí (~22/12)', ymd: `${year}-12-22` },
];
}
export function shadow(height, alt, az) {
if (!(alt > 0)) return { length: Infinity, dir: _oe(az + 180, 360) };
return { length: height / Math.tan(alt * _o3), dir: _oe(az + 180, 360) };
}
export const horizonKm = (h) => (h > 0 ? 3.57 * Math.sqrt(h) : 0);
export const eyeHeight = (floor, fh = 3.2) => Math.max(0, (Math.max(1, Number(floor) || 1) - 1) * fh + 1.6);
export function summarize(lat, lng, facing, { year = new Date().getFullYear(), tz = VN_TZ, obstacle = null } = {}) {
const seasons = seasonDates(year).map((s) => ({ ...s, sun: facadeSun(s.ymd, lat, lng, facing, { tz, obstacle }) }));
const notes = [];
const _on = seasons.find((s) => s.id === 'hachi').sun, winter = seasons.find((s) => s.id === 'dongchi').sun;
if (_on.harshPm >= 60) notes.push(`Mùa hè có khoảng ${(_on.harshPm / 60).toFixed(1).replace('.', ',')} giờ nắng chiều chiếu thẳng – nên có rèm cản nhiệt / kính Low-E, hạn chế đặt phòng ngủ phía này.`);
if (winter.minutes >= 180 && _on.minutes <= winter.minutes) notes.push('Mùa đông đón nắng nhiều hơn mùa hè – ấm áp, khô thoáng (thuận lợi ở miền Bắc).');
if (_on.morning >= 120 && _on.afternoon < 60) notes.push('Chủ yếu nắng sáng – dịu, tốt cho phòng ngủ và ban công trồng cây.');
const _oo = seasons.reduce((t, s) => t + s.sun.minutes, 0);
if (_oo < 120) notes.push('Gần như không có nắng trực tiếp chiếu vào mặt này – mát nhưng có thể thiếu sáng tự nhiên, cần kiểm ẩm mốc.');
if (seasons.some((s) => s.sun.blocked >= 30)) notes.push('Vật cản phía trước che bớt nắng ở một số thời điểm (xem từng mùa).');
return { facing, facingName: dirName(facing), seasons, notes };
}

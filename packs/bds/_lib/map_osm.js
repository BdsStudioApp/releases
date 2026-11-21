export const attribution = '© OpenStreetMap contributors';
export const NOMINATIM_URL = '';
export const NO_GEOCODER = 'Chưa cấu hình máy chủ tìm địa điểm cho bản đồ (web/config.js › MAP_GEOCODE_URL) – liên hệ người cài app.';
export const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
export const MAX_BBOX_AREA = 0.25;
export const HARD_MAX_BBOX_AREA = 4;
export const ALL_KINDS = Object.freeze(['road', 'rail', 'metro', 'boundary', 'water', 'park']);
export const MAP_FAIL = 'Chưa lấy được bản đồ, anh/chị tải ảnh bản đồ lên hoặc nhập tay.';
const LOCATE_FAIL = 'Em chưa tìm được toạ độ, anh/chị nhập tay giúp em.';
const _o0 = 10000;
const _o2 = 20000;
const _o1 = 15;
const MAX_LAT = 85.05112878;
const _ow = (v) => typeof v === 'number' && Number.isFinite(v);
const _o26 = (lat, lon) => _ow(lat) && _ow(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
const _o1n = (x) => +(+x).toFixed(6);
export function mercator(lat, lon) {
const _o13 = Math.max(-MAX_LAT, Math.min(MAX_LAT, lat)) * Math.PI / 180;
return { x: (lon + 180) / 360, y: (1 - Math.log(Math.tan(_o13) + 1 / Math.cos(_o13)) / Math.PI) / 2 };
}
export function unmercator(x, y) {
const n = Math.PI - 2 * Math.PI * y;
return { lat: (180 / Math.PI) * Math.atan(Math.sinh(n)), lon: x * 360 - 180 };
}
export function validBBox(_o7) {
return Array.isArray(_o7) && _o7.length === 4 && _o7.every(_ow) && _o7[0] < _o7[2] && _o7[1] < _o7[3]
&& Math.abs(_o7[0]) <= 90 && Math.abs(_o7[2]) <= 90 && Math.abs(_o7[1]) <= 180 && Math.abs(_o7[3]) <= 180;
}
export function bboxOf(_oy) {
let _o1u = Infinity, w = Infinity, n = -Infinity, e = -Infinity;
const _o5 = (la, lo) => { if (!_o26(la, lo)) return; _o1u = Math.min(_o1u, la); n = Math.max(n, la); w = Math.min(w, lo); e = Math.max(e, lo); };
for (const _ox of _oy || []) {
if (!_ox) continue;
if (Array.isArray(_ox)) { _o5(_ox[0], _ox[1]); continue; }
_o5(_ox.lat, _ox.lon);
if (Array.isArray(_ox.bbox) && _ox.bbox.length === 4) { _o5(_ox.bbox[0], _ox.bbox[1]); _o5(_ox.bbox[2], _ox.bbox[3]); }
}
return _o1u === Infinity ? null : [_o1u, w, n, e];
}
export function padBBox(_o7, ratio = 0.15, minSpan = 0.004) {
let [_o1u, w, n, e] = _o7;
if (n - _o1u < minSpan) { const c = (_o1u + n) / 2; _o1u = c - minSpan / 2; n = c + minSpan / 2; }
if (e - w < minSpan) { const c = (w + e) / 2; w = c - minSpan / 2; e = c + minSpan / 2; }
const _on = (n - _o1u) * ratio, _om = (e - w) * ratio;
return [Math.max(-90, _o1u - _on), Math.max(-180, w - _om), Math.min(90, n + _on), Math.min(180, e + _om)];
}
export const bboxArea = (_o7) => (_o7[2] - _o7[0]) * (_o7[3] - _o7[1]);
export function limitBBox(_o7, maxArea = MAX_BBOX_AREA) {
const a = bboxArea(_o7);
if (a <= maxArea) return { bbox: _o7.slice(), shrunk: false };
const _o10 = Math.sqrt(maxArea / a) * 0.999999;
const _oi = (_o7[0] + _o7[2]) / 2, _oh = (_o7[1] + _o7[3]) / 2, hy = (_o7[2] - _o7[0]) * _o10 / 2, hx = (_o7[3] - _o7[1]) * _o10 / 2;
return { bbox: [_oi - hy, _oh - hx, _oi + hy, _oh + hx], shrunk: true };
}
export function simplifyLine(pts, tol) {
if (!Array.isArray(pts) || pts.length < 3 || !(tol > 0)) return (pts || []).slice();
const _o11 = new Uint8Array(pts.length); _o11[0] = _o11[pts.length - 1] = 1;
const _o1y = tol * tol, stack = [[0, pts.length - 1]];
while (stack.length) {
const [a, _o7] = stack.pop();
const [ay, ax] = pts[a], [by, bx] = pts[_o7], _om = bx - ax, _on = by - ay, L = _om * _om + _on * _on;
let _o9 = -1, bi = -1;
for (let i = a + 1; i < _o7; i++) {
const [py, px] = pts[i];
let _oj;
if (L === 0) _oj = (px - ax) ** 2 + (py - ay) ** 2;
else { const t = Math.max(0, Math.min(1, ((px - ax) * _om + (py - ay) * _on) / L)); _oj = (px - ax - t * _om) ** 2 + (py - ay - t * _on) ** 2; }
if (_oj > _o9) { _o9 = _oj; bi = i; }
}
if (_o9 > _o1y) { _o11[bi] = 1; stack.push([a, bi], [bi, _o7]); }
}
return pts.filter((_, i) => _o11[i]);
}
export function mergeLines(lines) {
const _o12 = (_o1h) => _o1h[0].toFixed(7) + ',' + _o1h[1].toFixed(7);
const _oy = (lines || []).filter((_o13) => Array.isArray(_o13) && _o13.length >= 2);
const _o25 = new Array(_oy.length).fill(false), ends = new Map();
const add = (_o10, i) => { if (!ends.has(_o10)) ends.set(_o10, []); ends.get(_o10).push(i); };
_oy.forEach((_o13, i) => { add(_o12(_o13[0]), i); add(_o12(_o13[_o13.length - 1]), i); });
const _o1z = (_o10) => { for (const _oz of ends.get(_o10) || []) if (!_o25[_oz]) return _oz; return -1; };
const _o1d = [];
for (let i = 0; i < _oy.length; i++) {
if (_o25[i]) continue;
_o25[i] = true;
let _og = _oy[i].slice();
for (let _oz; (_oz = _o1z(_o12(_og[_og.length - 1]))) >= 0;) {
_o25[_oz] = true; let _o13 = _oy[_oz];
if (_o12(_o13[0]) !== _o12(_og[_og.length - 1])) _o13 = _o13.slice().reverse();
_og = _og.concat(_o13.slice(1));
}
for (let _oz; (_oz = _o1z(_o12(_og[0]))) >= 0;) {
_o25[_oz] = true; let _o13 = _oy[_oz];
if (_o12(_o13[_o13.length - 1]) !== _o12(_og[0])) _o13 = _o13.slice().reverse();
_og = _o13.slice(0, -1).concat(_og);
}
_o1d.push(_og);
}
return _o1d;
}
export function checkVietnam(lat, lon) {
if (!_o26(lat, lon)) return 'Toạ độ không hợp lệ.';
if (lat >= 6 && lat <= 24 && lon >= 101.5 && lon <= 118) return null;
return `Toạ độ (${_o1n(lat)}, ${_o1n(lon)}) nằm xa Việt Nam – anh/chị kiểm lại tên địa điểm.`;
}
export const normName = (_o1u) => String(_o1u == null ? '' : _o1u).normalize('NFC').toLowerCase().replace(/\s+/g, ' ').trim();
export function frameSize(size) {
if (size === 'landscape') return { w: 1920, h: 1080 };
if (!size || size === 'portrait' || typeof size !== 'object') return { w: 1080, h: 1920 };
const c = (v, _oj) => (_ow(v) ? Math.max(64, Math.min(4096, Math.round(v))) : _oj);
return { w: c(size.w, 1080), h: c(size.h, 1920) };
}
export function makeView(bbox, w, h, margin = 0) {
const a = mercator(bbox[2], bbox[1]), _o7 = mercator(bbox[0], bbox[3]);
const _om = Math.max(_o7.x - a.x, 1e-12), _on = Math.max(_o7.y - a.y, 1e-12);
const scale = Math.min((w - 2 * margin) / _om, (h - 2 * margin) / _on);
const _oh = (a.x + _o7.x) / 2, _oi = (a.y + _o7.y) / 2;
const toPx = (lat, lon) => { const m = mercator(lat, lon); return [(m.x - _oh) * scale + w / 2, (m.y - _oi) * scale + h / 2]; };
const fromPx = (x, y) => unmercator((x - w / 2) / scale + _oh, (y - h / 2) / scale + _oi);
return { toPx, fromPx, scale, w, h };
}
const _ou = (a, _o7) => a.x < _o7.x + _o7.w && _o7.x < a.x + a.w && a.y < _o7.y + _o7.h && _o7.y < a.y + a.h;
export function pickLabels(_oc, { w, h, gap: gap0 = 12, obstacles = [] } = {}) {
const _o1c = (_oc || []).map((c, i) => ({ c, i })).sort((_o1h, q) => (q.c.priority || 0) - (_o1h.c.priority || 0) || _o1h.i - q.i);
const _o20 = obstacles.slice(), _o1d = [];
for (const { c: c0 } of _o1c) {
const c = c0, gap = _ow(c0.gap) ? c0.gap : gap0;
const _o1k = [
[c.x + gap, c.y - c.h / 2], [c.x - gap - c.w, c.y - c.h / 2], [c.x - c.w / 2, c.y - gap - c.h], [c.x - c.w / 2, c.y + gap],
[c.x + gap, c.y - gap - c.h], [c.x + gap, c.y + gap], [c.x - gap - c.w, c.y - gap - c.h], [c.x - gap - c.w, c.y + gap]
];
for (const [x, y] of _o1k) {
const _o1m = { x, y, w: c.w, h: c.h };
if (x < 0 || y < 0 || x + c.w > w || y + c.h > h) continue;
if (_o20.some((t) => _ou(t, _o1m))) continue;
_o20.push(_o1m); _o1d.push({ ...c, rect: _o1m }); break;
}
}
return _o1d;
}
const _o1o = (ms) => new Promise((_o1m) => setTimeout(_o1m, ms));
export function createRateQueue({ intervalMs = 1000, now = () => Date.now(), sleep = _o1o } = {}) {
let _od = Promise.resolve(), last = -Infinity;
return {
run(fn) {
const _o1h = _od.then(async () => {
const _o27 = last + intervalMs - now();
if (_o27 > 0) await sleep(_o27);
last = now();
return fn();
});
_od = _o1h.catch(() => {});
return _o1h;
}
};
}
class NetError extends Error { constructor(code, msg, status) { super(msg || code); this.code = code; this.status = status; } }
async function _o21(fetchFn, url, init, timeoutMs, signal) {
if (signal && signal.aborted) throw new NetError('CANCEL');
const _oe = new AbortController();
let _o22 = false;
const onAbort = () => _oe.abort();
if (signal) signal.addEventListener('abort', onAbort, { once: true });
const _o23 = setTimeout(() => { _o22 = true; _oe.abort(); }, timeoutMs);
try {
const _o1p = await fetchFn(url, { ...init, signal: _oe.signal });
if (!_o1p || !_o1p.ok) throw new NetError('HTTP', 'HTTP ' + (_o1p && _o1p.status), _o1p && _o1p.status);
try { return await _o1p.json(); } catch { throw new NetError('BAD'); }
} catch (e) {
if (e instanceof NetError) throw e;
if (_o22) throw new NetError('TIMEOUT');
if ((signal && signal.aborted) || (e && e.name === 'AbortError')) throw new NetError('CANCEL');
throw new NetError('NETWORK', e && e.message);
} finally {
clearTimeout(_o23);
if (signal) signal.removeEventListener('abort', onAbort);
}
}
const _ok = (...a) => fetch(...a);
export function parseNominatim(arr, name) {
const _ox = (Array.isArray(arr) ? arr : []).find((x) => x && _o26(parseFloat(x.lat), parseFloat(x.lon)));
if (!_ox) return null;
const lat = parseFloat(_ox.lat), lon = parseFloat(_ox.lon);
const _o8 = (_ox.boundingbox || []).map(parseFloat);
const bbox = _o8.length === 4 && _o8.every(_ow) && _o8[0] <= _o8[1] && _o8[2] <= _o8[3] ? [_o8[0], _o8[2], _o8[1], _o8[3]] : padBBox([lat, lon, lat, lon], 0, 0.004);
return { name, lat, lon, bbox, source: 'nominatim', display: String(_ox.display_name || name) };
}
function _o16(e) {
switch (e && e.code) {
case 'TIMEOUT': return 'Máy chủ tìm địa điểm (OpenStreetMap) trả lời quá thời gian chờ. ' + LOCATE_FAIL;
case 'CANCEL': return 'Đã huỷ tìm địa điểm.';
case 'HTTP': return e.status === 429 || e.status === 403
? 'Máy chủ tìm địa điểm (OpenStreetMap) đang từ chối vì quá nhiều yêu cầu, anh/chị thử lại sau ít phút. ' + LOCATE_FAIL
: `Máy chủ tìm địa điểm báo lỗi (mã ${e.status}). ` + LOCATE_FAIL;
case 'BAD': return 'Máy chủ tìm địa điểm trả kết quả không đọc được. ' + LOCATE_FAIL;
default: return 'Mất mạng hoặc không kết nối được máy chủ tìm địa điểm (OpenStreetMap). ' + LOCATE_FAIL;
}
}
const _o1a = createRateQueue({ intervalMs: 1000 });
const _o19 = new Map();
export async function locate(placeNames, { fetchFn = _ok, signal, timeoutMs = _o0, queue = _o1a, cache = _o19, geocodeUrl = NOMINATIM_URL } = {}) {
const _o18 = (Array.isArray(placeNames) ? placeNames : [placeNames]).filter((_o1u) => normName(_o1u));
const _o1d = { places: [], notFound: [] }, warnings = [];
const base = /^https:\/\/[^\s]+$/.test(String(geocodeUrl || '')) ? String(geocodeUrl) : '';
let error = _o18.length && !base ? NO_GEOCODER : '';
for (const name of _o18) {
if (error) { _o1d.notFound.push(name); continue; }
const _o10 = normName(name);
let hitRes = cache.has(_o10) ? cache.get(_o10) : undefined;
if (hitRes === undefined) {
const url = base + '?' + new URLSearchParams({ q: String(name).trim(), format: 'jsonv2', limit: '1', countrycodes: 'vn', 'accept-language': 'vi', addressdetails: '0' });
try {
const json = await queue.run(() => _o21(fetchFn, url, { method: 'GET', credentials: 'omit', headers: { Accept: 'application/json' } }, timeoutMs, signal));
hitRes = parseNominatim(json, '');
cache.set(_o10, hitRes);
} catch (e) { error = _o16(e); _o1d.notFound.push(name); continue; }
}
if (!hitRes) { _o1d.notFound.push(name); continue; }
const _o1j = { ...hitRes, name, bbox: hitRes.bbox.slice() };
const _o28 = checkVietnam(_o1j.lat, _o1j.lon);
if (_o28) warnings.push(`"${name}": ${_o28}`);
_o1d.places.push(_o1j);
}
if (warnings.length) _o1d.warnings = warnings;
if (error) _o1d.error = error;
return _o1d;
}
export function buildOverpassQuery(bbox, kinds = ALL_KINDS, timeoutS = _o1) {
const _o7 = '(' + bbox.map(_o1n).join(',') + ')';
const _o10 = new Set(kinds && kinds.length ? kinds : ALL_KINDS), parts = [];
if (_o10.has('road')) parts.push(`way["highway"~"^(motorway|trunk|primary|secondary|tertiary)(_link)?$"]${_o7};`);
if (_o10.has('rail')) parts.push(`way["railway"="rail"]${_o7};`, `way["railway"="construction"]["construction"="rail"]${_o7};`);
if (_o10.has('metro')) parts.push(`way["railway"~"^(subway|light_rail|monorail)$"]${_o7};`, `way["railway"="construction"]["construction"~"^(subway|light_rail|monorail)$"]${_o7};`);
if (_o10.has('boundary')) parts.push(`relation["boundary"="administrative"]["admin_level"~"^(4|6|8)$"]${_o7};`);
if (_o10.has('water')) parts.push(`way["natural"="water"]${_o7};`, `way["waterway"~"^(river|canal)$"]${_o7};`);
if (_o10.has('park')) parts.push(`way["leisure"~"^(park|garden)$"]${_o7};`);
return `[out:json][timeout:${timeoutS}];\n(\n${parts.join('\n')}\n);\nout geom${_o7} qt;`;
}
const _o3 = { motorway: 0, trunk: 1, primary: 2, secondary: 3, tertiary: 4 };
function classify(t) {
if (!t) return null;
if (t.highway) { const base = String(t.highway).replace(/_link$/, ''); return base in _o3 ? { kind: 'road', level: _o3[base] } : null; }
if (t.railway) {
const _o1m = t.railway === 'construction' ? t.construction : t.railway, planned = t.railway === 'construction';
if (/^(subway|light_rail|monorail)$/.test(_o1m || '')) return { kind: 'metro', planned };
if (_o1m === 'rail') return { kind: 'rail', planned };
return null;
}
if (t.boundary === 'administrative') return { kind: 'boundary', level: Number(t.admin_level) || undefined };
if (t.natural === 'water' || /^(river|canal)$/.test(t.waterway || '')) return { kind: 'water' };
if (/^(park|garden)$/.test(t.leisure || '')) return { kind: 'park' };
return null;
}
const _or = (g) => (Array.isArray(g) ? g : []).filter((_o1h) => _o1h && _o26(_o1h.lat, _o1h.lon)).map((_o1h) => [_o1h.lat, _o1h.lon]);
export function parseOverpass(json, { tolerance = 0 } = {}) {
const _os = new Map(), loose = [];
for (const _oo of (json && Array.isArray(json.elements) ? json.elements : [])) {
const c = classify(_oo && _oo.tags);
if (!c) continue;
const name = String((_oo.tags['name:vi'] || _oo.tags.name || '')).trim();
let lines = [];
if (_oo.type === 'way') lines = [_or(_oo.geometry)];
else if (_oo.type === 'relation') lines = (_oo.members || []).filter((m) => m.type === 'way').map((m) => _or(m.geometry));
lines = lines.filter((_o13) => _o13.length >= 2);
if (!lines.length) continue;
const f = { kind: c.kind, name };
if (c.level !== undefined) f.level = c.level;
if (c.planned) f.planned = true;
const _o15 = c.kind !== 'water' && c.kind !== 'park';
if (_o15 && (name || _oo.type === 'relation')) {
const _o10 = [f.kind, name, f.level, !!f.planned, _oo.type === 'relation' ? _oo.id : ''].join('|');
if (!_os.has(_o10)) _os.set(_o10, { f, lines: [] });
_os.get(_o10).lines.push(...lines);
} else for (const _o13 of lines) loose.push({ ...f, geometry: _o13 });
}
const features = [];
for (const { f, lines } of _os.values()) for (const _o13 of mergeLines(lines)) features.push({ ...f, geometry: _o13 });
features.push(...loose);
if (tolerance > 0) for (const f of features) f.geometry = simplifyLine(f.geometry, tolerance);
return { features: features.filter((f) => f.geometry.length >= 2) };
}
function _o1f(e) {
switch (e && e.code) {
case 'TIMEOUT': return 'Máy chủ dữ liệu bản đồ (OpenStreetMap) trả lời quá thời gian chờ. ' + MAP_FAIL;
case 'CANCEL': return 'Đã huỷ tải bản đồ.';
case 'HTTP': return e.status === 429 || e.status === 504
? 'Máy chủ dữ liệu bản đồ (OpenStreetMap) đang bận vì quá nhiều yêu cầu. ' + MAP_FAIL
: `Máy chủ dữ liệu bản đồ báo lỗi (mã ${e.status}). ` + MAP_FAIL;
case 'BAD': return 'Máy chủ dữ liệu bản đồ trả kết quả không đọc được. ' + MAP_FAIL;
default: return 'Mất mạng hoặc không kết nối được máy chủ dữ liệu bản đồ (OpenStreetMap). ' + MAP_FAIL;
}
}
const _o1g = createRateQueue({ intervalMs: 1000 });
const _o1e = new Map();
export async function fetchFeatures(bbox, { fetchFn, signal, kinds = ALL_KINDS, timeoutMs = _o2, queue = _o1g, cache } = {}) {
const base = { features: [], source: 'overpass' };
if (!validBBox(bbox)) return { ...base, error: 'Vùng bản đồ không hợp lệ. ' + MAP_FAIL };
if (bboxArea(bbox) > HARD_MAX_BBOX_AREA) return { ...base, error: 'Vùng bản đồ quá rộng (cỡ cả tỉnh trở lên) – anh/chị chọn khu nhỏ hơn. ' + MAP_FAIL };
const { bbox: _o25, shrunk } = limitBBox(bbox);
const _o1x = cache || (fetchFn ? null : _o1e);
const _o1l = buildOverpassQuery(_o25, kinds);
const note = shrunk ? 'Vùng bản đồ rộng quá nên app đã thu nhỏ quanh tâm khu cần xem.' : undefined;
const _ol = (features) => ({ features, source: 'overpass', bbox: _o25, shrunk, ...(note ? { note } : {}) });
if (_o1x && _o1x.has(_o1l)) return _ol(_o1x.get(_o1l));
let json;
try {
json = await queue.run(() => _o21(fetchFn || _ok, OVERPASS_URL, {
method: 'POST', credentials: 'omit',
headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
body: 'data=' + encodeURIComponent(_o1l)
}, timeoutMs, signal));
} catch (e) { return { ...base, error: _o1f(e) }; }
if (json && json.remark && /runtime error|timed out|out of memory/i.test(json.remark) && !(json.elements || []).length) {
return { ...base, error: _o1f({ code: 'TIMEOUT' }) };
}
const _o1w = Math.max(_o25[2] - _o25[0], _o25[3] - _o25[1]);
const { features } = parseOverpass(json, { tolerance: _o1w / 2500 });
if (_o1x) _o1x.set(_o1l, features);
return _ol(features);
}
const FONT = 'system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const C = {
bg: '#f3efe6', park: '#cfe6c1', water: '#a7d0ee', waterLine: '#7fb6e0', boundary: '#8b5cf6',
roadCase: '#c9bfae', road: ['#e8892b', '#f0a43c', '#f7c95c', '#ffffff', '#ffffff'],
rail: '#5b5b5b', metro: '#d7263d', metroPlanned: '#d7263d', route: '#1d4ed8', pin: '#e11d48',
label: '#1f2937', labelBg: 'rgba(255,255,255,0.88)'
};
function _o1i(_of, v, g, close) {
_of.beginPath();
g.forEach(([la, lo], i) => { const [x, y] = v.toPx(la, lo); if (i) _of.lineTo(x, y); else _of.moveTo(x, y); });
if (close) _of.closePath();
}
const _ov = (g) => g.length > 3 && g[0][0] === g[g.length - 1][0] && g[0][1] === g[g.length - 1][1];
function _o17(v, g) {
const _o1h = g.map(([la, lo]) => v.toPx(la, lo));
let _o24 = 0; const seg = [];
for (let i = 1; i < _o1h.length; i++) { const _oj = Math.hypot(_o1h[i][0] - _o1h[i - 1][0], _o1h[i][1] - _o1h[i - 1][1]); seg.push(_oj); _o24 += _oj; }
let _ot = _o24 / 2;
for (let i = 1; i < _o1h.length; i++) { if (_ot <= seg[i - 1]) { const t = seg[i - 1] ? _ot / seg[i - 1] : 0; return { x: _o1h[i - 1][0] + t * (_o1h[i][0] - _o1h[i - 1][0]), y: _o1h[i - 1][1] + t * (_o1h[i][1] - _o1h[i - 1][1]), len: _o24 }; } _ot -= seg[i - 1]; }
return { x: _o1h[0][0], y: _o1h[0][1], len: _o24 };
}
function _o1q(route, places) {
const _oa = new Map(places.map((_o1h) => [normName(_o1h.name), _o1h]));
const pts = (Array.isArray(route) ? route : []).map((_o1m) => {
if (typeof _o1m === 'string') { const _o1h = _oa.get(normName(_o1m)); return _o1h ? [_o1h.lat, _o1h.lon] : null; }
if (Array.isArray(_o1m)) return _o26(_o1m[0], _o1m[1]) ? [_o1m[0], _o1m[1]] : null;
if (_o1m && _o26(_o1m.lat, _o1m.lon)) return [_o1m.lat, _o1m.lon];
return null;
}).filter(Boolean);
return pts.length >= 2 ? pts : places.map((_o1h) => [_o1h.lat, _o1h.lon]);
}
export async function drawArea(canvas, { places = [], bbox, mode = 'area', route, lang = 'vi', features, fetchFn, signal, kinds, size } = {}) {
void lang;
const _op = (error) => ({ ok: false, attribution, error });
const _of = canvas && typeof canvas.getContext === 'function' ? canvas.getContext('2d') : null;
if (!_of) return _op('Không có khung vẽ bản đồ trên máy này. ' + MAP_FAIL);
const { w, h } = frameSize(size);
const pts = (places || []).filter((_o1h) => _o1h && _o26(_o1h.lat, _o1h.lon));
let box = validBBox(bbox) ? bbox.slice() : null;
if (!box && pts.length) box = padBBox(bboxOf(pts.map((_o1h) => ({ lat: _o1h.lat, lon: _o1h.lon }))), 0.25, 0.012);
if (!box) return _op('Chưa có địa điểm hay toạ độ nào để vẽ bản đồ. Anh/chị nhập tên khu/toạ độ, hoặc tải ảnh bản đồ lên.');
const _o1b = [];
for (const _o1h of pts) { const _o29 = checkVietnam(_o1h.lat, _o1h.lon); if (_o29) _o1b.push(`"${_o1h.name}": ${_o29}`); }
let _oq = Array.isArray(features) ? features : null;
if (!_oq) {
const _o1m = await fetchFeatures(box, { fetchFn, signal, kinds });
if (_o1m.error) return _op(_o1m.error);
if (_o1m.note) _o1b.push(_o1m.note);
if (_o1m.shrunk) box = _o1m.bbox;
_oq = _o1m.features;
}
_oq = _oq.filter((f) => f && Array.isArray(f.geometry) && f.geometry.length >= 2);
if (!_oq.length) return _op('Không có dữ liệu đường, tuyến hay ranh giới cho khu này. ' + MAP_FAIL);
canvas.width = w; canvas.height = h;
const _o1u = Math.min(w, h) / 1080, margin = Math.round(60 * _o1u);
const v = makeView(box, w, h, margin);
_of.lineCap = 'round'; _of.lineJoin = 'round';
_of.fillStyle = C.bg; _of.fillRect(0, 0, w, h);
const of = (_o10) => _oq.filter((f) => f.kind === _o10);
const stroke = (g, color, width, dash) => { _o1i(_of, v, g, false); _of.setLineDash(dash || []); _of.strokeStyle = color; _of.lineWidth = width; _of.stroke(); };
for (const f of of('park')) { if (_ov(f.geometry)) { _o1i(_of, v, f.geometry, true); _of.fillStyle = C.park; _of.fill(); } else stroke(f.geometry, C.park, 6 * _o1u); }
for (const f of of('water')) { if (_ov(f.geometry)) { _o1i(_of, v, f.geometry, true); _of.fillStyle = C.water; _of.fill(); } else stroke(f.geometry, C.waterLine, 10 * _o1u); }
for (const f of of('boundary')) stroke(f.geometry, C.boundary, 4 * _o1u, [18 * _o1u, 10 * _o1u]);
const _o1s = of('road').sort((a, _o7) => (_o7.level ?? 4) - (a.level ?? 4));
const _o1r = (_o13) => [18, 15, 12, 9, 7][Math.max(0, Math.min(4, _o13 ?? 4))] * _o1u;
for (const f of _o1s) stroke(f.geometry, C.roadCase, _o1r(f.level) + 3 * _o1u);
for (const f of _o1s) stroke(f.geometry, C.road[Math.max(0, Math.min(4, f.level ?? 4))], _o1r(f.level));
for (const f of of('rail')) { stroke(f.geometry, C.rail, 6 * _o1u, f.planned ? [16 * _o1u, 12 * _o1u] : null); if (!f.planned) stroke(f.geometry, '#ffffff', 2.5 * _o1u, [14 * _o1u, 14 * _o1u]); }
for (const f of of('metro')) { stroke(f.geometry, '#ffffff', 16 * _o1u); stroke(f.geometry, f.planned ? C.metroPlanned : C.metro, 11 * _o1u, f.planned ? [26 * _o1u, 14 * _o1u] : null); }
if (mode === 'route') {
const _o1t = _o1q(route, pts);
if (_o1t.length >= 2) { stroke(_o1t, '#ffffff', 22 * _o1u); stroke(_o1t, C.route, 14 * _o1u, [1, 22 * _o1u]); stroke(_o1t, C.route, 8 * _o1u); }
}
_of.setLineDash([]);
_of.font = `500 ${Math.round(24 * _o1u)}px ${FONT}`;
const _o6 = _of.measureText(attribution).width, ah = Math.round(36 * _o1u), apad = Math.round(10 * _o1u);
const _o4 = { x: w - _o6 - 2 * apad - Math.round(16 * _o1u), y: h - ah - Math.round(16 * _o1u), w: _o6 + 2 * apad, h: ah };
const pinR = 16 * _o1u, obstacles = [_o4];
pts.forEach((_o1h, i) => {
const [x, y] = v.toPx(_o1h.lat, _o1h.lon);
obstacles.push({ x: x - pinR, y: y - pinR, w: 2 * pinR, h: 2 * pinR });
_of.beginPath(); _of.arc(x, y, pinR, 0, Math.PI * 2); _of.fillStyle = C.pin; _of.fill();
_of.lineWidth = 5 * _o1u; _of.strokeStyle = '#ffffff'; _of.stroke();
if (mode === 'route') { _of.font = `700 ${Math.round(18 * _o1u)}px ${FONT}`; _of.fillStyle = '#ffffff'; _of.textAlign = 'center'; _of.textBaseline = 'middle'; _of.fillText(String(i + 1), x, y); }
});
const _oc = [], pad = Math.round(10 * _o1u);
const _ob = (text, x, y, px, weight, priority, color, gap) => {
_of.font = `${weight} ${Math.round(px * _o1u)}px ${FONT}`;
_oc.push({ text, x, y, w: _of.measureText(text).width + 2 * pad, h: Math.round(px * _o1u * 1.5), priority, font: _of.font, color, gap });
};
pts.forEach((_o1h, i) => { const [x, y] = v.toPx(_o1h.lat, _o1h.lon); if (_o1h.name) _ob(String(_o1h.name), x, y, 40, 700, 1000 - i, C.label, pinR + 10 * _o1u); });
const _o14 = (list, px, pr, color) => {
const _o1v = new Set();
for (const f of list.map((f) => ({ f, m: _o17(v, f.geometry) })).sort((a, _o7) => _o7.m.len - a.m.len)) {
if (!f.f.name || _o1v.has(f.f.name) || f.m.len < 120 * _o1u) continue;
_o1v.add(f.f.name);
if (f.m.x < 0 || f.m.y < 0 || f.m.x > w || f.m.y > h) continue;
_ob(f.f.name, f.m.x, f.m.y, px, 600, pr, color);
}
};
_o14(of('metro'), 30, 200, C.metro);
_o14(_o1s.filter((f) => (f.level ?? 4) <= 2), 26, 100, C.label);
_of.textAlign = 'left'; _of.textBaseline = 'middle';
for (const L of pickLabels(_oc, { w, h, gap: Math.round(14 * _o1u), obstacles })) {
_of.fillStyle = C.labelBg; _of.fillRect(L.rect.x, L.rect.y, L.rect.w, L.rect.h);
_of.font = L.font; _of.fillStyle = L.color; _of.fillText(L.text, L.rect.x + pad, L.rect.y + L.rect.h / 2);
}
_of.fillStyle = 'rgba(255,255,255,0.9)'; _of.fillRect(_o4.x, _o4.y, _o4.w, _o4.h);
_of.font = `500 ${Math.round(24 * _o1u)}px ${FONT}`; _of.fillStyle = '#374151'; _of.textAlign = 'left'; _of.textBaseline = 'middle';
_of.fillText(attribution, _o4.x + apad, _o4.y + ah / 2);
return _o1b.length ? { ok: true, attribution, note: _o1b.join(' ') } : { ok: true, attribution };
}
export default { attribution, locate, fetchFeatures, drawArea };

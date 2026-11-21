import { SOURCE_STATE, SOURCE_LABEL, sourceState, withRules } from '../../../shared/ai_rules.js';
import { parseNum, fold } from '../_lib/sales.js';
import { normUnitType, bedroomsFromType, unitKey, UNIT_KIND, AREA_MIN, AREA_MAX } from '../_lib/layout_units.js';
import { normDir, safeUrl, hostOf } from '../g1_lib/logic.js';
export { SOURCE_STATE, SOURCE_LABEL };
export const STRUCT_VER = 1;
export const STRUCT_MARK = 'BDS_CATALOG_STRUCT';
export const NO_WEB_TEXT = 'Khoá hiện tại chưa tra được mạng. Anh/chị dán link hoặc tải tài liệu, hoặc tự nhập';
export const NO_FOUND_TEXT = 'Em chưa tìm được, anh/chị tự nhập giúp em';
export const MAX_ZONES = 20, MAX_TOWERS = 60, MAX_AXES = 40, MAX_FLOORS = 120, MAX_GEN = 3000;
export const ZONE_FIELDS = ['name', 'towers_count'];
export const TOWER_FIELDS = ['name', 'floors', 'units_per_floor'];
export const AXIS_FIELDS = ['axis', 'unit_type', 'bedrooms', 'area_carpet_m2', 'area_gross_m2', 'balcony_dir', 'door_dir', 'view'];
export const FIELD_LABEL = {
name: 'Tên', towers_count: 'Số toà', floors: 'Số tầng', units_per_floor: 'Số căn/tầng',
axis: 'Trục', unit_type: 'Loại căn', bedrooms: 'Phòng ngủ', area_carpet_m2: 'Thông thuỷ (m²)', area_gross_m2: 'Tim tường (m²)',
balcony_dir: 'Hướng ban công', door_dir: 'Hướng cửa', view: 'View',
};
const _o0 = { zone: ZONE_FIELDS, tower: TOWER_FIELDS, axis: AXIS_FIELDS };
const _o2 = (v) => v == null || (typeof v === 'string' && v.trim() === '');
const _ol = (_ot, _oj) => String(_ot == null ? '' : _ot).replace(/[\r\n\t|]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, _oj);
let _ov = 0;
export const newId = (_om = 'x') => _om + Date.now().toString(36) + (_ov++).toString(36) + Math.random().toString(36).slice(2, 5);
export function cleanValue(field, raw) {
if (_o2(raw)) return null;
const _oj = (lo, hi, int) => { const x = typeof raw === 'number' ? raw : parseNum(String(raw)); if (!isFinite(x) || x < lo || x > hi) return null; return int ? Math.round(x) : Math.round(x * 100) / 100; };
switch (field) {
case 'towers_count': return _oj(1, MAX_TOWERS, true);
case 'floors': return _oj(1, MAX_FLOORS, true);
case 'units_per_floor': return _oj(1, MAX_AXES, true);
case 'bedrooms': return _oj(0, 10, true);
case 'area_carpet_m2': case 'area_gross_m2': return _oj(AREA_MIN, AREA_MAX, false);
case 'unit_type': return normUnitType(raw) || null;
case 'balcony_dir': case 'door_dir': return normDir(raw);
case 'axis': return _ol(raw, 12) || null;
case 'name': return _ol(raw, 80) || null;
case 'view': return _ol(raw, 120) || null;
default: return null;
}
}
function _o5(_ot) {
if (!_ot || typeof _ot !== 'object') return null;
const by = ['ai', 'file', 'sale'].includes(_ot.by) ? _ot.by : 'ai';
const url = safeUrl(_ot.url);
const title = _ol(_ot.title, 160);
if (by !== 'sale' && !url && !title) return null;
return { url, title, by, at: Number(_ot.at) || 0 };
}
function _o4(kind, raw, prefix) {
const _ok = raw && typeof raw === 'object' ? raw : {};
const e = { id: _ol(_ok.id, 40) || newId(prefix) };
const src = {};
for (const f of _o0[kind]) {
e[f] = cleanValue(f, _ok[f]);
const _ot = e[f] == null ? null : _o5(_ok.src && _ok.src[f]);
if (_ot) src[f] = _ot;
}
e.src = src;
return e;
}
export function readStructure(data) {
let _o9 = data;
if (typeof _o9 === 'string') { try { _o9 = JSON.parse(_o9); } catch { _o9 = null; } }
const _ot = _o9 && typeof _o9 === 'object' ? _o9.structure : null;
const zones = (_ot && Array.isArray(_ot.zones) ? _ot.zones : []).slice(0, MAX_ZONES).map((z) => {
const zone = _o4('zone', z, 'z');
zone.towers = (z && Array.isArray(z.towers) ? z.towers : []).slice(0, MAX_TOWERS).map((t) => {
const tower = _o4('tower', t, 't');
tower.axes = (t && Array.isArray(t.axes) ? t.axes : []).slice(0, MAX_AXES).map((a) => _o4('axis', a, 'a'));
return tower;
});
return zone;
});
return { v: STRUCT_VER, zones };
}
export function writeStructure(data, st) {
const _o9 = { ...(data && typeof data === 'object' ? data : {}) };
_o9.structure = readStructure({ structure: st });
return _o9;
}
export function cellSource(ent, field) { return (ent && ent.src && ent.src[field]) || null; }
export function cellState(ent, field) {
const v = ent ? ent[field] : null;
const _ot = cellSource(ent, field);
if (!_ot) return sourceState({ value: v, by: undefined, source: '' });
return sourceState({ value: v, source: _ot.url || _ot.title, by: _ot.by === 'sale' ? 'sale' : undefined });
}
export const cellLabel = (ent, field) => SOURCE_LABEL[cellState(ent, field)];
export function stateCounts(st) {
const _o3 = { sourced: 0, manual: 0, empty: 0 };
for (const z of st.zones) {
for (const f of ZONE_FIELDS) _o3[cellState(z, f)]++;
for (const t of z.towers) {
for (const f of TOWER_FIELDS) _o3[cellState(t, f)]++;
for (const a of t.axes) for (const f of AXIS_FIELDS) _o3[cellState(a, f)]++;
}
}
return _o3;
}
const _o6 = (st) => readStructure({ structure: JSON.parse(JSON.stringify(st || { zones: [] })) });
export function setCells(kind, ent, patch, meta = {}) {
const e = { ...ent, src: { ...(ent && ent.src) } };
for (const f of _o0[kind]) {
if (!patch || !Object.prototype.hasOwnProperty.call(patch, f)) continue;
const v = cleanValue(f, patch[f]);
if (JSON.stringify(v) === JSON.stringify(e[f] ?? null)) continue;
e[f] = v;
if (v == null) { delete e.src[f]; continue; }
const _ot = _o5({ by: meta.by || 'sale', url: meta.url, title: meta.title, at: meta.at });
if (_ot) e.src[f] = _ot; else delete e.src[f];
}
return e;
}
export function findEntity(st, id) {
for (const z of st.zones) {
if (z.id === id) return { kind: 'zone', ent: z, zone: z, tower: null };
for (const t of z.towers) {
if (t.id === id) return { kind: 'tower', ent: t, zone: z, tower: t };
for (const a of t.axes) if (a.id === id) return { kind: 'axis', ent: a, zone: z, tower: t };
}
}
return null;
}
export function addZone(st, patch = {}, meta = {}) {
const _ot = _o6(st);
if (_ot.zones.length >= MAX_ZONES) return { st: _ot, id: null, error: `Tối đa ${MAX_ZONES} phân khu` };
const z = { ...setCells('zone', { id: newId('z'), name: null, towers_count: null, src: {} }, patch, meta), towers: [] };
_ot.zones.push(z);
return { st: _ot, id: z.id };
}
export function addTower(st, zoneId, patch = {}, meta = {}) {
const _ot = _o6(st);
const z = _ot.zones.find((x) => x.id === zoneId);
if (!z) return { st: _ot, id: null, error: 'Chưa chọn phân khu' };
if (z.towers.length >= MAX_TOWERS) return { st: _ot, id: null, error: `Tối đa ${MAX_TOWERS} toà mỗi phân khu` };
const t = { ...setCells('tower', { id: newId('t'), name: null, floors: null, units_per_floor: null, src: {} }, patch, meta), axes: [] };
z.towers.push(t);
return { st: _ot, id: t.id };
}
export function addAxis(st, towerId, patch = {}, meta = {}) {
const _ot = _o6(st);
const f = findEntity(_ot, towerId);
if (!f || f.kind !== 'tower') return { st: _ot, id: null, error: 'Chưa chọn toà' };
if (f.tower.axes.length >= MAX_AXES) return { st: _ot, id: null, error: `Tối đa ${MAX_AXES} trục mỗi toà` };
const a = setCells('axis', { id: newId('a'), src: {}, ...Object.fromEntries(AXIS_FIELDS.map((_oe) => [_oe, null])) }, patch, meta);
if (patch.unit_type && a.bedrooms == null && _o2(patch.bedrooms)) {
const _o1 = bedroomsFromType(a.unit_type);
if (_o1 != null) a.bedrooms = _o1, a.src.bedrooms = a.src.unit_type;
}
f.tower.axes.push(a);
return { st: _ot, id: a.id };
}
export function updateEntity(st, id, patch, meta = {}) {
const _ot = _o6(st);
const f = findEntity(_ot, id);
if (!f) return { st: _ot, ok: false };
const next = setCells(f.kind, f.ent, patch, meta);
Object.assign(f.ent, next);
return { st: _ot, ok: true };
}
export function removeEntity(st, id) {
const _ot = _o6(st);
_ot.zones = _ot.zones.filter((z) => z.id !== id);
for (const z of _ot.zones) {
z.towers = z.towers.filter((t) => t.id !== id);
for (const t of z.towers) t.axes = t.axes.filter((a) => a.id !== id);
}
return _ot;
}
export function structStats(st) {
let towers = 0, axes = 0;
for (const z of st.zones) { towers += z.towers.length; for (const t of z.towers) axes += t.axes.length; }
return { zones: st.zones.length, towers, axes };
}
export function parseFloors(text) {
const out = new Set();
for (const _oo of String(text || '').split(/[,;\s]+/)) {
const _oi = _oo.match(/^(\d{1,3})(?:-(\d{1,3}))?$/);
if (!_oi) continue;
const a = Number(_oi[1]), _o1 = _oi[2] ? Number(_oi[2]) : a;
for (let _od = Math.min(a, _o1); _od <= Math.max(a, _o1) && _od <= MAX_FLOORS; _od++) out.add(_od);
}
return [...out].sort((x, y) => x - y);
}
export function floorList({ from, to, exclude = '' } = {}) {
const a = Math.round(Number(from)), _o1 = Math.round(Number(to));
if (!(a >= 0) || !(_o1 >= a) || _o1 > MAX_FLOORS) return [];
const _oa = new Set(Array.isArray(exclude) ? exclude.map(Number) : parseFloors(exclude));
const out = [];
for (let _od = a; _od <= _o1; _od++) if (!_oa.has(_od)) out.push(_od);
return out;
}
const _on = (x) => (/^\d$/.test(String(x)) ? '0' + x : String(x));
export function unitCode(towerName, floor, axis) {
const t = _ol(towerName, 20);
return (t ? t + '-' : '') + _on(String(floor)) + _on(_ol(axis, 12));
}
export function axisFromCode(_o7) {
const _ot = String(_o7 || '').trim();
const _oi = _ot.match(/(\d+)\D*$/);
if (!_oi) return _ol(_ot, 12);
const _o9 = _oi[1];
return _o9.length >= 3 ? _o9.slice(-2) : _on(_o9);
}
export function generateUnits(zone, tower, range) {
const floors = floorList(range);
if (!floors.length) return { units: [], error: 'Khoảng tầng chưa hợp lệ (từ tầng ≤ đến tầng, tối đa ' + MAX_FLOORS + ')' };
const axes = (tower && tower.axes ? tower.axes : []).filter((a) => !_o2(a.axis));
if (!axes.length) return { units: [], error: 'Toà chưa có trục căn nào có số trục – thêm trục trước' };
if (floors.length * axes.length > MAX_GEN) return { units: [], error: `Quá nhiều căn (${floors.length * axes.length}) – chia nhỏ khoảng tầng (tối đa ${MAX_GEN} căn mỗi lần)` };
const units = [];
for (const f of floors) for (const a of axes) {
const _o7 = unitCode(tower.name, f, a.axis);
units.push({ key: unitKey(_o7), unit_code: _o7, floor: f, axis: a.axis, zone: zone ? zone.name || '' : '', tower: tower.name || '',
unit_type: a.unit_type || '', bedrooms: a.bedrooms, area_carpet_m2: a.area_carpet_m2, area_gross_m2: a.area_gross_m2,
balcony_dir: a.balcony_dir, door_dir: a.door_dir, view: a.view || '' });
}
return { units, error: '' };
}
export function markExisting(units, objects, projectId) {
const _ob = new Set();
for (const _ok of objects || []) {
if (!_ok || _ok.kind !== UNIT_KIND || Number(_ok.deleted)) continue;
let _o9 = _ok.data; if (typeof _o9 === 'string') { try { _o9 = JSON.parse(_o9); } catch { _o9 = {}; } }
if (!_o9 || String(_o9.project_id || '') !== String(projectId)) continue;
const _oe = unitKey(_o9.unit_code); if (_oe) _ob.add(_oe);
}
const _ou = new Set();
return (units || []).map((u) => {
const _oe = unitKey(u.unit_code);
const dup = !_oe || _ob.has(_oe) || _ou.has(_oe);
if (_oe) _ou.add(_oe);
return { ...u, key: _oe, dup };
});
}
export const ASK_KEYS = { zones: 'Phân khu', towers: 'Số toà, tên toà', floors: 'Số tầng, số căn/tầng', axes: 'Trục căn (loại, m², hướng, view)' };
export function structureAsk(ask = {}) {
const _oz = Object.keys(ASK_KEYS).filter((_oe) => ask[_oe]);
if (!_oz.length) return '';
const L = [STRUCT_MARK, 'Tìm thêm CẤU TRÚC dự án (' + _oz.map((_oe) => ASK_KEYS[_oe]).join('; ') + '). Mỗi dòng PHẢI có link nguồn https://… nơi thấy đúng thông tin đó; không có nguồn thì KHÔNG viết dòng.'];
if (ask.zones || ask.towers) L.push('ZONE | <tên phân khu> | <số toà của phân khu hoặc để trống> | <link nguồn>');
if (ask.towers || ask.floors) L.push('TOWER | <tên phân khu hoặc để trống> | <tên toà> | <số tầng hoặc để trống> | <số căn mỗi tầng hoặc để trống> | <link nguồn>');
if (ask.axes) L.push('AXIS | <tên toà> | <số trục> | <loại căn 1N/1N+1/2N…> | <số phòng ngủ> | <m² thông thuỷ> | <m² tim tường> | <hướng ban công> | <hướng cửa> | <view> | <link nguồn>');
L.push('Ô nào nguồn không ghi thì để trống giữa hai dấu |, không đoán, không lấy số của dự án khác.');
return L.join('\n');
}
export function structurePrompt(project, ask = {}, hint = '') {
const _om = project || {};
const h = _ol(hint, 300);
return withRules([
'BDS_G1_RESEARCH',
`Tìm trên Google cấu trúc dự án bất động sản "${_ol(_om.name, 120)}"${_om.dev ? ' của ' + _ol(_om.dev, 120) : ''}${_om.loc ? ' (' + _ol(_om.loc, 160) + ')' : ''}${h ? ' – môi giới ghi thêm: ' + h : ''}.`,
'Ưu tiên nguồn chính thức: trang chủ đầu tư, cổng thông tin Sở Xây dựng/UBND, báo chính thống. Không dùng tin rao vặt, không đoán.',
'Chỉ viết các dòng theo mẫu dưới đây (không markdown, không chữ khác).',
structureAsk(ask),
].filter(Boolean).join('\n'));
}
function _og(urlRaw, grounding) {
const _oi = String(urlRaw || '').match(/https?:\/\/[^\s<>"')|]+/i);
const url = _oi ? safeUrl(_oi[0].replace(/[.,;]+$/, '')) : '';
if (!url) return null;
const h = hostOf(url);
const _oc = (grounding && Array.isArray(grounding.sources) ? grounding.sources : []).find((_ot) => {
const t = String((_ot && _ot.title) || '').toLowerCase().replace(/^www\./, '');
return _ot && (hostOf(_ot.url) === h || (t && (t === h || h.endsWith('.' + t))));
});
return { url, title: h, status: _oc ? 'grounded' : 'ai_only' };
}
export function parseStructureLines(text, grounding = {}, { via = 'api', now = 0 } = {}) {
const noWeb = via === 'api' && !(grounding && Array.isArray(grounding.sources) && grounding.sources.some((_ot) => _ot && safeUrl(_ot.url)));
let st = { v: STRUCT_VER, zones: [] };
let kept = 0, dropped = 0;
const _oh = String(text || '').split(/\r?\n/).map((_of) => _of.replace(/^[ \t>*-]+/, '')).filter((_of) => /^(ZONE|TOWER|AXIS)\s*\|/i.test(_of));
if (noWeb) return { st, kept: 0, dropped: _oh.length, noWeb: true };
let src = {};
const zoneOf = (name) => {
const _oe = fold(name);
let z = st.zones.find((x) => fold(x.name || '') === _oe);
if (!z) { const _or = addZone(st, {}, {}); st = _or.st; z = st.zones.find((x) => x.id === _or.id); if (_oe) { const u = updateEntity(st, z.id, { name }, src); st = u.st; z = st.zones.find((x) => x.id === _or.id); } }
return z;
};
const _ow = (zoneName, name) => {
const _oe = fold(name);
for (const z of st.zones) { const t = z.towers.find((x) => _oe && fold(x.name || '') === _oe); if (t) return t; }
const z = zoneOf(zoneName || '');
const _or = addTower(st, z.id, _oe ? { name } : {}, src); st = _or.st;
return findEntity(st, _or.id).ent;
};
for (const _of of _oh) {
const _op = _of.split('|').map((x) => x.trim());
const kind = _op[0].toUpperCase();
const _ot = _og(_op[_op.length - 1], grounding);
if (!_ot) { dropped++; continue; }
src = { by: 'ai', url: _ot.url, title: _ot.title, at: now };
if (kind === 'ZONE' && _op.length >= 4) {
if (!cleanValue('name', _op[1])) { dropped++; continue; }
const z = zoneOf(_op[1]);
st = updateEntity(st, z.id, { name: _op[1], towers_count: _op[2] }, src).st;
kept++;
} else if (kind === 'TOWER' && _op.length >= 6) {
if (!cleanValue('name', _op[2])) { dropped++; continue; }
const t = _ow(_op[1], _op[2]);
st = updateEntity(st, t.id, { name: _op[2], floors: _op[3], units_per_floor: _op[4] }, src).st;
kept++;
} else if (kind === 'AXIS' && _op.length >= 11) {
if (!cleanValue('axis', _op[2])) { dropped++; continue; }
const t = _ow('', _op[1]);
const patch = { axis: _op[2], unit_type: _op[3], bedrooms: _op[4], area_carpet_m2: _op[5], area_gross_m2: _op[6], balcony_dir: _op[7], door_dir: _op[8], view: _op[9] };
const _oa = t.axes.find((a) => fold(a.axis || '') === fold(cleanValue('axis', _op[2])));
st = _oa ? updateEntity(st, _oa.id, patch, src).st : addAxis(st, t.id, patch, src).st;
kept++;
} else dropped++;
}
return { st, kept, dropped, noWeb: false };
}
export function hasCells(st) { const _o3 = stateCounts(st); return _o3.sourced + _o3.manual > 0; }
export function mergeStructure(cur, inc) {
let st = _o6(cur);
let filled = 0;
const _oq = (kind, target, src) => {
for (const f of _o0[kind]) {
if (src[f] == null) continue;
if (target && target[f] != null && cellState(target, f) === SOURCE_STATE.MANUAL) continue;
if (target && JSON.stringify(target[f]) === JSON.stringify(src[f])) continue;
const _ot = cellSource(src, f) || {};
st = updateEntity(st, target.id, { [f]: src[f] }, _ot).st;
filled++;
}
};
for (const z of (inc && inc.zones) || []) {
let tz = z.name ? st.zones.find((x) => fold(x.name || '') === fold(z.name)) : (st.zones.length === 1 ? st.zones[0] : null);
if (!tz) { const _or = addZone(st); st = _or.st; tz = findEntity(st, _or.id).ent; }
_oq('zone', tz, z);
for (const t of z.towers) {
let tt = null;
for (const _o10 of st.zones) { tt = tt || _o10.towers.find((x) => t.name && fold(x.name || '') === fold(t.name)); }
if (!tt && !t.name) { const _ox = findEntity(st, tz.id).ent; if (_ox.towers.length === 1) tt = _ox.towers[0]; }
if (!tt) { const _or = addTower(st, tz.id); st = _or.st; tt = findEntity(st, _or.id).ent; }
_oq('tower', tt, t);
for (const a of t.axes) {
const _o8 = findEntity(st, tt.id).ent;
let ta = _o8.axes.find((x) => a.axis && fold(x.axis || '') === fold(a.axis));
if (!ta) { const _or = addAxis(st, tt.id); st = _or.st; ta = findEntity(st, _or.id).ent; }
_oq('axis', ta, a);
}
}
}
return { st, filled };
}
export function layoutToAxes(normalized, { imageName = '', now = 0 } = {}) {
const units = normalized && Array.isArray(normalized.units) ? normalized.units : [];
const title = _ol(imageName, 160) || 'ảnh layout';
const out = [], _ou = new Set();
for (const u of units) {
const axis = cleanValue('axis', axisFromCode(u.unit_code));
if (!axis || _ou.has(axis)) continue;
_ou.add(axis);
const _os = { id: newId('a'), src: {} };
const _oy = { axis, unit_type: u.unit_type, bedrooms: u.bedrooms, area_carpet_m2: u.area_carpet_m2 ?? (u.area_kind === 'thong_thuy' ? u.area_m2 : null),
area_gross_m2: u.area_gross_m2, balcony_dir: u.balcony_dir, door_dir: u.door_dir, view: u.view };
for (const f of AXIS_FIELDS) {
_os[f] = cleanValue(f, _oy[f]);
if (_os[f] != null) _os.src[f] = { url: '', title, by: 'file', at: now };
}
_os.unit_code = String(u.unit_code || '');
out.push(_os);
}
return out.sort((a, _o1) => String(a.axis).localeCompare(String(_o1.axis), 'vi', { numeric: true }));
}
export function applyAxes(st, towerId, axes) {
const f = findEntity(st, towerId);
if (!f || f.kind !== 'tower') return { st: _o6(st), filled: 0 };
let _ot = _o6(st);
let filled = 0;
for (const a of axes) {
const t = findEntity(_ot, towerId).ent;
let ta = t.axes.find((x) => a.axis && fold(x.axis || '') === fold(a.axis));
if (!ta) { const _or = addAxis(_ot, towerId); _ot = _or.st; ta = findEntity(_ot, _or.id).ent; }
for (const _oe of AXIS_FIELDS) {
if (a[_oe] == null) continue;
if (ta[_oe] != null && cellState(ta, _oe) === SOURCE_STATE.MANUAL) continue;
if (JSON.stringify(ta[_oe]) === JSON.stringify(a[_oe])) continue;
_ot = updateEntity(_ot, ta.id, { [_oe]: a[_oe] }, cellSource(a, _oe) || { by: 'file' }).st;
filled++;
}
}
return { st: _ot, filled };
}

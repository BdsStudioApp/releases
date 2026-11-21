import { fold } from './sales.js';
export const UNIT_KIND = 'g1_unit';
export const REVIEW = { ai: 'ai_chua_soat', ok: 'đã xác nhận' };
export const STATUS_LABEL = { ai_chua_soat: 'AI đọc – chưa soát', 'đã xác nhận': 'Đã xác nhận' };
export const MAX_UNITS = 60;
export const AREA_MIN = 10, AREA_MAX = 1000;
export const UNIT_FIELDS = ['unit_code', 'unit_type', 'bedrooms', 'wc', 'area_carpet_m2', 'area_gross_m2', 'area_m2', 'area_kind', 'corner', 'north_arrow',
'balcony_dir', 'door_dir', 'view', 'notes', 'confidence'];
const _o2 = (v) => v == null || v === '';
const parseData = (o) => { let d = o && o.data; if (typeof d === 'string') { try { d = JSON.parse(d); } catch { d = {}; } } return d && typeof d === 'object' ? d : {}; };
export function normUnitType(v) {
const _oi = String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
if (!_oi) return '';
const _o6 = fold(_oi);
if (/^studio$/.test(_o6)) return 'Studio';
const _od = _o6.match(/^(\d{1,2}) ?(?:pn|n|br|bed(?:room)?s?|phong ngu|p ngu) ?(\+ ?(\d)?)?$/);
if (_od) return _od[1] + 'N' + (_od[2] ? '+' + (_od[3] || '') : '');
return _oi.slice(0, 40);
}
export function bedroomsFromType(t) { const _od = /^(\d{1,2})N$/.exec(String(t || '')); return _od ? Number(_od[1]) : null; }
export function unitKey(code) {
return fold(code).replace(/^can\s+/, '').replace(/[^a-z0-9]/g, '').toUpperCase();
}
const _o0 = ['du an', 'khu do thi', 'kdt', 'khu dan cu', 'kdc', 'chung cu', 'can ho', 'toa nha', 'toa', 'block', 'cong trinh', 'project', 'the', 'phan khu'];
export function projectKey(s) {
let _o6 = ' ' + fold(s).replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
for (const _om of _o0) _o6 = _o6.split(' ' + _om + ' ').join(' ');
return _o6.replace(/\s+/g, ' ').trim();
}
const _on = (hay, needle) => (' ' + hay + ' ').includes(' ' + needle + ' ');
export function matchProjectName(name, projects) {
const _oe = { status: 'none', project: null, candidates: [] };
const _oh = projectKey(name);
if (_oh.length < 3) return _oe;
const list = (projects || []).filter((p) => p && p.id).map((p) => ({ p, k: projectKey(p.name || p.id) })).filter((x) => x.k.length >= 3);
const _o5 = list.filter((x) => x.k === _oh);
if (_o5.length === 1) return { status: 'match', project: _o5[0].p, candidates: [_o5[0].p] };
if (_o5.length > 1) return { status: 'ambiguous', project: null, candidates: _o5.map((x) => x.p) };
const _oa = list.filter((x) => _on(_oh, x.k)).sort((a, b) => b.k.length - a.k.length);
if (_oa.length) {
const _ok = _oa[0];
if (_oa.every((x) => x === _ok || _on(_ok.k, x.k)) && (_oa.length === 1 || _oa[1].k.length < _ok.k.length)) return { status: 'match', project: _ok.p, candidates: [_ok.p] };
return { status: 'ambiguous', project: null, candidates: _oa.map((x) => x.p) };
}
const _ob = list.filter((x) => _on(x.k, _oh));
if (_ob.length === 1) return { status: 'match', project: _ob[0].p, candidates: [_ob[0].p] };
if (_ob.length > 1) return { status: 'ambiguous', project: null, candidates: _ob.map((x) => x.p) };
return _oe;
}
export function unitView(o) {
const d = parseData(o);
const kind = d.area_kind;
const _o4 = !_o2(d.area_carpet_m2) ? Number(d.area_carpet_m2) : (kind === 'thong_thuy' && !_o2(d.area_m2) ? Number(d.area_m2) : null);
const _o7 = !_o2(d.area_gross_m2) ? Number(d.area_gross_m2) : (kind === 'tim_tuong' && !_o2(d.area_m2) ? Number(d.area_m2) : null);
const _ol = kind !== 'thong_thuy' && kind !== 'tim_tuong' && !_o2(d.area_m2) && _o4 == null && _o7 == null ? Number(d.area_m2) : null;
const status = STATUS_LABEL[o && o.status] ? o.status : (STATUS_LABEL[d.review] ? d.review : REVIEW.ok);
return {
id: o && o.id, row: o, data: d, project_id: String(d.project_id || ''),
unit_code: String(d.unit_code || ''), unit_type: String(d.unit_type || (o && o.unit_type) || ''),
bedrooms: _o2(d.bedrooms) ? null : Number(d.bedrooms), wc: _o2(d.wc) ? null : Number(d.wc),
area_carpet_m2: _o4, area_gross_m2: _o7, area_m2: _ol, area_kind: _ol != null ? 'khong_ro' : undefined,
corner: d.corner === true || d.corner === false ? d.corner : null, north_arrow: d.north_arrow === true,
balcony_dir: d.balcony_dir || null, door_dir: d.door_dir || null, view: String(d.view || ''), notes: String(d.notes || ''),
confidence: _o2(d.confidence) ? null : Number(d.confidence),
image_name: String(d.image_name || ''), status,
zone: String(d.zone || ''), tower: String(d.tower || ''), floor: _o2(d.floor) ? null : Number(d.floor), axis: String(d.axis || ''), origin: String(d.origin || ''), label: STATUS_LABEL[status], updated_at: Number(o && o.updated_at) || 0,
};
}
const _oc = (o) => o && o.kind === UNIT_KIND && !Number(o.deleted);
const _o3 = (a, b) => (a.unit_code || '￿').localeCompare(b.unit_code || '￿', 'vi', { numeric: true }) || b.updated_at - a.updated_at;
export function projectUnits(objects, projectId) {
return (objects || []).filter(_oc).map(unitView).filter((u) => u.project_id === String(projectId)).sort(_o3);
}
const _og = (u) => Object.fromEntries(UNIT_FIELDS.map((k) => [k, u[k] === undefined ? null : u[k]]));
export function mergeUnit(prev, next) {
const _of = _og(prev || {});
for (const k of UNIT_FIELDS) if (!_o2(next[k]) && !(k === 'north_arrow' && next[k] === false && _of[k] === true)) _of[k] = next[k];
if (!_o2(_of.unit_code) && !_o2(prev && prev.unit_code)) _of.unit_code = prev.unit_code;
if (_of.area_carpet_m2 != null || _of.area_gross_m2 != null) { _of.area_m2 = null; _of.area_kind = null; }
return _of;
}
const _oj = (a, b) => UNIT_FIELDS.filter((k) => k !== 'confidence' && k !== 'notes').every((k) => JSON.stringify(_o2(a[k]) ? null : a[k]) === JSON.stringify(_o2(b[k]) ? null : b[k]));
export function planUnitSaves(units, existing, projectId) {
const _o9 = new Map();
for (const o of existing || []) {
if (!_oc(o)) continue;
const v = unitView(o);
if (v.project_id !== String(projectId)) continue;
const k = unitKey(v.unit_code);
if (k && !_o9.has(k)) _o9.set(k, { o, v });
}
return (units || []).map((u) => {
const k = unitKey(u.unit_code);
const _o8 = k ? _o9.get(k) : null;
if (!_o8) return { action: 'insert', unit: u, merged: _og(u), prev: null, changed: true };
const _o1 = _og(_o8.v), merged = mergeUnit(_o8.v, u);
return { action: 'update', unit: u, merged, prev: _o8.o, changed: !_oj(_o1, merged) };
});
}
export function planSummary(plan) {
return { updated: plan.filter((p) => p.action === 'update').length, inserted: plan.filter((p) => p.action === 'insert').length,
noCode: plan.filter((p) => !unitKey(p.unit.unit_code)).length };
}
export function unitName(unit, project, imageName) {
if (!_o2(unit.unit_code)) return 'Căn ' + unit.unit_code + (project ? ' – ' + project.name : '');
return 'Căn ? (ảnh ' + (imageName || 'không tên') + ')';
}
export function unitRecord({ id, project, unit, imageName, provider, now, by, status = REVIEW.ai, prev = null, extra = null }) {
const u = _og(unit);
if (_o2(u.area_m2)) { delete u.area_m2; delete u.area_kind; }
const prevData = prev ? parseData(prev) : {};
const data = { ...prevData, project_id: project ? project.id : String(prevData.project_id || ''), ...u, review: status,
image_name: imageName || prevData.image_name || '', ai: provider || prevData.ai || '' };
if (extra && typeof extra === 'object') for (const k of ['zone', 'tower', 'floor', 'axis', 'origin']) if (!_o2(extra[k])) data[k] = extra[k];
if (status === REVIEW.ai) { data.read_at = now; data.read_by = by || ''; delete data.confirmed_at; delete data.confirmed_by; }
else { data.confirmed_at = now; data.confirmed_by = by || ''; }
return { ...(prev || {}), id: prev ? prev.id : id, kind: UNIT_KIND, name: unitName(u, project, imageName), project: project ? project.name : '',
unit_type: u.unit_type || (u.bedrooms != null ? u.bedrooms + 'PN' : ''), status, data: JSON.stringify(data), deleted: 0 };
}

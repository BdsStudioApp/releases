import { norm } from './ideas.js';
const D = 24 * 3600e3;
export const UNVERIFIED = 'chưa kiểm chứng';
export const AREAS = [
{ id: 'ocean_park', label: 'Gia Lâm / Long Biên', province: 'Hà Nội', projectAreas: [],
kw: ['gia lam', 'van giang', 'van lam', 'trau quy', 'long bien', 'vinh tuy', 'thanh tri', 'me so', 'quoc lo 5', 'duong 5'] },
{ id: 'global_gate', label: 'Cổ Loa / Đông Anh', province: 'Hà Nội', projectAreas: [],
kw: ['co loa', 'dong anh', 'tu lien', 'cau tu lien', 'me linh', 'soc son', 'bac thang long', 'nhat tan', 'vinh ngoc'] },
{ id: 'tay_ho_tay', label: 'Tây Hồ / Bắc Từ Liêm', province: 'Hà Nội', projectAreas: [],
kw: ['tay ho', 'tay ho', 'xuan la', 'thuy khue', 'vo chi cong', 'bac tu liem', 'nhat tan', 'tu lien'] },
{ id: 'noi_do', label: 'Nội đô', province: 'Hà Nội', projectAreas: ['Nội đô'],
kw: ['noi do', 'hoan kiem', 'ba dinh', 'dong da', 'hai ba trung', 'thanh xuan', 'cau giay', 'nguyen trai', 'cao xa la', 'me tri', 'vanh dai 1', 'vanh dai 2'] },
{ id: 'smart_city', label: 'Tây Mỗ / Nam Từ Liêm', province: 'Hà Nội', projectAreas: [],
kw: ['tay mo', 'dai mo', 'nam tu liem', 'dai lo thang long'] },
];
const _o1 = new Set(AREAS.flatMap(a => a.projectAreas));
const has = (_ob, kw) => (' ' + _ob + ' ').includes(' ' + kw + ' ');
const pd = s => { if (s && typeof s === 'object') return s; try { return JSON.parse(s || '{}') || {}; } catch { return {}; } };
const _o6 = s => /^https?:\/\/\S+$/i.test(String(s || '').trim());
const _o9 = _oh => _oh && !Number(_oh.deleted);
const _oc = _ob => String(_ob).padStart(2, '0');
const dmy = ms => { const _o4 = new Date(ms); return _oc(_o4.getDate()) + '/' + _oc(_o4.getMonth() + 1) + '/' + _o4.getFullYear(); };
export const LS_CUSTOM_AREA = 'bds.market.custom_area';
export const CUSTOM_PREFIX = 'custom:';
const _o0 = /^(thanh pho|tp|tinh|quan|huyen|thi xa|thi tran|phuong|xa|khu do thi|kdt)\s+/;
export function customArea(place) {
const label = String((place && place.label) || '').replace(/\s+/g, ' ').trim().slice(0, 80);
const _ob = norm(label);
if (!_ob) return null;
const _oj = _ob.replace(_o0, '');
const kw = [...new Set([_ob, _oj].filter(Boolean))];
const _ol = String((place && place.tinh_thanh) || '').trim().slice(0, 60);
return { id: CUSTOM_PREFIX + _ob.replace(/ /g, '-'), label, tinh_thanh: _ol, province: _ol,
projectAreas: [], kw, keywords: kw, custom: true };
}
export const isCustom = a => !!(a && typeof a === 'object' && a.custom);
export const areaOf = id => (isCustom(id) ? id : AREAS.find(a => a.id === (id && typeof id === 'object' ? id.id : id)) || AREAS[0]);
export const areaProvince = id => { const a = isCustom(id) ? id : AREAS.find(x => x.id === id) || {}; return String(a.province || a.tinh_thanh || ''); };
export function projectsIn(areaId, projects) {
const a = areaOf(areaId);
if (a.custom) return [];
return (projects || []).filter(p => a.projectAreas.includes(p.area) || (!_o1.has(p.area) && a.kw.some(k => has(norm(p.loc), k))));
}
function _oa(text, a, _og) {
const _ob = norm(text);
return a.kw.some(k => has(_ob, k)) || _og.some(p => p.name && has(_ob, norm(p.name)));
}
export function weekRange(now = Date.now()) {
const _o4 = new Date(now);
const from = new Date(_o4.getFullYear(), _o4.getMonth(), _o4.getDate() - ((_o4.getDay() + 6) % 7));
const to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 6, 23, 59, 59, 999);
const _ok = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 3);
const _o8 = new Date(_ok.getFullYear(), 0, 4);
const _on = 1 + Math.round(((_ok - _o8) / D - 3 + ((_o8.getDay() + 6) % 7)) / 7);
return { from: from.getTime(), to: to.getTime(), key: _ok.getFullYear() + '-W' + _oc(_on),
label: `Tuần ${_oc(from.getDate())}/${_oc(from.getMonth() + 1)} – ${_oc(to.getDate())}/${_oc(to.getMonth() + 1)}/${to.getFullYear()}` };
}
export function gather({ area, ideas = [], policies = [], customers = [], jobs = [], projects = [], feedItems = [], now = Date.now(), days = 7 } = {}) {
const a = areaOf(area);
const _og = projectsIn(a, projects);
const _od = new Set(_og.map(p => p.id));
const _oe = id => (projects.find(p => p.id === id) || {}).name || id;
const since = now - days * D;
const _oi = new Set();
const news = [];
const add = (id, title, url, source, published, summary, anyArea) => {
const key = url || title;
if (!title || _oi.has(key) || published < since || (!anyArea && !_oa([title, summary].join(' '), a, _og))) return;
_oi.add(key); news.push({ id, title: String(title).slice(0, 200), url: _o6(url) ? url : '', source: source || '', published });
};
for (const _o5 of ideas) if (_o9(_o5) && _o5.status !== 'rejected' && _o5.source !== 'market') {
const _o4 = pd(_o5.data);
add(_o5.id, _o5.title, _o5.url, _o5.source, Number(_o4.published) || Number(_o5.updated_at) || 0, _o5.summary);
}
for (const _o7 of feedItems || []) add(_o7.link || _o7.title, _o7.title, _o7.link, _o7.source, Number(_o7.published) || 0, _o7.summary, _o7.area === a.id);
news.sort((x, y) => y.published - x.published);
const _o3 = (() => { const _o4 = new Date(now); return _o4.getFullYear() + '-' + _oc(_o4.getMonth() + 1); })();
const _of = policies.filter(p => _o9(p) && p.status === 'active' && _od.has(p.project_id) && (Number(p.updated_at) >= now - 30 * D || p.month === _o3))
.map(p => ({ id: p.id, project_id: p.project_id, project: _oe(p.project_id), month: p.month || '', effective_from: p.effective_from || '', note: String(p.note || '').slice(0, 200) }));
const dem = new Map();
for (const _o2 of customers) {
if (!_o9(_o2) || (_o2.kind && _o2.kind !== 'customer') || _o2.source !== 'landing' || !_od.has(_o2.project)) continue;
const _oh = dem.get(_o2.project) || { project_id: _o2.project, project: _oe(_o2.project), count: 0, total: 0 };
_oh.total++; if (Number(_o2.created_at) >= since) _oh.count++;
dem.set(_o2.project, _oh);
}
const demand = [...dem.values()].sort((x, y) => y.count - x.count || y.total - x.total);
const _om = jobs.filter(j => _o9(j) && /^video_/.test(j.type || '') && Number(j.updated_at) >= since);
const videos = { done: _om.filter(j => j.status === 'done').length, queued: _om.filter(j => ['queued', 'running', 'waiting_approval'].includes(j.status)).length };
return { area: a.id, area_label: a.label, province: a.province || a.tinh_thanh || '', tinh_thanh: a.tinh_thanh || '', custom: !!a.custom, week: weekRange(now), since, now, projects: _og.map(p => p.name), news, policies: _of, demand, videos };
}
export const fmtDate = dmy;

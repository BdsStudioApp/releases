import * as G from '../g1_lib/logic.js';
import { fold, filterProjects } from '../_lib/sales.js';
export const ACTION_NEW = 'catalog.research_new';
export const MIN_Q = 3;
export const AI_REVIEW_NOTE = 'nguồn AI – cần kiểm lại';
export const FEATURE = { id: 'catalog_research_new', label: 'AI tìm thông tin dự án mới', kind: 'search', provider: 'gemini_search',
data: 'tên dự án và gợi ý khu vực/chủ đầu tư anh/chị nhập' };
export const CONF_TXT = { cao: 'Cao', vua: 'Vừa', thap: 'Thấp' };
const _o0 = { thap: 0, vua: 1, cao: 2 };
export const cleanName = (q) => String(q ?? '').replace(/[\u0000-\u001f|"“”<>`]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 120);
export function unknownName(projects, q) {
const name = cleanName(q);
if (fold(name).replace(/\s/g, '').length < MIN_Q) return '';
return filterProjects(projects || [], { q: name }).length ? '' : name;
}
export function confOf(text, fact) {
const _o5 = String(text || '').slice(fact.start, fact.end);
const _o8 = _o5.split('|').map((x) => x.trim());
const _oa = fold(_o8[6] || '');
if (/^cao|^high/.test(_oa)) return 'cao';
if (/^vua|^trung|^medium/.test(_oa)) return 'vua';
if (/^thap|^low/.test(_oa)) return 'thap';
return '';
}
export function confidence(status, stated) {
const _o1 = status === 'grounded' ? 'cao' : status === 'ai_only' ? 'vua' : 'thap';
if (!stated || !(stated in _o0)) return _o1;
return _o0[stated] < _o0[_o1] ? stated : _o1;
}
export function reviewRows(r) {
const text = String((r && r.text) || '');
const _o3 = G.parseFacts(text).map((f) => ({ ...f, conf_ai: confOf(text, f) }));
const _o6 = G.matchSources(_o3, text, { sources: (r && r.sources) || [], segments: (r && r.segments) || [] });
return G.researchDiff(null, _o6).map((d) => ({ ...d, conf: confidence(d.fact.status, d.fact.conf_ai) }));
}
export const canPick = (d, opened) => !!(d && d.ok && (d.fact.status === 'grounded' || (d.fact.status === 'ai_only' && !!G.safeUrl(d.fact.url)) || (opened && opened.has(d.field))));
export const prePicked = (rows) => new Set((rows || []).filter((d) => d.ok && d.fact.status === 'grounded').map((d) => d.field));
export function candidatesOf(r) {
return ((r && r.candidates) || []).filter((_o2) => _o2 && _o2.name).slice(0, 5)
.map((_o2) => ({ name: String(_o2.name), dev: String(_o2.dev || ''), loc: String(_o2.loc || ''), url: G.safeUrl(_o2.url) }));
}
export const needPick = (r, rows) => { const _o2 = candidatesOf(r); return _o2.length >= 2 || (_o2.length === 1 && !(rows || []).length); };
export function newProjectData(rows, { now = 0, by = '', query = null, area = '' } = {}) {
const ok = (rows || []).filter((d) => d && d.ok && d.fact && G.safeUrl((d.fact.sources && d.fact.sources[0] && d.fact.sources[0].url) || d.fact.url));
const data = G.applyResearch({}, ok, { now, by });
const saved = ok.map((d) => d.field);
if (area && !data.area) data.area = String(area).slice(0, 80);
data.added = 'ai';
data.ai_review = {
note: AI_REVIEW_NOTE, at: now, by, checked_at: 0,
query: query ? { name: String(query.name || ''), hints: query.hints || {}, pick: query.pick || null } : null,
sources: ok.map((d) => {
const _o9 = data.sources[d.field] || {};
return { field: d.field, label: d.label, url: _o9.url || '', title: _o9.title || '', status: d.fact.status, conf: d.conf || confidence(d.fact.status, '') };
}),
};
return { data, saved };
}
export const needsReview = (p) => !!(p && p.ai_review && typeof p.ai_review === 'object' && !Number(p.ai_review.checked_at));
export const isSample = (p) => !!(p && (p.sample === true || /^mau_/.test(String(p.id || ''))));
export function displayName(p) {
const n = String((p && p.name) || '');
return isSample(p) ? n.replace(/^\s*Mẫu\s*[·•:\-–]\s*/u, '') || n : n;
}
export const BAKED_LABEL = { x0: 24 / 800, x1: 174 / 800, y0: 24 / 450, y1: 64 / 450 };
export const hasBakedLabel = (src) => /(^|\/)assets\/samples\/mau-\d+\.svg(\?|$)/.test(String(src || ''));
export function restoreAction(p, env) {
const ids = env && env.defaultIds;
const has = !!(p && ids && typeof ids.has === 'function' && ids.has(String(p.id)));
const name = (p && displayName(p)) || 'dự án này';
return has
? { label: 'Khôi phục mặc định', remove: false, title: 'Khôi phục dữ liệu mặc định?', ok: 'Khôi phục',
text: `Bỏ mọi thông tin đã sửa / AI tìm cho "${name}" và quay về dữ liệu mặc định. Không hoàn tác được.`, done: 'Đã khôi phục dữ liệu mặc định' }
: { label: 'Xoá dự án', remove: true, title: 'Xoá dự án?', ok: 'Xoá dự án',
text: `"${name}" không có bản mặc định – xoá là mất hẳn dự án này khỏi Thông tin dự án (giá, loại căn, nguồn đã lưu). Chắc chắn xoá?`, done: 'Đã xoá dự án' };
}
const _o4 = (_o9) => String(_o9 ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase()
.replace(/[^a-z0-9]+/g, ' ').replace(/(^| )du an( |$)/g, ' ').replace(/\s+/g, '');
export function askChanged(asked, current) {
if (asked == null) return false;
return _o4(asked) !== _o4(current);
}
export function projectGaps(p, { policy = null, plans = [], staleDays = 0, staleLimit = 30 } = {}) {
if (!p) return [];
const _o7 = [];
if (!(Array.isArray(p.price) && p.price[0] > 0)) _o7.push({ key: 'price', label: 'giá (triệu/m²)' });
if (!(Array.isArray(p.types) && p.types.some((t) => !t.ask && Array.isArray(t.a)))) _o7.push({ key: 'types', label: 'loại căn & diện tích' });
if (!policy) _o7.push({ key: 'policy', label: plans && plans.length ? 'chính sách bán hàng đã duyệt (đang dùng chính sách tham khảo mặc định)' : 'chính sách bán hàng' });
else if (staleDays > staleLimit && isFinite(staleDays)) _o7.push({ key: 'policy_stale', label: `chính sách mới (bản đang áp dụng đã ${Math.round(staleDays)} ngày)` });
if (!String(p.loc || '').trim()) _o7.push({ key: 'loc', label: 'vị trí' });
return _o7;
}

import { fold, parseNum, parseTypesText, fmtNum, typesToText, filterProjects } from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import { newProjectId } from './upload_logic.js';
import { withRules } from '../../../shared/ai_rules.js';
import { structureAsk } from './structure_logic.js';
export const NEW_MARK = 'BDS_CATALOG_NEW';
export const NEW_FIELDS = {
name: { label: 'Tên dự án (chính thức)', hint: 'tên đầy đủ theo chủ đầu tư' },
area: { label: 'Khu vực', hint: 'ngắn gọn để lọc: tên đại đô thị / khu đô thị lớn hoặc quận, huyện – ví dụ "", "Đông Anh"' },
...G.RESEARCH_FIELDS,
};
export const FIELD_ORDER = Object.keys(NEW_FIELDS);
const _o0 = ['du an', 'chung cu', 'can ho', 'khu can ho', 'khu do thi', 'kdt', 'toa nha', 'toa', 'nha o', 'khu', 'project', 'residence', 'tower'];
export function normName(_ox) {
let t = ' ' + fold(_ox).replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
for (const _o13 of _o0) t = t.split(' ' + _o13 + ' ').join(' ');
return t.replace(/\s+/g, ' ').trim();
}
const _o5 = (_ox) => _ox.replace(/\s+/g, '');
function _oh(a, b) {
if (a === b) return 0;
if (!a.length) return b.length;
if (!b.length) return a.length;
let _ot = Array.from({ length: b.length + 1 }, (_, _oc) => _oc);
for (let _oc = 1; _oc <= a.length; _oc++) {
const _o7 = [_oc];
for (let _oe = 1; _oe <= b.length; _oe++) _o7[_oe] = Math.min(_ot[_oe] + 1, _o7[_oe - 1] + 1, _ot[_oe - 1] + (a[_oc - 1] === b[_oe - 1] ? 0 : 1));
_ot = _o7;
}
return _ot[b.length];
}
export function nameScore(a, b) {
const _o14 = normName(a), y = normName(b);
if (!_o14 || !y) return 0;
const cx = _o5(_o14), cy = _o5(y);
if (cx === cy) return 1;
const _ov = 1 - _oh(cx, cy) / Math.max(cx.length, cy.length);
const _oz = _o14.split(' '), ty = y.split(' ');
const _od = (_ox, l) => _ox.length && _ox.every((_o13) => l.includes(_o13));
const _oy = cx.length <= cy.length ? cx : cy;
const _o6 = _oy.length >= 5 && (_od(_oz, ty) || _od(ty, _oz)) ? 0.85 : 0;
return Math.max(_ov, _o6);
}
export function findSimilar(name, projects, { limit = 5, near = 0.78 } = {}) {
const q = normName(name);
if (!q || _o5(q).length < 2) return [];
const _oo = [];
for (const _op of projects || []) {
if (!_op || !_op.name) continue;
let score = nameScore(name, _op.name);
if (String(_op.id || '').toLowerCase() === _o5(q)) score = 1;
if (score >= near) _oo.push({ id: String(_op.id), name: _op.name, dev: _op.dev || '', area: _op.area || '', kind: score >= 0.999 ? 'exact' : 'near', score: Math.round(score * 100) / 100 });
}
return _oo.sort((a, b) => b.score - a.score).slice(0, limit);
}
export const SUGGEST_MIN_CHARS = 3;
export const SUGGEST_DEBOUNCE_MS = 350;
export function suggestNewProject(q, projects) {
const name = String(q || '').replace(/\s+/g, ' ').trim().slice(0, 120);
const _og = fold(name).replace(/[^a-z0-9]/g, '');
if (_og.length < SUGGEST_MIN_CHARS || !normName(name)) return { show: false, name, reason: 'short' };
if (findSimilar(name, projects).length) return { show: false, name, reason: 'similar' };
if (filterProjects(projects || [], { q: name }).length) return { show: false, name, reason: 'match' };
return { show: true, name, reason: '' };
}
const _om = (_ox, _ok) => String(_ox || '').replace(/["\n\r\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, _ok);
export function newProjectPrompt(name, { hint = '', area = '', dev = '', fields = FIELD_ORDER, structure = null } = {}) {
const _ol = _om(name, 120);
const _o2 = _om(area, 80), dv = _om(dev, 120);
const _ob = [dv && 'chủ đầu tư: ' + dv, _o2 && 'khu vực: ' + _o2, _om(hint, 200)].filter(Boolean).join('; ');
const fl = ['name', 'area', ...fields.filter((f) => f !== 'name' && f !== 'area')].filter((f) => NEW_FIELDS[f])
.map((f) => `- ${f}: ${NEW_FIELDS[f].label} (${NEW_FIELDS[f].hint})`).join('\n');
return withRules([
'BDS_G1_RESEARCH',
NEW_MARK,
`Môi giới muốn THÊM dự án bất động sản MỚI vào bảng hàng: "${_ol}"${_ob ? ' (thông tin thêm: ' + _ob + ')' : ''}.`,
'Tìm trên Google để xác định ĐÚNG dự án này (tên chính thức, chủ đầu tư, vị trí) và thông tin MỚI NHẤT của nó.',
_ob ? `Có nhiều dự án trùng tên: CHỈ lấy dự án ${[dv && 'của chủ đầu tư ' + dv, _o2 && 'ở khu vực ' + _o2].filter(Boolean).join(', ')}; không lấy dự án khác dù tên giống.` : '',
'Nếu tên này khớp NHIỀU dự án khác nhau, trước hết viết mỗi dự án một dòng (tối đa 5 dòng):',
'CANDIDATE | <tên đầy đủ> | <chủ đầu tư> | <vị trí> | <link nguồn https://…>',
'rồi chỉ viết các dòng FACT cho dự án khớp nhất với tên trên.',
'Ưu tiên nguồn chính thức: trang chủ đầu tư, cổng thông tin Sở Xây dựng/UBND, báo chính thống. Không dùng tin rao vặt, không đoán.',
'Mỗi thông tin tìm được viết đúng MỘT dòng theo mẫu (không thêm chữ nào khác, không dùng markdown):',
'FACT | <mã trường> | <giá trị> | <link nguồn đầy đủ https://…> | <trích dẫn ngắn từ nguồn> | <ngày đăng nguồn YYYY-MM-DD hoặc để trống>',
'Mã trường được dùng:', fl,
'Không tìm thấy nguồn đáng tin cho trường nào thì BỎ trường đó (không viết dòng). Không viết số liệu không có trong nguồn. Không viết chính sách thanh toán / chiết khấu (phần đó nhập riêng, lưu nháp).',
structure ? structureAsk(structure) : '',
].filter(Boolean).join('\n'));
}
export function parseCandidates(text) {
const _oo = [], seen = new Set();
const _ow = /^[ \t>*-]*CANDIDATE\s*\|(.+)$/gim;
let _oj;
while ((_oj = _ow.exec(String(text || ''))) && _oo.length < 5) {
const [name = '', dev = '', loc = '', link = ''] = _oj[1].split('|').map((_o14) => _o14.trim());
const _of = normName(name);
if (!name || !_of || seen.has(_of)) continue;
seen.add(_of);
const _o10 = (link.match(/https?:\/\/[^\s<>"')]+/i) || [''])[0].replace(/[.,;]+$/, '');
_oo.push({ name: name.slice(0, 160), dev: dev.slice(0, 120), loc: loc.slice(0, 200), url: G.safeUrl(_o10) });
}
return _oo;
}
export function parseNewFacts(text) {
const _ox = String(text || ''), _oo = [];
const _ow = /^[ \t>*-]*FACT\s*\|(.+)$/gim;
let _oj;
while ((_oj = _ow.exec(_ox))) {
const _or = _oj[1].split('|').map((_o14) => _o14.trim());
const field = (_or[0] || '').toLowerCase().replace(/[^a-z]/g, '');
if (!NEW_FIELDS[field]) continue;
const _o11 = (_or[2] || '').match(/https?:\/\/[^\s<>"')]+/i);
_oo.push({ field, raw: _or[1] || '', url: _o11 ? _o11[0].replace(/[.,;]+$/, '') : '', quote: _or[3] || '', date: /^\d{4}-\d{2}-\d{2}$/.test(_or[4] || '') ? _or[4] : '', start: _oj.index, end: _oj.index + _oj[0].length });
}
return _oo;
}
export function normValue(field, text) {
const _o12 = String(text ?? '').trim();
if (!_o12) return { ok: false, error: 'Trống' };
if (field === 'name' || field === 'area') return { ok: true, value: _o12.slice(0, 160), display: _o12.slice(0, 160) };
return G.normalizeFact(field, _o12);
}
const _o1 = { grounded: 0, ai_only: 1, missing: 2 };
export function newProjectRows(text, grounding = {}) {
const _o9 = G.matchSources(parseNewFacts(text), text, grounding);
const _o3 = {};
for (const f of _o9) {
const _ok = normValue(f.field, f.raw);
const _o4 = { ...f, norm: _ok }, _o7 = _o3[f.field];
if (!_o7 || (_ok.ok && !_o7.norm.ok) || (_ok.ok === _o7.norm.ok && _o1[_o4.status] < _o1[_o7.status])) _o3[f.field] = _o4;
}
const rows = FIELD_ORDER.filter((_of) => _o3[_of] && _of !== 'name' && _of !== 'area').map((_of) => {
const f = _o3[_of];
return { field: _of, label: NEW_FIELDS[_of].label, text: f.norm.ok ? f.norm.display : f.raw, aiText: f.norm.ok ? f.norm.display : f.raw,
ok: f.norm.ok, error: f.norm.ok ? (f.status === 'missing' ? 'Thiếu link nguồn' : '') : f.norm.error, status: f.status,
sources: (f.sources || []).filter((_ox) => G.safeUrl(_ox.url)), url: G.safeUrl(f.url), quote: f.quote, date: f.date, value: f.norm.value,
picked: f.norm.ok && f.status === 'grounded' };
});
const _os = (_of) => (_o3[_of] && _o3[_of].norm.ok ? _o3[_of].norm.value : '');
return { rows, name: _os('name'), area: _os('area'), nameFact: _o3.name || null, candidates: parseCandidates(text) };
}
export function areaFromLoc(loc) {
const _ox = String(loc || '').trim();
if (!_ox) return '';
const _o8 = _ox.split(/\s*[·|]\s*/);
const _oq = (_o8.length > 1 ? _o8[_o8.length - 1] : _ox).split(',')[0];
return _oq.replace(/^(phường|quận|huyện|xã|thị xã|tp\.?|thành phố)\s+/i, '').trim().slice(0, 40);
}
export function canPickRow(row, { opened = false } = {}) {
if (!row) return false;
if (isEdited(row)) return normValue(row.field, row.text).ok;
if (!row.ok) return false;
return row.status === 'grounded' || (row.status === 'ai_only' && (!!G.safeUrl(row.url) || !!opened));
}
export const isEdited = (row) => !!row && String(row.text ?? '').trim() !== String(row.aiText ?? '').trim();
export function buildNewProject({ name, area = '', rows = [], opened = [], existingIds = [], now = Date.now(), by = '', via = 'ai' } = {}) {
const _ol = String(name || '').trim().slice(0, 160);
if (!_ol) return { ok: false, error: 'Nhập tên dự án.' };
const _on = new Set(opened instanceof Set ? [...opened] : opened);
const aiRows = [], manual = [], skipped = [];
for (const _ou of rows) {
if (!_ou || !_ou.picked) continue;
if (!canPickRow(_ou, { opened: _on.has(_ou.field) })) { skipped.push({ field: _ou.field, reason: _ou.status === 'missing' ? 'Thiếu link nguồn' : _ou.status === 'ai_only' ? 'Chưa mở link kiểm' : (_ou.error || 'Chưa đọc được') }); continue; }
if (isEdited(_ou)) {
const _ok = normValue(_ou.field, _ou.text);
manual.push({ field: _ou.field, value: _ok.value });
} else {
const _oa = _ou.sources && _ou.sources[0];
aiRows.push({ field: _ou.field, ok: true, value: _ou.value, fact: { sources: _oa ? [_oa] : [], url: _ou.url || (_oa ? _oa.url : ''), quote: _ou.quote || '', date: _ou.date || '', status: _ou.status } });
}
}
const data = aiRows.length ? G.applyResearch({}, aiRows, { now, by }) : {};
const sources = { ...(data.sources || {}) };
for (const _oj of manual) {
data[_oj.field] = _oj.value;
sources[_oj.field] = { url: '', title: '', at: now, by: 'manual', user: by };
if (data.g1_sources && data.g1_sources[_oj.field]) delete data.g1_sources[_oj.field];
}
if (Object.keys(sources).length) data.sources = sources;
const _o2 = String(area || '').trim() || areaFromLoc(data.loc);
if (_o2) data.area = _o2.slice(0, 60);
if (!Array.isArray(data.types)) data.types = [];
data.created = { at: now, by, via };
const id = newProjectId(_ol, existingIds);
const saved = [...aiRows.map((_ou) => _ou.field), ...manual.map((_oj) => _oj.field)];
return { ok: true, id, row: { id, name: _ol, dev: String(data.dev || '').slice(0, 160), data, deleted: 0 }, saved, skipped };
}
export function buildManualProject(f = {}, { existingIds = [], now = Date.now(), by = '' } = {}) {
const name = String(f.name || '').trim();
if (!name) return { ok: false, error: 'Nhập tên dự án.' };
const data = {};
const _oi = parseNum(f.priceLo), hi = parseNum(f.priceHi);
if (isFinite(_oi)) {
const price = [_oi, isFinite(hi) ? hi : _oi];
if (price[0] <= 0 || price[1] < price[0]) return { ok: false, error: 'Giá thấp phải > 0 và không lớn hơn giá cao.' };
data.price = price;
} else if (isFinite(hi)) return { ok: false, error: 'Nhập cả giá thấp.' };
if (f.handover) {
if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(String(f.handover))) return { ok: false, error: 'Tháng bàn giao chưa đúng (MM/YYYY).' };
data.handover = String(f.handover);
}
const types = parseTypesText(f.typesText || '');
if (types.some((_o14) => !_o14.ask && (_o14.a[0] <= 0 || _o14.a[1] < _o14.a[0]))) return { ok: false, error: 'Diện tích loại căn chưa hợp lệ.' };
data.types = types;
for (const _of of ['dev', 'loc', 'status']) { const _o12 = String(f[_of] || '').trim(); if (_o12) data[_of] = _o12.slice(0, 300); }
const area = String(f.area || '').trim() || areaFromLoc(data.loc);
if (area) data.area = area.slice(0, 60);
const sources = {};
for (const _of of ['dev', 'loc', 'price', 'handover', 'types', 'status']) if (data[_of] != null && !(Array.isArray(data[_of]) && !data[_of].length)) sources[_of] = { url: '', title: '', at: now, by: 'manual', user: by };
if (Object.keys(sources).length) data.sources = sources;
data.created = { at: now, by, via: 'manual' };
const id = newProjectId(name, existingIds);
return { ok: true, id, row: { id, name: name.slice(0, 160), dev: String(data.dev || ''), data, deleted: 0 }, saved: Object.keys(sources), skipped: [] };
}
export function aiUnverified(_op) {
const _o4 = _op && _op.created;
if (!!_o4 && typeof _o4 === 'object' && (_o4.via === 'ai' || _o4.via === 'chat') && !_o4.checked) return true;
const _ou = _op && _op.ai_review;
return !!_ou && typeof _ou === 'object' && !Number(_ou.checked_at);
}
export const AI_UNVERIFIED_TEXT = 'nguồn AI – cần kiểm lại';
export function markChecked(created, { now = Date.now(), by = '' } = {}) {
return { ...(created && typeof created === 'object' ? created : {}), checked: { at: now, by } };
}
export function markCheckedData(data, { now = Date.now(), by = '' } = {}) {
const d = { ...(data && typeof data === 'object' ? data : {}) };
if (d.ai_review && typeof d.ai_review === 'object') d.ai_review = { ...d.ai_review, checked_at: now, checked_by: by };
if (d.created || !d.ai_review) d.created = markChecked(d.created, { now, by });
return d;
}
export function restoreAction(_op, env) {
const ids = env && env.defaultIds;
const has = !!(_op && ids && typeof ids.has === 'function' && ids.has(String(_op.id)));
const name = (_op && _op.name) || 'dự án này';
return has
? { label: 'Khôi phục mặc định', remove: false, title: 'Khôi phục dữ liệu mặc định?', ok: 'Khôi phục',
text: `Bỏ mọi thông tin đã sửa / AI tìm cho "${name}" và quay về dữ liệu mặc định. Không hoàn tác được.`, done: 'Đã khôi phục dữ liệu mặc định' }
: { label: 'Xoá dự án', remove: true, title: 'Xoá dự án?', ok: 'Xoá dự án',
text: `"${name}" không có bản mặc định – xoá là mất hẳn dự án này khỏi Thông tin dự án (giá, loại căn, nguồn đã lưu). Chắc chắn xoá?`, done: 'Đã xoá dự án' };
}
export function askChanged(asked, current) {
if (asked == null) return false;
return _o5(normName(asked)) !== _o5(normName(current));
}
export function projectGaps(_op, { policy = null, plans = [], staleDays = 0, staleLimit = 30 } = {}) {
if (!_op) return [];
const _oo = [];
if (!(Array.isArray(_op.price) && _op.price[0] > 0)) _oo.push({ key: 'price', label: 'giá (triệu/m²)' });
if (!(Array.isArray(_op.types) && _op.types.some((t) => !t.ask && Array.isArray(t.a)))) _oo.push({ key: 'types', label: 'loại căn & diện tích' });
if (!policy) _oo.push({ key: 'policy', label: plans && plans.length ? 'chính sách bán hàng đã duyệt (đang dùng chính sách tham khảo mặc định)' : 'chính sách bán hàng' });
else if (staleDays > staleLimit && isFinite(staleDays)) _oo.push({ key: 'policy_stale', label: `chính sách mới (bản đang áp dụng đã ${fmtNum(staleDays, 0)} ngày)` });
if (!String(_op.loc || '').trim()) _oo.push({ key: 'loc', label: 'vị trí' });
return _oo;
}
export { typesToText };

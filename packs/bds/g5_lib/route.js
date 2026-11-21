import { withRulesJson } from '../../../shared/ai_rules.js';
export const GROUPS = [
{ id: 'tuvan', label: 'Tư vấn và chốt', icon: '🤝' },
{ id: 'tuchoi', label: 'Xử lý từ chối', icon: '🛡️' },
{ id: 'phaply', label: 'Pháp lý BĐS', icon: '⚖️' },
{ id: 'taichinh', label: 'Tài chính và vay', icon: '🏦' },
{ id: 'thue', label: 'Thuế phí', icon: '🧾' },
{ id: 'quyhoach', label: 'Đọc quy hoạch', icon: '🗺️' },
{ id: 'marketing', label: 'Marketing và nguồn khách', icon: '📣' },
{ id: 'duan', label: 'Phân tích dự án', icon: '🏢' },
];
export const groupLabel = (id) => (GROUPS.find((g) => g.id === id) || {}).label || id || '';
export function buildRoute(base = [], groupLists = {}, extraQuiz = {}, meta = {}) {
const first = base.map((l) => {
const _oe = meta[l.id] || {};
return { ...l, group: l.group || _oe.group || 'tuvan', level: l.level || _oe.level || 1, quiz: [...l.quiz, ...(extraQuiz[l.id] || [])] };
});
const rest = [];
for (const _od of [1, 2, 3]) {
const _ok = GROUPS.map((g) => (groupLists[g.id] || []).filter((l) => (l.level || 1) === _od));
for (let _o9 = 0; _ok.some((q) => q.length > _o9); _o9++) for (const q of _ok) if (q[_o9]) rest.push(q[_o9]);
}
const _on = new Set(first.map((l) => l.id));
return [...first, ...rest.filter((l) => !_on.has(l.id) && _on.add(l.id))];
}
export function groupStats(progress, lessons) {
const done = (progress && progress.done) || {};
return GROUPS.map((g) => {
const ls = lessons.filter((l) => l.group === g.id);
return { ...g, total: ls.length, done: ls.filter((l) => done[l.id]).length };
}).filter((g) => g.total);
}
export const focusLessons = (lessons, focus) => (focus ? lessons.filter((l) => l.group === focus) : lessons);
const _o2 = /^https:\/\/([a-z0-9-]+\.)*(vbpl\.vn|chinhphu\.vn|quochoi\.vn|gov\.vn)(\/|$)/i;
export const safeRefUrl = (u) => (typeof u === 'string' && _o2.test(u) ? u : '');
const _o1 = 60000;
export function packCards(cards = {}) {
return Object.entries(cards).filter(([_ob, c]) => c && !/[;,]/.test(_ob)).map(([_ob, c]) => _ob + ',' + (c.box | 0) + ',' + Math.round((Number(c.due) || 0) / _o1).toString(36)).join(';');
}
export function unpackCards(_om) {
const _og = {};
for (const _oh of String(_om || '').split(';')) {
const [_ob, b, _o5] = _oh.split(',');
if (_ob && b != null && _o5 != null) _og[_ob] = { box: Number(b) || 1, due: parseInt(_o5, 36) * _o1 };
}
return _og;
}
export function packProgress(p) {
const { cards, ...rest } = p || {};
return { ...rest, cards: {}, cz: packCards(cards) };
}
export function unpackProgress(saved) {
const _om = saved || {};
const { cz, ...rest } = _om;
return { ...rest, cards: { ...(_om.cards || {}), ...unpackCards(cz) } };
}
export function fitSize(p, max = 42000) {
const q = JSON.parse(JSON.stringify(p || {}));
const size = () => JSON.stringify(packProgress(q)).length;
if (size() <= max) return q;
const _o5 = q.drill || {};
const _oc = new Set(Object.values(_o5.sets || {}).flat());
const _of = Object.keys(_o5.items || {}).filter((id) => !_oc.has(id)).sort((a, b) => (_o5.items[a].at || 0) - (_o5.items[b].at || 0));
const _o8 = (id) => { delete _o5.items[id]; if (_o5.done) delete _o5.done[id]; if (_o5.last) delete _o5.last[id]; if (q.cards) delete q.cards['d:' + id + '#0']; };
while (_of.length && size() > max) for (const id of _of.splice(0, 5)) _o8(id);
const pq = q.pq || {};
const _oj = Object.keys(pq).sort((a, b) => (pq[a].at || 0) - (pq[b].at || 0));
while (_oj.length > 1 && size() > max) {
const _oi = _oj.shift();
for (const it of pq[_oi].items || []) delete q.cards[PQ + it.id + '#0'];
delete pq[_oi];
}
const days = Object.keys(_o5.sets || {}).sort();
while (days.length > 1 && size() > max) { const _o6 = days.shift(); for (const id of _o5.sets[_o6]) _o8(id); delete _o5.sets[_o6]; }
return q;
}
export const PQ = 'p:';
export const PQ_SIZE = 6;
export const PQ_PER_PROJECT = 24;
const clip = (_om, n) => String(_om == null ? '' : _om).replace(/\s+/g, ' ').trim().slice(0, n);
const _o0 = ['loc', 'area', 'address', 'scale', 'legal', 'highlights', 'amenities', 'desc', 'note', 'notes', 'intro', 'usp', 'policy', 'payment', 'handover_std', 'bangiao'];
export function projectFacts(p) {
if (!p) return '';
const _og = [];
const add = (label, v) => { const _om = Array.isArray(v) ? v.filter(Boolean).join(', ') : typeof v === 'object' && v ? '' : clip(v, 600); if (_om) _og.push(label + ': ' + _om); };
add('Tên dự án', p.name); add('Chủ đầu tư', p.dev);
if (Array.isArray(p.price) && p.price.length === 2) add('Giá niêm yết (triệu/m², ước tính, gồm VAT và phí bảo trì)', p.price[0] === p.price[1] ? String(p.price[0]) : p.price[0] + '–' + p.price[1]);
if (Array.isArray(p.types) && p.types.length) add('Loại căn', p.types.map((t) => t.n + (Array.isArray(t.a) ? ` (${t.a[0]}–${t.a[1]} m²)` : '')));
add('Bàn giao dự kiến', p.handover);
add('Trạng thái bán', p.status);
for (const _ob of _o0) if (p[_ob] && typeof p[_ob] !== 'object') add(_ob, p[_ob]);
if (Array.isArray(p.highlights)) add('Điểm nổi bật', p.highlights.map((x) => clip(typeof x === 'string' ? x : x && (x.t || x.text), 200)));
return _og.join('\n').slice(0, 4000);
}
export function projectQuizPrompt(p, { n = PQ_SIZE, avoid = [] } = {}) {
return withRulesJson([
'Bạn là trưởng phòng kinh doanh bất động sản ở Hà Nội, soạn ' + n + ' câu hỏi trắc nghiệm để môi giới trong công ty ôn kiến thức về DỰ ÁN công ty đang bán dưới đây, giúp trả lời khách chính xác.',
'CHỈ dùng thông tin trong phần "Thông tin dự án". Không thêm số liệu, tiện ích, pháp lý, giá hay mốc thời gian nào không có ở đó. Thông tin ít thì soạn ít câu hơn (tối thiểu 3), và có thể soạn câu tình huống: khách hỏi một điều KHÔNG có trong thông tin → đáp án đúng là "kiểm lại với chủ đầu tư / tài liệu gốc rồi báo khách", không đoán.',
'Mỗi câu có đúng 4 lựa chọn, 1 đúng; lựa chọn sai là lỗi môi giới hay mắc (nhớ nhầm số, hứa hẹn, nói chắc điều chưa có). Giải thích ngắn vì sao đúng, ghi rõ dựa vào dòng nào của thông tin.',
avoid.length ? 'Không lặp các câu đã có: ' + avoid.slice(0, 30).map((_om) => '"' + clip(_om, 90) + '"').join(', ') + '.' : '',
'--- Thông tin dự án ---', projectFacts(p), '--- Hết ---',
'Chỉ trả về JSON: {"items":[{"q":"câu hỏi","options":["…","…","…","…"],"answer":chỉ số 0-3,"why":"vì sao, dựa vào thông tin nào"}]}',
].filter(Boolean).join('\n'));
}
const _ol = () => 'q' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
function _oo(it, rnd) {
const _oa = it.options.map((_, _o9) => _o9);
for (let _o9 = _oa.length - 1; _o9 > 0; _o9--) { const j = Math.floor(rnd() * (_o9 + 1)); [_oa[_o9], _oa[j]] = [_oa[j], _oa[_o9]]; }
return { ...it, options: _oa.map((_o9) => it.options[_o9]), answer: _oa.indexOf(it.answer) };
}
export function parseProjectQuiz(text, { rnd = Math.random, now = Date.now() } = {}) {
const _oe = String(text || '').match(/\{[\s\S]*\}|\[[\s\S]*\]/);
if (!_oe) return [];
let j; try { j = JSON.parse(_oe[0]); } catch { return []; }
const _o4 = Array.isArray(j) ? j : j && Array.isArray(j.items) ? j.items : [];
const _og = [], _on = new Set();
for (const x of _o4.slice(0, 12)) {
if (!x || typeof x !== 'object') continue;
const q = clip(x.q, 300), opts = Array.isArray(x.options) ? x.options.map((o) => clip(o, 300)) : [], ans = Number(x.answer);
if (!q || opts.length !== 4 || opts.some((o) => !o) || new Set(opts).size !== 4 || !Number.isInteger(ans) || ans < 0 || ans > 3) continue;
if (_on.has(q.toLowerCase())) continue;
_on.add(q.toLowerCase());
_og.push(_oo({ id: _ol(), q, options: opts, answer: ans, why: clip(x.why, 300), at: now }, rnd));
}
return _og;
}
export function addProjectQuiz(progress, project, items, now = Date.now()) {
const p = JSON.parse(JSON.stringify(progress || {}));
p.pq = p.pq || {}; p.cards = p.cards || {};
const cur = p.pq[project.id] || { items: [] };
const _o3 = [...cur.items, ...items];
const _o7 = _o3.slice(0, Math.max(0, _o3.length - PQ_PER_PROJECT));
for (const it of _o7) delete p.cards[PQ + it.id + '#0'];
p.pq[project.id] = { name: clip(project.name, 120), at: now, items: _o3.slice(-PQ_PER_PROJECT) };
return p;
}
export const projectItems = (progress, _oi) => ((progress && progress.pq && progress.pq[_oi]) || { items: [] }).items;
export function answerProject(progress, id, ok, boxDays, now = Date.now()) {
const p = JSON.parse(JSON.stringify(progress || {}));
p.cards = p.cards || {}; p.days = p.days || [];
const _ob = PQ + id + '#0', c = p.cards[_ob];
const box = ok ? Math.min(boxDays.length - 1, ((c && c.box) || 1) + 1) : 1;
p.cards[_ob] = { box, due: now + boxDays[box] * 86400000 };
const _o5 = new Date(now + 7 * 3600000).toISOString().slice(0, 10);
if (!p.days.includes(_o5)) p.days = [...p.days, _o5].slice(-400);
return p;
}
export function dueProject(progress, now = Date.now(), limit = 99) {
const p = progress || {}, by = {};
for (const [_oi, v] of Object.entries(p.pq || {})) for (const it of v.items || []) by[it.id] = { item: it, project: v.name };
const _og = [];
for (const [_ob, c] of Object.entries(p.cards || {})) {
if (!_ob.startsWith(PQ) || c.due > now) continue;
const id = _ob.slice(PQ.length).split('#')[0];
if (by[id]) _og.push({ id, ...by[id], box: c.box, due: c.due });
}
return _og.sort((a, b) => a.box - b.box || a.due - b.due).slice(0, limit);
}

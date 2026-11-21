import { norm, tokens, topicKey, canonUrl, isTrusted, classify, CATEGORIES } from './ideas.js';
import { AREAS, projectsIn } from './market.js';
import { readNews, hostOf } from './freshnews.js';
import { findForbidden } from './video.js';
import { withRulesJson } from '../../../shared/ai_rules.js';
export { norm };
const _o1 = 3600e3, D = 24 * _o1;
export const SOURCE = 'hot_topic';
export const MAX_TOPICS = 3;
export const SKIP_DAYS = 14;
export const MIN_SCORE = 25;
export const UNVERIFIED = 'cần kiểm chứng';
export const INPUT_MAX = 1500;
const _o2 = ['quy_hoach', 'ha_tang', 'chinh_sach', 'lai_suat'];
const _o3 = ['sale', 'soon'];
const pd = _ov => { if (_ov && typeof _ov === 'object') return _ov; try { return JSON.parse(_ov || '{}') || {}; } catch { return {}; } };
const _om = r => r && !Number(r.deleted);
const _ok = _ov => /^https?:\/\/[^\s]+$/i.test(String(_ov || '').trim());
const _oe = (_ov, n) => String(_ov == null ? '' : _ov).replace(/\s+/g, ' ').trim().slice(0, n);
const has = (n, kw) => (' ' + n + ' ').includes(' ' + kw + ' ');
export function collectNews({ ideas = [], fresh = null, feedItems = [], now = Date.now(), days = 7 } = {}) {
const _oz = now - days * D;
const _op = [];
const _o4 = (_o14) => {
const title = _oe(_o14.title, 200);
if (!title) return;
const published = Math.min(Number(_o14.published) || 0, now);
if (published < _oz) return;
const url = _ok(_o14.url) ? String(_o14.url).trim() : '';
_op.push({ title, summary: _oe(_o14.summary, 400), url, source: _oe(_o14.source, 80) || hostOf(url), published, idea_id: _o14.idea_id || '' });
};
for (const _oi of ideas || []) {
if (!_om(_oi) || _oi.status === 'rejected' || _oi.source === SOURCE || _oi.source === 'market') continue;
const d = pd(_oi.data);
_o4({ title: _oi.title, summary: _oi.summary, url: _oi.url, source: _oi.source, published: Number(d.published) || Number(_oi.updated_at) || 0, idea_id: _oi.id });
}
const _os = readNews(fresh);
if (_os) for (const n of _os.items) {
_o4({ title: n.title, summary: n.summary, url: n.source_url, source: n.source_name, published: (n.date && Date.parse(n.date + 'T12:00:00+07:00')) || _os.meta.at });
}
for (const _ol of feedItems || []) if (_ol) _o4({ title: _ol.title, summary: _ol.summary, url: _ol.link || _ol.url, source: _ol.source, published: _ol.published });
return _op.sort((a, _o6) => _o6.published - a.published);
}
export function interestStats(customers = [], projects = [], { now = Date.now(), days = 7 } = {}) {
const _oz = now - days * D;
const m = new Map();
for (const c of customers || []) {
if (!_om(c) || (c.kind && c.kind !== 'customer') || !c.project) continue;
if (Math.max(Number(c.created_at) || 0, Number(c.updated_at) || 0) < _oz) continue;
m.set(c.project, (m.get(c.project) || 0) + 1);
}
return [...m.entries()].map(([id, count]) => ({ project_id: id, project: ((projects || []).find(_oq => _oq.id === id) || {}).name || id, count }))
.sort((a, _o6) => _o6.count - a.count);
}
export function sellingContext(projects = []) {
const _or = (projects || []).filter(_oq => _oq && _oq.name && (!_oq.status || _o3.includes(_oq.status)));
const list = _or.map(_oq => ({ id: _oq.id, name: _oq.name, n: norm(_oq.name) }));
const areas = AREAS.map(a => ({ id: a.id, label: a.label, kw: a.kw, project_ids: projectsIn(a, _or).map(_oq => _oq.id) })).filter(a => a.project_ids.length);
return { projects: list, areas };
}
function _oy(a, _o6) {
const A = tokens(a); const B = new Set(tokens(_o6));
if (!A.length || !B.size) return { overlap: 0, coef: 0 };
const overlap = A.filter(w => B.has(w)).length;
return { overlap, coef: overlap / Math.min(A.length, B.size) };
}
const _ow = (a, _o6) => { const _ov = _oy(a, _o6); return _ov.overlap >= 3 && _ov.coef >= 0.6; };
export function clusterNews(items = []) {
const _op = [];
for (const _ol of [...(items || [])].sort((a, _o6) => _o6.published - a.published)) {
const _od = canonUrl(_ol.url);
let c = _op.find(_o14 => (_od && _o14.canons.includes(_od)) || _o14.titles.some(t => _ow(_ol.title, t)));
if (!c) {
c = { key: topicKey(_ol.title), title: _ol.title, summary: '', url: '', published: 0, sources: [], canons: [], titles: [], summaries: [], idea_ids: [] };
_op.push(c);
}
c.titles.push(_ol.title);
if (_ol.summary) { c.summaries.push(_ol.summary); if (!c.summary) c.summary = _ol.summary; }
c.published = Math.max(c.published, _ol.published);
if (_ol.idea_id && !c.idea_ids.includes(_ol.idea_id)) c.idea_ids.push(_ol.idea_id);
if (_od && !c.canons.includes(_od)) {
c.canons.push(_od);
c.sources.push({ url: _ol.url, name: _ol.source || hostOf(_ol.url), host: hostOf(_ol.url), trusted: isTrusted(_ol.url) });
if (!c.url) c.url = _ol.url;
}
}
return _op;
}
export function scoreTopic(topic, { selling = { projects: [], areas: [] }, interest = [], now = Date.now() } = {}) {
const n = norm([...topic.titles || [topic.title], ...(topic.summaries || [topic.summary || ''])].join(' '));
const parts = [];
const projHit = selling.projects.filter(_oq => _oq.n && has(n, _oq.n));
const areaHit = projHit.length ? [] : selling.areas.filter(a => a.kw.some(k => has(n, k)));
if (projHit.length) parts.push({ label: 'Dự án đang bán', points: 25, why: 'Nhắc tới ' + projHit.slice(0, 2).map(_oq => _oq.name).join(', ') + ' (đang bán)' });
else if (areaHit.length) parts.push({ label: 'Khu vực đang bán', points: 15, why: 'Khu vực đang bán: ' + areaHit[0].label });
const ids = new Set([...projHit.map(_oq => _oq.id), ...areaHit.flatMap(a => a.project_ids)]);
const _oj = (interest || []).filter(_o14 => ids.has(_o14.project_id) && _o14.count > 0);
const _ob = _oj.reduce((_ov, _o14) => _ov + _o14.count, 0);
if (_ob) parts.push({ label: 'Khách quan tâm', points: Math.min(15, 5 * _ob), why: `${_ob} khách quan tâm ${_oj.slice(0, 2).map(_o14 => _o14.project).join(', ')} (7 ngày)` });
const _o9 = classify(n).category;
const _oa = _o9 ? CATEGORIES[_o9].label.toLowerCase() : '';
if (_o2.includes(_o9)) parts.push({ label: 'Tác động giá', points: 20, why: `Tin ${_oa} – có thể tác động giá` });
else if (_o9) parts.push({ label: 'Chủ đề BĐS', points: 10, why: 'Tin ' + _oa });
const _o5 = now - (Number(topic.published) || 0);
parts.push(_o5 <= D ? { label: 'Độ mới', points: 20, why: 'Tin trong 24 giờ' } : _o5 <= 3 * D ? { label: 'Độ mới', points: 12, why: 'Tin 3 ngày gần đây' } : { label: 'Độ mới', points: 5, why: 'Tin trong tuần' });
const _oh = new Set((topic.sources || []).map(_ov => _ov.host).filter(Boolean)).size;
if (_oh >= 2) parts.push({ label: 'Nhiều nguồn', points: Math.min(15, (_oh - 1) * 8), why: _oh + ' nguồn cùng đưa' });
const verified = (topic.sources || []).some(_ov => _ov.trusted) || _oh >= 2;
const relevant = parts.some(_oq => ['Dự án đang bán', 'Khu vực đang bán', 'Khách quan tâm', 'Tác động giá', 'Chủ đề BĐS'].includes(_oq.label));
const _o13 = () => parts.reduce((_ov, _oq) => _ov + _oq.points, 0);
if (!verified) parts.push({ label: 'Cần kiểm chứng', points: -15, why: (topic.sources || []).length ? 'Chỉ một nguồn chưa rõ uy tín' : 'Chưa có link nguồn' });
const _o7 = findForbidden((topic.titles || [topic.title]).join(' '));
if (_o7.length) parts.push({ label: 'Từ giật tít', points: -Math.min(20, Math.max(0, _o13())), why: 'Tiêu đề có từ nên tránh: ' + _o7.join(', ') });
const score = Math.max(0, _o13());
return {
score, parts, relevant, category: _o9, verified, needs_check: !verified,
can_make: verified && (topic.sources || []).some(_ov => _ok(_ov.url)),
label: verified ? '' : UNVERIFIED,
why: parts.filter(_oq => _oq.points > 0).map(_oq => _oq.why).join(' · '),
};
}
export function memoryFrom(ideas = []) {
const _op = [];
for (const _oi of ideas || []) {
if (!_om(_oi)) continue;
const d = pd(_oi.data);
const hot = d.hot && typeof d.hot === 'object' ? d.hot : null;
const _of = Number(hot && hot.done_at) || (_oi.status === 'done' ? Number(_oi.updated_at) || 1 : 0);
const _o10 = Number(hot && hot.skipped_at) || 0;
if (!_of && !_o10) continue;
const urls = [...new Set([...(hot && Array.isArray(hot.urls) ? hot.urls : []), canonUrl(_oi.url)].filter(Boolean))];
_op.push({ title: (hot && hot.title) || _oi.title || '', urls, done_at: _of, skipped_at: _o10 });
}
return _op;
}
export function suppressed(topic, memory = [], { now = Date.now(), days = SKIP_DAYS } = {}) {
const canons = topic.canons || (topic.sources || []).map(_ov => canonUrl(_ov.url)).filter(Boolean);
const titles = topic.titles || [topic.title];
let _ot = '';
for (const m of memory || []) {
const _og = m.urls.some(u => canons.includes(u)) || (m.title && titles.some(t => _ow(t, m.title)));
if (!_og) continue;
if (m.done_at) return 'done';
if (m.skipped_at && now - m.skipped_at < days * D) _ot = 'skipped';
}
return _ot;
}
export function markRows(topic, action, { ideas = [], now = Date.now() } = {}) {
const at = action === 'done' ? 'done_at' : 'skipped_at';
const hot = { key: topic.key || topicKey(topic.title), title: topic.title, urls: (topic.canons || []).slice(0, 10), [at]: now };
const _ou = (topic.idea_ids || []).map(id => (ideas || []).find(_oi => _oi && _oi.id === id)).filter(_om).map(r => {
const d = pd(r.data);
return { ...r, status: action === 'done' ? 'done' : r.status, data: JSON.stringify({ ...d, hot: { ...(d.hot || {}), ...hot } }) };
});
if (_ou.length) return _ou;
return [{ title: _oe(topic.title, 160), url: topic.url || '', source: SOURCE, summary: _oe(topic.summary, 400), status: action === 'done' ? 'done' : 'rejected',
score: Number(topic.score) || 0,
data: JSON.stringify({ from: SOURCE, published: topic.published || null, source_name: (topic.sources[0] || {}).name || '',
sources: (topic.sources || []).slice(0, 10).map(_ov => ({ url: _ov.url, name: _ov.name })), hot }) }];
}
export function pickTopics({ ideas = [], fresh = null, feedItems = [], projects = [], customers = [], now = Date.now(), max = MAX_TOPICS } = {}) {
const _oc = { selling: sellingContext(projects), interest: interestStats(customers, projects, { now }), now };
const mem = memoryFrom(ideas);
return clusterNews(collectNews({ ideas, fresh, feedItems, now }))
.filter(c => !suppressed(c, mem, { now }))
.map(c => ({ ...c, ...scoreTopic(c, _oc) }))
.filter(t => t.relevant && t.score >= MIN_SCORE)
.sort((a, _o6) => Number(a.needs_check) - Number(_o6.needs_check) || _o6.score - a.score || _o6.published - a.published)
.slice(0, max);
}
export function videoInput(topic, { angle = '' } = {}) {
const _o12 = (topic.sources || []).filter(_ov => _ok(_ov.url));
const L = [];
if (_o12[0]) L.push(_o12[0].url);
L.push('Chủ đề: ' + _oe(topic.title, 200));
if (_o12.length > 1) L.push('Nguồn khác: ' + _o12.slice(1, 4).map(_ov => _ov.url).join(' , '));
if (angle) L.push('Góc kể: ' + _oe(angle, 240));
L.push('Yêu cầu: video giải thích tin này cho người mua nhà. Chỉ dùng số liệu có trong nguồn, ghi rõ nguồn; số chưa có nguồn thì bỏ, không đưa vào video. Giữ nguyên chữ "đề xuất/dự kiến/dự thảo" nếu nguồn ghi vậy. Không hứa tăng giá.');
return L.join('\n').slice(0, INPUT_MAX);
}
export function videoHash(topic, opts) {
return 'content/ideas?' + new URLSearchParams({ tab: 'video', from: 'hot', input: videoInput(topic, opts) }).toString();
}
const _o0 = {
ha_tang: ['đi lại thay đổi thế nào?', 'Chỉ công trình trên bản đồ, khu nào được kết nối, mốc tiến độ theo đúng nguồn.'],
quy_hoach: ['quy hoạch mới nói gì?', 'Đọc văn bản gốc: ranh giới, chức năng khu đất, đang ở bước đề xuất hay đã duyệt.'],
chinh_sach: ['người mua nhà cần biết gì?', 'Ai bị ảnh hưởng, áp dụng từ khi nào, khác trước ra sao – theo đúng văn bản.'],
lai_suat: ['vay mua nhà thay đổi gì?', 'Mức lãi suất theo nguồn ngân hàng, áp dụng cho ai – không khuyên vay.'],
};
export function defaultAngle(topic) {
const [q, a] = _o0[topic.category] || ['tin này ảnh hưởng gì tới người mua nhà?', 'Tóm tắt tin, nêu nguồn, nói rõ điều đã chắc và điều còn chờ.'];
const _ox = _oe(topic.title, 60).replace(/[\s,.;:–-]+$/, '');
return { title: _ox + ': ' + q, angle: a };
}
export function anglePrompt(topic, { interest = [] } = {}) {
const L = [
'Gợi ý 3 góc kể + tiêu đề video dọc (TikTok/Reels, 60–90 giây) cho kênh BĐS từ tin dưới đây.',
'Luật: chỉ dùng số liệu có trong tin/nguồn; không bịa số; giữ nguyên chữ "đề xuất/dự kiến/dự thảo"; không hứa tăng giá, không khuyên đầu tư/vay; tiêu đề ≤ 70 ký tự, không giật tít.',
'', 'Tin: ' + topic.title,
];
for (const _ov of (topic.summaries || [topic.summary]).filter(Boolean).slice(0, 3)) L.push('Tóm tắt: ' + _ov);
for (const _ov of (topic.sources || []).slice(0, 4)) L.push(`Nguồn: ${_ov.name} – ${_ov.url}`);
if (topic.why) L.push('Vì sao đáng làm: ' + topic.why);
const _oj = (interest || []).filter(_o14 => _o14.count > 0).slice(0, 5);
if (_oj.length) L.push('Khách đang quan tâm (chỉ số đếm, 7 ngày): ' + _oj.map(_o14 => `${_o14.project}: ${_o14.count} khách`).join('; '));
L.push('', 'Trả về DUY NHẤT JSON: {"angles":[{"title":"tiêu đề ≤ 70 ký tự","angle":"góc kể 1–2 câu"}]}');
return withRulesJson(L.join('\n'));
}
const _oo = _ov => (String(_ov || '').match(/\d+(?:[.,]\d+)*/g) || []).map(_o14 => _o14.replace(/[.,]$/, ''));
export function parseAngles(text, topic = {}) {
const _ov = String(text ?? '').trim();
const m = _ov.match(/```(?:json)?\s*([\s\S]*?)```/i);
let j = null;
const _o8 = [m ? m[1] : _ov];
for (const [o, c] of [['{', '}'], ['[', ']']]) { const _oi = _ov.indexOf(o), k = _ov.lastIndexOf(c); if (_oi >= 0 && k > _oi) _o8.push(_ov.slice(_oi, k + 1)); }
for (const _o6 of _o8) { try { j = JSON.parse(_o6); break; } catch { } }
const list = Array.isArray(j) ? j : (j && Array.isArray(j.angles) ? j.angles : []);
const _o11 = new Set(_oo([...(topic.titles || [topic.title]), ...(topic.summaries || [topic.summary])].join(' ')));
const _op = [];
for (const _o14 of list) {
if (!_o14 || typeof _o14 !== 'object') continue;
const title = _oe(_o14.title, 90);
if (!title) continue;
let angle = _oe(_o14.angle, 300);
const _on = _oo(title + ' ' + angle).some(n => !_o11.has(n));
if (_on && !angle.includes(UNVERIFIED)) angle = (angle ? angle + ' ' : '') + '(' + UNVERIFIED + ')';
_op.push({ title, angle, needs_check: _on });
if (_op.length >= 3) break;
}
return _op;
}
export const fmtDay = ms => { const d = new Date(ms); const _oq = n => String(n).padStart(2, '0'); return _oq(d.getDate()) + '/' + _oq(d.getMonth() + 1) + '/' + d.getFullYear(); };

import { norm, score as scoreIdea } from './ideas.js';
import { CHANNEL } from './video.js';
import { normalizeNews, DEFAULT_MARKET } from './freshnews.js';
import { FALLBACK_PRICES } from '../../../core/connections_logic.cff3dbca52.js';
const _o1 = 24 * 3600e3;
export const UNVERIFIED = 'chưa kiểm chứng';
export const AREAS = [
{ id: 'ocean_park', label: 'Gia Lâm / Long Biên', province: 'Hà Nội', projectAreas: ['Khu Mẫu B'],
kw: ['khu mau b', 'gia lam', 'van giang', 'van lam', 'trau quy', 'long bien', 'vinh tuy', 'thanh tri', 'me so', 'quoc lo 5', 'duong 5'] },
{ id: 'global_gate', label: 'Cổ Loa / Đông Anh', province: 'Hà Nội', projectAreas: ['Khu Mẫu A'],
kw: ['khu mau a', 'co loa', 'dong anh', 'tu lien', 'cau tu lien', 'me linh', 'soc son', 'bac thang long', 'nhat tan', 'vinh ngoc'] },
{ id: 'tay_ho_tay', label: 'Tây Hồ / Bắc Từ Liêm', province: 'Hà Nội', projectAreas: [],
kw: ['tay ho', 'tay ho', 'xuan la', 'du an mau 59', 'thuy khue', 'vo chi cong', 'bac tu liem', 'nhat tan', 'tu lien'] },
{ id: 'noi_do', label: 'Nội đô', province: 'Hà Nội', projectAreas: ['Nội đô'],
kw: ['noi do', 'hoan kiem', 'ba dinh', 'dong da', 'hai ba trung', 'thanh xuan', 'cau giay', 'nguyen trai', 'cao xa la', 'me tri', 'vanh dai 1', 'vanh dai 2'] },
{ id: 'smart_city', label: 'Tây Mỗ / Nam Từ Liêm', province: 'Hà Nội', projectAreas: ['Khu Mẫu D'],
kw: ['khu mau d', 'tay mo', 'dai mo', 'nam tu liem', 'dai lo thang long'] },
];
const _o0 = new Set(AREAS.flatMap(a => a.projectAreas));
const has = (_of, kw) => (' ' + _of + ' ').includes(' ' + kw + ' ');
const pd = _op => { if (_op && typeof _op === 'object') return _op; try { return JSON.parse(_op || '{}') || {}; } catch { return {}; } };
const isUrl = _op => /^https?:\/\/\S+$/i.test(String(_op || '').trim());
const _oc = _oo => _oo && !Number(_oo.deleted);
const _oi = _of => String(_of).padStart(2, '0');
const dmy = ms => { const _o6 = new Date(ms); return _oi(_o6.getDate()) + '/' + _oi(_o6.getMonth() + 1) + '/' + _o6.getFullYear(); };
export const areaOf = id => AREAS.find(a => a.id === id) || AREAS[0];
export const areaProvince = id => String((AREAS.find(a => a.id === id) || {}).province || '');
export function projectsIn(areaId, projects) {
const a = areaOf(areaId);
return (projects || []).filter(_oh => a.projectAreas.includes(_oh.area) || (!_o0.has(_oh.area) && a.kw.some(_ob => has(norm(_oh.loc), _ob))));
}
function _oe(text, a, _on) {
const _of = norm(text);
return a.kw.some(_ob => has(_of, _ob)) || _on.some(_oh => _oh.name && has(_of, norm(_oh.name)));
}
export function weekRange(now = Date.now()) {
const _o6 = new Date(now);
const from = new Date(_o6.getFullYear(), _o6.getMonth(), _o6.getDate() - ((_o6.getDay() + 6) % 7));
const to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 6, 23, 59, 59, 999);
const _ou = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 3);
const _oa = new Date(_ou.getFullYear(), 0, 4);
const _oy = 1 + Math.round(((_ou - _oa) / _o1 - 3 + ((_oa.getDay() + 6) % 7)) / 7);
return { from: from.getTime(), to: to.getTime(), key: _ou.getFullYear() + '-W' + _oi(_oy),
label: `Tuần ${_oi(from.getDate())}/${_oi(from.getMonth() + 1)} – ${_oi(to.getDate())}/${_oi(to.getMonth() + 1)}/${to.getFullYear()}` };
}
export function gather({ area, ideas = [], policies = [], customers = [], jobs = [], projects = [], feedItems = [], now = Date.now(), days = 7 } = {}) {
const a = areaOf(area);
const _on = projectsIn(a.id, projects);
const _ok = new Set(_on.map(_oh => _oh.id));
const _ol = id => (projects.find(_oh => _oh.id === id) || {}).name || id;
const since = now - days * _o1;
const _os = new Set();
const news = [];
const add = (id, title, url, source, published, summary, anyArea) => {
const key = url || title;
if (!title || _os.has(key) || published < since || (!anyArea && !_oe([title, summary].join(' '), a, _on))) return;
_os.add(key); news.push({ id, title: String(title).slice(0, 200), url: isUrl(url) ? url : '', source: source || '', published });
};
for (const _o7 of ideas) if (_oc(_o7) && _o7.status !== 'rejected' && _o7.source !== 'market') {
const _o6 = pd(_o7.data);
add(_o7.id, _o7.title, _o7.url, _o7.source, Number(_o6.published) || Number(_o7.updated_at) || 0, _o7.summary);
}
for (const _o8 of feedItems || []) add(_o8.link || _o8.title, _o8.title, _o8.link, _o8.source, Number(_o8.published) || 0, _o8.summary, _o8.area === a.id);
news.sort((x, y) => y.published - x.published);
const _o5 = (() => { const _o6 = new Date(now); return _o6.getFullYear() + '-' + _oi(_o6.getMonth() + 1); })();
const _om = policies.filter(_oh => _oc(_oh) && _oh.status === 'active' && _ok.has(_oh.project_id) && (Number(_oh.updated_at) >= now - 30 * _o1 || _oh.month === _o5))
.map(_oh => ({ id: _oh.id, project_id: _oh.project_id, project: _ol(_oh.project_id), month: _oh.month || '', effective_from: _oh.effective_from || '', note: String(_oh.note || '').slice(0, 200) }));
const dem = new Map();
for (const _o4 of customers) {
if (!_oc(_o4) || (_o4.kind && _o4.kind !== 'customer') || _o4.source !== 'landing' || !_ok.has(_o4.project)) continue;
const _oo = dem.get(_o4.project) || { project_id: _o4.project, project: _ol(_o4.project), count: 0, total: 0 };
_oo.total++; if (Number(_o4.created_at) >= since) _oo.count++;
dem.set(_o4.project, _oo);
}
const demand = [...dem.values()].sort((x, y) => y.count - x.count || y.total - x.total);
const _ox = jobs.filter(_o9 => _oc(_o9) && /^video_/.test(_o9.type || '') && Number(_o9.updated_at) >= since);
const videos = { done: _ox.filter(_o9 => _o9.status === 'done').length, queued: _ox.filter(_o9 => ['queued', 'running', 'waiting_approval'].includes(_o9.status)).length };
return { area: a.id, area_label: a.label, province: a.province || '', week: weekRange(now), since, now, projects: _on.map(_oh => _oh.name), news, policies: _om, demand, videos };
}
export function buildPrompt(g) {
const L = [];
L.push(`Viết BẢN TIN THỊ TRƯỜNG TUẦN cho khu vực ${g.area_label} (${g.week.label}) – kênh BĐS "${CHANNEL}", ${g.province || DEFAULT_MARKET}.`);
L.push('Luật bắt buộc: Không bịa số. Mọi con số phải lấy từ dữ liệu dưới đây hoặc từ link nguồn kèm theo; số không có nguồn thì ghi "(' + UNVERIFIED + ')".');
L.push('Giữ nguyên chữ "đề xuất/dự kiến/dự thảo" nếu nguồn ghi như vậy. Không hứa tăng giá, không khuyên đầu tư/vay. Không nhắc tên hay số điện thoại khách.');
L.push('', `Dự án trong khu vực: ${g.projects.join(', ') || '(chưa có)'}`);
L.push('', 'TIN TRONG 7 NGÀY (tiêu đề – nguồn – link):');
g.news.slice(0, 20).forEach(_of => L.push(`- ${_of.title} – ${_of.source || 'không rõ'} – ${_of.url || 'không có link'}`));
if (!g.news.length) L.push('- (không có tin – đừng tự nghĩ ra tin)');
L.push('', 'CHÍNH SÁCH ĐANG ÁP DỤNG (bảng chính sách của app, nguồn = "app"):');
g.policies.forEach(_oh => L.push(`- ${_oh.project}: ${_oh.note || 'chính sách tháng ' + _oh.month}${_oh.effective_from ? ' (từ ' + _oh.effective_from + ')' : ''}`));
if (!g.policies.length) L.push('- (không có)');
L.push('', 'NHU CẦU KHÁCH (khách để lại thông tin trên landing, chỉ đếm theo dự án, nguồn = "app"):');
g.demand.forEach(_o6 => L.push(`- ${_o6.project}: ${_o6.count} khách mới trong 7 ngày, tổng ${_o6.total}`));
if (!g.demand.length) L.push('- (chưa có)');
L.push('', `VIDEO 7 NGÀY: ${g.videos.done} video xong, ${g.videos.queued} đang chờ dựng.`);
L.push('', 'Bản tin gồm các mục: Tin chính (có link nguồn), Chính sách mới, Nhu cầu khách, Gợi ý chủ đề video, Lý do để gọi lại khách.');
L.push('Trả về DUY NHẤT một khối JSON: {"headline": "…", "main": [{"text": "…", "url": "link nguồn"}], "policies": [{"text": "…", "source": "app"}],' +
' "demand": [{"text": "…", "source": "app"}], "video_ideas": [{"title": "≤ 70 ký tự", "why": "…"}], "call_reasons": [{"project": "tên dự án", "reason": "câu ngắn để mở lời khi gọi"}]}');
return L.join('\n');
}
function _ow(item) {
const text = String(item.text || '').trim();
const _og = !/\d/.test(text) || isUrl(item.url) || item.source === 'app';
return { text: _og || text.includes(UNVERIFIED) ? text : text + ' (' + UNVERIFIED + ')', url: isUrl(item.url) ? item.url : '', source: item.source || '', verified: _og };
}
const _o2 = v => (Array.isArray(v) ? v : []).filter(x => x && typeof x === 'object');
export function parseReport(text) {
const _op = String(text ?? '').trim();
const _od = _op.match(/```(?:json)?\s*([\s\S]*?)```/i);
let _o9 = null;
for (const _o3 of [_od ? _od[1] : _op, _op.slice(_op.indexOf('{'), _op.lastIndexOf('}') + 1)]) { try { _o9 = JSON.parse(_o3); break; } catch { } }
if (!_o9 || typeof _o9 !== 'object' || Array.isArray(_o9)) return null;
if (!['main', 'policies', 'demand', 'video_ideas', 'call_reasons', 'headline'].some(_ob => _ob in _o9)) return null;
return {
headline: String(_o9.headline || '').slice(0, 160),
main: _o2(_o9.main).filter(x => x.text).map(_ow),
policies: _o2(_o9.policies).filter(x => x.text).map(_ow),
demand: _o2(_o9.demand).filter(x => x.text).map(x => _ow({ ...x, source: x.source || 'app' })),
video_ideas: _o2(_o9.video_ideas).filter(x => x.title).map(x => ({ title: String(x.title).slice(0, 120), why: String(x.why || '').slice(0, 300) })),
call_reasons: _o2(_o9.call_reasons).filter(x => x.reason).map(x => ({ project: String(x.project || '').slice(0, 80), reason: String(x.reason).slice(0, 300) })),
};
}
export function fallbackReport(g) {
const main = g.news.slice(0, 8).map(_of => ({ text: _of.title, url: _of.url, source: _of.source, verified: true }));
const policies = g.policies.map(_oh => ({ text: `${_oh.project}: ${_oh.note || 'chính sách tháng ' + _oh.month}${_oh.effective_from ? ' (áp dụng từ ' + _oh.effective_from.split('-').reverse().join('/') + ')' : ''}`, source: 'app', verified: true }));
const demand = g.demand.map(_o6 => ({ text: `${_o6.project}: ${_o6.count} khách mới trong 7 ngày (tổng ${_o6.total} khách landing)`, source: 'app', verified: true }));
const video_ideas = g.news.slice(0, 3).map(_of => ({ title: _of.title.slice(0, 90), why: 'Tin mới trong tuần' + (_of.source ? ' – ' + _of.source : '') }));
for (const _oh of g.policies.slice(0, 2)) video_ideas.push({ title: `Chính sách mới ${_oh.project} tháng ${_oh.month.split('-').reverse().join('/')}`, why: 'Giải thích chính sách (không khuyên vay)' });
const call_reasons = [];
for (const _oh of g.policies) call_reasons.push({ project: _oh.project, reason: 'Có chính sách mới: ' + (_oh.note || 'tháng ' + _oh.month) });
if (g.news[0]) {
const _ot = g.demand[0] ? g.demand[0].project : (g.projects[0] || g.area_label);
call_reasons.push({ project: _ot, reason: 'Có tin mới trong khu vực: ' + g.news[0].title });
}
return { headline: `${g.area_label} – ${g.week.label}`, main, policies, demand, video_ideas, call_reasons,
note: main.length ? '' : 'Tuần này chưa có tin khớp khu vực – bấm "Lấy tin mới" hoặc thêm chủ đề theo dõi ở Nguồn ý tưởng.' };
}
export function reportText(_oo, g) {
const L = [`BẢN TIN THỊ TRƯỜNG – ${g ? g.area_label + ' – ' + g.week.label : ''}`, _oo.headline || '', ''];
const _or = (title, list, fmt) => { L.push(title + ':'); if (!list.length) L.push('- (không có)'); list.forEach(x => L.push('- ' + fmt(x))); L.push(''); };
_or('Tin chính', _oo.main, x => x.text + (x.url ? ' – ' + x.url : ''));
_or('Chính sách mới', _oo.policies, x => x.text);
_or('Nhu cầu khách', _oo.demand, x => x.text);
_or('Gợi ý chủ đề video', _oo.video_ideas, x => x.title + (x.why ? ' (' + x.why + ')' : ''));
_or('Lý do để gọi lại khách', _oo.call_reasons, x => (x.project ? x.project + ': ' : '') + x.reason);
return L.join('\n').trim();
}
export function jobRow(_oo, g, { provider = '' } = {}) {
return {
type: 'market_report', status: 'done', cost_estimate: 0,
title: `Bản tin thị trường ${g.area_label} – ${g.week.label}`,
input: JSON.stringify({ area: g.area, week: g.week.key, since: g.since, counts: { news: g.news.length, policies: g.policies.length, demand: g.demand.reduce((_op, _o6) => _op + _o6.count, 0) } }),
output: JSON.stringify({ report: _oo, provider, text: reportText(_oo, g) }),
};
}
export function ideaFromSuggestion(_op, { area = '', week = '', now = Date.now() } = {}) {
const _oq = scoreIdea({ title: _op.title, summary: _op.why }, { now });
return { title: String(_op.title).slice(0, 160), summary: String(_op.why || ''), source: 'market', url: '', status: 'new', score: _oq.score,
data: JSON.stringify({ from: 'market_report', area, week, score_parts: _oq.parts }) };
}
export function reminderFromReason(_o4, { now = Date.now() } = {}) {
const _o6 = new Date(now);
return { object_id: '', kind: 'followup', title: `Gọi lại khách quan tâm ${_o4.project || 'khu vực'}: ${_o4.reason}`.slice(0, 200),
due_at: new Date(_o6.getFullYear(), _o6.getMonth(), _o6.getDate() + 1, 9, 0, 0).getTime(), remind_before_days: 0, amount: 0, installment: 0, done: 0,
data: JSON.stringify({ from: 'market_report' }) };
}
export const fmtDate = dmy;
export const LS_WRITE_AI = 'bds.market.write_ai';
export const LS_NEWS_AI = 'bds.market.news_ai';
export const WRITE_AI = [
{ id: 'gemini', label: 'Gemini – tự động', auto: true, hint: 'Gemini viết ngay trong app (miễn phí trong hạn mức của Google).' },
{ id: 'claude_api', label: 'Claude API – tự động, có phí', auto: true, paid: true, hint: 'Claude viết kỹ hơn; có phí theo lượt – app báo phí ước tính trước khi chạy, tính vào ngân sách AI tháng.' },
{ id: 'ollama', label: 'Ollama trên máy – miễn phí', auto: true, hint: 'AI chạy trên máy anh/chị: miễn phí, dữ liệu không ra ngoài; máy chưa bật Ollama thì app chuyển sang Gemini.' },
{ id: 'handoff_claude', label: 'Claude qua chat – 0 đồng', hint: 'App chép sẵn lời nhắn → mở Claude trên web → anh/chị dán câu trả lời (JSON) về.' },
{ id: 'handoff_gemini', label: 'Gemini qua chat – 0 đồng', hint: 'App chép sẵn lời nhắn → mở Gemini trên web → anh/chị dán câu trả lời (JSON) về.' },
{ id: 'app', label: 'Không dùng AI – từ dữ liệu app', hint: 'Bản tin nhanh chỉ từ tin đã lấy, chính sách, khách landing của app – không cần AI, không tốn phí.' },
];
export const NEWS_AI = [
{ id: 'rss', label: 'Nguồn RSS – miễn phí', hint: '' },
{ id: 'gemini', label: 'Gemini tìm Google – mất phí AI', auto: true, paid: true, hint: '💰 Mất phí AI (Gemini + tìm Google) – app báo chi phí trước khi chạy; cần ≥ 10 trang uy tín mới dùng được kết quả.' },
{ id: 'handoff_claude', label: 'Claude qua chat – 0 đồng', hint: 'App chép lời nhắn tìm tin → mở Claude trên web → anh/chị dán câu trả lời (JSON) về.' },
{ id: 'handoff_gemini', label: 'Gemini qua chat – 0 đồng', hint: 'App chép lời nhắn tìm tin → mở Gemini trên web → anh/chị dán câu trả lời (JSON) về.' },
];
export const PROVIDER_NAME = { app: 'dữ liệu app', gemini: 'Gemini', claude_api: 'Claude API', ollama: 'Ollama', handoff_claude: 'Claude (chat)', handoff_gemini: 'Gemini (chat)' };
export const choiceOf = (list, id) => list.find(a => a.id === id) || list[0];
function _oj(list, saved, { claudeEnabled = false, aiOff = false } = {}, offFallback) {
let id = list.some(a => a.id === saved) ? saved : list[0].id;
if (id === 'claude_api' && !claudeEnabled) id = 'gemini';
if (aiOff && choiceOf(list, id).auto) id = offFallback;
return id;
}
export const pickWriteAi = (saved, opts) => _oj(WRITE_AI, saved, opts, 'handoff_claude');
export const pickNewsAi = (saved, opts) => _oj(NEWS_AI, saved, opts, 'rss');
export function claudeEstimate(prompt, prices) {
const _oh = (prices && prices.claude_api) || FALLBACK_PRICES.claude_api;
const _ov = Math.ceil(String(prompt || '').length / 2) + 600, tout = 3000;
return { tokens_in: _ov, tokens_out: tout, usd: Math.round((_ov * _oh.in + tout * _oh.out) / 1e6 * 10000) / 10000 };
}
export function feedFromFresh(parsed, { area = '', at = Date.now() } = {}) {
return normalizeNews(parsed, { max: 20 }).map(_of => ({
title: _of.title, link: _of.source_url, source: _of.source_name, summary: _of.summary, area, via: 'ai',
published: (_of.date && Date.parse(_of.date + 'T12:00:00+07:00')) || at,
}));
}
export function mergeFeed(cur, add) {
const _os = new Set((cur || []).map(_o7 => _o7.link || _o7.title));
return [...(cur || []), ...(add || []).filter(_o7 => { const _ob = _o7.link || _o7.title; if (_os.has(_ob)) return false; _os.add(_ob); return true; })];
}

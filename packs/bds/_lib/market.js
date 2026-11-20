import { norm, score as scoreIdea } from './ideas.js';
import { CHANNEL, kenhBds } from './video.js';
import { normalizeNews, DEFAULT_MARKET } from './freshnews.js';
import { FALLBACK_PRICES } from '../../../core/connections_logic.cff3dbca52.js';
const D = 24 * 3600e3;
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
const _o1 = new Set(AREAS.flatMap(a => a.projectAreas));
const has = (_oh, kw) => (' ' + _oh + ' ').includes(' ' + kw + ' ');
const pd = _or => { if (_or && typeof _or === 'object') return _or; try { return JSON.parse(_or || '{}') || {}; } catch { return {}; } };
const _oa = _or => /^https?:\/\/\S+$/i.test(String(_or || '').trim());
const _oe = _oq => _oq && !Number(_oq.deleted);
const _ok = _oh => String(_oh).padStart(2, '0');
const dmy = ms => { const _o7 = new Date(ms); return _ok(_o7.getDate()) + '/' + _ok(_o7.getMonth() + 1) + '/' + _o7.getFullYear(); };
export const LS_CUSTOM_AREA = 'bds.market.custom_area';
export const CUSTOM_PREFIX = 'custom:';
const _o0 = /^(thanh pho|tp|tinh|quan|huyen|thi xa|thi tran|phuong|xa|khu do thi|kdt)\s+/;
export function customArea(place) {
const label = String((place && place.label) || '').replace(/\s+/g, ' ').trim().slice(0, 80);
const _oh = norm(label);
if (!_oh) return null;
const _ov = _oh.replace(_o0, '');
const kw = [...new Set([_oh, _ov].filter(Boolean))];
const _oz = String((place && place.tinh_thanh) || '').trim().slice(0, 60);
return { id: CUSTOM_PREFIX + _oh.replace(/ /g, '-'), label, tinh_thanh: _oz, province: _oz,
projectAreas: [], kw, keywords: kw, custom: true };
}
export const isCustom = a => !!(a && typeof a === 'object' && a.custom);
export const areaOf = id => (isCustom(id) ? id : AREAS.find(a => a.id === (id && typeof id === 'object' ? id.id : id)) || AREAS[0]);
export const areaProvince = id => { const a = isCustom(id) ? id : AREAS.find(x => x.id === id) || {}; return String(a.province || a.tinh_thanh || ''); };
export function projectsIn(areaId, projects) {
const a = areaOf(areaId);
if (a.custom) return [];
return (projects || []).filter(_oj => a.projectAreas.includes(_oj.area) || (!_o1.has(_oj.area) && a.kw.some(_od => has(norm(_oj.loc), _od))));
}
function _og(text, a, _op) {
const _oh = norm(text);
return a.kw.some(_od => has(_oh, _od)) || _op.some(_oj => _oj.name && has(_oh, norm(_oj.name)));
}
export function weekRange(now = Date.now()) {
const _o7 = new Date(now);
const from = new Date(_o7.getFullYear(), _o7.getMonth(), _o7.getDate() - ((_o7.getDay() + 6) % 7));
const to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 6, 23, 59, 59, 999);
const _ox = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 3);
const _oc = new Date(_ox.getFullYear(), 0, 4);
const _o13 = 1 + Math.round(((_ox - _oc) / D - 3 + ((_oc.getDay() + 6) % 7)) / 7);
return { from: from.getTime(), to: to.getTime(), key: _ox.getFullYear() + '-W' + _ok(_o13),
label: `Tuần ${_ok(from.getDate())}/${_ok(from.getMonth() + 1)} – ${_ok(to.getDate())}/${_ok(to.getMonth() + 1)}/${to.getFullYear()}` };
}
export function gather({ area, ideas = [], policies = [], customers = [], jobs = [], projects = [], feedItems = [], now = Date.now(), days = 7 } = {}) {
const a = areaOf(area);
const _op = projectsIn(a, projects);
const _om = new Set(_op.map(_oj => _oj.id));
const _on = id => (projects.find(_oj => _oj.id === id) || {}).name || id;
const since = now - days * D;
const _ou = new Set();
const news = [];
const add = (id, title, url, source, published, summary, anyArea) => {
const key = url || title;
if (!title || _ou.has(key) || published < since || (!anyArea && !_og([title, summary].join(' '), a, _op))) return;
_ou.add(key); news.push({ id, title: String(title).slice(0, 200), url: _oa(url) ? url : '', source: source || '', published });
};
for (const _o9 of ideas) if (_oe(_o9) && _o9.status !== 'rejected' && _o9.source !== 'market') {
const _o7 = pd(_o9.data);
add(_o9.id, _o9.title, _o9.url, _o9.source, Number(_o7.published) || Number(_o9.updated_at) || 0, _o9.summary);
}
for (const _ob of feedItems || []) add(_ob.link || _ob.title, _ob.title, _ob.link, _ob.source, Number(_ob.published) || 0, _ob.summary, _ob.area === a.id);
news.sort((x, y) => y.published - x.published);
const _o6 = (() => { const _o7 = new Date(now); return _o7.getFullYear() + '-' + _ok(_o7.getMonth() + 1); })();
const _oo = policies.filter(_oj => _oe(_oj) && _oj.status === 'active' && _om.has(_oj.project_id) && (Number(_oj.updated_at) >= now - 30 * D || _oj.month === _o6))
.map(_oj => ({ id: _oj.id, project_id: _oj.project_id, project: _on(_oj.project_id), month: _oj.month || '', effective_from: _oj.effective_from || '', note: String(_oj.note || '').slice(0, 200) }));
const dem = new Map();
for (const _o5 of customers) {
if (!_oe(_o5) || (_o5.kind && _o5.kind !== 'customer') || _o5.source !== 'landing' || !_om.has(_o5.project)) continue;
const _oq = dem.get(_o5.project) || { project_id: _o5.project, project: _on(_o5.project), count: 0, total: 0 };
_oq.total++; if (Number(_o5.created_at) >= since) _oq.count++;
dem.set(_o5.project, _oq);
}
const demand = [...dem.values()].sort((x, y) => y.count - x.count || y.total - x.total);
const _o11 = jobs.filter(j => _oe(j) && /^video_/.test(j.type || '') && Number(j.updated_at) >= since);
const videos = { done: _o11.filter(j => j.status === 'done').length, queued: _o11.filter(j => ['queued', 'running', 'waiting_approval'].includes(j.status)).length };
return { area: a.id, area_label: a.label, province: a.province || a.tinh_thanh || '', tinh_thanh: a.tinh_thanh || '', custom: !!a.custom, week: weekRange(now), since, now, projects: _op.map(_oj => _oj.name), news, policies: _oo, demand, videos };
}
export function buildPrompt(g, { channel = CHANNEL } = {}) {
const L = [];
const _o12 = g.custom && g.province && norm(g.province) !== norm(g.area_label) ? ` (${g.province})` : '';
L.push(`Viết BẢN TIN THỊ TRƯỜNG TUẦN cho khu vực ${g.area_label}${_o12} (${g.week.label}) – ${kenhBds(channel)}${g.custom ? '' : ', ' + (g.province || DEFAULT_MARKET)}.`);
L.push('Luật bắt buộc: Không bịa số. Mọi con số phải lấy từ dữ liệu dưới đây hoặc từ link nguồn kèm theo; số không có nguồn thì ghi "(' + UNVERIFIED + ')".');
L.push('Giữ nguyên chữ "đề xuất/dự kiến/dự thảo" nếu nguồn ghi như vậy. Không hứa tăng giá, không khuyên đầu tư/vay. Không nhắc tên hay số điện thoại khách.');
L.push('', `Dự án trong khu vực: ${g.projects.join(', ') || '(chưa có)'}`);
L.push('', 'TIN TRONG 7 NGÀY (tiêu đề – nguồn – link):');
g.news.slice(0, 20).forEach(_oh => L.push(`- ${_oh.title} – ${_oh.source || 'không rõ'} – ${_oh.url || 'không có link'}`));
if (!g.news.length) L.push('- (không có tin – đừng tự nghĩ ra tin)');
L.push('', 'CHÍNH SÁCH ĐANG ÁP DỤNG (bảng chính sách của app, nguồn = "app"):');
g.policies.forEach(_oj => L.push(`- ${_oj.project}: ${_oj.note || 'chính sách tháng ' + _oj.month}${_oj.effective_from ? ' (từ ' + _oj.effective_from + ')' : ''}`));
if (!g.policies.length) L.push('- (không có)');
L.push('', 'NHU CẦU KHÁCH (khách để lại thông tin trên landing, chỉ đếm theo dự án, nguồn = "app"):');
g.demand.forEach(_o7 => L.push(`- ${_o7.project}: ${_o7.count} khách mới trong 7 ngày, tổng ${_o7.total}`));
if (!g.demand.length) L.push('- (chưa có)');

L.push('', 'Bản tin gồm các mục: Tin chính (có link nguồn), Chính sách mới, Nhu cầu khách, Gợi ý nội dung đăng, Lý do để gọi lại khách.');
L.push('Trả về DUY NHẤT một khối JSON: {"headline": "…", "main": [{"text": "…", "url": "link nguồn"}], "policies": [{"text": "…", "source": "app"}],' +
' "demand": [{"text": "…", "source": "app"}], "video_ideas": [{"title": "≤ 70 ký tự", "why": "…"}], "call_reasons": [{"project": "tên dự án", "reason": "câu ngắn để mở lời khi gọi"}]}');
return L.join('\n');
}
function _o10(item) {
const text = String(item.text || '').trim();
const _oi = !/\d/.test(text) || _oa(item.url) || item.source === 'app';
return { text: _oi || text.includes(UNVERIFIED) ? text : text + ' (' + UNVERIFIED + ')', url: _oa(item.url) ? item.url : '', source: item.source || '', verified: _oi };
}
const _o2 = v => (Array.isArray(v) ? v : []).filter(x => x && typeof x === 'object');
export function parseReport(text) {
const _or = String(text ?? '').trim();
const _of = _or.match(/```(?:json)?\s*([\s\S]*?)```/i);
let j = null;
for (const _o4 of [_of ? _of[1] : _or, _or.slice(_or.indexOf('{'), _or.lastIndexOf('}') + 1)]) { try { j = JSON.parse(_o4); break; } catch { } }
if (!j || typeof j !== 'object' || Array.isArray(j)) return null;
if (!['main', 'policies', 'demand', 'video_ideas', 'call_reasons', 'headline'].some(_od => _od in j)) return null;
return {
headline: String(j.headline || '').slice(0, 160),
main: _o2(j.main).filter(x => x.text).map(_o10),
policies: _o2(j.policies).filter(x => x.text).map(_o10),
demand: _o2(j.demand).filter(x => x.text).map(x => _o10({ ...x, source: x.source || 'app' })),
video_ideas: _o2(j.video_ideas).filter(x => x.title).map(x => ({ title: String(x.title).slice(0, 120), why: String(x.why || '').slice(0, 300) })),
call_reasons: _o2(j.call_reasons).filter(x => x.reason).map(x => ({ project: String(x.project || '').slice(0, 80), reason: String(x.reason).slice(0, 300) })),
};
}
export function fallbackReport(g) {
const main = g.news.slice(0, 8).map(_oh => ({ text: _oh.title, url: _oh.url, source: _oh.source, verified: true }));
const policies = g.policies.map(_oj => ({ text: `${_oj.project}: ${_oj.note || 'chính sách tháng ' + _oj.month}${_oj.effective_from ? ' (áp dụng từ ' + _oj.effective_from.split('-').reverse().join('/') + ')' : ''}`, source: 'app', verified: true }));
const demand = g.demand.map(_o7 => ({ text: `${_o7.project}: ${_o7.count} khách mới trong 7 ngày (tổng ${_o7.total} khách landing)`, source: 'app', verified: true }));
const video_ideas = g.news.slice(0, 3).map(_oh => ({ title: _oh.title.slice(0, 90), why: 'Tin mới trong tuần' + (_oh.source ? ' – ' + _oh.source : '') }));
for (const _oj of g.policies.slice(0, 2)) video_ideas.push({ title: `Chính sách mới ${_oj.project} tháng ${_oj.month.split('-').reverse().join('/')}`, why: 'Giải thích chính sách (không khuyên vay)' });
const call_reasons = [];
for (const _oj of g.policies) call_reasons.push({ project: _oj.project, reason: 'Có chính sách mới: ' + (_oj.note || 'tháng ' + _oj.month) });
if (g.news[0]) {
const _ow = g.demand[0] ? g.demand[0].project : (g.projects[0] || g.area_label);
call_reasons.push({ project: _ow, reason: 'Có tin mới trong khu vực: ' + g.news[0].title });
}
return { headline: `${g.area_label} – ${g.week.label}`, main, policies, demand, video_ideas, call_reasons,
note: main.length ? '' : 'Tuần này chưa có tin khớp khu vực – bấm "Lấy tin mới" hoặc thêm chủ đề theo dõi ở Nguồn ý tưởng.' };
}
export function reportText(_oq, g) {
const L = [`BẢN TIN THỊ TRƯỜNG – ${g ? g.area_label + ' – ' + g.week.label : ''}`, _oq.headline || '', ''];
const _ot = (title, list, fmt) => { L.push(title + ':'); if (!list.length) L.push('- (không có)'); list.forEach(x => L.push('- ' + fmt(x))); L.push(''); };
_ot('Tin chính', _oq.main, x => x.text + (x.url ? ' – ' + x.url : ''));
_ot('Chính sách mới', _oq.policies, x => x.text);
_ot('Nhu cầu khách', _oq.demand, x => x.text);
_ot('Gợi ý nội dung đăng', _oq.video_ideas, x => x.title + (x.why ? ' (' + x.why + ')' : ''));
_ot('Lý do để gọi lại khách', _oq.call_reasons, x => (x.project ? x.project + ': ' : '') + x.reason);
return L.join('\n').trim();
}
export function jobRow(_oq, g, { provider = '' } = {}) {
return {
type: 'market_report', status: 'done', cost_estimate: 0,
title: `Bản tin thị trường ${g.area_label} – ${g.week.label}`,
input: JSON.stringify({ area: g.area, week: g.week.key, since: g.since, counts: { news: g.news.length, policies: g.policies.length, demand: g.demand.reduce((_or, _o7) => _or + _o7.count, 0) } }),
output: JSON.stringify({ report: _oq, provider, text: reportText(_oq, g) }),
};
}
export function ideaFromSuggestion(_or, { area = '', week = '', now = Date.now() } = {}) {
const _os = scoreIdea({ title: _or.title, summary: _or.why }, { now });
return { title: String(_or.title).slice(0, 160), summary: String(_or.why || ''), source: 'market', url: '', status: 'new', score: _os.score,
data: JSON.stringify({ from: 'market_report', area, week, score_parts: _os.parts }) };
}
export function reminderFromReason(_o5, { now = Date.now() } = {}) {
const _o7 = new Date(now);
return { object_id: '', kind: 'followup', title: `Gọi lại khách quan tâm ${_o5.project || 'khu vực'}: ${_o5.reason}`.slice(0, 200),
due_at: new Date(_o7.getFullYear(), _o7.getMonth(), _o7.getDate() + 1, 9, 0, 0).getTime(), remind_before_days: 0, amount: 0, installment: 0, done: 0,
data: JSON.stringify({ from: 'market_report' }) };
}
export const fmtDate = dmy;
export const LS_WRITE_AI = 'bds.market.write_ai';
export const LS_NEWS_AI = 'bds.market.news_ai';
export const WRITE_AI = [
{ id: 'gemini', label: 'Gemini – tự động', auto: true, hint: 'Gemini viết ngay trong app (miễn phí trong hạn mức của Google).' },
{ id: 'claude_api', label: 'Claude API – tự động, có phí', auto: true, paid: true, hint: 'Claude viết kỹ hơn; có phí theo lượt – app báo phí ước tính trước khi chạy, tính vào ngân sách AI tháng.' },
{ id: 'ollama', label: 'Ollama trên máy – miễn phí', auto: true, hint: 'AI chạy trên máy anh/chị: miễn phí, dữ liệu không ra ngoài; máy chưa bật Ollama thì app chuyển sang Gemini.' },
{ id: 'handoff_claude', label: 'Claude qua chat – 0 đồng', hint: 'App chép sẵn lời nhắn → mở Claude trên web → anh/chị dán câu trả lời về.' },
{ id: 'handoff_gemini', label: 'Gemini qua chat – 0 đồng', hint: 'App chép sẵn lời nhắn → mở Gemini trên web → anh/chị dán câu trả lời về.' },
{ id: 'app', label: 'Không dùng AI – từ dữ liệu app', hint: 'Bản tin nhanh chỉ từ tin đã lấy, chính sách, khách landing của app – không cần AI, không tốn phí.' },
];
export const NEWS_AI = [
{ id: 'rss', label: 'Nguồn RSS – miễn phí', hint: '' },
{ id: 'gemini', label: 'Gemini tìm Google – mất phí AI', auto: true, paid: true, hint: '💰 Mất phí AI (Gemini + tìm Google) – app báo chi phí trước khi chạy; cần ≥ 10 trang uy tín mới dùng được kết quả.' },
{ id: 'handoff_claude', label: 'Claude qua chat – 0 đồng', hint: 'App chép lời nhắn tìm tin → mở Claude trên web → anh/chị dán câu trả lời về.' },
{ id: 'handoff_gemini', label: 'Gemini qua chat – 0 đồng', hint: 'App chép lời nhắn tìm tin → mở Gemini trên web → anh/chị dán câu trả lời về.' },
];
export const PROVIDER_NAME = { app: 'dữ liệu app', gemini: 'Gemini', claude_api: 'Claude API', ollama: 'Ollama', handoff_claude: 'Claude (chat)', handoff_gemini: 'Gemini (chat)' };
export const choiceOf = (list, id) => list.find(a => a.id === id) || list[0];
function _ol(list, saved, { claudeEnabled = false, aiOff = false } = {}, offFallback) {
let id = list.some(a => a.id === saved) ? saved : list[0].id;
if (id === 'claude_api' && !claudeEnabled) id = 'gemini';
if (aiOff && choiceOf(list, id).auto) id = offFallback;
return id;
}
export const pickWriteAi = (saved, opts) => _ol(WRITE_AI, saved, opts, 'handoff_claude');
export const pickNewsAi = (saved, opts) => _ol(NEWS_AI, saved, opts, 'rss');
export function claudeEstimate(prompt, prices) {
const _oj = (prices && prices.claude_api) || FALLBACK_PRICES.claude_api;
const _oy = Math.ceil(String(prompt || '').length / 2) + 600, tout = 3000;
return { tokens_in: _oy, tokens_out: tout, usd: Math.round((_oy * _oj.in + tout * _oj.out) / 1e6 * 10000) / 10000 };
}
export function feedFromFresh(parsed, { area = '', at = Date.now() } = {}) {
return normalizeNews(parsed, { max: 20 }).map(_oh => ({
title: _oh.title, link: _oh.source_url, source: _oh.source_name, summary: _oh.summary, area, via: 'ai',
published: (_oh.date && Date.parse(_oh.date + 'T12:00:00+07:00')) || at,
}));
}
export const DEMAND_NOTE = 'Khách quan tâm = khách để lại thông tin (landing) ghi dự án thuộc khu vực này, mới trong 7 ngày; chỉ đếm, không lộ tên/số.';
export const interestedCount = g => ((g && g.demand) || []).reduce((_or, _o7) => _or + (Number(_o7.count) || 0), 0);
export function dataSummary(g) {
const _o8 = ms => { const _o7 = new Date(ms); return _ok(_o7.getDate()) + '/' + _ok(_o7.getMonth() + 1); };
return `Dữ liệu 7 ngày (từ ${_o8(g.since)} đến ${_o8(g.now)}) gồm: ${(g.news || []).length} bài báo · ${interestedCount(g)} khách quan tâm khu vực này · ${(g.policies || []).length} chính sách`;
}
export const PLACE_AI = WRITE_AI.filter(a => ['gemini', 'claude_api', 'handoff_claude', 'handoff_gemini'].includes(a.id));
export const LS_PLACE_AI = 'bds.market.place_ai';
export const pickPlaceAi = (saved, opts) => _ol(PLACE_AI, saved, opts, 'handoff_claude');
export function placePrompt(q) {
return [
`Người dùng app BĐS gõ tên một địa phương ở Việt Nam: "${String(q || '').slice(0, 80)}" (có thể không dấu, viết tắt hoặc sai chính tả).`,
'Gợi ý tối đa 8 tên địa phương có thật khớp nhất (tỉnh/thành phố, phường/xã, quận/huyện cũ hay khu vực/khu đô thị thường gọi).',
'Dùng đơn vị hành chính cấp tỉnh HIỆN HÀNH: 34 tỉnh/thành sau sáp nhập từ 01/7/2025 (Nghị quyết 202/2025/QH15). Tên viết đủ dấu tiếng Việt.',
'Không bịa địa danh. Không chắc thì bỏ, đừng đoán.',
'Trả về DUY NHẤT một khối JSON: {"items": [{"label": "tên thường gọi", "tinh_thanh": "tỉnh/thành hiện hành", "ghi_chu": "ngắn: tên cũ / thuộc đâu"}]}',
].join('\n');
}
export function parsePlaceSuggestions(text, { max = 8 } = {}) {
const _or = String(text ?? '').trim();
if (!_or) return [];
const _of = _or.match(/```(?:json)?\s*([\s\S]*?)```/i);
let j = null;
const _o3 = [_of ? _of[1] : _or];
for (const [o, _o5] of [['{', '}'], ['[', ']']]) { const _o9 = _or.indexOf(o), _od = _or.lastIndexOf(_o5); if (_o9 >= 0 && _od > _o9) _o3.push(_or.slice(_o9, _od + 1)); }
for (const _o4 of _o3) { try { j = JSON.parse(_o4); break; } catch { } }
const list = Array.isArray(j) ? j : (j && typeof j === 'object' ? (Array.isArray(j.items) ? j.items : Array.isArray(j.suggestions) ? j.suggestions : null) : null);
if (!list) return [];
const _ou = new Set(); const out = [];
for (const x of list) {
if (!x || typeof x !== 'object' || typeof x.label !== 'string') continue;
const label = x.label.replace(/\s+/g, ' ').trim().slice(0, 80);
if (!norm(label)) continue;
const _oz = typeof x.tinh_thanh === 'string' ? x.tinh_thanh.replace(/\s+/g, ' ').trim().slice(0, 60) : '';
const key = norm(label) + '|' + norm(_oz);
if (_ou.has(key)) continue;
_ou.add(key);
out.push({ label, tinh_thanh: _oz, ghi_chu: typeof x.ghi_chu === 'string' ? x.ghi_chu.trim().slice(0, 120) : '' });
if (out.length >= max) break;
}
return out;
}
export function mergeFeed(cur, add) {
const _ou = new Set((cur || []).map(_o9 => _o9.link || _o9.title));
return [...(cur || []), ...(add || []).filter(_o9 => { const _od = _o9.link || _o9.title; if (_ou.has(_od)) return false; _ou.add(_od); return true; })];
}

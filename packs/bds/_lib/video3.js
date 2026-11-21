import { findForbidden } from './video.js';
import { buildScenes } from './ideas.js';
import { haversineKm, kmText, DEFAULT_BRAND } from './render_plan.js';
export const FUNCS = [
{ id: 'map', icon: '🗺️', label: 'Video bản đồ kết nối', skill: 'bds-map-video',
desc: 'Tên dự án + tiện ích muốn thêm → AI đề xuất tiện ích, khoảng cách, nguồn → bản đồ vẽ sẵn, mỗi tiện ích một cảnh.' },
{ id: 'news', icon: '📰', label: 'Video quy hoạch / tin BĐS', skill: 'bds-quyhoach-video',
desc: 'Dán link bài báo hoặc chủ đề → bản phân tích ngắn + dàn cảnh có lời đọc, nguồn, tháng số liệu – anh/chị duyệt rồi mới dựng.' },
{ id: 'walk', icon: '🏠', label: 'Cảnh người xem căn hộ (AI)', skill: '',
desc: 'Mô tả căn hộ / phong cách (+ ảnh tham chiếu) → câu lệnh Veo/Flow ≤ 8 giây dọc 9:16 cảnh người đi xem nhà.' },
];
export const funcById = (id) => FUNCS.find((_op) => _op.id === id) || null;
export const MAX_POIS = 8;
export const MAX_SAY_WORDS = 15;
export const FIN_NOTE = 'Thông tin chính sách, không phải tư vấn tài chính.';
const _oj = (s) => String(s ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
const _ok = (s, n) => { const _o1h = _oj(s); return _o1h.length > n ? _o1h.slice(0, n - 1).trimEnd() + '…' : _o1h; };
export const words = (s) => _oj(s).split(' ').filter(Boolean).length;
const _ol = (s, n) => { const _o1i = _oj(s).split(' ').filter(Boolean); return _o1i.length > n ? _o1i.slice(0, n).join(' ').replace(/[,;:–-]+$/, '') + '.' : _oj(s); };
const fold = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
const _oq = (u) => { const s = String(u || '').trim(); try { return new URL(s).protocol === 'https:' ? s.slice(0, 1000) : ''; } catch { return ''; } };
const _os = (c) => /^#[0-9a-f]{6}$/i.test(String(c || ''));
const num = (_o1h) => (_o1h === null || _o1h === undefined || _o1h === '' ? NaN : Number(_o1h));
export function jsonFrom(text) {
if (text && typeof text === 'object') return text;
const s = String(text || '');
const _o10 = s.match(/```(?:json)?\s*([\s\S]*?)```/i);
for (const _oh of [_o10 && _o10[1], s, s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1)]) {
if (!_oh) continue;
try { const _ou = JSON.parse(_oh.trim()); if (_ou && typeof _ou === 'object') return _ou; } catch { }
}
return null;
}
const _o8 = /theo quy hoạch|dự kiến|đang triển khai|đang xây|đang thi công|dự thảo|đề xuất|chưa hoàn thành/i;
const _o5 = /metro|đường sắt|đường vành đai|vành đai|cao tốc|cầu|sân bay|nhà ga|\bga\b|đường trục|tuyến|khu đô thị mới|cảng/i;
export const STATUSES = { existing: 'Đã có', construction: 'Đang xây', approved: 'Đã duyệt, chưa xây', planned: 'Theo quy hoạch', draft: 'Dự thảo' };
const _o18 = (_o1f) => (_o1f === 'construction' ? 'đang triển khai' : _o1f === 'draft' ? 'dự thảo' : 'theo quy hoạch');
const _o3 = /lợi nhuận|sinh lời|tăng giá|chắc chắn|x2|x3|gấp đôi|đón sóng|cơ hội vàng|mua ngay|chốt ngay/i;
export const stripClaims = (s) => (_o3.test(String(s || '')) ? '' : _oj(s));
export const POI_TYPES = ['hospital', 'school', 'university', 'mall', 'market', 'park', 'golf', 'airport', 'metro', 'station', 'bridge', 'highway', 'road', 'water', 'beach', 'lake', 'center', 'office'];
export const MEASURES = { google: 'quãng đường Google Maps', cdt: 'theo chủ đầu tư', bao_chi: 'theo báo chí', chim_bay: 'đường chim bay' };
export const measureLabel = (_o17) => MEASURES[(_o17 && _o17.measure) || 'chim_bay'] || MEASURES.chim_bay;
export function buildMapPrompt({ name = '', extras = '', today = '' } = {}) {
return [
`Nghiên cứu dự án bất động sản "${_oj(name)}" để làm video bản đồ kết nối dọc 1080x1920 (25–45 giây)${today ? ' – hôm nay ' + today : ''}.`,
_oj(extras) ? `Tiện ích người dùng muốn thêm (ưu tiên giữ): ${_oj(extras)}.` : '',
`Chọn 5–${MAX_POIS} tiện ích tiêu biểu (trường, bệnh viện, TTTM, công viên, ga metro, cầu/cao tốc/vành đai, sân bay, trung tâm), tối đa ${MAX_POIS}, sắp xếp gần → xa.`,
'Quy tắc: KHÔNG bịa số liệu. Mỗi toạ độ và khoảng cách phải có nguồn (website chủ đầu tư, báo lớn, Google Maps, OSM) – ghi link vào "source".',
'Khoảng cách: ưu tiên quãng đường Google Maps (measure "google"), rồi số chủ đầu tư/báo chí (measure "cdt"/"bao_chi"). Không có nguồn thì để dist_text rỗng, measure "chim_bay" (app tự tính đường chim bay và ghi rõ "đường chim bay").',
'Hạ tầng chưa xong (metro, cầu, cao tốc, sân bay đang xây) đặt status "construction" hoặc "planned" và ghi "theo quy hoạch"/"dự kiến" trong câu mô tả.',
'Câu mô tả ≤ 45 ký tự, trung tính ("kết nối thuận tiện"); KHÔNG cam kết lợi nhuận, không "chắc chắn tăng giá", không "x2", không "đón sóng".',
'Địa chỉ hành chính mới nhất (tỉnh/huyện đã sáp nhập). Tên ngắn ≤ 18 ký tự. Màu thương hiệu từ website chính thức (nếu tìm được).',
`type thuộc: ${POI_TYPES.join(', ')}.`,
'Trả về DUY NHẤT JSON: {"project":{"name":"","short_name":"","developer":"","address":"","lat":0,"lon":0,"source":"https://…"},' +
'"brand":{"bg":"#0E2A3B","primary":"#C8A15A","accent":"#3FB6C9","source":""},' +
'"pois":[{"name":"","type":"school","lat":0,"lon":0,"dist_text":"~4,6 km","measure":"google|cdt|bao_chi|chim_bay","line":"","status":"existing|construction|planned","source":"https://…"}]}',
].filter(Boolean).join('\n');
}
function _o12(q, P) {
const name = _ok(q && q.name, 60);
if (!name) return null;
const lat = num(q.lat), lon = num(q.lon);
const _oz = Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180 && !(lat === 0 && lon === 0);
const status = STATUSES[q.status] ? q.status : 'existing';
const source = _oq(q.source);
let measure = MEASURES[q.measure] && q.measure !== 'chim_bay' ? q.measure : 'chim_bay';
let _on = _oj(q.dist_text).slice(0, 24);
const _o19 = P && Number.isFinite(num(P.lat)) && Number.isFinite(num(P.lon));
const km = _oz && _o19 ? haversineKm({ lat: +P.lat, lon: +P.lon }, { lat, lon }) : (() => { const _o10 = _on.match(/(\d+(?:[.,]\d+)?)/); return _o10 ? Number(_o10[1].replace(',', '.')) : Infinity; })();
if (!source || !_on) { measure = 'chim_bay'; _on = _oz && _o19 ? kmText(km) : ''; }
let line = _ok(stripClaims(q.line), 45);
if (status !== 'existing' && !_o8.test(name + ' ' + line)) line = line ? _ok(line, 30) + ' – ' + _o18(status) : _o18(status);
return { name, type: POI_TYPES.includes(q.type) ? q.type : 'center', lat: _oz ? lat : null, lon: _oz ? lon : null, dist_text: _on, measure, line, status, source, km: Number.isFinite(km) ? Math.round(km * 100) / 100 : null };
}
export function normalizeMapPlan(o = {}) {
const _o17 = (o && o.project) || {};
const lat = num(_o17.lat), lon = num(_o17.lon);
const _o15 = Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180 && !(lat === 0 && lon === 0);
const name = _ok(_o17.name, 80);
const _ob = name.length <= 18 ? name : name.split(' ').slice(-3).join(' ').slice(0, 18);
const project = { name, short_name: _ok(_o17.short_name, 18) || _ob, developer: _ok(_o17.developer, 60), address: _ok(_o17.address, 90), kicker: _ok(_o17.kicker || 'Vị trí & kết nối', 40),
lat: _o15 ? lat : null, lon: _o15 ? lon : null, source: _oq(_o17.source) };
const pois = (Array.isArray(o.pois) ? o.pois : []).map((q) => _o12(q, project)).filter(Boolean)
.sort((a, _oc) => (a.km ?? Infinity) - (_oc.km ?? Infinity)).slice(0, MAX_POIS);
const _o14 = (o && o.brand) || {};
const brand = { ...DEFAULT_BRAND };
for (const _ov of Object.keys(DEFAULT_BRAND)) if (_os(_o14[_ov])) brand[_ov] = _o14[_ov];
const _oa = pois.some((x) => x.measure === 'chim_bay');
return { fn: 'map', project, pois, brand, map_note: _oa ? 'Khoảng cách đường chim bay – bản đồ minh hoạ' : 'Bản đồ minh hoạ – vị trí tương đối',
sources: [project.source ? { name: 'Dự án', url: project.source } : null, ...pois.filter((x) => x.source).map((x) => ({ name: x.name, url: x.source }))].filter(Boolean) };
}
export const parseMapPlan = (text) => normalizeMapPlan(jsonFrom(text) || {});
export function mapFallback({ name = '', extras = '' } = {}) {
return normalizeMapPlan({ project: { name }, pois: String(extras || '').split(/[,;\n]+/).map((x) => ({ name: x })) });
}
const _oo = (_o17) => (_o17.dist_text ? 'khoảng ' + _o17.dist_text.replace(/^~\s*/, '') + (_o17.measure === 'chim_bay' ? ' đường chim bay' : '') : '');
export function mapScenes(plan, { contact = '' } = {}) {
const P = plan.project || {};
const _o1d = P.short_name || P.name || 'Dự án';
const _o16 = [{ kind: 'intro', text: [P.name, P.address].filter(Boolean).join('\n'), say: _ol([_o1d, P.address].filter(Boolean).join(', ') + '.', MAX_SAY_WORDS) }];
(plan.pois || []).forEach((q, _or) => _o16.push({ kind: 'poi', poi: _or, title: q.name, text: [q.name, q.dist_text].filter(Boolean).join(' · '), dist_text: q.dist_text, line: q.line,
say: _ol([q.name, _oo(q)].filter(Boolean).join(', ') + '.', MAX_SAY_WORDS) }));
_o16.push({ kind: 'outro', text: [_o1d + ' – kết nối thuận tiện', 'Liên hệ để nhận bảng giá', _oj(contact)].filter(Boolean).join('\n'),
say: _ol(`${_o1d}, kết nối thuận tiện. Liên hệ để nhận bảng giá.`, MAX_SAY_WORDS) });
return _o16;
}
export function mapConfig(plan, { contact = '', format = 'vertical' } = {}) {
const P = plan.project || {};
const _oc = plan.brand || DEFAULT_BRAND;
return {
format: format === 'horizontal' ? 'horizontal' : 'vertical',
brand: { bg: _oc.bg, primary: _oc.primary, accent: _oc.accent, text: _oc.text },
project: { name: P.name, short_name: P.short_name, kicker: P.kicker, address: P.address, lat: P.lat, lon: P.lon },
pois: (plan.pois || []).filter((q) => q.lat !== null && q.lon !== null).map((q) => {
const _o1a = { name: q.name, type: q.type, lat: q.lat, lon: q.lon };
if (q.measure !== 'chim_bay' && q.dist_text) _o1a.dist_text = q.dist_text;
_o1a.line = q.line || '';
return _o1a;
}),
outro: { headline: (P.short_name || P.name) + ' – kết nối trọn vẹn', cta: 'Liên hệ để nhận bảng giá', contact: _oj(contact) },
timing: { intro: 3, poi: 4, outro: 4.5 },
map_note: plan.map_note,
};
}
export const NEWS_KINDS = { hook: 'Mở đầu', doc: 'Văn bản gốc', map: 'Bản đồ', stat: 'Thẻ số liệu', compare: 'Trước / sau', timeline: 'Mốc thời gian', media: 'Hình ảnh', checklist: 'Kết – 3 câu kiểm tra' };
const _o4 = /lãi suất|lãi vay|tín dụng|cho vay|vay mua|vay vốn|ngân hàng|\bnhnn\b|thuế|lệ phí|phí trước bạ|trả góp/i;
export const isFinance = (text) => _o4.test(String(text || ''));
const _o2 = ['Văn bản đã có hiệu lực chưa?', 'Áp dụng cho ai, khu vực nào?', 'Xem văn bản gốc ở đâu?'];
export function buildNewsPrompt({ input = '', today = '' } = {}) {
return [
`Làm video dọc TikTok/Reels 60–90 giây cho kênh BĐS từ nội dung sau${today ? ' (hôm nay ' + today + ')' : ''}:`,
_oj(input).slice(0, 3000),
'Bước 1 – đọc và kiểm chứng: chủ đề, khu vực, công trình/chính sách, số liệu, mốc thời gian, văn bản gốc (số quyết định, ngày, trạng thái).',
'Bước 2 – bản phân tích ngắn để người dùng DUYỆT trước khi dựng (chưa dựng, chưa tạo giọng): tin gì (1–2 câu, nguồn, ngày), kiểu video ("map" bản đồ quy hoạch hoặc "news" bản tin đồ hoạ), hook (kiểu a câu hỏi / b con số lớn có nguồn / c chuyện có thật; có từ khoá chính), tiêu đề TikTok ≤ 60 ký tự.',
'Dàn cảnh 6–9 cảnh: cảnh 1 là hook, cảnh cuối là checklist 3 câu kiểm tra thông tin + mời theo dõi. Mỗi cảnh: chữ trên hình ("text") và lời đọc ("say") ≤ 15 chữ (≤ 4 giây), câu đủ ý.',
'Mọi con số phải có nguồn ("source" link) và tháng số liệu ("month" dạng 11/2026). Không có nguồn thì để trống – không bịa.',
'Trạng thái: existing / construction / approved / planned / draft. Dự thảo ghi "DỰ THẢO", không nói như đã áp dụng; hạ tầng chưa xong ghi "theo quy hoạch" hoặc "dự kiến". Đề xuất ghi rõ là đề xuất.',
'Không khuyên đầu tư, không hứa tăng giá, không giật tít ("x2", "đón sóng", "cơ hội vàng", "mua ngay").',
'Tin tài chính (lãi suất, thuế, tín dụng): CHỈ giải thích chính sách – ai ban hành, áp dụng cho ai, từ khi nào, số chính thức có nguồn + tháng. KHÔNG làm ví dụ tính trả góp/tiền lãi, KHÔNG so sánh lãi vay theo tên từng ngân hàng, KHÔNG hỏi hay khuyên về khoản vay cá nhân, KHÔNG dùng "vay ngay", "lãi thấp nhất", "nên vay", "đáo hạn". Cảnh cuối ghi "' + FIN_NOTE.replace(/\.$/, '') + '" (thông tin chính sách, không phải tư vấn tài chính).',
'Ảnh: không dùng ảnh/video của báo hay người khác; ảnh AI chỉ cảnh chung, không giả ảnh thật của công trình cụ thể.',
'Trả về DUY NHẤT JSON: {"summary":"","date":"","title":"","kind":"map|news","hook_type":"a|b|c","status":"existing|construction|approved|planned|draft",' +
'"sources":[{"name":"","url":"https://…"}],"scenes":[{"kind":"hook|doc|map|stat|compare|timeline|media|checklist","text":"","say":"","show":"hiện gì trên hình","facts":[{"text":"4,8 km","source":"https://…","month":"11/2026"}],"list":["chỉ cho checklist"]}]}',
].filter(Boolean).join('\n');
}
function _o11(_op) {
if (!_op || !_oj(_op.text)) return null;
return { text: _ok(_op.text, 80), source: _oq(_op.source), month: _ok(_op.month, 12) };
}
function _o13(s) {
if (!s) return null;
const text = _ok(s.text || s.title, 160), say = _ok(s.say, 300);
if (!text && !say) return null;
const _o16 = { kind: NEWS_KINDS[s.kind] ? s.kind : 'stat', text, say, show: _ok(s.show, 160), facts: (Array.isArray(s.facts) ? s.facts : []).map(_o11).filter(Boolean).slice(0, 6) };
if (Array.isArray(s.list)) _o16.list = s.list.map((x) => _ok(x, 90)).filter(Boolean).slice(0, 5);
if (_oq(s.image_url)) _o16.image_url = _oq(s.image_url);
if (_oq(s.audio_url)) _o16.audio_url = _oq(s.audio_url);
return _o16;
}
export function normalizeNewsPlan(o = {}, { input = '' } = {}) {
const status = STATUSES[o.status] ? o.status : 'existing';
let scenes = (Array.isArray(o.scenes) ? o.scenes : []).map(_o13).filter(Boolean).slice(0, 12);
const _o9 = [o.title, o.summary, input, ...scenes.map((s) => s.text + ' ' + s.say)].join(' ');
const finance = typeof o.finance === 'boolean' ? o.finance : isFinance(_o9);
if (status === 'draft' && scenes[0] && !/DỰ THẢO/.test(scenes[0].text)) scenes[0] = { ...scenes[0], text: 'DỰ THẢO: ' + scenes[0].text };
if (!scenes.length || scenes.at(-1).kind !== 'checklist') {
scenes.push({ kind: 'checklist', text: '3 câu nên kiểm tra', say: 'Trước khi tin, hãy tự hỏi ba câu.', show: 'Danh sách 3 câu hỏi', facts: [], list: _o2.slice() });
}
const _ox = scenes.at(-1);
if (!_ox.list || !_ox.list.length) _ox.list = _o2.slice();
if (finance && !/không phải tư vấn tài chính/i.test(_ox.text + ' ' + _ox.say)) _ox.text = _oj(_ox.text + '\n' + FIN_NOTE);
const sources = (Array.isArray(o.sources) ? o.sources : []).map((x) => (x && _oq(x.url) ? { name: _ok(x.name || new URL(x.url).hostname, 60), url: _oq(x.url) } : null)).filter(Boolean).slice(0, 10);
return { fn: 'news', title: _ok(o.title, 90), summary: _ok(o.summary, 400), date: _ok(o.date, 20), kind: o.kind === 'map' ? 'map' : 'news', hook_type: ['a', 'b', 'c'].includes(o.hook_type) ? o.hook_type : '',
status, finance, sources, scenes };
}
export const parseNewsPlan = (text, opts) => normalizeNewsPlan(jsonFrom(text) || {}, opts);
export function newsFallback({ input = '' } = {}) {
const s = String(input || '');
const url = (s.match(/https:\/\/\S+/) || [''])[0];
const text = _oj(s.replace(url, ' '));
const title = _ok(text || (url ? url.replace(/^https:\/\/(www\.)?/, '').split(/[/?#]/)[0] : 'Tin BĐS'), 90);
const _oc = buildScenes({ title, summary: text, url });
const scenes = _oc.scenes.map((x) => ({ kind: NEWS_KINDS[x.kind] ? x.kind : 'stat', text: x.title, say: '', show: x.title,
facts: (x.facts || []).map((_op) => ({ text: _op.text, source: _op.source || '', month: '' })) }));
return normalizeNewsPlan({ title, summary: text, status: /khởi công|đang thi công/i.test(text) ? 'construction' : 'existing', sources: url ? [{ name: '', url }] : [], scenes }, { input });
}
const _o0 = ['vietcombank', 'bidv', 'vietinbank', 'agribank', 'techcombank', 'mb bank', 'mbbank', 'vpbank', 'acb', 'sacombank', 'tpbank', 'hdbank', 'shb', 'vib', 'ocb', 'msb', 'seabank', 'eximbank', 'lpbank', 'shinhan', 'hsbc', 'uob', 'standard chartered'];
const _oe = (t) => { const _op = ' ' + fold(t).replace(/[^a-z0-9]+/g, ' ') + ' '; return _o0.filter((_oc) => _op.includes(' ' + _oc + ' ')); };
const _o6 = /trả góp|mỗi tháng (chỉ )?(trả|góp|đóng)|tiền lãi[^.\n]*\d|lãi phải trả|vay\s+\d+[^.\n]*(trả|lãi|năm)|góp \d/i;
const _o7 = /khoản vay của (bạn|anh|chị)|(bạn|anh chị) (đang|có) (đang )?vay|bạn nên vay|có nên vay/i;
const EXTRA_BAN = ['vay ngay', 'lãi thấp nhất', 'nên vay', 'đáo hạn', 'lãi suất thấp nhất', 'cam kết lợi nhuận', 'chắc chắn tăng', 'đón sóng', 'cơ hội vàng', 'mua ngay', 'x2'];
const _of = (t) => { const _ow = String(t || '').toLowerCase(); return [...new Set([...findForbidden(t).filter((_o1i) => !/(^|\s)(ai|ảnh ai)(\s|$)|ai-generated|ai generated|made with ai/.test(_o1i)), ...EXTRA_BAN.filter((_o1i) => _ow.includes(_o1i))])]; };
export function contentProblems(plan) {
const _o16 = [];
const add = (_or, level, msg) => _o16.push({ scene: _or, level, msg: (_or ? `Cảnh ${_or}: ` : '') + msg });
const scenes = (plan && plan.scenes) || [];
const _ot = plan && plan.fn === 'map';
const _o1f = plan && plan.status;
let _od = new Set();
scenes.forEach((s, _ov) => {
const _or = _ov + 1, t = [s.text, s.say, s.show, s.line, ...(s.list || [])].filter(Boolean).join(' \n ');
for (const _o1i of _of(t)) add(_or, 'error', `bỏ cụm "${_o1i}" (giật tít / khuyên vay / hứa lợi nhuận)`);
if (_o6.test(t)) add(_or, 'error', 'không làm ví dụ trả góp / tiền lãi cho người vay – tin tài chính chỉ giải thích chính sách');
if (_o7.test(t)) add(_or, 'error', 'không hỏi hay khuyên về khoản vay cá nhân của người xem');
const _og = _oe(t); _og.forEach((_oc) => _od.add(_oc));
if (_og.length >= 2 || (_og.length && /\d\s*%/.test(t) && plan && plan.finance)) add(_or, 'error', 'không so sánh lãi vay theo tên từng ngân hàng – dùng số chính thức (NHNN) có nguồn');
if (!_ot && s.kind !== 'checklist') {
if (words(s.say) > MAX_SAY_WORDS) add(_or, 'warn', `lời đọc dài hơn ~4 giây (${words(s.say)} chữ) – rút còn ≤ ${MAX_SAY_WORDS} chữ hoặc tách cảnh`);
const facts = s.facts || [];
for (const _op of facts) {
if (!_op.source) add(_or, 'warn', `số "${_op.text}" chưa có nguồn – thêm link nguồn và tháng số liệu`);
else if (!_op.month) add(_or, 'warn', `số "${_op.text}" thiếu tháng số liệu (vd 11/2026)`);
}
if (!facts.some((_op) => _op.source) && /\d/.test(String(s.text || '').replace(/^DỰ THẢO:\s*/, '')) && !facts.length) add(_or, 'warn', 'chữ trên hình có số nhưng chưa có nguồn – thêm số liệu kèm link nguồn và tháng');
if (_o1f && _o1f !== 'existing' && _o5.test(s.text + ' ' + s.say) && !_o8.test(s.text + ' ' + s.say)) add(_or, 'error', `công trình chưa xong – ghi "${_o18(_o1f)}" (theo quy hoạch/dự kiến)`);
}
});
if (_od.size >= 2 && plan && plan.finance && !_o16.some((x) => /ngân hàng/.test(x.msg))) add(0, 'error', 'không so sánh lãi vay theo tên từng ngân hàng');
if (_ot) {
const P = plan.project || {};
if (!P.name) add(0, 'error', 'thiếu tên dự án');
if (P.lat === null || P.lon === null) add(0, 'warn', 'chưa có toạ độ dự án – bản đồ không vẽ được ghim (chỉ còn thẻ chữ)');
(plan.pois || []).forEach((q) => {
if (!q.dist_text) add(0, 'warn', `"${q.name}": chưa có khoảng cách/toạ độ – điền toạ độ hoặc khoảng cách có nguồn`);
else if (q.measure === 'chim_bay') add(0, 'warn', `"${q.name}": ${q.dist_text} là đường chim bay (không có nguồn quãng đường)`);
if (q.status !== 'existing' && !_o8.test(q.name + ' ' + q.line)) add(0, 'error', `"${q.name}" chưa xong – ghi "theo quy hoạch"/"dự kiến"`);
});
if ((plan.pois || []).length > MAX_POIS) add(0, 'error', `tối đa ${MAX_POIS} tiện ích`);
} else if (plan && !(plan.sources || []).length) add(0, 'warn', 'chưa có link nguồn cho video');
if (plan && plan.finance && scenes.length && !/không phải tư vấn tài chính/i.test(scenes.at(-1).text + ' ' + scenes.at(-1).say)) add(scenes.length, 'error', 'cảnh cuối tin tài chính ghi "' + FIN_NOTE + '"');
return _o16;
}
export function canApprove(plan) {
const errors = contentProblems(plan).filter((x) => x.level === 'error');
return { ok: !errors.length && !!((plan && plan.scenes) || []).length, errors };
}
export function fixPlanned(plan) {
const _o1f = plan.status;
if (!_o1f || _o1f === 'existing') return plan;
return { ...plan, scenes: plan.scenes.map((s) => (s.kind !== 'checklist' && _o5.test(s.text + ' ' + s.say) && !_o8.test(s.text + ' ' + s.say)
? { ...s, text: _oj(s.text) + ' (' + _o18(_o1f) + ')' } : s)) };
}
export const WALK_STYLES = { modern: ['Hiện đại', 'modern, warm and minimal'], japandi: ['Japandi (tối giản Nhật – Bắc Âu)', 'Japandi, light oak wood, linen and soft neutral tones'],
indochine: ['Indochine', 'Indochine, rattan, patterned tiles and dark wood accents'], neoclassic: ['Tân cổ điển', 'neoclassical, moulded panels, marble and brass details'],
scandinavian: ['Bắc Âu', 'Scandinavian, white walls, light wood and soft textiles'] };
export const WALK_PEOPLE = { couple: ['Cặp vợ chồng trẻ', 'a young Vietnamese couple in smart-casual clothes'], family: ['Gia đình có con nhỏ', 'a Vietnamese family with a young child'],
single: ['Một người trẻ', 'a young Vietnamese professional'], senior: ['Hai ông bà', 'a Vietnamese couple in their sixties'] };
export const WALK_ACTIONS = { enter: ['Mở cửa bước vào', 'opens the front door and steps inside, pausing to take in the space'],
living: ['Đi qua phòng khách', 'walks slowly through the living room and looks out of the large window'],
balcony: ['Ra ban công ngắm cảnh', 'slides open the balcony door, steps out and rests both hands on the railing, looking at the view'],
kitchen: ['Xem bếp', 'moves to the kitchen island and lightly touches the countertop'],
bedroom: ['Mở rèm phòng ngủ', 'enters the bedroom and opens the curtains to let the morning light in'] };
export const WALK_NOTES = [
'Chỉ là cảnh chung minh hoạ – không giả làm ảnh/video thật của một dự án hay công trình cụ thể.',
'Khi đăng: BẬT NHÃN "Nội dung do AI tạo" của nền tảng (TikTok, Facebook, YouTube).',
'Không chèn chữ nhãn AI lên video – dùng công tắc nhãn của nền tảng khi đăng.',
'Không dùng mặt người thật khi chưa được đồng ý (quyền hình ảnh – Điều 32 Bộ luật Dân sự 2015).',
];
const _o1 = /chu dau tu|sun ?group|sunshine|lumi[eè]re|bim group|ảnh thật|y hệt|giống hệt|đúng như thật/i;
export function walkProblems(desc) {
const _o10 = String(desc || '').match(_o1);
return _o10 ? [`Mô tả có "${_o10[0]}": Video AI chỉ làm cảnh chung, không giả làm ảnh thật của dự án/công trình cụ thể – bỏ tên riêng khỏi câu lệnh.`] : [];
}
export function buildWalkPrompt({ desc = '', style = 'modern', people = 'couple', action = 'living', seconds = 8, character = null, hasImage = false } = {}) {
const _o1c = Math.max(4, Math.min(8, Math.round(Number(seconds) || 8)));
const _o1f = (WALK_STYLES[style] || WALK_STYLES.modern)[1];
const _o1j = character && _oj(character.lock_en) ? _oj(character.lock_en) : (WALK_PEOPLE[people] || WALK_PEOPLE.couple)[1];
const act = (WALK_ACTIONS[action] || WALK_ACTIONS.living)[1];
const _om = _oj(String(desc || '').replace(_o1, '')).slice(0, 600);
const _oy = [
`Vertical 9:16 video, ${_o1c} seconds, photorealistic, smooth gimbal camera at eye level, natural pace.`,
`SCENE: ${_o1j} viewing a generic apartment (not a real, identifiable building or project); the person ${act}.`,
_om ? `APARTMENT: ${_om}.` : '',
`STYLE: ${_o1f} interior, soft late-morning daylight.`,
character && _oj(character.lock_en) ? `CHARACTER LOCK (identical to the reference images): ${_oj(character.lock_en)}.` : '',
hasImage ? 'REFERENCE: use the uploaded reference image only for interior style, layout mood and colours – do not copy any real logo, signage or identifiable building.' : '',
'SOUND: quiet room ambience, no music, no voice.',
'AVOID: no on-screen text, no captions, no subtitles, no AI labels, no logos, no watermarks, no readable signs or brand names, no distorted hands or faces.',
].filter(Boolean);
return { prompt: _oy.join('\n'), negative: 'text, subtitles, watermark, logo, brand name, distorted face, extra fingers, low quality, blurry', seconds: _o1c, aspect: '9:16' };
}
const _o1g = (s) => { const t = fold(s).replace(/[^a-z0-9]+/g, ''); return t && t.length <= 30 ? '#' + t : ''; };
export function buildCaption({ title = '', keyword = '', facts = [], sources = [], area = '', fn = 'news' } = {}) {
const _oy = [_ok(stripClaims(title) || keyword || 'Tin BĐS', 60)];
for (const _op of (facts || []).map((x) => stripClaims(typeof x === 'string' ? x : x && x.text)).filter(Boolean).slice(0, 2)) _oy.push((_oy.length === 1 ? '📍 ' : '📊 ') + _ok(_op, 110));
_oy.push(fn === 'map' ? '✅ Anh/chị chị quan tâm tiện ích nào nhất? Bình luận để nhận thông tin chi tiết.' : '✅ Anh/chị chị thấy thông tin này thế nào? Bình luận ý kiến nhé.');
const _o1e = (sources || []).map((x) => _oj(x && (x.name || x.url))).filter(Boolean).slice(0, 3).join(', ');
_oy.push((_o1e ? 'Nguồn: ' + _o1e + '. ' : '') + 'Thông tin tham khảo, hãy tự kiểm chứng.');
const tags = [...new Set(['#batdongsan', fn === 'map' ? '#vitriduan' : '#quyhoach', _o1g(keyword), _o1g(area), '#tinbatdongsan', '#nhadat', '#bds', '#hanoi'].filter(Boolean))].slice(0, 8);
while (tags.length < 5) tags.push(['#muanha', '#canho', '#thitruong'][tags.length % 3]);
const text = _oy.slice(0, 5).join('\n');
return { text, tags, full: text + '\n' + tags.join(' ') };
}
export function claudeBrief(fn, { plan, scenes = [], contact = '', format = 'vertical', voice = '', character = null, walk = null } = {}) {
const _o1b = ['Quy tắc: không bịa số liệu, mọi con số có nguồn; hạ tầng chưa xong ghi "theo quy hoạch"/"dự kiến"; không cam kết lợi nhuận;',
'không dùng ảnh/video của người khác; ảnh/clip AI chỉ cảnh chung và nhắc bật nhãn AI khi đăng (không chèn chữ nhãn lên video).',
'Không tự đăng lên mạng xã hội – giao file MP4 + caption để tôi tự đăng.'].join(' ');
const sayList = (scenes || []).map((s, _or) => `${_or + 1}. [${s.kind}] ${_oj(s.text).replace(/\n/g, ' / ')}${s.say ? ' — lời đọc: "' + _oj(s.say) + '"' : ''}`).join('\n');
if (fn === 'map') {
const _oi = mapConfig(plan, { contact, format });
return ['Dùng skill bds-map-video để dựng video bản đồ kết nối. Dàn cảnh dưới đây tôi đã duyệt trong BDS Studio.',
'Config JSON (đúng mẫu mục 4 của skill):', '```json', JSON.stringify(_oi, null, 2), '```',
'Lời đọc gợi ý từng cảnh (≤ 4 giây/cảnh):', sayList,
'Bảng nguồn: ' + ((plan.pois || []).map((q) => `${q.name} | ${q.dist_text || '?'} | ${measureLabel(q)} | ${q.source || 'chưa có nguồn'}`).join('; ') || 'chưa có'),
voice ? 'Giọng đọc: ' + voice : '', _o1b].filter(Boolean).join('\n');
}
if (fn === 'walk') {
return ['Tạo clip Veo/Flow theo câu lệnh dưới (≤ 8 giây, dọc 9:16, cảnh chung người xem căn hộ).', '', (walk && walk.prompt) || '', '', _o1b].join('\n');
}
return ['Dùng skill bds-quyhoach-video. Dàn cảnh dưới đây tôi ĐÃ DUYỆT trong BDS Studio (coi như đã trả lời "ok") – làm trọn: kịch bản, bản đồ/bản tin đồ hoạ, giọng, phụ đề, caption.',
`Tin: ${plan.title || ''}${plan.summary ? ' – ' + plan.summary : ''}`, `Kiểu video: ${plan.kind === 'map' ? 'bản đồ quy hoạch' : 'bản tin đồ hoạ'} · Trạng thái: ${STATUSES[plan.status] || ''}${plan.finance ? ' · TIN TÀI CHÍNH: chỉ giải thích chính sách' : ''}`,
'Dàn cảnh:', sayList,
'Số liệu + nguồn: ' + ((plan.scenes || []).flatMap((s) => s.facts || []).map((_op) => `${_op.text} (${_op.source || 'chưa có nguồn'}${_op.month ? ', ' + _op.month : ''})`).join('; ') || 'chưa có'),
'Nguồn: ' + ((plan.sources || []).map((x) => x.url).join(' ') || 'chưa có'),
voice ? 'Giọng đọc: ' + voice : '', character && character.name ? 'Nhân vật: ' + character.name : '', _o1b].filter(Boolean).join('\n');
}

import { withRules, sourceState, SOURCE_LABEL } from '../../../shared/ai_rules.js';
import { jsonFrom, newsFallback, normalizeNewsPlan, buildWalkPrompt, STATUSES } from './video3.js';
import { sceneSeconds } from './render_plan.js';
export const QUESTION = 'Anh/chị muốn làm video dạng nào?';
export const PAY_LINE = 'Làm video cần dịch vụ AI bên ngoài (Gemini/Flow). Anh/chị tự nạp tiền cho từng dịch vụ theo gói của Google, app không thu thêm.';
export const LINK_GEMINI = 'Chưa nối Gemini – Chủ app vào Cài đặt › Kết nối dán khoá Gemini một lần để AI phân tích, tạo ảnh nhân vật.';
export const NO_NET_TEXT = 'Khoá hiện tại chưa tra được mạng. Anh/chị dán link hoặc tải tài liệu, hoặc tự nhập';
export const NOT_FOUND_TEXT = 'Em chưa tìm được, anh/chị tự nhập giúp em';
export const NO_MAP_TEXT = 'Chưa lấy được bản đồ, anh/chị tải ảnh bản đồ lên hoặc nhập tay';
export const MAP_ASK = 'Đúng khu này chưa?';
export const OLD_SERVER_IMAGE = 'Cần cập nhật máy chủ một lần (Cài đặt › Phiên bản) để Gemini tạo ảnh nhân vật. Trong lúc chờ, anh/chị tải ảnh của mình lên.';
export const KIT_LABEL = 'Thử nghiệm';
export const FLOW_URL = 'https://labs.google/fx/tools/flow';
export const KINDS = [
{ id: 'market', icon: '📈', label: 'Phân tích thị trường',
desc: 'Dán link bài báo → AI phân tích quy hoạch, giá vàng, lãi suất, tín dụng, pháp lý → ý tưởng quay → prompt tổng anh/chị sửa được.' },
{ id: 'map', icon: '🗺️', label: 'Bản đồ quy hoạch, metro',
desc: 'Dán link về khu, tuyến metro, đường mới → AI rút tên địa điểm → bản đồ vẽ từ dữ liệu OpenStreetMap → anh/chị duyệt khu.' },
{ id: 'home', icon: '🏠', label: 'Giới thiệu căn hộ',
desc: 'Nhập thông tin căn + ảnh căn → chọn nhân vật ảo → AI soạn cảnh nhân vật đi dạo trong căn giới thiệu bán (Veo/Flow).' },
];
export const kindById = (id) => KINDS.find((_ol) => _ol.id === id) || null;
const _o1 = { news: 'market', walk: 'home', map: 'map' };
export const kindFromParam = (fn) => (kindById(fn) ? fn : _o1[fn] || '');
export function needGeminiLink(ai) {
if (!ai) return true;
try {
if (typeof ai.availability === 'function') { const a = ai.availability() || {}; return a.known === false ? false : !a.gemini; }
if (typeof ai.connected === 'function') return !ai.connected();
} catch { return false; }
return false;
}
const _o8 = (_oz) => String(_oz ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
const _oa = (_oz, _or) => { const _o17 = _o8(_oz); return _o17.length > _or ? _o17.slice(0, _or - 1).trimEnd() + '…' : _o17; };
const _oj = (u) => { const _oz = String(u || '').trim(); try { return new URL(_oz).protocol === 'https:' ? _oz.slice(0, 1000) : ''; } catch { return ''; } };
const fold = (_oz) => String(_oz ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
const RULES_VIDEO = 'Không khuyên đầu tư, không hứa tăng giá, không giật tít ("x2", "đón sóng", "cơ hội vàng", "mua ngay", "vay ngay"). Tin tài chính chỉ giải thích chính sách: KHÔNG làm ví dụ tính trả góp/tiền lãi, KHÔNG so sánh lãi vay theo tên từng ngân hàng, KHÔNG khuyên vay. Hạ tầng chưa xong ghi "theo quy hoạch" hoặc "dự kiến".';
export const FACTORS = [['quy_hoach', 'Quy hoạch'], ['gia_vang', 'Giá vàng'], ['lai_suat', 'Lãi suất'], ['tin_dung', 'Tín dụng'], ['phap_ly', 'Pháp lý']];
export function buildMarketPrompt({ input = '', numbers = 'link', today = '' } = {}) {
return withRules([
`Phân tích thị trường bất động sản để làm video dọc TikTok/Reels 45–75 giây${today ? ' (hôm nay ' + today + ')' : ''} từ nội dung sau:`,
_o8(input).slice(0, 3000),
'Bước 1: phân tích yếu tố ảnh hưởng BĐS trong nội dung: quy hoạch, giá vàng, lãi suất, tín dụng, pháp lý (yếu tố nào không có trong nguồn thì bỏ, không đoán).',
numbers === 'fresh'
? 'Số liệu: tra Google lấy số MỚI NHẤT cho từng yếu tố, mỗi số kèm link nguồn ("source") và tháng ("month", dạng 11/2026).'
: 'Số liệu: CHỈ dùng số có trong link/nội dung trên, mỗi số kèm link nguồn và tháng. Không đọc được link thì nói rõ, để trống – không lấy số ở nơi khác.',
'Bước 2: 2–4 ý tưởng quay video (tiêu đề ≤ 60 ký tự + góc kể).',
'Bước 3: dàn cảnh 5–8 cảnh: "text" chữ trên hình, "say" lời đọc ≤ 15 chữ (≈ 4 giây). Cảnh cuối là 3 câu kiểm tra thông tin.',
RULES_VIDEO,
'Trả về DUY NHẤT JSON: {"title":"","summary":"","status":"existing|construction|approved|planned|draft",' +
'"factors":[{"id":"quy_hoach|gia_vang|lai_suat|tin_dung|phap_ly","name":"","effect":"","source":"https://…"}],' +
'"ideas":[{"title":"","angle":""}],"facts":[{"label":"","text":"","source":"https://…","month":""}],' +
'"scenes":[{"kind":"hook|stat|compare|timeline|media|checklist","text":"","say":""}],"sources":[{"name":"","url":"https://…"}]}',
].filter(Boolean).join('\n'));
}
function _os(_oe) {
if (!_oe) return null;
const label = _oa(_oe.label, 60), source = _oj(_oe.source), by = _oe.by === 'sale' ? 'sale' : '';
const text = by || source ? _oa(_oe.text, 80) : '';
if (!label && !_o8(_oe.text)) return null;
return { label: label || _oa(_oe.text, 60), text, source, month: _oa(_oe.month, 12), by };
}
export const factLabel = (_oe) => SOURCE_LABEL[sourceState({ value: _oe && _oe.text, source: _oe && _oe.source, by: _oe && _oe.by })];
export function parseMarket(text, { input = '' } = {}) {
const _ot = jsonFrom(text);
if (!_ot || !Array.isArray(_ot.scenes) || !_ot.scenes.length) {
const fb = newsFallback({ input });
return { ...fb, fn: 'news', factors: [], ideas: [], facts: [], fallback: true };
}
const plan = normalizeNewsPlan(_ot, { input });
const factors = (Array.isArray(_ot.factors) ? _ot.factors : []).map((_o19) => (_o19 && _o8(_o19.name) ? { id: FACTORS.some(([_ol]) => _ol === _o19.id) ? _o19.id : '', name: _oa(_o19.name, 40), effect: _oa(_o19.effect, 200), source: _oj(_o19.source) } : null)).filter(Boolean).slice(0, 8);
const ideas = (Array.isArray(_ot.ideas) ? _ot.ideas : []).map((_o19) => (_o19 && _o8(_o19.title) ? { title: _oa(_o19.title, 90), angle: _oa(_o19.angle, 200) } : null)).filter(Boolean).slice(0, 5);
const facts = (Array.isArray(_ot.facts) ? _ot.facts : []).map(_os).filter(Boolean).slice(0, 12);
return { ...plan, factors, ideas, facts };
}
export function groundingResult(r) {
if (!r || typeof r !== 'object' || !Array.isArray(r.sources)) return { ok: false, reason: 'old_server' };
const sources = r.sources.map((_oz) => (_oz && _oj(_oz.url) ? { name: _oa(_oz.title || _oz.name || new URL(_oz.url).hostname, 80), url: _oj(_oz.url) } : null)).filter(Boolean);
return { ok: true, text: String(r.text || ''), sources };
}
export function groundingError(e) {
if (!e || typeof e !== 'object') return '';
if (e.code === 'NO_GROUNDING') return 'no_grounding';
if (e.missingAction === true || e.code === 'UNKNOWN_ACTION') return 'old_server';
if (e.code === 'BAD_INPUT' && /không được hỗ trợ|not supported|unknown action|grounding/i.test(String(e.serverMessage || e.message || ''))) return 'old_server';
return '';
}
export function buildMapPrompt({ input = '', today = '' } = {}) {
return withRules([
`Đây là yêu cầu làm video giới thiệu một khu vực hoặc tuyến (quy hoạch, metro, đường mới)${today ? ' – hôm nay ' + today : ''}:`,
_o8(input).slice(0, 3000),
'Rút ra tên địa điểm cụ thể (tên phường/xã, quận/huyện, ga, nút giao, đầu tuyến – cuối tuyến) có trong nguồn để app tra toạ độ trên OpenStreetMap. Tên phải đủ để tìm được (vd "Ga Văn Cao, Hà Nội"). Không có trong nguồn thì không thêm.',
'mode = "route" nếu là một tuyến (metro, đường, cầu) – khi đó "route" là các điểm theo thứ tự trên tuyến; còn lại mode = "area".',
'Tóm tắt 1–2 câu (nguồn, ngày); trạng thái công trình: existing / construction / approved / planned / draft.',
RULES_VIDEO,
'Trả về DUY NHẤT JSON: {"mode":"area|route","title":"","summary":"","status":"","places":["tên địa điểm"],"route":["điểm theo thứ tự"],"source":"https://…"}',
].join('\n'));
}
export function splitPlaces(text) {
const _o12 = new Set();
return String(text || '').split(/[;\n]+/).map((_o19) => _oa(_o19, 80)).filter((_o19) => { const _ol = fold(_o19); if (!_o19 || _o12.has(_ol)) return false; _o12.add(_ol); return true; }).slice(0, 12);
}
export function parseMapExtract(text) {
const _ot = jsonFrom(text) || {};
const list = (a) => splitPlaces((Array.isArray(a) ? a : []).map((_o19) => String(_o19 == null ? '' : _o19).replace(/[;\n]/g, ' ')).join('\n'));
return { mode: _ot.mode === 'route' ? 'route' : 'area', title: _oa(_ot.title, 90), summary: _oa(_ot.summary, 400), status: STATUSES[_ot.status] ? _ot.status : 'existing',
places: list(_ot.places), route: list(_ot.route), source: _oj(_ot.source) };
}
export function mapScenes({ title = '', places = [], mode = 'area', status = 'existing' } = {}) {
const t = _oa(title, 80) || (places[0] && places[0].name) || 'Khu vực';
const _oy = status && status !== 'existing' ? ' (theo quy hoạch)' : '';
const _ou = [{ kind: 'intro', text: t + _oy, say: _oa(`${t}${_oy}, cùng xem trên bản đồ.`, 90) }];
places.slice(0, 8).forEach((_ov, i) => _ou.push({ kind: 'place', text: _ov.name, say: mode === 'route' ? (i === 0 ? `Điểm đầu tuyến: ${_ov.name}.` : `Tiếp theo: ${_ov.name}.`) : `${_ov.name}.` }));
_ou.push({ kind: 'outro', text: 'Theo dõi để cập nhật quy hoạch', say: 'Theo dõi kênh để cập nhật thông tin quy hoạch mới.' });
return _ou;
}
const _o2 = [['living', 'phòng khách'], ['kitchen', 'bếp'], ['bedroom', 'phòng ngủ'], ['balcony', 'ban công']];
export function buildHomePrompt({ info = '', character = null, photos = 0 } = {}) {
return withRules([
'Soạn video dọc 9:16 giới thiệu BÁN một căn hộ: một nhân vật ảo đi dạo trong căn và nói với người xem. Thông tin căn sale nhập (gộp một ô):',
_o8(info).slice(0, 2000),
photos ? `Có ${photos} ảnh căn kèm theo – chỉ mô tả những gì thấy trong ảnh.` : 'Không có ảnh căn – mô tả chung, không bịa chi tiết nội thất.',
character && _o8(character.lock_en) ? `Nhân vật (giữ đúng ngoại hình): ${_o8(character.lock_en)}` : '',
'Tự phân tích thông tin (diện tích, số phòng, hướng, giá…) và đưa vào lời thoại tiếng Việt; số nào sale không ghi thì KHÔNG thêm.',
'Dàn 3–5 cảnh ≤ 8 giây: mỗi cảnh "say" lời thoại tiếng Việt ≤ 20 chữ và "prompt" câu lệnh tiếng Anh cho Veo/Flow (nhân vật đi dạo, phòng nào, máy quay), cảnh chung không chữ trên hình, không logo.',
'Không hứa tăng giá, không cam kết lợi nhuận.',
'Trả về DUY NHẤT JSON: {"summary":"","scenes":[{"room":"living|kitchen|bedroom|balcony","say":"","prompt":""}]}',
].filter(Boolean).join('\n'));
}
const _o18 = { living: 'living', kitchen: 'kitchen', bedroom: 'bedroom', balcony: 'balcony' };
function _oi(extra, character, room) {
const _o5 = buildWalkPrompt({ desc: '', action: _o18[room] || 'living', seconds: 8, character });
return extra ? _o5.prompt.replace(/\nSTYLE:/, `\nACTION: ${_o8(extra).slice(0, 500)}.\nSTYLE:`) : _o5.prompt;
}
function _oh(info) {
const _oz = _o8(info);
const _ox = (re) => { const _oo = _oz.match(re); return _oo ? _o8(_oo[0]) : ''; };
return { area: _ox(/\d+(?:[.,]\d+)?\s*m(?:2|²)/i), rooms: _ox(/\d+\s*(?:PN|phòng ngủ|N\b)/i), price: _ox(/\d+(?:[.,]\d+)?\s*(?:tỷ|triệu)(?:\s*\d+)?/i), dir: _ox(/hướng\s+[A-Za-zÀ-ỹ ]{2,20}?(?=[,.;]|$)/i) };
}
export function parseHome(text, { info = '', character = null } = {}) {
const _ot = jsonFrom(text);
const _o11 = (_ot && Array.isArray(_ot.scenes) ? _ot.scenes : []).map((_o19) => (_o19 && _o8(_o19.say) && _o8(_o19.prompt) ? { room: _o18[_o19.room] ? _o19.room : 'living', say: _oa(_o19.say, 160), extra: _oa(_o19.prompt, 500) } : null)).filter(Boolean).slice(0, 6);
if (_o11.length) return { summary: _oa(_ot.summary, 300), scenes: _o11.map((_oz) => ({ kind: 'room', text: (_o2.find(([_ol]) => _ol === _oz.room) || _o2[0])[1], say: _oz.say, prompt: _oi(_oz.extra, character, _oz.room), seconds: 8 })) };
const _o4 = _oh(info);
const _of = ['Chào anh/chị chị, mời xem căn hộ', _o4.rooms, _o4.area].filter(Boolean).join(' ') + '.';
const _o10 = [_of, _o4.dir ? `Phòng khách sáng, ${_o4.dir}.` : 'Phòng khách rộng, đón nắng tự nhiên.', 'Bếp gọn, tiện nấu nướng.', _o4.price ? `Giá bán ${_o4.price}, liên hệ để xem nhà.` : 'Liên hệ để nhận giá và lịch xem nhà.'];
const rooms = ['living', 'living', 'kitchen', 'balcony'];
return { summary: _oa(info, 300), fallback: true, scenes: _o10.map((say, i) => ({ kind: 'room', text: (_o2.find(([_ol]) => _ol === rooms[i]) || _o2[0])[1], say, prompt: _oi('', character, rooms[i]), seconds: 8 })) };
}
export function buildCharImagePrompt({ lock_en = '', name = '' } = {}) {
return withRules([
'Create ONE photorealistic portrait image of a fictional person (not a real, famous or existing person) to be used as a consistent presenter in real-estate videos.',
`CHARACTER${name ? ` ("${_o8(name).slice(0, 40)}")` : ''}: ${_o8(lock_en).slice(0, 1200)}`,
'Vertical 9:16, half-body, friendly expression, plain light studio background, soft even lighting, natural skin texture.',
'AVOID: no text, no logos, no watermark, no extra people, no distorted hands or face.',
].join('\n'));
}
export function imageOldServer(e) {
return !!e && typeof e === 'object' && (e.missingAction === true || e.code === 'UNKNOWN_ACTION' || (e.code === 'BAD_INPUT' && /không được hỗ trợ|not supported|unknown action/i.test(String(e.serverMessage || e.message || ''))));
}
export const imageErrorText = (e) => (imageOldServer(e) ? OLD_SERVER_IMAGE : String((e && (e.userMessage || e.message)) || 'Chưa tạo được ảnh – thử lại sau.'));
export function imageDataUrl(r) {
if (!r || !/^image\/(png|jpeg|webp)$/.test(String(r.mime || '')) || typeof r.b64 !== 'string' || !/^[A-Za-z0-9+/=\s]+$/.test(r.b64)) return '';
return 'data:' + r.mime + ';base64,' + r.b64.replace(/\s+/g, '');
}
export function buildMasterPrompt({ kind = 'market', title = '', idea = null, scenes = [], character = null, summary = '' } = {}) {
const _ol = kindById(kind) || KINDS[0];
return [
`VIDEO: ${_ol.label} – ${_o8(title) || 'chưa có tiêu đề'}`,
'Khung: dọc 9:16 (TikTok/Reels), 30–75 giây, ghép bằng CapCut.',
idea && _o8(idea.title) ? `Ý tưởng: ${_o8(idea.title)}${idea.angle ? ' – ' + _o8(idea.angle) : ''}` : '',
_o8(summary) ? `Tóm tắt: ${_o8(summary)}` : '',
character ? `Nhân vật: ${_o8(character.name) || 'nhân vật ảo'}${_o8(character.lock_en) ? ' – ' + _o8(character.lock_en) : ''}` : 'Nhân vật: không (faceless – giọng đọc + bản đồ/ảnh, không người).',
'Cảnh:',
...scenes.map((_oz, i) => `${i + 1}. ${_o8(_oz.text).replace(/\n/g, ' / ')}${_oz.say ? ' — lời đọc: "' + _o8(_oz.say) + '"' : ''}`),
'Quy tắc: mọi số có nguồn; không hứa tăng giá; hạ tầng chưa xong ghi "theo quy hoạch"; ảnh/clip AI chỉ cảnh chung, khi đăng bật nhãn nội dung AI của nền tảng.',
].filter(Boolean).join('\n');
}
const _ow = (_or, w = 2) => String(_or).padStart(w, '0');
export function srtTime(sec) {
const _oq = Math.max(0, Math.round(Number(sec || 0) * 1000));
return `${_ow(Math.floor(_oq / 3600000))}:${_ow(Math.floor(_oq / 60000) % 60)}:${_ow(Math.floor(_oq / 1000) % 60)},${_ow(_oq % 1000, 3)}`;
}
export function timeline(scenes = []) {
let t = 0;
return scenes.map((_oz, i) => { const _ob = sceneSeconds(_oz); const _o19 = { i, start: Math.round(t * 1000) / 1000, end: Math.round((t + _ob) * 1000) / 1000, seconds: _ob }; t += _ob; return _o19; });
}
export function buildSrt(scenes = []) {
const _o15 = timeline(scenes);
let _or = 0;
return scenes.map((_oz, i) => (_o8(_oz.say) ? `${++_or}\n${srtTime(_o15[i].start)} --> ${srtTime(_o15[i].end)}\n${_o8(_oz.say)}\n` : '')).filter(Boolean).join('\n');
}
const csvCell = (_o17) => '"' + String(_o17 ?? '').replace(/"/g, '""').replace(/\r?\n/g, ' / ') + '"';
export function sceneCsv(scenes = [], { clips = {} } = {}) {
const _o15 = timeline(scenes);
return ['STT,Bắt đầu,Kết thúc,Giây,Chữ trên hình,Lời đọc,Tệp',
...scenes.map((_oz, i) => [i + 1, csvCell(srtTime(_o15[i].start)), csvCell(srtTime(_o15[i].end)), String(_o15[i].seconds), csvCell(_o8(_oz.text)), csvCell(_o8(_oz.say)), csvCell(clips[i] || '')].join(','))].join('\n') + '\n';
}
const _op = (_o17) => String(_o17 ?? '').replace(/\|/g, '/').replace(/\r?\n/g, ' ');
export function sceneMd(scenes = [], { title = '', clips = {} } = {}) {
const _o15 = timeline(scenes);
const _og = (_o19) => srtTime(_o19).slice(0, 8);
return [`# ${_o8(title) || 'Bộ mảnh video'}`, '', `Nhãn: ${KIT_LABEL} – ghép bằng CapCut theo thứ tự dưới.`, '',
'| STT | Thời gian | Chữ trên hình | Lời đọc | Tệp |', '|---|---|---|---|---|',
...scenes.map((_oz, i) => `| ${i + 1} | ${_og(_o15[i].start)} – ${_og(_o15[i].end)} | ${_op(_o8(_oz.text))} | ${_op(_o8(_oz.say))} | ${_op(clips[i] || '')} |`), ''].join('\n');
}
export const CAPCUT_GUIDE = [
'1. Giải nén bộ mảnh, mở CapCut → Dự án mới → khung 9:16.',
'2. Thêm clip/ảnh (canh_XX.mp4, ban_do.png, nhan_vat.png) theo đúng thứ tự trong thu_tu_canh.csv.',
'3. Thu âm lời đọc theo loi_doc_canh_XX.txt (hoặc dùng giọng đọc của CapCut) và đặt dưới từng cảnh.',
'4. Văn bản → Nhập phụ đề → chọn phu_de.srt; chỉnh cỡ chữ cho dễ đọc trên điện thoại.',
'5. Xem lại, xuất video 1080p; khi đăng bật nhãn "Nội dung do AI tạo" của nền tảng nếu có ảnh/clip AI.',
];
const _od = (_oz) => new TextEncoder().encode(String(_oz));
export function kitFiles({ title = '', scenes = [], master = '', sources = [], images = [], clips = [] } = {}) {
const files = [];
const _o16 = new Set();
const add = (name, bytes) => { let _or = name, _ol = 2; while (_o16.has(_or)) _or = name.replace(/(\.[^.]+)$/, `_${_ol++}$1`); _o16.add(_or); files.push({ name: _or, bytes }); return _or; };
const _o9 = {};
const _on = [];
for (const _o6 of clips) {
if (!_o6) continue;
if (_o6.bytes && _o6.bytes.length) _o9[_o6.scene] = add(`canh_${_ow((_o6.scene || 0) + 1)}${(/\.\w{2,4}$/.exec(_o6.name || '') || ['.mp4'])[0].toLowerCase()}`, _o6.bytes);
else if (_oj(_o6.url)) { _on.push(`Cảnh ${(_o6.scene || 0) + 1}: ${_oj(_o6.url)}`); _o9[_o6.scene] = _o9[_o6.scene] || 'link_clip.txt'; }
}
for (const _ok of images) if (_ok && _ok.bytes && _ok.bytes.length) add(_ok.name, _ok.bytes);
scenes.forEach((_oz, i) => add(`loi_doc_canh_${_ow(i + 1)}.txt`, _od(_o8(_oz.say) + '\n')));
add('loi_doc_tat_ca.txt', _od(scenes.map((_oz, i) => `${i + 1}. ${_o8(_oz.say)}`).join('\n') + '\n'));
add('phu_de.srt', _od(buildSrt(scenes)));
add('thu_tu_canh.csv', _od('﻿' + sceneCsv(scenes, { clips: _o9 })));
add('thu_tu_canh.md', _od(sceneMd(scenes, { title, clips: _o9 })));
add('HUONG_DAN_CAPCUT.txt', _od(`${_o8(title)} – bộ mảnh (${KIT_LABEL})\n\n${CAPCUT_GUIDE.join('\n')}\n`));
if (_o8(master)) add('prompt_tong.txt', _od(String(master).trim() + '\n'));
if (_on.length) add('link_clip.txt', _od(_on.join('\n') + '\n'));
const _o14 = (sources || []).filter((_oz) => _oz && _oj(_oz.url));
if (_o14.length) add('nguon.txt', _od(_o14.map((_oz) => `${_o8(_oz.name) || 'Nguồn'}: ${_oj(_oz.url)}`).join('\n') + '\n'));
return files;
}
export function kitName(title) {
const _oz = fold(title).replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 50);
return 'bo_manh_' + (_oz || 'video') + '.zip';
}
let _o0 = null;
export function crc32(bytes) {
if (!_o0) { _o0 = new Uint32Array(256); for (let _or = 0; _or < 256; _or++) { let _o6 = _or; for (let _ol = 0; _ol < 8; _ol++) _o6 = _o6 & 1 ? 0xedb88320 ^ (_o6 >>> 1) : _o6 >>> 1; _o0[_or] = _o6 >>> 0; } }
let _o6 = 0xffffffff;
for (let i = 0; i < bytes.length; i++) _o6 = _o0[(_o6 ^ bytes[i]) & 0xff] ^ (_o6 >>> 8);
return (_o6 ^ 0xffffffff) >>> 0;
}
function _oc(_ob = new Date()) {
return { time: (_ob.getHours() << 11) | (_ob.getMinutes() << 5) | (_ob.getSeconds() >> 1), date: ((Math.max(1980, _ob.getFullYear()) - 1980) << 9) | ((_ob.getMonth() + 1) << 5) | _ob.getDate() };
}
export function zipStore(files, { date = new Date() } = {}) {
const { time, date: dd } = _oc(date);
const parts = [], central = [];
let off = 0;
for (const _oe of files) {
const name = _od(_oe.name), data = _oe.bytes instanceof Uint8Array ? _oe.bytes : _od(_oe.bytes || ''), crc = crc32(data);
const _om = new DataView(new ArrayBuffer(30));
_om.setUint32(0, 0x04034b50, true); _om.setUint16(4, 20, true); _om.setUint16(6, 0x0800, true); _om.setUint16(8, 0, true);
_om.setUint16(10, time, true); _om.setUint16(12, dd, true); _om.setUint32(14, crc, true); _om.setUint32(18, data.length, true); _om.setUint32(22, data.length, true);
_om.setUint16(26, name.length, true); _om.setUint16(28, 0, true);
parts.push(new Uint8Array(_om.buffer), name, data);
const _o7 = new DataView(new ArrayBuffer(46));
_o7.setUint32(0, 0x02014b50, true); _o7.setUint16(4, 20, true); _o7.setUint16(6, 20, true); _o7.setUint16(8, 0x0800, true); _o7.setUint16(10, 0, true);
_o7.setUint16(12, time, true); _o7.setUint16(14, dd, true); _o7.setUint32(16, crc, true); _o7.setUint32(20, data.length, true); _o7.setUint32(24, data.length, true);
_o7.setUint16(28, name.length, true); _o7.setUint32(42, off, true);
central.push(new Uint8Array(_o7.buffer), name);
off += 30 + name.length + data.length;
}
const cdSize = central.reduce((a, _o4) => a + _o4.length, 0);
const end = new DataView(new ArrayBuffer(22));
end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, cdSize, true); end.setUint32(16, off, true);
const _o3 = [...parts, ...central, new Uint8Array(end.buffer)];
const _ou = new Uint8Array(_o3.reduce((a, _o4) => a + _o4.length, 0));
let _ov = 0; for (const a of _o3) { _ou.set(a, _ov); _ov += a.length; }
return _ou;
}
export function unzipStore(zip) {
const _o17 = new DataView(zip.buffer, zip.byteOffset, zip.byteLength), _ou = [];
let _ov = 0;
while (_ov + 30 <= zip.length && _o17.getUint32(_ov, true) === 0x04034b50) {
const _o13 = _o17.getUint32(_ov + 18, true), nl = _o17.getUint16(_ov + 26, true), xl = _o17.getUint16(_ov + 28, true);
const name = new TextDecoder().decode(zip.slice(_ov + 30, _ov + 30 + nl));
const bytes = zip.slice(_ov + 30 + nl + xl, _ov + 30 + nl + xl + _o13);
if (crc32(bytes) !== _o17.getUint32(_ov + 14, true)) throw new Error('CRC sai: ' + name);
_ou.push({ name, bytes });
_ov += 30 + nl + xl + _o13;
}
return _ou;
}

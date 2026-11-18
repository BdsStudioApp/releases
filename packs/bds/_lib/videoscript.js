import { findForbidden, wordCount, CHANNEL, extractJson } from './video.js';
import { extractFacts, checkClaims, isTrusted, canonUrl } from './ideas.js';
export const SCRIPT_AI = [
{ id: 'gemini', label: 'Gemini – miễn phí, có tìm Google', short: 'Gemini (có tìm Google)', paid: false, search: true },
{ id: 'claude_api', label: 'Claude API – trả phí, báo giá trước mỗi lần', short: 'Claude API (có tìm web)', paid: true, search: true },
{ id: 'ollama', label: 'Ollama trên máy – miễn phí, không tìm web', short: 'Ollama trên máy', paid: false, search: false },
{ id: 'handoff', label: 'Làm qua chat Claude/Gemini – 0 đồng', short: 'Chat Claude/Gemini (dán về)', paid: false, search: true },
];
export const DEFAULT_AI = 'gemini';
export const LS_AI = 'bds.video.script_ai';
export const aiInfo = id => SCRIPT_AI.find(a => a.id === id) || SCRIPT_AI[0];
export const aiLabel = (id, model, { search = true } = {}) => (search ? aiInfo(id).short : aiInfo(id).short.replace(/\s*\(.*\)$/, '')) + (model ? ' · ' + model : '');
export function pickAi(saved, { claudeEnabled = false } = {}) {
const id = SCRIPT_AI.some(a => a.id === saved) ? saved : DEFAULT_AI;
return id === 'claude_api' && !claudeEnabled ? DEFAULT_AI : id;
}
export const PLATFORMS = {
tiktok: { label: 'TikTok', title_max: 60, text_min: 150, text_max: 300, tags_min: 5, tags_max: 8, tags_hard: 30 },
reels: { label: 'Instagram Reels', title_max: 0, text_min: 80, text_max: 400, tags_min: 3, tags_max: 5, tags_hard: 5 },
shorts: { label: 'YouTube Shorts', title_max: 100, text_min: 80, text_max: 500, tags_min: 3, tags_max: 5, tags_hard: 60 },
};
export const SCENE_KINDS = { hook: 'Mở đầu', map: 'Bản đồ', stat: 'Số liệu', compare: 'So sánh', timeline: 'Mốc thời gian', doc: 'Văn bản', checklist: 'Cần nhớ' };
export const LINE_MAX = 75;
export const MAX_SCENES = 9;
export const MAX_PLACES = 12;
const _o1 = 3.0;
const S = _oy => String(_oy ?? '').normalize('NFC');
const T = (_oy, n = 400) => S(_oy).replace(/\s+/g, ' ').trim().slice(0, n);
export const isUrl = _oq => /^https?:\/\/[^\s/$.?#][^\s]*$/i.test(T(_oq, 2000));
const _oc = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };
export function buildScriptPrompt(topic, { channel = CHANNEL, today } = {}) {
const _o7 = today || new Date().toISOString().slice(0, 10);
return [
'BDS_DAN_CANH_JSON',
`Hôm nay ${_o7}. Soạn DÀN CẢNH video dọc TikTok/Reels/Shorts 60–90 giây cho kênh BĐS "${channel}" từ nguồn sau:`,
T(topic, 4000) || '(chưa có chủ đề)',
'',
'Cách làm: đọc nguồn, TÌM KIẾM để kiểm chứng từng con số (ưu tiên văn bản nhà nước, Sở, báo lớn; càng mới càng tốt).',
'Quy tắc bắt buộc:',
'- Mọi con số trên màn hình/lời đọc phải nằm trong "figures" kèm link nguồn THẬT ("source_url") và tháng số liệu ("month", vd "10/2026"). Không tìm được nguồn thì để "source_url": "" – KHÔNG bịa link, KHÔNG bịa số.',
'- Phân biệt hiện trạng / đang thi công / đã duyệt / quy hoạch / dự thảo. Dự thảo ghi "DỰ THẢO"; "đã phê duyệt" phải kèm số văn bản. Đề xuất ghi rõ là đề xuất.',
'- Không khuyên đầu tư, không hứa tăng giá, không giật tít ("x2", "đón sóng", "cơ hội vàng", "mua ngay"). Tin tài chính chỉ giải thích chính sách, không ví dụ trả góp, không so lãi theo tên ngân hàng.',
'- Địa danh hành chính hiện hành (Hà Nội bỏ cấp quận/huyện từ 7/2025); tên cũ quen thuộc ghi trong ngoặc.',
'- KHÔNG ghi toạ độ. Cảnh bản đồ chỉ ghi tên địa điểm đầy đủ để tra OpenStreetMap trong "places" (vd "Cầu Vĩnh Tuy, Hà Nội"). Muốn đo khoảng cách thì đặt đúng 2 địa điểm.',
'- 5–9 cảnh. Cảnh 1 "hook": từ khoá chính có trong tiêu đề và câu đọc đầu; câu thứ 2 hứa "cuối video có 3 câu nên kiểm tra". Cảnh cuối "checklist": câu dẫn, "Một: …", "Hai: …", "Ba: …", câu mời bình luận, câu mời lưu video.',
`- Lời đọc là văn nói, mỗi câu ≤ ${LINE_MAX} ký tự, đủ ý (ai, làm gì). Số khó đọc thì dùng {"text": "Lãi **9,6%**", "say": "lãi chín phẩy sáu phần trăm"}.`,
'Trả về DUY NHẤT một khối ```json theo mẫu:',
'{"title": "≤ 60 ký tự, từ khoá chính đầu câu", "video_kind": "map|news", "hook_type": "a|b|c", "stage": "existing|construction|approved|planned|draft",',
' "sources": [{"title": "…", "url": "https://…", "date": "YYYY-MM-DD"}],',
' "scenes": [{"kind": "hook|map|stat|compare|timeline|doc|checklist", "title": "chữ trên hình ≤ 40 ký tự",',
'   "narration": ["câu 1", {"text": "câu có số **4,8 km**", "say": "bốn phẩy tám ki lô mét"}],',
'   "places": ["Tên địa điểm, Tỉnh/Thành"],',
'   "figures": [{"label": "Chiều dài", "value": "4,8 km", "month": "10/2026", "source_url": "https://…"}]}],',
' "notes": "lưu ý: dự thảo / vị trí gần đúng / số lệch giữa các nguồn"}',
].join('\n');
}
export function buildCaptionPrompt(outline, { channel = CHANNEL } = {}) {
const _ol = outline || {};
const _oh = (_ol.scenes || []).flatMap(_oq => (_oq.narration || []).map(l => l.text));
const _oa = (_ol.scenes || []).flatMap(_oq => _oq.figures || []).filter(_o9 => _o9.value);
return [
'BDS_CAPTION_JSON',
`Viết caption SEO cho video dọc kênh BĐS "${channel}". Tiêu đề video: ${T(_ol.title, 120)}`,
'Lời đọc: ' + T(_oh.join(' '), 3000),
_oa.length ? 'Số liệu đã kiểm (CHỈ dùng các số này, giữ nguyên tháng + nguồn): ' + _oa.map(_o9 => `${_o9.label ? _o9.label + ': ' : ''}${_o9.value}${_o9.month ? ' (' + _o9.month + ')' : ''} – ${_oc(_o9.source_url) || 'chưa rõ nguồn'}`).join('; ') : 'Không có số liệu đã kiểm – caption KHÔNG được có con số.',
'Quy tắc: không giật tít, không hứa tăng giá, không khuyên đầu tư/vay; câu hỏi mời bình luận về chính sách/quy hoạch; ghi "Nguồn: …" và "Thông tin tham khảo, hãy tự kiểm chứng.".',
'- TikTok: "title" ≤ 60 ký tự (từ khoá chính đầu câu, là dòng đầu caption), "caption" 150–300 ký tự có 3–6 icon (📍🌉🚧📊✅), 5–8 hashtag trộn rộng/khu vực/cụ thể.',
'- Reels: câu đầu là móc câu (Reels chỉ hiện 1–2 dòng), xuống dòng dễ đọc, TỐI ĐA 5 hashtag.',
'- YouTube Shorts: "title" ≤ 100 ký tự có từ khoá, "caption" là mô tả 2–4 câu, 3–5 hashtag.',
'Hashtag viết liền không dấu, có dấu #. Trả về DUY NHẤT ```json: {"tiktok": {"title": "", "caption": "", "hashtags": []}, "reels": {"caption": "", "hashtags": []}, "shorts": {"title": "", "caption": "", "hashtags": []}}',
].join('\n');
}
function _oe(text) {
if (text && typeof text === 'object') return text;
const _ot = extractJson(S(text));
try { return JSON.parse(_ot); } catch { }
const a = _ot.indexOf('{'); const b = _ot.lastIndexOf('}');
if (a >= 0 && b > a) { try { return JSON.parse(_ot.slice(a, b + 1)); } catch { return null; } }
return null;
}
const _ok = l => {
if (l && typeof l === 'object') { const text = T(l.text, 200); const say = T(l.say, 300); return text ? (say && say !== text ? { text, say } : { text }) : null; }
const text = T(l, 200); return text ? { text } : null;
};
const _oj = _o9 => {
if (!_o9 || typeof _o9 !== 'object') { const _oy = T(_o9, 80); return _oy ? { label: '', value: _oy, month: '', source_url: '' } : null; }
const value = T(_o9.value ?? _o9.text, 80); if (!value) return null;
const url = T(_o9.source_url ?? _o9.source ?? _o9.url, 1000);
return { label: T(_o9.label, 50), value, month: T(_o9.month, 20), source_url: isUrl(url) ? url : '', checked: !!_o9.checked };
};
export function parseOutline(text) {
let _od = _oe(text);
if (Array.isArray(_od)) _od = { scenes: _od };
if (!_od || !Array.isArray(_od.scenes) || !_od.scenes.length) return null;
const scenes = _od.scenes.filter(x => x && typeof x === 'object').slice(0, MAX_SCENES).map((_oq, i, arr) => {
let kind = SCENE_KINDS[_oq.kind] ? _oq.kind : (i === 0 ? 'hook' : i === arr.length - 1 ? 'checklist' : 'stat');
const narration = (Array.isArray(_oq.narration) ? _oq.narration : typeof _oq.narration === 'string' ? _oq.narration.split(/\n+/) : Array.isArray(_oq.subs) ? _oq.subs : _oq.say ? [_oq.say] : [])
.map(_ok).filter(Boolean).slice(0, 12);
const places = (Array.isArray(_oq.places) ? _oq.places : typeof _oq.places === 'string' ? _oq.places.split(/\n|;/) : []).map(p => T(typeof p === 'object' && p ? p.name || p.query : p, 120)).filter(Boolean).slice(0, 4);
const figures = (Array.isArray(_oq.figures) ? _oq.figures : Array.isArray(_oq.facts) ? _oq.facts : []).map(_oj).filter(Boolean).slice(0, 6);
if (kind === 'map' && !places.length) kind = 'stat';
return { kind, title: T(_oq.title, 80) || SCENE_KINDS[kind], narration, places, figures };
});
const sources = (Array.isArray(_od.sources) ? _od.sources : []).map(x => (typeof x === 'string' ? { url: x } : x || {}))
.filter(x => isUrl(x.url)).map(x => ({ title: T(x.title || x.name, 160), url: T(x.url, 1000), date: T(x.date, 20) })).slice(0, 12);
return {
title: T(_od.title, 90) || T(scenes[0] && scenes[0].title, 90) || 'Video bản đồ',
video_kind: _od.video_kind === 'news' ? 'news' : 'map', hook_type: /^[abc]$/.test(_od.hook_type) ? _od.hook_type : '',
stage: T(_od.stage, 20), sources, scenes, notes: T(_od.notes, 600),
};
}
export function parseCaptions(text) {
const _od = _oe(text);
if (!_od || typeof _od !== 'object') return null;
const _ov = a => [...new Set((Array.isArray(a) ? a : typeof a === 'string' ? a.split(/[\s,]+/) : [])
.map(x => T(x, 60).replace(/^#*/, '#').replace(/[^#\p{L}\p{N}_]/gu, '')).filter(x => x.length > 1))];
const _on = (x, _of) => x && typeof x === 'object' ? { title: _of === 'reels' ? '' : T(x.title, 140), caption: S(x.caption ?? x.text ?? x.description ?? '').trim().slice(0, 2200), hashtags: _ov(x.hashtags) } : null;
const out = { tiktok: _on(_od.tiktok, 'tiktok'), reels: _on(_od.reels || _od.instagram, 'reels'), shorts: _on(_od.shorts || _od.youtube, 'shorts') };
return out.tiktok || out.reels || out.shorts ? out : null;
}
export const numKeys = t => (S(t).match(/\d+(?:[.,]\d+)*/g) || []).map(x => x.replace(/[.,]/g, '')).filter(x => x.length && !/^0+$/.test(x));
const _o8 = t => S(t).replace(/(\d)[.,](?=\d)/g, '$1');
const _ob = (text, _og) => new RegExp('(^|\\D)' + _og + '(?!\\d)').test(_o8(text));
export function figureStatus(_o9, evidence = {}) {
if (!_o9 || !isUrl(_o9.source_url)) return 'missing';
if (_o9.checked) return 'checked';
const _og = numKeys(_o9.value)[0];
const _ow = [...(evidence.segments || []).map(_oq => _oq.text), ...(evidence.citations || []).map(_o6 => _o6.cited_text)].filter(Boolean);
if (_og && _ow.some(t => _ob(t, _og))) return 'grounded';
const _o6 = canonUrl(_o9.source_url);
if (_o6 && [...(evidence.sources || []), ...(evidence.citations || [])].some(_oq => canonUrl(_oq.url) === _o6)) return 'grounded';
return 'unverified';
}
export function checkOutline(outline, evidence = {}) {
const issues = [];
const figures = [];
const _o2 = (level, code, message, at = {}) => issues.push({ level, code, message, ...at });
const _ol = outline || { scenes: [] };
const _or = _ol.scenes || [];
if (!_or.length) _o2('block', 'empty', 'Dàn cảnh chưa có cảnh nào.');
if (_or.length && (_or.length < 5 || _or.length > MAX_SCENES)) _o2('warn', 'count', `Nên có 5–${MAX_SCENES} cảnh (đang ${_or.length}).`);
if (_or.length && _or[0].kind !== 'hook') _o2('warn', 'hook', 'Cảnh 1 nên là cảnh mở đầu (hook) có từ khoá chính.', { scene: 0 });
if (_or.length > 1 && _or[_or.length - 1].kind !== 'checklist') _o2('warn', 'checklist', 'Cảnh cuối nên là checklist 3 câu + mời theo dõi.', { scene: _or.length - 1 });
let words = 0; let places = 0;
_or.forEach((_oq, i) => {
const _o3 = new Set(_or.flatMap(z => (z.figures || []).flatMap(_o9 => [...numKeys(_o9.value), ...numKeys(_o9.month)])));
(_oq.figures || []).forEach((_o9, _of) => {
const _ou = figureStatus(_o9, evidence);
figures.push({ scene: i, fig: _of, status: _ou });
if (_ou === 'missing') _o2('block', 'no_source', `Cảnh ${i + 1}: số "${_o9.value}" chưa có link nguồn.`, { scene: i, fig: _of });
else if (_ou === 'unverified') _o2('warn', 'unverified', `Cảnh ${i + 1}: số "${_o9.value}" – nguồn do AI ghi, chưa khớp kết quả tìm kiếm: mở link kiểm rồi tick "Đã kiểm".`, { scene: i, fig: _of });
if (!_o9.month && _ou !== 'missing') _o2('warn', 'no_month', `Cảnh ${i + 1}: số "${_o9.value}" nên ghi tháng số liệu.`, { scene: i, fig: _of });
});
(_oq.narration || []).forEach((l, _of) => {
const _ox = (l.text || '').replace(/\*\*/g, '');
words += wordCount(l.say || _ox);
if (_ox.length > LINE_MAX) _o2('warn', 'long', `Cảnh ${i + 1}, câu ${_of + 1} dài ${_ox.length} ký tự (nên ≤ ${LINE_MAX}).`, { scene: i, line: _of });
for (const _o9 of extractFacts(_ox)) {
const _oi = numKeys(_o9.text)[0];
if (_oi && !_o3.has(_oi)) _o2('block', 'number_unsourced', `Cảnh ${i + 1}: lời đọc có "${_o9.text}" nhưng bảng số liệu chưa có số này (chưa có nguồn).`, { scene: i, line: _of, value: _o9.text });
}
});
if (_oq.kind === 'map') { places += (_oq.places || []).length; if (!(_oq.places || []).length) _o2('warn', 'no_place', `Cảnh ${i + 1}: cảnh bản đồ chưa có địa điểm → sẽ thành thẻ số liệu.`, { scene: i }); }
if (!(_oq.narration || []).length) _o2('warn', 'no_voice', `Cảnh ${i + 1} chưa có lời đọc.`, { scene: i });
});
if (places > MAX_PLACES) _o2('warn', 'places', `Có ${places} địa điểm – máy dựng chỉ tra ${MAX_PLACES} địa điểm đầu (giới hạn tra bản đồ 1 lần/giây).`);
const _o4 = _or.flatMap(_oq => [_oq.title, ...(_oq.narration || []).map(l => l.text + ' ' + (l.say || ''))]).concat(_ol.title || '').join('\n');
const _o5 = [...new Set(findForbidden(_o4))];
if (_o5.length) _o2('block', 'forbidden', 'Có từ cấm (giật tít/hứa lợi nhuận/nhãn AI): ' + _o5.join(', ') + '.');
for (const _o6 of checkClaims(_or.flatMap(_oq => (_oq.narration || []).map(l => l.text)).join('\n'), '').issues) {
_o2(_o6.level === 'block' ? 'block' : 'warn', 'claim', _o6.message + ' – "' + T(_o6.sentence, 80) + '"');
}
const seconds = Math.round(words / _o1 + _or.length * 0.6);
if (_or.length && (seconds < 30 || seconds > 180)) _o2('warn', 'length', `Lời đọc khoảng ${seconds} giây (nên 60–90 giây, tối đa 3 phút).`);
const counts = { figures: figures.length, missing: figures.filter(_o9 => _o9.status === 'missing').length,
unverified: figures.filter(_o9 => _o9.status === 'unverified').length, ok: figures.filter(_o9 => _o9.status === 'grounded' || _o9.status === 'checked').length,
block: issues.filter(x => x.level === 'block').length, warn: issues.filter(x => x.level === 'warn').length, seconds };
return { ok: !counts.block, counts, issues, figures };
}
export function toEngineOutline(outline, { channel = CHANNEL } = {}) {
const _ol = outline || { scenes: [] };
return {
title: T(_ol.title, 90), video_kind: _ol.video_kind || 'map', stage: _ol.stage || '', channel,
sources: (_ol.sources || []).map(_oq => ({ url: _oq.url, name: _oq.title || _oc(_oq.url) })),
scenes: (_ol.scenes || []).map(_oq => ({
kind: _oq.kind, title: _oq.title, places: (_oq.places || []).slice(0, 4),
narration: (_oq.narration || []).map(l => (l.say ? { text: l.text, say: l.say } : { text: l.text })),
figures: (_oq.figures || []).filter(_o9 => isUrl(_o9.source_url)).map(_o9 => ({ label: _o9.label, value: _o9.value, month: _o9.month, source_url: _o9.source_url })),
})),
};
}
export function checkCaption(platform, cap, outline) {
const P = PLATFORMS[platform]; const issues = [];
if (!P || !cap) return { ok: false, issues: [{ level: 'block', message: 'Chưa có caption.' }] };
const title = T(cap.title, 300); const text = S(cap.caption).trim(); const _ov = cap.hashtags || [];
if (P.title_max && !title) issues.push({ level: platform === 'shorts' ? 'block' : 'warn', message: 'Thiếu tiêu đề.' });
if (P.title_max && title.length > P.title_max) issues.push({ level: platform === 'shorts' ? 'block' : 'warn', message: `Tiêu đề ${title.length} ký tự (tối đa ${P.title_max}).` });
if (text.length < P.text_min || text.length > P.text_max) issues.push({ level: 'warn', message: `Caption ${text.length} ký tự (nên ${P.text_min}–${P.text_max}).` });
if (_ov.length > P.tags_hard) issues.push({ level: 'block', message: `${_ov.length} hashtag – ${P.label} chỉ nhận tối đa ${P.tags_hard}` + (platform === 'shorts' ? ' (quá 60 thì YouTube bỏ qua mọi hashtag).' : '.') });
else if (_ov.length < P.tags_min || _ov.length > P.tags_max) issues.push({ level: 'warn', message: `Nên dùng ${P.tags_min}–${P.tags_max} hashtag (đang ${_ov.length}).` });
const _o5 = findForbidden([title, text, _ov.join(' ')].join(' '));
if (_o5.length) issues.push({ level: 'block', message: 'Có từ nên tránh: ' + _o5.join(', ') + '.' });
if (outline) {
const ok = new Set((outline.scenes || []).flatMap(_oq => (_oq.figures || []).filter(_o9 => isUrl(_o9.source_url)).flatMap(_o9 => [...numKeys(_o9.value), ...numKeys(_o9.month)])));
for (const _o9 of extractFacts([title, text].join(' '))) {
const _of = numKeys(_o9.text)[0];
if (_of && !ok.has(_of)) issues.push({ level: 'block', message: `Số "${_o9.text}" không có trong số liệu đã kiểm của video.` });
}
}
return { ok: !issues.some(i => i.level === 'block'), issues };
}
export function formatCaption(platform, cap) {
if (!cap) return '';
const _ov = (cap.hashtags || []).slice(0, (PLATFORMS[platform] || {}).tags_hard || 8).join(' ');
const body = S(cap.caption).trim();
if (platform === 'tiktok') return [T(cap.title, 300), body, _ov].filter(Boolean).join('\n\n').replace(/^(.*)\n\n/, '$1\n');
if (platform === 'shorts') return [body, _ov].filter(Boolean).join('\n\n');
return [body, _ov].filter(Boolean).join('\n\n');
}
export function captionFile(captions, outline) {
const _o6 = captions || {};
const _oo = (_of, head) => (_o6[_of] ? `=== ${head} ===\n` + (_of === 'shorts' && _o6[_of].title ? 'Tiêu đề: ' + _o6[_of].title + '\n' : '') + formatCaption(_of, _o6[_of]) + '\n' : '');
const _ot = ((outline && outline.scenes) || []).flatMap(_oq => (_oq.figures || []).filter(_o9 => isUrl(_o9.source_url)).map(_o9 => `- ${_o9.label ? _o9.label + ': ' : ''}${_o9.value}${_o9.month ? ' (' + _o9.month + ')' : ''}: ${_o9.source_url}`));
return [_oo('tiktok', 'TikTok'), _oo('reels', 'Instagram Reels'), _oo('shorts', 'YouTube Shorts'),
_ot.length ? '=== Nguồn số liệu ===\n' + [...new Set(_ot)].join('\n') + '\n' : ''].filter(Boolean).join('\n');
}
export const SCRIPT_TYPE = 'video_script';
const _o0 = 45000;
export function addVersion(rec, _oy) {
const _op = { ...(rec || {}), versions: [...((rec && rec.versions) || [])] };
_op.versions.push({ id: 'v' + (_op.versions.length + 1) + '_' + (_oy.at || Date.now()).toString(36), ai: _oy.ai, model: _oy.model || '', at: _oy.at || Date.now(),
cost_usd: Number(_oy.cost_usd) || 0, outline: _oy.outline, evidence: _os(_oy.evidence), verify: aiInfo(_oy.ai).search && _oy.ai !== 'handoff' ? 'search' : 'none' });
while (_op.versions.length > 4) _op.versions.shift();
_op.current = _op.versions.length - 1;
return fitCell(_op);
}
function _os(e = {}) {
return { sources: (e.sources || []).slice(0, 15).map(_oq => ({ title: T(_oq.title, 100), url: T(_oq.url, 600) })),
queries: (e.queries || []).slice(0, 8).map(q => T(q, 120)),
segments: (e.segments || []).slice(0, 40).map(_oq => ({ text: T(_oq.text, 300) })),
citations: (e.citations || []).slice(0, 30).map(_o6 => ({ url: T(_o6.url, 600), cited_text: T(_o6.cited_text, 300) })) };
}
export function fitCell(_op) {
let _oq = JSON.stringify(_op);
while (_oq.length > _o0 && _op.versions && _op.versions.length > 1) {
const _om = _op.versions.findIndex((_oy, i) => i !== _op.current && _oy.evidence && (_oy.evidence.segments || []).length);
if (_om >= 0) _op.versions[_om].evidence = { sources: _op.versions[_om].evidence.sources.slice(0, 5), queries: [], segments: [], citations: [] };
else { _op.versions.shift(); _op.current = Math.max(0, (_op.current || 0) - 1); }
_oq = JSON.stringify(_op);
}
return _op;
}
export function compareVersions(a, b) {
const stat = _oy => {
const _ol = (_oy && _oy.outline) || { scenes: [] };
const _o6 = checkOutline(_ol, _oy && _oy.evidence).counts;
return { ai: aiLabel(_oy && _oy.ai, _oy && _oy.model), scenes: _ol.scenes.length, figures: _o6.figures, ok: _o6.ok, missing: _o6.missing, unverified: _o6.unverified, seconds: _o6.seconds, cost_usd: Number(_oy && _oy.cost_usd) || 0 };
};
return { a: stat(a), b: stat(b) };
}
export const handoffNote = 'Dán NGUYÊN câu trả lời (có khối ```json) vào ô bên dưới rồi bấm Dùng.';
export const fmtUsd = n => (Number(n) || 0).toFixed((Number(n) || 0) < 0.1 ? 3 : 2).replace('.', ',') + ' USD';
export const trusted = url => isTrusted(url);

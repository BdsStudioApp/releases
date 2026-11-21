import { fold } from './xkit.71d637c634.js';
import { gate } from '../shared/consent.js';
import { withRules, AI_RULES_TEXT } from '../shared/ai_rules.js';
export const ASK_LIMITS = {
textMax: 2000,
turns: 6,
turnMax: 600,
examples: 3,
exampleMax: 400,
avoid: 2,
memLines: 8, memMax: 900,
features: 80, featDesc: 90,
promptMax: 14000,
aiTimeoutMs: 25000,
feedbackMax: 50
};
export const DEFAULT_ROLE = 'Em là trợ lý của chủ app, giúp anh/chị làm việc hằng ngày nhanh và đúng.';
export const CORE_RULES = [
'Không bịa số liệu, giá, tên, quy định. Số/tên nào nêu ra phải kèm nguồn (link, tài liệu anh/chị đưa, hoặc dữ liệu trong app). Chưa chắc ý anh/chị hỏi thì nói "em chưa chắc" và hỏi lại đúng 1 câu.',
'Không hứa hẹn kết quả, không cam kết thay anh/chị.',
'Trả lời ngắn gọn, đi thẳng vào việc. Việc cần làm thì ghi từng bước cụ thể, đánh số 1, 2, 3.',
'Dùng tiếng Việt thường ngày, dễ hiểu; không dùng từ kỹ thuật, không chèn tiếng Anh/chị khi không cần.',
'Hỏi về cách dùng app: chỉ chỉ tới chức năng có trong mục "Chức năng có thật trong app". Không có trong danh sách = app chưa có: nói thật và gợi ý anh/chị gõ "nâng cấp: …" để đề nghị thêm.'
];
export const ASK_SAMPLES = [
'Không có thông tin có nguồn (giá, số toà, tiến độ, lãi suất…): trả lời "Em chưa tìm được, anh/chị tự nhập giúp em." rồi chỉ chỗ nhập trong app nếu có. Không điền số cho đủ.',
'Câu hỏi cần tra mạng mà lần này em không tra được: trả lời "Khoá hiện tại chưa tra được mạng, anh/chị dán link hoặc tải tài liệu, hoặc tự nhập." – không nói "không có thông tin".'
];
export const MO_RULES = [
'Nhắc tới chức năng nào của app thì ghi thẻ [[mo:<mã>]] ngay sau tên chức năng, mã lấy đúng trong danh sách (vd "Mở [[mo:packs]]"). Không tự viết đường dẫn, không bịa mã; app tự đổi thẻ thành nút bấm.',
'Hỏi "làm sao để …": trả lời bằng các bước đánh số 1, 2, 3; bước nào bấm vào màn/nút nào thì kèm thẻ [[mo:<mã>]] của màn/nút đó.',
'Không chắc là chức năng nào: nói "em chưa chắc" và hỏi lại đúng 1 câu, không đoán.'
];
export const CORE_MODES = {
qa: { label: 'Hỏi đáp', guide: 'Trả lời câu hỏi thẳng, ngắn, có bước làm nếu cần.' },
app: { label: 'Việc trong app', guide: 'Chỉ hướng dẫn cách làm trong app: nêu đúng tên chức năng, màn và nút có trong danh sách chức năng; nếu cần mở giúp thì dùng dòng @route: open <mã>.' }
};
const _o0 = {
shorter: 'Viết lại câu trả lời trước cho ngắn hơn: chỉ giữ ý chính, tối đa 3–4 dòng.',
longer: 'Viết lại câu trả lời trước cho chi tiết hơn: thêm từng bước cụ thể, vẫn đúng các quy tắc (không thêm số liệu không có nguồn).',
fix: 'Câu trả lời trước CHƯA ĐÚNG Ý anh/chị. Làm lại theo lời chỉnh của anh/chị:'
};
const _o3 = (_on) => String(_on == null ? '' : _on).normalize('NFC').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
export function redactPII(_on) {
return _o3(_on)
.replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, '[email]')
.replace(/(?:\+?84|\b0)(?:[\s.-]?\d){8,10}\b/g, '[số điện thoại]')
.replace(/\b\d(?:[\s.]?\d){8,11}\b/g, '[số giấy tờ]');
}
export function clip(_on, _od) {
const _op = _o3(_on);
return _op.length > _od ? { text: _op.slice(0, _od), cut: true } : { text: _op, cut: false };
}
const _oo = (_on, _od) => { const _op = _o3(_on).replace(/\s+/g, ' ').trim(); return _op.length > _od ? _op.slice(0, _od - 1).trimEnd() + '…' : _op; };
export function parseModes(lines) {
const _og = { qa: { ...CORE_MODES.qa } };
for (const _o9 of lines || []) {
const [id, label, guide] = String(_o9).split('|').map((_oq) => (_oq || '').trim());
if (!id || !/^[a-z0-9_]+$/.test(id) || !label) continue;
_og[id] = { label, guide: guide || (_og[id] && _og[id].guide) || '' };
}
if (!_og.app) _og.app = { ...CORE_MODES.app };
else { const a = _og.app; delete _og.app; _og.app = a; }
return _og;
}
export function featureMap(entries, { screenLabel = (_on) => _on, extra = [] } = {}) {
const _og = [];
for (const e of entries || []) {
if (!e || e.state !== 'ready' || !e.manifest) continue;
const _oc = e.manifest; const id = e.id || _oc.id;
if (!id) continue;
const screen = _oc.screen || 'home';
const path = e.core && id === screen ? screen : screen + '/' + id;
_og.push({ id, title: _oo(_oc.title || id, 60), screen, screenLabel: screenLabel(screen), path, desc: _oo(_oc.desc || _oc.help || '', ASK_LIMITS.featDesc) });
}
for (const _oq of extra || []) if (_oq && _oq.id && _oq.path) _og.push({ id: _oq.id, title: _oo(_oq.title || _oq.id, 60), screen: _oq.screen || '', screenLabel: screenLabel(_oq.screen || ''), path: _oq.path, desc: _oo(_oq.desc || '', ASK_LIMITS.featDesc) });
return _og.slice(0, ASK_LIMITS.features);
}
export function featureLine(_o5) {
return '- ' + _o5.title + ' (mã ' + _o5.id + ')' + (_o5.where ? ' – ở ' + _o5.where : (_o5.screenLabel ? ' – màn ' + _o5.screenLabel : '')) + (_o5.desc ? ' – ' + _o5.desc : '');
}
export function findFeature(features, key) {
const _o8 = String(key || '').trim().replace(/^#?\/?/, '');
if (!_o8) return null;
const _o2 = _o8.split('?')[0];
return (features || []).find((_o5) => _o5.id === _o8 || _o5.path === _o8) || (features || []).find((_o5) => _o5.path === _o2)
|| (features || []).find((_o5) => _o2.split('/').slice(0, 2).join('/') === _o5.path) || null;
}
export function memoryLines(list, { _od = ASK_LIMITS.memLines, maxChars = ASK_LIMITS.memMax, label = (_o8) => _o8 } = {}) {
const _of = (Array.isArray(list) ? list : []).filter((_oq) => _oq && _oq.enabled !== false && _oq.text);
const own = _of.filter((_oq) => _oq.source !== 'seed').sort((a, b) => (Number(b.created_at) || 0) - (Number(a.created_at) || 0));
const seed = _of.filter((_oq) => _oq.source === 'seed');
const _og = []; let _oa = 0;
for (const _oq of [...own, ...seed]) {
if (_og.length >= _od) break;
const _ob = '- ' + label(_oq.kind || 'preference') + ': ' + _oo(redactPII(_oq.text), 200);
if (_oa + _ob.length > maxChars) continue;
_og.push(_ob); _oa += _ob.length + 1;
}
return _og;
}
export function customerLine(c) {
if (!c || typeof c !== 'object' || Number(c.deleted) || !gate(c, 'ai').ok) return '';
const _o5 = (_op, n) => _oo(redactPII(_op || ''), n);
return [_o5(c.name, 80), c.need && 'Nhu cầu: ' + _o5(c.need, 200), c.project && 'Quan tâm: ' + _o5(c.project, 120), c.status && 'Trạng thái: ' + _o5(c.status, 40), c.note && 'Ghi chú: ' + _o5(c.note, 300)].filter(Boolean).join(' | ');
}
export function pushTurn(history, turn, _od = ASK_LIMITS.turns) {
return [...(Array.isArray(history) ? history : []), { q: String(turn.q || ''), a: String(turn.a || ''), mode: turn.mode || '' }].slice(-_od);
}
export function recordVote(log, item, { now = Date.now(), _od = ASK_LIMITS.feedbackMax } = {}) {
const _om = { q: _oo(redactPII(item.q), 300), a: _oo(redactPII(item.a), ASK_LIMITS.exampleMax), vote: item.vote === 'down' ? 'down' : 'up', note: _oo(redactPII(item.note || ''), 200), mode: item.mode || '', at: now };
const rest = (Array.isArray(log) ? log : []).filter((_oq) => !(_oq && _oq.q === _om.q && _oq.a === _om.a));
return [...rest, _om].slice(-_od);
}
const _oe = (log) => (Array.isArray(log) ? log : []).filter(Boolean).slice().sort((a, b) => (Number(b.at) || 0) - (Number(a.at) || 0));
export function pickExamples(log, _od = ASK_LIMITS.examples, mode = '') {
const ups = _oe(log).filter((_oq) => _oq.vote === 'up' && _oq.q && _oq.a);
const same = mode ? ups.filter((_oq) => _oq.mode === mode) : [];
const list = [...same, ...ups.filter((_oq) => !same.includes(_oq))];
return list.slice(0, Math.min(_od, ASK_LIMITS.examples));
}
export function avoidList(log, _od = ASK_LIMITS.avoid) {
return _oe(log).filter((_oq) => _oq.vote === 'down' && _oq.note).slice(0, _od);
}
export function buildAskPrompt(o = {}) {
const { text: q, cut } = clip(redactPII(o.text || ''), ASK_LIMITS.textMax);
const modes = o.modes || parseModes([]);
const mode = modes[o.mode] ? o.mode : 'qa';
const head = [];
head.push('[Vai trò]', _o3(o.role || DEFAULT_ROLE));
head.push('[Quy tắc bắt buộc]');
for (const _oi of [...CORE_RULES, ...(o.mo ? MO_RULES : []), ...(o.rules || [])]) if (String(_oi).trim()) head.push('- ' + _o3(_oi).trim());
head.push('[Câu trả lời mẫu khi thiếu thông tin]', ...ASK_SAMPLES.map((_oq) => '- ' + _oq));
if (o.persona) head.push(_o3(o.persona).trim());
const mem = memoryLines(o.memory, { label: o.memLabel });
if (mem.length) head.push('[Điều cần nhớ về chủ app]', ...mem);
if (o.screen) head.push('[Màn đang mở]', 'Anh/chị đang ở: ' + _oo(o.screen, 120));
if (o.customer) head.push('[Khách đang mở – khách đã đồng ý lưu dữ liệu, bản rút gọn, không số điện thoại/email]', _oo(o.customer, 700));
const _o4 = (o.examples || []).slice(0, ASK_LIMITS.examples);
if (_o4.length) { head.push('[Ví dụ câu trả lời anh/chị đã khen – giữ cách viết này]'); for (const _oq of _o4) head.push('Anh/chị: ' + _oo(_oq.q, 200), 'Em: ' + _oo(_oq.a, ASK_LIMITS.exampleMax)); }
const _o1 = (o.avoid || []).slice(0, ASK_LIMITS.avoid);
if (_o1.length) { head.push('[Anh/chị từng chê – tránh lặp lại]'); for (const _oq of _o1) head.push('- ' + _oo(_oq.note, 200)); }
head.push('[Chế độ: ' + modes[mode].label + ']', _o3(modes[mode].guide || ''));
head.push('[Cách trả lời]',
'- Chỉ trả lời câu mới nhất của anh/chị, dựa vào hội thoại trước nếu có.',
'- Câu mơ hồ, chưa đủ để trả lời đúng: KHÔNG đoán; chỉ trả đúng 1 dòng "@hoi: <câu hỏi lại> | <lựa chọn 1> | <lựa chọn 2> | <lựa chọn 3>".',
o.actions === false ? '- Không đề nghị thao tác app.' : '- Nếu anh/chị muốn app làm một thao tác, dòng đầu ghi "@route: <loại> <tham số>" (loại: open <mã chức năng> | search <từ cần tìm> | remember <điều cần nhớ> | upgrade <mô tả tính năng mới>), sau đó giải thích ngắn. App sẽ hỏi anh/chị trước khi làm.');
const tail = [];
const rag = (o.kb || []).slice(0, 5).map((_oq) => _oo(String(_oq), 700));
if (rag.length) tail.push('[Mục trong app khớp nhất với câu hỏi – dựa vào đây khi trả lời về app]', ...rag);
const _o7 = (o.history || []).slice(-ASK_LIMITS.turns);
if (_o7.length) { tail.push('[Hội thoại trước]'); for (const _oq of _o7) tail.push('Anh/chị: ' + clip(redactPII(_oq.q), ASK_LIMITS.turnMax).text, 'Em: ' + clip(redactPII(_oq.a), ASK_LIMITS.turnMax).text);
tail.push('(Các lượt trên chỉ để em nhớ ngữ cảnh – KHÔNG nhắc lại hay chép lại nội dung đã trả lời, chỉ trả lời câu mới.)'); }
if (o.refine && _o0[o.refine.kind]) {
tail.push('[Yêu cầu làm lại]', _o0[o.refine.kind] + (o.refine.kind === 'fix' ? ' ' + _oo(redactPII(o.refine.note || ''), 500) : ''));
if (o.refine.prev) tail.push('Câu trả lời trước:', '"""', clip(redactPII(o.refine.prev), 1500).text, '"""');
}
tail.push('[Câu mới của anh/chị]', '"""', q, '"""');
const _od = ASK_LIMITS.promptMax - AI_RULES_TEXT.length - 2;
const _o6 = head.join('\n').length + tail.join('\n').length + 200 + AI_RULES_TEXT.length;
const feats = []; let _ok = ASK_LIMITS.promptMax - _o6;
for (const _o5 of o.features || []) { const _o9 = featureLine(_o5); if (_o9.length + 1 > _ok) break; feats.push(_o9); _ok -= _o9.length + 1; }
const featBlock = feats.length ? ['[Chức năng có thật trong app – chỉ chỉ đường tới các mục này]', ...feats] : ['[Chức năng có thật trong app]', '(chưa đọc được danh sách – không chỉ đường tới chức năng nào)'];
const offs = []; for (const _o5 of o.offFeatures || []) { const _o9 = '- ' + _o5.title + ' (mã ' + _o5.id + ') – gói "' + _oo(_o5.pack || '', 60) + '"'; if (_o9.length + 1 > _ok - 400) break; offs.push(_o9); _ok -= _o9.length + 1; }
if (offs.length) featBlock.push('[Chức năng thuộc gói chưa cài – nói rõ cần cài ở Gói chức năng]', ...offs);
let prompt = [...head, ...featBlock, ...tail].join('\n');
if (prompt.length > _od) prompt = prompt.slice(prompt.length - _od);
return { prompt: withRules(prompt), cut };
}
export function parseAnswer(raw, { features = [] } = {}) {
let text = _o3(raw).trim();
let action = null; let clarify = null;
const hm = text.match(/^\s*@hoi\s*:\s*(.+)$/im);
if (hm) {
const _oh = hm[1].split('|').map((_oq) => _oq.trim()).filter(Boolean);
if (_oh[0]) clarify = { question: _oo(_oh[0], 300), options: _oh.slice(1, 4).map((_oq) => _oo(_oq, 80)) };
text = text.replace(hm[0], '').trim();
}
const _oj = text.match(/^\s*@route\s*:\s*(upgrade|search|remember|open|shortcut|link)\b\s*(.*)$/im);
if (_oj) {
text = text.replace(_oj[0], '').trim();
action = _ol(_oj[1].toLowerCase(), _oj[2].trim(), features);
}
return { answer: text, action, clarify };
}
function _ol(intent, arg, features) {
const a = _oo(arg, 300);
if (intent === 'open' || intent === 'shortcut') {
const _o5 = findFeature(features, a.split(/\s+/)[0]);
return _o5 ? { intent: 'open', arg: a, path: _o5.path, label: _o5.title, source: 'ai' } : null;
}
if (!a) return null;
if (intent === 'search') return { intent: 'search', arg: a, query: a, source: 'ai' };
if (intent === 'remember') return { intent: 'remember', arg: a, source: 'ai' };
if (intent === 'upgrade') return { intent: 'upgrade', arg: a, text: a, source: 'ai' };
return null;
}
export function needsConfirm(_oi) {
if (!_oi) return false;
if (_oi.source === 'ai') return true;
if (_oi.intent === 'open' || _oi.intent === 'shortcut' || _oi.intent === 'upgrade') return _oi.match !== 'exact';
return false;
}
export function isVague(text) {
const _on = _o3(text).trim();
if (!_on || /[?？]/.test(_on)) return false;
return fold(_on).split(' ').filter(Boolean).length <= 2;
}
export function isContentJob(text, mode, kws = []) {
if (!kws || !kws.length) return false;
if (mode && mode !== 'qa' && mode !== 'app' && mode !== 'term' && kws.includes('@mode:' + mode)) return true;
const _o5 = ' ' + fold(text).replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
return kws.filter((_o8) => !String(_o8).startsWith('@')).some((_o8) => _o5.includes(' ' + fold(_o8) + ' '));
}
export function assistantPrompt(text, { screens = [], shortcuts = [] } = {}) {
return withRules([
'Câu của chủ app trong ô "Hỏi app":', '"""', text, '"""', '',
'Nếu câu này thực chất là thao tác của app, chỉ trả về MỘT dòng đầu dạng "@route: <loại> <tham số>" với loại ∈ {search <từ cần tìm>, upgrade <mô tả>, remember <điều cần nhớ>' +
(shortcuts.length ? ', shortcut <' + shortcuts.map((_on) => _on.kws[0]).join(' | ') + '> <tham số>' : '') + '}.',
'Nếu không, trả lời thẳng câu hỏi bằng tiếng Việt' + (screens.length ? ' (app có các màn: ' + screens.join(', ') + ')' : '') + '.'
].join('\n'));
}
export default { ASK_LIMITS, MO_RULES, ASK_SAMPLES, assistantPrompt, buildAskPrompt, parseAnswer, featureMap, memoryLines, customerLine, redactPII, needsConfirm, isVague, isContentJob, recordVote, pickExamples, avoidList, pushTurn, parseModes, findFeature };

import { fold } from './xkit.e7637ba4a6.js';
import { gate } from '../shared/consent.js';
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
'Không bịa số liệu, giá, tên, quy định. Chưa chắc thì nói "em chưa chắc" và hỏi lại đúng 1 câu.',
'Không hứa hẹn kết quả, không cam kết thay anh/chị.',
'Trả lời ngắn gọn, đi thẳng vào việc. Việc cần làm thì ghi từng bước cụ thể, đánh số 1, 2, 3.',
'Dùng tiếng Việt thường ngày, dễ hiểu; không dùng từ kỹ thuật, không chèn tiếng Anh/chị khi không cần.',
'Hỏi về cách dùng app: chỉ chỉ tới chức năng có trong mục "Chức năng có thật trong app". Không có trong danh sách = app chưa có: nói thật và gợi ý anh/chị gõ "nâng cấp: …" để đề nghị thêm.'
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
longer: 'Viết lại câu trả lời trước cho chi tiết hơn: thêm từng bước cụ thể và ví dụ, vẫn đúng các quy tắc.',
fix: 'Câu trả lời trước CHƯA ĐÚNG Ý anh/chị. Làm lại theo lời chỉnh của anh/chị:'
};
const _o3 = (_om) => String(_om == null ? '' : _om).normalize('NFC').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
export function redactPII(_om) {
return _o3(_om)
.replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, '[email]')
.replace(/(?:\+?84|\b0)(?:[\s.-]?\d){8,10}\b/g, '[số điện thoại]')
.replace(/\b\d(?:[\s.]?\d){8,11}\b/g, '[số giấy tờ]');
}
export function clip(_om, max) {
const _oo = _o3(_om);
return _oo.length > max ? { text: _oo.slice(0, max), cut: true } : { text: _oo, cut: false };
}
const _on = (_om, max) => { const _oo = _o3(_om).replace(/\s+/g, ' ').trim(); return _oo.length > max ? _oo.slice(0, max - 1).trimEnd() + '…' : _oo; };
export function parseModes(lines) {
const _of = { qa: { ...CORE_MODES.qa } };
for (const _o9 of lines || []) {
const [id, label, guide] = String(_o9).split('|').map((_op) => (_op || '').trim());
if (!id || !/^[a-z0-9_]+$/.test(id) || !label) continue;
_of[id] = { label, guide: guide || (_of[id] && _of[id].guide) || '' };
}
if (!_of.app) _of.app = { ...CORE_MODES.app };
else { const a = _of.app; delete _of.app; _of.app = a; }
return _of;
}
export function featureMap(entries, { screenLabel = (_om) => _om, extra = [] } = {}) {
const _of = [];
for (const e of entries || []) {
if (!e || e.state !== 'ready' || !e.manifest) continue;
const _oc = e.manifest; const id = e.id || _oc.id;
if (!id) continue;
const screen = _oc.screen || 'home';
const path = e.core && id === screen ? screen : screen + '/' + id;
_of.push({ id, title: _on(_oc.title || id, 60), screen, screenLabel: screenLabel(screen), path, desc: _on(_oc.desc || _oc.help || '', ASK_LIMITS.featDesc) });
}
for (const _op of extra || []) if (_op && _op.id && _op.path) _of.push({ id: _op.id, title: _on(_op.title || _op.id, 60), screen: _op.screen || '', screenLabel: screenLabel(_op.screen || ''), path: _op.path, desc: _on(_op.desc || '', ASK_LIMITS.featDesc) });
return _of.slice(0, ASK_LIMITS.features);
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
export function memoryLines(list, { max = ASK_LIMITS.memLines, maxChars = ASK_LIMITS.memMax, label = (_o8) => _o8 } = {}) {
const _oe = (Array.isArray(list) ? list : []).filter((_op) => _op && _op.enabled !== false && _op.text);
const own = _oe.filter((_op) => _op.source !== 'seed').sort((a, b) => (Number(b.created_at) || 0) - (Number(a.created_at) || 0));
const seed = _oe.filter((_op) => _op.source === 'seed');
const _of = []; let _oa = 0;
for (const _op of [...own, ...seed]) {
if (_of.length >= max) break;
const _ob = '- ' + label(_op.kind || 'preference') + ': ' + _on(redactPII(_op.text), 200);
if (_oa + _ob.length > maxChars) continue;
_of.push(_ob); _oa += _ob.length + 1;
}
return _of;
}
export function customerLine(c) {
if (!c || typeof c !== 'object' || Number(c.deleted) || !gate(c, 'ai').ok) return '';
const _o5 = (_oo, n) => _on(redactPII(_oo || ''), n);
return [_o5(c.name, 80), c.need && 'Nhu cầu: ' + _o5(c.need, 200), c.project && 'Quan tâm: ' + _o5(c.project, 120), c.status && 'Trạng thái: ' + _o5(c.status, 40), c.note && 'Ghi chú: ' + _o5(c.note, 300)].filter(Boolean).join(' | ');
}
export function pushTurn(history, turn, max = ASK_LIMITS.turns) {
return [...(Array.isArray(history) ? history : []), { q: String(turn.q || ''), a: String(turn.a || ''), mode: turn.mode || '' }].slice(-max);
}
export function recordVote(log, item, { now = Date.now(), max = ASK_LIMITS.feedbackMax } = {}) {
const _ol = { q: _on(redactPII(item.q), 300), a: _on(redactPII(item.a), ASK_LIMITS.exampleMax), vote: item.vote === 'down' ? 'down' : 'up', note: _on(redactPII(item.note || ''), 200), mode: item.mode || '', at: now };
const rest = (Array.isArray(log) ? log : []).filter((_op) => !(_op && _op.q === _ol.q && _op.a === _ol.a));
return [...rest, _ol].slice(-max);
}
const _od = (log) => (Array.isArray(log) ? log : []).filter(Boolean).slice().sort((a, b) => (Number(b.at) || 0) - (Number(a.at) || 0));
export function pickExamples(log, max = ASK_LIMITS.examples, mode = '') {
const ups = _od(log).filter((_op) => _op.vote === 'up' && _op.q && _op.a);
const same = mode ? ups.filter((_op) => _op.mode === mode) : [];
const list = [...same, ...ups.filter((_op) => !same.includes(_op))];
return list.slice(0, Math.min(max, ASK_LIMITS.examples));
}
export function avoidList(log, max = ASK_LIMITS.avoid) {
return _od(log).filter((_op) => _op.vote === 'down' && _op.note).slice(0, max);
}
export function buildAskPrompt(o = {}) {
const { text: q, cut } = clip(redactPII(o.text || ''), ASK_LIMITS.textMax);
const modes = o.modes || parseModes([]);
const mode = modes[o.mode] ? o.mode : 'qa';
const head = [];
head.push('[Vai trò]', _o3(o.role || DEFAULT_ROLE));
head.push('[Quy tắc bắt buộc]');
for (const _oh of [...CORE_RULES, ...(o.mo ? MO_RULES : []), ...(o.rules || [])]) if (String(_oh).trim()) head.push('- ' + _o3(_oh).trim());
if (o.persona) head.push(_o3(o.persona).trim());
const mem = memoryLines(o.memory, { label: o.memLabel });
if (mem.length) head.push('[Điều cần nhớ về chủ app]', ...mem);
if (o.screen) head.push('[Màn đang mở]', 'Anh/chị đang ở: ' + _on(o.screen, 120));
if (o.customer) head.push('[Khách đang mở – khách đã đồng ý lưu dữ liệu, bản rút gọn, không số điện thoại/email]', _on(o.customer, 700));
const _o4 = (o.examples || []).slice(0, ASK_LIMITS.examples);
if (_o4.length) { head.push('[Ví dụ câu trả lời anh/chị đã khen – giữ cách viết này]'); for (const _op of _o4) head.push('Anh/chị: ' + _on(_op.q, 200), 'Em: ' + _on(_op.a, ASK_LIMITS.exampleMax)); }
const _o1 = (o.avoid || []).slice(0, ASK_LIMITS.avoid);
if (_o1.length) { head.push('[Anh/chị từng chê – tránh lặp lại]'); for (const _op of _o1) head.push('- ' + _on(_op.note, 200)); }
head.push('[Chế độ: ' + modes[mode].label + ']', _o3(modes[mode].guide || ''));
head.push('[Cách trả lời]',
'- Chỉ trả lời câu mới nhất của anh/chị, dựa vào hội thoại trước nếu có.',
'- Câu mơ hồ, chưa đủ để trả lời đúng: KHÔNG đoán; chỉ trả đúng 1 dòng "@hoi: <câu hỏi lại> | <lựa chọn 1> | <lựa chọn 2> | <lựa chọn 3>".',
o.actions === false ? '- Không đề nghị thao tác app.' : '- Nếu anh/chị muốn app làm một thao tác, dòng đầu ghi "@route: <loại> <tham số>" (loại: open <mã chức năng> | search <từ cần tìm> | remember <điều cần nhớ> | upgrade <mô tả tính năng mới>), sau đó giải thích ngắn. App sẽ hỏi anh/chị trước khi làm.');
const tail = [];
const rag = (o.kb || []).slice(0, 5).map((_op) => _on(String(_op), 700));
if (rag.length) tail.push('[Mục trong app khớp nhất với câu hỏi – dựa vào đây khi trả lời về app]', ...rag);
const _o7 = (o.history || []).slice(-ASK_LIMITS.turns);
if (_o7.length) { tail.push('[Hội thoại trước]'); for (const _op of _o7) tail.push('Anh/chị: ' + clip(redactPII(_op.q), ASK_LIMITS.turnMax).text, 'Em: ' + clip(redactPII(_op.a), ASK_LIMITS.turnMax).text); }
if (o.refine && _o0[o.refine.kind]) {
tail.push('[Yêu cầu làm lại]', _o0[o.refine.kind] + (o.refine.kind === 'fix' ? ' ' + _on(redactPII(o.refine.note || ''), 500) : ''));
if (o.refine.prev) tail.push('Câu trả lời trước:', '"""', clip(redactPII(o.refine.prev), 1500).text, '"""');
}
tail.push('[Câu mới của anh/chị]', '"""', q, '"""');
const _o6 = head.join('\n').length + tail.join('\n').length + 200;
const feats = []; let _oj = ASK_LIMITS.promptMax - _o6;
for (const _o5 of o.features || []) { const _o9 = featureLine(_o5); if (_o9.length + 1 > _oj) break; feats.push(_o9); _oj -= _o9.length + 1; }
const featBlock = feats.length ? ['[Chức năng có thật trong app – chỉ chỉ đường tới các mục này]', ...feats] : ['[Chức năng có thật trong app]', '(chưa đọc được danh sách – không chỉ đường tới chức năng nào)'];
const offs = []; for (const _o5 of o.offFeatures || []) { const _o9 = '- ' + _o5.title + ' (mã ' + _o5.id + ') – gói "' + _on(_o5.pack || '', 60) + '"'; if (_o9.length + 1 > _oj - 400) break; offs.push(_o9); _oj -= _o9.length + 1; }
if (offs.length) featBlock.push('[Chức năng thuộc gói chưa cài – nói rõ cần cài ở Gói chức năng]', ...offs);
let prompt = [...head, ...featBlock, ...tail].join('\n');
if (prompt.length > ASK_LIMITS.promptMax) prompt = prompt.slice(prompt.length - ASK_LIMITS.promptMax);
return { prompt, cut };
}
export function parseAnswer(raw, { features = [] } = {}) {
let text = _o3(raw).trim();
let action = null; let clarify = null;
const hm = text.match(/^\s*@hoi\s*:\s*(.+)$/im);
if (hm) {
const _og = hm[1].split('|').map((_op) => _op.trim()).filter(Boolean);
if (_og[0]) clarify = { question: _on(_og[0], 300), options: _og.slice(1, 4).map((_op) => _on(_op, 80)) };
text = text.replace(hm[0], '').trim();
}
const _oi = text.match(/^\s*@route\s*:\s*(upgrade|search|remember|open|shortcut|link)\b\s*(.*)$/im);
if (_oi) {
text = text.replace(_oi[0], '').trim();
action = _ok(_oi[1].toLowerCase(), _oi[2].trim(), features);
}
return { answer: text, action, clarify };
}
function _ok(intent, arg, features) {
const a = _on(arg, 300);
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
export function needsConfirm(_oh) {
if (!_oh) return false;
if (_oh.source === 'ai') return true;
if (_oh.intent === 'open' || _oh.intent === 'shortcut' || _oh.intent === 'upgrade') return _oh.match !== 'exact';
return false;
}
export function isVague(text) {
const _om = _o3(text).trim();
if (!_om || /[?？]/.test(_om)) return false;
return fold(_om).split(' ').filter(Boolean).length <= 2;
}
export function isContentJob(text, mode, kws = []) {
if (!kws || !kws.length) return false;
if (mode && mode !== 'qa' && mode !== 'app' && mode !== 'term' && kws.includes('@mode:' + mode)) return true;
const _o5 = ' ' + fold(text).replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
return kws.filter((_o8) => !String(_o8).startsWith('@')).some((_o8) => _o5.includes(' ' + fold(_o8) + ' '));
}
export default { ASK_LIMITS, MO_RULES, buildAskPrompt, parseAnswer, featureMap, memoryLines, customerLine, redactPII, needsConfirm, isVague, isContentJob, recordVote, pickExamples, avoidList, pushTurn, parseModes, findFeature };

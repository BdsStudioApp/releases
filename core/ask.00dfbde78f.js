import { t } from './i18n.c64f4bc3eb.js';
import { fold, words, word, uid, ls } from './xkit.e7637ba4a6.js';
import { parseRemember } from './memory.d0581cf3b8.js';
import { markAi, aiNote, PROVIDER_NAMES } from './ai_cost.2fb10e6822.js';
let AP = null, KB = null, libsP = null;
export function loadAskLibs() {
return libsP || (libsP = Promise.all([import('./ask_prompt.4b91cda12d.js'), import('./ask_kb.ba0a76db5d.js')]).then(([a, _o13]) => { AP = a; KB = _o13; return { AP, KB }; }, (e) => { libsP = null; throw e; }));
}
export const askLibs = () => (AP && KB ? { AP, KB } : null);
export const WORDS = {
'ask.placeholder': 'Hỏi trợ lý, dán link hoặc ảnh…',
'ask.button': 'Hỏi app',
'ask.title': 'Hỏi app',
'ask.modal': 'Trợ lý AI',
'ask.hint': 'Enter để gửi · Shift+Enter xuống dòng · ⌘K / Ctrl+K mở nhanh. Thử: "ghi nhớ: …", "nâng cấp: …", dán link hoặc ảnh.',
'ask.send': 'Gửi',
'ask.attach': 'Ảnh',
'ask.thinking': 'Em đang nghĩ…',
'ask.wait.max': '(tối đa {s} giây)',
'ask.results': 'Kết quả tìm ({n})',
'ask.none': 'Không thấy mục nào khớp. Em hỏi trợ lý giúp anh/chị nhé?',
'ask.ask_ai': 'Hỏi trợ lý',
'ask.not_search': 'Không phải – hỏi trợ lý',
'ask.open': 'Mở',
'ask.remembered': 'Em đã ghi nhớ: {text}',
'ask.undo': 'Bỏ ghi nhớ',
'ask.undo.done': 'Đã bỏ điều vừa ghi nhớ.',
'ask.upgrade': 'Em mở Góp ý với nội dung anh/chị vừa gõ – xem lại rồi bấm "Gửi góp ý". Tính năng mới sẽ đến bằng bản cập nhật gói.',
'ask.feedback': 'Góp ý / Gửi cho người bán',
'ask.fb.missing': 'Phần Góp ý chưa sẵn sàng – mở lại app rồi thử lại.',
'ask.link': 'Đã lưu link vào nguồn ý tưởng.',
'ask.image': 'Đã chuyển ảnh sang màn nhận ảnh.',
'ask.image.none': 'Gói đang dùng chưa có màn nhận ảnh.',
'ask.err': 'Trợ lý chưa trả lời được: {msg}',
'ask.empty.answer': 'Chưa có câu trả lời – khung nhờ trợ lý AI đã đóng trước khi dán kết quả. Gửi lại câu hỏi khi cần.',
'ask.err.empty': 'Trợ lý trả về câu trống.',
'ask.retry': 'Thử lại',
'ask.claude': 'Nhờ Claude',
'ask.noai': 'Chưa nối AI tự động (Gemini miễn phí). Anh/chị bấm "Nhờ Claude" để hỏi qua chat Claude (miễn phí theo gói của anh/chị), hoặc nối Gemini ở Cài đặt › Trợ lý AI.',
'ask.set_ai': 'Mở Cài đặt AI',
'ask.empty': 'Anh/chị gõ câu hỏi (hoặc dán link, ảnh) trước nhé.',
'ask.cut': 'Câu dài quá – em chỉ đọc {n} ký tự đầu.',
'ask.new': 'Cuộc trò chuyện mới',
'ask.you': 'Anh/chị',
'ask.me': 'Trợ lý',
'ask.like': '✓ Đồng ý – chép',
'ask.like.done': 'Đã chép. Em nhớ cách trả lời này cho lần sau.',
'ask.agree.open': '✓ Đồng ý – mở {label}',
'ask.copy': 'Chép nội dung',
'ask.copy.done': 'Đã chép nội dung.',
'ask.timeout': 'Trợ lý chưa trả lời sau {s} giây – mạng chậm hoặc AI đang bận.',
'ask.kb.where': 'Ở đâu',
'ask.kb.does': 'Làm gì',
'ask.kb.in': 'Vào (anh/chị nhập)',
'ask.kb.out': 'Ra (kết quả)',
'ask.kb.cond': 'Điều kiện',
'ask.kb.open': 'Mở {label}',
'ask.kb.more': 'Giải thích thêm',
'ask.kb.other': 'Không phải – tìm cái khác',
'ask.kb.pick': 'Có vài chức năng gần giống – anh/chị chọn một:',
'ask.kb.alts': 'Có phải một trong các chức năng này?',
'ask.kb.alts.none': 'Em không thấy chức năng nào khác khớp. Anh/chị hỏi trợ lý nhé?',
'ask.kb.pack': 'Chức năng này thuộc gói "{pack}" – chưa cài hoặc đang tắt. Chủ app cài/bật ở Cài đặt → Gói chức năng là dùng được ngay.',
'ask.kb.packs': 'Mở Gói chức năng',
'ask.kb.perm': 'Tài khoản này chưa có quyền dùng chức năng này – nhờ Chủ app cấp quyền.',
'ask.kb.building': 'Chức năng này đang tạm lỗi hoặc đang hoàn thiện.',
'ask.kb.steps': 'Cách làm',
'ask.kb.go': 'Tới đây',
'ask.kb.hint': 'Trong lúc chờ – chức năng liên quan em tìm được trong app:',
'ask.kb.more.q': 'Giải thích thêm về chức năng "{label}" trong app: dùng khi nào, cần nhập gì, nhận được gì, lưu ý gì.',
'ask.shorter': 'Làm lại ngắn hơn',
'ask.longer': 'Làm lại chi tiết hơn',
'ask.dislike': '✗ Không đúng ý – nói thêm…',
'ask.fix.label': 'Anh/chị muốn gì?',
'ask.fix.ph': 'Vd: ngắn hơn, bỏ đoạn cuối, thêm ví dụ…',
'ask.fix.send': 'Gửi lại',
'ask.fix.empty': 'Anh/chị gõ điều muốn chỉnh trước nhé.',
'ask.followup': 'Hỏi tiếp',
'ask.redo.shorter': 'Bản ngắn hơn',
'ask.redo.longer': 'Bản chi tiết hơn',
'ask.redo.fix': 'Bản làm lại theo ý anh/chị',
'ask.confirm': 'Em hiểu anh/chị muốn: {what}',
'ask.confirm.yes': 'Làm',
'ask.confirm.no': 'Không phải',
'ask.confirm.no.lead': 'Dạ, em chưa làm gì. Anh/chị nói rõ hơn ở ô dưới, hoặc để em trả lời như câu hỏi thường:',
'ask.what.open': 'mở "{label}"',
'ask.what.remember': 'ghi nhớ "{text}"',
'ask.what.upgrade': 'đề nghị tính năng mới "{text}" (mở Góp ý để anh/chị xem lại rồi gửi)',
'ask.what.search': 'tìm "{text}" trong dữ liệu',
'ask.opened': 'Đã mở {label}',
'ask.back': 'Quay lại',
'ask.vague': 'Anh/chị muốn em làm gì với "{text}"?',
'ask.vague.search': 'Tìm "{text}" trong dữ liệu',
'ask.vague.ask': 'Hỏi đáp về "{text}"',
'ask.vague.app': 'Cách làm "{text}" trong app',
'ask.delegate': 'Giao cho nhân viên AI',
'ask.delegate.done': 'Em mở chat nhân viên phù hợp, nội dung đã điền sẵn – anh/chị xem lại rồi bấm Gửi.',
'ask.ctx.customer': 'Có dùng thông tin rút gọn của khách đang mở (khách đã đồng ý, không số điện thoại/email).',
'ask.modes.label': 'Chế độ trả lời',
'ai.task.assistant': 'Trợ lý Hỏi app',
'help.ask': 'Trợ lý AI / ô Hỏi app nhận lời thường, link, ảnh. App tự chọn việc: tìm dữ liệu, mở đúng màn, ghi nhớ điều anh/chị dặn, mở Góp ý để gửi yêu cầu tính năng mới (gõ "nâng cấp: …"), hoặc trò chuyện với trợ lý AI (nhớ 6 lượt gần nhất). Hỏi về chức năng (vd "cộng tác viên", "sao lưu", "làm sao để nhập khách cũ") → thẻ chức năng hiện ngay: ở đâu, làm gì, cần nhập gì, nhận được gì, kèm nút Mở. Câu trả lời nhắc chức năng nào thì có nút "✓ Đồng ý – mở …" đi tới đúng chỗ. Việc app làm thay anh/chị luôn có nút để anh/chị chọn: Làm / Không phải, Đồng ý / Không đúng ý, Làm lại. Chỉ gọi Claude khi anh/chị bấm "Nhờ Claude".'
};
export function answerView(_o20) {
const answer = String(stripAiRoute(_o20 && _o20.text) || '');
const p = (_o20 && _o20.provider) || '';
return { empty: !answer.trim(), answer, provider: PROVIDER_NAMES[p] || p };
}
export const CORE_KW = {
upgrade: ['nâng cấp', 'thêm tính năng', 'thêm chức năng', 'tính năng mới', 'cần tính năng', 'yêu cầu tính năng', 'cải tiến app', 'sửa app', 'làm thêm tính năng'],
search: ['tìm kiếm', 'tìm', 'tra cứu', 'mở hồ sơ', 'xem hồ sơ'],
open: [
['cài lần đầu;hướng dẫn cài;cài đặt lần đầu', 'settings/onboarding'],
['sao lưu;khôi phục;backup', 'settings/maintenance'],
['điều app biết;bộ nhớ;trí nhớ', 'settings/memory'],
['tính cách;giọng trợ lý', 'settings/persona'],
['gói chức năng;gói mở rộng;cài gói;bật gói', 'settings/packs'],
['tính năng chờ làm;góp ý của tôi;xem góp ý', 'settings/feedback']
]
};
const _o1 = /https?:\/\/[^\s<>"']+/i;
const _o2e = (f, list) => list.map(fold).find((_o13) => f === _o13 || f.startsWith(_o13 + ' ') || f.startsWith(_o13 + ':'));
const _o0 = /^(mo man|mo muc|mo|vao|xem|den|di toi|toi)\s+/;
const _on = (f, list) => { const _ou = f.replace(/[.!?:]+$/, '').replace(_o0, '').trim(); return list.map(fold).some((_o13) => _ou === _o13); };
const _oe = (f, list) => list.map(fold).find((_o13) => new RegExp('(^|[^a-z0-9])' + _o13.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)').test(f));
export function parseShortcuts(_o1b) {
return (_o1b || []).map((l, i) => {
const [kws, path, params] = String(l).split('|').map((s) => (s || '').trim());
if (!kws || !path) return null;
const map = {};
for (const p of (params || '').split(',').map((s) => s.trim()).filter(Boolean)) { const [_o13, v] = p.split('='); if (_o13 && v) map[_o13.trim()] = v.trim(); }
return { id: 'sc' + (i + 1), kws: kws.split(';').map((s) => s.trim()).filter(Boolean), path: path.replace(/^#?\/?/, ''), params: map };
}).filter(Boolean);
}
export function makeIndex(items) {
return (items || []).filter((x) => x && x.id && x.name).map((x) => ({ ...x, _f: fold([x.name, x.sub, ...(x.keys || [])].filter(Boolean).join(' ')), _n: fold(x.name), _p: String(x.phone || '').replace(/\D/g, '') }));
}
export function stripWords(q, strip = []) {
let f = fold(q);
for (const _o2p of [...strip].map(fold).sort((a, _o7) => _o7.length - a.length)) f = f.replace(new RegExp('(^|\\s)' + _o2p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=\\s|$)', 'g'), ' ');
return f.replace(/\s+/g, ' ').trim();
}
export function searchIndex(query, index, { strip = [], kinds, limit = 8 } = {}) {
const raw = String(query || '');
const _oi = raw.replace(/\D/g, '');
const q = stripWords(raw, strip);
const _o2h = q.split(' ').filter((x) => x.length > 0);
const out = [];
for (const _o12 of index || []) {
if (kinds && !kinds.includes(_o12.kind)) continue;
let s = 0;
if (_oi.length >= 4 && _o12._p && _o12._p.includes(_oi)) s = 5;
else if (q && _o12._n === q) s = 4;
else if (q && q.length >= 2 && _o12._n.includes(q)) s = 3;
else if (_o2h.length && _o2h.every((tk) => _o12._f.includes(tk))) s = 2;
else if (_o2h.length > 1) { const _o10 = _o2h.filter((tk) => tk.length > 1 && _o12._f.includes(tk)).length; if (_o10 && _o10 >= Math.ceil(_o2h.length / 2)) s = 1; }
if (s) out.push({ item: _o12, score: s });
}
return out.sort((a, _o7) => _o7.score - a.score || a.item.name.localeCompare(_o7.item.name, 'vi')).slice(0, limit);
}
export function resolveShortcut(_o27, rest, index, { strip = [] } = {}) {
const matched = {}; const params = {};
const f = fold(rest);
for (const [param, kind] of Object.entries(_o27.params || {})) {
let pool = (index || []).filter((x) => x.kind === kind);
if (kind === 'variant') {
const parent = Object.values(matched)[0];
if (parent) pool = pool.filter((x) => x.parent === parent.id);
const _o10 = pool.find((x) => new RegExp('(^|\\s)' + x._n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|$)').test(f));
if (_o10) { matched[kind] = _o10; params[param] = _o10.value || _o10.name; }
continue;
}
const r = searchIndex(rest, pool, { strip })[0];
if (r && r.score >= 2) { matched[kind] = r.item; params[param] = r.item.id; continue; }
const q = ' ' + stripWords(rest, strip) + ' ';
let _o8 = null, bestN = 0;
for (const _o12 of pool) {
const n = _o12._n.split(' ').filter((_o2p) => _o2p.length >= 3 && q.includes(' ' + _o2p + ' ')).length;
if (n > bestN) { _o8 = _o12; bestN = n; }
}
if (_o8) { matched[kind] = _o8; params[param] = _o8.id; }
}
const qs = new URLSearchParams(params).toString();
return { path: _o27.path + (qs ? (_o27.path.includes('?') ? '&' : '?') + qs : ''), params, matched };
}
export function kbFirst(text, f, { kb, kbStop = [], kw = CORE_KW, shortcuts = [], strip = [], index = [] } = {}) {
const _o2o = f.match(_o0);
if (_o2o) {
const rest = f.slice(_o2o[0].length).replace(/[.!?:]+$/, '').trim();
const _o10 = KB.searchKb(rest, kb, { stop: kbStop, limit: 2 });
const _om = _o10[0] && _o10[0].score === 100 && _o10[0].entry._k.includes(rest.replace(/[^a-z0-9]+/g, ' ').trim());
if (_om && (!_o10[1] || _o10[1].score < 100) && _o10[0].entry.avail === 'ok') return { intent: 'open', path: _o10[0].entry.path, label: _o10[0].entry.title, match: 'exact', kb: _o10[0].entry.id };
return null;
}
if (_o2e(f, kw.search)) return null;
if (f.split(' ').length <= 6) { const _of = searchIndex(text, index, { strip }); if (_of.length && _of[0].score >= 4) return null; }
const r = KB.kbRoute(text, kb, { stop: kbStop });
if (!r) return null;
for (const _o27 of shortcuts) {
const _o19 = _o2e(f, _o27.kws);
if (!_o19) continue;
const rest = f.replace(_o19, ' ').replace(/[.!?:]+$/, '').trim();
if (rest && Object.keys(resolveShortcut(_o27, rest, index, { strip }).params).length) return null;
if (r.hits[0].score < 100) return null;
if (r.entry.kind === 'action' && r.entry.path === _o27.path) return null;
}
return r;
}
export function routeAsk(input, { shortcuts = [], strip = [], index = [], kw = CORE_KW, imagePath = '', linkPath = '', kb = null, kbStop = [] } = {}) {
const text = String((input && input.text) || '').trim();
const images = (input && input.images) || [];
const f = fold(text);
if (images.length) return { intent: 'image', images, text, path: imagePath };
if (!text) return { intent: 'none' };
const _o1h = parseRemember(text);
if (_o1h) return { intent: 'remember', memory: _o1h };
const _o2m = _o2e(f, kw.upgrade); const _o2l = _o2m || _oe(f, kw.upgrade);
if (_o2l) return { intent: 'upgrade', text: text.replace(/^\s*(nâng cấp|nang cap)\s*[:：-]?\s*/i, '') || text, match: _o2m ? 'exact' : 'fuzzy' };
const url = (text.match(_o1) || [])[0];
if (url) {
if (/github\.com\//i.test(url)) return { intent: 'upgrade', text, url, match: 'fuzzy' };
return { intent: 'link', url: url.replace(/[).,;]+$/, ''), note: text.replace(url, '').trim(), path: linkPath };
}
if (kb && kb.entries && kb.entries.length) {
const r = kbFirst(text, f, { kb, kbStop, kw, shortcuts, strip, index });
if (r) return r;
}
for (const [kws, path] of kw.open || []) {
const _o13 = _oe(f, kws.split(';'));
if (_o13 && f.split(' ').length <= 6) return { intent: 'open', path, match: _on(f, kws.split(';')) ? 'exact' : 'fuzzy' };
}
for (const _o27 of shortcuts) {
const _o19 = _o2e(f, _o27.kws); const _o13 = _o19 || _oe(f, _o27.kws);
if (_o13) {
const rest = f.replace(_o13, ' ').trim();
const r = resolveShortcut(_o27, rest, index, { strip });
return { intent: 'shortcut', id: _o27.id, path: r.path, params: r.params, matched: r.matched, rest, match: _o19 ? 'exact' : 'fuzzy' };
}
}
const _o2d = _o2e(f, kw.search);
if (_o2d) {
const query = f.slice(_o2d.length).replace(/^[:\s]+/, '');
return { intent: 'search', query, results: searchIndex(query, index, { strip }) };
}
if (f.split(' ').length <= 6) {
const _o20 = searchIndex(text, index, { strip });
if (_o20.length && _o20[0].score >= 3) return { intent: 'search', query: text, results: _o20 };
}
return { intent: 'assistant', text };
}
export function parseAiRoute(answer) {
const _o1d = String(answer || '').match(/^\s*@route\s*:\s*(upgrade|search|link|remember|shortcut|open)\b\s*(.*)$/im);
if (!_o1d) return null;
return { intent: _o1d[1].toLowerCase(), arg: _o1d[2].trim() };
}
export function stripAiRoute(answer) { return String(answer || '').replace(/^\s*@route\s*:.*$/im, '').trim(); }
export function assistantPrompt(text, { screens = [], shortcuts = [] } = {}) {
return [
'Câu của chủ app trong ô "Hỏi app":', '"""', text, '"""', '',
'Nếu câu này thực chất là thao tác của app, chỉ trả về MỘT dòng đầu dạng "@route: <loại> <tham số>" với loại ∈ {search <từ cần tìm>, upgrade <mô tả>, remember <điều cần nhớ>' +
(shortcuts.length ? ', shortcut <' + shortcuts.map((s) => s.kws[0]).join(' | ') + '> <tham số>' : '') + '}.',
'Nếu không, trả lời thẳng câu hỏi bằng tiếng Việt' + (screens.length ? ' (app có các màn: ' + screens.join(', ') + ')' : '') + '.'
].join('\n');
}
export function titleFromUrl(url) {
try {
const _o2k = new URL(url);
const _o29 = _o2k.pathname.split('/').filter(Boolean).pop() || '';
const s = decodeURIComponent(_o29).replace(/\.[a-z0-9]{2,5}$/i, '').replace(/[-_]+/g, ' ').replace(/\b\d{5,}\b/g, '').trim();
return (s ? s.charAt(0).toUpperCase() + s.slice(1) : _o2k.hostname).slice(0, 120);
} catch { return String(url).slice(0, 120); }
}
export async function buildIndex({ store, data }) {
const items = [];
const _o1q = (kind, id) => (word('ask.path.' + kind) || '').replace('{id}', encodeURIComponent(id));
try {
const _o1l = await store.list('objects');
for (const o of _o1l) items.push({ kind: o.kind || 'customer', id: o.id, name: o.name || '', phone: o.phone || o.zalo || '', sub: [o.project, o.status].filter(Boolean).join(' · '), path: _o1q(o.kind || 'customer', o.id) });
} catch { }
for (const p of (data && data.projects) || []) {
items.push({ kind: 'project', id: p.id, name: p.name || p.id, sub: [p.dev, p.area, p.loc].filter(Boolean).join(' · '), keys: [p.id, p.area], path: _o1q('project', p.id) });
for (const _o2j of p.types || []) if (_o2j && _o2j.n) items.push({ kind: 'variant', id: p.id + ':' + _o2j.n, name: String(_o2j.n), value: String(_o2j.n), parent: p.id, sub: p.name, path: _o1q('project', p.id) });
}
return makeIndex(items);
}
export const CONV_KEY = 'bds:ask:conv';
export const VOTE_KEY = 'bds:ask:votes';
export const MODE_KEY = 'bds:ask:mode';
export function createAsk(deps) {
const { ui, store, ai, nav, memory, openFeedback } = deps;
const { h, button, toast, modal } = ui;
let current = null;
const _o4 = (p) => !p || typeof deps.allowPath !== 'function' || deps.allowPath(p);
let _oa = false;
let turns = [];
let mode = 'qa';
const _o17 = () => { try { return (deps.getKb && deps.getKb()) || null; } catch { return null; } };
const kbStop = () => words('ask.kb.stop');
const opts = () => ({
shortcuts: parseShortcuts(words('ask.shortcuts')).filter((_o27) => _o4(_o27.path)), strip: words('ask.strip'),
imagePath: [word('ask.image.path').replace(/^#?\/?/, '')].filter(_o4)[0] || '', linkPath: [word('ask.link.path').replace(/^#?\/?/, '')].filter(_o4)[0] || '',
kb: mode === 'qa' || mode === 'app' ? _o17() : null, kbStop: kbStop()
});
const modes = () => AP.parseModes(words('ask.modes'));
const features = () => {
const kb = _o17();
if (kb) return KB.kbFeatures(kb, (s) => t('screen.' + s)).ok;
try { return (deps.getFeatures && deps.getFeatures()) || []; } catch { return []; }
};
const _o24 = () => ls.set(CONV_KEY, turns.length ? { turns, mode } : null);
const _op = (path) => { const f = AP.findFeature(features(), path); return f ? f.title : String(path || '').split('?')[0]; };
async function handle(input, out) {
await loadAskLibs();
const o = opts();
const index = await buildIndex({ store, data: deps.data });
const r = routeAsk(input, { ...o, index });
return act(r, input, out, o, index);
}
const _o26 = (out, who, ...nodes) => {
if (!out) return null;
const el = h('div', { class: 'xa-msg xa-' + who }, ...nodes);
out.appendChild(el);
out.scrollTop = out.scrollHeight;
return el;
};
const _o1g = (out, text) => _o26(out, 'me', h('span', { class: 'sr-only' }, t('ask.you') + ': '), text);
function _ox(path, label) {
const back = typeof location !== 'undefined' ? location.hash : '';
close(); nav(path);
const el = toast(t('ask.opened', { label: label || _op(path) }), 'info', 7000);
if (el && back) {
el.setAttribute('data-testid', 'ask-opened');
el.appendChild(button(t('ask.back'), () => { location.hash = back; el.remove(); }, { kind: 'ghost', small: true, testid: 'ask-back' }));
}
}
function _od(out, what, run, input) {
const card = _o26(out, 'sys', h('p', { class: 'xa-confirm-q' }, t('ask.confirm', { what })));
card.setAttribute('data-testid', 'ask-confirm');
card.appendChild(h('div', { class: 'btn-row' },
button(t('ask.confirm.yes'), async () => { card.remove(); await run(); }, { kind: 'primary', small: true, icon: 'check', testid: 'ask-confirm-yes' }),
button(t('ask.confirm.no'), () => {
ui.mountTo(card, h('p', { class: 'muted' }, t('ask.confirm.no.lead')),
h('div', { class: 'btn-row' }, markAi(button(t('ask.ask_ai'), () => { card.remove(); return _o5(out, { text: input.text, noRoute: true }); }, { kind: 'secondary', small: true, testid: 'ask-fallback-ai' }), 'ask_ai')));
_os();
}, { kind: 'ghost', small: true, testid: 'ask-confirm-no' })));
return card;
}
const _o2r = (r) => {
if (r.intent === 'open' || r.intent === 'shortcut') return t('ask.what.open', { label: r.label || _op(r.path) });
if (r.intent === 'remember') return t('ask.what.remember', { text: (r.memory && r.memory.text) || r.arg });
if (r.intent === 'upgrade') return t('ask.what.upgrade', { text: AP.clip(r.text || r.arg || '', 120).text });
if (r.intent === 'search') return t('ask.what.search', { text: r.query || r.arg });
return r.intent;
};
async function act(r, input, out, o, index, { confirmed = false } = {}) {
if (!confirmed && AP.needsConfirm(r)) { _od(out, _o2r(r), () => act(r, input, out, o, index, { confirmed: true }), input); return r; }
switch (r.intent) {
case 'remember': {
const _o20 = await memory.add({ ...r.memory, source: 'ask' });
if (_o20.private) { _o26(out, 'sys', h('p', { class: 'warn-text' }, t('mem.private'))); return r; }
const _o9 = _o26(out, 'sys', h('p', { class: 'ok-text', 'data-testid': 'ask-remembered' }, _o20.dup ? t('mem.dup') : t('ask.remembered', { text: r.memory.text })));
_o9.appendChild(h('div', { class: 'btn-row' },
!_o20.dup && _o20.item && memory.remove ? button(t('ask.undo'), async () => { await memory.remove(_o20.item.id); ui.mountTo(_o9, h('p', { class: 'muted' }, t('ask.undo.done'))); }, { kind: 'ghost', small: true, testid: 'ask-undo' }) : null,
button(t('mem.title'), () => _ox('settings/memory', t('mem.title')), { kind: 'ghost', small: true })));
return r;
}
case 'upgrade': {
const text = [r.text || input.text, r.url && !String(r.text || '').includes(r.url) ? r.url : ''].filter(Boolean).join('\n');
close();
if (typeof openFeedback === 'function') { openFeedback({ kind: 'add', text }); toast(t('ask.upgrade'), 'info', 4000); }
else nav('settings/feedback');
return r;
}
case 'kb': _o14(out, r, input); return r;
case 'open': case 'shortcut': _ox(r.path, r.label); return r;
case 'link': {
const _o23 = await store.put('ideas', { title: titleFromUrl(r.url), url: r.url, summary: r.note || '', source: 'ask', status: 'new' });
toast(t('ask.link'), 'ok');
if (r.path) _ox(r.path + (r.path.includes('?') ? '&' : '?') + 'id=' + encodeURIComponent(_o23.id));
else _o26(out, 'sys', h('p', { class: 'ok-text' }, t('ask.link')));
return r;
}
case 'image': {
if (!r.path) { _o26(out, 'sys', h('p', { class: 'warn-text' }, t('ask.image.none'))); return r; }
_ox(r.path);
_oy(r.images);
return r;
}
case 'search': {
const results = r.results || searchIndex(r.query, index, { strip: o.strip });
const _oo = markAi(button(results.length ? t('ask.not_search') : t('ask.ask_ai'), () => _o5(out, { text: input.text || r.query, noRoute: true }), { kind: results.length ? 'ghost' : 'primary', small: true, testid: 'ask-fallback-ai' }), 'ask_ai');
if (!results.length) { _o26(out, 'sys', h('p', { class: 'muted' }, t('ask.none')), _oo); return r; }
_o26(out, 'sys', h('h4', { class: 'section-title' }, t('ask.results', { n: results.length })),
ui.list(results, ({ item }) => h('div', { class: 'row-main', 'data-testid': 'ask-hit' },
h('div', { class: 'row-text' }, h('strong', null, item.name), h('span', { class: 'muted small' }, [word('ask.kind.' + item.kind) || item.kind, item.sub].filter(Boolean).join(' · '))),
item.path ? button(t('ask.open'), () => _ox(item.path, item.name), { kind: 'secondary', small: true }) : null), { onClick: ({ item }) => item.path && _ox(item.path, item.name) }),
h('div', { class: 'btn-row' }, _oo));
return r;
}
case 'assistant': {
if (mode === 'qa' && AP.isVague(r.text)) { _oc(out, r.text, input, o, index); return r; }
await _o5(out, { text: r.text });
return r;
}
default: return r;
}
}
const _o1n = () => { const e = KB.kbGet(_o17(), 'packs'); return (e && e.title) || t('ask.kb.packs'); };
function _ov(e) {
if (!e) return;
if (e.avail === 'ok' || e.avail === 'building' || e.avail === 'error') { _ox(e.path, e.title); return; }
if (e.avail === 'pack') { _ox(KB.PACKS_PATH, _o1n()); return; }
toast(t('ask.kb.perm'), 'warn', 5000);
}
const _ow = (e) => (e.avail === 'pack' ? t('ask.kb.packs') : t('ask.kb.open', { label: e.title }));
const _o1y = (ref) => { const kb = _o17(); return KB.kbGet(kb, ref) || null; };
function moBody(text) {
const kb = _o17();
const _o1b = String(text || '').split(/\n/);
const out = [];
for (const _o1a of _o1b) {
if (!_o1a.trim()) continue;
const { parts } = kb ? KB.parseMo(_o1a, kb) : { parts: [_o1a.replace(KB.MO_RE, '')] };
out.push(h('p', null, ...parts.map((p) => (typeof p === 'string' ? p : button(p.entry.avail === 'pack' ? p.entry.title + ' · ' + t('ask.kb.packs') : p.entry.title, () => _ov(p.entry), { kind: 'ghost', small: true, icon: 'next', testid: 'ask-mo', cls: 'xa-mo' })))));
}
return out;
}
const _o18 = (e) => {
if (e.avail === 'pack') return h('p', { class: 'warn-text small', 'data-testid': 'ask-kb-pack' }, t('ask.kb.pack', { pack: e.packTitle || '' }));
if (e.avail === 'perm') return h('p', { class: 'warn-text small', 'data-testid': 'ask-kb-perm' }, t('ask.kb.perm'));
if (e.avail === 'building' || e.avail === 'error') return h('p', { class: 'muted small' }, t('ask.kb.building'));
return null;
};
function _ol(_o9, e, r, input, out) {
const _o23 = (_o13, v) => (v ? h('div', { class: 'xa-kb-row' }, h('dt', null, t(_o13)), h('dd', null, v)) : null);
const steps = r.howto && e.steps && e.steps.length ? h('div', { class: 'xa-kb-steps', 'data-testid': 'ask-kb-steps' },
h('p', { class: 'small xa-kb-steps-t' }, t('ask.kb.steps')),
h('ol', null, e.steps.map((s) => { const _o2g = s.ref ? _o1y(s.ref) : null; return h('li', null, h('span', null, s.text), _o2g ? button(t('ask.kb.go'), () => _ov(_o2g), { kind: 'ghost', small: true, testid: 'ask-step-go' }) : null); }))) : null;
const _o1m = h('div', { class: 'xa-kb-alts', hidden: true, 'data-testid': 'ask-kb-alts' });
ui.mountTo(_o9,
h('span', { class: 'sr-only' }, t('ask.me') + ': '),
h('h4', { class: 'xa-kb-title', 'data-testid': 'ask-kb-title' }, e.title),
h('dl', { class: 'xa-kb-dl' }, _o23('ask.kb.where', e.where), _o23('ask.kb.does', e.does), _o23('ask.kb.in', e.input), _o23('ask.kb.out', e.output), _o23('ask.kb.cond', e.cond)),
_o18(e), steps,
h('div', { class: 'xa-acts', 'data-testid': 'ask-kb-actions' },
e.avail === 'perm' ? null : button(_ow(e), () => _ov(e), { kind: 'primary', small: true, icon: 'next', testid: e.avail === 'pack' ? 'ask-kb-packs' : 'ask-kb-open' }),
button(t('ask.kb.more'), () => _o5(out, { text: t('ask.kb.more.q', { label: e.title }), pin: e }), { kind: 'secondary', small: true, icon: 'sparkle', testid: 'ask-kb-more' }),
button(t('ask.kb.other'), () => {
_o1m.hidden = !_o1m.hidden;
if (_o1m.hidden) return;
const alts = (r.hits || []).filter((x) => x.entry !== e).slice(0, KB.KB_LIMITS.alt);
ui.mountTo(_o1m,
h('p', { class: 'small' }, alts.length ? t('ask.kb.alts') : t('ask.kb.alts.none')),
h('div', { class: 'xa-chips' }, ...alts.map((x) => button(x.entry.title, () => _ol(_o9, x.entry, { ...r, hits: r.hits }, input, out), { kind: 'secondary', small: true, testid: 'ask-kb-alt' })),
button(t('ask.ask_ai'), () => _o5(out, { text: input.text, noKb: true }), { kind: 'ghost', small: true, testid: 'ask-fallback-ai' })));
}, { kind: 'ghost', small: true, testid: 'ask-kb-other' })),
_o1m);
_o9.dataset.kb = e.id;
_o2c(out, _o9);
}
function _o2c(out, el) {
try { if (out && el) out.scrollTop += el.getBoundingClientRect().top - out.getBoundingClientRect().top - 8; } catch { }
}
function _o14(out, r, input) {
const _o9 = _o26(out, 'ai');
_o9.classList.add('xa-kb');
_o9.setAttribute('data-testid', 'ask-kb');
if (r.ambiguous) {
const top = r.hits.filter((x) => x.score > r.hits[0].score - 5).slice(0, 4);
ui.mountTo(_o9, h('p', null, t('ask.kb.pick')),
h('div', { class: 'xa-chips', 'data-testid': 'ask-kb-pick' }, ...top.map((x) => button(x.entry.title, () => _ol(_o9, x.entry, r, input, out), { kind: 'secondary', small: true, testid: 'ask-kb-chip' }))));
_o2c(out, _o9);
} else _ol(_o9, r.entry, r, input, out);
const e = r.entry;
turns = AP.pushTurn(turns, { q: input.text || '', a: e.title + ' [[mo:' + e.id + ']] – ' + e.where + '. ' + e.does, mode });
_o24();
return _o9;
}
function _oc(out, text, input, o, index) {
const _o9 = _o26(out, 'ai', h('p', null, t('ask.vague', { text })));
_o9.setAttribute('data-testid', 'ask-clarify-msg');
const _o1r = (fn) => async () => { _o9.querySelectorAll('button').forEach((_o7) => { _o7.disabled = true; }); await fn(); };
_o9.appendChild(h('div', { class: 'xa-chips', 'data-testid': 'ask-clarify' },
button(t('ask.vague.search', { text }), _o1r(() => act({ intent: 'search', query: text, results: searchIndex(text, index, { strip: o.strip }) }, input, out, o, index)), { kind: 'secondary', small: true, testid: 'ask-chip' }),
button(t('ask.vague.ask', { text }), _o1r(() => _o5(out, { text })), { kind: 'secondary', small: true, testid: 'ask-chip' }),
button(t('ask.vague.app', { text }), _o1r(() => _o5(out, { text, mode: 'app' })), { kind: 'secondary', small: true, testid: 'ask-chip' })));
}
function _o16(text, { pin, min = 30, limit = KB.KB_LIMITS.rag } = {}) {
const kb = _o17();
if (!kb) return [];
const list = KB.searchKb(text, kb, { stop: kbStop(), min }).map((x) => x.entry).filter((e) => e !== pin);
return [...(pin ? [pin] : []), ...list].slice(0, limit);
}
async function _o1v({ text, mode: _o1d, refine, history, noRoute, pin, noKb }) {
const f = features();
const kb = _o17();
const r = (deps.getRoute && deps.getRoute()) || null;
let screen = '';
if (r && r.screen) {
const _o1i = r.module ? AP.findFeature(f, r.screen + '/' + r.module) : null;
screen = [t('screen.' + r.screen), _o1i && _o1i.title].filter(Boolean).join(' › ');
}
let customer = '';
try {
const id = r && r.query && r.query.get && r.query.get('open');
if (id && store && store.get) customer = AP.customerLine(await store.get('objects', id));
} catch { }
let persona = '';
try { persona = deps.persona ? deps.persona.systemPrompt('owner', { withMemory: false }) : ''; } catch { }
const _o1c = ls.get(VOTE_KEY, []);
const built = AP.buildAskPrompt({
text, mode: _o1d, modes: modes(), role: word('ask.ai.role'), rules: words('ask.ai.rules'), persona,
memory: memory && memory.list ? memory.list() : [], memLabel: (_o13) => t('mem.kind.' + _o13),
features: f, screen, customer, examples: AP.pickExamples(_o1c, 3, _o1d), avoid: AP.avoidList(_o1c),
history, refine, actions: !noRoute,
mo: !!kb, kb: noKb ? (pin ? [KB.kbLine(pin)] : []) : _o16(text, { pin }).map(KB.kbLine), offFeatures: kb ? KB.kbFeatures(kb, (s) => t('screen.' + s)).off : []
});
return { ...built, customer: !!customer };
}
function _o15(text, pin) {
const list = _o16(text, { pin, min: KB.KB_LIMITS.medium, limit: 3 });
if (!list.length) return null;
return h('div', { class: 'xa-kb-hint', 'data-testid': 'ask-kb-hint' }, h('p', { class: 'muted small' }, t('ask.kb.hint')),
h('div', { class: 'xa-chips' }, ...list.map((e) => button(e.avail === 'pack' ? e.title + ' · ' + t('ask.kb.packs') : e.title, () => _ov(e), { kind: 'secondary', small: true, icon: 'next', testid: 'ask-kb-hint-go' }))));
}
async function _o5(out, o) {
if (_oa) return null;
const _o1d = o.mode || mode;
const text = String(o.text || '').trim();
if (!text) return null;
const _o2n = o.provider === 'handoff_claude';
if (!_o2n && ai.connected && !ai.connected()) { _o1k(out, o); return null; }
_oa = true; _o2b(true);
const limit = Number(deps.aiTimeoutMs) > 0 ? Number(deps.aiTimeoutMs) : AP.ASK_LIMITS.aiTimeoutMs;
const _o28 = Math.round(limit / 1000);
const _o2q = h('p', { class: 'muted', 'data-testid': 'ask-thinking' }, ui.spinner(), ' ', t('ask.thinking'), _o2n ? '' : ' ' + t('ask.wait.max', { s: _o28 }));
const _oz = o.refine || _o2n ? null : _o15(text, o.pin);
let holder = o.bubble;
if (holder) { holder.classList.add('is-busy'); holder.appendChild(_o2q); } else holder = _o26(out, 'ai', _o2q);
if (_oz) holder.appendChild(_oz);
const history = turns.filter((x) => x !== o.turn);
let _o20, built, timer;
try {
built = await _o1v({ text, mode: _o1d, refine: o.refine, history, noRoute: o.noRoute, pin: o.pin, noKb: o.noKb });
let _o1u = false;
if (!_o2n && typeof ai.preflight === 'function') { const _o1t = await ai.preflight('assistant', { provider: o.provider, feature: 'ask_ai', prompt: built.prompt }); _o1u = !['ollama', 'handoff_claude', 'handoff_gemini'].includes(_o1t); }
const run = Promise.resolve(ai.run('assistant', { prompt: built.prompt, provider: o.provider, raw: true, temperature: 0.3, feature: 'ask_ai', confirmed: _o1u }));
if (_o2n) _o20 = await run;
else {
run.catch(() => { });
_o20 = await Promise.race([run, new Promise((_, rej) => { timer = setTimeout(() => rej(Object.assign(new Error(t('ask.timeout', { s: _o28 })), { code: 'TIMEOUT' })), limit); })]);
}
if (!_o2n && !String((_o20 && _o20.text) || '').trim()) throw new Error(t('ask.err.empty'));
} catch (e) {
_o2q.remove(); holder.classList.remove('is-busy');
if (e && e.code === 'AI_CANCELLED') { const _ob = h('p', { class: 'muted', 'data-testid': 'ask-cancelled' }, e.message || t('ask.empty.answer')); if (o.bubble) holder.appendChild(_ob); else ui.mountTo(holder, _ob); return null; }
const _oj = () => { err.remove(); if (_oz) _oz.remove(); if (!o.bubble) holder.remove(); };
const msg = e && e.code === 'TIMEOUT' ? e.message : t('ask.err', { msg: (e && (e.userMessage || e.message)) || '' });
const err = h('div', { class: 'xa-err', 'data-testid': 'ask-error' }, h('p', { class: 'warn-text' }, msg),
h('div', { class: 'btn-row' },
button(t('ask.retry'), () => { _oj(); return _o5(out, o); }, { kind: 'primary', small: true, icon: 'next', testid: 'ask-retry' }),
button(t('ask.claude'), () => { _oj(); return _o5(out, { ...o, provider: 'handoff_claude' }); }, { kind: 'ghost', small: true, icon: 'sparkle', testid: 'ask-claude' })));
if (o.bubble) holder.appendChild(err); else ui.mountTo(holder, err, _oz);
return null;
} finally { clearTimeout(timer); _oa = false; _o2b(false); }
_o2q.remove(); holder.classList.remove('is-busy');
if (_oz) _oz.remove();
if (_o2n && !String((_o20 && _o20.text) || '').trim()) { if (!o.bubble) holder.remove(); return null; }
const _o1p = AP.parseAnswer(_o20 && _o20.text, { features: features() });
const notes = [];
if (built.cut) notes.push(h('p', { class: 'muted small', 'data-testid': 'ask-cut' }, t('ask.cut', { n: AP.ASK_LIMITS.textMax.toLocaleString('vi-VN') })));
if (built.customer) notes.push(h('p', { class: 'muted small', 'data-testid': 'ask-ctx' }, t('ask.ctx.customer')));
if (_o1p.clarify && !_o1p.answer) {
turns = AP.pushTurn(turns.filter((x) => x !== o.turn), { q: text, a: _o1p.clarify.question, mode: _o1d }); _o24();
ui.mountTo(holder, h('p', null, _o1p.clarify.question), ...notes,
_o1p.clarify.options.length ? h('div', { class: 'xa-chips', 'data-testid': 'ask-clarify' }, _o1p.clarify.options.map((op) =>
button(op, () => { holder.querySelectorAll('.xa-chips button').forEach((_o7) => { _o7.disabled = true; }); _o1g(out, op); return _o5(out, { text: op, mode: _o1d }); }, { kind: 'secondary', small: true, testid: 'ask-chip' }))) : null);
holder.setAttribute('data-testid', 'ask-clarify-msg');
return _o1p;
}
const answer = _o1p.answer || (_o1p.clarify ? _o1p.clarify.question : '');
const turn = { q: text, a: answer, mode: _o1d };
const _o6 = o.turn ? turns.indexOf(o.turn) : -1;
if (_o6 >= 0) turns[_o6] = turn; else turns = AP.pushTurn(turns, turn);
_o24();
if (answer) _o1z(out, holder, { turn, provider: _o20 && _o20.provider, notes, redo: o.refine && o.refine.kind });
else holder.remove();
if (!o.bubble && out) out.scrollTop = out.scrollHeight;
if (_o1p.action) {
const o2 = opts();
const index = _o1p.action.intent === 'search' ? await buildIndex({ store, data: deps.data }) : [];
const r = _o2(_o1p.action, index, o2);
if (r) await act(r, { text }, out, o2, index);
}
return _o1p;
}
function _o2(a, index, o) {
if (a.intent === 'open') return { intent: 'open', path: a.path, label: a.label, source: 'ai' };
if (a.intent === 'search') return { intent: 'search', query: a.query, results: searchIndex(a.query, index, { strip: o.strip }), source: 'ai' };
if (a.intent === 'upgrade') return { intent: 'upgrade', text: a.text, source: 'ai' };
if (a.intent === 'remember') return { intent: 'remember', memory: parseRemember('ghi nhớ: ' + a.arg) || { kind: 'preference', text: a.arg }, source: 'ai' };
return null;
}
function _o1k(out, o) {
const _o9 = _o26(out, 'ai', h('p', { class: 'warn-text' }, t('ask.noai')));
_o9.setAttribute('data-testid', 'ask-noai');
_o9.appendChild(h('div', { class: 'btn-row' },
button(t('ask.claude'), () => { _o9.remove(); return _o5(out, { ...o, provider: 'handoff_claude' }); }, { kind: 'primary', small: true, icon: 'sparkle', testid: 'ask-claude' }),
button(t('ask.set_ai'), () => _ox('settings/ai', t('ask.set_ai')), { kind: 'ghost', small: true })));
}
function _o1z(out, holder, { turn, provider, notes = [], redo }) {
holder.setAttribute('data-testid', 'ask-answer');
const _oq = h('div', { class: 'xa-fix', hidden: true, 'data-testid': 'ask-fix' });
const vote = (v, note) => ls.set(VOTE_KEY, AP.recordVote(ls.get(VOTE_KEY, []), { q: turn.q, a: turn.a, vote: v, note, mode: turn.mode }));
const _o1x = (kind, label, testid) => button(label, () => _o5(out, { text: turn.q, mode: turn.mode, refine: { kind, prev: turn.a }, bubble: holder, turn }), { kind: 'ghost', small: true, testid });
const _og = word('ask.delegate.module');
const _oh = !!(deps.hasModule && _og && deps.hasModule(_og) && AP.isContentJob(turn.q, turn.mode, words('ask.delegate.kw')));
const _o1w = provider ? (t('ai.provider.' + provider) !== 'ai.provider.' + provider ? t('ai.provider.' + provider) : (PROVIDER_NAMES[provider] || provider)) : '';
const kb = _o17();
const refs = kb ? KB.parseMo(turn.a, kb).refs : [];
const _o1s = kb ? KB.moPlain(turn.a, kb) : String(turn.a || '').replace(KB.MO_RE, '').trim();
const _o1f = refs[0] || null;
ui.mountTo(holder,
h('span', { class: 'sr-only' }, t('ask.me') + ': '),
redo ? h('p', { class: 'muted small', 'data-testid': 'ask-redo' }, t('ask.redo.' + redo)) : null,
h('div', { class: 'xa-body prose' }, ...moBody(turn.a)),
...notes,
_o1w ? h('p', { class: 'muted small xa-prov' }, _o1w) : null,
h('div', { class: 'xa-acts', 'data-testid': 'ask-actions' },
_o1f
? button(t('ask.agree.open', { label: _o1f.avail === 'pack' ? _o1n() : _o1f.title }), () => { vote('up'); _ov(_o1f); }, { kind: 'primary', small: true, icon: 'check', testid: 'ask-like' })
: button(t('ask.like'), async () => { await ui.copy(_o1s, { silent: true }); vote('up'); toast(t('ask.like.done'), 'ok'); }, { kind: 'primary', small: true, testid: 'ask-like' }),
_o1f ? button(t('ask.copy'), async () => { await ui.copy(_o1s, { silent: true }); toast(t('ask.copy.done'), 'ok'); }, { kind: 'ghost', small: true, testid: 'ask-copy' }) : null,
_o1x('shorter', t('ask.shorter'), 'ask-shorter'),
_o1x('longer', t('ask.longer'), 'ask-longer'),
button(t('ask.dislike'), () => { _oq.hidden = !_oq.hidden; if (!_oq.hidden) fixTa.focus(); }, { kind: 'ghost', small: true, testid: 'ask-dislike' }),
button(t('ask.followup'), () => _os(), { kind: 'ghost', small: true, testid: 'ask-followup' }),
provider !== 'handoff_claude' ? button(t('ask.claude'), () => _o5(out, { text: turn.q, mode: turn.mode, provider: 'handoff_claude', bubble: holder, turn }), { kind: 'ghost', small: true, icon: 'sparkle', testid: 'ask-claude' }) : null,
_oh ? button(t('ask.delegate'), () => {
const p = word('ask.delegate.path').replace(/^#?\/?/, '');
close(); nav(p + (p.includes('?') ? '&' : '?') + 'ask=' + encodeURIComponent(AP.clip(turn.q, 1500).text));
toast(t('ask.delegate.done'), 'info', 5000);
}, { kind: 'secondary', small: true, icon: 'user', testid: 'ask-delegate' }) : null),
_oq);
const fixTa = h('textarea', { class: 'xa-input xa-fix-input', rows: 2, placeholder: t('ask.fix.ph'), 'aria-label': t('ask.fix.label'), 'data-testid': 'ask-fix-input' });
const fixErr = h('p', { class: 'warn-text small', hidden: true }, t('ask.fix.empty'));
const sendFix = () => {
const note = fixTa.value.trim();
if (!note) { fixErr.hidden = false; fixTa.focus(); return null; }
vote('down', note);
return _o5(out, { text: turn.q, mode: turn.mode, refine: { kind: 'fix', note, prev: turn.a }, bubble: holder, turn });
};
const _or = button(t('ask.fix.send'), sendFix, { kind: 'primary', small: true, icon: 'next', testid: 'ask-fix-send' });
fixTa.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); _or.click(); } });
_oq.append(h('p', { class: 'small xa-fix-label' }, t('ask.fix.label')), fixTa, fixErr, h('div', { class: 'btn-row' }, _or));
}
function _oy(images) {
const files = images.map((im) => im.file).filter(Boolean);
let _o2i = 0;
const _o2f = () => {
const input = document.querySelector('.module-host input[type=file]');
if (input && files.length && typeof DataTransfer !== 'undefined') {
try { const _ok = new DataTransfer(); files.forEach((f) => _ok.items.add(f)); input.files = _ok.files; input.dispatchEvent(new Event('change', { bubbles: true })); toast(t('ask.image'), 'ok'); } catch { }
return;
}
if (++_o2i < 40) setTimeout(_o2f, 100);
};
setTimeout(_o2f, 50);
}
let _o2b = () => {};
let _os = () => {};
function close() { if (current) { current.close(); current = null; } }
function _o21() { turns = []; ls.set(CONV_KEY, null); }
function open(prefill = '') {
if (current) { current.el.querySelector('textarea')?.focus(); return current; }
if (!AP || !KB) { loadAskLibs().then(() => open(prefill), (e) => toast(t('ask.err', { msg: (e && e.message) || '' }), 'warn')); return null; }
const _o25 = ls.get(CONV_KEY, null);
turns = _o25 && Array.isArray(_o25.turns) ? _o25.turns.slice(-AP.ASK_LIMITS.turns) : [];
const _o1j = modes();
const m0 = ls.get(MODE_KEY, 'qa');
mode = _o1j[m0] ? m0 : 'qa';
const ta = h('textarea', { class: 'xa-input', rows: 2, placeholder: t('ask.placeholder'), 'aria-label': t('ask.title'), id: 'ask-input', 'data-testid': 'ask-input' });
ta.value = prefill;
const out = h('div', { class: 'xa-out xa-log', role: 'log', 'aria-live': 'polite', 'data-testid': 'ask-out' });
for (const x of turns) { _o1g(out, x.q); _o1z(out, _o26(out, 'ai'), { turn: x }); }
const note = h('p', { class: 'warn-text small', hidden: true, 'data-testid': 'ask-note' });
const thumbs = h('div', { class: 'xa-thumbs' });
const images = [];
const file = h('input', { type: 'file', accept: 'image/*', multiple: true, class: 'sr-only', id: 'ask-file', 'data-testid': 'ask-file' });
const _o3 = (list) => { for (const f of list) if (/^image\//.test(f.type)) { images.push({ mime: f.type, name: f.name, file: f }); thumbs.appendChild(h('span', { class: 'badge badge-info' }, '🖼 ' + (f.name || 'ảnh'))); } };
file.addEventListener('change', () => { _o3([...(file.files || [])]); file.value = ''; });
ta.addEventListener('paste', (e) => { const _ot = [...((e.clipboardData && e.clipboardData.files) || [])]; if (_ot.length) { e.preventDefault(); _o3(_ot); } });
const chips = h('div', { class: 'xa-modes', role: 'group', 'aria-label': t('ask.modes.label'), 'data-testid': 'ask-modes' });
const _o1o = () => { for (const _o7 of chips.children) _o7.setAttribute('aria-pressed', String(_o7.dataset.mode === mode)); };
for (const [id, md] of Object.entries(_o1j)) {
chips.appendChild(h('button', { type: 'button', class: 'xa-mode', 'data-mode': id, 'data-testid': 'ask-mode-' + id, onclick: () => { mode = id; ls.set(MODE_KEY, id); _o1o(); ta.focus(); } }, md.label));
}
_o1o();
let _o22 = false;
const send = async () => {
if (_oa || _o22) return;
note.hidden = true;
let text = ta.value.trim();
if (!text && !images.length) { note.textContent = t('ask.empty'); note.hidden = false; ta.focus(); return; }
const _ob = AP.clip(text, AP.ASK_LIMITS.textMax);
if (_ob.cut) { text = _ob.text; note.textContent = t('ask.cut', { n: AP.ASK_LIMITS.textMax.toLocaleString('vi-VN') }); note.hidden = false; }
if (text) _o1g(out, text);
ta.value = '';
const _o11 = images.splice(0);
ui.clear(thumbs);
_o22 = true; _o2b(true);
let r, o, index;
try {
o = opts();
index = await buildIndex({ store, data: deps.data });
r = routeAsk({ text, images: _o11 }, { ...o, index });
} finally { _o22 = false; _o2b(false); }
await act(r, { text, images: _o11 }, out, o, index);
if (current) ta.focus();
};
ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); _o2a.click(); } });
const _o2a = button(t('ask.send'), send, { kind: 'primary', icon: 'next', testid: 'ask-send' });
_o2b = (on) => { _o2a.disabled = !!(on || _oa || _o22); };
_os = () => { try { ta.focus(); } catch { } };
const body = h('div', { class: 'xa', 'data-testid': 'ask' },
out,
chips,
ta, note, thumbs,
h('div', { class: 'xa-bar' }, button(t('ask.attach'), () => file.click(), { kind: 'ghost', small: true, icon: 'plus', testid: 'ask-attach' }), file, h('span', { class: 'xa-hint muted small' }, t('ask.hint')), _o2a),
aiNote('ask_ai'),
h('div', { class: 'xa-foot' },
button(t('ask.new'), () => { _o21(); ui.clear(out); note.hidden = true; ta.focus(); }, { kind: 'ghost', small: true, icon: 'plus', testid: 'ask-new' }),
typeof openFeedback === 'function' ? button(t('ask.feedback'), () => { close(); openFeedback(); }, { kind: 'secondary', small: true, icon: 'mail', testid: 'ask-feedback' }) : null,
typeof deps.helpLink === 'function' ? deps.helpLink(h) : null));
current = modal({ title: t('ask.modal'), body, wide: true, cls: 'xa-modal', onClose: () => { current = null; _o21(); _o2b = () => {}; _os = () => {}; } });
setTimeout(() => { if (current && !current.el.contains(document.activeElement)) _os(); }, 60);
return current;
}
function mountButton(host) {
if (!host || host.querySelector('#ask-open')) return null;
const _o1e = /Mac|iPhone|iPad/.test((typeof navigator !== 'undefined' && navigator.platform) || '');
const _o7 = h('button', { type: 'button', class: 'xa-btn', id: 'ask-open', 'data-testid': 'ask-open', 'aria-label': t('ask.title') + ' (' + (_o1e ? '⌘K' : 'Ctrl+K') + ')', title: t('ask.title') },
ui.icon('sparkle', 20), h('span', { class: 'xa-btn-label' }, t('ask.button')), h('kbd', { class: 'xa-kbd' }, _o1e ? '⌘K' : 'Ctrl K'));
_o7.addEventListener('click', () => open());
host.insertBefore(_o7, host.firstChild);
return _o7;
}
if (typeof setTimeout === 'function') setTimeout(() => { loadAskLibs().catch(() => { }); }, 4000);
return { open, close, handle, mountButton, route: (input, index) => routeAsk(input, { ...opts(), index }) };
}
export function isAskShortcut(e) { return !!e && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && String(e.key).toLowerCase() === 'k'; }
export default { routeAsk, parseShortcuts, searchIndex, makeIndex, resolveShortcut, parseAiRoute, titleFromUrl, createAsk, isAskShortcut, uid };

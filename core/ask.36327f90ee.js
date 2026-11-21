import { t } from './i18n.17f01a0b54.js';
import { fold, words, word, uid, ls } from './xkit.71d637c634.js';
import { parseRemember } from './memory.0e46c2fde6.js';
import { markAi, aiNote, PROVIDER_NAMES } from './ai_cost.e55e3f489e.js';
import { DESKTOP_ONLY_TEXT } from '../shared/device.js';
let AP = null, KB = null, libsP = null;
export function loadAskLibs() {
return libsP || (libsP = Promise.all([import('./ask_prompt.c46387c4fe.js'), import('./ask_kb.ea2c1792a1.js')]).then(([a, _o15]) => { AP = a; KB = _o15; return { AP, KB }; }, (e) => { libsP = null; throw e; }));
}
export const askLibs = () => (AP && KB ? { AP, KB } : null);
export const WORDS = {
'ask.placeholder': 'Hỏi cách dùng app hoặc gõ tên màn/việc cần mở…',
'ask.button': 'Hỏi app',
'ask.title': 'Hỏi app',
'ask.modal': 'Trợ lý trong app',
'ask.hint': 'Enter để gửi · ⌘K / Ctrl+K mở nhanh. Thử: "thêm khách", "làm sao sao lưu", "mở bảng giá", "ghi nhớ: …".',
'ask.app.only': 'Em là trợ lý trong app: em hướng dẫn cách dùng app và mở nhanh màn hình, việc trong app. Em chưa thấy chức năng nào khớp với "{text}".',
'ask.app.try': 'Anh/chị thử gõ tên việc cần làm, ví dụ "thêm khách", "tạo bảng giá", "sao lưu dữ liệu". Có thể anh/chị cần:',
'ask.app.search': 'Tìm "{text}" trong dữ liệu',
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
'ask.memo': 'Em đã nhớ {n} lượt trước, không hiện lại – anh/chị cứ hỏi tiếp.',
'ask.memo.clear': 'Quên hết',
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
'ask.kb.device': DESKTOP_ONLY_TEXT,
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
const _o2d = (f, list) => list.map(fold).find((_o15) => f === _o15 || f.startsWith(_o15 + ' ') || f.startsWith(_o15 + ':'));
const _o0 = /^(mo man|mo muc|mo|vao|xem|den|di toi|toi)\s+/;
const _op = (f, list) => { const _ow = f.replace(/[.!?:]+$/, '').replace(_o0, '').trim(); return list.map(fold).some((_o15) => _ow === _o15); };
const _oe = (f, list) => list.map(fold).find((_o15) => new RegExp('(^|[^a-z0-9])' + _o15.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)').test(f));
export function parseShortcuts(_o1d) {
return (_o1d || []).map((l, i) => {
const [kws, path, params] = String(l).split('|').map((s) => (s || '').trim());
if (!kws || !path) return null;
const map = {};
for (const p of (params || '').split(',').map((s) => s.trim()).filter(Boolean)) { const [_o15, v] = p.split('='); if (_o15 && v) map[_o15.trim()] = v.trim(); }
return { id: 'sc' + (i + 1), kws: kws.split(';').map((s) => s.trim()).filter(Boolean), path: path.replace(/^#?\/?/, ''), params: map };
}).filter(Boolean);
}
export function makeIndex(items) {
return (items || []).filter((x) => x && x.id && x.name).map((x) => ({ ...x, _f: fold([x.name, x.sub, ...(x.keys || [])].filter(Boolean).join(' ')), _n: fold(x.name), _p: String(x.phone || '').replace(/\D/g, '') }));
}
export function stripWords(q, strip = []) {
let f = fold(q);
for (const _o2o of [...strip].map(fold).sort((a, _o8) => _o8.length - a.length)) f = f.replace(new RegExp('(^|\\s)' + _o2o.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=\\s|$)', 'g'), ' ');
return f.replace(/\s+/g, ' ').trim();
}
export function searchIndex(query, index, { strip = [], kinds, limit = 8 } = {}) {
const raw = String(query || '');
const _ok = raw.replace(/\D/g, '');
const q = stripWords(raw, strip);
const _o2g = q.split(' ').filter((x) => x.length > 0);
const out = [];
for (const _o14 of index || []) {
if (kinds && !kinds.includes(_o14.kind)) continue;
let s = 0;
if (_ok.length >= 4 && _o14._p && _o14._p.includes(_ok)) s = 5;
else if (q && _o14._n === q) s = 4;
else if (q && q.length >= 2 && _o14._n.includes(q)) s = 3;
else if (_o2g.length && _o2g.every((tk) => _o14._f.includes(tk))) s = 2;
else if (_o2g.length > 1) { const _o12 = _o2g.filter((tk) => tk.length > 1 && _o14._f.includes(tk)).length; if (_o12 && _o12 >= Math.ceil(_o2g.length / 2)) s = 1; }
if (s) out.push({ item: _o14, score: s });
}
return out.sort((a, _o8) => _o8.score - a.score || a.item.name.localeCompare(_o8.item.name, 'vi')).slice(0, limit);
}
export function resolveShortcut(_o27, rest, index, { strip = [] } = {}) {
const matched = {}; const params = {};
const f = fold(rest);
for (const [param, kind] of Object.entries(_o27.params || {})) {
let pool = (index || []).filter((x) => x.kind === kind);
if (kind === 'variant') {
const parent = Object.values(matched)[0];
if (parent) pool = pool.filter((x) => x.parent === parent.id);
const _o12 = pool.find((x) => new RegExp('(^|\\s)' + x._n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|$)').test(f));
if (_o12) { matched[kind] = _o12; params[param] = _o12.value || _o12.name; }
continue;
}
const r = searchIndex(rest, pool, { strip })[0];
if (r && r.score >= 2) { matched[kind] = r.item; params[param] = r.item.id; continue; }
const q = ' ' + stripWords(rest, strip) + ' ';
let _o9 = null, bestN = 0;
for (const _o14 of pool) {
const n = _o14._n.split(' ').filter((_o2o) => _o2o.length >= 3 && q.includes(' ' + _o2o + ' ')).length;
if (n > bestN) { _o9 = _o14; bestN = n; }
}
if (_o9) { matched[kind] = _o9; params[param] = _o9.id; }
}
const qs = new URLSearchParams(params).toString();
return { path: _o27.path + (qs ? (_o27.path.includes('?') ? '&' : '?') + qs : ''), params, matched };
}
export function kbFirst(text, f, { kb, kbStop = [], kw = CORE_KW, shortcuts = [], strip = [], index = [] } = {}) {
const _o2n = f.match(_o0);
if (_o2n) {
const rest = f.slice(_o2n[0].length).replace(/[.!?:]+$/, '').trim();
const _o12 = KB.searchKb(rest, kb, { stop: kbStop, limit: 2 });
const _oo = _o12[0] && _o12[0].score === 100 && _o12[0].entry._k.includes(rest.replace(/[^a-z0-9]+/g, ' ').trim());
if (_oo && (!_o12[1] || _o12[1].score < 100) && _o12[0].entry.avail === 'ok') return { intent: 'open', path: _o12[0].entry.path, label: _o12[0].entry.title, match: 'exact', kb: _o12[0].entry.id };
return null;
}
if (_o2d(f, kw.search)) return null;
if (f.split(' ').length <= 6) { const _of = searchIndex(text, index, { strip }); if (_of.length && _of[0].score >= 4) return null; }
const r = KB.kbRoute(text, kb, { stop: kbStop });
if (!r) return null;
for (const _o27 of shortcuts) {
const _o1b = _o2d(f, _o27.kws);
if (!_o1b) continue;
const rest = f.replace(_o1b, ' ').replace(/[.!?:]+$/, '').trim();
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
const _o1j = parseRemember(text);
if (_o1j) return { intent: 'remember', memory: _o1j };
const _o2l = _o2d(f, kw.upgrade); const _o2k = _o2l || _oe(f, kw.upgrade);
if (_o2k) return { intent: 'upgrade', text: text.replace(/^\s*(nâng cấp|nang cap)\s*[:：-]?\s*/i, '') || text, match: _o2l ? 'exact' : 'fuzzy' };
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
const _o15 = _oe(f, kws.split(';'));
if (_o15 && f.split(' ').length <= 6) return { intent: 'open', path, match: _op(f, kws.split(';')) ? 'exact' : 'fuzzy' };
}
for (const _o27 of shortcuts) {
const _o1b = _o2d(f, _o27.kws); const _o15 = _o1b || _oe(f, _o27.kws);
if (_o15) {
const rest = f.replace(_o15, ' ').trim();
const r = resolveShortcut(_o27, rest, index, { strip });
return { intent: 'shortcut', id: _o27.id, path: r.path, params: r.params, matched: r.matched, rest, match: _o1b ? 'exact' : 'fuzzy' };
}
}
const _o2c = _o2d(f, kw.search);
if (_o2c) {
const query = f.slice(_o2c.length).replace(/^[:\s]+/, '');
return { intent: 'search', query, results: searchIndex(query, index, { strip }) };
}
if (f.split(' ').length <= 6) {
const _o20 = searchIndex(text, index, { strip });
if (_o20.length && _o20[0].score >= 3) return { intent: 'search', query: text, results: _o20 };
}
return { intent: 'assistant', text };
}
export function parseAiRoute(answer) {
const _o1f = String(answer || '').match(/^\s*@route\s*:\s*(upgrade|search|link|remember|shortcut|open)\b\s*(.*)$/im);
if (!_o1f) return null;
return { intent: _o1f[1].toLowerCase(), arg: _o1f[2].trim() };
}
export function stripAiRoute(answer) { return String(answer || '').replace(/^\s*@route\s*:.*$/im, '').trim(); }
export function titleFromUrl(url) {
try {
const _o2j = new URL(url);
const seg = _o2j.pathname.split('/').filter(Boolean).pop() || '';
const s = decodeURIComponent(seg).replace(/\.[a-z0-9]{2,5}$/i, '').replace(/[-_]+/g, ' ').replace(/\b\d{5,}\b/g, '').trim();
return (s ? s.charAt(0).toUpperCase() + s.slice(1) : _o2j.hostname).slice(0, 120);
} catch { return String(url).slice(0, 120); }
}
export async function buildIndex({ store, data }) {
const items = [];
const _o1q = (kind, id) => (word('ask.path.' + kind) || '').replace('{id}', encodeURIComponent(id));
try {
const _o1m = await store.list('objects');
for (const o of _o1m) items.push({ kind: o.kind || 'customer', id: o.id, name: o.name || '', phone: o.phone || o.zalo || '', sub: [o.project, o.status].filter(Boolean).join(' · '), path: _o1q(o.kind || 'customer', o.id) });
} catch { }
for (const p of (data && data.projects) || []) {
items.push({ kind: 'project', id: p.id, name: p.name || p.id, sub: [p.dev, p.area, p.loc].filter(Boolean).join(' · '), keys: [p.id, p.area], path: _o1q('project', p.id) });
for (const _o2i of p.types || []) if (_o2i && _o2i.n) items.push({ kind: 'variant', id: p.id + ':' + _o2i.n, name: String(_o2i.n), value: String(_o2i.n), parent: p.id, sub: p.name, path: _o1q('project', p.id) });
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
let mode = 'app';
const _o19 = () => { try { return (deps.getKb && deps.getKb()) || null; } catch { return null; } };
const _oj = (path) => { try { return !!(deps.deviceBlocked && deps.deviceBlocked(path)); } catch { return false; } };
const kbStop = () => words('ask.kb.stop');
const opts = () => ({
shortcuts: parseShortcuts(words('ask.shortcuts')).filter((_o27) => _o4(_o27.path)), strip: words('ask.strip'),
imagePath: [word('ask.image.path').replace(/^#?\/?/, '')].filter(_o4)[0] || '', linkPath: [word('ask.link.path').replace(/^#?\/?/, '')].filter(_o4)[0] || '',
kb: mode === 'qa' || mode === 'app' ? _o19() : null, kbStop: kbStop()
});
const modes = () => AP.parseModes(words('ask.modes'));
const features = () => {
const kb = _o19();
if (kb) return KB.kbFeatures(kb, (s) => t('screen.' + s)).ok;
try { return (deps.getFeatures && deps.getFeatures()) || []; } catch { return []; }
};
const _o24 = () => ls.set(CONV_KEY, turns.length ? { turns, mode } : null);
const _or = (path) => { const f = AP.findFeature(features(), path); return f ? f.title : String(path || '').split('?')[0]; };
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
const _o1i = (out, text) => _o26(out, 'me', h('span', { class: 'sr-only' }, t('ask.you') + ': '), text);
function _oz(path, label) {
if (_oj(path)) { toast(t('ask.kb.device'), 'warn', 6000)?.setAttribute?.('data-testid', 'ask-device'); return; }
const back = typeof location !== 'undefined' ? location.hash : '';
close(); nav(path);
const el = toast(t('ask.opened', { label: label || _or(path) }), 'info', 7000);
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
h('div', { class: 'btn-row' }, markAi(button(t('ask.ask_ai'), () => { card.remove(); return _o6(out, { text: input.text, noRoute: true }); }, { kind: 'secondary', small: true, testid: 'ask-fallback-ai' }), 'ask_ai')));
_ou();
}, { kind: 'ghost', small: true, testid: 'ask-confirm-no' })));
return card;
}
const _o2q = (r) => {
if (r.intent === 'open' || r.intent === 'shortcut') return t('ask.what.open', { label: r.label || _or(r.path) });
if (r.intent === 'remember') return t('ask.what.remember', { text: (r.memory && r.memory.text) || r.arg });
if (r.intent === 'upgrade') return t('ask.what.upgrade', { text: AP.clip(r.text || r.arg || '', 120).text });
if (r.intent === 'search') return t('ask.what.search', { text: r.query || r.arg });
return r.intent;
};
async function act(r, input, out, o, index, { confirmed = false } = {}) {
if (!confirmed && AP.needsConfirm(r)) { _od(out, _o2q(r), () => act(r, input, out, o, index, { confirmed: true }), input); return r; }
switch (r.intent) {
case 'remember': {
const _o20 = await memory.add({ ...r.memory, source: 'ask' });
if (_o20.private) { _o26(out, 'sys', h('p', { class: 'warn-text' }, t('mem.private'))); return r; }
const box = _o26(out, 'sys', h('p', { class: 'ok-text', 'data-testid': 'ask-remembered' }, _o20.dup ? t('mem.dup') : t('ask.remembered', { text: r.memory.text })));
box.appendChild(h('div', { class: 'btn-row' },
!_o20.dup && _o20.item && memory.remove ? button(t('ask.undo'), async () => { await memory.remove(_o20.item.id); ui.mountTo(box, h('p', { class: 'muted' }, t('ask.undo.done'))); }, { kind: 'ghost', small: true, testid: 'ask-undo' }) : null,
button(t('mem.title'), () => _oz('settings/memory', t('mem.title')), { kind: 'ghost', small: true })));
return r;
}
case 'upgrade': {
const text = [r.text || input.text, r.url && !String(r.text || '').includes(r.url) ? r.url : ''].filter(Boolean).join('\n');
close();
if (typeof openFeedback === 'function') { openFeedback({ kind: 'add', text }); toast(t('ask.upgrade'), 'info', 4000); }
else nav('settings/feedback');
return r;
}
case 'kb': _o16(out, r, input); return r;
case 'open': case 'shortcut':
if (_oj(r.path)) { _o26(out, 'sys', h('p', { class: 'warn-text', 'data-testid': 'ask-kb-device' }, t('ask.kb.device'))); return r; }
_oz(r.path, r.label); return r;
case 'link': {
if (r.path && _oj(r.path)) { _o26(out, 'sys', h('p', { class: 'warn-text', 'data-testid': 'ask-kb-device' }, t('ask.kb.device'))); return r; }
const _o23 = await store.put('ideas', { title: titleFromUrl(r.url), url: r.url, summary: r.note || '', source: 'ask', status: 'new' });
toast(t('ask.link'), 'ok');
if (r.path) _oz(r.path + (r.path.includes('?') ? '&' : '?') + 'id=' + encodeURIComponent(_o23.id));
else _o26(out, 'sys', h('p', { class: 'ok-text' }, t('ask.link')));
return r;
}
case 'image': {
if (!r.path) { _o26(out, 'sys', h('p', { class: 'warn-text' }, t('ask.image.none'))); return r; }
_oz(r.path);
_o10(r.images);
return r;
}
case 'search': {
const results = r.results || searchIndex(r.query, index, { strip: o.strip });
const _oq = markAi(button(results.length ? t('ask.not_search') : t('ask.ask_ai'), () => _o6(out, { text: input.text || r.query, noRoute: true }), { kind: results.length ? 'ghost' : 'primary', small: true, testid: 'ask-fallback-ai' }), 'ask_ai');
if (!results.length) { _o26(out, 'sys', h('p', { class: 'muted' }, t('ask.none')), _oq); return r; }
_o26(out, 'sys', h('h4', { class: 'section-title' }, t('ask.results', { n: results.length })),
ui.list(results, ({ item }) => h('div', { class: 'row-main', 'data-testid': 'ask-hit' },
h('div', { class: 'row-text' }, h('strong', null, item.name), h('span', { class: 'muted small' }, [word('ask.kind.' + item.kind) || item.kind, item.sub].filter(Boolean).join(' · '))),
item.path ? button(t('ask.open'), () => _oz(item.path, item.name), { kind: 'secondary', small: true }) : null), { onClick: ({ item }) => item.path && _oz(item.path, item.name) }),
h('div', { class: 'btn-row' }, _oq));
return r;
}
case 'assistant': _o5(out, r.text || input.text || '', input, o, index); return r;
default: return r;
}
}
const _o1o = () => { const e = KB.kbGet(_o19(), 'packs'); return (e && e.title) || t('ask.kb.packs'); };
function _ox(e) {
if (!e) return;
if (e.avail === 'ok' || e.avail === 'building' || e.avail === 'error') { _oz(e.path, e.title); return; }
if (e.avail === 'pack') { _oz(KB.PACKS_PATH, _o1o()); return; }
if (e.avail === 'device') { toast(t('ask.kb.device'), 'warn', 6000); return; }
toast(t('ask.kb.perm'), 'warn', 5000);
}
const _oy = (e) => (e.avail === 'pack' ? t('ask.kb.packs') : t('ask.kb.open', { label: e.title }));
const _o1y = (ref) => { const kb = _o19(); return KB.kbGet(kb, ref) || null; };
function moBody(text) {
const kb = _o19();
const _o1d = String(text || '').split(/\n/);
const out = [];
for (const _o1c of _o1d) {
if (!_o1c.trim()) continue;
const { parts } = kb ? KB.parseMo(_o1c, kb) : { parts: [_o1c.replace(KB.MO_RE, '')] };
out.push(h('p', null, ...parts.map((p) => (typeof p === 'string' ? p : (p.entry.avail === 'device' ? h('strong', { class: 'xa-mo-off' }, p.entry.title) : button(p.entry.avail === 'pack' ? p.entry.title + ' · ' + t('ask.kb.packs') : p.entry.title, () => _ox(p.entry), { kind: 'ghost', small: true, icon: 'next', testid: 'ask-mo', cls: 'xa-mo' }))))));
}
return out;
}
const _o1a = (e) => {
if (e.avail === 'pack') return h('p', { class: 'warn-text small', 'data-testid': 'ask-kb-pack' }, t('ask.kb.pack', { pack: e.packTitle || '' }));
if (e.avail === 'perm') return h('p', { class: 'warn-text small', 'data-testid': 'ask-kb-perm' }, t('ask.kb.perm'));
if (e.avail === 'device') return h('p', { class: 'warn-text', 'data-testid': 'ask-kb-device' }, t('ask.kb.device'));
if (e.avail === 'building' || e.avail === 'error') return h('p', { class: 'muted small' }, t('ask.kb.building'));
return null;
};
function _on(box, e, r, input, out) {
const _o23 = (_o15, v) => (v ? h('div', { class: 'xa-kb-row' }, h('dt', null, t(_o15)), h('dd', null, v)) : null);
const steps = r.howto && e.steps && e.steps.length ? h('div', { class: 'xa-kb-steps', 'data-testid': 'ask-kb-steps' },
h('p', { class: 'small xa-kb-steps-t' }, t('ask.kb.steps')),
h('ol', null, e.steps.map((s) => { const _o2f = s.ref ? _o1y(s.ref) : null; return h('li', null, h('span', null, s.text), _o2f ? button(t('ask.kb.go'), () => _ox(_o2f), { kind: 'ghost', small: true, testid: 'ask-step-go' }) : null); }))) : null;
const _o1n = h('div', { class: 'xa-kb-alts', hidden: true, 'data-testid': 'ask-kb-alts' });
ui.mountTo(box,
h('span', { class: 'sr-only' }, t('ask.me') + ': '),
h('h4', { class: 'xa-kb-title', 'data-testid': 'ask-kb-title' }, e.title),
h('dl', { class: 'xa-kb-dl' }, _o23('ask.kb.where', e.where), _o23('ask.kb.does', e.does), _o23('ask.kb.in', e.input), _o23('ask.kb.out', e.output), _o23('ask.kb.cond', e.cond)),
_o1a(e), steps,
h('div', { class: 'xa-acts', 'data-testid': 'ask-kb-actions' },
e.avail === 'perm' || e.avail === 'device' ? null : button(_oy(e), () => _ox(e), { kind: 'primary', small: true, icon: 'next', testid: e.avail === 'pack' ? 'ask-kb-packs' : 'ask-kb-open' }),
button(t('ask.kb.more'), () => _o6(out, { text: t('ask.kb.more.q', { label: e.title }), pin: e }), { kind: 'secondary', small: true, icon: 'sparkle', testid: 'ask-kb-more' }),
button(t('ask.kb.other'), () => {
_o1n.hidden = !_o1n.hidden;
if (_o1n.hidden) return;
const alts = (r.hits || []).filter((x) => x.entry !== e).slice(0, KB.KB_LIMITS.alt);
ui.mountTo(_o1n,
h('p', { class: 'small' }, alts.length ? t('ask.kb.alts') : t('ask.kb.alts.none')),
h('div', { class: 'xa-chips' }, ...alts.map((x) => button(x.entry.title, () => _on(box, x.entry, { ...r, hits: r.hits }, input, out), { kind: 'secondary', small: true, testid: 'ask-kb-alt' })),
button(t('ask.ask_ai'), () => _o6(out, { text: input.text, noKb: true }), { kind: 'ghost', small: true, testid: 'ask-fallback-ai' })));
}, { kind: 'ghost', small: true, testid: 'ask-kb-other' })),
_o1n);
box.dataset.kb = e.id;
_o2b(out, box);
}
function _o2b(out, el) {
try { if (out && el) out.scrollTop += el.getBoundingClientRect().top - out.getBoundingClientRect().top - 8; } catch { }
}
function _o16(out, r, input) {
const box = _o26(out, 'ai');
box.classList.add('xa-kb');
box.setAttribute('data-testid', 'ask-kb');
if (r.ambiguous) {
const top = r.hits.filter((x) => x.score > r.hits[0].score - 5).slice(0, 4);
ui.mountTo(box, h('p', null, t('ask.kb.pick')),
h('div', { class: 'xa-chips', 'data-testid': 'ask-kb-pick' }, ...top.map((x) => button(x.entry.title, () => _on(box, x.entry, r, input, out), { kind: 'secondary', small: true, testid: 'ask-kb-chip' }))));
_o2b(out, box);
} else _on(box, r.entry, r, input, out);
const e = r.entry;
turns = AP.pushTurn(turns, { q: input.text || '', a: e.title + ' [[mo:' + e.id + ']] – ' + e.where + '. ' + e.does, mode });
_o24();
return box;
}
function _o5(out, text, input, o, index) {
const near = _o19() ? _o18(text, { min: 1, limit: 4, skipDevice: true }) : [];
const box = _o26(out, 'ai', h('p', null, t('ask.app.only', { text: AP.clip(text, 80).text })));
box.setAttribute('data-testid', 'ask-app-only');
box.appendChild(h('p', { class: 'muted small' }, t('ask.app.try')));
box.appendChild(h('div', { class: 'xa-chips', 'data-testid': 'ask-app-near' },
...near.map((e) => button(e.avail === 'pack' ? e.title + ' · ' + t('ask.kb.packs') : e.title, () => _ox(e), { kind: 'secondary', small: true, icon: 'next', testid: 'ask-kb-hint-go' })),
text ? button(t('ask.app.search', { text: AP.clip(text, 40).text }), () => act({ intent: 'search', query: text, results: searchIndex(text, index, { strip: o.strip }) }, input, out, o, index), { kind: 'ghost', small: true, testid: 'ask-app-search' }) : null));
turns = AP.pushTurn(turns, { q: text, a: t('ask.app.only', { text }), mode });
_o24();
return box;
}
function _oc(out, text, input, o, index) {
const box = _o26(out, 'ai', h('p', null, t('ask.vague', { text })));
box.setAttribute('data-testid', 'ask-clarify-msg');
const _o1r = (fn) => async () => { box.querySelectorAll('button').forEach((_o8) => { _o8.disabled = true; }); await fn(); };
box.appendChild(h('div', { class: 'xa-chips', 'data-testid': 'ask-clarify' },
button(t('ask.vague.search', { text }), _o1r(() => act({ intent: 'search', query: text, results: searchIndex(text, index, { strip: o.strip }) }, input, out, o, index)), { kind: 'secondary', small: true, testid: 'ask-chip' }),
button(t('ask.vague.ask', { text }), _o1r(() => _o6(out, { text })), { kind: 'secondary', small: true, testid: 'ask-chip' }),
button(t('ask.vague.app', { text }), _o1r(() => _o6(out, { text, mode: 'app' })), { kind: 'secondary', small: true, testid: 'ask-chip' })));
}
function _o18(text, { pin, min = 30, limit = KB.KB_LIMITS.rag, skipDevice = false } = {}) {
const kb = _o19();
if (!kb) return [];
const list = KB.searchKb(text, kb, { stop: kbStop(), min, skipDevice }).map((x) => x.entry).filter((e) => e !== pin);
return [...(pin ? [pin] : []), ...list].slice(0, limit);
}
async function _o1v({ text, mode: _o1f, refine, history, noRoute, pin, noKb }) {
const f = features();
const kb = _o19();
const r = (deps.getRoute && deps.getRoute()) || null;
let screen = '';
if (r && r.screen) {
const _o1k = r.module ? AP.findFeature(f, r.screen + '/' + r.module) : null;
screen = [t('screen.' + r.screen), _o1k && _o1k.title].filter(Boolean).join(' › ');
}
let customer = '';
try {
const id = r && r.query && r.query.get && r.query.get('open');
if (id && store && store.get) customer = AP.customerLine(await store.get('objects', id));
} catch { }
let persona = '';
try { persona = deps.persona ? deps.persona.systemPrompt('owner', { withMemory: false }) : ''; } catch { }
const _o1e = ls.get(VOTE_KEY, []);
const built = AP.buildAskPrompt({
text, mode: _o1f, modes: modes(), role: word('ask.ai.role'), rules: words('ask.ai.rules'), persona,
memory: memory && memory.list ? memory.list() : [], memLabel: (_o15) => t('mem.kind.' + _o15),
features: f, screen, customer, examples: AP.pickExamples(_o1e, 3, _o1f), avoid: AP.avoidList(_o1e),
history, refine, actions: !noRoute,
mo: !!kb, kb: noKb ? (pin ? [KB.kbLine(pin)] : []) : _o18(text, { pin }).map(KB.kbLine), offFeatures: kb ? KB.kbFeatures(kb, (s) => t('screen.' + s)).off : []
});
return { ...built, customer: !!customer };
}
function _o17(text, pin) {
const list = _o18(text, { pin, min: KB.KB_LIMITS.medium, limit: 3, skipDevice: true });
if (!list.length) return null;
return h('div', { class: 'xa-kb-hint', 'data-testid': 'ask-kb-hint' }, h('p', { class: 'muted small' }, t('ask.kb.hint')),
h('div', { class: 'xa-chips' }, ...list.map((e) => button(e.avail === 'pack' ? e.title + ' · ' + t('ask.kb.packs') : e.title, () => _ox(e), { kind: 'secondary', small: true, icon: 'next', testid: 'ask-kb-hint-go' }))));
}
async function _o6(out, o) {
if (_oa) return null;
const _o1f = 'app';
const text = String(o.text || '').trim();
if (!text) return null;
const _o2m = o.provider === 'handoff_claude';
if (!_o2m && ai.connected && !ai.connected()) { _o1l(out, o); return null; }
_oa = true; _o2a(true);
const limit = Number(deps.aiTimeoutMs) > 0 ? Number(deps.aiTimeoutMs) : AP.ASK_LIMITS.aiTimeoutMs;
const _o28 = Math.round(limit / 1000);
const _o2p = h('p', { class: 'muted', 'data-testid': 'ask-thinking' }, ui.spinner(), ' ', t('ask.thinking'), _o2m ? '' : ' ' + t('ask.wait.max', { s: _o28 }));
const _o11 = o.refine || _o2m ? null : _o17(text, o.pin);
let holder = o.bubble;
if (holder) { holder.classList.add('is-busy'); holder.appendChild(_o2p); } else holder = _o26(out, 'ai', _o2p);
if (_o11) holder.appendChild(_o11);
const history = turns.filter((x) => x !== o.turn);
let _o20, built, timer;
try {
built = await _o1v({ text, mode: _o1f, refine: o.refine, history, noRoute: o.noRoute, pin: o.pin, noKb: o.noKb });
let _o1u = false;
if (!_o2m && typeof ai.preflight === 'function') { const _o1t = await ai.preflight('assistant', { provider: o.provider, feature: 'ask_ai', prompt: built.prompt }); _o1u = !['handoff_claude', 'handoff_gemini'].includes(_o1t); }
const run = Promise.resolve(ai.run('assistant', { prompt: built.prompt, provider: o.provider, raw: true, temperature: 0.3, feature: 'ask_ai', confirmed: _o1u }));
if (_o2m) _o20 = await run;
else {
run.catch(() => { });
_o20 = await Promise.race([run, new Promise((_, rej) => { timer = setTimeout(() => rej(Object.assign(new Error(t('ask.timeout', { s: _o28 })), { code: 'TIMEOUT' })), limit); })]);
}
if (!_o2m && !String((_o20 && _o20.text) || '').trim()) throw new Error(t('ask.err.empty'));
} catch (e) {
_o2p.remove(); holder.classList.remove('is-busy');
if (e && e.code === 'AI_CANCELLED') { const _ob = h('p', { class: 'muted', 'data-testid': 'ask-cancelled' }, e.message || t('ask.empty.answer')); if (o.bubble) holder.appendChild(_ob); else ui.mountTo(holder, _ob); return null; }
const _ol = () => { err.remove(); if (_o11) _o11.remove(); if (!o.bubble) holder.remove(); };
const msg = e && e.code === 'TIMEOUT' ? e.message : t('ask.err', { msg: (e && (e.userMessage || e.message)) || '' });
const err = h('div', { class: 'xa-err', 'data-testid': 'ask-error' }, h('p', { class: 'warn-text' }, msg),
h('div', { class: 'btn-row' },
button(t('ask.retry'), () => { _ol(); return _o6(out, o); }, { kind: 'primary', small: true, icon: 'next', testid: 'ask-retry' }),
button(t('ask.claude'), () => { _ol(); return _o6(out, { ...o, provider: 'handoff_claude' }); }, { kind: 'ghost', small: true, icon: 'sparkle', testid: 'ask-claude' })));
if (o.bubble) holder.appendChild(err); else ui.mountTo(holder, err, _o11);
return null;
} finally { clearTimeout(timer); _oa = false; _o2a(false); }
_o2p.remove(); holder.classList.remove('is-busy');
if (_o11) _o11.remove();
if (_o2m && !String((_o20 && _o20.text) || '').trim()) { if (!o.bubble) holder.remove(); return null; }
const _o1p = AP.parseAnswer(_o20 && _o20.text, { features: features() });
const notes = [];
if (built.cut) notes.push(h('p', { class: 'muted small', 'data-testid': 'ask-cut' }, t('ask.cut', { n: AP.ASK_LIMITS.textMax.toLocaleString('vi-VN') })));
if (built.customer) notes.push(h('p', { class: 'muted small', 'data-testid': 'ask-ctx' }, t('ask.ctx.customer')));
if (_o1p.clarify && !_o1p.answer) {
turns = AP.pushTurn(turns.filter((x) => x !== o.turn), { q: text, a: _o1p.clarify.question, mode: _o1f }); _o24();
ui.mountTo(holder, h('p', null, _o1p.clarify.question), ...notes,
_o1p.clarify.options.length ? h('div', { class: 'xa-chips', 'data-testid': 'ask-clarify' }, _o1p.clarify.options.map((op) =>
button(op, () => { holder.querySelectorAll('.xa-chips button').forEach((_o8) => { _o8.disabled = true; }); _o1i(out, op); return _o6(out, { text: op, mode: _o1f }); }, { kind: 'secondary', small: true, testid: 'ask-chip' }))) : null);
holder.setAttribute('data-testid', 'ask-clarify-msg');
return _o1p;
}
const answer = _o1p.answer || (_o1p.clarify ? _o1p.clarify.question : '');
const turn = { q: text, a: answer, mode: _o1f };
const _o7 = o.turn ? turns.indexOf(o.turn) : -1;
if (_o7 >= 0) turns[_o7] = turn; else turns = AP.pushTurn(turns, turn);
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
function _o1l(out, o) {
const box = _o26(out, 'ai', h('p', { class: 'warn-text' }, t('ask.noai')));
box.setAttribute('data-testid', 'ask-noai');
box.appendChild(h('div', { class: 'btn-row' },
button(t('ask.claude'), () => { box.remove(); return _o6(out, { ...o, provider: 'handoff_claude' }); }, { kind: 'primary', small: true, icon: 'sparkle', testid: 'ask-claude' }),
button(t('ask.set_ai'), () => _oz('settings/ai', t('ask.set_ai')), { kind: 'ghost', small: true })));
}
function _o1z(out, holder, { turn, provider, notes = [], redo }) {
holder.setAttribute('data-testid', 'ask-answer');
const _os = h('div', { class: 'xa-fix', hidden: true, 'data-testid': 'ask-fix' });
const vote = (v, note) => ls.set(VOTE_KEY, AP.recordVote(ls.get(VOTE_KEY, []), { q: turn.q, a: turn.a, vote: v, note, mode: turn.mode }));
const _o1x = (kind, label, testid) => button(label, () => _o6(out, { text: turn.q, mode: turn.mode, refine: { kind, prev: turn.a }, bubble: holder, turn }), { kind: 'ghost', small: true, testid });
const _og = word('ask.delegate.module');
const _oh = !!(deps.hasModule && _og && deps.hasModule(_og) && AP.isContentJob(turn.q, turn.mode, words('ask.delegate.kw')));
const _o1w = provider ? (t('ai.provider.' + provider) !== 'ai.provider.' + provider ? t('ai.provider.' + provider) : (PROVIDER_NAMES[provider] || provider)) : '';
const kb = _o19();
const refs = kb ? KB.parseMo(turn.a, kb).refs : [];
const _o1s = kb ? KB.moPlain(turn.a, kb) : String(turn.a || '').replace(KB.MO_RE, '').trim();
const _o1h = refs.find((e) => e.avail !== 'device') || null;
const _oi = refs.some((e) => e.avail === 'device');
ui.mountTo(holder,
h('span', { class: 'sr-only' }, t('ask.me') + ': '),
redo ? h('p', { class: 'muted small', 'data-testid': 'ask-redo' }, t('ask.redo.' + redo)) : null,
h('div', { class: 'xa-body prose' }, ...moBody(turn.a)),
...notes,
_oi ? h('p', { class: 'warn-text small', 'data-testid': 'ask-kb-device' }, t('ask.kb.device')) : null,
_o1w ? h('p', { class: 'muted small xa-prov' }, _o1w) : null,
h('div', { class: 'xa-acts', 'data-testid': 'ask-actions' },
_o1h
? button(t('ask.agree.open', { label: _o1h.avail === 'pack' ? _o1o() : _o1h.title }), () => { vote('up'); _ox(_o1h); }, { kind: 'primary', small: true, icon: 'check', testid: 'ask-like' })
: button(t('ask.like'), async () => { await ui.copy(_o1s, { silent: true }); vote('up'); toast(t('ask.like.done'), 'ok'); }, { kind: 'primary', small: true, testid: 'ask-like' }),
_o1h ? button(t('ask.copy'), async () => { await ui.copy(_o1s, { silent: true }); toast(t('ask.copy.done'), 'ok'); }, { kind: 'ghost', small: true, testid: 'ask-copy' }) : null,
_o1x('shorter', t('ask.shorter'), 'ask-shorter'),
_o1x('longer', t('ask.longer'), 'ask-longer'),
button(t('ask.dislike'), () => { _os.hidden = !_os.hidden; if (!_os.hidden) fixTa.focus(); }, { kind: 'ghost', small: true, testid: 'ask-dislike' }),
button(t('ask.followup'), () => _ou(), { kind: 'ghost', small: true, testid: 'ask-followup' }),
provider !== 'handoff_claude' ? button(t('ask.claude'), () => _o6(out, { text: turn.q, mode: turn.mode, provider: 'handoff_claude', bubble: holder, turn }), { kind: 'ghost', small: true, icon: 'sparkle', testid: 'ask-claude' }) : null,
_oh ? button(t('ask.delegate'), () => {
const p = word('ask.delegate.path').replace(/^#?\/?/, '');
close(); nav(p + (p.includes('?') ? '&' : '?') + 'ask=' + encodeURIComponent(AP.clip(turn.q, 1500).text));
toast(t('ask.delegate.done'), 'info', 5000);
}, { kind: 'secondary', small: true, icon: 'user', testid: 'ask-delegate' }) : null),
_os);
const fixTa = h('textarea', { class: 'xa-input xa-fix-input', rows: 2, placeholder: t('ask.fix.ph'), 'aria-label': t('ask.fix.label'), 'data-testid': 'ask-fix-input' });
const fixErr = h('p', { class: 'warn-text small', hidden: true }, t('ask.fix.empty'));
const sendFix = () => {
const note = fixTa.value.trim();
if (!note) { fixErr.hidden = false; fixTa.focus(); return null; }
vote('down', note);
return _o6(out, { text: turn.q, mode: turn.mode, refine: { kind: 'fix', note, prev: turn.a }, bubble: holder, turn });
};
const _ot = button(t('ask.fix.send'), sendFix, { kind: 'primary', small: true, icon: 'next', testid: 'ask-fix-send' });
fixTa.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); _ot.click(); } });
_os.append(h('p', { class: 'small xa-fix-label' }, t('ask.fix.label')), fixTa, fixErr, h('div', { class: 'btn-row' }, _ot));
}
function _o10(images) {
const files = images.map((im) => im.file).filter(Boolean);
let _o2h = 0;
const _o2e = () => {
const input = document.querySelector('.module-host input[type=file]');
if (input && files.length && typeof DataTransfer !== 'undefined') {
try { const _om = new DataTransfer(); files.forEach((f) => _om.items.add(f)); input.files = _om.files; input.dispatchEvent(new Event('change', { bubbles: true })); toast(t('ask.image'), 'ok'); } catch { }
return;
}
if (++_o2h < 40) setTimeout(_o2e, 100);
};
setTimeout(_o2e, 50);
}
let _o2a = () => {};
let _ou = () => {};
function close() { if (current) { current.close(); current = null; } }
function _o21() { turns = []; ls.set(CONV_KEY, null); }
function open(prefill = '') {
if (current) { current.el.querySelector('textarea')?.focus(); return current; }
if (!AP || !KB) { loadAskLibs().then(() => open(prefill), (e) => toast(t('ask.err', { msg: (e && e.message) || '' }), 'warn')); return null; }
const _o25 = ls.get(CONV_KEY, null);
turns = _o25 && Array.isArray(_o25.turns) ? _o25.turns.slice(-AP.ASK_LIMITS.turns) : [];
mode = 'app';
const ta = h('textarea', { class: 'xa-input', rows: 2, placeholder: t('ask.placeholder'), 'aria-label': t('ask.title'), id: 'ask-input', 'data-testid': 'ask-input' });
ta.value = prefill;
const out = h('div', { class: 'xa-out xa-log', role: 'log', 'aria-live': 'polite', 'data-testid': 'ask-out' });
if (turns.length) out.appendChild(h('p', { class: 'xa-memo muted small', 'data-testid': 'ask-memo' }, t('ask.memo', { n: turns.length }), ' ',
button(t('ask.memo.clear'), () => { _o21(); ui.clear(out); }, { kind: 'ghost', small: true, testid: 'ask-memo-clear' })));
const note = h('p', { class: 'warn-text small', hidden: true, 'data-testid': 'ask-note' });
const thumbs = h('div', { class: 'xa-thumbs' });
const images = [];
const file = h('input', { type: 'file', accept: 'image/*', multiple: true, class: 'sr-only', id: 'ask-file', 'data-testid': 'ask-file' });
const _o3 = (list) => { for (const f of list) if (/^image\//.test(f.type)) { images.push({ mime: f.type, name: f.name, file: f }); thumbs.appendChild(h('span', { class: 'badge badge-info' }, '🖼 ' + (f.name || 'ảnh'))); } };
file.addEventListener('change', () => { _o3([...(file.files || [])]); file.value = ''; });
ta.addEventListener('paste', (e) => { const _ov = [...((e.clipboardData && e.clipboardData.files) || [])]; if (_ov.length) { e.preventDefault(); _o3(_ov); } });
let _o22 = false;
const send = async () => {
if (_oa || _o22) return;
note.hidden = true;
let text = ta.value.trim();
if (!text && !images.length) { note.textContent = t('ask.empty'); note.hidden = false; ta.focus(); return; }
const _ob = AP.clip(text, AP.ASK_LIMITS.textMax);
if (_ob.cut) { text = _ob.text; note.textContent = t('ask.cut', { n: AP.ASK_LIMITS.textMax.toLocaleString('vi-VN') }); note.hidden = false; }
if (turns.length) {
ui.clear(out);
out.appendChild(h('p', { class: 'xa-memo muted small', 'data-testid': 'ask-memo' }, t('ask.memo', { n: turns.length }), ' ',
button(t('ask.memo.clear'), () => { _o21(); ui.clear(out); }, { kind: 'ghost', small: true, testid: 'ask-memo-clear' })));
}
if (text) _o1i(out, text);
ta.value = '';
const _o13 = images.splice(0);
ui.clear(thumbs);
_o22 = true; _o2a(true);
let r, o, index;
try {
o = opts();
index = await buildIndex({ store, data: deps.data });
r = routeAsk({ text, images: _o13 }, { ...o, index });
} finally { _o22 = false; _o2a(false); }
await act(r, { text, images: _o13 }, out, o, index);
if (current) ta.focus();
};
ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); _o29.click(); } });
const _o29 = button(t('ask.send'), send, { kind: 'primary', icon: 'next', testid: 'ask-send' });
_o2a = (on) => { _o29.disabled = !!(on || _oa || _o22); };
_ou = () => { try { ta.focus(); } catch { } };
const body = h('div', { class: 'xa', 'data-testid': 'ask' },
out,
ta, note, thumbs,
h('div', { class: 'xa-bar' }, button(t('ask.attach'), () => file.click(), { kind: 'ghost', small: true, icon: 'plus', testid: 'ask-attach' }), file, h('span', { class: 'xa-hint muted small' }, t('ask.hint')), _o29),
aiNote('ask_ai'),
h('div', { class: 'xa-foot' },
button(t('ask.new'), () => { _o21(); ui.clear(out); note.hidden = true; ta.focus(); }, { kind: 'ghost', small: true, icon: 'plus', testid: 'ask-new' }),
typeof openFeedback === 'function' ? button(t('ask.feedback'), () => { close(); openFeedback(); }, { kind: 'secondary', small: true, icon: 'mail', testid: 'ask-feedback' }) : null,
typeof deps.helpLink === 'function' ? deps.helpLink(h) : null));
current = modal({ title: t('ask.modal'), body, wide: true, cls: 'xa-modal', onClose: () => { current = null; _o21(); _o2a = () => {}; _ou = () => {}; } });
setTimeout(() => { if (current && !current.el.contains(document.activeElement)) _ou(); }, 60);
return current;
}
function mountButton(host) {
if (!host || host.querySelector('#ask-open')) return null;
const _o1g = /Mac|iPhone|iPad/.test((typeof navigator !== 'undefined' && navigator.platform) || '');
const _o8 = h('button', { type: 'button', class: 'xa-btn', id: 'ask-open', 'data-testid': 'ask-open', 'aria-label': t('ask.title') + ' (' + (_o1g ? '⌘K' : 'Ctrl+K') + ')', title: t('ask.title') },
ui.icon('sparkle', 20), h('span', { class: 'xa-btn-label' }, t('ask.button')), h('kbd', { class: 'xa-kbd' }, _o1g ? '⌘K' : 'Ctrl K'));
_o8.addEventListener('click', () => open());
host.insertBefore(_o8, host.firstChild);
return _o8;
}
if (typeof setTimeout === 'function') setTimeout(() => { loadAskLibs().catch(() => { }); }, 4000);
return { open, close, handle, mountButton, route: (input, index) => routeAsk(input, { ...opts(), index }) };
}
export function isAskShortcut(e) { return !!e && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && String(e.key).toLowerCase() === 'k'; }
export default { routeAsk, parseShortcuts, searchIndex, makeIndex, resolveShortcut, parseAiRoute, titleFromUrl, createAsk, isAskShortcut, uid };

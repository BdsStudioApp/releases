import { t } from './i18n.39c909b69c.js';
import { fold, words, word, uid } from './xkit.f03faf0986.js';
import { parseRemember } from './memory.3d288471ae.js';
import { markAi, aiNote, PROVIDER_NAMES } from './ai_cost.4e4e8b66f1.js';
export const WORDS = {
'ask.placeholder': 'Hỏi app, dán link hoặc ảnh…',
'ask.button': 'Hỏi app',
'ask.title': 'Hỏi app',
'ask.hint': 'Enter để gửi · Shift+Enter xuống dòng · ⌘K / Ctrl+K mở nhanh. Thử: "ghi nhớ: …", "nâng cấp: …", dán link hoặc ảnh.',
'ask.send': 'Gửi',
'ask.attach': 'Ảnh',
'ask.thinking': 'Em đang xử lý…',
'ask.results': 'Kết quả tìm ({n})',
'ask.none': 'Không thấy mục nào khớp. Em hỏi trợ lý giúp anh/chị nhé?',
'ask.ask_ai': 'Hỏi trợ lý',
'ask.open': 'Mở',
'ask.remembered': 'Em đã ghi nhớ: {text}',
'ask.upgrade': 'Em mở Góp ý với nội dung anh/chị vừa gõ – xem lại rồi bấm "Gửi góp ý". Tính năng mới sẽ đến bằng bản cập nhật gói.',
'ask.fb.missing': 'Phần Góp ý chưa sẵn sàng – mở lại app rồi thử lại.',
'ask.link': 'Đã lưu link vào nguồn ý tưởng.',
'ask.image': 'Đã chuyển ảnh sang màn nhận ảnh.',
'ask.image.none': 'Gói đang dùng chưa có màn nhận ảnh.',
'ask.agree': 'Đồng ý',
'ask.disagree': 'Không',
'ask.agree.done': 'Đã chép câu trả lời.',
'ask.err': 'Trợ lý chưa trả lời được: {msg}',
'ask.empty': 'Chưa có câu trả lời – khung nhờ trợ lý AI đã đóng trước khi dán kết quả. Gửi lại câu hỏi khi cần.',
'ai.task.assistant': 'Trợ lý Hỏi app',
'help.ask': 'Ô Hỏi app nhận lời thường, link, ảnh. App tự chọn việc: tìm dữ liệu, mở đúng màn, ghi nhớ điều anh/chị dặn, mở Góp ý để gửi yêu cầu tính năng mới (gõ "nâng cấp: …"), hoặc hỏi trợ lý AI (theo Bộ chọn AI – mục "Trợ lý Hỏi app").'
};
export function answerView(_oq) {
const answer = String(stripAiRoute(_oq && _oq.text) || '');
const _om = (_oq && _oq.provider) || '';
return { empty: !answer.trim(), answer, provider: PROVIDER_NAMES[_om] || _om };
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
const _o0 = /https?:\/\/[^\s<>"']+/i;
const _oz = (_ob, list) => list.map(fold).find((_oh) => _ob === _oh || _ob.startsWith(_oh + ' ') || _ob.startsWith(_oh + ':'));
const _o8 = (_ob, list) => list.map(fold).find((_oh) => new RegExp('(^|[^a-z0-9])' + _oh.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)').test(_ob));
export function parseShortcuts(lines) {
return (lines || []).map((l, i) => {
const [kws, path, params] = String(l).split('|').map((_ot) => (_ot || '').trim());
if (!kws || !path) return null;
const map = {};
for (const _om of (params || '').split(',').map((_ot) => _ot.trim()).filter(Boolean)) { const [_oh, v] = _om.split('='); if (_oh && v) map[_oh.trim()] = v.trim(); }
return { id: 'sc' + (i + 1), kws: kws.split(';').map((_ot) => _ot.trim()).filter(Boolean), path: path.replace(/^#?\/?/, ''), params: map };
}).filter(Boolean);
}
export function makeIndex(items) {
return (items || []).filter((x) => x && x.id && x.name).map((x) => ({ ...x, _f: fold([x.name, x.sub, ...(x.keys || [])].filter(Boolean).join(' ')), _n: fold(x.name), _p: String(x.phone || '').replace(/\D/g, '') }));
}
export function stripWords(_oo, strip = []) {
let _ob = fold(_oo);
for (const _o17 of [...strip].map(fold).sort((a, _o6) => _o6.length - a.length)) _ob = _ob.replace(new RegExp('(^|\\s)' + _o17.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?=\\s|$)', 'g'), ' ');
return _ob.replace(/\s+/g, ' ').trim();
}
export function searchIndex(query, index, { strip = [], kinds, limit = 8 } = {}) {
const _op = String(query || '');
const _o9 = _op.replace(/\D/g, '');
const _oo = stripWords(_op, strip);
const _o11 = _oo.split(' ').filter((x) => x.length > 0);
const out = [];
for (const _og of index || []) {
if (kinds && !kinds.includes(_og.kind)) continue;
let _ot = 0;
if (_o9.length >= 4 && _og._p && _og._p.includes(_o9)) _ot = 5;
else if (_oo && _og._n === _oo) _ot = 4;
else if (_oo && _oo.length >= 2 && _og._n.includes(_oo)) _ot = 3;
else if (_o11.length && _o11.every((tk) => _og._f.includes(tk))) _ot = 2;
else if (_o11.length > 1) { const _of = _o11.filter((tk) => tk.length > 1 && _og._f.includes(tk)).length; if (_of && _of >= Math.ceil(_o11.length / 2)) _ot = 1; }
if (_ot) out.push({ item: _og, score: _ot });
}
return out.sort((a, _o6) => _o6.score - a.score || a.item.name.localeCompare(_o6.item.name, 'vi')).slice(0, limit);
}
export function resolveShortcut(_ou, rest, index, { strip = [] } = {}) {
const matched = {}; const params = {};
const _ob = fold(rest);
for (const [param, kind] of Object.entries(_ou.params || {})) {
let pool = (index || []).filter((x) => x.kind === kind);
if (kind === 'variant') {
const parent = Object.values(matched)[0];
if (parent) pool = pool.filter((x) => x.parent === parent.id);
const _of = pool.find((x) => new RegExp('(^|\\s)' + x._n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s|$)').test(_ob));
if (_of) { matched[kind] = _of; params[param] = _of.value || _of.name; }
continue;
}
const r = searchIndex(rest, pool, { strip })[0];
if (r && r.score >= 2) { matched[kind] = r.item; params[param] = r.item.id; continue; }
const _oo = ' ' + stripWords(rest, strip) + ' ';
let _o7 = null, bestN = 0;
for (const _og of pool) {
const n = _og._n.split(' ').filter((_o17) => _o17.length >= 3 && _oo.includes(' ' + _o17 + ' ')).length;
if (n > bestN) { _o7 = _og; bestN = n; }
}
if (_o7) { matched[kind] = _o7; params[param] = _o7.id; }
}
const qs = new URLSearchParams(params).toString();
return { path: _ou.path + (qs ? (_ou.path.includes('?') ? '&' : '?') + qs : ''), params, matched };
}
export function routeAsk(input, { shortcuts = [], strip = [], index = [], kw = CORE_KW, imagePath = '', linkPath = '' } = {}) {
const text = String((input && input.text) || '').trim();
const images = (input && input.images) || [];
const _ob = fold(text);
if (images.length) return { intent: 'image', images, text, path: imagePath };
if (!text) return { intent: 'none' };
const _ok = parseRemember(text);
if (_ok) return { intent: 'remember', memory: _ok };
const _o15 = _oz(_ob, kw.upgrade) || _o8(_ob, kw.upgrade);
if (_o15) return { intent: 'upgrade', text: text.replace(/^\s*(nâng cấp|nang cap)\s*[:：-]?\s*/i, '') || text };
const url = (text.match(_o0) || [])[0];
if (url) {
if (/github\.com\//i.test(url)) return { intent: 'upgrade', text, url };
return { intent: 'link', url: url.replace(/[).,;]+$/, ''), note: text.replace(url, '').trim(), path: linkPath };
}
for (const [kws, path] of kw.open || []) {
const _oh = _o8(_ob, kws.split(';'));
if (_oh && _ob.split(' ').length <= 6) return { intent: 'open', path };
}
for (const _ou of shortcuts) {
const _oh = _oz(_ob, _ou.kws) || _o8(_ob, _ou.kws);
if (_oh) {
const rest = _ob.replace(_oh, ' ').trim();
const r = resolveShortcut(_ou, rest, index, { strip });
return { intent: 'shortcut', id: _ou.id, path: r.path, params: r.params, matched: r.matched, rest };
}
}
const _oy = _oz(_ob, kw.search);
if (_oy) {
const query = _ob.slice(_oy.length).replace(/^[:\s]+/, '');
return { intent: 'search', query, results: searchIndex(query, index, { strip }) };
}
if (_ob.split(' ').length <= 6) {
const _oq = searchIndex(text, index, { strip });
if (_oq.length && _oq[0].score >= 3) return { intent: 'search', query: text, results: _oq };
}
return { intent: 'assistant', text };
}
export function parseAiRoute(answer) {
const _oi = String(answer || '').match(/^\s*@route\s*:\s*(upgrade|search|link|remember|shortcut|open)\b\s*(.*)$/im);
if (!_oi) return null;
return { intent: _oi[1].toLowerCase(), arg: _oi[2].trim() };
}
export function stripAiRoute(answer) { return String(answer || '').replace(/^\s*@route\s*:.*$/im, '').trim(); }
export function assistantPrompt(text, { screens = [], shortcuts = [] } = {}) {
return [
'Câu của chủ app trong ô "Hỏi app":', '"""', text, '"""', '',
'Nếu câu này thực chất là thao tác của app, chỉ trả về MỘT dòng đầu dạng "@route: <loại> <tham số>" với loại ∈ {search <từ cần tìm>, upgrade <mô tả>, remember <điều cần nhớ>' +
(shortcuts.length ? ', shortcut <' + shortcuts.map((_ot) => _ot.kws[0]).join(' | ') + '> <tham số>' : '') + '}.',
'Nếu không, trả lời thẳng câu hỏi bằng tiếng Việt' + (screens.length ? ' (app có các màn: ' + screens.join(', ') + ')' : '') + '.'
].join('\n');
}
export function titleFromUrl(url) {
try {
const _o14 = new URL(url);
const _ov = _o14.pathname.split('/').filter(Boolean).pop() || '';
const _ot = decodeURIComponent(_ov).replace(/\.[a-z0-9]{2,5}$/i, '').replace(/[-_]+/g, ' ').replace(/\b\d{5,}\b/g, '').trim();
return (_ot ? _ot.charAt(0).toUpperCase() + _ot.slice(1) : _o14.hostname).slice(0, 120);
} catch { return String(url).slice(0, 120); }
}
export async function buildIndex({ store, data }) {
const items = [];
const _on = (kind, id) => (word('ask.path.' + kind) || '').replace('{id}', encodeURIComponent(id));
try {
const _ol = await store.list('objects');
for (const o of _ol) items.push({ kind: o.kind || 'customer', id: o.id, name: o.name || '', phone: o.phone || o.zalo || '', sub: [o.project, o.status].filter(Boolean).join(' · '), path: _on(o.kind || 'customer', o.id) });
} catch { }
for (const _om of (data && data.projects) || []) {
items.push({ kind: 'project', id: _om.id, name: _om.name || _om.id, sub: [_om.dev, _om.area, _om.loc].filter(Boolean).join(' · '), keys: [_om.id, _om.area], path: _on('project', _om.id) });
for (const _o13 of _om.types || []) if (_o13 && _o13.n) items.push({ kind: 'variant', id: _om.id + ':' + _o13.n, name: String(_o13.n), value: String(_o13.n), parent: _om.id, sub: _om.name, path: _on('project', _om.id) });
}
return makeIndex(items);
}
export function createAsk(deps) {
const { ui, store, ai, nav, memory, openFeedback } = deps;
const { h, button, toast, modal } = ui;
let current = null;
const _o4 = (_om) => !_om || typeof deps.allowPath !== 'function' || deps.allowPath(_om);
const opts = () => ({
shortcuts: parseShortcuts(words('ask.shortcuts')).filter((_ou) => _o4(_ou.path)), strip: words('ask.strip'),
imagePath: [word('ask.image.path').replace(/^#?\/?/, '')].filter(_o4)[0] || '', linkPath: [word('ask.link.path').replace(/^#?\/?/, '')].filter(_o4)[0] || ''
});
async function handle(input, out) {
const o = opts();
const index = await buildIndex({ store, data: deps.data });
const r = routeAsk(input, { ...o, index });
return _o1(r, input, out, o, index);
}
async function _o1(r, input, out, o, index) {
const _ox = (...nodes) => { if (out) ui.mountTo(out, ...nodes); };
const _od = (path) => { close(); nav(path); };
switch (r.intent) {
case 'remember': {
const _oq = await memory.add({ ...r.memory, source: 'ask' });
if (_oq.private) { _ox(h('p', { class: 'warn-text' }, t('mem.private'))); return r; }
_ox(h('p', { class: 'ok-text', 'data-testid': 'ask-remembered' }, _oq.dup ? t('mem.dup') : t('ask.remembered', { text: r.memory.text })),
button(t('mem.title'), () => _od('settings/memory'), { kind: 'ghost', small: true }));
return r;
}
case 'upgrade': {
const text = [r.text || input.text, r.url && !String(r.text || '').includes(r.url) ? r.url : ''].filter(Boolean).join('\n');
close();
if (typeof openFeedback === 'function') { openFeedback({ kind: 'add', text }); toast(t('ask.upgrade'), 'info', 4000); }
else nav('settings/feedback');
return r;
}
case 'open': _od(r.path); return r;
case 'link': {
const _os = await store.put('ideas', { title: titleFromUrl(r.url), url: r.url, summary: r.note || '', source: 'ask', status: 'new' });
toast(t('ask.link'), 'ok');
if (r.path) _od(r.path + (r.path.includes('?') ? '&' : '?') + 'id=' + encodeURIComponent(_os.id));
else _ox(h('p', { class: 'ok-text' }, t('ask.link')));
return r;
}
case 'image': {
if (!r.path) { _ox(h('p', { class: 'warn-text' }, t('ask.image.none'))); return r; }
_od(r.path);
_oe(r.images);
return r;
}
case 'shortcut': _od(r.path); return r;
case 'search': {
if (!r.results.length) {
_ox(h('p', { class: 'muted' }, t('ask.none')), markAi(button(t('ask.ask_ai'), () => _o1({ intent: 'assistant', text: input.text }, input, out, o, index), { kind: 'primary', small: true, testid: 'ask-fallback-ai' }), 'ask_ai'));
return r;
}
_ox(h('h4', { class: 'section-title' }, t('ask.results', { n: r.results.length })),
ui.list(r.results, ({ item }) => h('div', { class: 'row-main', 'data-testid': 'ask-hit' },
h('div', { class: 'row-text' }, h('strong', null, item.name), h('span', { class: 'muted small' }, [word('ask.kind.' + item.kind) || item.kind, item.sub].filter(Boolean).join(' · '))),
item.path ? button(t('ask.open'), () => _od(item.path), { kind: 'secondary', small: true }) : null), { onClick: ({ item }) => item.path && _od(item.path) }));
return r;
}
case 'assistant': {
_ox(h('p', { class: 'muted' }, ui.spinner(), ' ', t('ask.thinking')));
let _oq;
const _o16 = ai.connected && !ai.connected() ? 'handoff_claude' : undefined;
try { _oq = await ai.run('assistant', { prompt: assistantPrompt(r.text, { screens: (deps.getScreens ? deps.getScreens() : []), shortcuts: o.shortcuts }), provider: _o16, feature: 'ask_ai' }); } catch (e) {
if (e && e.code === 'AI_CANCELLED') { _ox(h('p', { class: 'muted', 'data-testid': 'ask-cancelled' }, e.message)); return r; }
_ox(h('p', { class: 'warn-text' }, t('ask.err', { msg: (e && (e.userMessage || e.message)) || '' }))); return r;
}
const _or = parseAiRoute(_oq && _oq.text);
if (_or) {
const map = { search: { intent: 'search', query: _or.arg, results: searchIndex(_or.arg, index, { strip: o.strip }) }, upgrade: { intent: 'upgrade', text: _or.arg || r.text }, remember: { intent: 'remember', memory: parseRemember('ghi nhớ: ' + _or.arg) || { kind: 'preference', text: _or.arg } } };
if (_or.intent === 'shortcut') { const _o3 = routeAsk({ text: _or.arg }, { ...o, index }); if (_o3.intent === 'shortcut') return _o1(_o3, input, out, o, index); }
if (map[_or.intent]) return _o1(map[_or.intent], input, out, o, index);
}
const _o5 = answerView(_oq);
if (_o5.empty) { _ox(h('p', { class: 'muted', 'data-testid': 'ask-cancelled' }, t('ask.empty'))); return r; }
const answer = _o5.answer;
_ox(h('p', { class: 'muted small xa-q' }, '“' + r.text + '”'), h('div', { class: 'xa-answer', 'data-testid': 'ask-answer' }, ui.paragraphs(answer), h('p', { class: 'muted small' }, _o5.provider)),
h('div', { class: 'btn-row' },
button(t('ask.agree'), async () => { await ui.copy(answer, { silent: true }); toast(t('ask.agree.done'), 'ok'); }, { kind: 'primary', small: true, icon: 'check', testid: 'ask-agree' }),
button(t('ask.disagree'), () => { if (out) ui.clear(out); }, { kind: 'ghost', small: true, testid: 'ask-disagree' })));
return r;
}
default: return r;
}
}
function _oe(images) {
const files = images.map((im) => im.file).filter(Boolean);
let _o12 = 0;
const _o10 = () => {
const input = document.querySelector('.module-host input[type=file]');
if (input && files.length && typeof DataTransfer !== 'undefined') {
try { const _oa = new DataTransfer(); files.forEach((_ob) => _oa.items.add(_ob)); input.files = _oa.files; input.dispatchEvent(new Event('change', { bubbles: true })); toast(t('ask.image'), 'ok'); } catch { }
return;
}
if (++_o12 < 40) setTimeout(_o10, 100);
};
setTimeout(_o10, 50);
}
function close() { if (current) { current.close(); current = null; } }
function open(prefill = '') {
if (current) { current.el.querySelector('textarea')?.focus(); return current; }
const ta = h('textarea', { class: 'xa-input', rows: 2, placeholder: t('ask.placeholder'), 'aria-label': t('ask.title'), id: 'ask-input', 'data-testid': 'ask-input' });
ta.value = prefill;
const out = h('div', { class: 'xa-out', 'aria-live': 'polite', 'data-testid': 'ask-out' });
const thumbs = h('div', { class: 'xa-thumbs' });
const images = [];
const file = h('input', { type: 'file', accept: 'image/*', multiple: true, class: 'sr-only', id: 'ask-file', 'data-testid': 'ask-file' });
const _o2 = (list) => { for (const _ob of list) if (/^image\//.test(_ob.type)) { images.push({ mime: _ob.type, name: _ob.name, file: _ob }); thumbs.appendChild(h('span', { class: 'badge badge-info' }, '🖼 ' + (_ob.name || 'ảnh'))); } };
file.addEventListener('change', () => { _o2([...(file.files || [])]); file.value = ''; });
ta.addEventListener('paste', (e) => { const _oc = [...((e.clipboardData && e.clipboardData.files) || [])]; if (_oc.length) { e.preventDefault(); _o2(_oc); } });
const send = async () => {
const text = ta.value.trim();
if (!text && !images.length) return;
await handle({ text, images: images.splice(0) }, out);
ui.clear(thumbs);
if (current) ta.value = '';
};
ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); _ow.click(); } });
const _ow = button(t('ask.send'), send, { kind: 'primary', icon: 'next', testid: 'ask-send' });
const body = h('div', { class: 'xa', 'data-testid': 'ask' },
ta, thumbs,
h('div', { class: 'xa-bar' }, button(t('ask.attach'), () => file.click(), { kind: 'ghost', small: true, icon: 'plus', testid: 'ask-attach' }), file, h('span', { class: 'xa-hint muted small' }, t('ask.hint')), _ow),
aiNote('ask_ai'),
out);
current = modal({ title: t('ask.title'), body, wide: true, cls: 'xa-modal', onClose: () => { current = null; } });
return current;
}
function mountButton(host) {
if (!host || host.querySelector('#ask-open')) return null;
const _oj = /Mac|iPhone|iPad/.test((typeof navigator !== 'undefined' && navigator.platform) || '');
const _o6 = h('button', { type: 'button', class: 'xa-btn', id: 'ask-open', 'data-testid': 'ask-open', 'aria-label': t('ask.title') + ' (' + (_oj ? '⌘K' : 'Ctrl+K') + ')', title: t('ask.title') },
ui.icon('sparkle', 20), h('span', { class: 'xa-btn-label' }, t('ask.button')), h('kbd', { class: 'xa-kbd' }, _oj ? '⌘K' : 'Ctrl K'));
_o6.addEventListener('click', () => open());
host.insertBefore(_o6, host.firstChild);
return _o6;
}
return { open, close, handle, mountButton, route: (input, index) => routeAsk(input, { ...opts(), index }) };
}
export function isAskShortcut(e) { return !!e && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && String(e.key).toLowerCase() === 'k'; }
export default { routeAsk, parseShortcuts, searchIndex, makeIndex, resolveShortcut, parseAiRoute, titleFromUrl, createAsk, isAskShortcut, uid };

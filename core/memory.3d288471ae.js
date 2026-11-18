import { t } from './i18n.39c909b69c.js';
import { fold, words, uid, download, ls } from './xkit.f03faf0986.js';
export const KINDS = ['preference', 'rule', 'habit', 'decision', 'goal'];
export const SETTINGS_KEY = 'memory';
export const EDIT_LOG_KEY = 'bds:mem:edits';
export const MAX_ITEMS = 300;
export const MAX_TEXT = 400;
export const WORDS = {
'mem.title': 'Điều app biết về anh/chị',
'mem.lead': 'Những điều em ghi nhớ để làm đúng ý anh/chị. Anh/chị xem, sửa, tắt hoặc xoá bất kỳ lúc nào. Không chứa dữ liệu khách.',
'mem.kind.preference': 'Sở thích',
'mem.kind.rule': 'Quy tắc',
'mem.kind.habit': 'Thói quen',
'mem.kind.decision': 'Quyết định',
'mem.kind.goal': 'Mục tiêu',
'mem.source.seed': 'Quy tắc gốc',
'mem.source.ask': 'Lệnh "ghi nhớ"',
'mem.source.observe': 'Em tự để ý',
'mem.source.manual': 'Anh/chị thêm',
'mem.add': 'Thêm điều cần nhớ',
'mem.add.ph': 'Vd: Gửi báo giá kèm 2 phương án thanh toán',
'mem.saved': 'Em đã ghi nhớ.',
'mem.private': 'Câu này có số điện thoại/email/số giấy tờ – em không ghi vào bộ nhớ.',
'mem.dup': 'Điều này em đã nhớ rồi.',
'mem.empty': 'Chưa ghi nhớ điều gì.',
'mem.export': 'Xuất sang claude.ai',
'mem.export.lead': 'Dán đoạn dưới vào claude.ai → Cài đặt → Hồ sơ → "Sở thích cá nhân", hoặc tải tệp .md để lưu.',
'mem.export.md': 'Tải tệp .md',
'mem.export.open': 'Mở cài đặt claude.ai',
'mem.summary': 'Tóm tắt tháng {m}',
'mem.summary.none': 'Tháng này chưa có điều mới.',
'mem.ask.title': 'Ghi nhớ thói quen này?',
'mem.ask.lead': 'Em để ý anh/chị đã sửa {n} lần cùng một kiểu:',
'mem.ask.yes': 'Đồng ý',
'mem.ask.no': 'Không',
'mem.on': 'Đang dùng',
'mem.off': 'Đã tắt',
'help.memory': 'Bộ nhớ riêng của anh/chị: quy tắc, sở thích, thói quen, quyết định, mục tiêu của anh/chị. Em dùng khi trả lời và soạn nội dung. Thêm nhanh: gõ "ghi nhớ: …" vào ô Hỏi app. Khi anh/chị sửa cùng một kiểu 2 lần, em hỏi trước khi ghi. Mỗi tháng em tóm tắt các điều mới.'
};
const _o1 = /^\s*(?:hãy\s+|em\s+)?(?:ghi\s*nhớ|nhớ\s+giúp(?:\s+anh)?|nhớ\s+rằng|nhớ\s+là|remember)\s*(quy tắc|sở thích|thói quen|quyết định|mục tiêu)?\s*[:：,\-–]?\s*(.+)$/is;
const _o0 = { 'quy tắc': 'rule', 'sở thích': 'preference', 'thói quen': 'habit', 'quyết định': 'decision', 'mục tiêu': 'goal' };
export function parseRemember(text) {
const _oe = String(text || '').match(_o1);
if (!_oe) return null;
const body = _oe[2].trim().replace(/^[:：,\-–\s]+/, '');
if (body.length < 3) return null;
const kind = _oe[1] ? _o0[_oe[1].toLowerCase()] : guessKind(body);
return { kind, text: body.slice(0, MAX_TEXT) };
}
export function guessKind(text) {
const _o6 = fold(text);
if (/\b(muc tieu|dat duoc|phan dau|chi tieu)\b/.test(_o6)) return 'goal';
if (/\b(quyet dinh|da chot|chot la|tu nay chon)\b/.test(_o6)) return 'decision';
if (/\b(luon|khong bao gio|khong duoc|bat buoc|phai|dung bao gio|cam)\b/.test(_o6)) return 'rule';
if (/\b(thuong|hay|moi sang|moi toi|hang ngay|hang tuan|moi ngay|moi tuan)\b/.test(_o6)) return 'habit';
return 'preference';
}
export function containsPrivate(text) {
const s = String(text || '');
if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(s)) return true;
if (/(?:\+?84|0)(?:[\s.-]?\d){8,10}/.test(s)) return true;
if (/\b\d{9,12}\b/.test(s.replace(/[\s.]/g, ''))) return true;
return false;
}
export function newItem({ kind, text, source = 'manual', enabled = true, id } = {}, now = Date.now()) {
return { id: id || uid('m'), kind: KINDS.includes(kind) ? kind : 'preference', text: String(text || '').trim().slice(0, MAX_TEXT), source, created_at: now, enabled: enabled !== false };
}
export function normalizeList(v) {
return (Array.isArray(v) ? v : []).filter((x) => x && typeof x.text === 'string' && x.text.trim())
.map((x) => ({ ...x, kind: KINDS.includes(x.kind) ? x.kind : 'preference', enabled: x.enabled !== false, created_at: Number(x.created_at) || 0 }));
}
export function addTo(list, input, now = Date.now()) {
list = normalizeList(list);
if (containsPrivate(input.text)) return { list, item: null, private: true };
const key = fold(input.text);
const dup = list.find((x) => fold(x.text) === key);
if (dup) return { list, item: dup, dup: true };
const item = newItem(input, now);
return { list: [...list, item].slice(-MAX_ITEMS), item, dup: false };
}
export function parseSeeds(_oc) {
return (_oc || []).map((_ob, i) => {
const [_o2, ...rest] = String(_ob).split('|');
const kind = KINDS.includes(_o2.trim()) ? _o2.trim() : 'rule';
const text = (KINDS.includes(_o2.trim()) ? rest.join('|') : _ob).trim();
return { id: 'seed-' + (i + 1), kind, text };
}).filter((x) => x.text);
}
export function seedMemory(list, seeds, seeded = [], now = Date.now()) {
list = normalizeList(list);
const done = new Set(seeded || []);
const _o7 = new Set(list.map((x) => x.id));
const add = [];
for (const s of seeds || []) {
if (done.has(s.id) || _o7.has(s.id)) continue;
add.push(newItem({ ...s, source: 'seed' }, now));
done.add(s.id);
}
return { list: add.length ? [...list, ...add] : list, seeded: [...done], added: add.length };
}
export function editSignature(before, after) {
const _o2 = String(before || ''), b = String(after || '');
if (_o2 === b) return null;
let _ok = 0; const n = Math.min(_o2.length, b.length);
while (_ok < n && _o2[_ok] === b[_ok]) _ok++;
let s = 0;
while (s < n - _ok && _o2[_o2.length - 1 - s] === b[b.length - 1 - s]) s++;
const _of = (c) => c !== undefined && !/\s/.test(c);
if (_ok > 0 && _of(_o2[_ok - 1]) && (_of(_o2[_ok]) || _of(b[_ok]))) while (_ok > 0 && _of(_o2[_ok - 1])) _ok--;
if (s > 0 && _of(_o2[_o2.length - s]) && (_of(_o2[_o2.length - s - 1]) || _of(b[b.length - s - 1]))) while (s > 0 && _of(_o2[_o2.length - s])) s--;
const removed = _o2.slice(_ok, _o2.length - s).trim();
const inserted = b.slice(_ok, b.length - s).trim();
if (!removed && !inserted) return null;
if (removed.length > 60 || inserted.length > 60) return null;
if (containsPrivate(removed) || containsPrivate(inserted)) return null;
return { removed, inserted };
}
export function recordEdit(log, { field = '', before, after, at = Date.now() } = {}, { threshold = 2, asked = [] } = {}) {
const _oq = editSignature(before, after);
const keep = (Array.isArray(log) ? log : []).filter((x) => x && at - Number(x.at) < 60 * 86400000).slice(-200);
if (!_oq) return { log: keep, suggestion: null };
const key = fold(field) + '|' + fold(_oq.removed) + '→' + fold(_oq.inserted);
const next = [...keep, { key, field, removed: _oq.removed, inserted: _oq.inserted, at }];
const count = next.filter((x) => x.key === key).length;
if (count < threshold || (asked || []).includes(key)) return { log: next, suggestion: null };
return { log: next, suggestion: { key, field, count, kind: 'preference', text: suggestionText(field, _oq) } };
}
export function suggestionText(field, { removed, inserted }) {
const _os = field ? 'Khi soạn ' + field + ': ' : '';
if (removed && inserted) return _os + 'dùng "' + inserted + '" thay cho "' + removed + '"';
if (removed) return _os + 'bỏ "' + removed + '"';
return _os + 'thêm "' + inserted + '"';
}
export function monthKey(ms) { const _o3 = new Date(Number(ms)); return _o3.getFullYear() + '-' + String(_o3.getMonth() + 1).padStart(2, '0'); }
export function monthlySummary(list, now = Date.now(), label = (_o8) => _o8) {
list = normalizeList(list);
const _oe = monthKey(now);
const fresh = list.filter((x) => monthKey(x.created_at) === _oe);
const _og = list.filter((x) => x.enabled);
const counts = Object.fromEntries(KINDS.map((_o8) => [_o8, _og.filter((x) => x.kind === _o8).length]));
const _oc = [
'Tháng ' + _oe.slice(5) + '/' + _oe.slice(0, 4) + ': ' + _og.length + ' điều đang dùng (' + KINDS.filter((_o8) => counts[_o8]).map((_o8) => counts[_o8] + ' ' + label(_o8).toLowerCase()).join(', ') + ').',
fresh.length ? 'Mới trong tháng (' + fresh.length + '):' : 'Không có điều mới trong tháng.',
...fresh.map((x) => '• ' + label(x.kind) + ': ' + x.text)
];
return { month: _oe, counts, fresh: fresh.length, text: _oc.join('\n') };
}
export function memoryPrompt(list, max = 1800, label = (_o8) => _o8) {
const _og = normalizeList(list).filter((x) => x.enabled);
if (!_og.length) return '';
const _oj = []; let _oa = 0;
const _oi = ['rule', 'preference', 'habit', 'decision', 'goal'];
for (const _o8 of _oi) for (const x of _og.filter((y) => y.kind === _o8)) {
const _ob = '- ' + label(_o8) + ': ' + x.text;
if (_oa + _ob.length > max) break;
_oj.push(_ob); _oa += _ob.length + 1;
}
return _oj.join('\n');
}
export function exportMarkdown(list, { title = 'Điều cần biết về tôi', persona = '', label = (_o8) => _o8, now = Date.now() } = {}) {
const _og = normalizeList(list).filter((x) => x.enabled);
const _ol = ['# ' + title, '', '_Xuất ngày ' + new Date(now).toISOString().slice(0, 10) + ' – không chứa dữ liệu khách._', ''];
if (persona) _ol.push('## Cách trao đổi', '', persona.trim(), '');
for (const _o8 of KINDS) {
const items = _og.filter((x) => x.kind === _o8);
if (!items.length) continue;
_ol.push('## ' + label(_o8), '', ...items.map((x) => '- ' + x.text), '');
}
return _ol.join('\n').trim() + '\n';
}
export function kindLabel(_o8) { return t('mem.kind.' + _o8); }
export function createMemory({ settings, ui, now = () => Date.now() } = {}) {
const get = () => normalizeList(settings.get(SETTINGS_KEY, []));
const _op = (list) => settings.set(SETTINGS_KEY, list);
const mem = {
list: get,
async ensureSeeds() {
const seeds = parseSeeds(words('mem.seed'));
const _oo = seedMemory(get(), seeds, settings.get('memory_seeded', []), now());
if (_oo.added) { await _op(_oo.list); await settings.set('memory_seeded', _oo.seeded); }
return _oo.added;
},
async add(input) {
const _on = addTo(get(), input, now());
if (_on.private) return { ok: false, private: true };
if (!_on.dup) await _op(_on.list);
return { ok: true, item: _on.item, dup: !!_on.dup };
},
async update(id, patch) { await _op(get().map((x) => (x.id === id ? { ...x, ...patch, text: String((patch.text ?? x.text)).slice(0, MAX_TEXT) } : x))); },
async remove(id) { await _op(get().filter((x) => x.id !== id)); },
prompt(max) { return memoryPrompt(get(), max, kindLabel); },
summary() { return monthlySummary(get(), now(), kindLabel); },
async monthly() {
const s = mem.summary(); const _om = settings.get('memory_summary', null);
if (!_om || _om.month !== s.month) await settings.set('memory_summary', { month: s.month, text: s.text, at: now() });
return s;
},
exportMd(persona = '') { return exportMarkdown(get(), { title: t('mem.title'), persona, label: kindLabel, now: now() }); },
async observe(field, before, after) {
const asked = ls.get('bds:mem:asked', []);
const { log, suggestion } = recordEdit(ls.get(EDIT_LOG_KEY, []), { field, before, after, at: now() }, { asked });
ls.set(EDIT_LOG_KEY, log);
if (!suggestion || !ui) return null;
ls.set('bds:mem:asked', [...asked, suggestion.key].slice(-200));
const { h } = ui;
const ok = await ui.modal({
title: t('mem.ask.title'),
body: h('div', { 'data-testid': 'mem-ask' }, h('p', null, t('mem.ask.lead', { n: suggestion.count })), h('p', { class: 'lead' }, suggestion.text)),
actions: [{ label: t('mem.ask.no'), kind: 'ghost', value: false, id: 'mem-ask-no' }, { label: t('mem.ask.yes'), kind: 'primary', value: true, id: 'mem-ask-yes' }]
}).done;
if (ok === true) { await mem.add({ kind: suggestion.kind, text: suggestion.text, source: 'observe' }); ui.toast(t('mem.saved'), 'ok'); }
return ok === true ? suggestion : null;
}
};
return mem;
}
export function renderMemoryPanel(body, { ui, memory, persona }) {
const { h, button, field, badge, toast, modal, copy } = ui;
const _od = h('div', { class: 'xm-list', 'data-testid': 'mem-list' });
const sumBox = h('div', { class: 'xm-sum muted small', 'data-testid': 'mem-summary' });
const _o9 = field({ label: t('mem.kind.rule') + ' / ' + t('mem.kind.preference'), type: 'select', value: 'preference', options: KINDS.map((_o8) => ({ value: _o8, label: kindLabel(_o8) })) });
const textF = field({ label: t('mem.add'), placeholder: t('mem.add.ph'), id: 'mem-new' });
body.append(
h('p', { class: 'muted' }, t('mem.lead')),
h('div', { class: 'grid-2' }, textF, _o9),
h('div', { class: 'btn-row' },
button(t('mem.add'), async () => {
const v = String(textF.getValue() || '').trim(); if (!v) return;
const _on = await memory.add({ kind: _o9.getValue(), text: v, source: 'manual' });
if (_on.private) return toast(t('mem.private'), 'warn', 5000);
toast(_on.dup ? t('mem.dup') : t('mem.saved'), 'ok'); textF.setValue(''); _o4();
}, { kind: 'primary', icon: 'plus', testid: 'mem-add' }),
button(t('mem.export'), () => _oh(), { kind: 'secondary', icon: 'sparkle', testid: 'mem-export' })),
sumBox, _od);
_o4();
function _o4() {
const s = memory.summary();
sumBox.textContent = s.text.split('\n')[0];
const items = memory.list().slice().reverse();
ui.mountTo(_od, items.length ? ui.list(items, (x) => {
const _or = h('span', { class: ['xm-text', !x.enabled && 'is-off'] }, x.text);
return h('div', { class: 'xm-row', dataset: { mem: x.id } },
h('div', { class: 'row-text' },
h('div', { class: 'row-line' }, badge(kindLabel(x.kind), x.kind === 'rule' ? 'gold' : 'neutral'), h('span', { class: 'muted small' }, t('mem.source.' + x.source) !== 'mem.source.' + x.source ? t('mem.source.' + x.source) : x.source)),
_or),
h('div', { class: 'xm-acts' },
field({ label: x.enabled ? t('mem.on') : t('mem.off'), type: 'toggle', value: x.enabled, onChange: async (v) => { await memory.update(x.id, { enabled: !!v }); _o4(); } }),
button('', () => _o5(x), { kind: 'ghost', icon: 'log', title: 'Sửa', small: true }),
button('', async () => { await memory.remove(x.id); _o4(); }, { kind: 'ghost', icon: 'x', title: t('common.remove'), small: true })));
}) : h('p', { class: 'muted' }, t('mem.empty')));
}
async function _o5(x) {
const _o6 = field({ label: kindLabel(x.kind), type: 'textarea', rows: 3, value: x.text });
const v = await modal({ title: t('mem.title'), body: _o6, actions: [{ label: t('common.cancel'), kind: 'ghost', value: null }, { label: t('common.save'), kind: 'primary', onClick: () => String(_o6.getValue() || '').trim() || null }] }).done;
if (typeof v === 'string' && v) { await memory.update(x.id, { text: v }); _o4(); }
}
function _oh() {
const md = memory.exportMd(persona ? persona.systemPrompt('owner', { withMemory: false }) : '');
const ta = h('textarea', { class: 'handoff-prompt', readonly: true, rows: 10, 'data-testid': 'mem-export-text' }); ta.value = md;
modal({
title: t('mem.export'), wide: true,
body: h('div', null, h('p', { class: 'muted' }, t('mem.export.lead')), ta,
h('div', { class: 'btn-row' },
button(t('common.copy'), () => copy(md), { kind: 'primary', icon: 'log' }),
button(t('mem.export.md'), () => download('dieu-app-biet-ve-anh.md', md, 'text/markdown;charset=utf-8'), { kind: 'secondary', icon: 'disk' }),
button(t('mem.export.open'), () => window.open('https://claude.ai/settings/profile', '_blank', 'noopener'), { kind: 'ghost', icon: 'link' }))),
actions: [{ label: t('common.close'), kind: 'ghost' }]
});
}
}
export default { parseRemember, guessKind, containsPrivate, addTo, parseSeeds, seedMemory, editSignature, recordEdit, monthlySummary, memoryPrompt, exportMarkdown, createMemory, renderMemoryPanel };

import { g2kit, h, g2Selftest } from '../g2_lib/ui.js';
import { kids } from '../_lib/kit.js';
import * as T from '../g2_lib/talk.js';
import * as C from '../g2_lib/core.js';
import * as O from '../g2_lib/objection_stats.js';
import { renderWingman } from '../g2_lib/wingman_ui.js';
import { renderWarm } from './warm_ui.js';
import { gate } from '../_lib/consent.js';
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
const _oy = new URLSearchParams(location.hash.split('?')[1] || '');
let tab = _oy.get('tab') || 'reply';
let cat = '';
let readId = _oy.get('customer') || '';
let _on = _oy.get('objection') || '';
let objCust = '';
const _o18 = { text: '', channel: 'comment', project: '' };
const _o1d = {};
el.innerHTML = '';
const tabsBox = h('div');
const body = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-tuvan' }, G.head('Tư vấn: Trả lời & Kịch bản'), tabsBox, body));
async function scripts() {
const [cfg, mine] = await Promise.all([K.setting('g2.scripts', null), G.objectsOf('g2_script')]);
return { cfg, list: T.mergeScripts(cfg, mine.filter(o => !ctx.user || o.owner === ctx.user.id || o.created_by === ctx.user.id || !o.owner)) };
}
async function _o10() {
tabsBox.innerHTML = '';
tabsBox.appendChild(G.tabs([['reply', 'Gợi ý trả lời'], ['scripts', 'Kịch bản & từ chối'], ['warm', 'Người quen'], ['read', 'Đọc khách'], ['wingman', 'Wingman']], tab, t => { tab = t; _o10(); }, 'g2tv-tab'));
body.innerHTML = '';
if (tab === 'scripts') return _o13();
if (tab === 'read') return _o11();
if (tab === 'warm') return _ob();
if (tab === 'wingman') return renderWingman(body, { G, ctx });
return _o12();
}
async function _o12() {
const { list } = await scripts();
const _o1a = h('textarea', { rows: 4, placeholder: 'Dán bình luận hoặc tin nhắn của khách…', 'data-testid': 'g2-reply-in', oninput: e => { _o18.text = e.target.value; } }, _o18.text);
const _o7 = K.select([['comment', 'Bình luận công khai'], ['message', 'Tin nhắn riêng']], _o18.channel, { 'aria-label': 'Kênh', onchange: e => { _o18.channel = e.target.value; } });
const _ot = K.select([['', '— Dự án (tuỳ chọn) —'], ...K.projects().map(_oq => [_oq.id, _oq.name])], _o18.project, { 'aria-label': 'Dự án', onchange: e => { _o18.project = e.target.value; } });
const out = h('div', { 'data-testid': 'g2-reply-out' });
const _o16 = r => {
out.innerHTML = '';
if (r.warnings.length) out.appendChild(h('div', { class: 'bds-warn', 'data-testid': 'g2-reply-warn' }, r.warnings.join(' ')));
out.appendChild(h('div', { class: 'g2-pills', 'data-testid': 'g2-intents' }, r.intents.length ? r.intents.map(i => h('span', { class: 'g2-pill' }, i.label)) : h('span', { class: 'bds-muted' }, 'Chưa nhận ra ý định cụ thể')));
const _ow = h('textarea', { rows: 3, 'data-testid': 'g2-reply-public' }, r.public);
const _ou = h('textarea', { rows: 6, 'data-testid': 'g2-reply-private' }, r.private);
if (_o18.channel === 'comment' && !r.spam) out.appendChild(K.card({ title: 'Trả lời công khai', body: [_ow, K.button('Chép', async () => { await K.copy(_ow.value); K.toast('Đã chép', 'success'); }, { testid: 'g2-copy-public' })] }));
if (!r.spam) out.appendChild(K.card({ title: 'Tin nhắn riêng', body: [_ou, h('div', { class: 'bds-row bds-wrap' },
K.button('Chép', async () => { await K.copy(_ou.value); K.toast('Đã chép', 'success'); }, { testid: 'g2-copy-private' }),
K.button('✨ Viết lại bằng AI', async () => {
if (!_o18.text.trim()) { K.toast('Dán nội dung khách viết trước', 'warn'); return; }
try {
const me = await K.me();
const t = await G.aiText('zalo_draft', T.replyPrompt(_o18.text, { channel: _o18.channel, project: K.projectName(_o18.project), me }), true, 'g2_reply');
const _oj = T.parseReplyJson(t);
if (_oj) { if (_oj.public) _ow.value = _oj.public; if (_oj.private) _ou.value = _oj.private; K.toast('AI đã viết lại – đọc kỹ trước khi gửi', 'info'); }
else K.toast('AI trả lời chưa đúng dạng – bấm lại hoặc dùng "Làm bằng Claude/Gemini"', 'warn');
} catch (e) { if (!K.isAiCancel(e)) K.toast(e.message || 'AI chưa trả lời', 'warn'); }
}, { ai: 'g2_reply', testid: 'g2-reply-ai' }),
K.button('Làm bằng Claude/Gemini', async () => { if (!_o18.text.trim()) { K.toast('Dán nội dung khách viết trước', 'warn'); return; } return G.handoff('zalo_draft', T.replyPrompt(_o18.text, { channel: _o18.channel, project: K.projectName(_o18.project), me: await K.me() })); }, { icon: 'external' }))] }));
if (r.scripts.length) out.appendChild(K.card({ title: 'Kịch bản liên quan', body: r.scripts.map(s => h('details', { class: 'bds-sample' }, h('summary', null, s.title), h('p', null, s.text), s.tip ? h('p', { class: 'bds-muted' }, '💡 ' + s.tip) : null)) }));
};
body.append(K.field('Khách viết', _o1a), h('div', { class: 'bds-grid2' }, K.field('Ở đâu', _o7), K.field('Dự án', _ot)),
h('div', { class: 'bds-row' }, K.button('Gợi ý trả lời', () => {
if (!_o18.text.trim()) { K.toast('Dán nội dung khách viết trước', 'warn'); return; }
_o16(T.suggestReplies(_o18.text, { scripts: list, channel: _o18.channel, vars: { du_an: K.projectName(_o18.project) } }));
}, { kind: 'primary', testid: 'g2-reply-go', icon: 'sparkle' })), out, _oe());
}
async function _ok() {
const [{ cfg, list }, uses, customers, me] = await Promise.all([scripts(), G.objectsOf(O.USE_KIND), G.customers(), K.me()]);
return { cfg, list, customers, me: me || {}, stats: O.useStats(O.parseUses(uses)) };
}
async function _oz(s, result) {
try {
const row = O.useRow({ scriptId: s.id, customerId: objCust, result, by: G.user().id || '', now: Date.now(), objection: O.objectionOf(s) }, await G.objectsOf(O.USE_KIND));
const _o0 = !!row.id;
await K.put('objects', row);
K.toast(_o0 ? 'Đã sửa kết quả lần dùng vừa rồi' : 'Đã ghi kết quả', 'success');
} catch (e) { K.toast(e.message, 'warn'); return; }
_o13();
}
const _o1c = (s, pre) => h('div', { class: 'bds-row bds-wrap', role: 'group', 'aria-label': 'Ghi kết quả sau khi dùng' },
O.RESULTS.map(([r, l]) => K.button(l, () => _oz(s, r), { kind: r === 'open' ? 'primary' : 'ghost', icon: r === 'open' ? 'check' : r === 'no' ? 'x' : 'help', testid: pre + r + (pre === 'g2-obj-use-' ? '' : '-' + s.id) })));
async function _o13() {
const { cfg, list, customers, me, stats } = await _ok();
if (tab !== 'scripts') return;
const _o19 = G.isStaff();
const scopeLabel = { default: 'mặc định', team: 'của đội', mine: 'của tôi' };
const nodes = [];
if (objCust && !customers.some(_o5 => _o5.id === objCust)) objCust = '';
const cust = customers.find(_o5 => _o5.id === objCust) || null;
const _o3 = h('div', { 'data-testid': 'g2-obj-out' });
const fill = s => O.personalize(s, cust, { projectName: K.projectName, money: K.money, me });
if (_on) {
const r = O.bestFor(_on, list, stats);
if (!r.best) _o3.appendChild(K.empty('Chưa có kịch bản cho câu này – bấm "AI soạn" hoặc "+ Kịch bản mới".'));
else {
const _oq = fill(r.best);
_o3.appendChild(K.card({ title: 'Nên trả lời: ' + r.best.title, testid: 'g2-obj-best', actions: [K.badge(scopeLabel[r.best.scope] || '', r.best.scope === 'mine' ? 'success' : 'muted')], body: [
h('p', { class: 'bds-pre', 'data-testid': 'g2-obj-text' }, _oq.text),
h('small', { class: _oq.personal ? 'bds-muted' : 'bds-warn', 'data-testid': 'g2-obj-note' }, (_oq.personal ? '👤 ' : '🔒 ') + _oq.note),
h('p', { class: 'bds-muted', 'data-testid': 'g2-obj-stat' }, '📊 ' + O.statLine(stats[r.best.id])),
r.best.tip ? h('p', { class: 'bds-muted' }, '💡 ' + r.best.tip) : null,
h('div', { class: 'bds-row bds-wrap' }, K.button('Chép', async () => { await K.copy(_oq.text); K.toast('Đã chép – anh/chị tự gửi cho khách', 'success'); }, { testid: 'g2-obj-copy' })),
_o1c(r.best, 'g2-obj-use-')] }));
if (r.others.length) _o3.appendChild(h('details', { class: 'bds-sample', 'data-testid': 'g2-obj-others' }, h('summary', null, 'Kịch bản khác cho câu này (' + r.others.length + ')'),
...r.others.map(s => { const _ox = fill(s); return h('div', { 'data-testid': 'g2-obj-alt-' + s.id }, h('p', null, h('strong', null, s.title), ' · ', h('small', { class: 'bds-muted' }, O.statLine(stats[s.id]))), h('p', null, _ox.text),
h('div', { class: 'bds-row bds-wrap' }, K.button('Chép', async () => { await K.copy(_ox.text); K.toast('Đã chép', 'success'); }))); })));
}
}
nodes.push(K.card({ title: 'Khách vừa nói…', testid: 'g2-obj-bank', body: [
h('div', { class: 'bds-chips g2-objchips', role: 'group', 'aria-label': 'Câu từ chối' }, O.OBJECTIONS.map(o => h('button', { type: 'button', class: 'bds-chip' + (_on === o.id ? ' bds-on' : ''), 'aria-pressed': String(_on === o.id), 'data-testid': 'g2-obj-' + o.id, onclick: () => { _on = _on === o.id ? '' : o.id; _o13(); } }, o.label))),
K.field('Khách (tuỳ chọn)', G.customerSelect(customers, objCust, { 'data-testid': 'g2-obj-customer', 'aria-label': 'Khách', onchange: e => { objCust = e.target.value; _o13(); } }), 'Chỉ điền tên, dự án, ngân sách khi khách đã đồng ý lưu dữ liệu.'),
_on ? null : h('p', { class: 'bds-muted' }, 'Chọn câu khách vừa nói để xem kịch bản đang hiệu quả nhất.'),
_o3] }));
nodes.push(_oe());
nodes.push(h('div', { class: 'bds-chips' }, [['', 'Tất cả'], ...T.SCRIPT_CATS].map(([id, l]) => h('button', { type: 'button', class: 'bds-chip' + (cat === id ? ' bds-on' : ''), onclick: () => { cat = id; _o10(); } }, l))));
nodes.push(h('div', { class: 'bds-row bds-wrap' },
K.button('+ Kịch bản mới', () => _od(null, cfg), { kind: 'primary', testid: 'g2-script-add' }),
K.button('✨ AI soạn kịch bản cho câu từ chối mới', () => _o1(cfg, list, stats), { ai: 'g2_script', testid: 'g2-script-ai' }),
K.button('Soạn bằng Claude/Gemini', () => _o1(cfg, list, stats, true), { testid: 'g2-script-handoff', icon: 'external' })));
const _o4 = h('div', { class: 'bds-list', 'data-testid': 'g2-scripts' });
for (const s of O.rankScripts(list.filter(x => !cat || x.cat === cat), stats)) {
_o4.appendChild(K.card({ title: s.title, testid: 'g2-script-' + s.id, actions: [K.badge(scopeLabel[s.scope] + (s.edited ? ' · đã sửa' : ''), s.scope === 'mine' ? 'success' : 'muted')],
body: [h('p', null, s.text), s.tip ? h('p', { class: 'bds-muted' }, '💡 ' + s.tip) : null,
h('p', { class: 'bds-muted', 'data-testid': 'g2-script-stat-' + s.id }, '📊 ' + O.statLine(stats[s.id])),
h('div', { class: 'bds-row bds-wrap' },
K.button('Chép', async () => { await K.copy(s.text); K.toast('Đã chép', 'success'); }),
K.button('✏️ Sửa', () => _od(s, cfg), { testid: 'g2-script-edit-' + s.id }),
s.edited && _o19 ? K.button('Khôi phục', async () => { await K.setSetting('g2.scripts', T.resetTeamScript(cfg, s.id)); _o10(); }, { testid: 'g2-script-reset-' + s.id, icon: 'undo' }) : null,
s.scope === 'mine' ? K.button('Xoá', async () => {
if (!(await K.confirm({ title: 'Xoá kịch bản', text: 'Xoá kịch bản riêng "' + s.title + '"?', ok: 'Xoá', kind: 'danger', testid: 'g2-script-del-c' }))) return;
const d = C.pd(s.row.data); await K.put('objects', { ...s.row, data: JSON.stringify({ ...d, hidden: 1 }) }); _o10();
}, { kind: 'danger', testid: 'g2-script-del-' + s.id, icon: 'x' }) : null),
_o1c(s, 'g2-use-')] }));
}
nodes.push(h('p', { class: 'bds-muted' }, 'Bấm kết quả sau khi dùng để app xếp kịch bản hiệu quả lên trước' + (objCust ? ' (ghi cho khách đang chọn ở trên).' : '.') + ' Dưới ' + O.MIN_USES + ' lần dùng: chưa đủ dữ liệu.'));
nodes.push(_o4);
if (!_o19) nodes.push(h('p', { class: 'bds-muted' }, 'Bản sửa của anh/chị lưu thành kịch bản riêng; Quản trị/Quản lý sửa bản dùng chung của đội. Thống kê tính trên các lần dùng anh/chị xem được.'));
if (tab === 'scripts') body.replaceChildren(...nodes);
}
function _od(s, cfg, preset = {}) {
const _o19 = G.isStaff();
const title = h('input', { value: preset.title || (s ? s.title : ''), 'data-testid': 'g2-se-title' });
const text = h('textarea', { rows: 7, 'data-testid': 'g2-se-text' }, preset.text || (s ? s.text : ''));
const tip = h('textarea', { rows: 2, 'data-testid': 'g2-se-tip' }, preset.tip || (s ? s.tip || '' : ''));
const _o1b = h('input', { value: (s ? (s.triggers || []).join(', ') : preset.triggers || ''), placeholder: 'VD: giá cao, đắt quá' });
const _o6 = K.select(T.SCRIPT_CATS, s ? s.cat : 'objection');
const _oo = K.select([['', '— Không thuộc nhóm nào —'], ...O.OBJECTIONS.map(o => [o.id, o.label])], s ? O.objectionOf(s) : (preset.objection ?? _on), { 'data-testid': 'g2-se-objection' });
const warn = h('small', { class: 'bds-warn' });
const _o8 = () => { const _o2 = /(chỉ còn \d+ căn|cam kết lợi nhuận|chắc chắn tăng|sắp tăng giá|xin lỗi)/i.exec(text.value); warn.textContent = _o2 ? 'Câu "' + _o2[0] + '" trái nguyên tắc tư vấn trung thực – sửa trước khi lưu.' : ''; return !_o2; };
text.addEventListener('input', _o8);
let _ol;
const save = async () => {
if (!_o8()) return;
const _or = { title: title.value, text: text.value, tip: tip.value, cat: _o6.value, triggers: T.parseTriggers(_o1b.value), objection: _oo.value };
try {
if (_o19 && (!s || s.scope !== 'mine')) await K.setSetting('g2.scripts', T.saveTeamScript(cfg, s, _or));
else {
if (!_or.text.trim()) throw new Error('Nội dung kịch bản đang trống');
const row = s && s.scope === 'mine' ? s.row : { kind: 'g2_script' };
await K.put('objects', { ...row, kind: 'g2_script', name: _or.title.trim() || 'Kịch bản riêng', data: JSON.stringify({ cat: _or.cat, text: _or.text.trim(), tip: _or.tip.trim(), triggers: _or.triggers, from: s ? (s.scope === 'mine' ? C.pd(s.row.data).from || '' : s.id) : '', objection: _or.objection }) });
}
} catch (e) { K.toast(e.message, 'warn'); return; }
_ol.close(); K.toast('Đã lưu kịch bản', 'success'); _o10();
};
_ol = K.modal({ title: s ? 'Sửa kịch bản' : 'Kịch bản mới', testid: 'g2-script-editor', wide: true, body: [
K.field('Tên', title), K.field('Loại', _o6), K.field('Câu từ chối (kho xử lý từ chối)', _oo), K.field('Nội dung (dùng {ten}, {du_an}, {loai_can}, {so_tien}, {ten_toi}; Người quen: {ho}, {ban}, {toi}, {khu_vuc}, đoạn [[…]] tự bỏ khi ô trống)', text), warn,
K.field('Mẹo khi dùng', tip), K.field('Từ khoá nhận ra (cách nhau dấu phẩy)', _o1b),
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _ol.close()), K.button('Lưu', save, { kind: 'primary', testid: 'g2-se-save' }))] });
}
function _o1(cfg, list = [], stats = {}, handoffOnly = false) {
const _op = O.OBJECTIONS.find(o => o.id === _on);
const _oi = h('input', { value: _op ? _op.label : '', placeholder: 'VD: "Để hỏi ý kiến vợ đã"', 'data-testid': 'g2-ai-objection', 'aria-label': 'Câu từ chối của khách' });
const exBox = h('p', { class: 'bds-muted', 'data-testid': 'g2-ai-examples' });
const examples = () => O.examplesFor(_oi.value, list, stats);
const _o17 = () => {
const _og = examples();
exBox.textContent = _og.length ? 'AI học theo ' + _og.length + ' kịch bản cùng loại đang hiệu quả nhất: ' + _og.map(s => s.title + ' (' + O.statLine(stats[s.id]) + ')').join('; ') + '. Không gửi dữ liệu khách.'
: 'Chưa nhận ra loại từ chối – AI soạn không có ví dụ từ kho. Không gửi dữ liệu khách.';
};
_oi.addEventListener('input', _o17);
_o17();
let _ol;
const _ov = () => O.newScriptPrompt(_oi.value, { examples: examples(), stats, ethics: T.ETHICS });
const go = async () => {
if (!_oi.value.trim()) { K.toast('Nhập câu từ chối của khách trước', 'warn'); return; }
try {
const t = await G.aiText('zalo_draft', _ov(), true, 'g2_script');
let _oj = null; try { _oj = JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)); } catch { _oj = { text: t }; }
_ol.close(); _od(null, cfg, { title: _oj.title || _oi.value, text: _oj.text || '', tip: _oj.tip || '', triggers: C.fold(_oi.value), objection: O.objectionFromText(_oi.value) });
} catch (e) { if (!K.isAiCancel(e)) K.toast(e.message, 'warn'); }
};
_ol = K.modal({ title: 'AI soạn kịch bản', testid: 'g2-ai-modal', body: [K.field('Câu từ chối của khách', _oi), exBox, h('div', { class: 'bds-row bds-end' },
K.button('Làm bằng Claude/Gemini', () => { if (!_oi.value.trim()) { K.toast('Nhập câu từ chối của khách trước', 'warn'); return; } return G.handoff('zalo_draft', _ov()); }, { testid: 'g2-ai-handoff', icon: 'external' }),
handoffOnly ? null : K.button('Soạn bằng AI', go, { kind: 'primary', ai: 'g2_script', testid: 'g2-ai-go', icon: 'sparkle' }))] });
}
async function _ob() {
const { list } = await scripts();
if (tab !== 'warm') return;
const _o4 = h('div', { 'data-testid': 'g2-warm' });
body.replaceChildren(_o4);
await renderWarm(_o4, { G, K, ctx, library: list, state: _o1d, rerender: () => { if (tab === 'warm') _ob(); } });
}
async function _o11() {
const customers = await G.customers();
if (!readId || !customers.some(_o5 => _o5.id === readId)) readId = (customers[0] || {}).id || '';
body.appendChild(K.field('Khách', G.customerSelect(customers, readId, { 'data-testid': 'g2-read-customer', onchange: e => { readId = e.target.value; _o10(); } })));
body.appendChild(h('div', { class: 'g2-guard', 'data-testid': 'g2-guard' }, h('strong', null, 'Nguyên tắc'), h('ul', null, T.GUARDRAILS.map(g => h('li', null, g)), h('li', null, T.SENSITIVE_NOTE))));
const _o5 = customers.find(x => x.id === readId);
if (!_o5) { body.appendChild(K.empty('Chưa có khách.')); return; }
const _o9 = T.consentState(_o5);
if (!_o9.ok) {
body.appendChild(h('div', { class: 'g2-need', 'data-testid': 'g2-read-consent' }, h('p', null, _o9.text), K.button('Mở hồ sơ khách để ghi nhận đồng ý', () => K.openProfile(_o5.id), { kind: 'primary' })));
return;
}
const _o14 = C.g2Of(_o5).read || {};
const ans = { ...(_o14.answers || {}) };
const pri = new Set(ans.priorities || []);
const _oh = h('div', { class: 'bds-grid2' }, T.READ_FIELDS.map(f => K.field(f.label, K.select(f.opts, ans[f.id] || '', { 'data-testid': 'g2-read-' + f.id, onchange: e => { ans[f.id] = e.target.value; _oa(); } }))));
const _os = h('div', { class: 'g2-pills' }, T.PRIORITIES.map(([id, l]) => h('label', { class: 'g2-pill' }, h('input', { type: 'checkbox', checked: pri.has(id), 'data-testid': 'g2-read-pri-' + id, onchange: e => { if (e.target.checked) pri.add(id); else pri.delete(id); _oa(); } }), l)));
const out = h('div', { 'data-testid': 'g2-read-out' });
const _of = (await K.list('events')).filter(e => e.object_id === _o5.id && (e.type === 'note' || e.type === 'g2_zoa_in')).map(e => e.text).join('\n');
const _om = [_o5.note, _of].filter(Boolean).join('\n');
const _o15 = T.sensitiveHits(_om);
let discId = (G.crm.discOf(_o5) || {}).id || '';
const discSel = K.select([['', 'Chưa rõ'], ...G.crm.DISC.map(x => [x.id, x.id + ' – ' + x.label + ' (' + x.name + ')'])], discId, {
'data-testid': 'g2-read-disc',
onchange: async e => {
const fresh = await K.get('objects', _o5.id);
if (!fresh) return;
discId = e.target.value;
await K.put('objects', { ...fresh, data: G.crm.discPatch(fresh, discId) });
K.toast(discId ? 'Đã ghi tính cách ' + discId + ' (dùng chung với hồ sơ khách)' : 'Đã bỏ nhận xét tính cách', 'success');
_oa();
},
});
function _oa() {
ans.priorities = [...pri];
const r = T.readCustomer(_o5, ans, { money: K.money, projectName: K.projectName });
const _oc = G.crm.DISC.find(x => x.id === discId);
if (_oc) {
r.tips = r.tips.filter(t => t.why !== 'Hồ sơ còn trống');
r.tips.unshift({ text: _oc.tip, why: 'Tính cách ' + _oc.id + ' – ' + _oc.label });
}
out.innerHTML = '';
out.append(
K.card({ title: 'Hồ sơ nhu cầu', body: h('ul', { class: 'g2-parts' }, r.need.length ? r.need.map(n => h('li', null, h('span', null, n.text), h('small', null, n.why))) : h('li', null, 'Chưa có thông tin.')) }),
K.card({ title: 'Gợi ý cách tư vấn', testid: 'g2-read-tips', body: [h('ul', { class: 'g2-parts' }, r.tips.map(t => h('li', null, h('span', null, t.text), h('small', null, 'vì: ' + t.why)))),
r.docs.length ? h('p', null, h('strong', null, 'Tài liệu nên chuẩn bị: '), r.docs.join(' · ')) : null,
r.missing.length ? h('p', { class: 'bds-muted' }, 'Nên hỏi thêm: ' + r.missing.join(', ')) : null] }));
}
_oa();
body.append(...kids(_oh, K.field('Tính cách (D-I-S-C)', discSel, G.crm.DISC_NOTE), K.field('Khách ưu tiên', _os),
_o15.length ? h('p', { class: 'bds-warn', 'data-testid': 'g2-read-sensitive' }, 'Ghi chú có thể chứa dữ liệu nhạy cảm (' + _o15.join(', ') + ') – app KHÔNG dùng phần này; nên xoá khỏi ghi chú.') : null,
h('div', { class: 'bds-row bds-wrap' },
K.button('Lưu hồ sơ', async () => { ans.priorities = [...pri]; await G.patchG2(_o5.id, { read: { answers: ans, at: Date.now(), by: G.user().id, consent: 1 } }); K.toast('Đã lưu hồ sơ nhu cầu', 'success'); }, { kind: 'primary', testid: 'g2-read-save' }),
!gate(_o5, 'ai').ok ? h('small', { class: 'bds-muted', 'data-testid': 'g2-read-ai-off' }, 'Khách chưa đồng ý để AI xử lý thông tin – không gửi AI.') : K.button('✨ Gợi ý thêm bằng AI', async () => {
try { const t = await G.aiText('summarize', T.readPrompt(_o5, ans, _o15.length ? '' : _om, { money: K.money, projectName: K.projectName }), false, 'g2_read'); out.appendChild(K.card({ title: 'AI gợi ý (đọc kỹ, chỉ tham khảo)', body: h('p', { class: 'bds-pre' }, t) })); }
catch (e) { if (!K.isAiCancel(e)) K.toast(e.message, 'warn'); }
}, { ai: 'g2_read', testid: 'g2-read-ai', title: 'Gửi AI hồ sơ đã ẩn tên, số điện thoại, email' }),
K.button('Xoá hồ sơ Đọc khách', async () => {
if (!await K.confirm({ title: 'Xoá hồ sơ', text: 'Xoá hồ sơ nhu cầu và nhận xét tính cách D-I-S-C đã ghi của khách này (theo yêu cầu của khách)?', ok: 'Xoá', kind: 'danger' })) return;
const fresh = await K.get('objects', _o5.id);
if (fresh) await K.put('objects', { ...fresh, data: C.withG2({ data: G.crm.discPatch(fresh, '') }, { read: null }) });
_o10();
}, { kind: 'ghost', icon: 'x', testid: 'g2-read-erase' })),
out));
}
function _oe() { return h('div', { class: 'g2-guard' }, h('strong', null, 'Tư vấn trung thực'), h('ul', null, T.ETHICS.map(e => h('li', null, e)))); }
await _o10();
}
export default {
manifest: { id: 'g2_tuvan', title: 'Tư vấn: Trả lời & Kịch bản', icon: '🗣️', screen: 'customers', order: 220, version: '0.1.0', status: 'thu-nghiem', pack: 'care',
help: 'Gợi ý trả lời bình luận/tin nhắn, thư viện kịch bản tư vấn và xử lý từ chối (sửa được), Người quen – kịch bản hỏi thăm/chia sẻ thông tin + sổ người quen, Đọc khách – hồ sơ nhu cầu, chỉ khi khách đã đồng ý lưu dữ liệu cá nhân.' },
mount,
async selftest(ctx) {
const r = T.suggestReplies('giá bao nhiêu vậy, đắt quá');
if (!r.intents.length || !r.private) return { ok: false, details: 'Không gợi ý được câu trả lời mẫu' };
return g2Selftest(ctx, mount);
},
};

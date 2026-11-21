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
const _o13 = new URLSearchParams(location.hash.split('?')[1] || '');
let tab = _o13.get('tab') || 'reply';
let cat = '';
let readId = _o13.get('customer') || '';
let _os = _o13.get('objection') || '';
let objCust = '';
const _o1f = { text: '', channel: 'comment', project: '' };
const _o1l = {};
el.innerHTML = '';
const tabsBox = h('div');
const body = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-tuvan' }, G.headCore('Tư vấn: Trả lời & Kịch bản'), tabsBox, body));
async function scripts() {
const [cfg, mine] = await Promise.all([K.setting('g2.scripts', null), G.objectsOf('g2_script')]);
return { cfg, list: T.mergeScripts(cfg, mine.filter(o => !ctx.user || o.owner === ctx.user.id || o.created_by === ctx.user.id || !o.owner)) };
}
async function _o16() {
tabsBox.innerHTML = '';
tabsBox.appendChild(G.tabs([['reply', 'Gợi ý trả lời'], ['scripts', 'Kịch bản & từ chối'], ['warm', 'Người quen'], ['read', 'Đọc khách'], ['wingman', 'Wingman']], tab, t => { tab = t; _o16(); }, 'g2tv-tab'));
body.innerHTML = '';
if (tab === 'scripts') return _o19();
if (tab === 'read') return _o17();
if (tab === 'warm') return _oc();
if (tab === 'wingman') return renderWingman(body, { G, ctx });
return _o18();
}
async function _o18() {
const { list } = await scripts();
const _o1h = h('textarea', { rows: 4, placeholder: 'Dán bình luận hoặc tin nhắn của khách…', 'data-testid': 'g2-reply-in', oninput: e => { _o1f.text = e.target.value; } }, _o1f.text);
const _o8 = K.select([['comment', 'Bình luận công khai'], ['message', 'Tin nhắn riêng']], _o1f.channel, { 'aria-label': 'Kênh', onchange: e => { _o1f.channel = e.target.value; } });
const _oz = K.select([['', '— Dự án (tuỳ chọn) —'], ...K.projects().map(_ov => [_ov.id, _ov.name])], _o1f.project, { 'aria-label': 'Dự án', onchange: e => { _o1f.project = e.target.value; } });
const out = h('div', { 'data-testid': 'g2-reply-out' });
const _o2 = () => { try { return !!(ctx.ai && typeof ctx.ai.connected === 'function' && ctx.ai.connected()); } catch { return false; } };
const _o11 = () => (ctx.data && ctx.data.policies) || null;
const _ox = () => {
if (_o1f.project) return K.project(_o1f.project);
const _oq = ' ' + C.fold(_o1f.text).replace(/[^a-z0-9]+/g, ' ') + ' ';
const _oj = K.projects().find(_ov => { const _o1k = C.fold(_ov.name || '').replace(/[^a-z0-9]+/g, ' ').trim(); return _o1k.length > 4 && _oq.includes(' ' + _o1k + ' '); });
if (_oj) { _o1f.project = _oj.id; _oz.value = _oj.id; }
return _oj || null;
};
const aiPrompt = async r => T.replyPrompt(_o1f.text, { channel: _o1f.channel, project: K.projectName(_o1f.project), me: await K.me(), facts: r ? r.facts : T.projectFacts(K.project(_o1f.project), { policies: _o11() }), intents: r ? r.intents : [] });
let _on = null;
const _o1m = (_o1k, i, pre) => h('div', { class: 'g2-way', 'data-testid': pre + i },
h('p', null, h('strong', null, (i + 1) + '. ' + _o1k.title)), h('p', null, _o1k.say),
_o1k.prep ? h('p', { class: 'bds-muted' }, '📋 Chuẩn bị: ' + _o1k.prep) : null,
K.button('Chép', async () => { await K.copy(_o1k.say); K.toast('Đã chép', 'success'); }, { kind: 'ghost', small: true }));
function rebutBody(_ol, pre) {
return _ol.map((it, k) => h('div', { class: 'g2-rebut', 'data-testid': pre + k }, h('h4', null, '“' + it.label + '”'), ...it.ways.map((_o1k, i) => _o1m(_o1k, i, pre + k + '-'))));
}
function _o14(r) {
const aiBox = h('div', { 'data-testid': 'g2-rebut-ai' });
const _o1a = async (auto) => {
aiBox.replaceChildren(h('p', { class: 'bds-muted' }, 'AI đang viết phản biện theo đúng câu khách…'));
try {
const t = await G.aiText('zalo_draft', T.rebutPrompt(_o1f.text, { factsBlock: r.facts ? T.factsBlock(r.facts) : '', complaints: r.complaints, channel: _o1f.channel }), true, 'g2_reply');
if (_on !== r) return;
const _ol = T.parseRebut(t);
aiBox.replaceChildren(...(_ol ? [h('p', { class: 'bds-muted' }, '✨ AI viết theo câu khách – đọc kỹ, kiểm số liệu trước khi gửi'), ...rebutBody(_ol, 'g2-rebut-ai-')] : [h('p', { class: 'bds-muted' }, 'AI trả lời chưa đúng dạng – dùng các hướng bên dưới hoặc bấm lại.')]));
} catch (e) { aiBox.replaceChildren(); if (!K.isAiCancel(e) && !auto) K.toast(e.message || 'AI chưa trả lời', 'warn'); }
};
if (_o2()) setTimeout(() => _o1a(true), 0);
return K.card({ title: 'Phản biện lời chê', testid: 'g2-rebut', body: [
h('p', { class: 'bds-muted' }, 'Ghi nhận lo lắng trước, rồi phản biện bằng dữ kiện. Số liệu ngoài hồ sơ dự án: chuẩn bị và ghi nguồn trước khi nói. Không hứa lợi nhuận, không chê đối thủ.'),
aiBox, ...rebutBody(r.rebut, 'g2-rebut-'),
_o2() ? K.button('✨ AI viết lại phản biện', () => _o1a(false), { ai: 'g2_reply', testid: 'g2-rebut-ai-go' }) : h('p', { class: 'bds-muted' }, 'Bật AI (khoá Gemini ở Cài đặt › Kết nối) để AI viết phản biện theo đúng câu khách.')] });
}
async function _o3(r, pubTa, privTa, auto) {
if (!_o1f.text.trim()) { K.toast('Dán nội dung khách viết trước', 'warn'); return; }
try {
const t = await G.aiText('zalo_draft', await aiPrompt(r), true, 'g2_reply');
if (_on !== r) return;
const _om = T.parseReplyJson(t);
if (_om) { if (_om.public && pubTa) pubTa.value = _om.public; if (_om.private && privTa) privTa.value = _om.private; K.toast(auto ? 'AI đã đọc ý khách và viết câu trả lời – đọc kỹ trước khi gửi' : 'AI đã viết lại – đọc kỹ trước khi gửi', 'info'); }
else if (!auto) K.toast('AI trả lời chưa đúng dạng – bấm lại hoặc dùng "Làm bằng Claude/Gemini"', 'warn');
} catch (e) { if (!K.isAiCancel(e) && !auto) K.toast(e.message || 'AI chưa trả lời', 'warn'); }
}
const _o1d = r => {
_on = r;
out.innerHTML = '';
if (r.warnings.length) out.appendChild(h('div', { class: 'bds-warn', 'data-testid': 'g2-reply-warn' }, r.warnings.join(' ')));
out.appendChild(h('div', { class: 'g2-pills', 'data-testid': 'g2-intents' }, r.intents.length || (r.complaints && r.complaints.length) ? [...(r.complaints || []).map(_o6 => h('span', { class: 'g2-pill g2-pill-che' }, '👎 ' + _o6.label)), ...r.intents.map(i => h('span', { class: 'g2-pill' }, i.label))] : h('span', { class: 'bds-muted' }, _o2() ? 'Câu chưa rõ ý – AI đang đọc giúp…' : 'Câu chưa rõ ý – dùng câu giới thiệu dự án; bật AI (Gemini) trong Cài đặt để AI đọc ý khách')));
if (r.fromProject) out.appendChild(h('p', { class: 'bds-muted', 'data-testid': 'g2-reply-src' }, '📁 Trả lời theo hồ sơ dự án ' + r.facts.name + ' – kiểm tra lại số liệu trước khi gửi.'));
const pubTa = h('textarea', { rows: 3, 'data-testid': 'g2-reply-public' }, r.public);
const privTa = h('textarea', { rows: 6, 'data-testid': 'g2-reply-private' }, r.private);
if (_o1f.channel === 'comment' && !r.spam) out.appendChild(K.card({ title: 'Trả lời công khai', body: [pubTa, K.button('Chép', async () => { await K.copy(pubTa.value); K.toast('Đã chép', 'success'); }, { testid: 'g2-copy-public' })] }));
if (!r.spam) out.appendChild(K.card({ title: 'Tin nhắn riêng', body: [privTa, h('div', { class: 'bds-row bds-wrap' },
K.button('Chép', async () => { await K.copy(privTa.value); K.toast('Đã chép', 'success'); }, { testid: 'g2-copy-private' }),
K.button('✨ Viết lại bằng AI', () => _o3(r, pubTa, privTa, false), { ai: 'g2_reply', testid: 'g2-reply-ai' }),
K.button('Làm bằng Claude/Gemini', async () => { if (!_o1f.text.trim()) { K.toast('Dán nội dung khách viết trước', 'warn'); return; } return G.handoff('zalo_draft', await aiPrompt(r)); }, { icon: 'external' }))] }));
if (r.rebut && r.rebut.length) out.appendChild(_o14(r));
if (r.scripts.length) out.appendChild(K.card({ title: 'Kịch bản liên quan', body: r.scripts.map(s => h('details', { class: 'bds-sample' }, h('summary', null, s.title), h('p', null, s.text), s.tip ? h('p', { class: 'bds-muted' }, '💡 ' + s.tip) : null)) }));
};
body.append(K.field('Khách viết', _o1h), h('div', { class: 'bds-grid2' }, K.field('Ở đâu', _o8), K.field('Dự án', _oz)),
h('div', { class: 'bds-row' }, K.button('Gợi ý trả lời', () => {
if (!_o1f.text.trim()) { K.toast('Dán nội dung khách viết trước', 'warn'); return; }
const project = _ox();
const r = T.suggestReplies(_o1f.text, { scripts: list, channel: _o1f.channel, vars: { du_an: K.projectName(_o1f.project) }, project, projects: K.projects(), policies: _o11() });
_o1d(r);
if (!r.spam && !r.intents.length && !(r.rebut && r.rebut.length) && _o2()) _o3(r, out.querySelector('[data-testid="g2-reply-public"]'), out.querySelector('[data-testid="g2-reply-private"]'), true);
}, { kind: 'primary', testid: 'g2-reply-go', icon: 'sparkle' })), out, _of());
}
async function _oo() {
const [{ cfg, list }, uses, customers, me] = await Promise.all([scripts(), G.objectsOf(O.USE_KIND), G.customers(), K.me()]);
return { cfg, list, customers, me: me || {}, stats: O.useStats(O.parseUses(uses)) };
}
async function _o15(s, result) {
try {
const row = O.useRow({ scriptId: s.id, customerId: objCust, result, by: G.user().id || '', now: Date.now(), objection: O.objectionOf(s) }, await G.objectsOf(O.USE_KIND));
const _o0 = !!row.id;
await K.put('objects', row);
K.toast(_o0 ? 'Đã sửa kết quả lần dùng vừa rồi' : 'Đã ghi kết quả', 'success');
} catch (e) { K.toast(e.message, 'warn'); return; }
_o19();
}
const _o1j = (s, pre) => h('div', { class: 'bds-row bds-wrap', role: 'group', 'aria-label': 'Ghi kết quả sau khi dùng' },
O.RESULTS.map(([r, l]) => K.button(l, () => _o15(s, r), { kind: r === 'open' ? 'primary' : 'ghost', icon: r === 'open' ? 'check' : r === 'no' ? 'x' : 'help', testid: pre + r + (pre === 'g2-obj-use-' ? '' : '-' + s.id) })));
async function _o19() {
const { cfg, list, customers, me, stats } = await _oo();
if (tab !== 'scripts') return;
const _o1g = G.isStaff();
const scopeLabel = { default: 'mặc định', team: 'của đội', mine: 'của tôi' };
const nodes = [];
if (objCust && !customers.some(_o6 => _o6.id === objCust)) objCust = '';
const cust = customers.find(_o6 => _o6.id === objCust) || null;
const _o5 = h('div', { 'data-testid': 'g2-obj-out' });
const fill = s => O.personalize(s, cust, { projectName: K.projectName, money: K.money, me });
if (_os) {
const r = O.bestFor(_os, list, stats);
if (!r.best) _o5.appendChild(K.empty('Chưa có kịch bản cho câu này – bấm "AI soạn" hoặc "+ Kịch bản mới".'));
else {
const _ov = fill(r.best);
_o5.appendChild(K.card({ title: 'Nên trả lời: ' + r.best.title, testid: 'g2-obj-best', actions: [K.badge(scopeLabel[r.best.scope] || '', r.best.scope === 'mine' ? 'success' : 'muted')], body: [
h('p', { class: 'bds-pre', 'data-testid': 'g2-obj-text' }, _ov.text),
_ov.note ? h('p', { class: 'bds-muted', 'data-testid': 'g2-obj-note' }, (_ov.personal ? '👤 ' : '🔒 ') + _ov.note) : null,
h('p', { class: 'bds-muted', 'data-testid': 'g2-obj-stat' }, '📊 ' + O.statLine(stats[r.best.id])),
r.best.tip ? h('p', { class: 'bds-muted' }, '💡 ' + r.best.tip) : null,
h('div', { class: 'bds-row bds-wrap' }, K.button('Chép', async () => { await K.copy(_ov.text); K.toast('Đã chép – anh/chị tự gửi cho khách', 'success'); }, { testid: 'g2-obj-copy' })),
_o1j(r.best, 'g2-obj-use-')] }));
if (r.others.length) _o5.appendChild(h('details', { class: 'bds-sample', 'data-testid': 'g2-obj-others' }, h('summary', null, 'Kịch bản khác cho câu này (' + r.others.length + ')'),
...r.others.map(s => { const _o12 = fill(s); return h('div', { 'data-testid': 'g2-obj-alt-' + s.id }, h('p', null, h('strong', null, s.title), ' · ', h('small', { class: 'bds-muted' }, O.statLine(stats[s.id]))), h('p', null, _o12.text),
h('div', { class: 'bds-row bds-wrap' }, K.button('Chép', async () => { await K.copy(_o12.text); K.toast('Đã chép', 'success'); }))); })));
}
}
nodes.push(K.card({ title: 'Khách vừa nói…', testid: 'g2-obj-bank', body: [
h('div', { class: 'bds-chips g2-objchips', role: 'group', 'aria-label': 'Câu từ chối' }, O.OBJECTIONS.map(o => h('button', { type: 'button', class: 'bds-chip' + (_os === o.id ? ' bds-on' : ''), 'aria-pressed': String(_os === o.id), 'data-testid': 'g2-obj-' + o.id, onclick: () => { _os = _os === o.id ? '' : o.id; _o19(); } }, o.label))),
K.field('Khách (tuỳ chọn)', G.customerSelect(customers, objCust, { 'data-testid': 'g2-obj-customer', 'aria-label': 'Khách', onchange: e => { objCust = e.target.value; _o19(); } }), 'Chỉ điền tên, dự án, ngân sách khi khách đã đồng ý lưu dữ liệu.'),
_os ? null : h('p', { class: 'bds-muted' }, 'Chọn câu khách vừa nói để xem kịch bản đang hiệu quả nhất.'),
_o5] }));
nodes.push(_of());
nodes.push(h('div', { class: 'bds-chips' }, [['', 'Tất cả'], ...T.SCRIPT_CATS].map(([id, l]) => h('button', { type: 'button', class: 'bds-chip' + (cat === id ? ' bds-on' : ''), onclick: () => { cat = id; _o16(); } }, l))));
nodes.push(h('div', { class: 'bds-row bds-wrap' },
K.button('+ Kịch bản mới', () => _oe(null, cfg), { kind: 'primary', testid: 'g2-script-add' }),
K.button('✨ AI soạn kịch bản cho câu từ chối mới', () => _o1(cfg, list, stats), { ai: 'g2_script', testid: 'g2-script-ai' }),
K.button('Soạn bằng Claude/Gemini', () => _o1(cfg, list, stats, true), { testid: 'g2-script-handoff', icon: 'external' })));
const box = h('div', { class: 'bds-list', 'data-testid': 'g2-scripts' });
for (const s of O.rankScripts(list.filter(x => !cat || x.cat === cat), stats)) {
box.appendChild(K.card({ title: s.title, testid: 'g2-script-' + s.id, actions: [K.badge(scopeLabel[s.scope] + (s.edited ? ' · đã sửa' : ''), s.scope === 'mine' ? 'success' : 'muted')],
body: [h('p', null, s.text), s.tip ? h('p', { class: 'bds-muted' }, '💡 ' + s.tip) : null,
h('p', { class: 'bds-muted', 'data-testid': 'g2-script-stat-' + s.id }, '📊 ' + O.statLine(stats[s.id])),
h('div', { class: 'bds-row bds-wrap' },
K.button('Chép', async () => { await K.copy(s.text); K.toast('Đã chép', 'success'); }),
K.button('✏️ Sửa', () => _oe(s, cfg), { testid: 'g2-script-edit-' + s.id }),
s.edited && _o1g ? K.button('Khôi phục', async () => { await K.setSetting('g2.scripts', T.resetTeamScript(cfg, s.id)); _o16(); }, { testid: 'g2-script-reset-' + s.id, icon: 'undo' }) : null,
s.scope === 'mine' ? K.button('Xoá', async () => {
if (!(await K.confirm({ title: 'Xoá kịch bản', text: 'Xoá kịch bản riêng "' + s.title + '"?', ok: 'Xoá', kind: 'danger', testid: 'g2-script-del-c' }))) return;
const d = C.pd(s.row.data); await K.put('objects', { ...s.row, data: JSON.stringify({ ...d, hidden: 1 }) }); _o16();
}, { kind: 'danger', testid: 'g2-script-del-' + s.id, icon: 'x' }) : null),
_o1j(s, 'g2-use-')] }));
}
nodes.push(h('p', { class: 'bds-muted' }, 'Bấm kết quả sau khi dùng để app xếp kịch bản hiệu quả lên trước' + (objCust ? ' (ghi cho khách đang chọn ở trên).' : '.') + ' Dưới ' + O.MIN_USES + ' lần dùng: chưa đủ dữ liệu.'));
nodes.push(box);
if (!_o1g) nodes.push(h('p', { class: 'bds-muted' }, 'Bản sửa của anh/chị lưu thành kịch bản riêng; Quản trị/Quản lý sửa bản dùng chung của đội. Thống kê tính trên các lần dùng anh/chị xem được.'));
if (tab === 'scripts') body.replaceChildren(...nodes);
}
function _oe(s, cfg, preset = {}) {
const _o1g = G.isStaff();
const title = h('input', { value: preset.title || (s ? s.title : ''), 'data-testid': 'g2-se-title' });
const text = h('textarea', { rows: 7, 'data-testid': 'g2-se-text' }, preset.text || (s ? s.text : ''));
const tip = h('textarea', { rows: 2, 'data-testid': 'g2-se-tip' }, preset.tip || (s ? s.tip || '' : ''));
const _o1i = h('input', { value: (s ? (s.triggers || []).join(', ') : preset.triggers || ''), placeholder: 'VD: giá cao, đắt quá' });
const _o7 = K.select(T.SCRIPT_CATS, s ? s.cat : 'objection');
const _ot = K.select([['', '— Không thuộc nhóm nào —'], ...O.OBJECTIONS.map(o => [o.id, o.label])], s ? O.objectionOf(s) : (preset.objection ?? _os), { 'data-testid': 'g2-se-objection' });
const warn = h('small', { class: 'bds-warn' });
const _o9 = () => { const _o4 = /(chỉ còn \d+ căn|cam kết lợi nhuận|chắc chắn tăng|sắp tăng giá|xin lỗi)/i.exec(text.value); warn.textContent = _o4 ? 'Câu "' + _o4[0] + '" trái nguyên tắc tư vấn trung thực – sửa trước khi lưu.' : ''; return !_o4; };
text.addEventListener('input', _o9);
let _op;
const save = async () => {
if (!_o9()) return;
const _ow = { title: title.value, text: text.value, tip: tip.value, cat: _o7.value, triggers: T.parseTriggers(_o1i.value), objection: _ot.value };
try {
if (_o1g && (!s || s.scope !== 'mine')) await K.setSetting('g2.scripts', T.saveTeamScript(cfg, s, _ow));
else {
if (!_ow.text.trim()) throw new Error('Nội dung kịch bản đang trống');
const row = s && s.scope === 'mine' ? s.row : { kind: 'g2_script' };
await K.put('objects', { ...row, kind: 'g2_script', name: _ow.title.trim() || 'Kịch bản riêng', data: JSON.stringify({ cat: _ow.cat, text: _ow.text.trim(), tip: _ow.tip.trim(), triggers: _ow.triggers, from: s ? (s.scope === 'mine' ? C.pd(s.row.data).from || '' : s.id) : '', objection: _ow.objection }) });
}
} catch (e) { K.toast(e.message, 'warn'); return; }
_op.close(); K.toast('Đã lưu kịch bản', 'success'); _o16();
};
_op = K.modal({ title: s ? 'Sửa kịch bản' : 'Kịch bản mới', testid: 'g2-script-editor', wide: true, body: [
K.field('Tên', title), K.field('Loại', _o7), K.field('Câu từ chối (kho xử lý từ chối)', _ot), K.field('Nội dung (dùng {ten}, {du_an}, {loai_can}, {so_tien}, {ten_toi}; Người quen: {ho}, {ban}, {toi}, {khu_vuc}, đoạn [[…]] tự bỏ khi ô trống)', text), warn,
K.field('Mẹo khi dùng', tip), K.field('Từ khoá nhận ra (cách nhau dấu phẩy)', _o1i),
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _op.close()), K.button('Lưu', save, { kind: 'primary', testid: 'g2-se-save' }))] });
}
function _o1(cfg, list = [], stats = {}, handoffOnly = false) {
const _ou = O.OBJECTIONS.find(o => o.id === _os);
const _ok = h('input', { value: _ou ? _ou.label : '', placeholder: 'VD: "Để hỏi ý kiến vợ đã"', 'data-testid': 'g2-ai-objection', 'aria-label': 'Câu từ chối của khách' });
const exBox = h('p', { class: 'bds-muted', 'data-testid': 'g2-ai-examples' });
const examples = () => O.examplesFor(_ok.value, list, stats);
const _o1e = () => {
const _oh = examples();
exBox.textContent = _oh.length ? 'AI học theo ' + _oh.length + ' kịch bản cùng loại đang hiệu quả nhất: ' + _oh.map(s => s.title + ' (' + O.statLine(stats[s.id]) + ')').join('; ') + '. Không gửi dữ liệu khách.'
: 'Chưa nhận ra loại từ chối – AI soạn không có ví dụ từ kho. Không gửi dữ liệu khách.';
};
_ok.addEventListener('input', _o1e);
_o1e();
let _op;
const _o10 = () => O.newScriptPrompt(_ok.value, { examples: examples(), stats, ethics: T.ETHICS });
const go = async () => {
if (!_ok.value.trim()) { K.toast('Nhập câu từ chối của khách trước', 'warn'); return; }
try {
const t = await G.aiText('zalo_draft', _o10(), true, 'g2_script');
let _om = null; try { _om = JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)); } catch { _om = { text: t }; }
_op.close(); _oe(null, cfg, { title: _om.title || _ok.value, text: _om.text || '', tip: _om.tip || '', triggers: C.fold(_ok.value), objection: O.objectionFromText(_ok.value) });
} catch (e) { if (!K.isAiCancel(e)) K.toast(e.message, 'warn'); }
};
_op = K.modal({ title: 'AI soạn kịch bản', testid: 'g2-ai-modal', body: [K.field('Câu từ chối của khách', _ok), exBox, h('div', { class: 'bds-row bds-end' },
K.button('Làm bằng Claude/Gemini', () => { if (!_ok.value.trim()) { K.toast('Nhập câu từ chối của khách trước', 'warn'); return; } return G.handoff('zalo_draft', _o10()); }, { testid: 'g2-ai-handoff', icon: 'external' }),
handoffOnly ? null : K.button('Soạn bằng AI', go, { kind: 'primary', ai: 'g2_script', testid: 'g2-ai-go', icon: 'sparkle' }))] });
}
async function _oc() {
const { list } = await scripts();
if (tab !== 'warm') return;
const box = h('div', { 'data-testid': 'g2-warm' });
body.replaceChildren(box);
await renderWarm(box, { G, K, ctx, library: list, state: _o1l, rerender: () => { if (tab === 'warm') _oc(); } });
}
async function _o17() {
const customers = await G.customers();
if (!readId || !customers.some(_o6 => _o6.id === readId)) readId = (customers[0] || {}).id || '';
body.appendChild(K.field('Khách', G.customerSelect(customers, readId, { 'data-testid': 'g2-read-customer', onchange: e => { readId = e.target.value; _o16(); } })));
body.appendChild(h('div', { class: 'g2-guard', 'data-testid': 'g2-guard' }, h('strong', null, 'Nguyên tắc'), h('ul', null, T.GUARDRAILS.map(g => h('li', null, g)), h('li', null, T.SENSITIVE_NOTE))));
const _o6 = customers.find(x => x.id === readId);
if (!_o6) { body.appendChild(K.empty('Chưa có khách.')); return; }
const _oa = T.consentState(_o6);
if (!_oa.ok) {
body.appendChild(h('div', { class: 'g2-need', 'data-testid': 'g2-read-consent' }, h('p', null, _oa.text), K.button('Mở hồ sơ khách để ghi nhận đồng ý', () => K.openProfile(_o6.id), { kind: 'primary' })));
return;
}
const _o1b = C.g2Of(_o6).read || {};
const ans = { ...(_o1b.answers || {}) };
const pri = new Set(ans.priorities || []);
const _oi = h('div', { class: 'bds-grid2' }, T.READ_FIELDS.map(f => K.field(f.label, K.select(f.opts, ans[f.id] || '', { 'data-testid': 'g2-read-' + f.id, onchange: e => { ans[f.id] = e.target.value; _ob(); } }))));
const _oy = h('div', { class: 'g2-pills' }, T.PRIORITIES.map(([id, l]) => h('label', { class: 'g2-pill' }, h('input', { type: 'checkbox', checked: pri.has(id), 'data-testid': 'g2-read-pri-' + id, onchange: e => { if (e.target.checked) pri.add(id); else pri.delete(id); _ob(); } }), l)));
const out = h('div', { 'data-testid': 'g2-read-out' });
const _og = (await K.list('events')).filter(e => e.object_id === _o6.id && (e.type === 'note' || e.type === 'g2_zoa_in')).map(e => e.text).join('\n');
const _or = [_o6.note, _og].filter(Boolean).join('\n');
const _o1c = T.sensitiveHits(_or);
let discId = (G.crm.discOf(_o6) || {}).id || '';
const discSel = K.select([['', 'Chưa rõ'], ...G.crm.DISC.map(x => [x.id, x.id + ' – ' + x.label + ' (' + x.name + ')'])], discId, {
'data-testid': 'g2-read-disc',
onchange: async e => {
const fresh = await K.get('objects', _o6.id);
if (!fresh) return;
discId = e.target.value;
await K.put('objects', { ...fresh, data: G.crm.discPatch(fresh, discId) });
K.toast(discId ? 'Đã ghi tính cách ' + discId + ' (dùng chung với hồ sơ khách)' : 'Đã bỏ nhận xét tính cách', 'success');
_ob();
},
});
function _ob() {
ans.priorities = [...pri];
const r = T.readCustomer(_o6, ans, { money: K.money, projectName: K.projectName });
const _od = G.crm.DISC.find(x => x.id === discId);
if (_od) {
r.tips = r.tips.filter(t => t.why !== 'Hồ sơ còn trống');
r.tips.unshift({ text: _od.tip, why: 'Tính cách ' + _od.id + ' – ' + _od.label });
}
out.innerHTML = '';
out.append(
K.card({ title: 'Hồ sơ nhu cầu', body: h('ul', { class: 'g2-parts' }, r.need.length ? r.need.map(_oq => h('li', null, h('span', null, _oq.text), h('small', null, _oq.why))) : h('li', null, 'Chưa có thông tin.')) }),
K.card({ title: 'Gợi ý cách tư vấn', testid: 'g2-read-tips', body: [h('ul', { class: 'g2-parts' }, r.tips.map(t => h('li', null, h('span', null, t.text), h('small', null, 'vì: ' + t.why)))),
r.docs.length ? h('p', null, h('strong', null, 'Tài liệu nên chuẩn bị: '), r.docs.join(' · ')) : null,
r.missing.length ? h('p', { class: 'bds-muted' }, 'Nên hỏi thêm: ' + r.missing.join(', ')) : null] }));
}
_ob();
body.append(...kids(_oi, K.field('Tính cách (D-I-S-C)', discSel, G.crm.DISC_NOTE), K.field('Khách ưu tiên', _oy),
_o1c.length ? h('p', { class: 'bds-warn', 'data-testid': 'g2-read-sensitive' }, 'Ghi chú có thể chứa dữ liệu nhạy cảm (' + _o1c.join(', ') + ') – app KHÔNG dùng phần này; nên xoá khỏi ghi chú.') : null,
h('div', { class: 'bds-row bds-wrap' },
K.button('Lưu hồ sơ', async () => { ans.priorities = [...pri]; await G.patchG2(_o6.id, { read: { answers: ans, at: Date.now(), by: G.user().id, consent: 1 } }); K.toast('Đã lưu hồ sơ nhu cầu', 'success'); }, { kind: 'primary', testid: 'g2-read-save' }),
!gate(_o6, 'ai').ok ? h('small', { class: 'bds-muted', 'data-testid': 'g2-read-ai-off' }, 'Khách chưa đồng ý để AI xử lý thông tin – không gửi AI.') : K.button('✨ Gợi ý thêm bằng AI', async () => {
try { const t = await G.aiText('summarize', T.readPrompt(_o6, ans, _o1c.length ? '' : _or, { money: K.money, projectName: K.projectName }), false, 'g2_read'); out.appendChild(K.card({ title: 'AI gợi ý (đọc kỹ, chỉ tham khảo)', body: h('p', { class: 'bds-pre' }, t) })); }
catch (e) { if (!K.isAiCancel(e)) K.toast(e.message, 'warn'); }
}, { ai: 'g2_read', testid: 'g2-read-ai', title: 'Gửi AI hồ sơ đã ẩn tên, số điện thoại, email' }),
K.button('Xoá hồ sơ Đọc khách', async () => {
if (!await K.confirm({ title: 'Xoá hồ sơ', text: 'Xoá hồ sơ nhu cầu và nhận xét tính cách D-I-S-C đã ghi của khách này (theo yêu cầu của khách)?', ok: 'Xoá', kind: 'danger' })) return;
const fresh = await K.get('objects', _o6.id);
if (fresh) await K.put('objects', { ...fresh, data: C.withG2({ data: G.crm.discPatch(fresh, '') }, { read: null }) });
_o16();
}, { kind: 'ghost', icon: 'x', testid: 'g2-read-erase' })),
out));
}
function _of() { return h('div', { class: 'g2-guard' }, h('strong', null, 'Tư vấn trung thực'), h('ul', null, T.ETHICS.map(e => h('li', null, e)))); }
await _o16();
}
export default {
manifest: { id: 'g2_tuvan', title: 'Tư vấn: Trả lời & Kịch bản', icon: '🗣️', screen: 'home', order: 30, version: '0.1.0', status: 'ready', pack: 'core',
help: 'Gợi ý trả lời bình luận/tin nhắn, thư viện kịch bản tư vấn và xử lý từ chối (sửa được), Người quen – kịch bản hỏi thăm/chia sẻ thông tin + sổ người quen, Đọc khách – hồ sơ nhu cầu, chỉ khi khách đã đồng ý lưu dữ liệu cá nhân.' },
mount,
async selftest(ctx) {
const r = T.suggestReplies('giá bao nhiêu vậy, đắt quá');
if (!r.intents.length || !r.private) return { ok: false, details: 'Không gợi ý được câu trả lời mẫu' };
return g2Selftest(ctx, mount);
},
};

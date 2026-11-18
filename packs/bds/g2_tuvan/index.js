import { g2kit, h, g2Selftest } from '../g2_lib/ui.js';
import { kids } from '../_lib/kit.js';
import * as T from '../g2_lib/talk.js';
import * as C from '../g2_lib/core.js';
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
const _oo = new URLSearchParams(location.hash.split('?')[1] || '');
let tab = _oo.get('tab') || 'reply';
let cat = '';
let readId = _oo.get('customer') || '';
const _ox = { text: '', channel: 'comment', project: '' };
el.innerHTML = '';
const tabsBox = h('div');
const body = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-tuvan' }, G.head('Tư vấn: Trả lời & Kịch bản'), tabsBox, body));
async function scripts() {
const [cfg, mine] = await Promise.all([K.setting('g2.scripts', null), G.objectsOf('g2_script')]);
return { cfg, list: T.mergeScripts(cfg, mine.filter(o => !ctx.user || o.owner === ctx.user.id || o.created_by === ctx.user.id || !o.owner)) };
}
async function _oq() {
tabsBox.innerHTML = '';
tabsBox.appendChild(G.tabs([['reply', 'Gợi ý trả lời'], ['scripts', 'Kịch bản & từ chối'], ['read', 'Đọc khách']], tab, t => { tab = t; _oq(); }, 'g2tv-tab'));
body.innerHTML = '';
if (tab === 'scripts') return _ot();
if (tab === 'read') return _or();
return _os();
}
async function _os() {
const { list } = await scripts();
const _oz = h('textarea', { rows: 4, placeholder: 'Dán bình luận hoặc tin nhắn của khách…', 'data-testid': 'g2-reply-in', oninput: e => { _ox.text = e.target.value; } }, _ox.text);
const _o5 = K.select([['comment', 'Bình luận công khai'], ['message', 'Tin nhắn riêng']], _ox.channel, { 'aria-label': 'Kênh', onchange: e => { _ox.channel = e.target.value; } });
const _ok = K.select([['', '— Dự án (tuỳ chọn) —'], ...K.projects().map(p => [p.id, p.name])], _ox.project, { 'aria-label': 'Dự án', onchange: e => { _ox.project = e.target.value; } });
const out = h('div', { 'data-testid': 'g2-reply-out' });
const _ow = _op => {
out.innerHTML = '';
if (_op.warnings.length) out.appendChild(h('div', { class: 'bds-warn', 'data-testid': 'g2-reply-warn' }, _op.warnings.join(' ')));
out.appendChild(h('div', { class: 'g2-pills', 'data-testid': 'g2-intents' }, _op.intents.length ? _op.intents.map(i => h('span', { class: 'g2-pill' }, i.label)) : h('span', { class: 'bds-muted' }, 'Chưa nhận ra ý định cụ thể')));
const _on = h('textarea', { rows: 3, 'data-testid': 'g2-reply-public' }, _op.public);
const _ol = h('textarea', { rows: 6, 'data-testid': 'g2-reply-private' }, _op.private);
if (_ox.channel === 'comment' && !_op.spam) out.appendChild(K.card({ title: 'Trả lời công khai', body: [_on, K.button('Chép', async () => { await K.copy(_on.value); K.toast('Đã chép', 'success'); }, { testid: 'g2-copy-public' })] }));
if (!_op.spam) out.appendChild(K.card({ title: 'Tin nhắn riêng', body: [_ol, h('div', { class: 'bds-row bds-wrap' },
K.button('Chép', async () => { await K.copy(_ol.value); K.toast('Đã chép', 'success'); }, { testid: 'g2-copy-private' }),
K.button('✨ Viết lại bằng AI', async () => {
if (!_ox.text.trim()) { K.toast('Dán nội dung khách viết trước', 'warn'); return; }
try {
const me = await K.me();
const t = await G.aiText('zalo_draft', T.replyPrompt(_ox.text, { channel: _ox.channel, project: K.projectName(_ox.project), me }), true, 'g2_reply');
const _of = T.parseReplyJson(t);
if (_of) { if (_of.public) _on.value = _of.public; if (_of.private) _ol.value = _of.private; K.toast('AI đã viết lại – đọc kỹ trước khi gửi', 'info'); }
else K.toast('AI trả lời chưa đúng dạng – bấm lại hoặc dùng "Làm bằng Claude/Gemini"', 'warn');
} catch (e) { if (!K.isAiCancel(e)) K.toast(e.message || 'AI chưa trả lời', 'warn'); }
}, { ai: 'g2_reply', testid: 'g2-reply-ai' }),
K.button('Làm bằng Claude/Gemini', async () => { if (!_ox.text.trim()) { K.toast('Dán nội dung khách viết trước', 'warn'); return; } return G.handoff('zalo_draft', T.replyPrompt(_ox.text, { channel: _ox.channel, project: K.projectName(_ox.project), me: await K.me() })); }, { icon: 'external' }))] }));
if (_op.scripts.length) out.appendChild(K.card({ title: 'Kịch bản liên quan', body: _op.scripts.map(s => h('details', { class: 'bds-sample' }, h('summary', null, s.title), h('p', null, s.text), s.tip ? h('p', { class: 'bds-muted' }, '💡 ' + s.tip) : null)) }));
};
body.append(K.field('Khách viết', _oz), h('div', { class: 'bds-grid2' }, K.field('Ở đâu', _o5), K.field('Dự án', _ok)),
h('div', { class: 'bds-row' }, K.button('Gợi ý trả lời', () => {
if (!_ox.text.trim()) { K.toast('Dán nội dung khách viết trước', 'warn'); return; }
_ow(T.suggestReplies(_ox.text, { scripts: list, channel: _ox.channel, vars: { du_an: K.projectName(_ox.project) } }));
}, { kind: 'primary', testid: 'g2-reply-go', icon: 'sparkle' })), out, _ob());
}
async function _ot() {
const { cfg, list } = await scripts();
const _oy = G.isStaff();
body.appendChild(_ob());
body.appendChild(h('div', { class: 'bds-chips' }, [['', 'Tất cả'], ...T.SCRIPT_CATS].map(([id, l]) => h('button', { type: 'button', class: 'bds-chip' + (cat === id ? ' bds-on' : ''), onclick: () => { cat = id; _oq(); } }, l))));
body.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('+ Kịch bản mới', () => _oa(null, cfg), { kind: 'primary', testid: 'g2-script-add' }),
K.button('✨ AI soạn kịch bản từ chối mới', () => _o0(cfg), { ai: 'g2_script', testid: 'g2-script-ai' })));
const scopeLabel = { default: 'mặc định', team: 'của đội', mine: 'của tôi' };
const _o2 = h('div', { class: 'bds-list', 'data-testid': 'g2-scripts' });
for (const s of list.filter(x => !cat || x.cat === cat)) {
_o2.appendChild(K.card({ title: s.title, testid: 'g2-script-' + s.id, actions: [K.badge(scopeLabel[s.scope] + (s.edited ? ' · đã sửa' : ''), s.scope === 'mine' ? 'success' : 'muted')],
body: [h('p', null, s.text), s.tip ? h('p', { class: 'bds-muted' }, '💡 ' + s.tip) : null, h('div', { class: 'bds-row bds-wrap' },
K.button('Chép', async () => { await K.copy(s.text); K.toast('Đã chép', 'success'); }),
K.button('✏️ Sửa', () => _oa(s, cfg), { testid: 'g2-script-edit-' + s.id }),
s.edited && _oy ? K.button('Khôi phục', async () => { await K.setSetting('g2.scripts', T.resetTeamScript(cfg, s.id)); _oq(); }, { testid: 'g2-script-reset-' + s.id, icon: 'undo' }) : null,
s.scope === 'mine' ? K.button('Xoá', async () => {
if (!(await K.confirm({ title: 'Xoá kịch bản', text: 'Xoá kịch bản riêng "' + s.title + '"?', ok: 'Xoá', kind: 'danger', testid: 'g2-script-del-c' }))) return;
const d = C.pd(s.row.data); await K.put('objects', { ...s.row, data: JSON.stringify({ ...d, hidden: 1 }) }); _oq();
}, { kind: 'danger', testid: 'g2-script-del-' + s.id, icon: 'x' }) : null)] }));
}
body.appendChild(_o2);
if (!_oy) body.appendChild(h('p', { class: 'bds-muted' }, 'Bản sửa của anh/chị lưu thành kịch bản riêng; Quản trị/Quản lý sửa bản dùng chung của đội.'));
}
function _oa(s, cfg, preset = {}) {
const _oy = G.isStaff();
const title = h('input', { value: preset.title || (s ? s.title : ''), 'data-testid': 'g2-se-title' });
const text = h('textarea', { rows: 7, 'data-testid': 'g2-se-text' }, preset.text || (s ? s.text : ''));
const tip = h('textarea', { rows: 2, 'data-testid': 'g2-se-tip' }, preset.tip || (s ? s.tip || '' : ''));
const _o10 = h('input', { value: (s ? (s.triggers || []).join(', ') : preset.triggers || ''), placeholder: 'VD: giá cao, đắt quá' });
const _o4 = K.select(T.SCRIPT_CATS, s ? s.cat : 'objection');
const warn = h('small', { class: 'bds-warn' });
const _o6 = () => { const _o1 = /(chỉ còn \d+ căn|cam kết lợi nhuận|chắc chắn tăng|sắp tăng giá|xin lỗi)/i.exec(text.value); warn.textContent = _o1 ? 'Câu "' + _o1[0] + '" trái nguyên tắc tư vấn trung thực – sửa trước khi lưu.' : ''; return !_o1; };
text.addEventListener('input', _o6);
let _og;
const save = async () => {
if (!_o6()) return;
const _oi = { title: title.value, text: text.value, tip: tip.value, cat: _o4.value, triggers: T.parseTriggers(_o10.value) };
try {
if (_oy && (!s || s.scope !== 'mine')) await K.setSetting('g2.scripts', T.saveTeamScript(cfg, s, _oi));
else {
if (!_oi.text.trim()) throw new Error('Nội dung kịch bản đang trống');
const row = s && s.scope === 'mine' ? s.row : { kind: 'g2_script' };
await K.put('objects', { ...row, kind: 'g2_script', name: _oi.title.trim() || 'Kịch bản riêng', data: JSON.stringify({ cat: _oi.cat, text: _oi.text.trim(), tip: _oi.tip.trim(), triggers: _oi.triggers, from: s ? (s.scope === 'mine' ? s.from || '' : s.id) : '' }) });
}
} catch (e) { K.toast(e.message, 'warn'); return; }
_og.close(); K.toast('Đã lưu kịch bản', 'success'); _oq();
};
_og = K.modal({ title: s ? 'Sửa kịch bản' : 'Kịch bản mới', testid: 'g2-script-editor', wide: true, body: [
K.field('Tên', title), K.field('Loại', _o4), K.field('Nội dung (dùng {ten}, {du_an}, {loai_can}, {so_tien}, {ten_toi})', text), warn,
K.field('Mẹo khi dùng', tip), K.field('Từ khoá nhận ra (cách nhau dấu phẩy)', _o10),
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _og.close()), K.button('Lưu', save, { kind: 'primary', testid: 'g2-se-save' }))] });
}
function _o0(cfg) {
const _oe = h('input', { placeholder: 'VD: "Để hỏi ý kiến vợ đã"', 'data-testid': 'g2-ai-objection' });
let _og;
const _om = () => ['Bạn là chuyên gia đào tạo môi giới BĐS trung thực tại Việt Nam. Khách nói: "' + _oe.value.slice(0, 300) + '".',
'Viết kịch bản trả lời (dưới 100 chữ, xưng "em", gọi "anh/chị", có thể dùng {ten}, {du_an}) và 1 mẹo ngắn.', 'Luật: ' + T.ETHICS.join(' ') + ' Không dùng chữ "xin lỗi".',
'Trả về JSON: {"title": "…", "text": "…", "tip": "…"}'].join('\n');
const go = async () => {
if (!_oe.value.trim()) { K.toast('Nhập câu từ chối của khách trước', 'warn'); return; }
try {
const t = await G.aiText('zalo_draft', _om(), true, 'g2_script');
let _of = null; try { _of = JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1)); } catch { _of = { text: t }; }
_og.close(); _oa(null, cfg, { title: _of.title || _oe.value, text: _of.text || '', tip: _of.tip || '', triggers: C.fold(_oe.value) });
} catch (e) { if (!K.isAiCancel(e)) K.toast(e.message, 'warn'); }
};
_og = K.modal({ title: 'AI soạn kịch bản', body: [K.field('Câu từ chối của khách', _oe), h('div', { class: 'bds-row bds-end' },
K.button('Làm bằng Claude/Gemini', () => { if (!_oe.value.trim()) { K.toast('Nhập câu từ chối của khách trước', 'warn'); return; } return G.handoff('zalo_draft', _om()); }, { icon: 'external' }), K.button('Soạn bằng AI', go, { kind: 'primary', ai: 'g2_script', testid: 'g2-script-go', icon: 'sparkle' }))] });
}
async function _or() {
const customers = await G.customers();
if (!readId || !customers.some(_o3 => _o3.id === readId)) readId = (customers[0] || {}).id || '';
body.appendChild(K.field('Khách', G.customerSelect(customers, readId, { 'data-testid': 'g2-read-customer', onchange: e => { readId = e.target.value; _oq(); } })));
body.appendChild(h('div', { class: 'g2-guard', 'data-testid': 'g2-guard' }, h('strong', null, 'Nguyên tắc'), h('ul', null, T.GUARDRAILS.map(g => h('li', null, g)), h('li', null, T.SENSITIVE_NOTE))));
const _o3 = customers.find(x => x.id === readId);
if (!_o3) { body.appendChild(K.empty('Chưa có khách.')); return; }
const _o7 = T.consentState(_o3);
if (!_o7.ok) {
body.appendChild(h('div', { class: 'g2-need', 'data-testid': 'g2-read-consent' }, h('p', null, _o7.text), K.button('Mở hồ sơ khách để ghi nhận đồng ý', () => K.openProfile(_o3.id), { kind: 'primary' })));
return;
}
const _ou = C.g2Of(_o3).read || {};
const ans = { ...(_ou.answers || {}) };
const pri = new Set(ans.priorities || []);
const _od = h('div', { class: 'bds-grid2' }, T.READ_FIELDS.map(f => K.field(f.label, K.select(f.opts, ans[f.id] || '', { 'data-testid': 'g2-read-' + f.id, onchange: e => { ans[f.id] = e.target.value; _o8(); } }))));
const _oj = h('div', { class: 'g2-pills' }, T.PRIORITIES.map(([id, l]) => h('label', { class: 'g2-pill' }, h('input', { type: 'checkbox', checked: pri.has(id), 'data-testid': 'g2-read-pri-' + id, onchange: e => { if (e.target.checked) pri.add(id); else pri.delete(id); _o8(); } }), l)));
const out = h('div', { 'data-testid': 'g2-read-out' });
const _oc = (await K.list('events')).filter(e => e.object_id === _o3.id && (e.type === 'note' || e.type === 'g2_zoa_in')).map(e => e.text).join('\n');
const _oh = [_o3.note, _oc].filter(Boolean).join('\n');
const _ov = T.sensitiveHits(_oh);
let discId = (G.crm.discOf(_o3) || {}).id || '';
const discSel = K.select([['', 'Chưa rõ'], ...G.crm.DISC.map(x => [x.id, x.id + ' – ' + x.label + ' (' + x.name + ')'])], discId, {
'data-testid': 'g2-read-disc',
onchange: async e => {
const fresh = await K.get('objects', _o3.id);
if (!fresh) return;
discId = e.target.value;
await K.put('objects', { ...fresh, data: G.crm.discPatch(fresh, discId) });
K.toast(discId ? 'Đã ghi tính cách ' + discId + ' (dùng chung với hồ sơ khách)' : 'Đã bỏ nhận xét tính cách', 'success');
_o8();
},
});
function _o8() {
ans.priorities = [...pri];
const _op = T.readCustomer(_o3, ans, { money: K.money, projectName: K.projectName });
const _o9 = G.crm.DISC.find(x => x.id === discId);
if (_o9) {
_op.tips = _op.tips.filter(t => t.why !== 'Hồ sơ còn trống');
_op.tips.unshift({ text: _o9.tip, why: 'Tính cách ' + _o9.id + ' – ' + _o9.label });
}
out.innerHTML = '';
out.append(
K.card({ title: 'Hồ sơ nhu cầu', body: h('ul', { class: 'g2-parts' }, _op.need.length ? _op.need.map(n => h('li', null, h('span', null, n.text), h('small', null, n.why))) : h('li', null, 'Chưa có thông tin.')) }),
K.card({ title: 'Gợi ý cách tư vấn', testid: 'g2-read-tips', body: [h('ul', { class: 'g2-parts' }, _op.tips.map(t => h('li', null, h('span', null, t.text), h('small', null, 'vì: ' + t.why)))),
_op.docs.length ? h('p', null, h('strong', null, 'Tài liệu nên chuẩn bị: '), _op.docs.join(' · ')) : null,
_op.missing.length ? h('p', { class: 'bds-muted' }, 'Nên hỏi thêm: ' + _op.missing.join(', ')) : null] }));
}
_o8();
body.append(...kids(_od, K.field('Tính cách (D-I-S-C)', discSel, G.crm.DISC_NOTE), K.field('Khách ưu tiên', _oj),
_ov.length ? h('p', { class: 'bds-warn', 'data-testid': 'g2-read-sensitive' }, 'Ghi chú có thể chứa dữ liệu nhạy cảm (' + _ov.join(', ') + ') – app KHÔNG dùng phần này; nên xoá khỏi ghi chú.') : null,
h('div', { class: 'bds-row bds-wrap' },
K.button('Lưu hồ sơ', async () => { ans.priorities = [...pri]; await G.patchG2(_o3.id, { read: { answers: ans, at: Date.now(), by: G.user().id, consent: 1 } }); K.toast('Đã lưu hồ sơ nhu cầu', 'success'); }, { kind: 'primary', testid: 'g2-read-save' }),
K.button('✨ Gợi ý thêm bằng AI', async () => {
try { const t = await G.aiText('summarize', T.readPrompt(_o3, ans, _ov.length ? '' : _oh, { money: K.money, projectName: K.projectName }), false, 'g2_read'); out.appendChild(K.card({ title: 'AI gợi ý (đọc kỹ, chỉ tham khảo)', body: h('p', { class: 'bds-pre' }, t) })); }
catch (e) { if (!K.isAiCancel(e)) K.toast(e.message, 'warn'); }
}, { ai: 'g2_read', testid: 'g2-read-ai', title: 'Gửi AI hồ sơ đã ẩn tên, số điện thoại, email' }),
K.button('Xoá hồ sơ Đọc khách', async () => {
if (!await K.confirm({ title: 'Xoá hồ sơ', text: 'Xoá hồ sơ nhu cầu và nhận xét tính cách D-I-S-C đã ghi của khách này (theo yêu cầu của khách)?', ok: 'Xoá', kind: 'danger' })) return;
const fresh = await K.get('objects', _o3.id);
if (fresh) await K.put('objects', { ...fresh, data: C.withG2({ data: G.crm.discPatch(fresh, '') }, { read: null }) });
_oq();
}, { kind: 'ghost', icon: 'x', testid: 'g2-read-erase' })),
out));
}
function _ob() { return h('div', { class: 'g2-guard' }, h('strong', null, 'Tư vấn trung thực'), h('ul', null, T.ETHICS.map(e => h('li', null, e)))); }
await _oq();
}
export default {
manifest: { id: 'g2_tuvan', title: 'Tư vấn: Trả lời & Kịch bản', icon: '🗣️', screen: 'customers', order: 220, version: '0.1.0', status: 'thu-nghiem', pack: 'care',
help: 'Gợi ý trả lời bình luận/tin nhắn, thư viện kịch bản tư vấn và xử lý từ chối (sửa được), Đọc khách – hồ sơ nhu cầu, chỉ khi khách đã đồng ý lưu dữ liệu cá nhân.' },
mount,
async selftest(ctx) {
const _op = T.suggestReplies('giá bao nhiêu vậy, đắt quá');
if (!_op.intents.length || !_op.private) return { ok: false, details: 'Không gợi ý được câu trả lời mẫu' };
return g2Selftest(ctx, mount);
},
};

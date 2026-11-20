import { h } from '../g2_lib/ui.js';
import * as W from '../g2_lib/warm.js';
import { givenName } from '../_lib/crm.js';
const _o0 = 'bds:g2.warm.daily';
const _oo = () => { try { return W.clampDaily(localStorage.getItem(_o0) ?? W.DAILY_DEFAULT); } catch { return W.DAILY_DEFAULT; } };
const _or = _og => { try { localStorage.setItem(_o0, String(_og)); } catch { } };
export async function renderWarm(box, env) {
const { G, K, ctx, library, rerender } = env;
const _ou = env.state;
const uid = G.user().id || '';
const rows = (await G.objectsOf(W.KIND)).filter(o => !ctx.user || !o.owner || o.owner === uid || o.created_by === uid);
const people = W.parse(rows);
const me = await K.me();
if (_ou.personId && !people.some(_oh => _oh.id === _ou.personId)) _ou.personId = '';
const _oq = async (_oh, data, rowPatch = {}) => {
const fresh = (await K.get('objects', _oh.id)) || _oh.row;
return K.put('objects', { ...fresh, ...rowPatch, data: JSON.stringify(W.dataOf(data)) });
};
const _of = async (_oh, scene, v) => {
const fresh = W.parse([(await K.get('objects', _oh.id)) || _oh.row])[0] || _oh;
await _oq(_oh, W.act(fresh, 'sent', Date.now(), { scene, v }));
};
const _o5 = async (text, _oh) => {
if (!text.trim()) { K.toast('Chưa có nội dung tin', 'warn'); return false; }
await K.copy(text);
if (_oh && _oh.phone) { try { window.open(K.zaloLink(_oh.phone), '_blank', 'noopener'); } catch { } }
K.toast(_oh && _oh.phone ? 'Đã chép tin và mở Zalo – anh/chị tự dán rồi bấm Gửi' : 'Đã chép tin – mở Zalo, dán cho người nhận rồi bấm Gửi', 'success');
return true;
};
const projects = K.projects().map(_oh => _oh.name).filter(Boolean);
const dl = h('datalist', { id: 'g2-warm-projects' }, projects.map(_og => h('option', { value: _og })));
const _od = (key, attrs) => h('input', { value: _ou[key] || '', ...attrs, oninput: e => { _ou[key] = e.target.value; _ou.idx = 0; _o7(); } });
const ten = _od('ten', { placeholder: 'VD: Hà, Tâm', 'data-testid': 'g2-warm-ten', 'aria-label': 'Tên người nhận' });
const _o3 = _od('khu_vuc', { placeholder: 'VD: Long Biên (để trống cũng được)', 'data-testid': 'g2-warm-area', 'aria-label': 'Khu vực quen thuộc' });
const proj = _od('du_an', { list: 'g2-warm-projects', placeholder: 'Chọn dự án trong app hoặc tự gõ', 'data-testid': 'g2-warm-project', 'aria-label': 'Dự án / mảng đang làm' });
const _op = K.select([['', 'Theo tình huống'], ...W.RELS.map(_on => [_on.id, _on.label])], _ou.rel || '', { 'data-testid': 'g2-warm-rel', 'aria-label': 'Mối quan hệ', onchange: e => { _ou.rel = e.target.value; _ou.goi = ''; _ob.value = ''; _o7(); } });
const _ob = K.select([['', 'Theo mối quan hệ'], ...W.GOI.map(g => [g, g])], _ou.goi || '', { 'data-testid': 'g2-warm-goi', 'aria-label': 'Gọi người nhận là', onchange: e => { _ou.goi = e.target.value; _o7(); } });
const _oj = K.select([['', '— Không chọn (tự điền) —'], ...people.map(_oh => [_oh.id, _oh.name + ' · ' + W.relLabel(_oh.rel)])], _ou.personId || '', { 'data-testid': 'g2-warm-person', 'aria-label': 'Người nhận trong sổ', onchange: e => _ok(e.target.value) });
const ta = h('textarea', { rows: 7, 'data-testid': 'g2-warm-text', 'aria-label': 'Nội dung tin' });
const vLabel = h('small', { class: 'bds-muted', 'data-testid': 'g2-warm-vlabel' });
const aiNote = h('small', { class: 'bds-muted', role: 'status', 'data-testid': 'g2-warm-ai-status' });
_ou.extra = _ou.extra || {};
function _ok(id, scene) {
_ou.personId = id;
const _oh = people.find(x => x.id === id);
if (_oh) {
_ou.ten = givenName(_oh.name); _ou.rel = _oh.rel; _ou.goi = _oh.goi; _ou.khu_vuc = _oh.khu_vuc || _ou.khu_vuc || '';
if (scene) _ou.scene = scene;
_ou.idx = W.nextVariant(_ou.scene, _oh.history, W.templates(_ou.scene, library).length);
}
ten.value = _ou.ten || ''; _op.value = _ou.rel || ''; _ob.value = _ou.goi || ''; _o3.value = _ou.khu_vuc || ''; _oj.value = id || '';
_o8(); _o7();
}
const vars = () => ({ ten: _ou.ten, rel: _ou.rel || (W.RELS.some(_on => _on.id === _ou.scene) ? _ou.scene : 'khac'), goi: _ou.goi, khu_vuc: _ou.khu_vuc, du_an: _ou.du_an, ten_toi: me.name });
const list = () => [...new Set(W.variants(_ou.scene, vars(), library).concat((_ou.extra[_ou.scene] || []).map(t => W.compose(t, vars()))))];
function _o7() {
const _o2 = list();
if (!_o2.length) { ta.value = ''; vLabel.textContent = ''; _oz.style.display = _ou.scene === 'story' ? 'none' : ''; return; }
_ou.idx = ((_ou.idx || 0) % _o2.length + _o2.length) % _o2.length;
ta.value = _o2[_ou.idx];
_oz.style.display = _ou.scene === 'story' ? 'none' : '';
vLabel.textContent = 'Biến thể ' + (_ou.idx + 1) + '/' + _o2.length + ' · ' + W.sceneOf(_ou.scene).tip;
}
const sceneBox = h('div', { class: 'bds-chips g2-objchips', role: 'group', 'aria-label': 'Tình huống' });
function _o8() {
sceneBox.replaceChildren(...W.SCENES.map(s => h('button', { type: 'button', class: 'bds-chip' + (_ou.scene === s.id ? ' bds-on' : ''), 'aria-pressed': String(_ou.scene === s.id), 'data-testid': 'g2-warm-scene-' + s.id,
onclick: () => { _ou.scene = s.id; const _oh = people.find(x => x.id === _ou.personId); _ou.idx = _oh ? W.nextVariant(s.id, _oh.history, W.templates(s.id, library).length) : 0; _o8(); _o7(); } }, s.title)));
}
const _oz = K.button('Chép & mở Zalo', async () => {
const _oh = people.find(x => x.id === _ou.personId);
if (!(await _o5(ta.value, _oh))) return;
if (_oh) { await _of(_oh, _ou.scene, _ou.idx); rerender(); }
}, { kind: 'primary', testid: 'g2-warm-zalo' });
_ou.scene = _ou.scene || 'ban_than';
_o8();
_o7();
const _o1 = async handoffOnly => {
const prompt = W.aiPrompt(_ou.scene, { rel: vars().rel });
if (handoffOnly) return G.handoff('zalo_draft', prompt);
aiNote.textContent = 'AI đang viết…';
try {
const _oc = W.parseAiVariants(await G.aiText('zalo_draft', prompt, true));
if (!_oc.length) { aiNote.textContent = 'AI chưa đưa được biến thể phù hợp (đã bỏ câu gây áp lực).'; return; }
const _o4 = list().length;
_ou.extra[_ou.scene] = (_ou.extra[_ou.scene] || []).concat(_oc);
_ou.idx = _o4; _o7();
aiNote.textContent = 'AI thêm ' + _oc.length + ' biến thể – đọc lại trước khi gửi.';
} catch (e) { aiNote.textContent = K.isAiCancel(e) ? '' : (e.message || 'AI chưa trả lời'); }
};
const _oa = K.card({ title: 'Bộ tạo tin người quen', testid: 'g2-warm-gen', body: [
h('p', { class: 'bds-muted' }, 'Kiểu hỏi thăm, chia sẻ thông tin – không chào bán thẳng. Mỗi tình huống có nhiều biến thể để không đọc vẹt.'),
sceneBox, dl,
K.field('Người nhận trong sổ (tuỳ chọn)', _oj),
h('div', { class: 'bds-grid2' }, K.field('Tên người nhận', ten), K.field('Mối quan hệ', _op)),
h('div', { class: 'bds-grid2' }, K.field('Gọi người nhận là', _ob), K.field('Khu vực quen thuộc', _o3)),
K.field('Dự án / mảng đang làm', proj, 'Chỉ ghi dự án/mảng anh/chị thật sự đang làm. Để trống thì tin dùng câu chung, không nêu tên dự án.'),
ta, vLabel,
h('div', { class: 'bds-row bds-wrap' },
K.button('Biến thể khác', () => { _ou.idx = (_ou.idx || 0) + 1; _o7(); }, { testid: 'g2-warm-next' }),
K.button('Chép', async () => { await K.copy(ta.value); K.toast('Đã chép – anh/chị tự gửi', 'success'); }, { testid: 'g2-warm-copy' }),
_oz),
h('div', { class: 'bds-row bds-wrap' },
K.button('✨ AI viết thêm biến thể', () => _o1(false), { ai: 'zalo_draft', testid: 'g2-warm-ai' }),
K.button('Làm bằng Claude/Gemini', () => _o1(true), { testid: 'g2-warm-handoff', icon: 'external' })),
aiNote,
h('small', { class: 'bds-muted' }, 'AI chỉ nhận tình huống và mối quan hệ – không nhận tên, số điện thoại, ghi chú người nhận. Sửa mẫu dùng chung: tab "Kịch bản & từ chối" › Người quen.')] });
const daily = _oo();
const _ol = W.todayPicks(rows, daily, Date.now());
const _o6 = h('input', { type: 'number', min: 1, max: 20, value: daily, inputmode: 'numeric', 'data-testid': 'g2-warm-daily', 'aria-label': 'Số người mỗi ngày', style: 'max-width:90px',
onchange: e => { _or(W.clampDaily(e.target.value)); rerender(); } });
const today = K.card({ title: 'Hôm nay nhắn ' + daily + ' người', testid: 'g2-warm-today', body: [
h('div', { class: 'bds-row bds-wrap' }, K.field('Số người mỗi ngày', _o6)),
_ol.length ? h('div', { class: 'bds-list', 'data-testid': 'g2-warm-picks' }, _ol.map(_oh => {
const _os = W.sceneOf(_oh.scene);
const _oy = W.templates(_os.id, library);
const v = W.nextVariant(_os.id, _oh.history, _oy.length);
const text = W.compose(_oy[v], { ten: givenName(_oh.name), rel: _oh.rel, goi: _oh.goi, khu_vuc: _oh.khu_vuc, du_an: _ou.du_an, ten_toi: me.name });
return h('div', { class: 'g2-comment', 'data-testid': 'g2-warm-pick-' + _oh.id },
h('strong', null, _oh.name), h('small', null, W.relLabel(_oh.rel) + ' · ' + _oh.why),
h('div', { class: 'bds-row bds-wrap' },
K.button('Chép & mở Zalo', async () => { if (await _o5(text, _oh)) { await _of(_oh, _os.id, v); rerender(); } }, { kind: 'primary', testid: 'g2-warm-pick-zalo-' + _oh.id }),
K.button('Soạn lại', () => { _ok(_oh.id, _os.id); _oa.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, { testid: 'g2-warm-pick-edit-' + _oh.id })));
})) : h('p', { class: 'bds-muted', 'data-testid': 'g2-warm-picks-empty' }, people.length ? 'Hôm nay không còn ai cần nhắn. Người đã nhắn chỉ được gợi ý nhắn lại 1 lần sau ' + W.NUDGE_DAYS + ' ngày im lặng.' : 'Thêm người quen vào sổ để app gợi ý mỗi ngày.')] });
_ou.filter = _ou.filter || '';
const _ot = people.filter(_oh => !_ou.filter || _oh.status === _ou.filter);
const counts = Object.fromEntries(W.STATUSES.map(([id]) => [id, people.filter(_oh => _oh.status === id).length]));
const bookList = h('div', { class: 'bds-list', 'data-testid': 'g2-warm-list' }, _ot.length ? _ot.map(_oh => _oi(_oh)) : K.empty(people.length ? 'Không có ai ở trạng thái này.' : 'Chưa có người quen nào.'));
const book = K.card({ title: 'Sổ người quen (' + people.length + ')', testid: 'g2-warm-book', actions: [K.button('+ Thêm người quen', () => _o9(null), { kind: 'primary', testid: 'g2-warm-add' })], body: [
h('div', { class: 'bds-chips', role: 'group', 'aria-label': 'Lọc trạng thái' }, [['', 'Tất cả (' + people.length + ')'], ...W.STATUSES.map(([id, l]) => [id, l + ' (' + counts[id] + ')'])].map(([id, l]) =>
h('button', { type: 'button', class: 'bds-chip' + (_ou.filter === id ? ' bds-on' : ''), 'data-testid': 'g2-warm-filter-' + (id || 'all'), onclick: () => { _ou.filter = id; rerender(); } }, l))),
bookList,
h('small', { class: 'bds-muted' }, 'Người quen là dữ liệu cá nhân: chỉ ghi điều cần để nhắn hỏi thăm; app không gửi AI và không tự gửi tin. Chỉ chuyển thành khách khi họ đồng ý để lại liên hệ.')] });
function _oi(_oh) {
const _ox = { chua_nhan: 'muted', da_nhan: 'info', phan_hoi: 'success', gioi_thieu: 'success' }[_oh.status];
const _ov = K.select(W.STATUSES, _oh.status, { 'data-testid': 'g2-warm-status-' + _oh.id, 'aria-label': 'Trạng thái',
onchange: async e => { await _oq(_oh, W.act(_oh, 'set', Date.now(), { status: e.target.value })); rerender(); } });
const _om = _oh.customer_id ? null : W.customerPrefill(_oh);
return K.card({ title: _oh.name, testid: 'g2-warm-p-' + _oh.id, actions: [K.badge(W.statusLabel(_oh.status), _ox)], body: [
h('p', { class: 'bds-muted' }, W.relLabel(_oh.rel) + (_oh.khu_vuc ? ' · ' + _oh.khu_vuc : '') + ' · ' + (_oh.sent_at ? 'Đã nhắn ' + G.dt(_oh.sent_at) : 'Chưa nhắn lần nào') + (_oh.followups ? ' · đã nhắn lại 1 lần' : '')),
_oh.note ? h('p', null, _oh.note) : null,
h('div', { class: 'bds-row bds-wrap' },
K.field('Trạng thái', _ov),
K.button('Soạn tin', () => { _ok(_oh.id, W.canNudge(_oh) ? 'nhac_lai' : (W.RELS.find(_on => _on.id === _oh.rel) || {}).scene); _oa.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, { testid: 'g2-warm-compose-' + _oh.id }),
_oh.status === 'chua_nhan' || _oh.status === 'da_nhan' ? K.button('Có phản hồi', async () => { await _oq(_oh, W.act(_oh, 'reply', Date.now())); rerender(); }, { testid: 'g2-warm-reply-' + _oh.id }) : null,
_oh.status !== 'gioi_thieu' ? K.button('Đã giới thiệu', async () => { await _oq(_oh, W.act(_oh, 'referred', Date.now())); rerender(); }, { testid: 'g2-warm-ref-' + _oh.id }) : null,
_om && _om.ok ? K.button('Chuyển thành khách', () => _ow(_oh), { kind: 'primary', testid: 'g2-warm-tocust-' + _oh.id }) : null,
_oh.customer_id ? K.button('Mở hồ sơ khách', () => K.openProfile(_oh.customer_id), { testid: 'g2-warm-open-' + _oh.id }) : null,
K.button('✎ Sửa', () => _o9(_oh), { testid: 'g2-warm-edit-' + _oh.id }),
K.button('Xoá', async () => {
if (!(await K.confirm({ title: 'Xoá người quen', text: 'Xoá "' + _oh.name + '" khỏi sổ người quen?', ok: 'Xoá', kind: 'danger', testid: 'g2-warm-del-c' }))) return;
const fresh = (await K.get('objects', _oh.id)) || _oh.row; await K.put('objects', { ...fresh, deleted: 1 }); rerender();
}, { kind: 'danger', testid: 'g2-warm-del-' + _oh.id }))] });
}
async function _ow(_oh) {
const _on = W.customerPrefill(_oh);
if (!_on.ok) { K.toast(_on.reason, 'warn'); return; }
if (!(await K.confirm({ title: 'Chuyển thành khách', text: _oh.name + ' đã đồng ý để lại liên hệ để anh/chị tư vấn chưa? Chỉ chuyển khi họ đồng ý – trong hồ sơ khách anh/chị vẫn cần tick ô đồng ý.', ok: 'Họ đã đồng ý', testid: 'g2-warm-tocust-c' }))) return;
const _oe = await import('../customers/index.js');
await _oe.openForm(ctx, null, { prefill: _on.row, onSaved: async row => {
const fresh = W.parse([(await K.get('objects', _oh.id)) || _oh.row])[0] || _oh;
await _oq(_oh, { ...fresh, customer_id: row.id });
K.toast('Đã chuyển ' + _oh.name + ' thành khách (nguồn Người quen)', 'success');
rerender();
} });
}
function _o9(_oh) {
const name = h('input', { value: _oh ? _oh.name : '', 'data-testid': 'g2-wf-name', autocomplete: 'off' });
const rel = K.select(W.RELS.map(_on => [_on.id, _on.label]), _oh ? _oh.rel : 'ban_than', { 'data-testid': 'g2-wf-rel' });
const goi = K.select([['', 'Theo mối quan hệ'], ...W.GOI.map(g => [g, g])], _oh ? _oh.goi : '', { 'data-testid': 'g2-wf-goi' });
const phone = h('input', { type: 'tel', inputmode: 'tel', value: _oh ? _oh.phone : '', 'data-testid': 'g2-wf-phone', placeholder: 'Tuỳ chọn – để mở Zalo' });
const kv = h('input', { value: _oh ? _oh.khu_vuc : '', 'data-testid': 'g2-wf-area' });
const note = h('textarea', { rows: 3, 'data-testid': 'g2-wf-note', placeholder: 'VD: bạn cấp 3, mới chuyển nhà' }, _oh ? _oh.note : '');
const err = h('small', { class: 'bds-warn', role: 'alert' });
let _oe;
const ok = async () => {
const _og = name.value.trim();
if (!_og) { err.textContent = 'Nhập tên người quen.'; return; }
const data = W.dataOf({ ...(_oh || {}), rel: rel.value, goi: goi.value, phone: phone.value.trim(), khu_vuc: kv.value.trim(), note: note.value.trim() });
if (_oh) await _oq(_oh, data, { name: _og });
else await K.put('objects', { kind: W.KIND, name: _og.slice(0, 120), data: JSON.stringify(data), created_at: Date.now(), ...(uid ? { owner: uid, created_by: uid } : {}) });
_oe.close(); K.toast(_oh ? 'Đã lưu' : 'Đã thêm ' + _og + ' vào sổ người quen', 'success'); rerender();
};
_oe = K.modal({ title: _oh ? 'Sửa người quen' : 'Thêm người quen', testid: 'g2-warm-form', body: [
K.field('Tên *', name), h('div', { class: 'bds-grid2' }, K.field('Mối quan hệ', rel), K.field('Gọi là', goi)),
h('div', { class: 'bds-grid2' }, K.field('Zalo / điện thoại', phone), K.field('Khu vực', kv)), K.field('Ghi chú', note), err,
h('small', { class: 'bds-muted' }, 'Chỉ lưu trong dữ liệu của anh/chị trên app, không gửi AI.'),
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _oe.close()), K.button('Lưu', ok, { kind: 'primary', testid: 'g2-wf-save' }))] });
}
box.replaceChildren(_oa, today, book, h('div', { class: 'g2-guard', 'data-testid': 'g2-warm-guard' }, h('strong', null, 'Tôn trọng người quen'), h('ul', null,
h('li', null, 'Mỗi tin đều có câu "không cần phản hồi nếu không tiện". Họ im lặng thì nhắn lại tối đa 1 lần rồi dừng.'),
h('li', null, 'Không nói giá chắc chắn tăng, sắp hết căn, cơ hội cuối; không hứa lợi nhuận; không bịa dự án hay thành tích.'),
h('li', null, 'App chỉ chép tin và mở Zalo – anh/chị tự đọc lại và bấm Gửi.'))));
}

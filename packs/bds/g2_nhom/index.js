import { g2kit, h, g2Selftest } from '../g2_lib/ui.js';
import * as O from '../g2_lib/ops.js';
import * as C from '../g2_lib/core.js';
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
let view = 'mine';
el.innerHTML = '';
const box = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-nhom' }, G.head('Việc nhóm', K.button('+ Giao việc', () => _o6(null), { kind: 'primary', testid: 'g2-task-add' })), box));
const _ob = () => G.user().id || '';
async function _of() {
const [tasks, dir] = await Promise.all([G.objectsOf('g2_task'), G.dir()]);
const _o0 = O.taskBuckets(tasks, _ob());
const _oh = [['mine', 'Việc của tôi (' + _o0.mine.filter(t => t.status !== 'done').length + ')'], ['given', 'Tôi giao (' + _o0.given.length + ')']];
if (G.perms().customers_scope === 'all') _oh.push(['all', 'Cả nhóm (' + _o0.all.length + ')']);
_oh.push(['overdue', 'Quá hạn (' + _o0.overdue.length + ')']);
box.innerHTML = '';
box.appendChild(G.tabs(_oh, view, v => { view = v; _of(); }, 'g2-task-view'));
const list = (_o0[view] || _o0.mine).slice().sort((x, y) => (x.status === 'done') - (y.status === 'done') || (O.taskInfo(x).due || 9e15) - (O.taskInfo(y).due || 9e15));
const _o9 = h('div', { class: 'bds-list', 'data-testid': 'g2-tasks' });
for (const t of list) {
const _o7 = O.taskInfo(t);
const _o8 = t.status !== 'done' && _o7.due && _o7.due < Date.now();
_o9.appendChild(h('div', { class: 'bds-item', 'data-testid': 'g2-task-' + t.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => _o6(t) }, h('strong', null, (t.status === 'done' ? '✓ ' : _o7.priority === 'high' ? '❗ ' : '') + (t.name || '(chưa đặt tên)')),
h('span', { class: 'bds-sub' + (_o8 ? ' bds-danger' : '') }, ['Người làm: ' + (G.who(t.owner, dir) || 'chưa rõ'), _o7.due ? 'hạn ' + G.dt(_o7.due) : '', _o7.by && _o7.by !== t.owner ? 'giao bởi ' + G.who(_o7.by, dir) : ''].filter(Boolean).join(' · '))),
K.badge((O.TASK_STATUS.find(s => s[0] === t.status) || O.TASK_STATUS[0])[1], t.status === 'done' ? 'success' : _o8 ? 'danger' : 'info')));
}
if (!list.length) _o9.appendChild(K.empty('Không có việc.'));
box.appendChild(_o9);
if (!O.canAssignOthers(G.perms())) box.appendChild(h('p', { class: 'bds-muted' }, 'Tài khoản Sale/CTV tạo việc cho chính mình; Quản trị/Quản lý giao việc cho người khác.'));
}
async function _o6(t) {
const [dir, customers] = await Promise.all([G.dir(), G.customers()]);
const _o7 = t ? O.taskInfo(t) : { priority: 'normal' };
const _o1 = O.canAssignOthers(G.perms()) && dir.length;
const title = h('input', { value: t ? t.name : '', placeholder: 'VD: Gửi bảng tính cho khách Hoa', 'data-testid': 'g2-t-title' });
const who = _o1 ? K.select(dir.map(u => [u.id, (u.full_name || u.username) + (u.id === _ob() ? ' (tôi)' : '')]), t ? t.owner : _ob(), { 'data-testid': 'g2-t-owner' }) : null;
const due = h('input', { type: 'datetime-local', value: _o7.due ? C.vnLocalInput(_o7.due) : '', 'data-testid': 'g2-t-due' });
const _o3 = G.customerSelect(customers, _o7.customer_id || '', { 'data-testid': 'g2-t-customer' });
const _od = K.select([['normal', 'Bình thường'], ['high', 'Gấp']], _o7.priority);
const status = K.select(O.TASK_STATUS, t ? t.status || 'todo' : 'todo', { 'data-testid': 'g2-t-status' });
const note = h('textarea', { rows: 2 }, _o7.note || '');
const _o2 = t ? O.commentsOf(await K.list('events'), t.id) : [];
const cbox = h('div', { 'data-testid': 'g2-t-comments' });
const _o4 = list => { cbox.innerHTML = ''; cbox.append(...(list.length ? list.map(x => h('div', { class: 'g2-comment' }, h('small', null, G.who(C.pd(x.data).by, dir) + ' · ' + G.dt(x.at)), x.text)) : [h('p', { class: 'bds-muted' }, 'Chưa có bình luận.')])); };
_o4(_o2);
const cm = h('textarea', { rows: 2, placeholder: 'Bình luận nội bộ… gõ @tên_đăng_nhập để nhắc ai đó', 'data-testid': 'g2-t-comment' });
let _oa;
const save = async () => {
if (!title.value.trim()) { K.toast('Nhập tên việc', 'warn'); return; }
const owner = who ? who.value : _ob();
const _o5 = due.value ? C.vnFromInput(due.value) : 0;
if (due.value && !Number.isFinite(_o5)) { K.toast('Hạn chưa đúng – chọn lại ngày giờ', 'warn'); return; }
const _og = await K.put('objects', { ...(t || {}), kind: 'g2_task', name: title.value.trim().slice(0, 200), owner, status: status.value,
data: JSON.stringify({ due: _o5, customer_id: _o3.value, priority: _od.value, by: t ? _o7.by : _ob(), note: note.value.slice(0, 1000) }) });
const _oc = !t || t.owner !== owner;
if (_oc && owner && owner !== _ob()) {
try { const _oe = await K.api('g2.task.notify', { user_id: owner, title: _og.name, due: _o5, task_id: _og.id }); K.toast(_oe && _oe.sent ? 'Đã giao việc và báo Telegram' : 'Đã giao việc (người nhận chưa nối Telegram riêng)', 'success'); }
catch { K.toast('Đã giao việc', 'success'); }
} else K.toast('Đã lưu việc', 'success');
_oa.close(); _of();
};
const sendComment = async () => {
const text = cm.value.trim();
if (!text || !t) return;
const ids = O.mentionIds(text, dir).filter(id => id !== _ob());
await K.put('events', { object_id: t.id, type: 'g2_comment', text: text.slice(0, 2000), at: Date.now(), data: JSON.stringify({ by: _ob(), mentions: ids }) });
if (_o7.customer_id) await K.put('events', { object_id: _o7.customer_id, type: 'g2_comment', text: '[Việc: ' + t.name + '] ' + text.slice(0, 1800), at: Date.now(), data: JSON.stringify({ by: _ob(), task: t.id }) });
cm.value = '';
_o4(O.commentsOf(await K.list('events'), t.id));
};
_oa = K.modal({ title: t ? 'Việc' : 'Giao việc mới', testid: 'g2-task-editor', body: [
K.field('Việc cần làm', title), who ? K.field('Người làm', who) : null,
h('div', { class: 'bds-grid2' }, K.field('Hạn', due), K.field('Mức', _od)), K.field('Liên quan khách', _o3), K.field('Trạng thái', status), K.field('Ghi chú', note),
t ? h('div', null, h('h4', null, 'Bình luận nội bộ'), cbox,
cm, K.button('Gửi bình luận', sendComment, { testid: 'g2-t-comment-send' })) : null,
h('div', { class: 'bds-row bds-end' }, t && G.perms().erase ? K.button('Xoá', async () => {
if (!(await K.confirm({ title: 'Xoá việc', text: 'Xoá việc "' + (t.name || 'chưa đặt tên') + '"? Bình luận nội bộ của việc này cũng không còn hiện.', ok: 'Xoá', kind: 'danger', testid: 'g2-t-del-c' }))) return;
await K.put('objects', { ...t, deleted: 1 }); _oa.close(); K.toast('Đã xoá việc', 'success'); _of();
}, { kind: 'danger', testid: 'g2-t-del', icon: 'x' }) : null,
K.button('Lưu', save, { kind: 'primary', testid: 'g2-t-save' }))] });
}
await _of();
K.on(el, ['objects', 'events'], _of);
}
export default {
manifest: { id: 'g2_nhom', title: 'Việc nhóm', icon: '🤝', screen: 'customers', order: 250, version: '0.1.0', status: 'thu-nghiem', pack: 'care',
help: 'Giao việc trong nhóm, bình luận nội bộ, nhắc @người; Quản trị/Quản lý giao cho người khác, Sale/CTV tạo việc cho mình.' },
mount,
async selftest(ctx) { return g2Selftest(ctx, mount); },
};

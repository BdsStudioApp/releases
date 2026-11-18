import { g2kit, h, g2Selftest } from '../g2_lib/ui.js';
import * as O from '../g2_lib/ops.js';
import * as C from '../g2_lib/core.js';
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
let view = 'mine';
el.innerHTML = '';
const _o1 = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-nhom' }, G.head('Việc nhóm', K.button('+ Giao việc', () => _o7(null), { kind: 'primary', testid: 'g2-task-add' })), _o1));
const _oc = () => G.user().id || '';
async function _og() {
const [tasks, dir] = await Promise.all([G.objectsOf('g2_task'), G.dir()]);
const _o0 = O.taskBuckets(tasks, _oc());
const _oi = [['mine', 'Việc của tôi (' + _o0.mine.filter(t => t.status !== 'done').length + ')'], ['given', 'Tôi giao (' + _o0.given.length + ')']];
if (G.perms().customers_scope === 'all') _oi.push(['all', 'Cả nhóm (' + _o0.all.length + ')']);
_oi.push(['overdue', 'Quá hạn (' + _o0.overdue.length + ')']);
_o1.innerHTML = '';
_o1.appendChild(G.tabs(_oi, view, v => { view = v; _og(); }, 'g2-task-view'));
const list = (_o0[view] || _o0.mine).slice().sort((x, y) => (x.status === 'done') - (y.status === 'done') || (O.taskInfo(x).due || 9e15) - (O.taskInfo(y).due || 9e15));
const _oa = h('div', { class: 'bds-list', 'data-testid': 'g2-tasks' });
for (const t of list) {
const _o8 = O.taskInfo(t);
const _o9 = t.status !== 'done' && _o8.due && _o8.due < Date.now();
_oa.appendChild(h('div', { class: 'bds-item', 'data-testid': 'g2-task-' + t.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => _o7(t) }, h('strong', null, (t.status === 'done' ? '✓ ' : _o8.priority === 'high' ? '❗ ' : '') + (t.name || '(chưa đặt tên)')),
h('span', { class: 'bds-sub' + (_o9 ? ' bds-danger' : '') }, ['Người làm: ' + (G.who(t.owner, dir) || 'chưa rõ'), _o8.due ? 'hạn ' + G.dt(_o8.due) : '', _o8.by && _o8.by !== t.owner ? 'giao bởi ' + G.who(_o8.by, dir) : ''].filter(Boolean).join(' · '))),
K.badge((O.TASK_STATUS.find(s => s[0] === t.status) || O.TASK_STATUS[0])[1], t.status === 'done' ? 'success' : _o9 ? 'danger' : 'info')));
}
if (!list.length) _oa.appendChild(K.empty('Không có việc.'));
_o1.appendChild(_oa);
if (!O.canAssignOthers(G.perms())) _o1.appendChild(h('p', { class: 'bds-muted' }, 'Tài khoản Sale/CTV tạo việc cho chính mình; Quản trị/Quản lý giao việc cho người khác.'));
}
async function _o7(t) {
const [dir, customers] = await Promise.all([G.dir(), G.customers()]);
const _o8 = t ? O.taskInfo(t) : { priority: 'normal' };
const _o2 = O.canAssignOthers(G.perms()) && dir.length;
const title = h('input', { value: t ? t.name : '', placeholder: 'VD: Gửi bảng tính cho khách Hoa', 'data-testid': 'g2-t-title' });
const who = _o2 ? K.select(dir.map(u => [u.id, (u.full_name || u.username) + (u.id === _oc() ? ' (tôi)' : '')]), t ? t.owner : _oc(), { 'data-testid': 'g2-t-owner' }) : null;
const due = h('input', { type: 'datetime-local', value: _o8.due ? C.vnLocalInput(_o8.due) : '', 'data-testid': 'g2-t-due' });
const _o4 = G.customerSelect(customers, _o8.customer_id || '', { 'data-testid': 'g2-t-customer' });
const _oe = K.select([['normal', 'Bình thường'], ['high', 'Gấp']], _o8.priority);
const status = K.select(O.TASK_STATUS, t ? t.status || 'todo' : 'todo', { 'data-testid': 'g2-t-status' });
const note = h('textarea', { rows: 2 }, _o8.note || '');
const _o3 = t ? O.commentsOf(await K.list('events'), t.id) : [];
const cbox = h('div', { 'data-testid': 'g2-t-comments' });
const _o5 = list => { cbox.innerHTML = ''; cbox.append(...(list.length ? list.map(x => h('div', { class: 'g2-comment' }, h('small', null, G.who(C.pd(x.data).by, dir) + ' · ' + G.dt(x.at)), x.text)) : [h('p', { class: 'bds-muted' }, 'Chưa có bình luận.')])); };
_o5(_o3);
const cm = h('textarea', { rows: 2, placeholder: 'Bình luận nội bộ… gõ @tên_đăng_nhập để nhắc ai đó', 'data-testid': 'g2-t-comment' });
let _ob;
const save = async () => {
if (!title.value.trim()) { K.toast('Nhập tên việc', 'warn'); return; }
const owner = who ? who.value : _oc();
const _o6 = due.value ? C.vnFromInput(due.value) : 0;
if (due.value && !Number.isFinite(_o6)) { K.toast('Hạn chưa đúng – chọn lại ngày giờ', 'warn'); return; }
const _oh = await K.put('objects', { ...(t || {}), kind: 'g2_task', name: title.value.trim().slice(0, 200), owner, status: status.value,
data: JSON.stringify({ due: _o6, customer_id: _o4.value, priority: _oe.value, by: t ? _o8.by : _oc(), note: note.value.slice(0, 1000) }) });
const _od = !t || t.owner !== owner;
if (_od && owner && owner !== _oc()) {
try { const _of = await K.api('g2.task.notify', { user_id: owner, title: _oh.name, due: _o6, task_id: _oh.id }); K.toast(_of && _of.sent ? 'Đã giao việc và báo Telegram' : 'Đã giao việc (người nhận chưa nối Telegram riêng)', 'success'); }
catch { K.toast('Đã giao việc', 'success'); }
} else K.toast('Đã lưu việc', 'success');
_ob.close(); _og();
};
const sendComment = async () => {
const text = cm.value.trim();
if (!text || !t) return;
const ids = O.mentionIds(text, dir).filter(id => id !== _oc());
await K.put('events', { object_id: t.id, type: 'g2_comment', text: text.slice(0, 2000), at: Date.now(), data: JSON.stringify({ by: _oc(), mentions: ids }) });
if (_o8.customer_id) await K.put('events', { object_id: _o8.customer_id, type: 'g2_comment', text: '[Việc: ' + t.name + '] ' + text.slice(0, 1800), at: Date.now(), data: JSON.stringify({ by: _oc(), task: t.id }) });
cm.value = '';
_o5(O.commentsOf(await K.list('events'), t.id));
};
_ob = K.modal({ title: t ? 'Việc' : 'Giao việc mới', testid: 'g2-task-editor', body: [
K.field('Việc cần làm', title), who ? K.field('Người làm', who) : null,
h('div', { class: 'bds-grid2' }, K.field('Hạn', due), K.field('Mức', _oe)), K.field('Liên quan khách', _o4), K.field('Trạng thái', status), K.field('Ghi chú', note),
t ? h('div', null, h('h4', null, 'Bình luận nội bộ'), cbox,
cm, K.button('Gửi bình luận', sendComment, { testid: 'g2-t-comment-send' })) : null,
h('div', { class: 'bds-row bds-end' }, t && G.perms().erase ? K.button('Xoá', async () => {
if (!(await K.confirm({ title: 'Xoá việc', text: 'Xoá việc "' + (t.name || 'chưa đặt tên') + '"? Bình luận nội bộ của việc này cũng không còn hiện.', ok: 'Xoá', kind: 'danger', testid: 'g2-t-del-c' }))) return;
await K.put('objects', { ...t, deleted: 1 }); _ob.close(); K.toast('Đã xoá việc', 'success'); _og();
}, { kind: 'danger', testid: 'g2-t-del', icon: 'x' }) : null,
K.button('Lưu', save, { kind: 'primary', testid: 'g2-t-save' }))] });
}
await _og();
K.on(el, ['objects', 'events'], _og);
}
export default {
manifest: { id: 'g2_nhom', title: 'Việc nhóm', icon: '🤝', screen: 'customers', order: 250, version: '0.1.0', status: 'thu-nghiem', pack: 'care',
help: 'Giao việc trong nhóm, bình luận nội bộ, nhắc @người; Quản trị/Quản lý giao cho người khác, Sale/CTV tạo việc cho mình.' },
mount,
async selftest(ctx) { return g2Selftest(ctx, mount); },
};

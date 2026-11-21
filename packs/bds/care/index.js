import { kit, h, selftestCommon } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import { visibleReminders } from '../_lib/consent.js';
const _o3 = { followup: 'Gọi lại', meeting: 'Lịch hẹn', payment: 'Đóng tiền', handover: 'Bàn giao', birthday: 'Sinh nhật', referral: 'Hỏi giới thiệu', policy_stale: 'Chính sách cũ', custom: 'Việc khác' };
const _o2 = { followup: '📞', meeting: '📅', payment: '💳', handover: '🔑', birthday: '🎂', referral: '🤝', policy_stale: '📄', custom: '📌' };
const _o0 = ['payment', 'handover', 'birthday', 'referral'];
export async function mount(el, ctx) {
const _o1 = kit(ctx);
el.innerHTML = '';
const box = h('div', { class: 'bds-screen', 'data-testid': 'care' });
el.appendChild(box);
async function _oq() {
const [reminders, customers] = await Promise.all([_o1.list('reminders'), _o1.list('objects')]);
const byId = new Map(crm.activeCustomers(customers).map(c => [c.id, c]));
const now = Date.now();
const _o6 = crm.reminderBuckets(visibleReminders(reminders.filter(r => !r.object_id || byId.has(r.object_id)), [...byId.values()]), now);
box.innerHTML = '';
box.appendChild(h('div', { class: 'bds-head' }, h('h2', null, 'Chăm sóc & Nhắc việc'),
_o1.button('+ Việc mới', () => editReminder(ctx, null, null, _oq), { testid: 'care-add' })));
const _ou = (title, list, testid, tone) => _o1.card({
title: title + ' (' + list.length + ')', testid, cls: tone ? 'bds-tone-card-' + tone : '',
body: list.length ? h('div', { class: 'bds-list' }, list.slice(0, 60).map(r => _op(_o1, r, byId.get(r.object_id), _oq))) : _o1.empty('Không có việc.'),
});
box.appendChild(_ou('Quá hạn', _o6.overdue, 'care-overdue', 'danger'));
box.appendChild(_ou('Hôm nay', _o6.today, 'care-today', 'warn'));
box.appendChild(_ou('Sắp tới', _o6.upcoming.slice(0, 60), 'care-upcoming'));
const _on = crm.activeCustomers(customers).filter(crm.isPostSale);
const _o7 = new Map();
reminders.forEach(r => { if (r.kind === 'payment' && !Number(r.done)) _o7.set(r.object_id, (_o7.get(r.object_id) || 0) + 1); });
box.appendChild(_o1.card({
title: 'Chăm sóc sau bán (' + _on.length + ')', testid: 'care-postsale',
body: _on.length ? h('div', { class: 'bds-list' }, _on.map(c => h('div', { class: 'bds-item' },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => _o1.openProfile(c.id) },
h('strong', null, c.name), h('span', { class: 'bds-sub' }, [_o1.projectName(c.project), c.status, _o7.get(c.id) ? _o7.get(c.id) + ' đợt chưa đóng' : 'chưa có lịch'].filter(Boolean).join(' · '))),
h('div', { class: 'bds-acts' }, _o1.button(_o7.get(c.id) ? 'Sửa lịch đóng tiền' : 'Lập lịch đóng tiền', () => openPaymentPlanner(ctx, c, { onSaved: _oq }), { kind: 'primary', testid: 'plan-' + c.id })))))
: _o1.empty('Khách "Đã đặt cọc" hoặc "Đã mua" sẽ hiện ở đây để lập lịch đóng tiền và chăm sóc.'),
}));
}
await _oq();
_o1.on(el, ['reminders', 'objects'], _oq);
if (new URLSearchParams(location.hash.split('?')[1] || '').get('new') === '1') editReminder(ctx, null, null, _oq);
}
function _op(_o1, r, c, refresh) {
const ctx = _o1.ctx;
const done = async () => { await _o1.put('reminders', { ...r, done: 1 }); if (r.object_id) await _o1.logEvent(r.object_id, r.kind === 'payment' ? 'payment' : 'note', 'Đã xong: ' + (r.title || _o3[r.kind])); _o1.toast('Đã đánh dấu xong', 'success'); refresh(); };
const snooze = async days => { await _o1.put('reminders', crm.snooze(r, days, Date.now())); _o1.toast('Đã hoãn ' + (days === 7 ? '1 tuần' : days + ' ngày'), 'info'); refresh(); };
const sz = h('select', { class: 'bds-snooze', 'aria-label': 'Hoãn', 'data-testid': 'snooze-' + r.id, onchange: e => { const _oz = Number(e.target.value); e.target.value = ''; if (_oz) snooze(_oz); } },
h('option', { value: '' }, 'Hoãn…'), h('option', { value: 1 }, '1 ngày'), h('option', { value: 3 }, '3 ngày'), h('option', { value: 7 }, '1 tuần'));
return h('div', { class: 'bds-item', 'data-id': r.id, 'data-testid': 'rem-' + r.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => (c ? _o1.openProfile(c.id) : editReminder(ctx, r, null, refresh)) },
h('strong', null, (_o2[r.kind] || '📌') + ' ' + ((c && c.name ? String(r.title || '').replace(new RegExp('\\s*–\\s*' + c.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$'), '') : r.title) || _o3[r.kind] || 'Việc')),
h('span', { class: 'bds-sub' }, [_o1.date(r.due_at) + (r.kind === 'meeting' && crm.hm(r.due_at) !== '00:00' ? ' ' + crm.hm(r.due_at) : ''), r.amount ? _o1.money(r.amount) : '', c && c.name ? c.name : ''].filter(Boolean).join(' · '))),
h('div', { class: 'bds-acts bds-wrap' },
c ? _o1.callBtn(c, { short: true }) : null,
_o1.button('✓ Xong', done, { testid: 'done-' + r.id }),
sz,
_o1.button('Sửa', () => editReminder(ctx, r, c, refresh), { testid: 'edit-' + r.id })));
}
const _ox = ms => { const _o8 = new Date(ms); return new Date(_o8.getTime() - _o8.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
export async function editReminder(ctx, r, c, onSaved) {
const _o1 = kit(ctx);
const _of = !r;
r = r || { kind: 'followup', title: '', due_at: Date.now() + 86400000, remind_before_days: 0, amount: 0, installment: 0, done: 0, notified_at: 0, data: '{}', object_id: c ? c.id : '' };
const customers = _of && !c ? crm.activeCustomers(await _o1.list('objects')) : [];
const _o10 = _of && !c ? _o1.select([['', '— Không gắn khách —'], ...customers.map(x => [x.id, x.name])], '', {}) : null;
const kind = _o1.select(Object.entries(_o3), r.kind, {});
const title = h('input', { value: r.title || '', 'data-testid': 'rem-title' });
const _ob = h('input', { type: 'datetime-local', value: _ox(r.due_at), 'data-testid': 'rem-due' });
const amount = h('input', { value: r.amount ? _o1.money(r.amount) : '', placeholder: 'VD: 300tr', 'data-testid': 'rem-amount' });
const before = h('input', { type: 'number', min: 0, max: 60, value: r.remind_before_days || 0 });
const _oi = _o1.modal({ title: _of ? 'Việc mới' : 'Sửa nhắc việc', testid: 'rem-modal', body: [
_o10 ? _o1.field('Khách', _o10) : null, _o1.field('Loại', kind), _o1.field('Nội dung', title), _o1.field('Thời gian', _ob),
_o1.field('Số tiền (nếu có)', amount), _o1.field('Nhắc trước (ngày)', before),
h('div', { class: 'bds-row bds-end' },
!_of ? _o1.button('Xoá', async () => { await _o1.put('reminders', { ...r, deleted: 1 }); _oi.close(); onSaved && onSaved(); }, { kind: 'danger' }) : null,
_o1.button('Huỷ', () => _oi.close()),
_o1.button('Lưu', async () => {
const _o5 = new Date(_ob.value).getTime();
if (!Number.isFinite(_o5)) { _o1.toast('Chọn thời gian', 'warn'); return; }
const _o4 = amount.value.trim() ? crm.parseMoney(amount.value) : 0;
if (amount.value.trim() && !_o4) { _o1.toast('Chưa hiểu số tiền', 'warn'); return; }
await _o1.put('reminders', { ...r, object_id: _o10 ? _o10.value : r.object_id, kind: kind.value, title: title.value.trim() || _o3[kind.value], due_at: _o5, amount: _o4 || 0, remind_before_days: Number(before.value) || 0, notified_at: _o5 !== r.due_at ? 0 : r.notified_at });
_oi.close(); _o1.toast('Đã lưu', 'success'); onSaved && onSaved();
}, { kind: 'primary', testid: 'rem-save' }))] });
}
function _om(_o1, project, policyRows) {
const L = _o1.L;
const _ok = (policyRows || []).filter(p => p.project_id === project.id && p.status === 'active');
try {
if (L.pay && typeof L.pay.plans === 'function') {
if (_ok.length) { const r = L.pay.plans(project, _ok); if (r && r.length) return r; }
return L.pay.plans(project, (_o1.ctx.data && _o1.ctx.data.defaultPolicies) || {}) || [];
}
} catch { }
const _oa = (_o1.ctx.data && _o1.ctx.data.defaultPolicies) || {};
return _oa[project.id] || _oa[project.pol] || [];
}
export async function openPaymentPlanner(ctx, customer, opts = {}) {
const _o1 = kit(ctx);
const [policyRows, quotes, reminders] = await Promise.all([_o1.list('policies'), _o1.list('quotes'), _o1.list('reminders'), _o1.loadProjects()]);
const _od = reminders.filter(r => r.object_id === customer.id && _o0.includes(r.kind) && !Number(r.done));
const _oh = quotes.filter(q => q.object_id === customer.id).sort((a, _o6) => (_o6.created_at || _o6.updated_at || 0) - (a.created_at || a.updated_at || 0))[0];
const _ow = {
project: (_oh && _oh.project_id) || customer.project || (_o1.projects()[0] || {}).id || '',
planId: _oh ? _oh.plan_id : '',
total: _oh ? Number(_oh.price_total) || 0 : 0,
start: crm.ymd(Date.now()), before: 7,
rows: _od.filter(r => r.kind === 'payment').sort((a, _o6) => a.due_at - _o6.due_at)
.map(r => ({ installment: r.installment, label: String(r.title || '').replace(' – ' + customer.name, ''), date: crm.ymd(r.due_at), amount: Number(r.amount) || 0, before: Number(r.remind_before_days) || 0 })),
};
const _oj = k => _od.find(r => r.kind === k);
const _oo = _o1.select(_o1.projects().length ? _o1.projects().map(p => [p.id, p.name]) : [['', '— Chưa có dự án (thêm ở Thông tin dự án) —']], _ow.project, { 'data-testid': 'pp-project' });
const _ol = h('select', { 'data-testid': 'pp-plan' });
const total = h('input', { value: _ow.total ? _o1.money(_ow.total) : '', placeholder: 'VD: 3,2 tỷ', 'data-testid': 'pp-total' });
const _oy = h('small', { class: 'bds-field-h' });
const start = h('input', { type: 'date', value: _ow.start, 'data-testid': 'pp-start' });
const before = h('input', { type: 'number', min: 0, max: 60, value: _ow.before, 'data-testid': 'pp-before' });
const handover = h('input', { type: 'date', 'data-testid': 'pp-handover' });
const birthday = h('input', { type: 'date', value: customer.birthday || '', 'data-testid': 'pp-birthday' });
const referral = h('input', { type: 'date', 'data-testid': 'pp-referral' });
const tableBox = h('div', { class: 'bds-pp-table', 'data-testid': 'pp-rows' });
const sumBox = h('div', { class: 'bds-pp-sum', 'data-testid': 'pp-sum' });
const _oe = () => {
const p = _o1.project(_oo.value);
const plans = p ? _om(_o1, p, policyRows) : [];
_ol.innerHTML = '';
plans.forEach(pl => _ol.appendChild(h('option', { value: pl.id, selected: pl.id === _ow.planId }, pl.name + (pl.sub ? ' – ' + pl.sub : ''))));
_ol.appendChild(h('option', { value: '_manual', selected: !plans.length }, 'Tự nhập từng đợt'));
_ol._plans = plans;
const _oc = _oj('handover');
handover.value = _oc ? crm.ymd(_oc.due_at) : (p && p.handover ? String(p.handover).slice(0, 7) + '-01' : '');
};
const _o9 = () => { const _oc = _oj('referral'); referral.value = _oc ? crm.ymd(_oc.due_at) : crm.ymd(crm.addMonths(crm.parseYmd(start.value || _ow.start), 6)); };
_oe(); _o9();
_oo.addEventListener('change', _oe);
start.addEventListener('change', () => { if (!_oj('referral')) _o9(); });
total.addEventListener('input', () => { const _oz = crm.parseMoney(total.value); _oy.textContent = total.value ? (_oz ? '= ' + _o1.money(_oz) : 'Chưa hiểu số tiền') : ''; _os(); });
if (_ow.total) _oy.textContent = '= ' + _o1.money(_ow.total);
const generate = () => {
const t = crm.parseMoney(total.value);
if (!t) { _o1.toast('Nhập tổng giá căn (VD: 3,2 tỷ)', 'warn'); total.focus(); return; }
const p = _o1.project(_oo.value);
const plan = (_ol._plans || []).find(x => x.id === _ol.value);
if (!plan) { _ow.rows = [{ installment: 1, label: 'Đợt 1', date: start.value, amount: t, before: Number(before.value) || 0 }]; _or(); return; }
_ow.rows = crm.buildPaymentRows({ total: t, plan, project: p, start: start.value, before: Number(before.value) || 0, logic: _o1.L });
_or();
_o1.toast('Đã tạo ' + _ow.rows.length + ' đợt – sửa lại nếu cần', 'success');
};
function _os() {
const t = crm.parseMoney(total.value) || 0;
const _ot = crm.sumRows(_ow.rows);
sumBox.innerHTML = '';
sumBox.appendChild(h('span', null, 'Tổng các đợt: ', h('strong', null, _o1.money(_ot))));
if (t && Math.abs(t - _ot) >= 1e6) sumBox.appendChild(h('span', { class: 'bds-muted' }, ' · còn lại (ngân hàng/khác): ' + _o1.money(t - _ot)));
}
function _or() {
tableBox.innerHTML = '';
_ow.rows.forEach((r, i) => { r.installment = i + 1; });
const table = h('table', { class: 'bds-table' },
h('thead', null, h('tr', null, ['Đợt', 'Nội dung', 'Ngày đóng', 'Số tiền', 'Nhắc trước', ''].map(x => h('th', null, x)))),
h('tbody', null, _ow.rows.map((r, i) => {
const _o4 = h('input', { value: _o1.money(r.amount), 'aria-label': 'Số tiền đợt ' + (i + 1), 'data-testid': 'pp-amount-' + i, onchange: e => {
const _oz = crm.parseMoney(e.target.value);
if (!_oz) { _o1.toast('Chưa hiểu số tiền', 'warn'); e.target.value = _o1.money(r.amount); return; }
r.amount = _oz; e.target.value = _o1.money(_oz); _os();
} });
return h('tr', null,
h('td', null, String(i + 1)),
h('td', null, h('input', { value: r.label, 'aria-label': 'Nội dung đợt ' + (i + 1), onchange: e => { r.label = e.target.value; } })),
h('td', null, h('input', { type: 'date', value: r.date, 'aria-label': 'Ngày đóng đợt ' + (i + 1), 'data-testid': 'pp-date-' + i, onchange: e => { r.date = e.target.value; } })),
h('td', null, _o4),
h('td', null, h('input', { type: 'number', min: 0, max: 60, value: r.before, class: 'bds-num', 'aria-label': 'Nhắc trước bao nhiêu ngày', onchange: e => { r.before = Number(e.target.value) || 0; } })),
h('td', null, h('button', { type: 'button', class: 'bds-x', 'aria-label': 'Xoá đợt', 'data-testid': 'pp-del-' + i, onclick: () => { _ow.rows.splice(i, 1); _or(); } }, '✕')));
})));
tableBox.appendChild(_ow.rows.length ? h('div', { class: 'bds-scroll' }, table) : _o1.empty('Chưa có đợt nào. Bấm "Tạo lịch" hoặc "+ Thêm đợt".'));
_os();
}
const addRow = () => {
const _og = _ow.rows[_ow.rows.length - 1];
const _o8 = _og && _og.date ? crm.ymd(crm.addMonths(crm.parseYmd(_og.date), 1)) : start.value;
_ow.rows.push({ installment: _ow.rows.length + 1, label: 'Đợt ' + (_ow.rows.length + 1), date: _o8, amount: 0, before: Number(before.value) || 0 });
_or();
};
const save = async () => {
for (const r of _ow.rows) if (!r.date || !Number.isFinite(crm.parseYmd(r.date))) { _o1.toast('Đợt ' + r.installment + ' chưa có ngày đóng', 'warn'); return; }
for (const r of _ow.rows) if (!(Number(r.amount) > 0)) { _o1.toast('Đợt ' + r.installment + ' chưa có số tiền – nhập số tiền hoặc bấm ✕ để xoá đợt.', 'warn'); return; }
const now = Date.now();
for (const r of _od) await _o1.put('reminders', { ...r, deleted: 1 });
const rows = crm.careReminders({
object_id: customer.id, name: customer.name, rows: _ow.rows, project: _oo.value,
handover: handover.value, birthday: birthday.value, referral: referral.value, now, newId: _o1.newId,
});
for (const r of rows) await _o1.put('reminders', r);
if (birthday.value && birthday.value !== customer.birthday) {
const cur = await _o1.get('objects', customer.id);
if (cur) await _o1.put('objects', { ...cur, birthday: birthday.value });
}
await _o1.logEvent(customer.id, 'payment', 'Lập lịch đóng tiền ' + _ow.rows.length + ' đợt, tổng ' + _o1.money(crm.sumRows(_ow.rows)), { plan: _ol.value, project: _oo.value });
_o1.toast('Đã lưu ' + rows.length + ' nhắc việc. Máy chủ sẽ nhắc qua Telegram.', 'success');
_ov.close();
if (opts.onSaved) opts.onSaved();
};
const _ov = _o1.modal({ wide: true, title: 'Lịch đóng tiền – ' + (customer.name || ''), testid: 'payment-planner', body: h('div', { class: 'bds-form' },
h('div', { class: 'bds-grid2' }, _o1.field('Dự án', _oo), _o1.field('Phương án thanh toán', _ol)),
h('div', { class: 'bds-grid2' }, h('div', null, _o1.field('Tổng giá căn', total), _oy), _o1.field('Ngày ký / giữ căn', start)),
h('div', { class: 'bds-grid2' }, _o1.field('Nhắc trước (ngày)', before), h('div', { class: 'bds-row bds-end' }, _o1.button('Tạo lịch', generate, { kind: 'primary', testid: 'pp-generate' }))),
h('p', { class: 'bds-muted' }, 'Mọi ô trong bảng đều sửa được. Phần ngân hàng giải ngân không tạo nhắc cho khách.'),
tableBox, sumBox,
_o1.button('+ Thêm đợt', addRow, { testid: 'pp-add' }),
h('h4', null, 'Mốc chăm sóc'),
h('div', { class: 'bds-grid2' }, _o1.field('Ngày bàn giao', handover), _o1.field('Sinh nhật khách', birthday)),
_o1.field('Hỏi giới thiệu (mặc định +6 tháng)', referral),
h('div', { class: 'bds-row bds-end' }, _o1.button('Huỷ', () => _ov.close()), _o1.button('Lưu lịch chăm sóc', save, { kind: 'primary', testid: 'pp-save' }))) });
_or();
return _ov;
}
export default {
manifest: {
id: 'care', title: 'Chăm sóc & Nhắc việc', icon: '⏰', screen: 'customers', order: 20, version: '1.0.0', status: 'ready',
help: 'Nhắc việc quá hạn, hôm nay, sắp tới; lập lịch đóng tiền cho khách đã cọc/đã mua, nhắc bàn giao, sinh nhật, hỏi giới thiệu.',
},
mount,
async selftest(ctx) {
const r = await selftestCommon(ctx, ['pay.schedule', 'pay.plans', 'remind.fromSchedule', 'fmt.money'], div => mount(div, ctx));
if (r.ok) {
try {
const rows = crm.buildPaymentRows({ total: 1e9, plan: { steps: [{ pct: 30 }, { pct: 70, months: 1 }] }, start: '2026-01-01' });
if (crm.sumRows(rows) !== 1e9) return { ok: false, details: 'Sinh lịch đóng tiền sai tổng' };
} catch (e) { return { ok: false, details: 'Sinh lịch lỗi: ' + e.message }; }
}
return r;
},
};

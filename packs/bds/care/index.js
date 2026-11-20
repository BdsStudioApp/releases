import { kit, h, selftestCommon } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import { visibleReminders } from '../_lib/consent.js';
const _o3 = { followup: 'Gọi lại', meeting: 'Lịch hẹn', payment: 'Đóng tiền', handover: 'Bàn giao', birthday: 'Sinh nhật', referral: 'Hỏi giới thiệu', policy_stale: 'Chính sách cũ', custom: 'Việc khác' };
const _o2 = { followup: '📞', meeting: '📅', payment: '💳', handover: '🔑', birthday: '🎂', referral: '🤝', policy_stale: '📄', custom: '📌' };
const _o0 = ['payment', 'handover', 'birthday', 'referral'];
export async function mount(el, ctx) {
const _o1 = kit(ctx);
el.innerHTML = '';
const _o7 = h('div', { class: 'bds-screen', 'data-testid': 'care' });
el.appendChild(_o7);
async function _or() {
const [reminders, customers] = await Promise.all([_o1.list('reminders'), _o1.list('objects')]);
const byId = new Map(crm.activeCustomers(customers).map(c => [c.id, c]));
const now = Date.now();
const _o6 = crm.reminderBuckets(visibleReminders(reminders.filter(r => !r.object_id || byId.has(r.object_id)), [...byId.values()]), now);
_o7.innerHTML = '';
_o7.appendChild(h('div', { class: 'bds-head' }, h('h2', null, 'Chăm sóc & Nhắc việc'),
_o1.button('+ Việc mới', () => editReminder(ctx, null, null, _or), { testid: 'care-add' })));
const _ov = (title, list, testid, tone) => _o1.card({
title: title + ' (' + list.length + ')', testid, cls: tone ? 'bds-tone-card-' + tone : '',
body: list.length ? h('div', { class: 'bds-list' }, list.slice(0, 60).map(r => _oq(_o1, r, byId.get(r.object_id), _or))) : _o1.empty('Không có việc.'),
});
_o7.appendChild(_ov('Quá hạn', _o6.overdue, 'care-overdue', 'danger'));
_o7.appendChild(_ov('Hôm nay', _o6.today, 'care-today', 'warn'));
_o7.appendChild(_ov('Sắp tới', _o6.upcoming.slice(0, 60), 'care-upcoming'));
const _oo = crm.activeCustomers(customers).filter(crm.isPostSale);
const _o8 = new Map();
reminders.forEach(r => { if (r.kind === 'payment' && !Number(r.done)) _o8.set(r.object_id, (_o8.get(r.object_id) || 0) + 1); });
_o7.appendChild(_o1.card({
title: 'Chăm sóc sau bán (' + _oo.length + ')', testid: 'care-postsale',
body: _oo.length ? h('div', { class: 'bds-list' }, _oo.map(c => h('div', { class: 'bds-item' },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => _o1.openProfile(c.id) },
h('strong', null, c.name), h('span', { class: 'bds-sub' }, [_o1.projectName(c.project), c.status, _o8.get(c.id) ? _o8.get(c.id) + ' đợt chưa đóng' : 'chưa có lịch'].filter(Boolean).join(' · '))),
h('div', { class: 'bds-acts' }, _o1.button(_o8.get(c.id) ? 'Sửa lịch đóng tiền' : 'Lập lịch đóng tiền', () => openPaymentPlanner(ctx, c, { onSaved: _or }), { kind: 'primary', testid: 'plan-' + c.id })))))
: _o1.empty('Khách "Đã đặt cọc" hoặc "Đã mua" sẽ hiện ở đây để lập lịch đóng tiền và chăm sóc.'),
}));
}
await _or();
_o1.on(el, ['reminders', 'objects'], _or);
if (new URLSearchParams(location.hash.split('?')[1] || '').get('new') === '1') editReminder(ctx, null, null, _or);
}
function _oq(_o1, r, c, refresh) {
const ctx = _o1.ctx;
const done = async () => { await _o1.put('reminders', { ...r, done: 1 }); if (r.object_id) await _o1.logEvent(r.object_id, r.kind === 'payment' ? 'payment' : 'note', 'Đã xong: ' + (r.title || _o3[r.kind])); _o1.toast('Đã đánh dấu xong', 'success'); refresh(); };
const snooze = async days => { await _o1.put('reminders', crm.snooze(r, days, Date.now())); _o1.toast('Đã hoãn ' + (days === 7 ? '1 tuần' : days + ' ngày'), 'info'); refresh(); };
const sz = h('select', { class: 'bds-snooze', 'aria-label': 'Hoãn', 'data-testid': 'snooze-' + r.id, onchange: e => { const _o10 = Number(e.target.value); e.target.value = ''; if (_o10) snooze(_o10); } },
h('option', { value: '' }, 'Hoãn…'), h('option', { value: 1 }, '1 ngày'), h('option', { value: 3 }, '3 ngày'), h('option', { value: 7 }, '1 tuần'));
return h('div', { class: 'bds-item', 'data-id': r.id, 'data-testid': 'rem-' + r.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => (c ? _o1.openProfile(c.id) : editReminder(ctx, r, null, refresh)) },
h('strong', null, (_o2[r.kind] || '📌') + ' ' + (r.title || _o3[r.kind] || 'Việc')),
h('span', { class: 'bds-sub' }, [_o1.date(r.due_at), r.amount ? _o1.money(r.amount) : '', c && !String(r.title || '').includes(c.name) ? c.name : ''].filter(Boolean).join(' · '))),
h('div', { class: 'bds-acts bds-wrap' },
c ? _o1.callBtn(c, { short: true }) : null,
_o1.button('✓ Xong', done, { testid: 'done-' + r.id }),
sz,
_o1.button('Sửa', () => editReminder(ctx, r, c, refresh), { testid: 'edit-' + r.id })));
}
const _oy = ms => { const _o9 = new Date(ms); return new Date(_o9.getTime() - _o9.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
export async function editReminder(ctx, r, c, onSaved) {
const _o1 = kit(ctx);
const _og = !r;
r = r || { kind: 'followup', title: '', due_at: Date.now() + 86400000, remind_before_days: 0, amount: 0, installment: 0, done: 0, notified_at: 0, data: '{}', object_id: c ? c.id : '' };
const customers = _og && !c ? crm.activeCustomers(await _o1.list('objects')) : [];
const _o11 = _og && !c ? _o1.select([['', '— Không gắn khách —'], ...customers.map(x => [x.id, x.name])], '', {}) : null;
const kind = _o1.select(Object.entries(_o3), r.kind, {});
const title = h('input', { value: r.title || '', 'data-testid': 'rem-title' });
const _oc = h('input', { type: 'datetime-local', value: _oy(r.due_at), 'data-testid': 'rem-due' });
const amount = h('input', { value: r.amount ? _o1.money(r.amount) : '', placeholder: 'VD: 300tr', 'data-testid': 'rem-amount' });
const before = h('input', { type: 'number', min: 0, max: 60, value: r.remind_before_days || 0 });
const _oj = _o1.modal({ title: _og ? 'Việc mới' : 'Sửa nhắc việc', testid: 'rem-modal', body: [
_o11 ? _o1.field('Khách', _o11) : null, _o1.field('Loại', kind), _o1.field('Nội dung', title), _o1.field('Thời gian', _oc),
_o1.field('Số tiền (nếu có)', amount), _o1.field('Nhắc trước (ngày)', before),
h('div', { class: 'bds-row bds-end' },
!_og ? _o1.button('Xoá', async () => { await _o1.put('reminders', { ...r, deleted: 1 }); _oj.close(); onSaved && onSaved(); }, { kind: 'danger' }) : null,
_o1.button('Huỷ', () => _oj.close()),
_o1.button('Lưu', async () => {
const _o5 = new Date(_oc.value).getTime();
if (!Number.isFinite(_o5)) { _o1.toast('Chọn thời gian', 'warn'); return; }
const _o4 = amount.value.trim() ? crm.parseMoney(amount.value) : 0;
if (amount.value.trim() && !_o4) { _o1.toast('Chưa hiểu số tiền', 'warn'); return; }
await _o1.put('reminders', { ...r, object_id: _o11 ? _o11.value : r.object_id, kind: kind.value, title: title.value.trim() || _o3[kind.value], due_at: _o5, amount: _o4 || 0, remind_before_days: Number(before.value) || 0, notified_at: _o5 !== r.due_at ? 0 : r.notified_at });
_oj.close(); _o1.toast('Đã lưu', 'success'); onSaved && onSaved();
}, { kind: 'primary', testid: 'rem-save' }))] });
}
function _on(_o1, project, policyRows) {
const L = _o1.L;
const _ol = (policyRows || []).filter(p => p.project_id === project.id && p.status === 'active');
try {
if (L.pay && typeof L.pay.plans === 'function') {
if (_ol.length) { const r = L.pay.plans(project, _ol); if (r && r.length) return r; }
return L.pay.plans(project, (_o1.ctx.data && _o1.ctx.data.defaultPolicies) || {}) || [];
}
} catch { }
const _ob = (_o1.ctx.data && _o1.ctx.data.defaultPolicies) || {};
return _ob[project.id] || _ob[project.pol] || [];
}
export async function openPaymentPlanner(ctx, customer, opts = {}) {
const _o1 = kit(ctx);
const [policyRows, quotes, reminders] = await Promise.all([_o1.list('policies'), _o1.list('quotes'), _o1.list('reminders')]);
const _oe = reminders.filter(r => r.object_id === customer.id && _o0.includes(r.kind) && !Number(r.done));
const _oi = quotes.filter(q => q.object_id === customer.id).sort((a, _o6) => (_o6.created_at || _o6.updated_at || 0) - (a.created_at || a.updated_at || 0))[0];
const _ox = {
project: (_oi && _oi.project_id) || customer.project || (_o1.projects()[0] || {}).id || '',
planId: _oi ? _oi.plan_id : '',
total: _oi ? Number(_oi.price_total) || 0 : 0,
start: crm.ymd(Date.now()), before: 7,
rows: _oe.filter(r => r.kind === 'payment').sort((a, _o6) => a.due_at - _o6.due_at)
.map(r => ({ installment: r.installment, label: String(r.title || '').replace(' – ' + customer.name, ''), date: crm.ymd(r.due_at), amount: Number(r.amount) || 0, before: Number(r.remind_before_days) || 0 })),
};
const _ok = k => _oe.find(r => r.kind === k);
const _op = _o1.select(_o1.projects().map(p => [p.id, p.name]), _ox.project, { 'data-testid': 'pp-project' });
const _om = h('select', { 'data-testid': 'pp-plan' });
const total = h('input', { value: _ox.total ? _o1.money(_ox.total) : '', placeholder: 'VD: 3,2 tỷ', 'data-testid': 'pp-total' });
const _oz = h('small', { class: 'bds-field-h' });
const start = h('input', { type: 'date', value: _ox.start, 'data-testid': 'pp-start' });
const before = h('input', { type: 'number', min: 0, max: 60, value: _ox.before, 'data-testid': 'pp-before' });
const handover = h('input', { type: 'date', 'data-testid': 'pp-handover' });
const birthday = h('input', { type: 'date', value: customer.birthday || '', 'data-testid': 'pp-birthday' });
const referral = h('input', { type: 'date', 'data-testid': 'pp-referral' });
const tableBox = h('div', { class: 'bds-pp-table', 'data-testid': 'pp-rows' });
const sumBox = h('div', { class: 'bds-pp-sum', 'data-testid': 'pp-sum' });
const _of = () => {
const p = _o1.project(_op.value);
const plans = p ? _on(_o1, p, policyRows) : [];
_om.innerHTML = '';
plans.forEach(pl => _om.appendChild(h('option', { value: pl.id, selected: pl.id === _ox.planId }, pl.name + (pl.sub ? ' – ' + pl.sub : ''))));
_om.appendChild(h('option', { value: '_manual', selected: !plans.length }, 'Tự nhập từng đợt'));
_om._plans = plans;
const _od = _ok('handover');
handover.value = _od ? crm.ymd(_od.due_at) : (p && p.handover ? String(p.handover).slice(0, 7) + '-01' : '');
};
const _oa = () => { const _od = _ok('referral'); referral.value = _od ? crm.ymd(_od.due_at) : crm.ymd(crm.addMonths(crm.parseYmd(start.value || _ox.start), 6)); };
_of(); _oa();
_op.addEventListener('change', _of);
start.addEventListener('change', () => { if (!_ok('referral')) _oa(); });
total.addEventListener('input', () => { const _o10 = crm.parseMoney(total.value); _oz.textContent = total.value ? (_o10 ? '= ' + _o1.money(_o10) : 'Chưa hiểu số tiền') : ''; _ot(); });
if (_ox.total) _oz.textContent = '= ' + _o1.money(_ox.total);
const generate = () => {
const t = crm.parseMoney(total.value);
if (!t) { _o1.toast('Nhập tổng giá căn (VD: 3,2 tỷ)', 'warn'); total.focus(); return; }
const p = _o1.project(_op.value);
const plan = (_om._plans || []).find(x => x.id === _om.value);
if (!plan) { _ox.rows = [{ installment: 1, label: 'Đợt 1', date: start.value, amount: t, before: Number(before.value) || 0 }]; _os(); return; }
_ox.rows = crm.buildPaymentRows({ total: t, plan, project: p, start: start.value, before: Number(before.value) || 0, logic: _o1.L });
_os();
_o1.toast('Đã tạo ' + _ox.rows.length + ' đợt – sửa lại nếu cần', 'success');
};
function _ot() {
const t = crm.parseMoney(total.value) || 0;
const _ou = crm.sumRows(_ox.rows);
sumBox.innerHTML = '';
sumBox.appendChild(h('span', null, 'Tổng các đợt: ', h('strong', null, _o1.money(_ou))));
if (t && Math.abs(t - _ou) >= 1e6) sumBox.appendChild(h('span', { class: 'bds-muted' }, ' · còn lại (ngân hàng/khác): ' + _o1.money(t - _ou)));
}
function _os() {
tableBox.innerHTML = '';
_ox.rows.forEach((r, i) => { r.installment = i + 1; });
const table = h('table', { class: 'bds-table' },
h('thead', null, h('tr', null, ['Đợt', 'Nội dung', 'Ngày đóng', 'Số tiền', 'Nhắc trước', ''].map(x => h('th', null, x)))),
h('tbody', null, _ox.rows.map((r, i) => {
const _o4 = h('input', { value: _o1.money(r.amount), 'aria-label': 'Số tiền đợt ' + (i + 1), 'data-testid': 'pp-amount-' + i, onchange: e => {
const _o10 = crm.parseMoney(e.target.value);
if (!_o10) { _o1.toast('Chưa hiểu số tiền', 'warn'); e.target.value = _o1.money(r.amount); return; }
r.amount = _o10; e.target.value = _o1.money(_o10); _ot();
} });
return h('tr', null,
h('td', null, String(i + 1)),
h('td', null, h('input', { value: r.label, 'aria-label': 'Nội dung đợt ' + (i + 1), onchange: e => { r.label = e.target.value; } })),
h('td', null, h('input', { type: 'date', value: r.date, 'aria-label': 'Ngày đóng đợt ' + (i + 1), 'data-testid': 'pp-date-' + i, onchange: e => { r.date = e.target.value; } })),
h('td', null, _o4),
h('td', null, h('input', { type: 'number', min: 0, max: 60, value: r.before, class: 'bds-num', 'aria-label': 'Nhắc trước bao nhiêu ngày', onchange: e => { r.before = Number(e.target.value) || 0; } })),
h('td', null, h('button', { type: 'button', class: 'bds-x', 'aria-label': 'Xoá đợt', 'data-testid': 'pp-del-' + i, onclick: () => { _ox.rows.splice(i, 1); _os(); } }, '✕')));
})));
tableBox.appendChild(_ox.rows.length ? h('div', { class: 'bds-scroll' }, table) : _o1.empty('Chưa có đợt nào. Bấm "Tạo lịch" hoặc "+ Thêm đợt".'));
_ot();
}
const addRow = () => {
const _oh = _ox.rows[_ox.rows.length - 1];
const _o9 = _oh && _oh.date ? crm.ymd(crm.addMonths(crm.parseYmd(_oh.date), 1)) : start.value;
_ox.rows.push({ installment: _ox.rows.length + 1, label: 'Đợt ' + (_ox.rows.length + 1), date: _o9, amount: 0, before: Number(before.value) || 0 });
_os();
};
const save = async () => {
for (const r of _ox.rows) if (!r.date || !Number.isFinite(crm.parseYmd(r.date))) { _o1.toast('Đợt ' + r.installment + ' chưa có ngày đóng', 'warn'); return; }
for (const r of _ox.rows) if (!(Number(r.amount) > 0)) { _o1.toast('Đợt ' + r.installment + ' chưa có số tiền – nhập số tiền hoặc bấm ✕ để xoá đợt.', 'warn'); return; }
const now = Date.now();
for (const r of _oe) await _o1.put('reminders', { ...r, deleted: 1 });
const rows = crm.careReminders({
object_id: customer.id, name: customer.name, rows: _ox.rows, project: _op.value,
handover: handover.value, birthday: birthday.value, referral: referral.value, now, newId: _o1.newId,
});
for (const r of rows) await _o1.put('reminders', r);
if (birthday.value && birthday.value !== customer.birthday) {
const cur = await _o1.get('objects', customer.id);
if (cur) await _o1.put('objects', { ...cur, birthday: birthday.value });
}
await _o1.logEvent(customer.id, 'payment', 'Lập lịch đóng tiền ' + _ox.rows.length + ' đợt, tổng ' + _o1.money(crm.sumRows(_ox.rows)), { plan: _om.value, project: _op.value });
_o1.toast('Đã lưu ' + rows.length + ' nhắc việc. Máy chủ sẽ nhắc qua Telegram.', 'success');
_ow.close();
if (opts.onSaved) opts.onSaved();
};
const _ow = _o1.modal({ wide: true, title: 'Lịch đóng tiền – ' + (customer.name || ''), testid: 'payment-planner', body: h('div', { class: 'bds-form' },
h('div', { class: 'bds-grid2' }, _o1.field('Dự án', _op), _o1.field('Phương án thanh toán', _om)),
h('div', { class: 'bds-grid2' }, h('div', null, _o1.field('Tổng giá căn', total), _oz), _o1.field('Ngày ký / giữ căn', start)),
h('div', { class: 'bds-grid2' }, _o1.field('Nhắc trước (ngày)', before), h('div', { class: 'bds-row bds-end' }, _o1.button('Tạo lịch', generate, { kind: 'primary', testid: 'pp-generate' }))),
h('p', { class: 'bds-muted' }, 'Mọi ô trong bảng đều sửa được. Phần ngân hàng giải ngân không tạo nhắc cho khách.'),
tableBox, sumBox,
_o1.button('+ Thêm đợt', addRow, { testid: 'pp-add' }),
h('h4', null, 'Mốc chăm sóc'),
h('div', { class: 'bds-grid2' }, _o1.field('Ngày bàn giao', handover), _o1.field('Sinh nhật khách', birthday)),
_o1.field('Hỏi giới thiệu (mặc định +6 tháng)', referral),
h('div', { class: 'bds-row bds-end' }, _o1.button('Huỷ', () => _ow.close()), _o1.button('Lưu lịch chăm sóc', save, { kind: 'primary', testid: 'pp-save' }))) });
_os();
return _ow;
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

import { g2kit, h, g2Selftest } from '../g2_lib/ui.js';
import * as O from '../g2_lib/ops.js';
import * as C from '../g2_lib/core.js';
const _of = n => String(n).padStart(2, '0');
const raw = v => { const { info, ...r } = v; return r; };
const _o1 = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
const _oe = !!(ctx.user && ctx.user.role === 'ctv');
let _o2 = Date.now();
el.innerHTML = '';
const _o3 = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-lich' }, G.head('Lịch xem nhà', K.button('+ Lịch xem', () => _oc(null), { kind: 'primary', testid: 'g2-view-add' })), _o3));
async function _oa() {
const [rems, customers] = await Promise.all([K.list('reminders'), G.customers()]);
return { list: O.viewingsOf(rems), customers, byId: new Map(customers.map(_o4 => [_o4.id, _o4])) };
}
async function _oh() {
const _o0 = await _oa();
const _ob = O.weekDays(_o2);
const _od = O.groupByDay(_o0.list, _ob);
const _om = C.vnDayStart(Date.now());
_o3.innerHTML = '';
const _o9 = C.vnParts(_ob[0]), d6 = C.vnParts(_ob[6]);
_o3.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('Tuần trước', () => { _o2 -= 7 * C.DAY; _oh(); }, { testid: 'g2-week-prev', icon: 'back' }),
h('strong', { 'data-testid': 'g2-week-label' }, _of(_o9.d) + '/' + _of(_o9.m) + ' – ' + _of(d6.d) + '/' + _of(d6.m) + '/' + d6.y),
K.button('Tuần này', () => { _o2 = Date.now(); _oh(); }, { icon: 'clock', testid: 'g2-week-now' }),
K.button('Tuần sau', () => { _o2 += 7 * C.DAY; _oh(); }, { testid: 'g2-week-next', icon: 'next' }),
K.button('Thêm vào lịch điện thoại', () => {
const _on = _o0.list.filter(v => !Number(v.done) && v.due_at >= Date.now() - C.DAY);
if (!_on.length) { K.toast('Chưa có lịch sắp tới', 'info'); return; }
G.download('lich-xem-nha.ics', O.toIcs(_on), 'text/calendar;charset=utf-8'); K.toast('Đã tải ' + _on.length + ' lịch – mở tệp để thêm vào lịch điện thoại', 'success');
}, { testid: 'g2-ics', icon: 'download', title: 'Tải tệp lịch (.ics) – mở tệp để thêm các buổi xem vào lịch của điện thoại' })));
const _oo = h('div', { class: 'g2-week', 'data-testid': 'g2-week' });
_od.forEach((d, i) => {
const dt = C.vnParts(d.start);
_oo.appendChild(h('div', { class: 'g2-day' + (d.start === _om ? ' today' : '') + (d.items.length ? '' : ' empty'), 'data-testid': 'g2-day-' + i },
h('h5', null, _o1[dt.wd] + ' ' + _of(dt.d) + '/' + _of(dt.m)),
d.items.map(v => {
const _o4 = _o0.byId.get(v.object_id);
return h('button', { type: 'button', class: 'g2-ev' + (Number(v.done) ? ' done' : ''), 'data-testid': 'g2-ev-' + v.id, onclick: () => _oc(v) },
C.vnHm(v.due_at) + ' ' + (_o4 ? _o4.name : '') + (v.info.project ? ' · ' + K.projectName(v.info.project) : ''));
})));
});
_o3.appendChild(_oo);
if (!_od.some(d => d.items.length)) _oo.before(h('p', { class: 'bds-muted', 'data-testid': 'g2-week-empty' }, 'Tuần này chưa có lịch xem nhà – bấm "Lịch xem" để thêm.'));
const _on = _o0.list.filter(v => !Number(v.done) && v.due_at >= Date.now()).slice(0, 10);
_o3.appendChild(K.card({ title: 'Sắp tới (' + _on.length + ')', testid: 'g2-upcoming', body: _on.length ? h('div', { class: 'bds-list' }, _on.map(v => {
const _o4 = _o0.byId.get(v.object_id);
return h('div', { class: 'bds-item' }, h('button', { type: 'button', class: 'bds-row-main', onclick: () => _oc(v) }, h('strong', null, G.dt(v.due_at) + ' – ' + (_o4 ? _o4.name : '')),
h('span', { class: 'bds-sub' }, [K.projectName(v.info.project), v.info.place, v.notified_at ? 'đã nhắc Telegram' : 'Telegram sẽ nhắc ' + (O.REMIND_OPTS.find(o => o[0] === Number(v.remind_before_days)) || [0, ''])[1].toLowerCase()].filter(Boolean).join(' · '))),
_o4 ? h('div', { class: 'bds-acts' }, K.callBtn(_o4, { short: true })) : null);
})) : K.empty('Chưa có lịch xem nhà sắp tới.') }));
_o3.appendChild(h('p', { class: 'bds-muted' }, 'Nhắc qua Telegram: máy chủ kiểm tra mỗi giờ và gửi tin tới Telegram đã nối trong Cài đặt → Kết nối.'));
}
async function _oc(v) {
const _o0 = await _oa();
const info = v ? v.info : {};
const at = v ? Number(v.due_at) : (() => { const t = C.vnParts(Date.now() + C.DAY); return C.vnStamp(t.y, t.m, t.d, 9, 0); })();
const _o8 = G.customerSelect(_o0.customers, v ? v.object_id : '', { 'data-testid': 'g2-v-customer' });
const date = h('input', { type: 'date', value: C.vnYmd(at), 'data-testid': 'g2-v-date' });
const _ol = h('input', { type: 'time', value: C.vnHm(at), 'data-testid': 'g2-v-time' });
const _og = K.select([['', '— Dự án —'], ...K.projects().map(p => [p.id, p.name])], info.project || '', { 'data-testid': 'g2-v-project' });
_o8.addEventListener('change', () => { const _o4 = _o0.byId.get(_o8.value); if (_o4 && _o4.project && !_og.value) _og.value = _o4.project; });
const place = h('input', { value: info.place || '', placeholder: 'VD: Nhà mẫu tầng 1 toà A', 'data-testid': 'g2-v-place' });
const unit = h('input', { value: info.unit || '', placeholder: 'VD: 2N căn 1208' });
const before = K.select(O.REMIND_OPTS, v ? Number(v.remind_before_days) : 1, { 'data-testid': 'g2-v-before' });
const note = h('textarea', { rows: 2 }, info.note || '');
const warn = h('p', { class: 'bds-warn', 'data-testid': 'g2-v-conflict' });
const _ok = () => C.vnFromInput(date.value, _ol.value);
const _o6 = () => { const _o7 = O.conflicts(_o0.list, _ok(), v && v.id); warn.textContent = _o7.length ? 'Trùng/sát giờ với ' + _o7.length + ' lịch khác (trong 60 phút).' : ''; };
[date, _ol].forEach(i => i.addEventListener('change', _o6));
let m;
const save = async () => {
const _o4 = _o0.byId.get(_o8.value);
try {
const _oi = O.viewingRow({ id: v ? v.id : K.newId(), customer: _o4, at: _ok(), project: _og.value, projectName: K.projectName(_og.value), place: place.value, unit: unit.value, note: note.value, before: Number(before.value) });
if (v) Object.assign(_oi, { done: v.done, notified_at: v.due_at === _oi.due_at && Number(v.remind_before_days) === _oi.remind_before_days ? v.notified_at : 0 });
await K.put('reminders', _oi);
if (!v) {
await K.logEvent(_o4.id, 'meeting', 'Hẹn xem nhà ' + G.dt(_oi.due_at) + (_og.value ? ' – ' + K.projectName(_og.value) : ''));
if (C.stageOf(_o4.status) < 4) { const _oj = C.statusForStage(4, K.statuses(_o4.need)); if (_oj) { const fresh = await K.get('objects', _o4.id); await K.put('objects', { ...fresh, status: _oj }); } }
}
} catch (e) { K.toast(e.message, 'warn'); return; }
m.close(); K.toast('Đã lưu lịch xem nhà', 'success'); _oh();
};
const _o5 = v && _o0.byId.get(v.object_id);
m = K.modal({ title: v ? 'Lịch xem nhà' : 'Lịch xem nhà mới', testid: 'g2-view-editor', body: [
K.field('Khách', _o8), h('div', { class: 'bds-grid2' }, K.field('Ngày', date), K.field('Giờ', _ol)), warn,
K.field('Dự án', _og), h('div', { class: 'bds-grid2' }, K.field('Điểm hẹn', place), K.field('Căn', unit)), K.field('Nhắc qua Telegram', before), K.field('Ghi chú', note),
h('div', { class: 'bds-row bds-wrap bds-end' },
v && _o5 ? K.button('Nhắn khách nhắc lịch', () => { m.close(); G.compose(_o5, null, { templateId: 'viewing_reminder', extra: { ngay: G.dt(v.due_at) } }); }, { testid: 'g2-v-remind', icon: 'chat' }) : null,
v && !Number(v.done) ? K.button('Đã xem', async () => {
await K.put('reminders', { ...raw(v), done: 1 });
if (_o5) { await K.logEvent(_o5.id, 'meeting', 'Đã xem nhà ' + K.projectName(v.info.project)); }
m.close(); K.toast('Đã đánh dấu – nhớ gửi tin cảm ơn sau buổi xem', 'success'); _oh();
if (_o5) G.compose(_o5, null, { templateId: 'after_viewing' });
}, { testid: 'g2-v-done', icon: 'check' }) : null,
v && !_oe ? K.button('Xoá', async () => {
if (!(await K.confirm({ title: 'Xoá lịch xem nhà', text: 'Xoá lịch ' + G.dt(v.due_at) + (_o5 ? ' – ' + _o5.name : '') + '? Nhắc Telegram của lịch này cũng bị huỷ.', ok: 'Xoá', kind: 'danger', testid: 'g2-v-del-c' }))) return;
await K.put('reminders', { ...raw(v), deleted: 1 }); m.close(); K.toast('Đã xoá lịch xem nhà', 'success'); _oh();
}, { kind: 'danger', testid: 'g2-v-del', icon: 'x' }) : null,
K.button('Lưu', save, { kind: 'primary', testid: 'g2-v-save' }))] });
_o6();
}
await _oh();
K.on(el, ['reminders'], _oh);
}
export default {
manifest: { id: 'g2_lich', title: 'Lịch xem nhà', icon: '📅', screen: 'customers', order: 230, version: '0.1.0', status: 'thu-nghiem', pack: 'care',
help: 'Lịch tuần các buổi xem nhà, báo trùng giờ, nhắc qua Telegram, nhắn khách nhắc lịch, tải tệp lịch cho điện thoại.' },
mount,
async selftest(ctx) { return g2Selftest(ctx, mount); },
};

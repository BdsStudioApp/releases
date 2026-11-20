import { g2kit, h, g2Selftest, crm } from '../g2_lib/ui.js';
import * as O from '../g2_lib/ops.js';
import * as C from '../g2_lib/core.js';
import * as V from '../g2_lib/viewing.js';
const _ok = n => String(n).padStart(2, '0');
const raw = v => { const { info, ...r } = v; return r; };
const _o0 = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
const isCtv = !!(ctx.user && ctx.user.role === 'ctv');
let _o2 = Date.now();
el.innerHTML = '';
const _o5 = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-lich' }, G.head('Lịch xem nhà', K.button('Hôm nay dẫn khách', () => todayList(), { testid: 'g2-today-btn', icon: 'customers' }), K.button('+ Lịch xem', () => _of(null), { kind: 'primary', testid: 'g2-view-add' })), _o5));
async function _oc() {
const [rems, customers] = await Promise.all([K.list('reminders'), G.customers()]);
return { list: O.viewingsOf(rems), customers, byId: new Map(customers.map(c => [c.id, c])) };
}
async function _oq() {
const D = await _oc();
const _od = O.weekDays(_o2);
const _og = O.groupByDay(D.list, _od);
const _ov = C.vnDayStart(Date.now());
_o5.innerHTML = '';
const _ob = C.vnParts(_od[0]), d6 = C.vnParts(_od[6]);
_o5.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('Tuần trước', () => { _o2 -= 7 * C.DAY; _oq(); }, { testid: 'g2-week-prev', icon: 'back' }),
h('strong', { 'data-testid': 'g2-week-label' }, _ok(_ob.d) + '/' + _ok(_ob.m) + ' – ' + _ok(d6.d) + '/' + _ok(d6.m) + '/' + d6.y),
K.button('Tuần này', () => { _o2 = Date.now(); _oq(); }, { icon: 'clock', testid: 'g2-week-now' }),
K.button('Tuần sau', () => { _o2 += 7 * C.DAY; _oq(); }, { testid: 'g2-week-next', icon: 'next' }),
K.button('Thêm vào lịch điện thoại', () => {
const _ow = D.list.filter(v => !Number(v.done) && v.due_at >= Date.now() - C.DAY);
if (!_ow.length) { K.toast('Chưa có lịch sắp tới', 'info'); return; }
G.download('lich-xem-nha.ics', O.toIcs(_ow), 'text/calendar;charset=utf-8'); K.toast('Đã tải ' + _ow.length + ' lịch – mở tệp để thêm vào lịch điện thoại', 'success');
}, { testid: 'g2-ics', icon: 'download', title: 'Tải tệp lịch (.ics) – mở tệp để thêm các buổi xem vào lịch của điện thoại' })));
const _ox = h('div', { class: 'g2-week', 'data-testid': 'g2-week' });
_og.forEach((d, i) => {
const dt = C.vnParts(d.start);
_ox.appendChild(h('div', { class: 'g2-day' + (d.start === _ov ? ' today' : '') + (d.items.length ? '' : ' empty'), 'data-testid': 'g2-day-' + i },
h('h5', null, _o0[dt.wd] + ' ' + _ok(dt.d) + '/' + _ok(dt.m)),
d.items.map(v => {
const c = D.byId.get(v.object_id);
return h('button', { type: 'button', class: 'g2-ev' + (Number(v.done) ? ' done' : ''), 'data-testid': 'g2-ev-' + v.id, onclick: () => _of(v) },
C.vnHm(v.due_at) + ' ' + (c ? c.name : '') + (v.info.project ? ' · ' + K.projectName(v.info.project) : ''),
V.needsResult(v) ? _om('g2-pending-' + v.id) : null);
})));
});
_o5.appendChild(_ox);
if (!_og.some(d => d.items.length)) _ox.before(h('p', { class: 'bds-muted', 'data-testid': 'g2-week-empty' }, 'Tuần này chưa có lịch xem nhà – bấm "Lịch xem" để thêm.'));
const _ol = V.pendingResults(D.list);
if (_ol.length) _o5.appendChild(K.card({ title: 'Chưa ghi kết quả (' + _ol.length + ')', testid: 'g2-pending-list', body: h('div', { class: 'bds-list' }, _ol.map(v => {
const c = D.byId.get(v.object_id);
return h('div', { class: 'bds-item' }, h('button', { type: 'button', class: 'bds-row-main', 'data-testid': 'g2-pending-open-' + v.id, onclick: () => _o1(v) },
h('strong', null, G.dt(v.due_at) + ' – ' + (c ? c.name : '')), _om()),
c ? h('div', { class: 'bds-acts' }, K.callBtn(c, { short: true })) : null);
})) }));
const _oo = D.list.filter(v => V.hasAfter(v) && Number(V.afterOf(v).at) >= Date.now() - 7 * C.DAY).sort((a, b) => V.afterOf(b).at - V.afterOf(a).at).slice(0, 5);
if (_oo.length) _o5.appendChild(K.card({ title: 'Kết quả buổi xem gần đây', testid: 'g2-recent', body: h('div', { class: 'bds-list' }, _oo.map(v => {
const c = D.byId.get(v.object_id);
return h('div', { class: 'bds-item' }, h('button', { type: 'button', class: 'bds-row-main', onclick: () => _of(v) },
h('strong', null, G.dt(v.due_at) + ' – ' + (c ? c.name : '')), h('span', { class: 'bds-sub' }, V.afterSummary(V.afterOf(v)))),
c ? h('div', { class: 'bds-acts' }, K.callBtn(c, { short: true })) : null);
})) }));
const _ow = D.list.filter(v => !Number(v.done) && v.due_at >= Date.now()).slice(0, 10);
_o5.appendChild(K.card({ title: 'Sắp tới (' + _ow.length + ')', testid: 'g2-upcoming', body: _ow.length ? h('div', { class: 'bds-list' }, _ow.map(v => {
const c = D.byId.get(v.object_id);
return h('div', { class: 'bds-item' }, h('button', { type: 'button', class: 'bds-row-main', onclick: () => _of(v) }, h('strong', null, G.dt(v.due_at) + ' – ' + (c ? c.name : '')),
h('span', { class: 'bds-sub' }, [K.projectName(v.info.project), v.info.place, v.notified_at ? 'đã nhắc Telegram' : 'Telegram sẽ nhắc ' + (O.REMIND_OPTS.find(o => o[0] === Number(v.remind_before_days)) || [0, ''])[1].toLowerCase()].filter(Boolean).join(' · '))),
c ? h('div', { class: 'bds-acts' }, K.callBtn(c, { short: true })) : null);
})) : K.empty('Chưa có lịch xem nhà sắp tới.') }));
_o5.appendChild(h('p', { class: 'bds-muted' }, 'Nhắc qua Telegram: máy chủ kiểm tra mỗi giờ và gửi tin tới Telegram đã nối trong Cài đặt → Kết nối.'));
}
function _om(testid) { return h('span', { class: 'g2-pend', 'data-testid': testid || null }, 'Chưa ghi kết quả'); }
async function _of(v, force) {
if (v && !force && V.needsResult(v)) return _o1(v);
const D = await _oc();
const info = v ? v.info : {};
const at = v ? Number(v.due_at) : (() => { const t = C.vnParts(Date.now() + C.DAY); return C.vnStamp(t.y, t.m, t.d, 9, 0); })();
const _oa = G.customerSelect(D.customers, v ? v.object_id : '', { 'data-testid': 'g2-v-customer' });
const date = h('input', { type: 'date', value: C.vnYmd(at), 'data-testid': 'g2-v-date' });
const _ou = h('input', { type: 'time', value: C.vnHm(at), 'data-testid': 'g2-v-time' });
const _on = K.select([['', '— Dự án —'], ...K.projects().map(p => [p.id, p.name])], info.project || '', { 'data-testid': 'g2-v-project' });
_oa.addEventListener('change', () => { const c = D.byId.get(_oa.value); if (c && c.project && !_on.value) _on.value = c.project; });
const place = h('input', { value: info.place || '', placeholder: 'VD: Nhà mẫu tầng 1 toà A', 'data-testid': 'g2-v-place' });
const unit = h('input', { value: info.unit || '', placeholder: 'VD: 2N căn 1208' });
const before = K.select(O.REMIND_OPTS, v ? Number(v.remind_before_days) : 1, { 'data-testid': 'g2-v-before' });
const note = h('textarea', { rows: 2 }, info.note || '');
const warn = h('p', { class: 'bds-warn', 'data-testid': 'g2-v-conflict' });
const _os = () => C.vnFromInput(date.value, _ou.value);
const _o8 = () => { const _o9 = O.conflicts(D.list, _os(), v && v.id); warn.textContent = _o9.length ? 'Trùng/sát giờ với ' + _o9.length + ' lịch khác (trong 60 phút).' : ''; };
[date, _ou].forEach(i => i.addEventListener('change', _o8));
let m;
const save = async () => {
const c = D.byId.get(_oa.value);
try {
const _or = O.viewingRow({ id: v ? v.id : K.newId(), customer: c, at: _os(), project: _on.value, projectName: K.projectName(_on.value), place: place.value, unit: unit.value, note: note.value, before: Number(before.value) });
if (v) Object.assign(_or, { done: v.done, notified_at: v.due_at === _or.due_at && Number(v.remind_before_days) === _or.remind_before_days ? v.notified_at : 0 });
await K.put('reminders', _or);
if (!v) {
await K.logEvent(c.id, 'meeting', 'Hẹn xem nhà ' + G.dt(_or.due_at) + (_on.value ? ' – ' + K.projectName(_on.value) : ''));
if (C.stageOf(c.status) < 4) { const st = C.statusForStage(4, K.statuses(c.need)); if (st) { const fresh = await K.get('objects', c.id); await K.put('objects', { ...fresh, status: st }); } }
}
} catch (e) { K.toast(e.message, 'warn'); return; }
m.close(); K.toast('Đã lưu lịch xem nhà', 'success'); _oq();
};
const _o6 = v && D.byId.get(v.object_id);
m = K.modal({ title: v ? 'Lịch xem nhà' : 'Lịch xem nhà mới', testid: 'g2-view-editor', body: [
K.field('Khách', _oa), h('div', { class: 'bds-grid2' }, K.field('Ngày', date), K.field('Giờ', _ou)), warn,
K.field('Dự án', _on), h('div', { class: 'bds-grid2' }, K.field('Điểm hẹn', place), K.field('Căn', unit)), K.field('Nhắc qua Telegram', before), K.field('Ghi chú', note),
v && V.hasAfter(v) ? h('p', { class: 'bds-muted', 'data-testid': 'g2-v-after' }, 'Sau buổi xem: ' + V.afterSummary(V.afterOf(v))) : null,
h('div', { class: 'bds-row bds-wrap bds-end' },
v && _o6 ? K.button('Nhắn khách nhắc lịch', () => { m.close(); G.compose(_o6, null, { templateId: 'viewing_reminder', extra: { ngay: G.dt(v.due_at) } }); }, { testid: 'g2-v-remind', icon: 'chat' }) : null,
v && !V.hasAfter(v) ? K.button('Đã xem', async () => { m.close(); await K.afterClose(); _o1(v); }, { testid: 'g2-v-done', icon: 'check' }) : null,
v && !isCtv ? K.button('Xoá', async () => {
if (!(await K.confirm({ title: 'Xoá lịch xem nhà', text: 'Xoá lịch ' + G.dt(v.due_at) + (_o6 ? ' – ' + _o6.name : '') + '? Nhắc Telegram của lịch này cũng bị huỷ.', ok: 'Xoá', kind: 'danger', testid: 'g2-v-del-c' }))) return;
await K.put('reminders', { ...raw(v), deleted: 1 }); m.close(); K.toast('Đã xoá lịch xem nhà', 'success'); _oq();
}, { kind: 'danger', testid: 'g2-v-del', icon: 'x' }) : null,
K.button('Lưu', save, { kind: 'primary', testid: 'g2-v-save' }))] });
_o8();
}
async function _o1(v) {
const c = await K.get('objects', v.object_id);
const pn = K.projectName(v.info.project);
const st = { objections: new Set(), decider: '', interest: '', callback: 'none' };
const _oh = {};
const _oe = (group, list, isOn, pick) => {
const _oy = _oh[group] || (_oh[group] = h('div', { class: 'g2-chips', role: 'group' }));
_oy.replaceChildren(...list.map(([id, label]) => h('button', {
type: 'button', class: 'bds-chip' + (isOn(id) ? ' bds-on' : ''), 'aria-pressed': String(isOn(id)), 'data-testid': 'g2-a-' + group + '-' + id,
onclick: () => { pick(id); _oe(group, list, isOn, pick); _ot(); },
}, label)));
return _oy;
};
const date = h('input', { type: 'date', value: C.vnYmd(Date.now() + C.DAY), 'data-testid': 'g2-a-date' });
const dateWrap = K.field('Ngày gọi lại', date);
const note = h('textarea', { rows: 2, maxlength: 500, placeholder: 'Ghi chú thêm (tuỳ chọn)', 'data-testid': 'g2-a-note' });
const _ot = () => { dateWrap.style.display = st.callback === 'pick' ? '' : 'none'; };
let m;
const save = async (thanks) => {
let a;
try { a = V.normalizeAfter({ objections: [...st.objections], decider: st.decider, interest: st.interest, note: note.value, callback: st.callback, date: date.value }); }
catch (e) { K.toast(e.message, 'warn'); return; }
try { await _op(v, c, a, pn); } catch (e) { K.toast((e && e.message) || 'Chưa lưu được', 'warn'); return; }
m.close();
K.toast('Đã ghi kết quả' + (a.callback_at ? ' – hẹn gọi lại ' + K.date(a.callback_at) : ''), 'success');
_oq();
if (thanks && c) { await K.afterClose(); G.compose(c, null, { templateId: 'after_viewing' }); }
};
m = K.modal({ title: 'Sau buổi xem' + (c ? ' – ' + c.name : ''), testid: 'g2-after', body: h('div', { class: 'g2-after' },
h('p', { class: 'bds-muted' }, [G.dt(v.due_at), pn, v.info.place].filter(Boolean).join(' · ')),
h('h4', null, 'Khách chê gì?'), _oe('obj', V.OBJECTIONS, id => st.objections.has(id), id => { if (st.objections.has(id)) st.objections.delete(id); else st.objections.add(id); }),
h('h4', null, 'Ai quyết định?'), _oe('dec', V.DECIDERS, id => st.decider === id, id => { st.decider = st.decider === id ? '' : id; }),
h('h4', null, 'Mức quan tâm'), _oe('int', V.INTEREST, id => st.interest === id, id => { st.interest = st.interest === id ? '' : id; }),
h('h4', null, 'Hẹn gọi lại'), _oe('cb', V.CALLBACKS, id => st.callback === id, id => { st.callback = id; }), dateWrap,
K.field('Ghi chú', note),
h('div', { class: 'bds-row bds-wrap bds-end' },
K.button('Sửa lịch hẹn', async () => { m.close(); await K.afterClose(); _of(v, true); }, { testid: 'g2-a-edit' }),
c ? K.button('Lưu & nhắn cảm ơn', () => save(true), { testid: 'g2-a-save-thanks' }) : null,
K.button('Lưu', () => save(false), { kind: 'primary', testid: 'g2-a-save' }))) });
_ot();
}
async function _op(v, c, a, pn) {
const fresh = (await K.get('reminders', v.id)) || raw(v);
await K.put('reminders', V.withAfter(fresh, a));
if (!c || Number(c.deleted)) return;
if (!Number(fresh.done)) await K.logEvent(c.id, 'meeting', 'Đã xem nhà ' + pn);
await K.logEvent(c.id, 'note', V.noteText(a, { projectName: pn, viewAt: v.due_at }), { g2: 'after_viewing', viewing_id: v.id });
const _oi = V.heatLevel(a.interest);
if (_oi) {
let tiers; try { tiers = crm.heatTiers(await K.setting('g2.score', null)); } catch { tiers = crm.heatTiers(null); }
const cur = (await K.get('objects', c.id)) || c;
const _o3 = crm.heatOf(cur, { tiers });
const _or = await K.put('objects', { ...cur, ...crm.heatPatch(cur, _oi) });
const _o4 = crm.heatOf(_or, { tiers });
if (_o3.id !== _o4.id || _o3.source !== _o4.source) await K.logEvent(c.id, 'heat', 'Mức quan tâm: ' + _o3.label + ' → ' + _o4.label + ' (sau buổi xem)', { from: _o3.id, to: _o4.id, manual: 1 });
}
const _o7 = V.callbackRow({ id: K.newId(), customer: c, after: a, viewingId: v.id, projectName: pn });
if (_o7) await K.put('reminders', _o7);
}
async function todayList() {
const D = await _oc();
const list = V.todayList(D.list);
let m;
const _oj = async v => { m.close(); await K.afterClose(); if (V.hasAfter(v)) _of(v, true); else _o1(v); };
m = K.modal({ title: 'Hôm nay dẫn khách (' + list.length + ')', testid: 'g2-today', body: list.length ? h('div', { class: 'bds-list' }, list.map(v => {
const c = D.byId.get(v.object_id);
const map = V.mapUrl(v.info.place);
return h('div', { class: 'bds-item', 'data-testid': 'g2-today-' + v.id },
h('button', { type: 'button', class: 'bds-row-main', 'data-testid': 'g2-today-open-' + v.id, onclick: () => _oj(v) },
h('strong', null, C.vnHm(v.due_at) + ' – ' + (c ? c.name : '(không thấy khách)')),
h('span', { class: 'bds-sub' }, [K.projectName(v.info.project), v.info.place].filter(Boolean).join(' · ') || 'Chưa có điểm hẹn'),
V.hasAfter(v) ? h('span', { class: 'bds-sub' }, V.afterSummary(V.afterOf(v))) : V.needsResult(v) ? _om() : null),
h('div', { class: 'bds-acts g2-today-acts' },
c ? K.callBtn(c, { short: true }) : null, c ? K.zaloBtn(c, { short: true }) : null,
map ? K.linkBtn('🗺️ Bản đồ', map, null, { target: '_blank', testid: 'g2-today-map-' + v.id }) : null));
})) : K.empty('Hôm nay chưa có lịch dẫn khách.') });
}
await _oq();
K.on(el, ['reminders'], _oq);
}
export default {
manifest: { id: 'g2_lich', title: 'Lịch xem nhà', icon: '📅', screen: 'customers', order: 230, version: '0.1.0', status: 'thu-nghiem', pack: 'care',
help: 'Lịch tuần các buổi xem nhà, báo trùng giờ, nhắc qua Telegram, nhắn khách nhắc lịch, tải tệp lịch cho điện thoại. Sau buổi xem: bấm chip ghi khách chê gì, ai quyết định, Nóng/Ấm/Lạnh, hẹn gọi lại – app tự ghi chú và tạo nhắc gọi lại. "Hôm nay dẫn khách": gọi, Zalo, bản đồ 1 chạm.' },
mount,
async selftest(ctx) { return g2Selftest(ctx, mount); },
};

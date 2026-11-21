import { g2kit, h, g2Selftest, crm } from '../g2_lib/ui.js';
import * as O from '../g2_lib/ops.js';
import * as C from '../g2_lib/core.js';
import * as V from '../g2_lib/viewing.js';
const _oj = n => String(n).padStart(2, '0');
const raw = v => { const { info, ...r } = v; return r; };
const _o0 = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
const isCtv = !!(ctx.user && ctx.user.role === 'ctv');
let _o2 = Date.now();
el.innerHTML = '';
const box = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-lich' }, G.headCore('Lịch xem nhà', K.button('Hôm nay dẫn khách', () => todayList(), { testid: 'g2-today-btn', icon: 'customers' }), K.button('+ Lịch xem', () => _oe(null), { kind: 'primary', testid: 'g2-view-add' })), box));
async function _ob() {
const [rems, customers] = await Promise.all([K.list('reminders'), G.customers()]);
return { list: O.viewingsOf(rems), customers, byId: new Map(customers.map(c => [c.id, c])) };
}
async function _op() {
const D = await _ob();
const _oc = O.weekDays(_o2);
const _of = O.groupByDay(D.list, _oc);
const _ou = C.vnDayStart(Date.now());
box.innerHTML = '';
const _oa = C.vnParts(_oc[0]), d6 = C.vnParts(_oc[6]);
box.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('Tuần trước', () => { _o2 -= 7 * C.DAY; _op(); }, { testid: 'g2-week-prev', icon: 'back' }),
h('strong', { 'data-testid': 'g2-week-label' }, _oj(_oa.d) + '/' + _oj(_oa.m) + ' – ' + _oj(d6.d) + '/' + _oj(d6.m) + '/' + d6.y),
K.button('Tuần này', () => { _o2 = Date.now(); _op(); }, { icon: 'clock', testid: 'g2-week-now' }),
K.button('Tuần sau', () => { _o2 += 7 * C.DAY; _op(); }, { testid: 'g2-week-next', icon: 'next' }),
K.button('Thêm vào lịch điện thoại', () => {
const _ov = D.list.filter(v => !Number(v.done) && v.due_at >= Date.now() - C.DAY);
if (!_ov.length) { K.toast('Chưa có lịch sắp tới', 'info'); return; }
G.download('lich-xem-nha.ics', O.toIcs(_ov), 'text/calendar;charset=utf-8'); K.toast('Đã tải ' + _ov.length + ' lịch – mở tệp để thêm vào lịch điện thoại', 'success');
}, { testid: 'g2-ics', icon: 'download', title: 'Tải tệp lịch (.ics) – mở tệp để thêm các buổi xem vào lịch của điện thoại' })));
const _ow = h('div', { class: 'g2-week', 'data-testid': 'g2-week' });
_of.forEach((d, i) => {
const dt = C.vnParts(d.start);
_ow.appendChild(h('div', { class: 'g2-day' + (d.start === _ou ? ' today' : '') + (d.items.length ? '' : ' empty'), 'data-testid': 'g2-day-' + i },
h('h5', null, _o0[dt.wd] + ' ' + _oj(dt.d) + '/' + _oj(dt.m)),
d.items.map(v => {
const c = D.byId.get(v.object_id);
return h('button', { type: 'button', class: 'g2-ev' + (Number(v.done) ? ' done' : ''), 'data-testid': 'g2-ev-' + v.id, onclick: () => _oe(v) },
C.vnHm(v.due_at) + ' ' + (c ? c.name : '') + (v.info.project ? ' · ' + K.projectName(v.info.project) : ''),
V.needsResult(v) ? _ol('g2-pending-' + v.id) : null);
})));
});
box.appendChild(_ow);
if (!_of.some(d => d.items.length)) _ow.before(h('p', { class: 'bds-muted', 'data-testid': 'g2-week-empty' }, 'Tuần này chưa có lịch xem nhà – bấm "Lịch xem" để thêm.'));
const _ok = V.pendingResults(D.list);
if (_ok.length) box.appendChild(K.card({ title: 'Chưa ghi kết quả (' + _ok.length + ')', testid: 'g2-pending-list', body: h('div', { class: 'bds-list' }, _ok.map(v => {
const c = D.byId.get(v.object_id);
return h('div', { class: 'bds-item' }, h('button', { type: 'button', class: 'bds-row-main', 'data-testid': 'g2-pending-open-' + v.id, onclick: () => _o1(v) },
h('strong', null, G.dt(v.due_at) + ' – ' + (c ? c.name : '')), _ol()),
c ? h('div', { class: 'bds-acts' }, K.callBtn(c, { short: true })) : null);
})) }));
const _on = D.list.filter(v => V.hasAfter(v) && Number(V.afterOf(v).at) >= Date.now() - 7 * C.DAY).sort((a, b) => V.afterOf(b).at - V.afterOf(a).at).slice(0, 5);
if (_on.length) box.appendChild(K.card({ title: 'Kết quả buổi xem gần đây', testid: 'g2-recent', body: h('div', { class: 'bds-list' }, _on.map(v => {
const c = D.byId.get(v.object_id);
return h('div', { class: 'bds-item' }, h('button', { type: 'button', class: 'bds-row-main', onclick: () => _oe(v) },
h('strong', null, G.dt(v.due_at) + ' – ' + (c ? c.name : '')), h('span', { class: 'bds-sub' }, V.afterSummary(V.afterOf(v)))),
c ? h('div', { class: 'bds-acts' }, K.callBtn(c, { short: true })) : null);
})) }));
const _ov = D.list.filter(v => !Number(v.done) && v.due_at >= Date.now()).slice(0, 10);
box.appendChild(K.card({ title: 'Sắp tới (' + _ov.length + ')', testid: 'g2-upcoming', body: _ov.length ? h('div', { class: 'bds-list' }, _ov.map(v => {
const c = D.byId.get(v.object_id);
return h('div', { class: 'bds-item' }, h('button', { type: 'button', class: 'bds-row-main', onclick: () => _oe(v) }, h('strong', null, G.dt(v.due_at) + ' – ' + (c ? c.name : '')),
h('span', { class: 'bds-sub' }, [K.projectName(v.info.project), v.info.place, v.notified_at ? 'đã nhắc Telegram' : 'Telegram sẽ nhắc ' + (O.REMIND_OPTS.find(o => o[0] === Number(v.remind_before_days)) || [0, ''])[1].toLowerCase()].filter(Boolean).join(' · '))),
c ? h('div', { class: 'bds-acts' }, K.callBtn(c, { short: true })) : null);
})) : K.empty('Chưa có lịch xem nhà sắp tới.') }));
box.appendChild(h('p', { class: 'bds-muted' }, 'Nhắc qua Telegram: máy chủ kiểm tra mỗi giờ và gửi tin tới Telegram đã nối trong Cài đặt → Kết nối.'));
}
function _ol(testid) { return h('span', { class: 'g2-pend', 'data-testid': testid || null }, 'Chưa ghi kết quả'); }
async function _oe(v, force) {
if (v && !force && V.needsResult(v)) return _o1(v);
const D = await _ob();
const info = v ? v.info : {};
const at = v ? Number(v.due_at) : (() => { const t = C.vnParts(Date.now() + C.DAY); return C.vnStamp(t.y, t.m, t.d, 9, 0); })();
const _o9 = G.customerSelect(D.customers, v ? v.object_id : '', { 'data-testid': 'g2-v-customer' });
const date = h('input', { type: 'date', value: C.vnYmd(at), 'data-testid': 'g2-v-date' });
const _ot = h('input', { type: 'time', value: C.vnHm(at), 'data-testid': 'g2-v-time' });
const _om = K.select([['', '— Dự án —'], ...K.projects().map(p => [p.id, p.name])], info.project || '', { 'data-testid': 'g2-v-project' });
_o9.addEventListener('change', () => { const c = D.byId.get(_o9.value); if (c && c.project && !_om.value) _om.value = c.project; });
const place = h('input', { value: info.place || '', placeholder: 'VD: Nhà mẫu tầng 1 toà A', 'data-testid': 'g2-v-place' });
const unit = h('input', { value: info.unit || '', placeholder: 'VD: 2N căn 1208' });
const before = K.select(O.REMIND_OPTS, v ? Number(v.remind_before_days) : 1, { 'data-testid': 'g2-v-before' });
const note = h('textarea', { rows: 2 }, info.note || '');
const warn = h('p', { class: 'bds-warn', 'data-testid': 'g2-v-conflict' });
const _or = () => C.vnFromInput(date.value, _ot.value);
const _o7 = () => { const _o8 = O.conflicts(D.list, _or(), v && v.id); warn.textContent = _o8.length ? 'Trùng/sát giờ với ' + _o8.length + ' lịch khác (trong 60 phút).' : ''; };
[date, _ot].forEach(i => i.addEventListener('change', _o7));
let m;
const save = async () => {
const c = D.byId.get(_o9.value);
try {
const _oq = O.viewingRow({ id: v ? v.id : K.newId(), customer: c, at: _or(), project: _om.value, projectName: K.projectName(_om.value), place: place.value, unit: unit.value, note: note.value, before: Number(before.value) });
if (v) Object.assign(_oq, { done: v.done, notified_at: v.due_at === _oq.due_at && Number(v.remind_before_days) === _oq.remind_before_days ? v.notified_at : 0 });
await K.put('reminders', _oq);
if (!v) {
await K.logEvent(c.id, 'meeting', 'Hẹn xem nhà ' + G.dt(_oq.due_at) + (_om.value ? ' – ' + K.projectName(_om.value) : ''));
if (C.stageOf(c.status) < 4) { const st = C.statusForStage(4, K.statuses(c.need)); if (st) { const fresh = await K.get('objects', c.id); await K.put('objects', { ...fresh, status: st }); } }
}
} catch (e) { K.toast(e.message, 'warn'); return; }
m.close(); K.toast('Đã lưu lịch xem nhà', 'success'); _op();
};
const _o5 = v && D.byId.get(v.object_id);
m = K.modal({ title: v ? 'Lịch xem nhà' : 'Lịch xem nhà mới', testid: 'g2-view-editor', body: [
K.field('Khách', _o9), h('div', { class: 'bds-grid2' }, K.field('Ngày', date), K.field('Giờ', _ot)), warn,
K.field('Dự án', _om), h('div', { class: 'bds-grid2' }, K.field('Điểm hẹn', place), K.field('Căn', unit)), K.field('Nhắc qua Telegram', before), K.field('Ghi chú', note),
v && V.hasAfter(v) ? h('p', { class: 'bds-muted', 'data-testid': 'g2-v-after' }, 'Sau buổi xem: ' + V.afterSummary(V.afterOf(v))) : null,
h('div', { class: 'bds-row bds-wrap bds-end' },
v && _o5 ? K.button('Nhắn khách nhắc lịch', () => { m.close(); G.compose(_o5, null, { templateId: 'viewing_reminder', extra: { ngay: G.dt(v.due_at) } }); }, { testid: 'g2-v-remind', icon: 'chat' }) : null,
v && !V.hasAfter(v) ? K.button('Đã xem', async () => { m.close(); await K.afterClose(); _o1(v); }, { testid: 'g2-v-done', icon: 'check' }) : null,
v && !isCtv ? K.button('Xoá', async () => {
if (!(await K.confirm({ title: 'Xoá lịch xem nhà', text: 'Xoá lịch ' + G.dt(v.due_at) + (_o5 ? ' – ' + _o5.name : '') + '? Nhắc Telegram của lịch này cũng bị huỷ.', ok: 'Xoá', kind: 'danger', testid: 'g2-v-del-c' }))) return;
await K.put('reminders', { ...raw(v), deleted: 1 }); m.close(); K.toast('Đã xoá lịch xem nhà', 'success'); _op();
}, { kind: 'danger', testid: 'g2-v-del', icon: 'x' }) : null,
K.button('Lưu', save, { kind: 'primary', testid: 'g2-v-save' }))] });
_o7();
}
async function _o1(v) {
const c = await K.get('objects', v.object_id);
const pn = K.projectName(v.info.project);
const st = { objections: new Set(), decider: '', interest: '', callback: 'none' };
const _og = {};
const _od = (group, list, isOn, pick) => {
const _ox = _og[group] || (_og[group] = h('div', { class: 'g2-chips', role: 'group' }));
_ox.replaceChildren(...list.map(([id, label]) => h('button', {
type: 'button', class: 'bds-chip' + (isOn(id) ? ' bds-on' : ''), 'aria-pressed': String(isOn(id)), 'data-testid': 'g2-a-' + group + '-' + id,
onclick: () => { pick(id); _od(group, list, isOn, pick); _os(); },
}, label)));
return _ox;
};
const date = h('input', { type: 'date', value: C.vnYmd(Date.now() + C.DAY), 'data-testid': 'g2-a-date' });
const dateWrap = K.field('Ngày gọi lại', date);
const note = h('textarea', { rows: 2, maxlength: 500, placeholder: 'Ghi chú thêm (tuỳ chọn)', 'data-testid': 'g2-a-note' });
const _os = () => { dateWrap.style.display = st.callback === 'pick' ? '' : 'none'; };
let m;
const save = async (thanks) => {
let a;
try { a = V.normalizeAfter({ objections: [...st.objections], decider: st.decider, interest: st.interest, note: note.value, callback: st.callback, date: date.value }); }
catch (e) { K.toast(e.message, 'warn'); return; }
try { await _oo(v, c, a, pn); } catch (e) { K.toast((e && e.message) || 'Chưa lưu được', 'warn'); return; }
m.close();
K.toast('Đã ghi kết quả' + (a.callback_at ? ' – hẹn gọi lại ' + K.date(a.callback_at) : ''), 'success');
_op();
if (thanks && c) { await K.afterClose(); G.compose(c, null, { templateId: 'after_viewing' }); }
};
m = K.modal({ title: 'Sau buổi xem' + (c ? ' – ' + c.name : ''), testid: 'g2-after', body: h('div', { class: 'g2-after' },
h('p', { class: 'bds-muted' }, [G.dt(v.due_at), pn, v.info.place].filter(Boolean).join(' · ')),
h('h4', null, 'Khách chê gì?'), _od('obj', V.OBJECTIONS, id => st.objections.has(id), id => { if (st.objections.has(id)) st.objections.delete(id); else st.objections.add(id); }),
h('h4', null, 'Ai quyết định?'), _od('dec', V.DECIDERS, id => st.decider === id, id => { st.decider = st.decider === id ? '' : id; }),
h('h4', null, 'Mức quan tâm'), _od('int', V.INTEREST, id => st.interest === id, id => { st.interest = st.interest === id ? '' : id; }),
h('h4', null, 'Hẹn gọi lại'), _od('cb', V.CALLBACKS, id => st.callback === id, id => { st.callback = id; }), dateWrap,
K.field('Ghi chú', note),
h('div', { class: 'bds-row bds-wrap bds-end' },
K.button('Sửa lịch hẹn', async () => { m.close(); await K.afterClose(); _oe(v, true); }, { testid: 'g2-a-edit' }),
c ? K.button('Lưu & nhắn cảm ơn', () => save(true), { testid: 'g2-a-save-thanks' }) : null,
K.button('Lưu', () => save(false), { kind: 'primary', testid: 'g2-a-save' }))) });
_os();
}
async function _oo(v, c, a, pn) {
const fresh = (await K.get('reminders', v.id)) || raw(v);
await K.put('reminders', V.withAfter(fresh, a));
if (!c || Number(c.deleted)) return;
if (!Number(fresh.done)) await K.logEvent(c.id, 'meeting', 'Đã xem nhà ' + pn);
await K.logEvent(c.id, 'note', V.noteText(a, { projectName: pn, viewAt: v.due_at }), { g2: 'after_viewing', viewing_id: v.id });
const _oh = V.heatLevel(a.interest);
if (_oh) {
let tiers; try { tiers = crm.heatTiers(await K.setting('g2.score', null)); } catch { tiers = crm.heatTiers(null); }
const cur = (await K.get('objects', c.id)) || c;
const _o3 = crm.heatOf(cur, { tiers });
const _oq = await K.put('objects', { ...cur, ...crm.heatPatch(cur, _oh) });
const _o4 = crm.heatOf(_oq, { tiers });
if (_o3.id !== _o4.id || _o3.source !== _o4.source) await K.logEvent(c.id, 'heat', 'Mức quan tâm: ' + _o3.label + ' → ' + _o4.label + ' (sau buổi xem)', { from: _o3.id, to: _o4.id, manual: 1 });
}
const _o6 = V.callbackRow({ id: K.newId(), customer: c, after: a, viewingId: v.id, projectName: pn });
if (_o6) await K.put('reminders', _o6);
}
async function todayList() {
const D = await _ob();
const list = V.todayList(D.list);
let m;
const _oi = async v => { m.close(); await K.afterClose(); if (V.hasAfter(v)) _oe(v, true); else _o1(v); };
m = K.modal({ title: 'Hôm nay dẫn khách (' + list.length + ')', testid: 'g2-today', body: list.length ? h('div', { class: 'bds-list' }, list.map(v => {
const c = D.byId.get(v.object_id);
const map = V.mapUrl(v.info.place);
return h('div', { class: 'bds-item', 'data-testid': 'g2-today-' + v.id },
h('button', { type: 'button', class: 'bds-row-main', 'data-testid': 'g2-today-open-' + v.id, onclick: () => _oi(v) },
h('strong', null, C.vnHm(v.due_at) + ' – ' + (c ? c.name : '(không thấy khách)')),
h('span', { class: 'bds-sub' }, [K.projectName(v.info.project), v.info.place].filter(Boolean).join(' · ') || 'Chưa có điểm hẹn'),
V.hasAfter(v) ? h('span', { class: 'bds-sub' }, V.afterSummary(V.afterOf(v))) : V.needsResult(v) ? _ol() : null),
h('div', { class: 'bds-acts g2-today-acts' },
c ? K.callBtn(c, { short: true }) : null, c ? K.zaloBtn(c, { short: true }) : null,
map ? K.linkBtn('🗺️ Bản đồ', map, null, { target: '_blank', testid: 'g2-today-map-' + v.id }) : null));
})) : K.empty('Hôm nay chưa có lịch dẫn khách.') });
}
await _op();
K.on(el, ['reminders'], _op);
}
export default {
manifest: { id: 'g2_lich', title: 'Lịch xem nhà', icon: '📅', screen: 'customers', order: 230, version: '0.1.0', status: 'ready', pack: 'core',
help: 'Lịch tuần các buổi xem nhà, báo trùng giờ, nhắc qua Telegram, nhắn khách nhắc lịch, tải tệp lịch cho điện thoại. Sau buổi xem: bấm chip ghi khách chê gì, ai quyết định, Nóng/Ấm/Lạnh, hẹn gọi lại – app tự ghi chú và tạo nhắc gọi lại. "Hôm nay dẫn khách": gọi, Zalo, bản đồ 1 chạm.' },
mount,
async selftest(ctx) { return g2Selftest(ctx, mount); },
};

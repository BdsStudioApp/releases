import { g3kit, h, parseData, selftestG3 } from '../g3_lib/ui.js';
import * as EV from '../g3_lib/events.js';
import { eventPage } from '../g3_lib/page.js';
import { slugify } from '../g3_lib/seo.js';
import * as B from '../g3_lib/bridge.js';
function _os(ms) { return ms ? new Date(ms + 7 * 3600e3).toISOString().slice(0, 16) : ''; }
function _oc(v) { const _oh = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/); return _oh ? Date.UTC(+_oh[1], +_oh[2] - 1, +_oh[3], +_oh[4] - 7, +_oh[5]) : 0; }
export function allRegistrants(_o8, events, customers) {
const _od = B.PREFIX.event + _o8.id;
const _oa = [];
const _on = new Set(events.filter(e => e.type === 'g3_reg' && parseData(e.data).event_id === _o8.id).map(e => e.object_id));
for (const _o3 of customers) {
const _o4 = parseData(_o3.data);
if (_on.has(_o3.id)) continue;
const _ow = events.find(e => e.object_id === _o3.id && parseData(e.data).landing_id === _od);
if (B.landingIdOf(_o4) === _od || (_o4.lp_last && _o4.lp_last.landing_id === _od) || _ow) _oa.push({ id: 'lp_' + _o3.id, object_id: _o3.id, type: 'g3_reg', at: _ow ? _ow.at : _o3.created_at, data: JSON.stringify({ event_id: _o8.id, via: 'landing' }) });
}
return EV.registrants(_o8.id, events.concat(_oa), customers);
}
export async function mount(el, ctx) {
const G = g3kit(ctx), K = G.K;
el.innerHTML = '';
const _op = h('div', { class: 'g3', 'data-testid': 'g3-events' });
el.appendChild(_op);
async function _oo() {
const [evs, events, customers] = await Promise.all([G.objs('g3_event'), K.list('events'), G.customers()]);
_op.innerHTML = '';
_op.appendChild(G.head('Sự kiện & livestream', 'Trang đăng ký, nhắc lịch, điểm danh và danh sách gọi lại sau sự kiện.', K.button('+ Sự kiện', () => _o6(null), { kind: 'primary', testid: 'ev-add' })));
if (G.isStaff) _op.appendChild(await _ox());
if (!evs.length) { _op.appendChild(K.empty('Chưa có sự kiện. Tạo sự kiện mở bán, hội thảo, livestream giới thiệu dự án…')); return; }
for (const _ok of evs.map(EV.eventView).sort((a, b) => b.start_at - a.start_at)) {
const list = allRegistrants(_ok, events, customers), n = EV.counts(list);
_op.appendChild(h('div', { class: 'g3-item', 'data-testid': 'ev-' + _ok.id },
h('div', { class: 'g3-row' }, h('strong', null, _ok.title), K.badge({ draft: 'Nháp', open: 'Đang nhận đăng ký', done: 'Đã xong' }[_ok.status], _ok.status === 'open' ? 'success' : 'muted')),
h('span', { class: 'g3-sub' }, [EV.whenText(_ok.start_at), EV.MODES[_ok.mode], _ok.seats ? _ok.seats + ' chỗ' : ''].filter(Boolean).join(' · ')),
h('span', { class: 'g3-sub', 'data-testid': 'ev-count-' + _ok.id }, `${n.total} đăng ký · ${n.attended} có mặt · ${n.absent} vắng`),
h('div', { class: 'g3-row' }, K.button('Quản lý', () => _oi(_ok.raw), { kind: 'primary', testid: 'ev-open-' + _ok.id }), K.button('Sửa', () => _o6(_ok.raw), { testid: 'ev-edit-' + _ok.id }))));
}
}
async function _ox() {
let _oq = null;
try { _oq = await K.api('g3.status', {}); } catch { _oq = null; }
const _ot = h('input', { type: 'password', class: 'g3-f', autocomplete: 'off', placeholder: G.demo() ? 'Xem thử: gõ demo-…' : 'Access token Zalo OA', 'data-testid': 'zns-token', style: 'min-height:44px;width:100%' });
const _ou = G.input({ inputmode: 'numeric', placeholder: 'Mã mẫu ZNS (dãy số)', 'data-testid': 'zns-template' });
const ready = _oq && _oq.zns && _oq.zns.token && _oq.zns.template;
return h('details', { 'data-testid': 'zns-card' }, h('summary', { style: 'min-height:44px;cursor:pointer' }, 'Nhắc khách qua Zalo OA (ZNS): ' + (_oq ? (ready ? '✅ đã cấu hình' : 'cần khoá Zalo OA + mẫu ZNS') : 'máy chủ chưa có chức năng này')),
h('p', { class: 'g3-sub' }, 'Cần: tài khoản Zalo OA đã xác thực, ứng dụng tại developers.zalo.me, mẫu ZNS đã được Zalo duyệt có tham số customer_name, event_name, event_time, location. Zalo tính phí từng tin ZNS gửi thành công. Nếu đã nối Zalo OA ở mục Zalo OA (cùng gói này), chỉ cần mã mẫu.'),
G.isOwner ? h('div', { class: 'g3' }, h('div', { class: 'g3-two' }, G.field('Access token', _ot), G.field('Mã mẫu ZNS', _ou)),
h('div', { class: 'g3-row' }, K.button('Lưu', async () => {
try { await K.api('g3.zns_config', { token: _ot.value.trim(), template_id: _ou.value.trim() }); K.toast('Đã lưu khoá Zalo OA', 'success'); _oo(); } catch (e) { K.toast(e && e.message || 'Chưa lưu được', 'warn'); }
}, { kind: 'primary', testid: 'zns-save' }), K.button('Xoá khoá', async () => { try { await K.api('g3.zns_config', { clear: true }); _oo(); } catch (e) { K.toast(e && e.message || 'Chưa làm được – thử lại sau ít phút.', 'warn'); } }, { testid: 'zns-clear' }))) : h('p', { class: 'g3-sub' }, 'Quản trị (Admin) nhập khoá.'));
}
function _o6(_ok) {
const e = _ok ? EV.eventView(_ok) : { title: '', project: '', mode: 'offline', start_at: 0, place: '', address: '', live_url: '', seats: 0, description: '', recording_url: '', status: 'open' };
const title = G.input({ value: e.title, maxlength: 120, 'data-testid': 'ev-title', placeholder: 'VD: Mở bán đợt 1 – chọn căn đẹp' });
const _ol = K.select([['', '– Dự án –'], ...K.projects().map(p => [p.id, p.name])], e.project, { 'data-testid': 'ev-project' });
const mode = K.select(Object.entries(EV.MODES), e.mode, { 'data-testid': 'ev-mode' });
const at = G.input({ type: 'datetime-local', value: _os(e.start_at), 'data-testid': 'ev-at' });
const place = G.input({ value: e.place, 'data-testid': 'ev-place', placeholder: 'Nhà mẫu / văn phòng' });
const _o1 = G.input({ value: e.address, 'data-testid': 'ev-address' });
const _oe = G.input({ value: e.live_url, inputmode: 'url', 'data-testid': 'ev-live', placeholder: 'Link livestream (Facebook/YouTube/TikTok/Zoom)' });
const seats = G.input({ value: e.seats || '', inputmode: 'numeric', 'data-testid': 'ev-seats', placeholder: '0 = không giới hạn' });
const _o5 = G.area({ rows: 3, 'data-testid': 'ev-desc' }); _o5.value = e.description;
const _om = G.input({ value: e.recording_url, inputmode: 'url', 'data-testid': 'ev-rec', placeholder: 'Link bản ghi (sau sự kiện)' });
const status = K.select([['draft', 'Nháp'], ['open', 'Đang nhận đăng ký'], ['done', 'Đã xong']], e.status, { 'data-testid': 'ev-status' });
const _or = K.sheet({ title: _ok ? 'Sửa sự kiện' : 'Sự kiện mới', testid: 'ev-form', body: [
G.field('Tên sự kiện', title), h('div', { class: 'g3-two' }, G.field('Dự án', _ol), G.field('Hình thức', mode)),
h('div', { class: 'g3-two' }, G.field('Thời gian bắt đầu', at), G.field('Số chỗ', seats)),
h('div', { class: 'g3-two' }, G.field('Địa điểm', place), G.field('Địa chỉ', _o1)), G.field('Link livestream', _oe), G.field('Giới thiệu ngắn', _o5),
h('div', { class: 'g3-two' }, G.field('Trạng thái', status), G.field('Link bản ghi', _om)),
_ok && G.canErase ? K.button('Xoá sự kiện', async () => {
const _o9 = _ok.id;
if (await G.deleteRow(_ok, { title: 'Xoá sự kiện?', text: 'Xoá "' + e.title + '" và các nhắc Telegram của sự kiện. Khách đã đăng ký vẫn giữ trong danh sách khách.',
after: async () => { for (const r of await K.list('reminders')) if (parseData(r.data).g3_event === _o9) await K.put('reminders', { ...r, deleted: 1 }); } })) { _or.close(); _oo(); }
}, { kind: 'danger', testid: 'ev-del' }) : null,
K.button('Lưu', async () => {
const t = title.value.trim(), _oq = _oc(at.value);
if (t.length < 3) return K.toast('Nhập tên sự kiện', 'warn');
if (!_oq) return K.toast('Chọn thời gian', 'warn');
for (const _ov of [_oe.value, _om.value]) if (_ov.trim() && !/^https:\/\//i.test(_ov.trim())) return K.toast('Link phải bắt đầu bằng https://', 'warn');
const prev = _ok ? parseData(_ok.data) : {};
await G.save('g3_event', { ...(_ok || {}), name: t, project: _ol.value, status: status.value }, { ...prev, mode: mode.value, start_at: _oq, place: place.value.trim(), address: _o1.value.trim(),
live_url: _oe.value.trim(), seats: Number(String(seats.value).replace(/\D/g, '')) || 0, description: _o5.value.trim(), recording_url: _om.value.trim(), slug: prev.slug || slugify(t) });
_or.close(); K.toast('Đã lưu sự kiện', 'success'); _oo();
}, { kind: 'primary', testid: 'ev-save' })] });
}
async function _oi(_ok) {
const _o8 = EV.eventView(_ok);
const [events, customers, reminders] = await Promise.all([K.list('events'), G.customers(), K.list('reminders')]);
const list = allRegistrants(_o8, events, customers);
const agent = await G.agent();
const _of = B.available() ? B.landingById(ctx, B.PREFIX.event + _o8.id) : null;
const _og = _of ? B.pageUrl(_of, G.endpoint()) : '';
const _ob = EV.followUps(_o8, list, { agent: agent.name });
const _oj = async (_o3, attended) => { await K.put('events', { object_id: _o3.id, type: 'g3_att', text: (attended ? 'Có mặt: ' : 'Vắng: ') + _o8.title, at: Date.now(), data: JSON.stringify({ event_id: _o8.id, attended }) }); _or.close(); await K.afterClose(); _oi(_ok); };
const custPick = K.select([['', '– Thêm người đăng ký có sẵn –'], ...customers.filter(_o3 => !list.some(r => r.customer.id === _o3.id)).slice(0, 300).map(_o3 => [_o3.id, _o3.name + (_o3.phone ? ' · ' + K.phone(_o3.phone) : '')])], '', { 'data-testid': 'ev-add-pick' });
const _or = K.sheet({ title: _o8.title, testid: 'ev-manage', body: [
h('p', { class: 'g3-sub' }, EV.whenText(_o8.start_at) + ' · ' + EV.MODES[_o8.mode]),
h('h4', null, '1. Trang đăng ký'),
B.available() && G.isOwner ? K.button(_of ? 'Cập nhật trang đăng ký (landing)' : 'Tạo trang đăng ký (landing)', async () => {
const _o0 = await B.env(ctx); const prof = await B.profile(ctx);
await B.saveLanding(ctx, B.eventLanding(_o8, { project: _o0.project(_o8.project), prof, existing: _of }));
K.toast(_of ? 'Đã cập nhật trang' : 'Đã tạo trang "Sự kiện – mở bán" – mở Trình tạo landing để thêm ảnh và xuất bản', 'success');
}, { kind: 'primary', testid: 'ev-to-landing' }) : null,
_og ? h('div', { class: 'g3-item' }, h('span', { class: 'g3-code', 'data-testid': 'ev-link' }, _og), K.button('Chép link', () => G.copy(_og), { testid: 'ev-copy-link' })) : (_of ? h('p', { class: 'g3-sub' }, 'Trang đã tạo – xuất bản trong Trình tạo landing để có link.') : null),
K.button('Tải trang đăng ký (.html)', async () => { G.download((_o8.slug || 'su-kien') + '.html', eventPage(_o8, { agent, endpoint: G.endpoint() }), 'text/html;charset=utf-8'); }, { testid: 'ev-dl' }),
_o8.status === 'open' ? null : G.note('Sự kiện không ở trạng thái "Đang nhận đăng ký" – trang đơn giản sẽ báo đóng đăng ký.'),
h('h4', null, '2. Nhắc lịch'),
h('div', { class: 'g3-row' },
K.button('Tạo nhắc Telegram (trước 1 ngày, 2 giờ)', async () => {
const rows = EV.reminderRows(_o8, await K.list('reminders'), { now: Date.now(), newId: K.newId, count: list.length });
for (const r of rows) await K.put('reminders', r);
K.toast(rows.length ? 'Đã tạo ' + rows.length + ' nhắc – máy chủ gửi Telegram đúng giờ' : 'Nhắc đã có hoặc sự kiện đã qua', rows.length ? 'success' : 'info');
}, { testid: 'ev-remind-tg' }),
G.isStaff ? K.button('Gửi danh sách qua Telegram ngay', async () => { try { const r = await K.api('g3.event_remind', { event_id: _o8.id, channel: 'telegram' }); K.toast(r.sent ? 'Đã gửi ' + r.count + ' người' : 'Chưa gửi được', r.sent ? 'success' : 'warn'); } catch (e) { K.toast(e && e.message || 'Chưa làm được – thử lại sau ít phút.', 'warn'); } }, { testid: 'ev-tg-now' }) : null,
G.isStaff ? K.button('Nhắc qua Zalo OA (ZNS)', async () => {
try {
const _o7 = await K.api('g3.event_remind', { event_id: _o8.id, channel: 'zns', estimate_only: true });
if (!_o7.ready) return K.toast('Cần khoá Zalo OA + mã mẫu ZNS (mục "Nhắc khách qua Zalo OA" ở trên)', 'warn');
const ok = await K.confirm({ title: 'Gửi ZNS?', text: `Gửi ${_o7.todo} tin ZNS (khách đã đồng ý, chưa nhắc mốc này). ${_o7.note}`, ok: 'Gửi', testid: 'ev-zns-confirm' });
if (!ok) return;
const r = await K.api('g3.event_remind', { event_id: _o8.id, channel: 'zns', slot: _o8.start_at - Date.now() > 6 * 3600e3 ? 'd1' : 'h2', confirm_paid: true });
K.toast(`Đã gửi ${r.sent} tin${r.failed ? ', lỗi ' + r.failed + (r.errors[0] ? ': ' + r.errors[0] : '') : ''}`, r.failed ? 'warn' : 'success');
} catch (e) { K.toast(e && e.message || 'Chưa làm được – thử lại sau ít phút.', 'warn'); }
}, { testid: 'ev-zns' }) : null),
h('h4', null, '3. Người đăng ký (' + list.length + ')'),
list.length ? h('div', { class: 'g3' }, _ob.map(r => h('div', { class: 'g3-item', 'data-testid': 'ev-reg', 'data-attended': String(r.attended) },
h('div', { class: 'g3-row' }, h('button', { type: 'button', class: 'bds-row-main', onclick: () => K.openProfile(r.customer.id) }, h('strong', null, r.customer.name), h('span', { class: 'g3-sub' }, ' ' + K.phone(r.customer.phone || ''))),
K.badge(r.attended === true ? 'Có mặt' : r.attended === false ? 'Vắng' : 'Chưa điểm danh', r.attended === true ? 'success' : r.attended === false ? 'warn' : 'muted')),
h('div', { class: 'g3-row' }, K.button('Có mặt', () => _oj(r.customer, true), { testid: 'ev-att-yes' }), K.button('Vắng', () => _oj(r.customer, false), { testid: 'ev-att-no' }),
K.button('Chép tin nhắc', () => G.copy(EV.reminderText(_o8, r.customer, { agent: agent.name })), { testid: 'ev-copy-remind' }), K.zaloBtn(r.customer, { short: true })),
r.text ? h('div', { class: 'g3-follow' }, h('small', { class: 'g3-sub' }, '↳ ' + r.text), K.button(r.action === 'call' ? 'Chép tin cảm ơn' : 'Chép tin gửi bản ghi', () => G.copy(r.text), { testid: 'ev-copy-follow' })) : null))) : K.empty('Chưa có ai đăng ký.'),
h('div', { class: 'g3-row' }, custPick, K.button('Thêm', async () => {
const _o3 = customers.find(x => x.id === custPick.value); if (!_o3) return K.toast('Chọn khách', 'warn');
await K.put('events', { object_id: _o3.id, type: 'g3_reg', text: 'Đăng ký: ' + _o8.title, at: Date.now(), data: JSON.stringify({ event_id: _o8.id, via: 'manual' }) });
_or.close(); await K.afterClose(); _oi(_ok);
}, { testid: 'ev-add-reg' })),
h('h4', null, '4. Sau sự kiện'),
K.button('Hẹn gọi lại người có mặt (9h mai)', async () => {
const _o2 = list.filter(r => r.attended === true);
const due = (() => { const _o4 = new Date(Date.now() + 7 * 3600e3); return Date.UTC(_o4.getUTCFullYear(), _o4.getUTCMonth(), _o4.getUTCDate() + 1, 2, 0); })();
const todo = EV.followRows(_o8, _o2.map(r => r.customer), await K.list('reminders'), { due });
for (const r of todo) await K.put('reminders', r);
K.toast(!_o2.length ? 'Chưa có ai được điểm danh "Có mặt"' : todo.length ? 'Đã tạo ' + todo.length + ' việc gọi lại' : 'Các việc gọi lại đã có rồi', todo.length ? 'success' : 'info');
}, { testid: 'ev-follow' }),
] });
}
await _oo();
K.on(el, ['objects', 'events'], () => { if (!_op.querySelector('input:focus, textarea:focus, select:focus')) _oo(); });
}
export default {
manifest: { id: 'g3_events', title: 'Sự kiện & livestream', icon: '🎤', screen: 'customers', order: 57, version: '0.1.0', status: 'ready',
help: 'Tạo sự kiện mở bán/hội thảo/livestream: trang đăng ký (mẫu Trình tạo landing), nhắc lịch Telegram + Zalo OA (nếu có), điểm danh, danh sách gọi lại sau sự kiện.' },
mount,
async selftest(ctx) {
const rows = EV.reminderRows({ id: 'e', title: 'T', start_at: Date.now() + 3 * 86400000 }, [], { newId: () => 'x' + Math.random() });
if (rows.length !== 2) return { ok: false, details: 'Nhắc sự kiện sai' };
return selftestG3(ctx);
},
};

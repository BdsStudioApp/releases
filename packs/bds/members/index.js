import { kit, h } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import * as L from './logic.js';
import { ensureMembersCss, loadMembers, memberPicker, openReassign, renderDupList, renderDataStatus } from './panel.js';
const _o0 = { call: '📞', zalo: '💬', note: '📝', status: '🔁', meeting: '📅', quote: '🧾', payment: '💳' };
const _o7 = (e, fb) => (e && (e.userMessage || e.message)) || fb;
export async function mount(el, ctx) {
const _o1 = kit(ctx);
ensureMembersCss();
const F = L.mxFlags(ctx.user);
const _ov = L.readOnlyApi((a, p) => _o1.api(a, p));
const _ok = new URLSearchParams((location.hash.split('?')[1]) || '');
const _os = { tab: _ok.get('tab') || 'member', member: _ok.has('m') ? _ok.get('m') : null, members: [], cache: new Map(), q: '', page: 1,
search: { q: '', rows: [], total: 0, offset: 0, more: false, done: false } };
const _op = h('div', { class: 'bds-screen', 'data-testid': 'mx-screen' });
el.replaceChildren(_op);
const _of = (id) => (id === '' ? 'Kho chung' : L.memberName(_os.members.find((_ob) => _ob.id === id)) || 'nhân viên');
try { _os.members = (await loadMembers(_o1)).members; } catch (e) { _op.replaceChildren(_oa(), _o1.empty(_o7(e, 'Chưa tải được danh sách nhân viên.'))); return; }
function _oa() { return h('div', { class: 'bds-head' }, h('h2', null, '🏢 Khách toàn công ty')); }
const _ot = () => [['member', 'Theo nhân viên', 'user'], ['search', 'Tìm toàn công ty', '🔎'], F.move ? ['move', 'Chuyển khách', 'send'] : null,
['dup', 'Số trùng', '📞'], F.status ? ['status', 'Tình trạng dữ liệu', 'shield'] : null].filter(Boolean);
function _on() {
const _ou = _ot();
if (!_ou.some((t) => t[0] === _os.tab)) _os.tab = 'member';
const bar = h('div', { class: 'bds-row bds-wrap mx-tabs', role: 'tablist', 'data-testid': 'mx-tabs' }, _ou.map(([k, l, ic]) =>
_o1.button(l, () => { _os.tab = k; _on(); }, { kind: _os.tab === k ? 'primary' : 'ghost', icon: ic, testid: 'mx-tab-' + k })));
const body = h('div', { 'data-testid': 'mx-body-' + _os.tab });
_op.replaceChildren(_oa(), bar, body);
if (_os.tab === 'member') _oc(body);
else if (_os.tab === 'search') _oq(body);
else if (_os.tab === 'move') _od(body);
else if (_os.tab === 'dup') renderDupList(body, ctx, { onView: (_ob, _o2) => _og(_ob, _o2) });
else renderDataStatus(body, ctx, { onReassign: (_ob) => openReassign(ctx, { from: _ob.id, onDone: () => _os.cache.clear() }) });
}
async function dataOf(_ob) {
if (_os.cache.has(_ob)) return _os.cache.get(_ob);
const _ol = await _ov('members.view', { member_id: _ob, limit: 5000 });
const _o3 = (_ol && _ol.changes) || {};
const _o5 = { objects: L.liveCustomers(_o3.objects), events: (_o3.events || []).filter((x) => Number(x.deleted) !== 1), reminders: (_o3.reminders || []).filter((x) => Number(x.deleted) !== 1), quotes: _o3.quotes || [], member: _ol && _ol.member };
_os.cache.set(_ob, _o5);
return _o5;
}
function _oc(body) {
const _oj = memberPicker(_o1, _os.members, { value: _os.member || '', pool: true, testid: 'mx-member', label: 'Xem khách của', onPick: (id) => { _os.member = id; _os.page = 1; _os.q = ''; _o6(); } });
if (_os.member !== null) _oj.value = _os.member;
const _oh = h('div', { 'data-testid': 'mx-member-out' });
body.append(_o1.field('Xem khách của', _oj.el), _oh);
if (_os.member === null) _oh.replaceChildren(h('p', { class: 'bds-muted' }, 'Chọn một nhân viên (hoặc Kho chung) để xem khách – chỉ xem, không sửa được.'));
else _o6();
async function _o6() {
const _ob = _os.member;
_oh.replaceChildren(h('p', { class: 'bds-muted' }, 'Đang tải khách của ' + _of(_ob) + '…'));
let _o5;
try { _o5 = await dataOf(_ob); } catch (e) { _oh.replaceChildren(_o1.empty(_o7(e, 'Chưa tải được dữ liệu.'))); return; }
if (_os.member !== _ob) return;
const due = crm.nextDueByCustomer(_o5.reminders);
const search = h('input', { type: 'search', value: _os.q, placeholder: 'Tìm tên, số điện thoại…', 'aria-label': 'Tìm trong khách của ' + _of(_ob), 'data-testid': 'mx-filter', oninput: (e) => { _os.q = e.target.value; _os.page = 1; _oi(); } });
const _o4 = h('span', { class: 'bds-muted', 'data-testid': 'mx-count' });
const list = h('div', { class: 'bds-list mx-ro', 'data-testid': 'mx-list' });
const more = h('div', { class: 'mx-more' });
const _oi = () => {
const rows = L.filterLocal(_o5.objects, _os.q), shown = rows.slice(0, _os.page * L.PAGE);
_o4.textContent = rows.length + ' khách' + (rows.length > shown.length ? ' · đang hiện ' + shown.length : '');
list.replaceChildren(...(shown.length ? shown.map((_o2) => _oo(_o2, { due: due.get(_o2.id), open: () => _og(_ob, _o2.id) })) : [_o1.empty(_o5.objects.length ? 'Không có khách khớp.' : _of(_ob) + ' chưa có khách nào.')]));
more.replaceChildren(rows.length > shown.length ? _o1.button('Xem thêm ' + Math.min(L.PAGE, rows.length - shown.length) + ' khách', () => { _os.page++; _oi(); }, { icon: 'plus', testid: 'mx-more' }) : '');
};
_oh.replaceChildren(banner(_ob),
h('div', { class: 'bds-toolbar' }, search, _o4),
F.move && _ob !== '' ? h('div', { class: 'bds-row bds-tools' }, _o1.button('Chuyển khách của ' + _of(_ob) + '…', () => openReassign(ctx, { from: _ob, onDone: () => { _os.cache.delete(_ob); _o6(); } }), { kind: 'ghost', icon: 'send', testid: 'mx-reassign-from' })) : null,
list, more);
_oi();
}
}
function banner(_ob) {
return h('div', { class: 'mx-banner', role: 'note', 'data-testid': 'ro-banner' }, '🔒', h('div', null, 'Chỉ xem – khách của ' + _of(_ob),
h('small', null, 'Dữ liệu nằm ở Sheet riêng của ' + (_ob === '' ? 'công ty (kho chung)' : _of(_ob)) + '. Muốn đổi người chăm sóc: dùng "Chuyển khách".')));
}
function _oo(_o2, { due, owner, open }) {
return h('div', { class: 'bds-item', 'data-id': _o2.id, 'data-testid': 'ro-row' },
h('button', { type: 'button', class: 'bds-row-main', onclick: open, 'data-testid': 'ro-open-' + _o2.id },
h('strong', { class: 'bds-name' }, _o2.name || '(chưa có tên)'),
h('span', { class: 'bds-sub' }, [_o1.projectName(_o2.project), _o2.unit_type, _o1.phone(_o2.phone)].filter(Boolean).join(' · ')),
owner ? h('span', { class: 'bds-owner' }, 'Của: ' + owner) : null,
due ? h('span', { class: 'bds-sub' }, 'Hẹn: ' + _o1.date(due)) : null),
_o1.badge(_o2.status || 'Mới', crm.statusTone(_o2.status)));
}
async function _og(_ob, id) {
let _o5;
try { _o5 = await dataOf(_ob); } catch (e) { _o1.toast(_o7(e, 'Chưa mở được hồ sơ'), 'danger'); return; }
const _o2 = _o5.objects.find((x) => x.id === id);
if (!_o2) { _o1.toast('Khách này không còn ở chỗ ' + _of(_ob) + ' (đã chuyển hoặc đã xoá).', 'warn'); _os.cache.delete(_ob); return; }
const _o8 = crm.eventsOf(_o5.events, id);
const _om = _o5.reminders.filter((_ol) => _ol.object_id === id && !Number(_ol.done)).sort((a, b) => a.due_at - b.due_at);
const _oe = _o5.quotes.filter((q) => q.object_id === id && Number(q.deleted) !== 1).length;
let _or;
const body = h('div', { class: 'bds-profile mx-ro', 'data-testid': 'ro-profile' },
banner(_ob),
h('div', { class: 'bds-pf-top' },
h('div', { class: 'bds-row' }, _o1.badge(_o2.status || 'Mới', crm.statusTone(_o2.status))),
h('dl', { class: 'bds-dl' }, L.profileRows(_o2, (p) => _o1.projectName(p)).map(([k, v]) => [h('dt', null, k), h('dd', null, k === 'Điện thoại' && _o2.phone ? h('a', { href: _o1.tel(_o2.phone) }, _o1.phone(_o2.phone)) : v)]),
_oe ? [h('dt', null, 'Báo giá'), h('dd', null, String(_oe))] : null),
_o2.note ? h('p', { class: 'bds-note' }, _o2.note) : null),
_om.length ? h('h4', null, 'Việc sắp tới') : null,
_om.length ? h('ul', { class: 'bds-rem' }, _om.slice(0, 8).map((_ol) => h('li', null, h('span', null, _o1.date(_ol.due_at)), ' ', _ol.title || _ol.kind))) : null,
h('h4', null, 'Dòng thời gian'),
_o8.length ? h('ol', { class: 'bds-timeline' }, _o8.slice(0, 100).map((e) => h('li', { 'data-type': e.type },
h('span', { class: 'bds-ti' }, _o0[e.type] || '•'),
h('div', null, h('small', { class: 'bds-muted' }, _o1.date(e.at) + ' ' + crm.hm(e.at)), h('div', null, e.text || e.type))))) : _o1.empty('Chưa có hoạt động.'),
h('div', { class: 'bds-row bds-end' },
F.move && _ob !== '' ? _o1.button('Chuyển khách này…', () => { _or.close(); _o1.afterClose(() => openReassign(ctx, { from: _ob, preIds: [id], onDone: () => _os.cache.delete(_ob) })); }, { kind: 'ghost', icon: 'send', testid: 'ro-reassign' }) : null,
_o1.button('Đóng', () => _or.close(), { icon: 'x', testid: 'ro-close' })));
_or = _o1.sheet({ title: _o2.name || 'Hồ sơ khách', body, testid: 'ro-profile-sheet' });
}
function _oq(body) {
const S = _os.search;
const input = h('input', { type: 'search', value: S.q, placeholder: 'Tên, số điện thoại, email, ghi chú…', 'aria-label': 'Tìm khách toàn công ty', 'data-testid': 'mx-q',
onkeydown: (e) => { if (e.key === 'Enter') { e.preventDefault(); _o9(true); } } });
const info = h('p', { class: 'bds-muted', 'data-testid': 'mx-search-info' });
const list = h('div', { class: 'bds-list mx-ro', 'data-testid': 'mx-results' });
const more = h('div', { class: 'mx-more' });
body.append(h('div', { class: 'mx-banner', role: 'note' }, '🔒', h('div', null, 'Chỉ xem – khách của mọi nhân viên và kho chung', h('small', null, 'Máy chủ tìm trên Sheet riêng của từng người; app không lưu khách của người khác vào máy.'))),
h('div', { class: 'bds-toolbar' }, input, _o1.button('Tìm', () => _o9(true), { kind: 'primary', icon: '🔎', testid: 'mx-search' })), info, list, more);
_oi();
async function _o9(reset) {
if (reset) { S.q = input.value.trim(); S.offset = 0; S.rows = []; }
info.textContent = 'Đang tìm…';
let _ol;
try { _ol = await _ov('members.view', S.q ? { q: S.q, offset: S.offset, limit: L.PAGE } : { all: true, offset: S.offset, limit: L.PAGE }); } catch (e) { info.textContent = _o7(e, 'Chưa tìm được.'); return; }
S.rows = S.rows.concat(_ol.rows || []); S.total = Number(_ol.total) || 0; S.more = !!_ol.more; S.offset = S.rows.length; S.done = true;
_oi();
}
function _oi() {
if (!S.done) { info.textContent = 'Gõ tên hoặc số rồi bấm Tìm (để trống = xem tất cả, 50 khách mỗi trang).'; return; }
info.textContent = S.total ? 'Tìm thấy ' + S.total + ' khách' + (S.q ? ' khớp "' + S.q + '"' : '') + ' · đang hiện ' + S.rows.length : 'Không tìm thấy khách nào' + (S.q ? ' khớp "' + S.q + '"' : '') + '.';
list.replaceChildren(...S.rows.map((_o2) => _oo(_o2, { owner: _o2._mn || _of(_o2._m), open: () => _og(_o2._m, _o2.id) })));
more.replaceChildren(S.more ? _o1.button('Xem thêm', () => _o9(false), { icon: 'plus', testid: 'mx-search-more' }) : '');
}
}
function _od(body) {
body.append(_o1.card({ title: '🔁 Chuyển khách giữa nhân viên', testid: 'mx-move-card', body: [
h('p', null, 'Chuyển khách của một người (vd nhân viên nghỉ việc) sang người khác: tất cả hoặc chọn từng khách. Lịch sử, lịch hẹn, báo giá đi theo khách; người cũ không còn thấy. Lý do được ghi vào nhật ký.'),
h('div', { class: 'bds-row' }, _o1.button('Chuyển khách…', () => openReassign(ctx, { onDone: () => _os.cache.clear() }), { kind: 'primary', icon: 'send', testid: 'mx-move-open' }))] }));
}
_on();
}
export const manifest = {
id: 'members', title: 'Khách toàn công ty', icon: '🏢', screen: 'customers', order: 11, version: '1.0.0', status: 'ready', requires: 'mx_view',
desc: 'Bản Công ty: xem khách của từng nhân viên (chỉ xem), tìm toàn công ty, chuyển khách, số trùng giữa nhân viên.'
};
export default { mount, manifest };

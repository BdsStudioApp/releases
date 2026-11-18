import * as M from './machine.js';
import {
adminNote, permTable, stepper, peopleEditor, validatePeople, toPeople, resizeGroup, inviteBase, invitesList, seatsText, maxPeople, quotaWarn, usersPath
} from '../invites.e08b00346c.js';
const cur = (st) => ({ sale: 0, manager: 0, rows: [], created: [], ...((st && st.data && st.data.doingu) || {}) });
export function doinguCheck(state) {
const _o4 = cur(state);
const rows = Array.isArray(_o4.rows) ? _o4.rows : [];
const _oa = Array.isArray(_o4.created) ? _o4.created.length : 0;
if (!rows.length) return { ok: true, msg: _oa ? 'Đã tạo ' + _oa + ' lời mời – chờ nhân viên bấm link trong email' : 'Chưa mời ai – mời sau ở ' + usersPath() };
const _oc = validatePeople(rows);
if (_oc.length) {
return { ok: false, cause: 'Còn ' + new Set(_oc.map((p) => p.i)).size + ' người chưa đủ họ tên hoặc email.', fix: 'Điền họ tên và email (bắt buộc) cho từng người rồi bấm "Tạo lời mời và gửi email". Chưa cần thì đưa số người về 0 hoặc bấm "Bỏ qua bước này".' };
}
return { ok: false, cause: 'Chưa tạo lời mời cho ' + rows.length + ' người.', fix: 'Bấm "Tạo lời mời và gửi email" bên trên.' };
}
export function doinguWidget(ctl, { ui, rerender }) {
const { h, button } = ui;
const api = ctl.api;
const _oe = (p) => { ctl.set(M.setData(ctl.state, { doingu: { ...cur(ctl.state), ...p } })); };
const _o4 = cur(ctl.state);
let rows = (_o4.rows || []).map((r) => ({ ...r }));
let seats = null, quota = null, reg = null;
const _of = (ctl.state || {}).data || {};
const _o5 = _of.domain || {};
const domain = (_of.coDomain && _of.coDomain.domain) || (_o5.mode === 'custom' && _o5.host) || (ctl.instance && Array.isArray(ctl.instance.domains) && ctl.instance.domains[0]) || '';
const _og = (ctl.getUser && ctl.getUser()) || {};
const _o0 = h('div', { class: 'wiz-box', 'data-testid': 'wiz-doingu' });
const _o8 = h('div', { 'data-testid': 'doingu-invites' });
const editorBox = h('div');
const warnEl = h('p', { class: 'inv-warn small', 'data-testid': 'doingu-quota', hidden: true });
const err = h('p', { class: 'form-err', role: 'alert', 'data-testid': 'doingu-err' });
const permBox = h('div', null, permTable(ui));
let _o6 = null;
const saleSt = stepper(ui, { label: 'Muốn tạo sẵn bao nhiêu nhân viên bán hàng (Sale)?', value: rows.filter((r) => r.g === 'sale').length, testid: 'doingu-sale',
onChange: (n) => { rows = resizeGroup(rows, 'sale', n, 'sale'); _o1(); } });
const mgrSt = stepper(ui, { label: 'Quản lý / Trưởng nhóm (tuỳ chọn)', value: rows.filter((r) => r.g === 'manager').length, testid: 'doingu-manager',
hint: 'Trưởng nhóm lo nhóm sale của mình (chia lead, thu hồi, báo cáo nhóm); xem khách toàn công ty khi anh/chị tick quyền đó. Không vào cài đặt chung.', onChange: (n) => { rows = resizeGroup(rows, 'manager', n, 'manager'); _o1(); } });
const mktSt = stepper(ui, { label: 'Marketing (tuỳ chọn)', value: rows.filter((r) => r.g === 'marketing').length, testid: 'doingu-marketing',
hint: 'Nhập lead quảng cáo vào Kho lead, đẩy số cho sale/nhóm, xem báo cáo nguồn lead. Không xem khách riêng của sale.', onChange: (n) => { rows = resizeGroup(rows, 'marketing', n, 'marketing'); _o1(); } });
mktSt.hidden = !rows.some((r) => r.g === 'marketing');
const _o3 = button('Tạo lời mời và gửi email', () => _o2(), { kind: 'primary', icon: 'mail', testid: 'doingu-create' });
_o0.append(
h('p', { class: 'inv-admin', 'data-testid': 'doingu-admin' }, '✅ ', _og.username ? h('strong', null, '@' + _og.username + ': ') : null, adminNote()),
saleSt, mgrSt, mktSt, editorBox, warnEl,
h('div', { class: 'btn-row' }, _o3), err,
h('h4', { class: 'section-title' }, 'Mỗi vai trò được làm gì?'), permBox,
h('h4', { class: 'section-title' }, 'Lời mời đã tạo'), _o8);
_ob();
_o9();
return _o0;
function _o1() { _oe({ rows, sale: saleSt.value(), manager: mgrSt.value(), marketing: mktSt.value() }); _ob(); _o7(); }
function _o7() {
const max = maxPeople(seats), all = saleSt.value() + mgrSt.value() + mktSt.value();
saleSt.setMax(Math.max(0, max - all + saleSt.value())); mgrSt.setMax(Math.max(0, max - all + mgrSt.value())); mktSt.setMax(Math.max(0, max - all + mktSt.value()));
saleSt.setHint(seatsText(seats) || 'Để 0 nếu chưa cần. Mỗi lần tạo tối đa ' + max + ' người.');
warnEl.textContent = quotaWarn(rows.length, quota); warnEl.hidden = !warnEl.textContent;
}
function _ob() {
_o6 = rows.length ? peopleEditor(ui, { rows, onChange: () => _oe({ rows }), reg, domain, testid: 'doingu-people' }) : null;
ui.mountTo(editorBox, _o6 || h('p', { class: 'muted small', 'data-testid': 'doingu-empty' }, 'Chưa chọn ai. Bấm + ở trên để thêm, hoặc bấm "Bỏ qua bước này" bên dưới.'));
_o3.hidden = !rows.length;
}
async function _o9() {
ui.mountTo(_o8, ui.spinner());
let data = null;
try { data = await api.call('invite.list', {}); } catch (e) {
ui.mountTo(_o8, h('p', { class: 'muted small' }, e && e.code === 'UNKNOWN_ACTION' ? 'Máy chủ đang chạy bản cũ, chưa có "Mời qua email" – bấm "Bỏ qua bước này", cập nhật máy chủ rồi mời ở ' + usersPath() + '.' : (e.userMessage || e.message || '')));
return;
}
seats = data.seats || null; quota = data.mail_quota === undefined ? null : data.mail_quota;
if (data.registry && !reg) { reg = data.registry; mktSt.hidden = !(reg.roles || []).some((x) => x.key === 'marketing'); _ob(); ui.mountTo(permBox, permTable(ui, reg)); }
_o7();
const ids = new Set((cur(ctl.state).created || []).map((x) => x.id));
const mine = (data.invites || []).filter((x) => ids.has(x.id) || x.status === 'pending');
ui.mountTo(_o8, invitesList(ui, api, mine, { onChange: _o9, testid: 'doingu-list', empty: 'Chưa có lời mời nào.' }));
}
async function _o2() {
err.textContent = '';
const _oc = validatePeople(rows);
if (_oc.length) { _o6.paintErrors(_oc); err.textContent = 'Còn ' + new Set(_oc.map((p) => p.i)).size + ' người chưa đủ họ tên hoặc email.'; return; }
let r;
try { r = await api.call('invite.create', { people: toPeople(rows), base: inviteBase(api) }); } catch (e) { err.textContent = e.userMessage || e.message || 'Chưa tạo được lời mời.'; return; }
const created = [...(cur(ctl.state).created || []), ...r.invites.map((x) => ({ id: x.id, full_name: x.full_name, email: x.email, role: x.role }))];
const msg = 'Đã tạo ' + r.invites.length + ' lời mời' + (r.mailed ? ', đã gửi ' + r.mailed + ' thư' : '') + (r.not_mailed ? ' – ' + r.not_mailed + ' người cần "Chép link mời" / "Gửi qua Zalo"' : '');
let _od = M.setData(ctl.state, { doingu: { ...cur(ctl.state), rows: [], sale: 0, manager: 0, created } });
_od = M.record(_od, 'doingu', { ok: true, msg });
ctl.last.doingu = { ok: true, msg, warn: r.warn || '' };
ctl.set(_od);
ui.toast(msg + '.', r.warn ? 'warn' : 'ok', 6000);
rerender();
}
}
export default { doinguCheck, doinguWidget };

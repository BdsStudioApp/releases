import { t } from './i18n.39c909b69c.js';
import {
ROLES, ROLE_PERMS, normalizePerms, normRole, validUsername, normUsername, USERNAME_RE,
hashPassword, randomSalt, isLegacyError
} from './auth.cfa76474bd.js';
import { renameDialog } from './tfa.1fd07d9b62.js';
export { ROLES, ROLE_PERMS, normalizePerms, validUsername, normUsername, USERNAME_RE };
export const READABLE_LOWER = 'abcdefghjkmnpqrstuvwxyz';
export const READABLE_UPPER = 'ABCDEFGHJKMNPQRSTUVWXYZ';
export const READABLE_DIGIT = '23456789';
const _o2 = READABLE_LOWER + READABLE_UPPER + READABLE_DIGIT;
function _o8(n) {
const _o3 = new Uint32Array(n);
if (globalThis.crypto && globalThis.crypto.getRandomValues) globalThis.crypto.getRandomValues(_o3);
else for (let _ol = 0; _ol < n; _ol++) _o3[_ol] = Math.floor(Math.random() * 2 ** 32);
return Array.from(_o3);
}
export function genTempPassword(len = 12, randInts = _o8) {
len = Math.max(8, Math.min(64, Number(len) || 12));
const r = randInts(len * 2);
const _o16 = (set, x) => set[x % set.length];
const _o13 = [];
for (let _ol = 0; _ol < len; _ol++) _o13.push(_o16(_o2, r[_ol]));
const _oj = Array.from({ length: len }, (_, _ol) => _ol);
const _o1l = [];
for (let _oo = 0; _oo < 3; _oo++) _o1l.push(_oj.splice(r[len + 3 + _oo] % _oj.length, 1)[0]);
_o13[_o1l[0]] = _o16(READABLE_LOWER, r[len]);
_o13[_o1l[1]] = _o16(READABLE_UPPER, r[len + 1]);
_o13[_o1l[2]] = _o16(READABLE_DIGIT, r[len + 2]);
return _o13.join('');
}
export function isReadablePassword(s) {
s = String(s || '');
return s.length >= 8 && [...s].every((c) => _o2.includes(c)) && /[a-z]/.test(s) && /[A-Z]/.test(s) && /\d/.test(s);
}
export function usernameProblem(s) {
const u = normUsername(s);
if (!u) return 'empty';
if (u.length < 3) return 'short';
if (u.length > 32) return 'long';
if (!USERNAME_RE.test(u)) return 'chars';
return '';
}
export function suggestUsername(fullName) {
const _o15 = String(fullName || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim().split(/\s+/).filter(Boolean);
if (!_o15.length) return '';
const u = _o15.length === 1 ? _o15[0] : _o15[_o15.length - 1] + '.' + _o15[0];
return u.slice(0, 32);
}
export const ROLE_KEYS = { owner: 'role.owner', manager: 'role.manager', sale: 'role.sale', ctv: 'role.ctv', marketing: 'role.marketing' };
export function roleLabel(role, tr = t) { return tr(ROLE_KEYS[normRole(role)]); }
export const ROLE_TONE = { owner: 'gold', manager: 'info', sale: 'ok', ctv: 'neutral', marketing: 'info' };
export const ROLE_TABLE = [
['Xem khách', 'Tất cả', 'Tất cả', 'Của mình', 'Mình tạo', 'Không (chỉ Kho lead)'],
['Chia khách', '✓', '✓', '–', '–', 'Đẩy số từ Kho lead'],
['Xoá dữ liệu khách', '✓', '✓', '–', '–', '–'],
['Bảng hàng, báo giá', '✓', '✓', '✓', '✓', 'Bảng hàng'],
['Chính sách', 'Duyệt', 'Tạo nháp', 'Xem', 'Xem', 'Xem'],
['Video, ý tưởng', '✓', '✓', '–', '–', '✓'],
['Xuất danh sách khách', '✓', '✓', 'Của mình', '–', '–'],
['Cài đặt chung, người dùng', '✓', '–', '–', '–', '–']
];
export const ROLE_SUMMARY = {
owner: 'Toàn quyền: người dùng, khoá AI, ngân sách, cài đặt chung.',
manager: 'Xem và chia mọi khách, tạo nháp chính sách, làm video. Không vào cài đặt chung.',
sale: 'Chỉ thấy khách được chia cho mình; báo giá, bảng hàng; xem chính sách.',
ctv: 'Chỉ thấy khách tự nhập; xem bảng hàng, tạo báo giá. Không xuất danh sách.',
marketing: 'Nhập lead vào Kho lead công ty, đẩy số cho sale/nhóm, xem báo cáo nguồn lead. Không xem khách riêng của sale.'
};
export function visibleScreens(perms, screens) {
return screens.filter((s) => screenAllowed(s, perms));
}
export function screenAllowed(screen, perms) {
if (screen !== 'content' || !perms) return true;
const ideas = typeof perms.ideas === 'boolean' ? perms.ideas : perms.video !== false;
return perms.video !== false || ideas;
}
export const SETTINGS_BASIC = ['profile', 'look', 'security', 'mytg', 'selftest'];
export function settingsKeysFor(keys, user) {
const perms = user && user.perms;
const role = user && user.role;
const _o13 = [];
for (const _op of keys) {
_o13.push(_op);
if (_op === 'security') {
if (perms && perms.admin && normRole(role) === 'owner') _o13.push('users');
_o13.push('mytg');
}
}
if (!_o13.includes('mytg')) _o13.push('mytg');
if (perms && !perms.admin) return _o13.filter((_op) => SETTINGS_BASIC.includes(_op));
return _o13;
}
export function assignableUsers(list) {
return (Array.isArray(list) ? list : [])
.filter((u) => u && !Number(u.deleted) && (u.status || 'active') === 'active' && ['sale', 'manager'].includes(u.role))
.sort((_o3, b) => String(_o3.full_name || _o3.username).localeCompare(String(b.full_name || b.username), 'vi'));
}
export function ownerLabel(ownerId, users, _ou) {
if (!ownerId) return '';
if (_ou && _ou.id && ownerId === _ou.id) return 'Tôi';
const u = (users || []).find((x) => x.id === ownerId);
if (u) return u.full_name || u.username;
return '';
}
export function isMine(c, _ou) {
if (!_ou) return true;
if (c.owner && _ou.id) return c.owner === _ou.id;
if (!c.owner) return _ou.role === 'owner';
return false;
}
export function inviteText({ appName = 'BDS Studio', url, username, password, fullName } = {}) {
return [
'Chào ' + (fullName || username) + ', đây là tài khoản ' + appName + ':',
'• Link app: ' + url,
'• Tên đăng nhập: ' + username,
'• Mật khẩu tạm: ' + password,
'Lần đầu đăng nhập, app sẽ yêu cầu đặt mật khẩu riêng. Không gửi mật khẩu cho người khác.'
].join('\n');
}
export function inviteUrl(base, scriptUrl) {
const u = String(base || '').split('#')[0].split('?')[0];
return scriptUrl ? u + '?server=' + encodeURIComponent(scriptUrl) : u;
}
const _o0 = {
login: 'Đăng nhập', logout: 'Đăng xuất', 'password.change': 'Đổi mật khẩu', 'users.create': 'Thêm người dùng',
'users.update': 'Sửa người dùng', 'users.reset_password': 'Đặt lại mật khẩu tạm', 'users.revoke_device': 'Thu hồi thiết bị',
'objects.assign': 'Chia khách', 'sync.push': 'Lưu dữ liệu', 'devices.revoke': 'Thu hồi thiết bị', 'telegram.set_mine': 'Cài Telegram riêng',
'telegram.test': 'Gửi thử Telegram', 'ai.run': 'Dùng AI', 'settings.set': 'Đổi cài đặt', setup: 'Cài đặt lần đầu',
'auth.rename': 'Đổi tên đăng nhập', 'users.rename': 'Đổi tên đăng nhập (Quản trị đổi)', 'auth.tfa_verify': 'Nhập mã 2 lớp', 'auth.tfa_resend': 'Gửi lại mã 2 lớp',
'auth.device_deny': 'Khoá máy lạ ("Không phải tôi")', 'tfa.enable': 'Bật xác thực 2 lớp', 'tfa.disable': 'Tắt/gỡ xác thực 2 lớp', 'tfa.backup_codes': 'Tạo mã dự phòng',
'tfa.setup_totp': 'Cài ứng dụng xác thực', 'tfa.send_code': 'Gửi mã xác nhận', 'tfa.untrust': 'Quên máy tin cậy', 'tfa.recover': 'Khôi phục 2 lớp (Apps Script)'
};
export function auditLabel(action) { return _o0[action] || action || ''; }
let _ob = { at: 0, list: null, p: null };
export function clearDirectory() { _ob = { at: 0, list: null, p: null }; }
export function createUsersApi({ api, store, getUser, ui }) {
const U = {
get _ou() { return getUser(); },
perms() { const u = getUser(); return u ? u.perms : normalizePerms(null, 'owner'); },
roleLabel: (r) => roleLabel(r),
isMine: (c) => isMine(c, getUser()),
async directory({ force } = {}) {
if (!force && _ob.list && Date.now() - _ob.at < 60000) return _ob.list;
if (!force && _ob.p) return _ob.p;
_ob.p = (async () => {
try {
const r = await api.call('users.list', {});
const list = Array.isArray(r) ? r : (r && (r.users || r.items)) || [];
_ob = { at: Date.now(), list, p: null };
return list;
} catch { _ob = { at: Date.now(), list: [], p: null }; return []; }
})();
return _ob.p;
},
label(ownerId, list) { return ownerLabel(ownerId, list || _ob.list || [], getUser()); },
async _o16({ title = 'Chia cho…', current } = {}) {
const { h } = ui;
const list = assignableUsers(await U.directory());
return new Promise((resolve) => {
let _o6 = null;
const body = list.length
? h('div', { class: 'pick-users', 'data-testid': 'assign-picker' }, list.map((u) => h('button', {
type: 'button', class: ['pick-user', u.id === current && 'on'], dataset: { user: u.username },
onclick: () => { _o6 = u; _ot.close(u); }
}, h('span', { class: 'avatar avatar-sm' }, _om(u.full_name || u.username)),
h('span', { class: 'pick-user-text' }, h('strong', null, u.full_name || u.username), h('small', null, '@' + u.username)),
ui.badge(roleLabel(u.role), ROLE_TONE[u.role] || 'neutral'))))
: h('div', { 'data-testid': 'assign-picker' }, h('p', { class: 'muted' }, 'Chưa có Sale/Quản lý đang hoạt động (hoặc máy chủ chưa cho xem danh sách người dùng). Quản trị (Admin) thêm ở Cài đặt › Người dùng.'));
const _ot = ui.modal({ title, body, actions: [{ label: t('common.cancel'), kind: 'ghost' }], onClose: () => resolve(_o6) });
});
},
async assign(ids, ownerId) {
ids = [...new Set((ids || []).filter(Boolean))];
if (!ids.length || !ownerId) return { updated: 0 };
const r = await api.call('objects.assign', { ids, owner: ownerId });
try { await store.syncNow(); } catch { }
return r || { updated: ids.length };
}
};
return U;
}
function _om(s) { return String(s || '•').trim().charAt(0).toUpperCase() || '•'; }
function _ox(ctx, _op) { return !!(ctx && ctx.user && ctx.user.perms && ctx.user.perms[_op] === true); }
function _ow(ctx, u) { return import('../packs/bds/members/panel.js').then((mm) => mm.openReassign(ctx, { from: u.id, title: 'Nhân viên nghỉ – chuyển khách cho …', reason: 'Nhân viên nghỉ việc' })).catch(() => { }); }
export function userSections(sections, ctx, app) {
const user = ctx.user || null;
const _og = {
users: ['users', 'customers', t('set.users'), (body) => renderUsers(body, ctx, app)],
mytg: ['mytg', 'sparkle', t('set.mytg'), (body) => renderMyTelegram(body, ctx, app)]
};
const _o5 = new Map(sections.map((s) => [s[0], s]));
const showUsers = usersVisible(installEdition(app));
return settingsKeysFor(sections.map((s) => s[0]), user).filter((_op) => showUsers || _op !== 'users').map((_op) => _o5.get(_op) || _og[_op]).filter(Boolean);
}
export function installEdition(app) {
const _o1e = app && app.status;
return String((_o1e && _o1e.edition) || (app && app.config && app.config.edition) || 'owner');
}
export function usersVisible(edition) {
const _o1 = (typeof globalThis !== 'undefined' && globalThis.BDSEdition) || null;
const _oh = _o1 && _o1.EDITIONS ? _o1.EDITIONS[edition] : null;
if (_oh) return _oh.showUsers !== false;
return edition !== 'ca-nhan';
}
export async function renderUsers(body, ctx, app) {
const { ui, api } = ctx;
const { h, button, badge, field } = ui;
const _oq = h('div', { class: 'users-list', 'data-testid': 'users-list' }, ui.spinner());
const _o1d = !!(app && app.status && app.status.single_user);
body.append(
h('div', { class: 'btn-row' },
_o1d ? null : button('Thêm người', () => _oz(), { kind: 'primary', icon: 'plus', testid: 'users-add' }),
button('Nhật ký', () => _o10(), { kind: 'secondary', icon: 'log', testid: 'users-audit' })),
_o1d ? h('p', { class: 'muted small', 'data-testid': 'users-solo' }, 'Bản Cá nhân dùng cho 1 người – không thêm được người dùng hay mời nhân viên. Muốn cả nhóm cùng dùng: chuyển sang Bản Công ty ở Cài đặt › Bản quyền (dữ liệu giữ nguyên).') : null,
_oq);
const _on = h('div', { 'data-testid': 'users-invites' });
body.append(_on);
let users = [];
await _oc();
if (!_o1d) import('./invites.e08b00346c.js').then((_ot) => _ot.renderInvitesPanel(_on, { ui, api, onUsersChanged: _oc })).catch((e) => _on.append(h('p', { class: 'muted small' }, String(e && e.message || e))));
if (_ox(ctx, 'mx_status')) { const _ov = h('div', { 'data-testid': 'users-mx' }); body.append(_ov); import('../packs/bds/members/panel.js').then((mm) => mm.renderDataStatus(_ov, ctx, { onReassign: (x) => mm.openReassign(ctx, { from: x.id }) })).catch(() => { }); }
const _o12 = h('div', { 'data-testid': 'users-org' });
body.append(_o12);
import('./video_machine.611ebd965d.js').then((_ot) => _ot.renderOrgPanel(_o12, { ui, api, onChange: _oc, offered: !!(ctx && ctx.video && typeof ctx.video.offered === 'function' && ctx.video.offered()) })).catch(() => { });
async function _oc() {
try {
const r = await api.call('users.list', {});
users = (Array.isArray(r) ? r : (r && (r.users || r.items)) || []).filter((u) => !Number(u.deleted));
clearDirectory();
} catch (e) {
ui.mountTo(_oq, h('p', { class: 'muted', 'data-testid': 'users-legacy' }, isLegacyError(e)
? 'Máy chủ đang chạy bản cũ (một mật khẩu). Cập nhật mã máy chủ bản có "Người dùng" rồi tải lại trang để thêm nhân viên.'
: (e.userMessage || t('err.network'))));
return;
}
const _ou = ctx.user || {};
ui.mountTo(_oq, ui.list(users, (u) => h('div', { class: 'user-row', dataset: { user: u.username } },
h('span', { class: 'avatar avatar-sm' }, _om(u.full_name || u.username)),
h('div', { class: 'row-text' },
h('strong', null, (u.full_name || u.username) + (u.id === _ou.id ? ' (tôi)' : '')),
h('span', { class: 'muted small' }, '@' + u.username + ' · ' + (u.last_login ? 'đăng nhập ' + ui.date(u.last_login, true) : 'chưa đăng nhập'))),
h('div', { class: 'user-badges' },
badge(roleLabel(u.role), ROLE_TONE[u.role] || 'neutral'),
u.dept ? badge(u.dept, 'neutral') : null,
u.status === 'locked' ? badge('Đã khoá', 'danger') : Number(u.must_change_pw) ? badge('Chờ đổi mật khẩu', 'warn') : badge('Hoạt động', 'ok'),
u.email_verified !== undefined && !Number(u.email_verified) && u.status !== 'locked' ? badge('Chưa xác nhận email', 'warn') : null)),
{ onClick: (u) => _o11(u), empty: 'Chưa có người dùng.' }));
}
function _o19(value, disabled) {
const _o9 = h('p', { class: 'field-hint', 'data-testid': 'role-desc' }, ROLE_SUMMARY[value || 'sale']);
const _oh = field({ label: 'Vai trò', type: 'select', value: value || 'sale', name: 'role', disabled,
options: ROLES.map((r) => ({ value: r, label: roleLabel(r) })), onChange: (_o1n) => { _o9.textContent = ROLE_SUMMARY[_o1n] || ''; } });
_oh.appendChild(_o9);
return _oh;
}
function _o1a() {
return h('details', { class: 'role-table' },
h('summary', null, 'Vai trò được làm gì?'),
h('div', { class: 'table-wrap' }, h('table', { class: 'table table-roles' },
h('thead', null, h('tr', null, h('th', null, 'Quyền'), ROLES.map((r) => h('th', null, roleLabel(r))))),
h('tbody', null, ROLE_TABLE.map((_o1b) => h('tr', null, _o1b.map((c, _ol) => (_ol ? h('td', { class: c === '–' ? 'muted' : '' }, c) : h('th', { scope: 'row' }, c)))))))));
}
function _o1g() {
const pw = field({ label: 'Mật khẩu tạm', name: 'temp_pw', value: genTempPassword(), autocomplete: 'off', hint: 'Nhân viên dùng mật khẩu này lần đầu, sau đó bắt buộc đổi. Máy băm mật khẩu trước khi gửi – máy chủ không biết mật khẩu gốc.' });
pw.input.setAttribute('data-testid', 'temp-pw'); pw.input.setAttribute('spellcheck', 'false'); pw.input.classList.add('mono');
const _o1b = h('div', { class: 'btn-row' },
button('Tạo ngẫu nhiên', () => { pw.setValue(genTempPassword()); }, { kind: 'ghost', small: true, icon: 'refresh', testid: 'temp-gen' }),
button('Chép', () => ui.copy(pw.getValue()), { kind: 'ghost', small: true, testid: 'temp-copy' }));
return { el: h('div', { class: 'temp-pw' }, pw, _o1b), get: () => String(pw.getValue() || '').trim() };
}
async function _ok(pw) { const temp_salt = randomSalt(); return { temp_salt, temp_pw_hash: await hashPassword(pw, temp_salt) }; }
function _o1c(u, password) {
const url = inviteUrl(location.href, api.mode === 'gas' ? api.url : '');
const _o1h = inviteText({ appName: t('app.name'), url, username: u.username, password, fullName: u.full_name });
const _o17 = h('pre', { class: 'invite-text', 'data-testid': 'invite-text' }, _o1h);
ui.modal({
title: 'Gửi cho nhân viên', cls: 'invite-modal',
body: h('div', { class: 'stack', 'data-testid': 'invite-box' },
h('p', { class: 'muted' }, 'Chép và gửi qua Zalo/Telegram cho nhân viên. Mật khẩu tạm chỉ hiện một lần này.'), _o17),
actions: [{ label: 'Chép lời nhắn', kind: 'primary', id: 'invite-copy', close: false, onClick: () => ui.copy(_o1h) }, { label: t('common.close'), kind: 'ghost', id: 'invite-close' }]
});
}
function _oz() {
const err = h('p', { class: 'form-err', role: 'alert' });
const name = field({ label: 'Họ tên', name: 'full_name', autocomplete: 'off' });
const un = field({ label: t('auth.username'), name: 'username', autocomplete: 'off', hint: t('auth.username.help') });
un.input.setAttribute('autocapitalize', 'none'); un.input.setAttribute('spellcheck', 'false');
let _o1k = false;
un.input.addEventListener('input', () => { _o1k = true; const _o1n = un.input.value.toLowerCase().replace(/\s+/g, ''); if (_o1n !== un.input.value) un.input.value = _o1n; });
name.input.addEventListener('input', () => { if (!_o1k) un.setValue(suggestUsername(name.getValue())); });
const email = field({ label: 'Email (bắt buộc)', type: 'email', name: 'email', autocomplete: 'off', id: 'user-email',
hint: 'Lần đăng nhập đầu, nhân viên nhập mã 6 số gửi tới email này (sửa được nếu gõ nhầm). Email đã xác nhận dùng để nhận mã khi quên mật khẩu.' });
const phone = field({ label: 'Số điện thoại', type: 'tel', name: 'phone', inputmode: 'tel', autocomplete: 'off' });
const role = _o19('sale');
const _o1j = _o1g();
const _ot = ui.modal({
title: 'Thêm người dùng', wide: true, cls: 'user-modal',
body: h('form', { class: 'stack', 'data-testid': 'user-form', novalidate: true, onsubmit: (e) => e.preventDefault() },
h('div', { class: 'grid-2' }, name, un, email, phone), role, _o1a(), _o1j.el, err),
actions: [{ label: t('common.cancel'), kind: 'ghost' }, {
label: 'Tạo tài khoản', kind: 'primary', id: 'user-create', onClick: async () => {
err.textContent = '';
const username = normUsername(un.getValue());
const _o18 = usernameProblem(username);
if (_o18) { err.textContent = t('auth.err.username'); un.input.focus(); return false; }
if (users.some((u) => u.username === username)) { err.textContent = 'Tên đăng nhập đã có người dùng.'; return false; }
const pw = _o1j.get();
if (pw.length < 8) { err.textContent = t('auth.err.short'); return false; }
const _oe = String(email.getValue() || '').trim();
if (!_oe) { err.textContent = 'Nhập email của nhân viên (bắt buộc).'; email.input.focus(); return false; }
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_oe)) { err.textContent = 'Email chưa đúng dạng (vd ten@gmail.com) – gõ lại.'; email.input.focus(); return false; }
try {
const _o7 = await api.call('users.create', {
username, full_name: String(name.getValue() || '').trim(), email: _oe, phone: String(phone.getValue() || '').trim(),
role: role.getValue(), ...(await _ok(pw))
});
const u = (_o7 && (_o7.user || _o7)) || {};
_o1c({ username, full_name: String(name.getValue() || '').trim(), ...u }, pw);
await _oc();
return true;
} catch (e) { err.textContent = e.userMessage || e.message || t('err.generic'); return false; }
}
}]
});
return _ot;
}
function _o11(u) {
const _ou = ctx.user || {};
const self = u.id === _ou.id;
const err = h('p', { class: 'form-err', role: 'alert' });
const name = field({ label: 'Họ tên', value: u.full_name || '' });
const _of = u.email_verified !== undefined, ev = !!Number(u.email_verified);
const email = field({ label: 'Email', type: 'email', value: u.email || '', id: 'user-edit-email',
hint: self ? 'Đổi email của anh/chị ở Cài đặt › Thông tin cá nhân (cần mã xác nhận gửi tới email mới).'
: !_of ? '' : ev ? 'Đã xác nhận. Đổi email thì người này phải xác nhận lại.' : 'Chưa xác nhận – người này nhập mã 6 số ở lần đăng nhập tới.' });
if (self) email.input.readOnly = true;
const phone = field({ label: 'Số điện thoại', type: 'tel', value: u.phone || '', inputmode: 'tel', autocomplete: 'off' });
const role = _o19(u.role, self);
const grace = !self && _of && !ev && u.status !== 'locked' ? button('Cho dùng tạm 24 giờ', async () => {
if (!(await ui.confirm('Cho "' + (u.full_name || u.username) + '" dùng app 24 giờ khi chưa nhận được mã xác nhận email? Hết 24 giờ app hỏi lại.', { ok: 'Cho dùng tạm', title: 'Chưa xác nhận email' }))) return;
try { await api.call('users.email_grace', { id: u.id }); ui.toast('Đã cho dùng tạm 24 giờ', 'ok'); } catch (e) { err.textContent = e.userMessage || t('err.generic'); }
}, { kind: 'secondary', small: true, testid: 'user-email-grace' }) : null;
const _oa = h('div', { class: 'devices', 'data-testid': 'user-devices' });
const auth = (app && app.auth) || null;
const _o1i = u.role === 'owner' || u.role === 'manager';
const tfaToggle = _o1i ? null : field({ label: 'Bắt buộc xác thực 2 lớp khi đăng nhập ở máy lạ', type: 'checkbox', value: !!Number(u.tfa_owner_required || u.tfa_required), id: 'user-tfa-required',
onChange: (_o1n) => _o1m({ tfa_required: _o1n ? 1 : 0 }, _o1n ? 'Đã bắt buộc xác thực 2 lớp' : 'Đã bỏ bắt buộc xác thực 2 lớp') });
const loginBlock = h('div', { class: 'sub-block', 'data-testid': 'user-login-block' }, h('h4', { class: 'section-title' }, 'Đăng nhập'),
h('p', { class: 'muted' }, 'Tên đăng nhập: ', h('strong', null, '@' + u.username), ' · Xác thực 2 lớp: ',
_o1i ? 'bắt buộc (vai trò ' + roleLabel(u.role) + ')' : Number(u.tfa_required) ? 'bắt buộc (Quản trị yêu cầu)' : 'tuỳ người dùng',
Number(u.tfa_on) ? ' – đang dùng' : (_o1i || Number(u.tfa_required) ? ' – chưa có cách nhận mã (chưa nối Telegram)' : ''),
Number(u.tfa_totp) ? ' · có ứng dụng xác thực' : ''),
tfaToggle,
auth ? h('div', { class: 'btn-row' }, button('Đổi tên đăng nhập', () => renameDialog({
ui, auth, current: u.username, target: self ? null : { id: u.id, username: u.username, full_name: u.full_name },
onDone: async () => { _ot.close(); await _oc(); }
}), { kind: 'secondary', icon: 'user', testid: 'user-rename' })) : null);
const _o1m = async (patch, msg) => {
err.textContent = '';
try { await api.call('users.update', { id: u.id, ...patch }); ui.toast(msg || t('common.saved'), 'ok'); await _oc(); return true; } catch (e) { err.textContent = e.userMessage || t('err.generic'); return false; }
};
const permsBox = h('div', { 'data-testid': 'user-perms-box' });
const deptBox = h('div', { 'data-testid': 'user-dept-box' });
if (u.role !== 'owner') import('./video_machine.611ebd965d.js').then((mm) => mm.memberDeptField(deptBox, { ui, api, user: u, onSaved: _oc })).catch(() => { });
import('./invites.e08b00346c.js').then((mm) => mm.memberPermsBlock(permsBox, { ui, api, user: u, self, onSaved: _oc })).catch(() => { });
const _os = u.status === 'locked';
const _ot = ui.modal({
title: (u.full_name || u.username) + ' · @' + u.username, wide: true, cls: 'user-modal',
body: h('div', { class: 'stack', 'data-testid': 'user-detail' },
h('div', { class: 'grid-2' }, name, email, phone), grace, role, err,
h('div', { class: 'btn-row' },
button('Lưu thay đổi', async () => {
const _oe = String(email.getValue() || '').trim();
if (!self && !_oe && u.email) { err.textContent = 'Email là bắt buộc.'; email.input.focus(); return; }
const ok = await _o1m({ full_name: String(name.getValue() || '').trim(), phone: String(phone.getValue() || '').trim(), ...(self ? {} : { email: _oe, role: role.getValue() }) });
if (ok) _ot.close();
}, { kind: 'primary', icon: 'check', testid: 'user-save' }),
self ? null : button(_os ? 'Mở khoá' : 'Khoá tài khoản', async () => {
if (!_os && !(await ui.confirm('Khoá "' + (u.full_name || u.username) + '"? Người này không đăng nhập được cho tới khi mở khoá.', { ok: 'Khoá', kind: 'danger', title: 'Khoá tài khoản' }))) return;
if (await _o1m({ status: _os ? 'active' : 'locked' }, _os ? 'Đã mở khoá' : 'Đã khoá')) { _ot.close(); if (!_os && _ox(ctx, 'mx_move')) _ow(ctx, u); }
}, { kind: _os ? 'secondary' : 'danger', icon: 'lock', testid: 'user-lock' }),
self || !_ox(ctx, 'mx_move') ? null : button('Nhân viên nghỉ – chuyển khách cho …', () => { _ot.close(); _ow(ctx, u); }, { kind: 'secondary', icon: 'send', testid: 'user-mx-reassign' }),
self ? null : button('Đặt lại mật khẩu tạm', async () => {
if (!(await ui.confirm('Cấp mật khẩu tạm mới cho "' + (u.full_name || u.username) + '"? Mọi thiết bị của người này sẽ bị đăng xuất.', { ok: 'Cấp mật khẩu mới', title: 'Đặt lại mật khẩu' }))) return;
const pw = genTempPassword();
try { await api.call('users.reset_password', { id: u.id, ...(await _ok(pw)) }); _ot.close(); _o1c(u, pw); await _oc(); } catch (e) { err.textContent = e.userMessage || t('err.generic'); }
}, { kind: 'secondary', icon: 'refresh', testid: 'user-reset' })),
loginBlock,
deptBox,
permsBox,
h('div', { class: 'sub-block' }, h('h4', { class: 'section-title' }, 'Thiết bị'), _oa),
h('div', { class: 'btn-row' }, button('Nhật ký của người này', () => { _ot.close(); _o10(u.id); }, { kind: 'ghost', icon: 'log' })))
});
_od();
async function _od() {
ui.mountTo(_oa, ui.spinner());
try {
const r = await api.call('users.devices', { id: u.id });
const rows = (Array.isArray(r) ? r : (r && (r.devices || r.items)) || []).filter((d) => !Number(d.revoked));
const wipe = h('input', { type: 'checkbox', id: 'user-dev-wipe', 'data-testid': 'user-dev-wipe' });
ui.mountTo(_oa, rows.length ? h('label', { class: 'ds-wipe', for: 'user-dev-wipe' }, wipe, h('span', null, 'Máy bị mất – xoá dữ liệu trên máy')) : null,
ui.list(rows, (d) => h('div', { class: 'row-main' },
h('div', { class: 'row-text' }, h('strong', null, d.name || d.id), h('span', { class: 'muted small' }, d.last_seen ? ui.date(d.last_seen, true) : '')),
button(t('set.security.revoke'), async () => { await api.call('users.revoke_device', { device_id: d.id, wipe: !!wipe.checked }); ui.toast(t('set.security.revoked'), 'ok'); _od(); }, { kind: 'ghost', small: true, icon: 'logout' })),
{ empty: 'Chưa đăng nhập thiết bị nào.' }));
} catch (e) { ui.mountTo(_oa, h('p', { class: 'muted' }, e.userMessage || t('err.network'))); }
}
}
function _o10(userId = '') {
const _o4 = h('div', { class: 'audit-list', 'data-testid': 'audit-list' }, ui.spinner());
const sel = field({ label: 'Người dùng', type: 'select', value: userId, options: [{ value: '', label: 'Tất cả' }, ...users.map((u) => ({ value: u.id, label: u.full_name || u.username }))], onChange: (_o1n) => _or(_o1n) });
ui.modal({ title: 'Nhật ký', wide: true, body: h('div', { class: 'stack' }, sel, _o4), actions: [{ label: t('common.close'), kind: 'primary' }] });
_or(userId);
async function _or(uid) {
ui.mountTo(_o4, ui.spinner());
try {
const r = await api.call('audit.list', { user_id: uid || undefined, limit: 200 });
const rows = (Array.isArray(r) ? r : (r && (r.items || r.rows)) || []).slice().sort((_o3, b) => Number(b.at) - Number(_o3.at));
const _oy = (id) => { const u = users.find((x) => x.id === id); return u ? (u.full_name || u.username) : ''; };
ui.mountTo(_o4, ui.list(rows, (_o3) => h('div', { class: 'row-text' },
h('div', { class: 'row-line' }, h('strong', null, auditLabel(_o3.action)), h('span', { class: 'muted small num' }, ui.date(Number(_o3.at), true))),
h('span', { class: 'muted small break' }, [_oy(_o3.user_id), _o3.object_id, typeof _o3.detail === 'string' ? _o3.detail.slice(0, 140) : ''].filter(Boolean).join(' · '))),
{ empty: 'Chưa có nhật ký.' }));
} catch (e) { ui.mountTo(_o4, h('p', { class: 'muted' }, e.userMessage || t('err.network'))); }
}
}
}
export async function renderMyTelegram(body, ctx, app) {
const { ui, api } = ctx;
const { h, button, badge, field } = ui;
const _ou = ctx.user || {};
const state = { token: !!Number(_ou.telegram_token_set), chat: _ou.telegram_chat_id || '' };
const stBox = h('div', { class: 'chips', 'data-testid': 'mytg-status' });
const _o13 = h('p', { class: 'muted', 'aria-live': 'polite', 'data-testid': 'mytg-out' });
const _o14 = () => ui.mountTo(stBox,
badge(state.token ? 'Đã có mã bot' : 'Chưa có mã bot', state.token ? 'ok' : 'neutral'),
badge(state.chat ? 'Chat id: ' + state.chat : 'Chưa có chat id', state.chat ? 'ok' : 'neutral'));
_o14();
const _o1f = (n, ...c) => h('li', null, h('span', { class: 'step-n' }, String(n)), h('div', null, ...c));
const tokenF = field({ label: 'Mã bot', type: 'password', name: 'tg_token', autocomplete: 'off', placeholder: state.token ? '••••••••  đã lưu – dán mã bot mới để thay' : '123456789:AA…' });
tokenF.input.setAttribute('data-testid', 'mytg-token');
const _oi = (e) => { _o13.textContent = (e && (e.userMessage || e.message)) || t('err.generic'); ui.toast(_o13.textContent, 'error'); };
const chatF = field({ label: 'Chat id (nếu tự biết)', name: 'tg_chat', inputmode: 'numeric', autocomplete: 'off' });
body.append(
h('p', { class: 'lead mytg-why' }, 'Tạo bot Telegram riêng (miễn phí). Khi được chia khách, bot này báo ngay cho riêng mình.'),
h('ol', { class: 'steps', 'data-testid': 'mytg-steps' },
_o1f(1, 'Mở Telegram, tìm ', h('strong', null, '@BotFather'), ' (có dấu tích xanh) và bấm ', h('strong', null, 'Start'), '.'),
_o1f(2, 'Gõ ', h('code', null, '/newbot'), ' rồi gửi.'),
_o1f(3, 'Đặt tên hiển thị (vd "Báo khách – Lan"), sau đó đặt tên bot kết thúc bằng ', h('code', null, 'bot'), ' (vd ', h('code', null, 'baokhach_lan_bot'), ').'),
_o1f(4, 'BotFather trả về một dòng ', h('strong', null, 'mã bot'), ' (token) dạng ', h('code', null, '123456789:AA…'), '. Bấm giữ để chép.'),
_o1f(5, 'Dán mã bot vào ô dưới và bấm ', h('strong', null, 'Lưu mã bot'), '.'),
_o1f(6, 'Mở bot vừa tạo (link t.me/… trong tin của BotFather), bấm Start và nhắn ', h('strong', null, '"chào"'), '.'),
_o1f(7, 'Bấm ', h('strong', null, 'Tự tìm chat id'), ', rồi ', h('strong', null, 'Gửi thử'), ' – thấy tin nhắn là xong.')),
h('div', { class: 'sub-block' }, tokenF,
h('div', { class: 'btn-row' },
button('Lưu mã bot', async () => {
const _o1n = String(tokenF.getValue() || '').trim();
if (!/^\d{5,}:[A-Za-z0-9_-]{20,}$/.test(_o1n)) { _o13.textContent = 'Mã bot chưa đúng dạng 123456789:AA… (chép nguyên dòng từ BotFather).'; return; }
try { await api.call('telegram.set_mine', { token: _o1n }); } catch (e) { return _oi(e); }
tokenF.setValue(''); tokenF.input.placeholder = '••••••••  đã lưu – dán mã bot mới để thay';
state.token = true; _o14(); _o13.textContent = 'Đã lưu mã bot. Làm tiếp bước 6.'; ui.toast(t('common.saved'), 'ok');
}, { kind: 'primary', icon: 'check', testid: 'mytg-save' }),
button('Tự tìm chat id', async () => {
try {
const r = await api.call('telegram.find_chat_id_mine', {});
const id = r && (r.chat_id || r.id);
if (id) { state.chat = String(id); _o14(); _o13.textContent = 'Đã tìm thấy chat id ' + id + '. Bấm "Gửi thử".'; }
else _o13.textContent = 'Chưa thấy tin nhắn. Mở bot, bấm Start, nhắn "chào" rồi thử lại.';
} catch (e) { _oi(e); }
}, { kind: 'secondary', icon: 'pulse', testid: 'mytg-find' }),
button('Gửi thử', async () => {
try { await api.call('telegram.test', { mine: true }); _o13.textContent = 'Đã gửi tin thử. Mở Telegram để xem.'; ui.toast(t('set.conn.telegram.sent'), 'ok'); } catch (e) { _oi(e); }
}, { kind: 'secondary', icon: 'sparkle', testid: 'mytg-test' })),
stBox, _o13),
h('details', { class: 'mytg-manual' }, h('summary', null, 'Nhập chat id thủ công'),
h('div', { class: 'stack' }, chatF, h('div', { class: 'btn-row' }, button(t('common.save'), async () => {
const _o1n = String(chatF.getValue() || '').trim();
if (!/^-?\d{3,}$/.test(_o1n)) { _o13.textContent = 'Chat id là dãy số.'; return; }
try { await api.call('telegram.set_mine', { chat_id: _o1n }); } catch (e) { return _oi(e); }
state.chat = _o1n; _o14(); ui.toast(t('common.saved'), 'ok');
}, { kind: 'secondary', small: true }))))
);
}
export default { genTempPassword, validUsername, usernameProblem, settingsKeysFor, visibleScreens, userSections, createUsersApi };

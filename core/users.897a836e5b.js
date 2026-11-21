import { t } from './i18n.17f01a0b54.js';
import {
ROLES, ROLE_PERMS, normalizePerms, normRole, validUsername, normUsername, USERNAME_RE
} from './auth.c3ca8814ab.js';
export { ROLES, ROLE_PERMS, normalizePerms, validUsername, normUsername, USERNAME_RE };
export const READABLE_LOWER = 'abcdefghjkmnpqrstuvwxyz';
export const READABLE_UPPER = 'ABCDEFGHJKMNPQRSTUVWXYZ';
export const READABLE_DIGIT = '23456789';
const _o2 = READABLE_LOWER + READABLE_UPPER + READABLE_DIGIT;
function _o6(n) {
const _o3 = new Uint32Array(n);
if (globalThis.crypto && globalThis.crypto.getRandomValues) globalThis.crypto.getRandomValues(_o3);
else for (let _ob = 0; _ob < n; _ob++) _o3[_ob] = Math.floor(Math.random() * 2 ** 32);
return Array.from(_o3);
}
export function genTempPassword(len = 12, randInts = _o6) {
len = Math.max(8, Math.min(64, Number(len) || 12));
const r = randInts(len * 2);
const _oi = (set, x) => set[x % set.length];
const _og = [];
for (let _ob = 0; _ob < len; _ob++) _og.push(_oi(_o2, r[_ob]));
const _oa = Array.from({ length: len }, (_, _ob) => _ob);
const _ol = [];
for (let _od = 0; _od < 3; _od++) _ol.push(_oa.splice(r[len + 3 + _od] % _oa.length, 1)[0]);
_og[_ol[0]] = _oi(READABLE_LOWER, r[len]);
_og[_ol[1]] = _oi(READABLE_UPPER, r[len + 1]);
_og[_ol[2]] = _oi(READABLE_DIGIT, r[len + 2]);
return _og.join('');
}
export function isReadablePassword(s) {
s = String(s || '');
return s.length >= 8 && [...s].every((c) => _o2.includes(c)) && /[a-z]/.test(s) && /[A-Z]/.test(s) && /\d/.test(s);
}
export function usernameProblem(s) {
const _ok = normUsername(s);
if (!_ok) return 'empty';
if (_ok.length < 3) return 'short';
if (_ok.length > 32) return 'long';
if (!USERNAME_RE.test(_ok)) return 'chars';
return '';
}
export function suggestUsername(fullName) {
const _oh = String(fullName || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim().split(/\s+/).filter(Boolean);
if (!_oh.length) return '';
const _ok = _oh.length === 1 ? _oh[0] : _oh[_oh.length - 1] + '.' + _oh[0];
return _ok.slice(0, 32);
}
export const ROLE_KEYS = { owner: 'role.owner', manager: 'role.manager', sale: 'role.sale', ctv: 'role.ctv', marketing: 'role.marketing' };
export function roleLabel(role, tr = t) { return tr(ROLE_KEYS[normRole(role)]); }
export const ROLE_TONE = { owner: 'gold', manager: 'info', sale: 'ok', ctv: 'neutral', marketing: 'info' };
export const ROLE_TABLE = [
['Xem khách', 'Tất cả', 'Tất cả', 'Của mình', 'Mình tạo', 'Không (chỉ Kho lead)'],
['Chia khách', '✓', '✓', '–', '–', 'Đẩy số từ Kho lead'],
['Xoá dữ liệu khách', '✓', '✓', '–', '–', '–'],
['Thông tin dự án, báo giá', '✓', '✓', '✓', '✓', 'Thông tin dự án'],
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
const _og = [];
for (const _oe of keys) {
_og.push(_oe);
if (_oe === 'security') {
if (perms && perms.admin && normRole(role) === 'owner') _og.push('users');
_og.push('mytg');
}
}
if (!_og.includes('mytg')) _og.push('mytg');
if (perms && !perms.admin) return _og.filter((_oe) => SETTINGS_BASIC.includes(_oe));
return _og;
}
export function assignableUsers(list) {
return (Array.isArray(list) ? list : [])
.filter((_ok) => _ok && !Number(_ok.deleted) && (_ok.status || 'active') === 'active' && ['sale', 'manager'].includes(_ok.role))
.sort((_o3, b) => String(_o3.full_name || _o3.username).localeCompare(String(b.full_name || b.username), 'vi'));
}
export function ownerLabel(ownerId, users, me) {
if (!ownerId) return '';
if (me && me.id && ownerId === me.id) return 'Tôi';
const _ok = (users || []).find((x) => x.id === ownerId);
if (_ok) return _ok.full_name || _ok.username;
return '';
}
export function isMine(c, me) {
if (!me) return true;
if (c.owner && me.id) return c.owner === me.id;
if (!c.owner) return me.role === 'owner';
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
const _ok = String(base || '').split('#')[0].split('?')[0];
return scriptUrl ? _ok + '?server=' + encodeURIComponent(scriptUrl) : _ok;
}
const _o0 = {
login: 'Đăng nhập', logout: 'Đăng xuất', 'password.change': 'Đổi mật khẩu', 'users.create': 'Thêm người dùng',
'users.update': 'Sửa người dùng', 'users.reset_password': 'Đặt lại mật khẩu tạm', 'users.revoke_device': 'Thu hồi thiết bị',
'objects.assign': 'Chia khách', 'sync.push': 'Lưu dữ liệu', 'devices.revoke': 'Thu hồi thiết bị', 'telegram.set_mine': 'Cài Telegram riêng',
'telegram.test': 'Gửi thử Telegram', 'ai.run': 'Dùng AI', 'settings.set': 'Đổi cài đặt', setup: 'Cài đặt lần đầu',
'auth.rename': 'Đổi tên đăng nhập', 'users.rename': 'Đổi tên đăng nhập (Quản trị đổi)', 'auth.tfa_verify': 'Nhập mã 2 lớp', 'auth.tfa_resend': 'Gửi lại mã 2 lớp',
'users.delete': 'Xoá người dùng', 'auth.device_deny': 'Khoá máy lạ ("Không phải tôi")', 'tfa.enable': 'Bật xác thực 2 lớp', 'tfa.disable': 'Tắt/gỡ xác thực 2 lớp', 'tfa.backup_codes': 'Tạo mã dự phòng',
'tfa.setup_totp': 'Cài ứng dụng xác thực', 'tfa.send_code': 'Gửi mã xác nhận', 'tfa.untrust': 'Quên máy tin cậy', 'tfa.recover': 'Khôi phục 2 lớp (Apps Script)'
};
export function auditLabel(action) { return _o0[action] || action || ''; }
let _o7 = { at: 0, list: null, p: null };
export function clearDirectory() { _o7 = { at: 0, list: null, p: null }; }
export function createUsersApi({ api, store, getUser, ui }) {
const U = {
get me() { return getUser(); },
perms() { const _ok = getUser(); return _ok ? _ok.perms : normalizePerms(null, 'owner'); },
roleLabel: (r) => roleLabel(r),
isMine: (c) => isMine(c, getUser()),
async directory({ force } = {}) {
if (!force && _o7.list && Date.now() - _o7.at < 60000) return _o7.list;
if (!force && _o7.p) return _o7.p;
_o7.p = (async () => {
try {
const r = await api.call('users.list', {});
const list = Array.isArray(r) ? r : (r && (r.users || r.items)) || [];
_o7 = { at: Date.now(), list, p: null };
return list;
} catch { _o7 = { at: Date.now(), list: [], p: null }; return []; }
})();
return _o7.p;
},
label(ownerId, list) { return ownerLabel(ownerId, list || _o7.list || [], getUser()); },
async _oi({ title = 'Chia cho…', current } = {}) {
const { h } = ui;
const list = assignableUsers(await U.directory());
return new Promise((resolve) => {
let _o5 = null;
const body = list.length
? h('div', { class: 'pick-users', 'data-testid': 'assign-picker' }, list.map((_ok) => h('button', {
type: 'button', class: ['pick-user', _ok.id === current && 'on'], dataset: { user: _ok.username },
onclick: () => { _o5 = _ok; _of.close(_ok); }
}, h('span', { class: 'avatar avatar-sm' }, _oc(_ok.full_name || _ok.username)),
h('span', { class: 'pick-user-text' }, h('strong', null, _ok.full_name || _ok.username), h('small', null, '@' + _ok.username)),
ui.badge(roleLabel(_ok.role), ROLE_TONE[_ok.role] || 'neutral'))))
: h('div', { 'data-testid': 'assign-picker' }, h('p', { class: 'muted' }, 'Chưa có Sale/Quản lý đang hoạt động (hoặc máy chủ chưa cho xem danh sách người dùng). Quản trị (Admin) thêm ở Cài đặt › Nhân sự.'));
const _of = ui.modal({ title, body, actions: [{ label: t('common.cancel'), kind: 'ghost' }], onClose: () => resolve(_o5) });
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
function _oc(s) { return String(s || '•').trim().charAt(0).toUpperCase() || '•'; }
export function userSections(sections, ctx, app) {
const user = ctx.user || null;
const _o8 = {
users: ['users', 'customers', t('set.users'), (body) => renderUsers(body, ctx)],
mytg: ['mytg', 'sparkle', t('set.mytg'), (body) => import('./my_telegram.3d1cdb9b51.js').then((_of) => _of.renderMyTelegram(body, ctx, app))]
};
const _o4 = new Map(sections.map((s) => [s[0], s]));
const showUsers = usersVisible(installEdition(app));
return settingsKeysFor(sections.map((s) => s[0]), user).filter((_oe) => showUsers || _oe !== 'users').map((_oe) => _o4.get(_oe) || _o8[_oe]).filter(Boolean);
}
export function installEdition(app) {
const _oj = app && app.status;
return String((_oj && _oj.edition) || (app && app.config && app.config.edition) || 'owner');
}
export function usersVisible(edition) {
const _o1 = (typeof globalThis !== 'undefined' && globalThis.BDSEdition) || null;
const _o9 = _o1 && _o1.EDITIONS ? _o1.EDITIONS[edition] : null;
if (_o9) return _o9.showUsers !== false;
return edition !== 'ca-nhan';
}
export async function renderUsers(body, ctx) {
const { ui } = ctx;
const { h, button } = ui;
const line = h('p', { class: 'muted small', 'data-testid': 'users-link-sum' }, 'Danh sách nhân viên, nhóm sale và trưởng nhóm, phân quyền, lời mời.');
body.append(h('div', { class: 'users-link', 'data-testid': 'users-link' }, line,
button('Mở Nhân sự', () => ctx.nav('settings/users'), { kind: 'primary', icon: 'customers', testid: 'users-open' })));
try {
const list = (await (ctx.users && ctx.users.directory ? ctx.users.directory() : [])).filter((_ok) => !Number(_ok.deleted));
if (list.length) line.textContent = list.length + ' người · ' + list.filter((_ok) => _ok.status === 'locked').length + ' đã khoá. Danh sách, nhóm sale và trưởng nhóm, phân quyền, lời mời.';
} catch { }
}
export default { genTempPassword, validUsername, usernameProblem, settingsKeysFor, visibleScreens, userSections, createUsersApi };

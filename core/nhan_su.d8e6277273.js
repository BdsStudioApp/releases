import { t } from './i18n.17f01a0b54.js';
import { ROLES, ROLE_PERMS, normRole, normUsername, hashPassword, randomSalt, isLegacyError } from './auth.c3ca8814ab.js';
import { roleLabel, ROLE_TONE, ROLE_SUMMARY, ROLE_TABLE, genTempPassword, usernameProblem, suggestUsername, inviteText, inviteUrl, auditLabel, clearDirectory, usersVisible, installEdition } from './users.897a836e5b.js';
import { renameDialog } from './tfa.741f96ece0.js';
import { fold, ensureCss } from './xkit.71d637c634.js';
export const PAGE_SIZES = [25, 50, 100];
export const STATUS = { active: ['Hoạt động', 'ok'], locked: ['Đã khoá', 'danger'], pw: ['Chờ đổi mật khẩu', 'warn'], email: ['Chưa xác nhận email', 'warn'] };
export const TABS = [['ds', 'Danh sách'], ['nhom', 'Nhóm & chia số'], ['quyen', 'Phân quyền'], ['moi', 'Lời mời'], ['khac', 'Phòng ban & dữ liệu']];
const _o2 = ['sale', 'manager', 'ctv', 'marketing', 'owner'];
export function staffStatus(u) {
if (!u) return 'active';
if (u.status === 'locked') return 'locked';
if (Number(u.must_change_pw)) return 'pw';
if (u.email_verified !== undefined && !Number(u.email_verified)) return 'email';
return 'active';
}
export function staffFlags(u) {
if (!u) return ['active'];
if (u.status === 'locked') return ['locked'];
const f = [];
if (Number(u.must_change_pw)) f.push('pw');
if (u.email_verified !== undefined && !Number(u.email_verified)) f.push('email');
return f.length ? f : ['active'];
}
export function staffRows(users, teams = []) {
const T = Array.isArray(teams) ? teams : [];
return (Array.isArray(users) ? users : []).filter((u) => u && u.id && !Number(u.deleted)).map((u) => {
const team = T.find((_o33) => (_o33.members || []).includes(u.id)) || null;
const leads = T.filter((_o33) => _o33.leader === u.id);
const name = String(u.full_name || u.username || '').trim();
return { id: u.id, u, name, username: String(u.username || ''), role: normRole(u.role), team, leads, status: staffStatus(u), flags: staffFlags(u), last_login: Number(u.last_login) || 0,
key: fold([name, u.username, u.email, u.phone, team && team.name, leads.map((_o33) => _o33.name).join(' ')].filter(Boolean).join(' ')) };
}).sort((a, _o6) => _o4(a.role) - _o4(_o6.role) || a.name.localeCompare(_o6.name, 'vi', { numeric: true }));
}
const _o4 = (r) => ['owner', 'manager', 'marketing', 'sale', 'ctv'].indexOf(r);
export function filterStaff(rows, { q = '', role = '', team = '', status = '' } = {}) {
const words = fold(q).split(/\s+/).filter(Boolean).map((w) => w.replace(/^@/, ''));
return (rows || []).filter((r) => {
if (role === 'leader' ? !r.leads.length : role && r.role !== role) return false;
if (team === '-' ? !!r.team : team && !(r.team && r.team.id === team) && !r.leads.some((_o33) => _o33.id === team)) return false;
if (status && !(r.flags || [r.status]).includes(status)) return false;
return words.every((w) => r.key.includes(w));
});
}
export function pageOf(rows, page = 1, size = 25) {
const total = (rows || []).length, sz = Math.max(1, Number(size) || 25), pages = Math.max(1, Math.ceil(total / sz));
const _o1n = Math.min(pages, Math.max(1, Math.floor(Number(page) || 1)));
const items = (rows || []).slice((_o1n - 1) * sz, _o1n * sz);
return { items, page: _o1n, pages, total, from: total ? (_o1n - 1) * sz + 1 : 0, to: (_o1n - 1) * sz + items.length };
}
export function roleFromWord(w) {
const _o11 = fold(w).replace(/[^a-z0-9]+/g, ' ').trim();
if (!_o11) return '';
if (/^(sale|sales|ban hang|nhan vien|nv|nvkd|kinh doanh|chuyen vien)$/.test(_o11)) return 'sale';
if (/^(quan ly|ql|truong nhom|tn|leader|manager|truong phong|tp)$/.test(_o11)) return 'manager';
if (/^(ctv|cong tac vien)$/.test(_o11)) return 'ctv';
if (/^(marketing|mkt|mar)$/.test(_o11)) return 'marketing';
if (/^(admin|quan tri|quan tri admin|chu|owner)$/.test(_o11)) return 'owner';
return '';
}
export function nameFromEmail(email) {
const _o16 = String(email || '').split('@')[0].replace(/[0-9]+/g, ' ').replace(/[._\-+]+/g, ' ').trim();
return _o16.split(/\s+/).filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
const _o0 = /[^\s@,;<>"']+@[^\s@,;<>"']+\.[^\s@,;<>"']+/;
const _o3 = /^(\+?84|0)[\d .]{8,13}$/;
function _o2n(line, sep) {
const _o1m = []; let _ok = '', q = false;
for (let _oy = 0; _oy < line.length; _oy++) {
const _of = line[_oy];
if (q) { if (_of === '"') { if (line[_oy + 1] === '"') { _ok += '"'; _oy++; } else q = false; } else _ok += _of; }
else if (_of === '"') q = true;
else if (_of === sep) { _o1m.push(_ok); _ok = ''; }
else _ok += _of;
}
_o1m.push(_ok);
return _o1m.map((_o33) => _o33.trim());
}
const _o1 = { email: /^(e ?mail|thu|dia chi email)$/, full_name: /^(ho ten|ho va ten|ten|ten nhan vien|name|full ?name)$/, phone: /^(sdt|so dien thoai|dien thoai|phone|so dt)$/, role: /^(vai tro|chuc vu|role|vi tri)$/, team: /^(nhom|team|nhom sale)$/ };
export function parseInvites(text, { role = 'sale', team = '', teams = [] } = {}) {
const _o14 = String(text || '').replace(/^﻿/, '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
if (!_o14.length) return [];
const _o2h = (l) => (l.includes('\t') ? '\t' : l.includes(';') ? ';' : l.includes('|') ? '|' : ',');
const _o2s = (w) => { const _o11 = fold(w).trim(); if (!_o11) return ''; const _o33 = (teams || []).find((tm) => fold(tm.name).trim() === _o11 || tm.id === w); return _o33 ? _o33.id : null; };
const _o2g = _o2h(_o14[0]);
const _ox = _o2n(_o14[0], _o2g).map((_of) => fold(_of).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim());
const _og = {};
_ox.forEach((_of, _oy) => { for (const [_o11, re] of Object.entries(_o1)) if (re.test(_of) && _og[_o11] === undefined) _og[_o11] = _oy; });
const _o1m = [];
const push = (line, f) => {
const email = String(f.email || '').trim().replace(/^mailto:/i, '');
const _o1n = [];
let full_name = String(f.full_name || '').replace(/\s+/g, ' ').trim(), guessed = false;
if (!email) _o1n.push('Thiếu email.');
else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) _o1n.push('Email chưa đúng.');
if (!full_name && email) { full_name = nameFromEmail(email); guessed = true; }
if (!full_name) _o1n.push('Thiếu họ tên.');
let r = role;
if (f.role) { const _o33 = roleFromWord(f.role); if (_o33) r = _o33; else _o1n.push('Không hiểu vai trò "' + f.role + '".'); }
let tm = team;
if (f.team) { const _o33 = _o2s(f.team); if (_o33) tm = _o33; else if (_o33 === null) _o1n.push('Không có nhóm "' + f.team + '".'); }
_o1m.push({ line, full_name, email, phone: String(f.phone || '').trim(), role: r, team: r === 'owner' ? '' : tm, guessed, problems: _o1n });
};
if (_og.email !== undefined) {
_o14.slice(1).forEach((l, _oy) => {
const _of = _o2n(l, _o2g), g = (_o11) => (_og[_o11] !== undefined ? _of[_og[_o11]] || '' : '');
push(_oy + 2, { email: g('email'), full_name: g('full_name'), phone: g('phone'), role: g('role'), team: g('team') });
});
} else {
_o14.forEach((l, _oy) => {
const _o1y = _o2n(l, _o2h(l)).filter(Boolean);
const _os = _o1y.filter((_o33) => _o0.test(_o33) && !/\s/.test(_o33.trim()));
if (_o1y.length === 1 && (l.match(new RegExp(_o0.source, 'g')) || []).length > 1) {
(l.match(new RegExp(_o0.source, 'g')) || []).forEach((_or) => push(_oy + 1, { email: _or }));
return;
}
if (_os.length > 1 && _o1y.every((_o33) => _o0.test(_o33))) { _os.forEach((_or) => push(_oy + 1, { email: _or })); return; }
const f = { email: '', full_name: '', phone: '', role: '', team: '' }, rest = [];
for (const _o33 of _o1y) {
const _o17 = _o33.match(_o0);
if (!f.email && _o17) {
f.email = _o17[0];
const _o13 = _o33.replace(_o17[0], '').replace(/[<>()"]/g, ' ').trim();
if (_o13) rest.push(_o13);
} else if (!f.phone && _o3.test(_o33.replace(/\s/g, ''))) f.phone = _o33.replace(/\s/g, '');
else if (!f.role && roleFromWord(_o33)) f.role = _o33;
else if (!f.team && _o2s(_o33)) f.team = _o33;
else rest.push(_o33);
}
f.full_name = rest.join(' ');
push(_oy + 1, f);
});
}
const _o2e = new Map();
_o1m.forEach((r, _oy) => { const _o11 = r.email.toLowerCase(); if (!_o11) return; if (_o2e.has(_o11)) r.problems.push('Trùng email với dòng ' + _o1m[_o2e.get(_o11)].line + '.'); else _o2e.set(_o11, _oy); });
return _o1m;
}
export function orgTree(rows, teams = []) {
const byId = new Map((rows || []).map((r) => [r.id, r]));
const owners = (rows || []).filter((r) => r.role === 'owner');
const T = (teams || []).map((tm) => ({ team: tm, leader: tm.leader ? byId.get(tm.leader) || null : null,
members: (tm.members || []).filter((id) => id !== tm.leader).map((id) => byId.get(id)).filter(Boolean) }));
const free = (rows || []).filter((r) => r.role !== 'owner' && !r.team && !r.leads.length);
return { owners, teams: T, free };
}
export const FLOW_COLS = ['Quản trị (Admin)', 'Trưởng nhóm', 'Sale trong nhóm', 'Marketing'];
export const FLOW_ROWS = [
['Tạo / xoá nhóm, chọn trưởng nhóm', '✓', '–', '–', '–'],
['Đẩy số từ Kho lead', 'Mọi nhóm', 'Nhóm mình (khi được tick "Đẩy số")', '–', 'Mọi nhóm'],
['Nhận số đẩy cho nhóm, bấm "Đã nhận"', '–', '✓', '–', '–'],
['Giao số cho sale trong nhóm', '✓', '✓', '–', '–'],
['Thu hồi số', 'Mọi nhóm', 'Trong nhóm mình', '–', 'Khi được tick "Đẩy số"'],
['Thêm / bớt sale trong nhóm', '✓', 'Sale chưa thuộc nhóm nào', '–', '–'],
['Bật tự giao, nhắc Hẹn xem / Đặt cọc / Chốt', '✓', '✓', '–', '–'],
['Bấm "Đã gọi", báo cáo số được giao', '–', 'Khi tự nhận số', '✓', '–'],
['Xem báo cáo nguồn lead', '✓', 'Nhóm mình', '–', 'Khi được tick "Báo cáo"']
];
export function customCount(u) { const _of = u && u.perms_custom; return _of && typeof _of === 'object' ? Object.keys(_of).length : 0; }
function _oj() { try { ensureCss(new URL('./nhan_su.dcc2636732.css', import.meta.url).href, 'bds-nhansu-css'); } catch { } }
function _oz(_o2d) { return String(_o2d || '•').trim().charAt(0).toUpperCase() || '•'; }
function _o1e(ctx, _o11) { return !!(ctx && ctx.user && ctx.user.perms && ctx.user.perms[_o11] === true); }
function _o1d(ctx, u) { return import('../packs/bds/members/panel.js').then((mm) => mm.openReassign(ctx, { from: u.id, title: 'Nhân viên nghỉ – chuyển khách cho …', reason: 'Nhân viên nghỉ việc' })).catch(() => { }); }
const errText = (e) => (e && (e.userMessage || e.message)) || t('err.generic');
function _o2p() { const _o17 = /[?&]tab=([a-z]+)/.exec(location.hash || ''); return _o17 && TABS.some((_o33) => _o33[0] === _o17[1]) ? _o17[1] : 'ds'; }
function _o2i(_o11) {
try {
const base = (location.hash || '#/settings/users').split('?')[0];
history.replaceState(history.state, '', location.pathname + location.search + base + (_o11 === 'ds' ? '' : '?tab=' + _o11));
} catch { }
}
export async function mountStaff(el, ctx, app) {
_oj();
const { ui, api } = ctx;
const { h, button } = ui;
const _o19 = ctx.user || {};
const _o29 = h('div', { class: 'staff', 'data-testid': 'staff' });
el.appendChild(_o29);
if (!(_o19.perms && _o19.perms.admin && _o19.role === 'owner')) {
_o29.append(h('div', { class: 'card staff-deny', 'data-testid': 'staff-deny' }, h('p', null, 'Chỉ Quản trị (Admin) mở được Nhân sự. Trưởng nhóm quản lý nhóm mình ở Khách hàng › Kho lead › Nhóm sale.'),
h('div', { class: 'btn-row' }, button('Về Cài đặt', () => ctx.nav('settings'), { kind: 'secondary', icon: 'back' }))));
return;
}
if (!usersVisible(installEdition(app))) {
_o29.append(h('div', { class: 'card staff-deny', 'data-testid': 'staff-solo' }, h('p', null, 'Bản Cá nhân dùng cho 1 người – không có Nhân sự. Muốn cả nhóm cùng dùng: chuyển sang Bản Công ty ở Cài đặt › Bản quyền (dữ liệu giữ nguyên).')));
return;
}
const _o2m = !!(app && app.status && app.status.single_user);
const S = { users: [], teams: [], teamsOk: false, rows: [], tab: _o2p(), f: { q: '', role: '', team: '', status: '' }, page: 1, size: 25, picked: new Set(), built: {} };
const _o2o = h('p', { class: 'muted staff-sub', 'data-testid': 'staff-sub' });
const tabBar = h('div', { class: 'staff-tabs', role: 'tablist', 'aria-label': 'Nhân sự' });
const _o1x = {};
for (const [_o11, label] of TABS) {
_o1x[_o11] = h('div', { class: 'staff-pane', role: 'tabpanel', 'data-testid': 'staff-pane-' + _o11, hidden: true });
tabBar.append(h('button', { type: 'button', class: 'staff-tab', role: 'tab', dataset: { tab: _o11 }, 'data-testid': 'staff-tab-' + _o11, onclick: () => _o2j(_o11) }, label));
}
_o29.append(h('div', { class: 'staff-head' }, _o2o), tabBar, ...Object.values(_o1x));
const D = adminDialogs(ctx, app, { getUsers: () => S.users, redraw: () => _o25() });
await _o25();
_o2j(S.tab);
async function _o25() {
try {
const r = await api.call('users.list', {});
S.users = (Array.isArray(r) ? r : (r && (r.users || r.items)) || []).filter((u) => !Number(u.deleted));
clearDirectory();
} catch (e) {
S.users = [];
_o1x.ds.replaceChildren(h('p', { class: 'muted', 'data-testid': 'users-legacy' }, isLegacyError(e)
? 'Máy chủ đang chạy bản cũ (một mật khẩu). Cập nhật mã máy chủ bản có "Người dùng" rồi tải lại trang để thêm nhân viên.'
: errText(e)));
S.legacy = true;
return;
}
try { const info = await api.call('pool.info', {}); S.teams = (info && info.teams) || []; S.teamsOk = true; } catch { S.teams = []; S.teamsOk = false; }
S.rows = staffRows(S.users, S.teams);
const ids = new Set(S.rows.map((r) => r.id));
for (const id of [...S.picked]) if (!ids.has(id)) S.picked.delete(id);
const locked = S.rows.filter((r) => r.status === 'locked').length;
_o2o.textContent = S.rows.length + ' người' + (S.teamsOk ? ' · ' + S.teams.length + ' nhóm sale' : '') + (locked ? ' · ' + locked + ' đã khoá' : '');
for (const _o11 of Object.keys(S.built)) if (S.built[_o11] && _o11 !== 'moi' && _o11 !== 'khac') { S.built[_o11] = false; if (_o11 === S.tab) _o8(_o11); }
}
function _o2j(_o11) {
S.tab = _o11; _o2i(_o11);
for (const _o6 of tabBar.children) { const _o1k = _o6.dataset.tab === _o11; _o6.classList.toggle('on', _o1k); _o6.setAttribute('aria-selected', String(_o1k)); }
for (const [pk, _o1n] of Object.entries(_o1x)) _o1n.hidden = pk !== _o11;
if (!S.built[_o11]) _o8(_o11);
}
function _o8(_o11) {
S.built[_o11] = true;
if (S.legacy && _o11 !== 'moi') return;
if (_o11 === 'ds') _o1s();
else if (_o11 === 'nhom') _o1u();
else if (_o11 === 'quyen') _o1v();
else if (_o11 === 'moi') _o1r();
else if (_o11 === 'khac') _o1t();
}
function _o1s() {
const P = _o1x.ds;
const q = h('input', { type: 'search', class: 'staff-q', placeholder: 'Tìm tên, @tên đăng nhập, email, SĐT, nhóm…', value: S.f.q, 'aria-label': 'Tìm nhân sự', 'data-testid': 'staff-q' });
let _o23 = 0;
q.addEventListener('input', () => { clearTimeout(_o23); _o23 = setTimeout(() => { S.f.q = q.value; S.page = 1; _o1w(); }, 150); });
const sel = (opts, key, label, tid) => {
const _o2d = h('select', { 'aria-label': label, 'data-testid': tid, onchange: () => { S.f[key] = _o2d.value; S.page = 1; _o1w(); } }, opts.map(([_o31, l]) => h('option', { value: _o31, selected: S.f[key] === _o31 }, l)));
return _o2d;
};
const roles = [['', 'Vai trò'], ...ROLES.filter((r) => S.rows.some((_o33) => _o33.role === r)).map((r) => [r, roleLabel(r)]), ...(S.teamsOk ? [['leader', '👑 Trưởng nhóm']] : [])];
const filters = h('div', { class: 'staff-filters' }, q,
sel(roles, 'role', 'Lọc theo vai trò', 'staff-f-role'),
S.teamsOk ? sel([['', 'Nhóm'], ['-', 'Chưa vào nhóm'], ...S.teams.map((_o33) => [_o33.id, _o33.name])], 'team', 'Lọc theo nhóm', 'staff-f-team') : null,
sel([['', 'Trạng thái'], ...Object.entries(STATUS).map(([_o11, _o31]) => [_o11, _o31[0]])], 'status', 'Lọc theo trạng thái', 'staff-f-status'));
const tools = h('div', { class: 'btn-row staff-tools' },
_o2m ? null : button('Thêm người', () => D.openAdd(), { kind: 'primary', icon: 'plus', testid: 'users-add' }),
_o2m ? null : button('Mời nhiều người', () => _oa(), { kind: 'secondary', icon: 'mail', testid: 'staff-bulk-invite' }),
button('Nhật ký', () => D.openAudit(), { kind: 'ghost', icon: 'log', testid: 'users-audit' }));
const bar = h('div', { class: 'staff-bar', 'data-testid': 'staff-bar', hidden: true });
const list = h('div', { class: 'staff-list', role: 'table', 'aria-label': 'Danh sách nhân sự', 'data-testid': 'users-list' });
const _o1p = h('div', { class: 'staff-pager', 'data-testid': 'staff-pager' });
P.replaceChildren(
_o2m ? h('p', { class: 'muted small', 'data-testid': 'users-solo' }, 'Bản Cá nhân dùng cho 1 người – không thêm được người dùng hay mời nhân viên. Muốn cả nhóm cùng dùng: chuyển sang Bản Công ty ở Cài đặt › Bản quyền (dữ liệu giữ nguyên).') : null,
tools, filters, bar, list, _o1p);
_o1w();
function _o1w() {
const _o2l = filterStaff(S.rows, S.f);
const _o1z = pageOf(_o2l, S.page, S.size);
S.page = _o1z.page;
const _o1o = _o1z.items.map((r) => r.id).filter((id) => id !== _o19.id);
const _o5 = _o1o.length > 0 && _o1o.every((id) => S.picked.has(id));
const _ox = h('div', { class: 'staff-row staff-row-head', role: 'row' },
h('span', { class: 'st-c-pick', role: 'columnheader' }, h('input', { type: 'checkbox', checked: _o5, 'aria-label': 'Chọn cả trang', 'data-testid': 'staff-pick-page',
onchange: (e) => { _o1o.forEach((id) => (e.target.checked ? S.picked.add(id) : S.picked.delete(id))); _o1w(); } })),
h('span', { class: 'st-c-name', role: 'columnheader' }, 'Họ tên'),
h('span', { class: 'st-c-role', role: 'columnheader' }, 'Vai trò'),
S.teamsOk ? h('span', { class: 'st-c-team', role: 'columnheader' }, 'Nhóm') : null,
h('span', { class: 'st-c-status', role: 'columnheader' }, 'Trạng thái'),
h('span', { class: 'st-c-last', role: 'columnheader' }, 'Đăng nhập cuối'));
const _o2b = (r) => {
const self = r.id === _o19.id;
const _o2t = r.leads.length ? '👑 ' + r.leads.map((_o33) => _o33.name).join(', ') : r.team ? r.team.name : '';
return h('div', { class: ['staff-row', S.picked.has(r.id) && 'on'], role: 'row', dataset: { user: r.username }, 'data-testid': 'staff-row-' + r.username,
onclick: (e) => { if (!e.target.closest('input, button, select, a')) D.openUser(r.u); } },
h('span', { class: 'st-c-pick', role: 'cell' }, self ? null : h('input', { type: 'checkbox', checked: S.picked.has(r.id), 'aria-label': 'Chọn ' + r.name, 'data-testid': 'staff-pick-' + r.username,
onchange: (e) => { if (e.target.checked) S.picked.add(r.id); else S.picked.delete(r.id); _o1q(); e.target.closest('.staff-row').classList.toggle('on', e.target.checked); } })),
h('button', { type: 'button', class: 'st-c-name st-open', role: 'cell', onclick: () => D.openUser(r.u), 'aria-label': 'Mở hồ sơ ' + r.name },
h('span', { class: 'avatar avatar-sm' }, _oz(r.name)),
h('span', { class: 'st-name-text' }, h('strong', null, r.name + (self ? ' (tôi)' : '')), h('small', { class: 'muted' }, '@' + r.username))),
h('span', { class: 'st-c-role', role: 'cell' }, ui.badge(roleLabel(r.role), ROLE_TONE[r.role] || 'neutral'), customCount(r.u) ? h('small', { class: 'muted st-custom', title: 'Đã chỉnh quyền riêng' }, '✎ ' + customCount(r.u)) : null),
S.teamsOk ? h('span', { class: 'st-c-team', role: 'cell' }, _o2t) : null,
h('span', { class: 'st-c-status', role: 'cell', dataset: { flags: r.flags.join(' ') } }, r.flags.map((f) => ui.badge((STATUS[f] || STATUS.active)[0], (STATUS[f] || STATUS.active)[1]))),
h('span', { class: 'st-c-last muted small', role: 'cell' }, r.last_login ? ui.date(r.last_login, true) : 'chưa đăng nhập'));
};
list.replaceChildren(_ox, ...(_o1z.items.length ? _o1z.items.map(_o2b) : [h('p', { class: 'muted staff-empty', 'data-testid': 'staff-empty' }, S.rows.length ? 'Không có ai khớp bộ lọc.' : 'Chưa có người dùng.')]));
const size = h('select', { 'aria-label': 'Số dòng mỗi trang', 'data-testid': 'staff-size', onchange: () => { S.size = Number(size.value); S.page = 1; _o1w(); } }, PAGE_SIZES.map((_o1f) => h('option', { value: _o1f, selected: _o1f === S.size }, _o1f + ' / trang')));
_o1p.replaceChildren(
h('span', { class: 'muted small', 'data-testid': 'staff-count' }, _o1z.total ? _o1z.from + '–' + _o1z.to + ' / ' + _o1z.total + ' người' : '0 người'),
_o1z.pages > 1 ? button('Trước', () => { S.page--; _o1w(); }, { kind: 'ghost', small: true, icon: 'back', testid: 'staff-prev', disabled: _o1z.page <= 1 }) : null,
_o1z.pages > 1 ? h('span', { class: 'small' }, 'Trang ' + _o1z.page + '/' + _o1z.pages) : null,
_o1z.pages > 1 ? button('Sau', () => { S.page++; _o1w(); }, { kind: 'ghost', small: true, icon: 'next', testid: 'staff-next', disabled: _o1z.page >= _o1z.pages }) : null,
size);
for (const _o6 of _o1p.querySelectorAll('button')) if (_o6.dataset.testid === 'staff-prev' ? _o1z.page <= 1 : _o6.dataset.testid === 'staff-next' ? _o1z.page >= _o1z.pages : false) _o6.disabled = true;
_o1q();
}
function _o1q() {
const _o1f = S.picked.size;
bar.hidden = !_o1f;
if (!_o1f) { bar.replaceChildren(); return; }
const picked = S.rows.filter((r) => S.picked.has(r.id));
bar.replaceChildren(
h('strong', { 'data-testid': 'staff-picked' }, 'Đã chọn ' + _o1f),
S.teamsOk ? button('Đổi nhóm', () => _od(picked), { kind: 'secondary', small: true, icon: 'customers', testid: 'staff-bulk-team' }) : null,
button('Đổi vai trò', () => _oc(picked), { kind: 'secondary', small: true, icon: 'user', testid: 'staff-bulk-role' }),
picked.some((r) => r.status !== 'locked') ? button('Khoá', () => _ob(picked, true), { kind: 'secondary', small: true, icon: 'lock', testid: 'staff-bulk-lock' }) : null,
picked.some((r) => r.status === 'locked') ? button('Mở khoá', () => _ob(picked, false), { kind: 'secondary', small: true, icon: 'lock', testid: 'staff-bulk-unlock' }) : null,
button('Xoá', () => _o9(picked), { kind: 'danger', small: true, icon: 'x', testid: 'staff-bulk-delete' }),
button('Bỏ chọn', () => { S.picked.clear(); _o1w(); }, { kind: 'ghost', small: true, icon: 'close', testid: 'staff-bulk-clear' }));
}
}
async function _o2c(list, fn, doneText) {
let ok = 0; const _o7 = [];
for (const r of list) { try { await fn(r); ok++; } catch (e) { _o7.push(r.name + ': ' + errText(e)); } }
S.picked.clear();
await _o25();
if (_o7.length) ui.modal({ title: 'Xong ' + ok + '/' + list.length, body: h('div', { class: 'stack', 'data-testid': 'staff-bulk-errors' }, h('p', null, doneText(ok) + ' Chưa làm được:'), h('ul', null, _o7.slice(0, 20).map((_o33) => h('li', null, _o33)))), actions: [{ label: t('common.close'), kind: 'primary' }] });
else ui.toast(doneText(ok), 'ok');
}
const _o1j = (list) => list.filter((r) => r.id !== _o19.id);
async function _od(list) {
const target = h('select', { 'data-testid': 'staff-bulk-team-to', 'aria-label': 'Chuyển vào nhóm' }, [['', '– Không thuộc nhóm nào –'], ...S.teams.map((_o33) => [_o33.id, _o33.name])].map(([_o31, l]) => h('option', { value: _o31 }, l)));
const ok = await ui.modal({ title: 'Đổi nhóm cho ' + list.length + ' người', body: h('div', { class: 'stack' },
h('label', { class: 'field' }, h('span', { class: 'field-label' }, 'Chuyển vào'), target),
h('p', { class: 'muted small' }, 'Mỗi người ở 1 nhóm: người đang ở nhóm khác sẽ chuyển sang. Số đã giao giữ nguyên. Đây cũng là nhóm dùng khi đẩy số ở Kho lead.')),
actions: [{ label: t('common.cancel'), kind: 'ghost', value: false }, { label: 'Đổi nhóm', kind: 'primary', value: true, id: 'staff-bulk-team-ok' }] }).done;
if (ok !== true) return;
const to = target.value;
const _o1b = list.filter((r) => (r.team ? r.team.id : '') !== to);
const _oe = new Map();
for (const r of _o1b) if (r.team) _oe.set(r.team.id, [...(_oe.get(r.team.id) || []), r.id]);
const _o7 = [];
for (const [tid, ids] of _oe) { try { await api.call('pool.team_members', { id: tid, remove: ids }); } catch (e) { _o7.push(errText(e)); } }
if (to) { const add = _o1b.filter((r) => r.status !== 'locked').map((r) => r.id); if (add.length) try { await api.call('pool.team_members', { id: to, add }); } catch (e) { _o7.push(errText(e)); } }
S.picked.clear();
await _o25();
const tn = to ? (S.teams.find((_o33) => _o33.id === to) || {}).name : '';
if (_o7.length) ui.toast(_o7[0], 'danger'); else ui.toast('Đã chuyển ' + _o1b.length + ' người ' + (to ? 'vào ' + tn : 'ra khỏi nhóm') + (_o1b.some((r) => r.status === 'locked') && to ? ' (người đã khoá không vào nhóm)' : ''), 'ok');
}
async function _oc(list) {
list = _o1j(list);
const role = h('select', { 'data-testid': 'staff-bulk-role-to', 'aria-label': 'Vai trò mới' }, ROLES.map((r) => h('option', { value: r, selected: r === 'sale' }, roleLabel(r))));
const _on = h('p', { class: 'field-hint' }, ROLE_SUMMARY.sale);
role.addEventListener('change', () => { _on.textContent = ROLE_SUMMARY[role.value] || ''; });
const ok = await ui.modal({ title: 'Đổi vai trò cho ' + list.length + ' người', body: h('div', { class: 'stack' }, h('label', { class: 'field' }, h('span', { class: 'field-label' }, 'Vai trò mới'), role, _on),
h('p', { class: 'muted small' }, 'Quyền riêng đã chỉnh của từng người vẫn giữ. Trưởng nhóm không phải vai trò: chọn ở thẻ Nhóm & chia số.')),
actions: [{ label: t('common.cancel'), kind: 'ghost', value: false }, { label: 'Đổi vai trò', kind: 'primary', value: true, id: 'staff-bulk-role-ok' }] }).done;
if (ok !== true) return;
const _o31 = role.value;
await _o2c(list.filter((r) => r.role !== _o31), (r) => api.call('users.update', { id: r.id, role: _o31 }), (_o1f) => 'Đã đổi vai trò ' + _o1f + ' người thành ' + roleLabel(_o31) + '.');
}
async function _ob(list, lock) {
list = _o1j(list).filter((r) => (lock ? r.status !== 'locked' : r.status === 'locked'));
if (!list.length) return;
if (lock && !(await ui.confirm('Khoá ' + list.length + ' tài khoản? Những người này bị đăng xuất mọi máy và không đăng nhập được cho tới khi mở khoá.', { ok: 'Khoá', kind: 'danger', title: 'Khoá tài khoản' }))) return;
await _o2c(list, (r) => api.call('users.update', { id: r.id, status: lock ? 'locked' : 'active' }), (_o1f) => (lock ? 'Đã khoá ' : 'Đã mở khoá ') + _o1f + ' người.');
}
async function _o9(list) {
list = _o1j(list);
if (!list.length) return;
const _o1h = list.slice(0, 8).map((r) => r.name).join(', ') + (list.length > 8 ? ' và ' + (list.length - 8) + ' người nữa' : '');
const ok = await ui.modal({ title: 'Xoá ' + list.length + ' người dùng?', body: h('div', { class: 'stack', 'data-testid': 'staff-delete-box' },
h('p', { class: 'lead' }, _o1h),
h('p', null, 'Xoá hẳn khỏi danh sách: đăng xuất mọi máy, bỏ khỏi nhóm sale, thôi làm trưởng nhóm. Tên đăng nhập cũ không cấp lại cho người khác. Không hoàn tác được – chỉ tạm ngưng thì bấm Khoá.'),
h('p', { class: 'inv-warn small' }, '⚠️ Khách đang giao cho những người này giữ nguyên' + (_o1e(ctx, 'mx_move') ? ' – nên "Nhân viên nghỉ – chuyển khách cho …" (trong hồ sơ từng người) trước khi xoá.' : ' – chia lại ở Khách hàng trước khi xoá.'))),
actions: [{ label: t('common.cancel'), kind: 'ghost', value: false }, { label: 'Xoá ' + list.length + ' người', kind: 'danger', value: true, id: 'staff-delete-ok' }] }).done;
if (ok !== true) return;
await _o2c(list, (r) => api.call('users.delete', { id: r.id }).then(() => S.picked.delete(r.id)), (_o1f) => 'Đã xoá ' + _o1f + ' người.');
}
async function _oa() {
let _om = { seats: null, mail_quota: null };
try { _om = (await api.call('invite.list', {})) || _om; } catch { }
const I = await import('./invites.0f40ad74f0.js');
const err = h('p', { class: 'form-err', role: 'alert', 'data-testid': 'staff-inv-err' });
const ta = h('textarea', { rows: 7, 'data-testid': 'staff-inv-text', placeholder: 'Mỗi dòng một người, vd:\nNguyễn Thị Lan, lan@gmail.com, 0912345678\nminh.tran@gmail.com\nHoặc dán cột email từ Excel / tải tệp CSV (cột Họ tên, Email, SĐT, Vai trò, Nhóm).', 'aria-label': 'Danh sách mời' });
const _ou = h('input', { type: 'file', accept: '.csv,.txt,text/csv,text/plain', 'data-testid': 'staff-inv-file', 'aria-label': 'Tải tệp CSV' });
_ou.addEventListener('change', async () => { const f = _ou.files && _ou.files[0]; if (!f) return; const _o2y = await f.text(); ta.value = (ta.value.trim() ? ta.value.trim() + '\n' : '') + _o2y.trim(); _o21(); });
const role = h('select', { 'data-testid': 'staff-inv-role', 'aria-label': 'Vai trò mặc định', onchange: () => _o21() }, _o2.filter((r) => ROLES.includes(r)).map((r) => h('option', { value: r }, I.ROLE_NAME[r] || roleLabel(r))));
const team = S.teamsOk && S.teams.length ? h('select', { 'data-testid': 'staff-inv-team', 'aria-label': 'Nhóm mặc định', onchange: () => _o21() }, [['', '– Chưa vào nhóm –'], ...S.teams.map((_o33) => [_o33.id, _o33.name])].map(([_o31, l]) => h('option', { value: _o31 }, l))) : null;
const box = h('div', { class: 'staff-inv-preview', 'data-testid': 'staff-inv-preview' });
const info = h('p', { class: 'muted small' }, [I.seatsText(_om.seats), _om.mail_quota !== null && _om.mail_quota !== undefined ? 'Hôm nay Google còn cho gửi ' + _om.mail_quota + ' thư.' : ''].filter(Boolean).join(' '));
let rows = [];
ta.addEventListener('input', () => { clearTimeout(ta._t); ta._t = setTimeout(_o21, 250); });
const _o17 = ui.modal({ title: 'Mời nhiều người', wide: true, cls: 'user-modal', body: h('div', { class: 'stack', 'data-testid': 'staff-inv-dialog' },
h('p', { class: 'muted small' }, 'Mỗi người nhận 1 email có link riêng: tự đặt mật khẩu, nhập mã 6 số rồi vào app đúng vai trò' + (team ? ' và vào thẳng nhóm đã chọn' : '') + '. Link dùng 1 lần, hết hạn sau 7 ngày.'),
ta, h('div', { class: 'staff-filters' }, h('label', { class: 'field' }, h('span', { class: 'field-label' }, 'Tệp CSV (tuỳ chọn)'), _ou),
h('label', { class: 'field' }, h('span', { class: 'field-label' }, 'Vai trò (dòng không ghi)'), role),
team ? h('label', { class: 'field' }, h('span', { class: 'field-label' }, 'Nhóm sale (dòng không ghi)'), team) : null),
info, box, err),
actions: [{ label: t('common.cancel'), kind: 'ghost' }, { label: 'Gửi lời mời', kind: 'primary', id: 'staff-inv-send', close: false, onClick: () => _o2f() }] });
_o21();
function _o21() {
rows = parseInvites(ta.value, { role: role.value, team: team ? team.value : '', teams: S.teams });
const _o2q = new Set(S.users.filter((u) => u.status === 'active' && u.email).map((u) => String(u.email).toLowerCase()));
rows.forEach((r) => { if (r.email && _o2q.has(r.email.toLowerCase())) r.problems.push('Đã có tài khoản.'); });
const _o7 = rows.filter((r) => r.problems.length).length, max = I.maxPeople(_om.seats);
if (!rows.length) { box.replaceChildren(h('p', { class: 'muted small' }, 'Chưa có dòng nào.')); return; }
const tn = (id) => (S.teams.find((_o33) => _o33.id === id) || {}).name || '–';
box.replaceChildren(
h('p', { class: 'small', 'data-testid': 'staff-inv-count' }, rows.length + ' người' + (_o7 ? ' · ' + _o7 + ' dòng cần sửa (bỏ qua khi gửi)' : '') + (_om.seats && Number(_om.seats.limit) && rows.length - _o7 > max ? ' · bản quyền chỉ còn ' + max + ' chỗ' : '')),
h('div', { class: 'table-wrap' }, h('table', { class: 'table staff-inv-table' },
h('thead', null, h('tr', null, ['Dòng', 'Họ tên', 'Email', 'Vai trò', team ? 'Nhóm' : null, ''].filter((_o33) => _o33 !== null).map((_of) => h('th', null, _of)))),
h('tbody', null, rows.slice(0, 200).map((r) => h('tr', { class: r.problems.length ? 'bad' : '' },
h('td', { class: 'num' }, r.line), h('td', null, r.full_name + (r.guessed ? ' (tên tạm)' : '')), h('td', null, r.email), h('td', null, I.ROLE_NAME[r.role] || roleLabel(r.role)),
team ? h('td', null, tn(r.team)) : null, h('td', { class: 'small' }, r.problems.length ? '⚠️ ' + r.problems.join(' ') : '✓')))))),
rows.some((r) => r.guessed) ? h('p', { class: 'muted small' }, '"Tên tạm" lấy từ email – người được mời sửa lại được sau khi vào app.') : null);
}
async function _o2f() {
err.textContent = '';
_o21();
const _ov = rows.filter((r) => !r.problems.length);
if (!_ov.length) { err.textContent = rows.length ? 'Mọi dòng đều cần sửa – xem cột cuối.' : 'Dán danh sách email hoặc chọn tệp CSV.'; return false; }
const people = _ov.map((r) => ({ full_name: r.full_name, email: r.email, phone: r.phone, role: r.role, team: r.team || '', slug: '', perms: {} }));
let _o18 = 0, mailed = 0; const _o32 = [];
for (let _oy = 0; _oy < people.length; _oy += I.UI_MAX) {
try {
const r = await api.call('invite.create', { people: people.slice(_oy, _oy + I.UI_MAX), base: I.inviteBase(api) });
_o18 += (r.invites || []).length; mailed += Number(r.mailed) || 0; if (r.warn) _o32.push(r.warn);
} catch (e) { err.textContent = (_o18 ? 'Đã tạo ' + _o18 + ' lời mời. ' : '') + errText(e); if (_o18) { S.built.moi = false; } return false; }
}
_o17.close();
S.built.moi = false;
ui.toast('Đã tạo ' + _o18 + ' lời mời' + (mailed ? ', đã gửi ' + mailed + ' thư' : '') + '.', 'ok');
if (_o32.length) ui.toast(_o32[0], 'warn', 9000);
_o2j('moi');
return true;
}
}
function _o1u() {
const P = _o1x.nhom;
if (!S.teamsOk) {
P.replaceChildren(h('div', { class: 'card staff-note', 'data-testid': 'staff-org-off' }, h('p', null, 'Nhóm sale và chia số qua trưởng nhóm có ở Bản Công ty (Kho lead). Bản này chưa có Kho lead.')));
return;
}
const _o2x = orgTree(S.rows, S.teams);
const person = (r, extra) => h('div', { class: 'org-person', dataset: { user: r.username } },
h('span', { class: 'avatar avatar-sm' }, _oz(r.name)),
h('button', { type: 'button', class: 'org-name st-open', onclick: () => D.openUser(r.u) }, h('strong', null, r.name), h('small', { class: 'muted' }, ' ' + roleLabel(r.role) + (r.status === 'locked' ? ' · đã khoá' : ''))),
extra || null);
const _o12 = (tm) => {
const _o2d = h('select', { 'aria-label': 'Trưởng nhóm của ' + tm.name, 'data-testid': 'org-leader-' + tm.id, onchange: async () => {
try { await api.call('pool.team_save', { team: { id: tm.id, name: tm.name, leader: _o2d.value, members: tm.members.includes(_o2d.value) || !_o2d.value ? tm.members : [...tm.members, _o2d.value] } }); ui.toast('Đã đổi trưởng nhóm ' + tm.name, 'ok'); await _o25(); } catch (e) { ui.toast(errText(e), 'danger'); }
} }, [['', '– chưa có –'], ...S.rows.filter((r) => r.status !== 'locked' && r.role !== 'owner').map((r) => [r.id, r.name + ' (' + roleLabel(r.role) + ')'])].map(([_o31, l]) => h('option', { value: _o31, selected: _o31 === (tm.leader || '') }, l)));
return _o2d;
};
const _o1a = (r) => {
const _o2d = h('select', { 'aria-label': 'Đưa ' + r.name + ' vào nhóm', 'data-testid': 'org-move-' + r.username, onchange: async () => {
if (!_o2d.value) return;
try { await api.call('pool.team_members', { id: _o2d.value, add: [r.id] }); ui.toast('Đã đưa ' + r.name + ' vào ' + (S.teams.find((_o33) => _o33.id === _o2d.value) || {}).name, 'ok'); await _o25(); } catch (e) { ui.toast(errText(e), 'danger'); _o2d.value = ''; }
} }, [['', 'Vào nhóm…'], ...S.teams.map((_o33) => [_o33.id, _o33.name])].map(([_o31, l]) => h('option', { value: _o31 }, l)));
return _o2d;
};
const _o26 = (tm, r) => button('', async () => {
if (!(await ui.confirm('Bỏ ' + r.name + ' khỏi ' + tm.name + '? Số đã giao giữ nguyên.', { ok: 'Bỏ khỏi nhóm', title: 'Bỏ khỏi nhóm' }))) return;
try { await api.call('pool.team_members', { id: tm.id, remove: [r.id] }); await _o25(); } catch (e) { ui.toast(errText(e), 'danger'); }
}, { kind: 'ghost', small: true, icon: 'close', title: 'Bỏ khỏi nhóm', testid: 'org-rm-' + tm.id + '-' + r.username });
P.replaceChildren(
h('p', { class: 'muted small' }, 'Cùng dữ liệu Nhóm sale của Kho lead: sửa ở đây là chia số dùng ngay, không phải cài hai chỗ. Số đẩy cho nhóm tới trưởng nhóm bấm "Đã nhận" rồi giao sale; quá giờ chuyển nhóm kế theo thứ tự dưới đây.'),
h('div', { class: 'org-tree', 'data-testid': 'org-tree' },
h('div', { class: 'org-level org-admin card' }, h('h3', { class: 'org-h' }, '🛡️ Quản trị (Admin)'), h('div', { class: 'org-people' }, _o2x.owners.map((r) => person(r)))),
h('div', { class: 'org-teams' }, _o2x.teams.map(({ team: tm, leader, members }, _oy) => h('div', { class: 'org-team card', 'data-testid': 'org-team-' + tm.id },
h('div', { class: 'org-team-head' }, h('h3', { class: 'org-h' }, (_oy + 1) + '. 👥 ' + tm.name, h('small', { class: 'muted' }, ' · ' + (members.length + (leader ? 1 : 0)) + ' người')),
button('', async () => {
if (!(await ui.confirm('Xoá nhóm "' + tm.name + '"? Người trong nhóm thành "Chưa vào nhóm", số đã giao giữ nguyên.', { ok: 'Xoá nhóm', kind: 'danger', title: 'Xoá nhóm' }))) return;
try { await api.call('pool.team_delete', { id: tm.id }); await _o25(); } catch (e) { ui.toast(errText(e), 'danger'); }
}, { kind: 'ghost', small: true, icon: 'x', title: 'Xoá nhóm', testid: 'org-del-' + tm.id })),
h('label', { class: 'org-leader' }, h('span', null, '👑 Trưởng nhóm'), _o12(tm)),
h('div', { class: 'org-people' }, members.length ? members.map((r) => person(r, _o26(tm, r))) : h('p', { class: 'muted small' }, 'Chưa có sale.')),
h('p', { class: 'muted small' }, 'Cách giao số: ' + (tm.auto === 'rr' ? 'tự giao lần lượt' : tm.auto === 'least' ? 'tự giao người ít số nhất' : 'trưởng nhóm giao tay') + (tm.ping ? ' · nhắc trưởng nhóm khi Hẹn xem / Đặt cọc / Chốt' : ''))))),
h('div', { class: 'org-free card', 'data-testid': 'org-free' }, h('h3', { class: 'org-h' }, 'Chưa vào nhóm (' + _o2x.free.length + ')'),
_o2x.free.length ? h('div', { class: 'org-people' }, _o2x.free.map((r) => person(r, r.status === 'locked' ? null : _o1a(r)))) : h('p', { class: 'muted small' }, 'Ai cũng đã có nhóm.'))),
h('div', { class: 'btn-row' },
button('Thêm nhóm sale', () => _o1i(), { kind: 'primary', icon: 'plus', testid: 'org-add-team' }),
button('Mở Kho lead', () => ctx.nav('customers/lead_pool'), { kind: 'ghost', icon: 'external', testid: 'org-open-pool' })));
}
async function _o1i() {
const name = h('input', { 'data-testid': 'org-team-name', placeholder: 'vd Nhóm Quận 7', 'aria-label': 'Tên nhóm' });
const leader = h('select', { 'data-testid': 'org-team-leader', 'aria-label': 'Trưởng nhóm' }, [['', '– chưa có –'], ...S.rows.filter((r) => r.status !== 'locked' && r.role !== 'owner').map((r) => [r.id, r.name + ' (' + roleLabel(r.role) + ')'])].map(([_o31, l]) => h('option', { value: _o31 }, l)));
const err = h('p', { class: 'form-err', role: 'alert' });
ui.modal({ title: 'Thêm nhóm sale', body: h('div', { class: 'stack' }, h('label', { class: 'field' }, h('span', { class: 'field-label' }, 'Tên nhóm'), name), h('label', { class: 'field' }, h('span', { class: 'field-label' }, 'Trưởng nhóm'), leader),
h('p', { class: 'muted small' }, 'Thêm sale sau: chọn nhiều người ở Danh sách › Đổi nhóm, hoặc "Vào nhóm…" ở mục Chưa vào nhóm.'), err),
actions: [{ label: t('common.cancel'), kind: 'ghost' }, { label: 'Tạo nhóm', kind: 'primary', id: 'org-team-save', onClick: async () => {
try { await api.call('pool.team_save', { team: { name: name.value.trim(), leader: leader.value, members: leader.value ? [leader.value] : [] } }); await _o25(); return true; } catch (e) { err.textContent = errText(e); return false; }
} }] });
}
async function _o1v() {
const P = _o1x.quyen;
P.replaceChildren(ui.spinner());
const I = await import('./invites.0f40ad74f0.js');
let _o24 = null;
try { _o24 = await api.call('perms.registry', {}); } catch { _o24 = null; }
const R = I.registryOr(_o24);
const roles = ['owner', 'manager', 'sale', 'ctv', ...(R.roles.some((_o33) => _o33.key === 'marketing') ? ['marketing'] : [])];
const perms = Object.fromEntries(R.roles.map((_o33) => [_o33.key, _o33.perms]));
const rows = I.permRows({ ...ROLE_PERMS, ...perms }, roles, R.features);
const _oh = (r) => S.rows.filter((_o33) => _o33.role === r).length;
const _ol = S.rows.filter((r) => customCount(r.u));
const _o2r = (_og, body, tid) => h('div', { class: 'table-wrap' }, h('table', { class: 'table table-roles', 'data-testid': tid },
h('thead', null, h('tr', null, h('th', null, 'Quyền'), _og.map((_of) => h('th', null, _of)))),
h('tbody', null, body.map((_o2a) => h('tr', null, h('th', { scope: 'row' }, _o2a[0]), _o2a.slice(1).map((_of) => h('td', { class: _of === '–' ? 'muted' : '' }, _of)))))));
P.replaceChildren(
h('div', { class: 'card staff-card' }, h('h3', { class: 'org-h' }, 'Quyền theo vai trò'),
h('p', { class: 'muted small' }, 'Vai trò là bộ quyền mặc định. Đổi vai trò: chọn người ở Danh sách › Đổi vai trò, hoặc mở hồ sơ từng người.'),
_o2r(roles.map((r) => roleLabel(r) + ' (' + _oh(r) + ')'), rows.map((r) => [r.label, ...r.cells]), 'staff-perm-roles'),
h('div', { class: 'staff-role-sum' }, roles.map((r) => h('p', { class: 'small' }, h('strong', null, roleLabel(r) + ': '), ROLE_SUMMARY[r] || '')))),
h('div', { class: 'card staff-card' }, h('h3', { class: 'org-h' }, 'Quyền trong chia số (theo vị trí trong nhóm)'),
h('p', { class: 'muted small' }, 'Trưởng nhóm không phải vai trò riêng: ai được chọn làm trưởng ở thẻ Nhóm & chia số thì có thêm các quyền dưới đây cho nhóm mình, trên nền vai trò của người đó.'),
_o2r(FLOW_COLS, FLOW_ROWS, 'staff-perm-flow')),
h('div', { class: 'card staff-card', 'data-testid': 'staff-perm-custom' }, h('h3', { class: 'org-h' }, 'Người có quyền riêng (' + _ol.length + ')'),
_ol.length ? h('div', { class: 'org-people' }, _ol.map((r) => h('div', { class: 'org-person' }, h('span', { class: 'avatar avatar-sm' }, _oz(r.name)),
h('button', { type: 'button', class: 'org-name st-open', onclick: () => D.openUser(r.u) }, h('strong', null, r.name), h('small', { class: 'muted' }, ' ' + roleLabel(r.role) + ' · chỉnh ' + customCount(r.u) + ' quyền')))))
: h('p', { class: 'muted small' }, 'Chưa ai được chỉnh riêng – mọi người dùng đúng quyền của vai trò. Chỉnh từng người: mở hồ sơ › Quyền từng phần.')));
}
function _o1r() {
const P = _o1x.moi;
const _o10 = h('div', { 'data-testid': 'users-invites' });
P.replaceChildren(_o2m ? h('p', { class: 'muted small' }, 'Bản Cá nhân không mời được nhân viên.') : h('div', { class: 'btn-row' }, button('Mời nhiều người', () => _oa(), { kind: 'secondary', icon: 'mail', testid: 'staff-bulk-invite-2' })), _o10);
if (!_o2m) import('./invites.0f40ad74f0.js').then((_o17) => _o17.renderInvitesPanel(_o10, { ui, api, onUsersChanged: _o25 })).catch((e) => _o10.append(h('p', { class: 'muted small' }, errText(e))));
}
function _o1t() {
const P = _o1x.khac;
const _o1l = h('div', { 'data-testid': 'users-org' });
const _o1c = _o1e(ctx, 'mx_status') ? h('div', { 'data-testid': 'users-mx' }) : null;
P.replaceChildren(_o1l, _o1c);
import('./video_machine.7091cef818.js').then((_o17) => _o17.renderOrgPanel(_o1l, { ui, api, onChange: _o25, offered: !!(ctx && ctx.video && typeof ctx.video.offered === 'function' && ctx.video.offered()) })).catch(() => { });
if (_o1c) import('../packs/bds/members/panel.js').then((mm) => mm.renderDataStatus(_o1c, ctx, { onReassign: (_o33) => mm.openReassign(ctx, { from: _o33.id }) })).catch(() => { });
}
}
export function adminDialogs(ctx, app, { getUsers, redraw }) {
const { ui, api } = ctx;
const { h, button, field } = ui;
const _op = () => redraw();
const users = () => getUsers() || [];
function _o27(value, disabled) {
const _on = h('p', { class: 'field-hint', 'data-testid': 'role-desc' }, ROLE_SUMMARY[value || 'sale']);
const f = field({ label: 'Vai trò', type: 'select', value: value || 'sale', name: 'role', disabled,
options: ROLES.map((r) => ({ value: r, label: roleLabel(r) })), onChange: (_o31) => { _on.textContent = ROLE_SUMMARY[_o31] || ''; } });
f.appendChild(_on);
return f;
}
function _o28() {
return h('details', { class: 'role-table' },
h('summary', null, 'Vai trò được làm gì?'),
h('div', { class: 'table-wrap' }, h('table', { class: 'table table-roles' },
h('thead', null, h('tr', null, h('th', null, 'Quyền'), ROLES.map((r) => h('th', null, roleLabel(r))))),
h('tbody', null, ROLE_TABLE.map((_o2a) => h('tr', null, _o2a.map((_of, _oy) => (_oy ? h('td', { class: _of === '–' ? 'muted' : '' }, _of) : h('th', { scope: 'row' }, _of)))))))));
}
function _o2u() {
const pw = field({ label: 'Mật khẩu tạm', name: 'temp_pw', value: genTempPassword(), autocomplete: 'off', hint: 'Nhân viên dùng mật khẩu này lần đầu, sau đó bắt buộc đổi. Máy băm mật khẩu trước khi gửi – máy chủ không biết mật khẩu gốc.' });
pw.input.setAttribute('data-testid', 'temp-pw'); pw.input.setAttribute('spellcheck', 'false'); pw.input.classList.add('mono');
const _o2a = h('div', { class: 'btn-row' },
button('Tạo ngẫu nhiên', () => { pw.setValue(genTempPassword()); }, { kind: 'ghost', small: true, icon: 'refresh', testid: 'temp-gen' }),
button('Chép', () => ui.copy(pw.getValue()), { kind: 'ghost', small: true, testid: 'temp-copy' }));
return { el: h('div', { class: 'temp-pw' }, pw, _o2a), get: () => String(pw.getValue() || '').trim() };
}
async function _ow(pw) { const temp_salt = randomSalt(); return { temp_salt, temp_pw_hash: await hashPassword(pw, temp_salt) }; }
function _o2k(u, password) {
const url = inviteUrl(location.href, api.mode === 'gas' ? api.url : '');
const text = inviteText({ appName: t('app.name'), url, username: u.username, password, fullName: u.full_name });
const _o20 = h('pre', { class: 'invite-text', 'data-testid': 'invite-text' }, text);
ui.modal({
title: 'Gửi cho nhân viên', cls: 'invite-modal',
body: h('div', { class: 'stack', 'data-testid': 'invite-box' },
h('p', { class: 'muted' }, 'Chép và gửi qua Zalo/Telegram cho nhân viên. Mật khẩu tạm chỉ hiện một lần này.'), _o20),
actions: [{ label: 'Chép lời nhắn', kind: 'primary', id: 'invite-copy', close: false, onClick: () => ui.copy(text) }, { label: t('common.close'), kind: 'ghost', id: 'invite-close' }]
});
}
function openAdd() {
const err = h('p', { class: 'form-err', role: 'alert' });
const name = field({ label: 'Họ tên', name: 'full_name', autocomplete: 'off' });
const un = field({ label: t('auth.username'), name: 'username', autocomplete: 'off', hint: t('auth.username.help') });
un.input.setAttribute('autocapitalize', 'none'); un.input.setAttribute('spellcheck', 'false');
let _o2z = false;
un.input.addEventListener('input', () => { _o2z = true; const _o31 = un.input.value.toLowerCase().replace(/\s+/g, ''); if (_o31 !== un.input.value) un.input.value = _o31; });
name.input.addEventListener('input', () => { if (!_o2z) un.setValue(suggestUsername(name.getValue())); });
const email = field({ label: 'Email (bắt buộc)', type: 'email', name: 'email', autocomplete: 'off', id: 'user-email',
hint: 'Lần đăng nhập đầu, nhân viên nhập mã 6 số gửi tới email này (sửa được nếu gõ nhầm). Email đã xác nhận dùng để nhận mã khi quên mật khẩu.' });
const phone = field({ label: 'Số điện thoại', type: 'tel', name: 'phone', inputmode: 'tel', autocomplete: 'off' });
const role = _o27('sale');
const _o2w = _o2u();
return ui.modal({
title: 'Thêm người dùng', wide: true, cls: 'user-modal',
body: h('form', { class: 'stack', 'data-testid': 'user-form', novalidate: true, onsubmit: (e) => e.preventDefault() },
h('div', { class: 'grid-2' }, name, un, email, phone), role, _o28(), _o2w.el, err),
actions: [{ label: t('common.cancel'), kind: 'ghost' }, {
label: 'Tạo tài khoản', kind: 'primary', id: 'user-create', onClick: async () => {
err.textContent = '';
const username = normUsername(un.getValue());
const _o22 = usernameProblem(username);
if (_o22) { err.textContent = t('auth.err.username'); un.input.focus(); return false; }
if (users().some((u) => u.username === username)) { err.textContent = 'Tên đăng nhập đã có người dùng.'; return false; }
const pw = _o2w.get();
if (pw.length < 8) { err.textContent = t('auth.err.short'); return false; }
const _or = String(email.getValue() || '').trim();
if (!_or) { err.textContent = 'Nhập email của nhân viên (bắt buộc).'; email.input.focus(); return false; }
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(_or)) { err.textContent = 'Email chưa đúng dạng (vd ten@gmail.com) – gõ lại.'; email.input.focus(); return false; }
try {
const _oi = await api.call('users.create', {
username, full_name: String(name.getValue() || '').trim(), email: _or, phone: String(phone.getValue() || '').trim(),
role: role.getValue(), ...(await _ow(pw))
});
const u = (_oi && (_oi.user || _oi)) || {};
_o2k({ username, full_name: String(name.getValue() || '').trim(), ...u }, pw);
await _op();
return true;
} catch (e) { err.textContent = e.userMessage || e.message || t('err.generic'); return false; }
}
}]
});
}
function openUser(u) {
const _o19 = ctx.user || {};
const self = u.id === _o19.id;
const err = h('p', { class: 'form-err', role: 'alert' });
const name = field({ label: 'Họ tên', value: u.full_name || '' });
const _ot = u.email_verified !== undefined, ev = !!Number(u.email_verified);
const email = field({ label: 'Email', type: 'email', value: u.email || '', id: 'user-edit-email',
hint: self ? 'Đổi email của anh/chị ở Cài đặt › Thông tin cá nhân (cần mã xác nhận gửi tới email mới).'
: !_ot ? '' : ev ? 'Đã xác nhận. Đổi email thì người này phải xác nhận lại.' : 'Chưa xác nhận – người này nhập mã 6 số ở lần đăng nhập tới.' });
if (self) email.input.readOnly = true;
const phone = field({ label: 'Số điện thoại', type: 'tel', value: u.phone || '', inputmode: 'tel', autocomplete: 'off' });
const role = _o27(u.role, self);
const grace = !self && _ot && !ev && u.status !== 'locked' ? button('Cho dùng tạm 24 giờ', async () => {
if (!(await ui.confirm('Cho "' + (u.full_name || u.username) + '" dùng app 24 giờ khi chưa nhận được mã xác nhận email? Hết 24 giờ app hỏi lại.', { ok: 'Cho dùng tạm', title: 'Chưa xác nhận email' }))) return;
try { await api.call('users.email_grace', { id: u.id }); ui.toast('Đã cho dùng tạm 24 giờ', 'ok'); } catch (e) { err.textContent = e.userMessage || t('err.generic'); }
}, { kind: 'secondary', small: true, testid: 'user-email-grace' }) : null;
const _oo = h('div', { class: 'devices', 'data-testid': 'user-devices' });
const auth = (app && app.auth) || null;
const _o2v = u.role === 'owner' || u.role === 'manager';
const tfaToggle = _o2v ? null : field({ label: 'Bắt buộc xác thực 2 lớp khi đăng nhập ở máy lạ', type: 'checkbox', value: !!Number(u.tfa_owner_required || u.tfa_required), id: 'user-tfa-required',
onChange: (_o31) => _o30({ tfa_required: _o31 ? 1 : 0 }, _o31 ? 'Đã bắt buộc xác thực 2 lớp' : 'Đã bỏ bắt buộc xác thực 2 lớp') });
const loginBlock = h('div', { class: 'sub-block', 'data-testid': 'user-login-block' }, h('h4', { class: 'section-title' }, 'Đăng nhập'),
h('p', { class: 'muted' }, 'Tên đăng nhập: ', h('strong', null, '@' + u.username), ' · Xác thực 2 lớp: ',
_o2v ? 'bắt buộc (vai trò ' + roleLabel(u.role) + ')' : Number(u.tfa_required) ? 'bắt buộc (Quản trị yêu cầu)' : 'tuỳ người dùng',
Number(u.tfa_on) ? ' – đang dùng' : (_o2v || Number(u.tfa_required) ? ' – chưa có cách nhận mã (chưa nối Telegram)' : ''),
Number(u.tfa_totp) ? ' · có ứng dụng xác thực' : ''),
tfaToggle,
auth ? h('div', { class: 'btn-row' }, button('Đổi tên đăng nhập', () => renameDialog({
ui, auth, current: u.username, target: self ? null : { id: u.id, username: u.username, full_name: u.full_name },
onDone: async () => { _o17.close(); await _op(); }
}), { kind: 'secondary', icon: 'user', testid: 'user-rename' })) : null);
const _o30 = async (patch, msg) => {
err.textContent = '';
try { await api.call('users.update', { id: u.id, ...patch }); ui.toast(msg || t('common.saved'), 'ok'); await _op(); return true; } catch (e) { err.textContent = e.userMessage || t('err.generic'); return false; }
};
const permsBox = h('div', { 'data-testid': 'user-perms-box' });
const deptBox = h('div', { 'data-testid': 'user-dept-box' });
if (u.role !== 'owner') import('./video_machine.7091cef818.js').then((mm) => mm.memberDeptField(deptBox, { ui, api, user: u, onSaved: _op })).catch(() => { });
import('./invites.0f40ad74f0.js').then((mm) => mm.memberPermsBlock(permsBox, { ui, api, user: u, self, onSaved: _op })).catch(() => { });
const locked = u.status === 'locked';
const _o17 = ui.modal({
title: (u.full_name || u.username) + ' · @' + u.username, wide: true, cls: 'user-modal',
body: h('div', { class: 'stack', 'data-testid': 'user-detail' },
h('div', { class: 'grid-2' }, name, email, phone), grace, role, err,
h('div', { class: 'btn-row' },
button('Lưu thay đổi', async () => {
const _or = String(email.getValue() || '').trim();
if (!self && !_or && u.email) { err.textContent = 'Email là bắt buộc.'; email.input.focus(); return; }
const ok = await _o30({ full_name: String(name.getValue() || '').trim(), phone: String(phone.getValue() || '').trim(), ...(self ? {} : { email: _or, role: role.getValue() }) });
if (ok) _o17.close();
}, { kind: 'primary', icon: 'check', testid: 'user-save' }),
self ? null : button(locked ? 'Mở khoá' : 'Khoá tài khoản', async () => {
if (!locked && !(await ui.confirm('Khoá "' + (u.full_name || u.username) + '"? Người này không đăng nhập được cho tới khi mở khoá.', { ok: 'Khoá', kind: 'danger', title: 'Khoá tài khoản' }))) return;
if (await _o30({ status: locked ? 'active' : 'locked' }, locked ? 'Đã mở khoá' : 'Đã khoá')) { _o17.close(); if (!locked && _o1e(ctx, 'mx_move')) _o1d(ctx, u); }
}, { kind: locked ? 'secondary' : 'danger', icon: 'lock', testid: 'user-lock' }),
self || !_o1e(ctx, 'mx_move') ? null : button('Nhân viên nghỉ – chuyển khách cho …', () => { _o17.close(); _o1d(ctx, u); }, { kind: 'secondary', icon: 'send', testid: 'user-mx-reassign' }),
self ? null : button('Đặt lại mật khẩu tạm', async () => {
if (!(await ui.confirm('Cấp mật khẩu tạm mới cho "' + (u.full_name || u.username) + '"? Mọi thiết bị của người này sẽ bị đăng xuất.', { ok: 'Cấp mật khẩu mới', title: 'Đặt lại mật khẩu' }))) return;
const pw = genTempPassword();
try { await api.call('users.reset_password', { id: u.id, ...(await _ow(pw)) }); _o17.close(); _o2k(u, pw); await _op(); } catch (e) { err.textContent = e.userMessage || t('err.generic'); }
}, { kind: 'secondary', icon: 'refresh', testid: 'user-reset' }),
self ? null : button('Xoá người dùng', async () => {
if (!(await ui.confirm('Xoá hẳn "' + (u.full_name || u.username) + '"? Đăng xuất mọi máy, bỏ khỏi nhóm sale. Khách đang giao cho người này giữ nguyên – nên chuyển khách trước. Không hoàn tác được (chỉ tạm ngưng thì bấm Khoá).', { ok: 'Xoá', kind: 'danger', title: 'Xoá người dùng' }))) return;
try { await api.call('users.delete', { id: u.id }); _o17.close(); ui.toast('Đã xoá ' + (u.full_name || u.username), 'ok'); await _op(); } catch (e) { err.textContent = e.userMessage || t('err.generic'); }
}, { kind: 'ghost', icon: 'x', testid: 'user-delete' })),
loginBlock,
deptBox,
permsBox,
h('div', { class: 'sub-block' }, h('h4', { class: 'section-title' }, 'Thiết bị'), _oo),
h('div', { class: 'btn-row' }, button('Nhật ký của người này', () => { _o17.close(); openAudit(u.id); }, { kind: 'ghost', icon: 'log' })))
});
_oq();
async function _oq() {
ui.mountTo(_oo, ui.spinner());
try {
const r = await api.call('users.devices', { id: u.id });
const rows = (Array.isArray(r) ? r : (r && (r.devices || r.items)) || []).filter((d) => !Number(d.revoked));
const wipe = h('input', { type: 'checkbox', id: 'user-dev-wipe', 'data-testid': 'user-dev-wipe' });
ui.mountTo(_oo, rows.length ? h('label', { class: 'ds-wipe', for: 'user-dev-wipe' }, wipe, h('span', null, 'Máy bị mất – xoá dữ liệu trên máy')) : null,
ui.list(rows, (d) => h('div', { class: 'row-main' },
h('div', { class: 'row-text' }, h('strong', null, d.name || d.id), h('span', { class: 'muted small' }, d.last_seen ? ui.date(d.last_seen, true) : '')),
button(t('set.security.revoke'), async () => { await api.call('users.revoke_device', { device_id: d.id, wipe: !!wipe.checked }); ui.toast(t('set.security.revoked'), 'ok'); _oq(); }, { kind: 'ghost', small: true, icon: 'logout' })),
{ empty: 'Chưa đăng nhập thiết bị nào.' }));
} catch (e) { ui.mountTo(_oo, h('p', { class: 'muted' }, e.userMessage || t('err.network'))); }
}
return _o17;
}
function openAudit(userId = '') {
const box = h('div', { class: 'audit-list', 'data-testid': 'audit-list' }, ui.spinner());
const sel = field({ label: 'Người dùng', type: 'select', value: userId, options: [{ value: '', label: 'Tất cả' }, ...users().map((u) => ({ value: u.id, label: u.full_name || u.username }))], onChange: (_o31) => _o15(_o31) });
ui.modal({ title: 'Nhật ký', wide: true, body: h('div', { class: 'stack' }, sel, box), actions: [{ label: t('common.close'), kind: 'primary' }] });
_o15(userId);
async function _o15(uid) {
ui.mountTo(box, ui.spinner());
try {
const r = await api.call('audit.list', { user_id: uid || undefined, limit: 200 });
const rows = (Array.isArray(r) ? r : (r && (r.items || r.rows)) || []).slice().sort((a, _o6) => Number(_o6.at) - Number(a.at));
const _o1g = (id) => { const u = users().find((_o33) => _o33.id === id); return u ? (u.full_name || u.username) : ''; };
ui.mountTo(box, ui.list(rows, (a) => h('div', { class: 'row-text' },
h('div', { class: 'row-line' }, h('strong', null, auditLabel(a.action)), h('span', { class: 'muted small num' }, ui.date(Number(a.at), true))),
h('span', { class: 'muted small break' }, [_o1g(a.user_id), a.object_id, typeof a.detail === 'string' ? a.detail.slice(0, 140) : ''].filter(Boolean).join(' · '))),
{ empty: 'Chưa có nhật ký.' }));
} catch (e) { ui.mountTo(box, h('p', { class: 'muted' }, e.userMessage || t('err.network'))); }
}
}
return { openAdd, openUser, openAudit };
}
export default { mountStaff, staffRows, filterStaff, pageOf, parseInvites, orgTree, roleFromWord, nameFromEmail, staffStatus };

import { ROLE_PERMS } from './auth.cfa76474bd.js';
import { FEATURES, diffPerms, featureExperimental, EXPERIMENTAL_NOTE, EXPERIMENTAL_HINT } from './features.7307eb3773.js';
import { t } from './i18n.39c909b69c.js';
import { ensureCss } from './xkit.f03faf0986.js';
import { EMAIL_RE } from './email_verify.c44911bb1b.js';
export const ROLE_NAME = { owner: 'Quản trị (Admin)', manager: 'Quản lý / Trưởng nhóm', sale: 'Sale (bán hàng)', ctv: 'Cộng tác viên', marketing: 'Marketing' };
export const INVITE_ROLES = ['sale', 'manager', 'owner', 'ctv'];
export const UI_MAX = 50;
export const SUMMARY_ROLES = ['owner', 'manager', 'sale'];
export const SUMMARY_HEAD = { owner: 'Quản trị (Admin)', manager: 'Quản lý', sale: 'Sale', marketing: 'Marketing' };
export const usersPath = () => 'Cài đặt › ' + t('set.users');
export const adminNote = () => 'Anh/chị là Quản trị (Admin) – toàn quyền. Có thể thêm Quản trị khác sau trong ' + usersPath() + '.';
export function permRows(perms = ROLE_PERMS, roles = SUMMARY_ROLES, features = FEATURES) {
const P = (_ov) => perms[_ov] || {};
const _o15 = (_o13) => (_o13 ? '✓' : '–');
const _o1 = { all: 'Tất cả khách', own: 'Chỉ khách được chia cho mình', created: 'Chỉ khách mình nhập' };
const _o0 = { approve: 'Duyệt', draft: 'Soạn nháp', view: 'Chỉ xem' };
const rows = [{ key: 'customers_scope', label: 'Xem khách hàng', cells: roles.map((_ov) => _o1[P(_ov).customers_scope] || '–') }];
for (const f of features) {
if (f.key === 'customers_all') continue;
rows.push({ key: f.key, label: f.label + (featureExperimental(f) ? ' (' + EXPERIMENTAL_NOTE + ')' : ''), cells: roles.map((_ov) => (f.key === 'export' && P(_ov).export && P(_ov).customers_scope !== 'all' ? 'Khách của mình' : _o15(P(_ov)[f.key] !== false && P(_ov)[f.key] !== undefined))) });
}
rows.push({ key: 'policy', label: 'Chính sách bán hàng', cells: roles.map((_ov) => _o0[P(_ov).policy] || '–') });
rows.push({ key: 'admin', label: 'Cài đặt, thêm/khoá người, khoá AI, bản quyền', cells: roles.map((_ov) => _o15(P(_ov).admin)) });
return rows;
}
export function lockExperimental(_oa, f, h) {
if (!featureExperimental(f)) return _oa;
const _oe = _oa && _oa.querySelector ? _oa.querySelector('input') : null;
if (_oe) { _oe.checked = false; _oe.disabled = true; _oe.setAttribute('aria-disabled', 'true'); _oe.title = EXPERIMENTAL_HINT; }
_oa.classList.add('inv-perm-exp');
_oa.dataset.experimental = '1';
_oa.append(h('span', { class: 'muted small', 'data-testid': 'perm-exp-' + f.key }, EXPERIMENTAL_NOTE + ' – ' + EXPERIMENTAL_HINT));
return _oa;
}
export function registryOr(reg) {
if (reg && Array.isArray(reg.features) && reg.features.length && Array.isArray(reg.roles) && reg.roles.length) return reg;
return { features: FEATURES.slice(), roles: Object.keys(ROLE_PERMS).map((k) => ({ key: k, label: ROLE_NAME[k] || k, perms: ROLE_PERMS[k] })) };
}
export function suggestSlug(name, taken = new Set()) {
const base = String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 32).replace(/-+$/, '') || '';
if (!base) return '';
let _ox = base, n = 1;
while (taken.has(_ox) && n < 999) _ox = base.slice(0, 28) + '-' + (++n);
return _ox;
}
export const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/;
export function validatePeople(rows) {
const _ol = [], seen = new Map();
(Array.isArray(rows) ? rows : []).forEach((_ov, i) => {
const name = String((_ov && _ov.full_name) || '').trim(), em = String((_ov && _ov.email) || '').trim(), k = em.toLowerCase();
if (!name) _ol.push({ i, field: 'full_name', msg: 'Gõ họ tên.' });
if (!em) _ol.push({ i, field: 'email', msg: 'Gõ email (bắt buộc).' });
else if (!EMAIL_RE.test(em)) _ol.push({ i, field: 'email', msg: 'Email chưa đúng (cần đủ dạng tên, chữ @, tên miền).' });
else if (seen.has(k)) _ol.push({ i, field: 'email', msg: 'Email trùng với người ' + (seen.get(k) + 1) + '.' });
if (em) seen.set(k, seen.has(k) ? seen.get(k) : i);
const _oz = String((_ov && _ov.slug) || '').trim();
if (_oz && !SLUG_RE.test(_oz)) _ol.push({ i, field: 'slug', msg: 'Địa chỉ riêng chỉ gồm chữ thường không dấu, số, dấu "-".' });
else if (_oz && (rows.findIndex((_o14) => String((_o14 && _o14.slug) || '').trim() === _oz) !== i)) _ol.push({ i, field: 'slug', msg: 'Địa chỉ riêng trùng với người khác.' });
});
return _ol;
}
export function toPeople(rows) {
return (rows || []).map((_ov) => ({ full_name: String(_ov.full_name || '').trim(), email: String(_ov.email || '').trim(), phone: String(_ov.phone || '').trim(), role: String(_ov.role || 'sale'),
slug: String(_ov.slug || '').trim(), perms: _ov.role === 'owner' ? {} : (_ov.perms || {}) }));
}
export function resizeGroup(rows, g, n, role = g) {
const _oi = (rows || []).filter((_ov) => _ov.g === g), other = (rows || []).filter((_ov) => _ov.g !== g);
const next = _oi.slice(0, Math.max(0, n));
while (next.length < n) next.push({ g, role, full_name: '', email: '', phone: '', slug: '', perms: {} });
return g === 'sale' ? [...next, ...other] : [...other, ...next];
}
export function inviteMessage({ full_name, link, role, company } = {}) {
return 'Chào ' + (full_name || 'anh/chị') + ', mời anh/chị vào BDS Studio' + (company ? ' của ' + company : '') + (role ? ' với vai trò ' + (ROLE_NAME[role] || role) : '') + '.\n' +
'Bấm link để tự đặt mật khẩu (dùng 1 lần, hết hạn sau 7 ngày):\n' + (link || '') + '\n' +
'App sẽ gửi mã 6 số tới email của anh/chị để xác nhận.';
}
export function zaloHref(phone) {
let d = String(phone || '').replace(/\D/g, '');
if (d.startsWith('840')) d = '84' + d.slice(3);
return d.length >= 9 && d.length <= 12 ? 'https://zalo.me/' + d : '';
}
export function inviteBase(api, href = (typeof location !== 'undefined' ? location.href : '')) {
const _o12 = String(href || '').split('#')[0].split('?')[0];
return api && api.mode === 'gas' && api.url ? _o12 + '?server=' + encodeURIComponent(api.url) : _o12;
}
export function statusLabel(inv, now = Date.now()) {
const _o10 = inv && inv.status;
if (_o10 === 'used') return ['Đã nhận – đã có tài khoản', 'ok'];
if (_o10 === 'revoked') return ['Đã huỷ', 'neutral'];
if (_o10 === 'expired' || (_o10 === 'pending' && Number(inv.expires_at) <= now)) return ['Hết hạn', 'danger'];
return ['Đang chờ nhận', 'warn'];
}
export function seatsText(seats) {
if (!seats || !Number(seats.limit)) return '';
if (seats.trial) return 'Bản dùng thử Công ty tối đa ' + seats.limit + ' người – còn ' + Math.max(0, Number(seats.left) || 0) + ' chỗ (đã tính ' + (seats.pending || 0) + ' lời mời đang chờ). Mua bản quyền để thêm.';
return 'Bản quyền cho tối đa ' + seats.limit + ' người – còn ' + Math.max(0, Number(seats.left) || 0) + ' chỗ (đã tính ' + (seats.pending || 0) + ' lời mời đang chờ).';
}
export function maxPeople(seats) { return seats && Number(seats.limit) ? Math.max(0, Math.min(UI_MAX, Number(seats.left) || 0)) : UI_MAX; }
export function quotaWarn(n, quota) {
if (quota === null || quota === undefined || !(n > 0) || Number(quota) >= n) return '';
return 'Hôm nay Google chỉ còn cho gửi ' + Math.max(0, Number(quota)) + ' thư – ' + Math.max(0, Number(quota)) + ' người đầu nhận thư mời, ' + (n - Math.max(0, Number(quota))) +
' người còn lại: sau khi tạo, bấm "Chép link mời" hoặc "Gửi qua Zalo" cho từng người.';
}
function _o7() { try { ensureCss(new URL('./invites.21910a6901.css', import.meta.url).href, 'bds-invites-css'); } catch { } }
export function summaryRoles(reg) { return SUMMARY_ROLES.concat(reg && Array.isArray(reg.roles) && reg.roles.some((_o14) => _o14.key === 'marketing') ? ['marketing'] : []); }
export function permTable(ui, reg = null) {
_o7();
const { h } = ui;
const R = registryOr(reg), presets = Object.fromEntries(R.roles.map((_ov) => [_ov.key, _ov.perms]));
const roles = summaryRoles(R);
const rows = permRows({ ...ROLE_PERMS, ...presets }, roles, R.features);
return h('div', { class: 'table-wrap inv-perm', 'data-testid': 'inv-perm' }, h('table', { class: 'table table-roles' },
h('thead', null, h('tr', null, h('th', null, 'Được làm gì'), roles.map((_ov) => h('th', null, SUMMARY_HEAD[_ov])))),
h('tbody', null, rows.map((_ow) => h('tr', { dataset: { perm: _ow.key } }, h('th', { scope: 'row' }, _ow.label), _ow.cells.map((_o4) => h('td', { class: _o4 === '–' ? 'muted' : '' }, _o4)))))));
}
export function stepper(ui, { label, value = 0, min = 0, max = UI_MAX, onChange, testid, hint }) {
_o7();
const { h, button } = ui;
let _o13 = Math.max(min, Math.min(max, Number(value) || 0));
const input = h('input', { type: 'number', inputmode: 'numeric', min: String(min), max: String(max), value: String(_o13), class: 'inv-step-n', 'aria-label': label, 'data-testid': testid + '-n' });
const minus = button('', () => _oy(_o13 - 1), { kind: 'secondary', icon: 'minus', title: 'Bớt 1 người', testid: testid + '-minus' });
const _os = button('', () => _oy(_o13 + 1), { kind: 'secondary', icon: 'plus', title: 'Thêm 1 người', testid: testid + '-plus' });
const _od = h('p', { class: 'muted small', 'data-testid': testid + '-hint' }, hint || '');
function _om() { input.value = String(_o13); minus.disabled = _o13 <= min; _os.disabled = _o13 >= max; }
function _oy(n) { const _o14 = Math.max(min, Math.min(max, Math.round(Number(n) || 0))); if (_o14 === _o13) { _om(); return; } _o13 = _o14; _om(); if (onChange) onChange(_o13); }
input.addEventListener('change', () => _oy(input.value));
_om();
const _oa = h('div', { class: 'inv-stepper', 'data-testid': testid }, h('p', { class: 'inv-step-q' }, h('strong', null, label)),
h('div', { class: 'inv-step-row' }, minus, input, _os), _od);
_oa.setMax = (_og) => { max = _og; input.max = String(_og); if (_o13 > _og) _oy(_og); else _om(); };
_oa.setHint = (_ox) => { _od.textContent = _ox || ''; };
_oa.value = () => _o13;
return _oa;
}
export function peopleEditor(ui, { rows, onChange, reg = null, domain = '', testid = 'inv-people' }) {
_o7();
const { h, field } = ui;
const R = registryOr(reg);
const _ot = (role) => (R.roles.find((_o14) => _o14.key === role) || {}).perms || ROLE_PERMS[role] || {};
const _o11 = (i) => new Set(rows.filter((_, j) => j !== i).map((_o14) => String(_o14.slug || '')).filter(Boolean));
const _ob = () => { if (onChange) onChange(rows); };
const _o5 = rows.map((_ov, i) => {
_ov.perms = _ov.perms || {};
const err = h('p', { class: 'form-err small', role: 'alert', 'data-testid': testid + '-err-' + i });
const _ok = (k) => (_o13) => { _ov[k] = String(_o13 == null ? '' : _o13); err.textContent = ''; _ob(); };
const name = field({ label: 'Họ tên (bắt buộc)', value: _ov.full_name || '', id: testid + '-name-' + i, autocomplete: 'off',
onInput: (_o13) => { _ov.full_name = String(_o13 || ''); err.textContent = ''; if (!_ov.slugTouched) { _ov.slug = suggestSlug(_ov.full_name, _o11(i)); slug.setValue(_ov.slug); _oo(); } _ob(); } });
const email = field({ label: 'Email (bắt buộc)', type: 'email', value: _ov.email || '', id: testid + '-email-' + i, inputmode: 'email', autocomplete: 'off', onInput: _ok('email') });
email.input.setAttribute('spellcheck', 'false'); email.input.setAttribute('autocapitalize', 'none');
const phone = field({ label: 'Số điện thoại (tuỳ chọn)', type: 'tel', value: _ov.phone || '', id: testid + '-phone-' + i, inputmode: 'tel', autocomplete: 'off', onInput: _ok('phone') });
const role = field({ label: 'Vai trò', type: 'select', value: _ov.role || 'sale', id: testid + '-role-' + i,
options: R.roles.map((_o14) => ({ value: _o14.key, label: ROLE_NAME[_o14.key] || _o14.label || _o14.key })),
onChange: (_o13) => { _ov.role = String(_o13 || 'sale'); _ov.perms = {}; _on(); _ob(); } });
const slug = field({ label: 'Địa chỉ riêng (trang phễu khách)', value: _ov.slug || '', id: testid + '-slug-' + i, autocomplete: 'off',
onInput: (_o13) => { const _o14 = String(_o13 || '').toLowerCase().replace(/[^a-z0-9-]/g, ''); if (_o14 !== slug.input.value) slug.input.value = _o14; _ov.slug = _o14; _ov.slugTouched = true; err.textContent = ''; _oo(); _ob(); } });
slug.input.setAttribute('spellcheck', 'false'); slug.input.setAttribute('autocapitalize', 'none');
const slugSay = h('p', { class: 'muted small', 'data-testid': testid + '-slug-say-' + i });
function _oo() { slugSay.textContent = _ov.slug ? 'Địa chỉ: ' + _ov.slug + '.' + (domain || '<tên miền công ty>') + (domain ? '' : ' (trang riêng chạy sau khi xong bước "Tên miền công ty")') : 'Tự gợi ý theo họ tên – sửa được.'; }
if (!_ov.slug && _ov.full_name) _ov.slug = suggestSlug(_ov.full_name, _o11(i));
_oo();
const _or = h('div', { class: 'inv-perm-ticks', 'data-testid': testid + '-perms-' + i });
function _on() {
const base = _ot(_ov.role || 'sale');
if ((_ov.role || 'sale') === 'owner') { ui.mountTo(_or, h('p', { class: 'muted small' }, 'Quản trị (Admin) luôn toàn quyền.')); return; }
ui.mountTo(_or, R.features.map((f) => {
const _o8 = typeof _ov.perms[f.key] === 'boolean' ? _ov.perms[f.key] : base[f.key] !== false && base[f.key] !== undefined;
const _o4 = field({ label: f.label, type: 'checkbox', value: _o8, id: testid + '-perm-' + i + '-' + f.key,
onChange: (_o13) => { _ov.perms = diffPerms({ ...Object.fromEntries(R.features.map((_o14) => [_o14.key, typeof _ov.perms[_o14.key] === 'boolean' ? _ov.perms[_o14.key] : base[_o14.key] !== false && base[_o14.key] !== undefined])), [f.key]: !!_o13 }, base, R.features.map((_o14) => _o14.key)); _ob(); } });
if (f.hint) _o4.append(h('span', { class: 'muted small' }, f.hint));
return lockExperimental(_o4, f, h);
}));
}
_on();
return h('fieldset', { class: 'inv-person', 'data-testid': testid + '-row', dataset: { i: String(i) } },
h('legend', null, 'Người ' + (i + 1)), h('div', { class: 'grid-2' }, name, email, phone, role), slug, slugSay,
h('details', { class: 'inv-perm-more', 'data-testid': testid + '-custom-' + i }, h('summary', null, 'Tuỳ chỉnh quyền'),
h('p', { class: 'muted small' }, 'Mặc định theo vai trò. Bỏ tick phần nào thì phần đó ẩn hẳn trong app của người này (máy chủ cũng chặn).'), _or), err);
});
const _oa = h('div', { class: 'inv-people', 'data-testid': testid }, _o5);
_oa.rows = rows;
_oa.paintErrors = (problems) => {
_o5.forEach((_o4, i) => { const _oj = (problems || []).filter((p) => p.i === i).map((p) => p.msg); _o4.querySelector('.form-err').textContent = _oj.join(' '); });
const _oc = (problems || [])[0];
if (_oc) { const _oe = _oa.querySelector('#' + testid + '-' + ({ email: 'email', slug: 'slug' }[_oc.field] || 'name') + '-' + _oc.i); if (_oe) try { _oe.focus(); } catch { } }
};
return _oa;
}
export async function shareZalo(ui, inv, { company = '' } = {}) {
const text = inviteMessage({ full_name: inv.full_name, link: inv.link, role: inv.role, company });
const _o6 = await ui.copy(text, { silent: true });
const href = zaloHref(inv.phone);
if (!href && typeof navigator !== 'undefined' && navigator.share) {
try { await navigator.share({ title: 'Lời mời vào BDS Studio', text }); return 'shared'; } catch { }
}
try { window.open(href || 'https://chat.zalo.me/', '_blank', 'noopener'); } catch { }
ui.toast(_o6 ? 'Đã chép lời mời – dán vào khung chat Zalo rồi bấm Gửi.' : 'Chưa chép được – bấm "Chép link mời" rồi dán vào Zalo.', _o6 ? 'ok' : 'warn', 6000);
return href ? 'zalo' : 'web';
}
export function invitesList(ui, api, invites, { onChange, company = '', testid = 'inv-list', empty = 'Chưa có lời mời nào.' } = {}) {
_o7();
const { h, button, badge } = ui;
if (!invites || !invites.length) return h('p', { class: 'muted small', 'data-testid': testid + '-empty' }, empty);
const _ow = (inv) => {
const [stText, tone] = statusLabel(inv);
const say = h('p', { class: 'muted small', 'aria-live': 'polite' });
const pending = inv.status === 'pending' && inv.link;
const _oh = inv.status === 'pending' ? (Number(inv.mailed) ? '✉️ Đã gửi thư mời tới ' + inv.email : '⚠️ Chưa gửi được thư tới ' + inv.email + ' – bấm "Chép link mời" hoặc "Gửi qua Zalo".') : inv.email;
const _o3 = [];
if (pending) {
_o3.push(button('Chép link mời', async () => { const ok = await ui.copy(inviteMessage({ ...inv, company }), { silent: true }); ui.toast(ok ? 'Đã chép lời mời (kèm link) – dán vào Zalo, Messenger…' : 'Trình duyệt chưa cho chép – giữ ngón tay vào link bên dưới để chép.', ok ? 'ok' : 'warn'); if (!ok) say.textContent = inv.link; }, { kind: 'secondary', small: true, icon: 'copy', testid: 'inv-copy' }));
_o3.push(button('Gửi qua Zalo', () => shareZalo(ui, inv, { company }), { kind: 'secondary', small: true, icon: 'external', testid: 'inv-zalo' }));
}
if (inv.status === 'pending' || inv.status === 'expired') {
_o3.push(button(inv.status === 'expired' ? 'Gửi lại (link mới)' : 'Gửi lại thư', async () => {
try {
const _ov = await api.call('invite.resend', { id: inv.id, base: inviteBase(api) });
ui.toast(_ov && _ov.warn ? _ov.warn : 'Đã gửi lại thư mời tới ' + inv.email + '.', _ov && _ov.warn ? 'warn' : 'ok', _ov && _ov.warn ? 7000 : 3500);
if (onChange) await onChange();
} catch (e) { say.textContent = e.userMessage || e.message || t('err.generic'); }
}, { kind: 'ghost', small: true, icon: inv.status === 'expired' ? 'refresh' : 'mail', testid: 'inv-resend' }));
_o3.push(button('Huỷ lời mời', async () => {
if (!(await ui.confirm('Huỷ lời mời của "' + inv.full_name + '"? Link đã gửi sẽ không dùng được nữa.', { ok: 'Huỷ lời mời', kind: 'danger', title: 'Huỷ lời mời' }))) return;
try { await api.call('invite.revoke', { id: inv.id }); ui.toast('Đã huỷ lời mời.', 'ok'); if (onChange) await onChange(); } catch (e) { say.textContent = e.userMessage || e.message || t('err.generic'); }
}, { kind: 'ghost', small: true, icon: 'close', testid: 'inv-revoke' }));
}
return h('li', { class: 'inv-item', 'data-testid': 'inv-item', dataset: { status: inv.status, email: inv.email, link: pending ? inv.link : '' } },
h('div', { class: 'inv-item-head' },
h('span', { class: 'avatar avatar-sm' }, String(inv.full_name || '•').trim().charAt(0).toUpperCase()),
h('div', { class: 'row-text' }, h('strong', null, inv.full_name), h('span', { class: 'muted small break' }, _oh)),
h('div', { class: 'user-badges' }, badge(ROLE_NAME[inv.role] || inv.role, inv.role === 'owner' ? 'gold' : 'info'), badge(stText, tone))),
inv.status === 'pending' ? h('p', { class: 'muted small' }, 'Hết hạn: ' + ui.date(Number(inv.expires_at), true)) : null,
_o3.length ? h('div', { class: 'btn-row' }, _o3) : null, say);
};
return h('ul', { class: 'inv-list', 'data-testid': testid }, invites.map(_ow));
}
export function inviteDialog(ui, api, { role = 'sale', seats = null, quota = null, company = '', registry = null, domain = '', onDone } = {}) {
_o7();
const { h, button } = ui;
const rows = [{ g: 'x', role, full_name: '', email: '', phone: '', slug: '', perms: {} }];
const _o2 = h('div', { class: 'stack', 'data-testid': 'inv-dialog' });
const err = h('p', { class: 'form-err', role: 'alert', 'data-testid': 'inv-dialog-err' });
const warnEl = h('p', { class: 'inv-warn small', 'data-testid': 'inv-dialog-quota' });
const max = maxPeople(seats);
let editor = null, done = false;
const _og = ui.modal({ title: role === 'owner' ? 'Thêm Quản trị (Admin)' : 'Mời nhân viên qua email', wide: true, cls: 'user-modal', body: _o2, onClose: () => { if (done && onDone) onDone(); } });
_om();
return _og;
function _om() {
if (done) return;
editor = peopleEditor(ui, { rows, onChange: () => _op(), reg: registry, domain });
ui.mountTo(_o2,
role === 'owner' ? h('p', { class: 'inv-note', 'data-testid': 'inv-admin-note' }, 'Quản trị (Admin) có toàn quyền như anh/chị: cài đặt, thêm/khoá người, khoá AI, bản quyền. Chỉ mời người thật sự cần.') : null,
seatsText(seats) ? h('p', { class: 'muted small', 'data-testid': 'inv-seats' }, seatsText(seats)) : null,
editor,
h('div', { class: 'btn-row' },
rows.length < max ? button('Thêm 1 người', () => { rows.push({ g: 'x', role, full_name: '', email: '', phone: '', slug: '', perms: {} }); _om(); }, { kind: 'ghost', small: true, icon: 'plus', testid: 'inv-add-row' }) : null,
rows.length > 1 ? button('Bớt người cuối', () => { rows.pop(); _om(); }, { kind: 'ghost', small: true, icon: 'minus', testid: 'inv-del-row' }) : null),
warnEl,
h('details', { class: 'role-table' }, h('summary', null, 'Mỗi vai trò được làm gì?'), permTable(ui, registry)),
err,
h('div', { class: 'btn-row' },
button('Tạo lời mời và gửi email', submit, { kind: 'primary', icon: 'mail', testid: 'inv-create' }),
button('Đóng', () => _og.close(), { kind: 'ghost', icon: 'close', testid: 'inv-dialog-close' })));
_op();
}
function _op() { warnEl.textContent = quotaWarn(rows.length, quota); warnEl.hidden = !warnEl.textContent; }
async function submit() {
err.textContent = '';
const _ou = validatePeople(rows);
if (_ou.length) { editor.paintErrors(_ou); err.textContent = 'Còn ' + new Set(_ou.map((p) => p.i)).size + ' người chưa đủ thông tin.'; return; }
try {
const _ov = await api.call('invite.create', { people: toPeople(rows), base: inviteBase(api) });
done = true;
ui.mountTo(_o2,
h('p', { class: 'ev-ok', 'data-testid': 'inv-created' }, '✅ Đã tạo ' + _ov.invites.length + ' lời mời' + (_ov.mailed ? ', đã gửi ' + _ov.mailed + ' thư.' : '.')),
_ov.warn ? h('p', { class: 'inv-warn', 'data-testid': 'inv-warn' }, '⚠️ ' + _ov.warn) : null,
invitesList(ui, api, _ov.invites, { company }),
h('div', { class: 'btn-row' }, button('Xong', () => _og.close(), { kind: 'primary', icon: 'check', testid: 'inv-dialog-done' })));
} catch (e) { err.textContent = e.userMessage || e.message || t('err.generic'); }
}
}
export async function memberPermsBlock(_o2, { ui, api, user: _o12, self = false, onSaved } = {}) {
_o7();
const { h, button, field } = ui;
let reg = null;
try { reg = await api.call('perms.registry', {}); } catch { reg = null; }
const R = registryOr(reg);
const base = (R.roles.find((_o14) => _o14.key === _o12.role) || {}).perms || ROLE_PERMS[_o12.role] || {};
const custom = { ...(_o12.perms_custom || {}) };
const say = h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'user-perms-say' });
const slug = field({ label: 'Địa chỉ riêng (trang phễu khách)', value: _o12.slug || '', id: 'user-slug', autocomplete: 'off', hint: 'Chữ thường không dấu, số, dấu "-". Dạng <địa chỉ riêng>.<tên miền công ty>.' });
slug.input.setAttribute('spellcheck', 'false'); slug.input.setAttribute('autocapitalize', 'none');
const ticks = _o12.role === 'owner'
? [h('p', { class: 'muted small', 'data-testid': 'user-perms-owner' }, 'Quản trị (Admin) luôn toàn quyền – không bớt từng phần được.')]
: R.features.map((f) => lockExperimental(field({ label: f.label, type: 'checkbox', id: 'user-perm-' + f.key, value: typeof custom[f.key] === 'boolean' ? custom[f.key] : base[f.key] !== false && base[f.key] !== undefined,
onChange: (_o13) => { custom[f.key] = !!_o13; } }), f, h));
ui.mountTo(_o2, h('div', { class: 'sub-block', 'data-testid': 'user-perms' },
h('h4', { class: 'section-title' }, 'Quyền từng phần'),
_o12.role === 'owner' ? null : h('p', { class: 'muted small' }, 'Mặc định theo vai trò. Bỏ tick phần nào thì phần đó ẩn hẳn trong app của người này (máy chủ cũng chặn).'),
...ticks, slug, say,
h('div', { class: 'btn-row' }, button('Lưu quyền và địa chỉ', async () => {
say.textContent = '';
const _oq = { id: _o12.id, slug: String(slug.getValue() || '').trim().toLowerCase() };
if (_o12.role !== 'owner') _oq.perms = diffPerms({ ...Object.fromEntries(R.features.map((f) => [f.key, base[f.key] !== false && base[f.key] !== undefined])), ...custom }, base, R.features.map((f) => f.key));
if (!_oq.slug) delete _oq.slug;
try { await api.call('users.update', _oq); ui.toast('Đã lưu quyền của ' + (_o12.full_name || _o12.username) + '.', 'ok'); if (onSaved) await onSaved(); } catch (e) { say.textContent = e.userMessage || e.message || t('err.generic'); }
}, { kind: 'secondary', small: true, icon: 'shield', testid: 'user-perms-save' }))));
if (self && _o12.role === 'owner') slug.input.readOnly = false;
}
export async function renderInvitesPanel(_o2, { ui, api, onUsersChanged } = {}) {
_o7();
const { h, button } = ui;
const list = h('div', { 'data-testid': 'inv-panel-list' }, ui.spinner());
const info = h('p', { class: 'muted small', 'data-testid': 'inv-panel-info' });
let _o9 = { invites: [], seats: null, mail_quota: null };
const company = () => { try { const _o4 = window.__bds && window.__bds.extras && window.__bds.extras.S.settings.get('company', null); return (_o4 && _o4.name) || ''; } catch { return ''; } };
ui.mountTo(_o2, h('div', { class: 'sub-block inv-panel', 'data-testid': 'inv-panel' },
h('h4', { class: 'section-title' }, 'Mời qua email'),
h('p', { class: 'muted small' }, 'Người được mời bấm link trong email (hoặc link anh/chị gửi qua Zalo), tự đặt mật khẩu, nhập mã 6 số gửi tới email rồi vào app đúng vai trò. Link dùng 1 lần, hết hạn sau 7 ngày.'),
h('div', { class: 'btn-row' },
button('Mời nhân viên', () => inviteDialog(ui, api, { role: 'sale', seats: _o9.seats, quota: _o9.mail_quota, company: company(), registry: _o9.registry, onDone: _of }), { kind: 'primary', icon: 'mail', testid: 'inv-panel-add' }),
button('Thêm Quản trị', () => inviteDialog(ui, api, { role: 'owner', seats: _o9.seats, quota: _o9.mail_quota, company: company(), registry: _o9.registry, onDone: _of }), { kind: 'secondary', icon: 'shield', testid: 'inv-panel-add-admin' })),
info, list));
await _of();
async function _of() {
try { _o9 = await api.call('invite.list', {}) || _o9; } catch (e) {
ui.mountTo(list, h('p', { class: 'muted small' }, e && e.code === 'UNKNOWN_ACTION' ? 'Máy chủ đang chạy bản cũ, chưa có "Mời qua email" – vào Cài đặt › Phiên bản bấm "Cập nhật máy chủ".' : (e.userMessage || t('err.network'))));
return;
}
info.textContent = [seatsText(_o9.seats), _o9.mail_quota !== null && _o9.mail_quota !== undefined ? 'Hôm nay Google còn cho gửi ' + _o9.mail_quota + ' thư.' : ''].filter(Boolean).join(' ');
ui.mountTo(list, invitesList(ui, api, _o9.invites || [], { company: company(), onChange: async () => { await _of(); if (onUsersChanged) await onUsersChanged(); } }));
}
}
export default { registryOr, suggestSlug, permRows, validatePeople, toPeople, resizeGroup, inviteMessage, zaloHref, inviteBase, statusLabel, seatsText, maxPeople, quotaWarn, permTable, stepper, peopleEditor, invitesList, inviteDialog, renderInvitesPanel, shareZalo };

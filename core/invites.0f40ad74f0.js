import { ROLE_PERMS } from './auth.c3ca8814ab.js';
import { FEATURES, diffPerms, featureExperimental, featureShipped, EXPERIMENTAL_NOTE, EXPERIMENTAL_HINT, EXPERIMENTAL_LOCKED_HINT } from './features.281cbd68f0.js';
import { betaAllowed } from './packs.a4fe44641f.js';
import { t } from './i18n.17f01a0b54.js';
import { ensureCss } from './xkit.71d637c634.js';
import { EMAIL_RE } from './email_verify.4f5a65756b.js';
export const ROLE_NAME = { owner: 'Quản trị (Admin)', manager: 'Quản lý / Trưởng nhóm', sale: 'Sale (bán hàng)', ctv: 'Cộng tác viên', marketing: 'Marketing' };
export const INVITE_ROLES = ['sale', 'manager', 'owner', 'ctv'];
export const UI_MAX = 50;
export const SUMMARY_ROLES = ['owner', 'manager', 'sale'];
export const SUMMARY_HEAD = { owner: 'Quản trị (Admin)', manager: 'Quản lý', sale: 'Sale', marketing: 'Marketing' };
export const usersPath = () => 'Cài đặt › ' + t('set.users');
export const adminNote = () => 'Anh/chị là Quản trị (Admin) – toàn quyền. Có thể thêm Quản trị khác sau trong ' + usersPath() + '.';
export function permRows(perms = ROLE_PERMS, roles = SUMMARY_ROLES, features = FEATURES) {
const P = (_ot) => perms[_ot] || {};
const _o13 = (_o11) => (_o11 ? '✓' : '–');
const _o0 = { all: 'Tất cả khách', own: 'Chỉ khách được chia cho mình', created: 'Chỉ khách mình nhập' };
const rows = [{ key: 'customers_scope', label: 'Xem khách hàng', cells: roles.map((_ot) => _o0[P(_ot).customers_scope] || '–') }];
for (const f of features) {
if (f.key === 'customers_all') continue;
rows.push({ key: f.key, label: f.label + (featureExperimental(f) ? ' (' + EXPERIMENTAL_NOTE + ')' : ''), cells: roles.map((_ot) => (f.key === 'export' && P(_ot).export && P(_ot).customers_scope !== 'all' ? 'Khách của mình' : _o13(P(_ot)[f.key] !== false && P(_ot)[f.key] !== undefined))) });
}
rows.push({ key: 'admin', label: 'Cài đặt, thêm/khoá người, khoá AI, bản quyền', cells: roles.map((_ot) => _o13(P(_ot).admin)) });
return rows;
}
export function lockExperimental(_o8, f, h, open = betaAllowed()) {
if (!featureExperimental(f)) return _o8;
if (open) {
_o8.dataset.experimental = '1';
_o8.append(h('span', { class: 'muted small', 'data-testid': 'perm-exp-' + f.key }, EXPERIMENTAL_NOTE + ' – ' + EXPERIMENTAL_HINT));
return _o8;
}
const _oc = _o8 && _o8.querySelector ? _o8.querySelector('input') : null;
if (_oc) { _oc.checked = false; _oc.disabled = true; _oc.setAttribute('aria-disabled', 'true'); _oc.title = EXPERIMENTAL_LOCKED_HINT; }
_o8.classList.add('inv-perm-exp');
_o8.dataset.experimental = '1';
_o8.append(h('span', { class: 'muted small', 'data-testid': 'perm-exp-' + f.key }, EXPERIMENTAL_NOTE + ' – ' + EXPERIMENTAL_LOCKED_HINT));
return _o8;
}
export function registryOr(reg) {
if (reg && Array.isArray(reg.features) && reg.features.length && Array.isArray(reg.roles) && reg.roles.length) return reg;
return { features: FEATURES.slice(), roles: Object.keys(ROLE_PERMS).map((k) => ({ key: k, label: ROLE_NAME[k] || k, perms: ROLE_PERMS[k] })) };
}
export function suggestSlug(name, taken = new Set()) {
const base = String(name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 32).replace(/-+$/, '') || '';
if (!base) return '';
let _ov = base, n = 1;
while (taken.has(_ov) && n < 999) _ov = base.slice(0, 28) + '-' + (++n);
return _ov;
}
export const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/;
export function validatePeople(rows) {
const _oj = [], seen = new Map();
(Array.isArray(rows) ? rows : []).forEach((_ot, i) => {
const name = String((_ot && _ot.full_name) || '').trim(), em = String((_ot && _ot.email) || '').trim(), k = em.toLowerCase();
if (!name) _oj.push({ i, field: 'full_name', msg: 'Gõ họ tên.' });
if (!em) _oj.push({ i, field: 'email', msg: 'Gõ email (bắt buộc).' });
else if (!EMAIL_RE.test(em)) _oj.push({ i, field: 'email', msg: 'Email chưa đúng (cần đủ dạng tên, chữ @, tên miền).' });
else if (seen.has(k)) _oj.push({ i, field: 'email', msg: 'Email trùng với người ' + (seen.get(k) + 1) + '.' });
if (em) seen.set(k, seen.has(k) ? seen.get(k) : i);
const _ox = String((_ot && _ot.slug) || '').trim();
if (_ox && !SLUG_RE.test(_ox)) _oj.push({ i, field: 'slug', msg: 'Địa chỉ riêng chỉ gồm chữ thường không dấu, số, dấu "-".' });
else if (_ox && (rows.findIndex((_o12) => String((_o12 && _o12.slug) || '').trim() === _ox) !== i)) _oj.push({ i, field: 'slug', msg: 'Địa chỉ riêng trùng với người khác.' });
});
return _oj;
}
export function toPeople(rows) {
return (rows || []).map((_ot) => ({ full_name: String(_ot.full_name || '').trim(), email: String(_ot.email || '').trim(), phone: String(_ot.phone || '').trim(), role: String(_ot.role || 'sale'),
slug: String(_ot.slug || '').trim(), perms: _ot.role === 'owner' ? {} : (_ot.perms || {}) }));
}
export function resizeGroup(rows, g, n, role = g) {
const _og = (rows || []).filter((_ot) => _ot.g === g), other = (rows || []).filter((_ot) => _ot.g !== g);
const next = _og.slice(0, Math.max(0, n));
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
const _o10 = String(href || '').split('#')[0].split('?')[0];
return api && api.mode === 'gas' && api.url ? _o10 + '?server=' + encodeURIComponent(api.url) : _o10;
}
export function statusLabel(inv, now = Date.now()) {
const _oy = inv && inv.status;
if (_oy === 'used') return ['Đã nhận – đã có tài khoản', 'ok'];
if (_oy === 'revoked') return ['Đã huỷ', 'neutral'];
if (_oy === 'expired' || (_oy === 'pending' && Number(inv.expires_at) <= now)) return ['Hết hạn', 'danger'];
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
function _o5() { try { ensureCss(new URL('./invites.21910a6901.css', import.meta.url).href, 'bds-invites-css'); } catch { } }
export function summaryRoles(reg) { return SUMMARY_ROLES.concat(reg && Array.isArray(reg.roles) && reg.roles.some((_o12) => _o12.key === 'marketing') ? ['marketing'] : []); }
export function permTable(ui, reg = null) {
_o5();
const { h } = ui;
const R = registryOr(reg), presets = Object.fromEntries(R.roles.map((_ot) => [_ot.key, _ot.perms]));
const roles = summaryRoles(R);
const rows = permRows({ ...ROLE_PERMS, ...presets }, roles, R.features.filter((f) => featureShipped(f)));
return h('div', { class: 'table-wrap inv-perm', 'data-testid': 'inv-perm' }, h('table', { class: 'table table-roles' },
h('thead', null, h('tr', null, h('th', null, 'Được làm gì'), roles.map((_ot) => h('th', null, SUMMARY_HEAD[_ot])))),
h('tbody', null, rows.map((_ou) => h('tr', { dataset: { perm: _ou.key } }, h('th', { scope: 'row' }, _ou.label), _ou.cells.map((_o2) => h('td', { class: _o2 === '–' ? 'muted' : '' }, _o2)))))));
}
export function stepper(ui, { label, value = 0, min = 0, max = UI_MAX, onChange, testid, hint }) {
_o5();
const { h, button } = ui;
let _o11 = Math.max(min, Math.min(max, Number(value) || 0));
const input = h('input', { type: 'number', inputmode: 'numeric', min: String(min), max: String(max), value: String(_o11), class: 'inv-step-n', 'aria-label': label, 'data-testid': testid + '-n' });
const minus = button('', () => _ow(_o11 - 1), { kind: 'secondary', icon: 'minus', title: 'Bớt 1 người', testid: testid + '-minus' });
const _oq = button('', () => _ow(_o11 + 1), { kind: 'secondary', icon: 'plus', title: 'Thêm 1 người', testid: testid + '-plus' });
const _ob = h('p', { class: 'muted small', 'data-testid': testid + '-hint' }, hint || '');
function _ok() { input.value = String(_o11); minus.disabled = _o11 <= min; _oq.disabled = _o11 >= max; }
function _ow(n) { const _o12 = Math.max(min, Math.min(max, Math.round(Number(n) || 0))); if (_o12 === _o11) { _ok(); return; } _o11 = _o12; _ok(); if (onChange) onChange(_o11); }
input.addEventListener('change', () => _ow(input.value));
_ok();
const _o8 = h('div', { class: 'inv-stepper', 'data-testid': testid }, h('p', { class: 'inv-step-q' }, h('strong', null, label)),
h('div', { class: 'inv-step-row' }, minus, input, _oq), _ob);
_o8.setMax = (_oe) => { max = _oe; input.max = String(_oe); if (_o11 > _oe) _ow(_oe); else _ok(); };
_o8.setHint = (_ov) => { _ob.textContent = _ov || ''; };
_o8.value = () => _o11;
return _o8;
}
export function peopleEditor(ui, { rows, onChange, reg = null, domain = '', testid = 'inv-people' }) {
_o5();
const { h, field } = ui;
const R = registryOr(reg);
const _or = (role) => (R.roles.find((_o12) => _o12.key === role) || {}).perms || ROLE_PERMS[role] || {};
const _oz = (i) => new Set(rows.filter((_, j) => j !== i).map((_o12) => String(_o12.slug || '')).filter(Boolean));
const _o9 = () => { if (onChange) onChange(rows); };
const _o3 = rows.map((_ot, i) => {
_ot.perms = _ot.perms || {};
const err = h('p', { class: 'form-err small', role: 'alert', 'data-testid': testid + '-err-' + i });
const _oi = (k) => (_o11) => { _ot[k] = String(_o11 == null ? '' : _o11); err.textContent = ''; _o9(); };
const name = field({ label: 'Họ tên (bắt buộc)', value: _ot.full_name || '', id: testid + '-name-' + i, autocomplete: 'off',
onInput: (_o11) => { _ot.full_name = String(_o11 || ''); err.textContent = ''; if (!_ot.slugTouched) { _ot.slug = suggestSlug(_ot.full_name, _oz(i)); slug.setValue(_ot.slug); _om(); } _o9(); } });
const email = field({ label: 'Email (bắt buộc)', type: 'email', value: _ot.email || '', id: testid + '-email-' + i, inputmode: 'email', autocomplete: 'off', onInput: _oi('email') });
email.input.setAttribute('spellcheck', 'false'); email.input.setAttribute('autocapitalize', 'none');
const phone = field({ label: 'Số điện thoại (tuỳ chọn)', type: 'tel', value: _ot.phone || '', id: testid + '-phone-' + i, inputmode: 'tel', autocomplete: 'off', onInput: _oi('phone') });
const role = field({ label: 'Vai trò', type: 'select', value: _ot.role || 'sale', id: testid + '-role-' + i,
options: R.roles.map((_o12) => ({ value: _o12.key, label: ROLE_NAME[_o12.key] || _o12.label || _o12.key })),
onChange: (_o11) => { _ot.role = String(_o11 || 'sale'); _ot.perms = {}; _ol(); _o9(); } });
const slug = field({ label: 'Địa chỉ riêng (trang phễu khách)', value: _ot.slug || '', id: testid + '-slug-' + i, autocomplete: 'off',
onInput: (_o11) => { const _o12 = String(_o11 || '').toLowerCase().replace(/[^a-z0-9-]/g, ''); if (_o12 !== slug.input.value) slug.input.value = _o12; _ot.slug = _o12; _ot.slugTouched = true; err.textContent = ''; _om(); _o9(); } });
slug.input.setAttribute('spellcheck', 'false'); slug.input.setAttribute('autocapitalize', 'none');
const slugSay = h('p', { class: 'muted small', 'data-testid': testid + '-slug-say-' + i });
function _om() { slugSay.textContent = _ot.slug ? 'Địa chỉ: ' + _ot.slug + '.' + (domain || '<tên miền công ty>') + (domain ? '' : ' (trang riêng chạy sau khi xong bước "Tên miền công ty")') : 'Tự gợi ý theo họ tên – sửa được.'; }
if (!_ot.slug && _ot.full_name) _ot.slug = suggestSlug(_ot.full_name, _oz(i));
_om();
const _op = h('div', { class: 'inv-perm-ticks', 'data-testid': testid + '-perms-' + i });
function _ol() {
const base = _or(_ot.role || 'sale');
if ((_ot.role || 'sale') === 'owner') { ui.mountTo(_op, h('p', { class: 'muted small' }, 'Quản trị (Admin) luôn toàn quyền.')); return; }
ui.mountTo(_op, R.features.filter((f) => featureShipped(f)).map((f) => {
const _o6 = typeof _ot.perms[f.key] === 'boolean' ? _ot.perms[f.key] : base[f.key] !== false && base[f.key] !== undefined;
const _o2 = field({ label: f.label, type: 'checkbox', value: _o6, id: testid + '-perm-' + i + '-' + f.key,
onChange: (_o11) => { _ot.perms = diffPerms({ ...Object.fromEntries(R.features.map((_o12) => [_o12.key, typeof _ot.perms[_o12.key] === 'boolean' ? _ot.perms[_o12.key] : base[_o12.key] !== false && base[_o12.key] !== undefined])), [f.key]: !!_o11 }, base, R.features.map((_o12) => _o12.key)); _o9(); } });
if (f.hint) _o2.append(h('span', { class: 'muted small' }, f.hint));
return lockExperimental(_o2, f, h);
}));
}
_ol();
return h('fieldset', { class: 'inv-person', 'data-testid': testid + '-row', dataset: { i: String(i) } },
h('legend', null, 'Người ' + (i + 1)), h('div', { class: 'grid-2' }, name, email, phone, role), slug, slugSay,
h('details', { class: 'inv-perm-more', 'data-testid': testid + '-custom-' + i }, h('summary', null, 'Tuỳ chỉnh quyền'),
h('p', { class: 'muted small' }, 'Mặc định theo vai trò. Bỏ tick phần nào thì phần đó ẩn hẳn trong app của người này (máy chủ cũng chặn).'), _op), err);
});
const _o8 = h('div', { class: 'inv-people', 'data-testid': testid }, _o3);
_o8.rows = rows;
_o8.paintErrors = (problems) => {
_o3.forEach((_o2, i) => { const _oh = (problems || []).filter((p) => p.i === i).map((p) => p.msg); _o2.querySelector('.form-err').textContent = _oh.join(' '); });
const _oa = (problems || [])[0];
if (_oa) { const _oc = _o8.querySelector('#' + testid + '-' + ({ email: 'email', slug: 'slug' }[_oa.field] || 'name') + '-' + _oa.i); if (_oc) try { _oc.focus(); } catch { } }
};
return _o8;
}
export async function shareZalo(ui, inv, { company = '' } = {}) {
const text = inviteMessage({ full_name: inv.full_name, link: inv.link, role: inv.role, company });
const _o4 = await ui.copy(text, { silent: true });
const href = zaloHref(inv.phone);
if (!href && typeof navigator !== 'undefined' && navigator.share) {
try { await navigator.share({ title: 'Lời mời vào BDS Studio', text }); return 'shared'; } catch { }
}
try { window.open(href || 'https://chat.zalo.me/', '_blank', 'noopener'); } catch { }
ui.toast(_o4 ? 'Đã chép lời mời – dán vào khung chat Zalo rồi bấm Gửi.' : 'Chưa chép được – bấm "Chép link mời" rồi dán vào Zalo.', _o4 ? 'ok' : 'warn', 6000);
return href ? 'zalo' : 'web';
}
export function invitesList(ui, api, invites, { onChange, company = '', testid = 'inv-list', empty = 'Chưa có lời mời nào.' } = {}) {
_o5();
const { h, button, badge } = ui;
if (!invites || !invites.length) return h('p', { class: 'muted small', 'data-testid': testid + '-empty' }, empty);
const _ou = (inv) => {
const [stText, tone] = statusLabel(inv);
const say = h('p', { class: 'muted small', 'aria-live': 'polite' });
const pending = inv.status === 'pending' && inv.link;
const _of = inv.status === 'pending' ? (Number(inv.mailed) ? '✉️ Đã gửi thư mời tới ' + inv.email : '⚠️ Chưa gửi được thư tới ' + inv.email + ' – bấm "Chép link mời" hoặc "Gửi qua Zalo".') : inv.email;
const _o1 = [];
if (pending) {
_o1.push(button('Chép link mời', async () => { const ok = await ui.copy(inviteMessage({ ...inv, company }), { silent: true }); ui.toast(ok ? 'Đã chép lời mời (kèm link) – dán vào Zalo, Messenger…' : 'Trình duyệt chưa cho chép – giữ ngón tay vào link bên dưới để chép.', ok ? 'ok' : 'warn'); if (!ok) say.textContent = inv.link; }, { kind: 'secondary', small: true, icon: 'copy', testid: 'inv-copy' }));
_o1.push(button('Gửi qua Zalo', () => shareZalo(ui, inv, { company }), { kind: 'secondary', small: true, icon: 'external', testid: 'inv-zalo' }));
}
if (inv.status === 'pending' || inv.status === 'expired') {
_o1.push(button(inv.status === 'expired' ? 'Gửi lại (link mới)' : 'Gửi lại thư', async () => {
try {
const _ot = await api.call('invite.resend', { id: inv.id, base: inviteBase(api) });
ui.toast(_ot && _ot.warn ? _ot.warn : 'Đã gửi lại thư mời tới ' + inv.email + '.', _ot && _ot.warn ? 'warn' : 'ok', _ot && _ot.warn ? 7000 : 3500);
if (onChange) await onChange();
} catch (e) { say.textContent = e.userMessage || e.message || t('err.generic'); }
}, { kind: 'ghost', small: true, icon: inv.status === 'expired' ? 'refresh' : 'mail', testid: 'inv-resend' }));
_o1.push(button('Huỷ lời mời', async () => {
if (!(await ui.confirm('Huỷ lời mời của "' + inv.full_name + '"? Link đã gửi sẽ không dùng được nữa.', { ok: 'Huỷ lời mời', kind: 'danger', title: 'Huỷ lời mời' }))) return;
try { await api.call('invite.revoke', { id: inv.id }); ui.toast('Đã huỷ lời mời.', 'ok'); if (onChange) await onChange(); } catch (e) { say.textContent = e.userMessage || e.message || t('err.generic'); }
}, { kind: 'ghost', small: true, icon: 'close', testid: 'inv-revoke' }));
}
return h('li', { class: 'inv-item', 'data-testid': 'inv-item', dataset: { status: inv.status, email: inv.email, link: pending ? inv.link : '' } },
h('div', { class: 'inv-item-head' },
h('span', { class: 'avatar avatar-sm' }, String(inv.full_name || '•').trim().charAt(0).toUpperCase()),
h('div', { class: 'row-text' }, h('strong', null, inv.full_name), h('span', { class: 'muted small break' }, _of)),
h('div', { class: 'user-badges' }, badge(ROLE_NAME[inv.role] || inv.role, inv.role === 'owner' ? 'gold' : 'info'), badge(stText, tone))),
inv.status === 'pending' ? h('p', { class: 'muted small' }, 'Hết hạn: ' + ui.date(Number(inv.expires_at), true)) : null,
_o1.length ? h('div', { class: 'btn-row' }, _o1) : null, say);
};
return h('ul', { class: 'inv-list', 'data-testid': testid }, invites.map(_ou));
}
export function inviteDialog(ui, api, { role = 'sale', seats = null, quota = null, company = '', registry = null, domain = '', onDone } = {}) {
_o5();
const { h, button } = ui;
const rows = [{ g: 'x', role, full_name: '', email: '', phone: '', slug: '', perms: {} }];
const box = h('div', { class: 'stack', 'data-testid': 'inv-dialog' });
const err = h('p', { class: 'form-err', role: 'alert', 'data-testid': 'inv-dialog-err' });
const warnEl = h('p', { class: 'inv-warn small', 'data-testid': 'inv-dialog-quota' });
const max = maxPeople(seats);
let editor = null, done = false;
const _oe = ui.modal({ title: role === 'owner' ? 'Thêm Quản trị (Admin)' : 'Mời nhân viên qua email', wide: true, cls: 'user-modal', body: box, onClose: () => { if (done && onDone) onDone(); } });
_ok();
return _oe;
function _ok() {
if (done) return;
editor = peopleEditor(ui, { rows, onChange: () => _on(), reg: registry, domain });
ui.mountTo(box,
role === 'owner' ? h('p', { class: 'inv-note', 'data-testid': 'inv-admin-note' }, 'Quản trị (Admin) có toàn quyền như anh/chị: cài đặt, thêm/khoá người, khoá AI, bản quyền. Chỉ mời người thật sự cần.') : null,
seatsText(seats) ? h('p', { class: 'muted small', 'data-testid': 'inv-seats' }, seatsText(seats)) : null,
editor,
h('div', { class: 'btn-row' },
rows.length < max ? button('Thêm 1 người', () => { rows.push({ g: 'x', role, full_name: '', email: '', phone: '', slug: '', perms: {} }); _ok(); }, { kind: 'ghost', small: true, icon: 'plus', testid: 'inv-add-row' }) : null,
rows.length > 1 ? button('Bớt người cuối', () => { rows.pop(); _ok(); }, { kind: 'ghost', small: true, icon: 'minus', testid: 'inv-del-row' }) : null),
warnEl,
h('details', { class: 'role-table' }, h('summary', null, 'Mỗi vai trò được làm gì?'), permTable(ui, registry)),
err,
h('div', { class: 'btn-row' },
button('Tạo lời mời và gửi email', submit, { kind: 'primary', icon: 'mail', testid: 'inv-create' }),
button('Đóng', () => _oe.close(), { kind: 'ghost', icon: 'close', testid: 'inv-dialog-close' })));
_on();
}
function _on() { warnEl.textContent = quotaWarn(rows.length, quota); warnEl.hidden = !warnEl.textContent; }
async function submit() {
err.textContent = '';
const _os = validatePeople(rows);
if (_os.length) { editor.paintErrors(_os); err.textContent = 'Còn ' + new Set(_os.map((p) => p.i)).size + ' người chưa đủ thông tin.'; return; }
try {
const _ot = await api.call('invite.create', { people: toPeople(rows), base: inviteBase(api) });
done = true;
ui.mountTo(box,
h('p', { class: 'ev-ok', 'data-testid': 'inv-created' }, '✅ Đã tạo ' + _ot.invites.length + ' lời mời' + (_ot.mailed ? ', đã gửi ' + _ot.mailed + ' thư.' : '.')),
_ot.warn ? h('p', { class: 'inv-warn', 'data-testid': 'inv-warn' }, '⚠️ ' + _ot.warn) : null,
invitesList(ui, api, _ot.invites, { company }),
h('div', { class: 'btn-row' }, button('Xong', () => _oe.close(), { kind: 'primary', icon: 'check', testid: 'inv-dialog-done' })));
} catch (e) { err.textContent = e.userMessage || e.message || t('err.generic'); }
}
}
export async function memberPermsBlock(box, { ui, api, user: _o10, self = false, onSaved } = {}) {
_o5();
const { h, button, field } = ui;
let reg = null;
try { reg = await api.call('perms.registry', {}); } catch { reg = null; }
const R = registryOr(reg);
const base = (R.roles.find((_o12) => _o12.key === _o10.role) || {}).perms || ROLE_PERMS[_o10.role] || {};
const custom = { ...(_o10.perms_custom || {}) };
const say = h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'user-perms-say' });
const slug = field({ label: 'Địa chỉ riêng (trang phễu khách)', value: _o10.slug || '', id: 'user-slug', autocomplete: 'off', hint: 'Chữ thường không dấu, số, dấu "-". Dạng <địa chỉ riêng>.<tên miền công ty>.' });
slug.input.setAttribute('spellcheck', 'false'); slug.input.setAttribute('autocapitalize', 'none');
const ticks = _o10.role === 'owner'
? [h('p', { class: 'muted small', 'data-testid': 'user-perms-owner' }, 'Quản trị (Admin) luôn toàn quyền – không bớt từng phần được.')]
: R.features.filter((f) => featureShipped(f)).map((f) => lockExperimental(field({ label: f.label, type: 'checkbox', id: 'user-perm-' + f.key, value: typeof custom[f.key] === 'boolean' ? custom[f.key] : base[f.key] !== false && base[f.key] !== undefined,
onChange: (_o11) => { custom[f.key] = !!_o11; } }), f, h));
ui.mountTo(box, h('div', { class: 'sub-block', 'data-testid': 'user-perms' },
h('h4', { class: 'section-title' }, 'Quyền từng phần'),
_o10.role === 'owner' ? null : h('p', { class: 'muted small' }, 'Mặc định theo vai trò. Bỏ tick phần nào thì phần đó ẩn hẳn trong app của người này (máy chủ cũng chặn).'),
...ticks, slug, say,
h('div', { class: 'btn-row' }, button('Lưu quyền và địa chỉ', async () => {
say.textContent = '';
const _oo = { id: _o10.id, slug: String(slug.getValue() || '').trim().toLowerCase() };
if (_o10.role !== 'owner') _oo.perms = diffPerms({ ...Object.fromEntries(R.features.map((f) => [f.key, base[f.key] !== false && base[f.key] !== undefined])), ...custom }, base, R.features.map((f) => f.key));
if (!_oo.slug) delete _oo.slug;
try { await api.call('users.update', _oo); ui.toast('Đã lưu quyền của ' + (_o10.full_name || _o10.username) + '.', 'ok'); if (onSaved) await onSaved(); } catch (e) { say.textContent = e.userMessage || e.message || t('err.generic'); }
}, { kind: 'secondary', small: true, icon: 'shield', testid: 'user-perms-save' }))));
if (self && _o10.role === 'owner') slug.input.readOnly = false;
}
export async function renderInvitesPanel(box, { ui, api, onUsersChanged } = {}) {
_o5();
const { h, button } = ui;
const list = h('div', { 'data-testid': 'inv-panel-list' }, ui.spinner());
const info = h('p', { class: 'muted small', 'data-testid': 'inv-panel-info' });
let _o7 = { invites: [], seats: null, mail_quota: null };
const company = () => { try { const _o2 = window.__bds && window.__bds.extras && window.__bds.extras.S.settings.get('company', null); return (_o2 && _o2.name) || ''; } catch { return ''; } };
ui.mountTo(box, h('div', { class: 'sub-block inv-panel', 'data-testid': 'inv-panel' },
h('h4', { class: 'section-title' }, 'Mời qua email'),
h('p', { class: 'muted small' }, 'Người được mời bấm link trong email (hoặc link anh/chị gửi qua Zalo), tự đặt mật khẩu, nhập mã 6 số gửi tới email rồi vào app đúng vai trò. Link dùng 1 lần, hết hạn sau 7 ngày.'),
h('div', { class: 'btn-row' },
button('Mời nhân viên', () => inviteDialog(ui, api, { role: 'sale', seats: _o7.seats, quota: _o7.mail_quota, company: company(), registry: _o7.registry, onDone: _od }), { kind: 'primary', icon: 'mail', testid: 'inv-panel-add' }),
button('Thêm Quản trị', () => inviteDialog(ui, api, { role: 'owner', seats: _o7.seats, quota: _o7.mail_quota, company: company(), registry: _o7.registry, onDone: _od }), { kind: 'secondary', icon: 'shield', testid: 'inv-panel-add-admin' })),
info, list));
await _od();
async function _od() {
try { _o7 = await api.call('invite.list', {}) || _o7; } catch (e) {
ui.mountTo(list, h('p', { class: 'muted small' }, e && e.code === 'UNKNOWN_ACTION' ? 'Máy chủ đang chạy bản cũ, chưa có "Mời qua email" – vào Cài đặt › Phiên bản bấm "Cập nhật máy chủ".' : (e.userMessage || t('err.network'))));
return;
}
info.textContent = [seatsText(_o7.seats), _o7.mail_quota !== null && _o7.mail_quota !== undefined ? 'Hôm nay Google còn cho gửi ' + _o7.mail_quota + ' thư.' : ''].filter(Boolean).join(' ');
ui.mountTo(list, invitesList(ui, api, _o7.invites || [], { company: company(), onChange: async () => { await _od(); if (onUsersChanged) await onUsersChanged(); } }));
}
}
export default { registryOr, suggestSlug, permRows, validatePeople, toPeople, resizeGroup, inviteMessage, zaloHref, inviteBase, statusLabel, seatsText, maxPeople, quotaWarn, permTable, stepper, peopleEditor, invitesList, inviteDialog, renderInvitesPanel, shareZalo };

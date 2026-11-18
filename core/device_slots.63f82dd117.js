import { ensureCss } from './xkit.f03faf0986.js';
import { cssOnce as tfaCss } from './tfa.1fd07d9b62.js';
export const CLASS_LABEL = { pc: 'Máy tính', mobile: 'Điện thoại / máy tính bảng' };
export const CLASS_WORD = { pc: 'máy tính', mobile: 'điện thoại / máy tính bảng' };
export const CLASS_ICON = { pc: 'monitor', mobile: 'phone' };
export const RESEND_MS = 60000;
function cssOnce() { tfaCss(); ensureCss(new URL('./device_slots.7f38a283f1.css', import.meta.url).href, 'bds-ds-css'); }
const _of = (n) => String(n).padStart(2, '0');
export function fmtWhen(ms) {
const d = new Date(Number(ms) || 0);
return Number(ms) ? _of(d.getHours()) + ':' + _of(d.getMinutes()) + ' ' + _of(d.getDate()) + '/' + _of(d.getMonth() + 1) : '';
}
const _o2 = (c) => (CLASS_LABEL[c] ? c : 'pc');
export function kickedText(_o9) {
const _oq = _o9 || {}, c = _o2(_oq.cls), who = _oq.by_name || CLASS_LABEL[c];
if (_oq.why === 'remote') return 'Máy này đã được đăng xuất từ xa' + (_oq.at ? ' (' + fmtWhen(_oq.at) + ')' : '') + '. Đăng nhập lại để dùng tiếp.';
if (_oq.why === 'remote_keep') return 'Máy này đã được đăng xuất từ xa' + (_oq.at ? ' (' + fmtWhen(_oq.at) + ')' : '') + '. Dữ liệu trên máy vẫn giữ – đăng nhập lại đúng tài khoản để dùng tiếp.';
if (_oq.why === 'limit') return 'Từ bản cập nhật mới, mỗi tài khoản chỉ đăng nhập cùng lúc 1 máy tính và 1 điện thoại. Tài khoản đang dùng ' + CLASS_WORD[c] + ' khác (' + who + '), nên máy này đã đăng xuất.';
return 'Tài khoản đã đăng nhập trên một máy khác (' + who + (_oq.at ? ', ' + fmtWhen(_oq.at) : '') + '). Máy này đã đăng xuất.';
}
export function pendingText(n, { tried = false, wiped = false } = {}) {
const _o9 = Number(n) || 0;
if (wiped) return _o9 ? 'Máy được đăng xuất từ xa nên ' + _o9 + ' thay đổi chưa gửi trên máy này đã bị xoá.' : '';
if (_o9) return 'Còn ' + _o9 + ' thay đổi chưa gửi được – vẫn giữ nguyên trên máy này, không mất. Đăng nhập lại đúng tài khoản trên máy này là app tự gửi nốt.';
return tried ? 'Các thay đổi trên máy này đã gửi lên máy chủ trước khi đăng xuất – không mất gì.' : '';
}
export function challengeText(ch) {
const c = ch || {}, w = CLASS_WORD[_o2(c.cls)], other = c.other && c.other.name ? ' (' + c.other.name + ')' : '';
const _o6 = 'Tài khoản đang đăng nhập trên ' + w + ' khác' + other + '. Mỗi tài khoản chỉ đăng nhập cùng lúc 1 máy tính và 1 điện thoại.';
if (c.mail_failed || !c.code_sent) return _o6 + ' Máy chủ chưa gửi được mã qua email – bấm "Gửi lại mã" sau ít phút, hoặc đăng xuất máy kia từ xa (Cài đặt › Bảo mật › Thiết bị) rồi đăng nhập lại.';
return _o6 + ' Nhập mã 6 số vừa gửi tới ' + (c.email || 'email của anh/chị') + ' – máy kia sẽ tự đăng xuất.';
}
export function cleanCode(_op) { const d = String(_op == null ? '' : _op).replace(/\D/g, ''); return d.length === 6 ? d : ''; }
export function resendLabel(at, now = Date.now()) { const _oj = Math.ceil((Number(at) - now) / 1000); return _oj > 0 ? 'Gửi lại mã (' + _oj + ' giây)' : 'Gửi lại mã'; }
export function demoDeviceCode(outbox, now = Date.now()) {
const box = Array.isArray(outbox) ? outbox : [];
for (let _o8 = box.length - 1; _o8 >= 0; _o8--) {
const r = box[_o8] || {};
if (r.channel !== 'mail' || now - Number(r.at || now) > 10 * 60000) continue;
const _od = /Mã xác nhận đổi máy BDS Studio: (\d{6})/.exec(String(r.subject || '') + ' ' + String(r.text || ''));
if (_od) return _od[1];
}
return '';
}
export function slotRows(slots) {
const _oj = slots || {};
return ['pc', 'mobile'].map((c) => ({ cls: c, label: CLASS_LABEL[c], icon: CLASS_ICON[c], device: _oj[c] || null }));
}
export function recentReason(r) {
const _oq = r || {};
if (_oq.why === 'remote') return 'đăng xuất từ xa, xoá dữ liệu trên máy';
if (_oq.why === 'remote_keep') return 'đăng xuất từ xa';
if (_oq.why === 'limit') return 'quá 1 ' + CLASS_WORD[_o2(_oq.cls)] + ' (bản cập nhật mới)';
return 'thay bằng ' + (_oq.by_name || 'máy khác');
}
export function deviceVerifyForm(ch, { ui, auth, api, demo, onDone, onCancel }) {
cssOnce();
const { h, button, field } = ui;
let cur = { ...ch };
let _oi = Number(ch.resend_at) || 0;
const info = h('p', { class: 'tfa-info', 'aria-live': 'polite', 'data-testid': 'dv-info' });
const code = field({ label: 'Mã 6 số trong email', name: 'code', id: 'dv-code', inputmode: 'numeric', autocomplete: 'one-time-code' });
code.input.setAttribute('maxlength', '12'); code.input.classList.add('tfa-code-input'); code.input.setAttribute('data-testid', 'dv-code');
const err = h('p', { class: 'form-err', role: 'alert', 'aria-live': 'assertive', 'data-testid': 'dv-err' });
const demoBox = h('p', { class: 'tfa-demo', 'data-testid': 'dv-demo', hidden: true });
const resend = button('Gửi lại mã', async () => {
err.textContent = '';
try {
const r = await auth.deviceResend(cur.dv_ticket);
cur = { ...cur, ...r }; _oi = Number(r.resend_at) || Date.now() + RESEND_MS;
ui.toast('Đã gửi mã mới tới ' + (r.email || 'email') + '.', 'ok');
_og(); _ok();
} catch (e) { err.textContent = e.userMessage || e.message; if (e.retry_at) _oi = Number(e.retry_at); }
}, { kind: 'ghost', small: true, id: 'dv-resend', icon: 'send', testid: 'dv-resend' });
const back = button('Quay lại đăng nhập', () => { _on(); if (onCancel) onCancel(); }, { kind: 'ghost', small: true, id: 'dv-back', icon: 'back', testid: 'dv-back' });
const who = ch.username ? h('p', { class: 'auth-who' }, 'Tài khoản ', h('strong', null, '@' + ch.username)) : null;
const submit = button('Xác nhận đổi máy', null, { kind: 'primary', type: 'submit', block: true, id: 'dv-submit', icon: 'check', testid: 'dv-submit' });
const _o5 = h('form', { class: 'auth-form tfa-form ds-verify', novalidate: true, 'data-testid': 'dv-form' },
who, info, code, demoBox, err, submit, h('div', { class: 'tfa-links' }, resend, back),
h('p', { class: 'muted small ds-note' }, 'Không phải anh/chị đăng nhập? Đừng đưa mã cho ai và đổi mật khẩu ngay – người kia đã biết mật khẩu.'));
let _oo = null;
function _on() { if (_oo) clearInterval(_oo); _oo = null; }
function _og() {
info.textContent = challengeText(cur);
const _ob = Math.ceil((_oi - Date.now()) / 1000);
resend.disabled = _ob > 0;
const _om = resend.querySelector('span'); if (_om) _om.textContent = resendLabel(_oi);
}
async function _ok() {
if (!demo || !api || typeof api.demoOutbox !== 'function') return;
let c = '';
try { c = demoDeviceCode(await api.demoOutbox()); } catch { c = ''; }
demoBox.textContent = c ? 'Xem thử: không có email thật – mã giả là ' + c + '.' : '';
demoBox.hidden = !c;
}
_oo = setInterval(() => { if (!_o5.isConnected) return _on(); _og(); }, 1000);
_og(); _ok();
_o5.addEventListener('submit', async (ev) => {
ev.preventDefault();
if (_o5.dataset.busy) return;
err.textContent = '';
const c = cleanCode(code.getValue());
if (!c) { err.textContent = 'Nhập đủ 6 số trong email.'; code.input.focus(); return; }
_o5.dataset.busy = '1'; submit.disabled = true; submit.classList.add('is-busy');
let _o4 = false;
try {
const _o3 = await auth.deviceVerify(cur.dv_ticket, c);
_on();
await (onDone && onDone(_o3));
} catch (e) {
err.textContent = e.userMessage || e.message || 'Chưa xác nhận được.';
code.setValue(''); code.input.focus();
_o4 = e.code === 'AUTH_INVALID';
if (_o4) { _on(); resend.disabled = true; back.focus(); }
} finally { delete _o5.dataset.busy; submit.disabled = _o4; submit.classList.remove('is-busy'); }
});
return _o5;
}
export function kickedView({ ui, kicked, pending = 0, tried = false, wiped = false, onRelogin, onDownload }) {
cssOnce();
const { h, button } = ui;
const _oh = pendingText(pending, { tried, wiped });
const dl = Number(pending) > 0 && !wiped && typeof onDownload === 'function'
? button('Tải tệp các thay đổi chưa gửi', () => onDownload(), { kind: 'secondary', block: true, icon: 'download', id: 'kicked-download', testid: 'kicked-download' }) : null;
return h('div', { class: 'auth-form ds-kicked', 'data-testid': 'kicked-screen' },
h('p', { class: 'lead', 'data-testid': 'kicked-text' }, kickedText(kicked)),
_oh ? h('p', { class: 'auth-notice' + (Number(pending) ? ' ds-warn' : ''), role: 'note', 'data-testid': 'kicked-pending' }, _oh) : null,
dl,
h('p', { class: 'muted small' }, (kicked && /^remote/.test(kicked.why || '')) ? 'Không phải anh/chị đăng xuất? Đăng nhập lại rồi đổi mật khẩu ở Cài đặt › Bảo mật.'
: 'Đăng nhập lại trên máy này cần mã xác nhận gửi qua email, và máy kia sẽ bị đăng xuất. Không phải anh/chị đăng nhập ở máy kia? Đăng nhập lại rồi đổi mật khẩu ngay.'),
button('Đăng nhập lại', () => onRelogin && onRelogin(), { kind: 'primary', block: true, icon: 'lock', id: 'kicked-relogin', testid: 'kicked-relogin' }));
}
export function remoteLogoutText(wipe) {
return wipe
? 'Máy đó sẽ đăng xuất và XOÁ toàn bộ dữ liệu app trên máy, kể cả thay đổi chưa gửi. Chỉ chọn khi máy bị mất, bị lấy hoặc đã bán.'
: 'Máy đó sẽ đăng xuất nhưng vẫn giữ thay đổi chưa gửi: đăng nhập lại đúng tài khoản trên máy đó là app tự gửi tiếp (hoặc tải tệp các thay đổi).';
}
export async function remoteLogoutAsk(ui, dev, who) {
const { h } = ui;
const box = h('input', { type: 'checkbox', id: 'slot-wipe', 'data-testid': 'slot-wipe' });
const _oe = h('p', { class: 'muted small', 'data-testid': 'slot-wipe-note' }, remoteLogoutText(false));
box.addEventListener('change', () => { _oe.textContent = remoteLogoutText(box.checked); });
const body = h('div', null,
h('p', { class: 'lead' }, 'Đăng xuất "' + ((dev && dev.name) || 'máy này') + '"' + (who ? ' của ' + who : '') + ' từ xa? Máy đó phải đăng nhập lại mới dùng tiếp.'),
h('label', { class: 'ds-wipe', for: 'slot-wipe' }, box, h('span', null, 'Máy bị mất – xoá dữ liệu trên máy')),
_oe);
const _op = await ui.modal({ title: 'Đăng xuất từ xa', body,
actions: [{ label: 'Huỷ', kind: 'ghost', value: false }, { label: 'Đăng xuất máy đó', kind: 'danger', value: true, id: 'confirm-ok' }] }).done;
return _op === true ? !!box.checked : null;
}
export async function renderDeviceSlots(box, { ui, api, deviceId, fallback } = {}) {
cssOnce();
const { h, button, badge } = ui;
ui.mountTo(box, ui.spinner());
let d;
try { d = await api.call('devices.slots', {}); } catch (e) {
if (e && (e.missingAction || e.code === 'UNKNOWN_ACTION') && fallback) return fallback(box);
ui.mountTo(box, h('p', { class: 'muted' }, (e && e.userMessage) || 'Chưa tải được danh sách thiết bị.'));
return;
}
const _o0 = () => renderDeviceSlots(box, { ui, api, deviceId, fallback });
const _oc = (dev, action, who) => button('Đăng xuất máy này', async () => {
const wipe = await remoteLogoutAsk(ui, dev, who);
if (wipe === null) return;
await api.call(action, { device_id: dev.id, wipe });
ui.toast('Đã đăng xuất "' + (dev.name || 'máy') + '"' + (wipe ? ' và xoá dữ liệu trên máy đó.' : '.'), 'ok');
_o0();
}, { kind: 'ghost', small: true, icon: 'logout', testid: 'slot-logout-' + dev.id });
const _ol = (row, { action, who, mine }) => {
const dev = row.device;
const _o7 = dev && (dev.current || dev.id === deviceId);
return h('div', { class: 'ds-slot' + (dev ? '' : ' ds-empty'), 'data-testid': (mine ? 'slot-' : 'slot-m-') + row.cls },
h('div', { class: 'ds-slot-head' }, ui.icon(row.icon, 20), h('strong', null, row.label)),
dev ? h('div', { class: 'ds-slot-body' },
h('div', { class: 'row-text' }, h('span', { class: 'ds-dev-name' }, dev.name || 'Thiết bị'),
h('span', { class: 'muted small' }, dev.last_seen ? 'Dùng lúc ' + fmtWhen(dev.last_seen) : '')),
_o7 ? badge('Máy này', 'gold') : _oc(dev, action, who))
: h('p', { class: 'muted small' }, 'Còn trống – đăng nhập trên ' + CLASS_WORD[row.cls] + ' là vào thẳng.'));
};
const parts = [
h('p', { class: 'muted small ds-lead' }, 'Mỗi tài khoản đăng nhập cùng lúc 1 máy tính và 1 điện thoại (máy tính bảng tính là điện thoại). ' +
'Đăng nhập máy thứ hai cùng loại cần mã gửi qua email, máy cũ tự đăng xuất.'),
h('div', { class: 'ds-slots', 'data-testid': 'my-slots' }, ...slotRows(d.mine).map((r) => _ol(r, { action: 'devices.revoke', mine: true })))
];
if (Array.isArray(d.recent) && d.recent.length) {
parts.push(h('div', { class: 'ds-recent', 'data-testid': 'slots-recent' }, h('span', { class: 'muted small' }, 'Đã đăng xuất gần đây:'),
...d.recent.map((r) => h('span', { class: 'muted small' }, (r.name || 'Thiết bị') + ' – ' + recentReason(r) + ' lúc ' + fmtWhen(r.at)))));
}
if (Array.isArray(d.engines) && d.engines.length) {
parts.push(h('div', { class: 'ds-engines' }, h('h5', { class: 'ds-sub' }, 'Máy dựng video'),
ui.list(d.engines, (e) => h('div', { class: 'row-main' },
h('div', { class: 'row-text' }, h('strong', null, (e.member_name ? e.member_name + ' · ' : '') + (e.name || 'Máy dựng')), h('span', { class: 'muted small' }, e.last_seen ? 'Dùng lúc ' + fmtWhen(e.last_seen) : '')),
button('Thu hồi', async () => { await api.call('devices.revoke', { device_id: e.id }); ui.toast('Đã thu hồi máy dựng.', 'ok'); _o0(); }, { kind: 'ghost', small: true, icon: 'lock', testid: 'engine-revoke-' + e.id })))));
}
if (Array.isArray(d.team) && d.team.length) {
parts.push(h('div', { class: 'ds-team', 'data-testid': 'team-slots' }, h('h5', { class: 'ds-sub' }, 'Thiết bị của nhân viên'),
...d.team.map((_od) => h('div', { class: 'ds-member', 'data-testid': 'team-' + _od.username },
h('div', { class: 'ds-member-name' }, ui.icon('user', 18), h('strong', null, _od.full_name || _od.username), h('span', { class: 'muted small' }, '@' + _od.username)),
h('div', { class: 'ds-slots' }, ...slotRows(_od.slots).map((r) => _ol(r, { action: 'users.revoke_device', who: _od.full_name || _od.username })))))));
}
ui.mountTo(box, ...parts);
}
export function watchSession({ api, active, supported, minGapMs = 30000 } = {}) {
if (typeof document === 'undefined' || !api) return () => {};
let _oa = 0;
const _o1 = () => {
if (document.visibilityState === 'hidden' || !(active && active()) || !(supported && supported())) return;
if (Date.now() - _oa < minGapMs) return;
_oa = Date.now();
api.call('session.check', {}).catch(() => { });
};
document.addEventListener('visibilitychange', _o1);
window.addEventListener('focus', _o1);
return () => { document.removeEventListener('visibilitychange', _o1); window.removeEventListener('focus', _o1); };
}

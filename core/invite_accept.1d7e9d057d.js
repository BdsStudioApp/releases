import { t } from './i18n.c64f4bc3eb.js';
import { hashPassword, randomSalt, normUsername, validUsername } from './auth.7b8dd8e978.js';
import { cleanCode6, demoCodeFrom } from './email_verify.c44911bb1b.js';
import { ensureCss } from './xkit.e7637ba4a6.js';
import { privacyLine } from './instance.087c1b328a.js';
export const INVITE_RE = /^#\/moi\?(.*)$/;
export const TOKEN_RE = /^[0-9a-f]{16}\.[A-Za-z0-9_-]{16,64}$/;
export function takeInviteToken(loc = (typeof location !== 'undefined' ? location : null), hist = (typeof history !== 'undefined' ? history : null)) {
const _o6 = INVITE_RE.exec((loc && loc.hash) || '');
if (!_o6) return '';
let v = '';
try { v = String(new URLSearchParams(_o6[1] || '').get('ma') || '').trim(); } catch { v = ''; }
try { if (hist) hist.replaceState(null, '', loc.pathname + loc.search + '#/home'); } catch { }
return TOKEN_RE.test(v) ? v : 'bad';
}
export async function showInviteAccept({ ui, api, auth, token, root, afterLogin, showLogin }) {
try { ensureCss(new URL('./invites.21910a6901.css', import.meta.url).href, 'bds-invites-css'); } catch { }
const { h, button, field } = ui;
const _o1 = h('div', { class: 'inv-accept', 'data-testid': 'invite-accept' }, ui.spinner());
root.className = 'app app-auth';
ui.mountTo(root, h('main', { class: 'auth' }, h('div', { class: 'auth-card' },
h('div', { class: 'brand' }, h('img', { src: 'assets/icon.svg', alt: '', class: 'brand-mark', width: 56, height: 56 }),
h('div', null, h('div', { class: 'brand-name' }, t('app.name')), h('div', { class: 'brand-tag' }, t('app.tagline')))),
h('h1', { class: 'auth-title' }, 'Nhận lời mời'), _o1)));
const _oa = button('Về màn đăng nhập', () => showLogin(), { kind: 'ghost', icon: 'back', testid: 'invite-to-login' });
if (token === 'bad') return ui.mountTo(_o1, h('p', { class: 'form-err', role: 'alert', 'data-testid': 'invite-error' }, 'Link mời bị thiếu một đoạn. Mở lại đúng link trong email, hoặc nhờ người mời bấm "Chép link mời" rồi gửi lại.'), _oa);
let _o5;
try { _o5 = await api.call('invite.info', { token }); } catch (e) {
return ui.mountTo(_o1, h('p', { class: 'form-err', role: 'alert', 'data-testid': 'invite-error' }, (e && (e.userMessage || e.message)) || t('err.generic')), _oa);
}
const _o4 = api.mode === 'demo';
const un = field({ label: t('auth.username'), name: 'username', id: 'inv-username', autocomplete: 'username', value: _o5.username || '', hint: 'Chữ thường không dấu, số, dấu chấm – dùng để đăng nhập.' });
un.input.setAttribute('autocapitalize', 'none'); un.input.setAttribute('spellcheck', 'false');
un.input.addEventListener('input', () => { const v = un.input.value.toLowerCase().replace(/\s+/g, ''); if (v !== un.input.value) un.input.value = v; });
const p1 = field({ label: t('auth.password'), type: 'password', name: 'password', id: 'inv-pw1', autocomplete: 'new-password', hint: 'Từ 8 ký tự. Chỉ anh/chị biết – người mời cũng không xem được.' });
const p2 = field({ label: t('auth.password2'), type: 'password', name: 'password2', id: 'inv-pw2', autocomplete: 'new-password' });
const ph = field({ label: 'Số điện thoại của anh/chị', type: 'tel', name: 'phone', id: 'inv-phone', autocomplete: 'tel', inputmode: 'tel', placeholder: 'VD: 0912 345 678', hint: 'In trên tin nhắn Zalo, landing, báo giá gửi khách. Bỏ trống được.' });
ph.input.setAttribute('data-testid', 'invite-phone');
const code = field({ label: 'Mã 6 số trong email', id: 'inv-code', inputmode: 'numeric', autocomplete: 'one-time-code', placeholder: '123456' });
code.input.setAttribute('data-testid', 'invite-code'); code.input.setAttribute('maxlength', '9');
const sayCode = h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'invite-code-info' });
const demoLine = h('p', { class: 'tfa-demo small', 'data-testid': 'invite-demo', hidden: true });
const err = h('p', { class: 'form-err', role: 'alert', 'aria-live': 'assertive', 'data-testid': 'invite-err' });
let later = false;
const laterBtn = button('Tạo tài khoản, xác nhận email sau', () => { later = true; _o9(); }, { kind: 'ghost', small: true, icon: 'clock', testid: 'invite-later' });
laterBtn.hidden = !_o5.mail_failed;
const _o8 = button('Gửi mã tới email', async () => {
err.textContent = '';
try {
const _o7 = await api.call('invite.send_code', { token });
sayCode.textContent = 'Đã gửi mã 6 số tới ' + (_o7.email || _o5.email) + '. Mở hộp thư (xem cả mục Thư rác/Spam, Quảng cáo). Mã có hiệu lực 15 phút.';
_o8.querySelector('span').textContent = 'Gửi lại mã';
if (_o4) {
let _o2 = '';
try { _o2 = demoCodeFrom(await api.demoOutbox(), ''); } catch { _o2 = ''; }
if (_o2) { demoLine.textContent = 'Xem thử: không gửi email thật – mã xác nhận giả là ' + _o2 + '.'; demoLine.hidden = false; }
}
code.input.focus({ preventScroll: true });
} catch (e) {
err.textContent = (e && (e.userMessage || e.message)) || 'Chưa gửi được mã. Thử lại.';
if (e && e.code === 'MAIL_FAILED') laterBtn.hidden = false;
}
}, { kind: 'secondary', small: true, icon: 'mail', testid: 'invite-send' });
const submitBtn = button('Tạo tài khoản và vào app', () => { later = false; return _o9(); }, { kind: 'primary', block: true, icon: 'check', testid: 'invite-submit' });
ui.mountTo(_o1,
h('p', { 'data-testid': 'invite-hello' }, 'Chào ', h('strong', null, _o5.full_name), '! ', _o5.inviter ? _o5.inviter + ' mời' : 'Anh/chị được mời', ' anh/chị vào BDS Studio',
_o5.company ? ' của ' + _o5.company : '', ' với vai trò ', h('strong', { 'data-testid': 'invite-role' }, _o5.role_label || _o5.role), '.'),
h('p', { class: 'muted small' }, 'Link dùng 1 lần, hết hạn ', ui.date(Number(_o5.expires_at), true), '. Mã xác nhận gửi tới email ', h('strong', null, _o5.email), '.'),
h('form', { class: 'auth-form', novalidate: true, 'data-testid': 'invite-form', onsubmit: (e) => { e.preventDefault(); _o9(); } },
un, ph, p1, p2,
h('div', { class: 'ev-box' }, h('div', { class: 'btn-row' }, _o8), sayCode, demoLine, code),
err, submitBtn, privacyLine(h, { testid: 'invite-privacy', lead: 'Tạo tài khoản là anh/chị đã đọc ' }), h('div', { class: 'btn-row' }, laterBtn, _oa)));
async function _o9() {
err.textContent = '';
if (_o1.dataset.busy) return;
const username = normUsername(un.getValue());
const _o0 = String(p1.getValue() || ''), b = String(p2.getValue() || '');
if (!validUsername(username)) { err.textContent = t('auth.err.username'); un.input.focus(); return; }
if (_o0.length < 8) { err.textContent = t('auth.err.short'); p1.input.focus(); return; }
if (_o0 !== b) { err.textContent = t('auth.err.mismatch'); p2.input.focus(); return; }
const phone = String(ph.getValue() || '').trim();
if (phone && !/^(\+?84|0)\d{9,10}$/.test(phone.replace(/[ .]/g, ''))) { err.textContent = 'Số điện thoại chưa đúng (10 số, bắt đầu bằng 0) – sửa lại hoặc để trống.'; ph.input.focus(); return; }
const _o2 = cleanCode6(code.getValue());
if (!later && !_o2) { err.textContent = 'Bấm "Gửi mã tới email", rồi nhập đủ 6 số trong email.'; code.input.focus(); return; }
_o1.dataset.busy = '1'; submitBtn.disabled = true;
try {
const salt = randomSalt();
const pw_hash = await hashPassword(_o0, salt);
await api.call('invite.accept', later ? { token, username, salt, pw_hash, phone, later: true } : { token, username, salt, pw_hash, phone, code: _o2 });
auth.rememberUsername(username);
const _o3 = await auth.login(username, _o0);
if (_o3 && _o3.tfa_required) { showLogin('Đã tạo tài khoản @' + username + '. Đăng nhập để tiếp tục.'); return; }
ui.toast('Đã tạo tài khoản @' + username + ' – chào mừng anh/chị!', 'ok', 5000);
await afterLogin(_o0);
} catch (e) {
err.textContent = (e && (e.userMessage || e.message)) || t('err.generic');
if (e && /^INVITE_/.test(String(e.code || ''))) submitBtn.hidden = true;
} finally { delete _o1.dataset.busy; submitBtn.disabled = false; }
}
}
export default { takeInviteToken, showInviteAccept };

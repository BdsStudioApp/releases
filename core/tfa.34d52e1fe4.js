import { qrElement } from './qr.aa623cdb09.js';
import { ensureCss, download } from './xkit.e7637ba4a6.js';
import { loginName, USERNAME_RE } from './auth.7b8dd8e978.js';
import { t as tr } from './i18n.c64f4bc3eb.js';
export function cssOnce() { ensureCss(new URL('./tfa.d746921905.css', import.meta.url).href, 'bds-tfa-css'); }
export const METHOD_LABEL = { telegram: 'Telegram', totp: 'Ứng dụng xác thực', backup: 'Mã dự phòng' };
export function viaText(_ov) {
return ({
mine: 'Mã 6 số vừa gửi tới Telegram của anh/chị.',
main: 'Mã 6 số vừa gửi tới bot Telegram chung của app.',
owner: 'Mã 6 số vừa gửi tới Telegram của Quản trị (Admin) – nhờ Quản trị đọc giúp.'
})[_ov] || 'Chưa gửi được mã qua Telegram. Bấm "Gửi lại mã" hoặc chọn cách khác.';
}
export function methodHint(method, _ov) {
if (method === 'totp') return 'Mở ứng dụng xác thực (Google Authenticator…) trên điện thoại, nhập 6 số đang hiện cho "BDS Studio".';
if (method === 'backup') return 'Nhập 1 mã dự phòng 8 ký tự đã in/lưu khi bật xác thực 2 lớp. Mỗi mã dùng 1 lần.';
return viaText(_ov);
}
export function cleanCode(method, v) {
if (method === 'backup') { const c = String(v || '').toLowerCase().replace(/[^a-z0-9]/g, ''); return c.length === 8 ? c : ''; }
const d = String(v || '').replace(/\D/g, '');
return d.length === 6 ? d : '';
}
export function defaultMethod(ch) {
const _ob = (ch && ch.methods) || [];
if (_ob.includes('telegram') && ch.code_sent) return 'telegram';
if (_ob.includes('totp')) return 'totp';
return _ob.find((x) => x !== 'backup') || _ob[0] || 'telegram';
}
export function renameProblem(name, current) {
const n = loginName(name);
if (!n) return 'Nhập tên đăng nhập mới.';
if (!USERNAME_RE.test(n)) return 'Tên đăng nhập 3–32 ký tự: chữ thường không dấu, số, dấu chấm, gạch dưới, gạch ngang.';
if (current && n === String(current).toLowerCase()) return 'Tên mới giống tên đang dùng.';
return '';
}
export function groupSecret(s) { return String(s || '').replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim(); }
export function backupText(codes, username, when = new Date()) {
const d = when.toLocaleDateString('vi-VN');
return ['BDS Studio – MÃ DỰ PHÒNG XÁC THỰC 2 LỚP', 'Tài khoản: @' + username + ' · tạo ngày ' + d, '',
'Dùng khi không nhận được mã Telegram và không có điện thoại. Mỗi mã dùng 1 lần.', 'Cất ở nơi an toàn, không chụp gửi cho ai.', '',
...codes.map((c, _o8) => String(_o8 + 1).padStart(2, ' ') + '.  ' + c), ''].join('\n');
}
export function demoCode(now = Date.now(), storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
try {
const _or = JSON.parse((storage && storage.getItem('bds_mock')) || '{}');
const _o2 = (_or && _or._outbox) || [];
for (let _o8 = _o2.length - 1; _o8 >= 0; _o8--) {
const _oi = _o2[_o8];
if (_oi.channel !== 'telegram' || now - Number(_oi.at) > 10 * 60000) continue;
const _ob = /Mã (?:đăng nhập|xác nhận)[\s\S]*?<b>(\d{6})<\/b>/.exec(String(_oi.text || ''));
if (_ob) return _ob[1];
}
} catch { }
return '';
}
export function tfaStepForm(ch, { ui, auth, demo, onDone, onCancel }) {
cssOnce();
const { h, button, field } = ui;
let method = defaultMethod(ch);
let _ov = ch.sent_via || '';
let _ok = Number(ch.resend_at) || 0;
const info = h('p', { class: 'tfa-info', 'aria-live': 'polite', 'data-testid': 'tfa-info' });
const code = field({ label: 'Mã 6 số', name: 'code', id: 'tfa-code', inputmode: 'numeric', autocomplete: 'one-time-code' });
code.input.setAttribute('maxlength', '12'); code.input.classList.add('tfa-code-input');
const trust = field({ label: 'Tin máy này 30 ngày (không hỏi mã nữa)', type: 'checkbox', value: true, id: 'tfa-trust', name: 'trust' });
const err = h('p', { class: 'form-err', role: 'alert', 'aria-live': 'assertive' });
const demoBox = h('p', { class: 'tfa-demo', 'data-testid': 'tfa-demo' });
const resend = button('Gửi lại mã', async () => {
err.textContent = '';
try {
const _oi = await auth.tfaResend(ch.tfa_ticket);
_ov = _oi.sent_via || _ov; _ok = Number(_oi.resend_at) || Date.now() + 60000;
ui.toast('Đã gửi mã mới.', 'ok');
_of();
} catch (e) { err.textContent = e.userMessage || e.message; if (e.retry_at) _ok = Number(e.retry_at); }
}, { kind: 'ghost', small: true, id: 'tfa-resend' });
const seg = (ch.methods || []).length > 1 ? ui.segmented(ch.methods.map((_ob) => ({ value: _ob, label: METHOD_LABEL[_ob] || _ob })), method,
(v) => { method = v; code.setValue(''); err.textContent = ''; _of(); code.input.focus(); }, { label: 'Cách nhận mã', name: 'tfa-method' }) : null;
const who = ch.username ? h('p', { class: 'auth-who' }, 'Tài khoản ', h('strong', null, '@' + ch.username)) : null;
const submit = button('Xác nhận', null, { kind: 'primary', type: 'submit', block: true, id: 'tfa-submit' });
const _o7 = h('form', { class: 'auth-form tfa-form', novalidate: true, 'data-testid': 'tfa-form' },
who, seg, info, code, trust, demoBox, err, submit,
h('div', { class: 'tfa-links' }, resend,
h('button', { type: 'button', class: 'link-btn', id: 'tfa-back', onclick: () => { _oq(); onCancel && onCancel(); } }, 'Quay lại đăng nhập')));
let _os = null;
function _oq() { if (_os) clearInterval(_os); _os = null; }
function _of() {
info.textContent = methodHint(method, _ov);
const _o9 = code.querySelector('label');
if (_o9) _o9.textContent = method === 'backup' ? 'Mã dự phòng (8 ký tự)' : 'Mã 6 số';
code.input.setAttribute('inputmode', method === 'backup' ? 'text' : 'numeric');
resend.hidden = method !== 'telegram';
const _oa = Math.ceil((_ok - Date.now()) / 1000);
resend.disabled = _oa > 0;
const _oo = resend.querySelector('span');
if (_oo) _oo.textContent = _oa > 0 ? 'Gửi lại mã (' + _oa + ' giây)' : 'Gửi lại mã';
const _o5 = demo && method === 'telegram' ? demoCode() : '';
demoBox.textContent = _o5 ? 'Xem thử: không có Telegram thật – mã giả là ' + _o5 + '.' : '';
demoBox.hidden = !_o5;
}
_os = setInterval(() => { if (!_o7.isConnected) return _oq(); _of(); }, 1000);
_of();
_o7.addEventListener('submit', async (ev) => {
ev.preventDefault();
if (_o7.dataset.busy) return;
err.textContent = '';
const c = cleanCode(method, code.getValue());
if (!c) { err.textContent = method === 'backup' ? 'Mã dự phòng có 8 ký tự (vd abcd-2345).' : 'Nhập đủ 6 số.'; code.input.focus(); return; }
_o7.dataset.busy = '1'; submit.disabled = true; submit.classList.add('is-busy');
try {
const _o4 = await auth.tfaVerify(ch.tfa_ticket, method, c, !!trust.getValue());
_oq();
await (onDone && onDone(_o4));
} catch (e) {
err.textContent = e.userMessage || e.message || 'Chưa xác nhận được.';
code.setValue(''); code.input.focus();
} finally { delete _o7.dataset.busy; submit.disabled = false; submit.classList.remove('is-busy'); }
});
return _o7;
}
export function renameDialog({ ui, auth, current, suggest = '', target = null, title, lead, onDone, onLater }) {
cssOnce();
const { h, field } = ui;
const err = h('p', { class: 'form-err', role: 'alert' });
const name = field({ label: 'Tên đăng nhập mới', id: 'rename-new', name: 'new_username', value: suggest, autocomplete: 'off',
hint: 'Không phân biệt hoa/thường, có dấu cũng được (Nguyễn An = nguyenan).' });
name.input.setAttribute('autocapitalize', 'none'); name.input.setAttribute('spellcheck', 'false');
const preview = h('p', { class: 'tfa-preview', 'data-testid': 'rename-preview' });
const _om = () => { const n = loginName(name.getValue()); preview.textContent = n ? 'Sẽ đăng nhập bằng: ' + n : ''; };
name.input.addEventListener('input', _om); _om();
const pw = field({ label: target ? 'Mật khẩu của anh/chị (Quản trị)' : 'Mật khẩu hiện tại', type: 'password', id: 'rename-pw', autocomplete: 'current-password' });
const body = h('div', { class: 'stack', 'data-testid': 'rename-form' },
h('p', { class: 'lead' }, lead || (target
? 'Đổi tên đăng nhập của ' + (target.full_name || target.username) + ' (@' + target.username + '). Mật khẩu của họ giữ nguyên; tên cũ vẫn đăng nhập được thêm 30 ngày.'
: 'Đang đăng nhập bằng @' + current + '. Sau khi đổi, tên cũ vẫn đăng nhập được thêm 30 ngày rồi tự bỏ.')),
name, preview, pw, err);
const _ob = ui.modal({
title: title || 'Đổi tên đăng nhập', body, cls: 'rename-modal',
actions: [
{ label: onLater ? 'Để sau' : 'Huỷ', kind: 'ghost', id: 'rename-later', onClick: async () => { if (onLater) await onLater(); } },
{ label: 'Đổi tên', kind: 'primary', id: 'rename-ok', onClick: async () => {
err.textContent = '';
const _oe = renameProblem(name.getValue(), target ? target.username : current);
if (_oe) { err.textContent = _oe; name.input.focus(); return false; }
if (!pw.getValue()) { err.textContent = 'Nhập mật khẩu để xác nhận.'; pw.input.focus(); return false; }
try {
const _oi = target ? await auth.renameUser(target.id, name.getValue(), pw.getValue()) : await auth.rename(name.getValue(), pw.getValue());
ui.toast('Đã đổi tên đăng nhập thành @' + _oi.username + '. Tên @' + _oi.old_username + ' dùng được đến ' + ui.date(_oi.alias_until) + '.', 'ok', 6000);
if (onDone) await onDone(_oi);
return true;
} catch (e) { err.textContent = e.userMessage || e.message; return false; }
} }]
});
return _ob;
}
export function renameBlock({ ui, auth, onChanged }) {
const { h, button } = ui;
const _ou = auth.user || {};
const cur = h('strong', { 'data-testid': 'my-username' }, '@' + (_ou.username || ''));
return h('div', { class: 'sub-block', 'data-testid': 'rename-block' },
h('h4', { class: 'section-title' }, 'Tên đăng nhập'),
h('p', { class: 'muted' }, 'Anh/chị đang đăng nhập bằng ', cur, '. Tên không phân biệt hoa/thường và dấu (Nguyễn An = nguyenan).'),
h('div', { class: 'btn-row' }, button('Đổi tên đăng nhập', () => renameDialog({
ui, auth, current: _ou.username, suggest: _ou.rename_suggest || '',
onDone: (_oi) => { cur.textContent = '@' + _oi.username; if (onChanged) onChanged(_oi); }
}), { kind: 'secondary', icon: 'user', id: 'rename-open' })));
}
export async function postLoginPrompts({ ui, auth, nav, quietTfa = false }) {
const info = (auth.takeLoginInfo && auth.takeLoginInfo()) || {};
const _ou = auth.user;
if (!_ou) return;
if (info.alias_used) {
ui.toast('Anh/chị vừa đăng nhập bằng tên cũ @' + info.alias_used.name + '. Từ nay dùng tên @' + info.alias_used.username +
' (tên cũ hết dùng sau ' + ui.date(info.alias_used.until) + ').', 'warn', 9000);
}
if (typeof info.backup_left === 'number' && info.backup_left <= 3) {
ui.toast('Còn ' + info.backup_left + ' mã dự phòng. Vào Cài đặt › Bảo mật để tạo mã mới.', 'warn', 8000);
}
if (_ou.rename_suggest) { renameBanner({ ui, auth, user: _ou }); return; }
const tfa = _ou.tfa;
if (tfa && tfa.setup_needed && !quietTfa) {
let _on = false;
try { _on = sessionStorage.getItem('bds:tfa_nudge') === '1'; sessionStorage.setItem('bds:tfa_nudge', '1'); } catch { }
if (!_on) {
const t = ui.toast(tfaNudgeText(_ou, tfa, tr), 'warn', 9000);
if (t && nav) t.addEventListener('click', () => nav('settings/security'));
}
}
}
export function tfaNudgeText(user, tfa, tr = (k) => k) {
const role = String((user && user.role) || '');
const who = tfa && tfa.role_required && (role === 'owner' || role === 'manager') ? ' ' + tr('role.' + role) : ' này';
return 'Tài khoản' + who + ' cần bảo mật 2 lớp. Nối Telegram hoặc cài ứng dụng xác thực ở Cài đặt › Bảo mật.';
}
export function renameBanner({ ui, auth, user }) {
cssOnce();
if (typeof document === 'undefined' || document.getElementById('rename-banner')) return null;
const { h, button } = ui;
const _o3 = () => _o1.remove();
const _o1 = h('div', { id: 'rename-banner', class: 'rename-banner', role: 'status', 'data-testid': 'rename-banner' },
h('span', { class: 'rename-banner-text' }, 'Đổi tên đăng nhập từ @' + user.username + ' thành ', h('strong', null, '@' + user.rename_suggest), ' (theo tên trong Hồ sơ)? Tên cũ vẫn dùng được thêm 30 ngày.'),
h('span', { class: 'btn-row' },
button('Đổi tên', () => {
_o3();
renameDialog({ ui, auth, current: user.username, suggest: user.rename_suggest, title: 'Đổi tên đăng nhập',
lead: 'Đổi @' + user.username + ' thành @' + user.rename_suggest + '? Nhập mật khẩu để xác nhận. Tên @' + user.username + ' vẫn dùng được thêm 30 ngày.' });
}, { kind: 'primary', small: true, id: 'rename-banner-ok' }),
button('Để sau', async () => { _o3(); await auth.renameDismiss(); }, { kind: 'ghost', small: true, id: 'rename-banner-later' })));
document.body.appendChild(_o1);
return _o1;
}
function _og({ ui, auth, title, lead, okLabel, methods, onSubmit }) {
const { h, field, button } = ui;
const _od = (methods || []).filter(Boolean);
let method = _od.includes('totp') ? 'totp' : _od[0] || '';
const err = h('p', { class: 'form-err', role: 'alert' });
const pw = field({ label: 'Mật khẩu hiện tại', type: 'password', id: 'proof-pw', autocomplete: 'current-password' });
const code = field({ label: 'Mã', id: 'proof-code', inputmode: 'numeric', autocomplete: 'one-time-code' });
const hint = h('p', { class: 'muted small', 'aria-live': 'polite' });
const send = button('Gửi mã qua Telegram', async () => {
err.textContent = '';
try { const _oi = await auth.tfaSendCode(); hint.textContent = viaText(_oi.sent_via); } catch (e) { err.textContent = e.userMessage || e.message; }
}, { kind: 'secondary', small: true, id: 'proof-send' });
const _of = () => {
send.hidden = method !== 'telegram';
hint.textContent = method === 'totp' ? 'Nhập 6 số đang hiện trong ứng dụng xác thực.' : method === 'backup' ? 'Nhập 1 mã dự phòng (8 ký tự).' : method === 'telegram' ? 'Bấm "Gửi mã qua Telegram" rồi nhập 6 số.' : '';
};
const seg = _od.length > 1 ? ui.segmented(_od.map((_ob) => ({ value: _ob, label: METHOD_LABEL[_ob] })), method, (v) => { method = v; code.setValue(''); _of(); }, { label: 'Cách nhận mã', name: 'proof-method' }) : null;
_of();
return ui.modal({
title, cls: 'tfa-modal',
body: h('div', { class: 'stack', 'data-testid': 'proof-form' }, lead ? h('p', { class: 'lead' }, lead) : null, pw, _od.length ? [seg, send, code, hint] : null, err),
actions: [{ label: 'Huỷ', kind: 'ghost' }, { label: okLabel || 'Xác nhận', kind: 'primary', id: 'proof-ok', onClick: async () => {
err.textContent = '';
if (!pw.getValue()) { err.textContent = 'Nhập mật khẩu.'; return false; }
const c = _od.length ? cleanCode(method, code.getValue()) : '';
if (_od.length && !c) { err.textContent = method === 'backup' ? 'Mã dự phòng có 8 ký tự.' : 'Nhập đủ 6 số.'; return false; }
try { return (await onSubmit(pw.getValue(), method, c)) !== false; } catch (e) { err.textContent = e.userMessage || e.message; return false; }
} }]
});
}
export function showBackupCodes({ ui, codes, username }) {
cssOnce();
const { h, button } = ui;
const text = backupText(codes, username);
const grid = h('ol', { class: 'tfa-codes', 'data-testid': 'backup-codes' }, codes.map((c) => h('li', { class: 'mono' }, c)));
const print = () => {
const _o0 = h('div', { id: 'tfa-print-area' }, h('pre', null, text));
document.body.appendChild(_o0);
document.body.classList.add('tfa-printing');
const _o6 = () => { document.body.classList.remove('tfa-printing'); _o0.remove(); window.removeEventListener('afterprint', _o6); };
window.addEventListener('afterprint', _o6);
try { window.print(); } finally { setTimeout(_o6, 1500); }
};
return ui.modal({
title: 'Mã dự phòng – lưu lại ngay', wide: true, cls: 'tfa-modal',
body: h('div', { class: 'stack' },
h('p', { class: 'lead' }, 'Dùng khi không nhận được mã Telegram và không có điện thoại. Mỗi mã dùng 1 lần. Mã chỉ hiện MỘT LẦN này – in ra hoặc tải về, cất nơi an toàn.'),
grid,
h('div', { class: 'btn-row' },
button('In', print, { kind: 'secondary', id: 'backup-print' }),
button('Tải tệp', () => download('bds-studio-ma-du-phong-' + username + '.txt', text), { kind: 'secondary', id: 'backup-download' }),
button('Chép', () => ui.copy(text), { kind: 'ghost', id: 'backup-copy' }))),
actions: [{ label: 'Tôi đã lưu', kind: 'primary', id: 'backup-done' }]
});
}
function _ot({ ui, auth, onDone }) {
const { h, field, button } = ui;
const _o2 = h('div', { class: 'stack tfa-wizard', 'data-testid': 'totp-wizard' }, ui.spinner());
const err = h('p', { class: 'form-err', role: 'alert' });
const code = field({ label: 'Mã 6 số trong ứng dụng', id: 'totp-code', inputmode: 'numeric', autocomplete: 'one-time-code' });
const pw = field({ label: 'Mật khẩu hiện tại', type: 'password', id: 'totp-pw', autocomplete: 'current-password' });
const _ob = ui.modal({
title: 'Cài ứng dụng xác thực', wide: true, cls: 'tfa-modal', body: _o2,
actions: [{ label: 'Huỷ', kind: 'ghost' }, { label: 'Bật', kind: 'primary', id: 'totp-ok', onClick: async () => {
err.textContent = '';
const c = cleanCode('totp', code.getValue());
if (!c) { err.textContent = 'Nhập đủ 6 số đang hiện trong ứng dụng.'; return false; }
if (!pw.getValue()) { err.textContent = 'Nhập mật khẩu để xác nhận.'; return false; }
try {
const _oi = await auth.tfaEnable(pw.getValue(), 'totp', c);
ui.toast('Đã bật ứng dụng xác thực.', 'ok');
if (onDone) await onDone(_oi);
return true;
} catch (e) { err.textContent = e.userMessage || e.message; return false; }
} }]
});
auth.tfaSetupTotp().then((s) => {
const secret = h('code', { class: 'mono tfa-secret', 'data-testid': 'totp-secret' }, groupSecret(s.secret));
ui.mountTo(_o2,
h('ol', { class: 'tfa-steps' },
h('li', null, 'Cài ứng dụng ', h('strong', null, 'Google Authenticator'), ' (hoặc Microsoft Authenticator) trên điện thoại – miễn phí trên App Store / CH Play.'),
h('li', null, 'Trong ứng dụng bấm dấu ', h('strong', null, '+'), ' → ', h('strong', null, 'Quét mã QR'), ', đưa camera vào mã bên dưới.'),
h('li', null, 'Nhập 6 số ứng dụng hiện ra (mỗi 30 giây đổi số) và mật khẩu, rồi bấm Bật.')),
h('div', { class: 'tfa-qr', 'data-testid': 'totp-qr' }, qrElement(s.otpauth_url, { scale: 5, title: 'Mã QR cho ứng dụng xác thực' })),
h('details', { class: 'tfa-manual' }, h('summary', null, 'Không quét được? Nhập khoá bằng tay'),
h('p', { class: 'muted small' }, 'Tài khoản: BDS Studio (' + s.account + ') · loại: theo thời gian'), secret,
button('Chép khoá', () => ui.copy(s.secret), { kind: 'ghost', small: true })),
code, pw, err);
code.input.focus();
}).catch((e) => { ui.mountTo(_o2, h('p', { class: 'form-err' }, e.userMessage || e.message)); });
return _ob;
}
export async function renderTfaPanel(_o2, { ui, auth, nav }) {
cssOnce();
const { h, button, badge } = ui;
ui.mountTo(_o2, ui.spinner());
let _op;
try { _op = await auth.tfaStatus(); } catch (e) {
ui.mountTo(_o2, h('p', { class: 'muted', 'data-testid': 'tfa-panel' }, e.userMessage || 'Máy chủ chưa có xác thực 2 lớp – cập nhật máy chủ bản 1.0.4.'));
return;
}
const _oj = async () => { try { await auth.me(); } catch { } return renderTfaPanel(_o2, { ui, auth, nav }); };
const _ou = auth.user || {};
const _oc = (_op.methods || []).filter((_ob) => _ob !== 'backup');
const _oh = _op.methods || [];
const tgText = _op.telegram_via === 'mine' ? 'Sẵn sàng – gửi tới bot Telegram của anh/chị'
: _op.telegram_via === 'main' ? 'Sẵn sàng – gửi tới bot Telegram chung'
: _op.telegram_via === 'owner' ? 'Sẵn sàng – gửi tới Telegram của Quản trị (Admin), nhờ Quản trị đọc giúp. Nên nối Telegram riêng của anh/chị.'
: 'Chưa nối – vào Cài đặt › Telegram của tôi';
const _ol = (title, desc, ...acts) => h('div', { class: 'tfa-row' },
h('div', { class: 'row-text' }, h('strong', null, title), h('span', { class: 'muted small' }, desc)), h('div', { class: 'btn-row' }, acts));
const enableTelegram = () => _og({
ui, auth, title: 'Bật xác thực 2 lớp qua Telegram', okLabel: 'Bật', methods: ['telegram'],
lead: 'Từ nay khi đăng nhập ở máy lạ, app gửi mã 6 số qua Telegram.',
onSubmit: async (pw, method, code) => {
const _oi = await auth.tfaEnable(pw, method, code);
ui.toast('Đã bật xác thực 2 lớp.', 'ok');
if (_oi.backup_codes) showBackupCodes({ ui, codes: _oi.backup_codes, username: _ou.username });
_oj();
}
});
const statusBadge = _op.required ? badge(_op.role_required ? 'Bắt buộc (' + tr('role.owner') + '/Quản lý)' : 'Bắt buộc (Quản trị yêu cầu)', 'gold')
: _op.enabled ? badge('Đang bật', 'ok') : badge('Chưa bật', 'neutral');
const trusted = (_op.trusted || []);
ui.mountTo(_o2, h('div', { class: 'tfa-panel', 'data-testid': 'tfa-panel' },
h('p', { class: 'tfa-status' }, statusBadge, ' ', h('span', { class: 'muted' }, 'Chỉ hỏi mã khi đăng nhập ở máy lạ. Máy đã nhập mã đúng được tin ' + (_op.trust_days || 30) + ' ngày.')),
_op.setup_needed ? h('p', { class: 'tfa-warn', 'data-testid': 'tfa-setup-needed' }, 'Chưa có cách nhận mã nên app tạm chưa hỏi mã. Nối Telegram hoặc cài ứng dụng xác thực bên dưới.') : null,
_ol('Telegram', tgText, !_op.enabled && _op.telegram_via ? button('Bật xác thực 2 lớp', enableTelegram, { kind: 'primary', small: true, id: 'tfa-enable-tg' }) : null,
!_op.telegram_via && nav ? button('Nối Telegram', () => nav('settings/mytg'), { kind: 'ghost', small: true }) : null),
_ol('Ứng dụng xác thực', _op.totp ? 'Đã cài (Google Authenticator / Microsoft Authenticator…)' : 'Chưa cài – dùng được cả khi không có mạng Telegram',
_op.totp
? button('Gỡ', () => _og({
ui, auth, title: 'Gỡ ứng dụng xác thực', okLabel: 'Gỡ', methods: _oh,
onSubmit: async (pw, method, code) => { await auth.tfaDisable(pw, 'totp', method, code); ui.toast('Đã gỡ ứng dụng xác thực.', 'ok'); _oj(); }
}), { kind: 'ghost', small: true, id: 'tfa-totp-remove' })
: button('Cài ứng dụng xác thực', () => _ot({
ui, auth, onDone: (_oi) => { if (_oi.backup_codes) showBackupCodes({ ui, codes: _oi.backup_codes, username: _ou.username }); _oj(); }
}), { kind: 'secondary', small: true, icon: 'plus', id: 'tfa-totp-setup' })),
_ol('Mã dự phòng', _op.backup_left ? 'Còn ' + _op.backup_left + ' mã chưa dùng' : 'Chưa có – nên tạo và in ra để phòng mất điện thoại',
button(_op.backup_left ? 'Tạo mã mới' : 'Tạo mã dự phòng', () => _og({
ui, auth, title: 'Tạo 10 mã dự phòng mới', okLabel: 'Tạo mã', methods: _oh,
lead: _op.backup_left ? 'Các mã cũ sẽ hết hiệu lực.' : '',
onSubmit: async (pw, method, code) => { const _oi = await auth.tfaBackupCodes(pw, method, code); showBackupCodes({ ui, codes: _oi.codes, username: _ou.username }); _oj(); }
}), { kind: 'secondary', small: true, id: 'tfa-backup' })),
h('div', { class: 'sub-block' }, h('h4', { class: 'section-title' }, 'Máy đang được tin (không hỏi mã)'),
trusted.length ? ui.list(trusted, (d) => h('div', { class: 'row-main' },
h('div', { class: 'row-text' }, h('strong', null, (d.name || 'Thiết bị') + (d.current ? ' (máy này)' : '')), h('span', { class: 'muted small' }, 'đến ' + ui.date(d.until))),
button('Quên máy này', async () => { await auth.tfaUntrust({ device_id: d.device_id }); ui.toast('Máy đó sẽ phải nhập mã lần sau.', 'ok'); _oj(); }, { kind: 'ghost', small: true })))
: h('p', { class: 'muted small' }, 'Chưa có máy nào.'),
trusted.length > 1 ? h('div', { class: 'btn-row' }, button('Quên mọi máy khác', async () => { await auth.tfaUntrust({ keep_current: true }); ui.toast('Đã quên các máy khác.', 'ok'); _oj(); }, { kind: 'ghost', small: true, id: 'tfa-untrust-all' })) : null),
!_op.required && _op.enabled ? h('div', { class: 'btn-row' }, button('Tắt xác thực 2 lớp', () => _og({
ui, auth, title: 'Tắt xác thực 2 lớp', okLabel: 'Tắt', methods: _oh,
lead: 'Sau khi tắt, chỉ cần mật khẩu là đăng nhập được ở mọi máy.',
onSubmit: async (pw, method, code) => { await auth.tfaDisable(pw, 'all', method, code); ui.toast('Đã tắt xác thực 2 lớp.', 'ok'); _oj(); }
}), { kind: 'danger', small: true, id: 'tfa-disable' })) : null,
_oc.length ? null : h('p', { class: 'muted small' }, 'Mất hết cách nhận mã (tài khoản ' + tr('role.owner') + ')? Mở Apps Script của Sheet máy chủ, chạy hàm khoiPhuc2Lop – lần đăng nhập kế tiếp trong 24 giờ không cần mã.')));
}
export default { tfaStepForm, renderTfaPanel, renameDialog, renameBlock, postLoginPrompts, showBackupCodes };

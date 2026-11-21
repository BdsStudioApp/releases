export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const RESEND_MS = 60000;
export function cleanEmail(_op) { return String(_op == null ? '' : _op).trim(); }
export function validEmail(_op) { return EMAIL_RE.test(cleanEmail(_op)); }
export function cleanCode6(_op) { const d = String(_op == null ? '' : _op).replace(/\D/g, ''); return d.length === 6 ? d : ''; }
export function resendLabel(resendAt, now = Date.now()) {
const _oa = Math.ceil((Number(resendAt) - now) / 1000);
return _oa > 0 ? 'Gửi lại mã (' + _oa + ' giây)' : 'Gửi lại mã';
}
export function emailGateNeeded(u, now = Date.now()) {
const _o8 = u && u.email_gate;
if (!_o8 || typeof _o8 !== 'object' || !_o8.required) return false;
if (u.legacy) return false;
return !(Number(_o8.defer_until) > now);
}
export function purposeFor(email, current) { return cleanEmail(email).toLowerCase() === cleanEmail(current).toLowerCase() && cleanEmail(current) ? 'user' : 'change'; }
export function demoCodeFrom(outbox, email, now = Date.now()) {
const box = Array.isArray(outbox) ? outbox : [];
const em = cleanEmail(email).toLowerCase();
for (let _o9 = box.length - 1; _o9 >= 0; _o9--) {
const _of = box[_o9] || {};
if (_of.channel !== 'mail' || (em && String(_of.to || '').toLowerCase() !== em) || now - Number(_of.at || now) > 15 * 60000) continue;
const _ob = /Mã xác nhận email BDS Studio: (\d{6})/.exec(String(_of.subject || '')) || /(\d{6})/.exec(String(_of.text || ''));
if (_ob) return _ob[1];
}
return '';
}
export function mailFailText(e) {
return (e && (e.userMessage || e.message)) || 'Máy chủ chưa gửi được email xác nhận. Thử lại sau ít phút.';
}
export const PENDING_TTL_MS = 15 * 60000;
export function loadPending(key, storage = typeof sessionStorage !== 'undefined' ? sessionStorage : null, now = Date.now()) {
if (!key || !storage) return null;
try {
const _op = JSON.parse(storage.getItem(key) || 'null');
if (!_op || !validEmail(_op.sentTo) || !(now - Number(_op.sentAt) < PENDING_TTL_MS)) { storage.removeItem(key); return null; }
return { email: cleanEmail(_op.email || _op.sentTo), sentTo: cleanEmail(_op.sentTo), sentAt: Number(_op.sentAt), resendAt: Number(_op.resendAt) || 0 };
} catch { return null; }
}
export function savePending(key, p, storage = typeof sessionStorage !== 'undefined' ? sessionStorage : null) {
if (!key || !storage) return;
try { if (p) storage.setItem(key, JSON.stringify({ email: p.email, sentTo: p.sentTo, sentAt: p.sentAt, resendAt: p.resendAt })); else storage.removeItem(key); } catch { }
}
export function emailCodeBox(opts) {
const { ui, api } = opts;
const { h, button, field } = ui;
const _on = opts.testid || 'ev';
const _o3 = !!(api && api.mode === 'demo');
let st = { email: cleanEmail(opts.email), code: '', sent: false, verified: false, use_account_email: false, resendAt: 0, sentTo: '' };
const _oe = loadPending(opts.persistKey);
if (_oe) st = { ...st, email: _oe.email, sentTo: _oe.sentTo, sent: true, resendAt: _oe.resendAt, sentAt: _oe.sentAt };
const em = field({ label: opts.label || 'Email của anh/chị (bắt buộc)', type: 'email', value: st.email, id: _on + '-email', inputmode: 'email', autocomplete: 'email',
placeholder: 'email của anh/chị', hint: opts.hint || 'App gửi mã 6 số tới email này. Email đã xác nhận dùng để nhận mã khi quên mật khẩu.' });
em.input.setAttribute('data-testid', _on + '-email');
em.input.setAttribute('spellcheck', 'false'); em.input.setAttribute('autocapitalize', 'none');
const code = field({ label: 'Mã 6 số trong email', id: _on + '-code', inputmode: 'numeric', autocomplete: 'one-time-code', placeholder: '123456' });
code.input.setAttribute('data-testid', _on + '-code'); code.input.setAttribute('maxlength', '9');
const info = h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': _on + '-info' });
const _o7 = h('p', { class: 'ev-err small', role: 'alert', 'aria-live': 'assertive', 'data-testid': _on + '-err' });
const demoLine = h('p', { class: 'tfa-demo small', 'data-testid': _on + '-demo', hidden: true });
const okLine = h('p', { class: 'ev-ok', 'data-testid': _on + '-ok', hidden: true });
const fallback = h('div', { class: 'auth-notice', role: 'note', 'data-testid': _on + '-fallback', hidden: true });
const _oi = button('Gửi mã', () => _o4(), { kind: 'secondary', small: true, testid: _on + '-send' });
const _og = button('Gửi lại mã', () => _o4(), { kind: 'ghost', small: true, testid: _on + '-resend' });
const verifyBtn = button(opts.verifyLabel || 'Xác nhận mã', () => _o5(), { kind: 'primary', small: true, testid: _on + '-verify', icon: 'check' });
const codeRow = h('div', { class: 'ev-code', 'data-testid': _on + '-code-row', hidden: true }, code, h('div', { class: 'btn-row' }, verifyBtn, _og));
const _o6 = h('div', { class: 'ev-box', 'data-testid': _on }, em, h('div', { class: 'btn-row' }, _oi), info, demoLine, codeRow, okLine, fallback, _o7);
let _oo = null;
const _om = () => { if (_oo) clearInterval(_oo); _oo = null; };
function _od() {
const _ol = _og.querySelector('span');
if (_ol) _ol.textContent = resendLabel(st.resendAt);
_og.disabled = Math.ceil((st.resendAt - Date.now()) / 1000) > 0;
_oi.hidden = st.sent || st.verified;
codeRow.hidden = !st.sent || st.verified;
okLine.hidden = !st.verified;
em.input.readOnly = st.verified;
_o6.dataset.state = st.verified ? 'verified' : st.sent ? 'sent' : 'idle';
}
function _oh() { _om(); savePending(opts.persistKey, null); st = { ...st, code: '', sent: false, verified: false, use_account_email: false, resendAt: 0, sentTo: '' }; info.textContent = ''; demoLine.hidden = true; fallback.hidden = true; code.setValue(''); _od(); }
em.input.addEventListener('input', () => {
const _op = cleanEmail(em.getValue());
if (_op !== st.email) { st.email = _op; if (st.sent || st.verified) _oh(); }
_o7.textContent = _op && !validEmail(_op) ? 'Email chưa đúng (cần đủ dạng tên, chữ @, tên miền).' : '';
});
code.input.addEventListener('input', () => { const _o2 = cleanCode6(code.getValue()); if (_o2 && opts.autoVerify !== false && !st.verified) _o5(); });
code.input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); _o5(); } });
async function _o4() {
_o7.textContent = ''; fallback.hidden = true;
const _op = cleanEmail(em.getValue());
st.email = _op;
if (!_op) { _o7.textContent = 'Nhập email của anh/chị (bắt buộc).'; em.input.focus(); return false; }
if (!validEmail(_op)) { _o7.textContent = 'Email chưa đúng (cần đủ dạng tên, chữ @, tên miền).'; em.input.focus(); return false; }
try {
const _of = await opts.send(_op);
st.sent = true; st.sentTo = _op; st.resendAt = Number(_of && _of.resend_at) || Date.now() + RESEND_MS; st.sentAt = Date.now();
savePending(opts.persistKey, st);
info.textContent = 'Đã gửi mã 6 số tới ' + _op + '. Mở hộp thư (xem cả mục Thư rác/Spam, Quảng cáo), nhập mã vào ô bên dưới. Mã có hiệu lực 15 phút.';
if (!_oo) _oo = setInterval(() => { if (!_o6.isConnected) return _om(); _od(); }, 1000);
_od();
if (_o3) await _oj(_op, _o1);
code.input.focus({ preventScroll: true });
return true;
} catch (e) {
if (e && e.retry_at) st.resendAt = Number(e.retry_at);
if (e && e.code === 'MAIL_FAILED') _ok(e);
_o7.textContent = e && e.code === 'MAIL_FAILED' ? '' : (e && (e.userMessage || e.message)) || 'Chưa gửi được mã. Thử lại.';
_od();
return false;
}
}
async function _oj(_op, quiet) {
let _o2 = '';
try { _o2 = demoCodeFrom(api && typeof api.demoOutbox === 'function' ? await api.demoOutbox() : [], _op); } catch { _o2 = ''; }
if (!_o2) return '';
const _oc = 'Xem thử: không gửi email thật – mã xác nhận giả là ' + _o2 + '.';
demoLine.textContent = _oc; demoLine.hidden = false;
if (!quiet) ui.toast(_oc, 'info', 8000);
return _o2;
}
async function _o5() {
_o7.textContent = '';
if (st.verified) return true;
const _o2 = cleanCode6(code.getValue());
if (!st.sent) { _o7.textContent = 'Bấm "Gửi mã" trước.'; return false; }
if (!_o2) { _o7.textContent = 'Nhập đủ 6 số trong email.'; code.input.focus(); return false; }
if (_o6.dataset.busy) return false;
_o6.dataset.busy = '1'; verifyBtn.disabled = true;
try {
const result = await opts.verify(st.sentTo || st.email, _o2);
st.code = _o2; st.verified = true; _om(); savePending(opts.persistKey, null);
okLine.textContent = '✅ Đã xác nhận email ' + (st.sentTo || st.email);
_od();
if (opts.onVerified) await opts.onVerified({ email: st.sentTo || st.email, code: _o2, result, use_account_email: false });
return true;
} catch (e) {
_o7.textContent = (e && (e.userMessage || e.message)) || 'Mã xác nhận sai hoặc hết hạn.';
code.setValue(''); code.input.focus({ preventScroll: true });
return false;
} finally { delete _o6.dataset.busy; verifyBtn.disabled = false; }
}
function _ok(e) {
const _o0 = opts.allowAccountEmail && e && e.account_email ? String(e.account_email) : '';
const parts = [h('p', null, '⚠️ ', mailFailText(e))];
if (_o0) {
parts.push(h('p', { class: 'small' }, 'Dùng email tài khoản Google đang chạy máy chủ: ', h('strong', { 'data-testid': _on + '-account-email' }, _o0),
'. Chỉ chọn khi đây đúng là email của anh/chị (mã quên mật khẩu sẽ gửi về đây).'));
parts.push(button('Dùng email ' + _o0, async () => {
const ok = await ui.confirm('Email ' + _o0 + ' sẽ là email của tài khoản này (nhận mã khi quên mật khẩu). Anh/chị chắc đây là email của mình?', { title: 'Dùng email tài khoản Google?', ok: 'Đúng, dùng email này' });
if (!ok) return;
try {
const result = opts.useAccountEmail ? await opts.useAccountEmail(_o0) : null;
st.email = _o0; st.sentTo = _o0; st.verified = true; st.use_account_email = true; _om(); savePending(opts.persistKey, null);
em.setValue(_o0); okLine.textContent = '✅ Dùng email tài khoản Google: ' + _o0; fallback.hidden = true; _od();
if (opts.onVerified) await opts.onVerified({ email: _o0, code: '', result, use_account_email: true });
} catch (x) { _o7.textContent = (x && (x.userMessage || x.message)) || 'Chưa dùng được email này.'; }
}, { kind: 'primary', small: true, testid: _on + '-use-account' }));
} else parts.push(h('p', { class: 'small' }, 'Thử lại sau ít phút, hoặc kiểm tra lại email. Nhân viên: nhờ Quản trị (Admin) bấm "Cho dùng tạm 24 giờ" ở Cài đặt › Nhân sự.'));
if (e && e.can_defer && opts.onDefer) parts.push(button('Để sau (24 giờ)', async () => { try { await opts.onDefer(); } catch (x) { _o7.textContent = (x && (x.userMessage || x.message)) || 'Chưa để sau được.'; } }, { kind: 'ghost', small: true, testid: _on + '-defer' }));
ui.mountTo(fallback, ...parts);
fallback.hidden = false;
}
_o6.state = () => ({ email: st.sentTo || st.email, code: st.code, verified: st.verified, use_account_email: st.use_account_email, sent: st.sent });
_o6.focus = () => em.input.focus({ preventScroll: true });
let _o1 = false;
_o6.autoDemo = async (fallbackEmail) => {
if (!_o3) return false;
if (st.verified) return true;
if (!cleanEmail(em.getValue()) && fallbackEmail) { em.setValue(fallbackEmail); st.email = fallbackEmail; }
_o1 = true;
try { if (!st.sent && !(await _o4())) return false; } finally { _o1 = false; }
let _o2 = '';
try { _o2 = demoCodeFrom(await api.demoOutbox(), st.sentTo || st.email); } catch { _o2 = ''; }
if (!_o2) return false;
code.setValue(_o2);
return _o5();
};
if (_oe) {
info.textContent = 'Đã gửi mã 6 số tới ' + _oe.sentTo + ' lúc ' + new Date(_oe.sentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + '. Nhập mã vào ô bên dưới (hiệu lực 15 phút).';
_oo = setInterval(() => { if (!_o6.isConnected) return _om(); _od(); }, 1000);
}
_od();
return _o6;
}

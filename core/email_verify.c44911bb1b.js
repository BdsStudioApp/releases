export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const RESEND_MS = 60000;
export function cleanEmail(_oq) { return String(_oq == null ? '' : _oq).trim(); }
export function validEmail(_oq) { return EMAIL_RE.test(cleanEmail(_oq)); }
export function cleanCode6(_oq) { const d = String(_oq == null ? '' : _oq).replace(/\D/g, ''); return d.length === 6 ? d : ''; }
export function resendLabel(resendAt, now = Date.now()) {
const _ob = Math.ceil((Number(resendAt) - now) / 1000);
return _ob > 0 ? 'Gửi lại mã (' + _ob + ' giây)' : 'Gửi lại mã';
}
export function emailGateNeeded(u, now = Date.now()) {
const _o9 = u && u.email_gate;
if (!_o9 || typeof _o9 !== 'object' || !_o9.required) return false;
if (u.legacy) return false;
return !(Number(_o9.defer_until) > now);
}
export function purposeFor(email, current) { return cleanEmail(email).toLowerCase() === cleanEmail(current).toLowerCase() && cleanEmail(current) ? 'user' : 'change'; }
export function demoCodeFrom(outbox, email, now = Date.now()) {
const _o2 = Array.isArray(outbox) ? outbox : [];
const em = cleanEmail(email).toLowerCase();
for (let _oa = _o2.length - 1; _oa >= 0; _oa--) {
const _og = _o2[_oa] || {};
if (_og.channel !== 'mail' || (em && String(_og.to || '').toLowerCase() !== em) || now - Number(_og.at || now) > 15 * 60000) continue;
const _oc = /Mã xác nhận email BDS Studio: (\d{6})/.exec(String(_og.subject || '')) || /(\d{6})/.exec(String(_og.text || ''));
if (_oc) return _oc[1];
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
const _oq = JSON.parse(storage.getItem(key) || 'null');
if (!_oq || !validEmail(_oq.sentTo) || !(now - Number(_oq.sentAt) < PENDING_TTL_MS)) { storage.removeItem(key); return null; }
return { email: cleanEmail(_oq.email || _oq.sentTo), sentTo: cleanEmail(_oq.sentTo), sentAt: Number(_oq.sentAt), resendAt: Number(_oq.resendAt) || 0 };
} catch { return null; }
}
export function savePending(key, p, storage = typeof sessionStorage !== 'undefined' ? sessionStorage : null) {
if (!key || !storage) return;
try { if (p) storage.setItem(key, JSON.stringify({ email: p.email, sentTo: p.sentTo, sentAt: p.sentAt, resendAt: p.resendAt })); else storage.removeItem(key); } catch { }
}
export function emailCodeBox(opts) {
const { ui, api } = opts;
const { h, button, field } = ui;
const _oo = opts.testid || 'ev';
const _o4 = !!(api && api.mode === 'demo');
let st = { email: cleanEmail(opts.email), code: '', sent: false, verified: false, use_account_email: false, resendAt: 0, sentTo: '' };
const _of = loadPending(opts.persistKey);
if (_of) st = { ...st, email: _of.email, sentTo: _of.sentTo, sent: true, resendAt: _of.resendAt, sentAt: _of.sentAt };
const em = field({ label: opts.label || 'Email của anh/chị (bắt buộc)', type: 'email', value: st.email, id: _oo + '-email', inputmode: 'email', autocomplete: 'email',
placeholder: 'email của anh/chị', hint: opts.hint || 'App gửi mã 6 số tới email này. Email đã xác nhận dùng để nhận mã khi quên mật khẩu.' });
em.input.setAttribute('data-testid', _oo + '-email');
em.input.setAttribute('spellcheck', 'false'); em.input.setAttribute('autocapitalize', 'none');
const code = field({ label: 'Mã 6 số trong email', id: _oo + '-code', inputmode: 'numeric', autocomplete: 'one-time-code', placeholder: '123456' });
code.input.setAttribute('data-testid', _oo + '-code'); code.input.setAttribute('maxlength', '9');
const info = h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': _oo + '-info' });
const _o8 = h('p', { class: 'ev-err small', role: 'alert', 'aria-live': 'assertive', 'data-testid': _oo + '-err' });
const demoLine = h('p', { class: 'tfa-demo small', 'data-testid': _oo + '-demo', hidden: true });
const okLine = h('p', { class: 'ev-ok', 'data-testid': _oo + '-ok', hidden: true });
const fallback = h('div', { class: 'auth-notice', role: 'note', 'data-testid': _oo + '-fallback', hidden: true });
const _oj = button('Gửi mã', () => _o5(), { kind: 'secondary', small: true, testid: _oo + '-send' });
const _oh = button('Gửi lại mã', () => _o5(), { kind: 'ghost', small: true, testid: _oo + '-resend' });
const verifyBtn = button(opts.verifyLabel || 'Xác nhận mã', () => _o6(), { kind: 'primary', small: true, testid: _oo + '-verify', icon: 'check' });
const codeRow = h('div', { class: 'ev-code', 'data-testid': _oo + '-code-row', hidden: true }, code, h('div', { class: 'btn-row' }, verifyBtn, _oh));
const _o7 = h('div', { class: 'ev-box', 'data-testid': _oo }, em, h('div', { class: 'btn-row' }, _oj), info, demoLine, codeRow, okLine, fallback, _o8);
let _op = null;
const _on = () => { if (_op) clearInterval(_op); _op = null; };
function _oe() {
const _om = _oh.querySelector('span');
if (_om) _om.textContent = resendLabel(st.resendAt);
_oh.disabled = Math.ceil((st.resendAt - Date.now()) / 1000) > 0;
_oj.hidden = st.sent || st.verified;
codeRow.hidden = !st.sent || st.verified;
okLine.hidden = !st.verified;
em.input.readOnly = st.verified;
_o7.dataset.state = st.verified ? 'verified' : st.sent ? 'sent' : 'idle';
}
function _oi() { _on(); savePending(opts.persistKey, null); st = { ...st, code: '', sent: false, verified: false, use_account_email: false, resendAt: 0, sentTo: '' }; info.textContent = ''; demoLine.hidden = true; fallback.hidden = true; code.setValue(''); _oe(); }
em.input.addEventListener('input', () => {
const _oq = cleanEmail(em.getValue());
if (_oq !== st.email) { st.email = _oq; if (st.sent || st.verified) _oi(); }
_o8.textContent = _oq && !validEmail(_oq) ? 'Email chưa đúng (cần đủ dạng tên, chữ @, tên miền).' : '';
});
code.input.addEventListener('input', () => { const _o3 = cleanCode6(code.getValue()); if (_o3 && opts.autoVerify !== false && !st.verified) _o6(); });
code.input.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); _o6(); } });
async function _o5() {
_o8.textContent = ''; fallback.hidden = true;
const _oq = cleanEmail(em.getValue());
st.email = _oq;
if (!_oq) { _o8.textContent = 'Nhập email của anh/chị (bắt buộc).'; em.input.focus(); return false; }
if (!validEmail(_oq)) { _o8.textContent = 'Email chưa đúng (cần đủ dạng tên, chữ @, tên miền).'; em.input.focus(); return false; }
try {
const _og = await opts.send(_oq);
st.sent = true; st.sentTo = _oq; st.resendAt = Number(_og && _og.resend_at) || Date.now() + RESEND_MS; st.sentAt = Date.now();
savePending(opts.persistKey, st);
info.textContent = 'Đã gửi mã 6 số tới ' + _oq + '. Mở hộp thư (xem cả mục Thư rác/Spam, Quảng cáo), nhập mã vào ô bên dưới. Mã có hiệu lực 15 phút.';
if (!_op) _op = setInterval(() => { if (!_o7.isConnected) return _on(); _oe(); }, 1000);
_oe();
if (_o4) await _ok(_oq, _o1);
code.input.focus({ preventScroll: true });
return true;
} catch (e) {
if (e && e.retry_at) st.resendAt = Number(e.retry_at);
if (e && e.code === 'MAIL_FAILED') _ol(e);
_o8.textContent = e && e.code === 'MAIL_FAILED' ? '' : (e && (e.userMessage || e.message)) || 'Chưa gửi được mã. Thử lại.';
_oe();
return false;
}
}
async function _ok(_oq, quiet) {
let _o3 = '';
try { _o3 = demoCodeFrom(api && typeof api.demoOutbox === 'function' ? await api.demoOutbox() : [], _oq); } catch { _o3 = ''; }
if (!_o3) return '';
const _od = 'Xem thử: không gửi email thật – mã xác nhận giả là ' + _o3 + '.';
demoLine.textContent = _od; demoLine.hidden = false;
if (!quiet) ui.toast(_od, 'info', 8000);
return _o3;
}
async function _o6() {
_o8.textContent = '';
if (st.verified) return true;
const _o3 = cleanCode6(code.getValue());
if (!st.sent) { _o8.textContent = 'Bấm "Gửi mã" trước.'; return false; }
if (!_o3) { _o8.textContent = 'Nhập đủ 6 số trong email.'; code.input.focus(); return false; }
if (_o7.dataset.busy) return false;
_o7.dataset.busy = '1'; verifyBtn.disabled = true;
try {
const result = await opts.verify(st.sentTo || st.email, _o3);
st.code = _o3; st.verified = true; _on(); savePending(opts.persistKey, null);
okLine.textContent = '✅ Đã xác nhận email ' + (st.sentTo || st.email);
_oe();
if (opts.onVerified) await opts.onVerified({ email: st.sentTo || st.email, code: _o3, result, use_account_email: false });
return true;
} catch (e) {
_o8.textContent = (e && (e.userMessage || e.message)) || 'Mã xác nhận sai hoặc hết hạn.';
code.setValue(''); code.input.focus({ preventScroll: true });
return false;
} finally { delete _o7.dataset.busy; verifyBtn.disabled = false; }
}
function _ol(e) {
const _o0 = opts.allowAccountEmail && e && e.account_email ? String(e.account_email) : '';
const parts = [h('p', null, '⚠️ ', mailFailText(e))];
if (_o0) {
parts.push(h('p', { class: 'small' }, 'Dùng email tài khoản Google đang chạy máy chủ: ', h('strong', { 'data-testid': _oo + '-account-email' }, _o0),
'. Chỉ chọn khi đây đúng là email của anh/chị (mã quên mật khẩu sẽ gửi về đây).'));
parts.push(button('Dùng email ' + _o0, async () => {
const ok = await ui.confirm('Email ' + _o0 + ' sẽ là email của tài khoản này (nhận mã khi quên mật khẩu). Anh/chị chắc đây là email của mình?', { title: 'Dùng email tài khoản Google?', ok: 'Đúng, dùng email này' });
if (!ok) return;
try {
const result = opts.useAccountEmail ? await opts.useAccountEmail(_o0) : null;
st.email = _o0; st.sentTo = _o0; st.verified = true; st.use_account_email = true; _on(); savePending(opts.persistKey, null);
em.setValue(_o0); okLine.textContent = '✅ Dùng email tài khoản Google: ' + _o0; fallback.hidden = true; _oe();
if (opts.onVerified) await opts.onVerified({ email: _o0, code: '', result, use_account_email: true });
} catch (x) { _o8.textContent = (x && (x.userMessage || x.message)) || 'Chưa dùng được email này.'; }
}, { kind: 'primary', small: true, testid: _oo + '-use-account' }));
} else parts.push(h('p', { class: 'small' }, 'Thử lại sau ít phút, hoặc kiểm tra lại email. Nhân viên: nhờ Quản trị (Admin) bấm "Cho dùng tạm 24 giờ" ở Cài đặt › Người dùng.'));
if (e && e.can_defer && opts.onDefer) parts.push(button('Để sau (24 giờ)', async () => { try { await opts.onDefer(); } catch (x) { _o8.textContent = (x && (x.userMessage || x.message)) || 'Chưa để sau được.'; } }, { kind: 'ghost', small: true, testid: _oo + '-defer' }));
ui.mountTo(fallback, ...parts);
fallback.hidden = false;
}
_o7.state = () => ({ email: st.sentTo || st.email, code: st.code, verified: st.verified, use_account_email: st.use_account_email, sent: st.sent });
_o7.focus = () => em.input.focus({ preventScroll: true });
let _o1 = false;
_o7.autoDemo = async (fallbackEmail) => {
if (!_o4) return false;
if (st.verified) return true;
if (!cleanEmail(em.getValue()) && fallbackEmail) { em.setValue(fallbackEmail); st.email = fallbackEmail; }
_o1 = true;
try { if (!st.sent && !(await _o5())) return false; } finally { _o1 = false; }
let _o3 = '';
try { _o3 = demoCodeFrom(await api.demoOutbox(), st.sentTo || st.email); } catch { _o3 = ''; }
if (!_o3) return false;
code.setValue(_o3);
return _o6();
};
if (_of) {
info.textContent = 'Đã gửi mã 6 số tới ' + _of.sentTo + ' lúc ' + new Date(_of.sentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + '. Nhập mã vào ô bên dưới (hiệu lực 15 phút).';
_op = setInterval(() => { if (!_o7.isConnected) return _on(); _oe(); }, 1000);
}
_oe();
return _o7;
}

import * as M from './machine.js';
export const TG_TOKEN_RE = /^\d{6,12}:[A-Za-z0-9_-]{30,}$/;
const _o0 = /(\d{6,12}:[A-Za-z0-9_-]{30,})/;
export function parseBotText(_of) {
const _oh = String(_of == null ? '' : _of);
const _ol = _o0.exec(_oh);
const _on = /t\.me\/([A-Za-z][A-Za-z0-9_]{3,31})/i.exec(_oh) || /@([A-Za-z][A-Za-z0-9_]{2,31}bot)\b/i.exec(_oh);
return { token: _ol ? _ol[1] : '', username: _on ? _on[1] : '' };
}
export function tokenProblem(_of) {
if (!String(_of || '').trim()) return 'Dán mã bot vào ô (chép từ tin của BotFather).';
return parseBotText(_of).token ? null : 'Chưa đúng dạng mã bot – mã có dạng 7123456789:AAH… (dãy số, dấu hai chấm, rồi khoảng 35 chữ và số). Chép lại nguyên dòng mã trong tin của BotFather.';
}
export function geminiKeyProblem(_of) {
const _oo = String(_of || '').trim();
if (!_oo) return 'Dán khoá vào ô (bấm Copy ở trang AI Studio).';
if (!/^AIza[0-9A-Za-z_-]{30,}$/.test(_oo)) return 'Khoá chưa đúng dạng – khoá Gemini bắt đầu bằng AIza, dài khoảng 39 ký tự, không có dấu cách. Bấm Copy ở AI Studio rồi dán lại.';
return null;
}
export function tgErrorKind(e) {
const _oa = String((e && (e.userMessage || e.message)) || '');
if (/Chưa thấy tin nhắn/i.test(_oa)) return 'nomsg';
if (/không đúng|Chưa lưu mã bot|Unauthorized|\b40[14]\b/i.test(_oa)) return 'token';
return 'other';
}
export const TG_WRONG = { cause: 'Mã bot không đúng – Telegram không nhận mã này.', fix: 'Chép lại NGUYÊN dòng mã trong tin "Done! Congratulations…" của BotFather (dạng 7123456789:AAH…), rồi dán lại vào ô.' };
export const TG_NOMSG = { cause: 'Chưa thấy tin nhắn nào gửi tới bot.', fix: 'Mở bot vừa tạo (link t.me/… trong tin của BotFather) → bấm Start → gõ "chào" → gửi. Rồi QUAY LẠI tab BDS Studio này, bấm lại "Tự tìm mã cuộc trò chuyện".' };
const errText = (e) => String((e && (e.userMessage || e.message)) || 'Chưa làm được – kiểm tra mạng rồi thử lại.');
async function _oi(api) {
try { const _o4 = await api.call('connections.status'); return (_o4 && _o4.secrets) || {}; } catch { return null; }
}
export function geminiBox(ctl, { ui, onResult }) {
const { h, button } = ui;
const S = ctl.__gem || (ctl.__gem = { saved: null, asked: false });
const f = ui.field({ label: 'Khoá Gemini (bắt đầu bằng AIza…)', type: 'password', id: 'wiz-gemini-key', autocomplete: 'off', placeholder: 'AIza…' });
f.input.setAttribute('data-testid', 'wiz-gemini-key'); f.input.setAttribute('spellcheck', 'false'); f.input.setAttribute('autocapitalize', 'none');
const err = h('p', { class: 'small form-err', role: 'alert', 'aria-live': 'polite', 'data-testid': 'wiz-gemini-err' });
const saved = h('p', { class: 'muted small', 'data-testid': 'wiz-gemini-saved', hidden: !S.saved }, '✓ Máy chủ đã có khoá – dán khoá mới để thay, hoặc bấm "Lưu và kiểm tra" để kiểm khoá đang có.');
let _o2 = false;
const go = async () => {
if (_o2 || !ctl.api) return;
const _oo = String(f.getValue() || '').trim();
err.textContent = '';
if (!_oo && !S.saved) { err.textContent = '❌ ' + geminiKeyProblem(_oo); f.input.focus(); return; }
const _oc = _oo ? geminiKeyProblem(_oo) : null;
if (_oc) { err.textContent = '❌ ' + _oc; f.input.focus(); return; }
_o2 = true; f.input.disabled = true;
try {
if (_oo) { await ctl.api.call('settings.set', { key: 'gemini_key', value: _oo }); S.saved = true; f.setValue(''); }
const _oe = await ctl.api.call('connections.test', { target: 'gemini' });
onResult(_oe && _oe.ok ? { ok: true, msg: 'Khoá Gemini dùng được – AI đã bật.' }
: { ok: false, cause: (_oe && _oe.message) || 'Khoá Gemini chưa dùng được.', fix: 'Ở aistudio.google.com bấm Create API key → Copy, rồi dán lại vào ô. Khoá vừa tạo đôi khi cần 1–2 phút mới chạy.' });
} catch (e) {
onResult({ ok: false, cause: errText(e), fix: 'Kiểm tra mạng rồi bấm "Lưu và kiểm tra" lần nữa.' });
} finally { _o2 = false; f.input.disabled = false; }
};
f.input.addEventListener('input', () => { err.textContent = ''; const _oo = String(f.getValue() || '').trim(); if (_oo && !geminiKeyProblem(_oo)) setTimeout(go, 0); });
f.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
if (S.saved === null && !S.asked && ctl.api) {
S.asked = true;
_oi(ctl.api).then((sec) => { S.saved = !!(sec && sec.gemini_key); saved.hidden = !S.saved; });
}
return h('div', { class: 'wiz-box wiz-inline', 'data-testid': 'wiz-gemini' }, f, err,
h('div', { class: 'btn-row' }, button('Lưu và kiểm tra', go, { kind: 'primary', icon: 'check', testid: 'wiz-gemini-save' })), saved);
}
export function telegramBox(ctl, { ui, step, done = false, list, onResult, patch = () => {} }) {
const { h, button } = ui;
const _ok = ctl.state || {};
const S = ctl.__tg || (ctl.__tg = { phase: done ? 'done' : '', username: ((_ok.data || {}).tgBot) || '', asked: false, note: '' });
const _og = h('div', { class: 'wiz-tg', 'data-testid': 'wiz-tg' });
const _o1 = (ph) => (step.actions || []).filter((a) => a.phase === ph);
const _oj = (ph, note = '') => { S.phase = ph; S.note = note; _od(); };
const security = h('p', { class: 'wiz-note small', 'data-testid': 'wiz-tg-security' }, step.security || '');
async function test(name) {
let _oe;
try { _oe = await ctl.api.call('connections.test', { target: 'telegram' }); } catch (e) { onResult({ ok: false, cause: errText(e), fix: 'Kiểm tra mạng rồi bấm lại.' }); return; }
if (_oe && _oe.ok) { S.phase = 'done'; onResult({ ok: true, msg: 'Telegram hoạt động – đã gửi tin thử' + (name ? ' tới ' + name : '') + '. Xem trong Telegram.' }); return; }
onResult({ ok: false, cause: (_oe && _oe.message) || 'Telegram chưa nhận tin thử.', fix: 'Nhắn "chào" cho bot rồi bấm lại "Tự tìm mã cuộc trò chuyện".' });
}
async function _o7({ silent = false } = {}) {
let _o4;
try { _o4 = await ctl.api.call('telegram.find_chat_id'); } catch (e) {
const _o9 = tgErrorKind(e);
if (_o9 === 'nomsg') { if (silent) return 'nomsg'; onResult({ ok: false, ...TG_NOMSG }); return 'nomsg'; }
if (_o9 === 'token') { if (silent) return 'token'; S.phase = 'token'; onResult({ ok: false, ...TG_WRONG }); return 'token'; }
if (!silent) onResult({ ok: false, cause: errText(e), fix: 'Thử lại sau ít phút.' });
return 'other';
}
await test(_o4 && _o4.name);
return 'ok';
}
function _om() {
const f = ui.field({ label: 'Mã bot (token)', type: 'password', id: 'wiz-tg-token', autocomplete: 'off', placeholder: '7123456789:AAH…' });
f.input.setAttribute('data-testid', 'wiz-tg-token'); f.input.setAttribute('spellcheck', 'false'); f.input.setAttribute('autocapitalize', 'none');
const err = h('p', { class: 'small form-err', role: 'alert', 'aria-live': 'polite', 'data-testid': 'wiz-tg-err' }, S.err || '');
const info = h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'wiz-tg-info' });
let _o2 = false;
const go = async () => {
if (_o2 || !ctl.api) return;
const _of = String(f.getValue() || '');
S.err = ''; err.textContent = '';
const _oc = tokenProblem(_of);
if (_oc) { err.textContent = '❌ ' + _oc; f.input.focus(); return; }
const { token, username } = parseBotText(_of);
_o2 = true; f.input.disabled = true; info.textContent = '⏳ Đang lưu mã và hỏi Telegram…';
try {
await ctl.api.call('settings.set', { key: 'telegram_token', value: token });
f.setValue('');
if (username) { S.username = username; patch({ tgBot: username }); }
const _o9 = await _o7({ silent: true });
if (_o9 === 'token') { S.err = '❌ ' + TG_WRONG.cause + ' ' + TG_WRONG.fix; err.textContent = S.err; info.textContent = ''; return; }
if (_o9 === 'nomsg') { _oj('chat', '✅ Mã bot đúng – đã lưu lên máy chủ của anh/chị.'); return; }
if (_o9 === 'other') _oj('chat', '✅ Đã lưu mã bot.');
} catch (e) { err.textContent = '❌ ' + errText(e); info.textContent = ''; } finally { _o2 = false; f.input.disabled = false; }
};
f.input.addEventListener('input', () => { err.textContent = ''; if (parseBotText(f.getValue()).token) setTimeout(go, 0); });
f.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
const _op = h('div', { class: 'wiz-box wiz-inline', 'data-testid': 'wiz-tg-token-box' }, f, err,
h('div', { class: 'btn-row' }, button('Lưu và kiểm mã bot', go, { kind: 'primary', icon: 'check', testid: 'wiz-tg-save' })), info, security);
return list(_o1('token'), _op);
}
function _o3() {
const _o6 = button('Tự tìm mã cuộc trò chuyện', () => _o7(), { kind: 'primary', icon: 'sparkle', testid: 'wiz-tg-find' });
const _ob = list(_o1('chat'), h('div', { class: 'wiz-box wiz-inline', 'data-testid': 'wiz-tg-chat-box' }, h('div', { class: 'btn-row' }, _o6)));
const _o8 = _ob.querySelector(':scope > li > p');
if (S.username && _o8) _o8.after(h('a', { class: 'btn btn-secondary btn-sm', href: 'https://t.me/' + S.username, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'wiz-tg-open' }, ui.icon('send', 18), h('span', null, 'Mở @' + S.username)));
return [h('div', { class: 'wiz-tg-saved' }, h('p', { class: 'wiz-ok', role: 'status', 'data-testid': 'wiz-tg-saved' }, S.note || '✅ Máy chủ đã có mã bot.'),
button('Dán mã bot khác', () => _oj('token'), { kind: 'ghost', small: true, icon: 'refresh', testid: 'wiz-tg-change' })), _ob];
}
function _o5() {
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-tg-done' },
h('div', { class: 'btn-row' }, button('Gửi lại tin thử', () => test(''), { kind: 'secondary', small: true, icon: 'send', testid: 'wiz-tg-retest' }),
button('Đổi bot khác', () => _oj('token'), { kind: 'ghost', small: true, icon: 'refresh', testid: 'wiz-tg-change' })));
}
function _od() {
_og.dataset.phase = S.phase || 'token';
ui.mountTo(_og, S.phase === 'done' ? _o5() : S.phase === 'chat' ? _o3() : _om());
}
if (!S.phase) {
S.phase = 'token';
if (!S.asked && ctl.api) {
S.asked = true;
_oi(ctl.api).then((sec) => { if (sec && sec.telegram_token && S.phase === 'token' && _og.isConnected) _oj('chat'); else if (sec && sec.telegram_token && S.phase === 'token') S.phase = 'chat'; });
}
}
_od();
return _og;
}
export function recordInline(state, id, _oe) { return _oe && _oe.ok ? M.record(state, id, _oe) : state; }
export default { parseBotText, tokenProblem, geminiKeyProblem, tgErrorKind, geminiBox, telegramBox, TG_TOKEN_RE };

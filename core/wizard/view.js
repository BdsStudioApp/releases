import * as M from './machine.js';
import { engineDownload } from '../engine_dl.18c8a720c5.js';
import { FLOW_INTRO, FLOW_LABEL, ENGINE_GUIDE, URL_FIELD_LABEL, supportEmail, isSaleEdition, boldParts, flowWho } from './steps.js';
import { actionBlocks } from './layout.js';
import { geminiBox, telegramBox } from './ketnoi.js';
import { installDevice, installUrl, needsPcText, DEVICE_LABEL } from './device.js';
import { portalHost } from './provision.js';
import { browserProblems, browserEnv, normHost } from './checks.js';
import { handoverText, roleVi } from './report.js';
import { copyText } from '../updates.a1be44bf9a.js';
import { supportContact, privacyLine } from '../instance.1eceeeedc8.js';
import { diachiWidget, wishBox } from './diachi.js';
import { gcaiWidget } from './gcai_view.js';
import { available as gcaiAvailable, isPhone, loadProgress as gcaiProgress } from './gcai.js';
import { gcaiPlan, slotService, slotStateOf, slotsLabel, slotsLeftText, captchaToken, maskEmail, EMAIL_RE as MAIL_RE } from './gcai_slots.js';
import { helpUrl, helpPageForKey } from '../help_links.2d1b2d6d34.js';
import { companyDomainWidget } from './tenmien_cty.js';
import { doinguWidget } from './doingu.js';
import { emailCodeBox } from '../email_verify.4f5a65756b.js';
import { hwCheckPanel } from './hwcheck.js';
import { finishCard, appUrlFor } from '../a2hs.1403f674ce.js';
import { EVENT as VIDEO_EVENT, MODE_TEXT as VIDEO_MODE } from '../video_screens.b6afaa3e5c.js';
const _o2 = { ok: '✅', fail: '❌', skip: '⏭', later: '⏳' };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const ENGINE_ONLINE_MSG = 'Chỉ dùng AI trên mạng – không cài gì';
export const NOT_REAL_TEXT = 'CHƯA CÀI THẬT – dữ liệu nhập ở đây sẽ mất';
export function detectOs(nav = typeof navigator !== 'undefined' ? navigator : {}) {
const s = String((nav.userAgentData && nav.userAgentData.platform) || nav.platform || '') + ' ' + String(nav.userAgent || '');
return /Win/i.test(s) ? 'win' : 'mac';
}
const _o0 = [
[/quay lại/, 'back'], [/làm sau|chờ/, 'clock'], [/kiểm tra/, 'pulse'], [/chép/, 'copy'], [/^tải|tải về|tải tệp/, 'download'],
[/gửi/, 'mail'], [/^in\b|in \//, 'print'], [/cần giúp|cách /, 'help'], [/chọn lại|thử lại|làm lại|kiểm lại/, 'refresh'],
[/cài đặt ›|mở cài đặt/, 'settings'], [/^mở|xem/, 'external'], [/bỏ qua|^tiếp|sang bước/, 'next'],
[/bảo mật|xác thực|2 lớp|mã dự phòng/, 'shield'], [/tài khoản|người/, 'user'], [/tên miền|địa chỉ/, 'link'],
[/^tạo|thêm|cài/, 'plus'], [/^không|đóng|huỷ|xoá/, 'close'], [/./, 'check']
];
export const BTN_ICON_SEL = 'svg, .emoji, [data-ico], .wiz-chip-n, .wiz-flow-ico';
export function iconForLabel(label) {
const t = String(label || '').trim().toLowerCase();
return (_o0.find(([re]) => re.test(t)) || [0, 'next'])[1];
}
function _oa(root, ui) {
for (const b of root.querySelectorAll('button, a.btn')) {
if (b.querySelector(BTN_ICON_SEL)) continue;
const size = b.classList.contains('btn') ? (b.classList.contains('btn-sm') ? 18 : 20) : 16;
b.prepend(ui.icon(iconForLabel(b.textContent || b.getAttribute('aria-label')), size));
}
}
function _o43(container, ui) {
if (container.__wizIcons || typeof MutationObserver === 'undefined' || typeof ui.icon !== 'function') return;
container.__wizIcons = new MutationObserver(() => _oa(container, ui));
container.__wizIcons.observe(container, { childList: true, subtree: true });
}
export function mountWizard(container, ctl) {
const { ui } = ctl;
const { h, button } = ui;
let _o4 = '';
let _o33 = !!ctl.review;
_o43(container, ui);
const _o3y = ctl.mode === 'pre' && typeof history !== 'undefined' && typeof window !== 'undefined' && typeof history.pushState === 'function';
let _o2v = false;
let _o1y = null;
if (_o3y) {
try { const _o1q = history.state; if (!_o1q || (!_o1q.bdsWiz && !_o1q.bdsWizBase)) history.replaceState({ ...(_o1q || {}), bdsWizBase: true }, ''); } catch { }
window.addEventListener('popstate', _o2e);
}
render();
return { render };
function set(s) { ctl.set(s); render(); }
function _o1n(st) { return st && st.flow ? (st.finished && M.isFinished(st) ? '_done' : st.cur) : '_start'; }
function _o3p(st) {
if (!_o3y || _o2v) return;
const key = _o1n(st);
const cur = history.state && history.state.bdsWiz;
if (cur === key) return;
try { history.pushState({ ...(history.state || {}), bdsWiz: key }, ''); } catch { }
}
async function _o2e(e) {
if (!container.isConnected) { window.removeEventListener('popstate', _o2e); return; }
const id = e && e.state && e.state.bdsWiz;
const st = ctl.state;
if (id && id !== '_start' && id !== '_done' && st && st.flow && id !== st.cur && M.ids(st).includes(id)) {
_o2v = true;
try { set(M.goTo(st, id)); return; } catch { } finally { _o2v = false; }
return;
}
if (id === '_start' && st && st.flow && _oh(st)) { _o2v = true; try { set(null); } finally { _o2v = false; } return; }
if (id || !(e && e.state && e.state.bdsWizBase)) return;
const ok = await ui.confirm('Rời Trợ lý cài đặt? Các bước đã làm vẫn được lưu trên máy này – mở lại app là làm tiếp.', { ok: 'Rời trợ lý', title: 'Rời Trợ lý cài đặt?' });
if (ok) { window.removeEventListener('popstate', _o2e); history.back(); return; }
try { history.pushState({ bdsWiz: _o1n(ctl.state) }, ''); } catch { }
}
function _o3u() {
try {
for (let _o12 = container; _o12 && _o12 !== document.body; _o12 = _o12.parentElement) {
if (_o12.scrollHeight > _o12.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(_o12).overflowY)) _o12.scrollTop = 0;
}
if (ctl.mode !== 'settings') window.scrollTo(0, 0);
} catch { }
}
function render() {
const st = ctl.state;
const _o3c = _o1n(st) + (_o33 ? ':r' : '');
const _o25 = _o1y !== null && _o3c !== _o1y;
_o1y = _o3c;
ui.clear(container);
container.classList.add('wiz');
_o3p(st);
if (!st || !st.flow) { container.append(_ol()); if (_o25) _o3u(); return; }
if (st.finished && M.isFinished(st) && !_o33) { container.append(_o11(st)); if (_o25) _o3u(); return; }
container.append(_o1l(st), _o3m(st));
const on = container.querySelector('.wiz-chip.on'); const _o35 = on && on.parentElement;
if (_o35) _o35.scrollLeft = Math.max(0, on.offsetLeft - (_o35.clientWidth - on.offsetWidth) / 2);
const t = container.querySelector('[data-testid="wiz-step-title"]');
if (_o25) _o3u();
if (t && ctl.mode !== 'settings') try { t.focus({ preventScroll: _o25 }); } catch { }
}
function _o1z() {
const p = ctl.linkProblem;
if (!p) return null;
return h('div', { class: 'wiz-result is-bad', role: 'alert', 'data-testid': 'wiz-link-hint' },
h('p', null, h('strong', null, '❌ ' + p.cause)), h('p', { class: 'small' }, h('strong', null, 'Cách sửa: '), p.fix));
}
function _o18() { return installDevice() || (isPhone() ? 'phone' : '') || 'pc'; }
function _o19() {
return ctl.mode === 'pre' && !!ctl.portal && gcaiAvailable(ctl.config, { portal: true }) && gcaiPlan(ctl.config).on && !!_o18();
}
function _o3l() {
if (!_o19()) return null;
if (!ctl.gcaiSvc) ctl.gcaiSvc = slotService({ url: (ctl.config || {}).PROVISION_URL });
if (!ctl.gslots) {
if (!ctl.gcaiSvc.configured) ctl.gslots = { st: 'loi' };
else {
ctl.gslots = { st: 'cho' };
ctl.gcaiSvc.slots().then((_o32) => { ctl.gslots = slotStateOf(_o32); }, () => { ctl.gslots = { st: 'loi' }; })
.then(() => { if (container.isConnected && !(ctl.state && ctl.state.flow && ctl.state.cur !== 'allow')) render(); });
}
}
return ctl.gslots;
}
function _o1b() { const p = gcaiProgress(); return !!(p.claimed || p.fileId); }
function _o1e() { const _o3k = _o3l(); return !!_o3k && (_o3k.st === 'con' || (_o3k.st !== 'cho' && _o1b())); }
function _o1a() { const _o3k = _o3l(); return !!_o3k && _o3k.st === 'cho' && !_o1b(); }
function _o2t() { return ctl.mode === 'pre' && !!installDevice() && !_o1e() && !_o1a(); }
function _o2s(testid = 'wiz-pc-help', label = '📖 Xem cách cài trên máy tính (có ảnh)') {
const href = helpUrl(helpPageForKey('cai_may_tinh'));
return href ? h('a', { class: 'wiz-pc-help', href, target: '_blank', rel: 'noopener', 'data-testid': testid }, label) : null;
}
function _o1d() {
const _o3k = ctl.gslots || {};
return h('div', { class: 'wiz-pc wiz-gcai-card', role: 'note', 'data-testid': 'wiz-gcai-card' },
h('p', { class: 'wiz-pc-title' }, h('span', { 'aria-hidden': 'true' }, '📱 '), h('strong', null, _o18() === 'pc' ? 'Cài nhanh bằng tài khoản Google' : 'Cài ngay trên điện thoại bằng tài khoản Google')),
h('p', { class: 'wiz-gcai-prio', 'data-testid': 'wiz-gcai-prio' }, '⭐ ' + slotsLabel(_o3k.tong || gcaiPlan(ctl.config).slots) + (_o3k.st === 'con' ? ' · ' + slotsLeftText(_o3k.con) : '')),
h('p', { class: 'small' }, _o18() === 'pc'
? 'Khoảng 3–5 phút: đăng nhập Google, trang tự tạo máy chủ trong Google Drive của anh/chị – không phải tự Triển khai Apps Script. Chọn Cá nhân hoặc Công ty bên dưới để bắt đầu.'
: 'Khoảng 3–5 phút, không cần máy tính: đăng nhập Google, trang tự tạo máy chủ trong Google Drive của anh/chị. Chọn Cá nhân hoặc Công ty bên dưới để bắt đầu.'));
}
function _o2u() {
return h('div', { class: 'wiz-pc wiz-pc-wait', role: 'status', 'data-testid': 'wiz-gcai-wait' }, h('p', null, ui.spinner(), ' Đang kiểm tra cách cài trên ' + DEVICE_LABEL[_o18()] + '…'));
}
function _o2r({ inStep = false } = {}) {
const _ov = installDevice();
const url = installUrl({ portal: !!ctl.portal, origin: typeof location !== 'undefined' ? location.origin : '', host: portalHost(ctl.config || {}) });
const share = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
const _o3k = _o3l();
return h('div', { class: 'wiz-pc', role: 'note', 'data-testid': 'wiz-needs-pc', dataset: { device: _ov } },
h('p', { class: 'wiz-pc-title' }, h('span', { 'aria-hidden': 'true' }, '💻 '), h('strong', null, 'Cài trên máy tính')),
_o3k && _o3k.st === 'het' ? h('p', { class: 'small', 'data-testid': 'wiz-gcai-full' }, '⭐ Đã hết ' + (_o3k.tong || gcaiPlan(ctl.config).slots) + ' chỗ ưu tiên "Cài bằng Google" trên điện thoại – anh/chị cài trên máy tính nhé.') : null,
h('p', { 'data-testid': 'wiz-needs-pc-text' }, needsPcText(url)),
h('code', { class: 'wiz-pc-url', 'data-testid': 'wiz-needs-pc-url' }, url),
h('div', { class: 'wiz-pc-acts' },
button('Chép link', async () => {
const _o32 = await copyText(url);
ui.toast(_o32 === 'copied' ? 'Đã chép link – mở trên máy tính để cài' : 'Chưa chép được – giữ ngón tay lên link ở trên để chép', _o32 === 'copied' ? 'success' : 'warn');
}, { kind: 'primary', icon: 'copy', testid: 'wiz-needs-pc-copy' }),
share ? button('Gửi qua Zalo', async () => {
try { await navigator.share({ title: 'Cài BDS Studio trên máy tính', text: 'Mở link này trên máy tính để cài BDS Studio:', url }); } catch { }
}, { kind: 'secondary', icon: 'send', testid: 'wiz-needs-pc-share' }) : null),
_o22(),
inStep && ctl.state && ctl.state.flow === 'company' ? _o2s() : null,
ctl.loginHere ? (inStep ? button('Tôi đã cài rồi – đăng nhập trên máy này', () => ctl.loginHere(), { kind: 'secondary', icon: 'user', testid: 'wiz-needs-pc-login' })
: h('p', { class: 'muted small' }, 'Đã cài xong trên máy tính? Bấm "Tôi đã cài rồi – đăng nhập trên máy này" để dùng app trên ' + DEVICE_LABEL[_ov] + '.')) : null);
}
function _o22() {
if (!ctl.gcaiSvc) ctl.gcaiSvc = slotService({ url: (ctl.config || {}).PROVISION_URL });
if (!ctl.gcaiSvc.configured) return null;
const S = ctl.__mail || (ctl.__mail = { email: '', res: null });
const f = ui.field({ label: 'Hoặc gửi link về email (mở thư trên máy tính)', type: 'email', id: 'wiz-mail', value: S.email, inputmode: 'email', autocomplete: 'email', placeholder: 'ten@gmail.com',
onInput: (v) => { S.email = String(v || ''); } });
const _o2i = h('div', { class: 'wiz-mail-out', 'aria-live': 'polite', 'data-testid': 'wiz-mail-result' });
const ts = h('div', { class: 'wiz-turnstile', 'data-testid': 'wiz-mail-turnstile' });
const _o3h = (_o32) => {
S.res = _o32;
ui.mountTo(_o2i, _o32 ? h('p', { class: _o32.ok ? 'wiz-ok' : _o32.wait ? 'muted small' : 'wiz-bad', role: _o32.ok || _o32.wait ? 'status' : 'alert', dataset: { state: _o32.ok ? 'ok' : _o32.wait ? 'wait' : 'bad', code: _o32.code || '' } }, _o32.text) : null);
};
const send = button('Gửi link về email', async () => {
const email = String(f.getValue() || '').trim();
S.email = email;
if (!MAIL_RE.test(email)) { _o3h({ ok: false, code: 'BAD_EMAIL', text: '❌ Email chưa đúng – kiểm tra lại (ví dụ ten@gmail.com).' }); try { f.input.focus(); } catch { } return; }
_o3h({ wait: true, text: '⏳ Đang gửi…' + (String((ctl.config || {}).TURNSTILE_SITEKEY || '').trim() ? ' Nếu trang hỏi, đánh dấu ô kiểm tra bên dưới.' : '') });
try {
const turnstile = await captchaToken(ts, ctl.config || {}, { action: 'gui-link' });
await ctl.gcaiSvc.sendLink({ email, turnstile });
_o3h({ ok: true, code: 'SENT', text: '✅ Đã gửi link tới ' + maskEmail(email) + '. Mở thư trên máy tính (chưa thấy: xem cả mục Quảng cáo / Thư rác).' });
} catch (e) {
_o3h({ ok: false, code: (e && e.code) || 'NETWORK', text: '❌ ' + ((e && e.message) || 'Chưa gửi được – bấm "Chép link" ở trên.') });
}
}, { kind: 'secondary', icon: 'mail', testid: 'wiz-mail-send' });
f.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); send.click(); } });
if (S.res && !S.res.wait) _o3h(S.res);
return h('div', { class: 'wiz-mail', 'data-testid': 'wiz-mail' }, f, h('div', { class: 'wiz-pc-acts' }, send), ts, _o2i);
}
function _o3e(t) { return ctl.portal ? String(t == null ? '' : t).replace(/Mở BDS Studio và kết nối/g, 'Quay lại trang cài đặt và kết nối') : t; }
function _ol() {
const _o2z = browserProblems(browserEnv());
const card = (flow) => {
const f = FLOW_INTRO[flow];
return h('button', { type: 'button', class: 'wiz-flow', 'data-testid': 'wiz-choose-' + flow, onclick: () => {
let _o36 = M.start(flow, { installed: ctl.mode !== 'pre', portal: !!ctl.portal });
if (ctl.pendingUrl && M.ids(_o36).includes('allow')) { _o36 = M.setData(_o36, { url: ctl.pendingUrl }); ctl.autoCheck = true; ctl.fromLink = ctl.pendingUrl; if (ctl.clearPending) ctl.clearPending(); }
set(_o36);
} },
h('span', { class: 'wiz-flow-ico', 'aria-hidden': 'true' }, f.icon),
h('span', { class: 'wiz-flow-text' }, h('strong', null, f.title), h('span', { class: 'wiz-flow-who', 'data-testid': 'wiz-who-' + flow }, flowWho(flow, ctl.config)), h('span', { class: 'muted small' }, f.lead),
h('ul', { class: 'wiz-flow-points' }, f.points.map((p) => h('li', null, p)))));
};
return h('div', { class: 'wiz-choose', 'data-testid': 'wiz-choose' },
h('h1', { class: 'wiz-h1' }, 'Anh/chị dùng BDS Studio cho:'),
_o2t() ? _o2r() : _o1a() ? _o2u() : _o1e() ? _o1d() : null,
ctl.pendingUrl ? h('p', { class: 'wiz-ok', role: 'status', 'data-testid': 'wiz-pending-url' }, '✅ Đã nhận địa chỉ máy chủ từ Sheet. Chọn Cá nhân hoặc Công ty – trợ lý tự điền, tự kiểm máy chủ ở bước "Tạo máy chủ".') : null,
_o1z(),
h('div', { class: 'wiz-flows' }, card('personal'), card('company')),
ctl.loginHere ? h('div', { class: 'wiz-login-here' }, button('Tôi đã cài rồi – đăng nhập trên máy này', () => ctl.loginHere(), { kind: 'secondary', icon: 'user', testid: 'wiz-choose-login' }),
h('p', { class: 'muted small' }, 'Dùng khi đã cài BDS Studio trên máy khác (điện thoại thứ 2, máy tính): chỉ cần địa chỉ máy chủ hoặc link mở app.')) : null,
h('div', { class: 'wiz-pre', 'data-testid': 'wiz-prereq' },
_o2z.length ? [h('p', { class: 'wiz-bad' }, '❌ Máy này chưa đủ điều kiện:'), h('ul', null, _o2z.map((p) => h('li', { 'data-problem': p.id }, h('strong', null, p.cause), ' ', p.fix)))]
: h('p', { class: 'muted small' }, '✅ Trình duyệt và mạng đủ điều kiện. Cần thêm: một tài khoản Google (Gmail hoặc Workspace). Nhân viên/khách không cần cài gì.')),
ctl.mode === 'pre' && !ctl.sale ? h('button', { type: 'button', class: 'link-btn', 'data-testid': 'wiz-skip-all', onclick: () => ctl.skipWizard() }, 'Đã quen cài đặt? Bỏ qua trợ lý') : null,
ctl.mode === 'pre' ? null : h('p', { class: 'muted small' }, 'App đã cài sẵn: các bước tạo máy chủ được tính là xong, trợ lý chỉ dẫn phần còn lại.'));
}
function _o1l(st) {
const p = M.progress(st);
const _oj = M.steps(st).map((s, i) => {
const _o32 = st.res[s.id];
const on = s.id === st.cur;
const _of = on || M.isDone(st, s.id) || _og(st, s.id);
const _o2j = !!(_o32 && _o32.s === 'later' && s.required);
return h('li', { class: ['wiz-chip', on && 'on', _o32 && 'is-' + _o32.s, _o2j && 'is-owe'], dataset: { step: s.id } },
h('button', { type: 'button', disabled: !_of || on, onclick: () => { try { set(M.goTo(st, s.id)); } catch (e) { ui.toast(e.message, 'warn'); } }, title: s.title + (_o2j ? ' – bắt buộc, chưa xong' : '') },
h('span', { class: 'wiz-chip-n' }, _o2j ? '⚠' : _o32 && _o32.s === 'fail' && _o32.wait ? _o2.later : _o32 && _o2[_o32.s] ? _o2[_o32.s] : String(i + 1)), h('span', { class: 'wiz-chip-t' }, s.title + (_o2j ? ' (chưa xong)' : ''))));
});
return h('div', { class: 'wiz-head' },
M.isDemo(st) && ctl.demo ? h('p', { class: 'wiz-not-real', role: 'note', 'data-testid': 'wiz-not-real' }, '⚠️ ' + NOT_REAL_TEXT + ' – đang Xem thử bằng máy chủ giả trong trình duyệt này.') : null,
h('div', { class: 'wiz-top' },
h('span', { class: 'wiz-badge', 'data-testid': 'wiz-flow' }, (st.flow === 'company' ? '🏢 ' : '👤 ') + FLOW_LABEL[st.flow]),
h('span', { class: 'wiz-top-sp' }),
_oh(st) ? button('Chọn lại', () => set(null), { kind: 'ghost', small: true, testid: 'wiz-rechoose' }) : null,
button('Cần giúp?', () => _o1m(), { kind: 'ghost', small: true, icon: 'help', testid: 'wiz-help' })),
h('div', { class: 'wiz-prog', 'data-testid': 'wiz-progress' },
ui.progress(p.pct, 'Tiến độ cài đặt ' + p.pct + '%'),
h('p', { class: 'muted small' }, M.stepText(st) + ' · đã xong ' + p.done + ' · bước chính ' + p.mainDone + '/' + p.mainTotal)),
h('ol', { class: 'wiz-chips', 'aria-label': 'Các bước' }, _oj));
}
function _og(st, id) { try { M.goTo(st, id); return true; } catch { return false; } }
function _oh(st) { return ctl.mode !== 'post' && !Object.keys(st.res).some((id) => id === 'account' && st.res[id].s === 'ok') && st.origin === 'new'; }
function _o3m(st) {
const s = M.current(st);
const resBox = h('div', { class: 'wiz-result', 'data-testid': 'wiz-result', 'aria-live': 'polite' });
_o2o(resBox, ctl.last[s.id] || (st.res[s.id] && st.res[s.id].s === 'ok' ? { ok: true, msg: st.res[s.id].msg } : null));
const _o2a = s.id === 'diachi' && !(ctl.provision && ctl.provision.configured);
const deferrable = s.deferrable && !(s.id === 'diachi' && !_o2a);
const _oy = s.id === 'domain' && st.flow !== 'company' ? ((((st.data || {}).domain) || {}).mode || 'shared') : '';
const _ot = _oy === 'shared' && ctl.defaultAddress ? ctl.defaultAddress() : null;
const _o41 = !!(_ot && _ot.own === false);
const badge = s.noBadge ? null : s.required ? (deferrable ? ui.badge('Bắt buộc – làm sau được', 'gold') : ui.badge('Bắt buộc', 'gold')) : ui.badge('Tuỳ chọn', 'neutral');
const _o1k = !!ctl.link('template');
const gWay = s.id === 'allow' ? allowWay(st) : '';
const _o1g = gWay === 'google';
const _o34 = (t) => boldParts(_o3e(t)).map((_o46) => (_o46.b ? h('strong', null, _o46.t) : _o46.t));
const _o31 = s.id === 'diachi' && !_o2a && st.flow !== 'company' && !M.isDone(st, s.id);
const _o2q = s.id === 'allow' && ctl.mode === 'pre' && !!installDevice() && !((st.data || {}).url) && gWay !== 'google' && !(gWay === '' && _o1a());
const _o1c = s.id === 'allow' && gWay === '' && _o1a() && !((st.data || {}).url);
const _o3v = _o2q ? [] : (_o2a && s.todoNoService) || (_o31 && s.todoQuick) || (_oy === 'shared' && (_o41 ? s.todoSharedWait : s.todoShared)) || (_o1g && s.todoGoogle) || [];
const _o3w = _o3v.length ? h('ol', { class: 'wiz-actions wiz-todo', 'data-testid': 'wiz-todo' }, _o3v.map((t) => h('li', { class: 'wiz-act' }, h('p', null, _o34(t))))) : null;
const _o44 = s.actions.some((_o3) => _o3.way);
const _o23 = s.actions.filter((_o3) => !(_o3.alt && _o3.link && !ctl.link(_o3.link)) && (_o1k ? _o3.way !== 'manual' : _o3.way !== 'copy'));
let _o40;
const _o3r = () => (_o40 === undefined ? (_o40 = widget(s, st)) : _o40);
const _o8 = (acts, widgetEl = null) => h('ol', { class: 'wiz-actions', 'data-testid': 'wiz-actions' }, acts.map((_o3, i) => _o9(_o3, i, { widget: _o3.widget ? widgetEl : null })));
const _o1s = _o23.some((_o3) => _o3.widget);
const actions = _o23.length ? _o8(_o23, _o1s ? _o3r() : null) : null;
const _o24 = _o44 && _o1k ? s.actions.filter((_o3) => _o3.way === 'manual') : [];
const manualBox = _o24.length ? h('details', { class: 'wiz-manual', 'data-testid': 'wiz-manual' }, h('summary', null, 'Cách dự phòng: dán tay (khi link Tạo bản sao không mở được)'),
h('ol', { class: 'wiz-actions' }, _o24.map((_o3, i) => _o9(_o3, i)))) : null;
const noTplNote = _o44 && !_o1k ? h('p', { class: 'wiz-note', 'data-testid': 'wiz-no-template' }, 'Bên bán chưa cài link "Tạo bản sao" – tạo máy chủ bằng cách dán tay 3 tệp dưới đây (các nút Chép đã kiểm mã).') : null;
const runCheck = async () => {
ui.mountTo(resBox, ui.spinner(), ' Đang kiểm tra…');
const _o32 = await ctl.run(s.id, { ...argsFor(s.id), onProgress: (msg) => ui.mountTo(resBox, ui.spinner(), ' ' + msg) });
_o2o(resBox, _o32);
set(M.record(ctl.state, s.id, _o32));
if (s.id === 'engine' && _o32 && _o32.ok) _o3z({ type: 'engine_ok' });
return _o32;
};
const goNext = async () => {
if (s.check === 'info' && !M.isDone(ctl.state, s.id)) set(M.record(ctl.state, s.id, await ctl.run(s.id, {})));
if (!M.canNext(ctl.state)) { ui.toast(s.inline ? 'Dán vào ô ở trên – có ✅ rồi mới sang bước kế (hoặc bấm "Bỏ qua bước này").' : 'Bấm "' + _oi + '" – xanh rồi mới sang bước kế.', 'warn'); return; }
if (ctl.beforeNext && (await ctl.beforeNext(s.id)) === false) return;
set(M.next(ctl.state));
};
if (s.id === 'allow' && ctl.autoCheck && ((st.data || {}).url)) {
ctl.autoCheck = false;
setTimeout(async () => { const _o32 = await runCheck(); if (_o32 && _o32.ok) await goNext(); }, 0);
}
if (s.id === 'finish' && ctl.autoFinish) {
ctl.autoFinish = false;
setTimeout(async () => { const _o32 = await runCheck(); if (_o32 && _o32.ok && M.canNext(ctl.state)) await goNext(); }, 0);
}
const _o2d = (_o32) => {
ctl.last[s.id] = _o32; _o2o(resBox, _o32);
if (_o32 && _o32.ok) set(M.record(ctl.state, s.id, _o32)); else if (ctl.state.res[s.id] && ctl.state.res[s.id].s === 'ok') set(M.record(ctl.state, s.id, _o32)); else render();
};
ctl.__inline = _o2d;
const choice = s.choice ? _o13(st) : null;
const _on = choice === 'skip' && !M.isDone(st, s.id);
const _o2g = choice === 'online';
const _oi = s.id === 'finish' ? 'Kiểm tra toàn bộ' : 'Kiểm tra bước này';
const _o2l = !!(s.required && st.res[s.id] && st.res[s.id].s === 'later');
const _o10 = M.isDone(st, s.id) && !_o2l;
const _o3j = M.canSkip(s) && (s.id !== 'diachi' || _o2a) && !_o2g;
const _o3i = _o3j && (_on || _o2a || _o41) && !_o10;
const _o1v = s.id === 'account' && ctl.mode === 'pre';
const _o1t = s.check === 'info';
const _o16 = st.flow === 'personal' && s.phase === 'post' && !s.required && !_o10
? h('div', { class: 'wiz-fast', 'data-testid': 'wiz-fast-wrap' },
button('Vào dùng app ngay', () => {
try { ctl.autoFinish = true; set(M.skipOptional(ctl.state)); ui.toast('Đã để các bước tuỳ chọn lại – làm sau bằng nút Trợ lý cài đặt ở góc màn hình.', 'info', 5000); } catch (e) { ctl.autoFinish = false; ui.toast(e.message, 'warn'); }
}, { kind: 'ghost', icon: 'next', testid: 'wiz-fast' }),
h('p', { class: 'muted small' }, 'Các bước Telegram, mã dự phòng, địa chỉ riêng, AI đều không bắt buộc – làm sau lúc nào cũng được.'))
: null;
const foot = h('div', { class: 'wiz-foot' },
(() => {
const _o2x = M.back(st) !== st, toChooser = !_o2x && M.ids(st).indexOf(st.cur) <= 0 && _oh(st);
return button('Quay lại', () => (_o2x ? set(M.back(ctl.state)) : set(null)), {
kind: 'ghost', testid: 'wiz-back', icon: 'back', disabled: !_o2x && !toChooser,
title: !_o2x && !toChooser ? 'Đã tạo tài khoản – các bước cài máy chủ đã xong, không cần quay lại' : (toChooser ? 'Về màn chọn Cá nhân / Công ty' : ''),
});
})(),
_o1v || _o1t || (s.inline && !_o2l) ? null
: _on || _o2g ? null
: _o1g && !((st.data || {}).url) ? null
: _o31 ? null
: _o2q || _o1c ? null
: button(_oi, runCheck, { kind: _o10 || _o3i ? 'secondary' : 'primary', icon: 'pulse', testid: 'wiz-check' }),
_o3j ? button(s.required || _o41 ? (s.laterLabel || 'Làm sau') : 'Bỏ qua bước này', () => {
try {
let _o37 = ctl.state;
if (s.id === 'doingu') { _o37 = M.setData(_o37, { doingu: { ...((_o37.data || {}).doingu || {}), rows: [], sale: 0, manager: 0 } }); delete ctl.last.doingu; }
set(M.skip(_o37, s.id, s.required || _o41 ? 'later' : 'skip')); if (s.id === 'engine') _o3z({ type: 'skip', mode: (ctl.state.data || {}).engineMode || 'skip' }); if (!s.required && s.skipNote) ui.toast(s.skipNote, 'info', 5000); if (s.required && s.laterNote) ui.toast(s.laterNote, 'info', 7000); } catch (e) { ui.toast(e.message, 'warn'); }
}, { kind: _o3i ? 'primary' : 'ghost', testid: 'wiz-skip', icon: s.required || _o41 ? 'clock' : 'next' }) : null,
button(_o1w(st) ? 'Hoàn tất' : _o1t ? 'Tiếp tục' : 'Tiếp', goNext, { kind: _o10 || _o1t ? 'primary' : 'secondary', testid: 'wiz-next', icon: _o1w(st) ? 'check' : 'next', disabled: !_o1t && !M.canNext(st) }));
const _ox = s.id === 'domain' && st.flow !== 'company' && choice !== 'skip' ? _oz(st.data || {}, (p) => ctl.set(M.setData(ctl.state, p)), actions) : null;
const gSeg = gWay ? h('div', { class: 'wiz-box wiz-domain-mode', 'data-testid': 'wiz-allow-way' }, ui.segmented([
{ value: 'google', label: installDevice() ? 'Cài bằng Google (ngay trên điện thoại)' : 'Cài nhanh bằng Google', icon: 'key' }, { value: 'sheet', label: _o3f(), icon: 'monitor' }], gWay,
(v) => set(M.setData(ctl.state, { allowWay: v })), { label: 'Cách tạo máy chủ', name: 'wiz-allow-way' })) : null;
const body = choice === 'skip' ? null
: _o1c ? _o2u()
: _o2q ? [_o2r({ inStep: true }), _ou()]
: _o2g ? _o2f()
: _ox ? [_ox.body, _o3w]
: _o2a || _o31 ? [_o3r(), _o3w]
: _o1g ? [_o1h(st), _o3w]
: s.id === 'telegram' ? telegramBox(ctl, { ui, step: s, done: _o10, list: _o8, onResult: _o2d, patch: (p) => ctl.set(M.setData(ctl.state, p)) })
: [s.widgetLast || _o1s ? null : _o3r(), s.id === 'allow' && st.flow === 'company' ? _o2s('wiz-allow-help') : null, noTplNote, actions, manualBox, s.widgetLast && !_o1s ? _o3r() : null];
return h('section', { class: 'wiz-step', dataset: { step: s.id }, 'data-testid': 'wiz-step' },
h('h2', { class: 'wiz-h2', tabindex: '-1', 'data-testid': 'wiz-step-title' }, s.title, badge ? ' ' : null, badge),
_ox ? _ox.seg : null, gSeg,
choice ? _ok(s, choice) : null,
body, resBox,
s.required && st.res[s.id] && st.res[s.id].s === 'later' ? h('p', { class: 'wiz-warn', role: 'note', 'data-testid': 'wiz-owe' }, '⚠️ Bước bắt buộc – chưa xong (đã chọn "' + (s.laterLabel || 'Làm sau') + '"). Làm xong rồi bấm "Kiểm tra bước này".') : null,
h('div', { class: 'wiz-why', 'data-testid': 'wiz-intro' },
h('p', { class: 'wiz-headline' }, _o34(s.head)),
s.note && !_o31 ? h('p', { class: 'muted small' }, _o34(s.note)) : null,
!s.required && s.skipNote && choice !== 'skip' && !_o2g ? h('p', { class: 'muted small', 'data-testid': 'wiz-skip-note' }, h('strong', null, 'Bỏ qua thì sao? '), s.skipNote) : null),
_o2q || _o1c ? null : h('p', { class: 'wiz-meta', 'data-testid': 'wiz-meta' }, '⏱ ' + (_o1g && s.timeGoogle ? s.timeGoogle : s.time) + ' · ' + s.cost),
foot, _o16);
}
function _o3f() { return installDevice() ? 'Cài trên máy tính' : 'Cách thủ công (Tạo bản sao)'; }
function allowWay(st) {
if (!_o1e()) return '';
const w = (st.data || {}).allowWay;
return w === 'google' || w === 'sheet' ? w : 'google';
}
function _o1h(st) {
const _or = st.data || {};
const co = st.flow === 'company' ? ui.field({ label: 'Tôi đang dùng tài khoản Google CÔNG TY (không phải Gmail cá nhân của nhân viên)', hint: 'Đang thử trước bằng Gmail cá nhân: để trống ô này – vẫn đi tiếp được, biên bản ghi "chưa làm".', type: 'checkbox', value: !!_or.companyAccount, id: 'wiz-company-account',
onChange: (v) => ctl.set(M.setData(ctl.state, { companyAccount: !!v })) }) : null;
const done = _or.url && ctl.fromGoogle === _or.url;
return h('div', { class: 'wiz-gcai-wrap' },
st.flow === 'company' ? h('p', { class: 'wiz-warn', role: 'note' }, '⚠️ Nên dùng tài khoản Google Workspace do quản trị viên công ty giữ – dùng Gmail cá nhân để thử cũng được, nhưng trước khi dùng thật hãy chuyển sang tài khoản công ty để nhân viên nghỉ việc không mang dữ liệu đi.') : null,
co,
_or.url && !done ? h('p', { class: 'muted small', 'data-testid': 'wiz-gcai-url' }, 'Máy chủ: ', h('span', { class: 'mono' }, _or.url)) : null,
done ? h('p', { class: 'muted small', 'data-testid': 'wiz-from-google' }, 'Máy chủ vừa tạo bằng Google – trợ lý tự kiểm. Chưa đạt: làm theo "Cách sửa" bên dưới rồi bấm "Kiểm tra bước này".')
: gcaiWidget(ctl, { ui, onSwitch: () => set(M.setData(ctl.state, { allowWay: 'sheet' })), switchLabel: _o3f(),
onFull: () => { ui.toast(installDevice() ? 'Vừa hết chỗ ưu tiên "Cài bằng Google" – anh/chị cài trên máy tính nhé.' : 'Vừa hết chỗ ưu tiên "Cài bằng Google" – anh/chị dùng cách Tạo bản sao nhé.', 'warn', 6000); set(M.setData(ctl.state, { allowWay: 'sheet' })); },
onDone: ({ url }) => { ctl.autoCheck = true; ctl.fromGoogle = url; set(M.setData(ctl.state, { url, allowWay: 'google' })); } }));
}
function _o13(st) { const m = (st.data || {}).engineMode; return m === 'install' || m === 'online' ? m : 'skip'; }
function _om(v) {
let _o2c = M.setData(ctl.state, { engineMode: v });
if (v === 'online') _o2c = M.record(_o2c, 'engine', { ok: true, msg: ENGINE_ONLINE_MSG });
else if (_o2c.res.engine && _o2c.res.engine.msg === ENGINE_ONLINE_MSG) delete _o2c.res.engine;
set(_o2c);
_o3z({ type: 'choice', mode: v });
}
function _ok(s, choice) {
const _o1 = [['skip', 'off'], ['online', 'online'], ['install', 'machine']];
const seg = ui.segmented(_o1.map(([v, m]) => ({ value: v, label: VIDEO_MODE[m].label, icon: VIDEO_MODE[m].icon })), choice,
(v) => _om(v), { label: 'Anh/chị làm video thế nào?', name: 'wiz-engine-mode' });
seg.classList.add('wiz-vmode-seg');
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-engine-choice' },
h('p', null, h('strong', null, 'Anh/chị làm video thế nào?')), seg,
h('ul', { class: 'wiz-vmodes', 'data-testid': 'wiz-engine-modes' }, _o1.map(([v, m]) => h('li', { class: v === choice ? 'on' : '', dataset: { mode: v }, 'data-testid': 'wiz-engine-mode-' + m },
h('strong', null, VIDEO_MODE[m].label), ': ', VIDEO_MODE[m].cost))),
hwCheckPanel(ui, { choice, onPreselect: (v) => _om(v) }),
choice === 'skip' ? h('p', { class: 'wiz-note', 'data-testid': 'wiz-skip-note' }, '⏭ Bấm "Bỏ qua bước này": ', s.skipNote) : null);
}
function _o2f() {
return h('div', { class: 'wiz-box wiz-online', 'data-testid': 'wiz-engine-online' },
h('p', null, '✅ ', h('strong', null, 'Xong bước này – không cần cài gì trên máy.')),
h('ul', null,
h('li', null, 'Làm clip: Video & Ý tưởng › Video › soạn và duyệt kịch bản › bấm nút làm bằng AI.'),
h('li', null, VIDEO_MODE.online.cost),
h('li', null, 'Bảng giá và khoá nhà cung cấp (Veo, Runway, Kling) nhập ở Video AI › Cài đặt.'),
h('li', null, 'Muốn làm video bản đồ/quy hoạch sau: cài máy dựng rồi chọn "Dựng trên máy" ở Cài đặt › Gói chức năng › Video.')));
}
function _o3z(detail) { try { window.dispatchEvent(new CustomEvent(VIDEO_EVENT, { detail })); } catch { } }
function _o1w(st) { const list = M.ids(st); return list.indexOf(st.cur) === list.length - 1 || !list.slice(list.indexOf(st.cur) + 1).some((id) => !M.isDone(st, id)); }
function _o9(_o3, i, { widget: widgetEl = null } = {}) {
const imgs = ctl.images ? ctl.images(_o3) : [];
const _od = actionBlocks(_o3, imgs, { portal: !!ctl.portal });
const _o27 = _od.filter((b) => b.kind === 'img').length;
const _o2b = (b) => {
switch (b.kind) {
case 'text': return h('p', null, boldParts(_o3e(b.text)).map((_o46) => (_o46.b ? h('strong', null, _o46.t) : _o46.t)));
case 'why': return h('p', { class: 'wiz-why-note small', 'data-testid': 'wiz-why-note' }, b.text);
case 'link': {
const url = ctl.link(b.key);
return url ? h('a', { class: b.key === 'template' ? 'btn btn-primary wiz-link-main' : 'btn btn-secondary btn-sm', href: url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'wiz-link-' + b.key }, ui.icon(b.key === 'template' ? 'copy' : 'link', 18), h('span', null, _o20(b.key))) : null;
}
case 'installer': return ctl.installer ? _o1u(b.key) : null;
case 'widget': return widgetEl;
case 'caption': return h('p', { class: 'wiz-cap small', 'data-testid': 'wiz-cap' }, b.text);
case 'img': return h('figure', { class: 'wiz-fig' },
h('a', { href: b.src, target: '_blank', rel: 'noopener', class: 'wiz-shot-link', title: 'Mở ảnh cỡ lớn' },
h('img', { src: b.src, alt: b.alt || ('Ảnh hướng dẫn bước ' + (i + 1) + (_o27 > 1 ? ' (' + (b.img + 1) + '/' + _o27 + ')' : '')), loading: 'lazy', class: 'wiz-shot', width: b.w, height: b.h })));
case 'sub': return h('ol', { class: 'wiz-actions wiz-sub', 'data-testid': 'wiz-sub' }, b.items.map((_o46, k) => _o9(_o46, k)));
default: return null;
}
};
return h('li', { class: ['wiz-act', _o3.alt && 'wiz-alt'], 'data-testid': _o3.alt ? 'wiz-alt' : null }, _od.map(_o2b));
}
function _o1u(kind) {
const P = ctl.installer.paths, path = P[kind], fname = path.split('/').pop();
const _o45 = { tatca: 'tệp Mã.gs/Code.gs (đổi tên TatCa)', caidat: 'tệp CaiDat', manifest: 'appsscript.json' }[kind] || fname;
const _o3a = h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'wiz-inst-say-' + kind });
const _o3q = (msg, code, bad) => { _o3a.textContent = msg; _o3a.className = bad === 'warn' ? 'small wiz-warn' : bad ? 'small form-err' : 'small'; _o3a.dataset.code = code; };
const note = (_o32) => (_o32.warn ? ' ⚠️ ' + _o32.warn + '.' : '');
const get = async () => {
_o3q('Đang kiểm chữ ký số của ' + fname + '…', 'WAIT', false);
const _o32 = await ctl.installer.load();
if (!_o32.ok) { _o3q(_o32.message, _o32.code, true); return null; }
return _o32;
};
const copy = button('Chép ' + fname, async () => {
const _o32 = await get(); if (!_o32) return;
const f = _o32.files[path];
const _o1p = await copyText(f.text);
if (_o1p === 'copied') _o3q('Đã chép ' + fname + ' (' + (_o32.signed ? 'đã kiểm chữ ký: đúng bản phát hành' : 'đã kiểm mã sha256: tệp đủ, không hỏng') + ', sha256 ' + f.sha256.slice(0, 12) + '…). Dán vào ' + _o45 + ': Ctrl+A → Ctrl+V → Lưu.' + note(_o32), _o32.signed ? 'OK' : 'OK_UNSIGNED', _o32.signed ? false : 'warn');
else _o3q('Trình duyệt chưa cho chép tự động – bấm nút lần nữa, hoặc bấm "Tải tệp" rồi mở tệp, chọn hết và chép.', 'NO_CLIPBOARD', true);
}, { kind: 'secondary', small: true, testid: 'wiz-inst-copy-' + kind, icon: 'content' });
const _ow = h('a', { class: 'btn btn-ghost btn-sm', href: path, download: fname, rel: 'noopener', 'data-testid': 'wiz-inst-dl-' + kind }, ui.icon('disk', 18), h('span', null, 'Tải tệp ' + fname));
_ow.addEventListener('click', async (ev) => {
ev.preventDefault();
const _o32 = await get(); if (!_o32) return;
try {
const _o3x = URL.createObjectURL(new Blob([_o32.files[path].text], { type: /\.json$/.test(fname) ? 'application/json;charset=utf-8' : 'text/plain;charset=utf-8' }));
const _o3s = h('a', { href: _o3x, download: fname, hidden: true });
document.body.appendChild(_o3s); _o3s.click(); _o3s.remove();
setTimeout(() => URL.revokeObjectURL(_o3x), 30000);
_o3q('Đã ' + (_o32.signed ? 'kiểm chữ ký' : 'kiểm mã sha256') + ' và tải ' + fname + ' – mở tệp, chọn hết (Ctrl+A), chép rồi dán vào ' + _o45 + '.' + note(_o32), _o32.signed ? 'OK' : 'OK_UNSIGNED', _o32.signed ? false : 'warn');
} catch { _o3q('Chưa lưu được tệp – thử trình duyệt khác.', 'SAVE', true); }
});
ctl.installer.load();
return h('div', { class: 'wiz-inst', 'data-testid': 'wiz-inst-' + kind }, h('div', { class: 'btn-row' }, copy, _ow), _o3a);
}
function _o20(k) { return { template: 'Tạo bản sao', sheetsNew: 'Mở sheets.new', aistudio: 'Mở aistudio.google.com', telegramDownload: 'Tải Telegram', engineZip: 'Tải bộ cài máy dựng (' + engineDownload().primary.label + ')', engineZipOther: 'Máy ' + engineDownload().other.label + '? Tải bộ cài cho ' + engineDownload().other.label }[k] || 'Mở trang'; }
function argsFor(id) { return id === 'allow' ? { url: (ctl.state.data || {}).url || '' } : {}; }
function _o2o(box, _o32) {
if (!_o32) { ui.clear(box); box.className = 'wiz-result'; return; }
box.className = 'wiz-result ' + (_o32.ok ? 'is-ok' : 'is-bad');
ui.mountTo(box,
h('p', { class: 'wiz-res-main' }, _o32.ok ? (_o32.bad ? '⚠️ ' : '✅ ') : _o32.wait ? '⏳ ' : '❌ ', _o32.ok ? (_o32.msg || 'Đạt') : (_o32.cause || _o32.msg || 'Chưa đạt')),
!_o32.ok && _o32.fix ? h('p', { class: 'wiz-fix', 'data-testid': 'wiz-fix' }, h('strong', null, 'Cách sửa: '), _o32.fix) : null,
!_o32.ok && _o32.img ? _o17(_o32.img, !!_o32.fix) : null,
!_o32.ok && _o32.tech && (_o32.tech.ref || _o32.tech.reason) ? h('details', { class: 'wiz-tech', 'data-testid': 'wiz-tech' }, h('summary', { class: 'small' }, 'Chi tiết kỹ thuật'),
h('p', { class: 'small mono' }, [_o32.tech.ref && 'Mã lỗi: ' + _o32.tech.ref, _o32.tech.reason && 'Lý do: ' + _o32.tech.reason].filter(Boolean).join(' · '))) : null,
!_o32.ok && typeof _o32.url === 'string' && /^https:\/\//.test(_o32.url) ? h('div', { class: 'btn-row' }, h('a', { class: 'btn btn-secondary', href: _o32.url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'wiz-fix-link' }, h('span', null, _o32.url_label || 'Mở trang'))) : null,
_o32.warn ? h('p', { class: 'wiz-warn' }, '⚠️ ', _o32.warn) : null,
Array.isArray(_o32.items) && _o32.items.length ? h('ul', { class: 'wiz-items', 'data-testid': 'wiz-items' }, _o32.items.map((_o46) => h('li', { class: _o46.skipped ? 'is-skip' : _o46.ok === false ? 'is-bad' : _o46.pending ? 'is-owe' : '', dataset: { item: _o46.id || '' } },
_o46.skipped ? '⏭ ' : _o46.ok === true ? '✅ ' : _o46.ok === false ? '❌ ' : '⚠️ ', h('strong', null, _o46.label), _o46.skipped ? ' – Bỏ qua – không bắt buộc' : _o46.detail ? ' – ' + _o46.detail : '', _o46.ok === false && _o46.fix ? h('div', { class: 'muted small' }, 'Cách sửa: ' + _o46.fix) : null,
_o46.pending && _o46.step ? h('div', { class: 'btn-row' }, button('Làm bước ' + _o46.label, () => _o1f(_o46.step), { kind: 'secondary', small: true, icon: 'next', testid: 'wiz-owe-go-' + _o46.step })) : null))) : null);
}
function _o1f(id) { const _o42 = _o33; _o33 = true; try { set(M.goTo(ctl.state, id)); } catch (e) { _o33 = _o42; ui.toast(e.message, 'warn'); } }
function _o17(key, hasFix = false) {
const _o46 = ctl.guideImage ? ctl.guideImage(key) : null;
if (!_o46) return null;
return h('figure', { class: 'wiz-fig', 'data-testid': 'wiz-fix-img' },
_o46.caption && !hasFix ? h('figcaption', { class: 'wiz-cap small' }, _o46.caption) : null,
h('a', { href: _o46.src, target: '_blank', rel: 'noopener', class: 'wiz-shot-link', title: 'Mở ảnh cỡ lớn' }, h('img', { src: _o46.src, alt: _o46.alt || 'Ảnh minh hoạ cách sửa', loading: 'lazy', class: 'wiz-shot', width: _o46.w, height: _o46.h })));
}
function _ou() {
if (!(ctl.sale && ctl.demo && ctl.mode === 'pre') || ctl.portal) return null;
return h('div', { class: 'wiz-demo', 'data-testid': 'wiz-demo-note' },
h('p', null, h('strong', null, 'Chỉ muốn xem app trước? '), '"Xem thử" chạy một máy chủ giả ngay trong trình duyệt này – CHƯA PHẢI cài thật: ',
'dữ liệu nhập lúc Xem thử chỉ nằm trong trình duyệt này và sẽ không chuyển sang máy chủ thật. 2 bước cài máy chủ sẽ ghi "bỏ qua".'),
button('Xem thử trước (chưa cài thật)', async () => {
const ok = await ui.confirm('Xem thử app bằng máy chủ giả trong trình duyệt? App sẽ ghi "' + NOT_REAL_TEXT + '" cho tới khi anh/chị cài và nối máy chủ thật (Cài đặt › Kết nối). Không nhập khách thật lúc Xem thử.', { ok: 'Xem thử', title: 'Xem thử – chưa cài thật' });
if (ok) { if (ctl.api && !ctl.evProbe) _o7(); set(M.skipDemo(ctl.state)); }
}, { kind: 'ghost', small: true, testid: 'wiz-demo-skip', icon: 'layout' }));
}
function _o7() {
if (ctl.evNeed === undefined && ctl.api && !ctl.evProbe) {
ctl.evProbe = ctl.api.call('status').then((_o32) => { const _o28 = !(_o32 && _o32.setup === false && !_o32.email_verify), _o42 = ctl.evNeed !== false; ctl.evNeed = _o28; if (_o42 !== _o28) render(); })
.catch(() => { ctl.evNeed = true; });
}
return ctl.evNeed !== false;
}
function _o15(ev) {
try {
if (ev && ev.verified) sessionStorage.setItem('bds:setup_email', JSON.stringify({ email: ev.email, code: ev.code || '', use_account_email: !!ev.use_account_email, at: ev.at || Date.now() }));
} catch { }
}
function _o5(label = 'Đặt tên đăng nhập và mật khẩu') {
return button(label, () => {
const em = String((ctl.state.data || {}).email || '').trim();
if (_o7() && !(ctl.ev && ctl.ev.verified)) { ui.toast('Bấm "Gửi mã", nhập mã 6 số trong email – xác nhận xong mới tạo tài khoản được.', 'warn'); return; }
if (!_o7() && em && !EMAIL_RE.test(em)) { ui.toast('Email chưa đúng (cần đủ dạng tên, chữ @, tên miền) – sửa lại hoặc để trống.', 'warn'); return; }
if (_o7()) _o15(ctl.ev);
ctl.onAccount();
}, { kind: 'primary', testid: 'wiz-account', icon: 'user' });
}
function _o6(_or, patch) {
const ev = ctl.ev;
if (ev && ev.verified) {
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-account-box' },
h('p', { class: 'ev-ok', 'data-testid': 'wiz-ev-done' }, '✅ ' + (ev.use_account_email ? 'Dùng email tài khoản Google: ' : 'Email đã xác nhận: ') + ev.email),
h('div', { class: 'btn-row' }, _o5()),
h('p', { class: 'muted small' }, 'Màn kế: đặt tên đăng nhập và mật khẩu (từ 8 ký tự). Tạo xong, app tự quay lại trợ lý.'),
button('Dùng email khác', () => { ctl.ev = null; render(); }, { kind: 'ghost', small: true, testid: 'wiz-ev-change' }));
}
const box = emailCodeBox({
ui, api: ctl.api, testid: 'wiz-ev', email: _or.email || '', persistKey: 'bds:wizard:ev',
label: 'Email của anh/chị', hint: 'Mã 6 số gửi về email này – dùng để lấy lại mật khẩu khi quên.',
send: (em) => ctl.api.call('email.verify_start', { email: em, purpose: 'setup' }),
verify: (em, code) => ctl.api.call('email.verify_check', { email: em, code }),
allowAccountEmail: true,
onVerified: (v) => { ctl.ev = { email: v.email, code: v.code, verified: true, use_account_email: !!v.use_account_email, at: Date.now() }; patch({ email: v.email }); render(); }
});
const send = box.querySelector('[data-testid="wiz-ev-send"]');
if (send) { send.classList.remove('btn-secondary', 'btn-sm'); send.classList.add('btn-primary'); }
const _o29 = h('details', { class: 'wiz-nomail small', 'data-testid': 'wiz-ev-nomail', hidden: true },
h('summary', null, 'Không thấy thư?'),
h('ul', null, h('li', null, 'Xem mục Thư rác/Spam và Quảng cáo.'), h('li', null, 'Chờ 60 giây rồi bấm "Gửi lại mã".'),
h('li', null, 'Gõ sai email? Sửa ô email ở trên rồi bấm "Gửi mã" lại.'),
h('li', null, 'Máy chủ báo không gửi được thư: bấm "Dùng email …" (email tài khoản Google đang chạy máy chủ) nếu đó là email của anh/chị.')));
const _o3g = () => {
const _o3d = box.dataset.state === 'sent';
_o29.hidden = !_o3d;
const _o1t = box.querySelector('[data-testid="wiz-ev-info"]');
if (_o3d && _o1t && /^Đã gửi mã 6 số tới /.test(_o1t.textContent) && !_o1t.dataset.short) {
const _o3t = _o1t.textContent.replace(/^Đã gửi mã 6 số tới /, '').split('. ')[0];
_o1t.textContent = '📩 Đã gửi mã 6 số tới ' + _o3t + ' – mở hộp thư, gõ mã vào ô dưới (dùng được 15 phút).'; _o1t.dataset.short = '1';
} else if (!_o3d && _o1t) delete _o1t.dataset.short;
};
if (typeof MutationObserver !== 'undefined') new MutationObserver(_o3g).observe(box, { attributes: true, attributeFilter: ['data-state'], subtree: true, childList: true, characterData: true });
_o3g();
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-account-box' }, box, _o29);
}
function _ob() {
if (ctl.portal) {
return h('div', { class: 'wiz-note wiz-app-origin', 'data-testid': 'wiz-app-origin-portal' },
h('p', null, h('strong', null, 'Hộp trong Sheet hỏi "địa chỉ app riêng"?'), ' Bỏ trống ô đó – app riêng của anh/chị chưa có, sẽ được tạo ở bước "Địa chỉ app" ngay sau.'),
h('p', { class: 'muted small' }, 'Trong hộp của Sheet, bấm "Chép URL" rồi dán vào ô "Địa chỉ máy chủ (kết thúc bằng /exec)" bên dưới.'));
}
let origin = '';
try { origin = location.origin || ''; } catch { origin = ''; }
if (!/^https?:\/\//.test(origin)) return null;
const _o3a = h('span', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'wiz-app-origin-say' });
return h('div', { class: 'wiz-note wiz-app-origin', 'data-testid': 'wiz-app-origin' },
h('p', null, 'Địa chỉ app của anh/chị: ', h('strong', { class: 'mono', 'data-testid': 'wiz-app-origin-url' }, origin)),
h('div', { class: 'btn-row' }, button('Chép địa chỉ app', async () => { const _o1p = await copyText(origin); _o3a.textContent = _o1p === 'copied' ? 'Đã chép.' : 'Chưa chép tự động được – chọn dòng trên rồi chép.'; },
{ kind: 'secondary', small: true, icon: 'copy', testid: 'wiz-app-origin-copy' }), _o3a),
h('p', { class: 'muted small' }, 'Hộp trong Sheet hỏi "địa chỉ app riêng"? Dán địa chỉ này vào đó (lần sau Sheet có nút mở app tự nối).'));
}
function widget(s, st) {
const _or = st.data || {};
const patch = (p) => ctl.set(M.setData(ctl.state, p));
switch (s.id) {
case 'prepare': return h('div', { class: 'wiz-box wiz-tip', role: 'note', 'data-testid': 'wiz-prepare-tip' }, h('p', null, '💡 ', s.tip));
case 'company': {
const _oe = _or.company || {};
const _o39 = (p) => patch({ company: { ...((ctl.state.data || {}).company || {}), ...p } });
const name = ui.field({ label: 'Tên công ty', value: _oe.name || '', id: 'wiz-co-name', autocomplete: 'organization', onInput: (v) => _o39({ name: String(v || '').trim() }) });
const tax = ui.field({ label: 'Mã số thuế', value: _oe.tax || '', id: 'wiz-co-tax', inputmode: 'numeric', hint: '10 số; chi nhánh: 10 số-3 số', onInput: (v) => _o39({ tax: String(v || '').replace(/\s+/g, '') }) });
const _o2w = h('img', { class: 'wiz-logo', alt: 'Logo công ty', src: _oe.logo || '', hidden: !_oe.logo, 'data-testid': 'wiz-logo-preview' });
const logo = ui.field({ label: 'Logo (PNG/JPG)', type: 'file', accept: 'image/png,image/jpeg,image/webp,image/svg+xml', id: 'wiz-co-logo',
onChange: async (files) => {
const f = files && files[0]; if (!f) return;
try { const url = await shrinkLogo(f); _o39({ logo: url }); _o2w.src = url; _o2w.hidden = false; } catch (e) { ui.toast('Không đọc được ảnh logo: ' + (e.message || e), 'warn'); }
} });
return h('div', { class: 'wiz-box grid-2' }, name, tax, h('div', null, logo, _o2w));
}
case 'allow': {
const co = st.flow === 'company' ? ui.field({ label: 'Tôi đang dùng tài khoản Google CÔNG TY (không phải Gmail cá nhân của nhân viên)', hint: 'Đang thử trước bằng Gmail cá nhân: để trống ô này – vẫn đi tiếp được, biên bản ghi "chưa làm".', type: 'checkbox', value: !!_or.companyAccount, id: 'wiz-company-account', onChange: (v) => patch({ companyAccount: !!v }) }) : null;
const url = ui.field({ label: URL_FIELD_LABEL, value: _or.url || '', id: 'wiz-url', inputmode: 'url', autocomplete: 'off', placeholder: 'https://script.google.com/macros/s/…/exec',
hint: _o3e('Dán địa chỉ vừa bấm "Chép URL" trong hộp của Sheet (Ctrl+V). Bấm "Mở BDS Studio và kết nối" trong Sheet thì app tự điền.'),
onInput: (v) => { const _o46 = String(v || '').trim(); if (_o46 && ctl.linkProblem) ctl.linkProblem = null; patch({ url: _o46 }); } });
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-url-box' },
_o1z(),
ctl.fromLink && _or.url === ctl.fromLink ? h('p', { class: 'muted small', 'data-testid': 'wiz-from-link' }, _o3e('Địa chỉ máy chủ nhận từ nút "Mở BDS Studio và kết nối" trong Sheet') + ' – trợ lý tự kiểm. Chưa đạt: làm theo "Cách sửa" bên dưới rồi bấm "Kiểm tra bước này".') : null,
url, co, _ob(),
ctl.demo && !ctl.sale ? h('p', { class: 'muted small', 'data-testid': 'wiz-demo-note' }, 'Đang xem thử: để trống ô và bấm "Kiểm tra bước này" để dùng máy chủ xem thử ngay trong trình duyệt.') : null,
_ou());
}
case 'account': {
if (ctl.mode !== 'pre') return null;
const _o30 = privacyLine(h, { testid: 'wiz-privacy', lead: 'Tạo tài khoản là anh/chị đã đọc ', cfg: ctl.config || undefined });
if (_o7()) { const w = _o6(_or, patch); if (_o30 && w) w.appendChild(_o30); return w; }
const err = h('p', { class: 'small form-err', 'aria-live': 'polite', 'data-testid': 'wiz-email-err' });
const em = ui.field({ label: 'Email nhận mã khi quên mật khẩu (tuỳ chọn)', type: 'email', value: _or.email || '', id: 'wiz-email', inputmode: 'email', autocomplete: 'email', placeholder: 'email của anh/chị',
hint: 'Bỏ trống: mã đặt lại mật khẩu gửi về email của tài khoản Google đã cài máy chủ.',
onInput: (v) => { const _o46 = String(v || '').trim(); patch({ email: _o46 }); err.textContent = _o46 && !EMAIL_RE.test(_o46) ? 'Email chưa đúng (cần đủ dạng tên, chữ @, tên miền).' : ''; } });
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-account-box' }, em, err,
h('div', { class: 'btn-row' }, _o5('Tạo tài khoản')), h('p', { class: 'muted small' }, 'Tạo xong, app tự quay lại trợ lý.'), _o30);
}
case 'backup':
case 'tfa': {
const box = h('div', { class: 'wiz-box', 'data-testid': 'wiz-tfa-box' });
if (ctl.renderTfa) ctl.renderTfa(box); else box.append(button('Mở Cài đặt › Bảo mật', () => ctl.goSettings('security'), { kind: 'secondary', small: true }));
return box;
}
case 'domain': return st.flow === 'company' ? companyDomainWidget(ctl, { ui, rerender: render }) : _oz(_or, patch).body;
case 'ai': return ctl.api ? geminiBox(ctl, { ui, onResult: (_o32) => ctl.__inline(_o32) }) : null;
case 'diachi': return diachiWidget(ctl, { ui, rerender: render });
case 'doingu': return ctl.mode === 'pre' ? null : doinguWidget(ctl, { ui, rerender: render });
case 'engine': return _o14();
case 'finish': return h('div', { class: 'wiz-box' }, _o38(st));
case 'handover': return _o1j(_or, patch);
default: return null;
}
}
function _oz(_or, patch, howTo = null) {
const mode = (_or.domain && _or.domain.mode) || (ctl.state.flow === 'company' ? 'custom' : 'shared');
const _os = (ctl.defaultAddress && ctl.defaultAddress()) || { own: true, text: 'Địa chỉ mặc định: ' + (ctl.sharedHost || 'địa chỉ đang mở') + ' – bản app riêng của anh/chị, dữ liệu nằm trong Google của anh/chị, không dùng chung với ai.' };
const host = ui.field({ label: 'Tên miền riêng', value: (_or.domain && _or.domain.host) || '', id: 'wiz-domain-host', placeholder: 'app.congty.vn', inputmode: 'url', autocomplete: 'off',
onInput: (v) => { patch({ domain: { mode: 'custom', host: String(v || '').trim() } }); _o2n(); } });
const _oo = h('div', { class: 'wiz-cname', 'data-testid': 'wiz-cname' });
const _oq = h('div', { class: 'wiz-custom', hidden: mode !== 'custom', 'data-testid': 'wiz-domain-custom' }, howTo, host, _oo);
const shared = h('div', { hidden: mode === 'custom', 'data-testid': 'wiz-domain-shared' },
h('p', { class: _os.own ? 'muted small' : 'wiz-note', 'data-testid': 'wiz-domain-default' }, _os.own ? _os.text : '⏳ ' + _os.text),
_os.own ? null : wishBox(ctl, ui, { company: false, showDefer: false }));
const seg = ui.segmented([{ value: 'shared', label: 'Địa chỉ mặc định (miễn phí)', icon: 'home' }, { value: 'custom', label: 'Tên miền riêng', icon: 'link' }], mode, (v) => {
patch({ domain: { ...((ctl.state.data || {}).domain || {}), mode: v } }); _oq.hidden = v !== 'custom'; shared.hidden = v === 'custom';
render();
}, { label: 'Địa chỉ mở app', name: 'wiz-domain-mode' });
if (!(_or.domain && _or.domain.mode)) patch({ domain: { ...(_or.domain || {}), mode } });
function _o2n() {
const _o1r = normHost(host.getValue());
const _o3n = _o1r ? _o1r.split('.')[0] : 'app';
const target = (ctl.cnameTarget && ctl.cnameTarget()) || '';
ui.mountTo(_oo, ui.table([{ k: 'Loại (Type)', v: 'CNAME – dòng trỏ tên miền con sang địa chỉ của app' }, { k: 'Tên (Name/Host)', v: _o3n },
{ k: 'Trỏ tới (Target/Value)', v: target || '(bên bán gửi qua email – xem dưới)' }, { k: 'TTL (thời gian lưu tạm)', v: 'Tự động (Auto)' }],
[{ label: 'Ô cần điền', key: 'k' }, { label: 'Giá trị', key: 'v' }]),
h('p', { class: 'muted small' }, 'Thêm xong có thể mất 5 phút đến 24 giờ mới chạy. Chưa chạy thì bấm "Làm sau", trợ lý nhắc lại.'));
}
_o2n();
let _o3b = {}; try { _o3b = supportContact(ctl.config) || {}; } catch { _o3b = {}; }
const em = _o3b.email || supportEmail(ctl.config);
const _o1x = !!(ctl.cnameTarget && ctl.cnameTarget());
const _op = h('p', { class: 'wiz-note', 'data-testid': 'wiz-domain-contact' },
'Tên miền riêng được gắn vào app riêng của anh/chị ở phía bên bán. Gửi email tới ', h('a', { href: 'mailto:' + em + '?subject=' + encodeURIComponent('Gắn tên miền riêng cho BDS Studio'), 'data-testid': 'wiz-domain-mail' }, em),
_o3b.zalo ? ' (hoặc Zalo ' + _o3b.zalo + ')' : '',
_o1x ? ' kèm tên miền muốn dùng (vd app.tencuaban.vn) sau khi thêm bản ghi CNAME như bảng trên: bên bán gắn tên miền vào app và báo khi xong.'
: ' kèm tên miền muốn dùng (vd app.tencuaban.vn): bên bán gửi lại giá trị "Trỏ tới" của bản ghi CNAME và báo khi đã gắn xong.');
_oq.append(_op);
return { seg: h('div', { class: 'wiz-box wiz-domain-mode', 'data-testid': 'wiz-domain-toggle' }, seg), body: h('div', { class: 'wiz-box', 'data-testid': 'wiz-domain' }, shared, _oq) };
}
function _o14() {
const panel = h('div', { class: 'wiz-os-panel', 'data-testid': 'wiz-engine-os', 'aria-live': 'polite' });
const _o2m = (os) => {
panel.dataset.os = os;
ui.mountTo(panel, h('h4', { class: 'wiz-h3' }, os === 'win' ? 'Windows 10/11' : 'Mac (chip Apple hoặc Intel)'),
h('ol', { class: 'wiz-os-steps', 'data-testid': 'wiz-engine-steps-' + os }, ENGINE_GUIDE[os].map((t) => h('li', null, t))));
};
const os = detectOs();
const seg = ui.segmented([{ value: 'mac', label: 'Mac' }, { value: 'win', label: 'Windows' }], os, (v) => _o2m(v), { label: 'Máy tính cài máy dựng', name: 'wiz-engine-os' });
_o2m(os);
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-engine' }, seg, panel,
h('p', { class: 'wiz-note', 'data-testid': 'wiz-engine-tier' }, ENGINE_GUIDE.tier),
h('p', { class: 'muted small', 'data-testid': 'wiz-engine-full' }, ENGINE_GUIDE.full));
}
function _o38(st) {
const box = h('div', { class: 'wiz-samples', 'data-testid': 'wiz-samples' }, ui.spinner());
if (!ctl.samples) { box.remove(); return null; }
_o2p(box, st);
return box;
}
async function _o2p(box, st) {
let _o26 = 0;
try { _o26 = await ctl.samples.count(); } catch { _o26 = 0; }
const load = button('Xem ví dụ', async () => { const _o32 = await ctl.samples.load(); ui.toast('Đã nạp ví dụ: ' + (_o32.projects ? _o32.projects + ' dự án, ' : '') + _o32.customers + ' khách (tên có chữ "Mẫu").', 'ok', 5000); _o2p(box, ctl.state); }, { kind: 'secondary', small: true, testid: 'wiz-samples-load' });
const clear = button('Xoá toàn bộ dữ liệu mẫu', async () => {
if (!(await ui.confirm('Xoá toàn bộ dữ liệu mẫu (dự án, khách, nhắc việc có chữ "Mẫu")? Dữ liệu anh/chị tự nhập không bị đụng tới.', { ok: 'Xoá dữ liệu mẫu', kind: 'danger' }))) return;
const k = await ctl.samples.clear(); ui.toast('Đã xoá ' + k + ' mục dữ liệu mẫu.', 'ok'); _o2p(box, ctl.state);
}, { kind: 'danger', small: true, testid: 'wiz-samples-clear' });
ui.mountTo(box,
h('h4', { class: 'section-title' }, 'Dữ liệu mẫu'),
_o26 ? h('p', { 'data-testid': 'wiz-samples-count' }, 'Đang có ' + _o26 + ' mục dữ liệu mẫu (tên có chữ "Mẫu") để anh/chị xem chỗ nào nhập gì. Ảnh trong dữ liệu mẫu là ảnh minh hoạ.')
: h('p', { class: 'muted small', 'data-testid': 'wiz-samples-count' }, st && st.flow === 'company' ? 'Bản công ty bắt đầu sạch, không có dữ liệu mẫu. Muốn xem ví dụ chỗ nào nhập gì thì bấm "Xem ví dụ" (xoá được 1 chạm).' : 'Không còn dữ liệu mẫu.'),
h('div', { class: 'btn-row' }, _o26 ? clear : load));
}
function _o1j(_or, patch) {
const box = h('div', { class: 'wiz-box' }, ui.spinner());
ctl.handover().then((data) => {
const doc = _o1i(data);
const signed = ui.field({ label: 'Đã in và hai bên đã ký', type: 'checkbox', value: !!_or.handoverSigned, id: 'wiz-handover-signed', onChange: (v) => patch({ handoverSigned: !!v, handoverAt: v ? Date.now() : 0 }) });
ui.mountTo(box, doc,
h('div', { class: 'btn-row' },
button('In / Lưu PDF', () => _o2y(doc), { kind: 'primary', small: true, testid: 'wiz-handover-print' }),
button('Tải tệp chữ', () => download('bien-ban-ban-giao-bds-studio.txt', handoverText(data)), { kind: 'secondary', small: true, testid: 'wiz-handover-download' })),
signed);
}).catch((e) => ui.mountTo(box, h('p', { class: 'form-err' }, 'Không tạo được biên bản: ' + (e.message || e))));
return box;
}
function _o1i(_or) {
const _o35 = (k, v) => h('tr', null, h('th', null, k), h('td', null, v || '…'));
return h('article', { class: 'wiz-doc', 'data-testid': 'wiz-handover' },
h('header', { class: 'wiz-doc-head' }, _or.company.logo ? h('img', { src: _or.company.logo, alt: '', class: 'wiz-doc-logo' }) : null,
h('div', null, h('h3', null, 'BIÊN BẢN BÀN GIAO CÀI ĐẶT BDS STUDIO'), h('p', null, 'Ngày ' + _or.date))),
h('table', { class: 'wiz-doc-kv' }, h('tbody', null,
_o35('Bên nhận', _or.company.name), _o35('Mã số thuế', _or.company.tax),
_o35('Tài khoản Quản trị (Admin)', _or.owner.username ? '@' + _or.owner.username + (_or.owner.full_name ? ' (' + _or.owner.full_name + ')' : '') : ''),
_o35('Địa chỉ mở app', _or.domain),
_o35('Phiên bản', 'web ' + (_or.versions.web || '?') + ' · máy chủ ' + (_or.versions.server || '?') + (_or.versions.engine ? ' · máy dựng ' + _or.versions.engine : '')),
_o35('Kiểm tra toàn bộ', _or.check ? _or.check.text : 'chưa chạy'),
_or.license ? _o35('Bản quyền', _or.license) : null)),
h('h4', null, 'Người dùng (' + _or.users.length + ')'),
_or.users.length ? h('ul', null, _or.users.map((_o3x) => h('li', null, '@' + _o3x.username + ' · ' + (_o3x.full_name || '') + ' · ' + (_o3x.role_label || roleVi(_o3x.role)) + ' · 2 lớp: ' + _o3x.tfa))) : h('p', null, '—'),
h('h4', null, 'Các bước đã làm'),
h('ul', { class: 'wiz-doc-steps' }, _or.steps.map((s) => h('li', null, (_o2[s.status] || '▫️') + ' ' + s.title + (s.msg ? ' – ' + s.msg : '')))),
_or.pending.length ? h('p', null, h('strong', null, 'Còn để sau: '), _or.pending.join('; ')) : null,
_or.notDone && _or.notDone.length ? h('p', { 'data-testid': 'wiz-doc-notdone' }, h('strong', null, 'Chưa làm (cần trước khi dùng thật): '), _or.notDone.join('; ')) : null,
h('ul', { class: 'wiz-doc-notes' }, _or.notes.map((_o26) => h('li', null, _o26))),
h('div', { class: 'wiz-doc-sign' }, h('div', null, h('strong', null, 'BÊN CÀI ĐẶT'), h('span', null, '(ký, ghi rõ họ tên)')), h('div', null, h('strong', null, 'BÊN NHẬN'), h('span', null, '(ký, ghi rõ họ tên, đóng dấu)'))));
}
function _o2y(doc) {
const _oc = h('div', { id: 'wiz-print-area' }, doc.cloneNode(true));
document.body.appendChild(_oc);
document.body.classList.add('wiz-printing');
const done = () => { document.body.classList.remove('wiz-printing'); _oc.remove(); window.removeEventListener('afterprint', done); };
window.addEventListener('afterprint', done);
try { window.print(); } finally { setTimeout(done, 1500); }
}
function _o1o(st) {
try {
return finishCard(ui, { appUrl: appUrlFor({ portal: !!ctl.portal, state: st }), portal: !!ctl.portal, testid: 'wiz-a2hs',
start: _o4, onState: (k) => { _o4 = k; } });
} catch { return null; }
}
function _o11(st) {
const p = M.progress(st);
const later = M.steps(st).filter((s) => st.res[s.id] && st.res[s.id].s !== 'ok');
if (M.isDemo(st) && ctl.demo) {
return h('div', { class: 'wiz-done wiz-done-demo', 'data-testid': 'wiz-done' },
h('div', { class: 'wiz-done-ico', 'aria-hidden': 'true' }, '⚠️'),
h('h2', { class: 'wiz-h2', tabindex: '-1', 'data-testid': 'wiz-step-title' }, 'Xem thử – CHƯA CÀI THẬT'),
h('p', { class: 'wiz-not-real', role: 'alert', 'data-testid': 'wiz-not-real' }, NOT_REAL_TEXT + '.'),
h('p', null, 'Đã xem ' + p.done + '/' + p.total + ' bước; 2 bước cài máy chủ thật đang "bỏ qua". App đang chạy máy chủ giả trong trình duyệt này: dữ liệu không lên Google của anh/chị, đổi máy/xoá dữ liệu trình duyệt là mất, và KHÔNG chuyển sang máy chủ thật.'),
h('p', { class: 'muted small' }, 'Cài thật: làm bước "Tạo máy chủ" (Xem lại các bước) → lấy địa chỉ …/exec → Cài đặt › Kết nối › dán địa chỉ → Lưu. Trước khi nối, app nhắc tải về dữ liệu đã nhập lúc Xem thử.'),
h('div', { class: 'btn-row' },
button('Xem lại các bước', () => { _o33 = true; render(); }, { kind: 'ghost', testid: 'wiz-review' }),
ctl.goSettings && ctl.mode !== 'pre' ? button('Nối máy chủ thật', () => ctl.goSettings('connection'), { kind: 'secondary', testid: 'wiz-go-connection-real' }) : null,
ctl.close ? button('Vào xem thử app', () => ctl.close(), { kind: 'primary', testid: 'wiz-close' }) : null));
}
const _o2j = M.pendingRequired(st);
const _o2k = new Set(_o2j.map((_o46) => _o46.id));
const _o2h = later.filter((s) => !_o2k.has(s.id));
return h('div', { class: 'wiz-done', 'data-testid': 'wiz-done' },
h('div', { class: 'wiz-done-ico', 'aria-hidden': 'true' }, _o2j.length ? '⚠️' : '🎉'),
h('h2', { class: 'wiz-h2', tabindex: '-1', 'data-testid': 'wiz-step-title' }, _o2j.length ? 'Dùng app được rồi – còn ' + _o2j.length + ' bước bắt buộc' : 'Cài đặt xong!'),
h('p', null, 'Đã xong ' + p.done + '/' + p.total + ' bước' + (st.flow === 'company' ? ' – đã có biên bản bàn giao.' : '.')),
_o2j.length ? h('div', { class: 'wiz-warn', role: 'note', 'data-testid': 'wiz-done-owe' },
h('p', null, '⚠️ Chưa xong (bắt buộc): ', h('strong', null, _o2j.map((_o46) => _o46.title).join(' · ')), '. Làm nốt khi sẵn sàng – nút Trợ lý cài đặt ở góc màn hình đưa anh/chị quay lại.'),
h('div', { class: 'btn-row' }, _o2j.map((_o46) => button('Làm bước ' + _o46.title, () => _o1f(_o46.id), { kind: 'secondary', small: true, icon: 'next', testid: 'wiz-done-go-' + _o46.id })))) : null,
_o2h.length ? h('p', { class: 'muted small' }, 'Để sau: ' + _o2h.map((s) => s.title).join(' · ') + '. Mở lại bất kỳ lúc nào ở Cài đặt › Trợ lý cài đặt.') : null,
_o1o(st),
ctl.samples ? _o38(st) : null,
h('div', { class: 'btn-row' },
button('Xem lại các bước', () => { _o33 = true; render(); }, { kind: 'ghost', testid: 'wiz-review' }),
ctl.close ? button('Vào dùng app', () => ctl.close(), { kind: 'primary', testid: 'wiz-close' }) : null));
}
async function _o1m() {
const text = await ctl.diagnostics();
const ta = h('textarea', { class: 'wiz-report', readonly: true, rows: 12, 'data-testid': 'wiz-report', 'aria-label': 'Báo cáo cài đặt' });
ta.value = text;
const share = typeof navigator !== 'undefined' && navigator.share;
let _o3o = ctl.config.SUPPORT_EMAIL || '';
if (!_o3o && isSaleEdition(ctl.config)) { try { _o3o = supportContact(ctl.config).email; } catch { _o3o = ''; } _o3o = _o3o || supportEmail(ctl.config); }
const _o21 = _o3o ? 'mailto:' + encodeURIComponent(_o3o) + '?subject=' + encodeURIComponent('Cần giúp cài BDS Studio') + '&body=' + encodeURIComponent(text.slice(0, 1800)) : '';
ui.modal({
title: 'Cần giúp?', wide: true, cls: 'wiz-help-modal',
body: h('div', { class: 'stack' },
h('p', { class: 'lead' }, 'App đã soạn sẵn báo cáo cài đặt bên dưới. Báo cáo KHÔNG có mật khẩu, mã bot hay khoá AI; email và số điện thoại đã che bớt.'),
h('p', { class: 'muted small' }, 'Chép rồi gửi cho bên hỗ trợ qua Zalo/Telegram/email, kèm ảnh chụp màn hình nếu có.'),
ta,
h('div', { class: 'btn-row' },
button('Chép báo cáo', () => ui.copy(text), { kind: 'primary', small: true, testid: 'wiz-report-copy' }),
button('Tải tệp', () => download('bao-cao-cai-dat-bds-studio.txt', text), { kind: 'secondary', small: true, testid: 'wiz-report-download' }),
share ? button('Gửi…', () => navigator.share({ title: 'Báo cáo cài đặt BDS Studio', text }).catch(() => {}), { kind: 'secondary', small: true, testid: 'wiz-report-share' }) : null,
_o21 ? h('a', { class: 'btn btn-secondary btn-sm', href: _o21, 'data-testid': 'wiz-report-mail' }, 'Gửi email') : null)),
actions: [{ label: 'Đóng', kind: 'ghost' }]
});
}
}
function download(name, text) {
const _o3 = document.createElement('a');
_o3.href = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
_o3.download = name; document.body.appendChild(_o3); _o3.click();
setTimeout(() => { URL.revokeObjectURL(_o3.href); _o3.remove(); }, 500);
}
export async function shrinkLogo(file, max = 256) {
if (file.size > 5 * 1024 * 1024) throw new Error('ảnh quá 5 MB');
const url = URL.createObjectURL(file);
try {
const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error('tệp không phải ảnh')); i.src = url; });
const k = Math.min(1, max / Math.max(img.naturalWidth || max, img.naturalHeight || max));
const _oe = document.createElement('canvas');
_oe.width = Math.max(1, Math.round((img.naturalWidth || max) * k)); _oe.height = Math.max(1, Math.round((img.naturalHeight || max) * k));
_oe.getContext('2d').drawImage(img, 0, 0, _oe.width, _oe.height);
let _o2i = _oe.toDataURL('image/png');
if (_o2i.length > 60000) _o2i = _oe.toDataURL('image/jpeg', 0.85);
return _o2i;
} finally { URL.revokeObjectURL(url); }
}
export default { mountWizard, shrinkLogo };

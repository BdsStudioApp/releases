import * as M from './machine.js';
import { engineDownload } from '../engine_dl.18c8a720c5.js';
import { FLOW_INTRO, FLOW_LABEL, CHECKLIST, ENGINE_GUIDE, URL_FIELD_LABEL, supportEmail, isSaleEdition, boldParts, flowWho } from './steps.js';
import { installDevice, installUrl, needsPcText, DEVICE_LABEL } from './device.js';
import { portalHost } from './provision.js';
import { browserProblems, browserEnv, normHost } from './checks.js';
import { handoverText, roleVi } from './report.js';
import { copyText } from '../updates.7f3d23ce57.js';
import { supportContact, privacyLine } from '../instance.087c1b328a.js';
import { diachiWidget, wishBox } from './diachi.js';
import { gcaiWidget } from './gcai_view.js';
import { available as gcaiAvailable, isPhone, loadProgress as gcaiProgress } from './gcai.js';
import { gcaiPlan, slotService, slotStateOf, slotsLabel, slotsLeftText, captchaToken, maskEmail, EMAIL_RE as MAIL_RE } from './gcai_slots.js';
import { helpUrl, helpPageForKey } from '../help_links.ba329c14dc.js';
import { companyDomainWidget } from './tenmien_cty.js';
import { doinguWidget } from './doingu.js';
import { emailCodeBox } from '../email_verify.c44911bb1b.js';
import { hwCheckPanel } from './hwcheck.js';
import { finishCard, appUrlFor } from '../a2hs.dd832a10b4.js';
import { EVENT as VIDEO_EVENT, MODE_TEXT as VIDEO_MODE } from '../video_screens.6f9cddd373.js';
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
function _o8(root, ui) {
for (const b of root.querySelectorAll('button, a.btn')) {
if (b.querySelector(BTN_ICON_SEL)) continue;
const size = b.classList.contains('btn') ? (b.classList.contains('btn-sm') ? 18 : 20) : 16;
b.prepend(ui.icon(iconForLabel(b.textContent || b.getAttribute('aria-label')), size));
}
}
function _o3s(container, ui) {
if (container.__wizIcons || typeof MutationObserver === 'undefined' || typeof ui.icon !== 'function') return;
container.__wizIcons = new MutationObserver(() => _o8(container, ui));
container.__wizIcons.observe(container, { childList: true, subtree: true });
}
export function mountWizard(container, ctl) {
const { ui } = ctl;
const { h, button } = ui;
let _o4 = '';
let _o30 = !!ctl.review;
_o3s(container, ui);
const _o3o = ctl.mode === 'pre' && typeof history !== 'undefined' && typeof window !== 'undefined' && typeof history.pushState === 'function';
let _o2s = false;
let _o1x = null;
if (_o3o) {
try { const _o1p = history.state; if (!_o1p || (!_o1p.bdsWiz && !_o1p.bdsWizBase)) history.replaceState({ ...(_o1p || {}), bdsWizBase: true }, ''); } catch { }
window.addEventListener('popstate', _o2a);
}
render();
return { render };
function set(s) { ctl.set(s); render(); }
function _o1m(st) { return st && st.flow ? (st.finished && M.isFinished(st) ? '_done' : st.cur) : '_start'; }
function _o3j(st) {
if (!_o3o || _o2s) return;
const key = _o1m(st);
const cur = history.state && history.state.bdsWiz;
if (cur === key) return;
try { history.pushState({ ...(history.state || {}), bdsWiz: key }, ''); } catch { }
}
async function _o2a(e) {
if (!container.isConnected) { window.removeEventListener('popstate', _o2a); return; }
const id = e && e.state && e.state.bdsWiz;
const st = ctl.state;
if (id && id !== '_start' && id !== '_done' && st && st.flow && id !== st.cur && M.ids(st).includes(id)) {
_o2s = true;
try { set(M.goTo(st, id)); return; } catch { } finally { _o2s = false; }
return;
}
if (id === '_start' && st && st.flow && _oe(st)) { _o2s = true; try { set(null); } finally { _o2s = false; } return; }
if (id || !(e && e.state && e.state.bdsWizBase)) return;
const ok = await ui.confirm('Rời Trợ lý cài đặt? Các bước đã làm vẫn được lưu trên máy này – mở lại app là làm tiếp.', { ok: 'Rời trợ lý', title: 'Rời Trợ lý cài đặt?' });
if (ok) { window.removeEventListener('popstate', _o2a); history.back(); return; }
try { history.pushState({ bdsWiz: _o1m(ctl.state) }, ''); } catch { }
}
function _o3m() {
try {
for (let _oz = container; _oz && _oz !== document.body; _oz = _oz.parentElement) {
if (_oz.scrollHeight > _oz.clientHeight + 1 && /(auto|scroll)/.test(getComputedStyle(_oz).overflowY)) _oz.scrollTop = 0;
}
if (ctl.mode !== 'settings') window.scrollTo(0, 0);
} catch { }
}
function render() {
const st = ctl.state;
const _o39 = _o1m(st) + (_o30 ? ':r' : '');
const _o25 = _o1x !== null && _o39 !== _o1x;
_o1x = _o39;
ui.clear(container);
container.classList.add('wiz');
_o3j(st);
if (!st || !st.flow) { container.append(_oi()); if (_o25) _o3m(); return; }
if (st.finished && M.isFinished(st) && !_o30) { container.append(_oy(st)); if (_o25) _o3m(); return; }
container.append(_o1k(st), _o3g(st));
const on = container.querySelector('.wiz-chip.on'); const _o32 = on && on.parentElement;
if (_o32) _o32.scrollLeft = Math.max(0, on.offsetLeft - (_o32.clientWidth - on.offsetWidth) / 2);
const t = container.querySelector('[data-testid="wiz-step-title"]');
if (_o25) _o3m();
if (t && ctl.mode !== 'settings') try { t.focus({ preventScroll: _o25 }); } catch { }
}
function _o1y() {
const p = ctl.linkProblem;
if (!p) return null;
return h('div', { class: 'wiz-result is-bad', role: 'alert', 'data-testid': 'wiz-link-hint' },
h('p', null, h('strong', null, '❌ ' + p.cause)), h('p', { class: 'small' }, h('strong', null, 'Cách sửa: '), p.fix));
}
function _o16() { return installDevice() || (isPhone() ? 'phone' : ''); }
function _o17() {
return ctl.mode === 'pre' && !!ctl.portal && gcaiAvailable(ctl.config, { portal: true }) && gcaiPlan(ctl.config).on && !!_o16();
}
function _o3f() {
if (!_o17()) return null;
if (!ctl.gcaiSvc) ctl.gcaiSvc = slotService({ url: (ctl.config || {}).PROVISION_URL });
if (!ctl.gslots) {
if (!ctl.gcaiSvc.configured) ctl.gslots = { st: 'loi' };
else {
ctl.gslots = { st: 'cho' };
ctl.gcaiSvc.slots().then((_o2z) => { ctl.gslots = slotStateOf(_o2z); }, () => { ctl.gslots = { st: 'loi' }; })
.then(() => { if (container.isConnected && !(ctl.state && ctl.state.flow && ctl.state.cur !== 'allow')) render(); });
}
}
return ctl.gslots;
}
function _o19() { const p = gcaiProgress(); return !!(p.claimed || p.fileId); }
function _o1c() { const _o3e = _o3f(); return !!_o3e && (_o3e.st === 'con' || (_o3e.st !== 'cho' && _o19())); }
function _o18() { const _o3e = _o3f(); return !!_o3e && _o3e.st === 'cho' && !_o19(); }
function _o2q() { return ctl.mode === 'pre' && !!installDevice() && !_o1c() && !_o18(); }
function _o2p(testid = 'wiz-pc-help', label = '📖 Xem cách cài trên máy tính (có ảnh)') {
const href = helpUrl(helpPageForKey('cai_may_tinh'));
return href ? h('a', { class: 'wiz-pc-help', href, target: '_blank', rel: 'noopener', 'data-testid': testid }, label) : null;
}
function _o1b() {
const _o3e = ctl.gslots || {};
return h('div', { class: 'wiz-pc wiz-gcai-card', role: 'note', 'data-testid': 'wiz-gcai-card' },
h('p', { class: 'wiz-pc-title' }, h('span', { 'aria-hidden': 'true' }, '📱 '), h('strong', null, 'Cài ngay trên điện thoại bằng tài khoản Google')),
h('p', { class: 'wiz-gcai-prio', 'data-testid': 'wiz-gcai-prio' }, '⭐ ' + slotsLabel(_o3e.tong || gcaiPlan(ctl.config).slots) + (_o3e.st === 'con' ? ' · ' + slotsLeftText(_o3e.con) : '')),
h('p', { class: 'small' }, 'Khoảng 3–5 phút, không cần máy tính: đăng nhập Google, trang tự tạo máy chủ trong Google Drive của anh/chị. Chọn Cá nhân hoặc Công ty bên dưới để bắt đầu.'),
_o2p('wiz-gcai-pc-help', '📖 Muốn cài trên máy tính? Xem hướng dẫn'));
}
function _o2r() {
return h('div', { class: 'wiz-pc wiz-pc-wait', role: 'status', 'data-testid': 'wiz-gcai-wait' }, h('p', null, ui.spinner(), ' Đang kiểm tra cách cài trên ' + DEVICE_LABEL[_o16()] + '…'));
}
function _o2o({ inStep = false } = {}) {
const _os = installDevice();
const url = installUrl({ portal: !!ctl.portal, origin: typeof location !== 'undefined' ? location.origin : '', host: portalHost(ctl.config || {}) });
const share = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
const _o3e = _o3f();
return h('div', { class: 'wiz-pc', role: 'note', 'data-testid': 'wiz-needs-pc', dataset: { device: _os } },
h('p', { class: 'wiz-pc-title' }, h('span', { 'aria-hidden': 'true' }, '💻 '), h('strong', null, 'Cài trên máy tính')),
_o3e && _o3e.st === 'het' ? h('p', { class: 'small', 'data-testid': 'wiz-gcai-full' }, '⭐ Đã hết ' + (_o3e.tong || gcaiPlan(ctl.config).slots) + ' chỗ ưu tiên "Cài bằng Google" trên điện thoại – anh/chị cài trên máy tính nhé.') : null,
h('p', { 'data-testid': 'wiz-needs-pc-text' }, needsPcText(url)),
h('code', { class: 'wiz-pc-url', 'data-testid': 'wiz-needs-pc-url' }, url),
h('div', { class: 'wiz-pc-acts' },
button('Chép link', async () => {
const _o2z = await copyText(url);
ui.toast(_o2z === 'copied' ? 'Đã chép link – mở trên máy tính để cài' : 'Chưa chép được – giữ ngón tay lên link ở trên để chép', _o2z === 'copied' ? 'success' : 'warn');
}, { kind: 'primary', icon: 'copy', testid: 'wiz-needs-pc-copy' }),
share ? button('Gửi qua Zalo', async () => {
try { await navigator.share({ title: 'Cài BDS Studio trên máy tính', text: 'Mở link này trên máy tính để cài BDS Studio:', url }); } catch { }
}, { kind: 'secondary', icon: 'send', testid: 'wiz-needs-pc-share' }) : null),
_o21(),
_o2p(),
ctl.loginHere ? (inStep ? button('Tôi đã cài rồi – đăng nhập trên máy này', () => ctl.loginHere(), { kind: 'secondary', icon: 'user', testid: 'wiz-needs-pc-login' })
: h('p', { class: 'muted small' }, 'Đã cài xong trên máy tính? Bấm "Tôi đã cài rồi – đăng nhập trên máy này" để dùng app trên ' + DEVICE_LABEL[_os] + '.')) : null);
}
function _o21() {
if (!ctl.gcaiSvc) ctl.gcaiSvc = slotService({ url: (ctl.config || {}).PROVISION_URL });
if (!ctl.gcaiSvc.configured) return null;
const S = ctl.__mail || (ctl.__mail = { email: '', res: null });
const f = ui.field({ label: 'Hoặc gửi link về email (mở thư trên máy tính)', type: 'email', id: 'wiz-mail', value: S.email, inputmode: 'email', autocomplete: 'email', placeholder: 'ten@gmail.com',
onInput: (v) => { S.email = String(v || ''); } });
const _o2f = h('div', { class: 'wiz-mail-out', 'aria-live': 'polite', 'data-testid': 'wiz-mail-result' });
const ts = h('div', { class: 'wiz-turnstile', 'data-testid': 'wiz-mail-turnstile' });
const _o3b = (_o2z) => {
S.res = _o2z;
ui.mountTo(_o2f, _o2z ? h('p', { class: _o2z.ok ? 'wiz-ok' : _o2z.wait ? 'muted small' : 'wiz-bad', role: _o2z.ok || _o2z.wait ? 'status' : 'alert', dataset: { state: _o2z.ok ? 'ok' : _o2z.wait ? 'wait' : 'bad', code: _o2z.code || '' } }, _o2z.text) : null);
};
const send = button('Gửi link về email', async () => {
const email = String(f.getValue() || '').trim();
S.email = email;
if (!MAIL_RE.test(email)) { _o3b({ ok: false, code: 'BAD_EMAIL', text: '❌ Email chưa đúng – kiểm tra lại (ví dụ ten@gmail.com).' }); try { f.input.focus(); } catch { } return; }
_o3b({ wait: true, text: '⏳ Đang gửi…' + (String((ctl.config || {}).TURNSTILE_SITEKEY || '').trim() ? ' Nếu trang hỏi, đánh dấu ô kiểm tra bên dưới.' : '') });
try {
const turnstile = await captchaToken(ts, ctl.config || {}, { action: 'gui-link' });
await ctl.gcaiSvc.sendLink({ email, turnstile });
_o3b({ ok: true, code: 'SENT', text: '✅ Đã gửi link tới ' + maskEmail(email) + '. Mở thư trên máy tính (chưa thấy: xem cả mục Quảng cáo / Thư rác).' });
} catch (e) {
_o3b({ ok: false, code: (e && e.code) || 'NETWORK', text: '❌ ' + ((e && e.message) || 'Chưa gửi được – bấm "Chép link" ở trên.') });
}
}, { kind: 'secondary', icon: 'mail', testid: 'wiz-mail-send' });
f.input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); send.click(); } });
if (S.res && !S.res.wait) _o3b(S.res);
return h('div', { class: 'wiz-mail', 'data-testid': 'wiz-mail' }, f, h('div', { class: 'wiz-pc-acts' }, send), ts, _o2f);
}
function _o3a(t) { return ctl.portal ? String(t == null ? '' : t).replace(/Mở BDS Studio và kết nối/g, 'Quay lại trang cài đặt và kết nối') : t; }
function _oi() {
const _o2w = browserProblems(browserEnv());
const card = (flow) => {
const f = FLOW_INTRO[flow];
return h('button', { type: 'button', class: 'wiz-flow', 'data-testid': 'wiz-choose-' + flow, onclick: () => {
let _o33 = M.start(flow, { installed: ctl.mode !== 'pre', portal: !!ctl.portal });
if (ctl.pendingUrl && M.ids(_o33).includes('allow')) { _o33 = M.setData(_o33, { url: ctl.pendingUrl }); ctl.autoCheck = true; ctl.fromLink = ctl.pendingUrl; if (ctl.clearPending) ctl.clearPending(); }
set(_o33);
} },
h('span', { class: 'wiz-flow-ico', 'aria-hidden': 'true' }, f.icon),
h('span', { class: 'wiz-flow-text' }, h('strong', null, f.title), h('span', { class: 'wiz-flow-who', 'data-testid': 'wiz-who-' + flow }, flowWho(flow, ctl.config)), h('span', { class: 'muted small' }, f.lead),
h('ul', { class: 'wiz-flow-points' }, f.points.map((p) => h('li', null, p)))));
};
return h('div', { class: 'wiz-choose', 'data-testid': 'wiz-choose' },
h('h1', { class: 'wiz-h1' }, 'Anh/chị dùng BDS Studio cho:'),
_o2q() ? _o2o() : _o18() ? _o2r() : _o1c() ? _o1b() : null,
ctl.pendingUrl ? h('p', { class: 'wiz-ok', role: 'status', 'data-testid': 'wiz-pending-url' }, '✅ Đã nhận địa chỉ máy chủ từ Sheet. Chọn Cá nhân hoặc Công ty – trợ lý tự điền, tự kiểm máy chủ ở bước "Tạo máy chủ".') : null,
_o1y(),
h('div', { class: 'wiz-flows' }, card('personal'), card('company')),
ctl.loginHere ? h('div', { class: 'wiz-login-here' }, button('Tôi đã cài rồi – đăng nhập trên máy này', () => ctl.loginHere(), { kind: 'secondary', icon: 'user', testid: 'wiz-choose-login' }),
h('p', { class: 'muted small' }, 'Dùng khi đã cài BDS Studio trên máy khác (điện thoại thứ 2, máy tính): chỉ cần địa chỉ máy chủ hoặc link mở app.')) : null,
h('div', { class: 'wiz-pre', 'data-testid': 'wiz-prereq' },
_o2w.length ? [h('p', { class: 'wiz-bad' }, '❌ Máy này chưa đủ điều kiện:'), h('ul', null, _o2w.map((p) => h('li', { 'data-problem': p.id }, h('strong', null, p.cause), ' ', p.fix)))]
: h('p', { class: 'muted small' }, '✅ Trình duyệt và mạng đủ điều kiện. Cần thêm: một tài khoản Google (Gmail hoặc Workspace). Nhân viên/khách không cần cài gì.')),
ctl.mode === 'pre' && !ctl.sale ? h('button', { type: 'button', class: 'link-btn', 'data-testid': 'wiz-skip-all', onclick: () => ctl.skipWizard() }, 'Đã quen cài đặt? Bỏ qua trợ lý') : null,
ctl.mode === 'pre' ? null : h('p', { class: 'muted small' }, 'App đã cài sẵn: các bước tạo máy chủ được tính là xong, trợ lý chỉ dẫn phần còn lại.'));
}
function _o1k(st) {
const p = M.progress(st);
const _og = M.steps(st).map((s, _o1r) => {
const _o2z = st.res[s.id];
const on = s.id === st.cur;
const _oc = on || M.isDone(st, s.id) || _od(st, s.id);
const _o2g = !!(_o2z && _o2z.s === 'later' && s.required);
return h('li', { class: ['wiz-chip', on && 'on', _o2z && 'is-' + _o2z.s, _o2g && 'is-owe'], dataset: { step: s.id } },
h('button', { type: 'button', disabled: !_oc || on, onclick: () => { try { set(M.goTo(st, s.id)); } catch (e) { ui.toast(e.message, 'warn'); } }, title: s.title + (_o2g ? ' – bắt buộc, chưa xong' : '') },
h('span', { class: 'wiz-chip-n' }, _o2g ? '⚠' : _o2z && _o2z.s === 'fail' && _o2z.wait ? _o2.later : _o2z && _o2[_o2z.s] ? _o2[_o2z.s] : String(_o1r + 1)), h('span', { class: 'wiz-chip-t' }, s.title + (_o2g ? ' (chưa xong)' : ''))));
});
return h('div', { class: 'wiz-head' },
M.isDemo(st) && ctl.demo ? h('p', { class: 'wiz-not-real', role: 'note', 'data-testid': 'wiz-not-real' }, '⚠️ ' + NOT_REAL_TEXT + ' – đang Xem thử bằng máy chủ giả trong trình duyệt này.') : null,
h('div', { class: 'wiz-top' },
h('span', { class: 'wiz-badge', 'data-testid': 'wiz-flow' }, (st.flow === 'company' ? '🏢 ' : '👤 ') + FLOW_LABEL[st.flow]),
h('span', { class: 'wiz-top-sp' }),
_oe(st) ? button('Chọn lại', () => set(null), { kind: 'ghost', small: true, testid: 'wiz-rechoose' }) : null,
button('Cần giúp?', () => _o1l(), { kind: 'ghost', small: true, icon: 'help', testid: 'wiz-help' })),
h('div', { class: 'wiz-prog', 'data-testid': 'wiz-progress' },
ui.progress(p.pct, 'Tiến độ cài đặt ' + p.pct + '%'),
h('p', { class: 'muted small' }, M.stepText(st) + ' · đã xong ' + p.done + ' · bước chính ' + p.mainDone + '/' + p.mainTotal)),
h('ol', { class: 'wiz-chips', 'aria-label': 'Các bước' }, _og));
}
function _od(st, id) { try { M.goTo(st, id); return true; } catch { return false; } }
function _oe(st) { return ctl.mode !== 'post' && !Object.keys(st.res).some((id) => id === 'account' && st.res[id].s === 'ok') && st.origin === 'new'; }
function _o3g(st) {
const s = M.current(st);
const resBox = h('div', { class: 'wiz-result', 'data-testid': 'wiz-result', 'aria-live': 'polite' });
_o2l(resBox, ctl.last[s.id] || (st.res[s.id] && st.res[s.id].s === 'ok' ? { ok: true, msg: st.res[s.id].msg } : null));
const _o28 = s.id === 'diachi' && !(ctl.provision && ctl.provision.configured);
const deferrable = s.deferrable && !(s.id === 'diachi' && !_o28);
const _ov = s.id === 'domain' && st.flow !== 'company' ? ((((st.data || {}).domain) || {}).mode || 'shared') : '';
const _oq = _ov === 'shared' && ctl.defaultAddress ? ctl.defaultAddress() : null;
const _o3q = !!(_oq && _oq.own === false);
const badge = s.required ? (deferrable ? ui.badge('Bắt buộc – làm sau được', 'gold') : ui.badge('Bắt buộc', 'gold')) : ui.badge('Tuỳ chọn', 'neutral');
const _o1j = !!ctl.link('template');
const gWay = s.id === 'allow' ? allowWay(st) : '';
const _o1f = gWay === 'google';
const _o31 = (t) => boldParts(_o3a(t)).map((_o3w) => (_o3w.b ? h('strong', null, _o3w.t) : _o3w.t));
const _o2y = s.id === 'diachi' && !_o28 && st.flow !== 'company' && !M.isDone(st, s.id);
const _o2n = s.id === 'allow' && ctl.mode === 'pre' && !!installDevice() && !((st.data || {}).url) && gWay !== 'google' && !(gWay === '' && _o18());
const _o1a = s.id === 'allow' && gWay === '' && _o18() && !((st.data || {}).url);
const todo = _o2n ? [] : (_o28 && s.todoNoService) || (_o2y && s.todoQuick) || (_ov === 'shared' && (_o3q ? s.todoSharedWait : s.todoShared)) || (_o1f && s.todoGoogle) || (!_o1j && s.todoManual) || s.todo || [];
const _o3t = s.actions.some((_o3) => _o3.way);
const _o22 = s.actions.filter((_o3) => !(_o3.alt && _o3.link && !ctl.link(_o3.link)) && (_o1j ? _o3.way !== 'manual' : _o3.way !== 'copy'));
const actions = h('ol', { class: 'wiz-actions', 'data-testid': 'wiz-actions' }, _o22.map((_o3, _o1r) => _o7(_o3, _o1r)));
const _o23 = _o3t && _o1j ? s.actions.filter((_o3) => _o3.way === 'manual') : [];
const manualBox = _o23.length ? h('details', { class: 'wiz-manual', 'data-testid': 'wiz-manual' }, h('summary', null, 'Cách dự phòng: dán tay (khi link Tạo bản sao không mở được)'),
h('ol', { class: 'wiz-actions' }, _o23.map((_o3, _o1r) => _o7(_o3, _o1r)))) : null;
const noTplNote = _o3t && !_o1j ? h('p', { class: 'wiz-note', 'data-testid': 'wiz-no-template' }, 'Bên bán chưa cài link "Tạo bản sao" – tạo máy chủ bằng cách dán tay 3 tệp dưới đây (các nút Chép đã kiểm mã).') : null;
const runCheck = async () => {
ui.mountTo(resBox, ui.spinner(), ' Đang kiểm tra…');
const _o2z = await ctl.run(s.id, { ...argsFor(s.id), onProgress: (msg) => ui.mountTo(resBox, ui.spinner(), ' ' + msg) });
_o2l(resBox, _o2z);
set(M.record(ctl.state, s.id, _o2z));
if (s.id === 'engine' && _o2z && _o2z.ok) _o3p({ type: 'engine_ok' });
return _o2z;
};
const goNext = async () => {
if (!M.canNext(ctl.state)) { ui.toast('Bấm "' + _of + '" – xanh rồi mới sang bước kế.', 'warn'); return; }
if (ctl.beforeNext && (await ctl.beforeNext(s.id)) === false) return;
set(M.next(ctl.state));
};
if (s.id === 'allow' && ctl.autoCheck && ((st.data || {}).url)) {
ctl.autoCheck = false;
setTimeout(async () => { const _o2z = await runCheck(); if (_o2z && _o2z.ok) await goNext(); }, 0);
}
const _o1u = s.id === 'account' && ctl.mode === 'pre';
const choice = s.choice ? _o10(st) : null;
const _ok = choice === 'skip' && !M.isDone(st, s.id);
const _o2d = choice === 'online';
const _of = s.id === 'finish' ? 'Kiểm tra toàn bộ' : 'Kiểm tra bước này';
const _o2i = !!(s.required && st.res[s.id] && st.res[s.id].s === 'later');
const _ox = M.isDone(st, s.id) && !_o2i;
const _o3d = M.canSkip(s) && (s.id !== 'diachi' || _o28) && !_o2d;
const _o3c = _o3d && (_ok || _o28 || _o3q) && !_ox;
const _o15 = h('div', { class: 'wiz-foot' },
(() => {
const _o2u = M.back(st) !== st, toChooser = !_o2u && M.ids(st).indexOf(st.cur) <= 0 && _oe(st);
return button('Quay lại', () => (_o2u ? set(M.back(ctl.state)) : set(null)), {
kind: 'ghost', testid: 'wiz-back', icon: 'back', disabled: !_o2u && !toChooser,
title: !_o2u && !toChooser ? 'Đã tạo tài khoản – các bước cài máy chủ đã xong, không cần quay lại' : (toChooser ? 'Về màn chọn Cá nhân / Công ty' : ''),
});
})(),
_o1u ? button('Tạo tài khoản', () => {
const em = String((ctl.state.data || {}).email || '').trim();
if (_o6() && !(ctl.ev && ctl.ev.verified)) { ui.toast('Bấm "Gửi mã", nhập mã 6 số trong email – xác nhận xong mới tạo tài khoản được.', 'warn'); return; }
if (!_o6() && em && !EMAIL_RE.test(em)) { ui.toast('Email chưa đúng (cần đủ dạng tên, chữ @, tên miền) – sửa lại hoặc để trống.', 'warn'); return; }
if (_o6()) _o12(ctl.ev);
ctl.onAccount();
}, { kind: 'primary', testid: 'wiz-account', icon: 'user', disabled: _o6() && !(ctl.ev && ctl.ev.verified) })
: _ok || _o2d ? null
: _o1f && !((st.data || {}).url) ? null
: _o2y ? null
: _o2n || _o1a ? null
: button(_of, runCheck, { kind: _ox || _o3c ? 'secondary' : 'primary', icon: 'pulse', testid: 'wiz-check' }),
_o3d ? button(s.required || _o3q ? (s.laterLabel || 'Làm sau') : 'Bỏ qua bước này', () => {
try {
let _o34 = ctl.state;
if (s.id === 'doingu') { _o34 = M.setData(_o34, { doingu: { ...((_o34.data || {}).doingu || {}), rows: [], sale: 0, manager: 0 } }); delete ctl.last.doingu; }
set(M.skip(_o34, s.id, s.required || _o3q ? 'later' : 'skip')); if (s.id === 'engine') _o3p({ type: 'skip', mode: (ctl.state.data || {}).engineMode || 'skip' }); if (!s.required && s.skipNote) ui.toast(s.skipNote, 'info', 5000); if (s.required && s.laterNote) ui.toast(s.laterNote, 'info', 7000); } catch (e) { ui.toast(e.message, 'warn'); }
}, { kind: _o3c ? 'primary' : 'ghost', testid: 'wiz-skip', icon: s.required || _o3q ? 'clock' : 'next' }) : null,
button(_o1v(st) ? 'Hoàn tất' : 'Tiếp', goNext, { kind: _ox ? 'primary' : 'secondary', testid: 'wiz-next', icon: _o1v(st) ? 'check' : 'next', disabled: !M.canNext(st) }));
const _ou = s.id === 'domain' && st.flow !== 'company' && choice !== 'skip' ? _ow(st.data || {}, (p) => ctl.set(M.setData(ctl.state, p)), [h('h3', { class: 'wiz-h3' }, 'Cách làm'), actions]) : null;
const gSeg = gWay ? h('div', { class: 'wiz-box wiz-domain-mode', 'data-testid': 'wiz-allow-way' }, ui.segmented([
{ value: 'google', label: 'Cài bằng Google (ngay trên điện thoại)', icon: 'key' }, { value: 'sheet', label: installDevice() ? 'Cài trên máy tính' : 'Cài trên máy tính (cách cũ)', icon: 'monitor' }], gWay,
(v) => set(M.setData(ctl.state, { allowWay: v })), { label: 'Cách tạo máy chủ', name: 'wiz-allow-way' })) : null;
return h('section', { class: 'wiz-step', dataset: { step: s.id }, 'data-testid': 'wiz-step' },
h('h2', { class: 'wiz-h2', tabindex: '-1', 'data-testid': 'wiz-step-title' }, s.title, ' ', badge),
s.trial ? h('p', { class: 'wiz-ok', role: 'note', 'data-testid': 'wiz-trial' }, _o31(s.trial)) : null,
_ou ? _ou.seg : null, gSeg,
h('div', { class: 'wiz-why', 'data-testid': 'wiz-intro' },
h('p', { class: 'wiz-headline' }, _o31(s.head)),
s.note && !_o2y ? h('p', { class: 'muted small' }, _o31(s.note)) : null,
todo.length ? [h('p', null, h('strong', null, s.todoTitle || 'Anh/chị cần làm:')),
h('ol', { class: 'wiz-todo', 'data-testid': 'wiz-todo' }, todo.map((t) => h('li', null, _o31(t))))] : null,
!s.required && s.skipNote && choice !== 'skip' && !_o2d ? h('p', { 'data-testid': 'wiz-skip-note' }, h('strong', null, 'Bỏ qua thì sao? '), s.skipNote) : null),
s.required && st.res[s.id] && st.res[s.id].s === 'later' ? h('p', { class: 'wiz-warn', role: 'note', 'data-testid': 'wiz-owe' }, '⚠️ Bước bắt buộc – chưa xong (đã chọn "' + (s.laterLabel || 'Làm sau') + '"). Làm xong rồi bấm "Kiểm tra bước này".') : null,
_o2n || _o1a ? null : h('p', { class: 'wiz-meta', 'data-testid': 'wiz-meta' }, '⏱ ' + (_o1f && s.timeGoogle ? s.timeGoogle : s.time) + ' · ' + s.cost),
choice ? _oh(s, choice) : null,
choice === 'skip' ? null : _o1a ? _o2r() : _o2n ? [_o2o({ inStep: true }), _or()] : _o2d ? _o2c() : _ou ? _ou.body : _o28 || _o2y ? _o3v(s, st) : _o1f ? _o1g(st) : [h('h3', { class: 'wiz-h3' }, 'Cách làm'), s.id === 'allow' ? _o2p('wiz-allow-help') : null, noTplNote, actions, manualBox, _o3v(s, st)], resBox,
_o15);
}
function allowWay(st) {
if (!_o1c()) return '';
const w = (st.data || {}).allowWay;
return w === 'google' || w === 'sheet' ? w : 'google';
}
function _o1g(st) {
const _oo = st.data || {};
const co = st.flow === 'company' ? ui.field({ label: 'Tôi đang dùng tài khoản Google CÔNG TY (không phải Gmail cá nhân của nhân viên)', hint: 'Đang thử trước bằng Gmail cá nhân: để trống ô này – vẫn đi tiếp được, biên bản ghi "chưa làm".', type: 'checkbox', value: !!_oo.companyAccount, id: 'wiz-company-account',
onChange: (v) => ctl.set(M.setData(ctl.state, { companyAccount: !!v })) }) : null;
const done = _oo.url && ctl.fromGoogle === _oo.url;
return h('div', { class: 'wiz-gcai-wrap' },
st.flow === 'company' ? h('p', { class: 'wiz-warn', role: 'note' }, '⚠️ Nên dùng tài khoản Google Workspace do quản trị viên công ty giữ – dùng Gmail cá nhân để thử cũng được, nhưng trước khi dùng thật hãy chuyển sang tài khoản công ty để nhân viên nghỉ việc không mang dữ liệu đi.') : null,
co,
_oo.url && !done ? h('p', { class: 'muted small', 'data-testid': 'wiz-gcai-url' }, 'Máy chủ: ', h('span', { class: 'mono' }, _oo.url)) : null,
done ? h('p', { class: 'muted small', 'data-testid': 'wiz-from-google' }, 'Máy chủ vừa tạo bằng Google – trợ lý tự kiểm. Chưa đạt: làm theo "Cách sửa" bên dưới rồi bấm "Kiểm tra bước này".')
: gcaiWidget(ctl, { ui, onSwitch: () => set(M.setData(ctl.state, { allowWay: 'sheet' })), switchLabel: installDevice() ? 'Cài trên máy tính' : 'Cài trên máy tính (cách cũ)',
onFull: () => { ui.toast('Vừa hết chỗ ưu tiên "Cài bằng Google" – anh/chị cài trên máy tính nhé.', 'warn', 6000); set(M.setData(ctl.state, { allowWay: 'sheet' })); },
onDone: ({ url }) => { ctl.autoCheck = true; ctl.fromGoogle = url; set(M.setData(ctl.state, { url, allowWay: 'google' })); } }));
}
function _o10(st) { const m = (st.data || {}).engineMode; return m === 'install' || m === 'online' ? m : 'skip'; }
function _oj(v) {
let _o29 = M.setData(ctl.state, { engineMode: v });
if (v === 'online') _o29 = M.record(_o29, 'engine', { ok: true, msg: ENGINE_ONLINE_MSG });
else if (_o29.res.engine && _o29.res.engine.msg === ENGINE_ONLINE_MSG) delete _o29.res.engine;
set(_o29);
_o3p({ type: 'choice', mode: v });
}
function _oh(s, choice) {
const _o1 = [['skip', 'off'], ['online', 'online'], ['install', 'machine']];
const seg = ui.segmented(_o1.map(([v, m]) => ({ value: v, label: VIDEO_MODE[m].label, icon: VIDEO_MODE[m].icon })), choice,
(v) => _oj(v), { label: 'Anh/chị làm video thế nào?', name: 'wiz-engine-mode' });
seg.classList.add('wiz-vmode-seg');
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-engine-choice' },
h('p', null, h('strong', null, 'Anh/chị làm video thế nào?')), seg,
h('ul', { class: 'wiz-vmodes', 'data-testid': 'wiz-engine-modes' }, _o1.map(([v, m]) => h('li', { class: v === choice ? 'on' : '', dataset: { mode: v }, 'data-testid': 'wiz-engine-mode-' + m },
h('strong', null, VIDEO_MODE[m].label), ': ', VIDEO_MODE[m].cost))),
hwCheckPanel(ui, { choice, onPreselect: (v) => _oj(v) }),
choice === 'skip' ? h('p', { class: 'wiz-note', 'data-testid': 'wiz-skip-note' }, '⏭ Bấm "Bỏ qua bước này": ', s.skipNote) : null);
}
function _o2c() {
return h('div', { class: 'wiz-box wiz-online', 'data-testid': 'wiz-engine-online' },
h('p', null, '✅ ', h('strong', null, 'Xong bước này – không cần cài gì trên máy.')),
h('ul', null,
h('li', null, 'Làm clip: Video & Ý tưởng › Video › soạn và duyệt kịch bản › bấm nút làm bằng AI.'),
h('li', null, VIDEO_MODE.online.cost),
h('li', null, 'Bảng giá và khoá nhà cung cấp (Veo, Runway, Kling) nhập ở Video AI › Cài đặt.'),
h('li', null, 'Muốn làm video bản đồ/quy hoạch sau: cài máy dựng rồi chọn "Dựng trên máy" ở Cài đặt › Gói chức năng › Video.')));
}
function _o3p(detail) { try { window.dispatchEvent(new CustomEvent(VIDEO_EVENT, { detail })); } catch { } }
function _o1v(st) { const list = M.ids(st); return list.indexOf(st.cur) === list.length - 1 || !list.slice(list.indexOf(st.cur) + 1).some((id) => !M.isDone(st, id)); }
function _o7(_o3, _o1r) {
const url = _o3.link ? ctl.link(_o3.link) : null;
const _o1s = ctl.images ? ctl.images(_o3) : [];
let _o13 = null;
if (_o1s.length) {
const _o2b = (_o3w, k) => h('figure', { class: 'wiz-fig' },
h('a', { href: _o3w.src, target: '_blank', rel: 'noopener', class: 'wiz-shot-link', title: 'Mở ảnh cỡ lớn' },
h('img', { src: _o3w.src, alt: _o3w.alt || ('Ảnh hướng dẫn bước ' + (_o1r + 1) + (_o1s.length > 1 ? ' (' + (k + 1) + '/' + _o1s.length + ')' : '')), loading: 'lazy', class: 'wiz-shot', width: _o3w.w, height: _o3w.h })),
_o3w.caption ? h('figcaption', { class: 'muted small' }, _o3w.caption) : null);
_o13 = _o1s.length === 1 ? _o2b(_o1s[0], 0)
: h('div', { class: 'wiz-figs' }, _o2b(_o1s[0], 0),
h('details', { class: 'wiz-more' }, h('summary', { class: 'small' }, 'Xem thêm ' + (_o1s.length - 1) + ' ảnh'), _o1s.slice(1).map((_o3w, k) => _o2b(_o3w, k + 1))));
} else if (_o3.slot || _o3.shot) _o13 = h('div', { class: 'wiz-slot', dataset: { slot: _o3.slot || _o3.shot }, role: 'img', 'aria-label': 'Chỗ ảnh hướng dẫn' }, '🖼 ', _o3.note || 'Ảnh hướng dẫn sẽ bổ sung');
return h('li', { class: ['wiz-act', _o3.alt && 'wiz-alt'], 'data-testid': _o3.alt ? 'wiz-alt' : null },
h('p', null, boldParts(_o3a(_o3.text)).map((_o3w) => (_o3w.b ? h('strong', null, _o3w.t) : _o3w.t))),
url ? h('a', { class: _o3.link === 'template' ? 'btn btn-primary wiz-link-main' : 'btn btn-secondary btn-sm', href: url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'wiz-link-' + _o3.link }, ui.icon(_o3.link === 'template' ? 'copy' : 'link', 18), h('span', null, _o1z(_o3.link))) : null,
_o3.installer && ctl.installer ? _o1t(_o3.installer) : null,
_o3.go && ctl.mode !== 'pre' ? button(_o1d(_o3.go), () => ctl.goSettings(_o3.go), { kind: 'secondary', small: true, testid: 'wiz-go-' + _o3.go }) : null,
_o13);
}
function _o1t(kind) {
const P = ctl.installer.paths, path = P[kind], fname = path.split('/').pop();
const _o3u = { tatca: 'tệp Mã.gs/Code.gs (đổi tên TatCa)', caidat: 'tệp CaiDat', manifest: 'appsscript.json' }[kind] || fname;
const _o37 = h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'wiz-inst-say-' + kind });
const _o3k = (msg, code, bad) => { _o37.textContent = msg; _o37.className = bad === 'warn' ? 'small wiz-warn' : bad ? 'small form-err' : 'small'; _o37.dataset.code = code; };
const note = (_o2z) => (_o2z.warn ? ' ⚠️ ' + _o2z.warn + '.' : '');
const get = async () => {
_o3k('Đang kiểm chữ ký số của ' + fname + '…', 'WAIT', false);
const _o2z = await ctl.installer.load();
if (!_o2z.ok) { _o3k(_o2z.message, _o2z.code, true); return null; }
return _o2z;
};
const copy = button('Chép ' + fname, async () => {
const _o2z = await get(); if (!_o2z) return;
const f = _o2z.files[path];
const _o1o = await copyText(f.text);
if (_o1o === 'copied') _o3k('Đã chép ' + fname + ' (' + (_o2z.signed ? 'đã kiểm chữ ký: đúng bản phát hành' : 'đã kiểm mã sha256: tệp đủ, không hỏng') + ', sha256 ' + f.sha256.slice(0, 12) + '…). Dán vào ' + _o3u + ': Ctrl+A → Ctrl+V → Lưu.' + note(_o2z), _o2z.signed ? 'OK' : 'OK_UNSIGNED', _o2z.signed ? false : 'warn');
else _o3k('Trình duyệt chưa cho chép tự động – bấm nút lần nữa, hoặc bấm "Tải tệp" rồi mở tệp, chọn hết và chép.', 'NO_CLIPBOARD', true);
}, { kind: 'secondary', small: true, testid: 'wiz-inst-copy-' + kind, icon: 'content' });
const _ot = h('a', { class: 'btn btn-ghost btn-sm', href: path, download: fname, rel: 'noopener', 'data-testid': 'wiz-inst-dl-' + kind }, ui.icon('disk', 18), h('span', null, 'Tải tệp ' + fname));
_ot.addEventListener('click', async (ev) => {
ev.preventDefault();
const _o2z = await get(); if (!_o2z) return;
try {
const _o3n = URL.createObjectURL(new Blob([_o2z.files[path].text], { type: /\.json$/.test(fname) ? 'application/json;charset=utf-8' : 'text/plain;charset=utf-8' }));
const _o3l = h('a', { href: _o3n, download: fname, hidden: true });
document.body.appendChild(_o3l); _o3l.click(); _o3l.remove();
setTimeout(() => URL.revokeObjectURL(_o3n), 30000);
_o3k('Đã ' + (_o2z.signed ? 'kiểm chữ ký' : 'kiểm mã sha256') + ' và tải ' + fname + ' – mở tệp, chọn hết (Ctrl+A), chép rồi dán vào ' + _o3u + '.' + note(_o2z), _o2z.signed ? 'OK' : 'OK_UNSIGNED', _o2z.signed ? false : 'warn');
} catch { _o3k('Chưa lưu được tệp – thử trình duyệt khác.', 'SAVE', true); }
});
ctl.installer.load();
return h('div', { class: 'wiz-inst', 'data-testid': 'wiz-inst-' + kind }, h('div', { class: 'btn-row' }, copy, _ot), _o37);
}
function _o1z(k) { return { template: 'Tạo bản sao', sheetsNew: 'Mở sheets.new', aistudio: 'Mở aistudio.google.com', telegramDownload: 'Tải Telegram', engineZip: 'Tải bộ cài máy dựng (' + engineDownload().primary.label + ')', engineZipOther: 'Máy ' + engineDownload().other.label + '? Tải bộ cài cho ' + engineDownload().other.label }[k] || 'Mở trang'; }
function _o1d(k) { return { connection: 'Mở Cài đặt › Kết nối', users: 'Mở Cài đặt › Người dùng', security: 'Mở Cài đặt › Bảo mật' }[k] || 'Mở Cài đặt'; }
function argsFor(id) { return id === 'allow' ? { url: (ctl.state.data || {}).url || '' } : {}; }
function _o2l(box, _o2z) {
if (!_o2z) { ui.clear(box); box.className = 'wiz-result'; return; }
box.className = 'wiz-result ' + (_o2z.ok ? 'is-ok' : 'is-bad');
ui.mountTo(box,
h('p', { class: 'wiz-res-main' }, _o2z.ok ? (_o2z.bad ? '⚠️ ' : '✅ ') : _o2z.wait ? '⏳ ' : '❌ ', _o2z.ok ? (_o2z.msg || 'Đạt') : (_o2z.cause || _o2z.msg || 'Chưa đạt')),
!_o2z.ok && _o2z.fix ? h('p', { class: 'wiz-fix', 'data-testid': 'wiz-fix' }, h('strong', null, 'Cách sửa: '), _o2z.fix) : null,
!_o2z.ok && _o2z.img ? _o14(_o2z.img, !!_o2z.fix) : null,
!_o2z.ok && _o2z.tech && (_o2z.tech.ref || _o2z.tech.reason) ? h('details', { class: 'wiz-tech', 'data-testid': 'wiz-tech' }, h('summary', { class: 'small' }, 'Chi tiết kỹ thuật'),
h('p', { class: 'small mono' }, [_o2z.tech.ref && 'Mã lỗi: ' + _o2z.tech.ref, _o2z.tech.reason && 'Lý do: ' + _o2z.tech.reason].filter(Boolean).join(' · '))) : null,
!_o2z.ok && typeof _o2z.url === 'string' && /^https:\/\//.test(_o2z.url) ? h('div', { class: 'btn-row' }, h('a', { class: 'btn btn-secondary', href: _o2z.url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'wiz-fix-link' }, h('span', null, _o2z.url_label || 'Mở trang'))) : null,
_o2z.warn ? h('p', { class: 'wiz-warn' }, '⚠️ ', _o2z.warn) : null,
Array.isArray(_o2z.items) && _o2z.items.length ? h('ul', { class: 'wiz-items', 'data-testid': 'wiz-items' }, _o2z.items.map((_o3w) => h('li', { class: _o3w.skipped ? 'is-skip' : _o3w.ok === false ? 'is-bad' : _o3w.pending ? 'is-owe' : '', dataset: { item: _o3w.id || '' } },
_o3w.skipped ? '⏭ ' : _o3w.ok === true ? '✅ ' : _o3w.ok === false ? '❌ ' : '⚠️ ', h('strong', null, _o3w.label), _o3w.skipped ? ' – Bỏ qua – không bắt buộc' : _o3w.detail ? ' – ' + _o3w.detail : '', _o3w.ok === false && _o3w.fix ? h('div', { class: 'muted small' }, 'Cách sửa: ' + _o3w.fix) : null,
_o3w.pending && _o3w.step ? h('div', { class: 'btn-row' }, button('Làm bước ' + _o3w.label, () => _o1e(_o3w.step), { kind: 'secondary', small: true, icon: 'next', testid: 'wiz-owe-go-' + _o3w.step })) : null))) : null);
}
function _o1e(id) { const _o3r = _o30; _o30 = true; try { set(M.goTo(ctl.state, id)); } catch (e) { _o30 = _o3r; ui.toast(e.message, 'warn'); } }
function _o14(key, hasFix = false) {
const _o3w = ctl.guideImage ? ctl.guideImage(key) : null;
if (!_o3w) return null;
return h('figure', { class: 'wiz-fig', 'data-testid': 'wiz-fix-img' },
h('a', { href: _o3w.src, target: '_blank', rel: 'noopener', class: 'wiz-shot-link', title: 'Mở ảnh cỡ lớn' }, h('img', { src: _o3w.src, alt: _o3w.alt || 'Ảnh minh hoạ cách sửa', loading: 'lazy', class: 'wiz-shot', width: _o3w.w, height: _o3w.h })),
_o3w.caption && !hasFix ? h('figcaption', { class: 'muted small' }, _o3w.caption) : null);
}
function _or() {
if (!(ctl.sale && ctl.demo && ctl.mode === 'pre') || ctl.portal) return null;
return h('div', { class: 'wiz-demo', 'data-testid': 'wiz-demo-note' },
h('p', null, h('strong', null, 'Chỉ muốn xem app trước? '), '"Xem thử" chạy một máy chủ giả ngay trong trình duyệt này – CHƯA PHẢI cài thật: ',
'dữ liệu nhập lúc Xem thử chỉ nằm trong trình duyệt này và sẽ không chuyển sang máy chủ thật. 2 bước cài máy chủ sẽ ghi "bỏ qua".'),
button('Xem thử trước (chưa cài thật)', async () => {
const ok = await ui.confirm('Xem thử app bằng máy chủ giả trong trình duyệt? App sẽ ghi "' + NOT_REAL_TEXT + '" cho tới khi anh/chị cài và nối máy chủ thật (Cài đặt › Kết nối). Không nhập khách thật lúc Xem thử.', { ok: 'Xem thử', title: 'Xem thử – chưa cài thật' });
if (ok) { if (ctl.api && !ctl.evProbe) _o6(); set(M.skipDemo(ctl.state)); }
}, { kind: 'ghost', small: true, testid: 'wiz-demo-skip', icon: 'layout' }));
}
function _o6() {
if (ctl.evNeed === undefined && ctl.api && !ctl.evProbe) {
ctl.evProbe = ctl.api.call('status').then((_o2z) => { const _o27 = !(_o2z && _o2z.setup === false && !_o2z.email_verify), _o3r = ctl.evNeed !== false; ctl.evNeed = _o27; if (_o3r !== _o27) render(); })
.catch(() => { ctl.evNeed = true; });
}
return ctl.evNeed !== false;
}
function _o12(ev) {
try {
if (ev && ev.verified) sessionStorage.setItem('bds:setup_email', JSON.stringify({ email: ev.email, code: ev.code || '', use_account_email: !!ev.use_account_email, at: ev.at || Date.now() }));
} catch { }
}
function _o5(_oo, patch) {
const ev = ctl.ev;
if (ev && ev.verified) {
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-account-box' },
h('p', { class: 'ev-ok', 'data-testid': 'wiz-ev-done' }, '✅ ' + (ev.use_account_email ? 'Dùng email tài khoản Google: ' : 'Email đã xác nhận: ') + ev.email),
h('p', { class: 'muted small' }, 'Bấm "Tạo tài khoản" bên dưới để đặt tên đăng nhập và mật khẩu. Tạo xong, app tự quay lại trợ lý.'),
button('Dùng email khác', () => { ctl.ev = null; render(); }, { kind: 'ghost', small: true, testid: 'wiz-ev-change' }));
}
const box = emailCodeBox({
ui, api: ctl.api, testid: 'wiz-ev', email: _oo.email || '', persistKey: 'bds:wizard:ev',
label: 'Email của anh/chị (bắt buộc)', hint: 'App gửi mã 6 số tới email này. Email đã xác nhận dùng để nhận mã khi quên mật khẩu (sửa sau ở Cài đặt › Thông tin cá nhân).',
send: (em) => ctl.api.call('email.verify_start', { email: em, purpose: 'setup' }),
verify: (em, code) => ctl.api.call('email.verify_check', { email: em, code }),
allowAccountEmail: true,
onVerified: (v) => { ctl.ev = { email: v.email, code: v.code, verified: true, use_account_email: !!v.use_account_email, at: Date.now() }; patch({ email: v.email }); render(); }
});
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-account-box' }, box,
h('p', { class: 'muted small' }, 'Xác nhận email xong, nút "Tạo tài khoản" bên dưới mới bật.'));
}
function _o9() {
if (ctl.portal) {
return h('div', { class: 'wiz-note wiz-app-origin', 'data-testid': 'wiz-app-origin-portal' },
h('p', null, h('strong', null, 'Hộp trong Sheet hỏi "địa chỉ app riêng"?'), ' Bỏ trống ô đó – app riêng của anh/chị chưa có, sẽ được tạo ở bước "Địa chỉ app" ngay sau.'),
h('p', { class: 'muted small' }, 'Trong hộp của Sheet, bấm "Chép URL" rồi dán vào ô "Địa chỉ máy chủ (kết thúc bằng /exec)" bên dưới.'));
}
let origin = '';
try { origin = location.origin || ''; } catch { origin = ''; }
if (!/^https?:\/\//.test(origin)) return null;
const _o37 = h('span', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'wiz-app-origin-say' });
return h('div', { class: 'wiz-note wiz-app-origin', 'data-testid': 'wiz-app-origin' },
h('p', null, 'Địa chỉ app của anh/chị: ', h('strong', { class: 'mono', 'data-testid': 'wiz-app-origin-url' }, origin)),
h('div', { class: 'btn-row' }, button('Chép địa chỉ app', async () => { const _o1o = await copyText(origin); _o37.textContent = _o1o === 'copied' ? 'Đã chép.' : 'Chưa chép tự động được – chọn dòng trên rồi chép.'; },
{ kind: 'secondary', small: true, icon: 'copy', testid: 'wiz-app-origin-copy' }), _o37),
h('p', { class: 'muted small' }, 'Hộp trong Sheet hỏi "địa chỉ app riêng"? Dán địa chỉ này vào đó (lần sau Sheet có nút mở app tự nối).'));
}
function _o3v(s, st) {
const _oo = st.data || {};
const patch = (p) => ctl.set(M.setData(ctl.state, p));
switch (s.id) {
case 'prepare': {
const _o24 = _oo.checklist || {};
return h('div', { class: 'wiz-box wiz-check-list', 'data-testid': 'wiz-checklist' }, CHECKLIST.map((_ob) => {
const f = ui.field({ label: _ob.label + (_ob.required ? ' *' : _ob.recommended ? ' (nên có trước khi dùng thật)' : ' (tuỳ chọn)'), type: 'checkbox', value: !!_o24[_ob.id], id: 'wiz-ck-' + _ob.id,
onChange: (v) => patch({ checklist: { ...((ctl.state.data || {}).checklist || {}), [_ob.id]: !!v } }) });
return h('div', { class: ['wiz-ck', _ob.id === 'workspace' && 'wiz-ck-warn'] }, f, h('p', { class: 'muted small' }, _ob.hint));
}), CHECKLIST.some((_ob) => _ob.required) ? h('p', { class: 'muted small' }, '* bắt buộc') : null);
}
case 'company': {
const _ob = _oo.company || {};
const _o36 = (p) => patch({ company: { ...((ctl.state.data || {}).company || {}), ...p } });
const name = ui.field({ label: 'Tên công ty', value: _ob.name || '', id: 'wiz-co-name', autocomplete: 'organization', onInput: (v) => _o36({ name: String(v || '').trim() }) });
const tax = ui.field({ label: 'Mã số thuế', value: _ob.tax || '', id: 'wiz-co-tax', inputmode: 'numeric', hint: '10 số; chi nhánh: 10 số-3 số', onInput: (v) => _o36({ tax: String(v || '').replace(/\s+/g, '') }) });
const _o2t = h('img', { class: 'wiz-logo', alt: 'Logo công ty', src: _ob.logo || '', hidden: !_ob.logo, 'data-testid': 'wiz-logo-preview' });
const logo = ui.field({ label: 'Logo (PNG/JPG)', type: 'file', accept: 'image/png,image/jpeg,image/webp,image/svg+xml', id: 'wiz-co-logo',
onChange: async (files) => {
const f = files && files[0]; if (!f) return;
try { const url = await shrinkLogo(f); _o36({ logo: url }); _o2t.src = url; _o2t.hidden = false; } catch (e) { ui.toast('Không đọc được ảnh logo: ' + (e.message || e), 'warn'); }
} });
return h('div', { class: 'wiz-box grid-2' }, name, tax, h('div', null, logo, _o2t));
}
case 'allow': {
const co = st.flow === 'company' ? ui.field({ label: 'Tôi đang dùng tài khoản Google CÔNG TY (không phải Gmail cá nhân của nhân viên)', hint: 'Đang thử trước bằng Gmail cá nhân: để trống ô này – vẫn đi tiếp được, biên bản ghi "chưa làm".', type: 'checkbox', value: !!_oo.companyAccount, id: 'wiz-company-account', onChange: (v) => patch({ companyAccount: !!v }) }) : null;
const url = ui.field({ label: URL_FIELD_LABEL, value: _oo.url || '', id: 'wiz-url', inputmode: 'url', autocomplete: 'off', placeholder: 'https://script.google.com/macros/s/…/exec',
hint: _o3a('Dán địa chỉ vừa bấm "Chép URL" trong hộp của Sheet (Ctrl+V). Bấm "Mở BDS Studio và kết nối" trong Sheet thì app tự điền.'),
onInput: (v) => { const _o3w = String(v || '').trim(); if (_o3w && ctl.linkProblem) ctl.linkProblem = null; patch({ url: _o3w }); } });
return h('div', { class: 'wiz-box' },
_o1y(),
ctl.fromLink && _oo.url === ctl.fromLink ? h('p', { class: 'muted small', 'data-testid': 'wiz-from-link' }, _o3a('Địa chỉ máy chủ nhận từ nút "Mở BDS Studio và kết nối" trong Sheet') + ' – trợ lý tự kiểm. Chưa đạt: làm theo "Cách sửa" bên dưới rồi bấm "Kiểm tra bước này".') : null,
st.flow === 'company' ? h('p', { class: 'wiz-warn', role: 'note' }, '⚠️ Nên dùng tài khoản Google Workspace do quản trị viên công ty giữ – dùng Gmail cá nhân để thử cũng được, nhưng trước khi dùng thật hãy chuyển sang tài khoản công ty để nhân viên nghỉ việc không mang dữ liệu đi.') : null,
co, url, _o9(),
ctl.demo && !ctl.sale ? h('p', { class: 'muted small', 'data-testid': 'wiz-demo-note' }, 'Đang xem thử: để trống ô và bấm "Kiểm tra bước này" để dùng máy chủ xem thử ngay trong trình duyệt.') : null,
_or());
}
case 'account': {
if (ctl.mode !== 'pre') return null;
const _o2x = privacyLine(h, { testid: 'wiz-privacy', lead: 'Tạo tài khoản là anh/chị đã đọc ', cfg: ctl.config || undefined });
if (_o6()) { const w = _o5(_oo, patch); if (_o2x && w) w.appendChild(_o2x); return w; }
const err = h('p', { class: 'small form-err', 'aria-live': 'polite', 'data-testid': 'wiz-email-err' });
const em = ui.field({ label: 'Email nhận mã khi quên mật khẩu (tuỳ chọn)', type: 'email', value: _oo.email || '', id: 'wiz-email', inputmode: 'email', autocomplete: 'email', placeholder: 'email của anh/chị',
hint: 'Bỏ trống: mã đặt lại mật khẩu gửi về email của tài khoản Google đã cài máy chủ (và Telegram nếu đã nối). Sửa sau ở Cài đặt › Thông tin cá nhân.',
onInput: (v) => { const _o3w = String(v || '').trim(); patch({ email: _o3w }); err.textContent = _o3w && !EMAIL_RE.test(_o3w) ? 'Email chưa đúng (cần đủ dạng tên, chữ @, tên miền).' : ''; } });
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-account-box' }, em, err,
h('p', { class: 'muted small' }, 'Bấm "Tạo tài khoản" bên dưới. Tạo xong, app tự quay lại trợ lý.'), _o2x);
}
case 'backup':
case 'tfa': {
const box = h('div', { class: 'wiz-box', 'data-testid': 'wiz-tfa-box' });
if (ctl.renderTfa) ctl.renderTfa(box); else box.append(button('Mở Cài đặt › Bảo mật', () => ctl.goSettings('security'), { kind: 'secondary', small: true }));
return box;
}
case 'domain': return st.flow === 'company' ? companyDomainWidget(ctl, { ui, rerender: render }) : _ow(_oo, patch).body;
case 'diachi': return diachiWidget(ctl, { ui, rerender: render });
case 'doingu': return ctl.mode === 'pre' ? null : doinguWidget(ctl, { ui, rerender: render });
case 'engine': return _o11();
case 'finish': return h('div', { class: 'wiz-box' }, _o35(st));
case 'handover': return _o1i(_oo, patch);
default: return null;
}
}
function _ow(_oo, patch, howTo = null) {
const mode = (_oo.domain && _oo.domain.mode) || (ctl.state.flow === 'company' ? 'custom' : 'shared');
const _op = (ctl.defaultAddress && ctl.defaultAddress()) || { own: true, text: 'Địa chỉ mặc định: ' + (ctl.sharedHost || 'địa chỉ đang mở') + ' – bản app riêng của anh/chị, dữ liệu nằm trong Google của anh/chị, không dùng chung với ai.' };
const host = ui.field({ label: 'Tên miền riêng', value: (_oo.domain && _oo.domain.host) || '', id: 'wiz-domain-host', placeholder: 'app.congty.vn', inputmode: 'url', autocomplete: 'off',
onInput: (v) => { patch({ domain: { mode: 'custom', host: String(v || '').trim() } }); _o2k(); } });
const _ol = h('div', { class: 'wiz-cname', 'data-testid': 'wiz-cname' });
const _on = h('div', { class: 'wiz-custom', hidden: mode !== 'custom', 'data-testid': 'wiz-domain-custom' }, howTo, host, _ol);
const shared = h('div', { hidden: mode === 'custom', 'data-testid': 'wiz-domain-shared' },
h('p', { class: _op.own ? 'muted small' : 'wiz-note', 'data-testid': 'wiz-domain-default' }, _op.own ? _op.text : '⏳ ' + _op.text),
_op.own ? null : wishBox(ctl, ui, { company: false, showDefer: false }));
const seg = ui.segmented([{ value: 'shared', label: 'Địa chỉ mặc định (miễn phí)', icon: 'home' }, { value: 'custom', label: 'Tên miền riêng', icon: 'link' }], mode, (v) => {
patch({ domain: { ...((ctl.state.data || {}).domain || {}), mode: v } }); _on.hidden = v !== 'custom'; shared.hidden = v === 'custom';
render();
}, { label: 'Địa chỉ mở app', name: 'wiz-domain-mode' });
if (!(_oo.domain && _oo.domain.mode)) patch({ domain: { ...(_oo.domain || {}), mode } });
function _o2k() {
const _o1q = normHost(host.getValue());
const _o3h = _o1q ? _o1q.split('.')[0] : 'app';
const target = (ctl.cnameTarget && ctl.cnameTarget()) || '';
ui.mountTo(_ol, ui.table([{ k: 'Loại (Type)', v: 'CNAME – dòng trỏ tên miền con sang địa chỉ của app' }, { k: 'Tên (Name/Host)', v: _o3h },
{ k: 'Trỏ tới (Target/Value)', v: target || '(bên bán gửi qua email – xem dưới)' }, { k: 'TTL (thời gian lưu tạm)', v: 'Tự động (Auto)' }],
[{ label: 'Ô cần điền', key: 'k' }, { label: 'Giá trị', key: 'v' }]),
h('p', { class: 'muted small' }, 'Thêm xong có thể mất 5 phút đến 24 giờ mới chạy. Chưa chạy thì bấm "Làm sau", trợ lý nhắc lại.'));
}
_o2k();
let _o38 = {}; try { _o38 = supportContact(ctl.config) || {}; } catch { _o38 = {}; }
const em = _o38.email || supportEmail(ctl.config);
const _o1w = !!(ctl.cnameTarget && ctl.cnameTarget());
const _om = h('p', { class: 'wiz-note', 'data-testid': 'wiz-domain-contact' },
'Tên miền riêng được gắn vào app riêng của anh/chị ở phía bên bán. Gửi email tới ', h('a', { href: 'mailto:' + em + '?subject=' + encodeURIComponent('Gắn tên miền riêng cho BDS Studio'), 'data-testid': 'wiz-domain-mail' }, em),
_o38.zalo ? ' (hoặc Zalo ' + _o38.zalo + ')' : '',
_o1w ? ' kèm tên miền muốn dùng (vd app.tencuaban.vn) sau khi thêm bản ghi CNAME như bảng trên: bên bán gắn tên miền vào app và báo khi xong.'
: ' kèm tên miền muốn dùng (vd app.tencuaban.vn): bên bán gửi lại giá trị "Trỏ tới" của bản ghi CNAME và báo khi đã gắn xong.');
_on.append(_om);
return { seg: h('div', { class: 'wiz-box wiz-domain-mode', 'data-testid': 'wiz-domain-toggle' }, seg), body: h('div', { class: 'wiz-box', 'data-testid': 'wiz-domain' }, shared, _on) };
}
function _o11() {
const panel = h('div', { class: 'wiz-os-panel', 'data-testid': 'wiz-engine-os', 'aria-live': 'polite' });
const _o2j = (os) => {
panel.dataset.os = os;
ui.mountTo(panel, h('h4', { class: 'wiz-h3' }, os === 'win' ? 'Windows 10/11' : 'Mac (chip Apple hoặc Intel)'),
h('ol', { class: 'wiz-os-steps', 'data-testid': 'wiz-engine-steps-' + os }, ENGINE_GUIDE[os].map((t) => h('li', null, t))));
};
const os = detectOs();
const seg = ui.segmented([{ value: 'mac', label: 'Mac' }, { value: 'win', label: 'Windows' }], os, (v) => _o2j(v), { label: 'Máy tính cài máy dựng', name: 'wiz-engine-os' });
_o2j(os);
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-engine' }, seg, panel,
h('p', { class: 'wiz-note', 'data-testid': 'wiz-engine-tier' }, ENGINE_GUIDE.tier),
h('p', { class: 'muted small', 'data-testid': 'wiz-engine-full' }, ENGINE_GUIDE.full));
}
function _o35(st) {
const box = h('div', { class: 'wiz-samples', 'data-testid': 'wiz-samples' }, ui.spinner());
if (!ctl.samples) { box.remove(); return null; }
_o2m(box, st);
return box;
}
async function _o2m(box, st) {
let _o26 = 0;
try { _o26 = await ctl.samples.count(); } catch { _o26 = 0; }
const load = button('Xem ví dụ', async () => { const _o2z = await ctl.samples.load(); ui.toast('Đã nạp ví dụ: ' + _o2z.projects + ' dự án, ' + _o2z.customers + ' khách (tên có chữ "Mẫu").', 'ok', 5000); _o2m(box, ctl.state); }, { kind: 'secondary', small: true, testid: 'wiz-samples-load' });
const clear = button('Xoá toàn bộ dữ liệu mẫu', async () => {
if (!(await ui.confirm('Xoá toàn bộ dữ liệu mẫu (dự án, khách, nhắc việc có chữ "Mẫu")? Dữ liệu anh/chị tự nhập không bị đụng tới.', { ok: 'Xoá dữ liệu mẫu', kind: 'danger' }))) return;
const k = await ctl.samples.clear(); ui.toast('Đã xoá ' + k + ' mục dữ liệu mẫu.', 'ok'); _o2m(box, ctl.state);
}, { kind: 'danger', small: true, testid: 'wiz-samples-clear' });
ui.mountTo(box,
h('h4', { class: 'section-title' }, 'Dữ liệu mẫu'),
_o26 ? h('p', { 'data-testid': 'wiz-samples-count' }, 'Đang có ' + _o26 + ' mục dữ liệu mẫu (tên có chữ "Mẫu") để anh/chị xem chỗ nào nhập gì. Ảnh trong dữ liệu mẫu là ảnh minh hoạ.')
: h('p', { class: 'muted small', 'data-testid': 'wiz-samples-count' }, st && st.flow === 'company' ? 'Bản công ty bắt đầu sạch, không có dữ liệu mẫu. Muốn xem ví dụ chỗ nào nhập gì thì bấm "Xem ví dụ" (xoá được 1 chạm).' : 'Không còn dữ liệu mẫu.'),
h('div', { class: 'btn-row' }, _o26 ? clear : load));
}
function _o1i(_oo, patch) {
const box = h('div', { class: 'wiz-box' }, ui.spinner());
ctl.handover().then((data) => {
const doc = _o1h(data);
const signed = ui.field({ label: 'Đã in và hai bên đã ký', type: 'checkbox', value: !!_oo.handoverSigned, id: 'wiz-handover-signed', onChange: (v) => patch({ handoverSigned: !!v, handoverAt: v ? Date.now() : 0 }) });
ui.mountTo(box, doc,
h('div', { class: 'btn-row' },
button('In / Lưu PDF', () => _o2v(doc), { kind: 'primary', small: true, testid: 'wiz-handover-print' }),
button('Tải tệp chữ', () => download('bien-ban-ban-giao-bds-studio.txt', handoverText(data)), { kind: 'secondary', small: true, testid: 'wiz-handover-download' })),
signed);
}).catch((e) => ui.mountTo(box, h('p', { class: 'form-err' }, 'Không tạo được biên bản: ' + (e.message || e))));
return box;
}
function _o1h(_oo) {
const _o32 = (k, v) => h('tr', null, h('th', null, k), h('td', null, v || '…'));
return h('article', { class: 'wiz-doc', 'data-testid': 'wiz-handover' },
h('header', { class: 'wiz-doc-head' }, _oo.company.logo ? h('img', { src: _oo.company.logo, alt: '', class: 'wiz-doc-logo' }) : null,
h('div', null, h('h3', null, 'BIÊN BẢN BÀN GIAO CÀI ĐẶT BDS STUDIO'), h('p', null, 'Ngày ' + _oo.date))),
h('table', { class: 'wiz-doc-kv' }, h('tbody', null,
_o32('Bên nhận', _oo.company.name), _o32('Mã số thuế', _oo.company.tax),
_o32('Tài khoản Quản trị (Admin)', _oo.owner.username ? '@' + _oo.owner.username + (_oo.owner.full_name ? ' (' + _oo.owner.full_name + ')' : '') : ''),
_o32('Địa chỉ mở app', _oo.domain),
_o32('Phiên bản', 'web ' + (_oo.versions.web || '?') + ' · máy chủ ' + (_oo.versions.server || '?') + (_oo.versions.engine ? ' · máy dựng ' + _oo.versions.engine : '')),
_o32('Kiểm tra toàn bộ', _oo.check ? _oo.check.text : 'chưa chạy'),
_oo.license ? _o32('Bản quyền', _oo.license) : null)),
h('h4', null, 'Người dùng (' + _oo.users.length + ')'),
_oo.users.length ? h('ul', null, _oo.users.map((_o3n) => h('li', null, '@' + _o3n.username + ' · ' + (_o3n.full_name || '') + ' · ' + (_o3n.role_label || roleVi(_o3n.role)) + ' · 2 lớp: ' + _o3n.tfa))) : h('p', null, '—'),
h('h4', null, 'Các bước đã làm'),
h('ul', { class: 'wiz-doc-steps' }, _oo.steps.map((s) => h('li', null, (_o2[s.status] || '▫️') + ' ' + s.title + (s.msg ? ' – ' + s.msg : '')))),
_oo.pending.length ? h('p', null, h('strong', null, 'Còn để sau: '), _oo.pending.join('; ')) : null,
_oo.notDone && _oo.notDone.length ? h('p', { 'data-testid': 'wiz-doc-notdone' }, h('strong', null, 'Chưa làm (cần trước khi dùng thật): '), _oo.notDone.join('; ')) : null,
h('ul', { class: 'wiz-doc-notes' }, _oo.notes.map((_o26) => h('li', null, _o26))),
h('div', { class: 'wiz-doc-sign' }, h('div', null, h('strong', null, 'BÊN CÀI ĐẶT'), h('span', null, '(ký, ghi rõ họ tên)')), h('div', null, h('strong', null, 'BÊN NHẬN'), h('span', null, '(ký, ghi rõ họ tên, đóng dấu)'))));
}
function _o2v(doc) {
const _oa = h('div', { id: 'wiz-print-area' }, doc.cloneNode(true));
document.body.appendChild(_oa);
document.body.classList.add('wiz-printing');
const done = () => { document.body.classList.remove('wiz-printing'); _oa.remove(); window.removeEventListener('afterprint', done); };
window.addEventListener('afterprint', done);
try { window.print(); } finally { setTimeout(done, 1500); }
}
function _o1n(st) {
try {
return finishCard(ui, { appUrl: appUrlFor({ portal: !!ctl.portal, state: st }), portal: !!ctl.portal, testid: 'wiz-a2hs',
start: _o4, onState: (k) => { _o4 = k; } });
} catch { return null; }
}
function _oy(st) {
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
button('Xem lại các bước', () => { _o30 = true; render(); }, { kind: 'ghost', testid: 'wiz-review' }),
ctl.goSettings && ctl.mode !== 'pre' ? button('Nối máy chủ thật', () => ctl.goSettings('connection'), { kind: 'secondary', testid: 'wiz-go-connection-real' }) : null,
ctl.close ? button('Vào xem thử app', () => ctl.close(), { kind: 'primary', testid: 'wiz-close' }) : null));
}
const _o2g = M.pendingRequired(st);
const _o2h = new Set(_o2g.map((_o3w) => _o3w.id));
const _o2e = later.filter((s) => !_o2h.has(s.id));
return h('div', { class: 'wiz-done', 'data-testid': 'wiz-done' },
h('div', { class: 'wiz-done-ico', 'aria-hidden': 'true' }, _o2g.length ? '⚠️' : '🎉'),
h('h2', { class: 'wiz-h2', tabindex: '-1', 'data-testid': 'wiz-step-title' }, _o2g.length ? 'Dùng app được rồi – còn ' + _o2g.length + ' bước bắt buộc' : 'Cài đặt xong!'),
h('p', null, 'Đã xong ' + p.done + '/' + p.total + ' bước' + (st.flow === 'company' ? ' – đã có biên bản bàn giao.' : '.')),
_o2g.length ? h('div', { class: 'wiz-warn', role: 'note', 'data-testid': 'wiz-done-owe' },
h('p', null, '⚠️ Chưa xong (bắt buộc): ', h('strong', null, _o2g.map((_o3w) => _o3w.title).join(' · ')), '. Làm nốt khi sẵn sàng – nút Trợ lý cài đặt ở góc màn hình đưa anh/chị quay lại.'),
h('div', { class: 'btn-row' }, _o2g.map((_o3w) => button('Làm bước ' + _o3w.title, () => _o1e(_o3w.id), { kind: 'secondary', small: true, icon: 'next', testid: 'wiz-done-go-' + _o3w.id })))) : null,
_o2e.length ? h('p', { class: 'muted small' }, 'Để sau: ' + _o2e.map((s) => s.title).join(' · ') + '. Mở lại bất kỳ lúc nào ở Cài đặt › Trợ lý cài đặt.') : null,
_o1n(st),
ctl.samples ? _o35(st) : null,
h('div', { class: 'btn-row' },
button('Xem lại các bước', () => { _o30 = true; render(); }, { kind: 'ghost', testid: 'wiz-review' }),
ctl.close ? button('Vào dùng app', () => ctl.close(), { kind: 'primary', testid: 'wiz-close' }) : null));
}
async function _o1l() {
const text = await ctl.diagnostics();
const ta = h('textarea', { class: 'wiz-report', readonly: true, rows: 12, 'data-testid': 'wiz-report', 'aria-label': 'Báo cáo cài đặt' });
ta.value = text;
const share = typeof navigator !== 'undefined' && navigator.share;
let _o3i = ctl.config.SUPPORT_EMAIL || '';
if (!_o3i && isSaleEdition(ctl.config)) { try { _o3i = supportContact(ctl.config).email; } catch { _o3i = ''; } _o3i = _o3i || supportEmail(ctl.config); }
const _o20 = _o3i ? 'mailto:' + encodeURIComponent(_o3i) + '?subject=' + encodeURIComponent('Cần giúp cài BDS Studio') + '&body=' + encodeURIComponent(text.slice(0, 1800)) : '';
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
_o20 ? h('a', { class: 'btn btn-secondary btn-sm', href: _o20, 'data-testid': 'wiz-report-mail' }, 'Gửi email') : null)),
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
const img = await new Promise((res, rej) => { const _o1r = new Image(); _o1r.onload = () => res(_o1r); _o1r.onerror = () => rej(new Error('tệp không phải ảnh')); _o1r.src = url; });
const k = Math.min(1, max / Math.max(img.naturalWidth || max, img.naturalHeight || max));
const _ob = document.createElement('canvas');
_ob.width = Math.max(1, Math.round((img.naturalWidth || max) * k)); _ob.height = Math.max(1, Math.round((img.naturalHeight || max) * k));
_ob.getContext('2d').drawImage(img, 0, 0, _ob.width, _ob.height);
let _o2f = _ob.toDataURL('image/png');
if (_o2f.length > 60000) _o2f = _ob.toDataURL('image/jpeg', 0.85);
return _o2f;
} finally { URL.revokeObjectURL(url); }
}
export default { mountWizard, shrinkLogo };

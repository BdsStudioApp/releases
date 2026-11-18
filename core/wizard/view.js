import * as M from './machine.js';
import { engineDownload } from '../engine_dl.18c8a720c5.js';
import { FLOW_INTRO, FLOW_LABEL, CHECKLIST, ENGINE_GUIDE, URL_FIELD_LABEL, supportEmail, isSaleEdition, boldParts } from './steps.js';
import { browserProblems, browserEnv, normHost } from './checks.js';
import { handoverText, roleVi } from './report.js';
import { copyText } from '../updates.9704b81308.js';
import { supportContact, privacyLine } from '../instance.0601c79adf.js';
import { diachiWidget, wishBox } from './diachi.js';
import { gcaiWidget } from './gcai_view.js';
import { available as gcaiAvailable, isPhone } from './gcai.js';
import { companyDomainWidget } from './tenmien_cty.js';
import { doinguWidget } from './doingu.js';
import { emailCodeBox } from '../email_verify.c44911bb1b.js';
import { hwCheckPanel } from './hwcheck.js';
import { finishCard, appUrlFor } from '../a2hs.6e7a288a0e.js';
import { EVENT as VIDEO_EVENT, MODE_TEXT as VIDEO_MODE } from '../video_screens.2ab623260d.js';
const STATUS_ICON = { ok: '✅', fail: '❌', skip: '⏭', later: '⏳' };
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
function _o7(root, ui) {
for (const b of root.querySelectorAll('button, a.btn')) {
if (b.querySelector(BTN_ICON_SEL)) continue;
const size = b.classList.contains('btn') ? (b.classList.contains('btn-sm') ? 18 : 20) : 16;
b.prepend(ui.icon(iconForLabel(b.textContent || b.getAttribute('aria-label')), size));
}
}
function _o35(container, ui) {
if (container.__wizIcons || typeof MutationObserver === 'undefined' || typeof ui.icon !== 'function') return;
container.__wizIcons = new MutationObserver(() => _o7(container, ui));
container.__wizIcons.observe(container, { childList: true, subtree: true });
}
export function mountWizard(container, ctl) {
const { ui } = ctl;
const { h, button } = ui;
let _o3 = '';
let _o2i = !!ctl.review;
_o35(container, ui);
const _o31 = ctl.mode === 'pre' && typeof history !== 'undefined' && typeof window !== 'undefined' && typeof history.pushState === 'function';
let _o2b = false;
if (_o31) {
try { const _o1f = history.state; if (!_o1f || (!_o1f.bdsWiz && !_o1f.bdsWizBase)) history.replaceState({ ...(_o1f || {}), bdsWizBase: true }, ''); } catch { }
window.addEventListener('popstate', _o1y);
}
render();
return { render };
function set(s) { ctl.set(s); render(); }
function _o1c(_o2t) { return _o2t && _o2t.flow ? (_o2t.finished && M.isFinished(_o2t) ? '_done' : _o2t.cur) : '_start'; }
function _o2x(_o2t) {
if (!_o31 || _o2b) return;
const key = _o1c(_o2t);
const cur = history.state && history.state.bdsWiz;
if (cur === key) return;
try { history.pushState({ ...(history.state || {}), bdsWiz: key }, ''); } catch { }
}
async function _o1y(e) {
if (!container.isConnected) { window.removeEventListener('popstate', _o1y); return; }
const id = e && e.state && e.state.bdsWiz;
const _o2t = ctl.state;
if (id && id !== '_start' && id !== '_done' && _o2t && _o2t.flow && id !== _o2t.cur && M.ids(_o2t).includes(id)) {
_o2b = true;
try { set(M.goTo(_o2t, id)); return; } catch { } finally { _o2b = false; }
return;
}
if (id === '_start' && _o2t && _o2t.flow && _od(_o2t)) { _o2b = true; try { set(null); } finally { _o2b = false; } return; }
if (id || !(e && e.state && e.state.bdsWizBase)) return;
const ok = await ui.confirm('Rời Trợ lý cài đặt? Các bước đã làm vẫn được lưu trên máy này – mở lại app là làm tiếp.', { ok: 'Rời trợ lý', title: 'Rời Trợ lý cài đặt?' });
if (ok) { window.removeEventListener('popstate', _o1y); history.back(); return; }
try { history.pushState({ bdsWiz: _o1c(ctl.state) }, ''); } catch { }
}
function render() {
const _o2t = ctl.state;
ui.clear(container);
container.classList.add('wiz');
_o2x(_o2t);
if (!_o2t || !_o2t.flow) return container.append(_oh());
if (_o2t.finished && M.isFinished(_o2t) && !_o2i) return container.append(_ow(_o2t));
container.append(_o1a(_o2t), _o2u(_o2t));
const _o1x = container.querySelector('.wiz-chip.on'); const _o2k = _o1x && _o1x.parentElement;
if (_o2k) _o2k.scrollLeft = Math.max(0, _o1x.offsetLeft - (_o2k.clientWidth - _o1x.offsetWidth) / 2);
const t = container.querySelector('[data-testid="wiz-step-title"]');
if (t && ctl.mode !== 'settings') try { t.focus({ preventScroll: false }); } catch { }
}
function _o1n() {
const p = ctl.linkProblem;
if (!p) return null;
return h('div', { class: 'wiz-result is-bad', role: 'alert', 'data-testid': 'wiz-link-hint' },
h('p', null, h('strong', null, '❌ ' + p.cause)), h('p', { class: 'small' }, h('strong', null, 'Cách sửa: '), p.fix));
}
function _oh() {
const _o2f = browserProblems(browserEnv());
const card = (flow) => {
const f = FLOW_INTRO[flow];
return h('button', { type: 'button', class: 'wiz-flow', 'data-testid': 'wiz-choose-' + flow, onclick: () => {
let _o2l = M.start(flow, { installed: ctl.mode !== 'pre', portal: !!ctl.portal });
if (ctl.pendingUrl && M.ids(_o2l).includes('allow')) { _o2l = M.setData(_o2l, { url: ctl.pendingUrl }); ctl.autoCheck = true; ctl.fromLink = ctl.pendingUrl; if (ctl.clearPending) ctl.clearPending(); }
set(_o2l);
} },
h('span', { class: 'wiz-flow-ico', 'aria-hidden': 'true' }, f.icon),
h('span', { class: 'wiz-flow-text' }, h('strong', null, f.title), h('span', { class: 'muted small' }, f.lead),
h('ul', { class: 'wiz-flow-points' }, f.points.map((p) => h('li', null, p)))));
};
return h('div', { class: 'wiz-choose', 'data-testid': 'wiz-choose' },
h('h1', { class: 'wiz-h1' }, 'Anh/chị dùng BDS Studio cho:'),
ctl.pendingUrl ? h('p', { class: 'wiz-ok', role: 'status', 'data-testid': 'wiz-pending-url' }, '✅ Đã nhận địa chỉ máy chủ từ Sheet. Chọn Cá nhân hoặc Công ty – trợ lý tự điền, tự kiểm máy chủ ở bước "Tạo máy chủ".') : null,
_o1n(),
h('div', { class: 'wiz-flows' }, card('personal'), card('company')),
ctl.loginHere ? h('div', { class: 'wiz-login-here' }, button('Tôi đã cài rồi – đăng nhập trên máy này', () => ctl.loginHere(), { kind: 'secondary', icon: 'user', testid: 'wiz-choose-login' }),
h('p', { class: 'muted small' }, 'Dùng khi đã cài BDS Studio trên máy khác (điện thoại thứ 2, máy tính): chỉ cần địa chỉ máy chủ hoặc link mở app.')) : null,
h('div', { class: 'wiz-pre', 'data-testid': 'wiz-prereq' },
_o2f.length ? [h('p', { class: 'wiz-bad' }, '❌ Máy này chưa đủ điều kiện:'), h('ul', null, _o2f.map((p) => h('li', { 'data-problem': p.id }, h('strong', null, p.cause), ' ', p.fix)))]
: h('p', { class: 'muted small' }, '✅ Trình duyệt và mạng đủ điều kiện. Cần thêm: một tài khoản Google (Gmail hoặc Workspace). Nhân viên/khách không cần cài gì.')),
ctl.mode === 'pre' && !ctl.sale ? h('button', { type: 'button', class: 'link-btn', 'data-testid': 'wiz-skip-all', onclick: () => ctl.skipWizard() }, 'Đã quen cài đặt? Bỏ qua trợ lý') : null,
ctl.mode === 'pre' ? null : h('p', { class: 'muted small' }, 'App đã cài sẵn: các bước tạo máy chủ được tính là xong, trợ lý chỉ dẫn phần còn lại.'));
}
function _o1a(_o2t) {
const p = M.progress(_o2t);
const _of = M.steps(_o2t).map((s, _o1h) => {
const _o2h = _o2t.res[s.id];
const _o1x = s.id === _o2t.cur;
const _ob = _o1x || M.isDone(_o2t, s.id) || _oc(_o2t, s.id);
const _o24 = !!(_o2h && _o2h.s === 'later' && s.required);
return h('li', { class: ['wiz-chip', _o1x && 'on', _o2h && 'is-' + _o2h.s, _o24 && 'is-owe'], dataset: { step: s.id } },
h('button', { type: 'button', disabled: !_ob || _o1x, onclick: () => { try { set(M.goTo(_o2t, s.id)); } catch (e) { ui.toast(e.message, 'warn'); } }, title: s.title + (_o24 ? ' – bắt buộc, chưa xong' : '') },
h('span', { class: 'wiz-chip-n' }, _o24 ? '⚠' : _o2h && _o2h.s === 'fail' && _o2h.wait ? STATUS_ICON.later : _o2h && STATUS_ICON[_o2h.s] ? STATUS_ICON[_o2h.s] : String(_o1h + 1)), h('span', { class: 'wiz-chip-t' }, s.title + (_o24 ? ' (chưa xong)' : ''))));
});
return h('div', { class: 'wiz-head' },
M.isDemo(_o2t) && ctl.demo ? h('p', { class: 'wiz-not-real', role: 'note', 'data-testid': 'wiz-not-real' }, '⚠️ ' + NOT_REAL_TEXT + ' – đang Xem thử bằng máy chủ giả trong trình duyệt này.') : null,
h('div', { class: 'wiz-top' },
h('span', { class: 'wiz-badge', 'data-testid': 'wiz-flow' }, (_o2t.flow === 'company' ? '🏢 ' : '👤 ') + FLOW_LABEL[_o2t.flow]),
h('span', { class: 'wiz-top-sp' }),
_od(_o2t) ? button('Chọn lại', () => set(null), { kind: 'ghost', small: true, testid: 'wiz-rechoose' }) : null,
button('Cần giúp?', () => _o1b(), { kind: 'ghost', small: true, icon: 'help', testid: 'wiz-help' })),
h('div', { class: 'wiz-prog', 'data-testid': 'wiz-progress' },
ui.progress(p.pct, 'Tiến độ cài đặt ' + p.pct + '%'),
h('p', { class: 'muted small' }, M.stepText(_o2t) + ' · đã xong ' + p.done + ' · bước chính ' + p.mainDone + '/' + p.mainTotal)),
h('ol', { class: 'wiz-chips', 'aria-label': 'Các bước' }, _of));
}
function _oc(_o2t, id) { try { M.goTo(_o2t, id); return true; } catch { return false; } }
function _od(_o2t) { return ctl.mode !== 'post' && !Object.keys(_o2t.res).some((id) => id === 'account' && _o2t.res[id].s === 'ok') && _o2t.origin === 'new'; }
function _o2u(_o2t) {
const s = M.current(_o2t);
const resBox = h('div', { class: 'wiz-result', 'data-testid': 'wiz-result', 'aria-live': 'polite' });
_o29(resBox, ctl.last[s.id] || (_o2t.res[s.id] && _o2t.res[s.id].s === 'ok' ? { ok: true, msg: _o2t.res[s.id].msg } : null));
const _o1v = s.id === 'diachi' && !(ctl.provision && ctl.provision.configured);
const deferrable = s.deferrable && !(s.id === 'diachi' && !_o1v);
const _ot = s.id === 'domain' && _o2t.flow !== 'company' ? ((((_o2t.data || {}).domain) || {}).mode || 'shared') : '';
const _op = _ot === 'shared' && ctl.defaultAddress ? ctl.defaultAddress() : null;
const _o33 = !!(_op && _op.own === false);
const badge = s.required ? (deferrable ? ui.badge('Bắt buộc – làm sau được', 'gold') : ui.badge('Bắt buộc', 'gold')) : ui.badge('Tuỳ chọn', 'neutral');
const _o19 = !!ctl.link('template');
const gWay = s.id === 'allow' ? allowWay(_o2t) : '';
const _o15 = gWay === 'google';
const _o2j = (t) => boldParts(t).map((_o39) => (_o39.b ? h('strong', null, _o39.t) : _o39.t));
const todo = (_o1v && s.todoNoService) || (_ot === 'shared' && (_o33 ? s.todoSharedWait : s.todoShared)) || (_o15 && s.todoGoogle) || (!_o19 && s.todoManual) || s.todo || [];
const _o36 = s.actions.some((_o2) => _o2.way);
const _o1q = s.actions.filter((_o2) => !(_o2.alt && _o2.link && !ctl.link(_o2.link)) && (_o19 ? _o2.way !== 'manual' : _o2.way !== 'copy'));
const actions = h('ol', { class: 'wiz-actions', 'data-testid': 'wiz-actions' }, _o1q.map((_o2, _o1h) => _o6(_o2, _o1h)));
const _o1r = _o36 && _o19 ? s.actions.filter((_o2) => _o2.way === 'manual') : [];
const manualBox = _o1r.length ? h('details', { class: 'wiz-manual', 'data-testid': 'wiz-manual' }, h('summary', null, 'Cách dự phòng: dán tay (khi link Tạo bản sao không mở được)'),
h('ol', { class: 'wiz-actions' }, _o1r.map((_o2, _o1h) => _o6(_o2, _o1h)))) : null;
const noTplNote = _o36 && !_o19 ? h('p', { class: 'wiz-note', 'data-testid': 'wiz-no-template' }, 'Bên bán chưa cài link "Tạo bản sao" – tạo máy chủ bằng cách dán tay 3 tệp dưới đây (các nút Chép đã kiểm mã).') : null;
const runCheck = async () => {
ui.mountTo(resBox, ui.spinner(), ' Đang kiểm tra…');
const _o2h = await ctl.run(s.id, { ...argsFor(s.id), onProgress: (msg) => ui.mountTo(resBox, ui.spinner(), ' ' + msg) });
_o29(resBox, _o2h);
set(M.record(ctl.state, s.id, _o2h));
if (s.id === 'engine' && _o2h && _o2h.ok) _o32({ type: 'engine_ok' });
return _o2h;
};
const goNext = async () => {
if (!M.canNext(ctl.state)) { ui.toast('Bấm "' + _oe + '" – xanh rồi mới sang bước kế.', 'warn'); return; }
if (ctl.beforeNext && (await ctl.beforeNext(s.id)) === false) return;
set(M.next(ctl.state));
};
if (s.id === 'allow' && ctl.autoCheck && ((_o2t.data || {}).url)) {
ctl.autoCheck = false;
setTimeout(async () => { const _o2h = await runCheck(); if (_o2h && _o2h.ok) await goNext(); }, 0);
}
const _o1k = s.id === 'account' && ctl.mode === 'pre';
const choice = s.choice ? _ox(_o2t) : null;
const _oj = choice === 'skip' && !M.isDone(_o2t, s.id);
const _o21 = choice === 'online';
const _oe = s.id === 'finish' ? 'Kiểm tra toàn bộ' : 'Kiểm tra bước này';
const _o26 = !!(s.required && _o2t.res[s.id] && _o2t.res[s.id].s === 'later');
const _ov = M.isDone(_o2t, s.id) && !_o26;
const _o2s = M.canSkip(s) && (s.id !== 'diachi' || _o1v) && !_o21;
const _o2r = _o2s && (_oj || _o1v || _o33) && !_ov;
const _o12 = h('div', { class: 'wiz-foot' },
(() => {
const _o2d = M.back(_o2t) !== _o2t, toChooser = !_o2d && M.ids(_o2t).indexOf(_o2t.cur) <= 0 && _od(_o2t);
return button('Quay lại', () => (_o2d ? set(M.back(ctl.state)) : set(null)), {
kind: 'ghost', testid: 'wiz-back', icon: 'back', disabled: !_o2d && !toChooser,
title: !_o2d && !toChooser ? 'Đã tạo tài khoản – các bước cài máy chủ đã xong, không cần quay lại' : (toChooser ? 'Về màn chọn Cá nhân / Công ty' : ''),
});
})(),
_o1k ? button('Tạo tài khoản', () => {
const em = String((ctl.state.data || {}).email || '').trim();
if (_o5() && !(ctl.ev && ctl.ev.verified)) { ui.toast('Bấm "Gửi mã", nhập mã 6 số trong email – xác nhận xong mới tạo tài khoản được.', 'warn'); return; }
if (!_o5() && em && !EMAIL_RE.test(em)) { ui.toast('Email chưa đúng (cần đủ dạng tên, chữ @, tên miền) – sửa lại hoặc để trống.', 'warn'); return; }
if (_o5()) _oz(ctl.ev);
ctl.onAccount();
}, { kind: 'primary', testid: 'wiz-account', icon: 'user', disabled: _o5() && !(ctl.ev && ctl.ev.verified) })
: _oj || _o21 ? null
: _o15 && !((_o2t.data || {}).url) ? null
: button(_oe, runCheck, { kind: _ov || _o2r ? 'secondary' : 'primary', icon: 'pulse', testid: 'wiz-check' }),
_o2s ? button(s.required || _o33 ? (s.laterLabel || 'Làm sau') : 'Bỏ qua bước này', () => {
try {
let _o2m = ctl.state;
if (s.id === 'doingu') { _o2m = M.setData(_o2m, { doingu: { ...((_o2m.data || {}).doingu || {}), rows: [], sale: 0, manager: 0 } }); delete ctl.last.doingu; }
set(M.skip(_o2m, s.id, s.required || _o33 ? 'later' : 'skip')); if (s.id === 'engine') _o32({ type: 'skip', mode: (ctl.state.data || {}).engineMode || 'skip' }); if (!s.required && s.skipNote) ui.toast(s.skipNote, 'info', 5000); if (s.required && s.laterNote) ui.toast(s.laterNote, 'info', 7000); } catch (e) { ui.toast(e.message, 'warn'); }
}, { kind: _o2r ? 'primary' : 'ghost', testid: 'wiz-skip', icon: s.required || _o33 ? 'clock' : 'next' }) : null,
button(_o1l(_o2t) ? 'Hoàn tất' : 'Tiếp', goNext, { kind: _ov ? 'primary' : 'secondary', testid: 'wiz-next', icon: _o1l(_o2t) ? 'check' : 'next', disabled: !M.canNext(_o2t) }));
const _os = s.id === 'domain' && _o2t.flow !== 'company' && choice !== 'skip' ? _ou(_o2t.data || {}, (p) => ctl.set(M.setData(ctl.state, p)), [h('h3', { class: 'wiz-h3' }, 'Cách làm'), actions]) : null;
const gSeg = gWay ? h('div', { class: 'wiz-box wiz-domain-mode', 'data-testid': 'wiz-allow-way' }, ui.segmented([
{ value: 'google', label: 'Cài bằng Google (điện thoại được)', icon: 'phone' }, { value: 'sheet', label: 'Cài trên máy tính (cách cũ)', icon: 'monitor' }], gWay,
(v) => set(M.setData(ctl.state, { allowWay: v })), { label: 'Cách tạo máy chủ', name: 'wiz-allow-way' })) : null;
return h('section', { class: 'wiz-step', dataset: { step: s.id }, 'data-testid': 'wiz-step' },
h('h2', { class: 'wiz-h2', tabindex: '-1', 'data-testid': 'wiz-step-title' }, s.title, ' ', badge),
_os ? _os.seg : null, gSeg,
h('div', { class: 'wiz-why', 'data-testid': 'wiz-intro' },
h('p', { class: 'wiz-headline' }, _o2j(s.head)),
s.note ? h('p', { class: 'muted small' }, _o2j(s.note)) : null,
todo.length ? [h('p', null, h('strong', null, s.todoTitle || 'Anh/chị cần làm:')),
h('ol', { class: 'wiz-todo', 'data-testid': 'wiz-todo' }, todo.map((t) => h('li', null, _o2j(t))))] : null,
!s.required && s.skipNote && choice !== 'skip' && !_o21 ? h('p', { 'data-testid': 'wiz-skip-note' }, h('strong', null, 'Bỏ qua thì sao? '), s.skipNote) : null),
s.required && _o2t.res[s.id] && _o2t.res[s.id].s === 'later' ? h('p', { class: 'wiz-warn', role: 'note', 'data-testid': 'wiz-owe' }, '⚠️ Bước bắt buộc – chưa xong (đã chọn "' + (s.laterLabel || 'Làm sau') + '"). Làm xong rồi bấm "Kiểm tra bước này".') : null,
h('p', { class: 'wiz-meta', 'data-testid': 'wiz-meta' }, '⏱ ' + (_o15 && s.timeGoogle ? s.timeGoogle : s.time) + ' · ' + s.cost),
choice ? _og(s, choice) : null,
choice === 'skip' ? null : _o21 ? _o20() : _os ? _os.body : _o1v ? _o38(s, _o2t) : _o15 ? _o16(_o2t) : [h('h3', { class: 'wiz-h3' }, 'Cách làm'), noTplNote, actions, manualBox, _o38(s, _o2t)], resBox,
_o12);
}
function allowWay(_o2t) {
if (!(ctl.portal && gcaiAvailable(ctl.config, { portal: true }))) return '';
const w = (_o2t.data || {}).allowWay;
return w === 'google' || w === 'sheet' ? w : (isPhone() ? 'google' : 'sheet');
}
function _o16(_o2t) {
const _on = _o2t.data || {};
const co = _o2t.flow === 'company' ? ui.field({ label: 'Tôi đang dùng tài khoản Google CÔNG TY (không phải Gmail cá nhân của nhân viên)', type: 'checkbox', value: !!_on.companyAccount, id: 'wiz-company-account',
onChange: (v) => ctl.set(M.setData(ctl.state, { companyAccount: !!v })) }) : null;
const done = _on.url && ctl.fromGoogle === _on.url;
return h('div', { class: 'wiz-gcai-wrap' },
_o2t.flow === 'company' ? h('p', { class: 'wiz-warn', role: 'note' }, '⚠️ Dùng tài khoản Google Workspace do quản trị viên công ty giữ. Không dùng Gmail của nhân viên – người đó nghỉ việc là công ty mất dữ liệu khách.') : null,
co,
_on.url && !done ? h('p', { class: 'muted small', 'data-testid': 'wiz-gcai-url' }, 'Máy chủ: ', h('span', { class: 'mono' }, _on.url)) : null,
done ? h('p', { class: 'muted small', 'data-testid': 'wiz-from-google' }, 'Máy chủ vừa tạo bằng Google – trợ lý tự kiểm. Chưa đạt: làm theo "Cách sửa" bên dưới rồi bấm "Kiểm tra bước này".')
: gcaiWidget(ctl, { ui, onSwitch: () => set(M.setData(ctl.state, { allowWay: 'sheet' })),
onDone: ({ url }) => { ctl.autoCheck = true; ctl.fromGoogle = url; set(M.setData(ctl.state, { url, allowWay: 'google' })); } }));
}
function _ox(_o2t) { const m = (_o2t.data || {}).engineMode; return m === 'install' || m === 'online' ? m : 'skip'; }
function _oi(v) {
let _o1w = M.setData(ctl.state, { engineMode: v });
if (v === 'online') _o1w = M.record(_o1w, 'engine', { ok: true, msg: ENGINE_ONLINE_MSG });
else if (_o1w.res.engine && _o1w.res.engine.msg === ENGINE_ONLINE_MSG) delete _o1w.res.engine;
set(_o1w);
_o32({ type: 'choice', mode: v });
}
function _og(s, choice) {
const _o1 = [['skip', 'off'], ['online', 'online'], ['install', 'machine']];
const seg = ui.segmented(_o1.map(([v, m]) => ({ value: v, label: VIDEO_MODE[m].label, icon: VIDEO_MODE[m].icon })), choice,
(v) => _oi(v), { label: 'Anh/chị làm video thế nào?', name: 'wiz-engine-mode' });
seg.classList.add('wiz-vmode-seg');
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-engine-choice' },
h('p', null, h('strong', null, 'Anh/chị làm video thế nào?')), seg,
h('ul', { class: 'wiz-vmodes', 'data-testid': 'wiz-engine-modes' }, _o1.map(([v, m]) => h('li', { class: v === choice ? 'on' : '', dataset: { mode: v }, 'data-testid': 'wiz-engine-mode-' + m },
h('strong', null, VIDEO_MODE[m].label), ': ', VIDEO_MODE[m].cost))),
hwCheckPanel(ui, { choice, onPreselect: (v) => _oi(v) }),
choice === 'skip' ? h('p', { class: 'wiz-note', 'data-testid': 'wiz-skip-note' }, '⏭ Bấm "Bỏ qua bước này": ', s.skipNote) : null);
}
function _o20() {
return h('div', { class: 'wiz-box wiz-online', 'data-testid': 'wiz-engine-online' },
h('p', null, '✅ ', h('strong', null, 'Xong bước này – không cần cài gì trên máy.')),
h('ul', null,
h('li', null, 'Làm clip: Video & Ý tưởng › Video › soạn và duyệt kịch bản › bấm nút làm bằng AI.'),
h('li', null, VIDEO_MODE.online.cost),
h('li', null, 'Bảng giá và khoá nhà cung cấp (Veo, Runway, Kling) nhập ở Video AI › Cài đặt.'),
h('li', null, 'Muốn làm video bản đồ/quy hoạch sau: cài máy dựng rồi chọn "Dựng trên máy" ở Cài đặt › Gói chức năng › Video.')));
}
function _o32(detail) { try { window.dispatchEvent(new CustomEvent(VIDEO_EVENT, { detail })); } catch { } }
function _o1l(_o2t) { const list = M.ids(_o2t); return list.indexOf(_o2t.cur) === list.length - 1 || !list.slice(list.indexOf(_o2t.cur) + 1).some((id) => !M.isDone(_o2t, id)); }
function _o6(_o2, _o1h) {
const url = _o2.link ? ctl.link(_o2.link) : null;
const _o1i = ctl.images ? ctl.images(_o2) : [];
let _o10 = null;
if (_o1i.length) {
const _o1z = (_o39, k) => h('figure', { class: 'wiz-fig' },
h('a', { href: _o39.src, target: '_blank', rel: 'noopener', class: 'wiz-shot-link', title: 'Mở ảnh cỡ lớn' },
h('img', { src: _o39.src, alt: _o39.alt || ('Ảnh hướng dẫn bước ' + (_o1h + 1) + (_o1i.length > 1 ? ' (' + (k + 1) + '/' + _o1i.length + ')' : '')), loading: 'lazy', class: 'wiz-shot', width: _o39.w, height: _o39.h })),
_o39.caption ? h('figcaption', { class: 'muted small' }, _o39.caption) : null);
_o10 = _o1i.length === 1 ? _o1z(_o1i[0], 0)
: h('div', { class: 'wiz-figs' }, _o1z(_o1i[0], 0),
h('details', { class: 'wiz-more' }, h('summary', { class: 'small' }, 'Xem thêm ' + (_o1i.length - 1) + ' ảnh'), _o1i.slice(1).map((_o39, k) => _o1z(_o39, k + 1))));
} else if (_o2.slot || _o2.shot) _o10 = h('div', { class: 'wiz-slot', dataset: { slot: _o2.slot || _o2.shot }, role: 'img', 'aria-label': 'Chỗ ảnh hướng dẫn' }, '🖼 ', _o2.note || 'Ảnh hướng dẫn sẽ bổ sung');
return h('li', { class: ['wiz-act', _o2.alt && 'wiz-alt'], 'data-testid': _o2.alt ? 'wiz-alt' : null },
h('p', null, boldParts(_o2.text).map((_o39) => (_o39.b ? h('strong', null, _o39.t) : _o39.t))),
url ? h('a', { class: _o2.link === 'template' ? 'btn btn-primary wiz-link-main' : 'btn btn-secondary btn-sm', href: url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'wiz-link-' + _o2.link }, ui.icon(_o2.link === 'template' ? 'copy' : 'link', 18), h('span', null, _o1o(_o2.link))) : null,
_o2.installer && ctl.installer ? _o1j(_o2.installer) : null,
_o2.go && ctl.mode !== 'pre' ? button(_o13(_o2.go), () => ctl.goSettings(_o2.go), { kind: 'secondary', small: true, testid: 'wiz-go-' + _o2.go }) : null,
_o10);
}
function _o1j(kind) {
const P = ctl.installer.paths, path = P[kind], fname = path.split('/').pop();
const _o37 = { tatca: 'tệp Mã.gs/Code.gs (đổi tên TatCa)', caidat: 'tệp CaiDat', manifest: 'appsscript.json' }[kind] || fname;
const _o2p = h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'wiz-inst-say-' + kind });
const _o2y = (msg, code, bad) => { _o2p.textContent = msg; _o2p.className = bad === 'warn' ? 'small wiz-warn' : bad ? 'small form-err' : 'small'; _o2p.dataset.code = code; };
const note = (_o2h) => (_o2h.warn ? ' ⚠️ ' + _o2h.warn + '.' : '');
const get = async () => {
_o2y('Đang kiểm chữ ký số của ' + fname + '…', 'WAIT', false);
const _o2h = await ctl.installer.load();
if (!_o2h.ok) { _o2y(_o2h.message, _o2h.code, true); return null; }
return _o2h;
};
const copy = button('Chép ' + fname, async () => {
const _o2h = await get(); if (!_o2h) return;
const f = _o2h.files[path];
const _o1e = await copyText(f.text);
if (_o1e === 'copied') _o2y('Đã chép ' + fname + ' (' + (_o2h.signed ? 'đã kiểm chữ ký: đúng bản phát hành' : 'đã kiểm mã sha256: tệp đủ, không hỏng') + ', sha256 ' + f.sha256.slice(0, 12) + '…). Dán vào ' + _o37 + ': Ctrl+A → Ctrl+V → Lưu.' + note(_o2h), _o2h.signed ? 'OK' : 'OK_UNSIGNED', _o2h.signed ? false : 'warn');
else _o2y('Trình duyệt chưa cho chép tự động – bấm nút lần nữa, hoặc bấm "Tải tệp" rồi mở tệp, chọn hết và chép.', 'NO_CLIPBOARD', true);
}, { kind: 'secondary', small: true, testid: 'wiz-inst-copy-' + kind, icon: 'content' });
const _or = h('a', { class: 'btn btn-ghost btn-sm', href: path, download: fname, rel: 'noopener', 'data-testid': 'wiz-inst-dl-' + kind }, ui.icon('disk', 18), h('span', null, 'Tải tệp ' + fname));
_or.addEventListener('click', async (ev) => {
ev.preventDefault();
const _o2h = await get(); if (!_o2h) return;
try {
const _o30 = URL.createObjectURL(new Blob([_o2h.files[path].text], { type: /\.json$/.test(fname) ? 'application/json;charset=utf-8' : 'text/plain;charset=utf-8' }));
const _o2z = h('a', { href: _o30, download: fname, hidden: true });
document.body.appendChild(_o2z); _o2z.click(); _o2z.remove();
setTimeout(() => URL.revokeObjectURL(_o30), 30000);
_o2y('Đã ' + (_o2h.signed ? 'kiểm chữ ký' : 'kiểm mã sha256') + ' và tải ' + fname + ' – mở tệp, chọn hết (Ctrl+A), chép rồi dán vào ' + _o37 + '.' + note(_o2h), _o2h.signed ? 'OK' : 'OK_UNSIGNED', _o2h.signed ? false : 'warn');
} catch { _o2y('Chưa lưu được tệp – thử trình duyệt khác.', 'SAVE', true); }
});
ctl.installer.load();
return h('div', { class: 'wiz-inst', 'data-testid': 'wiz-inst-' + kind }, h('div', { class: 'btn-row' }, copy, _or), _o2p);
}
function _o1o(k) { return { template: 'Tạo bản sao', sheetsNew: 'Mở sheets.new', aistudio: 'Mở aistudio.google.com', telegramDownload: 'Tải Telegram', engineZip: 'Tải bộ cài máy dựng (' + engineDownload().primary.label + ')', engineZipOther: 'Máy ' + engineDownload().other.label + '? Tải bộ cài cho ' + engineDownload().other.label }[k] || 'Mở trang'; }
function _o13(k) { return { connection: 'Mở Cài đặt › Kết nối', users: 'Mở Cài đặt › Người dùng', security: 'Mở Cài đặt › Bảo mật' }[k] || 'Mở Cài đặt'; }
function argsFor(id) { return id === 'allow' ? { url: (ctl.state.data || {}).url || '' } : {}; }
function _o29(box, _o2h) {
if (!_o2h) { ui.clear(box); box.className = 'wiz-result'; return; }
box.className = 'wiz-result ' + (_o2h.ok ? 'is-ok' : 'is-bad');
ui.mountTo(box,
h('p', { class: 'wiz-res-main' }, _o2h.ok ? (_o2h.bad ? '⚠️ ' : '✅ ') : _o2h.wait ? '⏳ ' : '❌ ', _o2h.ok ? (_o2h.msg || 'Đạt') : (_o2h.cause || _o2h.msg || 'Chưa đạt')),
!_o2h.ok && _o2h.fix ? h('p', { class: 'wiz-fix', 'data-testid': 'wiz-fix' }, h('strong', null, 'Cách sửa: '), _o2h.fix) : null,
!_o2h.ok && _o2h.img ? _o11(_o2h.img, !!_o2h.fix) : null,
!_o2h.ok && _o2h.tech && (_o2h.tech.ref || _o2h.tech.reason) ? h('details', { class: 'wiz-tech', 'data-testid': 'wiz-tech' }, h('summary', { class: 'small' }, 'Chi tiết kỹ thuật'),
h('p', { class: 'small mono' }, [_o2h.tech.ref && 'Mã lỗi: ' + _o2h.tech.ref, _o2h.tech.reason && 'Lý do: ' + _o2h.tech.reason].filter(Boolean).join(' · '))) : null,
!_o2h.ok && typeof _o2h.url === 'string' && /^https:\/\//.test(_o2h.url) ? h('div', { class: 'btn-row' }, h('a', { class: 'btn btn-secondary', href: _o2h.url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'wiz-fix-link' }, h('span', null, _o2h.url_label || 'Mở trang'))) : null,
_o2h.warn ? h('p', { class: 'wiz-warn' }, '⚠️ ', _o2h.warn) : null,
Array.isArray(_o2h.items) && _o2h.items.length ? h('ul', { class: 'wiz-items', 'data-testid': 'wiz-items' }, _o2h.items.map((_o39) => h('li', { class: _o39.skipped ? 'is-skip' : _o39.ok === false ? 'is-bad' : _o39.pending ? 'is-owe' : '', dataset: { item: _o39.id || '' } },
_o39.skipped ? '⏭ ' : _o39.ok === true ? '✅ ' : _o39.ok === false ? '❌ ' : '⚠️ ', h('strong', null, _o39.label), _o39.skipped ? ' – Bỏ qua – không bắt buộc' : _o39.detail ? ' – ' + _o39.detail : '', _o39.ok === false && _o39.fix ? h('div', { class: 'muted small' }, 'Cách sửa: ' + _o39.fix) : null,
_o39.pending && _o39.step ? h('div', { class: 'btn-row' }, button('Làm bước ' + _o39.label, () => _o14(_o39.step), { kind: 'secondary', small: true, icon: 'next', testid: 'wiz-owe-go-' + _o39.step })) : null))) : null);
}
function _o14(id) { const _o34 = _o2i; _o2i = true; try { set(M.goTo(ctl.state, id)); } catch (e) { _o2i = _o34; ui.toast(e.message, 'warn'); } }
function _o11(key, hasFix = false) {
const _o39 = ctl.guideImage ? ctl.guideImage(key) : null;
if (!_o39) return null;
return h('figure', { class: 'wiz-fig', 'data-testid': 'wiz-fix-img' },
h('a', { href: _o39.src, target: '_blank', rel: 'noopener', class: 'wiz-shot-link', title: 'Mở ảnh cỡ lớn' }, h('img', { src: _o39.src, alt: _o39.alt || 'Ảnh minh hoạ cách sửa', loading: 'lazy', class: 'wiz-shot', width: _o39.w, height: _o39.h })),
_o39.caption && !hasFix ? h('figcaption', { class: 'muted small' }, _o39.caption) : null);
}
function _oq() {
if (!(ctl.sale && ctl.demo && ctl.mode === 'pre') || ctl.portal) return null;
return h('div', { class: 'wiz-demo', 'data-testid': 'wiz-demo-note' },
h('p', null, h('strong', null, 'Chỉ muốn xem app trước? '), '"Xem thử" chạy một máy chủ giả ngay trong trình duyệt này – CHƯA PHẢI cài thật: ',
'dữ liệu nhập lúc Xem thử chỉ nằm trong trình duyệt này và sẽ không chuyển sang máy chủ thật. 2 bước cài máy chủ sẽ ghi "bỏ qua".'),
button('Xem thử trước (chưa cài thật)', async () => {
const ok = await ui.confirm('Xem thử app bằng máy chủ giả trong trình duyệt? App sẽ ghi "' + NOT_REAL_TEXT + '" cho tới khi anh/chị cài và nối máy chủ thật (Cài đặt › Kết nối). Không nhập khách thật lúc Xem thử.', { ok: 'Xem thử', title: 'Xem thử – chưa cài thật' });
if (ok) { if (ctl.api && !ctl.evProbe) _o5(); set(M.skipDemo(ctl.state)); }
}, { kind: 'ghost', small: true, testid: 'wiz-demo-skip', icon: 'layout' }));
}
function _o5() {
if (ctl.evNeed === undefined && ctl.api && !ctl.evProbe) {
ctl.evProbe = ctl.api.call('status').then((_o2h) => { const _o1u = !(_o2h && _o2h.setup === false && !_o2h.email_verify), _o34 = ctl.evNeed !== false; ctl.evNeed = _o1u; if (_o34 !== _o1u) render(); })
.catch(() => { ctl.evNeed = true; });
}
return ctl.evNeed !== false;
}
function _oz(ev) {
try {
if (ev && ev.verified) sessionStorage.setItem('bds:setup_email', JSON.stringify({ email: ev.email, code: ev.code || '', use_account_email: !!ev.use_account_email, at: ev.at || Date.now() }));
} catch { }
}
function _o4(_on, patch) {
const ev = ctl.ev;
if (ev && ev.verified) {
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-account-box' },
h('p', { class: 'ev-ok', 'data-testid': 'wiz-ev-done' }, '✅ ' + (ev.use_account_email ? 'Dùng email tài khoản Google: ' : 'Email đã xác nhận: ') + ev.email),
h('p', { class: 'muted small' }, 'Bấm "Tạo tài khoản" bên dưới để đặt tên đăng nhập và mật khẩu. Tạo xong, app tự quay lại trợ lý.'),
button('Dùng email khác', () => { ctl.ev = null; render(); }, { kind: 'ghost', small: true, testid: 'wiz-ev-change' }));
}
const box = emailCodeBox({
ui, api: ctl.api, testid: 'wiz-ev', email: _on.email || '', persistKey: 'bds:wizard:ev',
label: 'Email của anh/chị (bắt buộc)', hint: 'App gửi mã 6 số tới email này. Email đã xác nhận dùng để nhận mã khi quên mật khẩu (sửa sau ở Cài đặt › Thông tin cá nhân).',
send: (em) => ctl.api.call('email.verify_start', { email: em, purpose: 'setup' }),
verify: (em, code) => ctl.api.call('email.verify_check', { email: em, code }),
allowAccountEmail: true,
onVerified: (v) => { ctl.ev = { email: v.email, code: v.code, verified: true, use_account_email: !!v.use_account_email, at: Date.now() }; patch({ email: v.email }); render(); }
});
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-account-box' }, box,
h('p', { class: 'muted small' }, 'Xác nhận email xong, nút "Tạo tài khoản" bên dưới mới bật.'));
}
function _o8() {
if (ctl.portal) {
return h('div', { class: 'wiz-note wiz-app-origin', 'data-testid': 'wiz-app-origin-portal' },
h('p', null, h('strong', null, 'Hộp trong Sheet hỏi "địa chỉ app riêng"?'), ' Bỏ trống ô đó – app riêng của anh/chị chưa có, sẽ được tạo ở bước "Địa chỉ app" ngay sau.'),
h('p', { class: 'muted small' }, 'Trong hộp của Sheet, bấm "Chép URL" rồi dán vào ô "Địa chỉ máy chủ (kết thúc bằng /exec)" bên dưới.'));
}
let origin = '';
try { origin = location.origin || ''; } catch { origin = ''; }
if (!/^https?:\/\//.test(origin)) return null;
const _o2p = h('span', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'wiz-app-origin-say' });
return h('div', { class: 'wiz-note wiz-app-origin', 'data-testid': 'wiz-app-origin' },
h('p', null, 'Địa chỉ app của anh/chị: ', h('strong', { class: 'mono', 'data-testid': 'wiz-app-origin-url' }, origin)),
h('div', { class: 'btn-row' }, button('Chép địa chỉ app', async () => { const _o1e = await copyText(origin); _o2p.textContent = _o1e === 'copied' ? 'Đã chép.' : 'Chưa chép tự động được – chọn dòng trên rồi chép.'; },
{ kind: 'secondary', small: true, icon: 'copy', testid: 'wiz-app-origin-copy' }), _o2p),
h('p', { class: 'muted small' }, 'Hộp trong Sheet hỏi "địa chỉ app riêng"? Dán địa chỉ này vào đó (lần sau Sheet có nút mở app tự nối).'));
}
function _o38(s, _o2t) {
const _on = _o2t.data || {};
const patch = (p) => ctl.set(M.setData(ctl.state, p));
switch (s.id) {
case 'prepare': {
const _o1s = _on.checklist || {};
return h('div', { class: 'wiz-box wiz-check-list', 'data-testid': 'wiz-checklist' }, CHECKLIST.map((_oa) => {
const f = ui.field({ label: _oa.label + (_oa.required ? ' *' : ' (tuỳ chọn)'), type: 'checkbox', value: !!_o1s[_oa.id], id: 'wiz-ck-' + _oa.id,
onChange: (v) => patch({ checklist: { ...((ctl.state.data || {}).checklist || {}), [_oa.id]: !!v } }) });
return h('div', { class: ['wiz-ck', _oa.id === 'workspace' && 'wiz-ck-warn'] }, f, h('p', { class: 'muted small' }, _oa.hint));
}), h('p', { class: 'muted small' }, '* bắt buộc'));
}
case 'company': {
const _oa = _on.company || {};
const _o2o = (p) => patch({ company: { ...((ctl.state.data || {}).company || {}), ...p } });
const name = ui.field({ label: 'Tên công ty', value: _oa.name || '', id: 'wiz-co-name', autocomplete: 'organization', onInput: (v) => _o2o({ name: String(v || '').trim() }) });
const tax = ui.field({ label: 'Mã số thuế', value: _oa.tax || '', id: 'wiz-co-tax', inputmode: 'numeric', hint: '10 số; chi nhánh: 10 số-3 số', onInput: (v) => _o2o({ tax: String(v || '').replace(/\s+/g, '') }) });
const _o2c = h('img', { class: 'wiz-logo', alt: 'Logo công ty', src: _oa.logo || '', hidden: !_oa.logo, 'data-testid': 'wiz-logo-preview' });
const logo = ui.field({ label: 'Logo (PNG/JPG)', type: 'file', accept: 'image/png,image/jpeg,image/webp,image/svg+xml', id: 'wiz-co-logo',
onChange: async (files) => {
const f = files && files[0]; if (!f) return;
try { const url = await shrinkLogo(f); _o2o({ logo: url }); _o2c.src = url; _o2c.hidden = false; } catch (e) { ui.toast('Không đọc được ảnh logo: ' + (e.message || e), 'warn'); }
} });
return h('div', { class: 'wiz-box grid-2' }, name, tax, h('div', null, logo, _o2c));
}
case 'allow': {
const co = _o2t.flow === 'company' ? ui.field({ label: 'Tôi đang dùng tài khoản Google CÔNG TY (không phải Gmail cá nhân của nhân viên)', type: 'checkbox', value: !!_on.companyAccount, id: 'wiz-company-account', onChange: (v) => patch({ companyAccount: !!v }) }) : null;
const url = ui.field({ label: URL_FIELD_LABEL, value: _on.url || '', id: 'wiz-url', inputmode: 'url', autocomplete: 'off', placeholder: 'https://script.google.com/macros/s/…/exec',
hint: 'Dán địa chỉ vừa bấm "Chép URL" trong hộp của Sheet (Ctrl+V). Bấm "Mở BDS Studio và kết nối" trong Sheet thì app tự điền.',
onInput: (v) => { const _o39 = String(v || '').trim(); if (_o39 && ctl.linkProblem) ctl.linkProblem = null; patch({ url: _o39 }); } });
return h('div', { class: 'wiz-box' },
_o1n(),
ctl.fromLink && _on.url === ctl.fromLink ? h('p', { class: 'muted small', 'data-testid': 'wiz-from-link' }, 'Địa chỉ máy chủ nhận từ nút "Mở BDS Studio và kết nối" trong Sheet – trợ lý tự kiểm. Chưa đạt: làm theo "Cách sửa" bên dưới rồi bấm "Kiểm tra bước này".') : null,
_o2t.flow === 'company' ? h('p', { class: 'wiz-warn', role: 'note' }, '⚠️ Dùng tài khoản Google Workspace do quản trị viên công ty giữ. Không dùng Gmail của nhân viên – người đó nghỉ việc là công ty mất dữ liệu khách.') : null,
co, url, _o8(),
ctl.demo && !ctl.sale ? h('p', { class: 'muted small', 'data-testid': 'wiz-demo-note' }, 'Đang xem thử: để trống ô và bấm "Kiểm tra bước này" để dùng máy chủ xem thử ngay trong trình duyệt.') : null,
_oq());
}
case 'account': {
if (ctl.mode !== 'pre') return null;
const _o2g = privacyLine(h, { testid: 'wiz-privacy', lead: 'Tạo tài khoản là anh/chị đã đọc ', cfg: ctl.config || undefined });
if (_o5()) { const w = _o4(_on, patch); if (_o2g && w) w.appendChild(_o2g); return w; }
const err = h('p', { class: 'small form-err', 'aria-live': 'polite', 'data-testid': 'wiz-email-err' });
const em = ui.field({ label: 'Email nhận mã khi quên mật khẩu (tuỳ chọn)', type: 'email', value: _on.email || '', id: 'wiz-email', inputmode: 'email', autocomplete: 'email', placeholder: 'email của anh/chị',
hint: 'Bỏ trống: mã đặt lại mật khẩu gửi về email của tài khoản Google đã cài máy chủ (và Telegram nếu đã nối). Sửa sau ở Cài đặt › Thông tin cá nhân.',
onInput: (v) => { const _o39 = String(v || '').trim(); patch({ email: _o39 }); err.textContent = _o39 && !EMAIL_RE.test(_o39) ? 'Email chưa đúng (cần đủ dạng tên, chữ @, tên miền).' : ''; } });
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-account-box' }, em, err,
h('p', { class: 'muted small' }, 'Bấm "Tạo tài khoản" bên dưới. Tạo xong, app tự quay lại trợ lý.'), _o2g);
}
case 'backup':
case 'tfa': {
const box = h('div', { class: 'wiz-box', 'data-testid': 'wiz-tfa-box' });
if (ctl.renderTfa) ctl.renderTfa(box); else box.append(button('Mở Cài đặt › Bảo mật', () => ctl.goSettings('security'), { kind: 'secondary', small: true }));
return box;
}
case 'domain': return _o2t.flow === 'company' ? companyDomainWidget(ctl, { ui, rerender: render }) : _ou(_on, patch).body;
case 'diachi': return diachiWidget(ctl, { ui, rerender: render });
case 'doingu': return ctl.mode === 'pre' ? null : doinguWidget(ctl, { ui, rerender: render });
case 'engine': return _oy();
case 'finish': return h('div', { class: 'wiz-box' }, _o2n(_o2t));
case 'handover': return _o18(_on, patch);
default: return null;
}
}
function _ou(_on, patch, howTo = null) {
const mode = (_on.domain && _on.domain.mode) || (ctl.state.flow === 'company' ? 'custom' : 'shared');
const _oo = (ctl.defaultAddress && ctl.defaultAddress()) || { own: true, text: 'Địa chỉ mặc định: ' + (ctl.sharedHost || 'địa chỉ đang mở') + ' – bản app riêng của anh/chị, dữ liệu nằm trong Google của anh/chị, không dùng chung với ai.' };
const host = ui.field({ label: 'Tên miền riêng', value: (_on.domain && _on.domain.host) || '', id: 'wiz-domain-host', placeholder: 'app.congty.vn', inputmode: 'url', autocomplete: 'off',
onInput: (v) => { patch({ domain: { mode: 'custom', host: String(v || '').trim() } }); _o28(); } });
const _ok = h('div', { class: 'wiz-cname', 'data-testid': 'wiz-cname' });
const _om = h('div', { class: 'wiz-custom', hidden: mode !== 'custom', 'data-testid': 'wiz-domain-custom' }, howTo, host, _ok);
const shared = h('div', { hidden: mode === 'custom', 'data-testid': 'wiz-domain-shared' },
h('p', { class: _oo.own ? 'muted small' : 'wiz-note', 'data-testid': 'wiz-domain-default' }, _oo.own ? _oo.text : '⏳ ' + _oo.text),
_oo.own ? null : wishBox(ctl, ui, { company: false, showDefer: false }));
const seg = ui.segmented([{ value: 'shared', label: 'Địa chỉ mặc định (miễn phí)', icon: 'home' }, { value: 'custom', label: 'Tên miền riêng', icon: 'link' }], mode, (v) => {
patch({ domain: { ...((ctl.state.data || {}).domain || {}), mode: v } }); _om.hidden = v !== 'custom'; shared.hidden = v === 'custom';
render();
}, { label: 'Địa chỉ mở app', name: 'wiz-domain-mode' });
if (!(_on.domain && _on.domain.mode)) patch({ domain: { ...(_on.domain || {}), mode } });
function _o28() {
const _o1g = normHost(host.getValue());
const _o2v = _o1g ? _o1g.split('.')[0] : 'app';
const target = (ctl.cnameTarget && ctl.cnameTarget()) || '';
ui.mountTo(_ok, ui.table([{ k: 'Loại (Type)', v: 'CNAME – dòng trỏ tên miền con sang địa chỉ của app' }, { k: 'Tên (Name/Host)', v: _o2v },
{ k: 'Trỏ tới (Target/Value)', v: target || '(bên bán gửi qua email – xem dưới)' }, { k: 'TTL (thời gian lưu tạm)', v: 'Tự động (Auto)' }],
[{ label: 'Ô cần điền', key: 'k' }, { label: 'Giá trị', key: 'v' }]),
h('p', { class: 'muted small' }, 'Thêm xong có thể mất 5 phút đến 24 giờ mới chạy. Chưa chạy thì bấm "Làm sau", trợ lý nhắc lại.'));
}
_o28();
let _o2q = {}; try { _o2q = supportContact(ctl.config) || {}; } catch { _o2q = {}; }
const em = _o2q.email || supportEmail(ctl.config);
const _o1m = !!(ctl.cnameTarget && ctl.cnameTarget());
const _ol = h('p', { class: 'wiz-note', 'data-testid': 'wiz-domain-contact' },
'Tên miền riêng được gắn vào app riêng của anh/chị ở phía bên bán. Gửi email tới ', h('a', { href: 'mailto:' + em + '?subject=' + encodeURIComponent('Gắn tên miền riêng cho BDS Studio'), 'data-testid': 'wiz-domain-mail' }, em),
_o2q.zalo ? ' (hoặc Zalo ' + _o2q.zalo + ')' : '',
_o1m ? ' kèm tên miền muốn dùng (vd app.tencuaban.vn) sau khi thêm bản ghi CNAME như bảng trên: bên bán gắn tên miền vào app và báo khi xong.'
: ' kèm tên miền muốn dùng (vd app.tencuaban.vn): bên bán gửi lại giá trị "Trỏ tới" của bản ghi CNAME và báo khi đã gắn xong.');
_om.append(_ol);
return { seg: h('div', { class: 'wiz-box wiz-domain-mode', 'data-testid': 'wiz-domain-toggle' }, seg), body: h('div', { class: 'wiz-box', 'data-testid': 'wiz-domain' }, shared, _om) };
}
function _oy() {
const panel = h('div', { class: 'wiz-os-panel', 'data-testid': 'wiz-engine-os', 'aria-live': 'polite' });
const _o27 = (os) => {
panel.dataset.os = os;
ui.mountTo(panel, h('h4', { class: 'wiz-h3' }, os === 'win' ? 'Windows 10/11' : 'Mac (chip Apple hoặc Intel)'),
h('ol', { class: 'wiz-os-steps', 'data-testid': 'wiz-engine-steps-' + os }, ENGINE_GUIDE[os].map((t) => h('li', null, t))));
};
const os = detectOs();
const seg = ui.segmented([{ value: 'mac', label: 'Mac' }, { value: 'win', label: 'Windows' }], os, (v) => _o27(v), { label: 'Máy tính cài máy dựng', name: 'wiz-engine-os' });
_o27(os);
return h('div', { class: 'wiz-box', 'data-testid': 'wiz-engine' }, seg, panel,
h('p', { class: 'wiz-note', 'data-testid': 'wiz-engine-tier' }, ENGINE_GUIDE.tier),
h('p', { class: 'muted small', 'data-testid': 'wiz-engine-full' }, ENGINE_GUIDE.full));
}
function _o2n(_o2t) {
const box = h('div', { class: 'wiz-samples', 'data-testid': 'wiz-samples' }, ui.spinner());
if (!ctl.samples) { box.remove(); return null; }
_o2a(box, _o2t);
return box;
}
async function _o2a(box, _o2t) {
let _o1t = 0;
try { _o1t = await ctl.samples.count(); } catch { _o1t = 0; }
const load = button('Xem ví dụ', async () => { const _o2h = await ctl.samples.load(); ui.toast('Đã nạp ví dụ: ' + _o2h.projects + ' dự án, ' + _o2h.customers + ' khách (tên có chữ "Mẫu").', 'ok', 5000); _o2a(box, ctl.state); }, { kind: 'secondary', small: true, testid: 'wiz-samples-load' });
const clear = button('Xoá toàn bộ dữ liệu mẫu', async () => {
if (!(await ui.confirm('Xoá toàn bộ dữ liệu mẫu (dự án, khách, nhắc việc có chữ "Mẫu")? Dữ liệu anh/chị tự nhập không bị đụng tới.', { ok: 'Xoá dữ liệu mẫu', kind: 'danger' }))) return;
const k = await ctl.samples.clear(); ui.toast('Đã xoá ' + k + ' mục dữ liệu mẫu.', 'ok'); _o2a(box, ctl.state);
}, { kind: 'danger', small: true, testid: 'wiz-samples-clear' });
ui.mountTo(box,
h('h4', { class: 'section-title' }, 'Dữ liệu mẫu'),
_o1t ? h('p', { 'data-testid': 'wiz-samples-count' }, 'Đang có ' + _o1t + ' mục dữ liệu mẫu (tên có chữ "Mẫu") để anh/chị xem chỗ nào nhập gì. Ảnh trong dữ liệu mẫu là ảnh minh hoạ.')
: h('p', { class: 'muted small', 'data-testid': 'wiz-samples-count' }, _o2t && _o2t.flow === 'company' ? 'Bản công ty bắt đầu sạch, không có dữ liệu mẫu. Muốn xem ví dụ chỗ nào nhập gì thì bấm "Xem ví dụ" (xoá được 1 chạm).' : 'Không còn dữ liệu mẫu.'),
h('div', { class: 'btn-row' }, _o1t ? clear : load));
}
function _o18(_on, patch) {
const box = h('div', { class: 'wiz-box' }, ui.spinner());
ctl.handover().then((data) => {
const doc = _o17(data);
const signed = ui.field({ label: 'Đã in và hai bên đã ký', type: 'checkbox', value: !!_on.handoverSigned, id: 'wiz-handover-signed', onChange: (v) => patch({ handoverSigned: !!v, handoverAt: v ? Date.now() : 0 }) });
ui.mountTo(box, doc,
h('div', { class: 'btn-row' },
button('In / Lưu PDF', () => _o2e(doc), { kind: 'primary', small: true, testid: 'wiz-handover-print' }),
button('Tải tệp chữ', () => download('bien-ban-ban-giao-bds-studio.txt', handoverText(data)), { kind: 'secondary', small: true, testid: 'wiz-handover-download' })),
signed);
}).catch((e) => ui.mountTo(box, h('p', { class: 'form-err' }, 'Không tạo được biên bản: ' + (e.message || e))));
return box;
}
function _o17(_on) {
const _o2k = (k, v) => h('tr', null, h('th', null, k), h('td', null, v || '…'));
return h('article', { class: 'wiz-doc', 'data-testid': 'wiz-handover' },
h('header', { class: 'wiz-doc-head' }, _on.company.logo ? h('img', { src: _on.company.logo, alt: '', class: 'wiz-doc-logo' }) : null,
h('div', null, h('h3', null, 'BIÊN BẢN BÀN GIAO CÀI ĐẶT BDS STUDIO'), h('p', null, 'Ngày ' + _on.date))),
h('table', { class: 'wiz-doc-kv' }, h('tbody', null,
_o2k('Bên nhận', _on.company.name), _o2k('Mã số thuế', _on.company.tax),
_o2k('Tài khoản Quản trị (Admin)', _on.owner.username ? '@' + _on.owner.username + (_on.owner.full_name ? ' (' + _on.owner.full_name + ')' : '') : ''),
_o2k('Địa chỉ mở app', _on.domain),
_o2k('Phiên bản', 'web ' + (_on.versions.web || '?') + ' · máy chủ ' + (_on.versions.server || '?') + (_on.versions.engine ? ' · máy dựng ' + _on.versions.engine : '')),
_o2k('Kiểm tra toàn bộ', _on.check ? _on.check.text : 'chưa chạy'),
_on.license ? _o2k('Bản quyền', _on.license) : null)),
h('h4', null, 'Người dùng (' + _on.users.length + ')'),
_on.users.length ? h('ul', null, _on.users.map((_o30) => h('li', null, '@' + _o30.username + ' · ' + (_o30.full_name || '') + ' · ' + (_o30.role_label || roleVi(_o30.role)) + ' · 2 lớp: ' + _o30.tfa))) : h('p', null, '—'),
h('h4', null, 'Các bước đã làm'),
h('ul', { class: 'wiz-doc-steps' }, _on.steps.map((s) => h('li', null, (STATUS_ICON[s.status] || '▫️') + ' ' + s.title + (s.msg ? ' – ' + s.msg : '')))),
_on.pending.length ? h('p', null, h('strong', null, 'Còn để sau: '), _on.pending.join('; ')) : null,
h('ul', { class: 'wiz-doc-notes' }, _on.notes.map((_o1t) => h('li', null, _o1t))),
h('div', { class: 'wiz-doc-sign' }, h('div', null, h('strong', null, 'BÊN CÀI ĐẶT'), h('span', null, '(ký, ghi rõ họ tên)')), h('div', null, h('strong', null, 'BÊN NHẬN'), h('span', null, '(ký, ghi rõ họ tên, đóng dấu)'))));
}
function _o2e(doc) {
const _o9 = h('div', { id: 'wiz-print-area' }, doc.cloneNode(true));
document.body.appendChild(_o9);
document.body.classList.add('wiz-printing');
const done = () => { document.body.classList.remove('wiz-printing'); _o9.remove(); window.removeEventListener('afterprint', done); };
window.addEventListener('afterprint', done);
try { window.print(); } finally { setTimeout(done, 1500); }
}
function _o1d(_o2t) {
try {
return finishCard(ui, { appUrl: appUrlFor({ portal: !!ctl.portal, state: _o2t }), portal: !!ctl.portal, testid: 'wiz-a2hs',
start: _o3, onState: (k) => { _o3 = k; } });
} catch { return null; }
}
function _ow(_o2t) {
const p = M.progress(_o2t);
const later = M.steps(_o2t).filter((s) => _o2t.res[s.id] && _o2t.res[s.id].s !== 'ok');
if (M.isDemo(_o2t) && ctl.demo) {
return h('div', { class: 'wiz-done wiz-done-demo', 'data-testid': 'wiz-done' },
h('div', { class: 'wiz-done-ico', 'aria-hidden': 'true' }, '⚠️'),
h('h2', { class: 'wiz-h2', tabindex: '-1', 'data-testid': 'wiz-step-title' }, 'Xem thử – CHƯA CÀI THẬT'),
h('p', { class: 'wiz-not-real', role: 'alert', 'data-testid': 'wiz-not-real' }, NOT_REAL_TEXT + '.'),
h('p', null, 'Đã xem ' + p.done + '/' + p.total + ' bước; 2 bước cài máy chủ thật đang "bỏ qua". App đang chạy máy chủ giả trong trình duyệt này: dữ liệu không lên Google của anh/chị, đổi máy/xoá dữ liệu trình duyệt là mất, và KHÔNG chuyển sang máy chủ thật.'),
h('p', { class: 'muted small' }, 'Cài thật: làm bước "Tạo máy chủ" (Xem lại các bước) → lấy địa chỉ …/exec → Cài đặt › Kết nối › dán địa chỉ → Lưu. Trước khi nối, app nhắc tải về dữ liệu đã nhập lúc Xem thử.'),
h('div', { class: 'btn-row' },
button('Xem lại các bước', () => { _o2i = true; render(); }, { kind: 'ghost', testid: 'wiz-review' }),
ctl.goSettings && ctl.mode !== 'pre' ? button('Nối máy chủ thật', () => ctl.goSettings('connection'), { kind: 'secondary', testid: 'wiz-go-connection-real' }) : null,
ctl.close ? button('Vào xem thử app', () => ctl.close(), { kind: 'primary', testid: 'wiz-close' }) : null));
}
const _o24 = M.pendingRequired(_o2t);
const _o25 = new Set(_o24.map((_o39) => _o39.id));
const _o22 = later.filter((s) => !_o25.has(s.id));
return h('div', { class: 'wiz-done', 'data-testid': 'wiz-done' },
h('div', { class: 'wiz-done-ico', 'aria-hidden': 'true' }, _o24.length ? '⚠️' : '🎉'),
h('h2', { class: 'wiz-h2', tabindex: '-1', 'data-testid': 'wiz-step-title' }, _o24.length ? 'Dùng app được rồi – còn ' + _o24.length + ' bước bắt buộc' : 'Cài đặt xong!'),
h('p', null, 'Đã xong ' + p.done + '/' + p.total + ' bước' + (_o2t.flow === 'company' ? ' – đã có biên bản bàn giao.' : '.')),
_o24.length ? h('div', { class: 'wiz-warn', role: 'note', 'data-testid': 'wiz-done-owe' },
h('p', null, '⚠️ Chưa xong (bắt buộc): ', h('strong', null, _o24.map((_o39) => _o39.title).join(' · ')), '. Làm nốt khi sẵn sàng – nút Trợ lý cài đặt ở góc màn hình đưa anh/chị quay lại.'),
h('div', { class: 'btn-row' }, _o24.map((_o39) => button('Làm bước ' + _o39.title, () => _o14(_o39.id), { kind: 'secondary', small: true, icon: 'next', testid: 'wiz-done-go-' + _o39.id })))) : null,
_o22.length ? h('p', { class: 'muted small' }, 'Để sau: ' + _o22.map((s) => s.title).join(' · ') + '. Mở lại bất kỳ lúc nào ở Cài đặt › Trợ lý cài đặt.') : null,
_o1d(_o2t),
ctl.samples ? _o2n(_o2t) : null,
h('div', { class: 'btn-row' },
button('Xem lại các bước', () => { _o2i = true; render(); }, { kind: 'ghost', testid: 'wiz-review' }),
ctl.close ? button('Vào dùng app', () => ctl.close(), { kind: 'primary', testid: 'wiz-close' }) : null));
}
async function _o1b() {
const text = await ctl.diagnostics();
const ta = h('textarea', { class: 'wiz-report', readonly: true, rows: 12, 'data-testid': 'wiz-report', 'aria-label': 'Báo cáo cài đặt' });
ta.value = text;
const share = typeof navigator !== 'undefined' && navigator.share;
let _o2w = ctl.config.SUPPORT_EMAIL || '';
if (!_o2w && isSaleEdition(ctl.config)) { try { _o2w = supportContact(ctl.config).email; } catch { _o2w = ''; } _o2w = _o2w || supportEmail(ctl.config); }
const _o1p = _o2w ? 'mailto:' + encodeURIComponent(_o2w) + '?subject=' + encodeURIComponent('Cần giúp cài BDS Studio') + '&body=' + encodeURIComponent(text.slice(0, 1800)) : '';
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
_o1p ? h('a', { class: 'btn btn-secondary btn-sm', href: _o1p, 'data-testid': 'wiz-report-mail' }, 'Gửi email') : null)),
actions: [{ label: 'Đóng', kind: 'ghost' }]
});
}
}
function download(name, text) {
const _o2 = document.createElement('a');
_o2.href = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
_o2.download = name; document.body.appendChild(_o2); _o2.click();
setTimeout(() => { URL.revokeObjectURL(_o2.href); _o2.remove(); }, 500);
}
export async function shrinkLogo(file, max = 256) {
if (file.size > 5 * 1024 * 1024) throw new Error('ảnh quá 5 MB');
const url = URL.createObjectURL(file);
try {
const img = await new Promise((res, rej) => { const _o1h = new Image(); _o1h.onload = () => res(_o1h); _o1h.onerror = () => rej(new Error('tệp không phải ảnh')); _o1h.src = url; });
const k = Math.min(1, max / Math.max(img.naturalWidth || max, img.naturalHeight || max));
const _oa = document.createElement('canvas');
_oa.width = Math.max(1, Math.round((img.naturalWidth || max) * k)); _oa.height = Math.max(1, Math.round((img.naturalHeight || max) * k));
_oa.getContext('2d').drawImage(img, 0, 0, _oa.width, _oa.height);
let _o23 = _oa.toDataURL('image/png');
if (_o23.length > 60000) _o23 = _oa.toDataURL('image/jpeg', 0.85);
return _o23;
} finally { URL.revokeObjectURL(url); }
}
export default { mountWizard, shrinkLogo };

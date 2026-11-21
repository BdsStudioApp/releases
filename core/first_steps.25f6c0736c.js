import { ls } from './xkit.71d637c634.js';
export const MAX_LATER = 2;
export const KEY_PREFIX = 'first3.';
export const LS_PREFIX = 'bds:first3:';
export const STEP = {
customer: { title: 'Thêm khách hàng đầu tiên', how: 'Tên và số điện thoại/Zalo là đủ – nhu cầu, dự án điền sau cũng được.', btn: 'Thêm khách', icon: 'plus', path: 'customers/customers?new=1' },
contact: { title: 'Gọi hoặc nhắn Zalo cho khách', how: 'Bấm Gọi hoặc Zalo ngay trên dòng khách – app tự ghi lại lần liên hệ.', btn: 'Khách hàng', icon: 'phone', path: 'customers/customers' },
remind: { title: 'Hẹn ngày gọi lại', how: 'Đặt một nhắc việc (gọi lại, hẹn xem nhà…) – đến hạn app nhắc anh/chị ở Bảng tin.', btn: 'Đặt nhắc', icon: 'clock', path: 'customers/care?new=1' },
invite: { title: 'Mời nhân viên vào app', how: 'Tạo tài khoản cho Sale, Quản lý – mỗi người đăng nhập bằng tài khoản riêng, thấy đúng phần việc của mình.', btn: 'Mời nhân viên', icon: 'user', path: 'settings/users' }
};
export const TEXT = {
title: '3 việc đầu tiên',
lead: 'Nên làm trước để app bắt đầu giữ khách giúp anh/chị – làm xong việc nào, app tự đánh dấu việc đó.',
later: 'Để sau',
doneTitle: 'Xong cả 3 việc đầu tiên',
doneLead: 'Anh/chị đã sẵn sàng. Bảng tin sẽ nhắc việc hằng ngày; hướng dẫn đầy đủ ở nút ✨ Trợ lý AI.',
close: 'Đóng',
progress: (n, total) => 'Đã xong ' + n + '/' + total
};
export function variantOf({ role = '', company = false } = {}) {
if (role && role !== 'owner') return 'member';
return company ? 'company' : 'solo';
}
export function stepsFor(variant) { return variant === 'company' ? ['customer', 'invite', 'remind'] : ['customer', 'contact', 'remind']; }
export const isReal = (r) => !!r && !Number(r.deleted) && !/^demo_/.test(String(r.id || ''));
export function doneFrom({ objects = [], events = [], reminders = [], users = null } = {}) {
return {
customer: objects.some((_o5) => isReal(_o5) && (!_o5.kind || _o5.kind === 'customer')),
contact: events.some((e) => isReal(e) && (e.type === 'call' || e.type === 'zalo')),
remind: reminders.some((r) => isReal(r) && !r.virtual && r.kind !== 'policy_stale'),
invite: Array.isArray(users) && users.some((u) => u && u.role && u.role !== 'owner' && !Number(u.deleted) && !/\.demo$/i.test(String(u.username || '')))
};
}
export const VETERAN_CUSTOMERS = 5;
export const isVeteran = (objects = []) => objects.filter((_o5) => isReal(_o5) && (!_o5.kind || _o5.kind === 'customer')).length >= VETERAN_CUSTOMERS;
export function progressOf(steps, done) { const n = steps.filter((s) => done[s]).length; return { n, total: steps.length, all: n === steps.length }; }
export function readState(v) {
const _o5 = v && typeof v === 'object' ? v : {};
return { later: Math.max(0, Math.floor(Number(_o5.later) || 0)), done: _o5.done ? 1 : 0, seen: _o5.seen ? 1 : 0 };
}
export function shouldShow(_o9, { hiddenThisRun = false } = {}) { const s = readState(_o9); return !s.done && s.later < MAX_LATER && !hiddenThisRun; }
export function afterLater(_o9, now = Date.now()) { const s = readState(_o9); return { ...s, later: s.later + 1, at: now }; }
export function afterDone(_o9, now = Date.now()) { return { ...readState(_o9), done: 1, at: now }; }
export function stateStore({ settings, user, variant }) {
const uid = String((user && (user.id || user.username)) || 'me');
if (variant !== 'member' && settings && typeof settings.get === 'function') {
const key = KEY_PREFIX + uid;
return { key, get: () => readState(settings.get(key, null)), set: (v) => settings.set(key, v) };
}
const key = LS_PREFIX + uid;
return { key, get: () => readState(ls.get(key, null)), set: (v) => ls.set(key, v) };
}
let hiddenThisRun = false;
let _o1 = null;
function ensureCss() {
if (typeof document === 'undefined') return Promise.resolve();
if (_o1) return _o1;
_o1 = new Promise((res) => {
if (document.getElementById('bds-first3-css')) { res(); return; }
const l = document.createElement('link'); l.id = 'bds-first3-css'; l.rel = 'stylesheet'; l.href = new URL('./first_steps.4dc531143b.css', import.meta.url).href;
l.onload = () => res(); l.onerror = () => res(); document.head.appendChild(l);
setTimeout(res, 1500);
});
return _o1;
}
async function _ob(api) { try { const r = await api.call('users.list', {}); const l = Array.isArray(r) ? r : r && (r.users || r.items); return Array.isArray(l) ? l : null; } catch { return null; } }
let watching = null;
export async function showFirstSteps(args) {
const { S, view } = args || {};
if (!view || !S || !S.store) return null;
if (!watching && typeof S.store.on === 'function') {
let _oa = 0;
const _o0 = () => { clearTimeout(_oa); _oa = setTimeout(() => { const v = typeof document !== 'undefined' && document.getElementById('view'); if (v && v.querySelector('[data-testid="first3"]:not(.is-done)')) _o2({ ...watching.args, view: v }).catch(() => {}); }, 250); };
watching = { args, off: ['objects', 'events', 'reminders'].map((t) => S.store.on(t, _o0)) };
}
if (watching) watching.args = args;
return _o2(args);
}
async function _o2({ S, ui, nav, view, company = false, canStep = () => true }) {
const variant = variantOf({ role: S.user && S.user.role, company });
const steps = stepsFor(variant).filter((id) => canStep(id));
if (steps.length < 2) return null;
const _o9 = stateStore({ settings: S.settings, user: S.user, variant });
if (!shouldShow(_o9.get(), { hiddenThisRun })) return null;
const [objects, events, reminders, users] = await Promise.all([S.store.list('objects'), S.store.list('events'), S.store.list('reminders'),
steps.includes('invite') && S.api ? _ob(S.api) : Promise.resolve(null)]);
const done = doneFrom({ objects, events, reminders, users });
const p = progressOf(steps, done);
const cur = _o9.get();
if (!cur.seen && isVeteran(objects)) { await _o9.set(afterDone(cur)); return null; }
if (p.all) {
await _o9.set(afterDone(cur));
if (!cur.seen) return null;
} else if (!cur.seen) await _o9.set({ ...cur, seen: 1 });
if (!view.isConnected) return null;
await ensureCss();
const _o3 = _o8({ ui, nav, steps, done, p, onLater: async () => { hiddenThisRun = true; _o3.remove(); await _o9.set(afterLater(_o9.get())); } });
const _o7 = view.querySelector('[data-testid="first3"]');
if (_o7) _o7.replaceWith(_o3); else view.insertBefore(_o3, view.children[1] || null);
return _o3;
}
function _o8({ ui, nav, steps, done, p, onLater }) {
const { h, button } = ui;
if (p.all) {
const _o3 = h('section', { class: 'card first3 is-done', role: 'status', 'data-testid': 'first3', 'data-done': 'all' },
h('div', { class: 'first3-head' }, h('span', { class: 'card-ico first3-ico' }, ui.icon('check', 22)),
h('div', null, h('h3', { class: 'first3-title' }, TEXT.doneTitle), h('p', { class: 'muted small' }, TEXT.doneLead))),
h('div', { class: 'btn-row' }, button(TEXT.close, () => _o3.remove(), { kind: 'secondary', small: true, icon: 'close', testid: 'first3-close' })));
return _o3;
}
const next = steps.find((x) => !done[x]);
const list = h('ol', { class: 'first3-list' }, steps.map((id, i) => {
const s = STEP[id]; const _o6 = !!done[id];
return h('li', { class: ['first3-step', _o6 && 'is-ok', id === next && 'is-next'], 'data-step': id, 'data-state': _o6 ? 'done' : 'todo', 'data-testid': 'first3-step-' + id },
h('span', { class: 'first3-n', 'aria-hidden': 'true' }, _o6 ? ui.icon('check', 18) : String(i + 1)),
h('div', { class: 'first3-body' },
h('strong', null, s.title, _o6 ? h('span', { class: 'sr-only' }, ' – đã xong') : null),
id === next ? h('p', { class: 'muted small' }, s.how) : null),
_o6 ? h('span', { class: 'first3-tick', 'data-testid': 'first3-ok-' + id }, 'Đã xong')
: button(s.btn, () => nav(s.path), { kind: id === next ? 'primary' : 'secondary', small: true, icon: s.icon, testid: 'first3-go-' + id }));
}));
return h('section', { class: 'card first3', role: 'region', 'aria-label': TEXT.title, 'data-testid': 'first3', 'data-done': String(p.n) },
h('div', { class: 'first3-head' },
h('span', { class: 'card-ico first3-ico' }, ui.icon('sparkle', 22)),
h('div', { class: 'first3-htext' }, h('h3', { class: 'first3-title' }, TEXT.title), h('p', { class: 'muted small' }, TEXT.lead)),
h('span', { class: 'first3-prog', 'data-testid': 'first3-progress' }, TEXT.progress(p.n, p.total))),
list,
h('div', { class: 'btn-row first3-foot' }, button(TEXT.later, onLater, { kind: 'ghost', small: true, icon: 'clock', testid: 'first3-later' })));
}
export function maybeShow({ S, ui, nav, hasModule = () => true, owner = true }) {
if (!S || !S.store) return;
try { const _oc = S.wizard && typeof S.wizard.state === 'function' ? S.wizard.state() : null; if (_oc && !_oc.dismissed && !_oc.finished) return; } catch { }
const _o4 = () => {
const view = typeof document !== 'undefined' && document.getElementById('view');
if (!view || !S.route || S.route.screen !== 'home' || S.route.module) return;
const company = String((S.status && S.status.edition) || '') === 'cong-ty' || !!(S.status && S.status.owner_company === true) || !!(S.settings && S.settings.get('install.mode', '') === 'company');
showFirstSteps({ S, ui, nav, view, company, canStep: (id) => (id === 'invite' ? owner : hasModule(id === 'remind' ? 'care' : 'customers')) }).catch(() => {});
};
if (S.store.status().lastSync) { _o4(); return; }
let off = null;
off = S.store.onStatus((_o9) => { if (_o9 && _o9.lastSync) { setTimeout(() => off && off(), 0); _o4(); } });
}
export function _resetRun() { hiddenThisRun = false; }
export default { maybeShow, showFirstSteps, variantOf, stepsFor, doneFrom, progressOf, readState, shouldShow, afterLater, afterDone, stateStore, STEP, TEXT, MAX_LATER };

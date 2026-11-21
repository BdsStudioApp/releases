import { FLOWS, flowIds, stepFor, stepsFor } from './steps.js';
export const VERSION = 1;
export const STATUSES = ['ok', 'fail', 'skip', 'later'];
const _o0 = ['copy', 'allow', 'account'];
export const DEMO_SKIPPABLE = ['copy', 'allow'];
export class WizardError extends Error {
constructor(code, message) { super(message || code); this.code = code; }
}
const clone = (s) => JSON.parse(JSON.stringify(s));
export function start(flow, { now = Date.now(), installed = false, portal = false } = {}) {
if (!FLOWS[flow]) throw new WizardError('BAD_FLOW', 'Luồng không hợp lệ: ' + flow);
const res = {};
if (installed) for (const id of _o0) res[id] = { s: 'ok', at: now, msg: 'Đã cài trước đó' };
const s = { v: VERSION, flow, cur: FLOWS[flow][0], res, data: {}, samples: 'none', origin: installed ? 'settings' : 'new', started: now, updated: now, finished: 0 };
if (portal) s.portal = 1;
return { ...s, cur: firstPending(s) || FLOWS[flow][0] };
}
export const steps = (state) => stepsFor(state && state.flow, { portal: !!(state && state.portal) });
export const ids = (state) => flowIds(state && state.flow, { portal: !!(state && state.portal) });
export const current = (state) => stepFor(state.cur, state.flow);
export function canSkip(_oc) { return !!_oc && (!_oc.required || !!_oc.deferrable); }
export function isDone(state, id) {
const _o9 = state.res[id];
if (!_o9) return false;
if (_o9.s === 'ok') return true;
if (_o9.s === 'skip' && state.demo && DEMO_SKIPPABLE.includes(id)) return true;
if (_o9.s === 'skip' || _o9.s === 'later') return canSkip(stepFor(id, state.flow));
return false;
}
export function firstPending(state, { phases } = {}) {
for (const id of ids(state)) {
if (isDone(state, id)) continue;
if (phases && !phases.includes(stepFor(id, state.flow).phase)) continue;
return id;
}
return null;
}
export function record(state, id, result, now = Date.now()) {
if (!ids(state).includes(id)) throw new WizardError('BAD_STEP', 'Bước không có trong luồng: ' + id);
const s = clone(state);
const ok = !!(result && result.ok);
s.res[id] = { s: ok ? 'ok' : 'fail', at: now, msg: String((result && (result.msg || result.cause)) || '').slice(0, 300) };
if (!ok && result && result.wait) s.res[id].wait = true;
s.updated = now;
return s;
}
export function skip(state, id, kind = 'later', now = Date.now()) {
const _oc = stepFor(id, state.flow);
if (!_oc || !ids(state).includes(id)) throw new WizardError('BAD_STEP', 'Bước không có trong luồng: ' + id);
if (!canSkip(_oc)) throw new WizardError('REQUIRED', 'Bước "' + _oc.title + '" bắt buộc – không bỏ qua được.');
if (_oc.required && kind === 'skip') kind = 'later';
const s = clone(state);
s.res[id] = { s: kind === 'skip' ? 'skip' : 'later', at: now, msg: '' };
s.updated = now;
return next(s, { now });
}
export function skipOptional(state, { now = Date.now() } = {}) {
const s = clone(state);
for (const _ob of steps(s)) {
if (_ob.phase !== 'post' || _ob.required || isDone(s, _ob.id)) continue;
s.res[_ob.id] = { s: 'skip', at: now, msg: '' };
}
s.updated = now;
const _o6 = firstPending(s);
s.cur = _o6 || ids(s)[ids(s).length - 1];
return s;
}
export function canNext(state) { return isDone(state, state.cur); }
export function next(state, { now = Date.now() } = {}) {
if (!canNext(state)) throw new WizardError('STEP_NOT_DONE', 'Làm xong (hoặc bấm Làm sau) bước này rồi mới sang bước kế.');
const list = ids(state);
const _o3 = list.indexOf(state.cur);
const s = clone(state);
s.updated = now;
const _o1 = list.slice(_o3 + 1).find((id) => !isDone(s, id));
const _o7 = _o1 || firstPending(s);
if (_o7) s.cur = _o7;
else { s.cur = list[list.length - 1]; if (!s.finished) s.finished = now; }
return s;
}
export function back(state, { now = Date.now() } = {}) {
const list = ids(state);
const _o3 = list.indexOf(state.cur);
if (_o3 <= 0) return state;
const _o8 = stepFor(list[_o3 - 1], state.flow);
if (_o8.phase === 'pre' && stepFor(state.cur, state.flow).phase === 'post') return state;
return { ...clone(state), cur: list[_o3 - 1], updated: now };
}
export function goTo(state, id, { now = Date.now() } = {}) {
const list = ids(state);
if (!list.includes(id)) throw new WizardError('BAD_STEP', 'Bước không có trong luồng: ' + id);
const _o3 = list.indexOf(id);
const _o2 = list.slice(0, _o3).some((x) => !isDone(state, x));
if (_o2) throw new WizardError('LOCKED', 'Làm lần lượt: còn bước trước chưa xong.');
return { ...clone(state), cur: id, updated: now };
}
export function skipDemo(state, { now = Date.now() } = {}) {
const s = clone(state);
s.demo = now; s.updated = now;
for (const id of DEMO_SKIPPABLE) if (ids(s).includes(id) && !(s.res[id] && s.res[id].s === 'ok')) s.res[id] = { s: 'skip', at: now, msg: 'Xem thử – chưa cài máy chủ thật' };
s.cur = firstPending(s) || s.cur;
return s;
}
export function leaveDemo(state, { now = Date.now(), connected = true } = {}) {
if (!state || !state.demo) return state;
const s = clone(state);
delete s.demo; s.updated = now; s.finished = 0;
for (const id of DEMO_SKIPPABLE) {
if (!s.res[id] || s.res[id].s !== 'skip') continue;
if (connected) s.res[id] = { s: 'ok', at: now, msg: 'Đã nối máy chủ thật' }; else delete s.res[id];
}
s.cur = firstPending(s) || s.cur;
return s;
}
export const isDemo = (state) => !!(state && state.demo);
export function progress(state) {
const list = steps(state);
const done = list.filter((_ob) => isDone(state, _ob.id)).length;
const main = list.filter((_ob) => _ob.main);
const mainDone = main.filter((_ob) => isDone(state, _ob.id)).length;
const _oa = list.filter((_ob) => _ob.required && state.res[_ob.id]?.s !== 'ok').map((_ob) => _ob.id);
return { done, total: list.length, pct: list.length ? Math.round((done / list.length) * 100) : 0, mainDone, mainTotal: main.length, index: list.findIndex((_ob) => _ob.id === state.cur) + 1, requiredLeft: _oa };
}
export function stepText(state) { const _o6 = progress(state); return 'Bước ' + _o6.index + '/' + _o6.total; }
export function pendingRequired(state) {
if (!state || !state.flow) return [];
return steps(state).filter((_ob) => _ob.required && state.res[_ob.id] && state.res[_ob.id].s === 'later').map((_ob) => ({ id: _ob.id, title: _ob.title }));
}
export function beforeStep(state, id) {
if (!state || !state.flow || state.finished || state.dismissed) return false;
const list = ids(state);
const _o3 = list.indexOf(id);
if (_o3 < 0 || isDone(state, id)) return false;
return list.indexOf(state.cur) < _o3;
}
export function afterLogin(state, { now = Date.now(), username = '' } = {}) {
let s = clone(state);
for (const id of _o0) if (ids(s).includes(id) && !isDone(s, id)) s.res[id] = { s: 'ok', at: now, msg: id === 'account' && username ? '@' + username : 'Đã xong' };
s.updated = now;
const _o4 = firstPending(s);
if (_o4) s.cur = _o4;
return s;
}
export function upgrade(state, { now = Date.now() } = {}) {
if (state.flow !== 'personal') throw new WizardError('BAD_FLOW', 'Chỉ nâng được từ Cá nhân lên Công ty.');
const s = clone(state);
s.flow = 'company';
s.finished = 0; s.updated = now;
s.upgraded = now;
s.res = Object.fromEntries(Object.entries(s.res).filter(([id]) => ids(s).includes(id) && !['finish'].includes(id)));
for (const [id, _o9] of Object.entries(s.res)) if (_o9.s === 'skip' && stepFor(id, 'company').required) delete s.res[id];
s.cur = firstPending(s) || ids(s)[0];
return s;
}
export function downgrade(state, { users = 1, now = Date.now() } = {}) {
if (state.flow !== 'company') throw new WizardError('BAD_FLOW', 'Chỉ chuyển được từ Công ty về Cá nhân.');
if (Number(users) > 1) throw new WizardError('MANY_USERS', 'Còn ' + users + ' người dùng – khoá hết tài khoản nhân viên, chỉ để lại tài khoản Quản trị rồi mới chuyển về Cá nhân.');
const s = clone(state);
s.flow = 'personal'; s.updated = now; s.finished = 0;
s.res = Object.fromEntries(Object.entries(s.res).filter(([id]) => ids(s).includes(id) && id !== 'finish'));
s.cur = firstPending(s) || ids(s)[0];
return s;
}
export function normalize(raw) {
let _o5 = raw;
if (typeof _o5 === 'string') { try { _o5 = JSON.parse(_o5); } catch { return null; } }
if (!_o5 || typeof _o5 !== 'object' || !FLOWS[_o5.flow]) return null;
const list = flowIds(_o5.flow, { portal: !!_o5.portal });
const res = {};
if (_o5.res && typeof _o5.res === 'object') for (const [id, _o9] of Object.entries(_o5.res)) {
if (list.includes(id) && _o9 && STATUSES.includes(_o9.s)) res[id] = { s: _o9.s, at: Number(_o9.at) || 0, msg: String(_o9.msg || '').slice(0, 300) };
}
const s = {
v: VERSION, flow: _o5.flow, cur: list.includes(_o5.cur) ? _o5.cur : list[0], res,
data: _o5.data && typeof _o5.data === 'object' && !Array.isArray(_o5.data) ? _o5.data : {},
samples: ['none', 'loaded', 'cleared'].includes(_o5.samples) ? _o5.samples : 'none',
origin: _o5.origin === 'settings' ? 'settings' : 'new',
started: Number(_o5.started) || 0, updated: Number(_o5.updated) || 0, finished: Number(_o5.finished) || 0
};
if (_o5.upgraded) s.upgraded = Number(_o5.upgraded) || 0;
if (_o5.dismissed) s.dismissed = true;
if (_o5.demo) s.demo = Number(_o5.demo) || 1;
if (_o5.portal) s.portal = 1;
if (_o5.closed) s.closed = Number(_o5.closed) || 1;
return s;
}
export function isFinished(state) { return !!state && !!state.finished && !firstPending(state); }
export function setData(state, patch, now = Date.now()) {
return { ...clone(state), data: { ...(state.data || {}), ...patch }, updated: now };
}
export default { start, steps, ids, current, canSkip, isDone, firstPending, record, skip, skipOptional, canNext, next, back, goTo, progress, stepText, pendingRequired, beforeStep, afterLogin, upgrade, downgrade, normalize, isFinished, setData, skipDemo, leaveDemo, isDemo, DEMO_SKIPPABLE, WizardError };

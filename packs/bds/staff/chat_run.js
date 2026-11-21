import * as CH from '../_lib/staff_chat.js';
import * as S from '../_lib/staff.js';
import * as F from './flow.js';
import { canEraseMem } from './memory_store.js';
export const NO_AI = 'Chưa nối AI online (Gemini hoặc Claude API). Bấm "Nhờ Claude" để làm qua chat Claude, hoặc nối AI ở Cài đặt › Kết nối.';
export const HIDDEN_KIND = 'staff_chat_hidden';
const _o0 = new Map();
export const runningHere = id => _o0.has(id);
const _oo = ms => new Promise(_oj => setTimeout(_oj, ms));
const _o1 = ['waiting_approval', 'done', 'error'];
export function aiReady(ctx) {
const _o2 = ctx && ctx.ai;
if (!_o2 || typeof _o2.run !== 'function') return false;
try { return typeof _o2.connected === 'function' ? !!_o2.connected() : true; } catch { return true; }
}
export async function listThread(K, threadId) { return CH.threadMsgs(await K.list('objects'), threadId); }
export async function getMsg(K, id) { return CH.objectToMsg(await K.get('objects', id)); }
export async function saveMsg(K, m) { await K.put('objects', CH.msgToObject(m)); return m; }
export async function loadCfg(K) { return CH.normalizeChatSettings(await K.setting('staff_chat', null)); }
export async function saveCfg(K, _o6) { const _o5 = CH.normalizeChatSettings(_o6); await K.setSetting('staff_chat', _o5); return _o5; }
const _on = (K, threadId, text, role = 'system') => saveMsg(K, CH.makeMsg({ thread_id: threadId, role, text }));
async function _ok(K, _od) {
const _o8 = canEraseMem(K);
for (const m of _od || []) {
const row = await K.get('objects', m.id);
if (!row || row.kind !== CH.CHAT_KIND) continue;
await K.put('objects', _o8 ? { ...row, deleted: 1 } : { ...row, kind: HIDDEN_KIND });
}
}
export async function prune(K, threadId) {
const { drop } = CH.pruneThread(await listThread(K, threadId));
if (drop.length) await _ok(K, drop);
return drop.length;
}
export async function clearThread(D, threadId) {
const _o9 = _o0.get(threadId); if (_o9) _o9.stop = true;
const _od = await listThread(D.K, threadId);
await _ok(D.K, _od);
return _od.length;
}
function _o7(D, { room, staff, staffList, text, lib, customers, memories, extra, title, now = Date.now() }) {
const _oe = { id: room.id, name: room.name || staff.name, steps: [{ staff_id: staff.id, instruction: '' }], budget_usd_day: Number(room.budget_usd_day) || 0, mode: 'semi' };
const t = F.makeStepTask({ room: _oe, staffList, stepIndex: 0, taskText: text, lib, customers, now, deps: D.DEPS, memories });
if (!t) return null;
t.input = { ...t.input, chat: 1, ...extra };
if (title) t.title = String(title).slice(0, 140);
if (!aiReady(D.ctx)) { t.status = 'error'; t.output = { error: NO_AI, no_ai: 1, finished_at: now }; }
return t;
}
export async function waitTask(D, id, shouldStop, { maxMs = 15 * 60000 } = {}) {
let _oh = null;
const _os = Date.now();
while (Date.now() - _os < maxMs) {
if (shouldStop && shouldStop()) return null;
const row = await D.K.get('jobs', id);
if (!row || Number(row.deleted)) return { status: 'error', output: { error: 'Việc đã bị xoá' } };
const _ou = S.taskView(row);
if (_o1.includes(_ou.status)) return _ou;
if (!_oh) _oh = Promise.resolve(D.runPending({ manual: true })).catch(() => null).finally(() => { _oh = null; });
await _oo(350);
}
return { status: 'error', output: { error: 'Quá lâu chưa có kết quả' } };
}
export async function sendToStaff(D, { staffId, text, now = Date.now() } = {}) {
const { K } = D;
const _o5 = CH.checkRequest(text);
if (!_o5.ok) return _o5;
const { staffList, jobs } = await D.loadAll();
const _op = staffList.find(s => s.id === staffId);
if (!_op) return { ok: false, error: 'Không tìm thấy nhân viên.' };
if (!S.canChat(_op)) return { ok: false, error: 'Không tìm thấy nhân viên.' };
const _o6 = CH.threadCfg(await loadCfg(K), _op.id);
const _oi = CH.quotaCheck({ used: CH.runsToday(jobs, _op.id, now), cap: _o6.runs_per_day, need: 1 });
if (!_oi.ok) return { ok: false, error: _oi.error };
await saveMsg(K, CH.makeMsg({ thread_id: _op.id, role: 'owner', text: _o5.text, now }));
const t = _o7(D, { room: F.directRoom(_op), staff: _op, staffList, text: _o5.text, lib: await D.loadLib(), customers: await D.customers(),
memories: await D.loadMems(), extra: { chat_thread: _op.id }, now });
if (!t) return { ok: false, error: 'Chưa tạo được việc.' };
const _om = await K.put('jobs', S.taskRow(t));
await saveMsg(K, CH.makeMsg({ thread_id: _op.id, role: 'staff', staff_id: _op.id, task_id: _om.id, now: now + 1 }));
const done = (t.status === 'error' ? Promise.resolve(S.taskView(_om)) : waitTask(D, _om.id)).finally(() => prune(K, _op.id).catch(() => 0));
return { ok: true, task_id: _om.id, done };
}
export async function retryTask(D, taskId) {
const row = await D.K.get('jobs', taskId);
if (!row) return null;
if (!aiReady(D.ctx)) { D.K.toast(NO_AI, 'warn'); return null; }
await D.K.put('jobs', { ...row, status: 'queued', output: '{}' });
return waitTask(D, taskId);
}
export async function handoffTask(D, taskId) {
const { K, ctx } = D;
const row = await K.get('jobs', taskId);
if (!row || !ctx.ai || typeof ctx.ai.handoff !== 'function') return false;
const t = S.taskView(row);
const _ot = await ctx.ai.handoff('staff', t.input.prompt || '', { target: 'claude' });
if (!_ot) return false;
await K.put('jobs', S.taskRow({ ...t, status: 'waiting_approval', output: { ...t.output, text: _ot, final_text: _ot, provider: 'handoff_claude', error: '', no_ai: 0, finished_at: Date.now() } }));
return true;
}
async function _ol(D, roomId) {
const all = await D.loadAll();
const room = all.rooms.find(_oj => _oj.id === roomId);
return { ...all, room, members: CH.roomMembers(room, all.staffList) };
}
const _o4 = 'Phòng đang làm yêu cầu trước – chờ xong hoặc bấm Dừng.';
export async function sendToRoom(D, { roomId, text, pickStaffId, pickMsgId } = {}) {
const { K, ctx } = D;
const { room, members } = await _ol(D, roomId);
if (!room) return { ok: false, error: 'Không tìm thấy phòng.' };
if (!members.length) return { ok: false, error: 'Phòng chưa có nhân viên đang bật.' };
if (_o0.has(roomId) || CH.threadBusy(await listThread(K, roomId))) return { ok: false, error: _o4 };
let request;
if (pickStaffId) {
const pm = pickMsgId ? await getMsg(K, pickMsgId) : null;
request = (pm && pm.request) || String(text || '');
if (pm) await saveMsg(K, { ...pm, answered: pickStaffId });
} else {
const _o5 = CH.checkRequest(text);
if (!_o5.ok) return _o5;
request = _o5.text;
await saveMsg(K, CH.makeMsg({ thread_id: roomId, role: 'owner', text: request }));
}
const _o6 = CH.threadCfg(await loadCfg(K), roomId);
let plan = null;
if (pickStaffId) plan = CH.planFromPick({ text: request, members, staffId: pickStaffId });
else {
if (_o6.ai_split && aiReady(ctx)) {
try {
const _oj = await ctx.ai.run('staff', { prompt: CH.planPrompt({ text: request, members }), json: true });
const _og = CH.parsePlanReply((_oj && (_oj.text ?? _oj)) || '', members);
if (_og.ok) plan = _og;
} catch { }
}
if (!plan) plan = CH.planByRules({ text: request, members, lib: await D.loadLib() });
}
if (!plan.ok) {
if (plan.needPick) {
await saveMsg(K, CH.makeMsg({ thread_id: roomId, role: 'pick', text: plan.error, request, options: plan.options }));
return { ok: true, needPick: true };
}
await _on(K, roomId, plan.error);
return { ok: false, error: plan.error };
}
const pm = await saveMsg(K, CH.makeMsg({ thread_id: roomId, role: 'plan', request, run: CH.newRun(plan.plan, _o6.mode) }));
const _of = { ok: true, plan_id: pm.id };
if (pm.run.status === 'running') _of.done = executeRun(D, roomId, pm.id);
prune(K, roomId).catch(() => 0);
return _of;
}
export async function executeRun(D, roomId, planMsgId) {
const { K } = D;
if (_o0.has(roomId)) return { ok: false, error: _o4 };
const _ob = { stop: false };
_o0.set(roomId, _ob);
try {
let m = await getMsg(K, planMsgId);
if (!m || !m.run || !['planned', 'running'].includes(m.run.status)) return { ok: false, error: 'Kế hoạch không còn chạy được.' };
m = { ...m, run: m.run.status === 'planned' ? CH.startRun(m.run) : { ...m.run, updated_at: Date.now() } };
m.run.steps = m.run.steps.map(s => (s.state === 'running' ? { ...s, state: 'wait' } : s));
const _oa = await _ol(D, roomId);
const _o6 = CH.threadCfg(await loadCfg(K), roomId);
const need = m.run.steps.filter(s => s.state === 'wait').length;
const _oi = CH.quotaCheck({ used: CH.runsToday(_oa.jobs, roomId), cap: _o6.runs_per_day, need });
if (!_oi.ok) {
m.run = { ...CH.cancelRun(m.run), status: 'error', error: _oi.error };
await saveMsg(K, m); await _on(K, roomId, _oi.error);
return { ok: false, error: _oi.error };
}
await saveMsg(K, m);
const results = {};
const customers = await D.customers();
for (const s of m.run.steps) if (s.state === 'done' && s.task_id) {
const row = await K.get('jobs', s.task_id);
if (row) { const _ou = S.taskView(row); results[s.n] = { text: _ou.output.final_text || _ou.output.text || '' }; }
}
for (let _oc = 0; _oc <= CH.CHAT_LIMITS.maxSteps; _oc++) {
m = await getMsg(K, planMsgId);
if (!m || _ob.stop || m.run.status !== 'running') break;
const i = CH.nextRunnable(m.run);
if (i < 0) break;
const _oq = m.run.steps[i];
const all = await _ol(D, roomId);
const _op = all.staffList.find(s => s.id === _oq.staff_id);
if (!_op || !S.canAutoRun(_op)) { m.run = CH.finishStep(m.run, i, { ok: false, error: `${_oq.name || 'Nhân viên'} đã tắt (phòng không tự giao việc cho người tắt – 💬 Chat thẳng được) hoặc bị xoá` }); await saveMsg(K, m); break; }
const _o3 = F.roomBudget(all.room, all.jobs.filter(S.isStaffTask).map(S.taskView));
if (_o3.over) { m.run = CH.finishStep(m.run, i, { ok: false, error: _o3.message }); await saveMsg(K, m); break; }
const text = CH.buildStepText({ request: m.request, run: m.run, index: i, results, staff: _op, customers });
const N = m.run.steps.length;
const t = _o7(D, { room: all.room, staff: _op, staffList: all.staffList, text, lib: await D.loadLib(), customers, memories: await D.loadMems(),
extra: { chat_thread: roomId, chat_run: m.run.id, chat_step: _oq.n }, title: `${_op.name}: ${String(m.request || '').replace(/\s+/g, ' ').slice(0, 80)} (bước ${_oq.n}/${N})` });
if (!t) { m.run = CH.finishStep(m.run, i, { ok: false, error: 'Chưa tạo được việc' }); await saveMsg(K, m); break; }
const _om = await K.put('jobs', S.taskRow(t));
m.run = CH.startStep(m.run, i, _om.id);
await saveMsg(K, m);
await saveMsg(K, CH.makeMsg({ thread_id: roomId, role: 'staff', staff_id: _op.id, task_id: _om.id, step_n: _oq.n, summary: !!_oq.summary }));
const _ou = t.status === 'error' ? S.taskView(_om) : await waitTask(D, _om.id, () => _ob.stop);
const cur = await getMsg(K, planMsgId);
if (!_ou || _ob.stop || !cur || cur.run.status !== 'running') { m = cur; break; }
const ok = _ou.status !== 'error';
if (ok) results[_oq.n] = { text: _ou.output.final_text || _ou.output.text || '', staff: _op };
m = { ...cur, run: CH.finishStep(cur.run, i, { ok, error: _ou.output && _ou.output.error }) };
await saveMsg(K, m);
if (!ok) break;
}
m = await getMsg(K, planMsgId);
if (m && _ob.stop && m.run.status === 'running') { m = { ...m, run: CH.stopRun(m.run) }; await saveMsg(K, m); }
if (m && m.run.status === 'done') {
const _or = m.run.steps.some(s => s.summary);
await _on(K, roomId, `✅ Xong ${m.run.steps.length} bước${_or ? ' – bản tổng hợp ở tin trên' : ''}. Mọi kết quả đã vào Việc cần duyệt: anh/chị duyệt rồi mới dùng (app không tự gửi khách, không tự đăng).`);
} else if (m && m.run.status === 'error') await _on(K, roomId, '⚠ ' + (m.run.error || 'Có bước lỗi – đã dừng chuỗi.'));
return { ok: true, status: m && m.run.status };
} finally { _o0.delete(roomId); }
}
export async function runPlan(D, roomId, planMsgId) {
if (_o0.has(roomId) || CH.threadBusy(await listThread(D.K, roomId))) return { ok: false, error: _o4 };
return { ok: true, done: executeRun(D, roomId, planMsgId) };
}
export async function stopPlan(D, roomId, planMsgId) {
const _o9 = _o0.get(roomId); if (_o9) _o9.stop = true;
const m = await getMsg(D.K, planMsgId);
if (m && m.run && m.run.status === 'running') {
await saveMsg(D.K, { ...m, run: CH.stopRun(m.run) });
await _on(D.K, roomId, '⏹ Đã dừng yêu cầu – các bước sau không chạy. Bước đang làm (nếu có) vẫn trả bản nháp vào Việc cần duyệt.');
}
return true;
}
export async function cancelPlan(D, planMsgId) {
const m = await getMsg(D.K, planMsgId);
if (m && m.run && m.run.status === 'planned') await saveMsg(D.K, { ...m, run: CH.cancelRun(m.run) });
}
export async function editPlan(D, roomId, planMsgId, plan) {
const { members } = await _ol(D, roomId);
const _ou = CH.validatePlan({ ...plan, source: 'edit' }, members);
if (!_ou.ok) return _ou;
const m = await getMsg(D.K, planMsgId);
if (!m || !m.run || m.run.status !== 'planned') return { ok: false, error: 'Kế hoạch đã chạy hoặc đã huỷ.' };
await saveMsg(D.K, { ...m, run: CH.newRun(_ou.plan, 'ask') });
return { ok: true };
}

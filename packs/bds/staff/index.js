import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/staff.js';
import * as SK from '../_lib/staff_skills.js';
import * as T from '../_lib/staff_templates.js';
import * as C from '../_lib/staff_custom.js';
import * as F from './flow.js';
import * as Store from './skill_store.js';
import * as M from '../_lib/staff_memory.js';
import * as MemStore from './memory_store.js';
import * as Learn from './memory_learn.js';
import { memoryPanel, openAddNote, askRejectReason } from './memory_ui.js';
import { skillsPanel, openAddSkill, openUpgradeSkills, openSkillFromEdit } from './skills_ui.js';
import { openCreateStaff, openStaffForm, deleteStaff, openRoomForm, deleteRoom, dataWarning, seg as segBtns } from './team_ui.js';
import { chatPanel, openChat, openPicker } from './chat_ui.js';
import * as CH from '../_lib/staff_chat.js';
import { parseData } from '../_lib/video.js';
const _ol = (ctx) => { try { return !!(ctx.ai && typeof ctx.ai.availability === 'function' && ctx.ai.availability().claude); } catch { return false; } };
const _o1 = `
.stf-flow{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.stf-flow .s{display:inline-flex;gap:6px;align-items:center;padding:6px 10px;border-radius:999px;background:var(--surface-2);border:1px solid var(--line-2);font-size:.85rem}
.stf-flow .a{color:var(--gold-2)}
.stf-board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.stf-col{background:var(--surface-2);border:1px solid var(--line);border-radius:14px;padding:8px;display:flex;flex-direction:column;gap:6px;min-height:120px}
.stf-col h4{margin:0;font-size:.85rem;display:flex;justify-content:space-between;color:var(--muted)}
.stf-col.c-review{border-color:var(--gold-line)}.stf-col.c-error{border-color:rgba(180,66,58,.35)}
.stf-task{all:unset;box-sizing:border-box;display:flex;flex-direction:column;gap:2px;padding:8px 10px;border-radius:11px;background:var(--card);border:1px solid var(--line-2);cursor:pointer;min-height:44px;font-size:.86rem}
.stf-task:focus-visible{outline:2px solid var(--gold)}
.stf-task small{color:var(--muted)}.stf-task .why{color:var(--danger)}
.stf-staff{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:12px}
.stf-card{border:1px solid var(--line-2);border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:8px;background:var(--card)}
.stf-card h4{margin:0;font-size:1.05rem}
.stf-seg{display:inline-flex;border:1px solid var(--line-2);border-radius:12px;overflow:hidden}
.stf-seg button{all:unset;white-space:nowrap;padding:0 12px;min-height:40px;display:flex;align-items:center;cursor:pointer;font-size:.85rem}
.stf-seg button[aria-pressed=true]{background:var(--navy);color:var(--cream)}
.stf-rule{display:flex;gap:6px;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--line);font-size:.88rem}
.stf-rep{white-space:pre-line;line-height:1.55;margin:0}
.stf-iss{margin:0;padding-left:18px}.stf-iss li{margin:2px 0}
.stf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(210px,100%),1fr));gap:12px;align-items:start}
.stf-staff{grid-template-columns:repeat(auto-fill,minmax(min(290px,100%),1fr))}
.stf-card{min-width:0}.stf-card.off{border-style:dashed;background:var(--surface-2)}.stf-card h4{overflow-wrap:anywhere;min-width:0;flex:1 1 auto}
.stf-card-top{display:flex;gap:8px;align-items:flex-start;justify-content:space-between;min-width:0}
.stf-card-acts{display:flex;gap:6px;align-items:center;flex:0 0 auto}
.stf-more{all:unset;box-sizing:border-box;cursor:pointer;min-width:44px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;border-radius:12px;border:1px solid var(--line-2);background:var(--surface-2);font-size:1.25rem;line-height:1}
.stf-more:focus-visible{outline:2px solid var(--gold)}
.stf-cando{margin:0;font-size:.92rem;line-height:1.45;overflow-wrap:anywhere}
.stf-status{color:var(--muted)}.stf-status.is-off{color:var(--gold-2);font-weight:600}
.stf-intro{border:1px solid var(--gold-line);border-radius:16px;padding:12px 14px;background:var(--card);display:flex;flex-direction:column;gap:8px;min-width:0}
.stf-intro[hidden]{display:none}
.stf-intro h3{margin:0;font-size:1.05rem}
.stf-intro ol{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px;line-height:1.5;overflow-wrap:anywhere}
.stf-trial-desc{margin:0;font-size:.92rem;line-height:1.45;overflow-wrap:anywhere;color:var(--muted)}
.stf-trial-desc b{color:var(--gold-2)}
.stf-adv{border:1px solid var(--line-2);border-radius:16px;padding:8px 12px;background:var(--card);min-width:0;display:flex;flex-direction:column;gap:12px}
.stf-adv>summary{cursor:pointer;min-height:44px;display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;font-weight:600;overflow-wrap:anywhere}
.stf-adv>summary small{font-weight:400;color:var(--muted)}
.stf-adv-count{display:inline-flex;align-items:center;gap:4px;padding:2px 10px;border-radius:999px;background:var(--gold-2);color:var(--card);font-size:.8rem;font-weight:600;white-space:nowrap}
.stf-adv-count[hidden]{display:none}
.stf-adv[open]>summary{margin-bottom:4px}
.stf-menu{gap:14px}
.stf-menu-btns{display:flex;flex-wrap:wrap;gap:6px}
.stf-sub{border-top:1px solid var(--line);padding-top:10px;display:flex;flex-direction:column;gap:8px}
.stf-sub h4{margin:0;font-size:.95rem}
.stf-more-box{border:1px solid var(--line-2);border-radius:12px;padding:8px 10px;min-width:0}
.stf-more-box>summary{cursor:pointer;min-height:36px;display:flex;align-items:center;font-weight:600;overflow-wrap:anywhere}
.stf-more-box[open]>summary{margin-bottom:8px}
.stf-tabs{display:flex;max-width:100%;overflow-x:auto}
.stf-tabs button{flex:1 1 auto}
.stf-pane{display:flex;flex-direction:column;gap:12px;min-width:0}
.stf-pane[hidden]{display:none}
.stf-checks{display:flex;flex-wrap:wrap;gap:6px 12px;padding:4px 0}
.stf-check{display:inline-flex;gap:6px;align-items:center;min-height:36px;font-size:.9rem;max-width:100%}
.stf-switch{display:flex;gap:10px;align-items:center;min-height:44px;font-weight:600}
.stf-switch input{width:22px;height:22px}
.stf-warn{background:var(--surface-2);border:1px solid var(--gold-line);border-radius:12px;padding:8px 10px;margin:0;font-size:.88rem}
.stf-tpls{display:flex;flex-direction:column;gap:8px}
.stf-tpl{all:unset;box-sizing:border-box;display:flex;gap:12px;align-items:center;padding:10px 12px;border:1px solid var(--line-2);border-radius:14px;cursor:pointer;min-height:56px;background:var(--card)}
.stf-tpl:focus-visible{outline:2px solid var(--gold)}
.stf-tpl .i{font-size:1.6rem}.stf-tpl small{display:block;color:var(--muted)}
.stf-step{display:grid;grid-template-columns:auto minmax(0,1fr) minmax(0,1.4fr) auto;gap:6px;align-items:center}
.stf-step select,.stf-step input{min-width:0;width:100%}
.stf-chips{display:flex;flex-wrap:wrap;gap:4px}
.stf-chip{font-size:.8rem;padding:2px 8px;border-radius:999px;background:var(--surface-2);border:1px solid var(--line-2);max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.stf-pre{white-space:pre-wrap;overflow-wrap:anywhere;max-width:100%}
.stf-pane-in{display:flex;flex-direction:column;gap:12px;min-width:0}
.stf-mems{display:flex;flex-direction:column;gap:8px;min-width:0}
.stf-mem{border:1px solid var(--line-2);border-radius:12px;padding:8px 10px;display:flex;flex-direction:column;gap:4px;min-width:0;background:var(--card)}
.stf-mem-t{overflow-wrap:anywhere;font-size:.9rem}
.stf-mem details pre{max-height:240px;overflow:auto}
.stf-chipbtns{gap:6px;margin:6px 0}
.stf-chipbtn{all:unset;box-sizing:border-box;cursor:pointer;padding:0 12px;min-height:36px;display:inline-flex;align-items:center;border-radius:999px;border:1px solid var(--line-2);background:var(--surface-2);font-size:.85rem}
.stf-chipbtn:focus-visible{outline:2px solid var(--gold)}
.bds-sheet-body textarea,.bds-sheet-body input[type=text],.bds-sheet-body select{max-width:100%;box-sizing:border-box}
@media (max-width:460px){.stf-step{grid-template-columns:auto minmax(0,1fr) auto}.stf-step input{grid-column:2/3}}
@media (max-width:900px){.stf-board{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:460px){.stf-board{grid-template-columns:1fr}.stf-col{min-height:0}}
`;
let _on = false;
function ensureCss() {
if (_on || typeof document === 'undefined') return;
_on = true;
try { const _o2l = new CSSStyleSheet(); _o2l.replaceSync(_o1); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _o2l]; return; } catch { }
const s = document.createElement('style'); s.textContent = _o1; document.head.appendChild(s);
}
const _o3 = { busy: false, listeners: new Set() };
const _oe = ctx => { try { return ctx && ctx.ai && typeof ctx.ai.availability === 'function' ? ctx.ai.availability() : null; } catch { return null; } };
const _o1j = () => _o3.listeners.forEach(_oz => { try { _oz(); } catch { } });
async function loadAll(K) {
const [staffRaw, roomsRaw, jobs] = await Promise.all([K.setting('staff', null), K.setting('rooms', null), K.list('jobs')]);
return { staffList: S.normalizeStaff(staffRaw), rooms: S.normalizeRooms(roomsRaw).map(r => (F.isVideoRoom(r) ? r : F.normalizeCustomRoom(r))), jobs };
}
async function loadLib(K) {
let _o1e = [];
try { _o1e = await Store.listSkills(K); } catch { _o1e = []; }
return F.mergeLibrary(T.BUILTIN_SKILLS, _o1e);
}
async function loadMems(K) { try { return await MemStore.listMemories(K); } catch { return []; } }
const DEPS = { makeAdhocTask: C.makeAdhocTask, buildMemoryContext: M.buildMemoryContext, M };
const _os = rooms => rooms.filter(r => !F.isVideoRoom(r));
const _o2c = (rooms, staffList, id) => rooms.find(r => r.id === id) || (String(id || '').startsWith('direct_') ? (st => st && F.directRoom(st))(staffList.find(s => 'direct_' + s.id === id)) : null);
async function _ot(K) { return F.customersOf(await K.list('objects')); }
async function _o1y(K, task, text) {
const { staffList, rooms } = await loadAll(K);
const room = _o2c(rooms, staffList, task.input.room_id);
const _o15 = F.nextStepIndex(task, room);
if (_o15 < 0) return null;
const next = F.makeStepTask({ room, staffList, stepIndex: _o15, taskText: task.input.task_text || '', prevText: text, lib: await loadLib(K),
customers: await _ot(K), deps: DEPS, parentId: task.id, memories: await loadMems(K) });
if (!next) return null;
return K.put('jobs', S.taskRow(next));
}
function _o31(t, staffList, lib) {
if (t.input.adhoc || t.input.skills_added) return t;
const st = staffList.find(s => s.id === t.input.staff_id);
const sel = st ? SK.selectSkills(lib, st, t.title || '') : [];
const block = SK.composeSkillBlock(sel);
if (!block) return t;
return { ...t, input: { ...t.input, prompt: String(t.input.prompt || '') + '\n\n' + block, skills_added: 1, used_skill_ids: sel.map(s => s.id) } };
}
const saveStaff = (K, list) => K.setSetting('staff', list);
const saveRooms = (K, rooms) => K.setSetting('rooms', rooms);
const _o2t = jobs => jobs.filter(S.isStaffTask).map(S.taskView);
async function _o1z(K, title, extra) {
try {
await K.put('reminders', { object_id: '', kind: 'custom', title, due_at: Date.now(), remind_before_days: 0, amount: 0, installment: 0, done: 0, notified_at: 0,
data: JSON.stringify({ source: 'staff', ...extra }) });
} catch { }
}
async function _o8(K, out, staffList) {
const _o2j = await K.put('jobs', S.taskRow(out.update));
for (const c of out.create || []) await K.put('jobs', S.taskRow({ ...c, input: { ...c.input, parent_id: c.input.parent_id || _o2j.id } }));
for (const _o15 of out.ideas || []) await K.put('ideas', _o15);
if (out.pair && staffList) {
const list = staffList.map(s => (s.id === out.pair.staff_id ? S.recordEdit(s, out.pair) : s));
await saveStaff(K, list);
}
return _o2j;
}
async function _oy(ctx, t) {
if (!ctx.ai || typeof ctx.ai.run !== 'function') return { ok: false, error: 'Chưa bật AI trong Cài đặt' };
try {
const r = await ctx.ai.run('staff', { prompt: t.input.prompt, json: !!t.input.json, provider: S.safeProvider(t.input.provider, _oe(ctx)) });
if (r && /^handoff/.test(r.provider || '')) return { ok: false, error: 'Nhân viên tự động không dùng handoff' };
return { ok: true, text: (r && (r.text ?? r)) || '', provider: r && r.provider, cost_usd: Number(r && r.cost_usd) || 0, tokens_in: r && r.tokens_in, tokens_out: r && r.tokens_out };
} catch (e) { return { ok: false, error: (e && (e.userMessage || e.message)) || 'AI không trả lời' }; }
}
export async function runPending(ctx, _o1o = {}) {
if (_o3.busy) return { skipped: true };
const K = kit(ctx);
_o3.busy = true; _o1j();
let ran = 0;
try {
let { staffList, rooms, jobs } = await loadAll(K);
let room = rooms[0];
for (const t of _o2t(jobs).filter(S.inboxApproved)) {
const out = S.approveTask(t, { room, staffList, editedText: t.output.edited_text });
await _o8(K, out, staffList);
if (t.input.adhoc) await _o1y(K, out.update, out.update.output.final_text);
}
const lib = await loadLib(K);
for (let _o14 = 0; _o14 < 30; _o14++) {
jobs = await K.list('jobs');
const tasks = _o2t(jobs);
const _o12 = S.budgetGuard(room, tasks);
if (_o12.switched) {
room = _o12.room; rooms = [room, ...rooms.slice(1)]; await saveRooms(K, rooms);
K.toast(room.paused_reason, 'warn');
await _o1z(K, 'Phòng ' + room.name + ': ' + room.paused_reason, { room_id: room.id });
}
const _o1v = tasks.filter(t => t.status === 'queued' && !S.inboxApproved(t) && (t.input.adhoc || !(_o12.over && !_o1o.manual))).sort((a, _of) => (a.input.created_at || 0) - (_of.input.created_at || 0));
if (!_o1v.length) break;
let t = _o1v[0];
if (t.input.adhoc) {
const _oo = await loadAll(K);
const _o9 = _o2c(_oo.rooms, _oo.staffList, t.input.room_id) || { id: t.input.room_id, name: t.input.room_name || '', budget_usd_day: t.input.budget_usd_day || 0 };
const _og = F.roomBudget(_o9, tasks);
if (_og.over) {
await K.put('jobs', S.taskRow({ ...t, status: 'error', output: { ...t.output, error: _og.message, budget_stop: 1, finished_at: Date.now() } }));
K.toast(_og.message, 'warn'); await _o1z(K, _og.message, { room_id: _o9.id }); _o1j();
continue;
}
await K.put('jobs', S.taskRow({ ...t, status: 'running' })); _o1j();
const done = F.adhocAfter(t, await _oy(ctx, t));
await K.put('jobs', S.taskRow(done));
await Learn.touchAfterRun(K, t.input.used_memory_ids).catch(() => 0);
if (done.status === 'done') await _o1y(K, done, done.output.final_text);
ran++; _o1j();
continue;
}
if (_o12.over) t.input.mode = 'semi';
t = _o31(t, staffList, lib);
t = F.withMemoryPrompt(t, staffList.find(s => s.id === t.input.staff_id), await loadMems(K), DEPS);
await K.put('jobs', S.taskRow({ ...t, status: 'running' })); _o1j();
const res = await _oy(ctx, t);
if (t.input.memory_added) await Learn.touchAfterRun(K, t.input.used_memory_ids).catch(() => 0);
await _o8(K, S.afterStep(t, res, { room, staffList: (await loadAll(K)).staffList }), null);
ran++; _o1j();
}
} finally { _o3.busy = false; _o1j(); }
return { ran };
}
export async function runRoom(ctx, { force = false } = {}) {
const K = kit(ctx);
const { staffList, rooms, jobs } = await loadAll(K);
const room = rooms[0];
if (!force && !S.roomDue(room)) return { skipped: true };
if (staffList.find(s => s.id === 'writer' && !S.canAutoRun(s))) return { skipped: true, off: true };
const ideas = await K.list('ideas');
const _o11 = S.planRoom({ room, staffList, ideas, tasks: _o2t(jobs) });
if (!force && !_o11.length && !_o2t(jobs).some(t => t.status === 'queued')) return { created: 0, ran: 0 };
for (const t of _o11) await K.put('jobs', S.taskRow(t));
await saveRooms(K, [{ ...room, last_run: S.runKey(room) }, ...rooms.slice(1)]);
const r = await runPending(ctx, { manual: force });
return { created: _o11.length, ...r };
}
export async function runAdhoc(ctx, { target, taskText, now = Date.now(), run = true } = {}) {
const K = kit(ctx);
const c = F.checkTaskText(taskText, C.LIMITS.taskTextMax);
if (!c.ok) return { ok: false, error: c.error };
const { staffList, rooms, jobs } = await loadAll(K);
const room = _o2c(rooms, staffList, target);
if (!room || F.isVideoRoom(room)) return { ok: false, error: 'Chọn phòng hoặc nhân viên để giao việc.' };
const _o30 = (room.steps || []).map(st => staffList.find(s => s.id === st.staff_id));
if (_o30.some(s => !s)) return { ok: false, error: 'Phòng có bước giao cho nhân viên đã xoá – sửa phòng trước.' };
const off = S.offBlocker(room, staffList);
if (off) return { ok: false, error: `${off.name} đang tắt nên phòng không tự giao việc cho người này – bật lại ở nút ⋯ trên thẻ nhân viên, hoặc 💬 Chat thẳng với ${off.name}.` };
const budget = F.roomBudget(room, _o2t(jobs), now);
if (budget.over) return { ok: false, error: budget.message, budget };
const t = F.makeStepTask({ room, staffList, stepIndex: 0, taskText: c.text, lib: await loadLib(K), customers: await _ot(K), now, deps: DEPS, memories: await loadMems(K) });
if (!t) return { ok: false, error: 'Phòng chưa có bước nào.' };
const _o2j = await K.put('jobs', S.taskRow(t));
if (!run) return { ok: true, task: _o2j, ran: 0, budget };
const r = await runPending(ctx, { manual: true });
return { ok: true, task: _o2j, ran: r.ran || 0, skipped: !!r.skipped, budget };
}
export async function runDueRooms(ctx, now = Date.now()) {
const K = kit(ctx);
const { rooms } = await loadAll(K);
const _ox = F.dueRooms(rooms, now);
if (!_ox.length) return { created: 0 };
await saveRooms(K, rooms.map(r => (_ox.some(_ou => _ou.id === r.id) ? { ...r, last_run: F.roomRunKey(r, now) } : r)));
let created = 0;
for (const r of _ox) { const _o33 = await runAdhoc(ctx, { target: r.id, taskText: r.daily_task, now, run: false }); if (_o33.ok) created++; }
if (created) await runPending(ctx, { manual: false });
return { created };
}
export async function catchUp(ctx) {
let r = { skipped: true };
try { r = await runRoom(ctx, { force: false }); } catch { r = { skipped: true }; }
try { await runDueRooms(ctx); } catch { }
return r;
}
export async function briefSection(ctx, { run = true } = {}) {
const K = kit(ctx);
if (run) catchUp(ctx);
const _o29 = S.morningReport({ jobs: await K.list('jobs') });
return K.card({ title: '☀️ Báo cáo sáng – Phòng Sản xuất video', testid: 'staff-morning', body: h('div', null,
h('p', { class: 'stf-rep' }, _o29.text.split('\n').slice(1).join('\n')),
h('div', { class: 'bds-row bds-wrap' }, K.button('Mở Việc cần duyệt', () => K.nav('#/home/inbox')), K.button('Nhân viên AI', () => K.nav('#/home/staff')))) });
}
export async function mount(el, ctx) {
ensureCss();
const K = kit(ctx);
el.innerHTML = '';
const _oh = h('div', { 'data-testid': 'staff-board' });
const roomBox = h('div', { 'data-testid': 'staff-room' });
const _o2o = h('div', { class: 'stf-staff', 'data-testid': 'staff-list' });
const _o2a = h('div', { 'data-testid': 'staff-report' });
const _o2d = h('div', { class: 'stf-staff', 'data-testid': 'room-list' });
const _o2p = h('small', { class: 'bds-muted', 'data-testid': 'staff-count' });
const _ob = h('div', { class: 'bds-form', 'data-testid': 'assign-box' });
const _o2n = h('div', { 'data-testid': 'skills-box' });
const _o1b = h('div', { 'data-testid': 'memory-box' });
const _o2 = 'bds:staff:intro';
let _o16 = false;
try { _o16 = localStorage.getItem(_o2) === 'hidden'; } catch { }
const introStart = h('span');
const introBox = h('section', { class: 'stf-intro', 'data-testid': 'staff-intro', 'aria-label': 'Nhân viên AI giúp anh/chị việc gì', hidden: _o16 },
h('h3', null, '🤝 Nhân viên AI giúp anh/chị việc gì'),
h('ol', null,
h('li', null, 'Chỉ nên dùng cho ', h('b', null, 'việc lặp đi lặp lại hằng ngày'), ': soạn tin chăm sóc khách, báo cáo, gom tin… Mỗi nhân viên một mảng việc, thẻ ghi rõ "Làm được: …".'),
h('li', null, h('b', null, 'Chat giao việc'), ' bằng lời thường → nhân viên trả ', h('b', null, 'bản nháp'), ' → anh/chị ', h('b', null, 'duyệt'), ' (Duyệt / Sửa / Bác). App không tự gửi khách, không tự đăng.'),
h('li', null, h('b', null, 'Phòng'), ' (nhiều nhân viên chia nhau làm nhiều bước), ', h('b', null, 'Kỹ năng & Trí nhớ'), ' nằm trong mục ', h('b', null, 'Nâng cao'), ' cuối màn – không dùng cũng được.')),
h('div', { class: 'bds-row bds-wrap' }, introStart,
K.button('Đã hiểu', () => _o2k(true), { testid: 'staff-intro-ok' })));
const introShow = K.button('❓ Nhân viên AI làm gì?', () => _o2k(false), { kind: 'ghost', testid: 'staff-intro-show', title: 'Xem lại giải thích ngắn' });
const _o1p = () => { introShow.hidden = !_o16; introShow.style.display = _o16 ? '' : 'none'; };
_o1p();
function _o2k(hide) {
_o16 = hide; introBox.hidden = hide; _o1p();
try { localStorage.setItem(_o2, hide ? 'hidden' : ''); } catch { }
}
function _o24(staffList) {
const st = S.starterStaff(staffList);
introStart.innerHTML = '';
if (st) introStart.appendChild(K.button('Bắt đầu: chat với ' + (st.icon || '🤖') + ' ' + st.name, () => openChat(D, { kind: 'staff', id: st.id }), { kind: 'primary', testid: 'staff-intro-start' }));
}
let _o1c = '';
try { _o1c = localStorage.getItem('bds:staff:mem') || ''; } catch { }
const D = {
K, ctx,
loadStaff: async () => (await loadAll(K)).staffList,
saveStaff: list => saveStaff(K, list),
loadRooms: async () => (await loadAll(K)).rooms,
saveRooms: list => saveRooms(K, list),
loadLib: () => loadLib(K),
refresh: () => _o20(),
loadAll: () => loadAll(K),
loadMems: () => loadMems(K),
customers: () => _ot(K),
runPending: _o1k => runPending(ctx, _o1k),
DEPS,
};
const _o2g = K.button('▶ Chạy phòng ngay', async () => {
const r = await runRoom(ctx, { force: true });
if (r.off) { K.toast('Biên kịch đang tắt nên phòng không tự chạy – bật lại ở nút ⋯ trên thẻ nhân viên (vẫn 💬 Chat được)', 'warn'); return; }
K.toast((r.created ? `Đã giao ${r.created} ý tưởng cho Biên kịch` : 'Không có ý tưởng đã duyệt mới') + (r.skipped ? ' · đang chạy cùng lượt trước' : r.ran ? ` · chạy ${r.ran} việc` : ''), 'success');
_o20();
}, { kind: 'primary', testid: 'staff-run' });
async function _o20() {
if (!el.isConnected && _ow) return;
_ow = true;
const { staffList, rooms, jobs } = await loadAll(K);
const lib = await loadLib(K);
_op = staffList;
_o24(staffList);
_o25(rooms[0], staffList, _o2t(jobs));
_o23(_o2t(jobs));
_o28(staffList, lib);
_o27(_os(rooms), staffList, _o2t(jobs));
_o26(rooms);
_o21(_os(rooms).length, F.mineCount(lib));
if (!_ob.contains(document.activeElement)) _o22(staffList, _os(rooms));
_o2n.innerHTML = '';
_o2n.appendChild(skillsPanel(D, lib, staffList));
if (!_o1b.contains(document.activeElement) || !_o1b.querySelector('[data-testid=mem-note-text]')?.value) {
const _o1d = await loadMems(K);
_o1b.innerHTML = '';
_o1b.appendChild(memoryPanel(D, { staffList, memories: _o1d, sel: _o1c, onSel: id => { _o1c = id; try { localStorage.setItem('bds:staff:mem', id); } catch { } _o20(); } }));
}
const _o29 = S.morningReport({ jobs });
_o2a.innerHTML = '';
_o2a.appendChild(h('p', { class: 'stf-rep', 'data-testid': 'staff-report-text' }, _o29.text.split('\n').slice(1).join('\n')));
_o2a.appendChild(h('div', { class: 'bds-row bds-wrap' }, K.button('Chép báo cáo', async () => { await K.copy(_o29.text); K.toast('Đã chép', 'success'); }),
h('small', { class: 'bds-muted' }, 'Hiện ở Bảng tin lúc mở app buổi sáng; gửi Telegram 7h khi máy chủ cập nhật.')));
_o2g.disabled = _o3.busy;
_o2g.textContent = _o3.busy ? '⏳ Đang chạy…' : '▶ Chạy phòng ngay';
}
let _ow = false;
let _op = [];
let assignTarget = '';
let _oc = '';
function _o27(list, staffList, tasks) {
_o2d.innerHTML = '';
const _o1i = id => { const s = staffList.find(_o33 => _o33.id === id); return s ? (s.icon || '🤖') + ' ' + s.name : '⚠ (đã xoá)'; };
for (const r of list) {
const _of = F.roomBudget(r, tasks);
_o2d.appendChild(h('div', { class: 'stf-card', 'data-testid': 'room-' + r.id },
h('h4', null, (r.icon || '🏢') + ' ' + r.name),
h('div', { class: 'stf-flow', 'aria-label': 'Các bước của phòng' }, r.steps.map((st, _o15) => [_o15 ? h('span', { class: 'a', 'aria-hidden': 'true' }, '→') : null,
h('span', { class: 's', title: st.instruction || '' }, _o1i(st.staff_id))]), h('span', { class: 'a', 'aria-hidden': 'true' }, '→'), h('span', { class: 's' }, '📥 Việc cần duyệt')),
h('small', { class: 'bds-muted' }, [r.schedule.mode === 'daily' ? '🕘 Hằng ngày ' + r.schedule.at : '✋ Chạy tay', S.MODES[r.mode],
'Hôm nay ' + _of.spent.toFixed(2) + (_of.cap ? '/' + _of.cap.toFixed(2) : '') + ' USD'].join(' · ')),
_of.over ? h('p', { class: 'bds-error', 'data-testid': 'room-over-' + r.id }, '⏸ ' + _of.message) : null,
h('div', { class: 'bds-row bds-wrap' },
K.button('💬 Chat phòng', () => openChat(D, { kind: 'room', id: r.id }), { kind: 'primary', testid: 'room-chat-' + r.id }),
K.button('▶ Giao việc', () => { assignTarget = r.id; _o22(staffList, list); _ob.scrollIntoView({ block: 'center' }); const ta = _ob.querySelector('textarea'); if (ta) ta.focus(); }, { testid: 'room-assign-' + r.id }),
K.button('Sửa', () => openRoomForm(D, r), { testid: 'room-edit-' + r.id }),
K.button('Xoá', () => deleteRoom(D, r), { testid: 'room-del-' + r.id }))));
}
if (!list.length) _o2d.appendChild(h('small', { class: 'bds-muted' }, 'Chưa có phòng tự tạo. Bấm "+ Tạo phòng" để ghép nhân viên thành chuỗi việc.'));
}
const roomChatBox = h('div', { class: 'bds-form', 'data-testid': 'room-chat-box' });
let roomChatSel = '', roomChatKey = '';
try { roomChatSel = localStorage.getItem('bds:staff:chatroom') || ''; } catch { }
function _o26(rooms) {
const _o17 = rooms.map(r => r.id + ':' + r.name).join('|');
if (!rooms.some(r => r.id === roomChatSel)) roomChatSel = (_os(rooms)[0] || rooms[0] || {}).id || '';
if (_o17 === roomChatKey && roomChatBox.querySelector('[data-thread="' + roomChatSel + '"]')) return;
roomChatKey = _o17;
roomChatBox.innerHTML = '';
const sel = K.select(rooms.map(r => [r.id, (r.icon || '🏢') + ' Phòng ' + r.name]), roomChatSel, { 'data-testid': 'room-chat-pick', 'aria-label': 'Chat với phòng',
onchange: e => { roomChatSel = e.target.value; try { localStorage.setItem('bds:staff:chatroom', roomChatSel); } catch { } roomChatKey = ''; _o20(); } });
roomChatBox.appendChild(K.field('Chat với phòng', sel, 'Nhắn một yêu cầu – trưởng phòng ảo chia việc cho từng người theo mảng/kỹ năng; ai làm xong báo ngay ở đây.'));
if (roomChatSel) roomChatBox.appendChild(chatPanel(D, { kind: 'room', id: roomChatSel }));
}
function _o22(staffList, list) {
const _o1o = [...list.map(r => [r.id, '🏢 Phòng ' + r.name]), ...staffList.map(s => ['direct_' + s.id, (s.icon || '🤖') + ' ' + s.name + (S.isOff(s) ? ' (tắt – vẫn giao thẳng được)' : '')])];
if (!_o1o.some(_o1k => _o1k[0] === assignTarget)) assignTarget = (_o1o[0] || [''])[0];
_ob.innerHTML = '';
const sel = K.select(_o1o, assignTarget, { 'data-testid': 'assign-target', 'aria-label': 'Giao cho', onchange: e => { assignTarget = e.target.value; _o2y(); } });
const max = C.LIMITS.taskTextMax;
const ta = h('textarea', { rows: 4, maxlength: String(max), 'data-testid': 'assign-text', placeholder: 'Ví dụ: soạn tin hỏi thăm khách đã xem nhà tuần này', 'aria-label': 'Việc cần làm',
oninput: e => { _oc = e.target.value; cnt.textContent = `${e.target.value.length}/${max}`; } });
ta.value = _oc;
const cnt = h('small', { class: 'bds-muted' }, `${ta.value.length}/${max}`);
const note = h('p', { class: 'bds-note stf-warn', 'data-testid': 'assign-warn', hidden: true });
async function _o2y() {
const { rooms } = await loadAll(K);
const room = _o2c(rooms, staffList, assignTarget);
const _o32 = room ? room.steps.map(st => staffList.find(s => s.id === st.staff_id)).filter(s => s && s.data_access === true) : [];
if (!_o32.length) { note.hidden = true; return; }
const _oq = await _ot(K);
const _o2x = _o32.map(s => { const c = C.customerContext(s, _oq); return `${s.name}: ${c.warning || `đọc dữ liệu rút gọn của ${c.used} khách đã đồng ý (không sđt/email)`}`; });
note.textContent = '🔓 ' + _o2x.join(' · '); note.hidden = false;
}
const _o13 = K.button('▶ Chạy', async () => {
_o13.disabled = true;
try {
const r = await runAdhoc(ctx, { target: assignTarget, taskText: ta.value });
if (!r.ok) { K.toast(r.error, 'warn'); return; }
_oc = '';
const _om = r.budget && r.budget.cap ? ` · hôm nay ${r.budget.spent.toFixed(2)}/${r.budget.cap.toFixed(2)} USD` : '';
K.toast((r.skipped ? 'Đã xếp hàng – đang chạy lượt khác' : 'Xong – kết quả ở cột Chờ duyệt (anh/chị duyệt rồi mới dùng)') + _om, 'success');
} finally { _o13.disabled = false; _o20(); }
}, { kind: 'primary', testid: 'assign-run' });
if (!_o1o.length) { _ob.appendChild(h('small', { class: 'bds-muted' }, 'Chưa có nhân viên.')); return; }
_ob.appendChild(K.field('Giao cho', sel));
_ob.appendChild(K.field('Việc cần làm', ta, 'Kết quả vào "Việc cần duyệt" (Bảng tin) – app không tự gửi khách, không tự đăng.'));
_ob.appendChild(note);
_ob.appendChild(h('div', { class: 'bds-row bds-wrap bds-end' }, cnt, _o13));
_o2y();
}
function seg(options, value, onPick, testid) {
return h('div', { class: 'stf-seg', role: 'group', 'data-testid': testid }, Object.entries(options).map(([v, l]) =>
h('button', { type: 'button', 'aria-pressed': String(v === value), 'data-v': v, onclick: () => onPick(v) }, l)));
}
function _o25(room, staffList, tasks) {
const _ou = new Date();
const spent = S.spentOn(tasks, room.id, _ou.getFullYear() + '-' + String(_ou.getMonth() + 1).padStart(2, '0') + '-' + String(_ou.getDate()).padStart(2, '0'));
const _o2h = async patch => { const { rooms } = await loadAll(K); await saveRooms(K, [{ ...rooms[0], ...patch }, ...rooms.slice(1)]); _o20(); };
const name = id => { const s = staffList.find(_o33 => _o33.id === id); return s ? s.icon + ' ' + s.name : id; };
roomBox.innerHTML = '';
roomBox.appendChild(h('div', { class: 'stf-flow', 'aria-label': 'Chuỗi việc của phòng' },
h('span', { class: 's' }, '🕘 ' + room.start + ' ý tưởng đã duyệt'),
room.steps.map(id => [h('span', { class: 'a', 'aria-hidden': 'true' }, '→'), h('span', { class: 's' }, name(id))]),
h('span', { class: 'a', 'aria-hidden': 'true' }, '→'), h('span', { class: 's' }, '📥 Sáng: Việc cần duyệt')));
if (room.paused_reason && room.mode === 'semi') {
roomBox.appendChild(h('div', { class: 'bds-note bds-warn', 'data-testid': 'room-paused' }, '⏸ ' + room.paused_reason + ' ',
K.button('Bật lại Tự động', () => _o2h({ mode: 'auto', paused_reason: '' }), { testid: 'room-resume' })));
}
const start = h('input', { type: 'time', value: room.start, 'data-testid': 'room-start', onchange: e => _o2h({ start: e.target.value || '21:00' }) });
const budget = h('input', { type: 'number', min: '0', step: '0.1', inputmode: 'decimal', value: String(room.budget_usd_day), 'data-testid': 'room-budget',
onchange: e => _o2h({ budget_usd_day: Math.max(0, Number(String(e.target.value).replace(',', '.')) || 0) }) });
roomBox.appendChild(h('div', { class: 'stf-grid' },
K.field('Giờ bắt đầu', start),
K.field('Ngân sách / ngày (USD)', budget, `Hôm nay đã dùng ${spent.toFixed(2)} USD · 0 = không giới hạn`),
h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, 'Chế độ phòng'),
seg(S.MODES, room.mode, v => _o2h({ mode: v, paused_reason: v === 'auto' ? '' : room.paused_reason }), 'room-mode'),
h('small', { class: 'bds-field-h' }, room.mode === 'auto' ? 'Tự động: chạy hết chuỗi, chỉ dừng khi Kiểm duyệt thấy lỗi.' : 'Bán tự động: dừng sau mỗi bước chờ anh/chị duyệt.'))));
roomBox.appendChild(h('p', { class: 'bds-muted', 'data-testid': 'room-online' }, 'Việc chạy online bằng AI online (Gemini hoặc Claude API qua máy chủ) khi mở app; tối qua chưa chạy thì app chạy bù lúc mở. Kịch bản xong vào Việc cần duyệt – làm video ở Ý tưởng & Video AI.'));
}
function _o23(tasks) {
const _of = S.board(tasks);
_oh.innerHTML = '';
const _o2q = id => ((_op.find(s => s.id === id) || S.DEFAULT_STAFF.find(s => s.id === id) || {}).icon) || '🤖';
const _o2z = ms => { if (!ms) return ''; const _ou = new Date(Number(ms)); return String(_ou.getHours()).padStart(2, '0') + ':' + String(_ou.getMinutes()).padStart(2, '0') + ' ' + String(_ou.getDate()).padStart(2, '0') + '/' + String(_ou.getMonth() + 1).padStart(2, '0'); };
_oh.appendChild(h('div', { class: 'stf-board' }, S.BOARD.map(([k, label]) => h('div', { class: 'stf-col c-' + k, 'data-testid': 'col-' + k },
h('h4', null, h('span', null, label), h('span', null, String(_of[k].length))),
_of[k].length ? _of[k].slice(0, 12).map(t => h('button', { type: 'button', class: 'stf-task', 'data-testid': 'task-' + t.id, onclick: () => _o1n(t.id) },
h('span', null, _o2q(t.input.staff_id) + ' ' + (t.title || 'Việc')),
h('small', null, [t.output.provider ? S.providerLabel(t.output.provider) : t.input.provider ? S.providerLabel(t.input.provider) : '', _o2z(t.output.finished_at || t.updated_at)].filter(Boolean).join(' · ')),
k === 'error' ? h('small', { class: 'why' }, '⚠ ' + (t.output.error || 'Không rõ lý do')) : null,
k === 'review' && t.output.issues && t.output.issues.length ? h('small', { class: 'why' }, t.output.issues.length + ' điểm cần sửa') : null))
: h('small', { class: 'bds-muted' }, k === 'doing' && _o3.busy ? 'Đang chạy…' : '—')))));
}
async function _o1n(id) {
const { staffList, rooms } = await loadAll(K);
const _o2e = await K.get('jobs', id);
if (!_o2e) return;
let t = S.taskView(_o2e);
const staff = staffList.find(s => s.id === t.input.staff_id) || { name: 'Nhân viên', id: t.input.staff_id };
const body = h('div', { class: 'bds-form', 'data-testid': 'task-sheet' });
const _o2l = K.sheet({ title: (staff.icon || '') + ' ' + (t.title || 'Việc'), testid: 'task-pack', body, onClose: () => _o20() });
const ta = h('textarea', { rows: 12, 'data-testid': 'task-output' });
ta.value = t.output.final_text || t.output.text || '';
const issues = t.output.issues || [];
body.appendChild(h('div', { class: 'bds-row bds-wrap' }, K.badge({ queued: 'Đang chờ', running: 'Đang làm', waiting_approval: 'Chờ duyệt', done: 'Xong', error: 'Lỗi' }[t.status] || t.status,
t.status === 'error' ? 'danger' : t.status === 'waiting_approval' ? 'warn' : t.status === 'done' ? 'success' : 'info'),
t.output.provider ? K.badge(S.providerLabel(t.output.provider), 'muted') : null,
t.output.cost_usd ? K.badge(Number(t.output.cost_usd).toFixed(3) + ' USD', 'muted') : null));
if (t.output.error) body.appendChild(h('p', { class: 'bds-error' }, '⚠ ' + t.output.error));
if (issues.length) body.appendChild(h('div', { 'data-testid': 'task-issues' }, h('strong', null, 'Kiểm duyệt thấy:'),
h('ul', { class: 'stf-iss' }, issues.map(_o15 => h('li', null, h('b', null, _o15.text || _o15.type), _o15.fix ? ' → ' + _o15.fix : '')))));
if (t.input.source_text && staff.id === 'reviewer') body.appendChild(h('details', null, h('summary', null, 'Kịch bản gốc'), h('pre', { class: 'bds-pre' }, t.input.source_text)));
body.appendChild(K.field(staff.id === 'reviewer' ? 'Bản cuối (sửa trực tiếp nếu cần)' : 'Kết quả (sửa trực tiếp – app học từ chỗ anh/chị sửa)', ta));
body.appendChild(h('details', null, h('summary', null, 'Lời nhắn đã gửi (đã lọc dữ liệu khách)'), h('pre', { class: 'bds-pre bds-scroll' }, t.input.prompt || '')));
const _o4 = h('div', { class: 'bds-row bds-wrap' });
if (t.status === 'waiting_approval' || S.inboxApproved(t)) {
const _o1h = t.input.adhoc ? (Number(t.input.step_index) + 1 < Number(t.input.steps || 1) ? ' → bước tiếp' : '') : staff.id === 'writer' ? ' → Kiểm duyệt' : staff.id === 'reviewer' ? ' → dựng nháp' : '';
_o4.appendChild(K.button('✅ Duyệt' + _o1h, async () => {
const original = String(t.output.final_text || t.output.text || '');
const out = S.approveTask(t, { editedText: ta.value, room: rooms[0], staffList });
await _o8(K, out, staffList);
if (t.input.adhoc) await _o1y(K, out.update, out.update.output.final_text);
const _o19 = await Learn.learnApproval(K, { task: t, staff: staffList.find(s => s.id === t.input.staff_id), original, final: out.update.output.final_text }).catch(() => ({}));
K.toast(_o19.kind ? Learn.LEARN_TOAST : out.pair ? 'Đã duyệt + ghi nhớ chỗ anh/chị sửa' : 'Đã duyệt', 'success');
_o2l.close(); runPending(ctx).then(_o20);
}, { kind: 'primary', testid: 'task-approve' }));
_o4.appendChild(K.button('Không duyệt', async () => {
const reason = await askRejectReason(K);
if (reason === null) return;
await K.put('jobs', S.taskRow(S.rejectTask(t, reason || undefined)));
const _o19 = await Learn.learnRejection(K, { task: t, staff: staffList.find(s => s.id === t.input.staff_id), original: t.output.final_text || t.output.text || '', reason }).catch(() => ({}));
if (_o19.kind) K.toast('Nhân viên đã nhớ điều anh/chị bác', 'success');
_o2l.close(); _o20();
}, { testid: 'task-reject' }));
}
if (t.status === 'error') _o4.appendChild(K.button('↻ Chạy lại', async () => {
await K.put('jobs', S.taskRow({ ...t, status: 'queued', output: {} })); _o2l.close(); runPending(ctx, { manual: true }).then(_o20);
}, { kind: 'primary', testid: 'task-retry' }));
if (t.status !== 'done' && ctx.ai && typeof ctx.ai.handoff === 'function' && _ol(ctx)) _o4.appendChild(K.button('Nhờ Claude (tự dán)', async () => {
const _o2v = await ctx.ai.handoff('staff', t.input.prompt || '', { target: 'claude' });
if (_o2v) { ta.value = _o2v; t = { ...t, status: 'waiting_approval', output: { ...t.output, text: _o2v, final_text: _o2v, provider: 'handoff_claude', error: '' } }; await K.put('jobs', S.taskRow(t)); K.toast('Đã dán kết quả Claude – xem lại rồi Duyệt', 'success'); }
}, { testid: 'task-handoff', title: 'Mở Claude với lời nhắn soạn sẵn – không tự động, không tốn gói' }));
body.appendChild(_o4);
}
const _o2w = async (id, patch) => {
const { staffList } = await loadAll(K);
const r = C.updateStaff(staffList, id, patch);
if (!r.ok) { K.toast(r.error, 'warn'); return false; }
await saveStaff(K, r.list); _o20();
return true;
};
function _o28(list, lib) {
_o2o.innerHTML = '';
const _or = list.filter(s => !C.isBuiltinStaff(s)).length;
_o2p.textContent = `${list.length}/${C.LIMITS.maxStaff} nhân viên · ${_or} anh/chị tạo thêm`;
for (const s of list) {
const off = S.isOff(s);
const field = T.FIELD_TEMPLATES.find(t => t.id === s.field);
const mySkills = F.skillsForStaff(lib, s);
const _o1s = (s.pending_rules || []).length;
_o2o.appendChild(h('div', { class: 'stf-card' + (off ? ' off' : ''), 'data-testid': 'staff-' + s.id },
h('div', { class: 'stf-card-top' },
h('h4', null, (s.icon || '🤖') + ' ' + s.name),
h('div', { class: 'stf-card-acts' },
K.button('💬 Chat', () => openChat(D, { kind: 'staff', id: s.id }), { kind: 'primary', testid: 'staff-chat-' + s.id, title: 'Nhắn việc cho ' + s.name + (off ? ' (đang tắt – vẫn chat được)' : '') }),
h('button', { type: 'button', class: 'stf-more', 'data-testid': 'more-' + s.id, 'aria-label': 'Thêm thao tác cho ' + s.name, title: 'Thêm: bật/tắt, AI, kỹ năng, sửa…', onclick: () => _o1m(s.id) }, '⋯'))),
h('p', { class: 'stf-cando', 'data-testid': 'cando-' + s.id }, S.canDo(s, { fieldLabel: field ? field.label : '', skills: mySkills })),
h('small', { class: 'stf-status' + (off ? ' is-off' : ''), 'data-testid': 'status-' + s.id }, S.statusText(s)),
_o1s ? h('button', { type: 'button', class: 'stf-chipbtn', 'data-testid': 'pending-' + s.id, onclick: () => _o1m(s.id) }, `❓ ${_o1s} quy tắc chờ anh/chị duyệt`) : null));
}
}
async function _o1m(id) {
const body = h('div', { class: 'bds-form stf-menu', 'data-testid': 'staff-menu-body' });
const _o10 = (await loadAll(K)).staffList.find(_o33 => _o33.id === id);
if (!_o10) return;
const _o2l = K.sheet({ title: (_o10.icon || '🤖') + ' ' + _o10.name, testid: 'staff-menu', body, onClose: () => _o20() });
const then = fn => { _o2l.close(); K.afterClose(fn); };
async function _ov() {
const [{ staffList }, lib] = await Promise.all([loadAll(K), loadLib(K)]);
const s = staffList.find(_o33 => _o33.id === id);
body.innerHTML = '';
if (!s) { body.appendChild(h('p', { class: 'bds-muted' }, 'Nhân viên đã bị xoá.')); return; }
const _oi = C.isBuiltinStaff(s);
const off = S.isOff(s);
const mySkills = F.skillsForStaff(lib, s);
const _ok = async patch => { if (await _o2w(s.id, patch)) _ov(); };
body.appendChild(h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, 'Tự nhận việc'),
segBtns({ on: 'Bật', off: 'Tắt' }, off ? 'off' : 'on', v => _ok({ enabled: v === 'on' }), 'enable-' + s.id),
h('small', { class: 'bds-field-h' }, off ? S.STATUS_OFF + '.' : 'Bật: nhận việc theo lịch, phòng tự chia việc. Tắt: không tự chạy, anh/chị vẫn 💬 Chat được.')));
const _oj = S.staffAiChoices(_oe(ctx), s.provider);
const _o1u = K.select(_oj.options, _oj.value, { 'data-testid': 'prov-' + s.id, 'aria-label': 'AI dùng', onchange: e => _ok({ provider: S.safeProvider(e.target.value) }) });
body.appendChild(K.field('AI dùng', _o1u));
body.appendChild(h('small', { class: 'bds-muted', 'data-testid': 'prov-note-' + s.id }, (_oj.none ? 'Chưa nối AI online nào – nối Gemini ở Cài đặt › Kết nối. ' : '') + _oj.note));
body.appendChild(h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, 'Cách làm'), seg(S.MODES, s.mode, v => _ok({ mode: v }), 'mode-' + s.id),
h('small', { class: 'bds-field-h' }, s.mode === 'semi' ? 'Bán tự động: mỗi kết quả chờ anh/chị duyệt.' : 'Tự động: làm hết các bước, kết quả cuối vẫn vào Việc cần duyệt.')));
body.appendChild(h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, 'Kỹ năng'),
h('div', { class: 'stf-chips', 'data-testid': 'skills-of-' + s.id, 'aria-label': 'Kỹ năng' }, mySkills.length
? mySkills.map(k => h('span', { class: 'stf-chip', title: k.description || '' }, '📘 ' + k.name + ' v' + (k.version || 1)))
: h('small', { class: 'bds-muted' }, 'Chưa gắn kỹ năng'))));
body.appendChild(h('div', { class: 'stf-menu-btns' },
K.button('⬆ Nâng cấp kỹ năng', () => then(async () => openUpgradeSkills(D, s, mySkills, staffList)), { testid: 'staff-skill-upgrade-' + s.id, title: 'Cập nhật kỹ năng đang gắn của ' + s.name + ' bằng tệp mới' }),
K.button('⬆ Tải kỹ năng', () => then(() => openAddSkill(D, { staff: s, way: 'file' })), { testid: 'staff-skill-upload-' + s.id, title: 'Chọn tệp SKILL.md / dán / nhờ AI soạn – tự gắn cho nhân viên này' }),
(s.edits || []).length ? K.button('💾 Lưu thành kỹ năng', () => then(() => openSkillFromEdit(D, s)), { testid: 'skill-from-edit-' + s.id, title: 'Học từ lần anh/chị sửa gần nhất' }) : null,
K.button('🧠 Nhớ giúp tôi', () => then(() => openAddNote(D, s)), { testid: 'staff-mem-' + s.id, title: 'Thêm ghi nhớ cho nhân viên này' }),
K.button('✏️ Sửa', () => then(() => openStaffForm(D, { draft: s })), { testid: 'staff-edit-' + s.id }),
_oi ? null : K.button('🗑 Xoá', () => then(() => deleteStaff(D, s)), { testid: 'staff-del-' + s.id }),
s.id === 'researcher' ? K.button('🔎 Gom tin & gợi ý chủ đề', () => then(() => _o2b(s)), { testid: 'run-researcher', ai: true }) : null));
body.appendChild(_oi
? h('small', { class: 'bds-muted', 'data-testid': 'data-' + s.id }, 'Được xem: ' + (s.id === 'writer' ? 'ý tưởng đã duyệt' : s.id === 'reviewer' ? 'kịch bản' : 'ý tưởng, tin, báo cáo thị trường') + ' – không đọc thông tin khách.')
: h('small', { class: s.data_access ? 'stf-warn' : 'bds-muted', 'data-testid': 'data-' + s.id }, s.data_access ? '🔓 Được đọc dữ liệu khách rút gọn – ' + dataWarning(s) : '🔒 Không đọc dữ liệu khách.'));
const _o18 = K.button(`🧠 Rút quy tắc từ ${(s.edits || []).length} lần sửa`, async () => {
if (!(s.edits || []).length) { K.toast('Chưa có lần sửa nào – sửa kết quả rồi Duyệt để app học', 'info'); return; }
if (!ctx.ai || !ctx.ai.run) { K.toast('Chưa bật AI', 'warn'); return; }
_o18.disabled = true;
try {
const r = await ctx.ai.run('staff', { prompt: S.rulePrompt(s), json: true, provider: S.safeProvider(s.provider, _oe(ctx)) });
const _o2f = S.parseRules((r && (r.text ?? r)) || '');
if (!_o2f.length) { K.toast('AI chưa rút được quy tắc – thử lại sau khi sửa thêm', 'info'); return; }
const _oo = (await loadAll(K)).staffList;
await saveStaff(K, _oo.map(_o33 => (_o33.id === s.id ? S.addPendingRules(_o33, _o2f) : _o33)));
K.toast(`Có ${_o2f.length} quy tắc chờ anh/chị duyệt`, 'success'); _o20(); _ov();
} catch (e) { K.toast((e && e.message) || 'AI chưa trả lời', 'warn'); } finally { _o18.disabled = false; }
}, { testid: 'learn-' + s.id });
const _o2i = async fn => { const _oo = (await loadAll(K)).staffList; await saveStaff(K, _oo.map(_o33 => (_o33.id === s.id ? fn(_o33) : _o33))); _o20(); _ov(); };
const rules = h('div', { 'data-testid': 'rules-' + s.id },
(s.rules || []).map(r => h('div', { class: 'stf-rule' }, h('span', null, '✓ ' + r), K.button('Bỏ', () => _o2i(_o33 => S.dropRule(_o33, r))))),
(s.pending_rules || []).map(r => h('div', { class: 'stf-rule', 'data-testid': 'pending-rule' }, h('span', null, '❓ ' + r), h('span', { class: 'bds-row' },
K.button('Duyệt', async () => { await _o2i(_o33 => S.approveRule(_o33, r)); K.toast('Đã thêm vào lời dặn', 'success'); }, { kind: 'primary', testid: 'rule-ok' }),
K.button('Bỏ', () => _o2i(_o33 => S.dropRule(_o33, r)))))));
body.appendChild(h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, 'Học từ chỗ anh/chị sửa'), rules, h('div', null, _o18)));
const prompt = h('textarea', { rows: 8, 'aria-label': 'Lời dặn cho ' + s.name, 'data-testid': 'prompt-' + s.id });
prompt.value = s.prompt || '';
body.appendChild(h('details', null, h('summary', null, 'Lời dặn (cách nhân viên làm việc)'), prompt,
h('div', { class: 'bds-row bds-end bds-wrap' }, K.button('Khôi phục mặc định', () => _ok({ prompt: (S.DEFAULT_STAFF.find(_ou => _ou.id === s.id) || s).prompt })),
K.button('Lưu lời dặn', async () => { if (await _o2w(s.id, { prompt: prompt.value.trim() || s.prompt })) { K.toast('Đã lưu lời dặn', 'success'); _ov(); } }, { kind: 'primary', testid: 'save-prompt-' + s.id }))));
}
await _ov();
}
async function _o2b(s) {
const ideas = await K.list('ideas');
let market = '';
const jobs = await K.list('jobs');
const _o1g = jobs.filter(j => j.type === 'market_report' && j.status === 'done').sort((a, _of) => (Number(_of.updated_at) || 0) - (Number(a.updated_at) || 0))[0];
if (_o1g) { const _o1k = parseData(_o1g.output); market = _o1k.summary || _o1k.text || ''; }
const _o1f = (ctx.pack && (ctx.pack.modules || [])) || [];
if (!market && _o1f.some(_o1a => (_o1a && _o1a.id) === 'market' || _o1a === 'market')) {
try { const _o1a = await import('../market/index.js'); if (typeof _o1a.marketSummary === 'function') market = String(await _o1a.marketSummary(ctx) || ''); } catch { }
}
const _ou = new Date();
const t = S.makeTask({ room: null, staff: s, payload: { ideas, market, today: _ou.toLocaleDateString('vi-VN'), title: 'Gom tin & gợi ý chủ đề' } });
t.title = s.name + ': gợi ý chủ đề ' + _ou.toLocaleDateString('vi-VN');
await K.put('jobs', S.taskRow(t));
_o20();
const r = await runPending(ctx, { manual: true });
K.toast(r.skipped ? 'Đang chạy một lượt khác – việc đã xếp hàng' : 'Nghiên cứu xong – chủ đề mới ở Việc cần duyệt (Bảng tin)', 'success');
_o20();
}
const TABS = { rooms: 'Phòng ban', skills: 'Kỹ năng & Trí nhớ' };
const _o2s = v => (v === 'memory' ? 'skills' : TABS[v] ? v : '');
const _o1w = ctx.route && ctx.route.query;
const _o1x = (_o1w && _o1w.get && _o2s(_o1w.get('tab'))) || '';
let _o2r = _o1x || 'rooms';
try { const v = _o2s(localStorage.getItem('bds:staff:tab')); if (!_o1x && v) _o2r = v; } catch { }
const _o0 = 'bds:staff:adv';
let _o7 = false;
try { _o7 = localStorage.getItem(_o0) === 'open'; } catch { }
const _od = h('details', { class: 'stf-more-box', 'data-testid': 'assign-card' },
h('summary', { 'data-testid': 'assign-open' }, '📝 Giao việc một lần (không qua chat) – chọn phòng hoặc một nhân viên'), _ob);
const staffPane = h('div', { class: 'stf-pane', 'data-testid': 'pane-staff' },
K.card({ title: 'Nhân viên AI', testid: 'staff-card', body: h('div', { class: 'bds-form' },
h('div', { class: 'bds-row bds-wrap' }, K.button('+ Tạo nhân viên AI', () => openCreateStaff(D), { kind: 'primary', testid: 'staff-create' }), _o2p),
_o2o) }));
const _o1q = {
rooms: h('div', { class: 'stf-pane', 'data-testid': 'pane-rooms' },
K.card({ title: '💬 Chat với phòng', testid: 'room-chat-card', body: h('div', { class: 'bds-form' }, roomChatBox, _od) }),
K.card({ title: '🏢 Phòng ban', testid: 'rooms-card', actions: K.button('+ Tạo phòng', () => openRoomForm(D), { kind: 'primary', testid: 'room-create' }), body: _o2d }),
K.card({ title: 'Bảng tiến độ', testid: 'board-card', body: _oh }),
K.card({ title: '🎬 Phòng Sản xuất video', testid: 'room-card', actions: _o2g, body: h('div', { class: 'bds-form' }, roomBox,
h('section', { class: 'stf-sub', 'data-testid': 'report-card' }, h('h4', null, '☀️ Báo cáo sáng (7h)'), _o2a)) })),
skills: h('div', { class: 'stf-pane', 'data-testid': 'pane-skills' },
K.card({ title: '📘 Kỹ năng', testid: 'skills-card', body: _o2n }),
h('div', { 'data-testid': 'pane-memory' }, _o1b)),
};
const tabBar = h('div', { class: 'stf-seg stf-tabs', role: 'tablist', 'aria-label': 'Mục nâng cao' });
const _o2m = v => {
_o2r = v;
for (const [k, p] of Object.entries(_o1q)) p.hidden = k !== v;
for (const _of of tabBar.children) _of.setAttribute('aria-selected', String(_of.dataset.v === v)), _of.setAttribute('aria-pressed', String(_of.dataset.v === v));
try { localStorage.setItem('bds:staff:tab', v); } catch { }
};
for (const [k, l] of Object.entries(TABS)) tabBar.appendChild(h('button', { type: 'button', role: 'tab', 'data-v': k, 'data-testid': 'staff-tab-' + k, onclick: () => _o2m(k) }, l));
const advCount = h('span', { class: 'stf-adv-count', 'data-testid': 'staff-adv-count', hidden: true });
function _o21(rooms, skills) {
const _o1r = [rooms ? rooms + ' phòng' : '', skills ? skills + ' kỹ năng' : ''].filter(Boolean);
advCount.hidden = !_o1r.length;
advCount.textContent = _o1r.length ? '● ' + _o1r.join(' · ') : '';
advCount.title = _o1r.length ? 'Anh/chị đã tạo ' + _o1r.join(', ') + ' – mở Nâng cao để xem' : '';
}
const _o5 = h('details', { class: 'stf-adv', 'data-testid': 'staff-advanced' },
h('summary', { 'data-testid': 'staff-adv-toggle' }, h('span', null, '⚙️ Nâng cao'), advCount,
h('small', null, 'Phòng (nhiều bước, chat phòng, giao việc một lần, báo cáo sáng 7h) · Kỹ năng & Trí nhớ')),
tabBar, _o1q.rooms, _o1q.skills);
_o5.open = _o7 || !!_o1x;
let _o6 = !_o7 && !!_o1x;
_o5.addEventListener('toggle', () => {
if (_o6 && _o5.open) { _o6 = false; return; }
_o6 = false;
try { localStorage.setItem(_o0, _o5.open ? 'open' : ''); } catch { }
});
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'staff-screen' },
h('div', { class: 'bds-head' }, h('h2', null, 'Nhân viên AI ', h('span', { 'data-testid': 'staff-trial' }, K.badge('Thử nghiệm', 'warn'))),
h('div', { class: 'bds-row bds-wrap' },
introShow,
K.button('📨 Dán tin khách', () => K.nav('#/home/inbox?desk=1'), { kind: 'ghost', testid: 'staff-open-desk', title: 'Nhân viên Trực inbox soạn trả lời tin/bình luận khách' }),
K.button('💬 Giao việc', () => openPicker(D), { kind: 'primary', testid: 'staff-chat-open', title: 'Nhắn việc cho một nhân viên hoặc cả phòng' }))),
h('p', { class: 'stf-trial-desc', 'data-testid': 'staff-trial-desc' }, h('b', null, 'Thử nghiệm'), ' · Nhân viên AI chỉ nên dùng cho việc lặp đi lặp lại hằng ngày (soạn tin chăm sóc, báo cáo…).'),
introBox,
staffPane, _o5));
_o2m(_o2r);
const _o1l = () => { if (el.isConnected) _o20(); else _o3.listeners.delete(_o1l); };
_o3.listeners.add(_o1l);
await _o20();
K.on(el, ['jobs', 'settings', 'ideas', 'objects'], _o20);
catchUp(ctx).then(() => { if (el.isConnected) _o20(); });
const _o1v = ctx.route && ctx.route.query; const _o2u = _o1v && _o1v.get && _o1v.get('task');
if (_o2u) _o1n(_o2u);
const _oa = _o1v && _o1v.get && _o1v.get('ask');
if (_oa) {
try { history.replaceState(null, '', location.pathname + location.search + '#/home/staff'); } catch { }
const { staffList } = await loadAll(K);
const _o1t = CH.selectStaff(_oa, staffList, await loadLib(K));
if (_o1t.staff) openChat(D, { kind: 'staff', id: _o1t.staff.id, prefill: String(_oa).slice(0, CH.CHAT_LIMITS.textMax) });
else openPicker(D);
}
}
export default {
manifest: {
id: 'staff', title: 'Nhân viên AI', icon: '🧑‍💼', screen: 'home', order: 15, version: '1.1.0', status: 'ready', requires: 'video',
desc: 'Thử nghiệm · việc lặp đi lặp lại hằng ngày: soạn tin chăm sóc, báo cáo…',
help: 'Thử nghiệm – chỉ nên dùng cho việc lặp đi lặp lại hằng ngày (soạn tin chăm sóc, báo cáo…). Anh/chị chat giao việc → nhân viên AI trả bản nháp → anh/chị duyệt. Mỗi nhân viên một mảng việc (chăm sóc khách, content, bán hàng, thị trường, quảng cáo); Phòng (nhóm nhân viên cùng chia việc), Kỹ năng & Trí nhớ ở mục Nâng cao cuối màn. Chạy bằng AI online (Gemini hoặc Claude API – trả phí riêng theo gói của hãng); kết quả vào Việc cần duyệt, không tự gửi khách, không tự đăng. App học từ chỗ anh/chị sửa.',
},
mount,
async selftest(ctx) {
const details = [];
const s = ctx && ctx.store;
for (const _oz of ['list', 'get', 'put']) if (!s || typeof s[_oz] !== 'function') details.push('Thiếu store.' + _oz);
try { if (S.normalizeStaff(null).length !== 3) details.push('Thiếu nhân viên mẫu'); } catch (e) { details.push(e.message); }
return { ok: !details.length, details: details.join('; ') || 'Đạt' };
},
};

import { runKey, spentOn, isStaffTask, taskView, redact, safeProvider } from '../_lib/staff.js';
export function mergeLibrary(builtin, mine) {
const _o9 = new Map((mine || []).filter(s => s && s.id).map(s => [s.id, s]));
const _od = (builtin || []).filter(s => s && s.id).map(b => ({ ...b, ...(_o9.get(b.id) || {}), builtin: true }));
for (const s of mine || []) if (s && s.id && !_od.some(o => o.id === s.id)) _od.push({ ...s, builtin: false });
return _od;
}
export const mineCount = lib => (lib || []).filter(s => !s.builtin).length;
export function canAddSkill(lib, max) {
return mineCount(lib) >= max ? { ok: false, error: `Tối đa ${max} kỹ năng – tắt/xoá bớt kỹ năng cũ rồi thêm.` } : { ok: true };
}
export const skillsForStaff = (lib, staff) => {
const ids = new Set((staff && staff.skills) || []);
return (lib || []).filter(s => s && s.enabled !== false && ids.has(s.id));
};
export const staffUsingSkill = (staffList, id) => (staffList || []).filter(s => (s.skills || []).includes(id));
export function setStaffSkill(staff, skillId, on, max) {
const cur = [...new Set((staff && staff.skills) || [])];
if (!on) return { ok: true, staff: { ...staff, skills: cur.filter(x => x !== skillId) } };
if (cur.includes(skillId)) return { ok: true, staff: { ...staff, skills: cur } };
if (cur.length >= max) return { ok: false, error: `Mỗi nhân viên tối đa ${max} kỹ năng.`, staff };
return { ok: true, staff: { ...staff, skills: [...cur, skillId] } };
}
export const SKILL_TEXT_MAX = 8000;
const _o0 = 64 * 1024;
export function checkSkillFile(f) {
if (!f || !f.name) return { ok: false, error: 'Chưa chọn tệp.' };
if (!/\.(md|markdown|txt)$/i.test(f.name)) return { ok: false, error: 'Chỉ nhận tệp .md hoặc .txt (văn bản).' };
if (Number(f.size) > _o0) return { ok: false, error: 'Tệp quá lớn – kỹ năng tối đa 8.000 ký tự.' };
return { ok: true };
}
export function checkSkillText(t) {
const s = String(t ?? '');
if (!s.trim()) return { ok: false, error: 'Chưa có nội dung kỹ năng.' };
if (s.length > SKILL_TEXT_MAX) return { ok: false, error: `Dài quá 8.000 ký tự (hiện ${s.length.toLocaleString('vi-VN')}) – rút gọn rồi thử lại.` };
return { ok: true };
}
export function skillFileName(s) {
const base = String((s && s.name) || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase()
.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
return (base || 'ky-nang') + '.md';
}
export const customersOf = rows => (rows || []).filter(o => o && !Number(o.deleted) && (!o.kind || o.kind === 'customer'));
export const isVideoRoom = _og => !!_og && _og.id === 'video';
const _o1 = /^([01]\d|2[0-3]):[0-5]\d$/;
const _oh = () => 'room_' + Math.random().toString(36).slice(2, 9);
export function normalizeCustomRoom(raw = {}) {
const steps = (Array.isArray(raw.steps) ? raw.steps : []).map(s => (typeof s === 'string' ? { staff_id: s, instruction: '' }
: { staff_id: String((s && s.staff_id) || ''), instruction: String((s && (s.instruction ?? s.guide)) || '').slice(0, 2000) })).filter(s => s.staff_id);
const _oi = raw.schedule && typeof raw.schedule === 'object' ? raw.schedule : {};
const b = Number(String(raw.budget_usd_day ?? 0.2).replace(',', '.'));
return {
id: typeof raw.id === 'string' && /^room_[a-z0-9]+$/.test(raw.id) ? raw.id : _oh(),
name: String(raw.name || '').trim().slice(0, 60), icon: raw.icon || '🏢',
staff_ids: [...new Set([...(Array.isArray(raw.staff_ids) ? raw.staff_ids : []), ...steps.map(s => s.staff_id)].filter(x => typeof x === 'string' && x))],
steps, schedule: { mode: _oi.mode === 'daily' ? 'daily' : 'manual', at: _o1.test(_oi.at || '') ? _oi.at : '08:00' },
daily_task: String(raw.daily_task || '').slice(0, 4000), mode: raw.mode === 'auto' ? 'auto' : 'semi',
budget_usd_day: Number.isFinite(b) && b > 0 ? Math.min(100, b) : 0, last_run: String(raw.last_run || ''), custom: 1,
};
}
const keyOf = (_og, now) => runKey({ start: _og.schedule.at }, now);
export const dueRooms = (rooms, now = Date.now()) => (rooms || []).filter(_og => _og && !isVideoRoom(_og) && _og.schedule && _og.schedule.mode === 'daily'
&& String(_og.daily_task || '').trim() && (_og.steps || []).length && _og.last_run !== keyOf(_og, now) && new Date(now) >= _ok(_og, now));
export const roomRunKey = (_og, now = Date.now()) => keyOf(_og, now);
function _ok(_og, now) { const _o4 = new Date(now); const [hh, mm] = String(_og.schedule.at).split(':').map(Number); _o4.setHours(hh || 0, mm || 0, 0, 0); return _o4; }
const _o5 = ms => { const _o4 = new Date(ms); return _o4.getFullYear() + '-' + String(_o4.getMonth() + 1).padStart(2, '0') + '-' + String(_o4.getDate()).padStart(2, '0'); };
export function roomBudget(room, tasks, now = Date.now()) {
const spent = spentOn((tasks || []).filter(isStaffTask), room.id, _o5(now));
const cap = Number(room.budget_usd_day) || 0;
const over = cap > 0 && spent >= cap;
return { spent, cap, over, message: over ? `Hết ngân sách ngày của phòng ${room.name || ''} (${spent.toFixed(2)}/${cap.toFixed(2)} USD) – đã dừng. Mai chạy tiếp hoặc nâng ngân sách.` : '' };
}
export const directRoom = staff => ({ id: 'direct_' + staff.id, name: staff.name, staff_ids: [staff.id], steps: [{ staff_id: staff.id, instruction: '' }], mode: 'semi', budget_usd_day: 0, direct: 1 });
export function stepText(taskText, step, prevText) {
const _of = [String(taskText || '').trim()];
if (step && String(step.instruction || '').trim()) _of.push('HƯỚNG DẪN BƯỚC NÀY: ' + String(step.instruction).trim());
if (String(prevText || '').trim()) _of.push('KẾT QUẢ BƯỚC TRƯỚC:\n' + String(prevText).trim().slice(0, 6000));
return _of.join('\n\n');
}
export const stepMode = (room, _o6) => (room && room.mode === 'auto' && _o6 < (room.steps || []).length - 1 ? 'auto' : 'semi');
export function nextStepIndex(task, room) {
const _o7 = (task && task.input) || {};
if (!_o7.adhoc || _o7.chat || !room) return -1;
const n = (Number(_o7.step_index) || 0) + 1;
return n < (room.steps || []).length ? n : -1;
}
export function checkTaskText(t, max) {
const s = String(t ?? '').trim();
if (!s) return { ok: false, error: 'Gõ việc cần làm trước.' };
if (s.length > max) return { ok: false, error: `Việc giao tối đa ${max} ký tự.` };
return { ok: true, text: s };
}
export const memoryOn = staff => !!staff && staff.memory_on !== false;
const _o3 = '---\nVIỆC CẦN LÀM:';
export function injectMemoryBlock(prompt, block) {
const _oe = String(prompt || ''), b = redact(String(block || '').trim());
if (!b || _oe.includes(b)) return _oe;
const _o6 = _oe.lastIndexOf(_o3);
if (_o6 >= 0) return _oe.slice(0, _o6) + '---\n' + b + '\n' + _oe.slice(_o6);
const _o8 = _oe.indexOf('\n---\n');
return _o8 >= 0 ? _oe.slice(0, _o8) + '\n---\n' + b + _oe.slice(_o8) : (_oe ? _oe + '\n\n' : '') + '---\n' + b;
}
export function memoryContext({ staff, memories = [], taskText = '', now = Date.now(), deps = {} } = {}) {
const _oc = { block: '', ids: [] };
if (!memoryOn(staff) || !(memories || []).length) return _oc;
try {
if (typeof deps.buildMemoryContext === 'function') { const _og = deps.buildMemoryContext(staff, memories, taskText, now) || {}; return { block: String(_og.block || ''), ids: _og.ids || [] }; }
const _o2 = deps.M;
if (!_o2 || typeof _o2.selectMemories !== 'function') return _oc;
const _oj = _o2.selectMemories(memories, staff, taskText, { now });
const block = _o2.composeMemoryBlock(_oj) || '';
return block ? { block, ids: (_oj && _oj.ids) || [] } : _oc;
} catch { return _oc; }
}
export function withMemoryPrompt(t, staff, memories, deps, now = Date.now()) {
if (!t || !t.input || t.input.adhoc || t.input.memory_added || !memoryOn(staff)) return t;
const _oa = memoryContext({ staff, memories, taskText: t.title || '', now, deps });
if (!_oa.block) return t;
return { ...t, input: { ...t.input, prompt: injectMemoryBlock(t.input.prompt, _oa.block), memory_added: 1, used_memory_ids: _oa.ids } };
}
export function makeStepTask({ room, staffList, stepIndex = 0, taskText, prevText = '', lib = [], customers = [], now = Date.now(), deps, parentId = '', memories = [] }) {
const step = ((room && room.steps) || [])[stepIndex];
const staff = step && (staffList || []).find(s => s.id === step.staff_id);
if (!staff) return null;
const text = stepText(taskText, step, prevText);
const _ob = memoryOn(staff) ? (memories || []).filter(_o9 => _o9 && _o9.staff_id === staff.id) : [];
const raw = deps.makeAdhocTask({ room, staff, taskText: text, now, skills: skillsForStaff(lib, staff), customers: staff.data_access === true ? customers : [], memories: _ob }) || {};
const t = taskView({ ...raw, input: raw.input || {}, output: raw.output || {} });
if (_ob.length && !Array.isArray(t.input.used_memory_ids)) {
const _oa = memoryContext({ staff, memories: _ob, taskText: String(taskText || ''), now, deps });
if (_oa.block) { t.input = { ...t.input, prompt: injectMemoryBlock(t.input.prompt, _oa.block), used_memory_ids: _oa.ids }; }
}
const n = (room.steps || []).length;
t.type = 'staff_task';
t.title = `${staff.name}: ${String(taskText || '').replace(/\s+/g, ' ').slice(0, 90)}${n > 1 ? ` (bước ${stepIndex + 1}/${n})` : ''}`.slice(0, 140);
t.status = 'queued';
t.input = { ...t.input, room_id: room.id, room_name: room.name, staff_id: staff.id, step: 'adhoc', adhoc: 1, step_index: stepIndex, steps: n,
task_text: String(taskText || ''), json: false, provider: safeProvider(staff.provider), where: 'cloud',
mode: stepMode(room, stepIndex), parent_id: parentId || '', created_at: now, budget_usd_day: Number(room.budget_usd_day) || 0 };
t.output = {};
return t;
}
export function adhocAfter(task, result, now = Date.now()) {
const t = { ...task, input: { ...task.input }, output: { ...task.output } };
const base = { provider: result && result.provider, cost_usd: Number(result && result.cost_usd) || 0, tokens_in: result && result.tokens_in, tokens_out: result && result.tokens_out, finished_at: now };
const text = String((result && result.text) || '').trim();
if (!result || result.ok === false || !text) { t.status = 'error'; t.output = { ...t.output, ...base, error: (result && result.error) || 'AI không trả lời (trống)' }; return t; }
t.output = { ...t.output, ...base, text, error: '' };
if (t.input.mode === 'auto') { t.status = 'done'; t.output.final_text = text; } else t.status = 'waiting_approval';
return t;
}

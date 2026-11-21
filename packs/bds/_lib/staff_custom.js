import { DEFAULT_STAFF, DEFAULT_ROOM, STAFF_PROVIDERS, MODES, WHERE, PRIVATE_TABLES, redact, systemOf, taskRow, safeProvider } from './staff.js';
import { selectSkills, composeSkillBlock, SKILL_LIMITS } from './staff_skills.js';
import { buildMemoryContext } from './staff_memory.js';
import { gate } from './consent.js';
import { withRules } from '../../../shared/ai_rules.js';
export const LIMITS = { maxStaff: 20, maxRooms: 10, maxStepsPerRoom: 6, taskTextMax: 4000, customersMax: 20 };
export const INSTRUCTION_MAX = SKILL_LIMITS.bodyMax;
export const STEP_INSTRUCTION_MAX = 2000;
export const TASK_FOOTER = 'Nhắc: không cam kết lợi nhuận, không bịa số liệu, ghi nguồn cho mọi số; không có nguồn thì ghi "Em chưa tìm được, anh/chị tự nhập giúp em".';
const _o2 = new Set(DEFAULT_STAFF.map(_ol => _ol.id));
const _o4 = /^[A-Za-z0-9_-]{1,64}$/;
const ok = { ok: true };
const _of = error => ({ ok: false, error });
const _on = v => (typeof v === 'string' ? v : '');
const _o7 = _ol => String(_ol ?? '').normalize('NFC').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
export const isBuiltinStaff = _ol => !!_ol && _o2.has(_ol.id);
export const canDeleteStaff = _ol => !!_ol && !isBuiltinStaff(_ol);
export const canDeleteRoom = _ok => !!_ok && _ok.id !== DEFAULT_ROOM.id;
export function validateStaff(_ol) {
if (!_ol || typeof _ol !== 'object') return _of('Thiếu thông tin nhân viên.');
if (typeof _ol.id !== 'string' || !_o4.test(_ol.id)) return _of('Mã nhân viên không hợp lệ (chỉ chữ không dấu, số, _ hoặc -).');
const name = _on(_ol.name).trim();
if (!name) return _of('Nhân viên cần có tên.');
if (name.length > 60) return _of('Tên nhân viên tối đa 60 ký tự.');
if (!STAFF_PROVIDERS.includes(_ol.provider)) return _of('AI chỉ chọn AI online: Gemini hoặc Claude API.');
if (_ol.mode !== undefined && !MODES[_ol.mode]) return _of('Chế độ phải là Tự động hoặc Bán tự động.');
if (_ol.where !== undefined && !WHERE[_ol.where]) return _of('Nơi chạy không hợp lệ.');
if (String(_ol.prompt || _ol.instruction || '').length > INSTRUCTION_MAX || String(_ol.instruction || '').length > INSTRUCTION_MAX) return _of(`Lời dặn tối đa ${INSTRUCTION_MAX.toLocaleString('vi-VN')} ký tự.`);
if (!String(_ol.prompt || _ol.instruction || '').trim()) return _of('Nhân viên cần có lời dặn.');
if (_ol.skills !== undefined && (!Array.isArray(_ol.skills) || _ol.skills.some(x => typeof x !== 'string'))) return _of('Danh sách kỹ năng không hợp lệ.');
if (Array.isArray(_ol.skills) && _ol.skills.length > SKILL_LIMITS.maxPerStaff) return _of(`Mỗi nhân viên tối đa ${SKILL_LIMITS.maxPerStaff} kỹ năng.`);
if (_ol.data_access !== undefined && typeof _ol.data_access !== 'boolean') return _of('Quyền dữ liệu khách phải là bật/tắt.');
if (_ol.scope !== undefined && (!Array.isArray(_ol.scope) || _ol.scope.some(x => PRIVATE_TABLES.includes(x)))) return _of('Phạm vi dữ liệu không được gồm bảng riêng tư.');
return ok;
}
export function addStaff(list, _ol) {
const arr = Array.isArray(list) ? list : [];
if (arr.length >= LIMITS.maxStaff) return _of(`Tối đa ${LIMITS.maxStaff} nhân viên.`);
if (_ol && arr.some(x => x && x.id === _ol.id)) return _of('Mã nhân viên đã có.');
const v = validateStaff(_ol);
return v.ok ? { ok: true, list: [...arr, _ol] } : v;
}
const _o1 = ['prompt', 'enabled', 'mode', 'provider', 'where', 'skills', 'rules', 'pending_rules', 'edits'];
export function updateStaff(list, id, patch = {}) {
const arr = Array.isArray(list) ? list : [];
const _ob = arr.findIndex(x => x && x.id === id);
if (_ob < 0) return _of('Không tìm thấy nhân viên.');
const cur = arr[_ob], p = patch && typeof patch === 'object' ? patch : {};
let next;
if (isBuiltinStaff(cur)) {
next = { ...cur };
for (const _oc of _o1) if (p[_oc] !== undefined) next[_oc] = p[_oc];
if (p.instruction !== undefined && p.prompt === undefined) next.prompt = p.instruction;
} else {
next = { ...cur, ...p, id: cur.id };
if (p.instruction !== undefined && p.prompt === undefined) next.prompt = p.instruction;
if (p.prompt !== undefined && p.instruction === undefined && cur.instruction !== undefined) next.instruction = p.prompt;
}
const v = validateStaff(next);
if (!v.ok) return v;
const _og = arr.slice(); _og[_ob] = next;
return { ok: true, list: _og, staff: next };
}
export function deleteStaff(list, id) {
const arr = Array.isArray(list) ? list : [];
const _ol = arr.find(x => x && x.id === id);
if (!_ol) return _of('Không tìm thấy nhân viên.');
if (!canDeleteStaff(_ol)) return _of('Nhân viên có sẵn không xoá được – anh/chị có thể tắt hoặc sửa lời dặn.');
return { ok: true, list: arr.filter(x => x !== _ol) };
}
const _o3 = /^([01]\d|2[0-3]):[0-5]\d$/;
export function validateRoom(_ok) {
if (!_ok || typeof _ok !== 'object') return _of('Thiếu thông tin phòng.');
if (typeof _ok.id !== 'string' || !_o4.test(_ok.id)) return _of('Mã phòng không hợp lệ.');
const name = _on(_ok.name).trim();
if (!name) return _of('Phòng cần có tên.');
if (name.length > 60) return _of('Tên phòng tối đa 60 ký tự.');
if (_ok.mode !== undefined && !MODES[_ok.mode]) return _of('Chế độ phòng phải là Tự động hoặc Bán tự động.');
const _o5 = _ok.budget_usd_day === undefined ? 0 : Number(_ok.budget_usd_day);
if (!Number.isFinite(_o5) || _o5 < 0 || _o5 > 100) return _of('Ngân sách/ngày phải từ 0 đến 100 USD.');
if (!Array.isArray(_ok.steps)) return _of('Phòng cần danh sách bước.');
if (_ok.steps.length > LIMITS.maxStepsPerRoom) return _of(`Mỗi phòng tối đa ${LIMITS.maxStepsPerRoom} bước.`);
if (_ok.id === DEFAULT_ROOM.id) {
return _ok.steps.every(x => typeof x === 'string' && x) ? ok : _of('Bước của phòng mẫu không hợp lệ.');
}
if (!Array.isArray(_ok.staff_ids) || _ok.staff_ids.some(x => typeof x !== 'string' || !x)) return _of('Danh sách nhân viên trong phòng không hợp lệ.');
if (_ok.staff_ids.length > LIMITS.maxStaff) return _of(`Phòng tối đa ${LIMITS.maxStaff} nhân viên.`);
for (const st of _ok.steps) {
if (!st || typeof st !== 'object' || !_ok.staff_ids.includes(st.staff_id)) return _of('Mỗi bước phải giao cho một nhân viên trong phòng.');
if (st.instruction !== undefined && (typeof st.instruction !== 'string' || st.instruction.length > STEP_INSTRUCTION_MAX)) return _of(`Lời dặn mỗi bước tối đa ${STEP_INSTRUCTION_MAX} ký tự.`);
}
const _om = _ok.schedule === undefined ? { mode: 'manual' } : _ok.schedule;
if (!_om || typeof _om !== 'object' || !['manual', 'daily'].includes(_om.mode)) return _of('Lịch chạy phải là Bấm tay hoặc Hằng ngày.');
if (_om.mode === 'daily' && !_o3.test(_on(_om.at))) return _of('Giờ chạy hằng ngày phải dạng HH:MM (vd 08:30).');
return ok;
}
export function validateRooms(list) {
if (!Array.isArray(list)) return _of('Danh sách phòng không hợp lệ.');
if (list.length > LIMITS.maxRooms) return _of(`Tối đa ${LIMITS.maxRooms} phòng.`);
for (const _ok of list) { const v = validateRoom(_ok); if (!v.ok) return _of((_ok && _ok.name ? `Phòng "${_ok.name}": ` : '') + v.error); }
return ok;
}
const _o0 = /(số\s*)?\d+[\w/]*\s*,?\s*(ngõ|ngách|hẻm|kiệt|ngo|ngach|hem)\s*[\d\w/]*/giu;
const _oa = (_ol, max) => redact(_o7(_ol)).replace(_o0, '[địa chỉ ẩn]').replace(/\s+/g, ' ').trim().slice(0, max);
const _o8 = c => gate(c, 'ai').ok;
export function customerContext(staff, customers, { now = Date.now() } = {}) {
const empty = { items: [], used: 0, skipped: 0, warning: '' };
if (!staff || staff.data_access !== true) return empty;
const _od = (Array.isArray(customers) ? customers : []).filter(c => c && !Number(c.deleted) && (!c.kind || c.kind === 'customer'));
const at = c => Number(c.updated_at) || Number(c.created_at) || 0;
const items = _od.filter(_o8).sort((a, _o5) => at(_o5) - at(a)).slice(0, LIMITS.customersMax)
.map(c => ({ id: String(c.id || ''), name: _oa(c.name, 80), need: _oa(c.need, 200), project: _oa(c.project, 120), note: _oa(c.note, 300) }));
const _oj = safeProvider(staff.provider);
const _oo = _oj === 'claude_api' ? 'Anthropic Claude' : 'Google Gemini';
const warning = `Dữ liệu rút gọn của ${items.length} khách (đã đồng ý; không có số điện thoại/email/địa chỉ) sẽ gửi tới ${_oo} (dịch vụ ngoài).`;
return { items, used: items.length, skipped: _od.length - items.length, warning };
}
export function buildTaskPrompt({ staff, skills = [], taskText = '', customers = [], now = Date.now(), memories } = {}) {
const st = staff || {};
const _oh = [systemOf({ ...st, prompt: st.prompt || st.instruction || '' })];
const _oi = selectSkills(skills, st, taskText);
const block = composeSkillBlock(_oi);
if (block) _oh.push('---', block);
const _oe = Array.isArray(memories) && memories.length ? buildMemoryContext(st, memories, taskText, now) : { block: '', ids: [] };
if (_oe.block) _oh.push('---', _oe.block);
const _o6 = customerContext(st, customers, { now });
if (_o6.used) {
_oh.push('---', 'DỮ LIỆU KHÁCH (rút gọn, khách đã đồng ý; không có số điện thoại/email/địa chỉ – không hỏi thêm):',
_o6.items.map(c => '- ' + [c.name, c.need && 'Nhu cầu: ' + c.need, c.project && 'Dự án: ' + c.project, c.note && 'Ghi chú: ' + c.note].filter(Boolean).join(' | ')).join('\n'));
}
_oh.push('---', 'VIỆC CẦN LÀM:', redact(_o7(taskText)).trim().slice(0, LIMITS.taskTextMax), '', TASK_FOOTER);
return { prompt: withRules(_oh.filter(x => x !== undefined).join('\n')), usedSkillIds: _oi.map(_ol => _ol.id), usedMemoryIds: _oe.ids, dataUsed: _o6.used, warning: _o6.warning };
}
export function makeAdhocTask({ room, staff, taskText = '', now = Date.now(), skills = [], customers = [], memories } = {}) {
const _ol = staff || {};
const _o5 = buildTaskPrompt({ staff: _ol, skills, taskText, customers, now, memories });
const _o9 = _o7(taskText).split('\n').map(x => x.trim()).find(Boolean) || _ol.role || 'Việc mới';
return taskRow({
type: 'staff_task', title: `${_ol.name || 'Nhân viên'}: ${redact(_o9)}`.slice(0, 140), status: 'queued', cost_estimate: 0,
input: { room_id: room ? room.id : '', staff_id: _ol.id, idea_id: '', step: _ol.id, prompt: _o5.prompt, json: false, provider: safeProvider(_ol.provider),
mode: 'semi', where: 'cloud', parent_id: '', created_at: now, budget_usd_day: room ? Number(room.budget_usd_day) || 0 : 0,
adhoc: 1, used_skill_ids: _o5.usedSkillIds, data_used: _o5.dataUsed, ...(Array.isArray(memories) ? { used_memory_ids: _o5.usedMemoryIds } : {}) },
output: {},
});
}

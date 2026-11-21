import { h } from '../_lib/kit.js';
import * as S from '../_lib/staff.js';
import * as SK from '../_lib/staff_skills.js';
import * as T from '../_lib/staff_templates.js';
import * as C from '../_lib/staff_custom.js';
import * as F from './flow.js';
const _o0 = 'Chỉ khách đã đồng ý lưu thông tin, không gồm số điện thoại/email; dữ liệu rút gọn sẽ gửi tới AI online đã chọn (Gemini → Google, Claude API → Anthropic).';
export const dataWarning = () => _o0;
export function seg(options, value, onPick, testid) {
const box = h('div', { class: 'stf-seg', role: 'group', 'data-testid': testid });
const set = v => { for (const _o5 of box.children) _o5.setAttribute('aria-pressed', String(_o5.dataset.v === v)); };
for (const [v, l] of Object.entries(options)) box.appendChild(h('button', { type: 'button', 'aria-pressed': String(v === value), 'data-v': v, onclick: () => { set(v); onPick(v); } }, l));
return box;
}
export async function openCreateStaff(D) {
const { K } = D;
const list = await D.loadStaff();
if (list.length >= C.LIMITS.maxStaff) { K.toast(`Tối đa ${C.LIMITS.maxStaff} nhân viên – xoá bớt rồi tạo thêm.`, 'warn'); return; }
const body = h('div', { class: 'stf-tpls', 'data-testid': 'staff-pick-list' });
const _oh = K.sheet({ title: 'Chọn mảng cho nhân viên AI', testid: 'staff-pick', body });
for (const t of T.FIELD_TEMPLATES) {
body.appendChild(h('button', { type: 'button', class: 'stf-tpl', 'data-testid': 'tpl-' + t.id, onclick: async () => {
_oh.close();
await K.afterClose(() => openStaffForm(D, { draft: T.staffFromTemplate(t.id, {}), isNew: true }));
} }, h('span', { class: 'i', 'aria-hidden': 'true' }, t.icon), h('span', null, h('b', null, t.label), h('small', null, (t.staff && t.staff.role) || ''))));
}
}
export async function openStaffForm(D, { draft, isNew = false }) {
const { K } = D;
if (!draft) return;
const _oc = await D.loadLib();
const _oj = C.isBuiltinStaff(draft);
const body = h('div', { class: 'bds-form', 'data-testid': 'staff-form' });
const _oh = K.sheet({ title: isNew ? 'Nhân viên AI mới' : 'Sửa ' + draft.name, testid: 'staff-form-sheet', body });
const name = h('input', { type: 'text', maxlength: '60', value: draft.name || '', 'data-testid': 'sf-name', disabled: _oj });
const role = h('input', { type: 'text', maxlength: '160', value: draft.role || '', 'data-testid': 'sf-role', disabled: _oj });
const prompt = h('textarea', { rows: 8, 'data-testid': 'sf-prompt' }); prompt.value = draft.prompt || draft.instruction || '';
const _o4 = (() => { try { return D.ctx && D.ctx.ai && D.ctx.ai.availability ? D.ctx.ai.availability() : null; } catch { return null; } })();
const _o2 = S.staffAiChoices(_o4, draft.provider);
const prov = K.select(_o2.options, _o2.value, { 'data-testid': 'sf-provider', 'aria-label': 'AI dùng' });
let mode = S.MODES[draft.mode] ? draft.mode : 'semi';
const _ol = h('p', { class: 'bds-note stf-warn', 'data-testid': 'sf-data-warn', hidden: !draft.data_access }, '⚠ ' + dataWarning(draft));
const data = h('input', { type: 'checkbox', checked: !!draft.data_access, 'data-testid': 'sf-data', onchange: e => { _ol.hidden = !e.target.checked; } });
const picked = new Set(draft.skills || []);
const _o6 = h('small', { class: 'bds-muted', 'data-testid': 'sf-skill-count' });
const _ok = () => { _o6.textContent = `Đã chọn ${picked.size}/${SK.SKILL_LIMITS.maxPerStaff}`; };
const skillBox = h('div', { class: 'stf-checks', 'data-testid': 'sf-skills' }, _oc.filter(s => s.enabled !== false).map(s => h('label', { class: 'stf-check' },
h('input', { type: 'checkbox', checked: picked.has(s.id), 'data-testid': 'sf-skill-' + s.id, onchange: e => {
if (e.target.checked && picked.size >= SK.SKILL_LIMITS.maxPerStaff) { e.target.checked = false; K.toast(`Mỗi nhân viên tối đa ${SK.SKILL_LIMITS.maxPerStaff} kỹ năng`, 'warn'); return; }
if (e.target.checked) picked.add(s.id); else picked.delete(s.id); _ok();
} }), h('span', null, s.name))));
_ok();
const _oa = h('p', { class: 'bds-error', 'data-testid': 'sf-err', role: 'alert' });
body.appendChild(K.field('Tên', name));
body.appendChild(K.field('Vai trò', role));
body.appendChild(K.field('Lời dặn (sửa được)', prompt));
body.appendChild(K.field('AI dùng', prov, (_o2.none ? 'Chưa nối AI online nào – nối ở Cài đặt › Kết nối. ' : '') + _o2.note));
body.appendChild(h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, 'Chế độ'), seg(S.MODES, mode, v => { mode = v; }, 'sf-mode'),
h('small', { class: 'bds-field-h' }, 'Bán tự động: kết quả vào Việc cần duyệt, anh/chị duyệt rồi mới dùng.')));
if (!_oj) {
body.appendChild(h('label', { class: 'stf-switch' }, data, h('span', null, 'Cho đọc dữ liệu khách hàng')));
body.appendChild(_ol);
}
body.appendChild(h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, 'Kỹ năng gắn cho nhân viên'), skillBox, _o6));
body.appendChild(_oa);
body.appendChild(h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _oh.close()), K.button(isNew ? 'Tạo nhân viên' : 'Lưu', async () => {
const list = await D.loadStaff();
const cur = list.find(s => s.id === draft.id) || draft;
const _oe = prompt.value.trim() || cur.prompt || '';
const patch = _oj
? { prompt: _oe, provider: S.safeProvider(prov.value), mode, skills: [...picked] }
: { name: name.value.trim(), role: role.value.trim(), prompt: _oe, instruction: _oe, provider: S.safeProvider(prov.value), mode, data_access: !!data.checked, skills: [...picked], custom: true };
const next = { ...cur, ...patch };
const r = isNew ? C.addStaff(list, next) : C.updateStaff(list, cur.id, patch);
if (!r.ok) { _oa.textContent = r.error || 'Thông tin chưa hợp lệ'; return; }
await D.saveStaff(r.list);
K.toast(isNew ? `Đã tạo nhân viên ${next.name}` : 'Đã lưu', 'success');
_oh.close(); D.refresh();
}, { kind: 'primary', testid: 'sf-save' })));
}
export async function deleteStaff(D, staff) {
const { K } = D;
if (!C.canDeleteStaff(staff)) return;
const _og = await D.loadRooms();
const _ob = _og.filter(r => !F.isVideoRoom(r) && (r.steps || []).some(s => s.staff_id === staff.id));
const ok = await K.confirm({ title: 'Xoá nhân viên?', text: `Xoá ${staff.name}?${_ob.length ? ' Nhân viên đang ở phòng ' + _ob.map(r => r.name).join(', ') + ' – bước của nhân viên này sẽ bị bỏ.' : ''} Việc đã làm vẫn giữ.`, ok: 'Xoá', kind: 'danger', testid: 'staff-del-confirm' });
if (!ok) return;
const _o8 = C.deleteStaff(await D.loadStaff(), staff.id);
if (!_o8.ok) { K.toast(_o8.error, 'warn'); return; }
await D.saveStaff(_o8.list);
if (_ob.length) await D.saveRooms(_og.map(r => (F.isVideoRoom(r) ? r : { ...r, steps: (r.steps || []).filter(s => s.staff_id !== staff.id), staff_ids: (r.staff_ids || []).filter(i => i !== staff.id) })));
K.toast('Đã xoá ' + staff.name, 'success');
D.refresh();
}
export async function openRoomForm(D, room = null) {
const { K } = D;
const _og = await D.loadRooms();
if (!room && _og.length >= C.LIMITS.maxRooms) { K.toast(`Tối đa ${C.LIMITS.maxRooms} phòng (kể cả phòng Sản xuất video)`, 'warn'); return; }
const _o3 = await D.loadStaff();
const _oi = _o3.filter(s => s.enabled !== false);
const r = F.normalizeCustomRoom(room || { name: '', steps: [], staff_ids: [] });
const body = h('div', { class: 'bds-form', 'data-testid': 'room-form' });
const _oh = K.sheet({ title: room ? 'Sửa phòng ' + r.name : 'Phòng mới', testid: 'room-form-sheet', body });
const name = h('input', { type: 'text', maxlength: '60', value: r.name, 'data-testid': 'rf-name', placeholder: 'Ví dụ: Phòng Chăm sóc khách' });
const members = new Set(r.staff_ids);
const _od = h('div', { class: 'stf-checks', 'data-testid': 'rf-members' }, _o3.map(s => h('label', { class: 'stf-check' },
h('input', { type: 'checkbox', checked: members.has(s.id), 'data-testid': 'rf-member-' + s.id, onchange: e => { if (e.target.checked) members.add(s.id); else members.delete(s.id); _o9(); } }),
h('span', null, (s.icon || '🤖') + ' ' + s.name + (s.enabled === false ? ' (tắt – vẫn chat được)' : '')))));
let steps = r.steps.map(x => ({ ...x }));
const stepBox = h('div', { class: 'bds-form', 'data-testid': 'rf-steps' });
const _of = () => { const m = _oi.filter(s => members.has(s.id)); return m.length ? m : _oi; };
function _o9() {
stepBox.innerHTML = '';
steps.forEach((st, i) => {
const sel = K.select(_of().map(s => [s.id, (s.icon || '🤖') + ' ' + s.name]), st.staff_id, { 'data-testid': 'rf-step-staff-' + i, 'aria-label': 'Nhân viên bước ' + (i + 1), onchange: e => { st.staff_id = e.target.value; } });
if (!st.staff_id && _of()[0]) st.staff_id = _of()[0].id;
const guide = h('input', { type: 'text', maxlength: '500', value: st.instruction || '', 'data-testid': 'rf-step-guide-' + i, placeholder: 'Hướng dẫn bước này', 'aria-label': 'Hướng dẫn bước ' + (i + 1), oninput: e => { st.instruction = e.target.value; } });
stepBox.appendChild(h('div', { class: 'stf-step' }, h('b', null, (i + 1) + '.'), sel, guide,
K.button('✕', () => { steps.splice(i, 1); _o9(); }, { testid: 'rf-step-del-' + i, title: 'Bỏ bước' })));
});
if (!steps.length) stepBox.appendChild(h('small', { class: 'bds-muted' }, 'Chưa có bước – bấm "+ Thêm bước".'));
}
_o9();
const _o1 = K.button('+ Thêm bước', () => {
if (steps.length >= C.LIMITS.maxStepsPerRoom) { K.toast(`Tối đa ${C.LIMITS.maxStepsPerRoom} bước`, 'warn'); return; }
steps.push({ staff_id: (_of()[Math.min(steps.length, _of().length - 1)] || {}).id || '', instruction: '' }); _o9();
}, { testid: 'rf-step-add' });
let schedule = r.schedule.mode, mode = r.mode;
const start = h('input', { type: 'time', value: r.schedule.at, 'data-testid': 'rf-start', 'aria-label': 'Giờ chạy hằng ngày' });
const daily = h('textarea', { rows: 3, maxlength: String(C.LIMITS.taskTextMax), 'data-testid': 'rf-daily', placeholder: 'Việc phòng làm mỗi ngày, ví dụ: soạn 3 tin hỏi thăm khách' }); daily.value = r.daily_task;
const _o7 = h('div', { class: 'bds-form', hidden: schedule !== 'daily' }, K.field('Giờ chạy', start, 'Mở app sau giờ này mà hôm nay chưa chạy → app chạy bù.'), K.field('Việc hằng ngày', daily));
const budget = h('input', { type: 'number', min: '0', step: '0.1', inputmode: 'decimal', value: String(r.budget_usd_day), 'data-testid': 'rf-budget' });
const _oa = h('p', { class: 'bds-error', 'data-testid': 'rf-err', role: 'alert' });
body.appendChild(K.field('Tên phòng', name));
body.appendChild(h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, 'Nhân viên trong phòng'), _od));
body.appendChild(h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, 'Các bước (nhân viên → hướng dẫn)'), stepBox, h('div', null, _o1)));
body.appendChild(h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, 'Lịch'), seg({ manual: 'Chạy tay', daily: 'Hằng ngày' }, schedule, v => { schedule = v; _o7.hidden = v !== 'daily'; }, 'rf-schedule')));
body.appendChild(_o7);
body.appendChild(h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, 'Chế độ'), seg(S.MODES, mode, v => { mode = v; }, 'rf-mode'),
h('small', { class: 'bds-field-h' }, 'Bán tự động: dừng sau mỗi bước chờ anh/chị duyệt. Tự động: chạy hết các bước; kết quả cuối luôn vào Việc cần duyệt.')));
body.appendChild(K.field('Ngân sách / ngày (USD)', budget, '0 = không giới hạn · Gemini miễn phí = 0 USD · hết ngân sách thì phòng dừng và báo.'));
body.appendChild(_oa);
body.appendChild(h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _oh.close()), K.button(room ? 'Lưu phòng' : 'Tạo phòng', async () => {
const next = F.normalizeCustomRoom({ ...r, name: name.value, staff_ids: [...members], steps, schedule: { mode: schedule, at: start.value }, daily_task: daily.value, mode,
budget_usd_day: Math.max(0, Number(String(budget.value).replace(',', '.')) || 0) });
if (!next.name) { _oa.textContent = 'Nhập tên phòng.'; return; }
if (!next.steps.length) { _oa.textContent = 'Phòng cần ít nhất 1 bước.'; return; }
if (schedule === 'daily' && !next.daily_task.trim()) { _oa.textContent = 'Chạy hằng ngày cần ghi "Việc hằng ngày".'; return; }
const v = C.validateRoom(next);
if (!v.ok) { _oa.textContent = v.error || 'Phòng chưa hợp lệ'; return; }
const cur = await D.loadRooms();
await D.saveRooms(room ? cur.map(x => (x.id === next.id ? next : x)) : [...cur, next]);
K.toast(room ? 'Đã lưu phòng' : 'Đã tạo phòng ' + next.name, 'success');
_oh.close(); D.refresh();
}, { kind: 'primary', testid: 'rf-save' })));
}
export async function deleteRoom(D, room) {
const { K } = D;
const ok = await K.confirm({ title: 'Xoá phòng?', text: `Xoá phòng ${room.name}? Việc đã làm vẫn giữ ở Bảng tiến độ.`, ok: 'Xoá', kind: 'danger', testid: 'room-del-confirm' });
if (!ok) return;
await D.saveRooms((await D.loadRooms()).filter(r => r.id !== room.id));
K.toast('Đã xoá phòng', 'success'); D.refresh();
}

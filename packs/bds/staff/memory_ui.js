import { h } from '../_lib/kit.js';
import * as M from '../_lib/staff_memory.js';
import * as Store from './memory_store.js';
import { REJECT_REASONS } from './memory_learn.js';
import { memoryOn } from './flow.js';
export const MEMORY_EXPLAIN = 'Nhân viên nhớ các bài anh/chị duyệt/bác để viết giống ý anh/chị hơn. Dữ liệu ở trong app của anh/chị; số điện thoại và email luôn được che.';
const _o1 = () => M.MEM_LIMITS || {};
const _oq = m => m.type || m.kind || 'note';
const _op = m => String(m.text ?? m.final ?? m.body ?? '');
const _o3 = m => Number(m.at || m.created_at || 0);
const dmy = ms => { if (!ms) return ''; const _o5 = new Date(ms); return String(_o5.getDate()).padStart(2, '0') + '/' + String(_o5.getMonth() + 1).padStart(2, '0'); };
const _o0 = { 1: 'Thường', 2: 'Quan trọng', 3: 'Rất quan trọng' };
const SECTIONS = [['note', '📒 Sổ ghi nhớ'], ['good', '✅ Ví dụ tốt (duyệt nguyên văn)'], ['bad', '⛔ Điều đã bác'], ['edit', '✏️ Cách anh/chị đã sửa']];
export function statsLine(_on) {
const s = _on || {};
const _o2 = Number(s.approved) || 0, e = Number(s.edited) || 0, _oj = Number(s.rejected) || 0, tot = _o2 + e + _oj;
const _oh = tot ? Math.round(Number(s.rate) || 0) : 0;
const _ok = (s.topReasons || []).map(x => (typeof x === 'string' ? x : x && (x.reason || x.text || x[0]))).filter(Boolean);
return [`Đã duyệt nguyên văn ${_o2}`, `Sửa ${e}`, `Bác ${_oj}`, `Tỷ lệ duyệt ${_oh}%`].join(' · ') + (_ok.length ? ' · Lý do bác hay gặp: ' + _ok.join(', ') : '');
}
export function askRejectReason(K) {
return new Promise(res => {
let m = null, settled = false;
const _o6 = _or => { if (settled) return; settled = true; if (m) m.close(); res(_or); };
const inp = h('input', { type: 'text', maxlength: String(_o1().reasonMax || 200), 'data-testid': 'rej-reason', placeholder: 'Gõ lý do (có thể bỏ trống)', 'aria-label': 'Lý do bác' });
const chips = h('div', { class: 'stf-chips stf-chipbtns' }, REJECT_REASONS.map((_oj, i) => h('button', { type: 'button', class: 'stf-chipbtn', 'data-testid': 'rej-chip-' + i,
onclick: () => { if (/^Khác/.test(_oj)) { inp.value = ''; inp.focus(); } else inp.value = _oj; } }, _oj)));
m = K.modal({ title: 'Lý do bác?', testid: 'rej-ask', body: [
h('small', { class: 'bds-muted' }, 'Nhân viên nhớ để lần sau tránh.'), chips, inp,
h('div', { class: 'bds-row bds-end bds-wrap' }, K.button('Huỷ', () => _o6(null), { testid: 'rej-cancel' }),
K.button('Bác', () => _o6(inp.value.trim()), { kind: 'danger', testid: 'rej-ok' }))] });
});
}
export function noteForm(D, staff, after) {
const { K } = D;
const _oa = _o1().noteMax || 500;
const _oo = h('textarea', { rows: 3, maxlength: String(_oa), 'data-testid': 'mem-note-text', 'aria-label': 'Nội dung ghi nhớ', placeholder: 'Ví dụ: luôn ký tên "Minh BĐS", không dùng chữ "siêu phẩm"' });
const cnt = h('small', { class: 'bds-muted' }, `0/${_oa}`);
_oo.addEventListener('input', () => { cnt.textContent = `${_oo.value.length}/${_oa}`; });
const _o7 = K.select(Object.entries(_o0).map(([_or, l]) => [_or, l]), '2', { 'data-testid': 'mem-note-imp', 'aria-label': 'Mức quan trọng' });
const pin = h('input', { type: 'checkbox', 'data-testid': 'mem-note-pin' });
const _ol = K.button('Lưu ghi nhớ', async () => {
const text = _oo.value.trim();
if (!text) { K.toast('Gõ nội dung cần nhớ trước.', 'warn'); return; }
_ol.disabled = true;
try {
const _ob = M.addNote({ staff, text, tags: [], importance: Number(_o7.value) || 2, pinned: pin.checked, now: Date.now() });
if (!_ob) { K.toast('Ghi nhớ chưa hợp lệ.', 'warn'); return; }
const [saved] = await Store.saveMemories(K, [_ob]);
_oo.value = ''; pin.checked = false; cnt.textContent = `0/${_oa}`;
K.toast('Đã ghi nhớ cho ' + staff.name, 'success');
if (after) after(saved || _ob);
} catch (e) { K.toast((e && e.message) || 'Chưa lưu được', 'warn'); } finally { _ol.disabled = false; }
}, { kind: 'primary', testid: 'mem-note-save' });
return h('div', { class: 'bds-form', 'data-testid': 'mem-note-form' },
K.field('Điều cần nhớ', _oo),
h('div', { class: 'bds-row bds-wrap' }, K.field('Mức quan trọng', _o7), h('label', { class: 'stf-check' }, pin, '📌 Ghim (luôn đưa vào)')),
h('div', { class: 'bds-row bds-wrap bds-end' }, cnt, _ol));
}
export function openAddNote(D, staff) {
const body = h('div', { class: 'bds-form' });
const _om = D.K.sheet({ title: '🧠 Nhớ giúp ' + staff.name, testid: 'mem-quick', body });
if (!memoryOn(staff)) body.appendChild(h('p', { class: 'stf-warn' }, 'Nhân viên đang tắt "Học từ việc anh/chị duyệt/bác" – ghi nhớ được lưu nhưng chỉ dùng khi bật lại.'));
body.appendChild(noteForm(D, staff, () => { _om.close(); D.refresh(); }));
}
function _oc(D, m) {
const { K } = D;
const t = _oq(m), text = _op(m);
const _od = [dmy(_o3(m)), t === 'note' ? _o0[m.importance] || '' : '', t === 'bad' && m.reason ? 'Lý do: ' + m.reason : '', m.pinned ? '📌 Ghim' : '',
Number(m.uses) ? `đã dùng ${m.uses} lần` : ''].filter(Boolean).join(' · ');
const _o9 = text.length > 140 || (t === 'edit' && (m.before || m.original));
return h('div', { class: 'stf-mem', 'data-testid': 'mem-item-' + m.id, 'data-type': t },
h('div', { class: 'stf-mem-t' }, text.slice(0, 140) + (text.length > 140 ? '…' : '')),
_od ? h('small', { class: 'bds-muted' }, _od) : null,
_o9 ? h('details', null, h('summary', null, 'Xem'),
t === 'edit' && (m.before || m.original) ? [h('small', { class: 'bds-muted' }, 'Bản nhân viên viết:'), h('pre', { class: 'bds-pre stf-pre' }, String(m.before || m.original))] : null,
h('small', { class: 'bds-muted' }, t === 'edit' ? 'Bản anh/chị duyệt:' : 'Nội dung:'), h('pre', { class: 'bds-pre stf-pre' }, text)) : null,
h('div', { class: 'bds-row bds-wrap' },
K.button(m.pinned ? 'Bỏ ghim' : '📌 Ghim', async () => { await Store.setPinned(K, m, !m.pinned); D.refresh(); }, { testid: 'mem-pin-' + m.id }),
K.button('Xoá', async () => {
const ok = await K.confirm({ title: 'Xoá mục này?', text: 'Nhân viên sẽ không nhớ mục này nữa.', ok: 'Xoá', kind: 'danger', testid: 'mem-del-confirm' });
if (!ok) return;
await Store.deleteMemory(K, m.id); K.toast('Đã xoá', 'success'); D.refresh();
}, { testid: 'mem-del-' + m.id })));
}
async function _o4(K, staff, pinnedCount) {
return new Promise(res => {
let m = null, settled = false;
const _o6 = _or => { if (settled) return; settled = true; if (m) m.close(); res(_or); };
const keep = h('input', { type: 'checkbox', 'data-testid': 'mem-clear-keep', checked: pinnedCount > 0 });
m = K.modal({ title: 'Xoá sạch trí nhớ?', testid: 'mem-clear-confirm', body: [
h('p', null, `Xoá mọi ví dụ và ghi nhớ của ${staff.name}? Không hoàn tác được.`),
h('label', { class: 'stf-check' }, keep, `Giữ ${pinnedCount} mục đã ghim`),
h('div', { class: 'bds-row bds-end bds-wrap' }, K.button('Huỷ', () => _o6(null), { testid: 'mem-clear-cancel' }),
K.button('Xoá sạch', () => _o6({ keepPinned: keep.checked }), { kind: 'danger', testid: 'mem-clear-ok' }))] });
});
}
export function memoryPanel(D, { staffList, memories, sel, onSel }) {
const { K } = D;
const box = h('div', { class: 'stf-pane-in', 'data-testid': 'mem-panel' });
box.appendChild(h('p', { class: 'bds-muted', 'data-testid': 'mem-explain' }, '🧠 ' + MEMORY_EXPLAIN));
if (!staffList.length) { box.appendChild(h('small', { class: 'bds-muted' }, 'Chưa có nhân viên.')); return box; }
const staff = staffList.find(s => s.id === sel) || staffList[0];
const _oe = (memories || []).filter(m => m.staff_id === staff.id);
const _oi = K.select(staffList.map(s => [s.id, (s.icon || '🤖') + ' ' + s.name]), staff.id, { 'data-testid': 'mem-staff', 'aria-label': 'Chọn nhân viên', onchange: e => onSel(e.target.value) });
const _og = memoryOn(staff);
const sw = h('input', { type: 'checkbox', 'data-testid': 'mem-on', checked: _og, onchange: async e => {
const _or = e.target.checked;
const list = await D.loadStaff();
await D.saveStaff(list.map(s => (s.id === staff.id ? { ...s, memory_on: _or } : s)));
K.toast(_or ? 'Đã bật học từ việc anh/chị duyệt/bác' : 'Đã tắt – không ghi thêm, không đưa vào lời nhắn', 'success');
D.refresh();
} });
let _on = null;
try { _on = M.habitStats(memories || [], staff.id, { now: Date.now(), days: 30 }); } catch { _on = null; }
box.appendChild(K.card({ title: 'Thói quen 30 ngày', testid: 'mem-stats-card', body: h('div', { class: 'bds-form' },
K.field('Nhân viên', _oi),
h('label', { class: 'stf-switch' }, sw, 'Học từ việc anh/chị duyệt/bác'),
_og ? null : h('small', { class: 'bds-muted', 'data-testid': 'mem-off-note' }, 'Đang tắt: không ghi thêm và không đưa trí nhớ vào lời nhắn.'),
h('p', { class: 'stf-rep', 'data-testid': 'mem-stats' }, statsLine(_on))) }));
for (const [t, title] of SECTIONS) {
const list = _oe.filter(m => _oq(m) === t).sort((_o2, b) => (Number(!!b.pinned) - Number(!!_o2.pinned)) || (_o3(b) - _o3(_o2)));
const _o8 = h('div', { class: 'stf-mems', 'data-testid': 'mem-list-' + t }, list.length ? list.map(m => _oc(D, m)) : h('small', { class: 'bds-muted' }, 'Chưa có.'));
const body = t === 'note' ? h('div', { class: 'bds-form' }, noteForm(D, staff, () => D.refresh()), _o8) : _o8;
box.appendChild(K.card({ title: `${title} (${list.length})`, testid: 'mem-card-' + t, body }));
}
const pinned = _oe.filter(m => m.pinned).length;
box.appendChild(h('div', { class: 'bds-row bds-wrap' }, K.button('🗑 Xoá sạch trí nhớ của nhân viên này', async () => {
if (!_oe.length) { K.toast('Nhân viên chưa nhớ gì.', 'info'); return; }
const _oj = await _o4(K, staff, pinned);
if (!_oj) return;
const _of = await Store.clearStaffMemory(K, staff.id, _oj);
K.toast(`Đã xoá ${_of} mục`, 'success'); D.refresh();
}, { kind: 'danger', testid: 'mem-clear' })));
return box;
}

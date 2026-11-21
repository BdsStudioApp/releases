import * as M from '../_lib/staff_memory.js';
import * as S from '../_lib/staff.js';
import * as Store from './memory_store.js';
import { memoryOn } from './flow.js';
export const REJECT_REASONS = ['Sai giọng văn', 'Sai số liệu', 'Quá dài', 'Có cam kết lợi nhuận', 'Khác…'];
export const LEARN_TOAST = 'Nhân viên đã nhớ cách anh/chị duyệt';
const _o7 = t => (t && typeof t.input === 'string' ? S.taskView(t) : t || {});
export async function staffOf(K, id) {
return S.normalizeStaff(await K.setting('staff', null)).find(s => s.id === id) || null;
}
const taskInfo = t => String((t.input && t.input.task_text) || String(t.title || '').replace(/^[^:]+:\s*/, '') || '').slice(0, 300);
export async function learnApproval(K, { task, staff, original, final, now = Date.now() } = {}) {
const t = _o7(task);
const _o6 = staff || await staffOf(K, t.input && t.input.staff_id);
if (!_o6 || !memoryOn(_o6)) return { kind: null, saved: [], off: !!_o6 };
const _o3 = M.recordApproval({ staff: _o6, task: taskInfo(t), original: String(original ?? ''), final: String(final ?? ''), now }) || [];
const saved = await Store.saveMemories(K, _o3);
const kind = saved.some(m => m.type === 'edit') ? 'edit' : saved.some(m => m.type === 'good') ? 'good' : null;
return { kind, saved };
}
export async function learnRejection(K, { task, staff, original, reason = '', now = Date.now() } = {}) {
const t = _o7(task);
const _o6 = staff || await staffOf(K, t.input && t.input.staff_id);
if (!_o6 || !memoryOn(_o6)) return { kind: null, saved: [], off: !!_o6 };
const _o5 = String(reason || '').trim().replace(/^Khác…$/, '');
const saved = await Store.saveMemories(K, M.recordRejection({ staff: _o6, task: taskInfo(t), original: String(original ?? ''), reason: _o5, now }) || []);
return { kind: saved.length ? 'bad' : null, saved };
}
const _o4 = row => S.parse(row && row.output);
export async function approveRow(K, row, finalText) {
const out = _o4(row);
const original = String(out.final_text || out.text || '');
const final = String(finalText ?? '').trim() || original;
const _o2 = await learnApproval(K, { task: row, original, final }).catch(() => ({}));
await K.put('jobs', { ...row, status: 'queued', output: JSON.stringify({ ...out, ...(final !== original.trim() ? { edited_text: final } : {}) }) });
return _o2 || {};
}
export async function rejectRow(K, row, reason) {
const out = _o4(row);
const original = String(out.final_text || out.text || '');
await K.put('jobs', { ...row, status: 'error', output: JSON.stringify({ ...out, rejected: 1, error: reason || 'Anh/chị không duyệt', reason: reason || 'Chủ app bỏ', finished_at: Date.now() }) });
return (await learnRejection(K, { task: row, original, reason }).catch(() => ({}))) || {};
}
export async function touchAfterRun(K, ids, now = Date.now()) {
const want = new Set((ids || []).filter(Boolean));
if (!want.size) return 0;
const _o0 = (await Store.listMemories(K)).filter(m => want.has(m.id));
if (!_o0.length) return 0;
const next = M.touchUsed(_o0, [...want], now) || [];
const _o1 = next.filter(m => want.has(m.id));
await Store.saveMemories(K, _o1);
return _o1.length;
}

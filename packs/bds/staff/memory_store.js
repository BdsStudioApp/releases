import * as M from '../_lib/staff_memory.js';
export const HIDDEN_KIND = 'ai_memory_hidden';
export const canEraseMem = K => { const _o4 = K && K.ctx && K.ctx.user && K.ctx.user.perms; return !_o4 || _o4.erase !== false; };
const at = _o2 => Number(_o2.at || _o2.created_at || 0);
export async function listMemories(K, staffId) {
const _o6 = await K.list('objects');
return M.memoriesFromObjects(_o6.filter(r => r && r.kind === M.MEM_KIND), staffId || undefined).sort((a, b) => at(b) - at(a));
}
async function _o5(K, row) {
if (canEraseMem(K)) await K.put('objects', { ...row, deleted: 1 });
else await K.put('objects', { ...row, kind: HIDDEN_KIND });
}
export async function saveMemories(K, memories, opts = {}) {
const _o7 = [];
for (const _o2 of memories || []) {
const row = _o2 && M.memoryToObject(_o2);
if (!row) continue;
await K.put('objects', row);
_o7.push(M.objectToMemory(row) || _o2);
}
if (_o7.length) await prune(K, opts);
return _o7;
}
async function prune(K, { maxPerStaff } = {}) {
const _o0 = await listMemories(K);
const _o1 = maxPerStaff || (M.MEM_LIMITS && M.MEM_LIMITS.maxPerStaff);
const { drop } = M.pruneMemories(_o0, _o1 ? { maxPerStaff: _o1 } : {});
for (const _o2 of drop || []) {
const row = await K.get('objects', _o2.id);
if (row && row.kind === M.MEM_KIND) await _o5(K, row);
}
return (drop || []).length;
}
export async function deleteMemory(K, id) {
const row = await K.get('objects', id);
if (!row || row.kind !== M.MEM_KIND || Number(row.deleted)) return false;
await _o5(K, row);
return true;
}
export async function clearStaffMemory(K, staffId, { keepPinned = false } = {}) {
const ids = M.memoryIdsToClear(await listMemories(K, staffId), staffId, { keepPinned });
let _o3 = 0;
for (const id of ids || []) if (await deleteMemory(K, id)) _o3++;
return _o3;
}
export async function setPinned(K, mem, pinned) {
const [_o2] = await saveMemories(K, [{ ...mem, pinned: !!pinned }]);
return _o2 || null;
}

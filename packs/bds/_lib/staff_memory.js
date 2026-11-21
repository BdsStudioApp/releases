import { redact } from './staff.js';
import { fold } from './staff_skills.js';
export const MEM_KIND = 'ai_memory';
export const MEM_LIMITS = { maxPerStaff: 200, textMax: 1500, noteMax: 500, reasonMax: 300, blockMax: 6000 };
export const MEM_TYPES = ['good', 'bad', 'edit', 'note'];
export const MEM_BLOCK_TITLES = {
good: 'VÍ DỤ ANH ĐÃ DUYỆT (viết theo phong cách này)',
edit: 'ANH ĐÃ SỬA THẾ NÀY (học cách sửa)',
bad: 'ĐIỀU ANH ĐÃ BÁC (tránh)',
notes: 'GHI NHỚ CỦA ANH',
};
export const MEM_BLOCK_FOOTER = 'Lưu ý: ví dụ chỉ để học phong cách, không sao chép nguyên văn; thông tin trong ghi nhớ có thể đã cũ – kiểm lại khi dùng số liệu.';
const L = MEM_LIMITS;
const DAY = 86400000;
const _o1 = 30 * DAY;
const _o2 = /^[A-Za-z0-9_-]{1,64}$/;
const _o0 = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const _o9 = (s, max) => redact(String(s ?? '').normalize('NFC').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n').replace(_o0, '')).trim().slice(0, max);
const _o8 = (s, max) => _o9(String(s ?? '').replace(/\s+/g, ' '), max);
const _o12 = s => String(s ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
const _ov = () => Math.random().toString(36).slice(2, 10).padEnd(8, '0');
export const newMemoryId = () => 'mm_' + Date.now().toString(36) + _ov();
const _o13 = staff => (typeof staff === 'string' ? staff : staff && typeof staff.id === 'string' ? staff.id : '');
const num = (v, d) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : d);
const _o16 = v => v === true || v === 1 || v === '1' || v === 'true';
export function normalizeMemory(_ot) {
if (!_ot || typeof _ot !== 'object') return null;
const staff_id = typeof _ot.staff_id === 'string' && _o2.test(_ot.staff_id) ? _ot.staff_id : '';
const type = MEM_TYPES.includes(_ot.type) ? _ot.type : '';
if (!staff_id || !type) return null;
const text = _o9(_ot.text, type === 'note' ? L.noteMax : L.textMax);
if (!text) return null;
const _oj = Math.round(Number(_ot.importance));
return {
id: typeof _ot.id === 'string' && _o2.test(_ot.id) ? _ot.id : newMemoryId(),
staff_id, type,
task: _o8(_ot.task, L.noteMax),
text,
before: type === 'edit' ? _o9(_ot.before, L.textMax) : '',
reason: _o8(_ot.reason, L.reasonMax),
tags: (Array.isArray(_ot.tags) ? _ot.tags : []).filter(t => typeof t === 'string').map(t => _o8(t, 40)).filter(Boolean).slice(0, 8),
importance: Number.isFinite(_oj) ? Math.min(3, Math.max(1, _oj)) : 2,
at: num(_ot.at, Date.now()),
uses: Math.max(0, Math.floor(Number(_ot.uses) || 0)),
pinned: _o16(_ot.pinned),
};
}
export function memoryToObject(mem, now = Date.now()) {
const m = normalizeMemory(mem);
if (!m) return null;
const { id, ...rest } = m;
return {
id, kind: MEM_KIND, name: (m.task || m.text).replace(/\s+/g, ' ').slice(0, 60), note: m.type, status: m.pinned ? 'pinned' : 'on',
source: MEM_KIND, consent: 0, data: JSON.stringify(rest), updated_at: now, deleted: 0,
};
}
export function objectToMemory(row) {
if (!row || row.kind !== MEM_KIND || Number(row.deleted)) return null;
let d = row.data;
if (typeof d === 'string') { try { d = JSON.parse(d || '{}'); } catch { d = {}; } }
d = d && typeof d === 'object' ? d : {};
return normalizeMemory({ ...d, id: row.id });
}
export const memoriesFromObjects = (rows, staffId) => (Array.isArray(rows) ? rows : []).map(objectToMemory)
.filter(m => m && (!staffId || m.staff_id === staffId));
export function recordApproval({ staff, task = '', original = '', final = '', now = Date.now() } = {}) {
const staff_id = _o13(staff);
if (!staff_id || !_o12(final)) return [];
const _ox = !_o12(original) || _o12(original) === _o12(final);
const m = normalizeMemory(_ox
? { staff_id, type: 'good', task, text: final, at: now }
: { staff_id, type: 'edit', task, text: final, before: original, at: now });
return m ? [m] : [];
}
export function recordRejection({ staff, task = '', original = '', reason = '', now = Date.now() } = {}) {
const staff_id = _o13(staff);
if (!staff_id || !_o12(original)) return [];
const m = normalizeMemory({ staff_id, type: 'bad', task, text: original, reason, importance: _o12(reason) ? 2 : 1, at: now });
return m ? [m] : [];
}
export function addNote({ staff, text = '', tags = [], importance = 2, pinned = false, now = Date.now() } = {}) {
return normalizeMemory({ staff_id: _o13(staff), type: 'note', text, tags, importance, pinned, at: now });
}
const _o4 = new Set(('va cua cho la cac nhung mot voi khi thi ma de co khong duoc trong tu den nay do ra vao len xuong bi '
+ 'em anh chi ban toi minh giup hay nhe o ve nhu cung rat da dang se sau truoc theo neu vi gi nao').split(' '));
const tokens = s => new Set(fold(s).split(/[^a-z0-9]+/).filter(_o17 => _o17.length >= 2 && !_o4.has(_o17)));
const _ou = (at, now) => Math.pow(0.5, Math.max(0, now - at) / _o1);
const _oq = m => m.pinned || (m.type === 'note' && m.importance === 3);
export function selectMemories(memories, staff, taskText = '', { maxGood = 2, maxBad = 2, maxEdit = 2, maxNotes = 5, now = Date.now() } = {}) {
const _o11 = _o13(staff);
const out = { good: [], bad: [], edit: [], notes: [], ids: [] };
if (!_o11 || !Array.isArray(memories)) return out;
const _o18 = tokens(taskText);
const _op = { good: [], bad: [], edit: [], note: [] };
const _oz = new Set();
for (const _ot of memories) {
const m = normalizeMemory(_ot);
if (!m || m.staff_id !== _o11 || _oz.has(m.id)) continue;
_oz.add(m.id);
let hit = 0;
for (const _o17 of tokens([m.task, m.text, m.tags.join(' ')].join(' '))) if (_o18.has(_o17)) hit++;
const rec = _ou(m.at, now);
const score = hit ? hit * 10 + m.importance * 2 + (m.pinned ? 5 : 0) + rec * 3 : 0;
_op[m.type].push({ m, hit, score, rec, pri: _oq(m) });
}
const _on = (a, b) => b.score - a.score || b.rec - a.rec || b.m.at - a.m.at;
const _oo = (list, max, fallback) => {
const n = Math.max(0, Number(max) || 0);
const pri = list.filter(p => p.pri).sort((a, b) => b.hit - a.hit || b.m.importance - a.m.importance || b.m.at - a.m.at);
const rest = list.filter(p => !p.pri && p.hit > 0).sort(_on);
let _og = [...pri, ...rest].slice(0, n);
if (!_og.length && fallback && n && list.length) _og = [list.slice().sort((a, b) => b.m.at - a.m.at)[0]];
return _og.map(p => p.m);
};
out.good = _oo(_op.good, maxGood, true);
out.bad = _oo(_op.bad, maxBad, true);
out.edit = _oo(_op.edit, maxEdit, true);
out.notes = _oo(_op.note, maxNotes, false);
out.ids = [...out.good, ...out.bad, ...out.edit, ...out.notes].map(m => m.id);
return out;
}
const _o3 = 1200;
const _oc = (s, max) => { const t = redact(String(s ?? '')).trim(); return t.length > max ? t.slice(0, Math.max(0, max - 1)) + '…' : t; };
const _oe = {
good: m => `- Việc: ${_oc(m.task, 200) || '(không ghi)'}\n${_oc(m.text, _o3)}`,
edit: m => `- Việc: ${_oc(m.task, 200) || '(không ghi)'}\nBản nhân viên viết:\n${_oc(m.before, _o3 / 2)}\nAnh sửa thành:\n${_oc(m.text, _o3 / 2)}`,
bad: m => `- ${_oc(m.text, _o3)}\nLý do anh bác: ${_oc(m.reason, L.reasonMax) || '(anh không ghi lý do)'}`,
notes: m => `- ${_oc(m.text, L.noteMax)}${m.tags && m.tags.length ? ` [${m.tags.map(t => _oc(t, 40)).join(', ')}]` : ''}`,
};
export function composeMemoryBlock(_o10) {
if (!_o10 || typeof _o10 !== 'object') return '';
const _oy = ['good', 'edit', 'bad', 'notes'].map(_ol => [_ol, (Array.isArray(_o10[_ol]) ? _o10[_ol] : []).filter(m => m && m.text)]).filter(([, l]) => l.length);
if (!_oy.length) return '';
const _oi = 'TRÍ NHỚ CỦA NHÂN VIÊN (học theo thói quen làm việc của anh):';
const _o14 = '\n\n' + MEM_BLOCK_FOOTER;
let out = _oi;
for (const [_ol, list] of _oy) {
const title = `\n\n${MEM_BLOCK_TITLES[_ol]}:`;
if (L.blockMax - _o14.length - out.length - title.length < 80) break;
let _o5 = '';
for (const m of list) {
const _ok = '\n' + _oe[_ol](m);
const _ow = L.blockMax - _o14.length - out.length - title.length - _o5.length;
if (_ow < 80) break;
_o5 += _ok.length > _ow ? _ok.slice(0, _ow - 1) + '…' : _ok;
}
if (_o5) out += title + _o5;
}
return out === _oi ? '' : out + _o14;
}
export function buildMemoryContext(staff, memories, taskText = '', now = Date.now()) {
const _o10 = selectMemories(memories, staff, taskText, { now });
const block = composeMemoryBlock(_o10);
return { block, ids: block ? _o10.ids : [] };
}
export function pruneMemories(memories, { maxPerStaff = L.maxPerStaff } = {}) {
const list = (Array.isArray(memories) ? memories : []).filter(m => m && typeof m === 'object');
const max = Math.max(0, Number(maxPerStaff) || L.maxPerStaff);
const _od = new Set();
const _o6 = new Map();
for (const m of list) { const _ol = m.staff_id || ''; if (!_o6.has(_ol)) _o6.set(_ol, []); _o6.get(_ol).push(m); }
for (const _oh of _o6.values()) {
if (_oh.length <= max) continue;
const _of = new Set(_oh.filter(m => m.type === 'good').sort((a, b) => (Number(b.at) || 0) - (Number(a.at) || 0)).slice(0, 5));
const _or = m => _o16(m.pinned) || (m.type === 'note' && Number(m.importance) === 3) || _of.has(m);
const _o7 = _oh.filter(m => !_or(m)).sort((a, b) => (Number(a.at) || 0) - (Number(b.at) || 0));
for (const m of _o7.slice(0, _oh.length - max)) _od.add(m);
}
return { keep: list.filter(m => !_od.has(m)), drop: list.filter(m => _od.has(m)) };
}
export function memoryIdsToClear(memories, staffId, { keepPinned = false } = {}) {
if (!staffId) return [];
return (Array.isArray(memories) ? memories : [])
.filter(m => m && m.staff_id === staffId && m.id && !(keepPinned && _o16(m.pinned))).map(m => m.id);
}
export function touchUsed(memories, ids, now = Date.now()) {
const set = new Set(Array.isArray(ids) ? ids : []);
return (Array.isArray(memories) ? memories : []).map(m => (m && set.has(m.id) ? { ...m, uses: (Number(m.uses) || 0) + 1, used_at: now } : m));
}
export function habitStats(memories, staffId, { now = Date.now(), days = 30 } = {}) {
const _om = (Array.isArray(memories) ? memories : []).filter(m => m && m.staff_id === staffId);
const from = now - Math.max(0, Number(days) || 0) * DAY;
const _o19 = _om.filter(m => (Number(m.at) || 0) >= from && (Number(m.at) || 0) <= now);
const _oa = t => _o19.filter(m => m.type === t).length;
const approved = _oa('good'), edited = _oa('edit'), rejected = _oa('bad');
const _o15 = approved + edited + rejected;
const reasons = new Map();
for (const m of _o19) {
if (m.type !== 'bad') continue;
const _os = _o12(m.reason);
if (!_os) continue;
const _ol = fold(_os).toLowerCase();
const _ob = reasons.get(_ol) || { text: _os, n: 0 };
_ob.n++; reasons.set(_ol, _ob);
}
return {
approved, edited, rejected,
rate: _o15 ? Math.round((approved * 100) / _o15) : 0,
notes: _om.filter(m => m.type === 'note').length,
topReasons: [...reasons.values()].sort((a, b) => b.n - a.n).slice(0, 3).map(x => x.text),
lastAt: _om.reduce((a, m) => Math.max(a, Number(m.at) || 0), 0),
};
}

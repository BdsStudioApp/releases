import { rejectionMessage } from './health_logic.9704b81308.js';
export const TABLES = ['objects', 'events', 'reminders', 'policies', 'quotes', 'projects', 'jobs', 'ideas', 'characters', 'settings', 'devices', 'audit', 'errors'];
function _o1f(row) { const v = row && (row.name || row.title || row.full_name || row.key || row.label); return v == null ? '' : String(v).slice(0, 60); }
export const SYNC_TABLES = ['objects', 'events', 'reminders', 'policies', 'quotes', 'projects', 'jobs', 'ideas', 'characters', 'settings'];
export const IDB_VERSION = 2;
export const PUSH_LIMIT = 200;
export const PULL_PAGE_ROWS = 500;
const _o0 = new Set(['objects', 'quotes', 'devices']);
export const LOCAL_ONLY = new Set(['audit', 'errors']);
export const pk = (table) => (table === 'settings' ? 'key' : 'id');
export function newId() {
const r = new Uint8Array(6);
if (globalThis.crypto && crypto.getRandomValues) crypto.getRandomValues(r); else for (let _ok = 0; _ok < 6; _ok++) r[_ok] = Math.random() * 256;
return Date.now().toString(36) + [...r].map((b) => b.toString(36).padStart(2, '0')).join('').slice(0, 10);
}
export function matchFilter(row, filter) {
if (!filter) return true;
if (typeof filter === 'function') return !!filter(row);
for (const [k, cond] of Object.entries(filter)) {
const v = row[k];
if (Array.isArray(cond)) { if (!cond.some((c) => _on(v, c))) return false; continue; }
if (cond && typeof cond === 'object') {
if ('$ne' in cond && _on(v, cond.$ne)) return false;
if ('$in' in cond && !cond.$in.some((c) => _on(v, c))) return false;
if ('$gt' in cond && !(v > cond.$gt)) return false;
if ('$gte' in cond && !(v >= cond.$gte)) return false;
if ('$lt' in cond && !(v < cond.$lt)) return false;
if ('$lte' in cond && !(v <= cond.$lte)) return false;
if ('$contains' in cond && !String(v ?? '').toLowerCase().includes(String(cond.$contains).toLowerCase())) return false;
continue;
}
if (!_on(v, cond)) return false;
}
return true;
}
function _on(a, b) {
if (a === b) return true;
if (a == null || b == null) return a == b;
return String(a) === String(b);
}
export function sortRows(_o1g, order = '-updated_at') {
const _oa = order.startsWith('-');
const key = _oa ? order.slice(1) : order;
return _o1g.sort((a, b) => {
const _o1r = a[key], y = b[key];
const c = (_o1r == null ? -Infinity : _o1r) < (y == null ? -Infinity : y) ? -1 : (_o1r == null ? -Infinity : _o1r) > (y == null ? -Infinity : y) ? 1 : 0;
return _oa ? -c : c;
});
}
export function compactOutbox(ops) {
const map = new Map();
for (const o of ops) {
const key = o.table + '\u0000' + o.row[pk(o.table)];
const prev = map.get(key);
const seqs = (prev ? prev.seqs : []).concat(o.seqs || (o.seq != null ? [o.seq] : []));
map.delete(key);
map.set(key, { ...o, seqs });
}
return [...map.values()];
}
export function chunk(arr, _ou = PUSH_LIMIT) {
const _o11 = [];
for (let _ok = 0; _ok < arr.length; _ok += _ou) _o11.push(arr.slice(_ok, _ok + _ou));
return _o11;
}
export function resolveIncoming(local, remote, pending) {
if (!local) return 'apply';
const _oo = Number(local.updated_at) || 0, ru = Number(remote.updated_at) || 0;
if (!pending && ru >= _oo && !!remote.hidden !== !!local.hidden) return 'apply';
if (!pending) return ru > _oo ? 'apply' : 'keep';
if (ru > _oo) return 'conflict';
return 'keep';
}
const _ov = (v) => (v == null || v === '' ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v));
export function sameContent(a, b) {
if (!a || !b) return false;
const norm = (v) => (v == null || v === '' ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v));
for (const k of Object.keys(a)) {
if (k === 'updated_at' || k === 'created_at') continue;
const _o1r = norm(a[k]), y = norm(b[k]);
if (_o1r === y) continue;
if ((k === 'deleted' || k === 'hidden') && (_o1r || '0') === (y || '0')) continue;
return false;
}
return true;
}
function _ol(_o1c) { return new Promise((_o1d, rej) => { _o1c.onsuccess = () => _o1d(_o1c.result); _o1c.onerror = () => rej(_o1c.error); }); }
async function _oz(name) {
const _o8 = await new Promise((_o1d, rej) => {
const _o1c = indexedDB.open(name, IDB_VERSION);
_o1c.onupgradeneeded = () => {
const _o7 = _o1c.result;
for (const _o1n of TABLES) {
if (_o7.objectStoreNames.contains(_o1n)) continue;
if (_o1n === 'audit' || _o1n === 'errors') _o7.createObjectStore(_o1n, { keyPath: '_k', autoIncrement: true });
else _o7.createObjectStore(_o1n, { keyPath: pk(_o1n) });
}
if (!_o7.objectStoreNames.contains('_outbox')) _o7.createObjectStore('_outbox', { keyPath: 'seq', autoIncrement: true });
if (!_o7.objectStoreNames.contains('_meta')) _o7.createObjectStore('_meta', { keyPath: 'k' });
};
_o1c.onsuccess = () => _o1d(_o1c.result);
_o1c.onerror = () => rej(_o1c.error);
_o1c.onblocked = () => rej(new Error('IndexedDB blocked'));
});
_o8.onversionchange = () => { try { _o8.close(); } catch { } };
return {
kind: 'idb',
async getAll(_o1k) { return _ol(_o8.transaction(_o1k).objectStore(_o1k).getAll()); },
async put(_o1k, value) { const _o1p = _o8.transaction(_o1k, 'readwrite'); const r = await _ol(_o1p.objectStore(_o1k).put(value)); return r; },
async putMany(_o1k, values) {
if (!values.length) return;
await new Promise((_o1d, rej) => {
const _o1p = _o8.transaction(_o1k, 'readwrite'); const _o10 = _o1p.objectStore(_o1k);
for (const v of values) _o10.put(v);
_o1p.oncomplete = () => _o1d(); _o1p.onerror = () => rej(_o1p.error); _o1p.onabort = () => rej(_o1p.error);
});
},
async del(_o1k, keys) {
if (!keys.length) return;
await new Promise((_o1d, rej) => {
const _o1p = _o8.transaction(_o1k, 'readwrite'); const _o10 = _o1p.objectStore(_o1k);
for (const k of keys) _o10.delete(k);
_o1p.oncomplete = () => _o1d(); _o1p.onerror = () => rej(_o1p.error);
});
},
close() { _o8.close(); },
async destroy() { _o8.close(); await new Promise((_o1d) => { const r = indexedDB.deleteDatabase(name); r.onsuccess = r.onerror = r.onblocked = () => _o1d(); }); }
};
}
function _or() {
const _o1l = new Map(); let seq = 0;
const s = (_ou) => { if (!_o1l.has(_ou)) _o1l.set(_ou, new Map()); return _o1l.get(_ou); };
const keyOf = (_ou, v) => (_ou === '_outbox' ? (v.seq ?? (v.seq = ++seq)) : _ou === '_meta' ? v.k : v[pk(_ou)]);
return {
kind: 'memory',
async getAll(_ou) { return [...s(_ou).values()].map((v) => ({ ...v })); },
async put(_ou, v) { const k = keyOf(_ou, v); s(_ou).set(k, { ...v }); return k; },
async putMany(_ou, vs) { for (const v of vs) s(_ou).set(keyOf(_ou, v), { ...v }); },
async del(_ou, ks) { for (const k of ks) s(_ou).delete(k); },
close() {}, async destroy() { _o1l.clear(); }
};
}
export function createStore({ api, dbName = 'bds', useIdb = true, intervalMs = 30000, onConflict, onRejected, onError, makeLayer } = {}) {
const _oq = new Map(TABLES.map((_o1n) => [_o1n, new Map()]));
let _om = null, outbox = [], lastSync = 0, cursor = 0, userId = '', online = typeof navigator === 'undefined' ? true : navigator.onLine !== false;
let pageState = null, pullProgress = null;
const _o14 = new Map(); const _o19 = (table, row) => table + '\u0000' + row[pk(table)];
const _o16 = (table, row) => { const o = _o14.get(_o19(table, row)); return o && !o.gone ? o : null; };
let syncing = null, lastError = null, timer = null, soonTimer = null, opened = null;
const _o1m = new Map(); const _o1i = new Set(); const _o1a = new Set();
const _od = (table, change) => {
for (const key of [table, '*']) for (const _o4 of _o1m.get(key) || []) { try { _o4({ table, ...change }); } catch { } }
};
const _oe = () => { const s = _o1k.status(); for (const _o4 of _o1i) { try { _o4(s); } catch { } } };
const _og = (where, e) => { lastError = String(e && e.message || e); try { onError && onError('critical', where, lastError, e && e.stack); } catch { } };
async function _o17(name, value) {
try { await _om.put(name, value); } catch (e) { _og('store.persist:' + name, e); }
}
const _o1k = {
async open() {
if (opened) return opened;
opened = (async () => {
if (useIdb && typeof indexedDB !== 'undefined') {
try { _om = await _oz(dbName); } catch (e) { _og('store.open', e); _om = _or(); }
} else _om = makeLayer ? makeLayer() : _or();
for (const _o1n of TABLES) {
if (_o1n === 'audit' || _o1n === 'errors') continue;
const _o1g = await _om.getAll(_o1n).catch(() => []);
const _op = _oq.get(_o1n); for (const r of _o1g) _op.set(String(r[pk(_o1n)]), r);
}
outbox = (await _om.getAll('_outbox').catch(() => [])).sort((a, b) => a.seq - b.seq);
for (const o of outbox) { delete o.gone; _o14.set(_o19(o.table, o.row), o); }
const _os = await _om.getAll('_meta').catch(() => []);
lastSync = Number((_os.find((_op) => _op.k === 'lastSync') || {}).v) || 0;
cursor = Number((_os.find((_op) => _op.k === 'cursor') || {}).v) || lastSync;
pageState = (_os.find((_op) => _op.k === 'pullPage') || {}).v || null;
userId = String((_os.find((_op) => _op.k === 'userId') || {}).v || '');
return _o1k;
})();
return opened;
},
get backend() { return _om ? _om.kind : 'none'; },
get userId() { return userId; },
async setUser(id) {
userId = id ? String(id) : '';
if (_om) await _om.put('_meta', { k: 'userId', v: userId }).catch((e) => _og('store.meta', e));
},
async list(table, filter, { order = '-updated_at', limit, includeDeleted } = {}) {
const _op = _oq.get(table); if (!_op) return [];
let _o1g = [];
for (const r of _op.values()) if ((includeDeleted || !Number(r.deleted)) && matchFilter(r, filter)) _o1g.push({ ...r });
_o1g = sortRows(_o1g, order);
return limit ? _o1g.slice(0, limit) : _o1g;
},
async get(table, id) {
const r = _oq.get(table)?.get(String(id));
return r && !Number(r.deleted) ? { ...r } : null;
},
async put(table, row, opts = {}) {
if (!_oq.has(table)) throw new Error('Bảng không hợp lệ: ' + table);
const key = pk(table); const now = Date.now();
const r = { ...row };
if (r[key] == null || r[key] === '') r[key] = newId();
const prev = _oq.get(table).get(String(r[key]));
r.updated_at = !prev && opts.keepStamp && Number(row.updated_at) > 0 ? Number(row.updated_at) : Math.max(now, (prev && Number(prev.updated_at) + 1) || 0);
if (r.deleted == null) r.deleted = 0;
if (_o0.has(table) && !r.created_at) r.created_at = (prev && prev.created_at) || now;
_oq.get(table).set(String(r[key]), r);
if (LOCAL_ONLY.has(table)) _o17(table, r); else _o1b(table, Number(r.deleted) ? 'delete' : 'upsert', r, prev, !prev && opts.keepStamp);
_od(table, { type: 'put', row: { ...r } });
return { ...r };
},
async remove(table, id) {
const prev = _oq.get(table)?.get(String(id));
if (!prev) return false;
await _o1k.put(table, { ...prev, deleted: 1 });
return true;
},
on(table, _o4) {
if (!_o1m.has(table)) _o1m.set(table, new Set());
_o1m.get(table).add(_o4);
return () => _o1m.get(table).delete(_o4);
},
onStatus(_o4) { _o1i.add(_o4); _o4(_o1k.status()); return () => _o1i.delete(_o4); },
onPull(_o4) { _o1a.add(_o4); return () => _o1a.delete(_o4); },
status() { return { pending: outbox.length, lastSync, online, syncing: !!syncing, error: lastError, backend: _o1k.backend, pull: pullProgress ? { ...pullProgress } : null }; },
pendingOps() {
return compactOutbox(outbox.map((o) => ({ ...o, seqs: [] }))).map((o) => (o.base ? { table: o.table, op: o.op, row: { ...o.row }, base: { ...o.base } } : { table: o.table, op: o.op, row: { ...o.row } }));
},
async requeue(ops) {
let _ou = 0;
for (const o of Array.isArray(ops) ? ops : []) {
if (!o || !SYNC_TABLES.includes(o.table) || !o.row || typeof o.row !== 'object' || (o.op !== 'upsert' && o.op !== 'delete')) continue;
const id = o.row[pk(o.table)];
if (id == null || id === '') continue;
const cur = _oq.get(o.table).get(String(id));
if (cur && /"erased"\s*:\s*1/.test(String(cur.data || ''))) continue;
const row = { ...o.row };
_oq.get(o.table).set(String(id), row);
_o1b(o.table, o.op, row, cur, false, o.base && typeof o.base === 'object' ? { ...o.base } : null);
_od(o.table, { type: 'put', row: { ...row } });
_ou++;
}
return _ou;
},
syncNow() {
if (syncing) return syncing;
if (!api || !api.hasValidToken || !api.hasValidToken()) return Promise.resolve(_o1k.status());
syncing = _ob().finally(() => { syncing = null; _oe(); });
_oe();
return syncing;
},
start() {
_o1k.stop();
timer = setInterval(() => _o1k.syncNow(), intervalMs);
if (typeof window !== 'undefined') { window.addEventListener('online', _ox); window.addEventListener('offline', _ow); }
return _o1k.syncNow();
},
stop() {
if (timer) clearInterval(timer); timer = null;
if (typeof window !== 'undefined') { window.removeEventListener('online', _ox); window.removeEventListener('offline', _ow); }
},
async clear() {
_o1k.stop();
for (const _op of _oq.values()) _op.clear();
outbox = []; _o14.clear(); lastSync = 0; cursor = 0; userId = ''; pageState = null; pullProgress = null;
if (_om) { try { await _om.destroy(); } catch { } }
_om = null; opened = null;
_oe();
},
applyRemote
};
function _o1(table, row, prev) {
if (table === 'settings' || !prev) return null;
const pend = _o16(table, row);
if (pend && !pend.base) return null;
const base = pend ? { ...pend.base } : {};
for (const k of Object.keys(row)) {
if (k === 'updated_at' || k === 'created_at' || k in base) continue;
if (_ov(prev[k]) !== _ov(row[k])) base[k] = prev[k] === undefined ? null : prev[k];
}
return base;
}
function _o1b(table, op, row, prev, quiet, baseGiven) {
const _of = { table, op, row: { ...row } };
if (quiet) _of.quiet = 1;
const base = baseGiven !== undefined ? baseGiven : _o1(table, row, prev);
if (base) _of.base = base;
outbox.push(_of); _o14.set(_o19(table, row), _of);
if (_om) _om.put('_outbox', _of).then((seq) => { if (_of.seq == null) _of.seq = seq; if (_of.gone && _of.seq != null) _om.del('_outbox', [_of.seq]).catch(() => {}); }).catch((e) => _og('store.outbox', e));
_o17(table, row);
_oe();
clearTimeout(soonTimer);
soonTimer = setTimeout(() => _o1k.syncNow(), 1500);
}
async function applyRemote(changes) {
let conflicts = 0;
const _o15 = new Set(outbox.map((o) => o.table + '\u0000' + o.row[pk(o.table)]));
for (const [table, _o1g] of Object.entries(changes || {})) {
const _op = _oq.get(table); if (!_op || !Array.isArray(_o1g)) continue;
const _o1o = [];
for (const remote of _o1g) {
const id = String(remote[pk(table)]);
const local = _op.get(id);
const _o9 = resolveIncoming(local, remote, _o15.has(table + '\u0000' + id));
if (_o9 === 'keep') continue;
if (_o9 === 'conflict') {
const _ot = outbox.filter((o) => o.table === table && String(o.row[pk(table)]) === id);
if (_ot.length && _ot.every((o) => o.base && o.op === 'upsert') && !Number(remote.deleted) && !remote.hidden) {
const merged = { ...remote };
for (const o of _ot) for (const k of Object.keys(o.base)) merged[k] = o.row[k];
_op.set(id, merged); _o1o.push(merged); _od(table, { type: 'remote', row: { ...merged } });
continue;
}
if (!sameContent(local, remote)) conflicts++;
const _oc = _ot;
outbox = outbox.filter((o) => !_oc.includes(o));
await _oh(_oc);
}
_op.set(id, { ...remote });
_o1o.push(remote);
_od(table, { type: 'remote', row: { ...remote } });
}
if (_om && _o1o.length) await _om.putMany(table, _o1o).catch((e) => _og('store.applyRemote', e));
}
return conflicts;
}
async function _ob() {
let conflicts = 0;
const _o6 = [];
try {
const _o2 = compactOutbox(outbox.map((o) => ({ ...o, seqs: [o] })));
const rejected = [];
for (const _o13 of chunk(_o2, PUSH_LIMIT)) {
let _o1d;
try { _o1d = await api.call('sync.push', { ops: _o13.map((o) => (o.base ? { table: o.table, op: o.op, row: o.row, base: o.base } : { table: o.table, op: o.op, row: o.row })) }); } catch (e) {
if (e && e.code === 'LICENSE_READONLY') break;
throw e;
}
const results = (_o1d && _o1d.results) || [];
results.forEach((r, _ok) => { if (r && r.conflict && !(_o13[_ok] && (_o13[_ok].quiet || (r.row && sameContent(_o13[_ok].row, r.row))))) conflicts++; });
results.forEach((r) => { if (r && r.ok && Array.isArray(r.fields) && r.fields.length) { conflicts++; if (r.object_id) _o6.push({ object_id: String(r.object_id), event_id: String(r.conflict_event || ''), fields: r.fields }); } });
const _oj = new Set(); results.forEach((r, _ok) => { if (r && r.ok === false && r.error === 'LICENSE_READONLY' && _o13[_ok]) _oj.add(_o13[_ok]); });
results.forEach((r, _ok) => { if (r && r.ok === false && !r.conflict && _o13[_ok] && !_oj.has(_o13[_ok])) rejected.push({ table: _o13[_ok].table, id: String(_o13[_ok].row[pk(_o13[_ok].table)]), name: _o1f(_o13[_ok].row), error: r.error || 'REJECTED' }); });
const done = new Set(_o13.filter((o) => !_oj.has(o)).flatMap((o) => o.seqs));
outbox = outbox.filter((o) => !done.has(o));
await _oh([...done]);
for (const r of results) {
if (!r || r.updated_at == null) continue;
const op = _o13.find((o) => String(o.row[pk(o.table)]) === String(r.id));
if (!op) continue;
const cur = _oq.get(op.table).get(String(r.id));
const _o1j = !!_o16(op.table, op.row);
if (cur && !r.conflict && (Number(cur.updated_at) === Number(op.row.updated_at) || !_o1j)) {
if (r.row && typeof r.row === 'object') {
const nr = { ...r.row, updated_at: Number(r.updated_at) };
_oq.get(op.table).set(String(r.id), nr); _o17(op.table, nr); _od(op.table, { type: 'remote', row: { ...nr } });
} else { cur.updated_at = Number(r.updated_at); _o17(op.table, cur); }
} else if (cur && !r.conflict && r.ok !== false) {
const _o3 = Number(cur.updated_at) <= Number(r.updated_at);
if (_o3) cur.updated_at = Number(r.updated_at) + 1;
for (const o of outbox) {
if (o.table !== op.table || String(o.row[pk(o.table)]) !== String(r.id)) continue;
if (_o3) o.row.updated_at = cur.updated_at;
if (o.base) for (const k of Object.keys(o.base)) { const _o1h = r.row || op.row; o.base[k] = _o1h[k] === undefined ? null : _o1h[k]; }
if (r.row && o.base) for (const k of Object.keys(r.row)) if (k !== 'updated_at' && !(k in o.base)) { o.row[k] = r.row[k]; cur[k] = r.row[k]; }
if (_om && o.seq != null) _om.put('_outbox', o).catch(() => {});
}
_o17(op.table, cur);
}
}
}
if (rejected.length) await _o1e(rejected);
const pull = !cursor || pageState ? await _o12((_ou) => { conflicts += _ou; }) : await api.call('sync.pull', { since: cursor, tables: SYNC_TABLES });
if (!pull.__paged) conflicts += await applyRemote(pull && pull.changes);
if (pull && Array.isArray(pull.cheers) && pull.cheers.length) for (const _o4 of _o1a) { try { _o4({ cheers: pull.cheers }); } catch { } }
cursor = Number(pull && pull.now) || Date.now();
lastSync = Number(pull && pull.server_time) || cursor;
if (_om) await _om.putMany('_meta', [{ k: 'cursor', v: cursor }, { k: 'lastSync', v: lastSync }]).catch(() => {});
online = true; lastError = null;
if (rejected.length) {
lastError = rejectionMessage(rejected);
try { onError && onError('warn', 'sync.rejected', lastError, JSON.stringify(rejected.slice(0, 20))); } catch { }
if (onRejected) { try { onRejected(rejected); } catch { } }
}
} catch (e) {
pullProgress = null;
if (e && e.code === 'NETWORK') online = false;
else lastError = String(e && (e.userMessage || e.message) || e);
}
if (conflicts && onConflict) { try { onConflict(conflicts, _o6); } catch { } }
return _o1k.status();
}
async function _o12(addConflicts) {
let st = pageState && typeof pageState === 'object' ? { ...pageState } : { after: null, now: 0, server_time: 0, done: 0, total: 0 };
for (let _oi = 0; _oi < 100000; _oi++) {
pullProgress = { done: Number(st.done) || 0, total: Number(st.total) || 0 }; _oe();
const _o18 = await api.call('sync.pull', { since: 0, tables: SYNC_TABLES, page: st.after ? { after: st.after } : true, limit: PULL_PAGE_ROWS });
addConflicts(await applyRemote(_o18 && _o18.changes));
if (_o18 && Array.isArray(_o18.cheers) && _o18.cheers.length) for (const _o4 of _o1a) { try { _o4({ cheers: _o18.cheers }); } catch { } }
if (!st.now) { st.now = Number(_o18 && _o18.now) || Date.now(); st.server_time = Number(_o18 && _o18.server_time) || st.now; }
const page = _o18 && _o18.page;
if (!page || !page.next) break;
st = { ...st, after: page.next, done: Number(page.done) || 0, total: Number(page.total) || 0 };
pageState = st;
if (_om) await _om.put('_meta', { k: 'pullPage', v: st }).catch(() => {});
}
pageState = null; pullProgress = null;
if (_om) await _om.del('_meta', ['pullPage']).catch(() => {});
return { __paged: true, now: st.now, server_time: st.server_time };
}
async function _oh(entries) {
const seqs = [];
for (const o of entries) { o.gone = true; if (o.seq != null) seqs.push(o.seq); }
if (_om && seqs.length) await _om.del('_outbox', seqs).catch(() => {});
}
async function _o1e(rejected) {
const tables = new Set();
for (const { table, id, error } of rejected) {
const _op = _oq.get(table); if (!_op) continue;
tables.add(table);
const local = _op.get(id);
if (!local) continue;
_op.delete(id);
if (_om) await _om.del(table, [id]).catch(() => {});
_od(table, { type: 'remote', row: { ...local, deleted: 1 }, rejected: error || 'REJECTED' });
}
const _o1q = [...tables].filter((_o1n) => SYNC_TABLES.includes(_o1n));
if (!_o1q.length) return;
const pull = await api.call('sync.pull', { since: 0, tables: _o1q });
const _o5 = (pull && pull.changes) || {};
const ids = new Set(rejected.map((r) => r.table + '\u0000' + r.id));
const _oy = {};
for (const _o1n of _o1q) _oy[_o1n] = (_o5[_o1n] || []).filter((r) => ids.has(_o1n + '\u0000' + String(r[pk(_o1n)])));
await applyRemote(_oy);
}
function _ox() { online = true; _oe(); _o1k.syncNow(); }
function _ow() { online = false; _oe(); }
return _o1k;
}
export default createStore;

import { rejectionMessage } from './health_logic.7f3d23ce57.js';
export const TABLES = ['objects', 'events', 'reminders', 'policies', 'quotes', 'projects', 'jobs', 'ideas', 'characters', 'settings', 'devices', 'audit', 'errors'];
function _o1l(row) { const v = row && (row.name || row.title || row.full_name || row.key || row.label); return v == null ? '' : String(v).slice(0, 60); }
export const SYNC_TABLES = ['objects', 'events', 'reminders', 'policies', 'quotes', 'projects', 'jobs', 'ideas', 'characters', 'settings'];
export const IDB_VERSION = 2;
export const PUSH_LIMIT = 200;
export const PULL_PAGE_ROWS = 500;
const _o0 = new Set(['objects', 'quotes', 'devices']);
export const LOCAL_ONLY = new Set(['audit', 'errors']);
export const pk = (table) => (table === 'settings' ? 'key' : 'id');
export function newId() {
const r = new Uint8Array(6);
if (globalThis.crypto && crypto.getRandomValues) crypto.getRandomValues(r); else for (let _ol = 0; _ol < 6; _ol++) r[_ol] = Math.random() * 256;
return Date.now().toString(36) + [...r].map((b) => b.toString(36).padStart(2, '0')).join('').slice(0, 10);
}
export function matchFilter(row, filter) {
if (!filter) return true;
if (typeof filter === 'function') return !!filter(row);
for (const [k, cond] of Object.entries(filter)) {
const v = row[k];
if (Array.isArray(cond)) { if (!cond.some((c) => _oq(v, c))) return false; continue; }
if (cond && typeof cond === 'object') {
if ('$ne' in cond && _oq(v, cond.$ne)) return false;
if ('$in' in cond && !cond.$in.some((c) => _oq(v, c))) return false;
if ('$gt' in cond && !(v > cond.$gt)) return false;
if ('$gte' in cond && !(v >= cond.$gte)) return false;
if ('$lt' in cond && !(v < cond.$lt)) return false;
if ('$lte' in cond && !(v <= cond.$lte)) return false;
if ('$contains' in cond && !String(v ?? '').toLowerCase().includes(String(cond.$contains).toLowerCase())) return false;
continue;
}
if (!_oq(v, cond)) return false;
}
return true;
}
function _oq(a, b) {
if (a === b) return true;
if (a == null || b == null) return a == b;
return String(a) === String(b);
}
export function sortRows(_o1n, order = '-updated_at') {
const _oa = order.startsWith('-');
const key = _oa ? order.slice(1) : order;
return _o1n.sort((a, b) => {
const _o1z = a[key], y = b[key];
const c = (_o1z == null ? -Infinity : _o1z) < (y == null ? -Infinity : y) ? -1 : (_o1z == null ? -Infinity : _o1z) > (y == null ? -Infinity : y) ? 1 : 0;
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
export function chunk(arr, _ox = PUSH_LIMIT) {
const _o15 = [];
for (let _ol = 0; _ol < arr.length; _ol += _ox) _o15.push(arr.slice(_ol, _ol + _ox));
return _o15;
}
export function resolveIncoming(local, remote, pending) {
if (!local) return 'apply';
const _or = Number(local.updated_at) || 0, ru = Number(remote.updated_at) || 0;
if (!pending && ru >= _or && !!remote.hidden !== !!local.hidden) return 'apply';
if (!pending) return ru > _or ? 'apply' : 'keep';
if (ru > _or) return 'conflict';
return 'keep';
}
const _oy = (v) => (v == null || v === '' ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v));
export function sameContent(a, b) {
if (!a || !b) return false;
const norm = (v) => (v == null || v === '' ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v));
for (const k of Object.keys(a)) {
if (k === 'updated_at' || k === 'created_at') continue;
const _o1z = norm(a[k]), y = norm(b[k]);
if (_o1z === y) continue;
if ((k === 'deleted' || k === 'hidden') && (_o1z || '0') === (y || '0')) continue;
return false;
}
return true;
}
function _om(_o1i) { return new Promise((_o1j, rej) => { _o1i.onsuccess = () => _o1j(_o1i.result); _o1i.onerror = () => rej(_o1i.error); }); }
function _on(_o8, store, fill) {
return new Promise((_o1j, rej) => {
const _o1x = _o8.transaction(store, 'readwrite'); let _o15;
const _o1i = fill(_o1x.objectStore(store));
if (_o1i) _o1i.onsuccess = () => { _o15 = _o1i.result; };
_o1x.oncomplete = () => _o1j(_o15);
_o1x.onerror = () => rej(_o1x.error || (_o1i && _o1i.error));
_o1x.onabort = () => rej(_o1x.error || new Error('IndexedDB transaction aborted'));
try { if (typeof _o1x.commit === 'function') _o1x.commit(); } catch { }
});
}
async function _o14(name) {
const _o8 = await new Promise((_o1j, rej) => {
const _o1i = indexedDB.open(name, IDB_VERSION);
_o1i.onupgradeneeded = () => {
const _o7 = _o1i.result;
for (const _o1u of TABLES) {
if (_o7.objectStoreNames.contains(_o1u)) continue;
if (_o1u === 'audit' || _o1u === 'errors') _o7.createObjectStore(_o1u, { keyPath: '_k', autoIncrement: true });
else _o7.createObjectStore(_o1u, { keyPath: pk(_o1u) });
}
if (!_o7.objectStoreNames.contains('_outbox')) _o7.createObjectStore('_outbox', { keyPath: 'seq', autoIncrement: true });
if (!_o7.objectStoreNames.contains('_meta')) _o7.createObjectStore('_meta', { keyPath: 'k' });
};
_o1i.onsuccess = () => _o1j(_o1i.result);
_o1i.onerror = () => rej(_o1i.error);
_o1i.onblocked = () => rej(new Error('IndexedDB blocked'));
});
_o8.onversionchange = () => { try { _o8.close(); } catch { } };
return {
kind: 'idb',
async getAll(store) { return _om(_o8.transaction(store).objectStore(store).getAll()); },
async put(store, value) { return _on(_o8, store, (os) => os.put(value)); },
async putMany(store, values) {
if (!values.length) return;
await _on(_o8, store, (os) => { for (const v of values) os.put(v); return null; });
},
async del(store, keys) {
if (!keys.length) return;
await _on(_o8, store, (os) => { for (const k of keys) os.delete(k); return null; });
},
close() { _o8.close(); },
async destroy() { _o8.close(); await new Promise((_o1j) => { const r = indexedDB.deleteDatabase(name); r.onsuccess = r.onerror = r.onblocked = () => _o1j(); }); }
};
}
function _ou() {
const _o1s = new Map(); let seq = 0;
const s = (_ox) => { if (!_o1s.has(_ox)) _o1s.set(_ox, new Map()); return _o1s.get(_ox); };
const keyOf = (_ox, v) => (_ox === '_outbox' ? (v.seq ?? (v.seq = ++seq)) : _ox === '_meta' ? v.k : v[pk(_ox)]);
return {
kind: 'memory',
async getAll(_ox) { return [...s(_ox).values()].map((v) => ({ ...v })); },
async put(_ox, v) { const k = keyOf(_ox, v); s(_ox).set(k, { ...v }); return k; },
async putMany(_ox, vs) { for (const v of vs) s(_ox).set(keyOf(_ox, v), { ...v }); },
async del(_ox, ks) { for (const k of ks) s(_ox).delete(k); },
close() {}, async destroy() { _o1s.clear(); }
};
}
export function createStore({ api, dbName = 'bds', useIdb = true, intervalMs = 30000, onConflict, onRejected, onError, makeLayer } = {}) {
const _ot = new Map(TABLES.map((_o1u) => [_o1u, new Map()]));
let _oz = 0;
let _op = null, outbox = [], lastSync = 0, cursor = 0, userId = '', online = typeof navigator === 'undefined' ? true : navigator.onLine !== false;
let pageState = null, pullProgress = null;
const _o1a = new Map(); const _o1f = (table, row) => table + '\u0000' + row[pk(table)];
const _o1c = (table, row) => { const o = _o1a.get(_o1f(table, row)); return o && !o.gone ? o : null; };
let syncing = null, lastError = null, timer = null, soonTimer = null, opened = null;
const _o1t = new Map(); const _o1q = new Set(); const _o1g = new Set();
const _od = (table, change) => {
for (const key of [table, '*']) for (const _o4 of _o1t.get(key) || []) { try { _o4({ table, ...change }); } catch { } }
};
const _oe = () => { const s = store.status(); for (const _o4 of _o1q) { try { _o4(s); } catch { } } };
const _og = (where, e) => { lastError = String(e && e.message || e); try { onError && onError('critical', where, lastError, e && e.stack); } catch { } };
const writes = new Set();
const _o1w = (_o17) => { writes.add(_o17); _o17.then(() => writes.delete(_o17), () => writes.delete(_o17)); return _o17; };
function _o1d(name, value) {
if (!_op) return Promise.resolve();
let _o17; try { _o17 = Promise.resolve(_op.put(name, value)); } catch (e) { _o17 = Promise.reject(e); }
return _o1w(_o17.then(() => {}, (e) => _og('store.persist:' + name, e)));
}
function _o10() {
if (typeof document !== 'undefined' && document.visibilityState === 'visible') return;
store.flush().catch(() => {});
if (outbox.length) store.syncNow();
}
const store = {
async open() {
if (opened) return opened;
opened = (async () => {
if (useIdb && typeof indexedDB !== 'undefined') {
try { _op = await _o14(dbName); } catch (e) { _og('store.open', e); _op = _ou(); }
} else _op = makeLayer ? makeLayer() : _ou();
for (const _o1u of TABLES) {
if (_o1u === 'audit' || _o1u === 'errors') continue;
const _o1n = await _op.getAll(_o1u).catch(() => []);
const _os = _ot.get(_o1u); for (const r of _o1n) _os.set(String(r[pk(_o1u)]), r);
}
outbox = (await _op.getAll('_outbox').catch(() => [])).sort((a, b) => a.seq - b.seq);
for (const o of outbox) { delete o.gone; _o1a.set(_o1f(o.table, o.row), o); }
const _ov = await _op.getAll('_meta').catch(() => []);
lastSync = Number((_ov.find((_os) => _os.k === 'lastSync') || {}).v) || 0;
cursor = Number((_ov.find((_os) => _os.k === 'cursor') || {}).v) || lastSync;
pageState = (_ov.find((_os) => _os.k === 'pullPage') || {}).v || null;
userId = String((_ov.find((_os) => _os.k === 'userId') || {}).v || '');
return store;
})();
return opened;
},
get backend() { return _op ? _op.kind : 'none'; },
get userId() { return userId; },
async setUser(id) {
userId = id ? String(id) : '';
if (_op) await _op.put('_meta', { k: 'userId', v: userId }).catch((e) => _og('store.meta', e));
},
async list(table, filter, { order = '-updated_at', limit, includeDeleted } = {}) {
const _os = _ot.get(table); if (!_os) return [];
let _o1n = [];
for (const r of _os.values()) if ((includeDeleted || !Number(r.deleted)) && matchFilter(r, filter)) _o1n.push({ ...r });
_o1n = sortRows(_o1n, order);
return limit ? _o1n.slice(0, limit) : _o1n;
},
async get(table, id) {
const r = _ot.get(table)?.get(String(id));
return r && !Number(r.deleted) ? { ...r } : null;
},
async put(table, row, opts = {}) {
if (!_ot.has(table)) throw new Error('Bảng không hợp lệ: ' + table);
const key = pk(table); const now = Date.now();
const r = { ...row };
if (r[key] == null || r[key] === '') r[key] = newId();
const prev = _ot.get(table).get(String(r[key]));
r.updated_at = !prev && opts.keepStamp && Number(row.updated_at) > 0 ? Number(row.updated_at) : Math.max(now, (prev && Number(prev.updated_at) + 1) || 0);
if (r.deleted == null) r.deleted = 0;
if (_o0.has(table) && !r.created_at) r.created_at = (prev && prev.created_at) || now;
_ot.get(table).set(String(r[key]), r);
const _o1o = LOCAL_ONLY.has(table) ? _o1d(table, r) : _o1h(table, Number(r.deleted) ? 'delete' : 'upsert', r, prev, !prev && opts.keepStamp);
_od(table, { type: 'put', row: { ...r } });
await _o1o;
return { ...r };
},
async remove(table, id) {
const prev = _ot.get(table)?.get(String(id));
if (!prev) return false;
await store.put(table, { ...prev, deleted: 1 });
return true;
},
on(table, _o4) {
if (!_o1t.has(table)) _o1t.set(table, new Set());
_o1t.get(table).add(_o4);
return () => _o1t.get(table).delete(_o4);
},
onStatus(_o4) { _o1q.add(_o4); _o4(store.status()); return () => _o1q.delete(_o4); },
onPull(_o4) { _o1g.add(_o4); return () => _o1g.delete(_o4); },
status() { return { pending: outbox.length, lastSync, online, syncing: !!syncing, error: lastError, backend: store.backend, pull: pullProgress ? { ...pullProgress } : null }; },
pendingOps() {
return compactOutbox(outbox.map((o) => ({ ...o, seqs: [] }))).map((o) => (o.base ? { table: o.table, op: o.op, row: { ...o.row }, base: { ...o.base } } : { table: o.table, op: o.op, row: { ...o.row } }));
},
async requeue(ops) {
let _ox = 0; const _o1o = [];
for (const o of Array.isArray(ops) ? ops : []) {
if (!o || !SYNC_TABLES.includes(o.table) || !o.row || typeof o.row !== 'object' || (o.op !== 'upsert' && o.op !== 'delete')) continue;
const id = o.row[pk(o.table)];
if (id == null || id === '') continue;
const cur = _ot.get(o.table).get(String(id));
if (cur && /"erased"\s*:\s*1/.test(String(cur.data || ''))) continue;
const row = { ...o.row };
_ot.get(o.table).set(String(id), row);
_o1o.push(_o1h(o.table, o.op, row, cur, false, o.base && typeof o.base === 'object' ? { ...o.base } : null));
_od(o.table, { type: 'put', row: { ...row } });
_ox++;
}
await Promise.all(_o1o);
return _ox;
},
syncNow() {
if (syncing) return syncing;
if (!api || !api.hasValidToken || !api.hasValidToken()) return Promise.resolve(store.status());
syncing = _ob().finally(() => { syncing = null; _oe(); });
_oe();
return syncing;
},
async flush() {
while (writes.size) await Promise.allSettled([...writes]);
},
start() {
store.stop();
timer = setInterval(() => store.syncNow(), intervalMs);
if (typeof window !== 'undefined') { window.addEventListener('online', _o12); window.addEventListener('offline', _o11); window.addEventListener('pagehide', _o10); }
if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('visibilitychange', _o10);
return store.syncNow();
},
stop() {
if (timer) clearInterval(timer); timer = null;
if (typeof window !== 'undefined') { window.removeEventListener('online', _o12); window.removeEventListener('offline', _o11); window.removeEventListener('pagehide', _o10); }
if (typeof document !== 'undefined' && document.removeEventListener) document.removeEventListener('visibilitychange', _o10);
},
async clear() {
store.stop();
for (const _os of _ot.values()) _os.clear();
outbox = []; _o1a.clear(); lastSync = 0; cursor = 0; userId = ''; pageState = null; pullProgress = null;
if (_op) { try { await _op.destroy(); } catch { } }
_op = null; opened = null;
_oe();
},
applyRemote
};
function _o1(table, row, prev) {
if (table === 'settings' || !prev) return null;
const pend = _o1c(table, row);
if (pend && !pend.base) return null;
const base = pend ? { ...pend.base } : {};
for (const k of Object.keys(row)) {
if (k === 'updated_at' || k === 'created_at' || k in base) continue;
if (_oy(prev[k]) !== _oy(row[k])) base[k] = prev[k] === undefined ? null : prev[k];
}
return base;
}
function _o1h(table, op, row, prev, quiet, baseGiven) {
const _of = { table, op, row: { ...row } };
if (quiet) _of.quiet = 1;
const base = baseGiven !== undefined ? baseGiven : _o1(table, row, prev);
if (base) _of.base = base;
outbox.push(_of); _o1a.set(_o1f(table, row), _of);
const _oo = _op;
const _o16 = _oo ? _o1w(_oo.put('_outbox', _of).then((seq) => {
if (_of.seq == null) _of.seq = seq;
if (_of.gone && _of.seq != null) return _oo.del('_outbox', [_of.seq]).catch(() => {});
}).catch((e) => _og('store.outbox', e))) : Promise.resolve();
const _o1m = _o1d(table, row);
_oe();
clearTimeout(soonTimer);
soonTimer = setTimeout(() => store.syncNow(), 1500);
return Promise.all([_o16, _o1m]);
}
async function applyRemote(changes) {
let conflicts = 0;
const _o1b = new Set(outbox.map((o) => o.table + '\u0000' + o.row[pk(o.table)]));
for (const [table, _o1n] of Object.entries(changes || {})) {
const _os = _ot.get(table); if (!_os || !Array.isArray(_o1n)) continue;
const _o1v = [];
for (const remote of _o1n) {
const id = String(remote[pk(table)]);
const local = _os.get(id);
const _o9 = resolveIncoming(local, remote, _o1b.has(table + '\u0000' + id));
if (_o9 === 'keep') continue;
if (_o9 === 'conflict') {
const _ow = outbox.filter((o) => o.table === table && String(o.row[pk(table)]) === id);
if (_ow.length && _ow.every((o) => o.base && o.op === 'upsert') && !Number(remote.deleted) && !remote.hidden) {
const merged = { ...remote };
for (const o of _ow) for (const k of Object.keys(o.base)) merged[k] = o.row[k];
_os.set(id, merged); _o1v.push(merged); _od(table, { type: 'remote', row: { ...merged } });
continue;
}
if (!sameContent(local, remote)) conflicts++;
const _oc = _ow;
outbox = outbox.filter((o) => !_oc.includes(o));
await _oh(_oc);
}
_os.set(id, { ...remote });
_o1v.push(remote);
_od(table, { type: 'remote', row: { ...remote } });
}
if (_op && _o1v.length) await _op.putMany(table, _o1v).catch((e) => _og('store.applyRemote', e));
}
return conflicts;
}
async function _ob() {
const _oi = _oz;
let conflicts = 0;
const _o6 = [];
try {
const _o2 = compactOutbox(outbox.map((o) => ({ ...o, seqs: [o] })));
const rejected = [];
for (const _o19 of chunk(_o2, PUSH_LIMIT)) {
let _o1j;
try { _o1j = await api.call('sync.push', { ops: _o19.map((o) => (o.base ? { table: o.table, op: o.op, row: o.row, base: o.base } : { table: o.table, op: o.op, row: o.row })) }); } catch (e) {
if (e && e.code === 'LICENSE_READONLY') break;
throw e;
}
const results = (_o1j && _o1j.results) || [];
results.forEach((r, _ol) => { if (r && r.conflict && !(_o19[_ol] && (_o19[_ol].quiet || (r.row && sameContent(_o19[_ol].row, r.row))))) conflicts++; });
results.forEach((r) => { if (r && r.ok && Array.isArray(r.fields) && r.fields.length) { conflicts++; if (r.object_id) _o6.push({ object_id: String(r.object_id), event_id: String(r.conflict_event || ''), fields: r.fields }); } });
const _ok = new Set(); results.forEach((r, _ol) => { if (r && r.ok === false && (r.error === 'LICENSE_READONLY' || r.error === 'LICENSE_PACK') && _o19[_ol]) _ok.add(_o19[_ol]); });
results.forEach((r, _ol) => { if (r && r.ok === false && !r.conflict && _o19[_ol] && !_ok.has(_o19[_ol])) rejected.push({ table: _o19[_ol].table, id: String(_o19[_ol].row[pk(_o19[_ol].table)]), name: _o1l(_o19[_ol].row), error: r.error || 'REJECTED' }); });
const done = new Set(_o19.filter((o) => !_ok.has(o)).flatMap((o) => o.seqs));
outbox = outbox.filter((o) => !done.has(o));
await _oh([...done]);
for (const r of results) {
if (!r || r.updated_at == null) continue;
const op = _o19.find((o) => String(o.row[pk(o.table)]) === String(r.id));
if (!op) continue;
const cur = _ot.get(op.table).get(String(r.id));
const _o1r = !!_o1c(op.table, op.row);
if (cur && !r.conflict && (Number(cur.updated_at) === Number(op.row.updated_at) || !_o1r)) {
if (r.row && typeof r.row === 'object') {
const nr = { ...r.row, updated_at: Number(r.updated_at) };
_ot.get(op.table).set(String(r.id), nr); _o1d(op.table, nr); _od(op.table, { type: 'remote', row: { ...nr } });
} else { cur.updated_at = Number(r.updated_at); _o1d(op.table, cur); }
} else if (cur && !r.conflict && r.ok !== false) {
const _o3 = Number(cur.updated_at) <= Number(r.updated_at);
if (_o3) cur.updated_at = Number(r.updated_at) + 1;
for (const o of outbox) {
if (o.table !== op.table || String(o.row[pk(o.table)]) !== String(r.id)) continue;
if (_o3) o.row.updated_at = cur.updated_at;
if (o.base) for (const k of Object.keys(o.base)) { const _o1p = r.row || op.row; o.base[k] = _o1p[k] === undefined ? null : _o1p[k]; }
if (r.row && o.base) for (const k of Object.keys(r.row)) if (k !== 'updated_at' && !(k in o.base)) { o.row[k] = r.row[k]; cur[k] = r.row[k]; }
if (_op && o.seq != null) _o1w(_op.put('_outbox', o).catch(() => {}));
}
_o1d(op.table, cur);
}
}
}
if (rejected.length) await _o1k(rejected);
const pull = !cursor || pageState ? await _o18((_ox) => { conflicts += _ox; }) : await api.call('sync.pull', { since: cursor, tables: SYNC_TABLES });
if (!pull.__paged) conflicts += await applyRemote(pull && pull.changes);
if (pull && Array.isArray(pull.cheers) && pull.cheers.length) for (const _o4 of _o1g) { try { _o4({ cheers: pull.cheers }); } catch { } }
cursor = Number(pull && pull.now) || Date.now();
lastSync = Number(pull && pull.server_time) || cursor;
if (_op) await _op.putMany('_meta', [{ k: 'cursor', v: cursor }, { k: 'lastSync', v: lastSync }]).catch(() => {});
if (_oi === _oz) online = true;
lastError = null;
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
return store.status();
}
async function _o18(addConflicts) {
let st = pageState && typeof pageState === 'object' ? { ...pageState } : { after: null, now: 0, server_time: 0, done: 0, total: 0 };
for (let _oj = 0; _oj < 100000; _oj++) {
pullProgress = { done: Number(st.done) || 0, total: Number(st.total) || 0 }; _oe();
const _o1e = await api.call('sync.pull', { since: 0, tables: SYNC_TABLES, page: st.after ? { after: st.after } : true, limit: PULL_PAGE_ROWS });
addConflicts(await applyRemote(_o1e && _o1e.changes));
if (_o1e && Array.isArray(_o1e.cheers) && _o1e.cheers.length) for (const _o4 of _o1g) { try { _o4({ cheers: _o1e.cheers }); } catch { } }
if (!st.now) { st.now = Number(_o1e && _o1e.now) || Date.now(); st.server_time = Number(_o1e && _o1e.server_time) || st.now; }
const page = _o1e && _o1e.page;
if (!page || !page.next) break;
st = { ...st, after: page.next, done: Number(page.done) || 0, total: Number(page.total) || 0 };
pageState = st;
if (_op) await _op.put('_meta', { k: 'pullPage', v: st }).catch(() => {});
}
pageState = null; pullProgress = null;
if (_op) await _op.del('_meta', ['pullPage']).catch(() => {});
return { __paged: true, now: st.now, server_time: st.server_time };
}
async function _oh(entries) {
const seqs = [];
for (const o of entries) { o.gone = true; if (o.seq != null) seqs.push(o.seq); }
if (_op && seqs.length) await _op.del('_outbox', seqs).catch(() => {});
}
async function _o1k(rejected) {
const tables = new Set();
for (const { table, id, error } of rejected) {
const _os = _ot.get(table); if (!_os) continue;
tables.add(table);
const local = _os.get(id);
if (!local) continue;
_os.delete(id);
if (_op) await _op.del(table, [id]).catch(() => {});
_od(table, { type: 'remote', row: { ...local, deleted: 1 }, rejected: error || 'REJECTED' });
}
const _o1y = [...tables].filter((_o1u) => SYNC_TABLES.includes(_o1u));
if (!_o1y.length) return;
const pull = await api.call('sync.pull', { since: 0, tables: _o1y });
const _o5 = (pull && pull.changes) || {};
const ids = new Set(rejected.map((r) => r.table + '\u0000' + r.id));
const _o13 = {};
for (const _o1u of _o1y) _o13[_o1u] = (_o5[_o1u] || []).filter((r) => ids.has(_o1u + '\u0000' + String(r[pk(_o1u)])));
await applyRemote(_o13);
}
function _o12() { online = true; _oe(); store.syncNow(); }
function _o11() { online = false; _oz++; _oe(); }
return store;
}
export default createStore;

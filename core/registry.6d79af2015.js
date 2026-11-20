export const SCREENS = ['home', 'customers', 'sales', 'content', 'inbox', 'settings'];
export const SELFTEST_TIMEOUT = 3000;
export function withTimeout(promise, ms, label = 'timeout') {
let _of;
return Promise.race([
Promise.resolve(promise).finally(() => clearTimeout(_of)),
new Promise((_, rej) => { _of = setTimeout(() => rej(Object.assign(new Error(label + ' ' + ms + 'ms'), { code: 'TIMEOUT' })), ms); })
]);
}
export function normalizeManifest(id, manifest, meta = {}) {
const m = { ...meta, ...(manifest || {}) };
const screen = SCREENS.includes(m.screen) ? m.screen : (SCREENS.includes(meta.screen) ? meta.screen : 'home');
const status = m.status === 'building' ? 'building' : (m.status === 'ready' ? 'ready' : (manifest ? 'ready' : 'building'));
return {
id: m.id || id,
title: m.title || id,
icon: m.icon || '✦',
screen,
order: Number.isFinite(Number(m.order)) ? Number(m.order) : 100,
version: m.version || '0.0.0',
status,
progress: Math.max(0, Math.min(100, Number(m.progress) || 0)),
eta: m.eta || '',
help: m.help || '',
desc: m.desc || m.subtitle || '',
requires: typeof m.requires === 'string' ? m.requires : '',
hidden: m.hidden === true,
company: m.company === true
};
}
export function allowedBy(manifest, perms) {
const _ob = manifest && manifest.requires;
if (!_ob) return true;
if (!perms) return true;
return !!perms[_ob];
}
export function computeState(manifest, { loadError, selftest } = {}) {
if (loadError) return 'error';
if (manifest.status === 'building') return 'building';
if (selftest && selftest.ok === false) return 'error';
return 'ready';
}
export function byScreen(entries, screen) {
return entries.filter((e) => e.manifest.screen === screen)
.sort((a, b) => a.manifest.order - b.manifest.order || String(a.manifest.title).localeCompare(String(b.manifest.title), 'vi'));
}
export function movedHash(_o9, entry) {
const _og = entry && entry.manifest && entry.manifest.screen;
if (!_o9 || !_o9.module || !_og || !SCREENS.includes(_og) || _og === _o9.screen) return '';
const q = _o9.query ? _o9.query.toString() : '';
return '#/' + _og + '/' + encodeURIComponent(_o9.module) + (_o9.sub ? '/' + _o9.sub : '') + (q ? '?' + q : '');
}
export function packModules(_o8) {
const meta = (_o8 && _o8.meta) || {};
return ((_o8 && _o8.modules) || []).map((m) => (typeof m === 'string' ? { id: m, meta: meta[m] || {} } : { id: m.id, meta: { ...(meta[m.id] || {}), ...m } }))
.filter((m) => m.id && /^[a-z0-9_-]+$/i.test(m.id));
}
export function stateWords(state) {
if (state === 'off') return { badge: 'module.off', lead: 'module.off.lead', progress: false };
if (state === 'error') return { badge: 'module.error', lead: 'module.error.lead', progress: false };
return { badge: 'module.building', lead: 'module.building.lead', progress: true };
}
export function selftestCtx(ctx) { return Object.assign({}, ctx, { users: null, selftest: true }); }
export function createRegistry({ base = './packs/bds/', report = () => {}, importer, timeout = SELFTEST_TIMEOUT } = {}) {
const entries = [];
const _od = new Set();
const _o3 = importer || ((_oi) => import(_oi));
let _o8 = null;
let _o1 = () => true;
const _o5 = new Map();
const _o7 = (id, meta) => ({ id, meta, manifest: normalizeManifest(id, null, meta), mod: null, state: 'off', reason: 'pack-off', selftest: null });
async function _o4(id, meta, ctxFor) {
const entry = { id, meta, manifest: normalizeManifest(id, null, meta), mod: null, state: 'building', reason: '', selftest: null };
try {
const _oi = new URL(base + id + '/index.js', document.baseURI).href;
const _o6 = await _o3(_oi);
const mod = _o6 && (_o6.default || _o6);
if (!mod || typeof mod.mount !== 'function') throw new Error('module thiếu mount()');
entry.mod = mod;
entry.manifest = normalizeManifest(id, mod.manifest || {}, meta);
entry.manifest.id = id;
} catch (e) {
entry.reason = 'import: ' + (e && e.message || e);
entry.state = 'error';
report('warn', 'registry.import:' + id, String(e && e.message || e), e && e.stack);
return entry;
}
if (entry.manifest.status !== 'building' && typeof entry.mod.selftest === 'function') {
const _oe = Date.now();
try {
const _oc = await withTimeout(entry.mod.selftest(selftestCtx(ctxFor ? ctxFor(entry) : {})), timeout, 'selftest');
entry.selftest = { ok: !(_oc && _oc.ok === false), details: _oc && _oc.details, ms: Date.now() - _oe };
} catch (e) {
if (e && e.code === 'TIMEOUT') entry.selftest = { ok: true, slow: true, details: 'Kiểm tra chậm hơn ' + Math.round(timeout / 1000) + ' giây – bỏ qua', ms: Date.now() - _oe };
else entry.selftest = { ok: false, details: String(e && e.message || e), ms: Date.now() - _oe };
}
if (!entry.selftest.ok || entry.selftest.slow) report('warn', 'registry.selftest:' + id, entry.selftest.slow ? 'selftest chậm' : 'selftest không đạt', JSON.stringify(entry.selftest.details || '').slice(0, 500));
}
entry.state = computeState(entry.manifest, { selftest: entry.selftest });
if (entry.state === 'error' && !entry.reason) entry.reason = 'selftest: ' + JSON.stringify(entry.selftest && entry.selftest.details || '');
return entry;
}
const _oa = {
setGuard(fn) { _o1 = typeof fn === 'function' ? fn : () => true; },
allowed(entry) { return !!entry && (entry.core || _o1(entry)); },
get _o8() { return _o8; },
get entries() { return entries; },
async loadPack() {
const _o9 = await fetch(base + 'pack.json', { cache: 'no-cache' });
if (!_o9.ok) throw new Error('pack.json ' + _o9.status);
_o8 = await _o9.json();
return _o8;
},
async load(ctxFor, { skip } = {}) {
if (!_o8) await _oa.loadPack();
const list = packModules(_o8);
const loaded = await Promise.all(list.map(({ id, meta }) => (skip && skip(id) ? _o7(id, meta) : _o4(id, meta, ctxFor))));
entries.splice(0, entries.length, ...entries.filter((e) => e.core), ...loaded);
_od.forEach((cb) => cb(entries));
return entries;
},
async ensure(ctxFor, { skip } = {}) {
const _oh = entries.filter((e) => e.state === 'off' && !e.core && !(skip && skip(e.id)));
if (!_oh.length) return 0;
const _o0 = _oh.filter((e) => !_o5.has(e.id));
for (const e of _o0) {
_o5.set(e.id, _o4(e.id, e.meta || {}, ctxFor).then((n) => {
const _o2 = entries.findIndex((x) => x.id === n.id); if (_o2 >= 0 && entries[_o2].state === 'off') entries[_o2] = n;
return n;
}).finally(() => _o5.delete(e.id)));
}
await Promise.all(_oh.map((e) => _o5.get(e.id)).filter(Boolean));
if (_o0.length) _od.forEach((cb) => cb(entries));
return _o0.length;
},
add(entry) {
const e = { state: 'ready', reason: '', selftest: null, core: true, ...entry, manifest: normalizeManifest(entry.id, entry.manifest || entry.mod?.manifest || {}) };
const _o2 = entries.findIndex((x) => x.id === e.id);
if (_o2 >= 0) entries[_o2] = e; else entries.push(e);
return e;
},
get(id) { return entries.find((e) => e.id === id) || null; },
byScreen(screen) { return byScreen(entries.filter((e) => !e.core && _o1(e)), screen); },
on(cb) { _od.add(cb); return () => _od.delete(cb); }
};
return _oa;
}
export default createRegistry;
export function tileModules(mods) {
return (Array.isArray(mods) ? mods : []).filter((e) => !(e && e.manifest && e.manifest.hidden));
}

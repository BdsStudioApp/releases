import { desktopOnlyBlocked } from '../shared/device.js';
export const SCREENS = ['home', 'customers', 'sales', 'content', 'inbox', 'settings'];
export const SELFTEST_TIMEOUT = 3000;
export function withTimeout(promise, ms, label = 'timeout') {
let _ol;
return Promise.race([
Promise.resolve(promise).finally(() => clearTimeout(_ol)),
new Promise((_, rej) => { _ol = setTimeout(() => rej(Object.assign(new Error(label + ' ' + ms + 'ms'), { code: 'TIMEOUT' })), ms); })
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
company: m.company === true,
desktop_only: m.desktop_only === true
};
}
export function allowedBy(manifest, perms) {
const _og = manifest && manifest.requires;
if (!_og) return true;
if (!perms) return true;
return !!perms[_og];
}
export function deviceAllows(manifest, _o2) { return !desktopOnlyBlocked(manifest, _o2); }
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
export function movedHash(_oe, entry) {
const _on = entry && entry.manifest && entry.manifest.screen;
if (!_oe || !_oe.module || !_on || !SCREENS.includes(_on) || _on === _oe.screen) return '';
const q = _oe.query ? _oe.query.toString() : '';
return '#/' + _on + '/' + encodeURIComponent(_oe.module) + (_oe.sub ? '/' + _oe.sub : '') + (q ? '?' + q : '');
}
export function aliasHash(_oe, moved, screenOf) {
if (!_oe || !_oe.module || !moved || typeof moved !== 'object' || !Object.prototype.hasOwnProperty.call(moved, _oe.module)) return '';
const [_on, tq] = String(moved[_oe.module] || '').split('?');
if (!/^[a-z0-9_-]+$/i.test(_on || '') || _on === _oe.module) return '';
const screen = typeof screenOf === 'function' ? screenOf(_on) : '';
if (!SCREENS.includes(screen)) return '';
const q = new URLSearchParams(_oe.query ? _oe.query.toString() : '');
for (const [k, v] of new URLSearchParams(tq || '')) q.set(k, v);
const qs = q.toString();
return '#/' + screen + '/' + encodeURIComponent(_on) + (qs ? '?' + qs : '');
}
export function packModules(_od) {
const meta = (_od && _od.meta) || {};
return ((_od && _od.modules) || []).map((m) => (typeof m === 'string' ? { id: m, meta: meta[m] || {} } : { id: m.id, meta: { ...(meta[m.id] || {}), ...m } }))
.filter((m) => m.id && /^[a-z0-9_-]+$/i.test(m.id));
}
export function stateWords(state) {
if (state === 'off') return { badge: 'module.off', lead: 'module.off.lead', progress: false };
if (state === 'error') return { badge: 'module.error', lead: 'module.error.lead', progress: false };
return { badge: 'module.building', lead: 'module.building.lead', progress: true };
}
export function selftestCtx(ctx) { return Object.assign({}, ctx, { users: null, selftest: true }); }
export async function fetchWithin(_o4, url, opts = {}, ms = 20000) {
const _o1 = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _om = _o1 ? setTimeout(() => _o1.abort(), ms) : null;
try { return await _o4(url, _o1 ? { ...opts, signal: _o1.signal } : opts); }
catch (e) { if (_o1 && _o1.signal.aborted) throw Object.assign(new Error('timeout'), { code: 'TIMEOUT' }); throw e; }
finally { if (_om) clearTimeout(_om); }
}
export function createRegistry({ base = './packs/bds/', report = () => {}, importer, timeout = SELFTEST_TIMEOUT, fetchImpl, packTimeoutMs = 20000 } = {}) {
const entries = [];
const _oi = new Set();
const _o8 = importer || ((url) => import(url));
let _od = null;
let _o6 = () => true;
const _oa = new Map();
let _o2 = 'desktop';
const _o3 = (x) => (typeof x === 'string' ? entries.find((e) => e.id === x) || null : x);
const _o0 = (x) => {
const e = _o3(x);
if (e) return !e.core && !deviceAllows(e.manifest, _o2);
const meta = typeof x === 'string' && _od && _od.meta ? _od.meta[x] : null;
return !!meta && !deviceAllows(meta, _o2);
};
const _oc = (id, meta) => ({ id, meta, manifest: normalizeManifest(id, null, meta), mod: null, state: 'off', reason: 'pack-off', selftest: null });
async function _o9(id, meta, ctxFor) {
const entry = { id, meta, manifest: normalizeManifest(id, null, meta), mod: null, state: 'building', reason: '', selftest: null };
try {
const url = new URL(base + id + '/index.js', document.baseURI).href;
const _ob = await _o8(url);
const mod = _ob && (_ob.default || _ob);
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
const _oj = Date.now();
try {
const _oh = await withTimeout(entry.mod.selftest(selftestCtx(ctxFor ? ctxFor(entry) : {})), timeout, 'selftest');
entry.selftest = { ok: !(_oh && _oh.ok === false), details: _oh && _oh.details, ms: Date.now() - _oj };
} catch (e) {
if (e && e.code === 'TIMEOUT') entry.selftest = { ok: true, slow: true, details: 'Kiểm tra chậm hơn ' + Math.round(timeout / 1000) + ' giây – bỏ qua', ms: Date.now() - _oj };
else entry.selftest = { ok: false, details: String(e && e.message || e), ms: Date.now() - _oj };
}
if (!entry.selftest.ok || entry.selftest.slow) report('warn', 'registry.selftest:' + id, entry.selftest.slow ? 'selftest chậm' : 'selftest không đạt', JSON.stringify(entry.selftest.details || '').slice(0, 500));
}
entry.state = computeState(entry.manifest, { selftest: entry.selftest });
if (entry.state === 'error' && !entry.reason) entry.reason = 'selftest: ' + JSON.stringify(entry.selftest && entry.selftest.details || '');
return entry;
}
const _of = {
setGuard(fn) { _o6 = typeof fn === 'function' ? fn : () => true; },
allowed(entry) { return !!entry && (entry.core || (_o6(entry) && !_o0(entry))); },
setDevice(kind) { _o2 = kind === 'mobile' ? 'mobile' : 'desktop'; },
get _o2() { return _o2; },
permitted(entry) { return !!entry && (entry.core || _o6(entry)); },
deviceBlocked(x) { return _o0(x); },
get _od() { return _od; },
get entries() { return entries; },
async loadPack() {
const _o4 = fetchImpl || ((u, o) => globalThis.fetch(u, o));
let _oe;
try { _oe = await fetchWithin(_o4, base + 'pack.json', { cache: 'no-cache' }, packTimeoutMs); } catch (e) {
const _ok = e && e.code === 'TIMEOUT';
throw Object.assign(new Error('Không tải được danh sách chức năng (pack.json)' + (_ok ? ' sau ' + Math.round(packTimeoutMs / 1000) + ' giây' : '') + ' – kiểm tra mạng rồi tải lại trang.'), { code: _ok ? 'TIMEOUT' : 'NETWORK', cause: e });
}
if (!_oe.ok) throw new Error('pack.json ' + _oe.status);
_od = await _oe.json();
return _od;
},
async load(ctxFor, { skip } = {}) {
if (!_od) await _of.loadPack();
const list = packModules(_od);
const loaded = await Promise.all(list.map(({ id, meta }) => (skip && skip(id) ? _oc(id, meta) : _o9(id, meta, ctxFor))));
entries.splice(0, entries.length, ...entries.filter((e) => e.core), ...loaded);
_oi.forEach((cb) => cb(entries));
return entries;
},
async ensure(ctxFor, { skip } = {}) {
const _oo = entries.filter((e) => e.state === 'off' && !e.core && !(skip && skip(e.id)));
if (!_oo.length) return 0;
const _o5 = _oo.filter((e) => !_oa.has(e.id));
for (const e of _o5) {
_oa.set(e.id, _o9(e.id, e.meta || {}, ctxFor).then((n) => {
const _o7 = entries.findIndex((x) => x.id === n.id); if (_o7 >= 0 && entries[_o7].state === 'off') entries[_o7] = n;
return n;
}).finally(() => _oa.delete(e.id)));
}
await Promise.all(_oo.map((e) => _oa.get(e.id)).filter(Boolean));
if (_o5.length) _oi.forEach((cb) => cb(entries));
return _o5.length;
},
add(entry) {
const e = { state: 'ready', reason: '', selftest: null, core: true, ...entry, manifest: normalizeManifest(entry.id, entry.manifest || entry.mod?.manifest || {}) };
const _o7 = entries.findIndex((x) => x.id === e.id);
if (_o7 >= 0) entries[_o7] = e; else entries.push(e);
return e;
},
get(id) { return entries.find((e) => e.id === id) || null; },
byScreen(screen) { return byScreen(entries.filter((e) => !e.core && _o6(e) && !_o0(e)), screen); },
on(cb) { _oi.add(cb); return () => _oi.delete(cb); }
};
return _of;
}
export default createRegistry;
export function tileModules(mods) {
return (Array.isArray(mods) ? mods : []).filter((e) => !(e && e.manifest && e.manifest.hidden));
}

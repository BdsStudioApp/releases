import {
cmpVersion, fetchLatest, engineHealth, publicBase, classifyServerUpdateError, ENABLE_API_STEPS,
serverUpdateButton, engineAutoButton, TEXT as UTXT, silentEngineUpdate
} from './updates.4992b5e758.js';
import { updateHints } from './health_logic.4992b5e758.js';
import { engineDownload } from './engine_dl.18c8a720c5.js';
export { cmpVersion, classifyServerUpdateError, ENABLE_API_STEPS };
export const PART_LABEL = { web: 'Web', engine: 'Máy dựng', gas: 'Máy chủ', landing: 'Landing' };
export const PART_ORDER = ['web', 'gas', 'engine'];
export const SECTION_TITLE = { new: 'Mới', fix: 'Sửa lỗi', change: 'Thay đổi' };
const _o2 = ['new', 'fix', 'change'];
const _o1 = { web: 'info', engine: 'warn', gas: 'ok' };
const LAST_KEY = 'bds:lastVersion';
export function detectUpdates(running, latest) {
const parts = [];
if (latest && running) for (const _ol of PART_ORDER) if (running[_ol] && latest[_ol] && cmpVersion(running[_ol], latest[_ol]) < 0) parts.push(_ol);
if (!latest && running && running.gas && running.web && cmpVersion(running.gas, running.web) < 0) parts.push('gas');
return { parts, any: parts.length > 0 };
}
export function dotHints(state) {
const latest = (state && state.latest) || (state && state.running ? { gas: state.running.web } : {});
return updateHints(state && state.upd && state.upd.parts, state && state.running, latest);
}
export function groupNotes(notes, runningWeb, { upTo } = {}) {
const _o5 = (Array.isArray(notes) ? notes : []).filter((_op) => _op && _op.version && (!upTo || cmpVersion(_op.version, upTo) <= 0));
let _ox = runningWeb ? _o5.filter((_op) => cmpVersion(_op.version, runningWeb) > 0) : [];
if (!_ox.length && _o5.length) _ox = [_o5[0]];
const groups = _o2.map((key) => ({ key, title: SECTION_TITLE[key], items: [] }));
const parts = new Set();
for (const _op of _ox) {
const _o15 = _op.sections && typeof _op.sections === 'object' ? _op.sections : null;
if (_o15) {
for (const key of _o2) for (const _oh of _o15[key] || []) {
const _ot = Array.isArray(_oh.parts) && _oh.parts.length ? _oh.parts : ['web'];
_ot.forEach((x) => parts.add(x));
groups.find((_od) => _od.key === key).items.push({ text: String(_oh.text || ''), parts: _ot.slice(), version: _op.version });
}
} else if (_op.text) {
const _ot = Array.isArray(_op.parts) && _op.parts.length ? _op.parts : ['web'];
_ot.forEach((x) => parts.add(x));
groups[2].items.push({ text: String(_op.text), parts: _ot.slice(), version: _op.version });
}
}
return { versions: _ox.map((_op) => _op.version), groups: groups.filter((_od) => _od.items.length), parts: PART_ORDER.filter((_ol) => parts.has(_ol)) };
}
export const SUMMARY_LABEL = { new: 'Nâng cấp tính năng', change: 'Cải tiến', fix: 'Sửa lỗi' };
const _o4 = ['new', 'change', 'fix'];
const _o3 = 80;
export function noteHead(text) {
let _o14 = String(text || '').replace(/^\s*(\[[^\]]{1,20}\]\s*)+/, '').trim();
const _o8 = _o14.search(/:|\s[–—-]\s|;|\(|\.(\s|$)/);
if (_o8 > 0) _o14 = _o14.slice(0, _o8);
return _o14.replace(/[\s.,]+$/, '').trim();
}
function _oj(_of, max = _o3) {
let out = '';
for (const x of _of) {
const next = out ? out + ', ' + x : x;
if (next.length <= max) { out = next; continue; }
if (!out) { const _o1c = x.slice(0, max - 1); out = (_o1c.includes(' ') ? _o1c.slice(0, _o1c.lastIndexOf(' ')) : _o1c).replace(/[\s,]+$/, ''); }
return out + '…';
}
return out;
}
export function summarizeNotes(notes, runningWeb, opts = {}) {
let _od;
try { _od = groupNotes(Array.isArray(notes) ? notes : [], runningWeb, opts); } catch { _od = { versions: [], groups: [] }; }
const lines = [];
let total = 0;
for (const key of _o4) {
const _oe = _od.groups.find((x) => x.key === key);
if (!_oe || !_oe.items.length) continue;
const _of = [...new Set(_oe.items.map((_oh) => noteHead(_oh.text)).filter(Boolean))];
if (!_of.length) continue;
total += _oe.items.length;
lines.push({ key, label: SUMMARY_LABEL[key], text: _oj(_of), count: _oe.items.length });
}
return { lines, versions: lines.length ? _od.versions : [], total };
}
export function summaryList(h, _o14) {
return h('ul', { class: 'wn-sum', 'data-testid': 'wn-summary' }, _o14.lines.map((l) => h('li', { class: 'wn-sum-line', dataset: { key: l.key }, 'data-testid': 'wn-sum-' + l.key },
h('strong', null, l.label + ': '), l.text)));
}
export function justUpdated(version, _o17 = _oo) {
if (!version) return null;
const _oz = _o17.get(LAST_KEY);
if (_oz === version) return null;
_o17.set(LAST_KEY, version);
if (!_oz) return null;
return cmpVersion(version, _oz) > 0 ? { from: _oz, to: version } : null;
}
const _oo = {
get(_ol) { try { return localStorage.getItem(_ol); } catch { return null; } },
set(_ol, v) { try { localStorage.setItem(_ol, v); } catch { } }
};
export function installWhatsNew({ S, appHooks, ui, config = {}, fetchFn = (...a) => globalThis.fetch(...a), loc = typeof location !== 'undefined' ? location : null }) {
const { h, button, badge, modal } = ui;
const _o10 = publicBase(loc, config);
const _o0 = config.ENGINE_URL || 'http://127.0.0.1:8765';
const _ob = !!_o10;
const state = { latest: null, running: { web: config.APP_VERSION || null, gas: null, engine: null }, upd: { parts: [], any: false }, checked: false };
const _ok = justUpdated(config.APP_VERSION);
appHooks.whatsNew = () => state;
appHooks.openWhatsNew = () => openModal();
appHooks.sectionBadge = (key) => {
if (key !== 'version' || !state.upd.any) return null;
const hint = dotHints(state).join(' · ') || UTXT.stUpdate;
const _o9 = h('span', { class: 'dot-new dot-tap', role: 'button', tabindex: '0', 'data-testid': 'dot-version', title: hint, 'aria-label': hint });
const _os = (e) => { e.preventDefault(); e.stopPropagation(); showDotPop(_o9); };
_o9.addEventListener('click', _os);
_o9.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') _os(e); });
return _o9;
};
appHooks.dotHints = () => dotHints(state);
const check = async () => {
state.latest = await fetchLatest(fetchFn, _o10 ? [_o10 + 'version.json', 'version.json'] : ['version.json'], { allowUnsigned: true });
try { const _o9 = await S.api.call('status'); state.running.gas = (_o9 && _o9.version) || null; } catch { }
if (_ob && !(S.packs && !S.packs.featureOn('engine')) && !(S.video && S.video.engineOff())) { const e = await engineHealth(_o0, fetchFn); state.running.engine = e.running ? e.version : null; }
if (state.running.engine) silentEngineUpdate(_o0, state.latest, state.running.engine, { fetchFn }).catch(() => null);
state.upd = state.latest && state.latest.signed === true ? detectUpdates(state.running, state.latest) : { parts: [], any: false };
state.checked = true;
_ou();
if (_ok && state.latest && !state.justShown) { state.justShown = true; _o16(); }
if (typeof appHooks.onVersions === 'function') { try { appHooks.onVersions(state, { justUpdated: _ok }); } catch { } }
};
setTimeout(() => { check().catch(() => null); }, 800);
function _ou() {
const _og = dotHints(state);
const _oq = document.querySelector('[data-testid="nav-settings"]');
if (_oq) {
_oq.classList.toggle('has-dot', state.upd.any);
if (state.upd.any) { _oq.title = _og.join(' · '); _oq.dataset.hint = _og.join(' · '); } else { _oq.removeAttribute('title'); delete _oq.dataset.hint; }
}
const _o18 = document.querySelector('#set-version > summary');
const _or = _o18 && _o18.querySelector('.dot-new');
if (_or) _or.remove();
if (_o18 && state.upd.any) { const _o9 = appHooks.sectionBadge('version'); _o18.insertBefore(_o9, _o18.querySelector('.set-chev')); }
onRoute(S.route || { screen: 'home' });
}
function showDotPop(anchor) {
document.querySelectorAll('.dot-pop').forEach((x) => x.remove());
const lines = dotHints(state);
const _oy = h('div', { class: 'dot-pop', role: 'dialog', 'aria-label': 'Phần cần cập nhật', 'data-testid': 'dot-pop' },
h('ul', { class: 'dot-pop-list' }, (lines.length ? lines : [UTXT.stUpdate]).map((x) => h('li', null, x))),
button('Xem & cập nhật', () => { _o6(); openModal(); }, { kind: 'primary', small: true, testid: 'dot-pop-open' }));
document.body.appendChild(_oy);
const _o11 = anchor.getBoundingClientRect();
const _o1c = Math.min(300, window.innerWidth - 24);
_oy.style.width = _o1c + 'px';
_oy.style.left = Math.max(12, Math.min(window.innerWidth - _o1c - 12, _o11.left + _o11.width / 2 - _o1c / 2)) + 'px';
_oy.style.top = (_o11.bottom + 8) + 'px';
const onDoc = (e) => { if (!_oy.contains(e.target)) _o6(); };
const onKey = (e) => { if (e.key === 'Escape') _o6(); };
function _o6() { _oy.remove(); document.removeEventListener('click', onDoc, true); document.removeEventListener('keydown', onKey, true); }
setTimeout(() => { document.addEventListener('click', onDoc, true); document.addEventListener('keydown', onKey, true); }, 0);
return _oy;
}
function onRoute(_o11) {
if (!state.upd.any || !_o11 || _o11.screen !== 'home' || _o11.module) return;
const _o1b = document.getElementById('view');
if (!_o1b || _o1b.querySelector('[data-testid="whatsnew-card"]')) return;
_o1b.insertBefore(card(), _o1b.children[1] || null);
}
S.routeSubs.add(onRoute);
function card() {
const _o14 = summarizeNotes(state.latest && state.latest.notes, state.running.web);
const ver = (state.latest && state.latest.web) || '';
const _ow = state.upd.parts.map((_ot) => PART_LABEL[_ot]).join(', ');
const kinds = _o14.lines.map((l, i) => (i ? l.label.toLowerCase() : l.label)).join(', ');
return h('section', { class: 'card whatsnew-card', 'data-testid': 'whatsnew-card' },
h('div', { class: 'whatsnew-row' },
h('span', { class: 'whatsnew-ico', 'aria-hidden': 'true' }, ui.icon('sparkle', 22)),
h('div', { class: 'row-text' },
h('strong', null, 'Có bản mới' + (ver && cmpVersion(state.running.web, ver) < 0 ? ' v' + ver : '')),
h('span', { class: 'muted small', 'data-testid': 'whatsnew-card-sum' }, 'Cần cập nhật: ' + _ow + (kinds ? ' · ' + kinds : ''))),
button('Xem thay đổi', () => openModal(), { kind: 'primary', icon: 'next', testid: 'whatsnew-open' })));
}
function _o7(notes, from, opts) {
const _o14 = summarizeNotes(notes, from, opts);
if (!_o14.lines.length) return null;
const _od = groupNotes(notes, from, opts);
return [summaryList(h, _o14), h('details', { class: 'wn-more', 'data-testid': 'wn-more' }, h('summary', null, 'Xem chi tiết'), _oi(_od.groups))];
}
function _oi(groups) {
return groups.map((_oe) => h('div', { class: 'wn-group', dataset: { group: _oe.key }, 'data-testid': 'wn-group-' + _oe.key },
h('h3', { class: 'wn-title' }, _oe.title),
h('ul', { class: 'wn-items' }, _oe.items.map((_oh) => h('li', { class: 'wn-item' },
h('span', { class: 'wn-tags' }, _oh.parts.map((_ot) => h('span', { class: 'badge badge-' + (_o1[_ot] || 'neutral') + ' wn-tag', dataset: { part: _ot } }, PART_LABEL[_ot] || _ot))),
h('span', { class: 'wn-text' }, _oh.text))))));
}
async function _o1a() {
try {
const _o12 = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
if (_o12) {
await _o12.update().catch(() => null);
const _o1c = _o12.installing;
if (_o1c) await new Promise((res) => { const _o19 = setTimeout(res, 10000); _o1c.addEventListener('statechange', () => { if (_o1c.state === 'installed' || _o1c.state === 'activated') { clearTimeout(_o19); res(); } }); });
}
} catch { }
await appHooks.applyUpdate();
}
function _ov(part) {
const has = state.upd.parts.includes(part);
const _om = !!(state.running[part] && state.latest && state.latest[part]);
const _o17 = has ? badge(UTXT.stUpdate, 'warn') : _om ? badge(UTXT.stLatest, 'ok') : badge(UTXT.stUnknown, 'neutral');
const _o13 = state.running[part] ? 'v' + state.running[part] : '—';
const _on = state.latest && state.latest[part] ? 'v' + state.latest[part] : '—';
let actions = [];
let _oc = null;
if (part === 'web') {
actions = [button('Cập nhật ngay', () => _o1a(), { kind: has ? 'primary' : 'secondary', icon: 'refresh', testid: 'wn-update-web' })];
} else if (part === 'engine') {
const a = engineAutoButton(ui, { base: _o0, fetchFn, kind: has ? 'primary' : 'secondary', onDone: (_o1c) => { if (_o1c && _o1c.ok && typeof appHooks.afterUpdate === 'function') appHooks.afterUpdate('engine'); } });
const _oa = engineDownload(typeof navigator !== 'undefined' ? navigator : null, _o10);
actions = [a.btn, state.running.engine ? null : h('a', { class: 'btn btn-ghost', href: _oa.primary.href, download: _oa.primary.file, rel: 'noopener', 'data-testid': 'wn-engine-installer', 'data-os': _oa.primary.os }, h('span', null, 'Tải bộ cài máy dựng – ' + _oa.primary.label + ' (cài lần đầu)')),
state.running.engine ? null : h('a', { class: 'small', href: _oa.other.href, download: _oa.other.file, rel: 'noopener', 'data-testid': 'wn-engine-installer-other' }, 'Máy ' + _oa.other.label + '?')].filter(Boolean);
_oc = a.out;
} else if (part === 'gas') {
const _od = serverUpdateButton(ui, { api: S.api, dlHref: _o10 + 'downloads/TatCa.gs', versions: () => ({ web: state.running.web, server: state.running.gas, target: state.latest && state.latest.gas, engine: state.running.engine }), onDone: (_o11) => { if (_o11 && _o11.updated && typeof appHooks.afterUpdate === 'function') appHooks.afterUpdate('gas'); } });
actions = [_od.btn]; _oc = _od.out;
}
return h('div', { class: 'wn-part', dataset: { part, state: has ? 'update' : _om ? 'latest' : 'unknown' }, 'data-testid': 'wn-part-' + part },
h('div', { class: 'row-line' }, h('strong', null, PART_LABEL[part]), h('span', { class: 'muted small num' }, _o13 + ' → ' + _on), _o17),
h('div', { class: 'btn-row' }, actions), _oc);
}
function openModal() {
const latest = state.latest || {};
const _od = groupNotes(latest.notes, state.running.web);
const parts = PART_ORDER.filter((_ot) => _od.parts.includes(_ot) || state.upd.parts.includes(_ot));
const body = h('div', { class: 'whatsnew', 'data-testid': 'whatsnew-modal' },
h('p', { class: 'muted small' }, 'Đang chạy v' + (state.running.web || '?') + (latest.web ? ' · bản mới nhất v' + latest.web : '') + (_od.versions.length ? ' · ghi chú ' + _od.versions.map((v) => 'v' + v).join(', ') : '')),
_o7(latest.notes, state.running.web) || h('p', { class: 'muted' }, 'Chưa có ghi chú cho bản này.'),
parts.length ? h('div', { class: 'wn-parts' }, h('h3', { class: 'wn-title' }, 'Cập nhật'), parts.map(_ov)) : null);
return modal({ title: 'Có gì mới', body, wide: true, actions: [{ label: 'Đóng', kind: 'secondary' }] });
}
function _o16() {
modal({
title: 'Đã cập nhật lên ' + _ok.to,
body: h('div', { class: 'whatsnew', 'data-testid': 'just-updated' },
h('p', { class: 'muted small' }, 'Từ v' + _ok.from + ' lên v' + _ok.to),
_o7(state.latest.notes, _ok.from, { upTo: _ok.to })),
actions: [{ label: 'Đã hiểu', kind: 'primary' }]
});
}
return { state, check, openModal, onRoute, showDotPop };
}
export default { detectUpdates, dotHints, groupNotes, summarizeNotes, summaryList, noteHead, SUMMARY_LABEL, justUpdated, installWhatsNew, PART_LABEL, SECTION_TITLE };

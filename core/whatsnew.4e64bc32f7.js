import {
cmpVersion, fetchLatest, engineHealth, publicBase, classifyServerUpdateError, ENABLE_API_STEPS,
serverUpdateButton, engineAutoButton, TEXT as UTXT, silentEngineUpdate
} from './updates.9704b81308.js';
import { updateHints } from './health_logic.9704b81308.js';
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
if (latest && running) for (const _oe of PART_ORDER) if (running[_oe] && latest[_oe] && cmpVersion(running[_oe], latest[_oe]) < 0) parts.push(_oe);
if (!latest && running && running.gas && running.web && cmpVersion(running.gas, running.web) < 0) parts.push('gas');
return { parts, any: parts.length > 0 };
}
export function dotHints(state) {
const latest = (state && state.latest) || (state && state.running ? { gas: state.running.web } : {});
return updateHints(state && state.upd && state.upd.parts, state && state.running, latest);
}
export function groupNotes(notes, runningWeb, { upTo } = {}) {
const _o3 = (Array.isArray(notes) ? notes : []).filter((_oi) => _oi && _oi.version && (!upTo || cmpVersion(_oi.version, upTo) <= 0));
let _oq = runningWeb ? _o3.filter((_oi) => cmpVersion(_oi.version, runningWeb) > 0) : [];
if (!_oq.length && _o3.length) _oq = [_o3[0]];
const groups = _o2.map((key) => ({ key, title: SECTION_TITLE[key], items: [] }));
const parts = new Set();
for (const _oi of _oq) {
const _ox = _oi.sections && typeof _oi.sections === 'object' ? _oi.sections : null;
if (_ox) {
for (const key of _o2) for (const _ob of _ox[key] || []) {
const _om = Array.isArray(_ob.parts) && _ob.parts.length ? _ob.parts : ['web'];
_om.forEach((x) => parts.add(x));
groups.find((_o9) => _o9.key === key).items.push({ text: String(_ob.text || ''), parts: _om.slice(), version: _oi.version });
}
} else if (_oi.text) {
const _om = Array.isArray(_oi.parts) && _oi.parts.length ? _oi.parts : ['web'];
_om.forEach((x) => parts.add(x));
groups[2].items.push({ text: String(_oi.text), parts: _om.slice(), version: _oi.version });
}
}
return { versions: _oq.map((_oi) => _oi.version), groups: groups.filter((_o9) => _o9.items.length), parts: PART_ORDER.filter((_oe) => parts.has(_oe)) };
}
export function justUpdated(version, _oz = _oh) {
if (!version) return null;
const _os = _oz.get(LAST_KEY);
if (_os === version) return null;
_oz.set(LAST_KEY, version);
if (!_os) return null;
return cmpVersion(version, _os) > 0 ? { from: _os, to: version } : null;
}
const _oh = {
get(_oe) { try { return localStorage.getItem(_oe); } catch { return null; } },
set(_oe, v) { try { localStorage.setItem(_oe, v); } catch { } }
};
export function installWhatsNew({ S, appHooks, ui, config = {}, fetchFn = (...a) => globalThis.fetch(...a), loc = typeof location !== 'undefined' ? location : null }) {
const { h, button, badge, modal } = ui;
const _ot = publicBase(loc, config);
const _o0 = config.ENGINE_URL || 'http://127.0.0.1:8765';
const _o7 = !!_ot;
const state = { latest: null, running: { web: config.APP_VERSION || null, gas: null, engine: null }, upd: { parts: [], any: false }, checked: false };
const _od = justUpdated(config.APP_VERSION);
appHooks.whatsNew = () => state;
appHooks.openWhatsNew = () => openModal();
appHooks.sectionBadge = (key) => {
if (key !== 'version' || !state.upd.any) return null;
const hint = dotHints(state).join(' · ') || UTXT.stUpdate;
const _o5 = h('span', { class: 'dot-new dot-tap', role: 'button', tabindex: '0', 'data-testid': 'dot-version', title: hint, 'aria-label': hint });
const _ol = (e) => { e.preventDefault(); e.stopPropagation(); showDotPop(_o5); };
_o5.addEventListener('click', _ol);
_o5.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') _ol(e); });
return _o5;
};
appHooks.dotHints = () => dotHints(state);
const check = async () => {
state.latest = await fetchLatest(fetchFn, _ot ? [_ot + 'version.json', 'version.json'] : ['version.json'], { allowUnsigned: true });
try { const _o5 = await S.api.call('status'); state.running.gas = (_o5 && _o5.version) || null; } catch { }
if (_o7 && !(S.packs && !S.packs.featureOn('engine')) && !(S.video && S.video.engineOff())) { const e = await engineHealth(_o0, fetchFn); state.running.engine = e.running ? e.version : null; }
if (state.running.engine) silentEngineUpdate(_o0, state.latest, state.running.engine, { fetchFn }).catch(() => null);
state.upd = state.latest && state.latest.signed === true ? detectUpdates(state.running, state.latest) : { parts: [], any: false };
state.checked = true;
_on();
if (_od && state.latest && !state.justShown) { state.justShown = true; _oy(); }
if (typeof appHooks.onVersions === 'function') { try { appHooks.onVersions(state, { justUpdated: _od }); } catch { } }
};
setTimeout(() => { check().catch(() => null); }, 800);
function _on() {
const _oa = dotHints(state);
const _oj = document.querySelector('[data-testid="nav-settings"]');
if (_oj) {
_oj.classList.toggle('has-dot', state.upd.any);
if (state.upd.any) { _oj.title = _oa.join(' · '); _oj.dataset.hint = _oa.join(' · '); } else { _oj.removeAttribute('title'); delete _oj.dataset.hint; }
}
const _o10 = document.querySelector('#set-version > summary');
const _ok = _o10 && _o10.querySelector('.dot-new');
if (_ok) _ok.remove();
if (_o10 && state.upd.any) { const _o5 = appHooks.sectionBadge('version'); _o10.insertBefore(_o5, _o10.querySelector('.set-chev')); }
onRoute(S.route || { screen: 'home' });
}
function showDotPop(anchor) {
document.querySelectorAll('.dot-pop').forEach((x) => x.remove());
const lines = dotHints(state);
const _or = h('div', { class: 'dot-pop', role: 'dialog', 'aria-label': 'Phần cần cập nhật', 'data-testid': 'dot-pop' },
h('ul', { class: 'dot-pop-list' }, (lines.length ? lines : [UTXT.stUpdate]).map((x) => h('li', null, x))),
button('Xem & cập nhật', () => { _o4(); openModal(); }, { kind: 'primary', small: true, testid: 'dot-pop-open' }));
document.body.appendChild(_or);
const _ou = anchor.getBoundingClientRect();
const _o14 = Math.min(300, window.innerWidth - 24);
_or.style.width = _o14 + 'px';
_or.style.left = Math.max(12, Math.min(window.innerWidth - _o14 - 12, _ou.left + _ou.width / 2 - _o14 / 2)) + 'px';
_or.style.top = (_ou.bottom + 8) + 'px';
const onDoc = (e) => { if (!_or.contains(e.target)) _o4(); };
const onKey = (e) => { if (e.key === 'Escape') _o4(); };
function _o4() { _or.remove(); document.removeEventListener('click', onDoc, true); document.removeEventListener('keydown', onKey, true); }
setTimeout(() => { document.addEventListener('click', onDoc, true); document.addEventListener('keydown', onKey, true); }, 0);
return _or;
}
function onRoute(_ou) {
if (!state.upd.any || !_ou || _ou.screen !== 'home' || _ou.module) return;
const _o13 = document.getElementById('view');
if (!_o13 || _o13.querySelector('[data-testid="whatsnew-card"]')) return;
_o13.insertBefore(card(), _o13.children[1] || null);
}
S.routeSubs.add(onRoute);
function card() {
const _o9 = groupNotes(state.latest && state.latest.notes, state.running.web);
const ver = (state.latest && state.latest.web) || '';
const _op = state.upd.parts.map((_om) => PART_LABEL[_om]).join(', ');
return h('section', { class: 'card whatsnew-card', 'data-testid': 'whatsnew-card' },
h('div', { class: 'whatsnew-row' },
h('span', { class: 'whatsnew-ico', 'aria-hidden': 'true' }, ui.icon('sparkle', 22)),
h('div', { class: 'row-text' },
h('strong', null, 'Có bản mới' + (ver && cmpVersion(state.running.web, ver) < 0 ? ' v' + ver : '')),
h('span', { class: 'muted small' }, 'Cần cập nhật: ' + _op + (_o9.groups.length ? ' · ' + _o9.groups.reduce((_oi, x) => _oi + x.items.length, 0) + ' thay đổi' : ''))),
button('Xem thay đổi', () => openModal(), { kind: 'primary', icon: 'next', testid: 'whatsnew-open' })));
}
function _oc(groups) {
return groups.map((gr) => h('div', { class: 'wn-group', dataset: { group: gr.key }, 'data-testid': 'wn-group-' + gr.key },
h('h3', { class: 'wn-title' }, gr.title),
h('ul', { class: 'wn-items' }, gr.items.map((_ob) => h('li', { class: 'wn-item' },
h('span', { class: 'wn-tags' }, _ob.parts.map((_om) => h('span', { class: 'badge badge-' + (_o1[_om] || 'neutral') + ' wn-tag', dataset: { part: _om } }, PART_LABEL[_om] || _om))),
h('span', { class: 'wn-text' }, _ob.text))))));
}
async function _o12() {
try {
const _ov = navigator.serviceWorker && await navigator.serviceWorker.getRegistration();
if (_ov) {
await _ov.update().catch(() => null);
const _o14 = _ov.installing;
if (_o14) await new Promise((res) => { const _o11 = setTimeout(res, 10000); _o14.addEventListener('statechange', () => { if (_o14.state === 'installed' || _o14.state === 'activated') { clearTimeout(_o11); res(); } }); });
}
} catch { }
await appHooks.applyUpdate();
}
function _oo(part) {
const has = state.upd.parts.includes(part);
const _of = !!(state.running[part] && state.latest && state.latest[part]);
const _oz = has ? badge(UTXT.stUpdate, 'warn') : _of ? badge(UTXT.stLatest, 'ok') : badge(UTXT.stUnknown, 'neutral');
const _ow = state.running[part] ? 'v' + state.running[part] : '—';
const _og = state.latest && state.latest[part] ? 'v' + state.latest[part] : '—';
let actions = [];
let _o8 = null;
if (part === 'web') {
actions = [button('Cập nhật ngay', () => _o12(), { kind: has ? 'primary' : 'secondary', icon: 'refresh', testid: 'wn-update-web' })];
} else if (part === 'engine') {
const a = engineAutoButton(ui, { base: _o0, fetchFn, kind: has ? 'primary' : 'secondary', onDone: (_o14) => { if (_o14 && _o14.ok && typeof appHooks.afterUpdate === 'function') appHooks.afterUpdate('engine'); } });
const _o6 = engineDownload(typeof navigator !== 'undefined' ? navigator : null, _ot);
actions = [a.btn, state.running.engine ? null : h('a', { class: 'btn btn-ghost', href: _o6.primary.href, download: _o6.primary.file, rel: 'noopener', 'data-testid': 'wn-engine-installer', 'data-os': _o6.primary.os }, h('span', null, 'Tải bộ cài máy dựng – ' + _o6.primary.label + ' (cài lần đầu)')),
state.running.engine ? null : h('a', { class: 'small', href: _o6.other.href, download: _o6.other.file, rel: 'noopener', 'data-testid': 'wn-engine-installer-other' }, 'Máy ' + _o6.other.label + '?')].filter(Boolean);
_o8 = a.out;
} else if (part === 'gas') {
const _o9 = serverUpdateButton(ui, { api: S.api, dlHref: _ot + 'downloads/TatCa.gs', versions: () => ({ web: state.running.web, server: state.running.gas, target: state.latest && state.latest.gas, engine: state.running.engine }), onDone: (_ou) => { if (_ou && _ou.updated && typeof appHooks.afterUpdate === 'function') appHooks.afterUpdate('gas'); } });
actions = [_o9.btn]; _o8 = _o9.out;
}
return h('div', { class: 'wn-part', dataset: { part, state: has ? 'update' : _of ? 'latest' : 'unknown' }, 'data-testid': 'wn-part-' + part },
h('div', { class: 'row-line' }, h('strong', null, PART_LABEL[part]), h('span', { class: 'muted small num' }, _ow + ' → ' + _og), _oz),
h('div', { class: 'btn-row' }, actions), _o8);
}
function openModal() {
const latest = state.latest || {};
const _o9 = groupNotes(latest.notes, state.running.web);
const parts = PART_ORDER.filter((_om) => _o9.parts.includes(_om) || state.upd.parts.includes(_om));
const body = h('div', { class: 'whatsnew', 'data-testid': 'whatsnew-modal' },
h('p', { class: 'muted small' }, 'Đang chạy v' + (state.running.web || '?') + (latest.web ? ' · bản mới nhất v' + latest.web : '') + (_o9.versions.length ? ' · ghi chú ' + _o9.versions.map((v) => 'v' + v).join(', ') : '')),
_o9.groups.length ? _oc(_o9.groups) : h('p', { class: 'muted' }, 'Chưa có ghi chú cho bản này.'),
parts.length ? h('div', { class: 'wn-parts' }, h('h3', { class: 'wn-title' }, 'Cập nhật'), parts.map(_oo)) : null);
return modal({ title: 'Có gì mới', body, wide: true, actions: [{ label: 'Đóng', kind: 'secondary' }] });
}
function _oy() {
const _o9 = groupNotes(state.latest.notes, _od.from, { upTo: _od.to });
const _oi = _o9.groups.reduce((a, x) => a + x.items.length, 0);
modal({
title: 'Đã cập nhật lên ' + _od.to,
body: h('div', { class: 'whatsnew', 'data-testid': 'just-updated' },
h('p', { class: 'muted small' }, 'Từ v' + _od.from + ' lên v' + _od.to + (_oi ? ' · ' + _oi + ' thay đổi' : '')),
_o9.groups.length ? _oc(_o9.groups) : null),
actions: [{ label: 'Đã hiểu', kind: 'primary' }]
});
}
return { state, check, openModal, onRoute, showDotPop };
}
export default { detectUpdates, dotHints, groupNotes, justUpdated, installWhatsNew, PART_LABEL, SECTION_TITLE };

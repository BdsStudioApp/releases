import { serverSelfUpdate, techDetails, supportButton, manualUpdateBlock, publicBase } from './updates.a1be44bf9a.js';
import { needServerUpdate, classifySelfUpdate, needsMigration, MIGRATE, MISSING_ACTION_TEXT, WAIT_OWNER_TEXT } from './health_logic.a1be44bf9a.js';
import { loadLocal, saveLocal } from './connections_logic.5d678ff0de.js';
import { deviceKind } from '../shared/device.js';
import { runFullCheck, TG_SETTING } from './fullcheck.41b5664ebd.js';
const _o5 = 'bds:heal:skip';
const _o0 = 'bds:heal:build';
const _o2 = 'bds:heal:migrate';
const ls = {
get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } },
set(k, _oy) { try { localStorage.setItem(k, JSON.stringify(_oy)); } catch { } }
};
const _o4 = new Set(['server.version', 'server.self_update', 'server.ensure_setup', 'server.rollback', 'system.check', 'connections.disconnect', 'errors.report']);
export function installSelfHeal({ S, appHooks, ui, config = {}, nav = () => {} }) {
const { h, button, toast } = ui;
const state = { updating: false, autoTried: false, missingTried: false, lastError: null, server: null, target: null, need: null, healed: null };
let _op = null;
const _ok = () => deviceKind() === 'mobile';
const engineOn = () => !_ok() && !(S.packs && typeof S.packs.featureOn === 'function' && !S.packs.featureOn('engine')) && !(S.video && S.video.engineOff());
const _og = () => !!(S.user && (S.user.role === 'owner' || S.user.legacy));
const api = () => S.api;
if (S.api) S.api.missingActionText = _og() ? MISSING_ACTION_TEXT : WAIT_OWNER_TEXT;
const _om = S.api && typeof S.api.onMissingAction === 'function' ? S.api.onMissingAction(_oo) : () => {};
const self = { state, updateServer, afterUpdate, healConnections, onVersions, showCard, hideCard, showMigrate, stop };
appHooks.selfHeal = self;
appHooks.afterUpdate = afterUpdate;
appHooks.onVersions = onVersions;
appHooks.runFullCheck = (opts = {}) => runFullCheck({
api: S.api, store: S.store, ai: S.ai, config, swVersion: appHooks.swVersion,
telegram: opts.telegram != null ? opts.telegram : !!(S.settings && S.settings.get(TG_SETTING, false)),
engineOn: engineOn(), videoOff: _ok() || !!(S.video && S.video.engineOff()),
probeLocal: S.video && typeof S.video.online === 'function' && S.video.online() ? false : opts.probeLocal != null ? opts.probeLocal : !opts.auto, auto: !!opts.auto
});
return self;
function stop() { try { _om(); } catch { } }
function showMigrate({ force = false } = {}) {
const snooze = ls.get(_o2);
if (!force && snooze && Date.now() - Number(snooze.at || 0) < 24 * 3600e3) return null;
return showCard('update', { kind: 'old_server', migrate: true, title: MIGRATE.title, cause: MIGRATE.cause, lines: MIGRATE.lines, allow: null, retry: false });
}
async function onVersions(wstate, { justUpdated } = {}) {
if (!_og()) return;
if (justUpdated && !state.webHealed) { state.webHealed = true; afterUpdate('web'); }
if (S.api.mode === 'demo') return;
const server = wstate && wstate.running && wstate.running.gas;
const target = (wstate && wstate.latest && wstate.latest.gas) || null;
let actions = null; let _o10 = server; let _oy = null; let _oz = null;
try { _oy = await S.api.call('server.version'); actions = _oy && Array.isArray(_oy.actions) ? _oy.actions : null; _o10 = (_oy && _oy.version) || server; } catch (e) { _oz = e; }
const _on = _oy ? needsMigration(_oy) : !!(_oz && _oz.code !== 'NETWORK' && _oz.code !== 'AUTH_REQUIRED' && _oz.code !== 'AUTH_INVALID');
Object.assign(state, { server: _o10, target, migrate: _on });
if (_on) { showMigrate(); return; }
const latest = wstate && wstate.latest;
const signedBuild = latest && latest.signed === true ? ((latest.release && latest.release.gas_build_id) || latest.gas_build_id || null) : null;
const build = (_oy && _oy.build_id) || null;
const _ol = needServerUpdate({ server: _o10, target, actions, build, signedBuild });
Object.assign(state, { server: _o10, target, need: _ol });
if (_oy && _oy.needs_setup && !_ol.need) { await _ob(); return; }
if (!_ol.need || state.autoTried) return;
if (_oy && _oy.rollback_hold) return;
const skip = ls.get(_o5);
if (skip && skip.key === _o10 + '>' + target && Date.now() - skip.at < 24 * 3600e3) return;
if (_ol.reason === 'build') {
const _o7 = build + '>' + signedBuild, bt = ls.get(_o0);
if (bt && bt.key === _o7 && Date.now() - Number(bt.at || 0) < 24 * 3600e3) return;
ls.set(_o0, { key: _o7, at: Date.now() });
}
state.autoTried = true;
await updateServer({ auto: true });
}
async function updateServer({ auto = false } = {}) {
if (state.updating) return null;
if (S.api.mode === 'demo') { toast('Chế độ Xem thử: máy chủ giả đi kèm web, không cần cập nhật.', 'info'); return null; }
state.updating = true;
const t = toast('Đang cập nhật máy chủ…', 'info', 600000);
t.setAttribute('data-testid', 'heal-progress');
const _or = (text, kind, ms = 4000) => {
const _ot = t.querySelector('span'); if (_ot) _ot.textContent = text;
t.className = 'toast toast-' + kind + ' in';
setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 260); }, ms);
};
try {
const _oq = await serverSelfUpdate(S.api, {});
state.lastError = null; hideCard('update');
if (_oq && _oq.updated) {
_or('Đang cập nhật máy chủ… xong' + (_oq.to ? ' (v' + _oq.to + ')' : ''), 'ok');
afterUpdate('gas');
} else {
if (state.server && state.target) ls.set(_o5, { key: state.server + '>' + state.target, at: Date.now() });
_or('Máy chủ đã ở bản mới nhất.', 'ok', auto ? 2500 : 4000);
}
return _oq;
} catch (e) {
const c = classifySelfUpdate(e);
state.lastError = { code: c.code, kind: c.kind, step: c.step, message: c.message, at: c.at };
_or(c.toast, 'warn', 7000);
showCard('update', c);
return null;
} finally { state.updating = false; }
}
async function _ob() {
if (state.setupTried) return null; state.setupTried = true;
try { const _oq = await S.api.call('server.ensure_setup'); hideCard('update'); return _oq; } catch (e) {
const c = classifySelfUpdate(e);
if (['scope', 'old_server', 'paste'].includes(c.kind)) showCard('update', c);
return null;
}
}
function _oo(e) {
if (!e || _o4.has(e.action)) return;
if (!_og()) return;
if (S.api.mode === 'demo' || state.missingTried || state.updating) return;
state.missingTried = true;
showCard('update', { kind: 'missing', title: MISSING_ACTION_TEXT, lines: ['App đang tự cập nhật máy chủ, xong sẽ báo.'], allow: null, retry: true });
updateServer({ auto: true });
}
function afterUpdate(part) {
if (_op) { _op.parts.add(part); return _op.p; }
const parts = new Set([part]);
const p = new Promise((res) => setTimeout(res, 300)).then(async () => {
_op = null;
try { if (S.whatsNew && parts.has('gas')) await S.whatsNew.check(); } catch { }
if (!_og()) return null;
const healed = await healConnections().catch(() => null);
let full = null;
try { full = await appHooks.runFullCheck({ auto: true }); } catch { }
if (full && full.summary && full.summary.bad) {
showCard('check', { kind: 'check', title: 'Kiểm tra sau cập nhật: ' + full.summary.bad + ' mục cần sửa', lines: full.items.filter((x) => x.ok === false).slice(0, 3).map((x) => x.label + (x.detail ? ' – ' + x.detail : '')), allow: null, open: 'settings/selftest' });
}
return { parts: [...parts], healed, full };
});
_op = { parts, p };
return p;
}
async function healConnections() {
const ok = []; const failed = [];
try { await S.api.call('status'); ok.push('server'); } catch (e) { failed.push({ id: 'server', name: 'Máy chủ', message: (e && e.userMessage) || 'Không gọi được' }); }
let _ou = null;
try { _ou = await S.api.call('connections.status'); } catch { }
const _os = (_ou && _ou.secrets) || {};
const _o3 = { gemini: 'Gemini', claude: 'Claude API' };
for (const target of ['gemini', 'claude']) {
if (!_os[target + '_key']) continue;
try {
const _o9 = await S.api.call('connections.test', { target });
if (_o9 && _o9.ok) ok.push(target); else failed.push({ id: target, name: _o3[target], message: (_o9 && _o9.message) || 'Kiểm tra chưa đạt' });
} catch (e) { failed.push({ id: target, name: _o3[target], message: (e && e.userMessage) || 'Kiểm tra chưa đạt' }); }
}
const _oi = loadLocal();
const _o1 = config.ENGINE_URL || 'http://127.0.0.1:8765';
if (_oi.engine && _oi.engine.ok && engineOn()) {
let _od = false; let vbee = false;
try {
const _o8 = new AbortController(); const _ow = setTimeout(() => _o8.abort(), 2500);
try { const _oq = await fetch(_o1 + '/health', { signal: _o8.signal }); const _oh = _oq.ok ? await _oq.json() : null; _od = !!_oh; vbee = !!(_oh && _oh.vbee_configured); } finally { clearTimeout(_ow); }
} catch { _od = false; }
saveLocal('engine', { ok: _od, vbee });
if (_od) ok.push('engine'); else failed.push({ id: 'engine', name: 'Máy dựng video', message: 'Chưa gọi được – bật "BDS Studio" trên máy tính' });
}
state.healed = { ok, failed, at: Date.now() };
if (failed.length) showCard('conn', { kind: 'conn', title: 'Sau cập nhật: ' + failed.length + ' kết nối cần xem lại', lines: failed.map((f) => f.name + ': ' + f.message), allow: null, open: 'settings/connection' + (failed[0] && failed[0].id ? '/' + failed[0].id : '') });
else hideCard('conn');
try { window.dispatchEvent(new CustomEvent('bds:connections-healed', { detail: state.healed })); } catch { }
return state.healed;
}
function _oe() {
let _oa = document.getElementById('heal-host');
if (_oa && _oa.isConnected) return _oa;
const _oj = document.querySelector('.app-shell .main');
if (!_oj) return null;
_oa = h('div', { id: 'heal-host', class: 'heal-host', 'aria-live': 'polite' });
const _ox = _oj.querySelector('.topbar');
_oj.insertBefore(_oa, _ox ? _ox.nextSibling : _oj.firstChild);
return _oa;
}
function hideCard(key) { const _oa = document.querySelector('[data-heal="' + key + '"]'); if (_oa) _oa.remove(); }
function showCard(key, c) {
const _of = _oe(); if (!_of) return null;
hideCard(key);
const _o6 = [];
if (c.allow && c.allow.url) _o6.push(h('a', { class: 'btn btn-primary', href: c.allow.url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'heal-allow' }, h('span', null, c.allow.label || 'Cho phép')));
if (key === 'update' && c.retry) _o6.push(button('Thử lại', () => updateServer({ auto: false }), { kind: c.allow ? 'secondary' : 'primary', icon: 'refresh', testid: 'heal-retry' }));
if (c.kind === 'old_server' || c.kind === 'paste') _o6.push(button('Xem cách làm', () => nav('settings/version'), { kind: 'secondary', icon: 'help', testid: 'heal-howto' }));
if (c.open) _o6.push(button(c.kind === 'conn' ? 'Mở Kết nối' : 'Xem chi tiết', () => nav(c.open), { kind: 'primary', icon: 'next', testid: 'heal-open' }));
const _ov = key === 'update' && !!c.code && typeof c.message === 'string';
const _oc = (_ov || c.migrate) && !['signature', 'forbidden', 'smoke', 'drive'].includes(c.kind);
if (_ov) _o6.push(supportButton(ui, c, { versions: () => ({ web: config.APP_VERSION, server: state.server, target: state.target }), testid: 'heal-support', kind: c.support ? 'primary' : 'secondary' }));
_o6.push(button('Để sau', () => { hideCard(key); if (c.migrate) ls.set(_o2, { at: Date.now() }); }, { kind: 'ghost', icon: 'clock', testid: 'heal-close' }));
let dlHref = 'downloads/TatCa.gs';
try { dlHref = publicBase(location, config) + 'downloads/TatCa.gs'; } catch { }
const _oa = h('section', { class: 'card heal-card', role: 'status', dataset: { heal: key, kind: c.kind || '', migrate: c.migrate ? '1' : '' }, 'data-testid': 'heal-card-' + key },
h('div', { class: 'heal-head' }, h('span', { class: 'heal-ico', 'aria-hidden': 'true' }, ui.icon(c.kind === 'conn' || c.kind === 'check' ? 'pulse' : 'refresh', 20)), h('strong', null, c.title)),
c.cause ? h('p', { class: 'small heal-cause', 'data-testid': 'heal-cause' }, c.cause) : null,
(c.lines || []).filter(Boolean).slice(0, 3).map((x) => h('p', { class: 'small heal-line' }, x)),
h('div', { class: 'btn-row' }, _o6),
_oc ? manualUpdateBlock(ui, { dlHref, testid: 'heal-manual', open: !!c.legacy || !!c.migrate || c.kind === 'paste' }) : null,
_ov ? techDetails(ui, c, { testid: 'heal-tech' }) : null);
_of.appendChild(_oa);
return _oa;
}
}
export default { installSelfHeal };

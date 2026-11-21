import { serverSelfUpdate, techDetails, supportButton, manualUpdateBlock, publicBase } from './updates.4992b5e758.js';
import { needServerUpdate, classifySelfUpdate, needsMigration, MIGRATE, MISSING_ACTION_TEXT, WAIT_OWNER_TEXT } from './health_logic.4992b5e758.js';
import { loadLocal, saveLocal } from './connections_logic.5d678ff0de.js';
import { deviceKind } from '../shared/device.js';
import { runFullCheck, TG_SETTING } from './fullcheck.58325e141a.js';
const _o4 = 'bds:heal:skip';
const _o1 = 'bds:heal:migrate';
const ls = {
get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } },
set(k, _ow) { try { localStorage.setItem(k, JSON.stringify(_ow)); } catch { } }
};
const _o3 = new Set(['server.version', 'server.self_update', 'server.ensure_setup', 'server.rollback', 'system.check', 'connections.disconnect', 'errors.report']);
export function installSelfHeal({ S, appHooks, ui, config = {}, nav = () => {} }) {
const { h, button, toast } = ui;
const state = { updating: false, autoTried: false, missingTried: false, lastError: null, server: null, target: null, need: null, healed: null };
let _on = null;
const _oi = () => deviceKind() === 'mobile';
const engineOn = () => !_oi() && !(S.packs && typeof S.packs.featureOn === 'function' && !S.packs.featureOn('engine')) && !(S.video && S.video.engineOff());
const _oe = () => !!(S.user && (S.user.role === 'owner' || S.user.legacy));
const api = () => S.api;
if (S.api) S.api.missingActionText = _oe() ? MISSING_ACTION_TEXT : WAIT_OWNER_TEXT;
const _ok = S.api && typeof S.api.onMissingAction === 'function' ? S.api.onMissingAction(_om) : () => {};
const self = { state, updateServer, afterUpdate, healConnections, onVersions, showCard, hideCard, showMigrate, stop };
appHooks.selfHeal = self;
appHooks.afterUpdate = afterUpdate;
appHooks.onVersions = onVersions;
appHooks.runFullCheck = (opts = {}) => runFullCheck({
api: S.api, store: S.store, ai: S.ai, config, swVersion: appHooks.swVersion,
telegram: opts.telegram != null ? opts.telegram : !!(S.settings && S.settings.get(TG_SETTING, false)),
engineOn: engineOn(), videoOff: _oi() || !!(S.video && S.video.engineOff()),
probeLocal: S.video && typeof S.video.online === 'function' && S.video.online() ? false : opts.probeLocal != null ? opts.probeLocal : !opts.auto, auto: !!opts.auto
});
return self;
function stop() { try { _ok(); } catch { } }
function showMigrate({ force = false } = {}) {
const snooze = ls.get(_o1);
if (!force && snooze && Date.now() - Number(snooze.at || 0) < 24 * 3600e3) return null;
return showCard('update', { kind: 'old_server', migrate: true, title: MIGRATE.title, cause: MIGRATE.cause, lines: MIGRATE.lines, allow: null, retry: false });
}
async function onVersions(wstate, { justUpdated } = {}) {
if (!_oe()) return;
if (justUpdated && !state.webHealed) { state.webHealed = true; afterUpdate('web'); }
if (S.api.mode === 'demo') return;
const server = wstate && wstate.running && wstate.running.gas;
const target = (wstate && wstate.latest && wstate.latest.gas) || null;
let actions = null; let _oy = server; let _ow = null; let _ox = null;
try { _ow = await S.api.call('server.version'); actions = _ow && Array.isArray(_ow.actions) ? _ow.actions : null; _oy = (_ow && _ow.version) || server; } catch (e) { _ox = e; }
const _ol = _ow ? needsMigration(_ow) : !!(_ox && _ox.code !== 'NETWORK' && _ox.code !== 'AUTH_REQUIRED' && _ox.code !== 'AUTH_INVALID');
Object.assign(state, { server: _oy, target, migrate: _ol });
if (_ol) { showMigrate(); return; }
const _oj = needServerUpdate({ server: _oy, target, actions });
Object.assign(state, { server: _oy, target, need: _oj });
if (_ow && _ow.needs_setup && !_oj.need) { await _o9(); return; }
if (!_oj.need || state.autoTried) return;
if (_ow && _ow.rollback_hold) return;
const skip = ls.get(_o4);
if (skip && skip.key === _oy + '>' + target && Date.now() - skip.at < 24 * 3600e3) return;
state.autoTried = true;
await updateServer({ auto: true });
}
async function updateServer({ auto = false } = {}) {
if (state.updating) return null;
if (S.api.mode === 'demo') { toast('Chế độ Xem thử: máy chủ giả đi kèm web, không cần cập nhật.', 'info'); return null; }
state.updating = true;
const t = toast('Đang cập nhật máy chủ…', 'info', 600000);
t.setAttribute('data-testid', 'heal-progress');
const _op = (text, kind, ms = 4000) => {
const _or = t.querySelector('span'); if (_or) _or.textContent = text;
t.className = 'toast toast-' + kind + ' in';
setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 260); }, ms);
};
try {
const _oo = await serverSelfUpdate(S.api, {});
state.lastError = null; hideCard('update');
if (_oo && _oo.updated) {
_op('Đang cập nhật máy chủ… xong' + (_oo.to ? ' (v' + _oo.to + ')' : ''), 'ok');
afterUpdate('gas');
} else {
if (state.server && state.target) ls.set(_o4, { key: state.server + '>' + state.target, at: Date.now() });
_op('Máy chủ đã ở bản mới nhất.', 'ok', auto ? 2500 : 4000);
}
return _oo;
} catch (e) {
const c = classifySelfUpdate(e);
state.lastError = { code: c.code, kind: c.kind, step: c.step, message: c.message, at: c.at };
_op(c.toast, 'warn', 7000);
showCard('update', c);
return null;
} finally { state.updating = false; }
}
async function _o9() {
if (state.setupTried) return null; state.setupTried = true;
try { const _oo = await S.api.call('server.ensure_setup'); hideCard('update'); return _oo; } catch (e) {
const c = classifySelfUpdate(e);
if (['scope', 'old_server', 'paste'].includes(c.kind)) showCard('update', c);
return null;
}
}
function _om(e) {
if (!e || _o3.has(e.action)) return;
if (!_oe()) return;
if (S.api.mode === 'demo' || state.missingTried || state.updating) return;
state.missingTried = true;
showCard('update', { kind: 'missing', title: MISSING_ACTION_TEXT, lines: ['App đang tự cập nhật máy chủ, xong sẽ báo.'], allow: null, retry: true });
updateServer({ auto: true });
}
function afterUpdate(part) {
if (_on) { _on.parts.add(part); return _on.p; }
const parts = new Set([part]);
const p = new Promise((res) => setTimeout(res, 300)).then(async () => {
_on = null;
try { if (S.whatsNew && parts.has('gas')) await S.whatsNew.check(); } catch { }
if (!_oe()) return null;
const healed = await healConnections().catch(() => null);
let full = null;
try { full = await appHooks.runFullCheck({ auto: true }); } catch { }
if (full && full.summary && full.summary.bad) {
showCard('check', { kind: 'check', title: 'Kiểm tra sau cập nhật: ' + full.summary.bad + ' mục cần sửa', lines: full.items.filter((x) => x.ok === false).slice(0, 3).map((x) => x.label + (x.detail ? ' – ' + x.detail : '')), allow: null, open: 'settings/selftest' });
}
return { parts: [...parts], healed, full };
});
_on = { parts, p };
return p;
}
async function healConnections() {
const ok = []; const failed = [];
try { await S.api.call('status'); ok.push('server'); } catch (e) { failed.push({ id: 'server', name: 'Máy chủ', message: (e && e.userMessage) || 'Không gọi được' }); }
let _os = null;
try { _os = await S.api.call('connections.status'); } catch { }
const _oq = (_os && _os.secrets) || {};
const _o2 = { gemini: 'Gemini', claude: 'Claude API' };
for (const target of ['gemini', 'claude']) {
if (!_oq[target + '_key']) continue;
try {
const _o7 = await S.api.call('connections.test', { target });
if (_o7 && _o7.ok) ok.push(target); else failed.push({ id: target, name: _o2[target], message: (_o7 && _o7.message) || 'Kiểm tra chưa đạt' });
} catch (e) { failed.push({ id: target, name: _o2[target], message: (e && e.userMessage) || 'Kiểm tra chưa đạt' }); }
}
const _og = loadLocal();
const _o0 = config.ENGINE_URL || 'http://127.0.0.1:8765';
if (_og.engine && _og.engine.ok && engineOn()) {
let _ob = false; let vbee = false;
try {
const _o6 = new AbortController(); const _ou = setTimeout(() => _o6.abort(), 2500);
try { const _oo = await fetch(_o0 + '/health', { signal: _o6.signal }); const _of = _oo.ok ? await _oo.json() : null; _ob = !!_of; vbee = !!(_of && _of.vbee_configured); } finally { clearTimeout(_ou); }
} catch { _ob = false; }
saveLocal('engine', { ok: _ob, vbee });
if (_ob) ok.push('engine'); else failed.push({ id: 'engine', name: 'Máy dựng video', message: 'Chưa gọi được – bật "BDS Studio" trên máy tính' });
}
state.healed = { ok, failed, at: Date.now() };
if (failed.length) showCard('conn', { kind: 'conn', title: 'Sau cập nhật: ' + failed.length + ' kết nối cần xem lại', lines: failed.map((f) => f.name + ': ' + f.message), allow: null, open: 'settings/connection' + (failed[0] && failed[0].id ? '/' + failed[0].id : '') });
else hideCard('conn');
try { window.dispatchEvent(new CustomEvent('bds:connections-healed', { detail: state.healed })); } catch { }
return state.healed;
}
function _oc() {
let _o8 = document.getElementById('heal-host');
if (_o8 && _o8.isConnected) return _o8;
const _oh = document.querySelector('.app-shell .main');
if (!_oh) return null;
_o8 = h('div', { id: 'heal-host', class: 'heal-host', 'aria-live': 'polite' });
const _ov = _oh.querySelector('.topbar');
_oh.insertBefore(_o8, _ov ? _ov.nextSibling : _oh.firstChild);
return _o8;
}
function hideCard(key) { const _o8 = document.querySelector('[data-heal="' + key + '"]'); if (_o8) _o8.remove(); }
function showCard(key, c) {
const _od = _oc(); if (!_od) return null;
hideCard(key);
const _o5 = [];
if (c.allow && c.allow.url) _o5.push(h('a', { class: 'btn btn-primary', href: c.allow.url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'heal-allow' }, h('span', null, c.allow.label || 'Cho phép')));
if (key === 'update' && c.retry) _o5.push(button('Thử lại', () => updateServer({ auto: false }), { kind: c.allow ? 'secondary' : 'primary', icon: 'refresh', testid: 'heal-retry' }));
if (c.kind === 'old_server' || c.kind === 'paste') _o5.push(button('Xem cách làm', () => nav('settings/version'), { kind: 'secondary', icon: 'help', testid: 'heal-howto' }));
if (c.open) _o5.push(button(c.kind === 'conn' ? 'Mở Kết nối' : 'Xem chi tiết', () => nav(c.open), { kind: 'primary', icon: 'next', testid: 'heal-open' }));
const _ot = key === 'update' && !!c.code && typeof c.message === 'string';
const _oa = (_ot || c.migrate) && !['signature', 'forbidden', 'smoke', 'drive'].includes(c.kind);
if (_ot) _o5.push(supportButton(ui, c, { versions: () => ({ web: config.APP_VERSION, server: state.server, target: state.target }), testid: 'heal-support', kind: c.support ? 'primary' : 'secondary' }));
_o5.push(button('Để sau', () => { hideCard(key); if (c.migrate) ls.set(_o1, { at: Date.now() }); }, { kind: 'ghost', icon: 'clock', testid: 'heal-close' }));
let dlHref = 'downloads/TatCa.gs';
try { dlHref = publicBase(location, config) + 'downloads/TatCa.gs'; } catch { }
const _o8 = h('section', { class: 'card heal-card', role: 'status', dataset: { heal: key, kind: c.kind || '', migrate: c.migrate ? '1' : '' }, 'data-testid': 'heal-card-' + key },
h('div', { class: 'heal-head' }, h('span', { class: 'heal-ico', 'aria-hidden': 'true' }, ui.icon(c.kind === 'conn' || c.kind === 'check' ? 'pulse' : 'refresh', 20)), h('strong', null, c.title)),
c.cause ? h('p', { class: 'small heal-cause', 'data-testid': 'heal-cause' }, c.cause) : null,
(c.lines || []).filter(Boolean).slice(0, 3).map((x) => h('p', { class: 'small heal-line' }, x)),
h('div', { class: 'btn-row' }, _o5),
_oa ? manualUpdateBlock(ui, { dlHref, testid: 'heal-manual', open: !!c.legacy || !!c.migrate || c.kind === 'paste' }) : null,
_ot ? techDetails(ui, c, { testid: 'heal-tech' }) : null);
_od.appendChild(_o8);
return _o8;
}
}
export default { installSelfHeal };

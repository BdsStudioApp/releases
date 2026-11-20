import L from './license_logic.9718cd0900.js';
import { setEntitlement, setModuleEntitlement, setBetaGate, packTitle, setPackCardExtra, setPackStates, setPackPrice } from './packs.72ecf0bb56.js';
import { giftBox, giftCardView, giftFor, giftText } from './license_gift.1de00e7454.js';
import { qrElement } from './qr.aa623cdb09.js';
import { ensureCss } from './xkit.e7637ba4a6.js';
import { supportContact, privacyLine } from './instance.087c1b328a.js';
export { supportContact };
const _o1 = 'bds:license';
const _o0 = L.DAY;
export const NO_ACCOUNT_MSG = 'Chưa xác định được tài khoản Google đã cài máy chủ nên chưa bắt đầu dùng thử được. Vào Cài đặt › Thông tin cá nhân, điền email Google của anh/chị ở ô "Email" rồi bấm Lưu (app tự kiểm tra lại); hoặc chạy lại bước cài đặt máy chủ (menu BDS Studio › Cài đặt) và bấm Cho phép khi Google hỏi quyền.';
export const NO_IDENTITY_MSG = 'Máy chủ của anh/chị chưa có quyền xác minh tài khoản Google nên chưa kiểm được bản quyền (dùng thử / mã bản quyền). Mở Apps Script của máy chủ › Cài đặt dự án › tick "Hiển thị tệp kê khai appsscript.json" › dán appsscript.json mới (Trợ lý cài đặt › bước "Tạo máy chủ" › Tải appsscript.json) › Lưu › chạy setup › Cho phép; rồi bấm "Kiểm tra lại ngay".';
export function licensingConfig(config) {
const _oa = (config && (config.licensing || config.LICENSING)) || {};
const _o1j = { enabled: _oa.enabled === true, server_url: String(_oa.server_url || '').trim(), pubkey: String(_oa.pubkey || '').trim() };
_o1j.configured = L.isConfigured(_o1j);
return _o1j;
}
const cache = {
get() { try { return JSON.parse(localStorage.getItem(_o1)) || {}; } catch { return {}; } },
set(_o2e) { try { localStorage.setItem(_o1, JSON.stringify(_o2e)); } catch { } return _o2e; },
patch(p) { return cache.set({ ...cache.get(), ...p }); }
};
export function createLicenseClient({ url, fetchImpl, timeoutMs = 20000 } = {}) {
return {
async call(action, payload = {}) {
if (!url) throw Object.assign(new Error('Chưa cấu hình máy chủ bản quyền.'), { code: 'NO_SERVER' });
const f = fetchImpl || globalThis.fetch.bind(globalThis);
const _of = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _o2b = _of ? setTimeout(() => _of.abort(), timeoutMs) : null;
let _o21;
try {
const r = await f(url, { method: 'POST', redirect: 'follow', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action, payload }), signal: _of ? _of.signal : undefined });
_o21 = JSON.parse(await r.text());
} catch (e) {
throw Object.assign(new Error('Không kết nối được máy chủ bản quyền – app vẫn chạy theo mã bản quyền đã lưu.'), { code: 'NETWORK', cause: e });
} finally { if (_o2b) clearTimeout(_o2b); }
if (_o21 && _o21.ok) return _o21.data;
const _oj = (_o21 && _o21.error) || {};
throw Object.assign(new Error(_oj.message || 'Máy chủ bản quyền báo lỗi.'), { code: _oj.code || 'INTERNAL', userMessage: _oj.message });
}
};
}
function loadVerifier() {
if (globalThis.BDSVerify) return Promise.resolve(globalThis.BDSVerify);
return new Promise((resolve) => {
const _o25 = document.createElement('script');
_o25.src = new URL('../shared/bds_verify.js', import.meta.url).href;
_o25.onload = () => resolve(globalThis.BDSVerify || null);
_o25.onerror = () => resolve(null);
document.head.appendChild(_o25);
});
}
export function installLicense({ S, appHooks, ui, config, nav, onChange } = {}) {
const cfg = licensingConfig(config);
const _o1b = { enabled: false, state: () => null, allows: () => true, refresh: async () => null, check: async () => null, stop() {} };
if (!cfg.enabled) return _o1b;
ensureCss(new URL('./license.f32a7d8d2f.css', import.meta.url).href, 'bds-license-css');
const _oc = createLicenseClient({ url: cfg.server_url });
const _ow = () => !S.user || !S.user.role || S.user.role === 'owner';
let info = cache.get().info || null;
let status = cache.get().status || null;
let verifier = globalThis.BDSVerify || null;
let current = null; let payloads = []; let _o2a = false; let lastErr = '';
const _o13 = new Set();
let skew = Number(cache.get().skew) || 0;
const misconfigured = () => L.isMisconfigured(cfg, info);
function _od() {
const r = L.clientState({ cfg, info, status, verifier, now: L.serverNow(skew) });
payloads = r.payloads;
return r.state;
}
function apply() {
const _o1q = current && JSON.stringify([current.mode, current.readonly, current.model]);
current = _od();
document.documentElement.dataset.license = current ? current.mode : 'off';
const _o1s = current && !current.misconfigured && current.mode !== 'unconfigured' ? L.normPackStates((info && info.pack_states) || {}) : null;
setPackStates(_o1s);
const _o1t = (id) => (_o1s && L.PACK_STATE_IDS.includes(id) ? _o1s[id] : '');
const _o19 = () => L.serverNow(skew);
const _ox = (rec) => !!rec && rec.beta === true && !current.readonly && L.betaKeep(payloads);
const _o9 = (_o25, packId, moduleId, rec) => (_o25 === 'an' ? L.boughtAllowed(current, payloads, _o19(), packId, moduleId)
: (L.betaAllowed(current, payloads, _o19(), packId) && (!moduleId || L.moduleAllowed(current, payloads, moduleId))) || (_o25 === 'dang_ban' && _ox(rec)));
if (current) setEntitlement((packId, rec) => _o1t(packId) ? _o9(_o1t(packId), packId, '', rec) : L.packAllowed(current, payloads, packId) || _ox(rec)); else setEntitlement(null);
if (current) setModuleEntitlement((packId, moduleId, rec) => _o1t(packId) ? _o9(_o1t(packId), packId, moduleId, rec) : L.moduleAllowed(current, payloads, moduleId) || _ox(rec)); else setModuleEntitlement(null);
setPackPrice(current && _o1s ? packPriceText : null);
setBetaGate(current ? (packId) => L.betaAllowed(current, payloads, L.serverNow(skew), packId || '') : null);
setPackCardExtra(current ? packGift : null, current ? [current.mode, current.model, JSON.stringify(_o1m || {}), ...payloads.map((p) => p.id + ':' + p.exp)].join('|') : '');
if (_o1s && Object.values(_o1s).includes('dang_ban')) _o14();
_on();
_o1o();
_o1y();
const now = current && JSON.stringify([current.mode, current.readonly, current.model]);
if (_o1q !== now && typeof onChange === 'function') { try { onChange(); } catch { } }
for (const _ob of _o13) { try { _ob(current); } catch { } }
}
let _o11 = 0;
function _o1w() {
const msg = L.readonlyHint({ owner: _ow() });
if (Date.now() - _o11 > 4000) { _o11 = Date.now(); try { ui.toast(msg, 'warn', 6000); } catch { } }
return Object.assign(new Error(msg), { code: 'LICENSE_READONLY', userMessage: msg });
}
function _on() {
const st = S.store;
if (!st || st.__licGate) return;
const put = st.put.bind(st);
st.put = async (table, row) => { if (current && current.readonly && !L.isErasureOp(table, row)) throw _o1w(); return put(table, row); };
st.__licGate = true;
}
function _o1o() {
document.querySelectorAll('[data-testid="lic-banner"]').forEach((_o2j) => _o2j.remove());
_o17();
const _o5 = L.bannerFor(current, { owner: _ow(), support: supportContact(config).text, pendingLeads: info && info.pending_leads });
const _o2f = document.getElementById('view');
if (!_o5 || !_o2f || !S.shellReady) return;
const { h, button } = ui;
const _o1e = S.route && S.route.screen === 'settings' && S.route.module === 'license';
const act = _ow() && current.mode !== 'unconfigured' && !_o1e && _o5.action
? button(_o5.action === 'key' ? L.ENTER_KEY_LABEL : 'Gia hạn', () => _or(_o5.action === 'key'), { kind: _o5.tone === 'info' ? 'secondary' : 'primary', small: true, icon: 'key', testid: 'lic-banner-go' }) : null;
const _o1p = current.mode === 'trial' && _ow();
const inner = [h('span', { class: 'card-ico' }, ui.icon(_o5.tone === 'bad' ? 'lock' : 'clock', 20)),
h('div', { class: 'lic-banner-text' },
_o5.title ? h('strong', { 'data-testid': 'lic-banner-title' }, _o5.title) : null,
h('p', { 'data-testid': 'lic-banner-text' }, _o5.text)),
act];
const _oi = h('div', { class: 'lic-banner card lic-' + _o5.tone + (_o5.compact ? ' lic-compact' : '') + (_o1p ? ' lic-has-pill' : ''), role: 'status', 'data-testid': 'lic-banner', dataset: { mode: current.mode, member: _ow() ? '0' : '1' } },
_o1p ? h('button', { type: 'button', class: 'lic-pill', 'data-testid': 'lic-pill', 'aria-expanded': 'false', onclick: (e) => { const _o1g = _oi.classList.toggle('is-open'); e.currentTarget.setAttribute('aria-expanded', String(_o1g)); } },
ui.icon('clock', 16), h('span', null, L.trialPillText(current.days_left)), ui.icon('next', 14, 'lic-pill-chev')) : null,
_o1p ? h('div', { class: 'lic-pill-body' }, ...inner) : inner);
_o2f.insertBefore(_oi, _o2f.firstChild);
}
let _o23 = null;
const _o2 = 'button, [role="button"], a.btn, .fab';
function _o16(_oi) {
if (_oi.closest('[data-testid="lic-banner"], [data-testid="lic-panel"], .nav, nav, .toast')) return;
const text = (_oi.textContent || '').trim(), testid = _oi.getAttribute('data-testid') || '', aria = _oi.getAttribute('aria-label') || _oi.getAttribute('title') || '';
if (!_oi.classList.contains('lic-ro-off') && !L.isWriteControl({ text, testid, aria })) return;
_oi.classList.add('lic-ro-off'); _oi.setAttribute('aria-disabled', 'true');
if (!_oi.dataset.licTitle) { _oi.dataset.licTitle = _oi.getAttribute('title') || '-'; }
_oi.setAttribute('title', L.readonlyHint({ owner: _ow() }));
}
function _o2c() {
document.querySelectorAll('.lic-ro-off').forEach((_oi) => {
_oi.classList.remove('lic-ro-off'); _oi.removeAttribute('aria-disabled');
if (_oi.dataset.licTitle && _oi.dataset.licTitle !== '-') _oi.setAttribute('title', _oi.dataset.licTitle); else _oi.removeAttribute('title');
delete _oi.dataset.licTitle;
});
}
function _o17() {
const _o22 = !!(current && current.readonly);
if (!_o22) { if (_o23) { _o23.disconnect(); _o23 = null; } _o2c(); return; }
const _o24 = document.body;
if (!_o24) return;
_o24.querySelectorAll(_o2).forEach(_o16);
if (!_o23 && typeof MutationObserver !== 'undefined') {
_o23 = new MutationObserver((muts) => {
for (const _o15 of muts) for (const _o18 of _o15.addedNodes) {
if (_o18.nodeType !== 1) continue;
if (_o18.matches && _o18.matches(_o2)) _o16(_o18);
if (_o18.querySelectorAll) _o18.querySelectorAll(_o2).forEach(_o16);
}
});
_o23.observe(_o24, { childList: true, subtree: true });
}
}
const onBlockedClick = (e) => {
const _oi = e.target && e.target.closest ? e.target.closest('.lic-ro-off') : null;
if (!_oi || !(current && current.readonly)) return;
e.preventDefault(); e.stopImmediatePropagation();
_o1w();
};
document.addEventListener('click', onBlockedClick, true);
function _o1y() {
const k = L.reminderKey(current);
if (!k || cache.get().reminded === k || !S.shellReady) return;
cache.patch({ reminded: k });
const _o2h = current.mode === 'trial' ? 'Thời gian dùng thử' : 'Bản quyền';
try { ui.toast(`${_o2h} còn ${current.days_left} ngày (đến ${L.dmy(current.exp)}).` + (_ow() ? ' Gia hạn ở Cài đặt › Bản quyền.' : ' Báo Quản trị gia hạn.'), 'warn', 8000); } catch { }
}
function _or(focusKey = false) {
if (nav) nav('settings/license'); else location.hash = '#/settings/license';
if (focusKey) setTimeout(() => { const _oi = document.getElementById('lic-key-input'); if (_oi) { _oi.scrollIntoView({ block: 'center' }); _oi.focus(); } }, 400);
}
const _o1f = () => _o1o();
S.routeSubs.add(_o1f);
async function refresh() {
try {
const sentAt = Date.now();
const r = await S.api.call('license.get', {});
info = r && typeof r === 'object' ? r : { enabled: false };
const k = L.clockSkew({ serverTime: info.server_time, sentAt, recvAt: Date.now() });
if (k !== null) { skew = k; cache.patch({ skew }); }
} catch (e) {
if (e && (e.code === 'UNKNOWN_ACTION' || e.missingAction)) info = { enabled: false };
}
cache.patch({ info });
apply();
return current;
}
async function _o26(payload) {
info = await S.api.call('license.save', payload);
cache.patch({ info });
apply();
return current;
}
async function check({ force = false, fresh = false } = {}) {
if (!fresh && _ow()) await refresh();
if (!_ow() || !info || info.enabled === false || !info.install_id) return current;
if (misconfigured()) return current;
const _oa = cache.get();
if (!force && _oa.checkedAt && Date.now() - _oa.checkedAt < _o0 && (info.tokens || []).length) return current;
const base = { install_id: info.install_id, app_version: (config && config.APP_VERSION) || '' };
let st;
try {
const _ou = async () => {
let _ov = '';
try { const r = await S.api.call('license.get', { id_token: true }); _ov = (r && r.id_token) || ''; } catch { _ov = ''; }
if (!_ov) throw Object.assign(new Error(NO_IDENTITY_MSG), { code: 'NEED_IDENTITY', userMessage: NO_IDENTITY_MSG });
return _ov;
};
const _ov = await _ou();
try { st = await _oc.call('license.status', { ...base, id_token: _ov }); } catch (e) {
if (e.code !== 'NOT_REGISTERED') throw e;
const _ot = typeof window !== 'undefined' && window.__bds ? window.__bds.licenseHold : null;
if (_ot) { try { await _ot; } catch { } await refresh(); }
if (!info.account_hash) throw Object.assign(new Error(NO_ACCOUNT_MSG), { code: 'NO_ACCOUNT', userMessage: NO_ACCOUNT_MSG });
st = await _oc.call('install.register', { ...base, id_token: _ot ? await _ou() : _ov, account_hash: info.account_hash, edition: info.edition, company: info.company });
}
lastErr = '';
} catch (e) { lastErr = (e && (e.userMessage || e.message)) || 'Lỗi'; cache.patch({ lastErr }); apply(); return current; }
status = st;
cache.patch({ status, checkedAt: Date.now(), lastErr: '' });
await _o26({ tokens: st.tokens || [], revoked: st.revoked || [], model: st.model, synced: true, ...(st.pack_states ? { pack_states: st.pack_states } : {}) });
return current;
}
async function activate(text) {
const key = String(text || '').trim();
if (!key) throw Object.assign(new Error('Gõ hoặc dán mã bản quyền vào ô trước.'), { userMessage: 'Gõ hoặc dán mã bản quyền vào ô trước.' });
const compact = key.replace(/\s+/g, '');
const ok = verifier && cfg.pubkey ? L.verifyToken(compact, { pubKey: cfg.pubkey, installId: info && info.install_id, verifier }) : null;
if (ok) return _o26({ tokens: [compact] });
if (!info || !info.install_id) await refresh();
let _ov = '';
try { const r = await S.api.call('license.get', { id_token: true }); _ov = (r && r.id_token) || ''; } catch { _ov = ''; }
if (!_ov) throw Object.assign(new Error(NO_IDENTITY_MSG), { code: 'NEED_IDENTITY', userMessage: NO_IDENTITY_MSG });
const r = await _oc.call('key.redeem', { install_id: info.install_id, id_token: _ov, key });
if (r.status) { status = r.status; cache.patch({ status }); }
const st = await _o26({ tokens: [r.token], revoked: (r.status && r.status.revoked) || [], synced: true, ...(r.status && r.status.pack_states ? { pack_states: r.status.pack_states } : {}) });
lastRedeem = { again: !!r.again, edition: r.edition, seats: r.seats, perpetual: !!r.perpetual, expires: r.expires };
return st;
}
let lastRedeem = null;
async function redeemGift(code) {
if (!info || !info.install_id) await refresh();
if (!info || !info.install_id) throw Object.assign(new Error(NO_ACCOUNT_MSG), { code: 'NO_ACCOUNT', userMessage: NO_ACCOUNT_MSG });
let _ov = '';
try { const r = await S.api.call('license.get', { id_token: true }); _ov = (r && r.id_token) || ''; } catch { _ov = ''; }
if (!_ov) throw Object.assign(new Error(NO_IDENTITY_MSG), { code: 'NEED_IDENTITY', userMessage: NO_IDENTITY_MSG });
const r = await _oc.call('gift.redeem', { install_id: info.install_id, id_token: _ov, code });
if (r.status) { status = r.status; cache.patch({ status }); }
await _o26({ tokens: [r.token], revoked: (r.status && r.status.revoked) || [], synced: true, ...(r.status && r.status.pack_states ? { pack_states: r.status.pack_states } : {}) });
return r;
}
function packGift(def, { st, redraw } = {}) {
if (!current) return null;
const _o2e = giftCardView({ state: current, payloads, def, st, owner: _ow(), now: L.serverNow(skew) });
if (!_o2e.show) return null;
return giftBox(ui, { testid: 'xpack-gift-' + def.id, badge: _o2e.badge, neutral: !!_o2e.exp, formless: !!_o2e.formless,
onRedeem: async (code) => { if (/^BDS[2-9A-HJ-NP-Z]{16}$/.test(code)) { await activate(code); return { licence: true }; } return redeemGift(code); }, onDone: () => { if (typeof redraw === 'function') redraw(); } });
}
let _o1m = null, pricesAt = 0;
function _o14() {
if (!info || !info.install_id || misconfigured() || (pricesAt && Date.now() - pricesAt < _o0)) return;
pricesAt = Date.now();
_oc.call('prices.list', { install_id: info.install_id, edition: info.edition }).then((pl) => {
const _o15 = {};
for (const r of (pl && pl.rows) || []) { const _o2e = Number(r.price); if (r.scope && _o2e > 0 && !(_o15[r.scope] <= _o2e)) _o15[r.scope] = _o2e; }
_o1m = _o15; apply();
}).catch(() => { pricesAt = 0; });
}
function packPriceText(def) {
const _o2e = _o1m && _o1m[def.id];
return _o2e ? 'Giá từ ' + _o2g(_o2e) : '';
}
const _o1x = loadVerifier().then((_o2e) => { verifier = _o2e; apply(); });
apply();
_o1x.then(() => refresh()).then(() => check({ fresh: true })).catch(() => null);
const _o2b = setInterval(() => { if (!_o2a) refresh().then(() => check({ fresh: true })).catch(() => null); }, 6 * 3600000);
const _o1r = appHooks.lateSections;
appHooks.lateSections = (ctx) => [...(typeof _o1r === 'function' ? _o1r(ctx) : []), ['license', 'key', 'Bản quyền', (body) => _o1z(body)]];
const api = {
enabled: true,
state: () => current,
allows: (feature) => !current || !current.readonly || feature === 'view' || feature === 'export' || feature === 'updates',
misconfigured,
refresh, check, activate, redeemGift,
on(_ob) { _o13.add(_ob); return () => _o13.delete(_ob); },
lastRedeem: () => lastRedeem,
stop() { _o2a = true; clearInterval(_o2b); S.routeSubs.delete(_o1f); setEntitlement(null); setModuleEntitlement(null); setBetaGate(null); setPackCardExtra(null); document.removeEventListener('click', onBlockedClick, true); if (_o23) _o23.disconnect(); _o2c(); }
};
window.__bds = { ...(window.__bds || {}), license: api };
return api;
function _o1z(body) {
const { h, button, field, badge, kv, toast, copy } = ui;
const _o7 = h('div', { class: 'lic', 'data-testid': 'lic-panel' });
let _oz = null;
body.appendChild(_o7);
const _o1u = privacyLine(h, { testid: 'lic-privacy', lead: 'Dữ liệu bản quyền và dữ liệu của anh/chị được xử lý theo ', cfg: config });
if (_o1u) body.appendChild(_o1u);
const _o2d = api.on(() => { if (_o7.isConnected) _o1n(); else _o2d(); });
_o1n();
if (_ow()) check({ force: true }).catch(() => null);
function _o1n() {
ui.clear ? ui.clear(_o7) : (_o7.innerHTML = '');
const st = current;
if (!st) {
const demo = S.api && S.api.mode === 'demo';
_o7.appendChild(h('p', { class: 'muted', 'data-testid': 'lic-off', dataset: { demo: demo ? '1' : '0' } }, demo
? 'Đây là bản xem thử chạy ngay trong trình duyệt nên không tính bản quyền – mọi chức năng mở để anh/chị dùng thử. Khi kết nối máy chủ của mình, mục này hiện thời gian dùng thử, cách mua và nhập mã bản quyền.'
: 'Máy chủ đang kết nối không dùng bản quyền – app dùng đầy đủ chức năng.'));
return;
}
if (st.mode === 'unconfigured') {
const sc = supportContact(config);
_o7.appendChild(h('div', { class: 'lic-status card lic-unconfigured', 'data-testid': 'lic-status', dataset: { mode: st.mode } },
h('div', { class: 'lic-head' }, badge(L.MODE_LABEL.unconfigured, L.MODE_TONE.unconfigured)),
h('p', { 'data-testid': 'lic-line' }, L.UNCONFIGURED_TEXT + '. App vẫn dùng đầy đủ chức năng, không bị khoá, dữ liệu giữ nguyên.'),
h('p', { 'data-testid': 'lic-support' }, sc.text ? 'Liên hệ người bán: ' + sc.text + '.' : 'Liên hệ người bán đã cung cấp app cho anh/chị.')));
return;
}
const _oa = cache.get();
const lines = {
trial: `Dùng thử – còn ${st.days_left} ngày (đến ${L.dmy(st.exp)}).` + (status && status.handover_at ? ` ${L.handoverText(status.handover_at, status.trial_days)}` : ''),
active: st.perpetual ? 'Đang dùng – bản quyền vĩnh viễn. Bản cập nhật app, máy chủ và gói luôn miễn phí.' : `Đang dùng – còn ${st.days_left} ngày (hết hạn ${L.dmy(st.exp)}).`,
grace: `Bản quyền hết hạn ngày ${L.dmy(st.exp)} và chưa kiểm tra lại được với máy chủ bản quyền – app vẫn đủ chức năng thêm ${st.grace_left} ngày.`,
readonly: `${st.kind === 'trial' ? L.READONLY_TITLE_TRIAL : L.READONLY_TITLE_KEY} (từ ${L.dmy(st.grace_until)}). Dữ liệu vẫn nguyên: xem, tìm, xuất dữ liệu, xoá dữ liệu khách theo yêu cầu và liên hệ hỗ trợ vẫn được, không giới hạn thời gian. Thêm/sửa, AI, gói mở rộng, Telegram tạm dừng; khách mới từ landing vẫn được lưu. Nhập mã bản quyền là chỉnh sửa lại được ngay.`,
free: 'Hết dùng thử: Gói Cơ bản vẫn dùng miễn phí. Các gói khác cần mua bản quyền.'
};
_o7.appendChild(h('div', { class: 'lic-status card lic-' + st.mode, 'data-testid': 'lic-status', dataset: { mode: st.mode } },
h('div', { class: 'lic-head' }, badge(L.MODE_LABEL[st.mode] || st.mode, L.MODE_TONE[st.mode]), h('strong', { 'data-testid': 'lic-days' }, st.mode === 'grace' ? st.grace_left + ' ngày ân hạn' : st.mode === 'active' && st.perpetual ? 'Vĩnh viễn' : st.mode === 'trial' || st.mode === 'active' ? 'Còn ' + st.days_left + ' ngày' : '')),
h('p', { 'data-testid': 'lic-line' }, lines[st.mode] || ''),
kv([
['Bản', L.EDITIONS[info.edition] || 'Cá nhân'],
st.local ? null : ['Cách bán', L.MODEL_LABEL[st.model] || L.MODEL_LABEL.whole_app],
info.user_limit ? ['Số người dùng tối đa', String(info.user_limit)] : null,
_ow() && info.install_id ? ['Mã cài đặt', h('span', { class: 'lic-copy' }, h('span', { class: 'lic-mono', 'data-testid': 'lic-iid' }, info.install_id),
button('Chép', () => { copy(info.install_id); }, { kind: 'ghost', small: true, icon: 'log', title: 'Chép mã cài đặt', testid: 'lic-iid-copy' }))] : null,
_oa.checkedAt ? ['Kiểm tra lần cuối', new Date(_oa.checkedAt).toLocaleString('vi-VN')] : null
]),
st.local ? h('p', { class: 'muted', 'data-testid': 'lic-local' }, 'Chưa nhận được thông tin từ máy chủ bản quyền – đang tính dùng thử trên máy.') : null,
_oa.lastErr && _ow() ? h('p', { class: 'lic-err', 'data-testid': 'lic-err' }, _oa.lastErr) : null,
st.readonly && info.pending_leads ? h('p', { class: 'lic-leads', 'data-testid': 'lic-leads' }, L.pendingLeadsText(info.pending_leads) + '.') : null,
_ow() && info.install_id ? h('details', { class: 'lic-move', 'data-testid': 'lic-move-help' }, h('summary', null, 'Đổi tài khoản Google / máy chủ mới?'),
h('p', { class: 'muted' }, L.MOVE_HELP)) : null,
_o1l(st)));
if (!_ow()) { _o7.appendChild(h('p', { class: st.readonly ? 'lic-err' : 'muted', 'data-testid': 'lic-member' }, st.readonly ? L.MEMBER_READONLY + '.' : 'Quản trị (Admin) quản lý bản quyền và gia hạn cho cả công ty.')); return; }
_o7.appendChild(h('div', { class: 'btn-row' },
button('Kiểm tra lại ngay', async () => { await check({ force: true }); toast(cache.get().lastErr || 'Đã kiểm tra bản quyền.', cache.get().lastErr ? 'warn' : 'ok'); }, { kind: 'secondary', small: true, icon: 'refresh', testid: 'lic-refresh' })));
if (st.readonly || st.mode === 'trial') { _o7.appendChild(_oy()); _o7.appendChild(_o8(st)); } else { _o7.appendChild(_o8(st)); _o7.appendChild(_oy()); }
if (st.model !== 'whole_app' && _o3()) _o7.appendChild(_op());
_o7.appendChild(_os());
}
function _o1k() { return (S.packs && S.packs.defs && S.packs.defs()) || []; }
function titleOf(id) { const _oh = _o1k().find((_o2j) => _o2j.id === id); return _oh ? packTitle(_oh) : 'Gói ' + id; }
function _o1l(st) {
if (st.model === 'whole_app') return null;
const defs = _o1k();
const owned = new Set(L.packScopes(payloads).map((_o2j) => _o2j.pack));
const ids = defs.length ? defs.filter((_oh) => _oh.kind !== 'core' && (!_oh.hidden || owned.has(_oh.id) || owned.has('all'))).map((_oh) => _oh.id) : [...owned];
if (!ids.length && st.model !== 'core_paid_packs_paid') return null;
const items = L.ownedItems({ state: st, payloads, packIds: ids, now: L.serverNow(skew) });
const list = st.model === 'core_paid_packs_paid' ? items : items.slice(1);
return h('div', { class: 'lic-owned' }, h('h4', null, ui.icon('check', 18), ' Anh/chị đang có'),
h('ul', { class: 'lic-packs', 'data-testid': 'lic-packs' }, list.map((it) => {
const def = defs.find((_oh) => _oh.id === it.id);
const exp = !!(def && def.experimental);
const beta = exp && L.betaAllowed(st, payloads, L.serverNow(skew), it.id);
const _oo = it.owned ? giftFor(payloads, it.id, L.serverNow(skew)) : null;
const text = exp && !it.owned ? (beta ? '🧪 Thử nghiệm – đã mở' : '🧪 Thử nghiệm') : _oo && Number(it.exp) <= _oo.exp ? giftText(_oo) : L.ownedText(it);
return h('li', { dataset: { pack: it.id, on: it.on ? '1' : '0', owned: it.owned ? '1' : '0', perpetual: it.perpetual ? '1' : '0' } },
h('span', null, it.id === 'core' ? 'Gói Cơ bản' : titleOf(it.id)), badge(text, it.owned ? 'ok' : it.on ? 'info' : 'warn'));
})));
}
function _o8(st) {
const _ok = st.model === 'core_paid_packs_paid' && st.mode === 'active' && st.perpetual;
const _o2i = h('section', { class: 'lic-sec', 'data-testid': 'lic-buy' }, h('h4', null, _ok ? 'Mua thêm gói' : st.mode === 'active' ? 'Gia hạn' : 'Mua bản quyền'));
const _o4 = h('div', null, h('p', { class: 'muted' }, 'Đang tải bảng giá…'));
_o2i.appendChild(_o4);
_oc.call('prices.list', { install_id: info.install_id, edition: info.edition }).then((pl) => {
ui.clear(_o4);
const rows = (pl && pl.rows) || [];
if (!rows.length) { _o4.appendChild(h('p', { class: 'muted', 'data-testid': 'lic-noprice' }, 'Người bán chưa đặt giá – liên hệ người bán để mua bản quyền.')); return; }
const model = (pl && pl.model) || st.model;
const _o1h = L.buyOptions({ rows, model, payloads, serverBaseOwned: !!(pl && pl.base_owned), now: L.serverNow(skew), syncOkAt: info.sync_ok_at, titleOf, money: _o2g, packStates: L.normPackStates((pl && pl.pack_states) || info.pack_states) });
const _om = _o1h.find((_o1a) => !_o1a.disabled) || _o1h[0];
const fScope = field({ label: 'Mua', type: 'select', value: _om.scope, options: _o1h.map((_o1a) => ({ value: _o1a.scope, label: _o1a.label + (_o1a.why ? ' – ' + _o1a.why : '') })), id: 'lic-scope' });
[...fScope.input.options].forEach((op, i) => { op.disabled = !!_o1h[i].disabled; });
const _ol = field({ label: 'Thời hạn', type: 'select', id: 'lic-months' });
const note = h('p', { class: 'muted', 'data-testid': 'lic-buy-note' });
const _oq = button('Tạo mã chuyển khoản', async () => {
const _o1a = await _oc.call('order.create', { install_id: info.install_id, scope: fScope.getValue(), months: Number(_ol.getValue()) });
ui.clear(_o1j); _o1j.appendChild(_o1i(_o1a));
if (_o1a && _o1a.order_code && status) {
status.orders = [{ order_code: _o1a.order_code, scope: _o1a.scope, months: _o1a.months, amount: _o1a.amount, created: _o1a.created || Date.now(), paid: 0 }, ...(status.orders || []).filter((_o2j) => _o2j.order_code !== _o1a.order_code)];
const _o1d = _o7.querySelector('[data-testid="lic-history"]'); if (_o1d) _o1d.replaceWith(_os());
}
}, { kind: 'primary', icon: 'wallet', testid: 'lic-order' });
const _og = () => _o1h.find((_o1a) => _o1a.scope === fScope.getValue()) || _om;
const _o27 = () => {
const _o1a = _og();
note.textContent = _o1a.disabled ? (_o1a.why === L.NEEDS_BASE_TEXT ? 'Gói mở rộng chỉ chạy khi đã có Gói Cơ bản – mua Gói Cơ bản trước, rồi mua gói này.' : 'Anh/chị đã có phần này vĩnh viễn.')
: Number(_ol.getValue()) === 0 ? 'Vĩnh viễn: trả 1 lần, dùng ngay khi người bán xác nhận (kể cả đang dùng thử), không hết hạn. Bản cập nhật app, máy chủ và gói luôn miễn phí.'
: L.buyTermNote(st.mode);
_oq.disabled = !!_o1a.disabled;
};
const fill = () => {
ui.clear(_ol.input);
for (const r of _og().rows) _ol.input.appendChild(h('option', { value: String(r.months) }, r.label));
_o27();
};
fScope.input.addEventListener('change', fill); _ol.input.addEventListener('change', _o27); fill();
const _o1j = h('div', { class: 'lic-order' });
const _o1c = _o1h.length > 1 ? h('ul', { class: 'lic-list lic-offers', 'data-testid': 'lic-offers' }, _o1h.map((_o1a) => h('li', { dataset: { scope: _o1a.scope, disabled: _o1a.disabled ? '1' : '0' } },
h('strong', null, _o1a.label), h('span', null, _o1a.rows.map((r) => r.label).join(' · ')), _o1a.why ? badge(_o1a.why, _o1a.why === L.OWNED_TEXT ? 'ok' : 'warn') : null,
_o1a.disabled ? null : button('Chọn', () => { fScope.setValue ? fScope.setValue(_o1a.scope) : (fScope.input.value = _o1a.scope); fill(); }, { kind: 'ghost', small: true, icon: 'check', testid: 'lic-offer-pick' })))) : null;
_o4.append(_o1c || '', h('div', { class: 'grid-2' }, _o1h.length > 1 ? fScope : null, _ol), note, h('div', { class: 'btn-row' }, _oq), _o1j);
}).catch((e) => { ui.clear(_o4); _o4.appendChild(h('p', { class: 'lic-err', 'data-testid': 'lic-buy-err' }, (e && (e.userMessage || e.message)) || 'Không tải được bảng giá.')); });
return _o2i;
}
function _o1i(_o1a) {
const _o2e = L.verifyPay(_o1a && _o1a.pay, { pubKey: cfg.pubkey, payee: config && config.PAYEE_NAME, verifier, now: L.serverNow(skew), installId: info && info.install_id, orderCode: _o1a && _o1a.order_code });
if (!_o2e.ok) {
try { console.warn('BDS bản quyền: chỉ dẫn chuyển khoản không hợp lệ (' + _o2e.reason + ')'); } catch { }
_oc.call('pay.report', { install_id: (info && info.install_id) || '', order_code: String((_o1a && _o1a.order_code) || '').slice(0, 20), reason: _o2e.reason }).catch(() => null);
const bv = L.payBadView(_o2e.reason, { orderCode: (_o1a && _o1a.order_code) || '', amount: (_o1a && _o1a.amount) || 0, support: supportContact(config), money: _o2g });
return h('div', { class: 'lic-qr-bad card', role: 'alert', 'data-testid': 'lic-qr-bad', dataset: { reason: _o2e.reason } },
h('p', { class: 'lic-err' }, h('strong', null, bv.title)), ...bv.lines.map((_o2j) => h('p', { class: 'muted' }, _o2j)));
}
const p = _o2e.pay;
const _o1v = L.vietqr({ bin: p.bank_bin, account: p.account_no, amount: p.amount, memo: p.memo });
const _o6 = p.bank_name ? p.bank_name + ' (' + p.bank_bin + ')' : 'Mã ngân hàng ' + p.bank_bin;
const _oe = (label, val, tid) => h('div', { class: 'lic-copy' }, h('span', null, label + ': '), h('strong', { 'data-testid': tid }, val), button('', () => copy(val), { kind: 'ghost', small: true, icon: 'log', title: 'Chép' }));
return h('div', { class: 'lic-qr card', 'data-testid': 'lic-qr', dataset: { order: p.order_code } },
h('p', { class: 'lic-payee', 'data-testid': 'lic-payee' }, 'Người nhận: ', h('strong', { 'data-testid': 'lic-payee-name' }, p.payee_name)),
h('div', { class: 'lic-qr-img' }, qrElement(_o1v, { scale: 4, border: 3, title: 'Mã VietQR chuyển khoản' })),
h('div', { class: 'lic-qr-info' },
h('p', null, 'Mở app ngân hàng → Quét QR (đã có sẵn số tiền và nội dung).'),
h('div', { class: 'lic-copy' }, h('span', null, 'Ngân hàng: '), h('strong', { 'data-testid': 'lic-bank' }, _o6)),
_oe('Số tài khoản', p.account_no, 'lic-account'),
_oe('Số tiền', _o2g(p.amount), 'lic-amount'),
_oe('Nội dung', p.memo, 'lic-content'),
h('p', { class: 'lic-payee-warn', 'data-testid': 'lic-payee-warn' }, `Chỉ chuyển khi tên người nhận trong app ngân hàng hiện đúng ${p.payee_name}.`),
h('p', { class: 'muted' }, `Mã đơn ${p.order_code}. Người bán xác nhận đã nhận tiền → mã bản quyền tự vào app (bấm "Kiểm tra lại ngay" nếu muốn xem ngay). Ghi đúng nội dung để được xác nhận nhanh.`)));
}
function _oy() {
const f = field({ label: L.ENTER_KEY_LABEL, type: 'text', placeholder: 'BDS-XXXX-XXXX-XXXX-XXXX', id: 'lic-key-input' });
if (f.input) { f.input.setAttribute('autocomplete', 'off'); f.input.setAttribute('autocapitalize', 'characters'); f.input.setAttribute('spellcheck', 'false'); }
const msg = h('div', { class: 'lic-key-msg', 'aria-live': 'polite' });
const _o29 = (_o15) => {
ui.clear(msg);
if (!_o15) return;
if (_o15.ok) { msg.appendChild(h('p', { class: 'lic-okbox', 'data-testid': 'lic-key-ok' }, _o15.text)); return; }
msg.appendChild(h('p', { class: _o15.shared ? 'lic-warnbox' : 'lic-err', role: 'alert', 'data-testid': _o15.shared ? 'lic-key-shared' : 'lic-key-err', dataset: { code: _o15.code || '' } },
_o15.shared ? ui.icon('lock', 18) : null, ' ', _o15.text));
};
_o29(_oz);
const _o28 = h('section', { class: 'lic-sec lic-keybox', 'data-testid': 'lic-key' }, h('h4', null, ui.icon('key', 18), ' ', L.ENTER_KEY_LABEL),
h('p', { class: 'muted' }, 'Mã người bán gửi có dạng BDS-XXXX-XXXX-XXXX-XXXX (không phân biệt chữ hoa/thường, gõ có hay không có dấu gạch đều được). Mỗi mã dùng cho 1 tài khoản.'),
f, msg,
h('div', { class: 'btn-row' }, button('Kích hoạt', async () => {
_oz = null; _o29(null);
let st;
try { st = await activate(f.getValue()); } catch (e) {
_oz = { shared: !!(e && e.code === 'KEY_SHARED'), code: (e && e.code) || '', text: (e && (e.userMessage || e.message)) || 'Chưa kích hoạt được – thử lại.' };
_o29(_oz);
return;
}
f.setValue('');
const _o2j = lastRedeem || {};
const _o12 = st ? `Đã kích hoạt – ${L.MODE_LABEL[st.mode]}${_o2j.perpetual ? ', vĩnh viễn' : st.mode === 'active' ? ', đến ' + L.dmy(st.exp) : ''}${_o2j.edition === 'cong_ty' && _o2j.seats ? ' · ' + _o2j.seats + ' người dùng' : ''}.` : 'Đã lưu mã.';
_oz = { ok: true, text: _o12 };
if (_o7.isConnected) _o1n();
toast(_o12, 'ok');
}, { kind: 'primary', icon: 'key', testid: 'lic-activate' })));
return _o28;
}
function _o3() { const _o1s = L.normPackStates(info && info.pack_states); return !_o1s || Object.values(_o1s).some((_o2j) => _o2j !== 'an'); }
function _op() {
return h('section', { class: 'lic-sec lic-giftbox', 'data-testid': 'lic-gift-sec' }, h('h4', null, '🔑 Mã mở gói'),
giftBox(ui, { testid: 'lic-gift', lead: 'Có mã mở gói (vd MAGOI2026)? Nhập ở đây – gói dùng được ngay; hết hạn thì gói tắt, dữ liệu giữ nguyên.',
onRedeem: (code) => redeemGift(code), onDone: () => { if (_o7.isConnected) _o1n(); } }));
}
function _os() {
const orders = (status && status.orders) || [];
const _o10 = payloads.filter((p) => p.k === 'k').sort((a, _o5) => _o5.iat - a.iat);
const _o28 = h('section', { class: 'lic-sec', 'data-testid': 'lic-history' }, h('h4', null, 'Lịch sử'));
const _o20 = h('div', { class: 'lic-order', 'data-testid': 'lic-reopen' });
if (!orders.length && !_o10.length) { _o28.appendChild(h('p', { class: 'muted' }, 'Chưa có đơn hoặc mã bản quyền nào.')); return _o28; }
if (_o10.length) _o28.appendChild(h('ul', { class: 'lic-list' }, _o10.map((k) => h('li', { 'data-testid': 'lic-key-row' },
h('span', { class: 'lic-mono' }, k.id), h('span', null, L.scopeLabel(k.sc, { model: current && current.model, titleOf }) + ' · cấp ' + L.dmy(k.iat) + (L.isPerpetual(k.exp) ? ' · vĩnh viễn' : ' · hết hạn ' + L.dmy(k.exp)))))));
if (orders.length) _o28.appendChild(h('ul', { class: 'lic-list' }, orders.map((_o1a) => h('li', { 'data-testid': 'lic-order-row', dataset: { paid: _o1a.paid ? '1' : '0' } },
h('span', { class: 'lic-mono' }, _o1a.order_code), h('span', null, `${_o1a.scope ? L.scopeLabel(_o1a.scope, { model: current && current.model, titleOf }) + ' · ' : ''}${L.termLabel(_o1a.months)} · ${_o2g(_o1a.amount)} · ${L.dmy(_o1a.created)}`),
badge(_o1a.paid ? (_o1a.key_id ? 'Đã nhận tiền – mã bản quyền đã vào app' : 'Đã nhận tiền') : 'Chờ chuyển khoản', _o1a.paid ? 'ok' : 'warn'),
_o1a.paid ? null : button('Xem mã QR', async () => {
const r = await _oc.call('order.pay', { install_id: info.install_id, order_code: _o1a.order_code });
ui.clear(_o20); _o20.appendChild(_o1i(r)); _o20.scrollIntoView({ block: 'nearest' });
}, { kind: 'ghost', small: true, icon: 'eye', testid: 'lic-order-reopen' })))));
_o28.appendChild(_o20);
return _o28;
}
}
}
function _o2g(_o18) { return (Number(_o18) || 0).toLocaleString('vi-VN') + ' đ'; }
export default installLicense;

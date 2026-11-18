import L from './license_logic.16b4f5bd9e.js';
import { setEntitlement, setBetaGate, packTitle, setPackCardExtra } from './packs.603a1dc003.js';
import { giftBox, giftCardView, giftFor, giftText } from './license_gift.6db30f0360.js';
import { qrElement } from './qr.aa623cdb09.js';
import { ensureCss } from './xkit.f03faf0986.js';
import { supportContact, privacyLine } from './instance.0601c79adf.js';
export { supportContact };
const _o1 = 'bds:license';
const _o0 = L.DAY;
export const NO_ACCOUNT_MSG = 'Chưa xác định được tài khoản Google đã cài máy chủ nên chưa bắt đầu dùng thử được. Vào Cài đặt › Thông tin cá nhân, điền email Google của anh/chị ở ô "Email" rồi bấm Lưu (app tự kiểm tra lại); hoặc chạy lại bước cài đặt máy chủ (menu BDS Studio › Cài đặt) và bấm Cho phép khi Google hỏi quyền.';
export const NO_IDENTITY_MSG = 'Máy chủ của anh/chị chưa có quyền xác minh tài khoản Google nên chưa bắt đầu dùng thử được. Mở Apps Script của máy chủ › Cài đặt dự án › tick "Hiển thị tệp kê khai appsscript.json" › dán appsscript.json mới (Trợ lý cài đặt › bước "Tạo máy chủ" › Tải appsscript.json) › Lưu › chạy setup › Cho phép; rồi bấm "Kiểm tra lại ngay".';
export function licensingConfig(config) {
const _o9 = (config && (config.licensing || config.LICENSING)) || {};
const _o1f = { enabled: _o9.enabled === true, server_url: String(_o9.server_url || '').trim(), pubkey: String(_o9.pubkey || '').trim() };
_o1f.configured = L.isConfigured(_o1f);
return _o1f;
}
const cache = {
get() { try { return JSON.parse(localStorage.getItem(_o1)) || {}; } catch { return {}; } },
set(_o27) { try { localStorage.setItem(_o1, JSON.stringify(_o27)); } catch { } return _o27; },
patch(p) { return cache.set({ ...cache.get(), ...p }); }
};
export function createLicenseClient({ url, fetchImpl, timeoutMs = 20000 } = {}) {
return {
async call(action, payload = {}) {
if (!url) throw Object.assign(new Error('Chưa cấu hình máy chủ bản quyền.'), { code: 'NO_SERVER' });
const f = fetchImpl || globalThis.fetch.bind(globalThis);
const _oe = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _o24 = _oe ? setTimeout(() => _oe.abort(), timeoutMs) : null;
let _o1u;
try {
const r = await f(url, { method: 'POST', redirect: 'follow', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action, payload }), signal: _oe ? _oe.signal : undefined });
_o1u = JSON.parse(await r.text());
} catch (e) {
throw Object.assign(new Error('Không kết nối được máy chủ bản quyền – app vẫn chạy theo mã bản quyền đã lưu.'), { code: 'NETWORK', cause: e });
} finally { if (_o24) clearTimeout(_o24); }
if (_o1u && _o1u.ok) return _o1u.data;
const _oi = (_o1u && _o1u.error) || {};
throw Object.assign(new Error(_oi.message || 'Máy chủ bản quyền báo lỗi.'), { code: _oi.code || 'INTERNAL', userMessage: _oi.message });
}
};
}
function loadVerifier() {
if (globalThis.BDSVerify) return Promise.resolve(globalThis.BDSVerify);
return new Promise((resolve) => {
const _o1y = document.createElement('script');
_o1y.src = new URL('../shared/bds_verify.js', import.meta.url).href;
_o1y.onload = () => resolve(globalThis.BDSVerify || null);
_o1y.onerror = () => resolve(null);
document.head.appendChild(_o1y);
});
}
export function installLicense({ S, appHooks, ui, config, nav, onChange } = {}) {
const cfg = licensingConfig(config);
const _o17 = { enabled: false, state: () => null, allows: () => true, refresh: async () => null, check: async () => null, stop() {} };
if (!cfg.enabled) return _o17;
ensureCss(new URL('./license.f32a7d8d2f.css', import.meta.url).href, 'bds-license-css');
const _ob = createLicenseClient({ url: cfg.server_url });
const _ov = () => !S.user || !S.user.role || S.user.role === 'owner';
let info = cache.get().info || null;
let status = cache.get().status || null;
let verifier = globalThis.BDSVerify || null;
let current = null; let payloads = []; let _o23 = false; let lastErr = '';
const _o11 = new Set();
let skew = Number(cache.get().skew) || 0;
const misconfigured = () => L.isMisconfigured(cfg, info);
function _oc() {
const r = L.clientState({ cfg, info, status, verifier, now: L.serverNow(skew) });
payloads = r.payloads;
return r.state;
}
function apply() {
const _o1l = current && JSON.stringify([current.mode, current.readonly, current.model]);
current = _oc();
document.documentElement.dataset.license = current ? current.mode : 'off';
if (current) setEntitlement((packId, rec) => L.packAllowed(current, payloads, packId) || (!!rec && rec.beta === true && !current.readonly && L.betaKeep(payloads))); else setEntitlement(null);
setBetaGate(current ? () => L.betaAllowed(current, payloads, L.serverNow(skew)) : null);
setPackCardExtra(current ? packGift : null, current ? [current.mode, current.model, ...payloads.map((p) => p.id + ':' + p.exp)].join('|') : '');
_on();
_o1j();
_o1r();
const now = current && JSON.stringify([current.mode, current.readonly, current.model]);
if (_o1l !== now && typeof onChange === 'function') { try { onChange(); } catch { } }
for (const _oa of _o11) { try { _oa(current); } catch { } }
}
let _oz = 0;
function _o1p() {
const msg = L.readonlyHint({ owner: _ov() });
if (Date.now() - _oz > 4000) { _oz = Date.now(); try { ui.toast(msg, 'warn', 6000); } catch { } }
return Object.assign(new Error(msg), { code: 'LICENSE_READONLY', userMessage: msg });
}
function _on() {
const st = S.store;
if (!st || st.__licGate) return;
const put = st.put.bind(st);
st.put = async (table, row) => { if (current && current.readonly && !L.isErasureOp(table, row)) throw _o1p(); return put(table, row); };
st.__licGate = true;
}
function _o1j() {
document.querySelectorAll('[data-testid="lic-banner"]').forEach((_o2c) => _o2c.remove());
_o14();
const _o5 = L.bannerFor(current, { owner: _ov(), support: supportContact(config).text, pendingLeads: info && info.pending_leads });
const _o28 = document.getElementById('view');
if (!_o5 || !_o28 || !S.shellReady) return;
const { h, button } = ui;
const _o1a = S.route && S.route.screen === 'settings' && S.route.module === 'license';
const _o3 = _ov() && current.mode !== 'unconfigured' && !_o1a && _o5.action
? button(_o5.action === 'key' ? L.ENTER_KEY_LABEL : 'Gia hạn', () => _or(_o5.action === 'key'), { kind: _o5.tone === 'info' ? 'secondary' : 'primary', small: true, icon: 'key', testid: 'lic-banner-go' }) : null;
const _o1k = current.mode === 'trial' && _ov();
const inner = [h('span', { class: 'card-ico' }, ui.icon(_o5.tone === 'bad' ? 'lock' : 'clock', 20)),
h('div', { class: 'lic-banner-text' },
_o5.title ? h('strong', { 'data-testid': 'lic-banner-title' }, _o5.title) : null,
h('p', { 'data-testid': 'lic-banner-text' }, _o5.text)),
_o3];
const _oh = h('div', { class: 'lic-banner card lic-' + _o5.tone + (_o5.compact ? ' lic-compact' : '') + (_o1k ? ' lic-has-pill' : ''), role: 'status', 'data-testid': 'lic-banner', dataset: { mode: current.mode, member: _ov() ? '0' : '1' } },
_o1k ? h('button', { type: 'button', class: 'lic-pill', 'data-testid': 'lic-pill', 'aria-expanded': 'false', onclick: (e) => { const _o1c = _oh.classList.toggle('is-open'); e.currentTarget.setAttribute('aria-expanded', String(_o1c)); } },
ui.icon('clock', 16), h('span', null, L.trialPillText(current.days_left)), ui.icon('next', 14, 'lic-pill-chev')) : null,
_o1k ? h('div', { class: 'lic-pill-body' }, ...inner) : inner);
_o28.insertBefore(_oh, _o28.firstChild);
}
let _o1w = null;
const _o2 = 'button, [role="button"], a.btn, .fab';
function _o13(_oh) {
if (_oh.closest('[data-testid="lic-banner"], [data-testid="lic-panel"], .nav, nav, .toast')) return;
const text = (_oh.textContent || '').trim(), testid = _oh.getAttribute('data-testid') || '', aria = _oh.getAttribute('aria-label') || _oh.getAttribute('title') || '';
if (!_oh.classList.contains('lic-ro-off') && !L.isWriteControl({ text, testid, aria })) return;
_oh.classList.add('lic-ro-off'); _oh.setAttribute('aria-disabled', 'true');
if (!_oh.dataset.licTitle) { _oh.dataset.licTitle = _oh.getAttribute('title') || '-'; }
_oh.setAttribute('title', L.readonlyHint({ owner: _ov() }));
}
function _o25() {
document.querySelectorAll('.lic-ro-off').forEach((_oh) => {
_oh.classList.remove('lic-ro-off'); _oh.removeAttribute('aria-disabled');
if (_oh.dataset.licTitle && _oh.dataset.licTitle !== '-') _oh.setAttribute('title', _oh.dataset.licTitle); else _oh.removeAttribute('title');
delete _oh.dataset.licTitle;
});
}
function _o14() {
const _o1v = !!(current && current.readonly);
if (!_o1v) { if (_o1w) { _o1w.disconnect(); _o1w = null; } _o25(); return; }
const _o1x = document.body;
if (!_o1x) return;
_o1x.querySelectorAll(_o2).forEach(_o13);
if (!_o1w && typeof MutationObserver !== 'undefined') {
_o1w = new MutationObserver((muts) => {
for (const _o12 of muts) for (const _o15 of _o12.addedNodes) {
if (_o15.nodeType !== 1) continue;
if (_o15.matches && _o15.matches(_o2)) _o13(_o15);
if (_o15.querySelectorAll) _o15.querySelectorAll(_o2).forEach(_o13);
}
});
_o1w.observe(_o1x, { childList: true, subtree: true });
}
}
const onBlockedClick = (e) => {
const _oh = e.target && e.target.closest ? e.target.closest('.lic-ro-off') : null;
if (!_oh || !(current && current.readonly)) return;
e.preventDefault(); e.stopImmediatePropagation();
_o1p();
};
document.addEventListener('click', onBlockedClick, true);
function _o1r() {
const k = L.reminderKey(current);
if (!k || cache.get().reminded === k || !S.shellReady) return;
cache.patch({ reminded: k });
const _o2a = current.mode === 'trial' ? 'Thời gian dùng thử' : 'Bản quyền';
try { ui.toast(`${_o2a} còn ${current.days_left} ngày (đến ${L.dmy(current.exp)}).` + (_ov() ? ' Gia hạn ở Cài đặt › Bản quyền.' : ' Báo Chủ app gia hạn.'), 'warn', 8000); } catch { }
}
function _or(focusKey = false) {
if (nav) nav('settings/license'); else location.hash = '#/settings/license';
if (focusKey) setTimeout(() => { const _oh = document.getElementById('lic-key-input'); if (_oh) { _oh.scrollIntoView({ block: 'center' }); _oh.focus(); } }, 400);
}
const _o1b = () => _o1j();
S.routeSubs.add(_o1b);
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
async function _o1z(payload) {
info = await S.api.call('license.save', payload);
cache.patch({ info });
apply();
return current;
}
async function check({ force = false, fresh = false } = {}) {
if (!fresh && _ov()) await refresh();
if (!_ov() || !info || info.enabled === false || !info.install_id) return current;
if (misconfigured()) return current;
const _o9 = cache.get();
if (!force && _o9.checkedAt && Date.now() - _o9.checkedAt < _o0 && (info.tokens || []).length) return current;
const base = { install_id: info.install_id, app_version: (config && config.APP_VERSION) || '' };
let st;
try {
try { st = await _ob.call('license.status', base); } catch (e) {
if (e.code !== 'NOT_REGISTERED') throw e;
const _ot = typeof window !== 'undefined' && window.__bds ? window.__bds.licenseHold : null;
if (_ot) { try { await _ot; } catch { } await refresh(); }
if (!info.account_hash) throw Object.assign(new Error(NO_ACCOUNT_MSG), { code: 'NO_ACCOUNT', userMessage: NO_ACCOUNT_MSG });
let _ou = '';
try { const r = await S.api.call('license.get', { id_token: true }); _ou = (r && r.id_token) || ''; } catch { _ou = ''; }
if (!_ou) throw Object.assign(new Error(NO_IDENTITY_MSG), { code: 'NEED_IDENTITY', userMessage: NO_IDENTITY_MSG });
st = await _ob.call('install.register', { ...base, id_token: _ou, account_hash: info.account_hash, edition: info.edition, company: info.company });
}
lastErr = '';
} catch (e) { lastErr = (e && (e.userMessage || e.message)) || 'Lỗi'; cache.patch({ lastErr }); apply(); return current; }
status = st;
cache.patch({ status, checkedAt: Date.now(), lastErr: '' });
await _o1z({ tokens: st.tokens || [], revoked: st.revoked || [], model: st.model, synced: true });
return current;
}
async function activate(text) {
const key = String(text || '').trim();
if (!key) throw Object.assign(new Error('Gõ hoặc dán mã bản quyền vào ô trước.'), { userMessage: 'Gõ hoặc dán mã bản quyền vào ô trước.' });
const compact = key.replace(/\s+/g, '');
const ok = verifier && cfg.pubkey ? L.verifyToken(compact, { pubKey: cfg.pubkey, installId: info && info.install_id, verifier }) : null;
if (ok) return _o1z({ tokens: [compact] });
if (!info || !info.install_id) await refresh();
let _ou = '';
try { const r = await S.api.call('license.get', { id_token: true }); _ou = (r && r.id_token) || ''; } catch { _ou = ''; }
if (!_ou) throw Object.assign(new Error(NO_IDENTITY_MSG), { code: 'NEED_IDENTITY', userMessage: NO_IDENTITY_MSG });
const r = await _ob.call('key.redeem', { install_id: info.install_id, id_token: _ou, key });
if (r.status) { status = r.status; cache.patch({ status }); }
const st = await _o1z({ tokens: [r.token], revoked: (r.status && r.status.revoked) || [], synced: true });
lastRedeem = { again: !!r.again, edition: r.edition, seats: r.seats, perpetual: !!r.perpetual, expires: r.expires };
return st;
}
let lastRedeem = null;
async function redeemGift(code) {
if (!info || !info.install_id) await refresh();
if (!info || !info.install_id) throw Object.assign(new Error(NO_ACCOUNT_MSG), { code: 'NO_ACCOUNT', userMessage: NO_ACCOUNT_MSG });
let _ou = '';
try { const r = await S.api.call('license.get', { id_token: true }); _ou = (r && r.id_token) || ''; } catch { _ou = ''; }
if (!_ou) throw Object.assign(new Error(NO_IDENTITY_MSG), { code: 'NEED_IDENTITY', userMessage: NO_IDENTITY_MSG });
const r = await _ob.call('gift.redeem', { install_id: info.install_id, id_token: _ou, code });
if (r.status) { status = r.status; cache.patch({ status }); }
await _o1z({ tokens: [r.token], revoked: (r.status && r.status.revoked) || [], synced: true });
return r;
}
function packGift(def, { st, redraw } = {}) {
if (!current) return null;
const _o27 = giftCardView({ state: current, payloads, def, st, owner: _ov(), now: L.serverNow(skew) });
if (!_o27.show) return null;
return giftBox(ui, { testid: 'xpack-gift-' + def.id, badge: _o27.badge, onRedeem: (code) => redeemGift(code), onDone: () => { if (typeof redraw === 'function') redraw(); } });
}
const _o1q = loadVerifier().then((_o27) => { verifier = _o27; apply(); });
apply();
_o1q.then(() => refresh()).then(() => check({ fresh: true })).catch(() => null);
const _o24 = setInterval(() => { if (!_o23) refresh().then(() => check({ fresh: true })).catch(() => null); }, 6 * 3600000);
const _o1m = appHooks.lateSections;
appHooks.lateSections = (ctx) => [...(typeof _o1m === 'function' ? _o1m(ctx) : []), ['license', 'key', 'Bản quyền', (body) => _o1s(body)]];
const api = {
enabled: true,
state: () => current,
allows: (feature) => !current || !current.readonly || feature === 'view' || feature === 'export' || feature === 'updates',
misconfigured,
refresh, check, activate, redeemGift,
on(_oa) { _o11.add(_oa); return () => _o11.delete(_oa); },
lastRedeem: () => lastRedeem,
stop() { _o23 = true; clearInterval(_o24); S.routeSubs.delete(_o1b); setEntitlement(null); setBetaGate(null); setPackCardExtra(null); document.removeEventListener('click', onBlockedClick, true); if (_o1w) _o1w.disconnect(); _o25(); }
};
window.__bds = { ...(window.__bds || {}), license: api };
return api;
function _o1s(body) {
const { h, button, field, badge, kv, toast, copy } = ui;
const _o7 = h('div', { class: 'lic', 'data-testid': 'lic-panel' });
let _ox = null;
body.appendChild(_o7);
const _o1n = privacyLine(h, { testid: 'lic-privacy', lead: 'Dữ liệu bản quyền và dữ liệu của anh/chị được xử lý theo ', cfg: config });
if (_o1n) body.appendChild(_o1n);
const _o26 = api.on(() => { if (_o7.isConnected) _o1i(); else _o26(); });
_o1i();
if (_ov()) check({ force: true }).catch(() => null);
function _o1i() {
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
const _o9 = cache.get();
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
['Cách bán', L.MODEL_LABEL[st.model] || L.MODEL_LABEL.whole_app],
info.user_limit ? ['Số người dùng tối đa', String(info.user_limit)] : null,
_ov() && info.install_id ? ['Mã cài đặt', h('span', { class: 'lic-copy' }, h('span', { class: 'lic-mono', 'data-testid': 'lic-iid' }, info.install_id),
button('Chép', () => { copy(info.install_id); }, { kind: 'ghost', small: true, icon: 'log', title: 'Chép mã cài đặt', testid: 'lic-iid-copy' }))] : null,
_o9.checkedAt ? ['Kiểm tra lần cuối', new Date(_o9.checkedAt).toLocaleString('vi-VN')] : null
]),
st.local ? h('p', { class: 'muted', 'data-testid': 'lic-local' }, 'Chưa nhận được thông tin từ máy chủ bản quyền – đang tính dùng thử trên máy.') : null,
_o9.lastErr && _ov() ? h('p', { class: 'lic-err', 'data-testid': 'lic-err' }, _o9.lastErr) : null,
st.readonly && info.pending_leads ? h('p', { class: 'lic-leads', 'data-testid': 'lic-leads' }, L.pendingLeadsText(info.pending_leads) + '.') : null,
_ov() && info.install_id ? h('details', { class: 'lic-move', 'data-testid': 'lic-move-help' }, h('summary', null, 'Đổi tài khoản Google / máy chủ mới?'),
h('p', { class: 'muted' }, L.MOVE_HELP)) : null,
_o1h(st)));
if (!_ov()) { _o7.appendChild(h('p', { class: st.readonly ? 'lic-err' : 'muted', 'data-testid': 'lic-member' }, st.readonly ? L.MEMBER_READONLY + '.' : 'Quản trị (Admin) quản lý bản quyền và gia hạn cho cả công ty.')); return; }
_o7.appendChild(h('div', { class: 'btn-row' },
button('Kiểm tra lại ngay', async () => { await check({ force: true }); toast(cache.get().lastErr || 'Đã kiểm tra bản quyền.', cache.get().lastErr ? 'warn' : 'ok'); }, { kind: 'secondary', small: true, icon: 'refresh', testid: 'lic-refresh' })));
if (st.readonly || st.mode === 'trial') { _o7.appendChild(_ow()); _o7.appendChild(_o8(st)); } else { _o7.appendChild(_o8(st)); _o7.appendChild(_ow()); }
if (st.model !== 'whole_app') _o7.appendChild(_op());
_o7.appendChild(_os());
}
function _o1g() { return (S.packs && S.packs.defs && S.packs.defs()) || []; }
function titleOf(id) { const _og = _o1g().find((_o2c) => _o2c.id === id); return _og ? packTitle(_og) : 'Gói ' + id; }
function _o1h(st) {
if (st.model === 'whole_app') return null;
const defs = _o1g();
const ids = defs.length ? defs.filter((_og) => _og.kind !== 'core').map((_og) => _og.id) : L.packScopes(payloads).map((_o2c) => _o2c.pack);
if (!ids.length && st.model !== 'core_paid_packs_paid') return null;
const items = L.ownedItems({ state: st, payloads, packIds: ids, now: L.serverNow(skew) });
const list = st.model === 'core_paid_packs_paid' ? items : items.slice(1);
return h('div', { class: 'lic-owned' }, h('h4', null, ui.icon('check', 18), ' Anh/chị đang có'),
h('ul', { class: 'lic-packs', 'data-testid': 'lic-packs' }, list.map((it) => {
const def = defs.find((_og) => _og.id === it.id);
const exp = !!(def && def.experimental);
const beta = exp && L.betaAllowed(st, payloads, L.serverNow(skew));
const _oo = it.owned ? giftFor(payloads, it.id, L.serverNow(skew)) : null;
const text = exp && !it.owned ? (beta ? '🧪 Thử nghiệm – miễn phí' : '🧪 Thử nghiệm – sắp có') : _oo && Number(it.exp) <= _oo.exp ? giftText(_oo) : L.ownedText(it);
return h('li', { dataset: { pack: it.id, on: it.on ? '1' : '0', owned: it.owned ? '1' : '0', perpetual: it.perpetual ? '1' : '0' } },
h('span', null, it.id === 'core' ? 'Gói Cơ bản' : titleOf(it.id)), badge(text, it.owned ? 'ok' : it.on ? 'info' : 'warn'));
})));
}
function _o8(st) {
const _oj = st.model === 'core_paid_packs_paid' && st.mode === 'active' && st.perpetual;
const _o2b = h('section', { class: 'lic-sec', 'data-testid': 'lic-buy' }, h('h4', null, _oj ? 'Mua thêm gói' : st.mode === 'active' ? 'Gia hạn' : 'Mua bản quyền'));
const _o4 = h('div', null, h('p', { class: 'muted' }, 'Đang tải bảng giá…'));
_o2b.appendChild(_o4);
_ob.call('prices.list', { install_id: info.install_id, edition: info.edition }).then((pl) => {
ui.clear(_o4);
const rows = (pl && pl.rows) || [];
if (!rows.length) { _o4.appendChild(h('p', { class: 'muted', 'data-testid': 'lic-noprice' }, 'Người bán chưa đặt giá – liên hệ người bán để mua bản quyền.')); return; }
const model = (pl && pl.model) || st.model;
const _o1d = L.buyOptions({ rows, model, payloads, serverBaseOwned: !!(pl && pl.base_owned), now: L.serverNow(skew), syncOkAt: info.sync_ok_at, titleOf, money: _o29 });
const _om = _o1d.find((_o16) => !_o16.disabled) || _o1d[0];
const fScope = field({ label: 'Mua', type: 'select', value: _om.scope, options: _o1d.map((_o16) => ({ value: _o16.scope, label: _o16.label + (_o16.why ? ' – ' + _o16.why : '') })), id: 'lic-scope' });
[...fScope.input.options].forEach((op, i) => { op.disabled = !!_o1d[i].disabled; });
const _ok = field({ label: 'Thời hạn', type: 'select', id: 'lic-months' });
const note = h('p', { class: 'muted', 'data-testid': 'lic-buy-note' });
const _oq = button('Tạo mã chuyển khoản', async () => {
const _o16 = await _ob.call('order.create', { install_id: info.install_id, scope: fScope.getValue(), months: Number(_ok.getValue()) });
ui.clear(_o1f); _o1f.appendChild(_o1e(_o16));
if (_o16 && _o16.order_code && status) {
status.orders = [{ order_code: _o16.order_code, scope: _o16.scope, months: _o16.months, amount: _o16.amount, created: _o16.created || Date.now(), paid: 0 }, ...(status.orders || []).filter((_o2c) => _o2c.order_code !== _o16.order_code)];
const _o19 = _o7.querySelector('[data-testid="lic-history"]'); if (_o19) _o19.replaceWith(_os());
}
}, { kind: 'primary', icon: 'wallet', testid: 'lic-order' });
const _of = () => _o1d.find((_o16) => _o16.scope === fScope.getValue()) || _om;
const _o20 = () => {
const _o16 = _of();
note.textContent = _o16.disabled ? (_o16.why === L.NEEDS_BASE_TEXT ? 'Gói mở rộng chỉ chạy khi đã có Gói Cơ bản – mua Gói Cơ bản trước, rồi mua gói này.' : 'Anh/chị đã có phần này vĩnh viễn.')
: Number(_ok.getValue()) === 0 ? 'Vĩnh viễn: trả 1 lần, dùng ngay khi người bán xác nhận (kể cả đang dùng thử), không hết hạn. Bản cập nhật app, máy chủ và gói luôn miễn phí.'
: L.buyTermNote(st.mode);
_oq.disabled = !!_o16.disabled;
};
const _ol = () => {
ui.clear(_ok.input);
for (const r of _of().rows) _ok.input.appendChild(h('option', { value: String(r.months) }, r.label));
_o20();
};
fScope.input.addEventListener('change', _ol); _ok.input.addEventListener('change', _o20); _ol();
const _o1f = h('div', { class: 'lic-order' });
const _o18 = _o1d.length > 1 ? h('ul', { class: 'lic-list lic-offers', 'data-testid': 'lic-offers' }, _o1d.map((_o16) => h('li', { dataset: { scope: _o16.scope, disabled: _o16.disabled ? '1' : '0' } },
h('strong', null, _o16.label), h('span', null, _o16.rows.map((r) => r.label).join(' · ')), _o16.why ? badge(_o16.why, _o16.why === L.OWNED_TEXT ? 'ok' : 'warn') : null,
_o16.disabled ? null : button('Chọn', () => { fScope.setValue ? fScope.setValue(_o16.scope) : (fScope.input.value = _o16.scope); _ol(); }, { kind: 'ghost', small: true, icon: 'check', testid: 'lic-offer-pick' })))) : null;
_o4.append(_o18 || '', h('div', { class: 'grid-2' }, _o1d.length > 1 ? fScope : null, _ok), note, h('div', { class: 'btn-row' }, _oq), _o1f);
}).catch((e) => { ui.clear(_o4); _o4.appendChild(h('p', { class: 'lic-err', 'data-testid': 'lic-buy-err' }, (e && (e.userMessage || e.message)) || 'Không tải được bảng giá.')); });
return _o2b;
}
function _o1e(_o16) {
const _o27 = L.verifyPay(_o16 && _o16.pay, { pubKey: cfg.pubkey, payee: config && config.PAYEE_NAME, verifier, now: L.serverNow(skew), installId: info && info.install_id, orderCode: _o16 && _o16.order_code });
if (!_o27.ok) {
try { console.warn('BDS bản quyền: chỉ dẫn chuyển khoản không hợp lệ (' + _o27.reason + ')'); } catch { }
_ob.call('pay.report', { install_id: (info && info.install_id) || '', order_code: String((_o16 && _o16.order_code) || '').slice(0, 20), reason: _o27.reason }).catch(() => null);
const bv = L.payBadView(_o27.reason, { orderCode: (_o16 && _o16.order_code) || '', amount: (_o16 && _o16.amount) || 0, support: supportContact(config), money: _o29 });
return h('div', { class: 'lic-qr-bad card', role: 'alert', 'data-testid': 'lic-qr-bad', dataset: { reason: _o27.reason } },
h('p', { class: 'lic-err' }, h('strong', null, bv.title)), ...bv.lines.map((_o2c) => h('p', { class: 'muted' }, _o2c)));
}
const p = _o27.pay;
const _o1o = L.vietqr({ bin: p.bank_bin, account: p.account_no, amount: p.amount, memo: p.memo });
const _o6 = p.bank_name ? p.bank_name + ' (' + p.bank_bin + ')' : 'Mã ngân hàng ' + p.bank_bin;
const _od = (label, val, tid) => h('div', { class: 'lic-copy' }, h('span', null, label + ': '), h('strong', { 'data-testid': tid }, val), button('', () => copy(val), { kind: 'ghost', small: true, icon: 'log', title: 'Chép' }));
return h('div', { class: 'lic-qr card', 'data-testid': 'lic-qr', dataset: { order: p.order_code } },
h('p', { class: 'lic-payee', 'data-testid': 'lic-payee' }, 'Người nhận: ', h('strong', { 'data-testid': 'lic-payee-name' }, p.payee_name)),
h('div', { class: 'lic-qr-img' }, qrElement(_o1o, { scale: 4, border: 3, title: 'Mã VietQR chuyển khoản' })),
h('div', { class: 'lic-qr-info' },
h('p', null, 'Mở app ngân hàng → Quét QR (đã có sẵn số tiền và nội dung).'),
h('div', { class: 'lic-copy' }, h('span', null, 'Ngân hàng: '), h('strong', { 'data-testid': 'lic-bank' }, _o6)),
_od('Số tài khoản', p.account_no, 'lic-account'),
_od('Số tiền', _o29(p.amount), 'lic-amount'),
_od('Nội dung', p.memo, 'lic-content'),
h('p', { class: 'lic-payee-warn', 'data-testid': 'lic-payee-warn' }, `Chỉ chuyển khi tên người nhận trong app ngân hàng hiện đúng ${p.payee_name}.`),
h('p', { class: 'muted' }, `Mã đơn ${p.order_code}. Người bán xác nhận đã nhận tiền → mã bản quyền tự vào app (bấm "Kiểm tra lại ngay" nếu muốn xem ngay). Ghi đúng nội dung để được xác nhận nhanh.`)));
}
function _ow() {
const f = field({ label: L.ENTER_KEY_LABEL, type: 'text', placeholder: 'BDS-XXXX-XXXX-XXXX-XXXX', id: 'lic-key-input' });
if (f.input) { f.input.setAttribute('autocomplete', 'off'); f.input.setAttribute('autocapitalize', 'characters'); f.input.setAttribute('spellcheck', 'false'); }
const msg = h('div', { class: 'lic-key-msg', 'aria-live': 'polite' });
const _o22 = (_o12) => {
ui.clear(msg);
if (!_o12) return;
if (_o12.ok) { msg.appendChild(h('p', { class: 'lic-okbox', 'data-testid': 'lic-key-ok' }, _o12.text)); return; }
msg.appendChild(h('p', { class: _o12.shared ? 'lic-warnbox' : 'lic-err', role: 'alert', 'data-testid': _o12.shared ? 'lic-key-shared' : 'lic-key-err', dataset: { code: _o12.code || '' } },
_o12.shared ? ui.icon('lock', 18) : null, ' ', _o12.text));
};
_o22(_ox);
const _o21 = h('section', { class: 'lic-sec lic-keybox', 'data-testid': 'lic-key' }, h('h4', null, ui.icon('key', 18), ' ', L.ENTER_KEY_LABEL),
h('p', { class: 'muted' }, 'Mã người bán gửi có dạng BDS-XXXX-XXXX-XXXX-XXXX (không phân biệt chữ hoa/thường, gõ có hay không có dấu gạch đều được). Mỗi mã dùng cho 1 tài khoản.'),
f, msg,
h('div', { class: 'btn-row' }, button('Kích hoạt', async () => {
_ox = null; _o22(null);
let st;
try { st = await activate(f.getValue()); } catch (e) {
_ox = { shared: !!(e && e.code === 'KEY_SHARED'), code: (e && e.code) || '', text: (e && (e.userMessage || e.message)) || 'Chưa kích hoạt được – thử lại.' };
_o22(_ox);
return;
}
f.setValue('');
const _o2c = lastRedeem || {};
const _o10 = st ? `Đã kích hoạt – ${L.MODE_LABEL[st.mode]}${_o2c.perpetual ? ', vĩnh viễn' : st.mode === 'active' ? ', đến ' + L.dmy(st.exp) : ''}${_o2c.edition === 'cong_ty' && _o2c.seats ? ' · ' + _o2c.seats + ' người dùng' : ''}.` : 'Đã lưu mã.';
_ox = { ok: true, text: _o10 };
if (_o7.isConnected) _o1i();
toast(_o10, 'ok');
}, { kind: 'primary', icon: 'key', testid: 'lic-activate' })));
return _o21;
}
function _op() {
return h('section', { class: 'lic-sec lic-giftbox', 'data-testid': 'lic-gift-sec' }, h('h4', null, '🎁 Mã tặng gói'),
giftBox(ui, { testid: 'lic-gift', lead: 'Người bán tặng mã mở gói (vd TANGVIDEO)? Nhập ở đây – gói dùng được ngay; hết hạn tặng thì gói tắt, dữ liệu giữ nguyên.',
onRedeem: (code) => redeemGift(code), onDone: () => { if (_o7.isConnected) _o1i(); } }));
}
function _os() {
const orders = (status && status.orders) || [];
const _oy = payloads.filter((p) => p.k === 'k').sort((a, _o5) => _o5.iat - a.iat);
const _o21 = h('section', { class: 'lic-sec', 'data-testid': 'lic-history' }, h('h4', null, 'Lịch sử'));
const _o1t = h('div', { class: 'lic-order', 'data-testid': 'lic-reopen' });
if (!orders.length && !_oy.length) { _o21.appendChild(h('p', { class: 'muted' }, 'Chưa có đơn hoặc mã bản quyền nào.')); return _o21; }
if (_oy.length) _o21.appendChild(h('ul', { class: 'lic-list' }, _oy.map((k) => h('li', { 'data-testid': 'lic-key-row' },
h('span', { class: 'lic-mono' }, k.id), h('span', null, L.scopeLabel(k.sc, { model: current && current.model, titleOf }) + ' · cấp ' + L.dmy(k.iat) + (L.isPerpetual(k.exp) ? ' · vĩnh viễn' : ' · hết hạn ' + L.dmy(k.exp)))))));
if (orders.length) _o21.appendChild(h('ul', { class: 'lic-list' }, orders.map((_o16) => h('li', { 'data-testid': 'lic-order-row', dataset: { paid: _o16.paid ? '1' : '0' } },
h('span', { class: 'lic-mono' }, _o16.order_code), h('span', null, `${_o16.scope ? L.scopeLabel(_o16.scope, { model: current && current.model, titleOf }) + ' · ' : ''}${L.termLabel(_o16.months)} · ${_o29(_o16.amount)} · ${L.dmy(_o16.created)}`),
badge(_o16.paid ? (_o16.key_id ? 'Đã nhận tiền – mã bản quyền đã vào app' : 'Đã nhận tiền') : 'Chờ chuyển khoản', _o16.paid ? 'ok' : 'warn'),
_o16.paid ? null : button('Xem mã QR', async () => {
const r = await _ob.call('order.pay', { install_id: info.install_id, order_code: _o16.order_code });
ui.clear(_o1t); _o1t.appendChild(_o1e(r)); _o1t.scrollIntoView({ block: 'nearest' });
}, { kind: 'ghost', small: true, icon: 'eye', testid: 'lic-order-reopen' })))));
_o21.appendChild(_o1t);
return _o21;
}
}
}
function _o29(_o15) { return (Number(_o15) || 0).toLocaleString('vi-VN') + ' đ'; }
export default installLicense;

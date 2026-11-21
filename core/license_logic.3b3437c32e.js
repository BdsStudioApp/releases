export const DAY = 86400000;
export const TZ = 7 * 3600000;
export const TRIAL_DAYS = 7;
export const GRACE_DAYS = 3;
export const MODELS = ['whole_app', 'core_free_packs_paid', 'core_paid_packs_paid'];
export const MONTHS = [1, 3, 6, 12];
export const PERPETUAL = Date.UTC(2099, 11, 31, 16, 59, 59);
export const isPerpetual = (exp) => Number(exp) >= PERPETUAL;
export const REGROUP_AT = Date.UTC(2026, 10, 17, 17, 0, 0);
export const MODULE_PACK = { g3_ads: 'leads', g3_docs: 'leads', g3_events: 'leads', g3_groups: 'leads', g3_profile: 'leads', g3_roi: 'leads', g3_seo: 'leads', g2_zoa: 'leads',
g1_banks: 'closing', g1_rental: 'closing', g2_hoso: 'closing', g5_phongthuy: 'closing', g5_huongnang: 'closing',
g2_chamsoc: 'care', g2_taisan: 'care', g2_nhom: 'care',
ideas: 'video', characters: 'video', g5_dandan: 'video', g5_can3d: 'video', g5_noithat: 'video', staff: 'video' };
export const OLD_SCOPE_MODULES = {
sales: ['g1_banks', 'g1_layout', 'g1_policycalc', 'g1_policywatch', 'g1_rental', 'g1_research', 'g1_tax'],
learn: ['g5_can3d', 'g5_dandan', 'g5_hoc', 'g5_huongnang', 'g5_luyentuvan', 'g5_noithat', 'g5_phongthuy', 'g5_quyhoach'],
videoai: ['videoai_taocanh'],
care: ['g2_chamsoc', 'g2_crm', 'g2_hoso', 'g2_lich', 'g2_nhom', 'g2_taisan', 'g2_thitruong', 'g2_tuvan', 'g2_zoa'],
source: ['g4_banggia', 'g4_congtruong', 'g4_giohang', 'g4_giucho', 'g4_phaply'],
leads: ['g3_ads', 'g3_docs', 'g3_events', 'g3_groups', 'g3_profile', 'g3_roi', 'g3_seo'],
video: ['video', 'studio', 'characters', 'staff', 'calendar'],
showing: ['g5_can3d', 'g5_dandan', 'g5_huongnang', 'g5_noithat', 'g5_phongthuy'] };
export const RETIRED_SCOPES = ['sales', 'learn', 'videoai', 'showing'];
export const RETIRED_MODULE_PACK = { g1_layout: 'closing', g1_research: 'source',
g5_quyhoach: 'closing', g2_thitruong: 'closing', g1_tax: 'closing', g4_phaply: 'closing', g4_giucho: 'closing', g2_crm: 'care',
g1_policywatch: 'source', g4_giohang: 'source', g4_banggia: 'source', g4_congtruong: 'source', calendar: 'video',
video: 'video', studio: 'video', videoai_taocanh: 'video',
g1_policycalc: 'closing' };
export const OLD_NEEDS = { g5_dandan: 'video' };
export const OLD_NEEDS_FREE = ['showing'];
export const NEED_MODULES = { video: ['ideas', 'characters'] };
export const PARTIAL_SCOPES = ['showing'];
const _o2 = ['leads', 'closing', 'care', 'video'];
export const REGROUP2_AT = Date.UTC(2026, 10, 22, 17, 0, 0);
export const KEEP_MODULES = { core: ['staff'], care: ['g2_lich'] };
export const keepGen = (p) => !!p && (Number(p.sv) === 1 || Number(p.sv) === 2 || (!Number(p.sv) && Number(p.iat) > 0 && Number(p.iat) < REGROUP2_AT));
const _op = (_o1h, p) => (_o14(KEEP_MODULES, _o1h) && keepGen(p) ? KEEP_MODULES[_o1h] : []);
const _o14 = (o, k) => Object.prototype.hasOwnProperty.call(o, k);
export const oldGen = (p) => !!p && (Number(p.sv) === 1 || (p.sv === undefined && Number(p.iat) > 0 && Number(p.iat) < REGROUP_AT));
const _oz = (_o1h, p) => _o14(OLD_SCOPE_MODULES, _o1h) && (RETIRED_SCOPES.includes(_o1h) || oldGen(p));
const _o10 = (_o1h) => _o2.filter((pk) => OLD_SCOPE_MODULES[_o1h].some((m) => (MODULE_PACK[m] || RETIRED_MODULE_PACK[m]) === pk && !_o14(OLD_NEEDS, m)));
export const SCOPE_ALIAS = Object.fromEntries(RETIRED_SCOPES.map((_o1h) => [_o1h, _o10(_o1h)]));
export function scopeCovers(sc, packId, p = null) {
const _o19 = String(sc || ''); const _oq = _o19.split(',');
if (_o19 === 'app' || (!!packId && packId !== 'core' && _oq.includes('all'))) return true;
return _oq.some((_o1h) => (_oz(_o1h, p) ? packId !== 'core' && _o10(_o1h).includes(packId) : _o1h === packId));
}
export function moduleCovered(p, moduleId, noKeep = false) {
const _o19 = String((p && p.sc) || ''); const _oq = _o19.split(','), pack = MODULE_PACK[moduleId] || 'core';
if (_o19 === 'app') return true;
if (!noKeep && _oq.some((_o1h) => _op(_o1h, p).includes(moduleId))) return true;
if (pack === 'core') return _oq.includes('core');
if (_oq.includes('all')) return true;
return _oq.some((_o1h) => (_oz(_o1h, p) ? OLD_SCOPE_MODULES[_o1h].includes(moduleId) : _o1h === pack));
}
function _ov(p, moduleId, all) {
if (!moduleCovered(p, moduleId)) return false;
const _ox = OLD_NEEDS[moduleId];
if (!_ox || moduleCovered({ ...p, sc: String(p.sc || '').split(',').filter((_o1h) => !_oz(_o1h, p) || OLD_NEEDS_FREE.includes(_o1h)).join(',') }, moduleId)) return true;
const _ou = NEED_MODULES[_ox] || Object.keys(MODULE_PACK).filter((m) => MODULE_PACK[m] === _ox);
return (all || []).some((q) => q && _ou.some((m) => moduleCovered(q, m, true)));
}
export function keepPackAllowed(state, payloads, packId, now = Date.now()) {
const _ou = [...new Set(Object.values(KEEP_MODULES).flat())].filter((m) => MODULE_PACK[m] === packId);
return _ou.some((m) => (payloads || []).some((p) => p && String(p.sc || '').split(',').some((_o1h) => _op(_o1h, p).includes(m))) && moduleAllowed(state, payloads, m, now));
}
export const hasBase = (sc) => scopeCovers(sc, 'core');
const _om = (m, sc) => (m === 'whole_app' ? String(sc) === 'app' : hasBase(sc));
export const REMIND_DAYS = [3, 1];
function _ob(_o19) {
const _oa = String(_o19).replace(/-/g, '+').replace(/_/g, '/');
const bin = atob(_oa + '==='.slice((_oa.length + 3) % 4));
const _od = new Uint8Array(bin.length);
for (let _ol = 0; _ol < bin.length; _ol++) _od[_ol] = bin.charCodeAt(_ol);
return new TextDecoder().decode(_od);
}
export function parseToken(token) {
const t = String(token || '').replace(/\s+/g, '');
const m = /^BDS1\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/.exec(t);
if (!m) return null;
try {
const json = _ob(m[1]);
const p = JSON.parse(json);
if (!p || typeof p !== 'object' || p.v !== 1 || !p.iid || !Number(p.exp)) return null;
return { payload: p, json, sig: m[2].replace(/-/g, '+').replace(/_/g, '/'), token: t };
} catch { return null; }
}
export function verifyToken(token, { pubKey, installId, verifier } = {}) {
const _o1h = parseToken(token);
const V = verifier || globalThis.BDSVerify;
if (!_o1h || !pubKey || !V) return null;
if (installId && _o1h.payload.iid !== installId) return null;
try {
const ok = typeof V.verifySig === 'function' ? V.verifySig(_o1h.json, _o1h.sig, pubKey) : V.verify(_o1h.json, _o1h.sig, pubKey);
return ok ? _o1h.payload : null;
} catch { return null; }
}
function _o17(exp, g, now) { return now < exp ? 'live' : now < exp + g * DAY ? 'grace' : 'expired'; }
const _oj = (p, _oh = GRACE_DAYS) => (p && p.g !== undefined && p.g !== null && Number(p.g) >= 0 ? Number(p.g) : _oh);
export function graceFor(p, exp, syncOkAt = 0, _oh = GRACE_DAYS) {
if (!p || p.k === 't') return 0;
if (Number(syncOkAt) > 0 && Number(syncOkAt) >= Number(exp)) return 0;
return _oj(p, _oh);
}
export function computeState({ payloads = [], now = Date.now(), firstSeen = 0, trialDays = TRIAL_DAYS, graceDays = GRACE_DAYS, model = '', syncOkAt = 0 } = {}) {
let _o9 = null; let m = ''; let _oy = -1; let local = false;
for (const p of payloads) {
if (!p) continue;
if (Number(p.iat) >= _oy && MODELS.includes(p.m)) { _oy = Number(p.iat); m = p.m; }
}
if (!MODELS.includes(m)) m = MODELS.includes(model) ? model : 'whole_app';
for (const p of payloads) if (p && _om(m, p.sc) && (!_o9 || Number(p.exp) > Number(_o9.exp))) _o9 = p;
if (!_o9) { _o9 = { k: 't', exp: (Number(firstSeen) || now) + trialDays * DAY, g: 0 }; local = true; }
const exp = Number(_o9.exp); const g = graceFor(_o9, exp, syncOkAt, graceDays);
const _o16 = _o17(exp, g, now);
const mode = _o16 === 'live' ? (_o9.k === 't' ? 'trial' : 'active') : _o16 === 'grace' ? 'grace' : (m === 'core_free_packs_paid' ? 'free' : 'readonly');
return {
enabled: true, mode, kind: _o9.k === 't' ? 'trial' : 'key', exp, grace_until: exp + g * DAY, grace_days: g,
days_left: Math.max(0, Math.ceil((exp - now) / DAY)), grace_left: Math.max(0, Math.ceil((exp + g * DAY - now) / DAY)),
model: m, readonly: mode === 'readonly', local, scope: 'app', sync_ok_at: Number(syncOkAt) || 0, perpetual: _o9.k !== 't' && isPerpetual(exp)
};
}
export const UNCONFIGURED_TEXT = 'Bản quyền chưa được cấu hình – liên hệ người bán';
export function isConfigured(cfg) { return !!(cfg && String(cfg.server_url || '').trim() && String(cfg.pubkey || '').trim()); }
export function isMisconfigured(cfg, info) {
if (!cfg || cfg.enabled !== true) return false;
if (!isConfigured(cfg)) return true;
return !!(info && info.enabled !== false && (info.pubkey_set === false || (info.state && (info.state.mode === 'unconfigured' || info.state.misconfigured === true))));
}
export function unconfiguredState(model = '') {
return { enabled: true, mode: 'unconfigured', kind: 'none', exp: 0, grace_until: 0, grace_days: 0, days_left: 0, grace_left: 0,
model: MODELS.includes(model) ? model : 'whole_app', readonly: false, local: true, misconfigured: true, scope: 'app' };
}
export const MAX_SKEW_RTT = 120000;
export function clockSkew({ serverTime, sentAt, recvAt } = {}) {
const _o1b = Number(serverTime), a = Number(sentAt), _oa = Number(recvAt);
if (!(_o1b > 0) || !(a > 0) || !(_oa >= a) || _oa - a > MAX_SKEW_RTT) return null;
return Math.round(_o1b - (a + _oa) / 2);
}
export function serverNow(skew, local = Date.now()) { return local + (Number.isFinite(Number(skew)) ? Number(skew) : 0); }
export function clientState({ cfg, info, status = null, verifier = null, now = Date.now() } = {}) {
if (!info || info.enabled === false) return { state: null, payloads: [] };
if (isMisconfigured(cfg, info)) return { state: unconfiguredState((status && status.model) || (info.state && info.state.model)), payloads: [] };
if (info.tokens && verifier && cfg && cfg.pubkey) {
const payloads = info.tokens.map((tk) => verifyToken(tk, { pubKey: cfg.pubkey, installId: info.install_id, verifier })).filter(Boolean);
return { state: computeState({ payloads, now, firstSeen: info.first_seen, model: (status && status.model) || (info.state && info.state.model), syncOkAt: info.sync_ok_at }), payloads };
}
const _o19 = info.state; if (!_o19) return { state: null, payloads: [] };
return { state: computeState({ payloads: [{ v: 1, sc: 'app', k: _o19.kind === 'trial' ? 't' : 'k', exp: _o19.exp, g: _o19.grace_days, m: _o19.model, iat: 0 }], now, model: _o19.model, syncOkAt: info.sync_ok_at }), payloads: [] };
}
export function unsentWarning(_ow, { readonly = false } = {}) {
const k = Math.max(0, Math.floor(Number(_ow) || 0));
if (!k) return null;
const why = readonly
? 'Bản quyền đang ở chế độ chỉ xem nên máy chủ chưa nhận các thay đổi này. Nhập mã bản quyền ở Cài đặt › Bản quyền rồi chờ đồng bộ xong hẵng đăng xuất thì không mất gì.'
: 'Máy chưa gửi được lên máy chủ (mất mạng hoặc máy chủ chưa trả lời). Bấm "Huỷ", chờ biểu tượng đồng bộ hết số rồi hẵng đăng xuất.';
return {
count: k,
title: 'Còn ' + k + ' thay đổi chưa gửi',
message: 'Máy này còn ' + k + ' thay đổi chưa gửi lên máy chủ. Đăng xuất bây giờ sẽ XOÁ VĨNH VIỄN ' + k + ' thay đổi đó khỏi máy (không lấy lại được). ' + why,
ok: 'Đăng xuất và mất ' + k + ' thay đổi'
};
}
export function packAllowed(state, payloads, packId, now = Date.now()) {
if (!state || state.enabled === false || state.misconfigured === true || packId === 'core') return true;
if (state.model === 'whole_app') return !state.readonly;
if (state.model === 'core_paid_packs_paid' && state.readonly) return false;
let _oc = null;
for (const p of payloads || []) {
if (scopeCovers(p.sc, packId, p) && (!_oc || Number(p.exp) > Number(_oc.exp))) _oc = p;
}
if (!_oc && state.local) return state.mode !== 'free' && !state.readonly;
return !!_oc && _o17(Number(_oc.exp), graceFor(_oc, Number(_oc.exp), state.sync_ok_at), now) !== 'expired';
}
export function moduleAllowed(state, payloads, moduleId, now = Date.now()) {
const pack = MODULE_PACK[moduleId] || 'core';
if (!state || state.enabled === false || state.misconfigured === true || pack === 'core') return true;
if (state.model === 'whole_app') return !state.readonly;
if (state.model === 'core_paid_packs_paid' && state.readonly) return false;
const _os = (payloads || []).filter((p) => p && _o17(Number(p.exp), graceFor(p, Number(p.exp), state.sync_ok_at), now) !== 'expired');
const _o8 = (payloads || []).some((p) => p && moduleCovered(p, moduleId));
if (!_o8 && state.local) return state.mode !== 'free' && !state.readonly;
return _os.some((p) => _ov(p, moduleId, _os));
}
export function betaAllowed(state, payloads = [], now = Date.now(), packId = '') {
if (!state || state.enabled === false) return false;
if (state.misconfigured === true || state.mode === 'unconfigured') return true;
if (state.readonly) return false;
return (payloads || []).some((p) => p && p.k === 'k' && _o17(Number(p.exp), graceFor(p, Number(p.exp), state.sync_ok_at), now) !== 'expired' &&
(!packId || scopeCovers(p.sc, packId, p)));
}
export function boughtAllowed(state, payloads = [], now = Date.now(), packId = '', moduleId = '') {
if (!state || state.enabled === false) return false;
if (state.misconfigured === true || state.mode === 'unconfigured') return true;
if (state.readonly) return false;
return (payloads || []).some((p) => p && p.k === 'k' && !/^G/.test(String(p.id || '')) && _o17(Number(p.exp), graceFor(p, Number(p.exp), state.sync_ok_at), now) !== 'expired' &&
(moduleId ? moduleCovered(p, moduleId) : scopeCovers(p.sc, packId, p)));
}
export const PACK_STATE_IDS = ['leads', 'closing', 'care', 'video'];
export function normPackStates(raw) {
if (!raw || typeof raw !== 'object') return null;
const _o13 = {};
for (const id of PACK_STATE_IDS) _o13[id] = ['an', 'trai_nghiem', 'dang_ban'].includes(raw[id]) ? raw[id] : 'an';
return _o13;
}
export function scopeForSale(scope, packStates) {
if (!packStates) return true;
return String(scope || '').split(',').every((_o1h) => {
if (!_o1h || _o1h === 'app' || _o1h === 'core') return true;
if (RETIRED_SCOPES.includes(_o1h)) return false;
if (_o1h === 'all') return PACK_STATE_IDS.every((k) => packStates[k] === 'dang_ban');
return !PACK_STATE_IDS.includes(_o1h) || packStates[_o1h] === 'dang_ban';
});
}
export function betaKeep(payloads = []) {
const _oq = (payloads || []).filter(Boolean);
const src = _oq.find((p) => p.k === 't') || _oq.slice().sort((a, _oa) => Number(_oa.iat) - Number(a.iat))[0];
return !!src && Number(src.bk) === 1;
}
export function packScopes(payloads, now = Date.now()) {
const map = new Map();
for (const p of payloads || []) {
if (p.k !== 'k' || p.sc === 'app') continue;
for (const id of String(p.sc).split(',')) if (!map.has(id) || Number(p.exp) > map.get(id).exp) map.set(id, { pack: id, exp: Number(p.exp), g: _oj(p) });
}
return [...map.values()].map((_o1h) => { const _o16 = _o17(_o1h.exp, _o1h.g, now); return { pack: _o1h.pack, exp: _o1h.exp, mode: _o16 === 'live' ? 'active' : _o16 }; });
}
export function ownedItems({ state = null, payloads = [], packIds = [], now = Date.now() } = {}) {
const keys = (payloads || []).filter((p) => p && p.k === 'k');
const _oc = (test) => keys.filter((p) => test(String(p.sc || ''))).sort((a, _oa) => Number(_oa.exp) - Number(a.exp))[0] || null;
const _o11 = (id) => (id === 'core' ? !!state && !state.readonly : packAllowed(state, payloads, id, now));
const _on = (id, p) => {
if (!p) return { id, owned: false, on: _o11(id) };
const exp = Number(p.exp); const _o16 = _o17(exp, graceFor(p, exp, state && state.sync_ok_at), now);
return { id, owned: _o16 !== 'expired', exp, perpetual: isPerpetual(exp), mode: _o16 === 'live' ? 'active' : _o16, on: _o11(id) };
};
return [_on('core', _oc(hasBase)), ...[...new Set(packIds || [])].filter((id) => id && id !== 'core' && id !== 'all' && id !== 'app').map((id) => _on(id, _oc((sc) => scopeCovers(sc, id))))];
}
export function ownedText(it, fmt = dmy) {
if (it && it.owned) return it.mode === 'grace' ? 'Ân hạn – hết hạn ' + fmt(it.exp) : it.perpetual ? '✓ vĩnh viễn' : '✓ đến ' + fmt(it.exp);
if (it && it.on) return 'Đang dùng thử';
return it && it.exp ? 'Hết hạn ' + fmt(it.exp) : 'Chưa có';
}
export function perpetualOwned(payloads, scope, now = Date.now()) {
const keys = (payloads || []).filter((p) => p && p.k === 'k' && isPerpetual(p.exp) && Number(p.exp) > now);
const sc = String(scope || ''); const _o15 = sc === 'app' ? ['all', 'core'] : sc.split(',').filter(Boolean);
const _of = (ks, part) => (part === 'all' ? ks === 'app' || ks.split(',').includes('all') : scopeCovers(ks.split(',').filter((_o1h) => !PARTIAL_SCOPES.includes(_o1h)).join(','), part));
return !!keys.length && !!_o15.length && _o15.every((_o1h) => keys.some((k) => _of(String(k.sc || ''), _o1h)));
}
export function baseOwned(payloads, now = Date.now(), syncOkAt = 0) {
return (payloads || []).some((p) => p && p.k === 'k' && hasBase(p.sc) && _o17(Number(p.exp), graceFor(p, Number(p.exp), syncOkAt), now) !== 'expired');
}
export const NEEDS_BASE_TEXT = 'cần Gói Cơ bản trước';
export const OWNED_TEXT = 'đã có vĩnh viễn';
const _o3 = (sc) => (sc === 'core' ? 0 : sc === 'all' ? 2 : sc === 'app' ? 3 : hasBase(sc) ? 0.5 : 1);
export function scopeLabel(sc, { model = '', titleOf = (id) => 'Gói ' + id } = {}) {
const _o19 = String(sc || '');
if (_o19 === 'app') return model === 'whole_app' || !model ? 'Cả app' : 'Cả app (Cơ bản + mọi gói)';
const ids = _o19.split(',').filter(Boolean).flatMap((_o1h) => (_o14(SCOPE_ALIAS, _o1h) ? SCOPE_ALIAS[_o1h] : [_o1h]));
return [...new Set(ids)].map((_o1h) => (_o1h === 'core' ? 'Gói Cơ bản' : _o1h === 'all' ? 'Trọn bộ các gói' : titleOf(_o1h))).join(' + ');
}
export function termLabel(months, price = null, money = (_ow) => (Number(_ow) || 0).toLocaleString('vi-VN') + ' đ') {
const t = Number(months) === 0 ? 'Vĩnh viễn' : Number(months) + ' tháng';
return price === null || price === undefined ? t : t + ' – ' + money(price);
}
export function buyOptions({ rows = [], model = '', payloads = [], now = Date.now(), syncOkAt = 0, titleOf, money, serverBaseOwned = false, packStates = null } = {}) {
const by = new Map();
for (const _o18 of rows || []) { if (!_o18 || !_o18.scope || !(Number(_o18.price) > 0) || !scopeForSale(_o18.scope, packStates)) continue; if (!by.has(_o18.scope)) by.set(_o18.scope, []); by.get(_o18.scope).push(_o18); }
const _ok = serverBaseOwned === true || baseOwned(payloads, now, syncOkAt);
return [...by.entries()].sort((a, _oa) => _o3(a[0]) - _o3(_oa[0]) || a[0].localeCompare(_oa[0])).map(([scope, list]) => {
const _o1c = list.map((_o18) => ({ months: Number(_o18.months), price: Number(_o18.price), perpetual: Number(_o18.months) === 0, label: termLabel(_o18.months, _o18.price, money) }))
.sort((a, _oa) => (a.perpetual ? -1 : 0) - (_oa.perpetual ? -1 : 0) || a.months - _oa.months);
const _o12 = _o1c.every((_o1h) => _o1h.perpetual);
const label = scopeLabel(scope, { model, titleOf }) + (_o12 && scope !== 'all' ? ' (vĩnh viễn)' : '');
let why = '';
if (perpetualOwned(payloads, scope, now)) why = OWNED_TEXT;
else if (model === 'core_paid_packs_paid' && !hasBase(scope) && !_ok) why = NEEDS_BASE_TEXT;
return { scope, label, disabled: !!why, why, rows: _o1c };
});
}
export function reminderKey(state) {
if (!state || !state.enabled) return '';
if ((state.mode === 'trial' || state.mode === 'active') && REMIND_DAYS.includes(state.days_left)) return state.exp + ':' + state.days_left;
return '';
}
export const READONLY_TITLE_TRIAL = 'Hết hạn dùng thử – đang ở chế độ chỉ xem';
export const READONLY_TITLE_KEY = 'Bản quyền đã hết hạn – đang ở chế độ chỉ xem';
export const MEMBER_READONLY = 'Công ty đang ở chế độ chỉ xem – liên hệ Quản trị';
export const ENTER_KEY_LABEL = 'Nhập mã bản quyền';
export function handoverText(at, days = TRIAL_DAYS) { return Number(at) > 0 ? `Dùng thử ${Number(days) || TRIAL_DAYS} ngày tính từ ngày bàn giao ${dmy(at)}.` : ''; }
export const MOVE_HELP = 'Cài lại bằng CÙNG tài khoản Google: bản quyền tự đi theo, không phải làm gì. Đổi sang tài khoản Google KHÁC: mở app trên máy chủ mới 1 lần, vào Cài đặt › Bản quyền, bấm "Chép" cạnh Mã cài đặt rồi gửi mã đó cho bộ phận hỗ trợ (kèm tên/số điện thoại đã mua) – bên bán chuyển bản quyền sang, giữ nguyên hạn (mỗi mã bản quyền chuyển được vài lần mỗi năm theo chính sách bên bán).';
export function readonlyHint({ owner = true } = {}) {
return owner ? 'Đang ở chế độ chỉ xem – nhập mã bản quyền để chỉnh sửa (dữ liệu vẫn nguyên).' : 'Đang ở chế độ chỉ xem – liên hệ Quản trị công ty để kích hoạt.';
}
export function pendingLeadsText(_ow) { const k = Math.max(0, Math.floor(Number(_ow) || 0)); return k ? `Có ${k} khách mới đang chờ – kích hoạt để chăm sóc` : ''; }
export function bannerFor(state, { owner = true, fmt = dmy, support = '', pendingLeads = 0 } = {}) {
if (!state || !state.enabled) return null;
if (!owner && state.mode !== 'readonly') return null;
if (state.mode === 'unconfigured') return { tone: 'warn', text: UNCONFIGURED_TEXT + (support ? ' (' + support + ')' : '') + '. App vẫn dùng đầy đủ chức năng, dữ liệu không bị ảnh hưởng.' };
const _o1g = owner ? '' : ' Liên hệ Quản trị để gia hạn.';
if (state.mode === 'readonly') {
const leads = pendingLeadsText(pendingLeads);
if (!owner) return { tone: 'bad', title: MEMBER_READONLY, text: 'Vẫn xem, tìm và xuất dữ liệu được; chưa thêm/sửa được.' + (leads ? ' ' + leads + '.' : ''), action: null };
return { tone: 'bad', title: state.kind === 'trial' ? READONLY_TITLE_TRIAL : READONLY_TITLE_KEY,
text: 'Dữ liệu vẫn nguyên, xem, tìm và xuất được không giới hạn thời gian. Nhập mã bản quyền là chỉnh sửa lại được ngay.' + (leads ? ' ' + leads + '.' : ''), action: 'key' };
}
if (state.mode === 'grace') return { tone: 'warn', text: `Bản quyền đã hết hạn ngày ${fmt(state.exp)} và app chưa kiểm tra lại được với máy chủ bản quyền (mất mạng?). App vẫn đủ chức năng thêm ${state.grace_left} ngày.${_o1g}`, action: owner ? 'renew' : null };
if (state.mode === 'trial') return { tone: state.days_left <= 3 ? 'warn' : 'info', text: state.days_left <= 3 ? `Còn ${state.days_left} ngày dùng thử (đến ${fmt(state.exp)}). Hết dùng thử app chuyển chế độ chỉ xem – nhập mã bản quyền để dùng tiếp, dữ liệu giữ nguyên.${_o1g}` : `Đang dùng thử – còn ${state.days_left} ngày.`, action: owner ? 'key' : null, compact: state.days_left > 3 };
if (state.mode === 'active' && state.days_left <= 3) return { tone: 'warn', text: `Bản quyền còn ${state.days_left} ngày (hết hạn ${fmt(state.exp)}). Gia hạn sớm – thời gian cộng nối tiếp, không mất ngày nào.${_o1g}`, action: owner ? 'renew' : null };
return null;
}
export function isErasureOp(table, row) {
if (!row || typeof row !== 'object' || Number(row.deleted) !== 1) return false;
if (table === 'objects') {
let _oh = row.data; if (typeof _oh === 'string') { try { _oh = JSON.parse(_oh); } catch { _oh = null; } }
return !!_oh && Number(_oh.erased) === 1 && !row.phone && !row.email && !row.zalo && !row.note;
}
if (table === 'events') return !row.text && !row.data;
if (table === 'reminders') return !row.title && !row.data;
if (table === 'audit') return true;
return false;
}
const _o5 = /^(\+|➕|thêm|tạo|lưu|sửa|chỉnh|đổi|cập nhật thông tin|xoá|xóa|gửi|nhập|giao|chuyển|đánh dấu|xong|hoàn thành|duyệt|đăng|ghim|bỏ ghim|kéo|gán|mời|lên lịch|đặt|nhân bản|sao chép sang|ai |🔍 ai|📎 gửi|chạy|tải lên|soạn|viết)/i;
const _o4 = /(^|[-_])(add|new|create|save|edit|delete|del|remove|assign|import|upload|invite|publish|status|done|move|fab)([-_]|$)/i;
const _o1 = /(nhập mã|mã bản quyền|kích hoạt|xuất|tải về|tải xuống|tải excel|tải csv|sao lưu|đăng xuất|góp ý|hỗ trợ|liên hệ|xoá dữ liệu khách|xoá vĩnh viễn|đóng|huỷ|hủy|quay lại|kiểm tra|cập nhật máy chủ|cập nhật app|xem|tìm|lọc|chép|copy|gửi mã|đăng nhập|xác nhận)/i;
const _o0 = /(lic-|license|erase|export|backup|logout|feedback|support|search|filter|close|cancel|back|login|tfa|nav-)/i;
export function isWriteControl({ text = '', testid = '', aria = '' } = {}) {
const t = String(text || aria || '').replace(/\s+/g, ' ').trim();
const id = String(testid || '');
if (_o1.test(t) || _o0.test(id)) return false;
return _o5.test(t) || _o4.test(id);
}
export function dmy(ms) {
const _oh = new Date(Number(ms) + TZ);
const p = (_ow) => String(_ow).padStart(2, '0');
return p(_oh.getUTCDate()) + '/' + p(_oh.getUTCMonth() + 1) + '/' + _oh.getUTCFullYear();
}
export function crc16(_o19) {
const _oa = new TextEncoder().encode(String(_o19)); let _og = 0xffff;
for (const _o1h of _oa) { _og ^= _o1h << 8; for (let _oo = 0; _oo < 8; _oo++) _og = (_og & 0x8000) ? ((_og << 1) ^ 0x1021) & 0xffff : (_og << 1) & 0xffff; }
return _og.toString(16).toUpperCase().padStart(4, '0');
}
export function parseQr(_o19) {
_o19 = String(_o19 || ''); const fields = {}; let _ol = 0;
while (_ol + 4 <= _o19.length) { const id = _o19.substr(_ol, 2); const _or = parseInt(_o19.substr(_ol + 2, 2), 10); if (!(_or >= 0)) break; fields[id] = _o19.substr(_ol + 4, _or); _ol += 4 + _or; }
return { ok: !!fields['63'] && _o19.slice(-8, -4) === '6304' && crc16(_o19.slice(0, -4)) === fields['63'], fields };
}
export const PAY_PREFIX = 'BDSPAY1.';
export const PAY_BAD_TEXT = 'Thông tin nhận tiền không hợp lệ – không chuyển khoản, liên hệ hỗ trợ';
export function payBadView(reason, { orderCode = '', amount = 0, support = {}, money = (_ow) => Number(_ow).toLocaleString('vi-VN') + ' đ' } = {}) {
if (reason !== 'no_payee') return { title: PAY_BAD_TEXT + '.', lines: ['App không hiện mã QR vì thông tin nhận tiền không qua được bước kiểm tra an toàn. Đừng chuyển tiền theo bất kỳ số tài khoản nào khác.'] };
const _o1a = support && typeof support === 'object' ? support : {};
const _o1f = [_o1a.zalo ? 'Zalo ' + _o1a.zalo : '', _o1a.email ? 'email ' + _o1a.email : '', _o1a.phone ? 'số ' + _o1a.phone : ''].filter(Boolean);
return { title: 'Bản app này chưa bật chuyển khoản trong app – chưa có mã QR.',
lines: [(orderCode ? 'Đơn ' + orderCode + (Number(amount) > 0 ? ' (' + money(amount) + ')' : '') + ' đã được ghi nhận. ' : '') + 'Gửi mã đơn cho người bán' + (_o1f.length ? ' qua ' + _o1f.join(' hoặc ') : '') + ' để nhận thông tin chuyển khoản và mã bản quyền.',
'Chỉ chuyển tiền theo đúng tài khoản người bán xác nhận. Người bán xác nhận đã nhận tiền → mã tự vào app (hoặc nhập mã ở ô "Nhập mã bản quyền").'] };
}
export function trialPillText(daysLeft) { const _ow = Math.max(0, Number(daysLeft) || 0); return 'Dùng thử còn ' + _ow + ' ngày · Mua bản quyền'; }
export function buyTermNote(mode) {
if (mode === 'active' || mode === 'grace') return 'Thời gian mua thêm được cộng nối tiếp từ ngày hết hạn hiện tại.';
if (mode === 'trial') return 'Mua trong lúc dùng thử: thời gian tính tiếp sau ngày hết dùng thử.';
return 'Thời hạn tính từ khi người bán xác nhận đã nhận tiền – app mở lại đủ chức năng ngay, dữ liệu giữ nguyên.';
}
export function normPayee(_o19) {
return String(_o19 == null ? '' : _o19).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
}
export function parsePay(blob) {
const m = /^BDSPAY1\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/.exec(String(blob || '').replace(/\s+/g, ''));
if (!m) return null;
try {
const json = _ob(m[1]); const p = JSON.parse(json);
if (!p || typeof p !== 'object' || p.v !== 1 || p.typ !== 'pay') return null;
return { payload: p, text: PAY_PREFIX + json, sig: m[2].replace(/-/g, '+').replace(/_/g, '/') };
} catch { return null; }
}
export function verifyPay(blob, { pubKey, payee, verifier, now = Date.now(), installId = '', orderCode = '', skewMs = 300000 } = {}) {
if (!blob) return { ok: false, reason: 'no_blob' };
const _o1h = parsePay(blob);
if (!_o1h) return { ok: false, reason: 'bad_format' };
const _o1e = normPayee(payee);
if (!_o1e) return { ok: false, reason: 'no_payee' };
const V = verifier || globalThis.BDSVerify;
if (!pubKey || !V) return { ok: false, reason: 'no_key' };
let _oi = false;
try { _oi = typeof V.verifySig === 'function' ? V.verifySig(_o1h.text, _o1h.sig, pubKey) : V.verify(_o1h.text, _o1h.sig, pubKey); } catch { _oi = false; }
if (!_oi) return { ok: false, reason: 'bad_sig' };
const p = _o1h.payload;
if (typeof p.payee_name !== 'string' || p.payee_name !== _o1e) return { ok: false, reason: 'payee_mismatch' };
if (installId && p.iid !== installId) return { ok: false, reason: 'wrong_install' };
if (orderCode && p.order_code !== orderCode) return { ok: false, reason: 'wrong_order' };
if (!(Number(p.exp) > now - skewMs)) return { ok: false, reason: 'expired' };
const amount = Number(p.amount), memo = String(p.memo);
const _ot = p.memo === p.order_code ? /^[A-Z0-9]{4,25}$/.test(memo) : p.src === 'payos' && /^[A-Z0-9][A-Z0-9 ]{2,23}[A-Z0-9]$/.test(memo);
if (!/^\d{6}$/.test(String(p.bank_bin)) || !/^[0-9A-Z]{4,19}$/.test(String(p.account_no)) || !(Number.isInteger(amount) && amount > 0) || !_ot) return { ok: false, reason: 'bad_fields' };
return { ok: true, pay: p };
}
function _o1d(id, value) { value = String(value); const _or = new TextEncoder().encode(value).length; return id + String(_or).padStart(2, '0') + value; }
export function vietqr({ bin, account, amount, memo } = {}) {
const _oa = String(bin || '').replace(/\D/g, ''); const _o6 = String(account || '').replace(/[^0-9A-Za-z]/g, '');
if (_oa.length !== 6 || !_o6) throw new Error('Thiếu mã ngân hàng / số tài khoản');
const _o7 = Math.round(Number(amount) || 0);
const _oe = String(memo || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'D').toUpperCase().replace(/[^A-Z0-9 ]/g, '').slice(0, 25);
const _o19 = _o1d('00', '01') + _o1d('01', _o7 > 0 ? '12' : '11')
+ _o1d('38', _o1d('00', 'A000000727') + _o1d('01', _o1d('00', _oa) + _o1d('01', _o6)) + _o1d('02', 'QRIBFTTA'))
+ _o1d('53', '704') + (_o7 > 0 ? _o1d('54', String(_o7)) : '') + _o1d('58', 'VN') + (_oe ? _o1d('62', _o1d('08', _oe)) : '') + '6304';
return _o19 + crc16(_o19);
}
export const EDITIONS = { ca_nhan: 'Cá nhân', cong_ty: 'Công ty' };
export const MODE_LABEL = { trial: 'Dùng thử', active: 'Đang dùng', grace: 'Ân hạn', readonly: 'Chỉ xem', free: 'Gói Cơ bản miễn phí', unconfigured: 'Chưa cấu hình bản quyền' };
export const MODEL_LABEL = { whole_app: 'Mua bản quyền cho cả app', core_free_packs_paid: 'Gói Cơ bản miễn phí, mua bản quyền theo từng gói',
core_paid_packs_paid: 'Gói Cơ bản mua 1 lần (vĩnh viễn) + mua thêm gói mở rộng – cập nhật miễn phí' };
export const MODE_TONE = { trial: 'info', active: 'ok', grace: 'warn', readonly: 'danger', free: 'gold', unconfigured: 'warn' };
export default { boughtAllowed, normPackStates, scopeForSale, PACK_STATE_IDS, MOVE_HELP, handoverText, graceFor, isErasureOp, isWriteControl, readonlyHint, pendingLeadsText, READONLY_TITLE_TRIAL, READONLY_TITLE_KEY, MEMBER_READONLY, ENTER_KEY_LABEL,
parseToken, verifyToken, computeState, packAllowed, packScopes, reminderKey, bannerFor, dmy, crc16, parseQr, DAY, TRIAL_DAYS, GRACE_DAYS, MODELS, MONTHS, EDITIONS, MODE_LABEL, MODE_TONE,
UNCONFIGURED_TEXT, isConfigured, isMisconfigured, unconfiguredState, clockSkew, serverNow, clientState, unsentWarning, MAX_SKEW_RTT,
PAY_PREFIX, PAY_BAD_TEXT, payBadView, buyTermNote, trialPillText, normPayee, parsePay, verifyPay, vietqr,
betaAllowed, betaKeep, PERPETUAL, isPerpetual, SCOPE_ALIAS, scopeCovers, hasBase, moduleCovered, moduleAllowed, oldGen, MODULE_PACK, OLD_SCOPE_MODULES, RETIRED_MODULE_PACK, REGROUP_AT, REGROUP2_AT, KEEP_MODULES, keepGen, keepPackAllowed, OLD_NEEDS, OLD_NEEDS_FREE, NEED_MODULES, PARTIAL_SCOPES, RETIRED_SCOPES, ownedItems, ownedText, perpetualOwned, baseOwned, scopeLabel, termLabel, buyOptions, NEEDS_BASE_TEXT, OWNED_TEXT, MODEL_LABEL };

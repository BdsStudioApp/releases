export const DAY = 86400000;
export const TZ = 7 * 3600000;
export const TRIAL_DAYS = 7;
export const GRACE_DAYS = 3;
export const MODELS = ['whole_app', 'core_free_packs_paid', 'core_paid_packs_paid'];
export const MONTHS = [1, 3, 6, 12];
export const PERPETUAL = Date.UTC(2099, 11, 31, 16, 59, 59);
export const isPerpetual = (exp) => Number(exp) >= PERPETUAL;
export function scopeCovers(sc, packId) {
const _o11 = String(sc || ''); const _oo = _o11.split(',');
return _o11 === 'app' || _oo.includes(packId) || (!!packId && packId !== 'core' && _oo.includes('all'));
}
export const hasBase = (sc) => scopeCovers(sc, 'core');
const _ok = (m, sc) => (m === 'whole_app' ? String(sc) === 'app' : hasBase(sc));
export const REMIND_DAYS = [3, 1];
function _o9(_o11) {
const _o8 = String(_o11).replace(/-/g, '+').replace(/_/g, '/');
const bin = atob(_o8 + '==='.slice((_o8.length + 3) % 4));
const _ob = new Uint8Array(bin.length);
for (let _oj = 0; _oj < bin.length; _oj++) _ob[_oj] = bin.charCodeAt(_oj);
return new TextDecoder().decode(_ob);
}
export function parseToken(token) {
const t = String(token || '').replace(/\s+/g, '');
const m = /^BDS1\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/.exec(t);
if (!m) return null;
try {
const json = _o9(m[1]);
const _ow = JSON.parse(json);
if (!_ow || typeof _ow !== 'object' || _ow.v !== 1 || !_ow.iid || !Number(_ow.exp)) return null;
return { payload: _ow, json, sig: m[2].replace(/-/g, '+').replace(/_/g, '/'), token: t };
} catch { return null; }
}
export function verifyToken(token, { pubKey, installId, verifier } = {}) {
const _o19 = parseToken(token);
const V = verifier || globalThis.BDSVerify;
if (!_o19 || !pubKey || !V) return null;
if (installId && _o19.payload.iid !== installId) return null;
try {
const ok = typeof V.verifySig === 'function' ? V.verifySig(_o19.json, _o19.sig, pubKey) : V.verify(_o19.json, _o19.sig, pubKey);
return ok ? _o19.payload : null;
} catch { return null; }
}
function _oz(exp, g, now) { return now < exp ? 'live' : now < exp + g * DAY ? 'grace' : 'expired'; }
const _oh = (_ow, _of = GRACE_DAYS) => (_ow && _ow.g !== undefined && _ow.g !== null && Number(_ow.g) >= 0 ? Number(_ow.g) : _of);
export function graceFor(_ow, exp, syncOkAt = 0, _of = GRACE_DAYS) {
if (!_ow || _ow.k === 't') return 0;
if (Number(syncOkAt) > 0 && Number(syncOkAt) >= Number(exp)) return 0;
return _oh(_ow, _of);
}
export function computeState({ payloads = [], now = Date.now(), firstSeen = 0, trialDays = TRIAL_DAYS, graceDays = GRACE_DAYS, model = '', syncOkAt = 0 } = {}) {
let _o7 = null; let m = ''; let _ot = -1; let local = false;
for (const _ow of payloads) {
if (!_ow) continue;
if (Number(_ow.iat) >= _ot && MODELS.includes(_ow.m)) { _ot = Number(_ow.iat); m = _ow.m; }
}
if (!MODELS.includes(m)) m = MODELS.includes(model) ? model : 'whole_app';
for (const _ow of payloads) if (_ow && _ok(m, _ow.sc) && (!_o7 || Number(_ow.exp) > Number(_o7.exp))) _o7 = _ow;
if (!_o7) { _o7 = { k: 't', exp: (Number(firstSeen) || now) + trialDays * DAY, g: 0 }; local = true; }
const exp = Number(_o7.exp); const g = graceFor(_o7, exp, syncOkAt, graceDays);
const _oy = _oz(exp, g, now);
const mode = _oy === 'live' ? (_o7.k === 't' ? 'trial' : 'active') : _oy === 'grace' ? 'grace' : (m === 'core_free_packs_paid' ? 'free' : 'readonly');
return {
enabled: true, mode, kind: _o7.k === 't' ? 'trial' : 'key', exp, grace_until: exp + g * DAY, grace_days: g,
days_left: Math.max(0, Math.ceil((exp - now) / DAY)), grace_left: Math.max(0, Math.ceil((exp + g * DAY - now) / DAY)),
model: m, readonly: mode === 'readonly', local, scope: 'app', sync_ok_at: Number(syncOkAt) || 0, perpetual: _o7.k !== 't' && isPerpetual(exp)
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
const _o13 = Number(serverTime), a = Number(sentAt), _o8 = Number(recvAt);
if (!(_o13 > 0) || !(a > 0) || !(_o8 >= a) || _o8 - a > MAX_SKEW_RTT) return null;
return Math.round(_o13 - (a + _o8) / 2);
}
export function serverNow(skew, local = Date.now()) { return local + (Number.isFinite(Number(skew)) ? Number(skew) : 0); }
export function clientState({ cfg, info, status = null, verifier = null, now = Date.now() } = {}) {
if (!info || info.enabled === false) return { state: null, payloads: [] };
if (isMisconfigured(cfg, info)) return { state: unconfiguredState((status && status.model) || (info.state && info.state.model)), payloads: [] };
if (info.tokens && verifier && cfg && cfg.pubkey) {
const payloads = info.tokens.map((tk) => verifyToken(tk, { pubKey: cfg.pubkey, installId: info.install_id, verifier })).filter(Boolean);
return { state: computeState({ payloads, now, firstSeen: info.first_seen, model: (status && status.model) || (info.state && info.state.model), syncOkAt: info.sync_ok_at }), payloads };
}
const _o11 = info.state; if (!_o11) return { state: null, payloads: [] };
return { state: computeState({ payloads: [{ v: 1, sc: 'app', k: _o11.kind === 'trial' ? 't' : 'k', exp: _o11.exp, g: _o11.grace_days, m: _o11.model, iat: 0 }], now, model: _o11.model, syncOkAt: info.sync_ok_at }), payloads: [] };
}
export function unsentWarning(_os, { readonly = false } = {}) {
const k = Math.max(0, Math.floor(Number(_os) || 0));
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
let _oa = null;
for (const _ow of payloads || []) {
if (scopeCovers(_ow.sc, packId) && (!_oa || Number(_ow.exp) > Number(_oa.exp))) _oa = _ow;
}
if (!_oa && state.local) return state.mode !== 'free' && !state.readonly;
return !!_oa && _oz(Number(_oa.exp), graceFor(_oa, Number(_oa.exp), state.sync_ok_at), now) !== 'expired';
}
export function betaAllowed(state, payloads = [], now = Date.now()) {
if (!state || state.enabled === false) return false;
if (state.misconfigured === true || state.mode === 'unconfigured') return true;
if (['trial', 'active', 'grace'].includes(state.mode)) return true;
if (state.mode !== 'free') return false;
return (payloads || []).some((_ow) => _ow && _ow.k === 'k' && _oz(Number(_ow.exp), graceFor(_ow, Number(_ow.exp), state.sync_ok_at), now) !== 'expired');
}
export function betaKeep(payloads = []) {
const _oo = (payloads || []).filter(Boolean);
const src = _oo.find((_ow) => _ow.k === 't') || _oo.slice().sort((a, _o8) => Number(_o8.iat) - Number(a.iat))[0];
return !!src && Number(src.bk) === 1;
}
export function packScopes(payloads, now = Date.now()) {
const map = new Map();
for (const _ow of payloads || []) {
if (_ow.k !== 'k' || _ow.sc === 'app') continue;
for (const id of String(_ow.sc).split(',')) if (!map.has(id) || Number(_ow.exp) > map.get(id).exp) map.set(id, { pack: id, exp: Number(_ow.exp), g: _oh(_ow) });
}
return [...map.values()].map((_o19) => { const _oy = _oz(_o19.exp, _o19.g, now); return { pack: _o19.pack, exp: _o19.exp, mode: _oy === 'live' ? 'active' : _oy }; });
}
export function ownedItems({ state = null, payloads = [], packIds = [], now = Date.now() } = {}) {
const _on = (payloads || []).filter((_ow) => _ow && _ow.k === 'k');
const _oa = (test) => _on.filter((_ow) => test(String(_ow.sc || ''))).sort((a, _o8) => Number(_o8.exp) - Number(a.exp))[0] || null;
const _ou = (id) => (id === 'core' ? !!state && !state.readonly : packAllowed(state, payloads, id, now));
const _ol = (id, _ow) => {
if (!_ow) return { id, owned: false, on: _ou(id) };
const exp = Number(_ow.exp); const _oy = _oz(exp, graceFor(_ow, exp, state && state.sync_ok_at), now);
return { id, owned: _oy !== 'expired', exp, perpetual: isPerpetual(exp), mode: _oy === 'live' ? 'active' : _oy, on: _ou(id) };
};
return [_ol('core', _oa(hasBase)), ...[...new Set(packIds || [])].filter((id) => id && id !== 'core' && id !== 'all' && id !== 'app').map((id) => _ol(id, _oa((sc) => scopeCovers(sc, id))))];
}
export function ownedText(it, fmt = dmy) {
if (it && it.owned) return it.mode === 'grace' ? 'Ân hạn – hết hạn ' + fmt(it.exp) : it.perpetual ? '✓ vĩnh viễn' : '✓ đến ' + fmt(it.exp);
if (it && it.on) return 'Đang dùng thử';
return it && it.exp ? 'Hết hạn ' + fmt(it.exp) : 'Chưa có';
}
export function perpetualOwned(payloads, scope, now = Date.now()) {
const _on = (payloads || []).filter((_ow) => _ow && _ow.k === 'k' && isPerpetual(_ow.exp) && Number(_ow.exp) > now);
const sc = String(scope || ''); const _ox = sc === 'app' ? ['all', 'core'] : sc.split(',').filter(Boolean);
const _od = (ks, part) => (part === 'all' ? ks === 'app' || ks.split(',').includes('all') : scopeCovers(ks, part));
return !!_on.length && !!_ox.length && _ox.every((_o19) => _on.some((k) => _od(String(k.sc || ''), _o19)));
}
export function baseOwned(payloads, now = Date.now(), syncOkAt = 0) {
return (payloads || []).some((_ow) => _ow && _ow.k === 'k' && hasBase(_ow.sc) && _oz(Number(_ow.exp), graceFor(_ow, Number(_ow.exp), syncOkAt), now) !== 'expired');
}
export const NEEDS_BASE_TEXT = 'cần Gói Cơ bản trước';
export const OWNED_TEXT = 'đã có vĩnh viễn';
const _o2 = (sc) => (sc === 'core' ? 0 : sc === 'all' ? 2 : sc === 'app' ? 3 : hasBase(sc) ? 0.5 : 1);
export function scopeLabel(sc, { model = '', titleOf = (id) => 'Gói ' + id } = {}) {
const _o11 = String(sc || '');
if (_o11 === 'app') return model === 'whole_app' || !model ? 'Cả app' : 'Cả app (Cơ bản + mọi gói)';
return _o11.split(',').filter(Boolean).map((_o19) => (_o19 === 'core' ? 'Gói Cơ bản' : _o19 === 'all' ? 'Trọn bộ các gói' : titleOf(_o19))).join(' + ');
}
export function termLabel(months, price = null, money = (_os) => (Number(_os) || 0).toLocaleString('vi-VN') + ' đ') {
const t = Number(months) === 0 ? 'Vĩnh viễn' : Number(months) + ' tháng';
return price === null || price === undefined ? t : t + ' – ' + money(price);
}
export function buyOptions({ rows = [], model = '', payloads = [], now = Date.now(), syncOkAt = 0, titleOf, money, serverBaseOwned = false } = {}) {
const by = new Map();
for (const _o10 of rows || []) { if (!_o10 || !_o10.scope || !(Number(_o10.price) > 0)) continue; if (!by.has(_o10.scope)) by.set(_o10.scope, []); by.get(_o10.scope).push(_o10); }
const _oi = serverBaseOwned === true || baseOwned(payloads, now, syncOkAt);
return [...by.entries()].sort((a, _o8) => _o2(a[0]) - _o2(_o8[0]) || a[0].localeCompare(_o8[0])).map(([scope, list]) => {
const _o14 = list.map((_o10) => ({ months: Number(_o10.months), price: Number(_o10.price), perpetual: Number(_o10.months) === 0, label: termLabel(_o10.months, _o10.price, money) }))
.sort((a, _o8) => (a.perpetual ? -1 : 0) - (_o8.perpetual ? -1 : 0) || a.months - _o8.months);
const _ov = _o14.every((_o19) => _o19.perpetual);
const label = scopeLabel(scope, { model, titleOf }) + (_ov && scope !== 'all' ? ' (vĩnh viễn)' : '');
let why = '';
if (perpetualOwned(payloads, scope, now)) why = OWNED_TEXT;
else if (model === 'core_paid_packs_paid' && !hasBase(scope) && !_oi) why = NEEDS_BASE_TEXT;
return { scope, label, disabled: !!why, why, rows: _o14 };
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
export function pendingLeadsText(_os) { const k = Math.max(0, Math.floor(Number(_os) || 0)); return k ? `Có ${k} khách mới đang chờ – kích hoạt để chăm sóc` : ''; }
export function bannerFor(state, { owner = true, fmt = dmy, support = '', pendingLeads = 0 } = {}) {
if (!state || !state.enabled) return null;
if (!owner && state.mode !== 'readonly') return null;
if (state.mode === 'unconfigured') return { tone: 'warn', text: UNCONFIGURED_TEXT + (support ? ' (' + support + ')' : '') + '. App vẫn dùng đầy đủ chức năng, dữ liệu không bị ảnh hưởng.' };
const _o18 = owner ? '' : ' Liên hệ Quản trị để gia hạn.';
if (state.mode === 'readonly') {
const _op = pendingLeadsText(pendingLeads);
if (!owner) return { tone: 'bad', title: MEMBER_READONLY, text: 'Vẫn xem, tìm và xuất dữ liệu được; chưa thêm/sửa được.' + (_op ? ' ' + _op + '.' : ''), action: null };
return { tone: 'bad', title: state.kind === 'trial' ? READONLY_TITLE_TRIAL : READONLY_TITLE_KEY,
text: 'Dữ liệu vẫn nguyên, xem, tìm và xuất được không giới hạn thời gian. Nhập mã bản quyền là chỉnh sửa lại được ngay.' + (_op ? ' ' + _op + '.' : ''), action: 'key' };
}
if (state.mode === 'grace') return { tone: 'warn', text: `Bản quyền đã hết hạn ngày ${fmt(state.exp)} và app chưa kiểm tra lại được với máy chủ bản quyền (mất mạng?). App vẫn đủ chức năng thêm ${state.grace_left} ngày.${_o18}`, action: owner ? 'renew' : null };
if (state.mode === 'trial') return { tone: state.days_left <= 3 ? 'warn' : 'info', text: state.days_left <= 3 ? `Còn ${state.days_left} ngày dùng thử (đến ${fmt(state.exp)}). Hết dùng thử app chuyển chế độ chỉ xem – nhập mã bản quyền để dùng tiếp, dữ liệu giữ nguyên.${_o18}` : `Đang dùng thử – còn ${state.days_left} ngày.`, action: owner ? 'key' : null, compact: state.days_left > 3 };
if (state.mode === 'active' && state.days_left <= 3) return { tone: 'warn', text: `Bản quyền còn ${state.days_left} ngày (hết hạn ${fmt(state.exp)}). Gia hạn sớm – thời gian cộng nối tiếp, không mất ngày nào.${_o18}`, action: owner ? 'renew' : null };
return null;
}
export function isErasureOp(table, row) {
if (!row || typeof row !== 'object' || Number(row.deleted) !== 1) return false;
if (table === 'objects') {
let _of = row.data; if (typeof _of === 'string') { try { _of = JSON.parse(_of); } catch { _of = null; } }
return !!_of && Number(_of.erased) === 1 && !row.phone && !row.email && !row.zalo && !row.note;
}
if (table === 'events') return !row.text && !row.data;
if (table === 'reminders') return !row.title && !row.data;
if (table === 'audit') return true;
return false;
}
const _o4 = /^(\+|➕|thêm|tạo|lưu|sửa|chỉnh|đổi|cập nhật thông tin|xoá|xóa|gửi|nhập|giao|chuyển|đánh dấu|xong|hoàn thành|duyệt|đăng|ghim|bỏ ghim|kéo|gán|mời|lên lịch|đặt|nhân bản|sao chép sang|ai |🔍 ai|📎 gửi|chạy|tải lên|soạn|viết)/i;
const _o3 = /(^|[-_])(add|new|create|save|edit|delete|del|remove|assign|import|upload|invite|publish|status|done|move|fab)([-_]|$)/i;
const _o1 = /(nhập mã|mã bản quyền|kích hoạt|xuất|tải về|tải xuống|tải excel|tải csv|sao lưu|đăng xuất|góp ý|hỗ trợ|liên hệ|xoá dữ liệu khách|xoá vĩnh viễn|đóng|huỷ|hủy|quay lại|kiểm tra|cập nhật máy chủ|cập nhật app|xem|tìm|lọc|chép|copy|gửi mã|đăng nhập|xác nhận)/i;
const _o0 = /(lic-|license|erase|export|backup|logout|feedback|support|search|filter|close|cancel|back|login|tfa|nav-)/i;
export function isWriteControl({ text = '', testid = '', aria = '' } = {}) {
const t = String(text || aria || '').replace(/\s+/g, ' ').trim();
const id = String(testid || '');
if (_o1.test(t) || _o0.test(id)) return false;
return _o4.test(t) || _o3.test(id);
}
export function dmy(ms) {
const _of = new Date(Number(ms) + TZ);
const _ow = (_os) => String(_os).padStart(2, '0');
return _ow(_of.getUTCDate()) + '/' + _ow(_of.getUTCMonth() + 1) + '/' + _of.getUTCFullYear();
}
export function crc16(_o11) {
const _o8 = new TextEncoder().encode(String(_o11)); let _oe = 0xffff;
for (const _o19 of _o8) { _oe ^= _o19 << 8; for (let _om = 0; _om < 8; _om++) _oe = (_oe & 0x8000) ? ((_oe << 1) ^ 0x1021) & 0xffff : (_oe << 1) & 0xffff; }
return _oe.toString(16).toUpperCase().padStart(4, '0');
}
export function parseQr(_o11) {
_o11 = String(_o11 || ''); const fields = {}; let _oj = 0;
while (_oj + 4 <= _o11.length) { const id = _o11.substr(_oj, 2); const _oq = parseInt(_o11.substr(_oj + 2, 2), 10); if (!(_oq >= 0)) break; fields[id] = _o11.substr(_oj + 4, _oq); _oj += 4 + _oq; }
return { ok: !!fields['63'] && _o11.slice(-8, -4) === '6304' && crc16(_o11.slice(0, -4)) === fields['63'], fields };
}
export const PAY_PREFIX = 'BDSPAY1.';
export const PAY_BAD_TEXT = 'Thông tin nhận tiền không hợp lệ – không chuyển khoản, liên hệ hỗ trợ';
export function payBadView(reason, { orderCode = '', amount = 0, support = {}, money = (_os) => Number(_os).toLocaleString('vi-VN') + ' đ' } = {}) {
if (reason !== 'no_payee') return { title: PAY_BAD_TEXT + '.', lines: ['App không hiện mã QR vì thông tin nhận tiền không qua được bước kiểm tra an toàn. Đừng chuyển tiền theo bất kỳ số tài khoản nào khác.'] };
const _o12 = support && typeof support === 'object' ? support : {};
const _o17 = [_o12.zalo ? 'Zalo ' + _o12.zalo : '', _o12.email ? 'email ' + _o12.email : '', _o12.phone ? 'số ' + _o12.phone : ''].filter(Boolean);
return { title: 'Bản app này chưa bật chuyển khoản trong app – chưa có mã QR.',
lines: [(orderCode ? 'Đơn ' + orderCode + (Number(amount) > 0 ? ' (' + money(amount) + ')' : '') + ' đã được ghi nhận. ' : '') + 'Gửi mã đơn cho người bán' + (_o17.length ? ' qua ' + _o17.join(' hoặc ') : '') + ' để nhận thông tin chuyển khoản và mã bản quyền.',
'Chỉ chuyển tiền theo đúng tài khoản người bán xác nhận. Người bán xác nhận đã nhận tiền → mã tự vào app (hoặc nhập mã ở ô "Nhập mã bản quyền").'] };
}
export function trialPillText(daysLeft) { const _os = Math.max(0, Number(daysLeft) || 0); return 'Dùng thử còn ' + _os + ' ngày · Mua bản quyền'; }
export function buyTermNote(mode) {
if (mode === 'active' || mode === 'grace') return 'Thời gian mua thêm được cộng nối tiếp từ ngày hết hạn hiện tại.';
if (mode === 'trial') return 'Mua trong lúc dùng thử: thời gian tính tiếp sau ngày hết dùng thử.';
return 'Thời hạn tính từ khi người bán xác nhận đã nhận tiền – app mở lại đủ chức năng ngay, dữ liệu giữ nguyên.';
}
export function normPayee(_o11) {
return String(_o11 == null ? '' : _o11).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();
}
export function parsePay(blob) {
const m = /^BDSPAY1\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)$/.exec(String(blob || '').replace(/\s+/g, ''));
if (!m) return null;
try {
const json = _o9(m[1]); const _ow = JSON.parse(json);
if (!_ow || typeof _ow !== 'object' || _ow.v !== 1 || _ow.typ !== 'pay') return null;
return { payload: _ow, text: PAY_PREFIX + json, sig: m[2].replace(/-/g, '+').replace(/_/g, '/') };
} catch { return null; }
}
export function verifyPay(blob, { pubKey, payee, verifier, now = Date.now(), installId = '', orderCode = '', skewMs = 300000 } = {}) {
if (!blob) return { ok: false, reason: 'no_blob' };
const _o19 = parsePay(blob);
if (!_o19) return { ok: false, reason: 'bad_format' };
const _o16 = normPayee(payee);
if (!_o16) return { ok: false, reason: 'no_payee' };
const V = verifier || globalThis.BDSVerify;
if (!pubKey || !V) return { ok: false, reason: 'no_key' };
let _og = false;
try { _og = typeof V.verifySig === 'function' ? V.verifySig(_o19.text, _o19.sig, pubKey) : V.verify(_o19.text, _o19.sig, pubKey); } catch { _og = false; }
if (!_og) return { ok: false, reason: 'bad_sig' };
const _ow = _o19.payload;
if (typeof _ow.payee_name !== 'string' || _ow.payee_name !== _o16) return { ok: false, reason: 'payee_mismatch' };
if (installId && _ow.iid !== installId) return { ok: false, reason: 'wrong_install' };
if (orderCode && _ow.order_code !== orderCode) return { ok: false, reason: 'wrong_order' };
if (!(Number(_ow.exp) > now - skewMs)) return { ok: false, reason: 'expired' };
const amount = Number(_ow.amount), memo = String(_ow.memo);
const _or = _ow.memo === _ow.order_code ? /^[A-Z0-9]{4,25}$/.test(memo) : _ow.src === 'payos' && /^[A-Z0-9][A-Z0-9 ]{2,23}[A-Z0-9]$/.test(memo);
if (!/^\d{6}$/.test(String(_ow.bank_bin)) || !/^[0-9A-Z]{4,19}$/.test(String(_ow.account_no)) || !(Number.isInteger(amount) && amount > 0) || !_or) return { ok: false, reason: 'bad_fields' };
return { ok: true, pay: _ow };
}
function _o15(id, value) { value = String(value); const _oq = new TextEncoder().encode(value).length; return id + String(_oq).padStart(2, '0') + value; }
export function vietqr({ bin, account, amount, memo } = {}) {
const _o8 = String(bin || '').replace(/\D/g, ''); const _o5 = String(account || '').replace(/[^0-9A-Za-z]/g, '');
if (_o8.length !== 6 || !_o5) throw new Error('Thiếu mã ngân hàng / số tài khoản');
const _o6 = Math.round(Number(amount) || 0);
const _oc = String(memo || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'D').toUpperCase().replace(/[^A-Z0-9 ]/g, '').slice(0, 25);
const _o11 = _o15('00', '01') + _o15('01', _o6 > 0 ? '12' : '11')
+ _o15('38', _o15('00', 'A000000727') + _o15('01', _o15('00', _o8) + _o15('01', _o5)) + _o15('02', 'QRIBFTTA'))
+ _o15('53', '704') + (_o6 > 0 ? _o15('54', String(_o6)) : '') + _o15('58', 'VN') + (_oc ? _o15('62', _o15('08', _oc)) : '') + '6304';
return _o11 + crc16(_o11);
}
export const EDITIONS = { ca_nhan: 'Cá nhân', cong_ty: 'Công ty' };
export const MODE_LABEL = { trial: 'Dùng thử', active: 'Đang dùng', grace: 'Ân hạn', readonly: 'Chỉ xem', free: 'Gói Cơ bản miễn phí', unconfigured: 'Chưa cấu hình bản quyền' };
export const MODEL_LABEL = { whole_app: 'Mua bản quyền cho cả app', core_free_packs_paid: 'Gói Cơ bản miễn phí, mua bản quyền theo từng gói',
core_paid_packs_paid: 'Gói Cơ bản mua 1 lần (vĩnh viễn) + mua thêm gói mở rộng – cập nhật miễn phí' };
export const MODE_TONE = { trial: 'info', active: 'ok', grace: 'warn', readonly: 'danger', free: 'gold', unconfigured: 'warn' };
export default { MOVE_HELP, handoverText, graceFor, isErasureOp, isWriteControl, readonlyHint, pendingLeadsText, READONLY_TITLE_TRIAL, READONLY_TITLE_KEY, MEMBER_READONLY, ENTER_KEY_LABEL,
parseToken, verifyToken, computeState, packAllowed, packScopes, reminderKey, bannerFor, dmy, crc16, parseQr, DAY, TRIAL_DAYS, GRACE_DAYS, MODELS, MONTHS, EDITIONS, MODE_LABEL, MODE_TONE,
UNCONFIGURED_TEXT, isConfigured, isMisconfigured, unconfiguredState, clockSkew, serverNow, clientState, unsentWarning, MAX_SKEW_RTT,
PAY_PREFIX, PAY_BAD_TEXT, payBadView, buyTermNote, trialPillText, normPayee, parsePay, verifyPay, vietqr,
betaAllowed, betaKeep, PERPETUAL, isPerpetual, scopeCovers, hasBase, ownedItems, ownedText, perpetualOwned, baseOwned, scopeLabel, termLabel, buyOptions, NEEDS_BASE_TEXT, OWNED_TEXT, MODEL_LABEL };

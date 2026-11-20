export const SCOPES = [
{ id: 'luu', label: 'Lưu dữ liệu', hint: 'Lưu tên, số điện thoại, nhu cầu để tư vấn' },
{ id: 'cham_soc', label: 'Nhận tin chăm sóc', hint: 'Nhắn hỏi thăm, báo thông tin dự án khách quan tâm' },
{ id: 'quang_cao', label: 'Nhận tin quảng cáo', hint: 'Tin ưu đãi, dự án mới khách chưa hỏi' },
{ id: 'ai', label: 'Để AI xử lý thông tin', hint: 'Dữ liệu rút gọn, không số điện thoại/email' },
];
export const SCOPE_IDS = SCOPES.map(_o9 => _o9.id);
export const LEGACY_SCOPES = ['luu', 'cham_soc', 'ai'];
export const CHANNELS = [
{ id: 'truc_tiep', label: 'Trực tiếp' },
{ id: 'zalo', label: 'Zalo' },
{ id: 'landing', label: 'Form landing' },
{ id: 'dien_thoai', label: 'Điện thoại' },
{ id: 'nhap_danh_sach', label: 'Nhập từ danh sách cũ (có xác nhận)' },
];
export const LIMITS = { log: 60, note: 300, by: 80, notice: 40, noticeText: 2000, noticeVersions: 10 };
const _od = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);
const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
function parseData(_o2) {
if (!_o2) return {};
if (typeof _o2 === 'object') return _o2;
try { const v = JSON.parse(_o2); return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; } catch { return {}; }
}
let _oc = 0;
const newId = now => 'cs' + now.toString(36) + (++_oc).toString(36) + Math.random().toString(36).slice(2, 6);
const _o3 = c => !!c && (c.consent === true || Number(c.consent) === 1);
export function scopeLabel(id) { const _o9 = SCOPES.find(_oe => _oe.id === id); return _o9 ? _o9.label : String(id || ''); }
export function channelLabel(id) { const _o9 = CHANNELS.find(_oe => _oe.id === id); return _o9 ? _o9.label : String(id || ''); }
export function makeEntry(input, { now = Date.now() } = {}) {
const _oe = input && typeof input === 'object' ? input : {};
const act = _oe.act === 'withdraw' ? 'withdraw' : _oe.act === 'grant' ? 'grant' : '';
if (!act) return { ok: false, error: 'Chọn đồng ý hoặc rút lại.' };
const scopes = SCOPE_IDS.filter(id => Array.isArray(_oe.scopes) && _oe.scopes.includes(id));
if (!scopes.length) return { ok: false, error: 'Chọn ít nhất một phạm vi.' };
let channel = String(_oe.channel || '');
if (!CHANNELS.some(c => c.id === channel)) {
if (act === 'grant') return { ok: false, error: 'Chọn kênh khách đồng ý.' };
channel = 'truc_tiep';
}
const at = num(_oe.at) > 0 ? num(_oe.at) : now;
return { ok: true, entry: {
id: _od(_oe.id, 40) || newId(now), act, scopes, channel, at,
by: _od(_oe.by, 64), by_name: _od(_oe.by_name, LIMITS.by),
notice_version: _od(_oe.notice_version, LIMITS.notice), note: _od(_oe.note, LIMITS.note),
} };
}
export function readLog(c) {
const _o8 = parseData(c && c.data).consent_log;
if (!Array.isArray(_o8)) return [];
const _o6 = [];
for (const e of _o8) {
if (!e || typeof e !== 'object') continue;
const _o7 = makeEntry(e, { now: num(e.at) || 1 });
if (_o7.ok && num(e.at) > 0) _o6.push(_o7.entry);
}
return _o6.sort((a, b) => a.at - b.at);
}
function _ob(log) {
const _oa = Object.fromEntries(SCOPE_IDS.map(id => [id, { on: false, at: 0, by: '', by_name: '', channel: '' }]));
for (const e of log) for (const id of e.scopes) _oa[id] = { on: e.act === 'grant', at: e.at, by: e.by, by_name: e.by_name, channel: e.channel };
return _oa;
}
const _o1 = _oa => (_oa.luu.on && _oa.cham_soc.on ? 1 : 0);
export function withEntry(c, entry) {
const _o2 = { ...parseData(c && c.data) };
const log = [...readLog(c), entry].sort((a, b) => a.at - b.at).slice(-LIMITS.log);
_o2.consent_log = log;
return { data: JSON.stringify(_o2), consent: _o1(_ob(log)) };
}
export function stateOf(c) {
const log = readLog(c);
if (!log.length) {
const on = _o3(c);
const scopes = Object.fromEntries(SCOPE_IDS.map(id => [id, { on: on && LEGACY_SCOPES.includes(id), at: 0, by: '', by_name: '', channel: '' }]));
return { source: on ? 'legacy' : 'none', scopes, explicit: false, withdrawn: false, withdrawnAt: 0, recheck: false, lastAt: 0, log };
}
const scopes = _ob(log);
const off = SCOPE_IDS.filter(id => !scopes[id].on && log.some(e => e.act === 'withdraw' && e.scopes.includes(id)));
const withdrawn = off.length > 0 && (!scopes.luu.on || !scopes.cham_soc.on);
const withdrawnAt = withdrawn ? Math.max(...off.map(id => scopes[id].at)) : 0;
return { source: 'log', scopes, explicit: log.some(e => e.act === 'grant'), withdrawn, withdrawnAt, recheck: !_o1(scopes) && _o3(c), lastAt: log[log.length - 1].at, log };
}
export function allows(c, scope) { return !!c && SCOPE_IDS.includes(scope) && stateOf(c).scopes[scope].on; }
const _o0 = { profile: ['luu'], ai: ['luu', 'ai'], care: ['luu', 'cham_soc'], ads: ['luu', 'quang_cao'] };
export const PURPOSES = ['profile', 'ai', 'care', 'ads', 'contact'];
export function gate(c, purpose) {
if (!c) return { ok: false, reason: 'Không có hồ sơ khách.' };
const _o9 = stateOf(c);
const wd = 'Khách đã rút lại đồng ý' + (_o9.withdrawnAt ? ' ngày ' + dmy(_o9.withdrawnAt) : '') + ' – app đã khoá việc này.';
if (purpose === 'contact') {
if (_o9.source !== 'log') return { ok: true, reason: '' };
if (_o9.scopes.luu.on && _o9.scopes.cham_soc.on) return { ok: true, reason: '' };
return { ok: false, reason: _o9.withdrawn ? wd : 'Khách chưa đồng ý nhận tin chăm sóc – xem Nhật ký đồng ý.' };
}
const _o5 = _o0[purpose];
if (!_o5) return { ok: false, reason: 'Mục đích không rõ.' };
const _o4 = _o5.filter(id => !_o9.scopes[id].on);
if (!_o4.length) return { ok: true, reason: '' };
if (_o9.withdrawn || _o4.some(id => _o9.log.some(e => e.act === 'withdraw' && e.scopes.includes(id)))) return { ok: false, reason: wd };
return { ok: false, reason: 'Khách chưa đồng ý: ' + _o4.map(scopeLabel).join(', ').toLowerCase() + '.' };
}
export function needsExplicit(c) { return !stateOf(c).explicit; }
export function statusText(c) {
const _o9 = stateOf(c);
if (_o9.source === 'none') return { text: 'Chưa có đồng ý', tone: 'warn' };
if (_o9.source === 'legacy') return { text: 'Đồng ý cũ – chưa có nhật ký', tone: 'warn' };
if (_o9.withdrawn) return { text: 'Đã rút lại đồng ý' + (_o9.withdrawnAt ? ' ' + dmy(_o9.withdrawnAt) : ''), tone: 'danger' };
const on = SCOPES.filter(_oe => _o9.scopes[_oe.id].on).map(_oe => _oe.label.toLowerCase());
return { text: on.length ? 'Đã đồng ý: ' + on.join(', ') : 'Chưa có phạm vi nào hiệu lực', tone: on.length ? 'success' : 'warn' };
}
export function dmy(ms) { const _o2 = new Date(ms + 7 * 3600e3); return String(_o2.getUTCDate()).padStart(2, '0') + '/' + String(_o2.getUTCMonth() + 1).padStart(2, '0') + '/' + _o2.getUTCFullYear(); }

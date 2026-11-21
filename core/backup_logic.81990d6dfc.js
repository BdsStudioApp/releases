import { xlsxBook } from '../shared/xlsx_write.js';
export const FORMAT = 'studio-backup';
export const FORMAT_V = 2;
export const BACKUP_TABLES = ['objects', 'events', 'reminders', 'policies', 'quotes', 'projects', 'jobs', 'ideas', 'settings'];
export const BACKUP_ITER = 150000;
export const MAX_FILE_BYTES = 30 * 1024 * 1024;
export const MAX_ROWS = 150000;
export const REMIND_DAYS = 7;
export const MIN_PW = 8;
const DAY = 86400000;
export const MSG = {
BAD_FORMAT: 'Tệp không phải bản sao lưu của app hoặc đã hỏng.',
NEWER_FORMAT: 'Tệp sao lưu tạo từ bản app mới hơn – hãy cập nhật app rồi khôi phục lại.',
TOO_LARGE: 'Tệp quá lớn (tối đa 30 MB).',
TOO_MANY_ROWS: 'Tệp có quá nhiều dòng (tối đa 150.000) – khôi phục sẽ làm treo trình duyệt.',
NEED_PASSWORD: 'Tệp đã mã hoá – nhập mật khẩu của tệp rồi chọn lại.',
BAD_PASSWORD: 'Mật khẩu không đúng hoặc tệp đã bị sửa.',
SHORT_PASSWORD: 'Mật khẩu cần ít nhất 8 ký tự.',
MISMATCH: 'Hai lần nhập mật khẩu không khớp.',
BAD_MODE: 'Chế độ khôi phục không hợp lệ.',
};
function _og(code, msg) { const e = new Error(msg || MSG[code] || code); e.code = code; e.userMessage = e.message; throw e; }
export const SERVER_ONLY_SETTING = /^(_|budget$|pepper|secret|pw_|login_f|setup_done|schema_v|tg_|users|gemini_key$|claude_key$|telegram_token$|telegram_chat_id$|owner_email$)/;
const _o2 = /^(api[_-]?key|apikey|secret|client[_-]?secret|password|passwd|pass|pwd|pw|pw_hash|pw_stored|pw_salt|pepper|token|access[_-]?token|refresh[_-]?token|id[_-]?token|auth[_-]?token|bot[_-]?token|private[_-]?key|credentials?|cookie|otp[_-]?secret|totp[_-]?secret|tfa[_-]?secret|authorization)$/i;
const _o3 = /(^|[._-])(api[_-]?key|(gemini|claude|openai|anthropic|google|maps|vbee|elevenlabs|bot|secret|private|access)[_-]?key|token|secret|password|passwd)$/i;
export function isSecretName(name) { const _op = String(name || ''); return _o2.test(_op) || _o3.test(_op); }
const _o4 = /AIza[0-9A-Za-z_-]{30,}|sk-(?:ant-)?[A-Za-z0-9_-]{20,}|\b\d{6,12}:[A-Za-z0-9_-]{30,}|\bgh[pousr]_[A-Za-z0-9]{30,}|\bxox[abprs]-[A-Za-z0-9-]{10,}|\bya29\.[0-9A-Za-z_-]{20,}/g;
const _o1 = '[đã ẩn]';
const _on = (_o10) => /^\s*[[{]/.test(_o10);
export function dropSetting(key) { const _om = String(key || ''); return !_om || SERVER_ONLY_SETTING.test(_om) || isSecretName(_om); }
export function redactValue(v, depth = 0) {
if (depth > 40) return [v, 0];
if (typeof v === 'string') {
if (_on(v)) {
let _os; try { _os = JSON.parse(v); } catch { _os = undefined; }
if (_os && typeof _os === 'object') { const [r, _op] = redactValue(_os, depth + 1); return _op ? [JSON.stringify(r), _op] : [v, 0]; }
}
let _op = 0; const out = v.replace(_o4, () => { _op++; return _o1; });
return [out, _op];
}
if (Array.isArray(v)) { let _op = 0; const out = v.map((_o13) => { const [r, _om] = redactValue(_o13, depth + 1); _op += _om; return r; }); return [out, _op]; }
if (v && typeof v === 'object') {
let _op = 0; const out = {};
for (const [_om, _o13] of Object.entries(v)) {
if (isSecretName(_om)) { _op++; continue; }
const [r, _oa] = redactValue(_o13, depth + 1); _op += _oa; out[_om] = r;
}
return [out, _op];
}
return [v, 0];
}
export function findSecrets(obj, path = '$', out = [], depth = 0) {
if (depth > 40 || out.length > 50) return out;
if (typeof obj === 'string') {
_o4.lastIndex = 0;
if (_o4.test(obj)) out.push(path);
else if (_on(obj)) { let _os; try { _os = JSON.parse(obj); } catch { _os = undefined; } if (_os && typeof _os === 'object') findSecrets(_os, path, out, depth + 1); }
_o4.lastIndex = 0;
return out;
}
if (Array.isArray(obj)) { obj.forEach((_o13, _oi) => findSecrets(_o13, path + '[' + _oi + ']', out, depth + 1)); return out; }
if (obj && typeof obj === 'object') {
for (const [_om, _o13] of Object.entries(obj)) {
if (isSecretName(_om)) { out.push(path + '.' + _om); continue; }
findSecrets(_o13, path + '.' + _om, out, depth + 1);
}
}
return out;
}
const _ok = (r) => !!(r && Number(r.deleted));
const kindOf = (r) => String((r && r.kind) || '');
export function countsOf(tables) {
const _or = (tables.objects || []);
const _oa = {
customers: _or.filter((r) => kindOf(r) === 'customer' || !kindOf(r)).length,
partners: _or.filter((r) => kindOf(r) === 'g4_partner').length,
};
_oa.other_objects = _or.length - _oa.customers - _oa.partners;
for (const tb of BACKUP_TABLES) if (tb !== 'objects') _oa[tb] = (tables[tb] || []).length;
_oa.total = Object.values(tables).reduce((_o10, rows) => _o10 + (Array.isArray(rows) ? rows.length : 0), 0);
return _oa;
}
export async function collectBackup(store, { appVersion = '', app = 'studio', now = Date.now(), tables = BACKUP_TABLES } = {}) {
const out = {}; let redacted = 0;
for (const tb of tables) {
const rows = await store.list(tb, null, { includeDeleted: false });
out[tb] = [];
for (const r of rows || []) {
if (!r || typeof r !== 'object' || _ok(r)) continue;
if (tb === 'settings' && dropSetting(r.key)) { redacted++; continue; }
const [clean, _op] = redactValue(r); redacted += _op; out[tb].push(clean);
}
}
return { format: FORMAT, v: FORMAT_V, app, app_version: String(appVersion || ''), created_at: now, counts: countsOf(out), encrypted: false, redacted, tables: out };
}
const subtle = () => globalThis.crypto.subtle;
export function rand(_op) { const r = new Uint8Array(_op); globalThis.crypto.getRandomValues(r); return r; }
export function toB64(u8) { let _o10 = ''; const _o6 = new Uint8Array(u8); for (let _oi = 0; _oi < _o6.length; _oi += 0x8000) _o10 += String.fromCharCode.apply(null, _o6.subarray(_oi, _oi + 0x8000)); return btoa(_o10); }
export function fromB64(b) { const _o10 = atob(String(b)); const _o6 = new Uint8Array(_o10.length); for (let _oi = 0; _oi < _o10.length; _oi++) _o6[_oi] = _o10.charCodeAt(_oi); return _o6; }
export async function deriveKey(password, salt, iter) {
const base = await subtle().importKey('raw', new TextEncoder().encode(String(password)), 'PBKDF2', false, ['deriveKey']);
return subtle().deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
const _o7 = (_od) => new TextEncoder().encode(JSON.stringify([_od.format, _od.v, _od.app || '', _od.app_version || '', Number(_od.created_at) || 0, _od.counts || {}]));
export function checkPasswords(p1, p2) {
if (String(p1 || '').length < MIN_PW) return { ok: false, code: 'SHORT_PASSWORD', message: MSG.SHORT_PASSWORD };
if (String(p1) !== String(p2 || '')) return { ok: false, code: 'MISMATCH', message: MSG.MISMATCH };
return { ok: true };
}
export async function encryptDoc(doc, password, { iter = BACKUP_ITER } = {}) {
if (String(password || '').length < MIN_PW) _og('BAD_INPUT', MSG.SHORT_PASSWORD);
const head = { format: FORMAT, v: FORMAT_V, app: doc.app || 'studio', app_version: doc.app_version || '', created_at: Number(doc.created_at) || Date.now(), counts: doc.counts || countsOf(doc.tables || {}) };
const salt = rand(16), iv = rand(12);
const key = await deriveKey(password, salt, iter);
const _ox = new TextEncoder().encode(JSON.stringify({ tables: doc.tables || {}, redacted: doc.redacted || 0 }));
const ct = await subtle().encrypt({ name: 'AES-GCM', iv, additionalData: _o7(head) }, key, _ox);
return { ...head, encrypted: true, enc: { alg: 'AES-GCM-256', kdf: 'PBKDF2-SHA256', hash: 'SHA-256', iter, salt: toB64(salt), iv: toB64(iv) }, ct: toB64(new Uint8Array(ct)) };
}
async function _of(_ow, password) {
const e = _ow.enc || {};
const iter = Number(e.iter);
if (!e.salt || !e.iv || !_ow.ct || !(iter >= 1000 && iter <= 10000000)) _og('BAD_FORMAT');
let _ox;
try {
const key = await deriveKey(password, fromB64(e.salt), iter);
_ox = await subtle().decrypt({ name: 'AES-GCM', iv: fromB64(e.iv), additionalData: _o7(_ow) }, key, fromB64(_ow.ct));
} catch { _og('BAD_PASSWORD'); }
try { return JSON.parse(new TextDecoder().decode(_ox)); } catch { _og('BAD_FORMAT'); }
}
async function _oe(_ow, password) {
let _ox;
try {
const key = await deriveKey(password, fromB64(_ow.salt), Number(_ow.iter) || BACKUP_ITER);
_ox = await subtle().decrypt({ name: 'AES-GCM', iv: fromB64(_ow.iv) }, key, fromB64(_ow.ct));
} catch { _og('BAD_PASSWORD'); }
try { return JSON.parse(new TextDecoder().decode(_ox)); } catch { _og('BAD_FORMAT'); }
}
export function isNewerVersion(_o6, b) {
const _ot = String(_o6 || '').split('.').map((_o13) => parseInt(_o13, 10)); const _ou = String(b || '').split('.').map((_o13) => parseInt(_o13, 10));
if (!_o6 || _ot.some((_o13) => !Number.isFinite(_o13)) || !b) return false;
for (let _oi = 0; _oi < Math.max(_ot.length, _ou.length); _oi++) { const _o13 = _ot[_oi] || 0, y = _ou[_oi] || 0; if (_o13 !== y) return _o13 > y; }
return false;
}
export function checkFileSize(bytes, maxBytes = MAX_FILE_BYTES) { if (!(Number(bytes) <= maxBytes)) _og('TOO_LARGE'); return true; }
function _oc(tables, maxRows) {
if (!tables || typeof tables !== 'object' || Array.isArray(tables)) _og('BAD_FORMAT');
let _op = 0;
for (const rows of Object.values(tables)) {
if (!Array.isArray(rows)) _og('BAD_FORMAT');
_op += rows.length;
if (_op > maxRows) _og('TOO_MANY_ROWS');
}
return _op;
}
export async function openBackup(text, password, { appVersion = '', maxBytes = MAX_FILE_BYTES, maxRows = MAX_ROWS } = {}) {
if (typeof text !== 'string') _og('BAD_FORMAT');
checkFileSize(text.length, maxBytes);
let _ow; try { _ow = JSON.parse(text); } catch { _og('BAD_FORMAT'); }
if (!_ow || typeof _ow !== 'object' || Array.isArray(_ow)) _og('BAD_FORMAT');
let meta, inner;
if (_ow.v === 1 && _ow.ct && _ow.format === undefined) {
if (!password) _og('NEED_PASSWORD');
inner = await _oe(_ow, password);
meta = { v: 1, app: _ow.app || '', app_version: '', created_at: Number(_ow.created_at) || 0, encrypted: true };
} else {
if (_ow.format !== FORMAT) _og('BAD_FORMAT');
const v = Number(_ow.v);
if (!Number.isFinite(v) || v < 1) _og('BAD_FORMAT');
if (v > FORMAT_V) _og('NEWER_FORMAT');
meta = { v, app: _ow.app || '', app_version: String(_ow.app_version || ''), created_at: Number(_ow.created_at) || 0, encrypted: !!_ow.encrypted, counts: _ow.counts || null };
if (_ow.encrypted) {
if (!password) _og('NEED_PASSWORD');
inner = await _of(_ow, password);
} else inner = _ow;
}
const tables = inner && inner.tables;
meta.rows = _oc(tables, maxRows);
meta.newer_app = isNewerVersion(meta.app_version, appVersion);
if (!meta.counts) meta.counts = countsOf(tables);
return { meta, tables };
}
const _oj = (tb, r) => (tb === 'settings' ? r.key : r.id);
const _ov = (r) => { const v = r && r.data; if (v && typeof v === 'object') return v; try { return JSON.parse(v || '{}') || {}; } catch { return {}; } };
export const isErasedRow = (r) => !!r && Number(_ov(r).erased) === 1;
const _oz = (r) => { const _od = _ov(r); return [_od.customer_id, ...(Array.isArray(_od.customer_ids) ? _od.customer_ids : [])].filter(Boolean).map(String); };
export function erasedBlocked(tb, r, erased) {
if (!erased || !erased.size || !r) return false;
if (tb === 'objects') return erased.has(String(r.id)) || _oz(r).some((_o13) => erased.has(_o13));
return (tb === 'events' || tb === 'reminders' || tb === 'quotes') && erased.has(String(r.object_id));
}
export async function planRestore(store, tables) {
const plan = { add: [], dup: [], skip: 0, erased: 0, byTable: {} };
const erased = new Set();
for (const r of await store.list('objects', null, { includeDeleted: true }) || []) if (isErasedRow(r)) erased.add(String(r.id));
for (const r of Array.isArray(tables && tables.objects) ? tables.objects : []) if (isErasedRow(r)) erased.add(String(r.id));
for (const [tb, rows] of Object.entries(tables || {})) {
const _o9 = plan.byTable[tb] = { add: 0, dup: 0, skip: 0 };
const list = Array.isArray(rows) ? rows : [];
if (!BACKUP_TABLES.includes(tb)) { _o9.skip = list.length; plan.skip += list.length; continue; }
const _oh = new Set((await store.list(tb, null, { includeDeleted: true }) || []).map((r) => String(_oj(tb, r))));
const _o11 = new Set();
for (const r of list) {
const id = r && typeof r === 'object' && !Array.isArray(r) ? _oj(tb, r) : null;
const _o8 = id == null || id === '' || String(id).length > 200 || _o11.has(String(id)) || _ok(r) || (tb === 'settings' && dropSetting(id));
if (_o8) { _o9.skip++; plan.skip++; continue; }
if (erasedBlocked(tb, r, erased)) { _o9.skip++; plan.skip++; plan.erased++; continue; }
_o11.add(String(id));
const [row] = redactValue(r);
if (_oh.has(String(id))) { plan.dup.push({ tb, row }); _o9.dup++; } else { plan.add.push({ tb, row }); _o9.add++; }
}
}
return plan;
}
export function previewText(plan) {
return 'Sẽ thêm ' + plan.add.length + ' mục mới, trùng ' + plan.dup.length + ' mục đã có, bỏ qua ' + plan.skip + ' mục.';
}
export async function applyPlan(store, plan, mode = 'add') {
if (mode !== 'add' && mode !== 'overwrite') _og('BAD_INPUT', MSG.BAD_MODE);
const _ol = mode === 'overwrite' ? [...plan.add, ...plan.dup] : plan.add;
let _op = 0;
for (const { tb, row } of _ol) {
await store.put(tb, { ...row });
if (++_op % 300 === 0) await new Promise((r) => setTimeout(r, 0));
}
return _op;
}
export function pickLastAt(...vals) { let _oo = 0; for (const v of vals) { const _op = Number(v); if (Number.isFinite(_op) && _op > _oo) _oo = _op; } return _oo; }
export function daysSince(at, now = Date.now()) { return Math.max(0, Math.floor((now - Number(at)) / DAY)); }
export function backupDue({ lastAt = 0, firstSeen = 0, oldestCustomer = 0, snoozeUntil = 0, now = Date.now(), days = REMIND_DAYS } = {}) {
if (Number(snoozeUntil) > now) return false;
const _oy = Number(lastAt) || Number(firstSeen) || Number(oldestCustomer) || 0;
if (!_oy) return false;
return now - _oy > days * DAY;
}
export function xlsxCellSafe(v) {
if (v == null) return '';
if (typeof v !== 'string') return v;
let _o10 = v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
if (/^[=+\-@\t\r]/.test(_o10)) _o10 = "'" + _o10;
return _o10;
}
const vnDate = (ms) => { const _op = Number(ms); if (!_op) return ''; const _od = new Date(_op + 7 * 3600000); const _os = (_o13) => String(_o13).padStart(2, '0'); return _os(_od.getUTCDate()) + '/' + _os(_od.getUTCMonth() + 1) + '/' + _od.getUTCFullYear(); };
export const SHEET_HEAD = ['Tên', 'Điện thoại', 'Zalo', 'Email', 'Trạng thái', 'Nhu cầu', 'Dự án', 'Loại căn', 'Ngân sách (đồng)', 'Nguồn', 'Nhãn', 'Ghi chú', 'Ngày sinh', 'Ngày tạo'];
export function customerSheetRows(tables) {
const _oq = new Map((tables.projects || []).map((_os) => [String(_os.id), _os.name]));
const rows = (tables.objects || []).filter((r) => r && !_ok(r) && (kindOf(r) === 'customer' || !kindOf(r)));
return [SHEET_HEAD, ...rows.map((_oa) => [
_oa.name, _oa.phone, _oa.zalo, _oa.email, _oa.status, _oa.need, _oq.get(String(_oa.project)) || _oa.project, _oa.unit_type,
Number(_oa.budget) > 0 ? Number(_oa.budget) : '', _oa.source, Array.isArray(_oa.tags) ? _oa.tags.join(', ') : _oa.tags, _oa.note, _oa.birthday, vnDate(_oa.created_at),
].map((v) => xlsxCellSafe(v == null ? '' : (typeof v === 'number' ? v : String(v)))))];
}
const _o5 = [26, 14, 14, 24, 14, 12, 22, 14, 16, 12, 18, 40, 12, 12];
export function customersXlsx(tables) {
return xlsxBook([{ name: 'Khách', header: true, rows: customerSheetRows(tables), cols: _o5.map((w, _oi) => ({ width: w, text: _oi === 1 || _oi === 2 })) }]);
}
export const TABLE_SHEET = { objects: 'Hồ sơ (tất cả)', events: 'Lịch sử chăm sóc', reminders: 'Nhắc việc', policies: 'Chính sách', quotes: 'Báo giá', projects: 'Dự án', jobs: 'Việc', ideas: 'Ý tưởng', settings: 'Cài đặt' };
const _o0 = 32000;
function _ob(v) {
if (v == null) return '';
if (typeof v === 'number') return Number.isFinite(v) ? v : '';
if (typeof v === 'boolean') return v ? 1 : 0;
let _o10 = typeof v === 'object' ? JSON.stringify(v) : String(v);
if (_o10.length > _o0) _o10 = _o10.slice(0, _o0) + '…';
return xlsxCellSafe(_o10);
}
export function tableSheetRows(rows) {
const list = (rows || []).filter((r) => r && typeof r === 'object');
const cols = [];
const _o11 = new Set();
for (const _om of ['id', 'key']) if (list.some((r) => _om in r)) { cols.push(_om); _o11.add(_om); }
for (const r of list) for (const _om of Object.keys(r)) if (!_o11.has(_om)) { _o11.add(_om); cols.push(_om); }
return [cols, ...list.map((r) => cols.map((_om) => _ob(r[_om])))];
}
export function allTablesXlsx(tables, { order = BACKUP_TABLES } = {}) {
const _o12 = [{ name: 'Khách', header: true, rows: customerSheetRows(tables), cols: _o5.map((w, _oi) => ({ width: w, text: _oi === 1 || _oi === 2 })) }];
for (const tb of order) {
const rows = tableSheetRows(tables[tb] || []);
_o12.push({ name: TABLE_SHEET[tb] || tb, header: true, rows: rows[0].length ? rows : [['(trống)']] });
}
return xlsxBook(_o12);
}
export function backupFileName(now = Date.now(), encrypted = false) {
const _od = new Date(Number(now) + 7 * 3600000); const _os = (_o13) => String(_o13).padStart(2, '0');
return 'sao-luu-' + _od.getUTCFullYear() + '-' + _os(_od.getUTCMonth() + 1) + '-' + _os(_od.getUTCDate()) + '-' + _os(_od.getUTCHours()) + _os(_od.getUTCMinutes()) + (encrypted ? '.ma-hoa' : '') + '.json';
}
export default { collectBackup, encryptDoc, openBackup, planRestore, applyPlan, previewText, backupDue, pickLastAt, daysSince, customersXlsx, customerSheetRows, allTablesXlsx, tableSheetRows, xlsxCellSafe, findSecrets, redactValue, checkPasswords, backupFileName, isNewerVersion, checkFileSize };

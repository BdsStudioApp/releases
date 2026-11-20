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
function _oe(code, msg) { const e = new Error(msg || MSG[code] || code); e.code = code; e.userMessage = e.message; throw e; }
export const SERVER_ONLY_SETTING = /^(_|budget$|pepper|secret|pw_|login_f|setup_done|schema_v|tg_|users|gemini_key$|claude_key$|telegram_token$|telegram_chat_id$|owner_email$)/;
const _o1 = /^(api[_-]?key|apikey|secret|client[_-]?secret|password|passwd|pass|pwd|pw|pw_hash|pw_stored|pw_salt|pepper|token|access[_-]?token|refresh[_-]?token|id[_-]?token|auth[_-]?token|bot[_-]?token|private[_-]?key|credentials?|cookie|otp[_-]?secret|totp[_-]?secret|tfa[_-]?secret|authorization)$/i;
const _o2 = /(^|[._-])(api[_-]?key|(gemini|claude|openai|anthropic|google|maps|vbee|elevenlabs|bot|secret|private|access)[_-]?key|token|secret|password|passwd)$/i;
export function isSecretName(name) { const _on = String(name || ''); return _o1.test(_on) || _o2.test(_on); }
const _o3 = /AIza[0-9A-Za-z_-]{30,}|sk-(?:ant-)?[A-Za-z0-9_-]{20,}|\b\d{6,12}:[A-Za-z0-9_-]{30,}|\bgh[pousr]_[A-Za-z0-9]{30,}|\bxox[abprs]-[A-Za-z0-9-]{10,}|\bya29\.[0-9A-Za-z_-]{20,}/g;
const _o0 = '[đã ẩn]';
const _ol = (_oy) => /^\s*[[{]/.test(_oy);
export function dropSetting(key) { const _ok = String(key || ''); return !_ok || SERVER_ONLY_SETTING.test(_ok) || isSecretName(_ok); }
export function redactValue(v, depth = 0) {
if (depth > 40) return [v, 0];
if (typeof v === 'string') {
if (_ol(v)) {
let _oq; try { _oq = JSON.parse(v); } catch { _oq = undefined; }
if (_oq && typeof _oq === 'object') { const [r, _on] = redactValue(_oq, depth + 1); return _on ? [JSON.stringify(r), _on] : [v, 0]; }
}
let _on = 0; const out = v.replace(_o3, () => { _on++; return _o0; });
return [out, _on];
}
if (Array.isArray(v)) { let _on = 0; const out = v.map((_o10) => { const [r, _ok] = redactValue(_o10, depth + 1); _on += _ok; return r; }); return [out, _on]; }
if (v && typeof v === 'object') {
let _on = 0; const out = {};
for (const [_ok, _o10] of Object.entries(v)) {
if (isSecretName(_ok)) { _on++; continue; }
const [r, _o9] = redactValue(_o10, depth + 1); _on += _o9; out[_ok] = r;
}
return [out, _on];
}
return [v, 0];
}
export function findSecrets(obj, path = '$', out = [], depth = 0) {
if (depth > 40 || out.length > 50) return out;
if (typeof obj === 'string') {
_o3.lastIndex = 0;
if (_o3.test(obj)) out.push(path);
else if (_ol(obj)) { let _oq; try { _oq = JSON.parse(obj); } catch { _oq = undefined; } if (_oq && typeof _oq === 'object') findSecrets(_oq, path, out, depth + 1); }
_o3.lastIndex = 0;
return out;
}
if (Array.isArray(obj)) { obj.forEach((_o10, _og) => findSecrets(_o10, path + '[' + _og + ']', out, depth + 1)); return out; }
if (obj && typeof obj === 'object') {
for (const [_ok, _o10] of Object.entries(obj)) {
if (isSecretName(_ok)) { out.push(path + '.' + _ok); continue; }
findSecrets(_o10, path + '.' + _ok, out, depth + 1);
}
}
return out;
}
const _oi = (r) => !!(r && Number(r.deleted));
const kindOf = (r) => String((r && r.kind) || '');
export function countsOf(tables) {
const _op = (tables.objects || []);
const _o9 = {
customers: _op.filter((r) => kindOf(r) === 'customer' || !kindOf(r)).length,
partners: _op.filter((r) => kindOf(r) === 'g4_partner').length,
};
_o9.other_objects = _op.length - _o9.customers - _o9.partners;
for (const tb of BACKUP_TABLES) if (tb !== 'objects') _o9[tb] = (tables[tb] || []).length;
_o9.total = Object.values(tables).reduce((_oy, rows) => _oy + (Array.isArray(rows) ? rows.length : 0), 0);
return _o9;
}
export async function collectBackup(store, { appVersion = '', app = 'studio', now = Date.now(), tables = BACKUP_TABLES } = {}) {
const out = {}; let redacted = 0;
for (const tb of tables) {
const rows = await store.list(tb, null, { includeDeleted: false });
out[tb] = [];
for (const r of rows || []) {
if (!r || typeof r !== 'object' || _oi(r)) continue;
if (tb === 'settings' && dropSetting(r.key)) { redacted++; continue; }
const [clean, _on] = redactValue(r); redacted += _on; out[tb].push(clean);
}
}
return { format: FORMAT, v: FORMAT_V, app, app_version: String(appVersion || ''), created_at: now, counts: countsOf(out), encrypted: false, redacted, tables: out };
}
const subtle = () => globalThis.crypto.subtle;
export function rand(_on) { const r = new Uint8Array(_on); globalThis.crypto.getRandomValues(r); return r; }
export function toB64(u8) { let _oy = ''; const _o5 = new Uint8Array(u8); for (let _og = 0; _og < _o5.length; _og += 0x8000) _oy += String.fromCharCode.apply(null, _o5.subarray(_og, _og + 0x8000)); return btoa(_oy); }
export function fromB64(b) { const _oy = atob(String(b)); const _o5 = new Uint8Array(_oy.length); for (let _og = 0; _og < _oy.length; _og++) _o5[_og] = _oy.charCodeAt(_og); return _o5; }
export async function deriveKey(password, salt, iter) {
const base = await subtle().importKey('raw', new TextEncoder().encode(String(password)), 'PBKDF2', false, ['deriveKey']);
return subtle().deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
const _o6 = (_ob) => new TextEncoder().encode(JSON.stringify([_ob.format, _ob.v, _ob.app || '', _ob.app_version || '', Number(_ob.created_at) || 0, _ob.counts || {}]));
export function checkPasswords(p1, p2) {
if (String(p1 || '').length < MIN_PW) return { ok: false, code: 'SHORT_PASSWORD', message: MSG.SHORT_PASSWORD };
if (String(p1) !== String(p2 || '')) return { ok: false, code: 'MISMATCH', message: MSG.MISMATCH };
return { ok: true };
}
export async function encryptDoc(doc, password, { iter = BACKUP_ITER } = {}) {
if (String(password || '').length < MIN_PW) _oe('BAD_INPUT', MSG.SHORT_PASSWORD);
const head = { format: FORMAT, v: FORMAT_V, app: doc.app || 'studio', app_version: doc.app_version || '', created_at: Number(doc.created_at) || Date.now(), counts: doc.counts || countsOf(doc.tables || {}) };
const salt = rand(16), iv = rand(12);
const key = await deriveKey(password, salt, iter);
const _ov = new TextEncoder().encode(JSON.stringify({ tables: doc.tables || {}, redacted: doc.redacted || 0 }));
const ct = await subtle().encrypt({ name: 'AES-GCM', iv, additionalData: _o6(head) }, key, _ov);
return { ...head, encrypted: true, enc: { alg: 'AES-GCM-256', kdf: 'PBKDF2-SHA256', hash: 'SHA-256', iter, salt: toB64(salt), iv: toB64(iv) }, ct: toB64(new Uint8Array(ct)) };
}
async function _od(_ou, password) {
const e = _ou.enc || {};
const iter = Number(e.iter);
if (!e.salt || !e.iv || !_ou.ct || !(iter >= 1000 && iter <= 10000000)) _oe('BAD_FORMAT');
let _ov;
try {
const key = await deriveKey(password, fromB64(e.salt), iter);
_ov = await subtle().decrypt({ name: 'AES-GCM', iv: fromB64(e.iv), additionalData: _o6(_ou) }, key, fromB64(_ou.ct));
} catch { _oe('BAD_PASSWORD'); }
try { return JSON.parse(new TextDecoder().decode(_ov)); } catch { _oe('BAD_FORMAT'); }
}
async function _oc(_ou, password) {
let _ov;
try {
const key = await deriveKey(password, fromB64(_ou.salt), Number(_ou.iter) || BACKUP_ITER);
_ov = await subtle().decrypt({ name: 'AES-GCM', iv: fromB64(_ou.iv) }, key, fromB64(_ou.ct));
} catch { _oe('BAD_PASSWORD'); }
try { return JSON.parse(new TextDecoder().decode(_ov)); } catch { _oe('BAD_FORMAT'); }
}
export function isNewerVersion(_o5, b) {
const _or = String(_o5 || '').split('.').map((_o10) => parseInt(_o10, 10)); const _os = String(b || '').split('.').map((_o10) => parseInt(_o10, 10));
if (!_o5 || _or.some((_o10) => !Number.isFinite(_o10)) || !b) return false;
for (let _og = 0; _og < Math.max(_or.length, _os.length); _og++) { const _o10 = _or[_og] || 0, y = _os[_og] || 0; if (_o10 !== y) return _o10 > y; }
return false;
}
export function checkFileSize(bytes, maxBytes = MAX_FILE_BYTES) { if (!(Number(bytes) <= maxBytes)) _oe('TOO_LARGE'); return true; }
function _oa(tables, maxRows) {
if (!tables || typeof tables !== 'object' || Array.isArray(tables)) _oe('BAD_FORMAT');
let _on = 0;
for (const rows of Object.values(tables)) {
if (!Array.isArray(rows)) _oe('BAD_FORMAT');
_on += rows.length;
if (_on > maxRows) _oe('TOO_MANY_ROWS');
}
return _on;
}
export async function openBackup(text, password, { appVersion = '', maxBytes = MAX_FILE_BYTES, maxRows = MAX_ROWS } = {}) {
if (typeof text !== 'string') _oe('BAD_FORMAT');
checkFileSize(text.length, maxBytes);
let _ou; try { _ou = JSON.parse(text); } catch { _oe('BAD_FORMAT'); }
if (!_ou || typeof _ou !== 'object' || Array.isArray(_ou)) _oe('BAD_FORMAT');
let meta, inner;
if (_ou.v === 1 && _ou.ct && _ou.format === undefined) {
if (!password) _oe('NEED_PASSWORD');
inner = await _oc(_ou, password);
meta = { v: 1, app: _ou.app || '', app_version: '', created_at: Number(_ou.created_at) || 0, encrypted: true };
} else {
if (_ou.format !== FORMAT) _oe('BAD_FORMAT');
const v = Number(_ou.v);
if (!Number.isFinite(v) || v < 1) _oe('BAD_FORMAT');
if (v > FORMAT_V) _oe('NEWER_FORMAT');
meta = { v, app: _ou.app || '', app_version: String(_ou.app_version || ''), created_at: Number(_ou.created_at) || 0, encrypted: !!_ou.encrypted, counts: _ou.counts || null };
if (_ou.encrypted) {
if (!password) _oe('NEED_PASSWORD');
inner = await _od(_ou, password);
} else inner = _ou;
}
const tables = inner && inner.tables;
meta.rows = _oa(tables, maxRows);
meta.newer_app = isNewerVersion(meta.app_version, appVersion);
if (!meta.counts) meta.counts = countsOf(tables);
return { meta, tables };
}
const _oh = (tb, r) => (tb === 'settings' ? r.key : r.id);
const _ot = (r) => { const v = r && r.data; if (v && typeof v === 'object') return v; try { return JSON.parse(v || '{}') || {}; } catch { return {}; } };
export const isErasedRow = (r) => !!r && Number(_ot(r).erased) === 1;
const _ox = (r) => { const _ob = _ot(r); return [_ob.customer_id, ...(Array.isArray(_ob.customer_ids) ? _ob.customer_ids : [])].filter(Boolean).map(String); };
export function erasedBlocked(tb, r, erased) {
if (!erased || !erased.size || !r) return false;
if (tb === 'objects') return erased.has(String(r.id)) || _ox(r).some((_o10) => erased.has(_o10));
return (tb === 'events' || tb === 'reminders' || tb === 'quotes') && erased.has(String(r.object_id));
}
export async function planRestore(store, tables) {
const plan = { add: [], dup: [], skip: 0, erased: 0, byTable: {} };
const erased = new Set();
for (const r of await store.list('objects', null, { includeDeleted: true }) || []) if (isErasedRow(r)) erased.add(String(r.id));
for (const r of Array.isArray(tables && tables.objects) ? tables.objects : []) if (isErasedRow(r)) erased.add(String(r.id));
for (const [tb, rows] of Object.entries(tables || {})) {
const _o8 = plan.byTable[tb] = { add: 0, dup: 0, skip: 0 };
const list = Array.isArray(rows) ? rows : [];
if (!BACKUP_TABLES.includes(tb)) { _o8.skip = list.length; plan.skip += list.length; continue; }
const _of = new Set((await store.list(tb, null, { includeDeleted: true }) || []).map((r) => String(_oh(tb, r))));
const _oz = new Set();
for (const r of list) {
const id = r && typeof r === 'object' && !Array.isArray(r) ? _oh(tb, r) : null;
const _o7 = id == null || id === '' || String(id).length > 200 || _oz.has(String(id)) || _oi(r) || (tb === 'settings' && dropSetting(id));
if (_o7) { _o8.skip++; plan.skip++; continue; }
if (erasedBlocked(tb, r, erased)) { _o8.skip++; plan.skip++; plan.erased++; continue; }
_oz.add(String(id));
const [row] = redactValue(r);
if (_of.has(String(id))) { plan.dup.push({ tb, row }); _o8.dup++; } else { plan.add.push({ tb, row }); _o8.add++; }
}
}
return plan;
}
export function previewText(plan) {
return 'Sẽ thêm ' + plan.add.length + ' mục mới, trùng ' + plan.dup.length + ' mục đã có, bỏ qua ' + plan.skip + ' mục.';
}
export async function applyPlan(store, plan, mode = 'add') {
if (mode !== 'add' && mode !== 'overwrite') _oe('BAD_INPUT', MSG.BAD_MODE);
const _oj = mode === 'overwrite' ? [...plan.add, ...plan.dup] : plan.add;
let _on = 0;
for (const { tb, row } of _oj) {
await store.put(tb, { ...row });
if (++_on % 300 === 0) await new Promise((r) => setTimeout(r, 0));
}
return _on;
}
export function pickLastAt(...vals) { let _om = 0; for (const v of vals) { const _on = Number(v); if (Number.isFinite(_on) && _on > _om) _om = _on; } return _om; }
export function daysSince(at, now = Date.now()) { return Math.max(0, Math.floor((now - Number(at)) / DAY)); }
export function backupDue({ lastAt = 0, firstSeen = 0, oldestCustomer = 0, snoozeUntil = 0, now = Date.now(), days = REMIND_DAYS } = {}) {
if (Number(snoozeUntil) > now) return false;
const _ow = Number(lastAt) || Number(firstSeen) || Number(oldestCustomer) || 0;
if (!_ow) return false;
return now - _ow > days * DAY;
}
export function xlsxCellSafe(v) {
if (v == null) return '';
if (typeof v !== 'string') return v;
let _oy = v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
if (/^[=+\-@\t\r]/.test(_oy)) _oy = "'" + _oy;
return _oy;
}
const vnDate = (ms) => { const _on = Number(ms); if (!_on) return ''; const _ob = new Date(_on + 7 * 3600000); const _oq = (_o10) => String(_o10).padStart(2, '0'); return _oq(_ob.getUTCDate()) + '/' + _oq(_ob.getUTCMonth() + 1) + '/' + _ob.getUTCFullYear(); };
export const SHEET_HEAD = ['Tên', 'Điện thoại', 'Zalo', 'Email', 'Trạng thái', 'Nhu cầu', 'Dự án', 'Loại căn', 'Ngân sách (đồng)', 'Nguồn', 'Nhãn', 'Ghi chú', 'Ngày sinh', 'Ngày tạo'];
export function customerSheetRows(tables) {
const _oo = new Map((tables.projects || []).map((_oq) => [String(_oq.id), _oq.name]));
const rows = (tables.objects || []).filter((r) => r && !_oi(r) && (kindOf(r) === 'customer' || !kindOf(r)));
return [SHEET_HEAD, ...rows.map((_o9) => [
_o9.name, _o9.phone, _o9.zalo, _o9.email, _o9.status, _o9.need, _oo.get(String(_o9.project)) || _o9.project, _o9.unit_type,
Number(_o9.budget) > 0 ? Number(_o9.budget) : '', _o9.source, Array.isArray(_o9.tags) ? _o9.tags.join(', ') : _o9.tags, _o9.note, _o9.birthday, vnDate(_o9.created_at),
].map((v) => xlsxCellSafe(v == null ? '' : (typeof v === 'number' ? v : String(v)))))];
}
const _o4 = [26, 14, 14, 24, 14, 12, 22, 14, 16, 12, 18, 40, 12, 12];
export function customersXlsx(tables) {
return xlsxBook([{ name: 'Khách', header: true, rows: customerSheetRows(tables), cols: _o4.map((w, _og) => ({ width: w, text: _og === 1 || _og === 2 })) }]);
}
export function backupFileName(now = Date.now(), encrypted = false) {
const _ob = new Date(Number(now) + 7 * 3600000); const _oq = (_o10) => String(_o10).padStart(2, '0');
return 'sao-luu-' + _ob.getUTCFullYear() + '-' + _oq(_ob.getUTCMonth() + 1) + '-' + _oq(_ob.getUTCDate()) + '-' + _oq(_ob.getUTCHours()) + _oq(_ob.getUTCMinutes()) + (encrypted ? '.ma-hoa' : '') + '.json';
}
export default { collectBackup, encryptDoc, openBackup, planRestore, applyPlan, previewText, backupDue, pickLastAt, daysSince, customersXlsx, customerSheetRows, xlsxCellSafe, findSecrets, redactValue, checkPasswords, backupFileName, isNewerVersion, checkFileSize };

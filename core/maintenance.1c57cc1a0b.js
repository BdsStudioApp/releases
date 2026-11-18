import { t } from './i18n.39c909b69c.js';
import { download, isMissingAction, ls } from './xkit.f03faf0986.js';
import { fingerprint, backupSource, importPending, isPendingFile, word as pendWord } from './pending_rescue.10a3ad29cf.js';
export const WORDS = {
'mnt.title': 'Bảo trì & Sao lưu',
'mnt.backup': 'Sao lưu & khôi phục',
'mnt.backup.lead': 'Sao lưu được mã hoá AES-GCM bằng khoá suy từ mật khẩu của anh/chị ngay trên máy. Mất mật khẩu thì không mở được bản sao lưu.',
'mnt.backup.now': 'Sao lưu ngay',
'mnt.backup.file': 'Tải tệp sao lưu về máy',
'mnt.backup.restore_file': 'Khôi phục từ tệp',
'mnt.backup.restore_drive': 'Khôi phục từ Drive',
'mnt.backup.list': 'Bản sao lưu trên Drive',
'mnt.backup.none': 'Chưa có bản sao lưu trên Drive.',
'mnt.backup.pw': 'Mật khẩu đăng nhập (để mã hoá / giải mã bản sao lưu)',
'mnt.backup.done': 'Đã sao lưu {n} dòng.',
'mnt.backup.waiting': 'Máy chủ chưa có sao lưu lên Drive (chờ máy chủ cập nhật) – đã chuyển sang tải tệp về máy.',
'mnt.backup.restored': 'Đã khôi phục {n} dòng. Đang đồng bộ lên máy chủ.',
'mnt.backup.badpw': 'Mật khẩu không đúng hoặc tệp đã bị sửa.',
'mnt.backup.confirm': 'Khôi phục sẽ ghi đè dữ liệu cùng mã trên mọi máy. Tiếp tục?',
'mnt.backup.filled': 'Đã bổ sung {n} dòng còn thiếu (không đổi dòng đang có). Đang đồng bộ lên máy chủ.',
'mnt.backup.mode.title': 'Khôi phục thế nào?',
'mnt.backup.mode.fill': 'Chỉ bổ sung phần còn thiếu',
'mnt.backup.mode.fill_lead': 'thêm khách/lịch sử đã mất, khôi phục mục bị xoá nhầm; mọi sửa đổi mới hơn được giữ nguyên. Nên chọn cách này.',
'mnt.backup.mode.exact': 'Đưa về đúng bản sao lưu',
'mnt.backup.mode.exact_lead': 'ghi đè mọi dòng cùng mã bằng bản trong tệp – sửa đổi sau ngày sao lưu sẽ mất. Khách đã xoá theo yêu cầu vẫn không quay lại.',
'mnt.backup.other_user_owner': 'Bản sao lưu này của tài khoản khác trên cùng máy chủ – vẫn khôi phục?',
'mnt.backup.other_user': 'Bản sao lưu này là của một tài khoản khác trên cùng máy chủ. Chỉ chính tài khoản đã tạo bản sao lưu mới khôi phục được (tránh nhân đôi khách và lộ khách của người khác).',
'mnt.backup.foreign': 'Bản sao lưu này tạo từ MÁY CHỦ KHÁC (Sheet/tài khoản Google khác). Khôi phục sẽ THÊM toàn bộ khách trong tệp vào máy chủ đang dùng (cài đặt trong tệp không được chép sang). Chỉ làm khi anh/chị chuyển sang máy chủ mới. Tiếp tục?',
'mnt.clean': 'Tự dọn',
'mnt.clean.lead': 'Xoá bộ nhớ đệm trình duyệt cũ hơn 30 ngày và nhờ máy dựng dọn tệp tạm cũ. Không đụng tới dữ liệu.',
'mnt.clean.lead_web': 'Xoá bộ nhớ đệm trình duyệt cũ hơn 30 ngày. Không đụng tới dữ liệu.',
'mnt.clean.run': 'Dọn ngay',
'mnt.clean.done': 'Đã dọn {n} mục cũ.',
'mnt.clean.engine': 'Máy dựng: {msg}',
'mnt.bio': 'Mở khoá bằng Touch ID / vân tay',
'mnt.bio.lead': 'Chỉ dùng để mở màn KHOÁ trên máy này khi đã đăng nhập. Đăng nhập lần đầu vẫn bằng mật khẩu.',
'mnt.bio.on': 'Bật trên máy này',
'mnt.bio.off': 'Tắt',
'mnt.bio.enabled': 'Đã bật mở khoá bằng vân tay trên máy này.',
'mnt.bio.disabled': 'Đã tắt mở khoá bằng vân tay.',
'mnt.bio.na': 'Máy/trình duyệt này không hỗ trợ (cần Touch ID, Windows Hello hoặc vân tay, và địa chỉ có tên miền – không phải 127.0.0.1).',
'mnt.bio.unlock': 'Mở bằng vân tay',
'mnt.bio.fail': 'Chưa xác thực được – dùng mật khẩu.',
'mnt.bug': 'Nhật ký lỗi & Gửi AI sửa',
'mnt.bug.lead': 'Soạn bản báo lỗi gồm lỗi, bước, phiên bản, môi trường – đã lọc số điện thoại, email, tên khách.',
'mnt.bug.steps': 'Anh/chị đang làm gì thì gặp lỗi? (các bước)',
'mnt.bug.make': 'Soạn bản báo lỗi',
'mnt.bug.open': 'Mở trợ lý AI',
'help.maintenance': 'Sao lưu mã hoá (Drive hoặc tệp về máy), tự dọn bộ nhớ cũ, mở khoá bằng vân tay và gửi lỗi cho AI sửa. Dữ liệu khách không bao giờ nằm trong bản báo lỗi.'
};
export const BACKUP_ITER = 150000;
const subtle = () => globalThis.crypto.subtle;
function _o13(n) { const r = new Uint8Array(n); globalThis.crypto.getRandomValues(r); return r; }
export function toB64(u8) { let _o18 = ''; const _o0 = new Uint8Array(u8); for (let _ok = 0; _ok < _o0.length; _ok += 0x8000) _o18 += String.fromCharCode.apply(null, _o0.subarray(_ok, _ok + 0x8000)); return btoa(_o18); }
export function fromB64(_o2) { const _o18 = atob(String(_o2)); const _o0 = new Uint8Array(_o18.length); for (let _ok = 0; _ok < _o18.length; _ok++) _o0[_ok] = _o18.charCodeAt(_ok); return _o0; }
async function deriveKey(password, salt, iter) {
const base = await subtle().importKey('raw', new TextEncoder().encode(String(password)), 'PBKDF2', false, ['deriveKey']);
return subtle().deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
export async function encryptBackup(obj, password, { iter = BACKUP_ITER, app = 'studio', now = Date.now() } = {}) {
if (!password || String(password).length < 8) throw Object.assign(new Error('Mật khẩu cần ít nhất 8 ký tự.'), { code: 'BAD_INPUT' });
const salt = _o13(16), iv = _o13(12);
const key = await deriveKey(password, salt, iter);
const ct = await subtle().encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(obj)));
return { v: 1, app, alg: 'AES-GCM-256', kdf: 'PBKDF2-SHA256', iter, salt: toB64(salt), iv: toB64(iv), ct: toB64(new Uint8Array(ct)), created_at: now };
}
export async function decryptBackup(pkg, password) {
if (!pkg || pkg.v !== 1 || !pkg.ct) throw Object.assign(new Error('Tệp sao lưu không đúng định dạng.'), { code: 'BAD_INPUT' });
try {
const key = await deriveKey(password, fromB64(pkg.salt), Number(pkg.iter) || BACKUP_ITER);
const _o12 = await subtle().decrypt({ name: 'AES-GCM', iv: fromB64(pkg.iv) }, key, fromB64(pkg.ct));
return JSON.parse(new TextDecoder().decode(_o12));
} catch { throw Object.assign(new Error(t('mnt.backup.badpw')), { code: 'BAD_PASSWORD', userMessage: t('mnt.backup.badpw') }); }
}
export const BACKUP_TABLES = ['objects', 'events', 'reminders', 'policies', 'quotes', 'projects', 'jobs', 'ideas', 'settings'];
export const SERVER_ONLY_SETTING = /^(_|budget$|pepper|secret|pw_|login_f|setup_done|schema_v|tg_|users|gemini_key$|claude_key$|telegram_token$|telegram_chat_id$|owner_email$)/;
const _op = (_o1b, r) => _o1b !== 'settings' || !(r && SERVER_ONLY_SETTING.test(String(r.key || '')));
export { fingerprint, backupSource };
export function sourceMismatch(backupSrc, cur) {
if (!backupSrc || !cur) return '';
if (backupSrc.server && cur.server && backupSrc.server !== cur.server) return 'foreign';
if (backupSrc.user && cur.user && backupSrc.user !== cur.user) return 'other_user';
return '';
}
export async function collect(store, tables = BACKUP_TABLES, { src } = {}) {
const _o10 = {}; let count = 0;
for (const _o1b of tables) { const rows = (await store.list(_o1b, null, { includeDeleted: true })).filter((r) => _op(_o1b, r)); _o10[_o1b] = rows; count += rows.length; }
return src ? { format: 'studio-backup', tables: _o10, count, src } : { format: 'studio-backup', tables: _o10, count };
}
const parseData = (v) => { if (v && typeof v === 'object') return v; try { return JSON.parse(v || '{}') || {}; } catch { return {}; } };
const _ol = (r) => !!r && Number(parseData(r.data).erased) === 1;
const _om = (r) => !!r && Number(parseData(r.data).mx_moved) === 1;
const _o14 = (r) => { const d = parseData(r && r.data); return [d.customer_id, ...(Array.isArray(d.customer_ids) ? d.customer_ids : [])].filter(Boolean).map(String); };
export async function restoreInto(store, data, { src, foreignOk = false, skipSettings = false, mode = 'fill', otherUserOk = false } = {}) {
let n = 0;
const tables = (data && data.tables) || {};
const _ow = sourceMismatch(data && data.src, src);
if ((_ow === 'other_user' && !otherUserOk) || (_ow === 'foreign' && !foreignOk)) throw Object.assign(new Error(t(_ow === 'foreign' ? 'mnt.backup.foreign' : 'mnt.backup.other_user')), { code: _ow === 'foreign' ? 'FOREIGN_BACKUP' : 'OTHER_USER_BACKUP', userMessage: t('mnt.backup.' + (_ow === 'foreign' ? 'foreign' : 'other_user')) });
const erased = new Set();
let local = null;
if (typeof store.list === 'function') { try { local = new Map((await store.list('objects', null, { includeDeleted: true })).map((o) => [String(o.id), o])); } catch { local = null; } }
for (const r of Array.isArray(tables.objects) ? tables.objects : []) {
if (!r || !r.id) continue;
let cur = local ? local.get(String(r.id)) || null : null;
if (!cur && typeof store.get === 'function') { try { cur = await store.get('objects', r.id); } catch { cur = null; } }
if (_ol(cur) || _ol(r)) erased.add(String(r.id));
}
for (const [_o1b, rows] of Object.entries(tables)) {
if (!BACKUP_TABLES.includes(_o1b) || !Array.isArray(rows)) continue;
if ((_ow === 'foreign' || skipSettings) && _o1b === 'settings') continue;
let _oj = null;
if (mode !== 'exact' && typeof store.list === 'function') { try { _oj = _o1b === 'objects' && local ? local : new Map((await store.list(_o1b, null, { includeDeleted: true })).map((o) => [String(o[_o1b === 'settings' ? 'key' : 'id']), o])); } catch { _oj = null; } }
for (const r of rows) {
if (!_op(_o1b, r)) continue;
if (erased.size && r) {
if (_o1b === 'objects' && (erased.has(String(r.id)) || _o14(r).some((x) => erased.has(x)))) continue;
if ((_o1b === 'events' || _o1b === 'reminders' || _o1b === 'quotes') && erased.has(String(r.object_id))) continue;
}
if (mode !== 'exact' && r) {
const cur = _oj ? _oj.get(String(r[_o1b === 'settings' ? 'key' : 'id'])) : null;
if (!cur) { if (Number(r.deleted) === 1) continue; await store.put(_o1b, r, { keepStamp: true }); n++; continue; }
if (Number(cur.deleted) !== 1 || Number(r.deleted) === 1 || cur.hidden || _ol(cur) || _om(cur) || _o1b === 'settings') continue;
const body = Object.keys(cur).length > 5 ? cur : r;
await store.put(_o1b, { ...body, deleted: 0 }); n++;
continue;
}
await store.put(_o1b, r); n++;
}
}
return n;
}
export async function restoreModeDialog(ui) {
const _ot = ui.modal({ title: t('mnt.backup.mode.title'), body: ui.h('div', null,
ui.h('p', null, ui.h('strong', null, t('mnt.backup.mode.fill')), ' – ', t('mnt.backup.mode.fill_lead')),
ui.h('p', null, ui.h('strong', null, t('mnt.backup.mode.exact')), ' – ', t('mnt.backup.mode.exact_lead'))),
actions: [{ label: t('common.cancel'), kind: 'ghost', value: null },
{ label: t('mnt.backup.mode.exact'), kind: 'danger', value: 'exact', id: 'mnt-restore-exact' },
{ label: t('mnt.backup.mode.fill'), kind: 'primary', value: 'fill', id: 'mnt-restore-fill' }] });
return (await _ot.done) || null;
}
export const CLEAN_DAYS = 30;
export function isStale(dateHeader, now = Date.now(), maxDays = CLEAN_DAYS) {
const d = Date.parse(dateHeader || '');
return Number.isFinite(d) && now - d > maxDays * 86400000;
}
export function pruneLog(list, now = Date.now(), maxDays = CLEAN_DAYS) { return (list || []).filter((e) => e && now - Number(e.at) <= maxDays * 86400000); }
export async function cleanBrowser(now = Date.now()) {
let n = 0;
if (typeof caches !== 'undefined') {
for (const name of await caches.keys()) {
const _o5 = await caches.open(name);
for (const _o15 of await _o5.keys()) {
const _o16 = await _o5.match(_o15);
if (_o16 && isStale(_o16.headers.get('date'), now)) { await _o5.delete(_o15); n++; }
}
}
}
const _os = ls.get('bds:errlog', []); const _oq = pruneLog(_os, now);
if (_oq.length !== _os.length) { ls.set('bds:errlog', _oq); n += _os.length - _oq.length; }
const _oc = ls.get('bds:mem:edits', []); const _oo = pruneLog(_oc, now, 60);
if (_oo.length !== _oc.length) { ls.set('bds:mem:edits', _oo); n += _oc.length - _oo.length; }
ls.set('bds:clean:last', now);
return n;
}
export async function cleanEngine(base, fetchFn = (u, o) => fetch(u, o)) {
const _o9 = new AbortController(); const _o1c = setTimeout(() => _o9.abort(), 4000);
try {
const r = await fetchFn(base.replace(/\/$/, '') + '/cleanup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ days: CLEAN_DAYS }), signal: _o9.signal });
if (r.status === 404) return { ok: false, msg: 'chưa có /cleanup (chờ cập nhật máy dựng)' };
const _on = await r.json().catch(() => ({}));
return { ok: r.ok, msg: r.ok ? 'đã dọn ' + (_on.removed ?? _on.deleted ?? 0) + ' tệp' : 'HTTP ' + r.status };
} catch { return { ok: false, msg: 'không chạy' }; } finally { clearTimeout(_o1c); }
}
export function cleanDue(now = Date.now()) { return now - (Number(ls.get('bds:clean:last', 0)) || 0) > 86400000; }
export const BIO_KEY = 'bds:bio';
export function bioHostOk(hostname) { return !!hostname && !/^\d+\.\d+\.\d+\.\d+$/.test(hostname) && !hostname.includes(':'); }
export function bioSupported(_o1d = typeof window !== 'undefined' ? window : null) {
return !!(_o1d && _o1d.PublicKeyCredential && _o1d.navigator && _o1d.navigator.credentials && _o1d.isSecureContext && bioHostOk(_o1d.location.hostname));
}
export function bioEnabled() { const v = ls.get(BIO_KEY, null); return !!(v && v.id); }
export function checkAssertion({ clientDataJSON, authenticatorData }, { challenge, origin }) {
let _o6; try { _o6 = JSON.parse(new TextDecoder().decode(clientDataJSON)); } catch { return { ok: false, why: 'clientData' }; }
if (_o6.type !== 'webauthn.get') return { ok: false, why: 'type' };
if (b64url(challenge) !== _o6.challenge) return { ok: false, why: 'challenge' };
if (origin && _o6.origin !== origin) return { ok: false, why: 'origin' };
const _o1 = new Uint8Array(authenticatorData);
if (_o1.length < 37) return { ok: false, why: 'authData' };
const flags = _o1[32];
if (!(flags & 0x01)) return { ok: false, why: 'UP' };
if (!(flags & 0x04)) return { ok: false, why: 'UV' };
return { ok: true };
}
export function b64url(u8) { return toB64(new Uint8Array(u8)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function _oi(_o18) { _o18 = String(_o18).replace(/-/g, '+').replace(/_/g, '/'); while (_o18.length % 4) _o18 += '='; return fromB64(_o18); }
export async function bioRegister({ appName = 'Studio', userName = 'owner' } = {}) {
const _o8 = await navigator.credentials.create({ publicKey: {
rp: { name: appName, id: location.hostname },
user: { id: _o13(16), name: userName, displayName: userName },
challenge: _o13(32),
pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' },
timeout: 60000, attestation: 'none'
} });
if (!_o8) throw new Error('no credential');
ls.set(BIO_KEY, { id: b64url(_o8.rawId), created_at: Date.now(), host: location.hostname });
return true;
}
export function bioDisable() { ls.set(BIO_KEY, null); }
export async function bioVerify() {
const v = ls.get(BIO_KEY, null); if (!v || !v.id) return false;
const challenge = _o13(32);
const _o0 = await navigator.credentials.get({ publicKey: { challenge, allowCredentials: [{ type: 'public-key', id: _oi(v.id) }], userVerification: 'required', timeout: 60000, rpId: location.hostname } });
if (!_o0 || b64url(_o0.rawId) !== v.id) return false;
return checkAssertion({ clientDataJSON: _o0.response.clientDataJSON, authenticatorData: _o0.response.authenticatorData }, { challenge, origin: location.origin }).ok;
}
export function attachLockScreen(lockEl, unlock, ui) {
if (!lockEl || !bioEnabled() || !bioSupported()) return null;
const _oh = lockEl.querySelector('form') || lockEl;
const _od = _oh.querySelector('.form-err');
const _o2 = ui.button(t('mnt.bio.unlock'), async () => {
let ok = false; try { ok = await bioVerify(); } catch { ok = false; }
if (ok) ok = await unlock();
if (!ok && _od) _od.textContent = t('mnt.bio.fail');
}, { kind: 'secondary', block: true, icon: 'shield', id: 'unlock-bio', testid: 'unlock-bio' });
const _o19 = _oh.querySelector('button[type=submit]');
if (_o19 && _o19.parentNode) _o19.parentNode.insertBefore(_o2, _o19.nextSibling); else _oh.appendChild(_o2);
return _o2;
}
export function scrub(_o18) {
return String(_o18 == null ? '' : _o18)
.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]')
.replace(/(?:\+?84|\b0)(?:[\s.-]?\d){8,10}\b/g, '[sđt]')
.replace(/\b\d{9,}\b/g, '[số]')
.replace(/("(?:name|full_name|phone|zalo|email|note|text|address|ten|sdt)"\s*:\s*)"[^"]*"/gi, '$1"[ẩn]"')
.replace(/(token|key|secret|pw_hash|password)=([^&\s]+)/gi, '$1=[ẩn]');
}
export function bugReport({ errors = [], steps = '', version = '', env = '', appName = 'Studio', limit = 15 } = {}) {
const items = errors.slice(-limit).reverse();
return [
'# Báo lỗi ' + appName + (version ? ' ' + version : ''),
'',
'## Môi trường',
scrub(env) || '(không rõ)',
'',
'## Các bước',
scrub(steps).trim() || '(chủ app chưa ghi bước)',
'',
'## Lỗi gần đây (' + items.length + ')',
...(items.length ? items.map((e) => '- ' + new Date(Number(e.at) || 0).toISOString() + ' [' + (e.level || 'warn') + '] ' + scrub(e.where) + ': ' + scrub(e.message) + (e.detail ? '\n  ```\n  ' + scrub(String(e.detail).split('\n').slice(0, 6).join('\n  ')) + '\n  ```' : '')) : ['(không có)']),
'',
'## Yêu cầu',
'Tìm nguyên nhân gốc, sửa trong mã nguồn dự án (đọc docs/CONTRACT.md), thêm test tái hiện lỗi, chạy node --test và playwright xanh. Bản báo này không chứa dữ liệu khách.'
].join('\n') + '\n';
}
export function envText(config = {}, mode = '') {
const n = typeof navigator !== 'undefined' ? navigator : {};
const _o1d = typeof window !== 'undefined' ? window : {};
return ['web ' + (config.APP_VERSION || '?'), 'chế độ ' + (mode || '?'), (n.userAgent || '').slice(0, 160), _o1d.innerWidth ? _o1d.innerWidth + '×' + _o1d.innerHeight : '', n.language || ''].filter(Boolean).join(' · ');
}
export function renderMaintenancePanel(body, { ui, api, store, app, config, engineOff = () => false }) {
const { h, button, field, toast, modal, copy, badge } = ui;
const _o3 = h('div', { class: 'sub-block', 'data-testid': 'mnt-backup' });
const cleanBox = h('div', { class: 'sub-block', 'data-testid': 'mnt-clean' });
const bioBox = h('div', { class: 'sub-block', 'data-testid': 'mnt-bio' });
const _o4 = h('div', { class: 'sub-block', 'data-testid': 'mnt-bug' });
body.append(_o3, cleanBox, bioBox, _o4);
const pw = field({ label: t('mnt.backup.pw'), type: 'password', autocomplete: 'current-password', id: 'mnt-pw' });
const _or = h('div', { class: 'muted small' });
const _of = h('input', { type: 'file', accept: '.json,.studio-backup,application/json', class: 'sr-only', id: 'mnt-restore-file' });
_of.addEventListener('change', async () => {
const _oe = _of.files && _of.files[0]; _of.value = ''; if (!_oe) return;
try {
const pkg = JSON.parse(await _oe.text());
if (isPendingFile(pkg)) { const n = await importPending(store, pkg, { src: backupSource(store, config) }); store.syncNow && store.syncNow(); toast(pendWord('pend.imported', n), 'ok', 4500); return; }
await _o17(pkg);
} catch (e) { toast(e.userMessage || e.message || t('err.generic'), 'error', 5000); }
});
const _ox = () => { const v = String(pw.getValue() || ''); if (v.length < 8) { toast(t('auth.err.short'), 'warn'); pw.input.focus(); return null; } return v; };
async function _ou() { const p = _ox(); if (!p) return null; const data = await collect(store, BACKUP_TABLES, { src: backupSource(store, config) }); return { pkg: await encryptBackup(data, p, { app: config.PACK || 'studio' }), count: data.count }; }
function _og() { return 'sao-luu-' + new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-') + '.studio-backup.json'; }
async function saveFile() { const r = await _ou(); if (!r) return; download(_og(), JSON.stringify(r.pkg), 'application/json'); toast(t('mnt.backup.done', { n: r.count }), 'ok'); }
async function _o17(pkg) {
const p = _ox(); if (!p) return;
const data = await decryptBackup(pkg, p);
const src = backupSource(store, config), _ow = sourceMismatch(data && data.src, src);
const role = app && app.auth && app.auth.user ? app.auth.user.role : '';
const _o11 = !role || role === 'owner';
if (_ow === 'other_user' && !_o11) { toast(t('mnt.backup.other_user'), 'error', 8000); return; }
if (_ow === 'other_user' && !(await ui.confirm(t('mnt.backup.other_user_owner'), { ok: t('mnt.backup.restore_file'), kind: 'danger', title: t('mnt.backup') }))) return;
if (_ow === 'foreign' && !(await ui.confirm(t('mnt.backup.foreign'), { ok: t('mnt.backup.restore_file'), kind: 'danger', title: t('mnt.backup') }))) return;
const mode = await restoreModeDialog(ui);
if (!mode) return;
if (mode === 'exact' && !(await ui.confirm(t('mnt.backup.confirm'), { ok: t('mnt.backup.restore_file'), kind: 'danger', title: t('mnt.backup') }))) return;
if (store.syncNow) { try { await Promise.race([store.syncNow(), new Promise((r) => setTimeout(r, 15000))]); } catch { } }
const n = await restoreInto(store, data, { src, mode, foreignOk: _ow === 'foreign', otherUserOk: _ow === 'other_user' && _o11, skipSettings: !_o11 });
store.syncNow && store.syncNow();
toast(t(mode === 'exact' ? 'mnt.backup.restored' : 'mnt.backup.filled', { n }), 'ok', 4500);
}
_o3.append(h('h4', { class: 'section-title' }, t('mnt.backup')), h('p', { class: 'muted small' }, t('mnt.backup.lead')), pw,
h('div', { class: 'btn-row' },
button(t('mnt.backup.now'), async () => {
const r = await _ou(); if (!r) return;
try { await api.call('backup.now', { enc: r.pkg }); toast(t('mnt.backup.done', { n: r.count }), 'ok'); _ob(); } catch (e) {
if (!isMissingAction(e)) throw e;
toast(t('mnt.backup.waiting'), 'info', 5000); download(_og(), JSON.stringify(r.pkg), 'application/json');
}
}, { kind: 'primary', icon: 'disk', testid: 'mnt-backup-now' }),
button(t('mnt.backup.file'), saveFile, { kind: 'secondary', icon: 'disk', testid: 'mnt-backup-file' }),
button(t('mnt.backup.restore_file'), () => _of.click(), { kind: 'ghost', icon: 'refresh', testid: 'mnt-restore' }), _of),
h('h4', { class: 'section-title' }, t('mnt.backup.list')), _or);
async function _ob() {
try {
const d = await api.call('backup.list', {});
const rows = Array.isArray(d) ? d : (d && (d.items || d.backups)) || [];
ui.mountTo(_or, rows.length ? ui.list(rows, (_o2) => h('div', { class: 'row-main' }, h('span', null, ui.date(_o2.at || _o2.created_at, true) + (_o2.size ? ' · ' + Math.round(_o2.size / 1024) + ' KB' : '')),
button(t('mnt.backup.restore_drive'), async () => { const r = await api.call('backup.restore', { id: _o2.id }); await _o17(r && (r.enc || r)); }, { kind: 'ghost', small: true, icon: 'cloud', testid: 'mnt-restore-drive' }))) : t('mnt.backup.none'));
} catch (e) { _or.textContent = isMissingAction(e) ? t('mnt.backup.waiting').split(' – ')[0] + '.' : (e.userMessage || t('err.network')); }
}
_ob();
const _o7 = h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'mnt-clean-out' });
const _oy = () => { try { return !!engineOff(); } catch { return false; } };
cleanBox.append(h('h4', { class: 'section-title' }, t('mnt.clean')), h('p', { class: 'muted small' }, t(_oy() ? 'mnt.clean.lead_web' : 'mnt.clean.lead')),
h('div', { class: 'btn-row' }, button(t('mnt.clean.run'), async () => {
const n = await cleanBrowser();
if (_oy()) { _o7.textContent = t('mnt.clean.done', { n }); return; }
const e = await cleanEngine(config.ENGINE_URL || 'http://127.0.0.1:8765');
_o7.textContent = t('mnt.clean.done', { n }) + ' ' + t('mnt.clean.engine', { msg: e.msg });
}, { kind: 'secondary', icon: 'refresh', testid: 'mnt-clean-run' })), _o7);
function _oa() {
const _o1a = bioSupported(); const _oz = bioEnabled();
ui.mountTo(bioBox, h('h4', { class: 'section-title' }, t('mnt.bio')), h('p', { class: 'muted small' }, t('mnt.bio.lead')),
!_o1a ? h('p', { class: 'muted small', 'data-testid': 'mnt-bio-na' }, t('mnt.bio.na')) : h('div', { class: 'btn-row' },
badge(_oz ? t('mem.on') : t('mnt.bio.off'), _oz ? 'ok' : 'neutral'),
_oz ? button(t('mnt.bio.off'), () => { bioDisable(); toast(t('mnt.bio.disabled'), 'ok'); _oa(); }, { kind: 'ghost', testid: 'mnt-bio-off' })
: button(t('mnt.bio.on'), async () => {
try { await bioRegister({ appName: t('app.name'), userName: (app.auth && app.auth.user && app.auth.user.username) || 'owner' }); toast(t('mnt.bio.enabled'), 'ok'); } catch { toast(t('mnt.bio.fail'), 'warn'); }
_oa();
}, { kind: 'primary', icon: 'shield', testid: 'mnt-bio-on' })));
}
_oa();
const steps = field({ label: t('mnt.bug.steps'), type: 'textarea', rows: 3, id: 'mnt-steps' });
const recent = (app.errors && app.errors.recent ? app.errors.recent() : []).slice(-10).reverse();
_o4.append(h('h4', { class: 'section-title' }, t('mnt.bug')), h('p', { class: 'muted small' }, t('mnt.bug.lead')),
recent.length ? ui.list(recent.slice(0, 5), (e) => h('div', { class: 'row-text' }, h('div', { class: 'row-line' }, badge(e.level, e.level === 'critical' ? 'danger' : 'warn'), h('span', { class: 'muted small num' }, ui.date(e.at, true))), h('span', { class: 'small break' }, scrub(e.where + ': ' + e.message)))) : h('p', { class: 'muted small' }, t('set.errors.none')),
steps,
h('div', { class: 'btn-row' }, button(t('mnt.bug.make'), async () => {
const ver = app.swVersion ? await app.swVersion() : '';
const _ov = bugReport({ errors: app.errors ? app.errors.recent() : [], steps: steps.getValue(), version: (config.APP_VERSION || '') + (ver ? ' / ' + ver : ''), env: envText(config, api.mode), appName: t('app.name') });
const ta = h('textarea', { class: 'handoff-prompt', readonly: true, rows: 12, 'data-testid': 'mnt-bug-text' }); ta.value = _ov;
modal({ title: t('mnt.bug'), wide: true, body: h('div', null, ta, h('div', { class: 'btn-row' },
button(t('common.copy'), () => copy(_ov), { kind: 'primary', icon: 'log' }),
button(t('mnt.bug.open'), async () => { await copy(_ov, { silent: true }); window.open(_ov.length < 5000 ? 'https://claude.ai/new?q=' + encodeURIComponent(_ov) : 'https://claude.ai/new', '_blank', 'noopener'); }, { kind: 'secondary', icon: 'sparkle' }))),
actions: [{ label: t('common.close'), kind: 'ghost' }] });
}, { kind: 'primary', icon: 'log', testid: 'mnt-bug-make' })));
}
export default { encryptBackup, decryptBackup, collect, restoreInto, isStale, cleanBrowser, cleanEngine, checkAssertion, bioSupported, bioRegister, bioVerify, attachLockScreen, scrub, bugReport, renderMaintenancePanel };

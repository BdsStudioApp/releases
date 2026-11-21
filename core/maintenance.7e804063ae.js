import { t } from './i18n.17f01a0b54.js';
import { download, isMissingAction, ls } from './xkit.71d637c634.js';
import { fingerprint, backupSource, importPending, isPendingFile, word as pendWord } from './pending_rescue.ea4ffbab34.js';
export const WORDS = {
'mnt.title': 'Bảo trì & Sao lưu',
'mnt.backup': 'Sao lưu & khôi phục',
'mnt.backup.lead': 'Bản sao lưu được khoá bằng mật khẩu đăng nhập của anh/chị ngay trên máy – người khác cầm tệp cũng không đọc được. Quên mật khẩu thì không mở được bản sao lưu.',
'mnt.backup.now': 'Sao lưu ngay',
'mnt.backup.last': 'Lần sao lưu gần nhất: {d}',
'mnt.backup.never': 'Chưa sao lưu lần nào.',
'mnt.backup.xlsx': 'Xuất Excel danh sách khách',
'mnt.backup.xlsx_done': 'Đã xuất {n} khách ra Excel (tệp không mã hoá – giữ kỹ, không gửi cho người khác).',
'mnt.restore.preview': 'Trong tệp ({d}): {c} khách, {p} đối tác, {e} ghi chú/lịch sử, {r} lịch hẹn/nhắc, {j} dự án.',
'mnt.restore.erased': '{n} mục thuộc khách đã xoá theo yêu cầu sẽ KHÔNG được khôi phục.',
'mnt.restore.pw_title': 'Mật khẩu của tệp sao lưu',
'mnt.restore.pw_label': 'Mật khẩu đã dùng khi sao lưu',
'mnt.restore.pw_wrong': 'Mật khẩu chưa đúng – nhập lại (không cần chọn lại tệp).',
'mnt.restore.open': 'Mở tệp',
'mnt.due.days': 'Đã {n} ngày chưa sao lưu dữ liệu khách.',
'mnt.due.never': 'Chưa sao lưu dữ liệu khách lần nào.',
'mnt.due.sub': 'Mất máy hay lỗi bộ nhớ là mất danh sách khách. Sao lưu chưa tới 1 phút.',
'mnt.due.later': 'Để sau',
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
'mnt.bio': 'Mở khoá bằng Face ID / vân tay',
'mnt.bio.lead': 'Chỉ dùng để mở màn KHOÁ trên máy này khi đã đăng nhập (Face ID, Touch ID, Windows Hello hoặc vân tay). Đăng nhập lần đầu vẫn bằng mật khẩu.',
'mnt.bio.on': 'Bật trên máy này',
'mnt.bio.off': 'Tắt',
'mnt.bio.enabled': 'Đã bật mở khoá bằng vân tay trên máy này.',
'mnt.bio.disabled': 'Đã tắt mở khoá bằng vân tay.',
'mnt.bio.na': 'Máy/trình duyệt này không hỗ trợ (cần Face ID, Touch ID, Windows Hello hoặc vân tay, và mở app bằng địa chỉ có tên miền https).',
'mnt.bio.unlock': 'Mở bằng Face ID / vân tay',
'mnt.bio.offer.title': 'Bật Face ID / vân tay?',
'mnt.bio.offer.text': 'Lần sau màn khoá chỉ cần chạm Face ID hoặc vân tay, khỏi gõ lại mật khẩu. Chỉ dùng để mở khoá màn trên máy này, mật khẩu vẫn dùng được. Tắt lúc nào cũng được ở Cài đặt › Bảo mật.',
'mnt.bio.offer.on': 'Bật ngay',
'mnt.bio.offer.later': 'Để sau',
'mnt.bio.fail': 'Chưa xác thực được – dùng mật khẩu.',
'mnt.bug': 'Nhật ký lỗi & Báo lỗi',
'mnt.bug.lead': 'Soạn bản báo lỗi gồm lỗi, bước, phiên bản, môi trường – đã lọc số điện thoại, email, tên khách.',
'mnt.bug.steps': 'Anh/chị đang làm gì thì gặp lỗi? (các bước)',
'mnt.bug.make': 'Soạn bản báo lỗi',
'mnt.bug.open': 'Mở trợ lý AI',
'help.maintenance': 'Sao lưu mã hoá (Drive hoặc tệp về máy), bản Excel danh sách khách, chọn sao lưu tự động hằng tuần/hằng tháng, xuất toàn bộ ra Excel lên Drive, nhắc sao lưu hằng tuần ở Bảng tin, tự dọn bộ nhớ cũ, mở khoá bằng vân tay và gửi lỗi cho AI sửa. Dữ liệu khách không bao giờ nằm trong bản báo lỗi.'
};
export const BACKUP_ITER = 150000;
const subtle = () => globalThis.crypto.subtle;
function rand(n) { const r = new Uint8Array(n); globalThis.crypto.getRandomValues(r); return r; }
export function toB64(u8) { let _o1e = ''; const _o3 = new Uint8Array(u8); for (let _oq = 0; _oq < _o3.length; _oq += 0x8000) _o1e += String.fromCharCode.apply(null, _o3.subarray(_oq, _oq + 0x8000)); return btoa(_o1e); }
export function fromB64(_o6) { const _o1e = atob(String(_o6)); const _o3 = new Uint8Array(_o1e.length); for (let _oq = 0; _oq < _o1e.length; _oq++) _o3[_oq] = _o1e.charCodeAt(_oq); return _o3; }
async function deriveKey(password, salt, iter) {
const base = await subtle().importKey('raw', new TextEncoder().encode(String(password)), 'PBKDF2', false, ['deriveKey']);
return subtle().deriveKey({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: iter }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
export async function encryptBackup(obj, password, { iter = BACKUP_ITER, app = 'studio', now = Date.now() } = {}) {
if (!password || String(password).length < 8) throw Object.assign(new Error('Mật khẩu cần ít nhất 8 ký tự.'), { code: 'BAD_INPUT' });
const salt = rand(16), iv = rand(12);
const key = await deriveKey(password, salt, iter);
const ct = await subtle().encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(obj)));
return { v: 1, app, alg: 'AES-GCM-256', kdf: 'PBKDF2-SHA256', iter, salt: toB64(salt), iv: toB64(iv), ct: toB64(new Uint8Array(ct)), created_at: now };
}
export async function decryptBackup(pkg, password) {
if (!pkg || pkg.v !== 1 || !pkg.ct) throw Object.assign(new Error('Tệp sao lưu không đúng định dạng.'), { code: 'BAD_INPUT' });
try {
const key = await deriveKey(password, fromB64(pkg.salt), Number(pkg.iter) || BACKUP_ITER);
const _o19 = await subtle().decrypt({ name: 'AES-GCM', iv: fromB64(pkg.iv) }, key, fromB64(pkg.ct));
return JSON.parse(new TextDecoder().decode(_o19));
} catch { throw Object.assign(new Error(t('mnt.backup.badpw')), { code: 'BAD_PASSWORD', userMessage: t('mnt.backup.badpw') }); }
}
export const BACKUP_TABLES = ['objects', 'events', 'reminders', 'policies', 'quotes', 'projects', 'jobs', 'ideas', 'settings'];
export const SERVER_ONLY_SETTING = /^(_|budget$|pepper|secret|pw_|login_f|setup_done|schema_v|tg_|users|gemini_key$|claude_key$|telegram_token$|telegram_chat_id$|owner_email$)/;
const _ov = (_o1i, r) => _o1i !== 'settings' || !(r && SERVER_ONLY_SETTING.test(String(r.key || '')));
export { fingerprint, backupSource };
export function sourceMismatch(backupSrc, cur) {
if (!backupSrc || !cur) return '';
if (backupSrc.server && cur.server && backupSrc.server !== cur.server) return 'foreign';
if (backupSrc.user && cur.user && backupSrc.user !== cur.user) return 'other_user';
return '';
}
export async function collect(store, tables = BACKUP_TABLES, { src } = {}) {
const _o17 = {}; let count = 0;
for (const _o1i of tables) { const rows = (await store.list(_o1i, null, { includeDeleted: true })).filter((r) => _ov(_o1i, r)); _o17[_o1i] = rows; count += rows.length; }
return src ? { format: 'studio-backup', tables: _o17, count, src } : { format: 'studio-backup', tables: _o17, count };
}
const parseData = (v) => { if (v && typeof v === 'object') return v; try { return JSON.parse(v || '{}') || {}; } catch { return {}; } };
const _or = (r) => !!r && Number(parseData(r.data).erased) === 1;
const _os = (r) => !!r && Number(parseData(r.data).mx_moved) === 1;
const _o1a = (r) => { const d = parseData(r && r.data); return [d.customer_id, ...(Array.isArray(d.customer_ids) ? d.customer_ids : [])].filter(Boolean).map(String); };
export async function restoreInto(store, data, { src, foreignOk = false, skipSettings = false, mode = 'fill', otherUserOk = false } = {}) {
let n = 0;
const tables = (data && data.tables) || {};
const _o14 = sourceMismatch(data && data.src, src);
if ((_o14 === 'other_user' && !otherUserOk) || (_o14 === 'foreign' && !foreignOk)) throw Object.assign(new Error(t(_o14 === 'foreign' ? 'mnt.backup.foreign' : 'mnt.backup.other_user')), { code: _o14 === 'foreign' ? 'FOREIGN_BACKUP' : 'OTHER_USER_BACKUP', userMessage: t('mnt.backup.' + (_o14 === 'foreign' ? 'foreign' : 'other_user')) });
const erased = new Set();
let local = null;
if (typeof store.list === 'function') { try { local = new Map((await store.list('objects', null, { includeDeleted: true })).map((o) => [String(o.id), o])); } catch { local = null; } }
for (const r of Array.isArray(tables.objects) ? tables.objects : []) {
if (!r || !r.id) continue;
let cur = local ? local.get(String(r.id)) || null : null;
if (!cur && typeof store.get === 'function') { try { cur = await store.get('objects', r.id); } catch { cur = null; } }
if (_or(cur) || _or(r)) erased.add(String(r.id));
}
for (const [_o1i, rows] of Object.entries(tables)) {
if (!BACKUP_TABLES.includes(_o1i) || !Array.isArray(rows)) continue;
if ((_o14 === 'foreign' || skipSettings) && _o1i === 'settings') continue;
let _op = null;
if (mode !== 'exact' && typeof store.list === 'function') { try { _op = _o1i === 'objects' && local ? local : new Map((await store.list(_o1i, null, { includeDeleted: true })).map((o) => [String(o[_o1i === 'settings' ? 'key' : 'id']), o])); } catch { _op = null; } }
for (const r of rows) {
if (!_ov(_o1i, r)) continue;
if (erased.size && r) {
if (_o1i === 'objects' && (erased.has(String(r.id)) || _o1a(r).some((_o1l) => erased.has(_o1l)))) continue;
if ((_o1i === 'events' || _o1i === 'reminders' || _o1i === 'quotes') && erased.has(String(r.object_id))) continue;
}
if (mode !== 'exact' && r) {
const cur = _op ? _op.get(String(r[_o1i === 'settings' ? 'key' : 'id'])) : null;
if (!cur) { if (Number(r.deleted) === 1) continue; await store.put(_o1i, r, { keepStamp: true }); n++; continue; }
if (Number(cur.deleted) !== 1 || Number(r.deleted) === 1 || cur.hidden || _or(cur) || _os(cur) || _o1i === 'settings') continue;
const body = Object.keys(cur).length > 5 ? cur : r;
await store.put(_o1i, { ...body, deleted: 0 }); n++;
continue;
}
await store.put(_o1i, r); n++;
}
}
return n;
}
export async function restoreModeDialog(ui, lead = null) {
const _oz = ui.modal({ title: t('mnt.backup.mode.title'), body: ui.h('div', null, lead,
ui.h('p', null, ui.h('strong', null, t('mnt.backup.mode.fill')), ' – ', t('mnt.backup.mode.fill_lead')),
ui.h('p', null, ui.h('strong', null, t('mnt.backup.mode.exact')), ' – ', t('mnt.backup.mode.exact_lead'))),
actions: [{ label: t('common.cancel'), kind: 'ghost', value: null },
{ label: t('mnt.backup.mode.exact'), kind: 'danger', value: 'exact', id: 'mnt-restore-exact' },
{ label: t('mnt.backup.mode.fill'), kind: 'primary', value: 'fill', id: 'mnt-restore-fill' }] });
return (await _oz.done) || null;
}
export const LAST_SETTING = 'backup.last_at';
const _o2 = 'bds:backup:last', LS_FIRST = 'bds:backup:first', LS_SNOOZE = 'bds:backup:snooze';
const _o13 = { last: 0, snooze: 0 };
const _o11 = (...v) => { let _oz = 0; for (const _o1l of v) { const n = Number(_o1l); if (Number.isFinite(n) && n > _oz) _oz = n; } return _oz; };
export function lastBackupAt(settings) {
let _o1h = 0; try { _o1h = settings && settings.get ? settings.get(LAST_SETTING, 0) : 0; } catch { _o1h = 0; }
return _o11(_o1h, ls.get(_o2, 0), _o13.last);
}
export async function markBackedUp(settings, now = Date.now(), { owner = true } = {}) {
_o13.last = now; ls.set(_o2, now);
if (owner) { try { if (settings && settings.set) await settings.set(LAST_SETTING, now); } catch { } }
return now;
}
export function snoozeBackup(now = Date.now()) { _o13.snooze = now + 86400000; ls.set(LS_SNOOZE, _o13.snooze); }
export async function backupDueInfo({ settings, store, now = Date.now() } = {}) {
const _o1 = await import('./backup_logic.81990d6dfc.js');
const lastAt = lastBackupAt(settings);
let firstSeen = Number(ls.get(LS_FIRST, 0)) || 0;
if (!firstSeen) { ls.set(LS_FIRST, now); firstSeen = Number(ls.get(LS_FIRST, 0)) || 0; }
let oldestCustomer = 0;
if (!lastAt && !firstSeen && store) {
try { for (const c of await store.list('objects')) { const at = Number(c && c.created_at) || 0; if (at && (c.kind === 'customer' || !c.kind) && (!oldestCustomer || at < oldestCustomer)) oldestCustomer = at; } } catch { }
}
const snoozeUntil = _o1.pickLastAt(ls.get(LS_SNOOZE, 0), _o13.snooze);
const due = _o1.backupDue({ lastAt, firstSeen, oldestCustomer, snoozeUntil, now });
return { due, never: !lastAt, days: _o1.daysSince(lastAt || firstSeen || oldestCustomer || now, now) };
}
export function dueBanner(info, { ui, nav }) {
const { h, button } = ui;
const _oj = h('div', { class: 'xo-banner card', role: 'note', 'data-testid': 'backup-due' },
h('span', { class: 'card-ico' }, ui.icon('disk', 20)),
h('p', null, h('strong', null, info.never ? t('mnt.due.never') : t('mnt.due.days', { n: info.days })), ' ', t('mnt.due.sub')),
h('div', { class: 'btn-row' },
button(t('mnt.backup.now'), () => { _oj.remove(); nav('settings/maintenance'); }, { kind: 'primary', small: true, icon: 'disk', testid: 'backup-due-go' }),
button(t('mnt.due.later'), () => { snoozeBackup(); _oj.remove(); }, { kind: 'ghost', small: true, icon: 'clock', testid: 'backup-due-later' })));
return _oj;
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
const c = await caches.open(name);
for (const _o1b of await c.keys()) {
const _o1c = await c.match(_o1b);
if (_o1c && isStale(_o1c.headers.get('date'), now)) { await c.delete(_o1b); n++; }
}
}
}
const _oy = ls.get('bds:errlog', []); const _ow = pruneLog(_oy, now);
if (_ow.length !== _oy.length) { ls.set('bds:errlog', _ow); n += _oy.length - _ow.length; }
const _oi = ls.get('bds:mem:edits', []); const _ou = pruneLog(_oi, now, 60);
if (_ou.length !== _oi.length) { ls.set('bds:mem:edits', _ou); n += _oi.length - _ou.length; }
ls.set('bds:clean:last', now);
return n;
}
export async function cleanEngine(base, fetchFn = (u, o) => fetch(u, o)) {
const _od = new AbortController(); const _o1j = setTimeout(() => _od.abort(), 4000);
try {
const r = await fetchFn(base.replace(/\/$/, '') + '/cleanup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ days: CLEAN_DAYS }), signal: _od.signal });
if (r.status === 404) return { ok: false, msg: 'chưa có /cleanup (chờ cập nhật máy dựng)' };
const j = await r.json().catch(() => ({}));
return { ok: r.ok, msg: r.ok ? 'đã dọn ' + (j.removed ?? j.deleted ?? 0) + ' tệp' : 'HTTP ' + r.status };
} catch { return { ok: false, msg: 'không chạy' }; } finally { clearTimeout(_o1j); }
}
export function cleanDue(now = Date.now()) { return now - (Number(ls.get('bds:clean:last', 0)) || 0) > 86400000; }
export const BIO_KEY = 'bds:bio';
export function bioHostOk(hostname) { return !!hostname && !/^\d+\.\d+\.\d+\.\d+$/.test(hostname) && !hostname.includes(':'); }
export function bioSupported(_o1k = typeof window !== 'undefined' ? window : null) {
return !!(_o1k && _o1k.PublicKeyCredential && _o1k.navigator && _o1k.navigator.credentials && _o1k.isSecureContext && bioHostOk(_o1k.location.hostname));
}
export function bioEnabled() { const v = ls.get(BIO_KEY, null); return !!(v && v.id); }
export function checkAssertion({ clientDataJSON, authenticatorData }, { challenge, origin }) {
let _oa; try { _oa = JSON.parse(new TextDecoder().decode(clientDataJSON)); } catch { return { ok: false, why: 'clientData' }; }
if (_oa.type !== 'webauthn.get') return { ok: false, why: 'type' };
if (b64url(challenge) !== _oa.challenge) return { ok: false, why: 'challenge' };
if (origin && _oa.origin !== origin) return { ok: false, why: 'origin' };
const _o4 = new Uint8Array(authenticatorData);
if (_o4.length < 37) return { ok: false, why: 'authData' };
const flags = _o4[32];
if (!(flags & 0x01)) return { ok: false, why: 'UP' };
if (!(flags & 0x04)) return { ok: false, why: 'UV' };
return { ok: true };
}
export function b64url(u8) { return toB64(new Uint8Array(u8)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function _oo(_o1e) { _o1e = String(_o1e).replace(/-/g, '+').replace(/_/g, '/'); while (_o1e.length % 4) _o1e += '='; return fromB64(_o1e); }
export async function bioRegister({ appName = 'Studio', userName = 'owner' } = {}) {
const _oc = await navigator.credentials.create({ publicKey: {
rp: { name: appName, id: location.hostname },
user: { id: rand(16), name: userName, displayName: userName },
challenge: rand(32),
pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required', residentKey: 'discouraged' },
timeout: 60000, attestation: 'none'
} });
if (!_oc) throw new Error('no credential');
ls.set(BIO_KEY, { id: b64url(_oc.rawId), created_at: Date.now(), host: location.hostname });
return true;
}
export function bioDisable() { ls.set(BIO_KEY, null); }
export async function bioVerify() {
const v = ls.get(BIO_KEY, null); if (!v || !v.id) return false;
const challenge = rand(32);
const _o3 = await navigator.credentials.get({ publicKey: { challenge, allowCredentials: [{ type: 'public-key', id: _oo(v.id) }], userVerification: 'required', timeout: 60000, rpId: location.hostname } });
if (!_o3 || b64url(_o3.rawId) !== v.id) return false;
return checkAssertion({ clientDataJSON: _o3.response.clientDataJSON, authenticatorData: _o3.response.authenticatorData }, { challenge, origin: location.origin }).ok;
}
export function renderBioControl(box, { ui, app, prefix = 'mnt-bio' }) {
const { h, button, badge, toast } = ui;
const _of = () => {
const _o1g = bioSupported(); const on = bioEnabled();
ui.mountTo(box, h('h4', { class: 'section-title' }, t('mnt.bio')), h('p', { class: 'muted small' }, t('mnt.bio.lead')),
!_o1g ? h('p', { class: 'muted small', 'data-testid': prefix + '-na' }, t('mnt.bio.na')) : h('div', { class: 'btn-row' },
badge(on ? t('mem.on') : t('mnt.bio.off'), on ? 'ok' : 'neutral'),
on ? button(t('mnt.bio.off'), () => { bioDisable(); toast(t('mnt.bio.disabled'), 'ok'); _of(); }, { kind: 'ghost', testid: prefix + '-off' })
: button(t('mnt.bio.on'), async () => {
try { await bioRegister({ appName: t('app.name'), userName: (app && app.auth && app.auth.user && app.auth.user.username) || 'owner' }); toast(t('mnt.bio.enabled'), 'ok'); } catch { toast(t('mnt.bio.fail'), 'warn'); }
_of();
}, { kind: 'primary', icon: 'shield', testid: prefix + '-on' })));
};
_of();
}
export const BIO_OFFER_KEY = 'bds:bio_offer';
const _o0 = 14 * 24 * 3600 * 1000;
export function bioOfferDue(now = Date.now()) {
if (!bioSupported() || bioEnabled()) return false;
const v = ls.get(BIO_OFFER_KEY, null);
return !(v && Number(v.until) > now);
}
export async function offerBio({ ui, app }) {
if (!bioOfferDue() || document.querySelector('[data-testid="bio-offer"], [data-testid="lock-screen"]')) return false;
const { h, button, toast } = ui;
const later = () => { ls.set(BIO_OFFER_KEY, { until: Date.now() + _o0 }); _oz.close(); };
const on = async () => {
try { await bioRegister({ appName: t('app.name'), userName: (app && app.auth && app.auth.user && app.auth.user.username) || 'owner' }); toast(t('mnt.bio.enabled'), 'ok'); } catch { toast(t('mnt.bio.fail'), 'warn'); ls.set(BIO_OFFER_KEY, { until: Date.now() + _o0 }); }
_oz.close();
};
const _oz = ui.modal({ title: t('mnt.bio.offer.title'), body: h('div', { 'data-testid': 'bio-offer' }, h('p', null, t('mnt.bio.offer.text')),
h('div', { class: 'btn-row' }, button(t('mnt.bio.offer.on'), on, { kind: 'primary', icon: 'shield', testid: 'bio-offer-on' }), button(t('mnt.bio.offer.later'), later, { kind: 'ghost', testid: 'bio-offer-later' }))) });
return true;
}
export function attachLockScreen(lockEl, unlock, ui) {
if (!lockEl || !bioEnabled() || !bioSupported()) return null;
if (lockEl.querySelector('#unlock-bio')) return null;
const _on = lockEl.querySelector('form') || lockEl;
const _ok = _on.querySelector('.form-err');
const _o6 = ui.button(t('mnt.bio.unlock'), async () => {
let ok = false; try { ok = await bioVerify(); } catch { ok = false; }
if (ok) ok = await unlock();
if (!ok && _ok) _ok.textContent = t('mnt.bio.fail');
}, { kind: 'secondary', block: true, icon: 'shield', id: 'unlock-bio', testid: 'unlock-bio' });
const _o1f = _on.querySelector('button[type=submit]');
if (_o1f && _o1f.parentNode) _o1f.parentNode.insertBefore(_o6, _o1f.nextSibling); else _on.appendChild(_o6);
return _o6;
}
export function scrub(_o1e) {
return String(_o1e == null ? '' : _o1e)
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
const _o1k = typeof window !== 'undefined' ? window : {};
return ['web ' + (config.APP_VERSION || '?'), 'chế độ ' + (mode || '?'), (n.userAgent || '').slice(0, 160), _o1k.innerWidth ? _o1k.innerWidth + '×' + _o1k.innerHeight : '', n.language || ''].filter(Boolean).join(' · ');
}
export function renderMaintenancePanel(body, { ui, api, store, app, config, settings = null, engineOff = () => false }) {
const { h, button, field, toast, modal, copy, badge } = ui;
const _o8 = h('div', { class: 'sub-block', 'data-testid': 'mnt-backup' });
const cleanBox = h('div', { class: 'sub-block', 'data-testid': 'mnt-clean' });
const bioBox = h('div', { class: 'sub-block', 'data-testid': 'mnt-bio' });
const _o9 = h('div', { class: 'sub-block', 'data-testid': 'mnt-bug' });
body.append(_o8, cleanBox, bioBox, _o9);
const pw = field({ label: t('mnt.backup.pw'), type: 'password', autocomplete: 'current-password', id: 'mnt-pw' });
const _ox = h('div', { class: 'muted small' });
const _om = h('input', { type: 'file', accept: '.json,.studio-backup,application/json', class: 'sr-only', id: 'mnt-restore-file' });
_om.addEventListener('change', async () => {
const _ol = _om.files && _om.files[0]; _om.value = ''; if (!_ol) return;
try {
const pkg = JSON.parse(await _ol.text());
if (isPendingFile(pkg)) { const n = await importPending(store, pkg, { src: backupSource(store, config) }); store.syncNow && store.syncNow(); toast(pendWord('pend.imported', n), 'ok', 4500); return; }
await _o1d(pkg);
} catch (e) { toast(e.userMessage || e.message || t('err.generic'), 'error', 5000); }
});
const _o15 = () => { const v = String(pw.getValue() || ''); if (v.length < 8) { toast(t('auth.err.short'), 'warn'); pw.input.focus(); return null; } return v; };
const _ot = () => { const role = app && app.auth && app.auth.user ? app.auth.user.role : ''; return !role || role === 'owner'; };
const lastEl = h('p', { class: 'muted small', 'data-testid': 'mnt-backup-last' });
const autoBox = h('div', { 'data-testid': 'mnt-backup-auto' });
const _og = () => { const at = lastBackupAt(settings); lastEl.textContent = at ? t('mnt.backup.last', { d: ui.date(at, true) }) : t('mnt.backup.never'); };
const _o7 = async () => { await markBackedUp(settings, Date.now(), { owner: _ot() }); _og(); };
async function _o5(wrong) {
const _ol = field({ label: t('mnt.restore.pw_label'), type: 'password', autocomplete: 'current-password', id: 'mnt-restore-pw' });
const _oz = modal({ title: t('mnt.restore.pw_title'), body: h('div', null, wrong ? h('p', { class: 'warn-text', 'data-testid': 'mnt-restore-pw-wrong' }, t('mnt.restore.pw_wrong')) : null, _ol),
actions: [{ label: t('common.cancel'), kind: 'ghost', value: null }, { label: t('mnt.restore.open'), kind: 'primary', id: 'mnt-restore-pw-ok', value: 'ok' }] });
setTimeout(() => { try { _ol.input.focus(); } catch { } }, 50);
const v = await _oz.done;
return v === 'ok' ? String(_ol.getValue() || '') : null;
}
async function _o10() { const p = _o15(); if (!p) return null; const data = await collect(store, BACKUP_TABLES, { src: backupSource(store, config) }); return { pkg: await encryptBackup(data, p, { app: config.PACK || 'studio' }), count: data.count }; }
function fileName() { return 'sao-luu-' + new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-') + '.studio-backup.json'; }
async function saveFile() { const r = await _o10(); if (!r) return; download(fileName(), JSON.stringify(r.pkg), 'application/json'); toast(t('mnt.backup.done', { n: r.count }), 'ok'); await _o7(); }
async function saveXlsx() {
const _o1 = await import('./backup_logic.81990d6dfc.js');
const _oe = await _o1.collectBackup(store, { appVersion: config.APP_VERSION || '' });
download('khach-hang-' + new Date().toISOString().slice(0, 10) + '.xlsx', _o1.customersXlsx(_oe.tables), 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
toast(t('mnt.backup.xlsx_done', { n: _oe.counts.customers }), 'ok', 5000);
}
async function _o1d(pkg) {
let p = String(pw.getValue() || ''), data = null, wrong = false;
for (;;) {
if (p.length < 8) { p = await _o5(wrong); if (p === null) return; if (p.length < 8) { wrong = true; continue; } }
try { data = await decryptBackup(pkg, p); break; } catch (e) { if (!e || e.code !== 'BAD_PASSWORD') throw e; wrong = true; p = ''; }
}
const src = backupSource(store, config), _o14 = sourceMismatch(data && data.src, src);
const role = app && app.auth && app.auth.user ? app.auth.user.role : '';
const owner = !role || role === 'owner';
if (_o14 === 'other_user' && !owner) { toast(t('mnt.backup.other_user'), 'error', 8000); return; }
if (_o14 === 'other_user' && !(await ui.confirm(t('mnt.backup.other_user_owner'), { ok: t('mnt.backup.restore_file'), kind: 'danger', title: t('mnt.backup') }))) return;
if (_o14 === 'foreign' && !(await ui.confirm(t('mnt.backup.foreign'), { ok: t('mnt.backup.restore_file'), kind: 'danger', title: t('mnt.backup') }))) return;
let lead = null;
try {
const _o1 = await import('./backup_logic.81990d6dfc.js');
const c = _o1.countsOf((data && data.tables) || {});
const _o18 = await _o1.planRestore(store, (data && data.tables) || {});
lead = h('div', { 'data-testid': 'mnt-restore-preview' },
h('p', null, t('mnt.restore.preview', { d: pkg && pkg.created_at ? ui.date(pkg.created_at, true) : '?', c: c.customers, p: c.partners, e: c.events || 0, r: c.reminders || 0, j: c.projects || 0 })),
_o18.erased ? h('p', { class: 'warn-text', 'data-testid': 'mnt-restore-erased' }, t('mnt.restore.erased', { n: _o18.erased })) : null);
} catch { lead = null; }
const mode = await restoreModeDialog(ui, lead);
if (!mode) return;
if (mode === 'exact' && !(await ui.confirm(t('mnt.backup.confirm'), { ok: t('mnt.backup.restore_file'), kind: 'danger', title: t('mnt.backup') }))) return;
if (store.syncNow) { try { await Promise.race([store.syncNow(), new Promise((r) => setTimeout(r, 15000))]); } catch { } }
const n = await restoreInto(store, data, { src, mode, foreignOk: _o14 === 'foreign', otherUserOk: _o14 === 'other_user' && owner, skipSettings: !owner });
store.syncNow && store.syncNow();
toast(t(mode === 'exact' ? 'mnt.backup.restored' : 'mnt.backup.filled', { n }), 'ok', 4500);
}
_o8.append(h('h4', { class: 'section-title' }, t('mnt.backup')), h('p', { class: 'muted small' }, t('mnt.backup.lead')), pw,
h('div', { class: 'btn-row' },
button(t('mnt.backup.now'), async () => {
const r = await _o10(); if (!r) return;
try { await api.call('backup.now', { enc: r.pkg }); toast(t('mnt.backup.done', { n: r.count }), 'ok'); _oh(); await _o7(); } catch (e) {
if (!isMissingAction(e)) throw e;
toast(t('mnt.backup.waiting'), 'info', 5000); download(fileName(), JSON.stringify(r.pkg), 'application/json'); await _o7();
}
}, { kind: 'primary', icon: 'disk', testid: 'mnt-backup-now' }),
button(t('mnt.backup.file'), saveFile, { kind: 'secondary', icon: 'disk', testid: 'mnt-backup-file' }),
button(t('mnt.backup.restore_file'), () => _om.click(), { kind: 'ghost', icon: 'refresh', testid: 'mnt-restore' }), _om),
lastEl,
h('div', { class: 'btn-row' }, button(t('mnt.backup.xlsx'), saveXlsx, { kind: 'ghost', icon: 'download', testid: 'mnt-export-xlsx' })),
autoBox,
h('h4', { class: 'section-title' }, t('mnt.backup.list')), _ox);
if (_ot()) import('./backup_options.acdee9f5d5.js').then((_oz) => _oz.renderBackupOptions(autoBox, { ui, api, store, config })).catch(() => { });
async function _oh() {
try {
const d = await api.call('backup.list', {});
const rows = Array.isArray(d) ? d : (d && (d.items || d.backups)) || [];
ui.mountTo(_ox, rows.length ? ui.list(rows, (_o6) => h('div', { class: 'row-main' }, h('span', null, ui.date(_o6.at || _o6.created_at, true) + (_o6.size ? ' · ' + Math.round(_o6.size / 1024) + ' KB' : '')),
button(t('mnt.backup.restore_drive'), async () => { const r = await api.call('backup.restore', { id: _o6.id }); await _o1d(r && (r.enc || r)); }, { kind: 'ghost', small: true, icon: 'cloud', testid: 'mnt-restore-drive' }))) : t('mnt.backup.none'));
} catch (e) { _ox.textContent = isMissingAction(e) ? t('mnt.backup.waiting').split(' – ')[0] + '.' : (e.userMessage || t('err.network')); }
}
_oh();
_og();
const _ob = h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'mnt-clean-out' });
const _o16 = () => { try { return !!engineOff(); } catch { return false; } };
cleanBox.append(h('h4', { class: 'section-title' }, t('mnt.clean')), h('p', { class: 'muted small' }, t(_o16() ? 'mnt.clean.lead_web' : 'mnt.clean.lead')),
h('div', { class: 'btn-row' }, button(t('mnt.clean.run'), async () => {
const n = await cleanBrowser();
if (_o16()) { _ob.textContent = t('mnt.clean.done', { n }); return; }
const e = await cleanEngine(config.ENGINE_URL || 'http://127.0.0.1:8765');
_ob.textContent = t('mnt.clean.done', { n }) + ' ' + t('mnt.clean.engine', { msg: e.msg });
}, { kind: 'secondary', icon: 'refresh', testid: 'mnt-clean-run' })), _ob);
renderBioControl(bioBox, { ui, app, prefix: 'mnt-bio' });
const steps = field({ label: t('mnt.bug.steps'), type: 'textarea', rows: 3, id: 'mnt-steps' });
const recent = (app.errors && app.errors.recent ? app.errors.recent() : []).slice(-10).reverse();
_o9.append(h('h4', { class: 'section-title' }, t('mnt.bug')), h('p', { class: 'muted small' }, t('mnt.bug.lead')),
recent.length ? ui.list(recent.slice(0, 5), (e) => h('div', { class: 'row-text' }, h('div', { class: 'row-line' }, badge(e.level, e.level === 'critical' ? 'danger' : 'warn'), h('span', { class: 'muted small num' }, ui.date(e.at, true))), h('span', { class: 'small break' }, scrub(e.where + ': ' + e.message)))) : h('p', { class: 'muted small' }, t('set.errors.none')),
steps,
h('div', { class: 'btn-row' }, button(t('mnt.bug.make'), async () => {
const ver = app.swVersion ? await app.swVersion() : '';
const _o12 = bugReport({ errors: app.errors ? app.errors.recent() : [], steps: steps.getValue(), version: (config.APP_VERSION || '') + (ver ? ' / ' + ver : ''), env: envText(config, api.mode), appName: t('app.name') });
const ta = h('textarea', { class: 'handoff-prompt', readonly: true, rows: 12, 'data-testid': 'mnt-bug-text' }); ta.value = _o12;
modal({ title: t('mnt.bug'), wide: true, body: h('div', null, ta, h('div', { class: 'btn-row' },
button(t('common.copy'), () => copy(_o12), { kind: 'primary', icon: 'log' }),
button(t('mnt.bug.open'), async () => { await copy(_o12, { silent: true }); window.open(_o12.length < 5000 ? 'https://claude.ai/new?q=' + encodeURIComponent(_o12) : 'https://claude.ai/new', '_blank', 'noopener'); }, { kind: 'secondary', icon: 'sparkle' }))),
actions: [{ label: t('common.close'), kind: 'ghost' }] });
}, { kind: 'primary', icon: 'log', testid: 'mnt-bug-make' })));
}
export default { encryptBackup, decryptBackup, collect, restoreInto, isStale, cleanBrowser, cleanEngine, checkAssertion, bioSupported, bioRegister, bioVerify, attachLockScreen, scrub, bugReport, renderMaintenancePanel };

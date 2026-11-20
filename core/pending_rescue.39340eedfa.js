import { scriptUrl } from './api.8a9774059d.js';
export const PENDING_FORMAT = 'studio-pending';
export function fingerprint(s) { let h = 0x811c9dc5; for (const _o1 of String(s || '')) { h ^= _o1.codePointAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); }
export function backupSource(store, config) { let _o4 = ''; try { _o4 = scriptUrl(config); } catch { _o4 = ''; } return { server: fingerprint(_o4 || 'demo'), user: String((store && store.userId) || '') }; }
export const WORDS = {
'pend.download': 'Tải tệp các thay đổi chưa gửi',
'pend.kept.title': 'Còn {n} thay đổi chưa gửi – vẫn giữ trên máy',
'pend.kept.text': 'Máy chủ vừa từ chối phiên đăng nhập của máy này (vd đã đổi mật khẩu hoặc tài khoản tạm bị khoá). {n} thay đổi chưa gửi VẪN GIỮ trên máy: đăng nhập lại đúng tài khoản là app tự gửi tiếp. Nếu người khác đăng nhập trên máy này, app sẽ hỏi trước khi xoá. Có thể tải tệp các thay đổi để giữ riêng.',
'pend.other.title': 'Còn {n} thay đổi chưa gửi của tài khoản trước',
'pend.other.text': 'Máy này còn {n} thay đổi chưa gửi của tài khoản đã dùng trước đó. Vào bằng tài khoản khác sẽ XOÁ chúng khỏi máy (dữ liệu của mỗi người không để lẫn trên một máy). Tải tệp các thay đổi trước – tài khoản cũ nhập lại tệp này ở Cài đặt › Bảo trì › Khôi phục từ tệp.',
'pend.other.wipe': 'Xoá và tiếp tục',
'pend.other.cancel': 'Huỷ – đăng xuất',
'pend.saved': 'Đã tải tệp {n} thay đổi chưa gửi.',
'pend.imported': 'Đã đưa {n} thay đổi từ tệp vào hàng chờ gửi.',
'pend.wrong_user': 'Tệp này là thay đổi chưa gửi của một tài khoản khác hoặc máy chủ khác – chỉ chính tài khoản đó nhập lại được.',
'pend.bad': 'Tệp không đúng định dạng "thay đổi chưa gửi".'
};
const fill = (s, n) => String(s).replace(/\{n\}/g, String(n));
export const word = (k, n) => fill(WORDS[k] || k, n);
export function pendingCount(store) {
try { return store && typeof store.status === 'function' ? Number(store.status().pending) || 0 : 0; } catch { return 0; }
}
export function pendingPackage(store, { src, now = Date.now() } = {}) {
const ops = store && typeof store.pendingOps === 'function' ? store.pendingOps() : [];
return { format: PENDING_FORMAT, v: 1, created_at: now, src: src || null, count: ops.length, ops };
}
export function pendingFileName(now = Date.now()) {
return 'thay-doi-chua-gui-' + new Date(now).toISOString().slice(0, 16).replace(/[:T]/g, '-') + '.json';
}
export function isPendingFile(pkg) { return !!pkg && typeof pkg === 'object' && pkg.format === PENDING_FORMAT && Array.isArray(pkg.ops); }
export async function importPending(store, pkg, { src } = {}) {
if (!isPendingFile(pkg)) throw Object.assign(new Error(WORDS['pend.bad']), { code: 'BAD_INPUT', userMessage: WORDS['pend.bad'] });
const _o0 = pkg.src || {}, b = src || {};
if (!_o0.user || !b.user || _o0.user !== b.user || (_o0.server && b.server && _o0.server !== b.server)) {
throw Object.assign(new Error(WORDS['pend.wrong_user']), { code: 'PENDING_OTHER', userMessage: WORDS['pend.wrong_user'] });
}
return store.requeue(pkg.ops);
}
export async function pendingDialog({ ui, n, kind, download }) {
const _o2 = { label: word('pend.download', n), kind: 'secondary', id: 'pend-download', close: false, onClick: async () => { await download(); ui.toast(word('pend.saved', n), 'ok', 4000); } };
const actions = kind === 'other'
? [_o2, { label: WORDS['pend.other.cancel'], kind: 'ghost', value: 'cancel', id: 'pend-cancel' }, { label: WORDS['pend.other.wipe'], kind: 'danger', value: 'wipe', id: 'pend-wipe' }]
: [_o2, { label: 'Đã hiểu', kind: 'primary', value: 'ok', id: 'pend-ok' }];
const _o3 = ui.modal({ title: word(kind === 'other' ? 'pend.other.title' : 'pend.kept.title', n), dismissible: kind !== 'other',
body: ui.h('p', { 'data-testid': 'pend-' + kind }, word(kind === 'other' ? 'pend.other.text' : 'pend.kept.text', n)), actions });
const v = await _o3.done;
return v || (kind === 'other' ? 'cancel' : 'ok');
}
export default { PENDING_FORMAT, fingerprint, backupSource, WORDS, word, pendingCount, pendingPackage, pendingFileName, isPendingFile, importPending, pendingDialog };

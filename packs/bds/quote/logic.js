export const KIND = 'photo';
export const MAX_FILES = 6;
export const PHOTO = { maxSide: 1600, quality: 0.82, mime: 'image/jpeg', maxBytes: 6 * 1024 * 1024, thumbSide: 160, thumbQuality: 0.6 };
export const PDF_MAX = 6 * 1024 * 1024;
export const THUMB_MAX = 12000;
export const NOTE_MAX = 300;
export const TEXT = {
intro: 'Chọn khách, tải ảnh phiếu tính giá anh/chị đã có (chụp hoặc chọn từ máy, PDF cũng được), bấm Lưu – báo giá nằm trong hồ sơ khách.',
noAi: 'App không tự tính giá và không dùng AI tính giá – chỉ lưu đúng phiếu anh/chị tải lên.',
pickCustomer: 'Chọn khách trước khi lưu.',
noFiles: 'Thêm ít nhất 1 ảnh hoặc tệp PDF phiếu tính giá.',
tooMany: 'Tối đa ' + MAX_FILES + ' tệp mỗi lần lưu.',
notImage: 'Chỉ nhận ảnh (JPG, PNG, HEIC…) hoặc tệp PDF.',
pdfOld: 'Máy chủ chưa nhận tệp PDF – chụp màn hình phiếu rồi tải ảnh, hoặc cập nhật máy chủ (Cài đặt › Phiên bản).',
pdfBig: 'Tệp PDF quá lớn (tối đa 6 MB).',
noDrive: 'Chưa lưu được lên Google Drive – kiểm tra Kết nối máy chủ rồi thử lại.',
};
const _o5 = (v, max) => String(v == null ? '' : v).normalize('NFC').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
export function isPdf(f) { return !!f && (/^application\/pdf$/i.test(String(f.type || '')) || /\.pdf$/i.test(String(f.name || ''))); }
export function isImage(f) { return !!f && (/^image\//i.test(String(f.type || '')) || /\.(jpe?g|png|webp|heic|heif|gif|bmp)$/i.test(String(f.name || ''))); }
export function fileProblem(f) {
if (!f) return TEXT.notImage;
if (isPdf(f)) return Number(f.size) > PDF_MAX ? TEXT.pdfBig : '';
return isImage(f) ? '' : TEXT.notImage;
}
export function fitSize(w, h, max = PHOTO.maxSide) {
w = Number(w); h = Number(h);
if (!(w > 0) || !(h > 0) || !Number.isFinite(w) || !Number.isFinite(h)) return null;
const _o1 = Math.min(1, max / Math.max(w, h));
return { w: Math.max(1, Math.round(w * _o1)), h: Math.max(1, Math.round(h * _o1)) };
}
export function b64Bytes(b64) { const _o4 = String(b64 || ''); return Math.floor(_o4.length / 4 * 3) - (_o4.endsWith('==') ? 2 : _o4.endsWith('=') ? 1 : 0); }
export function saveProblem({ customer, files } = {}) {
if (!customer) return TEXT.pickCustomer;
const _o3 = Array.isArray(files) ? files.length : 0;
if (!_o3) return TEXT.noFiles;
if (_o3 > MAX_FILES) return TEXT.tooMany;
return '';
}
export function cleanPhoto(p = {}) {
const id = _o5(p.drive_id, 120);
if (!/^[A-Za-z0-9_-]{10,}$/.test(id)) return null;
const via = p.via === 'g1' ? 'g1' : 'quote';
const thumb = typeof p.thumb === 'string' && /^data:image\/(jpeg|png|webp);base64,/.test(p.thumb) && p.thumb.length <= THUMB_MAX ? p.thumb : '';
return { drive_id: id, mime: /^application\/pdf$/.test(p.mime) ? 'application/pdf' : /^image\/(png|webp)$/.test(p.mime) ? p.mime : 'image/jpeg', name: _o5(p.name, 120), size: Math.max(0, Math.floor(Number(p.size) || 0)), via, ...(thumb ? { thumb } : {}) };
}
export function photoRow({ id, customer, project = null, photos = [], note = '', now = Date.now() } = {}) {
const list = photos.map(cleanPhoto).filter(Boolean).slice(0, MAX_FILES);
list.forEach((p, i) => { if (i > 0) delete p.thumb; });
const payload = { kind: KIND, v: 1, photos: list, note: _o5(note, NOTE_MAX), project_name: project ? _o5(project.name, 120) : '', customer_name: customer ? _o5(customer.name, 120) : '' };
return { id, object_id: customer ? customer.id : '', project_id: project ? project.id : '', unit_type: '', area: '', price_total: '', plan_id: '', policy_id: '',
payload: JSON.stringify(payload), created_at: now, updated_at: now, deleted: 0 };
}
export function photoFromRow(row) {
if (!row) return null;
let _o2 = row.payload;
if (typeof _o2 === 'string') { try { _o2 = JSON.parse(_o2); } catch { return null; } }
if (!_o2 || _o2.kind !== KIND || !Array.isArray(_o2.photos)) return null;
return { id: row.id, object_id: row.object_id || '', project_id: row.project_id || '', created_at: Number(row.created_at) || Number(row.updated_at) || 0,
photos: _o2.photos.map(cleanPhoto).filter(Boolean), note: _o5(_o2.note, NOTE_MAX), project_name: _o5(_o2.project_name, 120) };
}
export function eventText({ photos = [], project = null, note = '' } = {}) {
const _o3 = photos.length, pdf = photos.filter((p) => p && p.mime === 'application/pdf').length, img = _o3 - pdf;
const _o6 = [img ? img + ' ảnh' : '', pdf ? pdf + ' PDF' : ''].filter(Boolean).join(' + ');
return 'Báo giá: phiếu tính giá (' + (_o6 || '0 tệp') + ')' + (project && project.name ? ' · ' + project.name : '') + (note ? ' · ' + _o5(note, 80) : '');
}
export function zaloText({ customer = null, project = null, profile = {} } = {}) {
const _o0 = customer && customer.name ? 'anh/chị ' + _o5(customer.name, 60) : 'anh/chị';
return 'Em gửi ' + _o0 + ' phiếu tính giá' + (project && project.name ? ' ' + project.name : '') + ' ạ. Giá theo phiếu của chủ đầu tư, có thể thay đổi – anh/chị cần em giải thích chỗ nào cứ nhắn em.'
+ (profile && profile.name ? '\n' + _o5(profile.name, 60) + (profile.phone ? ' · ' + _o5(profile.phone, 20) : '') : '');
}
export function isMissingAction(e) {
if (!e || typeof e !== 'object') return false;
if (e.missingAction === true || e.code === 'UNKNOWN_ACTION') return true;
return e.code === 'BAD_INPUT' && /không được hỗ trợ|not supported|unknown action/i.test(String(e.serverMessage || e.message || ''));
}
export const getAction = (p) => (p && p.via === 'g1' ? 'g1.doc_get' : 'quote.photo_get');
export default { KIND, MAX_FILES, PHOTO, TEXT, isPdf, isImage, fileProblem, fitSize, b64Bytes, saveProblem, cleanPhoto, photoRow, photoFromRow, eventText, zaloText, isMissingAction, getAction };

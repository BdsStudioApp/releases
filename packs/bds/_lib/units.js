import * as crm from './crm.js';
import * as CS from './consent.js';
export const KIND = 'unit_listing';
export const ROOT_FOLDER = 'BDS Studio – Căn';
export const NO_CODE = 'Chưa có mã';
export const STATUSES = [['selling', 'Đang bán'], ['hold', 'Giữ chỗ'], ['sold', 'Đã bán']];
export const STATUS_LABEL = Object.fromEntries(STATUSES);
export const OWNER_SOURCE = 'owner';
export const OWNER_SOURCE_LABEL = 'Chủ căn';
export const OWNER_TAG = 'Chủ căn';
export const LIMITS = { code: 60, folder: 40, project: 120, note: 1000, ownerNote: 300, name: 120, photos: 40, thumb: 12000 };
export const PHOTO = { maxSide: 1600, quality: 0.82, mime: 'image/jpeg', maxBytes: 8 * 1024 * 1024, thumbSide: 120, thumbQuality: 0.6 };
export const PAGE = { maxPages: 100, maxHtmlMB: 3, galleryMax: 9, heroPhotos: 1 };
export const PAGE_PHOTOS_MAX = PAGE.galleryMax + PAGE.heroPhotos;
export const NEED_SERVER_TEXT = 'Cần cập nhật máy chủ một lần để lưu ảnh lên Drive';
export const DATA_NOTE = 'Dữ liệu căn và ảnh nằm ở Google của anh/chị (Sheet + Drive riêng), không nằm ở máy chủ của app.';
const _oh = (v, max) => String(v == null ? '' : v).normalize('NFC').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
const _oc = (n) => String(n).padStart(2, '0');
export function normCode(s) { return _oh(s, LIMITS.code); }
export function codeKey(s) { return crm.strip(normCode(s)).replace(/[\s\-_./]+/g, ''); }
export function stampVN(ms) {
const _o0 = new Date(Number(ms) + 7 * 3600e3);
return _oc(_o0.getUTCDate()) + '/' + _oc(_o0.getUTCMonth() + 1) + '/' + _o0.getUTCFullYear() + ' ' + _oc(_o0.getUTCHours()) + ':' + _oc(_o0.getUTCMinutes());
}
export function folderBase(code) {
let s = normCode(code).replace(/[\\/:*?"<>|#%{}~&^`]+/g, ' ').replace(/^[\s.]+|[\s.]+$/g, '').replace(/\s+/g, ' ').trim();
if (s.length > LIMITS.folder) s = s.slice(0, LIMITS.folder).replace(/[\s.\-_]+$/, '');
return s;
}
export function folderName(code, taken = [], now = Date.now()) {
const base = folderBase(code) || NO_CODE + ' – ' + stampVN(now);
const used = new Set((taken || []).map((_oj) => crm.strip(_oj)));
if (!used.has(crm.strip(base))) return base;
for (let _o5 = 2; _o5 < 1000; _o5++) { const n = base + ' (' + _o5 + ')'; if (!used.has(crm.strip(n))) return n; }
return base + ' (' + now + ')';
}
export function isNoCodeFolder(name) { return String(name || '').startsWith(NO_CODE + ' – '); }
export function needsRename(prev, next) {
const pd = parseData(prev && prev.data), nd = parseData(next && next.data);
const _o1 = nd.folder_id || pd.folder_id;
const code = normCode(next && next.name);
if (!_o1 || !code) return false;
if (isNoCodeFolder(nd.folder_name || pd.folder_name)) return true;
return codeKey(prev && prev.name) !== codeKey(code);
}
export function sameCode(list, code, exceptId) {
const _o7 = codeKey(code);
if (!_o7) return null;
return activeUnits(list).find((u) => u.id !== exceptId && codeKey(u.name) === _o7) || null;
}
export function parseData(_o0) { return crm.parseData(_o0); }
export const isUnit = (_o9) => !!_o9 && _o9.kind === KIND;
export function activeUnits(list) { return (list || []).filter((_o9) => isUnit(_o9) && !Number(_o9.deleted) && !parseData(_o9.data).archived); }
export function numOrBlank(v) {
const s = String(v == null ? '' : v).trim().replace(/\s+/g, '').replace(',', '.');
if (!s) return '';
const n = Number(s);
return Number.isFinite(n) && n >= 0 ? n : '';
}
export function unitRow(input = {}, base = {}, now = Date.now()) {
const _oj = input || {};
const old = parseData(base.data);
const status = STATUS_LABEL[_oj.status] ? _oj.status : (STATUS_LABEL[base.status] ? base.status : 'selling');
const owner = { ...(old.owner || {}) };
if (_oj.owner) {
owner.name = _oh(_oj.owner.name, LIMITS.name);
owner.phone = crm.normPhone(_oj.owner.phone);
owner.note = _oh(_oj.owner.note, LIMITS.ownerNote);
if (_oj.owner.consent) { if (!owner.consent_at) { owner.consent_at = now; owner.consent_by = _oh(_oj.owner.by, 80); } }
else { delete owner.consent_at; delete owner.consent_by; }
}
const data = {
...old,
floor: _oh(_oj.floor ?? old.floor, 20), facing: _oh(_oj.facing ?? old.facing, 40),
beds: _oj.beds !== undefined ? numOrBlank(_oj.beds) : (old.beds ?? ''), area: _oj.area !== undefined ? numOrBlank(_oj.area) : (old.area ?? ''),
price: _oj.price !== undefined ? _oh(_oj.price, 40) : (old.price || ''),
photos: Array.isArray(_oj.photos) ? cleanPhotos(_oj.photos) : cleanPhotos(old.photos),
owner,
};
data.thumb = typeof _oj.thumb === 'string' ? (_oj.thumb.length <= LIMITS.thumb ? _oj.thumb : '') : (old.thumb || '');
if (!data.photos.length) data.thumb = '';
return {
...base, kind: KIND, name: normCode(_oj.code ?? base.name), project: _oh(_oj.project ?? base.project, LIMITS.project),
status, note: String(_oj.note ?? base.note ?? '').normalize('NFC').trim().slice(0, LIMITS.note), phone: '',
data: JSON.stringify(data), created_at: base.created_at || now, deleted: 0,
};
}
export function cleanPhotos(list) {
const _oa = [];
for (const _ob of Array.isArray(list) ? list : []) {
if (!_ob || typeof _ob !== 'object') continue;
const drive_id = _oh(_ob.drive_id, 100), url = /^https:\/\//i.test(String(_ob.url || '')) ? String(_ob.url).trim().slice(0, 1000) : '';
if (!drive_id && !url) continue;
_oa.push({ drive_id, url, public: !!_ob.public, name: _oh(_ob.name, 120), ...(_ob.link ? { link: true } : {}) });
if (_oa.length >= LIMITS.photos) break;
}
return _oa;
}
export function unitTitle(u) { const c = normCode(u && u.name); return c ? 'Căn ' + c : 'Căn chưa có mã'; }
export function unitSub(u) {
const _o0 = parseData(u && u.data);
return [u && u.project, _o0.floor ? 'Tầng ' + _o0.floor : '', _o0.facing ? 'Hướng ' + _o0.facing : '', _o0.beds !== '' && _o0.beds != null ? _o0.beds + ' ngủ' : '',
_o0.area !== '' && _o0.area != null ? String(_o0.area).replace('.', ',') + ' m²' : '', _o0.price ? 'Giá ' + _o0.price : ''].filter(Boolean).join(' · ');
}
export function filterUnits(list, { status = '', q = '' } = {}) {
const words = crm.strip(q).split(' ').filter(Boolean);
const _oe = codeKey(q);
return activeUnits(list).filter((u) => {
if (status && u.status !== status) return false;
if (!words.length) return true;
const _o3 = crm.strip([u.name, u.project].join(' '));
return words.every((w) => _o3.includes(w)) || (_oe.length >= 2 && codeKey(u.name).includes(_oe));
}).sort((a, b) => (Number(b.updated_at) || 0) - (Number(a.updated_at) || 0));
}
export function countByStatus(list) {
const c = { '': 0 }; for (const [_o7] of STATUSES) c[_o7] = 0;
for (const u of activeUnits(list)) { c['']++; if (c[u.status] !== undefined) c[u.status]++; }
return c;
}
export function fitSize(w, h, max = PHOTO.maxSide) {
w = Number(w); h = Number(h);
if (!(w > 0) || !(h > 0) || !Number.isFinite(w) || !Number.isFinite(h)) return null;
const _o7 = Math.min(1, max / Math.max(w, h));
return { w: Math.max(1, Math.round(w * _o7)), h: Math.max(1, Math.round(h * _o7)), scaled: _o7 < 1 };
}
export function b64Bytes(b64) { const s = String(b64 || ''); return Math.floor(s.length / 4 * 3) - (s.endsWith('==') ? 2 : s.endsWith('=') ? 1 : 0); }
export function isImageFile(f) { return !!f && (/^image\//i.test(String(f.type || '')) || /\.(jpe?g|png|webp|heic|heif|gif|bmp)$/i.test(String(f.name || ''))); }
export function pagePhotos(photos) { return cleanPhotos(photos).filter((_ob) => _ob.public); }
export function photoLink(_ob) {
if (!_ob) return '';
if (_ob.drive_id && /^[\w-]{10,}$/.test(_ob.drive_id)) return 'https://drive.google.com/file/d/' + _ob.drive_id + '/view';
return /^https:\/\//i.test(String(_ob.url || '')) ? String(_ob.url) : '';
}
export function photoPlan(photos) {
const _og = pagePhotos(photos).filter((_ob) => photoLink(_ob));
const hero = _og.slice(0, PAGE.heroPhotos), gallery = _og.slice(PAGE.heroPhotos, PAGE.heroPhotos + PAGE.galleryMax);
return { selected: _og.length, hero, gallery, used: hero.length + gallery.length, dropped: Math.max(0, _og.length - PAGE_PHOTOS_MAX) };
}
export function limitText(published = null) {
return 'Khung ảnh của trang hiện tối đa ' + PAGE.galleryMax + ' ảnh + 1 ảnh bìa (' + PAGE_PHOTOS_MAX + ' ảnh). Xuất bản nhanh tối đa ' + PAGE.maxPages +
' trang (cộng mọi loại trang' + (published != null ? ', đang có ' + published + '/' + PAGE.maxPages : '') + '), mỗi trang ≤ ' + PAGE.maxHtmlMB + ' MB – ảnh qua link Drive không tính vào ' + PAGE.maxHtmlMB + ' MB.';
}
export function ownerCheck(owner) {
const _o9 = owner || {};
if (!_o9.consent) return { ok: false, error: 'Cần tick "Chủ nhà đã đồng ý lưu thông tin" trước khi lưu vào Khách hàng.' };
const _ob = crm.normPhone(_o9.phone);
if (!_ob) return { ok: false, error: 'Nhập số điện thoại chủ nhà để lưu vào Khách hàng (app dùng số này để tránh trùng khách).' };
if (!crm.validPhone(_ob)) return { ok: false, error: 'Số điện thoại chủ nhà chưa đúng (10 số, bắt đầu bằng 0).' };
return { ok: true, phone: _ob };
}
export function canPublish(u) {
const _o9 = parseData(u && u.data).owner || {};
return _o9.consent_at ? { ok: true, reason: '' } : { ok: false, reason: 'Cần chủ nhà đồng ý trước khi đăng căn lên trang – tick "Chủ nhà đã đồng ý lưu thông tin".' };
}
export function ownerDuplicate(objects, phone) { return crm.findDuplicatePhone(objects, phone); }
export function ownerNoteLine(code, project) { return 'Chủ căn ' + (normCode(code) || '(chưa có mã)') + (_oh(project, 80) ? ' – ' + _oh(project, 80) : ''); }
export function ownerConsentEntry({ code, now = Date.now(), by = '', by_name = '', channel = 'truc_tiep' } = {}) {
const _of = CS.makeEntry({ act: 'grant', scopes: ['luu'], channel, by, by_name, note: 'Chủ nhà đồng ý lưu thông tin khi lên căn ' + (normCode(code) || '(chưa có mã)') }, { now });
return _of.ok ? _of.entry : null;
}
export function ownerCustomer(u, { id, now = Date.now(), by = '', by_name = '' } = {}) {
const _o0 = parseData(u && u.data), _o9 = _o0.owner || {};
const entry = ownerConsentEntry({ code: u && u.name, now, by, by_name });
const base = { data: JSON.stringify({ source_detail: ('Lên căn ' + (normCode(u && u.name) || '')).trim().slice(0, 80), unit_id: u && u.id }) };
const w = CS.withEntry(base, entry);
return {
id, kind: 'customer', name: _oh(_o9.name, LIMITS.name) || ownerNoteLine(u && u.name, ''), phone: crm.normPhone(_o9.phone), zalo: crm.normPhone(_o9.phone),
need: 'bán', project: '', unit_type: '', budget: 0, source: OWNER_SOURCE, status: 'Mới', tags: OWNER_TAG,
note: [ownerNoteLine(u && u.name, u && u.project), _oh(_o9.note, LIMITS.ownerNote)].filter(Boolean).join('\n'),
consent: w.consent, data: w.data, created_at: now, deleted: 0,
};
}
export function ownerMergePatch(c, u, { now = Date.now(), by = '', by_name = '' } = {}) {
const _o9 = parseData(u && u.data).owner || {};
const _o8 = ownerNoteLine(u && u.name, u && u.project) + (_oh(_o9.note, LIMITS.ownerNote) ? ': ' + _oh(_o9.note, LIMITS.ownerNote) : '');
const note0 = String((c && c.note) || '');
const note = note0.includes(ownerNoteLine(u && u.name, u && u.project)) ? note0 : [note0.trim(), _o8].filter(Boolean).join('\n');
const tags = crm.tagList(c && c.tags);
if (!tags.some((t) => crm.strip(t) === crm.strip(OWNER_TAG))) tags.push(OWNER_TAG);
const _oa = { note, tags: tags.join(', ') };
if (!CS.allows(c, 'luu') && !CS.stateOf(c).withdrawn) {
const w = CS.withEntry(c, ownerConsentEntry({ code: u && u.name, now, by, by_name }));
_oa.data = w.data; _oa.consent = w.consent;
}
return _oa;
}
export function factsLines(u) {
const _o0 = parseData(u && u.data);
return [
normCode(u && u.name) ? 'Mã căn: ' + normCode(u.name) : '', u && u.project ? 'Dự án: ' + u.project : '',
_o0.floor ? 'Tầng: ' + _o0.floor : '', _o0.facing ? 'Hướng: ' + _o0.facing : '', _o0.beds !== '' && _o0.beds != null ? 'Số phòng ngủ: ' + _o0.beds : '',
_o0.area !== '' && _o0.area != null ? 'Diện tích: ' + String(_o0.area).replace('.', ',') + ' m²' : '', _o0.price ? 'Giá bán: ' + _o0.price : '',
].filter(Boolean).join('\n');
}
export function fillResale(cfg, u, { toUrl = (_oj) => _oj } = {}) {
const c = JSON.parse(JSON.stringify(cfg));
const code = normCode(u && u.name), proj = _oh(u && u.project, 80);
const _o4 = ['Cần bán căn', code, proj].filter(Boolean).join(' ');
const _o0 = parseData(u && u.data);
const _od = photoPlan(_o0.photos);
const _o6 = (_ob) => { const url = toUrl(photoLink(_ob)); return url ? { kind: 'url', url } : null; };
c.name = _o4.slice(0, 80);
c.seo.title = _o4.slice(0, 70);
c.s.hero.heading = (proj ? 'Căn hộ ' + proj : 'Căn hộ cần bán') + (code ? ' – ' + code : '');
c.s.hero.sub = [_o0.floor ? 'Tầng ' + _o0.floor : '', _o0.facing ? 'Hướng ' + _o0.facing : '', _o0.beds !== '' && _o0.beds != null ? _o0.beds + ' phòng ngủ' : '',
_o0.area !== '' && _o0.area != null ? String(_o0.area).replace('.', ',') + ' m²' : '', _o0.price ? 'Giá ' + _o0.price : ''].filter(Boolean).join(' · ') || c.s.hero.sub;
const facts = factsLines(u);
if (facts) { c.s.facts.items = facts; c.samples = (c.samples || []).filter((s) => s !== 'facts'); }
if (u && u.note) c.seo.description = (_o4 + '. ' + String(u.note)).replace(/\s+/g, ' ').slice(0, 160);
const hero = _od.hero.map(_o6).filter(Boolean);
const _o2 = _od.gallery.map(_o6).filter(Boolean);
if (hero.length) c.s.hero.image = hero[0];
if (_o2.length) c.s.gallery.images = _o2;
else if (hero.length) c.s.gallery.images = [hero[0]];
c.slug = c.slug || 'can-ban';
if (c.on && typeof c.on === 'object') for (const _oi of (c.samples || [])) c.on[_oi] = false;
c.from_unit = { id: (u && u.id) || '', code, at: Date.now() };
c.published = {};
return c;
}
export function isOldServer(e) {
if (!e || typeof e !== 'object') return false;
if (e.missingAction === true || e.code === 'UNKNOWN_ACTION') return true;
return e.code === 'BAD_INPUT' && /không được hỗ trợ|not supported|unknown action/i.test(String(e.serverMessage || e.message || ''));
}
export function photoError(e) {
if (isOldServer(e)) return NEED_SERVER_TEXT + '.';
const code = e && e.code;
if (code === 'NETWORK' || code === 'TIMEOUT') return 'Mạng chậm – bấm Tải lại.';
if (code === 'TOO_LARGE') return 'Ảnh quá lớn (tối đa 8 MB).';
return (e && (e.userMessage || e.message)) || 'Chưa tải được ảnh.';
}

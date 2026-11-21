import { kit, h, kids, selftestCommon } from '../_lib/kit.js';
import * as U from '../_lib/units.js';
import * as L from '../_lib/landing.js';
import { getProfile, hashParams } from '../_lib/sales.js';
const _o0 = 'bds-units-css';
function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
document.head.appendChild(h('link', { id: _o0, rel: 'stylesheet', href: new URL('./units.css', import.meta.url).href }));
}
const _o1 = ['Đông', 'Tây', 'Nam', 'Bắc', 'Đông Nam', 'Đông Bắc', 'Tây Nam', 'Tây Bắc'];
const _o1p = new Map();
let _o14 = false;
const _o2 = { erase: true };
const _o19 = (ctx) => (ctx.user && ctx.user.perms) || _o2;
const _ow = (ctx) => !ctx.user || !ctx.user.role || ctx.user.role === 'owner';
async function loadImage(file) {
if (typeof createImageBitmap === 'function') { try { return await createImageBitmap(file); } catch { } }
const url = URL.createObjectURL(file);
try {
return await new Promise((res, rej) => { const _ot = new Image(); _ot.onload = () => res(_ot); _ot.onerror = () => rej(new Error('Không đọc được ảnh')); _ot.src = url; });
} finally { setTimeout(() => URL.revokeObjectURL(url), 1000); }
}
function _og(_ou, size, quality) {
const _o6 = document.createElement('canvas'); _o6.width = size.w; _o6.height = size.h;
const _os = _o6.getContext('2d'); _os.fillStyle = '#fff'; _os.fillRect(0, 0, size.w, size.h); _os.drawImage(_ou, 0, 0, size.w, size.h);
return _o6.toDataURL(U.PHOTO.mime, quality);
}
export async function compress(file) {
if (!U.isImageFile(file)) throw Object.assign(new Error('Không phải tệp ảnh.'), { code: 'BAD_INPUT' });
const _ou = await loadImage(file);
const w = _ou.naturalWidth || _ou.width, hh = _ou.naturalHeight || _ou.height;
const size = U.fitSize(w, hh, U.PHOTO.maxSide);
if (!size) throw Object.assign(new Error('Không đọc được ảnh.'), { code: 'BAD_INPUT' });
const _oc = _og(_ou, size, U.PHOTO.quality);
const thumb = _og(_ou, U.fitSize(w, hh, U.PHOTO.thumbSide), U.PHOTO.thumbQuality);
try { _ou.close && _ou.close(); } catch { }
const b64 = _oc.split(',')[1] || '';
const bytes = U.b64Bytes(b64);
if (bytes > U.PHOTO.maxBytes) throw Object.assign(new Error('Ảnh quá lớn (tối đa 8 MB).'), { code: 'TOO_LARGE' });
return { b64, mime: U.PHOTO.mime, bytes, thumb: thumb.length <= U.LIMITS.thumb ? thumb : '', size };
}
export async function mount(_op, ctx) {
ensureCss();
const _o3 = kit(ctx);
const _o1o = { status: '', q: '' };
const _oz = h('div', { class: 'un-list', 'data-testid': 'units-list', 'aria-live': 'polite' });
const chips = h('div', { class: 'un-chips', role: 'group', 'aria-label': 'Lọc theo trạng thái' });
const q = h('input', { type: 'search', placeholder: 'Tìm mã căn, dự án…', 'aria-label': 'Tìm mã căn hoặc dự án', 'data-testid': 'units-q',
oninput: () => { _o1o.q = q.value; _o1i(); } });
const _o1j = h('div', { class: 'un', 'data-testid': 'units' },
h('h2', null, 'Lên căn'),
h('p', { class: 'un-note', 'data-testid': 'units-data-note' }, '🔒 ' + U.DATA_NOTE),
h('div', { class: 'un-bar' }, _o3.button('＋ Thêm căn', () => openUnit(ctx, null, _o1i), { kind: 'primary', testid: 'units-add' }), q),
chips, _oz);
_op.innerHTML = '';
_op.appendChild(_o1j);
async function _o1i() {
const all = await _o3.list('objects');
const counts = U.countByStatus(all);
chips.replaceChildren(...[['', 'Tất cả'], ...U.STATUSES].map(([id, label]) => h('button', {
type: 'button', class: 'un-chip' + (_o1o.status === id ? ' on' : ''), 'aria-pressed': String(_o1o.status === id), 'data-testid': 'units-st-' + (id || 'all'),
onclick: () => { _o1o.status = id; _o1i(); },
}, label + ' (' + (counts[id] || 0) + ')')));
const rows = U.filterUnits(all, _o1o);
if (!rows.length) {
_oz.replaceChildren(_o3.empty(counts[''] ? 'Không có căn nào khớp.' : 'Chưa có căn nào. Bấm "＋ Thêm căn" – không ô nào bắt buộc, nhập dần cũng được.'));
return;
}
_oz.replaceChildren(...rows.map((u) => {
const d = U.parseData(u.data);
const _o11 = (d.photos || []).length;
return h('button', { type: 'button', class: 'un-card', 'data-testid': 'unit-card', 'data-id': u.id, onclick: () => openUnit(ctx, u, _o1i) },
h('span', { class: 'un-thumb', 'aria-hidden': 'true' }, d.thumb ? h('img', { src: d.thumb, alt: '' }) : '🔑'),
h('span', { class: 'un-main' }, h('b', null, U.unitTitle(u)), h('small', null, U.unitSub(u) || 'Chưa nhập thông tin'), h('small', null, _o11 ? _o11 + ' ảnh' : 'Chưa có ảnh')),
h('span', { class: 'un-st un-st-' + u.status }, U.STATUS_LABEL[u.status] || 'Đang bán'));
}));
}
await _o1i();
_o3.on(_o1j, ['objects'], _o1i);
const _o1f = hashParams();
if (_o1f.get('open')) { const u = await _o3.get('objects', _o1f.get('open')); if (u && U.isUnit(u)) openUnit(ctx, u, _o1i); }
else if (_o1f.get('add')) openUnit(ctx, null, _o1i);
return _o1j;
}
export async function openUnit(ctx, row, refresh) {
ensureCss();
const _o3 = kit(ctx);
const me = ctx.user || {};
const _o5 = async () => me.full_name || me.username || (await _o3.me()).name || 'Chủ app';
let cur = row ? { ...row } : U.unitRow({}, { id: _o3.newId() });
let _o1m = row ? { ...row } : null;
const _ob = U.parseData(cur.data), o0 = _ob.owner || {};
let photos = U.cleanPhotos(_ob.photos);
let thumb = _ob.thumb || '';
const _ov = (name, value, attrs = {}) => h('input', { name, value: value ?? '', 'data-testid': 'units-f-' + name, ...attrs });
const _oq = {
code: _ov('code', cur.name, { maxlength: U.LIMITS.code, placeholder: 'VD: A-12.05', autocapitalize: 'characters' }),
project: _ov('project', cur.project, { maxlength: U.LIMITS.project, placeholder: 'Gõ tên dự án', list: 'units-projects' }),
floor: _ov('floor', _ob.floor, { maxlength: 20, inputmode: 'numeric' }),
facing: _ov('facing', _ob.facing, { maxlength: 40, list: 'units-facings' }),
beds: _ov('beds', _ob.beds, { inputmode: 'numeric', maxlength: 3 }),
area: _ov('area', _ob.area === '' || _ob.area == null ? '' : String(_ob.area).replace('.', ','), { inputmode: 'decimal', maxlength: 10 }),
price: _ov('price', _ob.price, { maxlength: 40, placeholder: 'VD: 3,2 tỷ' }),
status: _o3.select(U.STATUSES, cur.status || 'selling', { name: 'status', 'data-testid': 'units-f-status' }),
note: h('textarea', { name: 'note', rows: 3, maxlength: U.LIMITS.note, 'data-testid': 'units-f-note' }, cur.note || ''),
oName: _ov('owner_name', o0.name, { maxlength: U.LIMITS.name, autocomplete: 'off' }),
oPhone: _ov('owner_phone', o0.phone, { type: 'tel', inputmode: 'tel', maxlength: 20, autocomplete: 'off' }),
oNote: h('textarea', { name: 'owner_note', rows: 2, maxlength: U.LIMITS.ownerNote, 'data-testid': 'units-f-owner_note' }, o0.note || ''),
oConsent: h('input', { type: 'checkbox', checked: !!o0.consent_at, 'data-testid': 'units-owner-consent' }),
};
const projNames = new Set((await _o3.list('objects')).filter(U.isUnit).map((u) => u.project).filter(Boolean));
_o3.projects().forEach((_o18) => _o18 && _o18.name && projNames.add(_o18.name));
const lists = [h('datalist', { id: 'units-projects' }, [...projNames].slice(0, 50).map((v) => h('option', { value: v }))),
h('datalist', { id: 'units-facings' }, _o1.map((v) => h('option', { value: v })))];
const _or = () => ({
code: _oq.code.value, project: _oq.project.value, floor: _oq.floor.value, facing: _oq.facing.value, beds: _oq.beds.value, area: _oq.area.value, price: _oq.price.value,
status: _oq.status.value, note: _oq.note.value, photos, thumb,
owner: { name: _oq.oName.value, phone: _oq.oPhone.value, note: _oq.oNote.value, consent: _oq.oConsent.checked, by: me.id || '' },
});
async function _o1a({ quiet = false } = {}) {
let next = U.unitRow(_or(), cur);
const _oa = () => { try { for (const _op of body.querySelectorAll('input, textarea')) _op._v0 = _op.value; } catch { } };
_oa();
if (U.needsRename(_o1m || cur, next)) {
const _oe = U.parseData(next.data);
try {
const _o1g = await _o3.api('unit.folder_rename', { folder_id: _oe.folder_id, new_code: next.name });
_oe.folder_name = (_o1g && _o1g.folder_name) || U.folderName(next.name);
next = { ...next, data: JSON.stringify(_oe) };
} catch (e) {
if (U.isOldServer(e)) { _o14 = true; _om(); }
if (!quiet) _o3.toast('Chưa đổi được tên thư mục ảnh trên Drive – ' + U.photoError(e), 'warn');
}
}
const t = Date.now();
if (!_o1m && me.id) { next.owner = next.owner || me.id; next.created_by = next.created_by || me.id; }
cur = await _o3.put('objects', next);
_o1m = { ...cur };
_oa();
if (!quiet) _o3.toast('Đã lưu ' + U.unitTitle(cur).toLowerCase(), 'success');
_oh(); _ok();
try { refresh && refresh(); } catch { }
return t;
}
const upList = h('ul', { class: 'un-up', 'data-testid': 'units-uploads', 'aria-live': 'polite' });
const _o1b = h('div', { class: 'un-photos', 'data-testid': 'units-photos' });
const folderEl = h('p', { class: 'un-folder', 'data-testid': 'units-folder' });
const serverBox = h('div');
const queue = [];
let _o1l = false;
const album = h('input', { type: 'file', accept: 'image/*', multiple: true, hidden: true, 'data-testid': 'units-file' });
const camera = h('input', { type: 'file', accept: 'image/*', capture: 'environment', multiple: true, hidden: true, 'data-testid': 'units-camera' });
const _o15 = (input) => () => {
const files = [...(input.files || [])];
input.value = '';
for (const file of files) queue.push({ file, name: String(file.name || 'ảnh').slice(0, 80), state: 'wait', error: '' });
_ol(); _o1k();
};
album.addEventListener('change', _o15(album));
camera.addEventListener('change', _o15(camera));
function _oh() {
const d = U.parseData(cur.data);
folderEl.textContent = '📁 Ảnh lưu ở Drive của anh/chị: ' + U.ROOT_FOLDER + ' / ' + (d.folder_name || U.folderName(_oq.code.value)) + ' – mặc định riêng tư.';
}
function _om() {
serverBox.replaceChildren(...kids(_o14 ? h('div', { class: 'un-warn', role: 'alert', 'data-testid': 'units-need-server' },
h('b', null, U.NEED_SERVER_TEXT + '. '),
_ow(ctx) ? 'Vào Cài đặt › Phiên bản → "Cập nhật máy chủ". ' : 'Nhờ Chủ app cập nhật máy chủ. ',
'Trong lúc chờ: vẫn lưu thông tin căn không ảnh, hoặc dán link ảnh (https) bên dưới.',
_oy()) : null));
}
function _oy() {
const li = h('input', { type: 'url', placeholder: 'https://… (link ảnh đã chia sẻ)', 'data-testid': 'units-link-input', style: 'flex:1 1 180px;min-width:0' });
return h('div', { class: 'bds-row' }, li, _o3.button('Thêm link ảnh', async () => {
const u = String(li.value || '').trim();
if (!/^https:\/\/[^\s"'<>\\]+$/i.test(u)) { _o3.toast('Link ảnh phải bắt đầu bằng https://', 'warn'); return; }
photos = U.cleanPhotos([...photos, { url: u, public: true, link: true, name: 'Ảnh từ link' }]);
li.value = '';
_oj(); await _o1a({ quiet: true });
_o3.toast('Đã thêm link ảnh', 'success');
}, { testid: 'units-link-add' }));
}
function _ol() {
upList.replaceChildren(...queue.map((_ox, _ot) => h('li', { 'data-testid': 'units-up-' + _ot, 'data-state': _ox.state },
h('span', null, _ox.name),
h('span', { class: _ox.state === 'err' ? 'err' : _ox.state === 'ok' ? 'ok' : '' },
_ox.state === 'wait' ? '⏳ chờ' : _ox.state === 'up' ? '⬆️ đang tải…' : _ox.state === 'ok' ? '✓ đã lưu' : '⚠️ ' + _ox.error),
_ox.state === 'err' && !_o14 ? _o3.button('Tải lại', () => { _ox.state = 'wait'; _ox.error = ''; _ol(); _o1k(); }, { testid: 'units-retry-' + _ot }) : null)));
}
async function _o1k() {
if (_o1l) return;
_o1l = true;
try {
for (const _ox of queue) {
if (_ox.state !== 'wait') continue;
if (_o14) { _ox.state = 'err'; _ox.error = U.NEED_SERVER_TEXT + '.'; continue; }
_ox.state = 'up'; _ol();
try {
const _o6 = await compress(_ox.file);
const _o1g = await _o3.api('unit.photo_add', { unit_key: cur.id, unit_code: U.normCode(_oq.code.value), image: _o6.b64, mime: _o6.mime, name: _ox.name });
if (!_o1g || !_o1g.drive_id) throw new Error('Máy chủ không trả mã ảnh.');
const d = U.parseData(cur.data);
d.folder_id = _o1g.folder_id || d.folder_id; d.folder_name = _o1g.folder_name || d.folder_name;
cur = { ...cur, data: JSON.stringify(d) };
if (_o6.thumb) _o1p.set(_o1g.drive_id, _o6.thumb);
if (!thumb && _o6.thumb) thumb = _o6.thumb;
photos = U.cleanPhotos([...photos, { drive_id: _o1g.drive_id, url: _o1g.url || '', public: false, name: _ox.name }]);
_ox.state = 'ok';
_oj();
await _o1a({ quiet: true });
} catch (e) {
_ox.state = 'err'; _ox.error = U.photoError(e);
if (U.isOldServer(e)) { _o14 = true; _om(); }
}
_ol();
}
} finally { _o1l = false; _ol(); }
}
function _oj() {
_o1b.replaceChildren(...photos.map((_o18, _ot) => {
const t = _o18.drive_id && _o1p.get(_o18.drive_id) || (_ot === 0 && thumb) || '';
const pub = h('input', { type: 'checkbox', checked: !!_o18.public, 'data-testid': 'units-pub-' + _ot });
pub.addEventListener('change', async () => {
const _o1q = pub.checked;
if (_o18.drive_id) {
pub.disabled = true;
try { await _o3.api('unit.photo_share', { drive_id: _o18.drive_id, public: _o1q }); }
catch (e) { pub.checked = !_o1q; pub.disabled = false; if (U.isOldServer(e)) { _o14 = true; _om(); } _o3.toast('Chưa đổi được quyền xem ảnh – ' + U.photoError(e), 'warn'); return; }
pub.disabled = false;
}
photos = photos.map((x, j) => (j === _ot ? { ...x, public: _o1q } : x));
await _o1a({ quiet: true }); _oj();
});
const link = _o18.drive_id ? 'https://drive.google.com/file/d/' + _o18.drive_id + '/view' : _o18.url;
return h('div', { class: 'un-ph', 'data-testid': 'units-photo' },
h('span', { class: 'un-thumb' }, t ? h('img', { src: t, alt: 'Ảnh ' + (_ot + 1) }) : '🖼️'),
h('label', { title: 'Chỉ ảnh được chọn mới chuyển "ai có link xem được" để đưa lên trang' }, pub, h('span', null, 'Dùng đăng trang')),
h('div', { class: 'bds-row' },
link ? h('a', { href: link, target: '_blank', rel: 'noopener' }, 'Mở') : null,
_o3.button('Bỏ', () => _o1h(_ot), { kind: 'ghost', testid: 'units-photo-del-' + _ot })));
}));
if (!photos.length) _o1b.replaceChildren(h('p', { class: 'bds-muted' }, 'Chưa có ảnh.'));
_ok();
}
async function _o1h(_ot) {
const _o18 = photos[_ot];
if (!_o18) return;
const ok = await _o3.confirm({ title: 'Bỏ ảnh', text: _o18.drive_id ? 'Bỏ ảnh này khỏi thẻ căn và chuyển ảnh vào thùng rác Drive?' : 'Bỏ link ảnh này khỏi thẻ căn?', ok: 'Bỏ ảnh', kind: 'danger', testid: 'units-photo-del' });
if (!ok) return;
if (_o18.drive_id) {
try { await _o3.api('unit.photo_delete', { drive_id: _o18.drive_id }); }
catch (e) { if (U.isOldServer(e)) { _o14 = true; _om(); } _o3.toast('Chưa xoá được ảnh trên Drive – ' + U.photoError(e), 'warn'); return; }
}
photos = photos.filter((_, j) => j !== _ot);
if (!photos.length) thumb = '';
_oj(); await _o1a({ quiet: true });
}
const ownerErr = h('p', { class: 'un-err', role: 'alert', 'data-testid': 'units-owner-err' });
const _o17 = h('div', { 'data-testid': 'units-owner-state' });
function _oi() {
const _o12 = U.parseData(cur.data).owner || {};
_o17.replaceChildren(...kids(_o12.customer_id ? h('p', { class: 'un-ok', 'data-testid': 'units-owner-linked' }, '✓ Đã lưu vào Khách hàng (nguồn "' + U.OWNER_SOURCE_LABEL + '"). ',
h('a', { href: '#', onclick: (e) => { e.preventDefault(); _o1n.close(); _o3.afterClose(() => _o3.openProfile(_o12.customer_id)); } }, 'Mở hồ sơ')) : null));
}
async function saveOwner() {
ownerErr.textContent = '';
const _o9 = U.ownerCheck({ consent: _oq.oConsent.checked, phone: _oq.oPhone.value });
if (!_o9.ok) { ownerErr.textContent = _o9.error; return; }
await _o1a({ quiet: true });
const all = await _o3.list('objects');
const _on = U.ownerDuplicate(all, _o9.phone);
const t = Date.now(), by_name = await _o5();
const link = async (cid) => {
const d = U.parseData(cur.data); d.owner = { ...(d.owner || {}), customer_id: cid };
cur = await _o3.put('objects', { ...cur, data: JSON.stringify(d) }); _o1m = { ...cur };
_oi();
};
if (_on) {
const _o10 = _o3.modal({ title: 'Số này đã có trong Khách hàng', testid: 'units-owner-dup', body: [
h('p', null, 'Số ' + _o3.phone(_o9.phone) + ' đã có hồ sơ "' + (_on.name || 'khách') + '". App không tạo khách trùng.'),
h('p', { class: 'bds-muted' }, 'Gộp = thêm ghi chú "' + U.ownerNoteLine(cur.name, cur.project) + '" và nhãn "' + U.OWNER_TAG + '" vào hồ sơ đó; nguồn khách và đồng ý nhận tin giữ nguyên.'),
h('div', { class: 'bds-row bds-end' },
_o3.button('Huỷ', () => _o10.close(), { testid: 'units-owner-dup-cancel' }),
_o3.button('Gộp: ghi chú thêm vào hồ sơ này', async () => {
const fresh = (await _o3.get('objects', _on.id)) || _on;
await _o3.put('objects', { ...fresh, ...U.ownerMergePatch(fresh, cur, { now: t, by: me.id || '', by_name }) });
await _o3.logEvent(_on.id, 'note', U.ownerNoteLine(cur.name, cur.project) + ' – ghi chú thêm từ Lên căn');
await link(_on.id);
_o10.close();
_o3.toast('Đã ghi chú thêm vào hồ sơ ' + (_on.name || 'khách'), 'success');
}, { kind: 'primary', testid: 'units-owner-merge' }))] });
return;
}
const row = U.ownerCustomer(cur, { id: _o3.newId(), now: t, by: me.id || '', by_name });
if (me.id) { row.owner = me.id; row.created_by = me.id; }
const _o6 = await _o3.put('objects', row);
await _o3.logEvent(_o6.id, 'note', 'Tạo hồ sơ chủ căn từ Lên căn (' + U.ownerNoteLine(cur.name, cur.project) + ') – chủ nhà đồng ý lưu thông tin, không nhận tin chăm sóc/quảng cáo', { consent_at: t });
await link(_o6.id);
_o3.toast('Đã lưu chủ nhà vào Khách hàng', 'success');
}
const pubBox = h('div', { class: 'un-sec', 'data-testid': 'units-publish-box' });
function _o1e() {
try {
const all = (ctx.settings && typeof ctx.settings.all === 'function') ? ctx.settings.all() : {};
return Object.keys(all).filter((k) => k.startsWith(L.KEY_PREFIX) && all[k] && all[k].published && all[k].published.gas).length;
} catch { return null; }
}
function _ok() {
const _o1d = { data: JSON.stringify({ owner: _oq.oConsent.checked ? { consent_at: 1 } : {} }) };
const _o7 = U.canPublish(_o1d);
const _o1c = U.photoPlan(photos);
const owner = _ow(ctx);
const _o4 = _o3.button('🌐 Đăng lên trang', publish, { kind: 'primary', testid: 'units-publish' });
const _od = !!(ctx.device && typeof ctx.device.blocked === 'function' && ctx.device.blocked('landing_builder'));
_o4.disabled = !_o7.ok || !owner || _od;
pubBox.replaceChildren(...kids(
h('h3', null, 'Đăng lên trang (Ký gửi – thứ cấp)'),
h('p', { class: 'un-info', 'data-testid': 'units-limits' }, U.limitText(_o1e())),
h('p', { class: 'bds-muted', 'data-testid': 'units-plan' }, _o1c.selected
? 'Đã chọn ' + _o1c.selected + ' ảnh "Dùng đăng trang" – trang dùng ' + _o1c.used + ' ảnh (1 ảnh bìa + ' + _o1c.gallery.length + ' ảnh trong khung ảnh)' + (_o1c.dropped ? '; ' + _o1c.dropped + ' ảnh thừa không lên trang.' : '.')
: 'Chưa chọn ảnh nào "Dùng đăng trang" – trang sẽ dùng ảnh minh hoạ, anh/chị đổi trong trình tạo trang.'),
!_o7.ok ? h('p', { class: 'un-err', 'data-testid': 'units-publish-why' }, _o7.reason) : null,
!owner ? h('p', { class: 'un-err', 'data-testid': 'units-publish-why' }, 'Chỉ Chủ app tạo và xuất bản trang landing – gửi thẻ căn này cho Chủ app.') : null,
_od ? h('p', { class: 'un-err', 'data-testid': 'units-publish-desk' }, 'Trình tạo trang chỉ dùng trên máy tính – mở app trên máy tính để đăng căn này lên trang.') : null,
h('p', { class: 'bds-muted' }, 'App mở trình tạo trang với thông tin + ảnh đã chọn để anh/chị xem lại, rồi TỰ bấm xuất bản – app không tự xuất bản.'),
h('div', { class: 'bds-row' }, _o4)));
}
async function publish() {
if (!U.canPublish({ data: JSON.stringify({ owner: _oq.oConsent.checked ? { consent_at: 1 } : {} }) }).ok || !_ow(ctx)) return;
await _o1a({ quiet: true });
const d = U.parseData(cur.data);
const all = (ctx.settings && typeof ctx.settings.all === 'function') ? ctx.settings.all() : {};
let id = d.landing_id && all[L.KEY_PREFIX + d.landing_id] ? d.landing_id : '';
if (id) {
const _o13 = L.normalizeLanding(all[L.KEY_PREFIX + id]);
await _o3.setSetting(L.KEY_PREFIX + id, { ...U.fillResale(_o13, cur, { toUrl: L.imageUrl }), published: _o13.published || {}, updated_at: Date.now() });
} else {
const profile = await getProfile(ctx);
const _o8 = U.fillResale(L.newLanding({ id: 'unit_' + _o3.newId(), template: 'resale', profile }), cur, { toUrl: L.imageUrl });
id = _o8.id;
await _o3.setSetting(L.KEY_PREFIX + id, _o8);
d.landing_id = id;
cur = await _o3.put('objects', { ...cur, data: JSON.stringify(d) }); _o1m = { ...cur };
}
_o1n.close();
_o3.afterClose(() => _o3.nav('#/customers/landing_builder?id=' + encodeURIComponent(id)));
}
async function removeUnit() {
const d = U.parseData(cur.data);
const _of = async () => {
const t = Date.now();
if (_o19(ctx).erase) await _o3.put('objects', { ...cur, deleted: 1 });
else await _o3.put('objects', { ...cur, data: JSON.stringify({ ...d, archived: t }) });
_o1n.close(); try { refresh && refresh(); } catch { }
};
const _o10 = _o3.modal({ title: 'Xoá ' + U.unitTitle(cur).toLowerCase() + '?', testid: 'units-del', body: [
h('p', null, 'Xoá thẻ căn KHÔNG tự xoá ảnh trên Drive.'),
d.folder_id ? h('p', { class: 'bds-muted' }, 'Thư mục ảnh: ' + U.ROOT_FOLDER + ' / ' + (d.folder_name || '') + ' (' + photos.length + ' ảnh).') : null,
h('div', { class: 'bds-row bds-end' },
_o3.button('Huỷ', () => _o10.close(), { testid: 'units-del-cancel' }),
_o3.button('Giữ ảnh', async () => { _o10.close(); await _of(); _o3.toast('Đã xoá thẻ căn – ảnh vẫn ở Drive', 'success'); }, { testid: 'units-del-keep' }),
d.folder_id ? _o3.button('Chuyển vào thùng rác Drive', async () => {
try { await _o3.api('unit.folder_trash', { folder_id: d.folder_id }); }
catch (e) { if (U.isOldServer(e)) { _o14 = true; _om(); } _o3.toast('Chưa chuyển được ảnh vào thùng rác – ' + U.photoError(e) + ' Thẻ căn chưa xoá.', 'warn'); _o10.close(); return; }
_o10.close(); await _of(); _o3.toast('Đã xoá thẻ căn, ảnh đã vào thùng rác Drive (khôi phục được trong 30 ngày)', 'success');
}, { kind: 'danger', testid: 'units-del-trash' }) : null)].filter(Boolean) });
}
_oq.code.addEventListener('input', () => { _oh(); });
_oq.oConsent.addEventListener('change', () => _ok());
const _oo = h('small', { class: 'bds-field-h', 'data-testid': 'units-code-dup' });
_oq.code.addEventListener('blur', async () => {
const _o16 = U.sameCode(await _o3.list('objects'), _oq.code.value, cur.id);
_oo.textContent = _o16 ? 'Đã có thẻ ' + U.unitTitle(_o16).toLowerCase() + (_o16.project ? ' (' + _o16.project + ')' : '') + ' – kiểm tra lại nếu không phải căn khác.' : '';
});
const body = h('form', { class: 'un-form', onsubmit: (e) => { e.preventDefault(); _o1a(); } },
lists,
h('p', { class: 'un-note' }, 'Không ô nào bắt buộc – nhập dần cũng được. ' + U.DATA_NOTE),
h('div', { class: 'bds-grid2' }, h('div', null, _o3.field('Mã căn', _oq.code), _oo), _o3.field('Dự án', _oq.project)),
h('div', { class: 'bds-grid2' }, _o3.field('Tầng', _oq.floor), _o3.field('Hướng', _oq.facing)),
h('div', { class: 'bds-grid2' }, _o3.field('Số phòng ngủ', _oq.beds), _o3.field('Diện tích (m²)', _oq.area)),
h('div', { class: 'bds-grid2' }, _o3.field('Giá bán', _oq.price), _o3.field('Trạng thái', _oq.status)),
_o3.field('Ghi chú', _oq.note),
h('div', { class: 'un-sec' },
h('h3', null, 'Ảnh căn'),
folderEl, serverBox,
h('div', { class: 'bds-row' },
_o3.button('🖼️ Thêm ảnh', () => album.click(), { testid: 'units-add-photo', title: 'Chọn ảnh từ album (chọn nhiều được)' }),
_o3.button('📷 Chụp', () => camera.click(), { testid: 'units-take-photo', title: 'Mở máy ảnh để chụp' }),
_o14 ? null : _o3.button('🔗 Dán link ảnh', () => { serverBox.replaceChildren(h('div', { class: 'un-info' }, _oy())); }, { kind: 'ghost', testid: 'units-link' })),
h('p', { class: 'bds-muted' }, 'App nén ảnh trước khi tải (cạnh dài ≤ ' + U.PHOTO.maxSide + 'px). Ảnh riêng tư – chỉ ảnh tick "Dùng đăng trang" mới cho "ai có link xem được".'),
album, camera, upList, _o1b),
h('div', { class: 'un-sec' },
h('h3', null, 'Chủ nhà'),
h('div', { class: 'bds-grid2' }, _o3.field('Tên chủ nhà', _oq.oName), _o3.field('SĐT chủ nhà', _oq.oPhone)),
_o3.field('Ghi chú về chủ nhà', _oq.oNote),
h('label', { class: 'bds-check' }, _oq.oConsent, h('span', null, 'Chủ nhà đã đồng ý lưu thông tin (bắt buộc để lưu vào Khách hàng và đăng lên trang – theo Luật Bảo vệ dữ liệu cá nhân 2025).')),
h('p', { class: 'bds-muted' }, 'Lưu vào Khách hàng: nguồn "' + U.OWNER_SOURCE_LABEL + '", ghi chú "Chủ căn <mã căn>", chỉ ghi nhận đồng ý LƯU thông tin – không đưa vào danh sách nhắn chăm sóc hay quảng cáo.'),
ownerErr,
h('div', { class: 'bds-row' }, _o3.button('👤 Lưu chủ nhà vào Khách hàng', saveOwner, { testid: 'units-owner-save' })),
_o17),
pubBox,
h('div', { class: 'bds-row bds-end' },
_o1m ? _o3.button('Xoá căn', removeUnit, { kind: 'danger', testid: 'units-delete' }) : null,
_o3.button('Lưu', () => _o1a(), { kind: 'primary', testid: 'units-save' })));
const _o1n = _o3.sheet({ title: row ? U.unitTitle(row) : 'Thêm căn', testid: 'unit-form', body, onClose: () => { try { refresh && refresh(); } catch { } } });
_oh(); _om(); _oj(); _oi(); _ok();
return _o1n;
}
export default {
manifest: {
id: 'units', title: 'Lên căn', icon: '🔑', screen: 'sales', order: 15, version: '1.0.0', status: 'ready',
help: 'Lên căn bán thứ cấp: mỗi căn một thẻ (mã, dự án, tầng, hướng, số ngủ, m², giá, trạng thái) – không ô nào bắt buộc; ảnh chụp/chọn từ máy lưu vào Drive của anh/chị theo mã căn; lưu chủ nhà vào Khách hàng; "Đăng lên trang" điền sẵn trang Ký gửi – thứ cấp.',
},
mount,
async selftest(ctx) { return selftestCommon(ctx, [], (div) => mount(div, ctx)); },
};

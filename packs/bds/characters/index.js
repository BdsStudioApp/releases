import { kit, h } from '../_lib/kit.js';
import * as C from '../_lib/characters.js';
const TABLE = 'characters';
const _o2 = 'bds-characters';
const _o0 = { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '6px' };
export function ensureCharCss() {
if (typeof document === 'undefined' || document.getElementById('bds-char-css')) return;
const _o10 = document.createElement('link');
_o10.id = 'bds-char-css'; _o10.rel = 'stylesheet'; _o10.href = new URL('./characters.css', import.meta.url).href;
document.head.appendChild(_o10);
}
const _o1b = _o14 => String(_o14).padStart(2, '0');
const today = () => { const _og = new Date(); return _og.getFullYear() + '-' + _o1b(_og.getMonth() + 1) + '-' + _o1b(_og.getDate()); };
let _oi = null;
const _o13 = { rows: new Map(), blobs: new Map() };
function _o18() {
if (_oi) return _oi;
_oi = new Promise(res => {
try {
if (typeof indexedDB === 'undefined') return res(null);
const _o1g = indexedDB.open(_o2, 1);
_o1g.onupgradeneeded = () => { const _og = _o1g.result; if (!_og.objectStoreNames.contains('rows')) _og.createObjectStore('rows', { keyPath: 'id' }); if (!_og.objectStoreNames.contains('blobs')) _og.createObjectStore('blobs', { keyPath: 'key' }); };
_o1g.onsuccess = () => res(_o1g.result); _o1g.onerror = () => res(null); _o1g.onblocked = () => res(null);
} catch { res(null); }
});
return _oi;
}
async function _ot(store, mode, _om) {
const _oh = await _o18();
if (!_oh) { const _o1g = _om(null, _o13[store]); return _o1g && typeof _o1g === 'object' && 'result' in _o1g ? _o1g.result : _o1g; }
return new Promise((res, rej) => {
let _o1a;
try {
const _o1s = _oh.transaction(store, mode); const _o1l = _om(_o1s.objectStore(store));
_o1s.oncomplete = () => res(_o1l && 'result' in _o1l ? _o1l.result : _o1a); _o1s.onerror = () => rej(_o1s.error); _o1s.onabort = () => rej(_o1s.error);
} catch (e) { rej(e); }
});
}
const local = {
all: _o1q => _ot(_o1q, 'readonly', (os, m) => (os ? os.getAll() : { result: [...m.values()] })).then(_o1g => _o1g || []).catch(() => []),
get: (_o1q, k) => _ot(_o1q, 'readonly', (os, m) => (os ? os.get(k) : { result: m.get(k) })).catch(() => null),
put: (_o1q, v) => _ot(_o1q, 'readwrite', (os, m) => (os ? os.put(v) : (m.set(v.id || v.key, v), null))).catch(() => null),
del: (_o1q, k) => _ot(_o1q, 'readwrite', (os, m) => (os ? os.delete(k) : (m.delete(k), null))).catch(() => null),
};
const _o1v = new Map();
export function library(ctx) {
const _o1 = kit(ctx);
const store = ctx.store;
const L = {
mode: 'unknown',
async list({ includeDeleted = false } = {}) {
let remote = [];
try { remote = (await store.list(TABLE, null, { includeDeleted: true })) || []; } catch { remote = []; }
const _o12 = await local.all('rows');
if (_o12.length) await L.migrate(_o12);
const map = new Map();
for (const _o1g of [...remote, ...(await local.all('rows'))]) { const _o16 = map.get(_o1g.id); if (!_o16 || Number(_o1g.updated_at) > Number(_o16.updated_at)) map.set(_o1g.id, _o1g); }
return [...map.values()].filter(_o1g => includeDeleted || !Number(_o1g.deleted)).sort((_o3, _o4) => Number(_o4.updated_at) - Number(_o3.updated_at));
},
async get(id) { return (await L.list({ includeDeleted: true })).find(_o1g => _o1g.id === id) || null; },
async migrate(rows) {
for (const _o1g of rows) {
try { await store.put(TABLE, _o1g); await local.del('rows', _o1g.id); L.mode = 'server'; } catch { L.mode = 'local'; return; }
}
},
async save(c) {
const row = { ...C.toRow(c), id: c.id || _o1.newId() };
try { const _o1g = await store.put(TABLE, row); L.mode = 'server'; await local.del('rows', row.id); return _o1g || row; } catch {
L.mode = 'local';
const _o1e = await local.get('rows', row.id);
const _o1g = { ...row, updated_at: Math.max(Date.now(), (_o1e && Number(_o1e.updated_at) + 1) || 0) };
await local.put('rows', _o1g);
return _o1g;
}
},
async remove(id) { const c = await L.get(id); if (c) await L.save({ ...c, deleted: 1 }); },
async hasLocalRows() { return (await local.all('rows')).length > 0; },
putBlob: (key, blob) => local.put('blobs', { key, blob, at: Date.now() }),
async getBlob(key) { const _o1g = await local.get('blobs', key); return _o1g && _o1g.blob ? _o1g.blob : null; },
delBlob: key => local.del('blobs', key),
async imageUrl(_ow) {
if (!_ow) return null;
const key = _ow.local || (_ow.drive_id ? 'drive:' + _ow.drive_id : null);
if (!key) return null;
if (_o1v.has(key)) return _o1v.get(key);
let blob = await L.getBlob(key);
if (!blob && _ow.drive_id) {
try {
const _o1g = await _o1.api('characters.image', { drive_id: _ow.drive_id });
if (_o1g && _o1g.b64) { blob = _o5(_o1g.b64, _o1g.mime || 'image/jpeg'); await L.putBlob(key, blob); }
} catch { blob = null; }
}
if (!blob) return null;
const _o1t = URL.createObjectURL(blob); _o1v.set(key, _o1t); return _o1t;
},
async flush(c) {
const _ox = C.parseImages(c.images);
let uploaded = 0, waiting = 0, unsupported = false, changed = false;
for (const _ov of _ox) {
if (!_ov.pending) continue;
if (unsupported) { waiting++; continue; }
const blob = await L.getBlob(_ov.local);
if (!blob) { _ov.pending = false; changed = true; continue; }
try {
const _o1g = await _o1.api('characters.upload', { character_id: c.id, view: _ov.view, mime: blob.type || 'image/jpeg', b64: await _o8(blob) });
if (!_o1g || !_o1g.drive_id) throw Object.assign(new Error('no drive_id'), { code: 'BAD_INPUT' });
_ov.drive_id = _o1g.drive_id; _ov.url = _o1g.url || ''; delete _ov.pending; uploaded++; changed = true;
} catch (e) { waiting++; unsupported = true; L.lastError = e; }
}
if (changed) await L.save({ ...c, images: _ox });
return { uploaded, waiting, unsupported };
},
async flushAll() {
let _o1u = 0;
for (const c of await L.list()) {
if (!C.pendingImages(c).length) continue;
const _o1g = await L.flush(c); _o1u += _o1g.uploaded;
if (_o1g.unsupported) break;
}
return _o1u;
},
};
return L;
}
function _o5(b64, mime) {
const _o7 = atob(b64); const _o1t = new Uint8Array(_o7.length);
for (let _os = 0; _os < _o7.length; _os++) _o1t[_os] = _o7.charCodeAt(_os);
return new Blob([_o1t], { type: mime });
}
function _o8(blob) {
return new Promise((res, rej) => { const _o1g = new FileReader(); _o1g.onload = () => res(String(_o1g.result).split(',')[1] || ''); _o1g.onerror = () => rej(_o1g.error); _o1g.readAsDataURL(blob); });
}
export async function shrinkImage(file, max = C.MAX_IMAGE_PX) {
const url = URL.createObjectURL(file);
try {
const _ow = await new Promise((res, rej) => { const _os = new Image(); _os.onload = () => res(_os); _os.onerror = () => rej(new Error('Không đọc được ảnh ' + (file.name || ''))); _os.src = url; });
const { width, height } = C.fitSize(_ow.naturalWidth || _ow.width, _ow.naturalHeight || _ow.height, max);
const _of = document.createElement('canvas'); _of.width = width; _of.height = height;
const _oo = _of.getContext('2d'); _oo.fillStyle = '#fff'; _oo.fillRect(0, 0, width, height); _oo.drawImage(_ow, 0, 0, width, height);
let blob = null;
for (const _o1f of [0.9, 0.8, 0.7, 0.6]) {
blob = await new Promise(res => _of.toBlob(res, 'image/jpeg', _o1f));
if (blob && blob.size * 4 / 3 <= C.MAX_UPLOAD_BYTES) break;
}
if (!blob) throw new Error('Không nén được ảnh');
return { blob, width, height };
} finally { URL.revokeObjectURL(url); }
}
export function avatar(_o11, c, { small = false } = {}) {
const box = h('div', { class: 'bds-avatar' + (small ? ' bds-avatar-sm' : '') }, h('span', { class: 'bds-ini' }, C.initials(c.name)));
const _ow = C.mainImage(c);
if (_ow) _o11.imageUrl(_ow).then(_o1t => { if (_o1t) { box.innerHTML = ''; box.appendChild(h('img', { src: _o1t, alt: 'Ảnh ' + c.name, loading: 'lazy' })); } }).catch(() => {});
return box;
}
export async function mount(el, ctx) {
ensureCharCss();
const _o1 = kit(ctx);
const _oq = (label, content, help) => h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, label), content, help ? h('small', { class: 'bds-field-h' }, help) : null);
const _o11 = library(ctx);
el.innerHTML = '';
const _op = h('div', { class: 'bds-chargrid', 'data-testid': 'char-grid' });
const note = h('div');
const _o1f = (ctx.route && ctx.route.query) || new URLSearchParams();
const _on = _o1f.get && _o1f.get('from') === 'video';
async function _o1k() {
const rows = await _o11.list();
_op.innerHTML = '';
if (!rows.length) _op.appendChild(h('div', { style: { gridColumn: '1 / -1' } }, _o1.empty('Chưa có nhân vật. Chọn một gợi ý bên dưới hoặc bấm "+ Nhân vật AI".')));
for (const c of rows) {
const _o1c = C.pendingImages(c).length;
const _o14 = C.parseImages(c.images).length;
_op.appendChild(h('button', { type: 'button', class: 'bds-charcard', 'data-testid': 'char-' + c.id, 'aria-label': 'Sửa ' + c.name, onclick: () => _o19({ id: c.id }) },
avatar(_o11, c),
h('div', { class: 'bds-charmeta' },
h('strong', null, c.name),
h('div', { class: 'bds-charbadges' }, _o1.badge(c.kind === 'real' ? 'Người thật' : 'AI', c.kind === 'real' ? 'warn' : 'info'),
_o1c ? _o1.badge('chưa lên Drive', 'muted') : null, !_o14 ? _o1.badge('chưa có ảnh', 'muted') : null),
h('span', { class: 'bds-sub' }, '🎙 ' + (C.voiceLabel(c.voice) || 'chưa chọn giọng')))));
}
note.innerHTML = '';
if (_o11.mode === 'local' || await _o11.hasLocalRows()) {
note.appendChild(h('p', { class: 'bds-warn', 'data-testid': 'char-local-note' },
'Nhân vật đang lưu trên máy này (máy chủ chưa có bảng nhân vật). App tự chuyển lên máy chủ khi máy chủ cập nhật – không cần làm gì thêm.'));
}
}
async function _o19({ id, kind = 'ai', preset } = {}) {
const _o17 = id ? await _o11.get(id) : null;
const _oz = !_o17;
const _oc = _o17 ? _o17.id : _o1.newId();
kind = _o17 ? _o17.kind : kind;
const notes = C.parseJson(_o17 && _o17.notes, {});
const spec = _o17 ? C.specFromCharacter(_o17) : C.normalizeSpec(preset ? preset.spec : C.DEFAULT_SPEC);
const _o1q = { lockManual: !!notes.lock_manual, voiceManual: !!(_o17 && _o17.voice), images: C.parseImages(_o17 && _o17.images), newBlobs: new Map(), saving: false };
const name = h('input', { type: 'text', value: _o17 ? _o17.name : (preset ? preset.name : ''), placeholder: kind === 'real' ? 'vd: Nguyễn Văn A' : 'vd: Minh Khang', 'data-testid': 'c-name', maxlength: 60 });
const _o1o = (opts, v, tid) => _o1.select(Object.entries(opts).map(([k, _o16]) => [k, _o16.vi]), v, { 'data-testid': tid });
const _ok = {
gender: _o1o(C.GENDERS, spec.gender, 'c-gender'), age: _o1o(C.AGES, spec.age, 'c-age'), build: _o1o(C.BUILDS, spec.build, 'c-build'),
style: _o1o(C.STYLES, spec.style, 'c-style'), outfit: _o1o(C.OUTFITS, spec.outfit, 'c-outfit'), color: _o1o(C.COLORS, spec.color, 'c-color'),
hair: _o1o(C.HAIRS[spec.gender], spec.hair, 'c-hair'),
extra: h('input', { type: 'text', value: spec.extra, placeholder: 'Chi tiết thêm bằng tiếng Anh (tuỳ chọn): soft dimples, slight wave…', 'data-testid': 'c-extra' }),
};
const accBox = h('div', { class: 'bds-acc' }, Object.entries(C.ACCESSORIES).map(([k, _o3]) =>
h('label', null, h('input', { type: 'checkbox', value: k, checked: spec.accessories.includes(k), 'data-testid': 'c-acc-' + k }), _o3.vi)));
const lock = h('textarea', { rows: 6, class: 'bds-lock', spellcheck: false, 'data-testid': 'c-lock', value: _o17 ? _o17.lock_en : '' });
const portrait = h('pre', { class: 'bds-pre bds-promptbox', 'data-testid': 'c-portrait' });
const voice = h('select', { 'data-testid': 'c-voice' });
const _o1x = h('input', { type: 'text', placeholder: 'Mã giọng Vbee khác (tuỳ chọn)', 'data-testid': 'c-voice-custom' });
const err = h('div', { class: 'bds-error', 'data-testid': 'c-error', role: 'alert' });
const banned = h('small', { class: 'bds-error' });
const _o1h = () => C.normalizeSpec({ gender: _ok.gender.value, age: _ok.age.value, build: _ok.build.value, style: _ok.style.value, outfit: _ok.outfit.value,
color: _ok.color.value, hair: _ok.hair.value, extra: _ok.extra.value, accessories: [...accBox.querySelectorAll('input:checked')].map(_o1y => _o1y.value) });
const _ol = () => {
const _oe = _o1q.voiceManual ? (voice.value || (_o17 && _o17.voice)) : C.suggestVoice(_o1h());
voice.innerHTML = '';
const list = [...C.VBEE_VOICES];
if (_oe && !list.find(v => v.code === _oe)) list.push({ code: _oe, label: _oe + ' (mã riêng)' });
for (const v of list) voice.appendChild(h('option', { value: v.code, selected: v.code === _oe }, v.label + (v.verified === false ? ' · kiểm mã' : '')));
};
const _o1i = (force) => {
const _o1m = _o1h();
if (force || !_o1q.lockManual) { lock.value = C.buildLockEn(_o1m, { real: kind === 'real' }); if (force) _o1q.lockManual = false; }
portrait.textContent = C.buildPortraitPrompt(lock.value, { name: name.value });
const _o6 = C.findBanned(_ok.extra.value + ' ' + name.value);
banned.textContent = _o6.length ? '✗ Đã bỏ khỏi mô tả: ' + _o6.join(', ') + ' (không dùng tên người nổi tiếng/thương hiệu).' : '';
if (!_o1q.voiceManual) _ol();
};
_ok.gender.addEventListener('change', () => {
const _or = C.HAIRS[_ok.gender.value]; _ok.hair.innerHTML = '';
for (const [k, _o16] of Object.entries(_or)) _ok.hair.appendChild(h('option', { value: k }, _o16.vi));
if (_ok.gender.value === 'male' && ['dam', 'ao_dai'].includes(_ok.outfit.value)) _ok.outfit.value = 'vest';
_o1i();
});
for (const _o1y of [_ok.age, _ok.build, _ok.style, _ok.outfit, _ok.color, _ok.hair]) _o1y.addEventListener('change', () => _o1i());
_ok.extra.addEventListener('input', () => _o1i()); name.addEventListener('input', () => _o1i());
accBox.addEventListener('change', () => _o1i());
lock.addEventListener('input', () => { _o1q.lockManual = true; portrait.textContent = C.buildPortraitPrompt(lock.value, { name: name.value }); });
voice.addEventListener('change', () => { _o1q.voiceManual = true; });
if (!_o17 || !_o17.lock_en) _o1i(); else _o1i(false);
_ol();
if (_o17 && _o17.voice) voice.value = _o17.voice;
const views = h('div', { class: 'bds-views', 'data-testid': 'c-views' });
const _o1w = kind === 'real' ? ['front', 'left45', 'right45', 'half', 'full'] : ['front', 'left45', 'full', 'half'];
const _oj = () => {
views.innerHTML = '';
for (const v of _o1w) {
const _oe = _o1q.images.find(_os => _os.view === v);
const _oy = h('input', { type: 'file', accept: 'image/*', 'data-testid': 'c-img-' + v, 'aria-label': 'Ảnh ' + C.VIEWS[v] });
const drop = h('div', { class: 'bds-view-drop', 'data-testid': 'c-drop-' + v },
_oe ? null : h('span', null, '＋', h('br'), 'Kéo thả / chọn ảnh'), _oy);
const _o1r = async file => {
if (!file || !/^image\//.test(file.type || 'image/')) { _o1.toast('Chọn tệp ảnh', 'warn'); return; }
try {
const { blob } = await shrinkImage(file);
const key = _oc + ':' + v + ':' + Date.now().toString(36);
_o1q.newBlobs.set(key, blob);
_o1q.images = _o1q.images.filter(_os => _os.view !== v).concat([{ view: v, local: key, pending: true, drive_id: '', url: '' }]);
_o1v.set(key, URL.createObjectURL(blob));
_oj();
} catch (e) { _o1.toast(e.message, 'warn'); }
};
_oy.addEventListener('change', () => { _o1r(_oy.files && _oy.files[0]); _oy.value = ''; });
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('bds-over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('bds-over'));
drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('bds-over'); _o1r(e.dataTransfer.files && e.dataTransfer.files[0]); });
const _ob = h('div', { class: 'bds-view' }, drop, h('small', null, C.VIEWS[v]));
if (_oe) {
_o11.imageUrl(_oe).then(_o1t => { if (_o1t) drop.insertBefore(h('img', { src: _o1t, alt: C.VIEWS[v], 'data-testid': 'c-thumb-' + v }), _oy); });
_ob.appendChild(h('button', { type: 'button', class: 'bds-view-x', 'aria-label': 'Bỏ ảnh ' + C.VIEWS[v], onclick: () => { _o1q.images = _o1q.images.filter(_os => _os !== _oe); _oj(); } }, '✕'));
if (_oe.pending) _ob.appendChild(_o1.badge('chưa lên Drive', 'muted'));
}
views.appendChild(_ob);
}
};
_oj();
const _od = C.parseConsent(_o17 && _o17.consent) || {};
const cSelf = h('input', { type: 'checkbox', checked: !!_od.owner_is_subject, 'data-testid': 'c-consent-self' });
const cWritten = h('input', { type: 'checkbox', checked: !!_od.written_consent, 'data-testid': 'c-consent-written' });
const _o9 = h('input', { type: 'date', value: _od.signed_at || today(), max: today(), 'data-testid': 'c-consent-date' });
const _oa = h('input', { type: 'text', value: _od.note || '', placeholder: 'Số văn bản / nơi lưu bản ký (nếu là người khác)', 'data-testid': 'c-consent-note' });
cSelf.addEventListener('change', () => { if (cSelf.checked) cWritten.checked = false; });
cWritten.addEventListener('change', () => { if (cWritten.checked) cSelf.checked = false; });
const geminiBtn = _o1.button('Tạo ảnh bằng Gemini', async () => {
const p = C.buildPortraitPrompt(lock.value, { name: name.value });
await _o1.copy(p);
if (ctx.ai && typeof ctx.ai.handoff === 'function') {
try { await ctx.ai.handoff('script', p, { target: 'gemini' }); } catch { }
} else { window.open(C.GEMINI_URL, '_blank', 'noopener'); _o1.toast('Đã chép lời nhắn – dán vào Gemini', 'success'); }
}, { kind: 'primary', testid: 'c-gemini', aiBadge: 'handoff' });
const guideReal = h('div', { class: 'bds-guide' },
h('details', { open: _oz },
h('summary', null, '📸 Bước 1 – Chụp 3–5 ảnh'),
h('ol', { class: 'bds-steps' },
h('li', null, h('b', null, 'Chính diện'), ' (nhìn thẳng ống kính), ', h('b', null, 'nghiêng trái 45°'), ', ', h('b', null, 'nghiêng phải 45°'), ', ', h('b', null, 'nửa người'), ', ', h('b', null, 'toàn thân'), '.'),
h('li', null, 'Ánh sáng đều (cạnh cửa sổ ban ngày hoặc đèn trắng hai bên), nền tường trơn sáng màu.'),
h('li', null, 'Không kính râm, không mũ, tóc không che mặt; biểu cảm tự nhiên, miệng khép.'),
h('li', null, 'Điện thoại: dùng chế độ Chân dung, TẮT làm đẹp/làm mịn da, cầm ngang tầm mắt, cách 1,5–2 m.'),
h('li', null, 'Mặc đúng bộ đồ sẽ dùng trong video (mỗi bộ đồ khác nhau nên tạo nhân vật riêng).'))),
h('details', null,
h('summary', null, '🎬 Bước 2 – Dùng trong Flow'),
h('ol', { class: 'bds-steps' },
h('li', null, 'Mở Flow → dự án mới → khung 9:16 → thêm các ảnh này vào ', h('b', null, 'Ingredients'), ' (ảnh tham chiếu).'),
h('li', null, 'Giữ ĐÚNG bộ ảnh đó cho MỌI cảnh – không đổi ảnh giữa chừng.'),
h('li', null, 'Câu khoá nhân vật (lock_en) phải giống hệt ở mọi cảnh – app tự chèn khi chọn nhân vật trong Video.'),
h('li', null, 'Cùng ánh sáng, cùng trang phục ở mọi cảnh; mặt lệch thì tạo lại cảnh đó, đừng sửa câu khoá.'))));
const consentBox = h('div', { class: 'bds-consent', 'data-testid': 'c-consent' },
h('h4', null, '✍️ Xác nhận đồng ý (bắt buộc)'),
h('p', { class: 'bds-warn', style: { margin: 0 } }, '⚠ ' + C.LAW_WARNING),
h('label', { class: 'bds-check' }, cSelf, ' Đây là mặt của chính tôi'),
h('label', { class: 'bds-check' }, cWritten, ' Người này đã đồng ý bằng văn bản cho dùng hình ảnh'),
h('div', { class: 'bds-grid2' }, _o1.field('Ngày đồng ý', _o9), _o1.field('Ghi chú', _oa)),
h('small', { class: 'bds-muted' }, '📌 ' + C.AI_LABEL_REMINDER));
const save = async () => {
if (_o1q.saving) return;
err.textContent = '';
const _o1m = _o1h();
const row = {
...(_o17 || {}), id: _oc, name: name.value, kind, gender: _o1m.gender, age_range: _o1m.age, style: _o1m.style, outfit: _o1m.outfit,
lock_en: lock.value, voice: (_o1x.value.trim() || voice.value), images: _o1q.images,
consent: kind === 'real' ? { owner_is_subject: cSelf.checked, written_consent: cWritten.checked, signed_at: _o9.value, note: _oa.value.trim() } : null,
notes: JSON.stringify({ spec: _o1m, preset: preset ? preset.id : notes.preset || '', lock_manual: _o1q.lockManual }),
created_by: (_o17 && _o17.created_by) || (ctx.auth && ctx.auth.user && ctx.auth.user.id) || '',
};
const v = C.validateCharacter(row, { today: today() });
if (!v.ok) { err.textContent = v.errors.join(' '); err.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
_o1q.saving = true;
try {
for (const [key, blob] of _o1q.newBlobs) if (_o1q.images.some(_os => _os.local === key)) await _o11.putBlob(key, blob);
const _o1j = C.parseImages(_o17 && _o17.images).filter(_o16 => !_o1q.images.some(_os => (_os.local && _os.local === _o16.local) || (_os.drive_id && _os.drive_id === _o16.drive_id)));
for (const _o1g of _o1j) {
if (_o1g.local) _o11.delBlob(_o1g.local);
if (_o1g.drive_id) _o1.api('characters.delete_image', { drive_id: _o1g.drive_id }).catch(() => {});
}
const _o1n = await _o11.save(row);
_o1p.close();
const _o1u = C.pendingImages(_o1n).length ? await _o11.flush(_o1n) : { uploaded: 0, waiting: 0 };
_o1.toast(_o1u.waiting ? `Đã lưu "${_o1n.name}" – ${_o1u.waiting} ảnh chưa lên Drive, app tự đẩy lại sau` : `Đã lưu "${_o1n.name}"`, 'success');
await _o1k();
if (_on) _o1.afterClose(() => ctx.nav ? ctx.nav('content/ideas?tab=video&char=' + encodeURIComponent(_o1n.id)) : null);
} catch (e) { err.textContent = (e && e.message) || 'Chưa lưu được'; } finally { _o1q.saving = false; }
};
const del = async () => {
const ok = await _o1.confirm({ title: 'Xoá nhân vật?', text: `Xoá "${_o17.name}" khỏi thư viện (xoá mềm – khôi phục được từ máy chủ). Video đã dựng không bị ảnh hưởng.`, ok: 'Xoá', kind: 'danger', testid: 'c-del-confirm' });
if (!ok) return;
await _o11.remove(_o17.id); _o1p.close(); _o1.toast('Đã xoá nhân vật', 'success'); _o1k();
};
const body = h('div', { class: 'bds-form', 'data-testid': 'char-editor' },
kind === 'real' ? guideReal : h('p', { class: 'bds-muted' }, 'Chọn ngoại hình → app soạn câu khoá nhân vật (tiếng Anh) + lời nhắn tạo ảnh. Tạo ảnh bằng Gemini, tải về rồi thêm vào ô ảnh bên dưới.'),
_o1.field('Tên nhân vật', name, kind === 'real' ? null : 'Tên hư cấu – không dùng tên người nổi tiếng.'),
h('div', { class: 'bds-grid2' }, _o1.field('Giới tính', _ok.gender), _o1.field('Độ tuổi', _ok.age), _o1.field('Dáng người', _ok.build), _o1.field('Phong cách', _ok.style),
_o1.field('Trang phục', _ok.outfit), _o1.field('Màu chủ đạo', _ok.color, 'Hợp màu kênh: xanh than + vàng.'), _o1.field('Kiểu tóc', _ok.hair)),
_oq('Phụ kiện', accBox),
_o1.field('Chi tiết thêm', _ok.extra), banned,
_o1.field('Câu khoá nhân vật (lock_en)', lock, 'Dán nguyên văn vào mọi cảnh Flow. Sửa tay được; bấm "Sinh lại" để về bản tự động.'),
h('div', { class: 'bds-row bds-wrap' },
_o1.button('Sinh lại', () => _o1i(true), { testid: 'c-regen' }),
_o1.button('Chép câu khoá', async () => { await _o1.copy(lock.value); _o1.toast('Đã chép câu khoá', 'success'); }, { testid: 'c-copy-lock' })),
kind === 'ai' ? h('div', { class: 'bds-form' },
h('h4', { style: { margin: '4px 0 0' } }, 'Ảnh chân dung (character sheet)'),
portrait,
h('div', { class: 'bds-row bds-wrap' },
_o1.button('Chép lời nhắn ảnh', async () => { await _o1.copy(portrait.textContent); _o1.toast('Đã chép lời nhắn ảnh', 'success'); }, { testid: 'c-copy-portrait' }),
geminiBtn,
_o1.linkBtn('Mở Flow', C.FLOW_URL, null, { target: '_blank', testid: 'c-flow' })),
h('small', { class: 'bds-muted' }, 'Gemini tạo ảnh miễn phí trong gói Gemini AI Pro. Tải ảnh về máy rồi kéo thả vào ô bên dưới (app tự thu nhỏ ≤ 2048px).')) : null,
_oq('Ảnh nhân vật', views, 'Ảnh lưu vào Google Drive của chủ (thư mục "' + C.DRIVE_FOLDER + '").'),
h('div', { class: 'bds-grid2' }, _o1.field('Giọng Vbee', voice, 'Tự gợi ý theo giới tính/phong cách.'), _o1.field('Mã giọng khác', _o1x)),
kind === 'real' ? consentBox : h('small', { class: 'bds-muted' }, '📌 ' + C.AI_LABEL_REMINDER),
err,
h('div', { class: 'bds-row bds-end' },
_o17 ? _o1.button('Xoá', del, { kind: 'danger', testid: 'c-delete' }) : null,
_o1.button('Huỷ', () => _o1p.close()),
_o1.button('Lưu nhân vật', save, { kind: 'primary', testid: 'c-save' })));
const _o1p = _o1.sheet({ title: (_oz ? (kind === 'real' ? 'Nhân vật mặt thật' : 'Nhân vật AI mới') : _o17.name), body, testid: 'char-sheet' });
}
const _o1d = h('div', { class: 'bds-presets', 'data-testid': 'char-presets' }, C.PRESETS.map(p =>
h('button', { type: 'button', class: 'bds-preset', 'data-testid': 'preset-' + p.id, onclick: () => _o19({ kind: 'ai', preset: p }) },
h('strong', null, p.name), h('small', null, `${C.GENDERS[p.spec.gender].vi} · ${C.AGES[p.spec.age].vi} tuổi · ${C.STYLES[p.spec.style].vi}`), h('small', null, p.note))));
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'characters-screen' },
h('div', { class: 'bds-head' }, h('h2', null, 'Nhân vật'),
h('div', { class: 'bds-row' },
_o1.button('+ Nhân vật AI', () => _o19({ kind: 'ai' }), { kind: 'primary', testid: 'add-ai' }),
_o1.button('+ Mặt thật', () => _o19({ kind: 'real' }), { testid: 'add-real' }))),
note,
_o1.card({ title: 'Thư viện nhân vật', testid: 'card-characters', body: _op }),
_o1.card({ title: 'Gợi ý nhanh – môi giới cao cấp', testid: 'card-presets', body: h('div', { class: 'bds-form' },
h('p', { class: 'bds-muted', style: { margin: 0 } }, 'Chỉ là hồ sơ mô tả (chưa có ảnh). Bấm để mở, chỉnh rồi tạo ảnh bằng Gemini.'), _o1d) }),
_o1.card({ title: 'Cách dùng', body: h('ol', { class: 'bds-steps' },
h('li', null, 'Tạo nhân vật (AI theo gợi ý, hoặc mặt thật có xác nhận đồng ý).'),
h('li', null, 'Tạo ảnh chân dung bằng Gemini, tải về và thêm vào nhân vật.'),
h('li', null, 'Vào Video → "Nhân vật đi trong căn (Flow)" → chọn nhân vật: lời nhắn từng cảnh tự có câu khoá, giọng Vbee tự điền.'),
h('li', null, 'Trong Flow, thêm ảnh nhân vật vào Ingredients và dùng cùng bộ ảnh cho mọi cảnh.'),
h('li', null, C.AI_LABEL_REMINDER)) }),
));
await _o1k();
_o1.on(el, [TABLE], _o1k);
_o11.flushAll().then(_o14 => { if (_o14 && el.isConnected) { _o1.toast(`Đã đẩy ${_o14} ảnh lên Drive`, 'success'); _o1k(); } }).catch(() => {});
const _o15 = _o1f.get && _o1f.get('new');
const _ou = _o1f.get && _o1f.get('id');
if (_ou) _o19({ id: _ou });
else if (_o15 === 'ai' || _o15 === 'real') _o19({ kind: _o15 });
}
export default {
manifest: {
id: 'characters', title: 'Nhân vật', icon: '🧑‍💼', screen: 'content', order: 15, version: '1.0.0', status: 'ready', requires: 'video',
help: 'Thư viện nhân vật cho video Flow/Veo: nhân vật AI theo gợi ý hoặc mặt thật (có xác nhận đồng ý). Chọn nhân vật trong Video để lời nhắn từng cảnh giữ đúng một khuôn mặt.',
},
mount,
async selftest(ctx) {
const details = [];
try {
const _o3 = C.buildLockEn(C.PRESETS[0].spec); const _o4 = C.buildLockEn(C.PRESETS[0].spec);
if (_o3 !== _o4 || !/Vietnamese/.test(_o3)) details.push('Sinh lock_en sai');
if (C.findBanned(_o3).length) details.push('lock_en có từ cấm');
if (C.validateCharacter({ name: 'X', kind: 'real', lock_en: _o3 }).ok) details.push('Thiếu chặn đồng ý');
const _o1m = ctx && ctx.store;
for (const _om of ['list', 'get', 'put']) if (!_o1m || typeof _o1m[_om] !== 'function') details.push('Thiếu store.' + _om);
} catch (e) { details.push('Lỗi: ' + (e && e.message)); }
return { ok: !details.length, details: details.length ? details : ['Nhân vật: logic OK'] };
},
};

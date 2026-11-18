import { kit, h } from '../_lib/kit.js';
import * as C from '../_lib/characters.js';
const TABLE = 'characters';
const _o2 = 'bds-characters';
const _o0 = { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '6px' };
export function ensureCharCss() {
if (typeof document === 'undefined' || document.getElementById('bds-char-css')) return;
const _o11 = document.createElement('link');
_o11.id = 'bds-char-css'; _o11.rel = 'stylesheet'; _o11.href = new URL('./characters.css', import.meta.url).href;
document.head.appendChild(_o11);
}
const _o1c = _o15 => String(_o15).padStart(2, '0');
const today = () => { const _oh = new Date(); return _oh.getFullYear() + '-' + _o1c(_oh.getMonth() + 1) + '-' + _o1c(_oh.getDate()); };
let _oj = null;
const _o14 = { rows: new Map(), blobs: new Map() };
function _o19() {
if (_oj) return _oj;
_oj = new Promise(res => {
try {
if (typeof indexedDB === 'undefined') return res(null);
const _o1h = indexedDB.open(_o2, 1);
_o1h.onupgradeneeded = () => { const _oh = _o1h.result; if (!_oh.objectStoreNames.contains('rows')) _oh.createObjectStore('rows', { keyPath: 'id' }); if (!_oh.objectStoreNames.contains('blobs')) _oh.createObjectStore('blobs', { keyPath: 'key' }); };
_o1h.onsuccess = () => res(_o1h.result); _o1h.onerror = () => res(null); _o1h.onblocked = () => res(null);
} catch { res(null); }
});
return _oj;
}
async function _ou(store, mode, _on) {
const _oi = await _o19();
if (!_oi) { const _o1h = _on(null, _o14[store]); return _o1h && typeof _o1h === 'object' && 'result' in _o1h ? _o1h.result : _o1h; }
return new Promise((res, rej) => {
let _o1b;
try {
const _o1t = _oi.transaction(store, mode); const _o1m = _on(_o1t.objectStore(store));
_o1t.oncomplete = () => res(_o1m && 'result' in _o1m ? _o1m.result : _o1b); _o1t.onerror = () => rej(_o1t.error); _o1t.onabort = () => rej(_o1t.error);
} catch (e) { rej(e); }
});
}
const local = {
all: _o1r => _ou(_o1r, 'readonly', (os, m) => (os ? os.getAll() : { result: [...m.values()] })).then(_o1h => _o1h || []).catch(() => []),
get: (_o1r, k) => _ou(_o1r, 'readonly', (os, m) => (os ? os.get(k) : { result: m.get(k) })).catch(() => null),
put: (_o1r, v) => _ou(_o1r, 'readwrite', (os, m) => (os ? os.put(v) : (m.set(v.id || v.key, v), null))).catch(() => null),
del: (_o1r, k) => _ou(_o1r, 'readwrite', (os, m) => (os ? os.delete(k) : (m.delete(k), null))).catch(() => null),
};
const _o1w = new Map();
export function library(ctx) {
const _o1 = kit(ctx);
const store = ctx.store;
const L = {
mode: 'unknown',
async list({ includeDeleted = false } = {}) {
let remote = [];
try { remote = (await store.list(TABLE, null, { includeDeleted: true })) || []; } catch { remote = []; }
const _o13 = await local.all('rows');
if (_o13.length) await L.migrate(_o13);
const map = new Map();
for (const _o1h of [...remote, ...(await local.all('rows'))]) { const _o17 = map.get(_o1h.id); if (!_o17 || Number(_o1h.updated_at) > Number(_o17.updated_at)) map.set(_o1h.id, _o1h); }
return [...map.values()].filter(_o1h => includeDeleted || !Number(_o1h.deleted)).sort((_o3, _o4) => Number(_o4.updated_at) - Number(_o3.updated_at));
},
async get(id) { return (await L.list({ includeDeleted: true })).find(_o1h => _o1h.id === id) || null; },
async migrate(rows) {
for (const _o1h of rows) {
try { await store.put(TABLE, _o1h); await local.del('rows', _o1h.id); L.mode = 'server'; } catch { L.mode = 'local'; return; }
}
},
async save(c) {
const row = { ...C.toRow(c), id: c.id || _o1.newId() };
try { const _o1h = await store.put(TABLE, row); L.mode = 'server'; await local.del('rows', row.id); return _o1h || row; } catch {
L.mode = 'local';
const _o1f = await local.get('rows', row.id);
const _o1h = { ...row, updated_at: Math.max(Date.now(), (_o1f && Number(_o1f.updated_at) + 1) || 0) };
await local.put('rows', _o1h);
return _o1h;
}
},
async remove(id) { const c = await L.get(id); if (c) await L.save({ ...c, deleted: 1 }); },
async hasLocalRows() { return (await local.all('rows')).length > 0; },
putBlob: (key, blob) => local.put('blobs', { key, blob, at: Date.now() }),
async getBlob(key) { const _o1h = await local.get('blobs', key); return _o1h && _o1h.blob ? _o1h.blob : null; },
delBlob: key => local.del('blobs', key),
async imageUrl(_ox) {
if (!_ox) return null;
const key = _ox.local || (_ox.drive_id ? 'drive:' + _ox.drive_id : null);
if (!key) return null;
if (_o1w.has(key)) return _o1w.get(key);
let blob = await L.getBlob(key);
if (!blob && _ox.drive_id) {
try {
const _o1h = await _o1.api('characters.image', { drive_id: _ox.drive_id });
if (_o1h && _o1h.b64) { blob = _o5(_o1h.b64, _o1h.mime || 'image/jpeg'); await L.putBlob(key, blob); }
} catch { blob = null; }
}
if (!blob) return null;
const _o1u = URL.createObjectURL(blob); _o1w.set(key, _o1u); return _o1u;
},
async flush(c) {
const _oy = C.parseImages(c.images);
let uploaded = 0, waiting = 0, unsupported = false, changed = false;
for (const _ow of _oy) {
if (!_ow.pending) continue;
if (unsupported) { waiting++; continue; }
const blob = await L.getBlob(_ow.local);
if (!blob) { _ow.pending = false; changed = true; continue; }
try {
const _o1h = await _o1.api('characters.upload', { character_id: c.id, view: _ow.view, mime: blob.type || 'image/jpeg', b64: await _o8(blob) });
if (!_o1h || !_o1h.drive_id) throw Object.assign(new Error('no drive_id'), { code: 'BAD_INPUT' });
_ow.drive_id = _o1h.drive_id; _ow.url = _o1h.url || ''; delete _ow.pending; uploaded++; changed = true;
} catch (e) { waiting++; unsupported = true; L.lastError = e; }
}
if (changed) await L.save({ ...c, images: _oy });
return { uploaded, waiting, unsupported };
},
async flushAll() {
let _o1v = 0;
for (const c of await L.list()) {
if (!C.pendingImages(c).length) continue;
const _o1h = await L.flush(c); _o1v += _o1h.uploaded;
if (_o1h.unsupported) break;
}
return _o1v;
},
};
return L;
}
function _o5(b64, mime) {
const _o7 = atob(b64); const _o1u = new Uint8Array(_o7.length);
for (let _ot = 0; _ot < _o7.length; _ot++) _o1u[_ot] = _o7.charCodeAt(_ot);
return new Blob([_o1u], { type: mime });
}
function _o8(blob) {
return new Promise((res, rej) => { const _o1h = new FileReader(); _o1h.onload = () => res(String(_o1h.result).split(',')[1] || ''); _o1h.onerror = () => rej(_o1h.error); _o1h.readAsDataURL(blob); });
}
export async function shrinkImage(file, max = C.MAX_IMAGE_PX) {
const url = URL.createObjectURL(file);
try {
const _ox = await new Promise((res, rej) => { const _ot = new Image(); _ot.onload = () => res(_ot); _ot.onerror = () => rej(new Error('Không đọc được ảnh ' + (file.name || ''))); _ot.src = url; });
const { width, height } = C.fitSize(_ox.naturalWidth || _ox.width, _ox.naturalHeight || _ox.height, max);
const _og = document.createElement('canvas'); _og.width = width; _og.height = height;
const _op = _og.getContext('2d'); _op.fillStyle = '#fff'; _op.fillRect(0, 0, width, height); _op.drawImage(_ox, 0, 0, width, height);
let blob = null;
for (const _o1g of [0.9, 0.8, 0.7, 0.6]) {
blob = await new Promise(res => _og.toBlob(res, 'image/jpeg', _o1g));
if (blob && blob.size * 4 / 3 <= C.MAX_UPLOAD_BYTES) break;
}
if (!blob) throw new Error('Không nén được ảnh');
return { blob, width, height };
} finally { URL.revokeObjectURL(url); }
}
export function avatar(_o12, c, { small = false } = {}) {
const _o9 = h('div', { class: 'bds-avatar' + (small ? ' bds-avatar-sm' : '') }, h('span', { class: 'bds-ini' }, C.initials(c.name)));
const _ox = C.mainImage(c);
if (_ox) _o12.imageUrl(_ox).then(_o1u => { if (_o1u) { _o9.innerHTML = ''; _o9.appendChild(h('img', { src: _o1u, alt: 'Ảnh ' + c.name, loading: 'lazy' })); } }).catch(() => {});
return _o9;
}
export async function mount(el, ctx) {
ensureCharCss();
const _o1 = kit(ctx);
const _or = (label, content, help) => h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, label), content, help ? h('small', { class: 'bds-field-h' }, help) : null);
const _o12 = library(ctx);
el.innerHTML = '';
const _oq = h('div', { class: 'bds-chargrid', 'data-testid': 'char-grid' });
const note = h('div');
const _o1g = (ctx.route && ctx.route.query) || new URLSearchParams();
const _oo = _o1g.get && _o1g.get('from') === 'video';
async function _o1l() {
const rows = await _o12.list();
_oq.innerHTML = '';
if (!rows.length) _oq.appendChild(h('div', { style: { gridColumn: '1 / -1' } }, _o1.empty('Chưa có nhân vật. Chọn một gợi ý bên dưới hoặc bấm "+ Nhân vật AI".')));
for (const c of rows) {
const _o1d = C.pendingImages(c).length;
const _o15 = C.parseImages(c.images).length;
_oq.appendChild(h('button', { type: 'button', class: 'bds-charcard', 'data-testid': 'char-' + c.id, 'aria-label': 'Sửa ' + c.name, onclick: () => _o1a({ id: c.id }) },
avatar(_o12, c),
h('div', { class: 'bds-charmeta' },
h('strong', null, c.name),
h('div', { class: 'bds-charbadges' }, _o1.badge(c.kind === 'real' ? 'Người thật' : 'AI', c.kind === 'real' ? 'warn' : 'info'),
_o1d ? _o1.badge('chưa lên Drive', 'muted') : null, !_o15 ? _o1.badge('chưa có ảnh', 'muted') : null),
h('span', { class: 'bds-sub' }, '🎙 ' + (C.voiceLabel(c.voice) || 'chưa chọn giọng')))));
}
note.innerHTML = '';
if (_o12.mode === 'local' || await _o12.hasLocalRows()) {
note.appendChild(h('p', { class: 'bds-warn', 'data-testid': 'char-local-note' },
'Nhân vật đang lưu trên máy này (máy chủ chưa có bảng nhân vật). App tự chuyển lên máy chủ khi máy chủ cập nhật – không cần làm gì thêm.'));
}
}
async function _o1a({ id, kind = 'ai', preset } = {}) {
const _o18 = id ? await _o12.get(id) : null;
const _o10 = !_o18;
const _od = _o18 ? _o18.id : _o1.newId();
kind = _o18 ? _o18.kind : kind;
const notes = C.parseJson(_o18 && _o18.notes, {});
const spec = _o18 ? C.specFromCharacter(_o18) : C.normalizeSpec(preset ? preset.spec : C.DEFAULT_SPEC);
const _o1r = { lockManual: !!notes.lock_manual, voiceManual: !!(_o18 && _o18.voice), images: C.parseImages(_o18 && _o18.images), newBlobs: new Map(), saving: false };
const name = h('input', { type: 'text', value: _o18 ? _o18.name : (preset ? preset.name : ''), placeholder: kind === 'real' ? 'vd: Nguyễn Văn A' : 'vd: Minh Khang', 'data-testid': 'c-name', maxlength: 60 });
const _o1p = (opts, v, tid) => _o1.select(Object.entries(opts).map(([k, _o17]) => [k, _o17.vi]), v, { 'data-testid': tid });
const _ol = {
gender: _o1p(C.GENDERS, spec.gender, 'c-gender'), age: _o1p(C.AGES, spec.age, 'c-age'), build: _o1p(C.BUILDS, spec.build, 'c-build'),
style: _o1p(C.STYLES, spec.style, 'c-style'), outfit: _o1p(C.OUTFITS, spec.outfit, 'c-outfit'), color: _o1p(C.COLORS, spec.color, 'c-color'),
hair: _o1p(C.HAIRS[spec.gender], spec.hair, 'c-hair'),
extra: h('input', { type: 'text', value: spec.extra, placeholder: 'Chi tiết thêm bằng tiếng Anh (tuỳ chọn): soft dimples, slight wave…', 'data-testid': 'c-extra' }),
};
const accBox = h('div', { class: 'bds-acc' }, Object.entries(C.ACCESSORIES).map(([k, _o3]) =>
h('label', null, h('input', { type: 'checkbox', value: k, checked: spec.accessories.includes(k), 'data-testid': 'c-acc-' + k }), _o3.vi)));
const lock = h('textarea', { rows: 6, class: 'bds-lock', spellcheck: false, 'data-testid': 'c-lock', value: _o18 ? _o18.lock_en : '' });
const portrait = h('pre', { class: 'bds-pre bds-promptbox', 'data-testid': 'c-portrait' });
const voice = h('select', { 'data-testid': 'c-voice' });
const _o1y = h('input', { type: 'text', placeholder: 'Mã giọng Vbee khác (tuỳ chọn)', 'data-testid': 'c-voice-custom' });
const err = h('div', { class: 'bds-error', 'data-testid': 'c-error', role: 'alert' });
const banned = h('small', { class: 'bds-error' });
const _o1i = () => C.normalizeSpec({ gender: _ol.gender.value, age: _ol.age.value, build: _ol.build.value, style: _ol.style.value, outfit: _ol.outfit.value,
color: _ol.color.value, hair: _ol.hair.value, extra: _ol.extra.value, accessories: [...accBox.querySelectorAll('input:checked')].map(_o1z => _o1z.value) });
const _om = () => {
const _of = _o1r.voiceManual ? (voice.value || (_o18 && _o18.voice)) : C.suggestVoice(_o1i());
voice.innerHTML = '';
const list = [...C.VBEE_VOICES];
if (_of && !list.find(v => v.code === _of)) list.push({ code: _of, label: _of + ' (mã riêng)' });
for (const v of list) voice.appendChild(h('option', { value: v.code, selected: v.code === _of }, v.label + (v.verified === false ? ' · kiểm mã' : '')));
};
const _o1j = (force) => {
const _o1n = _o1i();
if (force || !_o1r.lockManual) { lock.value = C.buildLockEn(_o1n, { real: kind === 'real' }); if (force) _o1r.lockManual = false; }
portrait.textContent = C.buildPortraitPrompt(lock.value, { name: name.value });
const _o6 = C.findBanned(_ol.extra.value + ' ' + name.value);
banned.textContent = _o6.length ? '✗ Đã bỏ khỏi mô tả: ' + _o6.join(', ') + ' (không dùng tên người nổi tiếng/thương hiệu).' : '';
if (!_o1r.voiceManual) _om();
};
_ol.gender.addEventListener('change', () => {
const _os = C.HAIRS[_ol.gender.value]; _ol.hair.innerHTML = '';
for (const [k, _o17] of Object.entries(_os)) _ol.hair.appendChild(h('option', { value: k }, _o17.vi));
if (_ol.gender.value === 'male' && ['dam', 'ao_dai'].includes(_ol.outfit.value)) _ol.outfit.value = 'vest';
_o1j();
});
for (const _o1z of [_ol.age, _ol.build, _ol.style, _ol.outfit, _ol.color, _ol.hair]) _o1z.addEventListener('change', () => _o1j());
_ol.extra.addEventListener('input', () => _o1j()); name.addEventListener('input', () => _o1j());
accBox.addEventListener('change', () => _o1j());
lock.addEventListener('input', () => { _o1r.lockManual = true; portrait.textContent = C.buildPortraitPrompt(lock.value, { name: name.value }); });
voice.addEventListener('change', () => { _o1r.voiceManual = true; });
if (!_o18 || !_o18.lock_en) _o1j(); else _o1j(false);
_om();
if (_o18 && _o18.voice) voice.value = _o18.voice;
const views = h('div', { class: 'bds-views', 'data-testid': 'c-views' });
const _o1x = kind === 'real' ? ['front', 'left45', 'right45', 'half', 'full'] : ['front', 'left45', 'full', 'half'];
const _ok = () => {
views.innerHTML = '';
for (const v of _o1x) {
const _of = _o1r.images.find(_ot => _ot.view === v);
const _oz = h('input', { type: 'file', accept: 'image/*', 'data-testid': 'c-img-' + v, 'aria-label': 'Ảnh ' + C.VIEWS[v] });
const drop = h('div', { class: 'bds-view-drop', 'data-testid': 'c-drop-' + v },
_of ? null : h('span', null, '＋', h('br'), 'Kéo thả / chọn ảnh'), _oz);
const _o1s = async file => {
if (!file || !/^image\//.test(file.type || 'image/')) { _o1.toast('Chọn tệp ảnh', 'warn'); return; }
try {
const { blob } = await shrinkImage(file);
const key = _od + ':' + v + ':' + Date.now().toString(36);
_o1r.newBlobs.set(key, blob);
_o1r.images = _o1r.images.filter(_ot => _ot.view !== v).concat([{ view: v, local: key, pending: true, drive_id: '', url: '' }]);
_o1w.set(key, URL.createObjectURL(blob));
_ok();
} catch (e) { _o1.toast(e.message, 'warn'); }
};
_oz.addEventListener('change', () => { _o1s(_oz.files && _oz.files[0]); _oz.value = ''; });
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('bds-over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('bds-over'));
drop.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('bds-over'); _o1s(e.dataTransfer.files && e.dataTransfer.files[0]); });
const _oc = h('div', { class: 'bds-view' }, drop, h('small', null, C.VIEWS[v]));
if (_of) {
_o12.imageUrl(_of).then(_o1u => { if (_o1u) drop.insertBefore(h('img', { src: _o1u, alt: C.VIEWS[v], 'data-testid': 'c-thumb-' + v }), _oz); });
_oc.appendChild(h('button', { type: 'button', class: 'bds-view-x', 'aria-label': 'Bỏ ảnh ' + C.VIEWS[v], onclick: () => { _o1r.images = _o1r.images.filter(_ot => _ot !== _of); _ok(); } }, '✕'));
if (_of.pending) _oc.appendChild(_o1.badge('chưa lên Drive', 'muted'));
}
views.appendChild(_oc);
}
};
_ok();
const _oe = C.parseConsent(_o18 && _o18.consent) || {};
const cSelf = h('input', { type: 'checkbox', checked: !!_oe.owner_is_subject, 'data-testid': 'c-consent-self' });
const cWritten = h('input', { type: 'checkbox', checked: !!_oe.written_consent, 'data-testid': 'c-consent-written' });
const _oa = h('input', { type: 'date', value: _oe.signed_at || today(), max: today(), 'data-testid': 'c-consent-date' });
const _ob = h('input', { type: 'text', value: _oe.note || '', placeholder: 'Số văn bản / nơi lưu bản ký (nếu là người khác)', 'data-testid': 'c-consent-note' });
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
h('details', { open: _o10 },
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
h('div', { class: 'bds-grid2' }, _o1.field('Ngày đồng ý', _oa), _o1.field('Ghi chú', _ob)),
h('small', { class: 'bds-muted' }, '📌 ' + C.AI_LABEL_REMINDER));
const save = async () => {
if (_o1r.saving) return;
err.textContent = '';
const _o1n = _o1i();
const row = {
...(_o18 || {}), id: _od, name: name.value, kind, gender: _o1n.gender, age_range: _o1n.age, style: _o1n.style, outfit: _o1n.outfit,
lock_en: lock.value, voice: (_o1y.value.trim() || voice.value), images: _o1r.images,
consent: kind === 'real' ? { owner_is_subject: cSelf.checked, written_consent: cWritten.checked, signed_at: _oa.value, note: _ob.value.trim() } : null,
notes: JSON.stringify({ spec: _o1n, preset: preset ? preset.id : notes.preset || '', lock_manual: _o1r.lockManual }),
created_by: (_o18 && _o18.created_by) || (ctx.auth && ctx.auth.user && ctx.auth.user.id) || '',
};
const v = C.validateCharacter(row, { today: today() });
if (!v.ok) { err.textContent = v.errors.join(' '); err.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
_o1r.saving = true;
try {
for (const [key, blob] of _o1r.newBlobs) if (_o1r.images.some(_ot => _ot.local === key)) await _o12.putBlob(key, blob);
const _o1k = C.parseImages(_o18 && _o18.images).filter(_o17 => !_o1r.images.some(_ot => (_ot.local && _ot.local === _o17.local) || (_ot.drive_id && _ot.drive_id === _o17.drive_id)));
for (const _o1h of _o1k) {
if (_o1h.local) _o12.delBlob(_o1h.local);
if (_o1h.drive_id) _o1.api('characters.delete_image', { drive_id: _o1h.drive_id }).catch(() => {});
}
const _o1o = await _o12.save(row);
_o1q.close();
const _o1v = C.pendingImages(_o1o).length ? await _o12.flush(_o1o) : { uploaded: 0, waiting: 0 };
_o1.toast(_o1v.waiting ? `Đã lưu "${_o1o.name}" – ${_o1v.waiting} ảnh chưa lên Drive, app tự đẩy lại sau` : `Đã lưu "${_o1o.name}"`, 'success');
await _o1l();
if (_oo) _o1.afterClose(() => ctx.nav ? ctx.nav('content/video?char=' + encodeURIComponent(_o1o.id)) : null);
} catch (e) { err.textContent = (e && e.message) || 'Chưa lưu được'; } finally { _o1r.saving = false; }
};
const del = async () => {
const ok = await _o1.confirm({ title: 'Xoá nhân vật?', text: `Xoá "${_o18.name}" khỏi thư viện (xoá mềm – khôi phục được từ máy chủ). Video đã dựng không bị ảnh hưởng.`, ok: 'Xoá', kind: 'danger', testid: 'c-del-confirm' });
if (!ok) return;
await _o12.remove(_o18.id); _o1q.close(); _o1.toast('Đã xoá nhân vật', 'success'); _o1l();
};
const body = h('div', { class: 'bds-form', 'data-testid': 'char-editor' },
kind === 'real' ? guideReal : h('p', { class: 'bds-muted' }, 'Chọn ngoại hình → app soạn câu khoá nhân vật (tiếng Anh) + lời nhắn tạo ảnh. Tạo ảnh bằng Gemini, tải về rồi thêm vào ô ảnh bên dưới.'),
_o1.field('Tên nhân vật', name, kind === 'real' ? null : 'Tên hư cấu – không dùng tên người nổi tiếng.'),
h('div', { class: 'bds-grid2' }, _o1.field('Giới tính', _ol.gender), _o1.field('Độ tuổi', _ol.age), _o1.field('Dáng người', _ol.build), _o1.field('Phong cách', _ol.style),
_o1.field('Trang phục', _ol.outfit), _o1.field('Màu chủ đạo', _ol.color, 'Hợp màu kênh: xanh than + vàng.'), _o1.field('Kiểu tóc', _ol.hair)),
_or('Phụ kiện', accBox),
_o1.field('Chi tiết thêm', _ol.extra), banned,
_o1.field('Câu khoá nhân vật (lock_en)', lock, 'Dán nguyên văn vào mọi cảnh Flow. Sửa tay được; bấm "Sinh lại" để về bản tự động.'),
h('div', { class: 'bds-row bds-wrap' },
_o1.button('Sinh lại', () => _o1j(true), { testid: 'c-regen' }),
_o1.button('Chép câu khoá', async () => { await _o1.copy(lock.value); _o1.toast('Đã chép câu khoá', 'success'); }, { testid: 'c-copy-lock' })),
kind === 'ai' ? h('div', { class: 'bds-form' },
h('h4', { style: { margin: '4px 0 0' } }, 'Ảnh chân dung (character sheet)'),
portrait,
h('div', { class: 'bds-row bds-wrap' },
_o1.button('Chép lời nhắn ảnh', async () => { await _o1.copy(portrait.textContent); _o1.toast('Đã chép lời nhắn ảnh', 'success'); }, { testid: 'c-copy-portrait' }),
geminiBtn,
_o1.linkBtn('Mở Flow', C.FLOW_URL, null, { target: '_blank', testid: 'c-flow' })),
h('small', { class: 'bds-muted' }, 'Gemini tạo ảnh miễn phí trong gói Gemini AI Pro. Tải ảnh về máy rồi kéo thả vào ô bên dưới (app tự thu nhỏ ≤ 2048px).')) : null,
_or('Ảnh nhân vật', views, 'Ảnh lưu vào Google Drive của chủ (thư mục "' + C.DRIVE_FOLDER + '").'),
h('div', { class: 'bds-grid2' }, _o1.field('Giọng Vbee', voice, 'Tự gợi ý theo giới tính/phong cách.'), _o1.field('Mã giọng khác', _o1y)),
kind === 'real' ? consentBox : h('small', { class: 'bds-muted' }, '📌 ' + C.AI_LABEL_REMINDER),
err,
h('div', { class: 'bds-row bds-end' },
_o18 ? _o1.button('Xoá', del, { kind: 'danger', testid: 'c-delete' }) : null,
_o1.button('Huỷ', () => _o1q.close()),
_o1.button('Lưu nhân vật', save, { kind: 'primary', testid: 'c-save' })));
const _o1q = _o1.sheet({ title: (_o10 ? (kind === 'real' ? 'Nhân vật mặt thật' : 'Nhân vật AI mới') : _o18.name), body, testid: 'char-sheet' });
}
const _o1e = h('div', { class: 'bds-presets', 'data-testid': 'char-presets' }, C.PRESETS.map(p =>
h('button', { type: 'button', class: 'bds-preset', 'data-testid': 'preset-' + p.id, onclick: () => _o1a({ kind: 'ai', preset: p }) },
h('strong', null, p.name), h('small', null, `${C.GENDERS[p.spec.gender].vi} · ${C.AGES[p.spec.age].vi} tuổi · ${C.STYLES[p.spec.style].vi}`), h('small', null, p.note))));
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'characters-screen' },
h('div', { class: 'bds-head' }, h('h2', null, 'Nhân vật'),
h('div', { class: 'bds-row' },
_o1.button('+ Nhân vật AI', () => _o1a({ kind: 'ai' }), { kind: 'primary', testid: 'add-ai' }),
_o1.button('+ Mặt thật', () => _o1a({ kind: 'real' }), { testid: 'add-real' }))),
note,
_o1.card({ title: 'Thư viện nhân vật', testid: 'card-characters', body: _oq }),
_o1.card({ title: 'Gợi ý nhanh – môi giới cao cấp', testid: 'card-presets', body: h('div', { class: 'bds-form' },
h('p', { class: 'bds-muted', style: { margin: 0 } }, 'Chỉ là hồ sơ mô tả (chưa có ảnh). Bấm để mở, chỉnh rồi tạo ảnh bằng Gemini.'), _o1e) }),
_o1.card({ title: 'Cách dùng', body: h('ol', { class: 'bds-steps' },
h('li', null, 'Tạo nhân vật (AI theo gợi ý, hoặc mặt thật có xác nhận đồng ý).'),
h('li', null, 'Tạo ảnh chân dung bằng Gemini, tải về và thêm vào nhân vật.'),
h('li', null, 'Vào Video → "Nhân vật đi trong căn (Flow)" → chọn nhân vật: lời nhắn từng cảnh tự có câu khoá, giọng Vbee tự điền.'),
h('li', null, 'Trong Flow, thêm ảnh nhân vật vào Ingredients và dùng cùng bộ ảnh cho mọi cảnh.'),
h('li', null, C.AI_LABEL_REMINDER)) }),
));
await _o1l();
_o1.on(el, [TABLE], _o1l);
_o12.flushAll().then(_o15 => { if (_o15 && el.isConnected) { _o1.toast(`Đã đẩy ${_o15} ảnh lên Drive`, 'success'); _o1l(); } }).catch(() => {});
const _o16 = _o1g.get && _o1g.get('new');
const _ov = _o1g.get && _o1g.get('id');
if (_ov) _o1a({ id: _ov });
else if (_o16 === 'ai' || _o16 === 'real') _o1a({ kind: _o16 });
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
const _o1n = ctx && ctx.store;
for (const _on of ['list', 'get', 'put']) if (!_o1n || typeof _o1n[_on] !== 'function') details.push('Thiếu store.' + _on);
} catch (e) { details.push('Lỗi: ' + (e && e.message)); }
return { ok: !details.length, details: details.length ? details : ['Nhân vật: logic OK'] };
},
};

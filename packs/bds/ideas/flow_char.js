import { h } from '../_lib/kit.js';
import * as C from '../_lib/characters.js';
import * as F from '../_lib/video_flow.js';
import { withRules } from '../../../shared/ai_rules.js';
import { library } from '../characters/index.js';
const _og = (n) => String(n).padStart(2, '0');
const today = () => { const _o5 = new Date(); return _o5.getFullYear() + '-' + _og(_o5.getMonth() + 1) + '-' + _og(_o5.getDate()); };
const _oe = (e) => (e && (e.userMessage || e.message)) || String(e || 'Lỗi');
export function b64ToBytes(b64) {
const _o0 = atob(String(b64 || '')); const _oq = new Uint8Array(_o0.length);
for (let _oa = 0; _oa < _o0.length; _oa++) _oq[_oa] = _o0.charCodeAt(_oa);
return _oq;
}
export function fileB64(file) {
return new Promise((res, rej) => {
const r = new FileReader();
r.onload = () => res(String(r.result).split(',')[1] || '');
r.onerror = () => rej(new Error('Không đọc được tệp'));
r.readAsDataURL(file);
});
}
async function _o2(_o1) { return fileB64(_o1); }
export async function charImage(ctx, id) {
if (!id) return null;
try {
const _oc = library(ctx);
const _o3 = await _oc.get(id);
const img = _o3 && C.mainImage(_o3);
if (!img || !(await _oc.imageUrl(img))) return null;
const _o1 = await _oc.getBlob(img.local || 'drive:' + img.drive_id);
if (!_o1) return null;
return { mime: _o1.type || 'image/jpeg', b64: await _o2(_o1) };
} catch { return null; }
}
export async function mountCharStep(box, ctx, K, { value, allowFaceless = true, onChange = () => {} } = {}) {
const _oc = library(ctx);
const _op = { chars: [], preview: null, busy: false, err: '', old: false, uploadKind: 'ai' };
const spec = { gender: 'female', age: '30-35', style: 'expert', name: '' };
async function _od() { try { _op.chars = (await _oc.list()).filter((_o3) => _o3.lock_en); } catch { _op.chars = []; } }
const err = (t) => { _op.err = t; _o6(); };
async function gen() {
if (_op.busy) return;
const lock = C.buildLockEn({ ...C.DEFAULT_SPEC, gender: spec.gender, age: spec.age, style: spec.style, outfit: spec.gender === 'female' ? 'dam' : 'vest' });
_op.busy = true; _op.err = ''; _o6();
try {
const r = await K.api('ai.image', { prompt: withRules(F.buildCharImagePrompt({ lock_en: lock, name: spec.name })), aspect: '9:16' });
const url = F.imageDataUrl(r);
if (!url) throw new Error('Máy chủ chưa trả ảnh – thử lại.');
_op.preview = { mime: r.mime, b64: String(r.b64).replace(/\s+/g, ''), url, lock, note: String((r && r.note) || '').slice(0, 200) };
_op.old = false;
} catch (e) { _op.old = F.imageOldServer(e); _op.err = F.imageErrorText(e); }
_op.busy = false; _o6();
}
async function _ok({ mime, b64, lock, kind = 'ai' }) {
const id = K.newId();
const _ob = id + ':front:' + Date.now().toString(36);
const name = (spec.name || '').trim() || 'Nhân vật ảo ' + today();
const _oi = { id, name, kind, gender: spec.gender, age_range: spec.age, style: spec.style, lock_en: lock, voice: C.suggestVoice({ gender: spec.gender, style: spec.style }),
images: [{ view: 'front', local: _ob, pending: true, drive_id: '', url: '' }],
consent: kind === 'real' ? { owner_is_subject: true, written_consent: false, signed_at: today(), note: 'Tải lên từ Video AI' } : null,
notes: JSON.stringify({ spec: C.normalizeSpec({ gender: spec.gender, age: spec.age, style: spec.style }), from: 'video_ai' }),
created_by: (ctx.auth && ctx.auth.user && ctx.auth.user.id) || '' };
const _ot = C.validateCharacter(_oi, { today: today() });
if (!_ot.ok) throw new Error(_ot.errors.join(' '));
await _oc.putBlob(_ob, new Blob([b64ToBytes(b64)], { type: mime }));
const _ol = await _oc.save(_oi);
_oc.flush(_ol).catch(() => {});
return _ol;
}
async function _os(img, kind) {
try {
const _ol = await _ok({ ...img, kind });
Object.assign(value, { mode: 'char', id: _ol.id, name: _ol.name, lock_en: _ol.lock_en });
_op.preview = null; await _od();
K.toast(`Đã lưu "${_ol.name}" vào thư viện Nhân vật`, 'success');
_o6(); onChange(value, { mime: img.mime, b64: img.b64 });
} catch (e) { err('✗ ' + _oe(e)); }
}
function _o6() {
box.innerHTML = '';
const _o4 = h('div', { class: 'vf-choice', role: 'radiogroup', 'aria-label': 'Nhân vật hay không người' });
const _oh = (_ot, label, tid) => {
const r = h('input', { type: 'radio', name: 'vf-char-mode', value: _ot, checked: value.mode === _ot, 'data-testid': tid });
r.addEventListener('change', () => { value.mode = _ot; if (_ot === 'faceless') { value.id = ''; value.name = ''; value.lock_en = ''; onChange(value, null); } _o6(); });
return h('label', null, r, label);
};
if (allowFaceless) {
_o4.appendChild(_oh('faceless', 'Không người (faceless) – giọng đọc + bản đồ/ảnh', 'vf-char-faceless'));
_o4.appendChild(_oh('char', 'Có nhân vật (ảnh tĩnh ghép cạnh bản đồ/cảnh)', 'vf-char-on'));
box.appendChild(_o4);
} else value.mode = 'char';
if (value.mode !== 'char') return;
const _om = h('select', { 'data-testid': 'vf-char-lib', 'aria-label': 'Nhân vật trong thư viện' },
h('option', { value: '' }, _op.chars.length ? '— Chọn nhân vật đã có —' : 'Thư viện chưa có nhân vật – tạo mới bên dưới'),
_op.chars.map((_o3) => h('option', { value: _o3.id, selected: _o3.id === value.id }, _o3.name)));
_om.addEventListener('change', async () => {
const _o3 = _op.chars.find((x) => x.id === _om.value);
Object.assign(value, _o3 ? { mode: 'char', id: _o3.id, name: _o3.name, lock_en: _o3.lock_en } : { id: '', name: '', lock_en: '' });
_o6(); onChange(value, _o3 ? await charImage(ctx, _o3.id) : null);
});
box.appendChild(K.field('Nhân vật đã có', _om));
if (value.id) box.appendChild(h('p', { class: 'bds-ok', 'data-testid': 'vf-char-chosen' }, '✓ Dùng nhân vật: ', h('b', null, value.name)));
const _on = K.select(Object.entries(C.GENDERS).map(([k, o]) => [k, o.vi]), spec.gender, { 'data-testid': 'vf-char-gender' });
const _oj = K.select(Object.entries(C.AGES).map(([k, o]) => [k, o.vi + ' tuổi']), spec.age, { 'data-testid': 'vf-char-age' });
const _oo = K.select(Object.entries(C.STYLES).map(([k, o]) => [k, o.vi]), spec.style, { 'data-testid': 'vf-char-style' });
const _of = h('input', { type: 'text', value: spec.name, maxlength: 60, placeholder: 'vd Minh Khang (tên hư cấu)', 'data-testid': 'vf-char-name' });
_on.addEventListener('change', () => { spec.gender = _on.value; });
_oj.addEventListener('change', () => { spec.age = _oj.value; });
_oo.addEventListener('change', () => { spec.style = _oo.value; });
_of.addEventListener('input', () => { spec.name = _of.value; });
const _o9 = K.button(_op.busy ? 'Đang tạo ảnh…' : '✨ Tạo ảnh nhân vật bằng Gemini', gen, { kind: 'primary', testid: 'vf-char-gen' });
_o9.disabled = _op.busy;
const up = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', 'data-testid': 'vf-char-upload', 'aria-label': 'Tải ảnh của tôi lên' });
up.addEventListener('change', async () => {
const _o7 = up.files && up.files[0]; up.value = '';
if (!_o7) return;
if (!/^image\/(jpeg|png|webp)$/.test(_o7.type)) { err('Chọn ảnh JPG/PNG/WEBP.'); return; }
if (_o7.size > C.MAX_UPLOAD_BYTES) { err('Ảnh tối đa 8 MB.'); return; }
const real = _op.uploadKind === 'real';
const lock = C.buildLockEn({ ...C.DEFAULT_SPEC, gender: spec.gender, age: spec.age, style: spec.style, outfit: spec.gender === 'female' ? 'dam' : 'vest' }, { real });
await _os({ mime: _o7.type, b64: await fileB64(_o7), lock }, real ? 'real' : 'ai');
});
const _or = (_ot, label, tid) => { const r = h('input', { type: 'radio', name: 'vf-up-kind', value: _ot, checked: _op.uploadKind === _ot, 'data-testid': tid }); r.addEventListener('change', () => { _op.uploadKind = _ot; }); return h('label', null, r, label); };
const _o8 = h('div', { class: 'bds-stack', 'data-testid': 'vf-char-new' },
h('b', null, '＋ Tạo nhân vật mới'),
h('div', { class: 'bds-grid2' }, K.field('Giới tính', _on), K.field('Độ tuổi', _oj), K.field('Phong cách', _oo), K.field('Tên nhân vật', _of)),
h('div', { class: 'bds-row bds-wrap' }, _o9),
h('p', { class: 'vf-note' }, 'Gemini tạo ảnh qua máy chủ của anh/chị (khoá Gemini riêng, có hạn mức mỗi ngày). ' + C.LAW_WARNING));
if (_op.err) _o8.appendChild(h('p', { class: _op.old ? 'vf-warn' : 'bds-error', 'data-testid': 'vf-char-err', role: 'alert' }, _op.err));
if (_op.preview) {
_o8.appendChild(h('div', { class: 'bds-stack', 'data-testid': 'vf-char-preview-box' },
h('img', { src: _op.preview.url, alt: 'Ảnh nhân vật xem trước', class: 'vf-char-prev', 'data-testid': 'vf-char-preview' }),
_op.preview.note ? h('small', { class: 'bds-muted' }, _op.preview.note) : null,
h('div', { class: 'bds-row bds-wrap' },
K.button('↻ Tạo lại', gen, { testid: 'vf-char-regen' }),
K.button('✓ Dùng ảnh này', () => _os(_op.preview, 'ai'), { kind: 'primary', testid: 'vf-char-use' }))));
}
_o8.appendChild(h('div', { class: 'bds-stack' },
h('b', null, 'Hoặc tải ảnh của tôi lên'),
h('div', { class: 'vf-choice' }, _or('ai', 'Ảnh nhân vật AI (tạo ở nơi khác)', 'vf-up-ai'), _or('real', 'Ảnh mặt của chính tôi', 'vf-up-real')),
up, h('small', { class: 'bds-muted' }, '📌 ' + C.AI_LABEL_REMINDER)));
box.appendChild(_o8);
}
await _od();
_o6();
return { redraw: _o6 };
}

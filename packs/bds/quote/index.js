import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as crm from '../_lib/crm.js';
import * as Q from './logic.js';
import { companyDataNote } from '../_lib/company_data.js';
async function loadImage(file) {
if (typeof createImageBitmap === 'function') { try { return await createImageBitmap(file); } catch { } }
const _o10 = URL.createObjectURL(file);
try {
return await new Promise((res, rej) => { const _oe = new Image(); _oe.onload = () => res(_oe); _oe.onerror = () => rej(new Error('Không đọc được ảnh')); _oe.src = _o10; });
} finally { setTimeout(() => URL.revokeObjectURL(_o10), 1000); }
}
function _oa(_of, size, quality) {
const c = document.createElement('canvas'); c.width = size.w; c.height = size.h;
const _od = c.getContext('2d'); _od.fillStyle = '#fff'; _od.fillRect(0, 0, size.w, size.h); _od.drawImage(_of, 0, 0, size.w, size.h);
return c.toDataURL(Q.PHOTO.mime, quality);
}
const _o2 = (b64, mime) => { const _o4 = atob(b64); const _oy = new Uint8Array(_o4.length); for (let _oe = 0; _oe < _o4.length; _oe++) _oy[_oe] = _o4.charCodeAt(_oe); return new Blob([_oy], { type: mime }); };
const fileB64 = (file) => new Promise((res, rej) => { const _oo = new FileReader(); _oo.onload = () => res(String(_oo.result).split(',')[1] || ''); _oo.onerror = () => rej(new Error('Không đọc được tệp')); _oo.readAsDataURL(file); });
export async function prepare(file) {
const _o3 = Q.fileProblem(file);
if (_o3) throw Object.assign(new Error(_o3), { code: 'BAD_INPUT' });
if (Q.isPdf(file)) { const b64 = await fileB64(file); return { b64, mime: 'application/pdf', bytes: Q.b64Bytes(b64), thumb: '', name: file.name || 'phieu.pdf', blob: file }; }
const _of = await loadImage(file);
const w = _of.naturalWidth || _of.width, hh = _of.naturalHeight || _of.height;
const size = Q.fitSize(w, hh, Q.PHOTO.maxSide);
if (!size) throw Object.assign(new Error('Không đọc được ảnh.'), { code: 'BAD_INPUT' });
const _o8 = _oa(_of, size, Q.PHOTO.quality);
const thumb = _oa(_of, Q.fitSize(w, hh, Q.PHOTO.thumbSide), Q.PHOTO.thumbQuality);
try { _of.close && _of.close(); } catch { }
const b64 = _o8.split(',')[1] || '';
const bytes = Q.b64Bytes(b64);
if (bytes > Q.PHOTO.maxBytes) throw Object.assign(new Error('Ảnh quá lớn sau khi nén (tối đa 6 MB).'), { code: 'TOO_LARGE' });
return { b64, mime: Q.PHOTO.mime, bytes, thumb: thumb.length <= Q.THUMB_MAX ? thumb : '', name: (file.name || 'phieu').replace(/\.[a-z0-9]+$/i, '') + '.jpg', blob: _o2(b64, Q.PHOTO.mime) };
}
export async function mount(el, ctx) {
S.ensureSalesCss();
const _o0 = kit(ctx);
const env = await S.loadEnv(ctx);
const money = env.money;
const profile = await S.getProfile(ctx);
{ const _oy = ctx.user; if (_oy && _oy.role && _oy.role !== 'owner') { profile.name = _oy.full_name || _oy.username || profile.name; profile.phone = _oy.phone || ''; } }
const _on = S.hashParams();
let customers = (await _o0.list('objects')).filter((o) => (!o.kind || o.kind === 'customer') && !Number(o.deleted));
const _ox = { customer: _on.get('customer') || '', project: _on.get('project') || '', note: '', files: [], busy: false, last: null };
const _o6 = () => customers.find((c) => c.id === _ox.customer) || null;
if (!_ox.project) { const c = _o6(); if (c && c.project && env.project(c.project)) _ox.project = c.project; }
const project = () => (_ox.project && env.project(_ox.project)) || null;
const _ou = h('div', { class: 'sl', 'data-testid': 'quote' });
const stepCust = h('div', { class: 'sl-box sl-col', 'data-testid': 'quote-step-customer' });
const stepFiles = h('div', { class: 'sl-box sl-col', 'data-testid': 'quote-step-files' });
const stepSave = h('div', { class: 'sl-box sl-col', 'data-testid': 'quote-step-save', 'aria-live': 'polite' });
const view = h('div', { class: 'sl-col' });
const _op = h('div', { class: 'sl-col' });
el.innerHTML = '';
el.appendChild(_ou);
_ou.append(h('h2', null, 'Báo giá'), h('p', { class: 'sl-muted sl-small', 'data-testid': 'quote-intro' }, Q.TEXT.intro), view, stepCust, stepFiles, stepSave, _op);
function _oq() {
const _oj = [['', '— Chọn khách —'], ...customers.map((c) => [c.id, `${c.name || 'Khách'}${c.phone ? ' · ' + c.phone : ''}`])];
const quick = h('div', { class: 'sl-col', hidden: true, 'data-testid': 'quote-quick' });
const _oh = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'words', placeholder: 'Tên khách', 'aria-label': 'Tên khách', 'data-testid': 'quote-quick-name' });
const ph = h('input', { type: 'tel', inputmode: 'tel', autocomplete: 'off', placeholder: 'Số điện thoại', 'aria-label': 'Số điện thoại', 'data-testid': 'quote-quick-phone' });
const _o5 = companyDataNote(ctx, { cls: 'sl-muted sl-small', testid: 'quote-company-note' });
if (_o5) quick.append(_o5);
quick.append(_oh, ph, h('div', { class: 'sl-row' },
_o0.button('Thêm khách', async () => {
const name = _oh.value.trim(), phone = crm.normPhone(ph.value);
if (!name) { _o0.toast('Nhập tên khách.', 'warn'); _oh.focus(); return; }
const _ob = phone && customers.find((c) => crm.normPhone(c.phone) === phone);
if (_ob) { _ox.customer = _ob.id; _o0.toast('Số này đã có: ' + (_ob.name || 'Khách') + ' – đã chọn khách này.', 'info'); _oq(); _ot(); _os(); return; }
const t = Date.now();
const _ov = await _o0.put('objects', { id: _o0.newId(), kind: 'customer', name, phone, need: 'mua', project: _ox.project || '', source: 'manual', status: 'Mới', created_at: t, data: '', deleted: 0 });
customers = [_ov, ...customers]; _ox.customer = _ov.id;
_o0.toast('Đã thêm khách ' + name, 'ok');
_oq(); _ot(); _os();
}, { kind: 'primary', icon: 'check', testid: 'quote-quick-save' }),
_o0.button('Thôi', () => { quick.hidden = true; }, { kind: 'ghost' })));
const _om = [['', '— Không ghi dự án —'], ...env.projects.map((_ok) => [_ok.id, _ok.name])];
stepCust.replaceChildren(
h('b', null, '① Khách hàng'),
h('label', { class: 'sl-f' }, 'Chọn khách', _o0.select(_oj, _ox.customer, { 'data-testid': 'quote-customer', onchange: (e) => { _ox.customer = e.target.value; const c = _o6(); if (c && c.project && env.project(c.project) && !_ox.project) _ox.project = c.project; _oq(); _ot(); _os(); } })),
_o0.button('＋ Thêm khách nhanh', () => { quick.hidden = false; _oh.focus(); }, { kind: 'ghost', testid: 'quote-quick-open' }),
quick,
env.projects.length ? h('label', { class: 'sl-f' }, 'Dự án (tuỳ chọn)', _o0.select(_om, _ox.project, { 'data-testid': 'quote-project', onchange: (e) => { _ox.project = e.target.value; } })) : null);
}
const _ol = (capture) => h('input', { type: 'file', accept: capture ? 'image/*' : 'image/*,application/pdf', multiple: !capture, hidden: true, ...(capture ? { capture: 'environment' } : {}),
'data-testid': capture ? 'quote-camera' : 'quote-file', onchange: (e) => { _o1([...(e.target.files || [])]); e.target.value = ''; } });
const cam = _ol(true), lib = _ol(false);
async function _o1(list) {
for (const _oc of list) {
if (_ox.files.length >= Q.MAX_FILES) { _o0.toast(Q.TEXT.tooMany, 'warn'); break; }
try { _ox.files.push(await prepare(_oc)); } catch (e) { _o0.toast((e && e.message) || Q.TEXT.notImage, 'warn', 5000); }
}
_or(); _ot();
}
function _or() {
const thumbs = h('div', { class: 'sl-row', 'data-testid': 'quote-thumbs' }, _ox.files.map((_oc, _oe) => h('div', { class: 'sl-col', 'data-testid': 'quote-thumb-' + _oe },
_oc.thumb ? h('img', { src: _oc.thumb, alt: 'Ảnh phiếu ' + (_oe + 1), width: 96 }) : h('span', { class: 'sl-small' }, '📄 ' + _oc.name),
_o0.button('Bỏ', () => { _ox.files.splice(_oe, 1); _or(); _ot(); }, { kind: 'ghost', testid: 'quote-thumb-del-' + _oe }))));
stepFiles.replaceChildren(
h('b', null, '② Ảnh phiếu tính giá'),
h('div', { class: 'sl-row' },
_o0.button('📷 Chụp ảnh', () => cam.click(), { kind: 'primary', testid: 'quote-camera-btn' }),
_o0.button('🖼️ Chọn ảnh / PDF', () => lib.click(), { testid: 'quote-file-btn' })),
cam, lib,
_ox.files.length ? thumbs : h('p', { class: 'sl-muted sl-small' }, 'Chưa có tệp nào. Tối đa ' + Q.MAX_FILES + ' ảnh/PDF mỗi lần.'),
h('p', { class: 'sl-muted sl-small', 'data-testid': 'quote-no-ai' }, Q.TEXT.noAi));
}
function _ot() {
const _o11 = Q.saveProblem({ customer: _ox.customer, files: _ox.files });
const note = h('input', { type: 'text', maxlength: Q.NOTE_MAX, value: _ox.note, placeholder: 'Ghi chú (tuỳ chọn), vd căn 12.05', 'aria-label': 'Ghi chú', 'data-testid': 'quote-note', oninput: (e) => { _ox.note = e.target.value; } });
stepSave.replaceChildren(
h('b', null, '③ Lưu vào hồ sơ khách'),
note,
_o11 ? h('p', { class: 'sl-muted sl-small', 'data-testid': 'quote-why' }, _o11) : null,
h('div', { class: 'sl-row' }, _o0.button(_ox.busy ? 'Đang lưu…' : '💾 Lưu báo giá', save, { kind: 'primary', testid: 'quote-save', disabled: !!_o11 || _ox.busy })),
_ox.last ? _ow(_ox.last.blobs, _o6(), project()) : null);
}
function _ow(blobs, c, _ok) {
const share = async () => {
const files = (blobs || []).map((b, _oe) => new File([b.blob], b.name || ('phieu-' + (_oe + 1) + (b.mime === 'application/pdf' ? '.pdf' : '.jpg')), { type: b.mime }));
if (files.length && navigator.canShare && navigator.canShare({ files })) {
try { await navigator.share({ files, title: 'Phiếu tính giá', text: Q.zaloText({ customer: c, project: _ok, profile }) }); }
catch (e) { if (!(e && e.name === 'AbortError')) _o0.toast('Chưa chia sẻ được – mở Zalo rồi đính ảnh từ máy.', 'warn'); }
} else _o0.toast('Máy này chưa chia sẻ được tệp – bấm "Chép lời nhắn + mở Zalo" rồi đính ảnh.', 'info', 5000);
};
const zalo = async () => {
await _o0.copy(Q.zaloText({ customer: c, project: _ok, profile }));
const ph = c && (c.zalo || c.phone);
if (ph) window.open(_o0.zaloLink(ph), '_blank', 'noopener');
_o0.toast(ph ? 'Đã chép lời nhắn – trong Zalo dán lời nhắn và đính ảnh phiếu.' : 'Đã chép lời nhắn. Khách chưa có SĐT/Zalo.', 'ok', 5000);
if (c && c.id) _o0.logEvent(c.id, 'zalo', 'Gửi phiếu tính giá qua Zalo' + (_ok ? ': ' + _ok.name : ''));
};
return h('div', { class: 'sl-row', 'data-testid': 'quote-send' },
_o0.button('📤 Chia sẻ ảnh', share, { testid: 'quote-share' }),
_o0.button('💬 Chép lời nhắn + mở Zalo', zalo, { testid: 'quote-zalo' }));
}
async function _oz(_oc) {
try {
const _oo = await _o0.api('quote.photo_add', { customer_id: _ox.customer, project_id: _ox.project || '', mime: _oc.mime, b64: _oc.b64, name: _oc.name });
return { drive_id: _oo.drive_id, mime: _oc.mime, name: _oc.name, size: _oc.bytes, via: 'quote', thumb: _oc.thumb };
} catch (e) {
if (!Q.isMissingAction(e)) throw e;
if (_oc.mime === 'application/pdf') throw Object.assign(new Error(Q.TEXT.pdfOld), { userMessage: Q.TEXT.pdfOld });
const _oo = await _o0.api('g1.doc_upload', { project_id: 'baogia', mime: _oc.mime, b64: _oc.b64 });
return { drive_id: _oo.drive_id, mime: _oc.mime, name: _oc.name, size: _oc.bytes, via: 'g1', thumb: _oc.thumb };
}
}
async function save() {
const _o11 = Q.saveProblem({ customer: _ox.customer, files: _ox.files });
if (_o11) { _o0.toast(_o11, 'warn'); return; }
_ox.busy = true; _ot();
const _o9 = [];
try {
for (const _oc of _ox.files) _o9.push(await _oz(_oc));
} catch (e) {
_ox.busy = false; _ot();
_o0.toast((e && e.userMessage) || (e && e.message) || Q.TEXT.noDrive, 'warn', 7000);
return;
}
const c = _o6(), _ok = project();
const _ov = Q.photoRow({ id: _o0.newId(), customer: c, project: _ok, photos: _o9, note: _ox.note });
await _o0.put('quotes', _ov);
await _o0.logEvent(_ox.customer, 'quote', Q.eventText({ photos: _o9, project: _ok, note: _ox.note }), { quote_id: _ov.id, project_id: _ok ? _ok.id : '', photos: _o9.length });
_ox.last = { blobs: _ox.files.map((_oc) => ({ blob: _oc.blob, name: _oc.name, mime: _oc.mime })) };
_ox.files = []; _ox.note = ''; _ox.busy = false;
_o0.toast('Đã lưu báo giá vào hồ sơ khách', 'ok');
_or(); _ot(); _os();
}
async function _os() {
const all = (await _o0.list('quotes')).filter((q) => !Number(q.deleted) && (!_ox.customer || q.object_id === _ox.customer)).sort((a, b) => (b.created_at || 0) - (a.created_at || 0)).slice(0, 10);
if (!all.length) { _op.replaceChildren(); return; }
_op.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'quote-recent' }, h('h3', null, _ox.customer ? 'Báo giá đã gửi khách này' : 'Báo giá gần đây'),
...all.map((q) => {
const c = customers.find((x) => x.id === q.object_id);
const ph = Q.photoFromRow(q);
const _og = ph ? null : S.quoteFromRow(q);
if (!ph && !_og) return null;
const _o7 = new Date(q.created_at || q.updated_at).toLocaleDateString('vi-VN');
const label = ph ? `${_o7} · Phiếu tính giá (${ph.photos.length} tệp)${ph.project_name ? ' · ' + ph.project_name : ''}`
: `${_o7} · ${_og.project.name} ${_og.unit.type} · ${_og.plan.name} · ${money(_og.total)}`;
return h('div', { class: 'sl-row sl-sp' }, h('span', null, label + (c ? ' · ' + c.name : '')), _o0.button('Xem', () => _oi(q), { kind: 'ghost', testid: 'quote-open-' + q.id }));
})));
}
async function _oi(_ov) {
const ph = Q.photoFromRow(_ov);
const back = _o0.button('← Đóng', () => { view.replaceChildren(); }, { kind: 'ghost', testid: 'quote-close' });
if (ph) {
const box = h('div', { class: 'sl-row', 'data-testid': 'quote-saved-photos' });
view.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'quote-saved' },
h('b', null, `Phiếu tính giá ngày ${new Date(ph.created_at).toLocaleDateString('vi-VN')}${ph.project_name ? ' · ' + ph.project_name : ''}`),
ph.note ? h('p', { class: 'sl-small' }, ph.note) : null, box, back));
const blobs = [];
for (const _ok of ph.photos) {
try {
const _oo = await _o0.api(Q.getAction(_ok), { drive_id: _ok.drive_id });
const mime = _oo.mime || _ok.mime, blob = _o2(_oo.b64, mime);
blobs.push({ blob, name: _ok.name, mime });
const _o10 = URL.createObjectURL(blob);
box.appendChild(mime === 'application/pdf' ? h('a', { href: _o10, target: '_blank', rel: 'noopener', class: 'btn btn-secondary btn-sm' }, '📄 Mở ' + (_ok.name || 'PDF'))
: h('img', { src: _o10, alt: 'Phiếu tính giá', width: 320 }));
} catch (e) { box.appendChild(_ok.thumb ? h('img', { src: _ok.thumb, alt: 'Ảnh nhỏ phiếu tính giá', width: 120 }) : h('span', { class: 'sl-muted sl-small' }, 'Chưa mở được tệp trên Drive.')); }
}
if (blobs.length) view.firstChild.appendChild(_ow(blobs, customers.find((x) => x.id === ph.object_id) || null, env.project(ph.project_id) || null));
return;
}
const _og = S.quoteFromRow(_ov);
if (!_og) { _o0.toast('Báo giá này bị hỏng dữ liệu.', 'error'); return; }
view.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'quote-saved' },
h('b', null, `Báo giá ngày ${new Date(_og.created_at).toLocaleDateString('vi-VN')} – giữ nguyên ${_og.policy.label.toLowerCase()} lúc báo giá`),
h('div', { class: 'sl-kpis' },
h('div', { class: 'sl-kpi' }, h('small', null, 'Tổng giá'), h('b', { 'data-testid': 'quote-total-' + _og.plan.id }, money(_og.total))),
h('div', { class: 'sl-kpi' }, h('small', null, 'Đợt đầu'), h('b', null, money(_og.stages.first)))),
h('p', { class: 'sl-small' }, `${_og.project.name} · ${_og.unit.type} ${S.fmtNum(_og.unit.area)} m² · ${_og.plan.name}`),
h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl' },
h('thead', null, h('tr', null, h('th', null, 'Đợt'), h('th', null, 'Thời điểm'), h('th', { class: 'n' }, '%'), h('th', { class: 'n' }, 'Số tiền'))),
h('tbody', null, (_og.steps || []).map((s) => h('tr', null, h('td', null, s.name), h('td', null, s.when || ''), h('td', { class: 'n' }, S.fmtNum(s.pct) + '%'), h('td', { class: 'n' }, S.fmtVnd(s.amount))))))),
back));
}
_oq(); _or(); _ot(); _os();
if (_on.get('quote')) { const _ov = await _o0.get('quotes', _on.get('quote')); if (_ov) _oi(_ov); }
return _ou;
}
export default {
manifest: {
id: 'quote', title: 'Báo giá', icon: '🧾', screen: 'sales', order: 20, version: '1.1.0', status: 'ready',
help: 'Chọn khách, tải ảnh/PDF phiếu tính giá anh/chị đã có, lưu vào hồ sơ khách rồi gửi Zalo. App không tự tính giá, không dùng AI tính giá. Báo giá cũ vẫn mở xem được.',
},
mount,
async selftest() {
const _ov = Q.photoRow({ id: 'selftest', customer: { id: 'c1', name: 'Khách' }, photos: [{ drive_id: 'abcdefghijkl', mime: 'image/jpeg' }] });
const back = Q.photoFromRow(JSON.parse(JSON.stringify(_ov)));
if (!back || back.photos.length !== 1 || back.object_id !== 'c1') return { ok: false, details: 'Lưu/mở lại phiếu tính giá lệch' };
return { ok: true, details: 'Báo giá: lưu/mở lại phiếu tính giá đúng' };
},
};

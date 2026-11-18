import { h, kids } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as U from './upload_logic.js';
const _o0 = 180000;
const isStaff = (ctx) => { const r = ctx.user && ctx.user.role; return !r || r === 'owner' || r === 'manager'; };
export const canUpload = isStaff;
export const canSeeDocs = (ctx) => !(ctx && ctx.user && ctx.user.role === 'ctv');
async function call(ctx, action, payload) {
const _o1 = ctx.api;
if (!_o1 || typeof _o1.call !== 'function') throw new Error('Chưa kết nối máy chủ');
const r = await _o1.call(action, payload, { timeoutMs: _o0 });
return r && typeof r === 'object' && 'ok' in r && 'data' in r ? (r.ok ? r.data : Promise.reject(r.error || r)) : r;
}
const _os = (blob, how) => new Promise((_ou, rej) => { const r = new FileReader(); r.onload = () => _ou(r.result); r.onerror = () => rej(r.error || new Error('Không đọc được file')); r[how](blob); });
const _o3 = async (blob) => String(await _os(blob, 'readAsDataURL')).split(',')[1] || '';
async function _og(file, chk) {
try {
const _o6 = await createImageBitmap(file);
const _oi = Math.min(1, U.LIMITS.IMG_PX / Math.max(_o6.width, _o6.height));
const _o7 = document.createElement('canvas');
_o7.width = Math.max(1, Math.round(_o6.width * _oi)); _o7.height = Math.max(1, Math.round(_o6.height * _oi));
_o7.getContext('2d').drawImage(_o6, 0, 0, _o7.width, _o7.height);
if (_o6.close) _o6.close();
return { mime: 'image/jpeg', b64: _o7.toDataURL('image/jpeg', 0.85).split(',')[1] };
} catch {
if (chk.kind === 'heic' && chk.size <= U.LIMITS.HEIC_RAW_MAX) return { mime: 'image/heic', b64: await _o3(file) };
if (chk.kind === 'heic') throw Object.assign(new Error('Máy này chưa đọc được ảnh HEIC lớn. Trên iPhone: Cài đặt → Camera → Định dạng → "Tương thích nhất", hoặc chụp màn hình ảnh rồi gửi lại (JPG/PNG).'), { code: 'HEIC' });
if (chk.size <= U.LIMITS.AI_INLINE_MAX * 0.7) return { mime: chk.mime, b64: await _o3(file) };
throw new Error('Ảnh quá lớn để gửi AI – thu nhỏ ảnh rồi gửi lại.');
}
}
export function openUpload(ctx, opts) {
const { K } = opts;
let env = opts.env;
const project = opts.project || null;
const st = { file: null, chk: null, up: null, text: '', truncated: false, x: null, rows: [], issues: [], sus: [], busy: false, saved: false, docLinked: false };
const fileIn = h('input', { type: 'file', accept: U.ACCEPT, hidden: true, 'data-testid': 'cu-file', onchange: (e) => _oq(e.target.files && e.target.files[0]) });
const info = h('div', { class: 'sl-col', 'aria-live': 'polite' });
const _ov = h('div', { class: 'sl-col', 'data-testid': 'cu-review' });
const body = h('div', { class: 'sl', 'data-testid': 'catalog-upload' },
h('p', { class: 'sl-muted' }, project
? 'Gửi bảng giá, chính sách bán hàng, mặt bằng hoặc brochure. AI đọc rồi hiện bảng CŨ → MỚI để anh/chị tick duyệt từng dòng trước khi lưu.'
: 'Gửi file của dự án chưa có trong Bảng hàng – AI đọc tên, chủ đầu tư, vị trí, loại căn, giá, chính sách để tạo thẻ dự án mới.'),
h('p', { class: 'sl-muted sl-small' }, `Nhận: PDF, ảnh JPG/PNG/WebP/HEIC, Excel .xlsx, Word .docx, CSV – tối đa ${U.fmtSize(U.LIMITS.FILE_MAX)}. File gốc lưu vào Google Drive "BDS Studio – Tài liệu dự án". Gemini miễn phí theo hạn mức của khoá; tắt "miễn phí" thì mỗi lần đọc khoảng 0,01–0,05 USD (tính vào ngân sách AI).`),
h('div', { class: 'sl-row' }, K.button('📎 Chọn file', () => fileIn.click(), { kind: 'primary', testid: 'cu-pick' })),
fileIn, info, _ov);
const _ok = K.modal({ title: project ? '📎 Gửi file cập nhật – ' + project.name : '📎 Thêm dự án từ file', body, testid: 'catalog-upload-modal', wide: true });
const _oo = _ok.close;
_ok.close = () => { if (!project && st.up && !st.saved) call(ctx, 'catalog.doc_delete', { drive_id: st.up.drive_id }).catch(() => {}); return _oo(); };
const _o10 = (kind, text, testid) => info.replaceChildren(h('div', { class: kind === 'error' ? 'sl-bad' : kind === 'ok' ? 'sl-ok' : 'sl-muted', role: kind === 'error' ? 'alert' : null, 'data-testid': testid || 'cu-msg' }, text));
function _oq(file) {
fileIn.value = '';
if (!file || st.busy) return;
_ov.replaceChildren();
const chk = U.checkFile(file);
st.file = file; st.chk = chk; st.x = null;
if (!chk.ok) { _o10('error', chk.message, 'cu-error'); return; }
const _o2 = !(ctx.ai && typeof ctx.ai.connected === 'function') || ctx.ai.connected();
const estBox = h('p', { class: 'sl-muted sl-small', 'data-testid': 'cu-estimate' }, 'Đang ước tính chi phí AI…');
estimate(chk, estBox);
info.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'cu-picked' },
h('b', null, file.name), h('span', { class: 'sl-muted', 'data-testid': 'cu-size' }, `${chk.kind.toUpperCase()} · ${chk.sizeText}`),
_o2 ? estBox : h('p', { class: 'sl-muted' }, 'Chưa nối AI – vẫn lưu được file gốc vào Tài liệu dự án.'),
_o2 && K.aiNote ? K.aiNote('catalog_extract') : null,
h('div', { class: 'sl-row' },
K.button('🤖 Lưu file & cho AI đọc', () => _ox(true), { kind: 'primary', testid: 'cu-read', ai: 'catalog_extract' }),
project ? K.button('Chỉ lưu file vào Tài liệu dự án', () => _ox(false), { testid: 'cu-save-only' }) : null)));
}
async function estimate(chk, box) {
try {
const q = chk.group === 'text' ? { chars: Math.min(chk.size, U.LIMITS.TEXT_MAX) } : chk.kind === 'pdf'
? { pdf_pages: chk.size <= 30 * 1024 * 1024 ? Math.max(1, U.pdfPageCount(new Uint8Array(await _os(st.file, 'readAsArrayBuffer')))) : 50 } : { images: 1 };
const r = await call(ctx, 'catalog.extract', { estimate_only: true, ...q });
const e = (r && r.estimate) || {};
box.textContent = e.free ? `Chi phí AI: miễn phí (Gemini ${e.model || ''} trong hạn mức miễn phí của khoá).`
: `Chi phí AI ước tính ≈ ${S.fmtNum(e.usd || 0, 4)} USD (${e.model || 'Gemini'}; tháng này đã dùng ${S.fmtNum(e.budget_spent_usd || 0, 2)}/${S.fmtNum(e.budget_cap_usd || 0, 0)} USD).`;
if (e.enabled === false) box.textContent += ' Chưa có khoá Gemini – dán khoá ở Cài đặt › Kết nối (nhân viên: nhờ Quản trị).';
} catch (e) {
box.textContent = (e && e.code) === 'UNKNOWN_ACTION' ? 'Máy chủ chưa có chức năng đọc file – cập nhật máy chủ ở Cài đặt › Phiên bản (nhân viên: nhờ Quản trị).' : 'Gemini miễn phí theo hạn mức của khoá; vượt hạn mức thì mỗi lần đọc khoảng 0,01–0,05 USD.';
}
}
async function _o16() {
if (st.up) return st.up;
_o10('info', `Đang lưu file gốc lên Drive (${st.chk.sizeText})…`, 'cu-busy');
const r = await call(ctx, 'catalog.doc_upload', { project_id: project ? project.id : 'moi', name: st.file.name, mime: st.chk.mime, b64: await _o3(st.file) });
st.up = { ...r, name: r.name || st.file.name };
if (project) await _oj();
return st.up;
}
async function _oj() {
if (!project || !st.up || st.docLinked) return;
const _ow = env.projectRows.find((r) => String(r.id) === project.id);
const d = U.addDoc(dataOf(_ow), { ...st.up, by: _o18() });
await K.put('projects', { ...(_ow || {}), id: project.id, name: (_ow && _ow.name) || project.name, dev: (_ow && _ow.dev) || project.dev || '', data: JSON.stringify(U.fitData(d).data), deleted: 0 });
st.docLinked = true;
env = await S.loadEnv(ctx);
}
async function _ox(withAi) {
if (st.busy) return;
st.busy = true;
const chk = st.chk;
try {
let payload = null, note = '';
if (withAi) {
if (chk.group === 'text') {
_o10('info', 'Đang đọc nội dung file…', 'cu-busy');
const bytes = new Uint8Array(await _os(st.file, 'readAsArrayBuffer'));
const r = await U.readOfficeText(chk.kind, bytes, { name: st.file.name });
if (!r.text.trim()) throw new Error('File không có chữ/bảng nào để đọc.');
st.text = r.text; st.truncated = r.truncated;
if (r.truncated) note = `File dài – AI chỉ đọc ${S.fmtNum(U.LIMITS.TEXT_MAX, 0)} ký tự đầu; phần sau nên gửi file riêng.`;
payload = { text: r.text };
} else if (chk.kind === 'pdf') {
const _op = chk.size <= 30 * 1024 * 1024 ? U.pdfPageCount(new Uint8Array(await _os(st.file, 'readAsArrayBuffer'))) : 0;
const _od = U.aiFit(chk, _op);
note = _od.message;
payload = _od.ok ? { pdf: true } : null;
} else {
payload = { parts: [await _og(st.file, chk)] };
}
}
try { await _o16(); } catch (e) {
if (!withAi || !payload) throw e;
note = [note, 'Chưa lưu được file gốc lên Drive (' + ((e && e.message) || 'lỗi') + ') – vẫn cho AI đọc.'].filter(Boolean).join(' ');
}
if (!withAi) { st.saved = true; _o10('ok', `Đã lưu "${st.up.name}" vào Tài liệu dự án.`, 'cu-done'); opts.onSaved && opts.onSaved(); return; }
if (!payload) { _o10('error', note, 'cu-error'); return; }
_o10('info', 'Gemini đang đọc tài liệu…', 'cu-busy');
if (payload.pdf) payload = st.up ? { drive_id: st.up.drive_id } : { parts: [{ mime: 'application/pdf', b64: await _o3(st.file) }] };
const r = await call(ctx, 'catalog.extract', { ...payload, project_id: project ? project.id : '', file_name: st.file.name,
project: project ? { name: project.name, dev: project.dev || '', loc: project.loc || '' } : null });
st.x = U.normalizeExtraction(r.extraction || r);
st.issues = [...(r.issues || []), ...U.validateExtraction(st.x)];
st.sus = U.suspiciousText(st.text);
st.rows = U.buildRows(project, st.x, st.issues);
info.replaceChildren(note ? h('p', { class: 'sl-muted', 'data-testid': 'cu-note' }, '⚠️ ' + note) : '');
_ot(r);
} catch (e) {
const code = e && e.code;
_o10('error', code === 'UNKNOWN_ACTION' ? 'Máy chủ chưa có chức năng này – cập nhật máy chủ ở Cài đặt › Phiên bản (nhân viên: nhờ Quản trị).' : 'Chưa xong: ' + ((e && e.message) || 'lỗi') + (code === 'NETWORK' ? ' (mạng chậm hoặc file lớn – thử lại).' : ''), 'cu-error');
} finally { st.busy = false; }
}
function _ot(_ou) {
const x = st.x;
const _ol = project ? null : h('input', { class: 'sl-in', value: x.project.name || '', placeholder: 'Tên dự án', 'data-testid': 'cu-new-name', 'aria-label': 'Tên dự án mới' });
const warnBox = (x.injection || st.sus.length) ? h('div', { class: 'sl-box sl-bad', role: 'alert', 'data-testid': 'cu-injection' },
'⚠️ Tài liệu có câu giống lệnh gửi cho AI' + (st.sus.length ? ` ("${st.sus[0]}")` : '') + '. AI được dặn chỉ đọc số liệu và bỏ qua lệnh đó – anh/chị soát kỹ từng dòng trước khi lưu.') : null;
const _oe = st.issues.filter((_of) => _of.path === 'doc' || (!st.rows.some((r) => r.issues.includes(_of)) && !_of.path.startsWith('units') && !_of.path.startsWith('plans') && !_of.path.startsWith('types')));
const _o8 = st.rows.map((r) => {
const tick = h('input', { type: 'checkbox', checked: r.checked, disabled: r.blocked, 'data-testid': 'cu-tick-' + r.key, 'aria-label': 'Lưu ' + r.label, onchange: (e) => { r.checked = e.target.checked; } });
return h('div', { class: 'sl-box sl-col', 'data-testid': 'cu-row-' + r.key, style: { padding: '10px' } },
h('label', { class: 'sl-row', style: { cursor: r.blocked ? 'not-allowed' : 'pointer' } }, tick, h('b', null, r.label), r.changed ? null : h('span', { class: 'sl-muted sl-small' }, '(không đổi)')),
h('div', { class: 'sl-small sl-muted', style: { overflowWrap: 'anywhere' } }, 'CŨ: ' + r.old),
h('div', { style: { overflowWrap: 'anywhere' } }, 'MỚI: ' + r.new),
r.issues.length ? h('ul', { class: 'sl-issues' }, r.issues.map((_of) => h('li', { class: _of.level === 'error' ? 'e' : 'w' }, (_of.level === 'error' ? '⛔ ' : '⚠️ ') + _of.msg))) : null,
r.field === 'unit_prices' ? _o15(r) : null);
});
const _oz = K.button(project ? '💾 Lưu các dòng đã tick' : '💾 Tạo dự án', () => _oy(_ol), { kind: 'primary', testid: 'cu-save' });
_ov.replaceChildren(...kids(
h('h3', null, `CŨ → MỚI (${st.rows.length} dòng) – từ "${st.file.name}"`),
warnBox,
_oe.length ? h('ul', { class: 'sl-issues', 'data-testid': 'cu-issues' }, _oe.map((_of) => h('li', { class: _of.level === 'error' ? 'e' : 'w' }, (_of.level === 'error' ? '⛔ ' : '⚠️ ') + _of.msg))) : null,
_ol ? h('label', { class: 'sl-f' }, 'Tên dự án mới', _ol) : null,
st.rows.length ? h('div', { class: 'sl-col', 'data-testid': 'cu-rows' }, _o8) : K.empty('AI không tìm thấy thông tin dự án nào trong file này.'),
x.notes ? h('p', { class: 'sl-muted sl-small' }, 'Ghi chú của AI: ' + x.notes) : null,
h('p', { class: 'sl-muted sl-small' }, `Đọc bởi ${_ou.model || 'Gemini'}${_ou.cost_usd ? ` · ≈ ${S.fmtNum(_ou.cost_usd, 4)} USD` : ' · miễn phí'}. Số liệu do AI đọc – đối chiếu với file gốc trước khi báo khách.`),
h('div', { class: 'sl-row sl-end' }, K.button('Huỷ', () => _ok.close(), { kind: 'ghost', testid: 'cu-cancel' }), _oz)));
}
function _o15(r) {
const _o4 = new Map();
(r.unitIssues || []).forEach((_of) => { const _oi = Number(_of.path.split('.')[1]); if (!_o4.has(_oi) || _of.level === 'error') _o4.set(_oi, _of); });
const _o11 = r.units.slice(0, 60);
return h('details', { 'data-testid': 'cu-units' }, h('summary', null, `Xem bảng giá (${r.units.length} căn)`),
h('div', { class: 'sl-scroll table-wrap' }, h('table', { class: 'sl-tbl sl-small' },
h('thead', null, h('tr', null, h('th', null, 'Căn'), h('th', null, 'Loại'), h('th', { class: 'n' }, 'm²'), h('th', { class: 'n' }, 'Giá'), h('th', { class: 'n' }, 'tr/m²'), h('th', null, ''))),
h('tbody', null, _o11.map((_o14, _of) => { const _oh = _o4.get(_of), v = U.unitPpm(_o14); return h('tr', { 'data-testid': 'cu-unit-' + _of, title: _oh ? _oh.msg : '' },
h('td', null, _o14.code || '—'), h('td', null, _o14.type || ''), h('td', { class: 'n' }, _o14.area ? S.fmtNum(_o14.area) : ''), h('td', { class: 'n' }, _o14.price ? S.fmtMoney(_o14.price) : ''),
h('td', { class: 'n' }, v ? S.fmtNum(v, 1) : ''), h('td', null, _oh ? (_oh.level === 'error' ? '⛔' : '⚠️') : '')); })))),
r.units.length > _o11.length ? h('p', { class: 'sl-muted sl-small' }, `… và ${r.units.length - _o11.length} căn nữa.`) : null);
}
function dataOf(_ow) { try { const d = _ow && _ow.data ? (typeof _ow.data === 'string' ? JSON.parse(_ow.data) : _ow.data) : {}; return d && typeof d === 'object' ? d : {}; } catch { return {}; } }
function _o18() { const _o14 = ctx.user || {}; return _o14.full_name || _o14.username || _o14.id || ''; }
async function _oy(_ol) {
if (st.busy) return;
const now = Date.now();
let _or = project ? project.id : '', _ow = project ? env.projectRows.find((r) => String(r.id) === _or) : null;
const name = project ? project.name : String(_ol.value || '').trim();
if (!project && !name) { K.toast('Nhập tên dự án.', 'warn'); _ol.focus(); return; }
if (!project) {
_or = U.newProjectId(name, [...env.projects.map((p) => p.id), ...env.projectRows.map((r) => r.id)]);
const _om = st.rows.find((r) => r.field === 'name'); if (_om) { _om.value = name; _om.checked = true; }
}
if (!st.rows.some((r) => r.checked && !r.blocked) && project) { K.toast('Chưa tick dòng nào – file gốc đã nằm trong Tài liệu dự án.', 'info'); _ok.close(); return; }
st.busy = true;
try {
const file = st.up ? { name: st.up.name, drive_id: st.up.drive_id } : { name: st.file.name, drive_id: '' };
const _ou = U.applyRows(dataOf(_ow), st.rows, { file, at: now, user: _o18() });
let data = _ou.data;
if (st.up) data = U.addDoc(data, { ...st.up, by: _o18() });
const _od = U.fitData(data);
data = _od.data;
const _oa = st.rows.find((r) => r.field === 'dev' && r.checked);
await K.put('projects', { ...(_ow || {}), id: _or, name: project ? ((_ow && _ow.name) || project.name) : name,
dev: _oa ? _oa.value : (_ow && _ow.dev) || (project && project.dev) || '', data: JSON.stringify(data), deleted: 0 });
let _ob = null;
if (_ou.plans && _ou.plans.length) {
const _o13 = S.todayISO();
_ob = await K.put('policies', { project_id: _or, month: _o13.slice(0, 7), effective_from: _o13, status: 'draft', source: 'ai',
plans: JSON.stringify(S.toStorePlans(_ou.plans)), note: ('Từ file ' + file.name).slice(0, 200), approved_at: 0 });
}
try { await K.put('audit', { at: now, action: 'catalog.file_update', object_id: _or, detail: JSON.stringify({ file: file.name, drive_id: file.drive_id, fields: _ou.saved, policy_draft: _ob ? _ob.id : '' }) }); } catch { }
st.saved = true;
const _oc = [_od.trimmed ? `bảng giá quá dài – bỏ ${_od.trimmed} căn cuối (file gốc vẫn đủ)` : '', _ou.dropped ? `bỏ ${_ou.dropped} căn có số sai` : ''].filter(Boolean).join('; ');
_ov.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'cu-done' },
h('p', { class: 'sl-ok' }, project ? `Đã cập nhật ${_ou.saved.filter((f) => f !== 'plans').length} mục cho ${name}.` : `Đã tạo dự án ${name}.`),
_oc ? h('p', { class: 'sl-muted' }, '⚠️ ' + _oc) : null,
_ob ? h('p', null, 'Chính sách thanh toán đã lưu NHÁP – chưa áp dụng. Mở để soát và Duyệt.') : null,
h('div', { class: 'sl-row sl-end' },
_ob ? K.button('📝 Mở bản nháp chính sách', () => { _ok.close(); K.nav('#/sales/policy?draft=' + encodeURIComponent(_ob.id)); }, { testid: 'cu-open-draft' }) : null,
K.button('Xong', () => _ok.close(), { kind: 'primary', testid: 'cu-close' }))));
info.replaceChildren();
K.toast(project ? 'Đã lưu thông tin từ file' : 'Đã tạo dự án từ file', 'ok');
opts.onSaved && opts.onSaved(_or);
} catch (e) {
K.toast('Chưa lưu được: ' + ((e && e.message) || 'lỗi'), 'error');
} finally { st.busy = false; }
}
return _ok;
}
export function docsBlock(ctx, K, p) {
if (!canSeeDocs(ctx)) return null;
const docs = Array.isArray(p.docs) ? p.docs : [];
const _o12 = p.sources && typeof p.sources === 'object' ? Object.entries(p.sources).filter(([, v]) => v && v.by === 'file') : [];
if (!docs.length && !_o12.length) return null;
async function _on(d) {
try {
K.toast('Đang mở ' + d.name + '…', 'info');
const r = await call(ctx, 'catalog.doc_get', { drive_id: d.drive_id });
const _o5 = atob(r.b64), _o14 = new Uint8Array(_o5.length);
for (let _of = 0; _of < _o5.length; _of++) _o14[_of] = _o5.charCodeAt(_of);
const _o17 = URL.createObjectURL(new Blob([_o14], { type: r.mime || d.mime || 'application/octet-stream' }));
const _o1 = h('a', { href: _o17, download: d.name, target: '_blank', rel: 'noopener' });
document.body.appendChild(_o1); _o1.click(); _o1.remove();
setTimeout(() => URL.revokeObjectURL(_o17), 60000);
} catch (e) { K.toast('Chưa mở được file: ' + ((e && e.message) || 'lỗi'), 'error'); }
}
const _o9 = (t) => (t ? new Date(t).toLocaleDateString('vi-VN') : '');
return h('div', { class: 'sl-col', 'data-testid': 'project-docs' },
h('h3', null, `Tài liệu dự án (${docs.length})`),
docs.length ? h('div', { class: 'sl-col' }, docs.map((d, _of) => h('div', { class: 'sl-row sl-sp', 'data-testid': 'project-doc-' + _of },
h('span', { style: { overflowWrap: 'anywhere', minWidth: 0, flex: '1 1 160px' } }, '📄 ' + d.name, h('span', { class: 'sl-muted sl-small' }, ` · ${U.fmtSize(d.size)} · ${_o9(d.at)}${d.by ? ' · ' + d.by : ''}`)),
K.button('Mở', () => _on(d), { kind: 'ghost', testid: 'project-doc-open-' + _of })))) : null,
_o12.length ? h('p', { class: 'sl-muted sl-small', 'data-testid': 'project-sources' }, 'Cập nhật từ file: ' + _o12.map(([_oi, v]) => `${U.FIELD_LABEL[_oi] || _oi} (${U.sourceText(v)})`).join('; ')) : null);
}

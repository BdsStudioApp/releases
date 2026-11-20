import { h } from '../_lib/kit.js';
import * as IL from '../_lib/import_logic.js';
import * as CS from '../_lib/consent.js';
const ACCEPT = '.xlsx,.xlsm,.csv,.tsv,.txt,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv';
const _o0 = 15 * 1024 * 1024;
export function canImport(ctx) { return !ctx.user || ctx.user.role !== 'ctv'; }
const _o2 = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
function download(name, text, type = 'text/csv;charset=utf-8') {
const _o5 = new Blob([text], { type });
const _o3 = h('a', { href: URL.createObjectURL(_o5), download: name });
document.body.appendChild(_o3); _o3.click(); _o3.remove(); setTimeout(() => URL.revokeObjectURL(_o3.href), 4000);
}
export async function openImport(ctx, K) {
const P = (ctx.user && ctx.user.perms) || { assign: true };
const _o6 = !!(P.assign && ctx.users && typeof ctx.users.pick === 'function' && ctx.user && !ctx.user.legacy && !ctx.solo);
const body = h('div', { class: 'bds-form', 'data-testid': 'import-box' });
const _ot = K.sheet({ title: '📥 Nhập khách từ Excel/CSV', body, testid: 'import-sheet' });
const st = { file: '', sheets: [], sheet: 0, prep: null, mapping: {}, mode: 'skip', owner: null, plan: null, busy: false };
const _od = h('input', { type: 'file', accept: ACCEPT, 'data-testid': 'import-file' });
const err = h('div', { class: 'bds-error', role: 'alert', 'data-testid': 'import-error' });
const _ou = h('div', { class: 'bds-import-stage' });
body.append(
h('p', { class: 'bds-muted' }, 'Chọn tệp Excel (.xlsx) hoặc CSV có dòng tiêu đề (vd "Họ tên", "Số điện thoại", "Dự án", "Ghi chú"). App tự nhận cột tiếng Việt – anh/chị sửa lại nếu sai. Tệp đọc ngay trên máy, không gửi đi đâu khác.'),
h('div', { class: 'bds-row' }, K.button('Tải tệp mẫu (Excel)', async () => {
try {
const _o1 = await import('../../../shared/xlsx_write.js');
download(IL.TEMPLATE_XLSX, _o1.xlsxBook(IL.templateSheets()), _o2);
K.toast('Đã tải tệp mẫu – điền khách rồi chọn tệp ở ô bên dưới', 'success');
} catch (e) { K.toast('Chưa tạo được tệp mẫu: ' + ((e && e.message) || e), 'danger'); }
}, { kind: 'ghost', icon: 'download', testid: 'import-template', title: 'Tải tệp Excel mẫu: đúng các cột app nhập được, kèm trang Hướng dẫn' })),
K.field('Tệp khách hàng', _od), err, _ou);
_od.addEventListener('change', async () => {
err.textContent = '';
const _oc = _od.files && _od.files[0];
if (!_oc) return;
if (_oc.size > _o0) { err.textContent = 'Tệp quá lớn (tối đa 15 MB) – tách thành nhiều tệp.'; return; }
try {
const O = await import('../../../shared/ooxml.js');
const _oq = await O.parseFile(_oc, { name: _oc.name, maxCells: 600000, maxLength: 1 });
if (_oq.kind === 'docx') throw new Error('Đây là tệp Word – chọn tệp Excel (.xlsx) hoặc CSV.');
st.sheets = _oq.kind === 'xlsx' ? _oq.data.sheets.filter((s) => s.rows && s.rows.some((r) => r.some((c) => String(c).trim()))) : [{ name: 'CSV', rows: _oq.data }];
if (!st.sheets.length) throw new Error('Tệp không có dòng nào.');
st.file = _oc.name; st.sheet = 0;
_ok(0);
} catch (e) { err.textContent = (e && e.message) || 'Không đọc được tệp.'; _ou.replaceChildren(); }
});
function _ok(i) {
st.sheet = i;
st.prep = IL.prepare(st.sheets[i].rows);
st.mapping = { ...st.prep.mapping };
_ob();
}
async function _oo() {
const existing = await K.list('objects');
st.plan = IL.planImport({ headers: st.prep.headers, body: st.prep.body, mapping: st.mapping, existing, mode: st.mode, owner: st.owner ? st.owner.id : '',
me: ctx.user && ctx.user.id ? ctx.user.id : '', projects: K.projects(), file: st.file, newId: () => K.newId(), firstLine: st.prep.headerRow + 2 });
return st.plan;
}
async function _ob() {
const { headers, body: rows } = st.prep;
const _oa = [['-1', '— Không dùng —'], ...headers.map((x, i) => [String(i), (x || 'Cột ' + (i + 1))])];
const mapBox = h('div', { class: 'bds-grid2', 'data-testid': 'import-mapping' }, IL.FIELDS.map((_oc) => {
const _os = K.select(_oa, st.mapping[_oc.id] === undefined ? '-1' : String(st.mapping[_oc.id]), { 'data-testid': 'map-' + _oc.id, 'aria-label': _oc.label });
_os.addEventListener('change', () => { const v = Number(_os.value); if (v < 0) delete st.mapping[_oc.id]; else st.mapping[_oc.id] = v; _ob(); });
return K.field(_oc.label + (_oc.req ? ' *' : ''), _os);
}));
const sheetSel = st.sheets.length > 1 ? K.field('Trang tính', K.select(st.sheets.map((s, i) => [String(i), s.name + (s.hidden ? ' (ẩn)' : '')]), String(st.sheet), { 'data-testid': 'import-sheet-pick', onchange: (e) => _ok(Number(e.target.value)) })) : null;
const modeSel = K.select([['skip', 'Bỏ qua khách trùng (khuyên dùng)'], ['note', 'Khách trùng: chỉ thêm ghi chú vào hồ sơ có sẵn']], st.mode, { 'data-testid': 'import-mode', onchange: (e) => { st.mode = e.target.value; _ob(); } });
const ownerLbl = h('span', { 'data-testid': 'import-owner' }, st.owner ? (st.owner.full_name || st.owner.username) : 'Người nhập (anh/chị)');
const ownerRow = _o6 ? h('div', { class: 'bds-row' }, h('span', null, 'Giao khách mới cho: '), ownerLbl,
K.button('Chọn sale…', async () => { const _ow = await ctx.users.pick({ title: 'Giao khách nhập cho…' }); if (_ow) { st.owner = _ow; _ob(); } }, { kind: 'ghost', testid: 'import-pick-owner' }),
st.owner ? K.button('Bỏ chọn', () => { st.owner = null; _ob(); }, { kind: 'ghost' }) : null) : null;
const consent = h('input', { type: 'checkbox', 'data-testid': 'import-consent' });
const plan = await _oo();
const _ol = rows.slice(0, IL.PREVIEW);
const _o8 = (r, _oc) => (st.mapping[_oc] === undefined ? '' : String(r[st.mapping[_oc]] ?? ''));
const preview = h('div', { class: 'bds-table-wrap', style: 'overflow:auto;max-width:100%' }, h('table', { class: 'bds-table', 'data-testid': 'import-preview', style: 'border-collapse:collapse;font-size:.85rem' },
h('thead', null, h('tr', null, ['Dòng', 'Tên', 'Điện thoại', 'Dự án', 'Ghi chú'].map((x) => h('th', { style: 'text-align:left;padding:4px 8px' }, x)))),
h('tbody', null, _ol.map((r, i) => h('tr', null, [String(st.prep.headerRow + 2 + i), _o8(r, 'name'), _o8(r, 'phone'), _o8(r, 'project'), _o8(r, 'note').slice(0, 60)].map((x) => h('td', { style: 'padding:4px 8px;border-top:1px solid rgba(127,127,127,.2)' }, x)))))));
const _oi = IL.FIELDS.filter((_oc) => _oc.req && st.mapping[_oc.id] === undefined).map((_oc) => _oc.label);
const counts = h('p', { 'data-testid': 'import-counts' },
h('b', null, 'Sẽ thêm ' + plan.add.length + ' khách mới'),
' · ' + (st.mode === 'note' ? plan.notes.length + ' khách đã có (thêm ghi chú) · ' : '') + plan.skipped.length + ' trùng (bỏ qua) · ' + plan.invalid.length + ' không hợp lệ',
' (trong ' + plan.total + ' dòng).');
const _oe = K.button('Nhập ' + plan.add.length + ' khách', () => _or(consent), { kind: 'primary', testid: 'import-run' });
if (_oi.length || !(plan.add.length + plan.notes.length)) _oe.disabled = true;
_ou.replaceChildren(
h('p', { class: 'bds-muted' }, 'Tệp: ' + st.file + ' · ' + rows.length + ' dòng dữ liệu (tiêu đề ở dòng ' + (st.prep.headerRow + 1) + ').'),
sheetSel,
h('h3', null, 'Ghép cột'), mapBox,
_oi.length ? h('p', { class: 'bds-danger', 'data-testid': 'import-missing' }, 'Chọn cột cho: ' + _oi.join(', ')) : null,
h('h3', null, 'Xem trước ' + _ol.length + ' dòng đầu'), preview,
h('h3', null, 'Khách trùng số điện thoại'), modeSel,
h('p', { class: 'bds-muted' }, 'Khách đã có trong app không bao giờ bị ghi đè. Cột không ghép được ghi vào Ghi chú của khách.'),
ownerRow,
counts,
plan.invalid.length ? h('p', { class: 'bds-muted', 'data-testid': 'import-invalid' }, 'Không hợp lệ: ' + IL.reasonCounts(plan.invalid).map(([k, _oj]) => k + ' (' + _oj + ')').join(' · ')) : null,
h('label', { class: 'bds-check' }, consent, h('span', null, 'Tôi xác nhận khách trong tệp đã đồng ý rõ ràng cho lưu và dùng thông tin để liên hệ tư vấn bất động sản (bắt buộc – Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15).')),
plan.total > IL.CHUNK ? h('p', { class: 'bds-muted' }, 'Tệp lớn: app ghi từng lô ' + IL.CHUNK.toLocaleString('vi-VN') + ' khách và chờ đồng bộ xong mỗi lô – giữ app mở tới khi xong.') : null,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _ot.close()), _oe));
}
async function _or(consent) {
if (st.busy) return;
if (!consent.checked) { err.textContent = 'Cần tick ô xác nhận khách đã đồng ý (Luật 91/2025/QH15).'; consent.focus(); return; }
err.textContent = '';
st.busy = true;
const plan = await _oo();
const _om = h('p', { 'data-testid': 'import-progress' }, 'Đang nhập…');
_ou.replaceChildren(_om);
const failed = [];
let added = 0, noted = 0;
const _o4 = new Set(plan.add.map((r) => String(r.id))), dup = new Set();
const _ox = ctx.store && typeof ctx.store.on === 'function'
? ctx.store.on('objects', (ch) => { if (ch && ch.rejected === 'DUP' && ch.row && _o4.has(String(ch.row.id))) dup.add(String(ch.row.id)); }) : null;
const _og = IL.chunks(plan.add, IL.CHUNK);
const _ov = Date.now();
const _oh = ctx.user || {};
const by = { by: _oh.id || '', by_name: _oh.full_name || _oh.username || 'Chủ app' };
const _o9 = ('Xác nhận khi nhập tệp ' + (st.file || '')).slice(0, CS.LIMITS.note);
for (let _of = 0; _of < _og.length; _of++) {
for (const row0 of _og[_of]) {
let row = row0;
const _o7 = CS.makeEntry({ act: 'grant', scopes: ['luu', 'cham_soc'], channel: 'nhap_danh_sach', at: _ov, note: _o9, ...by }, { now: _ov });
if (_o7.ok) row = { ...row0, ...CS.withEntry(row0, _o7.entry) };
try { await K.put('objects', row); added++; } catch { failed.push(row.id); }
}
_om.textContent = 'Đã ghi ' + added + '/' + plan.add.length + ' khách (lô ' + (_of + 1) + '/' + _og.length + ')… đang đồng bộ';
try { if (ctx.store && typeof ctx.store.syncNow === 'function') await ctx.store.syncNow(); } catch { }
await new Promise((r) => setTimeout(r, 0));
}
for (const _oj of plan.notes) { try { await K.logEvent(_oj.id, 'note', _oj.text, { import: { file: st.file, line: _oj.line } }); noted++; } catch { } }
if (plan.notes.length) { try { if (ctx.store && typeof ctx.store.syncNow === 'function') await ctx.store.syncNow(); } catch { } }
if (typeof _ox === 'function') _ox();
st.busy = false;
added = Math.max(0, added - dup.size);
const _op = IL.reportRows(plan, { failed, dup: [...dup] });
const stats = [['Đã thêm', added, 'import-added'], ['Thêm ghi chú (khách đã có)', noted, 'import-noted'], ['Bỏ qua (trùng)', plan.skipped.length + dup.size, 'import-skipped'], ['Không hợp lệ', plan.invalid.length, 'import-bad']];
if (dup.size) stats.push(['Trong đó trùng trên máy chủ (giữ hồ sơ cũ)', dup.size, 'import-dup']);
if (failed.length) stats.push(['Lỗi khi ghi', failed.length, 'import-failed']);
const _on = [...IL.reasonCounts(plan.skipped), ...IL.reasonCounts(plan.invalid)];
if (dup.size) _on.unshift([IL.DUP_SERVER, dup.size]);
_ou.replaceChildren(
h('h3', { 'data-testid': 'import-done' }, '✅ Xong'),
h('dl', { class: 'bds-dl', 'data-testid': 'import-summary' }, stats.map(([k, v, t]) => [h('dt', null, k), h('dd', { 'data-testid': t }, String(v))])),
_on.length ? h('ul', { class: 'bds-muted' }, _on.slice(0, 8).map(([k, _oj]) => h('li', null, k + ': ' + _oj + ' dòng'))) : null,
h('p', { class: 'bds-muted' }, 'Khách mới có nguồn "Nhập Excel/CSV". Máy chủ kiểm quyền từng dòng khi đồng bộ – dòng bị từ chối sẽ báo ở thanh đồng bộ.'),
h('div', { class: 'bds-row bds-end' },
K.button('⬇️ Tải báo cáo CSV', () => download('bao-cao-nhap-khach-' + new Date().toISOString().slice(0, 10) + '.csv', IL.toCsv(_op)), { kind: 'ghost', testid: 'import-report' }),
K.button('Đóng', () => _ot.close(), { kind: 'primary', testid: 'import-close' })));
K.toast('Đã nhập ' + added + ' khách' + (noted ? ', thêm ghi chú ' + noted + ' khách đã có' : ''), 'success');
}
return _ot;
}

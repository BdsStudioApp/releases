import { h } from '../_lib/kit.js';
import * as IL from '../_lib/import_logic.js';
const ACCEPT = '.xlsx,.xlsm,.csv,.tsv,.txt,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv';
const _o0 = 15 * 1024 * 1024;
export function canImport(ctx) { return !ctx.user || ctx.user.role !== 'ctv'; }
function download(name, text) {
const _o3 = new Blob([text], { type: 'text/csv;charset=utf-8' });
const _o1 = h('a', { href: URL.createObjectURL(_o3), download: name });
document.body.appendChild(_o1); _o1.click(); _o1.remove(); setTimeout(() => URL.revokeObjectURL(_o1.href), 4000);
}
export async function openImport(ctx, K) {
const P = (ctx.user && ctx.user.perms) || { assign: true };
const _o4 = !!(P.assign && ctx.users && typeof ctx.users.pick === 'function' && ctx.user && !ctx.user.legacy && !ctx.solo);
const body = h('div', { class: 'bds-form', 'data-testid': 'import-box' });
const _oo = K.sheet({ title: '📥 Nhập khách từ Excel/CSV', body, testid: 'import-sheet' });
const st = { file: '', sheets: [], sheet: 0, prep: null, mapping: {}, mode: 'skip', owner: null, plan: null, busy: false };
const _o9 = h('input', { type: 'file', accept: ACCEPT, 'data-testid': 'import-file' });
const err = h('div', { class: 'bds-error', role: 'alert', 'data-testid': 'import-error' });
const _op = h('div', { class: 'bds-import-stage' });
body.append(
h('p', { class: 'bds-muted' }, 'Chọn tệp Excel (.xlsx) hoặc CSV có dòng tiêu đề (vd "Họ tên", "Số điện thoại", "Dự án", "Ghi chú"). App tự nhận cột tiếng Việt – anh/chị sửa lại nếu sai. Tệp đọc ngay trên máy, không gửi đi đâu khác.'),
K.field('Tệp khách hàng', _o9), err, _op);
_o9.addEventListener('change', async () => {
err.textContent = '';
const _o8 = _o9.files && _o9.files[0];
if (!_o8) return;
if (_o8.size > _o0) { err.textContent = 'Tệp quá lớn (tối đa 15 MB) – tách thành nhiều tệp.'; return; }
try {
const O = await import('../../../shared/ooxml.js');
const _ol = await O.parseFile(_o8, { name: _o8.name, maxCells: 600000, maxLength: 1 });
if (_ol.kind === 'docx') throw new Error('Đây là tệp Word – chọn tệp Excel (.xlsx) hoặc CSV.');
st.sheets = _ol.kind === 'xlsx' ? _ol.data.sheets.filter((s) => s.rows && s.rows.some((r) => r.some((c) => String(c).trim()))) : [{ name: 'CSV', rows: _ol.data }];
if (!st.sheets.length) throw new Error('Tệp không có dòng nào.');
st.file = _o8.name; st.sheet = 0;
_of(0);
} catch (e) { err.textContent = (e && e.message) || 'Không đọc được tệp.'; _op.replaceChildren(); }
});
function _of(i) {
st.sheet = i;
st.prep = IL.prepare(st.sheets[i].rows);
st.mapping = { ...st.prep.mapping };
_o7();
}
async function _oj() {
const existing = await K.list('objects');
st.plan = IL.planImport({ headers: st.prep.headers, body: st.prep.body, mapping: st.mapping, existing, mode: st.mode, owner: st.owner ? st.owner.id : '',
me: ctx.user && ctx.user.id ? ctx.user.id : '', projects: K.projects(), file: st.file, newId: () => K.newId(), firstLine: st.prep.headerRow + 2 });
return st.plan;
}
async function _o7() {
const { headers, body: rows } = st.prep;
const _o6 = [['-1', '— Không dùng —'], ...headers.map((x, i) => [String(i), (x || 'Cột ' + (i + 1))])];
const mapBox = h('div', { class: 'bds-grid2', 'data-testid': 'import-mapping' }, IL.FIELDS.map((_o8) => {
const _on = K.select(_o6, st.mapping[_o8.id] === undefined ? '-1' : String(st.mapping[_o8.id]), { 'data-testid': 'map-' + _o8.id, 'aria-label': _o8.label });
_on.addEventListener('change', () => { const v = Number(_on.value); if (v < 0) delete st.mapping[_o8.id]; else st.mapping[_o8.id] = v; _o7(); });
return K.field(_o8.label + (_o8.req ? ' *' : ''), _on);
}));
const sheetSel = st.sheets.length > 1 ? K.field('Trang tính', K.select(st.sheets.map((s, i) => [String(i), s.name + (s.hidden ? ' (ẩn)' : '')]), String(st.sheet), { 'data-testid': 'import-sheet-pick', onchange: (e) => _of(Number(e.target.value)) })) : null;
const modeSel = K.select([['skip', 'Bỏ qua khách trùng (khuyên dùng)'], ['note', 'Khách trùng: chỉ thêm ghi chú vào hồ sơ có sẵn']], st.mode, { 'data-testid': 'import-mode', onchange: (e) => { st.mode = e.target.value; _o7(); } });
const ownerLbl = h('span', { 'data-testid': 'import-owner' }, st.owner ? (st.owner.full_name || st.owner.username) : 'Người nhập (anh/chị)');
const ownerRow = _o4 ? h('div', { class: 'bds-row' }, h('span', null, 'Giao khách mới cho: '), ownerLbl,
K.button('Chọn sale…', async () => { const _oq = await ctx.users.pick({ title: 'Giao khách nhập cho…' }); if (_oq) { st.owner = _oq; _o7(); } }, { kind: 'ghost', testid: 'import-pick-owner' }),
st.owner ? K.button('Bỏ chọn', () => { st.owner = null; _o7(); }, { kind: 'ghost' }) : null) : null;
const consent = h('input', { type: 'checkbox', 'data-testid': 'import-consent' });
const plan = await _oj();
const _og = rows.slice(0, IL.PREVIEW);
const _o5 = (r, _o8) => (st.mapping[_o8] === undefined ? '' : String(r[st.mapping[_o8]] ?? ''));
const preview = h('div', { class: 'bds-table-wrap', style: 'overflow:auto;max-width:100%' }, h('table', { class: 'bds-table', 'data-testid': 'import-preview', style: 'border-collapse:collapse;font-size:.85rem' },
h('thead', null, h('tr', null, ['Dòng', 'Tên', 'Điện thoại', 'Dự án', 'Ghi chú'].map((x) => h('th', { style: 'text-align:left;padding:4px 8px' }, x)))),
h('tbody', null, _og.map((r, i) => h('tr', null, [String(st.prep.headerRow + 2 + i), _o5(r, 'name'), _o5(r, 'phone'), _o5(r, 'project'), _o5(r, 'note').slice(0, 60)].map((x) => h('td', { style: 'padding:4px 8px;border-top:1px solid rgba(127,127,127,.2)' }, x)))))));
const _od = IL.FIELDS.filter((_o8) => _o8.req && st.mapping[_o8.id] === undefined).map((_o8) => _o8.label);
const counts = h('p', { 'data-testid': 'import-counts' },
h('b', null, 'Sẽ thêm ' + plan.add.length + ' khách mới'),
' · ' + (st.mode === 'note' ? plan.notes.length + ' khách đã có (thêm ghi chú) · ' : '') + plan.skipped.length + ' trùng (bỏ qua) · ' + plan.invalid.length + ' không hợp lệ',
' (trong ' + plan.total + ' dòng).');
const _oa = K.button('Nhập ' + plan.add.length + ' khách', () => _om(consent), { kind: 'primary', testid: 'import-run' });
if (_od.length || !(plan.add.length + plan.notes.length)) _oa.disabled = true;
_op.replaceChildren(
h('p', { class: 'bds-muted' }, 'Tệp: ' + st.file + ' · ' + rows.length + ' dòng dữ liệu (tiêu đề ở dòng ' + (st.prep.headerRow + 1) + ').'),
sheetSel,
h('h3', null, 'Ghép cột'), mapBox,
_od.length ? h('p', { class: 'bds-danger', 'data-testid': 'import-missing' }, 'Chọn cột cho: ' + _od.join(', ')) : null,
h('h3', null, 'Xem trước ' + _og.length + ' dòng đầu'), preview,
h('h3', null, 'Khách trùng số điện thoại'), modeSel,
h('p', { class: 'bds-muted' }, 'Khách đã có trong app không bao giờ bị ghi đè. Cột không ghép được ghi vào Ghi chú của khách.'),
ownerRow,
counts,
plan.invalid.length ? h('p', { class: 'bds-muted', 'data-testid': 'import-invalid' }, 'Không hợp lệ: ' + IL.reasonCounts(plan.invalid).map(([k, _oe]) => k + ' (' + _oe + ')').join(' · ')) : null,
h('label', { class: 'bds-check' }, consent, h('span', null, 'Tôi xác nhận khách trong tệp đã đồng ý rõ ràng cho lưu và dùng thông tin để liên hệ tư vấn bất động sản (bắt buộc – Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15).')),
plan.total > IL.CHUNK ? h('p', { class: 'bds-muted' }, 'Tệp lớn: app ghi từng lô ' + IL.CHUNK.toLocaleString('vi-VN') + ' khách và chờ đồng bộ xong mỗi lô – giữ app mở tới khi xong.') : null,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _oo.close()), _oa));
}
async function _om(consent) {
if (st.busy) return;
if (!consent.checked) { err.textContent = 'Cần tick ô xác nhận khách đã đồng ý (Luật 91/2025/QH15).'; consent.focus(); return; }
err.textContent = '';
st.busy = true;
const plan = await _oj();
const _oh = h('p', { 'data-testid': 'import-progress' }, 'Đang nhập…');
_op.replaceChildren(_oh);
const failed = [];
let added = 0, noted = 0;
const _o2 = new Set(plan.add.map((r) => String(r.id))), dup = new Set();
const _or = ctx.store && typeof ctx.store.on === 'function'
? ctx.store.on('objects', (ch) => { if (ch && ch.rejected === 'DUP' && ch.row && _o2.has(String(ch.row.id))) dup.add(String(ch.row.id)); }) : null;
const _oc = IL.chunks(plan.add, IL.CHUNK);
for (let _ob = 0; _ob < _oc.length; _ob++) {
for (const row of _oc[_ob]) {
try { await K.put('objects', row); added++; } catch { failed.push(row.id); }
}
_oh.textContent = 'Đã ghi ' + added + '/' + plan.add.length + ' khách (lô ' + (_ob + 1) + '/' + _oc.length + ')… đang đồng bộ';
try { if (ctx.store && typeof ctx.store.syncNow === 'function') await ctx.store.syncNow(); } catch { }
await new Promise((r) => setTimeout(r, 0));
}
for (const _oe of plan.notes) { try { await K.logEvent(_oe.id, 'note', _oe.text, { import: { file: st.file, line: _oe.line } }); noted++; } catch { } }
if (plan.notes.length) { try { if (ctx.store && typeof ctx.store.syncNow === 'function') await ctx.store.syncNow(); } catch { } }
if (typeof _or === 'function') _or();
st.busy = false;
added = Math.max(0, added - dup.size);
const _ok = IL.reportRows(plan, { failed, dup: [...dup] });
const stats = [['Đã thêm', added, 'import-added'], ['Thêm ghi chú (khách đã có)', noted, 'import-noted'], ['Bỏ qua (trùng)', plan.skipped.length + dup.size, 'import-skipped'], ['Không hợp lệ', plan.invalid.length, 'import-bad']];
if (dup.size) stats.push(['Trong đó trùng trên máy chủ (giữ hồ sơ cũ)', dup.size, 'import-dup']);
if (failed.length) stats.push(['Lỗi khi ghi', failed.length, 'import-failed']);
const _oi = [...IL.reasonCounts(plan.skipped), ...IL.reasonCounts(plan.invalid)];
if (dup.size) _oi.unshift([IL.DUP_SERVER, dup.size]);
_op.replaceChildren(
h('h3', { 'data-testid': 'import-done' }, '✅ Xong'),
h('dl', { class: 'bds-dl', 'data-testid': 'import-summary' }, stats.map(([k, v, t]) => [h('dt', null, k), h('dd', { 'data-testid': t }, String(v))])),
_oi.length ? h('ul', { class: 'bds-muted' }, _oi.slice(0, 8).map(([k, _oe]) => h('li', null, k + ': ' + _oe + ' dòng'))) : null,
h('p', { class: 'bds-muted' }, 'Khách mới có nguồn "Nhập Excel/CSV". Máy chủ kiểm quyền từng dòng khi đồng bộ – dòng bị từ chối sẽ báo ở thanh đồng bộ.'),
h('div', { class: 'bds-row bds-end' },
K.button('⬇️ Tải báo cáo CSV', () => download('bao-cao-nhap-khach-' + new Date().toISOString().slice(0, 10) + '.csv', IL.toCsv(_ok)), { kind: 'ghost', testid: 'import-report' }),
K.button('Đóng', () => _oo.close(), { kind: 'primary', testid: 'import-close' })));
K.toast('Đã nhập ' + added + ' khách' + (noted ? ', thêm ghi chú ' + noted + ' khách đã có' : ''), 'success');
}
return _oo;
}

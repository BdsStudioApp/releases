import { g5, h, selftestWith, FONT, wrapText } from '../g5_lib/ui.js';
import * as I from '../g5_lib/interior.js';
import { areas, cleanRooms } from '../g5_lib/plan3d.js';
const KIND = 'g5_noithat', TABLE_KIND = 'g5_banggia';
export function renderSheet(canvas, est, { title, styleVi, levelVi, sample, source, money }) {
const W = 1240, rowH = 40, top = 260;
const _o0 = Math.max(1754, top + (est.rows.length + 8) * rowH + 220);
canvas.width = W; canvas.height = _o0;
const _o6 = canvas.getContext('2d');
_o6.fillStyle = '#FFFFFF'; _o6.fillRect(0, 0, W, _o0);
_o6.fillStyle = '#0F1E33'; _o6.fillRect(0, 0, W, 150);
_o6.fillStyle = '#E6C77A'; _o6.font = `600 26px ${FONT}`; _o6.fillText('DỰ TOÁN NỘI THẤT', 60, 60);
_o6.fillStyle = '#FFFFFF'; _o6.font = `bold 44px ${FONT}`; _o6.fillText(String(title || 'Căn hộ').slice(0, 48), 60, 115);
_o6.fillStyle = '#0F1E33'; _o6.font = `24px ${FONT}`;
_o6.fillText(`Phong cách: ${styleVi} · Mức đầu tư: ${levelVi} · Diện tích: ${String(est.area).replace('.', ',')} m²`, 60, 200);
const _o8 = [60, 600, 760, 880, 1180];
_o6.font = `bold 22px ${FONT}`; _o6.fillStyle = '#5F6979';
_o6.fillText('Hạng mục', _o8[0], top); _o6.textAlign = 'right'; _o6.fillText('Khối lượng', _o8[2], top); _o6.fillText('Đơn giá', _o8[3] + 120, top); _o6.fillText('Thành tiền', _o8[4], top); _o6.textAlign = 'left';
let y = top + rowH;
_o6.font = `22px ${FONT}`;
est.rows.forEach((_or, i) => {
if (i % 2 === 0) { _o6.fillStyle = '#F7F3EA'; _o6.fillRect(40, y - 28, W - 80, rowH); }
_o6.fillStyle = '#0F1E33'; _o6.fillText(String(_or.vi).slice(0, 40), _o8[0], y);
_o6.textAlign = 'right';
_o6.fillText(`${String(_or.qty).replace('.', ',')} ${I.UNITS[_or.unit] || ''}`, _o8[2], y);
_o6.fillText(money(_or.price), _o8[3] + 120, y);
_o6.fillText(money(_or.amount), _o8[4], y);
_o6.textAlign = 'left'; y += rowH;
});
y += 10; _o6.fillStyle = '#C9A24A'; _o6.fillRect(40, y - 26, W - 80, 2); y += 20;
const _oh = (label, v, bold) => { _o6.font = `${bold ? 'bold ' : ''}26px ${FONT}`; _o6.fillStyle = '#0F1E33'; _o6.fillText(label, _o8[0], y); _o6.textAlign = 'right'; _o6.fillText(v, _o8[4], y); _o6.textAlign = 'left'; y += 44; };
_oh('Cộng hạng mục (đã nhân hệ số phong cách ' + String(est.styleFactor).replace('.', ',') + ')', money(est.subtotal));
if (est.contingency) _oh('Dự phòng phát sinh', money(est.contingency));
if (est.design) _oh('Phí thiết kế', money(est.design));
_oh('TỔNG DỰ TOÁN', money(est.total), true);
if (est.perM2) _oh('Bình quân / m²', money(est.perM2));
_o6.font = `20px ${FONT}`; _o6.fillStyle = sample ? '#B4423A' : '#5F6979';
y += 10;
y = wrapText(_o6, sample ? 'ĐƠN GIÁ MẪU – chưa phải giá thị trường, chỉ minh hoạ cách tính. ' + I.SAMPLE_NOTE : 'Nguồn đơn giá: ' + source, 60, y, W - 120, 28);
wrapText(_o6, 'Dự toán tham khảo, chưa gồm thay đổi kết cấu, điện nước âm tường, vận chuyển lên cao tầng nếu nhà thầu tính riêng.', 60, y + 6, W - 120, 28);
if (sample) {
_o6.save(); _o6.translate(W / 2, _o0 / 2); _o6.rotate(-Math.PI / 7); _o6.fillStyle = 'rgba(180,66,58,.10)'; _o6.font = `bold 150px ${FONT}`; _o6.textAlign = 'center'; _o6.fillText('SỐ MẪU', 0, 0); _o6.restore();
}
return canvas;
}
export async function mount(el, ctx) {
const G = g5(ctx), K = G.K;
const money = (n) => I.money(n);
const st = { id: null, name: '', area: 70, bedrooms: 2, baths: 2, style: 'hiendai', level: 'kha', qty: {}, off: {}, custom: [], contingency: 5, designPct: 0 };
let table = I.defaultPriceTable(), tableId = null;
const _ot = h('div', { class: 'g5', 'data-testid': 'g5-noithat' });
el.replaceChildren(_ot);
const uid = ctx.user && ctx.user.id;
const _oj = (_oa) => { const _ol = _oa.row || {}; return !uid || (!_ol.owner && !_ol.created_by) || _ol.owner === uid || _ol.created_by === uid; };
const t0 = (await G.listDocs(TABLE_KIND)).find(_oj);
if (t0 && t0.data && Array.isArray(t0.data.items)) { table = { ...I.defaultPriceTable(), ...t0.data }; tableId = t0.id; }
const _ok = G.input({ placeholder: 'vd Căn 2PN – anh Tuấn', 'data-testid': 'nt-name', oninput: (e) => { st.name = e.target.value; } });
const _o2 = G.input({ type: 'number', min: 10, step: 0.1, value: st.area, 'data-testid': 'nt-area', onchange: (e) => { st.area = G.num(e.target.value, 0); st.qty = {}; _o7(); } });
const _o5 = G.input({ type: 'number', min: 0, max: 8, value: st.bedrooms, 'data-testid': 'nt-bed', onchange: (e) => { st.bedrooms = G.num(e.target.value, 0); st.qty = {}; _o7(); } });
const _o4 = G.input({ type: 'number', min: 0, max: 8, value: st.baths, 'data-testid': 'nt-bath', onchange: (e) => { st.baths = G.num(e.target.value, 0); st.qty = {}; _o7(); } });
const _oy = G.select(I.STYLES.map((s) => [s.id, s.vi]), st.style, { 'data-testid': 'nt-style', onchange: (e) => { st.style = e.target.value; _o7(); } });
const _ox = h('p', { class: 'bds-muted g5-small' });
const _og = G.tabs(I.LEVELS.map((l) => [l.id, l.vi]), st.level, (v) => { st.level = v; _o7(); }, 'nt-level');
const _o9 = G.input({ type: 'number', min: 0, max: 30, value: st.contingency, 'data-testid': 'nt-cont', onchange: (e) => { st.contingency = G.num(e.target.value, 0); _o7(); } });
const _ob = G.input({ type: 'number', min: 0, max: 30, value: st.designPct, 'data-testid': 'nt-design', onchange: (e) => { st.designPct = G.num(e.target.value, 0); _o7(); } });
const _op = G.select([['', '— lấy số phòng từ mặt bằng 3D đã lưu —']], '', { 'aria-label': 'Lấy số phòng từ mặt bằng 3D đã lưu', 'data-testid': 'nt-from-plan', onchange: (e) => _of(e.target.value) });
const sampleBox = h('div', { 'data-testid': 'nt-sample' });
const _oz = h('div', { class: 'g5-table-wrap', 'data-testid': 'nt-table' });
const _o10 = h('div', { 'data-testid': 'nt-total', 'aria-live': 'polite' });
const _ow = G.input({ placeholder: 'Nguồn đơn giá: tên nhà thầu/cửa hàng, ngày báo giá', value: table.source || '', 'data-testid': 'nt-source' });
const _ov = h('div', { class: 'g5-list', 'data-testid': 'nt-saved' });
const areaWarn = h('div', { 'data-testid': 'nt-area-box' });
const sheetCv = h('canvas', { class: 'g5-canvas', 'data-testid': 'nt-sheet', hidden: true });
_ot.append(
G.head('Dự toán nội thất', 'Chọn phong cách và mức đầu tư, sửa khối lượng / đơn giá từng hạng mục, xuất ảnh hoặc PDF gửi khách.', 'nt-head'),
sampleBox, areaWarn,
h('div', { class: 'g5-grid' },
K.card({ title: 'Căn hộ', body: h('div', { class: 'g5-form' },
h('div', { class: 'g5-full' }, G.field('Tên dự toán', _ok)),
G.field('Diện tích thông thuỷ (m²)', _o2), G.field('Phòng ngủ', _o5), G.field('Phòng tắm', _o4), G.field('Phong cách', _oy),
h('div', { class: 'g5-full' }, _ox), h('div', { class: 'g5-full' }, G.field('Mức đầu tư', _og)),
G.field('Dự phòng (%)', _o9), G.field('Phí thiết kế (%)', _ob),
h('div', { class: 'g5-full' }, _op)) }),
K.card({ title: 'Tổng', body: [_o10, h('div', { class: 'g5-row' },
K.button('Lưu dự toán', () => save(), { kind: 'primary', testid: 'nt-save' }),
K.button('Tải ảnh PNG', () => _oe(), { testid: 'nt-png', icon: 'download' }), K.button('Tải PDF', () => _od(), { testid: 'nt-pdf', icon: 'download' })), _ov] })),
K.card({ title: 'Hạng mục & đơn giá', body: [_oz,
h('div', { class: 'g5-row' }, K.button('+ Thêm hạng mục', () => { st.custom.push({ id: 'tuy_' + Date.now().toString(36), vi: '', qty: 1, unit: 'goi', price: 0, room: 'Khác' }); _o7(); }, { testid: 'nt-add' })),
h('div', { class: 'g5-row' }, h('div', { class: 'g5-full' }, _ow), K.button('Lưu bảng đơn giá', () => _ou(), { testid: 'nt-save-table' }), K.button('Đặt lại số mẫu', () => _os(), { kind: 'danger', testid: 'nt-reset-table', icon: 'undo' }))] }),
sheetCv,
);
async function _oi() {
const docs = await G.listDocs('g5_can3d');
_op.replaceChildren(h('option', { value: '' }, '— lấy số phòng từ mặt bằng 3D đã lưu —'), ...docs.map((_oa) => h('option', { value: _oa.id }, _oa.name)));
_op._docs = docs;
}
function _of(id) {
const _oa = (_op._docs || []).find((x) => x.id === id);
if (!_oa || !_oa.data.plan) return;
const _o1 = areas(cleanRooms(_oa.data.plan.rooms || []));
st.area = _o1.indoor; st.bedrooms = _o1.bedrooms; st.baths = _o1.baths; st.qty = {};
_o2.value = st.area; _o5.value = st.bedrooms; _o4.value = st.baths;
if (!st.name) { st.name = _oa.name; _ok.value = _oa.name; }
_o7();
}
function _o3() {
if (!(st.area >= 10)) return 'Nhập diện tích thông thuỷ từ 10 m² trở lên – diện tích trống hoặc quá nhỏ thì khối lượng và tổng dự toán chưa đúng.';
if (st.area > 2000) return 'Diện tích lớn bất thường (trên 2.000 m²) – kiểm tra lại đơn vị m².';
return '';
}
function _oq(id) { const t = table.items.find((x) => x.id === id); return t ? t.price : null; }
function _o7() {
const est = I.estimate({ ...st, table });
const sample = I.isSample(table);
areaWarn.replaceChildren(...(_o3() ? [G.note('⚠ ' + _o3(), 'warn', 'nt-area-warn')] : []));
sampleBox.replaceChildren(sample ? G.note('⚠ ' + I.SAMPLE_NOTE, 'warn', 'nt-sample-note') : G.note('Đơn giá theo nguồn: ' + table.source, 'success'));
_ox.textContent = (I.STYLES.find((s) => s.id === st.style) || {}).desc + ` Hệ số phong cách (mẫu): ${String(est.styleFactor).replace('.', ',')}.`;
const rows = I.ITEMS.map((it) => {
const _on = !st.off[it.id];
const _or = est.rows.find((x) => x.id === it.id);
const qty = h('input', { type: 'number', min: 0, step: 0.1, value: _or ? _or.qty : Math.round(it.qty({ area: st.area, bedrooms: st.bedrooms, baths: st.baths }) * 10) / 10, disabled: !_on, 'aria-label': 'Khối lượng – ' + it.vi, 'data-testid': 'nt-qty-' + it.id, onchange: (e) => { st.qty[it.id] = G.num(e.target.value, 0); _o7(); } });
const price = h('input', { type: 'number', min: 0, step: 1000, value: (_oq(it.id) || {})[st.level] || 0, disabled: !_on, 'aria-label': 'Đơn giá – ' + it.vi, 'data-testid': 'nt-price-' + it.id, onchange: (e) => { const _oo = _oq(it.id); if (_oo) { _oo[st.level] = Math.max(0, G.num(e.target.value, 0)); table.sample = false; } _o7(); } });
return h('tr', null,
h('td', null, h('label', { class: 'g5-hit' }, h('input', { type: 'checkbox', checked: _on, 'aria-label': 'Tính hạng mục ' + it.vi, 'data-testid': 'nt-on-' + it.id, onchange: (e) => { st.off[it.id] = !e.target.checked; _o7(); } }))),
h('td', null, it.vi, h('div', { class: 'bds-muted g5-small' }, it.room)), h('td', null, qty), h('td', null, I.UNITS[it.unit]), h('td', null, price),
h('td', { class: 'num', 'data-testid': 'nt-amt-' + it.id }, _or ? money(_or.amount) : '—'));
});
const customRows = st.custom.map((cRow, i) => h('tr', null, h('td', null, K.button('✕', () => { st.custom.splice(i, 1); _o7(); }, { title: 'Xoá' })),
h('td', null, h('input', { value: cRow.vi, placeholder: 'Tên hạng mục', 'aria-label': 'Tên hạng mục tự thêm', 'data-testid': 'nt-c-name-' + i, onchange: (e) => { cRow.vi = e.target.value; _o7(); } })),
h('td', null, h('input', { type: 'number', min: 0, value: cRow.qty, 'aria-label': 'Khối lượng hạng mục tự thêm', 'data-testid': 'nt-c-qty-' + i, onchange: (e) => { cRow.qty = G.num(e.target.value, 0); _o7(); } })),
h('td', null, G.select(Object.entries(I.UNITS), cRow.unit, { 'aria-label': 'Đơn vị hạng mục tự thêm', onchange: (e) => { cRow.unit = e.target.value; _o7(); } })),
h('td', null, h('input', { type: 'number', min: 0, step: 1000, value: cRow.price, 'aria-label': 'Đơn giá hạng mục tự thêm', 'data-testid': 'nt-c-price-' + i, onchange: (e) => { cRow.price = G.num(e.target.value, 0); _o7(); } })),
h('td', { class: 'num' }, money((Number(cRow.qty) || 0) * (Number(cRow.price) || 0)))));
_oz.replaceChildren(h('table', { class: 'g5-table g5-prices' },
h('thead', null, h('tr', null, ...['', 'Hạng mục', 'Khối lượng', 'Đơn vị', `Đơn giá ${sample ? '(mẫu)' : ''} – ${I.LEVELS.find((l) => l.id === st.level).vi}`, 'Thành tiền'].map((x, i) => h('th', { class: i === 5 ? 'num' : '' }, x)))),
h('tbody', null, ...rows, ...customRows)));
_o10.replaceChildren(
h('div', { class: 'g5-row' }, h('div', { class: 'g5-stat' }, h('b', { 'data-testid': 'nt-total-v' }, money(est.total)), h('span', null, 'Tổng dự toán' + (sample ? ' (số mẫu)' : ''))),
h('div', { class: 'g5-stat' }, h('b', null, money(est.perM2)), h('span', null, 'Bình quân / m²'))),
h('ul', { class: 'g5-small' }, ...Object.entries(est.byRoom).map(([k, v]) => h('li', null, `${k}: ${money(v)}`)),
est.contingency ? h('li', null, `Dự phòng: ${money(est.contingency)}`) : null, est.design ? h('li', null, `Thiết kế: ${money(est.design)}`) : null));
return est;
}
async function _ou() {
table = I.markReal(table, _ow.value);
const row = await G.saveDoc(TABLE_KIND, { id: tableId, name: 'Bảng đơn giá nội thất', data: table });
tableId = row.id; K.toast(I.isSample(table) ? 'Đã lưu – vẫn là số mẫu vì chưa ghi nguồn.' : 'Đã lưu bảng đơn giá.', I.isSample(table) ? 'warn' : 'success'); _o7();
}
async function _os() {
const ok = await K.confirm({ title: 'Đặt lại số mẫu', text: 'Xoá mọi đơn giá đã sửa và quay về số mẫu?', ok: 'Đặt lại', kind: 'danger', testid: 'nt-reset-confirm' });
if (!ok) return;
table = I.defaultPriceTable(); _ow.value = '';
if (tableId) await G.saveDoc(TABLE_KIND, { id: tableId, name: 'Bảng đơn giá nội thất', data: table });
_o7();
}
const levelVi = () => I.LEVELS.find((l) => l.id === st.level).vi, styleVi = () => I.STYLES.find((s) => s.id === st.style).vi;
function sheet() { return renderSheet(sheetCv, _o7(), { title: st.name || 'Căn hộ', styleVi: styleVi(), levelVi: levelVi(), sample: I.isSample(table), source: table.source, money }); }
function _om() { const _o11 = _o3(); if (_o11) { K.toast('Chưa xuất được – ' + _o11.charAt(0).toLowerCase() + _o11.slice(1), 'warn'); return false; } return true; }
async function _oe() { if (!_om()) return; await G.savePng(sheet(), 'du-toan-noi-that-' + G.slug(st.name)); }
async function _od() { if (!_om()) return; await G.savePdf(sheet(), 'du-toan-noi-that-' + G.slug(st.name), 'Du toan noi that'); }
async function save() {
const est = _o7();
const row = await G.saveDoc(KIND, { id: st.id, name: st.name || `Dự toán ${styleVi()} – ${levelVi()}`, data: { ...st, id: undefined, total: est.total, sample: I.isSample(table) } });
st.id = row.id; K.toast('Đã lưu dự toán.', 'success'); _oc();
}
async function _oc() {
const docs = await G.listDocs(KIND);
if (!docs.length) { _ov.replaceChildren(K.empty('Chưa lưu dự toán nào. Bấm "Lưu dự toán" để giữ lại và mở lại sau.')); return; }
_ov.replaceChildren(...docs.slice(0, 20).map((_oa) => h('div', { class: 'g5-li' }, h('div', null, h('b', null, _oa.name), h('div', { class: 'bds-muted g5-small' }, money(_oa.data.total) + (_oa.data.sample ? ' · số mẫu' : ''))),
h('div', { class: 'g5-row' }, K.button('Mở', () => { Object.assign(st, { qty: {}, off: {}, custom: [] }, _oa.data, { id: _oa.id, name: _oa.name }); _ok.value = st.name; _o2.value = st.area; _o5.value = st.bedrooms; _o4.value = st.baths; _oy.value = st.style; _o9.value = st.contingency; _ob.value = st.designPct; _og.set(st.level); _o7(); }, { testid: 'nt-open-' + _oa.id }),
K.button('Xoá', async () => { if (!(await G.confirmDel(_oa.name, 'nt-del-c'))) return; await G.removeDoc(_oa.id); _oc(); }, { kind: 'danger', testid: 'nt-del-' + _oa.id })))));
}
_o7(); _oc(); _oi();
return _ot;
}
export default {
manifest: {
id: 'g5_noithat', title: 'Dự toán nội thất', icon: '🛋️', screen: 'sales', order: 540, version: '0.1.0', status: 'ready',
desc: 'Thử nghiệm · theo phong cách & mức đầu tư, xuất PDF',
help: 'Dự toán nội thất theo diện tích, số phòng, phong cách và mức đầu tư. Đơn giá có sẵn là số mẫu – sửa theo báo giá thật, ghi nguồn, rồi xuất ảnh/PDF gửi khách.',
},
mount,
async selftest(ctx) { return selftestWith(ctx, () => I.estimate({ area: 70, bedrooms: 2, baths: 2, style: 'hiendai', level: 'kha' }).total > 0); },
};

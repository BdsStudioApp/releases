import { g2kit, h, g2Selftest } from '../g2_lib/ui.js';
import { kids } from '../_lib/kit.js';
import * as C from '../g2_lib/core.js';
import * as O from '../g2_lib/ops.js';
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
const _op = new URLSearchParams(location.hash.split('?')[1] || '');
let cid = _op.get('customer') || '';
el.innerHTML = '';
const _o2 = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-taisan' }, G.head('Sổ tài sản của khách'), _o2));
async function _oq() {
const customers = (await G.customers()).sort((a, b) => (G.crm.isPostSale(b) ? 1 : 0) - (G.crm.isPostSale(a) ? 1 : 0) || String(a.name).localeCompare(String(b.name), 'vi'));
if (!customers.some(_o3 => _o3.id === cid)) cid = ((customers.find(_o3 => (C.g2Of(_o3).assets || []).length) || customers.find(G.crm.isPostSale) || customers[0]) || {}).id || '';
_o2.innerHTML = '';
_o2.appendChild(K.field('Khách', G.customerSelect(customers, cid, { 'data-testid': 'g2-asset-customer', onchange: e => { cid = e.target.value; _oq(); } })));
const _o3 = customers.find(x => x.id === cid);
if (!_o3) { _o2.appendChild(K.empty('Chưa có khách.')); return; }
const assets = C.g2Of(_o3).assets || [];
const _od = h('div', { class: 'bds-list', 'data-testid': 'g2-assets' });
assets.forEach(a => {
const k = O.assetCalc(a);
_od.appendChild(h('div', { class: 'bds-item', 'data-testid': 'g2-asset-' + a.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => _o7(_o3, a) }, h('strong', null, [K.projectName(a.project), a.unit].filter(Boolean).join(' – ') || 'Tài sản'),
h('span', { class: 'bds-sub' }, [k.area ? k.area + ' m²' : '', k.buy ? 'mua ' + K.money(k.buy) : '', k.value ? 'ước ' + K.money(k.value) : 'chưa có giá trị ước tính'].filter(Boolean).join(' · ')))));
});
if (!assets.length) _od.appendChild(K.empty('Chưa có tài sản. Thêm căn khách đã mua để lập báo cáo quý.'));
_o2.append(_od, h('div', { class: 'bds-row bds-wrap' }, K.button('+ Thêm tài sản', () => _o7(_o3, null), { kind: 'primary', testid: 'g2-asset-add' })));
if (assets.length) {
const me = await K.me();
const _oh = O.reportModel(_o3, assets, { money: K.money, projectName: K.projectName, me });
const rep = _or(_oh);
_o2.append(...kids(h('h3', null, 'Báo cáo ' + _oh.q.label),
_oh.issues.length ? h('div', { class: 'bds-warn', 'data-testid': 'g2-asset-issues' }, 'Cần bổ sung nguồn: ' + _oh.issues.join('; ')) : null,
rep,
h('div', { class: 'bds-row bds-wrap' },
K.button('Tải ảnh báo cáo', async () => { const _o1 = await reportPng(_oh); G.download('bao-cao-tai-san-' + C.fold(_o3.name).replace(/\s+/g, '-') + '-q' + _oh.q.q + '-' + _oh.q.y + '.png', _o1); K.toast('Đã tải ảnh báo cáo', 'success'); }, { kind: 'primary', testid: 'g2-asset-png', icon: 'download' }),
K.button('Lưu PDF / In', () => _on(rep), { testid: 'g2-asset-pdf', title: 'Mở hộp in – chọn "Lưu thành PDF"', icon: 'print' }),
K.button('Soạn tin gửi khách', () => G.compose(_o3, 'Dạ em gửi anh/chị ' + G.crm.givenName(_o3.name) + ' báo cáo tài sản ' + _oh.q.label + ' (ảnh đính kèm). Số liệu là ước tính tham khảo có ghi nguồn, anh/chị cần em giải thích phần nào em gọi ngay ạ.'), { icon: 'chat', testid: 'g2-asset-compose' }))));
}
}
async function _o7(_o3, a) {
const v = a || { id: 'a' + Date.now().toString(36) };
const _ok = await G.objectsOf('g2_mkt');
const _oo = K.select([['', '— Dự án —'], ...K.projects().map(p => [p.id, p.name])], v.project || _o3.project || '', { 'data-testid': 'g2-a-project' });
const _oc = (val, attrs = {}) => h('input', { value: val ?? '', ...attrs });
const _o8 = {
unit: _oc(v.unit, { placeholder: 'VD: Căn 1208 toà A' }), area: _oc(v.area, { inputmode: 'decimal', 'data-testid': 'g2-a-area' }),
buy: _oc(v.buy_price ? K.money(v.buy_price) : '', { placeholder: 'VD: 3,2 tỷ', 'data-testid': 'g2-a-buy' }), buy_date: _oc(v.buy_date, { type: 'date' }),
value_m2: _oc(v.value_m2, { inputmode: 'decimal', placeholder: 'triệu/m²', 'data-testid': 'g2-a-vm2' }), value_src: _oc(v.value_src, { placeholder: 'Link hoặc tên nguồn (bắt buộc khi có số)', 'data-testid': 'g2-a-vsrc' }),
rent: _oc(v.rent ? v.rent / 1e6 : '', { inputmode: 'decimal', placeholder: 'triệu/tháng', 'data-testid': 'g2-a-rent' }), rent_src: _oc(v.rent_src, { placeholder: 'Nguồn giá thuê', 'data-testid': 'g2-a-rsrc' }),
progress: _oc(v.progress, { placeholder: 'VD: Đã cất nóc, hoàn thiện mặt ngoài' }), progress_src: _oc(v.progress_src, { placeholder: 'Nguồn tiến độ' }),
infra: h('textarea', { rows: 3, placeholder: 'Mỗi dòng: nội dung | link nguồn', 'data-testid': 'g2-a-infra' }, (v.infra || []).map(i => i.text + (i.url ? ' | ' + i.url : '')).join('\n')),
};
const fill = () => {
const _of = O.latestObs(_ok, _oo.value);
let _oi = 0;
if (_of.price) { _o8.value_m2.value = _of.price.value; _o8.value_src.value = _of.price.url; _oi++; }
if (_of.rent) { _o8.rent.value = _of.rent.value; _o8.rent_src.value = _of.rent.url; _oi++; }
if (_of.progress) { _o8.progress.value = _of.progress.note; _o8.progress_src.value = _of.progress.url; _oi++; }
if (_of.infra && !_o8.infra.value.includes(_of.infra.url)) { _o8.infra.value = (_o8.infra.value ? _o8.infra.value + '\n' : '') + _of.infra.note + ' | ' + _of.infra.url; _oi++; }
K.toast(_oi ? 'Đã điền ' + _oi + ' số liệu từ Ghi nhận thị trường – kiểm tra lại' : 'Dự án chưa có ghi nhận thị trường (thêm ở "Thị trường quanh dự án")', _oi ? 'success' : 'info');
};
const _o5 = s => { const x = Number(String(s || '').replace(',', '.')); return Number.isFinite(x) && x > 0 ? x : 0; };
let _og;
const save = async () => {
const _o0 = [];
if (_o8.buy.value.trim() && !G.crm.parseMoney(_o8.buy.value)) _o0.push('Giá mua (VD: 3,2 tỷ hoặc 850 triệu)');
for (const [k, label] of [['area', 'Diện tích'], ['value_m2', 'Giá trị ước tính'], ['rent', 'Giá thuê']]) if (_o8[k].value.trim() && !_o5(_o8[k].value)) _o0.push(label + ' (số lớn hơn 0)');
if (_o0.length) { K.toast('Chưa đọc được: ' + _o0.join(', '), 'warn'); return; }
if (!_oo.value && !_o8.unit.value.trim()) { K.toast('Chọn dự án hoặc nhập căn', 'warn'); return; }
const _os = {
id: v.id, project: _oo.value, unit: _o8.unit.value.trim(), area: _o5(_o8.area.value), buy_price: G.crm.parseMoney(_o8.buy.value) || 0, buy_date: _o8.buy_date.value,
value_m2: _o5(_o8.value_m2.value), value_src: _o8.value_src.value.trim(), rent: Math.round(_o5(_o8.rent.value) * 1e6), rent_src: _o8.rent_src.value.trim(),
progress: _o8.progress.value.trim(), progress_src: _o8.progress_src.value.trim(),
infra: _o8.infra.value.split('\n').map(l => l.split('|')).filter(x => x[0].trim()).map(x => ({ text: x[0].trim().slice(0, 200), url: (x[1] || '').trim() })),
};
if ((_os.value_m2 && !_os.value_src) || (_os.rent && !_os.rent_src)) { K.toast('Số ước tính phải ghi nguồn', 'warn'); return; }
const _o9 = await K.get('objects', _o3.id);
const list = (C.g2Of(_o9).assets || []).filter(x => x.id !== v.id).concat([_os]);
await G.patchG2(_o3.id, { assets: list });
_og.close(); K.toast('Đã lưu tài sản', 'success'); _oq();
};
_og = K.modal({ title: a ? 'Sửa tài sản' : 'Thêm tài sản', wide: true, testid: 'g2-asset-editor', body: [
K.field('Dự án', _oo), h('div', { class: 'bds-grid2' }, K.field('Căn', _o8.unit), K.field('Diện tích (m²)', _o8.area), K.field('Giá mua', _o8.buy), K.field('Ngày mua', _o8.buy_date)),
h('div', { class: 'bds-row' }, K.button('Lấy số từ Ghi nhận thị trường', fill, { testid: 'g2-a-fill', icon: 'refresh' })),
h('div', { class: 'bds-grid2' }, K.field('Giá trị ước tính (triệu/m²)', _o8.value_m2), K.field('Nguồn giá trị', _o8.value_src), K.field('Giá thuê (triệu/tháng)', _o8.rent), K.field('Nguồn giá thuê', _o8.rent_src),
K.field('Tiến độ', _o8.progress), K.field('Nguồn tiến độ', _o8.progress_src)),
K.field('Hạ tầng mới quanh căn', _o8.infra),
h('div', { class: 'bds-row bds-end' }, a ? K.button('Xoá', async () => {
if (!(await K.confirm({ title: 'Xoá tài sản', text: 'Xoá "' + ([K.projectName(v.project), v.unit].filter(Boolean).join(' – ') || 'tài sản này') + '" khỏi sổ tài sản của ' + (_o3.name || 'khách') + '?', ok: 'Xoá', kind: 'danger', testid: 'g2-a-del-c' }))) return;
const _o9 = await K.get('objects', _o3.id); await G.patchG2(_o3.id, { assets: (C.g2Of(_o9).assets || []).filter(x => x.id !== v.id) }); _og.close(); K.toast('Đã xoá tài sản', 'success'); _oq();
}, { kind: 'danger', testid: 'g2-a-del', icon: 'x' }) : null,
K.button('Lưu', save, { kind: 'primary', testid: 'g2-a-save' }))] });
}
await _oq();
}
function _or(_oh) {
return h('div', { class: 'g2-report', 'data-testid': 'g2-asset-report' }, _oh.lines.map(l => {
if (l.t === 'h1') return h('h2', null, l.v);
if (l.t === 'h2') return h('h3', null, l.v);
if (l.t === 'kv') return h('div', null, h('div', { class: 'kv' }, h('span', null, l.k), h('span', null, l.v)), l.src ? h('div', { class: 'g2-src' }, 'Nguồn: ' + l.src) : null);
return h('p', { class: l.t === 'note' ? 'g2-src' : 'bds-muted' }, l.v);
}));
}
function _on(rep) {
const _ob = h('div', { class: 'g2-print' }, rep.cloneNode(true));
document.body.appendChild(_ob);
document.body.classList.add('g2-printing');
const _o6 = () => { document.body.classList.remove('g2-printing'); _ob.remove(); window.removeEventListener('afterprint', _o6); };
window.addEventListener('afterprint', _o6);
setTimeout(() => { try { window.print(); } catch { } setTimeout(_o6, 1500); }, 50);
}
export async function reportPng(_oh) {
const W = 1080, pad = 64;
const _o4 = document.createElement('canvas');
const _oa = _o4.getContext('2d');
const font = (sz, w = 400) => `${w} ${sz}px "Be Vietnam Pro", -apple-system, "Segoe UI", Roboto, sans-serif`;
const _ot = (text, sz, w, maxW) => {
_oa.font = font(sz, w);
const _om = []; let _oe = '';
for (const word of String(text).split(/\s+/)) { const t = _oe ? _oe + ' ' + word : word; if (_oa.measureText(t).width > maxW && _oe) { _om.push(_oe); _oe = word; } else _oe = t; }
if (_oe) _om.push(_oe);
return _om;
};
const _ol = [];
let y = pad;
const push = (text, sz, w, color, x = pad, maxW = W - 2 * pad, gap = 10) => { for (const l of _ot(text, sz, w, maxW)) { _ol.push({ l, sz, w, color, x, y: y + sz }); y += sz + 8; } y += gap; };
for (const l of _oh.lines) {
if (l.t === 'h1') push(l.v, 44, 700, '#0F1E33', pad, W - 2 * pad, 6);
else if (l.t === 'sub') push(l.v, 24, 400, '#5F6979', pad, W - 2 * pad, 24);
else if (l.t === 'h2') { y += 10; _ol.push({ rule: true, y }); y += 18; push(l.v, 32, 700, '#A8842F'); }
else if (l.t === 'kv') { push(l.k + ': ' + l.v, 28, 500, '#0F1E33', pad, W - 2 * pad, 2); if (l.src) push('Nguồn: ' + l.src, 20, 400, '#5F6979', pad + 24, W - 2 * pad - 24, 12); else y += 8; }
else { y += 16; push(l.v, 22, 400, '#5F6979'); }
}
_o4.width = W; _o4.height = Math.max(600, y + pad);
_oa.fillStyle = '#F7F3EA'; _oa.fillRect(0, 0, W, _o4.height);
_oa.fillStyle = '#0F1E33'; _oa.fillRect(0, 0, W, 14);
_oa.fillStyle = '#C9A24A'; _oa.fillRect(0, 14, W, 4);
_oa.textBaseline = 'alphabetic';
for (const _oj of _ol) {
if (_oj.rule) { _oa.fillStyle = 'rgba(15,30,51,.12)'; _oa.fillRect(pad, _oj.y, W - 2 * pad, 2); continue; }
_oa.font = font(_oj.sz, _oj.w); _oa.fillStyle = _oj.color; _oa.fillText(_oj.l, _oj.x, _oj.y);
}
return new Promise(res => _o4.toBlob(b => res(b), 'image/png'));
}
export default {
manifest: { id: 'g2_taisan', title: 'Sổ tài sản của khách', icon: '🏠', screen: 'customers', order: 280, version: '0.1.0', status: 'thu-nghiem', pack: 'care',
help: 'Sổ tài sản của khách đã mua: giá trị ước tính có nguồn, giá thuê, tiến độ, hạ tầng mới → báo cáo quý xuất ảnh/PDF gửi khách.' },
mount,
async selftest(ctx) {
const _og = O.reportModel({ name: 'A' }, [{ id: '1', area: 70, buy_price: 3e9, value_m2: 50, value_src: 'x' }], { money: _oi => String(_oi) });
if (!_og.total) return { ok: false, details: 'Không tính được giá trị ước tính' };
return g2Selftest(ctx, mount);
},
};

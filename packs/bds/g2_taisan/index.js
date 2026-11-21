import { g2kit, h, g2Selftest } from '../g2_lib/ui.js';
import { kids } from '../_lib/kit.js';
import * as C from '../g2_lib/core.js';
import * as O from '../g2_lib/ops.js';
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
const _oo = new URLSearchParams(location.hash.split('?')[1] || '');
let cid = _oo.get('customer') || '';
el.innerHTML = '';
const box = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-taisan' }, G.head('Sổ tài sản của khách'), box));
async function _op() {
const customers = (await G.customers()).sort((a, b) => (G.crm.isPostSale(b) ? 1 : 0) - (G.crm.isPostSale(a) ? 1 : 0) || String(a.name).localeCompare(String(b.name), 'vi'));
if (!customers.some(_o2 => _o2.id === cid)) cid = ((customers.find(_o2 => (C.g2Of(_o2).assets || []).length) || customers.find(G.crm.isPostSale) || customers[0]) || {}).id || '';
box.innerHTML = '';
box.appendChild(K.field('Khách', G.customerSelect(customers, cid, { 'data-testid': 'g2-asset-customer', onchange: e => { cid = e.target.value; _op(); } })));
const _o2 = customers.find(x => x.id === cid);
if (!_o2) { box.appendChild(K.empty('Chưa có khách.')); return; }
const assets = C.g2Of(_o2).assets || [];
const _oc = h('div', { class: 'bds-list', 'data-testid': 'g2-assets' });
assets.forEach(a => {
const k = O.assetCalc(a);
_oc.appendChild(h('div', { class: 'bds-item', 'data-testid': 'g2-asset-' + a.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => _o6(_o2, a) }, h('strong', null, [K.projectName(a.project), a.unit].filter(Boolean).join(' – ') || 'Tài sản'),
h('span', { class: 'bds-sub' }, [k.area ? k.area + ' m²' : '', k.buy ? 'mua ' + K.money(k.buy) : '', k.value ? 'ước ' + K.money(k.value) : 'chưa có giá trị ước tính'].filter(Boolean).join(' · ')))));
});
if (!assets.length) _oc.appendChild(K.empty('Chưa có tài sản. Thêm căn khách đã mua để lập báo cáo quý.'));
box.append(_oc, h('div', { class: 'bds-row bds-wrap' }, K.button('+ Thêm tài sản', () => _o6(_o2, null), { kind: 'primary', testid: 'g2-asset-add' })));
if (assets.length) {
const me = await K.me();
const _og = O.reportModel(_o2, assets, { money: K.money, projectName: K.projectName, me });
const rep = _oq(_og);
box.append(...kids(h('h3', null, 'Báo cáo ' + _og.q.label),
_og.issues.length ? h('div', { class: 'bds-warn', 'data-testid': 'g2-asset-issues' }, 'Cần bổ sung nguồn: ' + _og.issues.join('; ')) : null,
rep,
h('div', { class: 'bds-row bds-wrap' },
K.button('Tải ảnh báo cáo', async () => { const _o1 = await reportPng(_og); G.download('bao-cao-tai-san-' + C.fold(_o2.name).replace(/\s+/g, '-') + '-q' + _og.q.q + '-' + _og.q.y + '.png', _o1); K.toast('Đã tải ảnh báo cáo', 'success'); }, { kind: 'primary', testid: 'g2-asset-png', icon: 'download' }),
K.button('Lưu PDF / In', () => _om(rep), { testid: 'g2-asset-pdf', title: 'Mở hộp in – chọn "Lưu thành PDF"', icon: 'print' }),
K.button('Soạn tin gửi khách', () => G.compose(_o2, 'Dạ em gửi anh/chị ' + G.crm.givenName(_o2.name) + ' báo cáo tài sản ' + _og.q.label + ' (ảnh đính kèm). Số liệu là ước tính tham khảo có ghi nguồn, anh/chị cần em giải thích phần nào em gọi ngay ạ.'), { icon: 'chat', testid: 'g2-asset-compose' }))));
}
}
async function _o6(_o2, a) {
const v = a || { id: 'a' + Date.now().toString(36) };
const _oj = await G.objectsOf('g2_mkt');
const _on = K.select([['', '— Dự án —'], ...K.projects().map(p => [p.id, p.name])], v.project || _o2.project || '', { 'data-testid': 'g2-a-project' });
const _ob = (val, attrs = {}) => h('input', { value: val ?? '', ...attrs });
const _o7 = {
unit: _ob(v.unit, { placeholder: 'VD: Căn 1208 toà A' }), area: _ob(v.area, { inputmode: 'decimal', 'data-testid': 'g2-a-area' }),
buy: _ob(v.buy_price ? K.money(v.buy_price) : '', { placeholder: 'VD: 3,2 tỷ', 'data-testid': 'g2-a-buy' }), buy_date: _ob(v.buy_date, { type: 'date' }),
value_m2: _ob(v.value_m2, { inputmode: 'decimal', placeholder: 'triệu/m²', 'data-testid': 'g2-a-vm2' }), value_src: _ob(v.value_src, { placeholder: 'Link hoặc tên nguồn (bắt buộc khi có số)', 'data-testid': 'g2-a-vsrc' }),
rent: _ob(v.rent ? v.rent / 1e6 : '', { inputmode: 'decimal', placeholder: 'triệu/tháng', 'data-testid': 'g2-a-rent' }), rent_src: _ob(v.rent_src, { placeholder: 'Nguồn giá thuê', 'data-testid': 'g2-a-rsrc' }),
progress: _ob(v.progress, { placeholder: 'VD: Đã cất nóc, hoàn thiện mặt ngoài' }), progress_src: _ob(v.progress_src, { placeholder: 'Nguồn tiến độ' }),
infra: h('textarea', { rows: 3, placeholder: 'Mỗi dòng: nội dung | link nguồn', 'data-testid': 'g2-a-infra' }, (v.infra || []).map(i => i.text + (i.url ? ' | ' + i.url : '')).join('\n')),
};
const fill = () => {
const _oe = O.latestObs(_oj, _on.value);
let _oh = 0;
if (_oe.price) { _o7.value_m2.value = _oe.price.value; _o7.value_src.value = _oe.price.url; _oh++; }
if (_oe.rent) { _o7.rent.value = _oe.rent.value; _o7.rent_src.value = _oe.rent.url; _oh++; }
if (_oe.progress) { _o7.progress.value = _oe.progress.note; _o7.progress_src.value = _oe.progress.url; _oh++; }
if (_oe.infra && !_o7.infra.value.includes(_oe.infra.url)) { _o7.infra.value = (_o7.infra.value ? _o7.infra.value + '\n' : '') + _oe.infra.note + ' | ' + _oe.infra.url; _oh++; }
K.toast(_oh ? 'Đã điền ' + _oh + ' số liệu từ Ghi nhận thị trường – kiểm tra lại' : 'Dự án chưa có ghi nhận thị trường (thêm ở "Thị trường quanh dự án")', _oh ? 'success' : 'info');
};
const _o4 = s => { const x = Number(String(s || '').replace(',', '.')); return Number.isFinite(x) && x > 0 ? x : 0; };
let _of;
const save = async () => {
const _o0 = [];
if (_o7.buy.value.trim() && !G.crm.parseMoney(_o7.buy.value)) _o0.push('Giá mua (VD: 3,2 tỷ hoặc 850 triệu)');
for (const [k, label] of [['area', 'Diện tích'], ['value_m2', 'Giá trị ước tính'], ['rent', 'Giá thuê']]) if (_o7[k].value.trim() && !_o4(_o7[k].value)) _o0.push(label + ' (số lớn hơn 0)');
if (_o0.length) { K.toast('Chưa đọc được: ' + _o0.join(', '), 'warn'); return; }
if (!_on.value && !_o7.unit.value.trim()) { K.toast('Chọn dự án hoặc nhập căn', 'warn'); return; }
const _or = {
id: v.id, project: _on.value, unit: _o7.unit.value.trim(), area: _o4(_o7.area.value), buy_price: G.crm.parseMoney(_o7.buy.value) || 0, buy_date: _o7.buy_date.value,
value_m2: _o4(_o7.value_m2.value), value_src: _o7.value_src.value.trim(), rent: Math.round(_o4(_o7.rent.value) * 1e6), rent_src: _o7.rent_src.value.trim(),
progress: _o7.progress.value.trim(), progress_src: _o7.progress_src.value.trim(),
infra: _o7.infra.value.split('\n').map(l => l.split('|')).filter(x => x[0].trim()).map(x => ({ text: x[0].trim().slice(0, 200), url: (x[1] || '').trim() })),
};
if ((_or.value_m2 && !_or.value_src) || (_or.rent && !_or.rent_src)) { K.toast('Số ước tính phải ghi nguồn', 'warn'); return; }
const _o8 = await K.get('objects', _o2.id);
const list = (C.g2Of(_o8).assets || []).filter(x => x.id !== v.id).concat([_or]);
await G.patchG2(_o2.id, { assets: list });
_of.close(); K.toast('Đã lưu tài sản', 'success'); _op();
};
_of = K.modal({ title: a ? 'Sửa tài sản' : 'Thêm tài sản', wide: true, testid: 'g2-asset-editor', body: [
K.field('Dự án', _on), h('div', { class: 'bds-grid2' }, K.field('Căn', _o7.unit), K.field('Diện tích (m²)', _o7.area), K.field('Giá mua', _o7.buy), K.field('Ngày mua', _o7.buy_date)),
h('div', { class: 'bds-row' }, K.button('Lấy số từ Ghi nhận thị trường', fill, { testid: 'g2-a-fill', icon: 'refresh' })),
h('div', { class: 'bds-grid2' }, K.field('Giá trị ước tính (triệu/m²)', _o7.value_m2), K.field('Nguồn giá trị', _o7.value_src), K.field('Giá thuê (triệu/tháng)', _o7.rent), K.field('Nguồn giá thuê', _o7.rent_src),
K.field('Tiến độ', _o7.progress), K.field('Nguồn tiến độ', _o7.progress_src)),
K.field('Hạ tầng mới quanh căn', _o7.infra),
h('div', { class: 'bds-row bds-end' }, a ? K.button('Xoá', async () => {
if (!(await K.confirm({ title: 'Xoá tài sản', text: 'Xoá "' + ([K.projectName(v.project), v.unit].filter(Boolean).join(' – ') || 'tài sản này') + '" khỏi sổ tài sản của ' + (_o2.name || 'khách') + '?', ok: 'Xoá', kind: 'danger', testid: 'g2-a-del-c' }))) return;
const _o8 = await K.get('objects', _o2.id); await G.patchG2(_o2.id, { assets: (C.g2Of(_o8).assets || []).filter(x => x.id !== v.id) }); _of.close(); K.toast('Đã xoá tài sản', 'success'); _op();
}, { kind: 'danger', testid: 'g2-a-del', icon: 'x' }) : null,
K.button('Lưu', save, { kind: 'primary', testid: 'g2-a-save' }))] });
}
await _op();
}
function _oq(_og) {
return h('div', { class: 'g2-report', 'data-testid': 'g2-asset-report' }, _og.lines.map(l => {
if (l.t === 'h1') return h('h2', null, l.v);
if (l.t === 'h2') return h('h3', null, l.v);
if (l.t === 'kv') return h('div', null, h('div', { class: 'kv' }, h('span', null, l.k), h('span', null, l.v)), l.src ? h('div', { class: 'g2-src' }, 'Nguồn: ' + l.src) : null);
return h('p', { class: l.t === 'note' ? 'g2-src' : 'bds-muted' }, l.v);
}));
}
function _om(rep) {
const _oa = h('div', { class: 'g2-print' }, rep.cloneNode(true));
document.body.appendChild(_oa);
document.body.classList.add('g2-printing');
const _o5 = () => { document.body.classList.remove('g2-printing'); _oa.remove(); window.removeEventListener('afterprint', _o5); };
window.addEventListener('afterprint', _o5);
setTimeout(() => { try { window.print(); } catch { } setTimeout(_o5, 1500); }, 50);
}
export async function reportPng(_og) {
const W = 1080, pad = 64;
const _o3 = document.createElement('canvas');
const _o9 = _o3.getContext('2d');
const font = (sz, w = 400) => `${w} ${sz}px "Be Vietnam Pro", -apple-system, "Segoe UI", Roboto, sans-serif`;
const _os = (text, sz, w, maxW) => {
_o9.font = font(sz, w);
const _ol = []; let _od = '';
for (const word of String(text).split(/\s+/)) { const t = _od ? _od + ' ' + word : word; if (_o9.measureText(t).width > maxW && _od) { _ol.push(_od); _od = word; } else _od = t; }
if (_od) _ol.push(_od);
return _ol;
};
const _ok = [];
let y = pad;
const push = (text, sz, w, color, x = pad, maxW = W - 2 * pad, gap = 10) => { for (const l of _os(text, sz, w, maxW)) { _ok.push({ l, sz, w, color, x, y: y + sz }); y += sz + 8; } y += gap; };
for (const l of _og.lines) {
if (l.t === 'h1') push(l.v, 44, 700, '#0F1E33', pad, W - 2 * pad, 6);
else if (l.t === 'sub') push(l.v, 24, 400, '#5F6979', pad, W - 2 * pad, 24);
else if (l.t === 'h2') { y += 10; _ok.push({ rule: true, y }); y += 18; push(l.v, 32, 700, '#A8842F'); }
else if (l.t === 'kv') { push(l.k + ': ' + l.v, 28, 500, '#0F1E33', pad, W - 2 * pad, 2); if (l.src) push('Nguồn: ' + l.src, 20, 400, '#5F6979', pad + 24, W - 2 * pad - 24, 12); else y += 8; }
else { y += 16; push(l.v, 22, 400, '#5F6979'); }
}
_o3.width = W; _o3.height = Math.max(600, y + pad);
_o9.fillStyle = '#F7F3EA'; _o9.fillRect(0, 0, W, _o3.height);
_o9.fillStyle = '#0F1E33'; _o9.fillRect(0, 0, W, 14);
_o9.fillStyle = '#C9A24A'; _o9.fillRect(0, 14, W, 4);
_o9.textBaseline = 'alphabetic';
for (const _oi of _ok) {
if (_oi.rule) { _o9.fillStyle = 'rgba(15,30,51,.12)'; _o9.fillRect(pad, _oi.y, W - 2 * pad, 2); continue; }
_o9.font = font(_oi.sz, _oi.w); _o9.fillStyle = _oi.color; _o9.fillText(_oi.l, _oi.x, _oi.y);
}
return new Promise(res => _o3.toBlob(b => res(b), 'image/png'));
}
export default {
manifest: { id: 'g2_taisan', title: 'Sổ tài sản của khách', icon: '🏠', screen: 'customers', order: 280, version: '0.1.0', status: 'thu-nghiem', pack: 'care',
help: 'Sổ tài sản của khách đã mua: giá trị ước tính có nguồn, giá thuê, tiến độ, hạ tầng mới → báo cáo quý xuất ảnh/PDF gửi khách.' },
mount,
async selftest(ctx) {
const _of = O.reportModel({ name: 'A' }, [{ id: '1', area: 70, buy_price: 3e9, value_m2: 50, value_src: 'x' }], { money: _oh => String(_oh) });
if (!_of.total) return { ok: false, details: 'Không tính được giá trị ước tính' };
return g2Selftest(ctx, mount);
},
};

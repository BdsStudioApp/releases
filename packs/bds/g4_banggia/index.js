import { g4kit, g4selftest, manifest as mf, h, G } from '../_lib/g4_ui.js';
import { ls } from '../../../core/xkit.f03faf0986.js';
export const manifest = mf('g4_banggia', 'Bảng giá thứ cấp', '📉', 130, 'So giá chào với giá sơ cấp và mặt bằng giá anh/chị nhập; báo căn rẻ, căn cắt lỗ và khách khớp.');
const _o1 = 'bds:g4:threshold';
const _o0 = ['Căn', 'Giá chào', 'Sơ cấp (tr/m²)', 'Mặt bằng', 'Chênh', 'Cờ', 'Khách khớp'];
export async function mount(el, ctx) {
const K = g4kit(ctx);
await K.loadDir();
const _oh = { threshold: Number(ls.get(_o1, 5)) || 5, onlyFlag: false };
el.innerHTML = '';
const _o3 = h('div', { class: 'bds-screen', 'data-testid': 'g4-banggia' });
el.appendChild(_o3);
async function _oc() {
const [objs, projects] = await Promise.all([K.list('objects'), K.projectsAll()]);
const refs = G.ofKind(objs, G.KIND.ref).filter((r) => r.status !== 'luu_tru');
const customers = objs.filter((o) => !o.kind || o.kind === 'customer');
const _o8 = G.ofKind(objs, G.KIND.listing).map((r) => ({ r, v: G.listingView(r) })).filter((x) => x.v.status === 'dang_chao' || x.v.status === 'giu_cho');
const _od = _o8.map((x) => ({ ...x, cmp: G.compareListing(x.v, { project: projects.find((p) => p.id === G.projectKey(projects, x.v.project)), refs, projects, threshold: _oh.threshold }),
matches: G.matchCustomers(x.v, customers, { projects }) }))
.sort((a, b) => (b.cmp.flags.length - a.cmp.flags.length) || ((a.cmp.vsMarket ?? 999) - (b.cmp.vsMarket ?? 999)));
const _o6 = _od.filter((x) => x.cmp.flags.length && x.matches.length);
_o3.innerHTML = '';
const th = h('input', { type: 'number', min: 1, max: 50, step: 1, value: _oh.threshold, style: 'width:80px', 'aria-label': 'Ngưỡng rẻ hơn mặt bằng (%)', 'data-testid': 'g4-threshold',
onchange: (e) => { const _o9 = Math.min(50, Math.max(1, Number(e.target.value) || 5)); _oh.threshold = _o9; ls.set(_o1, _o9); _oc(); } });
_o3.appendChild(K.head('Bảng giá thứ cấp', 'Giá sơ cấp lấy từ Bảng hàng dự án (giá niêm yết ước tính). Mặt bằng thứ cấp: số anh/chị tự nhập, có nguồn và ngày – app không tự đoán giá.',
K.button('+ Giá tham chiếu', () => openRef(ctx, K, null, _oc), { kind: 'primary', testid: 'g4-ref-add' })));
if (_o6.length) _o3.appendChild(h('div', { class: 'g4-disclaimer', 'data-testid': 'g4-alert' }, '🔔 ' + _o6.length + ' căn giá tốt có khách khớp nhu cầu: ',
_o6.slice(0, 5).map((x, i) => [i ? ', ' : '', h('a', { href: '#/sales/g4_giohang?open=' + encodeURIComponent(x.r.id) }, G.listingTitle(x.v, projects)), ' (' + x.matches.length + ' khách)'])));
_o3.appendChild(h('div', { class: 'g4-filters' }, h('label', { class: 'bds-row' }, 'Rẻ hơn mặt bằng từ ', th, ' %'),
h('label', { class: 'bds-check' }, h('input', { type: 'checkbox', checked: _oh.onlyFlag, 'data-testid': 'g4-only-flag', onchange: (e) => { _oh.onlyFlag = e.target.checked; _oc(); } }), ' Chỉ căn có cờ')));
const _og = _oh.onlyFlag ? _od.filter((x) => x.cmp.flags.length) : _od;
const _oa = (p) => (p === null || p === undefined ? '–' : h('span', { class: p < 0 ? 'g4-good' : p > 0 ? 'g4-bad' : '' }, (p > 0 ? '+' : '') + String(p).replace('.', ',') + '%'));
_o3.appendChild(K.card({ title: 'Căn đang chào (' + _og.length + ')', testid: 'g4-board', body: _og.length
? h('div', { class: 'g4-table-wrap' }, h('table', { class: 'g4-table' },
h('thead', null, h('tr', null, _o0.map((x) => h('th', null, x)))),
h('tbody', null, _og.map((x) => h('tr', { 'data-testid': 'g4-board-' + x.r.id },
h('td', { 'data-label': _o0[0] }, h('a', { href: '#/sales/g4_giohang?open=' + encodeURIComponent(x.r.id) }, G.listingTitle(x.v, projects)), h('div', { class: 'bds-muted' }, G.label(G.DEALS, x.v.deal))),
h('td', { 'data-label': _o0[1] }, x.v.price ? G.moneyExact(x.v.price) + (x.v.deal === 'cho_thue' ? '/tháng' : '') : '–', x.cmp.ppm2 ? h('div', { class: 'bds-muted' }, String(x.cmp.ppm2).replace('.', ',') + ' tr/m²') : null),
h('td', { 'data-label': _o0[2] }, x.cmp.primary ? x.cmp.primary.join('–') : '–', x.cmp.vsPrimaryLow !== null ? h('div', null, _oa(x.cmp.vsPrimaryLow), ' so giá thấp') : null),
h('td', { 'data-label': _o0[3] }, x.cmp.ref ? [x.v.deal === 'cho_thue' ? G.moneyExact(x.cmp.ref.rent) + '/tháng' : String(x.cmp.ref.ppm2).replace('.', ',') + ' tr/m²',
h('div', { class: 'bds-muted' }, (x.cmp.ref.unit_type || 'mọi loại') + ' · ' + G.ymdLabel(x.cmp.ref.as_of)), x.cmp.ref.source ? h('div', { class: 'bds-muted' }, G.safeUrl(x.cmp.ref.source) ? h('a', { href: G.safeUrl(x.cmp.ref.source), target: '_blank', rel: 'noopener noreferrer' }, 'nguồn') : x.cmp.ref.source) : null]
: h('span', { class: 'bds-muted' }, 'chưa có')),
h('td', { 'data-label': _o0[4] }, _oa(x.cmp.vsMarket)),
h('td', { 'data-label': _o0[5] }, x.cmp.flags.map((fl) => K.badge(G.FLAG_LABEL[fl] + (fl === 'cat_lo' && x.cmp.lossPct !== null ? ' ' + String(x.cmp.lossPct).replace('.', ',') + '%' : ''), 'success')),
x.cmp.notes.length ? h('div', { class: 'bds-muted' }, x.cmp.notes.join('; ')) : null),
h('td', { 'data-label': _o0[6] }, x.matches.length ? K.button(x.matches.length + ' khách', () => _of(K, x, projects), { icon: 'customers', testid: 'g4-matches-' + x.r.id }) : '–'))))))
: K.empty(_o8.length ? 'Không có căn có cờ.' : 'Chưa có căn đang chào. Thêm căn ở "Giỏ hàng thứ cấp".') }));
const _ob = refs.map(G.refView).sort((a, b) => String(b.as_of).localeCompare(String(a.as_of)));
_o3.appendChild(K.card({ title: 'Mặt bằng giá tham chiếu (' + _ob.length + ')', testid: 'g4-refs', body: [
h('p', { class: 'bds-muted' }, K.staff ? 'Số do người trong công ty nhập, có nguồn + ngày. Sale chỉ thấy số mình nhập.' : 'Số do anh/chị nhập (Quản trị/Quản lý thấy được).'),
_ob.length ? h('div', { class: 'bds-list' }, _ob.map((r) => h('div', { class: 'bds-item', 'data-testid': 'g4-ref-' + r.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => openRef(ctx, K, refs.find((x) => x.id === r.id), _oc) },
h('strong', null, G.projectName(projects, r.project) + ' · ' + (r.unit_type || 'mọi loại căn')),
h('span', { class: 'bds-sub' }, [G.label(G.DEALS, r.deal), r.deal === 'cho_thue' ? G.moneyExact(r.rent) + '/tháng' : String(r.ppm2).replace('.', ',') + ' triệu/m²',
'ngày ' + G.ymdLabel(r.as_of), 'nguồn: ' + (r.source.length > 60 ? r.source.slice(0, 60) + '…' : r.source), K.multiUser && K.staff ? K.ownerLabel(r.owner) : ''].filter(Boolean).join(' · '))))))
: K.empty('Chưa có giá tham chiếu. Bấm "+ Giá tham chiếu" để nhập mặt bằng giá (ví dụ từ tin đăng, giao dịch thật).'),
] }));
}
await _oc();
K.on(el, ['objects', 'projects'], _oc);
}
function _of(K, x, projects) {
K.sheet({ title: 'Khách khớp – ' + G.listingTitle(x.v, projects), testid: 'g4-match-sheet', body: [
h('p', { class: 'bds-muted' }, 'Gửi tin cho khách: mở Zalo, hoặc vào căn ở Giỏ hàng để gắn khách.'),
h('div', { class: 'bds-list' }, x.matches.map((m) => h('div', { class: 'bds-item' },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => K.openProfile(m.customer.id) }, h('strong', null, m.customer.name || 'Khách'),
h('span', { class: 'bds-sub' }, [m.customer.budget ? 'ngân sách ' + G.moneyExact(m.customer.budget) : '', m.reasons.join(', ')].filter(Boolean).join(' · '))),
h('div', { class: 'bds-acts' }, K.zaloBtn(m.customer, { short: true }), K.callBtn(m.customer, { short: true }))))),
] });
}
export async function openRef(ctx, K, row, refresh) {
const projects = await K.projectsAll();
const v = row ? G.refView(row) : { project: '', unit_type: '', deal: 'chuyen_nhuong', ppm2: 0, rent: 0, source: '', as_of: G.msToYmd(Date.now()) };
const rent = K.moneyInput(v.rent, { placeholder: 'Ví dụ: 18tr', 'data-testid': 'g4-r-rent' });
const _o5 = {
project: K.projectSelect(projects, v.project, { 'data-testid': 'g4-r-project' }),
unit_type: K.input(v.unit_type, { placeholder: 'Bỏ trống = mọi loại căn', 'data-testid': 'g4-r-type' }),
deal: K.select(G.DEALS, v.deal, { 'data-testid': 'g4-r-deal' }),
ppm2: K.input(v.ppm2 || '', { inputmode: 'decimal', placeholder: 'Ví dụ: 72,5', 'data-testid': 'g4-r-ppm2' }),
source: K.input(v.source, { placeholder: 'Link tin đăng / giao dịch, hoặc ghi rõ nguồn', 'data-testid': 'g4-r-source' }),
as_of: K.date(v.as_of, { max: G.todayYmd(), 'data-testid': 'g4-r-asof' }),
};
const ppmField = K.field('Mặt bằng chuyển nhượng (triệu/m²)', _o5.ppm2);
const rentField = K.field('Giá thuê mặt bằng (tiền/tháng)', rent.el);
const _oi = () => { const r = _o5.deal.value === 'cho_thue'; ppmField.style.display = r ? 'none' : ''; rentField.style.display = r ? '' : 'none'; };
_o5.deal.addEventListener('change', _oi); _oi();
const err = K.errorBox();
const save = async () => {
err.textContent = '';
if (!_o5.project.value) { err.textContent = 'Chọn dự án.'; return; }
const _o7 = _o5.deal.value === 'cho_thue';
const ppm2 = G.parseNumVi(_o5.ppm2.value), rv = rent.value;
if (!_o7 && !(ppm2 > 1 && ppm2 < 2000)) { err.textContent = 'Nhập giá triệu/m² (ví dụ 72,5).'; return; }
if (_o7 && !(rv > 0)) { err.textContent = 'Nhập giá thuê/tháng (ví dụ 18tr).'; return; }
if (!_o5.source.value.trim()) { err.textContent = 'Ghi nguồn của con số (link hoặc mô tả) – app không lưu giá không rõ nguồn.'; return; }
if (!G.YMD_RE.test(_o5.as_of.value)) { err.textContent = 'Chọn ngày của số liệu.'; return; }
const _o4 = G.dateProblem(_o5.as_of.value, 'Ngày số liệu', { notFuture: true });
if (_o4) { err.textContent = _o4; return; }
const _o2 = row || G.newRow(G.KIND.ref, K.user);
const name = 'Giá tham chiếu ' + G.projectName(projects, _o5.project.value) + (_o5.unit_type.value.trim() ? ' ' + _o5.unit_type.value.trim() : '');
await K.put('objects', G.withData(_o2, { deal: _o5.deal.value, ppm2: _o7 ? 0 : ppm2, rent: _o7 ? rv : 0, source: _o5.source.value.trim().slice(0, 500), as_of: _o5.as_of.value },
{ name: name.slice(0, 200), project: _o5.project.value, unit_type: _o5.unit_type.value.trim().slice(0, 20), status: 'active' }));
K.toast('Đã lưu giá tham chiếu', 'success'); _oe.close(); refresh && refresh();
};
const remove = async () => {
const ok = await K.confirm({ title: K.canErase ? 'Xoá giá tham chiếu?' : 'Bỏ dùng giá tham chiếu?', text: K.canErase ? 'Giá này sẽ không còn dùng để so sánh căn đang chào.' : 'Giá này chuyển sang Lưu trữ, không còn dùng để so sánh.', ok: K.canErase ? 'Xoá' : 'Bỏ dùng', kind: 'danger', testid: 'g4-r-remove-confirm' });
if (!ok) return;
await K.removeOrArchive(row); _oe.close(); refresh && refresh();
};
const _oe = K.sheet({ title: row ? 'Sửa giá tham chiếu' : 'Thêm giá tham chiếu', testid: 'g4-ref-form', body: [
h('div', { class: 'g4-grid' }, K.field('Dự án', _o5.project), K.field('Loại căn', _o5.unit_type), K.field('Hình thức', _o5.deal), ppmField, rentField, K.field('Ngày số liệu', _o5.as_of)),
K.field('Nguồn', _o5.source, 'Bắt buộc. Ví dụ: link tin đăng, "giao dịch thật căn B-08.10 ngày 02/11".'),
err,
h('div', { class: 'bds-row bds-end bds-wrap' }, row ? K.button(K.canErase ? 'Xoá' : 'Bỏ dùng', remove, { kind: 'danger', icon: K.canErase ? 'x' : 'disk', testid: 'g4-r-remove' }) : null, K.button('Lưu', save, { kind: 'primary', testid: 'g4-r-save' })),
] });
}
export async function selftest(ctx) { return g4selftest(ctx, (div) => mount(div, ctx)); }
export default { manifest, mount, selftest };

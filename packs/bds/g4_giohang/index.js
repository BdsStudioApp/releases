import { g4kit, g4selftest, manifest as mf, h, G } from '../_lib/g4_ui.js';
export const manifest = mf('g4_giohang', 'Giỏ hàng thứ cấp', '🏷️', 120, 'Căn chuyển nhượng, cho thuê: chủ nhà, giá, phí môi giới, ảnh, khách khớp nhu cầu.');
export async function mount(el, ctx) {
const K = g4kit(ctx);
await K.loadDir();
const _oq = { q: '', deal: '', status: 'open', scope: 'all' };
el.innerHTML = '';
const _o3 = h('div', { class: 'bds-screen', 'data-testid': 'g4-giohang' });
el.appendChild(_o3);
async function _ol() {
const [objs, projects] = await Promise.all([K.list('objects'), K.projectsAll()]);
const _on = G.ofKind(objs, G.KIND.listing);
const refs = G.ofKind(objs, G.KIND.ref).filter((r) => r.status !== 'luu_tru');
_o3.innerHTML = '';
_o3.appendChild(K.head('Giỏ hàng thứ cấp', 'Căn chuyển nhượng, cho thuê do anh/chị nhận bán – giá, phí môi giới, ảnh, khách khớp.',
K.button('+ Thêm căn', () => openListing(ctx, K, null, _ol), { kind: 'primary', testid: 'g4-listing-add' })));
_o3.appendChild(h('div', { class: 'g4-filters' },
K.search(_oq.q, (v) => { _oq.q = v; _ol(); }, 'Tìm mã căn, dự án, chủ nhà'),
K.select([['', 'Chuyển nhượng + cho thuê'], ...G.DEALS], _oq.deal, { 'aria-label': 'Hình thức', onchange: (e) => { _oq.deal = e.target.value; _ol(); } }),
K.select([['open', 'Đang chào + giữ chỗ'], ['', 'Mọi trạng thái'], ...G.LISTING_STATUS], _oq.status, { 'aria-label': 'Trạng thái', 'data-testid': 'g4-status-filter', onchange: (e) => { _oq.status = e.target.value; _ol(); } }),
K.scopeSelect(_oq.scope, (v) => { _oq.scope = v; _ol(); })));
let list = G.scopeRows(_on, _oq.scope, K.user).map((r) => ({ r, v: G.listingView(r) }));
if (_oq.deal) list = list.filter((x) => x.v.deal === _oq.deal);
if (_oq.status === 'open') list = list.filter((x) => x.v.status === 'dang_chao' || x.v.status === 'giu_cho');
else if (_oq.status) list = list.filter((x) => x.v.status === _oq.status);
list = list.filter((x) => G.searchRows([x.r], _oq.q, (r) => [r.name, x.v.unit_code, G.projectName(projects, r.project), r.unit_type, x.v.owner_name, r.phone, r.note]).length);
list.sort((_o0, b) => (Number(b.r.updated_at) || 0) - (Number(_o0.r.updated_at) || 0));
const customers = objs.filter((o) => !o.kind || o.kind === 'customer');
_o3.appendChild(K.card({ title: 'Căn (' + list.length + ')', testid: 'g4-listing-list', body: list.length
? h('div', { class: 'bds-list' }, list.map(({ r, v }) => {
const _o4 = G.compareListing(v, { project: projects.find((p) => p.id === G.projectKey(projects, v.project)), refs, projects });
const _oh = G.matchCustomers(v, customers, { projects });
const _of = v.legal ? G.legalProgress(v.legal) : null;
const _o5 = G.commissionAmount({ price: v.price, ...v.commission });
return h('div', { class: 'bds-item', 'data-testid': 'g4-listing-' + r.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => openListing(ctx, K, r, _ol) },
h('strong', null, G.listingTitle(v, projects)),
h('span', { class: 'bds-sub' }, [G.label(G.DEALS, v.deal), v.price ? G.moneyExact(v.price) + (v.deal === 'cho_thue' ? '/tháng' : '') : 'chưa có giá',
v.area ? v.area + ' m²' : '', _o4.ppm2 ? G.numVi(_o4.ppm2) + ' tr/m²' : '', _o5 ? 'phí MG ' + G.moneyExact(_o5) : '', K.multiUser && K.staff ? K.ownerLabel(r.owner) : ''].filter(Boolean).join(' · ')),
h('span', { class: 'bds-row bds-wrap' }, K.badge(G.label(G.LISTING_STATUS, v.status), v.status === 'dang_chao' ? 'info' : 'muted'),
_o4.flags.map((fl) => K.badge(G.FLAG_LABEL[fl], 'success')),
_of ? K.badge('Pháp lý: ' + G.VERDICT_LABEL[_of.verdict], _of.verdict === 'co_van_de' ? 'danger' : _of.verdict === 'da_kiem' ? 'success' : 'muted') : null,
_oh.length ? K.badge(_oh.length + ' khách khớp', 'warn') : null)));
}))
: K.empty(_on.length ? 'Không có căn khớp bộ lọc.' : 'Chưa có căn nào. Bấm "+ Thêm căn" để nhập căn chủ nhà gửi bán / cho thuê.') }));
}
await _ol();
K.on(el, ['objects', 'projects'], _ol);
const _oj = K.openQuery();
if (_oj && el.getClientRects().length) { const r = await K.get('objects', _oj); if (r && r.kind === G.KIND.listing) openListing(ctx, K, r, _ol); }
}
export async function openListing(ctx, K, row, refresh) {
const [objs, projects] = await Promise.all([K.list('objects'), K.projectsAll()]);
const _od = !row;
const v = row ? G.listingView(row) : G.listingView({ status: 'dang_chao', data: '{}' });
const owners = G.ofKind(objs, G.KIND.partner).filter((p) => G.dataOf(p).role === 'chu_nha' && p.status !== 'luu_tru');
const price = K.moneyInput(v.price, { 'data-testid': 'g4-l-price', placeholder: 'Ví dụ: 4,2 tỷ hoặc 18tr (giá thuê/tháng)' });
const _o2 = K.moneyInput(v.bought_price, { placeholder: 'Nếu chủ nhà cho biết' });
const _oc = {
name: K.input(row && row.name, { placeholder: 'Tên gọi (bỏ trống: tự ghép mã căn + dự án)' }),
unit_code: K.input(v.unit_code, { placeholder: 'A-12.05', 'data-testid': 'g4-l-unit' }),
project: K.projectSelect(projects, v.project, { 'data-testid': 'g4-l-project' }),
unit_type: K.input(v.unit_type, { placeholder: '1N, 2N, 2N+, 3N…', 'data-testid': 'g4-l-type' }),
deal: K.select(G.DEALS, v.deal, { 'data-testid': 'g4-l-deal' }),
area: K.input(v.area || '', { inputmode: 'decimal', placeholder: 'm² thông thuỷ', 'data-testid': 'g4-l-area' }),
floor: K.input(v.floor), direction: K.input(v.direction, { placeholder: 'Hướng ban công / view' }),
partner: K.select([['', '– Chủ nhà trong Sổ đối tác –'], ...owners.map((p) => [p.id, p.name + (p.phone ? ' · ' + K.phone(p.phone) : '')])], v.partner_id),
owner_name: K.input(v.owner_name, { placeholder: 'Tên chủ nhà (nếu chưa có trong Sổ đối tác)' }),
phone: K.input(v.phone, { type: 'tel', inputmode: 'tel', placeholder: 'SĐT chủ nhà' }),
ctype: K.select(G.COMMISSION_TYPES, v.commission.type || 'pct', { 'data-testid': 'g4-l-ctype' }),
cval: K.input(v.commission.type === 'amount' ? G.moneyText(v.commission.value) : (v.commission.value || ''), { inputmode: 'decimal', 'data-testid': 'g4-l-cval', placeholder: '1 (%), 50tr, 1 (tháng)' }),
status: K.select(G.LISTING_STATUS, v.status, { 'data-testid': 'g4-l-status' }),
photos: K.linksInput(v.photos, { 'data-testid': 'g4-l-photos' }),
note: K.textarea(v.note, { placeholder: 'Nội thất, sổ, thời gian xem nhà…' }),
};
const _o6 = h('small', { class: 'bds-field-h', 'data-testid': 'g4-l-com' });
const _oa = () => (_oc.ctype.value === 'amount' ? G.parseMoney(_oc.cval.value) : G.parseNumVi(_oc.cval.value));
const _op = () => { const _o0 = G.commissionAmount({ price: price.value, type: _oc.ctype.value, value: _oa() }); _o6.textContent = _o0 ? '= ' + G.moneyExact(_o0) : ''; };
[price.input, _oc.cval].forEach((i) => i.addEventListener('input', _op)); _oc.ctype.addEventListener('change', _op); _op();
const err = K.errorBox();
const save = async () => {
err.textContent = '';
if (!_oc.project.value && !_oc.name.value.trim() && !_oc.unit_code.value.trim()) { err.textContent = 'Chọn dự án hoặc nhập mã căn / tên gọi.'; return; }
const _ok = price.value;
if (price.input.value.trim() && !_ok) { err.textContent = 'Giá chưa đúng, ví dụ: 4,2 tỷ hoặc 18tr.'; return; }
const area = _oc.area.value.trim() ? G.parseNumVi(_oc.area.value) : 0;
if (_oc.area.value.trim() && !(area > 5 && area < 2000)) { err.textContent = 'Diện tích chưa đúng (m²).'; return; }
const _o9 = _oc.cval.value.trim() ? _oa() : 0;
if (_oc.cval.value.trim() && !(_o9 > 0)) { err.textContent = 'Phí môi giới chưa đúng.'; return; }
const _o7 = G.commissionProblem({ type: _oc.ctype.value, value: _o9, price: _ok });
if (_o7) { err.textContent = _o7; return; }
const _of = G.linkProblem(_oc.photos.value);
if (_of) { err.textContent = _of; return; }
const photos = G.parseLinks(_oc.photos.value);
const _o1 = row || G.newRow(G.KIND.listing, K.user);
const saved = await K.put('objects', G.withData(_o1, {
deal: _oc.deal.value, unit_code: _oc.unit_code.value.trim().slice(0, 40), price: _ok || 0, area: area || 0, bought_price: _o2.value || 0,
floor: _oc.floor.value.trim().slice(0, 20), direction: _oc.direction.value.trim().slice(0, 80), partner_id: _oc.partner.value, owner_name: _oc.owner_name.value.trim().slice(0, 120),
commission: { type: _oc.ctype.value, value: _o9 || 0 }, photos,
}, {
name: _oc.name.value.trim().slice(0, 200), project: _oc.project.value, unit_type: _oc.unit_type.value.trim().slice(0, 20), status: _oc.status.value,
phone: _oc.phone.value.trim() ? G.normPhone(_oc.phone.value) : '', need: _oc.deal.value === 'cho_thue' ? 'cho thuê' : 'bán', note: _oc.note.value.trim().slice(0, 2000),
}));
const note = G.linkNote(_oc.photos.value);
K.toast((_od ? 'Đã thêm căn vào giỏ hàng' : 'Đã lưu') + note, note ? 'warn' : 'success');
_oo.close(); refresh && refresh();
if (_od) K.afterClose(() => openListing(ctx, K, saved, refresh));
};
const remove = async () => {
const ok = await K.confirm({ title: K.canErase ? 'Xoá căn?' : 'Lưu trữ căn?', text: K.canErase ? 'Xoá căn khỏi giỏ hàng.' : 'Căn chuyển sang Lưu trữ.', ok: K.canErase ? 'Xoá' : 'Lưu trữ', kind: 'danger', testid: 'g4-l-remove' });
if (!ok) return;
await K.removeOrArchive(row); _oo.close(); refresh && refresh();
};
const matchBox = h('div', { 'data-testid': 'g4-l-matches' });
const _ob = async () => {
matchBox.innerHTML = '';
if (!row) { matchBox.appendChild(K.empty('Lưu căn trước để xem khách khớp nhu cầu.')); return; }
const _o8 = await K.get('objects', row.id) || row;
const _og = G.listingView(_o8);
const customers = (await K.list('objects')).filter((o) => !o.kind || o.kind === 'customer');
const _oe = customers.filter((c) => _og.customer_ids.includes(c.id));
const _oh = G.matchCustomers(_og, customers, { projects }).filter((m) => !_og.customer_ids.includes(m.customer.id));
const _or = async (c, on) => {
const _oi = await K.get('objects', row.id) || _o8;
const ids = new Set(G.listingView(_oi).customer_ids);
if (on) ids.add(c.id); else ids.delete(c.id);
await K.put('objects', G.withData(_oi, { customer_ids: [...ids].slice(0, 100) }));
if (on) await K.logEvent(c.id, 'note', 'Gắn căn thứ cấp: ' + G.listingTitle(_og, projects) + (_og.price ? ' – ' + G.moneyExact(_og.price) : ''));
_ob();
};
const _om = (c, reasons, on) => h('div', { class: 'bds-item', 'data-testid': 'g4-match-' + c.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => K.openProfile(c.id) }, h('strong', null, c.name || 'Khách'),
h('span', { class: 'bds-sub' }, [c.need, c.budget ? 'ngân sách ' + G.moneyExact(c.budget) : '', reasons].filter(Boolean).join(' · '))),
h('div', { class: 'bds-acts' }, K.zaloBtn(c, { short: true }), K.button(on ? 'Bỏ gắn' : 'Gắn', () => _or(c, !on), { icon: on ? 'minus' : 'link', testid: (on ? 'g4-unlink-' : 'g4-link-') + c.id })));
matchBox.appendChild(h('p', { class: 'bds-muted' }, 'Ghép theo quy tắc: cùng nhu cầu (mua ↔ chuyển nhượng, thuê ↔ cho thuê), cùng dự án/loại căn nếu khách có ghi, giá không quá ngân sách 10%.'));
if (_oe.length) matchBox.appendChild(h('div', { class: 'bds-list' }, _oe.map((c) => _om(c, 'đã gắn', true))));
matchBox.appendChild(_oh.length ? h('div', { class: 'bds-list' }, _oh.map((m) => _om(m.customer, m.reasons.join(', '), false)))
: K.empty('Chưa có khách khớp. Khách cần ghi nhu cầu "mua"/"thuê", dự án hoặc ngân sách.'));
};
await _ob();
const _oo = K.sheet({ title: _od ? 'Thêm căn thứ cấp' : G.listingTitle(v, projects), testid: 'g4-listing-form', body: [
h('div', { class: 'g4-grid' }, K.field('Mã căn', _oc.unit_code), K.field('Dự án', _oc.project), K.field('Loại căn', _oc.unit_type), K.field('Hình thức', _oc.deal),
K.field('Giá chào (bán: tổng giá · thuê: tiền/tháng)', price.el), K.field('Diện tích (m²)', _oc.area), K.field('Tầng', _oc.floor), K.field('Hướng / view', _oc.direction),
K.field('Giá chủ nhà mua vào', _o2.el, 'Có số này app mới gắn được cờ "Cắt lỗ".'), K.field('Trạng thái', _oc.status)),
K.field('Tên gọi', _oc.name),
h('h3', { class: 'g4-sec' }, 'Chủ nhà'),
h('div', { class: 'g4-grid' }, K.field('Chủ nhà (Sổ đối tác)', _oc.partner), K.field('Hoặc tên chủ nhà', _oc.owner_name), K.field('SĐT chủ nhà', _oc.phone)),
h('h3', { class: 'g4-sec' }, 'Phí môi giới'),
h('div', { class: 'g4-grid' }, K.field('Cách tính', _oc.ctype), K.field('Mức', h('span', { class: 'g4-money' }, _oc.cval, _o6))),
K.field('Ảnh căn (link Google Drive)', _oc.photos, 'App chỉ lưu link, ảnh nằm trên Drive của anh/chị.'),
K.links(v.photos, { prefix: 'Ảnh', testid: 'g4-l-photo-links' }),
K.field('Ghi chú', _oc.note),
err,
h('div', { class: 'bds-row bds-end bds-wrap' },
row ? K.button('Kiểm tra pháp lý', () => { _oo.close(); K.afterClose(() => K.nav('sales/g4_phaply?open=' + encodeURIComponent(row.id))); }, { testid: 'g4-l-legal' }) : null,
row ? K.button(K.canErase ? 'Xoá' : 'Lưu trữ', remove, { kind: 'danger', icon: K.canErase ? 'x' : 'disk', testid: 'g4-l-delete' }) : null,
K.button('Lưu', save, { kind: 'primary', testid: 'g4-l-save' })),
h('h3', { class: 'g4-sec' }, 'Khách khớp nhu cầu'), matchBox,
] });
}
export async function selftest(ctx) { return g4selftest(ctx, (div) => mount(div, ctx)); }
export default { manifest, mount, selftest };

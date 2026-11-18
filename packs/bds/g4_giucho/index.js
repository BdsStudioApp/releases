import { g4kit, g4selftest, manifest as mf, h, G } from '../_lib/g4_ui.js';
export const manifest = mf('g4_giucho', 'Giữ chỗ & Hoa hồng', '🎟️', 150, 'Giữ chỗ, Priority, ảnh uỷ nhiệm chi, hạn đóng tiền, hoa hồng và thưởng nóng theo từng sale.');
export async function mount(el, ctx) {
const K = g4kit(ctx);
await K.loadDir();
const _ow = { scope: 'all', showDone: false };
el.innerHTML = '';
const _o4 = h('div', { class: 'bds-screen', 'data-testid': 'g4-giucho' });
el.appendChild(_o4);
async function _oq() {
const [rows, projects] = await Promise.all([K.objects(G.KIND.booking), K.projectsAll()]);
const _ot = G.scopeRows(rows, _ow.scope, K.user);
const _o12 = _ot.map((r) => G.bookingView(r));
const now = Date.now();
_o4.innerHTML = '';
_o4.appendChild(K.head('Giữ chỗ & Hoa hồng', 'Phiếu giữ chỗ / Priority / cọc, uỷ nhiệm chi, hạn, hoa hồng và thưởng nóng.',
K.button('+ Giữ chỗ mới', () => openBooking(ctx, K, null, _oq), { kind: 'primary', testid: 'g4-booking-add' })));
_o4.appendChild(h('div', { class: 'g4-filters' }, K.scopeSelect(_ow.scope, (v) => { _ow.scope = v; _oq(); }),
h('label', { class: 'bds-check' }, h('input', { type: 'checkbox', checked: _ow.showDone, onchange: (e) => { _ow.showDone = e.target.checked; _oq(); } }), ' Hiện phiếu đã ký / huỷ')));
const _oe = G.openDeadlines(_o12, now);
_o4.appendChild(K.card({ title: 'Hạn sắp tới (' + _oe.length + ')', testid: 'g4-deadlines', cls: _oe.some((x) => x.overdue) ? 'bds-tone-card-danger' : '', body: _oe.length
? h('div', { class: 'bds-list' }, _oe.slice(0, 30).map((x) => h('div', { class: 'bds-item', 'data-testid': 'g4-dl-' + x.booking.id + '-' + x.deadline.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => openBooking(ctx, K, rows.find((r) => r.id === x.booking.id), _oq) },
h('strong', null, (x.overdue ? '⚠️ ' : '⏰ ') + G.ymdLabel(x.deadline.date) + ' · ' + (x.deadline.label || 'Hạn') + (x.overdue ? ' (quá hạn)' : '')),
h('span', { class: 'bds-sub' }, [_o11(x.booking, projects), x.booking.customer_name, x.deadline.amount ? G.moneyExact(x.deadline.amount) : ''].filter(Boolean).join(' · '))),
K.button('✓ Xong', () => _om(K, rows.find((r) => r.id === x.booking.id), x.deadline.id, _oq), { testid: 'g4-dl-done-' + x.deadline.id }))))
: K.empty('Không có hạn nào đang chờ.') }));
const list = _o12.filter((_o3) => _ow.showDone || (_o3.status !== 'da_ky' && _o3.status !== 'huy'));
_o4.appendChild(K.card({ title: 'Phiếu giữ chỗ (' + list.length + ')', testid: 'g4-booking-list', body: list.length
? h('div', { class: 'bds-list' }, list.map((_o3) => {
const _o7 = G.bookingCommission(_o3);
return h('div', { class: 'bds-item', 'data-testid': 'g4-booking-' + _o3.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => openBooking(ctx, K, rows.find((r) => r.id === _o3.id), _oq) },
h('strong', null, _o11(_o3, projects)),
h('span', { class: 'bds-sub' }, [G.label(G.BOOKING_KINDS, _o3.kind), _o3.customer_name, _o3.amount ? G.moneyExact(_o3.amount) : '', _o3.proofs.length ? '📎 ' + _o3.proofs.length + ' UNC' : 'chưa có UNC',
_o7 ? 'hoa hồng ' + G.moneyExact(_o7) + ' (' + G.label(G.PAYOUT_STATUS, _o3.commission.status) + ')' : '', Number(_o3.bonus.amount) ? 'thưởng ' + G.moneyExact(_o3.bonus.amount) : '',
K.multiUser && K.staff ? K.ownerLabel(_o3.owner) : ''].filter(Boolean).join(' · '))),
K.badge(G.label(G.BOOKING_STATUS, _o3.status), _o3.status === 'huy' ? 'muted' : _o3.status === 'da_ky' ? 'success' : 'info'));
}))
: K.empty('Chưa có phiếu giữ chỗ. Bấm "+ Giữ chỗ mới".') }));
const _oy = G.commissionSummary(_ot);
_o4.appendChild(K.card({ title: 'Hoa hồng & thưởng nóng', testid: 'g4-commission', body: _oy.length
? h('div', { class: 'g4-table-wrap' }, h('table', { class: 'g4-table' },
h('thead', null, h('tr', null, _o0.map((x) => h('th', null, x)))),
h('tbody', null, _oy.map((_or) => h('tr', { 'data-testid': 'g4-sum-row' },
h('td', { 'data-label': _o0[0] }, K.ownerLabel(_or.owner) || (_or.owner ? 'Người dùng khác' : 'Chưa gán')), h('td', { 'data-label': _o0[1] }, String(_or.count)),
h('td', { 'data-label': _o0[2] }, G.moneyExact(_or.commission)), h('td', { 'data-label': _o0[3] }, G.moneyExact(_or.bonus)), h('td', { class: 'g4-good', 'data-label': _o0[4] }, G.moneyExact(_or.received)),
h('td', { 'data-label': _o0[5] }, G.moneyExact(_or.waiting)), h('td', { 'data-label': _o0[6] }, G.moneyExact(_or.notyet)))))))
: K.empty('Chưa có hoa hồng nào (phiếu huỷ không tính).') }));
}
await _oq();
K.on(el, ['objects', 'reminders'], _oq);
const _oo = K.openQuery();
if (_oo && el.getClientRects().length) { const r = await K.get('objects', _oo); if (r && r.kind === G.KIND.booking) openBooking(ctx, K, r, _oq); }
}
const _o0 = ['Người phụ trách', 'Phiếu', 'Hoa hồng', 'Thưởng nóng', 'Đã nhận', 'Chờ nhận', 'Chưa đến hạn'];
function _o11(_o3, projects) { return _o3.name || [_o3.unit_code, G.projectName(projects, _o3.project)].filter(Boolean).join(' · ') || 'Phiếu giữ chỗ'; }
async function _o10(K, row) {
const _o3 = G.bookingView(row);
const existing = (await K.listAll('reminders')).filter((r) => String(r.id).startsWith('g4r_' + _o3.id + '_'));
const title = G.label(G.BOOKING_KINDS, _o3.kind) + ' ' + (_o3.unit_code || _o3.name || '') + (_o3.customer_name ? ' (' + _o3.customer_name + ')' : '');
const canDelete = !(K.user && K.user.role === 'ctv');
for (const r of G.deadlineReminders(_o3, existing, { title: title.trim(), canDelete })) await K.put('reminders', r);
}
async function _om(K, row, dlId, refresh) {
const cur = (await K.get('objects', row.id)) || row;
const _o3 = G.bookingView(cur);
const deadlines = _o3.deadlines.map((d) => (d.id === dlId ? { ...d, done: true } : d));
const _os = await K.put('objects', G.withData(cur, { deadlines }));
await _o10(K, _os);
K.toast('Đã đánh dấu xong', 'success'); refresh && refresh();
}
export async function openBooking(ctx, K, row, refresh) {
const [objs, projects] = await Promise.all([K.list('objects'), K.projectsAll()]);
const _oi = !row;
const _o3 = row ? G.bookingView(row) : G.bookingView({ status: 'dang_giu', data: '{}' });
const customers = objs.filter((o) => (!o.kind || o.kind === 'customer') && !Number(o.deleted));
const listings = G.ofKind(objs, G.KIND.listing).filter((r) => r.status !== 'luu_tru');
const amount = K.moneyInput(_o3.amount, { 'data-testid': 'g4-b-amount', placeholder: 'Ví dụ: 50tr' });
const price = K.moneyInput(_o3.price, { 'data-testid': 'g4-b-price', placeholder: 'Giá căn để tính hoa hồng' });
const bonus = K.moneyInput(_o3.bonus.amount, { 'data-testid': 'g4-b-bonus', placeholder: 'Ví dụ: 10tr' });
const _ox = (opts, cur) => opts.map(([v, l]) => [v, l]).filter(([v]) => K.staff || v !== 'da_chi' || cur === 'da_chi');
const _oh = {
kind: K.select(G.BOOKING_KINDS, _o3.kind, { 'data-testid': 'g4-b-kind' }),
status: K.select(G.BOOKING_STATUS, _o3.status, { 'data-testid': 'g4-b-status' }),
customer: K.select([['', '– Chọn khách –'], ...customers.map((c) => [c.id, c.name + (c.phone ? ' · ' + K.phone(c.phone) : '')])], _o3.customer_id, { 'data-testid': 'g4-b-customer' }),
customer_name: K.input(_o3.customer_name, { placeholder: 'Hoặc gõ tên khách', 'data-testid': 'g4-b-cname' }),
listing: K.select([['', '– Căn dự án (không thuộc giỏ thứ cấp) –'], ...listings.map((r) => [r.id, G.listingTitle(G.listingView(r), projects)])], _o3.listing_id, { 'data-testid': 'g4-b-listing' }),
project: K.projectSelect(projects, _o3.project, { 'data-testid': 'g4-b-project' }),
unit_code: K.input(_o3.unit_code, { placeholder: 'Mã căn / mã Priority', 'data-testid': 'g4-b-unit' }),
unit_type: K.input(_o3.unit_type, { placeholder: '2N, 3N…' }),
paid_at: K.date(_o3.paid_at, { max: G.todayYmd(), 'data-testid': 'g4-b-paidat' }),
proofs: K.linksInput(_o3.proofs, { 'data-testid': 'g4-b-proofs', placeholder: 'Link ảnh uỷ nhiệm chi trên Google Drive, mỗi dòng một link' }),
ctype: K.select(G.COMMISSION_TYPES.filter((x) => x[0] !== 'months'), _o3.commission.type === 'amount' ? 'amount' : 'pct', { 'data-testid': 'g4-b-ctype' }),
cval: K.input(_o3.commission.type === 'amount' ? G.moneyText(_o3.commission.value) : (_o3.commission.value || ''), { inputmode: 'decimal', placeholder: '1,5 (%) hoặc 60tr', 'data-testid': 'g4-b-cval' }),
cstatus: K.select(_ox(G.PAYOUT_STATUS, _o3.commission.status), _o3.commission.status, { 'data-testid': 'g4-b-cstatus' }),
bnote: K.input(_o3.bonus.note, { placeholder: 'Thưởng nóng của CĐT/sàn – ghi rõ đợt' }),
bstatus: K.select(_ox(G.PAYOUT_STATUS, _o3.bonus.status), _o3.bonus.status, { 'data-testid': 'g4-b-bstatus' }),
note: K.textarea(_o3.note),
};
if (!K.staff && (_o3.commission.status === 'da_chi')) _oh.cstatus.disabled = true;
if (!K.staff && (_o3.bonus.status === 'da_chi')) _oh.bstatus.disabled = true;
_oh.listing.addEventListener('change', () => {
const r = listings.find((x) => x.id === _oh.listing.value); if (!r) return;
const _ol = G.listingView(r);
_oh.project.value = G.projectKey(projects, _ol.project) || ''; _oh.unit_code.value = _ol.unit_code; _oh.unit_type.value = _ol.unit_type;
if (!price.input.value && _ol.price) { price.input.value = G.moneyText(_ol.price); price.input.dispatchEvent(new Event('input')); }
});
const depositNote = h('p', { class: 'g4-disclaimer', 'data-testid': 'g4-b-legal-note' }, '⚖️ ' + G.DEPOSIT_NOTE);
const _oz = () => { depositNote.style.display = _oh.listing.value ? 'none' : ''; };
_oh.listing.addEventListener('change', _oz); _oz();
const _o8 = h('small', { class: 'bds-field-h', 'data-testid': 'g4-b-com' });
const _od = () => (_oh.ctype.value === 'amount' ? G.parseMoney(_oh.cval.value) : G.parseNumVi(_oh.cval.value));
const _ov = () => { const _o1 = G.commissionAmount({ price: price.value, type: _oh.ctype.value, value: _od() }); _o8.textContent = _o1 ? '= ' + G.moneyExact(_o1) : ''; };
[price.input, _oh.cval].forEach((i) => i.addEventListener('input', _ov)); _oh.ctype.addEventListener('change', _ov); _ov();
const _oe = _o3.deadlines.map((d) => ({ ...d }));
const dlBox = h('div', { 'data-testid': 'g4-b-deadlines' });
const _og = () => {
dlBox.innerHTML = '';
_oe.forEach((d, i) => {
const lb = K.input(d.label, { placeholder: 'Ví dụ: Hạn ký HĐ cọc', 'aria-label': 'Tên hạn', 'data-testid': 'g4-dl-label', oninput: (e) => { d.label = e.target.value; } });
const dt = K.date(d.date, { 'aria-label': 'Ngày hạn', 'data-testid': 'g4-dl-date', onchange: (e) => { d.date = e.target.value; } });
const dn = h('label', { class: 'bds-check' }, h('input', { type: 'checkbox', checked: !!d.done, onchange: (e) => { d.done = e.target.checked; } }), ' Xong');
dlBox.appendChild(h('div', { class: 'g4-dl-row' }, lb, dt, dn, (() => { const _o3 = K.button('✕', () => { _oe.splice(i, 1); _og(); }, { title: 'Bỏ hạn này', testid: 'g4-dl-del' }); _o3.setAttribute('aria-label', 'Bỏ hạn này'); return _o3; })()));
});
const _o2 = (label) => { _oe.push({ id: 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), label, date: '', done: false }); _og(); };
dlBox.appendChild(h('div', { class: 'bds-row bds-wrap' }, K.button('+ Hạn', () => _o2(''), { testid: 'g4-dl-add' }),
K.button('+ Hạn ký HĐ cọc', () => _o2('Hạn ký HĐ cọc')), K.button('+ Hạn đóng đợt 1', () => _o2('Hạn đóng đợt 1')), K.button('+ Hạn hoàn tiền giữ chỗ', () => _o2('Hạn hoàn tiền giữ chỗ'))));
};
_og();
const err = K.errorBox();
const save = async () => {
err.textContent = '';
const _ob = customers.find((c) => c.id === _oh.customer.value);
const customer_name = _ob ? _ob.name : _oh.customer_name.value.trim();
if (!customer_name) { err.textContent = 'Chọn hoặc gõ tên khách.'; return; }
if (!_oh.project.value && !_oh.unit_code.value.trim()) { err.textContent = 'Chọn dự án hoặc nhập mã căn.'; return; }
if (amount.input.value.trim() && !amount.value) { err.textContent = 'Số tiền giữ chỗ chưa đúng (ví dụ 50tr).'; return; }
if (price.input.value.trim() && !price.value) { err.textContent = 'Giá căn chưa đúng (ví dụ 4,5 tỷ).'; return; }
if (amount.value && price.value && amount.value >= price.value) { err.textContent = 'Số tiền giữ chỗ ' + G.moneyExact(amount.value) + ' không thể bằng hoặc lớn hơn giá căn ' + G.moneyExact(price.value) + '.'; return; }
const _oc = _oh.cval.value.trim() ? _od() : 0;
if (_oh.cval.value.trim() && !(_oc > 0)) { err.textContent = 'Hoa hồng chưa đúng.'; return; }
const _o9 = G.commissionProblem({ type: _oh.ctype.value, value: _oc, price: price.value });
if (_o9) { err.textContent = _o9; return; }
if (bonus.input.value.trim() && !bonus.value) { err.textContent = 'Thưởng nóng chưa đúng (ví dụ 10tr).'; return; }
if (_oh.paid_at.value) { const _of = G.dateProblem(_oh.paid_at.value, 'Ngày chuyển', { notFuture: true }); if (_of) { err.textContent = _of; return; } }
const _op = new Map(_o3.deadlines.map((d) => [d.id, d.date]));
for (const d of _oe) {
const name = 'Hạn "' + (String(d.label || '').trim() || 'chưa đặt tên') + '"';
if (!G.YMD_RE.test(d.date || '')) { err.textContent = name + ' chưa chọn ngày.'; return; }
const _o6 = _op.get(d.id) !== d.date;
const _of = G.dateProblem(d.date, name, { notPast: _o6 && !d.done });
if (_of) { err.textContent = _of + (_o6 && !d.done && d.date < G.todayYmd() ? ' Việc đã làm xong thì tick "Xong".' : ''); return; }
}
const proofs = G.parseLinks(_oh.proofs.value);
const _oj = G.linkProblem(_oh.proofs.value);
if (_oj) { err.textContent = 'Link uỷ nhiệm chi: ' + _oj.replace(/^Link phải/, 'phải'); return; }
const cur = row ? ((await K.get('objects', row.id)) || row) : G.newRow(G.KIND.booking, K.user);
const _on = row ? G.bookingView(cur) : null;
const _oa = !K.staff && _oh.cstatus.value === 'da_chi' && (!_on || _on.commission.status !== 'da_chi') ? 'cho_chi' : _oh.cstatus.value;
const _o5 = !K.staff && _oh.bstatus.value === 'da_chi' && (!_on || _on.bonus.status !== 'da_chi') ? 'cho_chi' : _oh.bstatus.value;
const _os = await K.put('objects', G.withData(cur, {
kind: _oh.kind.value, customer_id: _ob ? _ob.id : '', customer_name: customer_name.slice(0, 120), listing_id: _oh.listing.value, unit_code: _oh.unit_code.value.trim().slice(0, 40),
amount: amount.value || 0, paid_at: _oh.paid_at.value, proofs,
deadlines: _oe.map((d) => ({ id: d.id, label: String(d.label || 'Hạn').trim().slice(0, 80), date: d.date, done: !!d.done })),
price: price.value || 0, commission: { type: _oh.ctype.value, value: _oc || 0, status: _oa },
bonus: { amount: bonus.value || 0, note: _oh.bnote.value.trim().slice(0, 200), status: _o5 },
}, {
name: [_oh.unit_code.value.trim(), G.projectName(projects, _oh.project.value)].filter(Boolean).join(' · ').slice(0, 200),
project: _oh.project.value, unit_type: _oh.unit_type.value.trim().slice(0, 20), status: _oh.status.value, note: _oh.note.value.trim().slice(0, 2000),
}));
await _o10(K, _os);
let _ok = '';
if (_oh.listing.value) {
try {
const lr = await K.get('objects', _oh.listing.value);
const next = lr ? G.listingStatusAfterBooking(_oh.status.value, lr.status) : '';
if (next) { await K.put('objects', { ...lr, status: next }); _ok = ' · căn chuyển sang "' + G.label(G.LISTING_STATUS, next) + '"'; }
} catch { }
}
if (_ob && (_oi || (_on && _on.status !== _oh.status.value))) {
await K.logEvent(_ob.id, 'payment', G.label(G.BOOKING_KINDS, _oh.kind.value) + ' ' + (_oh.unit_code.value.trim() || G.projectName(projects, _oh.project.value)) + ': ' + G.label(G.BOOKING_STATUS, _oh.status.value) + (amount.value ? ' – ' + G.moneyExact(amount.value) : ''));
}
const note = G.linkNote(_oh.proofs.value);
K.toast((_oi ? 'Đã tạo phiếu giữ chỗ' : 'Đã lưu') + _ok + note, note ? 'warn' : 'success'); _ou.close(); refresh && refresh();
};
const remove = async () => {
const ok = await K.confirm({ title: K.canErase ? 'Xoá phiếu?' : 'Huỷ phiếu?', text: K.canErase ? 'Xoá phiếu giữ chỗ và các nhắc hạn của phiếu.' : 'Phiếu chuyển sang "Huỷ / hoàn tiền".', ok: K.canErase ? 'Xoá' : 'Huỷ phiếu', kind: 'danger', testid: 'g4-b-remove' });
if (!ok) return;
const cur = (await K.get('objects', row.id)) || row;
if (K.canErase) {
await K.put('objects', { ...cur, deleted: 1 });
for (const r of (await K.listAll('reminders')).filter((x) => String(x.id).startsWith('g4r_' + row.id + '_') && !Number(x.deleted))) await K.put('reminders', { ...r, deleted: 1 });
} else { const _or = await K.put('objects', { ...cur, status: 'huy' }); await _o10(K, _or); }
_ou.close(); refresh && refresh();
};
const _ou = K.sheet({ title: _oi ? 'Giữ chỗ mới' : 'Phiếu ' + _o11(_o3, projects), testid: 'g4-booking-form', body: [
h('div', { class: 'g4-grid' }, K.field('Loại', _oh.kind), K.field('Trạng thái', _oh.status), K.field('Khách', _oh.customer), K.field('Hoặc tên khách', _oh.customer_name)),
h('div', { class: 'g4-grid' }, K.field('Căn trong giỏ thứ cấp', _oh.listing), K.field('Dự án', _oh.project), K.field('Mã căn', _oh.unit_code), K.field('Loại căn', _oh.unit_type)),
h('h3', { class: 'g4-sec' }, 'Tiền giữ chỗ & uỷ nhiệm chi'), depositNote,
h('div', { class: 'g4-grid' }, K.field('Số tiền', amount.el), K.field('Ngày chuyển', _oh.paid_at)),
K.field('Ảnh uỷ nhiệm chi (link Drive)', _oh.proofs, 'App chỉ lưu link – ảnh nằm trên Google Drive của anh/chị.'),
K.links(_o3.proofs, { prefix: 'Uỷ nhiệm chi', testid: 'g4-b-proof-links' }),
h('h3', { class: 'g4-sec' }, 'Các hạn (app nhắc trước 1 ngày qua Telegram)'), dlBox,
h('h3', { class: 'g4-sec' }, 'Hoa hồng & thưởng nóng'),
h('div', { class: 'g4-grid' }, K.field('Giá căn', price.el), K.field('Cách tính hoa hồng', _oh.ctype), K.field('Mức', h('span', { class: 'g4-money' }, _oh.cval, _o8)), K.field('Hoa hồng đã nhận chưa?', _oh.cstatus),
K.field('Thưởng nóng', bonus.el), K.field('Ghi chú thưởng', _oh.bnote), K.field('Thưởng đã nhận chưa?', _oh.bstatus)),
K.staff ? null : h('p', { class: 'bds-muted' }, 'Trạng thái "Đã nhận" do Quản trị/Quản lý xác nhận.'),
K.field('Ghi chú', _oh.note),
err,
h('div', { class: 'bds-row bds-end bds-wrap' }, row ? K.button(K.canErase ? 'Xoá' : 'Huỷ phiếu', remove, { kind: 'danger', icon: K.canErase ? 'x' : 'close', testid: 'g4-b-delete' }) : null,
K.button('Lưu', save, { kind: 'primary', testid: 'g4-b-save' })),
] });
}
export async function selftest(ctx) { return g4selftest(ctx, (div) => mount(div, ctx)); }
export default { manifest, mount, selftest };

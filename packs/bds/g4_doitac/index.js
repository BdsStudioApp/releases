import { g4kit, g4selftest, manifest as mf, h, G } from '../_lib/g4_ui.js';
export const manifest = { ...mf('g4_doitac', 'Sổ đối tác', '🤝', 110, 'Danh bạ đối tác + ai đang giữ quỹ căn nào + nhật ký gọi/nhắn.'), status: 'ready', pack: 'core', screen: 'customers', label: '' };
export async function mount(el, ctx) {
const K = g4kit(ctx, 'g4_doitac');
await K.loadDir();
const _ol = { tab: 'list', q: '', role: '', scope: 'all', invQ: '', showArchived: false };
el.innerHTML = '';
const _o1 = h('div', { class: 'bds-screen', 'data-testid': 'g4-doitac' });
el.appendChild(_o1);
async function _oh() {
const [rows, _og] = await Promise.all([K.objects(G.KIND.partner), K.projectsAll()]);
_o1.innerHTML = '';
_o1.appendChild(K.head('Sổ đối tác', 'Admin dự án, sàn F1/F2, Sale BĐS, Sale ngân hàng, công chứng, chủ nhà, cộng tác viên (CTV) – và ai giữ quỹ căn nào.',
K.button('+ Thêm đối tác', () => openPartner(ctx, K, null, _oh), { kind: 'primary', testid: 'g4-partner-add' })));
const tab = (id, label, ic) => h('button', { type: 'button', class: 'bds-btn bds-btn-ghost', 'aria-pressed': String(_ol.tab === id), 'data-testid': 'g4-tab-' + id, onclick: () => { _ol.tab = id; _oh(); } }, K.icon(ic) || '', label);
_o1.appendChild(h('div', { class: 'g4-tabs', role: 'group' }, tab('list', 'Đối tác', 'customers'), tab('inv', 'Ai giữ quỹ căn', 'building')));
if (_ol.tab === 'inv') {
const all = G.inventoryRows(G.scopeRows(rows.filter((r) => r.status !== 'luu_tru'), _ol.scope, K.user));
const _ok = G.findHolders(all, _ol.invQ, _og);
_o1.appendChild(h('div', { class: 'g4-filters' }, K.search(_ol.invQ, (v) => { _ol.invQ = v; _oh(); }, 'Mã căn, dự án hoặc tên đối tác'), K.scopeSelect(_ol.scope, (v) => { _ol.scope = v; _oh(); })));
_o1.appendChild(K.card({ title: 'Quỹ căn đang có người giữ (' + _ok.length + ')', testid: 'g4-inventory', body: _ok.length
? h('div', { class: 'g4-table-wrap' }, h('table', { class: 'g4-table' },
h('thead', null, h('tr', null, ['Căn', 'Dự án', 'Ai giữ', 'Cập nhật', ''].map((x) => h('th', null, x)))),
h('tbody', null, _ok.map((r) => h('tr', { 'data-testid': 'g4-inv-row' },
h('td', { 'data-label': 'Căn' }, h('strong', null, r.unit || '(cả quỹ)'), r.note ? h('div', { class: 'bds-muted' }, r.note) : null),
h('td', { 'data-label': 'Dự án' }, G.projectName(_og, r.project)),
h('td', { 'data-label': 'Ai giữ' }, r.partner, h('div', { class: 'bds-muted' }, G.label(G.PARTNER_ROLES, r.role))),
h('td', { 'data-label': 'Cập nhật' }, r.at ? G.msLabel(r.at) : ''),
h('td', { 'data-label': 'Gọi' }, r.phone ? K.linkBtn('📞', K.tel(r.phone), () => K.logEvent(r.partner_id, 'call', 'Gọi hỏi căn ' + (r.unit || ''))) : null))))))
: K.empty(all.length ? 'Không thấy căn khớp.' : 'Chưa có quỹ căn. Mở một đối tác → "Quỹ căn đang giữ" để ghi căn họ đang giữ.') }));
return;
}
let list = G.scopeRows(rows, _ol.scope, K.user);
if (!_ol.showArchived) list = list.filter((r) => r.status !== 'luu_tru');
if (_ol.role) list = list.filter((r) => G.dataOf(r).role === _ol.role);
list = G.searchRows(list, _ol.q, (r) => { const _o4 = G.dataOf(r); return [r.name, r.phone, _o4.company, r.note, G.splitUnits((_o4.inventory || []).map((x) => x.units).join(',')).join(' ')]; });
list.sort((a, b) => (Number(b.updated_at) || 0) - (Number(a.updated_at) || 0));
_o1.appendChild(h('div', { class: 'g4-filters' },
K.search(_ol.q, (v) => { _ol.q = v; _oh(); }, 'Tìm tên, số điện thoại, công ty, mã căn'),
K.select([['', 'Mọi vai trò'], ...G.PARTNER_ROLES], _ol.role, { 'aria-label': 'Vai trò', 'data-testid': 'g4-role-filter', onchange: (e) => { _ol.role = e.target.value; _oh(); } }),
K.scopeSelect(_ol.scope, (v) => { _ol.scope = v; _oh(); }),
h('label', { class: 'bds-check' }, h('input', { type: 'checkbox', checked: _ol.showArchived, onchange: (e) => { _ol.showArchived = e.target.checked; _oh(); } }), ' Hiện lưu trữ')));
_o1.appendChild(K.card({ title: 'Đối tác (' + list.length + ')', testid: 'g4-partner-list', body: list.length
? h('div', { class: 'bds-list' }, list.map((r) => {
const _o4 = G.dataOf(r);
const _ob = (_o4.inventory || []).reduce((s, x) => s + G.splitUnits(x.units).length, 0);
const _o2 = G.isCtv(r) ? G.ctvNotesOf(r) : [];
const ctvSum = _o2.length ? _o2.length + ' căn đã ghi' + (G.ctvNotesTotal(_o2) ? ' · hoa hồng ' + G.moneyExact(G.ctvNotesTotal(_o2)) : '') : '';
return h('div', { class: 'bds-item', 'data-testid': 'g4-partner-' + r.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => openPartner(ctx, K, r, _oh) },
h('strong', null, r.name || 'Đối tác'),
h('span', { class: 'bds-sub' }, [G.label(G.PARTNER_ROLES, _o4.role), _o4.company, r.phone ? K.phone(r.phone) : '', _ob ? _ob + ' căn đang giữ' : '', ctvSum,
K.multiUser && K.staff ? K.ownerLabel(r.owner) : '', r.status === 'luu_tru' ? 'Lưu trữ' : ''].filter(Boolean).join(' · '))),
h('div', { class: 'bds-acts' }, K.callBtn(r, { short: true }), K.zaloBtn(r, { short: true })));
}))
: K.empty('Chưa có đối tác. Bấm "+ Thêm đối tác".') }));
}
await _oh();
K.on(el, ['objects', 'events'], _oh);
const _of = K.openQuery();
if (_of && el.getClientRects().length) { const r = await K.get('objects', _of); if (r && r.kind === G.KIND.partner) openPartner(ctx, K, r, _oh); }
}
export async function openPartner(ctx, K, row, refresh) {
const _og = await K.projectsAll();
const _od = !row;
const _o4 = row ? G.dataOf(row) : { role: 'admin_du_an', inventory: [] };
const _oa = {
name: K.input(row && row.name, { 'data-testid': 'g4-p-name', autocomplete: 'off' }),
role: K.select(G.PARTNER_ROLES, _o4.role, { 'data-testid': 'g4-p-role' }),
company: K.input(_o4.company, { placeholder: 'Sàn (cùng hoặc khác sàn), ngân hàng, văn phòng công chứng…' }),
phone: K.input(row && row.phone, { type: 'tel', inputmode: 'tel', autocomplete: 'off', 'data-testid': 'g4-p-phone' }),
zalo: K.input(row && row.zalo, { type: 'tel', inputmode: 'tel', autocomplete: 'off', placeholder: 'Bỏ trống nếu trùng số điện thoại' }),
email: K.input(row && row.email, { type: 'email', autocomplete: 'off' }),
project: K.projectSelect(_og, row && row.project, { 'data-testid': 'g4-p-project' }),
status: K.select(G.PARTNER_STATUS, (row && row.status) || 'dang_hop_tac'),
note: K.textarea(row && row.note, { placeholder: 'Ghi chú: cách làm việc, hoa hồng chia, giờ tiện gọi…' }),
};
const _ob = (Array.isArray(_o4.inventory) ? _o4.inventory : []).map((x) => ({ ...x, _orig: (x.project || '') + '|' + (x.units || '') }));
const _oc = h('div', { 'data-testid': 'g4-p-inventory' });
const _o7 = () => {
_oc.innerHTML = '';
_ob.forEach((x, i) => {
const ps = K.projectSelect(_og, x.project, { 'aria-label': 'Dự án', onchange: (e) => { x.project = e.target.value; } });
const us = K.input(x.units, { placeholder: 'Mã căn: A-12.05, A-12.06', 'aria-label': 'Mã căn', 'data-testid': 'g4-inv-units', oninput: (e) => { x.units = e.target.value; } });
const nt = K.input(x.note, { placeholder: 'Ghi chú (giá, hạn giữ…)', 'aria-label': 'Ghi chú quỹ căn', oninput: (e) => { x.note = e.target.value; } });
_oc.appendChild(h('div', { class: 'g4-inv-row' }, ps, us, nt, K.button('', () => { _ob.splice(i, 1); _o7(); }, { icon: 'close', title: 'Bỏ dòng này' })));
});
_oc.appendChild(K.button('+ Thêm quỹ căn', () => { _ob.push({ project: _oa.project.value || '', units: '', note: '' }); _o7(); }, { testid: 'g4-inv-add' }));
};
_o7();
const _oe = G.cleanCtvNotes(_o4.ctv_notes);
const _o3 = h('p', { class: 'bds-muted', 'data-testid': 'g4-ctv-total' });
const _oj = () => { _o3.textContent = 'Tổng hoa hồng đã ghi (chỉ để tham khảo): ' + G.moneyExact(G.ctvNotesTotal(_oe)); };
const ctvList = h('div');
const _o6 = () => {
ctvList.innerHTML = '';
_oe.forEach((x, i) => {
const unit = K.input(x.unit, { placeholder: 'Dự án / căn đã bán', 'aria-label': 'Dự án / căn đã bán', 'data-testid': 'g4-ctv-unit', oninput: (e) => { x.unit = e.target.value; } });
const day = K.date(x.closed_at, { 'aria-label': 'Ngày chốt deal', 'data-testid': 'g4-ctv-date', onchange: (e) => { x.closed_at = e.target.value; } });
const money = K.moneyInput(x.commission, { placeholder: 'Hoa hồng phải trả, VD: 25tr', 'aria-label': 'Hoa hồng phải trả', 'data-testid': 'g4-ctv-money' });
money.input.addEventListener('input', () => { x.commission = money.value || 0; _oj(); });
const nt = K.input(x.note, { placeholder: 'Ghi chú (đợt trả, đã trả chưa…)', 'aria-label': 'Ghi chú hoa hồng', oninput: (e) => { x.note = e.target.value; } });
const _o5 = K.button('✕', async () => {
const ok = await K.confirm({ title: 'Xoá dòng này?', text: 'Xoá dòng "' + (x.unit || 'chưa ghi căn') + '" khỏi Ghi chú bán hàng (bấm Lưu để lưu lại).', ok: 'Xoá', kind: 'danger', testid: 'g4-ctv-del-confirm' });
if (!ok) return;
_oe.splice(i, 1); _o6();
}, { title: 'Xoá dòng này', testid: 'g4-ctv-del' });
ctvList.appendChild(h('div', { class: 'g4-inv-row', 'data-testid': 'g4-ctv-row' }, unit, day, money.el, nt, _o5));
});
_oj();
};
_o6();
const ctvSec = h('div', { 'data-testid': 'g4-ctv-notes' },
h('h3', { class: 'g4-sec' }, 'Ghi chú bán hàng'),
h('p', { class: 'bds-muted' }, 'Tự ghi căn đã bán, ngày chốt, hoa hồng phải trả. App không tự tính.'),
ctvList, K.button('+ Thêm dòng', () => { _oe.push({ unit: '', closed_at: '', commission: 0, note: '' }); _o6(); }, { testid: 'g4-ctv-add' }), _o3);
const invSec = h('div', { 'data-testid': 'g4-p-inventory-sec' }, h('h3', { class: 'g4-sec' }, 'Quỹ căn đang giữ'), _oc);
const _om = () => {
ctvSec.hidden = _oa.role.value !== 'ctv'; ctvSec.style.display = ctvSec.hidden ? 'none' : '';
invSec.hidden = _oa.role.value === 'ctv'; invSec.style.display = invSec.hidden ? 'none' : '';
_oa.company.placeholder = _oa.role.value === 'ctv' ? 'Nhóm / đơn vị của CTV (nếu có)' : 'Sàn (cùng hoặc khác sàn), ngân hàng, văn phòng công chứng…';
};
_oa.role.addEventListener('change', _om);
_om();
const logBox = h('div', { class: 'bds-timeline', 'data-testid': 'g4-p-log' });
const _o8 = async () => {
logBox.innerHTML = '';
if (!row) { logBox.appendChild(K.empty('Lưu đối tác trước, rồi ghi nhật ký liên hệ.')); return; }
const _o9 = (await K.list('events')).filter((e) => e.object_id === row.id).sort((a, b) => (Number(b.at) || 0) - (Number(a.at) || 0));
const type = K.select(G.CONTACT_TYPES, 'call', { 'aria-label': 'Loại liên hệ', 'data-testid': 'g4-log-type' });
const text = K.input('', { placeholder: 'Nội dung: hỏi quỹ căn, giá, hẹn ký…', 'data-testid': 'g4-log-text' });
logBox.appendChild(h('div', { class: 'bds-row bds-wrap' }, type, text, K.button('Ghi', async () => {
if (!text.value.trim()) { text.focus(); return; }
await K.logEvent(row.id, type.value, text.value.trim(), { pack: G.PACK });
K.toast('Đã ghi nhật ký', 'success'); _o8();
}, { kind: 'primary', icon: 'log', testid: 'g4-log-add' })));
logBox.appendChild(_o9.length ? h('div', { class: 'bds-list' }, _o9.slice(0, 50).map((e) => h('div', { class: 'bds-item', 'data-testid': 'g4-log-row' },
h('span', null, h('strong', null, G.label(G.CONTACT_TYPES, e.type) || e.type), ' · ', G.msLabel(e.at), h('div', null, e.text || '')))))
: K.empty('Chưa có liên hệ nào.'));
};
await _o8();
const err = K.errorBox();
const save = async () => {
err.textContent = '';
const name = _oa.name.value.trim();
if (!name) { err.textContent = 'Nhập tên đối tác.'; _oa.name.focus(); return; }
const phone = _oa.phone.value.trim() ? G.normPhone(_oa.phone.value) : '';
if (phone && !/^0\d{9,10}$/.test(phone)) { err.textContent = 'Số điện thoại chưa đúng (10–11 số).'; return; }
const now = Date.now();
const inventory = _ob.filter((x) => (x.units || '').trim() || x.project).map((x) => {
const units = G.splitUnits(x.units).join(', ');
return { project: x.project || '', units, note: String(x.note || '').trim().slice(0, 300), at: x.at && x._orig === (x.project || '') + '|' + units ? x.at : now };
});
const _o0 = row || G.newRow(G.KIND.partner, K.user);
const patch = { role: _oa.role.value, company: _oa.company.value.trim().slice(0, 200), inventory };
if (_oa.role.value === 'ctv') patch.ctv_notes = G.cleanCtvNotes(_oe);
const saved = await K.put('objects', G.withData(_o0, patch, {
name: name.slice(0, 200), phone, zalo: _oa.zalo.value.trim() ? G.normPhone(_oa.zalo.value) : '', email: _oa.email.value.trim().slice(0, 200),
project: _oa.project.value, status: _oa.status.value, note: _oa.note.value.trim().slice(0, 2000),
}));
K.toast(_od ? 'Đã thêm đối tác' : 'Đã lưu', 'success');
_oi.close();
refresh && refresh();
if (_od) K.afterClose(() => openPartner(ctx, K, saved, refresh));
};
const remove = async () => {
const ok = await K.confirm({ title: K.canErase ? 'Xoá đối tác?' : 'Lưu trữ đối tác?', text: K.canErase ? 'Xoá "' + row.name + '" khỏi sổ đối tác. Nhật ký liên hệ vẫn giữ.' : 'Đối tác chuyển sang Lưu trữ (ẩn khỏi danh sách).', ok: K.canErase ? 'Xoá' : 'Lưu trữ', kind: 'danger', testid: 'g4-p-remove' });
if (!ok) return;
await K.removeOrArchive(row);
_oi.close(); refresh && refresh();
};
const _oi = K.sheet({ title: _od ? 'Thêm đối tác' : (row.name || 'Đối tác'), testid: 'g4-partner-form', body: [
row ? h('div', { class: 'bds-row bds-wrap' }, K.callBtn(row), K.zaloBtn(row)) : null,
h('div', { class: 'g4-grid' }, K.field('Tên', _oa.name), K.field('Vai trò', _oa.role), K.field('Công ty / đơn vị', _oa.company), K.field('Điện thoại', _oa.phone),
K.field('Zalo', _oa.zalo), K.field('Email', _oa.email), K.field('Dự án chính', _oa.project), K.field('Trạng thái', _oa.status)),
K.field('Ghi chú', _oa.note),
_o4.customer_id ? h('div', { class: 'bds-row' }, K.button('👤 Mở hồ sơ khách', () => { _oi.close(); K.afterClose(() => K.nav('#/customers/customers?open=' + encodeURIComponent(_o4.customer_id))); }, { kind: 'ghost', testid: 'g4-p-customer' })) : null,
ctvSec,
invSec,
err,
h('div', { class: 'bds-row bds-end bds-wrap' }, row ? K.button(K.canErase ? 'Xoá' : 'Lưu trữ', remove, { kind: 'danger', icon: K.canErase ? 'x' : 'disk', testid: 'g4-p-delete' }) : null,
K.button('Lưu', save, { kind: 'primary', testid: 'g4-p-save' })),
h('h3', { class: 'g4-sec' }, 'Nhật ký liên hệ'), logBox,
] });
}
export async function selftest(ctx) { return g4selftest(ctx, (div) => mount(div, ctx)); }
export default { manifest, mount, selftest };

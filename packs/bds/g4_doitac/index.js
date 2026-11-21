import { g4kit, g4selftest, manifest as mf, h, G } from '../_lib/g4_ui.js';
export const manifest = { ...mf('g4_doitac', 'Sổ đối tác', '🤝', 110, 'Danh bạ đối tác + ai đang giữ quỹ căn nào + nhật ký gọi/nhắn.'), status: 'ready', pack: 'core', screen: 'customers', label: '' };
export async function mount(el, ctx) {
const K = g4kit(ctx, 'g4_doitac');
await K.loadDir();
const _ok = { tab: 'list', q: '', role: '', scope: 'all', invQ: '', showArchived: false };
el.innerHTML = '';
const box = h('div', { class: 'bds-screen', 'data-testid': 'g4-doitac' });
el.appendChild(box);
async function _og() {
const [rows, _of] = await Promise.all([K.objects(G.KIND.partner), K.projectsAll()]);
box.innerHTML = '';
box.appendChild(K.head('Sổ đối tác', 'Admin dự án, sàn F1/F2, Sale BĐS, Sale ngân hàng, công chứng, chủ nhà, cộng tác viên (CTV) – và ai giữ quỹ căn nào.',
K.button('+ Thêm đối tác', () => openPartner(ctx, K, null, _og), { kind: 'primary', testid: 'g4-partner-add' })));
const tab = (id, label, ic) => h('button', { type: 'button', class: 'bds-btn bds-btn-ghost', 'aria-pressed': String(_ok.tab === id), 'data-testid': 'g4-tab-' + id, onclick: () => { _ok.tab = id; _og(); } }, K.icon(ic) || '', label);
box.appendChild(h('div', { class: 'g4-tabs', role: 'group' }, tab('list', 'Đối tác', 'customers'), tab('inv', 'Ai giữ quỹ căn', 'building')));
if (_ok.tab === 'inv') {
const all = G.inventoryRows(G.scopeRows(rows.filter((r) => r.status !== 'luu_tru'), _ok.scope, K.user));
const _oj = G.findHolders(all, _ok.invQ, _of);
box.appendChild(h('div', { class: 'g4-filters' }, K.search(_ok.invQ, (v) => { _ok.invQ = v; _og(); }, 'Mã căn, dự án hoặc tên đối tác'), K.scopeSelect(_ok.scope, (v) => { _ok.scope = v; _og(); })));
box.appendChild(K.card({ title: 'Quỹ căn đang có người giữ (' + _oj.length + ')', testid: 'g4-inventory', body: _oj.length
? h('div', { class: 'g4-table-wrap' }, h('table', { class: 'g4-table' },
h('thead', null, h('tr', null, ['Căn', 'Dự án', 'Ai giữ', 'Cập nhật', ''].map((x) => h('th', null, x)))),
h('tbody', null, _oj.map((r) => h('tr', { 'data-testid': 'g4-inv-row' },
h('td', { 'data-label': 'Căn' }, h('strong', null, r.unit || '(cả quỹ)'), r.note ? h('div', { class: 'bds-muted' }, r.note) : null),
h('td', { 'data-label': 'Dự án' }, G.projectName(_of, r.project)),
h('td', { 'data-label': 'Ai giữ' }, r.partner, h('div', { class: 'bds-muted' }, G.label(G.PARTNER_ROLES, r.role))),
h('td', { 'data-label': 'Cập nhật' }, r.at ? G.msLabel(r.at) : ''),
h('td', { 'data-label': 'Gọi' }, r.phone ? K.linkBtn('📞', K.tel(r.phone), () => K.logEvent(r.partner_id, 'call', 'Gọi hỏi căn ' + (r.unit || ''))) : null))))))
: K.empty(all.length ? 'Không thấy căn khớp.' : 'Chưa có quỹ căn. Mở một đối tác → "Quỹ căn đang giữ" để ghi căn họ đang giữ.') }));
return;
}
let list = G.scopeRows(rows, _ok.scope, K.user);
if (!_ok.showArchived) list = list.filter((r) => r.status !== 'luu_tru');
if (_ok.role) list = list.filter((r) => G.dataOf(r).role === _ok.role);
list = G.searchRows(list, _ok.q, (r) => { const _o3 = G.dataOf(r); return [r.name, r.phone, _o3.company, r.note, G.splitUnits((_o3.inventory || []).map((x) => x.units).join(',')).join(' ')]; });
list.sort((a, b) => (Number(b.updated_at) || 0) - (Number(a.updated_at) || 0));
box.appendChild(h('div', { class: 'g4-filters' },
K.search(_ok.q, (v) => { _ok.q = v; _og(); }, 'Tìm tên, số điện thoại, công ty, mã căn'),
K.select([['', 'Mọi vai trò'], ...G.PARTNER_ROLES], _ok.role, { 'aria-label': 'Vai trò', 'data-testid': 'g4-role-filter', onchange: (e) => { _ok.role = e.target.value; _og(); } }),
K.scopeSelect(_ok.scope, (v) => { _ok.scope = v; _og(); }),
h('label', { class: 'bds-check' }, h('input', { type: 'checkbox', checked: _ok.showArchived, onchange: (e) => { _ok.showArchived = e.target.checked; _og(); } }), ' Hiện lưu trữ')));
box.appendChild(K.card({ title: 'Đối tác (' + list.length + ')', testid: 'g4-partner-list', body: list.length
? h('div', { class: 'bds-list' }, list.map((r) => {
const _o3 = G.dataOf(r);
const _oa = (_o3.inventory || []).reduce((s, x) => s + G.splitUnits(x.units).length, 0);
const _o1 = G.isCtv(r) ? G.ctvNotesOf(r) : [];
const ctvSum = _o1.length ? _o1.length + ' căn đã ghi' + (G.ctvNotesTotal(_o1) ? ' · hoa hồng ' + G.moneyExact(G.ctvNotesTotal(_o1)) : '') : '';
return h('div', { class: 'bds-item', 'data-testid': 'g4-partner-' + r.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => openPartner(ctx, K, r, _og) },
h('strong', null, r.name || 'Đối tác'),
h('span', { class: 'bds-sub' }, [G.label(G.PARTNER_ROLES, _o3.role), _o3.company, r.phone ? K.phone(r.phone) : '', _oa ? _oa + ' căn đang giữ' : '', ctvSum,
K.multiUser && K.staff ? K.ownerLabel(r.owner) : '', r.status === 'luu_tru' ? 'Lưu trữ' : ''].filter(Boolean).join(' · '))),
h('div', { class: 'bds-acts' }, K.callBtn(r, { short: true }), K.zaloBtn(r, { short: true })));
}))
: K.empty('Chưa có đối tác. Bấm "+ Thêm đối tác".') }));
}
await _og();
K.on(el, ['objects', 'events'], _og);
const _oe = K.openQuery();
if (_oe && el.getClientRects().length) { const r = await K.get('objects', _oe); if (r && r.kind === G.KIND.partner) openPartner(ctx, K, r, _og); }
}
export async function openPartner(ctx, K, row, refresh) {
const _of = await K.projectsAll();
const _oc = !row;
const _o3 = row ? G.dataOf(row) : { role: 'admin_du_an', inventory: [] };
const _o9 = {
name: K.input(row && row.name, { 'data-testid': 'g4-p-name', autocomplete: 'off' }),
role: K.select(G.PARTNER_ROLES, _o3.role, { 'data-testid': 'g4-p-role' }),
company: K.input(_o3.company, { placeholder: 'Sàn (cùng hoặc khác sàn), ngân hàng, văn phòng công chứng…' }),
phone: K.input(row && row.phone, { type: 'tel', inputmode: 'tel', autocomplete: 'off', 'data-testid': 'g4-p-phone' }),
zalo: K.input(row && row.zalo, { type: 'tel', inputmode: 'tel', autocomplete: 'off', placeholder: 'Bỏ trống nếu trùng số điện thoại' }),
email: K.input(row && row.email, { type: 'email', autocomplete: 'off' }),
project: K.projectSelect(_of, row && row.project, { 'data-testid': 'g4-p-project' }),
status: K.select(G.PARTNER_STATUS, (row && row.status) || 'dang_hop_tac'),
note: K.textarea(row && row.note, { placeholder: 'Ghi chú: cách làm việc, hoa hồng chia, giờ tiện gọi…' }),
};
const _oa = (Array.isArray(_o3.inventory) ? _o3.inventory : []).map((x) => ({ ...x, _orig: (x.project || '') + '|' + (x.units || '') }));
const _ob = h('div', { 'data-testid': 'g4-p-inventory' });
const _o6 = () => {
_ob.innerHTML = '';
_oa.forEach((x, i) => {
const ps = K.projectSelect(_of, x.project, { 'aria-label': 'Dự án', onchange: (e) => { x.project = e.target.value; } });
const us = K.input(x.units, { placeholder: 'Mã căn: A-12.05, A-12.06', 'aria-label': 'Mã căn', 'data-testid': 'g4-inv-units', oninput: (e) => { x.units = e.target.value; } });
const nt = K.input(x.note, { placeholder: 'Ghi chú (giá, hạn giữ…)', 'aria-label': 'Ghi chú quỹ căn', oninput: (e) => { x.note = e.target.value; } });
_ob.appendChild(h('div', { class: 'g4-inv-row' }, ps, us, nt, K.button('', () => { _oa.splice(i, 1); _o6(); }, { icon: 'close', title: 'Bỏ dòng này' })));
});
_ob.appendChild(K.button('+ Thêm quỹ căn', () => { _oa.push({ project: _o9.project.value || '', units: '', note: '' }); _o6(); }, { testid: 'g4-inv-add' }));
};
_o6();
const _od = G.cleanCtvNotes(_o3.ctv_notes);
const _o2 = h('p', { class: 'bds-muted', 'data-testid': 'g4-ctv-total' });
const _oi = () => { _o2.textContent = 'Tổng hoa hồng đã ghi (chỉ để tham khảo): ' + G.moneyExact(G.ctvNotesTotal(_od)); };
const ctvList = h('div');
const _o5 = () => {
ctvList.innerHTML = '';
_od.forEach((x, i) => {
const unit = K.input(x.unit, { placeholder: 'Dự án / căn đã bán', 'aria-label': 'Dự án / căn đã bán', 'data-testid': 'g4-ctv-unit', oninput: (e) => { x.unit = e.target.value; } });
const day = K.date(x.closed_at, { 'aria-label': 'Ngày chốt deal', 'data-testid': 'g4-ctv-date', onchange: (e) => { x.closed_at = e.target.value; } });
const money = K.moneyInput(x.commission, { placeholder: 'Hoa hồng phải trả, VD: 25tr', 'aria-label': 'Hoa hồng phải trả', 'data-testid': 'g4-ctv-money' });
money.input.addEventListener('input', () => { x.commission = money.value || 0; _oi(); });
const nt = K.input(x.note, { placeholder: 'Ghi chú (đợt trả, đã trả chưa…)', 'aria-label': 'Ghi chú hoa hồng', oninput: (e) => { x.note = e.target.value; } });
const _o4 = K.button('✕', async () => {
const ok = await K.confirm({ title: 'Xoá dòng này?', text: 'Xoá dòng "' + (x.unit || 'chưa ghi căn') + '" khỏi Ghi chú bán hàng (bấm Lưu để lưu lại).', ok: 'Xoá', kind: 'danger', testid: 'g4-ctv-del-confirm' });
if (!ok) return;
_od.splice(i, 1); _o5();
}, { title: 'Xoá dòng này', testid: 'g4-ctv-del' });
ctvList.appendChild(h('div', { class: 'g4-inv-row', 'data-testid': 'g4-ctv-row' }, unit, day, money.el, nt, _o4));
});
_oi();
};
_o5();
const ctvSec = h('div', { 'data-testid': 'g4-ctv-notes' },
h('h3', { class: 'g4-sec' }, 'Ghi chú bán hàng'),
h('p', { class: 'bds-muted' }, 'Tự ghi căn đã bán, ngày chốt, hoa hồng phải trả. App không tự tính.'),
ctvList, K.button('+ Thêm dòng', () => { _od.push({ unit: '', closed_at: '', commission: 0, note: '' }); _o5(); }, { testid: 'g4-ctv-add' }), _o2);
const invSec = h('div', { 'data-testid': 'g4-p-inventory-sec' }, h('h3', { class: 'g4-sec' }, 'Quỹ căn đang giữ'), _ob);
const _ol = () => {
ctvSec.hidden = _o9.role.value !== 'ctv'; ctvSec.style.display = ctvSec.hidden ? 'none' : '';
invSec.hidden = _o9.role.value === 'ctv'; invSec.style.display = invSec.hidden ? 'none' : '';
_o9.company.placeholder = _o9.role.value === 'ctv' ? 'Nhóm / đơn vị của CTV (nếu có)' : 'Sàn (cùng hoặc khác sàn), ngân hàng, văn phòng công chứng…';
};
_o9.role.addEventListener('change', _ol);
_ol();
const logBox = h('div', { class: 'bds-timeline', 'data-testid': 'g4-p-log' });
const _o7 = async () => {
logBox.innerHTML = '';
if (!row) { logBox.appendChild(K.empty('Lưu đối tác trước, rồi ghi nhật ký liên hệ.')); return; }
const _o8 = (await K.list('events')).filter((e) => e.object_id === row.id).sort((a, b) => (Number(b.at) || 0) - (Number(a.at) || 0));
const type = K.select(G.CONTACT_TYPES, 'call', { 'aria-label': 'Loại liên hệ', 'data-testid': 'g4-log-type' });
const text = K.input('', { placeholder: 'Nội dung: hỏi quỹ căn, giá, hẹn ký…', 'data-testid': 'g4-log-text' });
logBox.appendChild(h('div', { class: 'bds-row bds-wrap' }, type, text, K.button('Ghi', async () => {
if (!text.value.trim()) { text.focus(); return; }
await K.logEvent(row.id, type.value, text.value.trim(), { pack: G.PACK });
K.toast('Đã ghi nhật ký', 'success'); _o7();
}, { kind: 'primary', icon: 'log', testid: 'g4-log-add' })));
logBox.appendChild(_o8.length ? h('div', { class: 'bds-list' }, _o8.slice(0, 50).map((e) => h('div', { class: 'bds-item', 'data-testid': 'g4-log-row' },
h('span', null, h('strong', null, G.label(G.CONTACT_TYPES, e.type) || e.type), ' · ', G.msLabel(e.at), h('div', null, e.text || '')))))
: K.empty('Chưa có liên hệ nào.'));
};
await _o7();
const err = K.errorBox();
const save = async () => {
err.textContent = '';
const name = _o9.name.value.trim();
if (!name) { err.textContent = 'Nhập tên đối tác.'; _o9.name.focus(); return; }
const phone = _o9.phone.value.trim() ? G.normPhone(_o9.phone.value) : '';
if (phone && !/^0\d{9,10}$/.test(phone)) { err.textContent = 'Số điện thoại chưa đúng (10–11 số).'; return; }
const now = Date.now();
const inventory = _oa.filter((x) => (x.units || '').trim() || x.project).map((x) => {
const units = G.splitUnits(x.units).join(', ');
return { project: x.project || '', units, note: String(x.note || '').trim().slice(0, 300), at: x.at && x._orig === (x.project || '') + '|' + units ? x.at : now };
});
const _o0 = row || G.newRow(G.KIND.partner, K.user);
const patch = { role: _o9.role.value, company: _o9.company.value.trim().slice(0, 200), inventory };
if (_o9.role.value === 'ctv') patch.ctv_notes = G.cleanCtvNotes(_od);
const saved = await K.put('objects', G.withData(_o0, patch, {
name: name.slice(0, 200), phone, zalo: _o9.zalo.value.trim() ? G.normPhone(_o9.zalo.value) : '', email: _o9.email.value.trim().slice(0, 200),
project: _o9.project.value, status: _o9.status.value, note: _o9.note.value.trim().slice(0, 2000),
}));
K.toast(_oc ? 'Đã thêm đối tác' : 'Đã lưu', 'success');
_oh.close();
refresh && refresh();
if (_oc) K.afterClose(() => openPartner(ctx, K, saved, refresh));
};
const remove = async () => {
const ok = await K.confirm({ title: K.canErase ? 'Xoá đối tác?' : 'Lưu trữ đối tác?', text: K.canErase ? 'Xoá "' + row.name + '" khỏi sổ đối tác. Nhật ký liên hệ vẫn giữ.' : 'Đối tác chuyển sang Lưu trữ (ẩn khỏi danh sách).', ok: K.canErase ? 'Xoá' : 'Lưu trữ', kind: 'danger', testid: 'g4-p-remove' });
if (!ok) return;
await K.removeOrArchive(row);
_oh.close(); refresh && refresh();
};
const _oh = K.sheet({ title: _oc ? 'Thêm đối tác' : (row.name || 'Đối tác'), testid: 'g4-partner-form', body: [
row ? h('div', { class: 'bds-row bds-wrap' }, K.callBtn(row), K.zaloBtn(row)) : null,
h('div', { class: 'g4-grid' }, K.field('Tên', _o9.name), K.field('Vai trò', _o9.role), K.field('Công ty / đơn vị', _o9.company), K.field('Điện thoại', _o9.phone),
K.field('Zalo', _o9.zalo), K.field('Email', _o9.email), K.field('Dự án chính', _o9.project), K.field('Trạng thái', _o9.status)),
K.field('Ghi chú', _o9.note),
_o3.customer_id ? h('div', { class: 'bds-row' }, K.button('👤 Mở hồ sơ khách', () => { _oh.close(); K.afterClose(() => K.nav('#/customers/customers?open=' + encodeURIComponent(_o3.customer_id))); }, { kind: 'ghost', testid: 'g4-p-customer' })) : null,
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

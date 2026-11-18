import { g4kit, g4selftest, manifest as mf, h, G } from '../_lib/g4_ui.js';
export const manifest = { ...mf('g4_doitac', 'Sổ đối tác', '🤝', 110, 'Danh bạ đối tác + ai đang giữ quỹ căn nào + nhật ký gọi/nhắn.'), status: 'ready', pack: 'core', label: '' };
export async function mount(el, ctx) {
const K = g4kit(ctx, 'g4_doitac');
await K.loadDir();
const _oe = { tab: 'list', q: '', role: '', scope: 'all', invQ: '', showArchived: false };
el.innerHTML = '';
const _o1 = h('div', { class: 'bds-screen', 'data-testid': 'g4-doitac' });
el.appendChild(_o1);
async function _ob() {
const [rows, _oa] = await Promise.all([K.objects(G.KIND.partner), K.projectsAll()]);
_o1.innerHTML = '';
_o1.appendChild(K.head('Sổ đối tác', 'Admin dự án, sàn F1/F2, Sale BĐS, Sale ngân hàng, công chứng, chủ nhà – và ai giữ quỹ căn nào.',
K.button('+ Thêm đối tác', () => openPartner(ctx, K, null, _ob), { kind: 'primary', testid: 'g4-partner-add' })));
const tab = (id, label, ic) => h('button', { type: 'button', class: 'bds-btn bds-btn-ghost', 'aria-pressed': String(_oe.tab === id), 'data-testid': 'g4-tab-' + id, onclick: () => { _oe.tab = id; _ob(); } }, K.icon(ic) || '', label);
_o1.appendChild(h('div', { class: 'g4-tabs', role: 'group' }, tab('list', 'Đối tác', 'customers'), tab('inv', 'Ai giữ quỹ căn', 'building')));
if (_oe.tab === 'inv') {
const all = G.inventoryRows(G.scopeRows(rows.filter((r) => r.status !== 'luu_tru'), _oe.scope, K.user));
const _od = G.findHolders(all, _oe.invQ, _oa);
_o1.appendChild(h('div', { class: 'g4-filters' }, K.search(_oe.invQ, (v) => { _oe.invQ = v; _ob(); }, 'Mã căn, dự án hoặc tên đối tác'), K.scopeSelect(_oe.scope, (v) => { _oe.scope = v; _ob(); })));
_o1.appendChild(K.card({ title: 'Quỹ căn đang có người giữ (' + _od.length + ')', testid: 'g4-inventory', body: _od.length
? h('div', { class: 'g4-table-wrap' }, h('table', { class: 'g4-table' },
h('thead', null, h('tr', null, ['Căn', 'Dự án', 'Ai giữ', 'Cập nhật', ''].map((x) => h('th', null, x)))),
h('tbody', null, _od.map((r) => h('tr', { 'data-testid': 'g4-inv-row' },
h('td', { 'data-label': 'Căn' }, h('strong', null, r.unit || '(cả quỹ)'), r.note ? h('div', { class: 'bds-muted' }, r.note) : null),
h('td', { 'data-label': 'Dự án' }, G.projectName(_oa, r.project)),
h('td', { 'data-label': 'Ai giữ' }, r.partner, h('div', { class: 'bds-muted' }, G.label(G.PARTNER_ROLES, r.role))),
h('td', { 'data-label': 'Cập nhật' }, r.at ? G.msLabel(r.at) : ''),
h('td', { 'data-label': 'Gọi' }, r.phone ? K.linkBtn('📞', K.tel(r.phone), () => K.logEvent(r.partner_id, 'call', 'Gọi hỏi căn ' + (r.unit || ''))) : null))))))
: K.empty(all.length ? 'Không thấy căn khớp.' : 'Chưa có quỹ căn. Mở một đối tác → "Quỹ căn đang giữ" để ghi căn họ đang giữ.') }));
return;
}
let list = G.scopeRows(rows, _oe.scope, K.user);
if (!_oe.showArchived) list = list.filter((r) => r.status !== 'luu_tru');
if (_oe.role) list = list.filter((r) => G.dataOf(r).role === _oe.role);
list = G.searchRows(list, _oe.q, (r) => { const _o2 = G.dataOf(r); return [r.name, r.phone, _o2.company, r.note, G.splitUnits((_o2.inventory || []).map((x) => x.units).join(',')).join(' ')]; });
list.sort((a, b) => (Number(b.updated_at) || 0) - (Number(a.updated_at) || 0));
_o1.appendChild(h('div', { class: 'g4-filters' },
K.search(_oe.q, (v) => { _oe.q = v; _ob(); }, 'Tìm tên, số điện thoại, công ty, mã căn'),
K.select([['', 'Mọi vai trò'], ...G.PARTNER_ROLES], _oe.role, { 'aria-label': 'Vai trò', 'data-testid': 'g4-role-filter', onchange: (e) => { _oe.role = e.target.value; _ob(); } }),
K.scopeSelect(_oe.scope, (v) => { _oe.scope = v; _ob(); }),
h('label', { class: 'bds-check' }, h('input', { type: 'checkbox', checked: _oe.showArchived, onchange: (e) => { _oe.showArchived = e.target.checked; _ob(); } }), ' Hiện lưu trữ')));
_o1.appendChild(K.card({ title: 'Đối tác (' + list.length + ')', testid: 'g4-partner-list', body: list.length
? h('div', { class: 'bds-list' }, list.map((r) => {
const _o2 = G.dataOf(r);
const _o7 = (_o2.inventory || []).reduce((s, x) => s + G.splitUnits(x.units).length, 0);
return h('div', { class: 'bds-item', 'data-testid': 'g4-partner-' + r.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => openPartner(ctx, K, r, _ob) },
h('strong', null, r.name || 'Đối tác'),
h('span', { class: 'bds-sub' }, [G.label(G.PARTNER_ROLES, _o2.role), _o2.company, r.phone ? K.phone(r.phone) : '', _o7 ? _o7 + ' căn đang giữ' : '',
K.multiUser && K.staff ? K.ownerLabel(r.owner) : '', r.status === 'luu_tru' ? 'Lưu trữ' : ''].filter(Boolean).join(' · '))),
h('div', { class: 'bds-acts' }, K.callBtn(r, { short: true }), K.zaloBtn(r, { short: true })));
}))
: K.empty('Chưa có đối tác. Bấm "+ Thêm đối tác".') }));
}
await _ob();
K.on(el, ['objects', 'events'], _ob);
const _o9 = K.openQuery();
if (_o9 && el.getClientRects().length) { const r = await K.get('objects', _o9); if (r && r.kind === G.KIND.partner) openPartner(ctx, K, r, _ob); }
}
export async function openPartner(ctx, K, row, refresh) {
const _oa = await K.projectsAll();
const _o8 = !row;
const _o2 = row ? G.dataOf(row) : { role: 'admin_du_an', inventory: [] };
const _o6 = {
name: K.input(row && row.name, { 'data-testid': 'g4-p-name', autocomplete: 'off' }),
role: K.select(G.PARTNER_ROLES, _o2.role, { 'data-testid': 'g4-p-role' }),
company: K.input(_o2.company, { placeholder: 'Sàn (cùng hoặc khác sàn), ngân hàng, văn phòng công chứng…' }),
phone: K.input(row && row.phone, { type: 'tel', inputmode: 'tel', autocomplete: 'off', 'data-testid': 'g4-p-phone' }),
zalo: K.input(row && row.zalo, { type: 'tel', inputmode: 'tel', autocomplete: 'off', placeholder: 'Bỏ trống nếu trùng số điện thoại' }),
email: K.input(row && row.email, { type: 'email', autocomplete: 'off' }),
project: K.projectSelect(_oa, row && row.project, { 'data-testid': 'g4-p-project' }),
status: K.select(G.PARTNER_STATUS, (row && row.status) || 'dang_hop_tac'),
note: K.textarea(row && row.note, { placeholder: 'Ghi chú: cách làm việc, hoa hồng chia, giờ tiện gọi…' }),
};
const _o7 = (Array.isArray(_o2.inventory) ? _o2.inventory : []).map((x) => ({ ...x, _orig: (x.project || '') + '|' + (x.units || '') }));
const invBox = h('div', { 'data-testid': 'g4-p-inventory' });
const _o3 = () => {
invBox.innerHTML = '';
_o7.forEach((x, i) => {
const ps = K.projectSelect(_oa, x.project, { 'aria-label': 'Dự án', onchange: (e) => { x.project = e.target.value; } });
const us = K.input(x.units, { placeholder: 'Mã căn: A-12.05, A-12.06', 'aria-label': 'Mã căn', 'data-testid': 'g4-inv-units', oninput: (e) => { x.units = e.target.value; } });
const nt = K.input(x.note, { placeholder: 'Ghi chú (giá, hạn giữ…)', 'aria-label': 'Ghi chú quỹ căn', oninput: (e) => { x.note = e.target.value; } });
invBox.appendChild(h('div', { class: 'g4-inv-row' }, ps, us, nt, K.button('', () => { _o7.splice(i, 1); _o3(); }, { icon: 'close', title: 'Bỏ dòng này' })));
});
invBox.appendChild(K.button('+ Thêm quỹ căn', () => { _o7.push({ project: _o6.project.value || '', units: '', note: '' }); _o3(); }, { testid: 'g4-inv-add' }));
};
_o3();
const logBox = h('div', { class: 'bds-timeline', 'data-testid': 'g4-p-log' });
const _o4 = async () => {
logBox.innerHTML = '';
if (!row) { logBox.appendChild(K.empty('Lưu đối tác trước, rồi ghi nhật ký liên hệ.')); return; }
const _o5 = (await K.list('events')).filter((e) => e.object_id === row.id).sort((a, b) => (Number(b.at) || 0) - (Number(a.at) || 0));
const type = K.select(G.CONTACT_TYPES, 'call', { 'aria-label': 'Loại liên hệ', 'data-testid': 'g4-log-type' });
const text = K.input('', { placeholder: 'Nội dung: hỏi quỹ căn, giá, hẹn ký…', 'data-testid': 'g4-log-text' });
logBox.appendChild(h('div', { class: 'bds-row bds-wrap' }, type, text, K.button('Ghi', async () => {
if (!text.value.trim()) { text.focus(); return; }
await K.logEvent(row.id, type.value, text.value.trim(), { pack: G.PACK });
K.toast('Đã ghi nhật ký', 'success'); _o4();
}, { kind: 'primary', icon: 'log', testid: 'g4-log-add' })));
logBox.appendChild(_o5.length ? h('div', { class: 'bds-list' }, _o5.slice(0, 50).map((e) => h('div', { class: 'bds-item', 'data-testid': 'g4-log-row' },
h('span', null, h('strong', null, G.label(G.CONTACT_TYPES, e.type) || e.type), ' · ', G.msLabel(e.at), h('div', null, e.text || '')))))
: K.empty('Chưa có liên hệ nào.'));
};
await _o4();
const err = K.errorBox();
const save = async () => {
err.textContent = '';
const name = _o6.name.value.trim();
if (!name) { err.textContent = 'Nhập tên đối tác.'; _o6.name.focus(); return; }
const phone = _o6.phone.value.trim() ? G.normPhone(_o6.phone.value) : '';
if (phone && !/^0\d{9,10}$/.test(phone)) { err.textContent = 'Số điện thoại chưa đúng (10–11 số).'; return; }
const now = Date.now();
const inventory = _o7.filter((x) => (x.units || '').trim() || x.project).map((x) => {
const units = G.splitUnits(x.units).join(', ');
return { project: x.project || '', units, note: String(x.note || '').trim().slice(0, 300), at: x.at && x._orig === (x.project || '') + '|' + units ? x.at : now };
});
const _o0 = row || G.newRow(G.KIND.partner, K.user);
const saved = await K.put('objects', G.withData(_o0, { role: _o6.role.value, company: _o6.company.value.trim().slice(0, 200), inventory }, {
name: name.slice(0, 200), phone, zalo: _o6.zalo.value.trim() ? G.normPhone(_o6.zalo.value) : '', email: _o6.email.value.trim().slice(0, 200),
project: _o6.project.value, status: _o6.status.value, note: _o6.note.value.trim().slice(0, 2000),
}));
K.toast(_o8 ? 'Đã thêm đối tác' : 'Đã lưu', 'success');
_oc.close();
refresh && refresh();
if (_o8) K.afterClose(() => openPartner(ctx, K, saved, refresh));
};
const remove = async () => {
const ok = await K.confirm({ title: K.canErase ? 'Xoá đối tác?' : 'Lưu trữ đối tác?', text: K.canErase ? 'Xoá "' + row.name + '" khỏi sổ đối tác. Nhật ký liên hệ vẫn giữ.' : 'Đối tác chuyển sang Lưu trữ (ẩn khỏi danh sách).', ok: K.canErase ? 'Xoá' : 'Lưu trữ', kind: 'danger', testid: 'g4-p-remove' });
if (!ok) return;
await K.removeOrArchive(row);
_oc.close(); refresh && refresh();
};
const _oc = K.sheet({ title: _o8 ? 'Thêm đối tác' : (row.name || 'Đối tác'), testid: 'g4-partner-form', body: [
row ? h('div', { class: 'bds-row bds-wrap' }, K.callBtn(row), K.zaloBtn(row)) : null,
h('div', { class: 'g4-grid' }, K.field('Tên', _o6.name), K.field('Vai trò', _o6.role), K.field('Công ty / đơn vị', _o6.company), K.field('Điện thoại', _o6.phone),
K.field('Zalo', _o6.zalo), K.field('Email', _o6.email), K.field('Dự án chính', _o6.project), K.field('Trạng thái', _o6.status)),
K.field('Ghi chú', _o6.note),
h('h3', { class: 'g4-sec' }, 'Quỹ căn đang giữ'), invBox,
err,
h('div', { class: 'bds-row bds-end bds-wrap' }, row ? K.button(K.canErase ? 'Xoá' : 'Lưu trữ', remove, { kind: 'danger', icon: K.canErase ? 'x' : 'disk', testid: 'g4-p-delete' }) : null,
K.button('Lưu', save, { kind: 'primary', testid: 'g4-p-save' })),
h('h3', { class: 'g4-sec' }, 'Nhật ký liên hệ'), logBox,
] });
}
export async function selftest(ctx) { return g4selftest(ctx, (div) => mount(div, ctx)); }
export default { manifest, mount, selftest };

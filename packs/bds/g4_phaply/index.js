import { g4kit, g4selftest, manifest as mf, h, G } from '../_lib/g4_ui.js';
export const manifest = mf('g4_phaply', 'Kiểm tra pháp lý', '⚖️', 140, 'Danh sách tự kiểm pháp lý căn thứ cấp – không thay thế tư vấn pháp lý.');
export async function mount(el, ctx) {
const K = g4kit(ctx);
await K.loadDir();
const _oa = { q: '', scope: 'all' };
el.innerHTML = '';
const _o0 = h('div', { class: 'bds-screen', 'data-testid': 'g4-phaply' });
el.appendChild(_o0);
async function _o8() {
const [rows, _o7] = await Promise.all([K.objects(G.KIND.listing), K.projectsAll()]);
_o0.innerHTML = '';
_o0.appendChild(K.head('Kiểm tra pháp lý căn thứ cấp', 'Tick từng mục, dán link giấy tờ (Drive), ghi chú vấn đề.'));
_o0.appendChild(h('div', { class: 'g4-disclaimer', 'data-testid': 'g4-disclaimer' }, '⚠️ ' + G.LEGAL_DISCLAIMER + ' ' + G.LEGAL_BASIS));
_o0.appendChild(h('div', { class: 'g4-filters' }, K.search(_oa.q, (v) => { _oa.q = v; _o8(); }, 'Tìm căn'), K.scopeSelect(_oa.scope, (v) => { _oa.scope = v; _o8(); })));
let list = G.scopeRows(rows.filter((r) => r.status !== 'luu_tru'), _oa.scope, K.user).map((r) => ({ r, v: G.listingView(r) }));
list = list.filter((x) => G.searchRows([x.r], _oa.q, (r) => [r.name, x.v.unit_code, G.projectName(_o7, r.project)]).length);
const _o6 = { co_van_de: 0, dang_kiem: 1, chua_kiem: 2, da_kiem: 3 };
list = list.map((x) => ({ ...x, p: G.legalProgress(x.v.legal) })).sort((a, b) => _o6[a.p.verdict] - _o6[b.p.verdict]);
_o0.appendChild(K.card({ title: 'Căn cần kiểm (' + list.length + ')', testid: 'g4-legal-list', body: list.length
? h('div', { class: 'bds-list' }, list.map(({ r, v, p }) => h('div', { class: 'bds-item', 'data-testid': 'g4-legal-' + r.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => openLegal(ctx, K, r, _o8) },
h('strong', null, G.listingTitle(v, _o7)),
h('span', { class: 'bds-sub' }, p.ok + '/' + p.total + ' mục ổn' + (p.issues ? ' · ' + p.issues + ' mục có vấn đề' : '') + (K.multiUser && K.staff ? ' · ' + K.ownerLabel(r.owner) : ''))),
K.badge(G.VERDICT_LABEL[p.verdict], p.verdict === 'co_van_de' ? 'danger' : p.verdict === 'da_kiem' ? 'success' : p.verdict === 'dang_kiem' ? 'warn' : 'muted'))))
: K.empty('Chưa có căn. Thêm căn ở "Giỏ hàng thứ cấp" rồi quay lại đây.') }));
}
await _o8();
K.on(el, ['objects'], _o8);
const _o5 = K.openQuery();
if (_o5 && el.getClientRects().length) { const r = await K.get('objects', _o5); if (r && r.kind === G.KIND.listing) openLegal(ctx, K, r, _o8); }
}
export async function openLegal(ctx, K, row, refresh) {
const _o7 = await K.projectsAll();
const v = G.listingView(row);
const _o2 = G.legalState(v.legal);
const inputs = _o2.map((it) => {
const status = K.select(G.LEGAL_STATUS, it.status, { 'aria-label': 'Trạng thái ' + it.title, 'data-testid': 'g4-lg-status-' + it.id });
const note = K.textarea(it.note, { rows: 2, placeholder: 'Ghi chú: đã xem gì, ai xác nhận, vấn đề…', 'aria-label': 'Ghi chú ' + it.title, 'data-testid': 'g4-lg-note-' + it.id });
const links = K.linksInput(it.links, { 'aria-label': 'Link giấy tờ ' + it.title, 'data-testid': 'g4-lg-links-' + it.id, placeholder: 'Link ảnh/scan giấy tờ trên Google Drive, mỗi dòng một link' });
return { it, status, note, links };
});
const err = K.errorBox();
const save = async () => {
err.textContent = '';
const _o1 = (await K.get('objects', row.id)) || row;
for (const x of inputs) { const _o3 = G.linkProblem(x.links.value); if (_o3) { err.textContent = x.it.title + ': ' + _o3; return; } }
let legal = G.listingView(_o1).legal || {};
for (const x of inputs) {
const _o4 = _o2.find((i) => i.id === x.it.id);
const links = G.parseLinks(x.links.value);
if (x.status.value === _o4.status && x.note.value.trim() === _o4.note && JSON.stringify(links) === JSON.stringify(_o4.links)) continue;
legal = G.setLegalItem(legal, x.it.id, { status: x.status.value, note: x.note.value.trim().slice(0, 1000), links, by: (K.user && K.user.id) || '' });
}
await K.put('objects', G.withData(_o1, { legal }));
const note = G.linkNote(...inputs.map((x) => x.links.value));
K.toast('Đã lưu kiểm tra pháp lý' + note, note ? 'warn' : 'success'); _o9.close(); refresh && refresh();
};
const _o9 = K.sheet({ title: 'Pháp lý – ' + G.listingTitle(v, _o7), testid: 'g4-legal-form', body: [
h('div', { class: 'g4-disclaimer' }, '⚠️ ' + G.LEGAL_DISCLAIMER + ' Trước khi đặt cọc, nên nhờ công chứng viên/luật sư xem hồ sơ gốc. ' + G.LEGAL_BASIS),
inputs.map((x) => h('div', { class: 'g4-legal-item', 'data-testid': 'g4-lg-' + x.it.id },
h('strong', null, x.it.title), h('p', { class: 'bds-muted' }, x.it.hint),
h('div', { class: 'g4-grid' }, K.field('Trạng thái', x.status), K.field('Ghi chú', x.note)),
K.field('Link giấy tờ', x.links), K.links(x.it.links, { prefix: 'Giấy tờ' }),
x.it.at ? h('small', { class: 'bds-muted' }, 'Cập nhật ' + G.msLabel(x.it.at)) : null)),
err,
h('div', { class: 'bds-row bds-end' }, K.button('Lưu', save, { kind: 'primary', testid: 'g4-lg-save' })),
] });
}
export async function selftest(ctx) { return g4selftest(ctx, (div) => mount(div, ctx)); }
export default { manifest, mount, selftest };

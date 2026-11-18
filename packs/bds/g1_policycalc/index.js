import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as U from '../g1_lib/ui.js';
const _o0 = 'g1.pub.docs';
const _om = (e) => e && (e.code === 'UNKNOWN_ACTION' || e.code === 'NOT_FOUND' && /chức năng/.test(e.message || ''));
export async function mount(el, ctx) {
S.ensureSalesCss(); U.ensureCss();
const _o1 = kit(ctx);
let env = await S.loadEnv(ctx);
const money = env.money;
const role = ctx.user && ctx.user.role;
const _ox = !role || role === 'owner' || role === 'manager';
const _o11 = (ctx.user && ctx.user.id) || 'me';
const sellable = env.projects.filter(S.sellable);
const _oq = S.hashParams();
const st = { project: _oq.get('project') || (sellable[0] || {}).id || '', type: '', area: '', unitPrice: '', extras: [], gift: '', coc: '8', rate: String(env.cfg.RATE || 10), years: String(env.cfg.LOAN_YEARS || 25),
internal: { commissionPct: '', netPrice: '', note: '' }, selected: new Set() };
let docs = (await _o1.setting(_o0, [])) || [];
if (!Array.isArray(docs)) docs = [];
const _oz = new Map();
const _ov = h('div', { class: 'sl g1', 'data-testid': 'g1-policycalc' });
el.innerHTML = ''; el.appendChild(_ov);
const form = h('div', { class: 'sl-box sl-col' }), out = h('div', { class: 'sl-col', 'aria-live': 'polite' }), vault = h('div', { class: 'sl-col' });
_ov.append(U.title('Máy tính chính sách nâng cao'),
h('p', { class: 'g1-lead' }, 'So mọi phương án thanh toán: giá thực sau mọi ưu đãi, đơn giá thực/m², và giá trị quy về hôm nay để biết phương án nào lợi nhất.'),
h('div', { class: 'sl-two' }, form, out), vault);
const project = () => env.project(st.project);
const _o10 = () => { const p = project(); return p && (p.types.find((t) => t.n === st.type && !t.ask) || p.types.find((t) => !t.ask)); };
const _og = () => 'g1i-' + st.project + '-' + _o11;
async function _oj() {
const _or = await _o1.get('objects', _og());
let _o6 = _or && !Number(_or.deleted) ? _or.data : null; if (typeof _o6 === 'string') { try { _o6 = JSON.parse(_o6); } catch { _o6 = null; } }
st.internal = { commissionPct: _o6 && _o6.commissionPct ? S.fmtNum(_o6.commissionPct, 4) : '', netPrice: _o6 && _o6.netPrice ? S.fmtNum(_o6.netPrice / 1e9, 4) : '', note: (_o6 && _o6.note) || '' };
}
const _of = (obj, key, label, tid, attrs = {}) => h('label', { class: 'sl-f' }, label, h('input', { type: 'text', inputmode: 'decimal', value: obj[key], 'data-testid': tid, ...attrs, oninput: (e) => { obj[key] = e.target.value; _o4(); } }));
function _ot() {
const p = project(), t = _o10();
if (p && t) { st.type = t.n; if (!st.area) st.area = S.fmtNum((t.a[0] + t.a[1]) / 2); if (!st.unitPrice) st.unitPrice = S.fmtNum(p.price[0], 1); }
const exRows = st.extras.map((x, _od) => h('div', { class: 'sl-row', 'data-testid': 'g1-ex-' + _od },
h('input', { class: 'sl-in', value: x.label, placeholder: 'Tên ưu đãi', style: 'flex:2;min-width:120px', oninput: (e) => { x.label = e.target.value; _o4(); } }),
h('input', { class: 'sl-in', value: x.value, inputmode: 'decimal', placeholder: 'Số', style: 'flex:1;min-width:70px', 'data-testid': 'g1-ex-val-' + _od, oninput: (e) => { x.value = e.target.value; _o4(); } }),
_o1.select([['pct', '% giá niêm yết'], ['pct_after', '% nối tiếp'], ['amount', 'triệu đồng']], x.mode, { class: 'sl-in', style: 'flex:1;min-width:120px', onchange: (e) => { x.mode = e.target.value; _o4(); } }),
h('button', { type: 'button', class: 'sl-btn', 'aria-label': 'Bỏ ưu đãi', onclick: () => { st.extras.splice(_od, 1); _ot(); _o4(); } }, '✕')));
form.replaceChildren(
h('div', { class: 'sl-form' },
h('label', { class: 'sl-f' }, 'Dự án', _o1.select(sellable.map((x) => [x.id, x.name]), st.project, { 'data-testid': 'g1-pc-project', onchange: async (e) => { st.project = e.target.value; st.type = ''; st.area = ''; st.unitPrice = ''; await _oj(); _ot(); _o4(); _ou(); } })),
h('label', { class: 'sl-f' }, 'Loại căn', _o1.select(p ? p.types.filter((x) => !x.ask).map((x) => [x.n, `${x.n} (${S.fmtNum(x.a[0])}–${S.fmtNum(x.a[1])} m²)`]) : [], st.type, { 'data-testid': 'g1-pc-type', onchange: (e) => { st.type = e.target.value; st.area = ''; _ot(); _o4(); } })),
_of(st, 'area', 'Diện tích (m²)', 'g1-pc-area'), _of(st, 'unitPrice', 'Đơn giá niêm yết (triệu/m²)', 'g1-pc-price')),
h('h3', null, 'Ưu đãi cộng thêm'), ...exRows,
h('div', { class: 'sl-row' }, _o1.button('+ Thêm ưu đãi', () => { st.extras.push({ label: '', value: '', mode: 'pct' }); _ot(); }, { kind: 'ghost', testid: 'g1-pc-add-extra' })),
h('div', { class: 'sl-form' }, _of(st, 'gift', 'Quà tặng quy đổi (triệu)', 'g1-pc-gift'), _of(st, 'coc', 'Chi phí vốn của khách (%/năm)', 'g1-pc-coc'),
_of(st, 'rate', 'Lãi vay sau hỗ trợ (%/năm)', 'g1-pc-rate'), _of(st, 'years', 'Số năm vay', 'g1-pc-years')),
h('p', { class: 'sl-muted sl-small' }, 'Chi phí vốn: lãi khách có thể kiếm nếu giữ tiền (vd gửi tiết kiệm) – dùng để quy dòng tiền trả theo tiến độ về giá trị hôm nay.'),
h('div', { class: 'g1-private', 'data-private': '1', 'data-testid': 'g1-pc-internal' },
h('div', { class: 'sl-form' }, _of(st.internal, 'commissionPct', 'Hoa hồng (%)', 'g1-pc-comm'), _of(st.internal, 'netPrice', 'Giá nét (tỷ)', 'g1-pc-net')),
h('label', { class: 'sl-f' }, 'Ghi chú nội bộ', h('textarea', { rows: 2, 'data-testid': 'g1-pc-note', oninput: (e) => { st.internal.note = e.target.value; } }, st.internal.note)),
h('div', { class: 'sl-row sl-end' }, _o1.button('Lưu nội bộ', saveInternal, { kind: 'ghost', testid: 'g1-pc-save-internal' }))));
}
async function saveInternal() {
const p = project(); if (!p) return;
const np = G.numDec(st.internal.netPrice);
const _o6 = { project_id: p.id, commissionPct: G.numDec(st.internal.commissionPct) || 0, netPrice: Math.round((np || 0) * (np < 1e5 ? 1e9 : 1)), note: st.internal.note || '' };
await _o1.put('objects', { id: _og(), kind: 'g1_internal', name: 'Nội bộ – ' + p.name, project: p.name, status: '', data: JSON.stringify(_o6) });
_o1.toast('Đã lưu thông tin nội bộ (chỉ anh/chị thấy).', 'ok');
}
let _oh = null;
function _o4() {
const p = project(), t = _o10();
const N = G.numDec;
const area = N(st.area), up = N(st.unitPrice);
if (!p || !t || !(area > 0) || !(up > 0)) { out.replaceChildren(h('div', { class: 'sl-box sl-muted' }, 'Chọn dự án, nhập diện tích và đơn giá.')); _oh = null; return; }
const np = N(st.internal.netPrice);
const _ol = (v) => (String(v ?? '').trim() === '' ? '' : N(v));
const _o2 = G.rangeErrors([['Diện tích', _ol(st.area), 1, 100000, 'm²'], ['Đơn giá niêm yết', _ol(st.unitPrice), 0.1, 100000, 'triệu/m²'], ['Quà tặng quy đổi', st.gift, 0, 1e6, 'triệu'],
['Chi phí vốn', _ol(st.coc), 0, 100, '%/năm'], ['Lãi vay', _ol(st.rate), 0, 100, '%/năm'], ['Số năm vay', _ol(st.years), 1, 50, 'năm'], ['Hoa hồng', _ol(st.internal.commissionPct), 0, 100, '%'],
['Giá nét', String(st.internal.netPrice).trim() === '' ? '' : (isFinite(np) ? (np < 1e5 ? np : np / 1e9) : np), 0, 100000, 'tỷ'],
...st.extras.map((x, _od) => ['Ưu đãi cộng thêm thứ ' + (_od + 1), x.mode === 'amount' ? x.value : _ol(x.value), 0, x.mode === 'amount' ? 1e6 : 100, x.mode === 'amount' ? 'triệu' : '%'])]);
if (_o2.length) { out.replaceChildren(h('div', { class: 'g1-err', role: 'alert', 'data-testid': 'g1-pc-errors' }, h('b', null, 'Có ô nhập chưa hợp lý – sửa rồi hệ thống tính lại:'), h('ul', null, _o2.map((x) => h('li', null, x))))); _oh = null; return; }
const { plans, policy } = env.plansFor(p);
const rows = G.advancedCalc({ project: p, plans, type: t.n, area, unitPrice: up, today: env.today.slice(0, 7), costOfCapital: N(st.coc) || 0, loanRate: isFinite(N(st.rate)) ? N(st.rate) : 10, loanYears: N(st.years) || 25,
extras: st.extras.map((x) => ({ label: x.label || 'Ưu đãi', kind: x.mode === 'amount' ? 'amount' : 'pct', base: x.mode === 'pct_after' ? 'after' : 'list', value: x.mode === 'amount' ? (S.parseNum(x.value) || 0) * 1e6 : N(x.value) })),
gift: (S.parseNum(st.gift) || 0) * 1e6, internal: { commissionPct: N(st.internal.commissionPct) || 0, netPrice: isFinite(np) ? (np < 1e5 ? np * 1e9 : np) : 0 } });
_oh = { rows, p, t, area, up, policy };
out.replaceChildren(
h('div', { class: 'sl-muted sl-small' }, `${S.policyLabel(policy)} · ${plans.length} phương án`),
h('div', { class: 'g1-cards' }, rows.map((_or) => h('div', { class: 'g1-card' + (_or.best ? ' best' : ''), 'data-testid': 'g1-pc-plan-' + _or.plan.id },
h('div', { class: 'sl-row sl-sp' }, h('b', null, _or.plan.name), _or.best ? h('span', { class: 'sl-ok' }, '✓ Lợi nhất') : null),
h('div', null, 'Giá thực: ', h('b', { 'data-testid': 'g1-pc-price-' + _or.plan.id }, money(_or.price)), ` · ${S.fmtNum(_or.perM2 / 1e6, 1)} tr/m²`),
h('div', { class: 'sl-small' }, `Giảm ${S.fmtNum(_or.discountPct * 100, 2)}% so với niêm yết (${money(_or.discountTotal)})`),
_or.applied.length ? h('div', { class: 'sl-small sl-muted' }, _or.applied.map((a) => `${a.label} −${money(a.amount)}`).join(' · ')) : null,
h('div', { class: 'sl-small' }, `Đợt đầu: ${money(_or.first)}${_or.loan ? ` · vay ${money(_or.loan.amount)}, hỗ trợ lãi ~${money(_or.support)}` : ''}`),
h('div', null, 'Quy về hôm nay: ', h('b', { 'data-testid': 'g1-pc-eff-' + _or.plan.id }, money(_or.effective)), _or.vsBest ? h('span', { class: 'sl-muted sl-small' }, ` (+${money(_or.vsBest)})`) : null),
_or.checkOk ? null : h('div', { class: 'sl-bad sl-small' }, 'Lịch thanh toán chưa đủ 100% – kiểm tra chính sách.'),
(_or.commission || _or.overNet != null) ? h('div', { class: 'g1-private', 'data-private': '1', 'data-testid': 'g1-pc-priv-' + _or.plan.id },
_or.commission ? h('div', null, `Hoa hồng: ${money(_or.commission)}`) : null,
_or.overNet != null ? h('div', { class: _or.overNet >= 0 ? 'sl-ok' : 'sl-bad' }, `So với giá nét: ${_or.overNet >= 0 ? '+' : ''}${money(_or.overNet)}`) : null) : null))),
h('div', { class: 'sl-row' },
_o1.button('📋 Chép gửi khách', () => _o1.copy(G.calcText(rows, { project: p, type: t.n, area, unitPrice: up, costOfCapital: N(st.coc) || 0 }, money)).then(() => _o1.toast('Đã chép – dán vào Zalo cho khách.', 'ok')), { testid: 'g1-pc-copy' }),
_o1.button('🖼 Ảnh gửi Zalo', () => _o7('png'), { testid: 'g1-pc-png' }),
_o1.button('📄 PDF gửi Zalo', () => _o7('pdf'), { testid: 'g1-pc-pdf' })),
h('p', { class: 'g1-legal' }, 'Ảnh/PDF xuất ra không có hoa hồng, giá nét; có in chìm tên + SĐT người gửi.'));
}
async function _o9() { return U.askExporter(_o1, ctx, await S.getProfile(ctx)); }
async function _o7(kind) {
if (!_oh) return;
const _o13 = await _o9(); if (!_o13) return;
const { rows, p, t, area, up } = _oh;
const _oi = G.calcText(rows, { project: p, type: t.n, area, unitPrice: up, costOfCapital: G.numDec(st.coc) || 0 }, money).split('\n');
const card = U.watermark(U.textCard('So sánh phương án – ' + p.name, _oi.slice(1)), _o13);
const name = `so-sanh-${p.id}-${Date.now().toString(36)}`;
const blob = kind === 'pdf' ? U.pdfBlob([card]) : await U.toBlob(card, 'image/png');
_ow(card);
await U.shareOrDownload(_o1, blob, name + (kind === 'pdf' ? '.pdf' : '.png'), `${p.name} – so sánh phương án`);
}
function _ow(_o3) {
const _oe = h('img', { class: 'g1-preview', src: _o3.toDataURL('image/jpeg', 0.7), alt: 'Bản xem trước có watermark', 'data-testid': 'g1-export-preview', 'data-watermark': _o3.dataset.watermark || '', 'data-w': _o3.width, 'data-h': _o3.height });
const _on = _ov.querySelector('[data-testid="g1-export-box"]'); if (_on) _on.remove();
_ov.appendChild(h('div', { class: 'sl-box', 'data-testid': 'g1-export-box' }, h('h3', null, 'Bản đã xuất (có watermark)'), _oe));
}
const _oc = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', multiple: true, hidden: true, 'data-testid': 'g1-doc-file', onchange: (e) => _o12([...e.target.files]) });
_ov.appendChild(_oc);
function _ok() { return docs.filter((_o6) => _o6.project_id === st.project); }
function _ou() {
if (role === 'ctv') { vault.replaceChildren(); return; }
const list = _ok();
const grid = h('div', { class: 'g1-thumbs', 'data-testid': 'g1-doc-list' }, list.map((_o6) => {
const holder = h('canvas', { width: 3, height: 4 });
_oy(_o6).then((_o3) => { if (_o3) { holder.replaceWith(_o3.cloneNode ? _o5(_o3) : _o3); } }).catch(() => {});
return h('div', { class: 'g1-thumb', 'data-testid': 'g1-doc-' + _o6.id }, holder,
h('label', null, h('input', { type: 'checkbox', checked: st.selected.has(_o6.id), 'data-testid': 'g1-doc-pick-' + _o6.id, style: 'width:22px;height:22px', onchange: (e) => { if (e.target.checked) st.selected.add(_o6.id); else st.selected.delete(_o6.id); } }), _o6.title || 'Tài liệu'),
_ox ? h('button', { type: 'button', class: 'sl-btn', 'aria-label': 'Xoá tài liệu ' + (_o6.title || ''), onclick: () => _os(_o6) }, h('span', { class: 'emoji', 'aria-hidden': 'true' }, '🗑️'), ' Xoá') : null);
}));
vault.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'g1-vault' },
h('div', { class: 'sl-row sl-sp' }, h('h3', null, `Kho tài liệu dự án (${list.length})`), _ox ? _o1.button('+ Thêm ảnh tài liệu', () => _oc.click(), { kind: 'primary', testid: 'g1-doc-add' }) : null),
h('p', { class: 'sl-muted sl-small' }, 'Mặt bằng, bảng giá, phiếu chính sách… dạng ảnh. Khi xuất, mỗi trang được in chìm tên + SĐT người xuất. PDF gốc: chụp/xuất từng trang thành ảnh rồi thêm vào.'),
list.length ? grid : _o1.empty(_ox ? 'Chưa có tài liệu cho dự án này.' : 'Chưa có tài liệu – chờ Quản trị/Quản lý thêm.'),
list.length ? h('div', { class: 'sl-row' },
_o1.button('📄 Xuất PDF có watermark', () => _o8('pdf'), { kind: 'primary', testid: 'g1-doc-pdf' }),
_o1.button('🖼 Xuất ảnh có watermark', () => _o8('png'), { testid: 'g1-doc-png' })) : null));
}
function _o5(_o3) { const n = document.createElement('canvas'); n.width = _o3.width; n.height = _o3.height; n.getContext('2d').drawImage(_o3, 0, 0); return n; }
async function _ob(_o6) {
if (_oz.has(_o6.drive_id)) return _oz.get(_o6.drive_id);
const _or = await _o1.api('g1.doc_get', { drive_id: _o6.drive_id });
const _o3 = await U.b64ToCanvas(_or.mime, _or.b64, 2400);
_oz.set(_o6.drive_id, _o3);
return _o3;
}
async function _oy(_o6) { try { return await _ob(_o6); } catch { return null; } }
async function _o12(files) {
_oc.value = '';
const p = project(); if (!p || !files.length) return;
let n = 0;
for (const _oa of files.slice(0, 10)) {
try {
const _o3 = await U.fileToCanvas(_oa, 2000);
const _or = await _o1.api('g1.doc_upload', { project_id: p.id, mime: 'image/jpeg', b64: U.canvasB64(_o3, 'image/jpeg', 0.85) });
const _o6 = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), project_id: p.id, title: String(_oa.name || 'Tài liệu').replace(/\.[a-z0-9]+$/i, '').slice(0, 80), drive_id: _or.drive_id, mime: _or.mime, size: _or.size, at: Date.now(), by: _o11 };
_oz.set(_o6.drive_id, _o3);
docs = [...docs, _o6]; n++;
} catch (e) {
_o1.toast(_om(e) ? 'Máy chủ chưa có kho tài liệu – cập nhật máy chủ ở Cài đặt › Phiên bản (nhân viên: nhờ Quản trị).' : 'Chưa tải lên được: ' + ((e && e.message) || 'lỗi'), 'error');
break;
}
}
if (n) { await _o1.setSetting(_o0, docs); _o1.toast(`Đã thêm ${n} tài liệu.`, 'ok'); }
_ou();
}
async function _os(_o6) {
if (!(await _o1.confirm({ title: 'Xoá tài liệu', text: `Xoá "${_o6.title}" khỏi kho (xoá cả ảnh trên Drive)?`, ok: 'Xoá', kind: 'danger', testid: 'g1-doc-del' }))) return;
try { await _o1.api('g1.doc_delete', { drive_id: _o6.drive_id }); } catch { }
docs = docs.filter((x) => x.id !== _o6.id); st.selected.delete(_o6.id);
await _o1.setSetting(_o0, docs); _ou();
}
async function _o8(kind) {
const list = _ok().filter((_o6) => st.selected.has(_o6.id));
if (!list.length) { _o1.toast('Chọn ít nhất một tài liệu.', 'warn'); return; }
const _o13 = await _o9(); if (!_o13) return;
try {
const _oo = [];
for (const _o6 of list) _oo.push(U.watermark(await _ob(_o6), _o13));
const p = project(), base = `tai-lieu-${p.id}-${Date.now().toString(36)}`;
_ow(_oo[0]);
if (kind === 'pdf') await U.shareOrDownload(_o1, U.pdfBlob(_oo), base + '.pdf', p.name + ' – tài liệu');
else for (let _od = 0; _od < _oo.length; _od++) await U.shareOrDownload(_o1, await U.toBlob(_oo[_od], 'image/jpeg', 0.9), `${base}-${_od + 1}.jpg`, p.name);
try { await _o1.put('events', { object_id: '', type: 'g1_export', text: `Xuất ${list.length} tài liệu ${p.name} (${kind.toUpperCase()}) – watermark ${_o13.name} ${_o13.phone}`, at: Date.now(), data: JSON.stringify({ docs: list.map((_o6) => _o6.id), kind }) }); } catch { }
} catch (e) { _o1.toast('Chưa xuất được: ' + ((e && e.message) || 'lỗi'), 'error'); }
}
await _oj();
_ot(); _o4(); _ou();
_o1.on(_ov, ['policies', 'projects'], async () => { env = await S.loadEnv(ctx); _o4(); });
return _ov;
}
export default {
manifest: { id: 'g1_policycalc', title: 'Chính sách nâng cao & tài liệu', icon: '🧾', screen: 'sales', order: 110, version: '0.1.0', status: 'ready',
help: 'So mọi phương án: giá thực sau ưu đãi, đơn giá thực, quy về hôm nay. Kho tài liệu dự án, xuất PDF/ảnh có in chìm tên + SĐT người gửi để gửi Zalo.' },
mount,
async selftest(ctx) {
const _or = await S.selftestSales(ctx, []);
try { const _op = G.buildPdf([{ jpeg: new Uint8Array([255, 216, 255, 217]), w: 10, h: 10 }]); if (_op[0] !== 37) return { ok: false, details: 'PDF lỗi' }; } catch (e) { return { ok: false, details: 'PDF lỗi: ' + e.message }; }
return _or;
},
};

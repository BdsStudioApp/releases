import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as U from '../g1_lib/ui.js';
import { freshButton, freshPrompt } from '../_lib/fresh.js';
const WHO = { buyer: 'Bên mua', seller: 'Bên bán', split: 'Chia đôi' };
export async function mount(el, ctx) {
S.ensureSalesCss(); U.ensureCss();
const _o0 = kit(ctx);
const env = await S.loadEnv(ctx);
const money = env.money;
let cfgOver = await _o0.setting('g1.pub.tax', null);
const role = ctx.user && ctx.user.role;
const _o6 = !role || role === 'owner' || role === 'manager';
const _ow = { mode: 'secondary', price: '', statePrice: '', brokerPct: '1', brokerPayer: 'seller', pitPayer: 'seller', lptbPayer: 'buyer', notaryPayer: 'buyer',
appraisal: '', otherBuyer: '', otherSeller: '', exemptPit: false, exemptLptb: false, online: false };
const _or = h('div', { class: 'sl g1', 'data-testid': 'g1-tax' });
el.innerHTML = ''; el.appendChild(_or);
const form = h('div', { class: 'sl-box sl-col' }), out = h('div', { class: 'sl-col', 'aria-live': 'polite' });
const stampBox = h('div', { class: 'sl-col', 'aria-live': 'polite' });
_or.append(U.title('Thuế, phí chuyển nhượng'),
h('p', { class: 'g1-lead' }, 'Nhập giá chuyển nhượng → biết bên mua thực trả, bên bán thực nhận. Ai chịu khoản nào do hai bên thoả thuận.'),
stampBox, h('div', { class: 'sl-two' }, form, out));
const num = (_ox) => S.parseNum(_ox);
const _on = (_ox) => { const _oj = G.numDec(_ox); return isFinite(_oj) ? (_oj < 1e5 ? _oj * 1e9 : _oj) : NaN; };
const field = (key, label, tid, ph) => h('label', { class: 'sl-f' }, label, h('input', { type: 'text', inputmode: 'decimal', value: _ow[key], placeholder: ph || '', 'data-testid': tid, oninput: (e) => { _ow[key] = e.target.value; _o5(); } }));
const _ok = (key, label, opts, tid) => h('label', { class: 'sl-f' }, label, _o0.select(opts, _ow[key], { 'data-testid': tid, onchange: (e) => { _ow[key] = e.target.value; _o5(); } }));
const _o9 = (key, label, tid) => h('label', { class: 'g1-check' }, h('input', { type: 'checkbox', checked: _ow[key], 'data-testid': tid, onchange: (e) => { _ow[key] = e.target.checked; _o5(); } }), h('span', null, label));
const payers = [['buyer', 'Bên mua'], ['seller', 'Bên bán']];
function _op() {
const _os = G.taxStamp(cfgOver);
stampBox.replaceChildren(h('p', { class: 'g1-warn', 'data-testid': 'g1-tax-stamp', 'data-ai': String(_os.ai) }, '📅 ' + _os.text), ...(_oc ? [_oc] : []));
}
function _oo() {
const _o4 = cfg();
form.replaceChildren(
h('div', { class: 'sl-tabs' }, ...[['secondary', 'Mua bán lại (thứ cấp)'], ['primary', 'Mua từ chủ đầu tư']].map(([_ox, l]) =>
h('button', { type: 'button', class: 'sl-chip' + (_ow.mode === _ox ? ' on' : ''), 'data-testid': 'g1-tax-mode-' + _ox, onclick: () => { _ow.mode = _ox; _oo(); _o5(); } }, l))),
h('div', { class: 'sl-form' },
field('price', 'Giá chuyển nhượng (tỷ hoặc đồng)', 'g1-tax-price', 'vd 5 hoặc 5.000.000.000'),
_ow.mode === 'secondary' ? field('statePrice', 'Giá theo bảng giá nhà nước (nếu biết)', 'g1-tax-state', 'để trống nếu chưa rõ') : null,
_ow.mode === 'secondary' ? field('brokerPct', 'Phí môi giới (% giá)', 'g1-tax-broker') : null,
_ow.mode === 'secondary' ? _ok('brokerPayer', 'Ai trả môi giới', payers, 'g1-tax-broker-payer') : null,
field('appraisal', 'Phí thẩm định, cấp sổ (đồng, theo tỉnh)', 'g1-tax-appraisal'),
field('otherBuyer', 'Chi phí khác bên mua (đồng)', 'g1-tax-ob'),
_ow.mode === 'secondary' ? field('otherSeller', 'Chi phí khác bên bán (đồng)', 'g1-tax-os') : null),
_o4.appraisal_note ? h('div', { class: 'sl-small sl-muted', 'data-testid': 'g1-tax-appraisal-note' }, 'Phí thẩm định, cấp sổ – tham khảo: ' + _o4.appraisal_note, _ou(G.taxSourceFor(_o4, 'appraisal'))) : null,
_ow.mode === 'secondary' ? h('div', { class: 'sl-form' },
_ok('pitPayer', 'Ai chịu thuế TNCN', payers, 'g1-tax-pit-payer'),
_ok('lptbPayer', 'Ai chịu lệ phí trước bạ', payers, 'g1-tax-lptb-payer'),
_ok('notaryPayer', 'Ai trả phí công chứng', [...payers, ['split', 'Chia đôi']], 'g1-tax-notary-payer')) : null,
h('div', { class: 'sl-col' },
_ow.mode === 'secondary' ? _o9('exemptPit', 'Miễn thuế TNCN (nhà ở duy nhất, chuyển nhượng giữa vợ chồng, cha mẹ – con…)', 'g1-tax-exempt') : null,
_o9('exemptLptb', 'Miễn lệ phí trước bạ (đủ điều kiện miễn)', 'g1-tax-exempt-lptb'),
_o9('online', `Nộp lệ phí trước bạ trực tuyến được giảm ${S.fmtNum(_o4.lptb_online_discount * 100)}% (nếu đủ điều kiện)`, 'g1-tax-online')));
}
const cfg = () => G.taxConfig(cfgOver);
function _o5() {
const price = _on(_ow.price);
if (!(price > 0)) { out.replaceChildren(h('div', { class: 'sl-box sl-muted' }, 'Nhập giá chuyển nhượng để xem kết quả.')); return; }
const _o2 = (k) => String(_ow[k]).trim() === '';
const _o1 = G.rangeErrors([['Giá chuyển nhượng', price / 1e9, 0.001, 100000, 'tỷ'], ['Giá theo bảng giá nhà nước', _o2('statePrice') ? '' : _on(_ow.statePrice) / 1e9, 0, 100000, 'tỷ'],
['Phí môi giới', String(_ow.brokerPct).trim() === '' ? '' : G.numDec(_ow.brokerPct), 0, 100, '%'], ['Phí thẩm định, cấp sổ', _ow.appraisal, 0, 1e12, 'đồng'], ['Chi phí khác bên mua', _ow.otherBuyer, 0, 1e13, 'đồng'], ['Chi phí khác bên bán', _ow.otherSeller, 0, 1e13, 'đồng']]);
if (_o1.length) { out.replaceChildren(h('div', { class: 'g1-err', role: 'alert', 'data-testid': 'g1-tax-errors' }, h('b', null, 'Có ô nhập chưa hợp lý – sửa rồi hệ thống tính lại:'), h('ul', null, _o1.map((x) => h('li', null, x))))); return; }
const r = G.transferCosts({ mode: _ow.mode, price, statePrice: _on(_ow.statePrice) || 0, brokerRate: _ow.mode === 'secondary' ? (G.numDec(_ow.brokerPct) || 0) / 100 : 0, brokerPayer: _ow.brokerPayer,
pitPayer: _ow.pitPayer, lptbPayer: _ow.lptbPayer, notaryPayer: _ow.notaryPayer, appraisal: num(_ow.appraisal) || 0, otherBuyer: num(_ow.otherBuyer) || 0,
otherSeller: _ow.mode === 'secondary' ? num(_ow.otherSeller) || 0 : 0, exemptPit: _ow.exemptPit, exemptLptb: _ow.exemptLptb, online: _ow.online, cfg: cfgOver });
out.replaceChildren(
h('div', { class: 'sl-box sl-col' },
h('div', { class: 'sl-kpis' },
h('div', { class: 'sl-kpi' }, h('small', null, 'Bên mua thực trả'), h('b', { class: 'g1-big', 'data-testid': 'g1-tax-buyer' }, money(r.buyerPays)), h('small', null, S.fmtVnd(r.buyerPays))),
_ow.mode === 'secondary' ? h('div', { class: 'sl-kpi' }, h('small', null, 'Bên bán thực nhận'), h('b', { class: 'g1-big', 'data-testid': 'g1-tax-seller' }, money(r.sellerGets)), h('small', null, S.fmtVnd(r.sellerGets))) : null),
h('p', { class: 'sl-small sl-muted', 'data-testid': 'g1-tax-price-echo' }, `Đang tính với giá ${G.moneyFine(r.price)} (${S.fmtVnd(r.price)}) – sai thì sửa ô giá.`),
r.base > r.price ? h('p', { class: 'g1-warn' }, `Giá nhà nước (${money(r.base)}) cao hơn giá hợp đồng → thuế, lệ phí tính trên giá nhà nước.`) : null,
h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl g1-tbl g1-stack', 'data-testid': 'g1-tax-table' },
h('thead', null, h('tr', null, h('th', null, 'Khoản'), h('th', null, 'Ai trả'), h('th', { class: 'n' }, 'Số tiền'))),
h('tbody', null, r.items.map((i) => h('tr', { 'data-testid': 'g1-tax-row-' + i.key },
h('td', null, h('b', null, i.label), i.note ? h('div', { class: 'sl-small sl-muted' }, i.note) : null, i.legal ? h('div', { class: 'g1-legal' }, i.legal) : null,
_ou(G.taxSourceFor(r.cfg, i.key))),
h('td', { 'data-l': 'Ai trả' }, WHO[i.payer] || i.payer), h('td', { class: 'n', 'data-l': 'Số tiền' }, S.fmtVnd(i.amount))))))),
h('p', { class: 'g1-warn', 'data-testid': 'g1-tax-check' }, `Mức thuế, phí theo quy định áp dụng tại ngày ${G.dmy(r.cfg.checked_at)}${G.taxStamp(cfgOver).ai ? ' (cập nhật qua AI)' : ''}. Số tham khảo – kiểm tra lại với cơ quan thuế và văn phòng công chứng trước khi giao dịch.`),
h('div', { class: 'sl-row' }, _o0.button('📋 Chép gửi khách', () => copyText(r), { testid: 'g1-tax-copy' }))),
_o7());
}
function copyText(r) {
const _og = [`Ước tính thuế, phí ${_ow.mode === 'secondary' ? 'chuyển nhượng' : 'mua từ chủ đầu tư'} – giá ${money(r.price)}:`,
...r.items.map((i) => `• ${i.label}${/\d\/\d\)$/.test(i.label) ? '' : ` (${(WHO[i.payer] || '').toLowerCase()})`}: ${i.amount ? S.fmtVnd(i.amount) : (i.note || '0 đ')}`),
`→ Bên mua thực trả: ${money(r.buyerPays)}`, _ow.mode === 'secondary' ? `→ Bên bán thực nhận: ${money(r.sellerGets)}` : '',
`Mức thu cập nhật ngày ${G.dmy(r.cfg.checked_at)} – số tham khảo, cần kiểm tra lại với cơ quan thuế.`].filter(Boolean);
_o0.copy(_og.join('\n')).then(() => _o0.toast('Đã chép – dán vào Zalo cho khách.', 'ok'));
}
let _o8 = false;
function _o7() {
if (!_o6) return null;
const _o4 = cfg();
const _om = h('input', { value: S.fmtNum(_o4.pit_rate * 100, 3), inputmode: 'decimal', 'data-testid': 'g1-tax-cfg-pit' });
const _oh = h('input', { value: S.fmtNum(_o4.lptb_rate * 100, 3), inputmode: 'decimal', 'data-testid': 'g1-tax-cfg-lptb' });
const _ob = h('input', { value: S.fmtNum(_o4.lptb_online_discount * 100, 2), inputmode: 'decimal' });
const _oa = h('input', { type: 'date', value: _o4.checked_at });
return h('details', { class: 'sl-box', open: _o8, ontoggle: (e) => { _o8 = e.target.open; } }, h('summary', null, 'Mức thu đang dùng (Quản trị/Quản lý sửa khi luật đổi)'),
h('div', { class: 'sl-form' }, h('label', { class: 'sl-f' }, 'Thuế TNCN (%)', _om), h('label', { class: 'sl-f' }, 'Lệ phí trước bạ (%)', _oh),
h('label', { class: 'sl-f' }, 'Giảm lệ phí trước bạ khi nộp trực tuyến (%)', _ob), h('label', { class: 'sl-f' }, 'Ngày đối chiếu', _oa)),
h('p', { class: 'g1-legal' }, 'Phí công chứng: ' + _o4.legal.notary + ' – ' + _o4.notary_tiers.length + ' bậc, tối đa ' + money(_o4.notary_max) + '.'),
_ov(_o4),
h('div', { class: 'sl-row sl-end' }, _o0.button('Lưu mức thu', async () => {
const _ox = { pit_rate: G.numDec(_om.value) / 100, lptb_rate: G.numDec(_oh.value) / 100, lptb_online_discount: G.numDec(_ob.value) / 100, checked_at: _oa.value || _o4.checked_at };
if (![_ox.pit_rate, _ox.lptb_rate, _ox.lptb_online_discount].every((x) => isFinite(x) && x >= 0 && x < 0.5)) { _o0.toast('Mức thu chưa hợp lệ.', 'warn'); return; }
const next = G.markTaxManual(cfgOver, _ox);
await _o0.setSetting('g1.pub.tax', next);
cfgOver = next;
_o0.toast('Đã lưu mức thu cho cả công ty.', 'ok'); _op(); _oo(); _o5();
}, { kind: 'primary', testid: 'g1-tax-cfg-save' })));
}
function _ou(_os) {
if (!_os) return null;
return h('div', { class: 'sl-small sl-muted g1-src' }, 'Nguồn AI: ', h('a', { href: G.safeUrl(_os.url), target: '_blank', rel: 'noopener' }, _os.name || G.hostOf(_os.url) || 'link'),
_os.date ? ' · ngày ' + G.dmy(_os.date) : '', _os.effective ? ' · hiệu lực ' + G.dmy(_os.effective) : '');
}
function _ov(_o4) {
const items = G.TAX_FRESH_ITEMS.filter((it) => _o4.src[it.key] && G.safeUrl(_o4.src[it.key].url));
if (!items.length) return null;
return h('div', { class: 'sl-col', 'data-testid': 'g1-tax-cfg-src' }, h('b', { class: 'sl-small' }, 'Nguồn lần cập nhật qua AI:'),
items.map((it) => h('div', null, h('span', { class: 'sl-small' }, it.label + (_o4.src[it.key].legal ? ' – ' + _o4.src[it.key].legal : '')), _ou(_o4.src[it.key]))));
}
let _ol = null;
function _oe(parsed) {
const items = G.normFreshTax(parsed, { cfgOver, todayISO: env.today });
_ol = new Set(items.filter((r) => r.ok).map((r) => r.key));
if (!items.length) return h('p', { class: 'g1-warn', 'data-testid': 'g1-tax-fresh-empty' }, 'AI chưa trả về mục thuế phí nào đọc được – bấm "Chạy lại" sau ít phút.');
const _o3 = items.map((r) => h('tr', { 'data-testid': 'g1-tax-fresh-row-' + r.key },
h('td', null, h('label', { class: 'g1-pick' }, h('input', { type: 'checkbox', checked: _ol.has(r.key), disabled: !r.ok, 'aria-label': 'Lưu ' + r.label, 'data-testid': 'g1-tax-fresh-pick-' + r.key,
onchange: (e) => { if (e.target.checked) _ol.add(r.key); else _ol.delete(r.key); } }))),
h('td', null, h('b', null, r.label)),
h('td', { 'data-l': 'Đang dùng' }, r.current),
h('td', { 'data-l': 'AI tìm được' }, h('b', { class: r.changed ? 'sl-bad' : null }, r.show), r.changed ? h('div', { class: 'sl-small sl-bad' }, 'Khác mức đang dùng') : null),
h('td', { 'data-l': 'Căn cứ' }, r.legal || '—', r.effective ? h('div', { class: 'sl-small sl-muted' }, 'Hiệu lực ' + G.dmy(r.effective)) : null),
h('td', { class: 'g1-src', 'data-l': 'Nguồn' }, r.source_url ? h('a', { href: r.source_url, target: '_blank', rel: 'noopener' }, r.source_name || G.hostOf(r.source_url) || 'link') : h('span', { class: 'sl-bad' }, 'Không có link'),
h('div', { class: 'sl-small sl-muted' }, r.date ? 'Ngày ' + G.dmy(r.date) : 'Không ghi ngày')),
h('td', null, [...r.issues.map((x) => h('div', { class: 'sl-small sl-bad' }, x)), ...r.warns.map((x) => h('div', { class: 'sl-small sl-muted' }, x))])));
const _oi = G.TAX_FRESH_ITEMS.filter((it) => !items.some((r) => r.key === it.key)).map((it) => it.label);
return h('div', { class: 'sl-col', 'data-testid': 'g1-tax-fresh-table' },
h('p', { class: 'sl-small' }, 'So mức ĐANG DÙNG với mức AI tìm được. Bỏ tích mục nào không muốn đổi; mục không tích, không hợp lệ hoặc AI không tìm được sẽ GIỮ cấu hình cũ.'),
h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl g1-tbl g1-stack' },
h('thead', null, h('tr', null, ...['Lưu', 'Khoản', 'Đang dùng', 'AI tìm được', 'Văn bản căn cứ', 'Nguồn · ngày', 'Ghi chú'].map((t) => h('th', null, t)))),
h('tbody', null, _o3))),
_oi.length ? h('p', { class: 'sl-small sl-muted' }, 'AI không tìm được: ' + _oi.join(', ') + ' – giữ cấu hình cũ.') : null,
h('p', { class: 'g1-legal' }, 'Số do AI đọc từ văn bản/trang nguồn – chỉ mang tính tham khảo, kiểm tra lại với cơ quan thuế trước khi tư vấn.'));
}
async function _od(parsed, meta) {
const _of = await _o0.setting('g1.pub.tax', null);
const items = G.normFreshTax(parsed, { cfgOver: _of, todayISO: env.today });
const _ot = items.filter((r) => r.ok && (_ol ? _ol.has(r.key) : true)).map((r) => r.key);
if (!_ot.length) throw new Error('Chưa chọn mục nào có link nguồn để lưu');
const _oq = G.mergeFreshTax(_of, items, { selected: _ot, atISO: G.isoVN(meta.at), reputable: meta.reputable });
await _o0.setSetting('g1.pub.tax', _oq.cfg);
cfgOver = _oq.cfg;
_op(); _oo(); _o5();
}
const _oc = _o6 ? freshButton(_o0, ctx, {
topic: 'tax', title: 'Cập nhật thuế, phí chuyển nhượng qua AI', testid: 'g1-tax-fresh',
prompt: () => freshPrompt('tax', { ask: G.TAX_FRESH_ASK, shape: G.TAX_FRESH_SHAPE }),
render: (parsed) => _oe(parsed), onSave: _od,
}) : null;
_op(); _oo(); _o5();
return _or;
}
export default {
manifest: { id: 'g1_tax', title: 'Thuế phí chuyển nhượng', icon: '🧮', screen: 'sales', order: 170, version: '0.1.0', status: 'ready',
help: 'Tính thuế TNCN, lệ phí trước bạ, phí công chứng, môi giới: bên mua thực trả, bên bán thực nhận. Mức thu cấu hình được hoặc cập nhật qua AI (ghi căn cứ pháp lý, ngày) – chỉ mang tính tham khảo.' },
mount,
async selftest() {
const r = G.transferCosts({ price: 5e9 });
return r.buyerPays === 5e9 + 25e6 + 3.2e6 && r.sellerGets === 5e9 - 100e6 ? { ok: true } : { ok: false, details: 'Tính thuế phí lệch' };
},
};

import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as U from '../g1_lib/ui.js';
import { freshButton, freshPrompt } from '../_lib/fresh.js';
const _o1 = { buyer: 'Bên mua', seller: 'Bên bán', split: 'Chia đôi' };
export async function mount(el, ctx) {
S.ensureSalesCss(); U.ensureCss();
const _o0 = kit(ctx);
const env = await S.loadEnv(ctx);
const money = env.money;
let cfgOver = await _o0.setting('g1.pub.tax', null);
const role = ctx.user && ctx.user.role;
const _o7 = !role || role === 'owner' || role === 'manager';
const _ox = { mode: 'secondary', price: '', statePrice: '', brokerPct: '1', brokerPayer: 'seller', pitPayer: 'seller', lptbPayer: 'buyer', notaryPayer: 'buyer',
appraisal: '', otherBuyer: '', otherSeller: '', exemptPit: false, exemptLptb: false, online: false };
const _os = h('div', { class: 'sl g1', 'data-testid': 'g1-tax' });
el.innerHTML = ''; el.appendChild(_os);
const form = h('div', { class: 'sl-box sl-col' }), out = h('div', { class: 'sl-col', 'aria-live': 'polite' });
const stampBox = h('div', { class: 'sl-col', 'aria-live': 'polite' });
_os.append(U.title('Thuế, phí chuyển nhượng'),
h('p', { class: 'g1-lead' }, 'Nhập giá chuyển nhượng → biết bên mua thực trả, bên bán thực nhận. Ai chịu khoản nào do hai bên thoả thuận.'),
stampBox, h('div', { class: 'sl-two' }, form, out));
const num = (_oy) => S.parseNum(_oy);
const _oo = (_oy) => { const _ok = G.numDec(_oy); return isFinite(_ok) ? (_ok < 1e5 ? _ok * 1e9 : _ok) : NaN; };
const field = (key, label, tid, ph) => h('label', { class: 'sl-f' }, label, h('input', { type: 'text', inputmode: 'decimal', value: _ox[key], placeholder: ph || '', 'data-testid': tid, oninput: (e) => { _ox[key] = e.target.value; _o6(); } }));
const _ol = (key, label, opts, tid) => h('label', { class: 'sl-f' }, label, _o0.select(opts, _ox[key], { 'data-testid': tid, onchange: (e) => { _ox[key] = e.target.value; _o6(); } }));
const _oa = (key, label, tid) => h('label', { class: 'g1-check' }, h('input', { type: 'checkbox', checked: _ox[key], 'data-testid': tid, onchange: (e) => { _ox[key] = e.target.checked; _o6(); } }), h('span', null, label));
const payers = [['buyer', 'Bên mua'], ['seller', 'Bên bán']];
function _oq() {
const _ot = G.taxStamp(cfgOver);
stampBox.replaceChildren(h('p', { class: 'g1-warn', 'data-testid': 'g1-tax-stamp', 'data-ai': String(_ot.ai) }, '📅 ' + _ot.text), ...(_od ? [_od] : []));
}
function _op() {
const _o5 = cfg();
form.replaceChildren(
h('div', { class: 'sl-tabs' }, ...[['secondary', 'Mua bán lại (thứ cấp)'], ['primary', 'Mua từ chủ đầu tư']].map(([_oy, l]) =>
h('button', { type: 'button', class: 'sl-chip' + (_ox.mode === _oy ? ' on' : ''), 'data-testid': 'g1-tax-mode-' + _oy, onclick: () => { _ox.mode = _oy; _op(); _o6(); } }, l))),
h('div', { class: 'sl-form' },
field('price', 'Giá chuyển nhượng (tỷ hoặc đồng)', 'g1-tax-price', 'vd 5 hoặc 5.000.000.000'),
_ox.mode === 'secondary' ? field('statePrice', 'Giá theo bảng giá nhà nước (nếu biết)', 'g1-tax-state', 'để trống nếu chưa rõ') : null,
_ox.mode === 'secondary' ? field('brokerPct', 'Phí môi giới (% giá)', 'g1-tax-broker') : null,
_ox.mode === 'secondary' ? _ol('brokerPayer', 'Ai trả môi giới', payers, 'g1-tax-broker-payer') : null,
field('appraisal', 'Phí thẩm định, cấp sổ (đồng, theo tỉnh)', 'g1-tax-appraisal'),
field('otherBuyer', 'Chi phí khác bên mua (đồng)', 'g1-tax-ob'),
_ox.mode === 'secondary' ? field('otherSeller', 'Chi phí khác bên bán (đồng)', 'g1-tax-os') : null),
_o5.appraisal_note ? h('div', { class: 'sl-small sl-muted', 'data-testid': 'g1-tax-appraisal-note' }, 'Phí thẩm định, cấp sổ – tham khảo: ' + _o5.appraisal_note, _ov(G.taxSourceFor(_o5, 'appraisal'))) : null,
_ox.mode === 'secondary' ? h('div', { class: 'sl-form' },
_ol('pitPayer', 'Ai chịu thuế TNCN', payers, 'g1-tax-pit-payer'),
_ol('lptbPayer', 'Ai chịu lệ phí trước bạ', payers, 'g1-tax-lptb-payer'),
_ol('notaryPayer', 'Ai trả phí công chứng', [...payers, ['split', 'Chia đôi']], 'g1-tax-notary-payer')) : null,
h('div', { class: 'sl-col' },
_ox.mode === 'secondary' ? _oa('exemptPit', 'Miễn thuế TNCN (nhà ở duy nhất, chuyển nhượng giữa vợ chồng, cha mẹ – con…)', 'g1-tax-exempt') : null,
_oa('exemptLptb', 'Miễn lệ phí trước bạ (đủ điều kiện miễn)', 'g1-tax-exempt-lptb'),
_oa('online', `Nộp lệ phí trước bạ trực tuyến được giảm ${S.fmtNum(_o5.lptb_online_discount * 100)}% (nếu đủ điều kiện)`, 'g1-tax-online')));
}
const cfg = () => G.taxConfig(cfgOver);
function _o6() {
const price = _oo(_ox.price);
if (!(price > 0)) { out.replaceChildren(h('div', { class: 'sl-box sl-muted' }, 'Nhập giá chuyển nhượng để xem kết quả.')); return; }
const _o3 = (k) => String(_ox[k]).trim() === '';
const _o2 = G.rangeErrors([['Giá chuyển nhượng', price / 1e9, 0.001, 100000, 'tỷ'], ['Giá theo bảng giá nhà nước', _o3('statePrice') ? '' : _oo(_ox.statePrice) / 1e9, 0, 100000, 'tỷ'],
['Phí môi giới', String(_ox.brokerPct).trim() === '' ? '' : G.numDec(_ox.brokerPct), 0, 100, '%'], ['Phí thẩm định, cấp sổ', _ox.appraisal, 0, 1e12, 'đồng'], ['Chi phí khác bên mua', _ox.otherBuyer, 0, 1e13, 'đồng'], ['Chi phí khác bên bán', _ox.otherSeller, 0, 1e13, 'đồng']]);
if (_o2.length) { out.replaceChildren(h('div', { class: 'g1-err', role: 'alert', 'data-testid': 'g1-tax-errors' }, h('b', null, 'Có ô nhập chưa hợp lý – sửa rồi hệ thống tính lại:'), h('ul', null, _o2.map((x) => h('li', null, x))))); return; }
const r = G.transferCosts({ mode: _ox.mode, price, statePrice: _oo(_ox.statePrice) || 0, brokerRate: _ox.mode === 'secondary' ? (G.numDec(_ox.brokerPct) || 0) / 100 : 0, brokerPayer: _ox.brokerPayer,
pitPayer: _ox.pitPayer, lptbPayer: _ox.lptbPayer, notaryPayer: _ox.notaryPayer, appraisal: num(_ox.appraisal) || 0, otherBuyer: num(_ox.otherBuyer) || 0,
otherSeller: _ox.mode === 'secondary' ? num(_ox.otherSeller) || 0 : 0, exemptPit: _ox.exemptPit, exemptLptb: _ox.exemptLptb, online: _ox.online, cfg: cfgOver });
out.replaceChildren(
h('div', { class: 'sl-box sl-col' },
h('div', { class: 'sl-kpis' },
h('div', { class: 'sl-kpi' }, h('small', null, 'Bên mua thực trả'), h('b', { class: 'g1-big', 'data-testid': 'g1-tax-buyer' }, money(r.buyerPays)), h('small', null, S.fmtVnd(r.buyerPays))),
_ox.mode === 'secondary' ? h('div', { class: 'sl-kpi' }, h('small', null, 'Bên bán thực nhận'), h('b', { class: 'g1-big', 'data-testid': 'g1-tax-seller' }, money(r.sellerGets)), h('small', null, S.fmtVnd(r.sellerGets))) : null),
h('p', { class: 'sl-small sl-muted', 'data-testid': 'g1-tax-price-echo' }, `Đang tính với giá ${G.moneyFine(r.price)} (${S.fmtVnd(r.price)}) – sai thì sửa ô giá.`),
r.base > r.price ? h('p', { class: 'g1-warn' }, `Giá nhà nước (${money(r.base)}) cao hơn giá hợp đồng → thuế, lệ phí tính trên giá nhà nước.`) : null,
h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl g1-tbl g1-stack', 'data-testid': 'g1-tax-table' },
h('thead', null, h('tr', null, h('th', null, 'Khoản'), h('th', null, 'Ai trả'), h('th', { class: 'n' }, 'Số tiền'))),
h('tbody', null, r.items.map((i) => h('tr', { 'data-testid': 'g1-tax-row-' + i.key },
h('td', null, h('b', null, i.label), i.note ? h('div', { class: 'sl-small sl-muted' }, i.note) : null, i.legal ? h('div', { class: 'g1-legal' }, i.legal) : null,
_ov(G.taxSourceFor(r.cfg, i.key))),
h('td', { 'data-l': 'Ai trả' }, _o1[i.payer] || i.payer), h('td', { class: 'n', 'data-l': 'Số tiền' }, S.fmtVnd(i.amount))))))),
h('p', { class: 'g1-warn', 'data-testid': 'g1-tax-check' }, `Mức thuế, phí theo quy định áp dụng tại ngày ${G.dmy(r.cfg.checked_at)}${G.taxStamp(cfgOver).ai ? ' (cập nhật qua AI)' : ''}. Số tham khảo – kiểm tra lại với cơ quan thuế và văn phòng công chứng trước khi giao dịch.`),
h('div', { class: 'sl-row' }, _o0.button('📋 Chép gửi khách', () => copyText(r), { testid: 'g1-tax-copy' }))),
_o8());
}
function copyText(r) {
const _oh = [`Ước tính thuế, phí ${_ox.mode === 'secondary' ? 'chuyển nhượng' : 'mua từ chủ đầu tư'} – giá ${money(r.price)}:`,
...r.items.map((i) => `• ${i.label}${/\d\/\d\)$/.test(i.label) ? '' : ` (${(_o1[i.payer] || '').toLowerCase()})`}: ${i.amount ? S.fmtVnd(i.amount) : (i.note || '0 đ')}`),
`→ Bên mua thực trả: ${money(r.buyerPays)}`, _ox.mode === 'secondary' ? `→ Bên bán thực nhận: ${money(r.sellerGets)}` : '',
`Mức thu cập nhật ngày ${G.dmy(r.cfg.checked_at)} – số tham khảo, cần kiểm tra lại với cơ quan thuế.`].filter(Boolean);
_o0.copy(_oh.join('\n')).then(() => _o0.toast('Đã chép – dán vào Zalo cho khách.', 'ok'));
}
let _o9 = false;
function _o8() {
if (!_o7) return null;
const _o5 = cfg();
const _on = h('input', { value: S.fmtNum(_o5.pit_rate * 100, 3), inputmode: 'decimal', 'data-testid': 'g1-tax-cfg-pit' });
const _oi = h('input', { value: S.fmtNum(_o5.lptb_rate * 100, 3), inputmode: 'decimal', 'data-testid': 'g1-tax-cfg-lptb' });
const _oc = h('input', { value: S.fmtNum(_o5.lptb_online_discount * 100, 2), inputmode: 'decimal' });
const _ob = h('input', { type: 'date', value: _o5.checked_at });
return h('details', { class: 'sl-box', open: _o9, ontoggle: (e) => { _o9 = e.target.open; } }, h('summary', null, 'Mức thu đang dùng (Quản trị/Quản lý sửa khi luật đổi)'),
h('div', { class: 'sl-form' }, h('label', { class: 'sl-f' }, 'Thuế TNCN (%)', _on), h('label', { class: 'sl-f' }, 'Lệ phí trước bạ (%)', _oi),
h('label', { class: 'sl-f' }, 'Giảm lệ phí trước bạ khi nộp trực tuyến (%)', _oc), h('label', { class: 'sl-f' }, 'Ngày đối chiếu', _ob)),
h('p', { class: 'g1-legal' }, 'Phí công chứng: ' + _o5.legal.notary + ' – ' + _o5.notary_tiers.length + ' bậc, tối đa ' + money(_o5.notary_max) + '.'),
_ow(_o5),
h('div', { class: 'sl-row sl-end' }, _o0.button('Lưu mức thu', async () => {
const _oy = { pit_rate: G.numDec(_on.value) / 100, lptb_rate: G.numDec(_oi.value) / 100, lptb_online_discount: G.numDec(_oc.value) / 100, checked_at: _ob.value || _o5.checked_at };
if (![_oy.pit_rate, _oy.lptb_rate, _oy.lptb_online_discount].every((x) => isFinite(x) && x >= 0 && x < 0.5)) { _o0.toast('Mức thu chưa hợp lệ.', 'warn'); return; }
const next = G.markTaxManual(cfgOver, _oy);
await _o0.setSetting('g1.pub.tax', next);
cfgOver = next;
_o0.toast('Đã lưu mức thu cho cả công ty.', 'ok'); _oq(); _op(); _o6();
}, { kind: 'primary', testid: 'g1-tax-cfg-save' })));
}
function _ov(_ot) {
if (!_ot) return null;
return h('div', { class: 'sl-small sl-muted g1-src' }, 'Nguồn AI: ', h('a', { href: G.safeUrl(_ot.url), target: '_blank', rel: 'noopener' }, _ot.name || G.hostOf(_ot.url) || 'link'),
_ot.date ? ' · ngày ' + G.dmy(_ot.date) : '', _ot.effective ? ' · hiệu lực ' + G.dmy(_ot.effective) : '');
}
function _ow(_o5) {
const items = G.TAX_FRESH_ITEMS.filter((it) => _o5.src[it.key] && G.safeUrl(_o5.src[it.key].url));
if (!items.length) return null;
return h('div', { class: 'sl-col', 'data-testid': 'g1-tax-cfg-src' }, h('b', { class: 'sl-small' }, 'Nguồn lần cập nhật qua AI:'),
items.map((it) => h('div', null, h('span', { class: 'sl-small' }, it.label + (_o5.src[it.key].legal ? ' – ' + _o5.src[it.key].legal : '')), _ov(_o5.src[it.key]))));
}
let _om = null;
function _of(parsed) {
const items = G.normFreshTax(parsed, { cfgOver, todayISO: env.today });
_om = new Set(items.filter((r) => r.ok).map((r) => r.key));
if (!items.length) return h('p', { class: 'g1-warn', 'data-testid': 'g1-tax-fresh-empty' }, 'AI chưa trả về mục thuế phí nào đọc được – bấm "Chạy lại" sau ít phút.');
const _o4 = items.map((r) => h('tr', { 'data-testid': 'g1-tax-fresh-row-' + r.key },
h('td', null, h('label', { class: 'g1-pick' }, h('input', { type: 'checkbox', checked: _om.has(r.key), disabled: !r.ok, 'aria-label': 'Lưu ' + r.label, 'data-testid': 'g1-tax-fresh-pick-' + r.key,
onchange: (e) => { if (e.target.checked) _om.add(r.key); else _om.delete(r.key); } }))),
h('td', null, h('b', null, r.label)),
h('td', { 'data-l': 'Đang dùng' }, r.current),
h('td', { 'data-l': 'AI tìm được' }, h('b', { class: r.changed ? 'sl-bad' : null }, r.show), r.changed ? h('div', { class: 'sl-small sl-bad' }, 'Khác mức đang dùng') : null),
h('td', { 'data-l': 'Căn cứ' }, r.legal || '—', r.effective ? h('div', { class: 'sl-small sl-muted' }, 'Hiệu lực ' + G.dmy(r.effective)) : null),
h('td', { class: 'g1-src', 'data-l': 'Nguồn' }, r.source_url ? h('a', { href: r.source_url, target: '_blank', rel: 'noopener' }, r.source_name || G.hostOf(r.source_url) || 'link') : h('span', { class: 'sl-bad' }, 'Không có link'),
h('div', { class: 'sl-small sl-muted' }, r.date ? 'Ngày ' + G.dmy(r.date) : 'Không ghi ngày')),
h('td', null, [...r.issues.map((x) => h('div', { class: 'sl-small sl-bad' }, x)), ...r.warns.map((x) => h('div', { class: 'sl-small sl-muted' }, x))])));
const _oj = G.TAX_FRESH_ITEMS.filter((it) => !items.some((r) => r.key === it.key)).map((it) => it.label);
return h('div', { class: 'sl-col', 'data-testid': 'g1-tax-fresh-table' },
h('p', { class: 'sl-small' }, 'So mức ĐANG DÙNG với mức AI tìm được. Bỏ tích mục nào không muốn đổi; mục không tích, không hợp lệ hoặc AI không tìm được sẽ GIỮ cấu hình cũ.'),
h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl g1-tbl g1-stack' },
h('thead', null, h('tr', null, ...['Lưu', 'Khoản', 'Đang dùng', 'AI tìm được', 'Văn bản căn cứ', 'Nguồn · ngày', 'Ghi chú'].map((t) => h('th', null, t)))),
h('tbody', null, _o4))),
_oj.length ? h('p', { class: 'sl-small sl-muted' }, 'AI không tìm được: ' + _oj.join(', ') + ' – giữ cấu hình cũ.') : null,
h('p', { class: 'g1-legal' }, 'Số do AI đọc từ văn bản/trang nguồn – chỉ mang tính tham khảo, kiểm tra lại với cơ quan thuế trước khi tư vấn.'));
}
async function _oe(parsed, meta) {
const _og = await _o0.setting('g1.pub.tax', null);
const items = G.normFreshTax(parsed, { cfgOver: _og, todayISO: env.today });
const _ou = items.filter((r) => r.ok && (_om ? _om.has(r.key) : true)).map((r) => r.key);
if (!_ou.length) throw new Error('Chưa chọn mục nào có link nguồn để lưu');
const _or = G.mergeFreshTax(_og, items, { selected: _ou, atISO: G.isoVN(meta.at), reputable: meta.reputable });
await _o0.setSetting('g1.pub.tax', _or.cfg);
cfgOver = _or.cfg;
_oq(); _op(); _o6();
}
const _od = _o7 ? freshButton(_o0, ctx, {
topic: 'tax', title: 'Cập nhật thuế, phí chuyển nhượng qua AI', testid: 'g1-tax-fresh',
prompt: () => freshPrompt('tax', { ask: G.TAX_FRESH_ASK, shape: G.TAX_FRESH_SHAPE }),
render: (parsed) => _of(parsed), onSave: _oe,
}) : null;
_oq(); _op(); _o6();
return _os;
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

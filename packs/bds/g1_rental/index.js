import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as U from '../g1_lib/ui.js';
const _o1 = 'bds.g1.rental';
export async function mount(el, ctx) {
S.ensureSalesCss(); U.ensureCss();
const _o0 = kit(ctx);
const env = await S.loadEnv(ctx);
const money = env.money;
let saved = {}; try { saved = JSON.parse(localStorage.getItem(_o1) || '{}') || {}; } catch { saved = {}; }
const _of = { price: '', buyCosts: '', furniture: '', loanPct: '50', rate: String(env.cfg.RATE || 10), years: '20', method: 'annuity', rent: '', occupancy: '92',
mgmt: '5', maint: '', other: '', rentGrowth: '3', priceGrowth: '4', horizon: '10', sellCost: '3', taxOn: true, threshold: '500', ...saved };
const _oe = h('div', { class: 'sl g1', 'data-testid': 'g1-rental' });
el.innerHTML = ''; el.appendChild(_oe);
const form = h('div', { class: 'sl-box sl-col' }), out = h('div', { class: 'sl-col', 'aria-live': 'polite' });
_oe.append(U.title('Đầu tư cho thuê'), h('p', { class: 'g1-lead' }, 'Mua căn để cho thuê có lời không: lợi suất, tiền thuê có đủ trả nợ, bao lâu hoà vốn.'), h('div', { class: 'sl-two' }, form, out));
const P = (v) => G.numDec(v);
const _o8 = (v) => { const _o9 = P(v); return isFinite(_o9) ? (_o9 < 1e5 ? _o9 * 1e9 : _o9) : NaN; };
const tr = (v) => { const _o9 = S.parseNum(v); return isFinite(_o9) ? (_o9 < 1e4 ? _o9 * 1e6 : _o9) : NaN; };
const _od = (v) => { const _o9 = P(v); return isFinite(_o9) ? (_o9 < 1e4 ? _o9 * 1e6 : _o9) : NaN; };
const _o7 = (key, label, tid) => h('label', { class: 'sl-f' }, label, h('input', { type: 'text', inputmode: 'decimal', value: _of[key], 'data-testid': tid, oninput: (e) => { _of[key] = e.target.value; _o4(); } }));
form.append(
h('div', { class: 'sl-form' },
_o7('price', 'Giá mua (tỷ)', 'g1-rent-price'), _o7('buyCosts', 'Thuế phí khi mua (triệu)', 'g1-rent-buycost'), _o7('furniture', 'Nội thất (triệu)', 'g1-rent-furn'),
_o7('loanPct', 'Vay (% giá)', 'g1-rent-loan'), _o7('rate', 'Lãi vay (%/năm)', 'g1-rent-rate'), _o7('years', 'Số năm vay', 'g1-rent-years'),
h('label', { class: 'sl-f' }, 'Cách trả', _o0.select([['annuity', 'Trả đều mỗi tháng'], ['equal', 'Gốc đều, lãi giảm dần']], _of.method, { onchange: (e) => { _of.method = e.target.value; _o4(); } }))),
h('h3', null, 'Cho thuê'),
h('div', { class: 'sl-form' },
_o7('rent', 'Giá thuê (triệu/tháng)', 'g1-rent-rent'), _o7('occupancy', 'Tỷ lệ có khách (%)', 'g1-rent-occ'), _o7('mgmt', 'Phí quản lý cho thuê (% tiền thuê)', 'g1-rent-mgmt'),
_o7('maint', 'Sửa chữa, bảo trì (triệu/năm)', 'g1-rent-maint'), _o7('other', 'Phí dịch vụ, bảo hiểm (triệu/năm)', 'g1-rent-other'),
_o7('rentGrowth', 'Tăng giá thuê (%/năm)', 'g1-rent-rg'), _o7('priceGrowth', 'Tăng giá căn (%/năm)', 'g1-rent-pg'), _o7('horizon', 'Giữ căn (năm)', 'g1-rent-h'), _o7('sellCost', 'Chi phí khi bán (% giá)', 'g1-rent-sell')),
h('label', { class: 'g1-check' }, h('input', { type: 'checkbox', checked: _of.taxOn, 'data-testid': 'g1-rent-tax', onchange: (e) => { _of.taxOn = e.target.checked; _o4(); } }),
h('span', null, 'Tính thuế cho thuê (GTGT 5% + TNCN 5% phần doanh thu vượt ngưỡng)')),
h('div', { class: 'sl-form' }, _o7('threshold', 'Ngưỡng doanh thu không chịu thuế (triệu/năm)', 'g1-rent-th')),
h('p', { class: 'g1-legal' }, 'Ngưỡng 500 triệu/năm theo Luật Thuế TNCN 109/2025/QH15 và hướng dẫn 2026 (tin pháp luật); các nguồn còn khác nhau về cách tính GTGT – sửa được ở ô trên, kiểm tra lại với cơ quan thuế.'));
function _o4() {
try { localStorage.setItem(_o1, JSON.stringify(_of)); } catch { }
const price = _o8(_of.price), rent = _od(_of.rent);
if (!(price > 0) || !(rent > 0)) { out.replaceChildren(h('div', { class: 'sl-box sl-muted' }, 'Nhập giá mua và giá thuê để xem kết quả.')); return; }
const _o3 = (k) => String(_of[k]).trim() === '';
const _o5 = (k) => (_o3(k) ? '' : P(_of[k]));
const _o2 = G.rangeErrors([['Giá mua', _o3('price') ? '' : price / 1e9, 0.001, 100000, 'tỷ'], ['Giá thuê', _o3('rent') ? '' : rent / 1e6, 0.1, 100000, 'triệu/tháng'],
['Thuế phí khi mua', _o3('buyCosts') ? '' : tr(_of.buyCosts) / 1e6, 0, 1e6, 'triệu'], ['Nội thất', _o3('furniture') ? '' : tr(_of.furniture) / 1e6, 0, 1e6, 'triệu'],
['Vay', _o5('loanPct'), 0, 100, '% giá'], ['Lãi vay', _o5('rate'), 0, 100, '%/năm'], ['Số năm vay', _o5('years'), 1, 50, 'năm'], ['Tỷ lệ có khách', _o5('occupancy'), 0, 100, '%'],
['Phí quản lý cho thuê', _o5('mgmt'), 0, 100, '%'], ['Sửa chữa, bảo trì', _o3('maint') ? '' : tr(_of.maint) / 1e6, 0, 1e6, 'triệu/năm'], ['Phí dịch vụ, bảo hiểm', _o3('other') ? '' : tr(_of.other) / 1e6, 0, 1e6, 'triệu/năm'],
['Tăng giá thuê', _o5('rentGrowth'), -50, 100, '%/năm'], ['Tăng giá căn', _o5('priceGrowth'), -50, 100, '%/năm'], ['Giữ căn', _o5('horizon'), 1, 40, 'năm'], ['Chi phí khi bán', _o5('sellCost'), 0, 50, '%'],
['Ngưỡng doanh thu không chịu thuế', _of.threshold, 0, 1e6, 'triệu/năm']]);
if (_o2.length) { out.replaceChildren(h('div', { class: 'g1-err', role: 'alert', 'data-testid': 'g1-rent-errors' }, h('b', null, 'Có ô nhập chưa hợp lý – sửa rồi hệ thống tính lại:'), h('ul', null, _o2.map((x) => h('li', null, x))))); return; }
const _oa = (k) => (P(_of[k]) || 0) / 100;
const _oc = G.rentalPlan({ price, buyCosts: tr(_of.buyCosts) || 0, furniture: tr(_of.furniture) || 0, loanAmount: Math.round(price * _oa('loanPct')), ratePct: P(_of.rate) || 0, years: P(_of.years) || 20, method: _of.method,
rentMonthly: rent, occupancy: _oa('occupancy'), mgmtRate: _oa('mgmt'), maintYear: tr(_of.maint) || 0, otherYear: tr(_of.other) || 0, rentGrowth: _oa('rentGrowth'), priceGrowth: _oa('priceGrowth'),
horizon: P(_of.horizon) || 10, sellCostRate: _oa('sellCost'), tax: { enabled: _of.taxOn, threshold: G.numOr(_of.threshold, 500) * 1e6 } });
const _ob = (x) => isFinite(x) ? S.fmtNum(x * 100, 2) + '%' : '–';
const _o6 = _oc.monthlyGap >= 0;
out.replaceChildren(
h('div', { class: 'sl-box sl-col' },
h('div', { class: 'sl-kpis' },
h('div', { class: 'sl-kpi' }, h('small', null, 'Lợi suất gộp'), h('b', { 'data-testid': 'g1-rent-gross' }, _ob(_oc.grossYield))),
h('div', { class: 'sl-kpi' }, h('small', null, 'Lợi suất ròng (năm 1)'), h('b', { 'data-testid': 'g1-rent-net' }, _ob(_oc.netYield))),
h('div', { class: 'sl-kpi' }, h('small', null, 'Tiền tự bỏ ra'), h('b', null, money(_oc.equity))),
h('div', { class: 'sl-kpi' }, h('small', null, 'Lãi trên vốn tự có (năm 1)'), h('b', null, _ob(_oc.cashOnCash))),
h('div', { class: 'sl-kpi' }, h('small', null, `Lãi bình quân/năm nếu giữ ${_oc.years.length} năm rồi bán (IRR)`), h('b', { 'data-testid': 'g1-rent-irr' }, _ob(_oc.irr)))),
_oc.loanAmt > 0 ? h('div', { class: _o6 ? 'g1-okbox' : 'g1-warn', 'data-testid': 'g1-rent-gap' },
`Thuê so với trả nợ: thu ròng ~${S.fmtVnd(_oc.monthlyRentNet)}/tháng, trả ngân hàng ${S.fmtVnd(_oc.monthlyDebt)}/tháng → ${_o6 ? 'dư ' : 'thiếu '}${S.fmtVnd(Math.abs(_oc.monthlyGap))}/tháng.` +
(_o6 || !(isFinite(_oc.rentToCover) && _oc.rentToCover > 0) ? '' : ` Cần giá thuê ~${S.fmtVnd(_oc.rentToCover)}/tháng mới đủ trả nợ.`)) : null,
h('p', { 'data-testid': 'g1-rent-payback' },
h('b', null, 'Hoà vốn: '), _oc.payback ? `chỉ bằng tiền thuê sau ${_oc.payback} năm. ` : `tiền thuê chưa đủ hoàn vốn trong ${_oc.years.length} năm. `,
_oc.paybackSale ? `Tính cả bán lại căn: hoà vốn từ năm ${_oc.paybackSale}.` : 'Tính cả bán lại vẫn chưa hoà vốn trong thời gian giữ.')),
h('div', { class: 'sl-box' }, h('h3', null, 'Dòng tiền từng năm'), h('p', { class: 'sl-small sl-muted g1-swipe' }, '↔ Vuốt ngang bảng để xem đủ cột.'), h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl', 'data-testid': 'g1-rent-years' },
h('thead', null, h('tr', null, ...['Năm', 'Tiền thuê', 'Chi phí + thuế', 'Trả ngân hàng', 'Dòng tiền', 'Cộng dồn', 'Nếu bán (ròng)'].map((x, i) => h('th', { class: i ? 'n' : '' }, x)))),
h('tbody', null, _oc.years.map((y) => h('tr', null, h('td', null, String(y.y)), h('td', { class: 'n' }, G.moneyFine(y.gross)), h('td', { class: 'n' }, G.moneyFine(y.opex + y.tax)),
h('td', { class: 'n' }, G.moneyFine(y.debt)), h('td', { class: 'n ' + (y.cf < 0 ? 'sl-bad' : '') }, G.moneyFine(y.cf)), h('td', { class: 'n' }, G.moneyFine(y.cum)), h('td', { class: 'n' }, G.moneyFine(y.exit))))))),
h('p', { class: 'sl-muted sl-small' }, 'Giả định do anh/chị nhập; giá thuê, tăng giá chỉ là dự phóng, không phải cam kết lợi nhuận.'),
h('div', { class: 'sl-row' }, _o0.button('📋 Chép gửi khách', () => {
const t = [`Bài toán cho thuê – giá mua ${money(price)}, thuê ${S.fmtVnd(rent)}/tháng:`, `• Lợi suất gộp ${_ob(_oc.grossYield)}, ròng ${_ob(_oc.netYield)}`,
_oc.loanAmt > 0 ? `• Vay ${money(_oc.loanAmt)}: trả ${S.fmtVnd(_oc.monthlyDebt)}/tháng, tiền thuê ròng ${S.fmtVnd(_oc.monthlyRentNet)}/tháng` : '',
_oc.paybackSale ? `• Tính cả bán lại: hoà vốn từ năm ${_oc.paybackSale}` : '', 'Số liệu dự phóng, không phải cam kết lợi nhuận.'].filter(Boolean).join('\n');
_o0.copy(t).then(() => _o0.toast('Đã chép – dán vào Zalo.', 'ok'));
}, { testid: 'g1-rent-copy' }))));
}
_o4();
return _oe;
}
export default {
manifest: { id: 'g1_rental', title: 'Đầu tư cho thuê', icon: '🔑', screen: 'sales', order: 180, version: '0.1.0', status: 'ready',
help: 'Lợi suất cho thuê, tiền thuê so với tiền trả nợ, dòng tiền từng năm, thời gian hoà vốn, IRR khi bán lại.' },
mount,
async selftest() {
const _oc = G.rentalPlan({ price: 3e9, rentMonthly: 15e6, horizon: 30 });
return _oc.payback === 17 ? { ok: true } : { ok: false, details: 'Tính hoà vốn lệch' };
},
};

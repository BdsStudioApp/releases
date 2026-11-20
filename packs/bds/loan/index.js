import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
const _o2 = 'http://www.w3.org/2000/svg';
function _ol(tag, attrs, ...kids) {
const e = document.createElementNS(_o2, tag);
for (const [k, _on] of Object.entries(attrs || {})) e.setAttribute(k, _on);
kids.forEach((k) => k && e.appendChild(typeof k === 'string' ? document.createTextNode(k) : k));
return e;
}
export function chart(rows, money) {
const _o4 = S.yearlyBars(rows), W = 320, H = 130;
const L = S.barLayout(_o4, W, H - 14);
const _oh = _ol('svg', { viewBox: `0 0 ${W} ${H}`, class: 'sl-chart', role: 'img', 'aria-label': 'Số tiền trả mỗi năm: gốc (xanh than) và lãi (vàng)', 'data-testid': 'loan-chart' });
L.forEach((_o3) => {
const _o7 = _ol('g');
_o7.appendChild(_ol('title', null, `Năm ${_o3.year}: ${money(_o3.pay)}`));
_o7.appendChild(_ol('rect', { x: _o3.x.toFixed(2), y: _o3.yP.toFixed(2), width: _o3.w.toFixed(2), height: Math.max(0, _o3.hP).toFixed(2), fill: '#0F1E33', rx: 1 }));
_o7.appendChild(_ol('rect', { x: _o3.x.toFixed(2), y: _o3.yI.toFixed(2), width: _o3.w.toFixed(2), height: Math.max(0, _o3.hI).toFixed(2), fill: '#C9A24A', rx: 1 }));
_oh.appendChild(_o7);
});
const _ok = Math.max(1, Math.ceil(L.length / 6));
L.forEach((_o3, i) => { if (i % _ok === 0) _oh.appendChild(_ol('text', { x: (_o3.x + _o3.w / 2).toFixed(1), y: H - 2, 'font-size': 9, 'text-anchor': 'middle', fill: 'currentColor' }, 'N' + _o3.year)); });
return _oh;
}
export async function mount(el, ctx) {
S.ensureSalesCss();
const _o0 = kit(ctx);
const env = await S.loadEnv(ctx);
const money = env.money;
const _oc = S.hashParams();
const sellable = env.projects.filter(S.sellable);
const _oj = {
mode: _oc.get('project') ? 'project' : 'price', price: _oc.get('price') || '5', project: _oc.get('project') || (sellable[0] && sellable[0].id) || '',
type: _oc.get('type') || '', area: '', unitPrice: '', loanPct: '70', rate: String(env.cfg.RATE || 10), years: String(env.cfg.LOAN_YEARS || 25),
grace: '0', support: '0', method: 'equal', table: document.body && document.body.dataset.density === 'detail',
};
const _of = h('div', { class: 'sl', 'data-testid': 'loan' });
el.innerHTML = '';
el.appendChild(_of);
const form = h('div', { class: 'sl-box' });
const _o9 = h('div', { class: 'sl-col', 'aria-live': 'polite' });
_of.append(h('h2', null, 'Máy tính vay'), h('div', { class: 'sl-two' }, form, _o9));
const _o8 = (key, label, attrs = {}) => h('label', { class: 'sl-f' }, label,
h('input', { type: 'text', inputmode: 'decimal', value: _oj[key], 'data-testid': 'loan-' + key, oninput: (e) => { _oj[key] = e.target.value; _o5(); }, ...attrs }));
const _oi = (key, label, opts, onchange) => h('label', { class: 'sl-f' }, label, _o0.select(opts, _oj[key], { 'data-testid': 'loan-' + key, onchange: (e) => { _oj[key] = e.target.value; onchange ? onchange() : _o5(); } }));
function project() { return env.project(_oj.project); }
function _om() { const _oa = project(); return _oa && (_oa.types.find((t) => t.n === _oj.type && !t.ask) || _oa.types.find((t) => !t.ask)); }
function _oe() {
const _oa = project(), t = _om();
if (_oa && t) { _oj.type = t.n; if (!_oj.area) _oj.area = S.fmtNum((t.a[0] + t.a[1]) / 2); if (!_oj.unitPrice) _oj.unitPrice = S.fmtNum(_oa.price[0], 1); }
form.replaceChildren(
h('div', { class: 'sl-tabs', role: 'group' },
...[['price', 'Nhập giá căn'], ['project', 'Chọn dự án']].map(([_on, l]) => h('button', { type: 'button', class: 'sl-chip' + (_oj.mode === _on ? ' on' : ''), 'data-testid': 'loan-mode-' + _on, onclick: () => { _oj.mode = _on; _oe(); _o5(); } }, l))),
_oj.mode === 'price'
? h('div', { class: 'sl-form' }, _o8('price', 'Giá căn (tỷ đồng)'))
: h('div', { class: 'sl-form' },
_oi('project', 'Dự án', sellable.map((x) => [x.id, x.name]), () => { _oj.type = ''; _oj.area = ''; _oj.unitPrice = ''; _oe(); _o5(); }),
_oi('type', 'Loại căn', _oa ? _oa.types.filter((x) => !x.ask).map((x) => [x.n, `${x.n} (${S.fmtNum(x.a[0])}–${S.fmtNum(x.a[1])} m²)`]) : [], () => { _oj.area = ''; _oe(); _o5(); }),
_o8('area', 'Diện tích (m²)'), _o8('unitPrice', 'Đơn giá (triệu/m²)')),
h('div', { class: 'sl-form' },
_o8('loanPct', 'Vay (% giá căn)'), _o8('rate', 'Lãi suất (%/năm)'), _o8('years', 'Số năm vay'),
_o8('grace', 'Ân hạn gốc (tháng)'), _o8('support', 'Hỗ trợ lãi 0% (tháng)'),
_oi('method', 'Cách trả', [['equal', 'Gốc đều, lãi giảm dần'], ['annuity', 'Trả đều mỗi tháng']])),
h('p', { class: 'sl-muted sl-small' }, 'Ân hạn gốc: chỉ trả lãi. Hỗ trợ lãi: chủ đầu tư trả lãi thay trong số tháng đó.'));
}
function _ob() {
if (_oj.mode === 'price') { const _on = S.parseNum(_oj.price); return isFinite(_on) ? (_on < 1e5 ? _on * 1e9 : _on) : NaN; }
const a = S.parseNum(_oj.area), u = S.parseNum(_oj.unitPrice);
return isFinite(a) && isFinite(u) ? Math.round(a * u * 1e6) : NaN;
}
function _o5() {
const price = _ob(), pct = S.parseNum(_oj.loanPct), rate = S.parseNum(_oj.rate), years = S.parseNum(_oj.years);
const grace = Math.max(0, S.parseNum(_oj.grace) || 0), support = Math.max(0, S.parseNum(_oj.support) || 0);
if (!(price > 0) || !(pct > 0) || pct > 100 || !(rate >= 0) || !(years > 0) || years > 50) {
const _oo = !(price > 0) ? (_oj.mode === 'price' ? 'Nhập giá căn (tỷ đồng) lớn hơn 0, ví dụ 5.' : 'Nhập diện tích (m²) và đơn giá (triệu đồng/m²) lớn hơn 0.')
: !(pct > 0) || pct > 100 ? 'Nhập % vay trong khoảng 1–100, ví dụ 70.'
: !(rate >= 0) ? 'Nhập lãi suất (%/năm), ví dụ 10.'
: 'Nhập số năm vay trong khoảng 1–50, ví dụ 25.';
_o9.replaceChildren(h('div', { class: 'sl-box sl-muted', 'data-testid': 'loan-why' }, _oo));
return;
}
const principal = Math.round(price * pct / 100 / 1000) * 1000;
const _o1 = S.loanSchedule({ principal, rate, years, grace, support, method: _oj.method });
const _og = _oj.table ? h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl', 'data-testid': 'loan-table' },
h('thead', null, h('tr', null, h('th', null, 'Tháng'), h('th', { class: 'n' }, 'Gốc'), h('th', { class: 'n' }, 'Lãi'), h('th', { class: 'n' }, 'Phải trả'), h('th', { class: 'n' }, 'Dư nợ'))),
h('tbody', null, _o1.rows.map((_od) => h('tr', null, h('td', null, String(_od.m)), h('td', { class: 'n' }, S.fmtVnd(_od.principal)),
h('td', { class: 'n' }, _od.supported ? 'CĐT hỗ trợ' : S.fmtVnd(_od.interest)), h('td', { class: 'n' }, S.fmtVnd(_od.pay)), h('td', { class: 'n' }, S.fmtVnd(_od.balance))))))) : null;
_o9.replaceChildren(
h('div', { class: 'sl-box' },
h('div', { class: 'sl-kpis' },
h('div', { class: 'sl-kpi' }, h('small', null, 'Số tiền vay'), h('b', { 'data-testid': 'loan-principal' }, money(principal))),
h('div', { class: 'sl-kpi' }, h('small', null, `Trả tháng đầu (tháng ${_o1.firstPayMonth})`), h('b', { 'data-testid': 'loan-first' }, S.fmtVnd(_o1.firstPay))),
h('div', { class: 'sl-kpi' }, h('small', null, 'Trả tháng cuối'), h('b', { 'data-testid': 'loan-last' }, S.fmtVnd(_o1.lastPay))),
_o1.supportedInterest ? h('div', { class: 'sl-kpi' }, h('small', null, 'Lãi được hỗ trợ'), h('b', null, money(_o1.supportedInterest))) : null),
grace ? h('p', { class: 'sl-muted sl-small' }, `Trong ${Math.min(grace, _o1.months - 1)} tháng ân hạn chỉ trả lãi, khoảng ${S.fmtVnd(principal * rate / 1200)} mỗi tháng${support >= 1 ? ` (các tháng được hỗ trợ lãi thì trả 0 đ)` : ''}.`) : null,
chart(_o1.rows, money),
h('div', { class: 'sl-row sl-sp' }, h('span', { class: 'sl-muted sl-small' }, '■ Gốc (xanh than)  ■ Lãi (vàng) – theo năm'),
_o0.button(_oj.table ? 'Ẩn bảng chi tiết' : 'Xem bảng chi tiết', () => { _oj.table = !_oj.table; _o5(); }, { kind: 'ghost', testid: 'loan-toggle-table' })),
_og),
_o6(rate, years));
}
function _o6(rate, years) {
if (_oj.mode !== 'project') return null;
const _oa = project(), t = _om();
if (!_oa || !t) return null;
const { plans, policy } = env.plansFor(_oa);
const _od = S.earlyVsLoan({ project: _oa, plans, type: t.n, area: S.parseNum(_oj.area), unitPrice: S.parseNum(_oj.unitPrice), rate, years, method: _oj.method });
if (!_od) return null;
return h('div', { class: 'sl-box', 'data-testid': 'loan-compare' },
h('h3', null, 'Vay hay trả sớm: chênh bao nhiêu?'),
h('table', { class: 'sl-tbl' }, h('tbody', null,
h('tr', null, h('td', null, `Giá nếu ${_od.early.plan.name.toLowerCase()}`), h('td', { class: 'n' }, money(_od.early.total))),
h('tr', null, h('td', null, `Giá nếu ${_od.loan.plan.name.toLowerCase()}`), h('td', { class: 'n' }, money(_od.loan.total))),
h('tr', null, h('td', null, 'Chênh lệch (phải trả thêm khi vay)'), h('td', { class: 'n' }, money(_od.gap))),
h('tr', null, h('td', null, `Tiền lãi được hỗ trợ ~${_od.loan.loan.support} tháng (lãi ${S.fmtNum(rate)}%)`), h('td', { class: 'n' }, money(_od.supported))))),
h('p', { class: _od.verdict === 'early' ? 'sl-bad' : 'sl-ok' }, _od.text),
h('p', { class: 'sl-muted sl-small' }, `${S.policyLabel(policy)} · căn ${t.n} ${S.fmtNum(S.parseNum(_oj.area))} m².`));
}
_oe();
_o5();
return _of;
}
export default {
manifest: {
id: 'loan', title: 'Máy tính vay', icon: '🏦', screen: 'sales', order: 30, version: '1.0.0', status: 'ready',
help: 'Tính trả tháng đầu/cuối, ân hạn và hỗ trợ lãi; gốc đều hoặc trả đều; so sánh vay với trả sớm theo chính sách dự án.',
},
mount,
async selftest(ctx) {
const _od = await S.selftestSales(ctx, ['loan.monthly']);
try {
const L = (ctx && ctx.logic) || globalThis.BDSLogic;
const a = S.loanSchedule({ principal: 3e9, rate: 10, years: 20, grace: 12, support: 12, method: 'annuity' });
const _o3 = L.loan.monthly({ principal: 3e9, ratePct: 10, years: 20, graceMonths: 12, supportMonths: 12, method: 'annuity' });
if (Math.abs(a.firstPay - _o3.first) > 1) return { ok: false, details: 'Lịch vay lệch BDSLogic.loan.monthly' };
} catch (e) { if (_od.ok) return { ok: false, details: 'Đối chiếu vay lỗi: ' + (e && e.message) }; }
return _od;
},
};

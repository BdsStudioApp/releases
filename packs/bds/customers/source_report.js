import { kit, h } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import * as SR from '../_lib/source_roi.js';
const _o1 = 'bds.sources.period';
function _ob() { try { return localStorage.getItem(_o1) || 'week'; } catch { return 'week'; } }
function _ol(v) { try { localStorage.setItem(_o1, v); } catch { } }
function _o9(ctx) { const _op = ctx.user; return !_op || _op.legacy || !_op.role || _op.role === 'owner'; }
const _of = v => (v === null || v === undefined ? '–' : String(v).replace('.', ',') + '%');
export async function openSourceReport(ctx) {
const _o0 = kit(ctx);
const _on = { period: _ob() };
const _oe = _o9(ctx);
const body = h('div', { class: 'cu-sr', 'data-testid': 'sr-body' });
const _om = _o0.sheet({ title: 'Nguồn nào ra khách', body, testid: 'source-report-sheet' });
let tiers = null;
try { tiers = crm.heatTiers(await _o0.setting('g2.score', null)); } catch { tiers = null; }
async function _oi() {
const range = SR.periodRange(_on.period, Date.now());
const [objs, reminders, events, costs] = await Promise.all([_o0.list('objects'), _o0.list('reminders'), _o0.list('events'), _o0.setting(SR.COSTS_KEY, {})]);
let _ok = true; try { _ok = !ctx.packs || ctx.packs.moduleOn('g3_roi') !== false; } catch { _ok = true; }
const spends = _ok ? objs.filter(o => o.kind === 'g3_spend') : [];
const _oj = SR.buildReport({ customers: objs, reminders, events, ...range, costs, spends, tiers });
const _oh = SR.recommend(_oj);
body.innerHTML = '';
const sel = _o0.select(SR.PERIODS, _on.period, { 'aria-label': 'Kỳ báo cáo', 'data-testid': 'sr-period', onchange: e => { _on.period = e.target.value; _ol(_on.period); _oi(); } });
body.appendChild(h('div', { class: 'bds-row cu-sr-top' }, sel, h('strong', { 'data-testid': 'sr-label' }, _oj.label)));
body.appendChild(h('p', { class: 'bds-muted' }, 'Tính trên khách mới trong kỳ (theo ngày tạo hồ sơ), theo trạng thái hiện tại. Đã hẹn xem = trạng thái từ "Hẹn xem nhà" trở đi hoặc có lịch hẹn. Đã chốt = đặt cọc/mua/thuê.'));
const t = _oj.total;
body.appendChild(h('div', { class: 'cu-sr-kpis', 'data-testid': 'sr-total' },
_oa('khách mới', t.n, 'sr-n'), _oa('Nóng', t.hot, 'sr-hot'), _oa('đã hẹn xem', t.appt, 'sr-appt'), _oa('đã chốt', t.deal, 'sr-deal')));
body.appendChild(h('section', { class: 'cu-sr-recs', 'data-testid': 'sr-recs' },
h('h4', null, 'Khuyến nghị (tính theo luật, cần ≥ ' + SR.MIN_SAMPLE + ' khách mỗi nguồn)'),
h('ul', null, _oh.map(_og => h('li', { class: 'cu-sr-rec cu-sr-' + _og.tone, 'data-kind': _og.kind, 'data-source': _og.source || '' }, _og.text)))));
if (!t.n) {
body.appendChild(_o0.empty('Chưa đủ dữ liệu: kỳ này chưa có khách mới. Khi thêm khách, chọn Nguồn và Chi tiết nguồn để báo cáo đếm được.'));
} else {
body.appendChild(h('div', { class: 'cu-sr-list', 'data-testid': 'sr-table' }, _oj.groups.filter(g => g.n || g.cost).map(g => _o8(g, range, costs))));
}
const _o3 = h('div', { 'data-testid': 'sr-ai-out' });
body.appendChild(h('div', { class: 'bds-row bds-wrap' },
_o0.button('Xuất CSV', () => _o7(_oj, _oh), { icon: 'download', testid: 'sr-csv', title: 'Tệp CSV chỉ có số gộp theo nguồn – không có tên, số điện thoại khách' }),
_o0.button('AI nhận xét thêm', async () => {
try {
const _og = await ctx.ai.run('summarize', { prompt: SR.aiPrompt(_oj, _oh), feature: 'source_ai' });
const _oo = String(_og && _og.text || '').trim();
_o3.innerHTML = '';
if (_oo) _o3.appendChild(h('div', { class: 'cu-sr-ai' }, h('strong', null, 'AI nhận xét (tham khảo – số liệu ở bảng trên là chuẩn)'), h('p', null, _oo)));
} catch (e) { if (!_o0.isAiCancel(e)) _o0.toast('AI chưa trả lời: ' + ((e && (e.userMessage || e.message)) || e), 'warn'); }
}, { ai: 'source_ai', icon: 'sparkle', testid: 'sr-ai', title: 'Chỉ gửi số gộp theo nguồn cho AI – không gửi thông tin khách' })));
body.appendChild(_o3);
}
function _oa(label, v, testid) { return h('div', { class: 'cu-sr-kpi' }, h('b', { 'data-testid': testid }, String(v)), h('small', null, label)); }
function _o8(g, range, costs) {
const _od = `${g.n} khách · ${g.hot} Nóng · ${g.appt} hẹn xem · ${g.deal} chốt`;
const steps = h('p', { class: 'cu-sr-steps' },
'Nóng/khách: ', h('b', null, _of(g.rateHot)), ' · Hẹn/khách: ', h('b', null, _of(g.rateAppt)), ' · Chốt/hẹn: ', h('b', null, _of(g.rateDeal)),
g.n < SR.MIN_SAMPLE ? h('span', { class: 'bds-muted' }, ' · cỡ mẫu nhỏ (' + g.n + ' khách)') : null);
const _oc = SR.costOf(costs, range, g.key);
const costIn = h('input', { inputmode: 'numeric', value: _oc ? SR.money(_oc) : '', placeholder: g.costFrom === 'ads' && g.cost ? 'Từ quảng cáo đã nhập: ' + SR.money(g.cost) : 'VD: 3tr (tuỳ chọn)',
'data-testid': 'sr-cost-' + g.key, 'aria-label': 'Chi phí kỳ này cho ' + g.label, disabled: !_oe,
onchange: async e => {
const _o5 = await _o0.setting(SR.COSTS_KEY, {});
const v = e.target.value.trim();
if (v && !SR.parseCost(v)) { _o0.toast('Chưa hiểu số tiền – ví dụ: 3tr, 500k, 1.500.000', 'warn'); return; }
await _o0.setSetting(SR.COSTS_KEY, SR.setCost(_o5, range, g.key, v));
_o0.toast(v ? 'Đã lưu chi phí ' + g.label : 'Đã bỏ chi phí ' + g.label, 'success');
_oi();
} });
const costLine = g.cost
? h('p', { class: 'cu-sr-cost', 'data-testid': 'sr-cpl-' + g.key }, 'Chi phí ' + SR.money(g.cost) + (g.costFrom === 'ads' ? ' (từ quảng cáo đã nhập)' : '') + ' · ',
'Chi phí/khách: ', h('b', null, g.cpl === null ? 'chưa đủ dữ liệu' : SR.money(g.cpl)), ' · Chi phí/deal: ', h('b', null, g.cpd === null ? 'chưa có deal' : SR.money(g.cpd)))
: null;
const _o6 = g.details.length ? h('div', { class: 'cu-sr-scroll' }, h('table', { class: 'cu-sr-tbl', 'data-testid': 'sr-details-' + g.key },
h('thead', null, h('tr', null, ['Chi tiết', 'Khách', 'Nóng', 'Hẹn', 'Chốt', 'Hẹn/khách'].map(x => h('th', null, x)))),
h('tbody', null, g.details.map(d => h('tr', { 'data-detail': d.label },
h('td', null, d.label), h('td', null, String(d.n)), h('td', null, String(d.hot)), h('td', null, String(d.appt)), h('td', null, String(d.deal)), h('td', null, _of(d.rateAppt))))))) : null;
return h('details', { class: 'cu-sr-g', 'data-source': g.key, 'data-n': String(g.n) },
h('summary', null, h('strong', null, g.label), h('span', { class: 'cu-sr-nums', 'data-testid': 'sr-nums-' + g.key }, _od)),
steps, _o0.field('Chi phí kỳ này (tuỳ chọn)', costIn, _oe ? null : 'Chỉ Chủ app nhập chi phí.'), costLine, _o6);
}
function _o7(_oj, _oh) {
const _o4 = new Blob([SR.reportCsv(_oj, _oh)], { type: 'text/csv;charset=utf-8' });
const _o2 = h('a', { href: URL.createObjectURL(_o4), download: 'nguon-khach-' + _oj.from + '_' + _oj.to + '.csv' });
document.body.appendChild(_o2); _o2.click(); _o2.remove(); setTimeout(() => URL.revokeObjectURL(_o2.href), 4000);
_o0.toast('Đã xuất báo cáo nguồn khách', 'success');
}
await _oi();
_o0.on(body, ['objects', 'reminders', 'events'], () => { if (!body.querySelector('input:focus')) _oi(); });
return _om;
}

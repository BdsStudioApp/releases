import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import { phonePrompt } from '../_lib/my_phone.js';
const _o0 = '"Be Vietnam Pro", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
export async function renderPng(layout) {
const c = document.createElement('canvas');
c.width = layout.w; c.height = layout.h;
S.drawLayout(c.getContext('2d'), layout, _o0);
return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('Không tạo được ảnh'))), 'image/png'));
}
const _ox = (s) => S.fold(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'bao-gia';
export async function mount(el, ctx) {
S.ensureSalesCss();
const _o1 = kit(ctx);
const env = await S.loadEnv(ctx);
const money = env.money;
const profile = await S.getProfile(ctx);
{ const _o10 = ctx.user; if (_o10 && _o10.role && _o10.role !== 'owner') { profile.name = _o10.full_name || _o10.username || profile.name; profile.phone = _o10.phone || ''; } }
const _on = S.hashParams();
const customers = (await _o1.list('objects')).filter((o) => !o.kind || o.kind === 'customer');
const sellable = env.projects.filter(S.sellable);
const _oy = {
customer: _on.get('customer') || '', project: _on.get('project') || '', type: _on.get('type') || '', area: '', unitPrice: '',
plans: [], capital: '', rate: String(env.cfg.RATE || 10), years: String(env.cfg.LOAN_YEARS || 25), method: 'equal', imgPlan: '', saved: null,
};
const _o4 = () => customers.find((c) => c.id === _oy.customer) || null;
if (!_oy.project) { const c = _o4(); if (c && c.project && env.project(c.project)) _oy.project = c.project; }
if (!env.project(_oy.project) || !S.sellable(env.project(_oy.project))) _oy.project = (sellable[0] || {}).id || '';
{ const c = _o4(); if (c && c.budget && !_oy.capital) _oy.capital = S.fmtNum(Number(c.budget) / 1e9, 2); if (c && c.unit_type && !_oy.type) _oy.type = c.unit_type; }
const _ov = new Map();
const _os = h('div', { class: 'sl', 'data-testid': 'quote' });
el.innerHTML = '';
el.appendChild(_os);
const form = h('div', { class: 'sl-box sl-col' });
const out = h('div', { class: 'sl-col', 'aria-live': 'polite' });
const _o8 = h('div', { class: 'sl-col' });
const _oo = h('div', { class: 'sl-col' });
_os.append(h('h2', null, 'Báo giá'), h('div', { class: 'sl-two' }, form, h('div', { class: 'sl-col' }, out, _o8)), _oo);
const project = () => env.project(_oy.project);
const _oz = () => { const _oh = project(); return _oh && (_oh.types.find((t) => t.n === _oy.type && !t.ask) || _oh.types.find((t) => !t.ask)); };
const _ok = () => env.plansFor(project());
function _o9(key, label, attrs = {}) {
return h('label', { class: 'sl-f' }, label, h('input', { type: 'text', inputmode: 'decimal', value: _oy[key], 'data-testid': 'quote-' + key, oninput: (e) => { _oy[key] = e.target.value; _o2(); }, ...attrs }));
}
function _ow(key, label, opts, after) {
return h('label', { class: 'sl-f' }, label, _o1.select(opts, _oy[key], { 'data-testid': 'quote-' + key, onchange: (e) => { _oy[key] = e.target.value; after ? after() : _o2(); } }));
}
function _op() {
const _oh = project(), t = _oz(), { plans, policy } = _ok();
if (t) { _oy.type = t.n; if (!_oy.area) _oy.area = S.fmtNum((t.a[0] + t.a[1]) / 2); }
if (_oh && _oh.price && !_oy.unitPrice) _oy.unitPrice = S.fmtNum(_oh.price[0], 1);
_oy.plans = _oy.plans.filter((id) => plans.some((x) => x.id === id));
if (!_oy.plans.length && plans[0]) _oy.plans = [plans[0].id];
if (!_oy.plans.includes(_oy.imgPlan)) _oy.imgPlan = _oy.plans[0] || '';
const pick = h('div', { class: 'sl-planpick', role: 'group', 'aria-label': 'Phương án (tối đa 3)' }, plans.map((pl) => {
const _of = _oy.plans.includes(pl.id);
const cb = h('input', { type: 'checkbox', checked: _of, disabled: !_of && _oy.plans.length >= 3, 'data-testid': 'plan-pick-' + pl.id,
onchange: (e) => { if (e.target.checked) { if (_oy.plans.length < 3) _oy.plans.push(pl.id); } else _oy.plans = _oy.plans.filter((x) => x !== pl.id); _op(); _o2(); } });
return h('label', null, cb, h('span', null, h('b', null, pl.name), pl.sub ? h('div', { class: 'sl-muted sl-small' }, pl.sub) : null));
}));
form.replaceChildren(
_ow('customer', 'Khách hàng', [['', '— Chưa chọn khách —'], ...customers.map((c) => [c.id, `${c.name || 'Khách'}${c.phone ? ' · ' + c.phone : ''}`])], () => { _or(); _o2(); }),
_ow('project', 'Dự án', sellable.map((x) => [x.id, x.name]), () => { _oy.type = ''; _oy.area = ''; _oy.unitPrice = ''; _oy.plans = []; _op(); _o2(); }),
h('div', { class: 'sl-form' },
_ow('type', 'Loại căn', _oh ? _oh.types.filter((x) => !x.ask).map((x) => [x.n, `${x.n} (${S.fmtNum(x.a[0])}–${S.fmtNum(x.a[1])} m²)`]) : [], () => { _oy.area = ''; _op(); _o2(); }),
_o9('area', 'Diện tích (m²)'),
_o9('unitPrice', _oh && _oh.price ? `Đơn giá (triệu/m², ${S.fmtNum(_oh.price[0], 1)}–${S.fmtNum(_oh.price[1], 1)})` : 'Đơn giá (triệu/m²)'),
_o9('capital', 'Vốn khách có (tỷ)', { placeholder: 'vd 2,5' })),
h('div', { class: 'sl-muted sl-small', 'data-testid': 'quote-policy' }, `${S.policyLabel(policy)}${policy ? '' : ' – chưa có chính sách tháng, dùng mẫu của chủ đầu tư'}`),
h('b', null, 'Phương án (chọn tối đa 3 để so sánh)'), pick,
h('div', { class: 'sl-form' }, _o9('rate', 'Lãi suất sau ưu đãi (%/năm)'), _o9('years', 'Số năm vay'),
_ow('method', 'Cách trả', [['equal', 'Gốc đều, lãi giảm dần'], ['annuity', 'Trả đều mỗi tháng']])));
}
function _oe() {
const _oh = project(), t = _oz();
if (!_oh || !t) return [];
const { plans, policy } = _ok();
const area = S.parseNum(_oy.area), unitPrice = S.parseNum(_oy.unitPrice), cap = S.parseNum(_oy.capital);
if (!(area > 0) || !(unitPrice > 0)) return [];
const c = _o4();
return _oy.plans.map((id) => plans.find((x) => x.id === id)).filter(Boolean).map((plan) => S.buildQuote({
project: _oh, type: t.n, area, unitPrice, plan, policy: policy ? { id: policy.id, month: policy.month, status: policy.status } : null,
capital: isFinite(cap) ? (cap < 1e5 ? cap * 1e9 : cap) : null, rate: S.parseNum(_oy.rate), years: S.parseNum(_oy.years), method: _oy.method,
customer: c ? { id: c.id, name: c.name, phone: c.phone, zalo: c.zalo } : null,
}));
}
function _oj(_ob) {
const check = _ob.check.ok
? h('span', { class: 'sl-ok', 'data-testid': 'quote-check-' + _ob.plan.id }, `✓ Đã đối chiếu: ${_ob.steps.length} đợt cộng lại đúng ${S.fmtVnd(_ob.total)}, tổng ${S.fmtNum(_ob.check.pctSum)}%`)
: h('span', { class: 'sl-bad', 'data-testid': 'quote-check-' + _ob.plan.id }, `⛔ Chưa khớp: tổng ${S.fmtNum(_ob.check.pctSum)}%, lệch ${S.fmtVnd(_ob.check.diff)} – kiểm tra lại chính sách`);
const capLine = _ob.capital == null ? null : _ob.enough
? h('p', { class: 'sl-ok' }, `${money(_ob.capital)} đủ đợt đầu (${money(_ob.stages.first)}).`)
: h('p', { class: 'sl-bad' }, `${money(_ob.capital)} chưa đủ đợt đầu (${money(_ob.stages.first)}), thiếu ${money(_ob.short)}.`);
return h('div', { class: 'sl-box sl-col', 'data-testid': 'quote-result-' + _ob.plan.id },
h('div', { class: 'sl-row sl-sp' }, h('h3', null, _ob.plan.name), _ob.plan.sub ? h('span', { class: 'sl-muted sl-small' }, _ob.plan.sub) : null),
h('div', { class: 'sl-kpis' },
h('div', { class: 'sl-kpi' }, h('small', null, 'Tổng giá'), h('b', { 'data-testid': 'quote-total-' + _ob.plan.id }, money(_ob.total)), h('small', null, S.fmtVnd(_ob.total))),
h('div', { class: 'sl-kpi' }, h('small', null, 'Đợt đầu'), h('b', null, money(_ob.stages.first))),
h('div', { class: 'sl-kpi' }, h('small', null, 'Tổng tiền tự có'), h('b', null, money(_ob.stages.own))),
_ob.loan ? h('div', { class: 'sl-kpi' }, h('small', null, `Trả tháng đầu (sau ${_ob.loan.support} th hỗ trợ)`), h('b', null, money(_ob.loan.firstPay))) : null),
capLine,
h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl' },
h('thead', null, h('tr', null, h('th', null, 'Đợt'), h('th', null, 'Thời điểm'), h('th', { class: 'n' }, '%'), h('th', { class: 'n' }, 'Số tiền'))),
h('tbody', null, _ob.steps.map((s) => h('tr', { class: s.bank ? 'bank' : '' },
h('td', null, s.name), h('td', null, `${s.when}${s.month ? ' · ' + S.monthText(s.month, _ob.today) : ''}${s.bank ? ' · ngân hàng' : ''}`),
h('td', { class: 'n' }, S.fmtNum(s.pct) + '%'), h('td', { class: 'n' }, S.fmtVnd(s.amount))))),
h('tfoot', null, h('tr', null, h('th', null, 'Tổng'), h('th', null, ''), h('th', { class: 'n' }, S.fmtNum(_ob.check.pctSum) + '%'), h('th', { class: 'n' }, S.fmtVnd(_ob.check.sum)))))),
check,
_ob.loan ? h('p', { class: 'sl-muted sl-small' }, `Vay ${money(_ob.loan.amount)} · giải ngân ~tháng ${S.fmtNum(_ob.loan.disbMonth, 1)} · hỗ trợ lãi 0% ${_ob.loan.support} tháng · sau đó tháng đầu ${S.fmtVnd(_ob.loan.firstPay)}, tháng cuối ${S.fmtVnd(_ob.loan.lastPay)}, tổng lãi ${money(_ob.loan.totalInterest)} (lãi ${S.fmtNum(_ob.loan.rate)}%/năm, ${S.fmtNum(_ob.loan.years)} năm, ${_ob.loan.method === 'annuity' ? 'trả đều' : 'gốc đều'}).`) : null);
}
function _o3(ms) {
const c = S.comparePlans(ms);
return h('div', { class: 'sl-box sl-col', 'data-testid': 'quote-compare' }, h('h3', null, `So sánh ${ms.length} phương án`),
h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl sl-cmp' },
h('thead', null, h('tr', null, h('th', null, ''), ...c.cols.map((x) => h('th', { class: 'n' }, x.name)))),
h('tbody', null, c.rows.map((r) => h('tr', null, h('td', null, r.label), ...r.values.map((v, i) => h('td', { class: 'n' + (r.best === i ? ' best' : '') },
r.key === 'support' ? (ms[i].loan ? S.htlsTxt(ms[i].loan.support) : '–') : (v ? money(v) : '–'), r.best === i ? ' ✓' : ''))))))),
h('p', { class: 'sl-muted sl-small' }, '✓ = thấp nhất. Tổng chi phí = tổng giá + lãi khách tự trả sau thời gian hỗ trợ.'));
}
function _o11() {
if (!project()) return 'Chưa có dự án đang bán để báo giá – thêm dự án ở Bảng hàng trước.';
if (!_oz()) return 'Dự án này chưa có loại căn nào có diện tích – chọn dự án khác hoặc bổ sung ở Bảng hàng.';
if (!(S.parseNum(_oy.area) > 0)) return 'Nhập diện tích (m²) lớn hơn 0, ví dụ 65.';
if (!(S.parseNum(_oy.unitPrice) > 0)) return 'Nhập đơn giá (triệu đồng/m²) lớn hơn 0, ví dụ 45.';
if (!_oy.plans.length) return 'Chọn ít nhất 1 phương án thanh toán.';
return 'Chọn dự án, loại căn, diện tích, đơn giá và ít nhất 1 phương án.';
}
let _oa = [];
function _o2() {
if (_oy.saved) return;
const ms = _oe();
_oa = ms;
if (!ms.length) {
out.replaceChildren(h('div', { class: 'sl-box sl-muted', 'data-testid': 'quote-why' }, _o11()));
_o8.replaceChildren();
return;
}
out.replaceChildren(...(ms.length > 1 ? [_o3(ms)] : []), ...ms.map(_oj));
_oq(ms);
}
let _ol = null;
let _o5 = false;
function _oq(ms, savedMode) {
if (!_oy.imgPlan || !ms.some((_ob) => _ob.plan.id === _oy.imgPlan)) _oy.imgPlan = ms[0].plan.id;
const _oc = () => ms.find((_ob) => _ob.plan.id === _oy.imgPlan) || ms[0];
const _om = h('div', { class: 'sl-preview', 'data-testid': 'quote-preview' });
const which = ms.length > 1 ? h('label', { class: 'sl-f' }, 'Ảnh cho phương án', _o1.select(ms.map((_ob) => [_ob.plan.id, _ob.plan.name]), _oy.imgPlan, { 'data-testid': 'quote-img-plan', onchange: (e) => { _oy.imgPlan = e.target.value; } })) : null;
const _od = async (compare) => {
const layout = compare ? S.compareLayout(ms, profile, { money }) : S.quoteLayout(_oc(), profile, { money });
const blob = await renderPng(layout);
if (_ol) URL.revokeObjectURL(_ol.url);
const _ob = _oc();
_ol = { blob, url: URL.createObjectURL(blob), name: `bao-gia-${_ox(_ob.project.name)}-${_ox(_ob.unit.type)}${compare ? '-so-sanh' : '-' + _ox(_ob.plan.name)}.png`, compare };
_om.replaceChildren(h('img', { src: _ol.url, alt: 'Ảnh báo giá', width: 360, 'data-testid': 'quote-preview-img' }));
return _ol;
};
const _o6 = async () => _ol || _od(false);
const download = async () => {
const _oh = await _o6();
const a = h('a', { href: _oh.url, download: _oh.name, hidden: true });
document.body.appendChild(a); a.click(); a.remove();
_o5 = true;
if (!savedMode) await _ou(_oh.compare ? ms : [_oc()]);
};
const share = async () => {
const _oh = await _o6(), _ob = _oc();
const _o7 = new File([_oh.blob], _oh.name, { type: 'image/png' });
if (navigator.canShare && navigator.canShare({ files: [_o7] })) {
try { await navigator.share({ files: [_o7], title: 'Báo giá ' + _ob.project.name, text: S.quoteText(_ob, profile, money) }); }
catch (e) { if (e && e.name === 'AbortError') return; _o1.toast('Chưa chia sẻ được – dùng Tải ảnh.', 'warn'); return; }
} else { await download(); _o1.toast('Máy này chưa hỗ trợ chia sẻ ảnh – đã tải ảnh về.', 'info'); return; }
if (!savedMode) await _ou([_ob]);
};
const zalo = async () => {
const _ob = _oc(), c = _o4() || _ob.customer;
await _o1.copy(S.quoteText(_ob, profile, money));
const _oi = c && (c.zalo || c.phone);
if (_oi) window.open(_o1.zaloLink(_oi), '_blank', 'noopener');
_o1.toast(S.zaloCopiedText(!!_oi, _o5), 'ok');
if (c && c.id && !savedMode) _o1.logEvent(c.id, 'zalo', 'Gửi báo giá qua Zalo: ' + _ob.project.name);
if (!savedMode) await _ou([_ob]);
};
_o8.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'quote-image' },
h('h3', null, 'Ảnh báo giá'),
which,
h('div', { class: 'sl-row' },
_o1.button('🖼️ Tạo ảnh', () => _od(false), { kind: 'primary', testid: 'quote-make-image' }),
ms.length > 1 ? _o1.button('📊 Ảnh so sánh', () => _od(true), { testid: 'quote-make-compare-image' }) : null,
_o1.button('⬇️ Tải ảnh', download, { testid: 'quote-download' }),
_o1.button('📤 Chia sẻ', share, { testid: 'quote-share' }),
_o1.button('💬 Chép + mở Zalo', zalo, { testid: 'quote-zalo' }),
savedMode ? null : _o1.button('💾 Lưu báo giá', async () => { await _ou(ms); }, { kind: 'ghost', testid: 'quote-save' })),
profile.name ? null : h('p', { class: 'sl-muted sl-small' }, 'Thêm tên, chức danh, CCHN, SĐT ở Cài đặt → Thông tin cá nhân để in lên ảnh.'),
profile.phone ? null : phonePrompt(_o1, { testid: 'quote-add-phone', text: 'Ảnh báo giá chưa có số điện thoại của anh/chị. ', onSaved: (_oi) => { profile.phone = _oi; _oq(ms, savedMode); } }),
_om));
_ol = null;
}
async function _ou(ms) {
let n = 0;
for (const _ob of ms) {
const key = S.quoteKey(_ob);
if (_ov.has(key)) continue;
const _ot = S.quoteRow(_ob, { objectId: _oy.customer, id: _o1.newId(), now: Date.now() });
await _o1.put('quotes', _ot);
_ov.set(key, _ot.id);
if (_oy.customer) {
await _o1.logEvent(_oy.customer, 'quote', `Báo giá ${_ob.project.name} · ${_ob.unit.type} ${S.fmtNum(_ob.unit.area)} m² · ${_ob.plan.name} · ${money(_ob.total)}`,
{ quote_id: _ot.id, project_id: _ob.project.id, plan_id: _ob.plan.id, policy_id: _ob.policy.id, total: _ob.total });
}
n++;
}
if (n) { _o1.toast(n > 1 ? `Đã lưu ${n} báo giá` : 'Đã lưu báo giá', 'ok'); _or(); }
}
async function _or() {
const all = (await _o1.list('quotes')).filter((q) => !_oy.customer || q.object_id === _oy.customer).sort((a, b) => (b.created_at || 0) - (a.created_at || 0)).slice(0, 10);
if (!all.length) { _oo.replaceChildren(); return; }
_oo.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'quote-recent' }, h('h3', null, _oy.customer ? 'Báo giá đã gửi khách này' : 'Báo giá gần đây'),
...all.map((q) => {
const _ob = S.quoteFromRow(q);
if (!_ob) return null;
const c = customers.find((x) => x.id === q.object_id);
return h('div', { class: 'sl-row sl-sp' },
h('span', null, `${new Date(q.created_at || q.updated_at).toLocaleDateString('vi-VN')} · ${_ob.project.name} ${_ob.unit.type} · ${_ob.plan.name} · ${money(_ob.total)}${c ? ' · ' + c.name : ''}`),
_o1.button('Mở lại', () => _og(q), { kind: 'ghost', testid: 'quote-open-' + q.id }));
})));
}
function _og(_ot) {
const _ob = S.quoteFromRow(_ot);
if (!_ob) { _o1.toast('Báo giá này bị hỏng dữ liệu.', 'error'); return; }
_oy.saved = _ob;
out.replaceChildren(
h('div', { class: 'sl-box sl-col', 'data-testid': 'quote-saved' },
h('b', null, `Báo giá ngày ${new Date(_ob.created_at).toLocaleDateString('vi-VN')} – giữ nguyên ${_ob.policy.label.toLowerCase()} lúc báo giá`),
h('div', { class: 'sl-row' },
_o1.button('← Quay lại báo giá mới', () => { _oy.saved = null; _o2(); }, { kind: 'ghost' }),
_o1.button('Tính lại theo chính sách hiện hành', () => {
_oy.saved = null; _oy.project = _ob.project.id; _oy.type = _ob.unit.type; _oy.area = S.fmtNum(_ob.unit.area); _oy.unitPrice = S.fmtNum(_ob.unit.unitPrice, 2);
_oy.plans = [_ob.plan.id]; if (_ob.customer) _oy.customer = _ob.customer.id; _op(); _o2();
}))),
_oj(_ob));
_oq([_ob], true);
}
_op();
_o2();
_or();
if (_on.get('quote')) { const _ot = await _o1.get('quotes', _on.get('quote')); if (_ot) _og(_ot); }
return _os;
}
export default {
manifest: {
id: 'quote', title: 'Báo giá', icon: '🧾', screen: 'sales', order: 20, version: '1.0.0', status: 'ready',
help: 'Báo giá căn theo chính sách đang áp dụng; so sánh tối đa 3 phương án; kiểm tra vốn đợt đầu; xuất ảnh 1080×1350 gửi Zalo. Báo giá cũ mở lại giữ nguyên số cũ.',
},
mount,
async selftest(ctx) {
const r = await S.selftestSales(ctx, ['pay.total', 'pay.stages']);
if (!r.ok) return r;
try {
const env = await S.loadEnv(ctx);
const _oh = env.projects.find(S.sellable), t = _oh.types.find((x) => !x.ask);
const ms = env.plansFor(_oh).plans.slice(0, 3).map((plan) => S.buildQuote({ project: _oh, type: t.n, area: t.a[0], unitPrice: _oh.price[0], plan, capital: 2e9 }));
const back = S.quoteFromRow(JSON.parse(JSON.stringify(S.quoteRow(ms[0], { id: 'selftest' }))));
if (!back || back.total !== ms[0].total) return { ok: false, details: 'Lưu/mở lại báo giá lệch số' };
if (ms.length > 1) S.compareLayout(ms, {});
} catch (e) { return { ok: false, details: 'Báo giá mẫu lỗi: ' + (e && e.message) }; }
return r;
},
};

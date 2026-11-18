import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as U from '../g1_lib/ui.js';
export async function mount(el, ctx) {
S.ensureSalesCss(); U.ensureCss();
const _o0 = kit(ctx);
let env = await S.loadEnv(ctx);
const money = env.money;
const _o7 = ctx.user && ctx.user.perms && ctx.user.perms.policy;
const _o2 = _o7 !== 'view';
const _o8 = S.hashParams();
const _ok = () => env.projects.filter((_o5) => G.policyVersions(env.policies, _o5.id).length);
const _oe = { project: _o8.get('project') || (_ok()[0] || env.projects.find(S.sellable) || {}).id, newId: '', oldId: '' };
const _od = h('div', { class: 'sl g1', 'data-testid': 'g1-policywatch' });
el.innerHTML = ''; el.appendChild(_od);
const head = h('div', { class: 'sl-box sl-col' }), diffBox = h('div', { class: 'sl-col' }), custBox = h('div', { class: 'sl-col' });
_od.append(U.title('Theo dõi thay đổi chính sách'), h('p', { class: 'g1-lead' }, 'So chính sách mới với bản cũ, biết khách nào cần báo và soạn sẵn tin cho từng người.'), head, diffBox, custBox);
const _oi = () => G.policyVersions(env.policies, _oe.project);
const label = (_oh) => _oh ? `${S.policyLabel(_oh)} · ${_oh.status === 'active' ? 'đã duyệt' : 'nháp'} · hiệu lực ${(_oh.effective_from || '').split('-').reverse().join('/') || '—'}` : 'Chính sách mặc định (giá tham khảo)';
function _o6() { const d = G.defaultPair(_oi()); _oe.newId = d.newId; _oe.oldId = d.oldId; }
const plansOf = (id) => {
const _o5 = env.project(_oe.project);
if (!id) return S.defaultPlansFor(_o5, env.defaultPolicies);
const _oh = env.policies.find((x) => x.id === id); return _oh ? S.parsePlans(_oh.plans) : [];
};
function _oc() {
const _oj = _oi();
const opts = _oj.map((_oh) => [_oh.id, label(_oh)]);
head.replaceChildren(
h('div', { class: 'sl-form' },
h('label', { class: 'sl-f' }, 'Dự án', _o0.select(env.projects.map((_o5) => [_o5.id, _o5.name + (G.policyVersions(env.policies, _o5.id).length ? ' •' : '')]), _oe.project, { 'data-testid': 'g1-pw-project',
onchange: (e) => { _oe.project = e.target.value; _o6(); _o9(); } })),
h('label', { class: 'sl-f' }, 'Bản mới', _o0.select(opts.length ? opts : [['', 'Chưa có chính sách nào']], _oe.newId, { 'data-testid': 'g1-pw-new', onchange: (e) => { _oe.newId = e.target.value; _ob(); _oa(); } })),
h('label', { class: 'sl-f' }, 'So với bản', _o0.select([['', label(null)], ...opts], _oe.oldId, { 'data-testid': 'g1-pw-old', onchange: (e) => { _oe.oldId = e.target.value; _ob(); _oa(); } }))),
_oj.length ? null : h('p', { class: 'g1-warn' }, _o2 ? 'Dự án chưa có chính sách đã nhập. Vào "Cập nhật chính sách" để nạp bản mới, sau đó quay lại đây.' : 'Dự án chưa có chính sách đã nhập. Chờ Quản trị/Quản lý nạp chính sách mới.'),
_o2 ? h('div', { class: 'sl-row' }, _o0.button('📝 Nhập chính sách mới', () => _o0.nav('#/sales/policy?project=' + encodeURIComponent(_oe.project)), { kind: 'ghost', testid: 'g1-pw-goto-policy' })) : null);
}
let changes = [];
function _ob() {
if (!_oe.newId) { diffBox.replaceChildren(); changes = []; return; }
let rows = [];
try { if (env.L && env.L.policy && env.L.policy.diff) rows = env.L.policy.diff(S.toStorePlans(plansOf(_oe.oldId)), S.toStorePlans(plansOf(_oe.newId))); } catch { rows = []; }
if (!rows.length) rows = S.diffPlans(plansOf(_oe.oldId), plansOf(_oe.newId)).map((d) => ({ text: `${d.plan} – ${d.label}: ${d.old || '—'} → ${d.new || '—'}`, path: '' }));
changes = rows.map((d) => ({ ...d, tone: G.changeTone(d) }));
const _o3 = changes.filter((_o1) => _o1.tone > 0).length, bad = changes.filter((_o1) => _o1.tone < 0).length;
diffBox.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'g1-pw-diff' },
h('h3', null, `Thay đổi (${changes.length})`),
changes.length ? h('p', { class: 'sl-small' }, `${_o3} điểm có lợi cho khách · ${bad} điểm bất lợi · ${changes.length - _o3 - bad} điểm khác`) : null,
changes.length ? h('ul', { class: 'sl-issues' }, changes.map((_o1, i) => h('li', { class: _o1.tone < 0 ? 'e' : _o1.tone > 0 ? '' : 'w', 'data-testid': 'g1-pw-change-' + i }, (_o1.tone > 0 ? '▲ ' : _o1.tone < 0 ? '▼ ' : '• ') + _o1.text)))
: h('p', { class: 'sl-muted' }, 'Hai bản giống nhau – không cần báo khách.')));
}
async function _oa() {
if (!_oe.newId || !changes.length) { custBox.replaceChildren(); return; }
if (U.isGuest()) { custBox.replaceChildren(h('div', { class: 'g1-warn', 'data-testid': 'g1-pw-guest' }, '👁 Đang ở chế độ khách xem – danh sách khách cần báo đã ẩn.')); return; }
const _o5 = env.project(_oe.project), nv = env.policies.find((x) => x.id === _oe.newId);
const [customers, quotes, events] = await Promise.all([_o0.list('objects'), _o0.list('quotes'), _o0.list('events')]);
const list = G.affectedCustomers({ customers, quotes, events, project: _o5, newPolicyId: _oe.newId, oldPolicyId: _oe.oldId });
const profile = await S.getProfile(ctx);
const sender = { name: profile.name || (ctx.user && ctx.user.full_name) || '', phone: profile.phone || '' };
const _of = changes.map((_o1) => _o1.text);
const _og = list.filter((x) => !x.notified).length;
custBox.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'g1-pw-customers' },
h('h3', null, `Khách cần báo (${_og}/${list.length})`),
nv && nv.status !== 'active' ? h('p', { class: 'g1-warn' }, 'Bản mới đang là NHÁP – chờ duyệt rồi hẵng báo khách.') : null,
list.length ? list.map((x) => {
const _o1 = x.customer, req = G.requote(x.quote, plansOf(_oe.newId));
const ta = h('textarea', { rows: 6, class: 'sl-in', 'data-testid': 'g1-pw-msg-' + _o1.id }, G.noticeText({ customer: _o1, project: _o5, changes: _of, req, effective: nv && nv.effective_from, sender }, money));
const zalo = _o0.zaloLink(_o1.zalo || _o1.phone);
return h('div', { class: 'g1-card', 'data-testid': 'g1-pw-cust-' + _o1.id },
h('div', { class: 'sl-row sl-sp' }, h('b', null, _o1.name || 'Khách'), x.notified ? h('span', { class: 'sl-ok', 'data-testid': 'g1-pw-done-' + _o1.id }, '✓ Đã báo') : h('span', { class: 'sl-muted sl-small' }, _o1.status || '')),
h('div', { class: 'sl-small sl-muted' }, x.reasons.join(' · ')),
String(_o1.consent) === '0' ? h('div', { class: 'g1-warn' }, 'Khách chưa đồng ý nhận thông tin – chỉ báo khi khách hỏi.') : null,
req && req.ok ? h('div', { class: 'sl-small' }, `Báo giá cũ ${money(req.oldTotal)} → theo bản mới ${money(req.newTotal)} (${req.delta <= 0 ? 'giảm' : 'tăng'} ${money(Math.abs(req.delta))})`) : null,
ta,
h('div', { class: 'sl-row' },
_o0.button('📋 Chép tin', () => _o0.copy(ta.value).then(() => _o0.toast('Đã chép – dán vào Zalo của khách.', 'ok')), { testid: 'g1-pw-copy-' + _o1.id }),
_o1.phone || _o1.zalo ? _o0.linkBtn('💬 Mở Zalo', zalo, () => { _o0.copy(ta.value); }, { target: '_blank', testid: 'g1-pw-zalo-' + _o1.id }) : null,
x.notified ? null : _o0.button('✓ Đã báo', () => _o4(_o1, ta.value), { kind: 'primary', testid: 'g1-pw-mark-' + _o1.id })));
}) : _o0.empty('Không có khách nào đang theo dõi dự án này.'),
h('p', { class: 'g1-legal' }, 'Tin chỉ soạn sẵn – anh/chị tự gửi bằng Zalo của mình. Chỉ báo khách đã đồng ý nhận thông tin (theo Luật Bảo vệ dữ liệu cá nhân 2025 (Luật số 91/2025/QH15)).')));
}
async function _o4(_o1, text) {
await _o0.logEvent(_o1.id, 'zalo', 'Báo chính sách mới: ' + String(text).slice(0, 300), { g1_notice: _oe.newId, project_id: _oe.project });
_o0.toast('Đã ghi: đã báo ' + (_o1.name || 'khách'), 'ok');
_oa();
}
function _o9() { _oc(); _ob(); _oa(); }
_o6(); _o9();
_o0.on(_od, ['policies'], async () => { env = await S.loadEnv(ctx); if (!_oi().some((_oh) => _oh.id === _oe.newId)) _o6(); _o9(); });
return _od;
}
export default {
manifest: { id: 'g1_policywatch', title: 'Theo dõi chính sách', icon: '🔔', screen: 'sales', order: 140, version: '0.1.0', status: 'ready',
help: 'So chính sách mới – cũ, lọc khách cần báo (đang quan tâm hoặc đã nhận báo giá), tính lại báo giá cũ và soạn tin Zalo cho từng khách.' },
mount,
async selftest(ctx) { return S.selftestSales(ctx, ['policy.diff']); },
};

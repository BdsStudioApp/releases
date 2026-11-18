import { kit, h, selftestCommon, inSelftest } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import { openImport, canImport } from './import_ui.js';
import { openConnect, canConnect } from '../_lib/lead_connect_ui.js';
import * as LP from '../_lib/lead_pool.js';
import { featureAllowed } from '../../../core/features.7307eb3773.js';
const _o6 = [['', 'Mọi nguồn'], ['landing', 'Landing'], ['manual', 'Tự nhập'], ['referral', 'Giới thiệu'], ['facebook', 'Facebook'], ['zalo', 'Zalo'], ['walkin', 'Khách vãng lai'], ['webhook', 'Landing ngoài (webhook)'], ['import', 'Nhập Excel/CSV'], [LP.PL_SRC, '🏢 Công ty cấp']];
const _o7 = Object.fromEntries(_o6.filter(s => s[0]));
function sourceLabel(s) { s = String(s || ''); return s.startsWith('webhook:') ? 'Landing ngoài · ' + s.slice(8) : (_o7[s] || s); }
function _o12(_op) { const base = _o6.slice(1).filter(_o31 => _o31[0] !== 'webhook'); return _op && !base.some(_o31 => _o31[0] === _op) ? [...base, [_op, sourceLabel(_op)]] : base; }
const _o2 = { call: '📞', zalo: '💬', note: '📝', status: '🔁', heat: '🌡️', meeting: '📅', quote: '🧾', payment: '💳', zalo_draft: '✉️' };
const _o4 = 'bds.customers.view';
function loadView() {
try { return JSON.parse(localStorage.getItem(_o4)) || {}; } catch { return {}; }
}
function _o2d(v) { try { localStorage.setItem(_o4, JSON.stringify({ ...loadView(), ...v })); } catch { } }
const _o3 = { customers_scope: 'all', assign: true, erase: true, export: true };
function _o21(ctx) { return (ctx.user && ctx.user.perms) || _o3; }
function _o1p(ctx) { return !!(ctx.user && !ctx.user.legacy); }
function _o1g(ctx) {
const P = (ctx.user && ctx.user.perms) || {};
if (!(P.lead_any || P.lead_pool) || !_o1p(ctx)) return null;
const ico = ctx.ui && typeof ctx.ui.icon === 'function' ? ctx.ui.icon('inbox', 18) : h('span', { 'aria-hidden': 'true' }, '📥');
return h('a', { class: 'cu-tab cu-tab-link', href: '#/customers/lead_pool', 'data-testid': 'cust-tab-lead-pool', title: 'Kho lead công ty: nhập khách, chia cho nhân viên, báo cáo nguồn' }, ico, ' Kho lead');
}
function _o2w(ctx) { return _o1p(ctx) && !ctx.solo; }
function _o1c(ctx) { return !!(ctx.user && ctx.user.role === 'owner' && !ctx.user.legacy); }
function isMine(ctx, c) { return ctx.users && ctx.users.isMine ? ctx.users.isMine(c) : true; }
async function _o1v(ctx) {
const P = _o21(ctx);
if (!ctx.users || !(P.assign || P.customers_scope === 'all')) return [];
try { return await ctx.users.directory(); } catch { return []; }
}
function ownerLabel(ctx, id, dir) { return ctx.users && id ? ctx.users.label(id, dir) : ''; }
export function csvCell(v) { const s0 = String(v == null ? '' : v), s = /^[=+\-@\t\r]/.test(s0) ? "'" + s0 : s0; return /[",\n\r;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
const _o0 = 'bds-customers-css';
function _ow() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
document.head.appendChild(h('link', { id: _o0, rel: 'stylesheet', href: new URL('./customers.css', import.meta.url).href }));
}
async function _o1k(K) { try { return crm.heatTiers(await K.setting('g2.score', null)); } catch { return crm.heatTiers(null); } }
function _o17(c, tiers, onClick, testid) {
const _o31 = crm.heatOf(c, { tiers });
const title = crm.heatTitle(_o31) + (onClick ? '. Bấm để đổi.' : '.');
return h(onClick ? 'button' : 'span', {
type: onClick ? 'button' : null, class: 'cu-heat cu-heat-' + _o31.id + (_o31.source === 'none' ? ' cu-heat-unset' : ''),
title, 'aria-label': title, 'data-testid': testid || ('heat-' + c.id), 'data-heat': _o31.id, 'data-heat-source': _o31.source,
onclick: onClick ? e => { e.stopPropagation(); onClick(); } : null,
}, h('span', { class: 'cu-dot', 'aria-hidden': 'true' }), h('span', { class: 'cu-heat-l' }, _o31.label));
}
async function _o2l(K, id, level, tiers) {
const fresh = await K.get('objects', id);
if (!fresh) { K.toast('Không tìm thấy hồ sơ khách', 'warn'); return null; }
const _od = crm.heatOf(fresh, { tiers });
const _o2b = await K.put('objects', { ...fresh, ...crm.heatPatch(fresh, level) });
const _oa = crm.heatOf(_o2b, { tiers });
if (_od.id !== _oa.id || _od.source !== _oa.source) {
await K.logEvent(id, 'heat', 'Mức quan tâm: ' + _od.label + ' → ' + _oa.label + (_oa.source === 'manual' ? '' : ' (app tự tính)'), { from: _od.id, to: _oa.id, manual: _oa.source === 'manual' ? 1 : 0 });
}
K.toast('Mức quan tâm: ' + _oa.label, 'success');
return _o2b;
}
export function pickHeat(ctx, c, { tiers, onDone } = {}) {
const K = kit(ctx);
_ow();
const _op = crm.heatOf(c, { tiers });
let _o1m;
const _ok = async lv => { _o1m.close(); const r = await _o2l(K, c.id, lv, tiers); if (r && onDone) onDone(r); };
_o1m = K.modal({ title: 'Mức quan tâm – ' + (c.name || 'khách'), testid: 'heat-picker', body: [
h('p', { class: 'bds-muted' }, crm.heatTitle(_op) + '.'),
h('div', { class: 'cu-pick' }, crm.HEAT_LEVELS.map(l => {
const on = _op.source === 'manual' && _op.id === l.id;
return h('button', { type: 'button', class: 'cu-opt cu-heat-' + l.id + (on ? ' bds-on' : ''), 'aria-pressed': String(on), 'data-testid': 'heat-set-' + l.id, onclick: () => _ok(l.id) },
h('span', { class: 'cu-dot', 'aria-hidden': 'true' }), h('span', null, h('strong', null, l.label), h('small', null, l.hint)));
})),
h('div', { class: 'bds-row bds-end' },
K.button('Để app tự tính theo hành vi', () => _ok(null), { kind: 'ghost', testid: 'heat-set-auto', title: 'Bỏ mức tự chọn – dùng điểm hành vi (gọi, nhắn, lịch xem, báo giá…)' })),
] });
return _o1m;
}
function _ot(c, onClick, { long = false, testid } = {}) {
const _o31 = crm.discOf(c);
if (!_o31) return null;
const title = 'Tính cách ' + _o31.id + ' – ' + _o31.label + ' (' + _o31.name + '). Cách tư vấn: ' + _o31.tip;
return h(onClick ? 'button' : 'span', {
type: onClick ? 'button' : null, class: 'cu-disc', title, 'aria-label': title, 'data-testid': testid || ('disc-' + c.id), 'data-disc': _o31.id,
onclick: onClick ? e => { e.stopPropagation(); onClick(); } : null,
}, h('b', null, _o31.id), long ? _o31.label : null);
}
async function _o2k(K, id, disc) {
const fresh = await K.get('objects', id);
if (!fresh) { K.toast('Không tìm thấy hồ sơ khách', 'warn'); return null; }
if (disc && !crm.canProfile(fresh)) { K.toast('Khách chưa đồng ý lưu thông tin – chưa ghi nhận xét tính cách.', 'warn'); return null; }
const _o2b = await K.put('objects', { ...fresh, data: crm.discPatch(fresh, disc) });
const _o31 = crm.discOf(_o2b);
K.toast(_o31 ? 'Tính cách: ' + crm.discShort(_o31) : 'Đã bỏ nhận xét tính cách', 'success');
return _o2b;
}
export function pickDisc(ctx, c, { onDone } = {}) {
const K = kit(ctx);
_ow();
if (!crm.canProfile(c)) { K.toast('Khách chưa đồng ý lưu thông tin – chưa ghi nhận xét tính cách (Luật Bảo vệ dữ liệu cá nhân 2025).', 'warn'); return null; }
const _op = crm.discOf(c);
let _o1m;
const _ok = async id => { _o1m.close(); const r = await _o2k(K, c.id, id); if (r && onDone) onDone(r); };
_o1m = K.modal({ title: 'Tính cách D-I-S-C – ' + (c.name || 'khách'), testid: 'disc-picker', body: [
h('p', { class: 'bds-muted' }, crm.DISC_NOTE),
h('div', { class: 'cu-pick' }, crm.DISC.map(_o31 => {
const on = !!_op && _op.id === _o31.id;
return h('button', { type: 'button', class: 'cu-opt' + (on ? ' bds-on' : ''), 'aria-pressed': String(on), 'data-testid': 'disc-set-' + _o31.id, onclick: () => _ok(_o31.id) },
h('span', { class: 'cu-disc-l', 'aria-hidden': 'true' }, _o31.id),
h('span', null, h('strong', null, _o31.id + ' – ' + _o31.label + ' (' + _o31.name + ')'), h('small', null, _o31.desc), h('small', null, '💡 ' + _o31.tip)));
})),
h('div', { class: 'bds-row bds-end' }, K.button('Chưa rõ', () => _ok(''), { kind: 'ghost', testid: 'disc-set-none' })),
] });
return _o1m;
}
const _o5 = 'g4_doitac';
function _o1x(ctx) {
const p = ctx.packs;
if (!featureAllowed(_o5, ctx.user && ctx.user.perms)) return { on: false, def: null, status: 'noperm', noperm: true };
if (!p) return { on: true, def: null, status: 'on' };
let on = false, def = null, status = '';
try { on = !!p.moduleOn(_o5); } catch { on = false; }
try { def = (p.defs() || []).find(_oq => (_oq.modules || []).includes(_o5)) || null; } catch { def = null; }
try { status = def ? p.status(def.id) || '' : ''; } catch { status = ''; }
return { on, def, status };
}
function _o1d(ctx) { const _o2y = ctx.user; return !_o2y || _o2y.legacy || !_o2y.role || _o2y.role === 'owner'; }
function _o1z(K, ctx, pk) {
if (pk.noperm) return K.card({ title: 'Sổ đối tác', testid: 'partners-off', cls: 'cu-partner-off', body: [
h('p', { 'data-testid': 'partners-noperm' }, 'Sổ đối tác thuộc phần "Bảng hàng dự án". Tài khoản của anh/chị chưa được cấp phần này – nhờ Quản trị bật trong Cài đặt › Người dùng.')] });
const name = pk.def ? ((pk.def.no ? 'Gói ' + pk.def.no + ' "' : '"') + (pk.def.title || 'Nguồn hàng & Giao dịch') + '"') : 'Gói 4 "Nguồn hàng & Giao dịch"';
const _o30 = pk.status === 'off' ? 'Gói này đã cài nhưng đang tắt.' : pk.status === 'dev' ? 'Gói này đang phát triển.' : 'Gói này chưa được cài.';
const owner = _o1d(ctx);
return K.card({ title: 'Sổ đối tác', testid: 'partners-off', cls: 'cu-partner-off', body: [
h('p', null, 'Lưu đối tác làm việc cùng: Sale BĐS (cùng hoặc khác sàn, Sàn F1/F2), Sale / cán bộ tín dụng ngân hàng, admin dự án, công chứng, chủ nhà – kèm ai đang giữ quỹ căn nào và nhật ký gọi/nhắn.'),
h('p', null, 'Sổ đối tác nằm trong ' + name + '. ' + _o30 + ' Dữ liệu đối tác lưu một chỗ chung: bật gói là dùng ngay tại đây và ở Bán hàng → Sổ đối tác; tắt gói thì dữ liệu vẫn giữ nguyên.'),
owner
? h('div', { class: 'bds-row' }, K.button('Mở Gói chức năng để bật', () => K.nav('settings/packs'), { kind: 'primary', testid: 'partners-enable' }))
: h('p', { class: 'bds-muted', 'data-testid': 'partners-ask-owner' }, 'Nhờ Quản trị (Admin) vào Cài đặt › Gói chức năng để cài và bật gói này.'),
] });
}
export async function mount(el, ctx) {
const K = kit(ctx);
_ow();
const _o2e = loadView();
const st = {
q: '', status: '', need: '', project: '', source: '', heat: '', disc: '', tiers: await _o1k(K), sort: _o2e.sort || 'newest',
density: document.body.dataset.density === 'detail' ? 'detail' : 'compact',
scope: _o2e.scope === 'mine' ? 'mine' : 'all', selecting: false, picked: new Set(), dir: [], shown: [],
};
const P = _o21(ctx);
const _o26 = new URLSearchParams((location.hash.split('?')[1]) || '');
el.innerHTML = '';
const _o1i = h('div', { class: 'bds-list', 'data-testid': 'customer-list' });
const _oo = h('span', { class: 'bds-muted' });
let _o25 = null, bigList = false;
const search = h('input', { type: 'search', enterkeyhint: 'search', autocomplete: 'off', placeholder: 'Tìm tên, số điện thoại, dự án…', 'aria-label': 'Tìm khách', 'data-testid': 'customer-search', oninput: e => { st.q = e.target.value; clearTimeout(_o25); _o25 = setTimeout(_o29, data && bigList ? 150 : 0); } });
const _o24 = [['', 'Mọi dự án'], ...K.projects().map(p => [p.id, p.name])];
const _o1q = [['', 'Mọi nhu cầu'], ...crm.NEEDS.map(n => [n, _og(n)])];
const statusSel = K.select([['', 'Mọi trạng thái'], ...crm.allStatuses(K.L)], '', { 'aria-label': 'Trạng thái', onchange: e => { st.status = e.target.value; _o29(); } });
const bar = h('div', { class: 'bds-toolbar' },
search,
h('div', { class: 'bds-filters' },
statusSel,
K.select(_o1q, '', { 'aria-label': 'Nhu cầu', onchange: e => { st.need = e.target.value; _o29(); } }),
K.select(_o24, '', { 'aria-label': 'Dự án', onchange: e => { st.project = e.target.value; _o29(); } }),
K.select(_o6, '', { 'aria-label': 'Nguồn', onchange: e => { st.source = e.target.value; _o29(); } }),
K.select([['', 'Mọi mức quan tâm'], ...crm.HEAT_LEVELS.map(l => [l.id, l.label])], '', { 'aria-label': 'Mức quan tâm', 'data-testid': 'heat-filter', onchange: e => { st.heat = e.target.value; _o29(); } }),
K.select([['', 'Mọi tính cách'], ...crm.DISC.map(_o31 => [_o31.id, _o31.id + ' – ' + _o31.label]), ['none', 'Chưa rõ tính cách']], '', { 'aria-label': 'Tính cách D-I-S-C', 'data-testid': 'disc-filter', onchange: e => { st.disc = e.target.value; _o29(); } }),
K.select([['newest', 'Mới nhất'], ['call', 'Cần gọi trước'], ['name', 'Theo tên']], st.sort, { 'aria-label': 'Sắp xếp', onchange: e => { st.sort = e.target.value; _o2d({ sort: st.sort, density: st.density }); _o29(); } }),
P.customers_scope === 'all' && _o2w(ctx) ? K.select([['all', 'Tất cả khách'], ['mine', 'Của tôi']], st.scope, { 'aria-label': 'Phạm vi', 'data-testid': 'scope-select', onchange: e => { st.scope = e.target.value; _o2d({ scope: st.scope }); _o29(); } }) : null,
));
const _o2g = h('strong', null, '0');
const selBar = h('div', { class: 'bds-selbar', 'data-testid': 'select-bar', hidden: true },
h('span', null, 'Đã chọn ', _o2g),
h('div', { class: 'bds-row' },
K.button('Chọn tất cả', () => { st.shown.forEach(c => st.picked.add(c.id)); _o29(); }, { kind: 'ghost', icon: 'check', testid: 'select-all' }),
K.button('Chia cho…', () => _oc(), { kind: 'primary', icon: 'user', testid: 'assign-selected' }),
K.button('Xong', () => { st.selecting = false; st.picked.clear(); _o29(); }, { kind: 'ghost', icon: 'check', testid: 'select-done' })));
const _o2h = P.assign && ctx.users && _o2w(ctx) ? K.button('Chia khách', () => { st.selecting = !st.selecting; st.picked.clear(); _o29(); }, { kind: 'ghost', icon: 'customers', testid: 'assign-mode' }) : null;
const _ol = () => { if (moreMenu) moreMenu.open = false; };
const importBtn = canImport(ctx) ? K.button('Nhập khách từ Excel/CSV', () => { _ol(); openImport(ctx, K); }, { kind: 'ghost', icon: 'plus', testid: 'import-customers' }) : null;
const _on = canConnect(ctx) && _o1p(ctx) ? K.button('Nối landing có sẵn', async () => { _ol(); const me = await K.me(); openConnect(ctx, K, { org: me.name }); }, { kind: 'ghost', icon: 'plug', testid: 'connect-landing' }) : null;
const exportBtn = P.export ? K.button('Xuất CSV', () => { _ol(); _o10(); }, { kind: 'ghost', icon: 'download', testid: 'export-customers', title: 'Xuất danh sách đang lọc ra tệp CSV' }) : null;
const moreMenu = exportBtn || importBtn || _on ? h('details', { class: 'cu-more', 'data-testid': 'cust-more' },
h('summary', { class: 'btn btn-ghost', 'aria-label': 'Thêm thao tác', 'data-testid': 'cust-more-toggle' }, K.icon('more', 18), h('span', null, 'Thêm')),
h('div', { class: 'cu-more-menu', role: 'menu', 'data-testid': 'cust-more-menu' }, exportBtn, importBtn, _on)) : null;
if (moreMenu) { const off = (e) => { if (!moreMenu.isConnected) { document.removeEventListener('click', off, true); return; } if (moreMenu.open && !moreMenu.contains(e.target)) moreMenu.open = false; }; document.addEventListener('click', off, true); }
async function _oc() {
const ids = [...st.picked];
if (!ids.length) { K.toast('Chọn ít nhất một khách', 'warn'); return; }
const _o2y = await ctx.users.pick({ title: 'Chia ' + ids.length + ' khách cho…' });
if (!_o2y) return;
try { await ctx.users.assign(ids, _o2y.id); } catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa chia được khách', 'danger'); return; }
K.toast('Đã chia ' + ids.length + ' khách cho ' + (_o2y.full_name || _o2y.username), 'success');
st.selecting = false; st.picked.clear(); _o29();
}
function _o10() {
const head = ['Tên', 'Điện thoại', 'Zalo', 'Trạng thái', 'Nhu cầu', 'Dự án', 'Loại căn', 'Vốn', 'Nguồn', 'Phụ trách', 'Ngày tạo', 'Mức quan tâm', 'Tính cách'];
const _o1h = [head, ...st.shown.map(c => [c.name, c.phone, c.zalo, c.status, c.need, K.projectName(c.project), c.unit_type, c.budget || '', sourceLabel(c.source), ownerLabel(ctx, c.owner, st.dir), c.created_at ? K.date(c.created_at) : '',
crm.heatOf(c, { tiers: st.tiers }).label, crm.discOf(c) ? crm.discShort(crm.discOf(c)) : ''])];
const _oe = new Blob(['\ufeff' + _o1h.map(r => r.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
const _o8 = h('a', { href: URL.createObjectURL(_oe), download: 'khach-hang-' + new Date().toISOString().slice(0, 10) + '.csv' });
document.body.appendChild(_o8); _o8.click(); _o8.remove(); setTimeout(() => URL.revokeObjectURL(_o8.href), 4000);
K.toast('Đã xuất ' + st.shown.length + ' khách', 'success');
}
const densityBtn = K.button(st.density === 'compact' ? 'Xem chi tiết' : 'Xem gọn', () => { st.density = st.density === 'compact' ? 'detail' : 'compact'; _o2d({ sort: st.sort, density: st.density }); _o29(); }, { testid: 'density-toggle', kind: 'ghost', icon: 'layout' });
try {
const _o1o = new MutationObserver(() => {
if (!el.isConnected) { _o1o.disconnect(); return; }
const _oq = document.body.dataset.density === 'detail' ? 'detail' : 'compact';
if (_oq !== st.density) { st.density = _oq; _o2d({ sort: st.sort, density: _oq }); _o29(); }
});
_o1o.observe(document.body, { attributes: true, attributeFilter: ['data-density'] });
} catch { }
const _o15 = h('div', { class: 'bds-row' }, densityBtn, moreMenu, K.button('+ Thêm khách', () => openForm(ctx, null), { kind: 'primary', testid: 'add-customer' }));
const custPane = h('div', { class: 'cu-pane bds-screen', 'data-testid': 'customers-pane' },
_o2h ? h('div', { class: 'bds-row bds-tools' }, _o2h) : null,
bar, selBar, _o1i);
const _o1y = h('div', { class: 'cu-pane', 'data-testid': 'partners-pane', hidden: true });
const _o1w = h('span', { class: 'bds-muted' });
const _o2t = (id, label, extra) => h('button', { type: 'button', role: 'tab', class: 'cu-tab', 'aria-selected': 'false', 'data-testid': 'cust-tab-' + id, onclick: () => _o2r(id) }, label, extra || null);
const _o2u = { customers: _o2t('customers', 'Khách hàng'), partners: _o2t('partners', 'Đối tác ', _o1w) };
let _o2s = _o26.get('tab') === 'doitac' || _o26.get('tab') === 'partners' ? 'partners' : 'customers';
async function _o2r(id) {
_o2s = id;
for (const [k, b] of Object.entries(_o2u)) b.setAttribute('aria-selected', String(k === id));
custPane.hidden = id !== 'customers';
_o1y.hidden = id !== 'partners';
custPane.style.display = id === 'customers' ? '' : 'none';
_o15.style.display = id === 'customers' ? '' : 'none';
if (id === 'partners') await _o2a();
}
async function _o2a() {
if (_o1y.dataset.ready) return;
const pk = _o1x(ctx);
_o1y.innerHTML = '';
if (!pk.on) { _o1y.appendChild(_o1z(K, ctx, pk)); return; }
const host = h('div', { 'data-testid': 'partners-embed' });
_o1y.appendChild(host);
try {
const _o1m = await import('../' + _o5 + '/index.js');
await _o1m.mount(host, ctx);
_o1y.dataset.ready = '1';
} catch (e) {
host.innerHTML = '';
host.appendChild(K.empty('Chưa mở được Sổ đối tác ở đây – mở tại Bán hàng → Sổ đối tác.'));
try { ctx.errors && ctx.errors.report('warn', 'customers.partners', String(e && e.message || e)); } catch { }
}
}
el.appendChild(h('div', { class: 'bds-screen' },
h('div', { class: 'bds-head' },
h('h2', null, 'Khách hàng ', _oo),
_o15),
h('div', { class: 'cu-tabs', role: 'tablist', 'aria-label': 'Khách hàng hoặc đối tác' }, _o2u.customers, _o2u.partners, _o1g(ctx)),
custPane, _o1y));
_o1v(ctx).then(_oq => { st.dir = _oq; if (_oq.length) _o29(); });
let data = null, renderSeq = 0;
async function _o1j() {
if (!data) data = Promise.all([K.list('objects'), K.list('reminders'), K.list('events')]).then(([customers, reminders, events]) => ({ customers, reminders, events, due: null, last: null }));
return data;
}
async function _o29() {
const _o2i = ++renderSeq;
const _o1 = await _o1j();
if (_o2i !== renderSeq) return;
const { customers, reminders, events } = _o1;
bigList = customers.length >= 3000;
const partners = customers.filter(o => o.kind === 'g4_partner' && o.status !== 'luu_tru').length;
_o1w.textContent = partners ? '(' + partners + ')' : '';
const _o1f = st.density === 'compact' ? 'Xem chi tiết' : 'Xem gọn';
(densityBtn.querySelector('span') || densityBtn).textContent = _o1f;
const _o14 = new Set([...statusSel.options].map(o => o.value));
for (const c of crm.activeCustomers(customers)) if (c.status && !_o14.has(c.status)) { _o14.add(c.status); statusSel.appendChild(h('option', { value: c.status }, c.status)); }
let rows = crm.filterCustomers(customers, st);
if (st.scope === 'mine' && P.customers_scope === 'all' && _o2w(ctx)) rows = rows.filter(c => isMine(ctx, c));
rows = crm.sortCustomers(rows, st.sort, { reminders });
st.shown = rows;
selBar.hidden = !st.selecting;
_o2g.textContent = String(st.picked.size);
if (_o2h) _o2h.classList.toggle('bds-on', st.selecting);
_oo.textContent = '(' + rows.length + ')';
_o1i.innerHTML = '';
_o1i.dataset.density = st.density;
if (!rows.length) {
_o1i.appendChild(K.empty(crm.activeCustomers(customers).length ? 'Không có khách khớp bộ lọc.' : 'Chưa có khách. Bấm "+ Thêm khách" hoặc nhập khách từ landing ở Bảng tin.'));
return;
}
const due = _o1.due || (_o1.due = crm.nextDueByCustomer(reminders));
const _o13 = document.createDocumentFragment();
const _o2q = _o2w(ctx) && P.customers_scope !== 'own' && P.customers_scope !== 'created';
const _o1e = _o1.last || (_o1.last = crm.lastContactMap(events));
for (const c of rows.slice(0, 500)) {
const r = _o2b(K, c, st.density, { due: due.get(c.id), last: _o1e.get(c.id), owner: _o2q ? (ownerLabel(ctx, c.owner, st.dir) || (c.owner ? '' : 'Chưa chia')) : '', tiers: st.tiers });
if (st.selecting) {
const _oh = h('input', { type: 'checkbox', class: 'bds-pick', 'aria-label': 'Chọn ' + (c.name || ''), 'data-testid': 'pick-' + c.id, checked: st.picked.has(c.id),
onchange: e => { if (e.target.checked) st.picked.add(c.id); else st.picked.delete(c.id); _o2g.textContent = String(st.picked.size); } });
r.classList.add('bds-selecting');
r.insertBefore(h('label', { class: 'bds-pick-wrap' }, _oh), r.firstChild);
}
_o13.appendChild(r);
}
_o1i.appendChild(_o13);
}
await _o29();
await _o2r(_o2s);
K.on(el, ['objects', 'reminders', 'events'], () => { data = null; _o29(); });
K.on(el, ['settings'], async () => { const t = await _o1k(K); if (t.hot !== st.tiers.hot || t.warm !== st.tiers.warm) { st.tiers = t; _o29(); } });
if (inSelftest(el)) return;
if (_o26.get('open')) openProfile(ctx, _o26.get('open'), { host: el });
if (_o26.get('new') === '1') openForm(ctx, null);
}
function _og(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }
function _o2b(K, c, density, { due, last, owner, tiers }) {
const open = () => openProfile(K.ctx, c.id);
const main = h('button', { type: 'button', class: 'bds-row-main', onclick: open, 'data-testid': 'open-' + c.id },
h('strong', { class: 'bds-name' }, c.name || '(chưa có tên)'),
h('span', { class: 'bds-sub' }, [K.projectName(c.project), c.unit_type].filter(Boolean).join(' · ') || K.phone(c.phone)),
owner ? h('span', { class: 'bds-owner', 'data-testid': 'owner-' + c.id }, 'Phụ trách: ' + owner) : null);
const _om = LP.isCompanyLead(c);
const _o1u = h('div', { class: 'bds-item', 'data-id': c.id, 'data-company': _om ? '1' : null, 'data-heat': crm.heatOf(c, { tiers }).id },
main,
_om ? h('span', { class: 'bds-row' }, LP.companyBadge(c), K.badge(c.status || 'Mới', crm.statusTone(c.status)), LP.levelBadge(LP.levelOf(c)), _ot(c, () => pickDisc(K.ctx, c), { long: density === 'detail' }))
: h('div', { class: 'cu-meta' },
_o17(c, tiers, () => pickHeat(K.ctx, c, { tiers })),
K.badge(c.status || 'Mới', crm.statusTone(c.status)),
_ot(c, () => pickDisc(K.ctx, c), { long: density === 'detail' })),
h('div', { class: 'bds-acts' }, _om && LP.poolInfo(c) ? LP.statusButton(K, K.ctx, c, null, { short: true, small: true }) : null, K.callBtn(c, { short: true }), K.zaloBtn(c, { short: true })));
if (density === 'detail') {
const _or = h('div', { class: 'bds-item-detail' },
c.budget ? h('span', null, 'Vốn: ' + K.money(c.budget)) : null,
h('span', null, 'Liên hệ cuối: ' + (last ? K.date(last) : 'chưa có')),
due ? h('span', { class: due < crm.dayRange(Date.now())[0] ? 'bds-danger' : '' }, 'Hẹn: ' + K.date(due)) : null,
c.source ? h('span', null, 'Nguồn: ' + sourceLabel(c.source)) : null,
c.note ? h('span', { class: 'bds-note' }, String(c.note).slice(0, 90)) : null);
_o1u.appendChild(_or);
}
return _o1u;
}
export async function openForm(ctx, existing, _o1t = {}) {
const K = kit(ctx);
_ow();
const c = existing || {};
const tiers = await _o1k(K);
const heat0 = crm.HEAT_IDS.includes(crm.parseData(c.data).heat) ? crm.parseData(c.data).heat : '';
const disc0 = (crm.discOf(c) || {}).id || '';
const _o1b = (name, attrs = {}) => h('input', { name, value: c[name] ?? '', ...attrs });
const _o11 = {
name: _o1b('name', { required: true, autocomplete: 'off', autocapitalize: 'words', enterkeyhint: 'next', 'data-testid': 'f-name' }),
phone: _o1b('phone', { type: 'tel', inputmode: 'tel', autocomplete: 'off', enterkeyhint: 'next', required: true, 'data-testid': 'f-phone' }),
zalo: _o1b('zalo', { type: 'tel', inputmode: 'tel', autocomplete: 'off', placeholder: 'Để trống nếu trùng số điện thoại' }),
need: K.select(crm.NEEDS.map(n => [n, _og(n)]), c.need || 'mua', { name: 'need' }),
project: K.select([['', '— Chọn dự án —'], ...K.projects().map(p => [p.id, p.name])], c.project || '', { name: 'project', 'data-testid': 'f-project' }),
unit_type: _o1b('unit_type', { list: 'bds-unit-types', placeholder: 'VD: 2N, 1N+, Studio' }),
budget: _o1b('budget', { value: c.budget ? K.money(c.budget) : '', placeholder: 'VD: 800tr, 1,2 tỷ', 'data-testid': 'f-budget' }),
source: K.select(_o12(c.source), c.source || 'manual', { name: 'source' }),
note: h('textarea', { name: 'note', rows: 3 }, c.note || ''),
birthday: _o1b('birthday', { type: 'date' }),
consent: h('input', { type: 'checkbox', name: 'consent', checked: !!Number(c.consent), 'data-testid': 'f-consent' }),
heat: K.select([['', 'Tự động (theo hành vi)'], ...crm.HEAT_LEVELS.map(l => [l.id, l.label])], heat0, { name: 'heat', 'data-testid': 'f-heat' }),
disc: K.select([['', 'Chưa rõ'], ...crm.DISC.map(_o31 => [_o31.id, _o31.id + ' – ' + _o31.label + ' (' + _o31.name + ')'])], disc0, { name: 'disc', 'data-testid': 'f-disc' }),
};
const _o18 = h('small', { class: 'bds-field-h', 'data-testid': 'heat-hint' });
const _ou = h('small', { class: 'bds-field-h', 'data-testid': 'disc-hint' });
const _o2p = () => {
const _o23 = _o11.heat.value ? { data: { heat: _o11.heat.value } } : heat0 ? { ...c, ...crm.heatPatch(c, null) } : c;
const _o31 = crm.heatOf(_o23, { tiers });
_o18.textContent = _o11.heat.value ? (crm.HEAT_LEVELS.find(l => l.id === _o31.id) || {}).hint || '' : 'Hiện app tính: ' + crm.heatTitle(_o31).replace(/^Mức quan tâm: /, '');
};
const _o2o = () => { const _o31 = crm.DISC.find(_oq => _oq.id === _o11.disc.value); _ou.textContent = _o31 ? '💡 ' + _o31.tip : 'Chọn khi đã trao đổi đủ để nhận ra cách khách thích được tư vấn.'; };
_o11.heat.addEventListener('change', _o2p);
_o11.disc.addEventListener('change', _o2o);
_o2p(); _o2o();
const types = new Set(['Studio', '1N', '1N+', '2N', '2N+', '3N', '4N', 'Duplex', 'Penthouse']);
K.projects().forEach(p => (p.types || []).forEach(t => t.n && types.add(t.n)));
const dl = h('datalist', { id: 'bds-unit-types' }, [...types].map(t => h('option', { value: t })));
const _of = h('small', { class: 'bds-field-h' });
const phoneHint = h('small', { class: 'bds-field-h', 'data-testid': 'phone-hint' });
const err = h('div', { class: 'bds-error', role: 'alert', 'data-testid': 'form-error' });
const _o2n = () => {
const v = crm.parseMoney(_o11.budget.value);
_of.textContent = _o11.budget.value ? (v ? '= ' + K.money(v) : 'Chưa hiểu số tiền, ví dụ: 800tr, 1,2 tỷ') : '';
};
['input', 'change', 'blur'].forEach(ev => _o11.budget.addEventListener(ev, _o2n));
let _ob = await K.list('objects');
const _oj = () => {
const p = crm.normPhone(_o11.phone.value);
phoneHint.textContent = '';
phoneHint.innerHTML = '';
if (!_o11.phone.value) return null;
if (!crm.validPhone(p)) { phoneHint.textContent = 'Số điện thoại chưa đúng (10 số, bắt đầu bằng 0).'; return 'invalid'; }
const _ov = crm.findDuplicatePhone(_ob, p, c.id);
if (_ov) {
phoneHint.appendChild(h('span', { class: 'bds-danger' }, 'Số này đã có trong hồ sơ "' + (_ov.name || '') + '". '));
phoneHint.appendChild(h('a', { href: '#', onclick: e => { e.preventDefault(); _o2m.close(); K.afterClose(() => openProfile(ctx, _ov.id)); } }, 'Mở hồ sơ đó'));
return 'dup';
}
phoneHint.textContent = K.phone(p);
return null;
};
_o11.phone.addEventListener('blur', _oj);
const pasteHint = h('small', { class: 'bds-field-h', 'data-testid': 'paste-hint' }, existing ? '' : 'Mẹo: dán nguyên tin khách nhắn Zalo vào ô này – app tự tách tên, số điện thoại, vốn.');
if (!existing) _o11.name.addEventListener('paste', (e) => {
const _o2x = (e.clipboardData && e.clipboardData.getData('text')) || '';
const _o31 = crm.parseLeadText(_o2x);
if (!_o31) return;
e.preventDefault();
_o11.name.value = _o31.name;
if (!_o11.phone.value.trim()) _o11.phone.value = _o31.phone;
if (_o31.budget && !_o11.budget.value.trim()) { _o11.budget.value = K.money(_o31.budget); _o2n(); }
if (_o31.unit_type && !_o11.unit_type.value.trim()) _o11.unit_type.value = _o31.unit_type;
if (!_o11.note.value.trim()) _o11.note.value = _o31.note;
_oj();
pasteHint.textContent = '✅ Đã tách từ tin dán: ' + [_o31.name && 'tên', 'số điện thoại', _o31.budget && 'vốn', _o31.unit_type && 'loại căn'].filter(Boolean).join(', ') + ' – nguyên văn tin ở Ghi chú. Kiểm lại trước khi lưu.';
if (!_o31.name) _o11.name.focus();
});
const _o2c = async () => {
err.textContent = '';
const name = _o11.name.value.trim();
if (!name) { err.textContent = 'Nhập tên khách.'; _o11.name.focus(); return; }
_ob = await K.list('objects');
const _o20 = _oj();
if (!_o11.phone.value.trim()) { err.textContent = 'Nhập số điện thoại.'; _o11.phone.focus(); return; }
if (_o20 === 'invalid') { err.textContent = 'Số điện thoại chưa đúng (10 số, bắt đầu bằng 0).'; _o11.phone.focus(); return; }
if (_o20 === 'dup') { err.textContent = 'Số điện thoại đã có trong danh sách khách.'; return; }
if (_o11.zalo.value.trim() && !crm.validPhone(_o11.zalo.value)) { err.textContent = 'Số Zalo chưa đúng (10 số, bắt đầu bằng 0) – để trống nếu trùng số điện thoại.'; return; }
let budget = 0;
if (_o11.budget.value.trim()) {
budget = crm.parseMoney(_o11.budget.value);
if (!budget) { err.textContent = 'Chưa hiểu số vốn. Ví dụ: 800tr, 1,2 tỷ.'; return; }
}
if (!_o11.consent.checked) { err.textContent = 'Cần khách đồng ý cho lưu thông tin – theo Luật Bảo vệ dữ liệu cá nhân 2025 (Luật số 91/2025/QH15).'; return; }
const t = Date.now();
const _o16 = _o11.heat.value !== heat0;
const _o19 = _o16 ? crm.heatPatch(c, _o11.heat.value || null, t) : null;
const data = crm.discPatch({ data: _o19 ? _o19.data : (c.data || '{}') }, _o11.disc.value);
const _o2b = {
...c, kind: 'customer', name, phone: crm.normPhone(_o11.phone.value), zalo: _o11.zalo.value.trim() ? crm.normPhone(_o11.zalo.value) : '',
need: _o11.need.value, project: _o11.project.value, unit_type: _o11.unit_type.value.trim(), budget, source: _o11.source.value,
note: _o11.note.value.trim(), birthday: _o11.birthday.value, consent: 1,
status: c.status || 'Mới', created_at: c.created_at || t, data, deleted: 0,
...(_o19 ? { tags: _o19.tags } : {}),
};
if (!_o2b.id) _o2b.id = K.newId();
const me = ctx.user;
if (me && me.id && !existing) { _o2b.owner = _o2b.owner || me.id; _o2b.created_by = _o2b.created_by || me.id; }
const _o2f = await K.put('objects', _o2b);
if (existing && _o16) {
const _o8 = crm.heatOf(c, { tiers }), b = crm.heatOf(_o2f, { tiers });
if (_o8.id !== b.id || _o8.source !== b.source) await K.logEvent(_o2f.id, 'heat', 'Mức quan tâm: ' + _o8.label + ' → ' + b.label + (b.source === 'manual' ? '' : ' (app tự tính)'), { from: _o8.id, to: b.id, manual: b.source === 'manual' ? 1 : 0 });
}
if (!existing) {
await K.logEvent(_o2f.id, 'note', 'Tạo hồ sơ khách (đã có đồng ý lưu thông tin)', { consent_at: t });
K.toast('Đã thêm khách ' + name, 'success');
} else K.toast('Đã lưu thông tin khách', 'success');
_o2m.close();
if (_o1t.onSaved) _o1t.onSaved(_o2f); else if (!existing) K.afterClose(() => openProfile(ctx, _o2f.id));
};
const _o2m = (existing ? K.modal : K.sheet)({
wide: true,
title: existing ? 'Sửa thông tin khách' : 'Thêm khách',
testid: 'customer-form',
body: h('form', { class: 'bds-form', onsubmit: e => { e.preventDefault(); _o2c(); } },
dl,
K.field('Tên khách *', _o11.name), pasteHint,
K.field('Điện thoại *', _o11.phone, null), phoneHint,
K.field('Zalo', _o11.zalo),
h('div', { class: 'bds-grid2' }, K.field('Nhu cầu', _o11.need), K.field('Nguồn', _o11.source)),
K.field('Dự án quan tâm', _o11.project),
h('div', { class: 'bds-grid2' }, K.field('Loại căn', _o11.unit_type), h('div', null, K.field('Vốn', _o11.budget), _of)),
h('div', { class: 'bds-grid2' }, h('div', null, K.field('Mức quan tâm', _o11.heat), _o18), h('div', null, K.field('Tính cách (D-I-S-C)', _o11.disc), _ou)),
K.field('Ngày sinh', _o11.birthday),
K.field('Ghi chú', _o11.note),
h('label', { class: 'bds-check' }, _o11.consent, h('span', null, 'Khách đã đồng ý rõ ràng cho lưu và dùng thông tin để liên hệ tư vấn bất động sản (bắt buộc – theo Luật Bảo vệ dữ liệu cá nhân 2025 (Luật số 91/2025/QH15)).')),
err,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _o2m.close(), { icon: 'close' }), K.button('Lưu khách', null, { kind: 'primary', type: 'submit', icon: 'check', testid: 'f-save' }))),
});
if (_of && c.budget) _of.textContent = '= ' + K.money(c.budget);
setTimeout(() => { try { const _o8 = document.activeElement; if (!_o8 || !/^(INPUT|TEXTAREA|SELECT)$/.test(_o8.tagName)) _o11.name.focus(); } catch { } }, 50);
return _o2m;
}
export async function openProfile(ctx, id, _o1t = {}) {
const K = kit(ctx);
_ow();
const tiers = await _o1k(K);
let c = await K.get('objects', id);
if (_o1t.host && !_o1t.host.isConnected) return null;
if (!c || Number(c.deleted)) { K.toast('Không tìm thấy hồ sơ khách', 'warn'); return null; }
const body = h('div', { class: 'bds-profile', 'data-testid': 'profile' });
const _o2m = K.sheet({ title: c.name || 'Hồ sơ khách', body, testid: 'profile-sheet' });
const P = _o21(ctx);
const dir = await _o1v(ctx);
async function _o27() {
const _o2y = await ctx.users.pick({ title: 'Chia "' + (c.name || 'khách') + '" cho…', current: c.owner });
if (!_o2y) return;
try { await ctx.users.assign([c.id], _o2y.id); } catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa chia được khách', 'danger'); return; }
K.toast('Đã chia cho ' + (_o2y.full_name || _o2y.username), 'success');
_o29();
}
async function _o29() {
c = await K.get('objects', id);
if (!c || Number(c.deleted)) { _o2m.close(); return; }
const [events, reminders] = await Promise.all([K.list('events'), K.list('reminders')]);
const _oz = crm.eventsOf(events, id);
const _o28 = reminders.filter(r => r.object_id === id && !Number(r.done)).sort((_o8, b) => _o8.due_at - b.due_at);
body.innerHTML = '';
const statuses = K.statuses(c.need);
const _o1t = statuses.includes(c.status) || !c.status ? statuses : [c.status, ...statuses];
const _o22 = LP.poolInfo(c);
const stSel = _o22 ? LP.statusButton(K, ctx, c, () => _o29()) : K.select(_o1t, c.status || statuses[0], { 'aria-label': 'Trạng thái', 'data-testid': 'status-select', onchange: e => _oi(e.target.value) });
const _o1a = [
['Điện thoại', c.phone ? K.phone(c.phone) : '—'],
c.zalo && c.zalo !== c.phone ? ['Zalo', K.phone(c.zalo)] : null,
['Nhu cầu', _og(c.need || 'mua')],
['Dự án', K.projectName(c.project) || '—'],
['Loại căn', c.unit_type || '—'],
['Vốn', c.budget ? K.money(c.budget) : '—'],
['Nguồn', _o22 ? h('span', { class: 'bds-row' }, LP.companyBadge(c), LP.levelBadge(LP.levelOf(c))) : (sourceLabel(c.source) || '—')],
_o22 ? ['Người cấp', (_o22.by_name || 'Công ty') + ' · ' + (_o22.at ? K.date(_o22.at) + ' ' + crm.hm(_o22.at) : '')] : null,
_o22 && _o22.campaign ? ['Chiến dịch', _o22.campaign + (LP.CHANNELS[_o22.channel] ? ' (' + LP.CHANNELS[_o22.channel] + ')' : '')] : null,
c.birthday ? ['Ngày sinh', K.date(c.birthday)] : null,
_o2w(ctx) ? ['Phụ trách', h('span', { class: 'bds-row', 'data-testid': 'profile-owner' },
h('span', null, ownerLabel(ctx, c.owner, dir) || (c.owner ? 'Người khác' : 'Chưa chia')),
P.assign && ctx.users ? K.button('Đổi', () => _o27(), { kind: 'ghost', icon: 'refresh', testid: 'profile-assign' }) : null)] : null,
].filter(Boolean);
const disc = crm.discOf(c);
const consentOk = crm.canProfile(c);
const _os = K.button('🧭 Tính cách: ' + crm.discShort(disc), () => pickDisc(ctx, c, { onDone: _o29 }), {
testid: 'profile-disc', title: consentOk ? 'Chọn nhóm tính cách D-I-S-C để có gợi ý cách tư vấn' : 'Khách chưa đồng ý lưu thông tin – chưa ghi nhận xét tính cách' });
if (!consentOk) _os.disabled = true;
body.appendChild(h('div', { class: 'bds-pf-top' },
h('div', { class: 'bds-row' }, _o22 ? K.badge(c.status || 'Mới', crm.statusTone(c.status)) : null, stSel,
_o22 ? null : _o17(c, tiers, () => pickHeat(ctx, c, { tiers, onDone: _o29 }), 'profile-heat'), _os),
disc ? h('p', { class: 'cu-tip', 'data-testid': 'disc-tip' }, h('strong', null, 'Cách tư vấn hợp nhóm ' + disc.id + ' (' + disc.label + '): '), disc.tip) : null,
h('dl', { class: 'bds-dl' }, _o1a.map(([k, v]) => [h('dt', null, k), h('dd', null, v)])),
c.note ? h('p', { class: 'bds-note' }, c.note) : null));
const _o9 = h('div', { class: 'bds-acts bds-wrap' },
K.callBtn(c), K.zaloBtn(c),
K.button('✉️ Soạn tin Zalo', async () => { const _o32 = await import('../zalo/index.js'); _o32.openComposer(ctx, c); }, { testid: 'compose-zalo' }),
K.button('🧾 Tạo báo giá', () => { _o2m.close(); K.nav('#/sales/quote?customer=' + encodeURIComponent(c.id)); }, { testid: 'make-quote' }),
K.button('📅 Hẹn lịch', () => _o1n(), { testid: 'add-meeting' }),
crm.isPostSale(c) ? K.button('💳 Lập lịch đóng tiền', async () => { const _o1m = await import('../care/index.js'); _o1m.openPaymentPlanner(ctx, c); }, { kind: 'primary', testid: 'plan-payments' }) : null,
K.button('✏️ Sửa', () => openForm(ctx, c, { onSaved: _o29 }), { testid: 'edit-customer' }));
body.appendChild(_o9);
const noteIn = h('textarea', { rows: 2, placeholder: 'Ghi chú nhanh sau cuộc gọi, buổi gặp…', 'data-testid': 'quick-note' });
body.appendChild(h('div', { class: 'bds-quick' }, noteIn, K.button('Lưu ghi chú', async () => {
const t = noteIn.value.trim();
if (!t) { K.toast('Nhập nội dung ghi chú trước khi lưu.', 'warn'); noteIn.focus(); return; }
await K.logEvent(id, 'note', t);
noteIn.value = '';
K.toast('Đã lưu ghi chú', 'success');
_o29();
}, { testid: 'save-note', icon: 'check' })));
if (_o28.length) {
body.appendChild(h('h4', null, 'Việc sắp tới'));
body.appendChild(h('ul', { class: 'bds-rem', 'data-testid': 'profile-reminders' }, _o28.slice(0, 8).map(r => h('li', null,
h('span', null, K.date(r.due_at)), ' ', r.title || r.kind, r.amount ? ' – ' + K.money(r.amount) : ''))));
}
body.appendChild(h('h4', null, 'Dòng thời gian'));
body.appendChild(_oz.length
? h('ol', { class: 'bds-timeline', 'data-testid': 'timeline' }, _oz.slice(0, 100).map(e => h('li', { 'data-type': e.type },
h('span', { class: 'bds-ti' }, _o2[e.type] || '•'),
h('div', null, h('small', { class: 'bds-muted' }, K.date(e.at) + ' ' + crm.hm(e.at)), h('div', null, e.text || e.type)))))
: K.empty('Chưa có hoạt động.'));
if (P.erase && _o1c(ctx)) body.appendChild(h('div', { class: 'bds-danger-zone' },
K.button('Xoá theo yêu cầu khách', () => _oy(), { kind: 'danger', icon: 'close', testid: 'erase-request' }),
h('small', { class: 'bds-muted' }, 'Khi khách yêu cầu xoá dữ liệu (Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15): xoá thông tin cá nhân ở Sheet chính và Sổ khách lưu trữ, giữ lại dấu vết kiểm tra.')));
else if (P.erase) body.appendChild(h('div', { class: 'bds-danger-zone' },
K.button('Xoá dữ liệu khách', () => erase(), { kind: 'danger', testid: 'erase-customer' }),
h('small', { class: 'bds-muted' }, 'Theo yêu cầu của khách (quyền xoá dữ liệu – Luật Bảo vệ dữ liệu cá nhân 2025 (Luật số 91/2025/QH15)): xoá thông tin cá nhân, giữ lại dấu vết kiểm tra.')));
}
async function _oy() {
const _o2v = crm.normPhone(c.phone).slice(-4) || 'XOA';
const reason = h('input', { 'data-testid': 'erase-reason', maxlength: 200, placeholder: 'vd: khách gọi điện yêu cầu ngày 17/11' });
const code = h('input', { inputmode: 'numeric', 'data-testid': 'erase-code', placeholder: _o2v });
const keepFiles = h('input', { type: 'checkbox', 'data-testid': 'erase-keep-files' });
const ok = await new Promise(res => {
const _o1m = K.modal({ title: 'Xoá theo yêu cầu khách', testid: 'erase-request-modal', body: [
h('p', null, 'Toàn bộ thông tin cá nhân của "' + (c.name || 'khách') + '" (tên, số điện thoại, Zalo, email, ghi chú, ngày sinh, lịch sử liên hệ, nhắc việc, báo giá; tên khách và ảnh uỷ nhiệm chi trong giữ chỗ, tệp trong hồ sơ giao dịch, việc, mã giới thiệu) sẽ bị xoá VĨNH VIỄN khỏi mọi Sheet dữ liệu và khỏi Sổ khách lưu trữ. Không khôi phục được – kể cả khi khôi phục bản sao lưu cũ.'),
h('p', { class: 'bds-muted' }, 'Căn cứ: quyền xoá dữ liệu của chủ thể dữ liệu – Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15. Chỉ làm khi chính khách yêu cầu. Sổ chỉ giữ một dòng "Đã xoá theo yêu cầu chủ thể dữ liệu" kèm ngày và lý do.'),
h('p', { class: 'bds-muted', 'data-testid': 'erase-backup-note' }, 'Bản sao lưu Sheet hằng tuần (thư mục "BDS Studio – Sao lưu" trên Drive) được máy chủ tự xoá dữ liệu khách này trong khoảng 1 giờ. Bản sao lưu mã hoá anh/chị tự tạo bằng nút Sao lưu (tệp "sao-luu-…") thì máy chủ không mở được nên không tự xoá – nếu cần, anh/chị tự xoá các tệp đó.'),
h('p', { class: 'bds-muted', 'data-testid': 'erase-history-note' }, 'Lưu ý: Google Sheets vẫn giữ bản cũ trong Lịch sử phiên bản (Tệp › Lịch sử phiên bản) và Thùng rác Google Drive giữ tệp đã xoá khoảng 30 ngày. Nếu khách yêu cầu xoá cả ở đó: vào Thùng rác Drive bấm "Xoá vĩnh viễn"; với Lịch sử phiên bản, liên hệ hỗ trợ để chuyển dữ liệu sang bản sao Sheet mới (bản sao không mang lịch sử) rồi xoá vĩnh viễn Sheet cũ.'),
h('label', { class: 'bds-row' }, keepFiles, h('span', null, 'Giữ lại tệp hợp đồng/giấy tờ trên Drive (chỉ khi luật khác buộc lưu) – mặc định: bỏ vào Thùng rác')),
K.field('Lý do (không ghi tên, số điện thoại khách)', reason),
h('p', null, 'Nhập 4 số cuối điện thoại của khách (' + _o2v + ') để xác nhận.'), code,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => { _o1m.close(); res(false); }, { icon: 'close' }),
K.button('Xoá vĩnh viễn', () => {
if (reason.value.trim().length < 3) { K.toast('Ghi lý do xoá', 'warn'); return; }
if (code.value.trim().toUpperCase() !== _o2v) { K.toast('Mã xác nhận chưa đúng', 'warn'); return; }
_o1m.close(); res(true);
}, { kind: 'danger', testid: 'erase-request-confirm' }))] });
});
if (!ok) return;
let _o2j = null;
try { _o2j = await K.api('archive.erase', { id, reason: reason.value.trim(), keep_files: !!keepFiles.checked }); } catch (e) { _o2j = null; }
await _ox();
if (_o2j && !_o2j.archive_error) K.toast('Đã xoá dữ liệu khách khỏi Sheet chính và Sổ khách lưu trữ', 'success');
else K.toast('Đã xoá dữ liệu khách trên máy. Máy chủ sẽ xoá khỏi Sổ khách lưu trữ ở lần đồng bộ tới.', 'warn');
_o2m.close();
}
async function _oi(ns) {
const _o1s = c.status || 'Mới';
if (ns === _o1s) return;
await K.put('objects', { ...c, status: ns });
await K.logEvent(id, 'status', _o1s + ' → ' + ns, { from: _o1s, to: ns });
K.toast('Đã đổi trạng thái: ' + ns, 'success');
await _o29();
if (crm.isPostSale({ status: ns })) K.toast('Có thể bấm "Lập lịch đóng tiền" để nhắc các đợt thanh toán', 'info');
}
function _o1n() {
const _oq = new Date(Date.now() + 86400000); _oq.setHours(9, 0, 0, 0);
const _o1l = new Date(_oq.getTime() - _oq.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
const _o2z = h('input', { type: 'datetime-local', value: _o1l, 'data-testid': 'meeting-at' });
const title = h('input', { value: 'Hẹn xem nhà' + (c.project ? ' – ' + K.projectName(c.project) : ''), 'data-testid': 'meeting-title' });
const _od = h('input', { type: 'number', min: 0, max: 30, value: 0 });
const _o1m = K.modal({ title: 'Hẹn lịch với ' + (c.name || 'khách'), testid: 'meeting-modal', body: [
K.field('Thời gian', _o2z), K.field('Nội dung', title), K.field('Nhắc trước (ngày)', _od),
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _o1m.close(), { icon: 'close' }), K.button('Lưu lịch hẹn', async () => {
const at = new Date(_o2z.value).getTime();
if (!Number.isFinite(at)) { K.toast('Chọn thời gian hẹn', 'warn'); return; }
await K.put('reminders', { object_id: id, kind: 'meeting', title: title.value.trim() + ' – ' + (c.name || ''), due_at: at, remind_before_days: Number(_od.value) || 0, amount: 0, installment: 0, done: 0, notified_at: 0, data: '{}' });
await K.logEvent(id, 'meeting', 'Hẹn ' + crm.dmy(at) + ' ' + crm.hm(at) + ': ' + title.value.trim());
_o1m.close(); K.toast('Đã lưu lịch hẹn', 'success'); _o29();
}, { kind: 'primary', icon: 'check', testid: 'meeting-save' }))] });
}
async function erase() {
const _o1r = await K.confirm({ title: 'Xoá dữ liệu khách?', testid: 'erase-step1', kind: 'danger', ok: 'Tiếp tục',
text: 'Toàn bộ thông tin cá nhân của "' + (c.name || '') + '" (tên, số điện thoại, Zalo, ghi chú, ngày sinh, lịch sử liên hệ, nhắc việc, dữ liệu khách trong giữ chỗ/hồ sơ/việc) sẽ bị xoá và không khôi phục được. Lưu ý: Lịch sử phiên bản của Google Sheets và Thùng rác Drive còn giữ bản cũ một thời gian – nhờ Chủ xử lý nếu khách yêu cầu.' });
if (!_o1r) return;
const _o2v = crm.normPhone(c.phone).slice(-4) || 'XOA';
const code = h('input', { inputmode: 'numeric', 'data-testid': 'erase-code', placeholder: _o2v });
const done = await new Promise(res => {
const _o1m = K.modal({ title: 'Xác nhận lần 2', testid: 'erase-step2', body: [
h('p', null, 'Nhập 4 số cuối điện thoại của khách (' + _o2v + ') để xác nhận xoá.'), code,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => { _o1m.close(); res(false); }, { icon: 'close' }),
K.button('Xoá vĩnh viễn', () => {
if (code.value.trim().toUpperCase() !== _o2v) { K.toast('Mã xác nhận chưa đúng', 'warn'); return; }
_o1m.close(); res(true);
}, { kind: 'danger', testid: 'erase-confirm' }))] });
});
if (!done) return;
await _ox();
K.toast('Đã xoá dữ liệu khách', 'success');
_o2m.close();
}
async function _ox() {
const t = Date.now();
const [events, reminders] = await Promise.all([K.listAll('events'), K.listAll('reminders')]);
for (const e of events) if (e.object_id === id && !Number(e.deleted)) await K.put('events', { ...e, text: '', data: '', deleted: 1 });
for (const r of reminders) if (r.object_id === id && !Number(r.deleted)) await K.put('reminders', { ...r, title: '', data: '', deleted: 1 });
await K.put('objects', crm.anonymize(c, t));
try { await ctx.store.put('audit', { id: K.newId(), at: t, device_id: (ctx.auth && ctx.auth.deviceId) || '', action: 'customer.erase', object_id: id, detail: 'Xoá dữ liệu cá nhân theo yêu cầu của khách', updated_at: t }); } catch { }
}
await _o29();
K.on(body, ['events', 'reminders', 'objects'], _o29);
return _o2m;
}
export default {
manifest: {
id: 'customers', title: 'Khách hàng', icon: '👥', screen: 'customers', order: 10, version: '1.0.0', status: 'ready',
help: 'Danh sách khách: tìm không dấu, lọc, gọi/Zalo một chạm, chấm màu mức quan tâm (Nóng/Bình thường/Lạnh), tính cách D-I-S-C kèm gợi ý tư vấn, hồ sơ với dòng thời gian và nhắc việc; thẻ Đối tác mở Sổ đối tác (gói 4).',
},
mount,
async selftest(ctx) {
return selftestCommon(ctx, ['fmt.money', 'link.tel', 'link.zalo', 'status.lists', 'status.group', 'ids.new'], div => mount(div, ctx));
},
};

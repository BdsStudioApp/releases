import { kit, h, selftestCommon, inSelftest } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import { openImport, canImport } from './import_ui.js';
import { openConnect, canConnect } from '../_lib/lead_connect_ui.js';
import * as LP from '../_lib/lead_pool.js';
import { featureAllowed } from '../../../core/features.acef34c96e.js';
import * as G4 from '../_lib/g4_logic.js';
import * as SR from '../_lib/source_roi.js';
import * as CS from '../_lib/consent.js';
import * as CU from './consent_ui.js';
const _o6 = [['', 'Mọi nguồn'], ['video', 'TikTok/Reels'], ['facebook', 'Bài Facebook'], ['landing', 'Landing'], ['referral', 'Giới thiệu'], ['warm', 'Người quen'], ['zalo', 'Zalo'], ['magnet', 'Mồi câu'], ['other', 'Khác'], ['manual', 'Tự nhập'], ['walkin', 'Khách vãng lai'], ['webhook', 'Landing ngoài (webhook)'], ['import', 'Nhập Excel/CSV'], [LP.PL_SRC, '🏢 Công ty cấp']];
const _o7 = Object.fromEntries(_o6.filter(s => s[0]));
function sourceLabel(s) { s = String(s || ''); return s.startsWith('webhook:') ? 'Landing ngoài · ' + s.slice(8) : (_o7[s] || s); }
function _o17(_ot, magnet = true) { const base = _o6.slice(1).filter(_o38 => _o38[0] !== 'webhook' && (magnet || _o38[0] !== 'magnet')); return _ot && !base.some(_o38 => _o38[0] === _ot) ? [...base, [_ot, sourceLabel(_ot)]] : base; }
function _o1u(ctx) { try { return !ctx.packs || ctx.packs.moduleOn('g3_docs') !== false; } catch { return true; } }
const _o1 = { call: '📞', zalo: '💬', note: '📝', status: '🔁', heat: '🌡️', meeting: '📅', quote: '🧾', payment: '💳', zalo_draft: '✉️' };
const _o3 = 'bds.customers.view';
function loadView() {
try { return JSON.parse(localStorage.getItem(_o3)) || {}; } catch { return {}; }
}
function _o2o(v) { try { localStorage.setItem(_o3, JSON.stringify({ ...loadView(), ...v })); } catch { } }
const _o2 = { customers_scope: 'all', assign: true, erase: true, export: true };
function _o2b(ctx) { return (ctx.user && ctx.user.perms) || _o2; }
function _o1y(ctx) { return !!(ctx.user && !ctx.user.legacy); }
function _o1m(ctx) {
const P = (ctx.user && ctx.user.perms) || {};
if (!(P.lead_any || P.lead_pool) || !_o1y(ctx)) return null;
const ico = ctx.ui && typeof ctx.ui.icon === 'function' ? ctx.ui.icon('inbox', 18) : h('span', { 'aria-hidden': 'true' }, '📥');
return h('a', { class: 'cu-pool-link', href: '#/customers/lead_pool', 'data-testid': 'lead-pool-link', title: 'Kho lead công ty: nhập khách, chia cho nhân viên, báo cáo nguồn' }, ico, ' Kho lead');
}
function _o33(ctx) { return _o1y(ctx) && !ctx.solo; }
function _o1j(ctx) { return !!(ctx.user && ctx.user.role === 'owner' && !ctx.user.legacy); }
function isMine(ctx, c) { return ctx.users && ctx.users.isMine ? ctx.users.isMine(c) : true; }
async function _o27(ctx) {
const P = _o2b(ctx);
if (!ctx.users || !(P.assign || P.customers_scope === 'all')) return [];
try { return await ctx.users.directory(); } catch { return []; }
}
function ownerLabel(ctx, id, dir) { return ctx.users && id ? ctx.users.label(id, dir) : ''; }
export function csvCell(v) { const s0 = String(v == null ? '' : v), s = /^[=+\-@\t\r]/.test(s0) ? "'" + s0 : s0; return /[",\n\r;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
const _o0 = 'bds-customers-css';
function _o11() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
document.head.appendChild(h('link', { id: _o0, rel: 'stylesheet', href: new URL('./customers.css', import.meta.url).href }));
}
async function _o1r(K) { try { return crm.heatTiers(await K.setting('g2.score', null)); } catch { return crm.heatTiers(null); } }
function _o1e(c, tiers, onClick, testid) {
const _o38 = crm.heatOf(c, { tiers });
const title = crm.heatTitle(_o38) + (onClick ? '. Bấm để đổi.' : '.');
return h(onClick ? 'button' : 'span', {
type: onClick ? 'button' : null, class: 'cu-heat cu-heat-' + _o38.id + (_o38.source === 'none' ? ' cu-heat-unset' : ''),
title, 'aria-label': title, 'data-testid': testid || ('heat-' + c.id), 'data-heat': _o38.id, 'data-heat-source': _o38.source,
onclick: onClick ? e => { e.stopPropagation(); onClick(); } : null,
}, h('span', { class: 'cu-dot', 'aria-hidden': 'true' }), h('span', { class: 'cu-heat-l' }, _o38.label));
}
async function _o2v(K, id, level, tiers) {
const fresh = await K.get('objects', id);
if (!fresh) { K.toast('Không tìm thấy hồ sơ khách', 'warn'); return null; }
const _oe = crm.heatOf(fresh, { tiers });
const _o2m = await K.put('objects', { ...fresh, ...crm.heatPatch(fresh, level) });
const _oa = crm.heatOf(_o2m, { tiers });
if (_oe.id !== _oa.id || _oe.source !== _oa.source) {
await K.logEvent(id, 'heat', 'Mức quan tâm: ' + _oe.label + ' → ' + _oa.label + (_oa.source === 'manual' ? '' : ' (app tự tính)'), { from: _oe.id, to: _oa.id, manual: _oa.source === 'manual' ? 1 : 0 });
}
K.toast('Mức quan tâm: ' + _oa.label, 'success');
return _o2m;
}
export function pickHeat(ctx, c, { tiers, onDone } = {}) {
const K = kit(ctx);
_o11();
const _ot = crm.heatOf(c, { tiers });
let _o1t;
const _om = async lv => { _o1t.close(); const r = await _o2v(K, c.id, lv, tiers); if (r && onDone) onDone(r); };
_o1t = K.modal({ title: 'Mức quan tâm – ' + (c.name || 'khách'), testid: 'heat-picker', body: [
h('p', { class: 'bds-muted' }, crm.heatTitle(_ot) + '.'),
h('div', { class: 'cu-pick' }, crm.HEAT_LEVELS.map(l => {
const on = _ot.source === 'manual' && _ot.id === l.id;
return h('button', { type: 'button', class: 'cu-opt cu-heat-' + l.id + (on ? ' bds-on' : ''), 'aria-pressed': String(on), 'data-testid': 'heat-set-' + l.id, onclick: () => _om(l.id) },
h('span', { class: 'cu-dot', 'aria-hidden': 'true' }), h('span', null, h('strong', null, l.label), h('small', null, l.hint)));
})),
h('div', { class: 'bds-row bds-end' },
K.button('Để app tự tính theo hành vi', () => _om(null), { kind: 'ghost', testid: 'heat-set-auto', title: 'Bỏ mức tự chọn – dùng điểm hành vi (gọi, nhắn, lịch xem, báo giá…)' })),
] });
return _o1t;
}
function _oy(c, onClick, { long = false, testid } = {}) {
const _o38 = crm.discOf(c);
if (!_o38) {
if (!onClick) return null;
const hint = 'Chưa ghi nhận tính cách D-I-S-C – bấm để chọn (cần khách đã đồng ý lưu thông tin)';
return h('button', { type: 'button', class: 'cu-disc is-empty', title: hint, 'aria-label': hint, 'data-testid': testid || ('disc-' + c.id), 'data-disc': '',
onclick: e => { e.stopPropagation(); onClick(); } }, '🧭 Tính cách');
}
const title = 'Tính cách ' + _o38.id + ' – ' + _o38.label + ' (' + _o38.name + '). Cách tư vấn: ' + _o38.tip;
return h(onClick ? 'button' : 'span', {
type: onClick ? 'button' : null, class: 'cu-disc', title, 'aria-label': title, 'data-testid': testid || ('disc-' + c.id), 'data-disc': _o38.id,
onclick: onClick ? e => { e.stopPropagation(); onClick(); } : null,
}, h('b', null, _o38.id), long ? _o38.label : null);
}
async function _o2u(K, id, disc) {
const fresh = await K.get('objects', id);
if (!fresh) { K.toast('Không tìm thấy hồ sơ khách', 'warn'); return null; }
if (disc && !crm.canProfile(fresh)) { K.toast('Khách chưa đồng ý lưu thông tin – chưa ghi nhận xét tính cách.', 'warn'); return null; }
const _o2m = await K.put('objects', { ...fresh, data: crm.discPatch(fresh, disc) });
const _o38 = crm.discOf(_o2m);
K.toast(_o38 ? 'Tính cách: ' + crm.discShort(_o38) : 'Đã bỏ nhận xét tính cách', 'success');
return _o2m;
}
export function pickDisc(ctx, c, { onDone } = {}) {
const K = kit(ctx);
_o11();
if (!crm.canProfile(c)) { K.toast('Khách chưa đồng ý lưu thông tin – chưa ghi nhận xét tính cách (Luật Bảo vệ dữ liệu cá nhân 2025).', 'warn'); return null; }
const _ot = crm.discOf(c);
let _o1t;
const _om = async id => { _o1t.close(); const r = await _o2u(K, c.id, id); if (r && onDone) onDone(r); };
_o1t = K.modal({ title: 'Tính cách D-I-S-C – ' + (c.name || 'khách'), testid: 'disc-picker', body: [
h('p', { class: 'bds-muted' }, crm.DISC_NOTE),
h('div', { class: 'cu-pick' }, crm.DISC.map(_o38 => {
const on = !!_ot && _ot.id === _o38.id;
return h('button', { type: 'button', class: 'cu-opt' + (on ? ' bds-on' : ''), 'aria-pressed': String(on), 'data-testid': 'disc-set-' + _o38.id, onclick: () => _om(_o38.id) },
h('span', { class: 'cu-disc-l', 'aria-hidden': 'true' }, _o38.id),
h('span', null, h('strong', null, _o38.id + ' – ' + _o38.label + ' (' + _o38.name + ')'), h('small', null, _o38.desc), h('small', null, '💡 ' + _o38.tip)));
})),
h('div', { class: 'bds-row bds-end' }, K.button('Chưa rõ', () => _om(''), { kind: 'ghost', testid: 'disc-set-none' })),
] });
return _o1t;
}
const _o4 = 'g4_doitac';
const _o5 = '#/customers/g4_doitac';
function _o29(ctx) {
const p = ctx.packs;
if (!featureAllowed(_o4, ctx.user && ctx.user.perms)) return false;
if (!p) return true;
try { return !!p.moduleOn(_o4); } catch { return false; }
}
function _o1k(ctx) { const _o35 = ctx.user; return !_o35 || _o35.legacy || !_o35.role || _o35.role === 'owner'; }
function _o23(K, ctx, q = '') {
if (_o29(ctx)) { K.nav(_o5 + q); return true; }
if (!featureAllowed(_o4, ctx.user && ctx.user.perms)) { K.toast('Sổ đối tác thuộc phần "Bảng hàng dự án". Tài khoản của anh/chị chưa được cấp phần này – nhờ Quản trị bật trong Cài đặt › Người dùng.', 'warn'); return false; }
const owner = _o1k(ctx);
K.toast(owner ? 'Sổ đối tác đang tắt – bật trong Cài đặt → Gói chức năng.' : 'Sổ đối tác đang tắt – nhờ Quản trị bật trong Cài đặt → Gói chức năng.', 'warn');
if (owner) K.nav('settings/packs');
return false;
}
export async function mount(el, ctx) {
const K = kit(ctx);
_o11();
const _o2p = loadView();
const st = {
q: '', status: '', need: '', project: '', source: '', heat: '', disc: '', consent: '', tiers: await _o1r(K), sort: _o2p.sort || 'newest',
density: document.body.dataset.density === 'detail' ? 'detail' : 'compact',
scope: _o2p.scope === 'mine' ? 'mine' : 'all', selecting: false, picked: new Set(), dir: [], shown: [],
};
const P = _o2b(ctx);
const _o2h = new URLSearchParams((location.hash.split('?')[1]) || '');
if ((_o2h.get('tab') === 'doitac' || _o2h.get('tab') === 'partners') && _o23(K, ctx)) return;
el.innerHTML = '';
const _o1p = h('div', { class: 'bds-list', 'data-testid': 'customer-list' });
const _or = h('span', { class: 'bds-muted' });
let _o2g = null, bigList = false;
const search = h('input', { type: 'search', enterkeyhint: 'search', autocomplete: 'off', placeholder: 'Tìm tên, số điện thoại, dự án…', 'aria-label': 'Tìm khách', 'data-testid': 'customer-search', oninput: e => { st.q = e.target.value; clearTimeout(_o2g); _o2g = setTimeout(_o2l, data && bigList ? 150 : 0); } });
const consentSel = K.select([['', 'Mọi trạng thái đồng ý'], ['unclear', 'Chưa có đồng ý rõ ràng'], ['withdrawn', 'Đã rút lại đồng ý']], '', { 'aria-label': 'Đồng ý dữ liệu', 'data-testid': 'consent-filter', onchange: e => { st.consent = e.target.value; _o2l(); } });
const _o2f = [['', 'Mọi dự án'], ...K.projects().map(p => [p.id, p.name])];
const _o1z = [['', 'Mọi nhu cầu'], ...crm.NEEDS.map(n => [n, _oh(n)])];
const statusSel = K.select([['', 'Mọi trạng thái'], ...crm.allStatuses(K.L)], '', { 'aria-label': 'Trạng thái', onchange: e => { st.status = e.target.value; _o2l(); } });
const bar = h('div', { class: 'bds-toolbar' },
search,
h('div', { class: 'bds-filters' },
statusSel,
K.select(_o1z, '', { 'aria-label': 'Nhu cầu', onchange: e => { st.need = e.target.value; _o2l(); } }),
K.select(_o2f, '', { 'aria-label': 'Dự án', onchange: e => { st.project = e.target.value; _o2l(); } }),
K.select(_o6, '', { 'aria-label': 'Nguồn', onchange: e => { st.source = e.target.value; _o2l(); } }),
K.select([['', 'Mọi mức quan tâm'], ...crm.HEAT_LEVELS.map(l => [l.id, l.label])], '', { 'aria-label': 'Mức quan tâm', 'data-testid': 'heat-filter', onchange: e => { st.heat = e.target.value; _o2l(); } }),
K.select([['', 'Mọi tính cách'], ...crm.DISC.map(_o38 => [_o38.id, _o38.id + ' – ' + _o38.label]), ['none', 'Chưa rõ tính cách']], '', { 'aria-label': 'Tính cách D-I-S-C', 'data-testid': 'disc-filter', onchange: e => { st.disc = e.target.value; _o2l(); } }),
consentSel,
K.select([['newest', 'Mới nhất'], ['call', 'Cần gọi trước'], ['name', 'Theo tên']], st.sort, { 'aria-label': 'Sắp xếp', onchange: e => { st.sort = e.target.value; _o2o({ sort: st.sort }); _o2l(); } }),
P.customers_scope === 'all' && _o33(ctx) ? K.select([['all', 'Tất cả khách'], ['mine', 'Của tôi']], st.scope, { 'aria-label': 'Phạm vi', 'data-testid': 'scope-select', onchange: e => { st.scope = e.target.value; _o2o({ scope: st.scope }); _o2l(); } }) : null,
));
const _o2r = h('strong', null, '0');
const selBar = h('div', { class: 'bds-selbar', 'data-testid': 'select-bar', hidden: true },
h('span', null, 'Đã chọn ', _o2r),
h('div', { class: 'bds-row' },
K.button('Chọn tất cả', () => { st.shown.forEach(c => st.picked.add(c.id)); _o2l(); }, { kind: 'ghost', icon: 'check', testid: 'select-all' }),
K.button('Chia cho…', () => _od(), { kind: 'primary', icon: 'user', testid: 'assign-selected' }),
K.button('Xong', () => { st.selecting = false; st.picked.clear(); _o2l(); }, { kind: 'ghost', icon: 'check', testid: 'select-done' })));
const selectBtn = P.assign && ctx.users && _o33(ctx) ? K.button('Chia khách', () => { st.selecting = !st.selecting; st.picked.clear(); _o2l(); }, { kind: 'ghost', icon: 'customers', testid: 'assign-mode' }) : null;
const _on = () => { if (moreMenu) moreMenu.open = false; };
const importBtn = canImport(ctx) ? K.button('Nhập khách từ Excel/CSV', () => { _on(); openImport(ctx, K); }, { kind: 'ghost', icon: 'plus', testid: 'import-customers' }) : null;
const connectBtn = canConnect(ctx) && _o1y(ctx) ? K.button('Nối landing có sẵn', async () => { _on(); const me = await K.me(); openConnect(ctx, K, { org: me.name }); }, { kind: 'ghost', icon: 'plug', testid: 'connect-landing' }) : null;
const exportBtn = P.export ? K.button('Xuất CSV', () => { _on(); _o15(); }, { kind: 'ghost', icon: 'download', testid: 'export-customers', title: 'Xuất danh sách đang lọc ra tệp CSV' }) : null;
const _op = CU.consentTools(ctx, { shown: () => st.shown, filterUnclear: () => { _on(); st.consent = 'unclear'; consentSel.value = 'unclear'; _o2l(); } });
const moreMenu = h('details', { class: 'cu-more', 'data-testid': 'cust-more' },
h('summary', { class: 'btn btn-ghost', 'aria-label': 'Thêm thao tác', 'data-testid': 'cust-more-toggle' }, K.icon('more', 18), h('span', null, 'Thêm')),
h('div', { class: 'cu-more-menu', role: 'menu', 'data-testid': 'cust-more-menu' }, exportBtn, importBtn, connectBtn, _op));
moreMenu.addEventListener('toggle', () => {
const _o1t = moreMenu.lastElementChild; if (!moreMenu.open || !_o1t) return;
_o1t.classList.remove('cu-more-left');
if (_o1t.getBoundingClientRect().left < 8) _o1t.classList.add('cu-more-left');
});
{ const off = (e) => { if (!moreMenu.isConnected) { document.removeEventListener('click', off, true); return; } if (moreMenu.open && !moreMenu.contains(e.target)) moreMenu.open = false; }; document.addEventListener('click', off, true); }
async function _od() {
const ids = [...st.picked];
if (!ids.length) { K.toast('Chọn ít nhất một khách', 'warn'); return; }
const _o35 = await ctx.users.pick({ title: 'Chia ' + ids.length + ' khách cho…' });
if (!_o35) return;
try { await ctx.users.assign(ids, _o35.id); } catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa chia được khách', 'danger'); return; }
K.toast('Đã chia ' + ids.length + ' khách cho ' + (_o35.full_name || _o35.username), 'success');
st.selecting = false; st.picked.clear(); _o2l();
}
function _o15() {
const head = ['Tên', 'Điện thoại', 'Zalo', 'Trạng thái', 'Nhu cầu', 'Dự án', 'Loại căn', 'Vốn', 'Nguồn', 'Chi tiết nguồn', 'Phụ trách', 'Ngày tạo', 'Mức quan tâm', 'Tính cách'];
const _o1o = [head, ...st.shown.map(c => [c.name, c.phone, c.zalo, c.status, c.need, K.projectName(c.project), c.unit_type, c.budget || '', sourceLabel(c.source), SR.detailOf(c), ownerLabel(ctx, c.owner, st.dir), c.created_at ? K.date(c.created_at) : '',
crm.heatOf(c, { tiers: st.tiers }).label, crm.discOf(c) ? crm.discShort(crm.discOf(c)) : ''])];
const _of = new Blob(['\ufeff' + _o1o.map(r => r.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
const _o8 = h('a', { href: URL.createObjectURL(_of), download: 'khach-hang-' + new Date().toISOString().slice(0, 10) + '.csv' });
document.body.appendChild(_o8); _o8.click(); _o8.remove(); setTimeout(() => URL.revokeObjectURL(_o8.href), 4000);
K.toast('Đã xuất ' + st.shown.length + ' khách', 'success');
}
try {
const _o1x = new MutationObserver(() => {
if (!el.isConnected) { _o1x.disconnect(); return; }
const d = document.body.dataset.density === 'detail' ? 'detail' : 'compact';
if (d !== st.density) { st.density = d; _o2l(); }
});
_o1x.observe(document.body, { attributes: true, attributeFilter: ['data-density'] });
} catch { }
const sourcesBtn = K.button('Nguồn khách', () => _o24(ctx), { kind: 'ghost', icon: 'pulse', testid: 'source-report', title: 'Nguồn nào ra khách: khách mới, Nóng, hẹn xem, chốt theo nguồn – tuần/tháng' });
const _ov = ctx.user && ctx.user.role;
const deskBtn = _ov && _ov !== 'owner' && _ov !== 'manager' ? null : K.button('Dán tin khách', () => K.nav('#/inbox/inbox?desk=1'), { kind: 'ghost', icon: 'inbox', testid: 'open-desk', title: 'Dán tin Zalo/Messenger/bình luận – app nhận tên, SĐT, dự án để tạo khách' });
const _o28 = K.button('🤝 Mở Sổ đối tác', () => _o23(K, ctx), { kind: 'ghost', testid: 'open-partners', title: 'Đối tác và CTV lưu ở Sổ đối tác' });
const _o1c = h('div', { class: 'bds-row' }, moreMenu, K.button('+ Thêm khách', () => openForm(ctx, null), { kind: 'primary', testid: 'add-customer' }));
const _ou = h('div', { class: 'cu-pane bds-screen', 'data-testid': 'customers-pane' },
h('div', { class: 'bds-row bds-tools' }, sourcesBtn, selectBtn, deskBtn, _o28),
bar, selBar, _o1p);
const _o2d = _o1m(ctx);
el.appendChild(h('div', { class: 'bds-screen' },
h('div', { class: 'bds-head' },
h('h2', null, 'Khách hàng ', _or),
_o1c),
_o2d ? h('div', { class: 'cu-pool-row' }, _o2d) : null,
_ou));
_o27(ctx).then(d => { st.dir = d; if (d.length) _o2l(); });
let data = null, renderSeq = 0;
async function _o1q() {
if (!data) data = Promise.all([K.list('objects'), K.list('reminders'), K.list('events')]).then(([customers, reminders, events]) => ({ customers, reminders, events, due: null, last: null }));
return data;
}
async function _o2l() {
const _o2s = ++renderSeq;
const D = await _o1q();
if (_o2s !== renderSeq) return;
const { customers, reminders, events } = D;
bigList = customers.length >= 3000;
const _o1b = new Set([...statusSel.options].map(o => o.value));
for (const c of crm.activeCustomers(customers)) if (c.status && !_o1b.has(c.status)) { _o1b.add(c.status); statusSel.appendChild(h('option', { value: c.status }, c.status)); }
let rows = crm.filterCustomers(customers, st);
if (st.scope === 'mine' && P.customers_scope === 'all' && _o33(ctx)) rows = rows.filter(c => isMine(ctx, c));
rows = crm.sortCustomers(rows, st.sort, { reminders });
st.shown = rows;
selBar.hidden = !st.selecting;
_o2r.textContent = String(st.picked.size);
if (selectBtn) selectBtn.classList.toggle('bds-on', st.selecting);
_or.textContent = '(' + rows.length + ')';
_o1p.innerHTML = '';
_o1p.dataset.density = st.density;
if (!rows.length) {
_o1p.appendChild(K.empty(crm.activeCustomers(customers).length ? 'Không có khách khớp bộ lọc.' : 'Chưa có khách. Bấm "+ Thêm khách" hoặc nhập khách từ landing ở Bảng tin.'));
return;
}
const due = D.due || (D.due = crm.nextDueByCustomer(reminders));
const _o18 = document.createDocumentFragment();
const _o30 = _o33(ctx) && P.customers_scope !== 'own' && P.customers_scope !== 'created';
const _o1l = D.last || (D.last = crm.lastContactMap(events));
for (const c of rows.slice(0, 500)) {
const r = _o2m(K, c, st.density, { due: due.get(c.id), last: _o1l.get(c.id), owner: _o30 ? (ownerLabel(ctx, c.owner, st.dir) || (c.owner ? '' : 'Chưa chia')) : '', tiers: st.tiers });
if (st.selecting) {
const _oi = h('input', { type: 'checkbox', class: 'bds-pick', 'aria-label': 'Chọn ' + (c.name || ''), 'data-testid': 'pick-' + c.id, checked: st.picked.has(c.id),
onchange: e => { if (e.target.checked) st.picked.add(c.id); else st.picked.delete(c.id); _o2r.textContent = String(st.picked.size); } });
r.classList.add('bds-selecting');
r.insertBefore(h('label', { class: 'bds-pick-wrap' }, _oi), r.firstChild);
}
_o18.appendChild(r);
}
_o1p.appendChild(_o18);
}
await _o2l();
K.on(el, ['objects', 'reminders', 'events'], () => { data = null; _o2l(); });
K.on(el, ['settings'], async () => { const t = await _o1r(K); if (t.hot !== st.tiers.hot || t.warm !== st.tiers.warm) { st.tiers = t; _o2l(); } });
if (inSelftest(el)) return;
if (_o2h.get('open')) openProfile(ctx, _o2h.get('open'), { host: el });
if (_o2h.get('new') === '1') openForm(ctx, null);
if (_o2h.get('sources') === '1') _o24(ctx);
}
async function _o24(ctx) { const _o1t = await import('./source_report.js'); return _o1t.openSourceReport(ctx); }
function _oh(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }
function _o31(c) { const d = SR.detailOf(c); return (sourceLabel(c.source) || '—') + (d ? ' – ' + d : ''); }
function _o2m(K, c, density, { due, last, owner, tiers }) {
const open = () => openProfile(K.ctx, c.id);
const main = h('button', { type: 'button', class: 'bds-row-main', onclick: open, 'data-testid': 'open-' + c.id },
h('strong', { class: 'bds-name' }, c.name || '(chưa có tên)'),
h('span', { class: 'bds-sub' }, [K.projectName(c.project), c.unit_type].filter(Boolean).join(' · ') || K.phone(c.phone)),
owner ? h('span', { class: 'bds-owner', 'data-testid': 'owner-' + c.id }, 'Phụ trách: ' + owner) : null);
const _oo = LP.isCompanyLead(c);
const _o26 = h('div', { class: 'bds-item', 'data-id': c.id, 'data-company': _oo ? '1' : null, 'data-heat': crm.heatOf(c, { tiers }).id },
main,
_oo ? h('span', { class: 'bds-row' }, LP.companyBadge(c), K.badge(c.status || 'Mới', crm.statusTone(c.status)), LP.levelBadge(LP.levelOf(c)), _oy(c, () => pickDisc(K.ctx, c), { long: density === 'detail' }))
: h('div', { class: 'cu-meta' },
_o1e(c, tiers, () => pickHeat(K.ctx, c, { tiers })),
K.badge(c.status || 'Mới', crm.statusTone(c.status)),
_oy(c, () => pickDisc(K.ctx, c), { long: density === 'detail' })),
h('div', { class: 'bds-acts' }, _oo && LP.poolInfo(c) ? LP.statusButton(K, K.ctx, c, null, { short: true, small: true }) : null, K.callBtn(c, { short: true }), K.zaloBtn(c, { short: true })));
if (density === 'detail') {
const _ow = h('div', { class: 'bds-item-detail' },
c.budget ? h('span', null, 'Vốn: ' + K.money(c.budget)) : null,
h('span', null, 'Liên hệ cuối: ' + (last ? K.date(last) : 'chưa có')),
due ? h('span', { class: due < crm.dayRange(Date.now())[0] ? 'bds-danger' : '' }, 'Hẹn: ' + K.date(due)) : null,
c.source ? h('span', null, 'Nguồn: ' + _o31(c)) : null,
c.note ? h('span', { class: 'bds-note' }, String(c.note).slice(0, 90)) : null);
_o26.appendChild(_ow);
}
return _o26;
}
export async function openForm(ctx, existing, _o25 = {}) {
const K = kit(ctx);
_o11();
const c = existing || { ...(_o25.prefill && typeof _o25.prefill === 'object' ? _o25.prefill : {}), id: undefined, consent: 0 };
const tiers = await _o1r(K);
const heat0 = crm.HEAT_IDS.includes(crm.parseData(c.data).heat) ? crm.parseData(c.data).heat : '';
const disc0 = (crm.discOf(c) || {}).id || '';
const _o1a = CS.readLog(c).length > 0;
const _o1n = !_o1a && !!existing && Number(c.consent) === 1;
const _oc = !_o1a && !_o1n;
const _o20 = _oc ? CS.noticeConfig(await K.setting(CS.NOTICE_KEY, null)) : null;
const _o1i = (name, attrs = {}) => h('input', { name, value: c[name] ?? '', ...attrs });
const _o16 = {
name: _o1i('name', { required: true, autocomplete: 'off', autocapitalize: 'words', enterkeyhint: 'next', 'data-testid': 'f-name' }),
phone: _o1i('phone', { type: 'tel', inputmode: 'tel', autocomplete: 'off', enterkeyhint: 'next', required: true, 'data-testid': 'f-phone' }),
zalo: _o1i('zalo', { type: 'tel', inputmode: 'tel', autocomplete: 'off', placeholder: 'Để trống nếu trùng số điện thoại' }),
need: K.select(crm.NEEDS.map(n => [n, _oh(n)]), c.need || 'mua', { name: 'need' }),
project: K.select([['', '— Chọn dự án —'], ...K.projects().map(p => [p.id, p.name])], c.project || '', { name: 'project', 'data-testid': 'f-project' }),
unit_type: _o1i('unit_type', { list: 'bds-unit-types', placeholder: 'VD: 2N, 1N+, Studio' }),
budget: _o1i('budget', { value: c.budget ? K.money(c.budget) : '', placeholder: 'VD: 800tr, 1,2 tỷ', 'data-testid': 'f-budget' }),
source: K.select(_o17(c.source, _o1u(ctx)), c.source || 'manual', { name: 'source', 'data-testid': 'f-source' }),
source_detail: h('input', { name: 'source_detail', value: crm.parseData(c.data).source_detail || '', maxlength: SR.DETAIL_MAX, list: 'bds-source-details', placeholder: 'VD: Clip nhà mẫu 2PN, Bài FB 12/11 (tuỳ chọn)', 'data-testid': 'f-source-detail' }),
note: h('textarea', { name: 'note', rows: 3 }, c.note || ''),
birthday: _o1i('birthday', { type: 'date' }),
consent: h('input', { type: 'checkbox', name: 'consent', checked: !!Number(c.consent), 'data-testid': 'f-consent' }),
cChannel: K.select(CS.CHANNELS.map(_o38 => [_o38.id, _o38.label]), 'truc_tiep', { 'aria-label': 'Kênh khách đồng ý', 'data-testid': 'f-consent-channel' }),
cAds: h('input', { type: 'checkbox', 'data-testid': 'f-consent-ads' }),
cAi: h('input', { type: 'checkbox', 'data-testid': 'f-consent-ai' }),
cNotice: h('input', { type: 'checkbox', 'data-testid': 'f-consent-notice' }),
heat: K.select([['', 'Tự động (theo hành vi)'], ...crm.HEAT_LEVELS.map(l => [l.id, l.label])], heat0, { name: 'heat', 'data-testid': 'f-heat' }),
disc: K.select([['', 'Chưa rõ'], ...crm.DISC.map(_o38 => [_o38.id, _o38.id + ' – ' + _o38.label + ' (' + _o38.name + ')'])], disc0, { name: 'disc', 'data-testid': 'f-disc' }),
};
const _o1f = h('small', { class: 'bds-field-h', 'data-testid': 'heat-hint' });
const _oz = h('small', { class: 'bds-field-h', 'data-testid': 'disc-hint' });
const _o2z = () => {
const _o2e = _o16.heat.value ? { data: { heat: _o16.heat.value } } : heat0 ? { ...c, ...crm.heatPatch(c, null) } : c;
const _o38 = crm.heatOf(_o2e, { tiers });
_o1f.textContent = _o16.heat.value ? (crm.HEAT_LEVELS.find(l => l.id === _o38.id) || {}).hint || '' : 'Hiện app tính: ' + crm.heatTitle(_o38).replace(/^Mức quan tâm: /, '');
};
const _o2y = () => { const _o38 = crm.DISC.find(d => d.id === _o16.disc.value); _oz.textContent = _o38 ? '💡 ' + _o38.tip : 'Chọn khi đã trao đổi đủ để nhận ra cách khách thích được tư vấn.'; };
_o16.heat.addEventListener('change', _o2z);
_o16.disc.addEventListener('change', _o2y);
_o2z(); _o2y();
const types = new Set(['Studio', '1N', '1N+', '2N', '2N+', '3N', '4N', 'Duplex', 'Penthouse']);
K.projects().forEach(p => (p.types || []).forEach(t => t.n && types.add(t.n)));
const dl = h('datalist', { id: 'bds-unit-types' }, [...types].map(t => h('option', { value: t })));
const _og = h('small', { class: 'bds-field-h' });
const phoneHint = h('small', { class: 'bds-field-h', 'data-testid': 'phone-hint' });
const err = h('div', { class: 'bds-error', role: 'alert', 'data-testid': 'form-error' });
const _o2x = () => {
const v = crm.parseMoney(_o16.budget.value);
_og.textContent = _o16.budget.value ? (v ? '= ' + K.money(v) : 'Chưa hiểu số tiền, ví dụ: 800tr, 1,2 tỷ') : '';
};
['input', 'change', 'blur'].forEach(ev => _o16.budget.addEventListener(ev, _o2x));
let _ob = await K.list('objects');
const _o2j = SR.recentDetails(_ob, { extra: K.projects().map(p => p.name).filter(Boolean).slice(0, 4) });
const sdl = h('datalist', { id: 'bds-source-details' }, _o2j.map(v => h('option', { value: v })));
const chips = _o2j.length ? h('div', { class: 'cu-sd-chips', 'data-testid': 'sd-chips' }, _o2j.slice(0, 6).map(v =>
h('button', { type: 'button', class: 'cu-sd-chip', 'data-testid': 'sd-chip', onclick: () => { _o16.source_detail.value = v; } }, v))) : null;
const _ol = () => {
const p = crm.normPhone(_o16.phone.value);
phoneHint.textContent = '';
phoneHint.innerHTML = '';
if (!_o16.phone.value) return null;
if (!crm.validPhone(p)) { phoneHint.textContent = 'Số điện thoại chưa đúng (10 số, bắt đầu bằng 0).'; return 'invalid'; }
const _o10 = crm.findDuplicatePhone(_ob, p, c.id);
if (_o10) {
phoneHint.appendChild(h('span', { class: 'bds-danger' }, 'Số này đã có trong hồ sơ "' + (_o10.name || '') + '". '));
phoneHint.appendChild(h('a', { href: '#', onclick: e => { e.preventDefault(); _o2w.close(); K.afterClose(() => openProfile(ctx, _o10.id)); } }, 'Mở hồ sơ đó'));
return 'dup';
}
phoneHint.textContent = K.phone(p);
return null;
};
_o16.phone.addEventListener('blur', _ol);
const pasteHint = h('small', { class: 'bds-field-h', 'data-testid': 'paste-hint' }, existing ? '' : 'Mẹo: dán nguyên tin khách nhắn Zalo vào ô này – app tự tách tên, số điện thoại, vốn.');
if (!existing) _o16.name.addEventListener('paste', (e) => {
const _o34 = (e.clipboardData && e.clipboardData.getData('text')) || '';
const _o38 = crm.parseLeadText(_o34);
if (!_o38) return;
e.preventDefault();
_o16.name.value = _o38.name;
if (!_o16.phone.value.trim()) _o16.phone.value = _o38.phone;
if (_o38.budget && !_o16.budget.value.trim()) { _o16.budget.value = K.money(_o38.budget); _o2x(); }
if (_o38.unit_type && !_o16.unit_type.value.trim()) _o16.unit_type.value = _o38.unit_type;
if (!_o16.note.value.trim()) _o16.note.value = _o38.note;
_ol();
pasteHint.textContent = '✅ Đã tách từ tin dán: ' + [_o38.name && 'tên', 'số điện thoại', _o38.budget && 'vốn', _o38.unit_type && 'loại căn'].filter(Boolean).join(', ') + ' – nguyên văn tin ở Ghi chú. Kiểm lại trước khi lưu.';
if (!_o38.name) _o16.name.focus();
});
const _o2n = async () => {
err.textContent = '';
const name = _o16.name.value.trim();
if (!name) { err.textContent = 'Nhập tên khách.'; _o16.name.focus(); return; }
_ob = await K.list('objects');
const _o2a = _ol();
if (!_o16.phone.value.trim()) { err.textContent = 'Nhập số điện thoại.'; _o16.phone.focus(); return; }
if (_o2a === 'invalid') { err.textContent = 'Số điện thoại chưa đúng (10 số, bắt đầu bằng 0).'; _o16.phone.focus(); return; }
if (_o2a === 'dup') { err.textContent = 'Số điện thoại đã có trong danh sách khách.'; return; }
if (_o16.zalo.value.trim() && !crm.validPhone(_o16.zalo.value)) { err.textContent = 'Số Zalo chưa đúng (10 số, bắt đầu bằng 0) – để trống nếu trùng số điện thoại.'; return; }
let budget = 0;
if (_o16.budget.value.trim()) {
budget = crm.parseMoney(_o16.budget.value);
if (!budget) { err.textContent = 'Chưa hiểu số vốn. Ví dụ: 800tr, 1,2 tỷ.'; return; }
}
if (!_o1a && !_o16.consent.checked) { err.textContent = 'Cần khách đồng ý cho lưu thông tin – theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15.'; return; }
const t = Date.now();
const _o1d = _o16.heat.value !== heat0;
const _o1g = _o1d ? crm.heatPatch(c, _o16.heat.value || null, t) : null;
let data = SR.detailPatch({ data: crm.discPatch({ data: _o1g ? _o1g.data : (c.data || '{}') }, _o16.disc.value) }, _o16.source_detail.value);
let _oq = _o1a ? Number(c.consent) || 0 : 1;
let entry = null;
if (_oc) {
const me = ctx.user || {};
const r = CS.makeEntry({ act: 'grant', scopes: ['luu', 'cham_soc', ...(_o16.cAds.checked ? ['quang_cao'] : []), ...(_o16.cAi.checked ? ['ai'] : [])], channel: _o16.cChannel.value,
by: me.id || '', by_name: me.full_name || me.username || (await K.me()).name || 'Chủ app', notice_version: _o16.cNotice.checked ? _o20.version : '' }, { now: t });
if (!r.ok) { err.textContent = r.error; return; }
entry = r.entry;
const _o36 = CS.withEntry({ data }, entry);
data = _o36.data; _oq = _o36.consent;
}
const _o2m = {
...c, kind: 'customer', name, phone: crm.normPhone(_o16.phone.value), zalo: _o16.zalo.value.trim() ? crm.normPhone(_o16.zalo.value) : '',
need: _o16.need.value, project: _o16.project.value, unit_type: _o16.unit_type.value.trim(), budget, source: _o16.source.value,
note: _o16.note.value.trim(), birthday: _o16.birthday.value, consent: _oq,
status: c.status || 'Mới', created_at: c.created_at || t, data, deleted: 0,
...(_o1g ? { tags: _o1g.tags } : {}),
};
if (!_o2m.id) _o2m.id = K.newId();
const me = ctx.user;
if (me && me.id && !existing) { _o2m.owner = _o2m.owner || me.id; _o2m.created_by = _o2m.created_by || me.id; }
const _o2q = await K.put('objects', _o2m);
if (existing && _o1d) {
const _o8 = crm.heatOf(c, { tiers }), b = crm.heatOf(_o2q, { tiers });
if (_o8.id !== b.id || _o8.source !== b.source) await K.logEvent(_o2q.id, 'heat', 'Mức quan tâm: ' + _o8.label + ' → ' + b.label + (b.source === 'manual' ? '' : ' (app tự tính)'), { from: _o8.id, to: b.id, manual: b.source === 'manual' ? 1 : 0 });
}
if (!existing) {
await K.logEvent(_o2q.id, 'note', 'Tạo hồ sơ khách (đã có đồng ý lưu thông tin' + (entry ? ' – ' + CS.channelLabel(entry.channel) : '') + ')', { consent_at: t });
K.toast('Đã thêm khách ' + name, 'success');
} else {
if (entry) await K.logEvent(_o2q.id, 'note', 'Ghi nhận đồng ý: ' + entry.scopes.map(CS.scopeLabel).join(', ').toLowerCase() + ' (' + CS.channelLabel(entry.channel) + ')', { consent: 'grant', scopes: entry.scopes });
K.toast('Đã lưu thông tin khách', 'success');
}
_o2w.close();
if (_o25.onSaved) _o25.onSaved(_o2q); else if (!existing) K.afterClose(() => openProfile(ctx, _o2q.id));
};
const _o2w = (existing ? K.modal : K.sheet)({
wide: true,
title: existing ? 'Sửa thông tin khách' : 'Thêm khách',
testid: 'customer-form',
body: h('form', { class: 'bds-form', onsubmit: e => { e.preventDefault(); _o2n(); } },
dl,
K.field('Tên khách *', _o16.name), pasteHint,
K.field('Điện thoại *', _o16.phone, null), phoneHint,
K.field('Zalo', _o16.zalo),
h('div', { class: 'bds-grid2' }, K.field('Nhu cầu', _o16.need), K.field('Nguồn', _o16.source)),
sdl, K.field('Chi tiết nguồn', _o16.source_detail, 'Tên bài đăng, clip, chiến dịch hoặc dự án – để biết cái nào ra khách thật.'), chips,
K.field('Dự án quan tâm', _o16.project),
h('div', { class: 'bds-grid2' }, K.field('Loại căn', _o16.unit_type), h('div', null, K.field('Vốn', _o16.budget), _og)),
h('div', { class: 'bds-grid2' }, h('div', null, K.field('Mức quan tâm', _o16.heat), _o1f), h('div', null, K.field('Tính cách (D-I-S-C)', _o16.disc), _oz)),
K.field('Ngày sinh', _o16.birthday),
K.field('Ghi chú', _o16.note),
_o1a ? h('p', { class: 'bds-muted', 'data-testid': 'f-consent-logged' }, '🛡️ ' + CS.statusText(c).text + ' – đổi ở "Nhật ký đồng ý" trong hồ sơ khách.')
: h('label', { class: 'bds-check' }, _o16.consent, h('span', null, 'Khách đã đồng ý rõ ràng cho lưu và dùng thông tin để liên hệ tư vấn bất động sản (bắt buộc – theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15).')),
_oc ? h('div', { class: 'cu-consent-form', 'data-testid': 'f-consent-extra' },
K.field('Kênh khách đồng ý', _o16.cChannel),
h('label', { class: 'bds-check' }, _o16.cAds, h('span', null, 'Khách đồng ý nhận tin quảng cáo (ưu đãi, dự án mới)')),
h('label', { class: 'bds-check' }, _o16.cAi, h('span', null, 'Khách đồng ý để AI xử lý thông tin (rút gọn, không số điện thoại)')),
h('label', { class: 'bds-check' }, _o16.cNotice, h('span', null, 'Đã đọc/gửi thông báo mẫu bản ' + _o20.version + ' ', h('a', { href: '#', onclick: e => { e.preventDefault(); CU.openNotice(ctx); } }, '(xem)')))) : null,
err,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _o2w.close(), { icon: 'close' }), K.button('Lưu khách', null, { kind: 'primary', type: 'submit', icon: 'check', testid: 'f-save' }))),
});
if (_og && c.budget) _og.textContent = '= ' + K.money(c.budget);
setTimeout(() => { try { const _o8 = document.activeElement; if (!_o8 || !/^(INPUT|TEXTAREA|SELECT)$/.test(_o8.tagName)) _o16.name.focus(); } catch { } }, 50);
return _o2w;
}
export async function openProfile(ctx, id, _o25 = {}) {
const K = kit(ctx);
_o11();
const tiers = await _o1r(K);
let c = await K.get('objects', id);
if (_o25.host && !_o25.host.isConnected) return null;
if (!c || Number(c.deleted)) { K.toast('Không tìm thấy hồ sơ khách', 'warn'); return null; }
const body = h('div', { class: 'bds-profile', 'data-testid': 'profile' });
const _o2w = K.sheet({ title: c.name || 'Hồ sơ khách', body, testid: 'profile-sheet' });
const P = _o2b(ctx);
const dir = await _o27(ctx);
async function _o2i() {
const _o35 = await ctx.users.pick({ title: 'Chia "' + (c.name || 'khách') + '" cho…', current: c.owner });
if (!_o35) return;
try { await ctx.users.assign([c.id], _o35.id); } catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa chia được khách', 'danger'); return; }
K.toast('Đã chia cho ' + (_o35.full_name || _o35.username), 'success');
_o2l();
}
async function _o2l() {
c = await K.get('objects', id);
if (!c || Number(c.deleted)) { _o2w.close(); return; }
const [events, reminders, objs] = await Promise.all([K.list('events'), K.list('reminders'), K.list('objects')]);
const _os = G4.findCtvFor(objs, c);
const _o14 = crm.eventsOf(events, id);
const _o2k = reminders.filter(r => r.object_id === id && !Number(r.done)).sort((_o8, b) => _o8.due_at - b.due_at);
body.innerHTML = '';
const statuses = K.statuses(c.need);
const _o25 = statuses.includes(c.status) || !c.status ? statuses : [c.status, ...statuses];
const _o2c = LP.poolInfo(c);
const stSel = _o2c ? LP.statusButton(K, ctx, c, () => _o2l()) : K.select(_o25, c.status || statuses[0], { 'aria-label': 'Trạng thái', 'data-testid': 'status-select', onchange: e => _ok(e.target.value) });
const _o1h = [
['Điện thoại', c.phone ? K.phone(c.phone) : '—'],
c.zalo && c.zalo !== c.phone ? ['Zalo', K.phone(c.zalo)] : null,
['Nhu cầu', _oh(c.need || 'mua')],
['Dự án', K.projectName(c.project) || '—'],
['Loại căn', c.unit_type || '—'],
['Vốn', c.budget ? K.money(c.budget) : '—'],
['Nguồn', _o2c ? h('span', { class: 'bds-row' }, LP.companyBadge(c), LP.levelBadge(LP.levelOf(c))) : h('span', { 'data-testid': 'profile-source' }, _o31(c))],
_o2c ? ['Người cấp', (_o2c.by_name || 'Công ty') + ' · ' + (_o2c.at ? K.date(_o2c.at) + ' ' + crm.hm(_o2c.at) : '')] : null,
_o2c && _o2c.campaign ? ['Chiến dịch', _o2c.campaign + (LP.CHANNELS[_o2c.channel] ? ' (' + LP.CHANNELS[_o2c.channel] + ')' : '')] : null,
c.birthday ? ['Ngày sinh', K.date(c.birthday)] : null,
_o33(ctx) ? ['Phụ trách', h('span', { class: 'bds-row', 'data-testid': 'profile-owner' },
h('span', null, ownerLabel(ctx, c.owner, dir) || (c.owner ? 'Người khác' : 'Chưa chia')),
P.assign && ctx.users ? K.button('Đổi', () => _o2i(), { kind: 'ghost', icon: 'refresh', testid: 'profile-assign' }) : null)] : null,
].filter(Boolean);
const disc = crm.discOf(c);
const consentOk = crm.canProfile(c);
const _ox = K.button('🧭 Tính cách: ' + crm.discShort(disc), () => pickDisc(ctx, c, { onDone: _o2l }), {
testid: 'profile-disc', title: consentOk ? 'Chọn nhóm tính cách D-I-S-C để có gợi ý cách tư vấn' : 'Khách chưa đồng ý lưu thông tin – chưa ghi nhận xét tính cách' });
if (!consentOk) _ox.disabled = true;
const _oj = CS.gate(c, 'contact');
body.appendChild(h('div', { class: 'bds-pf-top' },
h('div', { class: 'bds-row' }, _o2c ? K.badge(c.status || 'Mới', crm.statusTone(c.status)) : null, stSel,
_o2c ? null : _o1e(c, tiers, () => pickHeat(ctx, c, { tiers, onDone: _o2l }), 'profile-heat'), _ox),
disc ? h('p', { class: 'cu-tip', 'data-testid': 'disc-tip' }, h('strong', null, 'Cách tư vấn hợp nhóm ' + disc.id + ' (' + disc.label + '): '), disc.tip) : null,
h('dl', { class: 'bds-dl' }, _o1h.map(([k, v]) => [h('dt', null, k), h('dd', null, v)])),
c.note ? h('p', { class: 'bds-note' }, c.note) : null));
body.appendChild(CU.consentBox(ctx, c, { onChange: _o2l }));
const _o9 = h('div', { class: 'bds-acts bds-wrap' },
K.callBtn(c), K.zaloBtn(c),
_oj.ok ? K.button('✉️ Soạn tin Zalo', async () => { const _o39 = await import('../zalo/index.js'); _o39.openComposer(ctx, c); }, { testid: 'compose-zalo' }) : null,
K.button('🧾 Tạo báo giá', () => { _o2w.close(); K.nav('#/sales/quote?customer=' + encodeURIComponent(c.id)); }, { testid: 'make-quote' }),
K.button('📅 Hẹn lịch', () => _o1w(), { testid: 'add-meeting' }),
crm.isPostSale(c) ? K.button('💳 Lập lịch đóng tiền', async () => { const _o1t = await import('../care/index.js'); _o1t.openPaymentPlanner(ctx, c); }, { kind: 'primary', testid: 'plan-payments' }) : null,
K.button('✏️ Sửa', () => openForm(ctx, c, { onSaved: _o2l }), { testid: 'edit-customer' }),
_os ? K.button('🤝 Đã là CTV – mở hồ sơ', () => { _o2w.close(); K.afterClose(() => _o23(K, ctx, '?open=' + encodeURIComponent(_os.id))); }, { testid: 'make-ctv', title: 'Mở hồ sơ CTV ở Sổ đối tác' })
: K.button('🤝 Nâng thành CTV', () => _o1v(), { testid: 'make-ctv', title: 'Tạo CTV trong Sổ đối tác từ khách này – khách vẫn giữ nguyên' }));
body.appendChild(_o9);
const noteIn = h('textarea', { rows: 2, placeholder: 'Ghi chú nhanh sau cuộc gọi, buổi gặp…', 'data-testid': 'quick-note' });
body.appendChild(h('div', { class: 'bds-quick' }, noteIn, K.button('Lưu ghi chú', async () => {
const t = noteIn.value.trim();
if (!t) { K.toast('Nhập nội dung ghi chú trước khi lưu.', 'warn'); noteIn.focus(); return; }
await K.logEvent(id, 'note', t);
noteIn.value = '';
K.toast('Đã lưu ghi chú', 'success');
_o2l();
}, { testid: 'save-note', icon: 'check' })));
if (_o2k.length) {
body.appendChild(h('h4', null, 'Việc sắp tới'));
body.appendChild(h('ul', { class: 'bds-rem', 'data-testid': 'profile-reminders' }, _o2k.slice(0, 8).map(r => h('li', null,
h('span', null, K.date(r.due_at)), ' ', r.title || r.kind, r.amount ? ' – ' + K.money(r.amount) : ''))));
}
body.appendChild(h('h4', null, 'Dòng thời gian'));
body.appendChild(_o14.length
? h('ol', { class: 'bds-timeline', 'data-testid': 'timeline' }, _o14.slice(0, 100).map(e => h('li', { 'data-type': e.type },
h('span', { class: 'bds-ti' }, _o1[e.type] || '•'),
h('div', null, h('small', { class: 'bds-muted' }, K.date(e.at) + ' ' + crm.hm(e.at)), h('div', null, e.text || e.type)))))
: K.empty('Chưa có hoạt động.'));
if (P.erase && _o1j(ctx)) body.appendChild(h('div', { class: 'bds-danger-zone' },
K.button('Xoá theo yêu cầu khách', () => _o13(), { kind: 'danger', icon: 'close', testid: 'erase-request' }),
h('small', { class: 'bds-muted' }, 'Khi khách yêu cầu xoá dữ liệu (Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15): xoá thông tin cá nhân ở Sheet chính và Sổ khách lưu trữ, giữ lại dấu vết kiểm tra.')));
else if (P.erase) body.appendChild(h('div', { class: 'bds-danger-zone' },
K.button('Xoá dữ liệu khách', () => erase(), { kind: 'danger', testid: 'erase-customer' }),
h('small', { class: 'bds-muted' }, 'Theo yêu cầu của khách (quyền xoá dữ liệu – Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15): xoá thông tin cá nhân, giữ lại dấu vết kiểm tra.')));
}
async function _o13() {
const _o32 = crm.normPhone(c.phone).slice(-4) || 'XOA';
const reason = h('input', { 'data-testid': 'erase-reason', maxlength: 200, placeholder: 'vd: khách gọi điện yêu cầu ngày 17/11' });
const code = h('input', { inputmode: 'numeric', 'data-testid': 'erase-code', placeholder: _o32 });
const keepFiles = h('input', { type: 'checkbox', 'data-testid': 'erase-keep-files' });
const ok = await new Promise(res => {
const _o1t = K.modal({ title: 'Xoá theo yêu cầu khách', testid: 'erase-request-modal', body: [
h('p', null, 'Toàn bộ thông tin cá nhân của "' + (c.name || 'khách') + '" (tên, số điện thoại, Zalo, email, ghi chú, ngày sinh, lịch sử liên hệ, nhắc việc, báo giá; tên khách và ảnh uỷ nhiệm chi trong giữ chỗ, tệp trong hồ sơ giao dịch, việc, mã giới thiệu) sẽ bị xoá VĨNH VIỄN khỏi mọi Sheet dữ liệu và khỏi Sổ khách lưu trữ. Không khôi phục được – kể cả khi khôi phục bản sao lưu cũ.'),
h('p', { class: 'bds-muted' }, 'Căn cứ: quyền xoá dữ liệu của chủ thể dữ liệu – Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15. Chỉ làm khi chính khách yêu cầu. Sổ chỉ giữ một dòng "Đã xoá theo yêu cầu chủ thể dữ liệu" kèm ngày và lý do.'),
h('p', { class: 'bds-muted', 'data-testid': 'erase-backup-note' }, 'Bản sao lưu Sheet hằng tuần (thư mục "BDS Studio – Sao lưu" trên Drive) được máy chủ tự xoá dữ liệu khách này trong khoảng 1 giờ. Bản sao lưu mã hoá anh/chị tự tạo bằng nút Sao lưu (tệp "sao-luu-…") thì máy chủ không mở được nên không tự xoá – nếu cần, anh/chị tự xoá các tệp đó.'),
h('p', { class: 'bds-muted', 'data-testid': 'erase-history-note' }, 'Lưu ý: Google Sheets vẫn giữ bản cũ trong Lịch sử phiên bản (Tệp › Lịch sử phiên bản) và Thùng rác Google Drive giữ tệp đã xoá khoảng 30 ngày. Nếu khách yêu cầu xoá cả ở đó: vào Thùng rác Drive bấm "Xoá vĩnh viễn"; với Lịch sử phiên bản, liên hệ hỗ trợ để chuyển dữ liệu sang bản sao Sheet mới (bản sao không mang lịch sử) rồi xoá vĩnh viễn Sheet cũ.'),
h('label', { class: 'bds-row' }, keepFiles, h('span', null, 'Giữ lại tệp hợp đồng/giấy tờ trên Drive (chỉ khi luật khác buộc lưu) – mặc định: bỏ vào Thùng rác')),
K.field('Lý do (không ghi tên, số điện thoại khách)', reason),
h('p', null, 'Nhập 4 số cuối điện thoại của khách (' + _o32 + ') để xác nhận.'), code,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => { _o1t.close(); res(false); }, { icon: 'close' }),
K.button('Xoá vĩnh viễn', () => {
if (reason.value.trim().length < 3) { K.toast('Ghi lý do xoá', 'warn'); return; }
if (code.value.trim().toUpperCase() !== _o32) { K.toast('Mã xác nhận chưa đúng', 'warn'); return; }
_o1t.close(); res(true);
}, { kind: 'danger', testid: 'erase-request-confirm' }))] });
});
if (!ok) return;
let _o2t = null;
try { _o2t = await K.api('archive.erase', { id, reason: reason.value.trim(), keep_files: !!keepFiles.checked }); } catch (e) { _o2t = null; }
await _o12();
if (_o2t && !_o2t.archive_error) K.toast('Đã xoá dữ liệu khách khỏi Sheet chính và Sổ khách lưu trữ', 'success');
else K.toast('Đã xoá dữ liệu khách trên máy. Máy chủ sẽ xoá khỏi Sổ khách lưu trữ ở lần đồng bộ tới.', 'warn');
_o2w.close();
}
async function _o1v() {
const fresh = await K.get('objects', id);
if (!fresh) { K.toast('Không tìm thấy hồ sơ khách', 'warn'); return; }
const _o19 = G4.findCtvFor(await K.list('objects'), fresh);
if (_o19) { K.toast((fresh.name || 'Khách') + ' đã là CTV', 'info'); await _o2l(); return; }
try { await K.put('objects', G4.ctvFromCustomer(fresh, ctx.user)); } catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa tạo được CTV', 'danger'); return; }
K.toast('Đã thêm ' + (fresh.name || 'khách') + ' vào Sổ đối tác (CTV)', 'success');
await _o2l();
}
async function _ok(ns) {
const _o22 = c.status || 'Mới';
if (ns === _o22) return;
await K.put('objects', { ...c, status: ns });
await K.logEvent(id, 'status', _o22 + ' → ' + ns, { from: _o22, to: ns });
K.toast('Đã đổi trạng thái: ' + ns, 'success');
await _o2l();
if (crm.isPostSale({ status: ns })) K.toast('Có thể bấm "Lập lịch đóng tiền" để nhắc các đợt thanh toán', 'info');
}
function _o1w() {
const d = new Date(Date.now() + 86400000); d.setHours(9, 0, 0, 0);
const _o1s = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
const _o37 = h('input', { type: 'datetime-local', value: _o1s, 'data-testid': 'meeting-at' });
const title = h('input', { value: 'Hẹn xem nhà' + (c.project ? ' – ' + K.projectName(c.project) : ''), 'data-testid': 'meeting-title' });
const _oe = h('input', { type: 'number', min: 0, max: 30, value: 0 });
const _o1t = K.modal({ title: 'Hẹn lịch với ' + (c.name || 'khách'), testid: 'meeting-modal', body: [
K.field('Thời gian', _o37), K.field('Nội dung', title), K.field('Nhắc trước (ngày)', _oe),
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _o1t.close(), { icon: 'close' }), K.button('Lưu lịch hẹn', async () => {
const at = new Date(_o37.value).getTime();
if (!Number.isFinite(at)) { K.toast('Chọn thời gian hẹn', 'warn'); return; }
await K.put('reminders', { object_id: id, kind: 'meeting', title: title.value.trim() + ' – ' + (c.name || ''), due_at: at, remind_before_days: Number(_oe.value) || 0, amount: 0, installment: 0, done: 0, notified_at: 0, data: '{}' });
await K.logEvent(id, 'meeting', 'Hẹn ' + crm.dmy(at) + ' ' + crm.hm(at) + ': ' + title.value.trim());
_o1t.close(); K.toast('Đã lưu lịch hẹn', 'success'); _o2l();
}, { kind: 'primary', icon: 'check', testid: 'meeting-save' }))] });
}
async function erase() {
const _o21 = await K.confirm({ title: 'Xoá dữ liệu khách?', testid: 'erase-step1', kind: 'danger', ok: 'Tiếp tục',
text: 'Toàn bộ thông tin cá nhân của "' + (c.name || '') + '" (tên, số điện thoại, Zalo, ghi chú, ngày sinh, lịch sử liên hệ, nhắc việc, dữ liệu khách trong giữ chỗ/hồ sơ/việc) sẽ bị xoá và không khôi phục được. Lưu ý: Lịch sử phiên bản của Google Sheets và Thùng rác Drive còn giữ bản cũ một thời gian – nhờ Chủ xử lý nếu khách yêu cầu.' });
if (!_o21) return;
const _o32 = crm.normPhone(c.phone).slice(-4) || 'XOA';
const code = h('input', { inputmode: 'numeric', 'data-testid': 'erase-code', placeholder: _o32 });
const done = await new Promise(res => {
const _o1t = K.modal({ title: 'Xác nhận lần 2', testid: 'erase-step2', body: [
h('p', null, 'Nhập 4 số cuối điện thoại của khách (' + _o32 + ') để xác nhận xoá.'), code,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => { _o1t.close(); res(false); }, { icon: 'close' }),
K.button('Xoá vĩnh viễn', () => {
if (code.value.trim().toUpperCase() !== _o32) { K.toast('Mã xác nhận chưa đúng', 'warn'); return; }
_o1t.close(); res(true);
}, { kind: 'danger', testid: 'erase-confirm' }))] });
});
if (!done) return;
await _o12();
K.toast('Đã xoá dữ liệu khách', 'success');
_o2w.close();
}
async function _o12() {
const t = Date.now();
const [events, reminders] = await Promise.all([K.listAll('events'), K.listAll('reminders')]);
for (const e of events) if (e.object_id === id && !Number(e.deleted)) await K.put('events', { ...e, text: '', data: '', deleted: 1 });
for (const r of reminders) if (r.object_id === id && !Number(r.deleted)) await K.put('reminders', { ...r, title: '', data: '', deleted: 1 });
await K.put('objects', crm.anonymize(c, t));
try { await ctx.store.put('audit', { id: K.newId(), at: t, device_id: (ctx.auth && ctx.auth.deviceId) || '', action: 'customer.erase', object_id: id, detail: 'Xoá dữ liệu cá nhân theo yêu cầu của khách', updated_at: t }); } catch { }
}
await _o2l();
K.on(body, ['events', 'reminders', 'objects'], _o2l);
return _o2w;
}
export default {
manifest: {
id: 'customers', title: 'Khách hàng', icon: '👥', screen: 'customers', order: 10, version: '1.0.0', status: 'ready',
help: 'Danh sách khách: tìm không dấu, lọc, gọi/Zalo một chạm, chấm màu mức quan tâm (Nóng/Bình thường/Lạnh), tính cách D-I-S-C kèm gợi ý tư vấn, hồ sơ với dòng thời gian và nhắc việc; nâng khách thành CTV; lối tắt mở Sổ đối tác; nguồn + chi tiết nguồn mỗi khách và báo cáo "Nguồn khách" (nguồn nào ra khách Nóng, hẹn xem, chốt – tuần/tháng).',
},
mount,
async selftest(ctx) {
return selftestCommon(ctx, ['fmt.money', 'link.tel', 'link.zalo', 'status.lists', 'status.group', 'ids.new'], div => mount(div, ctx));
},
};

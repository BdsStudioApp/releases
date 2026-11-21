import { kit, h, selftestCommon, inSelftest } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import { openImport, canImport } from './import_ui.js';
import { openConnect, canConnect } from '../_lib/lead_connect_ui.js';
import * as LP from '../_lib/lead_pool.js';
import { featureAllowed } from '../../../core/features.281cbd68f0.js';
import * as G4 from '../_lib/g4_logic.js';
import * as SR from '../_lib/source_roi.js';
import * as CS from '../_lib/consent.js';
import * as CU from './consent_ui.js';
import * as TR from './trash.js';
import { companyDataNote } from '../_lib/company_data.js';
const _o6 = [['', 'Mọi nguồn'], ['video', 'Video TikTok/Reels'], ['facebook', 'Bài Facebook'], ['landing', 'Landing'], ['referral', 'Giới thiệu'], ['warm', 'Người quen'], ['zalo', 'Zalo'], ['magnet', 'Mồi câu'], ['owner', 'Chủ căn'], ['other', 'Khác'], ['manual', 'Tự nhập'], ['walkin', 'Khách vãng lai'], ['webhook', 'Landing ngoài (webhook)'], ['import', 'Nhập Excel/CSV'], [LP.PL_SRC, '🏢 Công ty cấp']];
const SOURCE_LABEL = Object.fromEntries(_o6.filter(s => s[0]));
function sourceLabel(s) { s = String(s || ''); return s.startsWith('webhook:') ? 'Landing ngoài · ' + s.slice(8) : (SOURCE_LABEL[s] || s); }
function formSources(_os, magnet = true) { const base = _o6.slice(1).filter(_o3h => _o3h[0] !== 'webhook' && (magnet || _o3h[0] !== 'magnet')); return _os && !base.some(_o3h => _o3h[0] === _os) ? [...base, [_os, sourceLabel(_os)]] : base; }
function _o1v(ctx) { try { return !ctx.packs || ctx.packs.moduleOn('g3_docs') !== false; } catch { return true; } }
const _o1 = { call: '📞', zalo: '💬', note: '📝', status: '🔁', heat: '🌡️', meeting: '📅', quote: '🧾', payment: '💳', zalo_draft: '✉️' };
const _o3 = 'bds.customers.view';
function loadView() {
try { return JSON.parse(localStorage.getItem(_o3)) || {}; } catch { return {}; }
}
function _o2w(v) { try { localStorage.setItem(_o3, JSON.stringify({ ...loadView(), ...v })); } catch { } }
const _o2 = { customers_scope: 'all', assign: true, erase: true, export: true };
function _o2f(ctx) { return (ctx.user && ctx.user.perms) || _o2; }
function _o20(ctx) { return !!(ctx.user && !ctx.user.legacy); }
function _o1l(ctx) {
const P = (ctx.user && ctx.user.perms) || {};
if (!(P.lead_any || P.lead_pool) || !_o20(ctx)) return null;
const ico = ctx.ui && typeof ctx.ui.icon === 'function' ? ctx.ui.icon('inbox', 18) : h('span', { 'aria-hidden': 'true' }, '📥');
return h('a', { class: 'cu-pool-link', href: '#/customers/lead_pool', 'data-testid': 'lead-pool-link', title: 'Kho lead công ty: nhập khách, chia cho nhân viên, báo cáo nguồn' }, ico, ' Kho lead');
}
export function sheetButton(ctx, K) {
if (!_o1i(ctx)) return null;
if ((ctx.api || {}).mode === 'demo') return h('span', { class: 'bds-muted cu-sheet-demo', 'data-testid': 'open-sheet-demo' }, 'Nối máy chủ thật để có Google Sheet');
return K.button('📊 Mở Google Sheet', () => openSheetLinks(ctx, K), { kind: 'ghost', testid: 'open-sheet', title: 'Mở Google Sheet dữ liệu – đúng trang tính nơi khách từ landing đổ về' });
}
export async function openSheetLinks(ctx, K) {
let r;
try { r = await K.api('sheet.links', {}); } catch (e) { K.toast('Chưa mở được Google Sheet: ' + ((e && (e.userMessage || e.message)) || 'lỗi máy chủ'), 'danger'); return null; }
if (!r || !r.data) { K.toast('Chưa mở được Google Sheet: máy chủ chưa trả link Sheet dữ liệu.', 'danger'); return null; }
const tabs = r.tabs || {}, here = ' · khách từ landing về đây';
const _o1o = (href, label, testid) => h('a', { class: 'btn btn-ghost', href, target: '_blank', rel: 'noopener noreferrer', 'data-testid': testid, onclick: () => _o1u && _o1u.close() }, label);
const items = [_o1o(tabs.customers || r.data, '👥 Trang tính Khách hàng' + (r.intake !== 'pool' ? here : ''), 'sheet-link-customers')];
if (tabs.pool) items.push(_o1o(tabs.pool, '📥 Trang tính Kho lead' + (r.intake === 'pool' ? here : ''), 'sheet-link-pool'));
if (r.landing) items.push(_o1o(r.landing, '🧾 Sheet landing (bản ghi gốc)', 'sheet-link-landing'));
let _o1u = null;
_o1u = K.modal({ title: '📊 Mở Google Sheet', testid: 'sheet-links', body: [
h('p', { class: 'bds-muted' }, 'Mở ở thẻ mới. Sửa trên Sheet thì app nhận ở lần đồng bộ tới – không đổi tên trang tính và dòng tiêu đề.'),
h('div', { class: 'cu-sheet-links' }, ...items),
h('div', { class: 'bds-row bds-end' }, K.button('Đóng', () => _o1u.close(), { icon: 'close' }))] });
return r;
}
function team(ctx) { return _o20(ctx) && !ctx.solo; }
function _o39(ctx) { return _o1i(ctx) && !!_o2f(ctx).lead_push; }
function _o1i(ctx) { return !!(ctx.user && ctx.user.role === 'owner' && !ctx.user.legacy); }
function isMine(ctx, c) { return ctx.users && ctx.users.isMine ? ctx.users.isMine(c) : true; }
async function _o2b(ctx) {
const P = _o2f(ctx);
if (!ctx.users || !(P.assign || P.customers_scope === 'all')) return [];
try { return await ctx.users.directory(); } catch { return []; }
}
function ownerLabel(ctx, id, dir) { return ctx.users && id ? ctx.users.label(id, dir) : ''; }
export function csvCell(v) { const s0 = String(v == null ? '' : v), s = /^[=+\-@\t\r]/.test(s0) ? "'" + s0 : s0; return /[",\n\r;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
const _o0 = 'bds-customers-css';
function _o10() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
document.head.appendChild(h('link', { id: _o0, rel: 'stylesheet', href: new URL('./customers.css', import.meta.url).href }));
}
async function _o1r(K) { try { return crm.heatTiers(await K.setting('g2.score', null)); } catch { return crm.heatTiers(null); } }
function _o1d(c, tiers, onClick, testid) {
const _o3h = crm.heatOf(c, { tiers });
const title = crm.heatTitle(_o3h) + (onClick ? '. Bấm để đổi.' : '.');
return h(onClick ? 'button' : 'span', {
type: onClick ? 'button' : null, class: 'cu-heat cu-heat-' + _o3h.id + (_o3h.source === 'none' ? ' cu-heat-unset' : ''),
title, 'aria-label': title, 'data-testid': testid || ('heat-' + c.id), 'data-heat': _o3h.id, 'data-heat-source': _o3h.source,
onclick: onClick ? e => { e.stopPropagation(); onClick(); } : null,
}, h('span', { class: 'cu-dot', 'aria-hidden': 'true' }), h('span', { class: 'cu-heat-l' }, _o3h.label));
}
async function _o33(K, id, level, tiers) {
const fresh = await K.get('objects', id);
if (!fresh) { K.toast('Không tìm thấy hồ sơ khách', 'warn'); return null; }
const _od = crm.heatOf(fresh, { tiers });
const _o2t = await K.put('objects', { ...fresh, ...crm.heatPatch(fresh, level) });
const _o9 = crm.heatOf(_o2t, { tiers });
if (_od.id !== _o9.id || _od.source !== _o9.source) {
await K.logEvent(id, 'heat', 'Mức quan tâm: ' + _od.label + ' → ' + _o9.label + (_o9.source === 'manual' ? '' : ' (app tự tính)'), { from: _od.id, to: _o9.id, manual: _o9.source === 'manual' ? 1 : 0 });
}
K.toast('Mức quan tâm: ' + _o9.label, 'success');
return _o2t;
}
export function pickHeat(ctx, c, { tiers, onDone } = {}) {
const K = kit(ctx);
_o10();
const _os = crm.heatOf(c, { tiers });
let _o1u;
const _om = async lv => { _o1u.close(); const r = await _o33(K, c.id, lv, tiers); if (r && onDone) onDone(r); };
_o1u = K.modal({ title: 'Mức quan tâm – ' + (c.name || 'khách'), testid: 'heat-picker', body: [
h('p', { class: 'bds-muted' }, crm.heatTitle(_os) + '.'),
h('div', { class: 'cu-pick' }, crm.HEAT_LEVELS.map(l => {
const on = _os.source === 'manual' && _os.id === l.id;
return h('button', { type: 'button', class: 'cu-opt cu-heat-' + l.id + (on ? ' bds-on' : ''), 'aria-pressed': String(on), 'data-testid': 'heat-set-' + l.id, onclick: () => _om(l.id) },
h('span', { class: 'cu-dot', 'aria-hidden': 'true' }), h('span', null, h('strong', null, l.label), h('small', null, l.hint)));
})),
h('div', { class: 'bds-row bds-end' },
K.button('Để app tự tính theo hành vi', () => _om(null), { kind: 'ghost', testid: 'heat-set-auto', title: 'Bỏ mức tự chọn – dùng điểm hành vi (gọi, nhắn, lịch xem, báo giá…)' })),
] });
return _o1u;
}
function _oy(c, onClick, { long = false, testid } = {}) {
const _o3h = crm.discOf(c);
if (!_o3h) {
if (!onClick) return null;
const hint = 'Chưa ghi nhận tính cách D-I-S-C – bấm để chọn (cần khách đã đồng ý lưu thông tin)';
return h('button', { type: 'button', class: 'cu-disc is-empty', title: hint, 'aria-label': hint, 'data-testid': testid || ('disc-' + c.id), 'data-disc': '',
onclick: e => { e.stopPropagation(); onClick(); } }, '🧭 Tính cách');
}
const title = 'Tính cách ' + _o3h.id + ' – ' + _o3h.label + ' (' + _o3h.name + '). Cách tư vấn: ' + _o3h.tip;
return h(onClick ? 'button' : 'span', {
type: onClick ? 'button' : null, class: 'cu-disc', title, 'aria-label': title, 'data-testid': testid || ('disc-' + c.id), 'data-disc': _o3h.id,
onclick: onClick ? e => { e.stopPropagation(); onClick(); } : null,
}, h('b', null, _o3h.id), long ? _o3h.label : null);
}
async function _o32(K, id, disc) {
const fresh = await K.get('objects', id);
if (!fresh) { K.toast('Không tìm thấy hồ sơ khách', 'warn'); return null; }
if (disc && !crm.canProfile(fresh)) { K.toast('Khách chưa đồng ý lưu thông tin – chưa ghi nhận xét tính cách.', 'warn'); return null; }
const _o2t = await K.put('objects', { ...fresh, data: crm.discPatch(fresh, disc) });
const _o3h = crm.discOf(_o2t);
K.toast(_o3h ? 'Tính cách: ' + crm.discShort(_o3h) : 'Đã bỏ nhận xét tính cách', 'success');
return _o2t;
}
export function pickDisc(ctx, c, { onDone } = {}) {
const K = kit(ctx);
_o10();
if (!crm.canProfile(c)) { K.toast('Khách chưa đồng ý lưu thông tin – chưa ghi nhận xét tính cách (Luật Bảo vệ dữ liệu cá nhân 2025).', 'warn'); return null; }
const _os = crm.discOf(c);
let _o1u;
const _om = async id => { _o1u.close(); const r = await _o32(K, c.id, id); if (r && onDone) onDone(r); };
_o1u = K.modal({ title: 'Tính cách D-I-S-C – ' + (c.name || 'khách'), testid: 'disc-picker', body: [
h('p', { class: 'bds-muted' }, crm.DISC_NOTE),
h('div', { class: 'cu-pick' }, crm.DISC.map(_o3h => {
const on = !!_os && _os.id === _o3h.id;
return h('button', { type: 'button', class: 'cu-opt' + (on ? ' bds-on' : ''), 'aria-pressed': String(on), 'data-testid': 'disc-set-' + _o3h.id, onclick: () => _om(_o3h.id) },
h('span', { class: 'cu-disc-l', 'aria-hidden': 'true' }, _o3h.id),
h('span', null, h('strong', null, _o3h.id + ' – ' + _o3h.label + ' (' + _o3h.name + ')'), h('small', null, _o3h.desc), h('small', null, '💡 ' + _o3h.tip)));
})),
h('div', { class: 'bds-row bds-end' }, K.button('Chưa rõ', () => _om(''), { kind: 'ghost', testid: 'disc-set-none' })),
] });
return _o1u;
}
const _o4 = 'g4_doitac';
const _o5 = '#/customers/g4_doitac';
function _o2d(ctx) {
const p = ctx.packs;
if (!featureAllowed(_o4, ctx.user && ctx.user.perms)) return false;
if (!p) return true;
try { return !!p.moduleOn(_o4); } catch { return false; }
}
function _o1j(ctx) { const _o3e = ctx.user; return !_o3e || _o3e.legacy || !_o3e.role || _o3e.role === 'owner'; }
function _o27(K, ctx, q = '') {
if (_o2d(ctx)) { K.nav(_o5 + q); return true; }
if (!featureAllowed(_o4, ctx.user && ctx.user.perms)) { K.toast('Sổ đối tác thuộc phần "Thông tin dự án". Tài khoản của anh/chị chưa được cấp phần này – nhờ Quản trị bật trong Cài đặt › Nhân sự.', 'warn'); return false; }
const owner = _o1j(ctx);
K.toast(owner ? 'Sổ đối tác đang tắt – bật trong Cài đặt → Gói chức năng.' : 'Sổ đối tác đang tắt – nhờ Quản trị bật trong Cài đặt → Gói chức năng.', 'warn');
if (owner) K.nav('settings/packs');
return false;
}
export async function mount(el, ctx) {
const K = kit(ctx);
_o10();
await K.loadProjects();
const _o2x = loadView();
const st = {
q: '', status: '', need: '', project: '', source: '', heat: '', disc: '', consent: '', tiers: await _o1r(K), sort: _o2x.sort || 'newest',
density: document.body.dataset.density === 'detail' ? 'detail' : 'compact',
scope: _o2x.scope === 'mine' ? 'mine' : 'all', selecting: false, picked: new Set(), dir: [], shown: [], lp: '',
};
const P = _o2f(ctx);
const _o2l = _o1i(ctx) && !!P.lead_push;
const _o2o = new URLSearchParams((location.hash.split('?')[1]) || '');
if ((_o2o.get('tab') === 'doitac' || _o2o.get('tab') === 'partners') && _o27(K, ctx)) return;
el.innerHTML = '';
const _o1p = h('div', { class: 'bds-list', 'data-testid': 'customer-list' });
const _oq = h('span', { class: 'bds-muted' });
let _o2n = null, bigList = false;
const search = h('input', { type: 'search', enterkeyhint: 'search', autocomplete: 'off', placeholder: 'Tìm tên, số điện thoại, dự án…', 'aria-label': 'Tìm khách', 'data-testid': 'customer-search', oninput: e => { st.q = e.target.value; clearTimeout(_o2n); _o2n = setTimeout(_o2s, data && bigList ? 150 : 0); } });
const consentSel = K.select([['', 'Mọi trạng thái đồng ý'], ['unclear', 'Chưa có đồng ý rõ ràng'], ['withdrawn', 'Đã rút lại đồng ý']], '', { 'aria-label': 'Đồng ý dữ liệu', 'data-testid': 'consent-filter', onchange: e => { st.consent = e.target.value; _o2s(); } });
const _o2k = [['', 'Mọi dự án'], ...K.projects().map(p => [p.id, p.name])];
const _o22 = [['', 'Mọi nhu cầu'], ...crm.NEEDS.map(n => [n, _oh(n)])];
const statusSel = K.select([['', 'Mọi trạng thái'], ...crm.allStatuses(K.L)], '', { 'aria-label': 'Trạng thái', onchange: e => { st.status = e.target.value; _o2s(); } });
const bar = h('div', { class: 'bds-toolbar' },
search,
h('div', { class: 'bds-filters' },
statusSel,
K.select(_o22, '', { 'aria-label': 'Nhu cầu', onchange: e => { st.need = e.target.value; _o2s(); } }),
K.select(_o2k, '', { 'aria-label': 'Dự án', onchange: e => { st.project = e.target.value; _o2s(); } }),
K.select(_o6, '', { 'aria-label': 'Nguồn', onchange: e => { st.source = e.target.value; _o2s(); } }),
K.select([['', 'Mọi mức quan tâm'], ...crm.HEAT_LEVELS.map(l => [l.id, l.label])], '', { 'aria-label': 'Mức quan tâm', 'data-testid': 'heat-filter', onchange: e => { st.heat = e.target.value; _o2s(); } }),
K.select([['', 'Mọi tính cách'], ...crm.DISC.map(_o3h => [_o3h.id, _o3h.id + ' – ' + _o3h.label]), ['none', 'Chưa rõ tính cách']], '', { 'aria-label': 'Tính cách D-I-S-C', 'data-testid': 'disc-filter', onchange: e => { st.disc = e.target.value; _o2s(); } }),
consentSel,
K.select([['newest', 'Mới nhất'], ['call', 'Cần gọi trước'], ['name', 'Theo tên']], st.sort, { 'aria-label': 'Sắp xếp', onchange: e => { st.sort = e.target.value; _o2w({ sort: st.sort }); _o2s(); } }),
P.customers_scope === 'all' && team(ctx) ? K.select([['all', 'Tất cả khách'], ['mine', 'Của tôi']], st.scope, { 'aria-label': 'Phạm vi', 'data-testid': 'scope-select', onchange: e => { st.scope = e.target.value; _o2w({ scope: st.scope }); _o2s(); } }) : null,
));
const _o2z = h('strong', null, '0');
const selBar = h('div', { class: 'bds-selbar', 'data-testid': 'select-bar', hidden: true },
h('span', null, 'Đã chọn ', _o2z),
h('div', { class: 'bds-row' },
K.button('Chọn tất cả', () => { st.shown.forEach(c => st.picked.add(c.id)); _o2s(); }, { kind: 'ghost', icon: 'check', testid: 'select-all' }),
h('span', { class: 'cu-sel-assign' }, _o2l ? K.button('Đẩy số', () => _o2m(), { kind: 'primary', icon: 'send', testid: 'push-own-selected' }) : null,
K.button('Chia cho…', () => _oc(), { kind: _o2l ? 'ghost' : 'primary', icon: 'user', testid: 'assign-selected' })),
K.button('Xoá', () => _ou(), { kind: 'danger', icon: 'x', testid: 'delete-selected' }),
K.button('Xong', () => { st.selecting = false; st.picked.clear(); _o2s(); }, { kind: 'ghost', icon: 'check', testid: 'select-done' })));
const _og = !!(P.assign && ctx.users && team(ctx));
const selectBtn = _og ? K.button('Chia khách', () => { st.selMode = 'assign'; st.selecting = !st.selecting; st.picked.clear(); _o2s(); }, { kind: 'ghost', icon: 'customers', testid: 'assign-mode' }) : null;
const deleteModeBtn = K.button('Chọn để xoá', () => { st.selMode = 'delete'; st.selecting = !st.selecting; st.picked.clear(); _o2s(); }, { kind: 'ghost', icon: 'x', testid: 'delete-mode', title: 'Chọn nhiều khách rồi bấm Xoá (vào Thùng rác 30 ngày)' });
async function _ou() {
const D = await _o1q(), ids = new Set(st.picked);
const n = await TR.deleteCustomers(K, ctx, D.customers.filter(c => ids.has(c.id)));
if (n) { st.selecting = false; st.picked.clear(); data = null; _o2s(); }
}
const _on = () => { if (moreMenu) moreMenu.open = false; };
const importBtn = canImport(ctx) ? K.button('Nhập khách từ Excel/CSV', () => { _on(); openImport(ctx, K); }, { kind: 'ghost', icon: 'plus', testid: 'import-customers' }) : null;
const connectBtn = canConnect(ctx) && _o20(ctx) ? K.button('Nối landing có sẵn', async () => { _on(); const me = await K.me(); openConnect(ctx, K, { org: me.name }); }, { kind: 'ghost', icon: 'plug', testid: 'connect-landing' }) : null;
const exportBtn = P.export ? K.button('Xuất CSV', () => { _on(); _o15(); }, { kind: 'ghost', icon: 'download', testid: 'export-customers', title: 'Xuất danh sách đang lọc ra tệp CSV' }) : null;
const _o3c = K.button('Thùng rác', () => { _on(); TR.openTrash(K, ctx); }, { kind: 'ghost', icon: 'x', testid: 'cust-trash-open', title: 'Khách đã xoá trong ' + TR.TRASH_DAYS + ' ngày – khôi phục được' });
const consentBtn = CU.consentTools(ctx, { shown: () => st.shown, filterUnclear: () => { _on(); st.consent = 'unclear'; consentSel.value = 'unclear'; _o2s(); } });
const moreMenu = h('details', { class: 'cu-more', 'data-testid': 'cust-more' },
h('summary', { class: 'btn btn-ghost', 'aria-label': 'Thêm thao tác', 'data-testid': 'cust-more-toggle' }, K.icon('more', 18), h('span', null, 'Thêm')),
h('div', { class: 'cu-more-menu', role: 'menu', 'data-testid': 'cust-more-menu' }, exportBtn, importBtn, connectBtn, consentBtn, _o3c));
moreMenu.addEventListener('toggle', () => {
const _o1u = moreMenu.lastElementChild; if (!moreMenu.open || !_o1u) return;
_o1u.classList.remove('cu-more-left');
if (_o1u.getBoundingClientRect().left < 8) _o1u.classList.add('cu-more-left');
});
{ const off = (e) => { if (!moreMenu.isConnected) { document.removeEventListener('click', off, true); return; } if (moreMenu.open && !moreMenu.contains(e.target)) moreMenu.open = false; }; document.addEventListener('click', off, true); }
async function _oc() {
const ids = [...st.picked];
if (!ids.length) { K.toast('Chọn ít nhất một khách', 'warn'); return; }
const _o3e = await ctx.users.pick({ title: 'Chia ' + ids.length + ' khách cho…' });
if (!_o3e) return;
try { await ctx.users.assign(ids, _o3e.id); } catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa chia được khách', 'danger'); return; }
K.toast('Đã chia ' + ids.length + ' khách cho ' + (_o3e.full_name || _o3e.username), 'success');
st.selecting = false; st.picked.clear(); _o2s();
}
async function _o2m() {
const ids = [...st.picked];
if (!ids.length) { K.toast('Chọn ít nhất một khách', 'warn'); return; }
const D = await _o1q(), picked = D.customers.filter(c => ids.includes(c.id));
const _o23 = picked.filter(c => !c.source);
if (_o23.length) { K.toast('Khách "' + (_o23[0].name || '') + '" chưa có Nguồn – sửa khách, chọn Nguồn rồi đẩy lại', 'warn'); return; }
if (picked.some(c => LP.isCompanyLead(c))) { K.toast('Có số công ty cấp trong danh sách chọn – đẩy lại số đó ở Kho lead', 'warn'); return; }
let _o1g;
try { _o1g = await K.api('pool.info'); } catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa mở được Kho lead', 'danger'); return; }
const teams = (_o1g.teams || []).filter(t => t.leader), ps = (_o1g.people || []).filter(p => p.role !== 'owner');
const _o16 = { kind: teams.length ? 'team' : 'person', team: teams[0] ? teams[0].id : '', to: ps[0] ? ps[0].id : '' };
const box = h('div'), err = h('div', { class: 'bds-error', role: 'alert' });
const _o2c = () => box.replaceChildren(
h('p', null, 'Đẩy ' + ids.length + ' khách cho:'),
h('div', { class: 'lp-chips' },
teams.length ? h('button', { type: 'button', class: 'lp-chip', 'aria-pressed': String(_o16.kind === 'team'), 'data-testid': 'po-kind-team', onclick: () => { _o16.kind = 'team'; _o2c(); } }, '👥 Nhóm (qua trưởng nhóm)') : null,
h('button', { type: 'button', class: 'lp-chip', 'aria-pressed': String(_o16.kind === 'person'), 'data-testid': 'po-kind-person', onclick: () => { _o16.kind = 'person'; _o2c(); } }, '👤 Một nhân viên')),
_o16.kind === 'team' ? K.field('Nhóm', K.select(teams.map(t => [t.id, t.name + ' – ' + (t.leader_name || 'trưởng nhóm')]), _o16.team, { 'data-testid': 'po-team', onchange: e => { _o16.team = e.target.value; } }))
: K.field('Nhân viên', K.select(ps.map(p => [p.id, p.name + ' – đang giữ ' + p.open + ' số']), _o16.to, { 'data-testid': 'po-person', onchange: e => { _o16.to = e.target.value; } })),
h('p', { class: 'bds-muted' }, 'Nguồn và chi tiết nguồn của khách đi theo số. Khách rời danh sách của anh/chị, người nhận thấy ghi chú.'), err);
_o2c();
const _o1u = K.modal({ title: 'Đẩy số', testid: 'push-own-modal', body: [box, h('div', { class: 'bds-row bds-end' },
K.button('Huỷ', () => _o1u.close(), { icon: 'x' }),
K.button('Đẩy số', async () => {
const _o2h = { ids };
if (_o16.kind === 'team') { if (!_o16.team) { err.textContent = 'Chọn nhóm.'; return; } _o2h.team = _o16.team; _o2h.mode = 'leader'; } else { if (!_o16.to) { err.textContent = 'Chọn nhân viên.'; return; } _o2h.to = _o16.to; }
let r;
try { r = await K.api('pool.from_mine', _o2h); } catch (e) { err.textContent = (e && (e.userMessage || e.message)) || 'Chưa đẩy được.'; return; }
_o1u.close();
K.toast('Đã đẩy ' + r.moved + ' khách ' + LP.toWhom(r.to || []) + (r.dup ? ' · ' + r.dup + ' số đã có trong Kho lead (giữ lại)' : ''), 'success');
try { if (ctx.store && typeof ctx.store.syncNow === 'function') await ctx.store.syncNow(); } catch { }
st.selecting = false; st.picked.clear(); data = null; _o2s();
}, { kind: 'primary', icon: 'send', testid: 'push-own-confirm' }))] });
}
function _o15() {
const head = ['Tên', 'Điện thoại', 'Zalo', 'Trạng thái', 'Nhu cầu', 'Dự án', 'Loại căn', 'Vốn', 'Nguồn', 'Chi tiết nguồn', 'Phụ trách', 'Ngày tạo', 'Mức quan tâm', 'Tính cách'];
const _o1n = [head, ...st.shown.map(c => [c.name, c.phone, c.zalo, c.status, c.need, K.projectName(c.project), c.unit_type, c.budget || '', sourceLabel(c.source), SR.detailOf(c), ownerLabel(ctx, c.owner, st.dir), c.created_at ? K.date(c.created_at) : '',
crm.heatOf(c, { tiers: st.tiers }).label, crm.discOf(c) ? crm.discShort(crm.discOf(c)) : ''])];
const _oe = new Blob(['\ufeff' + _o1n.map(r => r.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' });
const _o7 = h('a', { href: URL.createObjectURL(_oe), download: 'khach-hang-' + new Date().toISOString().slice(0, 10) + '.csv' });
document.body.appendChild(_o7); _o7.click(); _o7.remove(); setTimeout(() => URL.revokeObjectURL(_o7.href), 4000);
K.toast('Đã xuất ' + st.shown.length + ' khách', 'success');
}
try {
const _o1z = new MutationObserver(() => {
if (!el.isConnected) { _o1z.disconnect(); return; }
const d = document.body.dataset.density === 'detail' ? 'detail' : 'compact';
if (d !== st.density) { st.density = d; _o2s(); }
});
_o1z.observe(document.body, { attributes: true, attributeFilter: ['data-density'] });
} catch { }
const sourcesBtn = K.button('Nguồn khách', () => _o28(ctx), { kind: 'ghost', icon: 'pulse', testid: 'source-report', title: 'Nguồn nào ra khách: khách mới, Nóng, hẹn xem, chốt theo nguồn – tuần/tháng' });
const _ov = ctx.user && ctx.user.role;
const deskBtn = _ov && _ov !== 'owner' && _ov !== 'manager' ? null : K.button('Dán tin khách', () => K.nav('#/home/inbox?desk=1'), { kind: 'ghost', icon: 'inbox', testid: 'open-desk', title: 'Dán tin Zalo/Messenger/bình luận – app nhận tên, SĐT, dự án để tạo khách' });
const partnersBtn = K.button('🤝 Mở Sổ đối tác', () => _o27(K, ctx), { kind: 'ghost', testid: 'open-partners', title: 'Đối tác và CTV lưu ở Sổ đối tác' });
const lpBanner = h('div', { class: 'lp-banner', 'data-testid': 'lp-due-banner', hidden: true });
const _o1b = h('div', { class: 'bds-row' }, moreMenu, K.button('+ Thêm khách', () => openForm(ctx, null), { kind: 'primary', testid: 'add-customer' }));
const _ot = h('div', { class: 'cu-pane bds-screen', 'data-testid': 'customers-pane' },
h('div', { class: 'bds-row bds-tools' }, sourcesBtn, selectBtn, deleteModeBtn, deskBtn, partnersBtn, sheetButton(ctx, K)),
bar, lpBanner, selBar, _o1p);
const _o2i = _o1l(ctx);
el.appendChild(h('div', { class: 'bds-screen' },
h('div', { class: 'bds-head' },
h('h2', null, 'Khách hàng ', _oq),
_o1b),
_o2i ? h('div', { class: 'cu-pool-row' }, _o2i) : null,
_ot));
_o2b(ctx).then(d => { st.dir = d; if (d.length) _o2s(); });
let data = null, renderSeq = 0;
async function _o1q() {
if (!data) data = Promise.all([K.list('objects'), K.list('reminders'), K.list('events')]).then(([customers, reminders, events]) => ({ customers, reminders, events, due: null, last: null }));
return data;
}
async function _o2s() {
const _o30 = ++renderSeq;
const D = await _o1q();
if (_o30 !== renderSeq) return;
const { customers, reminders, events } = D;
bigList = customers.length >= 3000;
const _o1a = new Set([...statusSel.options].map(o => o.value));
for (const c of crm.activeCustomers(customers)) if (c.status && !_o1a.has(c.status)) { _o1a.add(c.status); statusSel.appendChild(h('option', { value: c.status }, c.status)); }
const _o1y = crm.activeCustomers(customers).filter(c => LP.poolInfo(c));
const _o21 = _o1y.filter(c => LP.needsCall(c)).length, nRep = _o1y.filter(c => !LP.needsCall(c) && LP.needsReport(c)).length;
if (st.lp === 'call' && !_o21) st.lp = ''; if (st.lp === 'rep' && !nRep) st.lp = '';
const _o1t = (k, label, n) => n ? K.button(label + ' (' + n + ')', () => { st.lp = st.lp === k ? '' : k; _o2s(); }, { kind: st.lp === k ? 'primary' : 'ghost', small: true, icon: k === 'call' ? 'phone' : 'pulse', testid: 'lp-due-' + k }) : null;
lpBanner.hidden = !(_o21 || nRep);
lpBanner.replaceChildren(...[_o1t('call', 'Chờ gọi', _o21), _o1t('rep', 'Cần báo cáo', nRep)].filter(Boolean));
_o11();
let rows = crm.filterCustomers(customers, st);
if (st.lp === 'call') rows = rows.filter(c => LP.needsCall(c)); else if (st.lp === 'rep') rows = rows.filter(c => !LP.needsCall(c) && LP.needsReport(c));
if (st.scope === 'mine' && P.customers_scope === 'all' && team(ctx)) rows = rows.filter(c => isMine(ctx, c));
rows = crm.sortCustomers(rows, st.sort, { reminders });
st.shown = rows;
selBar.hidden = !st.selecting;
selBar.querySelector('.cu-sel-assign').hidden = st.selMode === 'delete' || !_og;
selBar.querySelector('[data-testid="delete-selected"]').hidden = st.selMode !== 'delete';
deleteModeBtn.classList.toggle('bds-on', st.selecting && st.selMode === 'delete');
_o2z.textContent = String(st.picked.size);
if (selectBtn) selectBtn.classList.toggle('bds-on', st.selecting && st.selMode !== 'delete');
_oq.textContent = '(' + rows.length + ')';
_o1p.innerHTML = '';
_o1p.dataset.density = st.density;
if (!rows.length) {
_o1p.appendChild(K.empty(crm.activeCustomers(customers).length ? 'Không có khách khớp bộ lọc.' : 'Chưa có khách. Bấm "+ Thêm khách" hoặc nhập khách từ landing ở Bảng tin.'));
return;
}
const due = D.due || (D.due = crm.nextDueByCustomer(reminders));
const _o17 = document.createDocumentFragment();
const _o38 = team(ctx) && P.customers_scope !== 'own' && P.customers_scope !== 'created';
const _o1k = D.last || (D.last = crm.lastContactMap(events));
for (const c of rows.slice(0, 500)) {
const r = _o2t(K, c, st.density, { due: due.get(c.id), last: _o1k.get(c.id), owner: _o38 ? (ownerLabel(ctx, c.owner, st.dir) || (c.owner ? '' : 'Chưa chia')) : '', tiers: st.tiers });
if (st.selecting) {
const _oi = h('input', { type: 'checkbox', class: 'bds-pick', 'aria-label': 'Chọn ' + (c.name || ''), 'data-testid': 'pick-' + c.id, checked: st.picked.has(c.id),
onchange: e => { if (e.target.checked) st.picked.add(c.id); else st.picked.delete(c.id); _o2z.textContent = String(st.picked.size); } });
r.classList.add('bds-selecting');
r.insertBefore(h('label', { class: 'bds-pick-wrap' }, _oi), r.firstChild);
}
_o17.appendChild(r);
}
_o1p.appendChild(_o17);
}
await _o2s();
K.on(el, ['objects', 'reminders', 'events'], () => { data = null; _o2s(); });
K.on(el, ['settings'], async () => { const t = await _o1r(K); if (t.hot !== st.tiers.hot || t.warm !== st.tiers.warm) { st.tiers = t; _o2s(); } });
if (inSelftest(el)) return;
if (_o2o.get('open')) openProfile(ctx, _o2o.get('open'), { host: el });
if (_o2o.get('new') === '1') openForm(ctx, null);
if (_o2o.get('sources') === '1') _o28(ctx);
}
function _o11() { LP.ensureLpCss(); }
async function _o28(ctx) { const _o1u = await import('./source_report.js'); return _o1u.openSourceReport(ctx); }
function _oh(s) { return s ? s[0].toUpperCase() + s.slice(1) : ''; }
function _o3a(c) { const d = SR.detailOf(c); return (sourceLabel(c.source) || '—') + (d ? ' – ' + d : ''); }
function _o2t(K, c, density, { due, last, owner, tiers }) {
const open = () => openProfile(K.ctx, c.id);
const main = h('button', { type: 'button', class: 'bds-row-main', onclick: open, 'data-testid': 'open-' + c.id },
h('strong', { class: 'bds-name' }, c.name || '(chưa có tên)'),
h('span', { class: 'bds-sub' }, [K.projectName(c.project), c.unit_type].filter(Boolean).join(' · ') || K.phone(c.phone)),
owner ? h('span', { class: 'bds-owner', 'data-testid': 'owner-' + c.id }, 'Phụ trách: ' + owner) : null);
const _oo = LP.isCompanyLead(c);
const _o2a = h('div', { class: 'bds-item', 'data-id': c.id, 'data-company': _oo ? '1' : null, 'data-heat': crm.heatOf(c, { tiers }).id },
main,
_oo ? h('span', { class: 'bds-row' }, LP.companyBadge(c), K.badge(c.status || 'Mới', crm.statusTone(c.status)), LP.levelBadge(LP.levelOf(c)), _oy(c, () => pickDisc(K.ctx, c), { long: density === 'detail' }))
: h('div', { class: 'cu-meta' },
_o1d(c, tiers, () => pickHeat(K.ctx, c, { tiers })),
K.badge(c.status || 'Mới', crm.statusTone(c.status)),
_oy(c, () => pickDisc(K.ctx, c), { long: density === 'detail' })),
h('div', { class: 'bds-acts' }, _oo && LP.poolInfo(c) ? LP.statusButton(K, K.ctx, c, null, { short: !LP.needsCall(c) && !LP.needsReport(c), small: true }) : null, K.callBtn(c, { short: true }), K.zaloBtn(c, { short: true }),
TR.canDelete(K.ctx, c) ? _o2u(K, c) : null));
if (density === 'detail') {
const _ow = h('div', { class: 'bds-item-detail' },
c.budget ? h('span', null, 'Vốn: ' + K.money(c.budget)) : null,
h('span', null, 'Liên hệ cuối: ' + (last ? K.date(last) : 'chưa có')),
due ? h('span', { class: due < crm.dayRange(Date.now())[0] ? 'bds-danger' : '' }, 'Hẹn: ' + K.date(due)) : null,
c.source ? h('span', null, 'Nguồn: ' + _o3a(c)) : null,
c.note ? h('span', { class: 'bds-note' }, String(c.note).slice(0, 90)) : null);
_o2a.appendChild(_ow);
}
return _o2a;
}
function _o2u(K, c) {
return h('button', { type: 'button', class: 'btn btn-ghost btn-sm cu-row-more', 'aria-label': 'Thao tác khác: ' + (c.name || ''), 'data-testid': 'row-more-' + c.id, onclick: (e) => {
e.stopPropagation();
const _o1u = K.modal({ title: c.name || 'Khách', testid: 'row-more-sheet', body: [h('div', { class: 'bds-row bds-wrap' },
K.button('Mở hồ sơ', () => { _o1u.close(); openProfile(K.ctx, c.id); }, { kind: 'ghost', icon: 'next', testid: 'row-open' }),
K.button('Xoá khách', async () => { _o1u.close(); await TR.deleteCustomers(K, K.ctx, [c]); }, { kind: 'danger', icon: 'x', testid: 'row-delete' }))] });
} }, K.icon('more', 18));
}
export async function openForm(ctx, existing, _o29 = {}) {
const K = kit(ctx);
_o10();
await K.loadProjects();
const c = existing || { ...(_o29.prefill && typeof _o29.prefill === 'object' ? _o29.prefill : {}), id: undefined, consent: 0 };
const tiers = await _o1r(K);
const heat0 = crm.HEAT_IDS.includes(crm.parseData(c.data).heat) ? crm.parseData(c.data).heat : '';
const disc0 = (crm.discOf(c) || {}).id || '';
const _o19 = CS.readLog(c).length > 0;
const _o1m = !_o19 && !!existing && Number(c.consent) === 1;
const _ob = !_o19 && !_o1m;
const _o24 = _ob ? CS.noticeConfig(await K.setting(CS.NOTICE_KEY, null)) : null;
const _o1h = (name, attrs = {}) => h('input', { name, value: c[name] ?? '', ...attrs });
const _o16 = {
name: _o1h('name', { required: true, autocomplete: 'off', autocapitalize: 'words', enterkeyhint: 'next', 'data-testid': 'f-name' }),
phone: _o1h('phone', { type: 'tel', inputmode: 'tel', autocomplete: 'off', enterkeyhint: 'next', required: true, 'data-testid': 'f-phone' }),
zalo: _o1h('zalo', { type: 'tel', inputmode: 'tel', autocomplete: 'off', placeholder: 'Để trống nếu trùng số điện thoại' }),
need: K.select(crm.NEEDS.map(n => [n, _oh(n)]), c.need || 'mua', { name: 'need' }),
project: K.select([['', '— Chọn dự án —'], ...K.projects().map(p => [p.id, p.name])], c.project || '', { name: 'project', 'data-testid': 'f-project' }),
unit_type: _o1h('unit_type', { list: 'bds-unit-types', placeholder: 'VD: 2N, 1N+, Studio' }),
budget: _o1h('budget', { value: c.budget ? K.money(c.budget) : '', placeholder: 'VD: 800tr, 1,2 tỷ', 'data-testid': 'f-budget' }),
source: K.select(_o39(ctx) && !c.source ? [['', '– Chọn nguồn (bắt buộc) –'], ...formSources(c.source, _o1v(ctx))] : formSources(c.source, _o1v(ctx)), c.source || (_o39(ctx) ? '' : 'manual'), { name: 'source', 'data-testid': 'f-source' }),
source_detail: h('input', { name: 'source_detail', value: crm.parseData(c.data).source_detail || '', maxlength: SR.DETAIL_MAX, list: 'bds-source-details', placeholder: 'VD: Video nhà mẫu 2PN, Bài FB 12/11 (tuỳ chọn)', 'data-testid': 'f-source-detail' }),
note: h('textarea', { name: 'note', rows: 3 }, c.note || ''),
birthday: _o1h('birthday', { type: 'date' }),
consent: h('input', { type: 'checkbox', name: 'consent', checked: !!Number(c.consent), 'data-testid': 'f-consent' }),
cChannel: K.select(CS.CHANNELS.map(_o3h => [_o3h.id, _o3h.label]), 'truc_tiep', { 'aria-label': 'Kênh khách đồng ý', 'data-testid': 'f-consent-channel' }),
cAds: h('input', { type: 'checkbox', 'data-testid': 'f-consent-ads' }),
cAi: h('input', { type: 'checkbox', 'data-testid': 'f-consent-ai' }),
cNotice: h('input', { type: 'checkbox', 'data-testid': 'f-consent-notice' }),
heat: K.select([['', 'Tự động (theo hành vi)'], ...crm.HEAT_LEVELS.map(l => [l.id, l.label])], heat0, { name: 'heat', 'data-testid': 'f-heat' }),
disc: K.select([['', 'Chưa rõ'], ...crm.DISC.map(_o3h => [_o3h.id, _o3h.id + ' – ' + _o3h.label + ' (' + _o3h.name + ')'])], disc0, { name: 'disc', 'data-testid': 'f-disc' }),
};
const _o1e = h('small', { class: 'bds-field-h', 'data-testid': 'heat-hint' });
const _oz = h('small', { class: 'bds-field-h', 'data-testid': 'disc-hint' });
const _o37 = () => {
const _o2j = _o16.heat.value ? { data: { heat: _o16.heat.value } } : heat0 ? { ...c, ...crm.heatPatch(c, null) } : c;
const _o3h = crm.heatOf(_o2j, { tiers });
_o1e.textContent = _o16.heat.value ? (crm.HEAT_LEVELS.find(l => l.id === _o3h.id) || {}).hint || '' : 'Hiện app tính: ' + crm.heatTitle(_o3h).replace(/^Mức quan tâm: /, '');
};
const _o36 = () => { const _o3h = crm.DISC.find(d => d.id === _o16.disc.value); _oz.textContent = _o3h ? '💡 ' + _o3h.tip : 'Chọn khi đã trao đổi đủ để nhận ra cách khách thích được tư vấn.'; };
_o16.heat.addEventListener('change', _o37);
_o16.disc.addEventListener('change', _o36);
_o37(); _o36();
const types = new Set(['Studio', '1N', '1N+', '2N', '2N+', '3N', '4N', 'Duplex', 'Penthouse']);
K.projects().forEach(p => (p.types || []).forEach(t => t.n && types.add(t.n)));
const dl = h('datalist', { id: 'bds-unit-types' }, [...types].map(t => h('option', { value: t })));
const _of = h('small', { class: 'bds-field-h' });
const phoneHint = h('small', { class: 'bds-field-h', 'data-testid': 'phone-hint' });
const err = h('div', { class: 'bds-error', role: 'alert', 'data-testid': 'form-error' });
const _o35 = () => {
const v = crm.parseMoney(_o16.budget.value);
_of.textContent = _o16.budget.value ? (v ? '= ' + K.money(v) : 'Chưa hiểu số tiền, ví dụ: 800tr, 1,2 tỷ') : '';
};
['input', 'change', 'blur'].forEach(ev => _o16.budget.addEventListener(ev, _o35));
let _oa = await K.list('objects');
const _o2q = SR.recentDetails(_oa, { extra: K.projects().map(p => p.name).filter(Boolean).slice(0, 4) });
const sdl = h('datalist', { id: 'bds-source-details' }, _o2q.map(v => h('option', { value: v })));
const chips = _o2q.length ? h('div', { class: 'cu-sd-chips', 'data-testid': 'sd-chips' }, _o2q.slice(0, 6).map(v =>
h('button', { type: 'button', class: 'cu-sd-chip', 'data-testid': 'sd-chip', onclick: () => { _o16.source_detail.value = v; } }, v))) : null;
const _ol = () => {
const p = crm.normPhone(_o16.phone.value);
phoneHint.textContent = '';
phoneHint.innerHTML = '';
if (!_o16.phone.value) return null;
if (!crm.validPhone(p)) { phoneHint.textContent = 'Số điện thoại chưa đúng (10 số, bắt đầu bằng 0).'; return 'invalid'; }
const dup = crm.findDuplicatePhone(_oa, p, c.id);
if (dup) {
phoneHint.appendChild(h('span', { class: 'bds-danger' }, 'Số này đã có trong hồ sơ "' + (dup.name || '') + '". '));
phoneHint.appendChild(h('a', { href: '#', onclick: e => { e.preventDefault(); _o34.close(); K.afterClose(() => openProfile(ctx, dup.id)); } }, 'Mở hồ sơ đó'));
return 'dup';
}
phoneHint.textContent = K.phone(p);
return null;
};
_o16.phone.addEventListener('blur', _ol);
const pasteHint = h('small', { class: 'bds-field-h', 'data-testid': 'paste-hint' }, existing ? '' : 'Mẹo: dán nguyên tin khách nhắn Zalo vào ô này – app tự tách tên, số điện thoại, vốn.');
if (!existing) _o16.name.addEventListener('paste', (e) => {
const _o3d = (e.clipboardData && e.clipboardData.getData('text')) || '';
const _o3h = crm.parseLeadText(_o3d);
if (!_o3h) return;
e.preventDefault();
_o16.name.value = _o3h.name;
if (!_o16.phone.value.trim()) _o16.phone.value = _o3h.phone;
if (_o3h.budget && !_o16.budget.value.trim()) { _o16.budget.value = K.money(_o3h.budget); _o35(); }
if (_o3h.unit_type && !_o16.unit_type.value.trim()) _o16.unit_type.value = _o3h.unit_type;
if (!_o16.note.value.trim()) _o16.note.value = _o3h.note;
_ol();
pasteHint.textContent = '✅ Đã tách từ tin dán: ' + [_o3h.name && 'tên', 'số điện thoại', _o3h.budget && 'vốn', _o3h.unit_type && 'loại căn'].filter(Boolean).join(', ') + ' – nguyên văn tin ở Ghi chú. Kiểm lại trước khi lưu.';
if (!_o3h.name) _o16.name.focus();
});
const _o2v = async () => {
err.textContent = '';
const name = _o16.name.value.trim();
if (!name) { err.textContent = 'Nhập tên khách.'; _o16.name.focus(); return; }
if (_o39(ctx) && !_o16.source.value) { err.textContent = 'Chọn Nguồn khách (vd Bài Facebook, Video TikTok) – số đẩy đi giữ nguồn để tính chi phí quảng cáo.'; _o16.source.focus(); return; }
_oa = await K.list('objects');
const _o2e = _ol();
if (!_o16.phone.value.trim()) { err.textContent = 'Nhập số điện thoại.'; _o16.phone.focus(); return; }
if (_o2e === 'invalid') { err.textContent = 'Số điện thoại chưa đúng (10 số, bắt đầu bằng 0).'; _o16.phone.focus(); return; }
if (_o2e === 'dup') { err.textContent = 'Số điện thoại đã có trong danh sách khách.'; return; }
if (_o16.zalo.value.trim() && !crm.validPhone(_o16.zalo.value)) { err.textContent = 'Số Zalo chưa đúng (10 số, bắt đầu bằng 0) – để trống nếu trùng số điện thoại.'; return; }
let budget = 0;
if (_o16.budget.value.trim()) {
budget = crm.parseMoney(_o16.budget.value);
if (!budget) { err.textContent = 'Chưa hiểu số vốn. Ví dụ: 800tr, 1,2 tỷ.'; return; }
}
if (!_o19 && !_o16.consent.checked) { err.textContent = 'Cần khách đồng ý cho lưu thông tin – theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15.'; return; }
const t = Date.now();
const _o1c = _o16.heat.value !== heat0;
const _o1f = _o1c ? crm.heatPatch(c, _o16.heat.value || null, t) : null;
let data = SR.detailPatch({ data: crm.discPatch({ data: _o1f ? _o1f.data : (c.data || '{}') }, _o16.disc.value) }, _o16.source_detail.value);
let _op = _o19 ? Number(c.consent) || 0 : 1;
let entry = null;
if (_ob) {
const me = ctx.user || {};
const r = CS.makeEntry({ act: 'grant', scopes: ['luu', 'cham_soc', ...(_o16.cAds.checked ? ['quang_cao'] : []), ...(_o16.cAi.checked ? ['ai'] : [])], channel: _o16.cChannel.value,
by: me.id || '', by_name: me.full_name || me.username || (await K.me()).name || 'Chủ app', notice_version: _o16.cNotice.checked ? _o24.version : '' }, { now: t });
if (!r.ok) { err.textContent = r.error; return; }
entry = r.entry;
const _o3f = CS.withEntry({ data }, entry);
data = _o3f.data; _op = _o3f.consent;
}
const _o2t = {
...c, kind: 'customer', name, phone: crm.normPhone(_o16.phone.value), zalo: _o16.zalo.value.trim() ? crm.normPhone(_o16.zalo.value) : '',
need: _o16.need.value, project: _o16.project.value, unit_type: _o16.unit_type.value.trim(), budget, source: _o16.source.value,
note: _o16.note.value.trim(), birthday: _o16.birthday.value, consent: _op,
status: c.status || 'Mới', created_at: c.created_at || t, data, deleted: 0,
...(_o1f ? { tags: _o1f.tags } : {}),
};
if (!_o2t.id) _o2t.id = K.newId();
const me = ctx.user;
if (me && me.id && !existing) { _o2t.owner = _o2t.owner || me.id; _o2t.created_by = _o2t.created_by || me.id; }
const _o2y = await K.put('objects', _o2t);
if (existing && _o1c) {
const _o7 = crm.heatOf(c, { tiers }), b = crm.heatOf(_o2y, { tiers });
if (_o7.id !== b.id || _o7.source !== b.source) await K.logEvent(_o2y.id, 'heat', 'Mức quan tâm: ' + _o7.label + ' → ' + b.label + (b.source === 'manual' ? '' : ' (app tự tính)'), { from: _o7.id, to: b.id, manual: b.source === 'manual' ? 1 : 0 });
}
if (!existing) {
await K.logEvent(_o2y.id, 'note', 'Tạo hồ sơ khách (đã có đồng ý lưu thông tin' + (entry ? ' – ' + CS.channelLabel(entry.channel) : '') + ')', { consent_at: t });
K.toast('Đã thêm khách ' + name, 'success');
} else {
if (entry) await K.logEvent(_o2y.id, 'note', 'Ghi nhận đồng ý: ' + entry.scopes.map(CS.scopeLabel).join(', ').toLowerCase() + ' (' + CS.channelLabel(entry.channel) + ')', { consent: 'grant', scopes: entry.scopes });
K.toast('Đã lưu thông tin khách', 'success');
}
_o34.close();
if (_o29.onSaved) _o29.onSaved(_o2y); else if (!existing) K.afterClose(() => openProfile(ctx, _o2y.id));
};
const _o34 = (existing ? K.modal : K.sheet)({
wide: true,
title: existing ? 'Sửa thông tin khách' : 'Thêm khách',
testid: 'customer-form',
body: h('form', { class: 'bds-form', onsubmit: e => { e.preventDefault(); _o2v(); } },
dl,
existing ? null : companyDataNote(ctx, { testid: 'customer-company-note' }),
K.field('Tên khách *', _o16.name), pasteHint,
K.field('Điện thoại *', _o16.phone, null), phoneHint,
K.field('Zalo', _o16.zalo),
h('div', { class: 'bds-grid2' }, K.field('Nhu cầu', _o16.need), K.field('Nguồn', _o16.source)),
sdl, K.field('Chi tiết nguồn', _o16.source_detail, 'Tên video, bài đăng, chiến dịch hoặc dự án – để biết cái nào ra khách thật.'), chips,
K.field('Dự án quan tâm', _o16.project),
h('div', { class: 'bds-grid2' }, K.field('Loại căn', _o16.unit_type), h('div', null, K.field('Vốn', _o16.budget), _of)),
h('div', { class: 'bds-grid2' }, h('div', null, K.field('Mức quan tâm', _o16.heat), _o1e), h('div', null, K.field('Tính cách (D-I-S-C)', _o16.disc), _oz)),
K.field('Ngày sinh', _o16.birthday),
K.field('Ghi chú', _o16.note),
_o19 ? h('p', { class: 'bds-muted', 'data-testid': 'f-consent-logged' }, '🛡️ ' + CS.statusText(c).text + ' – đổi ở "Nhật ký đồng ý" trong hồ sơ khách.')
: h('label', { class: 'bds-check' }, _o16.consent, h('span', null, 'Khách đã đồng ý rõ ràng cho lưu và dùng thông tin để liên hệ tư vấn bất động sản (bắt buộc – theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15).')),
_ob ? h('div', { class: 'cu-consent-form', 'data-testid': 'f-consent-extra' },
K.field('Kênh khách đồng ý', _o16.cChannel),
h('label', { class: 'bds-check' }, _o16.cAds, h('span', null, 'Khách đồng ý nhận tin quảng cáo (ưu đãi, dự án mới)')),
h('label', { class: 'bds-check' }, _o16.cAi, h('span', null, 'Khách đồng ý để AI xử lý thông tin (rút gọn, không số điện thoại)')),
h('label', { class: 'bds-check' }, _o16.cNotice, h('span', null, 'Đã đọc/gửi thông báo mẫu bản ' + _o24.version + ' ', h('a', { href: '#', onclick: e => { e.preventDefault(); CU.openNotice(ctx); } }, '(xem)')))) : null,
err,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _o34.close(), { icon: 'close' }), K.button('Lưu khách', null, { kind: 'primary', type: 'submit', icon: 'check', testid: 'f-save' }))),
});
if (_of && c.budget) _of.textContent = '= ' + K.money(c.budget);
setTimeout(() => { try { const _o7 = document.activeElement; if (!_o7 || !/^(INPUT|TEXTAREA|SELECT)$/.test(_o7.tagName)) _o16.name.focus(); } catch { } }, 50);
return _o34;
}
export async function openProfile(ctx, id, _o29 = {}) {
const K = kit(ctx);
_o10();
await K.loadProjects();
const tiers = await _o1r(K);
let c = await K.get('objects', id);
if (_o29.host && !_o29.host.isConnected) return null;
if (!c || Number(c.deleted)) { K.toast('Không tìm thấy hồ sơ khách', 'warn'); return null; }
const body = h('div', { class: 'bds-profile', 'data-testid': 'profile' });
const _o34 = K.sheet({ title: c.name || 'Hồ sơ khách', body, testid: 'profile-sheet' });
const P = _o2f(ctx);
const dir = await _o2b(ctx);
async function _o2p() {
const _o3e = await ctx.users.pick({ title: 'Chia "' + (c.name || 'khách') + '" cho…', current: c.owner });
if (!_o3e) return;
try { await ctx.users.assign([c.id], _o3e.id); } catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa chia được khách', 'danger'); return; }
K.toast('Đã chia cho ' + (_o3e.full_name || _o3e.username), 'success');
_o2s();
}
async function _o2s() {
c = await K.get('objects', id);
if (!c || Number(c.deleted)) { _o34.close(); return; }
const [events, reminders, objs] = await Promise.all([K.list('events'), K.list('reminders'), K.list('objects')]);
const _or = G4.findCtvFor(objs, c);
const _o14 = crm.eventsOf(events, id);
const _o2r = reminders.filter(r => r.object_id === id && !Number(r.done)).sort((_o7, b) => _o7.due_at - b.due_at);
body.innerHTML = '';
const statuses = K.statuses(c.need);
const _o29 = statuses.includes(c.status) || !c.status ? statuses : [c.status, ...statuses];
const _o2g = LP.poolInfo(c);
const stSel = _o2g ? LP.statusButton(K, ctx, c, () => _o2s()) : K.select(_o29, c.status || statuses[0], { 'aria-label': 'Trạng thái', 'data-testid': 'status-select', onchange: e => _ok(e.target.value) });
const _o1g = [
['Điện thoại', c.phone ? K.phone(c.phone) : '—'],
c.zalo && c.zalo !== c.phone ? ['Zalo', K.phone(c.zalo)] : null,
['Nhu cầu', _oh(c.need || 'mua')],
['Dự án', K.projectName(c.project) || '—'],
['Loại căn', c.unit_type || '—'],
['Vốn', c.budget ? K.money(c.budget) : '—'],
['Nguồn', _o2g ? h('span', { class: 'bds-row' }, LP.companyBadge(c), LP.levelBadge(LP.levelOf(c))) : h('span', { 'data-testid': 'profile-source' }, _o3a(c))],
_o2g ? ['Người cấp', (_o2g.by_name || 'Công ty') + ' · ' + (_o2g.at ? K.date(_o2g.at) + ' ' + crm.hm(_o2g.at) : '')] : null,
_o2g && _o2g.campaign ? ['Chiến dịch', _o2g.campaign + (LP.CHANNELS[_o2g.channel] ? ' (' + LP.CHANNELS[_o2g.channel] + ')' : '')] : null,
c.birthday ? ['Ngày sinh', K.date(c.birthday)] : null,
team(ctx) ? ['Phụ trách', h('span', { class: 'bds-row', 'data-testid': 'profile-owner' },
h('span', null, ownerLabel(ctx, c.owner, dir) || (c.owner ? 'Người khác' : 'Chưa chia')),
P.assign && ctx.users ? K.button('Đổi', () => _o2p(), { kind: 'ghost', icon: 'refresh', testid: 'profile-assign' }) : null)] : null,
].filter(Boolean);
const disc = crm.discOf(c);
const consentOk = crm.canProfile(c);
const _ox = K.button('🧭 Tính cách: ' + crm.discShort(disc), () => pickDisc(ctx, c, { onDone: _o2s }), {
testid: 'profile-disc', title: consentOk ? 'Chọn nhóm tính cách D-I-S-C để có gợi ý cách tư vấn' : 'Khách chưa đồng ý lưu thông tin – chưa ghi nhận xét tính cách' });
if (!consentOk) _ox.disabled = true;
const _oj = CS.gate(c, 'contact');
body.appendChild(h('div', { class: 'bds-pf-top' },
h('div', { class: 'bds-row' }, _o2g ? K.badge(c.status || 'Mới', crm.statusTone(c.status)) : null, stSel,
_o2g ? null : _o1d(c, tiers, () => pickHeat(ctx, c, { tiers, onDone: _o2s }), 'profile-heat'), _ox),
disc ? h('p', { class: 'cu-tip', 'data-testid': 'disc-tip' }, h('strong', null, 'Cách tư vấn hợp nhóm ' + disc.id + ' (' + disc.label + '): '), disc.tip) : null,
h('dl', { class: 'bds-dl' }, _o1g.map(([k, v]) => [h('dt', null, k), h('dd', null, v)])),
c.note ? h('p', { class: 'bds-note' }, c.note) : null));
body.appendChild(CU.consentBox(ctx, c, { onChange: _o2s }));
const _o8 = h('div', { class: 'bds-acts bds-wrap' },
K.callBtn(c), K.zaloBtn(c),
_oj.ok ? K.button('✉️ Soạn tin Zalo', async () => { const _o3i = await import('../zalo/index.js'); _o3i.openComposer(ctx, c); }, { testid: 'compose-zalo' }) : null,
K.button('🧾 Tạo báo giá', () => { _o34.close(); K.nav('#/sales/quote?customer=' + encodeURIComponent(c.id)); }, { testid: 'make-quote' }),
K.button('📅 Hẹn lịch', () => _o1x(), { testid: 'add-meeting' }),
crm.isPostSale(c) ? K.button('💳 Lập lịch đóng tiền', async () => { const _o1u = await import('../care/index.js'); _o1u.openPaymentPlanner(ctx, c); }, { kind: 'primary', testid: 'plan-payments' }) : null,
K.button('✏️ Sửa', () => openForm(ctx, c, { onSaved: _o2s }), { testid: 'edit-customer' }),
_or ? K.button('🤝 Đã là CTV – mở hồ sơ', () => { _o34.close(); K.afterClose(() => _o27(K, ctx, '?open=' + encodeURIComponent(_or.id))); }, { testid: 'make-ctv', title: 'Mở hồ sơ CTV ở Sổ đối tác' })
: K.button('🤝 Nâng thành CTV', () => _o1w(), { testid: 'make-ctv', title: 'Tạo CTV trong Sổ đối tác từ khách này – khách vẫn giữ nguyên' }));
body.appendChild(_o8);
const noteIn = h('textarea', { rows: 2, placeholder: 'Ghi chú nhanh sau cuộc gọi, buổi gặp…', 'data-testid': 'quick-note' });
body.appendChild(h('div', { class: 'bds-quick' }, noteIn, K.button('Lưu ghi chú', async () => {
const t = noteIn.value.trim();
if (!t) { K.toast('Nhập nội dung ghi chú trước khi lưu.', 'warn'); noteIn.focus(); return; }
await K.logEvent(id, 'note', t);
noteIn.value = '';
K.toast('Đã lưu ghi chú', 'success');
_o2s();
}, { testid: 'save-note', icon: 'check' })));
if (_o2r.length) {
body.appendChild(h('h4', null, 'Việc sắp tới'));
body.appendChild(h('ul', { class: 'bds-rem', 'data-testid': 'profile-reminders' }, _o2r.slice(0, 8).map(r => h('li', null,
h('span', null, K.date(r.due_at)), ' ', r.title || r.kind, r.amount ? ' – ' + K.money(r.amount) : ''))));
}
body.appendChild(h('h4', null, 'Dòng thời gian'));
body.appendChild(_o14.length
? h('ol', { class: 'bds-timeline', 'data-testid': 'timeline' }, _o14.slice(0, 100).map(e => h('li', { 'data-type': e.type },
h('span', { class: 'bds-ti' }, _o1[e.type] || '•'),
h('div', null, h('small', { class: 'bds-muted' }, K.date(e.at) + ' ' + crm.hm(e.at)), h('div', null, e.text || e.type)))))
: K.empty('Chưa có hoạt động.'));
if (TR.canDelete(ctx, c)) body.appendChild(h('div', { class: 'bds-row' },
K.button('Xoá khách (vào Thùng rác)', async () => { if (await TR.deleteCustomers(K, ctx, [c])) _o34.close(); }, { kind: 'ghost', icon: 'x', testid: 'profile-trash' })));
if (P.erase && _o1i(ctx)) body.appendChild(h('div', { class: 'bds-danger-zone' },
K.button('Xoá theo yêu cầu khách', () => _o13(), { kind: 'danger', icon: 'close', testid: 'erase-request' }),
h('small', { class: 'bds-muted' }, 'Khi khách yêu cầu xoá dữ liệu (Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15): xoá thông tin cá nhân ở Sheet chính và Sổ khách lưu trữ, giữ lại dấu vết kiểm tra.')));
else if (P.erase) body.appendChild(h('div', { class: 'bds-danger-zone' },
K.button('Xoá dữ liệu khách', () => erase(), { kind: 'danger', testid: 'erase-customer' }),
h('small', { class: 'bds-muted' }, 'Theo yêu cầu của khách (quyền xoá dữ liệu – Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15): xoá thông tin cá nhân, giữ lại dấu vết kiểm tra.')));
}
async function _o13() {
const _o3b = crm.normPhone(c.phone).slice(-4) || 'XOA';
const reason = h('input', { 'data-testid': 'erase-reason', maxlength: 200, placeholder: 'vd: khách gọi điện yêu cầu ngày 17/11' });
const code = h('input', { inputmode: 'numeric', 'data-testid': 'erase-code', placeholder: _o3b });
const keepFiles = h('input', { type: 'checkbox', 'data-testid': 'erase-keep-files' });
const ok = await new Promise(res => {
const _o1u = K.modal({ title: 'Xoá theo yêu cầu khách', testid: 'erase-request-modal', body: [
h('p', null, 'Toàn bộ thông tin cá nhân của "' + (c.name || 'khách') + '" (tên, số điện thoại, Zalo, email, ghi chú, ngày sinh, lịch sử liên hệ, nhắc việc, báo giá; tên khách và ảnh uỷ nhiệm chi trong giữ chỗ, tệp trong hồ sơ giao dịch, việc, mã giới thiệu) sẽ bị xoá VĨNH VIỄN khỏi mọi Sheet dữ liệu và khỏi Sổ khách lưu trữ. Không khôi phục được – kể cả khi khôi phục bản sao lưu cũ.'),
h('p', { class: 'bds-muted' }, 'Căn cứ: quyền xoá dữ liệu của chủ thể dữ liệu – Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15. Chỉ làm khi chính khách yêu cầu. Sổ chỉ giữ một dòng "Đã xoá theo yêu cầu chủ thể dữ liệu" kèm ngày và lý do.'),
h('p', { class: 'bds-muted', 'data-testid': 'erase-backup-note' }, 'Bản sao lưu Sheet hằng tuần (thư mục "BDS Studio – Sao lưu" trên Drive) được máy chủ tự xoá dữ liệu khách này trong khoảng 1 giờ. Bản sao lưu mã hoá anh/chị tự tạo bằng nút Sao lưu (tệp "sao-luu-…") thì máy chủ không mở được nên không tự xoá – nếu cần, anh/chị tự xoá các tệp đó.'),
h('p', { class: 'bds-muted', 'data-testid': 'erase-history-note' }, 'Lưu ý: Google Sheets vẫn giữ bản cũ trong Lịch sử phiên bản (Tệp › Lịch sử phiên bản) và Thùng rác Google Drive giữ tệp đã xoá khoảng 30 ngày. Nếu khách yêu cầu xoá cả ở đó: vào Thùng rác Drive bấm "Xoá vĩnh viễn"; với Lịch sử phiên bản, liên hệ hỗ trợ để chuyển dữ liệu sang bản sao Sheet mới (bản sao không mang lịch sử) rồi xoá vĩnh viễn Sheet cũ.'),
h('label', { class: 'bds-row' }, keepFiles, h('span', null, 'Giữ lại tệp hợp đồng/giấy tờ trên Drive (chỉ khi luật khác buộc lưu) – mặc định: bỏ vào Thùng rác')),
K.field('Lý do (không ghi tên, số điện thoại khách)', reason),
h('p', null, 'Nhập 4 số cuối điện thoại của khách (' + _o3b + ') để xác nhận.'), code,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => { _o1u.close(); res(false); }, { icon: 'close' }),
K.button('Xoá vĩnh viễn', () => {
if (reason.value.trim().length < 3) { K.toast('Ghi lý do xoá', 'warn'); return; }
if (code.value.trim().toUpperCase() !== _o3b) { K.toast('Mã xác nhận chưa đúng', 'warn'); return; }
_o1u.close(); res(true);
}, { kind: 'danger', testid: 'erase-request-confirm' }))] });
});
if (!ok) return;
let _o31 = null;
try { _o31 = await K.api('archive.erase', { id, reason: reason.value.trim(), keep_files: !!keepFiles.checked }); } catch (e) { _o31 = null; }
await _o12();
if (_o31 && !_o31.archive_error) K.toast('Đã xoá dữ liệu khách khỏi Sheet chính và Sổ khách lưu trữ', 'success');
else K.toast('Đã xoá dữ liệu khách trên máy. Máy chủ sẽ xoá khỏi Sổ khách lưu trữ ở lần đồng bộ tới.', 'warn');
_o34.close();
}
async function _o1w() {
const fresh = await K.get('objects', id);
if (!fresh) { K.toast('Không tìm thấy hồ sơ khách', 'warn'); return; }
const _o18 = G4.findCtvFor(await K.list('objects'), fresh);
if (_o18) { K.toast((fresh.name || 'Khách') + ' đã là CTV', 'info'); await _o2s(); return; }
try { await K.put('objects', G4.ctvFromCustomer(fresh, ctx.user)); } catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa tạo được CTV', 'danger'); return; }
K.toast('Đã thêm ' + (fresh.name || 'khách') + ' vào Sổ đối tác (CTV)', 'success');
await _o2s();
}
async function _ok(ns) {
const _o26 = c.status || 'Mới';
if (ns === _o26) return;
await K.put('objects', { ...c, status: ns });
await K.logEvent(id, 'status', _o26 + ' → ' + ns, { from: _o26, to: ns });
K.toast('Đã đổi trạng thái: ' + ns, 'success');
await _o2s();
if (crm.isPostSale({ status: ns })) K.toast('Có thể bấm "Lập lịch đóng tiền" để nhắc các đợt thanh toán', 'info');
}
function _o1x() {
const d = new Date(Date.now() + 86400000); d.setHours(9, 0, 0, 0);
const _o1s = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
const _o3g = h('input', { type: 'datetime-local', value: _o1s, 'data-testid': 'meeting-at' });
const title = h('input', { value: 'Hẹn xem nhà' + (c.project ? ' – ' + K.projectName(c.project) : ''), 'data-testid': 'meeting-title' });
const _od = h('input', { type: 'number', min: 0, max: 30, value: 0 });
const _o1u = K.modal({ title: 'Hẹn lịch với ' + (c.name || 'khách'), testid: 'meeting-modal', body: [
K.field('Thời gian', _o3g), K.field('Nội dung', title), K.field('Nhắc trước (ngày)', _od),
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _o1u.close(), { icon: 'close' }), K.button('Lưu lịch hẹn', async () => {
const at = new Date(_o3g.value).getTime();
if (!Number.isFinite(at)) { K.toast('Chọn thời gian hẹn', 'warn'); return; }
await K.put('reminders', { object_id: id, kind: 'meeting', title: title.value.trim() + ' – ' + (c.name || ''), due_at: at, remind_before_days: Number(_od.value) || 0, amount: 0, installment: 0, done: 0, notified_at: 0, data: '{}' });
await K.logEvent(id, 'meeting', 'Hẹn ' + crm.dmy(at) + ' ' + crm.hm(at) + ': ' + title.value.trim());
_o1u.close(); K.toast('Đã lưu lịch hẹn', 'success'); _o2s();
}, { kind: 'primary', icon: 'check', testid: 'meeting-save' }))] });
}
async function erase() {
const _o25 = await K.confirm({ title: 'Xoá dữ liệu khách?', testid: 'erase-step1', kind: 'danger', ok: 'Tiếp tục',
text: 'Toàn bộ thông tin cá nhân của "' + (c.name || '') + '" (tên, số điện thoại, Zalo, ghi chú, ngày sinh, lịch sử liên hệ, nhắc việc, dữ liệu khách trong giữ chỗ/hồ sơ/việc) sẽ bị xoá và không khôi phục được. Lưu ý: Lịch sử phiên bản của Google Sheets và Thùng rác Drive còn giữ bản cũ một thời gian – nhờ Chủ xử lý nếu khách yêu cầu.' });
if (!_o25) return;
const _o3b = crm.normPhone(c.phone).slice(-4) || 'XOA';
const code = h('input', { inputmode: 'numeric', 'data-testid': 'erase-code', placeholder: _o3b });
const done = await new Promise(res => {
const _o1u = K.modal({ title: 'Xác nhận lần 2', testid: 'erase-step2', body: [
h('p', null, 'Nhập 4 số cuối điện thoại của khách (' + _o3b + ') để xác nhận xoá.'), code,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => { _o1u.close(); res(false); }, { icon: 'close' }),
K.button('Xoá vĩnh viễn', () => {
if (code.value.trim().toUpperCase() !== _o3b) { K.toast('Mã xác nhận chưa đúng', 'warn'); return; }
_o1u.close(); res(true);
}, { kind: 'danger', testid: 'erase-confirm' }))] });
});
if (!done) return;
await _o12();
K.toast('Đã xoá dữ liệu khách', 'success');
_o34.close();
}
async function _o12() {
const t = Date.now();
const [events, reminders] = await Promise.all([K.listAll('events'), K.listAll('reminders')]);
for (const e of events) if (e.object_id === id && !Number(e.deleted)) await K.put('events', { ...e, text: '', data: '', deleted: 1 });
for (const r of reminders) if (r.object_id === id && !Number(r.deleted)) await K.put('reminders', { ...r, title: '', data: '', deleted: 1 });
await K.put('objects', crm.anonymize(c, t));
try { await ctx.store.put('audit', { id: K.newId(), at: t, device_id: (ctx.auth && ctx.auth.deviceId) || '', action: 'customer.erase', object_id: id, detail: 'Xoá dữ liệu cá nhân theo yêu cầu của khách', updated_at: t }); } catch { }
}
await _o2s();
K.on(body, ['events', 'reminders', 'objects'], _o2s);
return _o34;
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

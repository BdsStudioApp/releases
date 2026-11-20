import { kit, h, selftestCommon } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import { missingRequired } from '../../../core/connections_logic.cff3dbca52.js';
import { greeting, vnDayText } from '../../../core/greet.60b99ed569.js';
import { freshButton } from '../_lib/fresh.js';
import * as N from '../_lib/freshnews.js';
import { areaProvince } from '../_lib/market.js';
function _oj() { try { const id = localStorage.getItem('bds.market.area'); return id ? areaProvince(id) : ''; } catch { return ''; } }
export async function mount(el, ctx) {
const K = kit(ctx);
el.innerHTML = '';
const _o4 = h('div', { class: 'bds-screen bds-brief', 'data-testid': 'brief' });
el.appendChild(_o4);
let _oi = false;
const _ol = h('div', { 'data-testid': 'brief-news-wrap' });
const _oe = () => { try { _ol.replaceChildren(_om(K, ctx, _oe)); } catch { } };
_oe();
let _oa = null;
const demo = !!(ctx.api && ctx.api.mode === 'demo');
if (!demo) {
K.api('connections.status', {}).then(d => {
const miss = missingRequired({ mode: 'gas', serverOk: true, secrets: (d && d.secrets) || {}, last: (d && d.last) || {}, solo: !!ctx.solo });
_oa = { miss };
if (miss.length && el.isConnected) render();
}).catch(() => { });
}
const _oh = async _o5 => {
if (_oi) return;
_oi = true; _o5.disabled = true; _ox(_o5, 'Đang nhập…');
try {
const r = await K.api('landing.import_now', {});
const n = (r && (r.imported ?? r.count)) || 0;
K.toast(n ? 'Đã nhập ' + n + ' khách mới từ landing' : 'Chưa có khách mới trên landing', n ? 'success' : 'info');
try { if (ctx.store.syncNow) await ctx.store.syncNow(); } catch { }
} catch (e) {
K.toast((e && e.message) || 'Chưa nhập được – kiểm tra kết nối', 'warn');
} finally { _oi = false; _o5.disabled = false; _ox(_o5, 'Nhập khách landing ngay'); render(); }
};
let _of = true;
async function render() {
const _o1 = n => { if (n) _o4.appendChild(n); };
const _ov = _of && el.getClientRects().length > 0; _of = false;
const [customers, events, reminders, policies, me] = await Promise.all([
K.list('objects'), K.list('events'), K.list('reminders'), K.list('policies'), K.me()]);
const now = Date.now();
const _o2 = crm.buildBrief({ customers, events, reminders, policies, now, logic: K.L });
const _o6 = new Map(crm.activeCustomers(customers).map(_o7 => [_o7.id, _o7]));
let syncLine = '';
try { const _ow = ctx.store.status ? await ctx.store.status() : null; if (_ow) syncLine = (_ow.online === false ? 'Đang ngoại tuyến · ' : '') + (_ow.pending ? _ow.pending + ' thay đổi chờ đồng bộ' : 'Đã đồng bộ'); } catch { }
const perms = ctx.user && ctx.user.perms;
const _o9 = (!perms || perms.video !== false) && !(ctx.packs && !ctx.packs.featureOn('brief_video'));
let _ot = null;
_o4.innerHTML = '';
const _o5 = K.button('Nhập khách landing ngay', () => _oh(_o5), { icon: 'download', testid: 'import-landing' });
_o4.appendChild(h('div', { class: 'bds-head' },
h('div', null,
h('h2', null, greeting(me.name, now)),
h('small', { class: 'bds-muted' }, vnDayText(now) + (syncLine ? ' · ' + syncLine : ''))),
_o5));
const _os = _ob(K, demo, _oa);
if (_os) _o4.appendChild(_os);
const _o10 = _o2.newLeads.length + _o2.dueToday.length + _o2.overdue.length + _o2.paymentsSoon.length + _o2.meetingsToday.length;
_o4.appendChild(h('div', { class: 'bds-stats' },
_oz('Khách mới', _o2.newLeads.length, 'info'), _oz('Cần gọi', _o2.dueToday.length, 'warn'),
_oz('Quá hạn', _o2.overdue.length, 'danger'), _oz('Sắp đóng tiền', _o2.paymentsSoon.length, 'success')));
if (!_o10 && !_o2.stalePolicies.length) _o4.appendChild(K.empty('Hôm nay chưa có việc gấp. Có thể gọi chăm sóc khách cũ hoặc nhập khách từ landing.'));
const _od = (_o7, sub) => h('div', { class: 'bds-item', 'data-id': _o7.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => K.openProfile(_o7.id), 'data-testid': 'brief-open-' + _o7.id },
h('strong', null, _o7.name || 'Khách'), h('span', { class: 'bds-sub' }, sub)),
h('div', { class: 'bds-acts' }, K.callBtn(_o7), K.zaloBtn(_o7, { short: true })));
const remRow = r => {
const _o7 = _o6.get(r.object_id);
const sub = [K.date(r.due_at) + (r.kind === 'meeting' ? ' ' + crm.hm(r.due_at) : ''), r.amount ? K.money(r.amount) : '', _o7 && !String(r.title || '').includes(_o7.name) ? _o7.name : ''].filter(Boolean).join(' · ');
if (!_o7) return h('div', { class: 'bds-item' }, h('div', { class: 'bds-row-main' }, h('strong', null, r.title || 'Việc'), h('span', { class: 'bds-sub' }, sub)),
h('div', { class: 'bds-acts' }, K.button('✓', async () => { await K.put('reminders', { ...r, done: 1 }); render(); }, { title: 'Xong' })));
return h('div', { class: 'bds-item', 'data-id': r.id, 'data-testid': 'brief-rem-' + r.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => K.openProfile(_o7.id) },
h('strong', null, r.title || _o7.name), h('span', { class: 'bds-sub' }, sub)),
h('div', { class: 'bds-acts' }, K.callBtn(_o7, { short: true }), K.zaloBtn(_o7, { short: true }),
r.virtual ? null : K.button('✓', async () => { await K.put('reminders', { ...r, done: 1 }); K.toast('Đã xong', 'success'); render(); }, { title: 'Đánh dấu xong', testid: 'brief-done-' + r.id })));
};
const section = (title, list, rowFn, testid, empty) => (list.length || empty) ? K.card({
title: title + ' (' + list.length + ')', testid,
body: list.length ? h('div', { class: 'bds-list' }, list.slice(0, 30).map(rowFn)) : K.empty(empty),
}) : null;
_o1(section('Khách mới', _o2.newLeads, _o7 => _od(_o7, [K.projectName(_o7.project), K.phone(_o7.phone), 'nhận ' + K.date(_o7.created_at || _o7.updated_at)].filter(Boolean).join(' · ')), 'brief-new', 'Chưa có khách mới từ landing.'));
_o1(section('Cần gọi hôm nay', _o2.dueToday, remRow, 'brief-due', 'Không có cuộc gọi đến hạn.'));
_o1(section('Quá hạn', _o2.overdue, remRow, 'brief-overdue'));
_o1(section('Sắp đóng tiền (7 ngày)', _o2.paymentsSoon, remRow, 'brief-payments'));
_o1(section('Hẹn xem nhà hôm nay', _o2.meetingsToday, remRow, 'brief-meetings'));
if (_o2.stalePolicies.length) _o4.appendChild(K.card({
title: 'Chính sách cũ (' + _o2.stalePolicies.length + ')', testid: 'brief-policies',
body: h('div', { class: 'bds-list' }, _o2.stalePolicies.map(p => h('div', { class: 'bds-item' },
h('div', { class: 'bds-row-main' }, h('strong', null, K.projectName(p.project_id) || p.project_id), h('span', { class: 'bds-sub' }, 'Chính sách tháng ' + (p.month || '?') + ' – nên cập nhật trước khi báo giá')),
h('div', { class: 'bds-acts' }, K.button('Cập nhật', () => K.nav('#/sales/policy?project=' + encodeURIComponent(p.project_id || ''))))))),
}));
_o4.appendChild(_ol);
if (_ot) _o4.appendChild(_ot);
}
await render();
K.on(el, ['objects', 'events', 'reminders', 'policies', 'jobs'], render);
_o11(ctx, K, el, _oe);
}
function _on(ctx) {
try { if (ctx.settings && typeof ctx.settings.get === 'function') return ctx.settings.get(N.NEWS_KEY, null); } catch { }
return null;
}
function _om(K, ctx, redraw) {
N.ensureFreshCss();
const _oq = N.readNews(_on(ctx));
const _o8 = N.canUpdateNews(ctx.user);
const _o5 = _o8 ? freshButton(K, ctx, {
topic: 'news', title: 'Cập nhật tin thị trường BĐS mới nhất', testid: 'brief-news-fresh',
prompt: () => N.newsPrompt({ now: Date.now(), province: _oj() }),
render: (parsed) => { const items = N.normalizeNews(parsed); return items.length ? N.newsListView(items, { testid: 'brief-news-preview' }) : null; },
onSave: async (parsed, meta) => {
const r = N.newsRecord(parsed, meta);
if (!r.items.length) throw new Error('AI chưa trả về tin nào đọc được');
await K.setSetting(N.NEWS_KEY, r);
redraw();
},
}) : null;
const srcs = _oq && _oq.meta.sources.length ? h('details', { class: 'bds-sub', 'data-testid': 'brief-news-sources' },
h('summary', null, 'Các trang AI đã đọc (' + _oq.meta.sources.length + ')'),
h('div', { class: 'sl-chips' }, _oq.meta.sources.map(_ow => h('a', { class: 'sl-chip' + (_ow.reputable ? ' on' : ''), href: _ow.url, target: '_blank', rel: 'noopener noreferrer' }, (_ow.reputable ? '✓ ' : '') + (_ow.domain || _ow.title || 'nguồn'))))) : null;
return K.card({
title: 'Tin mới cập nhật' + (_oq ? ' (' + _oq.items.length + ')' : ''), testid: 'brief-news',
body: h('div', { class: 'sl-col' },
_oq ? h('small', { class: 'bds-muted', 'data-testid': 'brief-news-stamp' }, _oq.meta.stamp) : null,
_oq ? N.newsListView(_oq.items, { testid: 'brief-news' })
: h('div', { 'data-testid': 'brief-news-empty' }, K.empty(_o8
? 'Chưa có tin. Bấm "Cập nhật thông tin mới nhất qua AI" – AI tìm tin thị trường BĐS mới nhất trên các trang tin uy tín (app báo phí trước).'
: 'Chưa có tin – Quản trị hoặc Quản lý bấm cập nhật thì tin hiện ở đây cho cả nhóm.')),
srcs, _o5),
});
}
function _o11(ctx, K, el, redraw) {
const _ow = ctx.settings;
if (_ow && typeof _ow.on === 'function') {
let _oo = null;
try { _oo = _ow.on(N.NEWS_KEY, () => { if (!el.isConnected) { try { _oo && _oo(); } catch { } return; } redraw(); }); } catch { _oo = null; }
if (_oo) return;
}
K.on(el, ['settings'], redraw);
}
function _ob(K, demo, _oa) {
const open = () => K.nav('#/settings/connection/' + (demo ? 'server' : (_oa && _oa.miss[0] && _oa.miss[0].id) || ''));
if (demo) {
return h('div', { class: 'bds-conn-note', role: 'note', 'data-testid': 'brief-conn' }, _oc(K),
h('div', { class: 'bds-row-main' }, h('strong', null, 'Đang xem thử – kết nối máy chủ để dùng thật'),
h('span', { class: 'bds-sub' }, 'Dữ liệu mẫu chỉ nằm trên trình duyệt này. Nối máy chủ, khoá Gemini và bot Telegram (Trợ lý cài đặt) để nhận khách thật.')),
K.button('Mở Cài đặt › Kết nối', open, { testid: 'brief-conn-open', kind: 'primary', icon: 'settings' }));
}
if (!_oa || !_oa.miss.length) return null;
return h('div', { class: 'bds-conn-note', role: 'note', 'data-testid': 'brief-conn' }, _oc(K),
h('div', { class: 'bds-row-main' }, h('strong', null, 'Còn ' + _oa.miss.length + ' kết nối chưa xong'),
h('span', { class: 'bds-sub' }, _oa.miss.map(x => x.name).join(', ') + ' – ' + _ok(_oa.miss) + '.')),
K.button('Mở Cài đặt › Kết nối', open, { testid: 'brief-conn-open', kind: 'primary', icon: 'settings' }));
}
function _oc(K) { const _og = K.icon('plug', 22); return _og ? h('span', { class: 'bds-conn-ico', 'aria-hidden': 'true' }, _og) : null; }
function _ox(_o5, text) { const _oy = _o5.querySelector('svg') && _o5.querySelector('span'); if (_oy) _oy.textContent = text; else _o5.textContent = text; }
function _ok(miss) {
const ids = new Set(miss.map(x => x.id));
const _op = [];
if (ids.has('server')) _op.push('chưa lưu và đồng bộ được dữ liệu');
if (ids.has('telegram')) _op.push('chưa nhận báo khách mới/nhắc việc qua Telegram');
if (ids.has('gemini')) _op.push('các nút AI chưa dùng được');
return _op.length ? 'thiếu thì ' + _op.join(', ') : 'cần nối để dùng đủ chức năng';
}
function _oz(label, n, tone) { return h('div', { class: 'bds-stat bds-tone-' + tone }, h('strong', null, String(n)), h('span', null, label)); }
const _o0 = 3;
export async function summary(el, ctx) {
const K = kit(ctx);
const _o4 = h('section', { class: 'bds-screen bds-home-sum', 'data-testid': 'home-summary' });
el.replaceChildren(_o4);
async function render() {
const [customers, events, reminders, policies] = await Promise.all([K.list('objects'), K.list('events'), K.list('reminders'), K.list('policies')]);
const now = Date.now();
const _o2 = crm.buildBrief({ customers, events, reminders, policies, now, logic: K.L });
const _o6 = new Map(crm.activeCustomers(customers).map(_o7 => [_o7.id, _o7]));
const parts = [h('div', { class: 'bds-stats', 'data-testid': 'home-sum-stats' },
_oz('Khách mới', _o2.newLeads.length, 'info'), _oz('Cần gọi', _o2.dueToday.length, 'warn'),
_oz('Quá hạn', _o2.overdue.length, 'danger'), _oz('Hẹn hôm nay', _o2.meetingsToday.length, 'success'))];
const _ou = (_o7, title, sub, testid) => h('div', { class: 'bds-item', 'data-testid': testid },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => _o7 ? K.openProfile(_o7.id) : K.nav('#/home/brief') },
h('strong', null, title), sub ? h('span', { class: 'bds-sub' }, sub) : null),
_o7 ? h('div', { class: 'bds-acts' }, K.callBtn(_o7, { short: true }), K.zaloBtn(_o7, { short: true })) : null);
const _or = (r, _o7) => [K.date(r.due_at) + (r.kind === 'meeting' ? ' ' + crm.hm(r.due_at) : ''), _o7 && !String(r.title || '').includes(_o7.name) ? _o7.name : ''].filter(Boolean).join(' · ');
const _o3 = (title, list, mk, testid) => {
if (!list.length) return;
parts.push(K.card({ title: title + ' (' + list.length + ')', testid,
body: h('div', { class: 'bds-list' }, list.slice(0, _o0).map(mk),
list.length > _o0 ? h('small', { class: 'bds-muted' }, 'Còn ' + (list.length - _o0) + ' mục nữa trong Bảng tin đầy đủ') : null) }));
};
_o3('Khách mới', _o2.newLeads, _o7 => _ou(_o7, _o7.name || 'Khách', [K.projectName(_o7.project), K.phone(_o7.phone)].filter(Boolean).join(' · '), 'home-sum-new-' + _o7.id), 'home-sum-new');
_o3('Cần gọi hôm nay', _o2.dueToday, r => { const _o7 = _o6.get(r.object_id); return _ou(_o7, r.title || (_o7 && _o7.name) || 'Việc', _or(r, _o7), 'home-sum-due-' + r.id); }, 'home-sum-due');
_o3('Quá hạn', _o2.overdue, r => { const _o7 = _o6.get(r.object_id); return _ou(_o7, r.title || (_o7 && _o7.name) || 'Việc', _or(r, _o7), 'home-sum-overdue-' + r.id); }, 'home-sum-overdue');
_o3('Hẹn xem nhà hôm nay', _o2.meetingsToday, r => { const _o7 = _o6.get(r.object_id); return _ou(_o7, r.title || (_o7 && _o7.name) || 'Hẹn', _or(r, _o7), 'home-sum-meet-' + r.id); }, 'home-sum-meet');
if (parts.length === 1) parts.push(K.empty('Hôm nay chưa có việc gấp. Có thể gọi chăm sóc khách cũ hoặc thêm khách mới.'));
_o4.replaceChildren(...parts);
}
await render();
K.on(_o4, ['objects', 'events', 'reminders', 'policies'], render);
}
export default {
manifest: {
id: 'brief', title: 'Bảng tin', icon: '☀️', screen: 'home', order: 10, version: '1.0.0', status: 'ready',
help: 'Khách mới, cuộc gọi đến hạn, việc quá hạn, đợt đóng tiền sắp tới và lịch hẹn hôm nay – một chạm để gọi hoặc nhắn Zalo.',
},
mount,
summary,
async selftest(ctx) {
return selftestCommon(ctx, ['fmt.money', 'remind.followupDue', 'link.tel', 'link.zalo'], div => mount(div, ctx));
},
};

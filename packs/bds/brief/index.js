import { kit, h, selftestCommon } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import { missingRequired } from '../../../core/connections_logic.5d678ff0de.js';
import { greeting, vnDayText } from '../../../core/greet.60b99ed569.js';
import { freshButton } from '../_lib/fresh.js';
import * as N from '../_lib/freshnews.js';
import { areaProvince } from '../_lib/market.js';
import { drawHotTopics } from './hot_topics.js';
import * as D from '../_lib/brief_due.js';
function _om() { try { const id = localStorage.getItem('bds.market.area'); return id ? areaProvince(id) : ''; } catch { return ''; } }
export async function mount(el, ctx) {
const K = kit(ctx);
el.innerHTML = '';
const box = h('div', { class: 'bds-screen bds-brief', 'data-testid': 'brief' });
el.appendChild(box);
let _ol = false;
const _oo = h('div', { 'data-testid': 'brief-news-wrap' });
const _oe = () => { try { _oo.replaceChildren(_op(K, ctx, _oe)); } catch { } };
_oe();
const _oh = h('div', { 'data-testid': 'brief-hot-wrap' });
let _oi = false;
const _od = () => { if (_oi) drawHotTopics(_oh, K, ctx); };
let _o7 = null;
const demo = !!(ctx.api && ctx.api.mode === 'demo');
if (!demo) {
K.api('connections.status', {}).then(d => {
const miss = missingRequired({ mode: 'gas', serverOk: true, secrets: (d && d.secrets) || {}, last: (d && d.last) || {}, solo: !!ctx.solo });
_o7 = { miss };
if (miss.length && el.isConnected) render();
}).catch(() => { });
}
const _ok = async _o4 => {
if (_ol) return;
_ol = true; _o4.disabled = true; _o10(_o4, 'Đang nhập…');
try {
const r = await K.api('landing.import_now', {});
const n = (r && (r.imported ?? r.count)) || 0;
K.toast(n ? 'Đã nhập ' + n + ' khách mới từ landing' : 'Chưa có khách mới trên landing', n ? 'success' : 'info');
try { if (ctx.store.syncNow) await ctx.store.syncNow(); } catch { }
} catch (e) {
K.toast((e && e.message) || 'Chưa nhập được – kiểm tra kết nối', 'warn');
} finally { _ol = false; _o4.disabled = false; _o10(_o4, 'Nhập khách landing ngay'); render(); }
};
let _og = true;
async function render() {
const _o1 = n => { if (n) box.appendChild(n); };
const _oy = _og && el.getClientRects().length > 0; _og = false;
const [customers, events, reminders, policies, me] = await Promise.all([
K.list('objects'), K.list('events'), K.list('reminders'), K.list('policies'), K.me()]);
const now = Date.now();
const _o2 = crm.buildBrief({ customers, events, reminders, policies, now, logic: K.L });
const byId = new Map(crm.activeCustomers(customers).map(c => [c.id, c]));
let syncLine = '';
try { const _oz = ctx.store.status ? await ctx.store.status() : null; if (_oz) syncLine = (_oz.online === false ? 'Đang ngoại tuyến · ' : '') + (_oz.pending ? _oz.pending + ' thay đổi chờ đồng bộ' : 'Đã đồng bộ'); } catch { }
const perms = ctx.user && ctx.user.perms;
const _o6 = (!perms || perms.video !== false) && !(ctx.packs && !ctx.packs.featureOn('brief_video')) && !(ctx.device && ctx.device.mobile);
let _ow = null;
if (_o6) _ow = await import('../staff/index.js').then((m) => m.briefSection(ctx, { run: _oy })).catch(() => null);
_oi = _o6 && !(ctx.packs && typeof ctx.packs.moduleOn === 'function' && !ctx.packs.moduleOn('ideas')) && !(ctx.device && ctx.device.blocked('ideas'));
box.innerHTML = '';
const _o4 = K.button('Nhập khách landing ngay', () => _ok(_o4), { icon: 'download', testid: 'import-landing' });
box.appendChild(h('div', { class: 'bds-head' },
h('div', null,
h('h2', null, greeting(me.name, now)),
h('small', { class: 'bds-muted' }, vnDayText(now) + (syncLine ? ' · ' + syncLine : ''))),
_o4));
const _ov = _o8(K, demo, _o7);
if (_ov) box.appendChild(_ov);
const _o14 = _o2.newLeads.length + _o2.dueToday.length + _o2.overdue.length + _o2.paymentsSoon.length + _o2.meetingsToday.length;
box.appendChild(h('div', { class: 'bds-stats' },
_o12('Khách mới', _o2.newLeads.length, 'info'), _o12('Cần gọi', _o2.dueToday.length, 'warn'),
_o12('Quá hạn', _o2.overdue.length, 'danger'), _o12('Sắp đóng tiền', _o2.paymentsSoon.length, 'success')));
if (!_o14) box.appendChild(K.empty('Hôm nay chưa có việc gấp. Có thể gọi chăm sóc khách cũ hoặc nhập khách từ landing.'));
const _oa = (c, sub) => h('div', { class: 'bds-item', 'data-id': c.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => K.openProfile(c.id), 'data-testid': 'brief-open-' + c.id },
h('strong', null, c.name || 'Khách'), h('span', { class: 'bds-sub' }, sub)),
h('div', { class: 'bds-acts' }, K.callBtn(c), K.zaloBtn(c, { short: true })));
const remRow = r => {
const c = byId.get(r.object_id);
const sub = [K.date(r.due_at) + (r.kind === 'meeting' ? ' ' + crm.hm(r.due_at) : ''), r.amount ? K.money(r.amount) : '', c && !String(r.title || '').includes(c.name) ? c.name : ''].filter(Boolean).join(' · ');
const _ob = /^ideas21h/.test(String(r.id || '')) && !!(ctx.device && ctx.device.blocked('ideas'));
if (!c) return h('div', { class: 'bds-item', 'data-testid': _ob ? 'brief-rem-desk' : null }, h('div', { class: 'bds-row-main' }, h('strong', null, r.title || 'Việc'), h('span', { class: 'bds-sub' }, [sub, _ob ? 'Mở trên máy tính' : ''].filter(Boolean).join(' · '))),
h('div', { class: 'bds-acts' }, K.button('✓', async () => { await K.put('reminders', { ...r, done: 1 }); render(); }, { title: 'Xong' })));
return h('div', { class: 'bds-item', 'data-id': r.id, 'data-testid': 'brief-rem-' + r.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => K.openProfile(c.id) },
h('strong', null, r.title || c.name), h('span', { class: 'bds-sub' }, sub)),
h('div', { class: 'bds-acts' }, K.callBtn(c, { short: true }), K.zaloBtn(c, { short: true }),
r.virtual ? null : K.button('✓', async () => { await K.put('reminders', { ...r, done: 1 }); K.toast('Đã xong', 'success'); render(); }, { title: 'Đánh dấu xong', testid: 'brief-done-' + r.id })));
};
const section = (title, list, rowFn, testid, empty) => (list.length || empty) ? K.card({
title: title + ' (' + list.length + ')', testid,
body: list.length ? h('div', { class: 'bds-list' }, list.slice(0, 30).map(rowFn)) : K.empty(empty),
}) : null;
_o1(section('Khách mới', _o2.newLeads, c => _oa(c, [K.projectName(c.project), K.phone(c.phone), 'nhận ' + K.date(c.created_at || c.updated_at)].filter(Boolean).join(' · ')), 'brief-new', 'Chưa có khách mới từ landing.'));
const _oc = async (r) => { await D.markDone(K, r); K.toast('Đã xong', 'success'); render(); };
const _of = (r) => {
const c = byId.get(r.object_id);
const sub = [K.date(r.due_at), c && !String(r.title || '').includes(c.name) ? c.name : ''].filter(Boolean).join(' · ');
return h('div', { class: 'bds-item', 'data-id': r.id, 'data-testid': 'brief-rem-' + r.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => (c ? K.openProfile(c.id) : null) }, h('strong', null, r.title || (c && c.name) || 'Việc'), h('span', { class: 'bds-sub' }, sub)),
D.dueActs(K, c, r, _oc));
};
_o1(D.collapsibleCard(K, { id: 'due', title: 'Cần gọi hôm nay (' + _o2.dueToday.length + ')', testid: 'brief-due',
body: _o2.dueToday.length ? h('div', { class: 'bds-list' }, _o2.dueToday.slice(0, 30).map(_of)) : K.empty('Không có cuộc gọi đến hạn.') }));
_o1(section('Quá hạn', _o2.overdue, remRow, 'brief-overdue'));
_o1(section('Sắp đóng tiền (7 ngày)', _o2.paymentsSoon, remRow, 'brief-payments'));
_o1(section('Hẹn xem nhà hôm nay', _o2.meetingsToday, remRow, 'brief-meetings'));
box.appendChild(_oo);
if (_oi) { box.appendChild(_oh); _od(); }
if (_ow) box.appendChild(_ow);
}
await render();
K.on(el, ['objects', 'events', 'reminders', 'policies', 'jobs'], render);
_o15(ctx, K, el, _oe);
K.on(el, ['ideas', 'settings'], _od);
}
function _oq(ctx) {
try { if (ctx.settings && typeof ctx.settings.get === 'function') return ctx.settings.get(N.NEWS_KEY, null); } catch { }
return null;
}
function _op(K, ctx, redraw) {
N.ensureFreshCss();
const _ot = N.readNews(_oq(ctx));
const _o5 = N.canUpdateNews(ctx.user);
const _o4 = _o5 ? freshButton(K, ctx, {
topic: 'news', title: 'Cập nhật tin thị trường BĐS mới nhất', testid: 'brief-news-fresh',
prompt: () => N.newsPrompt({ now: Date.now(), province: _om() }),
render: (parsed) => { const items = N.normalizeNews(parsed); return items.length ? N.newsListView(items, { testid: 'brief-news-preview' }) : null; },
onSave: async (parsed, meta) => {
const r = N.newsRecord(parsed, meta);
if (!r.items.length) throw new Error('AI chưa trả về tin nào đọc được');
await K.setSetting(N.NEWS_KEY, r);
redraw();
},
}) : null;
const srcs = _ot && _ot.meta.sources.length ? h('details', { class: 'bds-sub', 'data-testid': 'brief-news-sources' },
h('summary', null, 'Các trang AI đã đọc (' + _ot.meta.sources.length + ')'),
h('div', { class: 'sl-chips' }, _ot.meta.sources.map(_oz => h('a', { class: 'sl-chip' + (_oz.reputable ? ' on' : ''), href: _oz.url, target: '_blank', rel: 'noopener noreferrer' }, (_oz.reputable ? '✓ ' : '') + (_oz.domain || _oz.title || 'nguồn'))))) : null;
return K.card({
title: 'Tin mới cập nhật' + (_ot ? ' (' + _ot.items.length + ')' : ''), testid: 'brief-news',
body: h('div', { class: 'sl-col' },
_ot ? h('small', { class: 'bds-muted', 'data-testid': 'brief-news-stamp' }, _ot.meta.stamp) : null,
_ot ? N.newsListView(_ot.items, { testid: 'brief-news' })
: h('div', { 'data-testid': 'brief-news-empty' }, K.empty(_o5
? 'Chưa có tin. Bấm "Cập nhật thông tin mới nhất qua AI" – AI tìm tin thị trường BĐS mới nhất trên các trang tin uy tín (app báo phí trước).'
: 'Chưa có tin – Quản trị hoặc Quản lý bấm cập nhật thì tin hiện ở đây cho cả nhóm.')),
srcs, _o4),
});
}
function _o15(ctx, K, el, redraw) {
const _oz = ctx.settings;
if (_oz && typeof _oz.on === 'function') {
let _or = null;
try { _or = _oz.on(N.NEWS_KEY, () => { if (!el.isConnected) { try { _or && _or(); } catch { } return; } redraw(); }); } catch { _or = null; }
if (_or) return;
}
K.on(el, ['settings'], redraw);
}
function _o8(K, demo, _o7) {
const open = () => K.nav('#/settings/connection/' + (demo ? 'server' : (_o7 && _o7.miss[0] && _o7.miss[0].id) || ''));
if (demo) {
return h('div', { class: 'bds-conn-note', role: 'note', 'data-testid': 'brief-conn' }, _o9(K),
h('div', { class: 'bds-row-main' }, h('strong', null, 'Đang xem thử – kết nối máy chủ để dùng thật'),
h('span', { class: 'bds-sub' }, 'Dữ liệu mẫu chỉ nằm trên trình duyệt này. Nối máy chủ, khoá Gemini và bot Telegram (Trợ lý cài đặt) để nhận khách thật.')),
K.button('Mở Cài đặt › Kết nối', open, { testid: 'brief-conn-open', kind: 'primary', icon: 'settings' }));
}
if (!_o7 || !_o7.miss.length) return null;
return h('div', { class: 'bds-conn-note', role: 'note', 'data-testid': 'brief-conn' }, _o9(K),
h('div', { class: 'bds-row-main' }, h('strong', null, 'Còn ' + _o7.miss.length + ' kết nối chưa xong'),
h('span', { class: 'bds-sub' }, _o7.miss.map(x => x.name).join(', ') + ' – ' + _on(_o7.miss) + '.')),
K.button('Mở Cài đặt › Kết nối', open, { testid: 'brief-conn-open', kind: 'primary', icon: 'settings' }));
}
function _o9(K) { const _oj = K.icon('plug', 22); return _oj ? h('span', { class: 'bds-conn-ico', 'aria-hidden': 'true' }, _oj) : null; }
function _o10(_o4, text) { const _o11 = _o4.querySelector('svg') && _o4.querySelector('span'); if (_o11) _o11.textContent = text; else _o4.textContent = text; }
function _on(miss) {
const ids = new Set(miss.map(x => x.id));
const _os = [];
if (ids.has('server')) _os.push('chưa lưu và đồng bộ được dữ liệu');
if (ids.has('telegram')) _os.push('chưa nhận báo khách mới/nhắc việc qua Telegram');
if (ids.has('gemini')) _os.push('các nút AI chưa dùng được');
return _os.length ? 'thiếu thì ' + _os.join(', ') : 'cần nối để dùng đủ chức năng';
}
function _o12(label, n, tone) { return h('div', { class: 'bds-stat bds-tone-' + tone }, h('strong', null, String(n)), h('span', null, label)); }
const _o0 = 3;
export async function summary(el, ctx) {
const K = kit(ctx);
const box = h('section', { class: 'bds-screen bds-home-sum', 'data-testid': 'home-summary' });
el.replaceChildren(box);
async function render() {
const [customers, events, reminders, policies] = await Promise.all([K.list('objects'), K.list('events'), K.list('reminders'), K.list('policies')]);
const now = Date.now();
const _o2 = crm.buildBrief({ customers, events, reminders, policies, now, logic: K.L });
const byId = new Map(crm.activeCustomers(customers).map(c => [c.id, c]));
const parts = [h('div', { class: 'bds-stats', 'data-testid': 'home-sum-stats' },
_o12('Khách mới', _o2.newLeads.length, 'info'), _o12('Cần gọi', _o2.dueToday.length, 'warn'),
_o12('Quá hạn', _o2.overdue.length, 'danger'), _o12('Hẹn hôm nay', _o2.meetingsToday.length, 'success'))];
const _o13 = h('div', { class: 'bds-home-todo', 'data-testid': 'home-todo-host', style: 'display:contents' });
parts.push(_o13);
import('./todo_card.js').then((m) => m.todoCard(K, ctx)).then((card) => { _o13.replaceChildren(...(card ? [card] : [])); })
.catch(() => { });
const _ox = (c, title, sub, testid) => h('div', { class: 'bds-item', 'data-testid': testid },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => c ? K.openProfile(c.id) : K.nav('#/home/brief') },
h('strong', null, title), sub ? h('span', { class: 'bds-sub' }, sub) : null),
c ? h('div', { class: 'bds-acts' }, K.callBtn(c, { short: true }), K.zaloBtn(c, { short: true })) : null);
const _ou = (r, c) => [K.date(r.due_at) + (r.kind === 'meeting' ? ' ' + crm.hm(r.due_at) : ''), c && !String(r.title || '').includes(c.name) ? c.name : ''].filter(Boolean).join(' · ');
const _o3 = (title, list, mk, testid) => {
if (!list.length) return;
parts.push(K.card({ title: title + ' (' + list.length + ')', testid,
body: h('div', { class: 'bds-list' }, list.slice(0, _o0).map(mk),
list.length > _o0 ? h('small', { class: 'bds-muted' }, 'Còn ' + (list.length - _o0) + ' mục nữa trong Bảng tin đầy đủ') : null) }));
};
_o3('Khách mới', _o2.newLeads, c => _ox(c, c.name || 'Khách', [K.projectName(c.project), K.phone(c.phone)].filter(Boolean).join(' · '), 'home-sum-new-' + c.id), 'home-sum-new');
if (_o2.dueToday.length) {
const _oc = async (r) => { await D.markDone(K, r); K.toast('Đã xong', 'success'); render(); };
const _of = (r) => { const c = byId.get(r.object_id); return h('div', { class: 'bds-item', 'data-testid': 'home-sum-due-' + r.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => c ? K.openProfile(c.id) : K.nav('#/home/brief') }, h('strong', null, r.title || (c && c.name) || 'Việc'), h('span', { class: 'bds-sub' }, _ou(r, c))),
D.dueActs(K, c, r, _oc)); };
parts.push(D.collapsibleCard(K, { id: 'due', title: 'Cần gọi hôm nay (' + _o2.dueToday.length + ')', testid: 'home-sum-due',
body: h('div', { class: 'bds-list' }, _o2.dueToday.slice(0, _o0).map(_of),
_o2.dueToday.length > _o0 ? h('small', { class: 'bds-muted' }, 'Còn ' + (_o2.dueToday.length - _o0) + ' mục nữa trong Bảng tin đầy đủ') : null) }));
}
_o3('Quá hạn', _o2.overdue, r => { const c = byId.get(r.object_id); return _ox(c, r.title || (c && c.name) || 'Việc', _ou(r, c), 'home-sum-overdue-' + r.id); }, 'home-sum-overdue');
_o3('Hẹn xem nhà hôm nay', _o2.meetingsToday, r => { const c = byId.get(r.object_id); return _ox(c, r.title || (c && c.name) || 'Hẹn', _ou(r, c), 'home-sum-meet-' + r.id); }, 'home-sum-meet');
if (parts.length === 2) parts.push(K.empty('Hôm nay chưa có việc gấp. Có thể gọi chăm sóc khách cũ hoặc thêm khách mới.'));
box.replaceChildren(...parts);
}
await render();
K.on(box, ['objects', 'events', 'reminders', 'policies', 'jobs', 'settings'], render);
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

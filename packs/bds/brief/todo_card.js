import { h } from '../_lib/kit.js';
import * as LP from '../_lib/lead_pool.js';
import { pendingItems } from '../inbox/index.js';
export function todoRows({ items = [], customers = [], team = null } = {}) {
const n = (k) => items.filter((i) => i.kind === k).length;
const _o1 = customers.filter((c) => !Number(c.deleted) && LP.needsCall(c)).length;
return [
{ k: 'call', icon: '📞', label: 'Số công ty giao chờ anh/chị gọi', n: _o1, href: '#/customers/customers' },
{ k: 'team', icon: '👥', label: 'Số chờ trưởng nhóm nhận', n: Number(team) || 0, href: '#/customers/lead_pool' },
{ k: 'zalo', icon: '✉️', label: 'Tin Zalo nháp chờ gửi', n: n('zalo'), href: '#/home/inbox' },
{ k: 'job', icon: '🎬', label: 'Video / việc AI chờ duyệt', n: n('job'), href: '#/home/inbox' },
].filter((r) => r.n > 0);
}
export function teamWaiting(home) {
const _o3 = (home && home.info && home.info.scope) || {};
const _o2 = _o3.leader_of || [];
const rows = (home && home.list && home.list.rows) || [];
return rows.filter((x) => x.status === 'team' && !x.team_ack && (_o3.push_all || _o2.includes(x.team_id))).length;
}
let _o4 = { at: 0, n: null };
const _o0 = 120000;
async function _o5(K, ctx) {
const P = (ctx.user && ctx.user.perms) || {};
if (!ctx.user || ctx.user.legacy || !(P.lead_lead || P.lead_push)) return null;
if (Date.now() - _o4.at < _o0) return _o4.n;
let n = null;
try { n = teamWaiting(await K.api('pool.home')); } catch { n = _o4.n; }
_o4 = { at: Date.now(), n };
return n;
}
export async function todoCard(K, ctx) {
const [{ items, customers }, team] = await Promise.all([pendingItems(K, ctx), _o5(K, ctx)]);
const rows = todoRows({ items, customers, team });
if (!rows.length) return null;
const _o6 = rows.reduce((s, r) => s + r.n, 0);
return K.card({ title: 'Cần anh/chị xử lý (' + _o6 + ')', testid: 'home-todo', body: h('div', { class: 'bds-list' }, rows.map((r) =>
h('div', { class: 'bds-item', 'data-testid': 'home-todo-' + r.k },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => K.nav(r.href) },
h('strong', null, r.icon + ' ' + r.label), h('span', { class: 'bds-sub' }, r.n + ' mục')),
h('div', { class: 'bds-acts' }, K.button('Mở', () => K.nav(r.href), { small: true, testid: 'home-todo-go-' + r.k }))))) });
}

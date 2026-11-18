import { kit, h, selftestCommon } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import { groupBySlot, slotHeader } from '../../../core/slots.f531f1a378.js';
import { DRAFT_LABEL } from '../_lib/staff.js';
import { ENGINE_URL } from '../_lib/video.js';
const _o0 = [
['lead', '👤 Khách mới chưa xử lý'],
['zalo', '✉️ Nháp tin Zalo chờ gửi'],
['policy', '📄 Chính sách AI đọc – chờ duyệt'],
['job', '🎬 Video / việc AI chờ duyệt'],
['idea', '💡 Ý tưởng mới'],
];
export async function mount(el, ctx) {
const _o1 = kit(ctx);
el.innerHTML = '';
const _o3 = h('div', { class: 'bds-screen', 'data-testid': 'inbox' });
el.appendChild(_o3);
async function _ob() {
const [customers, events, policies, jobs, ideas, settingsDrafts] = await Promise.all([
_o1.list('objects'), _o1.list('events'), _o1.list('policies'), _o1.list('jobs'), _o1.list('ideas'), _o1.setting('zalo_drafts', [])]);
const perms = (ctx.user && ctx.user.perms) || null;
const _oe = !(ctx.packs && !ctx.packs.enabled('video'));
const _o7 = (ctx.video && ctx.video.hidden()) || (perms && perms.video === false);
const _o4 = (j) => (ctx.video ? ctx.video.isVideoJob(j) : /^(video|ai_clip|scene|studio|render)/.test(String((j && j.type) || '')));
const vjobs = _o7 ? jobs.filter(j => !_o4(j)) : jobs;
const vIdeas = perms && perms.ideas === false ? [] : ideas;
const _o8 = !(perms && perms.policy === 'view');
const items = crm.inboxItems({ customers, events, policies: _o8 ? policies : [], jobs: _oe ? vjobs : [], ideas: _oe ? vIdeas : [], settingsDrafts: Array.isArray(settingsDrafts) ? settingsDrafts : [] });
const byId = new Map(crm.activeCustomers(customers).map(c => [c.id, c]));
_o3.innerHTML = '';
_o3.appendChild(h('div', { class: 'bds-head' }, h('h2', null, 'Chờ duyệt (' + items.length + ')')));
if (!items.length) { _o3.appendChild(_o1.empty('Không có việc chờ duyệt.')); return; }
const engineOff = !!(ctx.video && (typeof ctx.video.engineOff === 'function' ? ctx.video.engineOff() : ctx.video.hidden()));
const _od = _oe && !_o7 && !engineOff;
const timeOf = (it) => Number(it.ref.updated_at || it.ref.created_at || it.ref.at) || Date.now();
if (_od) _o3.appendChild(h('p', { class: 'bds-sub', 'data-testid': 'inbox-slots' }, groupBySlot(items, Date.now(), { timeOf }).map(g => g.label + ': ' + g.items.length).join(' · ')));
for (const [kind, title] of _o0) {
const list = items.filter(i => i.kind === kind);
if (!list.length) continue;
const _o9 = _od ? groupBySlot(list, Date.now(), { timeOf }).map(g => [slotHeader(h, g), ...g.items.map(it => _o5(_o1, it, byId, _ob))]) : [list.map(it => _o5(_o1, it, byId, _ob))];
_o3.appendChild(_o1.card({ title: title + ' (' + list.length + ')', testid: 'inbox-' + kind,
body: h('div', { class: 'bds-list' }, _o9.flat()) }));
}
}
await _ob();
_o1.on(el, ['objects', 'events', 'policies', 'jobs', 'ideas', 'settings'], _ob);
}
function _o5(_o1, it, byId, refresh) {
const ctx = _o1.ctx;
const r = it.ref;
const cust = it.kind === 'lead' ? r : byId.get(r.object_id);
let _o2, reject, open, approveLabel = 'Duyệt';
if (it.kind === 'lead') {
approveLabel = 'Đã xử lý';
_o2 = async () => { await _o1.put('objects', { ...r, data: JSON.stringify({ ...crm.parseData(r.data), handled: 1 }) }); await _o1.logEvent(r.id, 'note', 'Đã xử lý khách mới'); };
reject = async () => {
const _o6 = _o1.statuses(r.need).find(s => /không tiềm năng|dừng/i.test(s)) || 'Không tiềm năng';
await _o1.put('objects', { ...r, status: _o6, data: JSON.stringify({ ...crm.parseData(r.data), handled: 1 }) });
await _o1.logEvent(r.id, 'status', (r.status || 'Mới') + ' → ' + _o6);
};
open = () => _o1.openProfile(r.id);
} else if (it.kind === 'zalo') {
approveLabel = 'Gửi';
_o2 = async () => {
if (!cust) { await _o1.copy(r.text || ''); _o1.toast('Đã chép tin', 'success'); const _og = await import('../zalo/index.js'); await _og.markDraft(_o1, r.id, 'sent'); return; }
const _og = await import('../zalo/index.js');
_og.openComposer(ctx, cust, { text: r.text || '', draftId: r.id, onSent: refresh });
return 'keep';
};
reject = async () => { const _og = await import('../zalo/index.js'); await _og.markDraft(_o1, r.id, 'dismissed'); };
open = cust ? () => _o1.openProfile(cust.id) : null;
} else if (it.kind === 'policy') {
const _oa = '#/sales/policy?id=' + encodeURIComponent(r.id);
_o2 = () => { _o1.nav(_oa); return 'keep'; };
approveLabel = 'Xem & duyệt';
reject = async () => { await _o1.put('policies', { ...r, deleted: 1 }); };
open = () => _o1.nav(_oa);
} else if (it.kind === 'job') {
_o2 = async () => { await _o1.put('jobs', { ...r, status: 'queued' }); };
reject = async () => { await _o1.put('jobs', { ...r, status: 'error', output: JSON.stringify({ ...crm.parseData(r.output), rejected: 1, reason: 'Chủ app bỏ' }) }); };
open = () => _o1.nav('#/content/' + (String(r.type || '').startsWith('video') ? 'video' : 'jobs') + '?job=' + encodeURIComponent(r.id));
} else if (it.kind === 'idea') {
_o2 = async () => { await _o1.put('ideas', { ...r, status: 'approved' }); };
reject = async () => { await _o1.put('ideas', { ...r, status: 'rejected' }); };
open = () => (r.url ? window.open(r.url, '_blank', 'noopener') : _o1.nav('#/content/ideas?id=' + encodeURIComponent(r.id)));
}
const _of = async (fn, msg) => {
try { const _oc = await fn(); if (_oc !== 'keep') { _o1.toast(msg, 'success'); refresh(); } }
catch (e) { _o1.toast((e && e.message) || 'Chưa lưu được', 'warn'); }
};
const draft = it.kind === 'job' ? (crm.parseData(r.output).draft || null) : null;
const sub = [draft ? DRAFT_LABEL[draft.state] || '' : '', it.kind === 'lead' ? [_o1.projectName(r.project), _o1.phone(r.phone)].filter(Boolean).join(' · ') : it.sub, it.kind !== 'lead' && cust ? cust.name : '', it.kind === 'policy' ? _o1.projectName(r.project_id) : ''].filter(Boolean).join(' · ');
return h('div', { class: 'bds-item', 'data-testid': 'inbox-item-' + r.id },
h('div', { class: 'bds-row-main' }, h('strong', null, it.kind === 'lead' ? (r.name || 'Khách mới') : it.title), h('span', { class: 'bds-sub' }, sub)),
h('div', { class: 'bds-acts bds-wrap' },
it.kind === 'lead' ? _o1.callBtn(r, { short: true }) : null,
draft && draft.state === 'done' && draft.file ? _o1.linkBtn('▶ Xem nháp', ((ctx.config && ctx.config.ENGINE_URL) || ENGINE_URL) + draft.file, null, { target: '_blank', testid: 'draft-' + r.id }) : null,
_o1.button(approveLabel, () => _of(_o2, 'Đã duyệt'), { kind: 'primary', testid: 'approve-' + r.id }),
_o1.button('Bỏ', () => _of(reject, 'Đã bỏ'), { testid: 'reject-' + r.id }),
open ? _o1.button('Mở', open, { testid: 'open-item-' + r.id }) : null));
}
export default {
manifest: {
id: 'inbox', title: 'Chờ duyệt', icon: '📥', screen: 'inbox', order: 10, version: '1.0.0', status: 'ready',
help: 'Mọi thứ cần anh/chị quyết: khách mới, tin Zalo nháp, chính sách AI đọc, ý tưởng (và video khi bật Video).',
},
mount,
async selftest(ctx) {
return selftestCommon(ctx, ['fmt.money', 'link.tel'], div => mount(div, ctx));
},
};

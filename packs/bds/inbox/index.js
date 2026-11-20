import { kit, h, selftestCommon } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import { groupBySlot, slotHeader } from '../../../core/slots.f531f1a378.js';
import { DRAFT_LABEL } from '../_lib/staff.js';
import { ENGINE_URL } from '../_lib/video.js';
import { deskCard, deskOptions, staffShipped } from './desk_ui.js';
let _ok = null;
const _o0 = [
['lead', '👤 Khách mới chưa xử lý'],
['zalo', '✉️ Nháp tin Zalo chờ gửi'],
['policy', '📄 Chính sách AI đọc – chờ duyệt'],
['job', '🤖 Việc AI chờ duyệt'],
['idea', '💡 Ý tưởng mới'],
];
export async function mount(el, ctx) {
const _o1 = kit(ctx);
el.innerHTML = '';
const _o3 = h('div', { class: 'bds-screen', 'data-testid': 'inbox' });
el.appendChild(_o3);
const _o6 = h('h2', null, 'Chờ duyệt');
const _o9 = h('div', { class: 'bds-screen-list', style: 'display:flex;flex-direction:column;gap:inherit;min-width:0' });
let _o4 = null;
try { _o4 = deskCard(_o1, { onDone: () => render() }); } catch { _o4 = null; }
const _o5 = new Map();
_o3.append(h('div', { class: 'bds-head' }, _o6), ...(_o4 ? [_o4] : []), _o9);
async function render() {
const [customers, events, policies, jobs, ideas, settingsDrafts] = await Promise.all([
_o1.list('objects'), _o1.list('events'), _o1.list('policies'), _o1.list('jobs'), _o1.list('ideas'), _o1.setting('zalo_drafts', [])]);
const perms = (ctx.user && ctx.user.perms) || null;
const _on = !(ctx.packs && !ctx.packs.enabled('video'));
const _oc = (ctx.video && ctx.video.hidden()) || (perms && perms.video === false);
const _o7 = (j) => (ctx.video ? ctx.video.isVideoJob(j) : /^(video|ai_clip|scene|studio|render)/.test(String((j && j.type) || '')));
const isStaff = (j) => String((j && j.type) || '') === 'staff_task';
const vjobs = (_oc ? jobs.filter(j => !_o7(j) && !isStaff(j)) : jobs).filter(j => _ok && staffShipped(ctx) || !isStaff(j));
const vIdeas = perms && perms.ideas === false ? [] : ideas;
const _of = !(perms && perms.policy === 'view');
const items = crm.inboxItems({ customers, events, policies: _of ? policies : [], jobs: _on ? vjobs : [], ideas: _on ? vIdeas : [], settingsDrafts: Array.isArray(settingsDrafts) ? settingsDrafts : [] });
const byId = new Map(crm.activeCustomers(customers).map(c => [c.id, c]));
_o9.innerHTML = '';
_o6.textContent = 'Chờ duyệt (' + items.length + ')';
if (!items.length) { _o9.appendChild(_o1.empty('Không có việc chờ duyệt.')); return; }
const engineOff = !!(ctx.video && (typeof ctx.video.engineOff === 'function' ? ctx.video.engineOff() : ctx.video.hidden()));
const _om = _on && !_oc && !engineOff;
const timeOf = (it) => Number(it.ref.updated_at || it.ref.created_at || it.ref.at) || Date.now();
if (_om) _o9.appendChild(h('p', { class: 'bds-sub', 'data-testid': 'inbox-slots' }, groupBySlot(items, Date.now(), { timeOf }).map(g => g.label + ': ' + g.items.length).join(' · ')));
for (const [kind, title] of _o0) {
const list = items.filter(i => i.kind === kind);
if (!list.length) continue;
const _og = _om ? groupBySlot(list, Date.now(), { timeOf }).map(g => [slotHeader(h, g), ...g.items.map(it => _o8(_o1, it, byId, render, _o5))]) : [list.map(it => _o8(_o1, it, byId, render, _o5))];
_o9.appendChild(_o1.card({ title: title + ' (' + list.length + ')', testid: 'inbox-' + kind,
body: h('div', { class: 'bds-list' }, _og.flat()) }));
}
}
await render();
_o1.on(el, ['objects', 'events', 'policies', 'jobs', 'ideas', 'settings'], render);
const _oi = ctx.route && ctx.route.query;
if (_o4 && _oi && _oi.get && _oi.get('desk')) _o4.focusDesk();
}
function _o8(_o1, it, byId, refresh, _o5 = new Map()) {
const ctx = _o1.ctx;
const r = it.ref;
const cust = it.kind === 'lead' ? r : byId.get(r.object_id);
let _o2, reject, open, approveLabel = 'Duyệt', rejectLabel = 'Bỏ', editBox = null;
if (it.kind === 'lead') {
approveLabel = 'Đã xử lý';
_o2 = async () => { await _o1.put('objects', { ...r, data: JSON.stringify({ ...crm.parseData(r.data), handled: 1 }) }); await _o1.logEvent(r.id, 'note', 'Đã xử lý khách mới'); };
reject = async () => {
const _oa = _o1.statuses(r.need).find(s => /không tiềm năng|dừng/i.test(s)) || 'Không tiềm năng';
await _o1.put('objects', { ...r, status: _oa, data: JSON.stringify({ ...crm.parseData(r.data), handled: 1 }) });
await _o1.logEvent(r.id, 'status', (r.status || 'Mới') + ' → ' + _oa);
};
open = () => _o1.openProfile(r.id);
} else if (it.kind === 'zalo') {
approveLabel = 'Gửi';
_o2 = async () => {
if (!cust) { await _o1.copy(r.text || ''); _o1.toast('Đã chép tin', 'success'); const _op = await import('../zalo/index.js'); await _op.markDraft(_o1, r.id, 'sent'); return; }
const _op = await import('../zalo/index.js');
_op.openComposer(ctx, cust, { text: r.text || '', draftId: r.id, onSent: refresh });
return 'keep';
};
reject = async () => { const _op = await import('../zalo/index.js'); await _op.markDraft(_o1, r.id, 'dismissed'); };
open = cust ? () => _o1.openProfile(cust.id) : null;
} else if (it.kind === 'policy') {
const _oh = '#/sales/policy?id=' + encodeURIComponent(r.id);
_o2 = () => { _o1.nav(_oh); return 'keep'; };
approveLabel = 'Xem & duyệt';
reject = async () => { await _o1.put('policies', { ...r, deleted: 1 }); };
open = () => _o1.nav(_oh);
} else if (it.kind === 'job' && r.type === 'staff_task') {
const _oe = crm.parseData(r.output);
const _od = String(_oe.final_text || _oe.text || '');
const _ol = h('textarea', { rows: 6, style: 'width:100%;box-sizing:border-box;max-width:100%', 'data-testid': 'inbox-text-' + r.id, 'aria-label': 'Bài của nhân viên (sửa nếu cần)' });
_ol.value = _o5.has(r.id) ? _o5.get(r.id) : _od;
_ol.addEventListener('input', () => _o5.set(r.id, _ol.value));
const dOpts = deskOptions(_o1, r, _ol);
editBox = h('details', { class: 'inbox-edit', style: 'grid-column:1/-1;min-width:0', open: dOpts || _o5.has(r.id) ? true : null }, h('summary', null, dOpts ? 'Phương án trả lời' : 'Xem / sửa bài'), dOpts, _ol);
rejectLabel = 'Bác';
_o2 = async () => {
const [L] = await _ok();
const _ob = await L.approveRow(_o1, r, _ol.value);
_o5.delete(r.id);
if (_ob.kind) { _o1.toast(L.LEARN_TOAST, 'success'); refresh(); return 'keep'; }
};
reject = async () => {
const [L, U] = await _ok();
const reason = await U.askRejectReason(_o1);
if (reason === null) return 'keep';
await L.rejectRow(_o1, r, reason);
_o5.delete(r.id);
};
open = () => _o1.nav('#/home/staff?task=' + encodeURIComponent(r.id));
} else if (it.kind === 'job') {
_o2 = async () => { await _o1.put('jobs', { ...r, status: 'queued' }); };
reject = async () => { await _o1.put('jobs', { ...r, status: 'error', output: JSON.stringify({ ...crm.parseData(r.output), rejected: 1, reason: 'Chủ app bỏ' }) }); };
open = () => _o1.nav('#/content/' + (String(r.type || '').startsWith('video') ? 'video' : 'jobs') + '?job=' + encodeURIComponent(r.id));
} else if (it.kind === 'idea') {
_o2 = async () => { await _o1.put('ideas', { ...r, status: 'approved' }); };
reject = async () => { await _o1.put('ideas', { ...r, status: 'rejected' }); };
open = () => (r.url ? window.open(r.url, '_blank', 'noopener') : _o1.nav('#/content/ideas?id=' + encodeURIComponent(r.id)));
}
const _oo = async (fn, msg) => {
try { const _oj = await fn(); if (_oj !== 'keep') { _o1.toast(msg, 'success'); refresh(); } }
catch (e) { _o1.toast((e && e.message) || 'Chưa lưu được', 'warn'); }
};
const draft = it.kind === 'job' ? (crm.parseData(r.output).draft || null) : null;
const sub = [draft ? DRAFT_LABEL[draft.state] || '' : '', it.kind === 'lead' ? [_o1.projectName(r.project), _o1.phone(r.phone)].filter(Boolean).join(' · ') : it.sub, it.kind !== 'lead' && cust ? cust.name : '', it.kind === 'policy' ? _o1.projectName(r.project_id) : ''].filter(Boolean).join(' · ');
return h('div', { class: 'bds-item', 'data-testid': 'inbox-item-' + r.id },
h('div', { class: 'bds-row-main' }, h('strong', null, it.kind === 'lead' ? (r.name || 'Khách mới') : it.title), h('span', { class: 'bds-sub' }, sub)),
h('div', { class: 'bds-acts bds-wrap' },
it.kind === 'lead' ? _o1.callBtn(r, { short: true }) : null,
draft && draft.state === 'done' && draft.file ? _o1.linkBtn('▶ Xem nháp', ((ctx.config && ctx.config.ENGINE_URL) || ENGINE_URL) + draft.file, null, { target: '_blank', testid: 'draft-' + r.id }) : null,
_o1.button(approveLabel, () => _oo(_o2, 'Đã duyệt'), { kind: 'primary', testid: 'approve-' + r.id }),
_o1.button(rejectLabel, () => _oo(reject, rejectLabel === 'Bác' ? 'Đã bác' : 'Đã bỏ'), { testid: 'reject-' + r.id }),
open ? _o1.button('Mở', open, { testid: 'open-item-' + r.id }) : null),
editBox);
}
export default {
manifest: {
id: 'inbox', title: 'Chờ duyệt', icon: '📥', screen: 'inbox', order: 10, version: '1.0.0', status: 'ready',
help: 'Mọi thứ cần anh/chị quyết: khách mới, tin Zalo nháp, chính sách AI đọc, ý tưởng.',
},
mount,
async selftest(ctx) {
return selftestCommon(ctx, ['fmt.money', 'link.tel'], div => mount(div, ctx));
},
};

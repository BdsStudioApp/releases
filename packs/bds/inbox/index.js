import { kit, h, selftestCommon } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import { groupBySlot, slotHeader } from '../../../core/slots.f531f1a378.js';
const _o0 = { queued: 'Nháp 480p: chờ máy dựng', running: 'Nháp 480p: đang dựng', done: 'Nháp 480p xong', error: 'Nháp 480p lỗi' };
import { ENGINE_URL } from '../_lib/video.js';
import { deskCard, deskOptions, staffShipped } from './desk_ui.js';
let _og = null;
_og = () => Promise.all([import('../staff/memory_learn.js'), import('../staff/memory_ui.js')]);
const GROUPS = [
['lead', '👤 Khách mới chưa xử lý'],
['zalo', '✉️ Nháp tin Zalo chờ gửi'],
['job', '🎬 Video / việc AI chờ duyệt'],
];
export async function pendingItems(_o1, ctx) {
const [customers, events, jobs, settingsDrafts] = await Promise.all([
_o1.list('objects'), _o1.list('events'), _o1.list('jobs'), _o1.setting('zalo_drafts', [])]);
const perms = (ctx.user && ctx.user.perms) || null;
const vOn = !(ctx.packs && !ctx.packs.enabled('video'));
const noVid = !!((ctx.video && ctx.video.hidden()) || (perms && perms.video === false));
const _o6 = (j) => (ctx.video ? ctx.video.isVideoJob(j) : /^(video|ai_clip|scene|studio|render)/.test(String((j && j.type) || '')));
const isStaff = (j) => String((j && j.type) || '') === 'staff_task';
const vjobs = (noVid ? jobs.filter(j => !_o6(j) && !isStaff(j)) : jobs).filter(j => _og && staffShipped(ctx) || !isStaff(j));
const items = crm.inboxItems({ customers, events, policies: [] , jobs: vOn ? vjobs : [], ideas: [] , settingsDrafts: Array.isArray(settingsDrafts) ? settingsDrafts : [] });
const engineOff = !!(ctx.video && (typeof ctx.video.engineOff === 'function' ? ctx.video.engineOff() : ctx.video.hidden()));
return { items, customers, vOn, noVid, engineOff };
}
export async function mount(el, ctx) {
const _o1 = kit(ctx);
el.innerHTML = '';
const box = h('div', { class: 'bds-screen', 'data-testid': 'inbox' });
el.appendChild(box);
const _o5 = h('h2', null, 'Việc cần duyệt');
const _o8 = h('div', { class: 'bds-screen-list', style: 'display:flex;flex-direction:column;gap:inherit;min-width:0' });
let _o3 = null;
try { _o3 = deskCard(_o1, { onDone: () => render() }); } catch { _o3 = null; }
const _o4 = new Map();
box.append(h('div', { class: 'bds-head' }, _o5), ...(_o3 ? [_o3] : []), _o8);
async function render() {
const { items, customers, engineOff, vOn, noVid } = await pendingItems(_o1, ctx);
const byId = new Map(crm.activeCustomers(customers).map(c => [c.id, c]));
_o8.innerHTML = '';
_o5.textContent = 'Việc cần duyệt (' + items.length + ')';
if (!items.length) { _o8.appendChild(_o1.empty('Không có việc chờ duyệt.')); return; }
const _oi = vOn && !noVid && !engineOff;
const timeOf = (it) => Number(it.ref.updated_at || it.ref.created_at || it.ref.at) || Date.now();
if (_oi) _o8.appendChild(h('p', { class: 'bds-sub', 'data-testid': 'inbox-slots' }, groupBySlot(items, Date.now(), { timeOf }).map(g => g.label + ': ' + g.items.length).join(' · ')));
for (const [kind, title] of GROUPS) {
const list = items.filter(i => i.kind === kind);
if (!list.length) continue;
const _od = _oi ? groupBySlot(list, Date.now(), { timeOf }).map(g => [slotHeader(h, g), ...g.items.map(it => _o7(_o1, it, byId, render, _o4))]) : [list.map(it => _o7(_o1, it, byId, render, _o4))];
_o8.appendChild(_o1.card({ title: title + ' (' + list.length + ')', testid: 'inbox-' + kind,
body: h('div', { class: 'bds-list' }, _od.flat()) }));
}
}
await render();
_o1.on(el, ['objects', 'events', 'jobs', 'ideas', 'settings'], render);
const _oe = ctx.route && ctx.route.query;
if (_o3 && _oe && _oe.get && _oe.get('desk')) _o3.focusDesk();
}
function _o7(_o1, it, byId, refresh, _o4 = new Map()) {
const ctx = _o1.ctx;
const r = it.ref;
const cust = it.kind === 'lead' ? r : byId.get(r.object_id);
let _o2, reject, open, approveLabel = 'Duyệt', rejectLabel = 'Bỏ', editBox = null;
if (it.kind === 'lead') {
approveLabel = 'Đã xử lý';
_o2 = async () => { await _o1.put('objects', { ...r, data: JSON.stringify({ ...crm.parseData(r.data), handled: 1 }) }); await _o1.logEvent(r.id, 'note', 'Đã xử lý khách mới'); };
reject = async () => {
const _o9 = _o1.statuses(r.need).find(s => /không tiềm năng|dừng/i.test(s)) || 'Không tiềm năng';
await _o1.put('objects', { ...r, status: _o9, data: JSON.stringify({ ...crm.parseData(r.data), handled: 1 }) });
await _o1.logEvent(r.id, 'status', (r.status || 'Mới') + ' → ' + _o9);
};
open = () => _o1.openProfile(r.id);
} else if (it.kind === 'zalo') {
approveLabel = 'Gửi';
_o2 = async () => {
if (!cust) { await _o1.copy(r.text || ''); _o1.toast('Đã chép tin', 'success'); const _ok = await import('../zalo/index.js'); await _ok.markDraft(_o1, r.id, 'sent'); return; }
const _ok = await import('../zalo/index.js');
_ok.openComposer(ctx, cust, { text: r.text || '', draftId: r.id, onSent: refresh });
return 'keep';
};
reject = async () => { const _ok = await import('../zalo/index.js'); await _ok.markDraft(_o1, r.id, 'dismissed'); };
open = cust ? () => _o1.openProfile(cust.id) : null;
} else if (it.kind === 'job' && r.type === 'staff_task') {
const _oc = crm.parseData(r.output);
const _ob = String(_oc.final_text || _oc.text || '');
const _oh = h('textarea', { rows: 6, style: 'width:100%;box-sizing:border-box;max-width:100%', 'data-testid': 'inbox-text-' + r.id, 'aria-label': 'Bài của nhân viên (sửa nếu cần)' });
_oh.value = _o4.has(r.id) ? _o4.get(r.id) : _ob;
_oh.addEventListener('input', () => _o4.set(r.id, _oh.value));
const dOpts = deskOptions(_o1, r, _oh);
editBox = h('details', { class: 'inbox-edit', style: 'grid-column:1/-1;min-width:0', open: dOpts || _o4.has(r.id) ? true : null }, h('summary', null, dOpts ? 'Phương án trả lời' : 'Xem / sửa bài'), dOpts, _oh);
rejectLabel = 'Bác';
_o2 = async () => {
const [L] = await _og();
const _oa = await L.approveRow(_o1, r, _oh.value);
_o4.delete(r.id);
if (_oa.kind) { _o1.toast(L.LEARN_TOAST, 'success'); refresh(); return 'keep'; }
};
reject = async () => {
const [L, U] = await _og();
const reason = await U.askRejectReason(_o1);
if (reason === null) return 'keep';
await L.rejectRow(_o1, r, reason);
_o4.delete(r.id);
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
const _oj = async (fn, msg) => {
try { const _of = await fn(); if (_of !== 'keep') { _o1.toast(msg, 'success'); refresh(); } }
catch (e) { _o1.toast((e && e.message) || 'Chưa lưu được', 'warn'); }
};
const draft = it.kind === 'job' ? (crm.parseData(r.output).draft || null) : null;
const sub = [draft ? _o0[draft.state] || '' : '', it.kind === 'lead' ? [_o1.projectName(r.project), _o1.phone(r.phone)].filter(Boolean).join(' · ') : it.sub, it.kind !== 'lead' && cust ? cust.name : ''].filter(Boolean).join(' · ');
return h('div', { class: 'bds-item', 'data-testid': 'inbox-item-' + r.id },
h('div', { class: 'bds-row-main' }, h('strong', null, it.kind === 'lead' ? (r.name || 'Khách mới') : it.title), h('span', { class: 'bds-sub' }, sub)),
h('div', { class: 'bds-acts bds-wrap' },
it.kind === 'lead' ? _o1.callBtn(r, { short: true }) : null,
draft && draft.state === 'done' && draft.file ? _o1.linkBtn('▶ Xem nháp', ((ctx.config && ctx.config.ENGINE_URL) || ENGINE_URL) + draft.file, null, { target: '_blank', testid: 'draft-' + r.id }) : null,
_o1.button(approveLabel, () => _oj(_o2, 'Đã duyệt'), { kind: 'primary', testid: 'approve-' + r.id }),
_o1.button(rejectLabel, () => _oj(reject, rejectLabel === 'Bác' ? 'Đã bác' : 'Đã bỏ'), { testid: 'reject-' + r.id }),
open ? _o1.button('Mở', open, { testid: 'open-item-' + r.id }) : null),
editBox);
}
export default {
manifest: {
id: 'inbox', title: 'Việc cần duyệt', icon: '📥', screen: 'home', order: 10, version: '1.0.0', status: 'ready', hidden: true,
help: 'Việc cần anh/chị quyết: khách mới, tin Zalo nháp, video và kết quả nhân viên AI chờ duyệt. Mở từ thẻ "Cần anh/chị xử lý" ở Bảng tin.',
},
mount,
async selftest(ctx) {
return selftestCommon(ctx, ['fmt.money', 'link.tel'], div => mount(div, ctx));
},
};

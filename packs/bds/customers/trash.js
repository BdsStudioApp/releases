import { h } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import * as LP from '../_lib/lead_pool.js';
export const TRASH_DAYS = 30;
const DAY = 86400000;
const _o3 = (c) => Number(crm.parseData(c && c.data).erased) === 1;
const _o2 = (c) => !!c && (!c.kind || c.kind === 'customer');
export function canDelete(ctx, c) {
if (!c || !_o2(c) || _o3(c)) return false;
const _o8 = ctx && ctx.user;
if (!_o8 || _o8.legacy) return true;
const P = _o8.perms || {};
if (_o8.role === 'owner' || P.erase) return true;
if (LP.isCompanyLead(c)) return false;
return _o8.role !== 'ctv' && !!c.owner && String(c.owner) === String(_o8.id);
}
export function trashList(rows, now = Date.now()) {
return (rows || []).filter((c) => _o2(c) && Number(c.deleted) === 1 && !_o3(c) && c.name && Number(c.updated_at || 0) >= now - TRASH_DAYS * DAY)
.sort((a, b) => Number(b.updated_at || 0) - Number(a.updated_at || 0));
}
export const daysLeft = (c, now = Date.now()) => Math.max(0, Math.ceil((Number(c.updated_at || 0) + TRASH_DAYS * DAY - now) / DAY));
async function _o7(K, rows, deleted) {
let _o4 = 0;
for (const c of rows) { await K.put('objects', { ...c, deleted }); _o4++; }
try { if (K.ctx.store && typeof K.ctx.store.syncNow === 'function') K.ctx.store.syncNow(); } catch { }
return _o4;
}
export async function deleteCustomers(K, ctx, rows) {
const list = (rows || []).filter((c) => canDelete(ctx, c));
const _o1 = (rows || []).length - list.length;
if (!list.length) { K.toast(_o1 ? 'Anh/chị chỉ xoá được khách mình phụ trách (số công ty cấp: Quản trị xoá).' : 'Chọn ít nhất một khách', 'warn'); return 0; }
const _o5 = list.length === 1;
const ok = await K.confirm({ title: _o5 ? 'Xoá khách "' + (list[0].name || '') + '"?' : 'Xoá ' + list.length + ' khách?', kind: 'danger', ok: 'Xoá', testid: 'cust-del-confirm',
text: (_o5 ? 'Khách' : list.length + ' khách') + ' chuyển vào Thùng rác (giữ ' + TRASH_DAYS + ' ngày, khôi phục được ở ⋯ Thêm › Thùng rác). Sheet Google cũng đánh dấu đã xoá.'
+ (_o1 ? ' ' + _o1 + ' khách không thuộc quyền của anh/chị sẽ giữ nguyên.' : '') });
if (!ok) return 0;
const _o4 = await _o7(K, list, 1);
const t = K.toast('Đã chuyển ' + _o4 + ' khách vào Thùng rác', 'success');
try {
if (t && t.appendChild) {
t.setAttribute('data-testid', 'cust-del-toast');
if (t._tt) { clearTimeout(t._tt); t._tt = setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 260); }, 8000); }
t.appendChild(h('button', { type: 'button', class: 'btn btn-ghost btn-sm', 'data-testid': 'cust-del-undo', onclick: async () => { t.remove(); await _o7(K, list, 0); K.toast('Đã hoàn tác – khách trở lại danh sách', 'success'); } }, 'Hoàn tác'));
}
} catch { }
return _o4;
}
export async function openTrash(K, ctx) {
let _o0 = [];
try { _o0 = await ctx.store.list('objects', null, { includeDeleted: true }); } catch { _o0 = []; }
let rows = trashList(_o0).filter((c) => canDelete(ctx, { ...c, deleted: 0 }));
const box = h('div', { 'data-testid': 'cust-trash' });
const _o6 = () => box.replaceChildren(
h('p', { class: 'bds-muted' }, 'Khách đã xoá được giữ ' + TRASH_DAYS + ' ngày. Khôi phục thì khách trở lại danh sách và Sheet như cũ.'),
rows.length ? h('div', { class: 'bds-list' }, ...rows.map((c) => h('div', { class: 'bds-item', 'data-testid': 'trash-' + c.id },
h('div', { class: 'bds-row-main' }, h('strong', null, c.name || '(chưa có tên)'), h('span', { class: 'bds-sub' }, [K.phone(c.phone), K.projectName(c.project)].filter(Boolean).join(' · ') + ' · còn ' + daysLeft(c) + ' ngày')),
K.button('Khôi phục', async () => { await _o7(K, [c], 0); rows = rows.filter((x) => x !== c); _o6(); K.toast('Đã khôi phục ' + (c.name || 'khách'), 'success'); }, { kind: 'ghost', icon: 'refresh', testid: 'trash-restore-' + c.id }))))
: K.empty('Thùng rác trống.'),
rows.length > 1 ? h('div', { class: 'bds-row bds-end' }, K.button('Khôi phục tất cả (' + rows.length + ')', async () => { const _o4 = await _o7(K, rows, 0); rows = []; _o6(); K.toast('Đã khôi phục ' + _o4 + ' khách', 'success'); }, { kind: 'primary', icon: 'refresh', testid: 'trash-restore-all' })) : null);
_o6();
return K.modal({ title: 'Thùng rác khách hàng', testid: 'cust-trash-modal', body: [box] });
}

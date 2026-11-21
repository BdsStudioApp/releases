import { kit, h } from '../_lib/kit.js';
import * as L from './logic.js';
const errText = (e, fb) => (e && (e.userMessage || e.message)) || fb;
const _o0 = 'bds-members-css';
export function ensureMembersCss() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
const _oc = document.createElement('link');
_oc.id = _o0; _oc.rel = 'stylesheet';
_oc.href = new URL('./members.css', import.meta.url).href;
document.head.appendChild(_oc);
}
export async function loadMembers(_o1) {
try { const _ow = await _o1.api('members.data_status', {}); return { members: (_ow && _ow.members) || [], status: _ow }; } catch (e) {
const r = await _o1.api('users.list', {});
const list = (Array.isArray(r) ? r : (r && (r.users || r.items)) || []).filter((u) => u && !Number(u.deleted));
return { members: list.map((u) => ({ id: u.id, username: u.username, full_name: u.full_name, role: u.role, status: u.status === 'locked' ? 'locked' : 'active' })), status: null };
}
}
export function memberPicker(_o1, members, opts = {}) {
const _ow = { dept: '', team: '', q: '' };
const _om = L.orgOptions(members);
const _ot = h('select', { 'aria-label': opts.label || 'Nhân viên', 'data-testid': opts.testid || 'mx-member', onchange: () => opts.onPick && opts.onPick(_ot.value) });
const fill = () => {
const _o3 = _ot.value || opts.value || '';
const list = L.filterMembers(members, _ow).filter((_of) => !(opts.exclude || []).includes(_of.id));
const o = [h('option', { value: '' , disabled: !opts.pool, selected: !_o3 && !opts.pool }, opts.pool ? '🏢 Kho chung (chưa thuộc ai)' : '— Chọn người —')];
for (const _of of list) o.push(h('option', { value: _of.id, selected: _of.id === _o3 }, L.memberName(_of) + ' · ' + (L.ROLE_VN[_of.role] || _of.role || '') + (_of.status === 'locked' ? ' (đã khoá)' : '') + (_of.dept ? ' · ' + _of.dept : '')));
_ot.replaceChildren(...o);
if (_o3 && list.some((_of) => _of.id === _o3)) _ot.value = _o3;
};
fill();
const _o9 = (key, values, label) => values.length ? _o1.select([['', label], ...values.map((_o13) => [_o13, _o13])], '', { 'aria-label': label, 'data-testid': 'mx-f-' + key, onchange: (e) => { _ow[key] = e.target.value; fill(); } }) : null;
const box = h('div', { class: 'mx-picker' },
h('div', { class: 'bds-filters' }, _o9('dept', _om.depts, 'Mọi phòng ban'), _o9('team', _om.teams, 'Mọi nhóm')),
_ot);
return { el: box, select: _ot, get value() { return _ot.value; }, set value(_o13) { _ot.value = _o13; } };
}
export async function openReassign(ctx, opts = {}) {
const _o1 = kit(ctx);
ensureMembersCss();
const flags = L.mxFlags(ctx.user);
const canPick = opts.canPick !== undefined ? opts.canPick : flags.view;
const { members } = await loadMembers(_o1);
const _op = Array.isArray(opts.preIds) ? opts.preIds.filter(Boolean) : [];
const _o13 = { from: opts.from !== undefined ? opts.from : null, to: '', mode: _op.length && canPick ? 'pick' : 'all', ids: _op.slice(), reason: opts.reason || '' };
let _o4 = null, step = 'form';
const body = h('div', { class: 'mx-reassign', 'data-testid': 'rs-modal' });
const _of = _o1.modal({ title: opts.title || 'Chuyển khách', body, wide: true });
const _oj = (id) => (id === '' ? 'Kho chung' : L.memberName(members.find((x) => x.id === id)) || 'người này');
const _oa = memberPicker(_o1, members, { value: _o13.from || '', pool: true, testid: 'rs-from', label: 'Chuyển khách của', onPick: (id) => { _o13.from = id; _o13.ids = []; _o4 = null; _o6(); } });
if (_o13.from !== null) _oa.value = _o13.from;
const _oz = memberPicker(_o1, members.filter((x) => x.status !== 'locked'), { testid: 'rs-to', label: 'Chuyển sang', onPick: (id) => { _o13.to = id; err.textContent = ''; } });
const reason = h('input', { value: _o13.reason, maxlength: 200, list: 'rs-reasons', placeholder: 'vd: Nhân viên nghỉ việc', 'data-testid': 'rs-reason', oninput: (e) => { _o13.reason = e.target.value; } });
const reasons = h('datalist', { id: 'rs-reasons' }, ['Nhân viên nghỉ việc', 'Chia lại khách theo khu vực', 'Khách xin đổi người chăm sóc'].map((x) => h('option', { value: x })));
const err = h('p', { class: 'bds-error', role: 'alert', 'data-testid': 'rs-error' });
const pickBox = h('div', { 'data-testid': 'rs-pick-box' });
const _oh = h('div', { class: 'bds-row bds-wrap', role: 'radiogroup', 'aria-label': 'Khách cần chuyển' });
async function _oe() {
if (_o4) return true;
if (_o13.from === null || !canPick) return false;
pickBox.replaceChildren(h('p', { class: 'bds-muted' }, 'Đang tải khách của ' + _oj(_o13.from) + '…'));
try {
const r = await _o1.api('members.view', { member_id: _o13.from, tables: ['objects'], limit: 2000 });
_o4 = L.liveCustomers(r && r.changes && r.changes.objects);
return true;
} catch (e) { pickBox.replaceChildren(h('p', { class: 'bds-error' }, errText(e, 'Chưa tải được danh sách khách.'))); return false; }
}
function _o8() {
if (_o13.mode !== 'pick') { pickBox.replaceChildren(); return; }
if (!_o4) { _oe().then((_ok) => { if (_ok) _o8(); }); return; }
const q = h('input', { type: 'search', placeholder: 'Lọc tên, số…', 'aria-label': 'Lọc khách', 'data-testid': 'rs-pick-q' });
const list = h('div', { class: 'mx-pick-list' });
const count = h('strong', { 'data-testid': 'rs-picked' }, String(_o13.ids.length));
const _on = () => {
const _or = L.filterLocal(_o4, q.value).slice(0, 300);
list.replaceChildren(...(_or.length ? _or.map((c) => h('label', { class: 'mx-pick' },
h('input', { type: 'checkbox', checked: _o13.ids.includes(c.id), 'data-testid': 'rs-pick-' + c.id, onchange: (e) => { if (e.target.checked) { if (!_o13.ids.includes(c.id)) _o13.ids.push(c.id); } else _o13.ids = _o13.ids.filter((x) => x !== c.id); count.textContent = String(_o13.ids.length); } }),
h('span', null, h('strong', null, c.name || '(chưa có tên)'), h('small', { class: 'bds-muted' }, ' ' + L.maskPhone(c.phone))))) : [_o1.empty(_o4.length ? 'Không có khách khớp.' : _oj(_o13.from) + ' chưa có khách nào.')]));
};
q.addEventListener('input', _on);
_on();
pickBox.replaceChildren(h('p', { class: 'bds-muted' }, 'Đã chọn ', count, ' / ' + _o4.length + ' khách'), q, list);
}
function _o7() {
const _ol = (k, label, ic) => _o1.button(label, () => { _o13.mode = k; _o7(); _o8(); }, { kind: _o13.mode === k ? 'primary' : 'ghost', icon: ic, testid: 'rs-mode-' + k });
_oh.replaceChildren(_ol('all', 'Tất cả khách', 'customers'), canPick ? _ol('pick', 'Chọn từng khách', 'check') : null);
}
function _o6() {
if (step === 'form') {
_o7(); _o8();
body.replaceChildren(
_o1.field('Chuyển khách của', _oa.el),
_o1.field('Sang', _oz.el),
h('div', null, h('span', { class: 'bds-field-l' }, 'Khách cần chuyển'), _oh), pickBox,
_o1.field('Lý do (bắt buộc – ghi vào nhật ký)', reason), reasons, err,
h('div', { class: 'bds-row bds-end' },
_o1.button('Huỷ', () => _of.close(), { icon: 'x', testid: 'rs-cancel' }),
_o1.button('Tiếp tục', () => next(), { kind: 'primary', icon: 'next', testid: 'rs-next' })));
}
}
async function next() {
_o13.from = _oa.value; _o13.to = _oz.value;
if (_o13.from === undefined) _o13.from = null;
const e = L.validateReassign(_o13, members);
if (e) { err.textContent = e; return; }
let _o10 = null;
if (_o13.mode === 'all' && await _oe()) _o10 = _o4.length;
step = 'confirm';
body.replaceChildren(
h('p', { 'data-testid': 'rs-confirm-text' }, L.reassignConfirmText(_o13, _oj(_o13.from), _oj(_o13.to), _o10)),
err,
h('div', { class: 'bds-row bds-end' },
_o1.button('Quay lại', () => { step = 'form'; _o6(); }, { icon: 'back', testid: 'rs-back' }),
_o1.button('Chuyển khách', () => _oy(), { kind: 'primary', icon: 'send', testid: 'rs-submit' })));
}
async function _oy() {
err.textContent = '';
let r;
try { r = await _o1.api('members.reassign', L.reassignPayload(_o13)); } catch (e) { err.textContent = errText(e, 'Chưa chuyển được khách.'); return; }
step = 'done';
const _o11 = L.reassignResultText(r, _oj(_o13.from), _oj(_o13.to));
body.replaceChildren(
h('div', { class: 'mx-result', 'data-testid': 'rs-result' },
h('p', null, h('strong', null, _o11)),
h('dl', { class: 'bds-dl' }, h('dt', null, 'Khách đã chuyển'), h('dd', { 'data-testid': 'rs-moved' }, String(Number(r && r.moved) || 0)),
h('dt', null, 'Lịch sử, lịch hẹn, báo giá'), h('dd', { 'data-testid': 'rs-children' }, String(Number(r && r.children) || 0)))),
h('div', { class: 'bds-row bds-end' }, _o1.button('Xong', () => _of.close(), { kind: 'primary', icon: 'check', testid: 'rs-done' })));
_o1.toast(_o11, 'success');
try { if (opts.onDone) opts.onDone(r, _o13); } catch { }
}
_o6();
return _of;
}
export async function renderDupList(el, ctx, opts = {}) {
const _o1 = kit(ctx);
ensureMembersCss();
el.replaceChildren(h('p', { class: 'bds-muted' }, 'Đang tải…'));
let _or;
try { _or = L.dupRows(await _o1.api('members.dup_flags', {})); } catch (e) { el.replaceChildren(_o1.empty(errText(e, 'Chưa tải được danh sách số trùng.'))); return; }
const _o12 = _or.filter((r) => !r.seen).length;
const _ov = (r, s, tag) => h('div', { class: 'mx-dup-side' },
h('span', null, h('strong', null, s.memberName), s.customerName ? ' – ' + s.customerName : ''),
s.member && s.customer && opts.onView ? _o1.button('Xem (chỉ xem)', () => opts.onView(s.member, s.customer), { kind: 'ghost', icon: 'user', testid: 'dup-view-' + tag + '-' + r.key }) : null);
el.replaceChildren(
h('p', { class: 'bds-muted', 'data-testid': 'dup-count' }, _or.length ? _or.length + ' lần trùng số · ' + _o12 + ' chưa xem. Máy chủ không chặn – chỉ báo để Quản trị xử lý (giữ 40 lần gần nhất).' : ''),
_o12 > 1 ? h('div', { class: 'bds-row' }, _o1.button('Đánh dấu đã xem tất cả', async () => { await _o1.api('members.dup_seen', { all: true }); renderDupList(el, ctx, opts); }, { icon: 'check', testid: 'dup-seen-all' })) : null,
h('div', { class: 'bds-list', 'data-testid': 'dup-list' }, _or.length ? _or.map((r) => h('div', { class: 'bds-item mx-dup' + (r.seen ? ' mx-seen' : ''), 'data-testid': 'dup-row', 'data-key': r.key },
h('div', { class: 'mx-dup-head' }, h('strong', { class: 'mono', 'data-testid': 'dup-phone' }, '📞 ' + (r.phone || 'Số đã ẩn')), h('small', { class: 'bds-muted' }, L.fmtDateTime(r.at)),
r.seen ? _o1.badge('Đã xem', 'muted') : _o1.badge('Mới', 'warn')),
_ov(r, r.a, 'a'), _ov(r, r.b, 'b'),
r.seen ? null : h('div', { class: 'bds-row bds-end' }, _o1.button('Đã xem', async () => { await _o1.api('members.dup_seen', { key: r.key }); renderDupList(el, ctx, opts); }, { icon: 'check', testid: 'dup-seen-' + r.key }))))
: [_o1.empty('Chưa có số điện thoại nào trùng giữa nhân viên.')]));
}
export async function renderDataStatus(el, ctx, opts = {}) {
const _o1 = kit(ctx);
ensureMembersCss();
const flags = L.mxFlags(ctx.user);
const box = h('section', { class: 'bds-card mx-status', 'data-testid': 'mx-status' });
el.replaceChildren(box);
const head = (extra) => h('header', { class: 'bds-card-h' }, h('h3', null, '🔐 Tình trạng dữ liệu'), extra || null);
async function _od(check, fix) {
box.replaceChildren(head(), h('p', { class: 'bds-muted' }, check ? 'Đang kiểm quyền chia sẻ từng Sheet…' : 'Đang tải…'));
let _ow;
try { _ow = await _o1.api('members.data_status', check ? { check: true, fix: !!fix } : {}); } catch (e) { box.replaceChildren(head(), _o1.empty(errText(e, 'Chưa tải được tình trạng dữ liệu.'))); return; }
_o6(_ow, check);
if (fix) {
const _oi = (_ow.members || []).reduce((s, _of) => s + (Number(_of.fixed) || 0), 0);
_o1.toast(_oi ? 'Đã gỡ chia sẻ ở ' + _oi + ' chỗ – Sheet riêng chỉ còn tài khoản công ty' : 'Không có Sheet nào đang chia sẻ', 'success');
}
}
async function _os() {
let r = null;
for (let _ob = 0; _ob < 15; _ob++) {
r = await _o1.api('members.isolate_now', {});
if (!r || !r.more || r.error) break;
}
if (r && r.error) _o1.toast('Chưa tách xong: ' + r.error + ' – bấm lại sau ít phút', 'warn');
else if (r && r.phase === 'done') _o1.toast('Đã tách dữ liệu xong – mỗi nhân viên 1 Sheet riêng', 'success');
await _od(false);
}
function _o6(_ow, checked) {
if (L.freshCompany(_ow)) {
box.replaceChildren(head(), h('p', { 'data-testid': 'mx-phase', 'data-state': 'fresh' }, '✅ ' + L.FRESH_TEXT),
h('div', { class: 'bds-row bds-wrap' }, _o1.button('Tải lại', () => _od(false), { kind: 'ghost', icon: 'refresh', testid: 'mx-reload' })));
return;
}
const _oo = L.migrationPending(_ow);
const members = _ow.members || [];
const _ox = members.map((_of) => L.sheetState(_of));
const _o2 = _ox.includes('shared');
const tools = h('div', { class: 'bds-row bds-wrap' },
flags.admin && _oo ? _o1.button('Chạy tiếp tách dữ liệu', () => _os(), { kind: 'primary', icon: 'refresh', testid: 'mx-isolate' }) : null,
flags.admin && _ow.on ? _o1.button('Kiểm tra quyền chia sẻ', () => _od(true, false), { icon: 'shield', testid: 'mx-check' }) : null,
flags.admin && _ow.on && (_o2 || !checked) ? _o1.button('Sửa quyền chia sẻ', () => _od(true, true), { kind: _o2 ? 'primary' : 'ghost', icon: 'lock', testid: 'mx-fix' }) : null,
_o1.button('Tải lại', () => _od(false), { kind: 'ghost', icon: 'refresh', testid: 'mx-reload' }));
const _oq = L.reportLines(_ow.report);
box.replaceChildren(head(),
h('p', { 'data-testid': 'mx-phase' }, L.migrationText(_ow)),
_ow.on ? h('p', { class: 'bds-muted' }, 'Mỗi nhân viên 1 Sheet riêng trong thư mục "' + (_ow.folder || 'BDS Studio – Dữ liệu nhân viên') + '" (tài khoản công ty sở hữu, không chia sẻ cho ai). Quản trị xem khách của mọi người – chỉ xem – ở Khách hàng › Khách toàn công ty.') : null,
_oq.length ? h('div', { class: 'mx-report', 'data-testid': 'mx-report' }, h('strong', null, 'Báo cáo tách dữ liệu'), h('ul', null, _oq.map((x) => h('li', null, x)))) : null,
_ow.dup_flags ? h('p', { 'data-testid': 'mx-dup-note' }, '⚠️ ' + _ow.dup_flags + ' lần số điện thoại trùng giữa nhân viên – xem ở Khách hàng › Khách toàn công ty › Số trùng.') : null,
tools,
_ow.wanted || _ow.on ? h('div', { class: 'bds-list', 'data-testid': 'mx-members' }, members.map((_of, _ob) => _og(_of, _ox[_ob], _ow))) : null);
}
function _og(_of, state, _ow) {
const _ou = state === 'unknown' && !_ow.on ? (Number(_of.has_sheet) ? 'unknown' : 'missing') : state;
return h('div', { class: 'bds-item mx-mrow', 'data-testid': 'mx-row-' + (_of.username || _of.id), 'data-state': _ou },
h('div', { class: 'row-text' }, h('strong', null, L.memberName(_of)), h('small', { class: 'bds-muted' }, ' @' + (_of.username || '') + ' · ' + (L.ROLE_VN[_of.role] || _of.role || '') + (_of.dept ? ' · ' + _of.dept : '') + (_of.team ? ' · ' + _of.team : ''))),
_o1.badge(L.SHEET_LABEL[_ou] || _ou, L.SHEET_TONE[_ou] === 'ok' ? 'success' : L.SHEET_TONE[_ou] === 'danger' ? 'danger' : L.SHEET_TONE[_ou] === 'warn' ? 'warn' : 'muted'),
h('div', { class: 'bds-acts' },
_of.url ? _o1.linkBtn('📄 Mở Sheet', _of.url, null, { target: '_blank', testid: 'mx-open-' + _of.id }) : null,
flags.admin && (_ou === 'lost' || _ou === 'missing') && (_ow.on || _ow.wanted) ? _o1.button(_ou === 'lost' ? 'Tạo lại Sheet' : 'Tạo Sheet', async () => {
const _ok = await confirmBox(_o1, _ou === 'lost' ? 'Tạo lại Sheet cho ' + L.memberName(_of) + '?' : 'Tạo Sheet riêng cho ' + L.memberName(_of) + '?',
_ou === 'lost' ? 'Sheet cũ không mở được (bị xoá hoặc nằm trong Thùng rác Drive). Nếu còn trong Thùng rác, anh/chị khôi phục file đó thay vì tạo mới – Sheet mới sẽ TRỐNG, khách cũ chỉ lấy lại được từ Thùng rác hoặc bản sao lưu.' : 'Sheet mới nằm trong thư mục "BDS Studio – Dữ liệu nhân viên", tài khoản công ty sở hữu, không chia sẻ cho ai.',
_ou === 'lost' ? 'Tạo lại Sheet' : 'Tạo Sheet', 'mx-provision-confirm');
if (!_ok) return;
try { await _o1.api('members.provision', { member_id: _of.id, recreate: _ou === 'lost' }); _o1.toast('Đã tạo Sheet riêng cho ' + L.memberName(_of), 'success'); } catch (e) { _o1.toast(errText(e, 'Chưa tạo được Sheet'), 'danger'); }
_od(false);
}, { kind: _ou === 'lost' ? 'danger' : 'ghost', icon: 'plus', testid: 'mx-provision-' + _of.id }) : null,
opts.onReassign && L.mxFlags(ctx.user).move && _ow.on ? _o1.button('Chuyển khách', () => opts.onReassign(_of), { kind: 'ghost', icon: 'send', testid: 'mx-reassign-' + _of.id }) : null));
}
await _od(false);
}
export function confirmBox(_o1, title, text, okLabel, testid, kind = 'primary') {
return new Promise((res) => {
let _of;
const _o5 = (_o13) => { _of.close(); res(_o13); };
_of = _o1.modal({ title, testid, body: [h('p', null, text), h('div', { class: 'bds-row bds-end' },
_o1.button('Huỷ', () => _o5(false), { icon: 'x', testid: testid + '-cancel' }), _o1.button(okLabel, () => _o5(true), { kind, icon: 'check', testid: testid + '-ok' }))] });
});
}

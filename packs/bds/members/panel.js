import { kit, h } from '../_lib/kit.js';
import * as L from './logic.js';
const _oa = (e, fb) => (e && (e.userMessage || e.message)) || fb;
const _o0 = 'bds-members-css';
export function ensureMembersCss() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
const _oe = document.createElement('link');
_oe.id = _o0; _oe.rel = 'stylesheet';
_oe.href = new URL('./members.css', import.meta.url).href;
document.head.appendChild(_oe);
}
export async function loadMembers(_o1) {
try { const _oy = await _o1.api('members.data_status', {}); return { members: (_oy && _oy.members) || [], status: _oy }; } catch (e) {
const r = await _o1.api('users.list', {});
const list = (Array.isArray(r) ? r : (r && (r.users || r.items)) || []).filter((u) => u && !Number(u.deleted));
return { members: list.map((u) => ({ id: u.id, username: u.username, full_name: u.full_name, role: u.role, status: u.status === 'locked' ? 'locked' : 'active' })), status: null };
}
}
export function memberPicker(_o1, members, opts = {}) {
const _oy = { dept: '', team: '', q: '' };
const _oo = L.orgOptions(members);
const _ov = h('select', { 'aria-label': opts.label || 'Nhân viên', 'data-testid': opts.testid || 'mx-member', onchange: () => opts.onPick && opts.onPick(_ov.value) });
const fill = () => {
const _o4 = _ov.value || opts.value || '';
const list = L.filterMembers(members, _oy).filter((_oh) => !(opts.exclude || []).includes(_oh.id));
const o = [h('option', { value: '' , disabled: !opts.pool, selected: !_o4 && !opts.pool }, opts.pool ? '🏢 Kho chung (chưa thuộc ai)' : '— Chọn người —')];
for (const _oh of list) o.push(h('option', { value: _oh.id, selected: _oh.id === _o4 }, L.memberName(_oh) + ' · ' + (L.ROLE_VN[_oh.role] || _oh.role || '') + (_oh.status === 'locked' ? ' (đã khoá)' : '') + (_oh.dept ? ' · ' + _oh.dept : '')));
_ov.replaceChildren(...o);
if (_o4 && list.some((_oh) => _oh.id === _o4)) _ov.value = _o4;
};
fill();
const _ob = (key, values, label) => values.length ? _o1.select([['', label], ...values.map((_o15) => [_o15, _o15])], '', { 'aria-label': label, 'data-testid': 'mx-f-' + key, onchange: (e) => { _oy[key] = e.target.value; fill(); } }) : null;
const _o3 = h('div', { class: 'mx-picker' },
h('div', { class: 'bds-filters' }, _ob('dept', _oo.depts, 'Mọi phòng ban'), _ob('team', _oo.teams, 'Mọi nhóm')),
_ov);
return { el: _o3, select: _ov, get value() { return _ov.value; }, set value(_o15) { _ov.value = _o15; } };
}
export async function openReassign(ctx, opts = {}) {
const _o1 = kit(ctx);
ensureMembersCss();
const flags = L.mxFlags(ctx.user);
const canPick = opts.canPick !== undefined ? opts.canPick : flags.view;
const { members } = await loadMembers(_o1);
const _or = Array.isArray(opts.preIds) ? opts.preIds.filter(Boolean) : [];
const _o15 = { from: opts.from !== undefined ? opts.from : null, to: '', mode: _or.length && canPick ? 'pick' : 'all', ids: _or.slice(), reason: opts.reason || '' };
let _o5 = null, step = 'form';
const body = h('div', { class: 'mx-reassign', 'data-testid': 'rs-modal' });
const _oh = _o1.modal({ title: opts.title || 'Chuyển khách', body, wide: true });
const _ol = (id) => (id === '' ? 'Kho chung' : L.memberName(members.find((x) => x.id === id)) || 'người này');
const _oc = memberPicker(_o1, members, { value: _o15.from || '', pool: true, testid: 'rs-from', label: 'Chuyển khách của', onPick: (id) => { _o15.from = id; _o15.ids = []; _o5 = null; _o7(); } });
if (_o15.from !== null) _oc.value = _o15.from;
const _o11 = memberPicker(_o1, members.filter((x) => x.status !== 'locked'), { testid: 'rs-to', label: 'Chuyển sang', onPick: (id) => { _o15.to = id; err.textContent = ''; } });
const reason = h('input', { value: _o15.reason, maxlength: 200, list: 'rs-reasons', placeholder: 'vd: Nhân viên nghỉ việc', 'data-testid': 'rs-reason', oninput: (e) => { _o15.reason = e.target.value; } });
const reasons = h('datalist', { id: 'rs-reasons' }, ['Nhân viên nghỉ việc', 'Chia lại khách theo khu vực', 'Khách xin đổi người chăm sóc'].map((x) => h('option', { value: x })));
const err = h('p', { class: 'bds-error', role: 'alert', 'data-testid': 'rs-error' });
const pickBox = h('div', { 'data-testid': 'rs-pick-box' });
const _oj = h('div', { class: 'bds-row bds-wrap', role: 'radiogroup', 'aria-label': 'Khách cần chuyển' });
async function _og() {
if (_o5) return true;
if (_o15.from === null || !canPick) return false;
pickBox.replaceChildren(h('p', { class: 'bds-muted' }, 'Đang tải khách của ' + _ol(_o15.from) + '…'));
try {
const r = await _o1.api('members.view', { member_id: _o15.from, tables: ['objects'], limit: 2000 });
_o5 = L.liveCustomers(r && r.changes && r.changes.objects);
return true;
} catch (e) { pickBox.replaceChildren(h('p', { class: 'bds-error' }, _oa(e, 'Chưa tải được danh sách khách.'))); return false; }
}
function _o9() {
if (_o15.mode !== 'pick') { pickBox.replaceChildren(); return; }
if (!_o5) { _og().then((_om) => { if (_om) _o9(); }); return; }
const q = h('input', { type: 'search', placeholder: 'Lọc tên, số…', 'aria-label': 'Lọc khách', 'data-testid': 'rs-pick-q' });
const list = h('div', { class: 'mx-pick-list' });
const count = h('strong', { 'data-testid': 'rs-picked' }, String(_o15.ids.length));
const _op = () => {
const _ot = L.filterLocal(_o5, q.value).slice(0, 300);
list.replaceChildren(...(_ot.length ? _ot.map((c) => h('label', { class: 'mx-pick' },
h('input', { type: 'checkbox', checked: _o15.ids.includes(c.id), 'data-testid': 'rs-pick-' + c.id, onchange: (e) => { if (e.target.checked) { if (!_o15.ids.includes(c.id)) _o15.ids.push(c.id); } else _o15.ids = _o15.ids.filter((x) => x !== c.id); count.textContent = String(_o15.ids.length); } }),
h('span', null, h('strong', null, c.name || '(chưa có tên)'), h('small', { class: 'bds-muted' }, ' ' + L.maskPhone(c.phone))))) : [_o1.empty(_o5.length ? 'Không có khách khớp.' : _ol(_o15.from) + ' chưa có khách nào.')]));
};
q.addEventListener('input', _op);
_op();
pickBox.replaceChildren(h('p', { class: 'bds-muted' }, 'Đã chọn ', count, ' / ' + _o5.length + ' khách'), q, list);
}
function _o8() {
const _on = (k, label, ic) => _o1.button(label, () => { _o15.mode = k; _o8(); _o9(); }, { kind: _o15.mode === k ? 'primary' : 'ghost', icon: ic, testid: 'rs-mode-' + k });
_oj.replaceChildren(_on('all', 'Tất cả khách', 'customers'), canPick ? _on('pick', 'Chọn từng khách', 'check') : null);
}
function _o7() {
if (step === 'form') {
_o8(); _o9();
body.replaceChildren(
_o1.field('Chuyển khách của', _oc.el),
_o1.field('Sang', _o11.el),
h('div', null, h('span', { class: 'bds-field-l' }, 'Khách cần chuyển'), _oj), pickBox,
_o1.field('Lý do (bắt buộc – ghi vào nhật ký)', reason), reasons, err,
h('div', { class: 'bds-row bds-end' },
_o1.button('Huỷ', () => _oh.close(), { icon: 'x', testid: 'rs-cancel' }),
_o1.button('Tiếp tục', () => next(), { kind: 'primary', icon: 'next', testid: 'rs-next' })));
}
}
async function next() {
_o15.from = _oc.value; _o15.to = _o11.value;
if (_o15.from === undefined) _o15.from = null;
const e = L.validateReassign(_o15, members);
if (e) { err.textContent = e; return; }
let _o12 = null;
if (_o15.mode === 'all' && await _og()) _o12 = _o5.length;
step = 'confirm';
body.replaceChildren(
h('p', { 'data-testid': 'rs-confirm-text' }, L.reassignConfirmText(_o15, _ol(_o15.from), _ol(_o15.to), _o12)),
err,
h('div', { class: 'bds-row bds-end' },
_o1.button('Quay lại', () => { step = 'form'; _o7(); }, { icon: 'back', testid: 'rs-back' }),
_o1.button('Chuyển khách', () => _o10(), { kind: 'primary', icon: 'send', testid: 'rs-submit' })));
}
async function _o10() {
err.textContent = '';
let r;
try { r = await _o1.api('members.reassign', L.reassignPayload(_o15)); } catch (e) { err.textContent = _oa(e, 'Chưa chuyển được khách.'); return; }
step = 'done';
const _o13 = L.reassignResultText(r, _ol(_o15.from), _ol(_o15.to));
body.replaceChildren(
h('div', { class: 'mx-result', 'data-testid': 'rs-result' },
h('p', null, h('strong', null, _o13)),
h('dl', { class: 'bds-dl' }, h('dt', null, 'Khách đã chuyển'), h('dd', { 'data-testid': 'rs-moved' }, String(Number(r && r.moved) || 0)),
h('dt', null, 'Lịch sử, lịch hẹn, báo giá'), h('dd', { 'data-testid': 'rs-children' }, String(Number(r && r.children) || 0)))),
h('div', { class: 'bds-row bds-end' }, _o1.button('Xong', () => _oh.close(), { kind: 'primary', icon: 'check', testid: 'rs-done' })));
_o1.toast(_o13, 'success');
try { if (opts.onDone) opts.onDone(r, _o15); } catch { }
}
_o7();
return _oh;
}
export async function renderDupList(el, ctx, opts = {}) {
const _o1 = kit(ctx);
ensureMembersCss();
el.replaceChildren(h('p', { class: 'bds-muted' }, 'Đang tải…'));
let _ot;
try { _ot = L.dupRows(await _o1.api('members.dup_flags', {})); } catch (e) { el.replaceChildren(_o1.empty(_oa(e, 'Chưa tải được danh sách số trùng.'))); return; }
const _o14 = _ot.filter((r) => !r.seen).length;
const _ox = (r, s, tag) => h('div', { class: 'mx-dup-side' },
h('span', null, h('strong', null, s.memberName), s.customerName ? ' – ' + s.customerName : ''),
s.member && s.customer && opts.onView ? _o1.button('Xem (chỉ xem)', () => opts.onView(s.member, s.customer), { kind: 'ghost', icon: 'user', testid: 'dup-view-' + tag + '-' + r.key }) : null);
el.replaceChildren(
h('p', { class: 'bds-muted', 'data-testid': 'dup-count' }, _ot.length ? _ot.length + ' lần trùng số · ' + _o14 + ' chưa xem. Máy chủ không chặn – chỉ báo để Quản trị xử lý (giữ 40 lần gần nhất).' : ''),
_o14 > 1 ? h('div', { class: 'bds-row' }, _o1.button('Đánh dấu đã xem tất cả', async () => { await _o1.api('members.dup_seen', { all: true }); renderDupList(el, ctx, opts); }, { icon: 'check', testid: 'dup-seen-all' })) : null,
h('div', { class: 'bds-list', 'data-testid': 'dup-list' }, _ot.length ? _ot.map((r) => h('div', { class: 'bds-item mx-dup' + (r.seen ? ' mx-seen' : ''), 'data-testid': 'dup-row', 'data-key': r.key },
h('div', { class: 'mx-dup-head' }, h('strong', { class: 'mono', 'data-testid': 'dup-phone' }, '📞 ' + (r.phone || 'Số đã ẩn')), h('small', { class: 'bds-muted' }, L.fmtDateTime(r.at)),
r.seen ? _o1.badge('Đã xem', 'muted') : _o1.badge('Mới', 'warn')),
_ox(r, r.a, 'a'), _ox(r, r.b, 'b'),
r.seen ? null : h('div', { class: 'bds-row bds-end' }, _o1.button('Đã xem', async () => { await _o1.api('members.dup_seen', { key: r.key }); renderDupList(el, ctx, opts); }, { icon: 'check', testid: 'dup-seen-' + r.key }))))
: [_o1.empty('Chưa có số điện thoại nào trùng giữa nhân viên.')]));
}
export async function renderDataStatus(el, ctx, opts = {}) {
const _o1 = kit(ctx);
ensureMembersCss();
const flags = L.mxFlags(ctx.user);
const _o3 = h('section', { class: 'bds-card mx-status', 'data-testid': 'mx-status' });
el.replaceChildren(_o3);
const head = (extra) => h('header', { class: 'bds-card-h' }, h('h3', null, '🔐 Tình trạng dữ liệu'), extra || null);
async function _of(check, fix) {
_o3.replaceChildren(head(), h('p', { class: 'bds-muted' }, check ? 'Đang kiểm quyền chia sẻ từng Sheet…' : 'Đang tải…'));
let _oy;
try { _oy = await _o1.api('members.data_status', check ? { check: true, fix: !!fix } : {}); } catch (e) { _o3.replaceChildren(head(), _o1.empty(_oa(e, 'Chưa tải được tình trạng dữ liệu.'))); return; }
_o7(_oy, check);
if (fix) {
const _ok = (_oy.members || []).reduce((s, _oh) => s + (Number(_oh.fixed) || 0), 0);
_o1.toast(_ok ? 'Đã gỡ chia sẻ ở ' + _ok + ' chỗ – Sheet riêng chỉ còn tài khoản công ty' : 'Không có Sheet nào đang chia sẻ', 'success');
}
}
async function _ou() {
let r = null;
for (let _od = 0; _od < 15; _od++) {
r = await _o1.api('members.isolate_now', {});
if (!r || !r.more || r.error) break;
}
if (r && r.error) _o1.toast('Chưa tách xong: ' + r.error + ' – bấm lại sau ít phút', 'warn');
else if (r && r.phase === 'done') _o1.toast('Đã tách dữ liệu xong – mỗi nhân viên 1 Sheet riêng', 'success');
await _of(false);
}
function _o7(_oy, checked) {
if (L.freshCompany(_oy)) {
_o3.replaceChildren(head(), h('p', { 'data-testid': 'mx-phase', 'data-state': 'fresh' }, '✅ ' + L.FRESH_TEXT),
h('div', { class: 'bds-row bds-wrap' }, _o1.button('Tải lại', () => _of(false), { kind: 'ghost', icon: 'refresh', testid: 'mx-reload' })));
return;
}
const _oq = L.migrationPending(_oy);
const members = _oy.members || [];
const _oz = members.map((_oh) => L.sheetState(_oh));
const _o2 = _oz.includes('shared');
const tools = h('div', { class: 'bds-row bds-wrap' },
flags.admin && _oq ? _o1.button('Chạy tiếp tách dữ liệu', () => _ou(), { kind: 'primary', icon: 'refresh', testid: 'mx-isolate' }) : null,
flags.admin && _oy.on ? _o1.button('Kiểm tra quyền chia sẻ', () => _of(true, false), { icon: 'shield', testid: 'mx-check' }) : null,
flags.admin && _oy.on && (_o2 || !checked) ? _o1.button('Sửa quyền chia sẻ', () => _of(true, true), { kind: _o2 ? 'primary' : 'ghost', icon: 'lock', testid: 'mx-fix' }) : null,
_o1.button('Tải lại', () => _of(false), { kind: 'ghost', icon: 'refresh', testid: 'mx-reload' }));
const _os = L.reportLines(_oy.report);
_o3.replaceChildren(head(),
h('p', { 'data-testid': 'mx-phase' }, L.migrationText(_oy)),
_oy.on ? h('p', { class: 'bds-muted' }, 'Mỗi nhân viên 1 Sheet riêng trong thư mục "' + (_oy.folder || 'BDS Studio – Dữ liệu nhân viên') + '" (tài khoản công ty sở hữu, không chia sẻ cho ai). Quản trị xem khách của mọi người – chỉ xem – ở Khách hàng › Khách toàn công ty.') : null,
_os.length ? h('div', { class: 'mx-report', 'data-testid': 'mx-report' }, h('strong', null, 'Báo cáo tách dữ liệu'), h('ul', null, _os.map((x) => h('li', null, x)))) : null,
_oy.dup_flags ? h('p', { 'data-testid': 'mx-dup-note' }, '⚠️ ' + _oy.dup_flags + ' lần số điện thoại trùng giữa nhân viên – xem ở Khách hàng › Khách toàn công ty › Số trùng.') : null,
tools,
_oy.wanted || _oy.on ? h('div', { class: 'bds-list', 'data-testid': 'mx-members' }, members.map((_oh, _od) => _oi(_oh, _oz[_od], _oy))) : null);
}
function _oi(_oh, state, _oy) {
const _ow = state === 'unknown' && !_oy.on ? (Number(_oh.has_sheet) ? 'unknown' : 'missing') : state;
return h('div', { class: 'bds-item mx-mrow', 'data-testid': 'mx-row-' + (_oh.username || _oh.id), 'data-state': _ow },
h('div', { class: 'row-text' }, h('strong', null, L.memberName(_oh)), h('small', { class: 'bds-muted' }, ' @' + (_oh.username || '') + ' · ' + (L.ROLE_VN[_oh.role] || _oh.role || '') + (_oh.dept ? ' · ' + _oh.dept : '') + (_oh.team ? ' · ' + _oh.team : ''))),
_o1.badge(L.SHEET_LABEL[_ow] || _ow, L.SHEET_TONE[_ow] === 'ok' ? 'success' : L.SHEET_TONE[_ow] === 'danger' ? 'danger' : L.SHEET_TONE[_ow] === 'warn' ? 'warn' : 'muted'),
h('div', { class: 'bds-acts' },
_oh.url ? _o1.linkBtn('📄 Mở Sheet', _oh.url, null, { target: '_blank', testid: 'mx-open-' + _oh.id }) : null,
flags.admin && (_ow === 'lost' || _ow === 'missing') && (_oy.on || _oy.wanted) ? _o1.button(_ow === 'lost' ? 'Tạo lại Sheet' : 'Tạo Sheet', async () => {
const _om = await confirmBox(_o1, _ow === 'lost' ? 'Tạo lại Sheet cho ' + L.memberName(_oh) + '?' : 'Tạo Sheet riêng cho ' + L.memberName(_oh) + '?',
_ow === 'lost' ? 'Sheet cũ không mở được (bị xoá hoặc nằm trong Thùng rác Drive). Nếu còn trong Thùng rác, anh/chị khôi phục file đó thay vì tạo mới – Sheet mới sẽ TRỐNG, khách cũ chỉ lấy lại được từ Thùng rác hoặc bản sao lưu.' : 'Sheet mới nằm trong thư mục "BDS Studio – Dữ liệu nhân viên", tài khoản công ty sở hữu, không chia sẻ cho ai.',
_ow === 'lost' ? 'Tạo lại Sheet' : 'Tạo Sheet', 'mx-provision-confirm');
if (!_om) return;
try { await _o1.api('members.provision', { member_id: _oh.id, recreate: _ow === 'lost' }); _o1.toast('Đã tạo Sheet riêng cho ' + L.memberName(_oh), 'success'); } catch (e) { _o1.toast(_oa(e, 'Chưa tạo được Sheet'), 'danger'); }
_of(false);
}, { kind: _ow === 'lost' ? 'danger' : 'ghost', icon: 'plus', testid: 'mx-provision-' + _oh.id }) : null,
opts.onReassign && L.mxFlags(ctx.user).move && _oy.on ? _o1.button('Chuyển khách', () => opts.onReassign(_oh), { kind: 'ghost', icon: 'send', testid: 'mx-reassign-' + _oh.id }) : null));
}
await _of(false);
}
export function confirmBox(_o1, title, text, okLabel, testid, kind = 'primary') {
return new Promise((res) => {
let _oh;
const _o6 = (_o15) => { _oh.close(); res(_o15); };
_oh = _o1.modal({ title, testid, body: [h('p', null, text), h('div', { class: 'bds-row bds-end' },
_o1.button('Huỷ', () => _o6(false), { icon: 'x', testid: testid + '-cancel' }), _o1.button(okLabel, () => _o6(true), { kind, icon: 'check', testid: testid + '-ok' }))] });
});
}

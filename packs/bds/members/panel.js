import { kit, h } from '../_lib/kit.js';
import * as L from './logic.js';
const _oa = (e, fb) => (e && (e.userMessage || e.message)) || fb;
const _o0 = 'bds-members-css';
export function ensureMembersCss() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
const _of = document.createElement('link');
_of.id = _o0; _of.rel = 'stylesheet';
_of.href = new URL('./members.css', import.meta.url).href;
document.head.appendChild(_of);
}
export async function loadMembers(_o1) {
try { const _oz = await _o1.api('members.data_status', {}); return { members: (_oz && _oz.members) || [], status: _oz }; } catch (e) {
const r = await _o1.api('users.list', {});
const list = (Array.isArray(r) ? r : (r && (r.users || r.items)) || []).filter((u) => u && !Number(u.deleted));
return { members: list.map((u) => ({ id: u.id, username: u.username, full_name: u.full_name, role: u.role, status: u.status === 'locked' ? 'locked' : 'active' })), status: null };
}
}
export function memberPicker(_o1, members, opts = {}) {
const _oz = { dept: '', team: '', q: '' };
const _op = L.orgOptions(members);
const _ow = h('select', { 'aria-label': opts.label || 'Nhân viên', 'data-testid': opts.testid || 'mx-member', onchange: () => opts.onPick && opts.onPick(_ow.value) });
const _ob = () => {
const _o4 = _ow.value || opts.value || '';
const list = L.filterMembers(members, _oz).filter((_oi) => !(opts.exclude || []).includes(_oi.id));
const o = [h('option', { value: '' , disabled: !opts.pool, selected: !_o4 && !opts.pool }, opts.pool ? '🏢 Kho chung (chưa thuộc ai)' : '— Chọn người —')];
for (const _oi of list) o.push(h('option', { value: _oi.id, selected: _oi.id === _o4 }, L.memberName(_oi) + ' · ' + (L.ROLE_VN[_oi.role] || _oi.role || '') + (_oi.status === 'locked' ? ' (đã khoá)' : '') + (_oi.dept ? ' · ' + _oi.dept : '')));
_ow.replaceChildren(...o);
if (_o4 && list.some((_oi) => _oi.id === _o4)) _ow.value = _o4;
};
_ob();
const _oc = (key, values, label) => values.length ? _o1.select([['', label], ...values.map((_o16) => [_o16, _o16])], '', { 'aria-label': label, 'data-testid': 'mx-f-' + key, onchange: (e) => { _oz[key] = e.target.value; _ob(); } }) : null;
const _o3 = h('div', { class: 'mx-picker' },
h('div', { class: 'bds-filters' }, _oc('dept', _op.depts, 'Mọi phòng ban'), _oc('team', _op.teams, 'Mọi nhóm')),
_ow);
return { el: _o3, select: _ow, get value() { return _ow.value; }, set value(_o16) { _ow.value = _o16; } };
}
export async function openReassign(ctx, opts = {}) {
const _o1 = kit(ctx);
ensureMembersCss();
const flags = L.mxFlags(ctx.user);
const canPick = opts.canPick !== undefined ? opts.canPick : flags.view;
const { members } = await loadMembers(_o1);
const _os = Array.isArray(opts.preIds) ? opts.preIds.filter(Boolean) : [];
const _o16 = { from: opts.from !== undefined ? opts.from : null, to: '', mode: _os.length && canPick ? 'pick' : 'all', ids: _os.slice(), reason: opts.reason || '' };
let _o5 = null, step = 'form';
const body = h('div', { class: 'mx-reassign', 'data-testid': 'rs-modal' });
const _oi = _o1.modal({ title: opts.title || 'Chuyển khách', body, wide: true });
const _om = (id) => (id === '' ? 'Kho chung' : L.memberName(members.find((x) => x.id === id)) || 'người này');
const _od = memberPicker(_o1, members, { value: _o16.from || '', pool: true, testid: 'rs-from', label: 'Chuyển khách của', onPick: (id) => { _o16.from = id; _o16.ids = []; _o5 = null; _o7(); } });
if (_o16.from !== null) _od.value = _o16.from;
const _o12 = memberPicker(_o1, members.filter((x) => x.status !== 'locked'), { testid: 'rs-to', label: 'Chuyển sang', onPick: (id) => { _o16.to = id; err.textContent = ''; } });
const reason = h('input', { value: _o16.reason, maxlength: 200, list: 'rs-reasons', placeholder: 'vd: Nhân viên nghỉ việc', 'data-testid': 'rs-reason', oninput: (e) => { _o16.reason = e.target.value; } });
const reasons = h('datalist', { id: 'rs-reasons' }, ['Nhân viên nghỉ việc', 'Chia lại khách theo khu vực', 'Khách xin đổi người chăm sóc'].map((x) => h('option', { value: x })));
const err = h('p', { class: 'bds-error', role: 'alert', 'data-testid': 'rs-error' });
const pickBox = h('div', { 'data-testid': 'rs-pick-box' });
const _ok = h('div', { class: 'bds-row bds-wrap', role: 'radiogroup', 'aria-label': 'Khách cần chuyển' });
async function _oh() {
if (_o5) return true;
if (_o16.from === null || !canPick) return false;
pickBox.replaceChildren(h('p', { class: 'bds-muted' }, 'Đang tải khách của ' + _om(_o16.from) + '…'));
try {
const r = await _o1.api('members.view', { member_id: _o16.from, tables: ['objects'], limit: 2000 });
_o5 = L.liveCustomers(r && r.changes && r.changes.objects);
return true;
} catch (e) { pickBox.replaceChildren(h('p', { class: 'bds-error' }, _oa(e, 'Chưa tải được danh sách khách.'))); return false; }
}
function _o9() {
if (_o16.mode !== 'pick') { pickBox.replaceChildren(); return; }
if (!_o5) { _oh().then((_on) => { if (_on) _o9(); }); return; }
const q = h('input', { type: 'search', placeholder: 'Lọc tên, số…', 'aria-label': 'Lọc khách', 'data-testid': 'rs-pick-q' });
const list = h('div', { class: 'mx-pick-list' });
const count = h('strong', { 'data-testid': 'rs-picked' }, String(_o16.ids.length));
const _oq = () => {
const _ou = L.filterLocal(_o5, q.value).slice(0, 300);
list.replaceChildren(...(_ou.length ? _ou.map((c) => h('label', { class: 'mx-pick' },
h('input', { type: 'checkbox', checked: _o16.ids.includes(c.id), 'data-testid': 'rs-pick-' + c.id, onchange: (e) => { if (e.target.checked) { if (!_o16.ids.includes(c.id)) _o16.ids.push(c.id); } else _o16.ids = _o16.ids.filter((x) => x !== c.id); count.textContent = String(_o16.ids.length); } }),
h('span', null, h('strong', null, c.name || '(chưa có tên)'), h('small', { class: 'bds-muted' }, ' ' + L.maskPhone(c.phone))))) : [_o1.empty(_o5.length ? 'Không có khách khớp.' : _om(_o16.from) + ' chưa có khách nào.')]));
};
q.addEventListener('input', _oq);
_oq();
pickBox.replaceChildren(h('p', { class: 'bds-muted' }, 'Đã chọn ', count, ' / ' + _o5.length + ' khách'), q, list);
}
function _o8() {
const _oo = (k, label, ic) => _o1.button(label, () => { _o16.mode = k; _o8(); _o9(); }, { kind: _o16.mode === k ? 'primary' : 'ghost', icon: ic, testid: 'rs-mode-' + k });
_ok.replaceChildren(_oo('all', 'Tất cả khách', 'customers'), canPick ? _oo('pick', 'Chọn từng khách', 'check') : null);
}
function _o7() {
if (step === 'form') {
_o8(); _o9();
body.replaceChildren(
_o1.field('Chuyển khách của', _od.el),
_o1.field('Sang', _o12.el),
h('div', null, h('span', { class: 'bds-field-l' }, 'Khách cần chuyển'), _ok), pickBox,
_o1.field('Lý do (bắt buộc – ghi vào nhật ký)', reason), reasons, err,
h('div', { class: 'bds-row bds-end' },
_o1.button('Huỷ', () => _oi.close(), { icon: 'x', testid: 'rs-cancel' }),
_o1.button('Tiếp tục', () => next(), { kind: 'primary', icon: 'next', testid: 'rs-next' })));
}
}
async function next() {
_o16.from = _od.value; _o16.to = _o12.value;
if (_o16.from === undefined) _o16.from = null;
const e = L.validateReassign(_o16, members);
if (e) { err.textContent = e; return; }
let _o13 = null;
if (_o16.mode === 'all' && await _oh()) _o13 = _o5.length;
step = 'confirm';
body.replaceChildren(
h('p', { 'data-testid': 'rs-confirm-text' }, L.reassignConfirmText(_o16, _om(_o16.from), _om(_o16.to), _o13)),
err,
h('div', { class: 'bds-row bds-end' },
_o1.button('Quay lại', () => { step = 'form'; _o7(); }, { icon: 'back', testid: 'rs-back' }),
_o1.button('Chuyển khách', () => _o11(), { kind: 'primary', icon: 'send', testid: 'rs-submit' })));
}
async function _o11() {
err.textContent = '';
let r;
try { r = await _o1.api('members.reassign', L.reassignPayload(_o16)); } catch (e) { err.textContent = _oa(e, 'Chưa chuyển được khách.'); return; }
step = 'done';
const _o14 = L.reassignResultText(r, _om(_o16.from), _om(_o16.to));
body.replaceChildren(
h('div', { class: 'mx-result', 'data-testid': 'rs-result' },
h('p', null, h('strong', null, _o14)),
h('dl', { class: 'bds-dl' }, h('dt', null, 'Khách đã chuyển'), h('dd', { 'data-testid': 'rs-moved' }, String(Number(r && r.moved) || 0)),
h('dt', null, 'Lịch sử, lịch hẹn, báo giá'), h('dd', { 'data-testid': 'rs-children' }, String(Number(r && r.children) || 0)))),
h('div', { class: 'bds-row bds-end' }, _o1.button('Xong', () => _oi.close(), { kind: 'primary', icon: 'check', testid: 'rs-done' })));
_o1.toast(_o14, 'success');
try { if (opts.onDone) opts.onDone(r, _o16); } catch { }
}
_o7();
return _oi;
}
export async function renderDupList(el, ctx, opts = {}) {
const _o1 = kit(ctx);
ensureMembersCss();
el.replaceChildren(h('p', { class: 'bds-muted' }, 'Đang tải…'));
let _ou;
try { _ou = L.dupRows(await _o1.api('members.dup_flags', {})); } catch (e) { el.replaceChildren(_o1.empty(_oa(e, 'Chưa tải được danh sách số trùng.'))); return; }
const _o15 = _ou.filter((r) => !r.seen).length;
const _oy = (r, s, tag) => h('div', { class: 'mx-dup-side' },
h('span', null, h('strong', null, s.memberName), s.customerName ? ' – ' + s.customerName : ''),
s.member && s.customer && opts.onView ? _o1.button('Xem (chỉ xem)', () => opts.onView(s.member, s.customer), { kind: 'ghost', icon: 'user', testid: 'dup-view-' + tag + '-' + r.key }) : null);
el.replaceChildren(
h('p', { class: 'bds-muted', 'data-testid': 'dup-count' }, _ou.length ? _ou.length + ' lần trùng số · ' + _o15 + ' chưa xem. Máy chủ không chặn – chỉ báo để Quản trị xử lý (giữ 40 lần gần nhất).' : ''),
_o15 > 1 ? h('div', { class: 'bds-row' }, _o1.button('Đánh dấu đã xem tất cả', async () => { await _o1.api('members.dup_seen', { all: true }); renderDupList(el, ctx, opts); }, { icon: 'check', testid: 'dup-seen-all' })) : null,
h('div', { class: 'bds-list', 'data-testid': 'dup-list' }, _ou.length ? _ou.map((r) => h('div', { class: 'bds-item mx-dup' + (r.seen ? ' mx-seen' : ''), 'data-testid': 'dup-row', 'data-key': r.key },
h('div', { class: 'mx-dup-head' }, h('strong', { class: 'mono', 'data-testid': 'dup-phone' }, '📞 ' + (r.phone || 'Số đã ẩn')), h('small', { class: 'bds-muted' }, L.fmtDateTime(r.at)),
r.seen ? _o1.badge('Đã xem', 'muted') : _o1.badge('Mới', 'warn')),
_oy(r, r.a, 'a'), _oy(r, r.b, 'b'),
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
async function _og(check, fix) {
_o3.replaceChildren(head(), h('p', { class: 'bds-muted' }, check ? 'Đang kiểm quyền chia sẻ từng Sheet…' : 'Đang tải…'));
let _oz;
try { _oz = await _o1.api('members.data_status', check ? { check: true, fix: !!fix } : {}); } catch (e) { _o3.replaceChildren(head(), _o1.empty(_oa(e, 'Chưa tải được tình trạng dữ liệu.'))); return; }
_o7(_oz, check);
if (fix) {
const _ol = (_oz.members || []).reduce((s, _oi) => s + (Number(_oi.fixed) || 0), 0);
_o1.toast(_ol ? 'Đã gỡ chia sẻ ở ' + _ol + ' chỗ – Sheet riêng chỉ còn tài khoản công ty' : 'Không có Sheet nào đang chia sẻ', 'success');
}
}
async function _ov() {
let r = null;
for (let _oe = 0; _oe < 15; _oe++) {
r = await _o1.api('members.isolate_now', {});
if (!r || !r.more || r.error) break;
}
if (r && r.error) _o1.toast('Chưa tách xong: ' + r.error + ' – bấm lại sau ít phút', 'warn');
else if (r && r.phase === 'done') _o1.toast('Đã tách dữ liệu xong – mỗi nhân viên 1 Sheet riêng', 'success');
await _og(false);
}
function _o7(_oz, checked) {
if (L.freshCompany(_oz)) {
_o3.replaceChildren(head(), h('p', { 'data-testid': 'mx-phase', 'data-state': 'fresh' }, '✅ ' + L.FRESH_TEXT),
h('div', { class: 'bds-row bds-wrap' }, _o1.button('Tải lại', () => _og(false), { kind: 'ghost', icon: 'refresh', testid: 'mx-reload' })));
return;
}
const _or = L.migrationPending(_oz);
const members = _oz.members || [];
const _o10 = members.map((_oi) => L.sheetState(_oi));
const _o2 = _o10.includes('shared');
const tools = h('div', { class: 'bds-row bds-wrap' },
flags.admin && _or ? _o1.button('Chạy tiếp tách dữ liệu', () => _ov(), { kind: 'primary', icon: 'refresh', testid: 'mx-isolate' }) : null,
flags.admin && _oz.on ? _o1.button('Kiểm tra quyền chia sẻ', () => _og(true, false), { icon: 'shield', testid: 'mx-check' }) : null,
flags.admin && _oz.on && (_o2 || !checked) ? _o1.button('Sửa quyền chia sẻ', () => _og(true, true), { kind: _o2 ? 'primary' : 'ghost', icon: 'lock', testid: 'mx-fix' }) : null,
_o1.button('Tải lại', () => _og(false), { kind: 'ghost', icon: 'refresh', testid: 'mx-reload' }));
const _ot = L.reportLines(_oz.report);
_o3.replaceChildren(head(),
h('p', { 'data-testid': 'mx-phase' }, L.migrationText(_oz)),
_oz.on ? h('p', { class: 'bds-muted' }, 'Mỗi nhân viên 1 Sheet riêng trong thư mục "' + (_oz.folder || 'BDS Studio – Dữ liệu nhân viên') + '" (tài khoản công ty sở hữu, không chia sẻ cho ai). Quản trị xem khách của mọi người – chỉ xem – ở Khách hàng › Khách toàn công ty.') : null,
_ot.length ? h('div', { class: 'mx-report', 'data-testid': 'mx-report' }, h('strong', null, 'Báo cáo tách dữ liệu'), h('ul', null, _ot.map((x) => h('li', null, x)))) : null,
_oz.dup_flags ? h('p', { 'data-testid': 'mx-dup-note' }, '⚠️ ' + _oz.dup_flags + ' lần số điện thoại trùng giữa nhân viên – xem ở Khách hàng › Khách toàn công ty › Số trùng.') : null,
tools,
_oz.wanted || _oz.on ? h('div', { class: 'bds-list', 'data-testid': 'mx-members' }, members.map((_oi, _oe) => _oj(_oi, _o10[_oe], _oz))) : null);
}
function _oj(_oi, state, _oz) {
const _ox = state === 'unknown' && !_oz.on ? (Number(_oi.has_sheet) ? 'unknown' : 'missing') : state;
return h('div', { class: 'bds-item mx-mrow', 'data-testid': 'mx-row-' + (_oi.username || _oi.id), 'data-state': _ox },
h('div', { class: 'row-text' }, h('strong', null, L.memberName(_oi)), h('small', { class: 'bds-muted' }, ' @' + (_oi.username || '') + ' · ' + (L.ROLE_VN[_oi.role] || _oi.role || '') + (_oi.dept ? ' · ' + _oi.dept : '') + (_oi.team ? ' · ' + _oi.team : ''))),
_o1.badge(L.SHEET_LABEL[_ox] || _ox, L.SHEET_TONE[_ox] === 'ok' ? 'success' : L.SHEET_TONE[_ox] === 'danger' ? 'danger' : L.SHEET_TONE[_ox] === 'warn' ? 'warn' : 'muted'),
h('div', { class: 'bds-acts' },
_oi.url ? _o1.linkBtn('📄 Mở Sheet', _oi.url, null, { target: '_blank', testid: 'mx-open-' + _oi.id }) : null,
flags.admin && (_ox === 'lost' || _ox === 'missing') && (_oz.on || _oz.wanted) ? _o1.button(_ox === 'lost' ? 'Tạo lại Sheet' : 'Tạo Sheet', async () => {
const _on = await confirmBox(_o1, _ox === 'lost' ? 'Tạo lại Sheet cho ' + L.memberName(_oi) + '?' : 'Tạo Sheet riêng cho ' + L.memberName(_oi) + '?',
_ox === 'lost' ? 'Sheet cũ không mở được (bị xoá hoặc nằm trong Thùng rác Drive). Nếu còn trong Thùng rác, anh/chị khôi phục file đó thay vì tạo mới – Sheet mới sẽ TRỐNG, khách cũ chỉ lấy lại được từ Thùng rác hoặc bản sao lưu.' : 'Sheet mới nằm trong thư mục "BDS Studio – Dữ liệu nhân viên", tài khoản công ty sở hữu, không chia sẻ cho ai.',
_ox === 'lost' ? 'Tạo lại Sheet' : 'Tạo Sheet', 'mx-provision-confirm');
if (!_on) return;
try { await _o1.api('members.provision', { member_id: _oi.id, recreate: _ox === 'lost' }); _o1.toast('Đã tạo Sheet riêng cho ' + L.memberName(_oi), 'success'); } catch (e) { _o1.toast(_oa(e, 'Chưa tạo được Sheet'), 'danger'); }
_og(false);
}, { kind: _ox === 'lost' ? 'danger' : 'ghost', icon: 'plus', testid: 'mx-provision-' + _oi.id }) : null,
opts.onReassign && L.mxFlags(ctx.user).move && _oz.on ? _o1.button('Chuyển khách', () => opts.onReassign(_oi), { kind: 'ghost', icon: 'send', testid: 'mx-reassign-' + _oi.id }) : null));
}
await _og(false);
}
export function confirmBox(_o1, title, text, okLabel, testid, kind = 'primary') {
return new Promise((res) => {
let _oi;
const _o6 = (_o16) => { _oi.close(); res(_o16); };
_oi = _o1.modal({ title, testid, body: [h('p', null, text), h('div', { class: 'bds-row bds-end' },
_o1.button('Huỷ', () => _o6(false), { icon: 'x', testid: testid + '-cancel' }), _o1.button(okLabel, () => _o6(true), { kind, icon: 'check', testid: testid + '-ok' }))] });
});
}

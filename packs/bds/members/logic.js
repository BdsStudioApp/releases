export function mxFlags(user) {
const _o7 = (user && user.perms) || {};
return { view: _o7.mx_view === true, move: _o7.mx_move === true, status: _o7.mx_status === true, admin: _o7.mx_admin === true };
}
export const READ_ACTIONS = Object.freeze(['members.view', 'members.dup_flags', 'members.data_status']);
export function readOnlyApi(call) {
return async (action, payload = {}) => {
if (!READ_ACTIONS.includes(action)) { const e = new Error('Màn này chỉ xem – không sửa được dữ liệu của người khác.'); e.code = 'READ_ONLY'; e.userMessage = e.message; throw e; }
return call(action, payload);
};
}
export function fold(_o9) {
return String(_o9 || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
}
export function memberName(m) { return m ? (m.full_name || m.username || (m.id === '' ? 'Kho chung' : 'Nhân viên')) : ''; }
export const ROLE_VN = { owner: 'Quản trị', manager: 'Quản lý', sale: 'Sale', ctv: 'Cộng tác viên', marketing: 'Marketing' };
export function orgOptions(members) {
const _ob = (k) => [...new Set((members || []).map((m) => String(m[k] || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi'));
return { depts: _ob('dept'), teams: _ob('team') };
}
export function filterMembers(members, _o3 = {}) {
const q = fold(_o3.q);
return (members || []).filter((m) => m && m.id
&& (!_o3.dept || m.dept === _o3.dept) && (!_o3.team || m.team === _o3.team)
&& (_o3.locked !== false || m.status !== 'locked')
&& (!q || fold(m.full_name + ' ' + m.username).includes(q)))
.sort((a, b) => memberName(a).localeCompare(memberName(b), 'vi'));
}
export function validateReassign(v, members = []) {
const from = v && v.from, to = v && v.to;
if (from === undefined || from === null) return 'Chọn người chuyển khách đi.';
if (!to) return 'Chọn người nhận khách.';
if (from === to) return 'Người chuyển đi và người nhận phải khác nhau.';
const _oa = (members || []).find((m) => m.id === to);
if (members && members.length && !_oa) return 'Người nhận không có trong danh sách.';
if (_oa && _oa.status === 'locked') return 'Người nhận đang bị khoá – chọn người khác.';
if (v.mode === 'pick' && !(Array.isArray(v.ids) && v.ids.length)) return 'Chọn ít nhất 1 khách (hoặc chọn "Tất cả khách").';
if (Array.isArray(v.ids) && v.ids.length > 2000) return 'Mỗi lần chuyển tối đa 2.000 khách.';
const _o8 = String(v.reason || '').trim();
if (_o8.length < 3) return 'Ghi lý do chuyển khách (bắt buộc, ít nhất 3 ký tự).';
if (_o8.length > 200) return 'Lý do tối đa 200 ký tự.';
return '';
}
export function reassignPayload(v) {
const _o7 = { from: v.from || '', to: v.to, reason: String(v.reason || '').trim() };
if (v.mode === 'pick') _o7.ids = [...new Set(v.ids)].slice(0, 2000);
return _o7;
}
export function reassignConfirmText(v, fromName, toName, count) {
const _o6 = v.mode === 'pick' ? (v.ids || []).length : count;
const _oc = v.mode === 'pick' ? _o6 + ' khách đã chọn' : (Number.isFinite(_o6) ? 'tất cả ' + _o6 + ' khách' : 'tất cả khách');
return 'Chuyển ' + _oc + ' của ' + fromName + ' sang ' + toName + '? Lịch sử, lịch hẹn, báo giá đi theo khách. ' + fromName + ' sẽ không còn thấy các khách này. Lý do: "' + String(v.reason || '').trim() + '".';
}
export function reassignResultText(_o8, fromName, toName) {
const moved = Number(_o8 && _o8.moved) || 0, kids = Number(_o8 && _o8.children) || 0;
if (!moved) return 'Không có khách nào được chuyển (khách đã chuyển trước đó hoặc ' + fromName + ' không còn khách).';
return 'Đã chuyển ' + moved + ' khách' + (kids ? ' (kèm ' + kids + ' lịch sử, lịch hẹn, báo giá)' : '') + ' từ ' + fromName + ' sang ' + toName + '.' + (_o8 && _o8.notified ? ' Đã báo ' + toName + ' qua Telegram.' : '');
}
export function dupRows(flags) {
return (Array.isArray(flags) ? flags : []).map((_o3) => ({
key: String(_o3.key || [_o3.at, _o3.customer && _o3.customer.id, _o3.other_member && _o3.other_member.id].join(':')),
at: Number(_o3.at) || 0,
phone: maskPhone(_o3.phone),
seen: !!Number(_o3.seen),
a: { member: (_o3.member && _o3.member.id) || '', memberName: (_o3.member && _o3.member.name) || 'Nhân viên đã xoá', customer: (_o3.customer && _o3.customer.id) || '', customerName: (_o3.customer && _o3.customer.name) || '' },
b: { member: (_o3.other_member && _o3.other_member.id) || '', memberName: (_o3.other_member && _o3.other_member.name) || 'Nhân viên đã xoá', customer: (_o3.other_customer && _o3.other_customer.id) || '', customerName: (_o3.other_customer && _o3.other_customer.name) || '' }
})).sort((x, y) => (x.seen - y.seen) || (y.at - x.at));
}
export function maskPhone(_o7) {
const _o9 = String(_o7 || '').replace(/\s/g, '');
if (!_o9) return '';
if (_o9.includes('*')) return _o9;
return _o9.length > 6 ? _o9.slice(0, 3) + '****' + _o9.slice(-3) : _o9;
}
export function sheetState(m) {
if (!m || !Number(m.has_sheet)) return 'missing';
if (m.lost === true) return 'lost';
if (m.private === false) return 'shared';
if (m.private === true) return 'ok';
return 'unknown';
}
export const SHEET_LABEL = { ok: 'Sheet riêng – OK', missing: 'Chưa có Sheet', lost: 'Mất Sheet (bị xoá)', shared: 'Đang chia sẻ cho người khác', unknown: 'Có Sheet (chưa kiểm chia sẻ)' };
export const SHEET_TONE = { ok: 'ok', missing: 'warn', lost: 'danger', shared: 'danger', unknown: 'neutral' };
export function migrationPending(st) { return !!(st && st.wanted && !st.on); }
export function freshCompany(st) {
if (!migrationPending(st) || st.migration) return false;
return (st.members || []).every((m) => m && m.role === 'owner');
}
export const FRESH_TEXT = 'Chưa có nhân viên nên chưa cần tách dữ liệu. Sheet riêng của mỗi nhân viên sẽ tự tạo khi nhân viên nhận lời mời hoặc được thêm vào – anh/chị không phải làm gì.';
const _o0 = { backup: 'Đang chép bản sao lưu Sheet chính', copy: 'Đang chép dữ liệu từng người', final: 'Đang hoàn tất', done: 'Đã xong' };
export function migrationText(st) {
if (!st) return '';
if (st.on) return 'Đã tách dữ liệu theo từng nhân viên' + (st.on_at ? ' lúc ' + fmtDateTime(st.on_at) : '') + '.';
if (!st.wanted) return st.available === false ? 'Máy chủ chưa hỗ trợ Sheet riêng từng người – cập nhật máy chủ.' : 'Chưa bật bản Công ty – dữ liệu dùng chung Sheet chính.';
const _o4 = st.migration;
if (!_o4) return 'Đang chờ máy chủ bắt đầu tách dữ liệu (tự chạy theo hẹn giờ, hoặc bấm "Chạy tiếp tách dữ liệu").';
return (_o0[_o4.phase] || 'Đang tách dữ liệu') + ' – đã xong ' + (Number(_o4.done) || 0) + ' người, ' + (Number(_o4.rows) || 0) + ' dòng.' + (_o4.error ? ' Lần trước chưa được: ' + _o4.error + ' (sẽ thử lại).' : '');
}
export function reportLines(_o8) {
if (!_o8) return [];
const _o5 = _o8.moved || {}, pool = _o8.pool || {};
return [
'Xong lúc ' + fmtDateTime(_o8.at) + ' · ' + (Number(_o8.members) || 0) + ' người, mỗi người 1 Sheet riêng (tạo mới ' + (Number(_o8.sheets_created) || 0) + ').',
'Đã chuyển: ' + (Number(_o5.objects) || 0) + ' khách, ' + (Number(_o5.events) || 0) + ' lịch sử, ' + (Number(_o5.reminders) || 0) + ' lịch hẹn/nhắc, ' + (Number(_o5.quotes) || 0) + ' báo giá.',
'Kho chung (chưa thuộc ai, ở Sheet chính): ' + (Number(pool.objects) || 0) + ' khách.',
_o8.backup_name ? 'Bản chép Sheet chính trước khi tách: "' + _o8.backup_name + '" (thư mục BDS Studio – Sao lưu).' : ''
].filter(Boolean);
}
export function fmtDateTime(ms) {
if (!ms) return '';
const _o2 = new Date(Number(ms) + 7 * 3600e3), _o7 = (_o6) => String(_o6).padStart(2, '0');
return _o7(_o2.getUTCHours()) + ':' + _o7(_o2.getUTCMinutes()) + ' ' + _o7(_o2.getUTCDate()) + '/' + _o7(_o2.getUTCMonth() + 1) + '/' + _o2.getUTCFullYear();
}
export function profileRows(c, projectName = (x) => x) {
if (!c) return [];
const money = (_o6) => (Number(_o6) ? (Number(_o6) >= 1e9 ? (Number(_o6) / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tỷ' : Math.round(Number(_o6) / 1e6).toLocaleString('vi-VN') + ' triệu') : '');
return [
['Điện thoại', c.phone || '—'],
c.zalo && c.zalo !== c.phone ? ['Zalo', c.zalo] : null,
c.email ? ['Email', c.email] : null,
['Trạng thái', c.status || 'Mới'],
['Nhu cầu', c.need ? c.need.charAt(0).toUpperCase() + c.need.slice(1) : '—'],
['Dự án', projectName(c.project) || '—'],
['Loại căn', c.unit_type || '—'],
['Vốn', money(c.budget) || '—'],
['Nguồn', sourceLabel(c.source) || '—'],
c.created_at ? ['Ngày tạo', fmtDateTime(c.created_at)] : null
].filter(Boolean);
}
const _o1 = { landing: 'Landing', manual: 'Tự nhập', referral: 'Giới thiệu', facebook: 'Facebook', zalo: 'Zalo', walkin: 'Khách vãng lai', webhook: 'Landing ngoài (webhook)', import: 'Nhập Excel/CSV', pool: 'Công ty cấp' };
export function sourceLabel(_o9) { _o9 = String(_o9 || ''); return _o9.startsWith('webhook:') ? 'Landing ngoài · ' + _o9.slice(8) : (_o1[_o9] || _o9); }
export function liveCustomers(list) {
return (Array.isArray(list) ? list : []).filter((o) => o && Number(o.deleted) !== 1 && (!o.kind || o.kind === 'customer'))
.sort((a, b) => (Number(b.updated_at) || 0) - (Number(a.updated_at) || 0));
}
export function filterLocal(list, q) {
const _o3 = fold(q), _o2 = String(q || '').replace(/\D/g, '');
if (!_o3 && !_o2) return list;
return list.filter((o) => (_o3 && fold([o.name, o.note, o.email, o.project, o.status].join(' ')).includes(_o3)) || (_o2.length >= 3 && (String(o.phone || '').replace(/\D/g, '').includes(_o2) || String(o.zalo || '').replace(/\D/g, '').includes(_o2))));
}
export const PAGE = 50;

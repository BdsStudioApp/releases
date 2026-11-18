import { kit, h } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import * as LP from '../_lib/lead_pool.js';
const _ot = (v) => (v === null || v === undefined ? '–' : String(v).replace('.', ',') + '%');
const _of = (_oc) => (_oc === null || _oc === undefined ? '–' : _oc < 60 ? _oc + ' phút' : Math.round(_oc / 6) / 10 + ' giờ');
export async function mount(el, ctx) {
const _o0 = kit(ctx);
LP.ensureLpCss();
const st = { tab: 'pool', f: { q: '', state: '', stage: '', level: '', channel: '', campaign: '' }, picked: new Set(), info: null, rows: [], days: 30, feed: null };
const _o10 = h('div', { class: 'bds-screen', 'data-testid': 'lead-pool' });
el.replaceChildren(_o10);
async function _ob() {
st.info = await _o0.api('pool.info');
try { st.feed = await _o0.api('cheer.feed'); } catch { st.feed = null; }
}
const S = () => (st.info && st.info.scope) || {};
const _o18 = () => [['pool', 'Kho lead', S().pool || S().push, 'inbox'], ['report', 'Báo cáo', S().report, 'pulse'], ['teams', 'Nhóm sale', S().owner || (S().leader_of || []).length, 'customers'], ['settings', 'Cài đặt', S().owner, 'settings']].filter((t) => t[2]);
async function _ox() {
_o10.replaceChildren(h('div', { class: 'bds-head' }, h('h2', null, 'Kho lead công ty')), h('p', { class: 'bds-muted' }, 'Đang tải…'));
try { await _ob(); } catch (e) { _o10.replaceChildren(h('div', { class: 'bds-head' }, h('h2', null, 'Kho lead công ty')), _o0.empty((e && (e.userMessage || e.message)) || 'Chưa mở được Kho lead.')); return; }
const _o1f = _o18();
if (!_o1f.some((t) => t[0] === st.tab)) st.tab = _o1f.length ? _o1f[0][0] : 'pool';
const bar = h('div', { class: 'bds-row bds-wrap', role: 'tablist', 'data-testid': 'lp-tabs' }, _o1f.map(([k, l, , ic]) =>
_o0.button(l, () => { st.tab = k; _ox(); }, { kind: st.tab === k ? 'primary' : 'ghost', icon: ic, testid: 'lp-tab-' + k })));
const body = h('div', { 'data-testid': 'lp-body-' + st.tab });
_o10.replaceChildren(h('div', { class: 'bds-head' }, h('h2', null, 'Kho lead công ty')), bar, body);
if (st.tab === 'pool') await _ov(body);
else if (st.tab === 'report') await _oy(body);
else if (st.tab === 'teams') _o1c(body);
else _o16(body);
}
async function _ov(body) {
const _ow = await _o0.api('pool.list');
st.rows = _ow.rows || [];
const _ou = (st.feed && st.feed.pending) || [];
if (_ou.length) body.appendChild(_o0.card({ title: '🎉 Chờ xác nhận chúc mừng chốt đơn', testid: 'lp-cheer-pending', body: _ou.map((c) => h('div', { class: 'bds-row bds-wrap' },
h('span', null, c.text),
_o0.button('Xác nhận', async () => { await _o0.api('cheer.confirm', { id: c.id }); _o0.toast('Đã gửi lời chúc mừng tới mọi người', 'success'); _ox(); }, { kind: 'primary', icon: 'check', testid: 'cheer-confirm-' + c.id }),
_o0.button('Bỏ qua', async () => { await _o0.api('cheer.confirm', { id: c.id, reject: true }); _ox(); }, { icon: 'x', testid: 'cheer-reject-' + c.id }))) }));
const _o1e = h('div', { class: 'bds-row bds-wrap bds-tools' },
S().pool ? _o0.button('Nhập khách', () => openImport(), { kind: 'primary', icon: 'plus', testid: 'lp-import' }) : null,
_o0.button('Tải lại', () => _ox(), { icon: 'refresh', testid: 'lp-reload' }));
const camps = [...new Set(st.rows.map((x) => x.campaign).filter(Boolean))].sort();
const _o14 = (opts, key, label) => _o0.select(opts, st.f[key], { 'aria-label': label, 'data-testid': 'lp-f-' + key, onchange: (e) => { st.f[key] = e.target.value; _oq(); } });
const search = h('input', { type: 'search', value: st.f.q, placeholder: 'Tìm tên, số, chiến dịch, người nhận…', 'aria-label': 'Tìm khách trong kho', 'data-testid': 'lp-search', oninput: (e) => { st.f.q = e.target.value; _oq(); } });
const filters = h('div', { class: 'bds-toolbar' }, search, h('div', { class: 'bds-filters' },
_o14([['', 'Tất cả'], ['new', 'Chưa cấp'], ['assigned', 'Đã cấp'], ['overdue', '⏰ Quá giờ chưa gọi']], 'state', 'Tình trạng'),
_o14([['', 'Mọi tiến độ'], ...LP.STAGES.map((s) => [s.k, s.label])], 'stage', 'Tiến độ'),
_o14([['', 'Mọi mức độ'], ...LP.LEVELS.map((l) => [l.k, l.label])], 'level', 'Mức độ'),
_o14([['', 'Mọi nguồn'], ...Object.entries(LP.CHANNELS)], 'channel', 'Nguồn'),
_o14([['', 'Mọi chiến dịch'], ...camps.map((c) => [c, c])], 'campaign', 'Chiến dịch')));
const _o15 = h('strong', null, '0');
const selBar = h('div', { class: 'bds-selbar', 'data-testid': 'lp-selbar', hidden: true }, h('span', null, 'Đã chọn ', _o15),
h('div', { class: 'bds-row bds-wrap' },
S().push ? _o0.button('Đẩy số', () => _on([...st.picked]), { kind: 'primary', icon: 'send', testid: 'lp-push-selected' }) : null,
S().reclaim || S().reclaim_team ? _o0.button('Thu hồi', () => _oo([...st.picked]), { icon: 'undo', testid: 'lp-reclaim-selected' }) : null,
_o0.button('Bỏ chọn', () => { st.picked.clear(); _oq(); }, { kind: 'ghost', icon: 'x', testid: 'lp-unpick' })));
const count = h('p', { class: 'bds-muted', 'data-testid': 'lp-count' });
const list = h('div', { class: 'bds-list', 'data-testid': 'lp-list' });
body.append(_o1e, filters, selBar, count, list);
function _oq() {
const rows = LP.filterPool(st.rows, st.f);
const _oi = st.rows.filter((x) => x.status === 'new').length, nOver = st.rows.filter((x) => x.overdue).length;
count.textContent = rows.length + ' khách đang hiện · ' + _oi + ' chưa cấp' + (nOver ? ' · ' + nOver + ' khách quá ' + (_ow.overdue_h || 2) + ' giờ chưa gọi' : '');
for (const id of [...st.picked]) if (!st.rows.some((x) => x.id === id)) st.picked.delete(id);
selBar.hidden = !st.picked.size; _o15.textContent = String(st.picked.size);
list.replaceChildren(...(rows.length ? rows.slice(0, 500).map(_o12) : [_o0.empty(st.rows.length ? 'Không có khách khớp bộ lọc.' : 'Kho đang trống. Bấm "Nhập khách" hoặc nối landing công ty (khoá nhận khách chung) để khách tự vào kho.')]));
}
function _o12(x) {
const _o6 = h('input', { type: 'checkbox', class: 'bds-pick', 'aria-label': 'Chọn ' + x.name, 'data-testid': 'lp-pick-' + x.id, checked: st.picked.has(x.id),
onchange: (e) => { if (e.target.checked) st.picked.add(x.id); else st.picked.delete(x.id); selBar.hidden = !st.picked.size; _o15.textContent = String(st.picked.size); } });
const _o19 = h('span', { class: 'bds-row bds-wrap' },
h('span', { class: 'lp-badge', style: { background: '#e0f2fe', color: '#075985' } }, x.channel_label + (x.campaign ? ' · ' + x.campaign : '')),
x.status === 'assigned' ? _o0.badge(x.stage_label, crm.statusTone(x.stage_label)) : _o0.badge('Chưa cấp', 'info'),
LP.levelBadge(x.level),
x.overdue ? h('span', { class: 'lp-lv lp-warn', 'data-testid': 'lp-overdue-' + x.id }, '⏰ Chưa gọi > ' + (_ow.overdue_h || 2) + ' giờ') : null,
x.dup_owner ? h('span', { class: 'lp-lv lp-warn', title: 'Số này đã có trong danh sách khách của nhân viên – tránh trả tiền 2 lần / tranh khách', 'data-testid': 'lp-dup-' + x.id }, '⚠️ Đang là khách của ' + x.dup_owner) : null);
const _o1 = h('div', { class: 'bds-acts bds-wrap' },
x.status === 'new' && S().push ? _o0.button('Đẩy số', () => _on([x.id]), { kind: 'primary', icon: 'send', small: true, testid: 'lp-push-' + x.id }) : null,
x.status === 'assigned' && _o5(x) ? _o0.button('Thu hồi', () => _oo([x.id]), { icon: 'undo', small: true, testid: 'lp-reclaim-' + x.id }) : null,
_o0.button('Lịch sử', () => _om(x), { kind: 'ghost', icon: 'log', small: true, testid: 'lp-hist-' + x.id }),
S().owner ? _o0.button('Xoá theo yêu cầu', () => _ol(x), { kind: 'ghost', icon: 'shield', small: true, testid: 'lp-erase-' + x.id }) : null);
return h('div', { class: 'bds-item', 'data-id': x.id, 'data-testid': 'lp-row-' + x.id },
h('label', { class: 'bds-pick-wrap' }, _o6),
h('div', { class: 'bds-row-main' }, h('strong', { class: 'bds-name' }, x.name), h('span', { class: 'bds-sub' }, [x.phone, x.project].filter(Boolean).join(' · ')),
h('span', { class: 'bds-sub', 'data-testid': 'lp-status-' + x.id }, x.status_text + (x.reason ? ' · Lý do: ' + x.reason : '') + (x.last_contact_at ? ' · Liên hệ cuối ' + _o0.date(x.last_contact_at) + ' ' + crm.hm(x.last_contact_at) : '')),
_o19), _o1);
}
_oq();
}
const _oh = () => ((st.info && st.info.teams) || []).filter((t) => (S().leader_of || []).includes(t.id));
const _o5 = (x) => !!(S().reclaim || (S().reclaim_team && _oh().some((t) => t.members.includes(x.assignee))));
function people() { return ((st.info && st.info.people) || []).filter((_op) => _op.role !== 'owner' || S().owner); }
function _o1b(id) { const t = ((st.info && st.info.teams) || []).find((x) => x.id === id); return t ? t.name : ''; }
function _on(ids) {
if (!ids.length) return _o0.toast('Chọn ít nhất 1 khách', 'warn');
const leads = st.rows.filter((x) => ids.includes(x.id) && x.status === 'new');
if (!leads.length) return _o0.toast('Các khách đã chọn đều đã cấp – thu hồi trước nếu muốn cấp lại', 'warn');
const teams = (st.info.teams || []).filter((t) => S().push_all || (S().leader_of || []).includes(t.id));
const ps = people().filter((_op) => S().push_all || teams.some((t) => t.members.includes(_op.id)));
const f = { kind: teams.length ? 'team' : 'person', to: ps[0] ? ps[0].id : '', team: teams[0] ? teams[0].id : '', mode: 'rr', manual: {} };
const _o3 = h('div');
const err = h('div', { class: 'bds-error', role: 'alert' });
function _or() {
const team = teams.find((t) => t.id === f.team);
const members = team ? ps.filter((_op) => team.members.includes(_op.id)) : [];
_o3.replaceChildren(
h('p', null, 'Đẩy ' + leads.length + ' khách cho:'),
h('div', { class: 'lp-chips' },
h('button', { type: 'button', class: 'lp-chip', 'aria-pressed': String(f.kind === 'person'), 'data-testid': 'push-kind-person', onclick: () => { f.kind = 'person'; _or(); } }, '👤 Một nhân viên'),
teams.length ? h('button', { type: 'button', class: 'lp-chip', 'aria-pressed': String(f.kind === 'team'), 'data-testid': 'push-kind-team', onclick: () => { f.kind = 'team'; _or(); } }, '👥 Nhóm sale') : null),
f.kind === 'person'
? _o0.field('Nhân viên', _o0.select(ps.map((_op) => [_op.id, _op.name + ' – đang giữ ' + _op.open + ' khách']), f.to, { 'data-testid': 'push-person', onchange: (e) => { f.to = e.target.value; } }))
: h('div', null,
_o0.field('Nhóm', _o0.select(teams.map((t) => [t.id, t.name + ' (' + t.members.length + ' người)']), f.team, { 'data-testid': 'push-team', onchange: (e) => { f.team = e.target.value; _or(); } })),
h('strong', null, 'Cách chia'),
h('div', { class: 'lp-chips' }, [['rr', '🔁 Chia đều (lần lượt)'], ['least', '⚖️ Cho người ít khách nhất'], ['manual', '✋ Chọn tay']].map(([k, l]) =>
h('button', { type: 'button', class: 'lp-chip', 'aria-pressed': String(f.mode === k), 'data-testid': 'push-mode-' + k, onclick: () => { f.mode = k; _or(); } }, l))),
f.mode === 'rr' ? h('p', { class: 'bds-muted' }, 'Chia lần lượt từng người trong nhóm; lần đẩy sau tiếp tục từ người kế tiếp.') : null,
f.mode === 'least' ? h('p', { class: 'bds-muted' }, 'Mỗi khách cho người đang giữ ít khách công ty (chưa xong) nhất.') : null,
f.mode === 'manual' ? h('div', null, leads.map((x) => _o0.field(x.name, _o0.select([['', '– chọn người –'], ...members.map((_op) => [_op.id, _op.name])], f.manual[x.id] || '', { 'data-testid': 'push-manual-' + x.id, onchange: (e) => { f.manual[x.id] = e.target.value; } })))) : null),
leads.some((x) => x.dup_owner) ? h('p', { class: 'lp-req' }, '⚠️ Có số đang là khách của nhân viên khác – kiểm tra trước khi đẩy để tránh tranh khách.') : null,
LP.pushBatchNote(leads.length) ? h('p', { class: 'bds-muted', 'data-testid': 'push-batch-note' }, LP.pushBatchNote(leads.length)) : null,
err);
}
_or();
const _oc = _o0.modal({ title: 'Đẩy số', testid: 'push-modal', body: [_o3, h('div', { class: 'bds-row bds-end' },
_o0.button('Huỷ', () => _oc.close(), { icon: 'x', testid: 'push-cancel' }),
_o0.button('Đẩy số', async () => {
const payload = { ids: leads.map((x) => x.id) };
if (f.kind === 'team') { payload.team = f.team; payload.mode = f.mode; if (f.mode === 'manual') { if (leads.some((x) => !f.manual[x.id])) { err.textContent = 'Chọn người nhận cho từng khách.'; return; } payload.manual = f.manual; } }
else { if (!f.to) { err.textContent = 'Chọn nhân viên.'; return; } payload.to = f.to; }
const _os = LP.batches(payload.ids, LP.PUSH_BATCH), sum = {};
let _o8 = 0;
for (let _oa = 0; _oa < _os.length; _oa++) {
try {
const _oz = await _o0.api('pool.push', { ...payload, ids: _os[_oa] });
_o8 += Number(_oz.assigned) || 0;
(_oz.to || []).forEach((t) => { sum[t.name] = (sum[t.name] || 0) + (Number(t.n) || 0); });
_os[_oa].forEach((id) => st.picked.delete(id));
} catch (e) {
const _og = (e && (e.userMessage || e.message)) || 'Chưa đẩy được.';
err.textContent = _os.length > 1 ? 'Đợt ' + (_oa + 1) + '/' + _os.length + ' chưa đẩy được: ' + _og + (_o8 ? ' (đã đẩy ' + _o8 + ' khách ở các đợt trước – chọn lại phần còn lại rồi bấm Đẩy số).' : '') : _og;
if (_o8) _ox();
return;
}
}
_oc.close();
_o0.toast('Đã đẩy ' + _o8 + ' khách' + (_os.length > 1 ? ' (' + _os.length + ' đợt)' : '') + ' ' + LP.toWhom(Object.entries(sum).map(([name, n]) => ({ name, n }))), 'success');
st.picked.clear(); _ox();
}, { kind: 'primary', icon: 'send', testid: 'push-confirm' }))] });
}
function _oo(ids) {
const _ok = st.rows.filter((x) => ids.includes(x.id) && x.status === 'assigned' && _o5(x));
if (!_ok.length) return _o0.toast('Chọn khách đã cấp (của nhóm anh/chị phụ trách) để thu hồi', 'warn');
const leads = _ok.slice(0, LP.RECLAIM_BATCH);
const reason = h('input', { maxlength: 200, 'data-testid': 'reclaim-reason', placeholder: 'vd: quá 1 ngày chưa gọi, sale nghỉ phép' });
const _o2 = !!S().reclaim, teams = _o2 ? (st.info.teams || []) : _oh();
const ps = people().filter((_op) => _o2 || teams.some((t) => t.members.includes(_op.id)));
const to = _o0.select([['', '↩️ Về kho (chưa cấp)'], ...ps.map((_op) => [_op.id, '👤 ' + _op.name]), ...teams.map((t) => ['team:' + t.id, '👥 ' + t.name + ' (chia đều)'])], '', { 'data-testid': 'reclaim-to' });
const err = h('div', { class: 'bds-error', role: 'alert' });
const _oc = _o0.modal({ title: 'Thu hồi ' + leads.length + ' khách', testid: 'reclaim-modal', body: [
h('p', { class: 'bds-muted' }, 'Khách bị rút khỏi danh sách của ' + [...new Set(leads.map((x) => x.assignee_name))].join(', ') + '. Chuyển cho người khác: người nhận thấy đủ lịch sử (trạng thái, ghi chú, nhắc việc), người cũ không còn thấy khách. Lý do được ghi vào lịch sử và nhật ký cho Quản trị.'),
LP.reclaimBatchNote(_ok.length) ? h('p', { class: 'lp-req', 'data-testid': 'reclaim-batch-note' }, '⚠️ ' + LP.reclaimBatchNote(_ok.length)) : null,
_o0.field('Lý do (bắt buộc)', reason), _o0.field('Chuyển tới', to), err,
h('div', { class: 'bds-row bds-end' }, _o0.button('Huỷ', () => _oc.close(), { icon: 'x' }),
_o0.button('Thu hồi', async () => {
if (reason.value.trim().length < 3) { err.textContent = 'Ghi lý do thu hồi.'; return; }
const _op = { ids: leads.map((x) => x.id), reason: reason.value.trim() };
if (to.value.startsWith('team:')) { _op.team = to.value.slice(5); _op.mode = 'rr'; } else if (to.value) _op.to = to.value;
try { const _ow = await _o0.api('pool.reclaim', _op); _oc.close(); _o0.toast('Đã thu hồi ' + _ow.reclaimed + ' khách' + ((_ow.moved || []).length ? ' – chuyển ' + LP.toWhom(_ow.moved) : '') + (_ok.length > leads.length ? ' · còn ' + (_ok.length - leads.length) + ' khách đang chọn – bấm Thu hồi lần nữa' : ''), 'success'); leads.forEach((x) => st.picked.delete(x.id)); _ox(); }
catch (e) { err.textContent = (e && (e.userMessage || e.message)) || 'Chưa thu hồi được.'; }
}, { kind: 'danger', icon: 'undo', testid: 'reclaim-confirm' }))] });
}
async function _om(x) {
const _ow = await _o0.api('pool.history', { id: x.id });
const KIND = { in: '📥 Vào kho', give: '📤 Cấp', back: '↩️ Thu hồi', auto: '⏰ Tự thu hồi', stage: '🔁 Trạng thái', move: '🔀 Chuyển người', erased: '🗑️ Xoá theo yêu cầu' };
const _oc = _o0.modal({ title: 'Lịch sử: ' + x.name, testid: 'lp-history', body: [h('ol', { class: 'bds-timeline' }, (_ow.history || []).slice().reverse().map((e) => h('li', null,
h('small', { class: 'bds-muted' }, _o0.date(e.at) + ' ' + crm.hm(e.at)), ' ',
h('strong', null, KIND[e.k] || e.k), ' ',
e.k === 'give' ? 'cho ' + e.to + ' · bởi ' + e.by : e.k === 'stage' ? e.stage + (e.level ? ' · ' + e.level : '') + (e.why ? ' · ' + e.why : '') + ' · ' + e.by
: e.k === 'back' || e.k === 'auto' ? 'từ ' + e.from + ' · ' + e.why : e.k === 'move' ? e.from + ' → ' + e.to : e.k === 'in' ? (e.how || '') : ''))),
h('div', { class: 'bds-row bds-end' }, _o0.button('Đóng', () => _oc.close(), { icon: 'close' }))] });
}
function _ol(x) {
const reason = h('input', { maxlength: 200, 'data-testid': 'lp-erase-reason', placeholder: 'vd: khách gọi điện yêu cầu ngày 17/11' });
const _oc = _o0.modal({ title: 'Xoá theo yêu cầu khách', testid: 'lp-erase-modal', body: [
h('p', null, 'Xoá vĩnh viễn thông tin cá nhân của "' + x.name + '" ở Kho lead VÀ ở danh sách của mọi nhân viên từng nhận khách này (Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15).'),
_o0.field('Lý do (không ghi tên, số điện thoại khách)', reason),
h('div', { class: 'bds-row bds-end' }, _o0.button('Huỷ', () => _oc.close(), { icon: 'x' }), _o0.button('Xoá vĩnh viễn', async () => {
if (reason.value.trim().length < 3) return _o0.toast('Ghi lý do xoá', 'warn');
const _ow = await _o0.api('pool.erase', { id: x.id, reason: reason.value.trim() }); _oc.close();
_o0.toast('Đã xoá ở kho và ' + _ow.copies + ' bản đã cấp', 'success'); _ox();
}, { kind: 'danger', icon: 'shield', testid: 'lp-erase-confirm' }))] });
}
function openImport() {
const _o9 = h('input', { type: 'file', accept: '.xlsx,.csv,.tsv,.txt', 'data-testid': 'lp-import-file' });
const paste = h('textarea', { rows: 6, 'data-testid': 'lp-import-paste', placeholder: 'Hoặc dán bảng từ Excel / Google Sheet (có dòng tiêu đề), vd:\nHọ tên\tSố điện thoại\tNguồn\tChiến dịch\tQuảng cáo\tChi phí' });
const channel = _o0.select([['', 'Theo cột "Nguồn" trong tệp'], ...Object.entries(LP.CHANNELS)], '', { 'data-testid': 'lp-import-channel' });
const campaign = h('input', { 'data-testid': 'lp-import-campaign', placeholder: 'Tên chiến dịch (nếu tệp không có cột Chiến dịch)' });
const adset = h('input', { 'data-testid': 'lp-import-adset', placeholder: 'Quảng cáo / nhóm quảng cáo (tuỳ chọn)' });
const cost = h('input', { inputmode: 'numeric', 'data-testid': 'lp-import-cost', placeholder: 'Chi phí mỗi khách nếu biết, vd 150000' });
const out = h('div', { 'data-testid': 'lp-import-result' });
let _o17 = null;
_o9.onchange = async () => {
const f = _o9.files && _o9.files[0]; if (!f) return;
try { const O = await import('../../../shared/ooxml.js'); const _oz = await O.parseFile(f, { name: f.name, maxCells: 300000, maxLength: 1 }); _o17 = _oz.kind === 'xlsx' ? (_oz.data.sheets[0] || {}).rows : _oz.data; out.textContent = 'Đã đọc ' + Math.max(0, (_o17 || []).length - 1) + ' dòng.'; }
catch (e) { out.textContent = (e && e.message) || 'Không đọc được tệp.'; }
};
const _oc = _o0.modal({ title: 'Nhập khách vào kho', testid: 'lp-import-modal', body: [
h('p', { class: 'bds-muted' }, 'Máy chủ tự bỏ số đã có trong kho và đánh dấu số đã là khách của nhân viên (không lộ thông tin khách đó).'),
_o0.field('Tệp Excel / CSV', _o9), paste, _o0.field('Nguồn', channel), _o0.field('Chiến dịch', campaign), _o0.field('Quảng cáo / nhóm quảng cáo', adset), _o0.field('Chi phí / khách (đồng)', cost), out,
h('div', { class: 'bds-row bds-end' }, _o0.button('Đóng', () => _oc.close(), { icon: 'close', testid: 'lp-import-close' }), _o0.button('Nhập vào kho', async () => {
const rows = LP.poolRows(_o17 || LP.parseDelimited(paste.value)).rows;
if (!rows.length) { out.textContent = 'Không thấy dòng nào có số điện thoại. Cần dòng tiêu đề có cột "Số điện thoại".'; return; }
const _ow = await _o0.api('pool.import', { rows, channel: channel.value, campaign: campaign.value.trim(), adset: adset.value.trim(), cost: Number(cost.value.replace(/\D/g, '')) || '' });
out.replaceChildren(h('p', { class: 'g3-ok', 'data-testid': 'lp-import-done' }, 'Đã nhập ' + _ow.added + ' khách · bỏ ' + _ow.dup_pool + ' số trùng trong kho' + (_ow.flagged ? ' · ' + _ow.flagged + ' số đang là khách của nhân viên (đã gắn cờ)' : '') + (_ow.bad ? ' · ' + _ow.bad + ' dòng thiếu số' : '') + '.'));
_o17 = null; paste.value = '';
_o0.toast('Đã nhập ' + _ow.added + ' khách vào kho', 'success'); _ox();
}, { kind: 'primary', icon: 'download', testid: 'lp-import-run' }))] });
}
async function _oy(body) {
const rep = await _o0.api('pool.report', { days: st.days });
const _o13 = (t) => h('div', { class: 'g3-scroll', style: { overflowX: 'auto' } }, t);
const table = (head, rows, testid) => _o13(h('table', { class: 'table g3-tbl', 'data-testid': testid }, h('thead', null, h('tr', null, head.map((x, _oa) => h('th', { class: _oa ? 'n' : '' }, x)))),
h('tbody', null, rows.map((_ow) => h('tr', null, _ow.map((x, _oa) => h('td', { class: _oa ? 'n' : '' }, x)))))));
const T = rep.total;
const _o1d = (l, v) => h('div', { class: 'bds-card', style: { padding: '10px', minWidth: '130px', flex: '1' } }, h('small', { class: 'bds-muted' }, l), h('div', { style: { fontSize: '22px', fontWeight: 700 } }, v));
const _od = Math.max(1, ...rep.by_day.map((d) => d.leads));
body.append(
h('div', { class: 'bds-row bds-wrap' }, _o0.select([[7, '7 ngày'], [30, '30 ngày'], [90, '90 ngày']], st.days, { 'aria-label': 'Khoảng thời gian', 'data-testid': 'rep-days', onchange: (e) => { st.days = Number(e.target.value); _ox(); } })),
h('div', { class: 'bds-row bds-wrap', 'data-testid': 'rep-tiles' }, _o1d('Khách', T.leads), _o1d('Đã cấp', T.assigned), _o1d('Tỉ lệ liên hệ', _ot(T.contact_rate)), _o1d('Chốt', T.chot), _o1d('Tỉ lệ rác', _ot(T.junk_rate)), _o1d('Chi phí / lead', T.cpl ? _o0.money(T.cpl) : '–')),
_o0.card({ title: 'Phễu theo chiến dịch', testid: 'rep-funnel', body: table(['Chiến dịch', 'Nguồn', 'Khách', ...T.funnel.map((f) => f.label), 'Rác', 'Tỉ lệ rác', 'Chi phí/khách'],
rep.by_campaign.map((c) => [c.label, c.channel || '', c.leads, ...c.funnel.map((f) => f.n), c.junk, _ot(c.junk_rate), c.cpl ? _o0.money(c.cpl) : '–']), 'rep-campaign') }),
_o0.card({ title: 'Theo nguồn', testid: 'rep-source', body: table(['Nguồn', 'Lead', 'Đã liên hệ', 'Chốt', 'Rác', 'Tỉ lệ rác', 'Chi phí'], rep.by_source.map((c) => [c.label, c.leads, c.contacted, c.chot, c.junk, _ot(c.junk_rate), c.cost ? _o0.money(c.cost) : '–']), 'rep-source-t') }),
_o0.card({ title: 'Bảng xếp hạng sale', testid: 'rep-sellers', body: table(['Nhân viên', 'Được cấp', 'Tỉ lệ liên hệ', 'Gọi lần đầu sau', 'Chốt', 'Tỉ lệ chốt', 'Quá giờ chưa gọi'],
rep.sellers.map((s, _oa) => [(_oa < 3 ? ['🥇', '🥈', '🥉'][_oa] + ' ' : '') + s.name, s.assigned, _ot(s.contact_rate), _of(s.ftc_min), s.won, _ot(s.win_rate), s.overdue]), 'rep-sellers-t') }),
_o0.card({ title: 'Khách đang ở trạng thái', testid: 'rep-stage', body: h('div', { class: 'bds-row bds-wrap' }, rep.by_stage.filter((s) => s.n).map((s) => h('span', null, _o0.badge(s.label + ': ' + s.n, crm.statusTone(s.label))))) }),
_o0.card({ title: 'Mức độ', testid: 'rep-level', body: h('div', { class: 'bds-row bds-wrap' }, LP.LEVELS.map((l) => h('span', { class: 'lp-lv', style: { color: l.color, background: l.bg } }, l.label + ': ' + (rep.levels[l.k] || 0))), h('span', { class: 'bds-muted' }, 'Chưa chọn: ' + (rep.levels.none || 0))) }),
_o0.card({ title: 'Khách theo ngày', testid: 'rep-day', body: h('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '2px', height: '80px' } }, rep.by_day.map((d) => h('div', { title: d.day + ': ' + d.leads + ' khách', style: { flex: '1', minWidth: '2px', background: 'var(--accent,#2563eb)', height: Math.round(d.leads / _od * 100) + '%', opacity: d.leads ? '1' : '.15' } }))) }));
}
function _o1c(body) {
const teams = st.info.teams || [], ps = people(), owner = S().owner;
const _oj = (id) => (ps.find((_op) => _op.id === id) || {}).name || 'Người dùng cũ';
body.appendChild(h('p', { class: 'bds-muted' }, owner ? 'Quản trị tạo nhóm, chọn trưởng nhóm và thành viên. Trưởng nhóm được cấp "Đẩy số" chỉ đẩy được cho nhóm mình.' : 'Nhóm anh/chị phụ trách.'));
for (const t of teams) {
const _oe = owner || (S().leader_of || []).includes(t.id);
body.appendChild(_o0.card({ title: '👥 ' + t.name, testid: 'team-' + t.id, body: [
h('p', null, 'Trưởng nhóm: ' + (t.leader ? _oj(t.leader) : 'chưa có') + ' · Thành viên: ' + (t.members.map(_oj).join(', ') || 'chưa có')),
h('div', { class: 'bds-row bds-wrap' },
_oe ? _o0.button(t.ping ? 'Đang bật nhắc Hẹn xem/Đặt cọc/Chốt' : 'Bật nhắc Hẹn xem/Đặt cọc/Chốt', async () => { await _o0.api('pool.team_ping', { id: t.id, on: !t.ping }); _ox(); }, { icon: 'clock', testid: 'team-ping-' + t.id }) : null,
owner ? _o0.button('Sửa', () => _o1a(t), { icon: 'settings', testid: 'team-edit-' + t.id }) : null,
owner ? _o0.button('Xoá nhóm', async () => { if (await _o0.confirm({ title: 'Xoá nhóm "' + t.name + '"?', text: 'Khách đã cấp giữ nguyên.', kind: 'danger', ok: 'Xoá' })) { await _o0.api('pool.team_delete', { id: t.id }); _ox(); } }, { kind: 'ghost', icon: 'x', testid: 'team-del-' + t.id }) : null)] }));
}
if (owner) body.appendChild(_o0.button('Thêm nhóm sale', () => _o1a(null), { kind: 'primary', icon: 'plus', testid: 'team-add' }));
function _o1a(t) {
t = t || { name: '', leader: '', members: [] };
const name = h('input', { value: t.name, 'data-testid': 'team-name', placeholder: 'vd Nhóm Quận 7' });
const leader = _o0.select([['', '– chưa có –'], ...ps.map((_op) => [_op.id, _op.name])], t.leader, { 'data-testid': 'team-leader' });
const _o4 = ps.map((_op) => h('label', { class: 'bds-row' }, h('input', { type: 'checkbox', value: _op.id, checked: t.members.includes(_op.id), 'data-testid': 'team-mem-' + _op.id }), _op.name));
const _oc = _o0.modal({ title: t.id ? 'Sửa nhóm' : 'Thêm nhóm sale', testid: 'team-modal', body: [_o0.field('Tên nhóm', name), _o0.field('Trưởng nhóm', leader), h('strong', null, 'Thành viên'), h('div', null, _o4),
h('div', { class: 'bds-row bds-end' }, _o0.button('Huỷ', () => _oc.close(), { icon: 'x' }), _o0.button('Lưu nhóm', async () => {
await _o0.api('pool.team_save', { team: { id: t.id, name: name.value.trim(), leader: leader.value, members: _o4.map((b) => b.querySelector('input')).filter((_oa) => _oa.checked).map((_oa) => _oa.value) } });
_oc.close(); _o0.toast('Đã lưu nhóm', 'success'); _ox();
}, { kind: 'primary', icon: 'check', testid: 'team-save' }))] });
}
}
function _o16(body) {
const c = st.info.config || {}, ch = c.cheer || {};
const num = (v, tid) => h('input', { type: 'number', min: 0, max: 720, value: v, 'data-testid': tid, style: { maxWidth: '120px' } });
const _o7 = (v, tid) => h('input', { type: 'checkbox', checked: !!Number(v), 'data-testid': tid });
const f = { overdue: num(c.overdue_h, 'cfg-overdue'), auto: num(c.auto_h, 'cfg-auto'), intake: _o7(c.intake_pool, 'cfg-intake'), ping: _o7(c.ping_admin, 'cfg-ping'),
on: _o7(ch.on, 'cfg-cheer-on'), proj: _o7(ch.show_project, 'cfg-cheer-project'), val: _o7(ch.show_value, 'cfg-cheer-value'), confirm: _o7(ch.confirm, 'cfg-cheer-confirm'),
aud: _o0.select([['all', 'Toàn công ty'], ['team', 'Chỉ nhóm của sale']], ch.audience || 'all', { 'data-testid': 'cfg-cheer-audience' }),
tpl: h('input', { value: ch.template || '', maxlength: 300, 'data-testid': 'cfg-cheer-template', placeholder: '🎉 Chúc mừng {sale}{nhom} vừa chốt thành công {du_an}!' }) };
const _o11 = (label, input, hint) => h('label', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, label), input, hint ? h('small', { class: 'bds-field-h' }, hint) : null);
body.append(
_o0.card({ title: 'Kho lead', body: [
_o11('Cảnh báo khách "Mới nhận" sau (giờ)', f.overdue, 'Mặc định 2 giờ.'),
_o11('Tự thu hồi nếu chưa liên hệ sau (giờ)', f.auto, '0 = TẮT (mặc định). Khách quá giờ tự về kho, ghi lý do.'),
h('label', { class: 'bds-row' }, f.intake, 'Khách từ landing công ty / khoá nhận khách chung vào Kho lead'),
h('label', { class: 'bds-row' }, f.ping, 'Nhắc Quản trị (Telegram chung) khi khách công ty cấp tới Hẹn xem / Đặt cọc / Chốt')] }),
_o0.card({ title: '🎉 Chúc mừng chốt đơn', testid: 'cfg-cheer', body: [
h('label', { class: 'bds-row' }, f.on, 'Bật chúc mừng khi khách công ty cấp được Chốt'),
_o11('Ai nhận', f.aud),
h('label', { class: 'bds-row' }, f.proj, 'Hiện dự án / loại sản phẩm'),
h('label', { class: 'bds-row' }, f.val, 'Hiện giá trị giao dịch'),
h('label', { class: 'bds-row' }, f.confirm, 'Cần Quản trị/Trưởng nhóm xác nhận trước khi chúc mừng'),
_o11('Lời chúc riêng (tuỳ chọn)', f.tpl, 'Dùng {sale}, {nhom}, {du_an}, {loai}, {gia_tri}. Không bao giờ có tên/số điện thoại khách.')] }),
_o0.button('Lưu cài đặt', async () => {
await _o0.api('pool.config', { overdue_h: Number(f.overdue.value) || 2, auto_h: Number(f.auto.value) || 0, intake_pool: f.intake.checked, ping_admin: f.ping.checked,
cheer: { on: f.on.checked, audience: f.aud.value, show_project: f.proj.checked, show_value: f.val.checked, confirm: f.confirm.checked, template: f.tpl.value.trim() } });
_o0.toast('Đã lưu cài đặt Kho lead', 'success'); _ox();
}, { kind: 'primary', icon: 'check', testid: 'cfg-save' }));
}
await _ox();
}
export default {
manifest: {
id: 'lead_pool', title: 'Kho lead', icon: '📥', screen: 'customers', order: 12, version: '1.0.0', status: 'ready', requires: 'lead_any',
help: 'Kho lead công ty: nhập khách từ quảng cáo, đẩy số cho nhân viên hoặc nhóm sale, thu hồi, xem trạng thái và báo cáo nguồn khách. Chỉ bản Công ty.',
},
mount,
async selftest() { return { ok: LP.STAGES.length === 11 && !!LP.LEVEL.hot, details: 'lead_pool' }; },
};

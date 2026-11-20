import { kit, h } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import * as LP from '../_lib/lead_pool.js';
const _os = (v) => (v === null || v === undefined ? '–' : String(v).replace('.', ',') + '%');
const _oe = (_ob) => (_ob === null || _ob === undefined ? '–' : _ob < 60 ? _ob + ' phút' : Math.round(_ob / 6) / 10 + ' giờ');
export async function mount(el, ctx) {
const _o0 = kit(ctx);
LP.ensureLpCss();
const st = { tab: 'pool', f: { q: '', state: '', stage: '', level: '', channel: '', campaign: '' }, picked: new Set(), info: null, rows: [], days: 30, feed: null };
const _oz = h('div', { class: 'bds-screen', 'data-testid': 'lead-pool' });
el.replaceChildren(_oz);
async function _oa() {
st.info = await _o0.api('pool.info');
try { st.feed = await _o0.api('cheer.feed'); } catch { st.feed = null; }
}
const S = () => (st.info && st.info.scope) || {};
const _o17 = () => [['pool', 'Kho lead', S().pool || S().push, 'inbox'], ['report', 'Báo cáo', S().report, 'pulse'], ['teams', 'Nhóm sale', S().owner || (S().leader_of || []).length, 'customers'], ['settings', 'Cài đặt', S().owner, 'settings']].filter((t) => t[2]);
async function _ow() {
_oz.replaceChildren(h('div', { class: 'bds-head' }, h('h2', null, 'Kho lead công ty')), h('p', { class: 'bds-muted' }, 'Đang tải…'));
try { await _oa(); } catch (e) { _oz.replaceChildren(h('div', { class: 'bds-head' }, h('h2', null, 'Kho lead công ty')), _o0.empty((e && (e.userMessage || e.message)) || 'Chưa mở được Kho lead.')); return; }
const _o1e = _o17();
if (!_o1e.some((t) => t[0] === st.tab)) st.tab = _o1e.length ? _o1e[0][0] : 'pool';
const bar = h('div', { class: 'bds-row bds-wrap', role: 'tablist', 'data-testid': 'lp-tabs' }, _o1e.map(([k, l, , ic]) =>
_o0.button(l, () => { st.tab = k; _ow(); }, { kind: st.tab === k ? 'primary' : 'ghost', icon: ic, testid: 'lp-tab-' + k })));
const body = h('div', { 'data-testid': 'lp-body-' + st.tab });
_oz.replaceChildren(h('div', { class: 'bds-head' }, h('h2', null, 'Kho lead công ty')), bar, body);
if (st.tab === 'pool') await _ou(body);
else if (st.tab === 'report') await _ox(body);
else if (st.tab === 'teams') _o1b(body);
else _o15(body);
}
async function _ou(body) {
const _ov = await _o0.api('pool.list');
st.rows = _ov.rows || [];
const _ot = (st.feed && st.feed.pending) || [];
if (_ot.length) body.appendChild(_o0.card({ title: '🎉 Chờ xác nhận chúc mừng chốt đơn', testid: 'lp-cheer-pending', body: _ot.map((c) => h('div', { class: 'bds-row bds-wrap' },
h('span', null, c.text),
_o0.button('Xác nhận', async () => { await _o0.api('cheer.confirm', { id: c.id }); _o0.toast('Đã gửi lời chúc mừng tới mọi người', 'success'); _ow(); }, { kind: 'primary', icon: 'check', testid: 'cheer-confirm-' + c.id }),
_o0.button('Bỏ qua', async () => { await _o0.api('cheer.confirm', { id: c.id, reject: true }); _ow(); }, { icon: 'x', testid: 'cheer-reject-' + c.id }))) }));
const _o1d = h('div', { class: 'bds-row bds-wrap bds-tools' },
S().pool ? _o0.button('Nhập khách', () => openImport(), { kind: 'primary', icon: 'plus', testid: 'lp-import' }) : null,
_o0.button('Tải lại', () => _ow(), { icon: 'refresh', testid: 'lp-reload' }));
const camps = [...new Set(st.rows.map((x) => x.campaign).filter(Boolean))].sort();
const _o13 = (opts, key, label) => _o0.select(opts, st.f[key], { 'aria-label': label, 'data-testid': 'lp-f-' + key, onchange: (e) => { st.f[key] = e.target.value; _op(); } });
const search = h('input', { type: 'search', value: st.f.q, placeholder: 'Tìm tên, số, chiến dịch, người nhận…', 'aria-label': 'Tìm khách trong kho', 'data-testid': 'lp-search', oninput: (e) => { st.f.q = e.target.value; _op(); } });
const filters = h('div', { class: 'bds-toolbar' }, search, h('div', { class: 'bds-filters' },
_o13([['', 'Tất cả'], ['new', 'Chưa cấp'], ['assigned', 'Đã cấp'], ['overdue', '⏰ Quá giờ chưa gọi']], 'state', 'Tình trạng'),
_o13([['', 'Mọi tiến độ'], ...LP.STAGES.map((s) => [s.k, s.label])], 'stage', 'Tiến độ'),
_o13([['', 'Mọi mức độ'], ...LP.LEVELS.map((l) => [l.k, l.label])], 'level', 'Mức độ'),
_o13([['', 'Mọi nguồn'], ...Object.entries(LP.CHANNELS)], 'channel', 'Nguồn'),
_o13([['', 'Mọi chiến dịch'], ...camps.map((c) => [c, c])], 'campaign', 'Chiến dịch')));
const _o14 = h('strong', null, '0');
const selBar = h('div', { class: 'bds-selbar', 'data-testid': 'lp-selbar', hidden: true }, h('span', null, 'Đã chọn ', _o14),
h('div', { class: 'bds-row bds-wrap' },
S().push ? _o0.button('Đẩy số', () => _om([...st.picked]), { kind: 'primary', icon: 'send', testid: 'lp-push-selected' }) : null,
S().reclaim || S().reclaim_team ? _o0.button('Thu hồi', () => _on([...st.picked]), { icon: 'undo', testid: 'lp-reclaim-selected' }) : null,
_o0.button('Bỏ chọn', () => { st.picked.clear(); _op(); }, { kind: 'ghost', icon: 'x', testid: 'lp-unpick' })));
const count = h('p', { class: 'bds-muted', 'data-testid': 'lp-count' });
const list = h('div', { class: 'bds-list', 'data-testid': 'lp-list' });
body.append(_o1d, filters, selBar, count, list);
function _op() {
const rows = LP.filterPool(st.rows, st.f);
const _oh = st.rows.filter((x) => x.status === 'new').length, nOver = st.rows.filter((x) => x.overdue).length;
count.textContent = rows.length + ' khách đang hiện · ' + _oh + ' chưa cấp' + (nOver ? ' · ' + nOver + ' khách quá ' + (_ov.overdue_h || 2) + ' giờ chưa gọi' : '');
for (const id of [...st.picked]) if (!st.rows.some((x) => x.id === id)) st.picked.delete(id);
selBar.hidden = !st.picked.size; _o14.textContent = String(st.picked.size);
list.replaceChildren(...(rows.length ? rows.slice(0, 500).map(_o11) : [_o0.empty(st.rows.length ? 'Không có khách khớp bộ lọc.' : 'Kho đang trống. Bấm "Nhập khách" hoặc nối landing công ty (khoá nhận khách chung) để khách tự vào kho.')]));
}
function _o11(x) {
const _o6 = h('input', { type: 'checkbox', class: 'bds-pick', 'aria-label': 'Chọn ' + x.name, 'data-testid': 'lp-pick-' + x.id, checked: st.picked.has(x.id),
onchange: (e) => { if (e.target.checked) st.picked.add(x.id); else st.picked.delete(x.id); selBar.hidden = !st.picked.size; _o14.textContent = String(st.picked.size); } });
const _o18 = h('span', { class: 'bds-row bds-wrap' },
h('span', { class: 'lp-badge', style: { background: '#e0f2fe', color: '#075985' } }, x.channel_label + (x.campaign ? ' · ' + x.campaign : '')),
x.status === 'assigned' ? _o0.badge(x.stage_label, crm.statusTone(x.stage_label)) : _o0.badge('Chưa cấp', 'info'),
LP.levelBadge(x.level),
x.overdue ? h('span', { class: 'lp-lv lp-warn', 'data-testid': 'lp-overdue-' + x.id }, '⏰ Chưa gọi > ' + (_ov.overdue_h || 2) + ' giờ') : null,
x.dup_owner ? h('span', { class: 'lp-lv lp-warn', title: 'Số này đã có trong danh sách khách của nhân viên – tránh trả tiền 2 lần / tranh khách', 'data-testid': 'lp-dup-' + x.id }, '⚠️ Đang là khách của ' + x.dup_owner) : null);
const _o1 = h('div', { class: 'bds-acts bds-wrap' },
x.status === 'new' && S().push ? _o0.button('Đẩy số', () => _om([x.id]), { kind: 'primary', icon: 'send', small: true, testid: 'lp-push-' + x.id }) : null,
x.status === 'assigned' && _o5(x) ? _o0.button('Thu hồi', () => _on([x.id]), { icon: 'undo', small: true, testid: 'lp-reclaim-' + x.id }) : null,
_o0.button('Lịch sử', () => _ol(x), { kind: 'ghost', icon: 'log', small: true, testid: 'lp-hist-' + x.id }),
S().owner ? _o0.button('Xoá theo yêu cầu', () => _ok(x), { kind: 'ghost', icon: 'shield', small: true, testid: 'lp-erase-' + x.id }) : null);
return h('div', { class: 'bds-item', 'data-id': x.id, 'data-testid': 'lp-row-' + x.id },
h('label', { class: 'bds-pick-wrap' }, _o6),
h('div', { class: 'bds-row-main' }, h('strong', { class: 'bds-name' }, x.name), h('span', { class: 'bds-sub' }, [x.phone, x.project].filter(Boolean).join(' · ')),
h('span', { class: 'bds-sub', 'data-testid': 'lp-status-' + x.id }, x.status_text + (x.reason ? ' · Lý do: ' + x.reason : '') + (x.last_contact_at ? ' · Liên hệ cuối ' + _o0.date(x.last_contact_at) + ' ' + crm.hm(x.last_contact_at) : '')),
_o18), _o1);
}
_op();
}
const _og = () => ((st.info && st.info.teams) || []).filter((t) => (S().leader_of || []).includes(t.id));
const _o5 = (x) => !!(S().reclaim || (S().reclaim_team && _og().some((t) => t.members.includes(x.assignee))));
function people() { return ((st.info && st.info.people) || []).filter((_oo) => _oo.role !== 'owner' || S().owner); }
function _o1a(id) { const t = ((st.info && st.info.teams) || []).find((x) => x.id === id); return t ? t.name : ''; }
function _om(ids) {
if (!ids.length) return _o0.toast('Chọn ít nhất 1 khách', 'warn');
const leads = st.rows.filter((x) => ids.includes(x.id) && x.status === 'new');
if (!leads.length) return _o0.toast('Các khách đã chọn đều đã cấp – thu hồi trước nếu muốn cấp lại', 'warn');
const teams = (st.info.teams || []).filter((t) => S().push_all || (S().leader_of || []).includes(t.id));
const ps = people().filter((_oo) => S().push_all || teams.some((t) => t.members.includes(_oo.id)));
const f = { kind: teams.length ? 'team' : 'person', to: ps[0] ? ps[0].id : '', team: teams[0] ? teams[0].id : '', mode: 'rr', manual: {} };
const _o3 = h('div');
const err = h('div', { class: 'bds-error', role: 'alert' });
function _oq() {
const team = teams.find((t) => t.id === f.team);
const members = team ? ps.filter((_oo) => team.members.includes(_oo.id)) : [];
_o3.replaceChildren(
h('p', null, 'Đẩy ' + leads.length + ' khách cho:'),
h('div', { class: 'lp-chips' },
h('button', { type: 'button', class: 'lp-chip', 'aria-pressed': String(f.kind === 'person'), 'data-testid': 'push-kind-person', onclick: () => { f.kind = 'person'; _oq(); } }, '👤 Một nhân viên'),
teams.length ? h('button', { type: 'button', class: 'lp-chip', 'aria-pressed': String(f.kind === 'team'), 'data-testid': 'push-kind-team', onclick: () => { f.kind = 'team'; _oq(); } }, '👥 Nhóm sale') : null),
f.kind === 'person'
? _o0.field('Nhân viên', _o0.select(ps.map((_oo) => [_oo.id, _oo.name + ' – đang giữ ' + _oo.open + ' khách']), f.to, { 'data-testid': 'push-person', onchange: (e) => { f.to = e.target.value; } }))
: h('div', null,
_o0.field('Nhóm', _o0.select(teams.map((t) => [t.id, t.name + ' (' + t.members.length + ' người)']), f.team, { 'data-testid': 'push-team', onchange: (e) => { f.team = e.target.value; _oq(); } })),
h('strong', null, 'Cách chia'),
h('div', { class: 'lp-chips' }, [['rr', '🔁 Chia đều (lần lượt)'], ['least', '⚖️ Cho người ít khách nhất'], ['manual', '✋ Chọn tay']].map(([k, l]) =>
h('button', { type: 'button', class: 'lp-chip', 'aria-pressed': String(f.mode === k), 'data-testid': 'push-mode-' + k, onclick: () => { f.mode = k; _oq(); } }, l))),
f.mode === 'rr' ? h('p', { class: 'bds-muted' }, 'Chia lần lượt từng người trong nhóm; lần đẩy sau tiếp tục từ người kế tiếp.') : null,
f.mode === 'least' ? h('p', { class: 'bds-muted' }, 'Mỗi khách cho người đang giữ ít khách công ty (chưa xong) nhất.') : null,
f.mode === 'manual' ? h('div', null, leads.map((x) => _o0.field(x.name, _o0.select([['', '– chọn người –'], ...members.map((_oo) => [_oo.id, _oo.name])], f.manual[x.id] || '', { 'data-testid': 'push-manual-' + x.id, onchange: (e) => { f.manual[x.id] = e.target.value; } })))) : null),
leads.some((x) => x.dup_owner) ? h('p', { class: 'lp-req' }, '⚠️ Có số đang là khách của nhân viên khác – kiểm tra trước khi đẩy để tránh tranh khách.') : null,
LP.pushBatchNote(leads.length) ? h('p', { class: 'bds-muted', 'data-testid': 'push-batch-note' }, LP.pushBatchNote(leads.length)) : null,
err);
}
_oq();
const _ob = _o0.modal({ title: 'Đẩy số', testid: 'push-modal', body: [_o3, h('div', { class: 'bds-row bds-end' },
_o0.button('Huỷ', () => _ob.close(), { icon: 'x', testid: 'push-cancel' }),
_o0.button('Đẩy số', async () => {
const payload = { ids: leads.map((x) => x.id) };
if (f.kind === 'team') { payload.team = f.team; payload.mode = f.mode; if (f.mode === 'manual') { if (leads.some((x) => !f.manual[x.id])) { err.textContent = 'Chọn người nhận cho từng khách.'; return; } payload.manual = f.manual; } }
else { if (!f.to) { err.textContent = 'Chọn nhân viên.'; return; } payload.to = f.to; }
const _or = LP.batches(payload.ids, LP.PUSH_BATCH), sum = {};
let _o8 = 0;
for (let _o9 = 0; _o9 < _or.length; _o9++) {
try {
const _oy = await _o0.api('pool.push', { ...payload, ids: _or[_o9] });
_o8 += Number(_oy.assigned) || 0;
(_oy.to || []).forEach((t) => { sum[t.name] = (sum[t.name] || 0) + (Number(t.n) || 0); });
_or[_o9].forEach((id) => st.picked.delete(id));
} catch (e) {
const _of = (e && (e.userMessage || e.message)) || 'Chưa đẩy được.';
err.textContent = _or.length > 1 ? 'Đợt ' + (_o9 + 1) + '/' + _or.length + ' chưa đẩy được: ' + _of + (_o8 ? ' (đã đẩy ' + _o8 + ' khách ở các đợt trước – chọn lại phần còn lại rồi bấm Đẩy số).' : '') : _of;
if (_o8) _ow();
return;
}
}
_ob.close();
_o0.toast('Đã đẩy ' + _o8 + ' khách' + (_or.length > 1 ? ' (' + _or.length + ' đợt)' : '') + ' ' + LP.toWhom(Object.entries(sum).map(([name, n]) => ({ name, n }))), 'success');
st.picked.clear(); _ow();
}, { kind: 'primary', icon: 'send', testid: 'push-confirm' }))] });
}
function _on(ids) {
const _oj = st.rows.filter((x) => ids.includes(x.id) && x.status === 'assigned' && _o5(x));
if (!_oj.length) return _o0.toast('Chọn khách đã cấp (của nhóm anh/chị phụ trách) để thu hồi', 'warn');
const leads = _oj.slice(0, LP.RECLAIM_BATCH);
const reason = h('input', { maxlength: 200, 'data-testid': 'reclaim-reason', placeholder: 'vd: quá 1 ngày chưa gọi, sale nghỉ phép' });
const _o2 = !!S().reclaim, teams = _o2 ? (st.info.teams || []) : _og();
const ps = people().filter((_oo) => _o2 || teams.some((t) => t.members.includes(_oo.id)));
const to = _o0.select([['', '↩️ Về kho (chưa cấp)'], ...ps.map((_oo) => [_oo.id, '👤 ' + _oo.name]), ...teams.map((t) => ['team:' + t.id, '👥 ' + t.name + ' (chia đều)'])], '', { 'data-testid': 'reclaim-to' });
const err = h('div', { class: 'bds-error', role: 'alert' });
const _ob = _o0.modal({ title: 'Thu hồi ' + leads.length + ' khách', testid: 'reclaim-modal', body: [
h('p', { class: 'bds-muted' }, 'Khách bị rút khỏi danh sách của ' + [...new Set(leads.map((x) => x.assignee_name))].join(', ') + '. Chuyển cho người khác: người nhận thấy đủ lịch sử (trạng thái, ghi chú, nhắc việc), người cũ không còn thấy khách. Lý do được ghi vào lịch sử và nhật ký cho Quản trị.'),
LP.reclaimBatchNote(_oj.length) ? h('p', { class: 'lp-req', 'data-testid': 'reclaim-batch-note' }, '⚠️ ' + LP.reclaimBatchNote(_oj.length)) : null,
_o0.field('Lý do (bắt buộc)', reason), _o0.field('Chuyển tới', to), err,
h('div', { class: 'bds-row bds-end' }, _o0.button('Huỷ', () => _ob.close(), { icon: 'x' }),
_o0.button('Thu hồi', async () => {
if (reason.value.trim().length < 3) { err.textContent = 'Ghi lý do thu hồi.'; return; }
const _oo = { ids: leads.map((x) => x.id), reason: reason.value.trim() };
if (to.value.startsWith('team:')) { _oo.team = to.value.slice(5); _oo.mode = 'rr'; } else if (to.value) _oo.to = to.value;
try { const _ov = await _o0.api('pool.reclaim', _oo); _ob.close(); _o0.toast('Đã thu hồi ' + _ov.reclaimed + ' khách' + ((_ov.moved || []).length ? ' – chuyển ' + LP.toWhom(_ov.moved) : '') + (_oj.length > leads.length ? ' · còn ' + (_oj.length - leads.length) + ' khách đang chọn – bấm Thu hồi lần nữa' : ''), 'success'); leads.forEach((x) => st.picked.delete(x.id)); _ow(); }
catch (e) { err.textContent = (e && (e.userMessage || e.message)) || 'Chưa thu hồi được.'; }
}, { kind: 'danger', icon: 'undo', testid: 'reclaim-confirm' }))] });
}
async function _ol(x) {
const _ov = await _o0.api('pool.history', { id: x.id });
const KIND = { in: '📥 Vào kho', give: '📤 Cấp', back: '↩️ Thu hồi', auto: '⏰ Tự thu hồi', stage: '🔁 Trạng thái', move: '🔀 Chuyển người', erased: '🗑️ Xoá theo yêu cầu' };
const _ob = _o0.modal({ title: 'Lịch sử: ' + x.name, testid: 'lp-history', body: [h('ol', { class: 'bds-timeline' }, (_ov.history || []).slice().reverse().map((e) => h('li', null,
h('small', { class: 'bds-muted' }, _o0.date(e.at) + ' ' + crm.hm(e.at)), ' ',
h('strong', null, KIND[e.k] || e.k), ' ',
e.k === 'give' ? 'cho ' + e.to + ' · bởi ' + e.by : e.k === 'stage' ? e.stage + (e.level ? ' · ' + e.level : '') + (e.why ? ' · ' + e.why : '') + ' · ' + e.by
: e.k === 'back' || e.k === 'auto' ? 'từ ' + e.from + ' · ' + e.why : e.k === 'move' ? e.from + ' → ' + e.to : e.k === 'in' ? (e.how || '') : ''))),
h('div', { class: 'bds-row bds-end' }, _o0.button('Đóng', () => _ob.close(), { icon: 'close' }))] });
}
function _ok(x) {
const reason = h('input', { maxlength: 200, 'data-testid': 'lp-erase-reason', placeholder: 'vd: khách gọi điện yêu cầu ngày 17/11' });
const _ob = _o0.modal({ title: 'Xoá theo yêu cầu khách', testid: 'lp-erase-modal', body: [
h('p', null, 'Xoá vĩnh viễn thông tin cá nhân của "' + x.name + '" ở Kho lead VÀ ở danh sách của mọi nhân viên từng nhận khách này (Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15).'),
_o0.field('Lý do (không ghi tên, số điện thoại khách)', reason),
h('div', { class: 'bds-row bds-end' }, _o0.button('Huỷ', () => _ob.close(), { icon: 'x' }), _o0.button('Xoá vĩnh viễn', async () => {
if (reason.value.trim().length < 3) return _o0.toast('Ghi lý do xoá', 'warn');
const _ov = await _o0.api('pool.erase', { id: x.id, reason: reason.value.trim() }); _ob.close();
_o0.toast('Đã xoá ở kho và ' + _ov.copies + ' bản đã cấp', 'success'); _ow();
}, { kind: 'danger', icon: 'shield', testid: 'lp-erase-confirm' }))] });
}
function openImport() {
const file = h('input', { type: 'file', accept: '.xlsx,.csv,.tsv,.txt', 'data-testid': 'lp-import-file' });
const paste = h('textarea', { rows: 6, 'data-testid': 'lp-import-paste', placeholder: 'Hoặc dán bảng từ Excel / Google Sheet (có dòng tiêu đề), vd:\nHọ tên\tSố điện thoại\tNguồn\tChiến dịch\tQuảng cáo\tChi phí' });
const channel = _o0.select([['', 'Theo cột "Nguồn" trong tệp'], ...Object.entries(LP.CHANNELS)], '', { 'data-testid': 'lp-import-channel' });
const campaign = h('input', { 'data-testid': 'lp-import-campaign', placeholder: 'Tên chiến dịch (nếu tệp không có cột Chiến dịch)' });
const adset = h('input', { 'data-testid': 'lp-import-adset', placeholder: 'Quảng cáo / nhóm quảng cáo (tuỳ chọn)' });
const cost = h('input', { inputmode: 'numeric', 'data-testid': 'lp-import-cost', placeholder: 'Chi phí mỗi khách nếu biết, vd 150000' });
const out = h('div', { 'data-testid': 'lp-import-result' });
const agree = h('input', { type: 'checkbox', 'data-testid': 'lp-import-consent' });
const agreeRow = h('label', { class: 'bds-row', style: { alignItems: 'flex-start', gap: '8px' } }, agree,
h('span', null, 'Khách trong danh sách đã đồng ý cho công ty lưu thông tin và liên hệ tư vấn (bắt buộc).'));
let _o16 = null, fileName = '';
file.onchange = async () => {
const f = file.files && file.files[0]; if (!f) return;
fileName = f.name || '';
try { const O = await import('../../../shared/ooxml.js'); const _oy = await O.parseFile(f, { name: f.name, maxCells: 300000, maxLength: 1 }); _o16 = _oy.kind === 'xlsx' ? (_oy.data.sheets[0] || {}).rows : _oy.data; out.textContent = 'Đã đọc ' + Math.max(0, (_o16 || []).length - 1) + ' dòng.'; }
catch (e) { out.textContent = (e && e.message) || 'Không đọc được tệp.'; }
};
const _ob = _o0.modal({ title: 'Nhập khách vào kho', testid: 'lp-import-modal', body: [
h('p', { class: 'bds-muted' }, 'Máy chủ tự bỏ số đã có trong kho và đánh dấu số đã là khách của nhân viên (không lộ thông tin khách đó).'),
_o0.field('Tệp Excel / CSV', file), paste, _o0.field('Nguồn', channel), _o0.field('Chiến dịch', campaign), _o0.field('Quảng cáo / nhóm quảng cáo', adset), _o0.field('Chi phí / khách (đồng)', cost), agreeRow, out,
h('div', { class: 'bds-row bds-end' }, _o0.button('Đóng', () => _ob.close(), { icon: 'close', testid: 'lp-import-close' }), _o0.button('Nhập vào kho', async () => {
const rows = LP.poolRows(_o16 || LP.parseDelimited(paste.value)).rows;
if (!rows.length) { out.textContent = 'Không thấy dòng nào có số điện thoại. Cần dòng tiêu đề có cột "Số điện thoại".'; return; }
if (!agree.checked) { out.textContent = 'Tick ô xác nhận khách đã đồng ý cho công ty liên hệ trước khi nhập.'; agree.focus(); return; }
const _ov = await _o0.api('pool.import', { rows, channel: channel.value, campaign: campaign.value.trim(), adset: adset.value.trim(), cost: Number(cost.value.replace(/\D/g, '')) || '',
consent_confirm: true, file: fileName || (_o16 ? '' : 'dán từ bảng tính') });
out.replaceChildren(h('p', { class: 'g3-ok', 'data-testid': 'lp-import-done' }, 'Đã nhập ' + _ov.added + ' khách · bỏ ' + _ov.dup_pool + ' số trùng trong kho' + (_ov.flagged ? ' · ' + _ov.flagged + ' số đang là khách của nhân viên (đã gắn cờ)' : '') + (_ov.bad ? ' · ' + _ov.bad + ' dòng thiếu số' : '') + '.'));
_o16 = null; paste.value = ''; agree.checked = false; fileName = '';
_o0.toast('Đã nhập ' + _ov.added + ' khách vào kho', 'success'); _ow();
}, { kind: 'primary', icon: 'download', testid: 'lp-import-run' }))] });
}
async function _ox(body) {
const rep = await _o0.api('pool.report', { days: st.days });
const _o12 = (t) => h('div', { class: 'g3-scroll', style: { overflowX: 'auto' } }, t);
const table = (head, rows, testid) => _o12(h('table', { class: 'table g3-tbl', 'data-testid': testid }, h('thead', null, h('tr', null, head.map((x, _o9) => h('th', { class: _o9 ? 'n' : '' }, x)))),
h('tbody', null, rows.map((_ov) => h('tr', null, _ov.map((x, _o9) => h('td', { class: _o9 ? 'n' : '' }, x)))))));
const T = rep.total;
const _o1c = (l, v) => h('div', { class: 'bds-card', style: { padding: '10px', minWidth: '130px', flex: '1' } }, h('small', { class: 'bds-muted' }, l), h('div', { style: { fontSize: '22px', fontWeight: 700 } }, v));
const _oc = Math.max(1, ...rep.by_day.map((d) => d.leads));
body.append(
h('div', { class: 'bds-row bds-wrap' }, _o0.select([[7, '7 ngày'], [30, '30 ngày'], [90, '90 ngày']], st.days, { 'aria-label': 'Khoảng thời gian', 'data-testid': 'rep-days', onchange: (e) => { st.days = Number(e.target.value); _ow(); } })),
h('div', { class: 'bds-row bds-wrap', 'data-testid': 'rep-tiles' }, _o1c('Khách', T.leads), _o1c('Đã cấp', T.assigned), _o1c('Tỉ lệ liên hệ', _os(T.contact_rate)), _o1c('Chốt', T.chot), _o1c('Tỉ lệ rác', _os(T.junk_rate)), _o1c('Chi phí / lead', T.cpl ? _o0.money(T.cpl) : '–')),
_o0.card({ title: 'Phễu theo chiến dịch', testid: 'rep-funnel', body: table(['Chiến dịch', 'Nguồn', 'Khách', ...T.funnel.map((f) => f.label), 'Rác', 'Tỉ lệ rác', 'Chi phí/khách'],
rep.by_campaign.map((c) => [c.label, c.channel || '', c.leads, ...c.funnel.map((f) => f.n), c.junk, _os(c.junk_rate), c.cpl ? _o0.money(c.cpl) : '–']), 'rep-campaign') }),
_o0.card({ title: 'Theo nguồn', testid: 'rep-source', body: table(['Nguồn', 'Lead', 'Đã liên hệ', 'Chốt', 'Rác', 'Tỉ lệ rác', 'Chi phí'], rep.by_source.map((c) => [c.label, c.leads, c.contacted, c.chot, c.junk, _os(c.junk_rate), c.cost ? _o0.money(c.cost) : '–']), 'rep-source-t') }),
_o0.card({ title: 'Bảng xếp hạng sale', testid: 'rep-sellers', body: table(['Nhân viên', 'Được cấp', 'Tỉ lệ liên hệ', 'Gọi lần đầu sau', 'Chốt', 'Tỉ lệ chốt', 'Quá giờ chưa gọi'],
rep.sellers.map((s, _o9) => [(_o9 < 3 ? ['🥇', '🥈', '🥉'][_o9] + ' ' : '') + s.name, s.assigned, _os(s.contact_rate), _oe(s.ftc_min), s.won, _os(s.win_rate), s.overdue]), 'rep-sellers-t') }),
_o0.card({ title: 'Khách đang ở trạng thái', testid: 'rep-stage', body: h('div', { class: 'bds-row bds-wrap' }, rep.by_stage.filter((s) => s.n).map((s) => h('span', null, _o0.badge(s.label + ': ' + s.n, crm.statusTone(s.label))))) }),
_o0.card({ title: 'Mức độ', testid: 'rep-level', body: h('div', { class: 'bds-row bds-wrap' }, LP.LEVELS.map((l) => h('span', { class: 'lp-lv', style: { color: l.color, background: l.bg } }, l.label + ': ' + (rep.levels[l.k] || 0))), h('span', { class: 'bds-muted' }, 'Chưa chọn: ' + (rep.levels.none || 0))) }),
_o0.card({ title: 'Khách theo ngày', testid: 'rep-day', body: h('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '2px', height: '80px' } }, rep.by_day.map((d) => h('div', { title: d.day + ': ' + d.leads + ' khách', style: { flex: '1', minWidth: '2px', background: 'var(--accent,#2563eb)', height: Math.round(d.leads / _oc * 100) + '%', opacity: d.leads ? '1' : '.15' } }))) }));
}
function _o1b(body) {
const teams = st.info.teams || [], ps = people(), owner = S().owner;
const _oi = (id) => (ps.find((_oo) => _oo.id === id) || {}).name || 'Người dùng cũ';
body.appendChild(h('p', { class: 'bds-muted' }, owner ? 'Quản trị tạo nhóm, chọn trưởng nhóm và thành viên. Trưởng nhóm được cấp "Đẩy số" chỉ đẩy được cho nhóm mình.' : 'Nhóm anh/chị phụ trách.'));
for (const t of teams) {
const _od = owner || (S().leader_of || []).includes(t.id);
body.appendChild(_o0.card({ title: '👥 ' + t.name, testid: 'team-' + t.id, body: [
h('p', null, 'Trưởng nhóm: ' + (t.leader ? _oi(t.leader) : 'chưa có') + ' · Thành viên: ' + (t.members.map(_oi).join(', ') || 'chưa có')),
h('div', { class: 'bds-row bds-wrap' },
_od ? _o0.button(t.ping ? 'Đang bật nhắc Hẹn xem/Đặt cọc/Chốt' : 'Bật nhắc Hẹn xem/Đặt cọc/Chốt', async () => { await _o0.api('pool.team_ping', { id: t.id, on: !t.ping }); _ow(); }, { icon: 'clock', testid: 'team-ping-' + t.id }) : null,
owner ? _o0.button('Sửa', () => _o19(t), { icon: 'settings', testid: 'team-edit-' + t.id }) : null,
owner ? _o0.button('Xoá nhóm', async () => { if (await _o0.confirm({ title: 'Xoá nhóm "' + t.name + '"?', text: 'Khách đã cấp giữ nguyên.', kind: 'danger', ok: 'Xoá' })) { await _o0.api('pool.team_delete', { id: t.id }); _ow(); } }, { kind: 'ghost', icon: 'x', testid: 'team-del-' + t.id }) : null)] }));
}
if (owner) body.appendChild(_o0.button('Thêm nhóm sale', () => _o19(null), { kind: 'primary', icon: 'plus', testid: 'team-add' }));
function _o19(t) {
t = t || { name: '', leader: '', members: [] };
const name = h('input', { value: t.name, 'data-testid': 'team-name', placeholder: 'vd Nhóm Quận 7' });
const leader = _o0.select([['', '– chưa có –'], ...ps.map((_oo) => [_oo.id, _oo.name])], t.leader, { 'data-testid': 'team-leader' });
const _o4 = ps.map((_oo) => h('label', { class: 'bds-row' }, h('input', { type: 'checkbox', value: _oo.id, checked: t.members.includes(_oo.id), 'data-testid': 'team-mem-' + _oo.id }), _oo.name));
const _ob = _o0.modal({ title: t.id ? 'Sửa nhóm' : 'Thêm nhóm sale', testid: 'team-modal', body: [_o0.field('Tên nhóm', name), _o0.field('Trưởng nhóm', leader), h('strong', null, 'Thành viên'), h('div', null, _o4),
h('div', { class: 'bds-row bds-end' }, _o0.button('Huỷ', () => _ob.close(), { icon: 'x' }), _o0.button('Lưu nhóm', async () => {
await _o0.api('pool.team_save', { team: { id: t.id, name: name.value.trim(), leader: leader.value, members: _o4.map((b) => b.querySelector('input')).filter((_o9) => _o9.checked).map((_o9) => _o9.value) } });
_ob.close(); _o0.toast('Đã lưu nhóm', 'success'); _ow();
}, { kind: 'primary', icon: 'check', testid: 'team-save' }))] });
}
}
function _o15(body) {
const c = st.info.config || {}, ch = c.cheer || {};
const num = (v, tid) => h('input', { type: 'number', min: 0, max: 720, value: v, 'data-testid': tid, style: { maxWidth: '120px' } });
const _o7 = (v, tid) => h('input', { type: 'checkbox', checked: !!Number(v), 'data-testid': tid });
const f = { overdue: num(c.overdue_h, 'cfg-overdue'), auto: num(c.auto_h, 'cfg-auto'), intake: _o7(c.intake_pool, 'cfg-intake'), ping: _o7(c.ping_admin, 'cfg-ping'),
on: _o7(ch.on, 'cfg-cheer-on'), proj: _o7(ch.show_project, 'cfg-cheer-project'), val: _o7(ch.show_value, 'cfg-cheer-value'), confirm: _o7(ch.confirm, 'cfg-cheer-confirm'),
aud: _o0.select([['all', 'Toàn công ty'], ['team', 'Chỉ nhóm của sale']], ch.audience || 'all', { 'data-testid': 'cfg-cheer-audience' }),
tpl: h('input', { value: ch.template || '', maxlength: 300, 'data-testid': 'cfg-cheer-template', placeholder: '🎉 Chúc mừng {sale}{nhom} vừa chốt thành công {du_an}!' }) };
const _o10 = (label, input, hint) => h('label', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, label), input, hint ? h('small', { class: 'bds-field-h' }, hint) : null);
body.append(
_o0.card({ title: 'Kho lead', body: [
_o10('Cảnh báo khách "Mới nhận" sau (giờ)', f.overdue, 'Mặc định 2 giờ.'),
_o10('Tự thu hồi nếu chưa liên hệ sau (giờ)', f.auto, '0 = TẮT (mặc định). Khách quá giờ tự về kho, ghi lý do.'),
h('label', { class: 'bds-row' }, f.intake, 'Khách từ landing công ty / khoá nhận khách chung vào Kho lead'),
h('label', { class: 'bds-row' }, f.ping, 'Nhắc Quản trị (Telegram chung) khi khách công ty cấp tới Hẹn xem / Đặt cọc / Chốt')] }),
_o0.card({ title: '🎉 Chúc mừng chốt đơn', testid: 'cfg-cheer', body: [
h('label', { class: 'bds-row' }, f.on, 'Bật chúc mừng khi khách công ty cấp được Chốt'),
_o10('Ai nhận', f.aud),
h('label', { class: 'bds-row' }, f.proj, 'Hiện dự án / loại sản phẩm'),
h('label', { class: 'bds-row' }, f.val, 'Hiện giá trị giao dịch'),
h('label', { class: 'bds-row' }, f.confirm, 'Cần Quản trị/Trưởng nhóm xác nhận trước khi chúc mừng'),
_o10('Lời chúc riêng (tuỳ chọn)', f.tpl, 'Dùng {sale}, {nhom}, {du_an}, {loai}, {gia_tri}. Không bao giờ có tên/số điện thoại khách.')] }),
_o0.button('Lưu cài đặt', async () => {
await _o0.api('pool.config', { overdue_h: Number(f.overdue.value) || 2, auto_h: Number(f.auto.value) || 0, intake_pool: f.intake.checked, ping_admin: f.ping.checked,
cheer: { on: f.on.checked, audience: f.aud.value, show_project: f.proj.checked, show_value: f.val.checked, confirm: f.confirm.checked, template: f.tpl.value.trim() } });
_o0.toast('Đã lưu cài đặt Kho lead', 'success'); _ow();
}, { kind: 'primary', icon: 'check', testid: 'cfg-save' }));
}
await _ow();
}
export default {
manifest: {
id: 'lead_pool', title: 'Kho lead', icon: '📥', screen: 'customers', order: 12, version: '1.0.0', status: 'ready', requires: 'lead_any',
help: 'Kho lead công ty: nhập khách từ quảng cáo, đẩy số cho nhân viên hoặc nhóm sale, thu hồi, xem trạng thái và báo cáo nguồn khách. Chỉ bản Công ty.',
},
mount,
async selftest() { return { ok: LP.STAGES.length === 11 && !!LP.LEVEL.hot, details: 'lead_pool' }; },
};

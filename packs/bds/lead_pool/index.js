import { kit, h } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import * as LP from '../_lib/lead_pool.js';
const _o13 = (v) => (v === null || v === undefined ? '–' : String(v).replace('.', ',') + '%');
const _oc = (_oj) => { _oj = Math.round(Number(_oj) || 0); if (_oj < 60) return _oj + ' phút'; if (_oj % 1440 === 0) return _oj / 1440 + ' ngày'; const _oe = Math.floor(_oj / 60), mm = _oj % 60; return _oe + ' giờ' + (mm ? ' ' + mm + ' phút' : ''); };
const _oy = (o) => (o && Number(o.overdue_m) > 0 ? Number(o.overdue_m) : o && Number(o.overdue_h) > 0 ? Number(o.overdue_h) * 60 : 120);
const _on = (_oj) => (_oj === null || _oj === undefined ? '–' : _oj < 60 ? _oj + ' phút' : Math.round(_oj / 6) / 10 + ' giờ');
export async function mount(el, ctx) {
const _o1 = kit(ctx);
LP.ensureLpCss();
const st = { list: null, tab: 'pool', f: { q: '', state: '', stage: '', level: '', channel: '', campaign: '' }, picked: new Set(), info: null, rows: [], days: 30, feed: null };
const _o1a = h('div', { class: 'bds-screen', 'data-testid': 'lead-pool' });
el.replaceChildren(_o1a);
let _oi = false;
async function _oh() {
try {
const _o16 = await _o1.api('pool.home');
st.info = _o16.info; st.feed = _o16.feed || null; st.list = _o16.list || null;
} catch (e) {
if (!(e && e.code === 'UNKNOWN_ACTION')) throw e;
st.info = await _o1.api('pool.info');
try { st.feed = await _o1.api('cheer.feed'); } catch { st.feed = null; }
st.list = null;
}
}
const S = () => (st.info && st.info.scope) || {};
const _o1j = () => [['pool', 'Kho lead', S().pool || S().push || S().leader, 'inbox'], ['report', 'Báo cáo', S().report, 'pulse'], ['teams', 'Nhóm sale', S().owner || (S().leader_of || []).length, 'customers'], ['settings', 'Cài đặt', S().owner, 'settings']].filter((t) => t[2]);
async function _o17() { _oi = false; return _ob(); }
async function _ob() {
if (!_oi) {
_o1a.replaceChildren(h('div', { class: 'bds-head' }, h('h2', null, 'Kho lead công ty')), h('p', { class: 'bds-muted', 'data-testid': 'lp-loading' }, 'Đang tải…'));
try { await _oh(); _oi = true; } catch (e) { _o1a.replaceChildren(h('div', { class: 'bds-head' }, h('h2', null, 'Kho lead công ty')), _o1.empty((e && (e.userMessage || e.message)) || 'Chưa mở được Kho lead.'), _o1.button('Thử lại', () => _o17(), { icon: 'refresh', testid: 'lp-retry' })); return; }
}
const _o1r = _o1j();
if (!_o1r.some((t) => t[0] === st.tab)) st.tab = _o1r.length ? _o1r[0][0] : 'pool';
const bar = h('div', { class: 'bds-row bds-wrap', role: 'tablist', 'data-testid': 'lp-tabs' }, _o1r.map(([k, l, , ic]) =>
_o1.button(l, () => { st.tab = k; _ob(); }, { kind: st.tab === k ? 'primary' : 'ghost', icon: ic, testid: 'lp-tab-' + k })));
const body = h('div', { 'data-testid': 'lp-body-' + st.tab });
_o1a.replaceChildren(h('div', { class: 'bds-head' }, h('h2', null, 'Kho lead công ty')), bar, body);
if (st.tab === 'pool') await _o15(body);
else if (st.tab === 'report') await _o18(body);
else if (st.tab === 'teams') _o1o(body);
else _o1g(body);
}
async function _o15(body) {
const _o16 = st.list || (st.list = await _o1.api('pool.list'));
st.rows = _o16.rows || [];
const _o14 = (st.feed && st.feed.pending) || [];
if (_o14.length) body.appendChild(_o1.card({ title: '🎉 Chờ xác nhận chúc mừng chốt đơn', testid: 'lp-cheer-pending', body: _o14.map((c) => h('div', { class: 'bds-row bds-wrap' },
h('span', null, c.text),
_o1.button('Xác nhận', async () => { await _o1.api('cheer.confirm', { id: c.id }); _o1.toast('Đã gửi lời chúc mừng tới mọi người', 'success'); _o17(); }, { kind: 'primary', icon: 'check', testid: 'cheer-confirm-' + c.id }),
_o1.button('Bỏ qua', async () => { await _o1.api('cheer.confirm', { id: c.id, reject: true }); _o17(); }, { icon: 'x', testid: 'cheer-reject-' + c.id }))) }));
const _o1q = h('div', { class: 'bds-row bds-wrap bds-tools' },
S().pool ? _o1.button('Nhập khách', () => openImport(), { kind: 'primary', icon: 'plus', testid: 'lp-import' }) : null,
_o1.button('Tải lại', () => _o17(), { icon: 'refresh', testid: 'lp-reload' }));
const camps = [...new Set(st.rows.map((x) => x.campaign).filter(Boolean))].sort();
const _o1e = (opts, key, label) => _o1.select(opts, st.f[key], { 'aria-label': label, 'data-testid': 'lp-f-' + key, onchange: (e) => { st.f[key] = e.target.value; _o10(); } });
const search = h('input', { type: 'search', value: st.f.q, placeholder: 'Tìm tên, số, chiến dịch, người nhận…', 'aria-label': 'Tìm khách trong kho', 'data-testid': 'lp-search', oninput: (e) => { st.f.q = e.target.value; _o10(); } });
const filters = h('div', { class: 'bds-toolbar' }, search, h('div', { class: 'bds-filters' },
_o1e([['', 'Tất cả'], ['new', 'Chưa cấp'], ['team', '👥 Chờ nhóm nhận / giao'], ['assigned', 'Đã cấp'], ['unack', '📞 Sale chưa gọi'], ['norep', '📝 Chưa báo cáo'], ['cham', '✅ Đang chăm'], ['overdue', '⏰ Quá giờ chưa gọi'], ...(S().owner ? [['cold', '🧊 Không quan tâm']] : [])], 'state', 'Tình trạng'),
_o1e([['', 'Mọi tiến độ'], ...LP.STAGES.map((s) => [s.k, s.label])], 'stage', 'Tiến độ'),
_o1e([['', 'Mọi mức độ'], ...LP.LEVELS.map((l) => [l.k, l.label])], 'level', 'Mức độ'),
_o1e([['', 'Mọi nguồn'], ...Object.entries(LP.CHANNELS)], 'channel', 'Nguồn'),
_o1e([['', 'Mọi chiến dịch'], ...camps.map((c) => [c, c])], 'campaign', 'Chiến dịch')));
const _o1f = h('strong', null, '0');
const selBar = h('div', { class: 'bds-selbar', 'data-testid': 'lp-selbar', hidden: true }, h('span', null, 'Đã chọn ', _o1f),
h('div', { class: 'bds-row bds-wrap' },
S().push ? _o1.button('Đẩy số', () => _ow([...st.picked]), { kind: 'primary', icon: 'send', testid: 'lp-push-selected' }) : null,
S().reclaim || S().reclaim_team ? _o1.button('Thu hồi', () => _ox([...st.picked]), { icon: 'undo', testid: 'lp-reclaim-selected' }) : null,
_o1.button('Bỏ chọn', () => { st.picked.clear(); _o10(); }, { kind: 'ghost', icon: 'x', testid: 'lp-unpick' })));
const count = h('p', { class: 'bds-muted', 'data-testid': 'lp-count' });
const list = h('div', { class: 'bds-list', 'data-testid': 'lp-list' });
const legend = h('div', { class: 'lp-legend', 'data-testid': 'lp-legend' }, Object.values(LP.CARE).map((c) => h('span', { class: 'lp-lv ' + c.cls }, c.label)));
const _of = _o1m();
body.append(_o1q, _of || '', filters, legend, selBar, count, list);
function _o10() {
const rows = LP.filterPool(st.rows, st.f);
const _oq = st.rows.filter((x) => x.status === 'new').length, nOver = st.rows.filter((x) => x.overdue).length;
const _or = st.rows.filter((x) => x.need_rep).length;
count.textContent = rows.length + ' khách đang hiện · ' + _oq + ' chưa cấp' + (nOver ? ' · ' + nOver + ' khách quá ' + _oc(_oy(_o16)) + ' chưa gọi' : '') + (_or ? ' · ' + _or + ' chưa báo cáo' : '');
for (const id of [...st.picked]) if (!st.rows.some((x) => x.id === id)) st.picked.delete(id);
selBar.hidden = !st.picked.size; _o1f.textContent = String(st.picked.size);
list.replaceChildren(...(rows.length ? rows.slice(0, 500).map(_o1c) : [_o1.empty(st.rows.length ? 'Không có khách khớp bộ lọc.' : 'Chưa có lead nào trong kho. Bấm "Nhập khách" (Excel/CSV, dán từ Excel) hoặc nối landing công ty (khoá nhận khách chung) để khách tự vào kho.')]));
}
function _o1c(x) {
const _o8 = h('input', { type: 'checkbox', class: 'bds-pick', 'aria-label': 'Chọn ' + x.name, 'data-testid': 'lp-pick-' + x.id, checked: st.picked.has(x.id),
onchange: (e) => { if (e.target.checked) st.picked.add(x.id); else st.picked.delete(x.id); selBar.hidden = !st.picked.size; _o1f.textContent = String(st.picked.size); } });
const _o1k = h('span', { class: 'bds-row bds-wrap' },
h('span', { class: 'lp-badge', style: { background: '#e0f2fe', color: '#075985' } }, x.channel_label + (x.campaign ? ' · ' + x.campaign : '')),
x.status === 'assigned' ? _o1.badge(x.stage_label, crm.statusTone(x.stage_label)) : x.status === 'team' ? h('span', { class: 'lp-lv lp-care-wait' }, '👥 ' + (x.team_name || 'Nhóm')) : x.status === 'cold' ? h('span', { class: 'lp-lv lp-care-kqt' }, '🧊 Không quan tâm') : _o1.badge('Chưa cấp', 'info'),
x.status === 'assigned' && x.sale_ack === false ? h('span', { class: 'lp-lv lp-care-wait', 'data-testid': 'lp-unack-' + x.id }, '📞 Chưa gọi') : null,
x.need_rep ? h('span', { class: 'lp-lv lp-warn', 'data-testid': 'lp-norep-' + x.id }, '📝 Chưa báo cáo') : null,
x.status === 'assigned' && (x.care === 'cham' || x.rep_care === 'cham') ? h('span', { class: 'lp-lv lp-care-cham' }, '✅ Đang chăm') : null,
LP.levelBadge(x.level),
x.overdue ? h('span', { class: 'lp-lv lp-warn', 'data-testid': 'lp-overdue-' + x.id }, '⏰ Chưa gọi > ' + _oc(_oy(_o16))) : null,
x.dup_owner ? h('span', { class: 'lp-lv lp-warn', title: 'Số này đã có trong danh sách khách của nhân viên – tránh trả tiền 2 lần / tranh khách', 'data-testid': 'lp-dup-' + x.id }, '⚠️ Đang là khách của ' + x.dup_owner) : null);
const _o3 = h('div', { class: 'bds-acts bds-wrap' },
(x.status === 'new' || (x.status === 'cold' && S().owner)) && S().push ? _o1.button(x.status === 'cold' ? 'Đẩy lại' : 'Đẩy số', () => _ow([x.id]), { kind: 'primary', icon: 'send', small: true, testid: 'lp-push-' + x.id }) : null,
x.status === 'assigned' && _o7(x) ? _o1.button('Thu hồi', () => _ox([x.id]), { icon: 'undo', small: true, testid: 'lp-reclaim-' + x.id }) : null,
_o1.button('Lịch sử', () => _ov(x), { kind: 'ghost', icon: 'log', small: true, testid: 'lp-hist-' + x.id }),
S().owner ? _o1.button('Xoá theo yêu cầu', () => _ou(x), { kind: 'ghost', icon: 'shield', small: true, testid: 'lp-erase-' + x.id }) : null);
return h('div', { class: 'bds-item ' + LP.careClass(x), 'data-id': x.id, 'data-testid': 'lp-row-' + x.id },
h('label', { class: 'bds-pick-wrap' }, _o8),
h('div', { class: 'bds-row-main' }, h('strong', { class: 'bds-name' }, x.name), h('span', { class: 'bds-sub' }, [x.phone, x.project].filter(Boolean).join(' · ')),
h('span', { class: 'bds-sub', 'data-testid': 'lp-status-' + x.id }, x.status_text + (x.reason ? ' · Lý do: ' + x.reason : '') + (x.last_contact_at ? ' · Liên hệ cuối ' + _o1.date(x.last_contact_at) + ' ' + crm.hm(x.last_contact_at) : '')),
x.rep_at ? h('span', { class: 'bds-sub', 'data-testid': 'lp-rep-' + x.id }, '📝 ' + _o1.date(x.rep_at) + (x.rep_note ? ': ' + x.rep_note : '')) : null,
_o1k), _o3);
}
_o10();
}
function _o1m() {
const _om = (S().leader_of || []);
const rows = st.rows.filter((x) => x.status === 'team' && (S().push_all || _om.includes(x.team_id)));
if (!rows.length) return null;
const teams = (st.info.teams || []);
const membersOf = (tid) => { const t = teams.find((x) => x.id === tid); if (!t) return []; const ids = [...t.members, ...(t.leader ? [t.leader] : [])]; return ids.filter((v, i, a) => a.indexOf(v) === i).map((id) => ({ id, name: ((st.info.people || []).find((_oz) => _oz.id === id) || {}).name || (id === t.leader ? t.leader_name : '') })).filter((_oz) => _oz.name); };
const wait = rows.filter((x) => !x.team_ack), held = rows.filter((x) => x.team_ack);
const ack = async (ids) => { try { const _o16 = await _o1.api('pool.team_ack', { ids }); _o1.toast('Đã nhận ' + _o16.acked + ' số – giao cho sale ngay nhé', 'success'); _o17(); } catch (e) { _o1.toast((e && (e.userMessage || e.message)) || 'Chưa nhận được', 'danger'); } };
const give = async (ids, to) => { if (!to) return _o1.toast('Chọn sale', 'warn'); try { const _o16 = await _o1.api('pool.team_assign', { ids, to }); _o1.toast('Đã giao ' + _o16.assigned + ' số ' + LP.toWhom(_o16.to || []), 'success'); _o17(); } catch (e) { _o1.toast((e && (e.userMessage || e.message)) || 'Chưa giao được', 'danger'); } };
const _og = (x) => {
const pick = _o1.select([['', '– giao cho –'], ...membersOf(x.team_id).map((_oz) => [_oz.id, _oz.name])], '', { 'aria-label': 'Giao cho', 'data-testid': 'ti-to-' + x.id });
return h('div', { class: 'bds-item lp-care-wait', 'data-testid': 'ti-row-' + x.id },
h('div', { class: 'bds-row-main' }, h('strong', { class: 'bds-name' }, x.name), h('span', { class: 'bds-sub' }, [x.channel_label + (x.campaign ? ' · ' + x.campaign : ''), x.project].filter(Boolean).join(' · ')), h('span', { class: 'bds-sub' }, x.status_text)),
h('div', { class: 'bds-acts bds-wrap' },
!x.team_ack ? _o1.button('Đã nhận', () => ack([x.id]), { kind: 'primary', icon: 'check', small: true, testid: 'ti-ack-' + x.id }) : null,
pick, _o1.button('Giao', () => give([x.id], pick.value), { kind: x.team_ack ? 'primary' : 'ghost', icon: 'send', small: true, testid: 'ti-give-' + x.id })));
};
return _o1.card({ title: '👥 Số của nhóm (' + rows.length + ')', testid: 'lp-team-inbox', body: [
wait.length > 1 ? _o1.button('Nhận hết ' + wait.length + ' số', () => ack(wait.map((x) => x.id)), { kind: 'primary', icon: 'check', testid: 'ti-ack-all' }) : null,
h('div', { class: 'bds-list' }, [...wait, ...held].slice(0, 200).map(_og))] });
}
const _op = () => ((st.info && st.info.teams) || []).filter((t) => (S().leader_of || []).includes(t.id));
const _o7 = (x) => !!(S().reclaim || (S().reclaim_team && _op().some((t) => t.members.includes(x.assignee))));
function people() { return ((st.info && st.info.people) || []).filter((_oz) => _oz.role !== 'owner' || S().owner); }
function _o1n(id) { const t = ((st.info && st.info.teams) || []).find((x) => x.id === id); return t ? t.name : ''; }
function _ow(ids) {
if (!ids.length) return _o1.toast('Chọn ít nhất 1 khách', 'warn');
const leads = st.rows.filter((x) => ids.includes(x.id) && (x.status === 'new' || (x.status === 'cold' && S().owner)));
if (!leads.length) return _o1.toast('Các khách đã chọn đều đã cấp – thu hồi trước nếu muốn cấp lại', 'warn');
const teams = (st.info.teams || []).filter((t) => S().push_all || (S().leader_of || []).includes(t.id));
const ps = people().filter((_oz) => S().push_all || teams.some((t) => t.members.includes(_oz.id)));
const f = { kind: teams.length ? 'team' : 'person', to: ps[0] ? ps[0].id : '', team: teams[0] ? teams[0].id : '', mode: teams[0] && teams[0].leader ? 'leader' : 'rr', manual: {} };
const _o2 = Number((st.info.config || {}).ack_m) || 15;
const box = h('div');
const err = h('div', { class: 'bds-error', role: 'alert' });
function _o11() {
const team = teams.find((t) => t.id === f.team);
const members = team ? ps.filter((_oz) => team.members.includes(_oz.id)) : [];
box.replaceChildren(
h('p', null, 'Đẩy ' + leads.length + ' khách cho:'),
h('div', { class: 'lp-chips' },
h('button', { type: 'button', class: 'lp-chip', 'aria-pressed': String(f.kind === 'person'), 'data-testid': 'push-kind-person', onclick: () => { f.kind = 'person'; _o11(); } }, '👤 Một nhân viên'),
teams.length ? h('button', { type: 'button', class: 'lp-chip', 'aria-pressed': String(f.kind === 'team'), 'data-testid': 'push-kind-team', onclick: () => { f.kind = 'team'; _o11(); } }, '👥 Nhóm sale') : null),
f.kind === 'person'
? _o1.field('Nhân viên', _o1.select(ps.map((_oz) => [_oz.id, _oz.name + ' – đang giữ ' + _oz.open + ' khách']), f.to, { 'data-testid': 'push-person', onchange: (e) => { f.to = e.target.value; } }))
: h('div', null,
_o1.field('Nhóm', _o1.select(teams.map((t) => [t.id, t.name + ' (' + t.members.length + ' người)']), f.team, { 'data-testid': 'push-team', onchange: (e) => { f.team = e.target.value; const _o1i = teams.find((t) => t.id === f.team); if (f.mode === 'leader' && !(_o1i && _o1i.leader)) f.mode = 'rr'; _o11(); } })),
h('strong', null, 'Cách chia'),
h('div', { class: 'lp-chips' }, [...(team && team.leader ? [['leader', '👑 Qua trưởng nhóm']] : []), ['rr', '🔁 Chia đều (lần lượt)'], ['least', '⚖️ Cho người ít khách nhất'], ['manual', '✋ Chọn tay']].map(([k, l]) =>
h('button', { type: 'button', class: 'lp-chip', 'aria-pressed': String(f.mode === k), 'data-testid': 'push-mode-' + k, onclick: () => { f.mode = k; _o11(); } }, l))),
f.mode === 'leader' ? h('p', { class: 'bds-muted', 'data-testid': 'push-leader-note' }, (team.auto ? 'Nhóm đang bật tự giao lần lượt – số tới sale ngay.' : (team.leader_name || 'Trưởng nhóm') + ' bấm "Đã nhận" trong ' + _oc(_o2) + ' rồi giao sale; quá giờ số chuyển nhóm kế.')) : null,
f.mode === 'rr' ? h('p', { class: 'bds-muted' }, 'Chia lần lượt từng người trong nhóm; lần đẩy sau tiếp tục từ người kế tiếp.') : null,
f.mode === 'least' ? h('p', { class: 'bds-muted' }, 'Mỗi khách cho người đang giữ ít khách công ty (chưa xong) nhất.') : null,
f.mode === 'manual' ? h('div', null, leads.map((x) => _o1.field(x.name, _o1.select([['', '– chọn người –'], ...members.map((_oz) => [_oz.id, _oz.name])], f.manual[x.id] || '', { 'data-testid': 'push-manual-' + x.id, onchange: (e) => { f.manual[x.id] = e.target.value; } })))) : null),
leads.some((x) => x.dup_owner) ? h('p', { class: 'lp-req' }, '⚠️ Có số đang là khách của nhân viên khác – kiểm tra trước khi đẩy để tránh tranh khách.') : null,
LP.pushBatchNote(leads.length) ? h('p', { class: 'bds-muted', 'data-testid': 'push-batch-note' }, LP.pushBatchNote(leads.length)) : null,
err);
}
_o11();
const _oj = _o1.modal({ title: 'Đẩy số', testid: 'push-modal', body: [box, h('div', { class: 'bds-row bds-end' },
_o1.button('Huỷ', () => _oj.close(), { icon: 'x', testid: 'push-cancel' }),
_o1.button('Đẩy số', async () => {
const payload = { ids: leads.map((x) => x.id) };
if (f.kind === 'team' && f.mode === 'leader' && !(teams.find((t) => t.id === f.team) || {}).leader) f.mode = 'rr';
if (f.kind === 'team') { payload.team = f.team; payload.mode = f.mode; if (f.mode === 'manual') { if (leads.some((x) => !f.manual[x.id])) { err.textContent = 'Chọn người nhận cho từng khách.'; return; } payload.manual = f.manual; } }
else { if (!f.to) { err.textContent = 'Chọn nhân viên.'; return; } payload.to = f.to; }
const _o12 = LP.batches(payload.ids, LP.PUSH_BATCH), sum = {};
let _oa = 0;
for (let i = 0; i < _o12.length; i++) {
try {
const _o19 = await _o1.api('pool.push', { ...payload, ids: _o12[i] });
_oa += Number(_o19.assigned) || 0;
(_o19.to || []).forEach((t) => { sum[t.name] = (sum[t.name] || 0) + (Number(t.n) || 0); });
_o12[i].forEach((id) => st.picked.delete(id));
} catch (e) {
const _oo = (e && (e.userMessage || e.message)) || 'Chưa đẩy được.';
err.textContent = _o12.length > 1 ? 'Đợt ' + (i + 1) + '/' + _o12.length + ' chưa đẩy được: ' + _oo + (_oa ? ' (đã đẩy ' + _oa + ' khách ở các đợt trước – chọn lại phần còn lại rồi bấm Đẩy số).' : '') : _oo;
if (_oa) _o17();
return;
}
}
_oj.close();
_o1.toast('Đã đẩy ' + _oa + ' khách' + (_o12.length > 1 ? ' (' + _o12.length + ' đợt)' : '') + ' ' + LP.toWhom(Object.entries(sum).map(([name, n]) => ({ name, n }))), 'success');
st.picked.clear(); _o17();
}, { kind: 'primary', icon: 'send', testid: 'push-confirm' }))] });
}
function _ox(ids) {
const _ot = st.rows.filter((x) => ids.includes(x.id) && x.status === 'assigned' && _o7(x));
if (!_ot.length) return _o1.toast('Chọn khách đã cấp (của nhóm anh/chị phụ trách) để thu hồi', 'warn');
const leads = _ot.slice(0, LP.RECLAIM_BATCH);
const reason = h('input', { maxlength: 200, 'data-testid': 'reclaim-reason', placeholder: 'vd: quá 1 ngày chưa gọi, sale nghỉ phép' });
const _o5 = !!S().reclaim, teams = _o5 ? (st.info.teams || []) : _op();
const ps = people().filter((_oz) => _o5 || teams.some((t) => t.members.includes(_oz.id)));
const to = _o1.select([['', _o5 ? '↩️ Về kho (chưa cấp)' : '↩️ Về nhóm (giao lại sau)'], ...ps.map((_oz) => [_oz.id, '👤 ' + _oz.name]), ...teams.map((t) => ['team:' + t.id, '👥 ' + t.name + ' (chia đều)'])], '', { 'data-testid': 'reclaim-to' });
const err = h('div', { class: 'bds-error', role: 'alert' });
const _oj = _o1.modal({ title: 'Thu hồi ' + leads.length + ' khách', testid: 'reclaim-modal', body: [
h('p', { class: 'bds-muted' }, 'Khách bị rút khỏi danh sách của ' + [...new Set(leads.map((x) => x.assignee_name))].join(', ') + '. Chuyển cho người khác: người nhận thấy đủ lịch sử (trạng thái, ghi chú, nhắc việc), người cũ không còn thấy khách. Lý do được ghi vào lịch sử và nhật ký cho Quản trị.'),
LP.reclaimBatchNote(_ot.length) ? h('p', { class: 'lp-req', 'data-testid': 'reclaim-batch-note' }, '⚠️ ' + LP.reclaimBatchNote(_ot.length)) : null,
_o1.field('Lý do (bắt buộc)', reason), _o1.field('Chuyển tới', to), err,
h('div', { class: 'bds-row bds-end' }, _o1.button('Huỷ', () => _oj.close(), { icon: 'x' }),
_o1.button('Thu hồi', async () => {
if (reason.value.trim().length < 3) { err.textContent = 'Ghi lý do thu hồi.'; return; }
const _oz = { ids: leads.map((x) => x.id), reason: reason.value.trim() };
if (to.value.startsWith('team:')) { _oz.team = to.value.slice(5); _oz.mode = 'rr'; } else if (to.value) _oz.to = to.value;
try { const _o16 = await _o1.api('pool.reclaim', _oz); _oj.close(); _o1.toast('Đã thu hồi ' + _o16.reclaimed + ' khách' + ((_o16.moved || []).length ? ' – chuyển ' + LP.toWhom(_o16.moved) : '') + (_ot.length > leads.length ? ' · còn ' + (_ot.length - leads.length) + ' khách đang chọn – bấm Thu hồi lần nữa' : ''), 'success'); leads.forEach((x) => st.picked.delete(x.id)); _o17(); }
catch (e) { err.textContent = (e && (e.userMessage || e.message)) || 'Chưa thu hồi được.'; }
}, { kind: 'danger', icon: 'undo', testid: 'reclaim-confirm' }))] });
}
async function _ov(x) {
const _o16 = await _o1.api('pool.history', { id: x.id });
const KIND = { in: '📥 Vào kho', give: '📤 Cấp', back: '↩️ Thu hồi', auto: '⏰ Tự thu hồi', stage: '🔁 Báo cáo', move: '🔀 Chuyển người', erased: '🗑️ Xoá theo yêu cầu', team: '👥 Vào nhóm', ack: '✅ Nhóm đã nhận', pass: '⏭️ Chuyển nhóm', got: '📞 Sale đã gọi' };
const _oj = _o1.modal({ title: 'Lịch sử: ' + x.name, testid: 'lp-history', body: [h('ol', { class: 'bds-timeline' }, (_o16.history || []).slice().reverse().map((e) => h('li', null,
h('small', { class: 'bds-muted' }, _o1.date(e.at) + ' ' + crm.hm(e.at)), ' ',
h('strong', null, KIND[e.k] || e.k), ' ',
e.k === 'give' ? 'cho ' + e.to + ' · bởi ' + e.by : e.k === 'stage' ? (e.care === 'cham' ? 'Đang chăm · ' : '') + e.stage + (e.level ? ' · ' + e.level : '') + (e.why ? ' · ' + e.why : '') + (e.note ? ' · ' + e.note : '') + ' · ' + e.by
: e.k === 'team' ? e.team + (e.why ? ' · ' + e.why : '') : e.k === 'ack' ? e.team + ' · ' + e.by : e.k === 'pass' ? e.from + ' → ' + e.team + ' · ' + e.why : e.k === 'got' ? e.by
: e.k === 'back' || e.k === 'auto' ? 'từ ' + e.from + ' · ' + e.why : e.k === 'move' ? e.from + ' → ' + e.to : e.k === 'in' ? (e.how || '') : ''))),
h('div', { class: 'bds-row bds-end' }, _o1.button('Đóng', () => _oj.close(), { icon: 'close' }))] });
}
function _ou(x) {
const reason = h('input', { maxlength: 200, 'data-testid': 'lp-erase-reason', placeholder: 'vd: khách gọi điện yêu cầu ngày 17/11' });
const _oj = _o1.modal({ title: 'Xoá theo yêu cầu khách', testid: 'lp-erase-modal', body: [
h('p', null, 'Xoá vĩnh viễn thông tin cá nhân của "' + x.name + '" ở Kho lead VÀ ở danh sách của mọi nhân viên từng nhận khách này (Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15).'),
_o1.field('Lý do (không ghi tên, số điện thoại khách)', reason),
h('div', { class: 'bds-row bds-end' }, _o1.button('Huỷ', () => _oj.close(), { icon: 'x' }), _o1.button('Xoá vĩnh viễn', async () => {
if (reason.value.trim().length < 3) return _o1.toast('Ghi lý do xoá', 'warn');
const _o16 = await _o1.api('pool.erase', { id: x.id, reason: reason.value.trim() }); _oj.close();
_o1.toast('Đã xoá ở kho và ' + _o16.copies + ' bản đã cấp', 'success'); _o17();
}, { kind: 'danger', icon: 'shield', testid: 'lp-erase-confirm' }))] });
}
function openImport() {
const file = h('input', { type: 'file', accept: '.xlsx,.csv,.tsv,.txt', 'data-testid': 'lp-import-file' });
const paste = h('textarea', { rows: 6, 'data-testid': 'lp-import-paste', placeholder: 'Hoặc dán bảng từ Excel / Google Sheet (có dòng tiêu đề), vd:\nHọ tên\tSố điện thoại\tNguồn\tChiến dịch\tQuảng cáo\tChi phí' });
const channel = _o1.select([['', 'Theo cột "Nguồn" trong tệp'], ...Object.entries(LP.CHANNELS)], '', { 'data-testid': 'lp-import-channel' });
const campaign = h('input', { 'data-testid': 'lp-import-campaign', placeholder: 'Tên chiến dịch (nếu tệp không có cột Chiến dịch)' });
const adset = h('input', { 'data-testid': 'lp-import-adset', placeholder: 'Quảng cáo / nhóm quảng cáo (tuỳ chọn)' });
const cost = h('input', { inputmode: 'numeric', 'data-testid': 'lp-import-cost', placeholder: 'Chi phí mỗi khách nếu biết, vd 150000' });
const out = h('div', { 'data-testid': 'lp-import-result' });
const agree = h('input', { type: 'checkbox', 'data-testid': 'lp-import-consent' });
const agreeRow = h('label', { class: 'bds-row', style: { alignItems: 'flex-start', gap: '8px' } }, agree,
h('span', null, 'Khách trong danh sách đã đồng ý cho công ty lưu thông tin và liên hệ tư vấn (bắt buộc).'));
let _o1h = null, fileName = '';
file.onchange = async () => {
const f = file.files && file.files[0]; if (!f) return;
fileName = f.name || '';
try { const O = await import('../../../shared/ooxml.js'); const _o19 = await O.parseFile(f, { name: f.name, maxCells: 300000, maxLength: 1 }); _o1h = _o19.kind === 'xlsx' ? (_o19.data.sheets[0] || {}).rows : _o19.data; out.textContent = 'Đã đọc ' + Math.max(0, (_o1h || []).length - 1) + ' dòng.'; }
catch (e) { out.textContent = (e && e.message) || 'Không đọc được tệp.'; }
};
const _oj = _o1.modal({ title: 'Nhập khách vào kho', testid: 'lp-import-modal', body: [
h('p', { class: 'bds-muted' }, 'Máy chủ tự bỏ số đã có trong kho và đánh dấu số đã là khách của nhân viên (không lộ thông tin khách đó).'),
_o1.field('Tệp Excel / CSV', file), paste, _o1.field('Nguồn', channel), _o1.field('Chiến dịch', campaign), _o1.field('Quảng cáo / nhóm quảng cáo', adset), _o1.field('Chi phí / khách (đồng)', cost), agreeRow, out,
h('div', { class: 'bds-row bds-end' }, _o1.button('Đóng', () => _oj.close(), { icon: 'close', testid: 'lp-import-close' }), _o1.button('Nhập vào kho', async () => {
const rows = LP.poolRows(_o1h || LP.parseDelimited(paste.value)).rows;
if (!rows.length) { out.textContent = 'Không thấy dòng nào có số điện thoại. Cần dòng tiêu đề có cột "Số điện thoại".'; return; }
if (!agree.checked) { out.textContent = 'Tick ô xác nhận khách đã đồng ý cho công ty liên hệ trước khi nhập.'; agree.focus(); return; }
const _o16 = await _o1.api('pool.import', { rows, channel: channel.value, campaign: campaign.value.trim(), adset: adset.value.trim(), cost: Number(cost.value.replace(/\D/g, '')) || '',
consent_confirm: true, file: fileName || (_o1h ? '' : 'dán từ bảng tính') });
out.replaceChildren(h('p', { class: 'g3-ok', 'data-testid': 'lp-import-done' }, 'Đã nhập ' + _o16.added + ' khách · bỏ ' + _o16.dup_pool + ' số trùng trong kho' + (_o16.flagged ? ' · ' + _o16.flagged + ' số đang là khách của nhân viên (đã gắn cờ)' : '') + (_o16.bad ? ' · ' + _o16.bad + ' dòng thiếu số' : '') + '.'));
_o1h = null; paste.value = ''; agree.checked = false; fileName = '';
_o1.toast('Đã nhập ' + _o16.added + ' khách vào kho', 'success'); _o17();
}, { kind: 'primary', icon: 'download', testid: 'lp-import-run' }))] });
}
async function _o18(body) {
const rep = await _o1.api('pool.report', { days: st.days });
const _o1d = (t) => h('div', { class: 'g3-scroll', style: { overflowX: 'auto' } }, t);
const table = (head, rows, testid) => _o1d(h('table', { class: 'table g3-tbl', 'data-testid': testid }, h('thead', null, h('tr', null, head.map((x, i) => h('th', { class: i ? 'n' : '' }, x)))),
h('tbody', null, rows.map((_o16) => h('tr', null, _o16.map((x, i) => h('td', { class: i ? 'n' : '' }, x)))))));
const T = rep.total;
const _o1p = (l, v) => h('div', { class: 'bds-card', style: { padding: '10px', minWidth: '130px', flex: '1' } }, h('small', { class: 'bds-muted' }, l), h('div', { style: { fontSize: '22px', fontWeight: 700 } }, v));
const _ok = Math.max(1, ...rep.by_day.map((d) => d.leads));
body.append(
h('div', { class: 'bds-row bds-wrap' }, _o1.select([[7, '7 ngày'], [30, '30 ngày'], [90, '90 ngày']], st.days, { 'aria-label': 'Khoảng thời gian', 'data-testid': 'rep-days', onchange: (e) => { st.days = Number(e.target.value); _ob(); } })),
h('div', { class: 'bds-row bds-wrap', 'data-testid': 'rep-tiles' }, _o1p('Khách', T.leads), _o1p('Đã cấp', T.assigned), _o1p('Tỉ lệ liên hệ', _o13(T.contact_rate)), _o1p('Chốt', T.chot), _o1p('Tỉ lệ rác', _o13(T.junk_rate)), _o1p('Chi phí / lead', T.cpl ? _o1.money(T.cpl) : '–')),
_o1.card({ title: 'Phễu theo chiến dịch', testid: 'rep-funnel', body: table(['Chiến dịch', 'Nguồn', 'Khách', ...T.funnel.map((f) => f.label), 'Rác', 'Tỉ lệ rác', 'Chi phí/khách'],
rep.by_campaign.map((c) => [c.label, c.channel || '', c.leads, ...c.funnel.map((f) => f.n), c.junk, _o13(c.junk_rate), c.cpl ? _o1.money(c.cpl) : '–']), 'rep-campaign') }),
_o1.card({ title: 'Theo nguồn', testid: 'rep-source', body: table(['Nguồn', 'Lead', 'Đã liên hệ', 'Đang chăm', 'Không quan tâm', 'Tỉ lệ KQT', 'Chốt', 'Rác', 'Tỉ lệ rác', 'Chi phí'], rep.by_source.map((c) => [c.label, c.leads, c.contacted, c.cham || 0, c.kqt || 0, _o13(c.kqt_rate), c.chot, c.junk, _o13(c.junk_rate), c.cost ? _o1.money(c.cost) : '–']), 'rep-source-t') }),
T.kqt ? _o1.card({ title: '🧊 Lý do Không quan tâm', testid: 'rep-kqt', body: h('div', { class: 'bds-row bds-wrap' }, Object.entries(rep.kqt_reasons || {}).filter(([k]) => (T.kqt_why || {})[k]).map(([k, l]) => h('span', { class: 'lp-lv lp-care-kqt' }, l + ': ' + T.kqt_why[k]))) }) : '',
_o1.card({ title: 'Bảng xếp hạng sale', testid: 'rep-sellers', body: table(['Nhân viên', 'Được cấp', 'Tỉ lệ liên hệ', 'Gọi lần đầu sau', 'Chốt', 'Tỉ lệ chốt', 'Quá giờ chưa gọi', 'Chưa gọi', 'Chưa báo cáo', 'Không quan tâm'],
rep.sellers.map((s, i) => [(i < 3 ? ['🥇', '🥈', '🥉'][i] + ' ' : '') + s.name, s.assigned, _o13(s.contact_rate), _on(s.ftc_min), s.won, _o13(s.win_rate), s.overdue, s.unack || 0, s.norep || 0, (s.kqt || 0) + (s.kqt ? ' (' + _o13(s.kqt_rate) + ')' : '')]), 'rep-sellers-t') }),
_o1.card({ title: 'Khách đang ở trạng thái', testid: 'rep-stage', body: h('div', { class: 'bds-row bds-wrap' }, rep.by_stage.filter((s) => s.n).map((s) => h('span', null, _o1.badge(s.label + ': ' + s.n, crm.statusTone(s.label))))) }),
_o1.card({ title: 'Mức độ', testid: 'rep-level', body: h('div', { class: 'bds-row bds-wrap' }, LP.LEVELS.map((l) => h('span', { class: 'lp-lv', style: { color: l.color, background: l.bg } }, l.label + ': ' + (rep.levels[l.k] || 0))), h('span', { class: 'bds-muted' }, 'Chưa chọn: ' + (rep.levels.none || 0))) }),
_o1.card({ title: 'Khách theo ngày', testid: 'rep-day', body: h('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '2px', height: '80px' } }, rep.by_day.map((d) => h('div', { title: d.day + ': ' + d.leads + ' khách', style: { flex: '1', minWidth: '2px', background: 'var(--accent,#2563eb)', height: Math.round(d.leads / _ok * 100) + '%', opacity: d.leads ? '1' : '.15' } }))) }));
}
function _o1o(body) {
const teams = st.info.teams || [], ps = people(), owner = S().owner;
const _os = (id) => (ps.find((_oz) => _oz.id === id) || {}).name || 'Người dùng cũ';
body.appendChild(h('p', { class: 'bds-muted' }, owner ? 'Quản trị tạo nhóm, chọn trưởng nhóm và sale. Số đẩy cho nhóm đi lần lượt theo thứ tự dưới đây (theo số/tên nhóm) khi nhóm trước không bấm "Đã nhận" kịp.' : 'Nhóm anh/chị phụ trách – tự thêm/bớt sale chưa thuộc nhóm nào.'));
const _o0 = [['', '✋ Trưởng nhóm giao'], ['rr', '🔁 Tự giao lần lượt'], ['least', '⚖️ Tự giao người ít số nhất']];
teams.forEach((t, i) => {
const _ol = owner || (S().leader_of || []).includes(t.id);
body.appendChild(_o1.card({ title: (i + 1) + '. 👥 ' + t.name, testid: 'team-' + t.id, body: [
h('p', null, 'Trưởng nhóm: ' + (t.leader ? _os(t.leader) : 'chưa có')),
h('div', { class: 'bds-row bds-wrap', 'data-testid': 'team-members-' + t.id }, t.members.length ? t.members.map((_oj) => h('span', { class: 'lp-badge' }, _os(_oj),
_ol && !owner ? h('button', { type: 'button', class: 'lp-x', 'aria-label': 'Bỏ ' + _os(_oj) + ' khỏi nhóm', 'data-testid': 'team-rm-' + t.id + '-' + _oj, onclick: async () => {
if (!(await _o1.confirm({ title: 'Bỏ ' + _os(_oj) + ' khỏi ' + t.name + '?', text: 'Số đã giao giữ nguyên.', ok: 'Bỏ khỏi nhóm' }))) return;
await _o1.api('pool.team_members', { id: t.id, remove: [_oj] }); _o17(); } }, '×') : null)) : h('span', { class: 'bds-muted' }, 'Chưa có sale')),
_ol ? h('div', { class: 'lp-chips', role: 'group', 'aria-label': 'Cách giao số của nhóm' }, _o0.map(([k, l]) => h('button', { type: 'button', class: 'lp-chip', 'aria-pressed': String((t.auto || '') === k), 'data-testid': 'team-auto-' + t.id + '-' + (k || 'tay'),
onclick: async () => { await _o1.api('pool.team_auto', { id: t.id, mode: k }); _o1.toast('Đã đổi cách giao số của ' + t.name, 'success'); _o17(); } }, l))) : null,
h('div', { class: 'bds-row bds-wrap' },
_ol && !owner ? _o1.button('Thêm sale', () => _o4(t), { icon: 'plus', testid: 'team-add-sale-' + t.id }) : null,
_ol ? _o1.button(t.ping ? 'Đang bật nhắc Hẹn xem/Đặt cọc/Chốt' : 'Bật nhắc Hẹn xem/Đặt cọc/Chốt', async () => { await _o1.api('pool.team_ping', { id: t.id, on: !t.ping }); _o17(); }, { icon: 'clock', testid: 'team-ping-' + t.id }) : null,
owner ? _o1.button('Sửa', () => _o1l(t), { icon: 'settings', testid: 'team-edit-' + t.id }) : null,
owner ? _o1.button('Xoá nhóm', async () => { if (await _o1.confirm({ title: 'Xoá nhóm "' + t.name + '"?', text: 'Khách đã cấp giữ nguyên.', kind: 'danger', ok: 'Xoá' })) { await _o1.api('pool.team_delete', { id: t.id }); _o17(); } }, { kind: 'ghost', icon: 'x', testid: 'team-del-' + t.id }) : null)] }));
});
async function _o4(t) {
let _od = [];
try { _od = (await _o1.api('pool.free_sales')).people || []; } catch (e) { return _o1.toast((e && (e.userMessage || e.message)) || 'Chưa tải được danh sách sale', 'danger'); }
if (!_od.length) return _o1.toast('Không còn sale nào chưa thuộc nhóm – nhờ Quản trị tạo tài khoản hoặc chuyển nhóm', 'warn');
const _o6 = _od.map((_oz) => h('label', { class: 'bds-row' }, h('input', { type: 'checkbox', value: _oz.id, 'data-testid': 'team-free-' + _oz.id }), _oz.name));
const _oj = _o1.modal({ title: 'Thêm sale vào ' + t.name, testid: 'team-add-modal', body: [h('div', null, _o6), h('div', { class: 'bds-row bds-end' }, _o1.button('Huỷ', () => _oj.close(), { icon: 'x' }),
_o1.button('Thêm', async () => {
const add = _o6.map((b) => b.querySelector('input')).filter((i) => i.checked).map((i) => i.value);
if (!add.length) return _o1.toast('Chọn ít nhất 1 sale', 'warn');
try { await _o1.api('pool.team_members', { id: t.id, add }); } catch (e) { return _o1.toast((e && (e.userMessage || e.message)) || 'Chưa thêm được', 'danger'); }
_oj.close(); _o1.toast('Đã thêm ' + add.length + ' sale', 'success'); _o17();
}, { kind: 'primary', icon: 'check', testid: 'team-add-confirm' }))] });
}
if (owner) body.appendChild(_o1.button('Thêm nhóm sale', () => _o1l(null), { kind: 'primary', icon: 'plus', testid: 'team-add' }));
function _o1l(t) {
t = t || { name: '', leader: '', members: [] };
const name = h('input', { value: t.name, 'data-testid': 'team-name', placeholder: 'vd Nhóm Quận 7' });
const leader = _o1.select([['', '– chưa có –'], ...ps.map((_oz) => [_oz.id, _oz.name])], t.leader, { 'data-testid': 'team-leader' });
const _o6 = ps.map((_oz) => h('label', { class: 'bds-row' }, h('input', { type: 'checkbox', value: _oz.id, checked: t.members.includes(_oz.id), 'data-testid': 'team-mem-' + _oz.id }), _oz.name));
const _oj = _o1.modal({ title: t.id ? 'Sửa nhóm' : 'Thêm nhóm sale', testid: 'team-modal', body: [_o1.field('Tên nhóm', name), _o1.field('Trưởng nhóm', leader), h('strong', null, 'Thành viên'), h('div', null, _o6),
h('div', { class: 'bds-row bds-end' }, _o1.button('Huỷ', () => _oj.close(), { icon: 'x' }), _o1.button('Lưu nhóm', async () => {
await _o1.api('pool.team_save', { team: { id: t.id, name: name.value.trim(), leader: leader.value, members: _o6.map((b) => b.querySelector('input')).filter((i) => i.checked).map((i) => i.value) } });
_oj.close(); _o1.toast('Đã lưu nhóm', 'success'); _o17();
}, { kind: 'primary', icon: 'check', testid: 'team-save' }))] });
}
}
function _o1g(body) {
const c = st.info.config || {}, ch = c.cheer || {};
const num = (v, tid) => h('input', { type: 'number', min: 0, max: 43200, step: 1, value: v, 'data-testid': tid, style: { maxWidth: '120px' } });
const _o9 = (v, tid) => h('input', { type: 'checkbox', checked: !!Number(v), 'data-testid': tid });
const f = { overdue: num(_oy(c), 'cfg-overdue'), auto: num(Number(c.auto_m) >= 0 && c.auto_m !== undefined ? Number(c.auto_m) : Math.round((Number(c.auto_h) || 0) * 60), 'cfg-auto'), intake: _o9(c.intake_pool, 'cfg-intake'), ping: _o9(c.ping_admin, 'cfg-ping'),
ack: num(Number(c.ack_m) || 15, 'cfg-ack'), sack: _o9(c.sale_ack === undefined ? 1 : c.sale_ack, 'cfg-sale-ack'), cap: num(Number(c.cap) || 0, 'cfg-cap'),
wf: num(c.work_from === undefined ? 8 : c.work_from, 'cfg-work-from'), wt: num(c.work_to === undefined ? 21 : c.work_to, 'cfg-work-to'),
rep: _o9(c.rep_on === undefined ? 1 : c.rep_on, 'cfg-rep-on'), reph: num(c.rep_h || 17, 'cfg-rep-h'), repe: num(c.rep_every || 3, 'cfg-rep-every'),
on: _o9(ch.on, 'cfg-cheer-on'), proj: _o9(ch.show_project, 'cfg-cheer-project'), val: _o9(ch.show_value, 'cfg-cheer-value'), confirm: _o9(ch.confirm, 'cfg-cheer-confirm'),
aud: _o1.select([['all', 'Toàn công ty'], ['team', 'Chỉ nhóm của sale']], ch.audience || 'all', { 'data-testid': 'cfg-cheer-audience' }),
tpl: h('input', { value: ch.template || '', maxlength: 300, 'data-testid': 'cfg-cheer-template', placeholder: '🎉 Chúc mừng {sale}{nhom} vừa chốt thành công {du_an}!' }) };
const _o1b = (label, input, hint) => h('label', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, label), input, hint ? h('small', { class: 'bds-field-h' }, hint) : null);
body.append(
_o1.card({ title: 'Kho lead', body: [
_o1b('Cảnh báo khách "Mới nhận" sau (phút)', f.overdue, 'Anh/chị tự điền số phút. Mặc định 120 phút (2 giờ), từ 5 đến 43.200 phút (30 ngày). Cảnh báo hiện ngay khi quá số phút.'),
_o1b('Tự thu hồi nếu chưa liên hệ sau (phút)', f.auto, 'Anh/chị tự điền số phút. 0 = TẮT (mặc định); bật thì từ 5 phút. Khách quá thời gian tự về kho, ghi lý do – máy chủ kiểm 5 phút một lần nên có thể trễ tới khoảng 5 phút.'),
h('label', { class: 'bds-row' }, f.intake, 'Khách từ landing công ty / khoá nhận khách chung vào Kho lead'),
h('label', { class: 'bds-row' }, f.ping, 'Nhắc Quản trị (Telegram chung) khi khách công ty cấp tới Hẹn xem / Đặt cọc / Chốt')] }),
_o1.card({ title: 'Nhận số và báo cáo', testid: 'cfg-flow', body: [
_o1b('Bấm "Đã nhận" / "Đã gọi" trong (phút)', f.ack, 'Trưởng nhóm bấm Đã nhận, sale bấm Đã gọi trong số phút này; quá giờ số chuyển nhóm kế / về lại nhóm. Mặc định 15.'),
h('label', { class: 'bds-row' }, f.sack, 'Sale phải bấm "Đã gọi" (ghi kết quả cuộc gọi đầu), quá giờ thu hồi'),
h('div', { class: 'bds-row bds-wrap' }, _o1b('Giờ làm từ', f.wf), _o1b('đến', f.wt)),
h('small', { class: 'bds-field-h' }, 'Ngoài giờ làm đồng hồ dừng, sáng hôm sau chạy tiếp. Mặc định 8 – 21.'),
_o1b('Tối đa số đang giữ / sale', f.cap, '0 = không giới hạn. Đủ số thì không nhận thêm.'),
h('label', { class: 'bds-row' }, f.rep, 'Nhắc sale báo cáo mỗi ngày (Telegram)'),
_o1b('Giờ nhắc báo cáo', f.reph, 'Từ 8 đến 22 giờ. Mặc định 17.'),
_o1b('Số "Đang chăm" hỏi lại sau (ngày)', f.repe, 'Mặc định 3. Sale tick "Không hỏi lại" thì thôi hỏi số đó.')] }),
_o1.card({ title: '🎉 Chúc mừng chốt đơn', testid: 'cfg-cheer', body: [
h('label', { class: 'bds-row' }, f.on, 'Bật chúc mừng khi khách công ty cấp được Chốt'),
_o1b('Ai nhận', f.aud),
h('label', { class: 'bds-row' }, f.proj, 'Hiện dự án / loại sản phẩm'),
h('label', { class: 'bds-row' }, f.val, 'Hiện giá trị giao dịch'),
h('label', { class: 'bds-row' }, f.confirm, 'Cần Quản trị/Trưởng nhóm xác nhận trước khi chúc mừng'),
_o1b('Lời chúc riêng (tuỳ chọn)', f.tpl, 'Dùng {sale}, {nhom}, {du_an}, {loai}, {gia_tri}. Không bao giờ có tên/số điện thoại khách.')] }),
_o1.button('Lưu cài đặt', async () => {
await _o1.api('pool.config', { overdue_m: Number(f.overdue.value) || 120, auto_m: Number(f.auto.value) || 0, intake_pool: f.intake.checked, ping_admin: f.ping.checked,
ack_m: Number(f.ack.value) || 15, sale_ack: f.sack.checked, cap: Number(f.cap.value) || 0, work_from: Number(f.wf.value), work_to: Number(f.wt.value) || 21,
rep_on: f.rep.checked, rep_h: Number(f.reph.value) || 17, rep_every: Number(f.repe.value) || 3,
cheer: { on: f.on.checked, audience: f.aud.value, show_project: f.proj.checked, show_value: f.val.checked, confirm: f.confirm.checked, template: f.tpl.value.trim() } });
_o1.toast('Đã lưu cài đặt Kho lead', 'success'); _o17();
}, { kind: 'primary', icon: 'check', testid: 'cfg-save' }));
}
await _o17();
}
export default {
manifest: {
id: 'lead_pool', title: 'Kho lead', icon: '📥', screen: 'customers', order: 12, version: '1.0.0', status: 'ready', requires: 'lead_any',
help: 'Kho lead công ty: nhập khách từ quảng cáo, đẩy số cho nhân viên hoặc nhóm sale, thu hồi, xem trạng thái và báo cáo nguồn khách. Chỉ bản Công ty.',
},
mount,
async selftest() { return { ok: LP.STAGES.length === 11 && !!LP.LEVEL.hot, details: 'lead_pool' }; },
};

import { h } from '../_lib/kit.js';
import * as CH from '../_lib/staff_chat.js';
import * as S from '../_lib/staff.js';
import * as R from './chat_run.js';
import * as Learn from './memory_learn.js';
import { askRejectReason } from './memory_ui.js';
const _o8 = (ctx) => { try { return !!(ctx.ai && typeof ctx.ai.availability === 'function' && ctx.ai.availability().claude); } catch { return false; } };
const _o0 = `
.stc{display:flex;flex-direction:column;gap:8px;min-width:0;width:100%;max-width:100%;box-sizing:border-box;contain:inline-size}
.stc-head{display:flex;flex-wrap:wrap;gap:8px;align-items:center;min-width:0}
.stc-head .stc-q{display:inline-flex;gap:6px;align-items:center;font-size:.85rem}
.stc .stc-q input[type=number]{width:84px;min-width:0;flex:0 0 auto}
.stc .stc-q input[type=checkbox]{width:22px;height:22px;min-height:0;flex:0 0 auto;margin:0}
.stc-log{display:flex;flex-direction:column;gap:8px;max-height:min(58vh,560px);min-height:120px;overflow-y:auto;overflow-x:hidden;padding:8px;border:1px solid var(--line);border-radius:14px;background:var(--surface-2)}
.stc-m{max-width:88%;padding:8px 10px;border-radius:14px;overflow-wrap:anywhere;font-size:.92rem;display:flex;flex-direction:column;gap:6px;min-width:0;box-sizing:border-box}
.stc-m.me{align-self:flex-end;background:var(--navy);color:var(--cream);border-bottom-right-radius:4px;white-space:pre-wrap}
.stc-m.ai{align-self:flex-start;background:var(--card);border:1px solid var(--line-2);border-bottom-left-radius:4px}
.stc-m .who{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-weight:600;font-size:.85rem}
.stc-m .txt{white-space:pre-wrap;overflow-wrap:anywhere;max-height:320px;overflow-y:auto}
.stc-m textarea{width:100%;box-sizing:border-box;max-width:100%}
.stc-sys{align-self:center;text-align:center;font-size:.82rem;color:var(--muted);max-width:95%;overflow-wrap:anywhere;display:flex;flex-direction:column;gap:6px;align-items:center}
.stc-plan{align-self:stretch;border:1px solid var(--gold-line);border-radius:14px;padding:8px 10px;background:var(--card);display:flex;flex-direction:column;gap:6px;min-width:0}
.stc-plan ol{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px}
.stc-plan li{overflow-wrap:anywhere;font-size:.88rem}
.stc-plan li small{color:var(--muted)}
.stc-foot{display:flex;gap:8px;align-items:flex-end;min-width:0}
.stc-foot textarea{flex:1;min-width:0;resize:vertical;box-sizing:border-box}
.stc-chips{display:flex;gap:6px;overflow-x:auto;padding-bottom:2px;min-width:0}
.stc-chips .stf-chipbtn{white-space:nowrap}
.stc-pick{display:flex;flex-direction:column;gap:6px}
.stc-pick button{justify-content:flex-start}
.stc-pe{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr) auto;gap:6px;align-items:center}
.stc-pe select,.stc-pe input[type=text]{min-width:0;width:100%;box-sizing:border-box}
@media (max-width:460px){.stc-pe{grid-template-columns:minmax(0,1fr) auto}.stc-pe input[type=text]{grid-column:1/-1}.stc-m{max-width:94%}}
`;
let _o9 = false;
function ensureCss() {
if (_o9 || typeof document === 'undefined') return;
_o9 = true;
try { const _o15 = new CSSStyleSheet(); _o15.replaceSync(_o0); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _o15]; return; } catch { }
const _o11 = document.createElement('style'); _o11.textContent = _o0; document.head.appendChild(_o11);
}
const _o2 = { queued: 'info', running: 'info', waiting_approval: 'warn', done: 'success', error: 'danger' };
const _o1 = { planned: 'warn', running: 'info', done: 'success', error: 'danger', stopped: 'muted', cancelled: 'muted' };
const _oo = (staffList, id) => { const _o11 = (staffList || []).find(x => x.id === id); return _o11 ? (_o11.icon || '🤖') + ' ' + _o11.name : '🤖 (đã xoá)'; };
export function chatPanel(D, { kind, id, prefill = '' }) {
ensureCss();
const { K, ctx } = D;
const _o1c = h('div', { class: 'stc', 'data-testid': 'chat-' + kind, 'data-thread': id });
const head = h('div', { class: 'stc-head', 'data-testid': 'chat-head' });
const log = h('div', { class: 'stc-log', 'data-testid': 'chat-log', role: 'log', 'aria-live': 'polite', 'aria-label': 'Hội thoại' });
const chips = h('div', { class: 'stc-chips', 'data-testid': 'chat-chips', 'aria-label': 'Gợi ý nhanh' });
const ta = h('textarea', { rows: 2, maxlength: String(CH.CHAT_LIMITS.textMax), 'data-testid': 'chat-input', 'aria-label': 'Tin nhắn giao việc',
placeholder: kind === 'room' ? 'Nhắn yêu cầu cho cả phòng – các nhân viên tự chia việc' : 'Nhắn việc cho nhân viên…',
onkeydown: e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); _oq(); } } });
const _o13 = K.button('Gửi', () => _oq(), { kind: 'primary', testid: 'chat-send' });
const _op = h('small', { class: 'bds-muted', 'data-testid': 'chat-note' }, 'Kết quả là bản nháp, vào Việc cần duyệt – app không tự gửi khách, không tự đăng.');
_o1c.append(head, log, chips, h('div', { class: 'stc-foot' }, ta, _o13), _op);
if (prefill) { ta.value = String(prefill); setTimeout(() => { try { ta.focus(); } catch { } }, 50); }
let _o14 = false;
let _oi = '';
async function _oq() {
if (_o14) return;
_o14 = true; _o13.disabled = true;
try {
const _ou = kind === 'room' ? await R.sendToRoom(D, { roomId: id, text: ta.value }) : await R.sendToStaff(D, { staffId: id, text: ta.value });
if (!_ou.ok) { K.toast(_ou.error, 'warn'); return; }
ta.value = '';
if (_ou.done) _ou.done.then(() => _oa()).catch(() => _oa());
} finally { _o14 = false; _o13.disabled = false; _oa(); }
}
async function _oa(_or = {}) {
if (!_o1c.isConnected && _oe) return;
_oe = true;
const [rows, all, cfg] = await Promise.all([K.list('objects'), D.loadAll(), R.loadCfg(K)]);
const _on = CH.threadMsgs(rows, id);
const jobs = new Map(all.jobs.map(j => [j.id, j]));
const _o4 = document.activeElement;
if (!(head.contains(_o4) && _o4.tagName === 'INPUT' && _o4.type === 'number')) _oc(all, cfg, _on);
_ob(cfg);
if (!_or.force && (_oi || (log.contains(document.activeElement) && document.activeElement.tagName === 'TEXTAREA'))) return;
const _o7 = log.scrollHeight - log.scrollTop - log.clientHeight < 40;
log.innerHTML = '';
if (!_on.length) log.appendChild(h('div', { class: 'stc-sys', 'data-testid': 'chat-empty' }, kind === 'room'
? 'Nhắn một yêu cầu – trưởng phòng ảo chia việc cho từng người, ai làm xong báo kết quả ở đây.'
: 'Nhắn việc cần làm – nhân viên trả bản nháp ngay trong khung này.'));
for (const m of _on) log.appendChild(_ov(m, all, jobs, cfg));
if (_o7 || firstDraw) log.scrollTop = log.scrollHeight;
firstDraw = false;
}
let _oe = false, firstDraw = true;
function _oc(all, cfg, _on) {
head.innerHTML = '';
const _o19 = CH.threadCfg(cfg, id);
const _o12 = async patch => { await R.saveCfg(K, CH.setThreadCfg(await R.loadCfg(K), id, patch)); _oa(); };
if (kind === 'room') {
const _oz = all.rooms.find(_ou => _ou.id === id);
const _om = CH.roomMembers(_oz, all.staffList);
head.appendChild(h('div', { class: 'stf-seg', role: 'group', 'data-testid': 'chat-mode', 'aria-label': 'Cách chạy' }, Object.entries(CH.CHAT_MODES).map(([v, l]) =>
h('button', { type: 'button', 'aria-pressed': String(v === _o19.mode), 'data-v': v, onclick: () => _o12({ mode: v }) }, l))));
head.appendChild(h('label', { class: 'stc-q' }, h('input', { type: 'checkbox', checked: _o19.ai_split, 'data-testid': 'chat-aisplit', onchange: e => _o12({ ai_split: e.target.checked }) }), 'Chia bằng AI'));
head.appendChild(h('small', { class: 'bds-muted', 'data-testid': 'chat-members' }, _om.length ? 'Trong phòng: ' + _om.map(_o11 => (_o11.icon || '🤖') + ' ' + _o11.name).join(', ') : 'Phòng chưa có nhân viên đang bật.'));
} else {
const _o17 = all.staffList.find(_o11 => _o11.id === id);
if (_o17 && S.isOff(_o17)) head.appendChild(h('small', { class: 'bds-muted', 'data-testid': 'chat-off' }, '⏸ ' + S.STATUS_OFF));
if (_o17) head.appendChild(h('small', { class: 'bds-muted', 'data-testid': 'chat-data' }, _o17.data_access ? '🔓 Đọc dữ liệu khách rút gọn (khách đã đồng ý, không sđt/email)' : '🔒 Không đọc dữ liệu khách'));
}
const _o1a = CH.runsToday(all.jobs, id);
head.appendChild(h('label', { class: 'stc-q', title: 'Hạn mức lượt chạy mỗi ngày (mỗi bước = 1 lượt)' }, 'Lượt/ngày',
h('input', { type: 'number', min: '1', max: String(CH.CHAT_LIMITS.runsPerDayMax), inputmode: 'numeric', value: String(_o19.runs_per_day), 'data-testid': 'chat-quota', style: 'width:84px;flex:0 0 auto',
'aria-label': 'Lượt chạy mỗi ngày', onchange: e => _o12({ runs_per_day: Number(e.target.value) }) }), h('small', { class: 'bds-muted' }, `hôm nay ${_o1a}`)));
head.appendChild(K.button('🗑 Xoá hội thoại', async () => {
if (!_on.length) { K.toast('Hội thoại đang trống', 'info'); return; }
const ok = await K.confirm({ title: 'Xoá hội thoại?', text: 'Xoá mọi tin trong khung chat này. Bản nháp ở Việc cần duyệt vẫn giữ.', ok: 'Xoá', kind: 'danger', testid: 'chat-clear-confirm' });
if (!ok) return;
const n = await R.clearThread(D, id);
K.toast(`Đã xoá ${n} tin`, 'success'); _oa();
}, { testid: 'chat-clear' }));
}
function _ob(cfg) {
chips.innerHTML = '';
cfg.chips.forEach((c, i) => chips.appendChild(h('button', { type: 'button', class: 'stf-chipbtn', 'data-testid': 'chat-chip-' + i, title: 'Điền vào ô nhập',
onclick: () => { ta.value = c; ta.focus(); } }, c)));
chips.appendChild(h('button', { type: 'button', class: 'stf-chipbtn', 'data-testid': 'chat-chips-edit', 'aria-label': 'Sửa gợi ý nhanh', onclick: () => _og(D, cfg, _oa) }, '✏️ Sửa gợi ý'));
}
function _ov(m, all, jobs, cfg) {
if (m.role === 'owner') return h('div', { class: 'stc-m me', 'data-testid': 'chat-msg-owner' }, m.text || '');
if (m.role === 'plan') return renderPlan(m, all);
if (m.role === 'pick') return _ow(m, all);
if (m.role === 'staff') return _ox(m, all, jobs);
return h('div', { class: 'stc-sys', 'data-testid': 'chat-msg-system' }, m.text || '');
}
function _ow(m, all) {
const box = h('div', { class: 'stc-sys stc-pick', 'data-testid': 'chat-msg-pick' }, h('span', null, '🤔 ' + (m.text || 'Chọn người làm:')));
if (m.answered) { box.appendChild(h('small', null, 'Đã chọn ' + _oo(all.staffList, m.answered))); return box; }
for (const _o16 of m.options || []) box.appendChild(K.button(_oo(all.staffList, _o16), async () => {
const _ou = await R.sendToRoom(D, { roomId: id, pickStaffId: _o16, pickMsgId: m.id });
if (!_ou.ok) K.toast(_ou.error, 'warn');
if (_ou.done) _ou.done.then(() => _oa());
_oa();
}, { testid: 'chat-pick-' + _o16 }));
return box;
}
function renderPlan(m, all) {
const run = m.run || { steps: [], status: 'cancelled' };
const _ok = R.runningHere(id);
const _o18 = run.status === 'running' && !CH.isActive(run) && !_ok;
const box = h('div', { class: 'stc-plan', 'data-testid': 'chat-plan', 'data-status': run.status, 'data-plan': m.id },
h('div', { class: 'bds-row bds-wrap' }, h('strong', null, '🧭 Kế hoạch chia việc'), K.badge(_o18 ? 'Bị ngắt giữa chừng' : CH.RUN_STATE[run.status] || run.status, _o1[run.status] || 'info'),
run.source === 'ai' ? K.badge('AI chia', 'muted') : run.source === 'rules' ? K.badge('Chia theo luật', 'muted') : null),
h('ol', null, run.steps.map(_o11 => h('li', { 'data-testid': 'chat-plan-step', 'data-state': _o11.state },
h('b', null, (_o11.icon || '🤖') + ' ' + (_o11.name || _oo(all.staffList, _o11.staff_id))), _o11.summary ? ' 📋' : '', ' – ' + _o11.part,
h('small', null, ' · ' + (CH.STEP_STATE[_o11.state] || _o11.state) + (_o11.deps && _o11.deps.length ? ' · dùng kết quả bước ' + _o11.deps.join(', ') : ''))))));
if (run.error) box.appendChild(h('p', { class: 'bds-error', 'data-testid': 'chat-plan-error' }, '⚠ ' + run.error));
const _o3 = h('div', { class: 'bds-row bds-wrap' });
if (run.status === 'planned') {
_o3.appendChild(K.button('▶ Chạy', async () => {
const _ou = await R.runPlan(D, id, m.id);
if (!_ou.ok) { K.toast(_ou.error, 'warn'); return; }
_ou.done.then(() => _oa()); _oa();
}, { kind: 'primary', testid: 'chat-plan-run' }));
_o3.appendChild(K.button('✏️ Sửa', () => _oh(D, id, m, all, _oa), { testid: 'chat-plan-edit' }));
_o3.appendChild(K.button('Huỷ', async () => { await R.cancelPlan(D, m.id); _oa(); }, { testid: 'chat-plan-cancel' }));
} else if (run.status === 'running' && !_o18) {
_o3.appendChild(K.button('⏹ Dừng', async () => { await R.stopPlan(D, id, m.id); K.toast('Đã dừng yêu cầu', 'success'); _oa(); }, { kind: 'danger', testid: 'chat-plan-stop' }));
} else if (_o18) {
_o3.appendChild(K.button('▶ Chạy tiếp', async () => { const _ou = await R.runPlan(D, id, m.id); if (!_ou.ok) { K.toast(_ou.error, 'warn'); return; } _ou.done.then(() => _oa()); _oa(); }, { testid: 'chat-plan-resume' }));
_o3.appendChild(K.button('Dừng hẳn', async () => { await R.stopPlan(D, id, m.id); _oa(); }, { testid: 'chat-plan-stop' }));
}
if (_o3.children.length) box.appendChild(_o3);
return box;
}
function _ox(m, all, jobs) {
const row = jobs.get(m.task_id);
const box = h('div', { class: 'stc-m ai', 'data-testid': 'chat-reply-' + m.task_id, 'data-task': m.task_id });
const _o1b = h('div', { class: 'who' }, _oo(all.staffList, m.staff_id), m.summary ? K.badge('📋 Tổng hợp', 'info') : null, m.step_n ? h('small', { class: 'bds-muted' }, 'bước ' + m.step_n) : null);
box.appendChild(_o1b);
if (!row) { box.appendChild(h('small', { class: 'bds-muted' }, '(việc đã xoá)')); return box; }
const t = S.taskView(row);
const _o6 = S.inboxApproved(t);
_o1b.appendChild(K.badge(_o6 ? 'Đã duyệt' : CH.TASK_STATE[t.status] || t.status, _o6 ? 'success' : _o2[t.status] || 'info'));
box.dataset.status = _o6 ? 'approved' : t.status;
const text = String(t.output.final_text || t.output.text || '');
if (t.status === 'queued' || t.status === 'running') {
if (!_o6) { box.appendChild(h('div', { class: 'txt bds-muted' }, '⏳ Đang làm…')); return box; }
}
if (t.status === 'error') {
box.appendChild(h('p', { class: 'bds-error', 'data-testid': 'chat-error' }, '⚠ ' + (t.output.rejected ? 'Anh/chị đã bác' + (t.output.reason ? ': ' + t.output.reason : '') : t.output.error || 'Lỗi không rõ')));
const _o3 = h('div', { class: 'bds-row bds-wrap' });
if (!t.output.rejected && ctx.ai && typeof ctx.ai.handoff === 'function' && _o8(ctx)) _o3.appendChild(K.button('Nhờ Claude', async () => {
if (await R.handoffTask(D, t.id)) K.toast('Đã dán kết quả Claude – xem lại rồi Duyệt', 'success');
_oa();
}, { testid: 'chat-handoff', title: 'Mở Claude với lời nhắn soạn sẵn – anh/chị tự dán kết quả, không tự động' }));
if (!t.output.rejected && kind === 'staff' && !t.output.no_ai) _o3.appendChild(K.button('↻ Chạy lại', async () => { const _ot = R.retryTask(D, t.id); _oa(); await _ot; _oa(); }, { testid: 'chat-retry' }));
if (_o3.children.length) box.appendChild(_o3);
if (!text) return box;
}
if (_oi === t.id) {
const _of = h('textarea', { rows: 8, 'data-testid': 'chat-edit-text', 'aria-label': 'Sửa bản nháp' });
_of.value = text;
box.appendChild(_of);
box.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('✅ Lưu & duyệt', async () => { _oi = ''; await _o5(row, _of.value); }, { kind: 'primary', testid: 'chat-edit-save' }),
K.button('Huỷ', () => { _oi = ''; _oa({ force: true }); }, { testid: 'chat-edit-cancel' })));
setTimeout(() => _of.focus(), 0);
return box;
}
box.appendChild(h('small', { class: 'bds-muted' }, t.status === 'waiting_approval' ? '📝 Bản nháp – đã vào Việc cần duyệt' : t.status === 'done' ? '✅ Đã duyệt' : 'Bản nháp'));
box.appendChild(h('div', { class: 'txt', 'data-testid': 'chat-draft' }, CH.displayText(text)));
if (t.status === 'waiting_approval') {
box.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('✅ Duyệt', () => _o5(row, text), { kind: 'primary', testid: 'chat-approve' }),
K.button('✏️ Sửa', () => { _oi = t.id; _oa({ force: true }); }, { testid: 'chat-edit' }),
K.button('Bác', async () => {
const reason = await askRejectReason(K);
if (reason === null) return;
const _ol = await Learn.rejectRow(K, row, reason);
K.toast(_ol.kind ? 'Nhân viên đã nhớ điều anh/chị bác' : 'Đã bác', 'success'); _oa();
}, { testid: 'chat-reject' })));
}
return box;
}
async function _o5(row, finalText) {
const _ol = await Learn.approveRow(K, row, finalText);
K.toast(_ol.kind ? Learn.LEARN_TOAST : 'Đã duyệt', 'success');
_oi = '';
await _oa({ force: true });
Promise.resolve(D.runPending({ manual: true })).catch(() => null).then(() => _oa());
}
_oa();
K.on(_o1c, ['objects', 'jobs', 'settings'], () => _oa());
_o1c.redraw = _oa;
return _o1c;
}
function _og(D, cfg, after) {
const { K } = D;
const ta = h('textarea', { rows: 6, 'data-testid': 'chat-chips-text', 'aria-label': 'Gợi ý nhanh, mỗi dòng một gợi ý' });
ta.value = cfg.chips.join('\n');
const m = K.modal({ title: 'Sửa gợi ý nhanh', testid: 'chat-chips-form', body: [
h('small', { class: 'bds-muted' }, `Mỗi dòng một gợi ý (tối đa ${CH.CHAT_LIMITS.chipsMax}). Bấm gợi ý để điền nhanh vào ô nhập.`), ta,
h('div', { class: 'bds-row bds-end bds-wrap' },
K.button('Khôi phục mặc định', () => { ta.value = CH.DEFAULT_CHIPS.join('\n'); }),
K.button('Lưu', async () => {
const cur = await R.loadCfg(K);
await R.saveCfg(K, { ...cur, chips: ta.value.split('\n') });
m.close(); K.toast('Đã lưu gợi ý', 'success'); after();
}, { kind: 'primary', testid: 'chat-chips-save' }))] });
}
function _oh(D, roomId, msg, all, after) {
const { K } = D;
const _oz = all.rooms.find(_ou => _ou.id === roomId);
const _om = CH.roomMembers(_oz, all.staffList);
let rows = msg.run.steps.map(_o11 => ({ staff_id: _o11.staff_id, part: _o11.part, wait: (_o11.deps || []).length > 0, summary: !!_o11.summary }));
const list = h('div', { class: 'bds-form' });
const err = h('p', { class: 'bds-error', 'data-testid': 'pe-err', hidden: true });
const _or = _om.map(_o11 => [_o11.id, (_o11.icon || '🤖') + ' ' + _o11.name]);
function _od() {
list.innerHTML = '';
rows.forEach((_ou, i) => list.appendChild(h('div', { class: 'stc-pe', 'data-testid': 'pe-row-' + i },
K.select(_or, _ou.staff_id, { 'data-testid': 'pe-staff-' + i, 'aria-label': 'Người làm bước ' + (i + 1), onchange: e => { _ou.staff_id = e.target.value; } }),
h('input', { type: 'text', value: _ou.part, maxlength: String(CH.CHAT_LIMITS.partMax), 'data-testid': 'pe-part-' + i, 'aria-label': 'Phần việc bước ' + (i + 1), oninput: e => { _ou.part = e.target.value; } }),
h('div', { class: 'bds-row' },
i ? h('label', { class: 'stf-check', title: 'Bước này dùng kết quả các bước trước' }, h('input', { type: 'checkbox', checked: _ou.wait, 'data-testid': 'pe-wait-' + i, onchange: e => { _ou.wait = e.target.checked; } }), 'Chờ bước trước') : null,
K.button('✕', () => { rows.splice(i, 1); _od(); }, { testid: 'pe-del-' + i, title: 'Bỏ bước này' })))));
add.disabled = rows.length >= CH.CHAT_LIMITS.maxSteps;
}
const add = K.button('+ Thêm bước', () => { if (rows.length < CH.CHAT_LIMITS.maxSteps && _or.length) { rows.push({ staff_id: _or[0][0], part: '', wait: rows.length > 0 }); _od(); } }, { testid: 'pe-add' });
const m = K.modal({ title: 'Sửa kế hoạch chia việc', testid: 'plan-edit', body: [
h('small', { class: 'bds-muted' }, `Tối đa ${CH.CHAT_LIMITS.maxSteps} bước. "Chờ bước trước" = bước này nhận kết quả các bước phía trên làm đầu vào.`), list, err,
h('div', { class: 'bds-row bds-wrap bds-end' }, add, K.button('Lưu kế hoạch', async () => {
const steps = rows.map((_ou, i) => ({ n: i + 1, staff_id: _ou.staff_id, part: _ou.part, deps: _ou.wait ? Array.from({ length: i }, (_, j) => j + 1) : [], summary: _ou.summary }));
const _oy = await R.editPlan(D, roomId, msg.id, { steps });
if (!_oy.ok) { err.textContent = _oy.error; err.hidden = false; return; }
m.close(); K.toast('Đã sửa kế hoạch – bấm Chạy khi sẵn sàng', 'success'); after();
}, { kind: 'primary', testid: 'pe-save' }))] });
_od();
}
export async function openChat(D, { kind, id, prefill = '' }) {
const { K } = D;
const all = await D.loadAll();
const title = kind === 'room'
? '💬 Phòng ' + (((all.rooms.find(_ou => _ou.id === id) || {}).name) || '')
: '💬 ' + _oo(all.staffList, id);
return K.sheet({ title, testid: 'chat-sheet', body: chatPanel(D, { kind, id, prefill }), onClose: () => D.refresh && D.refresh() });
}
export async function openPicker(D) {
ensureCss();
const { K } = D;
const { staffList, rooms } = await D.loadAll();
let m = null;
const _oj = target => { if (m) m.close(); setTimeout(() => openChat(D, target), 0); };
const _o10 = rooms.map(_ou => K.button((_ou.icon || '🏢') + ' Phòng ' + _ou.name + ` (${CH.roomMembers(_ou, staffList).length} người)`, () => _oj({ kind: 'room', id: _ou.id }), { testid: 'chat-pick-room-' + _ou.id }));
const _os = [...staffList.filter(_o11 => !S.isOff(_o11)), ...staffList.filter(_o11 => S.isOff(_o11))];
const staffBtns = _os.map(_o11 => K.button((_o11.icon || '🤖') + ' ' + _o11.name + (S.isOff(_o11) ? ' · tắt – vẫn chat được' : ''), () => _oj({ kind: 'staff', id: _o11.id }), { testid: 'chat-pick-staff-' + _o11.id }));
m = K.modal({ title: '💬 Giao việc – nhắn cho ai?', testid: 'chat-picker', body: [
h('strong', null, 'Phòng (các nhân viên tự chia việc)'), h('div', { class: 'stc-pick' }, _o10),
h('strong', null, 'Một nhân viên'), h('div', { class: 'stc-pick' }, staffBtns.length ? staffBtns : h('small', { class: 'bds-muted' }, 'Chưa có nhân viên.'))] });
return m;
}

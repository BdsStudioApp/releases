import { h } from '../_lib/kit.js';
import * as D from '../_lib/inbox_desk.js';
import * as S from '../_lib/staff.js';
import * as T from '../_lib/staff_templates.js';
import * as C from '../_lib/staff_custom.js';
import * as M from '../_lib/staff_memory.js';
import * as crm from '../_lib/crm.js';
const _o1 = () => Promise.reject(new Error('Nhân viên AI chưa có trong bản này'));
let _o18 = _o1;
let _o17 = _o1;
const _o0 = `
.dsk-box{display:flex;flex-direction:column;gap:8px;min-width:0}
.dsk-box textarea{width:100%;max-width:100%;box-sizing:border-box;min-height:84px}
.dsk-res{display:flex;flex-direction:column;gap:6px;min-width:0}
.dsk-res[hidden]{display:none}
.dsk-line{margin:0;font-size:.9rem;overflow-wrap:anywhere}
.dsk-opts{display:flex;flex-direction:column;gap:8px;min-width:0;margin:6px 0}
.dsk-opt{border:1px solid var(--line-2);border-radius:12px;padding:8px 10px;display:flex;flex-direction:column;gap:6px;min-width:0;background:var(--card)}
.dsk-off summary{cursor:pointer;font-weight:600}
.dsk-opt p{margin:0;white-space:pre-wrap;overflow-wrap:anywhere}
`;
let _oc = false;
function ensureCss() {
if (_oc || typeof document === 'undefined') return;
_oc = true;
try { const _o16 = new CSSStyleSheet(); _o16.replaceSync(_o0); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _o16]; return; } catch { }
const _o11 = document.createElement('style'); _o11.textContent = _o0; document.head.appendChild(_o11);
}
const deps = { makeAdhocTask: C.makeAdhocTask, buildMemoryContext: M.buildMemoryContext, M };
const staffList = async K => S.normalizeStaff(await K.setting('staff', null));
const _of = list => list.filter(_o11 => D.isDeskStaff(_o11) && _o11.enabled !== false);
const _oa = ctx => { const _oy = ctx.user && ctx.user.role; return !_oy || _oy === 'owner' || _oy === 'manager'; };
export const staffShipped = ctx => { try { const _om = ctx && ctx.pack && ctx.pack.modules; return !Array.isArray(_om) || _om.some(x => (typeof x === 'string' ? x : x && x.id) === 'staff'); } catch { return true; } };
const _o19 = ctx => { if (!staffShipped(ctx)) return false; try { return (!ctx.packs || ctx.packs.moduleOn('staff') !== false) && !(ctx.video && ctx.video.pathHidden && ctx.video.pathHidden('home/staff')); } catch { return true; } };
async function _ox(K, staff, _oe) {
const [F, SkillStore, MemStore] = await _o18();
let _oo = [];
try { _oo = await SkillStore.listSkills(K); } catch { _oo = []; }
let _on = [];
try { _on = await MemStore.listMemories(K); } catch { _on = []; }
const customers = staff.data_access === true ? F.customersOf(await K.list('objects')) : [];
const t = F.makeStepTask({ room: F.directRoom(staff), staffList: [staff], stepIndex: 0, taskText: _oe.taskText, lib: F.mergeLibrary(T.BUILTIN_SKILLS, _oo),
customers, deps, memories: _on });
if (!t) return null;
const _ob = D.channelOf(_oe.desk.channel);
t.title = `${staff.name}: ${_oe.intent.icon} ${_oe.intent.label} – ${_ob.label}: ${_oe.maskedText.replace(/\s+/g, ' ').slice(0, 60)}`.slice(0, 140);
t.input = { ...t.input, desk: _oe.desk };
return t;
}
export function deskCard(K, { onDone } = {}) {
const ctx = K.ctx;
if (!_oa(ctx)) return null;
ensureCss();
const channel = K.select(D.CHANNELS.map(_o9 => [_o9.id, _o9.label]), 'zalo', { 'data-testid': 'desk-channel', 'aria-label': 'Kênh' });
const ta = h('textarea', { rows: 3, maxlength: String(D.MESSAGE_MAX), placeholder: 'Dán tin nhắn hoặc bình luận của khách…', 'data-testid': 'desk-text', 'aria-label': 'Tin khách' });
const res = h('div', { class: 'dsk-res', 'data-testid': 'desk-result', hidden: true });
const staffBox = h('div', { class: 'bds-row bds-wrap' });
const err = h('p', { class: 'bds-error', role: 'alert', 'data-testid': 'desk-err' });
let _o1b = 0;
let _od = null;
let _o8 = false;
let _o15 = 0;
async function _o5() {
const _op = ++_o15;
clearTimeout(_o1b);
err.textContent = '';
const text = ta.value;
if (!text.trim()) { res.hidden = true; res.innerHTML = ''; _od = null; return; }
const _or = await K.list('objects');
if (_op !== _o15) return;
const _ow = D.extractContact(text, K.projects());
const existing = _ow.phone ? crm.findDuplicatePhone(_or, _ow.phone) : null;
_od = D.buildDeskTask({ message: text, channel: channel.value, projects: K.projects(), existing });
res.hidden = false;
res.innerHTML = '';
const _oj = _od.intent;
const badge = K.badge(_oj.icon + ' ' + _oj.label, _oj.id === 'spam' ? 'danger' : _oj.id === 'decline' ? 'muted' : 'info');
badge.dataset.testid = 'desk-intent'; badge.dataset.intent = _oj.id;
res.appendChild(h('div', { class: 'bds-row bds-wrap' }, badge,
_oj.secondary.map(k => K.badge(D.INTENTS[k].icon + ' ' + D.INTENTS[k].label, 'muted'))));
const _o9 = _od.contact;
const _o13 = [_o9.name && 'tên ' + _o9.name, _o9.phone && 'SĐT ' + K.phone(_o9.phone), _o9.projectName && 'dự án ' + _o9.projectName].filter(Boolean);
if (_o13.length) res.appendChild(h('p', { class: 'dsk-line', 'data-testid': 'desk-contact' }, 'Nhận ra: ' + _o13.join(' · ') + (existing ? ' – khách đã có: ' + (existing.name || '') : '')));
if (_od.masked.total) res.appendChild(h('p', { class: 'dsk-line bds-muted', 'data-testid': 'desk-masked' }, `🔒 Đã che ${_od.masked.total} thông tin riêng (SĐT/CCCD/số TK/email) – AI không thấy.`));
res.appendChild(h('div', { class: 'bds-row bds-wrap', 'data-testid': 'desk-actions' }, _od.actions.map(_o3 => K.button(_o3.label, () => _og(_o3.id), { testid: 'desk-act-' + _o3.id }))));
if (_od.offline && _od.offline.length) {
res.appendChild(h('details', { class: 'dsk-off', 'data-testid': 'desk-offline' },
h('summary', null, 'Phương án mẫu (không cần AI)' + (_od.concern ? ' – ' + _od.concern.label : '')),
h('div', { class: 'dsk-opts' }, _od.offline.map((_oq, i) => h('div', { class: 'dsk-opt' }, h('strong', null, _oq.label), h('p', null, _oq.text),
h('div', { class: 'bds-row bds-wrap' }, K.button('Chép', async () => { await K.copy(_oq.text); K.toast('Đã chép – anh/chị tự dán gửi khách', 'success'); }, { testid: 'desk-off-copy-' + i })))))));
}
}
const _ok = () => { clearTimeout(_o1b); _o1b = setTimeout(_o5, 250); };
ta.addEventListener('input', _ok);
channel.addEventListener('change', _o5);
async function _og(actId) {
await _o5();
const _o3 = _od && _od.actions.find(x => x.id === actId);
if (!_o3) return;
if (_o3.id === 'ignore') { ta.value = ''; await _o5(); K.toast('Đã bỏ qua tin rác', 'success'); return; }
if (_o3.id === 'open_customer') return K.openProfile(_o3.customerId);
if (_o3.id === 'new_customer') {
const _om = await import('../customers/index.js');
return _om.openForm(ctx, null, { prefill: _o3.prefill, onSaved: () => { K.toast('Đã thêm khách', 'success'); _o5(); } });
}
if (_o3.id === 'appointment') return _os(_o3.prefill);
if (_o3.id === 'note') return _ot(_o3.prefill);
}
function _os(p) {
const _oe = new Date(Date.now() + 86400000); _oe.setHours(9, 0, 0, 0);
const _ol = new Date(_oe.getTime() - _oe.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
const title = h('input', { type: 'text', value: p.title, maxlength: '120', 'data-testid': 'desk-appt-title' });
const _o6 = h('input', { type: 'datetime-local', value: _ol, 'data-testid': 'desk-appt-at' });
const _om = K.modal({ title: 'Đặt lịch hẹn', testid: 'desk-appt', body: [h('div', { class: 'bds-form' }, K.field('Nội dung', title), K.field('Lúc', _o6)),
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _om.close()), K.button('Lưu lịch hẹn', async () => {
const _oh = new Date(_o6.value).getTime();
if (!title.value.trim() || !Number.isFinite(_oh)) { K.toast('Nhập nội dung và giờ hẹn', 'warn'); return; }
await K.put('reminders', { object_id: p.customerId || '', kind: 'meeting', title: title.value.trim(), due_at: _oh, remind_before_days: 0, amount: 0, installment: 0, done: 0, notified_at: 0,
data: JSON.stringify({ source: 'inbox_desk' }) });
if (p.customerId) await K.logEvent(p.customerId, 'meeting', 'Hẹn ' + crm.dmy(_oh) + ' ' + crm.hm(_oh) + ': ' + title.value.trim());
_om.close(); K.toast('Đã lưu lịch hẹn', 'success');
}, { kind: 'primary', testid: 'desk-appt-save' }))] });
}
function _ot(p) {
const _o7 = h('textarea', { rows: 4, 'data-testid': 'desk-note-text', style: 'width:100%;box-sizing:border-box' }); _o7.value = p.text;
const _om = K.modal({ title: p.customerId ? 'Ghi chú vào hồ sơ khách' : 'Ghi chú (nhắc xem lại ngày mai)', testid: 'desk-note', body: [_o7,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _om.close()), K.button('Lưu ghi chú', async () => {
const text = _o7.value.trim();
if (!text) return;
if (p.customerId) await K.logEvent(p.customerId, 'note', text);
else {
const _oe = new Date(Date.now() + 86400000); _oe.setHours(9, 0, 0, 0);
await K.put('reminders', { object_id: '', kind: 'custom', title: 'Xem lại tin khách: ' + text.slice(0, 150), due_at: _oe.getTime(), remind_before_days: 0, amount: 0, installment: 0, done: 0, notified_at: 0,
data: JSON.stringify({ source: 'inbox_desk' }) });
}
_om.close(); K.toast('Đã lưu ghi chú', 'success');
}, { kind: 'primary', testid: 'desk-note-save' }))] });
}
async function _o10() {
const _oo = _of(await staffList(K));
staffBox.innerHTML = '';
if (!_oo.length) {
staffBox.appendChild(h('small', { class: 'bds-muted' }, 'Chưa có nhân viên trực inbox.'));
staffBox.appendChild(K.button('+ Tạo nhân viên Trực inbox', createStaff, { testid: 'desk-create-staff' }));
return null;
}
const _o14 = K.select(_oo.map(_o11 => [_o11.id, (_o11.icon || '📨') + ' ' + _o11.name]), _oo[0].id, { 'data-testid': 'desk-staff', 'aria-label': 'Nhân viên trả lời' });
staffBox.appendChild(K.field('Nhân viên soạn', _o14));
return _o14;
}
let _o1a = null;
async function createStaff() {
const list = await staffList(K);
const _oy = C.addStaff(list, T.staffFromTemplate(D.DESK_TEMPLATE_ID));
if (!_oy.ok) { K.toast(_oy.error, 'warn'); return; }
await K.setSetting('staff', _oy.list);
K.toast('Đã tạo nhân viên Trực inbox – sửa lời dặn ở Nhân viên & Phòng', 'success');
_o1a = await _o10();
}
async function _ov() {
const _oo = _of(await staffList(K));
if (!_oo.length) { err.textContent = 'Tạo nhân viên Trực inbox trước.'; return null; }
return _oo.find(_o11 => _o1a && _o11.id === _o1a.value) || _oo[0];
}
async function _oz() {
if (_o8) return null;
await _o5();
if (!_od || !_od.ok) { err.textContent = (_od && _od.error) || 'Dán tin khách trước.'; return null; }
const staff = await _ov();
if (!staff) return null;
const t = await _ox(K, staff, _od);
if (!t) { err.textContent = 'Chưa soạn được việc cho nhân viên.'; return null; }
return t;
}
const _o4 = _o19(ctx);
const runBtn = K.button('Soạn trả lời', async () => {
const t = await _oz();
if (!t) return;
_o8 = true; runBtn.disabled = true;
try {
const _o12 = await K.put('jobs', S.taskRow(t));
const _o2 = await _o17();
await _o2.runPending(ctx, { manual: true });
const row = await K.get('jobs', _o12.id);
if (row && row.status === 'waiting_approval') { ta.value = ''; await _o5(); K.toast('Đã soạn – xem ở Chờ duyệt', 'success'); onDone && onDone(); }
else if (row && row.status === 'error') { const _oq = crm.parseData(row.output); K.toast((_oq.error || 'AI chưa soạn được') + ' – thử "Nhờ Claude"', 'warn'); }
else K.toast('Đã giao cho nhân viên – kết quả vào Chờ duyệt', 'success');
} catch (e) { K.toast((e && e.message) || 'Chưa soạn được', 'warn'); }
finally { _o8 = false; runBtn.disabled = false; }
}, { kind: 'primary', icon: 'sparkle', testid: 'desk-run', aiBadge: 'staff_run' });
const _oi = ctx.ai && typeof ctx.ai.handoff === 'function' ? K.button('Nhờ Claude', async () => {
const t = await _oz();
if (!t) return;
const _o1c = await ctx.ai.handoff('staff', t.input.prompt || '', { target: 'claude' });
if (!_o1c) return;
await K.put('jobs', S.taskRow({ ...t, status: 'waiting_approval', output: { text: _o1c, provider: 'handoff_claude', error: '', finished_at: Date.now() } }));
ta.value = ''; await _o5();
K.toast('Đã dán kết quả Claude – xem ở Chờ duyệt', 'success'); onDone && onDone();
}, { icon: 'external', testid: 'desk-handoff', title: 'Mở Claude với lời nhắn soạn sẵn (đã che SĐT/CCCD/số TK) – anh/chị tự dán kết quả' }) : null;
const _o7 = h('div', { class: 'dsk-box' },
h('div', { class: 'bds-row bds-wrap' }, K.field('Kênh', channel)),
ta, res, _o4 ? staffBox : null, err,
_o4 ? h('div', { class: 'bds-row bds-wrap' }, runBtn, _oi)
: staffShipped(ctx) ? h('p', { class: 'bds-muted', 'data-testid': 'desk-staff-off' }, 'Nhân viên AI soạn trả lời có ở Nhân viên & Phòng (gói mở rộng đang tắt). Phần nhận diện tin và phương án mẫu ở trên vẫn dùng được.') : null,
h('small', { class: 'bds-muted' }, _o4 ? 'App nhận diện ý định ngay cả khi chưa bật AI. Phương án trả lời vào Chờ duyệt – app không tự gửi cho khách.'
: 'App nhận diện ý định và gợi ý phương án trả lời mẫu – anh/chị chép rồi tự gửi, app không tự gửi cho khách.'));
if (_o4) _o10().then(_o11 => { _o1a = _o11; });
const card = K.card({ title: _o4 ? 'Dán tin khách – nhân viên AI soạn trả lời' : 'Dán tin khách', testid: 'desk', body: _o7 });
card.focusDesk = () => { try { card.scrollIntoView({ block: 'start' }); } catch { } ta.focus(); };
return card;
}
export function deskOptions(K, row, ta) {
const desk = D.deskOf(crm.parseData(row.input));
if (!desk) return null;
const _ou = D.parseReplies(ta.value);
const _ob = D.channelOf(desk.channel);
const _oj = D.INTENTS[desk.intent];
return h('div', { class: 'dsk-box', 'data-testid': 'desk-opts-' + row.id },
h('div', { class: 'bds-row bds-wrap' }, K.badge(_oj.icon + ' ' + _oj.label, 'info'), K.badge(_ob.label, 'muted'),
desk.masked ? K.badge('🔒 đã che ' + desk.masked + ' thông tin riêng', 'muted') : null),
h('div', { class: 'dsk-opts' }, _ou.map((_oq, i) => h('div', { class: 'dsk-opt', 'data-testid': `desk-opt-${i}-${row.id}` },
h('strong', null, _oq.label), h('p', null, _oq.text),
h('div', { class: 'bds-row bds-wrap' },
K.button('Dùng phương án này', () => { ta.value = _oq.text; ta.focus(); }, { testid: `desk-opt-use-${i}-${row.id}` }),
K.button('Chép', async () => { await K.copy(_oq.text); K.toast('Đã chép – anh/chị tự dán gửi khách', 'success'); }, { testid: `desk-opt-copy-${i}-${row.id}` }))))),
h('small', { class: 'bds-muted' }, 'Chọn 1 phương án (sửa nếu cần) rồi Duyệt – nhân viên nhớ giọng anh/chị. App không tự gửi cho khách.'));
}

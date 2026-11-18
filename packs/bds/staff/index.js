import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/staff.js';
import { engineCall, ENGINE_URL, parseData } from '../_lib/video.js';
import { scriptUrl } from '../../../core/api.024f831cb4.js';
const _o0 = `
.stf-flow{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.stf-flow .s{display:inline-flex;gap:6px;align-items:center;padding:6px 10px;border-radius:999px;background:var(--surface-2);border:1px solid var(--line-2);font-size:.85rem}
.stf-flow .a{color:var(--gold-text)}
.stf-board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.stf-col{background:var(--surface-2);border:1px solid var(--line);border-radius:14px;padding:8px;display:flex;flex-direction:column;gap:6px;min-height:120px}
.stf-col h4{margin:0;font-size:.85rem;display:flex;justify-content:space-between;color:var(--muted)}
.stf-col.c-review{border-color:var(--gold-line)}.stf-col.c-error{border-color:rgba(180,66,58,.35)}
.stf-task{all:unset;box-sizing:border-box;display:flex;flex-direction:column;gap:2px;padding:8px 10px;border-radius:11px;background:var(--card);border:1px solid var(--line-2);cursor:pointer;min-height:44px;font-size:.86rem}
.stf-task:focus-visible{outline:2px solid var(--gold)}
.stf-task small{color:var(--muted)}.stf-task .why{color:var(--danger)}
.stf-staff{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:12px}
.stf-card{border:1px solid var(--line-2);border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:8px;background:var(--card)}
.stf-card h4{margin:0;font-size:1.05rem}
.stf-seg{display:inline-flex;border:1px solid var(--line-2);border-radius:12px;overflow:hidden}
.stf-seg button{all:unset;white-space:nowrap;padding:0 12px;min-height:40px;display:flex;align-items:center;cursor:pointer;font-size:.85rem}
.stf-seg button[aria-pressed=true]{background:var(--navy);color:var(--cream)}
.stf-rule{display:flex;gap:6px;align-items:center;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--line);font-size:.88rem}
.stf-rep{white-space:pre-line;line-height:1.55;margin:0}
.stf-iss{margin:0;padding-left:18px}.stf-iss li{margin:2px 0}
.stf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:12px;align-items:start}
@media (max-width:900px){.stf-board{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width:460px){.stf-board{grid-template-columns:1fr}.stf-col{min-height:0}}
`;
let _o7 = false;
function ensureCss() {
if (_o7 || typeof document === 'undefined') return;
_o7 = true;
try { const _o1d = new CSSStyleSheet(); _o1d.replaceSync(_o0); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _o1d]; return; } catch { }
const s = document.createElement('style'); s.textContent = _o0; document.head.appendChild(s);
}
const _o2 = { busy: false, listeners: new Set() };
const _os = () => _o2.listeners.forEach(_og => { try { _og(); } catch { } });
const _oc = ctx => (ctx.config && ctx.config.ENGINE_URL) || ENGINE_URL;
async function _on(_o1) {
const [staffRaw, roomsRaw, jobs] = await Promise.all([_o1.setting('staff', null), _o1.setting('rooms', null), _o1.list('jobs')]);
return { staffList: S.normalizeStaff(staffRaw), rooms: S.normalizeRooms(roomsRaw), jobs };
}
const _o1a = (_o1, list) => _o1.setSetting('staff', list);
const _o19 = (_o1, rooms) => _o1.setSetting('rooms', rooms);
const _o1i = jobs => jobs.filter(S.isStaffTask).map(S.taskView);
async function _ox(_o1, title, extra) {
try {
await _o1.put('reminders', { object_id: '', kind: 'custom', title, due_at: Date.now(), remind_before_days: 0, amount: 0, installment: 0, done: 0, notified_at: 0,
data: JSON.stringify({ source: 'staff', ...extra }) });
} catch { }
}
async function _o4(_o1, out, staffList) {
const _o1b = await _o1.put('jobs', S.taskRow(out.update));
for (const c of out.create || []) await _o1.put('jobs', S.taskRow({ ...c, input: { ...c.input, parent_id: c.input.parent_id || _o1b.id } }));
if (out.render) {
const _om = await _o1.put('jobs', out.render);
const _ol = out.update.input.idea_id;
if (_ol) {
const idea = await _o1.get('ideas', _ol);
if (idea) await _o1.put('ideas', { ...idea, data: JSON.stringify({ ...parseData(idea.data), job_id: _om.id, staff_done: 1 }) });
}
}
for (const _ok of out.ideas || []) await _o1.put('ideas', _ok);
if (out.pair && staffList) {
const list = staffList.map(s => (s.id === out.pair.staff_id ? S.recordEdit(s, out.pair) : s));
await _o1a(_o1, list);
}
return _o1b;
}
const SEEN_KEY = 'bds:engine:seen';
function _od(ctx) {
try { if (typeof location !== 'undefined' && location.port === '8765') return true; } catch { }
try { return !!localStorage.getItem(SEEN_KEY); } catch { return false; }
}
async function _oe(ctx, { quiet = false } = {}) {
if (quiet && !_od(ctx)) return false;
try {
const r = await engineCall('/health', { base: _oc(ctx), timeout: 1500 });
const up = !!(r && r.app === 'bds-studio-engine');
try { if (up) localStorage.setItem(SEEN_KEY, String(Date.now())); } catch { }
return up;
} catch { return false; }
}
async function _of(ctx, t, eng, { confirmed = false } = {}) {
const errs = [];
if (t.input.where === 'mac' && eng.up) {
try {
const base = _oc(ctx);
await engineCall('/staff/run', { base, method: 'POST', body: { tasks: [S.toEngineTask(t)] }, timeout: 10000 });
for (let _ok = 0; _ok < 400; _ok++) {
const s = await engineCall('/staff/status', { base, timeout: 5000 });
if (s.state !== 'running') {
const r = (s.results || []).find(x => x.id === t.id);
if (r && r.ok) return r;
errs.push('Máy dựng: ' + ((r && r.error) || s.error || 'không có kết quả'));
break;
}
await new Promise(res => setTimeout(res, 1500));
}
} catch (e) { errs.push('Máy dựng: ' + (e && e.message)); }
}
if (!ctx.ai || typeof ctx.ai.run !== 'function') return { ok: false, error: [...errs, 'Chưa bật AI trong Cài đặt'].join('; ') };
try {
const r = await ctx.ai.run('staff', { prompt: t.input.prompt, json: !!t.input.json, provider: S.safeProvider(t.input.provider), feature: 'staff_run', confirmed });
if (r && /^handoff/.test(r.provider || '')) return { ok: false, error: 'Nhân viên tự động không dùng handoff' };
return { ok: true, text: (r && (r.text ?? r)) || '', provider: r && r.provider, cost_usd: Number(r && r.cost_usd) || 0, tokens_in: r && r.tokens_in, tokens_out: r && r.tokens_out };
} catch (e) { return { ok: false, cancelled: e && e.code === 'AI_CANCELLED', error: [...errs, (e && e.message) || 'AI không trả lời'].join('; ') }; }
}
export async function runPending(ctx, opts = {}) {
if (_o2.busy) return { skipped: true };
const _o1 = kit(ctx);
_o2.busy = true; _os();
let ran = 0;
try {
let { staffList, rooms, jobs } = await _on(_o1);
let room = rooms[0];
for (const t of _o1i(jobs).filter(S.inboxApproved)) {
await _o4(_o1, S.approveTask(t, { room, staffList }), staffList);
}
const eng = { up: await _oe(ctx, { quiet: !opts.manual }) };
for (let _oj = 0; _oj < 30; _oj++) {
jobs = await _o1.list('jobs');
const tasks = _o1i(jobs);
const _oi = S.budgetGuard(room, tasks);
if (_oi.switched) {
room = _oi.room; rooms = [room, ...rooms.slice(1)]; await _o19(_o1, rooms);
_o1.toast(room.paused_reason, 'warn');
await _ox(_o1, 'Phòng ' + room.name + ': ' + room.paused_reason, { room_id: room.id });
}
if (_oi.over && !opts.manual) break;
const _ow = tasks.filter(t => t.status === 'queued' && !S.inboxApproved(t)).sort((a, _o5) => (a.input.created_at || 0) - (_o5.input.created_at || 0));
if (!_ow.length) break;
const t = _ow[0];
if (_oi.over) t.input.mode = 'semi';
await _o1.put('jobs', S.taskRow({ ...t, status: 'running' })); _os();
const res = await _of(ctx, t, eng, { confirmed: !opts.manual });
if (res.cancelled) { await _o1.put('jobs', S.taskRow({ ...t, status: 'queued' })); _os(); break; }
await _o4(_o1, S.afterStep(t, res, { room, staffList: (await _on(_o1)).staffList }), null);
ran++; _os();
}
if (eng.up) await syncDrafts(ctx, { up: true });
} finally { _o2.busy = false; _os(); }
return { ran };
}
export async function syncDrafts(ctx, { up } = {}) {
const _o1 = kit(ctx);
if (!(up ?? await _oe(ctx, { quiet: true }))) return { skipped: true };
const base = _oc(ctx);
let got = 0, sent = 0;
const _op = async rows => {
const ids = [];
for (const r of rows || []) {
const _o8 = await _o1.get('jobs', r.id);
const next = S.applyDraft(_o8, r);
if (next) { await _o1.put('jobs', next); ids.push(r.id); }
else if (_o8) ids.push(r.id);
}
return ids;
};
try {
const res = await engineCall('/scenes/overnight', { base, timeout: 5000 });
const ids = await _op(res && res.rows);
got = ids.length;
if (ids.length) await engineCall('/scenes/overnight/ack', { base, method: 'POST', body: { ids }, timeout: 5000 });
const _o1n = (await _o1.list('jobs')).filter(S.wantsDraft).slice(0, 50);
if (_o1n.length) {
const r = await engineCall('/scenes/overnight', { base, method: 'POST', body: { jobs: _o1n.map(S.draftPayload) }, timeout: 20000 });
sent = (await _op(r && r.rows)).length;
}
} catch { return { skipped: true, got, sent }; }
return { got, sent };
}
export async function runRoom(ctx, { force = false } = {}) {
const _o1 = kit(ctx);
const { staffList, rooms, jobs } = await _on(_o1);
const room = rooms[0];
if (!force && !S.roomDue(room)) return { skipped: true };
const ideas = await _o1.list('ideas');
const _oh = S.planRoom({ room, staffList, ideas, tasks: _o1i(jobs) });
if (!force && !_oh.length && !_o1i(jobs).some(t => t.status === 'queued')) return { created: 0, ran: 0 };
for (const t of _oh) await _o1.put('jobs', S.taskRow(t));
await _o19(_o1, [{ ...room, last_run: S.runKey(room) }, ...rooms.slice(1)]);
const r = await runPending(ctx, { manual: force });
return { created: _oh.length, ...r };
}
export async function catchUp(ctx) {
try { return await runRoom(ctx, { force: false }); } catch { return { skipped: true }; }
}
export async function briefSection(ctx, { run = true } = {}) {
const _o1 = kit(ctx);
if (run) { catchUp(ctx); syncDrafts(ctx).catch(() => null); }
const _o11 = S.morningReport({ jobs: await _o1.list('jobs') });
return _o1.card({ title: '☀️ Báo cáo sáng – Phòng Sản xuất video', testid: 'staff-morning', body: h('div', null,
h('p', { class: 'stf-rep' }, _o11.text.split('\n').slice(1).join('\n')),
h('div', { class: 'bds-row bds-wrap' }, _o1.button('Mở Chờ duyệt', () => _o1.nav('#/inbox/inbox')), _o1.button('Nhân viên & Phòng', () => _o1.nav('#/content/staff'), { icon: 'user' }))) });
}
export async function mount(el, ctx) {
ensureCss();
const _o1 = kit(ctx);
el.innerHTML = '';
const _o6 = h('div', { 'data-testid': 'staff-board' });
const _o14 = h('div', { 'data-testid': 'staff-room' });
const _o1f = h('div', { class: 'stf-staff', 'data-testid': 'staff-list' });
const _o12 = h('div', { 'data-testid': 'staff-report' });
const _o17 = _o1.button('▶ Chạy phòng ngay', async () => {
const r = await runRoom(ctx, { force: true });
_o1.toast((r.created ? `Đã giao ${r.created} ý tưởng cho Biên kịch` : 'Không có ý tưởng đã duyệt mới') + (r.skipped ? ' · đang chạy cùng lượt trước' : r.ran ? ` · chạy ${r.ran} việc` : ''), 'success');
render();
}, { kind: 'primary', testid: 'staff-run', aiBadge: 'staff_run' });
let eng = null;
async function render() {
if (!el.isConnected && _oa) return;
_oa = true;
const { staffList, rooms, jobs } = await _on(_o1);
_oz(rooms[0], staffList, _o1i(jobs));
_oy(_o1i(jobs));
_o10(staffList);
const _o11 = S.morningReport({ jobs });
_o12.innerHTML = '';
_o12.appendChild(h('p', { class: 'stf-rep', 'data-testid': 'staff-report-text' }, _o11.text.split('\n').slice(1).join('\n')));
_o12.appendChild(h('div', { class: 'bds-row bds-wrap' }, _o1.button('Chép báo cáo', async () => { await _o1.copy(_o11.text); _o1.toast('Đã chép', 'success'); }),
h('small', { class: 'bds-muted' }, 'Hiện ở Bảng tin lúc mở app buổi sáng; gửi Telegram 7h khi máy chủ cập nhật.')));
_o17.disabled = _o2.busy;
_o17.textContent = _o2.busy ? '⏳ Đang chạy…' : '▶ Chạy phòng ngay';
}
let _oa = false;
function _o1c(options, value, onPick, testid) {
return h('div', { class: 'stf-seg', role: 'group', 'data-testid': testid }, Object.entries(options).map(([v, l]) =>
h('button', { type: 'button', 'aria-pressed': String(v === value), 'data-v': v, onclick: () => onPick(v) }, l)));
}
function _oz(room, staffList, tasks) {
const _o9 = new Date();
const _o1e = S.spentOn(tasks, room.id, _o9.getFullYear() + '-' + String(_o9.getMonth() + 1).padStart(2, '0') + '-' + String(_o9.getDate()).padStart(2, '0'));
const _o18 = async patch => { const { rooms } = await _on(_o1); await _o19(_o1, [{ ...rooms[0], ...patch }, ...rooms.slice(1)]); render(); };
const name = id => { const s = staffList.find(x => x.id === id); return s ? s.icon + ' ' + s.name : '🎬 Máy dựng nháp 480p'; };
_o14.innerHTML = '';
_o14.appendChild(h('div', { class: 'stf-flow', 'aria-label': 'Chuỗi việc của phòng' },
h('span', { class: 's' }, '🕘 ' + room.start + ' ý tưởng đã duyệt'),
room.steps.map(id => [h('span', { class: 'a', 'aria-hidden': 'true' }, '→'), h('span', { class: 's' }, name(id))]),
h('span', { class: 'a', 'aria-hidden': 'true' }, '→'), h('span', { class: 's' }, '📥 Sáng: Chờ duyệt')));
if (room.paused_reason && room.mode === 'semi') {
_o14.appendChild(h('div', { class: 'bds-note bds-warn', 'data-testid': 'room-paused' }, '⏸ ' + room.paused_reason + ' ',
_o1.button('Bật lại Tự động', () => _o18({ mode: 'auto', paused_reason: '' }), { testid: 'room-resume' })));
}
const start = h('input', { type: 'time', value: room.start, 'data-testid': 'room-start', onchange: e => _o18({ start: e.target.value || '21:00' }) });
const budget = h('input', { type: 'number', min: '0', step: '0.1', inputmode: 'decimal', value: String(room.budget_usd_day), 'data-testid': 'room-budget',
onchange: e => _o18({ budget_usd_day: Math.max(0, Number(String(e.target.value).replace(',', '.')) || 0) }) });
_o14.appendChild(h('div', { class: 'stf-grid' },
_o1.field('Giờ bắt đầu', start),
_o1.field('Ngân sách / ngày (USD)', budget, `Hôm nay đã dùng ${_o1e.toFixed(2)} USD · 0 = không giới hạn · Gemini miễn phí = 0 USD`),
h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, 'Chế độ phòng'),
_o1c(S.MODES, room.mode, v => _o18({ mode: v, paused_reason: v === 'auto' ? '' : room.paused_reason }), 'room-mode'),
h('small', { class: 'bds-field-h' }, room.mode === 'auto' ? 'Tự động: chạy hết chuỗi, chỉ dừng khi Kiểm duyệt thấy lỗi.' : 'Bán tự động: dừng sau mỗi bước chờ anh/chị duyệt.'))));
const _ob = h('p', { class: 'bds-muted', 'data-testid': 'room-engine' }, eng === null ? 'Đang kiểm tra máy dựng…' : eng
? '🟢 Mac (máy dựng) đang bật – việc đặt "Mac" chạy trên máy dựng (Ollama nhường RAM khi dựng video).'
: '⚪ Mac đang tắt – việc chạy bằng Gemini qua máy chủ khi mở app; tối qua chưa chạy thì app chạy bù lúc mở.');
_o14.appendChild(_ob);
_o14.appendChild(h('div', { class: 'bds-row bds-wrap' },
_o1.button('🌙 Cho Mac chạy qua đêm', overnight, { testid: 'room-overnight' }),
h('small', { class: 'bds-muted' }, 'Mac bật: máy dựng tự chạy lúc ' + room.start + ' bằng vé riêng (không cần mở app).')));
}
async function overnight() {
let _o1k = null;
try { _o1k = await _o1.api('engine.token', {}); } catch (e) {
_o1.toast(e && (e.code === 'NOT_FOUND' || e.code === 'BAD_INPUT') ? 'Máy chủ cần cập nhật (Cài đặt › Phiên bản). Tạm thời: mở app sau 21h, phòng tự chạy.' : ((e && e.message) || 'Chưa lấy được vé máy dựng'), 'warn');
return;
}
const url = (_o1k && (_o1k.url || _o1k.server_url)) || scriptUrl(ctx.config || {});
if (!_o1k || !_o1k.token || !url) { _o1.toast('Chờ máy chủ cập nhật (vé máy dựng)', 'warn'); return; }
if (!eng) { _o1.toast('Mở máy dựng trên Mac trước (bấm đúp "BDS Studio")', 'warn'); return; }
const { rooms } = await _on(_o1);
try {
await engineCall('/staff/run', { base: _oc(ctx), method: 'POST', body: { pull: true, server: { url, token: _o1k.token }, remember: true, start: rooms[0].start }, timeout: 10000 });
_o1.toast('Mac sẽ tự chạy phòng lúc ' + rooms[0].start + ' mỗi tối', 'success');
} catch (e) { _o1.toast((e && e.message) || 'Máy dựng chưa nhận', 'warn'); }
}
function _oy(tasks) {
const _o5 = S.board(tasks);
_o6.innerHTML = '';
const _o1g = id => (S.DEFAULT_STAFF.find(s => s.id === id) || {}).icon || '🤖';
const _o1o = ms => { if (!ms) return ''; const _o9 = new Date(Number(ms)); return String(_o9.getHours()).padStart(2, '0') + ':' + String(_o9.getMinutes()).padStart(2, '0') + ' ' + String(_o9.getDate()).padStart(2, '0') + '/' + String(_o9.getMonth() + 1).padStart(2, '0'); };
_o6.appendChild(h('div', { class: 'stf-board' }, S.BOARD.map(([k, label]) => h('div', { class: 'stf-col c-' + k, 'data-testid': 'col-' + k },
h('h4', null, h('span', null, label), h('span', null, String(_o5[k].length))),
_o5[k].length ? _o5[k].slice(0, 12).map(t => h('button', { type: 'button', class: 'stf-task', 'data-testid': 'task-' + t.id, onclick: () => _ov(t.id) },
h('span', null, _o1g(t.input.staff_id) + ' ' + (t.title || 'Việc')),
h('small', null, [S.PROVIDER_LABEL[t.output.provider] || t.output.provider || S.PROVIDER_LABEL[t.input.provider] || '', _o1o(t.output.finished_at || t.updated_at)].filter(Boolean).join(' · ')),
k === 'error' ? h('small', { class: 'why' }, '⚠ ' + (t.output.error || 'Không rõ lý do')) : null,
k === 'review' && t.output.issues && t.output.issues.length ? h('small', { class: 'why' }, t.output.issues.length + ' điểm cần sửa') : null))
: h('small', { class: 'bds-muted' }, k === 'doing' && _o2.busy ? 'Đang chạy…' : '—')))));
}
async function _ov(id) {
const { staffList, rooms } = await _on(_o1);
const _o15 = await _o1.get('jobs', id);
if (!_o15) return;
let t = S.taskView(_o15);
const staff = staffList.find(s => s.id === t.input.staff_id) || { name: 'Nhân viên', id: t.input.staff_id };
const body = h('div', { class: 'bds-form', 'data-testid': 'task-sheet' });
const _o1d = _o1.sheet({ title: (staff.icon || '') + ' ' + (t.title || 'Việc'), testid: 'task-pack', body, onClose: () => render() });
const _o1h = h('textarea', { rows: 12, 'data-testid': 'task-output' });
_o1h.value = t.output.final_text || t.output.text || '';
const issues = t.output.issues || [];
body.appendChild(h('div', { class: 'bds-row bds-wrap' }, _o1.badge({ queued: 'Đang chờ', running: 'Đang làm', waiting_approval: 'Chờ duyệt', done: 'Xong', error: 'Lỗi' }[t.status] || t.status,
t.status === 'error' ? 'danger' : t.status === 'waiting_approval' ? 'warn' : t.status === 'done' ? 'success' : 'info'),
t.output.provider ? _o1.badge(S.PROVIDER_LABEL[t.output.provider] || t.output.provider, 'muted') : null,
t.output.cost_usd ? _o1.badge(Number(t.output.cost_usd).toFixed(3) + ' USD', 'muted') : null));
if (t.output.error) body.appendChild(h('p', { class: 'bds-error' }, '⚠ ' + t.output.error));
if (issues.length) body.appendChild(h('div', { 'data-testid': 'task-issues' }, h('strong', null, 'Kiểm duyệt thấy:'),
h('ul', { class: 'stf-iss' }, issues.map(_ok => h('li', null, h('b', null, _ok.text || _ok.type), _ok.fix ? ' → ' + _ok.fix : '')))));
if (t.input.source_text && staff.id === 'reviewer') body.appendChild(h('details', null, h('summary', null, 'Kịch bản gốc'), h('pre', { class: 'bds-pre' }, t.input.source_text)));
body.appendChild(_o1.field(staff.id === 'reviewer' ? 'Bản cuối (sửa trực tiếp nếu cần)' : 'Kết quả (sửa trực tiếp – app học từ chỗ anh/chị sửa)', _o1h));
body.appendChild(h('details', null, h('summary', null, 'Lời nhắn đã gửi (đã lọc dữ liệu khách)'), h('pre', { class: 'bds-pre bds-scroll' }, t.input.prompt || '')));
const _o3 = h('div', { class: 'bds-row bds-wrap' });
if (t.status === 'waiting_approval' || S.inboxApproved(t)) {
_o3.appendChild(_o1.button('✅ Duyệt' + (staff.id === 'writer' ? ' → Kiểm duyệt' : staff.id === 'reviewer' ? ' → dựng nháp' : ''), async () => {
const out = S.approveTask(t, { editedText: _o1h.value, room: rooms[0], staffList });
await _o4(_o1, out, staffList);
_o1.toast(out.pair ? 'Đã duyệt + ghi nhớ chỗ anh/chị sửa' : 'Đã duyệt', 'success');
_o1d.close(); runPending(ctx).then(render);
}, { kind: 'primary', testid: 'task-approve' }));
_o3.appendChild(_o1.button('Không duyệt', async () => { await _o1.put('jobs', S.taskRow(S.rejectTask(t))); _o1d.close(); render(); }, { testid: 'task-reject' }));
}
if (t.status === 'error') _o3.appendChild(_o1.button('↻ Chạy lại', async () => {
await _o1.put('jobs', S.taskRow({ ...t, status: 'queued', output: {} })); _o1d.close(); runPending(ctx, { manual: true }).then(render);
}, { kind: 'primary', testid: 'task-retry' }));
if (t.status !== 'done' && ctx.ai && typeof ctx.ai.handoff === 'function') _o3.appendChild(_o1.button('Nhờ Claude (tự dán)', async () => {
const _o1l = await ctx.ai.handoff('staff', t.input.prompt || '', { target: 'claude' });
if (_o1l) { _o1h.value = _o1l; t = { ...t, status: 'waiting_approval', output: { ...t.output, text: _o1l, final_text: _o1l, provider: 'handoff_claude', error: '' } }; await _o1.put('jobs', S.taskRow(t)); _o1.toast('Đã dán kết quả Claude – xem lại rồi Duyệt', 'success'); }
}, { testid: 'task-handoff', title: 'Mở Claude với lời nhắn soạn sẵn – không tự động, không tốn gói' }));
body.appendChild(_o3);
}
function _o10(list) {
_o1f.innerHTML = '';
const _o1m = async (id, patch) => { const { staffList } = await _on(_o1); await _o1a(_o1, staffList.map(s => (s.id === id ? { ...s, ...patch } : s))); render(); };
for (const s of list) {
const prov = _o1.select(S.STAFF_PROVIDERS.map(p => [p, S.PROVIDER_LABEL[p]]), s.provider, { 'data-testid': 'prov-' + s.id, 'aria-label': 'AI dùng', onchange: e => _o1m(s.id, { provider: S.safeProvider(e.target.value) }) });
const prompt = h('textarea', { rows: 8, 'aria-label': 'Lời dặn cho ' + s.name, 'data-testid': 'prompt-' + s.id });
prompt.value = s.prompt;
const rules = h('div', { 'data-testid': 'rules-' + s.id },
(s.rules || []).map(r => h('div', { class: 'stf-rule' }, h('span', null, '✓ ' + r), _o1.button('Bỏ', async () => { const { staffList } = await _on(_o1); await _o1a(_o1, staffList.map(x => (x.id === s.id ? S.dropRule(x, r) : x))); render(); }))),
(s.pending_rules || []).map(r => h('div', { class: 'stf-rule', 'data-testid': 'pending-rule' }, h('span', null, '❓ ' + r), h('span', { class: 'bds-row' },
_o1.button('Duyệt', async () => { const { staffList } = await _on(_o1); await _o1a(_o1, staffList.map(x => (x.id === s.id ? S.approveRule(x, r) : x))); _o1.toast('Đã thêm vào lời dặn', 'success'); render(); }, { kind: 'primary', testid: 'rule-ok' }),
_o1.button('Bỏ', async () => { const { staffList } = await _on(_o1); await _o1a(_o1, staffList.map(x => (x.id === s.id ? S.dropRule(x, r) : x))); render(); })))));
const learn = _o1.button(`🧠 Rút quy tắc từ ${s.edits.length} lần sửa`, async () => {
if (!s.edits.length) { _o1.toast('Chưa có lần sửa nào – sửa kết quả rồi Duyệt để app học', 'info'); return; }
if (!ctx.ai || !ctx.ai.run) { _o1.toast('Chưa bật AI', 'warn'); return; }
learn.disabled = true;
try {
const r = await ctx.ai.run('staff', { prompt: S.rulePrompt(s), json: true, provider: S.safeProvider(s.provider), feature: 'staff_run' });
const _o16 = S.parseRules((r && (r.text ?? r)) || '');
if (!_o16.length) { _o1.toast('AI chưa rút được quy tắc – thử lại sau khi sửa thêm', 'info'); return; }
const { staffList } = await _on(_o1);
await _o1a(_o1, staffList.map(x => (x.id === s.id ? S.addPendingRules(x, _o16) : x)));
_o1.toast(`Có ${_o16.length} quy tắc chờ anh/chị duyệt`, 'success'); render();
} catch (e) { if (!_o1.isAiCancel(e)) _o1.toast((e && e.message) || 'AI chưa trả lời', 'warn'); } finally { learn.disabled = false; }
}, { testid: 'learn-' + s.id, aiBadge: 'staff_run' });
_o1f.appendChild(h('div', { class: 'stf-card', 'data-testid': 'staff-' + s.id },
h('h4', null, s.icon + ' ' + s.name), h('small', { class: 'bds-muted' }, s.role),
h('div', { class: 'bds-row bds-wrap' }, _o1c(S.MODES, s.mode, v => _o1m(s.id, { mode: v }), 'mode-' + s.id), _o1c({ mac: 'Mac', cloud: 'Đám mây' }, s.where, v => _o1m(s.id, { where: v }), 'where-' + s.id)),
_o1.field('AI dùng', prov, 'Không dùng Claude tự động. Cần Claude: mở việc → "Nhờ Claude".'),
h('details', null, h('summary', null, 'Lời dặn cho AI'), prompt,
h('div', { class: 'bds-row bds-end' }, _o1.button('Khôi phục mặc định', () => _o1m(s.id, { prompt: (S.DEFAULT_STAFF.find(_o9 => _o9.id === s.id) || s).prompt })),
_o1.button('Lưu lời dặn', () => _o1m(s.id, { prompt: prompt.value.trim() || s.prompt }), { kind: 'primary', testid: 'save-prompt-' + s.id }))),
h('small', { class: 'bds-muted' }, 'Quyền dữ liệu: ' + (s.id === 'writer' ? 'ý tưởng đã duyệt' : s.id === 'reviewer' ? 'kịch bản' : 'ý tưởng, tin, báo cáo thị trường') + ' – không đọc bảng khách.'),
(s.rules.length || s.pending_rules.length) ? rules : null,
h('div', { class: 'bds-row bds-wrap' }, learn,
s.id === 'researcher' ? _o1.button('🔎 Gom tin & gợi ý chủ đề', () => _o13(s), { kind: 'primary', testid: 'run-researcher', ai: 'staff_research' }) : null)));
}
}
async function _o13(s) {
const ideas = await _o1.list('ideas');
let market = '';
const jobs = await _o1.list('jobs');
const _or = jobs.filter(j => j.type === 'market_report' && j.status === 'done').sort((a, _o5) => (Number(_o5.updated_at) || 0) - (Number(a.updated_at) || 0))[0];
if (_or) { const _ot = parseData(_or.output); market = _ot.summary || _ot.text || ''; }
const _oq = (ctx.pack && (ctx.pack.modules || [])) || [];
if (!market && _oq.some(_oo => (_oo && _oo.id) === 'market' || _oo === 'market')) {
try { const _oo = await import('../market/index.js'); if (typeof _oo.marketSummary === 'function') market = String(await _oo.marketSummary(ctx) || ''); } catch { }
}
const _o9 = new Date();
const t = S.makeTask({ room: null, staff: s, payload: { ideas, market, today: _o9.toLocaleDateString('vi-VN'), title: 'Gom tin & gợi ý chủ đề' } });
t.title = s.name + ': gợi ý chủ đề ' + _o9.toLocaleDateString('vi-VN');
await _o1.put('jobs', S.taskRow(t));
render();
const r = await runPending(ctx, { manual: true });
_o1.toast(r.skipped ? 'Đang chạy một lượt khác – việc đã xếp hàng' : 'Nghiên cứu xong – chủ đề mới ở mục Ý tưởng (Chờ duyệt)', 'success');
render();
}
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'staff-screen' },
h('div', { class: 'bds-head' }, h('h2', null, 'Nhân viên & Phòng'), h('div', { class: 'bds-row' }, _o17)),
_o1.aiNote('staff_run'),
h('p', { class: 'bds-muted', 'data-testid': 'staff-ai-auto' }, 'Phòng chạy theo lịch anh/chị đã bật thì không hỏi lại từng việc; trần ngân sách của phòng và ngân sách AI tháng vẫn áp dụng. Bấm chạy tay thì app hỏi trước.'),
_o1.card({ title: '🎬 Phòng Sản xuất video', testid: 'room-card', body: _o14 }),
_o1.card({ title: 'Bảng tiến độ', testid: 'board-card', body: _o6 }),
_o1.card({ title: 'Nhân viên', testid: 'staff-card', body: _o1f }),
_o1.card({ title: '☀️ Báo cáo sáng (7h)', testid: 'report-card', body: _o12 }),
));
const _ou = () => { if (el.isConnected) render(); else _o2.listeners.delete(_ou); };
_o2.listeners.add(_ou);
await render();
_o1.on(el, ['jobs', 'settings', 'ideas'], render);
_oe(ctx).then(v => { eng = v; if (el.isConnected) render(); });
catchUp(ctx).then(() => { if (el.isConnected) render(); });
const _ow = ctx.route && ctx.route.query; const _o1j = _ow && _ow.get && _ow.get('task');
if (_o1j) _ov(_o1j);
}
export default {
manifest: {
id: 'staff', title: 'Nhân viên & Phòng', icon: '🧑‍💼', screen: 'content', order: 40, version: '1.0.0', status: 'ready', requires: 'video',
help: 'Nhân viên AI (Biên kịch, Kiểm duyệt, Nghiên cứu) chạy bằng Gemini miễn phí/Ollama; phòng Sản xuất video chạy qua đêm, sáng có video nháp ở Chờ duyệt. App học từ chỗ anh/chị sửa.',
},
mount,
async selftest(ctx) {
const details = [];
const s = ctx && ctx.store;
for (const _og of ['list', 'get', 'put']) if (!s || typeof s[_og] !== 'function') details.push('Thiếu store.' + _og);
try { if (S.normalizeStaff(null).length !== 3) details.push('Thiếu nhân viên mẫu'); } catch (e) { details.push(e.message); }
return { ok: !details.length, details: details.join('; ') || 'Đạt' };
},
};

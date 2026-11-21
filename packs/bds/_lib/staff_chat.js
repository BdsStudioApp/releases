import { redact, extractJson } from './staff.js';
import { fold } from './staff_skills.js';
import { gate } from './consent.js';
import { withRulesJson } from '../../../shared/ai_rules.js';
export const CHAT_KIND = 'staff_chat';
export const CHAT_LIMITS = {
maxSteps: 6, maxMsgs: 200, maxAgeDays: 30, textMax: 2000, partMax: 300, promptMax: 4000, valueMax: 45000,
runsPerDay: 20, runsPerDayMax: 200, chipsMax: 8, chipMax: 120, staleMs: 15 * 60000,
};
export const DEFAULT_CHIPS = ['Gom tin tuần này và gợi ý 3 chủ đề video', 'Soạn tin nhắc khách hẹn xem nhà chiều mai'];
export const CHAT_MODES = { ask: 'Hỏi trước', auto: 'Tự chạy' };
export const TASK_STATE = { queued: 'Đang chờ', running: 'Đang làm', waiting_approval: 'Chờ duyệt', done: 'Xong', error: 'Lỗi' };
export const RUN_STATE = { planned: 'Chờ anh/chị bấm Chạy', running: 'Đang chạy', done: 'Xong', error: 'Lỗi – đã dừng chuỗi', stopped: 'Đã dừng', cancelled: 'Đã huỷ' };
export const STEP_STATE = { wait: 'Chờ', running: 'Đang làm', done: 'Xong', error: 'Lỗi', skip: 'Bỏ qua', stopped: 'Đã dừng' };
export const STEP_FOOTER = 'Chỉ làm đúng phần được giao; không tự giao thêm việc cho ai, không gửi tin cho khách, không đăng bài – kết quả là bản nháp để Chủ duyệt.';
const DAY = 86400000;
const _ox = () => Math.random().toString(36).slice(2, 10).padEnd(8, '0');
export const newMsgId = () => 'sc_' + Date.now().toString(36) + _ox();
export const newRunId = () => 'run_' + Date.now().toString(36) + _ox();
const _o8 = s => String(s ?? '').normalize('NFC').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
const _oa = ms => { const d = new Date(Number(ms) || 0); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
const parse = v => { if (v && typeof v === 'object') return v; try { return JSON.parse(v || '{}') || {}; } catch { return {}; } };
export function checkRequest(t) {
const s = _o8(t).trim();
if (!s) return { ok: false, error: 'Gõ việc cần làm trước.' };
if (s.length > CHAT_LIMITS.textMax) return { ok: false, error: `Yêu cầu tối đa ${CHAT_LIMITS.textMax.toLocaleString('vi-VN')} ký tự (hiện ${s.length.toLocaleString('vi-VN')}) – tách thành nhiều tin.` };
return { ok: true, text: s };
}
const VIDEO_MEMBERS = ['researcher', 'writer', 'reviewer'];
export function roomMembers(_oy, staffList) {
if (!_oy) return [];
const ids = _oy.id === 'video' ? VIDEO_MEMBERS
: [...(Array.isArray(_oy.staff_ids) ? _oy.staff_ids : []), ...(Array.isArray(_oy.steps) ? _oy.steps : []).map(s => (typeof s === 'string' ? s : s && s.staff_id))];
const _os = [];
for (const id of ids) {
const s = (staffList || []).find(x => x && x.id === id);
if (s && s.enabled !== false && !_os.includes(s)) _os.push(s);
}
return _os;
}
const WORDS = {
research: ['gom tin', 'nghien cuu', 'chu de', 'tin tuc', 'tin moi', 'thi truong', 'quy hoach', 'ha tang', 'bao cao', 'tim hieu', 'xu huong', 'gia dat', 'chinh sach', 'lai suat'],
script: ['video', 'kich ban', 'caption', 'tiktok', 'reels', 'shorts', 'loi doc', 'content', 'bai dang', 'noi dung', 'viet bai'],
review: ['kiem duyet', 'soat', 'kiem tra', 'luat', 'tu cam', 'chinh ta', 'tong hop'],
cskh: ['tin nhan', 'soan tin', 'zalo', 'nhac', 'hoi tham', 'hen', 'cham soc', 'tra loi', 'khach', 'cam on', 'chuc mung'],
sales: ['tu van', 'bao gia', 'so sanh', 'can ho', 'thanh toan', 'gia ban', 'chot', 'goi y can'],
marketing: ['quang cao', 'ads', 'landing', 'chien dich', 'facebook', 'marketing', 'trang dich'],
};
const _o1 = { researcher: 'research', writer: 'script', reviewer: 'review' };
const _o0 = { content: 'script', cskh: 'cskh', sales: 'sales', market: 'research', marketing: 'marketing' };
const _o3 = new Set(['khach', 'nhung', 'trong', 'duoc', 'nguoi', 'thong', 'theo', 'tuong', 'duyet', 'dang', 'nhan', 'vien', 'chinh']);
const norm = s => ' ' + fold(s).replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
const has = (t, _oi) => t.includes(' ' + _oi + ' ');
const _o4 = /\b(kiem duyet|tong hop|bien tap|truong phong|soat)\b/;
export const isSummarizer = s => !!s && (s.id === 'reviewer' || _o4.test(norm((s.name || '') + ' ' + (s.role || ''))));
export function staffStage(s) {
if (isSummarizer(s)) return 2;
if (!s) return 1;
if (s.id === 'researcher' || s.field === 'market' || /\b(nghien cuu|gom tin)\b/.test(norm(s.role || ''))) return 0;
return 1;
}
function _oc(s) {
const g = new Set();
if (_o1[s.id]) g.add(_o1[s.id]);
if (_o0[s.field]) g.add(_o0[s.field]);
if (isSummarizer(s)) g.add('review');
return [...g];
}
export function scoreStaff(text, staff, lib = []) {
if (!staff) return 0;
const t = norm(text);
const tokens = new Set(t.trim().split(' '));
let sc = 0;
for (const g of _oc(staff)) for (const _oi of WORDS[g] || []) if (has(t, _oi)) sc += 2;
const _ol = norm(staff.name || '').trim();
if (_ol.length >= 3 && has(t, _ol)) sc += 5;
const _oz = (lib || []).filter(_of => _of && (staff.skills || []).includes(_of.id)).map(_of => _of.name || '').join(' ');
const _ot = new Set(norm((staff.role || '') + ' ' + _oz).trim().split(' ').filter(_o15 => _o15.length >= 5 && !_o3.has(_o15)));
for (const _o15 of _ot) if (tokens.has(_o15)) sc += 1;
return sc;
}
const _o2 = {
0: 'Tìm, gom thông tin cần cho yêu cầu (ghi nguồn, không bịa).',
2: 'Soát và hoàn thiện theo yêu cầu.',
sum: 'Tổng hợp kết quả các bước trước thành bản cuối gọn; soát lỗi luật quảng cáo, số liệu thiếu nguồn.',
};
const _ou = s => (staffStage(s) === 0 ? _o2[0] : staffStage(s) === 2 ? _o2[2] : ('Làm phần chính theo yêu cầu' + (s.role ? ' – đúng vai: ' + s.role : '') + '.').slice(0, CHAT_LIMITS.partMax));
function compose(doers, members, source) {
const _o10 = [...doers].sort((a, b) => staffStage(a.s) - staffStage(b.s) || b.sc - a.sc);
const _o14 = members.filter(isSummarizer).find(_oj => !_o10.some(d => d.s.id === _oj.id));
const _oy = CHAT_LIMITS.maxSteps - (_o14 ? 1 : 0);
const _ow = _o10.slice(0, _oy);
const steps = _ow.map((d, i) => ({ n: i + 1, staff_id: d.s.id, part: _ou(d.s), deps: [] }));
const _o13 = [...new Set(_ow.map(d => staffStage(d.s)))];
steps.forEach((_o12, i) => {
const _of = _o13.indexOf(staffStage(_ow[i].s));
if (_of > 0) _o12.deps = steps.filter((_, j) => staffStage(_ow[j].s) === _o13[_of - 1]).map(x => x.n);
});
if (_o14 && steps.length) steps.push({ n: steps.length + 1, staff_id: _o14.id, part: _o2.sum, deps: steps.map(x => x.n), summary: true });
return validatePlan({ steps, source }, members);
}
export function planByRules({ text, members = [], lib = [] } = {}) {
if (!members.length) return { ok: false, needPick: false, error: 'Phòng chưa có nhân viên đang bật.' };
const scored = members.map(s => ({ s, sc: scoreStaff(text, s, lib) })).filter(x => x.sc > 0);
if (!scored.length) return { ok: false, needPick: true, options: members.map(s => s.id), error: 'Chưa rõ ai hợp việc này – chọn người làm:' };
const _o6 = Math.max(...scored.map(x => x.sc));
let doers = scored.filter(x => x.sc >= Math.ceil(_o6 / 2));
const _om = doers.filter(x => !isSummarizer(x.s));
if (_om.length) doers = _om;
else doers = [doers.sort((a, b) => b.sc - a.sc)[0]];
const r = compose(doers, doers.length === 1 && isSummarizer(doers[0].s) ? members.filter(_oj => _oj.id === doers[0].s.id) : members, 'rules');
return r;
}
export function selectStaff(text, staffList = [], lib = []) {
const all = (staffList || []).filter(s => s && s.id);
if (!all.length) return { staff: null, matched: false, score: 0 };
const on = all.filter(s => s.enabled !== false);
let _o6 = null, bestSc = 0;
for (const s of [...on, ...all.filter(s => s.enabled === false)]) { const sc = scoreStaff(text, s, lib); if (sc > bestSc) { _o6 = s; bestSc = sc; } }
return _o6 ? { staff: _o6, matched: true, score: bestSc } : { staff: on[0] || all[0], matched: false, score: 0 };
}
export function planFromPick({ text, members = [], staffId } = {}) {
const s = members.find(_oj => _oj.id === staffId);
if (!s) return { ok: false, error: 'Người này không ở trong phòng (hoặc đang tắt).' };
return compose([{ s, sc: 1 }], isSummarizer(s) ? [s] : members, 'pick');
}
export function validatePlan(plan, members = []) {
const raw = plan && Array.isArray(plan.steps) ? plan.steps : null;
if (!raw || !raw.length) return { ok: false, error: 'Kế hoạch trống – cần ít nhất 1 bước.' };
if (raw.length > CHAT_LIMITS.maxSteps) return { ok: false, error: `Tối đa ${CHAT_LIMITS.maxSteps} bước mỗi yêu cầu (đang có ${raw.length}).` };
const _on = raw.map((s, i) => Number(s && s.n) || i + 1);
if (new Set(_on).size !== _on.length) return { ok: false, error: 'Số bước bị trùng.' };
const steps = [];
for (let i = 0; i < raw.length; i++) {
const s = raw[i] || {};
const _o12 = members.find(_oj => _oj.id === s.staff_id);
if (!_o12) return { ok: false, error: `${s.name || s.staff_id || 'Bước ' + _on[i]} không ở trong phòng (hoặc đang tắt).` };
const deps = [...new Set((Array.isArray(s.deps) ? s.deps : []).map(Number))];
for (const d of deps) {
if (d === _on[i]) return { ok: false, error: `Bước ${_on[i]} không thể chờ chính nó.` };
if (!_on.includes(d)) return { ok: false, error: `Bước ${_on[i]} chờ bước ${d} – bước này không có.` };
}
const part = _o8(s.part).replace(/\s+/g, ' ').trim().slice(0, CHAT_LIMITS.partMax) || 'Làm theo yêu cầu.';
steps.push({ n: _on[i], staff_id: _o12.id, name: _o12.name || '', icon: _o12.icon || '🤖', part, deps, ...(s.summary ? { summary: true } : {}) });
}
const _or = [], done = new Set();
while (_or.length < steps.length) {
const _oo = steps.find(s => !done.has(s.n) && s.deps.every(d => done.has(d)));
if (!_oo) return { ok: false, error: 'Kế hoạch có phụ thuộc vòng (các bước chờ lẫn nhau) – sửa lại thứ tự.' };
_or.push(_oo); done.add(_oo.n);
}
const map = new Map(_or.map((s, i) => [s.n, i + 1]));
return { ok: true, plan: { steps: _or.map(s => ({ ...s, n: map.get(s.n), deps: s.deps.map(d => map.get(d)).sort((a, b) => a - b) })), source: (plan && plan.source) || 'edit' } };
}
export function planPrompt({ text, members = [] } = {}) {
const list = members.map(s => `- id "${s.id}": ${s.name}${s.role ? ' – ' + s.role : ''}${isSummarizer(s) ? ' (soát/tổng hợp)' : ''}`).join('\n');
return withRulesJson(`Anh/chị là TRƯỞNG PHÒNG ảo. Chia yêu cầu của Chủ cho các nhân viên dưới đây.
NHÂN VIÊN TRONG PHÒNG:
${list}
YÊU CẦU: ${redact(_o8(text)).slice(0, CHAT_LIMITS.textMax)}
Quy tắc: tối đa ${CHAT_LIMITS.maxSteps} bước; chỉ dùng nhân viên có trong danh sách; ai không hợp thì bỏ; bước cần kết quả bước khác thì ghi "after"; không vòng; không thêm việc ngoài yêu cầu; nếu có người soát/tổng hợp thì để làm bước cuối ("summary": true).
Chỉ trả về JSON đúng mẫu: {"steps":[{"staff":"<id>","part":"phần việc ngắn","after":[số bước trước]}]}`);
}
export function parsePlanReply(text, members = []) {
const j = extractJson(text);
const _o5 = j && (Array.isArray(j) ? j : Array.isArray(j.steps) ? j.steps : null);
if (!_o5 || !_o5.length) return { ok: false, error: 'AI chưa trả kế hoạch đúng mẫu.' };
const steps = [];
for (let i = 0; i < _o5.length; i++) {
const x = _o5[i] || {};
const _oh = String(x.staff ?? x.staff_id ?? x.who ?? '').trim();
const _o12 = members.find(_oj => _oj.id === _oh) || members.find(_oj => fold(_oj.name || '') === fold(_oh));
if (!_o12) return { ok: false, error: `AI giao cho "${_oh || '?'}" – không có trong phòng.` };
steps.push({ n: i + 1, staff_id: _o12.id, part: String(x.part ?? x.task ?? ''), deps: x.after ?? x.deps ?? x.depends_on ?? [], summary: !!x.summary });
}
return validatePlan({ steps, source: 'ai' }, members);
}
const cloneRun = (r, now) => ({ ...r, steps: r.steps.map(s => ({ ...s })), updated_at: now });
export function newRun(plan, mode = 'ask', now = Date.now()) {
return { id: newRunId(), status: mode === 'auto' ? 'running' : 'planned', mode: mode === 'auto' ? 'auto' : 'ask', source: (plan && plan.source) || '',
steps: ((plan && plan.steps) || []).map(s => ({ ...s, state: 'wait', task_id: '', error: '' })), error: '', created_at: now, updated_at: now };
}
export const startRun = (r, now = Date.now()) => (r && r.status === 'planned' ? { ...cloneRun(r, now), status: 'running' } : r);
export function nextRunnable(run) {
if (!run || run.status !== 'running') return -1;
if (run.steps.some(s => s.state === 'error' || s.state === 'stopped' || s.state === 'running')) return -1;
const done = new Set(run.steps.filter(s => s.state === 'done').map(s => s.n));
return run.steps.findIndex(s => s.state === 'wait' && (s.deps || []).every(d => done.has(d)));
}
export function startStep(run, i, taskId, now = Date.now()) {
const r = cloneRun(run, now);
r.steps[i] = { ...r.steps[i], state: 'running', task_id: String(taskId || ''), started_at: now };
return r;
}
export function finishStep(run, i, { ok, error } = {}, now = Date.now()) {
const r = cloneRun(run, now);
const s = r.steps[i];
if (ok) {
r.steps[i] = { ...s, state: 'done', error: '' };
if (r.steps.every(x => x.state === 'done')) r.status = 'done';
return r;
}
const _o16 = String(error || 'không rõ lý do').slice(0, 300);
r.steps[i] = { ...s, state: 'error', error: _o16 };
r.steps = r.steps.map(x => (x.state === 'wait' ? { ...x, state: 'skip' } : x));
r.status = 'error';
r.error = `Bước ${s.n}${s.name ? ' (' + s.name + ')' : ''} lỗi: ${_o16} – đã dừng chuỗi, các bước sau không chạy.`;
return r;
}
export function stopRun(run, now = Date.now()) {
const r = cloneRun(run, now);
r.status = 'stopped';
r.steps = r.steps.map(x => (x.state === 'running' ? { ...x, state: 'stopped' } : x.state === 'wait' ? { ...x, state: 'skip' } : x));
return r;
}
export function cancelRun(run, now = Date.now()) {
const r = cloneRun(run, now);
r.status = 'cancelled';
r.steps = r.steps.map(x => (x.state === 'wait' ? { ...x, state: 'skip' } : x));
return r;
}
export const isActive = (run, now = Date.now()) => !!run && run.status === 'running' && now - (Number(run.updated_at) || 0) < CHAT_LIMITS.staleMs;
export const threadBusy = (msgs, now = Date.now()) => (msgs || []).some(_oj => _oj && _oj.role === 'plan' && isActive(_oj.run, now));
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function scrubForStaff(text, staff, customers = []) {
let s = redact(_o8(text));
const _oq = staff && staff.data_access === true;
const _ok = [...new Set((customers || []).filter(c => c && !Number(c.deleted) && (!c.kind || c.kind === 'customer') && (!_oq || !gate(c, 'ai').ok))
.map(c => _o8(c.name).replace(/\s+/g, ' ').trim()).filter(n => n.length >= 3))].sort((a, b) => b.length - a.length);
for (const n of _ok) s = s.replace(new RegExp(esc(n), 'gi'), '[khách]');
return s;
}
export function buildStepText({ request, run, index, results = {}, staff, customers = [] } = {}) {
const _o12 = run.steps[index];
const N = run.steps.length;
const _od = [`YÊU CẦU CỦA CHỦ: ${_o8(request).trim().slice(0, 1500)}`, `PHẦN VIỆC CỦA BẠN (bước ${_o12.n}/${N}): ${_o12.part}`].join('\n');
const deps = _o12.deps || [];
const _oy = CHAT_LIMITS.promptMax - _od.length - STEP_FOOTER.length - 8;
const _ov = deps.length ? Math.max(200, Math.floor(_oy / deps.length)) : 0;
const blocks = deps.map(d => {
const r = results[d] || {};
const _o11 = run.steps.find(x => x.n === d) || {};
const title = `KẾT QUẢ BƯỚC ${d}${_o11.name ? ' (' + _o11.name + ')' : ''}:\n`;
return title + scrubForStaff(String(r.text || '(trống)'), staff, customers).trim().slice(0, Math.max(0, _ov - title.length - 2));
});
return [_od, ...blocks, STEP_FOOTER].join('\n\n').slice(0, CHAT_LIMITS.promptMax);
}
export function makeMsg({ thread_id, role, text = '', staff_id = '', task_id = '', run = null, request = '', options, summary, step_n, now = Date.now() } = {}) {
const _oj = { id: newMsgId(), thread_id: String(thread_id || ''), role: role || 'system', at: now };
if (role !== 'staff' && text) _oj.text = redact(_o8(text)).slice(0, CHAT_LIMITS.valueMax);
if (staff_id) _oj.staff_id = String(staff_id);
if (task_id) _oj.task_id = String(task_id);
if (run) _oj.run = run;
if (request) _oj.request = redact(_o8(request)).slice(0, CHAT_LIMITS.textMax);
if (Array.isArray(options)) _oj.options = options.slice(0, 20).map(String);
if (summary) _oj.summary = true;
if (step_n) _oj.step_n = Number(step_n);
return _oj;
}
export function msgToObject(msg, now = Date.now()) {
const { id, ...rest } = msg;
let data = JSON.stringify(rest);
if (data.length > CHAT_LIMITS.valueMax && rest.text) {
rest.text = rest.text.slice(0, Math.max(0, rest.text.length - (data.length - CHAT_LIMITS.valueMax) - 64));
data = JSON.stringify(rest);
}
return { id, kind: CHAT_KIND, name: rest.thread_id, note: rest.role, status: rest.run ? rest.run.status : '', source: CHAT_KIND, consent: 0, data, updated_at: now, deleted: 0 };
}
export function objectToMsg(row) {
if (!row || row.kind !== CHAT_KIND || Number(row.deleted)) return null;
const d = parse(row.data);
return { ...d, id: row.id, thread_id: d.thread_id || row.name || '', role: d.role || row.note || 'system', at: Number(d.at) || Number(row.updated_at) || 0 };
}
export const threadMsgs = (rows, threadId) => (rows || []).map(objectToMsg).filter(_oj => _oj && _oj.thread_id === threadId)
.sort((a, b) => a.at - b.at || String(a.id).localeCompare(String(b.id)));
export function pruneThread(msgs, now = Date.now()) {
const _og = _oj => _oj.role === 'plan' && isActive(_oj.run, now);
const _o10 = [...(msgs || [])].sort((a, b) => (Number(a.at) || 0) - (Number(b.at) || 0));
const drop = [], keep = [];
for (const _oj of _o10) (!_og(_oj) && now - (Number(_oj.at) || 0) > CHAT_LIMITS.maxAgeDays * DAY ? drop : keep).push(_oj);
let _ob = keep.length - CHAT_LIMITS.maxMsgs;
for (let i = 0; _ob > 0 && i < keep.length; i++) if (!_og(keep[i])) { drop.push(keep[i]); keep.splice(i, 1); i--; _ob--; }
return { keep, drop: drop.sort((a, b) => (Number(a.at) || 0) - (Number(b.at) || 0)) };
}
export function normalizeChatSettings(raw) {
const r = raw && typeof raw === 'object' ? raw : {};
const chips = Array.isArray(r.chips)
? r.chips.map(x => _o8(x).replace(/\s+/g, ' ').trim().slice(0, CHAT_LIMITS.chipMax)).filter(Boolean).slice(0, CHAT_LIMITS.chipsMax)
: [...DEFAULT_CHIPS];
const threads = {};
if (r.threads && typeof r.threads === 'object') for (const [_of, v] of Object.entries(r.threads)) if (/^[A-Za-z0-9_-]{1,64}$/.test(_of)) threads[_of] = _o7(v);
return { chips, threads };
}
function _o7(v) {
const _op = v && typeof v === 'object' ? v : {};
const n = Math.round(Number(_op.runs_per_day));
return { mode: CHAT_MODES[_op.mode] ? _op.mode : 'ask', runs_per_day: Number.isFinite(n) && _op.runs_per_day !== undefined && _op.runs_per_day !== null && _op.runs_per_day !== ''
? Math.min(CHAT_LIMITS.runsPerDayMax, Math.max(1, n)) : CHAT_LIMITS.runsPerDay, ai_split: _op.ai_split === true };
}
export const threadCfg = (cfg, id) => _o7(cfg && cfg.threads && cfg.threads[id]);
export function setThreadCfg(cfg, id, patch = {}) {
const c = normalizeChatSettings(cfg);
return { ...c, threads: { ...c.threads, [id]: _o7({ ...threadCfg(c, id), ...patch }) } };
}
export function runsToday(tasks, threadId, now = Date.now()) {
const _o9 = _oa(now);
let n = 0;
for (const j of tasks || []) {
if (!j || j.type !== 'staff_task' || Number(j.deleted)) continue;
const _oe = parse(j.input);
if (_oe.chat && _oe.chat_thread === threadId && _oa(_oe.created_at) === _o9) n++;
}
return n;
}
export function quotaCheck({ used = 0, cap = CHAT_LIMITS.runsPerDay, need = 1 } = {}) {
if (used + need <= cap) return { ok: true, left: cap - used };
return { ok: false, left: Math.max(0, cap - used), error: `Hôm nay đã chạy ${used}/${cap} lượt – yêu cầu này cần ${need}. Mai chạy tiếp hoặc tăng "Lượt/ngày".` };
}
export function displayText(text) {
const s = String(text ?? '');
if (!/^\s*(```|\{)/.test(s)) return s;
const j = extractJson(s);
if (!j || typeof j !== 'object' || Array.isArray(j) || (typeof j.fixed_text !== 'string' && !Array.isArray(j.issues))) return s;
const issues = (j.issues || []).filter(x => x && (x.text || x.fix)).map(x => '• ' + (x.text || '') + (x.fix ? ' → ' + x.fix : ''));
return [j.fixed_text || '', issues.length ? 'Điểm cần sửa:\n' + issues.join('\n') : ''].filter(Boolean).join('\n\n') || s;
}

import { findForbidden, parseIdeas } from './video.js';
export const STAFF_PROVIDERS = ['gemini', 'ollama'];
export const PROVIDER_LABEL = { gemini: 'Gemini (miễn phí)', ollama: 'Ollama (trên máy)' };
export const MODES = { auto: 'Tự động', semi: 'Bán tự động' };
export const WHERE = { mac: 'Mac (máy dựng)', cloud: 'Đám mây (Apps Script + Gemini)' };
export const safeProvider = p => (STAFF_PROVIDERS.includes(p) ? p : 'gemini');
export const PRIVATE_TABLES = ['objects', 'events', 'reminders', 'quotes', 'users', 'devices', 'audit'];
export const SCOPES = { writer: ['ideas'], reviewer: ['scripts'], researcher: ['ideas', 'news', 'market'] };
const _o8 = `Anh/chị là BIÊN KỊCH video ngắn bất động sản (TikTok/Reels/Shorts dọc 9:16, 30–60 giây) cho kênh môi giới BĐS.
Viết từ Ý TƯỞNG ĐÃ DUYỆT bên dưới:
1) HOOK 3 giây đầu (câu hỏi hoặc con số gây tò mò, không giật tít).
2) 5–8 CẢNH: mỗi cảnh ghi [Hình] (bản đồ/flycam/ảnh dự án) và [Lời đọc] ≤ 25 chữ, giọng miền Bắc, câu ngắn.
3) KẾT: kêu gọi "nhắn em để nhận bảng giá" (không ép mua).
4) CHÚ THÍCH đăng bài ≤ 300 ký tự + 3 hashtag không dấu.
5) NGUỒN: liệt kê nguồn cho MỌI con số (giá, khoảng cách, tiến độ).
Bắt buộc: không hứa lợi nhuận, không "x2 tài sản", không "chắc chắn tăng giá"; hạ tầng chưa xong ghi "dự kiến"; không bịa số liệu – thiếu nguồn thì ghi "(cần kiểm chứng)".`;
const _o6 = `Anh/chị là KIỂM DUYỆT nội dung quảng cáo bất động sản theo Luật Kinh doanh BĐS 2023, Luật Quảng cáo 2012 (sửa đổi 2025) và quy tắc cộng đồng TikTok/Meta/YouTube.
Soát KỊCH BẢN bên dưới:
- Hứa lợi nhuận, cam kết tăng giá, so sánh "tốt nhất/số 1" không có căn cứ → sai.
- Mọi con số (giá, %, km, phút, năm) phải có nguồn; thiếu → ghi rõ.
- Hạ tầng/dự án chưa hoàn thành phải ghi "dự kiến", không được viết như đã xong.
- Chính tả tiếng Việt, từ cấm, giật tít.
Trả về JSON đúng mẫu: {"pass": true|false, "issues": [{"type": "luat|so_lieu|du_kien|chinh_ta|tu_cam", "text": "đoạn sai", "fix": "cách sửa"}], "fixed_text": "bản đã sửa (nếu có sửa)"}`;
const _o5 = `Anh/chị là NGHIÊN CỨU thị trường BĐS (khu vực của kênh) cho kênh video ngắn.
Gom tin mới (quy hoạch, hạ tầng, giá, chính sách, lãi suất) và gợi ý 5 chủ đề video người xem quan tâm, KHÁC các chủ đề đã có.
Mỗi chủ đề phải có nguồn (link báo chính thống/ cổng thông tin nhà nước). Không bịa link.
Trả về JSON: [{"title": "...", "summary": "vì sao người xem quan tâm", "url": "link nguồn", "source": "tên báo", "kind": "map|flow|news", "score": 0-100}]`;
export const DEFAULT_STAFF = [
{ id: 'writer', name: 'Biên kịch', icon: '✍️', role: 'Viết kịch bản + lời đọc từ ý tưởng đã duyệt', prompt: _o8 },
{ id: 'reviewer', name: 'Kiểm duyệt', icon: '🛡️', role: 'Soát luật quảng cáo BĐS, số liệu có nguồn, "dự kiến" vs "đã", chính tả, từ cấm', prompt: _o6 },
{ id: 'researcher', name: 'Nghiên cứu', icon: '🔎', role: 'Gom tin, gợi ý chủ đề (dùng báo cáo thị trường nếu có)', prompt: _o5 },
].map(s => ({ ...s, provider: 'gemini', mode: 'auto', where: 'mac', rules: [], pending_rules: [], edits: [], scope: SCOPES[s.id] }));
export const DEFAULT_ROOM = {
id: 'video', name: 'Sản xuất video', icon: '🎬', start: '21:00', report_at: '07:00',
steps: ['writer', 'reviewer', 'render'], budget_usd_day: 0.5, mode: 'auto', max_per_run: 3, paused_reason: '', last_run: '',
};
export function normalizeStaff(saved) {
const arr = Array.isArray(saved) ? saved : (saved && Array.isArray(saved.staff) ? saved.staff : []);
const _or = DEFAULT_STAFF.map(d => {
const s = arr.find(x => x && x.id === d.id) || {};
return { ...d, ...s, provider: safeProvider(s.provider || d.provider), mode: MODES[s.mode] ? s.mode : d.mode, where: WHERE[s.where] ? s.where : d.where,
rules: Array.isArray(s.rules) ? s.rules : [], pending_rules: Array.isArray(s.pending_rules) ? s.pending_rules : [], edits: Array.isArray(s.edits) ? s.edits : [], scope: SCOPES[d.id] };
});
for (const s of arr) if (s && s.id && !_or.some(o => o.id === s.id)) _or.push({ ...s, provider: safeProvider(s.provider), scope: ['ideas'], rules: s.rules || [], pending_rules: s.pending_rules || [], edits: s.edits || [] });
return _or;
}
export function normalizeRooms(saved) {
const arr = Array.isArray(saved) ? saved : [];
const r = arr.find(x => x && x.id === DEFAULT_ROOM.id) || {};
const room = { ...DEFAULT_ROOM, ...r, mode: MODES[r.mode] ? r.mode : DEFAULT_ROOM.mode, budget_usd_day: Number.isFinite(Number(r.budget_usd_day)) ? Number(r.budget_usd_day) : DEFAULT_ROOM.budget_usd_day };
return [room, ...arr.filter(x => x && x.id && x.id !== DEFAULT_ROOM.id)];
}
const _o3 = /(\+?84|0)(\s?[.-]?\d){8,10}\b/g;
const _o0 = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
export const redact = s => String(s ?? '').replace(_o0, '[email ẩn]').replace(_o3, '[sđt ẩn]');
const _o1 = ['title', 'summary', 'url', 'source', 'score'];
export function scrubIdea(_oh) {
const o = {};
for (const _ok of _o1) if (_oh && _oh[_ok] !== undefined && _oh[_ok] !== '') o[_ok] = typeof _oh[_ok] === 'string' ? redact(_oh[_ok]).slice(0, 2000) : _oh[_ok];
return o;
}
export function scopedData(staff, data = {}) {
const scope = (staff && staff.scope) || SCOPES[staff && staff.id] || [];
const _or = {};
for (const _ok of Object.keys(data)) {
if (PRIVATE_TABLES.includes(_ok) || !scope.includes(_ok)) continue;
_or[_ok] = _ok === 'ideas' ? (data[_ok] || []).map(scrubIdea) : _ok === 'scripts' ? redact(data[_ok]) : data[_ok];
}
return _or;
}
export function systemOf(staff) {
const rules = (staff.rules || []).filter(Boolean);
return String(staff.prompt || '').trim() + (rules.length ? '\n\nQUY TẮC ANH ĐÃ DUYỆT (bắt buộc theo):\n' + rules.map((r, _oh) => `${_oh + 1}. ${r}`).join('\n') : '');
}
export function buildPrompt(staff, payload = {}) {
const d = scopedData(staff, payload);
const _os = [systemOf(staff), '---'];
if (staff.id === 'writer') {
const _oh = (d.ideas || [])[0] || {};
_os.push('Ý TƯỞNG ĐÃ DUYỆT:', 'Tiêu đề: ' + (_oh.title || ''), _oh.summary ? 'Ghi chú: ' + _oh.summary : '', _oh.url ? 'Nguồn: ' + _oh.url : '');
} else if (staff.id === 'reviewer') {
_os.push('KỊCH BẢN CẦN SOÁT:', d.scripts || '');
} else if (staff.id === 'researcher') {
_os.push('Hôm nay: ' + (payload.today || ''), 'CHỦ ĐỀ ĐÃ CÓ (đừng lặp): ' + ((d.ideas || []).map(_oh => _oh.title).join('; ') || 'chưa có'));
if (d.market) _os.push('BÁO CÁO THỊ TRƯỜNG GẦN NHẤT:', redact(String(d.market)).slice(0, 4000));
if (d.news && d.news.length) _os.push('TIN MỚI:', d.news.slice(0, 15).map(_op => '- ' + _op.title + (_op.link ? ' (' + _op.link + ')' : '')).join('\n'));
} else {
_os.push(JSON.stringify(d).slice(0, 6000));
}
return _os.filter(x => x !== '').join('\n');
}
export const wantsJson = staff => staff && (staff.id === 'reviewer' || staff.id === 'researcher');
const _o4 = [/cam kết (lợi nhuận|lãi|tăng giá|sinh lời)/i, /lợi nhuận\s*\d+\s*%/i, /chắc chắn (lãi|lời|tăng)/i, /bảo đảm (lợi nhuận|tăng giá)/i, /không lo lỗ/i, /(tốt|rẻ) nhất (thị trường|hà nội)/i];
const _o2 = /(hoàn thành|thông xe|khánh thành|vận hành|đưa vào sử dụng|đi vào hoạt động|khởi công)/i;
const _o7 = { 'xây xựng': 'xây dựng', 'sử lý': 'xử lý', 'chuẩn đoán': 'chẩn đoán', 'vô hình chung': 'vô hình trung', 'sát nhập': 'sáp nhập', 'giành dụm': 'dành dụm', 'tham quang': 'tham quan', 'cở sở': 'cơ sở' };
export function localReview(text) {
const t = String(text || '').normalize('NFC');
const _on = t.toLowerCase();
const issues = [];
for (const _oz of findForbidden(t)) issues.push({ type: 'tu_cam', text: _oz, fix: 'Bỏ cụm "' + _oz + '"' });
for (const r of _o4) { const _oo = t.match(r); if (_oo) issues.push({ type: 'luat', text: _oo[0], fix: 'Không hứa lợi nhuận/cam kết – Luật Kinh doanh BĐS 2023, Luật Quảng cáo' }); }
for (const s of t.split(/(?<=[.!?\n])/)) {
if (_o2.test(s) && /(20[2-4]\d|năm tới|sắp)/i.test(s) && !/dự kiến|kế hoạch|theo quy hoạch|đề xuất|đã\s+(hoàn thành|thông xe|khánh thành|khởi công)/i.test(s)) {
issues.push({ type: 'du_kien', text: s.trim().slice(0, 120), fix: 'Thêm "dự kiến" (chưa hoàn thành thì không viết như đã xong)' });
}
}
const _of = /\d+([.,]\d+)?\s*(tỷ|triệu|%|km|phút|m2|m²|ha)/i.test(t);
if (_of && !/nguồn|theo\s+(quyết định|báo|sở|bộ|ubnd|thông báo)/i.test(_on)) issues.push({ type: 'so_lieu', text: 'Có số liệu nhưng không ghi nguồn', fix: 'Thêm dòng "Nguồn: …" cho mọi con số' });
for (const [bad, good] of Object.entries(_o7)) if (_on.includes(bad)) issues.push({ type: 'chinh_ta', text: bad, fix: good });
return issues;
}
export function extractJson(text) {
const s = String(text ?? '').replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '');
try { return JSON.parse(s); } catch { }
const _oo = s.match(/[[{][\s\S]*[\]}]/);
if (_oo) { try { return JSON.parse(_oo[0]); } catch { } }
return null;
}
export function parseReview(aiText, scriptText) {
const j = extractJson(aiText);
const aiIssues = j && Array.isArray(j.issues) ? j.issues.filter(x => x && (x.text || x.fix)).map(x => ({ type: String(x.type || 'khac'), text: String(x.text || ''), fix: String(x.fix || '') })) : [];
const loc = localReview(scriptText);
const _o9 = j && typeof j.pass === 'boolean' ? j.pass : null;
const issues = [...loc, ...aiIssues.filter(a => !loc.some(l => l.text && l.text === a.text))];
const pass = _o9 === false ? false : !issues.length;
const _oe = j && typeof j.fixed_text === 'string' && j.fixed_text.trim() ? j.fixed_text.trim() : '';
return { pass, issues, fixed_text: _oe, ai_format_ok: _o9 !== null };
}
export function parse(s) { if (s && typeof s === 'object') return s; try { return JSON.parse(s || '{}') || {}; } catch { return {}; } }
export function taskView(row) { return { ...row, input: parse(row.input), output: parse(row.output) }; }
export function taskRow(v) {
const o = {};
for (const _ok of ['id', 'title', 'status', 'cost_estimate', 'deleted']) if (v[_ok] !== undefined) o[_ok] = v[_ok];
return { ...o, type: v.type || 'staff_task', input: JSON.stringify(v.input || {}), output: JSON.stringify(v.output || {}) };
}
export const isStaffTask = j => j && j.type === 'staff_task' && !Number(j.deleted);
const modeOf = (room, staff) => (room && room.mode === 'semi') || (staff && staff.mode === 'semi') ? 'semi' : 'auto';
export function chainAfter(room, staffList, staffId) {
const steps = (room && room.steps) || [];
const _oh = steps.indexOf(staffId);
if (_oh < 0 || !staffList) return [];
return steps.slice(_oh + 1).map(id => {
if (id === 'render') return { staff_id: 'render' };
const _ov = staffList.find(x => x.id === id);
return _ov ? { staff_id: _ov.id, name: _ov.name, prefix: buildPrompt(_ov, {}), json: wantsJson(_ov), provider: safeProvider(_ov.provider), mode: modeOf(room, _ov) } : null;
}).filter(Boolean);
}
export function makeTask({ room, staff, idea, step, payload, parent, staffList, now = Date.now() }) {
const s = staff;
return {
type: 'staff_task', title: `${s.name}: ${(idea && idea.title) || (payload && payload.title) || s.role}`.slice(0, 140), status: 'queued', cost_estimate: 0,
input: { room_id: room ? room.id : '', staff_id: s.id, idea_id: idea ? idea.id : (parent && parent.input.idea_id) || '', step: step || s.id,
prompt: buildPrompt(s, payload || {}), json: wantsJson(s), provider: safeProvider(s.provider), mode: modeOf(room, s), where: s.where,
parent_id: parent ? parent.id : '', created_at: now, chain: chainAfter(room, staffList, s.id), budget_usd_day: room ? Number(room.budget_usd_day) || 0 : 0 },
output: {},
};
}
export function runKey(room, now = Date.now()) {
const d = new Date(now);
const [hh, mm] = String((room && room.start) || '21:00').split(':').map(Number);
const start = new Date(d); start.setHours(hh || 0, mm || 0, 0, 0);
if (d < start) start.setDate(start.getDate() - 1);
return start.getFullYear() + '-' + String(start.getMonth() + 1).padStart(2, '0') + '-' + String(start.getDate()).padStart(2, '0');
}
export const roomDue = (room, now = Date.now()) => !!room && room.last_run !== runKey(room, now);
export function planRoom({ room, staffList, ideas = [], tasks = [], now = Date.now() }) {
const writer = staffList.find(s => s.id === (room.steps || [])[0]) || staffList.find(s => s.id === 'writer');
if (!writer) return [];
const has = new Set(tasks.filter(t => isStaffTask(t)).map(t => (t.input || parse(t.input)).idea_id).filter(Boolean));
return ideas.filter(_oh => !Number(_oh.deleted) && _oh.status === 'approved' && !has.has(_oh.id) && !parse(_oh.data).job_id && !parse(_oh.data).staff_done)
.sort((a, _oa) => (Number(_oa.score) || 0) - (Number(a.score) || 0))
.slice(0, Number(room.max_per_run) || 3)
.map(_oh => makeTask({ room, staff: writer, idea: _oh, payload: { ideas: [_oh] }, staffList, now }));
}
export const inboxApproved = t => t.status === 'queued' && !!(t.output && (t.output.text || t.output.final_text)) && !t.output.error;
function _ot(task, text, now) {
return {
type: 'video_map', title: 'Nháp: ' + String(task.title || '').replace(/^[^:]+:\s*/, ''), status: 'waiting_approval', cost_estimate: 0,
input: JSON.stringify({ idea_id: task.input.idea_id, title: String(task.title || '').replace(/^[^:]+:\s*/, ''), script: text, from_staff: true, staff_task_id: task.id, draft: '480p', mode: 'stills', created_at: now }),
output: '',
};
}
function _oq(task, text, { room, staffList, now }) {
const steps = (room && room.steps) || DEFAULT_ROOM.steps;
const _oh = steps.indexOf(task.input.step || task.input.staff_id);
const next = _oh >= 0 ? steps[_oh + 1] : null;
if (!next) return { create: [], render: null };
if (next === 'render') return { create: [], render: _ot(task, text, now) };
const _ov = staffList.find(s => s.id === next);
if (!_ov) return { create: [], render: null };
const t = makeTask({ room, staff: _ov, payload: { scripts: text, title: String(task.title || '').replace(/^[^:]+:\s*/, '') }, parent: task, staffList, now });
t.title = `${_ov.name}: ${String(task.title || '').replace(/^[^:]+:\s*/, '')}`.slice(0, 140);
t.input.idea_id = task.input.idea_id;
t.input.source_text = text;
return { create: [t], render: null };
}
export function afterStep(task, result, { room, staffList, now = Date.now() } = {}) {
const t = { ...task, input: { ...task.input }, output: { ...task.output } };
const staff = staffList.find(s => s.id === t.input.staff_id) || { id: t.input.staff_id, mode: 'auto' };
const base = { provider: result && result.provider, cost_usd: Number(result && result.cost_usd) || 0, tokens_in: result && result.tokens_in, tokens_out: result && result.tokens_out, finished_at: now };
if (!result || result.ok === false || !String(result.text || '').trim()) {
t.status = 'error'; t.output = { ...t.output, ...base, error: (result && result.error) || 'AI không trả lời (trống)' };
return { update: t, create: [], render: null, ideas: [] };
}
const text = String(result.text).trim();
const semi = modeOf(room, staff) === 'semi' || t.input.mode === 'semi';
t.output = { ...t.output, ...base, text };
if (staff.id === 'reviewer') {
const _ou = parseReview(text, t.input.source_text || '');
t.output.pass = _ou.pass; t.output.issues = _ou.issues; t.output.final_text = _ou.fixed_text || t.input.source_text || '';
if (!_ou.pass || semi) { t.status = 'waiting_approval'; return { update: t, create: [], render: null, ideas: [] }; }
t.status = 'done';
const _op = _oq(t, t.output.final_text, { room, staffList, now });
return { update: t, create: _op.create, render: _op.render, ideas: [] };
}
if (staff.id === 'researcher') {
const list = parseIdeas(text);
t.output.found = list.length;
t.status = list.length ? 'done' : 'error';
if (!list.length) t.output.error = 'AI chưa trả về chủ đề đúng định dạng';
const ideas = list.map(x => ({ title: x.title, summary: x.summary || '', url: x.url || '', source: x.source || 'Nhân viên Nghiên cứu', status: 'new',
score: Number(x.score) || 50, data: JSON.stringify({ kind: x.kind, from_staff: 'researcher', staff_task_id: t.id }) }));
return { update: t, create: [], render: null, ideas };
}
if (semi) { t.status = 'waiting_approval'; return { update: t, create: [], render: null, ideas: [] }; }
t.status = 'done'; t.output.final_text = text;
const _op = _oq(t, text, { room, staffList, now });
return { update: t, create: _op.create, render: _op.render, ideas: [] };
}
export function approveTask(task, { editedText, room, staffList, now = Date.now() } = {}) {
const t = { ...task, input: { ...task.input }, output: { ...task.output } };
const before = String(t.output.final_text || t.output.text || '');
const after = editedText !== undefined && editedText !== null ? String(editedText).trim() : before;
const edited = after && after !== before.trim();
t.status = 'done'; t.output.final_text = after; t.output.approved_at = now; if (edited) t.output.edited = 1;
const _op = _oq(t, after, { room, staffList, now });
return { update: t, create: _op.create, render: _op.render, pair: edited ? { staff_id: t.input.staff_id, before: before.slice(0, 4000), after: after.slice(0, 4000), at: now, task_id: t.id } : null };
}
export function rejectTask(task, reason, now = Date.now()) {
return { ...task, status: 'error', output: { ...task.output, error: reason || 'Anh/chị không duyệt', rejected: 1, finished_at: now } };
}
export const MAX_EDITS = 20;
export function recordEdit(staff, pair) {
if (!pair) return staff;
return { ...staff, edits: [...(staff.edits || []), { before: pair.before, after: pair.after, at: pair.at }].slice(-MAX_EDITS) };
}
export function rulePrompt(staff) {
const _od = (staff.edits || []).slice(-8).map((e, _oh) => `#${_oh + 1}\nTRƯỚC:\n${redact(e.before).slice(0, 1200)}\nSAU (anh/chị sửa):\n${redact(e.after).slice(0, 1200)}`).join('\n\n');
return `Đây là các lần chủ kênh sửa kết quả của nhân viên "${staff.name}" (${staff.role}).
So sánh TRƯỚC/SAU, rút ra tối đa 5 QUY TẮC ngắn (mỗi quy tắc ≤ 25 chữ, tiếng Việt, dạng mệnh lệnh) để lần sau viết đúng ý chủ kênh ngay.
Bỏ quy tắc đã có: ${(staff.rules || []).join(' | ') || 'chưa có'}.
Trả về JSON: ["quy tắc 1", "quy tắc 2"]
${_od}`;
}
export function parseRules(text) {
const j = extractJson(text);
let arr = Array.isArray(j) ? j : j && Array.isArray(j.rules) ? j.rules : null;
if (!arr && j) return [];
if (!arr) arr = String(text || '').split('\n').map(l => l.replace(/^\s*([-*•]|\d+[.)])\s*/, '').trim()).filter(l => l.length > 5 && l.length < 200);
return [...new Set(arr.map(x => String(typeof x === 'string' ? x : (x && (x.rule || x.text)) || '').trim()).filter(Boolean))].slice(0, 5);
}
export function addPendingRules(staff, rules) {
const _og = new Set([...(staff.rules || []), ...(staff.pending_rules || [])]);
return { ...staff, pending_rules: [...new Set([...(staff.pending_rules || []), ...rules.filter(r => !_og.has(r))])] };
}
export function approveRule(staff, rule) {
return { ...staff, rules: [...new Set([...(staff.rules || []), rule])], pending_rules: (staff.pending_rules || []).filter(r => r !== rule) };
}
export function dropRule(staff, rule) {
return { ...staff, rules: (staff.rules || []).filter(r => r !== rule), pending_rules: (staff.pending_rules || []).filter(r => r !== rule) };
}
export const BOARD = [['doing', 'Đang làm'], ['review', 'Chờ duyệt'], ['done', 'Xong'], ['error', 'Lỗi']];
export function board(tasks) {
const _oa = { doing: [], review: [], done: [], error: [] };
for (const t of tasks || []) {
if (!isStaffTask(t)) continue;
const _ok = t.status === 'waiting_approval' || inboxApproved(t) ? 'review' : t.status === 'done' ? 'done' : t.status === 'error' ? 'error' : 'doing';
_oa[_ok].push(t);
}
for (const _ok of Object.keys(_oa)) _oa[_ok].sort((x, y) => (Number(y.updated_at) || 0) - (Number(x.updated_at) || 0));
return _oa;
}
const _ob = ms => { const d = new Date(ms); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
export function spentOn(tasks, roomId, day) {
let s = 0;
for (const t of tasks || []) {
if (!isStaffTask(t) || (roomId && t.input.room_id !== roomId)) continue;
const at = Number(t.output.finished_at) || 0;
if (at && _ob(at) === day) s += Number(t.output.cost_usd) || 0;
}
return Math.round(s * 10000) / 10000;
}
export function budgetGuard(room, tasks, now = Date.now()) {
const spent = spentOn(tasks, room.id, _ob(now));
const cap = Number(room.budget_usd_day) || 0;
const over = cap > 0 && spent >= cap;
if (!over || room.mode === 'semi') return { room, spent, cap, over, switched: false };
return { room: { ...room, mode: 'semi', paused_reason: `Vượt ngân sách ngày (${spent.toFixed(2)}/${cap.toFixed(2)} USD) – đã chuyển Bán tự động lúc ${new Date(now).toTimeString().slice(0, 5)}` }, spent, cap, over, switched: true };
}
export function morningReport({ jobs = [], now = Date.now() } = {}) {
const _ox = new Date(now); _ox.setHours(7, 0, 0, 0);
const _oc = now >= _ox.getTime() ? _ox.getTime() : now;
const _ow = new Date(_ox); _ow.setDate(_ow.getDate() - 1);
const start = _ow.getTime();
const _o10 = _ob(start);
const _om = (jobs || []).filter(j => !Number(j.deleted));
const _oi = j => { const _oy = Number(j.updated_at) || 0; return _oy >= start && _oy <= Math.max(_oc, now); };
const videos_done = _om.filter(j => /^video_/.test(j.type) && j.status === 'done' && _oi(j)).map(j => j.title || 'Video');
const drafts = _om.filter(j => /^video_/.test(j.type) && j.status === 'waiting_approval' && (parse(j.input).from_staff || parse(j.input).overnight)).map(j => j.title || 'Video nháp');
const waiting_items = _om.filter(j => j.status === 'waiting_approval' || (j.type === 'post' && j.status === 'draft')).map(j => ({ id: j.id, type: j.type, title: j.title || '' }));
const tasks = _om.filter(isStaffTask).map(taskView);
const cost_yesterday = spentOn(tasks, '', _o10);
const errors = tasks.filter(t => t.status === 'error' && !t.output.rejected && _oi(t)).map(t => ({ title: t.title, reason: t.output.error || 'Không rõ' }));
const money = v => (v ? v.toFixed(2) + ' USD' : '0 USD (Gemini miễn phí/Ollama)');
const _ol = [
`☀️ Báo cáo sáng ${String(new Date(now).getDate()).padStart(2, '0')}/${String(new Date(now).getMonth() + 1).padStart(2, '0')}`,
`🎬 Video xong: ${videos_done.length}${videos_done.length ? ' – ' + videos_done.slice(0, 3).join('; ') : ''}`,
`📝 Video nháp chờ duyệt: ${drafts.length}`,
`📥 Việc chờ duyệt: ${waiting_items.length}`,
`💵 Chi phí AI hôm qua: ${money(cost_yesterday)}`,
];
if (errors.length) _ol.push(`⚠️ Lỗi: ${errors.length} – ${errors.slice(0, 2).map(e => e.title + ' (' + e.reason + ')').join('; ')}`);
return { videos_done, drafts, waiting: waiting_items.length, waiting_items, cost_yesterday, errors, text: _ol.join('\n') };
}
export function toEngineTask(t) {
return { id: t.id, staff_id: t.input.staff_id, prompt: t.input.prompt, provider: safeProvider(t.input.provider), json: !!t.input.json };
}
export function wantsDraft(row) {
if (!row || row.type !== 'video_map' || Number(row.deleted)) return false;
const _oj = parse(row.input), _or = parse(row.output);
if (_or.draft || _or.rejected) return false;
if (_oj.overnight && row.status === 'queued') return !!((_oj.scenes && _oj.scenes.length) || _oj.script || _oj.title);
if (_oj.from_staff && row.status === 'waiting_approval') return !!(_oj.script || (_oj.scenes && _oj.scenes.length));
return false;
}
export const draftPayload = r => ({ id: r.id, type: r.type, title: r.title, status: r.status, input: r.input, output: r.output || '', deleted: 0 });
export function applyDraft(cur, upd) {
const o = parse(cur && cur.output);
if (!cur || Number(cur.deleted) || o.rejected) return null;
const d = parse(upd && upd.output).draft;
if (!d) return null;
return { ...cur, status: upd.status || cur.status, output: JSON.stringify({ ...o, draft: d }) };
}
export const DRAFT_LABEL = { queued: 'Nháp 480p: chờ máy dựng', running: 'Nháp 480p: đang dựng', done: 'Nháp 480p xong', error: 'Nháp 480p lỗi' };

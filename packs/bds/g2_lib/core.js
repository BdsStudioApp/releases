import * as crm from '../_lib/crm.js';
import { gate } from '../_lib/consent.js';
export const DAY = 86400000;
export const safeUrl = (u) => { const s = String(u ?? '').trim(); return /^https?:\/\/[^\s"'<>\\]+$/i.test(s) && s.length <= 2000 ? s : ''; };
const _oh = r => r && !Number(r.deleted);
const num = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) && v !== '' && v !== null ? n : d; };
export const pd = crm.parseData;
export const fold = crm.strip;
export const VN_OFFSET = 7 * 3600000;
const _on = n => String(n).padStart(2, '0');
export function vnParts(ms) { const d = new Date(Number(ms) + VN_OFFSET); return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), hh: d.getUTCHours(), mm: d.getUTCMinutes(), wd: d.getUTCDay() }; }
export function vnStamp(y, m, d, hh = 0, mm = 0) { const a = [y, m, d, hh, mm].map(Number); return a.every(Number.isFinite) && a[0] > 0 ? Date.UTC(a[0], a[1] - 1, a[2], a[3], a[4]) - VN_OFFSET : NaN; }
export const vnYmd = ms => { const _om = vnParts(ms); return _om.y + '-' + _on(_om.m) + '-' + _on(_om.d); };
export const vnHm = ms => { const _om = vnParts(ms); return _on(_om.hh) + ':' + _on(_om.mm); };
export const vnDate = (ms, withTime = false) => { if (!ms) return ''; const _om = vnParts(ms); return _on(_om.d) + '/' + _on(_om.m) + '/' + _om.y + (withTime ? ' ' + _on(_om.hh) + ':' + _on(_om.mm) : ''); };
export function vnDayStart(ms) { const _om = vnParts(ms); return vnStamp(_om.y, _om.m, _om.d); }
export function vnFromInput(date, time = '') {
const s = String(date || '').trim();
const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/);
if (!m) return NaN;
const t = m[4] !== undefined ? [m[4], m[5]] : (String(time || '').match(/^(\d{1,2}):(\d{2})/) || [0, 0, 0]).slice(1);
return vnStamp(+m[1], +m[2], +m[3], +t[0] || 0, +t[1] || 0);
}
export const vnLocalInput = ms => vnYmd(ms) + 'T' + vnHm(ms);
export function g2Of(c) { const d = pd(c && c.data); return d.g2 && typeof d.g2 === 'object' ? d.g2 : {}; }
export function withG2(c, patch) {
const d = { ...pd(c && c.data) };
d.g2 = { ...(d.g2 && typeof d.g2 === 'object' ? d.g2 : {}), ...patch };
return JSON.stringify(d);
}
export const FUNNEL = [
{ n: 1, id: 'tiep_can', label: 'Tiếp cận', hint: 'Khách mới để lại thông tin, chưa nói chuyện' },
{ n: 2, id: 'lien_he', label: 'Đã liên hệ', hint: 'Đã gọi/nhắn được lần đầu' },
{ n: 3, id: 'tu_van', label: 'Tư vấn', hint: 'Đang gửi thông tin, chăm sóc, làm rõ nhu cầu' },
{ n: 4, id: 'xem_nha', label: 'Hẹn xem nhà', hint: 'Đã hẹn hoặc đã đi xem nhà mẫu/căn' },
{ n: 5, id: 'dam_phan', label: 'Đàm phán', hint: 'Đang bàn giá, phương án thanh toán' },
{ n: 6, id: 'chot', label: 'Chốt', hint: 'Đặt cọc / ký / đã thuê – chuyển sang chăm sóc sau bán' },
];
const _o2 = [
[6, /da dat coc|dat coc|da mua|da thue|da ban|da cho thue|ky hd|ban giao/],
[5, /dam phan|thuong luong/],
[4, /hen xem|co khach xem|co khach hoi|xem nha/],
[3, /cham soc|xac minh|dang chao|tu van|quan tam/],
[2, /da lien he|lien he/],
];
const _o1 = /tam dung|khong tiem nang|dung ban|dung cho thue|ngung|mat khach|huy/;
export function stageOf(status) {
const s = fold(status);
if (!s || /\bmoi\b/.test(s)) return 1;
if (_o1.test(s)) return 0;
for (const [n, re] of _o2) if (re.test(s)) return n;
return 3;
}
export function statusForStage(n, list) {
const _og = Array.isArray(list) ? list : [];
if (n === 1) return _og.find(s => stageOf(s) === 1) || null;
return _og.find(s => stageOf(s) === n) || null;
}
export function funnelBoard(customers, statusListFor) {
const cols = FUNNEL.map(f => ({ ...f, items: [] }));
const out = [];
for (const c of crm.activeCustomers(customers)) {
const n = stageOf(c.status);
if (n === 0) { out.push(c); continue; }
cols[n - 1].items.push(c);
}
const total = cols.reduce((s, c) => s + c.items.length, 0);
let reached = total;
for (let _of = 0; _of < cols.length; _of++) {
const _o5 = cols.slice(_of).reduce((s, c) => s + c.items.length, 0);
cols[_of].reached = _o5;
cols[_of].rate = _of === 0 ? 100 : (reached ? Math.round(_o5 / reached * 100) : 0);
reached = _o5;
}
return { cols, out, total, statusListFor };
}
export const MATCH_MAX = { budget: 40, type: 25, project: 20, status: 10, fresh: 5 };
const _o3 = { sale: 10, soon: 7, done: 5, low: 5, ask: 3 };
const _o4 = { sale: 'đang bán', soon: 'sắp mở bán', done: 'đã bàn giao', low: 'thấp tầng', ask: 'nhận bảng giá' };
const _o7 = t => { const m = String(t || '').match(/(\d)\s*n/i); return m ? Number(m[1]) : (/studio/i.test(String(t)) ? 0 : null); };
const _ox = n => (Math.round(n / 1e7) / 100).toLocaleString('vi-VN') + ' tỷ';
export function moneyShort(n) { n = Number(n) || 0; return n >= 1e9 ? _ox(n) : Math.round(n / 1e6).toLocaleString('vi-VN') + ' triệu'; }
export function candidates(projects) {
const out = [];
for (const _om of projects || []) {
if (!_om || !Array.isArray(_om.price) || !(_om.price[0] > 0)) continue;
for (const t of _om.types || []) {
if (!t || t.ask || !Array.isArray(t.a) || !(t.a[0] > 0)) continue;
const _oi = t.a[0] * _om.price[0] * 1e6, hi = (t.a[1] || t.a[0]) * (_om.price[1] || _om.price[0]) * 1e6;
out.push({ key: _om.id + '|' + t.n, project: _om, type: t.n, area: [t.a[0], t.a[1] || t.a[0]], price_m2: [_om.price[0], _om.price[1] || _om.price[0]], total: [Math.round(_oi), Math.round(hi)] });
}
}
return out;
}
export function scoreUnit(customer, cand, opts = {}) {
const c = customer || {};
const parts = [];
const budget = num(c.budget);
const [_oi, hi] = cand.total;
let _o6 = 0, bt;
if (!budget) { _o6 = 12; bt = 'Khách chưa nói vốn – chưa so được (' + moneyShort(_oi) + '–' + moneyShort(hi) + ')'; }
else if (budget >= _oi && budget <= hi * 1.05) { _o6 = 40; bt = 'Vốn ' + moneyShort(budget) + ' nằm trong khoảng giá ' + moneyShort(_oi) + '–' + moneyShort(hi); }
else if (budget > hi * 1.05) { _o6 = budget > hi * 1.6 ? 22 : 32; bt = 'Vốn ' + moneyShort(budget) + ' dư so với giá cao nhất ' + moneyShort(hi) + (budget > hi * 1.6 ? ' (có thể khách tìm căn lớn hơn)' : ''); }
else {
const _ol = (_oi - budget) / budget;
if (_ol <= 0.1) { _o6 = 26; bt = 'Căn nhỏ nhất ' + moneyShort(_oi) + ' – cao hơn vốn ' + Math.round(_ol * 100) + '% (vay thêm hoặc chính sách giãn)'; }
else if (_ol <= 0.2) { _o6 = 12; bt = 'Căn nhỏ nhất ' + moneyShort(_oi) + ' – cao hơn vốn ' + Math.round(_ol * 100) + '%'; }
else if (_ol <= 0.3) { _o6 = 4; bt = 'Vượt vốn ' + Math.round(_ol * 100) + '%'; }
else return { score: 0, parts: [], excluded: true, why: 'Vượt vốn ' + Math.round(_ol * 100) + '% (căn nhỏ nhất ' + moneyShort(_oi) + ')' };
}
parts.push({ id: 'budget', label: 'Ngân sách', pts: _o6, max: MATCH_MAX.budget, text: bt });
const _oy = String(c.unit_type || '').trim();
let t = 0, tt;
if (!_oy) { t = 10; tt = 'Khách chưa chọn loại căn'; }
else if (fold(_oy) === fold(cand.type)) { t = 25; tt = 'Đúng loại ' + cand.type; }
else if (_o7(_oy) !== null && _o7(_oy) === _o7(cand.type)) { t = 16; tt = 'Cùng số phòng ngủ (' + _oy + ' ↔ ' + cand.type + ')'; }
else if (_o7(_oy) !== null && _o7(cand.type) !== null && Math.abs(_o7(_oy) - _o7(cand.type)) === 1) { t = 6; tt = 'Lệch 1 phòng ngủ (' + _oy + ' ↔ ' + cand.type + ')'; }
else { t = 0; tt = 'Khác loại căn khách muốn (' + _oy + ')'; }
parts.push({ id: 'type', label: 'Loại căn', pts: t, max: MATCH_MAX.type, text: tt });
const _or = (opts.projects || []).find(_om => _om.id === c.project) || null;
let _oo = 0, pt;
if (!c.project) { _oo = 6; pt = 'Khách chưa chọn dự án'; }
else if (c.project === cand.project.id) { _oo = 20; pt = 'Đúng dự án khách quan tâm'; }
else if (_or && _or.area && _or.area === cand.project.area) { _oo = 12; pt = 'Cùng khu vực ' + _or.area + ' với dự án khách quan tâm'; }
else { _oo = 0; pt = 'Khác khu vực khách quan tâm'; }
parts.push({ id: 'project', label: 'Dự án / khu vực', pts: _oo, max: MATCH_MAX.project, text: pt });
const _ou = cand.project.status || 'sale';
parts.push({ id: 'status', label: 'Tình trạng bán', pts: _o3[_ou] ?? 5, max: MATCH_MAX.status, text: 'Dự án ' + (_o4[_ou] || _ou) });
const fresh = typeof opts.policyFresh === 'function' && opts.policyFresh(cand.project.id);
parts.push({ id: 'fresh', label: 'Độ mới của giá', pts: fresh ? 5 : 0, max: MATCH_MAX.fresh, text: fresh ? 'Có chính sách đã duyệt còn hiệu lực' : 'Giá tham khảo – cần kiểm lại với chủ đầu tư' });
const score = Math.max(0, Math.min(100, parts.reduce((s, _om) => s + _om.pts, 0)));
return { score, parts, excluded: false, why: '' };
}
export function matchUnits(customer, projects, opts = {}) {
const _ob = crm.needGroup(customer && customer.need);
if (_ob !== 'mua') return { list: [], note: 'Bảng hàng hiện chỉ có giá bán sơ cấp – chưa ghép được nhu cầu "' + (customer.need || '') + '".', excluded: 0 };
const _oc = new Set(g2Of(customer).hidden_matches || []);
let excluded = 0;
const list = [];
for (const cand of candidates(projects)) {
if (_oc.has(cand.key)) continue;
const r = scoreUnit(customer, cand, { ...opts, projects });
if (r.excluded) { excluded++; continue; }
list.push({ ...cand, ...r });
}
list.sort((a, _o6) => _o6.score - a.score || a.total[0] - _o6.total[0]);
const note = !customer.budget && !customer.unit_type && !customer.project ? 'Khách chưa có vốn, loại căn, dự án – điểm chỉ mang tính gợi ý. Bổ sung hồ sơ để ghép chính xác hơn.' : '';
return { list: list.slice(0, opts.limit || 8), note, excluded };
}
export const SCORE_RULES = [
{ id: 'contact14', label: 'Mỗi lần gọi/nhắn/gặp trong 14 ngày', w: 8, cap: 3 },
{ id: 'inbound7', label: 'Khách tự nhắn tới (Zalo OA) trong 7 ngày', w: 15, cap: 1 },
{ id: 'viewing', label: 'Có lịch xem nhà (30 ngày qua hoặc sắp tới)', w: 20, cap: 1 },
{ id: 'quote', label: 'Đã nhận báo giá trong 30 ngày', w: 12, cap: 1 },
{ id: 'stage', label: 'Mỗi bước tiến trong phễu (từ bước 2)', w: 5, cap: 4 },
{ id: 'budget', label: 'Đã nói rõ vốn', w: 6, cap: 1 },
{ id: 'project', label: 'Đã chọn dự án / loại căn', w: 4, cap: 2 },
{ id: 'fresh', label: 'Khách mới để lại thông tin trong 3 ngày', w: 10, cap: 1 },
{ id: 'decay', label: 'Mỗi ngày im lặng quá 14 ngày (trừ điểm)', w: -1, cap: 40 },
];
export const DEFAULT_TIERS = { hot: 70, warm: 40 };
export function scoreConfig(cfg) {
const c = cfg && typeof cfg === 'object' ? cfg : {};
const w = c.weights && typeof c.weights === 'object' ? c.weights : {};
const rules = SCORE_RULES.map(r => ({ ...r, w: Number.isFinite(Number(w[r.id])) ? Number(w[r.id]) : r.w }));
const t = c.tiers || {};
const hot = Number.isFinite(Number(t.hot)) ? Number(t.hot) : DEFAULT_TIERS.hot;
const warm = Number.isFinite(Number(t.warm)) ? Math.min(Number(t.warm), hot) : DEFAULT_TIERS.warm;
return { rules, tiers: { hot, warm } };
}
const _o0 = new Set(['call', 'zalo', 'meeting', 'g2_news', 'g2_zoa_out']);
export function lastContactAt(events, id) {
let last = 0;
for (const e of events || []) if (_oh(e) && e.object_id === id && _o0.has(e.type) && num(e.at) > last) last = num(e.at);
return last;
}
export function isViewing(r) { return r && r.kind === 'meeting' && (pd(r.data).g2 === 'viewing' || /xem nh/i.test(String(r.title || ''))); }
export function scoreCustomer(c, { events = [], reminders = [], quotes = [], now = Date.now(), config } = {}) {
const { rules, tiers } = config && config.rules ? config : scoreConfig(config);
const id = c.id;
const _oa = events.filter(e => _oh(e) && e.object_id === id);
const count = {};
count.contact14 = _oa.filter(e => _o0.has(e.type) && num(e.at) >= now - 14 * DAY).length;
count.inbound7 = _oa.filter(e => e.type === 'g2_zoa_in' && num(e.at) >= now - 7 * DAY).length;
count.viewing = reminders.some(r => _oh(r) && r.object_id === id && isViewing(r) && num(r.due_at) >= now - 30 * DAY) ? 1 : 0;
count.quote = quotes.some(q => _oh(q) && q.object_id === id && num(q.created_at || q.updated_at) >= now - 30 * DAY) || _oa.some(e => e.type === 'quote' && num(e.at) >= now - 30 * DAY) ? 1 : 0;
count.stage = Math.max(0, stageOf(c.status) - 1);
count.budget = num(c.budget) > 0 ? 1 : 0;
count.project = (c.project ? 1 : 0) + (c.unit_type ? 1 : 0);
count.fresh = num(c.created_at) >= now - 3 * DAY ? 1 : 0;
const last = Math.max(lastContactAt(events, id), num(c.created_at));
const silent = last ? Math.floor((now - last) / DAY) : 0;
count.decay = Math.max(0, silent - 14);
const parts = rules.map(r => {
const n = Math.min(count[r.id] || 0, r.cap);
return { id: r.id, label: r.label, count: n, pts: Math.round(n * (r.id === 'decay' ? -Math.abs(r.w) : r.w)) };
}).filter(_om => _om.count);
const _os = parts.reduce((s, _om) => s + _om.pts, 0);
const score = Math.max(0, Math.min(100, _os));
const _o8 = stageOf(c.status) === 6;
const tier = _o8 ? 'done' : score >= tiers.hot ? 'hot' : score >= tiers.warm ? 'warm' : 'cold';
return { score, tier, parts, silent };
}
export const TIER_LABEL = { hot: 'Nóng', warm: 'Ấm', cold: 'Lạnh', done: 'Đã chốt' };
export const COLD_BUCKETS = [30, 60, 90];
export function coldBucket(days) { return days >= 90 ? 90 : days >= 60 ? 60 : days >= 30 ? 30 : 0; }
export function projectKeywords(_om, areas = []) {
const kws = new Set();
if (!_om) return [];
if (_om.name) kws.add(fold(_om.name));
if (_om.area) kws.add(fold(_om.area));
for (const a of areas) if ((a.projectAreas || []).includes(_om.area)) (a.kw || []).forEach(k => kws.add(k));
return [...kws].filter(k => k && k.length >= 4);
}
export function mentions(text, kws) { const n = ' ' + fold(text) + ' '; return kws.some(k => n.includes(' ' + k + ' ') || n.includes(k)); }
export function freshReasons(c, since, ctx = {}) {
const out = [];
const now = ctx.now || Date.now();
const _om = (ctx.projects || []).find(x => x.id === c.project) || null;
const kws = projectKeywords(_om, ctx.areas);
for (const _op of ctx.policies || []) {
if (!_oh(_op) || _op.status !== 'active' || (c.project && _op.project_id !== c.project)) continue;
if (!c.project) continue;
const at = num(_op.approved_at) || num(_op.updated_at);
if (at > since) out.push({ kind: 'policy', at, text: 'Chính sách mới ' + (_om ? _om.name : _op.project_id) + (_op.month ? ' tháng ' + _op.month.split('-').reverse().join('/') : ''), source: 'Bảng chính sách của app' });
}
if (kws.length) {
for (const _of of ctx.ideas || []) {
if (!_oh(_of) || _of.status === 'rejected' || _of.source === 'market') continue;
const at = num(pd(_of.data).published) || num(_of.updated_at);
if (at > since && at <= now && mentions([_of.title, _of.summary].join(' '), kws)) out.push({ kind: 'news', at, text: 'Tin mới: ' + String(_of.title).slice(0, 140), url: /^https?:\/\//.test(_of.url || '') ? _of.url : '', source: _of.source || 'Nguồn ý tưởng' });
}
for (const r of ctx.reports || []) {
if (num(r.at) <= since) continue;
for (const _o9 of r.call_reasons || []) if (_om && mentions(_o9.project || '', [fold(_om.name)])) out.push({ kind: 'market', at: num(r.at), text: _o9.reason, source: 'Bản tin thị trường tuần' });
}
}
if (_om && _om.handover) {
const [y, m] = String(_om.handover).split('-').map(Number);
const _oe = vnStamp(y, m || 1, 1);
if (_oe > now && _oe - now < 120 * DAY) out.push({ kind: 'handover', at: now, text: 'Dự án ' + _om.name + ' sắp bàn giao (' + String(m).padStart(2, '0') + '/' + y + ')', source: 'Bảng hàng' });
}
if (typeof ctx.matches === 'function') {
const _ow = ctx.matches(c).filter(u => u.score >= 70 && u.project.overridden && num(u.project.updated_at) > since);
if (_ow[0]) out.push({ kind: 'unit', at: num(_ow[0].project.updated_at), text: 'Bảng hàng cập nhật: ' + _ow[0].project.name + ' ' + _ow[0].type + ' hợp ' + _ow[0].score + ' điểm', source: 'Bảng hàng' });
}
out.sort((a, _o6) => _o6.at - a.at);
return out;
}
export function coldList(customers, events, ctx = {}) {
const now = ctx.now || Date.now();
const rows = [];
for (const c of crm.activeCustomers(customers)) {
const _ou = stageOf(c.status);
if (_ou === 0 || _ou === 6 || pd(c.data).erased || !gate(c, 'contact').ok) continue;
const last = Math.max(lastContactAt(events, c.id), num(c.created_at));
if (!last) continue;
const days = Math.floor((now - last) / DAY);
const bucket = coldBucket(days);
if (!bucket) continue;
const snoozed = num(g2Of(c).cold_snooze_until);
if (snoozed > now) continue;
rows.push({ c, days, bucket, last, reasons: freshReasons(c, last, ctx) });
}
rows.sort((a, _o6) => (_o6.reasons.length ? 1 : 0) - (a.reasons.length ? 1 : 0) || _o6.days - a.days);
return rows;
}
export function callbackText(c, reason, me = {}) {
const _ov = crm.givenName(c.name);
const why = reason ? reason.text.replace(/^Tin mới:\s*/, '') : '';
return why
? `Dạ em chào anh/chị ${_ov}, em ${me.name || ''} đây ạ. Lâu rồi em chưa hỏi thăm anh/chị. Em vừa có thông tin mới: ${why}${reason.url ? ' (' + reason.url + ')' : ''}. Em gửi anh/chị tham khảo, nhu cầu nhà của mình hiện tại thế nào để em hỗ trợ đúng hơn ạ?`.replace(/\s+/g, ' ')
: `Dạ em chào anh/chị ${_ov}, em ${me.name || ''} đây ạ. Lâu rồi em chưa hỏi thăm anh/chị. Không biết nhu cầu nhà của anh/chị hiện tại còn như trước không ạ, để em cập nhật thông tin phù hợp cho mình?`.replace(/\s+/g, ' ');
}
export const DEFAULT_CARE = { min_days: 14, max_per_30: 2 };
export function careConfig(v) {
const c = v && typeof v === 'object' ? v : {};
const _oj = Number(c.min_days), mx = Number(c.max_per_30);
return { min_days: Number.isFinite(_oj) && _oj >= 1 ? Math.round(_oj) : DEFAULT_CARE.min_days, max_per_30: Number.isFinite(mx) && mx >= 1 ? Math.round(mx) : DEFAULT_CARE.max_per_30 };
}
export function capState(id, events, cfg, now = Date.now()) {
const _ot = (events || []).filter(e => _oh(e) && e.object_id === id && e.type === 'g2_news').map(e => num(e.at)).sort((a, _o6) => _o6 - a);
const last = _ot[0] || 0;
const in30 = _ot.filter(t => t >= now - 30 * DAY).length;
const c = careConfig(cfg);
if (last && now - last < c.min_days * DAY) return { ok: false, last, in30, next: last + c.min_days * DAY, why: 'Vừa gửi ' + Math.floor((now - last) / DAY) + ' ngày trước (tối thiểu cách ' + c.min_days + ' ngày)' };
if (in30 >= c.max_per_30) {
const _ok = _ot.filter(t => t >= now - 30 * DAY).pop();
return { ok: false, last, in30, next: _ok + 30 * DAY, why: 'Đã gửi ' + in30 + ' tin trong 30 ngày (tối đa ' + c.max_per_30 + ')' };
}
return { ok: true, last, in30, next: 0, why: '' };
}
export function newsHooks({ ideas = [], policies = [], projects = [], now = Date.now(), days = 21 } = {}) {
const since = now - days * DAY;
const out = [];
for (const _of of ideas) {
if (!_oh(_of) || _of.status === 'rejected' || _of.source === 'market' || !_of.title) continue;
const at = num(pd(_of.data).published) || num(_of.updated_at);
if (at < since) continue;
out.push({ id: 'n:' + _of.id, kind: 'news', at, title: String(_of.title).slice(0, 180), url: /^https?:\/\//.test(_of.url || '') ? _of.url : '', source: _of.source || '', text: [_of.title, _of.summary].join(' ') });
}
for (const _om of policies) {
if (!_oh(_om) || _om.status !== 'active') continue;
const at = num(_om.approved_at) || num(_om.updated_at);
if (at < since) continue;
const _oq = projects.find(x => x.id === _om.project_id);
out.push({ id: 'p:' + _om.id, kind: 'policy', at, project_id: _om.project_id, title: 'Chính sách mới ' + (_oq ? _oq.name : _om.project_id) + (_om.month ? ' tháng ' + _om.month.split('-').reverse().join('/') : ''), url: '', source: 'Bảng chính sách của app', text: _oq ? _oq.name : '' });
}
return out.sort((a, _o6) => _o6.at - a.at);
}
export function careMatches(customers, events, hooks, { projects = [], areas = [], cfg, now = Date.now() } = {}) {
const rows = [];
let noConsent = 0;
for (const c of crm.activeCustomers(customers)) {
if (pd(c.data).erased || stageOf(c.status) === 0) continue;
const _om = projects.find(x => x.id === c.project);
if (!_om) continue;
const kws = projectKeywords(_om, areas);
const _od = hooks.filter(hk => (hk.kind === 'policy' ? hk.project_id === c.project : mentions(hk.text, kws)));
if (!_od.length) continue;
if (!gate(c, 'care').ok) { noConsent++; continue; }
rows.push({ c, hooks: _od, cap: capState(c.id, events, cfg, now) });
}
rows.sort((a, _o6) => (_o6.cap.ok ? 1 : 0) - (a.cap.ok ? 1 : 0) || _o6.hooks[0].at - a.hooks[0].at);
return { rows, noConsent };
}
export function careText(c, hook, me = {}, projectName = '') {
const _ov = crm.givenName(c.name);
return (`Dạ em chào anh/chị ${_ov}, em ${me.name || ''} đây ạ. Em thấy có thông tin mới liên quan ${projectName || 'khu vực anh/chị quan tâm'}: ${hook.title}` +
(hook.url ? ` (${hook.url})` : '') + `. Em gửi anh/chị tham khảo, anh/chị cần em phân tích kỹ hơn thì nhắn em nhé ạ.` +
(me.phone ? ` Em ${me.name || ''} – ${me.phone}.` : '')).replace(/\s+/g, ' ').trim();
}

import { h } from './kit.js';
import * as crm from './crm.js';
export const PL_SRC = 'Công ty cấp';
export const STAGES = [
{ k: 'moi', label: 'Mới nhận', r: 0 }, { k: 'da_goi', label: 'Đã gọi', r: 1 }, { k: 'khong_nghe', label: 'Không nghe máy', r: 1 },
{ k: 'quan_tam', label: 'Quan tâm', r: 2 }, { k: 'hen_xem', label: 'Hẹn xem', r: 3 }, { k: 'da_gap', label: 'Đã gặp', r: 4 },
{ k: 'dat_coc', label: 'Đặt cọc', r: 5 }, { k: 'chot', label: 'Chốt', r: 6 },
{ k: 'khong_nhu_cau', label: 'Không nhu cầu', r: 1, exit: 1, junk: 1, why: 1 }, { k: 'sai_so', label: 'Sai số / Số ảo', r: 1, exit: 1, junk: 1, why: 1 },
{ k: 'trung', label: 'Trùng', r: 1, exit: 1 }
];
export const STAGE = Object.fromEntries(STAGES.map((_ok) => [_ok.k, _ok]));
export const LEVELS = [
{ k: 'hot', label: 'Nóng', color: '#dc2626', bg: '#fee2e2' },
{ k: 'warm', label: 'Ấm', color: '#b45309', bg: '#fef3c7' },
{ k: 'cold', label: 'Lạnh', color: '#1d4ed8', bg: '#dbeafe' }
];
export const LEVEL = Object.fromEntries(LEVELS.map((_od) => [_od.k, _od]));
export const KQT = [['sai_so', 'Sai số'], ['tai_chinh', 'Không đủ tài chính'], ['da_mua', 'Đã mua chỗ khác'], ['khong_nghe', 'Gọi 3 lần không nghe'], ['khac', 'Khác']];
export const CARE = { cham: { label: 'Đang chăm', cls: 'lp-care-cham' }, kqt: { label: 'Không quan tâm', cls: 'lp-care-kqt' }, wait: { label: 'Chờ nhận / chờ gọi', cls: 'lp-care-wait' } };
export const CHANNELS = { facebook: 'Facebook', google: 'Google', tiktok: 'TikTok', zalo: 'Zalo', landing: 'Landing', su_kien: 'Sự kiện', khac: 'Khác' };
const pd = (c) => { try { const d = typeof c.data === 'string' ? JSON.parse(c.data || '{}') : (c.data || {}); return d && typeof d === 'object' ? d : {}; } catch { return {}; } };
export function poolInfo(c) { const p = c ? pd(c).pool : null; return p && typeof p === 'object' && p.pid ? p : null; }
export function isCompanyLead(c) { return !!(c && (poolInfo(c) || c.source === PL_SRC)); }
export function stageKey(label) { const _ok = STAGES.find((x) => x.label === String(label || '').trim()); return _ok ? _ok.k : ''; }
export function stageOf(c) { const p = poolInfo(c); return (p && STAGE[p.stage] ? p.stage : '') || stageKey(c && c.status) || 'moi'; }
export function levelOf(c) { const p = poolInfo(c); return p && LEVEL[p.level] ? p.level : ''; }
export function needsReason(k) { return !!(STAGE[k] && STAGE[k].why); }
export function validateStatus({ stage, level, reason } = {}) {
if (!STAGE[stage]) return 'Chọn tiến độ.';
if (level && !LEVEL[level]) return 'Mức độ không hợp lệ.';
if (needsReason(stage) && String(reason || '').trim().length < 3) return 'Ghi lý do cho "' + STAGE[stage].label + '" (marketing dùng để đánh giá chất lượng quảng cáo).';
return '';
}
export function vnDay(ms = Date.now()) { const d = new Date(Number(ms) + 7 * 3600000); return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0'); }
export function needsCall(c) { const p = poolInfo(c); return !!(p && Number(p.ask) > 0 && !Number(p.ack)); }
export function needsReport(c, now = Date.now()) {
const p = poolInfo(c); if (!p) return false;
const k = stageOf(c); if ((STAGE[k] && STAGE[k].exit) || k === 'chot') return false;
if (Number(p.rep_stop)) return false;
const _oo = vnDay(now);
return p.rep_next ? _oo >= p.rep_next : p.rep_d !== _oo;
}
export function careClass(_oj) {
if (!_oj) return '';
if (_oj.status === 'cold' || _oj.care === 'kqt') return CARE.kqt.cls;
if (_oj.status === 'team' || (_oj.status === 'assigned' && _oj.sale_ack === false)) return CARE.wait.cls;
if (_oj.status === 'assigned' && (_oj.care === 'cham' || _oj.rep_care === 'cham')) return CARE.cham.cls;
return '';
}
export function isOverdue(_oj, hours = 2, now = Date.now()) {
return !!_oj && _oj.status === 'assigned' && (_oj.stage || 'moi') === 'moi' && now - Number(_oj.assigned_at || 0) > Number(hours || 2) * 3600000;
}
export function channelKey(_op) {
const _ok = crm.strip(_op).replace(/[^a-z0-9]+/g, ' ').trim();
if (!_ok) return '';
if (CHANNELS[_ok.replace(/ /g, '_')]) return _ok.replace(/ /g, '_');
if (/^(fb|facebook|meta|instagram|ig|messenger)\b/.test(_ok)) return 'facebook';
if (/^(gg|google|youtube|yt|adwords)\b/.test(_ok)) return 'google';
if (/^(tiktok|tt)\b/.test(_ok)) return 'tiktok';
if (/^(zalo|zl)\b/.test(_ok)) return 'zalo';
if (/^(landing|web|website|webhook|form)\b/.test(_ok)) return 'landing';
if (/^(su kien|event|hoi thao|mo ban)\b/.test(_ok)) return 'su_kien';
return 'khac';
}
const _o0 = {
name: ['ho ten', 'ho va ten', 'ten', 'ten khach', 'ten khach hang', 'khach hang', 'full name', 'fullname', 'name'],
phone: ['sdt', 'so dien thoai', 'dien thoai', 'so dt', 'di dong', 'phone', 'phone number', 'mobile', 'tel'],
email: ['email', 'e mail', 'mail'],
project: ['du an', 'du an quan tam', 'project'],
note: ['ghi chu', 'note', 'noi dung', 'loi nhan', 'yeu cau', 'message'],
need: ['nhu cau', 'need'],
channel: ['nguon', 'kenh', 'nen tang', 'source', 'channel', 'platform', 'utm source'],
campaign: ['chien dich', 'campaign', 'campaign name', 'ten chien dich', 'utm campaign'],
adset: ['quang cao', 'nhom quang cao', 'adset', 'ad set', 'ad set name', 'ad name', 'ad', 'utm content'],
lead_at: ['thoi diem', 'thoi gian', 'ngay', 'ngay tao', 'created time', 'created at', 'date', 'time'],
cost: ['chi phi', 'chi phi lead', 'chi phi moi lead', 'cpl', 'cost', 'cost per lead']
};
const norm = (_ok) => crm.strip(_ok).replace(/[^a-z0-9]+/g, ' ').trim();
export function poolMapping(headers) {
const _oa = (headers || []).map(norm), used = new Set(), map = {};
for (const [f, syn] of Object.entries(_o0)) { const _ob = _oa.findIndex((x, k) => !used.has(k) && syn.includes(x)); if (_ob >= 0) { map[f] = _ob; used.add(_ob); } }
for (const [f, syn] of Object.entries(_o0)) {
if (map[f] !== undefined) continue;
const _ob = _oa.findIndex((x, k) => !used.has(k) && x && syn.some((_ok) => _ok.length >= 4 && (' ' + x + ' ').includes(' ' + _ok + ' ')));
if (_ob >= 0) { map[f] = _ob; used.add(_ob); }
}
return map;
}
export function poolRows(rows) {
const _o7 = (rows || []).filter((r) => Array.isArray(r) && r.some((c) => String(c ?? '').trim()));
if (!_o7.length) return { rows: [], mapping: {}, headers: [] };
const headers = _o7[0].map((c) => String(c ?? '').trim()), map = poolMapping(headers);
const _og = _o7.slice(1).map((r) => {
const _of = {};
for (const [f, _ob] of Object.entries(map)) { const _op = String(r[_ob] ?? '').trim(); if (_op) _of[f] = _op; }
if (_of.cost) _of.cost = Number(String(_of.cost).replace(/[^\d]/g, '')) || '';
if (_of.lead_at) { const t = Date.parse(_of.lead_at); _of.lead_at = Number.isFinite(t) ? t : ''; }
return _of;
}).filter((_of) => String(_of.phone || '').replace(/\D/g, '').length >= 9 || /@/.test(_of.email || ''));
return { rows: _og, mapping: map, headers };
}
export function parseDelimited(text) {
const _ok = String(text || '').replace(/\r\n?/g, '\n').trim();
if (!_ok) return [];
const _o9 = _ok.split('\n')[0], sep = _o9.includes('\t') ? '\t' : (_o9.split(';').length > _o9.split(',').length ? ';' : ',');
const rows = []; let _oj = [], cell = '', q = false;
for (let _ob = 0; _ob < _ok.length; _ob++) {
const _o5 = _ok[_ob];
if (q) { if (_o5 === '"' && _ok[_ob + 1] === '"') { cell += '"'; _ob++; } else if (_o5 === '"') q = false; else cell += _o5; continue; }
if (_o5 === '"') q = true; else if (_o5 === sep) { _oj.push(cell); cell = ''; } else if (_o5 === '\n') { _oj.push(cell); rows.push(_oj); _oj = []; cell = ''; } else cell += _o5;
}
_oj.push(cell); rows.push(_oj);
return rows;
}
export function filterPool(rows, f = {}) {
const q = crm.strip(f.q || ''), qd = String(f.q || '').replace(/\D/g, '');
return (rows || []).filter((r) => {
if (f.state === 'new' && r.status !== 'new') return false;
if (f.state === 'assigned' && r.status !== 'assigned') return false;
if (f.state === 'overdue' && !r.overdue) return false;
if (f.state === 'team' && r.status !== 'team') return false;
if (f.state === 'unack' && !(r.status === 'assigned' && r.sale_ack === false)) return false;
if (f.state === 'norep' && !r.need_rep) return false;
if (f.state === 'cham' && !(r.status === 'assigned' && (r.care === 'cham' || r.rep_care === 'cham'))) return false;
if (f.state === 'cold' ? r.status !== 'cold' : r.status === 'cold') return false;
if (f.stage && r.stage !== f.stage) return false;
if (f.level && r.level !== f.level) return false;
if (f.channel && r.channel !== f.channel) return false;
if (f.campaign && r.campaign !== f.campaign) return false;
if (q && !crm.strip([r.name, r.campaign, r.assignee_name, r.project].join(' ')).includes(q) && !(qd.length >= 3 && String(r.phone || '').replace(/\D/g, '').includes(qd))) return false;
return true;
});
}
export const PUSH_BATCH = 300;
export const RECLAIM_BATCH = 30;
export function batches(list, size) {
const _o1 = Array.isArray(list) ? list : [], n = Math.max(1, Math.floor(Number(size) || 1)), _og = [];
for (let _ob = 0; _ob < _o1.length; _ob += n) _og.push(_o1.slice(_ob, _ob + n));
return _og;
}
export function pushBatchNote(n) {
const k = batches(Array.from({ length: Math.max(0, n | 0) }), PUSH_BATCH).length;
return k > 1 ? `App tự chia ${n} khách thành ${k} đợt (mỗi đợt tối đa ${PUSH_BATCH} khách) và gửi lần lượt – giữ màn này mở tới khi báo xong.` : '';
}
export function reclaimBatchNote(n) {
return n > RECLAIM_BATCH ? `Mỗi lần thu hồi tối đa ${RECLAIM_BATCH} khách (chuyển khách giữa các Sheet tốn thời gian máy chủ). Lần này thu hồi ${RECLAIM_BATCH} khách đầu; ${n - RECLAIM_BATCH} khách còn lại vẫn được chọn – bấm Thu hồi lần nữa.` : '';
}
export function toWhom(list) {
const _on = (Array.isArray(list) ? list : []).filter((t) => t && t.name);
if (!_on.length) return '';
return 'cho ' + (_on.length === 1 ? _on[0].name : _on.map((t) => t.name + ' (' + (Number(t.n) || 0) + ')').join(', '));
}
export function ensureLpCss() {
if (typeof document === 'undefined' || document.getElementById('bds-lp-css')) return;
const _od = document.createElement('link'); _od.id = 'bds-lp-css'; _od.rel = 'stylesheet'; _od.href = new URL('./lead_pool.css', import.meta.url).href; document.head.appendChild(_od);
}
export function companyBadge(c) { ensureLpCss(); return h('span', { class: 'lp-badge', title: 'Lead do công ty cấp', 'data-testid': 'company-badge' }, '🏢 Công ty cấp'); }
export function levelBadge(k) {
const _od = LEVEL[k]; if (!_od) return null;
ensureLpCss();
return h('span', { class: 'lp-lv', style: { color: _od.color, background: _od.bg }, 'data-level': k }, _od.label);
}
export function statusButton(K, ctx, c, onDone, opts = {}) {
ensureLpCss();
const _o4 = needsCall(c), rep = !_o4 && needsReport(c);
const label = _o4 ? 'Đã gọi' : rep ? 'Báo cáo' : 'Trạng thái';
const _o2 = K.button(opts.short && !_o4 && !rep ? '' : label, (e) => { if (e && e.stopPropagation) e.stopPropagation(); return openStatusPicker(K, ctx, c, onDone); },
{ kind: _o4 || rep ? 'primary' : (opts.kind || 'primary'), icon: _o4 ? 'phone' : 'pulse', testid: 'lead-status-' + c.id, title: _o4 ? 'Gọi khách rồi ghi kết quả cuộc gọi đầu' : 'Báo cáo / cập nhật trạng thái lead', small: !!opts.small });
_o2.classList.add('lp-stbtn'); if (_o4) _o2.classList.add('lp-call'); else if (rep) _o2.classList.add('lp-due');
return _o2;
}
export function openStatusPicker(K, ctx, c, onDone) {
ensureLpCss();
const _oh = poolInfo(c) || {};
const _o9 = needsCall(c);
const _ol = { care: 'cham', stage: _o9 ? '' : stageOf(c), level: levelOf(c), kqt: '' };
const _o6 = (list, cur, key, cls) => h('div', { class: 'lp-chips', role: 'group' }, list.map((x) => h('button', { type: 'button', class: 'lp-chip ' + (cls ? cls(x) : ''), 'aria-pressed': String(x.k === cur), 'data-testid': 'ls-' + key + '-' + x.k,
style: key === 'level' ? { color: x.color, background: x.bg } : null,
onclick: () => { _ol[key] = _ol[key] === x.k && key === 'level' ? '' : x.k; if (key === 'stage' && STAGE[x.k] && STAGE[x.k].exit) _ol.care = ''; if (key === 'stage' && !(STAGE[x.k] && STAGE[x.k].exit) && !_ol.care) _ol.care = 'cham'; _oi(); } }, x.label)));
const reason = h('input', { maxlength: 200, 'data-testid': 'ls-reason', placeholder: 'vd: thuê bao không tồn tại' });
const note = h('textarea', { rows: 2, maxlength: 500, 'data-testid': 'ls-note', placeholder: 'Ghi chú ngắn – trưởng nhóm và Quản trị xem được' });
const value = h('input', { inputmode: 'numeric', 'data-testid': 'ls-value', placeholder: 'vd 3500000000 (không bắt buộc)' });
const noAsk = h('input', { type: 'checkbox', 'data-testid': 'ls-noask', checked: !!Number(_oh.rep_stop) });
const _o8 = h('div', { class: 'bds-error', role: 'alert', 'data-testid': 'ls-error' });
const box = h('div', { 'data-testid': 'ls-box' });
const care = (k, label, cls) => h('button', { type: 'button', class: 'lp-chip lp-carechip ' + cls, 'aria-pressed': String(_ol.care === k), 'data-testid': 'ls-care-' + k,
onclick: () => { _ol.care = k; if (k === 'kqt') _ol.stage = ''; else if (_ol.stage && STAGE[_ol.stage].exit) _ol.stage = ''; _oi(); } }, label);
const _om = STAGES.filter((x) => !x.why && !(_o9 && x.k === 'moi'));
function _oi() {
const _oc = _ol.care === 'kqt';
box.replaceChildren(
h('div', { class: 'lp-chips', role: 'group' }, care('cham', '✅ Đang chăm', 'lp-care-cham'), care('kqt', '🧊 Không quan tâm (trả số về kho)', 'lp-care-kqt')),
_oc ? h('div', null, h('strong', null, 'Lý do (bắt buộc)'), h('div', { class: 'lp-chips', role: 'group' }, KQT.map(([k, _od]) => h('button', { type: 'button', class: 'lp-chip', 'aria-pressed': String(_ol.kqt === k), 'data-testid': 'ls-kqt-' + k, onclick: () => { _ol.kqt = k; _oi(); } }, _od))))
: h('div', null,
h('strong', null, _o9 ? 'Kết quả cuộc gọi đầu' : 'Tiến độ'), _o6(_om, _ol.stage, 'stage', (x) => (x.exit ? 'lp-exit' : '')),
h('strong', null, 'Mức độ'), _o6(LEVELS, _ol.level, 'level'),
_ol.stage === 'chot' ? K.field('Giá trị giao dịch (đồng)', value, 'Chỉ hiện trong lời chúc mừng nếu Quản trị cho phép.') : null),
K.field('Ghi chú', note),
!_oc ? h('label', { class: 'bds-row lp-noask' }, noAsk, h('span', null, 'Không hỏi lại số này')) : null,
_o8);
}
_oi();
return new Promise((res) => {
let _oe;
const save = async () => {
const _oc = _ol.care === 'kqt';
const payload = { id: c.id, care: _ol.care || '', note: note.value.trim() };
if (_oc) {
if (!_ol.kqt) { _o8.textContent = 'Chọn lý do Không quan tâm.'; return; }
if (_ol.kqt === 'khac' && payload.note.length < 3) { _o8.textContent = 'Chọn "Khác" thì ghi rõ lý do vào Ghi chú.'; return; }
payload.kqt = _ol.kqt;
const _oq = await K.confirm({ title: 'Trả số về kho?', text: 'Số "' + (c.name || 'khách') + '" rời danh sách của anh/chị và về Quản trị. Không hoàn tác được.', kind: 'danger', ok: 'Trả số về kho', testid: 'ls-kqt-confirm' });
if (!_oq) return;
} else {
if (_o9 && !_ol.stage) { _o8.textContent = 'Chọn kết quả cuộc gọi đầu.'; return; }
payload.stage = _ol.stage || stageOf(c); payload.level = _ol.level; payload.reason = reason.value.trim();
if (noAsk.checked) payload.no_ask = true;
if (_ol.stage === 'chot' && value.value.trim()) payload.value = Number(value.value.replace(/[^\d]/g, '')) || 0;
const _o3 = validateStatus(payload);
if (_o3) { _o8.textContent = _o3; return; }
}
let _og;
try { _og = await K.api('pool.lead_status', payload); } catch (e) { _o8.textContent = (e && (e.userMessage || e.message)) || 'Chưa lưu được – kiểm tra mạng rồi thử lại.'; return; }
_oe.close();
K.toast(_oc ? 'Đã trả số về kho' : 'Đã cập nhật: ' + STAGE[payload.stage].label + (_ol.level ? ' · ' + LEVEL[_ol.level].label : ''), 'success');
try { if (ctx.store && typeof ctx.store.syncNow === 'function') await ctx.store.syncNow(); } catch { }
onDone && onDone({ ...payload, back: !!(_og && _og.back) });
res(payload);
};
_oe = K.modal({ title: (_o9 ? 'Đã gọi: ' : 'Báo cáo: ') + (c.name || 'khách'), testid: 'lead-status-modal', body: [box,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => { _oe.close(); res(null); }, { icon: 'x', testid: 'ls-cancel' }),
K.button('Gửi báo cáo', save, { kind: 'primary', icon: 'check', testid: 'ls-save' }))] });
});
}

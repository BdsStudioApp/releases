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
export const STAGE = Object.fromEntries(STAGES.map((_oj) => [_oj.k, _oj]));
export const LEVELS = [
{ k: 'hot', label: 'Nóng', color: '#dc2626', bg: '#fee2e2' },
{ k: 'warm', label: 'Ấm', color: '#b45309', bg: '#fef3c7' },
{ k: 'cold', label: 'Lạnh', color: '#1d4ed8', bg: '#dbeafe' }
];
export const LEVEL = Object.fromEntries(LEVELS.map((_oc) => [_oc.k, _oc]));
export const CHANNELS = { facebook: 'Facebook', google: 'Google', tiktok: 'TikTok', zalo: 'Zalo', landing: 'Landing', su_kien: 'Sự kiện', khac: 'Khác' };
const pd = (c) => { try { const d = typeof c.data === 'string' ? JSON.parse(c.data || '{}') : (c.data || {}); return d && typeof d === 'object' ? d : {}; } catch { return {}; } };
export function poolInfo(c) { const p = c ? pd(c).pool : null; return p && typeof p === 'object' && p.pid ? p : null; }
export function isCompanyLead(c) { return !!(c && (poolInfo(c) || c.source === PL_SRC)); }
export function stageKey(label) { const _oj = STAGES.find((x) => x.label === String(label || '').trim()); return _oj ? _oj.k : ''; }
export function stageOf(c) { const p = poolInfo(c); return (p && STAGE[p.stage] ? p.stage : '') || stageKey(c && c.status) || 'moi'; }
export function levelOf(c) { const p = poolInfo(c); return p && LEVEL[p.level] ? p.level : ''; }
export function needsReason(k) { return !!(STAGE[k] && STAGE[k].why); }
export function validateStatus({ stage, level, reason } = {}) {
if (!STAGE[stage]) return 'Chọn tiến độ.';
if (level && !LEVEL[level]) return 'Mức độ không hợp lệ.';
if (needsReason(stage) && String(reason || '').trim().length < 3) return 'Ghi lý do cho "' + STAGE[stage].label + '" (marketing dùng để đánh giá chất lượng quảng cáo).';
return '';
}
export function isOverdue(_oi, hours = 2, now = Date.now()) {
return !!_oi && _oi.status === 'assigned' && (_oi.stage || 'moi') === 'moi' && now - Number(_oi.assigned_at || 0) > Number(hours || 2) * 3600000;
}
export function channelKey(_om) {
const _oj = crm.strip(_om).replace(/[^a-z0-9]+/g, ' ').trim();
if (!_oj) return '';
if (CHANNELS[_oj.replace(/ /g, '_')]) return _oj.replace(/ /g, '_');
if (/^(fb|facebook|meta|instagram|ig|messenger)\b/.test(_oj)) return 'facebook';
if (/^(gg|google|youtube|yt|adwords)\b/.test(_oj)) return 'google';
if (/^(tiktok|tt)\b/.test(_oj)) return 'tiktok';
if (/^(zalo|zl)\b/.test(_oj)) return 'zalo';
if (/^(landing|web|website|webhook|form)\b/.test(_oj)) return 'landing';
if (/^(su kien|event|hoi thao|mo ban)\b/.test(_oj)) return 'su_kien';
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
const norm = (_oj) => crm.strip(_oj).replace(/[^a-z0-9]+/g, ' ').trim();
export function poolMapping(headers) {
const _oa = (headers || []).map(norm), used = new Set(), map = {};
for (const [f, syn] of Object.entries(_o0)) { const _ob = _oa.findIndex((x, k) => !used.has(k) && syn.includes(x)); if (_ob >= 0) { map[f] = _ob; used.add(_ob); } }
for (const [f, syn] of Object.entries(_o0)) {
if (map[f] !== undefined) continue;
const _ob = _oa.findIndex((x, k) => !used.has(k) && x && syn.some((_oj) => _oj.length >= 4 && (' ' + x + ' ').includes(' ' + _oj + ' ')));
if (_ob >= 0) { map[f] = _ob; used.add(_ob); }
}
return map;
}
export function poolRows(rows) {
const _o7 = (rows || []).filter((r) => Array.isArray(r) && r.some((c) => String(c ?? '').trim()));
if (!_o7.length) return { rows: [], mapping: {}, headers: [] };
const headers = _o7[0].map((c) => String(c ?? '').trim()), map = poolMapping(headers);
const _of = _o7.slice(1).map((r) => {
const _oe = {};
for (const [f, _ob] of Object.entries(map)) { const _om = String(r[_ob] ?? '').trim(); if (_om) _oe[f] = _om; }
if (_oe.cost) _oe.cost = Number(String(_oe.cost).replace(/[^\d]/g, '')) || '';
if (_oe.lead_at) { const t = Date.parse(_oe.lead_at); _oe.lead_at = Number.isFinite(t) ? t : ''; }
return _oe;
}).filter((_oe) => String(_oe.phone || '').replace(/\D/g, '').length >= 9 || /@/.test(_oe.email || ''));
return { rows: _of, mapping: map, headers };
}
export function parseDelimited(text) {
const _oj = String(text || '').replace(/\r\n?/g, '\n').trim();
if (!_oj) return [];
const _o9 = _oj.split('\n')[0], sep = _o9.includes('\t') ? '\t' : (_o9.split(';').length > _o9.split(',').length ? ';' : ',');
const rows = []; let _oi = [], cell = '', q = false;
for (let _ob = 0; _ob < _oj.length; _ob++) {
const _o5 = _oj[_ob];
if (q) { if (_o5 === '"' && _oj[_ob + 1] === '"') { cell += '"'; _ob++; } else if (_o5 === '"') q = false; else cell += _o5; continue; }
if (_o5 === '"') q = true; else if (_o5 === sep) { _oi.push(cell); cell = ''; } else if (_o5 === '\n') { _oi.push(cell); rows.push(_oi); _oi = []; cell = ''; } else cell += _o5;
}
_oi.push(cell); rows.push(_oi);
return rows;
}
export function filterPool(rows, f = {}) {
const q = crm.strip(f.q || ''), qd = String(f.q || '').replace(/\D/g, '');
return (rows || []).filter((r) => {
if (f.state === 'new' && r.status !== 'new') return false;
if (f.state === 'assigned' && r.status !== 'assigned') return false;
if (f.state === 'overdue' && !r.overdue) return false;
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
const _o1 = Array.isArray(list) ? list : [], n = Math.max(1, Math.floor(Number(size) || 1)), _of = [];
for (let _ob = 0; _ob < _o1.length; _ob += n) _of.push(_o1.slice(_ob, _ob + n));
return _of;
}
export function pushBatchNote(n) {
const k = batches(Array.from({ length: Math.max(0, n | 0) }), PUSH_BATCH).length;
return k > 1 ? `App tự chia ${n} khách thành ${k} đợt (mỗi đợt tối đa ${PUSH_BATCH} khách) và gửi lần lượt – giữ màn này mở tới khi báo xong.` : '';
}
export function reclaimBatchNote(n) {
return n > RECLAIM_BATCH ? `Mỗi lần thu hồi tối đa ${RECLAIM_BATCH} khách (chuyển khách giữa các Sheet tốn thời gian máy chủ). Lần này thu hồi ${RECLAIM_BATCH} khách đầu; ${n - RECLAIM_BATCH} khách còn lại vẫn được chọn – bấm Thu hồi lần nữa.` : '';
}
export function toWhom(list) {
const _ol = (Array.isArray(list) ? list : []).filter((t) => t && t.name);
if (!_ol.length) return '';
return 'cho ' + (_ol.length === 1 ? _ol[0].name : _ol.map((t) => t.name + ' (' + (Number(t.n) || 0) + ')').join(', '));
}
export function ensureLpCss() {
if (typeof document === 'undefined' || document.getElementById('bds-lp-css')) return;
const _oc = document.createElement('link'); _oc.id = 'bds-lp-css'; _oc.rel = 'stylesheet'; _oc.href = new URL('./lead_pool.css', import.meta.url).href; document.head.appendChild(_oc);
}
export function companyBadge(c) { ensureLpCss(); return h('span', { class: 'lp-badge', title: 'Lead do công ty cấp', 'data-testid': 'company-badge' }, '🏢 Công ty cấp'); }
export function levelBadge(k) {
const _oc = LEVEL[k]; if (!_oc) return null;
ensureLpCss();
return h('span', { class: 'lp-lv', style: { color: _oc.color, background: _oc.bg }, 'data-level': k }, _oc.label);
}
export function statusButton(K, ctx, c, onDone, opts = {}) {
ensureLpCss();
const _o2 = K.button(opts.short ? '' : 'Trạng thái', (e) => { if (e && e.stopPropagation) e.stopPropagation(); return openStatusPicker(K, ctx, c, onDone); },
{ kind: opts.kind || 'primary', icon: 'pulse', testid: 'lead-status-' + c.id, title: 'Cập nhật trạng thái lead', small: !!opts.small });
_o2.classList.add('lp-stbtn');
return _o2;
}
export function openStatusPicker(K, ctx, c, onDone) {
ensureLpCss();
const _ok = { stage: stageOf(c), level: levelOf(c) };
const _o6 = (list, cur, key, cls) => h('div', { class: 'lp-chips', role: 'group' }, list.map((x) => {
const _o2 = h('button', { type: 'button', class: 'lp-chip ' + (cls ? cls(x) : ''), 'aria-pressed': String(x.k === cur), 'data-testid': 'ls-' + key + '-' + x.k,
style: key === 'level' ? { color: x.color, background: x.bg } : null,
onclick: () => { _ok[key] = _ok[key] === x.k && key === 'level' ? '' : x.k; _og(); } }, x.label);
return _o2;
}));
const reason = h('input', { maxlength: 200, 'data-testid': 'ls-reason', placeholder: 'vd: chỉ hỏi giá, không có nhu cầu thật / thuê bao không tồn tại' });
const note = h('textarea', { rows: 2, maxlength: 500, 'data-testid': 'ls-note', placeholder: 'Ghi chú ngắn (không bắt buộc) – chỉ lưu trong hồ sơ của anh/chị' });
const value = h('input', { inputmode: 'numeric', 'data-testid': 'ls-value', placeholder: 'vd 3500000000 (không bắt buộc)' });
const _o8 = h('div', { class: 'bds-error', role: 'alert', 'data-testid': 'ls-error' });
const _o4 = h('div', { 'data-testid': 'ls-box' });
function _og() {
_o4.replaceChildren(
h('strong', null, 'Tiến độ'), _o6(STAGES, _ok.stage, 'stage', (x) => (x.exit ? 'lp-exit' : '')),
h('strong', null, 'Mức độ'), _o6(LEVELS, _ok.level, 'level'),
needsReason(_ok.stage) ? K.field('Lý do (bắt buộc)', reason, 'Marketing dùng lý do này để đánh giá chất lượng quảng cáo.') : null,
_ok.stage === 'chot' ? K.field('Giá trị giao dịch (đồng)', value, 'Chỉ hiện trong lời chúc mừng nếu Quản trị cho phép.') : null,
K.field('Ghi chú', note), _o8);
}
_og();
return new Promise((res) => {
let _od;
const save = async () => {
const _oh = { id: c.id, stage: _ok.stage, level: _ok.level, reason: reason.value.trim(), note: note.value.trim() };
if (_ok.stage === 'chot' && value.value.trim()) _oh.value = Number(value.value.replace(/[^\d]/g, '')) || 0;
const _o3 = validateStatus(_oh);
if (_o3) { _o8.textContent = _o3; return; }
try { await K.api('pool.lead_status', _oh); } catch (e) { _o8.textContent = (e && (e.userMessage || e.message)) || 'Chưa lưu được – kiểm tra mạng rồi thử lại.'; return; }
_od.close();
K.toast('Đã cập nhật: ' + STAGE[_ok.stage].label + (_ok.level ? ' · ' + LEVEL[_ok.level].label : ''), 'success');
try { if (ctx.store && typeof ctx.store.syncNow === 'function') await ctx.store.syncNow(); } catch { }
onDone && onDone(_oh);
res(_oh);
};
_od = K.modal({ title: 'Trạng thái lead: ' + (c.name || 'khách'), testid: 'lead-status-modal', body: [_o4,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => { _od.close(); res(null); }, { icon: 'x', testid: 'ls-cancel' }),
K.button('Lưu trạng thái', save, { kind: 'primary', icon: 'check', testid: 'ls-save' }))] });
});
}

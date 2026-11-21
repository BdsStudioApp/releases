import * as crm from './crm.js';
import { readAttribution } from '../g3_lib/attribution.js';
import { DEAL_STATUSES, parseAmount } from '../g3_lib/roi.js';
import { csvCellSafe } from './import_logic.js';
import { withRules } from '../../../shared/ai_rules.js';
export const SOURCE_GROUPS = [
['video', 'Video TikTok/Reels'], ['facebook', 'Bài Facebook'], ['landing', 'Landing'],
['referral', 'Giới thiệu'], ['zalo', 'Zalo'], ['magnet', 'Mồi câu'], ['owner', 'Chủ căn'], ['other', 'Khác'],
];
const _o2 = SOURCE_GROUPS.map(g => g[0]);
const LABEL = Object.fromEntries(SOURCE_GROUPS);
export function sourceLabel(_op) { return LABEL[_op] || LABEL.other; }
export const MIN_SAMPLE = 5;
export const DETAIL_MAX = 80;
export const NO_DETAIL = '(không ghi chi tiết)';
export const COSTS_KEY = 'source_roi.costs';
const WORDS = [
[/^moi cau|magnet/, 'magnet'],
[/^chu can\b|^chu nha\b/, 'owner'],
[/tiktok|\btt\b|reels?|youtube|shorts|video|clip/, 'video'],
[/facebook|\bfb\b|fanpage|meta|instagram|\big\b|messenger|group|nhom/, 'facebook'],
[/gioi thieu|referral|nguoi quen|ctv|ban be/, 'referral'],
[/zalo/, 'zalo'],
[/landing|website|web\b|trang/, 'landing'],
];
const _o0 = { tiktok: 'video', facebook: 'facebook', group: 'facebook', zalo: 'zalo', referral: 'referral' };
const _o5 = /^([^:\d][^:]{0,30}?)\s*:\s*(.+)$/;
function _o18(_o14) {
const m = _o5.exec(String(_o14 || '').trim());
if (!m || (/\d$/.test(m[1]) && /^\d/.test(m[2])) || /^\/\//.test(m[2])) return null;
return { head: m[1].trim(), tail: m[2].trim() };
}
const _o4 = /^moi-cau-(.+)$/i;
export function sourceOf(_oc) {
if (!_oc) return 'other';
const _o14 = String(_oc.source || '').trim();
if (['video', 'facebook', 'referral', 'zalo', 'magnet', 'owner'].includes(_o14)) return _o14;
if (_o14 === 'warm') return 'referral';
if (_o14 === 'landing' || !_o14) {
const _o7 = readAttribution(_oc);
if (_o4.test(_o7.utm_campaign)) return 'magnet';
if (_o0[_o7.channel]) return _o0[_o7.channel];
if (_o7.v) return 'video';
return _o14 === 'landing' ? 'landing' : 'other';
}
if (_o14 === 'other' || _o14 === 'manual' || _o14 === 'walkin') return 'other';
const _oz = _o18(_o14);
const _o15 = crm.strip(_oz ? _oz.head : _o14);
for (const [re, _op] of WORDS) if (re.test(_o15)) return _op;
return 'other';
}
export function cleanDetail(_o15) { return String(_o15 == null ? '' : _o15).normalize('NFC').replace(/\s+/g, ' ').trim().slice(0, DETAIL_MAX); }
export function detailOf(_oc) {
const d = crm.parseData(_oc && _oc.data);
const _ow = cleanDetail(d.source_detail);
if (_ow) return _ow;
if (!_oc) return '';
const _oz = _o18(_oc.source);
if (_oz) return cleanDetail(_oz.tail);
const _o7 = readAttribution(_oc);
const _ot = _o4.exec(_o7.utm_campaign);
return cleanDetail(_ot ? _ot[1] : (_o7.utm_campaign || _o7.v || ''));
}
export function detailPatch(_oc, detail) {
const v = cleanDetail(detail);
return crm.patchData(_oc, { source_detail: v || null });
}
export function recentDetails(customers, { limit = 12, extra = [] } = {}) {
const rows = crm.activeCustomers(customers)
.map(_oc => ({ t: Number(_oc.updated_at) || Number(_oc.created_at) || 0, v: cleanDetail(crm.parseData(_oc.data).source_detail) }))
.filter(x => x.v).sort((_o7, b) => b.t - _o7.t);
const _o16 = new Set(), _ov = [];
for (const v of [...rows.map(x => x.v), ...extra.map(cleanDetail)]) {
const _op = crm.strip(v);
if (!_op || _o16.has(_op)) continue;
_o16.add(_op); _ov.push(v);
if (_ov.length >= limit) break;
}
return _ov;
}
const _ox = n => String(n).padStart(2, '0');
const _oo = t => new Date(t).toISOString().slice(0, 10);
const _ol = _o15 => _o15.slice(8, 10) + '/' + _o15.slice(5, 7);
export const PERIODS = [['week', 'Tuần này'], ['last_week', 'Tuần trước'], ['month', 'Tháng này'], ['last_month', 'Tháng trước']];
export function periodRange(kind, now = Date.now()) {
const _o1b = crm.ymdVN(now);
const [y, m, d] = _o1b.split('-').map(Number);
const _o1a = Date.UTC(y, m - 1, d);
const _om = (new Date(_o1a).getUTCDay() + 6) % 7;
const _o1 = 86400000;
if (kind === 'last_week') {
const from = _oo(_o1a - (_om + 7) * _o1), to = _oo(_o1a - (_om + 1) * _o1);
return { kind, from, to, label: `Tuần trước (${_ol(from)} – ${_ol(to)})` };
}
if (kind === 'month') return { kind, from: `${y}-${_ox(m)}-01`, to: _o1b, label: `Tháng ${_ox(m)}/${y} (đến ${_ol(_o1b)})` };
if (kind === 'last_month') {
const _o10 = m === 1 ? y - 1 : y, pm = m === 1 ? 12 : m - 1;
return { kind, from: `${_o10}-${_ox(pm)}-01`, to: _oo(Date.UTC(y, m - 1, 0)), label: `Tháng ${_ox(pm)}/${_o10}` };
}
const from = _oo(_o1a - _om * _o1);
return { kind: 'week', from, to: _o1b, label: `Tuần này (${_ol(from)} – ${_ol(_o1b)})` };
}
const _o12 = _o11 => _o11.from + '_' + _o11.to;
export function isDeal(_oc) { return DEAL_STATUSES.includes(String(_oc && _oc.status || '').trim()); }
const _o6 = /hen xem|dam phan|khach xem|dat coc|\bcoc\b|da mua|da thue|da ban|da cho thue|ky hd|ban giao/;
export function meetingIds(reminders = [], events = []) {
const _o15 = new Set();
for (const _o11 of reminders || []) if (_o11 && !Number(_o11.deleted) && _o11.kind === 'meeting' && _o11.object_id) _o15.add(_o11.object_id);
for (const e of events || []) if (e && !Number(e.deleted) && e.type === 'meeting' && e.object_id) _o15.add(e.object_id);
return _o15;
}
export function reachedViewing(_oc, meetings) {
if (!_oc) return false;
if (isDeal(_oc) || _o6.test(crm.strip(_oc.status))) return true;
return !!(meetings && meetings.has(_oc.id));
}
export function parseCost(v) {
if (v === null || v === undefined || v === '') return 0;
if (typeof v === 'number') return Number.isFinite(v) && v > 0 ? Math.round(v) : 0;
const _o15 = crm.strip(v);
if (/[a-z]/.test(_o15.replace(/d$|vnd$|dong$/, ''))) return crm.parseMoney(v) || 0;
return Math.max(0, Math.round(parseAmount(v)));
}
export function costOf(costs, range, src) {
const v = costs && costs[_o12(range)] && Number(costs[_o12(range)][src]);
return Number.isFinite(v) && v > 0 ? v : null;
}
export function setCost(costs, range, src, value) {
const _ov = JSON.parse(JSON.stringify(costs && typeof costs === 'object' ? costs : {}));
const _op = _o12(range), n = parseCost(value);
const _oe = { ...(_ov[_op] || {}) };
if (n > 0) _oe[src] = n; else delete _oe[src];
if (Object.keys(_oe).length) _ov[_op] = _oe; else delete _ov[_op];
return _ov;
}
export function spendBySource(spends, range) {
const _ov = {};
for (const _ou of spends || []) {
if (!_ou || Number(_ou.deleted) || (_ou.kind && _ou.kind !== 'g3_spend')) continue;
const _o11 = crm.parseData(_ou.data);
const date = String(_o11.date || '');
if (!date || date < range.from || date > range.to) continue;
const src = _o0[_o11.channel];
const _o9 = Number(_o11.amount) || 0;
if (!src || _o9 <= 0) continue;
_ov[src] = (_ov[src] || 0) + _o9;
}
return _ov;
}
const _o13 = (_o7, b) => (b > 0 ? Math.round(_o7 / b * 1000) / 10 : null);
function blank(key, label) { return { key, label, n: 0, hot: 0, appt: 0, deal: 0 }; }
function _on(x) {
return { ...x, rateHot: _o13(x.hot, x.n), rateAppt: _o13(x.appt, x.n), rateDeal: _o13(x.deal, x.appt), rateDealAll: _o13(x.deal, x.n) };
}
function withCost(x, cost, from) {
const _oc = cost > 0 ? Math.round(cost) : null;
return { ...x, cost: _oc, costFrom: _oc ? from : '', cpl: _oc && x.n ? Math.round(_oc / x.n) : null, cpd: _oc && x.deal ? Math.round(_oc / x.deal) : null };
}
export function buildReport({ customers = [], reminders = [], events = [], from, to, label = '', costs = null, spends = [], tiers = null } = {}) {
const range = { from, to };
const _os = meetingIds(reminders, events);
const G = new Map(SOURCE_GROUPS.map(([_op, l]) => [_op, { ...blank(_op, l), _d: new Map() }]));
for (const _oc of crm.activeCustomers(customers)) {
const t = Number(_oc.created_at) || Number(_oc.updated_at) || 0;
if (!t) continue;
const _og = crm.ymdVN(t);
if (_og < from || _og > to) continue;
const g = G.get(sourceOf(_oc));
const _oi = detailOf(_oc);
const _ok = crm.strip(_oi) || '';
if (!g._d.has(_ok)) g._d.set(_ok, blank(_ok, _oi || NO_DETAIL));
const hot = crm.heatOf(_oc, { tiers }).id === 'hot' ? 1 : 0, appt = reachedViewing(_oc, _os) ? 1 : 0, deal = isDeal(_oc) ? 1 : 0;
for (const x of [g, g._d.get(_ok)]) { x.n++; x.hot += hot; x.appt += appt; x.deal += deal; }
}
const _o8 = spendBySource(spends, range);
const groups = [...G.values()].map(g => {
const _or = costOf(costs, range, g.key);
const cost = _or || _o8[g.key] || 0;
const details = [...g._d.values()].map(_on).sort((_o7, b) => b.n - _o7.n || b.hot - _o7.hot || (_o7.label === NO_DETAIL) - (b.label === NO_DETAIL));
const { _d, ...rest } = g;
return { ...withCost(_on(rest), cost, _or ? 'manual' : 'ads'), details };
}).sort((_o7, b) => b.n - _o7.n || _o2.indexOf(_o7.key) - _o2.indexOf(b.key));
const _o19 = groups.reduce((t, g) => { t.n += g.n; t.hot += g.hot; t.appt += g.appt; t.deal += g.deal; t.cost += g.cost || 0; return t; }, { ...blank('_total', 'Tổng'), cost: 0 });
const total = withCost(_on(_o19), _o19.cost, 'sum');
return { from, to, label: label || `${from.split('-').reverse().join('/')} – ${to.split('-').reverse().join('/')}`, groups, total };
}
export function money(n) { return String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ'; }
const _oy = v => (v === null || v === undefined ? 'chưa đủ dữ liệu' : String(v).replace('.', ',') + '%');
export function recommend(rep, { min = MIN_SAMPLE } = {}) {
const _ov = [];
const _ob = rep.groups.filter(g => g.n >= min);
const _o17 = rep.groups.filter(g => g.n > 0 && g.n < min);
if (!_ob.length) {
_ov.push({ kind: 'none', tone: 'info', text: `Chưa đủ dữ liệu: cần ít nhất ${min} khách mới ở một nguồn trong kỳ để khuyến nghị (kỳ này có ${rep.total.n} khách).` });
return _ov;
}
const _oa = _ob.filter(g => g.hot > 0).sort((_o7, b) => b.hot - _o7.hot || b.rateHot - _o7.rateHot)[0];
if (_oa) _ov.push({ kind: 'more', tone: 'ok', source: _oa.key, n: _oa.n,
text: `Nguồn "${_oa.label}" ra nhiều khách Nóng nhất: ${_oa.hot}/${_oa.n} khách (${_oy(_oa.rateHot)}) – làm thêm.` });
for (const g of _ob) if (!g.appt) _ov.push({ kind: 'review', tone: 'warn', source: g.key, n: g.n,
text: `Nguồn "${g.label}": ${g.n} khách, 0 hẹn xem – xem lại nội dung hoặc cách chăm khách từ nguồn này.` });
const _oh = _ob.filter(g => g.deal > 0).sort((_o7, b) => b.rateDealAll - _o7.rateDealAll || b.deal - _o7.deal)[0];
if (_oh && _ob.length >= 2) _ov.push({ kind: 'best_deal', tone: 'ok', source: _oh.key, n: _oh.n,
text: `Nguồn "${_oh.label}" chốt tốt nhất: ${_oh.deal}/${_oh.n} khách (${_oy(_oh.rateDealAll)}).` });
for (const g of _ob) if (g.cost && !g.deal) _ov.push({ kind: 'cost_no_deal', tone: 'warn', source: g.key, n: g.n,
text: `Đã chi ${money(g.cost)} cho "${g.label}" (${money(g.cpl)}/khách, ${g.n} khách) nhưng chưa chốt – theo dõi thêm trước khi tăng tiền.` });
const _oj = [];
for (const g of rep.groups) for (const d of g.details) if (d.n >= min && d.label !== NO_DETAIL) _oj.push({ ...d, src: g });
const _of = _oj.filter(d => d.hot > 0).sort((_o7, b) => b.hot - _o7.hot || b.rateHot - _o7.rateHot)[0];
if (_of) _ov.push({ kind: 'more_detail', tone: 'ok', source: _of.src.key, detail: _of.label, n: _of.n,
text: `Chi tiết "${_of.label}" (${_of.src.label}) ra nhiều Nóng nhất: ${_of.hot}/${_of.n} khách – làm thêm nội dung giống vậy.` });
for (const d of _oj) if (!d.appt) _ov.push({ kind: 'review_detail', tone: 'warn', source: d.src.key, detail: d.label, n: d.n,
text: `Chi tiết "${d.label}" (${d.src.label}): ${d.n} khách, 0 hẹn xem – xem lại.` });
if (_o17.length) _ov.push({ kind: 'small', tone: 'info',
text: `Chưa đủ mẫu để kết luận (dưới ${min} khách): ` + _o17.map(g => `${g.label} (${g.n})`).join(', ') + '.' });
return _ov;
}
const _o3 = ['Nguồn', 'Chi tiết', 'Khách mới', 'Nóng', 'Đã hẹn xem', 'Đã chốt', '% Nóng/khách', '% Hẹn/khách', '% Chốt/hẹn', '% Chốt/khách', 'Chi phí', 'Chi phí/khách', 'Chi phí/deal'];
function _od(name, detail, x, withCostCols) {
const _oc = v => (v === null || v === undefined ? 'chưa nhập' : v);
return [name, detail, x.n, x.hot, x.appt, x.deal, _oy(x.rateHot), _oy(x.rateAppt), _oy(x.rateDeal), _oy(x.rateDealAll),
...(withCostCols ? [_oc(x.cost), x.cost ? _oc(x.cpl) : '', x.cost ? (x.cpd === null ? 'chưa có deal' : x.cpd) : ''] : ['', '', ''])];
}
export function reportCsv(rep, recs = recommend(rep)) {
const _oq = [['Kỳ', rep.label], ['Cách tính', 'Khách mới trong kỳ theo ngày tạo hồ sơ, xét trạng thái hiện tại'], [], _o3];
for (const g of rep.groups) {
_oq.push(_od(g.label, '(tất cả)', g, true));
for (const d of g.details) _oq.push(_od('', d.label, d, false));
}
_oq.push(_od('Tổng', '', rep.total, true));
_oq.push([], ['Khuyến nghị']);
for (const _o11 of recs) _oq.push([_o11.text]);
return '﻿' + _oq.map(_o11 => _o11.map(csvCellSafe).join(',')).join('\r\n');
}
export function aiPrompt(rep, recs = recommend(rep)) {
const L = [`Báo cáo "Nguồn nào ra khách" của một môi giới bất động sản, kỳ ${rep.label}. Khách mới trong kỳ, trạng thái hiện tại:`];
for (const g of rep.groups) {
if (!g.n) continue;
L.push(`- ${g.label}: ${g.n} khách, ${g.hot} Nóng, ${g.appt} đã hẹn xem, ${g.deal} đã chốt` + (g.cost ? `, chi phí ${money(g.cost)}` : ''));
for (const d of g.details.slice(0, 5)) if (d.label !== NO_DETAIL) L.push(`   · ${d.label}: ${d.n} khách, ${d.hot} Nóng, ${d.appt} hẹn, ${d.deal} chốt`);
}
L.push('Khuyến nghị app đã tính theo luật (chỉ khi ≥ ' + MIN_SAMPLE + ' khách):', ...recs.map(_o11 => '- ' + _o11.text));
L.push('Viết 3–5 gạch đầu dòng tiếng Việt ngắn gọn: nên làm thêm gì, xem lại gì. Chỉ dùng số liệu ở trên, không bịa số, nói rõ khi cỡ mẫu nhỏ.');
return withRules(L.join('\n'));
}

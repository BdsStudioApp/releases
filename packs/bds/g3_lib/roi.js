import { strip, parseData } from '../_lib/crm.js';
import { readAttribution, normChannel, channelName } from './attribution.js';
import { csvObjects } from './csv.js';
export const DEAL_STATUSES = ['Đã đặt cọc', 'Đã mua', 'Đã thuê', 'Đã bán', 'Đã cho thuê'];
export const DIMENSIONS = { channel: 'Kênh', campaign: 'Chiến dịch', video: 'Video', landing: 'Trang landing' };
const DAY = 86400000;
export function isDeal(_o7) { return DEAL_STATUSES.includes(String(_o7 && _o7.status || '').trim()); }
export function isCustomer(_ow) { return _ow && !Number(_ow.deleted) && (!_ow.kind || _ow.kind === 'customer'); }
export function parseAmount(v) {
if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
const _o12 = String(v || '').trim();
if (/^-?\d+([.,]\d+)?e[+-]?\d+$/i.test(_o12)) { const n = Number(_o12.replace(',', '.')); return Number.isFinite(n) ? n : 0; }
let _o11 = String(v || '').replace(/[^\d.,-]/g, '');
if (!_o11) return 0;
const _op = _o11.lastIndexOf('.'), lastComma = _o11.lastIndexOf(',');
if (_op >= 0 && lastComma >= 0) {
const _ob = _op > lastComma ? '.' : ',';
_o11 = _o11.split(_ob === '.' ? ',' : '.').join('').replace(_ob, '.');
} else if (lastComma >= 0 || _op >= 0) {
const _o13 = lastComma >= 0 ? ',' : '.';
const _oy = _o11.split(_o13);
_o11 = _oy.length > 2 || (_oy.length === 2 && _oy[1].length === 3 && !/^-?0+$/.test(_oy[0])) ? _oy.join('') : _oy.join('.');
}
const n = Number(_o11);
return Number.isFinite(n) ? n : 0;
}
export function isTotalLabel(label) {
const _o11 = strip(label).replace(/\s+/g, ' ').trim();
if (!_o11) return false;
if (/^(total|totals|grand total|overall|summary|all|tong|tong cong|tong ket|tat ca)\s*(:|\(.*\))?$/.test(_o11)) return true;
if (/^(total|totals|tong|tong cong)\s*:/.test(_o11)) return true;
return /^(results|result|ket qua) (from|tu) [\d.,]+ /.test(_o11);
}
export function parseDate(v) {
if (v === null || v === undefined || v === '') return '';
if (typeof v === 'number' && v > 1e11) return new Date(v + 7 * 3600e3).toISOString().slice(0, 10);
const _o11 = String(v).trim();
let _os = _o11.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
if (_os) return ymd(_os[1], _os[2], _os[3]);
_os = _o11.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
if (_os) return ymd(_os[3], _os[2], _os[1]);
return '';
}
function ymd(y, mo, _oa) {
const _o1 = Number(y), M = Number(mo), D = Number(_oa);
if (_o1 < 1900 || M < 1 || M > 12 || D < 1) return '';
const t = new Date(Date.UTC(_o1, M - 1, D));
if (t.getUTCFullYear() !== _o1 || t.getUTCMonth() !== M - 1 || t.getUTCDate() !== D) return '';
return `${y}-${String(mo).padStart(2, '0')}-${String(_oa).padStart(2, '0')}`;
}
export function keyOf(_o11) { return strip(_o11).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
export function extId(r) {
return [r.source && r.source.startsWith('api:') ? r.source.slice(4) : r.channel, r.account_id || '', r.campaign_id || keyOf(r.campaign), r.ad_id || '', r.date].join(':');
}
export function spendRow(x, source = 'manual') {
const r = {
date: parseDate(x.date), channel: normChannel(x.channel) || 'other', account_id: String(x.account_id || '').slice(0, 40),
campaign: String(x.campaign || '').trim().slice(0, 160), campaign_id: String(x.campaign_id || '').slice(0, 40),
adset_id: String(x.adset_id || '').slice(0, 40), ad_id: String(x.ad_id || '').slice(0, 40),
video: String(x.video || '').trim().slice(0, 60), landing: String(x.landing || '').trim().slice(0, 200),
amount: Math.round(parseAmount(x.amount)), currency: 'VND',
impressions: Math.round(parseAmount(x.impressions)) || 0, clicks: Math.round(parseAmount(x.clicks)) || 0, platform_leads: Math.round(parseAmount(x.platform_leads)) || 0,
source: x.source || source,
};
r.ext_id = x.ext_id || extId(r);
return r;
}
export function validSpend(r) { return !!r.date && r.amount > 0; }
export function fromApiRow(platform, row) {
if (platform === 'facebook') return spendRow({ date: row.date_start, channel: 'facebook', account_id: row.account_id, campaign: row.campaign_name, campaign_id: row.campaign_id, adset_id: row.adset_id, ad_id: row.ad_id, amount: row.spend, impressions: row.impressions, clicks: row.clicks }, 'api:facebook');
if (platform === 'tiktok') { const _oa = row.dimensions || row, _os = row.metrics || row; return spendRow({ date: _oa.stat_time_day, channel: 'tiktok', account_id: row.advertiser_id, campaign: _os.campaign_name, campaign_id: _oa.campaign_id, ad_id: _oa.ad_id, amount: _os.spend, impressions: _os.impressions, clicks: _os.clicks }, 'api:tiktok'); }
if (platform === 'google') {
const g = (_ow, p) => p.split('.').reduce((_o2, _oo) => (_o2 ? _o2[_oo] : undefined), _ow);
return spendRow({ date: g(row, 'segments.date'), channel: 'google', account_id: g(row, 'customer.id'), campaign: g(row, 'campaign.name'), campaign_id: g(row, 'campaign.id'), amount: Number(g(row, 'metrics.costMicros') ?? g(row, 'metrics.cost_micros') ?? 0) / 1e6, impressions: g(row, 'metrics.impressions'), clicks: g(row, 'metrics.clicks') }, 'api:google');
}
return null;
}
const _o0 = {
date: ['ngay', 'day', 'date', 'reporting starts', 'bat dau bao cao', 'by day', 'stat time day', 'segments date', 'ngay bat dau'],
date_to: ['reporting ends', 'ket thuc bao cao', 'ngay ket thuc bao cao'],
campaign: ['campaign name', 'ten chien dich', 'campaign', 'chien dich', 'campaign.name'],
campaign_id: ['campaign id', 'id chien dich', 'campaign_id', 'campaign.id', 'ma chien dich'],
ad_id: ['ad id', 'id quang cao', 'ad_id'],
amount: ['amount spent', 'so tien da chi tieu', 'so tien da chi', 'cost', 'chi phi', 'spend', 'tong chi phi', 'amount', 'metrics cost micros'],
impressions: ['impressions', 'luot hien thi', 'hien thi'],
clicks: ['link clicks', 'clicks', 'luot nhap', 'luot click', 'nhap vao lien ket', 'click'],
platform_leads: ['leads', 'khach hang tiem nang', 'results', 'ket qua', 'conversions', 'chuyen doi'],
channel: ['platform', 'nen tang', 'kenh', 'channel', 'nguon'],
video: ['ma video', 'video', 'v'],
landing: ['landing', 'trang', 'url'],
currency: ['currency', 'account currency', 'don vi tien te', 'don vi tien te cua tai khoan', 'tien te'],
};
export function guessColumns(headers) { return matchColumns(headers, _o0); }
export function matchColumns(headers, aliases) {
const out = {}, used = new Set();
const _oj = headers.map(h => [h, strip(h).replace(/[_().]/g, ' ').replace(/\s+/g, ' ').trim()]);
const norm = _o2 => _o2.replace(/[_.]/g, ' ');
for (const [field, al] of Object.entries(aliases)) {
let _oi = null;
for (const _o2 of al) { _oi = _oj.find(([h, _o11]) => !used.has(h) && _o11 === norm(_o2)); if (_oi) break; }
if (!_oi) for (const _o2 of al) { if (_o2.length < 4) continue; _oi = _oj.find(([h, _o11]) => !used.has(h) && _o11.startsWith(norm(_o2) + ' ') && !/\b(per|moi|tren)\b|\/| id$/.test(_o11)); if (_oi) break; }
if (_oi) { out[field] = _oi[0]; used.add(_oi[0]); }
}
return out;
}
export function currencyCode(header) {
const _os = String(header || '').match(/[(\[]\s*([A-Za-z]{3}|VN[Đđ]|[₫đĐ])\s*[)\]]/i);
if (!_os) return '';
return /^(VN[Đđ]|[₫đĐ])$/i.test(_os[1]) ? 'VND' : _os[1].toUpperCase();
}
const _om = _o7 => /^(VND|VNĐ|₫|Đ)$/.test(_o7);
export const SPREAD_MAX_DAYS = 92;
export const SPREAD_MAX_ROWS = 1200;
function addDays(ymdStr, n) { return new Date(Date.parse(ymdStr + 'T00:00:00Z') + n * DAY).toISOString().slice(0, 10); }
export function spreadDays(r, dateTo, { lump = false } = {}) {
const to = parseDate(dateTo);
if (!to || !r.date || to <= r.date) return [r];
const n = Math.round((Date.parse(to) - Date.parse(r.date)) / DAY) + 1;
if (lump || n > SPREAD_MAX_DAYS) { const _ox = { ...r, date: to }; _ox.ext_id = extId(_ox); return [_ox]; }
const split = (v, _ok) => { const _o5 = Math.floor(v / n); return _ok === n - 1 ? v - _o5 * (n - 1) : _o5; };
const out = [];
for (let _ok = 0; _ok < n; _ok++) {
const x = { ...r, date: addDays(r.date, _ok), amount: split(r.amount, _ok), impressions: split(r.impressions, _ok), clicks: split(r.clicks, _ok), platform_leads: split(r.platform_leads, _ok) };
x.ext_id = extId(x);
if (x.amount > 0) out.push(x);
}
return out.length ? out : [r];
}
export function importSpendCsv(text, { columns, channel = '', fx = 0 } = {}) {
const { headers, items } = csvObjects(text, { isHeader: r => Object.keys(guessColumns(r)).length >= 2 });
const _o8 = columns || guessColumns(headers);
const _ou = _o8.amount && /micros/i.test(_o8.amount);
const _oh = _o8.amount ? currencyCode(_o8.amount) : '';
const _oz = Number(fx) > 0 ? Number(fx) : 0;
const rows = []; let skipped = 0, foreign = 0;
const _o14 = _on => { const _o2 = parseDate(_on[_o8.date]), _o4 = _o8.date_to ? parseDate(_on[_o8.date_to]) : ''; return _o2 && _o4 && _o4 > _o2 ? Math.min(SPREAD_MAX_DAYS, Math.round((Date.parse(_o4) - Date.parse(_o2)) / DAY) + 1) : 1; };
const lump = items.reduce((t, _on) => t + (_o8.date ? _o14(_on) : 1), 0) > SPREAD_MAX_ROWS;
for (const _on of items) {
const get = _oe => (_o8[_oe] ? _on[_o8[_oe]] : '');
if (isTotalLabel(get('campaign') || get('date'))) { skipped++; continue; }
const _o9 = String(get('currency') ?? '').trim().toUpperCase() || _oh;
const _oo = !_o9 || _om(_o9) ? 1 : _oz;
if (!_oo) { skipped++; foreign++; continue; }
const _o3 = (_ou ? parseAmount(get('amount')) / 1e6 : parseAmount(get('amount'))) * _oo;
const r = spendRow({ date: get('date'), channel: get('channel') || channel, campaign: get('campaign'), campaign_id: get('campaign_id'), ad_id: get('ad_id'),
amount: _o3, impressions: get('impressions'), clicks: get('clicks'), platform_leads: get('platform_leads'),
video: get('video'), landing: get('landing') }, 'csv');
if (validSpend(r)) rows.push(...spreadDays(r, get('date_to'), { lump })); else skipped++;
}
return { rows, skipped, foreign, lumped: lump, currency: _oh, columns: _o8, headers };
}
export function mergeSpend(existing, rows) {
const _o6 = new Map();
for (const _ow of existing || []) { const _oa = parseData(_ow.data); if (_oa.ext_id) _o6.set(_oa.ext_id, _ow); }
const add = [], update = [];
const _og = new Map();
const _o16 = (_o2, _o4) => { for (const _oo of ['amount', 'impressions', 'clicks', 'platform_leads']) _o2[_oo] = (Number(_o2[_oo]) || 0) + (Number(_o4[_oo]) || 0); };
for (const r of rows) {
const _od = _o6.get(r.ext_id);
if (_og.has(r.ext_id)) _o16(_og.get(r.ext_id), r);
else if (_od) { const _o17 = { id: _od.id, row: { ...r } }; update.push(_o17); _og.set(r.ext_id, _o17.row); }
else { const _o2 = { ...r }; add.push(_o2); _og.set(r.ext_id, _o2); }
}
return { add, update };
}
function _ol(dateStr, from, to) { return (!from || dateStr >= from) && (!to || dateStr <= to); }
function _oq(_o7) { return parseDate(Number(_o7.created_at) || Number(_o7.updated_at) || 0); }
export function commissionOf(_o7, ratePct = 0) {
const _oa = parseData(_o7.data);
const v = Number(_oa.commission);
if (Number.isFinite(v) && v > 0) return v;
const _o4 = Number(_o7.budget);
return ratePct > 0 && _o4 >= 1e8 && /mua|ban|bán/i.test(String(_o7.need || 'mua')) ? Math.round(_o4 * ratePct / 100) : 0;
}
function _or(_o2, dim) {
if (dim === 'channel') return _o2.channel;
if (dim === 'campaign') return _o2.utm_campaign ? keyOf(_o2.utm_campaign) : '';
if (dim === 'video') return _o2.v || '';
if (dim === 'landing') return _o2.page || '';
return '';
}
function _o15(r, dim) {
if (dim === 'channel') return r.channel;
if (dim === 'campaign') return keyOf(r.campaign) || r.campaign_id || '';
if (dim === 'video') return r.video || '';
if (dim === 'landing') return String(r.landing || '').replace(/^https?:\/\//, '').replace(/[?#].*$/, '').replace(/\/+$/, '');
return '';
}
export function report({ spends = [], customers = [], dim = 'channel', from = '', to = '', ratePct = 0 } = {}) {
const g = new Map();
const get = (key, label) => { if (!g.has(key)) g.set(key, { key, label: label || key, spend: 0, leads: 0, deals: 0, commission: 0, clicks: 0, impressions: 0 }); return g.get(key); };
const _ov = new Map();
for (const _ow of spends) {
if (Number(_ow.deleted)) continue;
const r = _ow.data && typeof _ow.data === 'object' ? _ow.data : parseData(_ow.data);
if (!r.date || !_ol(r.date, from, to)) continue;
const _oo = _o15(r, dim) || '(chưa gắn)';
if (dim === 'campaign' && r.campaign) _ov.set(_oo, r.campaign);
const x = get(_oo, dim === 'channel' ? channelName(_oo) : (dim === 'campaign' ? r.campaign : _oo));
x.spend += Number(r.amount) || 0; x.clicks += Number(r.clicks) || 0; x.impressions += Number(r.impressions) || 0;
}
for (const _o7 of customers) {
if (!isCustomer(_o7)) continue;
const _oc = _oq(_o7);
if (_oc && !_ol(_oc, from, to)) continue;
const _o2 = readAttribution(_o7);
const _oo = _or(_o2, dim) || '(chưa gắn)';
const x = get(_oo, dim === 'channel' ? channelName(_oo) : (dim === 'campaign' ? (_ov.get(_oo) || _o2.utm_campaign || _oo) : _oo));
x.leads++;
if (isDeal(_o7)) { x.deals++; x.commission += commissionOf(_o7, ratePct); }
}
const rows = [...g.values()].map(_of).sort((_o2, _o4) => _o4.spend - _o2.spend || _o4.leads - _o2.leads);
const sumRows = (list, key, label) => _of(list.reduce((t, r) => { t.spend += r.spend; t.leads += r.leads; t.deals += r.deals; t.commission += r.commission; t.clicks += r.clicks; t.impressions += r.impressions; return t; },
{ key, label, spend: 0, leads: 0, deals: 0, commission: 0, clicks: 0, impressions: 0 }));
const paid = sumRows(rows.filter(r => r.spend > 0), '_paid', 'Kênh có chi tiền');
const all = sumRows(rows, '_total', 'Tổng');
const total = { ...all, cpl: paid.cpl, cpa: paid.cpa, roi: paid.roi, paid_leads: paid.leads, paid_deals: paid.deals, paid_commission: paid.commission };
return { rows, total, paid, dim };
}
function _of(x) {
return { ...x, cpl: x.leads && x.spend > 0 ? Math.round(x.spend / x.leads) : null, cpa: x.deals && x.spend > 0 ? Math.round(x.spend / x.deals) : null,
roi: x.spend ? Math.round((x.commission - x.spend) / x.spend * 1000) / 10 : null, conv: x.leads ? Math.round(x.deals / x.leads * 1000) / 10 : null,
ctr: x.impressions ? Math.round(x.clicks / x.impressions * 10000) / 100 : null };
}
export function median(_o2) { const _o11 = _o2.filter(Number.isFinite).sort((x, y) => x - y); if (!_o11.length) return null; const _os = Math.floor(_o11.length / 2); return _o11.length % 2 ? _o11[_os] : (_o11[_os - 1] + _o11[_os]) / 2; }
export function outliers(rows, { factor = 2, minSpend = 500000 } = {}) {
const _o10 = rows.filter(r => r.key !== '(chưa gắn)' && r.spend > 0);
const _ot = median(_o10.filter(r => r.leads > 0).map(r => r.cpl));
const out = [];
for (const r of _o10) {
if (r.spend < minSpend) continue;
if (!r.leads && (!_ot || r.spend >= _ot)) out.push({ ...r, kind: 'no_leads', why: `Đã tiêu ${r.spend.toLocaleString('vi-VN')}đ chưa có khách nào` });
else if (_ot && _o10.filter(x => x.leads > 0).length >= 3 && r.cpl > _ot * factor) out.push({ ...r, kind: 'high_cpl', why: `Chi phí/khách ${r.cpl.toLocaleString('vi-VN')}đ, gấp ${(r.cpl / _ot).toFixed(1)} lần mức giữa (${Math.round(_ot).toLocaleString('vi-VN')}đ)` });
else if (r.deals && r.roi !== null && r.roi < 0) out.push({ ...r, kind: 'roi_negative', why: `Hoa hồng chưa bù chi phí (ROI ${r.roi}%)` });
}
return out;
}
export function alertLines(list, money) {
const _oe = money || (n => Math.round(n).toLocaleString('vi-VN') + 'đ');
return list.slice(0, 15).map(_ow => `${_ow.label}: ${_ow.why}. Tiêu ${_oe(_ow.spend)}, ${_ow.leads} khách, ${_ow.deals} chốt.`);
}
export function defaultRange(now = Date.now(), days = 30) { return { from: parseDate(now - (days - 1) * DAY), to: parseDate(now) }; }

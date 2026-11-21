import { strip, parseData } from '../_lib/crm.js';
import { csvObjects } from './csv.js';
import { parseAmount, parseDate, keyOf, matchColumns, isDeal, commissionOf, isCustomer, isTotalLabel, currencyCode } from './roi.js';
import { readAttribution, normChannel } from './attribution.js';
import { withRules } from '../../../shared/ai_rules.js';
export const MANUAL_FIELDS = {
leads: 'Số khách để lại số (lead)',
viewings: 'Số khách hẹn xem nhà/dự án',
deals: 'Số giao dịch chốt',
revenue: 'Doanh thu / hoa hồng thu về (đồng)',
other_cost: 'Chi phí khác cho quảng cáo này (đồng)',
};
const _o0 = {
ad_name: ['ad name', 'ten quang cao', 'ad', 'quang cao'],
adset: ['ad set name', 'ten nhom quang cao', 'nhom quang cao', 'ad group name', 'ad group', 'ten nhom'],
campaign: ['campaign name', 'ten chien dich', 'campaign', 'chien dich'],
ad_id: ['ad id', 'id quang cao', 'ma quang cao'],
adset_id: ['ad set id', 'id nhom quang cao', 'ad group id'],
campaign_id: ['campaign id', 'id chien dich', 'ma chien dich'],
amount: ['amount spent', 'so tien da chi tieu', 'so tien da chi', 'tien da chi tieu', 'spend', 'cost', 'chi phi', 'tong chi phi', 'amount', 'metrics cost micros'],
impressions: ['impressions', 'luot hien thi', 'hien thi'],
reach: ['reach', 'nguoi tiep can', 'luot tiep can', 'tiep can'],
clicks: ['link clicks', 'luot click vao lien ket', 'luot nhap vao lien ket', 'outbound clicks', 'luot click ra ngoai', 'clicks all', 'luot click tat ca', 'luot nhap tat ca', 'clicks', 'luot click', 'luot nhap', 'click'],
results: ['results', 'ket qua', 'leads', 'khach hang tiem nang', 'conversions', 'chuyen doi'],
result_type: ['result type', 'result indicator', 'loai ket qua', 'chi bao ket qua'],
date_from: ['reporting starts', 'bat dau bao cao', 'ngay bat dau bao cao', 'day', 'ngay', 'date', 'stat time day', 'segments date'],
date_to: ['reporting ends', 'ket thuc bao cao', 'ngay ket thuc bao cao'],
channel: ['platform', 'nen tang', 'kenh', 'channel'],
currency: ['currency', 'account currency', 'don vi tien te', 'don vi tien te cua tai khoan', 'tien te'],
};
export function guessAdColumns(headers) {
const _o5 = matchColumns(headers, _o0);
for (const _o8 of ['date_from', 'date_to']) {
const _oy = _o5[_o8] ? strip(_o5[_o8]) : '';
if (_oy && /(bat dau|ket thuc|start|end)/.test(_oy) && !/(bao cao|report)/.test(_oy)) delete _o5[_o8];
}
return _o5;
}
export { currencyCode };
export function currencyOf(header) {
return currencyCode(header) || (/micros/i.test(String(header || '')) ? '' : 'VND');
}
const _o3 = /^\d+([.,]\d+)?E\+?\d+$/i;
const _o1 = /^\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}/;
export function adKey(platform, _or) {
const _on = platform || 'other';
if (_or.ad_id) return _on + ':ad:' + _or.ad_id;
if (_or.ad_name) return _on + ':ad:' + [keyOf(_or.campaign), keyOf(_or.adset), keyOf(_or.ad_name)].join('|');
if (_or.adset_id) return _on + ':adset:' + _or.adset_id;
if (_or.adset) return _on + ':adset:' + [keyOf(_or.campaign), keyOf(_or.adset)].join('|');
if (_or.campaign_id) return _on + ':campaign:' + _or.campaign_id;
return _on + ':campaign:' + keyOf(_or.campaign);
}
export function parseAdsCsv(text, { channel = 'facebook', fx = 0, columns } = {}) {
const { headers, items } = csvObjects(text, { isHeader: _or => { const _o9 = guessAdColumns(_or); return !!_o9.amount && !!(_o9.ad_name || _o9.adset || _o9.campaign); } });
const _o5 = columns || guessAdColumns(headers);
const notes = [];
let currency = _o5.amount ? currencyCode(_o5.amount) : '';
if (!currency && _o5.currency) {
const _o12 = items.map(_od => String(_od[_o5.currency] ?? '').trim().toUpperCase()).find(x => /^[A-Z]{3}$/.test(x));
if (_o12) currency = _o12;
}
if (!currency) {
currency = _o5.amount && /micros/i.test(_o5.amount) ? '' : 'VND';
if (_o5.amount && currency) notes.push('Tệp không ghi đơn vị tiền ở tiêu đề cột chi phí – app coi là VND (đồng). Nếu tài khoản tính bằng USD, đổi tiêu đề thành "Amount spent (USD)" hoặc xuất lại.');
}
const _oj = _o5.amount && /micros/i.test(_o5.amount);
if (_o5.clicks && /\ball\b|tat ca/.test(strip(_o5.clicks).replace(/[()]/g, ' '))) notes.push('Cột lượt bấm lấy từ "' + _o5.clicks + '" (gồm cả bấm xem ảnh, thả tim…) nên tỷ lệ bấm có thể cao hơn thực tế. Nên thêm cột "Lượt click vào liên kết" (Link clicks) khi xuất.');
if (_o5.amount && !_o5.ad_id && !_o5.adset_id && !_o5.campaign_id) notes.push('Tệp không có cột ID – app nhận biết quảng cáo theo tên. Đổi tên quảng cáo trên Meta rồi nhập lại sẽ thành quảng cáo mới. Nên thêm cột "ID quảng cáo" (Ad ID) khi xuất.');
const _ov = currency && currency !== 'VND' ? Number(fx) || 0 : 1;
const byKey = new Map();
let skipped = 0, sciIds = 0;
const _ob = _o12 => { if (_o3.test(_o12)) { sciIds++; return ''; } return _o12.replace(/[^\w-]/g, '').slice(0, 40); };
for (const _od of items) {
const get = _o8 => (_o5[_o8] ? String(_od[_o5[_o8]] ?? '').trim() : '');
const _or = { ad_name: get('ad_name').slice(0, 160), adset: get('adset').slice(0, 160), campaign: get('campaign').slice(0, 160),
ad_id: _ob(get('ad_id')), adset_id: _ob(get('adset_id')), campaign_id: _ob(get('campaign_id')) };
const label = _or.ad_name || _or.adset || _or.campaign;
if (!label || isTotalLabel(label) || isTotalLabel(_or.campaign)) { skipped++; continue; }
const _ow = get('date_from'), rawTo = get('date_to');
if ((_ow && _o1.test(_ow) && !parseDate(_ow)) || (rawTo && _o1.test(rawTo) && !parseDate(rawTo))) { skipped++; continue; }
let spend = parseAmount(get('amount'));
if (_oj) spend /= 1e6;
spend = Math.round(spend * _ov);
const impressions = Math.round(parseAmount(get('impressions'))), clicks = Math.round(parseAmount(get('clicks'))), results = Math.round(parseAmount(get('results')));
if (!spend && !impressions && !clicks && !results) { skipped++; continue; }
const platform = normChannel(get('channel')) || normChannel(channel) || 'other';
const key = adKey(platform, _or);
const level = _or.ad_name || _or.ad_id ? 'ad' : (_or.adset || _or.adset_id ? 'adset' : 'campaign');
let a = byKey.get(key);
if (!a) {
a = { key, platform, level, name: label, campaign: _or.campaign, adset: _or.adset, ad_id: _or.ad_id, adset_id: _or.adset_id, campaign_id: _or.campaign_id,
spend: 0, impressions: 0, reach: 0, clicks: 0, results: 0, result_type: '', date_from: '', date_to: '', rows: 0 };
byKey.set(key, a);
}
a.spend += spend; a.impressions += impressions; a.clicks += clicks; a.results += results; a.rows++;
a.reach = Math.max(a.reach, Math.round(parseAmount(get('reach'))));
const _ox = get('result_type'); if (_ox && !a.result_type) a.result_type = _ox.slice(0, 80);
const _o6 = parseDate(get('date_from')), d2 = parseDate(get('date_to')) || _o6;
if (_o6 && (!a.date_from || _o6 < a.date_from)) a.date_from = _o6;
if (d2 && (!a.date_to || d2 > a.date_to)) a.date_to = d2;
}
if (sciIds) notes.push('Có ' + sciIds + ' ô ID bị Excel đổi thành dạng số mũ (VD 1.20212E+17) nên đã mất chữ số – app bỏ các ID đó và nhận biết quảng cáo theo tên. Lần sau tải thẳng CSV từ Meta, đừng mở rồi lưu lại bằng Excel; nếu phải dùng Excel thì đặt cột ID là dạng Văn bản (Text) trước khi lưu.');
return { ads: [...byKey.values()].sort((x, y) => y.spend - x.spend), skipped, columns: _o5, headers, currency, notes, needFx: !!(currency && currency !== 'VND' && !(Number(fx) > 0)) };
}
export function fromInsights(row, platform = 'facebook') {
const _or = { ad_name: String(row.ad_name || ''), adset: String(row.adset_name || ''), campaign: String(row.campaign_name || ''), ad_id: String(row.ad_id || ''), adset_id: String(row.adset_id || ''), campaign_id: String(row.campaign_id || '') };
const leads = (row.actions || []).filter(a => /lead/.test(String(a.action_type))).reduce((t, a) => t + (Number(a.value) || 0), 0);
return { key: adKey(platform, _or), platform, level: _or.ad_name || _or.ad_id ? 'ad' : _or.adset ? 'adset' : 'campaign', name: _or.ad_name || _or.adset || _or.campaign,
campaign: _or.campaign, adset: _or.adset, ad_id: _or.ad_id, adset_id: _or.adset_id, campaign_id: _or.campaign_id,
spend: Math.round(parseAmount(row.spend)), impressions: Math.round(parseAmount(row.impressions)), reach: Math.round(parseAmount(row.reach)), clicks: Math.round(parseAmount(row.inline_link_clicks ?? row.clicks)),
results: leads, result_type: leads ? 'lead' : '', date_from: parseDate(row.date_start), date_to: parseDate(row.date_stop || row.date_start), rows: 1 };
}
export function adView(o) {
const d = parseData(o && o.data);
return { ...d, id: o.id, raw: o, name: d.name || (o && o.name) || '', manual: d.manual && typeof d.manual === 'object' ? d.manual : {} };
}
export function mergeAds(existing, ads) {
const byKey = new Map();
for (const o of existing || []) { if (Number(o.deleted)) continue; const d = parseData(o.data); if (d.key) byKey.set(d.key, { o, d }); }
const add = [], update = [];
for (const a of ads) {
const { rows, ...clean } = a;
const ex = byKey.get(a.key);
if (ex) update.push({ id: ex.o.id, raw: ex.o, data: { ...ex.d, ...clean, manual: ex.d.manual || {}, source: 'csv' } });
else add.push({ ...clean, manual: {}, source: 'csv' });
}
return { add, update };
}
export function manualNum(_o12) {
if (_o12 === null || _o12 === undefined || String(_o12).trim() === '') return null;
const _ok = parseAmount(_o12);
return Number.isFinite(_ok) && _ok >= 0 ? Math.round(_ok) : null;
}
export function cleanManual(_og = {}) {
const _om = {};
for (const _oe of Object.keys(MANUAL_FIELDS)) _om[_oe] = manualNum(_og[_oe]);
_om.note = String(_og.note || '').trim().slice(0, 500);
return _om;
}
const _o2 = /lead|tiem nang|tin nhan|messag|conversation|tro chuyen|dang ky|registration|form/;
export function resultIsLead(resultType) { return _o2.test(strip(resultType || '')); }
export function resultLabel(resultType) {
const _oy = strip(resultType || '');
if (!_oy) return '';
if (/messag|conversation|tin nhan|tro chuyen/.test(_oy)) return 'tin nhắn';
if (/lead|tiem nang|form|dang ky|registration/.test(_oy)) return 'khách tiềm năng';
if (/link.?click|click/.test(_oy)) return 'lượt bấm';
if (/reach|tiep can/.test(_oy)) return 'người tiếp cận';
if (/video|thruplay/.test(_oy)) return 'lượt xem video';
return /^[a-z_.:]+$/.test(_oy) ? 'kết quả khác' : String(resultType).slice(0, 40);
}
const DAY = 86400000;
export function suggestFor(ad, customers, { ads = [], ratePct = 0 } = {}) {
const from = ad.date_from ? Date.parse(ad.date_from + 'T00:00:00+07:00') : 0;
const _o11 = ad.date_to ? Date.parse(ad.date_to + 'T23:59:59+07:00') + 7 * DAY : Infinity;
const _ol = keyOf(ad.name), campK = keyOf(ad.campaign);
const _oc = c => { const t = Number(c.created_at) || Number(c.updated_at) || 0; return !t || (t >= from && t <= _o11); };
const _op = (customers || []).filter(c => isCustomer(c) && _oc(c)).map(c => ({ c, a: readAttribution(c) }));
const _oz = a => !a.utm_source || a.channel === ad.platform || a.channel === 'other';
let _oa = [], match = '';
if (ad.level === 'ad') {
_oa = _op.filter(({ a }) => _oz(a) && a.utm_content && ((_ol && keyOf(a.utm_content) === _ol) || (ad.ad_id && a.utm_content === ad.ad_id)));
if (_oa.length) match = 'ad';
}
let shared = 1;
if (!match && (campK || ad.campaign_id)) {
_oa = _op.filter(({ a }) => _oz(a) && a.utm_campaign && ((campK && keyOf(a.utm_campaign) === campK) || (ad.campaign_id && a.utm_campaign === ad.campaign_id)));
if (_oa.length) {
match = 'campaign';
shared = Math.max(1, (ads || []).filter(x => x.platform === ad.platform && ((campK && keyOf(x.campaign) === campK) || (ad.campaign_id && x.campaign_id === ad.campaign_id))).length);
}
}
const deals = _oa.filter(({ c }) => isDeal(c));
return { leads: _oa.length, deals: deals.length, revenue: deals.reduce((t, { c }) => t + commissionOf(c, ratePct), 0), match, shared, ids: _oa.map(({ c }) => c.id) };
}
export function effective(ad, sugg) {
const _og = ad.manual || {};
const _oy = sugg && (sugg.match === 'ad' || (sugg.match === 'campaign' && sugg.shared === 1)) ? sugg : null;
const _oo = (_oe, sv) => (_og[_oe] !== null && _og[_oe] !== undefined && _og[_oe] !== '' ? [Number(_og[_oe]), 'manual'] : (_oy && sv ? [sv, 'app'] : [null, '']));
let [leads, srcL] = _oo('leads', _oy && _oy.leads);
if (leads === null && resultIsLead(ad.result_type) && Number.isFinite(Number(ad.results))) { leads = Number(ad.results) || 0; srcL = 'platform'; }
const [deals, srcD] = _oo('deals', _oy && _oy.deals);
const [revenue, srcR] = _oo('revenue', _oy && _oy.revenue);
const num = _oe => (_og[_oe] !== null && _og[_oe] !== undefined && _og[_oe] !== '' ? Number(_og[_oe]) : null);
return { leads, viewings: num('viewings'), deals, revenue, other_cost: num('other_cost') || 0, src: { leads: srcL, deals: srcD, revenue: srcR } };
}
const _o7 = (a, b) => (b > 0 && a !== null && a !== undefined ? a / b : null);
const _os = _o12 => (_o12 === null ? null : Math.round(_o12));
const _ot = _o12 => (_o12 === null ? null : Math.round(_o12 * 10) / 10);
const _ou = _o12 => (_o12 === null ? null : Math.round(_o12 * 100) / 100);
export function metrics(x) {
const cost = (Number(x.spend) || 0) + (Number(x.other_cost) || 0);
return {
cost,
cpl: _os(x.leads ? _o7(cost, x.leads) : null),
cpv: _os(x.viewings ? _o7(cost, x.viewings) : null),
cpd: _os(x.deals ? _o7(cost, x.deals) : null),
roi: cost > 0 && x.revenue !== null && x.revenue !== undefined ? _ot((x.revenue - cost) / cost * 100) : null,
ctr: x.impressions ? _ou(x.clicks / x.impressions * 100) : null,
cpc: x.clicks ? _os(_o7(Number(x.spend) || 0, x.clicks)) : null,
cpm: x.impressions ? _os((Number(x.spend) || 0) / x.impressions * 1000) : null,
lead_rate: x.clicks && x.leads !== null ? _ot(x.leads / x.clicks * 100) : null,
deal_rate: x.leads && x.deals !== null ? _ot(x.deals / x.leads * 100) : null,
};
}
function median(a) { const _oy = a.filter(_o12 => _o12 !== null && Number.isFinite(_o12)).sort((x, y) => x - y); if (!_oy.length) return null; const _og = Math.floor(_oy.length / 2); return _oy.length % 2 ? _oy[_og] : (_oy[_og - 1] + _oy[_og]) / 2; }
const _o13 = _ok => Math.round(Number(_ok) || 0).toLocaleString('vi-VN') + 'đ';
export function analyze(items, { money = _o13, minSpend = 300000 } = {}) {
const rows = items.map(({ ad, eff }) => {
const x = { key: ad.key, id: ad.id, name: ad.name, campaign: ad.campaign, platform: ad.platform, spend: Number(ad.spend) || 0, impressions: Number(ad.impressions) || 0, clicks: Number(ad.clicks) || 0,
leads: eff.leads, viewings: eff.viewings, deals: eff.deals, revenue: eff.revenue, other_cost: eff.other_cost || 0, src: eff.src };
return { ...x, ...metrics(x) };
});
const _o10 = _oe => rows.reduce((t, _or) => t + (Number(_or[_oe]) || 0), 0);
const has = _oe => rows.some(_or => _or[_oe] !== null && _or[_oe] !== undefined);
const tot = { key: '_total', name: 'Tổng', spend: _o10('spend'), impressions: _o10('impressions'), clicks: _o10('clicks'), other_cost: _o10('other_cost'),
leads: has('leads') ? _o10('leads') : null, viewings: has('viewings') ? _o10('viewings') : null, deals: has('deals') ? _o10('deals') : null, revenue: has('revenue') ? _o10('revenue') : null };
const total = { ...tot, ...metrics(tot) };
const insights = [];
const push = (kind, tone, text) => insights.push({ kind, tone, text });
if (!rows.length) return { rows, total, insights };
const withLeads = rows.filter(_or => _or.leads > 0);
if (withLeads.length >= 2) {
const _oy = [...withLeads].sort((a, b) => a.cpl - b.cpl);
const _o4 = _oy[0], worst = _oy[_oy.length - 1];
push('best_cpl', 'ok', `Rẻ nhất: "${_o4.name}" – ${money(_o4.cpl)}/khách (${_o4.leads} khách).`);
if (worst.cpl >= _o4.cpl * 1.5) push('worst_cpl', 'warn', `Đắt nhất: "${worst.name}" – ${money(worst.cpl)}/khách, gấp ${(worst.cpl / _o4.cpl).toFixed(1)} lần quảng cáo rẻ nhất. Cân nhắc chuyển bớt ngân sách sang "${_o4.name}".`);
}
for (const _or of rows) {
if (_or.spend >= minSpend && _or.leads === 0) push('no_leads', 'fail', `"${_or.name}" đã tiêu ${money(_or.spend)} mà chưa có khách nào – nên tạm dừng hoặc đổi nội dung/đối tượng.`);
}
const _oh = median(rows.filter(_or => _or.impressions >= 1000).map(_or => _or.ctr));
if (_oh) for (const _or of rows) if (_or.impressions >= 1000 && _or.ctr !== null && _or.ctr < _oh / 2) push('low_ctr', 'warn', `"${_or.name}" ít người bấm (tỷ lệ bấm ${_or.ctr}%, các quảng cáo khác khoảng ${_ou(_oh)}%) – thử đổi ảnh/video đầu hoặc câu tiêu đề.`);
const _oi = median(rows.filter(_or => _or.clicks >= 50 && _or.lead_rate !== null).map(_or => _or.lead_rate));
if (_oi) for (const _or of rows) if (_or.clicks >= 50 && _or.leads > 0 && _or.lead_rate !== null && _or.lead_rate < _oi / 2) push('low_lead_rate', 'warn', `"${_or.name}" có ${_or.clicks} lượt bấm nhưng ít khách để lại số (${_or.lead_rate}%) – trang đích hoặc form có thể chưa thuyết phục, chưa khớp nội dung quảng cáo.`);
for (const _or of rows) if (_or.deals > 0 && _or.roi !== null && _or.roi < 0) push('roi_negative', 'warn', `"${_or.name}" có ${_or.deals} giao dịch nhưng doanh thu/hoa hồng chưa bù chi phí (ROI ${_or.roi}%).`);
const _oq = rows.filter(_or => _or.roi !== null && _or.roi > 0).sort((a, b) => b.roi - a.roi)[0];
if (_oq) push('best_roi', 'ok', `Có lãi tốt nhất: "${_oq.name}" – ROI ${_oq.roi}% (thu ${money(_oq.revenue)} trên ${money(_oq.cost)}).`);
if (total.leads === null) push('need_leads', 'manual', 'Chưa có số lead – bấm "Sửa số liệu" ở từng quảng cáo để nhập, hoặc gắn link có utm_content = tên quảng cáo để app tự đếm.');
else if (total.deals === null || total.revenue === null) push('need_deals', 'manual', 'Chưa nhập số giao dịch hoặc doanh thu/hoa hồng – nhập để biết quảng cáo nào thực sự ra tiền (ROI).');
if (total.leads > 0 && total.viewings === null) push('need_viewings', 'manual', 'Nhập thêm số khách hẹn xem để biết quảng cáo nào ra khách thật, không chỉ khách để lại số.');
return { rows, total, insights };
}
export function aiPrompt(an) {
const _of = an.rows.slice(0, 30).map(_or => `- ${_or.name} (${_or.campaign || 'không rõ chiến dịch'}): chi ${_or.cost}đ, hiển thị ${_or.impressions}, bấm ${_or.clicks}, lead ${_or.leads ?? '?'}, hẹn xem ${_or.viewings ?? '?'}, giao dịch ${_or.deals ?? '?'}, doanh thu ${_or.revenue ?? '?'}đ, CPL ${_or.cpl ?? '?'}, ROI ${_or.roi ?? '?'}%`);
return withRules('Anh/chị là chuyên gia quảng cáo bất động sản tại Việt Nam. Dưới đây là số liệu các quảng cáo của một môi giới. ' +
'Nhận xét ngắn gọn bằng tiếng Việt (tối đa 8 gạch đầu dòng): quảng cáo nào nên giữ/tăng ngân sách, nên dừng, nên sửa gì; không bịa số liệu ngoài bảng; không hứa kết quả.\n' + _of.join('\n'));
}

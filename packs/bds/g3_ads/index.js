import { g3kit, h, selftestG3, mktConfig } from '../g3_lib/ui.js';
import * as AD from '../g3_lib/ads.js';
import * as RO from '../g3_lib/roi.js';
import { adLink, channelName } from '../g3_lib/attribution.js';
import * as B from '../g3_lib/bridge.js';
import { spendForm, reportTable } from '../g3_roi/index.js';
export async function mount(el, ctx) {
const G = g3kit(ctx), K = G.K;
el.innerHTML = '';
const _ol = h('div', { class: 'g3', 'data-testid': 'g3-ads' });
el.appendChild(_ol);
const _om = { tab: 'copy', platform: 'facebook', pid: '', usp: '', offer: '', audience: '', base: '', campaign: '', video: '', out: null };
async function _og() {
_ol.innerHTML = '';
_ol.appendChild(G.head('Hỗ trợ quảng cáo', 'Soạn mẫu đúng độ dài từng nền tảng, link gắn mã để đo, kế hoạch ngân sách và chi phí mỗi khách. Anh/chị tự bấm chạy quảng cáo.'));
_ol.appendChild(G.tabs([['copy', 'Soạn mẫu'], ['budget', 'Kế hoạch ngân sách'], ['cpl', 'Chi phí mỗi khách']], _om.tab, k => { _om.tab = k; _og(); }, 'ads-tab'));
const _o3 = h('div', { class: 'g3' });
_ol.appendChild(_o3);
if (_om.tab === 'copy') _oi(_o3);
else if (_om.tab === 'budget') await _oh(_o3);
else await _oj(_o3);
}
function _oi(_o3) {
const _od = K.select(Object.entries(AD.PLATFORMS).map(([k, v]) => [k, v.name]), _om.platform, { 'data-testid': 'ads-platform' });
const _oe = K.select([['', '– Chọn dự án –'], ...K.projects().map(_ob => [_ob.id, _ob.name])], _om.pid, { 'data-testid': 'ads-project' });
const usp = G.area({ rows: 3, 'data-testid': 'ads-usp', placeholder: 'Điểm mạnh, mỗi dòng 1 ý (VD: Cách hồ Hoàn Kiếm 15 phút)' }); usp.value = _om.usp;
const offer = G.input({ value: _om.offer, 'data-testid': 'ads-offer', placeholder: 'Ưu đãi đang có (đúng chính sách)' });
const _o2 = G.input({ value: _om.audience, 'data-testid': 'ads-audience', placeholder: 'Khách hướng tới (VD: gia đình trẻ mua ở)' });
const _oc = []; try { for (const _o5 of B.landingPages(ctx)) { const _oo = B.pageUrl(_o5, G.endpoint()); if (_oo) _oc.push([_oo, _o5.name || _o5.slug]); } } catch { }
const base = G.input({ value: _om.base || (_oc[0] ? _oc[0][0] : ''), inputmode: 'url', 'data-testid': 'ads-base', placeholder: 'https://… trang landing' });
const _o7 = G.input({ value: _om.campaign, 'data-testid': 'ads-campaign', placeholder: 'Tên chiến dịch (VD: lakeside-t11)' });
const _op = G.input({ value: _om.video, 'data-testid': 'ads-video', placeholder: 'Mã video (tuỳ chọn)' });
const out = h('div', { class: 'g3', 'data-testid': 'ads-out' });
const gen = () => {
Object.assign(_om, { platform: _od.value, pid: _oe.value, usp: usp.value, offer: offer.value, audience: _o2.value, base: base.value.trim(), campaign: _o7.value.trim(), video: _op.value.trim() });
const _ob = K.project(_om.pid);
if (!_ob) return K.toast('Chọn dự án', 'warn');
const x = AD.adInputs(_ob, { usp: _om.usp.split(/\r?\n/), offer: _om.offer, audience: _om.audience });
const _ok = AD.generateCopy(_om.platform, x);
const link = _om.base ? adLink(_om.base, { platform: _om.platform, campaign: _om.campaign || _ob.name, video: _om.video }) : '';
out.innerHTML = '';
for (const [f, items] of Object.entries(_ok.fields)) {
out.appendChild(h('h4', null, AD.FIELD_NAMES[f] + ' (tối đa ' + _ok.fields[f][0]?.max + ' ký tự)'));
items.forEach((it, i) => out.appendChild(h('div', { class: 'g3-item', 'data-testid': 'ads-line', 'data-over': it.over ? '1' : '0' },
h('div', { class: 'g3-row' }, h('span', { style: 'flex:1;min-width:0' }, it.text), h('span', { class: it.over ? 'g3-fail' : 'g3-sub' }, it.len + '/' + it.max)),
it.risks.map(_of => h('small', { class: 'g3-warn' }, '⚠️ ' + _of)),
K.button('Chép', () => G.copy(it.text), { testid: 'ads-copy-' + f + '-' + i }))));
}
const _o9 = G.area({ rows: 2, placeholder: 'Tự viết thêm – app kiểm câu chữ rủi ro', 'data-testid': 'ads-own' });
const _oa = h('div');
_o9.addEventListener('input', () => { _oa.innerHTML = ''; AD.checkCopy(_o9.value).forEach(_of => _oa.appendChild(h('small', { class: 'g3-warn', style: 'display:block' }, '⚠️ ' + _of))); });
out.appendChild(G.field('Câu của anh/chị', _o9)); out.appendChild(_oa);
if (link) out.appendChild(h('div', { class: 'g3-item' }, h('strong', null, 'Link đích đã gắn mã đo'), h('span', { class: 'g3-code', 'data-testid': 'ads-link' }, link), K.button('Chép link', () => G.copy(link), { testid: 'ads-copy-link' })));
else out.appendChild(G.note('Nhập link trang để có link gắn mã đo (utm) – khách để lại số sẽ được đếm vào đúng chiến dịch ở "Đo hiệu quả tiền marketing".'));
const _o4 = AD.creativeBrief(_om.platform, x, { link });
out.appendChild(h('div', { class: 'g3-item' }, h('strong', null, 'Bản yêu cầu thiết kế / quay'), h('pre', { class: 'g3-pre', 'data-testid': 'ads-brief' }, _o4), K.button('Chép bản yêu cầu', () => G.copy(_o4), { testid: 'ads-copy-brief' })));
out.appendChild(h('p', { class: 'g3-sub' }, 'Độ dài theo hướng dẫn chính thức: ', h('span', { class: 'g3-code' }, _ok.src), '. Khi Facebook yêu cầu, chọn đúng "Danh mục quảng cáo đặc biệt" cho nhà ở.'));
const _o0 = K.button('AI viết thêm 3 mẫu', async () => {
try {
const prompt = `Viết 3 mẫu quảng cáo ${AD.PLATFORMS[_om.platform].name} tiếng Việt cho dự án ${_ob.name} (${x.loc}). Điểm mạnh: ${x.usp.join('; ') || x.types}. ${x.offer ? 'Ưu đãi: ' + x.offer + '.' : ''} ` +
`Giới hạn: ${Object.entries(AD.PLATFORMS[_om.platform].fields).map(([f, n]) => AD.FIELD_NAMES[f] + ' ≤ ' + n + ' ký tự').join(', ')}. Không dùng "nhất", "số 1", không hứa lợi nhuận, giá ghi "tham khảo".`;
const _of = await ctx.ai.run('script', { prompt, feature: 'ads_ai' });
const _on = String(_of && _of.text || '').trim();
if (!_on) return;
out.appendChild(h('div', { class: 'g3-item', 'data-testid': 'ads-ai' }, h('strong', null, 'AI gợi ý'), h('pre', { class: 'g3-pre' }, _on), AD.checkCopy(_on).map(w => h('small', { class: 'g3-warn' }, '⚠️ ' + w))));
} catch (e) { if (!K.isAiCancel(e)) K.toast('AI lỗi: ' + (e && e.message || e), 'warn'); }
}, { ai: 'ads_ai', testid: 'ads-ai-btn' });
out.appendChild(_o0);
};
_o3.appendChild(K.card({ title: 'Thông tin quảng cáo', testid: 'ads-form', body: [h('div', { class: 'g3-two' }, G.field('Nền tảng', _od), G.field('Dự án', _oe)), G.field('Điểm mạnh', usp),
h('div', { class: 'g3-two' }, G.field('Ưu đãi', offer), G.field('Khách hướng tới', _o2)), G.field('Link trang landing', base),
h('div', { class: 'g3-two' }, G.field('Chiến dịch', _o7), G.field('Mã video', _op)), K.button('Soạn mẫu', gen, { kind: 'primary', testid: 'ads-gen' })] }));
_o3.appendChild(out);
if (_om.pid) gen();
}
async function _oh(_o3) {
const [spends, customers, cfg] = await Promise.all([G.objs('g3_spend'), G.customers(), mktConfig(G)]);
const hist = RO.report({ spends, customers, dim: 'channel', ...RO.defaultRange(Date.now(), 90), ratePct: Number(cfg.rate_pct) || 0 });
const _o1 = hist.total.conv;
const mode = K.select([['target', 'Muốn chốt bao nhiêu căn → cần bao nhiêu tiền'], ['budget', 'Có bao nhiêu tiền → được bao nhiêu khách']], 'target', { 'data-testid': 'bp-mode' });
const deals = G.input({ value: '2', inputmode: 'numeric', 'data-testid': 'bp-deals' });
const budget = G.input({ value: '', inputmode: 'numeric', 'data-testid': 'bp-budget', placeholder: 'VD 30000000' });
const conv = G.input({ value: _o1 ? String(_o1) : '', inputmode: 'decimal', 'data-testid': 'bp-conv', placeholder: 'VD 2' });
const comm = G.input({ value: '', inputmode: 'numeric', 'data-testid': 'bp-comm', placeholder: 'Hoa hồng trung bình 1 căn (đồng)' });
const rows = ['facebook', 'tiktok', 'google', 'zalo'].map(k => {
const _o8 = hist.rows.find(_of => _of.key === k);
return { key: k, share: G.input({ value: k === 'facebook' ? '60' : k === 'tiktok' ? '40' : '0', inputmode: 'decimal', 'data-testid': 'bp-share-' + k }),
cpl: G.input({ value: _o8 && _o8.cpl ? String(_o8.cpl) : '', inputmode: 'numeric', 'data-testid': 'bp-cpl-' + k, placeholder: 'Chi phí/khách' }), hist: _o8 && _o8.cpl };
});
const out = h('div', { 'data-testid': 'bp-out' });
const _o6 = () => {
const _of = AD.budgetPlan({ mode: mode.value, deals: Number(deals.value) || 0, budget: RO.parseAmount(budget.value), conv: Number(String(conv.value).replace(',', '.')) || 0,
commission: RO.parseAmount(comm.value), channels: rows.map(x => ({ key: x.key, share: Number(x.share.value) || 0, cpl: RO.parseAmount(x.cpl.value) })) });
out.innerHTML = '';
if (!_of.ok) { out.appendChild(h('p', { class: 'g3-warn' }, _of.reason)); return; }
out.appendChild(h('div', { class: 'g3-grid' }, G.kpi('ngân sách', G.vnd(_of.total), 'bp-total'), G.kpi('khách dự kiến', String(_of.leads), 'bp-leads'), G.kpi('căn chốt dự kiến', String(_of.deals), 'bp-exp-deals'),
G.kpi('chi phí/căn chốt', _of.cpa ? G.vnd(_of.cpa) : '–'), G.kpi('ROI dự kiến', _of.roi === null ? '–' : _of.roi + '%')));
out.appendChild(h('table', { class: 'g3-tbl' }, h('tbody', null, _of.rows.map(x => h('tr', null, h('td', null, channelName(x.key)), h('td', { class: 'n' }, x.share + '%'), h('td', { class: 'n' }, G.vnd(x.money)), h('td', { class: 'n' }, x.leads + ' khách'))))));
out.appendChild(h('p', { class: 'g3-sub' }, 'Đây là ước tính từ số anh/chị nhập; quảng cáo thật dao động theo mùa, nội dung, giá thầu. Chạy thử 3–5 ngày rồi chỉnh theo số liệu ở tab "Chi phí mỗi khách".'));
};
[mode, deals, budget, conv, comm, ...rows.flatMap(x => [x.share, x.cpl])].forEach(i => i.addEventListener('input', _o6));
mode.addEventListener('change', _o6);
_o3.appendChild(K.card({ title: 'Kế hoạch ngân sách', testid: 'bp-form', body: [G.field('Cách tính', mode), h('div', { class: 'g3-two' }, G.field('Số căn muốn chốt', deals), G.field('Hoặc ngân sách (đồng)', budget)),
h('div', { class: 'g3-two' }, G.field('Tỷ lệ khách → chốt (%)', conv, _o1 ? 'Số liệu 90 ngày của anh/chị: ' + _o1 + '%' : 'Chưa có số liệu – nhập theo kinh nghiệm'), G.field('Hoa hồng 1 căn', comm)),
h('table', { class: 'g3-tbl' }, h('thead', null, h('tr', null, h('th', null, 'Kênh'), h('th', null, 'Tỷ lệ tiền (%)'), h('th', null, 'Chi phí/khách (đồng)'))),
h('tbody', null, rows.map(x => h('tr', null, h('td', null, channelName(x.key), x.hist ? h('div', { class: 'g3-sub' }, 'thực tế 90 ngày: ' + G.vnd(x.hist)) : null), h('td', null, x.share), h('td', null, x.cpl)))))] }));
_o3.appendChild(out);
_o6();
}
async function _oj(_o3) {
const [spends, customers] = await Promise.all([G.objs('g3_spend'), G.customers()]);
const rep = RO.report({ spends, customers, dim: 'campaign', ...RO.defaultRange(Date.now(), 30) });
_o3.appendChild(K.card({ title: 'Chi phí mỗi khách theo chiến dịch (30 ngày)', testid: 'ads-cpl', body: [reportTable(G, rep, 'ads-cpl-table'),
h('p', { class: 'g3-sub' }, 'Đặt tên chiến dịch ở đây trùng với utm_campaign trên link quảng cáo để app ghép đúng khách. Báo cáo đầy đủ: "Đo hiệu quả tiền marketing".')] }));
_o3.appendChild(spendForm(G, ctx, _og));
}
await _og();
}
export default {
manifest: { id: 'g3_ads', title: 'Hỗ trợ quảng cáo', icon: '📣', screen: 'customers', order: 151, version: '0.1.0', status: 'ready',
help: 'Soạn mẫu quảng cáo Facebook/TikTok/Google/Zalo đúng độ dài, cảnh báo câu chữ rủi ro, link gắn mã đo, bản yêu cầu thiết kế, kế hoạch ngân sách, chi phí mỗi khách. Anh/chị tự bấm chạy quảng cáo.' },
mount,
async selftest(ctx) {
const _ok = AD.generateCopy('google', AD.adInputs({ name: 'Dự án Mẫu Rất Dài Tên Để Thử Cắt', area: 'Quận 9', types: [{ n: '2N' }] }));
if (!_ok || _ok.fields.headline.some(x => x.over) || !AD.checkCopy('Dự án tốt nhất').length) return { ok: false, details: 'Soạn mẫu quảng cáo sai' };
return selftestG3(ctx);
},
};

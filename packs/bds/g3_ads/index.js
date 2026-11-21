import { g3kit, h, selftestG3, mktConfig } from '../g3_lib/ui.js';
import * as AD from '../g3_lib/ads.js';
import * as RO from '../g3_lib/roi.js';
import { adLink, channelName } from '../g3_lib/attribution.js';
import * as B from '../g3_lib/bridge.js';
import { spendForm, reportTable } from '../g3_roi/index.js';
export async function mount(el, ctx) {
const G = g3kit(ctx), K = G.K;
el.innerHTML = '';
const _ok = h('div', { class: 'g3', 'data-testid': 'g3-ads' });
el.appendChild(_ok);
const _ol = { tab: 'copy', platform: 'facebook', pid: '', usp: '', offer: '', audience: '', base: '', campaign: '', video: '', out: null };
async function _of() {
_ok.innerHTML = '';
_ok.appendChild(G.head('Hỗ trợ quảng cáo', 'Soạn mẫu đúng độ dài từng nền tảng, link gắn mã để đo, kế hoạch ngân sách và chi phí mỗi khách. Anh/chị tự bấm chạy quảng cáo.'));
_ok.appendChild(G.tabs([['copy', 'Soạn mẫu'], ['budget', 'Kế hoạch ngân sách'], ['cpl', 'Chi phí mỗi khách']], _ol.tab, k => { _ol.tab = k; _of(); }, 'ads-tab'));
const box = h('div', { class: 'g3' });
_ok.appendChild(box);
if (_ol.tab === 'copy') _oh(box);
else if (_ol.tab === 'budget') await _og(box);
else await _oi(box);
}
function _oh(box) {
const _oc = K.select(Object.entries(AD.PLATFORMS).map(([k, v]) => [k, v.name]), _ol.platform, { 'data-testid': 'ads-platform' });
const _od = K.select([['', '– Chọn dự án –'], ...K.projects().map(_oa => [_oa.id, _oa.name])], _ol.pid, { 'data-testid': 'ads-project' });
const usp = G.area({ rows: 3, 'data-testid': 'ads-usp', placeholder: 'Điểm mạnh, mỗi dòng 1 ý (VD: Cách hồ Hoàn Kiếm 15 phút)' }); usp.value = _ol.usp;
const offer = G.input({ value: _ol.offer, 'data-testid': 'ads-offer', placeholder: 'Ưu đãi đang có (đúng chính sách)' });
const _o2 = G.input({ value: _ol.audience, 'data-testid': 'ads-audience', placeholder: 'Khách hướng tới (VD: gia đình trẻ mua ở)' });
const _ob = []; try { for (const _o4 of B.landingPages(ctx)) { const _on = B.pageUrl(_o4, G.endpoint()); if (_on) _ob.push([_on, _o4.name || _o4.slug]); } } catch { }
const base = G.input({ value: _ol.base || (_ob[0] ? _ob[0][0] : ''), inputmode: 'url', 'data-testid': 'ads-base', placeholder: 'https://… trang landing' });
const _o6 = G.input({ value: _ol.campaign, 'data-testid': 'ads-campaign', placeholder: 'Tên chiến dịch (VD: lakeside-t11)' });
const _oo = G.input({ value: _ol.video, 'data-testid': 'ads-video', placeholder: 'Mã video (tuỳ chọn)' });
const out = h('div', { class: 'g3', 'data-testid': 'ads-out' });
const gen = () => {
Object.assign(_ol, { platform: _oc.value, pid: _od.value, usp: usp.value, offer: offer.value, audience: _o2.value, base: base.value.trim(), campaign: _o6.value.trim(), video: _oo.value.trim() });
const _oa = K.project(_ol.pid);
if (!_oa) return K.toast('Chọn dự án', 'warn');
const x = AD.adInputs(_oa, { usp: _ol.usp.split(/\r?\n/), offer: _ol.offer, audience: _ol.audience });
const _oj = AD.generateCopy(_ol.platform, x);
const link = _ol.base ? adLink(_ol.base, { platform: _ol.platform, campaign: _ol.campaign || _oa.name, video: _ol.video }) : '';
out.innerHTML = '';
for (const [f, items] of Object.entries(_oj.fields)) {
out.appendChild(h('h4', null, AD.FIELD_NAMES[f] + ' (tối đa ' + _oj.fields[f][0]?.max + ' ký tự)'));
items.forEach((it, i) => out.appendChild(h('div', { class: 'g3-item', 'data-testid': 'ads-line', 'data-over': it.over ? '1' : '0' },
h('div', { class: 'g3-row' }, h('span', { style: 'flex:1;min-width:0' }, it.text), h('span', { class: it.over ? 'g3-fail' : 'g3-sub' }, it.len + '/' + it.max)),
it.risks.map(_oe => h('small', { class: 'g3-warn' }, '⚠️ ' + _oe)),
K.button('Chép', () => G.copy(it.text), { testid: 'ads-copy-' + f + '-' + i }))));
}
const _o8 = G.area({ rows: 2, placeholder: 'Tự viết thêm – app kiểm câu chữ rủi ro', 'data-testid': 'ads-own' });
const _o9 = h('div');
_o8.addEventListener('input', () => { _o9.innerHTML = ''; AD.checkCopy(_o8.value).forEach(_oe => _o9.appendChild(h('small', { class: 'g3-warn', style: 'display:block' }, '⚠️ ' + _oe))); });
out.appendChild(G.field('Câu của anh/chị', _o8)); out.appendChild(_o9);
if (link) out.appendChild(h('div', { class: 'g3-item' }, h('strong', null, 'Link đích đã gắn mã đo'), h('span', { class: 'g3-code', 'data-testid': 'ads-link' }, link), K.button('Chép link', () => G.copy(link), { testid: 'ads-copy-link' })));
else out.appendChild(G.note('Nhập link trang để có link gắn mã đo (utm) – khách để lại số sẽ được đếm vào đúng chiến dịch ở "Đo hiệu quả tiền marketing".'));
const _o3 = AD.creativeBrief(_ol.platform, x, { link });
out.appendChild(h('div', { class: 'g3-item' }, h('strong', null, 'Bản yêu cầu thiết kế / quay'), h('pre', { class: 'g3-pre', 'data-testid': 'ads-brief' }, _o3), K.button('Chép bản yêu cầu', () => G.copy(_o3), { testid: 'ads-copy-brief' })));
out.appendChild(h('p', { class: 'g3-sub' }, 'Độ dài theo hướng dẫn chính thức: ', h('span', { class: 'g3-code' }, _oj.src), '. Khi Facebook yêu cầu, chọn đúng "Danh mục quảng cáo đặc biệt" cho nhà ở.'));
const _o0 = K.button('AI viết thêm 3 mẫu', async () => {
try {
const prompt = `Viết 3 mẫu quảng cáo ${AD.PLATFORMS[_ol.platform].name} tiếng Việt cho dự án ${_oa.name} (${x.loc}). Điểm mạnh: ${x.usp.join('; ') || x.types}. ${x.offer ? 'Ưu đãi: ' + x.offer + '.' : ''} ` +
`Giới hạn: ${Object.entries(AD.PLATFORMS[_ol.platform].fields).map(([f, n]) => AD.FIELD_NAMES[f] + ' ≤ ' + n + ' ký tự').join(', ')}. Không dùng "nhất", "số 1", không hứa lợi nhuận, giá ghi "tham khảo".`;
const _oe = await ctx.ai.run('script', { prompt, feature: 'ads_ai' });
const _om = String(_oe && _oe.text || '').trim();
if (!_om) return;
out.appendChild(h('div', { class: 'g3-item', 'data-testid': 'ads-ai' }, h('strong', null, 'AI gợi ý'), h('pre', { class: 'g3-pre' }, _om), AD.checkCopy(_om).map(w => h('small', { class: 'g3-warn' }, '⚠️ ' + w))));
} catch (e) { if (!K.isAiCancel(e)) K.toast('AI lỗi: ' + (e && e.message || e), 'warn'); }
}, { ai: 'ads_ai', testid: 'ads-ai-btn' });
out.appendChild(_o0);
};
box.appendChild(K.card({ title: 'Thông tin quảng cáo', testid: 'ads-form', body: [h('div', { class: 'g3-two' }, G.field('Nền tảng', _oc), G.field('Dự án', _od)), G.field('Điểm mạnh', usp),
h('div', { class: 'g3-two' }, G.field('Ưu đãi', offer), G.field('Khách hướng tới', _o2)), G.field('Link trang landing', base),
h('div', { class: 'g3-two' }, G.field('Chiến dịch', _o6), G.field('Mã video', _oo)), K.button('Soạn mẫu', gen, { kind: 'primary', testid: 'ads-gen' })] }));
box.appendChild(out);
if (_ol.pid) gen();
}
async function _og(box) {
const [spends, customers, cfg] = await Promise.all([G.objs('g3_spend'), G.customers(), mktConfig(G)]);
const hist = RO.report({ spends, customers, dim: 'channel', ...RO.defaultRange(Date.now(), 90), ratePct: Number(cfg.rate_pct) || 0 });
const _o1 = hist.total.conv;
const mode = K.select([['target', 'Muốn chốt bao nhiêu căn → cần bao nhiêu tiền'], ['budget', 'Có bao nhiêu tiền → được bao nhiêu khách']], 'target', { 'data-testid': 'bp-mode' });
const deals = G.input({ value: '2', inputmode: 'numeric', 'data-testid': 'bp-deals' });
const budget = G.input({ value: '', inputmode: 'numeric', 'data-testid': 'bp-budget', placeholder: 'VD 30000000' });
const conv = G.input({ value: _o1 ? String(_o1) : '', inputmode: 'decimal', 'data-testid': 'bp-conv', placeholder: 'VD 2' });
const comm = G.input({ value: '', inputmode: 'numeric', 'data-testid': 'bp-comm', placeholder: 'Hoa hồng trung bình 1 căn (đồng)' });
const rows = ['facebook', 'tiktok', 'google', 'zalo'].map(k => {
const _o7 = hist.rows.find(_oe => _oe.key === k);
return { key: k, share: G.input({ value: k === 'facebook' ? '60' : k === 'tiktok' ? '40' : '0', inputmode: 'decimal', 'data-testid': 'bp-share-' + k }),
cpl: G.input({ value: _o7 && _o7.cpl ? String(_o7.cpl) : '', inputmode: 'numeric', 'data-testid': 'bp-cpl-' + k, placeholder: 'Chi phí/khách' }), hist: _o7 && _o7.cpl };
});
const out = h('div', { 'data-testid': 'bp-out' });
const _o5 = () => {
const _oe = AD.budgetPlan({ mode: mode.value, deals: Number(deals.value) || 0, budget: RO.parseAmount(budget.value), conv: Number(String(conv.value).replace(',', '.')) || 0,
commission: RO.parseAmount(comm.value), channels: rows.map(x => ({ key: x.key, share: Number(x.share.value) || 0, cpl: RO.parseAmount(x.cpl.value) })) });
out.innerHTML = '';
if (!_oe.ok) { out.appendChild(h('p', { class: 'g3-warn' }, _oe.reason)); return; }
out.appendChild(h('div', { class: 'g3-grid' }, G.kpi('ngân sách', G.vnd(_oe.total), 'bp-total'), G.kpi('khách dự kiến', String(_oe.leads), 'bp-leads'), G.kpi('căn chốt dự kiến', String(_oe.deals), 'bp-exp-deals'),
G.kpi('chi phí/căn chốt', _oe.cpa ? G.vnd(_oe.cpa) : '–'), G.kpi('ROI dự kiến', _oe.roi === null ? '–' : _oe.roi + '%')));
out.appendChild(h('table', { class: 'g3-tbl' }, h('tbody', null, _oe.rows.map(x => h('tr', null, h('td', null, channelName(x.key)), h('td', { class: 'n' }, x.share + '%'), h('td', { class: 'n' }, G.vnd(x.money)), h('td', { class: 'n' }, x.leads + ' khách'))))));
out.appendChild(h('p', { class: 'g3-sub' }, 'Đây là ước tính từ số anh/chị nhập; quảng cáo thật dao động theo mùa, nội dung, giá thầu. Chạy thử 3–5 ngày rồi chỉnh theo số liệu ở tab "Chi phí mỗi khách".'));
};
[mode, deals, budget, conv, comm, ...rows.flatMap(x => [x.share, x.cpl])].forEach(i => i.addEventListener('input', _o5));
mode.addEventListener('change', _o5);
box.appendChild(K.card({ title: 'Kế hoạch ngân sách', testid: 'bp-form', body: [G.field('Cách tính', mode), h('div', { class: 'g3-two' }, G.field('Số căn muốn chốt', deals), G.field('Hoặc ngân sách (đồng)', budget)),
h('div', { class: 'g3-two' }, G.field('Tỷ lệ khách → chốt (%)', conv, _o1 ? 'Số liệu 90 ngày của anh/chị: ' + _o1 + '%' : 'Chưa có số liệu – nhập theo kinh nghiệm'), G.field('Hoa hồng 1 căn', comm)),
h('table', { class: 'g3-tbl' }, h('thead', null, h('tr', null, h('th', null, 'Kênh'), h('th', null, 'Tỷ lệ tiền (%)'), h('th', null, 'Chi phí/khách (đồng)'))),
h('tbody', null, rows.map(x => h('tr', null, h('td', null, channelName(x.key), x.hist ? h('div', { class: 'g3-sub' }, 'thực tế 90 ngày: ' + G.vnd(x.hist)) : null), h('td', null, x.share), h('td', null, x.cpl)))))] }));
box.appendChild(out);
_o5();
}
async function _oi(box) {
const [spends, customers] = await Promise.all([G.objs('g3_spend'), G.customers()]);
const rep = RO.report({ spends, customers, dim: 'campaign', ...RO.defaultRange(Date.now(), 30) });
box.appendChild(K.card({ title: 'Chi phí mỗi khách theo chiến dịch (30 ngày)', testid: 'ads-cpl', body: [reportTable(G, rep, 'ads-cpl-table'),
h('p', { class: 'g3-sub' }, 'Đặt tên chiến dịch ở đây trùng với utm_campaign trên link quảng cáo để app ghép đúng khách. Báo cáo đầy đủ: "Đo hiệu quả tiền marketing".')] }));
box.appendChild(spendForm(G, ctx, _of));
}
await _of();
}
export default {
manifest: { id: 'g3_ads', title: 'Hỗ trợ quảng cáo', icon: '📣', screen: 'customers', order: 151, version: '0.1.0', status: 'ready',
help: 'Soạn mẫu quảng cáo Facebook/TikTok/Google/Zalo đúng độ dài, cảnh báo câu chữ rủi ro, link gắn mã đo, bản yêu cầu thiết kế, kế hoạch ngân sách, chi phí mỗi khách. Anh/chị tự bấm chạy quảng cáo.' },
mount,
async selftest(ctx) {
const _oj = AD.generateCopy('google', AD.adInputs({ name: 'Dự án Thử Rất Dài Tên Để Thử Cắt', area: 'Quận 9', types: [{ n: '2N' }] }));
if (!_oj || _oj.fields.headline.some(x => x.over) || !AD.checkCopy('Dự án tốt nhất').length) return { ok: false, details: 'Soạn mẫu quảng cáo sai' };
return selftestG3(ctx);
},
};

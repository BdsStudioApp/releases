import { g3kit, h, parseData, selftestG3, mktConfig, MKT_CFG_ID as CFG_ID } from '../g3_lib/ui.js';
import * as RO from '../g3_lib/roi.js';
import * as AP from '../g3_lib/adperf.js';
import { CHANNELS, channelName, readAttribution } from '../g3_lib/attribution.js';
import { decodeCsvBytes } from '../g3_lib/csv.js';
const SPEND_CH = ['facebook', 'tiktok', 'google', 'zalo', 'group', 'other'];
const _ou = _o1a => (_o1a === null || _o1a === undefined ? '–' : _o1a + '%');
const _o0 = [['facebook', 'Facebook / Instagram (Meta)'], ['tiktok', 'TikTok'], ['google', 'Google / YouTube'], ['zalo', 'Zalo'], ['other', 'Khác']];
const _o1 = { ok: 'g3-ok', warn: 'g3-warn', fail: 'g3-fail', manual: 'g3-manual' };
const _o4 = 'min-height:44px;cursor:pointer;display:flex;align-items:center;font-weight:600';
const _oj = d => String(d || '').split('-').reverse().join('/');
export const META_URL_PARAMS = 'utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}';
const _oo = (strong, rest) => h('li', { style: 'margin:4px 0' }, strong ? h('strong', null, strong) : null, strong && rest ? ' ' : null, rest || null);
export function exportSteps() {
return h('div', { class: 'g3', style: 'padding:4px 0 8px' },
h('ol', { style: 'margin:0;padding-left:20px' },
_oo('Mở Trình quản lý quảng cáo', '(Ads Manager; từ Meta Business Suite cũng vào được). Chọn đúng tài khoản quảng cáo ở góc trên bên trái.'),
_oo('Chọn tab "Quảng cáo"', 'để có số của từng quảng cáo (muốn xem theo nhóm hoặc chiến dịch thì chọn tab "Nhóm quảng cáo" / "Chiến dịch").'),
_oo('Chọn khoảng thời gian', 'ở góc trên bên phải, VD "30 ngày qua" (Meta cho xuất tối đa 37 tháng).'),
_oo('Bấm "Cột" → "Tùy chỉnh cột":', 'tích Số tiền đã chi tiêu, Lượt hiển thị, Lượt click vào liên kết, Kết quả (nhóm "Hiệu quả" và "Lượt tương tác"); nhóm "Cài đặt" có "ID quảng cáo" và tên nhóm quảng cáo – nên tích để nhập lại không bị trùng. Bấm "Áp dụng".'),
_oo('(Tuỳ chọn) Muốn có từng ngày:', 'bấm biểu tượng "Số liệu chia nhỏ" (Breakdown) → "Theo thời gian" → "Ngày". Không bắt buộc: không chia theo ngày thì mỗi quảng cáo một dòng.'),
_oo('Bấm "Báo cáo" → "Xuất dữ liệu bảng"', '→ chọn loại tệp là CSV (đừng chọn Excel) → bấm "Xuất". Tệp được tải về máy (trên điện thoại: thư mục Tải xuống).'),
_oo('Quay lại đây:', 'bấm "Chọn tệp" → chọn tệp vừa tải → "Tải vào app". Sau đó tích chọn quảng cáo cần xem và bấm "Sửa số liệu" để nhập số lead, hẹn xem, giao dịch, doanh thu.')),
h('p', { class: 'g3-sub', 'data-testid': 'ad-howto-csv' }, 'Xuất dạng CSV: app chưa đọc được tệp Excel (.xls/.xlsx). Lỡ tải bản Excel thì tốt nhất xuất lại và chọn CSV. Nếu buộc phải mở bằng Excel rồi "Lưu thành" (Save as) → CSV: trước khi lưu, chọn các cột ID (ID quảng cáo, ID chiến dịch…) → Định dạng ô → Văn bản (Text); nếu không, Excel đổi ID thành dạng 1.20212E+17, mất chữ số.'),
h('p', { class: 'g3-sub' }, 'Giao diện tiếng Anh: Columns → Customize columns → Apply; Breakdown → By time → Day; Reports → Export table data → chọn CSV → Export. ' +
'Tên cột trong tệp có thể khác đôi chút tùy ngôn ngữ giao diện và cột anh/chị chọn – app tự nhận cả tiếng Anh lẫn tiếng Việt (VD "Amount spent (VND)" hoặc "Số tiền đã chi tiêu (VND)"), dấu phẩy hay chấm phẩy đều đọc được, số kiểu 1.234.567 hay 1,234,567 đều đọc được. ' +
'Nếu app báo "chưa đọc được quảng cáo nào", xem dòng "Cột tìm thấy" rồi so với tên cột nói trên. Tiền không phải VND (VD USD) thì nhập thêm tỷ giá. ' +
'TikTok Ads Manager: Báo cáo → Tải xuống. Google Ads: Báo cáo → Tải xuống → .csv (chưa đối chiếu tệp thật của hai nền tảng này). Tên menu có thể đổi đôi chút theo phiên bản của nền tảng.'));
}
export async function readCsvFile(K, fl) {
if (!fl) return null;
if (fl.size > 3e6) { K.toast('Tệp quá lớn (tối đa 3 MB) – chọn khoảng ngày ngắn hơn', 'warn'); return null; }
const d = decodeCsvBytes(await fl.arrayBuffer());
if (d.binary || /\.xlsx?$/i.test(String(fl.name || ''))) {
K.toast('Đây là tệp Excel – app chỉ đọc CSV. Xuất lại ở Meta và chọn CSV (Báo cáo → Xuất dữ liệu bảng → CSV), hoặc mở bằng Excel → Lưu thành → CSV (đặt cột ID dạng Văn bản trước khi lưu).', 'warn');
return null;
}
return d.text;
}
export function connectGuide(G, goAds) {
const K = G.K;
const _o13 = (id, title, body, open) => h('details', { 'data-testid': 'roi-connect-' + id, open: open ? '' : null, style: 'border-top:1px solid rgba(127,127,127,.2);padding:4px 0' },
h('summary', { style: _o4 }, title), h('div', { class: 'g3', style: 'padding:4px 0 8px' }, body));
return K.card({ title: 'Kết nối Fanpage / Trình quản lý quảng cáo', testid: 'roi-connect', body: [
G.note('Cách khuyên dùng: tải tệp báo cáo .csv từ Trình quản lý quảng cáo vào tab "Theo từng quảng cáo". Miễn phí, không cần tạo ứng dụng Meta, không cần Meta duyệt, không phải đưa mật khẩu hay mã truy cập cho app.'),
_o13('csv', '1. Lấy số liệu quảng cáo bằng tệp .csv (miễn phí, chắc chạy)', [exportSteps(),
K.button('Mở tab "Theo từng quảng cáo"', () => goAds && goAds(), { kind: 'primary', testid: 'roi-connect-go' })], true),
_o13('utm', '2. Gắn link để app tự đếm khách theo từng quảng cáo', [
h('ol', { style: 'margin:0;padding-left:20px' },
_oo('Khi tạo/sửa quảng cáo', 'trong Trình quản lý quảng cáo, ở phần "Đích đến" chọn trang landing của anh/chị (trang làm bằng Trình tạo landing có sẵn form để lại số).'),
_oo('Tìm ô "Tham số URL"', '(URL parameters, ở cuối phần Theo dõi) → dán dòng bên dưới. Facebook tự thay {{campaign.name}}, {{ad.name}} bằng tên chiến dịch, tên quảng cáo.'),
_oo('Khách để lại số trên trang', '→ app ghi nguồn → ở tab "Theo từng quảng cáo" app tự gợi ý số lead, số giao dịch cho đúng quảng cáo đó.')),
h('pre', { class: 'g3-pre', 'data-testid': 'roi-utm' }, META_URL_PARAMS),
h('div', { class: 'g3-row' }, K.button('Chép tham số URL', () => G.copy(META_URL_PARAMS, 'Đã chép tham số URL'), { testid: 'roi-copy-utm' })),
h('p', { class: 'g3-sub' }, 'Quảng cáo dùng mẫu biểu mẫu ngay trên Facebook (Quảng cáo tìm khách hàng tiềm năng) thì khách không qua trang landing: app không tự đếm được – xem danh sách khách ở Meta Business Suite rồi nhập tay số lead bằng nút "Sửa số liệu". Mục "Hỗ trợ quảng cáo" cũng tạo sẵn link gắn mã cho từng nền tảng.')]),
_o13('page', '3. Fanpage: số liệu bài viết và bài được quảng cáo', [
h('ul', { style: 'margin:0;padding-left:20px' },
_oo('Bài viết thường trên Fanpage:', 'xem lượt tiếp cận, tương tác ở Meta Business Suite (business.facebook.com) → "Thông tin chi tiết" (Insights). Có thể xuất dữ liệu ở đó nếu cần.'),
_oo('Bài được quảng cáo', '(nút "Quảng cáo bài viết"/"Đẩy bài viết" trên Fanpage) cũng hiện trong Trình quản lý quảng cáo như một quảng cáo → xuất .csv theo bước ở mục 1 là có đủ chi phí, lượt hiển thị, lượt bấm.'),
_oo('Số lead, khách hẹn xem, giao dịch, doanh thu', 'Facebook không biết – anh/chị nhập ở "Sửa số liệu" (hoặc để app đếm từ link gắn mã ở mục 2).'))]),
_o13('api', '4. Kết nối trực tiếp Marketing API (nâng cao – chưa có trong bản này)', [
h('p', { class: 'g3-sub' }, 'Dành cho người rành kỹ thuật, muốn app tự lấy số liệu mỗi ngày thay vì tải tệp. Cần:'),
h('ol', { style: 'margin:0;padding-left:20px' },
_oo('Tài khoản Meta for Developers', '(developers.facebook.com) → tạo ứng dụng loại Doanh nghiệp → thêm sản phẩm Marketing API.'),
_oo('Quyền đọc quảng cáo (ads_read)', 'cho đúng tài khoản quảng cáo; nên tạo "Người dùng hệ thống" trong Business Manager để có mã truy cập dài hạn.'),
_oo('ID tài khoản quảng cáo', '(dạng act_123…) và mã truy cập (access token). Mã này như chìa khoá: chỉ được lưu ở máy chủ, không dán vào trình duyệt hay gửi qua chat.')),
G.note('Bản này CHƯA tự kết nối API: cần thêm phần máy chủ giữ mã truy cập và gọi Meta theo lịch. App đã chuẩn bị sẵn chỗ nhận dữ liệu – số liệu API sau này sẽ ghi vào đúng từng quảng cáo đã tải bằng tệp (không trùng, không mất số anh/chị đã sửa). Trong lúc chờ, dùng cách tải tệp ở mục 1.')]),
h('p', { class: 'g3-sub' }, 'App không đăng nhập Facebook, không tự bật/tắt quảng cáo. Tên menu của Meta có thể thay đổi theo phiên bản – nếu không thấy đúng chữ, tìm mục có ý tương tự (Cột, Báo cáo, Xuất).'),
] });
}
export async function writeSpend(G, rows) {
const _og = await G.objs('g3_spend');
const _op = RO.mergeSpend(_og, rows);
for (const r of _op.add) await G.save('g3_spend', { name: r.campaign || channelName(r.channel), status: 'ok' }, { ...r, imported_at: Date.now() });
for (const u of _op.update) { const o = _og.find(x => x.id === u.id); await G.save('g3_spend', { ...o, name: u.row.campaign || o.name }, { ...parseData(o.data), ...u.row, imported_at: Date.now() }); }
return _op;
}
export function spendForm(G, ctx, onDone, msg = '') {
const K = G.K;
const _o17 = RO.parseDate(Date.now());
const date = G.input({ type: 'date', value: _o17, 'data-testid': 'sp-date' });
const _oa = K.select(SPEND_CH.map(c => [c, channelName(c)]), 'facebook', { 'data-testid': 'sp-channel' });
const _o8 = G.input({ 'data-testid': 'sp-campaign', placeholder: 'Tên chiến dịch – trùng utm_campaign trên link' });
const _o1b = G.input({ 'data-testid': 'sp-video', placeholder: 'Mã video (tuỳ chọn)' });
const amount = G.input({ inputmode: 'numeric', 'data-testid': 'sp-amount', placeholder: 'VD 1500000' });
const clicks = G.input({ inputmode: 'numeric', 'data-testid': 'sp-clicks', placeholder: 'Lượt nhấp (tuỳ chọn)' });
const csv = G.area({ rows: 4, 'data-testid': 'sp-csv', placeholder: 'Dán nội dung tệp CSV xuất từ Trình quản lý quảng cáo (Facebook: Báo cáo → Xuất; TikTok: Báo cáo → Tải xuống; Google Ads: Báo cáo → Tải xuống CSV)…' });
const _oc = K.select([['', 'Nền tảng theo cột trong tệp'], ...SPEND_CH.map(c => [c, channelName(c)])], 'facebook', { 'data-testid': 'sp-csv-channel' });
const file = h('input', { type: 'file', accept: '.csv,text/csv,.tsv,.txt', style: 'max-width:100%' });
file.onchange = async () => { const t = await readCsvFile(K, file.files && file.files[0]); if (t !== null) csv.value = t; };
const result = h('div', { 'data-testid': 'sp-csv-result' }, msg ? h('p', { class: 'g3-ok' }, msg) : null);
const _o1e = rows => writeSpend(G, rows);
return h('div', { class: 'g3' },
K.card({ title: 'Nhập chi phí bằng tay', testid: 'sp-manual', body: [
h('div', { class: 'g3-two' }, G.field('Ngày', date), G.field('Kênh', _oa)), h('div', { class: 'g3-two' }, G.field('Chiến dịch', _o8), G.field('Mã video', _o1b)),
h('div', { class: 'g3-two' }, G.field('Số tiền đã tiêu (đồng)', amount), G.field('Lượt nhấp', clicks)),
K.button('Lưu chi phí', async () => {
const r = RO.spendRow({ date: date.value, channel: _oa.value, campaign: _o8.value, video: _o1b.value, amount: amount.value, clicks: clicks.value }, 'manual');
if (!RO.validSpend(r)) return K.toast('Nhập ngày và số tiền > 0', 'warn');
await _o1e([r]); amount.value = ''; clicks.value = ''; K.toast('Đã lưu ' + G.vnd(r.amount), 'success'); onDone && onDone();
}, { kind: 'primary', testid: 'sp-save' })] }),
K.card({ title: 'Nhập từ tệp CSV', testid: 'sp-import', body: [file, csv, G.field('Nền tảng', _oc),
K.button('Nhập', async () => {
const _o11 = RO.importSpendCsv(csv.value, { channel: _oc.value });
result.innerHTML = '';
const _od = AP.currencyCode(_o11.columns.amount);
if (_od && _od !== 'VND') { result.appendChild(h('p', { class: 'g3-fail' }, 'Tệp tính tiền bằng ' + _od + ' – ở đây chưa đổi tiền được. Hãy tải tệp ở tab "Theo từng quảng cáo" (có ô tỷ giá).')); return; }
if (!_o11.rows.length && _o11.foreign) { result.appendChild(h('p', { class: 'g3-fail' }, `Tệp có ${_o11.foreign} dòng tính bằng ngoại tệ (cột Currency) – ở đây chưa đổi tiền được. Hãy tải tệp ở tab "Theo từng quảng cáo" (có ô tỷ giá).`)); return; }
if (!_o11.rows.length) { result.appendChild(h('p', { class: 'g3-fail' }, 'Không đọc được dòng nào. Cột tìm thấy: ' + (_o11.headers.join(', ') || 'không có') + '. Cần ít nhất cột Ngày (hoặc "Bắt đầu báo cáo") và Số tiền; xuất dạng CSV.')); return; }
const _op = await _o1e(_o11.rows);
const text = `Đã nhập ${_op.add.length} dòng mới, cập nhật ${_op.update.length} dòng${_o11.skipped ? ', bỏ qua ' + _o11.skipped + ' dòng (tổng/trống/ngày sai' + (_o11.foreign ? `, trong đó ${_o11.foreign} dòng tính bằng ngoại tệ – nhập ở tab "Theo từng quảng cáo" có ô tỷ giá` : '') + ')' : ''}. Cột: ` + Object.entries(_o11.columns).map(([k, _o1a]) => k + '=' + _o1a).join(', ');
result.appendChild(h('p', { class: 'g3-ok' }, text));
csv.value = ''; K.toast('Đã nhập chi phí', 'success'); onDone && onDone(text);
}, { kind: 'primary', testid: 'sp-import-run' }), result,
h('p', { class: 'g3-sub' }, 'Nhập lại cùng tệp không bị trùng (app nhận ra từng dòng theo ngày + chiến dịch). Bản sau: tự lấy chi phí qua API chính thức của Facebook, TikTok, Google Ads.')] }));
}
export function reportTable(G, rep, testid) {
const _oi = n => (n === null || n === undefined ? '–' : G.vnd(n));
return h('div', { class: 'g3-scroll' }, h('table', { class: 'g3-tbl', 'data-testid': testid },
h('thead', null, h('tr', null, h('th', null, RO.DIMENSIONS[rep.dim]), h('th', { class: 'n' }, 'Chi phí'), h('th', { class: 'n' }, 'Khách'), h('th', { class: 'n' }, 'Chốt'),
h('th', { class: 'n' }, 'Hoa hồng'), h('th', { class: 'n' }, 'Chi phí/khách (CPL)'), h('th', { class: 'n' }, 'Chi phí/căn chốt (CPA)'), h('th', { class: 'n' }, 'ROI'))),
h('tbody', null, [...rep.rows, rep.total].map(r => h('tr', { 'data-key': r.key, style: r.key === '_total' ? 'font-weight:700' : '' },
h('td', null, r.label || r.key), h('td', { class: 'n' }, _oi(r.spend)), h('td', { class: 'n' }, String(r.leads)), h('td', { class: 'n' }, String(r.deals)),
h('td', { class: 'n' }, _oi(r.commission)), h('td', { class: 'n' }, _oi(r.cpl)), h('td', { class: 'n' }, _oi(r.cpa)), h('td', { class: 'n' }, _ou(r.roi)))))));
}
export async function mount(el, ctx) {
const G = g3kit(ctx), K = G.K;
el.innerHTML = '';
const _o12 = h('div', { class: 'g3', 'data-testid': 'g3-roi' });
el.appendChild(_o12);
const st = { tab: 'report', dim: 'channel', days: 30, ...RO.defaultRange(Date.now(), 30) };
async function _oy() {
const [spends, customers, cfg] = await Promise.all([G.objs('g3_spend'), G.customers(), mktConfig(G)]);
const rate = Number(cfg.rate_pct) || 0;
_o12.innerHTML = '';
_o12.appendChild(G.head('Đo hiệu quả tiền marketing', 'Tiền bỏ ra cho từng kênh, chiến dịch, video, trang landing so với số khách, căn chốt và hoa hồng.'));
_o12.appendChild(G.tabs([['report', 'Báo cáo'], ['ads', 'Theo từng quảng cáo'], ['spend', 'Nhập chi phí'], ['deals', 'Hoa hồng căn chốt'], ['connect', 'Hướng dẫn kết nối']], st.tab, k => { st.tab = k; _oy(); }, 'roi-tab'));
if (st.tab === 'ads') { await _oz(customers, rate); return; }
if (st.tab === 'connect') { _o12.appendChild(connectGuide(G, () => { st.tab = 'ads'; _oy(); })); return; }
if (st.tab === 'spend') {
_o12.appendChild(spendForm(G, ctx, (_op) => { st.msg = _op || ''; _oy(); }, st.msg)); st.msg = '';
const _ox = spends.map(o => ({ o, d: parseData(o.data) })).sort((a, b) => String(b.d.date).localeCompare(String(a.d.date))).slice(0, 60);
_o12.appendChild(K.card({ title: 'Chi phí đã nhập (' + spends.length + ')', testid: 'sp-list', body: _ox.length ? h('div', { class: 'g3-scroll' }, h('table', { class: 'g3-tbl' },
h('tbody', null, _ox.map(({ o, d }) => h('tr', null, h('td', null, d.date), h('td', null, channelName(d.channel)), h('td', null, d.campaign || '–'), h('td', { class: 'n' }, G.vnd(d.amount)), h('td', { class: 'g3-sub' }, d.source),
h('td', null, G.canErase ? K.button('Xoá', async () => { if (await G.deleteRow(o, { title: 'Xoá dòng chi phí?', text: 'Xoá ' + G.vnd(d.amount) + ' ngày ' + d.date + (d.campaign ? ' (' + d.campaign + ')' : '') + ' khỏi báo cáo.' })) _oy(); }, { kind: 'ghost', testid: 'sp-del-' + o.id }) : null)))))) : K.empty('Chưa nhập chi phí.') }));
return;
}
if (st.tab === 'deals') { _o10(customers, rate); return; }
const _ow = K.select([[7, '7 ngày'], [30, '30 ngày'], [90, '90 ngày'], [365, '12 tháng']], st.days, { 'data-testid': 'roi-range' });
_ow.onchange = () => { st.days = Number(_ow.value); Object.assign(st, RO.defaultRange(Date.now(), st.days)); _oy(); };
_o12.appendChild(h('div', { class: 'g3-row' }, G.field('Khoảng thời gian', _ow), G.tabs(Object.entries(RO.DIMENSIONS), st.dim, k => { st.dim = k; _oy(); }, 'roi-dim')));
_o12.appendChild(h('div', { class: 'g3-note', 'data-testid': 'roi-sources-link' }, 'Muốn biết nguồn nào ra khách Nóng, hẹn xem, chốt (theo tuần/tháng, theo từng video/bài)? ',
K.button('Mở "Nguồn khách"', () => K.nav('#/customers/customers?sources=1'), { testid: 'roi-open-sources' })));
const rep = RO.report({ spends, customers, dim: st.dim, from: st.from, to: st.to, ratePct: rate });
const t = rep.total;
_o12.appendChild(h('div', { class: 'g3-grid' }, G.kpi('đã tiêu', G.vnd(t.spend), 'roi-spend'), G.kpi('khách mới', String(t.leads), 'roi-leads'), G.kpi('căn chốt', String(t.deals), 'roi-deals'),
G.kpi('chi phí/khách từ kênh có chi tiền (' + t.paid_leads + ' khách)', t.cpl === null ? '–' : G.vnd(t.cpl), 'roi-cpl'), G.kpi('chi phí/căn chốt từ kênh có chi tiền', t.cpa === null ? '–' : G.vnd(t.cpa), 'roi-cpa'), G.kpi('ROI kênh có chi tiền (hoa hồng – chi phí)/chi phí', _ou(t.roi), 'roi-roi')));
_o12.appendChild(K.card({ title: 'Theo ' + RO.DIMENSIONS[st.dim].toLowerCase(), testid: 'roi-report', body: [reportTable(G, rep, 'roi-table'),
h('p', { class: 'g3-sub' }, 'Khách được tính theo nguồn trên link (utm_source, utm_campaign, mã video v; khách cũ có mã giới thiệu ref vẫn tính vào Giới thiệu). Khách nhập tay không có nguồn nằm ở "Nhập tay". Chi phí/khách, chi phí/căn chốt, ROI ở trên chỉ tính các dòng có chi tiền – khách nhập tay, giới thiệu không làm đẹp số. ' +
(rate ? 'Hoa hồng chưa ghi được ước theo ' + rate + '% giá căn.' : 'Ghi hoa hồng ở tab "Hoa hồng căn chốt" để có ROI.'))] }));
const _ot = RO.outliers(RO.report({ spends, customers, dim: st.dim === 'channel' ? 'campaign' : st.dim, from: st.from, to: st.to, ratePct: rate }).rows);
_o12.appendChild(K.card({ title: 'Bất thường (' + _ot.length + ')', testid: 'roi-outliers', body: _ot.length ? [
h('ul', null, _ot.map(o => h('li', { class: 'g3-warn', 'data-kind': o.kind }, h('strong', null, o.label + ': '), o.why))),
G.isStaff ? K.button('Gửi cảnh báo qua Telegram', async () => {
try { const r = await K.api('g3.alert', { title: 'Chi phí marketing bất thường (' + st.days + ' ngày)', lines: RO.alertLines(_ot, G.vnd) }); K.toast(r.sent ? 'Đã gửi Telegram' : (r.reason || 'Chưa gửi được'), r.sent ? 'success' : 'warn'); }
catch (e) { K.toast((e && e.message) || 'Máy chủ chưa có chức năng này – cần cập nhật máy chủ', 'warn'); }
}, { kind: 'primary', testid: 'roi-alert' }) : null] : K.empty('Không thấy chiến dịch bất thường (tiêu nhiều mà không có khách, hoặc chi phí/khách gấp đôi mức giữa).') }));
}
async function _oz(customers, rate) {
const ads = (await G.objs('g3_ad')).map(AP.adView).sort((a, b) => (Number(b.spend) || 0) - (Number(a.spend) || 0));
_o12.appendChild(_ok(!ads.length));
if (!ads.length) {
_o12.appendChild(K.empty('Chưa có quảng cáo nào. Tải tệp .csv xuất từ Trình quản lý quảng cáo ở trên, hoặc bấm "+ Thêm quảng cáo tay".'));
_o12.appendChild(h('div', { class: 'g3-row' }, K.button('+ Thêm quảng cáo tay', () => _of(null, customers, rate, ads), { testid: 'ad-add' })));
return;
}
if (!st.sel) st.sel = new Set(ads.map(a => a.id));
for (const id of [...st.sel]) if (!ads.some(a => a.id === id)) st.sel.delete(id);
const _ov = ads.map(a => ({ ...a, raw: undefined }));
const _on = ads.map(ad => { const sg = AP.suggestFor(ad, customers, { ads: _ov, ratePct: rate }); return { ad, sg, eff: AP.effective(ad, sg) }; });
const _oi = n => (n === null || n === undefined ? '–' : G.vnd(n));
const _or = n => (n === null || n === undefined ? '–' : Number(n).toLocaleString('vi-VN'));
const _o3 = { manual: ' (anh/chị nhập)', app: ' (app gợi ý)', platform: ' (nền tảng báo)', '': '' };
const list = h('div', { class: 'g3', 'data-testid': 'ad-list' }, _on.map(({ ad, sg, eff }) => {
const pick = h('input', { type: 'checkbox', checked: st.sel.has(ad.id), 'data-testid': 'ad-pick', 'aria-label': 'Chọn ' + ad.name });
pick.onchange = () => { if (pick.checked) st.sel.add(ad.id); else st.sel.delete(ad.id); _oe(); };
const dates = ad.date_from ? (ad.date_from === ad.date_to || !ad.date_to ? _oj(ad.date_from) : _oj(ad.date_from) + ' – ' + _oj(ad.date_to)) : '';
const _o1d = ad.level === 'ad' ? [ad.campaign, ad.adset].filter(Boolean).join(' › ') : (ad.level === 'adset' ? 'Nhóm quảng cáo' + (ad.campaign ? ' · ' + ad.campaign : '') : 'Chiến dịch');
return h('div', { class: 'g3-item', 'data-testid': 'ad-item', 'data-key': ad.key, 'data-name': ad.name },
h('div', { class: 'g3-row' }, h('label', { class: 'g3-chk', style: 'flex:1;min-width:0' }, pick, h('strong', { style: 'overflow-wrap:anywhere' }, ad.name)), K.badge(channelName(ad.platform), 'info')),
h('span', { class: 'g3-sub' }, [_o1d, dates, ad.source === 'manual' ? 'nhập tay' : ''].filter(Boolean).join(' · ')),
h('span', { class: 'g3-sub' }, `Chi ${_oi(ad.spend)} · ${_or(ad.impressions)} hiển thị · ${_or(ad.clicks)} lượt bấm` + (ad.results ? ` · ${_or(ad.results)} kết quả${ad.result_type ? ' (' + AP.resultLabel(ad.result_type) + ')' : ''}` : '')),
h('span', { 'data-testid': 'ad-nums', style: 'font-size:.9rem' }, `Lead: ${_or(eff.leads)}${_o3[eff.src.leads]} · Hẹn xem: ${_or(eff.viewings)} · Giao dịch: ${_or(eff.deals)}${_o3[eff.src.deals]} · Doanh thu: ${_oi(eff.revenue)}${_o3[eff.src.revenue]}`),
sg.match && eff.src.leads !== 'app' && eff.src.leads !== 'manual' ? h('small', { class: 'g3-sub' }, _o16(sg)) : null,
h('div', { class: 'g3-row', style: 'justify-content:flex-start' },
K.button('Sửa số liệu', () => _of(ad, customers, rate, ads), { testid: 'ad-edit' }),
G.canErase ? K.button('Xoá', async () => {
if (await K.confirm({ title: 'Xoá quảng cáo', text: 'Xoá "' + ad.name + '" khỏi danh sách phân tích? (Chi phí đã ghi ở báo cáo theo kênh không đổi.)', ok: 'Xoá', kind: 'danger' })) { await G.remove(ad.raw); _oy(); }
}, { kind: 'ghost', testid: 'ad-del' }) : null));
}));
const _o6 = h('div', { class: 'g3' });
_o12.appendChild(K.card({ title: 'Quảng cáo đã tải (' + ads.length + ')', testid: 'ad-list-card', actions: [
K.button('Chọn tất cả', () => { st.sel = new Set(ads.map(a => a.id)); _oy(); }, { testid: 'ad-pick-all' }),
K.button('Bỏ chọn', () => { st.sel = new Set(); _oy(); }, { testid: 'ad-pick-none' }),
K.button('+ Thêm tay', () => _of(null, customers, rate, ads), { testid: 'ad-add' })], body: [
h('p', { class: 'g3-sub' }, 'Tích chọn quảng cáo muốn phân tích. Bấm "Sửa số liệu" để nhập số khách để lại số, khách hẹn xem, giao dịch, doanh thu/hoa hồng – nhập lại tệp không xoá số anh/chị đã sửa.'), list] }));
_o12.appendChild(_o6);
function _oe() {
_o6.innerHTML = '';
const _ob = _on.filter(x => st.sel.has(x.ad.id));
if (!_ob.length) { _o6.appendChild(K.card({ title: 'Phân tích', testid: 'ad-analysis', body: K.empty('Chọn ít nhất 1 quảng cáo để phân tích.') })); return; }
const an = AP.analyze(_ob.map(({ ad, eff }) => ({ ad, eff })), { money: G.vnd });
const t = an.total;
const _o5 = h('div');
_o6.appendChild(K.card({ title: 'Phân tích ' + _ob.length + ' quảng cáo đã chọn', testid: 'ad-analysis', body: [
h('div', { class: 'g3-grid' }, G.kpi('tổng chi phí', _oi(t.cost), 'ad-kpi-spend'), G.kpi('lead (khách để lại số)', _or(t.leads), 'ad-kpi-leads'), G.kpi('chi phí/lead (CPL)', _oi(t.cpl), 'ad-kpi-cpl'),
G.kpi('chi phí/khách hẹn xem', _oi(t.cpv), 'ad-kpi-cpv'), G.kpi('chi phí/giao dịch', _oi(t.cpd), 'ad-kpi-cpd'), G.kpi('ROI (doanh thu – chi phí)/chi phí', _ou(t.roi), 'ad-kpi-roi')),
h('div', { class: 'g3-scroll' }, h('table', { class: 'g3-tbl', 'data-testid': 'ad-table' },
h('thead', null, h('tr', null, h('th', null, 'Quảng cáo'), h('th', { class: 'n' }, 'Chi phí'), h('th', { class: 'n' }, 'Tỷ lệ bấm'), h('th', { class: 'n' }, 'Lead'), h('th', { class: 'n' }, 'CPL'),
h('th', { class: 'n' }, 'Hẹn xem'), h('th', { class: 'n' }, 'Chi phí/hẹn xem'), h('th', { class: 'n' }, 'Giao dịch'), h('th', { class: 'n' }, 'Chi phí/giao dịch'), h('th', { class: 'n' }, 'Doanh thu'), h('th', { class: 'n' }, 'ROI'))),
h('tbody', null, [...an.rows, t].map(r => h('tr', { 'data-key': r.key, style: r.key === '_total' ? 'font-weight:700' : '' },
h('td', null, r.name), h('td', { class: 'n' }, _oi(r.cost)), h('td', { class: 'n' }, _ou(r.ctr)), h('td', { class: 'n' }, _or(r.leads)), h('td', { class: 'n' }, _oi(r.cpl)),
h('td', { class: 'n' }, _or(r.viewings)), h('td', { class: 'n' }, _oi(r.cpv)), h('td', { class: 'n' }, _or(r.deals)), h('td', { class: 'n' }, _oi(r.cpd)), h('td', { class: 'n' }, _oi(r.revenue)), h('td', { class: 'n' }, _ou(r.roi))))))),
h('h3', null, 'Nhận xét'),
an.insights.length ? h('ul', { 'data-testid': 'ad-insights', style: 'margin:0;padding-left:20px' }, an.insights.map(i => h('li', { class: _o1[i.tone] || '', 'data-kind': i.kind, style: 'margin:4px 0' }, i.text)))
: h('p', { class: 'g3-sub', 'data-testid': 'ad-insights' }, 'Chưa thấy điểm bất thường.'),
h('p', { class: 'g3-sub' }, 'Chi phí = tiền quảng cáo + chi phí khác anh/chị nhập. Lead lấy theo thứ tự: số anh/chị nhập → số app đếm được từ khách có link gắn mã đúng quảng cáo → "Kết quả" nền tảng báo (khi loại kết quả là khách tiềm năng/tin nhắn).'),
h('div', { class: 'g3-row' }, K.button('AI nhận xét thêm', async () => {
try {
const r = await ctx.ai.run('summarize', { prompt: AP.aiPrompt(an) });
const _o18 = String(r && r.text || '').trim();
_o5.innerHTML = '';
if (_o18) _o5.appendChild(h('div', { class: 'g3-item', 'data-testid': 'ad-ai-out' }, h('strong', null, 'AI nhận xét (tham khảo)'), h('pre', { class: 'g3-pre' }, _o18)));
} catch (e) { K.toast('AI lỗi: ' + (e && e.message || e), 'warn'); }
}, { ai: true, testid: 'ad-ai' })), _o5] }));
}
_oe();
}
function _o16(sg) {
if (sg.match === 'ad') return `App đếm được ${sg.leads} khách có link gắn đúng quảng cáo này${sg.deals ? ', ' + sg.deals + ' đã chốt' : ''}.`;
if (sg.shared > 1) return `Chiến dịch này có ${sg.leads} khách (link gắn mã chiến dịch), dùng chung cho ${sg.shared} quảng cáo – app chưa tách được theo từng quảng cáo; nhập tay số của quảng cáo này.`;
return `App đếm được ${sg.leads} khách có link gắn mã chiến dịch này${sg.deals ? ', ' + sg.deals + ' đã chốt' : ''}.`;
}
function _ok(open) {
const file = h('input', { type: 'file', accept: '.csv,text/csv,.tsv,.txt', 'data-testid': 'ad-file', style: 'max-width:100%' });
const csv = G.area({ rows: 4, 'data-testid': 'ad-csv', placeholder: 'Hoặc dán nội dung tệp .csv vào đây…' });
file.onchange = async () => { const t = await readCsvFile(K, file.files && file.files[0]); if (t !== null) csv.value = t; };
const _oa = K.select(_o0, 'facebook', { 'data-testid': 'ad-channel' });
const fx = G.input({ inputmode: 'numeric', placeholder: 'VD 25400', 'data-testid': 'ad-fx' });
const also = h('input', { type: 'checkbox', checked: true, 'data-testid': 'ad-also-spend' });
const result = h('div', { 'data-testid': 'ad-import-result' }, st.adMsg ? h('p', { class: 'g3-ok' }, st.adMsg) : null);
st.adMsg = '';
const run = K.button('Tải vào app', async () => {
const _o11 = AP.parseAdsCsv(csv.value, { channel: _oa.value, fx: RO.parseAmount(fx.value) });
result.innerHTML = '';
if (_o11.needFx) { result.appendChild(h('p', { class: 'g3-fail' }, 'Tài khoản quảng cáo tính bằng ' + _o11.currency + ' – nhập tỷ giá (1 ' + _o11.currency + ' = ? đồng) rồi bấm lại.')); return; }
if (!_o11.ads.length) { result.appendChild(h('p', { class: 'g3-fail' }, 'Chưa đọc được quảng cáo nào. Cột tìm thấy: ' + (_o11.headers.join(', ') || 'không có') + '. Cần cột tên quảng cáo/chiến dịch và số tiền đã chi tiêu – xuất lại dạng CSV theo hướng dẫn ở trên (chọn đủ cột "Tên quảng cáo", "Số tiền đã chi tiêu").')); return; }
const _og = await G.objs('g3_ad');
const _op = AP.mergeAds(_og, _o11.ads);
const now = Date.now();
for (const a of _op.add) await G.save('g3_ad', { name: a.name, status: 'ok' }, { ...a, imported_at: now });
for (const u of _op.update) await G.save('g3_ad', { ...u.raw, name: u.data.name }, { ...u.data, imported_at: now });
let _oh = '';
if (also.checked) {
const _o15 = RO.importSpendCsv(csv.value, { channel: _oa.value, fx: RO.parseAmount(fx.value) });
const rows = _o15.rows.filter(RO.validSpend);
if (rows.length) { const _o1c = await writeSpend(G, rows); _oh = `; ghi ${_o1c.add.length + _o1c.update.length} dòng chi phí theo ngày vào báo cáo theo kênh`; }
else _oh = _o15.foreign ? '; tệp tính bằng ngoại tệ mà chưa có tỷ giá nên chưa ghi vào báo cáo theo kênh' : '; tệp không có cột ngày nên chưa ghi vào báo cáo theo kênh';
}
st.adMsg = `Đã tải ${_op.add.length} quảng cáo mới, cập nhật ${_op.update.length} quảng cáo${_o11.skipped ? ', bỏ qua ' + _o11.skipped + ' dòng (tổng/trống)' : ''}${_oh}.` + (_o11.notes && _o11.notes.length ? ' Lưu ý: ' + _o11.notes.join(' ') : '');
st.sel = null; K.toast('Đã tải báo cáo quảng cáo', 'success'); _oy();
}, { kind: 'primary', testid: 'ad-import-run' });
return K.card({ title: 'Tải báo cáo từ Trình quản lý quảng cáo', testid: 'ad-import', body: [
h('details', { open: open ? '' : null, 'data-testid': 'ad-howto' }, h('summary', { style: _o4 }, 'Cách xuất tệp .csv (Facebook/Instagram) – từng bước'), exportSteps()),
file, csv, h('div', { class: 'g3-two' }, G.field('Nền tảng', _oa), G.field('Tỷ giá (chỉ khi tài khoản tính bằng USD…)', fx)),
h('label', { class: 'g3-chk' }, also, 'Ghi luôn chi phí vào báo cáo theo kênh/chiến dịch (nhập lại cùng tệp không bị trùng; bỏ tích nếu đã nhập tệp này ở tab "Nhập chi phí")'),
run, result] });
}
function _of(ad, customers, rate, ads) {
const _om = !ad;
const _oq = ad ? ad.manual : {};
const sg = ad ? AP.suggestFor(ad, customers, { ads: ads.map(a => ({ ...a, raw: undefined })), ratePct: rate }) : null;
const _ol = {};
for (const [k, label] of Object.entries(AP.MANUAL_FIELDS)) _ol[k] = G.input({ value: _oq[k] === null || _oq[k] === undefined ? '' : String(_oq[k]), inputmode: 'numeric', 'data-testid': 'ad-f-' + k, placeholder: 'Để trống nếu chưa biết', 'aria-label': label });
const note = G.area({ rows: 2, 'data-testid': 'ad-f-note', maxlength: 500 }); note.value = _oq.note || '';
const _os = _om ? {
name: G.input({ 'data-testid': 'ad-n-name', maxlength: 160, placeholder: 'VD: Video nhà mẫu 2PN' }), campaign: G.input({ 'data-testid': 'ad-n-campaign', maxlength: 160 }),
platform: K.select(_o0, 'facebook', { 'data-testid': 'ad-n-platform' }),
spend: G.input({ inputmode: 'numeric', 'data-testid': 'ad-n-spend', placeholder: 'VD 3000000' }), impressions: G.input({ inputmode: 'numeric', 'data-testid': 'ad-n-impr' }), clicks: G.input({ inputmode: 'numeric', 'data-testid': 'ad-n-clicks' }),
from: G.input({ type: 'date', 'data-testid': 'ad-n-from' }), to: G.input({ type: 'date', 'data-testid': 'ad-n-to' }),
} : null;
const _o9 = sg && (sg.match === 'ad' || (sg.match === 'campaign' && sg.shared === 1));
const _o19 = _o9 ? K.button('Dùng số app gợi ý', () => { _ol.leads.value = String(sg.leads); if (sg.deals) _ol.deals.value = String(sg.deals); if (sg.revenue) _ol.revenue.value = String(sg.revenue); }, { testid: 'ad-f-use' }) : null;
const _o14 = K.sheet({ title: _om ? 'Thêm quảng cáo tay' : 'Số liệu: ' + ad.name, testid: 'ad-form', body: [
_om ? h('div', { class: 'g3' }, G.field('Tên quảng cáo', _os.name), h('div', { class: 'g3-two' }, G.field('Chiến dịch', _os.campaign), G.field('Nền tảng', _os.platform)),
h('div', { class: 'g3-two' }, G.field('Số tiền đã chi (đồng)', _os.spend), G.field('Lượt hiển thị', _os.impressions)), h('div', { class: 'g3-two' }, G.field('Lượt bấm', _os.clicks), G.field('Từ ngày', _os.from)), G.field('Đến ngày', _os.to))
: h('p', { class: 'g3-sub' }, `Chi ${G.vnd(ad.spend)} · ${Number(ad.impressions || 0).toLocaleString('vi-VN')} hiển thị · ${Number(ad.clicks || 0).toLocaleString('vi-VN')} lượt bấm` + (ad.results ? ` · ${ad.results} kết quả nền tảng báo${ad.result_type ? ' (' + AP.resultLabel(ad.result_type) + ')' : ''}` : '')),
sg && sg.match ? h('div', { class: 'g3-note', 'data-testid': 'ad-f-suggest' }, _o16(sg), _o19 ? h('div', { class: 'g3-row', style: 'margin-top:6px' }, _o19) : null)
: (_om ? null : h('p', { class: 'g3-sub' }, 'App chưa thấy khách nào có link gắn mã của quảng cáo này. Xem tab "Hướng dẫn kết nối" để gắn tham số URL cho quảng cáo.')),
h('div', { class: 'g3-two' }, G.field(AP.MANUAL_FIELDS.leads, _ol.leads), G.field(AP.MANUAL_FIELDS.viewings, _ol.viewings)),
h('div', { class: 'g3-two' }, G.field(AP.MANUAL_FIELDS.deals, _ol.deals), G.field(AP.MANUAL_FIELDS.revenue, _ol.revenue)),
G.field(AP.MANUAL_FIELDS.other_cost, _ol.other_cost, 'VD thuê quay video, thiết kế ảnh cho riêng quảng cáo này. Được cộng vào chi phí khi tính CPL, ROI.'),
G.field('Ghi chú', note),
K.button('Lưu', async () => {
const manual = AP.cleanManual({ ...Object.fromEntries(Object.entries(_ol).map(([k, i]) => [k, i.value])), note: note.value });
if (_om) {
const name = _os.name.value.trim();
if (name.length < 2) return K.toast('Nhập tên quảng cáo', 'warn');
const d = { platform: _os.platform.value, level: 'ad', name, campaign: _os.campaign.value.trim(), adset: '', ad_id: '', adset_id: '', campaign_id: '', spend: Math.round(RO.parseAmount(_os.spend.value)),
impressions: Math.round(RO.parseAmount(_os.impressions.value)), reach: 0, clicks: Math.round(RO.parseAmount(_os.clicks.value)), results: 0, result_type: '',
date_from: RO.parseDate(_os.from.value), date_to: RO.parseDate(_os.to.value) || RO.parseDate(_os.from.value), source: 'manual', manual, imported_at: Date.now() };
d.key = AP.adKey(d.platform, { ad_name: name, campaign: d.campaign });
if (ads.some(a => a.key === d.key)) return K.toast('Đã có quảng cáo cùng tên trong chiến dịch này – bấm "Sửa số liệu" ở quảng cáo đó', 'warn');
await G.save('g3_ad', { name, status: 'ok' }, d);
st.sel = null;
} else {
await G.save('g3_ad', { ...ad.raw }, { ...parseData(ad.raw.data), manual });
}
_o14.close(); K.toast('Đã lưu số liệu', 'success'); _oy();
}, { kind: 'primary', testid: 'ad-f-save' })] });
}
function _o10(customers, rate) {
const deals = customers.filter(RO.isDeal).sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0)).slice(0, 200);
_o12.appendChild(K.card({ title: 'Hoa hồng căn chốt (' + deals.length + ')', testid: 'roi-deals-list', body: deals.length ? h('div', { class: 'g3' }, deals.map(c => {
const d = parseData(c.data);
const inp = G.input({ value: d.commission || '', inputmode: 'numeric', placeholder: rate ? 'Ước ' + G.vnd(RO.commissionOf(c, rate)) : 'Hoa hồng (đồng)', 'data-testid': 'deal-comm-' + c.id });
return h('div', { class: 'g3-item' }, h('div', { class: 'g3-row' }, h('strong', null, c.name), h('span', { class: 'g3-sub' }, [c.status, K.projectName(c.project), channelName(_o2(c))].filter(Boolean).join(' · '))),
h('div', { class: 'g3-row' }, inp, K.button('Lưu', async () => {
const _o1a = RO.parseAmount(inp.value);
if (!(_o1a >= 0)) return K.toast('Nhập số tiền', 'warn');
await K.put('objects', { ...c, data: JSON.stringify({ ...parseData(c.data), commission: Math.round(_o1a) }) }); K.toast('Đã lưu hoa hồng', 'success');
}, { testid: 'deal-comm-save-' + c.id })));
})) : K.empty('Chưa có khách ở trạng thái Đã đặt cọc / Đã mua / Đã thuê.') }));
}
await _oy();
K.on(el, ['objects'], () => { if (!['spend', 'ads', 'connect'].includes(st.tab) && !_o12.querySelector('input:focus, textarea:focus, select:focus')) _oy(); });
}
function _o2(c) { return readAttribution(c).channel; }
export default {
manifest: { id: 'g3_roi', title: 'Đo hiệu quả tiền marketing', icon: '📈', screen: 'customers', order: 153, version: '0.1.0', status: 'ready',
help: 'Nhập chi phí quảng cáo (tay hoặc CSV) → so với khách, căn chốt, hoa hồng theo kênh/chiến dịch/video/trang: chi phí mỗi khách (CPL), mỗi căn chốt (CPA), ROI; cảnh báo bất thường qua Telegram. Theo từng quảng cáo: tải tệp .csv từ Trình quản lý quảng cáo, chọn quảng cáo, tự sửa số lead/hẹn xem/giao dịch/doanh thu → CPL, chi phí/giao dịch, ROI + nhận xét. Có hướng dẫn kết nối Fanpage/Trình quản lý quảng cáo.' },
mount,
async selftest(ctx) {
const rep = RO.report({ spends: [{ id: 's', data: { date: '2026-11-10', channel: 'facebook', amount: 1e6 } }], customers: [{ id: 'c', kind: 'customer', created_at: Date.UTC(2026, 10, 10), data: JSON.stringify({ utm_source: 'facebook' }) }], from: '2026-11-01', to: '2026-11-30' });
if (rep.total.cpl !== 1e6 || !CHANNELS.facebook || !CFG_ID) return { ok: false, details: 'Tính CPL sai' };
const _o7 = AP.parseAdsCsv('Ad name,Amount spent (VND),Impressions\nA,"100,000",1000\n');
if (_o7.ads.length !== 1 || AP.metrics({ spend: 1e6, leads: 4, deals: 1, revenue: 3e6 }).cpl !== 250000) return { ok: false, details: 'Đọc tệp quảng cáo sai' };
return selftestG3(ctx);
},
};

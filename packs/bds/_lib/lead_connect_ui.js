import { h } from './kit.js';
import * as LC from './lead_connect.js';
import { paidBadge } from '../../../core/ai_cost.2fb10e6822.js';
const _o0 = `
.lc{display:flex;flex-direction:column;gap:12px;min-width:0}
.lc h3{margin:0;font-size:1.05rem}.lc h4{margin:0;font-size:.98rem}
.lc-muted{color:rgba(127,127,127,.95);font-size:.88rem}
.lc-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.lc-url{display:block;padding:10px 12px;border-radius:10px;border:1px solid rgba(127,127,127,.3);background:rgba(127,127,127,.07);overflow-wrap:anywhere;font-size:.84rem;font-family:ui-monospace,Menlo,Consolas,monospace}
.lc select{min-height:44px;border-radius:10px;padding:0 10px;max-width:100%;font:inherit;background:transparent;color:inherit;border:1px solid rgba(127,127,127,.35)}
.lc-note{border-left:4px solid var(--gold,#C9A24A);padding:8px 12px;background:rgba(201,162,74,.10);border-radius:8px;font-size:.88rem}
.lc-warn{border-left-color:#d08a1e;background:rgba(240,179,87,.14)}
.lc details{border:1px solid rgba(127,127,127,.25);border-radius:14px;padding:0 12px;min-width:0}
.lc summary{min-height:48px;display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;list-style:none;flex-wrap:wrap}
.lc summary::-webkit-details-marker{display:none}
.lc details[open]{padding-bottom:12px}
.lc ol{margin:6px 0;padding-left:22px;display:flex;flex-direction:column;gap:6px}
.lc pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:.78rem;margin:0;max-height:260px;overflow:auto;padding:10px;border-radius:10px;background:rgba(127,127,127,.09);border:1px solid rgba(127,127,127,.2)}
.lc-figs{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px}
.lc-fig{margin:0;display:flex;flex-direction:column;gap:4px}
.lc-fig img{width:100%;height:auto;border-radius:10px;border:1px solid rgba(127,127,127,.25);display:block}
.lc-fig figcaption{font-size:.8rem;color:rgba(127,127,127,.95)}
.lc-tag{display:inline-block;font-size:.72rem;font-weight:700;border-radius:999px;padding:2px 8px;background:#e8ecf5;color:#24324a}
.lc-code{display:flex;flex-direction:column;gap:6px;margin-top:8px}
.lc table{border-collapse:collapse;font-size:.82rem}.lc td{padding:3px 8px;border-bottom:1px solid rgba(127,127,127,.2);vertical-align:top}
`;
let _o4 = false;
function ensureCss() {
if (_o4 || typeof document === 'undefined') return;
_o4 = true;
try { const _og = new CSSStyleSheet(); _og.replaceSync(_o0); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _og]; } catch { }
}
export function canConnect(ctx) {
const r = ctx && ctx.user && ctx.user.role;
return !ctx || !ctx.user || r === 'owner' || r === 'manager';
}
const _o1 = {
'ladipage-1': 'Tích hợp → Tài khoản liên kết → Webhook/API: dán địa chỉ nhận khách',
'ladipage-2': 'Form → Lưu data → chọn cấu hình vừa tạo',
website: 'Dán đoạn form vào khối HTML của trang',
'gforms-1': 'Google Form → ⋮ → Apps Script: dán mã, bấm Lưu',
'gforms-2': 'Trình kích hoạt → Khi gửi biểu mẫu → hàm guiVeBDS',
make: 'Luồng: Facebook Lead Ads → HTTP POST tới địa chỉ nhận khách',
};
function _o7(key) {
const img = h('img', { src: 'assets/wizard/connect/' + key + '.png', alt: 'Ảnh minh hoạ: ' + _o1[key], loading: 'lazy', width: 1280, height: 800 });
const _o6 = h('figure', { class: 'lc-fig', 'data-testid': 'lc-img-' + key },
h('a', { href: 'assets/wizard/connect/' + key + '.png', target: '_blank', rel: 'noopener', title: 'Mở ảnh cỡ lớn' }, img),
h('figcaption', null, 'Ảnh minh hoạ – ' + _o1[key]));
img.addEventListener('error', () => _o6.remove());
return _o6;
}
export function connectSection(ctx, K, opts = {}) {
ensureCss();
const role = (ctx.user && ctx.user.role) || 'owner';
const _o9 = role === 'owner';
const _o2 = h('section', { class: 'lc lb-card bds-card', 'data-testid': 'lead-connect' },
h('h3', null, '🔌 Nối landing có sẵn'), h('p', { class: 'lc-muted' }, 'Đang tải…'));
if (!canConnect(ctx)) { _o2.replaceChildren(h('h3', null, '🔌 Nối landing có sẵn'), h('p', { class: 'lc-muted' }, 'Chỉ Quản trị và Quản lý dùng được mục này.')); return _o2; }
let info = null, ref = '';
const _oa = async () => {
try { info = await K.api('lead.intake_info'); } catch (e) {
const code = e && e.code;
_o2.replaceChildren(h('h3', null, '🔌 Nối landing có sẵn'), h('p', { class: 'lc-muted', 'data-testid': 'lc-error' },
code === 'UNKNOWN_ACTION' ? 'Máy chủ chưa có chức năng này – cần cập nhật máy chủ (Cài đặt › Phiên bản).' : (e && (e.userMessage || e.message)) || 'Chưa tải được địa chỉ nhận khách.'));
return;
}
_o5();
};
function _o5() {
const _ob = LC.isRealUrl(info && info.url);
const urlOf = (o = {}) => LC.intakeUrl(info && info.url, { ref, ...o });
if (!info || !info.key) {
_o2.replaceChildren(h('h3', null, '🔌 Nối landing có sẵn'),
h('p', { class: 'lc-muted', 'data-testid': 'lc-nokey' }, 'Chưa có địa chỉ nhận khách. Nhờ Quản trị (Admin) mở mục này một lần (app tự tạo khoá).'));
return;
}
const urlBox = h('code', { class: 'lc-url', 'data-testid': 'lc-url' }, urlOf());
const variants = LC.saleVariants(info);
const _oe = h('select', { 'aria-label': 'Khách về sale nào', 'data-testid': 'lc-sale' }, variants.map((v) => h('option', { value: v.value, selected: v.value === ref }, v.label)));
_oe.addEventListener('change', () => { ref = _oe.value; _o5(); });
const copyUrl = K.button('📋 Chép địa chỉ nhận khách', async () => {
if (!_ob) { K.toast('Bản xem thử chưa có địa chỉ thật – nối máy chủ Google rồi chép lại.', 'warn'); return; }
await K.copy(urlOf()); K.toast('Đã chép địa chỉ nhận khách', 'ok');
}, { kind: 'primary', testid: 'lc-copy' });
const testBtn = K.button('🧪 Gửi thử', () => _of(), { kind: 'ghost', testid: 'lc-test', title: 'Gửi 1 khách thử (nhãn "thử") qua đúng đường nhận khách' });
const _oc = _o9 ? K.button('🔑 Đổi khoá', () => _od(), { kind: 'ghost', testid: 'lc-rotate' }) : null;
const guides = LC.GUIDES.map((g) => _o8(g, urlOf, _ob));
const hostsIn = _o9 ? h('input', { value: (info.redirect_hosts || []).join(', '), placeholder: 'vd congty.vn, landing.congty.vn', 'data-testid': 'lc-redirect-hosts', 'aria-label': 'Tên miền trang cảm ơn' }) : null;
const hostsRow = _o9 ? h('div', { class: 'lc-row' }, h('span', { class: 'lc-muted' }, 'Tên miền trang cảm ơn (redirect):'), hostsIn,
K.button('💾 Lưu', async () => {
try { const r = await K.api('lead.intake_redirects', { hosts: hostsIn.value }); info = { ...info, redirect_hosts: r.redirect_hosts }; K.toast('Đã lưu tên miền trang cảm ơn', 'ok'); }
catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa lưu được', 'danger'); }
}, { kind: 'ghost', testid: 'lc-redirect-save' })) : null;
_o2.replaceChildren(
h('h3', null, '🔌 Nối landing có sẵn'),
h('p', { class: 'lc-muted' }, 'Đã có landing ở nơi khác (trình dựng landing, website riêng, Google Forms…)? Dán địa chỉ dưới đây vào đó – khách để lại số là về thẳng app + báo Telegram, có nguồn "webhook:…" để biết khách từ đâu. Khách đã có trong app không bị giao lại.'),
h('label', { class: 'lc-row' }, h('span', null, 'Khách về:'), _oe),
urlBox,
_ob ? null : h('p', { class: 'lc-note', 'data-testid': 'lc-demo' }, 'Bản xem thử: địa chỉ thật có sau khi nối máy chủ Google của anh/chị. "Gửi thử" vẫn chạy để xem khách hiện ra thế nào.'),
h('div', { class: 'lc-row' }, copyUrl, testBtn, _oc),
hostsRow,
h('p', { class: 'lc-note lc-warn' }, '🔒 Địa chỉ này có khoá bí mật: chỉ dán vào công cụ của anh/chị (form, webhook). Lộ ra ngoài → bấm "Đổi khoá". CTV/Sale không xem được mục này.'),
h('details', { 'data-testid': 'lc-tech' }, h('summary', null, 'ℹ️ Kỹ thuật: cách gửi, tên ô, giới hạn'),
h('ul', { class: 'lc-muted' },
h('li', null, 'POST JSON {name, phone, email?, note?, project?, source?, ref?} hoặc form thường (application/x-www-form-urlencoded) cùng tên ô. Tối đa ' + LC.MAX_BODY_KB + ' KB/lượt.'),
h('li', null, 'Webhook từ máy chủ khác (Make, Zapier, trình dựng landing, Apps Script): chạy bình thường, nhận {"ok":true}. Lỗi: {"ok":false,"status":403|400|429…}.'),
h('li', null, 'Từ trình duyệt: máy chủ Google không cho đọc câu trả lời từ trang khác (CORS) → dùng form POST thường (hiện trang cảm ơn, có thể quay về trang https riêng qua ô redirect – chỉ tên miền đã khai ở trên) hoặc fetch mode:"no-cors".'),
h('li', null, 'Mỗi số điện thoại tối đa 3 lượt / 10 phút; mỗi nguồn (ô src) tối đa 30 lượt / 10 phút; ô bẫy "hp" có chữ → bỏ qua (máy quét). Ô lạ được ghi vào Ghi chú (đã làm sạch, cắt ngắn).'),
h('li', null, 'Khách đã có trong app: form KHÔNG đổi ô "đồng ý" (ai cũng gửi được số của người khác) – app ghi 1 lượt đồng ý chưa xác minh để anh/chị hỏi lại khách.')),
h('table', null, LC.FIELD_HELP.map(([a, b]) => h('tr', null, h('td', null, a), h('td', null, h('code', null, b)))))),
h('h4', null, 'Hướng dẫn từng nơi'),
...guides);
}
function _o3(title, text, testid) {
return h('div', { class: 'lc-code' },
h('div', { class: 'lc-row' }, h('b', null, title), K.button('Chép', async () => { await K.copy(text); K.toast('Đã chép ' + title.toLowerCase(), 'ok'); }, { kind: 'ghost', icon: 'copy', testid: testid + '-copy' })),
h('pre', { 'data-testid': testid }, text));
}
function _o8(g, urlOf, _ob) {
const url = urlOf({ src: g.src });
const body = [];
if (g.note) body.push(h('p', { class: 'lc-note' + (g.paid ? ' lc-warn' : '') }, g.note));
body.push(h('ol', null, g.steps.map((s) => h('li', null, s))));
body.push(h('p', { class: 'lc-muted' }, 'Địa chỉ cho mục này (đã gắn nguồn "' + LC.srcLabel(g.src) + '"):'), h('code', { class: 'lc-url', 'data-testid': 'lc-url-' + g.id }, url));
if (_ob) body.push(h('div', { class: 'lc-row' }, K.button('📋 Chép địa chỉ', async () => { await K.copy(url); K.toast('Đã chép địa chỉ', 'ok'); }, { kind: 'ghost', testid: 'lc-copy-' + g.id })));
const org = opts.org || '';
if (g.id === 'website') {
body.push(_o3('Đoạn form HTML', LC.formSnippet(url, { org, src: g.src }), 'lc-snip-form'));
body.push(_o3('Đoạn JS (form có sẵn)', LC.fetchSnippet(url, { src: g.src }), 'lc-snip-js'));
} else if (g.id === 'gforms') {
body.push(_o3('Mã cho Google Forms', LC.gformsScript(url), 'lc-snip-gforms'));
} else if (g.id === 'facebook' || g.id === 'ladipage') {
body.push(_o3('Mẫu thân JSON', LC.jsonSample(g.src), 'lc-snip-json-' + g.id));
}
body.push(h('p', { class: 'lc-muted' }, h('b', null, 'Lời đồng ý (dán cạnh ô tick): '), LC.consentText(org)));
body.push(h('p', { class: 'lc-note', 'data-testid': 'lc-consent-need-' + g.id }, 'Form cần có ô tick đồng ý bắt buộc (trường consent). Khách tick → app ghi vào Nhật ký đồng ý; form không có ô này → khách vẫn được lưu nhưng ở trạng thái "chưa đồng ý", cần hỏi lại khách trước khi chăm sóc.'));
body.push(h('div', { class: 'lc-figs' }, g.img.map(_o7)));
const sum = h('summary', { 'data-testid': 'lc-guide-' + g.id }, g.icon + ' ' + g.title,
g.advanced ? h('span', { class: 'lc-tag' }, 'nâng cao') : null,
g.paid ? paidBadge('Dịch vụ nối trung gian (Make, Zapier…) tính phí theo gói/lượt chạy trên tài khoản của anh/chị – BDS Studio không thu thêm.') : null);
return h('details', { 'data-testid': 'lc-d-' + g.id }, sum, ...body);
}
async function _of() {
try {
await K.api('lead.intake', { key: info.key, ref, src: 'thu', test: 1, body: { name: 'Khách thử (nối landing)', phone: '0900000000', note: 'Gửi thử từ mục Nối landing có sẵn', source: 'thu' } });
K.toast('Đã gửi thử – khách "Khách thử (nối landing)" nằm trong Khách hàng (nhãn "thử", nguồn webhook:thu)', 'ok');
try { if (ctx.store && typeof ctx.store.syncNow === 'function') ctx.store.syncNow(); } catch { }
} catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa gửi thử được', 'danger'); }
}
async function _od() {
const ok = await K.confirm({ title: 'Đổi khoá nhận khách', kind: 'danger', ok: 'Đổi khoá', testid: 'lc-rotate-confirm',
text: 'Tạo khoá mới cho địa chỉ nhận khách. MỌI địa chỉ cũ (đã dán vào trình dựng landing, website, Google Forms, Make/Zapier, link riêng của sale) sẽ NGỪNG nhận khách ngay – anh/chị phải dán lại địa chỉ mới vào từng nơi. Chỉ đổi khi nghi bị lộ.' });
if (!ok) return;
try { const r = await K.api('lead.intake_rotate'); info = { ...info, ...r }; await _oa(); K.toast('Đã đổi khoá – dán lại địa chỉ mới vào các nơi đang dùng', 'ok'); }
catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa đổi được khoá', 'danger'); }
}
_oa();
return _o2;
}
export function openConnect(ctx, K, opts = {}) {
const _og = K.sheet({ title: '🔌 Nối landing có sẵn', testid: 'lead-connect-sheet', body: connectSection(ctx, K, opts) });
return _og;
}

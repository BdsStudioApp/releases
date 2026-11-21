import { h } from './kit.js';
import * as LC from './lead_connect.js';
import { paidBadge } from '../../../core/ai_cost.9624f9fc85.js';
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
.lc-src{display:flex;flex-direction:column;gap:8px;border:1px solid rgba(127,127,127,.25);border-radius:14px;padding:10px 12px;min-width:0}
.lc-chips{display:flex;flex-wrap:wrap;gap:6px}
.lc-form{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px}
.lc-form input,.lc-form select{min-height:44px;width:100%;box-sizing:border-box}
.lc-ok{border-left-color:#2e9d5b;background:rgba(46,157,91,.10)}
.lc-tabs{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.lc-tab{padding:8px 12px;min-height:44px;border-radius:999px;border:1px solid rgba(127,127,127,.35);background:transparent;color:inherit;cursor:pointer;font:inherit}.lc-tab[aria-selected="true"]{background:rgba(212,175,55,.18);border-color:rgba(212,175,55,.7);font-weight:600}.lc-panel{border:1px solid rgba(127,127,127,.25);border-radius:10px;padding:10px 12px;margin-bottom:10px}.lc-fields{font-size:.88rem;margin:6px 0}.lc table{border-collapse:collapse;font-size:.82rem}.lc td{padding:3px 8px;border-bottom:1px solid rgba(127,127,127,.2);vertical-align:top}
`;
let _o4 = false;
function ensureCss() {
if (_o4 || typeof document === 'undefined') return;
_o4 = true;
try { const _on = new CSSStyleSheet(); _on.replaceSync(_o0); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _on]; } catch { }
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
function _o8(key) {
const img = h('img', { src: 'assets/wizard/connect/' + key + '.png', alt: 'Ảnh minh hoạ: ' + _o1[key], loading: 'lazy', width: 1280, height: 800 });
const _o7 = h('figure', { class: 'lc-fig', 'data-testid': 'lc-img-' + key },
h('a', { href: 'assets/wizard/connect/' + key + '.png', target: '_blank', rel: 'noopener', title: 'Mở ảnh cỡ lớn' }, img),
h('figcaption', null, 'Ảnh minh hoạ – ' + _o1[key]));
img.addEventListener('error', () => _o7.remove());
return _o7;
}
export function connectSection(ctx, K, opts = {}) {
ensureCss();
const role = (ctx.user && ctx.user.role) || 'owner';
const _oe = role === 'owner';
const box = h('section', { class: 'lc lb-card bds-card', 'data-testid': 'lead-connect' },
h('h3', null, '🔌 Nối landing có sẵn'), h('p', { class: 'lc-muted' }, 'Đang tải…'));
if (!canConnect(ctx)) { box.replaceChildren(h('h3', null, '🔌 Nối landing có sẵn'), h('p', { class: 'lc-muted' }, 'Chỉ Quản trị và Quản lý dùng được mục này.')); return box; }
let info = null, ref = '', gsrc = '';
let _ob = 'ladipage';
const testOut = h('div', { class: 'lc-note', 'data-testid': 'lc-test-result', role: 'status', 'aria-live': 'polite', style: 'display:none' });
const _of = async () => {
try { info = await K.api('lead.intake_info'); } catch (e) {
const code = e && e.code;
box.replaceChildren(h('h3', null, '🔌 Nối landing có sẵn'), h('p', { class: 'lc-muted', 'data-testid': 'lc-error' },
code === 'UNKNOWN_ACTION' ? 'Máy chủ chưa có chức năng này – cần cập nhật máy chủ (Cài đặt › Phiên bản).' : (e && (e.userMessage || e.message)) || 'Chưa tải được địa chỉ nhận khách.'));
return;
}
_o6();
};
function _o6() {
const _oj = LC.isRealUrl(info && info.url);
const urlOf = (o = {}) => LC.intakeUrl(info && info.url, { ref, ...o });
if (!info || !info.key) {
box.replaceChildren(h('h3', null, '🔌 Nối landing có sẵn'),
h('p', { class: 'lc-muted', 'data-testid': 'lc-nokey' }, 'Chưa có địa chỉ nhận khách. Nhờ Quản trị (Admin) mở mục này một lần (app tự tạo khoá).'));
return;
}
const urlBox = h('code', { class: 'lc-url', 'data-testid': 'lc-url' }, urlOf());
ref = '';
const copyUrl = K.button('📋 Chép địa chỉ nhận khách', async () => {
if (!_oj) { K.toast('Bản xem thử chưa có địa chỉ thật – nối máy chủ Google rồi chép lại.', 'warn'); return; }
await K.copy(urlOf()); K.toast('Đã chép địa chỉ nhận khách', 'ok');
}, { kind: 'primary', testid: 'lc-copy' });
const testBtn = K.button('🧪 Gửi thử', () => _om(''), { kind: 'ghost', testid: 'lc-test', title: 'Gửi 1 khách thử (đánh dấu "thử") qua đúng đường nhận khách' });
const _ok = _oe ? K.button('🔑 Đổi khoá', () => _ol(), { kind: 'ghost', testid: 'lc-rotate' }) : null;
const sources = Array.isArray(info.sources) ? info.sources : [];
if (gsrc && !sources.some((x) => x.label === gsrc)) gsrc = '';
const _od = LC.GUIDES.map((g) => _oc(g, urlOf, _oj));
const _oa = sources.length ? h('select', { 'aria-label': 'Địa chỉ dùng trong hướng dẫn', 'data-testid': 'lc-guide-src' },
h('option', { value: '' }, 'Nhãn mặc định từng nơi'), sources.map((x) => h('option', { value: x.label, selected: x.label === gsrc }, 'Nguồn: ' + x.name))) : null;
if (_oa) _oa.addEventListener('change', () => { gsrc = _oa.value; _o6(); });
const hostsIn = _oe ? h('input', { value: (info.redirect_hosts || []).join(', '), placeholder: 'vd congty.vn, landing.congty.vn', 'data-testid': 'lc-redirect-hosts', 'aria-label': 'Tên miền trang cảm ơn' }) : null;
const hostsRow = _oe ? h('div', { class: 'lc-row' }, h('span', { class: 'lc-muted' }, 'Tên miền trang cảm ơn (redirect):'), hostsIn,
K.button('💾 Lưu', async () => {
try { const r = await K.api('lead.intake_redirects', { hosts: hostsIn.value }); info = { ...info, redirect_hosts: r.redirect_hosts }; K.toast('Đã lưu tên miền trang cảm ơn', 'ok'); }
catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa lưu được', 'danger'); }
}, { kind: 'ghost', testid: 'lc-redirect-save' })) : null;
box.replaceChildren(
h('h3', null, '🔌 Nối landing có sẵn'),
h('p', { class: 'lc-muted' }, 'Đã có landing ở nơi khác (trình dựng landing, website riêng, Google Forms…)? Dán địa chỉ dưới đây vào đó – khách để lại số là về thẳng app + báo Telegram, có nguồn "webhook:…" để biết khách từ đâu. Khách đã có trong app không bị giao lại.'),
h('p', { class: 'lc-note', 'data-testid': 'lc-pool-note' }, info.pool ? '📥 Khách về Kho lead công ty (kho chung của Quản trị), rồi chia số cho sale như thường.' : '📥 Khách về danh sách Khách hàng chung của Quản trị.'),
urlBox,
_oj ? null : h('p', { class: 'lc-note', 'data-testid': 'lc-demo' }, 'Bản xem thử: địa chỉ thật có sau khi nối máy chủ Google của anh/chị. "Gửi thử" vẫn chạy để xem khách hiện ra thế nào.'),
h('div', { class: 'lc-row' }, copyUrl, testBtn, _ok),
testOut,
h('h4', { 'data-testid': 'lc-where' }, '📍 Dán địa chỉ này vào đâu? Chọn nơi anh/chị đang làm landing:'),
h('p', { class: 'lc-note', 'data-testid': 'lc-additive' }, 'Nối thêm, không thay: landing / Google Sheet / email đang nhận khách vẫn chạy y như cũ – app chỉ nhận THÊM 1 bản. Số điện thoại đã có (trong Kho lead hoặc Khách hàng) không bị tạo trùng.'),
_oa ? h('label', { class: 'lc-row' }, h('span', { class: 'lc-muted' }, 'Địa chỉ trong hướng dẫn:'), _oa) : null,
h('div', { class: 'lc-tabs', role: 'tablist' }, LC.GUIDES.map((g) => h('button', { type: 'button', role: 'tab', class: 'lc-tab', 'aria-selected': String(g.id === _ob), 'data-testid': 'lc-guide-' + g.id, onclick: () => { _ob = g.id; _o6(); } },
g.icon + ' ' + g.title, g.advanced ? h('span', { class: 'lc-tag' }, 'nâng cao') : null,
g.paid ? paidBadge('Dịch vụ nối trung gian (Make, Zapier, Pabbly…) tính phí theo gói/lượt chạy trên tài khoản của anh/chị – BDS Studio không thu thêm.') : null))),
_od.find((x) => x.dataset.gid === _ob) || _od[0],
_op(sources, _oj),
hostsRow,
h('p', { class: 'lc-note lc-warn' }, '🔒 Địa chỉ này có khoá bí mật: chỉ dán vào công cụ của anh/chị (form, webhook). Lộ ra ngoài → bấm "Đổi khoá". CTV/Sale không xem được mục này.'),
h('details', { 'data-testid': 'lc-tech' }, h('summary', null, 'ℹ️ Kỹ thuật: cách gửi, tên ô, giới hạn'),
h('ul', { class: 'lc-muted' },
h('li', null, 'POST JSON {name, phone, email?, note?, project?, source?, ref?} hoặc form thường (application/x-www-form-urlencoded) cùng tên ô. Tối đa ' + LC.MAX_BODY_KB + ' KB/lượt.'),
h('li', null, 'Webhook từ máy chủ khác (Make, Zapier, trình dựng landing, Apps Script): chạy bình thường, nhận {"ok":true}. Lỗi: {"ok":false,"status":403|400|429…}.'),
h('li', null, 'Từ trình duyệt: máy chủ Google không cho đọc câu trả lời từ trang khác (CORS) → dùng form POST thường (hiện trang cảm ơn, có thể quay về trang https riêng qua ô redirect – chỉ tên miền đã khai ở trên) hoặc fetch mode:"no-cors".'),
h('li', null, 'Mỗi số điện thoại tối đa 3 lượt / 10 phút; mỗi nguồn (ô src) tối đa 30 lượt / 10 phút; ô bẫy "hp" có chữ → bỏ qua (máy quét). Ô lạ được ghi vào Ghi chú (đã làm sạch, cắt ngắn).'),
h('li', null, 'Khách đã có trong app: form KHÔNG đổi ô "đồng ý" (ai cũng gửi được số của người khác) – app ghi 1 lượt đồng ý chưa xác minh để anh/chị hỏi lại khách.')),
h('table', null, LC.FIELD_HELP.map(([a, b]) => h('tr', null, h('td', null, a), h('td', null, h('code', null, b)))))),);
}
function _o2(t) { return t ? h('span', { class: 'lc-tag' }, t) : null; }
function _op(sources, _oj) {
const _oi = info.pool ? ' Bản Công ty: khách không gắn sale vào Kho lead công ty với đúng kênh / chiến dịch → đẩy số cho nhóm như thường.' : '';
const rows = sources.map((x) => {
const url = _oj && x.url ? x.url : LC.intakeUrl(info.url, { src: x.label });
const last = x.last_at ? new Date(x.last_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }) : '';
return h('div', { class: 'lc-src', 'data-testid': 'lc-src-row-' + x.label },
h('div', { class: 'lc-row' }, h('b', null, x.name), h('span', { class: 'lc-muted' }, 'nhãn ' + x.label)),
h('div', { class: 'lc-chips' }, _o2(LC.channelLabel(x.channel) && 'Kênh: ' + LC.channelLabel(x.channel)), _o2(x.campaign && 'Chiến dịch: ' + x.campaign),
_o2(x.adset && 'Nhóm QC: ' + x.adset), _o2(x.project && 'Dự án: ' + x.project)),
h('p', { class: 'lc-muted', 'data-testid': 'lc-src-stat-' + x.label }, x.leads ? x.leads + ' khách (30 ngày) · lần cuối ' + last : 'Chưa có khách thật qua địa chỉ này.'),
h('code', { class: 'lc-url', 'data-testid': 'lc-src-url-' + x.label }, url),
h('div', { class: 'lc-row' },
K.button('📋 Chép', async () => {
if (!_oj) { K.toast('Bản xem thử chưa có địa chỉ thật – nối máy chủ Google rồi chép lại.', 'warn'); return; }
await K.copy(url); K.toast('Đã chép địa chỉ nguồn ' + x.name, 'ok');
}, { kind: 'primary', testid: 'lc-src-copy-' + x.label }),
K.button('🧪 Gửi thử', () => _om(x.label), { kind: 'ghost', testid: 'lc-src-test-' + x.label }),
_oe ? K.button('Sửa', () => openForm(x), { kind: 'ghost', testid: 'lc-src-edit-' + x.label }) : null,
_oe ? K.button('Xoá', () => _o5(x), { kind: 'ghost', testid: 'lc-src-del-' + x.label }) : null));
});
const _o9 = h('div', { 'data-testid': 'lc-src-form-box' });
const addBtn = _oe ? K.button('➕ Thêm nguồn', () => openForm(null), { kind: 'ghost', testid: 'lc-src-add' }) : null;
function openForm(x) {
const name = h('input', { value: x ? x.name : '', placeholder: 'Tên nguồn, vd "LP dự án A – FB tháng 11"', maxlength: 60, 'aria-label': 'Tên nguồn', 'data-testid': 'lc-src-name' });
const ch = h('select', { 'aria-label': 'Kênh quảng cáo', 'data-testid': 'lc-src-channel' }, h('option', { value: '' }, 'Kênh: theo UTM của form'),
LC.CHANNELS.map(([k, l]) => h('option', { value: k, selected: !!x && x.channel === k }, l)));
const cp = h('input', { value: x ? x.campaign : '', placeholder: 'Chiến dịch (không bắt buộc)', maxlength: 120, 'aria-label': 'Chiến dịch', 'data-testid': 'lc-src-campaign' });
const ads = h('input', { value: x ? x.adset : '', placeholder: 'Nhóm quảng cáo (không bắt buộc)', maxlength: 120, 'aria-label': 'Nhóm quảng cáo', 'data-testid': 'lc-src-adset' });
const _oh = h('input', { value: x ? x.project : '', placeholder: 'Dự án (không bắt buộc)', maxlength: 120, 'aria-label': 'Dự án', 'data-testid': 'lc-src-project' });
const save = K.button('💾 Lưu nguồn', async () => {
try {
const r = await K.api('lead.intake_source_save', { source: { label: x ? x.label : '', name: name.value, channel: ch.value, campaign: cp.value, adset: ads.value, project: _oh.value } });
info = { ...info, sources: r.sources }; _o6();
K.toast('Đã lưu nguồn – chép địa chỉ dán vào landing', 'ok');
} catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa lưu được nguồn', 'danger'); }
}, { kind: 'primary', testid: 'lc-src-save' });
_o9.replaceChildren(h('div', { class: 'lc-src' },
h('b', null, x ? 'Sửa nguồn' : 'Nguồn mới'),
h('div', { class: 'lc-form' }, name, ch, cp, ads, _oh),
h('p', { class: 'lc-muted' }, 'Kênh/chiến dịch ở đây là mặc định: form gửi kèm utm_source / utm_campaign (từ link quảng cáo) thì app lấy theo form. Đổi chiến dịch không cần dán lại địa chỉ.'),
h('div', { class: 'lc-row' }, save, K.button('Huỷ', () => _o9.replaceChildren(), { kind: 'ghost', testid: 'lc-src-cancel' }))));
name.focus();
}
return h('section', { class: 'lc', 'data-testid': 'lc-sources' },
h('h4', null, '📣 Nguồn quảng cáo (mỗi landing một địa chỉ)'),
h('p', { class: 'lc-muted' }, 'Tạo 1 nguồn cho mỗi landing / chiến dịch đang chạy quảng cáo → mỗi khách tự mang kênh + chiến dịch, báo cáo biết nguồn nào ra khách.' + _oi),
...(rows.length ? rows : [h('p', { class: 'lc-muted', 'data-testid': 'lc-src-empty' }, _oe ? 'Chưa có nguồn nào – bấm "Thêm nguồn".' : 'Chưa có nguồn nào – nhờ Quản trị thêm.')]),
addBtn, _o9);
}
async function _o5(x) {
const ok = await K.confirm({ title: 'Xoá nguồn "' + x.name + '"', kind: 'danger', ok: 'Xoá nguồn', testid: 'lc-src-del-confirm',
text: 'Địa chỉ của nguồn này VẪN nhận khách (cùng khoá chung) nhưng không còn tự gắn kênh / chiến dịch. Muốn chặn hẳn thì bấm "Đổi khoá".' });
if (!ok) return;
try { const r = await K.api('lead.intake_source_delete', { label: x.label }); info = { ...info, sources: r.sources }; _o6(); K.toast('Đã xoá nguồn', 'ok'); }
catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa xoá được', 'danger'); }
}
function _o3(title, text, testid) {
return h('div', { class: 'lc-code' },
h('div', { class: 'lc-row' }, h('b', null, title), K.button('Chép', async () => { await K.copy(text); K.toast('Đã chép ' + title.toLowerCase(), 'ok'); }, { kind: 'ghost', icon: 'copy', testid: testid + '-copy' })),
h('pre', { 'data-testid': testid }, text));
}
function _oc(g, urlOf, _oj) {
const url = urlOf({ src: gsrc || g.src });
const body = [];
if (g.note) body.push(h('p', { class: 'lc-note' + (g.paid ? ' lc-warn' : '') }, g.note));
body.push(h('ol', null, g.steps.map((s) => h('li', null, s))));
body.push(h('div', { class: 'lc-fields', 'data-testid': 'lc-fields-' + g.id }, h('b', null, 'Ô cần khớp: '), 'Họ tên → ', h('code', null, 'name'), ' · Số điện thoại → ', h('code', null, 'phone'), ' (bắt buộc) · Email → ', h('code', null, 'email'), ' · Ghi chú → ', h('code', null, 'note'), ' · Đồng ý → ', h('code', null, 'consent'), '. App cũng tự nhận tên quen thuộc (Họ tên, Số điện thoại, your-tel, phone_number…).'));
body.push(h('div', { class: 'lc-row' }, K.button('🧪 Gửi thử', () => _om(gsrc), { kind: 'ghost', testid: 'lc-test-' + g.id, title: 'Gửi 1 khách thử để xem đường nhận khách chạy chưa' })));
body.push(h('p', { class: 'lc-muted' }, 'Địa chỉ cho mục này (đã gắn nguồn "' + LC.srcLabel(gsrc || g.src) + '"):'), h('code', { class: 'lc-url', 'data-testid': 'lc-url-' + g.id }, url));
if (_oj) body.push(h('div', { class: 'lc-row' }, K.button('📋 Chép địa chỉ', async () => { await K.copy(url); K.toast('Đã chép địa chỉ', 'ok'); }, { kind: 'ghost', testid: 'lc-copy-' + g.id })));
const org = opts.org || '';
if (g.id === 'website') {
body.push(_o3('Đoạn form HTML', LC.formSnippet(url, { org, src: g.src }), 'lc-snip-form'));
body.push(_o3('Đoạn JS (form có sẵn)', LC.fetchSnippet(url, { src: g.src }), 'lc-snip-js'));
} else if (g.id === 'gforms') {
body.push(_o3('Mã cho Google Forms', LC.gformsScript(url), 'lc-snip-gforms'));
} else if (g.id === 'gsheet') {
body.push(_o3('Mã cho Google Sheet', LC.gsheetScript(url, { src: gsrc || g.src }), 'lc-snip-gsheet'));
} else if (g.id === 'facebook' || g.id === 'ladipage') {
body.push(_o3('Mẫu thân JSON', LC.jsonSample(g.src), 'lc-snip-json-' + g.id));
}
body.push(h('p', { class: 'lc-muted' }, h('b', null, 'Lời đồng ý (dán cạnh ô tick): '), LC.consentText(org)));
body.push(h('p', { class: 'lc-note', 'data-testid': 'lc-consent-need-' + g.id }, 'Form cần có ô tick đồng ý bắt buộc (trường consent). Khách tick → app ghi vào Nhật ký đồng ý; form không có ô này → khách vẫn được lưu nhưng ở trạng thái "chưa đồng ý", cần hỏi lại khách trước khi chăm sóc.'));
body.push(h('div', { class: 'lc-figs' }, g.img.map(_o8)));
return h('div', { class: 'lc-panel', role: 'tabpanel', 'data-testid': 'lc-d-' + g.id, dataset: { gid: g.id } }, ...body);
}
function _oo(kind, text) { testOut.className = 'lc-note' + (kind === 'ok' ? ' lc-ok' : ' lc-warn'); testOut.textContent = text; testOut.style.display = ''; }
async function _om(src) {
let r;
try { r = await K.api('lead.intake_test', { src: src || 'thu', ref }); } catch (e) {
if (e && e.code === 'UNKNOWN_ACTION') {
try {
await K.api('lead.intake', { key: info.key, ref, src: src || 'thu', test: 1, body: { name: 'Khách thử (nối landing)', phone: '0900000000', note: 'Gửi thử từ mục Nối landing có sẵn', source: src || 'thu' } });
_oo('ok', 'Đã gửi thử – khách "Khách thử (nối landing)" nằm trong Khách hàng (nhãn "thử"). Cập nhật máy chủ để xem kết quả chi tiết.');
} catch (e2) { _oo('warn', (e2 && (e2.userMessage || e2.message)) || 'Chưa gửi thử được'); }
return;
}
_oo('warn', '❌ Chưa gửi thử được: ' + ((e && (e.userMessage || e.message)) || 'lỗi không rõ'));
return;
}
const _og = ['Kênh: ' + (r.channel_label || LC.channelLabel(r.channel) || 'Landing'), r.campaign ? 'Chiến dịch: ' + r.campaign : 'chưa có chiến dịch', r.adset ? 'Nhóm QC: ' + r.adset : '', 'Nguồn: ' + r.source].filter(Boolean).join(' · ');
if (r.throttled) _oo('warn', '⏳ Đã gửi thử quá 3 lần trong 10 phút với số thử – chờ ít phút rồi gửi lại (giới hạn chống gửi lặp, khách thật không bị ảnh hưởng).');
else if (r.where === 'pool' && r.added) _oo('ok', '✅ Đã vào Kho lead công ty: "' + r.name + '" (số 0900000000) · ' + _og + '. Khách thử có tên "Khách thử…", gửi thử lại sẽ thay bản cũ chưa đẩy; lỡ đẩy cho sale thì xoá trong Kho lead.');
else if (r.where === 'pool') _oo('warn', '⚠️ Đường nhận khách chạy, nhưng khách thử cũ đã được đẩy cho sale nên kho báo trùng số. Xoá khách thử trong Kho lead rồi gửi lại.');
else if (r.added) _oo('ok', '✅ Đã vào Khách hàng: "' + r.name + '" (nhãn "thử") · ' + _og + '. Xoá như khách thường khi xong.');
else _oo('ok', '✅ Đường nhận khách chạy – khách thử đã có trong Khách hàng nên app ghi thêm 1 lượt vào khách đó (không tạo trùng).');
try { if (ctx.store && typeof ctx.store.syncNow === 'function') ctx.store.syncNow(); } catch { }
}
async function _ol() {
const ok = await K.confirm({ title: 'Đổi khoá nhận khách', kind: 'danger', ok: 'Đổi khoá', testid: 'lc-rotate-confirm',
text: 'Tạo khoá mới cho địa chỉ nhận khách. MỌI địa chỉ cũ (đã dán vào trình dựng landing, website, Google Forms, Make/Zapier, link riêng của sale) sẽ NGỪNG nhận khách ngay – anh/chị phải dán lại địa chỉ mới vào từng nơi. Chỉ đổi khi nghi bị lộ.' });
if (!ok) return;
try { const r = await K.api('lead.intake_rotate'); info = { ...info, ...r }; await _of(); K.toast('Đã đổi khoá – dán lại địa chỉ mới vào các nơi đang dùng', 'ok'); }
catch (e) { K.toast((e && (e.userMessage || e.message)) || 'Chưa đổi được khoá', 'danger'); }
}
_of();
return box;
}
export function openConnect(ctx, K, opts = {}) {
const _on = K.sheet({ title: '🔌 Nối landing có sẵn', testid: 'lead-connect-sheet', body: connectSection(ctx, K, opts) });
return _on;
}

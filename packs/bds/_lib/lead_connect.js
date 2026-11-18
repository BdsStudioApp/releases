export const PLACEHOLDER_URL = 'https://script.google.com/macros/s/…/exec?lead=…';
export const MAX_BODY_KB = 20;
export function consentText(org) {
const _o5 = String(org || '').trim().slice(0, 80) || 'chúng tôi';
return `Tôi đồng ý để ${_o5} lưu và sử dụng họ tên, số điện thoại, email tôi cung cấp để liên hệ tư vấn bất động sản. ` +
'Tôi có thể yêu cầu xem, sửa hoặc xoá thông tin này bất cứ lúc nào (Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15).';
}
const _o0 = /[^a-z0-9_-]+/g;
export function srcLabel(v) {
return String(v || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
.replace(_o0, '-').replace(/^-+|-+$/g, '').slice(0, 24) || 'web';
}
export function intakeUrl(url, { ref = '', src = '' } = {}) {
let _o4 = String(url || '');
if (!/^https:\/\/[^\s]+\?lead=[a-z2-7]{8,}/i.test(_o4)) return PLACEHOLDER_URL + (ref ? '&ref=' + ref : '') + (src ? '&src=' + srcLabel(src) : '');
_o4 = _o4.replace(/&ref=[^&]*/g, '').replace(/&src=[^&]*/g, '');
if (ref && /^[a-z2-7]{8}$/.test(ref)) _o4 += '&ref=' + ref;
if (src) _o4 += '&src=' + srcLabel(src);
return _o4;
}
export const isRealUrl = (_o4) => /^https:\/\/[^\s…]+\?lead=[a-z2-7]{8,}/i.test(String(_o4 || ''));
export function saleVariants(info) {
const _o1 = [{ value: '', label: 'Chung – không gắn sale (khách vào danh sách chung)' }];
for (const _o3 of (info && info.sales) || []) {
if (!_o3 || !_o3.code) continue;
const role = { owner: 'Quản trị', manager: 'Quản lý', sale: 'Sale', ctv: 'CTV' }[_o3.role] || _o3.role || '';
_o1.push({ value: _o3.code, label: (_o3.full_name || _o3.username) + (role ? ' · ' + role : '') + ' (ref=' + _o3.code + ')' });
}
return _o1;
}
const esc = (_o3) => String(_o3 == null ? '' : _o3).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function formSnippet(url, { org = '', src = 'website', redirect = '', project = '' } = {}) {
const _o4 = intakeUrl(url, {});
const _o2 = /^https:\/\//i.test(String(redirect || '')) ? String(redirect) : '';
return [
'<!-- BDS Studio – form nhận khách. Dán vào website / khối HTML của trình dựng landing. Giữ nguyên tên các ô (name=…). -->',
`<form action="${esc(_o4)}" method="POST" accept-charset="UTF-8" style="display:grid;gap:10px;max-width:420px">`,
'  <input type="hidden" name="_format" value="html">',
`  <input type="hidden" name="source" value="${esc(srcLabel(src))}">`,
project ? `  <input type="hidden" name="project" value="${esc(project)}">` : '  <!-- <input type="hidden" name="project" value="Tên dự án"> -->',
_o2 ? `  <input type="hidden" name="redirect" value="${esc(_o2)}">` : '  <!-- có trang cảm ơn riêng (https): <input type="hidden" name="redirect" value="https://…/cam-on"> -->',
'  <input name="name" placeholder="Họ và tên" required maxlength="120" autocomplete="name">',
'  <input name="phone" type="tel" placeholder="Số điện thoại" required maxlength="15" autocomplete="tel" pattern="[0-9+ .]{9,15}">',
'  <input name="email" type="email" placeholder="Email (không bắt buộc)" maxlength="120" autocomplete="email">',
'  <textarea name="note" placeholder="Anh/chị cần tư vấn gì?" maxlength="500"></textarea>',
'  <!-- ô bẫy máy quét: người thật không thấy, để trống -->',
'  <div style="position:absolute;left:-9999px" aria-hidden="true"><input name="hp" tabindex="-1" autocomplete="off"></div>',
`  <label style="font-size:14px"><input type="checkbox" name="consent" value="1" required> ${esc(consentText(org))}</label>`,
'  <button type="submit">Gửi thông tin</button>',
'</form>',
].join('\n');
}
export function fetchSnippet(url, { src = 'website', selector = 'form' } = {}) {
const _o4 = intakeUrl(url, {});
return [
'<script>',
'/* BDS Studio – gửi khách từ form có sẵn về app. Dán ngay trước </body>. Đổi "form" thành đúng form của anh/chị (vd "#form-dang-ky"). */',
'(function () {',
`  var URL_NHAN = ${JSON.stringify(_o4)};`,
`  var form = document.querySelector(${JSON.stringify(selector)});`,
'  if (!form) return;',
"  form.addEventListener('submit', function () {",
'    var fd = new FormData(form), body = new URLSearchParams();',
"    if (fd.get('hp')) return;                       // ô bẫy máy quét có chữ → không gửi",
"    fd.forEach(function (v, k) { if (typeof v === 'string') body.append(k, v); });",
`    body.append('source', ${JSON.stringify(srcLabel(src))});`,
'    // Máy chủ Google không cho đọc câu trả lời từ trang khác (CORS) → mode "no-cors": khách vẫn về app, chỉ không đọc được kết quả.',
"    fetch(URL_NHAN, { method: 'POST', mode: 'no-cors', keepalive: true, body: body });",
'  });',
'})();',
'</script>',
].join('\n');
}
export function gformsScript(url) {
const _o4 = intakeUrl(url, { src: 'google-forms' });
return [
'// BDS Studio – gửi câu trả lời Google Form về app. Dán vào Google Form › ⋮ › Apps Script, bấm Lưu,',
'// rồi thêm trình kích hoạt: hàm guiVeBDS · Từ biểu mẫu · Khi gửi biểu mẫu.',
'// Đặt tên câu hỏi: "Họ và tên", "Số điện thoại" (bắt buộc), "Email", "Ghi chú", "Dự án" + câu "Đồng ý" (hộp kiểm, bắt buộc).',
`var URL_NHAN = ${JSON.stringify(_o4)};`,
'',
'function guiVeBDS(e) {',
"  var data = { source: 'google-forms', lead_id: e.response.getId() };",
'  e.response.getItemResponses().forEach(function (r) {',
'    var v = r.getResponse();',
"    data[r.getItem().getTitle()] = Array.isArray(v) ? v.join(', ') : String(v);",
'  });',
'  var email = e.response.getRespondentEmail();',
'  if (email) data.email = email;',
"  var res = UrlFetchApp.fetch(URL_NHAN, { method: 'post', contentType: 'application/json', payload: JSON.stringify(data), muteHttpExceptions: true });",
"  if (res.getResponseCode() >= 400) console.warn('BDS Studio chưa nhận: HTTP ' + res.getResponseCode());",
'}',
].join('\n');
}
export function jsonSample(src = 'facebook') {
return JSON.stringify({ name: '{{Họ tên}}', phone: '{{Số điện thoại}}', email: '{{Email}}', note: '{{Câu trả lời khác}}', project: 'Tên dự án', source: srcLabel(src) }, null, 2);
}
export const FIELD_HELP = [
['Họ tên', 'name, ho_ten, full_name, fullname, ten, "Họ và tên"'],
['Số điện thoại', 'phone, sdt, so_dien_thoai, phone_number, mobile, "Số điện thoại"'],
['Email', 'email'],
['Ghi chú', 'note, ghi_chu, message, content, "Lời nhắn"'],
['Dự án', 'project, du_an'],
['Nguồn', 'source (hoặc &src=… trên địa chỉ)'],
['Sale phụ trách', 'ref (hoặc &ref=… trên địa chỉ)'],
];
export const GUIDES = [
{
id: 'ladipage', icon: '🧩', title: 'Trình dựng landing (Ladipage…)', src: 'ladipage',
note: 'Tên mục trong trình dựng landing có thể khác chút theo phiên bản – tìm mục Tích hợp / Webhook / API.',
steps: [
'Chép địa chỉ nhận khách ở trên (chọn sale nếu muốn khách về thẳng sale đó).',
'Trong trình dựng landing: mở Tích hợp → Tài khoản liên kết → Thêm mới → chọn loại Webhook / API → dán địa chỉ vào ô URL → Lưu.',
'Mở Tích hợp → Cấu hình form (cấu hình lưu data) → Tạo mới → chọn tài khoản liên kết vừa tạo → Lưu.',
'Trong trang landing: bấm vào form → Lưu data (Lưu trữ data) → chọn cấu hình vừa tạo. Đặt tên ô: name, phone, email, message (thường là mặc định).',
'Thêm ô tick đồng ý (lời đồng ý bên dưới) → Xuất bản lại trang → gửi thử 1 lần, khách hiện trong app với nguồn "webhook:ladipage".',
],
img: ['ladipage-1', 'ladipage-2'],
},
{
id: 'website', icon: '🌐', title: 'Website của anh/chị', src: 'website',
steps: [
'Cách 1 – chưa có form: chép "Đoạn form HTML" bên dưới, dán vào trang (khối HTML / Custom HTML của WordPress, Wix, trình dựng web…).',
'Cách 2 – đã có form: chép "Đoạn JS" bên dưới, dán ngay trước </body>, đổi "form" thành đúng form của trang. Form cũ vẫn chạy như trước.',
'Đăng trang → gửi thử bằng số điện thoại của mình → khách hiện trong app với nguồn "webhook:website".',
],
img: ['website'],
},
{
id: 'gforms', icon: '📝', title: 'Google Forms', src: 'google-forms',
note: 'Tên mục của Google có thể khác chút (bản cũ: "Trình chỉnh sửa tập lệnh").',
steps: [
'Mở Google Form → bấm ⋮ (góc trên phải) → Apps Script.',
'Xoá chữ có sẵn, dán "Mã cho Google Forms" bên dưới → bấm Lưu (biểu tượng đĩa).',
'Cột trái chọn ⏰ Trình kích hoạt → + Thêm trình kích hoạt → hàm guiVeBDS · nguồn sự kiện "Từ biểu mẫu" · loại "Khi gửi biểu mẫu" → Lưu → cho phép quyền bằng tài khoản Google của anh/chị.',
'Đặt tên câu hỏi: "Họ và tên", "Số điện thoại" (bắt buộc) + hộp kiểm "Đồng ý" với lời đồng ý bên dưới. Gửi thử 1 câu trả lời → khách hiện trong app.',
],
img: ['gforms-1', 'gforms-2'],
},
{
id: 'facebook', icon: '📣', title: 'Facebook Lead Ads', src: 'facebook', advanced: true, paid: true,
note: 'Nâng cao. Facebook không gửi thẳng tới địa chỉ web thường: cần dịch vụ nối trung gian (Make, Zapier… – gói miễn phí có giới hạn, nhiều bước cần gói trả phí) hoặc tự làm ứng dụng Meta và qua duyệt quyền (App Review) – việc của lập trình viên.',
steps: [
'Tạo tài khoản dịch vụ nối (Make hoặc Zapier). Xem bảng giá của dịch vụ trước – có thể tốn phí theo số lượt chạy.',
'Tạo luồng mới: bước 1 = Facebook Lead Ads → "khách mới" (New Lead / Watch New Leads), đăng nhập Facebook, chọn Trang + form.',
'Bước 2 = HTTP / Webhooks → gửi POST (Make: HTTP › Make a request; Zapier: Webhooks by Zapier › POST – Zapier cần gói trả phí). Dán địa chỉ nhận khách (đã có &src=facebook).',
'Kiểu thân: JSON. Ghép trường: name = họ tên, phone = số điện thoại, email, note… (mẫu bên dưới). Chạy thử 1 khách mẫu → bật luồng.',
'Form Lead Ads của Facebook có sẵn ô điều khoản riêng tư – điền đường dẫn chính sách dữ liệu của anh/chị (Luật 91/2025/QH15).',
],
img: ['make'],
},
];

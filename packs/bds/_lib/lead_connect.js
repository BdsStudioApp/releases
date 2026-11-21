export const PLACEHOLDER_URL = 'https://script.google.com/macros/s/…/exec?lead=…';
export const MAX_BODY_KB = 20;
export function consentText(org) {
const _o6 = String(org || '').trim().slice(0, 80) || 'chúng tôi';
return `Tôi đồng ý để ${_o6} lưu và sử dụng họ tên, số điện thoại, email tôi cung cấp để liên hệ tư vấn bất động sản. ` +
'Tôi có thể yêu cầu xem, sửa hoặc xoá thông tin này bất cứ lúc nào (Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15).';
}
const _o0 = /[^a-z0-9_-]+/g;
export function srcLabel(v) {
return String(v || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()
.replace(_o0, '-').replace(/^-+|-+$/g, '').slice(0, 24) || 'web';
}
export function intakeUrl(url, { ref = '', src = '' } = {}) {
let _o5 = String(url || '');
if (!/^https:\/\/[^\s]+\?lead=[a-z2-7]{8,}/i.test(_o5)) return PLACEHOLDER_URL + (ref ? '&ref=' + ref : '') + (src ? '&src=' + srcLabel(src) : '');
_o5 = _o5.replace(/&ref=[^&]*/g, '').replace(/&src=[^&]*/g, '');
if (ref && /^[a-z2-7]{8}$/.test(ref)) _o5 += '&ref=' + ref;
if (src) _o5 += '&src=' + srcLabel(src);
return _o5;
}
export const isRealUrl = (_o5) => /^https:\/\/[^\s…]+\?lead=[a-z2-7]{8,}/i.test(String(_o5 || ''));
export function saleVariants(info) {
const _o2 = [{ value: '', label: 'Chung – không gắn sale (khách vào danh sách chung)' }];
for (const _o4 of (info && info.sales) || []) {
if (!_o4 || !_o4.code) continue;
const role = { owner: 'Quản trị', manager: 'Quản lý', sale: 'Sale', ctv: 'CTV' }[_o4.role] || _o4.role || '';
_o2.push({ value: _o4.code, label: (_o4.full_name || _o4.username) + (role ? ' · ' + role : '') + ' (ref=' + _o4.code + ')' });
}
return _o2;
}
const esc = (_o4) => String(_o4 == null ? '' : _o4).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function formSnippet(url, { org = '', src = 'website', redirect = '', project = '' } = {}) {
const _o5 = intakeUrl(url, {});
const _o3 = /^https:\/\//i.test(String(redirect || '')) ? String(redirect) : '';
return [
'<!-- BDS Studio – form nhận khách. Dán vào website / khối HTML của trình dựng landing. Giữ nguyên tên các ô (name=…). -->',
`<form action="${esc(_o5)}" method="POST" accept-charset="UTF-8" style="display:grid;gap:10px;max-width:420px">`,
'  <input type="hidden" name="_format" value="html">',
`  <input type="hidden" name="source" value="${esc(srcLabel(src))}">`,
project ? `  <input type="hidden" name="project" value="${esc(project)}">` : '  <!-- <input type="hidden" name="project" value="Tên dự án"> -->',
_o3 ? `  <input type="hidden" name="redirect" value="${esc(_o3)}">` : '  <!-- có trang cảm ơn riêng (https): <input type="hidden" name="redirect" value="https://…/cam-on"> -->',
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
const _o5 = intakeUrl(url, {});
return [
'<script>',
'/* BDS Studio – gửi khách từ form có sẵn về app. Dán ngay trước </body>. Đổi "form" thành đúng form của anh/chị (vd "#form-dang-ky"). */',
'(function () {',
`  var URL_NHAN = ${JSON.stringify(_o5)};`,
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
const _o5 = intakeUrl(url, { src: 'google-forms' });
return [
'// BDS Studio – gửi câu trả lời Google Form về app. Dán vào Google Form › ⋮ › Apps Script, bấm Lưu,',
'// rồi thêm trình kích hoạt: hàm guiVeBDS · Từ biểu mẫu · Khi gửi biểu mẫu.',
'// Đặt tên câu hỏi: "Họ và tên", "Số điện thoại" (bắt buộc), "Email", "Ghi chú", "Dự án" + câu "Đồng ý" (hộp kiểm, bắt buộc).',
`var URL_NHAN = ${JSON.stringify(_o5)};`,
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
export function gsheetScript(url, { src = 'google-sheet' } = {}) {
const _o5 = intakeUrl(url, { src });
return [
'// BDS Studio – gửi dòng MỚI của Google Sheet (khách landing) về app. Mở Sheet › Tiện ích mở rộng › Apps Script, dán mã, bấm Lưu.',
'// Chạy hàm batDau 1 lần (cho phép quyền) → app tự kiểm tra 5 phút/lần. Dòng đang có KHÔNG gửi lại (chỉ dòng thêm sau khi bật).',
'// CHỈ ĐỌC + CHÉP: mã không sửa, không chuyển, không xoá dòng nào trong Sheet – Sheet vẫn nhận khách như cũ. Số đã có trong app được gộp, không giao 2 lần.',
`var URL_NHAN = ${JSON.stringify(_o5)};`,
"var TEN_TRANG = '';   // để trống = trang tính đầu tiên; hoặc ghi đúng tên trang (vd 'Data')",
'',
'function batDau() {',
"  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'guiDongMoi') ScriptApp.deleteTrigger(t); });",
"  PropertiesService.getScriptProperties().setProperty('BDS_DONG', String(trang_().getLastRow()));",
"  ScriptApp.newTrigger('guiDongMoi').timeBased().everyMinutes(5).create();",
'}',
'',
'function trang_() { var ss = SpreadsheetApp.getActive(); return TEN_TRANG ? ss.getSheetByName(TEN_TRANG) : ss.getSheets()[0]; }',
'',
'function guiDongMoi() {',
'  var lock = LockService.getScriptLock(); if (!lock.tryLock(1000)) return;',
'  try {',
"    var sh = trang_(), props = PropertiesService.getScriptProperties(), daGui = Number(props.getProperty('BDS_DONG') || 1), cuoi = sh.getLastRow();",
'    if (cuoi <= daGui) return;',
'    var cot = sh.getLastColumn(), tieuDe = sh.getRange(1, 1, 1, cot).getValues()[0];',
'    var dong = sh.getRange(daGui + 1, 1, cuoi - daGui, cot).getDisplayValues();',
'    for (var i = 0; i < dong.length; i++) {',
"      var data = { lead_id: 'sheet-' + sh.getSheetId() + '-' + (daGui + 1 + i) };",
'      tieuDe.forEach(function (t, j) { if (String(t).trim() && dong[i][j] !== \'\') data[String(t).trim()] = dong[i][j]; });',
"      var res = UrlFetchApp.fetch(URL_NHAN, { method: 'post', contentType: 'application/json', payload: JSON.stringify(data), muteHttpExceptions: true });",
"      if (res.getResponseCode() >= 500) break;   // máy chủ bận → lần sau gửi lại từ dòng này",
"      if (res.getResponseCode() >= 400) console.warn('BDS Studio chưa nhận dòng ' + (daGui + 1 + i) + ': HTTP ' + res.getResponseCode());",
"      props.setProperty('BDS_DONG', String(daGui + 1 + i));",
'    }',
'  } finally { lock.releaseLock(); }',
'}',
].join('\n');
}
export const CHANNELS = [
['facebook', 'Facebook'], ['google', 'Google'], ['tiktok', 'TikTok'], ['zalo', 'Zalo'], ['landing', 'Landing'], ['su_kien', 'Sự kiện'], ['khac', 'Khác'],
];
export const channelLabel = (k) => (CHANNELS.find((c) => c[0] === k) || [])[1] || '';
export function jsonSample(src = 'facebook') {
const _o1 = { name: '{{Họ tên}}', phone: '{{Số điện thoại}}', email: '{{Email}}', note: '{{Câu trả lời khác}}', project: 'Tên dự án', consent: '{{Đồng ý}}', source: srcLabel(src) };
if (src === 'facebook') Object.assign(_o1, { utm_source: 'facebook', campaign_name: '{{Campaign Name}}', adset_name: '{{Adset Name}}' });
return JSON.stringify(_o1, null, 2);
}
export const FIELD_HELP = [
['Họ tên', 'name, ho_ten, full_name, fullname, ten, "Họ và tên"'],
['Số điện thoại', 'phone, sdt, so_dien_thoai, phone_number, mobile, "Số điện thoại"'],
['Email', 'email'],
['Ghi chú', 'note, ghi_chu, message, content, "Lời nhắn"'],
['Dự án', 'project, du_an'],
['Đồng ý (bắt buộc)', 'consent, dong_y, agree – ô tick đồng ý trên form; form không có ô này thì khách lưu ở trạng thái "chưa đồng ý"'],
['Nguồn', 'source (hoặc &src=… trên địa chỉ)'],
['Kênh', 'utm_source, channel (hoặc &utm_source=facebook… trên địa chỉ, hoặc kênh của nguồn đã lưu)'],
['Chiến dịch', 'utm_campaign, campaign, campaign_name (hoặc &campaign=… trên địa chỉ)'],
['Nhóm quảng cáo', 'utm_content, adset, adset_name, ad_name'],
['Sale phụ trách', 'ref (hoặc &ref=… trên địa chỉ)'],
];
export const GUIDES = [
{
id: 'ladipage', icon: '🧩', title: 'LadiPage', src: 'ladipage',
note: 'Theo hướng dẫn "Lưu data về API" của LadiPage (helpv3.ladipage.vn). Giao diện LadiPage đổi theo phiên bản – không thấy đúng tên mục thì kiểm tra lại tên mục trong LadiPage. LadiPage tự gửi kèm utm_source / utm_campaign / utm_content khi link quảng cáo có UTM.',
steps: [
'Chép địa chỉ của nguồn (mục "Nguồn quảng cáo" ở trên – mỗi landing một nguồn) hoặc địa chỉ chung.',
'Vào builder.ladipage.com → Tích hợp → Tài khoản liên kết → Tạo tài khoản liên kết → chọn loại API.',
'Giữ nguyên nơi đang lưu data (Google Sheet, email…) – chỉ THÊM tài khoản API này bên cạnh (mỗi cấu hình tối đa 3 tài khoản liên kết), khách vẫn về chỗ cũ như trước.',
'Đặt tên, dán địa chỉ vào ô URL API, kiểu nội dung chọn JSON (hoặc form) → ở "Đồng bộ các trường thông tin" ghép ô của form sang name, phone, email, note → Lưu.',
'Mở trang landing → bấm vào form → Lưu data → chọn cấu hình có tài khoản liên kết vừa tạo → Cập nhật.',
'Thêm ô tick đồng ý (lời đồng ý bên dưới) → Xuất bản lại → bấm "Gửi thử" trong app hoặc tự điền form 1 lần.',
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
id: 'wordpress', icon: '🅦', title: 'WordPress (Contact Form 7 / Elementor)', src: 'wordpress',
note: 'Cần plugin miễn phí "CF7 to Webhook" (tên cũ "CF7 to Zapier") trên wordpress.org. Plugin gửi THÊM 1 bản – email / nơi lưu cũ của form vẫn chạy như trước. Plugin gửi JSON với tên ô của form (your-name, your-email, your-tel… – app tự nhận).',
steps: [
'WordPress → Plugin → Cài mới → tìm "CF7 to Webhook" → Cài đặt → Kích hoạt.',
'Liên hệ (Contact) → mở form đang dùng → tab Webhook (bản cũ ghi "Zapier") → tick gửi tới webhook → dán địa chỉ của nguồn vào ô Webhook URL → Lưu.',
'Ô số điện thoại nên đặt tên your-tel hoặc phone ([tel* your-tel]). Thêm ô đồng ý: [acceptance consent] + lời đồng ý bên dưới.',
'Muốn ghi kênh/chiến dịch: thêm ô ẩn [hidden utm_source default:get] [hidden utm_campaign default:get] (lấy từ link quảng cáo) – hoặc đặt sẵn ở nguồn đã lưu.',
'Điền form trên trang thật 1 lần → khách hiện trong app (bản Công ty: Kho lead công ty).',
'Dùng Elementor Pro (Form): bấm vào form → Actions After Submit → thêm Webhook → mục Webhook dán địa chỉ vào ô Webhook URL → ở từng ô của form, tab Advanced đặt ID: name, phone, email → Cập nhật trang.',
],
img: [],
},
{
id: 'gsheet', icon: '📊', title: 'Trang đang ghi khách vào Google Sheet', src: 'google-sheet',
note: 'Cho landing đã lưu khách vào 1 Google Sheet riêng (LadiPage › Lưu data về Google Sheet, plugin, form tự viết…). Mã chỉ ĐỌC và CHÉP dòng mới sang app – không sửa, không chuyển, không xoá dòng nào; Sheet vẫn nhận khách như cũ. Số điện thoại đã có trong app được gộp (không tạo khách trùng, không giao 2 lần). Khác "Sheet landing" của app (Cài đặt › Landing) – Sheet đó app đã tự đọc.',
steps: [
'Mở Google Sheet đang nhận khách → Tiện ích mở rộng → Apps Script.',
'Xoá chữ có sẵn, dán "Mã cho Google Sheet" bên dưới (đã có địa chỉ của nguồn) → bấm Lưu.',
'Chọn hàm batDau ở thanh trên → Chạy → cho phép quyền bằng tài khoản Google của anh/chị. Từ giờ cứ 5 phút, dòng MỚI tự về app (dòng cũ không gửi lại).',
'Dòng 1 của Sheet là tiêu đề cột: "Họ tên", "Số điện thoại", "Email", utm_source, utm_campaign… – app tự nhận tên cột thường gặp.',
],
img: [],
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
note: 'Nâng cao. App CHƯA nối thẳng Facebook Lead Ads: Meta chỉ gửi khách tới ứng dụng Meta đã qua duyệt quyền (App Review, quyền leads_retrieval) – việc của lập trình viên, mất nhiều tuần. Cách làm được ngay: dịch vụ nối trung gian (Make, Zapier… – gói miễn phí có giới hạn, nhiều bước cần gói trả phí). Hoặc tải CSV khách từ Facebook rồi Nhập Excel vào Kho lead.',
steps: [
'Tạo tài khoản dịch vụ nối (Make, Zapier hoặc Pabbly Connect). Xem bảng giá của dịch vụ trước – có thể tốn phí theo số lượt chạy.',
'Tạo luồng mới: bước 1 = Facebook Lead Ads → "khách mới" (New Lead / Watch New Leads), đăng nhập Facebook, chọn Trang + form.',
'Bước 2 = HTTP / Webhooks → gửi POST (Make: HTTP › Make a request; Zapier: Webhooks by Zapier › POST – Zapier cần gói trả phí). Dán địa chỉ nhận khách (đã có &src=facebook).',
'Kiểu thân: JSON. Ghép trường: name = họ tên, phone = số điện thoại, email, campaign_name, adset_name (mẫu bên dưới) – app tự ghi chiến dịch / nhóm quảng cáo. Chạy thử 1 khách mẫu → bật luồng.',
'Form Lead Ads của Facebook có sẵn ô điều khoản riêng tư – điền đường dẫn chính sách dữ liệu của anh/chị (Luật 91/2025/QH15).',
],
img: ['make'],
},
];

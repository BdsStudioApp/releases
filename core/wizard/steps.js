export const FLOWS = {
personal: ['allow', 'account', 'telegram', 'backup', 'domain', 'ai', 'finish'],
company: ['prepare', 'company', 'allow', 'account', 'telegram', 'tfa', 'doingu', 'domain', 'ai', 'finish', 'handover']
};
const _o5 = (list) => { const _o2 = list.indexOf('account'); return [...list.slice(0, _o2 + 1), 'diachi', ...list.slice(_o2 + 1)]; };
export const PORTAL_FLOWS = { personal: _o5(FLOWS.personal), company: _o5(FLOWS.company) };
export function flowIds(flow, { portal = false } = {}) { return ((portal ? PORTAL_FLOWS : FLOWS)[flow]) || []; }
export const FLOW_LABEL = { personal: 'Cá nhân', company: 'Công ty' };
export const FLOW_INTRO = {
personal: {
icon: '👤', title: 'Cá nhân',
lead: 'Một người tự dùng. Cài một lần khoảng 10–15 phút, không cài phần mềm. Dữ liệu nằm trong Gmail của anh/chị.',
points: ['Tạo máy chủ dữ liệu trong Gmail', 'Đặt tên đăng nhập, mật khẩu', 'Có sẵn khách mẫu để xem thử']
},
company: {
icon: '🏢', title: 'Công ty',
lead: 'Mỗi nhân viên một tài khoản, chỉ thấy phần việc của mình. Làm cùng bên cài đặt, có biên bản bàn giao.',
points: ['Chuẩn bị Google công ty, tên miền', 'Tên, mã số thuế, logo công ty', 'Máy chủ + tài khoản Quản trị', 'Mời nhân viên, ký bàn giao']
}
};
export const TRIAL_COMPANY_SEATS = 10;
export function trialCompanySeats(config) {
const _o3 = config && config.licensing;
const v = Math.floor(Number(_o3 && _o3.trial_company_seats));
return v >= 1 && v <= 10000 ? v : TRIAL_COMPANY_SEATS;
}
export function flowWho(flow, config) {
return flow === 'company' ? 'Công ty = nhiều người, dùng thử tối đa ' + trialCompanySeats(config) + ' người' : 'Cá nhân = 1 người dùng';
}
export const CHECKLIST = [
{ id: 'workspace', required: false, recommended: true, label: 'Tài khoản Google Workspace (Gmail mang tên công ty) do quản trị viên công ty giữ',
short: 'Tài khoản Google Workspace của công ty',
hint: '⚠️ Nên dùng tài khoản Google Workspace do quản trị viên công ty giữ – dùng Gmail cá nhân để thử cũng được, nhưng trước khi dùng thật hãy chuyển sang tài khoản công ty để nhân viên nghỉ việc không mang dữ liệu đi.' },
{ id: 'domain', required: false, recommended: true, label: 'Tên miền công ty (đã có website thì mua THÊM 1 tên miền riêng cho app) + tài khoản Cloudflare miễn phí của công ty',
short: 'Tên miền công ty + Cloudflare',
hint: 'Dùng thử: app chạy ở địa chỉ miễn phí tenkhach.bdsstudio.app. Trước khi dùng thật nên có tên miền công ty: app ở app.tencongty.vn, trang riêng nhân viên ở ten.tencongty.vn – cần người đổi được nameserver ở nơi mua tên miền.' },
{ id: 'telegram', required: false, recommended: true, label: 'Bot Telegram (tài khoản tự nhắn tin) của công ty, tạo bằng @BotFather + điện thoại có Telegram',
short: 'Bot Telegram của công ty',
hint: 'Bot báo khách mới, nhắc việc, gửi mã đăng nhập. Chưa có thì vẫn dùng thử được (mã đăng nhập 2 lớp lấy bằng ứng dụng xác thực, hoặc làm sau) – nên tạo trước khi dùng thật. Sau này mỗi sale tạo được bot riêng.' },
{ id: 'ai', required: false, label: 'Khoá AI Gemini (mã để app dùng AI) – công ty tự đăng ký, tự trả phí',
hint: 'Gemini có mức miễn phí (giới hạn số lần/ngày).' },
{ id: 'landing', required: false, label: 'Trang giới thiệu (landing) của công ty, nếu có, để khách để lại số',
hint: 'Không có cũng được – nhập khách bằng tay hoặc làm sau.' }
];
export const URL_FIELD_LABEL = 'Địa chỉ máy chủ (kết thúc bằng /exec)';
export const NOT_PUBLIC_TEXT = "Lúc Triển khai chưa chọn 'Bất kỳ ai' – vào Triển khai › Quản lý triển khai › sửa → Bất kỳ ai";
export const NOT_PUBLIC_FIX = 'Mở Apps Script của Sheet máy chủ (Tiện ích mở rộng › Apps Script) → Triển khai › Quản lý triển khai (Deploy › Manage deployments) → bấm bút chì "Sửa" (Edit) → Người có quyền truy cập: Bất kỳ ai (Who has access: Anyone) → Triển khai (Deploy). Địa chỉ …/exec giữ nguyên – bấm kiểm lại.';
export const SUPPORT_EMAIL_FALLBACK = 'hotro@bdsstudio.app';
export function supportEmail(config = {}) {
const s = (config && (config.SUPPORT || config.support)) || {};
const v = String((typeof s === 'string' ? s : s.email || s.SUPPORT_EMAIL) || config.SUPPORT_EMAIL || '').trim();
return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? v : SUPPORT_EMAIL_FALLBACK;
}
export const isSaleEdition = (config = {}) => !!config && String(config.edition || 'owner') !== 'owner';
const _o0 = 'Miễn phí';
export const BACK_HERE = 'QUAY LẠI tab BDS Studio này';
export const UNSAFE_WHY = 'Vì sao Google ghi "không an toàn"? Đây là bản sao nằm trong Drive của chính anh/chị – Google chỉ xác minh ứng dụng phát hành cho nhiều người dùng. '
+ 'Kiểm tra đúng email của mình rồi bấm tiếp; bên bán không xem được dữ liệu.';
export const PREPARE_TIP = 'Dùng thử: nên dùng một Gmail phụ để thử các chức năng. Khi mua bản quyền, chuyển sang email theo tên miền công ty để dữ liệu đứng tên công ty, nhân viên nghỉ việc không mang đi được.';
export const SETUP_CODE_WHERE = 'Trong Sheet: BDS Studio › 🔗 Mở lại hộp kết nối → Mã cài đặt';
export const STEPS = {
prepare: {
id: 'prepare', phase: 'any', required: true, check: 'info', flows: ['company'], noBadge: true,
title: 'Chuẩn bị trước',
tip: PREPARE_TIP,
head: 'Một lời khuyên trước khi cài – đọc xong bấm Tiếp tục.',
time: 'Khoảng 1 phút', cost: 'Dùng thử: 0 đ',
actions: []
},
company: {
id: 'company', phase: 'any', required: true, check: 'form', flows: ['company'],
title: 'Thông tin công ty',
head: 'Tên và logo hiện trên app, trên báo giá gửi khách và trên biên bản bàn giao.',
time: 'Khoảng 2 phút', cost: _o0,
actions: []
},
allow: {
id: 'allow', phase: 'pre', main: true, required: true, check: 'auto', flows: ['personal', 'company'], widgetLast: true,
title: 'Tạo máy chủ',
titleCompany: 'Tạo máy chủ công ty',
head: 'Máy chủ là một trang tính Google (Sheet) trong Google của anh/chị – không ai khác xem được, kể cả bên bán.',
headCompany: 'Máy chủ là một Sheet trong Google CÔNG TY – nhân viên nghỉ việc không mang đi được, bên cài đặt cũng không xem được.',
todoGoogle: [
'Bấm **Cài bằng tài khoản Google** → chọn tài khoản → **Cho phép**.',
'Google hỏi thì bật **Google Apps Script API** (trang mở sẵn) rồi quay lại.',
'Bấm **Cho phép máy chủ chạy** → **Cho phép** – app tự sang bước kế.'
],
timeGoogle: 'Khoảng 3–5 phút',
time: 'Khoảng 5–10 phút (dán tay: 10–15 phút)', cost: _o0,
actions: [
{ way: 'copy', text: 'Bấm **Tạo bản sao** → trang Google hỏi → bấm **Tạo bản sao** (Make a copy).',
textCompany: 'Dùng Google CÔNG TY (dùng thử: Gmail phụ), bấm **Tạo bản sao** → trang Google hỏi → bấm **Tạo bản sao** (Make a copy).',
link: 'template', imgs: ['template-copy'] },
{ way: 'manual', text: 'Mở **sheets.new** (Sheet trống mới) bằng đúng tài khoản Google giữ dữ liệu.',
textCompany: 'Mở **sheets.new** (Sheet trống mới) bằng tài khoản Google CÔNG TY.', link: 'sheetsNew' },
{ way: 'manual', text: 'Trên Sheet: **Tiện ích mở rộng › Apps Script** (Extensions › Apps Script – nơi dán mã).', imgs: ['sheet-ext-menu'] },
{ way: 'manual', text: 'Bấm tệp **Mã.gs** (Code.gs) ở cột trái → Ctrl+A → dán **TatCa.gs** → đổi tên thành TatCa.', installer: 'tatca' },
{ way: 'manual', text: 'Bấm **+** › **Tập lệnh** (Script) → tên CaiDat → Ctrl+A → dán **CaiDat.gs**.', installer: 'caidat' },
{ way: 'manual', text: 'Bánh răng **Cài đặt dự án** → tick **Hiện tệp kê khai "appsscript.json"**.', imgs: ['manifest-tick'] },
{ way: 'manual', text: 'Quay lại **< >** → bấm **appsscript.json** → Ctrl+A → dán **appsscript.json** → Lưu (Ctrl+S).', installer: 'manifest', imgs: ['manifest-paste'] },
{ way: 'manual', text: 'Quay lại thẻ Sheet → bấm **Tải lại** (F5).' },
{ text: 'Trong Sheet: chờ 10–20 giây cho menu **BDS Studio** hiện → bấm **BDS Studio › ⚙️ Cài đặt**.', imgs: ['sheet-menu'] },
{ text: 'Google hỏi quyền: **Xem xét quyền** → chọn đúng Gmail của anh/chị → **Nâng cao** (Advanced) → **Đi tới… (không an toàn)** → **Cho phép** (Allow).',
why: UNSAFE_WHY, imgs: ['auth-review', 'auth-advanced', 'auth-allow'] },
{ text: 'Cho phép xong, bấm **BDS Studio › ⚙️ Cài đặt** LẦN NỮA → hộp "Đang cài đặt máy chủ…" hiện ra: chờ khoảng 30 giây, đừng tải lại trang.', imgs: ['sheet-installing'] },
{ text: 'Hộp **Triển khai máy chủ** hiện ra – làm theo các dòng trong hộp (chỉ 1 lần):', imgs: ['sheet-deploy-dialog'], sub: [
{ text: 'Bấm **Tiện ích mở rộng › Apps Script** (Extensions › Apps Script).', imgs: ['sheet-ext-menu'] },
{ text: 'Góc phải: **Triển khai › Tuỳ chọn triển khai mới** (Deploy › New deployment). Mục "Quản lý triển khai" trống là bình thường.', imgs: ['deploy-menu'] },
{ text: 'Bánh răng ⚙ cạnh **Chọn loại** → **Ứng dụng web** (Web app).', imgs: ['deploy-type'] },
{ text: 'Thực thi: **Tôi** (Me) · Người có quyền truy cập: **Bất kỳ ai** (Anyone) → bấm **Triển khai** (Deploy).', imgs: ['deploy-config'] },
{ text: 'Google hỏi: bấm **Uỷ quyền truy cập** (Authorize access) → chọn Gmail → **Nâng cao** → **Đi tới… (không an toàn)** → **Cho phép**.', imgs: ['deploy-authorize'] },
{ text: 'Hiện **Đã triển khai** và URL ứng dụng web …/exec → bấm **Xong** (Done).', imgs: ['deploy-url'] }
] },
{ text: 'Quay lại thẻ Sheet → bấm **Tôi đã triển khai xong** → hộp hiện **Mở BDS Studio và kết nối** → bấm – app tự điền, tự kiểm.', imgs: ['sheet-open-app'], imgPortal: true },
{ text: 'Hộp không có nút đó? Bấm **Chép URL** trong hộp → ' + BACK_HERE + ' → dán vào ô dưới → bấm **Kiểm tra bước này**.' }
]
},
account: {
id: 'account', phase: 'pre', main: true, required: true, check: 'auto', flows: ['personal', 'company'],
title: 'Tạo tài khoản',
titleCompany: 'Tạo tài khoản Quản trị (Admin)',
head: 'Chỉ anh/chị đăng nhập được app – mật khẩu chỉ anh/chị biết, kể cả bên bán cũng không xem được.',
headCompany: 'Tài khoản Quản trị (Admin) – người giữ quyền cao nhất công ty (thường là giám đốc); mật khẩu chỉ người đó biết.',
time: 'Khoảng 3 phút', cost: _o0,
actions: []
},
diachi: {
id: 'diachi', phase: 'post', main: true, required: true, deferrable: true, check: 'auto', flows: ['personal', 'company'], portalOnly: true,
title: 'Chọn địa chỉ app',
titleCompany: 'Địa chỉ app công ty',
head: 'Địa chỉ web riêng mở app của anh/chị – miễn phí dạng ten.bdsstudio.app, hoặc tên miền riêng.',
headCompany: 'Địa chỉ web riêng mở app của công ty – tên miền công ty, hoặc miễn phí dạng tencongty.bdsstudio.app.',
note: 'Mỗi khách một app riêng, không dùng chung. Trang này chỉ để cài, không giữ dữ liệu: tạo xong app tự chuyển sang địa chỉ mới.',
todoQuick: [
'Tên đã điền sẵn theo tên đăng nhập – sửa nếu muốn (chọn rồi không đổi được).',
'Bấm **Tạo ngay** – thường 2–5 phút (có khi tới 15 phút) app riêng tự mở, đăng nhập bằng mật khẩu vừa đặt.'
],
todoNoService: [
'Gõ tên muốn dùng → bấm **Gửi tên cho bên bán**.',
'Bấm **Làm sau** – dùng app ngay ở địa chỉ này.',
'Bên bán gửi địa chỉ riêng qua email trong 24 giờ.'
],
time: 'Thường 2–5 phút, có khi tới 15 phút (chờ chứng chỉ https); tên miền riêng: chờ thêm tới 24 giờ, thường dưới 30 phút',
cost: 'Địa chỉ miễn phí: 0 đ · Tên miền riêng: tự trả tiền tên miền, .com khoảng 10–15 USD/năm (giá tham khảo)',
actions: []
},
telegram: {
skipNote: 'Không nhận tin báo khách mới, nhắc việc qua Telegram. Nối sau được ở Cài đặt › Kết nối.',
id: 'telegram', phase: 'post', required: false, check: 'auto', flows: ['personal', 'company'], requiredIn: ['company'], deferrable: true, inline: true,
laterNoteCompany: 'Đã lưu. Chưa có Telegram: ở bước Bảo mật 2 lớp bật bằng ứng dụng xác thực (hoặc Làm sau). Nối Telegram trước khi dùng thật – bot báo khách mới, nhắc việc, gửi mã đăng nhập.',
title: 'Nhận tin qua Telegram',
head: 'App nhắn Telegram cho anh/chị khi có khách mới, đến hẹn gọi lại, đến ngày đóng tiền.',
headCompany: 'App nhắn Telegram khi có khách mới, đến hẹn gọi lại, và gửi mã đăng nhập (bảo mật 2 lớp).',
notePersonal: 'Nối xong, đăng nhập ở máy lạ sẽ hỏi thêm mã 6 số gửi qua Telegram (bảo mật 2 lớp) – bước sau tạo mã dự phòng.',
security: '🔒 Mã bot giống chìa khoá: ai có mã là điều khiển được bot của anh/chị. Không gửi mã cho ai (kể cả bên bán), không dán vào Zalo hay nhóm chat.',
time: 'Khoảng 5–10 phút', cost: _o0,
actions: [
{ phase: 'token', text: 'Chưa có Telegram? Bấm **Tải Telegram**, cài rồi đăng ký bằng số điện thoại.', link: 'telegramDownload' },
{ phase: 'token', text: 'Trong Telegram: ô tìm kiếm gõ **@BotFather** → chọn đúng tài khoản có dấu tích xanh ✔ → bấm **Start** (Bắt đầu).', imgs: ['ext-tg-botfather'] },
{ phase: 'token', text: 'Gõ **/newbot** → gửi. BotFather hỏi tên hiển thị: gõ tên tuỳ ý, vd Nhắc việc BĐS.' },
{ phase: 'token', text: 'BotFather hỏi tên đăng nhập (username): gõ không dấu, kết thúc bằng **bot**, vd lan_nhacviec_bot. Báo tên đã có người dùng thì thêm số, vd lan_nhacviec_2026_bot.', imgs: ['ext-botfather'] },
{ phase: 'token', text: 'BotFather gửi tin "Done! Congratulations…" có dòng mã dạng **7123456789:AAH…** → chạm vào dòng mã đó để chép (hoặc chép cả tin).', imgs: ['ext-tg-token'] },
{ phase: 'token', widget: true, text: BACK_HERE + ' → dán mã vào ô dưới → app tự kiểm mã.' },
{ phase: 'chat', text: 'Mở bot vừa tạo (bấm **t.me/…** – link trong tin của BotFather) → bấm **Start** → gõ **chào** → gửi.', imgs: ['ext-tg-start'] },
{ phase: 'chat', widget: true, text: BACK_HERE + ' → bấm **Tự tìm mã cuộc trò chuyện** → app gửi tin "✅ BDS Studio đã kết nối Telegram…" vào Telegram – thấy tin là Telegram đã hoạt động.' }
]
},
tfa: {
id: 'tfa', phase: 'post', required: true, deferrable: true, check: 'auto', flows: ['company'],
title: 'Bảo mật 2 lớp',
head: 'Kẻ gian có mật khẩu cũng không vào được – đăng nhập phải nhập thêm mã 6 số gửi tới điện thoại.',
note: 'Bắt buộc trước khi dùng thật (Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15). Đang dùng thử, chưa có Telegram: bật bằng **Cài ứng dụng xác thực**, hoặc bấm **Làm sau**.',
laterNote: 'Đã lưu. Bảo mật 2 lớp vẫn BẮT BUỘC trước khi dùng thật với khách – bấm nút Trợ lý cài đặt ở góc màn hình để làm nốt (Telegram hoặc ứng dụng xác thực).',
time: 'Khoảng 3 phút', cost: _o0,
actions: [
{ text: 'Đã nối Telegram ở bước trước: mã tự gửi qua Telegram. Chưa có: bấm **Cài ứng dụng xác thực** ở khung trên, quét mã QR bằng Google Authenticator.' },
{ text: 'Bấm **Tạo mã dự phòng**: 10 mã, in ra hoặc tải về, cất nơi an toàn (dùng khi mất điện thoại).' },
{ text: 'Bấm **Kiểm tra bước này**.' }
]
},
backup: {
skipNote: 'Mất điện thoại hoặc Telegram thì không đăng nhập được ở máy mới. Tạo sau được ở Cài đặt › Bảo mật.',
id: 'backup', phase: 'post', required: false, check: 'auto', flows: ['personal'],
title: 'Mã dự phòng',
head: 'Vẫn đăng nhập được khi mất điện thoại hoặc mất Telegram.',
note: 'Chưa nối Telegram thì chưa cần – bấm **Kiểm tra bước này**, app sẽ báo.',
time: 'Khoảng 2 phút', cost: _o0,
actions: [
{ text: 'Bấm **Tạo mã dự phòng** ở khung trên → nhập mật khẩu.' },
{ text: 'Bấm **Gửi mã qua Telegram** → nhập 6 số vừa nhận → **Tạo mã**.' },
{ text: 'Bấm **In** hoặc **Tải tệp** 10 mã, cất nơi an toàn → **Tôi đã lưu** → **Kiểm tra bước này**.' }
]
},
domain: {
skipNote: 'App vẫn mở ở địa chỉ có sẵn bên bán đã gửi. Gắn tên miền riêng sau được.',
id: 'domain', phase: 'post', required: false, check: 'auto', flows: ['personal', 'company'], requiredIn: ['company'], deferrable: true,
laterLabelCompany: 'Làm tiếp sau',
laterNoteCompany: 'Đã lưu. App vẫn chạy ở địa chỉ đang mở (miễn phí). Bước "Tên miền công ty" vẫn bắt buộc trước khi dùng thật – có tên miền thì bấm nút Trợ lý cài đặt ở góc màn hình để làm nốt.',
title: 'Địa chỉ mở app',
titleCompany: 'Tên miền công ty',
head: 'Mở app bằng tên miền riêng của anh/chị (vd app.tenanh.com) cho chuyên nghiệp khi gửi link.',
headCompany: 'App công ty chạy ở app.tencongty.vn và mỗi nhân viên có trang riêng ten.tencongty.vn kéo khách về danh sách của chính mình.',
noteCompany: 'Bắt buộc trước khi dùng thật. Đang dùng thử, chưa có tên miền, hoặc đang chờ tên miền chạy? Bấm **Làm tiếp sau** – dùng app ngay ở địa chỉ miễn phí đang mở.',
note: 'Không cần tên miền riêng? Dùng địa chỉ có sẵn (vd tenkhach.bdsstudio.app) – miễn phí, chạy y như nhau.',
todoShared: [
'Giữ **Địa chỉ mặc định (miễn phí)** – không cần làm gì thêm.',
'Bấm **Kiểm tra bước này** → **Tiếp**.'
],
todoSharedWait: [
'Gõ tên muốn dùng → bấm **Gửi tên cho bên bán**.',
'Bấm **Làm sau** – dùng app ngay ở địa chỉ này.'
],
time: 'Khoảng 10 phút, rồi chờ tên miền chạy (thường 30 phút, lâu nhất 24 giờ)',
timeCompany: 'Khoảng 20–30 phút, rồi chờ nameserver đổi xong (thường dưới 1 giờ, lâu nhất 24 giờ)',
cost: 'Địa chỉ có sẵn: miễn phí · Tên miền .com khoảng 10–15 USD/năm (giá tham khảo)',
costCompany: 'Cloudflare gói Free (DNS, https, Worker 100.000 lượt/ngày): 0 đ · Tên miền: công ty tự trả nhà đăng ký, .com khoảng 10–15 USD/năm (giá tham khảo)',
actionsCompany: [
{ text: 'Trả lời **Công ty đã có tên miền chưa?** ở khung trên. Chưa có: bấm **Mua tên miền** (Cloudflare bán đúng giá gốc; đuôi .vn mua ở nhà đăng ký Việt Nam).' },
{ text: 'Cloudflare của công ty › **Add a domain** → gõ tên miền → gói **Free** → đổi 2 nameserver (máy chủ tên miền) ở nơi mua sang 2 tên Cloudflare đưa → ' + BACK_HERE + ' → bấm **Kiểm tra tên miền**.' },
{ text: 'Gắn app.<tên miền> vào app, bật Worker (chương trình nhỏ chạy trên Cloudflare) cho trang nhân viên theo 4 dòng ở khung trên (hoặc nhờ bên bán làm bằng token) → ' + BACK_HERE + ' → bấm **Kiểm tra bước này**.' }
],
actions: [
{ text: 'Vào trang quản lý tên miền (nơi mua tên miền hoặc Cloudflare) → thêm bản ghi CNAME (một dòng trỏ tên miền con về app) đúng như bảng dưới; TTL (thời gian lưu tạm) để Tự động.', imgs: ['ext-dns-cname'] },
{ text: 'Báo bên cài đặt để gắn tên miền vào app (một lần).',
textPersonal: 'Tên miền gắn ở phía bên bán: gửi email (địa chỉ ở khung dưới) kèm tên miền muốn dùng – bên bán gửi lại giá trị "Trỏ tới" và báo khi gắn xong.' },
{ text: 'Thêm CNAME xong → ' + BACK_HERE + ' → gõ tên miền vào ô dưới → bấm **Kiểm tra bước này**.' }
]
},
ai: {
skipNote: 'Các nút AI ẩn đi, app vẫn chạy bình thường. Bật sau được ở Cài đặt › Kết nối.',
id: 'ai', phase: 'post', required: false, check: 'auto', flows: ['personal', 'company'], inline: true,
title: 'Bật AI (Gemini)',
head: 'AI soạn sẵn tin Zalo, tóm tắt khách, đọc phiếu chính sách giúp anh/chị.',
note: 'Khoá miễn phí: Google có thể dùng nội dung gửi lên để cải thiện sản phẩm. Làm với khách thật nên dùng khoá trả phí; không gửi số CCCD của khách.',
time: 'Khoảng 3–5 phút', cost: 'Miễn phí trong hạn mức của Google (giới hạn số lần/ngày) · khoá trả phí tính tiền theo lượt dùng',
actions: [
{ text: 'Bấm **Mở aistudio.google.com** → đăng nhập Gmail. Trang tiếng Anh: bấm **Get API key** (Lấy khoá API) → **Create API key** (Tạo khoá API) → **Copy** (Chép) khoá AIza….', link: 'aistudio', imgs: ['ext-aistudio'] },
{ widget: true, text: 'Lấy khoá xong → ' + BACK_HERE + ' → dán vào ô dưới → app tự kiểm.' }
]
},
engine: {
skipNote: 'Mọi phần khác vẫn dùng đầy đủ trên điện thoại và trình duyệt. Cần thì cài sau.',
id: 'engine', phase: 'post', required: false, check: 'auto', flows: [], choice: true,
title: 'Máy dựng video',
head: 'Chọn cách làm video: không làm, chỉ dùng AI trên mạng (không cài gì), hoặc dựng video bản đồ, quy hoạch ngay trên máy tính.',
todoTitle: 'Chọn "Dựng trên máy" thì anh/chị cần làm:',
todo: [
'Bấm **Kiểm tra cấu hình máy** xem máy có hợp không (máy yếu: chọn AI trên mạng hoặc không làm video).',
'Bấm **Tải bộ cài máy dựng**.',
'Cài theo hướng dẫn Mac/Windows dưới đây; câu đầu gõ 1 (Có).',
'Cài xong, bấm **Kiểm tra bước này**.'
],
time: 'Khoảng 15–20 phút nếu dựng trên máy (tải ~150–300 MB tuỳ mạng) · hai cách còn lại: không cài gì',
cost: 'Dựng trên máy: miễn phí cho video bản đồ · AI trên mạng: tính phí theo nhà cung cấp, mỗi lần hỏi trước',
actions: [
{ text: 'Máy cần: ổ trống từ 5 GB; Mac macOS 11 trở lên, hoặc Windows 10 (bản 1809 trở lên)/Windows 11 64-bit. Không cần quyền quản trị máy.' },
{ text: 'Bấm **Tải bộ cài máy dựng** – app tự chọn đúng loại máy đang mở (Windows: tệp BDS_Studio_Video_Windows.zip · Mac: BDS_Studio_Video_Mac.zip).', link: 'engineZip' },
{ text: 'Cài cho máy loại khác (vd đang mở app trên Windows nhưng máy dựng là Mac): tải bộ cài cho máy kia.', link: 'engineZipOther', alt: true },
{ text: 'Làm theo thẻ Mac hoặc Windows bên dưới. Mac: chạy bằng Terminal, KHÔNG bấm đúp (macOS chặn). Windows: bỏ chặn (Unblock) tệp zip TRƯỚC khi giải nén.' },
{ text: 'Câu hỏi đầu tiên của bộ cài "Anh/chị có làm video trên máy tính này không?": gõ 1 (Có – dựng video trên máy này). Chỉ bấm Enter hoặc để 60 giây là [2] Chỉ dùng AI trên mạng – bộ cài không cài gì ([3] Không làm video cũng không cài gì).' },
{ text: 'Ở bước B8 bộ cài quét máy rồi hỏi: Enter = [4] Dựng video trên máy (cài công cụ dựng ~150–300 MB); máy mạnh còn có [2] Dựng + AI ngay trên máy; [1] Thôi – chỉ AI trên mạng (mặc định khi máy yếu, không cài thêm gì).' },
{ text: 'Chrome hỏi "Truy cập mạng cục bộ" → bấm **Cho phép** (để app nói chuyện được với máy dựng).' },
{ text: 'Bấm **Kiểm tra bước này** – app kiểm máy dựng, ffmpeg (phần dựng video) và ổ đĩa.' }
]
},
doingu: {
id: 'doingu', phase: 'post', required: false, check: 'form', flows: ['company'],
title: 'Đội ngũ',
head: 'Để mỗi nhân viên có tài khoản riêng – nhận link mời qua email, tự đặt mật khẩu; Sale chỉ thấy khách được chia cho mình.',
note: 'Chưa biết ai thì để 0, mời sau ở Cài đặt › Nhân sự.',
skipNote: 'Chỉ mình anh/chị dùng app lúc này. Mời nhân viên sau ở Cài đặt › Nhân sự.',
time: 'Khoảng 1 phút mỗi người', cost: _o0,
actions: [
{ text: 'Bấm **+** để chọn số nhân viên bán hàng (Sale); cần Quản lý / Trưởng nhóm thì chọn thêm ở ô dưới.' },
{ text: 'Gõ **họ tên** và **email** từng người (bắt buộc – app gửi link mời và mã xác nhận tới email này); số điện thoại giúp gửi qua Zalo.' },
{ text: 'Bấm **Tạo lời mời và gửi email**. Thư gửi từ chính tài khoản Google đang chạy máy chủ.' },
{ text: 'Ai chưa nhận được thư: bấm **Chép link mời** hoặc **Gửi qua Zalo**. Link dùng 1 lần, hết hạn sau 7 ngày.' },
{ text: 'Nhân viên bấm link → đặt mật khẩu → nhập mã 6 số trong email → vào app với đúng vai trò.' },
{ text: 'Chưa cần mời ai? Bấm **Bỏ qua bước này**.' }
]
},
finish: {
id: 'finish', phase: 'post', main: true, required: true, check: 'auto', flows: ['personal', 'company'], widgetLast: true,
title: 'Kiểm tra toàn bộ',
head: 'Để chắc mọi phần chạy thật trước khi dùng với khách.',
time: 'Khoảng 1 phút', cost: _o0,
actions: [
{ text: 'Bấm **Kiểm tra toàn bộ** – app kiểm máy chủ, Sheet, nhắc việc tự động, Telegram, AI.', shot: 'app-selftest' },
{ text: 'Dòng ❌: đọc **Cách sửa** ngay dưới dòng đó, sửa xong kiểm lại.' }
]
},
handover: {
id: 'handover', phase: 'post', required: true, check: 'manual', flows: ['company'], widgetLast: true,
title: 'Biên bản bàn giao',
head: 'Để hai bên ký xác nhận đã cài xong và đã giao tài khoản Quản trị (Admin).',
note: 'Bên cài đặt không giữ mật khẩu. Biên bản ghi ngày hết dùng thử (tính từ lần đầu app mở sau khi tạo tài khoản Quản trị).',
time: 'Khoảng 5 phút', cost: _o0,
actions: [
{ text: 'Xem lại biên bản bên dưới: thông tin công ty, tài khoản Quản trị (Admin), tên miền, phiên bản, kết quả kiểm tra.' },
{ text: 'Bấm **In / Lưu PDF** → hai bên ký.' },
{ text: 'Đánh dấu **Đã in và hai bên đã ký** rồi bấm **Kiểm tra bước này**.' }
]
}
};
export const ENGINE_GUIDE = {
mac: [
'Bấm đúp tệp BDS_Studio_Video_Mac.zip để giải nén → kéo thư mục BDS_Studio_Engine vào thư mục Tài liệu (Documents).',
'Mở Terminal: bấm ⌘ + Space, gõ Terminal → Enter.',
'Trong Terminal gõ bash và một dấu cách, rồi KÉO tệp "Cai dat voi 1 click" (trong thư mục BDS_Studio_Engine) thả vào cửa sổ Terminal → Enter.',
'Trên Mac ĐỪNG bấm đúp "Cai dat voi 1 click": bộ cài chưa ký chứng chỉ Apple nên macOS (Gatekeeper) chặn ("Apple không thể kiểm tra…" / "Not Opened"). Lỡ bấm: bấm Done → System Settings › Privacy & Security → kéo xuống bấm Open Anyway.',
'Câu hỏi đầu tiên: gõ 1 (Có – dựng video trên máy này) → Enter. Chỉ bấm Enter hoặc để 60 giây là [2] Chỉ dùng AI trên mạng – bộ cài không cài gì.',
'Chờ các dòng [1/9] … [9/9] chạy xong (5–10 phút). Ở bước B8: Enter = [4] Dựng video trên máy (máy yếu: Enter = [1] Thôi – chỉ AI trên mạng). Bộ cài tự tải Python và ffmpeg nếu máy chưa có, không hỏi mật khẩu.',
'Xong: trình duyệt tự mở http://127.0.0.1:8765; trên màn hình nền có biểu tượng BDS Studio (ngôi nhà vàng) – lần sau chỉ cần bấm đúp. macOS hỏi quyền thư mục Tài liệu → bấm Cho phép (OK).'
],
win: [
'BỎ CHẶN tệp zip TRƯỚC khi giải nén (bắt buộc trên Windows 11 bật Smart App Control): bấm chuột phải BDS_Studio_Video_Windows.zip → Properties (Thuộc tính) → tick Unblock (Bỏ chặn) ở cuối thẻ General → OK. Không thấy ô Unblock: làm tiếp bình thường.',
'Bấm chuột phải tệp zip → Extract All (Giải nén tất cả). Không chạy ngay trong cửa sổ xem zip. Không cần chạy bằng quyền Administrator.',
'Mở thư mục BDS_Studio_Engine → bấm đúp "Cai dat voi 1 click".',
'Bộ cài chưa ký chứng chỉ nên Windows (SmartScreen) có thể hiện "Windows protected your PC" → bấm More info (Thông tin thêm) → Run anyway (Vẫn chạy). Hiện "Open File – Security Warning" → bấm Run.',
'Đã giải nén trước khi Unblock và bị "Smart App Control blocked a file…": xoá thư mục đã giải nén, Unblock tệp zip rồi giải nén lại.',
'Câu hỏi đầu tiên: gõ 1 (Có – dựng video trên máy này) → Enter. Chỉ bấm Enter hoặc để 60 giây là [2] Chỉ dùng AI trên mạng – bộ cài không cài gì.',
'Chờ các dòng [1/9] … [9/9] chạy xong (5–10 phút). Ở bước B8: Enter = [4] Dựng video trên máy (máy yếu: Enter = [1] Thôi – chỉ AI trên mạng). Xong: trình duyệt tự mở http://127.0.0.1:8765; lần sau bấm BDS Studio (ngôi nhà vàng) trên màn hình nền hoặc Start Menu.'
],
tier: 'Bộ cài chỉ dành cho người dựng video trên máy tính: câu hỏi đầu tiên có [1] Có – dựng video trên máy này · [2] Chỉ dùng AI trên mạng – không cài gì (mặc định sau 60 giây) · [3] Không làm video – không cài gì. Chọn [1] Có thì ở bước B8 bộ cài quét máy (CPU, RAM, card đồ hoạ, ổ trống) và hỏi: [4] Dựng video trên máy (mặc định – video bản đồ/quy hoạch miễn phí, cài công cụ dựng ~150–300 MB); [2] Dựng + AI ngay trên máy (chỉ máy mạnh, tải nhiều); [1] Thôi – chỉ AI trên mạng (mặc định khi máy yếu, không cài thêm gì; AI tính phí theo nhà cung cấp).',
full: 'Hướng dẫn đầy đủ (cả cảnh báo bảo mật và mã lỗi B0–B9): tệp HUONG_DAN_CAI.md trong thư mục BDS_Studio_Engine sau khi giải nén. Lỗi thì gửi tệp install_report.json (thư mục .bds_studio trong thư mục cá nhân) cho bên hỗ trợ – tệp không chứa mật khẩu hay khoá.'
};
export function stepFor(id, flow) {
const s = STEPS[id];
if (!s) return null;
const _o1 = flow === 'company', pe = flow === 'personal';
const required = s.required || (Array.isArray(s.requiredIn) && s.requiredIn.includes(flow));
const _o4 = (k) => (_o1 && s[k + 'Company']) || (pe && s[k + 'Personal']) || s[k];
return {
...s,
required,
deferrable: !!s.deferrable && !(Array.isArray(s.strictIn) && s.strictIn.includes(flow)),
title: (_o1 && s.titleCompany) || s.title,
laterLabel: _o4('laterLabel') || 'Làm sau',
laterNote: _o4('laterNote') || '',
head: _o4('head'),
note: _o4('note') || '',
todo: _o4('todo') || [],
time: _o4('time'),
cost: _o4('cost'),
actions: ((_o1 && s.actionsCompany) || s.actions).map((a) => ({ ...a, text: (_o1 && a.textCompany) || (pe && a.textPersonal) || a.text }))
};
}
export function stepsFor(flow, opts) { return flowIds(flow, opts).map((id) => stepFor(id, flow)); }
export function boldParts(text) {
return String(text || '').split('**').map((t, _o2) => ({ t, b: _o2 % 2 === 1 })).filter((x) => x.t);
}
export default { flowWho, trialCompanySeats, boldParts, FLOWS, PORTAL_FLOWS, flowIds, FLOW_LABEL, FLOW_INTRO, CHECKLIST, STEPS, ENGINE_GUIDE, stepFor, stepsFor, URL_FIELD_LABEL, NOT_PUBLIC_TEXT, supportEmail, isSaleEdition };

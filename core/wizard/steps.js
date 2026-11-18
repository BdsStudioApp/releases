export const FLOWS = {
personal: ['allow', 'account', 'telegram', 'backup', 'domain', 'ai', 'finish'],
company: ['prepare', 'company', 'allow', 'account', 'telegram', 'tfa', 'doingu', 'domain', 'ai', 'finish', 'handover']
};
const _o5 = (list) => { const _o3 = list.indexOf('account'); return [...list.slice(0, _o3 + 1), 'diachi', ...list.slice(_o3 + 1)]; };
export const PORTAL_FLOWS = { personal: _o5(FLOWS.personal), company: _o5(FLOWS.company) };
export function flowIds(flow, { portal = false } = {}) { return ((portal ? PORTAL_FLOWS : FLOWS)[flow]) || []; }
export const FLOW_LABEL = { personal: 'Cá nhân', company: 'Công ty' };
export const FLOW_INTRO = {
personal: {
icon: '👤', title: 'Cá nhân',
lead: 'Cho một người tự dùng. Khoảng 10–15 phút, không cần cài phần mềm. Dữ liệu nằm trong Gmail của anh/chị, không chung với ai.',
points: ['Tạo máy chủ (nơi cất dữ liệu) trong Gmail', 'Đặt tên đăng nhập và mật khẩu', 'Xong – có sẵn khách mẫu để xem thử']
},
company: {
icon: '🏢', title: 'Công ty',
lead: 'Cho công ty có nhân viên: mỗi người một tài khoản, chỉ thấy phần việc của mình. Làm cùng bên cài đặt, có biên bản bàn giao.',
points: ['Chuẩn bị: Google công ty, tên miền, Telegram', 'Nhập tên, mã số thuế, logo công ty', 'Tạo máy chủ và tài khoản Quản trị (Admin)', 'Bật mã đăng nhập, mời nhân viên, ký bàn giao']
}
};
export const CHECKLIST = [
{ id: 'workspace', required: true, label: 'Tài khoản Google Workspace (Gmail mang tên công ty) do quản trị viên công ty giữ',
hint: '⚠️ Không dùng Gmail cá nhân của nhân viên: người đó nghỉ việc là công ty mất toàn bộ dữ liệu khách.' },
{ id: 'domain', required: true, label: 'Tên miền công ty (đã có website thì mua THÊM 1 tên miền riêng cho app) + tài khoản Cloudflare miễn phí của công ty',
hint: 'App ở app.tencongty.vn, trang riêng nhân viên ở ten.tencongty.vn. Cần người đổi được nameserver ở nơi mua tên miền.' },
{ id: 'telegram', required: true, label: 'Bot Telegram (tài khoản tự nhắn tin) của công ty, tạo bằng @BotFather + điện thoại có Telegram',
hint: 'Bot báo khách mới, nhắc việc, gửi mã đăng nhập. Sau này mỗi sale tạo được bot riêng.' },
{ id: 'ai', required: false, label: 'Khoá AI Gemini (mã để app dùng AI) – công ty tự đăng ký, tự trả phí',
hint: 'Gemini có mức miễn phí (giới hạn số lần/ngày).' },
{ id: 'landing', required: false, label: 'Trang giới thiệu (landing) của công ty, nếu có, để khách để lại số',
hint: 'Không có cũng được – nhập khách bằng tay hoặc làm sau.' }
];
const _o1 = 'Trang Google – ảnh hướng dẫn sẽ bổ sung';
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
export const STEPS = {
prepare: {
id: 'prepare', phase: 'any', required: true, check: 'manual', flows: ['company'],
title: 'Chuẩn bị trước',
head: 'Để buổi cài không phải dừng giữa chừng vì thiếu thứ gì.',
note: 'Mọi tài khoản đứng tên công ty – nhân viên nghỉ việc không mang dữ liệu đi được.',
todo: [
'Có tài khoản Google Workspace (Gmail mang tên công ty).',
'Hỏi ai đang quản lý tên miền của công ty.',
'Tạo bot Telegram (tài khoản tự nhắn tin) cho công ty.',
'Đánh dấu các mục đã có → bấm **Kiểm tra bước này**.'
],
time: 'Khoảng 30–60 phút, làm trước buổi cài',
cost: 'Có tốn phí: Google Workspace trả theo tháng, tên miền .com khoảng 10–15 USD/năm (giá tham khảo, xem lại trước khi mua)',
actions: [
{ text: 'Quản trị viên công ty tạo một tài khoản Google Workspace riêng cho BDS Studio, vd bds@congty.vn. Hôm cài: bấm ảnh đại diện góc phải trang Google để chắc đúng tài khoản này.', slot: 'ext-google-account', note: _o1 },
{ text: 'Hỏi người quản lý tên miền: ai thêm được bản ghi CNAME (một dòng trỏ tên miền con, vd app.congty.vn, về app) ở nơi mua tên miền hoặc Cloudflare.' },
{ text: 'Tạo bot Telegram: mở Telegram → tìm **@BotFather** → gõ **/newbot** → đặt tên → lưu **mã bot** (dạng 123456:ABC…).', slot: 'ext-botfather', note: 'Trang Telegram – ảnh hướng dẫn sẽ bổ sung' },
{ text: 'Đánh dấu các mục đã có ở danh sách dưới, rồi bấm **Kiểm tra bước này**.' }
]
},
company: {
id: 'company', phase: 'any', required: true, check: 'form', flows: ['company'],
title: 'Thông tin công ty',
head: 'Để tên và logo công ty hiện trên app, trên báo giá gửi khách và trên biên bản bàn giao.',
todo: [
'Gõ tên công ty đúng như giấy phép kinh doanh.',
'Gõ mã số thuế (10 số; chi nhánh thêm 3 số).',
'Chọn tệp logo (ảnh PNG hoặc JPG).'
],
time: 'Khoảng 2 phút', cost: _o0,
actions: [
{ text: 'Gõ tên công ty đúng như trên giấy phép kinh doanh.' },
{ text: 'Gõ mã số thuế: 10 số, chi nhánh có thêm 3 số (vd 0101234567-001).' },
{ text: 'Chọn tệp logo (PNG/JPG, nền trong suốt càng đẹp). App tự thu nhỏ.' }
]
},
allow: {
id: 'allow', phase: 'pre', main: true, required: true, check: 'auto', flows: ['personal', 'company'],
title: 'Tạo máy chủ',
titleCompany: 'Tạo máy chủ công ty',
head: 'Để có nơi cất dữ liệu khách ngay trong Google của anh/chị – không ai khác xem được, kể cả bên bán.',
headCompany: 'Để dữ liệu khách nằm trong Google CÔNG TY – nhân viên nghỉ việc không mang đi được, bên cài đặt cũng không xem được.',
note: 'Máy chủ ở đây là một trang tính Google (Sheet) do Google chạy giúp – không cần mua máy, không cài gì.',
todo: [
'Bấm **Tạo bản sao** (bên dưới, rồi trên trang Google).',
'Trong Sheet: menu **BDS Studio › Cài đặt** → **Cho phép**.',
'Trong hộp hiện ra: **Triển khai → Tuỳ chọn triển khai mới**.',
'Bấm **Mở BDS Studio và kết nối** (hoặc **Chép URL** → dán vào ô dưới).'
],
todoCompany: [
'Dùng Google CÔNG TY, bấm **Tạo bản sao** (bên dưới, rồi trên trang Google).',
'Trong Sheet: menu **BDS Studio › Cài đặt** → **Cho phép**.',
'Trong hộp hiện ra: **Triển khai → Tuỳ chọn triển khai mới**.',
'Bấm **Mở BDS Studio và kết nối** (hoặc **Chép URL** → dán vào ô dưới).'
],
todoManual: [
'Tạo Sheet mới, dán 3 tệp theo hướng dẫn dưới (có nút **Chép** sẵn).',
'Tải lại Sheet → menu **BDS Studio › Cài đặt** → **Cho phép**.',
'Trong hộp hiện ra: **Triển khai → Tuỳ chọn triển khai mới**.',
'Bấm **Mở BDS Studio và kết nối** (hoặc **Chép URL** → dán vào ô dưới).'
],
todoGoogle: [
'Bấm **Cài bằng tài khoản Google** → chọn tài khoản → **Cho phép**.',
'Google hỏi thì bật **Google Apps Script API** (trang mở sẵn) rồi quay lại.',
'Bấm **Cho phép máy chủ chạy** → **Cho phép** – app tự sang bước kế.'
],
timeGoogle: 'Khoảng 3–5 phút',
time: 'Khoảng 5 phút (dán tay: 10–15 phút)', cost: _o0,
actions: [
{ way: 'copy', text: 'Bấm **Tạo bản sao** bên dưới → Google hỏi → bấm **Tạo bản sao** (Make a copy).',
textCompany: 'Bấm **Tạo bản sao** bên dưới bằng tài khoản Google CÔNG TY → bấm **Tạo bản sao** (Make a copy).',
link: 'template', guide: 'copy', note: _o1 },
{ way: 'manual', text: 'Mở **sheets.new** (Sheet trống mới) bằng đúng tài khoản Google giữ dữ liệu.',
textCompany: 'Mở **sheets.new** (Sheet trống mới) bằng tài khoản Google CÔNG TY.', link: 'sheetsNew' },
{ way: 'manual', text: 'Trên Sheet: **Tiện ích mở rộng › Apps Script** (Extensions › Apps Script – nơi dán mã).' },
{ way: 'manual', text: 'Bấm tệp **Mã.gs** (Code.gs) ở cột trái → Ctrl+A → dán **TatCa.gs** → đổi tên thành TatCa.', installer: 'tatca' },
{ way: 'manual', text: 'Bấm **+** › **Tập lệnh** (Script) → tên CaiDat → Ctrl+A → dán **CaiDat.gs**.', installer: 'caidat' },
{ way: 'manual', text: 'Bánh răng **Cài đặt dự án** → tick **Hiện tệp kê khai "appsscript.json"**.', guide: '4', note: _o1 },
{ way: 'manual', text: 'Quay lại **< >** → bấm **appsscript.json** → Ctrl+A → dán **appsscript.json** → Lưu (Ctrl+S).', installer: 'manifest' },
{ way: 'manual', text: 'Quay lại thẻ Sheet → bấm **Tải lại** (F5) – menu **BDS Studio** hiện ra.' },
{ text: 'Trong Sheet vừa mở: menu **BDS Studio › Cài đặt** → **Cho phép** (Allow).', slot: 'ext-sheet-menu', note: _o1 },
{ text: 'Google ghi "chưa xác minh" (bình thường): **Nâng cao** (Advanced) → **Đi tới…** (Go to) → **Cho phép**.', slot: 'ext-google-allow', note: _o1 },
{ text: 'Hộp **Triển khai máy chủ** trong Sheet: bấm **Triển khai → Tuỳ chọn triển khai mới** (New deployment).', guide: '9', note: _o1 },
{ text: 'Mục **Quản lý triển khai** trống là bình thường (bản sao Sheet chưa có triển khai – phải bấm triển khai mới 1 lần).' },
{ text: '⚙ **Ứng dụng web** (Web app) → Thực thi: **Tôi** (Me) → Truy cập: **Bất kỳ ai** (Anyone).' },
{ text: 'Bấm **Triển khai** (Deploy) → **Cho phép** (Allow) → **Sao chép URL** (Copy).' },
{ text: 'Quay lại hộp trong Sheet → bấm **Tôi đã triển khai xong**.' },
{ text: 'Hộp có nút **Mở BDS Studio và kết nối**? Bấm – app tự điền, tự kiểm.', guide: '11', note: _o1 },
{ text: 'Chưa có nút: bấm **Chép URL** trong hộp → dán vào ô dưới → **Kiểm tra bước này**.', guide: '10' },
{ text: 'Hộp hỏi địa chỉ app? Dán dòng **Địa chỉ app của anh/chị** (ngay dưới) vào ô đó.' }
]
},
account: {
id: 'account', phase: 'pre', main: true, required: true, check: 'auto', flows: ['personal', 'company'],
title: 'Tạo tài khoản',
titleCompany: 'Tạo tài khoản Quản trị (Admin)',
head: 'Để chỉ anh/chị đăng nhập được app – mật khẩu chỉ anh/chị biết, kể cả bên bán cũng không xem được.',
headCompany: 'Để tạo tài khoản Quản trị (Admin) – người giữ quyền cao nhất công ty (thường là giám đốc); mật khẩu chỉ người đó biết.',
todo: [
'Gõ email (để lấy lại mật khẩu khi quên) → bấm **Gửi mã**.',
'Gõ mã 6 số trong thư → bấm **Tạo tài khoản**.',
'Đặt tên đăng nhập và mật khẩu (từ 8 ký tự).',
'Bấm **Tạo mật khẩu** – app tự sang bước kế.'
],
time: 'Khoảng 3 phút', cost: _o0,
actions: [
{ text: 'Gõ **email** của anh/chị (bắt buộc) → bấm **Gửi mã**. Thư gửi từ chính tài khoản Google đã cài máy chủ.' },
{ text: 'Mở thư, gõ **mã 6 số** vào ô (dùng được 15 phút). Không thấy thư: xem mục Thư rác/Spam, Quảng cáo, hoặc chờ 60 giây rồi bấm **Gửi lại mã**.' },
{ text: 'Máy chủ báo không gửi được thư (Google giới hạn số thư/ngày, hoặc công ty chặn gửi thư)? Bấm **Dùng email tài khoản Google đang chạy máy chủ** nếu đó là email của anh/chị.' },
{ text: 'Xác nhận xong, bấm **Tạo tài khoản**.', shot: 'app-setup' },
{ text: 'Đặt **tên đăng nhập**: chữ thường, không dấu, vd lan.nguyen.' },
{ text: 'Đặt **mật khẩu** từ 8 ký tự. Ghi lại nơi an toàn.' },
{ text: 'Bấm **Tạo mật khẩu** – app tự mở lại trợ lý ở bước kế.' }
]
},
diachi: {
id: 'diachi', phase: 'post', main: true, required: true, deferrable: true, check: 'auto', flows: ['personal', 'company'], portalOnly: true,
title: 'Chọn địa chỉ app',
titleCompany: 'Địa chỉ app công ty',
head: 'Để có địa chỉ web riêng mở app của anh/chị – miễn phí dạng ten.bdsstudio.app, hoặc tên miền riêng.',
headCompany: 'Để có địa chỉ web riêng mở app của công ty – tên miền công ty, hoặc miễn phí dạng tencongty.bdsstudio.app.',
note: 'Mỗi khách một app riêng, không dùng chung. Trang này chỉ để cài, không giữ dữ liệu: tạo xong app tự chuyển sang địa chỉ mới.',
todo: [
'Chọn **Dùng địa chỉ miễn phí** hoặc **Gán tên miền riêng**.',
'Gõ tên muốn dùng, chờ dòng **✅ Còn trống**.',
'Bấm **Tạo ngay**, chờ khoảng 1–3 phút.',
'App tự mở ở địa chỉ mới – đăng nhập ở đó.'
],
todoNoService: [
'Gõ tên muốn dùng → bấm **Gửi tên cho bên bán**.',
'Bấm **Làm sau** – dùng app ngay ở địa chỉ này.',
'Bên bán gửi địa chỉ riêng qua email trong 24 giờ.'
],
todoCompany: [
'Trả lời **Công ty đã có tên miền chưa?** bên dưới.',
'Gõ tên miền hoặc tên muốn dùng theo hướng dẫn hiện ra.',
'Bấm **Tạo ngay**, chờ khoảng 1–3 phút.',
'App tự mở ở địa chỉ mới – đăng nhập ở đó.'
],
time: 'Khoảng 1–3 phút (tên miền riêng: chờ thêm tới 24 giờ, thường dưới 30 phút)',
cost: 'Địa chỉ miễn phí: 0 đ · Tên miền riêng: tự trả tiền tên miền, .com khoảng 10–15 USD/năm (giá tham khảo)',
actions: [
{ text: 'Chọn **Dùng địa chỉ miễn phí** hoặc **Gán tên miền riêng** bên dưới.', textCompany: 'Trả lời **Công ty đã có tên miền chưa?** bên dưới.' },
{ text: 'Địa chỉ miễn phí: gõ tên muốn dùng (chữ thường không dấu, số, dấu "-") → chờ dòng **✅ Còn trống** → bấm **Tạo ngay**.' },
{ text: 'Tên miền riêng: gõ tên miền (vd app.tencuaban.com) → thêm 1 dòng CNAME (dòng trỏ tên miền về app) đúng như bảng hiện ra → bấm **Tạo ngay** → chờ tên miền chạy.' },
{ text: 'Tạo xong (khoảng 1–3 phút): app tự mở ở địa chỉ mới và tự nối máy chủ – anh/chị đăng nhập ở đó để làm tiếp các bước còn lại.' }
]
},
telegram: {
skipNote: 'Không nhận tin báo khách mới, nhắc việc qua Telegram. Nối sau được ở Cài đặt › Kết nối.',
id: 'telegram', phase: 'post', required: false, check: 'auto', flows: ['personal', 'company'], requiredIn: ['company'], deferrable: true,
title: 'Nhận tin qua Telegram',
head: 'Để app nhắn Telegram cho anh/chị khi có khách mới, đến hẹn gọi lại, đến ngày đóng tiền.',
headCompany: 'Để app nhắn Telegram khi có khách mới, đến hẹn gọi lại, và gửi mã đăng nhập (bảo mật 2 lớp).',
notePersonal: 'Nối xong, đăng nhập ở máy lạ sẽ hỏi thêm mã 6 số gửi qua Telegram (bảo mật 2 lớp) – bước sau tạo mã dự phòng.',
todo: [
'Chưa có Telegram? Bấm **Tải Telegram**.',
'Trong Telegram, nhắn **@BotFather** để tạo bot (tài khoản tự nhắn tin), chép mã bot.',
'Bấm **Mở Cài đặt › Kết nối** → dán mã bot → **Lưu**.',
'Nhắn "chào" cho bot → bấm **Tự tìm chat id** (mã cuộc trò chuyện) → **Lưu**.'
],
time: 'Khoảng 5–10 phút', cost: _o0,
actions: [
{ text: 'Chưa có Telegram? Bấm **Tải Telegram** (điện thoại hoặc máy tính).', link: 'telegramDownload' },
{ text: 'Trong Telegram tìm **@BotFather** → gõ **/newbot** → đặt tên bot.', slot: 'ext-botfather', note: 'Trang Telegram – ảnh hướng dẫn sẽ bổ sung' },
{ text: 'Đặt tên đăng nhập cho bot (phải kết thúc bằng "bot") → chép **mã bot** (dạng 123456:ABC…).' },
{ text: 'Bấm **Mở Cài đặt › Kết nối** → mục Telegram: dán mã bot → **Lưu**.', shot: 'app-connection', go: 'connection' },
{ text: 'Nhắn "chào" cho bot → trong app bấm **Tự tìm chat id** (mã số cuộc trò chuyện với bot) → **Lưu**.' },
{ text: 'Bấm **Kiểm tra bước này** – app gửi 1 tin thử.' }
]
},
tfa: {
id: 'tfa', phase: 'post', required: true, check: 'auto', flows: ['company'],
title: 'Bảo mật 2 lớp',
head: 'Để kẻ gian có mật khẩu cũng không vào được – đăng nhập phải nhập thêm mã 6 số gửi tới điện thoại.',
note: 'Bắt buộc: dữ liệu khách của cả công ty nằm ở đây, phải giữ an toàn theo Luật Bảo vệ dữ liệu cá nhân (Luật số 91/2025/QH15).',
todo: [
'Đã nối Telegram: mã tự gửi qua Telegram, không phải làm thêm.',
'Muốn chắc hơn: bấm **Cài ứng dụng xác thực** (app tạo mã trên điện thoại).',
'Bấm **Tạo mã dự phòng**, in hoặc tải về, cất kỹ.',
'Bấm **Kiểm tra bước này**.'
],
time: 'Khoảng 3 phút', cost: _o0,
actions: [
{ text: 'Đã nối Telegram ở bước trước thì mã tự gửi qua Telegram. Muốn chắc hơn: bấm **Cài ứng dụng xác thực** và quét mã QR bằng Google Authenticator.', shot: 'app-security' },
{ text: 'Bấm **Tạo mã dự phòng**: 10 mã, in ra hoặc tải về, cất nơi an toàn (dùng khi mất điện thoại).' },
{ text: 'Bấm **Kiểm tra bước này**.' }
]
},
backup: {
skipNote: 'Mất điện thoại hoặc Telegram thì không đăng nhập được ở máy mới. Tạo sau được ở Cài đặt › Bảo mật.',
id: 'backup', phase: 'post', required: false, check: 'auto', flows: ['personal'],
title: 'Mã dự phòng',
head: 'Để vẫn đăng nhập được khi mất điện thoại hoặc mất Telegram.',
note: 'Chưa nối Telegram thì chưa cần – bấm **Kiểm tra bước này**, app sẽ báo.',
todo: [
'Bấm **Tạo mã dự phòng** → gõ mật khẩu.',
'Bấm **Gửi mã qua Telegram** → gõ 6 số vừa nhận → **Tạo mã**.',
'Bấm **In** hoặc **Tải tệp**, cất kỹ → **Tôi đã lưu**.',
'Bấm **Kiểm tra bước này**.'
],
time: 'Khoảng 2 phút', cost: _o0,
actions: [
{ text: 'Bấm **Tạo mã dự phòng** trong khung dưới → nhập mật khẩu.', shot: 'app-security' },
{ text: 'Bấm **Gửi mã qua Telegram** → nhập 6 số vừa nhận → **Tạo mã**.' },
{ text: 'Bấm **In** hoặc **Tải tệp** 10 mã, cất nơi an toàn → **Tôi đã lưu**.' },
{ text: 'Bấm **Kiểm tra bước này**.' }
]
},
domain: {
skipNote: 'App vẫn mở ở địa chỉ có sẵn bên bán đã gửi. Gắn tên miền riêng sau được.',
id: 'domain', phase: 'post', required: false, check: 'auto', flows: ['personal', 'company'], requiredIn: ['company'], deferrable: true,
laterLabelCompany: 'Làm tiếp sau',
laterNoteCompany: 'Đã lưu. Bước "Tên miền công ty" vẫn bắt buộc – tên miền chạy rồi thì bấm nút Trợ lý cài đặt ở góc màn hình để làm nốt.',
title: 'Địa chỉ mở app',
titleCompany: 'Tên miền công ty',
head: 'Để mở app bằng tên miền riêng của anh/chị (vd app.tenanh.com) cho chuyên nghiệp khi gửi link.',
headCompany: 'Để app công ty chạy ở app.tencongty.vn và mỗi nhân viên có ngay trang riêng ten.tencongty.vn kéo khách về danh sách của chính mình.',
noteCompany: 'Bắt buộc với bản Công ty. Đã có website thì nên mua THÊM 1 tên miền riêng cho app – app và dữ liệu khách không đụng website cũ. Đang chờ tên miền chạy? Bấm **Làm tiếp sau** – làm các bước còn lại, dùng app ngay; bước này vẫn ghi "chưa xong".',
note: 'Không cần tên miền riêng? Dùng địa chỉ có sẵn (vd tenkhach.bdsstudio.app) – miễn phí, chạy y như nhau.',
todo: [
'Gửi email cho bên bán, kèm tên miền muốn dùng.',
'Thêm 1 dòng CNAME (dòng trỏ tên miền về app) theo bảng dưới.',
'Gõ tên miền vào ô dưới → bấm **Kiểm tra bước này**.'
],
todoShared: [
'Giữ **Địa chỉ mặc định (miễn phí)** – không cần làm gì thêm.',
'Bấm **Kiểm tra bước này** → **Tiếp**.'
],
todoSharedWait: [
'Gõ tên muốn dùng → bấm **Gửi tên cho bên bán**.',
'Bấm **Làm sau** – dùng app ngay ở địa chỉ này.'
],
todoCompany: [
'Trả lời **Công ty đã có tên miền chưa?**, gõ tên miền.',
'Thêm tên miền vào Cloudflare gói **Free**, đổi nameserver ở nơi mua.',
'Bật trang nhân viên: **Chép mã Worker** → dán vào Cloudflare (1 lần).',
'Bấm **Kiểm tra bước này** – xanh là xong.'
],
time: 'Khoảng 10 phút, rồi chờ tên miền chạy (thường 30 phút, lâu nhất 24 giờ)',
timeCompany: 'Khoảng 20–30 phút, rồi chờ nameserver đổi xong (thường dưới 1 giờ, lâu nhất 24 giờ)',
cost: 'Địa chỉ có sẵn: miễn phí · Tên miền .com khoảng 10–15 USD/năm (giá tham khảo)',
costCompany: 'Cloudflare gói Free (DNS, https, Worker 100.000 lượt/ngày): 0 đ · Tên miền: công ty tự trả nhà đăng ký, .com khoảng 10–15 USD/năm (giá tham khảo)',
actionsCompany: [
{ text: 'Trả lời **Công ty đã có tên miền chưa?** bên dưới. Chưa có: bấm **Mua tên miền** (Cloudflare bán đúng giá gốc; đuôi .vn mua ở nhà đăng ký Việt Nam).' },
{ text: 'Cloudflare của công ty › **Add a domain** → gõ tên miền → chọn gói **Free** → đổi 2 nameserver (máy chủ tên miền) ở nơi mua sang 2 tên Cloudflare đưa → bấm **Kiểm tra tên miền**.' },
{ text: 'Gắn app.<tên miền> vào app, rồi bật Worker (chương trình nhỏ chạy trên Cloudflare) cho trang nhân viên theo 4 dòng ở khung dưới – hoặc nhờ bên bán làm bằng token (mã quyền giới hạn).' },
{ text: 'Bấm **Kiểm tra bước này**: app kiểm tên miền đã chạy trên Cloudflare, app.<tên miền> mở đúng app và trang nhân viên đã chạy.' }
],
actions: [
{ text: 'Vào trang quản lý tên miền (nơi mua tên miền hoặc Cloudflare) → thêm bản ghi CNAME (một dòng trỏ tên miền con về app) đúng như bảng dưới; TTL (thời gian lưu tạm) để Tự động.', slot: 'ext-dns-cname', note: 'Trang quản lý tên miền – ảnh hướng dẫn sẽ bổ sung' },
{ text: 'Báo bên cài đặt để gắn tên miền vào app (một lần).',
textPersonal: 'Tên miền được gắn ở phía bên bán: gửi email cho bên bán (địa chỉ ở khung dưới) kèm tên miền muốn dùng. Bên bán gửi lại giá trị "Trỏ tới" của dòng CNAME và báo khi gắn xong.' },
{ text: 'Gõ tên miền vào ô dưới rồi bấm **Kiểm tra bước này** – máy chủ thử mở tên miền đó.' }
]
},
ai: {
skipNote: 'Các nút AI ẩn đi, app vẫn chạy bình thường. Bật sau được ở Cài đặt › Kết nối.',
id: 'ai', phase: 'post', required: false, check: 'auto', flows: ['personal', 'company'],
title: 'Bật AI (Gemini)',
head: 'Để AI soạn sẵn tin Zalo, tóm tắt khách, đọc phiếu chính sách giúp anh/chị.',
note: 'Khoá miễn phí: Google có thể dùng nội dung gửi lên để cải thiện sản phẩm. Làm với khách thật nên dùng khoá trả phí; không gửi số CCCD của khách.',
todo: [
'Bấm **Mở aistudio.google.com**, đăng nhập Google.',
'Bấm **Get API key** → **Create API key** → **Copy** (chép khoá AI – mã để app dùng AI).',
'Bấm **Mở Cài đặt › Kết nối** → dán vào mục Gemini → **Lưu**.',
'Bấm **Kiểm tra bước này**.'
],
time: 'Khoảng 3–5 phút', cost: 'Miễn phí trong hạn mức của Google (giới hạn số lần/ngày) · khoá trả phí tính tiền theo lượt dùng',
actions: [
{ text: 'Bấm **Mở aistudio.google.com** → đăng nhập. Trang AI Studio bằng tiếng Anh: bấm **Get API key** (Lấy khoá API).', link: 'aistudio', slot: 'ext-aistudio', note: _o1 },
{ text: 'Bấm **Create API key** (Tạo khoá API) → **Copy** (Chép) khoá AIza….' },
{ text: 'Bấm **Mở Cài đặt › Kết nối** → mục Gemini: dán khoá → **Lưu**.', shot: 'app-connection-gemini', go: 'connection' },
{ text: 'Bấm **Kiểm tra bước này** – app hỏi thử AI một câu.' }
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
note: 'Chưa biết ai thì để 0, mời sau ở Cài đặt › Người dùng.',
skipNote: 'Chỉ mình anh/chị dùng app lúc này. Mời nhân viên sau ở Cài đặt › Người dùng.',
todo: [
'Chọn số nhân viên bán hàng (Sale) muốn tạo sẵn.',
'Gõ họ tên và email từng người (số điện thoại nếu có).',
'Bấm **Tạo lời mời và gửi email**.',
'Chưa cần? Bấm **Bỏ qua bước này**.'
],
time: 'Khoảng 1 phút mỗi người', cost: _o0,
actions: [
{ text: 'Bấm **+** để chọn số nhân viên bán hàng (Sale); cần Quản lý / Trưởng nhóm thì chọn thêm ở ô dưới.' },
{ text: 'Gõ **họ tên** và **email** từng người (bắt buộc – app gửi link mời và mã xác nhận tới email này); số điện thoại giúp gửi qua Zalo.' },
{ text: 'Bấm **Tạo lời mời và gửi email**. Thư gửi từ chính tài khoản Google đang chạy máy chủ.' },
{ text: 'Ai chưa nhận được thư: bấm **Chép link mời** hoặc **Gửi qua Zalo**. Link dùng 1 lần, hết hạn sau 7 ngày.' },
{ text: 'Nhân viên bấm link → đặt mật khẩu → nhập mã 6 số trong email → vào app với đúng vai trò.' }
]
},
finish: {
id: 'finish', phase: 'post', main: true, required: true, check: 'auto', flows: ['personal', 'company'],
title: 'Kiểm tra toàn bộ',
head: 'Để chắc mọi phần chạy thật trước khi dùng với khách.',
todo: [
'Bấm **Kiểm tra toàn bộ**.',
'Dòng ❌: làm theo **Cách sửa** ngay dưới, rồi kiểm lại.'
],
time: 'Khoảng 1 phút', cost: _o0,
actions: [
{ text: 'Bấm **Kiểm tra toàn bộ** – app kiểm máy chủ, Sheet, nhắc việc tự động, Telegram, AI.', shot: 'app-selftest' },
{ text: 'Dòng ❌: đọc **Cách sửa** ngay dưới dòng đó, sửa xong kiểm lại.' }
]
},
handover: {
id: 'handover', phase: 'post', required: true, check: 'manual', flows: ['company'],
title: 'Biên bản bàn giao',
head: 'Để hai bên ký xác nhận đã cài xong và đã giao tài khoản Quản trị (Admin).',
note: 'Bên cài đặt không giữ mật khẩu. Biên bản ghi ngày hết dùng thử (tính từ lần đầu app mở sau khi tạo tài khoản Quản trị).',
todo: [
'Xem lại biên bản bên dưới.',
'Bấm **In / Lưu PDF** → hai bên ký.',
'Tích **Đã in và hai bên đã ký** → **Kiểm tra bước này**.'
],
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
const _o2 = flow === 'company', pe = flow === 'personal';
const required = s.required || (Array.isArray(s.requiredIn) && s.requiredIn.includes(flow));
const _o4 = (k) => (_o2 && s[k + 'Company']) || (pe && s[k + 'Personal']) || s[k];
return {
...s,
required,
deferrable: !!s.deferrable && !(Array.isArray(s.strictIn) && s.strictIn.includes(flow)),
title: (_o2 && s.titleCompany) || s.title,
laterLabel: _o4('laterLabel') || 'Làm sau',
laterNote: _o4('laterNote') || '',
head: _o4('head'),
note: _o4('note') || '',
todo: _o4('todo') || [],
time: _o4('time'),
cost: _o4('cost'),
actions: ((_o2 && s.actionsCompany) || s.actions).map((a) => ({ ...a, text: (_o2 && a.textCompany) || (pe && a.textPersonal) || a.text }))
};
}
export function stepsFor(flow, opts) { return flowIds(flow, opts).map((id) => stepFor(id, flow)); }
export function boldParts(text) {
return String(text || '').split('**').map((t, _o3) => ({ t, b: _o3 % 2 === 1 })).filter((x) => x.t);
}
export default { boldParts, FLOWS, PORTAL_FLOWS, flowIds, FLOW_LABEL, FLOW_INTRO, CHECKLIST, STEPS, ENGINE_GUIDE, stepFor, stepsFor, URL_FIELD_LABEL, NOT_PUBLIC_TEXT, supportEmail, isSaleEdition };

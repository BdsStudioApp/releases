import { providerName } from './ai_providers.596b40a694.js';
export const LINKS = {
script: 'https://script.google.com/home',
aistudio: 'https://aistudio.google.com/apikey',
gcpBilling: 'https://console.cloud.google.com/billing',
anthropicKeys: 'https://console.anthropic.com/settings/keys',
anthropicBilling: 'https://console.anthropic.com/settings/billing',
botfather: 'https://t.me/BotFather',
flow: 'https://labs.google/fx/tools/flow',
vbee: 'https://vbee.vn',
veoPrice: 'https://ai.google.dev/gemini-api/docs/pricing',
runwayPrice: 'https://docs.dev.runwayml.com/guides/pricing/',
geoapify: 'https://myprojects.geoapify.com/',
geoapifyPricing: 'https://www.geoapify.com/pricing/'
};
export const MAP_COST = 'Miễn phí trong hạn mức gói miễn phí của nhà cung cấp – vượt hạn mức thì nhà cung cấp tính phí theo tài khoản của anh/chị';
export const MAP_PROVIDERS = [{ id: 'geoapify', name: 'Geoapify', recommended: true, signup_url: LINKS.geoapify }];
export function itemVisibleFor(item, { edition = 'owner', device = 'desktop' } = {}) {
if (item.saleOnly && String(edition || 'owner') === 'owner') return false;
if (item.video && device === 'mobile') return false;
return true;
}
export const VIDEO_ITEM_IDS = ['vbee', 'map', 'flow', 'veo_api', 'kling', 'runway'];
export const GEMINI_TERMS_URL = 'https://ai.google.dev/gemini-api/terms';
export const GEMINI_PRIVACY = '⚠️ Quyền riêng tư: với khoá Gemini MIỄN PHÍ, theo điều khoản Gemini API của Google, nội dung app gửi lên (tin nhắn, ghi chú, thông tin khách) và câu trả lời có thể được Google dùng để cải thiện sản phẩm, và người của Google có thể đọc. '
+ 'Khi xử lý dữ liệu khách thật, nên dùng khoá thuộc dự án đã BẬT THANH TOÁN (Google Cloud Billing) – điều khoản gói trả phí không dùng nội dung để cải thiện sản phẩm. Không gửi số CCCD, giấy tờ tuỳ thân của khách. '
+ 'Xem điều khoản hiện hành: ai.google.dev/gemini-api/terms.';
export const GEMINI_PRIVACY_SHORT = '⚠️ Khoá Gemini miễn phí: Google có thể dùng và cho người đọc nội dung gửi lên. Dữ liệu khách thật nên dùng khoá đã bật thanh toán.';
export const FALLBACK_PRICES = { claude_api: { in: 2.0, out: 10.0 }, gemini: { in: 0.30, out: 2.50 } };
export const PROFILE_EMAIL_HASH = '#/settings/profile';
export const ITEMS = [
{
id: 'server', name: 'Máy chủ Google', required: true, icon: 'server',
hint: 'Lưu và đồng bộ dữ liệu khách',
link: { href: LINKS.script, label: 'Mở Apps Script' },
quick: ['Mở Sheet máy chủ (tạo bằng Trợ lý cài đặt).', ['Menu ', { b: 'BDS Studio › Cài đặt' }, ' → Cho phép.'], ['Triển khai → Ứng dụng web, quyền ', { b: 'Bất kỳ ai' }, '.'], 'Chép URL …/exec, dán vào ô trên.'],
use: 'Lưu dữ liệu, đồng bộ giữa các máy, nhập khách landing, gửi nhắc việc',
cost: { label: 'Miễn phí', detail: 'chạy trên tài khoản Google của anh/chị' },
test: 'status',
steps: [
['Phần A – Chưa có máy chủ: mở ', { b: 'Trợ lý cài đặt' }, ' › bước ', { b: 'Tạo máy chủ' }, ' (bấm Tạo bản sao Sheet mẫu, đúng tài khoản Google giữ dữ liệu).'],
['Phần B – Trong Sheet máy chủ: menu ', { b: 'BDS Studio › Cài đặt' }, ' → ', { b: 'Cho phép' }, '. Google ghi "chưa xác minh" là bình thường: ', { b: 'Nâng cao' }, ' → ', { b: 'Đi tới…' }, ' → ', { b: 'Cho phép' }, '.'],
['Phần C – ', { b: 'Triển khai' }, ' → ', { b: 'Tùy chọn triển khai mới' }, ' → bánh răng → ', { b: 'Ứng dụng web' }, '. Thực thi với tư cách: ', { b: 'Tôi' }, '. Người có quyền truy cập: ', { b: 'Bất kỳ ai' }, ' → ', { b: 'Triển khai' }, '.'],
['Phần D – Chép ', { b: 'URL ứng dụng web' }, ' (dạng https://script.google.com/macros/s/…/exec; hoặc menu BDS Studio › Lấy URL máy chủ), dán vào ô bên dưới → ', { b: 'Lưu' }, ' → ', { b: 'Kiểm tra' }, '.'],
'Sửa mã sau này: Triển khai → Quản lý triển khai → bút chì → Phiên bản: Phiên bản mới → Triển khai (URL giữ nguyên).'
]
},
{
id: 'gemini', name: 'Khoá AI Gemini', required: true, secrets: ['gemini_key'], target: 'gemini', icon: 'sparkle',
optionalSolo: 'Tuỳ chọn – bật nếu muốn dùng các nút AI',
hint: 'AI soạn tin, tóm tắt khách',
link: { href: LINKS.aistudio, label: 'Lấy khoá ở AI Studio' },
quick: ['Mở AI Studio bằng tài khoản Google.', ['Bấm ', { b: 'Create API key' }, ', chép khoá AIza…'], 'Dán vào ô trên, bấm Lưu và kiểm tra.'],
use: 'AI mặc định: soạn tin Zalo, tóm tắt khách, đọc chính sách, viết kịch bản',
cost: { label: 'Miễn phí', detail: 'trong hạn mức Google AI Studio (giới hạn lượt mỗi phút/ngày)' },
steps: [
['Mở ', { a: LINKS.aistudio, t: 'aistudio.google.com/apikey' }, ' bằng tài khoản Google.'],
['Bấm ', { b: 'Create API key' }, ' (Tạo khoá API) → chọn dự án có sẵn hoặc tạo mới → chép khoá (bắt đầu bằng AIza…).'],
'Dán vào ô "Khoá Gemini API" bên dưới → Lưu → Kiểm tra (đèn xanh là dùng được).',
'Quyền riêng tư: khoá MIỄN PHÍ (chưa bật thanh toán) – theo điều khoản Gemini API, Google có thể dùng nội dung gửi lên để cải thiện sản phẩm và người của Google có thể đọc. Dữ liệu khách thật nên dùng khoá đã bật thanh toán (Cloud Billing) – xem mục dưới ô nhập khoá.'
]
},
{
id: 'telegram', name: 'Telegram', required: true, secrets: ['telegram_token', 'telegram_chat_id'], target: 'telegram', findChat: true, icon: 'send',
optionalSolo: 'Tuỳ chọn – bật nếu muốn nhận nhắc qua Telegram',
hint: 'Báo khách mới và nhắc việc',
link: { href: LINKS.botfather, label: 'Mở BotFather' },
quick: [['Nhắn ', { code: '/newbot' }, ' cho BotFather, đặt tên bot.'], 'Dán mã bot vào ô trên.', ['Mở bot, bấm ', { b: 'Bắt đầu' }, ', nhắn "chào".'], ['Bấm ', { b: 'Tự tìm chat id' }, ', rồi Lưu và kiểm tra.']],
use: 'Báo khách mới, nhắc lịch đóng tiền, cảnh báo đăng nhập sai, mã đặt lại mật khẩu',
cost: { label: 'Miễn phí', detail: 'Telegram không thu phí bot' },
steps: [
['Trong Telegram mở ', { a: LINKS.botfather, t: '@BotFather' }, ' → gõ ', { code: '/newbot' }, ' → đặt tên hiển thị → đặt tên đăng nhập kết thúc bằng "bot".'],
'BotFather trả về mã bot (token, dạng 123456:ABC…) → dán vào ô "Mã bot Telegram" → Lưu.',
['Mở bot vừa tạo, bấm ', { b: 'Bắt đầu' }, ' và nhắn ', { b: '"chào"' }, '.'],
['Quay lại đây bấm ', { b: 'Tự tìm chat id' }, ' – app tự đọc tin vừa nhắn và lưu chat id.'],
['Bấm ', { b: 'Kiểm tra' }, ' – Telegram nhận một tin thử là xong.']
]
},
{
id: 'claude', name: 'Claude', required: false, secrets: ['claude_key'], target: 'claude', paid: true, icon: 'spark4',
hint: 'AI viết dài, có phí theo lượt',
link: { href: LINKS.anthropicKeys, label: 'Lấy khoá ở Anthropic' },
quick: ['Nạp tín dụng ở mục Billing (trả trước).', ['Bấm ', { b: 'Create Key' }, ', chép khoá sk-ant…'], 'Dán vào ô trên, bấm Lưu và kiểm tra.'],
use: 'Tuỳ chọn: viết dài, phân tích kỹ khi chọn "Claude API" trong Bộ chọn AI',
cost: { label: 'Có phí', detail: 'tính theo lượt dùng (token)' },
steps: [
['Đây là API trả tiền theo lượt, ', { b: 'khác gói Claude Pro/Max' }, ' – gói chat không có API. Không cần cũng được: app đã có Gemini miễn phí và nút "Chuyển sang Claude" dùng gói chat.'],
['Mở ', { a: LINKS.anthropicKeys, t: 'console.anthropic.com/settings/keys' }, ' → đăng nhập → nạp tín dụng ở ', { a: LINKS.anthropicBilling, t: 'Billing' }, ' (trả trước).'],
['Bấm ', { b: 'Create Key' }, ' → chép khoá (sk-ant-…) → dán vào ô bên dưới → Lưu → Kiểm tra.'],
'Bật "Cho phép Claude API" ở mục Bộ chọn AI. Trần ngân sách tháng ở mục Ngân sách chặn chi vượt mức.'
]
},
{
id: 'vbee', video: true, name: 'Giọng đọc Vbee', required: false, svc: 'vbee', paid: true, icon: 'mic',
hint: 'Giọng đọc tiếng Việt cho video',
link: { href: LINKS.vbee, label: 'Mở Vbee' },
quick: [['Mục API của Vbee: chép ', { b: 'App ID' }, ' và ', { b: 'Token' }, '.'], 'Dán vào hai ô trên.', ['Bấm ', { b: 'Lưu và kiểm tra' }, ' – khoá lưu trên máy chủ.']],
use: 'Giọng đọc tiếng Việt cho video (khoá lưu trên máy chủ của anh/chị, không về trình duyệt)',
cost: { label: 'Có phí', detail: 'theo gói Vbee anh/chị đã mua' },
steps: [
['Đăng nhập ', { a: LINKS.vbee, t: 'vbee.vn' }, ' → mục API/Nhà phát triển → tạo ứng dụng → chép ', { b: 'App ID' }, ' và ', { b: 'Token' }, '.'],
'Dán App ID và Token vào hai ô bên dưới → Lưu và kiểm tra. Khoá lưu trên máy chủ (Google Apps Script của anh/chị), không bao giờ trả về trình duyệt.',
'Vbee chưa có điểm kiểm khoá miễn phí: máy chủ kiểm định dạng khoá; lần đọc thử đầu tiên ở Ý tưởng & Video AI cho biết khoá dùng được.'
]
},
{
id: 'map', video: true, name: 'Bản đồ (nền + tìm địa chỉ)', required: false, local: 'map', saleOnly: true, icon: 'map',
hint: 'Nền bản đồ, tìm địa chỉ cho video',
link: { href: LINKS.geoapify, label: 'Lấy khoá miễn phí' },
quick: [['Mở ', { b: 'myprojects.geoapify.com' }, ', đăng ký miễn phí (không cần thẻ).'], ['Bấm ', { b: 'Create a new project' }, ', đặt tên, chép ', { b: 'API key' }, '.'],
'Bật máy dựng, dán khoá vào ô trên.', ['Bấm ', { b: 'Lưu và kiểm tra' }, ' – app thử 1 ô bản đồ và 1 lượt tìm địa chỉ.']],
use: 'Ảnh nền bản đồ và tìm toạ độ địa điểm khi dựng video bản đồ. Khoá lưu ở máy dựng, không lên máy chủ. Video ghi nguồn "Powered by Geoapify · © OpenMapTiles · © OpenStreetMap contributors"',
cost: { label: 'Miễn phí', detail: MAP_COST },
steps: [
['Mở ', { a: LINKS.geoapify, t: 'myprojects.geoapify.com' }, ' → đăng ký bằng email hoặc tài khoản Google. Gói Free không cần thẻ thanh toán.'],
['Bấm ', { b: 'Create a new project' }, ' → đặt tên (vd "Video bản đồ") → trang dự án hiện ', { b: 'API key' }, ' → bấm chép.'],
'Bật máy dựng (BDS Studio) trên máy tính, dán khoá vào ô bên dưới.',
['Bấm ', { b: 'Lưu và kiểm tra' }, ': máy dựng thử 1 ô nền bản đồ và 1 lượt tìm địa chỉ. Đèn xanh là dựng được video bản đồ.'],
['Gói Free: 3.000 credit/ngày (1 ô nền = 0,25 credit, 1 lượt tìm địa chỉ = 1 credit) – đủ vài chục video/ngày; máy dựng lưu đệm ô nền nên dựng lại cùng khu vực gần như không tốn. Xem ', { a: LINKS.geoapifyPricing, t: 'bảng giá Geoapify' }, '.']
]
},
{
id: 'flow', video: true, name: 'Video nhân vật (Flow)', required: false, linkOnly: true, icon: 'camera',
hint: 'Quay cảnh nhân vật bằng Veo',
link: { href: LINKS.flow, label: 'Mở Flow' },
quick: ['Mở Flow bằng tài khoản có Google AI Pro.', 'App soạn lời nhắn cảnh, dán vào Flow.', 'Mỗi clip trừ tín dụng của gói.'],
use: 'Quay cảnh nhân vật đi trong căn hộ bằng Veo trên Flow của Google',
cost: { label: 'Miễn phí', detail: 'dùng tín dụng AI của gói Google AI Pro – không có khoá' },
steps: [
['Mở ', { a: LINKS.flow, t: 'labs.google/fx/tools/flow' }, ' bằng tài khoản Google có gói Google AI Pro.'],
'Không cần khoá: app soạn lời nhắn cảnh quay, anh/chị dán vào Flow rồi tải clip về.',
'Mỗi clip trừ tín dụng của gói; số tín dụng còn lại xem ngay trong Flow.'
]
}
];
const _o1 = '#/content/ideas?tab=video';
const _o2 = ['Mở ', { b: 'Ý tưởng & Video AI › Video AI' }, ' → phần Cài đặt.'];
ITEMS.push(
{
id: 'veo_api', video: true, name: 'Veo API', required: false, ext: 'videoai', provider: 'veo_api', module: 'ideas', goto: _o1, paid: true, icon: 'film',
hint: 'Tạo clip tự động bằng Veo',
link: { href: LINKS.veoPrice, label: 'Xem giá Veo' },
quick: [_o2, ['Veo dùng chung ', { b: 'khoá Gemini' }, ' (đã bật thanh toán).'], 'Bật Veo, nhập bảng giá, tạo clip thử.'],
use: 'Tạo clip Video AI tự động qua máy chủ bằng Veo (Gemini API trả phí)',
cost: { label: 'Có phí', detail: 'tính theo giây video theo bảng giá của Google' },
steps: [
_o2,
['Veo dùng chung ', { b: 'khoá Gemini' }, ' (dòng Khoá AI Gemini) – tài khoản cần bật thanh toán.'],
['Bật nhà cung cấp, nhập ', { b: 'bảng giá' }, ' theo trang giá của hãng rồi tạo clip thử.']
]
},
{
id: 'kling', video: true, name: 'Kling', required: false, ext: 'videoai', provider: 'kling', module: 'ideas', goto: _o1, paid: true, icon: 'film',
hint: 'Tạo clip bằng tài khoản Kling',
quick: [_o2, ['Nhập ', { b: 'Access key' }, ' và ', { b: 'Secret key' }, ' của Kling.'], ['Tích ', { b: 'Đã đối chiếu' }, ', bật, nhập bảng giá.']],
use: 'Tạo clip Video AI qua máy chủ bằng tài khoản Kling của anh/chị (chưa xác minh tài liệu API)',
cost: { label: 'Có phí', detail: 'theo gói của Kling – xem trong tài khoản nhà phát triển' },
steps: [
_o2,
['Nhập ', { b: 'Access key' }, ' và ', { b: 'Secret key' }, ' Kling, tích ', { b: 'Đã đối chiếu' }, ' tài liệu API.'],
['Bật nhà cung cấp, nhập ', { b: 'bảng giá' }, ' theo trang giá của hãng rồi tạo clip thử.']
]
},
{
id: 'runway', video: true, name: 'Runway', required: false, ext: 'videoai', provider: 'runway', module: 'ideas', goto: _o1, paid: true, icon: 'film',
hint: 'Tạo clip bằng tài khoản Runway',
link: { href: LINKS.runwayPrice, label: 'Xem giá Runway' },
quick: [_o2, ['Nhập ', { b: 'khoá Runway' }, ' (trang nhà phát triển Runway).'], 'Bật Runway, nhập bảng giá, tạo clip thử.'],
use: 'Tạo clip Video AI qua máy chủ bằng khoá Runway của anh/chị',
cost: { label: 'Có phí', detail: 'tính theo tín dụng Runway theo bảng giá của hãng' },
steps: [
_o2,
['Nhập ', { b: 'khoá Runway' }, ' (tạo ở trang nhà phát triển Runway) → ', { b: 'Lưu' }, '.'],
['Bật nhà cung cấp, nhập ', { b: 'bảng giá' }, ' theo trang giá của hãng rồi tạo clip thử.']
]
}
);
const _o5 = (st, id) => { const _oh = st && st.ext && st.ext.videoai; return (_oh && _oh[id]) || null; };
const _og = (st, id) => { const _oh = st && st.svc; return (_oh && _oh[id]) || null; };
export const REQUIRED_IDS = ITEMS.filter((x) => x.required).map((x) => x.id);
const has = (st, keys) => (keys || []).every((_o7) => !!(st.secrets && st.secrets[_o7]));
export function isRequired(item, st = {}) { return !!item.required && !(st.solo && item.optionalSolo); }
export function lightFor(item, st = {}) {
const last = (st.last || {})[item.target] || null;
const local = st.local || {};
if (item.id === 'server') {
if (st.mode === 'demo') return { tone: 'bad', text: 'Đang xem thử – chưa có URL máy chủ' };
if (st.serverOk === false) return { tone: 'bad', text: st.serverMsg || 'Chưa kết nối được máy chủ' };
if (st.serverOk === true && st.serverOld) return { tone: 'bad', text: serverOldText(st.serverOld) };
if (st.serverOk === true) return { tone: 'ok', text: 'Đã kết nối' + (st.version ? ' – phiên bản ' + st.version : '') };
return { tone: 'warn', text: 'Chưa kiểm tra' };
}
if (item.secrets) {
if (!has(st, item.secrets)) {
const missing = item.id === 'telegram' && st.secrets && st.secrets.telegram_token ? 'Thiếu chat id' : 'Chưa nhập';
if (missing === 'Chưa nhập' && st.solo && item.optionalSolo) return { tone: 'warn', text: item.optionalSolo, optional: true };
return isRequired(item, st) ? { tone: 'bad', text: missing + ' – bắt buộc' } : { tone: 'warn', text: missing + ' – không bắt buộc' };
}
if (last && last.ok) return { tone: 'ok', text: 'Kiểm tra đạt' };
if (last && last.ok === false) return { tone: isRequired(item, st) ? 'bad' : 'warn', text: last.message || 'Kiểm tra chưa đạt' };
return { tone: 'warn', text: 'Đã lưu – chưa kiểm tra' };
}
if (item.local === 'map') {
const _o9 = local.map;
if (_o9 && _o9.ok) return { tone: 'ok', text: 'Nền bản đồ và tìm địa chỉ chạy' };
if (_o9 && _o9.key && _o9.ok === false) return { tone: 'bad', text: _o9.msg || 'Kiểm tra chưa đạt' };
if (_o9 && _o9.key) return { tone: 'warn', text: 'Đã lưu khoá – chưa kiểm tra' };
if (_o9 && _o9.engine === false) return { tone: 'warn', text: 'Cần bật máy dựng để lưu khoá' };
return { tone: 'bad', text: 'Chưa có khoá – video bản đồ đang bị chặn' };
}
if (item.svc) {
if (st.svcOld) return { tone: 'warn', text: 'Cần cập nhật máy chủ một lần (Cài đặt › Phiên bản) – không bắt buộc' };
const _oh = _og(st, item.svc); const last = (st.last || {})['svc_' + item.svc] || null;
if (!_oh || !_oh.connected) return { tone: 'warn', text: 'Chưa nhập – không bắt buộc' };
if (last && last.ok === false) return { tone: 'warn', text: last.message || 'Kiểm tra chưa đạt' };
return { tone: 'ok', text: 'Đã lưu khoá trên máy chủ' };
}
if (item.ext === 'videoai') {
const _oa = _o5(st, item.provider);
if (_oa && _oa.enabled && _oa.key) return { tone: 'ok', text: 'Đang bật trong Video AI, đã có khoá' };
if (_oa && _oa.enabled) return { tone: 'warn', text: 'Đang bật nhưng chưa có khoá – nhập ở Video AI' };
return { tone: 'warn', text: _oa && _oa.key ? 'Đã có khoá, đang tắt – bật ở Video AI' : 'Thiết lập ở Ý tưởng & Video AI › Video AI' };
}
return { tone: 'warn', text: 'Không cần khoá – mở bằng tài khoản Google' };
}
export function serverOldText(o = {}) {
if (o.legacy) return 'Máy chủ đang chạy bản cũ, chưa tự cập nhật được – cần dán mã máy chủ mới một lần';
return 'Máy chủ đang chạy bản cũ' + (o.server ? ' v' + o.server : '') + (o.target ? ' – app cần v' + o.target : '') + (o.missing && o.missing.length ? ' (thiếu ' + o.missing.length + ' chức năng)' : '');
}
export function canDisconnect(item, st = {}, { owner = true } = {}) {
if (item.linkOnly || item.ext) return false;
if (item.svc) { const _oh = _og(st, item.svc); return !!(_oh && _oh.connected); }
if (item.id === 'server') return !!owner;
if (item.secrets) return item.secrets.some((_o7) => !!(st.secrets && st.secrets[_o7]));
const local = st.local || {};
if (item.local === 'map') return !!(local.map && local.map.key);
return false;
}
export function needsFix(item, st = {}) {
const L = lightFor(item, st);
if (L.tone === 'bad') return true;
const last = (st.last || {})[item.target];
if (last && last.ok === false) return true;
return false;
}
export function forgetLocal(key, storage = globalThis.localStorage) {
const _o4 = loadLocal(storage); delete _o4[key];
try { storage.setItem(_o0, JSON.stringify(_o4)); } catch { }
return _o4;
}
export function pillFor(item, st = {}) {
const local = st.local || {};
const OK = { kind: 'ok', text: 'Đã kết nối' }, OFF = { kind: 'off', text: 'Chưa kết nối' }, ERR = { kind: 'err', text: 'Lỗi' }, CHECK = { kind: 'check', text: 'Chưa kiểm tra' };
if (item.linkOnly) return { kind: 'link', text: 'Không cần khoá' };
if (item.id === 'server') {
if (st.mode === 'demo') return OFF;
if (st.serverOk === false || (st.serverOk === true && st.serverOld)) return ERR;
if (st.serverOk === true) return OK;
return CHECK;
}
if (item.secrets) {
if (!has(st, item.secrets)) return st.solo && item.optionalSolo && !(st.secrets && item.secrets.some((_o7) => st.secrets[_o7])) ? { kind: 'off', text: 'Tuỳ chọn' } : OFF;
const last = (st.last || {})[item.target] || null;
if (last && last.ok) return OK;
if (last && last.ok === false) return ERR;
return CHECK;
}
if (item.svc) { const _oh = _og(st, item.svc); const last = (st.last || {})['svc_' + item.svc]; return _oh && _oh.connected ? (last && last.ok === false ? ERR : OK) : OFF; }
if (item.ext === 'videoai') { const _oa = _o5(st, item.provider); return _oa && _oa.enabled && _oa.key ? OK : _oa && _oa.enabled ? CHECK : OFF; }
if (item.local === 'map') { const _o9 = local.map; return _o9 && _o9.ok ? OK : _o9 && _o9.key && _o9.ok === false ? ERR : _o9 && _o9.key ? CHECK : OFF; }
const _o8 = local[item.local];
return _o8 && _o8.ok ? OK : OFF;
}
export const CONN_HASH = '#/settings/connection';
export function connHash(id) { return ITEMS.some((x) => x.id === id) ? CONN_HASH + '/' + id : CONN_HASH; }
export function routeItem(route) {
if (!route) return '';
const _oc = route.query && typeof route.query.get === 'function' ? route.query.get('c') : '';
const want = String(route.sub || _oc || '').split('/')[0].trim().toLowerCase();
return ITEMS.some((x) => x.id === want) ? want : '';
}
export function requiredSummary(items, st = {}) {
const _od = items.filter((it) => isRequired(it, st));
const miss = _od.filter((it) => lightFor(it, st).tone === 'bad');
return { total: _od.length, done: _od.length - miss.length, miss };
}
export function missingRequired(st = {}) {
return ITEMS.filter((it) => isRequired(it, st) && lightFor(it, st).tone === 'bad');
}
export function usd(n, d = 2) { return (Number(n) || 0).toFixed(d).replace('.', ',') + ' USD'; }
export function intVi(n) { return String(Math.round(Number(n) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
export function claudeCostText(prices) {
const _oa = (prices && prices.claude_api) || FALLBACK_PRICES.claude_api;
const _ob = (2000 * _oa.in + 1000 * _oa.out) / 1e6;
return '≈ ' + usd(_ob, 3) + '/lượt soạn tin (' + String(_oa.in).replace('.', ',') + ' USD/1 triệu token vào, ' + String(_oa.out).replace('.', ',') + ' USD/1 triệu token ra)';
}
function _of(_oh, legacyCalls) {
if (_oh && typeof _oh === 'object') return { usd: Number(_oh.usd) || 0, calls: Number(_oh.calls) || 0, tokens_in: Number(_oh.tokens_in) || 0, tokens_out: Number(_oh.tokens_out) || 0 };
return { usd: Number(_oh) || 0, calls: Number(legacyCalls) || 0, tokens_in: 0, tokens_out: 0 };
}
const PROVIDER_LABEL = { gemini: 'Gemini', claude_api: 'Claude API', handoff: 'Chuyển sang chat Claude/Gemini' };
export function budgetRows(d = {}) {
const _o3 = d.by_provider || {}; const calls = d.calls || {};
const _o6 = d.gemini_free !== false;
const _oe = [];
const g = _of(_o3.gemini, calls.gemini);
_oe.push({ id: 'gemini', label: PROVIDER_LABEL.gemini, ...g, usdText: _o6 && !g.usd ? '0 USD (hạn mức miễn phí)' : usd(g.usd) });
const c = _of(_o3.claude_api, calls.claude_api);
_oe.push({ id: 'claude_api', label: PROVIDER_LABEL.claude_api, ...c, usdText: usd(c.usd) });
for (const _o7 of Object.keys(_o3)) {
if (_o7 === 'gemini' || _o7 === 'claude_api') continue;
const s = _of(_o3[_o7], calls[_o7]);
_oe.push({ id: _o7, label: PROVIDER_LABEL[_o7] || providerName(_o7), ...s, usdText: usd(s.usd) });
}
_oe.push({ id: 'handoff', label: PROVIDER_LABEL.handoff, calls: null, tokens_in: null, tokens_out: null, usd: 0, usdText: '0 USD' });
return _oe;
}
export function budgetTone(pct, warnPct = 80) {
if (pct >= 100) return 'bad';
if (pct >= warnPct) return 'warn';
return 'ok';
}
const _o0 = 'bds:conn:local';
export function loadLocal(storage = globalThis.localStorage) {
try { return JSON.parse(storage.getItem(_o0) || '{}') || {}; } catch { return {}; }
}
export function saveLocal(key, value, storage = globalThis.localStorage) {
const _o4 = loadLocal(storage); _o4[key] = { ...value, at: Date.now() };
try { storage.setItem(_o0, JSON.stringify(_o4)); } catch { }
return _o4;
}
export default { ITEMS, LINKS, VIDEO_ITEM_IDS, MAP_COST, MAP_PROVIDERS, itemVisibleFor, lightFor, pillFor, connHash, routeItem, missingRequired, serverOldText, canDisconnect, needsFix, forgetLocal, usd, budgetRows, budgetTone, claudeCostText, loadLocal, saveLocal };

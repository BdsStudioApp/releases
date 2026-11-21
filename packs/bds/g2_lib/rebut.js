import { norm } from './reply_kb.js';
import { withRulesJson } from '../../../shared/ai_rules.js';
const has = (_o5, k) => _o5.includes(' ' + k + ' ');
const join = (a) => (a.length > 1 ? a.slice(0, -1).join(', ') + ' và ' + a[a.length - 1] : a[0] || '');
export const COMPLAINTS = [
{ id: 'xa', label: 'Chê xa trung tâm', kw: ['xa qua', 'xa trung tam', 'xa the', 'xa vay', 'xa vayy', 'xa xoi', 'xa lam', 'hoi xa', 'qua xa', 'di lai xa', 'tac duong', 'ket xe', 'di lam xa', 'xa nhi'] },
{ id: 'dat', label: 'Chê đắt', kw: ['dat qua', 'mac qua', 'gia cao', 'cao qua', 'chat qua', 'chem gia', 'thoi gia', 'gia ao', 'ngao gia', 'qua dat', 'hoi dat', 'khong dang tien', 'dat so voi'], raw: /đắt|mắc quá|chát/ },
{ id: 'que', label: 'Chê vùng quê / tỉnh lẻ', kw: ['vung que', 'nha que', 'o que', 'tinh le', 'ngoai thanh', 'xa xo', 'heo hut', 'vang ve', 'dong ruong', 'ruong lua', 'thon que', 'que lam', 'khong phai ha noi', 'ngoai ha noi'] },
{ id: 'cham', label: 'Lo chậm tiến độ', kw: ['cham tien do', 'cham ban giao', 'cham qua', 'tre tien do', 'lui ban giao', 'treo', 'bo hoang', 'xay cham', 'khong xay', 'dap chieu'] },
{ id: 'so', label: 'Lo pháp lý / chưa có sổ', kw: ['chua co so', 'khong co so', 'chua so', 'so do chua', 'so hong chua', 'phap ly chua', 'phap ly kem', 'phap ly yeu', 'phap ly mo', 'chua du dieu kien', '50 nam', 'khong lau dai', 'chua co giay phep'] },
{ id: 'ngap', label: 'Lo ngập', kw: ['ngap', 'ngap nuoc', 'ngap lut', 'lut', 'vung trung', 'mua la ngap', 'nuoc len'] },
{ id: 'thanh_khoan', label: 'Lo khó bán lại / thanh khoản', kw: ['thanh khoan', 'kho ban', 'kho ban lai', 'khong ban duoc', 'ban lai kho', 'kho cho thue', 'kho thue', 'it nguoi o', 'khong ai o', 'thanh pho ma', 'do thi ma', 'om hang', 'mac ket'] },
{ id: 'cdt', label: 'Nghi ngờ chủ đầu tư', kw: ['cdt kem', 'chu dau tu kem', 'chu dau tu lua', 'cdt lua', 'lua dao', 'khong uy tin', 'mat uy tin', 'chu dau tu yeu', 'cdt yeu', 'nghe noi cdt', 'chu dau tu nao'] },
{ id: 'phi', label: 'Chê phí cao', kw: ['phi quan ly cao', 'phi cao', 'phi dich vu cao', 'phi gui xe', 'phi dat', 'nhieu phi', 'phi qua', 'phi quan ly dat'] },
{ id: 'dong', label: 'Chê đông đúc / mật độ cao', kw: ['dong qua', 'chat choi', 'mat do cao', 'nhieu toa', 'dong duc', 'o dan', 'dong nguoi', 'thang may cho'] },
];
export function detectComplaints(text) {
const _o5 = norm(text), raw = String(text || '').toLowerCase();
if (!_o5.trim()) return [];
const _o7 = [];
for (const _o3 of COMPLAINTS) {
const hits = _o3.kw.filter((k) => has(_o5, k));
if (_o3.raw && _o3.raw.test(raw)) hits.push('đắt');
if (hits.length) _o7.push({ id: _o3.id, label: _o3.label, hits });
}
const _o1 = /\b(bao nhieu|may km|bao xa|bao lau|may phut|co xa|xa khong|xa ko)\b/.test(_o5);
return _o7.filter((_o3) => !(_o3.id === 'ngap' && /uu dai|khuyen mai/.test(_o5)) && !(_o3.id === 'xa' && _o1 && _o3.hits.every((k) => k === 'xa trung tam')));
}
export function rebuttals(id, f) {
const _o6 = (f && f.name) || 'dự án';
const where = f && (f.loc || f.area);
const price = f && f.price;
const _o8 = (f && f.policies) || [];
const dev = f && f.dev;
const ho = f && f.handover;
const _o0 = (f && f.amenities) || [];
const R = {
xa: [
{ title: 'Đổi "xa" thành thời gian thực tế', say: 'Dạ em hiểu anh/chị ngại đi lại. Mình tính theo phút chứ không theo km ạ: anh/chị cho em địa chỉ chỗ làm, em đo đường đi giờ cao điểm từ ' + _o6 + (where ? ' (' + where + ')' : '') + ' để mình xem có hợp không.', prep: 'Đo bằng Google Maps giờ cao điểm (7h30, 17h30), chụp màn hình gửi khách.' },
{ title: 'Hạ tầng kết nối có văn bản', say: 'Ngoài đường hiện tại, khu này còn các tuyến đường/cầu đang làm theo kế hoạch của thành phố – em gửi anh/chị văn bản và tiến độ chính thức để mình tự đánh giá, không nghe hứa miệng ạ.', prep: 'Chỉ nêu tuyến có quyết định đầu tư / tiến độ thi công chính thức (cổng thông tin tỉnh/thành, báo chính thống); ghi số văn bản.' },
{ title: 'Đánh đổi: không gian sống và giá', say: 'Ở gần trung tâm thì mỗi m² đắt hơn và ít không gian xanh hơn. ' + _o6 + (_o0.length ? ' có ' + join(_o0.slice(0, 3)) : ' có tiện ích nội khu') + (price ? ', giá tham khảo ' + price : '') + ' – anh/chị cân giữa thời gian đi lại và chất lượng sống hằng ngày giúp em ạ.', prep: 'Chuẩn bị giá/m² 1–2 dự án gần trung tâm cùng phân khúc (nguồn: bảng giá chủ đầu tư/sàn, ghi ngày).' },
],
dat: [
{ title: 'Hỏi lại "đắt so với gì"', say: 'Dạ anh/chị thấy đắt so với ngân sách hay so với dự án nào ạ? Em đặt ' + _o6 + (price ? ' (' + price + ')' : '') + ' cạnh dự án đó theo cùng tiêu chí giá/m² thông thuỷ, phí quản lý, thời điểm bàn giao để so cho công bằng.', prep: 'Bảng so sánh 2–3 dự án cùng khu vực, giá có nguồn và ngày lấy giá.' },
{ title: 'Tổng tiền thực trả, không chỉ giá niêm yết', say: _o8.length ? 'Giá niêm yết chưa phải số mình trả ạ: ' + _o6 + ' có ' + join(_o8.slice(0, 2)) + '. Em tính tổng tiền thực trả theo đúng căn anh/chị thích để mình xem.' : 'Giá niêm yết chưa phải số mình trả ạ – em tính tổng tiền thực trả sau chiết khấu, theo phương án thanh toán phù hợp với anh/chị.', prep: 'Kiểm chính sách đang áp dụng với chủ đầu tư trước khi gửi số.' },
{ title: 'Giảm áp lực dòng tiền', say: 'Nếu tổng tiền vượt dự tính, mình xem căn diện tích nhỏ hơn hoặc lịch thanh toán giãn' + (_o8.some((p) => /vay|lãi/i.test(p)) ? ', hoặc phương án vay có hỗ trợ lãi' : '') + ' – em làm bảng dòng tiền từng tháng để anh/chị thấy rõ.', prep: 'Bảng dòng tiền gồm cả giai đoạn sau khi hết hỗ trợ lãi (lãi thả nổi).' },
],
que: [
{ title: 'Nói đúng vị trí, không né', say: 'Dạ đúng là ' + _o6 + (where ? ' nằm tại ' + where : ' không ở nội đô') + ' ạ. Em không nói quá – em gửi anh/chị bản đồ và ảnh thực tế quanh dự án hiện nay để mình tự nhìn.', prep: 'Ảnh/video thực tế gần đây (ghi ngày chụp), bản đồ vệ tinh.' },
{ title: 'Đô thị đồng bộ trong khu', say: 'Cái khác ở đây là ' + (_o0.length ? 'tiện ích nằm ngay trong khu: ' + join(_o0.slice(0, 3)) : 'tiện ích nằm ngay trong khu đô thị (trường, chợ/siêu thị, công viên)') + ', nên sinh hoạt hằng ngày không phụ thuộc vào xung quanh ạ.', prep: 'Danh sách tiện ích ĐÃ vận hành (không lẫn tiện ích mới trên giấy), kèm ảnh.' },
{ title: 'Ai đang ở và ai đang mua', say: 'Anh/chị có thể ghé vào cuối tuần để xem cư dân, dịch vụ đang hoạt động – em dẫn đi để mình cảm nhận thật, không cần quyết gì ạ.', prep: 'Hẹn khung giờ đông (chiều cuối tuần). Không đưa số dân/tỷ lệ lấp đầy khi không có nguồn.' },
],
cham: [
{ title: 'Tiến độ bằng ảnh có ngày', say: 'Dạ lo chậm là đúng ạ. Em gửi ảnh/video công trường mới nhất có ngày chụp' + (ho ? ', đối chiếu với mốc bàn giao dự kiến ' + ho : '') + ' để anh/chị tự theo dõi.', prep: 'Ảnh công trường chụp trong tháng; mốc bàn giao lấy từ hợp đồng mẫu/chủ đầu tư.' },
{ title: 'Lịch sử bàn giao của chủ đầu tư', say: (dev ? dev : 'Chủ đầu tư') + ' đã bàn giao các dự án trước – em gửi danh sách kèm thời gian bàn giao thực tế so với hợp đồng để anh/chị đánh giá.', prep: 'Danh sách dự án đã bàn giao + nguồn báo chính thống. Có dự án chậm thì nói thật.' },
{ title: 'Điều khoản bảo vệ người mua', say: 'Trong hợp đồng có điều khoản phạt chủ đầu tư nếu chậm bàn giao và bảo lãnh ngân hàng cho tiền mình đã đóng – em chỉ đúng điều khoản trong hợp đồng mẫu để anh/chị đọc.', prep: 'Mở hợp đồng mua bán mẫu, đánh dấu điều phạt chậm bàn giao + thư bảo lãnh (Luật Kinh doanh BĐS 2023 yêu cầu bảo lãnh với nhà hình thành trong tương lai).' },
],
so: [
{ title: 'Nói rõ giai đoạn pháp lý', say: f && f.legal ? 'Dạ pháp lý ' + _o6 + ' hiện: ' + f.legal + '. Em gửi bản chụp giấy tờ để anh/chị kiểm.' : 'Dạ nhà mua khi đang xây thì sổ được cấp sau khi bàn giao và hoàn tất thủ tục ạ. Em gửi anh/chị các giấy tờ dự án đang có để mình kiểm từng loại.', prep: 'Chỉ gửi giấy tờ có số hiệu: chủ trương đầu tư, giấy phép xây dựng, văn bản đủ điều kiện bán nhà hình thành trong tương lai, bảo lãnh ngân hàng.' },
{ title: 'Tiền đóng được bảo lãnh', say: 'Với nhà hình thành trong tương lai, tiền anh/chị đóng trước khi nhận nhà phải có ngân hàng bảo lãnh – em gửi thư bảo lãnh để mình yên tâm hơn.', prep: 'Luật Kinh doanh BĐS 2023 (bảo lãnh nghĩa vụ tài chính của chủ đầu tư); kiểm thư bảo lãnh thật của dự án.' },
{ title: 'Kiểm độc lập', say: 'Anh/chị cứ nhờ luật sư hoặc công chứng viên xem giấy tờ trước khi ký, em hỗ trợ gửi đủ bản chụp ạ.', prep: 'Không trấn an chung chung; chưa có văn bản nào thì nói "chưa có".' },
],
ngap: [
{ title: 'Hỏi rõ lo ngập ở đâu', say: 'Dạ anh/chị lo ngập trong khu hay đường dẫn vào ạ? Em gửi ảnh/clip thực tế sau các trận mưa lớn gần đây để mình xem đúng tình hình, không nói chung chung.', prep: 'Tìm ảnh/clip có ngày (mưa lớn gần nhất), nguồn rõ; có ngập thì nói thật.' },
{ title: 'Cao độ nền và thoát nước', say: 'Em hỏi chủ đầu tư thông số cao độ nền, hệ thống thoát nước, hồ điều hoà của ' + _o6 + ' rồi gửi anh/chị bằng văn bản ạ.', prep: 'Thông số lấy từ chủ đầu tư/hồ sơ thiết kế, không tự nêu số.' },
{ title: 'Chọn căn ít ảnh hưởng', say: 'Nếu vẫn lo, mình ưu tiên căn tầng cao/toà gần trục chính, em lọc giúp anh/chị.', prep: 'Giỏ hàng còn trống theo tầng/toà.' },
],
thanh_khoan: [
{ title: 'Nhu cầu thuê/mua thực tế', say: 'Dạ thanh khoản là câu hỏi đúng ạ. Em gửi anh/chị số tin rao thuê/bán và mức giá giao dịch gần đây trong khu để mình tự đánh giá, em không hứa tăng giá.', prep: 'Số liệu từ trang rao vặt lớn/sàn (ghi ngày, đường dẫn); giá giao dịch có nguồn.' },
{ title: 'Chọn căn dễ bán lại', say: 'Căn dễ cho thuê/bán lại thường là loại diện tích phổ biến, hướng/view đẹp, gần tiện ích – em lọc những căn như vậy' + (f && f.typeLine ? ' trong các loại ' + f.typeLine : '') + '.', prep: 'Dựa trên giỏ hàng thật; nói rõ đây là kinh nghiệm, không phải cam kết.' },
{ title: 'Mua để ở hay đầu tư', say: 'Nếu mua để ở thì thanh khoản là phương án dự phòng; nếu đầu tư, em làm bảng dòng tiền cả kịch bản cho thuê chậm để anh/chị thấy rủi ro.', prep: 'Bảng dòng tiền có kịch bản xấu; không nêu lợi suất khi không có nguồn.' },
],
cdt: [
{ title: 'Dữ kiện, không khen chung', say: (dev ? dev : 'Chủ đầu tư') + ' – em gửi danh sách dự án đã bàn giao, thời gian bàn giao thực tế và đường dẫn báo chí liên quan để anh/chị tự đánh giá ạ.', prep: 'Nguồn báo chính thống, cả tin tốt lẫn tin xấu.' },
{ title: 'Đi xem dự án đã bàn giao', say: 'Anh/chị có thể ghé một dự án ' + (dev ? dev : 'chủ đầu tư') + ' đã bàn giao để xem chất lượng thật, em dẫn đi ạ.', prep: 'Chọn dự án đã có cư dân, xem cả khu chung và dịch vụ vận hành.' },
{ title: 'Bảo vệ bằng hợp đồng', say: 'Dù chủ đầu tư nào, quyền lợi của mình nằm ở hợp đồng và bảo lãnh ngân hàng – em chỉ các điều khoản quan trọng để anh/chị đọc kỹ trước.', prep: 'Hợp đồng mẫu + thư bảo lãnh.' },
],
phi: [
{ title: 'Phí đổi lấy dịch vụ gì', say: 'Dạ em gửi bảng phí quản lý kèm dịch vụ đi kèm (bảo vệ, vệ sinh, tiện ích chung…) để anh/chị so với mức phí ở 1–2 khu tương đương ạ.', prep: 'Mức phí từ chủ đầu tư/ban quản lý; mức phí khu khác có nguồn.' },
{ title: 'Tính ra tiền mỗi tháng', say: 'Em quy ra số tiền mỗi tháng theo đúng diện tích căn anh/chị quan tâm, để mình thấy con số cụ thể.', prep: 'Phí x m² thông thuỷ, ghi rõ đơn giá.' },
],
dong: [
{ title: 'Mật độ trong toà anh/chị chọn', say: 'Dạ em gửi số căn/tầng, số thang máy của toà anh/chị quan tâm để mình xem có đông không ạ.', prep: 'Mặt bằng tầng điển hình từ chủ đầu tư.' },
{ title: 'Chọn vị trí yên tĩnh hơn', say: 'Mình có thể chọn toà/tầng xa khu thương mại, ít căn/tầng – em lọc trong giỏ hàng giúp anh/chị.', prep: 'Giỏ hàng thật theo toà/tầng.' },
],
};
return (R[id] || []).slice(0, 3);
}
export function rebutPrompt(text, { factsBlock = '', complaints = [], channel = 'comment' } = {}) {
return withRulesJson([
'Bạn là chuyên viên tư vấn bất động sản tại Việt Nam, trung thực, khéo léo, xưng "em", gọi "anh/chị".',
'Khách vừa ' + (channel === 'comment' ? 'bình luận công khai' : 'nhắn') + ' chê dự án. Với TỪNG lời chê, đưa 2–3 hướng phản biện khéo (không cãi, không chê đối thủ):',
'mỗi hướng gồm "y" (ý chính, dưới 10 chữ), "cau" (câu nói mẫu dưới 60 chữ, ghi nhận lo lắng trước rồi mới phản biện), "chuan_bi" (cần chuẩn bị số liệu/giấy tờ gì và lấy ở nguồn nào).',
'Luật: chỉ dùng số liệu có trong "Dữ liệu dự án"; số liệu khác (khoảng cách, giá khu lân cận, quy hoạch, ngập…) KHÔNG tự nêu số – ghi [cần kiểm tra: …] và nói nguồn cần lấy. Không hứa lợi nhuận, không nói "chắc chắn tăng giá", không tạo khan hiếm giả. Không dùng chữ "xin lỗi".',
factsBlock,
complaints.length ? 'App đoán lời chê: ' + complaints.map((_o3) => _o3.label).join(', ') + ' (có thể còn lời chê khác).' : '',
'Câu khách viết: """' + String(text || '').replace(/\b0\d{9}\b/g, '[số điện thoại]').slice(0, 1500) + '"""',
'Trả về JSON: {"items":[{"che":"…","huong":[{"y":"…","cau":"…","chuan_bi":"…"}]}]}',
].filter(Boolean).join('\n'));
}
export function parseRebut(t) {
const _o9 = String(t || '');
for (const _o2 of [_o9, (_o9.match(/```(?:json)?\s*([\s\S]*?)```/) || [])[1], _o9.slice(_o9.indexOf('{'), _o9.lastIndexOf('}') + 1)]) {
if (!_o2) continue;
try {
const _o4 = JSON.parse(_o2);
const items = (_o4 && Array.isArray(_o4.items) ? _o4.items : []).map((it) => ({
label: String(it.che || '').slice(0, 80),
ways: (Array.isArray(it.huong) ? it.huong : []).slice(0, 3).map((w) => ({ title: String(w.y || '').slice(0, 80), say: String(w.cau || '').slice(0, 600), prep: String(w.chuan_bi || '').slice(0, 300) })).filter((w) => w.say),
})).filter((it) => it.ways.length);
if (items.length) return items;
} catch { }
}
return null;
}

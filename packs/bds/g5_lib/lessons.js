export const LESSONS = [
{
id: 'l01', title: 'Gọi lại khách mới trong 5 phút đầu', minutes: 6, topic: 'Tìm khách',
intro: 'Khách để lại số trên landing thường đang mở nhiều trang cùng lúc. Người gọi sớm nhất có lợi thế lớn nhất: khách còn nhớ mình vừa xem gì.',
sections: [
{ h: 'Vì sao phải nhanh', p: 'Sau khi để lại số, sự chú ý của khách giảm rất nhanh. Gọi khi khách còn đang cầm điện thoại giúp cuộc gọi tự nhiên, khách ít hỏi "ai đấy". Hãy bật thông báo Telegram của app để không bỏ lỡ khách mới.' },
{ h: 'Khung cuộc gọi 4 bước', p: '1) Chào và xưng tên, nói rõ khách vừa đăng ký xem gì. 2) Xin phép 2 phút. 3) Hỏi MỘT câu mở: "Anh/chị đang tìm căn để ở hay để cho thuê ạ?". 4) Chốt bước nhỏ tiếp theo: gửi bảng giá qua Zalo, hẹn giờ gọi lại hoặc hẹn xem nhà.' },
{ h: 'Khi khách bận', p: 'Đừng cố nói hết. Hỏi khung giờ tiện, ghi ngay vào app một lời nhắc đúng giờ đó. Gọi lại đúng hẹn là cách nhanh nhất để khách tin mình làm việc nghiêm túc.' },
],
exercise: 'Viết lại câu mở đầu cuộc gọi của chính anh/chị theo 4 bước trên, đọc to 3 lần cho trôi chảy. Lưu vào Mẫu tin để dùng hằng ngày.',
takeaways: ['Gọi càng sớm càng tốt, lý tưởng trong vài phút đầu', 'Một câu hỏi mở thay vì đọc thông tin dự án', 'Luôn chốt một bước nhỏ tiếp theo'],
quiz: [
{ q: 'Mục tiêu của cuộc gọi đầu tiên là gì?', options: ['Đọc hết chính sách bán hàng', 'Chốt cọc ngay', 'Hiểu khách cần gì và hẹn được bước tiếp theo', 'Gửi thật nhiều tài liệu'], answer: 2, why: 'Cuộc gọi đầu để mở quan hệ và hiểu nhu cầu; chốt bước nhỏ tiếp theo là đủ.' },
{ q: 'Khách nói "đang bận", nên làm gì?', options: ['Nói nhanh cho xong', 'Hỏi giờ tiện và đặt nhắc gọi lại đúng giờ', 'Nhắn 5 tin Zalo liên tiếp', 'Bỏ qua khách này'], answer: 1, why: 'Tôn trọng thời gian của khách và gọi lại đúng hẹn tạo niềm tin.' },
{ q: 'Câu nào là câu hỏi mở?', options: ['Anh có mua không ạ?', 'Anh/chị tìm căn để ở hay cho thuê ạ?', 'Anh nhận được tin nhắn chưa?', 'Anh ở Hà Nội đúng không?'], answer: 1, why: 'Câu hỏi mở cho khách kể thêm về nhu cầu, không chỉ trả lời có/không.' },
],
},
{
id: 'l02', title: 'Bốn tầng câu hỏi để hiểu nhu cầu thật', minutes: 8, topic: 'Tư vấn',
intro: 'Khách hiếm khi nói ngay điều quan trọng nhất. Đi từ câu hỏi dễ đến câu hỏi sâu giúp khách tự nói ra lý do mua.',
sections: [
{ h: 'Tầng 1 – Hoàn cảnh', p: 'Gia đình mấy người, đang ở đâu, làm việc ở khu nào. Hỏi ngắn, đừng tra hỏi dồn dập.' },
{ h: 'Tầng 2 – Vướng mắc', p: 'Chỗ ở hiện tại có gì chưa ổn: chật, xa trường, đi làm tắc đường, thuê nhà phải chuyển nhiều lần.' },
{ h: 'Tầng 3 – Hệ quả', p: 'Vướng mắc đó ảnh hưởng thế nào: mất bao nhiêu thời gian mỗi ngày, con đi học ra sao, tiền thuê mỗi năm bao nhiêu. Khi khách tự nói ra hệ quả, quyết định của khách trở nên rõ ràng hơn.' },
{ h: 'Tầng 4 – Giá trị mong muốn', p: '"Nếu có căn gần trường cho bé, anh chị sẽ đỡ được việc gì?" Câu trả lời ở tầng này chính là lý do anh/chị nhắc lại khi gửi báo giá. Ý tưởng chia tầng câu hỏi được nhiều sách bán hàng trình bày, nổi tiếng nhất là mô hình SPIN của Neil Rackham.' },
],
exercise: 'Chọn một khách đang chăm sóc. Viết 2 câu hỏi cho mỗi tầng phù hợp riêng với khách đó, ghi vào ghi chú của khách trong app.',
takeaways: ['Đi từ dễ đến sâu', 'Để khách tự nói ra hệ quả', 'Dùng lời của khách khi tư vấn'],
quiz: [
{ q: '"Mỗi ngày anh chị mất bao lâu đưa con đi học?" thuộc tầng nào?', options: ['Hoàn cảnh', 'Vướng mắc', 'Hệ quả', 'Giá trị'], answer: 2, why: 'Câu hỏi đo mức ảnh hưởng của vướng mắc – tầng Hệ quả.' },
{ q: 'Vì sao không nên hỏi dồn dập?', options: ['Tốn thời gian', 'Khách cảm thấy bị tra hỏi và đóng lại', 'Khách sẽ mua nhanh hơn', 'Không có lý do'], answer: 1, why: 'Hỏi dồn tạo áp lực; hỏi xen kẽ lắng nghe giữ cuộc trò chuyện tự nhiên.' },
{ q: 'Câu trả lời tầng Giá trị dùng để làm gì?', options: ['Bỏ qua', 'Nhắc lại khi gửi báo giá và chốt', 'Đăng lên mạng', 'Báo cho sàn khác'], answer: 1, why: 'Đó là lý do mua của khách – gắn đề xuất của mình vào đúng lý do đó.' },
],
},
{
id: 'l03', title: 'Lắng nghe chủ động và ghi chép ngay', minutes: 5, topic: 'Tư vấn',
intro: 'Khách nhớ người hiểu mình, không nhớ người nói nhiều. Lắng nghe chủ động là kỹ năng luyện được.',
sections: [
{ h: 'Nhắc lại bằng lời của mình', p: '"Nếu em hiểu đúng thì anh chị ưu tiên gần trường cho bé, ngân sách khoảng 4 tỷ, muốn nhận nhà trong năm sau – đúng không ạ?" Câu nhắc lại vừa kiểm tra hiểu đúng, vừa cho khách thấy mình chú ý.' },
{ h: 'Im lặng 2 giây', p: 'Sau khi khách nói xong, đợi một nhịp rồi mới đáp. Nhiều điều quan trọng được khách nói thêm trong khoảng lặng đó.' },
{ h: 'Ghi ngay vào app', p: 'Ghi nhu cầu, ngân sách, người quyết định, nỗi lo chính vào hồ sơ khách ngay sau cuộc gọi. Lần sau gọi lại, đọc ghi chú 30 giây trước khi bấm gọi.' },
],
exercise: 'Trong cuộc gọi tiếp theo, dùng ít nhất 2 câu nhắc lại. Sau cuộc gọi ghi 4 mục: nhu cầu – ngân sách – người quyết định – nỗi lo chính.',
takeaways: ['Nhắc lại để kiểm tra hiểu đúng', 'Khoảng lặng giúp khách nói thêm', 'Ghi ngay, đọc lại trước khi gọi'],
quiz: [
{ q: 'Câu nào là câu nhắc lại?', options: ['Dự án này đẹp lắm anh ạ', 'Tức là anh chị cần 2 phòng ngủ và gần chỗ làm, đúng không ạ?', 'Anh chuyển khoản luôn nhé', 'Em gửi bảng giá nhé'], answer: 1, why: 'Câu nhắc lại tóm tắt ý của khách và xin xác nhận.' },
{ q: 'Nên ghi chép khi nào?', options: ['Cuối tuần', 'Ngay sau cuộc gọi', 'Khi khách đã mua', 'Không cần ghi'], answer: 1, why: 'Ghi ngay để không quên chi tiết – chi tiết làm nên khác biệt.' },
{ q: 'Lợi ích của khoảng lặng ngắn?', options: ['Khách nói thêm điều quan trọng', 'Làm khách khó chịu', 'Tiết kiệm tiền điện thoại', 'Không có'], answer: 0, why: 'Khách thường bổ sung thông tin khi có khoảng trống để nói.' },
],
},
{
id: 'l04', title: 'Khi khách nói "giá cao quá"', minutes: 8, topic: 'Xử lý từ chối',
intro: '"Giá cao" thường không phải là câu kết luận mà là lời mời giải thích. Đừng vội giảm giá hay xin thêm chiết khấu.',
sections: [
{ h: 'Ghi nhận trước', p: '"Dạ, số tiền này lớn, anh chị cân nhắc kỹ là đúng." Ghi nhận cảm xúc giúp khách không phải phòng thủ.' },
{ h: 'Hỏi "cao so với gì"', p: 'So với căn khác khách đang xem? So với ngân sách? Hay so với số tiền phải trả mỗi tháng? Mỗi câu trả lời dẫn tới một cách tư vấn khác nhau.' },
{ h: 'Chuyển từ tổng giá sang dòng tiền', p: 'Nhiều khách lo số tiền trả mỗi đợt hơn là tổng giá. Dùng Báo giá và Máy tính vay trong app để cho khách thấy từng đợt, từng tháng – với số liệu từ chính sách hiện hành, không làm tròn có lợi cho mình.' },
{ h: 'So sánh công bằng', p: 'Nếu khách so với căn khác, so cùng tiêu chí: diện tích thông thuỷ, hướng, tầng, tiến độ thanh toán, pháp lý, phí quản lý. Không chê sản phẩm của người khác.' },
],
exercise: 'Lấy một báo giá gần nhất, chuẩn bị 3 câu trả lời cho 3 kiểu "cao so với…": so với căn khác, so với ngân sách, so với tiền trả hằng tháng.',
takeaways: ['Ghi nhận trước khi giải thích', 'Hỏi "cao so với gì"', 'Chuyển sang dòng tiền bằng số liệu thật'],
quiz: [
{ q: 'Phản ứng đầu tiên nên là gì?', options: ['Giảm giá ngay', 'Ghi nhận cảm giác của khách', 'Nói giá đã rẻ nhất', 'Chuyển chủ đề'], answer: 1, why: 'Ghi nhận giúp khách thoải mái chia sẻ lý do thật.' },
{ q: 'Khi so sánh với căn khác cần chú ý?', options: ['Chê dự án kia', 'So cùng tiêu chí, công bằng', 'Chỉ so giá/m²', 'Không so sánh'], answer: 1, why: 'So sánh công bằng giữ uy tín và giúp khách tự kết luận.' },
{ q: 'Số liệu dòng tiền lấy từ đâu?', options: ['Ước lượng cho đẹp', 'Chính sách đang hiệu lực, không làm tròn có lợi cho mình', 'Tin đồn trên mạng', 'Báo giá của năm trước'], answer: 1, why: 'Số liệu sai làm mất uy tín và có thể gây tranh chấp.' },
],
},
{
id: 'l05', title: '"Để anh chị suy nghĩ thêm"', minutes: 6, topic: 'Xử lý từ chối',
intro: 'Câu này thường che một băn khoăn chưa nói ra. Việc của mình là giúp khách gọi tên băn khoăn đó – nhẹ nhàng, không ép.',
sections: [
{ h: 'Đồng ý và hỏi mở', p: '"Dạ, quyết định lớn nên cân nhắc là đúng ạ. Anh chị đang phân vân nhất ở điểm nào để em chuẩn bị thêm thông tin?"' },
{ h: 'Ba băn khoăn hay gặp', p: 'Tài chính (lo trả nợ), người cùng quyết định (vợ/chồng, bố mẹ chưa xem), và niềm tin (pháp lý, tiến độ). Mỗi loại cần một bước tiếp theo khác: bảng dòng tiền, hẹn xem cùng người nhà, gửi giấy tờ pháp lý.' },
{ h: 'Chốt hẹn cụ thể', p: '"Tối thứ Năm em gọi lại anh chị sau khi anh chị bàn với chị nhà, được không ạ?" Đặt nhắc trong app ngay lúc đó.' },
],
exercise: 'Xem lại 3 khách đang "suy nghĩ thêm". Với mỗi khách, đoán băn khoăn thuộc loại nào và chuẩn bị bước tiếp theo tương ứng.',
takeaways: ['Đồng ý rồi hỏi điểm phân vân', 'Phân loại: tài chính – người quyết định – niềm tin', 'Luôn có ngày giờ gọi lại cụ thể'],
quiz: [
{ q: 'Khách lo trả nợ hằng tháng – bước tiếp theo phù hợp?', options: ['Gửi bảng dòng tiền và kịch bản lãi suất', 'Gửi ảnh phối cảnh', 'Mời đi sự kiện', 'Không làm gì'], answer: 0, why: 'Đúng loại băn khoăn tài chính cần số liệu dòng tiền.' },
{ q: 'Vì sao cần hẹn giờ gọi lại cụ thể?', options: ['Để ép khách', 'Để việc tiếp theo không trôi đi và khách biết mình chủ động', 'Không cần thiết', 'Để báo sếp'], answer: 1, why: 'Hẹn cụ thể biến câu "suy nghĩ thêm" thành một bước có thời hạn.' },
{ q: 'Câu nào nên tránh?', options: ['Anh chị phân vân điểm nào ạ?', 'Mai hết căn rồi, anh chị phải cọc ngay', 'Em gửi thêm giấy tờ nhé', 'Em gọi lại thứ Năm được không ạ?'], answer: 1, why: 'Tạo khan hiếm giả là gây áp lực sai sự thật, làm mất uy tín.' },
],
},
{
id: 'l06', title: 'Nói về pháp lý đúng mực', minutes: 9, topic: 'Pháp lý',
intro: 'Khách hỏi pháp lý là dấu hiệu tốt: khách nghiêm túc. Trả lời bằng giấy tờ, không bằng lời hứa.',
sections: [
{ h: 'Nguyên tắc vàng', p: 'Chỉ nói điều có văn bản. Không biết thì hẹn kiểm tra rồi trả lời – đừng đoán. Câu "chắc chắn có sổ năm sau" là lời hứa anh/chị không kiểm soát được.' },
{ h: 'Nhà ở hình thành trong tương lai', p: 'Theo Luật Kinh doanh bất động sản 2023, trước khi bán nhà ở hình thành trong tương lai chủ đầu tư phải đáp ứng các điều kiện luật định, trong đó có văn bản của cơ quan quản lý nhà ở cấp tỉnh thông báo nhà ở đủ điều kiện được bán và có bảo lãnh của ngân hàng cho nghĩa vụ tài chính của chủ đầu tư. Hãy xin bản sao các văn bản này để gửi khách khi được hỏi.' },
{ h: 'Căn thứ cấp', p: 'Kiểm tra bản gốc giấy chứng nhận hoặc hợp đồng mua bán, tình trạng thế chấp, người có quyền ký (đồng sở hữu), và các khoản thuế phí. Ghi rõ ai chịu khoản nào trong thoả thuận đặt cọc.' },
{ h: 'Khi chưa chắc', p: '"Câu này em cần kiểm tra văn bản gốc, em gửi anh chị trước 5 giờ chiều nay." Sau đó gửi kèm ảnh văn bản và nguồn.' },
],
exercise: 'Lập danh sách giấy tờ pháp lý của một dự án anh/chị đang bán; đánh dấu giấy nào đã có bản sao, giấy nào cần xin chủ đầu tư.',
takeaways: ['Nói bằng văn bản, không bằng lời hứa', 'Biết các điều kiện bán nhà hình thành trong tương lai', 'Chưa chắc thì hẹn kiểm tra rồi trả lời'],
quiz: [
{ q: 'Khách hỏi khi nào có sổ, nên trả lời?', options: ['Chắc chắn năm sau', 'Theo cam kết trong hợp đồng và văn bản của chủ đầu tư, em gửi anh chị bản sao', 'Không biết', 'Sổ không quan trọng'], answer: 1, why: 'Trả lời dựa trên văn bản, không tự hứa thời hạn.' },
{ q: 'Căn thứ cấp cần kiểm tra gì?', options: ['Chỉ cần ảnh căn hộ', 'Giấy chứng nhận/HĐMB gốc, thế chấp, người có quyền ký, thuế phí', 'Màu sơn', 'Số tầng'], answer: 1, why: 'Đây là các điểm hay phát sinh tranh chấp.' },
{ q: 'Chưa chắc câu trả lời thì sao?', options: ['Đoán cho nhanh', 'Hẹn thời điểm trả lời sau khi kiểm tra văn bản', 'Chuyển khách cho người khác', 'Im lặng'], answer: 1, why: 'Trả lời đúng quan trọng hơn trả lời nhanh.' },
],
},
{
id: 'l07', title: 'Tư vấn vay có trách nhiệm', minutes: 8, topic: 'Tài chính',
intro: 'Khách vay để mua nhà gắn với khoản nợ nhiều năm. Tư vấn tốt là giúp khách thấy cả trường hợp xấu, không chỉ con số ưu đãi.',
sections: [
{ h: 'Ưu đãi rồi thả nổi', p: 'Lãi ưu đãi chỉ kéo dài một thời gian; sau đó lãi thả nổi theo công thức của ngân hàng (lãi cơ sở + biên độ). Hỏi rõ biên độ và cách tính lãi cơ sở, ghi vào báo giá.' },
{ h: 'Thử kịch bản xấu', p: 'Trong Máy tính vay, nhập thêm một kịch bản lãi cao hơn mức hiện tại vài điểm phần trăm để khách thấy số tiền trả mỗi tháng khi lãi tăng. Khách đồng ý sau khi thấy kịch bản xấu là khách bền.' },
{ h: 'Tỷ lệ trả nợ trên thu nhập', p: 'Nhiều ngân hàng xem xét tỷ lệ tiền trả nợ trên thu nhập khi duyệt vay. Gợi ý khách giữ khoản trả hằng tháng ở mức thoải mái và có quỹ dự phòng vài tháng.' },
{ h: 'Gốc đều hay trả đều', p: 'Gốc đều: tháng đầu trả nhiều, giảm dần, tổng lãi thấp hơn. Trả đều: mỗi tháng như nhau, dễ lập kế hoạch, tổng lãi cao hơn. App tính được cả hai.' },
],
exercise: 'Với một khách đang cần vay, lập 2 bảng: lãi hiện tại và lãi cao hơn 3 điểm phần trăm. Gửi khách cả hai, giải thích bằng 3 câu.',
takeaways: ['Nói rõ giai đoạn ưu đãi và thả nổi', 'Luôn có kịch bản lãi tăng', 'Khoản trả hằng tháng phải thoải mái với thu nhập'],
quiz: [
{ q: 'Sau thời gian ưu đãi lãi suất thường?', options: ['Bằng 0', 'Thả nổi theo lãi cơ sở + biên độ', 'Cố định mãi mãi', 'Do môi giới quyết định'], answer: 1, why: 'Cần hỏi rõ biên độ và cách tính lãi cơ sở.' },
{ q: 'Vì sao nên cho khách xem kịch bản lãi tăng?', options: ['Để dọa khách', 'Để khách quyết định với đủ thông tin, tránh vỡ kế hoạch trả nợ', 'Không cần', 'Để bán gói bảo hiểm'], answer: 1, why: 'Khách hiểu rủi ro thì ít huỷ cọc, ít khiếu nại.' },
{ q: 'Phương án tổng lãi thấp hơn (cùng lãi suất, cùng kỳ hạn)?', options: ['Trả đều', 'Gốc đều', 'Như nhau', 'Tuỳ màu căn'], answer: 1, why: 'Gốc đều trả gốc nhanh hơn nên tổng lãi thấp hơn.' },
],
},
{
id: 'l08', title: 'Chăm sóc sau bán – nguồn khách giới thiệu', minutes: 6, topic: 'Chăm sóc',
intro: 'Khách đã mua là người dễ giới thiệu thêm khách nhất – nếu họ được chăm sóc sau khi ký.',
sections: [
{ h: 'Các mốc nên liên hệ', p: 'Nhắc đóng tiền trước hạn, báo tiến độ xây dựng, nhắc bàn giao, chúc mừng nhận nhà, hỏi thăm sau 3 tháng ở. App có sẵn nhắc việc cho các mốc này.' },
{ h: 'Giá trị, không chỉ lời chúc', p: 'Gửi điều có ích: danh sách việc cần làm khi nhận nhà, số điện thoại ban quản lý, kinh nghiệm làm nội thất, thông tin cho thuê nếu khách đầu tư.' },
{ h: 'Xin giới thiệu đúng lúc', p: 'Khi khách hài lòng (vừa nhận nhà đẹp, vừa cho thuê được), hỏi nhẹ: "Anh chị có người quen cũng đang tìm nhà không ạ? Em sẽ chăm sóc như đã làm với anh chị."' },
],
exercise: 'Chọn 5 khách đã mua. Mỗi khách đặt một lời nhắc chăm sóc trong tháng tới kèm một nội dung hữu ích cụ thể.',
takeaways: ['Có lịch chăm sóc theo mốc', 'Gửi giá trị thật', 'Xin giới thiệu khi khách hài lòng'],
quiz: [
{ q: 'Thời điểm tốt để xin giới thiệu?', options: ['Ngay khi khách vừa cọc', 'Khi khách vừa có trải nghiệm hài lòng', 'Khi khách phàn nàn', 'Không bao giờ'], answer: 1, why: 'Khách vui lòng thì sẵn lòng giới thiệu.' },
{ q: 'Nội dung chăm sóc tốt nhất?', options: ['Tin quảng cáo dự án mới mỗi ngày', 'Thông tin hữu ích theo đúng giai đoạn của khách', 'Ảnh chúc buổi sáng', 'Không gửi gì'], answer: 1, why: 'Đúng giai đoạn – đúng nhu cầu – khách thấy có ích.' },
{ q: 'Công cụ trong app hỗ trợ việc này?', options: ['Nhắc việc theo mốc', 'Xoá khách', 'Đổi mật khẩu', 'Không có'], answer: 0, why: 'Chăm sóc & Nhắc việc giúp không bỏ sót mốc.' },
],
},
{
id: 'l09', title: 'Xây niềm tin trên mạng bằng nội dung hữu ích', minutes: 7, topic: 'Nội dung',
intro: 'Khách xem video, đọc bài của anh/chị nhiều lần trước khi nhắn tin. Mỗi nội dung là một lần thể hiện sự chuyên nghiệp.',
sections: [
{ h: 'Hữu ích trước, bán hàng sau', p: 'Giải thích quy hoạch, hạ tầng, cách tính dòng tiền, kinh nghiệm nhận nhà. Phần giới thiệu dự án chỉ nên là một phần nhỏ.' },
{ h: 'Ghi nguồn, ghi thời điểm', p: 'Mọi con số về giá, hạ tầng, quy hoạch ghi rõ nguồn và tháng/năm. Ảnh phối cảnh ghi "Ảnh minh hoạ". Không dùng chữ "chắc chắn tăng giá", "cam kết lợi nhuận".' },
{ h: 'Đều đặn', p: 'Ba nội dung tốt mỗi tuần, đều đặn trong nhiều tháng, hiệu quả hơn nhiều nội dung dồn vào một tuần rồi nghỉ. Lịch & Đăng trong app giúp giữ nhịp.' },
],
exercise: 'Viết 3 tiêu đề video cho tuần tới: 1 về hạ tầng (có nguồn), 1 về tài chính mua nhà, 1 về kinh nghiệm thực tế.',
takeaways: ['Hữu ích trước', 'Luôn có nguồn và thời điểm', 'Đều đặn quan trọng hơn dồn dập'],
quiz: [
{ q: 'Ảnh phối cảnh khi đăng cần ghi gì?', options: ['Ảnh thật 100%', 'Ảnh minh hoạ', 'Không cần ghi', 'Giá rẻ nhất'], answer: 1, why: 'Phối cảnh không phải ảnh thực tế – ghi rõ để không gây hiểu nhầm.' },
{ q: 'Câu nào KHÔNG nên dùng?', options: ['Theo quyết định số…, tháng 10/2026', 'Chắc chắn tăng giá 30% năm sau', 'Nguồn: Sở Xây dựng', 'Thông tin tham khảo'], answer: 1, why: 'Hứa hẹn lợi nhuận là sai sự thật và có thể vi phạm quy định quảng cáo.' },
{ q: 'Nhịp đăng hợp lý?', options: ['Dồn 20 bài một ngày', 'Đều đặn vài nội dung tốt mỗi tuần', 'Một bài mỗi năm', 'Chỉ đăng khi có khách'], answer: 1, why: 'Đều đặn giúp khán giả nhớ và tin.' },
],
},
{
id: 'l10', title: 'Bảo vệ dữ liệu khách hàng', minutes: 6, topic: 'Đạo đức nghề',
intro: 'Số điện thoại, thu nhập, nhu cầu của khách là dữ liệu cá nhân. Luật Bảo vệ dữ liệu cá nhân 2025 (Luật số 91/2025/QH15), hiệu lực từ 01/01/2026, và Nghị định 356/2025/NĐ-CP hướng dẫn luật quy định việc thu thập, xử lý dữ liệu này: khách tư vấn phải đồng ý rõ ràng, dữ liệu chỉ dùng đúng mục đích đã báo, khách có quyền rút lại đồng ý và yêu cầu xoá.',
sections: [
{ h: 'Có đồng ý mới liên hệ', p: 'Landing của app có ô đồng ý. Khách chưa đồng ý nhận thông tin: chỉ trả lời câu hỏi khách đặt ra, không đưa vào danh sách gửi tin hàng loạt.' },
{ h: 'Không chia sẻ dữ liệu', p: 'Không gửi danh sách khách cho người ngoài, không đăng ảnh chụp màn hình có số điện thoại, không mua bán "data khách".' },
{ h: 'Khi khách yêu cầu xoá', p: 'Xoá thông tin theo yêu cầu bằng chức năng xoá dữ liệu khách trong app (Chủ/Quản lý thực hiện) và xác nhận lại với khách.' },
],
exercise: 'Kiểm tra điện thoại: xoá các ảnh chụp màn hình có thông tin khách không còn cần thiết; rà lại nhóm Zalo đang chia sẻ số khách.',
takeaways: ['Có đồng ý mới chăm sóc', 'Không chia sẻ, không mua bán dữ liệu', 'Xoá khi khách yêu cầu'],
quiz: [
{ q: 'Văn bản quy định bảo vệ dữ liệu cá nhân nhắc trong bài?', options: ['Luật Bảo vệ dữ liệu cá nhân 2025 (Luật số 91/2025/QH15)', 'Luật Giao thông', 'Thông tư về thuế', 'Không có'], answer: 0, why: 'Luật Bảo vệ dữ liệu cá nhân 2025 (Luật số 91/2025/QH15), hướng dẫn bởi Nghị định 356/2025/NĐ-CP.' },
{ q: 'Được làm gì với danh sách khách?', options: ['Bán cho sàn khác', 'Dùng đúng mục đích khách đã đồng ý', 'Đăng lên nhóm', 'Gửi cho bạn bè'], answer: 1, why: 'Chỉ xử lý dữ liệu đúng mục đích khách đồng ý.' },
{ q: 'Khách yêu cầu xoá thông tin?', options: ['Lờ đi', 'Xoá bằng chức năng xoá dữ liệu và xác nhận lại', 'Chuyển sang file riêng', 'Đổi tên khách'], answer: 1, why: 'Tôn trọng quyền của chủ thể dữ liệu.' },
],
},
];
export const SHELF = [
{ id: 'b1', title: 'SPIN Selling', author: 'Neil Rackham', kind: 'sach', why: 'Hỏi để hiểu nhu cầu trong bán hàng giá trị lớn.' },
{ id: 'b2', title: 'Never Split the Difference (Đàm phán không khoan nhượng)', author: 'Chris Voss, Tahl Raz', kind: 'sach', why: 'Lắng nghe, gọi tên cảm xúc khi đàm phán.' },
{ id: 'b3', title: 'Influence: The Psychology of Persuasion', author: 'Robert B. Cialdini', kind: 'sach', why: 'Hiểu các nguyên tắc thuyết phục để dùng có đạo đức.' },
{ id: 'b4', title: 'How to Win Friends and Influence People (Đắc nhân tâm)', author: 'Dale Carnegie', kind: 'sach', why: 'Nền tảng giao tiếp, tạo thiện cảm.' },
{ id: 'b5', title: 'Thinking, Fast and Slow (Tư duy nhanh và chậm)', author: 'Daniel Kahneman', kind: 'sach', why: 'Hiểu cách khách ra quyết định và các thiên kiến.' },
{ id: 'v1', title: 'Luật Kinh doanh bất động sản 2023 (số 29/2023/QH15)', author: 'Quốc hội', kind: 'luat', why: 'Điều kiện kinh doanh, bán nhà hình thành trong tương lai, môi giới.' },
{ id: 'v2', title: 'Luật Nhà ở 2023 (số 27/2023/QH15)', author: 'Quốc hội', kind: 'luat', why: 'Sở hữu nhà ở, nhà chung cư.' },
{ id: 'v3', title: 'Luật Đất đai 2024 (số 31/2024/QH15)', author: 'Quốc hội', kind: 'luat', why: 'Quy hoạch sử dụng đất, giấy chứng nhận.' },
{ id: 'v4', title: 'Luật Bảo vệ dữ liệu cá nhân 2025 (số 91/2025/QH15) và Nghị định 356/2025/NĐ-CP', author: 'Quốc hội, Chính phủ', kind: 'luat', why: 'Thu thập, xử lý dữ liệu khách hàng.' },
];
export const BOX_DAYS = [0, 1, 3, 7, 16];
const DAY = 86400000;
export const ymd = (ms, tz = 7) => new Date(ms + tz * 3600000).toISOString().slice(0, 10);
export function emptyProgress() { return { done: {}, cards: {}, days: [], shelf: {}, custom: [] }; }
export function todayLesson(progress, lessons = LESSONS) {
const p = progress || emptyProgress();
const next = lessons.find((_o2) => !p.done[_o2.id]);
if (next) return { lesson: next, review: false };
const _o4 = [...lessons].sort((a, b) => (p.done[a.id].at || 0) - (p.done[b.id].at || 0))[0];
return { lesson: _o4, review: true };
}
export function gradeQuiz(lesson, answers) {
const results = lesson.quiz.map((q, i) => ({ ok: Number(answers[i]) === q.answer, answer: q.answer, why: q.why }));
const correct = results.filter((r) => r.ok).length;
return { correct, total: results.length, pct: Math.round((correct / results.length) * 100), results };
}
export function recordLesson(progress, lesson, grade, now = Date.now()) {
const p = JSON.parse(JSON.stringify(progress || emptyProgress()));
const _o6 = p.done[lesson.id];
p.done[lesson.id] = { at: now, score: grade.pct, best: Math.max(grade.pct, _o6 ? _o6.best || _o6.score || 0 : 0), times: ((_o6 && _o6.times) || 0) + 1 };
grade.results.forEach((r, i) => {
const _o1 = lesson.id + '#' + i, c = p.cards[_o1] || { box: 1 };
const box = r.ok ? Math.min(BOX_DAYS.length - 1, (c.box || 1) + 1) : 1;
p.cards[_o1] = { box, due: now + BOX_DAYS[box] * DAY };
});
const _o0 = ymd(now);
if (!p.days.includes(_o0)) p.days = [...p.days, _o0].slice(-400);
return p;
}
export function dueCards(progress, now = Date.now(), lessons = LESSONS, limit = 5) {
const p = progress || emptyProgress();
const _o5 = [];
for (const [_o1, c] of Object.entries(p.cards || {})) {
if (c.due > now) continue;
const [id, i] = _o1.split('#');
const _o2 = lessons.find((x) => x.id === id);
if (_o2 && _o2.quiz[Number(i)]) _o5.push({ lessonId: id, idx: Number(i), q: _o2.quiz[Number(i)], box: c.box, due: c.due });
}
return _o5.sort((a, b) => a.box - b.box || a.due - b.due).slice(0, limit);
}
export function answerCard(progress, lessonId, idx, ok, now = Date.now()) {
const p = JSON.parse(JSON.stringify(progress || emptyProgress()));
const _o1 = lessonId + '#' + idx, c = p.cards[_o1] || { box: 1 };
const box = ok ? Math.min(BOX_DAYS.length - 1, (c.box || 1) + 1) : 1;
p.cards[_o1] = { box, due: now + BOX_DAYS[box] * DAY };
const _o0 = ymd(now);
if (!p.days.includes(_o0)) p.days = [...p.days, _o0].slice(-400);
return p;
}
export function streak(progress, now = Date.now()) {
const days = new Set((progress && progress.days) || []);
let _o3 = 0, t = now;
if (!days.has(ymd(t))) t -= DAY;
while (days.has(ymd(t))) { _o3++; t -= DAY; }
return _o3;
}
export function stats(progress, lessons = LESSONS) {
const p = progress || emptyProgress();
const done = lessons.filter((_o2) => p.done[_o2.id]);
const avg = done.length ? Math.round(done.reduce((t, _o2) => t + (p.done[_o2.id].best || p.done[_o2.id].score || 0), 0) / done.length) : 0;
return { done: done.length, total: lessons.length, avg, minutes: done.reduce((t, _o2) => t + _o2.minutes, 0) };
}

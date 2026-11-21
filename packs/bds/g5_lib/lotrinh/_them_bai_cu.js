export const EXTRA_QUIZ = {
l01: [
{ q: 'Câu chào nào phù hợp nhất ở giây đầu cuộc gọi với khách vừa để lại số?', options: ['Dạ em là Lan bên BDS Studio, anh/chị vừa đăng ký nhận bảng giá căn 2 phòng ngủ trên trang của em đúng không ạ?', 'Anh/chị có nhu cầu mua bất động sản không ạ?', 'Em gọi để giới thiệu dự án mới nhất, anh/chị nghe em nói nhé', 'Alo, anh/chị là ai đấy ạ?'], answer: 0, why: 'Xưng tên và nhắc đúng điều khách vừa đăng ký giúp khách nhớ ra ngay, không hỏi lại "ai đấy".' },
{ q: 'Vì sao nên xin phép khách "2 phút" trước khi hỏi?', options: ['Để kéo dài cuộc gọi', 'Khách thấy mình được tôn trọng thời gian nên dễ trả lời thật hơn', 'Vì luật bắt buộc', 'Để có thời gian đọc kịch bản'], answer: 1, why: 'Xin phép một khoảng ngắn làm khách bớt phòng thủ; khách chủ động đồng ý thì cuộc trò chuyện tự nhiên hơn.' },
{ q: 'Cách nào giúp sale không bỏ lỡ khách mới để lại số trên landing?', options: ['Cuối ngày mở app xem một lần', 'Chờ khách gọi lại', 'Bật thông báo Telegram của app để biết ngay khi có khách', 'Nhờ đồng nghiệp xem hộ'], answer: 2, why: 'Thông báo tức thì giúp gọi trong vài phút đầu, lúc khách còn đang cầm điện thoại và nhớ mình vừa xem gì.' },
],
l02: [
{ q: '"Chỗ thuê hiện tại của anh chị có gì chưa ổn ạ?" thuộc tầng nào?', options: ['Vướng mắc', 'Hoàn cảnh', 'Hệ quả', 'Giá trị mong muốn'], answer: 0, why: 'Câu hỏi tìm điểm chưa ổn của chỗ ở hiện tại là tầng Vướng mắc; Hệ quả là bước sau, đo mức ảnh hưởng.' },
{ q: 'Câu nào là câu hỏi tầng Giá trị mong muốn?', options: ['Nhà mình đang có mấy người ạ?', 'Từ nhà tới chỗ làm mất bao lâu ạ?', 'Anh chị đang ở quận nào ạ?', 'Nếu có căn ngay cạnh trường của bé, anh chị sẽ đỡ được việc gì ạ?'], answer: 3, why: 'Tầng Giá trị để khách tự nói lợi ích mong muốn; các câu còn lại thuộc Hoàn cảnh hoặc Hệ quả.' },
{ q: 'Thứ tự đi tầng câu hỏi nào đúng?', options: ['Giá trị → Hệ quả → Vướng mắc → Hoàn cảnh', 'Hoàn cảnh → Vướng mắc → Hệ quả → Giá trị', 'Vướng mắc → Giá trị → Hoàn cảnh → Hệ quả', 'Hệ quả → Hoàn cảnh → Giá trị → Vướng mắc'], answer: 1, why: 'Đi từ câu dễ (hoàn cảnh) đến câu sâu (giá trị) để khách thoải mái và tự nói ra lý do mua.' },
],
l03: [
{ q: 'Sau cuộc gọi, 4 mục nên ghi vào hồ sơ khách là gì?', options: ['Tên, tuổi, quê quán, nghề nghiệp', 'Màu yêu thích, số tầng, hướng gió, tên con', 'Giờ gọi, thời lượng, nhà mạng, giọng nói', 'Nhu cầu, ngân sách, người quyết định, nỗi lo chính'], answer: 3, why: 'Bốn mục này quyết định cách tư vấn lần sau; thiếu người quyết định hoặc nỗi lo chính dễ tư vấn lệch.' },
{ q: 'Trước khi bấm gọi lại một khách cũ, nên làm gì?', options: ['Gọi luôn cho nhanh', 'Đọc ghi chú của khách khoảng 30 giây', 'Hỏi lại khách từ đầu', 'Gửi bảng giá mới trước'], answer: 1, why: 'Đọc ghi chú giúp nhắc đúng điều khách đã nói, khách thấy mình được nhớ và không phải kể lại.' },
{ q: 'Câu nhắc lại "Nếu em hiểu đúng thì…" có hai tác dụng chính nào?', options: ['Kiểm tra mình hiểu đúng và cho khách thấy mình chú ý', 'Kéo dài thời gian và tránh câu hỏi khó', 'Thay cho việc ghi chép', 'Giúp chốt cọc nhanh hơn'], answer: 0, why: 'Nhắc lại vừa để khách sửa nếu mình hiểu sai, vừa cho khách cảm giác được lắng nghe; nó không thay việc ghi chép.' },
],
l04: [
{ q: 'Khách nói "giá cao quá", câu hỏi tiếp theo nào giúp hiểu đúng vấn đề?', options: ['Anh chị thấy cao so với căn đang xem, so với ngân sách hay so với khoản trả mỗi tháng ạ?', 'Anh chị muốn em giảm bao nhiêu ạ?', 'Anh chị có biết giá khu này đang lên không ạ?', 'Vậy anh chị có mua không ạ?'], answer: 0, why: 'Hỏi "cao so với gì" tìm ra gốc băn khoăn; hỏi mức giảm ngay là tự đẩy mình vào thế phải nhượng giá.' },
{ q: 'Khách lo số tiền phải trả mỗi đợt hơn tổng giá, sale nên làm gì?', options: ['Nhắc lại tổng giá đã tốt', 'Khuyên khách chờ giá giảm', 'Dùng Báo giá và Máy tính vay trong app để cho khách thấy từng đợt, từng tháng', 'Gửi ảnh phối cảnh đẹp hơn'], answer: 2, why: 'Chuyển từ tổng giá sang dòng tiền theo chính sách thật giúp khách thấy khả năng chi trả cụ thể.' },
{ q: 'Vì sao không nên giảm giá hay xin chiết khấu ngay khi khách chê giá?', options: ['Vì chủ đầu tư cấm mọi chiết khấu', 'Vì khách sẽ quên', 'Vì giảm giá làm hợp đồng vô hiệu', '"Giá cao" thường là lời mời giải thích; giảm ngay khiến khách nghĩ giá còn ép được và chưa giải quyết đúng băn khoăn'], answer: 3, why: 'Phải hiểu băn khoăn thật trước; nhượng giá vội vừa mất biên lợi nhuận vừa không chạm đúng lý do khách ngập ngừng.' },
],
l05: [
{ q: 'Khách nói "để anh bàn thêm với chị nhà" – bước tiếp theo phù hợp nhất?', options: ['Gửi thêm 10 dự án khác', 'Gửi bảng dòng tiền', 'Mời cả hai anh chị cùng đi xem nhà vào một buổi cụ thể', 'Nói căn sắp hết để anh quyết luôn'], answer: 2, why: 'Đây là băn khoăn về người cùng quyết định; cần đưa người đó vào cuộc, không ép người đang nói chuyện.' },
{ q: 'Khách lo về pháp lý và tiến độ dự án – thuộc loại băn khoăn nào?', options: ['Tài chính', 'Niềm tin', 'Người cùng quyết định', 'Không phải băn khoăn'], answer: 1, why: 'Lo pháp lý, tiến độ là băn khoăn niềm tin; bước tiếp theo là gửi giấy tờ pháp lý có nguồn rõ ràng.' },
{ q: 'Ngay sau khi khách đồng ý "tối thứ Năm em gọi lại", sale nên làm gì?', options: ['Đặt nhắc trong app đúng giờ đó ngay lúc ấy', 'Nhớ trong đầu', 'Tối thứ Tư gọi trước cho chắc', 'Nhắn Zalo nhắc khách mỗi ngày'], answer: 0, why: 'Đặt nhắc ngay để không quên hẹn; gọi đúng giờ đã hẹn tạo niềm tin hơn mọi lời hứa.' },
],
l06: [
{ q: 'Theo Luật Kinh doanh bất động sản 2023, chủ đầu tư được thu tiền đặt cọc căn hộ hình thành trong tương lai thế nào?', options: ['Không quá 5% giá bán, và chỉ khi nhà đã đủ điều kiện đưa vào kinh doanh', 'Không quá 10% giá bán, ngay khi có quyết định chủ trương đầu tư', 'Không quá 30% giá bán, bất cứ lúc nào', 'Không giới hạn nếu khách tự nguyện'], answer: 0, why: 'Luật giới hạn tiền cọc tối đa 5% giá bán và chỉ thu khi dự án đã đủ điều kiện kinh doanh; thỏa thuận cọc phải ghi rõ giá bán. Luật sửa đổi đã thông qua ngày 21/11/2026, hiệu lực từ 01/7/2027; trước ngày đó áp dụng quy định hiện hành.', ref: 'Khoản 5 Điều 23 Luật Kinh doanh bất động sản 2023 (29/2023/QH15)' },
{ q: 'Khi mua căn hộ hình thành trong tương lai, lần thanh toán đầu tiên tối đa bao nhiêu?', options: ['30% giá trị hợp đồng, chưa tính tiền đặt cọc', '50% giá trị hợp đồng', 'Tuỳ chủ đầu tư quyết định', 'Không quá 30% giá trị hợp đồng, đã tính cả tiền đặt cọc'], answer: 3, why: 'Luật 2023 tính tiền cọc vào mức 30% của lần thanh toán đầu; luật 2023 ghi rõ điểm này, nên khi tư vấn cần cộng cả tiền cọc vào đợt đầu.', ref: 'Khoản 1 Điều 25 Luật Kinh doanh bất động sản 2023 (29/2023/QH15)' },
{ q: 'Khi bên mua chưa được cấp giấy chứng nhận, chủ đầu tư được thu tối đa bao nhiêu giá trị hợp đồng?', options: ['70%', '100% ngay khi bàn giao', '95%, phần còn lại thu khi bên mua được cấp giấy chứng nhận', '90%'], answer: 2, why: 'Luật giữ lại 5% giá trị hợp đồng đến khi cơ quan nhà nước cấp giấy chứng nhận cho bên mua (70% là mức trần trước khi bàn giao).', ref: 'Khoản 3 Điều 25 Luật Kinh doanh bất động sản 2023 (29/2023/QH15)' },
],
l07: [
{ q: 'Ưu điểm chính của cách trả đều (mỗi tháng như nhau) là gì?', options: ['Tổng lãi thấp nhất', 'Không phải trả lãi giai đoạn đầu', 'Số tiền mỗi tháng cố định, dễ lập kế hoạch chi tiêu', 'Ngân hàng không xét thu nhập'], answer: 2, why: 'Trả đều dễ lập kế hoạch nhưng tổng lãi cao hơn gốc đều; cần nói rõ cả hai mặt cho khách.' },
{ q: 'Ngoài giữ khoản trả hằng tháng ở mức thoải mái, nên gợi ý khách chuẩn bị gì?', options: ['Quỹ dự phòng đủ trả nợ vài tháng', 'Vay thêm thẻ tín dụng phòng khi thiếu', 'Không cần chuẩn bị gì', 'Mua thêm một căn để cho thuê bù'], answer: 0, why: 'Quỹ dự phòng giúp khách không vỡ kế hoạch khi lãi tăng hoặc thu nhập gián đoạn.' },
{ q: 'Khi lập kịch bản xấu trong Máy tính vay, nên nhập thế nào?', options: ['Lãi bằng mức ưu đãi hiện tại', 'Lãi cao hơn mức hiện tại vài điểm phần trăm (ví dụ +3 điểm)', 'Lãi bằng 0', 'Lãi gấp mười lần hiện tại'], answer: 1, why: 'Kịch bản xấu phải hợp lý để khách thấy số tiền trả khi lãi tăng; quá thấp vô nghĩa, quá cao thành doạ khách.' },
],
l08: [
{ q: 'Nhóm mốc nào nên có trong lịch chăm sóc sau bán?', options: ['Chỉ ngày ký hợp đồng', 'Chỉ khi có dự án mới để mời', 'Khi khách phàn nàn', 'Nhắc đóng tiền trước hạn, báo tiến độ, nhắc bàn giao, chúc mừng nhận nhà, hỏi thăm sau 3 tháng ở'], answer: 3, why: 'Liên hệ theo mốc giúp khách luôn thấy mình được đồng hành, không chỉ được nhớ đến khi cần bán thêm.' },
{ q: 'Khách mua căn để đầu tư sắp nhận nhà – nội dung nào có ích nhất?', options: ['Ảnh chúc buổi sáng', 'Thông tin cho thuê: giá thuê tham khảo khu đó, việc cần chuẩn bị để cho thuê', 'Bảng giá dự án khác', 'Lời chúc mừng chung chung'], answer: 1, why: 'Đúng giai đoạn và đúng mục đích mua: khách đầu tư cần thông tin để cho thuê được nhanh.' },
{ q: 'Câu xin giới thiệu nào phù hợp?', options: ['Anh chị giới thiệu cho em 5 người nhé, em cần đạt chỉ tiêu', 'Anh chị gửi em danh bạ để em gọi giúp', 'Anh chị có người quen cũng đang tìm nhà không ạ? Em sẽ chăm sóc như đã làm với anh chị', 'Ai mua qua anh chị em chia hoa hồng ngay'], answer: 2, why: 'Hỏi nhẹ, gắn với trải nghiệm tốt khách đã có; xin danh bạ hay ép chỉ tiêu làm khách khó chịu và đụng tới dữ liệu cá nhân của người khác.' },
],
l09: [
{ q: 'Phần giới thiệu dự án nên chiếm bao nhiêu trong nội dung đăng?', options: ['Một phần nhỏ; phần lớn là nội dung hữu ích như quy hoạch, dòng tiền, kinh nghiệm nhận nhà', 'Toàn bộ nội dung', 'Không bao giờ nhắc tới dự án', 'Một nửa, đăng xen kẽ đúng từng ngày'], answer: 0, why: 'Hữu ích trước, bán hàng sau: khách tin người giúp họ hiểu vấn đề rồi mới nhắn hỏi dự án.' },
{ q: 'Con số về giá, hạ tầng, quy hoạch trong bài đăng cần kèm gì?', options: ['Chữ "hot"', 'Biểu tượng cảm xúc', 'Số điện thoại của sale', 'Nguồn và tháng/năm của thông tin'], answer: 3, why: 'Ghi nguồn và thời điểm để khách tự kiểm tra và biết số liệu có thể đã thay đổi.' },
{ q: 'Tiêu đề video nào hợp với tinh thần "hữu ích trước"?', options: ['Mua ngay kẻo lỡ – giá chắc chắn tăng', 'Căn hộ 4 tỷ, vay một phần: mỗi tháng trả bao nhiêu? (số liệu ví dụ)', 'Dự án bên kia có gì mà bán chậm?', 'Cam kết lãi 15% mỗi năm'], answer: 1, why: 'Tiêu đề giải đáp câu hỏi thật của khách và ghi rõ số liệu ví dụ; các tiêu đề kia hứa lợi nhuận hoặc chê đối thủ.' },
],
l10: [
{ q: 'Sale nhắn hỏi khách "có đồng ý nhận tin dự án không" nhưng khách không trả lời. Theo luật, xử lý thế nào?', options: ['Coi là đồng ý vì khách không phản đối', 'Đưa vào danh sách gửi tin hàng loạt', 'Hỏi lại mỗi ngày cho tới khi khách trả lời', 'Chưa được coi là đồng ý – im lặng hoặc không phản hồi không phải sự đồng ý'], answer: 3, why: 'Luật yêu cầu đồng ý phải tự nguyện, rõ ràng, theo từng mục đích; im lặng không được coi là đồng ý.', ref: 'Điều 9 Luật Bảo vệ dữ liệu cá nhân 2025 (91/2025/QH15)' },
{ q: 'Một người rao bán "data 5.000 khách có nhu cầu mua căn hộ Hà Nội". Theo luật hiện hành?', options: ['Mua, bán dữ liệu cá nhân bị nghiêm cấm (trừ khi luật có quy định khác); tổ chức vi phạm có thể bị phạt tới 10 lần khoản thu từ hành vi đó', 'Được mua nếu chỉ dùng nội bộ', 'Được mua nếu data đã cũ trên 1 năm', 'Chỉ cấm bán, người mua không vi phạm'], answer: 0, why: 'Luật cấm cả mua lẫn bán dữ liệu cá nhân; mức phạt tối đa với hành vi mua bán là 10 lần khoản thu (cá nhân tối đa bằng một nửa tổ chức).', ref: 'Khoản 6 Điều 7 và khoản 3, 6 Điều 8 Luật Bảo vệ dữ liệu cá nhân 2025 (91/2025/QH15)' },
{ q: 'Khách từng đồng ý nhận tin, nay nhắn "đừng gửi cho anh nữa". Sale nên làm gì?', options: ['Tiếp tục gửi vì khách đã đồng ý trước đó', 'Dừng gửi tin và ghi nhận khách rút lại đồng ý trong hồ sơ', 'Chuyển số cho đồng nghiệp gửi thay', 'Gửi thêm một tin cuối giới thiệu dự án'], answer: 1, why: 'Chủ thể dữ liệu có quyền rút lại sự đồng ý; từ lúc đó phải dừng xử lý cho mục đích gửi tin.', ref: 'Điểm b khoản 1 Điều 4 Luật Bảo vệ dữ liệu cá nhân 2025 (91/2025/QH15)' },
],
};
export const META = {
l01: { group: 'marketing', level: 1 },
l02: { group: 'tuvan', level: 1 },
l03: { group: 'tuvan', level: 1 },
l04: { group: 'tuchoi', level: 1 },
l05: { group: 'tuchoi', level: 1 },
l06: { group: 'phaply', level: 1 },
l07: { group: 'taichinh', level: 1 },
l08: { group: 'marketing', level: 1 },
l09: { group: 'marketing', level: 1 },
l10: { group: 'phaply', level: 1 },
};

export const NOTE = 'Điểm luyện tập – dùng để tự rèn, không dùng đánh giá nhân sự.';
export const PERSONAS = [
{ id: 'dautu', name: 'Chị Hạnh – nhà đầu tư kỹ tính', avatar: '👩‍💼', level: 'Khó',
brief: 'Đã có 2 căn cho thuê. So giá từng m², đòi chiết khấu, hỏi lợi suất cho thuê thực tế.',
hidden: ['Lo căn khó cho thuê vì nguồn cung khu này nhiều', 'Muốn dòng tiền thuê đủ trả lãi vay', 'Ghét môi giới hứa hẹn tăng giá'],
opening: 'Chào em. Chị xem bảng giá rồi, đắt hơn dự án bên cạnh gần 10%. Em nói chị nghe xem vì sao chị phải mua bên này?',
lines: {
price: ['Em cứ nói giá trị, nhưng chị cần con số. Cho thuê được bao nhiêu một tháng, có ví dụ căn nào đang cho thuê không?', 'Chiết khấu thêm được bao nhiêu? Bên kia họ giảm cho chị rồi.'],
question: ['Chị mua để cho thuê, giữ khoảng 5 năm. Quan trọng nhất là có người thuê ngay khi nhận nhà.', 'Chị vay khoảng một nửa. Tiền thuê mà không đủ trả lãi thì chị không mua.'],
promise: ['Em nói chắc chắn tăng giá à? Ai dám chắc? Chị không thích nghe kiểu đó.'],
evidence: ['Ừ, có số liệu như vậy thì chị dễ so sánh hơn. Thế tiến độ thanh toán thế nào?'],
empathy: ['Đúng, chị sợ nhất là để trống căn vài tháng.'],
close: ['Được, em gửi chị bảng dòng tiền và vài căn đang cho thuê thực tế, tối mai mình nói tiếp.'],
generic: ['Em nói rõ hơn được không?', 'Chị vẫn chưa thấy khác bên kia ở điểm nào.'],
} },
{ id: 'vay', name: 'Anh Tuấn – mua ở lần đầu, sợ vay', avatar: '👨', level: 'Vừa',
brief: 'Vợ chồng trẻ, có con nhỏ, thu nhập ổn định nhưng chưa từng vay ngân hàng. Rất sợ lãi thả nổi.',
hidden: ['Vợ chưa đồng ý vì sợ áp lực trả nợ', 'Muốn gần trường mầm non', 'Có sẵn khoảng 30% giá căn'],
opening: 'Anh thích căn này nhưng nghe nói hết ưu đãi lãi lên cao lắm. Anh sợ không trả nổi em ạ.',
lines: {
price: ['Giá thì anh tạm chấp nhận, anh lo nhất là tiền trả mỗi tháng thôi.'],
question: ['Nhà anh hai vợ chồng với một bé 3 tuổi. Anh có sẵn khoảng 30%, còn lại phải vay.', 'Vợ anh chưa yên tâm, cô ấy sợ nợ lâu.'],
promise: ['Em đừng nói lãi không tăng, anh đọc báo thấy tăng mà.'],
evidence: ['À, nếu lãi tăng thêm như vậy thì mỗi tháng trả từng đó… anh cần tính lại với vợ.'],
empathy: ['Đúng rồi em, anh chưa vay bao giờ nên lo.'],
close: ['Cuối tuần này hai vợ chồng anh qua xem nhà mẫu được không? Em chuẩn bị bảng tính giúp anh.'],
generic: ['Anh chưa hiểu lắm, em giải thích đơn giản giúp anh.', 'Thế nếu anh mất việc thì sao?'],
} },
{ id: 'phaply', name: 'Cô Lan – lớn tuổi, nghi ngờ pháp lý', avatar: '👵', level: 'Khó',
brief: 'Mua cho con, từng mất tiền cọc ở một dự án chậm tiến độ. Hỏi sổ hồng, bảo lãnh, ai chịu trách nhiệm.',
hidden: ['Từng mất cọc nên rất dè chừng', 'Con trai là người quyết định cuối', 'Muốn được xem giấy tờ tận mắt'],
opening: 'Cô hỏi thật nhé, dự án này đã có sổ chưa? Cô từng mất tiền cọc rồi nên giờ cô không tin lời nói đâu.',
lines: {
price: ['Giá thì để sau, cô cần biết giấy tờ trước đã.'],
question: ['Cô mua cho con trai cô ở, nó làm gần đây. Nhưng nó bảo cô tìm hiểu trước.', 'Lần trước cô đặt cọc dự án khác, chậm mấy năm không giao nhà.'],
promise: ['Cháu hứa chắc chắn có sổ năm sau à? Lần trước người ta cũng hứa với cô như thế.'],
evidence: ['Có văn bản thì cháu gửi cô xem, cô đưa con cô đọc.'],
empathy: ['Ừ, cô mất tiền một lần rồi nên cô sợ.'],
close: ['Thứ Bảy cháu mang giấy tờ ra văn phòng cho cô và con cô xem nhé.'],
generic: ['Cháu nói thế cô chưa yên tâm.', 'Thế nếu chủ đầu tư chậm thì ai chịu?'],
} },
{ id: 'banron', name: 'Anh Minh – bận rộn, trả lời cụt', avatar: '🧑‍💻', level: 'Vừa',
brief: 'Giám đốc công ty nhỏ, ít thời gian, trả lời ngắn, dễ cúp máy nếu bị nói dài.',
hidden: ['Đang cân nhắc mua căn lớn để bố mẹ ở cùng', 'Thích được gửi thông tin gọn qua Zalo', 'Quyết nhanh nếu thấy hợp'],
opening: 'Ừ, anh đây. Anh đang họp, em nói nhanh.',
lines: {
price: ['Giá bao nhiêu, nói một con số thôi.'],
question: ['Căn 3 phòng ngủ, có bố mẹ ở cùng.', 'Gần trung tâm, đi làm dưới 30 phút.'],
promise: ['Thôi, đừng quảng cáo.'],
evidence: ['Ok, gửi anh qua Zalo.'],
empathy: ['Ừ.'],
close: ['Tối nay 9 giờ gọi lại anh.'],
generic: ['Ngắn thôi em.', 'Ý chính là gì?'],
long: ['Dài quá, em gửi Zalo đi, anh đọc sau.'],
} },
{ id: 'doithu', name: 'Chị Vy – đang được sàn khác chào', avatar: '👩', level: 'Khó',
brief: 'Đang làm việc với một sàn khác chào chiết khấu cao hơn. Muốn xem mình được lợi gì khi mua qua anh/chị.',
hidden: ['Không chắc sàn kia nói thật', 'Muốn người chăm sóc lâu dài sau mua', 'Cần hỗ trợ thủ tục vay'],
opening: 'Bên sàn kia báo chị chiết khấu cao hơn em 2%. Em có làm được như vậy không?',
lines: {
price: ['Thế em giảm được bao nhiêu? Không thì chị mua bên kia.'],
question: ['Chị mua để ở, cần vay ngân hàng, mà chị cũng bận nên muốn người lo giấy tờ giúp.', 'Chị không rõ chiết khấu bên kia đã gồm những gì.'],
promise: ['Em nói bên kia lừa đảo à? Chị không thích nghe chê người khác.'],
evidence: ['Nếu em so được từng khoản như thế thì chị dễ quyết hơn.'],
empathy: ['Đúng, chị cũng không chắc bên kia nói thật hay không.'],
close: ['Em gửi chị bảng so sánh, chiều mai chị trả lời em.'],
generic: ['Em nói gì khác bên kia không?', 'Chị cần lý do cụ thể.'],
} },
];
export const RUBRIC = [
{ id: 'modau', label: 'Mở đầu, tạo thiện cảm', max: 10 },
{ id: 'khampha', label: 'Hỏi khám phá nhu cầu', max: 20 },
{ id: 'langnghe', label: 'Lắng nghe, nhắc lại ý khách', max: 15 },
{ id: 'tuchoi', label: 'Xử lý băn khoăn / từ chối', max: 20 },
{ id: 'chinhxac', label: 'Thông tin đúng, không hứa sai', max: 15 },
{ id: 'chot', label: 'Chốt bước tiếp theo cụ thể', max: 15 },
{ id: 'thaido', label: 'Thái độ, ngôn ngữ lịch sự', max: 5 },
];
const fold = (_op) => String(_op || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
const esc = (w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const has = (_op, list) => { const _od = ' ' + fold(_op) + ' '; return list.some((w) => new RegExp('(^|[^a-z0-9])' + esc(fold(w).trim()) + '(?=[^a-z0-9]|$)').test(_od)); };
const _o5 = ['gì', 'sao', 'nào', 'bao nhiêu', 'thế nào', 'khi nào', 'ở đâu', 'vì sao', 'tại sao', 'như thế nào'];
export const PROMISE_WORDS = ['chắc chắn tăng', 'cam kết lợi nhuận', 'cam kết lãi', 'lợi nhuận chắc', 'không bao giờ giảm', 'chắc chắn có sổ', 'đảm bảo 100%', 'chắc chắn lãi', 'lãi không tăng', 'không rủi ro', 'lừa đảo', 'không uy tín'];
const _o1 = ['em hiểu', 'đúng là', 'hoàn toàn hợp lý', 'cân nhắc là đúng', 'em rất hiểu', 'lo lắng là', 'chính đáng', 'cảm ơn anh', 'cảm ơn chị', 'cảm ơn cô'];
const _o6 = ['nếu em hiểu đúng', 'tức là', 'như anh nói', 'như chị nói', 'như cô nói', 'anh vừa nói', 'chị vừa nói', 'cô vừa nói', 'đúng không ạ', 'có phải'];
const _o0 = ['hẹn', 'xem nhà', 'gửi báo giá', 'gửi bảng', 'gọi lại', 'qua văn phòng', 'nhà mẫu', 'gửi anh', 'gửi chị', 'gửi cô'];
const _o8 = ['thứ', 'giờ', 'mai', 'cuối tuần', 'tối nay', 'chiều nay', 'sáng mai', 'chủ nhật', 'trước 5'];
const _o4 = ['dạ', 'ạ', 'anh', 'chị', 'cô', 'em'];
const _o7 = ['ngu', 'điên', 'vớ vẩn', 'thích thì mua', 'không mua thì thôi', 'mày', 'tao'];
const _o3 = ['chào', 'xin phép', 'em là', 'em tên'];
const _o2 = /\d|văn bản|quyết định|hợp đồng|bảng tính|bảng dòng tiền|báo giá|giấy phép|bảo lãnh|ví dụ/i;
export function classify(text, persona) {
const t = String(text || '');
if (has(t, PROMISE_WORDS)) return 'promise';
if (persona && persona.lines.long && t.length > 320) return 'long';
if (has(t, _o0) && has(t, _o8)) return 'close';
if (_o2.test(t) && t.length > 25) return 'evidence';
if (has(t, _o1)) return 'empathy';
if (t.includes('?') || has(t, _o5)) return 'question';
if (has(t, ['giá', 'chiết khấu', 'giảm'])) return 'price';
return 'generic';
}
export function scriptedReply(persona, history) {
const _oq = history.filter((_oh) => _oh.role === 'sale');
const _og = _oq[_oq.length - 1];
const kind = classify(_og ? _og.text : '', persona);
const _oj = persona.lines[kind] || persona.lines.generic;
const _or = history.filter((_oh) => _oh.role === 'customer' && _oh.kind === kind).length;
return { text: _oj[_or % _oj.length], kind, end: kind === 'close' };
}
export function personaPrompt(persona, history) {
const conv = history.map((_oh) => (_oh.role === 'sale' ? 'MÔI GIỚI: ' : 'KHÁCH: ') + _oh.text).join('\n');
return [
'Bạn đóng vai một KHÁCH HÀNG mua bất động sản ở Việt Nam để môi giới luyện tập tư vấn. Không bao giờ thoát vai, không nhận mình là AI.',
`Nhân vật: ${persona.name}. ${persona.brief}`,
`Điều bạn đang giấu, chỉ nói ra khi môi giới hỏi khéo hoặc lắng nghe tốt: ${persona.hidden.join('; ')}.`,
'Cách trả lời: tiếng Việt đời thường, 1–3 câu, đúng tính cách. Nếu môi giới hứa hẹn lợi nhuận, nói sai về pháp lý hoặc chê đối thủ: phản ứng nghi ngờ. Nếu môi giới hẹn được bước tiếp theo cụ thể và hợp lý: đồng ý và kết thúc bằng ký hiệu [KẾT THÚC].',
'Hội thoại tới giờ:', conv, 'KHÁCH:',
].join('\n');
}
export function gradePrompt(persona, history) {
const conv = history.map((_oh) => (_oh.role === 'sale' ? 'MÔI GIỚI: ' : 'KHÁCH: ') + _oh.text).join('\n');
return [
'Bạn là huấn luyện viên bán hàng bất động sản. Chấm điểm phần của MÔI GIỚI trong hội thoại luyện tập dưới đây.',
`Khách: ${persona.name}. ${persona.brief}`,
'Thang điểm (điểm tối đa): ' + RUBRIC.map((_om) => `${_om.id}=${_om.label} (${_om.max})`).join('; ') + '.',
'Trừ điểm "chinhxac" nặng nếu môi giới hứa lợi nhuận, cam kết tăng giá, nói chắc về pháp lý không có văn bản hoặc chê đối thủ.',
'Chỉ trả về JSON đúng dạng: {"scores":{"modau":n,"khampha":n,"langnghe":n,"tuchoi":n,"chinhxac":n,"chot":n,"thaido":n},"strengths":["..."],"improve":["..."],"better_lines":["câu nói mẫu tốt hơn"]}',
'Hội thoại:', conv,
].join('\n');
}
export function localScore(history) {
const _oq = history.filter((_oh) => _oh.role === 'sale').map((_oh) => _oh.text || '');
const _o9 = _oq.join('\n');
const S = {}, N = {}, flags = [];
const _oe = _oq[0] || '';
S.modau = Math.min(10, (has(_oe, _o3) ? 5 : 0) + (has(_oe, _o4) ? 3 : 0) + (_oe.length > 15 && _oe.length < 260 ? 2 : 0));
N.modau = has(_oe, _o3) ? 'Có chào, giới thiệu.' : 'Câu đầu nên chào và nêu lý do liên hệ.';
const _ol = _oq.filter((_op) => _op.includes('?') || has(_op, _o5)).length;
S.khampha = Math.min(20, _ol * 6);
N.khampha = _ol ? `${_ol} lượt có câu hỏi.` : 'Chưa hỏi để hiểu nhu cầu.';
const _on = _oq.filter((_op) => has(_op, _o6)).length;
S.langnghe = Math.min(15, _on * 8 + (_oq.length >= 3 ? 3 : 0));
N.langnghe = _on ? 'Có nhắc lại ý khách.' : 'Thử nhắc lại ý khách: "Nếu em hiểu đúng thì…".';
const _oc = _oq.filter((_op) => has(_op, _o1)).length, ev = _oq.filter((_op) => _o2.test(_op)).length;
S.tuchoi = Math.min(20, _oc * 6 + ev * 5);
N.tuchoi = _oc || ev ? 'Có ghi nhận / đưa dẫn chứng.' : 'Khi khách băn khoăn: ghi nhận rồi đưa số liệu, văn bản.';
const _ok = PROMISE_WORDS.filter((w) => has(_o9, [w]));
S.chinhxac = _ok.length ? Math.max(0, 15 - _ok.length * 8) : 15;
N.chinhxac = _ok.length ? 'Tránh: ' + _ok.map((p) => '"' + p + '"').join(', ') : 'Không thấy hứa hẹn sai.';
if (_ok.length) flags.push('Có câu hứa hẹn / nói quá: ' + _ok.join(', '));
const _ob = _oq.some((_op) => has(_op, _o0) && has(_op, _o8)), closedSoft = _oq.some((_op) => has(_op, _o0));
S.chot = _ob ? 15 : closedSoft ? 8 : 0;
N.chot = _ob ? 'Có hẹn bước tiếp theo kèm thời gian.' : closedSoft ? 'Có đề nghị bước tiếp theo nhưng chưa có thời gian cụ thể.' : 'Chưa chốt bước tiếp theo.';
const _oo = _o7.filter((w) => has(_o9, [w]));
const _oi = _oq.length ? _oq.filter((_op) => has(_op, ['dạ', 'ạ'])).length / _oq.length : 0;
S.thaido = _oo.length ? 0 : Math.min(5, Math.round(2 + _oi * 3));
N.thaido = _oo.length ? 'Có từ ngữ không phù hợp.' : 'Lịch sự.';
if (_oo.length) flags.push('Từ ngữ không phù hợp: ' + _oo.join(', '));
const total = RUBRIC.reduce((t, _om) => t + Math.min(_om.max, S[_om.id] || 0), 0);
const strengths = RUBRIC.filter((_om) => (S[_om.id] || 0) >= _om.max * 0.7).map((_om) => _om.label);
const improve = RUBRIC.filter((_om) => (S[_om.id] || 0) < _om.max * 0.5).map((_om) => _om.label + ': ' + N[_om.id]);
return { total, scores: S, notes: N, flags, strengths, improve, by: 'local' };
}
export function parseAiGrade(text) {
const _op = String(text || '');
const _oh = _op.match(/\{[\s\S]*\}/);
if (!_oh) return null;
let _of; try { _of = JSON.parse(_oh[0]); } catch { return null; }
if (!_of || typeof _of !== 'object' || !_of.scores || typeof _of.scores !== 'object') return null;
const scores = {};
for (const _om of RUBRIC) {
const _os = Number(_of.scores[_om.id]);
if (!Number.isFinite(_os)) return null;
scores[_om.id] = Math.max(0, Math.min(_om.max, Math.round(_os)));
}
const _oa = (x) => (Array.isArray(x) ? x.map(String).filter(Boolean).slice(0, 6) : []);
return { total: RUBRIC.reduce((t, _om) => t + scores[_om.id], 0), scores, strengths: _oa(_of.strengths), improve: _oa(_of.improve), better: _oa(_of.better_lines), by: 'ai' };
}
export const gradeLabel = (total) => (total >= 85 ? 'Xuất sắc' : total >= 70 ? 'Tốt' : total >= 50 ? 'Khá – cần luyện thêm' : 'Cần luyện nhiều');
export const isEnd = (text) => /\[KẾT THÚC\]/i.test(String(text || ''));
export const stripEnd = (text) => String(text || '').replace(/\[KẾT THÚC\]/gi, '').trim();

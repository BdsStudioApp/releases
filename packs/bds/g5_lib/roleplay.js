import { withRules, withRulesJson } from '../../../shared/ai_rules.js';
export const NOTE = 'Điểm luyện tập – dùng để tự rèn, không dùng đánh giá nhân sự.';
export const PERSONAS = [
{ id: 'dautu', name: 'Chị Hạnh – nhà đầu tư kỹ tính', avatar: '👩‍💼', level: 'Khó',
brief: 'Đã có 2 căn cho thuê. So giá từng m², đòi chiết khấu, hỏi lợi suất cho thuê thực tế.',
hidden: ['Lo căn khó cho thuê vì nguồn cung khu này nhiều', 'Muốn dòng tiền thuê đủ trả lãi vay', 'Ghét môi giới hứa hẹn tăng giá'],
opening: 'Chào em. Chị xem bảng giá rồi, đắt hơn dự án bên cạnh gần 10%. Em nói chị nghe xem vì sao chị phải mua bên này?',
alt: ['Em ơi, chị đang so ba dự án, bên này lợi suất cho thuê được bao nhiêu? Nói số cho chị.', 'Chị có tiền nhưng chị không vội. Em cho chị một lý do để chị không mua bên cạnh đi.'],
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
alt: ['Vợ anh bảo đi thuê tiếp cho nhẹ đầu, anh thì muốn mua. Em tư vấn sao cho anh nói chuyện với vợ được?', 'Anh có khoảng 30%, còn lại vay. Lỡ mấy năm nữa lãi tăng thì anh xoay sao em?'],
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
alt: ['Cháu cho cô hỏi, ngân hàng nào bảo lãnh dự án này? Cô muốn xem giấy tận mắt.', 'Con cô bảo cô hỏi kỹ pháp lý rồi mới bàn tiếp. Cháu nói cô nghe xem nào.'],
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
alt: ['Anh có 2 phút thôi, có căn 3 phòng ngủ nào hợp không?', 'Em gửi Zalo rồi à? Anh chưa đọc. Tóm tắt đi.'],
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
alt: ['Chị đã cọc giữ chỗ bên sàn khác rồi, em có gì tốt hơn không?', 'Bên kia tặng chị gói nội thất, bên em có gì?'],
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
const fold = (_or) => String(_or || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
const esc = (_ov) => _ov.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const has = (_or, list) => { const _od = ' ' + fold(_or) + ' '; return list.some((_ov) => new RegExp('(^|[^a-z0-9])' + esc(fold(_ov).trim()) + '(?=[^a-z0-9]|$)').test(_od)); };
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
export function scriptedReply(persona, history, rnd = Math.random) {
const _ot = history.filter((_oh) => _oh.role === 'sale');
const _og = _ot[_ot.length - 1];
const kind = classify(_og ? _og.text : '', persona);
const _ol = persona.lines[kind] || persona.lines.generic;
const _os = new Set(history.filter((_oh) => _oh.role === 'customer').map((_oh) => _oh.text));
const fresh = _ol.filter((t) => !_os.has(t));
const from = fresh.length ? fresh : _ol;
return { text: from[Math.floor(rnd() * from.length) % from.length], kind, end: kind === 'close' };
}
const _oj = (_oa, rnd) => _oa[Math.floor(rnd() * _oa.length) % _oa.length];
export const SEEDS = {
who: [['Anh Dũng', '👨', 'anh', 'kỹ sư 34 tuổi'], ['Chị Thu', '👩', 'chị', 'kế toán 31 tuổi, có 2 con nhỏ'], ['Chú Bình', '👴', 'chú', 'cán bộ sắp nghỉ hưu'],
['Chị Ngọc', '👩‍💼', 'chị', 'chủ cửa hàng mỹ phẩm'], ['Anh Khoa', '🧑‍💻', 'anh', 'lập trình viên 28 tuổi, mới cưới'], ['Cô Hoa', '👵', 'cô', 'giáo viên về hưu'],
['Anh Sơn', '👨‍💼', 'anh', 'trưởng phòng kinh doanh, hay đi công tác'], ['Chị Mai', '👩', 'chị', 'bác sĩ, đi làm ca'], ['Anh Hùng', '🧔', 'anh', 'chủ xưởng in nhỏ']],
goal: ['mua để ở lần đầu', 'mua cho bố mẹ ở gần', 'mua cho thuê lấy dòng tiền', 'mua giữ tài sản 5–7 năm', 'đổi từ căn nhỏ lên căn rộng hơn', 'mua cho con sắp lấy vợ'],
area: ['Cầu Giấy', 'Nam Từ Liêm', 'Hà Đông', 'Long Biên', 'Gia Lâm', 'Hoàng Mai', 'Tây Hồ', 'Đông Anh', 'Thanh Xuân'],
product: ['chung cư 2 phòng ngủ', 'chung cư 3 phòng ngủ', 'nhà phố liền kề', 'căn studio cho thuê', 'chung cư tầng cao view hồ'],
worry: [
['giá', 'Thấy giá đắt hơn chỗ khác, muốn biết vì sao đáng tiền', 'Giá thế này anh thấy đắt so với mặt bằng chung.', 'Có chỗ khác rẻ hơn mà em.'],
['vay', 'Sợ lãi suất thả nổi sau ưu đãi, chưa vay bao giờ', 'Hết ưu đãi lãi lên thì trả thế nào em?', 'Mỗi tháng phải trả bao nhiêu, em tính được không?'],
['phaply', 'Nghi ngờ pháp lý, sổ hồng, tiến độ chủ đầu tư', 'Dự án này pháp lý đến đâu rồi em?', 'Chủ đầu tư này từng chậm tiến độ không?'],
['vitri', 'Ngại xa, tắc đường giờ cao điểm', 'Từ đây đi làm giờ cao điểm mất bao lâu?', 'Xa trung tâm thế này sau khó bán lại không?'],
['giadinh', 'Vợ/chồng hoặc bố mẹ chưa đồng ý', 'Nhà anh còn phải bàn thêm, chưa thống nhất được.', 'Bố mẹ anh muốn nhà đất hơn là chung cư.'],
['doi', 'Muốn đợi giá giảm, sợ mua đỉnh', 'Anh nghe nói sắp tới giá còn giảm.', 'Mua lúc này có phải mua đỉnh không em?'],
['doithu', 'Đang được môi giới khác chào ưu đãi', 'Bên khác chào anh chiết khấu tốt hơn.', 'Mua qua em thì anh được gì hơn?'],
['chothue', 'Lo khó cho thuê, nguồn cung nhiều', 'Khu này nhiều căn cho thuê quá, có ai thuê không?', 'Thuê được bao nhiêu, có số thật không?'],
],
mood: ['vội, trả lời ngắn', 'cởi mở nhưng hay hỏi lại', 'đa nghi, hay vặn lại', 'lịch sự nhưng khó chốt', 'thích số liệu cụ thể', 'hay so sánh với nơi khác'],
};
export function randomSeed(rnd = Math.random) {
const _ov = _oj(SEEDS.who, rnd), worry = _oj(SEEDS.worry, rnd);
let worry2 = _oj(SEEDS.worry, rnd);
if (worry2[0] === worry[0]) worry2 = SEEDS.worry[(SEEDS.worry.indexOf(worry) + 1) % SEEDS.worry.length];
return { name: _ov[0], avatar: _ov[1], xung: _ov[2], job: _ov[3], goal: _oj(SEEDS.goal, rnd), area: _oj(SEEDS.area, rnd), product: _oj(SEEDS.product, rnd), worry, worry2, mood: _oj(SEEDS.mood, rnd) };
}
export function localPersona(seed) {
const _ow = seed.xung, em = _ow === 'anh' || _ow === 'chị' ? 'em' : 'cháu';
const X = _ow[0].toUpperCase() + _ow.slice(1), fix = (t) => String(t).replace(/\b([Aa])nh\b/g, (_, a) => (a === 'A' ? X : _ow)).replace(/\bem\b/g, em);
const [, w1, o1, o2] = seed.worry, [, w2, q1, q2] = seed.worry2;
return {
id: 'rand', name: `${seed.name} – ${seed.goal}`, avatar: seed.avatar, level: /đa nghi|khó chốt/.test(seed.mood) ? 'Khó' : 'Vừa', random: true,
brief: `${seed.job}, ${seed.goal}, đang xem ${seed.product} khu ${seed.area}. Tính cách: ${seed.mood}. Băn khoăn chính: ${w1.toLowerCase()}.`,
hidden: [w2, `Thật ra quan tâm nhất là ${seed.goal}`, 'Sẽ quyết nhanh hơn nếu được gửi thông tin gọn, có số liệu kiểm được'],
opening: `Chào ${em}. ${X} đang xem ${seed.product} ở ${seed.area}. ${fix(o1)}`,
lines: {
price: [fix(o2), fix('Giá thì anh còn cân nhắc, em nói rõ hơn được không?')],
question: [`${X} ${seed.goal}. ${fix(q1)}`, fix(q2), `${X} cần chỗ đi lại tiện quanh ${seed.area}.`],
promise: [fix('Em nói chắc thế thì anh lại càng không tin.'), fix('Ai dám hứa trước được chuyện đó em?')],
evidence: [fix('Có số liệu thế thì anh dễ so hơn. Em gửi anh nhé.'), fix(q2)],
empathy: [fix('Đúng rồi, anh lo nhất chuyện đó.'), fix(q1)],
close: [fix('Được, em gửi anh thông tin rồi mình hẹn như em nói.')],
generic: [fix(o2), fix('Anh chưa hiểu lắm, em nói cụ thể hơn đi.'), fix(q1)],
},
};
}
export function newPersonaPrompt(seed) {
return withRulesJson([
'Bạn tạo một KHÁCH HÀNG ảo mua bất động sản ở Hà Nội để môi giới luyện tư vấn. Dựa đúng các đặc điểm sau, viết thêm cho sống động, khác các khách thường gặp:',
`Tên gọi: ${seed.name} (môi giới xưng em, gọi khách là "${seed.xung}"). Nghề / hoàn cảnh: ${seed.job}. Mục đích: ${seed.goal}. Đang xem: ${seed.product} khu ${seed.area}. Tính cách: ${seed.mood}.`,
`Băn khoăn nói ra ngay: ${seed.worry[1]}. Băn khoăn giấu, chỉ nói khi được hỏi khéo: ${seed.worry2[1]}.`,
'Không đưa tên dự án, giá, lãi suất cụ thể như sự thật.',
'Chỉ trả về JSON đúng dạng: {"brief":"mô tả khách 1–2 câu","hidden":["điều khách giấu 1","2","3"],"opening":"câu đầu tiên khách nói, 1–2 câu tiếng Việt đời thường"}',
].join('\n'));
}
export function parsePersona(text, seed) {
const _oh = String(text || '').match(/\{[\s\S]*\}/);
if (!_oh) return null;
let _of; try { _of = JSON.parse(_oh[0]); } catch { return null; }
const _or = (_ou, n) => String(_ou == null ? '' : _ou).replace(/\s+/g, ' ').trim().slice(0, n);
const brief = _or(_of && _of.brief, 400), opening = _or(_of && _of.opening, 300);
if (!brief || !opening) return null;
const base = localPersona(seed);
const hidden = Array.isArray(_of.hidden) ? _of.hidden.map((_ow) => _or(_ow, 200)).filter(Boolean).slice(0, 4) : [];
return { ...base, brief, opening, hidden: hidden.length ? hidden : base.hidden, by: 'ai' };
}
export function varyPersona(p, rnd = Math.random) {
const _oi = [p.opening, ...(p.alt || [])];
const extra = _oj(SEEDS.worry, rnd)[1];
return { ...p, opening: _oj(_oi, rnd), twist: { mood: _oj(SEEDS.mood, rnd), extra } };
}
export function personaPrompt(persona, history) {
const conv = history.map((_oh) => (_oh.role === 'sale' ? 'MÔI GIỚI: ' : 'KHÁCH: ') + _oh.text).join('\n');
return withRules([
'Bạn đóng vai một KHÁCH HÀNG mua bất động sản ở Việt Nam để môi giới luyện tập tư vấn. Không bao giờ thoát vai, không nhận mình là AI.',
`Nhân vật: ${persona.name}. ${persona.brief}`,
`Điều bạn đang giấu, chỉ nói ra khi môi giới hỏi khéo hoặc lắng nghe tốt: ${persona.hidden.join('; ')}.`,
persona.twist ? `Hôm nay bạn ${persona.twist.mood}; ngoài ra còn băn khoăn: ${persona.twist.extra.toLowerCase()}. Đừng lặp lại nguyên câu đã nói, mỗi lượt phản ứng theo đúng câu vừa rồi của môi giới.` : 'Đừng lặp lại nguyên câu đã nói, mỗi lượt phản ứng theo đúng câu vừa rồi của môi giới.',
'Cách trả lời: tiếng Việt đời thường, 1–3 câu, đúng tính cách. Nếu môi giới hứa hẹn lợi nhuận, nói sai về pháp lý hoặc chê đối thủ: phản ứng nghi ngờ. Nếu môi giới hẹn được bước tiếp theo cụ thể và hợp lý: đồng ý và kết thúc bằng ký hiệu [KẾT THÚC].',
'Trong vai khách: hoàn cảnh, tài chính, mong muốn của nhân vật lấy đúng như mô tả ở trên; không tự đưa giá, lãi suất, số liệu dự án như sự thật – cần thì hỏi môi giới.',
'Hội thoại tới giờ:', conv, 'KHÁCH:',
].join('\n'));
}
export function gradePrompt(persona, history) {
const conv = history.map((_oh) => (_oh.role === 'sale' ? 'MÔI GIỚI: ' : 'KHÁCH: ') + _oh.text).join('\n');
return withRulesJson([
'Bạn là huấn luyện viên bán hàng bất động sản. Chấm điểm phần của MÔI GIỚI trong hội thoại luyện tập dưới đây.',
`Khách: ${persona.name}. ${persona.brief}`,
'Thang điểm (điểm tối đa): ' + RUBRIC.map((_oo) => `${_oo.id}=${_oo.label} (${_oo.max})`).join('; ') + '.',
'Trừ điểm "chinhxac" nặng nếu môi giới hứa lợi nhuận, cam kết tăng giá, nói chắc về pháp lý không có văn bản hoặc chê đối thủ.',
'Chỉ trả về JSON đúng dạng: {"scores":{"modau":n,"khampha":n,"langnghe":n,"tuchoi":n,"chinhxac":n,"chot":n,"thaido":n},"strengths":["..."],"improve":["..."],"better_lines":["câu nói mẫu tốt hơn"]}',
'Câu nói mẫu (better_lines) không chứa số liệu, giá, lãi suất không có trong hội thoại.',
'Hội thoại:', conv,
].join('\n'));
}
export function localScore(history) {
const _ot = history.filter((_oh) => _oh.role === 'sale').map((_oh) => _oh.text || '');
const _o9 = _ot.join('\n');
const S = {}, N = {}, flags = [];
const _oe = _ot[0] || '';
S.modau = Math.min(10, (has(_oe, _o3) ? 5 : 0) + (has(_oe, _o4) ? 3 : 0) + (_oe.length > 15 && _oe.length < 260 ? 2 : 0));
N.modau = has(_oe, _o3) ? 'Có chào, giới thiệu.' : 'Câu đầu nên chào và nêu lý do liên hệ.';
const _on = _ot.filter((_or) => _or.includes('?') || has(_or, _o5)).length;
S.khampha = Math.min(20, _on * 6);
N.khampha = _on ? `${_on} lượt có câu hỏi.` : 'Chưa hỏi để hiểu nhu cầu.';
const _op = _ot.filter((_or) => has(_or, _o6)).length;
S.langnghe = Math.min(15, _op * 8 + (_ot.length >= 3 ? 3 : 0));
N.langnghe = _op ? 'Có nhắc lại ý khách.' : 'Thử nhắc lại ý khách: "Nếu em hiểu đúng thì…".';
const _oc = _ot.filter((_or) => has(_or, _o1)).length, ev = _ot.filter((_or) => _o2.test(_or)).length;
S.tuchoi = Math.min(20, _oc * 6 + ev * 5);
N.tuchoi = _oc || ev ? 'Có ghi nhận / đưa dẫn chứng.' : 'Khi khách băn khoăn: ghi nhận rồi đưa số liệu, văn bản.';
const _om = PROMISE_WORDS.filter((_ov) => has(_o9, [_ov]));
S.chinhxac = _om.length ? Math.max(0, 15 - _om.length * 8) : 15;
N.chinhxac = _om.length ? 'Tránh: ' + _om.map((p) => '"' + p + '"').join(', ') : 'Không thấy hứa hẹn sai.';
if (_om.length) flags.push('Có câu hứa hẹn / nói quá: ' + _om.join(', '));
const _ob = _ot.some((_or) => has(_or, _o0) && has(_or, _o8)), closedSoft = _ot.some((_or) => has(_or, _o0));
S.chot = _ob ? 15 : closedSoft ? 8 : 0;
N.chot = _ob ? 'Có hẹn bước tiếp theo kèm thời gian.' : closedSoft ? 'Có đề nghị bước tiếp theo nhưng chưa có thời gian cụ thể.' : 'Chưa chốt bước tiếp theo.';
const _oq = _o7.filter((_ov) => has(_o9, [_ov]));
const _ok = _ot.length ? _ot.filter((_or) => has(_or, ['dạ', 'ạ'])).length / _ot.length : 0;
S.thaido = _oq.length ? 0 : Math.min(5, Math.round(2 + _ok * 3));
N.thaido = _oq.length ? 'Có từ ngữ không phù hợp.' : 'Lịch sự.';
if (_oq.length) flags.push('Từ ngữ không phù hợp: ' + _oq.join(', '));
const total = RUBRIC.reduce((t, _oo) => t + Math.min(_oo.max, S[_oo.id] || 0), 0);
const strengths = RUBRIC.filter((_oo) => (S[_oo.id] || 0) >= _oo.max * 0.7).map((_oo) => _oo.label);
const improve = RUBRIC.filter((_oo) => (S[_oo.id] || 0) < _oo.max * 0.5).map((_oo) => _oo.label + ': ' + N[_oo.id]);
return { total, scores: S, notes: N, flags, strengths, improve, by: 'local' };
}
export function parseAiGrade(text) {
const _or = String(text || '');
const _oh = _or.match(/\{[\s\S]*\}/);
if (!_oh) return null;
let _of; try { _of = JSON.parse(_oh[0]); } catch { return null; }
if (!_of || typeof _of !== 'object' || !_of.scores || typeof _of.scores !== 'object') return null;
const scores = {};
for (const _oo of RUBRIC) {
const _ou = Number(_of.scores[_oo.id]);
if (!Number.isFinite(_ou)) return null;
scores[_oo.id] = Math.max(0, Math.min(_oo.max, Math.round(_ou)));
}
const _oa = (_ow) => (Array.isArray(_ow) ? _ow.map(String).filter(Boolean).slice(0, 6) : []);
return { total: RUBRIC.reduce((t, _oo) => t + scores[_oo.id], 0), scores, strengths: _oa(_of.strengths), improve: _oa(_of.improve), better: _oa(_of.better_lines), by: 'ai' };
}
export const gradeLabel = (total) => (total >= 85 ? 'Xuất sắc' : total >= 70 ? 'Tốt' : total >= 50 ? 'Khá – cần luyện thêm' : 'Cần luyện nhiều');
export const isEnd = (text) => /\[KẾT THÚC\]/i.test(String(text || ''));
export const stripEnd = (text) => String(text || '').replace(/\[KẾT THÚC\]/gi, '').trim();

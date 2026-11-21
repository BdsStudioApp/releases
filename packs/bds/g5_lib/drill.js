import { withRulesJson } from '../../../shared/ai_rules.js';
import { BOX_DAYS, ymd } from './lessons.js';
const DAY = 86400000;
export const SET_SIZE = 8;
export const MAX_KEEP = 160;
export const PREFIX = 'd:';
export const TOPICS = [
'giá cao hơn dự án bên cạnh', 'đợi giá giảm rồi mới mua', 'sợ lãi suất vay thả nổi sau ưu đãi', 'pháp lý, sổ hồng, bảo lãnh ngân hàng',
'chủ đầu tư chậm tiến độ', 'để anh/chị bàn với vợ/chồng, bố mẹ', 'vị trí xa trung tâm, tắc đường giờ cao điểm', 'phí dịch vụ, phí gửi xe cao',
'lợi suất cho thuê thực tế', 'chung cư lâu năm xuống cấp, sở hữu có thời hạn', 'so sánh chung cư với nhà phố, đất nền', 'sàn khác chào chiết khấu cao hơn',
'phong thuỷ, hướng nhà, tầng hợp tuổi', 'mật độ dân cư cao, thang máy chờ lâu', 'trường học, bệnh viện quanh dự án', 'khách hỏi giá rồi im lặng',
'khách đòi xem căn thực tế khi dự án mới xây', 'tiến độ thanh toán, cần bao nhiêu tiền mặt ban đầu', 'quy hoạch đường, metro gần dự án', 'khách đã có nhà, mua thêm để đầu tư',
];
export const BANK = [
{ id: 'b01', say: 'Giá bên này đắt hơn dự án bên cạnh gần 10% đấy em.', ctx: 'Khách đầu tư, đã đi xem 3 dự án.',
options: ['Dạ bên kia chất lượng kém lắm chị ạ.', 'Dạ chị so kỹ là đúng. Chị cho em biết chị so theo giá m² thông thuỷ hay tim tường, và bàn giao gồm những gì, để em lập bảng so từng khoản giúp chị ạ?', 'Dạ giá này là rẻ nhất khu rồi chị.', 'Dạ em giảm được cho chị, chị cọc luôn hôm nay nhé.'],
answer: 1, why: 'Ghi nhận rồi so đúng cách tính (thông thuỷ / tim tường, bàn giao) – không chê đối thủ, không hứa giảm khi chưa có chính sách.', model: 'Dạ chị so kỹ là đúng ạ. Em gửi chị bảng so 2 dự án theo cùng cách tính diện tích và gói bàn giao, chị xem chênh thật là bao nhiêu nhé.' },
{ id: 'b02', say: 'Anh/chị đợi cuối năm giá giảm rồi mới mua.', ctx: 'Khách mua ở, đang thuê nhà ở Cầu Giấy.',
options: ['Dạ giá chỉ có tăng thôi anh/chị ạ, không bao giờ giảm.', 'Dạ vâng, khi nào anh/chị mua thì gọi em.', 'Dạ anh/chị cân nhắc là hợp lý. Mỗi tháng anh/chị đang thuê khoảng bao nhiêu ạ? Em tính giúp anh/chị tiền thuê trong thời gian chờ so với mức giá có thể thay đổi để anh/chị dễ quyết.', 'Dạ anh/chị không mua thì người khác mua mất.'],
answer: 2, why: 'Không khẳng định giá chắc tăng; đưa khách về con số của chính khách (tiền thuê, thời gian chờ).', model: 'Dạ anh/chị muốn mua đúng thời điểm là hợp lý. Em làm bảng so: chờ 6 tháng anh/chị trả thuê bao nhiêu, và giá căn tương tự 6 tháng qua thay đổi thế nào, anh/chị xem rồi mình bàn tiếp ạ.' },
{ id: 'b03', say: 'Hết ưu đãi lãi lên cao thì anh/chị trả không nổi.', ctx: 'Vợ chồng trẻ, lần đầu vay.',
options: ['Dạ lãi không tăng đâu anh/chị.', 'Dạ em hiểu anh/chị lo. Mình thử tính khoản trả mỗi tháng khi lãi tăng thêm 2–3% so với hiện tại, nếu vẫn dưới khoảng 40% thu nhập hai vợ chồng thì anh/chị yên tâm hơn ạ.', 'Dạ anh/chị vay ít thôi là được.', 'Dạ ngân hàng nào cũng thế cả anh/chị.'],
answer: 1, why: 'Không hứa lãi không tăng; tính kịch bản lãi tăng theo thu nhập thật của khách.', model: 'Dạ em gửi anh/chị bảng tính trả nợ theo 3 mức lãi: hiện tại, cộng 2% và cộng 3%. Anh chị xem mức nào vẫn thoải mái rồi chọn số tiền vay ạ.' },
{ id: 'b04', say: 'Dự án này đã có sổ chưa em? Cô từng mất cọc rồi.', ctx: 'Khách lớn tuổi, mua cho con.',
options: ['Dạ chắc chắn năm sau có sổ cô ạ.', 'Dạ cô yên tâm, bên cháu uy tín lắm.', 'Dạ cô cẩn thận là đúng ạ. Cháu gửi cô văn bản đủ điều kiện bán và bảo lãnh ngân hàng, hẹn cô và anh/chị nhà qua văn phòng xem bản gốc nhé.', 'Dạ dự án nào bây giờ cũng chưa có sổ cô ạ.'],
answer: 2, why: 'Đưa giấy tờ thật và hẹn xem bản gốc, không hứa mốc ra sổ.', model: 'Dạ cô từng mất cọc nên lo là chính đáng. Cháu mang văn bản gốc ra văn phòng, cô và anh/chị nhà xem tận mắt rồi mình mới bàn tiếp ạ.' },
{ id: 'b05', say: 'Để anh/chị về bàn với vợ đã.', ctx: 'Khách đã xem nhà mẫu, có vẻ thích.',
options: ['Dạ vâng ạ. Chị nhà hay quan tâm điều gì nhất ạ? Em gửi anh/chị 1 trang tóm tắt đúng mấy điểm đó, và hẹn cả hai anh chị xem nhà mẫu cuối tuần này được không ạ?', 'Dạ quyết nhanh đi anh/chị, sắp hết căn rồi.', 'Dạ vâng, anh/chị bàn xong báo em.', 'Dạ chị nhà chắc cũng đồng ý thôi anh/chị.'],
answer: 0, why: 'Tôn trọng người cùng quyết định, hỏi họ quan tâm gì và chốt hẹn cụ thể có cả hai vợ chồng.', model: 'Dạ việc lớn thì anh chị cùng quyết là đúng. Em gửi anh/chị bản tóm tắt dễ đọc, Thứ Bảy 10 giờ em đón anh chị xem nhà mẫu nhé.' },
{ id: 'b06', say: 'Xa trung tâm quá, giờ cao điểm tắc lắm.', ctx: 'Khách làm việc ở Hoàn Kiếm, xem dự án ở Gia Lâm.',
options: ['Dạ không tắc đâu anh/chị.', 'Dạ sau này có metro thì nhanh thôi, chắc chắn.', 'Dạ anh/chị đi làm mấy giờ và bằng phương tiện gì ạ? Em thử đi đúng khung giờ đó và báo anh/chị thời gian thực tế.', 'Dạ trung tâm thì giá gấp đôi anh/chị ạ.'],
answer: 2, why: 'Hỏi lịch đi lại cụ thể và kiểm thực tế; không hứa hạ tầng như chắc chắn.', model: 'Dạ em sẽ chạy thử đúng 7h30 sáng mai từ dự án tới chỗ anh/chị làm và gửi anh/chị thời gian thực tế, kèm lộ trình đi tránh tắc ạ.' },
{ id: 'b07', say: 'Phí dịch vụ với gửi xe ở đây cao quá.', ctx: 'Khách mua ở, gia đình 2 ô tô.',
options: ['Dạ chỗ nào cũng thế anh/chị.', 'Dạ phí đó gồm những gì em gửi anh/chị bảng chi tiết, và so mức của 2 dự án anh/chị đang cân nhắc theo cùng diện tích ạ.', 'Dạ em xin chủ đầu tư miễn phí cho anh/chị.', 'Dạ phí cao thì dịch vụ mới tốt anh/chị.'],
answer: 1, why: 'Minh bạch từng khoản và so cùng điều kiện; không hứa xin miễn khi không có quyền.', model: 'Dạ em gửi anh/chị bảng phí theo m² và phí gửi 2 ô tô mỗi tháng, đặt cạnh dự án anh/chị đang so để anh/chị thấy chênh lệch cụ thể ạ.' },
{ id: 'b08', say: 'Cho thuê được bao nhiêu một tháng? Đừng nói chung chung.', ctx: 'Nhà đầu tư kỹ tính.',
options: ['Dạ chắc chắn 20 triệu/tháng chị ạ.', 'Dạ lợi nhuận cam kết 8%/năm chị.', 'Dạ cho thuê dễ lắm chị.', 'Dạ em gửi chị 3–5 tin cho thuê căn cùng loại quanh đây đang đăng và mức đã chốt em biết, chị tự tính lợi suất ạ.'],
answer: 3, why: 'Dẫn chứng bằng giá thuê thực tế có nguồn; không cam kết lợi nhuận.', model: 'Dạ em gửi chị danh sách căn cùng diện tích quanh dự án đang cho thuê, kèm giá và link, chị xem rồi mình tính lợi suất theo số thật ạ.' },
{ id: 'b09', say: 'Bên sàn kia chiết khấu cho chị thêm 2%.', ctx: 'Khách đang làm việc với 2 bên môi giới.',
options: ['Dạ bên đó lừa đảo đấy chị.', 'Dạ chị cho em xem chiết khấu đó gồm những khoản gì nhé. Em so từng khoản giúp chị và nói rõ em hỗ trợ được gì thêm: thủ tục vay, nhận nhà, cho thuê.', 'Dạ em chiết khấu 3% cho chị luôn.', 'Dạ vậy chị mua bên đó đi.'],
answer: 1, why: 'So từng khoản, nói giá trị mình mang lại; không chê đối thủ, không tự ý giảm giá.', model: 'Dạ chị gửi em bảng bên kia nhé, em so từng khoản. Nếu cùng mức thì em lo giúp chị thủ tục vay và nhận nhà tới khi chị dọn vào ạ.' },
{ id: 'b10', say: 'Căn tầng này có hợp tuổi anh/chị không?', ctx: 'Khách sinh năm 1988, quan tâm phong thuỷ.',
options: ['Dạ hợp lắm anh/chị, em xem rồi.', 'Dạ phong thuỷ không quan trọng đâu anh/chị.', 'Dạ anh/chị quan tâm hướng cửa hay hướng ban công ạ? Em xem theo cách anh/chị hay dùng và gửi anh/chị 2–3 căn hướng đó còn trống.', 'Dạ tầng nào cũng như nhau anh/chị.'],
answer: 2, why: 'Tôn trọng niềm tin của khách, hỏi khách xem theo cách nào rồi lọc căn phù hợp.', model: 'Dạ anh/chị hay xem theo hướng cửa chính hay ban công ạ? Em lọc giúp anh/chị các căn đúng hướng đó còn trong bảng hàng.' },
{ id: 'b11', say: 'Ok em gửi bảng giá đi.', ctx: 'Khách gọi từ quảng cáo, trả lời ngắn.',
options: ['Dạ em gửi ngay ạ. Anh/chị tìm căn để ở hay cho thuê, mấy phòng ngủ ạ? Em gửi đúng những căn hợp để anh/chị đỡ phải đọc cả bảng.', 'Dạ vâng, em gửi cả bảng 300 căn anh/chị xem nhé.', 'Dạ anh/chị cho em xin 15 phút giới thiệu dự án trước ạ.', 'Dạ bảng giá nội bộ không gửi được anh/chị.'],
answer: 0, why: 'Đồng ý ngay nhưng hỏi 1–2 câu để gửi đúng căn, giữ được cuộc trò chuyện.', model: 'Dạ em gửi anh/chị qua Zalo luôn. Anh/chị cần mấy phòng ngủ để em đánh dấu sẵn các căn hợp, tối nay em gọi lại 5 phút giải thích nhé.' },
{ id: 'b12', say: 'Dự án mới xây, chị chưa xem được căn thật thì sao chị tin?', ctx: 'Khách mua ở, cẩn thận.',
options: ['Dạ chị cứ tin em.', 'Dạ chị xem nhà mẫu, hợp đồng mẫu ghi rõ vật liệu bàn giao, và em đưa chị đi xem một dự án đã bàn giao của cùng chủ đầu tư ạ.', 'Dạ nhà nào bàn giao cũng đẹp chị.', 'Dạ chị đợi xây xong thì giá cao hơn nhiều.'],
answer: 1, why: 'Thay lời hứa bằng thứ khách kiểm được: nhà mẫu, danh mục bàn giao trong hợp đồng, dự án cũ của chủ đầu tư.', model: 'Dạ cuối tuần em đưa chị xem nhà mẫu và một toà chủ đầu tư đã bàn giao năm ngoái, kèm danh mục vật liệu trong hợp đồng mẫu để chị đối chiếu ạ.' },
];
const clip = (_of, n) => String(_of == null ? '' : _of).replace(/\s+/g, ' ').trim().slice(0, n);
export function topicsFor(_o5, extra = 0, _o9 = 3) {
const _og = [...String(_o5)].reduce((t, _o2) => (t * 31 + _o2.charCodeAt(0)) >>> 0, 7) + extra * 5;
const _od = [];
for (let _o7 = 0; _od.length < _o9 && _o7 < TOPICS.length * 2; _o7++) {
const t = TOPICS[(_og + _o7 * 7) % TOPICS.length];
if (!_od.includes(t)) _od.push(t);
}
return _od;
}
export function setPrompt({ topics = [], avoid = [], n = SET_SIZE } = {}) {
return withRulesJson([
'Bạn là huấn luyện viên bán hàng bất động sản ở Hà Nội. Soạn ' + n + ' tình huống luyện tập MỚI cho môi giới: mỗi tình huống là một câu khách hỏi hoặc phản đối, như khách thật nói khi mua chung cư / nhà ở Hà Nội.',
'Chủ đề hôm nay (trộn đều, mỗi chủ đề ít nhất 1 tình huống, phần còn lại tuỳ chọn chủ đề khác hay gặp): ' + topics.join('; ') + '.',
'Mỗi tình huống có 4 cách trả lời của môi giới: đúng 1 cách tốt nhất (ghi nhận cảm xúc, hỏi lại để hiểu, đưa dẫn chứng kiểm được, chốt bước nhỏ tiếp theo) và 3 cách sai nhưng hay gặp ngoài đời (hứa hẹn tăng giá / cam kết lợi nhuận, nói chắc về pháp lý, chê đối thủ, né câu hỏi, ép chốt, nói dài).',
'Câu khách: tiếng Việt đời thường, 1–2 câu, xưng hô tự nhiên (anh/chị, chị, cô, chú). Bối cảnh: một câu ngắn về khách (mua ở hay đầu tư, khu vực Hà Nội, gia đình). Không ghi tên dự án, giá, lãi suất cụ thể như sự thật.',
'Câu trả lời mẫu: lời nói hoàn chỉnh môi giới có thể đọc lên ngay, 1–3 câu, lễ phép ("Dạ…ạ").',
avoid.length ? 'Không lặp lại hoặc viết na ná các câu khách sau: ' + avoid.map((_of) => '"' + clip(_of, 90) + '"').join(', ') + '.' : '',
'Chỉ trả về JSON đúng dạng: {"items":[{"say":"câu khách","ctx":"bối cảnh","options":["…","…","…","…"],"answer":chỉ số 0-3 của cách tốt nhất,"why":"vì sao cách đó tốt, 1 câu","model":"câu trả lời mẫu"}]}',
].filter(Boolean).join('\n'));
}
const _oe = () => 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export function shuffleItem(it, rnd = Math.random) {
const _o8 = it.options.map((_, _o7) => _o7);
for (let _o7 = _o8.length - 1; _o7 > 0; _o7--) { const j = Math.floor(rnd() * (_o7 + 1)); [_o8[_o7], _o8[j]] = [_o8[j], _o8[_o7]]; }
return { ...it, options: _o8.map((_o7) => it.options[_o7]), answer: _o8.indexOf(it.answer) };
}
export function parseSet(text, { rnd = Math.random, now = Date.now() } = {}) {
const _of = String(text || '');
const _oc = _of.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
if (!_oc) return [];
let j; try { j = JSON.parse(_oc[0]); } catch { return []; }
const _o1 = Array.isArray(j) ? j : j && Array.isArray(j.items) ? j.items : [];
const _od = [], seen = new Set();
for (const _oi of _o1.slice(0, 20)) {
if (!_oi || typeof _oi !== 'object') continue;
const say = clip(_oi.say, 300), opts = Array.isArray(_oi.options) ? _oi.options.map((o) => clip(o, 400)) : [];
const _o0 = Number(_oi.answer);
if (!say || opts.length !== 4 || opts.some((o) => !o) || !Number.isInteger(_o0) || _o0 < 0 || _o0 > 3) continue;
const _ob = say.toLowerCase();
if (seen.has(_ob)) continue;
seen.add(_ob);
_od.push(shuffleItem({ id: _oe(), say, ctx: clip(_oi.ctx, 200), options: opts, answer: _o0, why: clip(_oi.why, 300), model: clip(_oi.model, 500), ai: 1, at: now }, rnd));
}
return _od;
}
export function drillState(progress) {
const _o4 = (progress && progress.drill) || {};
return { items: _o4.items || {}, sets: _o4.sets || {}, done: _o4.done || {}, last: _o4.last || {}, extra: _o4.extra || {} };
}
export function dueDrill(progress, now = Date.now(), limit = 99) {
const p = progress || {}, D = drillState(p), _od = [];
for (const [_o9, _o2] of Object.entries(p.cards || {})) {
if (!_o9.startsWith(PREFIX) || _o2.due > now) continue;
const id = _o9.slice(PREFIX.length).split('#')[0];
if (D.items[id]) _od.push({ id, item: D.items[id], box: _o2.box, due: _o2.due });
}
return _od.sort((a, b) => a.box - b.box || a.due - b.due).slice(0, limit);
}
export function bankPick(progress, n = SET_SIZE) {
const D = drillState(progress);
const fresh = BANK.filter((b) => !D.done[b.id]);
const old = BANK.filter((b) => D.done[b.id]).sort((a, b) => D.done[a.id] - D.done[b.id]);
return [...fresh, ...old].slice(0, n).map((b) => ({ ...b }));
}
export function recentSays(progress, n = 40) {
return Object.values(drillState(progress).items).sort((a, b) => (b.at || 0) - (a.at || 0)).slice(0, n).map((_oi) => _oi.say);
}
export function addSet(progress, fresh, { now = Date.now(), reviewMax = 3, more = false } = {}) {
const p = JSON.parse(JSON.stringify(progress || {}));
const D = drillState(p), _o5 = ymd(now);
const today = D.sets[_o5] || [];
const review = dueDrill(p, now).map((_oi) => _oi.id).filter((id) => !today.includes(id)).slice(0, reviewMax);
const ids = [...review];
for (const it of fresh) { D.items[it.id] = { ...it, at: it.at || now }; if (!today.includes(it.id) && !ids.includes(it.id)) ids.push(it.id); }
D.sets[_o5] = [...today, ...ids];
if (more) D.extra[_o5] = (D.extra[_o5] || 0) + 1;
for (const _o9 of Object.keys(D.extra)) if (_o9 !== _o5) delete D.extra[_o9];
p.drill = D;
return { progress: prune(p, now), ids };
}
export function answerDrill(progress, id, ok, now = Date.now()) {
const p = JSON.parse(JSON.stringify(progress || {}));
p.cards = p.cards || {}; p.days = p.days || [];
const D = drillState(p);
const _o9 = PREFIX + id + '#0', _o2 = p.cards[_o9];
const box = ok ? Math.min(BOX_DAYS.length - 1, ((_o2 && _o2.box) || 1) + 1) : 1;
p.cards[_o9] = { box, due: now + BOX_DAYS[box] * DAY };
D.done[id] = now; D.last[id] = ok ? 1 : 0;
p.drill = D;
const _o4 = ymd(now);
if (!p.days.includes(_o4)) p.days = [...p.days, _o4].slice(-400);
return p;
}
export function prune(progress, now = Date.now()) {
const p = progress, D = drillState(p);
const _o3 = ymd(now - 14 * DAY);
for (const _o5 of Object.keys(D.sets)) if (_o5 < _o3) delete D.sets[_o5];
const _oa = new Set(Object.values(D.sets).flat());
const ids = Object.keys(D.items);
if (ids.length > MAX_KEEP) {
const _oh = (id) => {
const _o2 = (p.cards || {})[PREFIX + id + '#0'];
return (_oa.has(id) ? 2e13 : 0) + (_o2 && _o2.box < BOX_DAYS.length - 1 ? 1e13 : 0) + (D.items[id].at || 0);
};
const _o6 = ids.sort((a, b) => _oh(b) - _oh(a)).slice(MAX_KEEP);
for (const id of _o6) { delete D.items[id]; delete D.done[id]; delete D.last[id]; if (p.cards) delete p.cards[PREFIX + id + '#0']; }
}
p.drill = D;
return p;
}
export function todaySet(progress, now = Date.now()) {
const D = drillState(progress), _o5 = ymd(now), start = new Date(_o5 + 'T00:00:00+07:00').getTime();
return (D.sets[_o5] || []).filter((id) => D.items[id]).map((id) => ({ id, item: D.items[id], answered: (D.done[id] || 0) >= start, ok: D.last[id] === 1 }));
}

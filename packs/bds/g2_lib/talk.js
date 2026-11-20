import { fold } from './core.js';
import { LIB_SCRIPTS as WARM_SCRIPTS } from './warm.js';
import { gate, stateOf } from '../_lib/consent.js';
export const SCRIPT_CATS = [
['objection', 'Xử lý từ chối'], ['open', 'Mở lời'], ['followup', 'Sau gặp / xem nhà'], ['close', 'Chốt – bước tiếp theo'], ['reply', 'Trả lời bình luận'], ['warm', 'Người quen'],
];
export const ETHICS = [
'Nói thật, số liệu có nguồn; chưa chắc thì hẹn kiểm tra rồi trả lời.',
'Không hứa tăng giá, không cam kết lợi nhuận, không tạo khan hiếm giả ("chỉ còn 1 căn" khi không đúng).',
'Tôn trọng quyết định của khách: khách chưa sẵn sàng thì hẹn lại, không gọi dồn.',
'Không khai thác nỗi sợ, hoàn cảnh riêng hay điểm yếu cảm xúc để thúc ép.',
];
export const DEFAULT_SCRIPTS = [
{ id: 'gia_cao', cat: 'objection', title: '"Giá cao quá"', triggers: ['gia cao', 'dat qua', 'mac qua', 'cao qua', 'dat the'],
text: 'Dạ em hiểu, số tiền lớn nên anh/chị cân nhắc là đúng ạ. Để so cho công bằng, em gửi anh/chị bảng so sánh {du_an} với 2–3 dự án cùng khu vực theo giá/m², phí quản lý, tiến độ thanh toán và thời điểm bàn giao – số liệu có nguồn. Nếu mức đó vẫn chưa hợp, em tìm thêm phương án diện tích nhỏ hơn hoặc lịch thanh toán giãn hơn để anh/chị chọn ạ.',
tip: 'Hỏi lại "cao so với gì?" (ngân sách, dự án khác hay giá kỳ vọng). Đưa bảng so sánh có nguồn, không nói "giá sắp tăng" nếu không có văn bản.' },
{ id: 'cho_them', cat: 'objection', title: '"Để chờ thêm / chờ giá giảm"', triggers: ['cho them', 'chua voi', 'de sau', 'cho gia giam', 'tu tu', 'de suy nghi'],
text: 'Dạ vâng, anh/chị chưa vội thì mình cứ cân nhắc kỹ ạ. Em ghi lại nhu cầu: {loai_can}, khoảng {so_tien}. Khi có chính sách, bảng giá hay tiến độ mới của {du_an} em sẽ gửi anh/chị kèm nguồn để mình so trước – sau so sánh, anh/chị quyết định lúc nào cũng được ạ. Anh/chị muốn em nhắn lại sau khoảng bao lâu ạ?',
tip: 'Đồng ý với khách, hỏi mốc thời gian khách muốn được liên hệ lại và ghi nhắc việc đúng mốc đó.' },
{ id: 'phap_ly', cat: 'objection', title: '"Pháp lý thế nào?"', triggers: ['phap ly', 'so do', 'so hong', 'giay phep', 'hdmb', 'bao lanh', 'so huu'],
text: 'Dạ câu hỏi rất quan trọng ạ. Em gửi anh/chị các giấy tờ của {du_an} mà chủ đầu tư công bố: quyết định giao đất/chủ trương đầu tư, giấy phép xây dựng, văn bản đủ điều kiện bán nhà ở hình thành trong tương lai (theo Luật Kinh doanh BĐS 2023) và bảo lãnh ngân hàng. Anh/chị có thể nhờ luật sư hoặc công chứng viên kiểm tra độc lập trước khi ký ạ.',
tip: 'Chỉ gửi giấy tờ có thật, có số hiệu. Chưa có văn bản nào thì nói rõ "chưa có", không trấn an chung chung.' },
{ id: 'xa', cat: 'objection', title: '"Xa trung tâm"', triggers: ['xa qua', 'xa trung tam', 'di lai', 'tac duong'],
text: 'Dạ em hiểu anh/chị lo chuyện đi lại hằng ngày. Em đo giúp anh/chị thời gian thực tế giờ cao điểm từ {du_an} tới nơi làm việc/trường học của gia đình, kèm các tuyến đường, cầu đang làm có nguồn chính thức. Có số cụ thể rồi mình quyết định sẽ chắc hơn ạ.',
tip: 'Hỏi địa chỉ đi lại thật của khách, đo bằng bản đồ; hạ tầng chỉ nói khi có quyết định/tiến độ chính thức.' },
{ id: 'vay', cat: 'objection', title: '"Lo trả nợ ngân hàng"', triggers: ['vay', 'lai suat', 'tra no', 'tra gop', 'ngan hang'],
text: 'Dạ em làm bảng tính khoản vay cho anh/chị: số tiền trả mỗi tháng trong thời gian ưu đãi và sau khi thả nổi (tính theo lãi suất tham chiếu hiện tại cộng biên độ), để mình thấy mức an toàn so với thu nhập. Nguyên tắc em hay khuyên là tổng trả nợ không quá khoảng 40% thu nhập hằng tháng ạ.',
tip: 'Luôn cho khách xem kịch bản lãi thả nổi, không chỉ lãi ưu đãi. Không khuyên vay quá sức.' },
{ id: 'cdt', cat: 'objection', title: '"Chủ đầu tư có uy tín không?"', triggers: ['chu dau tu', 'cdt', 'uy tin', 'lua dao'],
text: 'Dạ em gửi anh/chị danh sách dự án chủ đầu tư đã bàn giao, thời gian bàn giao thực tế so với hợp đồng và đường dẫn báo chí/văn bản liên quan để anh/chị tự đánh giá ạ.',
tip: 'Đưa dữ kiện, để khách tự kết luận.' },
{ id: 'mo_dau', cat: 'open', title: 'Gọi lần đầu (khách từ landing)', triggers: [],
text: 'Dạ em chào anh/chị {ten}, em là {ten_toi}, tư vấn dự án {du_an}. Em thấy anh/chị vừa để lại thông tin quan tâm dự án. Anh/chị cho em hỏi mình tìm căn để ở hay đầu tư, và khoảng vốn dự kiến bao nhiêu để em gửi đúng thông tin ạ?',
tip: 'Hỏi 2–3 câu về nhu cầu trước khi gửi bảng giá. Ghi vào hồ sơ để app ghép căn.' },
{ id: 'sau_xem', cat: 'followup', title: 'Sau buổi xem nhà', triggers: [],
text: 'Dạ em cảm ơn anh/chị {ten} đã đi xem căn {loai_can} tại {du_an}. Anh/chị thấy điểm nào ưng nhất và điểm nào còn băn khoăn ạ? Em gửi bảng tính thanh toán theo đúng căn mình xem để gia đình cùng tham khảo.',
tip: 'Hỏi cả điểm thích và điểm chưa thích; trả lời băn khoăn bằng tài liệu.' },
{ id: 'buoc_tiep', cat: 'close', title: 'Đề nghị bước tiếp theo', triggers: ['dat coc', 'giu cho', 'booking'],
text: 'Dạ nếu căn {loai_can} này đã hợp nhu cầu và ngân sách, bước tiếp theo là xem kỹ hợp đồng mẫu và phiếu giữ chỗ. Em gửi anh/chị bản mẫu để đọc trước, anh/chị cứ hỏi từng điều khoản, chưa cần quyết ngay ạ.',
tip: 'Đưa giấy tờ để khách đọc trước. Không ép ký trong buổi.' },
{ id: 'binh_luan', cat: 'reply', title: 'Trả lời bình luận hỏi giá', triggers: ['gia', 'bao nhieu', 'ib', 'inbox', 'xin gia'],
text: 'Dạ em cảm ơn anh/chị đã quan tâm {du_an} ạ. Giá thay đổi theo căn và chính sách từng tháng nên em gửi riêng bảng giá mới nhất qua tin nhắn để anh/chị xem chính xác nhé ạ.',
tip: 'Bình luận công khai: ngắn, lịch sự, không đăng số điện thoại khách, mời nhắn riêng.' },
{ id: 'tc_hoi_vo_chong', cat: 'objection', objection: 'hoi_vo_chong', title: '"Để hỏi vợ/chồng đã"', triggers: ['hoi vo', 'hoi chong', 'hoi y kien', 'ban voi vo', 'ban voi chong', 'hoi gia dinh'],
text: 'Dạ vâng, việc lớn của gia đình thì anh/chị bàn cùng nhau là đúng ạ. Em gửi anh/chị tài liệu {du_an} gọn trong một tin: bảng giá căn {loai_can}, tiến độ thanh toán và giấy tờ pháp lý, để anh/chị chuyển cho người nhà cùng xem. Nếu tiện, em hẹn một buổi cả hai cùng nghe tư vấn để em trả lời trực tiếp các băn khoăn ạ.',
tip: 'Nội dung mẫu – Chủ sửa cho hợp đội. Hỏi người cùng quyết định quan tâm điều gì nhất; không nói xấu hay gạt người vắng mặt.' },
{ id: 'tc_ben_kia_re', cat: 'objection', objection: 'ben_kia_re', title: '"Bên kia rẻ hơn"', triggers: ['ben kia', 're hon', 'cho khac re', 'du an khac re'],
text: 'Dạ cảm ơn anh/chị đã chia sẻ ạ. Anh/chị gửi em thông tin căn bên kia (diện tích, tầng, hướng, chính sách thanh toán, phí quản lý) để em đặt cạnh căn {loai_can} ở {du_an} cho dễ so. Nếu bên kia thật sự hợp hơn với nhu cầu của mình, em cũng nói thẳng để anh/chị chọn đúng ạ.',
tip: 'Nội dung mẫu – Chủ sửa cho hợp đội. So cùng điều kiện (giá/m² thông thuỷ, tổng tiền gồm phí, thời điểm bàn giao). Không chê đối thủ khi chưa có dữ kiện.' },
{ id: 'tc_suy_nghi', cat: 'objection', objection: 'suy_nghi', title: '"Để suy nghĩ thêm"', triggers: ['suy nghi them', 'de suy nghi', 'can nhac them'],
text: 'Dạ vâng anh/chị cứ suy nghĩ kỹ ạ. Để em hỗ trợ đúng chỗ, anh/chị đang cân nhắc nhất về điểm nào: giá, vị trí, pháp lý hay cách thanh toán ạ? Em gửi thêm tài liệu đúng phần đó để mình xem lúc rảnh, không cần trả lời ngay.',
tip: 'Nội dung mẫu – Chủ sửa cho hợp đội. Mục tiêu là hiểu băn khoăn thật, không ép quyết. Hẹn mốc liên hệ lại theo ý khách.' },
{ id: 'tc_vi_tri', cat: 'objection', objection: 'vi_tri', title: '"Vị trí không ưng"', triggers: ['vi tri xau', 'khong thich vi tri', 'vi tri khong', 'duong nho', 'ngo nho'],
text: 'Dạ em cảm ơn anh/chị nói thẳng ạ. Anh/chị chưa ưng vị trí ở điểm nào: đường vào, khoảng cách tới chỗ làm/trường học hay môi trường xung quanh ạ? Em gửi bản đồ và ảnh thực tế quanh {du_an}, nếu đúng là chưa hợp thì em tìm phương án ở khu vực anh/chị thích hơn ạ.',
tip: 'Nội dung mẫu – Chủ sửa cho hợp đội. Hạ tầng tương lai chỉ nói khi có quyết định/tiến độ chính thức kèm nguồn.' },
{ id: 'tc_lai_vay', cat: 'objection', objection: 'lai_vay', title: '"Lo lãi vay"', triggers: ['lai vay', 'lai suat cao', 'so lai', 'tha noi', 'lo lai'],
text: 'Dạ lo về lãi vay là rất hợp lý ạ. Em làm giúp anh/chị bảng tính trả nợ theo đúng chính sách hiện hành của ngân hàng liên kết với {du_an}: số trả mỗi tháng trong thời gian ưu đãi và sau khi hết ưu đãi, để mình so với thu nhập. Lãi suất thay đổi theo từng thời điểm nên em sẽ kiểm tra lại với ngân hàng trước khi gửi số ạ.',
tip: 'Nội dung mẫu – Chủ sửa cho hợp đội. Kiểm tra chính sách hiện hành của ngân hàng trước khi nêu số; luôn cho khách xem cả giai đoạn sau ưu đãi. Không khuyên vay quá sức.' },
...WARM_SCRIPTS,
];
export function mergeScripts(teamCfg, personal = []) {
const c = teamCfg && typeof teamCfg === 'object' ? teamCfg : {};
const ov = c.overrides && typeof c.overrides === 'object' ? c.overrides : {};
const hidden = new Set(Array.isArray(c.hidden) ? c.hidden : []);
const _o5 = DEFAULT_SCRIPTS.filter(s => !hidden.has(s.id)).map(s => (ov[s.id] ? { ...s, ...ov[s.id], id: s.id, edited: true, scope: 'team' } : { ...s, scope: 'default' }));
const _on = (Array.isArray(c.custom) ? c.custom : []).filter(s => s && s.text && !hidden.has(s.id)).map(s => ({ cat: 'objection', triggers: [], ...s, scope: 'team' }));
const _oe = (personal || []).filter(_og => _og && !Number(_og.deleted)).map(_og => {
let _o8 = {}; try { _o8 = typeof _og.data === 'string' ? JSON.parse(_og.data) : (_og.data || {}); } catch { _o8 = {}; }
return { id: _og.id, cat: _o8.cat || 'objection', title: _og.name || 'Kịch bản riêng', text: _o8.text || '', tip: _o8.tip || '', triggers: _o8.triggers || [], scope: 'mine', row: _og, hidden: !!_o8.hidden, from: _o8.from || '' };
}).filter(s => s.text && !s.hidden);
const _ol = new Set(_oe.map(s => s.from).filter(Boolean));
return _o5.concat(_on).filter(s => !_ol.has(s.id)).concat(_oe);
}
export function parseTriggers(s) { return String(s || '').split(/[,;\n]+/).map(t => fold(t)).filter(Boolean).slice(0, 20); }
export function saveTeamScript(cfg, script, patch) {
const c = { overrides: {}, custom: [], hidden: [], ...(cfg && typeof cfg === 'object' ? cfg : {}) };
const clean = { title: String(patch.title || '').trim().slice(0, 120), text: String(patch.text || '').trim().slice(0, 3000), tip: String(patch.tip || '').trim().slice(0, 600), cat: patch.cat || 'objection', triggers: Array.isArray(patch.triggers) ? patch.triggers : parseTriggers(patch.triggers), ...(patch.objection ? { objection: String(patch.objection).slice(0, 40) } : {}) };
if (!clean.text) throw new Error('Nội dung kịch bản đang trống');
if (script && script.scope === 'default') return { ...c, overrides: { ...c.overrides, [script.id]: clean } };
if (script && script.scope === 'team' && DEFAULT_SCRIPTS.some(_o8 => _o8.id === script.id)) return { ...c, overrides: { ...c.overrides, [script.id]: clean } };
if (script && script.scope === 'team') return { ...c, custom: c.custom.map(x => (x.id === script.id ? { ...x, ...clean } : x)) };
return { ...c, custom: c.custom.concat([{ id: 'tm_' + Date.now().toString(36), ...clean }]) };
}
export function resetTeamScript(cfg, id) { const c = { overrides: {}, custom: [], hidden: [], ...(cfg || {}) }; const _og = { ...c.overrides }; delete _og[id]; return { ...c, overrides: _og }; }
export const INTENTS = [
{ id: 'gia', label: 'Hỏi giá', kw: ['gia', 'bao nhieu', 'xin gia', 'bang gia', 'tr m2', 'trieu', 'ty'] },
{ id: 'phap_ly', label: 'Hỏi pháp lý', kw: ['phap ly', 'so do', 'so hong', 'giay phep', 'hdmb', 'bao lanh', 'lau dai', '50 nam'] },
{ id: 'vi_tri', label: 'Hỏi vị trí / đi lại', kw: ['o dau', 'vi tri', 'dia chi', 'xa', 'gan', 'duong nao', 'ban do'] },
{ id: 'tien_do', label: 'Hỏi tiến độ / bàn giao', kw: ['tien do', 'ban giao', 'bao gio', 'khi nao', 'xay den dau', 'cat noc'] },
{ id: 'vay', label: 'Hỏi vay / thanh toán', kw: ['vay', 'lai suat', 'tra gop', 'thanh toan', 'chiet khau', 'chinh sach'] },
{ id: 'xem', label: 'Muốn xem nhà', kw: ['xem nha', 'nha mau', 'di xem', 'tham quan', 'hen'] },
{ id: 'che', label: 'Chê / nghi ngờ', kw: ['lua', 'dat qua', 'cao qua', 'ao', 'phong gia', 'ngao', 'tham'] },
{ id: 'gia_cao', label: 'Chê giá cao', kw: ['dat qua', 'cao qua', 'mac qua', 'gia cao'] },
{ id: 'cho', label: 'Chần chừ', kw: ['de sau', 'cho them', 'chua vo', 'suy nghi them', 'tu tu', 'cho gia giam'] },
];
const _o2 = /(https?:\/\/|bit\.ly|zalo\.me\/|\b0\d{9}\b).*(kiem tien|viec nhe|lai \d+%|cho vay nhanh)|kiem tien online|viec nhe luong cao/;
const _o0 = { gia: 'binh_luan', gia_cao: 'gia_cao', che: 'gia_cao', cho: 'cho_them', phap_ly: 'phap_ly', vi_tri: 'xa', vay: 'vay' };
const words = s => ' ' + fold(s).replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
const hasWord = (_of, k) => _of.includes(' ' + k + ' ');
export function classify(text) {
const _of = words(text);
if (!_of.trim()) return { intents: [], spam: false };
const spam = _o2.test(fold(text));
const intents = INTENTS.map(_ob => ({ id: _ob.id, label: _ob.label, hits: _ob.kw.filter(k => hasWord(_of, k)) })).filter(_ob => _ob.hits.length)
.sort((_o3, b) => b.hits.length - _o3.hits.length);
return { intents, spam };
}
export function suggestReplies(text, { scripts = DEFAULT_SCRIPTS, channel = 'comment', vars = {} } = {}) {
const _o7 = classify(text);
const warnings = [];
if (_o7.spam) warnings.push('Có dấu hiệu tin rác/lừa đảo – không trả lời, có thể ẩn bình luận.');
if (/\b0\d{9}\b/.test(String(text))) warnings.push('Bình luận có số điện thoại – không nhắc lại số này công khai.');
const _of = words(text);
const _om = _o7.spam ? [] : scripts.map(s => {
let pts = 0;
for (const t of s.triggers || []) if (t && hasWord(_of, words(t).trim())) pts += 2;
for (const _ob of _o7.intents) if (_o0[_ob.id] === s.id) pts += 3;
return { s, pts };
}).filter(x => x.pts > 0).sort((_o3, b) => b.pts - _o3.pts).map(x => x.s);
const fill = t => String(t || '').replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined && vars[k] !== '' ? String(vars[k]) : (k === 'du_an' ? 'dự án' : k === 'ten' ? '' : '…'))).replace(/\s{2,}/g, ' ').replace(/ ([,.])/g, '$1').trim();
const _oo = _o7.intents[0];
const _ok = _o7.spam ? '' : channel === 'comment'
? (_oo && (_oo.id === 'che' || _oo.id === 'gia_cao')
? 'Dạ em cảm ơn góp ý của anh/chị ạ. Em gửi riêng anh/chị bảng so sánh giá có nguồn để mình tham khảo thêm nhé ạ.'
: 'Dạ em cảm ơn anh/chị đã quan tâm ạ. ' + (_oo ? 'Phần ' + _oo.label.toLowerCase().replace(/^hỏi /, '') + ' ' : 'Thông tin chi tiết ') + 'em gửi riêng qua tin nhắn để anh/chị xem đầy đủ nhé ạ.')
: '';
const _oj = _om[0] ? fill(_om[0].text) : (_o7.spam ? '' : fill('Dạ em chào anh/chị, em cảm ơn anh/chị đã nhắn. Anh/chị đang quan tâm căn để ở hay đầu tư, khoảng vốn bao nhiêu để em gửi thông tin {du_an} phù hợp ạ?'));
return { intents: _o7.intents, spam: _o7.spam, public: _ok, private: _oj, scripts: _om.slice(0, 4), warnings };
}
export function replyPrompt(text, { channel = 'comment', project = '', me = {} } = {}) {
return [
'Bạn là chuyên viên tư vấn bất động sản tại Việt Nam, nói chuyện lịch sự, trung thực.',
'Viết 2 câu trả lời cho ' + (channel === 'comment' ? 'BÌNH LUẬN công khai' : 'TIN NHẮN riêng') + ' dưới đây (tiếng Việt có dấu, xưng "em", gọi "anh/chị"):',
'1) "public": trả lời công khai ngắn (dưới 40 chữ), không nêu giá cụ thể, không nhắc số điện thoại, mời nhắn riêng.',
'2) "private": tin nhắn riêng (dưới 110 chữ) trả lời đúng câu hỏi, hỏi thêm 1 câu về nhu cầu.',
'Luật: ' + ETHICS.join(' ') + ' Không dùng chữ "xin lỗi". Không bịa số liệu – cần số thì ghi [cần kiểm tra].',
project ? 'Dự án: ' + project : '',
'Người trả lời: ' + (me.name || 'chuyên viên tư vấn'),
'',
'Nội dung khách viết: """' + String(text || '').replace(/\b0\d{9}\b/g, '[số điện thoại]').slice(0, 1500) + '"""',
'Trả về JSON: {"public": "…", "private": "…"}',
].filter(Boolean).join('\n');
}
export function parseReplyJson(t) {
const s = String(t || '');
for (const _o6 of [s, (s.match(/```(?:json)?\s*([\s\S]*?)```/) || [])[1], s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1)]) {
if (!_o6) continue;
try { const _oc = JSON.parse(_o6); if (_oc && (_oc.public || _oc.private)) return { public: String(_oc.public || ''), private: String(_oc.private || '') }; } catch { }
}
const _oh = s.trim();
if (!_oh || /^(```|\{|\[)/.test(_oh)) return null;
return { public: '', private: _oh };
}
export const READ_FIELDS = [
{ id: 'purpose', label: 'Mục đích', opts: [['', '—'], ['o', 'Để ở'], ['dau_tu', 'Đầu tư (bán lại)'], ['cho_thue', 'Đầu tư cho thuê'], ['cho_con', 'Mua cho con / bố mẹ']] },
{ id: 'decider', label: 'Ai quyết định', opts: [['', '—'], ['minh', 'Tự quyết'], ['vo_chong', 'Hai vợ chồng'], ['gia_dinh', 'Cả gia đình / bố mẹ'], ['doi_tac', 'Có người cùng góp vốn']] },
{ id: 'timeline', label: 'Khi nào cần', opts: [['', '—'], ['ngay', 'Trong 1 tháng'], ['3t', 'Trong 3 tháng'], ['6t', '3–6 tháng'], ['xa', 'Chưa có mốc']] },
{ id: 'pay', label: 'Thanh toán', opts: [['', '—'], ['tien_mat', 'Chủ yếu tiền sẵn có'], ['vay', 'Cần vay ngân hàng'], ['ban_nha', 'Bán nhà cũ để mua']] },
{ id: 'style', label: 'Khách thích trao đổi', opts: [['', '—'], ['so_lieu', 'Số liệu, bảng tính'], ['ngan', 'Ngắn gọn, ý chính'], ['ky', 'Kỹ lưỡng, nhiều tài liệu'], ['gap', 'Gặp trực tiếp / xem tận nơi']] },
{ id: 'channel', label: 'Kênh tiện nhất', opts: [['', '—'], ['zalo', 'Nhắn Zalo'], ['goi', 'Gọi điện'], ['gap', 'Gặp mặt']] },
];
export const PRIORITIES = [['vi_tri', 'Vị trí, đi lại'], ['gia', 'Giá / tổng tiền'], ['phap_ly', 'Pháp lý'], ['truong', 'Trường học cho con'], ['tien_ich', 'Tiện ích nội khu'], ['cdt', 'Uy tín chủ đầu tư'], ['loi_suat', 'Lợi suất cho thuê'], ['ban_giao', 'Bàn giao sớm'], ['phong_thuy', 'Hướng, phong thuỷ']];
export const SENSITIVE_NOTE = 'Không ghi và không suy đoán: tôn giáo, quan điểm chính trị, sức khoẻ, đời sống tình dục, nguồn gốc dân tộc, tiền án, thông tin tài khoản ngân hàng – đây là dữ liệu cá nhân nhạy cảm theo quy định về bảo vệ dữ liệu cá nhân (Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 và Nghị định 356/2025/NĐ-CP).';
export const GUARDRAILS = [
'Mục đích của "Đọc khách" là hiểu đúng NHU CẦU để tư vấn trung thực – không dùng để thao túng tâm lý.',
'Không tạo khan hiếm hay hạn chót giả, không gây áp lực, không khai thác nỗi sợ hay hoàn cảnh riêng.',
'Khách có quyền xem, sửa, rút lại đồng ý và yêu cầu xoá hồ sơ này bất cứ lúc nào (theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15).',
];
const _o1 = /tôn giáo|đạo phật|công giáo|chính trị|đảng viên|bệnh|ung thư|mang thai|ly hôn|nợ xấu|tiền án|dân tộc/i;
export function consentState(c) {
const _oa = gate(c, 'profile');
if (!_oa.ok && c && stateOf(c).withdrawn) return { ok: false, text: _oa.reason + ' Không lập hồ sơ nhu cầu cho khách này.' };
if (_oa.ok) return { ok: true, text: 'Khách đã đồng ý xử lý dữ liệu cá nhân.' };
return { ok: false, text: 'Khách CHƯA đồng ý xử lý dữ liệu cá nhân (theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15). Chỉ lập hồ sơ nhu cầu khi khách đồng ý – ghi nhận đồng ý trong hồ sơ khách trước.' };
}
export function redact(text) {
return String(text || '').replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]').replace(/\b\d{9,16}\b/g, '[số]').replace(/(\+84|0)[\d .]{8,12}\d/g, '[số điện thoại]');
}
export function sensitiveHits(text) { const _od = String(text || '').match(new RegExp(_o1.source, 'gi')); return _od ? [...new Set(_od.map(x => x.toLowerCase()))] : []; }
export function readCustomer(c, answers = {}, extra = {}) {
const _o3 = answers || {};
const _oi = new Set(_o3.priorities || []);
const need = [];
const tips = [];
const docs = [];
const _o4 = (arr, t, why) => arr.push({ text: t, why });
if (c.budget) _o4(need, 'Vốn khoảng ' + extra.money(c.budget), 'Khách đã nói');
if (c.unit_type) _o4(need, 'Loại căn ' + c.unit_type, 'Khách đã nói');
if (c.project) _o4(need, 'Quan tâm ' + (extra.projectName ? extra.projectName(c.project) : c.project), 'Khách đã nói');
const label = (fid, v) => { const _o9 = READ_FIELDS.find(x => x.id === fid); const _og = _o9 && _o9.opts.find(x => x[0] === v); return _og ? _og[1] : ''; };
for (const _o9 of READ_FIELDS) if (_o3[_o9.id]) _o4(need, _o9.label + ': ' + label(_o9.id, _o3[_o9.id]), 'Anh/chị ghi nhận khi trao đổi');
if (_oi.size) _o4(need, 'Ưu tiên: ' + PRIORITIES.filter(p => _oi.has(p[0])).map(p => p[1]).join(', '), 'Anh/chị ghi nhận khi trao đổi');
if (_o3.purpose === 'o') { _o4(tips, 'Nói về cuộc sống hằng ngày: đi làm, trường học, tiện ích quanh căn – đo thời gian đi lại thật.', 'Mục đích để ở'); docs.push('Bản đồ đi lại giờ cao điểm', 'Danh sách trường, chợ, bệnh viện quanh dự án'); }
if (_o3.purpose === 'dau_tu') { _o4(tips, 'Trình bày cả rủi ro: thanh khoản, nguồn cung khu vực, chi phí vốn. Không hứa tăng giá.', 'Mục đích đầu tư'); docs.push('Lịch sử giá khu vực có nguồn', 'Bảng chi phí vốn nếu vay'); }
if (_o3.purpose === 'cho_thue' || _oi.has('loi_suat')) { _o4(tips, 'Đưa giá thuê thực tế có nguồn, lợi suất gộp và ròng (trừ phí quản lý, thời gian trống).', 'Quan tâm cho thuê'); docs.push('Bảng lợi suất cho thuê'); }
if (_o3.decider === 'vo_chong' || _o3.decider === 'gia_dinh') _o4(tips, 'Hẹn khi người cùng quyết định có mặt; gửi tài liệu để cả nhà cùng đọc.', 'Không phải một người quyết');
if (_o3.decider === 'doi_tac') _o4(tips, 'Chuẩn bị tài liệu đứng tên/đồng sở hữu; khuyên tham khảo luật sư về thoả thuận góp vốn.', 'Có người cùng góp');
if (_o3.pay === 'vay') { _o4(tips, 'Làm bảng trả nợ cả giai đoạn ưu đãi và thả nổi; giữ tổng trả nợ trong khả năng.', 'Cần vay'); docs.push('Bảng tính khoản vay'); }
if (_o3.pay === 'ban_nha') _o4(tips, 'Khớp tiến độ thanh toán với thời gian bán nhà cũ; nói rõ rủi ro nếu bán chậm.', 'Bán nhà cũ để mua');
if (_o3.timeline === 'xa') _o4(tips, 'Khách chưa có mốc: chăm sóc nhẹ, gửi thông tin có giá trị 2–4 tuần/lần, không gọi dồn.', 'Chưa gấp');
if (_o3.timeline === 'ngay') _o4(tips, 'Khách cần sớm: ưu tiên căn có sẵn/bàn giao gần, kiểm tra kỹ pháp lý trước.', 'Cần trong 1 tháng');
if (_o3.style === 'so_lieu') _o4(tips, 'Gửi bảng tính, so sánh có nguồn; ít cảm xúc, nhiều con số.', 'Thích số liệu');
if (_o3.style === 'ngan') _o4(tips, 'Tin nhắn ngắn 3–4 dòng, ý chính trước, tài liệu đính kèm sau.', 'Thích ngắn gọn');
if (_o3.style === 'ky') _o4(tips, 'Gửi đủ giấy tờ, hợp đồng mẫu; dành thời gian trả lời từng câu.', 'Thích kỹ lưỡng');
if (_o3.style === 'gap' || _o3.channel === 'gap') _o4(tips, 'Hẹn xem nhà mẫu/căn thực tế; chuẩn bị sẵn bảng tính in ra.', 'Thích gặp trực tiếp');
if (_oi.has('phap_ly')) { _o4(tips, 'Mở đầu bằng giấy tờ pháp lý có số hiệu, mời kiểm tra độc lập.', 'Ưu tiên pháp lý'); docs.push('Bộ giấy tờ pháp lý dự án'); }
if (_oi.has('truong')) docs.push('Danh sách trường học + khoảng cách');
if (_oi.has('phong_thuy')) _o4(tips, 'Gửi hướng cửa/ban công từng căn; phong thuỷ là sở thích của khách, không phải cam kết.', 'Quan tâm hướng');
if (_o3.channel === 'zalo') _o4(tips, 'Liên lạc chính qua Zalo, gọi khi khách hẹn trước.', 'Kênh Zalo');
if (_o3.channel === 'goi') _o4(tips, 'Gọi giờ khách tiện; nhắn trước khi gọi.', 'Kênh gọi điện');
if (!tips.length) _o4(tips, 'Chưa đủ thông tin – hỏi thêm mục đích, người quyết định, thời gian và cách thanh toán.', 'Hồ sơ còn trống');
const missing = READ_FIELDS.filter(_o9 => !_o3[_o9.id]).map(_o9 => _o9.label);
return { need, tips, docs: [...new Set(docs)], missing, guardrails: GUARDRAILS };
}
export function readPrompt(c, answers, notesText, extra = {}) {
const r = readCustomer(c, answers, extra);
return [
'Bạn là chuyên gia tư vấn bất động sản trung thực. Dựa trên hồ sơ nhu cầu dưới đây (đã ẩn tên, số điện thoại), gợi ý CÁCH TƯ VẤN phù hợp.',
'Luật bắt buộc: ' + GUARDRAILS.join(' ') + ' ' + SENSITIVE_NOTE + ' Không đoán tính cách, chỉ dựa trên dữ kiện. Không dùng chữ "xin lỗi".',
'', 'Nhu cầu:', ...r.need.map(_of => '- ' + _of.text),
notesText ? '\nGhi chú trao đổi (đã ẩn số):\n' + redact(notesText).slice(0, 2000) : '',
'', 'Trả về 5–7 gạch đầu dòng: nên nói gì trước, tài liệu cần chuẩn bị, câu hỏi nên hỏi thêm, điều nên tránh.',
].join('\n');
}

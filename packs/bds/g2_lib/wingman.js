import { fold } from './core.js';
import { redact } from '../_lib/staff.js';
export { fold };
export const LIMITS = { maxChars: 6000, maxLines: 200, factMax: 200, factsMax: 5, aiFieldMax: 1200 };
export const STATS_KEY = 'bds.g2.wingman.stats';
const _oq = _o1f => String(_o1f ?? '').normalize('NFC').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '');
const _o0 = /(?<![\p{L}\d])(stk|số\s*tài\s*khoản|so\s*tai\s*khoan|tài\s*khoản|tai\s*khoan|tk)(\s*[:.]?\s*)((?:\d[\s.-]?){6,19}\d)/giu;
const _o6 = /(?<![\p{L}\d])(cccd|cmnd|cmt|căn\s*cước|can\s*cuoc|chứng\s*minh(?:\s*thư|\s*nhân\s*dân)?)(\s*(?:số)?\s*[:.]?\s*)(\d{9}|\d{12})(?!\d)/giu;
const _o8 = /(?<!\d)\d{11,19}(?!\d)/g;
const _oa = /(?<![\d,.])\d{9,10}(?![\d,.]*\d)/g;
export function maskPII(input) {
let count = 0;
const _on = r => (...a) => { count++; return typeof r === 'function' ? r(...a) : r; };
let _o1f = _oq(input)
.replace(_o0, _on((_o14, k, sep) => k + sep + '[số tài khoản ẩn]'))
.replace(_o6, _on((_o14, k, sep) => k + sep + '[CCCD ẩn]'))
.replace(_o8, _on('[số ẩn]'));
const _ol = (_o1f.match(/\[(sđt|email) ẩn\]/g) || []).length;
_o1f = redact(_o1f);
count += (_o1f.match(/\[(sđt|email) ẩn\]/g) || []).length - _ol;
_o1f = _o1f.replace(_oa, _on('[số ẩn]'));
return { text: _o1f, count };
}
const _oh = /^[[(]?(\d{1,2}[:h]\d{2})(?:\s*(?:SA|CH|AM|PM))?[\])]?$/i;
const _o4 = /^((hôm nay|hôm qua|hom nay|hom qua)|((thứ\s*\d|chủ\s*nhật|cn|t\d)[ ,]*)?\d{1,2}\/\d{1,2}(\/\d{2,4})?)$/i;
const _oc = /^[[(]?(\d{1,2}[:h]\d{2})[\])]?\s*[-–]?\s*([^:]{1,40}?)\s*:\s*(.+)$/;
const _o7 = /^([^:\d\s][^:]{0,39}?)\s*:\s*(.+)$/;
const _oi = /\s+[[(]?(\d{1,2}:\d{2})[\])]?$/;
const _o17 = _o1f => _o1f.length <= 40 && _o1f.split(/\s+/).length <= 5 && !/[\d?!.,:;]/.test(_o1f);
const _o1r = _o1f => _o1f.split(/\s+/).filter(Boolean).length;
export function parseChat(raw, { me = '' } = {}) {
const _o15 = new Set(String(me || '').split(',').map(fold).filter(Boolean));
const lines = _oq(raw).split('\n').map(l => l.trim()).filter(l => l && !_o4.test(l));
const _o1a = [];
const _o1o = lines.filter(l => _oh.test(l)).length;
const _o1c = lines.map(l => {
if (_oh.test(l)) return { kind: 'time', time: l.match(_oh)[1].replace('h', ':') };
let _o14 = _oc.exec(l);
if (_o14 && _o1r(_o14[2]) <= 5) return { kind: 'msg', label: _o14[2].trim(), strong: true, time: _o14[1].replace('h', ':'), text: _o14[3].trim(), raw: l };
_o14 = _o7.exec(l);
if (_o14 && _o1r(_o14[1]) <= 5) return { kind: 'msg', label: _o14[1].trim(), strong: false, time: '', text: _o14[2].trim(), raw: l };
return { kind: 'msg', label: '', time: '', text: l, raw: l };
});
const _o1n = new Map();
for (const _o1b of _o1c) if (_o1b.label) _o1n.set(fold(_o1b.label), (_o1n.get(fold(_o1b.label)) || 0) + 1);
const _o11 = _o1b => _o1b.label && (_o1b.strong || _o1n.get(fold(_o1b.label)) >= 2 || _o15.has(fold(_o1b.label)));
const _oj = _o1c.some(_o11);
if (_o1o >= 2 && !_oj) {
let _om = [], who = '';
const _oy = time => {
if (!_om.length) return;
if (_om.length >= 2 && _o17(_om[0])) { who = _om[0]; _om = _om.slice(1); }
for (const t of _om) _o1a.push({ who, text: t, time: '' });
if (time) _o1a[_o1a.length - 1].time = time;
_om = [];
};
for (const _o1b of _o1c) { if (_o1b.kind === 'time') _oy(_o1b.time); else _om.push(_o1b.raw); }
_oy('');
return _o1a.slice(-LIMITS.maxLines);
}
let who = '';
for (const _o1b of _o1c) {
if (_o1b.kind === 'time') { if (_o1a.length && !_o1a[_o1a.length - 1].time) _o1a[_o1a.length - 1].time = _o1b.time; continue; }
let text = _o1b.text, time = _o1b.time;
if (_o11(_o1b)) who = _o1b.label; else text = _o1b.raw;
const _o1p = _oi.exec(text);
if (_o1p && !time) { time = _o1p[1]; text = text.slice(0, _o1p.index).trim(); }
if (text) _o1a.push({ who, text, time });
}
return _o1a.slice(-LIMITS.maxLines);
}
const ME_ALIASES = ['toi', 'me', 'ban', 'sale'];
export function customerLines(msgs, me = '') {
const _o15 = new Set([...String(me || '').split(',').map(fold).filter(Boolean), ...ME_ALIASES]);
const _o13 = t => { const _o14 = /^([^:]{1,40}):/.exec(t || ''); return _o14 ? fold(_o14[1]) : ''; };
const k = (msgs || []).filter(_o14 => !(_o14.who && _o15.has(fold(_o14.who))) && !_o15.has(_o13(_o14.text)));
return k.length ? k : (msgs || []);
}
export const CONCERNS = [
{ id: 'gia', label: 'Sợ đắt / so giá', kw: ['dat qua', 'dat the', 'dat vay', 'hoi dat', 'gia cao', 'cao qua', 'mac qua', 're hon', 'giam gia', 'chiet khau', 'bot duoc', 'bot gia', 'co bot', 'gia bao nhieu', 'bao nhieu tien', 'tong gia', 'tong tien', 'qua tam', 'vuot tam', 'ngan sach'] },
{ id: 'phap_ly', label: 'Lo pháp lý', kw: ['so do', 'so hong', 'phap ly', 'giay phep', 'hdmb', 'hop dong mua ban', 'bao lanh', 'so huu', 'lau dai', '50 nam', 'tranh chap', 'quy hoach', 'ra so', 'co so', 'giay to', 'thue dat'] },
{ id: 'tai_chinh', label: 'Lo vay / tài chính', kw: ['vay ngan hang', 'vay duoc', 'cho vay', 'khoan vay', 'vay von', 'vay bao nhieu', 'ngan hang', 'lai suat', 'an han', 'tra gop', 'tien do thanh toan', 'tra truoc', 'goc lai', 'thu nhap', 'tra hang thang', 'xoay tien', 'chua du tien', 'du tien'] },
{ id: 'tham_do', label: 'Đang thăm dò', kw: ['tham khao', 'tim hieu', 'xem thu', 'chua co nhu cau', 'chua can', 'chua voi', 'de sau', 'hoi cho biet', 'hoi thu', 'xem qua', 'chi xem', 'luc nao can', 'tu tu', 'suy nghi them', 'can nhac them'] },
{ id: 'so_sanh', label: 'So sánh dự án khác', kw: ['so voi', 'so sanh', 'du an khac', 'ben kia', 'ben khac', 'cho khac', 'dang xem them', 'xem them du an', 'con dang xem', 'hon ben', 'noi khac'] },
{ id: 'nguoi_nha', label: 'Cần hỏi người nhà', kw: ['hoi vo', 'hoi chong', 'ban voi vo', 'ban voi chong', 'ban voi gia dinh', 've ban', 'hoi y kien', 'gia dinh', 'nguoi nha', 'bo me', 'ong xa', 'ba xa', 'vo chong', 'vo em', 'chong em', 'vo anh/chị', 'chong chi', 'ca nha', 'thong nhat'] },
{ id: 'san_sang', label: 'Sắp sẵn sàng', kw: ['xem nha', 'xem can', 'nha mau', 'dat coc', 'giu cho', 'giu can', 'ky hop dong', 'thu tuc', 'lich xem', 'hen xem', 'khi nao xem', 'qua xem', 'mua luon', 'chot', 'lay can', 'dang ky', 'can chuan bi gi'] },
];
const _o3 = new Set(CONCERNS.map(_oo => _oo.id));
const _o1 = new Map(CONCERNS.map(_oo => [_oo.id, _oo]));
const norm = _o1f => ' ' + fold(_o1f).replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
const _ow = (_o1f, max = 60) => { const t = String(_o1f).replace(/\s+/g, ' ').trim(); return t.length > max ? t.slice(0, max - 1) + '…' : t; };
function _o1h(lines) {
const _o16 = lines.length;
const res = new Map();
lines.forEach((_o14, i) => {
const w = 1 + 2 * (i + 1) / _o16;
const t = norm(_o14.text);
for (const _oo of CONCERNS) {
const _o10 = _oo.kw.filter(k => t.includes(' ' + k + ' '));
if (!_o10.length) continue;
const r = res.get(_oo.id) || { id: _oo.id, label: _oo.label, score: 0, lines: 0, best: null };
r.score += w * _o10.length; r.lines++;
if (!r.best || w >= r.best.w) r.best = { w, text: _o14.text };
res.set(_oo.id, r);
}
});
const _o19 = id => CONCERNS.findIndex(_oo => _oo.id === id);
return [...res.values()].sort((a, _ok) => _ok.score - a.score || _o19(a.id) - _o19(_ok.id)).map(r => ({
id: r.id, label: r.label, score: Math.round(r.score * 10) / 10,
reason: 'Khách viết “' + _ow(r.best.text) + '”' + (r.lines > 1 ? ' (+' + (r.lines - 1) + ' chỗ khác)' : ''),
}));
}
export const OPTIONS = [
{ id: 'soft', label: 'Mềm mỏng, giữ mối' },
{ id: 'urgency', label: 'Nên quyết sớm (theo sự thật)' },
{ id: 'meet', label: 'Chốt hẹn gặp / xem nhà' },
];
const _ob = new Set(OPTIONS.map(o => o.id));
const _og = {
gia: 'Dạ em hiểu, số tiền lớn nên anh/chị cân nhắc kỹ là đúng ạ. Em gửi anh/chị bảng tính tổng tiền theo từng phương án thanh toán{du_an} để mình so cho dễ. Anh/chị muốn em tính lại theo ngân sách nào cứ nhắn em nhé.',
phap_ly: 'Dạ pháp lý là điều nên hỏi kỹ nhất ạ. Em gửi anh/chị bản chụp giấy tờ pháp lý hiện có{du_an} và mẫu hợp đồng để mình xem trước; chỗ nào chưa rõ em hỏi lại chủ đầu tư bằng văn bản cho anh/chị. Anh/chị cứ thong thả xem nhé.',
tai_chinh: 'Dạ em hiểu, chuyện vay và trả hàng tháng phải tính cho chắc ạ. Em gửi anh/chị bảng ước tính trả nợ theo vài mức vay để tham khảo; lãi suất chính xác ngân hàng sẽ báo khi thẩm định. Anh/chị muốn gặp cán bộ ngân hàng tư vấn trực tiếp thì báo em nhé.',
tham_do: 'Dạ anh/chị cứ tham khảo thoải mái ạ. Em gửi anh/chị tài liệu tổng quan{du_an} (vị trí, mặt bằng, giá tham khảo) để mình có cái nhìn chung. Khi nào anh/chị cần hỏi thêm, nhắn em lúc nào cũng được ạ.',
so_sanh: 'Dạ so sánh vài nơi trước khi chọn là rất hợp lý ạ. Em gửi anh/chị bảng so sánh theo vị trí, pháp lý, tiến độ, tổng tiền – có nguồn – để mình tự đánh giá. Anh/chị quan tâm tiêu chí nào nhất, em bổ sung đúng phần đó nhé.',
nguoi_nha: 'Dạ quyết định lớn thì cả nhà cùng bàn là nên ạ. Em gửi anh/chị bản tóm tắt ngắn{du_an} (giá, diện tích, pháp lý, tiến độ thanh toán) để tiện gửi người nhà xem. Nhà mình có câu hỏi gì em giải đáp luôn ạ.',
san_sang: 'Dạ vâng ạ. Em gửi anh/chị danh sách giấy tờ cần chuẩn bị và các bước tiếp theo{du_an} để mình chủ động. Có gì chưa rõ anh/chị hỏi em ngay nhé.',
};
const _o2 = {
gia: 'Anh/chị muốn em gửi bảng tính cho căn nào trước ạ?',
phap_ly: 'Em gửi kèm bản chụp văn bản để anh/chị tự kiểm tra ạ.',
tai_chinh: 'Anh/chị muốn em tính thử khoản vay theo mức nào ạ?',
tham_do: 'Anh/chị cần em lưu ý loại căn nào để báo khi có thông tin mới ạ?',
so_sanh: 'Em gửi kèm nguồn để anh/chị đối chiếu với các nơi đang xem ạ.',
nguoi_nha: 'Anh/chị gửi người nhà xem cùng, có câu hỏi em trả lời ngay ạ.',
san_sang: 'Anh/chị báo em để em chuẩn bị giấy tờ cho kịp ạ.',
};
const _o9 = {
gia: ', em chuẩn bị sẵn bảng tính tổng tiền để mình xem luôn',
phap_ly: ', em mang theo bản giấy tờ pháp lý để mình xem trực tiếp',
tai_chinh: ', em mời cán bộ ngân hàng cùng tính khoản vay cho mình',
tham_do: '',
so_sanh: ', mình xem tận nơi sẽ dễ so hơn qua ảnh',
nguoi_nha: ', mình đi cùng người nhà luôn cho tiện',
san_sang: ', em chuẩn bị sẵn giấy tờ và căn phù hợp',
};
export function parseFacts(_o1f) {
return _oq(_o1f).split('\n').map(x => x.trim().replace(/^[-•*]\s*/, '')).filter(Boolean).slice(0, LIMITS.factsMax)
.map(x => maskPII(x).text.slice(0, LIMITS.factMax));
}
const _o5 = d => (d === 0 ? 'Chủ nhật' : 'Thứ ' + (d + 1));
const _o1q = _o16 => String(_o16).padStart(2, '0');
const _o1j = d => d.getHours() + ':' + _o1q(d.getMinutes()) + ' ' + _o5(d.getDay()) + ' (' + _o1q(d.getDate()) + '/' + _o1q(d.getMonth() + 1) + ')';
export function suggestSlots(now = Date.now()) {
const _ok = new Date(now);
const _ot = new Date(_ok.getFullYear(), _ok.getMonth(), _ok.getDate() + 1, 10, 0);
let _ou;
if (_ot.getDay() === 6 || _ot.getDay() === 0) _ou = new Date(_ot.getFullYear(), _ot.getMonth(), _ot.getDate() + 1, 15, 0);
else { _ou = new Date(_ot.getFullYear(), _ot.getMonth(), _ot.getDate() + 1, 15, 0); while (_ou.getDay() !== 6 && _ou.getDay() !== 0) _ou.setDate(_ou.getDate() + 1); }
return [_o1j(_ot), _o1j(_ou)];
}
export function buildOptions(concernId, { facts = [], slots, project = '', now = Date.now() } = {}) {
const _oo = _o3.has(concernId) ? concernId : 'tham_do';
const _ov = project ? ' của dự án ' + project : '';
const _o1i = Array.isArray(slots) && slots.filter(Boolean).length >= 2 ? slots.filter(Boolean).slice(0, 2) : suggestSlots(now);
const urgency = facts.length
? 'Dạ em báo anh/chị thông tin chính thức hiện tại để mình chủ động cân nhắc thời điểm:\n' + facts.map(f => '- ' + f).join('\n') + '\nEm gửi kèm văn bản/nguồn để anh/chị kiểm tra. ' + _o2[_oo]
: 'Dạ để anh/chị chủ động quyết định: thông tin còn căn và chính sách bán hàng có thể thay đổi theo thời điểm, em sẽ cập nhật anh/chị bản mới nhất ngay khi có ạ. ' + _o2[_oo];
return [
{ id: 'soft', label: OPTIONS[0].label, text: _og[_oo].replace('{du_an}', _ov) },
{ id: 'urgency', label: OPTIONS[1].label, text: urgency, factual: facts.length > 0 },
{ id: 'meet', label: OPTIONS[2].label, text: 'Dạ để anh/chị xem tận nơi cho chắc, em mời mình qua xem nhà mẫu/căn thực tế' + _ov + ' vào ' + _o1i[0] + ' hoặc ' + _o1i[1] + _o9[_oo] + '. Khung nào tiện anh/chị báo em giữ lịch nhé; nếu cả hai chưa hợp em đổi theo giờ của mình ạ.' },
];
}
export const AVOID_GENERAL = [
'Hứa lợi nhuận hay “cam kết tăng giá” – trái quy định quảng cáo BĐS, dễ mất uy tín.',
'Nói xấu, chê dự án/chủ đầu tư khác – chỉ so bằng số liệu có nguồn.',
'Tạo khan hiếm không có thật (“chỉ còn 1 căn”, “hết hôm nay”) khi chưa kiểm tra.',
];
export const AVOID_BY = {
gia: ['“Giá này rẻ nhất thị trường” – không chứng minh được.', 'Tự hứa chiết khấu ngoài chính sách.'],
phap_ly: ['“Chắc chắn có sổ ngày…” khi chưa có văn bản của chủ đầu tư.', 'Gạt đi câu hỏi pháp lý (“bên em uy tín lắm, anh/chị yên tâm”).'],
tai_chinh: ['“Chắc chắn vay được” hay hứa lãi suất cố định lâu dài.', 'Khuyên vay quá khả năng trả nợ.'],
tham_do: ['Gửi dồn dập nhiều tin, gọi liên tục.', 'Giục đặt cọc khi khách mới tìm hiểu.'],
so_sanh: ['Chê bên kia “lừa đảo”, “dởm” – nói điểm mạnh của mình bằng số liệu.'],
nguoi_nha: ['Giục “quyết luôn hôm nay kẻo hết” khi khách cần bàn với gia đình.'],
san_sang: ['Hứa quà/chiết khấu không có trong chính sách để chốt nhanh.', 'Nhận tiền cọc ngoài hợp đồng/phiếu thu chính thức.'],
};
const _oe = [
[/cam ket (loi nhuan|lai|tang gia|sinh loi)/, 'cam kết lợi nhuận/tăng giá'],
[/loi nhuan \d+ ?%/, 'hứa lợi nhuận %'],
[/chac chan (lai|loi|tang)/, 'chắc chắn lãi/tăng'],
[/(dam bao|bao dam) (loi nhuan|tang gia|sinh loi)/, 'bảo đảm lợi nhuận'],
[/khong lo lo/, '“không lo lỗ”'],
[/(re|tot) nhat thi truong/, '“rẻ/tốt nhất thị trường”'],
[/chi con \d+ can/, '“chỉ còn … căn” (kiểm tra có thật)'],
[/het hom nay|hom nay thoi|sap het hang/, 'giục “hết hôm nay”'],
[/sap tang gia/, '“sắp tăng giá” (cần văn bản)'],
[/lua dao|dom|bip bom/, 'nói xấu bên khác'],
[/xin loi/, 'chữ “xin lỗi”'],
];
export function riskyPhrases(text) {
const t = norm(text);
return _oe.filter(([re]) => re.test(t)).map(([, l]) => l);
}
function _o1m(_o1f, max) {
if (_o1f.length <= max) return _o1f;
const _os = _o1f.slice(-max);
const _o18 = _os.indexOf('\n');
return _o18 >= 0 && _o18 < _os.length - 1 ? _os.slice(_o18 + 1) : _os;
}
export function analyze(raw, { me = '', facts = '', slots, project = '', now = Date.now() } = {}) {
const _o1k = _oq(raw);
if (!_o1k.trim()) return { empty: true, truncated: false, masked: '', maskedCount: 0, messages: [], concern: null, concerns: [], options: [], slots: [], avoid: [] };
const truncated = _o1k.length > LIMITS.maxChars;
const _o14 = maskPII(_o1m(_o1k, LIMITS.maxChars));
const masked = _o1m(_o14.text, LIMITS.maxChars);
const messages = parseChat(masked, { me });
const _or = customerLines(messages, me);
const concerns = _o1h(_or);
const concern = concerns[0] || { id: 'tham_do', label: _o1.get('tham_do').label, score: 0, reason: 'Chưa thấy dấu hiệu rõ – có thể khách đang thăm dò, nên hỏi thêm nhu cầu.' };
const _ox = Array.isArray(facts) ? facts : parseFacts(facts);
const _o1i = Array.isArray(slots) && slots.filter(Boolean).length >= 2 ? slots.filter(Boolean).slice(0, 2) : suggestSlots(now);
return {
empty: false, truncated, masked, maskedCount: _o14.count, messages, concern, concerns,
options: buildOptions(concern.id, { facts: _ox, slots: _o1i, project, now }), slots: _o1i,
avoid: [...AVOID_GENERAL, ...(AVOID_BY[concern.id] || [])],
};
}
export function buildPrompt({ chat = '', facts = '', me = '', project = '', slots, now = Date.now() } = {}) {
const masked = _o1m(maskPII(_o1m(_oq(chat), LIMITS.maxChars)).text, LIMITS.maxChars);
const _ox = Array.isArray(facts) ? facts.map(f => maskPII(f).text) : parseFacts(facts);
const _o1i = Array.isArray(slots) && slots.filter(Boolean).length >= 2 ? slots.slice(0, 2) : suggestSlots(now);
return [
'Bạn là trợ lý cho nhân viên môi giới bất động sản TRUNG THỰC ở Việt Nam. Dưới đây là đoạn chat Zalo với khách (đã che số điện thoại, email, số tài khoản, CCCD).',
me ? 'Tin của nhân viên mang tên: ' + maskPII(me).text.slice(0, 80) + ' (còn lại là của khách).' : '',
project ? 'Dự án đang tư vấn: ' + String(project).slice(0, 80) + '.' : '',
'--- ĐOẠN CHAT ---', masked, '--- HẾT ---',
'Nhiệm vụ: xác định khách đang băn khoăn điều gì nhất, chọn 1 mã: ' + CONCERNS.map(_oo => _oo.id + ' (' + _oo.label + ')').join(', ') + '; nêu lý do ngắn (dưới 25 chữ).',
'Viết 3 phương án trả lời (xưng "em", gọi "anh/chị", mỗi phương án dưới 80 chữ):',
'- soft: mềm mỏng giữ mối – đồng cảm, cung cấp 1 thông tin hữu ích, mở cửa cho lần sau.',
_ox.length
? '- urgency: nên quyết sớm, CHỈ dựa trên các sự thật sau (không thêm số liệu nào khác):\n' + _ox.map(f => '  • ' + f).join('\n')
: '- urgency: chỉ nhắc "thông tin còn căn/chính sách có thể thay đổi, em cập nhật anh/chị bản mới nhất". KHÔNG nêu bất kỳ con số, hạn chót, số căn còn lại nào.',
'- meet: mời gặp trực tiếp/xem nhà vào ' + _o1i[0] + ' hoặc ' + _o1i[1] + '.',
'Luật bắt buộc: không bịa số liệu, không hứa lợi nhuận, không cam kết tăng giá, không tạo khan hiếm giả, không nói xấu dự án/chủ đầu tư khác, không dùng chữ "xin lỗi".',
'Chỉ trả về JSON: {"concern":"…","reason":"…","soft":"…","urgency":"…","meet":"…"}',
].filter(Boolean).join('\n');
}
const _of = /chi con|sap het|cuoi cung|sap tang|tang gia|het han|duy nhat|hom nay thoi|het hom nay/;
export function parseAiJson(t, { facts = '' } = {}) {
const _o1f = String(t || '');
const a = _o1f.indexOf('{'), _ok = _o1f.lastIndexOf('}');
if (a < 0 || _ok <= a) return null;
let _o12;
try { _o12 = JSON.parse(_o1f.slice(a, _ok + 1)); } catch { return null; }
if (!_o12 || typeof _o12 !== 'object') return null;
const _o1l = v => (typeof v === 'string' ? maskPII(v).text.trim().slice(0, LIMITS.aiFieldMax) : '');
const _o1g = v => { const x = _o1l(v); return x && !riskyPhrases(x).length ? x : ''; };
const _oz = (Array.isArray(facts) ? facts : parseFacts(facts)).length > 0;
let urgency = _o1g(_o12.urgency);
if (urgency && !_oz && (/\d/.test(urgency) || _of.test(norm(urgency)))) urgency = '';
return { concern: _o3.has(_o12.concern) ? _o12.concern : '', reason: _o1l(_o12.reason).slice(0, 200), soft: _o1g(_o12.soft), urgency, meet: _o1g(_o12.meet) };
}
export const RESULTS = [['good', 'Khách phản hồi tốt'], ['bad', 'Không'], ['unknown', 'Chưa rõ']];
const _od = new Set(RESULTS.map(r => r[0]));
const _op = v => ({ good: Math.max(0, Number(v && v.good) || 0), bad: Math.max(0, Number(v && v.bad) || 0), unknown: Math.max(0, Number(v && v.unknown) || 0) });
export function recordOutcome(stats, concernId, optionId, result) {
if (!_o3.has(concernId) || !_ob.has(optionId) || !_od.has(result)) return stats;
const _o1f = { ...(stats || {}) };
const _o1e = { ...(_o1f[concernId] || {}) };
const _oo = _op(_o1e[optionId]); _oo[result]++;
_o1e[optionId] = _oo; _o1f[concernId] = _o1e;
return _o1f;
}
const _o1d = _oo => (_oo.good + _oo.bad >= 2 ? (_oo.good + 1) / (_oo.good + _oo.bad + 2) : 0.5);
export function rankOptions(ids, stats, concernId) {
const _o1e = (stats && _o3.has(concernId) && stats[concernId]) || {};
return ids.map((id, i) => ({ id, i, r: _o1d(_op(_o1e[id])) })).sort((a, _ok) => _ok.r - a.r || a.i - _ok.i).map(x => x.id);
}
export function statLabel(stats, concernId, optionId) {
const _o1e = (stats && _o3.has(concernId) && stats[concernId]) || {};
const _oo = _op(_o1e[optionId]);
const _o16 = _oo.good + _oo.bad + _oo.unknown;
return _o16 ? 'Đã ghi ' + _o16 + ' lần · tốt ' + _oo.good : '';
}
export function loadStats(storage) {
try {
const _o12 = JSON.parse(storage.getItem(STATS_KEY) || '{}');
if (!_o12 || typeof _o12 !== 'object' || Array.isArray(_o12)) return {};
const _o1a = {};
for (const [k, _o1e] of Object.entries(_o12)) {
if (!_o3.has(k) || !_o1e || typeof _o1e !== 'object') continue;
_o1a[k] = {};
for (const [o, v] of Object.entries(_o1e)) if (_ob.has(o)) _o1a[k][o] = _op(v);
}
return _o1a;
} catch { return {}; }
}
export function saveStats(storage, stats) {
try { storage.setItem(STATS_KEY, JSON.stringify(stats || {})); return true; } catch { return false; }
}

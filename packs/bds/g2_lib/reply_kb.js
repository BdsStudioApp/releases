import { fold } from './core.js';
const PLACES = ['ha noi', 'hn', 'hung yen', 'van giang', 'van lam', 'gia lam', 'long bien', 'dong anh', 'me linh', 'soc son', 'nam tu liem', 'bac tu liem',
'tu liem', 'thanh xuan', 'cau giay', 'ha dong', 'hoang mai', 'hai ba trung', 'dong da', 'ba dinh', 'tay ho', 'hoan kiem', 'thanh tri', 'thuong tin', 'hoai duc',
'dan phuong', 'son tay', 'hai phong', 'bac ninh', 'bac giang', 'hai duong', 'thai nguyen', 'vinh phuc', 'quang ninh', 'ha long', 'nam dinh', 'ninh binh', 'thai binh',
'ha nam', 'sai gon', 'hcm', 'tphcm', 'thu duc', 'da nang', 'co loa', 'vu yen', 'trung tam', 'noi do', 'ngoai thanh'];
const _o0 = /\b(a|ah|ha|ko|k|khong|chua|nhi|nhe|vay|vayy|the|sao|ak|hong|ha)$/;
export const RULES = [
{ id: 'gia_cao', label: 'Chê giá cao', kw: ['dat qua', 'cao qua', 'mac qua', 'gia cao', 'dat the', 'dat vay', 'dat nhi', 'dat thi', 'chat qua', 'chem gia', 'thoi gia', 'gia ao', 'ngao gia', 'kho voi', 'khong du tien', 'vuot tam', 'hoi dat', 'qua dat'] },
{ id: 'so_sanh', label: 'So sánh dự án', kw: ['so voi', 'so sanh', 'hay hon', 'tot hon', 'khac gi', 'khac nhau', 'nen chon', 'chon cai nao', 'ben kia', 're hon', 'hon khong', 'vs', 'hay la'] },
{ id: 'vi_tri', label: 'Hỏi vị trí / đi lại', kw: ['o dau', 'vi tri', 'dia chi', 'cho nao', 'khu nao', 'tinh nao', 'quan nao', 'huyen nao', 'phuong nao', 'nam o', 'thuoc', 'gan', 'xa', 'cach', 'bao xa', 'may km', 'km', 'bao lau', 'may phut', 'duong nao', 'ban do', 'dinh vi', 'di lai', 'ket noi', 'di chuyen'] },
{ id: 'gia', label: 'Hỏi giá', kw: ['gia', 'bao nhieu', 'xin gia', 'bang gia', 'tr m2', 'm2', 'trieu', 'ty', 'tong tien', 'gia ca', 'bao tien', 'nhieu tien', 'gia ban', 'gia goc'] },
{ id: 'phap_ly', label: 'Hỏi pháp lý', kw: ['phap ly', 'so do', 'so hong', 'so rieng', 'giay phep', 'giay to', 'hdmb', 'hop dong', 'bao lanh', 'lau dai', '50 nam', 'so huu', 'quy hoach', 'nguoi nuoc ngoai', 'du dieu kien', 'co so'] },
{ id: 'tien_do', label: 'Hỏi tiến độ / bàn giao', kw: ['tien do', 'ban giao', 'bao gio', 'khi nao', 'luc nao', 'nam nao', 'xay den dau', 'cat noc', 'xong chua', 'da xay', 'hoan thien', 'nhan nha', 'o duoc chua', 'dong tho', 'mo ban'] },
{ id: 'chinh_sach', label: 'Hỏi chính sách / thanh toán', kw: ['chinh sach', 'uu dai', 'chiet khau', 'qua tang', 'khuyen mai', 'ho tro lai', 'htls', 'thanh toan', 'tra truoc', 'tra cham', 'gian', 'dong tien', 'dat coc', 'coc'] },
{ id: 'vay', label: 'Hỏi vay ngân hàng', kw: ['vay', 'lai suat', 'tra gop', 'ngan hang', 'gop', 'an han', 'tha noi', 'lai 0'] },
{ id: 'loai_can', label: 'Hỏi loại căn / diện tích', kw: ['studio', '1n', '2n', '3n', '4n', '1pn', '2pn', '3pn', 'phong ngu', 'pn', 'dien tich', 'bao nhieu met', 'met vuong', 'duplex', 'penthouse', 'can goc', 'tang', 'view', 'huong'] },
{ id: 'xem', label: 'Muốn xem nhà', kw: ['xem nha', 'nha mau', 'di xem', 'tham quan', 'hen', 'xem thuc te', 'dan di', 'qua xem'] },
{ id: 'che', label: 'Chê / nghi ngờ', kw: ['lua', 'lua dao', 'ao', 'phong gia', 'ngao', 'tham', 'cham tien do', 'treo', 'bo hoang', 'chat luong kem', 'chua tin', 'nghi'] },
{ id: 'cho', label: 'Chần chừ', kw: ['de sau', 'cho them', 'chua vo', 'chua voi', 'suy nghi them', 'tu tu', 'cho gia giam', 'can nhac', 'de xem da'] },
{ id: 'quan_tam', label: 'Muốn nhận thông tin', kw: ['ib', 'inbox', 'check ib', 'xin thong tin', 'tu van', 'cho xin', 'quan tam', 'thong tin', 'chi tiet', 'gui em', 'gui minh', 'nhan tin'] },
];
export function norm(text) {
const _oh = String(text || '').toLowerCase().replace(/đất/g, ' datland ').replace(/vậy/g, ' vayy ').replace(/m²/g, ' m2 ');
return ' ' + fold(_oh).replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
}
const has = (n, k) => n.includes(' ' + k + ' ');
const _oe = p => [...new Set(fold([p.name, p.loc, p.area].filter(Boolean).join(' · ')).split(/\s*[·,–-]\s*/).map(x => x.replace(/[^a-z0-9]+/g, ' ').trim()).filter(x => x.length > 2))];
export function detect(text, { project = null, projects = [] } = {}) {
const n = norm(text);
if (!n.trim()) return [];
const out = new Map();
const _o1 = (id, hit, _ok = 1) => { const _og = RULES.find(x => x.id === id); const _oa = out.get(id) || { id, label: _og.label, hits: [], pts: 0 }; _oa.hits.push(hit); _oa.pts += _ok; out.set(id, _oa); };
for (const _og of RULES) for (const k of _og.kw) if (has(n, k)) _o1(_og.id, k, k.includes(' ') ? 2 : 1);
if (/đắt|mắc quá|chát/.test(String(text || '').toLowerCase())) _o1('gia_cao', 'đắt', 2);
const _od = PLACES.filter(pl => has(n, pl));
if (project) for (const _ok of _oe(project)) if (_ok !== fold(project.name || '').replace(/[^a-z0-9]+/g, ' ').trim() && has(n, _ok)) _od.push(_ok);
if (_od.length) _o1('vi_tri', 'địa danh: ' + _od[0], _o0.test(n.trim()) || n.trim().split(' ').length <= 6 ? 3 : 1);
const others = (projects || []).filter(p => p && p.name && (!project || p.id !== project.id)).filter(p => { const _ok = fold(p.name).replace(/[^a-z0-9]+/g, ' ').trim(); return _ok.length > 4 && has(n, _ok); });
if (others.length) _o1('so_sanh', 'dự án khác: ' + others[0].name, 3);
if (has(n, 'datland') && !out.size) _o1('vi_tri', 'đất', 1);
if (out.has('gia_cao') && out.has('gia') && out.get('gia').pts <= 1) out.delete('gia');
if (out.has('gia') && out.size > 1 && out.get('gia').hits.every(k => k === 'bao nhieu')) out.delete('gia');
const _ob = RULES.map(_og => _og.id);
return [...out.values()].sort((a, b) => b.pts - a.pts || _ob.indexOf(a.id) - _ob.indexOf(b.id)).map(_oa => ({ id: _oa.id, label: _oa.label, hits: _oa.hits, others: _oa.id === 'so_sanh' ? others.map(p => p.name) : undefined }));
}
const _on = _oh => { const _o8 = /^(\d{4})-(\d{2})/.exec(String(_oh || '')); return _o8 ? _o8[2] + '/' + _o8[1] : String(_oh || ''); };
const num = x => String(Math.round(x * 10) / 10).replace('.', ',');
const STATUS = { sale: 'đang mở bán', soon: 'sắp mở bán', done: 'đã bàn giao, đang có căn chuyển nhượng', ask: 'đang nhận đăng ký bảng giá & giỏ hàng', low: 'thấp tầng, có căn mua bán & cho thuê' };
export function projectFacts(p, { policies = null } = {}) {
if (!p) return null;
const loc = String(p.loc || '').replace(/\s*·\s*/g, ', ').trim();
const types = (p.types || []).filter(t => t && t.n);
const sized = types.filter(t => Array.isArray(t.a) && t.a.length);
const typeLine = types.length ? types.map(t => t.n).join(', ') : '';
const areaLine = sized.length ? 'từ khoảng ' + num(Math.min(...sized.map(t => t.a[0]))) + ' m² (' + sized[0].n + ') đến ' + num(Math.max(...sized.map(t => t.a[t.a.length - 1]))) + ' m² (' + sized[sized.length - 1].n + ')' : '';
const price = Array.isArray(p.price) && p.price.length ? (p.price[0] === p.price[1] || p.price[1] == null ? 'khoảng ' + num(p.price[0]) : 'khoảng ' + num(p.price[0]) + '–' + num(p.price[1])) + ' triệu/m²' : '';
const pol = policies && p.pol && Array.isArray(policies[p.pol]) ? policies[p.pol].map(x => x.name + (x.sub ? ' (' + x.sub + ')' : '')) : [];
return {
name: p.name || 'dự án', dev: p.dev || '', loc, area: p.area || '', status: STATUS[p.status] || '',
handover: p.handover ? _on(p.handover) : '', price, typeLine, areaLine, policies: pol,
legal: p.legal || '', progress: p.progress || '', scale: p.scale || '', amenities: p.amenities ? String(p.amenities).split(/[,;\n]+/).map(_oh => _oh.trim()).filter(Boolean) : [],
};
}
export function highlights(f, skip = []) {
if (!f) return [];
const _o3 = [];
if (f.dev && !skip.includes('dev')) _o3.push('do ' + f.dev + ' phát triển');
if (f.handover && !skip.includes('handover')) _o3.push('dự kiến bàn giao ' + f.handover);
else if (f.status && !skip.includes('status')) _o3.push(f.status);
if (f.amenities.length && !skip.includes('amenities')) _o3.push('tiện ích ' + f.amenities.slice(0, 2).join(', '));
if (f.typeLine && !skip.includes('types')) _o3.push('có các loại căn ' + f.typeLine);
return _o3.slice(0, 2);
}
const _o4 = _oh => _oh ? _oh[0].toUpperCase() + _oh.slice(1) : _oh;
const join = a => a.length > 1 ? a.slice(0, -1).join(', ') + ' và ' + a[a.length - 1] : (a[0] || '');
export function placeMatch(text, f) {
if (!f) return '';
const n = norm(text);
const _oi = PLACES.filter(pl => has(n, pl) && !['trung tam', 'noi do', 'ngoai thanh'].includes(pl));
if (!_oi.length) return '';
const _om = ' ' + fold([f.loc, f.area].join(' ')).replace(/[^a-z0-9]+/g, ' ') + ' ';
const _o2 = { hn: 'ha noi', hcm: 'ho chi minh', tphcm: 'ho chi minh', 'sai gon': 'ho chi minh' };
return _oi.some(pl => _om.includes(' ' + (_o2[pl] || pl) + ' ')) ? 'yes' : 'no';
}
export function composeReply(text, intents, f) {
if (!f) return null;
const _oj = (intents[0] || {}).id || '';
const _o9 = f.name;
const _o6 = 'Em gửi anh/chị thông tin chi tiết qua tin nhắn riêng nhé ạ.';
const ask = 'Anh/chị tìm căn để ở hay đầu tư, khoảng tài chính dự kiến bao nhiêu để em gửi căn phù hợp ạ?';
let _of = '', priv = '', used = [];
if (_oj === 'vi_tri') {
const _o8 = placeMatch(text, f);
const _om = f.loc || f.area;
const _o5 = highlights(f);
const _o7 = !_om ? 'Dạ ' + _o9 + ' em gửi anh/chị vị trí chính xác kèm bản đồ ạ.'
: _o8 === 'yes' ? 'Dạ đúng rồi ạ, ' + _o9 + ' nằm tại ' + _om + '.'
: _o8 === 'no' ? 'Dạ em nói rõ để anh/chị khỏi nhầm ạ: ' + _o9 + ' nằm tại ' + _om + '.'
: 'Dạ ' + _o9 + ' nằm tại ' + _om + ' ạ.';
_of = _o7 + (_o5.length ? ' Dự án ' + join(_o5) + '.' : '') + ' Em gửi anh/chị bản đồ và thời gian đi lại thực tế qua tin nhắn nhé ạ.';
priv = _o7 + (_o5.length ? ' Dự án ' + join(_o5) + '.' : '') + (f.amenities.length ? ' Xung quanh có ' + f.amenities.slice(0, 4).join(', ') + '.' : '')
+ ' Anh/chị cho em biết nơi làm việc hoặc trường của con, em đo giúp thời gian đi lại giờ cao điểm để mình tính cho sát ạ.';
used = ['loc'];
} else if (_oj === 'gia') {
_of = 'Dạ ' + _o9 + (f.price ? ' có giá tham khảo ' + f.price + ', tuỳ căn, tầng, hướng' : ' có giá theo từng căn và chính sách tháng') + ' ạ. Em gửi bảng giá mới nhất qua tin nhắn để anh/chị xem chính xác nhé ạ.';
priv = 'Dạ ' + _o9 + (f.price ? ' hiện giá tham khảo ' + f.price + ' (đã gồm VAT và phí bảo trì, tuỳ căn)' : '') + '.' + (f.typeLine ? ' Dự án có ' + f.typeLine + (f.areaLine ? ', diện tích ' + f.areaLine : '') + '.' : '')
+ ' Anh/chị quan tâm loại căn nào và khoảng tài chính bao nhiêu để em gửi bảng tính tổng tiền theo đúng căn ạ?';
used = ['price'];
} else if (_oj === 'gia_cao') {
_of = 'Dạ em cảm ơn anh/chị góp ý ạ. Em gửi riêng bảng so sánh giá/m² ' + _o9 + ' với các dự án cùng khu vực, có nguồn, để mình tham khảo nhé ạ.';
priv = 'Dạ em hiểu, số tiền lớn nên anh/chị cân nhắc là đúng ạ.' + (f.price ? ' ' + _o9 + ' hiện ' + f.price + '.' : '') + ' Em đặt cạnh 2–3 dự án cùng khu vực theo giá/m², phí quản lý, tiến độ thanh toán và thời điểm bàn giao để anh/chị so cho công bằng.'
+ (f.policies.length ? ' Nếu cần nhẹ dòng tiền, dự án có ' + join(f.policies.slice(0, 2)) + '.' : '') + ' Anh/chị thấy cao so với ngân sách hay so với dự án nào ạ?';
used = ['price', 'policies'];
} else if (_oj === 'phap_ly') {
_of = 'Dạ ' + _o9 + (f.dev ? ' do ' + f.dev + ' phát triển' : '') + (f.legal ? ', pháp lý: ' + f.legal : '') + ' ạ. Em gửi riêng các giấy tờ chủ đầu tư công bố để anh/chị tự kiểm tra nhé ạ.';
priv = 'Dạ câu hỏi rất quan trọng ạ. ' + (f.legal ? 'Pháp lý ' + _o9 + ': ' + f.legal + '. ' : '')
+ 'Em gửi anh/chị bản chụp các giấy tờ chủ đầu tư' + (f.dev ? ' ' + f.dev : '') + ' đã công bố (chủ trương đầu tư, giấy phép xây dựng, văn bản đủ điều kiện bán nhà hình thành trong tương lai, bảo lãnh ngân hàng) để mình nhờ luật sư hoặc công chứng kiểm tra độc lập trước khi ký ạ.';
used = ['legal', 'dev'];
} else if (_oj === 'tien_do') {
const _ol = f.handover ? 'dự kiến bàn giao ' + f.handover : (f.status || 'chưa công bố mốc bàn giao chính thức');
_of = 'Dạ ' + _o9 + ' ' + _ol + (f.progress ? ', hiện ' + f.progress : '') + ' ạ. Em gửi ảnh tiến độ thực tế mới nhất qua tin nhắn nhé ạ.';
priv = 'Dạ ' + _o9 + ' ' + _ol + ' theo thông tin chủ đầu tư công bố' + (f.progress ? '; tiến độ hiện tại: ' + f.progress : '') + '. Em gửi anh/chị ảnh/video công trường gần nhất kèm ngày chụp. Anh/chị cần nhận nhà khoảng thời gian nào để em tư vấn đợt thanh toán cho hợp ạ?';
used = ['handover'];
} else if (_oj === 'chinh_sach' || _oj === 'vay') {
_of = 'Dạ ' + _o9 + (f.policies.length ? ' đang có ' + join(f.policies.slice(0, 2)) : ' có chính sách thanh toán theo từng tháng') + ' ạ. Em gửi riêng bảng tính dòng tiền theo căn anh/chị quan tâm nhé ạ.';
priv = 'Dạ ' + _o9 + (f.policies.length ? ' hiện có các phương án: ' + f.policies.join('; ') + '.' : ' có chính sách thanh toán cập nhật theo tháng.')
+ ' Chính sách có thể đổi theo thời điểm nên em kiểm tra lại với chủ đầu tư/ngân hàng trước khi gửi số. Em làm bảng tính tiền phải đóng từng đợt' + (_oj === 'vay' ? ', gồm cả giai đoạn sau khi hết hỗ trợ lãi' : '') + ' theo đúng căn – anh/chị định vay khoảng bao nhiêu phần trăm ạ?';
used = ['policies'];
} else if (_oj === 'loai_can') {
_of = 'Dạ ' + _o9 + (f.typeLine ? ' có ' + f.typeLine + (f.areaLine ? ', diện tích ' + f.areaLine : '') : ' có nhiều loại căn') + ' ạ. Em gửi riêng mặt bằng và căn còn trống nhé ạ.';
priv = 'Dạ ' + _o9 + (f.typeLine ? ' có các loại ' + f.typeLine + (f.areaLine ? ', diện tích ' + f.areaLine : '') + '.' : '.') + (f.price ? ' Giá tham khảo ' + f.price + '.' : '') + ' Gia đình mình mấy người ở, cần mấy phòng ngủ để em lọc căn và hướng phù hợp ạ?';
used = ['types'];
} else if (_oj === 'so_sanh') {
const _oc = (intents[0].others || [])[0] || 'dự án anh/chị đang xem';
_of = 'Dạ em gửi riêng anh/chị bảng so sánh ' + _o9 + ' với ' + _oc + ' theo vị trí, giá/m², chính sách và bàn giao, có nguồn để mình tự đánh giá nhé ạ.';
priv = 'Dạ để so công bằng, em đặt ' + _o9 + (f.loc ? ' (' + f.loc + (f.price ? ', ' + f.price : '') + (f.handover ? ', bàn giao ' + f.handover : '') + ')' : '') + ' cạnh ' + _oc
+ ' cùng tiêu chí: giá/m² thông thuỷ, tổng tiền gồm phí, phí quản lý, tiến độ thanh toán, thời điểm bàn giao. Bên nào hợp nhu cầu hơn em nói thẳng ạ. Anh/chị ưu tiên nhất điều gì: vị trí, giá hay tiện ích ạ?';
used = ['loc', 'price', 'handover'];
} else if (_oj === 'xem') {
_of = 'Dạ ' + _o9 + ' có nhà mẫu' + (f.loc ? ' tại ' + f.loc : '') + ' ạ. Em nhắn riêng để hẹn lịch xem phù hợp với anh/chị nhé ạ.';
priv = 'Dạ em hẹn anh/chị đi xem ' + _o9 + (f.loc ? ' tại ' + f.loc : '') + ' ạ. Anh/chị tiện ngày nào, buổi sáng hay chiều? Em chuẩn bị sẵn bảng giá và căn trống theo nhu cầu để mình xem luôn ạ.';
used = ['loc'];
} else if (_oj === 'che') {
_of = 'Dạ em cảm ơn anh/chị đã nói thẳng ạ. ' + _o9 + (f.dev ? ' do ' + f.dev + ' phát triển' : '') + ', em gửi riêng giấy tờ và tiến độ có nguồn để anh/chị tự kiểm tra nhé ạ.';
priv = 'Dạ anh/chị băn khoăn là đúng ạ. Em gửi giấy tờ pháp lý' + (f.dev ? ', danh sách dự án ' + f.dev + ' đã bàn giao' : '') + ' và ảnh công trường có ngày chụp để mình tự đánh giá. Anh/chị lo nhất điểm nào để em gửi đúng tài liệu ạ?';
used = ['dev'];
} else if (_oj === 'cho') {
_of = 'Dạ vâng ạ, anh/chị cứ cân nhắc kỹ. Em gửi riêng thông tin ' + _o9 + ' để mình xem lúc rảnh nhé ạ.';
priv = 'Dạ vâng, anh/chị chưa vội thì mình cứ cân nhắc kỹ ạ.' + (highlights(f).length ? ' ' + _o9 + ' ' + join(highlights(f)) + '.' : '') + ' Khi có bảng giá hay chính sách mới em gửi anh/chị kèm nguồn để so trước. Anh/chị muốn em nhắn lại sau khoảng bao lâu ạ?';
used = [];
} else {
const _o5 = highlights(f);
_of = 'Dạ em cảm ơn anh/chị đã quan tâm ' + _o9 + ' ạ.' + (f.loc ? ' Dự án nằm tại ' + f.loc + (_o5.length ? ', ' + join(_o5) : '') + '.' : (_o5.length ? ' Dự án ' + join(_o5) + '.' : '')) + ' ' + _o6;
priv = 'Dạ em chào anh/chị, em cảm ơn anh/chị đã quan tâm ' + _o9 + '.' + (f.loc ? ' Dự án tại ' + f.loc + (f.price ? ', giá tham khảo ' + f.price : '') + '.' : '') + ' ' + ask;
used = ['loc'];
}
return { public: _o4(_of.replace(/\s{2,}/g, ' ').trim()), private: _o4(priv.replace(/\s{2,}/g, ' ').trim()), used };
}
export function factsBlock(f) {
if (!f) return '';
return [
'Dữ liệu dự án (chỉ dùng số liệu dưới đây, thiếu thì ghi [cần kiểm tra]):',
'- Tên: ' + f.name, f.dev ? '- Chủ đầu tư: ' + f.dev : '', f.loc ? '- Vị trí: ' + f.loc : '', f.status ? '- Tình trạng: ' + f.status : '',
f.handover ? '- Bàn giao dự kiến: ' + f.handover : '', f.price ? '- Giá tham khảo: ' + f.price + ' (ước tính, tuỳ căn)' : '',
f.typeLine ? '- Loại căn: ' + f.typeLine + (f.areaLine ? '; diện tích ' + f.areaLine : '') : '', f.legal ? '- Pháp lý: ' + f.legal : '',
f.progress ? '- Tiến độ: ' + f.progress : '', f.amenities.length ? '- Tiện ích: ' + f.amenities.slice(0, 8).join(', ') : '',
f.policies.length ? '- Chính sách thanh toán: ' + f.policies.join('; ') : '',
].filter(Boolean).join('\n');
}

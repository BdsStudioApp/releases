import { normPhone } from '../_lib/crm.js';
import { withRulesJson } from '../../../shared/ai_rules.js';
export const KIND = 'g2_warm';
export const SOURCE = ['warm', 'Người quen'];
export const NUDGE_DAYS = 3;
export const DAILY_DEFAULT = 3;
const DAY = 86400000;
export const RELS = [
{ id: 'ban_than', label: 'Bạn thân', goi: 'bạn', scene: 'ban_than' },
{ id: 'ho_hang', label: 'Họ hàng lớn tuổi', goi: 'cô/chú', scene: 'ho_hang' },
{ id: 'dong_nghiep', label: 'Đồng nghiệp cũ', goi: 'anh/chị', scene: 'dong_nghiep' },
{ id: 'ban_hoc', label: 'Bạn học cũ', goi: 'bạn', scene: 'ban_hoc' },
{ id: 'hang_xom', label: 'Hàng xóm / cùng khu', goi: 'anh/chị', scene: 'hang_xom' },
{ id: 'khac', label: 'Người quen khác', goi: 'anh/chị', scene: 'ban_than' },
];
const _o3 = new Map(RELS.map(r => [r.id, r]));
export const GOI = ['anh', 'chị', 'anh/chị', 'em', 'bạn', 'cô', 'chú', 'cô/chú', 'bác', 'dì', 'cậu', 'mợ', 'thím', 'ông', 'bà'];
export const TOI = ['mình', 'em', 'cháu', 'anh', 'chị', 'tôi', 'tớ'];
const _o5 = { anh: 'em', 'chị': 'em', 'anh/chị': 'em', em: 'mình', 'bạn': 'mình' };
export const STATUSES = [['chua_nhan', 'Chưa nhắn'], ['da_nhan', 'Đã nhắn'], ['phan_hoi', 'Có phản hồi'], ['gioi_thieu', 'Đã giới thiệu']];
const _o2 = Object.fromEntries(STATUSES.map((s, _od) => [s[0], _od]));
export const statusLabel = id => (STATUSES.find(s => s[0] === id) || STATUSES[0])[1];
export const relLabel = id => (_o3.get(id) || _o3.get('khac')).label;
export const NO_REPLY_RE = /không cần phản hồi[^.!?\n]*không tiện|không tiện[^.!?\n]*không cần phản hồi/i;
export const PRESSURE_RE = /chắc chắn tăng|giá sẽ tăng|sắp tăng giá|sắp hết|hết căn|chỉ còn \d|chỉ còn (vài|ít)|cơ hội cuối|duy nhất|kẻo lỡ|kẻo hết|nhanh tay|đừng bỏ lỡ|lợi nhuận|sinh lời|cam kết|lãi chắc|xin lỗi/i;
const _o0 = 'Không cần phản hồi nếu không tiện nhé.';
export const SCENES = [
{ id: 'ban_than', title: 'Nhắn riêng bạn thân', tip: 'Hỏi thăm trước, báo tin sau. Không gửi bảng giá khi bạn chưa hỏi.', variants: [
'{ho} ơi, dạo này {ban} khoẻ không? {toi} mới chuyển sang làm mảng bất động sản[[, chủ yếu quanh {khu_vuc}]]. Nhắn để {ban} biết thôi, sau này {ban} hay người nhà cần check quy hoạch, xem bảng hàng hay hỏi giá khu nào thì cứ hỏi {toi}, {toi} tra giúp. Không cần phản hồi nếu không tiện nhé.',
'Hế lô {ho}! Kể {ban} nghe, {toi} đang làm môi giới nhà đất[[, đang tìm hiểu kỹ {du_an}]]. Không phải nhắn để chào bán đâu, chỉ là có ai quanh {ban} cần thông tin thị trường thì {toi} chia sẻ được. Bận hay không tiện thì không cần phản hồi đâu.',
'Chào {ho}, lâu rồi chưa hỏi thăm {ban}. {toi} mới bắt đầu công việc tư vấn bất động sản[[ ở khu {khu_vuc}]], đang học thêm nhiều. Lúc nào {ban} muốn hỏi về giá nhà, pháp lý hay quy hoạch một khu nào đó thì nhắn {toi}, {toi} tìm nguồn chính thức gửi {ban}. Không tiện thì không cần phản hồi đâu nha.',
'{ho} à, {toi} có chuyện vui muốn kể: {toi} vừa chuyển sang làm bất động sản[[, mảng {du_an}]]. {toi} không nhờ mua gì đâu, chỉ mong nếu nghe ai hỏi về nhà đất thì {ban} nhớ tới {toi} một chút. Không cần phản hồi nếu không tiện nhé.',
] },
{ id: 'ho_hang', title: 'Họ hàng lớn tuổi', tip: 'Lễ phép, ngắn, có "ạ". Không nhờ người lớn tuổi đi giới thiệu khắp nơi.', variants: [
'{toi} chào {ho} ạ. Dạo này {ban} và cả nhà có khoẻ không ạ? {toi} báo {ban} biết, {toi} mới chuyển sang làm tư vấn nhà đất[[ ở khu {khu_vuc}]]. Sau này nhà mình hay họ hàng có ai cần xem giấy tờ, hỏi quy hoạch hay giá nhà thì {ban} cứ bảo {toi}, {toi} tìm hiểu giúp ạ. {ban} không tiện thì không cần phản hồi đâu ạ.',
'{ho} ơi, {toi} hỏi thăm {ban} ạ. {toi} mới đổi việc, giờ làm bên bất động sản[[, chủ yếu mảng {du_an}]]. {toi} nhắn để {ban} biết, khi nào nhà mình cần hỏi gì về nhà cửa, đất đai thì {toi} hỗ trợ được ạ. Không cần phản hồi nếu {ban} không tiện ạ.',
'Dạ {toi} chào {ho}. Lâu rồi {toi} chưa sang thăm {ban} được. {toi} kể {ban} nghe là {toi} đang làm môi giới bất động sản[[ quanh {khu_vuc}]], công việc cũng ổn ạ. Có ai quen cần thông tin thị trường hay kiểm tra quy hoạch thì {ban} nhắn {toi}, còn không thì cũng không sao ạ. {ban} không tiện thì không cần phản hồi ạ.',
] },
{ id: 'dong_nghiep', title: 'Đồng nghiệp cũ', tip: 'Nhắc kỷ niệm thật ở chỗ làm cũ nếu có; không bịa chuyện chung.', variants: [
'Chào {ho}, {toi} đây ạ. Từ hồi nghỉ ở chỗ cũ, giờ {toi} chuyển sang làm bất động sản[[, chủ yếu khu {khu_vuc}]]. {toi} nhắn hỏi thăm và để {ban} biết thôi: nếu {ban} hay ai trong công ty cần tham khảo giá, pháp lý hay bảng hàng thì cứ nhắn {toi}. Không cần phản hồi nếu không tiện nhé.',
'{ho} ơi, lâu quá không gặp! Dạo này công việc của {ban} thế nào? {toi} giờ làm tư vấn nhà đất[[, đang theo {du_an}]]. Khi nào {ban} cần số liệu thị trường để tham khảo thì {toi} gửi, có nguồn đàng hoàng. Bận hay không tiện thì không cần phản hồi đâu.',
'Hi {ho}, {toi} mới bắt đầu công việc mới ở mảng bất động sản. Hồi làm cùng {ban}, {toi} học được cách làm việc cẩn thận, giờ {toi} dùng vào việc tra quy hoạch, đọc hợp đồng cho khách. Ai quanh {ban} cần hỏi thì {toi} sẵn lòng giúp. {ban} không tiện thì không cần phản hồi nhé.',
] },
{ id: 'ban_hoc', title: 'Bạn học cũ', tip: 'Hỏi thăm là chính. Không đăng tin bán hàng vào nhóm lớp khi chưa ai hỏi.', variants: [
'{ho} ơi, {toi} đây, bạn học cũ nè! Lâu rồi không nói chuyện, dạo này {ban} sao rồi? {toi} mới chuyển sang làm bất động sản[[ ở {khu_vuc}]], nhắn để {ban} biết thêm một người quen trong nghề. Có gì cần hỏi về nhà đất thì nhắn {toi} nhé, không cần phản hồi nếu không tiện.',
'Chào {ho}, lâu lắm rồi mới nhắn {ban}. {toi} giờ làm tư vấn nhà đất[[, chủ yếu {du_an}]]. Ai trong lớp cần check quy hoạch hay xem bảng hàng thì {toi} giúp được. Không tiện thì không cần phản hồi đâu nha.',
'Hế lô {ho}, nhớ hồi đi học ghê. {toi} kể {ban} nghe chút: {toi} đang làm môi giới bất động sản, học được khá nhiều về pháp lý và quy hoạch. Sau này {ban} cần tham khảo gì về nhà cửa thì cứ hỏi {toi}, không ngại đâu. Bận hay không tiện thì không cần phản hồi nhé.',
] },
{ id: 'hang_xom', title: 'Hàng xóm / cùng khu', tip: 'Chia sẻ tin chính thức của khu (quy hoạch, hạ tầng) kèm nguồn; không phao tin đồn.', variants: [
'Chào {ho}, {toi} ở cùng khu[[ {khu_vuc}]] đây ạ. {toi} mới làm tư vấn bất động sản, có theo dõi quy hoạch và giá giao dịch quanh khu mình. Khi nào {ban} cần tham khảo thì cứ hỏi {toi}, {toi} gửi thông tin có nguồn. Không cần phản hồi nếu không tiện ạ.',
'{ho} ơi, {toi} là hàng xóm[[ khu {khu_vuc}]] của {ban} nè. Giờ {toi} làm bên nhà đất, nên nếu nhà mình cần hỏi về sổ đỏ, quy hoạch hay giá thuê quanh đây thì {toi} giúp được. {ban} không tiện thì không cần phản hồi đâu ạ.',
'Dạ chào {ho}. {toi} nhắn hỏi thăm hàng xóm một chút, và báo để {ban} biết {toi} đang làm tư vấn bất động sản[[, đang theo {du_an}]]. Có tin quy hoạch hay hạ tầng chính thức của khu mình, {toi} chia sẻ khi {ban} cần. Không tiện thì không cần phản hồi ạ.',
] },
{ id: 'story', title: 'Đăng story / bài cá nhân', tip: 'Đăng trên trang cá nhân, không tag hàng loạt, không nhắn riêng hàng loạt.', variants: [
'Mình mới chuyển sang làm mảng bất động sản[[, chủ yếu quanh {khu_vuc}]]. Ai cần check quy hoạch, xem bảng hàng hay hỏi pháp lý một căn nhà cứ hỏi mình, mình tra giúp có nguồn. Không mua bán gì cũng hỏi được nhé, không cần phản hồi nếu không tiện.',
'Chuyện mới của mình: mình đang làm tư vấn nhà đất[[, theo {du_an}]]. Mình sẽ chia sẻ thông tin thị trường, quy hoạch, pháp lý mình đọc được, có dẫn nguồn. Ai quan tâm cứ nhắn, ai không cần thì cứ lướt qua, không cần phản hồi nếu không tiện.',
'Một chút cập nhật: mình đã bắt đầu công việc môi giới bất động sản. Bạn bè, người quen ai đang tìm hiểu nhà cửa[[ ở {khu_vuc}]] mà cần người tra quy hoạch hay đọc giúp giấy tờ thì mình sẵn lòng. Không tiện thì không cần phản hồi đâu, cảm ơn mọi người đã đọc.',
'Mình mới vào nghề bất động sản và đang học mỗi ngày. Mình không đăng để chào bán, chỉ muốn mọi người biết có thêm một người quen trong nghề để hỏi khi cần: giá khu vực, quy hoạch, bảng hàng. Không cần phản hồi nếu không tiện nhé.',
] },
{ id: 'cam_on', title: 'Cảm ơn khi được giới thiệu', tip: 'Cảm ơn ngay trong ngày. Không kể lại thông tin của người được giới thiệu.', variants: [
'{ho} ơi, {toi} cảm ơn {ban} nhiều vì đã giới thiệu người quen cho {toi}. {toi} sẽ tư vấn trung thực, đúng nhu cầu, để {ban} không phải ngại. Không cần phản hồi nếu không tiện nhé.',
'Cảm ơn {ho} đã tin và nhắc tên {toi} với bạn bè. {toi} sẽ liên hệ nhẹ nhàng, chỉ tư vấn khi người ta cần và giữ kín thông tin của họ. {ban} không tiện thì không cần phản hồi đâu.',
'Chào {ho}, {toi} nhận được lời giới thiệu của {ban} rồi, quý lắm. {toi} sẽ làm việc cẩn thận, thông tin có nguồn, để người {ban} giới thiệu thấy yên tâm. Không tiện thì không cần phản hồi nha.',
] },
{ id: 'nhac_lai', title: 'Nhắn lại sau khi im lặng (1 lần)', tip: 'Chỉ nhắn lại 1 lần, sau ít nhất 3 ngày. Họ vẫn im lặng thì dừng.', variants: [
'{ho} ơi, hôm trước {toi} có nhắn {ban} một chút, chắc {ban} bận. {toi} chỉ nhắc lại một lần thôi: khi nào cần hỏi gì về nhà đất thì cứ nhắn {toi}. Không cần phản hồi nếu không tiện nhé.',
'Chào {ho}, {toi} nhắn lại lần này thôi, không làm phiền thêm đâu. Lời mời hỏi đáp về quy hoạch, giá nhà vẫn còn đó, lúc nào tiện thì {ban} nhắn {toi}. {ban} không tiện thì không cần phản hồi đâu.',
'Hi {ho}, chúc {ban} một tuần nhẹ nhàng. Tin hôm trước {ban} cứ để đó cũng được, {toi} sẽ không nhắn thêm. Sau này cần thông tin thị trường thì {ban} nhớ có {toi} nhé. Không cần phản hồi nếu không tiện.',
] },
{ id: 'xin_gt', title: 'Xin giới thiệu sau khi chốt', tip: 'Chỉ xin khi khách đã hài lòng. Một lần, không nhắc đi nhắc lại.', variants: [
'{ho} ơi, cảm ơn {ban} đã tin {toi} trong lần giao dịch vừa rồi. Nếu {ban} thấy {toi} làm việc ổn, có bạn bè hay người nhà cần tìm hiểu nhà cửa thì {ban} giới thiệu giúp {toi} nhé. Không có ai cũng không sao, không cần phản hồi nếu không tiện.',
'Chào {ho}, {toi} cảm ơn {ban} lần nữa vì đã đồng hành cùng {toi} suốt thời gian vừa rồi. {toi} có một lời nhờ nhỏ: nếu quanh {ban} có ai đang cần tư vấn nhà đất, {ban} cho {toi} xin giới thiệu, {toi} sẽ làm cẩn thận như với {ban}. {ban} không tiện thì không cần phản hồi đâu.',
'{toi} gửi {ho} lời cảm ơn vì đã chọn {toi} tư vấn. Sau này {ban} cần hỗ trợ gì về giấy tờ, cho thuê hay bán lại thì cứ nhắn. Nếu tiện, {ban} giới thiệu {toi} với người quen đang tìm nhà nhé, không tiện thì không cần phản hồi đâu.',
] },
];
const _o4 = new Map(SCENES.map(s => [s.id, s]));
export const sceneOf = id => _o4.get(id) || SCENES[0];
export const LIB_SCRIPTS = SCENES.map(s => ({ id: 'nq_' + s.id, cat: 'warm', scene: s.id, title: 'Người quen: ' + s.title, text: s.variants[0], tip: s.tip, triggers: [] }));
const _ok = v => (v === undefined || v === null ? '' : String(v)).replace(/\s+/g, ' ').trim();
export function address(v = {}) {
const rel = _o3.get(v.rel) || _o3.get('khac');
const goi = GOI.includes(_ok(v.goi)) ? _ok(v.goi) : rel.goi;
const toi = TOI.includes(_ok(v.toi)) ? _ok(v.toi) : (_o5[goi] || 'cháu');
const ten = _ok(v.ten);
const ho = goi === 'bạn' ? (ten || 'bạn') : (ten ? goi + ' ' + ten : goi);
return { goi, toi, ho, ban: goi };
}
const _o1 = { khu_vuc: 'khu mình', du_an: 'bất động sản' };
export function fill(tpl, vars = {}) {
const a = address(vars);
const _om = { ...a, ten: _ok(vars.ten), khu_vuc: _ok(vars.khu_vuc), du_an: _ok(vars.du_an), ten_toi: _ok(vars.ten_toi) };
const get = k => (_om[k] !== undefined ? _om[k] : '');
let t = String(tpl || '').replace(/\[\[([\s\S]*?)\]\]/g, (_, seg) => {
const _oe = [...seg.matchAll(/\{(\w+)\}/g)].map(m => m[1]);
return _oe.every(k => get(k)) ? seg : '';
});
t = t.replace(/\[\[|\]\]/g, '').replace(/\{(\w+)\}/g, (_, k) => get(k) || _o1[k] || '');
t = t.replace(/[{}]/g, '')
.replace(/[ \t]{2,}/g, ' ').replace(/[ \t]+([,.!?:;])/g, '$1').replace(/([,;:])\s*([,.!?])/g, '$2').replace(/([.!?])\s*[,;]/g, '$1')
.replace(/\.{2}(?!\.)/g, '.').replace(/^[\s,.;:!?]+/, '').trim();
return t.replace(/(^|[.!?]\s+)(\p{Ll})/gu, (_, p, c) => p + c.toUpperCase());
}
export function compose(tpl, vars = {}) {
let t = String(tpl || '').trim();
if (!t) return '';
if (!NO_REPLY_RE.test(t)) t = t.replace(/\s*$/, '') + (/[.!?…]$/.test(t) ? ' ' : '. ') + _o0;
return fill(t, vars);
}
const _oc = s => { if (!s || !s.row) return ''; try { const d = typeof s.row.data === 'string' ? JSON.parse(s.row.data) : (s.row.data || {}); return d.from || ''; } catch { return ''; } };
export function templates(sceneId, library) {
const sc = sceneOf(sceneId);
const base = sc.variants.slice();
const _oh = 'nq_' + sc.id;
const _og = Array.isArray(library) ? library : [];
const _ol = _og.find(x => x.id === _oh);
if (_ol && _ol.edited && _ol.text) base[0] = _ol.text;
const mine = _og.filter(x => x.scope === 'mine' && x.text && _oc(x) === _oh).map(x => x.text);
return [...new Set([...mine, ...base])];
}
export function variants(sceneId, vars = {}, library) {
const v = { ...(vars || {}), rel: (vars && vars.rel) || (_o3.has(sceneId) ? sceneId : 'khac') };
return [...new Set(templates(sceneId, library).map(t => compose(t, v)).filter(Boolean))];
}
export function nextVariant(sceneId, history = [], n) {
const _o9 = n || sceneOf(sceneId).variants.length;
const _of = new Map();
for (const h of history || []) if (h && h.scene === sceneId && Number(h.v) >= 0 && Number(h.v) < _o9) _of.set(Number(h.v), Math.max(_of.get(Number(h.v)) || 0, Number(h.at) || 0));
for (let _od = 0; _od < _o9; _od++) if (!_of.has(_od)) return _od;
let _o7 = 0;
for (let _od = 1; _od < _o9; _od++) if (_of.get(_od) < _of.get(_o7)) _o7 = _od;
return _o7;
}
const pd = v => { if (v && typeof v === 'object') return v; try { const j = JSON.parse(v || '{}'); return j && typeof j === 'object' ? j : {}; } catch { return {}; } };
export function normalize(d = {}) {
const x = d && typeof d === 'object' ? d : {};
return {
...x,
rel: _o3.has(x.rel) ? x.rel : 'khac',
goi: GOI.includes(x.goi) ? x.goi : '',
toi: TOI.includes(x.toi) ? x.toi : '',
phone: _ok(x.phone), khu_vuc: _ok(x.khu_vuc), note: String(x.note || '').slice(0, 1000),
status: _o2[x.status] !== undefined ? x.status : 'chua_nhan',
sent_at: Number(x.sent_at) || 0, replied_at: Number(x.replied_at) || 0, referred_at: Number(x.referred_at) || 0,
followups: Number(x.followups) || 0,
history: Array.isArray(x.history) ? x.history.filter(h => h && typeof h === 'object').slice(-30) : [],
customer_id: _ok(x.customer_id),
};
}
export function dataOf(p) {
const { id, name, row, created_at, kind, deleted, updated_at, ...rest } = normalize(p);
return rest;
}
export function parse(rows) {
return (rows || []).filter(r => r && r.kind === KIND && !Number(r.deleted))
.map(r => ({ ...normalize(pd(r.data)), id: r.id, name: _ok(r.name), created_at: Number(r.created_at) || 0, row: r }));
}
export function act(d, action, now = Date.now(), extra = {}) {
const x = normalize(d);
if (action === 'sent') {
const followups = x.status === 'da_nhan' ? x.followups + 1 : x.followups;
return { ...x, status: x.status === 'chua_nhan' ? 'da_nhan' : x.status, sent_at: now, followups, history: x.history.concat([{ at: now, scene: _ok(extra.scene), v: Number(extra.v) || 0 }]).slice(-30) };
}
if (action === 'reply') return { ...x, status: _o2[x.status] >= _o2.phan_hoi ? x.status : 'phan_hoi', replied_at: now };
if (action === 'referred') return { ...x, status: 'gioi_thieu', referred_at: now };
if (action === 'set') {
if (_o2[extra.status] === undefined) throw new Error('Trạng thái không hợp lệ');
return { ...x, status: extra.status, ...(extra.status === 'chua_nhan' ? { followups: 0 } : {}) };
}
throw new Error('Thao tác không hợp lệ');
}
export function canNudge(d, now = Date.now()) {
const x = normalize(d);
return x.status === 'da_nhan' && x.followups < 1 && x.sent_at > 0 && now - x.sent_at >= NUDGE_DAYS * DAY;
}
export function clampDaily(n) { const v = parseInt(n, 10); if (Number.isNaN(v)) return DAILY_DEFAULT; return Math.max(1, Math.min(20, v)); }
const _oa = ms => { const d = new Date(ms); d.setHours(0, 0, 0, 0); return d.getTime(); };
export function todayPicks(rows, n, now = Date.now()) {
const _oj = parse(rows).filter(p => p.sent_at < _oa(now));
const _ob = _oj.filter(p => p.status === 'chua_nhan').sort((a, b) => a.created_at - b.created_at || String(a.id).localeCompare(String(b.id)))
.map(p => ({ ...p, scene: (_o3.get(p.rel) || _o3.get('khac')).scene, why: 'Chưa nhắn' }));
const _oi = _oj.filter(p => canNudge(p, now)).sort((a, b) => a.sent_at - b.sent_at)
.map(p => ({ ...p, scene: 'nhac_lai', why: 'Im lặng ' + Math.floor((now - p.sent_at) / DAY) + ' ngày – nhắn lại 1 lần' }));
return _ob.concat(_oi).slice(0, clampDaily(n));
}
export function customerPrefill(p) {
const x = p && p.kind === KIND ? parse([p])[0] : p;
if (!x) return { ok: false, reason: 'Không thấy người quen' };
if (x.customer_id) return { ok: false, reason: 'Người này đã là khách' };
if (_o2[x.status] < _o2.phan_hoi) return { ok: false, reason: 'Chỉ chuyển khi người quen đã phản hồi và đồng ý để lại liên hệ' };
return { ok: true, row: { name: _ok(x.name), phone: x.phone ? normPhone(x.phone) : '', zalo: '', source: SOURCE[0], need: 'mua', note: 'Người quen – ' + relLabel(x.rel), consent: 0 } };
}
export function aiPrompt(sceneId, opts = {}) {
const sc = sceneOf(sceneId);
return withRulesJson([
'Bạn giúp một người mới làm môi giới bất động sản ở Việt Nam viết tin nhắn cho người quen, kiểu hỏi thăm / chia sẻ thông tin thị trường, KHÔNG chào bán thẳng.',
'Tình huống: ' + sc.title + '. Người nhận: ' + relLabel(opts.rel || (_o3.has(sceneId) ? sceneId : 'khac')) + '.',
'Viết 3 biến thể mới, tiếng Việt có dấu, mỗi biến thể dưới 70 chữ, giọng tự nhiên, khác hẳn nhau và khác các mẫu bên dưới.',
'Bắt buộc: giữ nguyên các biến {ho} (gọi người nhận), {ban} (đại từ người nhận), {toi} (người gửi xưng); nếu nhắc khu vực hoặc dự án thì chỉ viết [[ ở {khu_vuc}]] hoặc [[, mảng {du_an}]] – KHÔNG tự đặt tên dự án, chủ đầu tư, con số hay thành tích.',
'Mỗi biến thể phải có câu "không cần phản hồi nếu không tiện". Không gây áp lực, không nói giá chắc chắn tăng, sắp hết căn, cơ hội cuối; không hứa lợi nhuận; không dùng chữ "xin lỗi".',
'Mẫu đang có:', ...sc.variants.map(v => '- ' + v),
'Trả về JSON: ["…", "…", "…"]',
].join('\n'));
}
export function parseAiVariants(text) {
const s = String(text || '').trim();
if (!s) return [];
let _o6 = null;
for (const _o8 of [(s.match(/```(?:json)?\s*([\s\S]*?)```/) || [])[1], s, s.slice(s.indexOf('['), s.lastIndexOf(']') + 1)]) {
if (!_o8) continue;
try { const j = JSON.parse(_o8); if (Array.isArray(j)) { _o6 = j.map(x => (typeof x === 'string' ? x : x && x.text) || ''); break; } } catch { }
}
if (!_o6) _o6 = s.split(/\n+/).filter(l => !/^\s*```/.test(l));
return _o6.map(l => String(l).replace(/^\s*(\d+[.)]|[-*•])\s*/, '').replace(/^["“]|["”]$/g, '').trim())
.filter(l => l.length >= 8 && !PRESSURE_RE.test(l)).slice(0, 5);
}

import { fold } from './staff_skills.js';
import { normPhone, validPhone } from './crm.js';
import * as W from '../g2_lib/wingman.js';
export const DESK_TEMPLATE_ID = 'inbox';
export const MESSAGE_MAX = 2500;
export const isDeskStaff = s => !!s && s.field === DESK_TEMPLATE_ID;
export const CHANNELS = [
{ id: 'zalo', label: 'Zalo', public: false, source: 'zalo' },
{ id: 'messenger', label: 'Messenger', public: false, source: 'facebook' },
{ id: 'tiktok', label: 'Bình luận TikTok', public: true, source: 'manual' },
{ id: 'facebook', label: 'Bình luận Facebook', public: true, source: 'facebook' },
{ id: 'sms', label: 'SMS/Điện thoại', public: false, source: 'manual' },
{ id: 'other', label: 'Khác', public: false, source: 'manual' },
];
export const channelOf = id => CHANNELS.find(_oe => _oe.id === id) || CHANNELS[CHANNELS.length - 1];
export const INTENTS = {
price: { label: 'Hỏi giá', icon: '💰', hint: 'Khách hỏi giá: chỉ nêu giá theo bảng giá/chính sách có ngày hiệu lực; chưa có thì hẹn gửi bảng giá chính thức.' },
legal: { label: 'Hỏi pháp lý', icon: '📜', hint: 'Khách hỏi pháp lý: nêu tình trạng theo hồ sơ dự án có nguồn; câu phức tạp thì hẹn chuyên viên, không tự kết luận.' },
visit: { label: 'Xin xem nhà', icon: '🏠', hint: 'Khách muốn xem nhà: đề xuất 2 khung giờ cụ thể để khách chọn.' },
decline: { label: 'Từ chối', icon: '🙅', hint: 'Khách từ chối: cảm ơn, tôn trọng, không ép, để ngỏ liên lạc.' },
general: { label: 'Hỏi chung', icon: '💬', hint: 'Khách hỏi chung: trả lời ngắn đúng câu hỏi, mời nhắn riêng để nhận thông tin chi tiết.' },
spam: { label: 'Tin rác', icon: '🚫', hint: '' },
};
export const INTENT_IDS = Object.keys(INTENTS);
export const REPLY_STYLES = [
{ id: 'short', label: 'Ngắn gọn', hint: '1–2 câu, đi thẳng vào ý khách hỏi' },
{ id: 'friendly', label: 'Thân thiện', hint: 'ấm áp, hỏi thêm nhu cầu của khách' },
{ id: 'book', label: 'Chốt hẹn', hint: 'mời hẹn xem nhà hoặc gọi tư vấn, đưa 2 khung giờ' },
];
export function replyStyles(intentId) {
if (intentId === 'spam') return [];
if (intentId === 'decline') return REPLY_STYLES.filter(s => s.id !== 'book').map(s => (s.id === 'friendly' ? { ...s, hint: 'cảm ơn, giữ liên lạc, không ép' } : s));
return REPLY_STYLES.slice();
}
const _o0 = ['gia dinh', 'gia lam', 'tham gia', 'gia han', 'quoc gia', 'chuyen gia', 'gia su', 'cong ty', 'thoi gian', 'thoi diem'];
const RULES = {
spam: ['kiem tien', 'kiem tien online', 'viec nhe luong cao', 'ctv online', 'cong tac vien online', 'nhan thuong', 'trung thuong', 'qua tang mien phi',
'bit ly', 'click link', 'bam link', 'bam vao link', 'follow cheo', 'tuong tac cheo', 'sub cheo', 'theo doi cheo', 'vay tien nhanh', 'vay online', 'giai ngan nhanh',
'loi nhuan moi ngay', 'usdt', 'forex', 'crypto', 'tien ao', 'kiem 500k', 'thu nhap 1 trieu ngay'],
decline: ['khong quan tam', 'ko quan tam', 'k quan tam', 'khong co nhu cau', 'chua co nhu cau', 'het nhu cau', 'khong nhu cau', 'khong can nua', 'ko can nua', 'khong can dau',
'dung goi', 'dung nhan', 'dung lam phien', 'khong mua nua', 'ko mua nua', 'khong mua dau', 'thoi em', 'thoi a', 'thoi khong', 'thoi nhe', 'thoi de', 'mua roi', 'da mua',
'chot cho khac', 'de sau', 'huy lich', 'huy hen', 'khong xem nua', 'xoa so', 'stop'],
visit: ['xem nha', 'xem can', 'xem du an', 'xem thuc te', 'xem dat', 'di xem', 'qua xem', 'den xem', 'tham quan', 'nha mau', 'can mau', 'hen', 'lich hen', 'dat lich',
'gap truc tiep', 'gap mat', 'gap em', 'gap anh/chị', 'gap chi', 'cuoi tuan', 'chu nhat', 'thu 7', 'thu bay', 'dan di', 'dua di', 'khi nao ranh', 'xem duoc khong'],
legal: ['phap ly', 'so do', 'so hong', 'so rieng', 'so chung', 'giay phep', 'gpxd', 'hop dong', 'hdmb', 'cong chung', 'quy hoach', 'tranh chap', 'chuyen nhuong',
'giay to', 'lau dai', 'so huu', '50 nam', 'thue', 'sang ten', 'ra so', 'co so chua'],
price: ['gia', 'bao nhieu', 'bn', 'bnh', 'bnhieu', 'bang gia', 'chiet khau', 'uu dai', 'tra gop', 'tien do thanh toan', 'thanh toan', 'lai suat', 'vay von', 'ho tro vay',
'vay ngan hang', 'dat qua', 'mac qua', 'ib gia', 'inbox gia', 'check ib', 'xin gia', 'dat coc', 'coc', 'tr m2', 'trieu m2', 'ty', 'tram trieu'],
general: ['o dau', 'dia chi', 'con khong', 'con can', 'xin thong tin', 'ib', 'inbox', 'tu van', 'cho xin', 'chu dau tu', 'ban giao', 'tien ich', 'dien tich', 'may phong ngu'],
};
const WKW = id => (W.CONCERNS.find(_oe => _oe.id === id) || { kw: [] }).kw;
RULES.price = [...new Set([...RULES.price, ...WKW('gia'), ...WKW('tai_chinh')])];
RULES.legal = [...new Set([...RULES.legal, ...WKW('phap_ly').filter(_or => _or !== 'co so')])];
const _o9 = ['casino', 'ca do', 'nha cai', 'tai xiu', 'no hu', 'lo de'];
const _o6 = ['decline', 'visit', 'legal', 'price', 'general'];
const _o3 = /https?:\/\/|www\.|\b(bit\.ly|t\.me|tinyurl|shorturl)\b/i;
const norm = s => {
let t = ' ' + fold(s).replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
for (const _ol of _o0) t = t.split(' ' + _ol + ' ').join(' _ ');
return t;
};
const _op = (t, list) => list.reduce((n, p) => n + (t.includes(' ' + p + ' ') ? 1 : 0), 0);
export function detectIntent(text) {
const _o10 = String(text ?? '');
const t = norm(_o10);
const scores = {};
for (const _or of Object.keys(RULES)) scores[_or] = _op(t, RULES[_or]);
scores.spam += _op(t, _o9) * 2;
const _ou = _o3.test(_o10);
let id = 'general';
if (scores.spam >= 2 || (scores.spam >= 1 && _ou)) id = 'spam';
else {
let _od = 0;
for (const _or of _o6) if (scores[_or] > _od) { _od = scores[_or]; id = _or; }
}
const secondary = _o6.filter(_or => _or !== id && _or !== 'general' && scores[_or] > 0).sort((_ob, _oc) => scores[_oc] - scores[_ob]);
return { id, label: INTENTS[id].label, icon: INTENTS[id].icon, scores, secondary: id === 'spam' ? [] : secondary };
}
const _o7 = /(?:\+?84|0)(?:[\s.-]?\d){8,10}\b/g;
export function maskPII(text) {
const _oz = W.maskPII(text);
return { text: _oz.text, total: _oz.count };
}
export function offlineOptions(text, intentId, projectName = '') {
if (intentId === 'spam' || intentId === 'decline' || !String(text ?? '').trim()) return { concern: null, options: [] };
const _ob = W.analyze(text, { project: projectName });
return { concern: _ob.concern ? { id: _ob.concern.id, label: _ob.concern.label } : null, options: _ob.options };
}
const _o8 = '(?:em|anh|chị|chi|mình|minh|tôi|toi|tui|cháu|chau|cô|chú)';
const _o4 = new RegExp(`(?:^|[^\\p{L}])(?:${_o8}\\s+(?:tên\\s+|ten\\s+)?(?:là|la)|(tên|ten)\\s+(?:${_o8}\\s+)?(?:(?:là|la)\\s+)?)\\s*`, 'giu');
const _o5 = new Set(['khách', 'khach', 'người', 'nguoi', 'chủ', 'chu', 'môi', 'moi', 'sale', 'nhân', 'nhan']);
const _oq = _o17 => _o17[0] !== _o17[0].toLowerCase() && _o17[0] === _o17[0].toUpperCase();
const _of = _o17 => _o17.charAt(0).toUpperCase() + _o17.slice(1);
function _om(text) {
const s = String(text ?? '').normalize('NFC');
_o4.lastIndex = 0;
let _ov;
while ((_ov = _o4.exec(s))) {
const _o11 = s.slice(_ov.index + _ov[0].length);
const _o12 = _o11.match(/^\p{L}+(?:[ \t]+\p{L}+)*/u);
if (!_o12) continue;
const words = _o12[0].split(/[ \t]+/);
if (_o5.has(words[0].toLowerCase())) continue;
if (_oq(words[0])) {
const _oy = [];
for (const _o17 of words) { if (!_oq(_o17) || _oy.length >= 4) break; _oy.push(_o17); }
return _oy.join(' ');
}
if (_ov[1]) return _of(words[0]);
}
return '';
}
function _on(text) {
for (const _ov of String(text ?? '').matchAll(_o7)) { const p = normPhone(_ov[0]); if (validPhone(p)) return p; }
return '';
}
function findProject(text, projects) {
const t = norm(text);
const list = (Array.isArray(projects) ? projects : []).filter(p => p && p.id && p.name)
.map(p => ({ p, n: norm(p.name).trim() })).filter(x => x.n.length >= 3).sort((_ob, _oc) => _oc.n.length - _ob.n.length);
const _oo = list.find(x => t.includes(' ' + x.n + ' '));
return _oo ? { project: _oo.p.id, projectName: _oo.p.name } : { project: '', projectName: '' };
}
export function extractContact(text, projects = []) {
return { name: _om(text), phone: _on(text), ...findProject(text, projects) };
}
const _ok = (s, max = 200) => { const t = String(s ?? '').replace(/\s+/g, ' ').trim(); return t.length > max ? t.slice(0, max - 1) + '…' : t; };
export function suggestActions({ intent, contact = {}, existing = null, channel = 'other', masked = '' } = {}) {
const id = (intent && intent.id) || 'general';
if (id === 'spam') return [{ id: 'ignore', label: 'Bỏ qua – tin rác' }];
const _og = channelOf(channel);
const _oe = contact || {};
const _oj = _ok(masked);
const appt = { id: 'appointment', label: id === 'visit' ? 'Đặt lịch xem nhà' : 'Đặt lịch hẹn tư vấn',
prefill: { title: (id === 'visit' ? 'Hẹn xem nhà' : 'Hẹn tư vấn') + (_oe.projectName ? ' – ' + _oe.projectName : ''), customerId: existing ? existing.id : '' } };
const who = existing
? { id: 'open_customer', label: 'Mở hồ sơ ' + (existing.name || 'khách'), customerId: existing.id }
: { id: 'new_customer', label: 'Tạo khách mới từ tin này',
prefill: { name: _oe.name || '', phone: _oe.phone || '', project: _oe.project || '', source: _og.source, need: 'mua', note: `Từ ${_og.label}: "${_oj}"` } };
const note = { id: 'note', label: id === 'decline' ? 'Ghi chú: khách chưa có nhu cầu' : 'Ghi chú',
prefill: { text: `${INTENTS[id].label} qua ${_og.label}: ${_oj}`, customerId: existing ? existing.id : '' } };
if (id === 'visit') return [appt, who, note];
if (id === 'decline') return [note, who];
return [who, appt, note];
}
export function buildDeskTask({ message, channel = 'other', projects = [], existing = null } = {}) {
const _o10 = String(message ?? '').normalize('NFC').trim();
const _og = channelOf(channel);
const intent = detectIntent(_o10);
const contact = extractContact(_o10, projects);
const _ow = maskPII(_o10);
const masked = { total: _ow.total };
const _ox = offlineOptions(_ow.text, intent.id, contact.projectName);
const styles = replyStyles(intent.id);
const actions = suggestActions({ intent, contact, existing, channel: _og.id, masked: _ow.text });
const base = { intent, contact, masked, maskedText: _ow.text, styles, actions, concern: _ox.concern, offline: _ox.options };
if (!_o10) return { ok: false, error: 'Dán tin khách trước.', ...base };
if (_o10.length > MESSAGE_MAX) return { ok: false, error: `Tin dài quá – tối đa ${MESSAGE_MAX.toLocaleString('vi-VN')} ký tự.`, ...base };
if (intent.id === 'spam') return { ok: false, error: 'Tin rác – không cần trả lời. Bấm "Bỏ qua".', ...base };
const _o13 = intent.secondary.map(_or => INTENTS[_or].label);
const _ot = [
`TRẢ LỜI KHÁCH – ${_og.label} (${_og.public ? 'bình luận công khai' : 'tin nhắn riêng'})`,
`Ý định (app nhận diện): ${intent.label}${_o13.length ? ' + ' + _o13.join(', ') : ''}`,
contact.projectName ? `Dự án khách nhắc: ${contact.projectName}` : '',
_ox.concern ? `Khách có thể đang băn khoăn: ${_ox.concern.label}` : '',
'TIN KHÁCH (đã che số điện thoại, CCCD, số tài khoản):',
'"""', _ow.text, '"""',
`YÊU CẦU: soạn ${styles.length} phương án trả lời để anh/chị chọn, đúng giọng anh/chị trong ví dụ đã duyệt (nếu có), mỗi phương án tối đa 3 câu:`,
...styles.map((s, i) => `PHƯƠNG ÁN ${i + 1} – ${s.label}: (${s.hint})`),
INTENTS[intent.id].hint,
_og.public ? 'Đây là bình luận công khai: không nêu giá chi tiết, không nhắc thông tin riêng của khách – mời khách nhắn riêng.' : '',
'Không hỏi lại số điện thoại, CCCD, số tài khoản. Chỉ trả về các phương án đúng mẫu trên, không giải thích thêm.',
].filter(Boolean);
return { ok: true, ...base, taskText: _ot.join('\n'),
desk: { intent: intent.id, channel: _og.id, styles: styles.map(s => s.id), project: contact.project, masked: _ow.total } };
}
export function deskOf(input) {
const _oi = input && typeof input === 'object' ? input.desk : null;
if (!_oi || typeof _oi !== 'object' || !INTENTS[_oi.intent]) return null;
return { intent: _oi.intent, channel: channelOf(_oi.channel).id, styles: (Array.isArray(_oi.styles) ? _oi.styles : []).filter(s => REPLY_STYLES.some(_oz => _oz.id === s)),
project: String(_oi.project || ''), masked: Math.max(0, Number(_oi.masked) || 0) };
}
const _o1 = /^[\s>*_#-]*(?:phương\s*án|phuong\s*an)\s*(\d)([^:\n]*)(?::\**\s*(.*))?$/iu;
const _o2 = /^\s*(\d)[).]\s+(.*)$/u;
const _oa = [['short', 'ngan gon'], ['friendly', 'than thien'], ['book', 'chot hen'], ['book', 'hen']];
const _o16 = s => s.replace(/^\s*["“”'*]+|["“”'*]+\s*$/g, '').trim();
export function parseReplies(text) {
const _o14 = String(text ?? '').replace(/\r\n?/g, '\n').trim();
if (!_o14) return [];
const _oy = [];
let _oh = null;
for (const _os of _o14.split('\n')) {
const _ob = _os.match(_o1);
const _oc = _ob ? null : _os.match(_o2);
if (_ob || _oc) {
_oh = { n: Number((_ob || _oc)[1]), head: _ob ? _ob[2] : '', body: [_ob ? _ob[3] || '' : _oc[2]] };
_oy.push(_oh);
} else if (_oh) _oh.body.push(_os);
}
if (!_oy.length) return [{ style: '', label: 'Trả lời', text: _o16(_o14) }];
return _oy.map((o, i) => {
const _ol = fold(o.head);
const _or = _oa.find(([, _o17]) => _ol.includes(_o17));
const style = _or ? _or[0] : (REPLY_STYLES[(o.n || i + 1) - 1] || REPLY_STYLES[i] || {}).id || '';
const _o15 = REPLY_STYLES.find(_oz => _oz.id === style);
return { style, label: _o15 ? _o15.label : 'Phương án ' + (i + 1), text: _o16(o.body.join('\n').trim()) };
}).filter(o => o.text);
}

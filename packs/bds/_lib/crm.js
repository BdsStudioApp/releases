import { greetWord } from '../../../core/greet.60b99ed569.js';
import * as consent from './consent.js';
export const DAY = 86400000;
export function strip(_o1s) {
if (_o1s === null || _o1s === undefined) return '';
return String(_o1s)
.normalize('NFD').replace(/[̀-ͯ]/g, '')
.replace(/đ/g, 'd').replace(/Đ/g, 'D')
.toLowerCase().replace(/\s+/g, ' ').trim();
}
export function parseData(_os) {
if (!_os) return {};
if (typeof _os === 'object') return _os;
try { const v = JSON.parse(_os); return v && typeof v === 'object' ? v : {}; } catch { return {}; }
}
function parseNum(_o1s) {
_o1s = String(_o1s).trim();
if (/^\d{1,3}([.,]\d{3})+$/.test(_o1s)) return Number(_o1s.replace(/[.,]/g, ''));
const v = Number(_o1s.replace(',', '.'));
return Number.isFinite(v) ? v : NaN;
}
export function parseMoney(input) {
if (input === null || input === undefined || input === '') return null;
if (typeof input === 'number') {
if (!Number.isFinite(input) || input <= 0) return null;
if (input >= 1e5) return Math.round(input);
input = String(input);
}
let _o1s = strip(input).replace(/vnd|dong/g, '').replace(/(\d)\s*d\b/g, '$1')
.replace(/\s*(\/\s*(thang|th)|(mot|moi|1)\s*thang)\s*$/, '').replace(/\s+/g, ' ').trim();
if (!_o1s) return null;
const _oa = '(\\d+(?:[.,]\\d+)*)';
let m = _o1s.match(new RegExp('^' + _oa + '\\s*(?:ty|ti)\\s*(\\d+)?\\s*(tr|trieu|m)?$'));
if (m) {
const a = parseNum(m[1]);
if (!Number.isFinite(a)) return null;
let v = a * 1e9;
if (m[2]) v += m[3] ? Number(m[2]) * 1e6 : Number((m[2] + '000').slice(0, 3)) * 1e6;
return Math.round(v);
}
m = _o1s.match(new RegExp('^' + _oa + '\\s*(tr|trieu|m)$'));
if (m) { const a = parseNum(m[1]); return Number.isFinite(a) ? Math.round(a * 1e6) : null; }
m = _o1s.match(new RegExp('^' + _oa + '\\s*(k|nghin|ngan)$'));
if (m) { const a = parseNum(m[1]); return Number.isFinite(a) ? Math.round(a * 1e3) : null; }
m = _o1s.match(new RegExp('^' + _oa + '$'));
if (m) {
const a = parseNum(m[1]);
if (!Number.isFinite(a) || a <= 0) return null;
if (a >= 1e5) return Math.round(a);
if (a < 100) return Math.round(a * 1e9);
return Math.round(a * 1e6);
}
return null;
}
export function moneyFallback(n) {
n = Number(n) || 0;
if (Math.abs(n) >= 1e9) return (Math.round(n / 1e7) / 100).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tỷ';
return Math.round(n / 1e6).toLocaleString('vi-VN') + ' triệu';
}
export function normPhone(_o1j) {
let _os = String(_o1j || '').replace(/\D/g, '');
if (_os.startsWith('84') && _os.length >= 11) _os = '0' + _os.slice(2);
if (_os.length === 9 && !_os.startsWith('0')) _os = '0' + _os;
return _os;
}
export function validPhone(_o1j) { return /^0[35789]\d{8}$/.test(normPhone(_o1j)) || /^02\d{9}$/.test(normPhone(_o1j)); }
const _o7 = /^(?:anh|chị|chi|em|cô|chú|bác|ông|bà|cháu)$/i;
const _ob = 'anh|chị|chi|em|tôi|toi|mình|minh|tớ|cháu|cô|chú|bác';
const _o9 = new Set(['cho', 'hỏi', 'giá', 'căn', 'cần', 'mua', 'bán', 'thuê', 'muốn', 'xem', 'nhà', 'dự', 'án', 'mình', 'tôi', 'số', 'sđt', 'sdt', 'zalo',
'gọi', 'liên', 'hệ', 'ơi', 'ạ', 'là', 'tên', 'của', 'và', 'với', 'được', 'không', 'có', 'bao', 'nhiêu', 'tầm', 'khoảng', 'về', 'ở', 'tại', 'hộ', 'đất', 'nền',
'khách', 'chào', 'dạ', 'vâng', 'nhé', 'nè', 'đây', 'shop', 'bạn', 'admin', 'em', 'anh', 'chị', 'đang', 'đã', 'sẽ']);
const _o8 = new Set(['số', 'sđt', 'sdt', 'zalo', 'tên', 'là', 'cần', 'hỏi', 'mua', 'bán', 'thuê', 'muốn', 'xem', 'cho', 'giá', 'căn']);
const _o1f = (_o25) => { const _o19 = _o25.toLocaleLowerCase('vi'); return _o8.has(_o19) || (!_o14(_o25) && _o9.has(_o19)); };
const _o3 = new RegExp('^(?:(?:xin\\s+)?ch[aà]o(?:\\s+(?:em|anh|chị|chi|bạn|shop|ad|admin|cả\\s+nhà|mọi\\s+người))?|(?:em|anh|chị|chi|mình|tôi)\\s+ch[aà]o\\s+(?:em|anh|chị|chi|bạn|shop|cả\\s+nhà)|d[aạ]|vâng|alo|hi|hello|ơi|ạ|nhé)(?:\\s+(?:ạ|ơi|nhé|nha))?(?=[\\s,.;:!?]|$)[\\s,.;:!?–\\-]*', 'i');
const _oc = /(?:\s+|^)(?:ạ|nhé|nha|nè|đây|ơi|à|nhá)$/i;
const _o2 = /(?:s[đd]t|s[oố](?:\s*(?:[đd]i[eệ]n\s*tho[aạ]i|[đd]t|em|anh|chị|chi|mình|tôi|của\s+\S+))?|[đd]t|phone|zalo|li[eê]n\s*h[eệ]|g[oọ]i)\s*[:：]?\s*$/i;
const _o24 = (_o25) => _o25.charAt(0).toLocaleUpperCase('vi') + _o25.slice(1).toLocaleLowerCase('vi');
const _o16 = (_o25) => /^\p{L}+$/u.test(_o25);
const _o14 = (_o25) => /^\p{Lu}/u.test(_o25);
function _ol(seg) {
let x = String(seg || '').replace(/\s+/g, ' ').trim();
for (let i = 0; i < 4 && _o3.test(x); i++) x = x.replace(_o3, '').trim();
for (let i = 0; i < 3; i++) x = x.replace(_o2, '').replace(_oc, '').replace(/[\s:：\-–—,.;|/(]+$/, '').trim();
return x.replace(/^[\s:：\-–—,.;|/]+/, '').trim();
}
const _or = (x) => x.split(/\s+(?:c[aầ]n|h[oỏ]i|mu[oố]n|quan\s*t[aâ]m|mua|thu[eê]|b[aá]n|xem|[đd][aã]|đang|dang|nè|đây|ạ)(?:\s|$)/i)[0].trim();
function _o13(x, kin) {
const words = [];
for (const _o25 of _ol(x).split(' ')) { if (!_o16(_o25) || _o1f(_o25)) break; words.push(_o25); if (words.length === 4) break; }
if (!words.length) return '';
const nm = words.map(_o24).join(' ');
return words.length === 1 && /^(?:anh|chị|chi)$/i.test(kin || '') ? _o24(kin.replace(/^chi$/i, 'chị')) + ' ' + nm : nm;
}
function _o1n(x) {
const _o25 = _or(_ol(x)).split(' ').filter(Boolean);
if (!_o25.length || _o25.length > 5 || !_o25.every(_o16)) return '';
if (_o7.test(_o25[0])) {
const rest = _o25.slice(1, 5);
return rest.length && rest.every((r) => _o14(r) && !_o1f(r)) ? [_o25[0], ...rest].join(' ') : '';
}
if (_o25.length > 4 || _o25.some(_o1f)) return '';
if (_o25.every(_o14)) return _o25.join(' ');
return _o25.length >= 2 ? _o25.map(_o24).join(' ') : '';
}
const _o6 = new RegExp('(?:^|[\\s,.;:!?])(?:(' + _ob + ')\\s+(?:t[eê]n\\s+(?:l[aà]\\s+)?|l[aà]\\s+)|(?:(' + _ob + ')\\s+)?t[eê]n(?:\\s+l[aà]|\\s*[:：])?\\s+)([^\\n,.;!?\\d]+)', 'iu');
export function leadName(text, phoneAt = -1) {
const _o1q = String(text || '');
const label = _o1q.match(/(?:^|\n)\s*(?:h[oọ]\s*(?:v[aà]\s*)?t[eê]n|t[eê]n(?:\s*kh[aá]ch)?|name)\s*[:：\-]\s*([^\n]+)/i);
if (label) { const n = _o13(label[1].split(/[,.;!?\d]|\s(?:s[đd]t|zalo)\b/i)[0]); if (n) return n; }
const before = phoneAt >= 0 ? _o1q.slice(0, phoneAt) : _o1q;
for (const _o1v of [before, _o1q]) {
const m = _o1v.match(_o6);
if (m) { const n = _o13(m[3], m[1] || m[2]); if (n) return n; }
}
const _o1u = before.split(/\n/).pop().split(/[,.;!?]/).map(_ol).filter(Boolean);
let n = _o1u.length ? _o1n(_o1u[_o1u.length - 1]) : '';
if (!n && phoneAt >= 0 && !_o1u.length) {
const _og = _o1q.slice(phoneAt).replace(/^[\s+\d.\-]+/, '').replace(/^[\s:：\-–—,.;|/]+/, '').split(/[\n,.;!?]/)[0];
n = _o1n(_og);
}
return n.slice(0, 80);
}
export function parseLeadText(text) {
const _o1q = String(text || '').replace(/\r/g, '').trim();
if (!_o1q) return null;
const m = _o1q.match(/(?:\+?84|0)(?:[\s.\-]?\d){9,10}/);
const phone = m ? normPhone(m[0]) : '';
if (!phone || !validPhone(phone)) return null;
const name = leadName(_o1q, m.index);
const _oi = strip(_o1q).match(/(\d+(?:[.,]\d+)?)\s*(ty|ti|trieu|tr)\b(?:\s*(\d{1,3})\b)?/);
const budget = _oi ? parseMoney(_oi[1] + ' ' + _oi[2] + (_oi[3] && /^t[yi]$/.test(_oi[2]) ? ' ' + _oi[3] : '')) || 0 : 0;
const _o23 = _o1q.match(/\b([1-5])\s*(?:PN|pn|N|n|phòng ngủ|phong ngu)\b(\+?)/);
return { name, phone, budget, unit_type: _o23 ? _o23[1] + 'N' + _o23[2] : (/\bstudio\b/i.test(_o1q) ? 'Studio' : ''), note: _o1q.slice(0, 1000) };
}
export function findDuplicatePhone(list, phone, exceptId) {
const _o1j = normPhone(phone);
if (!_o1j) return null;
return activeCustomers(list).find(c => c.id !== exceptId &&
(normPhone(c.phone) === _o1j || normPhone(c.zalo) === _o1j)) || null;
}
export function parseYmd(_o1s) {
if (typeof _o1s === 'number') return _o1s;
const m = String(_o1s || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
const _o1c = String(_o1s || '').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
if (_o1c) return new Date(+_o1c[3], +_o1c[2] - 1, +_o1c[1]).getTime();
return NaN;
}
const _o1k = n => String(n).padStart(2, '0');
export function ymd(_o1d) { const _os = new Date(_o1d); return _os.getFullYear() + '-' + _o1k(_os.getMonth() + 1) + '-' + _o1k(_os.getDate()); }
export function ymdVN(_o1d) { return new Date(Number(_o1d) + 7 * 3600e3).toISOString().slice(0, 10); }
export function dmy(_o1d) { const _os = new Date(_o1d); return _o1k(_os.getDate()) + '/' + _o1k(_os.getMonth() + 1) + '/' + _os.getFullYear(); }
export function hm(_o1d) { const _os = new Date(_o1d); return _o1k(_os.getHours()) + ':' + _o1k(_os.getMinutes()); }
export function dayRange(now) {
const _os = new Date(now); _os.setHours(0, 0, 0, 0);
const a = _os.getTime();
const e = new Date(a); e.setDate(e.getDate() + 1);
return [a, e.getTime() - 1];
}
export function addDays(_o1d, n) { const _os = new Date(_o1d); _os.setDate(_os.getDate() + n); return _os.getTime(); }
export function addMonths(_o1d, n) {
const _os = new Date(_o1d); const _ou = _os.getDate();
_os.setDate(1); _os.setMonth(_os.getMonth() + n);
const _o1a = new Date(_os.getFullYear(), _os.getMonth() + 1, 0).getDate();
_os.setDate(Math.min(_ou, _o1a));
return _os.getTime();
}
export function nextBirthday(bday, now) {
const m = String(bday || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
if (!m) return null;
const [start] = dayRange(now);
const _o28 = new Date(now).getFullYear();
let t = new Date(_o28, +m[2] - 1, +m[3]).getTime();
if (t < start) t = new Date(_o28 + 1, +m[2] - 1, +m[3]).getTime();
return t;
}
export function greeting(hour) { return greetWord(hour); }
export const DEFAULT_STATUSES = {
mua: ['Mới', 'Đã liên hệ', 'Đang chăm sóc', 'Hẹn xem nhà', 'Đang đàm phán', 'Đã đặt cọc', 'Đã mua', 'Tạm dừng', 'Không tiềm năng'],
thue: ['Mới', 'Đã liên hệ', 'Đang chăm sóc', 'Hẹn xem nhà', 'Đã thuê', 'Tạm dừng', 'Không tiềm năng'],
ban: ['Mới', 'Đã liên hệ', 'Đã xác minh', 'Đang chào bán', 'Có khách hỏi', 'Đã bán', 'Dừng bán'],
chothue: ['Mới', 'Đã liên hệ', 'Đã xác minh', 'Đang chào thuê', 'Có khách xem', 'Đã cho thuê', 'Dừng cho thuê'],
};
export function needGroup(need) {
const _o1s = strip(need).replace(/\s/g, '');
return _o1s === 'chothue' ? 'chothue' : _o1s === 'thue' ? 'thue' : _o1s === 'ban' ? 'ban' : 'mua';
}
export function statusList(logic, need) {
try {
const _o1w = logic && logic.status;
if (_o1w && _o1w.lists && typeof _o1w.group === 'function') {
const _o19 = _o1w.lists[_o1w.group(need || '')];
if (Array.isArray(_o19) && _o19.length) return _o19;
}
} catch { }
return DEFAULT_STATUSES[needGroup(need)];
}
export function allStatuses(logic) {
const set = new Set();
for (const n of NEEDS) statusList(logic, n).forEach(x => set.add(x));
return [...set];
}
export const NEEDS = ['mua', 'thuê', 'bán', 'cho thuê'];
export function statusTone(_o1w) {
const _o1s = strip(_o1w);
if (!_o1s || /\bmoi\b|^new/.test(_o1s)) return 'info';
if (/khong nghe/.test(_o1s)) return 'warn';
if (/ngung|huy|mat khach|lost|khong|tam dung|dung ban|dung cho thue|sai so|so ao|^trung$/.test(_o1s)) return 'muted';
if (/da mua|coc|da ban|da thue|da cho thue|ban giao|ky hd|won|^chot$/.test(_o1s)) return 'success';
return 'warn';
}
export function isPostSale(c) { const _o1s = strip(c && c.status); return /da mua|coc|ban giao|^chot$/.test(_o1s); }
function _o15(_o1w) { const _o1s = strip(_o1w); return !_o1s || /\bmoi\b|^new\b/.test(_o1s); }
export function patchData(c, patch = {}) {
const _os = { ...parseData(c && c.data) };
for (const [_o18, v] of Object.entries(patch || {})) {
if (v === null || v === undefined) delete _os[_o18]; else _os[_o18] = v;
}
return JSON.stringify(_os);
}
export function tagList(tags) {
return String(tags || '').normalize('NFC').split(/\s*[,;]\s*/).map(_o1s => _o1s.trim()).filter(Boolean);
}
const _o5 = /(^|\s)(nóng|hot)(\s|$)/i;
export function isHotTag(tag) { return _o5.test(String(tag || '').normalize('NFC')); }
export function hasHotTag(tags) { return tagList(tags).some(isHotTag); }
export const HEAT_LEVELS = [
{ id: 'hot', label: 'Nóng', hint: 'Rất quan tâm – ưu tiên gọi sớm' },
{ id: 'normal', label: 'Bình thường', hint: 'Đang tìm hiểu – chăm sóc đều' },
{ id: 'cold', label: 'Lạnh', hint: 'Chưa có nhu cầu gấp – chăm sóc nhẹ, không gọi dồn' },
];
export const HEAT_IDS = HEAT_LEVELS.map(x => x.id);
export const HEAT_TIERS = { hot: 70, warm: 40 };
export const HOT_TAG = 'nóng';
export function heatLabel(id) { const x = HEAT_LEVELS.find(_o19 => _o19.id === id); return x ? x.label : ''; }
export function heatTiers(cfg) {
const t = (cfg && cfg.tiers) || cfg || {};
const hot = Number.isFinite(Number(t.hot)) && t.hot !== '' && t.hot !== null ? Number(t.hot) : HEAT_TIERS.hot;
const warm = Number.isFinite(Number(t.warm)) && t.warm !== '' && t.warm !== null ? Math.min(Number(t.warm), hot) : HEAT_TIERS.warm;
return { hot, warm };
}
export function heatOf(c, { tiers } = {}) {
const _os = parseData(c && c.data);
const _o1i = (id, source, extra = {}) => ({ id, label: heatLabel(id), source, ...extra });
if (HEAT_IDS.includes(_os.heat)) return _o1i(_os.heat, 'manual');
const _o1b = _os.pool && typeof _os.pool === 'object' ? _os.pool.level : '';
if (_o1b === 'hot' || _o1b === 'warm' || _o1b === 'cold') return _o1i(_o1b === 'warm' ? 'normal' : _o1b, 'lead');
if (hasHotTag(c && c.tags)) return _o1i('hot', 'tag');
const _o1s = Number(c && c.score) || 0;
if (_o1s > 0) {
const t = heatTiers(tiers);
return _o1i(_o1s >= t.hot ? 'hot' : _o1s >= t.warm ? 'normal' : 'cold', 'score', { score: _o1s });
}
return _o1i('normal', 'none');
}
export function heatTitle(h) {
if (!h) return '';
const _o27 = h.source === 'manual' ? 'anh/chị đã chọn'
: h.source === 'lead' ? 'theo Mức độ của lead công ty cấp'
: h.source === 'tag' ? 'theo nhãn "nóng"'
: h.source === 'score' ? 'app tự tính theo hành vi (' + h.score + ' điểm)'
: 'chưa đánh giá';
return 'Mức quan tâm: ' + h.label + ' – ' + _o27;
}
export function heatPatch(c, level, now = Date.now()) {
const _o1b = HEAT_IDS.includes(level) ? level : null;
const data = patchData(c, { heat: _o1b, heat_at: _o1b ? now : null });
const tags = tagList(c && c.tags).filter(t => !isHotTag(t));
if (_o1b === 'hot') tags.push(HOT_TAG);
return { data, tags: tags.join(', ') };
}
export const DISC = [
{ id: 'D', name: 'Dominance', label: 'Quyết đoán', desc: 'Thích kết quả, nhanh gọn, tự quyết',
tip: 'Nói thẳng kết quả và con số chính, đưa 2–3 lựa chọn rõ ràng để khách tự quyết; ngắn gọn, đúng giờ.' },
{ id: 'I', name: 'Influence', label: 'Hướng người', desc: 'Cởi mở, nhiều cảm xúc, thích giao lưu',
tip: 'Kể câu chuyện, hình ảnh cuộc sống, tiện ích và cộng đồng cư dân; trò chuyện thân thiện, mời đi xem thực tế.' },
{ id: 'S', name: 'Steadiness', label: 'Ổn định', desc: 'Thận trọng, cần an tâm, hay hỏi ý gia đình',
tip: 'Nhấn an toàn pháp lý, tiến độ, uy tín chủ đầu tư; không hối thúc, để khách có thời gian bàn với gia đình.' },
{ id: 'C', name: 'Compliance', label: 'Chi tiết', desc: 'Kỹ lưỡng, cần số liệu, logic',
tip: 'Gửi số liệu, bảng tính, so sánh có nguồn; trả lời chính xác bằng văn bản, không nói chung chung.' },
];
export const DISC_IDS = DISC.map(x => x.id);
export const DISC_NOTE = 'Tính cách D-I-S-C do anh/chị tự nhận xét khi trao đổi, chỉ để chọn cách trình bày hợp ý khách – không dùng để gây áp lực hay thao túng. Chỉ ghi khi khách đã đồng ý lưu thông tin.';
export function discOf(c) {
const id = String(parseData(c && c.data).disc || '').trim().toUpperCase();
return DISC.find(x => x.id === id) || null;
}
export function discShort(x) { return x ? x.id + ' – ' + x.label : 'Chưa rõ'; }
export function discPatch(c, id) {
const v = String(id || '').trim().toUpperCase();
return patchData(c, { disc: DISC_IDS.includes(v) ? v : null });
}
export function canProfile(c) { return consent.gate(c, 'profile').ok; }
export function activeCustomers(list) {
return (list || []).filter(c => !Number(c.deleted) && (!c.kind || c.kind === 'customer'));
}
const _o4 = new WeakMap();
function _o12(c) {
let _o1s = _o4.get(c);
if (_o1s === undefined) { _o1s = strip([c.name, c.project, c.project_name, c.note, c.unit_type, c.tags, c.email].join(' ')); _o4.set(c, _o1s); }
return _o1s;
}
export function filterCustomers(list, f = {}) {
const q = strip(f.q);
const _o1p = String(f.q || '').replace(/\D/g, '');
const words = q ? q.split(' ') : [];
return activeCustomers(list).filter(c => {
if (f.status && c.status !== f.status) return false;
if (f.need && strip(c.need) !== strip(f.need)) return false;
if (f.project && c.project !== f.project) return false;
if (f.source && c.source !== f.source && !(f.source === 'webhook' && String(c.source || '').startsWith('webhook:'))) return false;
if (f.heat && heatOf(c, { tiers: f.tiers }).id !== f.heat) return false;
if (f.disc && (f.disc === 'none' ? !!discOf(c) : (discOf(c) || {}).id !== f.disc)) return false;
if (f.consent === 'unclear' && !consent.needsExplicit(c)) return false;
if (f.consent === 'withdrawn' && !consent.stateOf(c).withdrawn) return false;
if (words.length) {
const _o11 = _o12(c);
const _o1m = _o1p.length >= 3 && (normPhone(c.phone).includes(_o1p) || String(c.phone || '').includes(_o1p));
if (!_o1m && !words.every(_o25 => _o11.includes(_o25))) return false;
}
return true;
});
}
export function nextDueByCustomer(reminders) {
const m = new Map();
for (const r of reminders || []) {
if (Number(r.done) || Number(r.deleted) || !r.object_id) continue;
const _op = m.get(r.object_id);
if (_op === undefined || r.due_at < _op) m.set(r.object_id, r.due_at);
}
return m;
}
export function sortCustomers(list, mode = 'newest', { reminders } = {}) {
const _oh = (list || []).slice();
const _on = c => Number(c.created_at || c.updated_at || 0);
if (mode === 'call') {
const due = nextDueByCustomer(reminders);
_oh.sort((a, _oi) => {
const _ot = due.has(a.id) ? due.get(a.id) : Infinity;
const _ov = due.has(_oi.id) ? due.get(_oi.id) : Infinity;
if (_ot !== _ov) return _ot - _ov;
return _on(_oi) - _on(a);
});
} else if (mode === 'name') {
_oh.sort((a, _oi) => strip(a.name).localeCompare(strip(_oi.name)));
} else {
_oh.sort((a, _oi) => _on(_oi) - _on(a));
}
return _oh;
}
export function eventsOf(events, id) {
return (events || []).filter(e => e.object_id === id && !Number(e.deleted)).sort((a, _oi) => (_oi.at || 0) - (a.at || 0));
}
export function lastContact(events, id) {
const e = eventsOf(events, id).find(x => x.type === 'call' || x.type === 'zalo' || x.type === 'meeting');
return e ? e.at : null;
}
export function lastContactMap(events) {
const m = new Map();
for (const x of events || []) {
if (Number(x.deleted) || !(x.type === 'call' || x.type === 'zalo' || x.type === 'meeting')) continue;
const _op = m.get(x.object_id);
if (!_op || (x.at || 0) > (_op.at || 0)) m.set(x.object_id, x);
}
return { get: (id) => { const e = m.get(id); return e ? e.at : null; } };
}
export const TEMPLATES = [
{ id: 'welcome_landing', title: 'Chào khách mới (từ landing)', text:
'Dạ em chào anh/chị {ten}, em là {ten_toi}, chuyên viên tư vấn dự án {du_an}. Em vừa nhận được thông tin anh/chị quan tâm đến dự án. Anh/chị tiện nghe máy lúc nào để em gửi thông tin chi tiết, bảng giá và chính sách mới nhất ạ? Mọi thắc mắc anh/chị có thể liên hệ em qua số {sdt_toi}. Em cảm ơn anh/chị!' },
{ id: 'project_info', title: 'Gửi thông tin dự án', text:
'Dạ em gửi anh/chị {ten} thông tin dự án {du_an} – loại căn {loai_can} như anh/chị quan tâm. Mức giá tham khảo từ {so_tien}, chính sách thanh toán cập nhật theo tháng. Anh/chị xem qua, có điểm nào cần làm rõ em giải đáp ngay ạ. Em {ten_toi} – {sdt_toi}.' },
{ id: 'viewing_reminder', title: 'Nhắc lịch xem nhà', text:
'Dạ em chào anh/chị {ten}, em {ten_toi} xin nhắc lịch xem căn {loai_can} tại dự án {du_an} vào {ngay}. Em sẽ có mặt đón anh/chị tại nhà mẫu. Nếu anh/chị cần đổi giờ, anh/chị nhắn em để em sắp xếp lại ạ. Em cảm ơn anh/chị!' },
{ id: 'birthday', title: 'Chúc mừng sinh nhật', text:
'Nhân dịp sinh nhật, em {ten_toi} kính chúc anh/chị {ten} tuổi mới thật nhiều sức khoẻ, bình an và hạnh phúc bên gia đình. Cảm ơn anh/chị đã luôn tin tưởng em trong thời gian qua ạ!' },
{ id: 'payment_reminder', title: 'Nhắc đóng tiền đợt', text:
'Dạ em chào anh/chị {ten}, em {ten_toi} xin thông tin đến anh/chị: đợt thanh toán sắp tới của căn hộ tại dự án {du_an} là {so_tien}, hạn ngày {ngay}. Anh/chị cần em hỗ trợ thông tin tài khoản hoặc thủ tục, anh/chị cứ nhắn em ạ. Em cảm ơn anh/chị!' },
{ id: 'handover', title: 'Chúc mừng nhận nhà', text:
'Em {ten_toi} xin chúc mừng anh/chị {ten} đã nhận bàn giao căn hộ tại dự án {du_an}! Chúc gia đình mình an cư vui vẻ, vạn sự hanh thông. Trong quá trình sử dụng, anh/chị cần hỗ trợ gì về thủ tục hay dịch vụ, em luôn sẵn sàng ạ.' },
{ id: 'referral', title: 'Hỏi giới thiệu', text:
'Dạ em chào anh/chị {ten}, em {ten_toi} đây ạ. Cảm ơn anh/chị đã đồng hành cùng em tại dự án {du_an}. Nếu người thân hay bạn bè của anh/chị đang tìm nhà, anh/chị giới thiệu giúp em nhé, em hứa sẽ tư vấn tận tâm như đã làm với anh/chị. Em cảm ơn anh/chị nhiều!' },
{ id: 'periodic_care', title: 'Chăm sóc định kỳ', text:
'Dạ em chào anh/chị {ten}, lâu rồi em {ten_toi} chưa hỏi thăm anh/chị. Dạo này gia đình mình vẫn khoẻ chứ ạ? Thị trường khu vực {du_an} vừa có vài cập nhật mới, anh/chị muốn em gửi thông tin tham khảo không ạ? Em cảm ơn anh/chị!' },
{ id: 'after_viewing', title: 'Cảm ơn sau buổi xem nhà', text:
'Dạ em cảm ơn anh/chị {ten} đã dành thời gian đi xem căn {loai_can} tại dự án {du_an} hôm nay. Em gửi kèm thông tin để anh/chị tham khảo thêm cùng gia đình. Anh/chị cần so sánh phương án thanh toán, em làm bảng tính chi tiết ngay ạ.' },
{ id: 'new_policy', title: 'Cập nhật chính sách mới', text:
'Dạ em chào anh/chị {ten}, dự án {du_an} vừa cập nhật chính sách bán hàng áp dụng từ ngày {ngay}. Em tóm tắt các điểm chính để anh/chị tham khảo, anh/chị tiện lúc nào em gọi trao đổi kỹ hơn ạ. Em {ten_toi} – {sdt_toi}.' },
];
export function fillTemplate(text, vars = {}, opts = {}) {
const money = opts.money || moneyFallback;
let _o1i = String(text || '').replace(/\{(\w+)\}/g, (_, _o18) => {
let v = vars[_o18];
if (v === null || v === undefined || v === '') return '';
if (_o18 === 'so_tien' && typeof v === 'number') v = money(v);
return String(v);
});
_o1i = _o1i.split('\n').map(_o19 => _o19.replace(/ {2,}/g, ' ').replace(/ +([.,!?;:])/g, '$1').trim()).join('\n');
return _o1i.trim();
}
export function givenName(full) {
const _o1l = String(full || '').replace(/[(（][^)）]*[)）]/g, ' ').trim().split(/\s+/);
return _o1l[_o1l.length - 1] || '';
}
export function projectName(projects, idOrName) {
if (!idOrName) return '';
const list = Array.isArray(projects) ? projects : Object.values(projects || {});
const _o1j = list.find(x => x && (x.id === idOrName || x.name === idOrName));
return _o1j ? (_o1j.name || _o1j.id) : String(idOrName);
}
export function templateVars(customer = {}, me = {}, data = {}, extra = {}) {
return {
ten: givenName(customer.name),
du_an: projectName(data.projects, customer.project),
loai_can: customer.unit_type || '',
so_tien: customer.budget ? Number(customer.budget) : '',
ngay: '',
ten_toi: me.name || '',
sdt_toi: me.phone || '',
...extra,
};
}
export const TEMPLATE_VARS = [
{ key: 'ten', label: 'Tên khách' }, { key: 'du_an', label: 'Dự án' }, { key: 'loai_can', label: 'Loại căn' },
{ key: 'so_tien', label: 'Số tiền' }, { key: 'ngay', label: 'Ngày' }, { key: 'ten_toi', label: 'Tên của anh/chị' }, { key: 'sdt_toi', label: 'SĐT của anh/chị' },
];
export function normTemplateCfg(cfg) {
const c = cfg && typeof cfg === 'object' ? cfg : {};
return { overrides: c.overrides && typeof c.overrides === 'object' ? c.overrides : {}, custom: Array.isArray(c.custom) ? c.custom : [], hidden: Array.isArray(c.hidden) ? c.hidden : [] };
}
export function mergeTemplates(defaults, cfg, skillList = []) {
const c = normTemplateCfg(cfg);
const _oj = defaults.filter(t => !c.hidden.includes(t.id)).map(t => {
const _o1h = c.overrides[t.id];
return _o1h ? { ...t, title: _o1h.title || t.title, text: _o1h.text || t.text, edited: true } : { ...t };
});
const custom = c.custom.filter(t => t && t.text && !c.hidden.includes(t.id)).map(t => ({ ...t, custom: true }));
return _oj.concat(custom, skillList);
}
export function saveTemplateEdit(cfg, t, { title, text }, newId) {
const c = normTemplateCfg(cfg);
title = String(title || '').trim(); text = String(text || '').trim();
if (!text) throw new Error('Nội dung mẫu đang trống');
if (t && !t.custom && !t.skill) return { ...c, overrides: { ...c.overrides, [t.id]: { title: title || t.title, text } } };
if (t && t.custom) return { ...c, custom: c.custom.map(x => x.id === t.id ? { ...x, title: title || x.title, text } : x) };
return { ...c, custom: c.custom.concat([{ id: newId || ('my_' + Date.now().toString(36)), title: title || 'Mẫu của tôi', text }]) };
}
export function resetTemplate(cfg, id) { const c = normTemplateCfg(cfg); const _o1h = { ...c.overrides }; delete _o1h[id]; return { ...c, overrides: _o1h }; }
export function removeTemplate(cfg, id) { const c = normTemplateCfg(cfg); return { ...c, custom: c.custom.filter(x => x.id !== id) }; }
export function unknownVars(text) {
const ok = new Set(TEMPLATE_VARS.map(v => v.key));
return [...new Set((String(text || '').match(/\{(\w+)\}/g) || []).map(m => m.slice(1, -1)).filter(_o18 => !ok.has(_o18)))];
}
export function fromPrice(project, unitType) {
if (!project || !Array.isArray(project.price) || !project.price[0]) return 0;
const types = Array.isArray(project.types) ? project.types : [];
const t = types.find(x => x && x.n === unitType && Array.isArray(x.a)) || types.find(x => x && Array.isArray(x.a));
if (!t) return 0;
return Math.round(t.a[0] * project.price[0] * 1e6 / 1e7) * 1e7;
}
export function skillTemplates(skills) {
const _oh = Array.isArray(skills) ? skills : (skills && typeof skills === 'object' ? Object.values(skills) : []);
const _o1i = [];
_oh.forEach((_o1s, i) => {
if (!_o1s || _o1s.kind !== 'templates' || _o1s.enabled === false) return;
const body = parseData(_o1s.data);
const items = _o1s.items || _o1s.templates || body.items || body.templates || [];
items.forEach((t, _o17) => {
if (typeof t === 'string') t = { text: t };
const text = t && (t.text || t.body || t.content);
if (!text) return;
_o1i.push({ id: t.id || ('skill_' + i + '_' + _o17), title: t.title || t.name || ('Mẫu ' + (_o17 + 1)), text, skill: _o1s.name || _o1s.id || 'Mẫu cài thêm' });
});
});
return _o1i;
}
export function isNewLead(c, events, contacted) {
if (!c || Number(c.deleted) || c.source !== 'landing') return false;
if (parseData(c.data).handled) return false;
if (!_o15(c.status)) return false;
if (contacted) return !contacted.has(c.id);
return !(events || []).some(e => e.object_id === c.id && !Number(e.deleted) && (e.type === 'call' || e.type === 'zalo'));
}
function _of(_o1r) { return (_o1r || []).filter(r => !Number(r.done) && !Number(r.deleted)); }
const _ok = (a, _oi) => (a.due_at || 0) - (_oi.due_at || 0);
export function reminderBuckets(reminders, now) {
const [a, _oi] = dayRange(now);
const act = _of(reminders).sort(_ok);
return {
overdue: act.filter(r => r.due_at < a),
today: act.filter(r => r.due_at >= a && r.due_at <= _oi),
upcoming: act.filter(r => r.due_at > _oi),
};
}
export function snooze(r, days, now) {
return { ...r, due_at: Math.max(Number(r.due_at) || 0, now) + days * DAY, notified_at: 0, updated_at: now };
}
function _oq(now) { const _os = new Date(now); return _os.getFullYear() + '-' + _o1k(_os.getMonth() + 1); }
export function stalePolicies(policies, now) {
const _op = _oq(now);
const latest = new Map();
for (const _o1j of policies || []) {
if (Number(_o1j.deleted) || _o1j.status !== 'active') continue;
const _o18 = _o1j.project_id || _o1j.id;
const _o1o = latest.get(_o18);
if (!_o1o || String(_o1j.month || '') > String(_o1o.month || '')) latest.set(_o18, _o1j);
}
return [...latest.values()].filter(_o1j => String(_o1j.month || '') < _op);
}
const _o1 = ['followup', 'custom', 'birthday', 'referral', 'handover'];
export function buildBrief({ customers, events, reminders, policies, now, logic }) {
const _oo = activeCustomers(customers);
const [a, _oi] = dayRange(now);
const act = _of(consent.visibleReminders(reminders, _oo)).filter(r => r.kind !== 'policy_stale').sort(_ok);
const _ox = new Map(), contacted = new Set();
for (const e of events || []) {
if (Number(e.deleted)) continue;
let _o19 = _ox.get(e.object_id); if (!_o19) _ox.set(e.object_id, _o19 = []); _o19.push(e);
if (e.type === 'call' || e.type === 'zalo') contacted.add(e.object_id);
}
const _o21 = new Set();
for (const e of events || []) if (!Number(e.deleted) && Number(e.at) >= a) _o21.add(e.object_id);
const _oy = id => (_ox.get(id) || []).slice().sort((x, _o28) => (_o28.at || 0) - (x.at || 0));
const newLeads = _oo.filter(c => isNewLead(c, events, contacted)).sort((x, _o28) => (_o28.created_at || 0) - (x.created_at || 0));
const dueToday = act.filter(r => _o1.includes(r.kind || 'followup') && r.due_at >= a && r.due_at <= _oi);
const _o10 = logic && logic.remind && logic.remind.followupDue;
if (typeof _o10 === 'function') {
const _om = new Set(dueToday.map(r => r.object_id).concat(newLeads.map(c => c.id)));
for (const c of _oo) {
if (_om.has(c.id) || _o21.has(c.id) || !consent.gate(c, 'contact').ok) continue;
let due = false;
try { due = _o10(c, _oy(c.id), now); } catch { due = false; }
if (due) dueToday.push({ id: 'fu_' + c.id, object_id: c.id, kind: 'followup', title: 'Đến hạn gọi chăm sóc', due_at: a, virtual: true });
}
}
return {
newLeads,
dueToday,
overdue: act.filter(r => r.due_at < a),
paymentsSoon: act.filter(r => r.kind === 'payment' && r.due_at >= a && r.due_at <= _oi + 7 * DAY),
meetingsToday: act.filter(r => r.kind === 'meeting' && r.due_at >= a && r.due_at <= _oi),
stalePolicies: [],
};
}
export function normalizePlan(plan) {
plan = plan || {};
const _o1q = plan.steps || plan.schedule || plan.installments || plan.milestones || [];
const steps = _o1q.map((_o1s, i) => {
let pct = _o1s.pct ?? _o1s.percent ?? _o1s.percentage;
if (pct === undefined && _o1s.ratio !== undefined) pct = _o1s.ratio <= 1 ? _o1s.ratio * 100 : _o1s.ratio;
return {
label: _o1s.label || _o1s.name || _o1s.title || ('Đợt ' + (i + 1)),
pct: Number(pct) || 0,
days: Number(_o1s.days ?? _o1s.after_days ?? _o1s.offset_days ?? 0) || 0,
months: Number(_o1s.months ?? _o1s.after_months ?? _o1s.month_offset ?? (typeof _o1s.mo === 'number' ? _o1s.mo : 0)) || 0,
date: _o1s.date || _o1s.due_date || '',
};
});
return { id: plan.id || '', name: plan.name || plan.title || 'Phương án', steps };
}
function toRow(it, i, total, before, _o1x) {
let date = it.date || it.dueDate || it.due || it.due_date || '';
const _o1d = it.due_at ?? it.at;
if (!date && _o1d) date = ymd(_o1d);
if (!date && it.dueYM) {
const [_o28, m] = String(it.dueYM).split('-').map(Number);
const _o1a = new Date(_o28, m, 0).getDate();
date = _o28 + '-' + _o1k(m) + '-' + _o1k(Math.min(_o1x || 1, _o1a));
}
if (date && !/^\d{4}-\d{2}-\d{2}/.test(date)) { const t = parseYmd(date); date = Number.isFinite(t) ? ymd(t) : ''; }
const pct = Number(it.pct ?? it.percent ?? 0);
const amount = Number(it.amount ?? it.money ?? it.value) || (pct ? Math.round(total * pct / 100) : 0);
return {
installment: Number(it.installment || it.no || it.index) || i + 1,
label: it.label || it.name || it.title || ('Đợt ' + (i + 1)),
date, amount: Math.round(amount),
before: Number(it.remind_before_days ?? it.before ?? before),
};
}
export function buildPaymentRows({ total, plan, start, before = 3, logic, project }) {
total = Number(total) || 0;
const _o1z = start || ymd(Date.now());
const _o1y = parseYmd(_o1z);
const _o1x = new Date(_o1y).getDate();
const _o1t = logic && logic.pay && logic.pay.schedule;
if (typeof _o1t === 'function') {
const _o22 = [
() => _o1t(project, plan, total, _o1z),
() => _o1t({ total, price_total: total, plan, start: _o1z, start_at: _o1y, project }),
];
for (const t of _o22) {
try {
const r = t();
let items = Array.isArray(r) ? r : (r && (r.rows || r.items || r.schedule));
if (!Array.isArray(items) || !items.length) continue;
items = items.filter(x => !x.bank);
const _oz = logic.remind && logic.remind.fromSchedule;
if (typeof _oz === 'function') {
try {
const _o1r = _oz({ customerId: '_', schedule: items, beforeDays: before });
if (Array.isArray(_o1r) && _o1r.length === items.length && _o1r.every(x => x.due_at)) {
return _o1r.map((x, i) => ({
installment: Number(x.installment) || i + 1,
label: items[i].name || items[i].label || ('Đợt ' + (i + 1)),
date: (/^\d{4}-\d{2}-\d{2}$/.test(items[i].dueDate || '') ? items[i].dueDate : ymdVN(x.due_at)),
amount: Math.round(Number(x.amount) || 0),
before: Number(x.remind_before_days ?? before),
}));
}
} catch { }
}
return items.map((it, i) => toRow(it, i, total, before, _o1x));
} catch { }
}
}
const _o1g = normalizePlan(plan);
const steps = _o1g.steps.length ? _o1g.steps : [{ label: 'Thanh toán', pct: 100, days: 0, months: 0 }];
const _o20 = steps.reduce((_o1s, x) => _o1s + x.pct, 0);
let _oe = 0;
return steps.map((_o1s, i) => {
let amount = Math.round(total * _o1s.pct / 100);
if (i === steps.length - 1 && Math.abs(_o20 - 100) < 0.01) amount = total - _oe;
_oe += amount;
const _o1d = _o1s.date ? parseYmd(_o1s.date) : addMonths(addDays(_o1y, _o1s.days), _o1s.months);
return { installment: i + 1, label: _o1s.label, date: ymd(_o1d), amount, before };
});
}
export function sumRows(rows) { return (rows || []).reduce((_o1s, r) => _o1s + (Number(r.amount) || 0), 0); }
let _od = 0;
export function fallbackId() { return Date.now().toString(36) + (++_od).toString(36) + Math.random().toString(36).slice(2, 8); }
const _o0 = 9 * 3600e3;
export function careReminders({ object_id, name = '', rows = [], handover, birthday, referral, now = Date.now(), newId = fallbackId, project = '' }) {
const _o26 = name ? ' – ' + name : '';
const _oj = (kind, title, due_at, extra = {}, dataExtra = {}) => ({
id: newId(), object_id, kind, title, due_at, remind_before_days: 0, amount: 0, installment: 0,
done: 0, notified_at: 0, data: JSON.stringify({ source: 'care', project, ...dataExtra }),
updated_at: now, deleted: 0, ...extra,
});
const _o1i = [];
for (const r of rows) {
const t = parseYmd(r.date);
if (!Number.isFinite(t)) continue;
_o1i.push(_oj('payment', (r.label || ('Đợt ' + r.installment)) + _o26, t + _o0, {
amount: Number(r.amount) || 0, installment: Number(r.installment) || 0, remind_before_days: Number(r.before) || 0,
}));
}
if (handover && Number.isFinite(parseYmd(handover))) _o1i.push(_oj('handover', 'Bàn giao nhà' + _o26, parseYmd(handover) + _o0, { remind_before_days: 7 }));
const _o1e = nextBirthday(birthday, now);
if (_o1e) _o1i.push(_oj('birthday', 'Sinh nhật' + _o26, _o1e + _o0, { remind_before_days: 1 }, { yearly: 1 }));
if (referral && Number.isFinite(parseYmd(referral))) _o1i.push(_oj('referral', 'Hỏi giới thiệu' + _o26, parseYmd(referral) + _o0));
return _o1i;
}
export function anonymize(c, now = Date.now()) {
return {
...c, name: 'Đã xoá', phone: '', zalo: '', email: '', note: '', tags: '', birthday: '', lead_ref: '',
budget: 0, score: 0, consent: 0, data: JSON.stringify({ erased: 1, erased_at: now }), deleted: 1, updated_at: now,
};
}
function _ow(_os) { const _o1w = parseData(_os.data).status || _os.status; return !_o1w || _o1w === 'pending'; }
export function inboxItems({ customers, events, policies, jobs, ideas, settingsDrafts }) {
const _o1i = [];
for (const c of activeCustomers(customers)) if (isNewLead(c, events)) _o1i.push({ kind: 'lead', ref: c, title: c.name || 'Khách mới', sub: c.phone || '' });
for (const e of events || []) if (e.type === 'zalo_draft' && !Number(e.deleted) && _ow(e)) _o1i.push({ kind: 'zalo', ref: e, title: 'Nháp tin Zalo', sub: String(e.text || '').slice(0, 80) });
for (const _os of settingsDrafts || []) if (_os && !Number(_os.deleted) && _ow(_os)) _o1i.push({ kind: 'zalo', ref: _os, title: 'Nháp tin Zalo', sub: String(_os.text || '').slice(0, 80), fromSettings: true });
for (const _o1j of policies || []) if (!Number(_o1j.deleted) && _o1j.status === 'draft') _o1i.push({ kind: 'policy', ref: _o1j, title: 'Chính sách chờ duyệt', sub: (_o1j.project_id || '') + (_o1j.month ? ' · ' + _o1j.month : '') });
for (const _o17 of jobs || []) if (!Number(_o17.deleted) && _o17.status === 'waiting_approval') _o1i.push({ kind: 'job', ref: _o17, title: _o17.title || 'Việc chờ duyệt', sub: _o17.type || '' });
for (const i of ideas || []) if (!Number(i.deleted) && i.status === 'new') _o1i.push({ kind: 'idea', ref: i, title: i.title || 'Ý tưởng', sub: i.summary ? String(i.summary).slice(0, 80) : (i.source || '') });
return _o1i;
}

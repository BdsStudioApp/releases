import { greetWord } from '../../../core/greet.60b99ed569.js';
export const DAY = 86400000;
export function strip(_o1u) {
if (_o1u === null || _o1u === undefined) return '';
return String(_o1u)
.normalize('NFD').replace(/[̀-ͯ]/g, '')
.replace(/đ/g, 'd').replace(/Đ/g, 'D')
.toLowerCase().replace(/\s+/g, ' ').trim();
}
export function parseData(_ot) {
if (!_ot) return {};
if (typeof _ot === 'object') return _ot;
try { const v = JSON.parse(_ot); return v && typeof v === 'object' ? v : {}; } catch { return {}; }
}
function parseNum(_o1u) {
_o1u = String(_o1u).trim();
if (/^\d{1,3}([.,]\d{3})+$/.test(_o1u)) return Number(_o1u.replace(/[.,]/g, ''));
const v = Number(_o1u.replace(',', '.'));
return Number.isFinite(v) ? v : NaN;
}
export function parseMoney(input) {
if (input === null || input === undefined || input === '') return null;
if (typeof input === 'number') {
if (!Number.isFinite(input) || input <= 0) return null;
if (input >= 1e5) return Math.round(input);
input = String(input);
}
let _o1u = strip(input).replace(/vnd|dong/g, '').replace(/(\d)\s*d\b/g, '$1')
.replace(/\s*(\/\s*(thang|th)|(mot|moi|1)\s*thang)\s*$/, '').replace(/\s+/g, ' ').trim();
if (!_o1u) return null;
const _oa = '(\\d+(?:[.,]\\d+)*)';
let m = _o1u.match(new RegExp('^' + _oa + '\\s*(?:ty|ti)\\s*(\\d+)?\\s*(tr|trieu|m)?$'));
if (m) {
const a = parseNum(m[1]);
if (!Number.isFinite(a)) return null;
let v = a * 1e9;
if (m[2]) v += m[3] ? Number(m[2]) * 1e6 : Number((m[2] + '000').slice(0, 3)) * 1e6;
return Math.round(v);
}
m = _o1u.match(new RegExp('^' + _oa + '\\s*(tr|trieu|m)$'));
if (m) { const a = parseNum(m[1]); return Number.isFinite(a) ? Math.round(a * 1e6) : null; }
m = _o1u.match(new RegExp('^' + _oa + '\\s*(k|nghin|ngan)$'));
if (m) { const a = parseNum(m[1]); return Number.isFinite(a) ? Math.round(a * 1e3) : null; }
m = _o1u.match(new RegExp('^' + _oa + '$'));
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
export function normPhone(_o1l) {
let _ot = String(_o1l || '').replace(/\D/g, '');
if (_ot.startsWith('84') && _ot.length >= 11) _ot = '0' + _ot.slice(2);
if (_ot.length === 9 && !_ot.startsWith('0')) _ot = '0' + _ot;
return _ot;
}
export function validPhone(_o1l) { return /^0[35789]\d{8}$/.test(normPhone(_o1l)) || /^02\d{9}$/.test(normPhone(_o1l)); }
const _o7 = /^(?:anh|chị|chi|em|cô|chú|bác|ông|bà|cháu)$/i;
const _ob = 'anh/chị|chị|chi|em|tôi|toi|mình|minh|tớ|cháu|cô|chú|bác';
const _o9 = new Set(['cho', 'hỏi', 'giá', 'căn', 'cần', 'mua', 'bán', 'thuê', 'muốn', 'xem', 'nhà', 'dự', 'án', 'mình', 'tôi', 'số', 'sđt', 'sdt', 'zalo',
'gọi', 'liên', 'hệ', 'ơi', 'ạ', 'là', 'tên', 'của', 'và', 'với', 'được', 'không', 'có', 'bao', 'nhiêu', 'tầm', 'khoảng', 'về', 'ở', 'tại', 'hộ', 'đất', 'nền',
'khách', 'chào', 'dạ', 'vâng', 'nhé', 'nè', 'đây', 'shop', 'bạn', 'admin', 'em', 'anh', 'chị', 'đang', 'đã', 'sẽ']);
const _o8 = new Set(['số', 'sđt', 'sdt', 'zalo', 'tên', 'là', 'cần', 'hỏi', 'mua', 'bán', 'thuê', 'muốn', 'xem', 'cho', 'giá', 'căn']);
const _o1g = (_o26) => { const _o1a = _o26.toLocaleLowerCase('vi'); return _o8.has(_o1a) || (!_o15(_o26) && _o9.has(_o1a)); };
const _o3 = new RegExp('^(?:(?:xin\\s+)?ch[aà]o(?:\\s+(?:em|anh/chị|chị|chi|bạn|shop|ad|admin|cả\\s+nhà|mọi\\s+người))?|(?:em|anh/chị|chị|chi|mình|tôi)\\s+ch[aà]o\\s+(?:em|anh/chị|chị|chi|bạn|shop|cả\\s+nhà)|d[aạ]|vâng|alo|hi|hello|ơi|ạ|nhé)(?:\\s+(?:ạ|ơi|nhé|nha))?(?=[\\s,.;:!?]|$)[\\s,.;:!?–\\-]*', 'i');
const _oc = /(?:\s+|^)(?:ạ|nhé|nha|nè|đây|ơi|à|nhá)$/i;
const _o2 = /(?:s[đd]t|s[oố](?:\s*(?:[đd]i[eệ]n\s*tho[aạ]i|[đd]t|em|anh|chị|chi|mình|tôi|của\s+\S+))?|[đd]t|phone|zalo|li[eê]n\s*h[eệ]|g[oọ]i)\s*[:：]?\s*$/i;
const _o25 = (_o26) => _o26.charAt(0).toLocaleUpperCase('vi') + _o26.slice(1).toLocaleLowerCase('vi');
const _o17 = (_o26) => /^\p{L}+$/u.test(_o26);
const _o15 = (_o26) => /^\p{Lu}/u.test(_o26);
function _om(seg) {
let x = String(seg || '').replace(/\s+/g, ' ').trim();
for (let i = 0; i < 4 && _o3.test(x); i++) x = x.replace(_o3, '').trim();
for (let i = 0; i < 3; i++) x = x.replace(_o2, '').replace(_oc, '').replace(/[\s:：\-–—,.;|/(]+$/, '').trim();
return x.replace(/^[\s:：\-–—,.;|/]+/, '').trim();
}
const _os = (x) => x.split(/\s+(?:c[aầ]n|h[oỏ]i|mu[oố]n|quan\s*t[aâ]m|mua|thu[eê]|b[aá]n|xem|[đd][aã]|đang|dang|nè|đây|ạ)(?:\s|$)/i)[0].trim();
function _o14(x, kin) {
const words = [];
for (const _o26 of _om(x).split(' ')) { if (!_o17(_o26) || _o1g(_o26)) break; words.push(_o26); if (words.length === 4) break; }
if (!words.length) return '';
const nm = words.map(_o25).join(' ');
return words.length === 1 && /^(?:anh|chị|chi)$/i.test(kin || '') ? _o25(kin.replace(/^chi$/i, 'chị')) + ' ' + nm : nm;
}
function _o1p(x) {
const _o26 = _os(_om(x)).split(' ').filter(Boolean);
if (!_o26.length || _o26.length > 5 || !_o26.every(_o17)) return '';
if (_o7.test(_o26[0])) {
const rest = _o26.slice(1, 5);
return rest.length && rest.every((r) => _o15(r) && !_o1g(r)) ? [_o26[0], ...rest].join(' ') : '';
}
if (_o26.length > 4 || _o26.some(_o1g)) return '';
if (_o26.every(_o15)) return _o26.join(' ');
return _o26.length >= 2 ? _o26.map(_o25).join(' ') : '';
}
const _o6 = new RegExp('(?:^|[\\s,.;:!?])(?:(' + _ob + ')\\s+(?:t[eê]n\\s+(?:l[aà]\\s+)?|l[aà]\\s+)|(?:(' + _ob + ')\\s+)?t[eê]n(?:\\s+l[aà]|\\s*[:：])?\\s+)([^\\n,.;!?\\d]+)', 'iu');
export function leadName(text, phoneAt = -1) {
const _o1s = String(text || '');
const label = _o1s.match(/(?:^|\n)\s*(?:h[oọ]\s*(?:v[aà]\s*)?t[eê]n|t[eê]n(?:\s*kh[aá]ch)?|name)\s*[:：\-]\s*([^\n]+)/i);
if (label) { const n = _o14(label[1].split(/[,.;!?\d]|\s(?:s[đd]t|zalo)\b/i)[0]); if (n) return n; }
const before = phoneAt >= 0 ? _o1s.slice(0, phoneAt) : _o1s;
for (const _o1x of [before, _o1s]) {
const m = _o1x.match(_o6);
if (m) { const n = _o14(m[3], m[1] || m[2]); if (n) return n; }
}
const _o1w = before.split(/\n/).pop().split(/[,.;!?]/).map(_om).filter(Boolean);
let n = _o1w.length ? _o1p(_o1w[_o1w.length - 1]) : '';
if (!n && phoneAt >= 0 && !_o1w.length) {
const _oh = _o1s.slice(phoneAt).replace(/^[\s+\d.\-]+/, '').replace(/^[\s:：\-–—,.;|/]+/, '').split(/[\n,.;!?]/)[0];
n = _o1p(_oh);
}
return n.slice(0, 80);
}
export function parseLeadText(text) {
const _o1s = String(text || '').replace(/\r/g, '').trim();
if (!_o1s) return null;
const m = _o1s.match(/(?:\+?84|0)(?:[\s.\-]?\d){9,10}/);
const phone = m ? normPhone(m[0]) : '';
if (!phone || !validPhone(phone)) return null;
const name = leadName(_o1s, m.index);
const _oj = strip(_o1s).match(/(\d+(?:[.,]\d+)?)\s*(ty|ti|trieu|tr)\b(?:\s*(\d{1,3})\b)?/);
const budget = _oj ? parseMoney(_oj[1] + ' ' + _oj[2] + (_oj[3] && /^t[yi]$/.test(_oj[2]) ? ' ' + _oj[3] : '')) || 0 : 0;
const _o24 = _o1s.match(/\b([1-5])\s*(?:PN|pn|N|n|phòng ngủ|phong ngu)\b(\+?)/);
return { name, phone, budget, unit_type: _o24 ? _o24[1] + 'N' + _o24[2] : (/\bstudio\b/i.test(_o1s) ? 'Studio' : ''), note: _o1s.slice(0, 1000) };
}
export function findDuplicatePhone(list, phone, exceptId) {
const _o1l = normPhone(phone);
if (!_o1l) return null;
return activeCustomers(list).find(c => c.id !== exceptId &&
(normPhone(c.phone) === _o1l || normPhone(c.zalo) === _o1l)) || null;
}
export function parseYmd(_o1u) {
if (typeof _o1u === 'number') return _o1u;
const m = String(_o1u || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
if (m) return new Date(+m[1], +m[2] - 1, +m[3]).getTime();
const _o1d = String(_o1u || '').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
if (_o1d) return new Date(+_o1d[3], +_o1d[2] - 1, +_o1d[1]).getTime();
return NaN;
}
const _o1m = n => String(n).padStart(2, '0');
export function ymd(_o1e) { const _ot = new Date(_o1e); return _ot.getFullYear() + '-' + _o1m(_ot.getMonth() + 1) + '-' + _o1m(_ot.getDate()); }
export function ymdVN(_o1e) { return new Date(Number(_o1e) + 7 * 3600e3).toISOString().slice(0, 10); }
export function dmy(_o1e) { const _ot = new Date(_o1e); return _o1m(_ot.getDate()) + '/' + _o1m(_ot.getMonth() + 1) + '/' + _ot.getFullYear(); }
export function hm(_o1e) { const _ot = new Date(_o1e); return _o1m(_ot.getHours()) + ':' + _o1m(_ot.getMinutes()); }
export function dayRange(now) {
const _ot = new Date(now); _ot.setHours(0, 0, 0, 0);
const a = _ot.getTime();
const e = new Date(a); e.setDate(e.getDate() + 1);
return [a, e.getTime() - 1];
}
export function addDays(_o1e, n) { const _ot = new Date(_o1e); _ot.setDate(_ot.getDate() + n); return _ot.getTime(); }
export function addMonths(_o1e, n) {
const _ot = new Date(_o1e); const _ov = _ot.getDate();
_ot.setDate(1); _ot.setMonth(_ot.getMonth() + n);
const _o1b = new Date(_ot.getFullYear(), _ot.getMonth() + 1, 0).getDate();
_ot.setDate(Math.min(_ov, _o1b));
return _ot.getTime();
}
export function nextBirthday(bday, now) {
const m = String(bday || '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
if (!m) return null;
const [start] = dayRange(now);
const _o29 = new Date(now).getFullYear();
let t = new Date(_o29, +m[2] - 1, +m[3]).getTime();
if (t < start) t = new Date(_o29 + 1, +m[2] - 1, +m[3]).getTime();
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
const _o1u = strip(need).replace(/\s/g, '');
return _o1u === 'chothue' ? 'chothue' : _o1u === 'thue' ? 'thue' : _o1u === 'ban' ? 'ban' : 'mua';
}
export function statusList(logic, need) {
try {
const _o1y = logic && logic.status;
if (_o1y && _o1y.lists && typeof _o1y.group === 'function') {
const _o1a = _o1y.lists[_o1y.group(need || '')];
if (Array.isArray(_o1a) && _o1a.length) return _o1a;
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
export function statusTone(_o1y) {
const _o1u = strip(_o1y);
if (!_o1u || /\bmoi\b|^new/.test(_o1u)) return 'info';
if (/khong nghe/.test(_o1u)) return 'warn';
if (/ngung|huy|mat khach|lost|khong|tam dung|dung ban|dung cho thue|sai so|so ao|^trung$/.test(_o1u)) return 'muted';
if (/da mua|coc|da ban|da thue|da cho thue|ban giao|ky hd|won|^chot$/.test(_o1u)) return 'success';
return 'warn';
}
export function isPostSale(c) { const _o1u = strip(c && c.status); return /da mua|coc|ban giao|^chot$/.test(_o1u); }
function _o16(_o1y) { const _o1u = strip(_o1y); return !_o1u || /\bmoi\b|^new\b/.test(_o1u); }
export function patchData(c, patch = {}) {
const _ot = { ...parseData(c && c.data) };
for (const [_o19, v] of Object.entries(patch || {})) {
if (v === null || v === undefined) delete _ot[_o19]; else _ot[_o19] = v;
}
return JSON.stringify(_ot);
}
export function tagList(tags) {
return String(tags || '').normalize('NFC').split(/\s*[,;]\s*/).map(_o1u => _o1u.trim()).filter(Boolean);
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
export function heatLabel(id) { const x = HEAT_LEVELS.find(_o1a => _o1a.id === id); return x ? x.label : ''; }
export function heatTiers(cfg) {
const t = (cfg && cfg.tiers) || cfg || {};
const hot = Number.isFinite(Number(t.hot)) && t.hot !== '' && t.hot !== null ? Number(t.hot) : HEAT_TIERS.hot;
const warm = Number.isFinite(Number(t.warm)) && t.warm !== '' && t.warm !== null ? Math.min(Number(t.warm), hot) : HEAT_TIERS.warm;
return { hot, warm };
}
export function heatOf(c, { tiers } = {}) {
const _ot = parseData(c && c.data);
const _o1k = (id, source, extra = {}) => ({ id, label: heatLabel(id), source, ...extra });
if (HEAT_IDS.includes(_ot.heat)) return _o1k(_ot.heat, 'manual');
const _o1c = _ot.pool && typeof _ot.pool === 'object' ? _ot.pool.level : '';
if (_o1c === 'hot' || _o1c === 'warm' || _o1c === 'cold') return _o1k(_o1c === 'warm' ? 'normal' : _o1c, 'lead');
if (hasHotTag(c && c.tags)) return _o1k('hot', 'tag');
const _o1u = Number(c && c.score) || 0;
if (_o1u > 0) {
const t = heatTiers(tiers);
return _o1k(_o1u >= t.hot ? 'hot' : _o1u >= t.warm ? 'normal' : 'cold', 'score', { score: _o1u });
}
return _o1k('normal', 'none');
}
export function heatTitle(h) {
if (!h) return '';
const _o28 = h.source === 'manual' ? 'anh/chị đã chọn'
: h.source === 'lead' ? 'theo Mức độ của lead công ty cấp'
: h.source === 'tag' ? 'theo nhãn "nóng"'
: h.source === 'score' ? 'app tự tính theo hành vi (' + h.score + ' điểm)'
: 'chưa đánh giá';
return 'Mức quan tâm: ' + h.label + ' – ' + _o28;
}
export function heatPatch(c, level, now = Date.now()) {
const _o1c = HEAT_IDS.includes(level) ? level : null;
const data = patchData(c, { heat: _o1c, heat_at: _o1c ? now : null });
const tags = tagList(c && c.tags).filter(t => !isHotTag(t));
if (_o1c === 'hot') tags.push(HOT_TAG);
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
export function canProfile(c) { return Number(c && c.consent) === 1; }
export function activeCustomers(list) {
return (list || []).filter(c => !Number(c.deleted) && (!c.kind || c.kind === 'customer'));
}
const _o4 = new WeakMap();
function _o13(c) {
let _o1u = _o4.get(c);
if (_o1u === undefined) { _o1u = strip([c.name, c.project, c.project_name, c.note, c.unit_type, c.tags, c.email].join(' ')); _o4.set(c, _o1u); }
return _o1u;
}
export function filterCustomers(list, f = {}) {
const q = strip(f.q);
const _o1r = String(f.q || '').replace(/\D/g, '');
const words = q ? q.split(' ') : [];
return activeCustomers(list).filter(c => {
if (f.status && c.status !== f.status) return false;
if (f.need && strip(c.need) !== strip(f.need)) return false;
if (f.project && c.project !== f.project) return false;
if (f.source && c.source !== f.source && !(f.source === 'webhook' && String(c.source || '').startsWith('webhook:'))) return false;
if (f.heat && heatOf(c, { tiers: f.tiers }).id !== f.heat) return false;
if (f.disc && (f.disc === 'none' ? !!discOf(c) : (discOf(c) || {}).id !== f.disc)) return false;
if (words.length) {
const _o12 = _o13(c);
const _o1o = _o1r.length >= 3 && (normPhone(c.phone).includes(_o1r) || String(c.phone || '').includes(_o1r));
if (!_o1o && !words.every(_o26 => _o12.includes(_o26))) return false;
}
return true;
});
}
export function nextDueByCustomer(reminders) {
const m = new Map();
for (const r of reminders || []) {
if (Number(r.done) || Number(r.deleted) || !r.object_id) continue;
const _oq = m.get(r.object_id);
if (_oq === undefined || r.due_at < _oq) m.set(r.object_id, r.due_at);
}
return m;
}
export function sortCustomers(list, mode = 'newest', { reminders } = {}) {
const _oi = (list || []).slice();
const _oo = c => Number(c.created_at || c.updated_at || 0);
if (mode === 'call') {
const due = nextDueByCustomer(reminders);
_oi.sort((a, _oj) => {
const _ou = due.has(a.id) ? due.get(a.id) : Infinity;
const _ow = due.has(_oj.id) ? due.get(_oj.id) : Infinity;
if (_ou !== _ow) return _ou - _ow;
return _oo(_oj) - _oo(a);
});
} else if (mode === 'name') {
_oi.sort((a, _oj) => strip(a.name).localeCompare(strip(_oj.name)));
} else {
_oi.sort((a, _oj) => _oo(_oj) - _oo(a));
}
return _oi;
}
export function eventsOf(events, id) {
return (events || []).filter(e => e.object_id === id && !Number(e.deleted)).sort((a, _oj) => (_oj.at || 0) - (a.at || 0));
}
export function lastContact(events, id) {
const e = eventsOf(events, id).find(x => x.type === 'call' || x.type === 'zalo' || x.type === 'meeting');
return e ? e.at : null;
}
export function lastContactMap(events) {
const m = new Map();
for (const x of events || []) {
if (Number(x.deleted) || !(x.type === 'call' || x.type === 'zalo' || x.type === 'meeting')) continue;
const _oq = m.get(x.object_id);
if (!_oq || (x.at || 0) > (_oq.at || 0)) m.set(x.object_id, x);
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
let _o1k = String(text || '').replace(/\{(\w+)\}/g, (_, _o19) => {
let v = vars[_o19];
if (v === null || v === undefined || v === '') return '';
if (_o19 === 'so_tien' && typeof v === 'number') v = money(v);
return String(v);
});
_o1k = _o1k.split('\n').map(_o1a => _o1a.replace(/ {2,}/g, ' ').replace(/ +([.,!?;:])/g, '$1').trim()).join('\n');
return _o1k.trim();
}
export function givenName(full) {
const _o1n = String(full || '').replace(/[(（][^)）]*[)）]/g, ' ').trim().split(/\s+/);
return _o1n[_o1n.length - 1] || '';
}
export function projectName(projects, idOrName) {
if (!idOrName) return '';
const list = Array.isArray(projects) ? projects : Object.values(projects || {});
const _o1l = list.find(x => x && (x.id === idOrName || x.name === idOrName));
return _o1l ? (_o1l.name || _o1l.id) : String(idOrName);
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
const _ok = defaults.filter(t => !c.hidden.includes(t.id)).map(t => {
const _o1i = c.overrides[t.id];
return _o1i ? { ...t, title: _o1i.title || t.title, text: _o1i.text || t.text, edited: true } : { ...t };
});
const custom = c.custom.filter(t => t && t.text && !c.hidden.includes(t.id)).map(t => ({ ...t, custom: true }));
return _ok.concat(custom, skillList);
}
export function saveTemplateEdit(cfg, t, { title, text }, newId) {
const c = normTemplateCfg(cfg);
title = String(title || '').trim(); text = String(text || '').trim();
if (!text) throw new Error('Nội dung mẫu đang trống');
if (t && !t.custom && !t.skill) return { ...c, overrides: { ...c.overrides, [t.id]: { title: title || t.title, text } } };
if (t && t.custom) return { ...c, custom: c.custom.map(x => x.id === t.id ? { ...x, title: title || x.title, text } : x) };
return { ...c, custom: c.custom.concat([{ id: newId || ('my_' + Date.now().toString(36)), title: title || 'Mẫu của tôi', text }]) };
}
export function resetTemplate(cfg, id) { const c = normTemplateCfg(cfg); const _o1i = { ...c.overrides }; delete _o1i[id]; return { ...c, overrides: _o1i }; }
export function removeTemplate(cfg, id) { const c = normTemplateCfg(cfg); return { ...c, custom: c.custom.filter(x => x.id !== id) }; }
export function unknownVars(text) {
const _o1j = new Set(TEMPLATE_VARS.map(v => v.key));
return [...new Set((String(text || '').match(/\{(\w+)\}/g) || []).map(m => m.slice(1, -1)).filter(_o19 => !_o1j.has(_o19)))];
}
export function fromPrice(project, unitType) {
if (!project || !Array.isArray(project.price) || !project.price[0]) return 0;
const types = Array.isArray(project.types) ? project.types : [];
const t = types.find(x => x && x.n === unitType && Array.isArray(x.a)) || types.find(x => x && Array.isArray(x.a));
if (!t) return 0;
return Math.round(t.a[0] * project.price[0] * 1e6 / 1e7) * 1e7;
}
export function skillTemplates(skills) {
const _oi = Array.isArray(skills) ? skills : (skills && typeof skills === 'object' ? Object.values(skills) : []);
const _o1k = [];
_oi.forEach((_o1u, i) => {
if (!_o1u || _o1u.kind !== 'templates' || _o1u.enabled === false) return;
const body = parseData(_o1u.data);
const items = _o1u.items || _o1u.templates || body.items || body.templates || [];
items.forEach((t, _o18) => {
if (typeof t === 'string') t = { text: t };
const text = t && (t.text || t.body || t.content);
if (!text) return;
_o1k.push({ id: t.id || ('skill_' + i + '_' + _o18), title: t.title || t.name || ('Mẫu ' + (_o18 + 1)), text, skill: _o1u.name || _o1u.id || 'Mẫu cài thêm' });
});
});
return _o1k;
}
export function isNewLead(c, events, contacted) {
if (!c || Number(c.deleted) || c.source !== 'landing') return false;
if (parseData(c.data).handled) return false;
if (!_o16(c.status)) return false;
if (contacted) return !contacted.has(c.id);
return !(events || []).some(e => e.object_id === c.id && !Number(e.deleted) && (e.type === 'call' || e.type === 'zalo'));
}
function _og(_o1t) { return (_o1t || []).filter(r => !Number(r.done) && !Number(r.deleted)); }
const _ol = (a, _oj) => (a.due_at || 0) - (_oj.due_at || 0);
export function reminderBuckets(reminders, now) {
const [a, _oj] = dayRange(now);
const _of = _og(reminders).sort(_ol);
return {
overdue: _of.filter(r => r.due_at < a),
today: _of.filter(r => r.due_at >= a && r.due_at <= _oj),
upcoming: _of.filter(r => r.due_at > _oj),
};
}
export function snooze(r, days, now) {
return { ...r, due_at: Math.max(Number(r.due_at) || 0, now) + days * DAY, notified_at: 0, updated_at: now };
}
function _or(now) { const _ot = new Date(now); return _ot.getFullYear() + '-' + _o1m(_ot.getMonth() + 1); }
export function stalePolicies(policies, now) {
const _oq = _or(now);
const latest = new Map();
for (const _o1l of policies || []) {
if (Number(_o1l.deleted) || _o1l.status !== 'active') continue;
const _o19 = _o1l.project_id || _o1l.id;
const _o1q = latest.get(_o19);
if (!_o1q || String(_o1l.month || '') > String(_o1q.month || '')) latest.set(_o19, _o1l);
}
return [...latest.values()].filter(_o1l => String(_o1l.month || '') < _oq);
}
const _o1 = ['followup', 'custom', 'birthday', 'referral', 'handover', 'policy_stale'];
export function buildBrief({ customers, events, reminders, policies, now, logic }) {
const _op = activeCustomers(customers);
const [a, _oj] = dayRange(now);
const _of = _og(reminders).sort(_ol);
const _oy = new Map(), contacted = new Set();
for (const e of events || []) {
if (Number(e.deleted)) continue;
let _o1a = _oy.get(e.object_id); if (!_o1a) _oy.set(e.object_id, _o1a = []); _o1a.push(e);
if (e.type === 'call' || e.type === 'zalo') contacted.add(e.object_id);
}
const _oz = id => (_oy.get(id) || []).slice().sort((x, _o29) => (_o29.at || 0) - (x.at || 0));
const newLeads = _op.filter(c => isNewLead(c, events, contacted)).sort((x, _o29) => (_o29.created_at || 0) - (x.created_at || 0));
const dueToday = _of.filter(r => _o1.includes(r.kind || 'followup') && r.due_at >= a && r.due_at <= _oj);
const _o11 = logic && logic.remind && logic.remind.followupDue;
if (typeof _o11 === 'function') {
const _on = new Set(dueToday.map(r => r.object_id).concat(newLeads.map(c => c.id)));
for (const c of _op) {
if (_on.has(c.id)) continue;
let due = false;
try { due = _o11(c, _oz(c.id), now); } catch { due = false; }
if (due) dueToday.push({ id: 'fu_' + c.id, object_id: c.id, kind: 'followup', title: 'Đến hạn gọi chăm sóc', due_at: a, virtual: true });
}
}
return {
newLeads,
dueToday,
overdue: _of.filter(r => r.due_at < a),
paymentsSoon: _of.filter(r => r.kind === 'payment' && r.due_at >= a && r.due_at <= _oj + 7 * DAY),
meetingsToday: _of.filter(r => r.kind === 'meeting' && r.due_at >= a && r.due_at <= _oj),
stalePolicies: stalePolicies(policies, now),
};
}
export function normalizePlan(plan) {
plan = plan || {};
const _o1s = plan.steps || plan.schedule || plan.installments || plan.milestones || [];
const steps = _o1s.map((_o1u, i) => {
let pct = _o1u.pct ?? _o1u.percent ?? _o1u.percentage;
if (pct === undefined && _o1u.ratio !== undefined) pct = _o1u.ratio <= 1 ? _o1u.ratio * 100 : _o1u.ratio;
return {
label: _o1u.label || _o1u.name || _o1u.title || ('Đợt ' + (i + 1)),
pct: Number(pct) || 0,
days: Number(_o1u.days ?? _o1u.after_days ?? _o1u.offset_days ?? 0) || 0,
months: Number(_o1u.months ?? _o1u.after_months ?? _o1u.month_offset ?? (typeof _o1u.mo === 'number' ? _o1u.mo : 0)) || 0,
date: _o1u.date || _o1u.due_date || '',
};
});
return { id: plan.id || '', name: plan.name || plan.title || 'Phương án', steps };
}
function toRow(it, i, total, before, _o1z) {
let date = it.date || it.dueDate || it.due || it.due_date || '';
const _o1e = it.due_at ?? it.at;
if (!date && _o1e) date = ymd(_o1e);
if (!date && it.dueYM) {
const [_o29, m] = String(it.dueYM).split('-').map(Number);
const _o1b = new Date(_o29, m, 0).getDate();
date = _o29 + '-' + _o1m(m) + '-' + _o1m(Math.min(_o1z || 1, _o1b));
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
const _o21 = start || ymd(Date.now());
const _o20 = parseYmd(_o21);
const _o1z = new Date(_o20).getDate();
const _o1v = logic && logic.pay && logic.pay.schedule;
if (typeof _o1v === 'function') {
const _o23 = [
() => _o1v(project, plan, total, _o21),
() => _o1v({ total, price_total: total, plan, start: _o21, start_at: _o20, project }),
];
for (const t of _o23) {
try {
const r = t();
let items = Array.isArray(r) ? r : (r && (r.rows || r.items || r.schedule));
if (!Array.isArray(items) || !items.length) continue;
items = items.filter(x => !x.bank);
const _o10 = logic.remind && logic.remind.fromSchedule;
if (typeof _o10 === 'function') {
try {
const _o1t = _o10({ customerId: '_', schedule: items, beforeDays: before });
if (Array.isArray(_o1t) && _o1t.length === items.length && _o1t.every(x => x.due_at)) {
return _o1t.map((x, i) => ({
installment: Number(x.installment) || i + 1,
label: items[i].name || items[i].label || ('Đợt ' + (i + 1)),
date: (/^\d{4}-\d{2}-\d{2}$/.test(items[i].dueDate || '') ? items[i].dueDate : ymdVN(x.due_at)),
amount: Math.round(Number(x.amount) || 0),
before: Number(x.remind_before_days ?? before),
}));
}
} catch { }
}
return items.map((it, i) => toRow(it, i, total, before, _o1z));
} catch { }
}
}
const _o1h = normalizePlan(plan);
const steps = _o1h.steps.length ? _o1h.steps : [{ label: 'Thanh toán', pct: 100, days: 0, months: 0 }];
const _o22 = steps.reduce((_o1u, x) => _o1u + x.pct, 0);
let _oe = 0;
return steps.map((_o1u, i) => {
let amount = Math.round(total * _o1u.pct / 100);
if (i === steps.length - 1 && Math.abs(_o22 - 100) < 0.01) amount = total - _oe;
_oe += amount;
const _o1e = _o1u.date ? parseYmd(_o1u.date) : addMonths(addDays(_o20, _o1u.days), _o1u.months);
return { installment: i + 1, label: _o1u.label, date: ymd(_o1e), amount, before };
});
}
export function sumRows(rows) { return (rows || []).reduce((_o1u, r) => _o1u + (Number(r.amount) || 0), 0); }
let _od = 0;
export function fallbackId() { return Date.now().toString(36) + (++_od).toString(36) + Math.random().toString(36).slice(2, 8); }
const _o0 = 9 * 3600e3;
export function careReminders({ object_id, name = '', rows = [], handover, birthday, referral, now = Date.now(), newId = fallbackId, project = '' }) {
const _o27 = name ? ' – ' + name : '';
const _ok = (kind, title, due_at, extra = {}, dataExtra = {}) => ({
id: newId(), object_id, kind, title, due_at, remind_before_days: 0, amount: 0, installment: 0,
done: 0, notified_at: 0, data: JSON.stringify({ source: 'care', project, ...dataExtra }),
updated_at: now, deleted: 0, ...extra,
});
const _o1k = [];
for (const r of rows) {
const t = parseYmd(r.date);
if (!Number.isFinite(t)) continue;
_o1k.push(_ok('payment', (r.label || ('Đợt ' + r.installment)) + _o27, t + _o0, {
amount: Number(r.amount) || 0, installment: Number(r.installment) || 0, remind_before_days: Number(r.before) || 0,
}));
}
if (handover && Number.isFinite(parseYmd(handover))) _o1k.push(_ok('handover', 'Bàn giao nhà' + _o27, parseYmd(handover) + _o0, { remind_before_days: 7 }));
const _o1f = nextBirthday(birthday, now);
if (_o1f) _o1k.push(_ok('birthday', 'Sinh nhật' + _o27, _o1f + _o0, { remind_before_days: 1 }, { yearly: 1 }));
if (referral && Number.isFinite(parseYmd(referral))) _o1k.push(_ok('referral', 'Hỏi giới thiệu' + _o27, parseYmd(referral) + _o0));
return _o1k;
}
export function anonymize(c, now = Date.now()) {
return {
...c, name: 'Đã xoá', phone: '', zalo: '', email: '', note: '', tags: '', birthday: '', lead_ref: '',
budget: 0, score: 0, consent: 0, data: JSON.stringify({ erased: 1, erased_at: now }), deleted: 1, updated_at: now,
};
}
function _ox(_ot) { const _o1y = parseData(_ot.data).status || _ot.status; return !_o1y || _o1y === 'pending'; }
export function inboxItems({ customers, events, policies, jobs, ideas, settingsDrafts }) {
const _o1k = [];
for (const c of activeCustomers(customers)) if (isNewLead(c, events)) _o1k.push({ kind: 'lead', ref: c, title: c.name || 'Khách mới', sub: c.phone || '' });
for (const e of events || []) if (e.type === 'zalo_draft' && !Number(e.deleted) && _ox(e)) _o1k.push({ kind: 'zalo', ref: e, title: 'Nháp tin Zalo', sub: String(e.text || '').slice(0, 80) });
for (const _ot of settingsDrafts || []) if (_ot && !Number(_ot.deleted) && _ox(_ot)) _o1k.push({ kind: 'zalo', ref: _ot, title: 'Nháp tin Zalo', sub: String(_ot.text || '').slice(0, 80), fromSettings: true });
for (const _o1l of policies || []) if (!Number(_o1l.deleted) && _o1l.status === 'draft') _o1k.push({ kind: 'policy', ref: _o1l, title: 'Chính sách chờ duyệt', sub: (_o1l.project_id || '') + (_o1l.month ? ' · ' + _o1l.month : '') });
for (const _o18 of jobs || []) if (!Number(_o18.deleted) && _o18.status === 'waiting_approval') _o1k.push({ kind: 'job', ref: _o18, title: _o18.title || 'Việc chờ duyệt', sub: _o18.type || '' });
for (const i of ideas || []) if (!Number(i.deleted) && i.status === 'new') _o1k.push({ kind: 'idea', ref: i, title: i.title || 'Ý tưởng', sub: i.summary ? String(i.summary).slice(0, 80) : (i.source || '') });
return _o1k;
}

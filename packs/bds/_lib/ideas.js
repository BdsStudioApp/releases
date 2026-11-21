import { findForbidden, CHANNEL, kenhBds } from './video.js';
export const DEFAULT_FEEDS = [
{ id: 'vne_bds', name: 'VnExpress – Bất động sản', url: 'https://vnexpress.net/rss/bat-dong-san.rss', link_rss: 'https://vnexpress.net/rss', tag: 'bds' },
{ id: 'vne_ts', name: 'VnExpress – Thời sự', url: 'https://vnexpress.net/rss/thoi-su.rss', link_rss: 'https://vnexpress.net/rss', tag: 'thoi_su' },
{ id: 'tt_nhadat', name: 'Tuổi Trẻ – Nhà đất', url: 'https://tuoitre.vn/rss/nha-dat.rss', link_rss: 'https://tuoitre.vn/rss.htm', tag: 'bds' },
{ id: 'tn_kinhte', name: 'Thanh Niên – Kinh tế', url: 'https://thanhnien.vn/rss/kinh-te.rss', link_rss: 'https://thanhnien.vn/rss.html', tag: 'kinh_te' },
{ id: 'cafef_bds', name: 'CafeF – Bất động sản', url: 'https://cafef.vn/bat-dong-san.rss', link_rss: 'https://cafef.vn/rss.chn', tag: 'bds' },
{ id: 'bcp', name: 'Báo Chính phủ – Chính sách mới', url: 'https://baochinhphu.vn/chinh-sach-moi.rss', link_rss: 'https://baochinhphu.vn/rss.htm', tag: 'chinh_sach', verify: true },
{ id: 'hnm', name: 'Hà Nội Mới – Đô thị', url: 'https://hanoimoi.vn/rss/do-thi.rss', link_rss: 'https://hanoimoi.vn/rss', tag: 'ha_tang', verify: true },
{ id: 'dt_bds', name: 'Dân trí – Bất động sản', url: 'https://dantri.com.vn/rss/bat-dong-san.rss', link_rss: 'https://dantri.com.vn/rss.htm', tag: 'bds', verify: true },
{ id: 'vnn_bds', name: 'VietnamNet – Bất động sản', url: 'https://vietnamnet.vn/rss/bat-dong-san.rss', link_rss: 'https://vietnamnet.vn/rss', tag: 'bds', verify: true },
{ id: 'ld_bds', name: 'Lao Động – Bất động sản', url: 'https://laodong.vn/rss/bat-dong-san.rss', link_rss: 'https://laodong.vn/rss', tag: 'bds', verify: true },
];
export const MORE_FEEDS = [
{ id: 'vne_kd', name: 'VnExpress – Kinh doanh', url: 'https://vnexpress.net/rss/kinh-doanh.rss', link_rss: 'https://vnexpress.net/rss', tag: 'kinh_te' },
{ id: 'tt_kd', name: 'Tuổi Trẻ – Kinh doanh', url: 'https://tuoitre.vn/rss/kinh-doanh.rss', link_rss: 'https://tuoitre.vn/rss.htm', tag: 'kinh_te' },
{ id: 'dt_kd', name: 'Dân trí – Kinh doanh', url: 'https://dantri.com.vn/rss/kinh-doanh.rss', link_rss: 'https://dantri.com.vn/rss.htm', tag: 'kinh_te', verify: true },
{ id: 'vnn_kd', name: 'VietnamNet – Kinh doanh', url: 'https://vietnamnet.vn/rss/kinh-doanh.rss', link_rss: 'https://vietnamnet.vn/rss', tag: 'kinh_te', verify: true },
{ id: 'vneco_dc', name: 'VnEconomy – Địa ốc', url: 'https://vneconomy.vn/dia-oc.rss', link_rss: 'https://vneconomy.vn', tag: 'bds', verify: true },
{ id: 'vneco_tc', name: 'VnEconomy – Tài chính', url: 'https://vneconomy.vn/tai-chinh.rss', link_rss: 'https://vneconomy.vn', tag: 'tai_chinh', verify: true },
{ id: 'bcp_kt', name: 'Báo Chính phủ – Kinh tế', url: 'https://baochinhphu.vn/kinh-te.rss', link_rss: 'https://baochinhphu.vn/rss.htm', tag: 'chinh_sach', verify: true },
];
export const TRUSTED = ['vnexpress.net', 'tuoitre.vn', 'thanhnien.vn', 'cafef.vn', 'baochinhphu.vn', 'chinhphu.vn', 'hanoimoi.vn',
'vietnamplus.vn', 'nhandan.vn', 'vtv.vn', 'laodong.vn', 'dantri.com.vn', 'vneconomy.vn', 'vietnamnet.vn', 'thuvienphapluat.vn', 'quochoi.vn', 'kinhtedothi.vn'];
export const norm = _o1k => String(_o1k ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const has = (_o15, kw) => (' ' + _o15 + ' ').includes(' ' + kw + ' ');
const hits = (_o15, list) => list.filter(_o10 => has(_o15, _o10));
const clamp = (x, a, _oj) => Math.max(a, Math.min(_oj, x));
const _oy = _o1k => /^https?:\/\/[^\s/$.?#][^\s]*$/i.test(String(_o1k || '').trim());
export const CATEGORIES = {
quy_hoach: { label: 'Quy hoạch', icon: '🗺️', kw: ['quy hoach', 'phan khu', 'do thi', 'dieu chinh quy hoach', 'quy hoach chung', 'sap nhap', 'phuong moi', 'khu do thi moi', 'truc dong luc', 'do an', 'chuyen muc dich', 'thanh pho truc thuoc'] },
ha_tang: { label: 'Hạ tầng', icon: '🌉', kw: ['cau', 'vanh dai', 'metro', 'duong sat', 'cao toc', 'nut giao', 'thong xe', 'khoi cong', 'hop long', 'ham chui', 'san bay', 'tuyen duong', 'lan xe', 'cau vuot', 'giai phong mat bang', 'gpmb', 'duong truc'] },
lai_suat: { label: 'Lãi suất', icon: '🏦', kw: ['lai suat', 'ngan hang', 'cho vay', 'vay mua nha', 'tin dung', 'lai vay', 'room tin dung', 'goi vay', 'ngan hang nha nuoc', 'nhnn'] },
chinh_sach: { label: 'Chính sách', icon: '📜', kw: ['nghi dinh', 'thong tu', 'luat', 'thue', 'le phi', 'chinh sach', 'bang gia dat', 'nghi quyet', 'du thao', 'so do', 'giay chung nhan', 'chuyen nhuong', 'nha o xa hoi', 'phi'] },
du_an: { label: 'Dự án', icon: '🏢', kw: ['du an', 'mo ban', 'chu dau tu', 'ra mat', 'ban giao', 'can ho mau', 'nhan dat cho'] },
thi_truong: { label: 'Thị trường', icon: '📈', kw: ['thi truong', 'gia chung cu', 'gia nha', 'gia dat', 'nguon cung', 'khan hiem', 'giao dich', 'thanh khoan', 'quy 1', 'quy 2', 'quy 3', 'quy 4', 'tang gia', 'giam gia', 'nhu cau', 'gia ban', 'bao cao thi truong'] },
};
export function classify(text) {
const _o15 = norm(text);
let _ol = { category: '', label: 'Chưa rõ', confidence: 0, hits: [], w: 0 };
let _o1n = 0;
for (const [id, c] of Object.entries(CATEGORIES)) {
const h = hits(_o15, c.kw);
const w = h.reduce((_o1k, _o10) => _o1k + _o10.split(' ').length, 0);
if (w > _ol.w) { _o1n = _ol.w; _ol = { category: id, label: c.label, hits: h, w }; } else if (w > _o1n) _o1n = w;
}
if (!_ol.w) return { category: '', label: 'Chưa rõ', confidence: 0, hits: [] };
const confidence = Math.round(clamp(_ol.w / 4, 0.2, 1) * clamp((_ol.w - _o1n) / _ol.w + 0.4, 0, 1) * 100) / 100;
return { category: _ol.category, label: _ol.label, confidence, hits: _ol.hits };
}
function jsonFrom(text) {
const _o1k = String(text ?? '').trim();
const _o12 = _o1k.match(/```(?:json)?\s*([\s\S]*?)```/i);
const _om = _o12 ? _o12[1] : _o1k;
try { return JSON.parse(_om); } catch { }
for (const [a, _oj] of [['{', '}'], ['[', ']']]) {
const _ow = _om.indexOf(a); const j = _om.lastIndexOf(_oj);
if (_ow >= 0 && j > _ow) { try { return JSON.parse(_om.slice(_ow, j + 1)); } catch { } }
}
return null;
}
export function buildClassifyPrompt(text, { channel = CHANNEL } = {}) {
return [
`Phân loại tin/chủ đề sau cho ${kenhBds(channel)} (Hà Nội).`,
'Nhóm: ' + Object.entries(CATEGORIES).map(([_o10, c]) => `${_o10} (${c.label})`).join(', ') + '.',
'Nếu là ảnh: đọc chữ trong ảnh (tiêu đề báo, văn bản) rồi tóm tắt.',
'Không bịa số liệu; giữ nguyên chữ "đề xuất/dự kiến/dự thảo" nếu nguồn ghi như vậy.',
'Trả về DUY NHẤT JSON: {"category": "<mã nhóm>", "title": "≤ 70 ký tự", "summary": "1–2 câu", "source": "tên báo/cơ quan nếu thấy"}.',
'', 'Nội dung:', String(text || '').slice(0, 4000),
].join('\n');
}
export function parseClassify(text) {
const j = jsonFrom(text);
const _o16 = j && typeof j === 'object' && !Array.isArray(j) ? j : {};
const category = CATEGORIES[_o16.category] ? _o16.category : '';
return { category, title: String(_o16.title || '').trim().slice(0, 120), summary: String(_o16.summary || '').trim().slice(0, 600), source: String(_o16.source || '').trim().slice(0, 80) };
}
export function detectInput(_o1g) {
const _o18 = [];
for (const _o11 of String(_o1g || '').split(/\r?\n/)) {
const _o1x = _o11.match(/https?:\/\/[^\s<>"']+/gi) || [];
for (const _o1w of _o1x) if (_oy(_o1w)) _o18.push({ type: 'link', url: _o1w.replace(/[),.;]+$/, ''), text: '' });
const _o1j = _o1x.reduce((_o1k, _o1w) => _o1k.replace(_o1w, ' '), _o11).replace(/\s+/g, ' ').trim();
if (_o1j.length >= 3) _o18.push({ type: 'topic', text: _o1j, url: '' });
}
return _o18;
}
export function canonUrl(_o1w) {
try {
const x = new URL(String(_o1w || '').trim());
if (!/^https?:$/.test(x.protocol)) return '';
const _ou = x.hostname.toLowerCase().replace(/^(www|m|amp|mobile)\./, '');
const _o1a = [...x.searchParams.entries()].filter(([_o10]) => !/^(utm_|fbclid|gclid|zarsrc|zalo|ref$|source$)/i.test(_o10));
const _o1f = _o1a.length ? '?' + _o1a.map(([_o10, v]) => _o10 + '=' + v).join('&') : '';
return _ou + x.pathname.replace(/\/+$/, '') + _o1f;
} catch { return ''; }
}
export function isTrusted(url) {
try {
const _ou = new URL(url).hostname.toLowerCase();
return /\.gov\.vn$/.test(_ou) || TRUSTED.some(_op => _ou === _op || _ou.endsWith('.' + _op));
} catch { return false; }
}
const _oe = new Set(['va', 'cua', 'cho', 'tai', 'o', 'the', 'nay', 'voi', 'la', 'co', 'duoc', 'se', 'da', 'dang', 'mot', 'nhung', 'cac',
'khi', 've', 'tren', 'duoi', 'den', 'nhu', 'nhieu', 'hon', 'rat', 'sau', 'truoc', 'vao', 'ra', 'doan', 'qua', 'so', 'moi', 'lan', 'thang',
'ngay', 'hom', 'tin', 'video', 'phan', 'nhat', 'gi', 'sao', 'bao', 'nao', 'ai', 'tu']);
export function tokens(text) {
const _o1g = norm(text).split(' ').filter(Boolean);
return [...new Set(_o1g.filter((w, _ow) => !_oe.has(w) || (w === 'tu' && _o1g[_ow + 1] && !_oe.has(_o1g[_ow + 1]) && _ow > 0)))];
}
export const topicKey = text => tokens(text).sort().join('-').slice(0, 80);
function pd(_o1k) { if (_o1k && typeof _o1k === 'object') return _o1k; try { return JSON.parse(_o1k || '{}') || {}; } catch { return {}; } }
function _o1d({ ideas = [], jobs = [] } = {}) {
const _o18 = [];
for (const _ow of ideas || []) if (_ow && !Number(_ow.deleted)) _o18.push({ kind: 'idea', ref: _ow, title: _ow.title || '', url: _ow.url || '', status: _ow.status, data: pd(_ow.data), at: Number(_ow.updated_at) || 0 });
for (const j of jobs || []) {
if (!j || Number(j.deleted)) continue;
const _ox = pd(j.input);
_o18.push({ kind: 'job', ref: j, title: j.title || _ox.title || '', url: _ox.url || '', status: j.status === 'done' ? 'done' : 'job', data: {}, at: Number(j.updated_at) || 0 });
}
return _o18;
}
function _o1q(a, _oj) {
const A = tokens(a); const B = new Set(tokens(_oj));
if (!A.length || !B.size) return { dice: 0, overlap: 0, coef: 0 };
const overlap = A.filter(w => B.has(w)).length;
return { dice: (2 * overlap) / (A.length + B.size), overlap, coef: overlap / Math.min(A.length, B.size) };
}
export function findDuplicate(cand, ctx = {}, { threshold = 0.6 } = {}) {
const _oo = canonUrl(cand && cand.url);
let _ol = { match: null, kind: '', by: '', similarity: 0 };
for (const _o19 of _o1d(ctx)) {
if (_o19.ref && cand && _o19.ref.id && _o19.ref.id === cand.id) continue;
if (_oo && canonUrl(_o19.url) === _oo) return { match: _o19.ref, kind: _o19.kind, by: 'url', similarity: 1 };
const _o1k = _o1q(cand && cand.title, _o19.title).dice;
if (_o1k >= threshold && _o1k > _ol.similarity) _ol = { match: _o19.ref, kind: _o19.kind, by: 'keywords', similarity: Math.round(_o1k * 100) / 100 };
}
return _ol;
}
export function seriesHint(cand, ctx = {}) {
let done = null; let _o17 = false;
for (const _o19 of _o1d(ctx)) {
const _o1k = _o1q(cand && cand.title, _o19.title);
if (_o1k.overlap < 2 || _o1k.coef < 0.5) continue;
if (_o19.status === 'done') { if (!done || _o19.at > done.at) done = _o19; } else if (_o19.status !== 'rejected') _o17 = true;
}
if (!done || _o17) return null;
const part = (Number(done.data.series && done.data.series.part) || 1) + 1;
return { of: done.ref, part, title: `Phần ${part}: ${String(cand.title || '').trim()}`, why: `Đã làm "${done.title}" – có tin mới, nên làm tiếp phần ${part}.` };
}
const _o8 = ['ha noi', 'dong anh', 'gia lam', 'long bien', 'tay ho', 'co loa', 'me linh', 'soc son', 'hoan kiem', 'ba dinh', 'cau giay',
'thanh xuan', 'nam tu liem', 'bac tu liem', 'hai ba trung', 'hoang mai', 'dong da', 'ha dong', 'tay mo', 'van giang', 'van lam', 'thu do'];
const _o4 = ['dong anh', 'gia lam', 'long bien', 'co loa', 'tu lien', 'cau tu lien', 'tran hung dao', 'cau tran hung dao',
'vanh dai 4', 'vanh dai 3', 'song hong', 'nhat tan', 'vinh tuy', 'thanh tri', 'me so', 'hung yen', 'van giang', 'co linh', 'yen vien', 'phia dong'];
const _o3 = ['lakeside'];
const _oa = ['cau', 'duong', 'vanh dai', 'metro', 'duong sat', 'cao toc', 'nut giao', 'quy hoach', 'phan khu', 'khu do thi', 'phuong', 'tuyen',
'ham', 'song', 'ben', 'ga', 'truc', 'dai lo', 'du an', 'vi tri', 'ban do'];
const _o9 = ['khoi cong', 'phe duyet', 'thong xe', 'mo ban', 'lai suat', 'hop long', 'bang gia dat', 'nghi dinh', 'sap nhap', 'thong qua'];
export function score(idea, { now = Date.now() } = {}) {
const _o15 = norm([idea.title, idea.summary].join(' '));
const parts = [];
const _o1e = Number(idea.published) || 0;
const _og = _o1e ? (now - _o1e) / 3600e3 : null;
let _ov = 0; const why = [];
if (_og === null) { _ov += 8; why.push('chưa rõ ngày đăng'); }
else if (_og <= 24) { _ov += 25; why.push('tin trong 24 giờ'); }
else if (_og <= 72) { _ov += 18; why.push('tin 3 ngày gần đây'); }
else if (_og <= 168) { _ov += 10; why.push('tin trong tuần'); }
else if (_og <= 720) { _ov += 4; why.push('tin trong tháng'); }
else why.push('tin cũ hơn 30 ngày');
if (idea.url && isTrusted(idea.url)) { _ov += 10; why.push('nguồn uy tín'); }
else if (idea.url || idea.source) { _ov += 3; why.push('có nguồn – cần kiểm uy tín'); }
else why.push('chưa có nguồn');
if (hits(_o15, _o9).length) { _ov += 5; why.push('sự kiện: ' + hits(_o15, _o9)[0]); }
parts.push({ label: 'Độ nóng', points: Math.min(40, _ov), max: 40, why: why.join(', ') });
const _or = hits(_o15, _o4); const _ot = _or.length ? ['ha noi'] : hits(_o15, _o8); const _oq = hits(_o15, _o3);
const _os = (_ot.length || _or.length ? 10 : 0) + (_oq.length ? 10 : 0) + (_or.length ? 15 : 0);
parts.push({ label: 'Hợp kênh', points: _os, max: 35, why: [_ot.length || _or.length ? 'Hà Nội' : 'chưa thấy Hà Nội', _oq.length ? 'dự án ' + _oq[0] : '', _or.length ? 'phía Đông (' + _or[0] + ')' : ''].filter(Boolean).join(', ') });
const _o14 = hits(_o15, _oa); const _o1b = hits(_o15, _o8.concat(_o4, []));
const _o13 = (_o14.length ? 15 : 0) + (_o1b.length ? 10 : 0);
parts.push({ label: 'Làm bản đồ', points: _o13, max: 25, why: _o14.length ? 'có công trình/vị trí: ' + _o14.slice(0, 2).join(', ') + (_o1b.length ? '; địa danh ' + _o1b[0] : '') : 'khó vẽ bản đồ – hợp bản tin đồ hoạ' });
const _ok = findForbidden([idea.title, idea.summary].join(' '));
const _o1u = parts.reduce((_o1k, _o19) => _o1k + _o19.points, 0);
if (_ok.length) parts.push({ label: 'Trừ điểm', points: -Math.min(40, _o1u), max: 0, why: 'từ nên tránh: ' + _ok.join(', ') });
return { score: clamp(parts.reduce((_o1k, _o19) => _o1k + _o19.points, 0), 0, 100), parts };
}
export const scoreText = parts => (parts || []).map(_o19 => `${_o19.label} ${_o19.points > 0 ? '+' : ''}${_o19.points}: ${_o19.why}`).join(' · ');
export const SCENE_KINDS = { hook: 'Mở đầu', map: 'Bản đồ vị trí', stat: 'Thẻ số liệu', compare: 'So sánh', timeline: 'Mốc thời gian', doc: 'Văn bản gốc', checklist: 'Kết – 3 ý cần nhớ' };
export const TEMPLATES = {
khoi_cong: { label: 'Khởi công công trình', match: [['khoi cong', 'dong tho', 'trien khai thi cong']], scenes: [
{ kind: 'hook', title: 'Tin chính: khởi công', takes: [] },
{ kind: 'map', title: 'Vị trí & hướng tuyến trên bản đồ', takes: ['length'] },
{ kind: 'stat', title: 'Quy mô: chiều dài, số làn, vốn', takes: ['money', 'length', 'lanes', 'count', 'percent'] },
{ kind: 'compare', title: 'Kết nối trước và sau khi xong', takes: [] },
{ kind: 'timeline', title: 'Mốc tiến độ', takes: ['year'] },
{ kind: 'checklist', title: '3 ý người mua nhà cần nhớ', takes: [] }] },
phe_duyet_qh: { label: 'Phê duyệt quy hoạch', match: [['phe duyet', 'thong qua', 'ban hanh', 'duyet'], ['quy hoach', 'phan khu', 'do an']], scenes: [
{ kind: 'hook', title: 'Tin chính: quy hoạch được duyệt', takes: [] },
{ kind: 'doc', title: 'Số văn bản, ngày ký, cơ quan duyệt', takes: [] },
{ kind: 'map', title: 'Ranh giới khu quy hoạch', takes: ['length', 'area'] },
{ kind: 'stat', title: 'Diện tích, dân số, chức năng', takes: ['area', 'count', 'money', 'percent'] },
{ kind: 'compare', title: 'Trước và sau quy hoạch', takes: [] },
{ kind: 'checklist', title: '3 ý cần nhớ', takes: ['year'] }] },
thong_xe: { label: 'Thông xe', match: [['thong xe', 'dua vao su dung', 'khanh thanh', 'van hanh thuong mai']], scenes: [
{ kind: 'hook', title: 'Tin chính: thông xe', takes: [] },
{ kind: 'map', title: 'Tuyến mới trên bản đồ', takes: ['length'] },
{ kind: 'compare', title: 'Thời gian đi lại trước/sau', takes: ['time'] },
{ kind: 'stat', title: 'Quy mô công trình', takes: ['money', 'length', 'lanes', 'count', 'percent'] },
{ kind: 'checklist', title: 'Khu vực hưởng lợi – 3 ý', takes: ['year'] }] },
lai_suat: { label: 'Lãi suất', match: [['lai suat', 'lai vay']], scenes: [
{ kind: 'hook', title: 'Tin chính: lãi suất thay đổi', takes: [] },
{ kind: 'stat', title: 'Mức lãi suất mới (nguồn ngân hàng/NHNN)', takes: ['percent'] },
{ kind: 'compare', title: 'So với trước đây', takes: ['money'] },
{ kind: 'timeline', title: 'Áp dụng từ khi nào', takes: ['year'] },
{ kind: 'checklist', title: '3 điều cần hỏi ngân hàng (không khuyên vay)', takes: [] }] },
thue_phi: { label: 'Chính sách thuế/phí', match: [['thue', 'phi', 'le phi', 'bang gia dat']], scenes: [
{ kind: 'hook', title: 'Tin chính: thuế/phí', takes: [] },
{ kind: 'doc', title: 'Văn bản: dự thảo hay đã ban hành', takes: [] },
{ kind: 'stat', title: 'Mức thuế/phí, ai phải nộp', takes: ['percent', 'money'] },
{ kind: 'compare', title: 'Ví dụ trước/sau', takes: ['area'] },
{ kind: 'timeline', title: 'Hiệu lực', takes: ['year'] },
{ kind: 'checklist', title: '3 ý cần nhớ', takes: [] }] },
mo_ban: { label: 'Mở bán dự án', match: [['mo ban', 'ra mat', 'nhan dat cho', 'booking']], scenes: [
{ kind: 'hook', title: 'Tin chính: mở bán', takes: [] },
{ kind: 'map', title: 'Vị trí dự án & kết nối', takes: ['length'] },
{ kind: 'stat', title: 'Quy mô: số căn, toà, diện tích', takes: ['count', 'area', 'year'] },
{ kind: 'compare', title: 'So với dự án quanh khu', takes: ['money', 'percent'] },
{ kind: 'checklist', title: '3 câu cần hỏi chủ đầu tư', takes: [] }] },
};
const _o7 = [
{ kind: 'hook', title: 'Tin chính', takes: [] },
{ kind: 'map', title: 'Vị trí liên quan', takes: ['length', 'area'] },
{ kind: 'stat', title: 'Số liệu chính', takes: ['money', 'percent', 'count', 'lanes', 'time'] },
{ kind: 'checklist', title: '3 ý cần nhớ', takes: ['year'] },
];
const _of = ['khoi_cong', 'thong_xe', 'phe_duyet_qh', 'lai_suat', 'mo_ban', 'thue_phi'];
export function matchTemplate(text) {
const _o15 = norm(text);
for (const id of _of) if (TEMPLATES[id].match.every(g => hits(_o15, g).length)) return id;
return null;
}
const _oc = '\\d{1,3}(?:[.,]\\d{3})*(?:[.,]\\d+)?';
const _o5 = '(?![\\p{L}\\p{N}])';
const _o6 = [
['money', new RegExp(_oc + '\\s*(?:nghìn tỷ|ngàn tỷ|tỷ đồng|tỷ|triệu đồng|triệu|USD|đồng)(?:\\/m²|\\/m2|\\/tháng|\\/năm)?' + _o5, 'giu')],
['percent', new RegExp(_oc + '\\s*%(?:\\/năm)?', 'gu')],
['length', new RegExp(_oc + '\\s*(?:km|mét)' + _o5, 'giu')],
['area', new RegExp(_oc + '\\s*(?:m²|m2|ha|héc-ta)' + _o5, 'giu')],
['lanes', new RegExp('\\d{1,2}\\s*làn(?:\\s*xe)?' + _o5, 'giu')],
['time', new RegExp('\\d{1,3}\\s*(?:phút|giờ)' + _o5, 'giu')],
['count', new RegExp(_oc + '\\s*(?:căn|toà|tòa|tầng|block|dự án|hộ)' + _o5, 'giu')],
['year', /(?<![\d.,])20\d{2}(?![\d.,]\d)/g],
];
export function extractFacts(text) {
const _o1k = String(text || '');
const _o1v = [];
const _o18 = [];
for (const [type, _o1h] of _o6) {
_o1h.lastIndex = 0;
for (const _o12 of _o1k.matchAll(_o1h)) {
const a = _o12.index; const _oj = a + _o12[0].length;
if (_o1v.some(([x, y]) => a < y && _oj > x)) continue;
_o1v.push([a, _oj]); _o18.push({ type, text: _o12[0].trim(), at: a });
}
}
return _o18.sort((x, y) => x.at - y.at).map(({ type, text }) => ({ type, text }));
}
const _o1y = (f, url, name) => ({ ...f, source: _oy(url) ? url : null, source_name: name || '', status: _oy(url) ? 'ok' : 'missing' });
export function buildScenes(idea) {
const _op = pd(idea && idea.data);
const text = [idea.title, idea.summary].filter(Boolean).join('. ');
const template = matchTemplate(text);
const _o1p = template ? TEMPLATES[template].scenes : _o7;
const src = idea.url || (Array.isArray(_op.sources) && _op.sources[0] && _op.sources[0].url) || '';
const facts = extractFacts([idea.summary, idea.title].filter(Boolean).join(' . ')).map(f => _o1y(f, src, idea.source));
const scenes = _o1p.map(_o1k => ({ kind: _o1k.kind, title: _o1k.title, facts: [] }));
for (const f of facts) {
let _o10 = _o1p.findIndex(_o1k => _o1k.takes.includes(f.type));
if (_o10 < 0) _o10 = Math.max(0, _o1p.findIndex(_o1k => _o1k.kind === 'stat'));
if (!scenes[_o10].facts.some(x => x.text === f.text)) scenes[_o10].facts.push(f);
}
return { template, label: template ? TEMPLATES[template].label : 'Tin lạ – nhờ AI dàn cảnh', need_ai: !template, scenes };
}
export const factsSummary = scenes => {
const _oh = (scenes || []).flatMap(_o1k => _o1k.facts || []);
return { total: _oh.length, ok: _oh.filter(f => f.status === 'ok').length, missing: _oh.filter(f => f.status !== 'ok').length };
};
export function buildScenesPrompt(idea, { channel = CHANNEL } = {}) {
return [
`Dàn cảnh video dọc 60–90 giây cho ${kenhBds(channel)} từ tin sau (4–7 cảnh):`,
`Tiêu đề: ${idea.title || ''}`, idea.summary ? 'Tóm tắt: ' + idea.summary : '', idea.url ? 'Link nguồn: ' + idea.url : '',
'Loại cảnh: ' + Object.entries(SCENE_KINDS).map(([_o10, v]) => `${_o10} (${v})`).join(', ') + '. Cảnh 1 là hook, cảnh cuối là checklist.',
'Mỗi số liệu phải kèm link nguồn ("source"); không có nguồn thì để "source": "" (app sẽ tô vàng để kiểm chứng). Không bịa số.',
'Nguồn ghi "đề xuất/dự kiến/dự thảo" thì giữ nguyên chữ đó – không viết thành "đã". "Đã phê duyệt" phải kèm số văn bản.',
'Không hứa tăng giá, không khuyên đầu tư/vay.',
'Trả về DUY NHẤT mảng JSON: [{"kind": "map|stat|...", "title": "…", "facts": [{"text": "5,2 km", "source": "https://…"}]}].',
].filter(Boolean).join('\n');
}
export function parseScenes(text) {
let j = jsonFrom(text);
if (j && !Array.isArray(j) && Array.isArray(j.scenes)) j = j.scenes;
if (!Array.isArray(j)) return [];
return j.filter(x => x && x.title).slice(0, 7).map(x => ({
kind: SCENE_KINDS[x.kind] ? x.kind : 'stat', title: String(x.title).slice(0, 120),
facts: (Array.isArray(x.facts) ? x.facts : []).filter(f => f && f.text).map(f => _o1y({ type: 'ai', text: String(f.text).slice(0, 80) }, String(f.source || ''), '')),
}));
}
const _od = ['de xuat', 'du kien', 'du thao', 'xin y kien', 'lay y kien', 'nghien cuu', 'trinh', 'ke hoach', 'co the', 'muc tieu', 'se'];
const _o2 = ['da phe duyet', 'da duoc phe duyet', 'phe duyet', 'da thong qua', 'da ban hanh', 'chinh thuc', 'da khoi cong', 'da thong xe', 'da hoan thanh', 'da ky'];
const _o0 = ['phe duyet', 'khoi cong', 'thong xe', 'thong qua', 'ban hanh', 'hoan thanh', 'xay', 'trien khai', 'ky', 'ap dung'];
const _ob = ['phe duyet', 'thong qua', 'ban hanh'];
const _o1 = { 'phe duyet': 'phê duyệt', 'khoi cong': 'khởi công', 'thong xe': 'thông xe', 'thong qua': 'thông qua', 'ban hanh': 'ban hành', 'hoan thanh': 'hoàn thành', xay: 'xây', 'trien khai': 'triển khai', ky: 'ký', 'ap dung': 'áp dụng' };
export function docNumbers(text) {
const _o1h = /\d{1,5}(?:\/\d{4})?\/[A-ZĐ]{1,6}(?:-[A-Za-zĐđ0-9]{1,12})+/gu;
return [...new Set(String(text || '').match(_o1h) || [])];
}
export function claimStage(text) {
const _o15 = norm(text);
const _o19 = hits(_o15, _od).length; const a = hits(_o15, _o2).length;
return _o19 && a ? 'mixed' : _o19 ? 'proposed' : a ? 'approved' : 'unknown';
}
const _o1o = t => String(t || '').split(/(?<=[.!?…;\n])\s+/).map(_o1k => _o1k.trim()).filter(Boolean);
export function checkClaims(script, source = '') {
const issues = [];
const _o1t = _o1o(source).map(norm);
const _o1m = docNumbers(script);
const _o1r = docNumbers(source);
for (const _o1k of _o1o(script)) {
const _o15 = norm(_o1k);
if (hits(_o15, _od).length) continue;
const _on = _o0.filter(a => has(_o15, 'da ' + a) || has(_o15, 'da duoc ' + a) || (has(_o15, 'chinh thuc') && has(_o15, a)));
for (const act of _on) {
const _o1i = _o1t.filter(x => has(x, act));
const _o1s = _o1i.some(x => hits(x, _od).length) && !_o1i.some(x => has(x, 'da ' + act) || has(x, 'da duoc ' + act));
if (_o1s || (!_o1i.length && claimStage(source) === 'proposed')) {
issues.push({ level: 'block', sentence: _o1k, message: `Nguồn chỉ ghi "đề xuất/dự kiến" – không được viết "đã ${_o1[act]}". Sửa thành "dự kiến ${_o1[act]}".` });
continue;
}
if (_ob.includes(act) && !_o1m.length) {
issues.push({ level: 'block', sentence: _o1k, message: `"Đã ${_o1[act]}" phải kèm số văn bản (vd Quyết định số …/QĐ-TTg).` });
}
}
}
for (const _op of _o1m) if (source && !_o1r.includes(_op)) issues.push({ level: 'warn', sentence: _op, message: `Số văn bản ${_op} không thấy trong nguồn – kiểm lại.` });
return { ok: !issues.length, issues };
}
export function batchPick(ideas, _o15 = 10) {
return (ideas || []).filter(_ow => _ow && !Number(_ow.deleted) && _ow.status === 'new')
.sort((a, _oj) => (Number(_oj.score) || 0) - (Number(a.score) || 0)).slice(0, _o15);
}
export function batchJobs(ideas, { now = Date.now() } = {}) {
return (ideas || []).map(_ow => {
const _op = pd(_ow.data);
const _o1c = Array.isArray(_op.scenes_outline) && _op.scenes_outline.length ? { template: _op.template || null, scenes: _op.scenes_outline } : buildScenes(_ow);
return {
type: 'video_map', title: _ow.title, status: 'queued', output: '', cost_estimate: 0,
input: JSON.stringify({ idea_id: _ow.id, title: _ow.title, url: _ow.url || '', topic: _ow.summary || '', category: _op.category || '',
template: _o1c.template, scenes: _o1c.scenes, sources: _op.sources || (_ow.url ? [{ url: _ow.url, name: _ow.source || '' }] : []),
series: _op.series || null, overnight: true, approved_at: now }),
};
});
}
const ymd = (_op, sep = '') => _op.getFullYear() + sep + String(_op.getMonth() + 1).padStart(2, '0') + sep + String(_op.getDate()).padStart(2, '0');
export function batchReminder(now = Date.now(), count = 0) {
const _op = new Date(now);
return { id: 'ideas21h' + ymd(_op), object_id: '', kind: 'custom', title: `21h: duyệt hàng loạt ${count} ý tưởng video (máy dựng làm qua đêm)`,
due_at: new Date(_op.getFullYear(), _op.getMonth(), _op.getDate(), 21, 0, 0).getTime(), remind_before_days: 0, amount: 0, installment: 0, done: 0,
data: JSON.stringify({ module: 'ideas', link: '#/content/ideas?batch=1' }) };
}
export function followedFrom(v) {
const _oi = Array.isArray(v) ? v : (v && Array.isArray(v.topics) ? v.topics : []);
return [...new Set(_oi.map(x => String(x || '').trim()).filter(Boolean))];
}
export function feedsFrom(v) {
const _oi = (v && Array.isArray(v.feeds) ? v.feeds : []).map(f => String((f && f.url) || f || '').trim()).filter(_o1w => /^https?:\/\/[^\s]+$/i.test(_o1w));
return _oi.length ? [...new Set(_oi)] : DEFAULT_FEEDS.map(f => f.url);
}
export const matchTopics = (text, topics) => { const _o15 = norm(text); return (topics || []).filter(t => norm(t) && has(_o15, norm(t))); };
export function newsToIdeas(items, { topics = [], ideas = [], jobs = [], now = Date.now(), since = 0 } = {}) {
const _o18 = [];
for (const _oz of items || []) {
if (!_oz || !_oz.title || !_oy(_oz.link)) continue;
const _o1e = Number(_oz.published) || 0;
if (since && _o1e && _o1e < since) continue;
const text = [_oz.title, _oz.summary].filter(Boolean).join(' ');
const _o12 = matchTopics(text, topics);
if (!_o12.length) continue;
const cand = { title: String(_oz.title).trim().slice(0, 160), url: _oz.link };
if (findDuplicate(cand, { ideas: ideas.concat(_o18), jobs }).match) continue;
const _o1l = score({ ...cand, summary: _oz.summary, source: _oz.source, published: _o1e }, { now });
const series = seriesHint(cand, { ideas, jobs });
_o18.push({ title: cand.title, url: _oz.link, source: _oz.source || '', summary: String(_oz.summary || '').slice(0, 400), status: 'new', score: _o1l.score,
data: JSON.stringify({ category: classify(text).category, followed: _o12[0], topic_key: topicKey(cand.title), published: _o1e || null,
score_parts: _o1l.parts, sources: [{ url: _oz.link, name: _oz.source || '' }], series: series ? { part: series.part, of: series.of.id } : undefined }) });
}
return _o18;
}

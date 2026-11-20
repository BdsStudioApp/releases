import { fold } from './core.js';
import { redact } from './talk.js';
import { givenName } from '../_lib/crm.js';
import { gate } from '../_lib/consent.js';
export const USE_KIND = 'g2_script_use';
export const MIN_USES = 3;
export const MERGE_MS = 10 * 60000;
export const RESULTS = [
['open', 'Đã dùng – khách mở lòng'],
['no', 'Đã dùng – vẫn từ chối'],
['unknown', 'Chưa rõ'],
];
const _o3 = new Set(RESULTS.map(_od => _od[0]));
export const OBJECTIONS = [
{ id: 'gia_cao', label: 'Giá cao quá', scripts: ['gia_cao'], kw: ['gia cao', 'dat qua', 'mac qua', 'cao qua', 'dat the'] },
{ id: 'hoi_vo_chong', label: 'Để hỏi vợ/chồng', scripts: ['tc_hoi_vo_chong'], kw: ['hoi vo', 'hoi chong', 'hoi y kien', 'ban voi vo', 'ban voi chong', 'hoi gia dinh', 'vo chong'] },
{ id: 'ben_kia_re', label: 'Bên kia rẻ hơn', scripts: ['tc_ben_kia_re'], kw: ['ben kia', 're hon', 'cho khac', 'du an khac'] },
{ id: 'suy_nghi', label: 'Để suy nghĩ thêm', scripts: ['tc_suy_nghi'], kw: ['suy nghi', 'can nhac'] },
{ id: 'chua_voi', label: 'Chưa cần vội', scripts: ['cho_them'], kw: ['chua voi', 'chua can', 'de sau', 'tu tu', 'cho them', 'cho gia giam'] },
{ id: 'phap_ly', label: 'Lo pháp lý', scripts: ['phap_ly'], kw: ['phap ly', 'so do', 'so hong', 'giay phep', 'hdmb', 'bao lanh', 'so huu'] },
{ id: 'lai_vay', label: 'Lo lãi vay', scripts: ['tc_lai_vay', 'vay'], kw: ['lai suat', 'lai vay', 'tra no', 'tha noi', 'khong tra noi', 'tra khong noi', 'ngan hang'] },
{ id: 'vi_tri', label: 'Chê vị trí', scripts: ['tc_vi_tri', 'xa'], kw: ['vi tri', 'xa qua', 'xa trung tam', 'tac duong', 'di lai', 'duong nho', 'ngo nho'] },
];
const _o0 = new Map(OBJECTIONS.map(_oa => [_oa.id, _oa]));
const _o1 = new Map(OBJECTIONS.flatMap(_oa => _oa.scripts.map(s => [s, _oa.id])));
const pd = _og => { if (_og && typeof _og === 'object') return _og; try { const j = JSON.parse(_og || '{}'); return j && typeof j === 'object' ? j : {}; } catch { return {}; } };
const words = s => ' ' + fold(s).replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
const _o8 = (text, _oa) => { const n = words(text); return _oa.kw.filter(_o9 => n.includes(' ' + _o9 + ' ')).length; };
export function objectionFromText(text) {
if (_o0.has(text)) return text;
let best = '', max = 0;
for (const _oa of OBJECTIONS) { const n = _o8(text, _oa); if (n > max) { max = n; best = _oa.id; } }
return best;
}
export function objectionOf(s) {
if (!s) return '';
const _o6 = s.row ? pd(s.row.data) : {};
for (const _og of [s.objection, _o6.objection]) if (_og && _o0.has(_og)) return _og;
if (_o1.has(s.id)) return _o1.get(s.id);
if (_o6.from && _o1.has(_o6.from)) return _o1.get(_o6.from);
if (s.cat && s.cat !== 'objection') return '';
return objectionFromText([...(s.triggers || []), s.title || ''].join(' , '));
}
export function scriptsFor(objId, scripts) { return (scripts || []).filter(s => objectionOf(s) === objId); }
export function parseUses(rows) {
const _ob = [];
for (const _od of rows || []) {
if (!_od || _od.kind !== USE_KIND || Number(_od.deleted)) continue;
const _o6 = pd(_od.data);
if (!_o6.script_id || !_o3.has(_o6.result)) continue;
_ob.push({ id: _od.id, scriptId: String(_o6.script_id), customerId: String(_o6.customer_id || ''), result: _o6.result, at: Number(_o6.at) || 0, by: String(_o6.by || '') });
}
return _ob;
}
export function useRow({ scriptId, customerId = '', result, by = '', now = Date.now(), objection = '' } = {}, existing = []) {
if (!scriptId) throw new Error('Thiếu mã kịch bản');
if (!_o3.has(result)) throw new Error('Chưa chọn kết quả hợp lệ');
const data = JSON.stringify({ script_id: String(scriptId), customer_id: String(customerId || ''), result, at: now, by: String(by || ''), objection: String(objection || '') });
if (customerId) {
const _oc = parseUses(existing).find(_of => _of.scriptId === String(scriptId) && _of.customerId === String(customerId) && _of.by === String(by || '') && Math.abs(now - _of.at) <= MERGE_MS);
const row = _oc && existing.find(_od => _od.id === _oc.id);
if (row) return { ...row, data };
}
return { kind: USE_KIND, name: 'Dùng kịch bản', owner: by || '', created_by: by || '', data };
}
export function useStats(uses) {
const _oe = {};
for (const _of of uses || []) {
const s = _oe[_of.scriptId] || (_oe[_of.scriptId] = { n: 0, open: 0, no: 0, unknown: 0, rate: null });
s.n++; s[_of.result]++;
}
for (const s of Object.values(_oe)) { const _o9 = s.open + s.no; s.rate = s.n >= MIN_USES && _o9 ? Math.round(s.open / _o9 * 100) : null; }
return _oe;
}
export function statLine(s) {
if (!s || !s.n) return 'Chưa dùng lần nào';
const _o7 = 'Đã dùng ' + s.n + ' lần · ';
if (s.n < MIN_USES) return _o7 + 'chưa đủ dữ liệu';
if (s.rate === null) return _o7 + 'chưa rõ kết quả';
const _o9 = s.open + s.no;
return _o7 + 'mở lòng ' + s.rate + '%' + (_o9 < s.n ? ' (' + _o9 + ' lần rõ kết quả)' : '');
}
export function rankScore(s) {
const _o9 = s ? s.open + s.no : 0;
if (!s || s.n < MIN_USES || !_o9) return 0.5;
return (s.open + 1) / (_o9 + 2);
}
export function rankScripts(scripts, stats = {}) {
return (scripts || []).map((s, i) => ({ s, i, sc: rankScore(stats[s.id]), n: (stats[s.id] || {}).n || 0 }))
.sort((a, b) => b.sc - a.sc || b.n - a.n || a.i - b.i).map(x => x.s);
}
export function bestFor(objId, scripts, stats = {}) {
const _od = _o0.has(objId) ? rankScripts(scriptsFor(objId, scripts), stats) : [];
return { objection: _o0.get(objId) || null, best: _od[0] || null, others: _od.slice(1) };
}
const _o5 = _o4 => gate(_o4, 'profile').ok;
const _o2 = { ten: '', du_an: 'dự án', loai_can: 'phù hợp', so_tien: 'mức vốn anh/chị dự kiến', ten_toi: 'chuyên viên tư vấn' };
export function personalize(script, customer, opts = {}) {
const ok = _o5(customer);
const me = opts.me || {};
const vars = { ten_toi: me.name || '' };
if (ok) {
const _o4 = customer;
vars.ten = givenName(_o4.name);
vars.du_an = _o4.project ? (typeof opts.projectName === 'function' ? opts.projectName(_o4.project) : '') || '' : '';
vars.loai_can = _o4.unit_type || '';
vars.so_tien = Number(_o4.budget) > 0 && typeof opts.money === 'function' ? opts.money(Number(_o4.budget)) : '';
}
const text = String((script && script.text) || '')
.replace(/\{(\w+)\}/g, (_, _o9) => { const _og = vars[_o9]; return _og !== undefined && _og !== '' ? String(_og) : (_o2[_o9] ?? ''); })
.replace(/[ \t]{2,}/g, ' ').replace(/ ([,.?!])/g, '$1').trim();
const note = ok ? 'Đã điền theo hồ sơ khách (khách đã đồng ý lưu dữ liệu).'
: customer ? 'Khách chưa đồng ý lưu dữ liệu cá nhân – dùng bản chung, không điền tên hay nhu cầu.'
: 'Bản chung – chọn khách để điền tên, dự án (nếu khách đã đồng ý).';
return { text, personal: ok, note };
}
export function examplesFor(textOrId, scripts, stats = {}, max = 3) {
const id = objectionFromText(textOrId);
return id ? rankScripts(scriptsFor(id, scripts), stats).slice(0, max) : [];
}
export function newScriptPrompt(objText, { examples = [], stats = {}, ethics = [] } = {}) {
const clip = (t, n) => redact(String(t || '')).replace(/\s+/g, ' ').trim().slice(0, n);
const ex = (examples || []).slice(0, 3);
return [
'Bạn là chuyên gia đào tạo môi giới BĐS trung thực tại Việt Nam. Khách nói: "' + clip(objText, 300) + '".',
'Viết kịch bản trả lời (dưới 100 chữ, xưng "em", gọi "anh/chị", có thể dùng {ten}, {du_an}) và 1 mẹo ngắn.',
'Luật: ' + ethics.join(' ') + ' Không dùng chữ "xin lỗi". Không bịa số liệu lãi suất, pháp lý – cần số thì ghi [cần kiểm tra chính sách hiện hành].',
...(ex.length ? ['', 'Ví dụ kịch bản cùng loại trong kho của đội (học cách nói, không chép nguyên):',
...ex.map((s, i) => (i + 1) + '. ' + clip(s.title, 80) + ' (' + statLine(stats[s.id]) + '): ' + clip(s.text, 600)), ''] : []),
'Trả về JSON: {"title": "…", "text": "…", "tip": "…"}',
].join('\n');
}

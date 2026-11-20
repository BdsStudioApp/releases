import { extractJsonObj, normalizeLayout, DIRS } from '../g1_lib/logic.js';
import { fold, parseNum } from '../_lib/sales.js';
import { KINDS, cleanRooms, validate, areas, bounds } from './plan3d.js';
export const LAYOUT_MARK = 'BDS_G5_LAYOUT3D';
export const MIN_SIDE = 0.5, MAX_SIDE = 30;
const _oi = (x) => Math.round(x * 100) / 100;
const vn = (x, d = 1) => String(Math.round(x * 10 ** d) / 10 ** d).replace('.', ',');
export function layoutPrompt({ unit = '', project = '' } = {}) {
return [
LAYOUT_MARK,
`Đọc ảnh/PDF mặt bằng (layout) căn hộ${project ? ' dự án ' + project : ''}${unit ? ', căn ' + unit : ''} để dựng mô hình 3D. Chỉ ghi điều NHÌN THẤY trên ảnh, không đoán thêm phòng.`,
'Quy ước toạ độ: gốc (0,0) ở góc TRÊN-TRÁI hình chữ nhật bao ngoài căn hộ trên ảnh; x tăng sang phải, y tăng xuống dưới; đơn vị MÉT. Mỗi phòng xấp xỉ bằng 1 hình chữ nhật.',
'Kích thước lấy theo số ghi trên ảnh (mm → m) hoặc thước tỉ lệ; nếu ảnh không ghi kích thước thì ước lượng theo diện tích ghi trong phòng và ghi dims_from = "uoc_luong".',
'Trả về DUY NHẤT một đối tượng JSON:',
'{"unit_code":"mã căn nếu ghi trên ảnh hoặc rỗng","area_m2":số hoặc null,"area_kind":"thong_thuy|tim_tuong|khong_ro","bedrooms":số,"wc":số,',
'"corner":true|false|null,"north_arrow":true|false,"north_deg":góc mũi tên chỉ Bắc so với phía TRÊN của ảnh, theo chiều kim đồng hồ (0 = Bắc ở trên) hoặc null,',
'"balcony_dir":null,"door_dir":null,"scale_source":"ghi_kich_thuoc|thuoc_ti_le|khong_co","width_m":số,"depth_m":số,',
'"rooms":[{"name":"Phòng khách","kind":"khach|bep|ngu|wc|bancong|hanhlang|sanh|lamviec","x_m":số,"y_m":số,"w_m":số,"d_m":số,"area_m2":số hoặc null,"dims_from":"ghi_tren_anh|uoc_luong"}],',
'"doors":[{"between":["Phòng khách","Phòng ngủ 1"]}],"entry":{"room":"tên phòng có cửa chính","side":"top|bottom|left|right"},',
'"confidence":0..1,"notes":"điều người xem cần kiểm lại"}',
'Không có mũi tên chỉ Bắc thì north_arrow=false, north_deg=null. Không bịa số đo: thấy không rõ thì hạ confidence và ghi vào notes.',
].join('\n');
}
const _o2 = [
['bancong', ['ban cong', 'lo gia', 'logia', 'loggia', 'balcony', 'san phoi', 'bancong']],
['wc', ['ve sinh', 'wc', 'toilet', 'tam', 'bath', 'bathroom', 'restroom']],
['bep', ['bep', 'kitchen', 'an', 'dining']],
['ngu', ['ngu', 'bed', 'bedroom', 'master', 'pn']],
['khach', ['khach', 'living', 'sinh hoat']],
['sanh', ['sanh', 'foyer', 'lobby', 'entry', 'tien sanh']],
['hanhlang', ['hanh lang', 'hanhlang', 'corridor', 'hall']],
['lamviec', ['lam viec', 'lamviec', 'office', 'study', 'doc sach']],
];
export function kindOf(kind, name) {
if (KINDS[kind]) return kind;
const _oc = ' ' + fold(`${kind || ''} ${name || ''}`).replace(/[^a-z0-9]+/g, ' ') + ' ';
for (const [k, words] of _o2) if (words.some((w) => _oc.includes(' ' + w + ' '))) return k;
return 'khach';
}
const num = (v) => { const x = typeof v === 'number' ? v : parseNum(v); return Number.isFinite(x) ? x : NaN; };
export function checkRoom(r) {
const w = num(r && r.w), d = num(r && r.d);
const name = (r && r.name) || 'Phòng';
if (!Number.isFinite(w) || !Number.isFinite(d)) return `${name}: chưa nhập đủ rộng và sâu (mét).`;
if (w < MIN_SIDE || d < MIN_SIDE) return `${name}: cạnh phải từ ${vn(MIN_SIDE)} m trở lên.`;
if (w > MAX_SIDE || d > MAX_SIDE) return `${name}: cạnh quá ${MAX_SIDE} m – kiểm lại đơn vị (mm hay m?).`;
return '';
}
export function toMeters(v) {
let x = num(v);
if (!Number.isFinite(x) || x <= 0) return NaN;
if (x >= 300) x /= 1000; else if (x > MAX_SIDE + 5 && x < 300) x /= 100;
return _oi(x);
}
const _on = (name, used, i) => {
let _o6 = fold(name).replace(/[^a-z0-9]+/g, '').slice(0, 14) || 'p' + (i + 1);
if (!/^[a-z]/.test(_o6)) _o6 = 'p' + _o6;
let id = _o6, k = 2;
while (used.has(id)) id = _o6 + k++;
used.add(id);
return id;
};
export function autoArrange(rooms) {
const list = rooms.map((r) => ({ ...r }));
const outdoor = list.filter((r) => (KINDS[r.kind] || {}).outdoor);
const hubs = list.filter((r) => !(KINDS[r.kind] || {}).outdoor && (KINDS[r.kind] || {}).hub).sort((a, _o4) => (a.kind === 'khach') - (_o4.kind === 'khach'));
const top = list.filter((r) => !outdoor.includes(r) && !hubs.includes(r));
const _o0 = top.length ? Math.max(...top.map((r) => r.d)) : 0;
let x = 0;
for (const r of top) { r.x = _oi(x); r.y = _oi(_o0 - r.d); x += r.w; }
x = 0;
for (const r of hubs) { r.x = _oi(x); r.y = _oi(_o0); x += r.w; }
const _oe = hubs.find((r) => r.kind === 'khach') || hubs[hubs.length - 1];
const _o1 = hubs.length ? Math.max(...hubs.map((r) => r.d)) : 0;
x = _oe ? _oe.x : 0;
for (const r of outdoor) { r.x = _oi(x); r.y = _oi(_o0 + (_oe ? _oe.d : _o1)); x += r.w; }
return list;
}
export function facingOf(rooms, roomId, northDeg) {
const r = rooms.find((x) => x.id === roomId);
if (!r || !Number.isFinite(Number(northDeg))) return null;
const _o4 = bounds(rooms), e = 0.05;
const _ol = [
{ a: 0, len: Math.abs(r.y - _o4.y) < e ? r.w : 0 },
{ a: 90, len: Math.abs(r.x + r.w - (_o4.x + _o4.w)) < e ? r.d : 0 },
{ a: 180, len: Math.abs(r.y + r.d - (_o4.y + _o4.d)) < e ? r.w : 0 },
{ a: 270, len: Math.abs(r.x - _o4.x) < e ? r.d : 0 },
].filter((_ok) => _ok.len > 0).sort((p, q) => q.len - p.len);
if (!_ol.length) return null;
const _o8 = (((_ol[0].a - Number(northDeg)) % 360) + 360) % 360;
return DIRS[Math.round(_o8 / 45) % 8];
}
export function normalizeLayout3d(input) {
const _od = extractJsonObj(input);
if (!_od) return { ok: false, reason: 'json', warnings: ['AI trả kết quả chưa đúng mẫu – bấm làm lại hoặc nhập tay.'] };
if (_od.demo === true && !Array.isArray(_od.rooms)) return { ok: false, reason: 'demo', warnings: ['Chế độ Xem thử không có AI thật'] };
const _om = normalizeLayout(_od);
const w = _om.warnings.filter((x) => !/hướng ban công\/cửa|căn góc/.test(x));
if (!_om.fields.north_arrow) w.push('Không thấy mũi tên chỉ hướng Bắc trên ảnh – app không tính hướng ban công, anh/chị tự xác nhận hướng');
const _oj = Array.isArray(_od.rooms) ? _od.rooms.slice(0, 30) : [];
const used = new Set();
const rooms = [];
let estimated = _od.scale_source === 'khong_co';
let _oh = true;
_oj.forEach((r, i) => {
if (!r || typeof r !== 'object') return;
const name = String(r.name || '').trim().slice(0, 40) || `Phòng ${i + 1}`;
let rw = toMeters(r.w_m ?? r.w), rd = toMeters(r.d_m ?? r.d);
const _o3 = num(r.area_m2);
if ((!Number.isFinite(rw) || !Number.isFinite(rd)) && _o3 > 0) {
const _ok = _oi(Math.sqrt(_o3)); rw = Number.isFinite(rw) ? rw : (Number.isFinite(rd) ? _oi(_o3 / rd) : _ok); rd = Number.isFinite(rd) ? rd : _oi(_o3 / rw);
estimated = true; w.push(`${name}: AI chỉ đọc được diện tích ${vn(_o3)} m² – rộng × sâu là ước lượng, cần đo lại theo layout`);
}
const _o5 = checkRoom({ name, w: rw, d: rd });
if (_o5) { w.push(_o5 + ' (AI đọc) – đã bỏ, thêm lại bằng tay'); return; }
if (_o3 > 0 && Math.abs(rw * rd - _o3) / _o3 > 0.15) w.push(`${name}: rộng × sâu = ${vn(rw * rd)} m² khác diện tích ghi trên ảnh ${vn(_o3)} m² – kiểm lại`);
if (r.dims_from && r.dims_from !== 'ghi_tren_anh') estimated = true;
const x = num(r.x_m ?? r.x), y = num(r.y_m ?? r.y);
if (!Number.isFinite(x) || !Number.isFinite(y) || x < -1 || y < -1) _oh = false;
rooms.push({ id: _on(name, used, i), kind: kindOf(r.kind, name), name, x: Number.isFinite(x) ? _oi(x) : 0, y: Number.isFinite(y) ? _oi(y) : 0, w: rw, d: rd, src: r.dims_from === 'ghi_tren_anh' ? 'anh' : 'uoc' });
});
if (!rooms.length) return { ok: false, reason: 'empty', warnings: [...w, 'AI không đọc ra phòng nào – nhập kích thước phòng bằng tay'], summary: _om.fields };
let list = rooms;
if (!_oh) { list = autoArrange(rooms); w.push('AI không đưa vị trí phòng – app xếp tạm các phòng (đúng diện tích, chưa đúng hình dạng thật). Sửa x, y theo layout.'); }
if (estimated) w.push('Một số kích thước là ƯỚC LƯỢNG (ảnh không ghi số đo) – đối chiếu layout trước khi dựng 3D');
const _oa = cleanRooms(list).map((r, i) => ({ ...r, src: list[i].src }));
const _o9 = (_ok) => { const _oc = fold(_ok); return _oa.find((r) => fold(r.name) === _oc) || _oa.find((r) => _oc && (fold(r.name).includes(_oc) || _oc.includes(fold(r.name)))); };
const links = [];
let _of = 0;
(Array.isArray(_od.doors) ? _od.doors : []).slice(0, 60).forEach((d) => {
const _og = Array.isArray(d) ? d : d && Array.isArray(d.between) ? d.between : null;
if (!_og || _og.length !== 2) return;
const a = _o9(_og[0]), _o4 = _o9(_og[1]);
if (a && _o4 && a.id !== _o4.id) links.push([a.id, _o4.id]); else _of++;
});
if (_of) w.push(`${_of} cửa AI đọc không khớp tên phòng – đã bỏ (app tự đặt cửa khi thiếu)`);
let entry = null;
if (_od.entry && typeof _od.entry === 'object') { const _ob = _o9(_od.entry.room); if (_ob && ['top', 'bottom', 'left', 'right'].includes(_od.entry.side)) entry = { room: _ob.id, side: _od.entry.side }; }
for (const e of validate(_oa)) w.push(e + ' – sửa x, y hoặc kích thước');
const a = areas(_oa);
if (_om.fields.area_m2 && a.indoor > 0 && Math.abs(a.indoor - _om.fields.area_m2) / _om.fields.area_m2 > 0.12) {
w.push(`Tổng diện tích các phòng trong nhà ${vn(a.indoor)} m² lệch ${Math.round(Math.abs(a.indoor - _om.fields.area_m2) / _om.fields.area_m2 * 100)}% so với diện tích ghi trên layout ${vn(_om.fields.area_m2)} m² – kiểm lại số đo`);
}
const northDeg = _om.fields.north_arrow && Number.isFinite(num(_od.north_deg)) ? ((num(_od.north_deg) % 360) + 360) % 360 : null;
const _o7 = _oa.find((r) => r.kind === 'bancong');
const facing = northDeg != null && _o7 ? facingOf(_oa, _o7.id, northDeg) : null;
return { ok: true, plan: { rooms: _oa, links, entry }, summary: _om.fields, warnings: [...new Set(w)], northDeg, facing, estimated };
}
export function planErrors(rooms) {
const errs = (rooms || []).map(checkRoom).filter(Boolean);
if (!(rooms || []).length) errs.push('Chưa có phòng nào – thêm ít nhất 1 phòng.');
return [...errs, ...validate(cleanRooms(rooms || []))];
}
export const DEMO_SCAN = {
unit_code: 'MAU-2PN', area_m2: 70, area_kind: 'thong_thuy', bedrooms: 2, wc: 2, corner: false, north_arrow: true, north_deg: 0,
balcony_dir: null, door_dir: null, scale_source: 'ghi_kich_thuoc', width_m: 9.2, depth_m: 8.4,
rooms: [
{ name: 'Hành lang', kind: 'hanhlang', x_m: 3.0, y_m: 0, w_m: 1.4, d_m: 3.4, area_m2: 4.8, dims_from: 'ghi_tren_anh' },
{ name: 'Phòng ngủ 2', kind: 'ngu', x_m: 0, y_m: 0, w_m: 3.0, d_m: 3.4, area_m2: 10.2, dims_from: 'ghi_tren_anh' },
{ name: 'Vệ sinh chung', kind: 'wc', x_m: 4.4, y_m: 0, w_m: 1.8, d_m: 2.0, area_m2: 3.6, dims_from: 'ghi_tren_anh' },
{ name: 'Bếp + ăn', kind: 'bep', x_m: 6.2, y_m: 0, w_m: 3.0, d_m: 3.4, area_m2: 10.2, dims_from: 'ghi_tren_anh' },
{ name: 'Vệ sinh master', kind: 'wc', x_m: 4.4, y_m: 2.0, w_m: 1.8, d_m: 1.4, area_m2: 2.5, dims_from: 'ghi_tren_anh' },
{ name: 'Phòng ngủ master', kind: 'ngu', x_m: 0, y_m: 3.4, w_m: 3.0, d_m: 3.8, area_m2: 11.4, dims_from: 'ghi_tren_anh' },
{ name: 'Phòng khách', kind: 'khach', x_m: 3.0, y_m: 3.4, w_m: 6.2, d_m: 3.8, area_m2: 23.6, dims_from: 'ghi_tren_anh' },
{ name: 'Lô gia', kind: 'bancong', x_m: 3.0, y_m: 7.2, w_m: 6.2, d_m: 1.2, area_m2: 7.4, dims_from: 'ghi_tren_anh' },
],
doors: [{ between: ['Hành lang', 'Phòng ngủ 2'] }, { between: ['Hành lang', 'Vệ sinh chung'] }, { between: ['Hành lang', 'Phòng khách'] }, { between: ['Bếp + ăn', 'Phòng khách'] },
{ between: ['Phòng ngủ master', 'Phòng khách'] }, { between: ['Vệ sinh master', 'Phòng khách'] }, { between: ['Phòng khách', 'Lô gia'] }],
entry: { room: 'Hành lang', side: 'top' }, confidence: 0.8, notes: 'KẾT QUẢ MẪU của chế độ Xem thử – không đọc từ ảnh của anh/chị.',
};

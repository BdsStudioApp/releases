import { extractJsonObj } from '../g1_lib/logic.js';
import { parseNum } from '../_lib/sales.js';
export const QH_MARK = 'BDS_G5_QUYHOACH_READ';
export const AI_MIN_CONF = 0.6;
export const PORTALS = [
{ id: 'hn', label: 'Hà Nội – Sở Quy hoạch – Kiến trúc', url: 'https://qhkt.hanoi.gov.vn' },
{ id: 'hn_sdd', label: 'Hà Nội – Tra cứu quy hoạch, kế hoạch sử dụng đất', url: 'https://qhkhsdd.hanoi.gov.vn' },
{ id: 'hcm', label: 'TP.HCM – Cổng công khai dữ liệu quy hoạch (GIS)', url: 'https://gisxaydung.tphcm.gov.vn' },
{ id: 'bxd', label: 'Bộ Xây dựng – Thông tin quy hoạch xây dựng', url: 'https://quyhoach.xaydung.gov.vn' },
];
export function portalSearchUrl(place) {
return 'https://www.google.com/search?q=' + encodeURIComponent(`cổng thông tin quy hoạch ${String(place || '').trim()} site:gov.vn`.replace(/\s+/g, ' ').trim());
}
export function mapsUrl({ lat, lng, q, z = 18 } = {}) {
if (Number.isFinite(lat) && Number.isFinite(lng)) return `https://www.google.com/maps/@${lat},${lng},${z}z`;
return 'https://www.google.com/maps/search/' + encodeURIComponent(String(q || '').trim());
}
export function qhPrompt({ name = '' } = {}) {
return [
QH_MARK,
`Đọc ảnh BẢN ĐỒ QUY HOẠCH${name ? ' khu "' + name + '"' : ''}. Chỉ ghi điều NHÌN THẤY trên ảnh, không đoán, không đánh giá giá trị đầu tư.`,
'Trả về DUY NHẤT một đối tượng JSON:',
'{"title":"tên bản đồ ghi trên ảnh","issuer":"cơ quan phê duyệt/ban hành","decision":"số quyết định phê duyệt nếu ghi","date":"ngày quyết định nếu ghi","scale":"tỉ lệ vd 1/2000 hoặc rỗng",',
'"north_arrow":true|false,"legend":[{"color":"#RRGGBB","label":"chức năng sử dụng đất theo chú giải"}],',
'"landmarks":[{"x":0..1,"y":0..1,"label":"điểm dễ tìm trên Google Maps: giao lộ có tên 2 đường, góc công trình có tên"}],',
'"confidence":0..1,"notes":"điều người xem cần kiểm lại"}',
'landmarks: 3–6 điểm rải đều các góc ảnh; x, y là tỉ lệ theo chiều rộng/chiều cao ảnh tính từ góc trên-trái. legend: màu đọc từ ô màu của chú giải.',
].join('\n');
}
const _o0 = /^#?([0-9a-f]{6})$/i;
export function hexRgb(hex) { const _o5 = _o0.exec(String(hex || '').trim()); if (!_o5) return null; const _o7 = parseInt(_o5[1], 16); return [(_o7 >> 16) & 255, (_o7 >> 8) & 255, _o7 & 255]; }
const S = (_o7, n) => String(_o7 == null ? '' : _o7).replace(/\s+/g, ' ').trim().slice(0, n);
export function normalizeQhRead(input) {
const _o4 = extractJsonObj(input);
if (!_o4) return { ok: false, reason: 'json', warnings: ['AI trả kết quả chưa đúng mẫu – bấm làm lại hoặc nhập tay.'] };
if (_o4.demo === true && !Array.isArray(_o4.legend)) return { ok: false, reason: 'demo', warnings: ['Chế độ Dùng thử không có AI thật'] };
const _o8 = [];
const _o2 = Math.max(0, Math.min(1, Number.isFinite(parseNum(_o4.confidence)) ? parseNum(_o4.confidence) : 0));
const decision = S(_o4.decision, 120), issuer = S(_o4.issuer, 160), date = S(_o4.date, 40);
const source = decision ? [decision, issuer, date ? 'ngày ' + date.replace(/^ngày\s*/i, '') : ''].filter(Boolean).join(', ') : '';
const legend = (Array.isArray(_o4.legend) ? _o4.legend : []).map((l) => ({ color: hexRgb(l && l.color) ? '#' + _o0.exec(String(l.color).trim())[1].toUpperCase() : '', label: S(l && l.label, 80) }))
.filter((l) => l.color && l.label).slice(0, 24);
const landmarks = (Array.isArray(_o4.landmarks) ? _o4.landmarks : []).map((p) => ({ x: parseNum(p && p.x), y: parseNum(p && p.y), label: S(p && p.label, 120) }))
.filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1 && p.label).slice(0, 8);
if (!decision) _o8.push('AI không thấy số quyết định phê duyệt trên ảnh – nguồn bản đồ anh/chị phải tự ghi từ văn bản gốc');
if (!legend.length) _o8.push('Không đọc được chú giải màu – tự đối chiếu chú giải của bản đồ');
if (landmarks.length < 3) _o8.push('AI tìm được ít hơn 3 điểm mốc – chạm vào ảnh để tự chọn thêm điểm');
if (_o2 < AI_MIN_CONF) _o8.push(`AI không chắc chắn (độ tin ${Math.round(_o2 * 100)}%) – chỉ để tham khảo, không dùng làm nguồn`);
return { ok: true, title: S(_o4.title, 160), source, scale: S(_o4.scale, 30), north: _o4.north_arrow === true, legend, landmarks, confidence: _o2, trusted: _o2 >= AI_MIN_CONF, notes: S(_o4.notes, 400), warnings: _o8 };
}
export function nearestLegend(hex, legend, max = 48) {
const _o1 = hexRgb(hex);
if (!_o1 || !Array.isArray(legend)) return null;
let best = null;
for (const l of legend) { const q = hexRgb(l.color); if (!q) continue; const _o3 = Math.hypot(_o1[0] - q[0], _o1[1] - q[1], _o1[2] - q[2]); if (!best || _o3 < best.dist) best = { ...l, dist: Math.round(_o3) }; }
return best && best.dist <= max ? best : null;
}
export function qhSteps(s = {}) {
const _o6 = s.points || 0, ll = s.withLL || 0;
const steps = [
{ id: 'nguon', n: 1, label: 'Ảnh bản đồ & nguồn', done: !!(s.hasImg && s.hasSource),
hint: !s.hasImg ? 'Bấm "📂 Chọn ảnh/PDF bản đồ quy hoạch". Chưa có? Mở cổng quy hoạch chính thức, tải bản đồ (ảnh hoặc PDF) hoặc chụp ảnh khu đất rồi chọn tệp đó.'
: 'Ghi nguồn bản đồ: số quyết định, cơ quan phê duyệt, ngày (hoặc bấm "🤖 AI đọc bản đồ" để AI gợi ý rồi tự đối chiếu).' },
{ id: 'nan', n: 2, label: 'Nắn ảnh (3 điểm khống chế)', done: !!s.fitOk,
hint: !s.hasImg ? 'Cần ảnh bản đồ ở bước 1 trước.'
: _o6 < 3 ? `Chạm vào ảnh tại điểm dễ nhận (ngã tư, góc công trình) – đã có ${_o6}/3 điểm.`
: ll < 3 ? `Dán toạ độ (từ Google Maps) cho từng điểm – đã có ${ll}/3 điểm có toạ độ.`
: (s.fitMsg || 'Các điểm chưa khớp – kiểm lại toạ độ từng điểm.') },
{ id: 'chong', n: 3, label: 'Chồng lớp & đặt vị trí', done: !!(s.fitOk && s.hasPin),
hint: !s.fitOk ? 'Nắn ảnh xong (bước 2) thì ảnh tự chồng lên bản đồ.'
: 'Chỉnh độ đậm lớp quy hoạch, rồi đặt vị trí cần chấm: chạm ảnh ở chế độ "Đặt vị trí", dán toạ độ, hoặc kéo bản đồ cho dấu + trùng vị trí.' },
{ id: 'cham', n: 4, label: 'Đọc ô đất & chấm điểm', done: !!s.scored,
hint: 'Đối chiếu màu ô đất với chú giải, chấm từng tiêu chí có nguồn. Thiếu nguồn hoặc có cảnh báo đỏ thì app không hiện điểm.' },
];
return { steps, next: steps.find((x) => !x.done) || null };
}
export const DEMO_QH = {
title: 'Bản đồ quy hoạch MẪU (chế độ Dùng thử)', issuer: '', decision: '', date: '', scale: '1/2000', north_arrow: true,
legend: [{ color: '#F2D36B', label: 'Đất ở (mẫu)' }, { color: '#7CC46A', label: 'Cây xanh (mẫu)' }, { color: '#EEEAE0', label: 'Đất trống (mẫu)' }],
landmarks: [{ x: 0.1, y: 0.1, label: 'Góc trên-trái ô đất (mẫu)' }, { x: 0.9, y: 0.1, label: 'Góc trên-phải ô đất (mẫu)' }, { x: 0.1, y: 0.9, label: 'Góc dưới-trái ô đất (mẫu)' }],
confidence: 0.5, notes: 'KẾT QUẢ MẪU của chế độ Dùng thử – không đọc từ ảnh của anh/chị.',
};

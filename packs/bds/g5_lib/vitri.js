export const NEED_SOURCE = 'Cần nguồn bản đồ quy hoạch chính thức (Sở Quy hoạch – Kiến trúc / Sở Xây dựng, UBND cấp có thẩm quyền, cổng thông tin quy hoạch của địa phương).';
export const CRITERIA = [
{ id: 'phaply', label: 'Quy hoạch & pháp lý khu đất', weight: 20, needSource: true,
hint: 'Chức năng ô đất trên bản đồ quy hoạch chính thức (đất ở, hỗn hợp…), có nằm trong lộ giới / hành lang không.' },
{ id: 'giaothong', label: 'Kết nối giao thông', weight: 20,
hint: 'Đường chính, cầu, ga metro/BRT đang chạy; thời gian lái xe tới nơi làm việc của khách giờ cao điểm.' },
{ id: 'tienich', label: 'Tiện ích quanh (1–3 km)', weight: 15,
hint: 'Trường học, chợ/siêu thị, bệnh viện, công viên – đã hoạt động, không tính dự kiến.' },
{ id: 'moitruong', label: 'Môi trường sống', weight: 15,
hint: 'Cây xanh, mặt nước, tiếng ồn, bụi, ngập khi mưa lớn (hỏi cư dân xung quanh).' },
{ id: 'hatang', label: 'Hạ tầng tương lai có quyết định', weight: 10, needSource: true,
hint: 'Chỉ tính dự án đã có quyết định phê duyệt / khởi công – không tính tin đồn, “sắp có”.' },
{ id: 'thanhkhoan', label: 'Thanh khoản & cộng đồng', weight: 10,
hint: 'Có giao dịch thứ cấp, cho thuê được; cư dân đã về ở đông.' },
{ id: 'chudautu', label: 'Chủ đầu tư, tiến độ, vận hành', weight: 10,
hint: 'Uy tín bàn giao đúng hẹn, đơn vị quản lý toà nhà.' },
];
export const RED_FLAGS = [
{ id: 'logioi', label: 'Một phần nằm trong lộ giới / quy hoạch đường' },
{ id: 'congcong', label: 'Ô đất quy hoạch cây xanh, công cộng, trường học…' },
{ id: 'hanhlang', label: 'Hành lang đường điện cao thế, đê điều, kênh mương' },
{ id: 'ngap', label: 'Ngập khi mưa lớn' },
{ id: 'nghiatrang', label: 'Sát nghĩa trang, bãi rác, trạm xử lý nước thải' },
{ id: 'tranhchap', label: 'Có tranh chấp, kê biên hoặc chưa rõ pháp lý' },
];
export const UNTRUSTED = 'Chưa đủ tin cậy để chấm điểm';
export const NOT_OFFICIAL = 'Lớp quy hoạch do người dùng tự nắn bằng điểm khống chế – vị trí chỉ gần đúng, không phải ranh quy hoạch chính thức. Đối chiếu bản đồ gốc tại cơ quan có thẩm quyền trước khi giao dịch.';
export const SCALE = ['Chưa chấm', 'Rất kém', 'Kém', 'Trung bình', 'Tốt', 'Rất tốt'];
export function scoreLocation({ scores = {}, sources = {}, flags = {}, weights = {} } = {}) {
const rows = CRITERIA.map((c) => {
const w = Number.isFinite(Number(weights[c.id])) && Number(weights[c.id]) >= 0 ? Number(weights[c.id]) : c.weight;
const _o2 = Math.max(0, Math.min(5, Math.round(Number(scores[c.id]) || 0)));
const _o3 = String(sources[c.id] || '').trim();
let counted = _o2 > 0, reason = _o2 > 0 ? '' : 'Chưa chấm';
if (counted && c.needSource && _o3.length < 4) { counted = false; reason = 'Chưa ghi nguồn văn bản – không tính'; }
return { id: c.id, label: c.label, score: _o2, weight: w, points: counted ? (_o2 / 5) * w : 0, counted, reason, source: _o3 };
});
const max = rows.filter((r) => r.counted).reduce((t, r) => t + r.weight, 0);
const _o0 = rows.reduce((t, r) => t + r.points, 0);
const pct = max > 0 ? Math.round((_o0 / max) * 100) : 0;
const _o1 = RED_FLAGS.filter((f) => flags[f.id]);
const warnings = [];
if (!rows.find((r) => r.id === 'phaply').counted) warnings.push(NEED_SOURCE);
if (max > 0 && max < 60) warnings.push('Mới chấm ' + max + '/100 trọng số – kết quả chưa đủ tin cậy.');
let grade = max < 50 ? '—' : pct >= 80 ? 'A' : pct >= 65 ? 'B' : pct >= 50 ? 'C' : 'D';
let label = { A: 'Vị trí rất tốt', B: 'Vị trí tốt', C: 'Trung bình – cân nhắc', D: 'Yếu', '—': max ? 'Tạm tính – chấm thêm tiêu chí' : 'Chưa đủ dữ liệu' }[grade];
if (_o1.length) { label = 'Cần kiểm tra kỹ trước khi tư vấn'; if (grade === 'A' || grade === 'B') grade = 'C'; }
const trusted = max >= 60 && !_o1.length;
return { total: pct, pct, max, grade, label, rows, flags: _o1, warnings, trusted };
}

export const SAMPLE_NOTE = 'Đơn giá có sẵn là SỐ MẪU để minh hoạ – chưa phải giá thị trường. Sửa theo báo giá thật trước khi gửi khách.';
export const LEVELS = [
{ id: 'coban', vi: 'Cơ bản' },
{ id: 'kha', vi: 'Khá' },
{ id: 'caocap', vi: 'Cao cấp' },
];
export const STYLES = [
{ id: 'hiendai', vi: 'Hiện đại', factor: 1.0, desc: 'Đường nét gọn, màu trung tính, vật liệu công nghiệp phổ biến.' },
{ id: 'toigian', vi: 'Tối giản', factor: 0.95, desc: 'Ít đồ, nhiều tủ âm, mặt phẳng trơn.' },
{ id: 'bacau', vi: 'Bắc Âu', factor: 1.0, desc: 'Gỗ sáng màu, vải tự nhiên, nhiều ánh sáng.' },
{ id: 'japandi', vi: 'Japandi', factor: 1.05, desc: 'Kết hợp Nhật – Bắc Âu: gỗ, mây tre, tông đất.' },
{ id: 'indochine', vi: 'Indochine', factor: 1.15, desc: 'Gạch bông, gỗ tối màu, mây tre, chi tiết Á Đông.' },
{ id: 'tancodien', vi: 'Tân cổ điển', factor: 1.3, desc: 'Phào chỉ, đèn chùm, đồ bọc da/nhung – nhiều chi tiết thủ công.' },
];
export const UNITS = { m2: 'm²', md: 'm dài', bo: 'bộ', cai: 'cái', goi: 'gói' };
export const ITEMS = [
{ id: 'san', vi: 'Sàn gỗ / gạch phòng khô', room: 'Hoàn thiện', unit: 'm2', qty: (_o0) => _o0.area * 0.75, price: { coban: 350000, kha: 600000, caocap: 1200000 } },
{ id: 'tran', vi: 'Trần thạch cao + sơn', room: 'Hoàn thiện', unit: 'm2', qty: (_o0) => _o0.area * 0.8, price: { coban: 180000, kha: 250000, caocap: 400000 } },
{ id: 'son', vi: 'Sơn tường (bả + 2 lớp)', room: 'Hoàn thiện', unit: 'm2', qty: (_o0) => _o0.area * 2.5, price: { coban: 60000, kha: 90000, caocap: 150000 } },
{ id: 'den', vi: 'Đèn chiếu sáng', room: 'Hoàn thiện', unit: 'm2', qty: (_o0) => _o0.area, price: { coban: 80000, kha: 150000, caocap: 350000 } },
{ id: 'rem', vi: 'Rèm cửa', room: 'Hoàn thiện', unit: 'm2', qty: (_o0) => _o0.area * 0.3, price: { coban: 250000, kha: 450000, caocap: 900000 } },
{ id: 'sofa', vi: 'Sofa + bàn trà', room: 'Phòng khách', unit: 'bo', qty: () => 1, price: { coban: 12000000, kha: 25000000, caocap: 60000000 } },
{ id: 'kegiay', vi: 'Tủ giày + kệ TV', room: 'Phòng khách', unit: 'bo', qty: () => 1, price: { coban: 8000000, kha: 15000000, caocap: 35000000 } },
{ id: 'tubep', vi: 'Tủ bếp trên + dưới', room: 'Bếp', unit: 'md', qty: (_o0) => 3 + 0.5 * Math.max(0, _o0.bedrooms - 1), price: { coban: 5000000, kha: 8000000, caocap: 15000000 } },
{ id: 'thietbibep', vi: 'Bếp từ, hút mùi, chậu vòi', room: 'Bếp', unit: 'bo', qty: () => 1, price: { coban: 15000000, kha: 30000000, caocap: 70000000 } },
{ id: 'banan', vi: 'Bàn ăn + ghế', room: 'Bếp', unit: 'bo', qty: () => 1, price: { coban: 6000000, kha: 12000000, caocap: 30000000 } },
{ id: 'giuong', vi: 'Giường + tab đầu giường', room: 'Phòng ngủ', unit: 'bo', qty: (_o0) => _o0.bedrooms, price: { coban: 7000000, kha: 14000000, caocap: 35000000 } },
{ id: 'tuquanao', vi: 'Tủ quần áo', room: 'Phòng ngủ', unit: 'md', qty: (_o0) => _o0.bedrooms * 1.6, price: { coban: 3500000, kha: 5500000, caocap: 10000000 } },
{ id: 'dieuhoa', vi: 'Điều hoà (gồm lắp đặt)', room: 'Thiết bị', unit: 'cai', qty: (_o0) => _o0.bedrooms + 1, price: { coban: 9000000, kha: 13000000, caocap: 22000000 } },
{ id: 'vesinh', vi: 'Thiết bị vệ sinh + gương, tủ lavabo', room: 'Phòng tắm', unit: 'bo', qty: (_o0) => _o0.baths, price: { coban: 10000000, kha: 20000000, caocap: 50000000 } },
{ id: 'trangtri', vi: 'Đồ trang trí, cây, tranh', room: 'Trang trí', unit: 'goi', qty: () => 1, price: { coban: 5000000, kha: 12000000, caocap: 30000000 } },
];
export function defaultPriceTable() {
return {
sample: true, updated_at: 0, source: '',
styles: Object.fromEntries(STYLES.map((s) => [s.id, s.factor])),
items: ITEMS.map((it) => ({ id: it.id, vi: it.vi, room: it.room, unit: it.unit, price: { ...it.price } })),
};
}
const round = (_o3, d = 1) => Math.round(_o3 * 10 ** d) / 10 ** d;
const _o2 = (x, max) => { const _o3 = Number(x); return Number.isFinite(_o3) ? Math.min(max, Math.max(0, _o3)) : (_o3 === Infinity ? max : 0); };
export function estimate(input = {}) {
const _o0 = { area: _o2(input.area, 1e5), bedrooms: Math.round(_o2(input.bedrooms, 50)), baths: Math.round(_o2(input.baths, 50)) };
const table = input.table || defaultPriceTable();
const level = LEVELS.some((l) => l.id === input.level) ? input.level : 'kha';
const styleFactor = Number((table.styles || {})[input.style]) || (STYLES.find((s) => s.id === input.style) || STYLES[0]).factor;
const _o4 = input.qty || {}, off = input.off || {};
const rows = [];
for (const it of ITEMS) {
if (off[it.id]) continue;
const t = (table.items || []).find((x) => x.id === it.id) || it;
const qty = Number.isFinite(Number(_o4[it.id])) && _o4[it.id] !== '' && _o4[it.id] != null ? _o2(_o4[it.id], 1e5) : round(it.qty(_o0), 1);
const price = _o2((t.price || {})[level], 1e10);
rows.push({ id: it.id, vi: t.vi || it.vi, room: it.room, unit: it.unit, qty, price, amount: Math.round(qty * price * styleFactor) });
}
for (const _o1 of input.custom || []) {
const qty = _o2(_o1.qty, 1e5), price = _o2(_o1.price, 1e10);
if (!_o1.vi || !qty) continue;
rows.push({ id: _o1.id || 'tuy_' + rows.length, vi: String(_o1.vi), room: _o1.room || 'Khác', unit: _o1.unit || 'goi', qty, price, amount: Math.round(qty * price), custom: true });
}
const subtotal = rows.reduce((t, r) => t + r.amount, 0);
const contingency = Math.round(subtotal * _o2(input.contingency ?? 5, 100) / 100);
const design = Math.round(subtotal * _o2(input.designPct ?? 0, 100) / 100);
const total = subtotal + contingency + design;
const byRoom = {};
rows.forEach((r) => { byRoom[r.room] = (byRoom[r.room] || 0) + r.amount; });
return { rows, byRoom, subtotal, styleFactor, contingency, design, total, perM2: _o0.area ? Math.round(total / _o0.area) : 0, level, style: input.style, sample: table.sample !== false, area: _o0.area };
}
export function isSample(table) {
if (!table || table.sample !== false) return true;
return !String(table.source || '').trim();
}
export function markReal(table, source, now = Date.now()) {
return { ...table, sample: !String(source || '').trim(), source: String(source || '').trim(), updated_at: now };
}
export function money(_o3) {
const _o5 = Math.round(Number(_o3) || 0);
if (Math.abs(_o5) >= 1e9) return (_o5 / 1e9).toFixed(2).replace('.', ',') + ' tỷ';
if (Math.abs(_o5) >= 1e6) return (Math.round(_o5 / 1e5) / 10).toLocaleString('vi-VN') + ' triệu';
if (Math.abs(_o5) >= 1e3) return Math.round(_o5 / 1e3).toLocaleString('vi-VN') + ' nghìn';
return _o5.toLocaleString('vi-VN') + ' đ';
}

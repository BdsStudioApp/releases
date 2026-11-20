export const fold = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export const PROVINCES = [
{ label: 'Hà Nội', city: true, from: [] },
{ label: 'Huế', city: true, from: [] },
{ label: 'Hải Phòng', city: true, from: ['Hải Dương'] },
{ label: 'Đà Nẵng', city: true, from: ['Quảng Nam'] },
{ label: 'TP Hồ Chí Minh', city: true, from: ['Bình Dương', 'Bà Rịa – Vũng Tàu'], alias: ['Hồ Chí Minh', 'Sài Gòn', 'TPHCM', 'HCM'] },
{ label: 'Cần Thơ', city: true, from: ['Sóc Trăng', 'Hậu Giang'] },
{ label: 'Lai Châu', from: [] }, { label: 'Điện Biên', from: [] }, { label: 'Sơn La', from: [] }, { label: 'Lạng Sơn', from: [] },
{ label: 'Quảng Ninh', from: [] }, { label: 'Thanh Hóa', from: [] }, { label: 'Nghệ An', from: [] }, { label: 'Hà Tĩnh', from: [] },
{ label: 'Cao Bằng', from: [] },
{ label: 'Tuyên Quang', from: ['Hà Giang'] },
{ label: 'Lào Cai', from: ['Yên Bái'] },
{ label: 'Thái Nguyên', from: ['Bắc Kạn'] },
{ label: 'Phú Thọ', from: ['Vĩnh Phúc', 'Hòa Bình'] },
{ label: 'Bắc Ninh', from: ['Bắc Giang'] },
{ label: 'Hưng Yên', from: ['Thái Bình'] },
{ label: 'Ninh Bình', from: ['Hà Nam', 'Nam Định'] },
{ label: 'Quảng Trị', from: ['Quảng Bình'] },
{ label: 'Quảng Ngãi', from: ['Kon Tum'] },
{ label: 'Gia Lai', from: ['Bình Định'] },
{ label: 'Khánh Hòa', from: ['Ninh Thuận'] },
{ label: 'Lâm Đồng', from: ['Đắk Nông', 'Bình Thuận'] },
{ label: 'Đắk Lắk', from: ['Phú Yên'] },
{ label: 'Đồng Nai', from: ['Bình Phước'] },
{ label: 'Tây Ninh', from: ['Long An'] },
{ label: 'Vĩnh Long', from: ['Bến Tre', 'Trà Vinh'] },
{ label: 'Đồng Tháp', from: ['Tiền Giang'] },
{ label: 'Cà Mau', from: ['Bạc Liêu'] },
{ label: 'An Giang', from: ['Kiên Giang'] },
];
const _o0 = {
'Hà Nội': 'Hoàn Kiếm|Ba Đình|Đống Đa|Hai Bà Trưng|Cầu Giấy|Thanh Xuân|Tây Hồ|Long Biên|Hoàng Mai|Hà Đông|Nam Từ Liêm|Bắc Từ Liêm|Gia Lâm|Đông Anh|Mê Linh|Sóc Sơn|Hoài Đức|Thanh Trì|Đan Phượng|Thạch Thất|Hòa Lạc|Quốc Oai|Chương Mỹ|Sơn Tây|Ba Vì|Thường Tín|Phú Xuyên|Ứng Hòa|Mỹ Đức|Thanh Oai|Phúc Thọ|Mỹ Đình|Linh Đàm|Chủ đầu tư Mẫu AN|Dự án Mẫu 26|Dự án Mẫu 25',
'TP Hồ Chí Minh': 'Quận 1|Quận 3|Quận 4|Quận 5|Quận 7|Quận 8|Quận 10|Quận 12|Bình Thạnh|Phú Nhuận|Gò Vấp|Tân Bình|Tân Phú|Bình Tân|Thủ Đức|Thủ Thiêm|Nhà Bè|Bình Chánh|Hóc Môn|Củ Chi|Cần Giờ|Chủ đầu tư Mẫu Y|Thủ Dầu Một|Dĩ An|Thuận An|Bến Cát|Tân Uyên|Bàu Bàng|Vũng Tàu|Bà Rịa|Phú Mỹ|Long Hải|Hồ Tràm|Côn Đảo',
'Hải Phòng': 'Hồng Bàng|Lê Chân|Ngô Quyền|Hải An|Kiến An|Dương Kinh|Đồ Sơn|Thủy Nguyên|An Dương|Cát Bà|Vũ Yên|TP Hải Dương|Chí Linh|Kinh Môn',
'Quảng Ninh': 'Hạ Long|Bãi Cháy|Vân Đồn|Móng Cái|Cẩm Phả|Uông Bí|Quảng Yên|Đông Triều',
'Đà Nẵng': 'Hải Châu|Sơn Trà|Ngũ Hành Sơn|Liên Chiểu|Thanh Khê|Cẩm Lệ|Hòa Vang|Hội An|Tam Kỳ|Điện Bàn|Điện Ngọc|Núi Thành',
'Huế': 'Thuận An|Phú Vang|Hương Thủy|Hương Trà|Lăng Cô|Chân Mây',
'Khánh Hòa': 'Nha Trang|Cam Ranh|Bãi Dài|Ninh Hòa|Vân Phong|Phan Rang|Ninh Chữ',
'Lâm Đồng': 'Đà Lạt|Bảo Lộc|Đức Trọng|Phan Thiết|Mũi Né|La Gi|Hàm Tân|Gia Nghĩa',
'An Giang': 'Phú Quốc|Rạch Giá|Hà Tiên|Long Xuyên|Châu Đốc',
'Đồng Nai': 'Biên Hòa|Long Thành|Nhơn Trạch|Trảng Bom|Đồng Xoài|Chơn Thành',
'Tây Ninh': 'Tân An|Bến Lức|Đức Hòa|Cần Giuộc|Hòa Thành|Trảng Bàng',
'Gia Lai': 'Quy Nhơn|Nhơn Hội|Pleiku|An Nhơn',
'Đắk Lắk': 'Buôn Ma Thuột|Tuy Hòa|Sông Cầu',
'Quảng Trị': 'Đông Hà|Đồng Hới|Phong Nha',
'Quảng Ngãi': 'TP Quảng Ngãi|Dung Quất|Lý Sơn|TP Kon Tum',
'Bắc Ninh': 'TP Bắc Ninh|Từ Sơn|Yên Phong|Quế Võ|TP Bắc Giang|Việt Yên',
'Hưng Yên': 'Văn Giang|Khu Mẫu F|Văn Lâm|Mỹ Hào|Phố Hiến|TP Thái Bình',
'Ninh Bình': 'Hoa Lư|Tràng An|Tam Cốc|Phủ Lý|TP Nam Định|Kim Bảng',
'Phú Thọ': 'Việt Trì|Vĩnh Yên|Phúc Yên|Tam Đảo|TP Hòa Bình|Lương Sơn',
'Thanh Hóa': 'TP Thanh Hóa|Sầm Sơn|Nghi Sơn',
'Nghệ An': 'Vinh|Cửa Lò',
'Hà Tĩnh': 'TP Hà Tĩnh|Thiên Cầm|Vũng Áng',
'Cần Thơ': 'Ninh Kiều|Cái Răng|Bình Thủy|TP Sóc Trăng|Vị Thanh',
'Vĩnh Long': 'TP Vĩnh Long|TP Bến Tre|TP Trà Vinh',
'Đồng Tháp': 'Cao Lãnh|Sa Đéc|Mỹ Tho|Gò Công',
'Cà Mau': 'TP Cà Mau|TP Bạc Liêu',
'Lào Cai': 'Sa Pa|TP Lào Cai|TP Yên Bái',
'Thái Nguyên': 'TP Thái Nguyên|Phổ Yên|Sông Công|TP Bắc Kạn',
'Tuyên Quang': 'TP Tuyên Quang|TP Hà Giang',
'Lạng Sơn': 'TP Lạng Sơn|Đồng Đăng',
'Sơn La': 'Mộc Châu',
};
export const PLACES = (() => {
const _o6 = [];
const add = (label, tinh, note, extra = []) => _o6.push({ label, tinh_thanh: tinh, ghi_chu: note, keys: [label, ...extra].map(fold) });
for (const p of PROVINCES) add(p.label, p.label, p.city ? 'Thành phố trực thuộc TW' : 'Tỉnh', p.alias || []);
for (const p of PROVINCES) for (const _o5 of p.from) add(_o5, p.label, 'Tỉnh cũ – nhập vào ' + p.label + ' từ 07/2025');
for (const [tinh, list] of Object.entries(_o0)) for (const _o4 of list.split('|')) add(_o4, tinh, 'Tên thường gọi');
return _o6;
})();
export function suggestPlaces(q, { max = 8 } = {}) {
const _o2 = fold(q);
if (!_o2) return [];
const _o7 = (_o3) => _o3.startsWith(_o2) ? 0 : (' ' + _o3).includes(' ' + _o2) ? 1 : _o3.includes(_o2) ? 2 : 9;
const _o1 = [];
PLACES.forEach((p, i) => {
const r = Math.min(...p.keys.map(_o7));
if (r < 9) _o1.push({ p, r, i });
});
_o1.sort((a, b) => a.r - b.r || a.i - b.i);
const _o9 = new Set(); const _o8 = [];
for (const { p } of _o1) {
const _o3 = fold(p.label) + '|' + fold(p.tinh_thanh);
if (_o9.has(_o3)) continue;
_o9.add(_o3); _o8.push({ label: p.label, tinh_thanh: p.tinh_thanh, ghi_chu: p.ghi_chu });
if (_o8.length >= max) break;
}
return _o8;
}

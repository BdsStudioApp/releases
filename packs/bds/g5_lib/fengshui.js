export const LABEL = 'Thông tin tham khảo theo phong thuỷ Bát trạch – không phải căn cứ kỹ thuật, pháp lý hay cam kết.';
export const IMG_LABEL = 'Ảnh minh hoạ – thông tin tham khảo';
const _o7 = (_o0, n) => ((_o0 % n) + n) % n;
export const DIRS = {
N: { vi: 'Bắc', deg: 0 }, NE: { vi: 'Đông Bắc', deg: 45 }, E: { vi: 'Đông', deg: 90 }, SE: { vi: 'Đông Nam', deg: 135 },
S: { vi: 'Nam', deg: 180 }, SW: { vi: 'Tây Nam', deg: 225 }, W: { vi: 'Tây', deg: 270 }, NW: { vi: 'Tây Bắc', deg: 315 },
};
export const DIR_ORDER = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
export const OPPOSITE = { N: 'S', NE: 'SW', E: 'W', SE: 'NW', S: 'N', SW: 'NE', W: 'E', NW: 'SE' };
export const GUA = {
1: { vi: 'Khảm', el: 'Thuỷ', home: 'N', group: 'dong' },
2: { vi: 'Khôn', el: 'Thổ', home: 'SW', group: 'tay' },
3: { vi: 'Chấn', el: 'Mộc', home: 'E', group: 'dong' },
4: { vi: 'Tốn', el: 'Mộc', home: 'SE', group: 'dong' },
6: { vi: 'Càn', el: 'Kim', home: 'NW', group: 'tay' },
7: { vi: 'Đoài', el: 'Kim', home: 'W', group: 'tay' },
8: { vi: 'Cấn', el: 'Thổ', home: 'NE', group: 'tay' },
9: { vi: 'Ly', el: 'Hoả', home: 'S', group: 'dong' },
};
export const GROUP = { dong: 'Đông tứ mệnh', tay: 'Tây tứ mệnh' };
export const HOUSE_GROUP = { dong: 'Đông tứ trạch', tay: 'Tây tứ trạch' };
export const GUA_OF_DIR = { N: 1, SW: 2, E: 3, SE: 4, NW: 6, W: 7, NE: 8, S: 9 };
export const STARS = {
sinhkhi: { vi: 'Sinh khí', good: true, rank: 1, note: 'Tốt nhất: tài lộc, thăng tiến' },
thieny: { vi: 'Thiên y', good: true, rank: 2, note: 'Sức khoẻ, quý nhân' },
diennien: { vi: 'Diên niên', good: true, rank: 3, note: 'Hoà thuận, bền vững các mối quan hệ' },
phucvi: { vi: 'Phục vị', good: true, rank: 4, note: 'Bình yên, vững vàng' },
hoahai: { vi: 'Hoạ hại', good: false, rank: 5, note: 'Thị phi, trắc trở nhỏ' },
lucsat: { vi: 'Lục sát', good: false, rank: 6, note: 'Bất hoà, kiện tụng' },
nguquy: { vi: 'Ngũ quỷ', good: false, rank: 7, note: 'Mất mát, tranh chấp' },
tuyetmenh: { vi: 'Tuyệt mệnh', good: false, rank: 8, note: 'Xấu nhất' },
};
export const STAR_ORDER = ['sinhkhi', 'thieny', 'diennien', 'phucvi', 'hoahai', 'lucsat', 'nguquy', 'tuyetmenh'];
export const TABLE = {
1: ['SE', 'E', 'S', 'N', 'W', 'NW', 'NE', 'SW'],
2: ['NE', 'W', 'NW', 'SW', 'E', 'S', 'SE', 'N'],
3: ['S', 'N', 'SE', 'E', 'SW', 'NE', 'NW', 'W'],
4: ['N', 'S', 'E', 'SE', 'NW', 'W', 'SW', 'NE'],
6: ['W', 'NE', 'SW', 'NW', 'SE', 'N', 'E', 'S'],
7: ['NW', 'SW', 'NE', 'W', 'N', 'SE', 'S', 'E'],
8: ['SW', 'NW', 'W', 'NE', 'S', 'E', 'N', 'SE'],
9: ['E', 'SE', 'N', 'S', 'NE', 'SW', 'W', 'NW'],
};
export const SON24 = ['Nhâm', 'Tý', 'Quý', 'Sửu', 'Cấn', 'Dần', 'Giáp', 'Mão', 'Ất', 'Thìn', 'Tốn', 'Tỵ',
'Bính', 'Ngọ', 'Đinh', 'Mùi', 'Khôn', 'Thân', 'Canh', 'Dậu', 'Tân', 'Tuất', 'Càn', 'Hợi'];
export const CAN = ['Canh', 'Tân', 'Nhâm', 'Quý', 'Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ'];
export const CHI = ['Thân', 'Dậu', 'Tuất', 'Hợi', 'Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi'];
export const canChi = (_of) => CAN[_o7(_of, 10)] + ' ' + CHI[_o7(_of, 12)];
const _ob = (n) => { const _oa = _o7(n, 9); return _oa === 0 ? 9 : _oa; };
export function kua(year, gender) {
const _of = Math.round(Number(year));
if (!Number.isFinite(_of) || _of < 1800 || _of > 2200) return null;
const _o2 = gender === 'female';
let _o5 = _o2 ? _ob(4 + _o7(_of, 9)) : _ob(11 - _o7(_of, 9));
if (_o5 === 5) _o5 = _o2 ? 8 : 2;
return _o5;
}
export function lunarYearOf(ymd, { boundary = '02-04' } = {}) {
const _o6 = String(ymd || '').match(/^(\d{4})-(\d{2})-(\d{2})$/);
if (!_o6) return null;
return (_o6[2] + '-' + _o6[3]) < boundary ? Number(_o6[1]) - 1 : Number(_o6[1]);
}
export const dirOf = (deg) => DIR_ORDER[Math.floor(_o7(Number(deg) + 22.5, 360) / 45)];
export const sonOf = (deg) => SON24[Math.floor(_o7(Number(deg) + 22.5, 360) / 15)];
export const nearBorder = (deg, tol = 3) => { const _oa = _o7(Number(deg) + 22.5, 45); return _oa <= tol || _oa >= 45 - tol; };
export function starMap(_o5) {
const _oc = TABLE[_o5]; if (!_oc) return null;
const _o8 = {};
_oc.forEach((d, i) => { _o8[d] = STAR_ORDER[i]; });
return _o8;
}
export function person({ year, gender }) {
const _o5 = kua(year, gender);
if (!_o5) return null;
const _oc = TABLE[_o5];
const list = _oc.map((d, i) => ({ dir: d, dirVi: DIRS[d].vi, star: STAR_ORDER[i], starVi: STARS[STAR_ORDER[i]].vi, good: STARS[STAR_ORDER[i]].good, note: STARS[STAR_ORDER[i]].note }));
return { year: Number(year), gender, kua: _o5, gua: GUA[_o5].vi, element: GUA[_o5].el, group: GUA[_o5].group, groupVi: GROUP[GUA[_o5].group], canchi: canChi(Number(year)),
good: list.filter((x) => x.good), bad: list.filter((x) => !x.good) };
}
export function house(facingDeg) {
const facing = dirOf(facingDeg), sitting = OPPOSITE[facing], _o5 = GUA_OF_DIR[sitting];
return { facing, facingVi: DIRS[facing].vi, sitting, sittingVi: DIRS[sitting].vi, kua: _o5, gua: GUA[_o5].vi, group: GUA[_o5].group, groupVi: HOUSE_GROUP[GUA[_o5].group],
son: sonOf(facingDeg), border: nearBorder(facingDeg) };
}
export function match({ year, gender, facingDeg, ref = 'cửa chính' }) {
const _o9 = person({ year, gender });
if (!_o9 || !Number.isFinite(Number(facingDeg))) return null;
const _o4 = house(facingDeg);
const _oe = starMap(_o9.kua);
const star = _oe[_o4.facing];
const sameGroup = _o9.group === _o4.group;
const _o3 = STARS[star].good;
const verdict = sameGroup && _o3 ? 'hop' : (_o3 || sameGroup) ? 'tamduoc' : 'khonghop';
const text = {
hop: `Hướng ${_o4.facingVi} (${ref}) là hướng ${STARS[star].vi} của người mệnh ${_o9.gua}; nhà ${_o4.groupVi} cùng nhóm ${_o9.groupVi} – hợp (tham khảo).`,
tamduoc: `Hướng ${_o4.facingVi} (${ref}) ứng sao ${STARS[star].vi} với mệnh ${_o9.gua}; ${sameGroup ? 'cùng' : 'khác'} nhóm – tạm được, có thể bổ cứu bằng bố trí.`,
khonghop: `Hướng ${_o4.facingVi} (${ref}) ứng sao ${STARS[star].vi} – chưa hợp mệnh ${_o9.gua} (${_o9.groupVi}).`,
}[verdict];
return { person: _o9, house: _o4, star, starVi: STARS[star].vi, sameGroup, verdict, text, tips: tipsFor(_o9), ref };
}
export function tipsFor(_o9) {
const _o1 = Object.fromEntries(_o9.good.map((g) => [g.star, g.dirVi]));
return [
`Bàn làm việc: ngồi quay mặt về hướng ${_o1.sinhkhi} (Sinh khí) hoặc ${_o1.phucvi} (Phục vị).`,
`Đầu giường: hướng ${_o1.thieny} (Thiên y) hoặc ${_o1.diennien} (Diên niên).`,
`Bếp: miệng bếp (hướng lưng người nấu) nhìn về một hướng tốt, bếp đặt ở phần nhà ứng hướng xấu – theo cách "toạ hung hướng cát".`,
'Hướng xấu dùng cho WC, kho, cầu thang – không đặt giường, bàn thờ.',
];
}
export function headingFrom(e, { screenAngle = 0, declination = 0 } = {}) {
if (!e) return null;
if (typeof e.webkitCompassHeading === 'number' && Number.isFinite(e.webkitCompassHeading)) {
return { heading: _o7(e.webkitCompassHeading + screenAngle + declination, 360), source: 'ios', accuracy: e.webkitCompassAccuracy };
}
if (e.absolute === true && typeof e.alpha === 'number' && Number.isFinite(e.alpha)) {
return { heading: _o7(360 - e.alpha + screenAngle + declination, 360), source: 'absolute' };
}
return null;
}
export function smoothAngles(list) {
const _o0 = (list || []).filter((x) => Number.isFinite(x));
if (!_o0.length) return null;
const _od = _o0.reduce((t, d) => t + Math.sin(d * Math.PI / 180), 0), c = _o0.reduce((t, d) => t + Math.cos(d * Math.PI / 180), 0);
return _o7(Math.atan2(_od, c) * 180 / Math.PI, 360);
}

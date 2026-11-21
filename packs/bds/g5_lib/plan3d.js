export const ILLU = 'Mặt bằng minh hoạ – không phải mặt bằng của dự án. Nhập kích thước theo layout chính thức của chủ đầu tư.';
export const WALL_H = 2.7, RAIL_H = 1.1, DOOR_W = 0.9, GLASS_W = 2.4, WALL_T = 0.12;
export const KINDS = {
sanh: { vi: 'Sảnh vào', color: '#D9CBB0', hub: true },
khach: { vi: 'Phòng khách', color: '#E8D9B8', hub: true },
bep: { vi: 'Bếp + ăn', color: '#E3E0D6' },
ngu: { vi: 'Phòng ngủ', color: '#D7E1E8' },
wc: { vi: 'Vệ sinh', color: '#CFE3E6' },
bancong: { vi: 'Ban công / lô gia', color: '#D6E6CF', outdoor: true },
hanhlang: { vi: 'Hành lang', color: '#DCD3C2', hub: true },
lamviec: { vi: 'Phòng làm việc', color: '#E4DCEB' },
};
export const TEMPLATES = [
{ id: 'mau1pn', vi: 'Căn 1 phòng ngủ (~51 m² + lô gia) – minh hoạ', entry: { room: 'sanh', side: 'left' }, rooms: [
{ id: 'wc', kind: 'wc', name: 'Vệ sinh', x: 0, y: 0, w: 1.8, d: 1.6 },
{ id: 'sanh', kind: 'sanh', name: 'Sảnh vào', x: 0, y: 1.6, w: 1.8, d: 1.6 },
{ id: 'bep', kind: 'bep', name: 'Bếp + ăn', x: 1.8, y: 0, w: 2.6, d: 3.2 },
{ id: 'ngu1', kind: 'ngu', name: 'Phòng ngủ', x: 4.4, y: 0, w: 3.6, d: 3.2 },
{ id: 'khach', kind: 'khach', name: 'Phòng khách', x: 0, y: 3.2, w: 8.0, d: 3.2 },
{ id: 'bc', kind: 'bancong', name: 'Lô gia', x: 0, y: 6.4, w: 8.0, d: 1.2 },
], links: [['sanh', 'khach'], ['sanh', 'wc'], ['bep', 'khach'], ['ngu1', 'khach'], ['khach', 'bc']] },
{ id: 'mau2pn', vi: 'Căn 2 phòng ngủ (~66 m² + lô gia) – minh hoạ', entry: { room: 'hl', side: 'top' }, rooms: [
{ id: 'hl', kind: 'hanhlang', name: 'Hành lang', x: 3.0, y: 0, w: 1.4, d: 3.4 },
{ id: 'ngu2', kind: 'ngu', name: 'Phòng ngủ 2', x: 0, y: 0, w: 3.0, d: 3.4 },
{ id: 'wc1', kind: 'wc', name: 'Vệ sinh chung', x: 4.4, y: 0, w: 1.8, d: 2.0 },
{ id: 'bep', kind: 'bep', name: 'Bếp + ăn', x: 6.2, y: 0, w: 3.0, d: 3.4 },
{ id: 'kho', kind: 'wc', name: 'Vệ sinh master', x: 4.4, y: 2.0, w: 1.8, d: 1.4 },
{ id: 'ngu1', kind: 'ngu', name: 'Phòng ngủ master', x: 0, y: 3.4, w: 3.0, d: 3.8 },
{ id: 'khach', kind: 'khach', name: 'Phòng khách', x: 3.0, y: 3.4, w: 6.2, d: 3.8 },
{ id: 'bc', kind: 'bancong', name: 'Lô gia', x: 3.0, y: 7.2, w: 6.2, d: 1.2 },
], links: [['hl', 'ngu2'], ['hl', 'wc1'], ['hl', 'khach'], ['bep', 'khach'], ['ngu1', 'khach'], ['kho', 'khach'], ['khach', 'bc']] },
{ id: 'mau3pn', vi: 'Căn 3 phòng ngủ (~92 m² + lô gia) – minh hoạ', entry: { room: 'sanh', side: 'top' }, rooms: [
{ id: 'ngu3', kind: 'ngu', name: 'Phòng ngủ 3', x: 0, y: 0, w: 3.2, d: 3.4 },
{ id: 'sanh', kind: 'sanh', name: 'Sảnh vào', x: 3.2, y: 0, w: 1.8, d: 3.4 },
{ id: 'wc1', kind: 'wc', name: 'Vệ sinh chung', x: 5.0, y: 0, w: 2.0, d: 2.2 },
{ id: 'bep', kind: 'bep', name: 'Bếp + ăn', x: 7.0, y: 0, w: 3.6, d: 3.4 },
{ id: 'hl', kind: 'hanhlang', name: 'Hành lang', x: 5.0, y: 2.2, w: 2.0, d: 1.2 },
{ id: 'ngu2', kind: 'ngu', name: 'Phòng ngủ 2', x: 0, y: 3.4, w: 3.2, d: 3.4 },
{ id: 'khach', kind: 'khach', name: 'Phòng khách', x: 3.2, y: 3.4, w: 7.4, d: 3.8 },
{ id: 'ngu1', kind: 'ngu', name: 'Phòng ngủ master', x: 0, y: 6.8, w: 3.2, d: 3.6 },
{ id: 'wc2', kind: 'wc', name: 'Vệ sinh master', x: 3.2, y: 7.2, w: 1.8, d: 3.2 },
{ id: 'bc', kind: 'bancong', name: 'Lô gia', x: 5.0, y: 7.2, w: 5.6, d: 1.4 },
], links: [['sanh', 'khach'], ['sanh', 'ngu3'], ['sanh', 'wc1'], ['hl', 'khach'], ['hl', 'wc1'], ['bep', 'khach'], ['ngu2', 'khach'], ['ngu1', 'ngu2'], ['ngu1', 'wc2'], ['khach', 'bc']] },
];
const _ow = (n) => Math.round(n * 100) / 100;
const _ok = (n) => _ow(n).toFixed(2);
export function cleanRooms(rooms) {
return (rooms || []).map((_ov, _og) => ({
id: String(_ov.id || 'p' + (_og + 1)).replace(/[^a-z0-9_]/gi, '').slice(0, 20) || 'p' + (_og + 1),
kind: KINDS[_ov.kind] ? _ov.kind : 'khach', name: String(_ov.name || (KINDS[_ov.kind] || KINDS.khach).vi).slice(0, 40),
x: _ow(Number(_ov.x) || 0), y: _ow(Number(_ov.y) || 0), w: _ow(Math.max(0.5, Math.min(30, Number(_ov.w) || 0))), d: _ow(Math.max(0.5, Math.min(30, Number(_ov.d) || 0))),
}));
}
export function bounds(rooms) {
if (!rooms.length) return { x: 0, y: 0, w: 0, d: 0 };
const _o10 = Math.min(...rooms.map((_ov) => _ov.x)), y0 = Math.min(...rooms.map((_ov) => _ov.y));
const x1 = Math.max(...rooms.map((_ov) => _ov.x + _ov.w)), y1 = Math.max(...rooms.map((_ov) => _ov.y + _ov.d));
return { x: _o10, y: y0, w: x1 - _o10, d: y1 - y0 };
}
export function areas(rooms) {
const indoor = rooms.filter((_ov) => !(KINDS[_ov.kind] || {}).outdoor).reduce((t, _ov) => t + _ov.w * _ov.d, 0);
const outdoor = rooms.filter((_ov) => (KINDS[_ov.kind] || {}).outdoor).reduce((t, _ov) => t + _ov.w * _ov.d, 0);
return { indoor: _ow(indoor), outdoor: _ow(outdoor), total: _ow(indoor + outdoor), bedrooms: rooms.filter((_ov) => _ov.kind === 'ngu').length, baths: rooms.filter((_ov) => _ov.kind === 'wc').length };
}
export function validate(rooms) {
const _oa = [];
const ids = new Set();
rooms.forEach((_ov) => { if (ids.has(_ov.id)) _oa.push('Trùng mã phòng "' + _ov.id + '"'); ids.add(_ov.id); });
for (let _og = 0; _og < rooms.length; _og++) for (let _oi = _og + 1; _oi < rooms.length; _oi++) {
const a = rooms[_og], b = rooms[_oi];
const _oq = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), oy = Math.min(a.y + a.d, b.y + b.d) - Math.max(a.y, b.y);
if (_oq > 0.05 && oy > 0.05) _oa.push(`"${a.name}" chồng lên "${b.name}"`);
}
return _oa;
}
function _o8(_ov) {
return [
{ o: 'h', c: _ov.y, a: _ov.x, b: _ov.x + _ov.w, side: 'top' }, { o: 'h', c: _ov.y + _ov.d, a: _ov.x, b: _ov.x + _ov.w, side: 'bottom' },
{ o: 'v', c: _ov.x, a: _ov.y, b: _ov.y + _ov.d, side: 'left' }, { o: 'v', c: _ov.x + _ov.w, a: _ov.y, b: _ov.y + _ov.d, side: 'right' },
];
}
export function autoLinks(rooms) {
const _oy = _oz(rooms);
const _o1 = (a, b) => _oy.some((_or) => _or.rooms.includes(a) && _or.rooms.includes(b));
const _op = [];
const _of = rooms.filter((_ov) => (KINDS[_ov.kind] || {}).hub);
for (const _ov of rooms) {
if ((KINDS[_ov.kind] || {}).hub && _ov.kind !== 'khach') { const _oj = rooms.find((x) => x.kind === 'khach' && _o1(x.id, _ov.id)); if (_oj) _op.push([_ov.id, _oj.id]); continue; }
if (_ov.kind === 'khach') continue;
const hub = _of.find((x) => _o1(x.id, _ov.id)) || rooms.find((x) => x.id !== _ov.id && _o1(x.id, _ov.id));
if (hub) _op.push([_ov.id, hub.id]);
}
return _o7(_op);
}
const _o7 = (links) => { const s = new Set(); return links.filter(([a, b]) => { const _oj = [a, b].sort().join('|'); if (s.has(_oj)) return false; s.add(_oj); return true; }); };
function _oz(rooms) {
const _ol = new Map();
for (const _ov of rooms) for (const e of _o8(_ov)) {
const _oj = e.o + _ok(e.c);
if (!_ol.has(_oj)) _ol.set(_oj, { o: e.o, c: _ow(e.c), segs: [] });
_ol.get(_oj).segs.push({ a: _ow(e.a), b: _ow(e.b), room: _ov.id, side: e.side });
}
const _os = [];
for (const _om of _ol.values()) {
const _ou = [...new Set(_om.segs.flatMap((s) => [s.a, s.b]))].sort((x, y) => x - y);
let _o5 = null;
for (let _og = 0; _og < _ou.length - 1; _og++) {
const a = _ou[_og], b = _ou[_og + 1], _on = (a + b) / 2;
const _o4 = _om.segs.filter((s) => s.a <= _on && s.b >= _on);
const ids = _o4.map((s) => s.room).sort();
const sig = ids.join('|');
if (_o5 && _o5.sig === sig && Math.abs(_o5.b - a) < 1e-6) _o5.b = b;
else { if (_o5) _os.push(_o5); _o5 = ids.length ? { o: _om.o, c: _om.c, a, b, sig, rooms: ids, sides: _o4.map((s) => ({ room: s.room, side: s.side })) } : null; }
}
if (_o5) _os.push(_o5);
}
return _os;
}
export function buildWalls(plan) {
const rooms = plan.rooms;
const byId = Object.fromEntries(rooms.map((_ov) => [_ov.id, _ov]));
const links = _o7((plan.links && plan.links.length ? plan.links : autoLinks(rooms)).filter(([a, b]) => byId[a] && byId[b]));
const _os = _oz(rooms);
const doors = [];
const _o6 = new Map();
const outdoor = (id) => !!(KINDS[(byId[id] || {}).kind] || {}).outdoor;
for (const [a, b] of links) {
const _o3 = _os.filter((_or) => _or.rooms.length === 2 && _or.rooms.includes(a) && _or.rooms.includes(b)).sort((_or, q) => (q.b - q.a) - (_or.b - _or.a))[0];
if (!_o3) continue;
const L = _o3.b - _o3.a;
const _od = outdoor(a) || outdoor(b);
const w = _od ? Math.min(GLASS_W, Math.max(0, L - 0.4)) : Math.min(DOOR_W, L - 0.2);
if (!(w >= 0.6)) continue;
const _on = _od ? (_o3.a + _o3.b) / 2 : Math.min(_o3.b - w / 2 - 0.15, _o3.a + 0.15 + w / 2 + 0.3);
const from = _on - w / 2, to = _on + w / 2;
if (!_o6.has(_o3)) _o6.set(_o3, []);
_o6.get(_o3).push({ from, to });
doors.push({ ...pointOn(_o3, _on), w: _ow(w), o: _o3.o, between: [a, b], kind: _od ? 'glass' : 'door' });
}
if (plan.entry && byId[plan.entry.room]) {
const _o3 = _os.find((_or) => _or.rooms.length === 1 && _or.rooms[0] === plan.entry.room && _or.sides[0].side === plan.entry.side);
if (_o3 && _o3.b - _o3.a >= 1.1) {
const _on = (_o3.a + _o3.b) / 2, w = 1.0;
if (!_o6.has(_o3)) _o6.set(_o3, []);
_o6.get(_o3).push({ from: _on - w / 2, to: _on + w / 2 });
doors.push({ ...pointOn(_o3, _on), w, o: _o3.o, between: [plan.entry.room], kind: 'entry' });
}
}
const walls = [];
for (const _or of _os) {
const _oh = _or.rooms.length === 1 && outdoor(_or.rooms[0]);
const _oc = (_o6.get(_or) || []).sort((x, y) => x.from - y.from);
let s = _or.a;
for (const _ob of _oc) { if (_ob.from - s > 0.01) walls.push(seg(_or, s, _ob.from, _oh)); s = _ob.to; }
if (_or.b - s > 0.01) walls.push(seg(_or, s, _or.b, _oh));
}
return { walls, doors, links };
}
const pointOn = (_or, t) => (_or.o === 'h' ? { x: _ow(t), y: _or.c } : { x: _or.c, y: _ow(t) });
const seg = (_or, a, b, rail) => (_or.o === 'h'
? { x1: _ow(a), y1: _or.c, x2: _ow(b), y2: _or.c, h: rail ? RAIL_H : WALL_H, kind: rail ? 'rail' : 'wall' }
: { x1: _or.c, y1: _ow(a), x2: _or.c, y2: _ow(b), h: rail ? RAIL_H : WALL_H, kind: rail ? 'rail' : 'wall' });
export function furniture(room) {
const { x, y, w, d } = room, _op = [];
const add = (fx, fy, fw, fd, h, color, label) => { if (fw > 0.2 && fd > 0.2 && fx >= x - 1e-6 && fy >= y - 1e-6 && fx + fw <= x + w + 1e-6 && fy + fd <= y + d + 1e-6) _op.push({ x: _ow(fx), y: _ow(fy), w: _ow(fw), d: _ow(fd), h, color, label, room: room.id }); };
if (room.kind === 'ngu') {
const bw = Math.min(1.8, w - 0.9), bd = Math.min(2.0, d - 0.8);
add(x + (w - bw) / 2, y + 0.1, bw, bd, 0.5, '#B9A27A', 'Giường');
if (d - bd > 1.2 && w > 1.2) add(x + 0.1, y + d - 0.65, Math.min(2.4, w - 0.2), 0.55, 2.2, '#8E7A5C', 'Tủ quần áo');
} else if (room.kind === 'khach') {
const sw = Math.min(2.4, w * 0.5);
add(x + (w - sw) / 2, y + d - 1.05, sw, 0.9, 0.8, '#7F8C9D', 'Sofa');
add(x + (w - 1.0) / 2, y + d - 2.0, 1.0, 0.6, 0.4, '#A88E62', 'Bàn trà');
add(x + (w - Math.min(2.0, w * 0.45)) / 2, y + 0.1, Math.min(2.0, w * 0.45), 0.4, 0.5, '#5E5446', 'Kệ TV');
} else if (room.kind === 'bep') {
add(x + 0.05, y + 0.05, Math.min(w - 0.1, 3.2), 0.6, 0.9, '#C8C2B4', 'Tủ bếp');
if (d > 2.4) add(x + (w - Math.min(1.4, w - 0.6)) / 2, y + d - 1.3, Math.min(1.4, w - 0.6), 0.8, 0.75, '#9C7F55', 'Bàn ăn');
} else if (room.kind === 'wc') {
add(x + 0.1, y + 0.1, 0.45, 0.7, 0.45, '#F2F2F2', 'Bồn cầu');
add(x + w - 0.75, y + 0.1, 0.65, 0.45, 0.85, '#E6E6E6', 'Lavabo');
} else if (room.kind === 'bancong') {
add(x + 0.2, y + 0.2, 0.4, 0.4, 0.7, '#5E8C5A', 'Cây');
add(x + w - 0.6, y + 0.2, 0.4, 0.4, 0.7, '#5E8C5A', 'Cây');
} else if (room.kind === 'lamviec') {
add(x + 0.1, y + 0.1, Math.min(1.4, w - 0.2), 0.7, 0.75, '#9C7F55', 'Bàn làm việc');
}
return _op;
}
const center = (_ov) => ({ x: _ow(_ov.x + _ov.w / 2), y: _ow(_ov.y + _ov.d / 2) });
const _o0 = {
sanh: 'Bước vào là sảnh nhỏ, có chỗ để giày dép gọn gàng.',
hanhlang: 'Hành lang ngắn nối các phòng, không lãng phí diện tích.',
khach: 'Phòng khách rộng, đón ánh sáng tự nhiên từ lô gia.',
bep: 'Bếp và bàn ăn liền nhau, tiện nấu nướng cho cả nhà.',
ngu: 'Phòng ngủ yên tĩnh, đủ chỗ cho giường đôi và tủ quần áo.',
wc: 'Phòng vệ sinh bố trí khô ướt hợp lý.',
bancong: 'Ra lô gia ngắm cảnh, đón gió.',
lamviec: 'Góc làm việc riêng, tập trung.',
};
export function walkPath(plan) {
const rooms = plan.rooms;
if (!rooms.length) return [];
const { doors } = buildWalls(plan);
const byId = Object.fromEntries(rooms.map((_ov) => [_ov.id, _ov]));
const _oe = {};
rooms.forEach((_ov) => { _oe[_ov.id] = []; });
doors.filter((d) => d.between.length === 2).forEach((d) => { _oe[d.between[0]].push({ to: d.between[1], door: d }); _oe[d.between[1]].push({ to: d.between[0], door: d }); });
const start = (plan.entry && byId[plan.entry.room]) ? plan.entry.room : (rooms.find((_ov) => _ov.kind === 'sanh') || rooms.find((_ov) => _ov.kind === 'khach') || rooms[0]).id;
const _ox = { sanh: 0, hanhlang: 1, khach: 2, bep: 3, ngu: 4, lamviec: 5, wc: 7, bancong: 8 };
const _oo = rooms.filter((_ov) => _ov.kind !== 'wc' && _ov.kind !== 'hanhlang' && _ov.id !== start)
.sort((a, b) => (_ox[a.kind] ?? 6) - (_ox[b.kind] ?? 6) || (/master/i.test(b.name) - /master/i.test(a.name)) || a.id.localeCompare(b.id));
const _o2 = (from, to) => {
const _ot = { [from]: null }, q = [from];
while (q.length) { const c = q.shift(); if (c === to) break; for (const e of _oe[c]) if (!(e.to in _ot)) { _ot[e.to] = { from: c, door: e.door }; q.push(e.to); } }
if (!(to in _ot)) return null;
const steps = []; let c = to;
while (_ot[c]) { steps.unshift({ room: c, door: _ot[c].door }); c = _ot[c].from; }
return steps;
};
const _op = [];
const stop = (id) => { const _ov = byId[id]; _op.push({ ...center(_ov), room: id, name: _ov.name, say: _o0[_ov.kind] || '', stop: true }); };
let _o5 = start;
const _o9 = doors.find((d) => d.kind === 'entry');
if (_o9) _op.push({ x: _o9.x, y: _o9.y, room: start, name: 'Cửa vào', say: 'Chào anh chị, mời anh chị vào xem căn hộ.', stop: true });
stop(start);
for (const _ov of _oo) {
const steps = _o2(_o5, _ov.id);
if (!steps) continue;
for (const s of steps) {
_op.push({ x: s.door.x, y: s.door.y, room: s.room, name: '', say: '', stop: false });
if (s.room === _ov.id) stop(_ov.id); else _op.push({ ...center(byId[s.room]), room: s.room, name: '', say: '', stop: false });
}
_o5 = _ov.id;
}
return _op;
}
export function towerBoxes(towers, floorH = 3.2) {
return (towers || []).map((t, _og) => ({
name: String(t.name || 'Toà ' + (_og + 1)), floors: Math.max(1, Math.min(100, Math.round(Number(t.floors) || 1))),
x: Number(t.x) || _og * 50, y: Number(t.y) || 0, w: Math.max(10, Number(t.w) || 30), d: Math.max(10, Number(t.d) || 25),
h: Math.max(1, Math.min(100, Math.round(Number(t.floors) || 1))) * floorH,
}));
}

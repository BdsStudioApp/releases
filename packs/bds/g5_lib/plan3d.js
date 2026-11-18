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
const _ox = (n) => Math.round(n * 100) / 100;
const _ol = (n) => _ox(n).toFixed(2);
export function cleanRooms(rooms) {
return (rooms || []).map((_ow, _oh) => ({
id: String(_ow.id || 'p' + (_oh + 1)).replace(/[^a-z0-9_]/gi, '').slice(0, 20) || 'p' + (_oh + 1),
kind: KINDS[_ow.kind] ? _ow.kind : 'khach', name: String(_ow.name || (KINDS[_ow.kind] || KINDS.khach).vi).slice(0, 40),
x: _ox(Number(_ow.x) || 0), y: _ox(Number(_ow.y) || 0), w: _ox(Math.max(0.5, Math.min(30, Number(_ow.w) || 0))), d: _ox(Math.max(0.5, Math.min(30, Number(_ow.d) || 0))),
}));
}
export function bounds(rooms) {
if (!rooms.length) return { x: 0, y: 0, w: 0, d: 0 };
const _o12 = Math.min(...rooms.map((_ow) => _ow.x)), y0 = Math.min(...rooms.map((_ow) => _ow.y));
const x1 = Math.max(...rooms.map((_ow) => _ow.x + _ow.w)), y1 = Math.max(...rooms.map((_ow) => _ow.y + _ow.d));
return { x: _o12, y: y0, w: x1 - _o12, d: y1 - y0 };
}
export function areas(rooms) {
const indoor = rooms.filter((_ow) => !(KINDS[_ow.kind] || {}).outdoor).reduce((t, _ow) => t + _ow.w * _ow.d, 0);
const outdoor = rooms.filter((_ow) => (KINDS[_ow.kind] || {}).outdoor).reduce((t, _ow) => t + _ow.w * _ow.d, 0);
return { indoor: _ox(indoor), outdoor: _ox(outdoor), total: _ox(indoor + outdoor), bedrooms: rooms.filter((_ow) => _ow.kind === 'ngu').length, baths: rooms.filter((_ow) => _ow.kind === 'wc').length };
}
export function validate(rooms) {
const _ob = [];
const ids = new Set();
rooms.forEach((_ow) => { if (ids.has(_ow.id)) _ob.push('Trùng mã phòng "' + _ow.id + '"'); ids.add(_ow.id); });
for (let _oh = 0; _oh < rooms.length; _oh++) for (let _oj = _oh + 1; _oj < rooms.length; _oj++) {
const a = rooms[_oh], b = rooms[_oj];
const _or = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), oy = Math.min(a.y + a.d, b.y + b.d) - Math.max(a.y, b.y);
if (_or > 0.05 && oy > 0.05) _ob.push(`"${a.name}" chồng lên "${b.name}"`);
}
return _ob;
}
function _o9(_ow) {
return [
{ o: 'h', c: _ow.y, a: _ow.x, b: _ow.x + _ow.w, side: 'top' }, { o: 'h', c: _ow.y + _ow.d, a: _ow.x, b: _ow.x + _ow.w, side: 'bottom' },
{ o: 'v', c: _ow.x, a: _ow.y, b: _ow.y + _ow.d, side: 'left' }, { o: 'v', c: _ow.x + _ow.w, a: _ow.y, b: _ow.y + _ow.d, side: 'right' },
];
}
export function autoLinks(rooms) {
const _o10 = _o11(rooms);
const _o1 = (a, b) => _o10.some((_os) => _os.rooms.includes(a) && _os.rooms.includes(b));
const _oq = [];
const _og = rooms.filter((_ow) => (KINDS[_ow.kind] || {}).hub);
for (const _ow of rooms) {
if ((KINDS[_ow.kind] || {}).hub && _ow.kind !== 'khach') { const _ok = rooms.find((x) => x.kind === 'khach' && _o1(x.id, _ow.id)); if (_ok) _oq.push([_ow.id, _ok.id]); continue; }
if (_ow.kind === 'khach') continue;
const hub = _og.find((x) => _o1(x.id, _ow.id)) || rooms.find((x) => x.id !== _ow.id && _o1(x.id, _ow.id));
if (hub) _oq.push([_ow.id, hub.id]);
}
return _o8(_oq);
}
const _o8 = (links) => { const s = new Set(); return links.filter(([a, b]) => { const _ok = [a, b].sort().join('|'); if (s.has(_ok)) return false; s.add(_ok); return true; }); };
function _o11(rooms) {
const _om = new Map();
for (const _ow of rooms) for (const e of _o9(_ow)) {
const _ok = e.o + _ol(e.c);
if (!_om.has(_ok)) _om.set(_ok, { o: e.o, c: _ox(e.c), segs: [] });
_om.get(_ok).segs.push({ a: _ox(e.a), b: _ox(e.b), room: _ow.id, side: e.side });
}
const _ot = [];
for (const _on of _om.values()) {
const _ov = [...new Set(_on.segs.flatMap((s) => [s.a, s.b]))].sort((x, y) => x - y);
let _o6 = null;
for (let _oh = 0; _oh < _ov.length - 1; _oh++) {
const a = _ov[_oh], b = _ov[_oh + 1], _oo = (a + b) / 2;
const _o5 = _on.segs.filter((s) => s.a <= _oo && s.b >= _oo);
const ids = _o5.map((s) => s.room).sort();
const sig = ids.join('|');
if (_o6 && _o6.sig === sig && Math.abs(_o6.b - a) < 1e-6) _o6.b = b;
else { if (_o6) _ot.push(_o6); _o6 = ids.length ? { o: _on.o, c: _on.c, a, b, sig, rooms: ids, sides: _o5.map((s) => ({ room: s.room, side: s.side })) } : null; }
}
if (_o6) _ot.push(_o6);
}
return _ot;
}
export function buildWalls(plan) {
const rooms = plan.rooms;
const _o3 = Object.fromEntries(rooms.map((_ow) => [_ow.id, _ow]));
const links = _o8((plan.links && plan.links.length ? plan.links : autoLinks(rooms)).filter(([a, b]) => _o3[a] && _o3[b]));
const _ot = _o11(rooms);
const doors = [];
const _o7 = new Map();
const outdoor = (id) => !!(KINDS[(_o3[id] || {}).kind] || {}).outdoor;
for (const [a, b] of links) {
const _o4 = _ot.filter((_os) => _os.rooms.length === 2 && _os.rooms.includes(a) && _os.rooms.includes(b)).sort((_os, q) => (q.b - q.a) - (_os.b - _os.a))[0];
if (!_o4) continue;
const L = _o4.b - _o4.a;
const _oe = outdoor(a) || outdoor(b);
const w = _oe ? Math.min(GLASS_W, Math.max(0, L - 0.4)) : Math.min(DOOR_W, L - 0.2);
if (!(w >= 0.6)) continue;
const _oo = _oe ? (_o4.a + _o4.b) / 2 : Math.min(_o4.b - w / 2 - 0.15, _o4.a + 0.15 + w / 2 + 0.3);
const from = _oo - w / 2, to = _oo + w / 2;
if (!_o7.has(_o4)) _o7.set(_o4, []);
_o7.get(_o4).push({ from, to });
doors.push({ ...pointOn(_o4, _oo), w: _ox(w), o: _o4.o, between: [a, b], kind: _oe ? 'glass' : 'door' });
}
if (plan.entry && _o3[plan.entry.room]) {
const _o4 = _ot.find((_os) => _os.rooms.length === 1 && _os.rooms[0] === plan.entry.room && _os.sides[0].side === plan.entry.side);
if (_o4 && _o4.b - _o4.a >= 1.1) {
const _oo = (_o4.a + _o4.b) / 2, w = 1.0;
if (!_o7.has(_o4)) _o7.set(_o4, []);
_o7.get(_o4).push({ from: _oo - w / 2, to: _oo + w / 2 });
doors.push({ ...pointOn(_o4, _oo), w, o: _o4.o, between: [plan.entry.room], kind: 'entry' });
}
}
const walls = [];
for (const _os of _ot) {
const _oi = _os.rooms.length === 1 && outdoor(_os.rooms[0]);
const _od = (_o7.get(_os) || []).sort((x, y) => x.from - y.from);
let s = _os.a;
for (const _oc of _od) { if (_oc.from - s > 0.01) walls.push(_oz(_os, s, _oc.from, _oi)); s = _oc.to; }
if (_os.b - s > 0.01) walls.push(_oz(_os, s, _os.b, _oi));
}
return { walls, doors, links };
}
const pointOn = (_os, t) => (_os.o === 'h' ? { x: _ox(t), y: _os.c } : { x: _os.c, y: _ox(t) });
const _oz = (_os, a, b, rail) => (_os.o === 'h'
? { x1: _ox(a), y1: _os.c, x2: _ox(b), y2: _os.c, h: rail ? RAIL_H : WALL_H, kind: rail ? 'rail' : 'wall' }
: { x1: _os.c, y1: _ox(a), x2: _os.c, y2: _ox(b), h: rail ? RAIL_H : WALL_H, kind: rail ? 'rail' : 'wall' });
export function furniture(room) {
const { x, y, w, d } = room, _oq = [];
const add = (fx, fy, fw, fd, h, color, label) => { if (fw > 0.2 && fd > 0.2 && fx >= x - 1e-6 && fy >= y - 1e-6 && fx + fw <= x + w + 1e-6 && fy + fd <= y + d + 1e-6) _oq.push({ x: _ox(fx), y: _ox(fy), w: _ox(fw), d: _ox(fd), h, color, label, room: room.id }); };
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
return _oq;
}
const center = (_ow) => ({ x: _ox(_ow.x + _ow.w / 2), y: _ox(_ow.y + _ow.d / 2) });
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
const _o3 = Object.fromEntries(rooms.map((_ow) => [_ow.id, _ow]));
const _of = {};
rooms.forEach((_ow) => { _of[_ow.id] = []; });
doors.filter((d) => d.between.length === 2).forEach((d) => { _of[d.between[0]].push({ to: d.between[1], door: d }); _of[d.between[1]].push({ to: d.between[0], door: d }); });
const start = (plan.entry && _o3[plan.entry.room]) ? plan.entry.room : (rooms.find((_ow) => _ow.kind === 'sanh') || rooms.find((_ow) => _ow.kind === 'khach') || rooms[0]).id;
const _oy = { sanh: 0, hanhlang: 1, khach: 2, bep: 3, ngu: 4, lamviec: 5, wc: 7, bancong: 8 };
const _op = rooms.filter((_ow) => _ow.kind !== 'wc' && _ow.kind !== 'hanhlang' && _ow.id !== start)
.sort((a, b) => (_oy[a.kind] ?? 6) - (_oy[b.kind] ?? 6) || (/master/i.test(b.name) - /master/i.test(a.name)) || a.id.localeCompare(b.id));
const _o2 = (from, to) => {
const _ou = { [from]: null }, q = [from];
while (q.length) { const c = q.shift(); if (c === to) break; for (const e of _of[c]) if (!(e.to in _ou)) { _ou[e.to] = { from: c, door: e.door }; q.push(e.to); } }
if (!(to in _ou)) return null;
const steps = []; let c = to;
while (_ou[c]) { steps.unshift({ room: c, door: _ou[c].door }); c = _ou[c].from; }
return steps;
};
const _oq = [];
const stop = (id) => { const _ow = _o3[id]; _oq.push({ ...center(_ow), room: id, name: _ow.name, say: _o0[_ow.kind] || '', stop: true }); };
let _o6 = start;
const _oa = doors.find((d) => d.kind === 'entry');
if (_oa) _oq.push({ x: _oa.x, y: _oa.y, room: start, name: 'Cửa vào', say: 'Chào anh chị, mời anh chị vào xem căn hộ.', stop: true });
stop(start);
for (const _ow of _op) {
const steps = _o2(_o6, _ow.id);
if (!steps) continue;
for (const s of steps) {
_oq.push({ x: s.door.x, y: s.door.y, room: s.room, name: '', say: '', stop: false });
if (s.room === _ow.id) stop(_ow.id); else _oq.push({ ...center(_o3[s.room]), room: s.room, name: '', say: '', stop: false });
}
_o6 = _ow.id;
}
return _oq;
}
export function towerBoxes(towers, floorH = 3.2) {
return (towers || []).map((t, _oh) => ({
name: String(t.name || 'Toà ' + (_oh + 1)), floors: Math.max(1, Math.min(100, Math.round(Number(t.floors) || 1))),
x: Number(t.x) || _oh * 50, y: Number(t.y) || 0, w: Math.max(10, Number(t.w) || 30), d: Math.max(10, Number(t.d) || 25),
h: Math.max(1, Math.min(100, Math.round(Number(t.floors) || 1))) * floorH,
}));
}

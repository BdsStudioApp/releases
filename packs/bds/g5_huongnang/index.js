import { g5, h, selftestWith } from '../g5_lib/ui.js';
import * as S from '../g5_lib/sun.js';
import { parseLatLng } from '../g5_lib/geo.js';
const KIND = 'g5_nang';
const _o1 = 'http://www.w3.org/2000/svg';
const _ov = (tag, attrs = {}, ...kids) => { const e = document.createElementNS(_o1, tag); for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v); kids.forEach((k) => k && e.appendChild(typeof k === 'string' ? document.createTextNode(k) : k)); return e; };
const _oy = () => { const d = new Date(Date.now() + 7 * 3600000); return d.toISOString().slice(0, 10); };
const vn = (n, d = 1) => Number(n).toFixed(d).replace('.', ',');
export function sketch({ path, now, facing, obstacle }) {
const R = 130, C = 160;
const _ok = (alt, az, r = R) => { const _on = r * (90 - Math.max(0, alt)) / 90, a = (az - 90) * Math.PI / 180; return [C + _on * Math.cos(a), C + _on * Math.sin(a)]; };
const _ow = _ov('svg', { viewBox: '0 0 320 320', class: 'g5-sunsvg', role: 'img', 'aria-label': 'Phác hoạ đường đi mặt trời và hướng căn', 'data-testid': 'sun-sketch' });
_ow.appendChild(_ov('circle', { cx: C, cy: C, r: R, fill: '#FBF8F1', stroke: '#C9A24A', 'stroke-width': 1.5 }));
[30, 60].forEach((alt) => _ow.appendChild(_ov('circle', { cx: C, cy: C, r: R * (90 - alt) / 90, fill: 'none', stroke: 'rgba(15,30,51,.12)' })));
[['B', 0], ['Đ', 90], ['N', 180], ['T', 270]].forEach(([t, az]) => { const [x, y] = _ok(-8, az, R + 14); _ow.appendChild(_ov('text', { x, y: y + 4, 'font-size': 13, 'font-weight': 700, 'text-anchor': 'middle', fill: t === 'B' ? '#B4423A' : '#0F1E33' }, t)); });
const _o9 = (facing - 90) * Math.PI / 180, pa = _o9 + Math.PI / 2;
_ow.appendChild(_ov('line', { x1: C - 40 * Math.cos(pa), y1: C - 40 * Math.sin(pa), x2: C + 40 * Math.cos(pa), y2: C + 40 * Math.sin(pa), stroke: '#0F1E33', 'stroke-width': 5 }));
_ow.appendChild(_ov('line', { x1: C, y1: C, x2: C + 55 * Math.cos(_o9), y2: C + 55 * Math.sin(_o9), stroke: '#0F1E33', 'stroke-width': 2, 'marker-end': 'url(#g5arr)' }));
_ow.appendChild(_ov('defs', {}, _ov('marker', { id: 'g5arr', markerWidth: 8, markerHeight: 8, refX: 6, refY: 4, orient: 'auto' }, _ov('path', { d: 'M0,0 L8,4 L0,8 Z', fill: '#0F1E33' }))));
if (obstacle && obstacle.dist > 0 && obstacle.height > 0) {
const _od = Math.atan2((obstacle.width || 30) / 2, obstacle.dist) * 180 / Math.PI, top = Math.atan2(obstacle.height, obstacle.dist) * 180 / Math.PI;
const _o2 = _ok(0, obstacle.dir - _od), a2 = _ok(0, obstacle.dir + _od), b1 = _ok(top, obstacle.dir - _od), b2 = _ok(top, obstacle.dir + _od);
_ow.appendChild(_ov('path', { d: `M${_o2} L${b1} L${b2} L${a2} Z`, fill: 'rgba(95,105,121,.35)', stroke: '#5F6979' }));
}
if (path.length > 1) _ow.appendChild(_ov('polyline', { points: path.map((_oi) => _ok(_oi.altitude, _oi.azimuth).join(',')).join(' '), fill: 'none', stroke: '#E0A526', 'stroke-width': 3 }));
path.filter((_oi) => _oi.min % 120 === 0).forEach((_oi) => { const [x, y] = _ok(_oi.altitude, _oi.azimuth); _ow.appendChild(_ov('text', { x, y: y - 6, 'font-size': 9, 'text-anchor': 'middle', fill: '#8C6A14' }, String(_oi.min / 60) + 'h')); });
if (now && now.altitude > 0) {
const [x, y] = _ok(now.altitude, now.azimuth);
_ow.appendChild(_ov('circle', { cx: x, cy: y, r: 9, fill: '#F5B301', stroke: '#fff', 'stroke-width': 2 }));
const _oq = (now.azimuth + 180 - 90) * Math.PI / 180, L = Math.min(110, 40 / Math.tan(now.altitude * Math.PI / 180));
_ow.appendChild(_ov('line', { x1: C, y1: C, x2: C + L * Math.cos(_oq), y2: C + L * Math.sin(_oq), stroke: 'rgba(15,30,51,.45)', 'stroke-width': 6, 'stroke-linecap': 'round' }));
}
return _ow;
}
export async function mount(el, ctx) {
const G = g5(ctx), K = G.K;
const _ou = { ll: { lat: 21.0285, lng: 105.8542 }, facing: 135, floor: 15, fh: 3.2, date: _oy(), min: 15 * 60, obs: { dir: 135, dist: 0, height: 0, width: 30 }, name: '', id: null };
const _ol = h('div', { class: 'g5', 'data-testid': 'g5-huongnang' });
el.replaceChildren(_ol);
const llIn = G.input({ value: `${_ou.ll.lat}, ${_ou.ll.lng}`, 'data-testid': 'sun-ll', onchange: (e) => { const _oi = parseLatLng(e.target.value); if (!_oi) return K.toast('Toạ độ chưa đúng dạng "21.0285, 105.8542".', 'warn'); _ou.ll = _oi; _o6(); } });
const _oa = G.input({ type: 'number', min: 0, max: 359, step: 1, value: _ou.facing, 'data-testid': 'sun-facing', onchange: (e) => { _ou.facing = ((G.num(e.target.value, 0) % 360) + 360) % 360; _o6(); } });
const _o5 = G.select([['', '— hoặc chọn —'], ...S.DIRS8.map((d) => [d.deg, d.vi])], '', { 'data-testid': 'sun-dir8', onchange: (e) => { if (e.target.value === '') return; _ou.facing = Number(e.target.value); _oa.value = _ou.facing; _o6(); } });
const _oc = G.input({ type: 'number', min: 1, max: 100, value: _ou.floor, 'data-testid': 'sun-floor', onchange: (e) => { _ou.floor = Math.min(200, Math.max(1, Math.round(G.num(e.target.value, 1)))); e.target.value = _ou.floor; _o6(); } });
const _ob = G.input({ type: 'number', min: 2.5, max: 6, step: 0.1, value: _ou.fh, 'data-testid': 'sun-fh', onchange: (e) => { _ou.fh = Math.min(6, Math.max(2.5, G.num(e.target.value, 3.2))); e.target.value = _ou.fh; _o6(); } });
const _o3 = G.input({ type: 'date', value: _ou.date, 'data-testid': 'sun-date', onchange: (e) => { if (e.target.value) { _ou.date = e.target.value; _o6(); } } });
const timeOut = h('b', { 'data-testid': 'sun-time' });
const _ox = h('input', { type: 'range', min: 300, max: 1140, step: 10, value: _ou.min, 'data-testid': 'sun-slider', 'aria-label': 'Giờ trong ngày', oninput: (e) => { _ou.min = Number(e.target.value); _o6(); } });
const _og = {
dir: G.input({ type: 'number', min: 0, max: 359, value: _ou.obs.dir, 'data-testid': 'sun-obs-dir' }),
dist: G.input({ type: 'number', min: 0, value: '', placeholder: 'm', 'data-testid': 'sun-obs-dist' }),
height: G.input({ type: 'number', min: 0, value: '', placeholder: 'm', 'data-testid': 'sun-obs-h' }),
width: G.input({ type: 'number', min: 1, value: _ou.obs.width, 'data-testid': 'sun-obs-w' }),
};
const _o0 = { dir: 359, dist: 5000, height: 1000, width: 1000 };
Object.entries(_og).forEach(([k, inp]) => inp.addEventListener('change', () => { _ou.obs[k] = Math.min(_o0[k], Math.max(0, G.num(inp.value, 0))); inp.value = _ou.obs[k]; _o6(); }));
const _of = h('div', { 'data-testid': 'sun-now', 'aria-live': 'polite' });
const _ot = h('div');
const _or = h('div', { 'data-testid': 'sun-seasons' });
const viewBox = h('div', { 'data-testid': 'sun-view' });
const nameIn = G.input({ placeholder: 'Tên căn (để lưu)', 'data-testid': 'sun-name', oninput: (e) => { _ou.name = e.target.value; } });
const _op = h('div', { class: 'g5-list', 'data-testid': 'sun-saved' });
_ol.append(
G.head('Hướng nắng theo giờ & mùa', 'Vị trí mặt trời tính theo thuật toán NOAA cho đúng toạ độ căn; giờ nắng chiếu vào mặt ban công theo 4 mốc mùa; bóng che của toà đối diện.', 'sun-head'),
h('div', { class: 'g5-grid' },
K.card({ title: 'Căn hộ', body: [h('div', { class: 'g5-form' },
h('div', { class: 'g5-full' }, G.field('Toạ độ căn (vĩ độ, kinh độ)', llIn, 'Chép từ Google Maps: bấm giữ vào vị trí toà nhà → chép số.')),
G.field('Hướng ban công (độ, 0 = Bắc)', _oa), G.field('Hoặc chọn hướng', _o5),
G.field('Tầng', _oc), G.field('Cao mỗi tầng (m, ước tính)', _ob),
G.field('Ngày', _o3), h('div', null, h('span', { class: 'bds-field-l' }, 'Giờ: '), timeOut, _ox)),
h('details', null, h('summary', { 'data-testid': 'sun-obs-open' }, 'Toà nhà / vật cản phía trước (không bắt buộc)'), h('div', { class: 'g5-form' },
G.field('Hướng tới vật cản (độ)', _og.dir), G.field('Cách bao xa (m)', _og.dist), G.field('Cao hơn sàn căn (m)', _og.height), G.field('Bề ngang (m)', _og.width))),
h('div', { class: 'g5-row' }, nameIn, K.button('Lưu căn', () => _oo(), { kind: 'primary', testid: 'sun-save' })), _op] }),
K.card({ title: 'Mặt trời lúc này', body: [_ot, _of] })),
K.card({ title: 'Nắng chiếu vào mặt ban công theo mùa', body: _or }),
K.card({ title: 'Tầm nhìn theo tầng', body: viewBox }),
G.note('Thuật toán: NOAA Global Monitoring Laboratory – Solar Calculation Details (theo Meeus, Astronomical Algorithms). Giờ nắng tính trên tường đứng, chưa tính mái che, lô gia lõm, cây xanh; mốc mùa gần đúng ±1 ngày.', 'info'),
);
function _o6() {
const { lat, lng } = _ou.ll;
timeOut.textContent = S.hhmm(_ou.min);
const _oj = S.sunPosition(S.localToUtcMs(_ou.date, _ou.min), lat, lng);
const t = S.sunTimes(_ou.date, lat, lng);
const obstacle = _ou.obs.dist > 0 && _ou.obs.height > 0 ? _ou.obs : null;
const _oh = _oj.altitude > 0 && Math.abs(S.angleDiff(_oj.azimuth, _ou.facing)) < 90 && !S.blockedBy(obstacle, _oj.altitude, _oj.azimuth);
const _os = S.shadow(1, _oj.altitude, _oj.azimuth);
_ot.replaceChildren(sketch({ path: S.dayPath(_ou.date, lat, lng, { step: 10 }), now: _oj, facing: _ou.facing, obstacle }));
_of.replaceChildren(
h('div', { class: 'g5-row' },
h('div', { class: 'g5-stat' }, h('b', { 'data-testid': 'sun-alt' }, _oj.altitude > 0 ? vn(_oj.altitude) + '°' : 'Dưới chân trời'), h('span', null, 'Độ cao mặt trời')),
h('div', { class: 'g5-stat' }, h('b', null, vn(_oj.azimuth, 0) + '° ' + S.dirName(_oj.azimuth)), h('span', null, 'Phương vị')),
h('div', { class: 'g5-stat' }, h('b', null, S.hhmm(t.sunrise) + ' – ' + S.hhmm(t.sunset)), h('span', null, 'Mọc – lặn'))),
h('p', { 'data-testid': 'sun-on-facade' }, _oh ? '☀ Lúc này nắng chiếu trực tiếp vào mặt ban công.' : (_oj.altitude > 0 ? 'Lúc này mặt ban công không có nắng trực tiếp.' : 'Trời đã tối / chưa sáng.')),
_oj.altitude > 0 ? h('p', { class: 'bds-muted g5-small' }, `Bóng của cột cao 1 m dài ${vn(_os.length)} m, đổ về hướng ${S.dirName(_os.dir)}.` + (obstacle ? ` Toà đối diện (cao hơn sàn ${obstacle.height} m) đổ bóng dài ${vn(S.shadow(obstacle.height, _oj.altitude, _oj.azimuth).length, 0)} m.` : '')) : null,
h('p', { class: 'bds-muted g5-small' }, `Giữa trưa thật: ${S.hhmm(t.noon)}.`));
const sum = S.summarize(lat, lng, _ou.facing, { year: Number(_ou.date.slice(0, 4)), obstacle });
_or.replaceChildren(
h('p', null, `Ban công hướng ${sum.facingName} (${Math.round(_ou.facing)}°)`),
h('div', { class: 'g5-table-wrap' }, h('table', { class: 'g5-table' },
h('thead', null, h('tr', null, ...['Mốc', 'Tổng nắng', 'Buổi sáng', 'Buổi chiều', 'Khung giờ'].map((x) => h('th', null, x)))),
h('tbody', null, ...sum.seasons.map((s) => h('tr', { 'data-testid': 'sun-row-' + s.id },
h('td', null, s.vi), h('td', { class: 'num' }, _oe(s.sun.minutes)), h('td', { class: 'num' }, _oe(s.sun.morning)), h('td', { class: 'num' }, _oe(s.sun.afternoon)),
h('td', null, s.sun.intervals.map(([a, b]) => S.hhmm(a) + '–' + S.hhmm(b)).join(', ') || '—')))))),
...(sum.notes.length ? sum.notes.map((n) => G.note(n, /gắt|thiếu sáng|che/.test(n) ? 'warn' : 'success')) : [G.note('Nắng vừa phải quanh năm.', 'info')]));
const _o8 = S.eyeHeight(_ou.floor, _ou.fh);
viewBox.replaceChildren(
h('p', { 'data-testid': 'sun-horizon' }, `Tầng ${_ou.floor}: mắt nhìn cao khoảng ${vn(_o8)} m so với mặt đất → đường chân trời hình học cách khoảng ${vn(S.horizonKm(_o8))} km (khi không có vật cản).`),
obstacle ? h('p', { class: 'g5-small' }, `Toà phía ${S.dirName(obstacle.dir)} cách ${obstacle.dist} m, cao hơn sàn căn ${obstacle.height} m: che tầm nhìn ngang tới góc ${vn(Math.atan2(obstacle.height, obstacle.dist) * 180 / Math.PI, 0)}° phía trên đường ngang.`) : null,
h('p', { class: 'bds-muted g5-small' }, 'Ảnh view thật theo tầng: chụp từ căn mẫu / flycam đúng độ cao rồi đính kèm khi gửi khách; app không tạo ảnh view giả.'));
}
const _oe = (m) => (m ? vn(m / 60) + ' giờ' : '—');
async function _o7() {
const docs = await G.listDocs(KIND);
if (!docs.length) { _op.replaceChildren(K.empty('Chưa lưu căn nào. Đặt tên căn rồi bấm "Lưu căn" để mở lại sau.')); return; }
_op.replaceChildren(...docs.slice(0, 20).map((d) => h('div', { class: 'g5-li' }, h('div', null, h('b', null, d.name), h('div', { class: 'bds-muted g5-small' }, `${S.dirName(d.data.facing || 0)} · tầng ${d.data.floor || '—'}`)),
h('div', { class: 'g5-row' }, K.button('Mở', () => {
Object.assign(_ou, d.data, { id: d.id, name: d.name, obs: { dir: d.data.facing ?? _ou.facing, dist: 0, height: 0, width: 30, ...(d.data.obs || {}) } });
llIn.value = `${_ou.ll.lat}, ${_ou.ll.lng}`; _oa.value = _ou.facing; _o5.value = ''; _oc.value = _ou.floor; _ob.value = _ou.fh; nameIn.value = d.name;
Object.entries(_og).forEach(([k, inp]) => { inp.value = _ou.obs[k] ? _ou.obs[k] : (k === 'dist' || k === 'height' ? '' : _ou.obs[k]); });
if (_ou.obs.dist > 0 && _ou.obs.height > 0) { const _o4 = _og.dist.closest('details'); if (_o4) _o4.open = true; }
_o6();
}, { testid: 'sun-open-' + d.id }),
K.button('Xoá', async () => { if (!(await G.confirmDel(d.name, 'sun-del-c'))) return; await G.removeDoc(d.id); _o7(); }, { kind: 'danger', testid: 'sun-del-' + d.id })))));
}
async function _oo() {
const name = _ou.name.trim() || `Căn hướng ${S.dirName(_ou.facing)} tầng ${_ou.floor}`;
const _om = await G.saveDoc(KIND, { id: _ou.id, name, data: { ll: _ou.ll, facing: _ou.facing, floor: _ou.floor, fh: _ou.fh, obs: _ou.obs } });
_ou.id = _om.id; K.toast('Đã lưu.', 'success'); _o7();
}
_o6(); _o7();
return _ol;
}
export default {
manifest: {
id: 'g5_huongnang', title: 'Hướng nắng theo giờ & mùa', icon: '🌤️', screen: 'sales', order: 530, version: '0.1.0', status: 'ready',
desc: 'Thử nghiệm · nắng sáng/chiều, bóng che, tầm nhìn',
help: 'Tính vị trí mặt trời (thuật toán NOAA) cho toạ độ và hướng ban công của căn: giờ nắng theo 4 mốc mùa, nắng chiều gắt, bóng toà đối diện, tầm nhìn theo tầng.',
},
mount,
async selftest(ctx) {
return selftestWith(ctx, () => { const t = S.sunTimes('2026-06-21', 21.0285, 105.8542); return t.sunrise > 300 && t.sunrise < 330; });
},
};

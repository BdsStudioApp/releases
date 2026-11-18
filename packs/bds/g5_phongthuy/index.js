import { g5, h, selftestWith, FONT, wrapText } from '../g5_lib/ui.js';
import * as F from '../g5_lib/fengshui.js';
const _o2 = 'http://www.w3.org/2000/svg';
const _os = (tag, attrs = {}, ...kids) => { const e = document.createElementNS(_o2, tag); for (const [k, _ow] of Object.entries(attrs)) e.setAttribute(k, _ow); kids.forEach((k) => k && e.appendChild(typeof k === 'string' ? document.createTextNode(k) : k)); return e; };
const _o1 = [['cửa chính', 'Cửa chính căn hộ / nhà'], ['ban công', 'Ban công / cửa sổ lớn'], ['cửa toà nhà', 'Cửa sảnh toà nhà']];
export function roseSvg() {
const g = _os('g', { id: 'rose' });
g.appendChild(_os('circle', { cx: 100, cy: 100, r: 97, fill: 'rgba(15,30,51,.55)', stroke: '#C9A24A', 'stroke-width': 2 }));
g.appendChild(_os('circle', { cx: 100, cy: 100, r: 70, fill: 'none', stroke: 'rgba(255,255,255,.35)', 'stroke-width': 1 }));
for (let _oe = 0; _oe < 24; _oe++) {
const _o3 = _oe * 15 - 7.5, rad = (_o3 - 90) * Math.PI / 180;
g.appendChild(_os('line', { x1: 100 + 70 * Math.cos(rad), y1: 100 + 70 * Math.sin(rad), x2: 100 + 97 * Math.cos(rad), y2: 100 + 97 * Math.sin(rad), stroke: 'rgba(255,255,255,.3)', 'stroke-width': 1 }));
const _ot = (_oe * 15 - 90) * Math.PI / 180;
g.appendChild(_os('text', { x: 100 + 84 * Math.cos(_ot), y: 100 + 84 * Math.sin(_ot) + 3, 'font-size': 7, fill: '#F7F3EA', 'text-anchor': 'middle', transform: `rotate(${_oe * 15} ${100 + 84 * Math.cos(_ot)} ${100 + 84 * Math.sin(_ot)})` }, F.SON24[(_oe + 1) % 24]));
}
F.DIR_ORDER.forEach((d, _oe) => {
const _ot = (_oe * 45 - 90) * Math.PI / 180;
g.appendChild(_os('text', { x: 100 + 56 * Math.cos(_ot), y: 100 + 56 * Math.sin(_ot) + 4, 'font-size': d.length === 1 ? 13 : 9, 'font-weight': 700, fill: d === 'N' ? '#E6C77A' : '#fff', 'text-anchor': 'middle' }, F.DIRS[d].vi.split(' ').map((w) => w[0]).join('')));
});
const svg = _os('svg', { viewBox: '0 0 200 200', role: 'img', 'aria-label': 'La bàn 24 sơn' }, g,
_os('path', { d: 'M100 6 L94 24 L106 24 Z', fill: '#E74C3C' }),
_os('line', { x1: 100, y1: 24, x2: 100, y2: 100, stroke: '#E74C3C', 'stroke-width': 2 }),
_os('circle', { cx: 100, cy: 100, r: 4, fill: '#E74C3C' }));
return { svg, rose: g };
}
export function cameraAllowed(doc = typeof document !== 'undefined' ? document : null) {
try { const p = doc && (doc.permissionsPolicy || doc.featurePolicy); return !p || typeof p.allowsFeature !== 'function' || p.allowsFeature('camera') !== false; } catch { return true; }
}
export async function mount(el, ctx) {
const G = g5(ctx), K = G.K;
const _op = { heading: null, facing: null, ref: 'cửa chính', year: '', gender: 'male', beforeTet: false, name: '', declination: 0, readings: [], stream: null, listening: false };
const _on = h('div', { class: 'g5', 'data-testid': 'g5-phongthuy' });
el.replaceChildren(_on);
const video = h('video', { playsinline: true, muted: true, autoplay: true, hidden: true, 'aria-hidden': 'true' });
const { svg, rose } = roseSvg();
const _o7 = h('div', { class: 'g5-compass', 'data-testid': 'pt-compass' }, video, svg);
const degOut = h('p', { class: 'g5-deg', 'data-testid': 'pt-deg', 'aria-live': 'polite' }, '—');
const sensorMsg = h('div', { 'data-testid': 'pt-sensor-msg' });
const _oh = G.input({ type: 'number', min: 0, max: 359.9, step: 0.5, inputmode: 'decimal', placeholder: 'vd 135', 'data-testid': 'pt-manual' });
const _o8 = G.select([['', '— chọn —'], ...F.DIR_ORDER.map((d) => [F.DIRS[d].deg, F.DIRS[d].vi])], '', { 'data-testid': 'pt-dir8', onchange: (e) => { if (e.target.value !== '') { _oh.value = e.target.value; _oo(Number(e.target.value), 'tay'); } } });
_oh.addEventListener('change', () => { const _ow = G.num(_oh.value, NaN); if (Number.isFinite(_ow)) _oo(((_ow % 360) + 360) % 360, 'tay'); });
const _ol = G.select(_o1, _op.ref, { 'data-testid': 'pt-ref', onchange: (e) => { _op.ref = e.target.value; if (_op.facing != null) _oo(_op.facing, _op.how || 'tay'); else _oa(); } });
const declIn = G.input({ type: 'number', step: 0.1, value: 0, 'data-testid': 'pt-decl', onchange: (e) => { _op.declination = G.num(e.target.value, 0); } });
const _ob = h('div', { 'data-testid': 'pt-facing' });
const _ox = G.input({ type: 'number', inputmode: 'numeric', min: 1900, max: 2100, placeholder: 'vd 1984', 'data-testid': 'pt-year', oninput: (e) => { _op.year = e.target.value; _oa(); } });
const _oc = G.select([['male', 'Nam'], ['female', 'Nữ']], 'male', { 'data-testid': 'pt-gender', onchange: (e) => { _op.gender = e.target.value; _oa(); } });
const tetCb = h('input', { type: 'checkbox', 'data-testid': 'pt-before-tet', onchange: (e) => { _op.beforeTet = e.target.checked; _oa(); } });
const _oi = G.input({ placeholder: 'Tên khách (không bắt buộc)', 'data-testid': 'pt-name', oninput: (e) => { _op.name = e.target.value; _o9(); } });
const _om = h('div', { 'data-testid': 'pt-result', 'aria-live': 'polite' });
const _o5 = h('canvas', { class: 'g5-canvas', width: 1080, height: 1350, 'data-testid': 'pt-card', 'aria-label': 'Phiếu phong thuỷ – ảnh minh hoạ' });
const custSel = G.select([['', '— chọn khách —']], '', { 'aria-label': 'Khách để ghi phiếu', 'data-testid': 'pt-customer' });
_on.append(
G.head('La bàn phong thuỷ', 'Đo hướng bằng cảm biến điện thoại (có camera ngắm nếu máy cho phép), xem hợp tuổi theo Bát trạch, xuất phiếu. Kết quả chỉ để tham khảo.', 'pt-head'),
G.note(F.LABEL, 'info'),
h('div', { class: 'g5-grid' },
K.card({ title: '1. Đo hướng', body: [_o7, degOut,
h('div', { class: 'g5-row' }, K.button('Bật la bàn', () => _or(), { kind: 'primary', testid: 'pt-sensor', icon: 'pulse' }),
cameraAllowed() ? K.button('Bật camera ngắm', () => _oq(), { testid: 'pt-camera', icon: 'eye' }) : null,
K.button('Giữ hướng này', () => { if (_op.heading == null) return K.toast('Chưa có số đo từ la bàn – nhập tay bên dưới.', 'warn'); _oo(_op.heading, 'cảm biến'); }, { testid: 'pt-lock', icon: 'lock' })),
sensorMsg,
G.note('Cách đo: đứng ở ' + 'mốc đã chọn, mặt nhìn ra ngoài, để điện thoại nằm ngang, đỉnh máy chỉ thẳng ra ngoài. Tránh xa cửa sắt, tủ lạnh, loa. Đo 3 lần ở 3 chỗ, lấy số giữa.', 'info'),
h('div', { class: 'g5-form' },
G.field('Mốc hướng', _ol),
G.field('Độ lệch từ (°)', declIn, 'Ở Việt Nam rất nhỏ – để 0 nếu không rõ.'),
G.field('Nhập độ bằng tay', _oh), G.field('Hoặc chọn hướng', _o8)),
_ob] }),
K.card({ title: '2. Người xem', body: [h('div', { class: 'g5-form' },
G.field('Năm sinh (âm lịch)', _ox), G.field('Giới tính', _oc),
h('label', { class: 'g5-row g5-small g5-full' }, tetCb, 'Sinh trước Tết âm lịch của năm đó (tính theo năm trước)'),
h('div', { class: 'g5-full' }, G.field('Tên khách', _oi))), _om] })),
K.card({ title: '3. Phiếu phong thuỷ (ảnh minh hoạ)', body: [_o5,
h('div', { class: 'g5-row' }, K.button('Tải ảnh PNG', () => G.savePng(_o5, 'phieu-phong-thuy-' + G.slug(_op.name || 'khach')), { testid: 'pt-png', icon: 'download' }), K.button('Tải PDF', () => G.savePdf(_o5, 'phieu-phong-thuy-' + G.slug(_op.name || 'khach'), 'Phieu phong thuy'), { testid: 'pt-pdf', icon: 'download' })),
h('div', { class: 'g5-row' }, custSel, K.button('Ghi vào hồ sơ khách', () => _ou(), { testid: 'pt-to-customer', icon: 'user' }))] }),
G.note('Nguồn quy tắc: bảng 8 hướng theo phái Bát trạch (sách "Bát trạch minh kính"); cung mệnh theo cách tính Cửu cung phi tinh thông dụng. Kết quả chỉ để tham khảo.', 'info'),
);
(async () => {
const cs = (await K.list('objects')).filter((o) => !o.kind || o.kind === 'customer').slice(0, 300);
custSel.replaceChildren(h('option', { value: '' }, cs.length ? '— chọn khách —' : '— chưa có khách nào trong app —'), ...cs.map((_o4) => h('option', { value: _o4.id }, _o4.name || _o4.phone || _o4.id)));
})();
function _oo(deg, how) {
_op.facing = Math.round(deg * 10) / 10; _op.how = how;
const _od = F.house(_op.facing);
_ob.replaceChildren(G.note(`Hướng ${_op.ref}: ${_op.facing}° – ${_od.facingVi} (sơn ${_od.son}), toạ ${_od.sittingVi} → ${_od.gua} trạch, ${_od.groupVi}. Đo bằng ${how}.` + (_od.border ? ' Hướng nằm sát ranh giới 2 hướng – nên đo lại vài lần.' : ''), _od.border ? 'warn' : 'success'));
_oa();
}
function _ok(e) {
const angle = (screen.orientation && Number(screen.orientation.angle)) || Number(window.orientation) || 0;
const r = F.headingFrom(e, { screenAngle: angle, declination: _op.declination });
if (!r) return;
_op.readings.push(r.heading); if (_op.readings.length > 8) _op.readings.shift();
_op.heading = F.smoothAngles(_op.readings);
rose.setAttribute('transform', `rotate(${-_op.heading} 100 100)`);
degOut.textContent = `${Math.round(_op.heading)}° · ${F.DIRS[F.dirOf(_op.heading)].vi} · ${F.sonOf(_op.heading)}`;
}
async function _or() {
if (_op.listening) return;
try {
const _o0 = window.DeviceOrientationEvent;
if (!_o0) throw new Error('none');
if (typeof _o0.requestPermission === 'function') { const p = await _o0.requestPermission(); if (p !== 'granted') throw new Error('denied'); }
const evt = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
window.addEventListener(evt, _ok);
_op.listening = true; _op.evt = evt;
sensorMsg.replaceChildren(G.note('Đang đọc la bàn… xoay điện thoại thành hình số 8 vài lần nếu số nhảy.', 'info'));
setTimeout(() => { if (_op.heading == null && _on.isConnected) sensorMsg.replaceChildren(G.note('Máy này không gửi hướng la bàn cho trình duyệt (thường gặp trên máy tính). Nhập độ hoặc chọn hướng bằng tay bên dưới.', 'warn', 'pt-no-sensor')); }, 2500);
} catch (e) {
sensorMsg.replaceChildren(G.note(e.message === 'denied' ? 'Chưa được cho phép dùng cảm biến hướng. Nhập độ bằng tay bên dưới.' : 'Trình duyệt không có cảm biến hướng. Nhập độ bằng tay bên dưới.', 'warn', 'pt-no-sensor'));
}
}
async function _oq() {
try {
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('none');
_op.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
video.srcObject = _op.stream; video.hidden = false;
try { await video.play(); } catch { }
} catch (e) {
sensorMsg.replaceChildren(G.note('Không mở được camera (máy chưa cho phép hoặc chính sách bảo mật của app đang tắt camera). La bàn và nhập tay vẫn dùng bình thường.', 'warn', 'pt-no-camera'));
}
}
function _oy() { const y = Math.round(G.num(_op.year, NaN)); return Number.isFinite(y) ? (_op.beforeTet ? y - 1 : y) : null; }
function _oa() {
const y = _oy();
const p = y ? F.person({ year: y, gender: _op.gender }) : null;
if (!p) {
const _ov = String(_op.year || '').trim() !== '';
_om.replaceChildren(_ov ? G.note('Năm sinh (âm lịch) cần nằm trong khoảng 1900–2100' + (_op.beforeTet ? ' (sau khi trừ 1 vì sinh trước Tết)' : '') + '.', 'warn', 'pt-year-bad') : h('p', { class: 'bds-muted' }, 'Nhập năm sinh để xem cung mệnh và hướng hợp.'));
_o9(); return;
}
const _og = _op.facing != null ? F.match({ year: y, gender: _op.gender, facingDeg: _op.facing, ref: _op.ref }) : null;
_om.replaceChildren(
h('p', null, h('b', { 'data-testid': 'pt-gua' }, `Năm ${p.canchi} (${y}) – ${_op.gender === 'female' ? 'Nữ' : 'Nam'}: cung ${p.gua} (${p.element}), ${p.groupVi}`)),
h('div', { class: 'g5-dirs' }, ...[...p.good, ...p.bad].map((d) => h('div', { class: 'g5-dir ' + (d.good ? 'good' : 'bad') }, h('b', null, d.dirVi), h('div', null, d.starVi), h('div', { class: 'bds-muted g5-small' }, d.note)))),
_og ? h('p', { class: 'g5-verdict', 'data-testid': 'pt-verdict', dataset: { verdict: _og.verdict } }, (_og.verdict === 'hop' ? '✓ ' : _og.verdict === 'tamduoc' ? '◐ ' : '✗ ') + _og.text) : h('p', { class: 'bds-muted' }, 'Đo hoặc nhập hướng ở mục 1 để xem hợp hay không.'),
h('ul', { class: 'g5-small' }, ...F.tipsFor(p).map((t) => h('li', null, t))),
h('p', { class: 'bds-muted g5-small' }, 'Tham khảo – không thay cho tư vấn thiết kế, kết cấu, pháp lý.'));
_o9();
}
function _o9() {
const _o4 = _o5.getContext('2d'), W = 1080, H = 1350;
_o4.fillStyle = '#0F1E33'; _o4.fillRect(0, 0, W, H);
_o4.fillStyle = '#C9A24A'; _o4.fillRect(0, 0, W, 10);
_o4.fillStyle = '#E6C77A'; _o4.font = `600 28px ${FONT}`; _o4.fillText('PHIẾU PHONG THUỶ · THAM KHẢO', 60, 80);
_o4.fillStyle = '#F7F3EA'; _o4.font = `bold 56px ${FONT}`; _o4.fillText(_op.name || 'Khách hàng', 60, 150);
const y = _oy(), p = y ? F.person({ year: y, gender: _op.gender }) : null;
let yy = 210;
_o4.font = `30px ${FONT}`;
if (!p) { _o4.fillText('Nhập năm sinh để tạo phiếu.', 60, yy); }
else {
_o4.fillText(`Năm ${p.canchi} (${y}) · ${_op.gender === 'female' ? 'Nữ' : 'Nam'} · Cung ${p.gua} – ${p.element}`, 60, yy); yy += 44;
_o4.fillStyle = '#E6C77A'; _o4.fillText(p.groupVi, 60, yy); yy += 60;
const _o6 = (list, x, title, color) => {
let _of = yy; _o4.fillStyle = color; _o4.font = `bold 32px ${FONT}`; _o4.fillText(title, x, _of); _of += 48;
_o4.font = `28px ${FONT}`;
list.forEach((d) => { _o4.fillStyle = '#F7F3EA'; _o4.fillText(`${d.dirVi}`, x, _of); _o4.fillStyle = '#A2ACBC'; _o4.fillText(d.starVi, x + 220, _of); _of += 44; });
return _of;
};
const _o3 = _o6(p.good, 60, 'Hướng tốt', '#7BD3A0'), b = _o6(p.bad, 560, 'Hướng xấu', '#F08A80');
yy = Math.max(_o3, b) + 30;
if (_op.facing != null) {
const _og = F.match({ year: y, gender: _op.gender, facingDeg: _op.facing, ref: _op.ref });
_o4.fillStyle = _og.verdict === 'hop' ? '#7BD3A0' : _og.verdict === 'tamduoc' ? '#E6C77A' : '#F08A80';
_o4.font = `bold 32px ${FONT}`; _o4.fillText(`Căn hướng ${_og.house.facingVi} (${_op.facing}° – ${_op.ref})`, 60, yy); yy += 46;
_o4.font = `28px ${FONT}`; _o4.fillStyle = '#F7F3EA'; yy = wrapText(_o4, _og.text, 60, yy, W - 120, 38) + 10;
}
_o4.font = `26px ${FONT}`; _o4.fillStyle = '#D9D4C7';
F.tipsFor(p).forEach((t) => { yy = wrapText(_o4, '• ' + t, 60, yy, W - 120, 36); });
}
_o4.fillStyle = '#C9A24A'; _o4.fillRect(0, H - 120, W, 2);
_o4.fillStyle = '#E6C77A'; _o4.font = `bold 30px ${FONT}`; _o4.fillText(F.IMG_LABEL, 60, H - 70);
_o4.fillStyle = '#A2ACBC'; _o4.font = `22px ${FONT}`; _o4.fillText('Theo phong thuỷ Bát trạch – không phải căn cứ kỹ thuật, pháp lý hay cam kết.', 60, H - 34);
}
async function _ou() {
const id = custSel.value;
if (!id) return K.toast('Chọn khách trước.', 'warn');
const y = _oy(); const p = y ? F.person({ year: y, gender: _op.gender }) : null;
if (!p) return K.toast('Nhập năm sinh trước.', 'warn');
const _og = _op.facing != null ? F.match({ year: y, gender: _op.gender, facingDeg: _op.facing, ref: _op.ref }) : null;
const text = `Phong thuỷ (tham khảo): ${p.canchi} ${y}, cung ${p.gua}, ${p.groupVi}. Hướng tốt: ${p.good.map((d) => d.dirVi).join(', ')}.` + (_og ? ` Căn hướng ${_og.house.facingVi} ${_op.facing}° (${_op.ref}): ${_og.starVi} – ${_og.verdict === 'hop' ? 'hợp' : _og.verdict === 'tamduoc' ? 'tạm được' : 'chưa hợp'}.` : '');
await K.logEvent(id, 'note', text, { g5: 'phongthuy', year: y, gender: _op.gender, facing: _op.facing });
K.toast('Đã ghi vào hồ sơ khách.', 'success');
}
const stop = () => { if (_op.listening) window.removeEventListener(_op.evt, _ok); if (_op.stream) _op.stream.getTracks().forEach((t) => t.stop()); };
const _oj = new MutationObserver(() => { if (!_on.isConnected) { stop(); _oj.disconnect(); } });
_oj.observe(document.body, { childList: true, subtree: true });
_oa();
return _on;
}
export default {
manifest: {
id: 'g5_phongthuy', title: 'La bàn phong thuỷ', icon: '🧭', screen: 'sales', order: 520, version: '0.1.0', status: 'ready',
desc: 'Thử nghiệm · hợp tuổi Bát trạch, phiếu tham khảo',
help: 'Đo hướng căn bằng cảm biến điện thoại (camera ngắm nếu máy cho phép, không có thì nhập tay), xem hợp tuổi theo Bát trạch và xuất phiếu phong thuỷ (ảnh minh hoạ, tham khảo).',
},
mount,
async selftest(ctx) { return selftestWith(ctx, () => F.kua(1984, 'male') === 7 && F.kua(1984, 'female') === 8 && F.dirOf(359) === 'N'); },
};

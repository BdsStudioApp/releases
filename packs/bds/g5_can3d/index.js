import { g5, h, files, loadImage, scrollToEl, selftestWith, fileForAi } from '../g5_lib/ui.js';
import * as P from '../g5_lib/plan3d.js';
import * as L from '../g5_lib/layout3d.js';
const KIND = 'g5_can3d';
const _o0 = 'http://www.w3.org/2000/svg';
const _o1o = (_o1q, attrs = {}, ...kids) => { const e = document.createElementNS(_o0, _o1q); for (const [_op, v] of Object.entries(attrs)) e.setAttribute(_op, v); kids.forEach((_op) => _op && e.appendChild(typeof _op === 'string' ? document.createTextNode(_op) : _op)); return e; };
const vn = (x, d = 1) => String(Math.round(Number(x) * 10 ** d) / 10 ** d).replace('.', ',');
export function plan2d(plan, { furnitureOn = false, path = null } = {}) {
const _o4 = P.bounds(plan.rooms), pad = 0.6, _op = 40;
const W = (_o4.w + pad * 2) * _op, H = (_o4.d + pad * 2) * _op;
const _o1 = (x) => (x - _o4.x + pad) * _op, Y = (y) => (y - _o4.y + pad) * _op;
const _o1p = _o1o('svg', { viewBox: `0 0 ${W} ${H}`, class: 'g5-canvas', role: 'img', 'aria-label': 'Mặt bằng 2D', 'data-testid': 'c3-plan2d' });
for (const r of plan.rooms) {
_o1p.appendChild(_o1o('rect', { x: _o1(r.x), y: Y(r.y), width: r.w * _op, height: r.d * _op, fill: (P.KINDS[r.kind] || P.KINDS.khach).color }));
if (furnitureOn) for (const _ok of P.furniture(r)) _o1p.appendChild(_o1o('rect', { x: _o1(_ok.x), y: Y(_ok.y), width: _ok.w * _op, height: _ok.d * _op, fill: _ok.color, opacity: 0.8, rx: 3 }));
_o1p.appendChild(_o1o('text', { x: _o1(r.x + r.w / 2), y: Y(r.y + r.d / 2), 'font-size': 12, 'text-anchor': 'middle', fill: '#0F1E33', 'font-weight': 600 }, r.name));
_o1p.appendChild(_o1o('text', { x: _o1(r.x + r.w / 2), y: Y(r.y + r.d / 2) + 14, 'font-size': 10, 'text-anchor': 'middle', fill: '#5F6979' }, `${String(r.w).replace('.', ',')} × ${String(r.d).replace('.', ',')} m`));
}
const { walls, doors } = P.buildWalls(plan);
for (const w of walls) _o1p.appendChild(_o1o('line', { x1: _o1(w.x1), y1: Y(w.y1), x2: _o1(w.x2), y2: Y(w.y2), stroke: w.kind === 'rail' ? '#6E8BA3' : '#0F1E33', 'stroke-width': w.kind === 'rail' ? 3 : 5, 'stroke-linecap': 'square' }));
for (const d of doors) _o1p.appendChild(_o1o('circle', { cx: _o1(d.x), cy: Y(d.y), r: 4, fill: d.kind === 'entry' ? '#B4423A' : '#C9A24A' }));
if (path && path.length > 1) _o1p.appendChild(_o1o('polyline', { points: path.map((_o11) => _o1(_o11.x) + ',' + Y(_o11.y)).join(' '), fill: 'none', stroke: '#B4423A', 'stroke-width': 2, 'stroke-dasharray': '6 4' }));
return _o1p;
}
export async function mount(el, ctx) {
const G = g5(ctx), K = G.K;
const _o1m = {
id: null, name: '', step: 'can', project: '', unit: '', tower: 0, floor: 12,
towers: [{ name: 'Toà A', floors: 30, w: 40, d: 25 }, { name: 'Toà B', floors: 25, w: 40, d: 25 }],
mode: 'none', plan: { rooms: [], links: [], entry: null }, illustrative: false, furn: true, cut: false,
layout: null, layoutBlob: null, layoutUrl: '', scan: null, confirmed: false, built: false, busy: false,
};
function _o1r(id) { const t = P.TEMPLATES.find((x) => x.id === id) || P.TEMPLATES[0]; return { rooms: P.cleanRooms(t.rooms), links: t.links.map((l) => [...l]), entry: { ...t.entry } }; }
const _o1f = h('div', { class: 'g5', 'data-testid': 'g5-can3d' });
el.replaceChildren(_o1f);
const _o1b = new URLSearchParams((location.hash.split('?')[1] || ''));
const _oa = (() => { try { return matchMedia('(pointer: coarse)').matches; } catch { return false; } })();
const crumb = h('div', { class: 'g5-row g5-small', 'data-testid': 'c3-crumb' });
const tabs = G.tabs([['tongquan', '1. Tổng quan dự án'], ['can', '2. Căn hộ & nội thất 3D']], _o1m.step, (v) => { _o1m.step = v; _o1l(); }, 'c3-step');
const stage = h('div', { class: 'g5-three' + (_oa ? ' g5-locked' : ''), 'data-testid': 'c3-3d' });
const caption = h('div', { class: 'g5-caption', 'data-testid': 'c3-caption', 'aria-live': 'polite' });
const _o1q = h('div', { class: 'g5-tag' }, 'Chưa dựng');
const hint = h('div', { class: 'g5-maphint', hidden: true, 'data-testid': 'c3-hint' });
const empty = h('div', { class: 'g5-maphint', 'data-testid': 'c3-stage-empty' }, 'Chưa dựng 3D căn hộ. Làm bước 1 (tải layout) và bước 2 (soát số đo) rồi bấm "🧱 Dựng 3D".');
stage.append(_o1q, caption, hint, empty);
const fallback = h('div', { 'data-testid': 'c3-fallback' });
const ctrl = h('div', { class: 'g5-row' });
const _ob = h('div', { 'data-testid': 'c3-why-ctrl', 'aria-live': 'polite' });
const overview = h('div');
const _o1u = h('div');
const plan2dBox = h('div', { class: 'g5-plan2d' });
const errBox = h('div', { 'data-testid': 'c3-errors' });
const areaBox = h('div', { 'data-testid': 'c3-area' });
const _o1j = h('div', { class: 'g5-list', 'data-testid': 'c3-saved' });
const illu = G.note(P.ILLU, 'warn', 'c3-illu');
const stepsBox = h('div', { class: 'g5-steps', 'data-testid': 'c3-steps' });
_o1f.append(
G.head('Căn hộ 3D', 'Tải layout mặt bằng căn → AI quét (hoặc tự nhập) kích thước từng phòng → soát số đo → dựng 3D, bật nội thất, cho nhân vật dẫn tour.', 'c3-head'),
stepsBox, illu, crumb, tabs,
h('div', { class: 'g5-grid' }, h('div', null, stage, fallback, ctrl, _ob), h('div', null, overview, _o1u)),
K.card({ title: 'Đã lưu', body: _o1j }),
);
let _o1x = null;
try {
const { createViewer } = await import('./viewer.js');
_o1x = await createViewer(stage);
} catch (e) { _o1x = null; }
let _oo = 0;
const _om = (t) => { hint.textContent = t; hint.hidden = false; clearTimeout(_oo); _oo = setTimeout(() => { hint.hidden = true; }, 2200); };
if (_o1x) {
_o1x.onLockedTouch = () => _om('Bấm "✋ Xoay 3D bằng tay" dưới khung để xoay/phóng bằng ngón tay. Vuốt lên/xuống để cuộn trang.');
_o1x.onLockedWheel = () => _om('Bấm vào khung 3D (hoặc giữ Ctrl) rồi lăn chuột để phóng to/thu nhỏ.');
}
if (!_o1x) { stage.hidden = true; fallback.replaceChildren(G.note('Máy/trình duyệt này không hiển thị được 3D (WebGL). Đang dùng mặt bằng 2D.', 'info', 'c3-no-webgl')); }
stage.dataset.ready = _o1x ? '1' : '0';
const _on = () => _o1m.plan.rooms.length > 0;
function _oi() {
const s = [
['1', 'Tải layout', _o1m.mode === 'layout' || _o1m.mode === 'demo'],
['2', 'Quét / nhập số đo', _on()],
['3', 'Soát & xác nhận', _o1m.mode === 'demo' ? _on() : _o1m.confirmed && _on()],
['4', 'Dựng 3D & dẫn tour', _o1m.built],
];
const next = s.find((x) => !x[2]);
stepsBox.replaceChildren(...s.map(([_ow, label, done]) => h('span', { class: 'g5-stepchip' + (done ? ' done' : next && next[0] === _ow ? ' next' : ''), 'data-testid': 'c3-stepchip-' + _ow, 'data-done': done ? '1' : '0' }, h('b', null, done ? '✓' : _ow), label)));
illu.hidden = _o1m.mode !== 'demo';
}
function _oe() {
const _o13 = _o1m.project || 'Dự án';
crumb.replaceChildren(h('span', null, _o13), ' › ', h('span', null, (_o1m.towers[_o1m.tower] || {}).name || 'Toà'), ' › ', h('span', null, 'Tầng ' + _o1m.floor), ' › ', h('b', null, _o1m.unit || 'Căn'));
}
function _o1l() {
_oe(); _oi();
overview.hidden = _o1m.step !== 'tongquan'; _o1u.hidden = _o1m.step !== 'can';
if (_o1m.step === 'tongquan') { _of(); empty.hidden = true; if (_o1x) _o1x.showTowers(_o1m.towers, { tower: _o1m.tower, floor: _o1m.floor }); ctrl.replaceChildren(K.button('Xem căn ở tầng này →', () => { _o1m.step = 'can'; tabs.set('can'); _o1l(); }, { kind: 'primary', testid: 'c3-go-unit' })); _ob.replaceChildren(); }
else { _oj(); _o1d(); }
}
function _of() {
const projects = K.projects();
const _o15 = G.select([['', '— chọn dự án —'], ...projects.map((_o11) => [_o11.name, _o11.name])], _o1m.project, { 'data-testid': 'c3-project', onchange: (e) => { _o1m.project = e.target.value; _oe(); } });
const rows = _o1m.towers.map((t, i) => h('div', { class: 'g5-li' },
h('div', { class: 'g5-form' }, G.field('Tên toà', G.input({ value: t.name, 'data-testid': 'c3-tname-' + i, onchange: (e) => { t.name = e.target.value; _o1l(); } })),
G.field('Số tầng', G.input({ type: 'number', min: 1, max: 100, value: t.floors, 'data-testid': 'c3-tfloors-' + i, onchange: (e) => { t.floors = Math.max(1, Math.round(G.num(e.target.value, 1))); _o1l(); } }))),
K.button(_o1m.tower === i ? '✓ Đang chọn' : 'Chọn', () => { _o1m.tower = i; _o1l(); }, { testid: 'c3-tpick-' + i }), _o1m.towers.length > 1 ? K.button('✕', () => { _o1m.towers.splice(i, 1); _o1m.tower = 0; _o1l(); }, { title: 'Xoá toà' }) : null));
overview.replaceChildren(K.card({ title: 'Tổng quan dự án (khối minh hoạ)', body: [
G.field('Dự án', _o15), ...rows,
h('div', { class: 'g5-row' }, K.button('+ Thêm toà', () => { _o1m.towers.push({ name: 'Toà ' + String.fromCharCode(65 + _o1m.towers.length), floors: 25, w: 40, d: 25 }); _o1l(); }, { testid: 'c3-add-tower' }),
G.field('Tầng của căn', G.input({ type: 'number', min: 1, max: 100, value: _o1m.floor, 'data-testid': 'c3-floor', onchange: (e) => { _o1m.floor = Math.max(1, Math.round(G.num(e.target.value, 1))); _o1l(); } }))),
h('p', { class: 'bds-muted g5-small' }, 'Khối toà chỉ minh hoạ số tầng và vị trí tương đối – không phải phối cảnh kiến trúc.')] }));
}
const _ol = h('input', { type: 'file', hidden: true, accept: 'image/png,image/jpeg,image/webp,application/pdf', 'data-testid': 'c3-layout-file', onchange: (e) => { const _ok = e.target.files && e.target.files[0]; e.target.value = ''; _o12(_ok); } });
const why1 = h('div', { 'data-testid': 'c3-why-1', 'aria-live': 'polite' });
const why3 = h('div', { 'data-testid': 'c3-why-3', 'aria-live': 'polite' });
const scanOut = h('div', { class: 'g5-list', 'data-testid': 'c3-scan-result', 'aria-live': 'polite' });
const _oy = (box, msg) => { box.replaceChildren(G.note(msg, 'warn')); scrollToEl(box, 'nearest'); };
async function _o12(file, { keepPlan = false } = {}) {
if (!file) return;
if (file.size > 25 * 1024 * 1024) return _oy(why1, 'Tệp lớn hơn 25 MB – chụp/xuất riêng trang mặt bằng căn rồi tải lại.');
try {
const isPdf = /pdf/i.test(file.type || '') || /\.pdf$/i.test(file.name || '');
let _ov;
if (isPdf) { const ai = await fileForAi(file); _ov = { name: file.name || 'layout.pdf', mime: 'application/pdf', pages: ai.pages, ai }; }
else { const img = await loadImage(file); _ov = { name: file.name || 'layout', mime: file.type || 'image/jpeg', pages: 1, w: img.naturalWidth, h: img.naturalHeight, img }; }
if (_o1m.layoutUrl) URL.revokeObjectURL(_o1m.layoutUrl);
_o1m.layout = _ov; _o1m.layoutBlob = file; _o1m.layoutUrl = URL.createObjectURL(file);
if (!keepPlan) { _o1m.mode = 'layout'; _o1m.illustrative = false; _o1m.scan = null; _o1m.confirmed = false; _o1m.built = false; _o1m.plan = { rooms: [], links: [], entry: null }; scanOut.replaceChildren(); }
why1.replaceChildren(); _o1l();
} catch (e) { _oy(why1, (e && e.message) || 'Không đọc được tệp – thử ảnh PNG/JPG hoặc PDF khác.'); }
}
function _or() {
const _oq = _o1m.layout;
const _o14 = !_oq ? null : _oq.mime === 'application/pdf'
? h('div', { class: 'g5-row g5-small' }, `📄 ${_oq.name} – PDF ${_oq.pages} trang.`, K.button('Mở PDF để đối chiếu', () => { try { window.open(_o1m.layoutUrl, '_blank', 'noopener'); } catch { } }, { testid: 'c3-layout-open' }))
: h('img', { class: 'g5-layout-img', src: _o1m.layoutUrl, alt: 'Layout mặt bằng căn đã tải', 'data-testid': 'c3-layout-preview' });
const _o1t = G.select([['', '— chọn mặt bằng mẫu (minh hoạ) —'], ...P.TEMPLATES.map((t) => [t.id, t.vi])], '', { 'aria-label': 'Mặt bằng mẫu (minh hoạ)', 'data-testid': 'c3-template', onchange: (e) => {
if (!e.target.value) return;
_o1m.plan = _o1r(e.target.value); _o1m.mode = 'demo'; _o1m.illustrative = true; _o1m.scan = null; _o1m.confirmed = false; _o1m.built = true; scanOut.replaceChildren(); _o1l();
} });
return K.card({ testid: 'c3-layout-card', title: '1. Layout mặt bằng căn (bắt buộc)', body: [
h('div', { class: 'g5-upload' },
h('div', { class: 'g5-row' }, K.button(_oq ? '📂 Đổi layout khác' : '📂 Tải ảnh/PDF layout căn', () => _ol.click(), { kind: _oq ? 'ghost' : 'primary', testid: 'c3-layout-pick' }), _ol),
h('p', { class: 'bds-muted g5-small', 'data-testid': 'c3-layout-info' }, _oq ? `Đã tải: ${_oq.name}${_oq.w ? ` – ${_oq.w} × ${_oq.h} px` : ''}. Tệp chỉ lưu trên máy này.`
: 'Ảnh (PNG/JPG/WebP) hoặc PDF mặt bằng căn của chủ đầu tư – càng rõ số đo (mm) và mũi tên chỉ Bắc thì AI quét càng đúng.'),
_o14),
h('div', { class: 'g5-row' },
K.button('🤖 AI quét layout', () => scan(false), { kind: _oq ? 'primary' : 'secondary', testid: 'c3-scan' }),
G.canChat() ? K.button('Làm qua chat Claude/Gemini (miễn phí)', () => scan(true), { testid: 'c3-scan-chat', icon: 'chat' }) : null,
K.button('✍️ Tự nhập kích thước phòng', () => _ou(), { testid: 'c3-manual' })),
h('p', { class: 'bds-muted g5-small', 'data-testid': 'c3-scan-fee' }, '💰 AI quét layout có thể mất phí Gemini – app báo chi phí và hỏi trước khi gửi. AI chỉ điền sẵn: anh/chị soát từng số đo.'),
why1, scanOut,
h('details', { 'data-testid': 'c3-demo' }, h('summary', null, 'Chưa có layout? Xem mặt bằng mẫu (minh hoạ, không phải căn thật)'), _o1t)] });
}
async function scan(viaChat) {
if (_o1m.busy) return;
if (!_o1m.layout || !_o1m.layoutBlob) return _oy(why1, 'Cần tải layout trước: bấm "📂 Tải ảnh/PDF layout căn" (ảnh hoặc PDF mặt bằng của chủ đầu tư), rồi bấm lại "AI quét layout".');
if (!viaChat && !G.aiReady()) return _oy(why1, 'Chưa nối AI tự động (dán khoá Gemini ở Cài đặt › Kết nối; nhân viên: nhờ Quản trị).' + (G.canChat() ? ' Bấm "Làm qua chat Claude/Gemini (miễn phí)",' : '') + ' hoặc bấm "✍️ Tự nhập kích thước phòng" và nhập theo số đo trên layout.');
why1.replaceChildren();
_o1m.busy = true;
scanOut.replaceChildren(h('p', { class: 'bds-muted g5-small', 'data-testid': 'c3-scan-busy' }, viaChat ? 'Đang chờ anh/chị dán kết quả từ chat…' : 'Đang tính chi phí…'));
try {
const prompt = L.layoutPrompt({ unit: _o1m.unit, project: _o1m.project });
let text = null, cost = null;
if (viaChat) text = await G.aiChat(prompt);
else {
const img = _o1m.layout.ai || await fileForAi(_o1m.layoutBlob);
const r = await G.aiRead({ title: '🤖 AI quét layout căn hộ', prompt, images: [img], testid: 'c3-scan-cost', what: _o1m.layout.mime === 'application/pdf' ? `PDF ${img.pages} trang` : '1 ảnh layout' });
if (r) { scanOut.replaceChildren(h('p', { class: 'bds-muted g5-small', 'data-testid': 'c3-scan-busy' }, 'AI đang quét layout… (thường 10–40 giây)')); text = r.text; cost = r; }
}
if (!text) { scanOut.replaceChildren(); return; }
let _ow = L.normalizeLayout3d(text), demo = false;
if (!_ow.ok && _ow.reason === 'demo') { _ow = L.normalizeLayout3d(L.DEMO_SCAN); demo = true; }
if (!_ow.ok) { scanOut.replaceChildren(G.note(_ow.warnings[_ow.warnings.length - 1] + '. Thử lại, làm qua chat, hoặc bấm "✍️ Tự nhập kích thước phòng".', 'danger', 'c3-scan-error')); return; }
_o1m.plan = _ow.plan; _o1m.mode = 'layout'; _o1m.illustrative = false; _o1m.confirmed = false; _o1m.built = false;
_o1m.scan = { at: Date.now(), demo, facing: _ow.facing, northDeg: _ow.northDeg, estimated: _ow.estimated, warnings: _ow.warnings, confidence: _ow.summary.confidence,
summary: { area_m2: _ow.summary.area_m2, area_kind: _ow.summary.area_kind, bedrooms: _ow.summary.bedrooms, wc: _ow.summary.wc, unit_code: _ow.summary.unit_code },
cost: cost ? { usd: cost.cost_usd, model: cost.model } : null, via: viaChat ? 'chat' : 'gemini' };
if (!_o1m.unit && _ow.summary.unit_code) _o1m.unit = _ow.summary.unit_code;
scanOut.replaceChildren(G.note(`AI đã điền ${_ow.plan.rooms.length} phòng – soát từng số đo ở bước 2 bên dưới.`, 'success', 'c3-scan-ok'));
_o1l();
const _o1h = _o1f.querySelector('[data-testid="c3-review"]'); scrollToEl(_o1h, 'start');
} catch (e) {
scanOut.replaceChildren(G.note('AI chưa quét được: ' + ((e && e.message) || 'lỗi') + '. Bấm "✍️ Tự nhập kích thước phòng" để nhập theo layout.', 'danger', 'c3-scan-error'));
} finally { _o1m.busy = false; }
}
function _ou() {
if (!_o1m.layout) return _oy(why1, 'Cần tải layout trước – anh/chị nhập số đo theo đúng layout đó (bấm "📂 Tải ảnh/PDF layout căn").');
why1.replaceChildren();
_o1m.mode = 'layout'; _o1m.illustrative = false; _o1m.built = false; _o1m.confirmed = false;
if (!_o1m.scan) _o1m.scan = { at: Date.now(), via: 'tay', warnings: [] };
_o1l();
const _o16 = _o1f.querySelector('[data-testid="c3-q-w"]'); if (_o16) { _o16.focus(); if (_o16.scrollIntoView) _o16.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
}
const _o1c = { kind: 'ngu', name: '', w: '', d: '' };
let _o3 = false;
function _oj() {
const parts = [_or()];
if (_o1m.mode !== 'none') parts.push(_o1e());
parts.push(_o8());
_o1u.replaceChildren(...parts);
_og();
const _ot = !_o1m.built;
const _os = _o1x ? K.button(stage.classList.contains('g5-locked') ? '✋ Xoay 3D bằng tay: Tắt' : '✋ Xoay 3D bằng tay: Bật', () => { stage.classList.toggle('g5-locked'); _oj(); }, { testid: 'c3-touch' }) : null;
const gate = (fn) => () => { if (_ot) { _ob.replaceChildren(G.note(!_o1m.layout && _o1m.mode !== 'demo' ? 'Chưa có căn để xem: tải layout (bước 1), quét hoặc nhập số đo, soát rồi bấm "🧱 Dựng 3D".' : 'Chưa dựng 3D: soát số đo (bước 2), tick "đã đối chiếu" rồi bấm "🧱 Dựng 3D" (bước 3).', 'warn')); return; } _ob.replaceChildren(); fn(); };
ctrl.replaceChildren(
K.button(_o1m.furn ? '✓ Nội thất 3D' : 'Nội thất 3D', gate(() => { _o1m.furn = !_o1m.furn; _o1l(); }), { testid: 'c3-furn' }),
K.button(_o1m.cut ? '✓ Hạ tường' : 'Hạ tường', gate(() => { _o1m.cut = !_o1m.cut; _o1d(); _o1l(); }), { testid: 'c3-cut', icon: _o1m.cut ? undefined : 'down' }),
K.button('Nhìn từ trên', gate(() => _o1x && _o1x.view('top')), { testid: 'c3-top', icon: 'layout' }),
K.button('Phối cảnh', gate(() => _o1x && _o1x.view('persp')), { testid: 'c3-persp', icon: 'eye' }),
K.button('▶ Dẫn tour', gate(() => tour()), { kind: 'primary', testid: 'c3-tour' }),
K.button('Dừng tour', () => { if (_o1x) _o1x.stopTour(); caption.textContent = ''; }, { testid: 'c3-stop', icon: 'close' }),
_os);
}
function _o1e() {
const sc = _o1m.scan;
const rows = _o1m.plan.rooms.map((r, i) => h('tr', null,
h('td', null, h('input', { value: r.name, 'aria-label': 'Tên phòng', 'data-testid': 'c3-rname-' + i, onchange: (e) => { r.name = e.target.value; _o9(); } })),
h('td', null, G.select(Object.entries(P.KINDS).map(([_op, v]) => [_op, v.vi]), r.kind, { 'aria-label': 'Loại phòng', 'data-testid': 'c3-rkind-' + i, onchange: (e) => { r.kind = e.target.value; _o9(); } })),
...['w', 'd', 'x', 'y'].map((_ok) => h('td', null, h('input', { type: 'number', step: 0.1, value: r[_ok], 'aria-label': { w: 'Rộng (m)', d: 'Sâu (m)', x: 'x (m)', y: 'y (m)' }[_ok], 'data-testid': `c3-r${_ok}-${i}`, onchange: (e) => { r[_ok] = G.num(e.target.value, r[_ok]); delete r.src; if (_ok === 'x' || _ok === 'y') _o3 = false; _o9(); } }))),
h('td', { class: 'num' }, vn(r.w * r.d) + ' m²', r.src === 'uoc' ? h('div', { class: 'g5-small', title: 'AI ước lượng – không có số đo trên ảnh' }, '⚠ ước lượng') : null),
h('td', null, K.button('✕', () => { _o1m.plan.rooms.splice(i, 1); _o1m.plan.links = _o1m.plan.links.filter((l) => l.every((id) => _o1m.plan.rooms.some((_o16) => _o16.id === id))); _o9(); }, { title: 'Xoá phòng', testid: 'c3-rdel-' + i }))));
const _o18 = G.select(Object.entries(P.KINDS).map(([_op, v]) => [_op, v.vi]), _o1c.kind, { 'data-testid': 'c3-q-kind', 'aria-label': 'Loại phòng mới', onchange: (e) => { _o1c.kind = e.target.value; } });
const _o19 = G.input({ value: _o1c.name, placeholder: 'Tên (vd Phòng ngủ 2)', 'data-testid': 'c3-q-name', oninput: (e) => { _o1c.name = e.target.value; } });
const _o1a = G.input({ type: 'number', step: 0.1, min: 0.5, value: _o1c.w, placeholder: 'Rộng (m)', 'data-testid': 'c3-q-w', oninput: (e) => { _o1c.w = e.target.value; } });
const _o17 = G.input({ type: 'number', step: 0.1, min: 0.5, value: _o1c.d, placeholder: 'Sâu (m)', 'data-testid': 'c3-q-d', oninput: (e) => { _o1c.d = e.target.value; } });
const qErr = h('div', { 'data-testid': 'c3-q-err', 'aria-live': 'polite' });
const addRoom = () => {
const r = { name: _o1c.name.trim() || P.KINDS[_o1c.kind].vi, kind: _o1c.kind, w: String(_o1c.w).trim() === '' ? NaN : G.num(_o1c.w, NaN), d: String(_o1c.d).trim() === '' ? NaN : G.num(_o1c.d, NaN) };
const _o5 = L.checkRoom(r);
if (_o5) { qErr.replaceChildren(G.note(_o5 + ' Đọc số đo trên layout (mm ÷ 1000 = m).', 'warn')); return; }
const _o1w = new Set(_o1m.plan.rooms.map((x) => x.id));
let id = 'p' + (_o1m.plan.rooms.length + 1); for (let _op = 2; _o1w.has(id); _op++) id = 'p' + (_o1m.plan.rooms.length + _op);
const _o4 = P.bounds(_o1m.plan.rooms);
_o1m.plan.rooms.push({ id, ...r, x: _o1m.plan.rooms.length ? Math.round((_o4.x + _o4.w) * 100) / 100 : 0, y: 0 });
if (_o3 || _o1m.plan.rooms.length === 1) { _o3 = true; _o1m.plan.rooms = L.autoArrange(P.cleanRooms(_o1m.plan.rooms)); }
Object.assign(_o1c, { name: '', w: '', d: '' });
_o9();
};
const _o1n = sc && sc.summary ? [
sc.summary.area_m2 ? `Diện tích ghi trên layout: ${vn(sc.summary.area_m2)} m²${sc.summary.area_kind === 'thong_thuy' ? ' (thông thuỷ)' : sc.summary.area_kind === 'tim_tuong' ? ' (tim tường)' : ''}` : '',
sc.summary.bedrooms != null ? `${sc.summary.bedrooms} phòng ngủ` : '', sc.summary.wc != null ? `${sc.summary.wc} WC` : '',
sc.facing ? `ban công/lô gia nhìn hướng ${sc.facing} (theo mũi tên Bắc trên ảnh)` : '',
sc.confidence != null ? `AI tự đánh giá độ tin ${Math.round(sc.confidence * 100)}%` : ''].filter(Boolean).join(' · ') : '';
return K.card({ testid: 'c3-review', title: '2. Soát số đo các phòng', body: [
sc && sc.demo ? G.note('Chế độ Xem thử: AI giả không đọc ảnh – đây là KẾT QUẢ MẪU, không phải số đo layout của anh/chị.', 'warn', 'c3-scan-demo') : null,
sc && sc.via === 'tay' && !_o1m.plan.rooms.length ? G.note('Nhập từng phòng theo layout: chọn loại, gõ rộng × sâu (mét), bấm "+ Thêm phòng". App xếp tạm vị trí – sửa x, y nếu muốn đúng hình dạng.', 'info', 'c3-manual-help') : null,
_o1n ? h('p', { class: 'g5-small', 'data-testid': 'c3-scan-sum' }, _o1n) : null,
sc && sc.warnings && sc.warnings.length ? h('div', { class: 'g5-list', 'data-testid': 'c3-scan-warn' }, ...sc.warnings.map((w) => G.note(w, 'warn'))) : null,
h('div', { class: 'g5-table-wrap' }, h('table', { class: 'g5-table g5-rooms' },
h('thead', null, h('tr', null, ...['Phòng', 'Loại', 'Rộng (m)', 'Sâu (m)', 'x (m)', 'y (m)', 'Diện tích', ''].map((x) => h('th', null, x)))),
h('tbody', null, ...rows))),
h('div', { class: 'g5-form', 'data-testid': 'c3-quick' }, G.field('Loại phòng', _o18), G.field('Tên', _o19), G.field('Rộng (m)', _o1a), G.field('Sâu (m)', _o17)),
qErr,
h('div', { class: 'g5-row' }, K.button('+ Thêm phòng', addRoom, { testid: 'c3-add-room' }),
K.button('Xếp lại tự động', () => { if (!_o1m.plan.rooms.length) { qErr.replaceChildren(G.note('Chưa có phòng nào để xếp – thêm phòng trước.', 'warn')); return; } _o3 = true; _o1m.plan.rooms = L.autoArrange(P.cleanRooms(_o1m.plan.rooms)); _o9(); }, { testid: 'c3-arrange', icon: 'refresh', title: 'Giữ nguyên rộng × sâu, xếp lại vị trí cho không chồng nhau' }),
K.button('Cửa tự động', () => { _o1m.plan.links = []; _o9(); K.toast('Đã đặt cửa theo phòng khách / sảnh / hành lang.', 'success'); }, { testid: 'c3-autolinks', icon: 'link', title: 'Bỏ danh sách cửa đọc được, tự nối phòng kề phòng trung tâm' })),
errBox, areaBox, plan2dBox,
_o1m.mode === 'layout' ? h('label', { class: 'g5-row g5-small' }, h('input', { type: 'checkbox', checked: _o1m.confirmed, 'data-testid': 'c3-confirm', onchange: (e) => { _o1m.confirmed = e.target.checked; why3.replaceChildren(); _oi(); } }),
'Tôi đã đối chiếu từng số đo với layout (AI có thể đọc sai)') : null] });
}
function _o8() {
const _ox = G.input({ value: _o1m.name, placeholder: 'vd Căn A-12-05', 'data-testid': 'c3-name', oninput: (e) => { _o1m.name = e.target.value; } });
const _o1v = G.input({ value: _o1m.unit, placeholder: 'Mã căn', 'data-testid': 'c3-unit', oninput: (e) => { _o1m.unit = e.target.value; _oe(); } });
return K.card({ testid: 'c3-build-card', title: '3. Dựng 3D & lưu', body: [
h('div', { class: 'g5-row' }, K.button(_o1m.built ? '🧱 Dựng lại 3D' : '🧱 Dựng 3D từ số đo này', () => _o6(), { kind: 'primary', testid: 'c3-build' })),
why3,
h('div', { class: 'g5-form' }, G.field('Tên', _ox), G.field('Mã căn', _o1v)),
h('div', { class: 'g5-row' }, K.button('Lưu căn', () => _o1i(), { kind: 'primary', testid: 'c3-save' }),
_oc() ? K.button('Dùng cho video dẫn tour (mức 3)', () => _o1s(), { testid: 'c3-to-video', icon: 'film' }) : null)] });
}
function _o7() {
if (_o1m.mode === 'none') return 'Chưa có layout: bấm "📂 Tải ảnh/PDF layout căn" ở bước 1 (bắt buộc), rồi cho AI quét hoặc tự nhập kích thước phòng.';
if (!_on()) return 'Chưa có phòng nào: bấm "🤖 AI quét layout" hoặc nhập từng phòng (rộng × sâu) ở bước 2.';
const errs = L.planErrors(_o1m.plan.rooms);
if (errs.length) return 'Sửa lỗi số đo trước: ' + errs.slice(0, 3).join('; ') + (errs.length > 3 ? '…' : '') + '.';
if (_o1m.mode === 'layout' && !_o1m.confirmed) return 'Tick ô "Tôi đã đối chiếu từng số đo với layout" ở cuối bước 2 rồi bấm lại.';
return '';
}
function _o6() {
const _o1y = _o7();
if (_o1y) { _oy(why3, _o1y); return; }
why3.replaceChildren(); _o1m.built = true; _o1l();
K.toast(_o1x ? 'Đã dựng 3D – kéo để xoay, bấm "▶ Dẫn tour".' : 'Đã dựng mặt bằng 2D (máy không có WebGL).', 'success');
if (stage.scrollIntoView && !stage.hidden) stage.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
function _o9() {
_o1m.plan.rooms = P.cleanRooms(_o1m.plan.rooms).map((r, i) => ({ ...r, src: _o1m.plan.rooms[i] && _o1m.plan.rooms[i].src }));
if (_o1m.built && _o7()) _o1m.built = false;
_o1l();
}
function _og() {
const errs = _o1m.plan.rooms.length ? L.planErrors(_o1m.plan.rooms) : [];
errBox.replaceChildren(...errs.map((e) => G.note(e, 'danger')));
const _o2 = P.areas(_o1m.plan.rooms);
areaBox.replaceChildren(_o1m.plan.rooms.length ? h('p', { class: 'g5-small' }, `Trong nhà ${String(_o2.indoor).replace('.', ',')} m² · lô gia/ban công ${String(_o2.outdoor).replace('.', ',')} m² · ${_o2.bedrooms} phòng ngủ · ${_o2.baths} vệ sinh`) : '');
plan2dBox.replaceChildren(_o1m.plan.rooms.length ? plan2d(_o1m.plan, { furnitureOn: _o1m.furn }) : '');
_o1q.textContent = !_o1m.built ? 'Chưa dựng' : _o1m.illustrative ? 'Mặt bằng minh hoạ' : _o1m.scan && _o1m.scan.demo ? 'Kết quả mẫu (dùng thử)' : 'Theo layout đã soát';
}
function _o1d() {
empty.hidden = _o1m.built || _o1m.step !== 'can';
if (!_o1x || _o1m.step !== 'can') return;
_o1x.showPlan(_o1m.built ? _o1m.plan : { rooms: [], links: [], entry: null }, { withFurniture: _o1m.furn, cutaway: _o1m.cut });
}
function tour() {
const path = P.walkPath(_o1m.plan);
if (path.length < 2) { _ob.replaceChildren(G.note('Mặt bằng chưa có cửa nối các phòng – bấm "Cửa tự động" ở bước 2 hoặc kiểm lại các phòng có kề nhau không.', 'warn')); return; }
plan2dBox.replaceChildren(plan2d(_o1m.plan, { furnitureOn: _o1m.furn, path }));
if (!_o1x) { caption.textContent = ''; fallback.querySelectorAll('[data-testid="c3-tour-list"]').forEach((x) => x.remove()); fallback.append(h('ol', { class: 'g5-small', 'data-testid': 'c3-tour-list' }, ...path.filter((_o11) => _o11.stop).map((_o11) => h('li', null, `${_o11.name}: ${_o11.say}`)))); return; }
_o1x.showPlan(_o1m.plan, { withFurniture: _o1m.furn, cutaway: true, labels: false });
_o1x.tour(path, { onStep: (_o11) => { caption.textContent = (_o11.name ? _o11.name + ' – ' : '') + (_o11.say || ''); }, onDone: () => { caption.textContent = 'Kết thúc tour. Cảm ơn anh chị đã theo dõi.'; } });
}
async function _o1i() {
if (!_on()) return _oy(why3, 'Chưa có mặt bằng để lưu: tải layout và quét/nhập số đo trước (bước 1–2).');
const errs = L.planErrors(_o1m.plan.rooms);
if (errs.length) return _oy(why3, 'Sửa lỗi số đo trước khi lưu: ' + errs.slice(0, 2).join('; ') + '.');
const name = _o1m.name || _o1m.unit || 'Căn ' + new Date().toLocaleDateString('vi-VN');
const plan = { rooms: _o1m.plan.rooms.map(({ src, ...r }) => r), links: _o1m.plan.links, entry: _o1m.plan.entry };
const layout = _o1m.layout ? { name: _o1m.layout.name, mime: _o1m.layout.mime, pages: _o1m.layout.pages, w: _o1m.layout.w || null, h: _o1m.layout.h || null } : null;
const _o1k = _o1m.scan ? { at: _o1m.scan.at, via: _o1m.scan.via, demo: !!_o1m.scan.demo, facing: _o1m.scan.facing || null, confidence: _o1m.scan.confidence ?? null, summary: _o1m.scan.summary || null, estimated: !!_o1m.scan.estimated } : null;
let _o1g;
try {
_o1g = await G.saveDoc(KIND, { id: _o1m.id, name, data: { project: _o1m.project, unit: _o1m.unit, tower: _o1m.tower, floor: _o1m.floor, towers: _o1m.towers, plan, illustrative: _o1m.illustrative || _o1m.mode === 'demo', layout, scan: _o1k, confirmed: _o1m.confirmed } });
} catch (e) { return _oy(why3, 'Chưa lưu được: ' + ((e && e.message) || 'lỗi')); }
_o1m.id = _o1g.id; _o1m.name = name;
if (_o1m.layoutBlob) { try { await files.put(_o1g.id, _o1m.layoutBlob, { name: _o1m.layout.name }); } catch { K.toast('Không lưu được tệp layout trên máy này – số đo vẫn được lưu.', 'warn'); } }
K.toast('Đã lưu căn.', 'success'); _oh();
return _o1g;
}
function _oc() {
const _o11 = ctx.user && ctx.user.perms;
if (_o11 && _o11.video === false) return false;
try { return !ctx.packs || ctx.packs.moduleOn('g5_dandan'); } catch { return true; }
}
async function _o1s() {
if (!_o1m.built) return _oy(why3, 'Dựng 3D trước (bấm "🧱 Dựng 3D") rồi mới dùng cho video dẫn tour.');
const _o1g = _o1m.id ? { id: _o1m.id } : await _o1i();
if (_o1g && _o1g.id) K.nav('content/g5_dandan?plan=' + _o1g.id);
}
async function _oh() {
const _od = await G.listDocs(KIND);
_o1j.replaceChildren(...(_od.length ? _od.slice(0, 30).map((d) => h('div', { class: 'g5-li' }, h('div', null, h('b', null, d.name), h('div', { class: 'bds-muted g5-small' }, [d.data.project, d.data.unit, d.data.layout ? 'có layout' : '', d.data.illustrative ? 'minh hoạ' : ''].filter(Boolean).join(' · '))),
h('div', { class: 'g5-row' }, K.button('Mở', () => _o10(d), { testid: 'c3-open-' + d.id }), K.button('Xoá', async () => { if (!(await G.confirmDel(d.name, 'c3-del-c'))) return; await G.removeDoc(d.id); await files.del(d.id).catch(() => {}); _oh(); }, { kind: 'danger', testid: 'c3-del-' + d.id })))) : [K.empty('Chưa lưu căn nào.')]));
}
async function _o10(d) {
Object.assign(_o1m, { id: d.id, name: d.name, project: d.data.project || '', unit: d.data.unit || '', tower: d.data.tower || 0, floor: d.data.floor || 1, towers: d.data.towers || _o1m.towers, illustrative: !!d.data.illustrative });
_o1m.plan = { rooms: P.cleanRooms((d.data.plan || {}).rooms || []), links: ((d.data.plan || {}).links || []), entry: (d.data.plan || {}).entry || null };
_o1m.scan = d.data.scan ? { warnings: [], ...d.data.scan } : null; _o1m.confirmed = !!d.data.confirmed;
_o1m.layout = null; _o1m.layoutBlob = null;
const _ok = d.data.layout ? await files.get(d.id).catch(() => null) : null;
if (_ok && _ok.blob) await _o12(_ok.blob, { keepPlan: true });
if (d.data.layout && !_o1m.layout) _o1m.layout = { ...d.data.layout };
_o1m.mode = d.data.illustrative && !d.data.layout ? 'demo' : 'layout';
_o1m.built = !L.planErrors(_o1m.plan.rooms).length && (_o1m.mode === 'demo' || _o1m.confirmed || !d.data.layout);
_o1m.step = 'can'; tabs.set('can'); _o1l();
}
_o1l(); _oh();
if (_o1b.get('open')) { const d = await G.getDoc(KIND, _o1b.get('open')); if (d) await _o10(d); }
const _oz = new MutationObserver(() => { if (!_o1f.isConnected) { if (_o1x) _o1x.dispose(); if (_o1m.layoutUrl) URL.revokeObjectURL(_o1m.layoutUrl); _oz.disconnect(); } });
_oz.observe(document.body, { childList: true, subtree: true });
return _o1f;
}
export default {
manifest: {
id: 'g5_can3d', title: 'Căn hộ 3D', icon: '🏠', screen: 'sales', order: 550, version: '0.1.0', status: 'ready',
desc: 'Thử nghiệm · tải layout → AI quét phòng → soát số đo → 3D, dẫn tour',
help: 'Tải ảnh/PDF layout mặt bằng căn (bắt buộc). AI quét phòng, kích thước, cửa, hướng (báo phí trước) – hoặc tự nhập rộng × sâu từng phòng. Soát số đo, tick "đã đối chiếu" rồi dựng 3D, bật nội thất và cho nhân vật dẫn tour qua từng phòng. Mẫu có sẵn chỉ để minh hoạ.',
},
mount,
async selftest(ctx) {
return selftestWith(ctx, () => {
const t = P.TEMPLATES[0]; const plan = { rooms: P.cleanRooms(t.rooms), links: t.links, entry: t.entry };
const s = L.normalizeLayout3d(L.DEMO_SCAN);
return P.validate(plan.rooms).length === 0 && P.walkPath(plan).length > 2 && s.ok && L.planErrors(s.plan.rooms).length === 0;
});
},
};

import { g5, h, files, loadImage, scrollToEl, selftestWith, fileForAi } from '../g5_lib/ui.js';
import * as P from '../g5_lib/plan3d.js';
import * as L from '../g5_lib/layout3d.js';
const KIND = 'g5_can3d';
const _o0 = 'http://www.w3.org/2000/svg';
const _o1r = (_o1t, attrs = {}, ...kids) => { const e = document.createElementNS(_o0, _o1t); for (const [_os, v] of Object.entries(attrs)) e.setAttribute(_os, v); kids.forEach((_os) => _os && e.appendChild(typeof _os === 'string' ? document.createTextNode(_os) : _os)); return e; };
const vn = (x, d = 1) => String(Math.round(Number(x) * 10 ** d) / 10 ** d).replace('.', ',');
export function plan2d(plan, { furnitureOn = false, path = null } = {}) {
const _o5 = P.bounds(plan.rooms), pad = 0.6, _os = 40;
const _o1 = (_o5.w + pad * 2) * _os, H = (_o5.d + pad * 2) * _os;
const _o2 = (x) => (x - _o5.x + pad) * _os, Y = (y) => (y - _o5.y + pad) * _os;
const _o1s = _o1r('svg', { viewBox: `0 0 ${_o1} ${H}`, class: 'g5-canvas', role: 'img', 'aria-label': 'Mặt bằng 2D', 'data-testid': 'c3-plan2d' });
for (const r of plan.rooms) {
_o1s.appendChild(_o1r('rect', { x: _o2(r.x), y: Y(r.y), width: r.w * _os, height: r.d * _os, fill: (P.KINDS[r.kind] || P.KINDS.khach).color }));
if (furnitureOn) for (const _ol of P.furniture(r)) _o1s.appendChild(_o1r('rect', { x: _o2(_ol.x), y: Y(_ol.y), width: _ol.w * _os, height: _ol.d * _os, fill: _ol.color, opacity: 0.8, rx: 3 }));
_o1s.appendChild(_o1r('text', { x: _o2(r.x + r.w / 2), y: Y(r.y + r.d / 2), 'font-size': 12, 'text-anchor': 'middle', fill: '#0F1E33', 'font-weight': 600 }, r.name));
_o1s.appendChild(_o1r('text', { x: _o2(r.x + r.w / 2), y: Y(r.y + r.d / 2) + 14, 'font-size': 10, 'text-anchor': 'middle', fill: '#5F6979' }, `${String(r.w).replace('.', ',')} × ${String(r.d).replace('.', ',')} m`));
}
const { walls, doors } = P.buildWalls(plan);
for (const w of walls) _o1s.appendChild(_o1r('line', { x1: _o2(w.x1), y1: Y(w.y1), x2: _o2(w.x2), y2: Y(w.y2), stroke: w.kind === 'rail' ? '#6E8BA3' : '#0F1E33', 'stroke-width': w.kind === 'rail' ? 3 : 5, 'stroke-linecap': 'square' }));
for (const d of doors) _o1s.appendChild(_o1r('circle', { cx: _o2(d.x), cy: Y(d.y), r: 4, fill: d.kind === 'entry' ? '#B4423A' : '#C9A24A' }));
if (path && path.length > 1) _o1s.appendChild(_o1r('polyline', { points: path.map((_o14) => _o2(_o14.x) + ',' + Y(_o14.y)).join(' '), fill: 'none', stroke: '#B4423A', 'stroke-width': 2, 'stroke-dasharray': '6 4' }));
return _o1s;
}
export async function mount(el, ctx) {
const G = g5(ctx), K = G.K;
const _o1p = {
id: null, name: '', step: 'can', project: '', unit: '', tower: 0, floor: 12,
towers: [{ name: 'Toà A', floors: 30, w: 40, d: 25 }, { name: 'Toà B', floors: 25, w: 40, d: 25 }],
mode: 'none', plan: { rooms: [], links: [], entry: null }, illustrative: false, furn: true, cut: false,
layout: null, layoutBlob: null, layoutUrl: '', scan: null, confirmed: false, built: false, busy: false,
};
function _o1u(id) { const t = P.TEMPLATES.find((x) => x.id === id) || P.TEMPLATES[0]; return { rooms: P.cleanRooms(t.rooms), links: t.links.map((l) => [...l]), entry: { ...t.entry } }; }
const _o1i = h('div', { class: 'g5', 'data-testid': 'g5-can3d' });
el.replaceChildren(_o1i);
const _o1e = new URLSearchParams((location.hash.split('?')[1] || ''));
const _ob = (() => { try { return matchMedia('(pointer: coarse)').matches; } catch { return false; } })();
const crumb = h('div', { class: 'g5-row g5-small', 'data-testid': 'c3-crumb' });
const tabs = G.tabs([['tongquan', '1. Tổng quan dự án'], ['can', '2. Căn hộ & nội thất 3D']], _o1p.step, (v) => { _o1p.step = v; _o1o(); }, 'c3-step');
const stage = h('div', { class: 'g5-three' + (_ob ? ' g5-locked' : ''), 'data-testid': 'c3-3d' });
const caption = h('div', { class: 'g5-caption', 'data-testid': 'c3-caption', 'aria-live': 'polite' });
const _o1t = h('div', { class: 'g5-tag' }, 'Chưa dựng');
const hint = h('div', { class: 'g5-maphint', hidden: true, 'data-testid': 'c3-hint' });
const empty = h('div', { class: 'g5-maphint', 'data-testid': 'c3-stage-empty' }, 'Chưa dựng 3D căn hộ. Làm bước 1 (tải layout) và bước 2 (soát số đo) rồi bấm "🧱 Dựng 3D".');
stage.append(_o1t, caption, hint, empty);
const fallback = h('div', { 'data-testid': 'c3-fallback' });
const ctrl = h('div', { class: 'g5-row' });
const _oc = h('div', { 'data-testid': 'c3-why-ctrl', 'aria-live': 'polite' });
const overview = h('div');
const _o1x = h('div');
const plan2dBox = h('div', { class: 'g5-plan2d' });
const errBox = h('div', { 'data-testid': 'c3-errors' });
const areaBox = h('div', { 'data-testid': 'c3-area' });
const _o1m = h('div', { class: 'g5-list', 'data-testid': 'c3-saved' });
const illu = G.note(P.ILLU, 'warn', 'c3-illu');
const stepsBox = h('div', { class: 'g5-steps', 'data-testid': 'c3-steps' });
_o1i.append(
G.head('Căn hộ 3D', 'Tải layout mặt bằng căn → AI quét (hoặc tự nhập) kích thước từng phòng → soát số đo → dựng 3D, bật nội thất, cho nhân vật dẫn tour.', 'c3-head'),
stepsBox, illu, crumb, tabs,
h('div', { class: 'g5-grid' }, h('div', null, stage, fallback, ctrl, _oc), h('div', null, overview, _o1x)),
K.card({ title: 'Đã lưu', body: _o1m }),
);
let _o20 = null;
try {
const { createViewer } = await import('./viewer.js');
_o20 = await createViewer(stage);
} catch (e) { _o20 = null; }
let _oq = 0;
const _on = (t) => { hint.textContent = t; hint.hidden = false; clearTimeout(_oq); _oq = setTimeout(() => { hint.hidden = true; }, 2200); };
if (_o20) {
_o20.onLockedTouch = () => _on('Bấm "✋ Xoay 3D bằng tay" dưới khung để xoay/phóng bằng ngón tay. Vuốt lên/xuống để cuộn trang.');
_o20.onLockedWheel = () => _on('Bấm vào khung 3D (hoặc giữ Ctrl) rồi lăn chuột để phóng to/thu nhỏ.');
}
if (!_o20) { stage.hidden = true; fallback.replaceChildren(G.note('Máy/trình duyệt này không hiển thị được 3D (WebGL). Đang dùng mặt bằng 2D.', 'info', 'c3-no-webgl')); }
stage.dataset.ready = _o20 ? '1' : '0';
const _op = () => _o1p.plan.rooms.length > 0;
function _oj() {
const s = [
['1', 'Tải layout', _o1p.mode === 'layout' || _o1p.mode === 'demo'],
['2', 'Quét / nhập số đo', _op()],
['3', 'Soát & xác nhận', _o1p.mode === 'demo' ? _op() : _o1p.confirmed && _op()],
['4', 'Dựng 3D & dẫn tour', _o1p.built],
];
const next = s.find((x) => !x[2]);
stepsBox.replaceChildren(...s.map(([_oz, label, done]) => h('span', { class: 'g5-stepchip' + (done ? ' done' : next && next[0] === _oz ? ' next' : ''), 'data-testid': 'c3-stepchip-' + _oz, 'data-done': done ? '1' : '0' }, h('b', null, done ? '✓' : _oz), label)));
illu.hidden = _o1p.mode !== 'demo';
}
function _of() {
const _o16 = _o1p.project || 'Dự án';
crumb.replaceChildren(h('span', null, _o16), ' › ', h('span', null, (_o1p.towers[_o1p.tower] || {}).name || 'Toà'), ' › ', h('span', null, 'Tầng ' + _o1p.floor), ' › ', h('b', null, _o1p.unit || 'Căn'));
}
function _o1o() {
_of(); _oj();
overview.hidden = _o1p.step !== 'tongquan'; _o1x.hidden = _o1p.step !== 'can';
if (_o1p.step === 'tongquan') { _og(); empty.hidden = true; if (_o20) _o20.showTowers(_o1p.towers, { tower: _o1p.tower, floor: _o1p.floor }); ctrl.replaceChildren(K.button('Xem căn ở tầng này →', () => { _o1p.step = 'can'; tabs.set('can'); _o1o(); }, { kind: 'primary', testid: 'c3-go-unit' })); _oc.replaceChildren(); }
else { _ok(); _o1g(); }
}
function _og() {
const projects = K.projects();
const _o18 = G.select([['', '— chọn dự án —'], ...projects.map((_o14) => [_o14.name, _o14.name])], _o1p.project, { 'data-testid': 'c3-project', onchange: (e) => { _o1p.project = e.target.value; _of(); } });
const rows = _o1p.towers.map((t, i) => h('div', { class: 'g5-li' },
h('div', { class: 'g5-form' }, G.field('Tên toà', G.input({ value: t.name, 'data-testid': 'c3-tname-' + i, onchange: (e) => { t.name = e.target.value; _o1o(); } })),
G.field('Số tầng', G.input({ type: 'number', min: 1, max: 100, value: t.floors, 'data-testid': 'c3-tfloors-' + i, onchange: (e) => { t.floors = Math.max(1, Math.round(G.num(e.target.value, 1))); _o1o(); } }))),
K.button(_o1p.tower === i ? '✓ Đang chọn' : 'Chọn', () => { _o1p.tower = i; _o1o(); }, { testid: 'c3-tpick-' + i }), _o1p.towers.length > 1 ? K.button('✕', () => { _o1p.towers.splice(i, 1); _o1p.tower = 0; _o1o(); }, { title: 'Xoá toà' }) : null));
overview.replaceChildren(K.card({ title: 'Tổng quan dự án (khối minh hoạ)', body: [
G.field('Dự án', _o18), ...rows,
h('div', { class: 'g5-row' }, K.button('+ Thêm toà', () => { _o1p.towers.push({ name: 'Toà ' + String.fromCharCode(65 + _o1p.towers.length), floors: 25, w: 40, d: 25 }); _o1o(); }, { testid: 'c3-add-tower' }),
G.field('Tầng của căn', G.input({ type: 'number', min: 1, max: 100, value: _o1p.floor, 'data-testid': 'c3-floor', onchange: (e) => { _o1p.floor = Math.max(1, Math.round(G.num(e.target.value, 1))); _o1o(); } }))),
h('p', { class: 'bds-muted g5-small' }, 'Khối toà chỉ minh hoạ số tầng và vị trí tương đối – không phải phối cảnh kiến trúc.')] }));
}
const _om = h('input', { type: 'file', hidden: true, accept: 'image/png,image/jpeg,image/webp,application/pdf', 'data-testid': 'c3-layout-file', onchange: (e) => { const _ol = e.target.files && e.target.files[0]; e.target.value = ''; _o15(_ol); } });
const why1 = h('div', { 'data-testid': 'c3-why-1', 'aria-live': 'polite' });
const why3 = h('div', { 'data-testid': 'c3-why-3', 'aria-live': 'polite' });
const scanOut = h('div', { class: 'g5-list', 'data-testid': 'c3-scan-result', 'aria-live': 'polite' });
const _o11 = (box, msg) => { box.replaceChildren(G.note(msg, 'warn')); scrollToEl(box, 'nearest'); };
async function _o15(file, { keepPlan = false } = {}) {
if (!file) return;
if (file.size > 25 * 1024 * 1024) return _o11(why1, 'Tệp lớn hơn 25 MB – chụp/xuất riêng trang mặt bằng căn rồi tải lại.');
try {
const _or = /pdf/i.test(file.type || '') || /\.pdf$/i.test(file.name || '');
let _oy;
if (_or) { const ai = await fileForAi(file); _oy = { name: file.name || 'layout.pdf', mime: 'application/pdf', pages: ai.pages, ai }; }
else { const img = await loadImage(file); _oy = { name: file.name || 'layout', mime: file.type || 'image/jpeg', pages: 1, w: img.naturalWidth, h: img.naturalHeight, img }; }
if (_o1p.layoutUrl) URL.revokeObjectURL(_o1p.layoutUrl);
_o1p.layout = _oy; _o1p.layoutBlob = file; _o1p.layoutUrl = URL.createObjectURL(file);
if (!keepPlan) { _o1p.mode = 'layout'; _o1p.illustrative = false; _o1p.scan = null; _o1p.confirmed = false; _o1p.built = false; _o1p.plan = { rooms: [], links: [], entry: null }; scanOut.replaceChildren(); }
why1.replaceChildren(); _o1o();
} catch (e) { _o11(why1, (e && e.message) || 'Không đọc được tệp – thử ảnh PNG/JPG hoặc PDF khác.'); }
}
function _ou() {
const _ot = _o1p.layout;
const _o17 = !_ot ? null : _ot.mime === 'application/pdf'
? h('div', { class: 'g5-row g5-small' }, `📄 ${_ot.name} – PDF ${_ot.pages} trang.`, K.button('Mở PDF để đối chiếu', () => { try { window.open(_o1p.layoutUrl, '_blank', 'noopener'); } catch { } }, { testid: 'c3-layout-open' }))
: h('img', { class: 'g5-layout-img', src: _o1p.layoutUrl, alt: 'Layout mặt bằng căn đã tải', 'data-testid': 'c3-layout-preview' });
const _o1w = G.select([['', '— chọn mặt bằng mẫu (minh hoạ) —'], ...P.TEMPLATES.map((t) => [t.id, t.vi])], '', { 'aria-label': 'Mặt bằng mẫu (minh hoạ)', 'data-testid': 'c3-template', onchange: (e) => {
if (!e.target.value) return;
_o1p.plan = _o1u(e.target.value); _o1p.mode = 'demo'; _o1p.illustrative = true; _o1p.scan = null; _o1p.confirmed = false; _o1p.built = true; scanOut.replaceChildren(); _o1o();
} });
return K.card({ testid: 'c3-layout-card', title: '1. Layout mặt bằng căn (bắt buộc)', body: [
h('div', { class: 'g5-upload' },
h('div', { class: 'g5-row' }, K.button(_ot ? '📂 Đổi layout khác' : '📂 Tải ảnh/PDF layout căn', () => _om.click(), { kind: _ot ? 'ghost' : 'primary', testid: 'c3-layout-pick' }), _om),
h('p', { class: 'bds-muted g5-small', 'data-testid': 'c3-layout-info' }, _ot ? `Đã tải: ${_ot.name}${_ot.w ? ` – ${_ot.w} × ${_ot.h} px` : ''}. Tệp chỉ lưu trên máy này.`
: 'Ảnh (PNG/JPG/WebP) hoặc PDF mặt bằng căn của chủ đầu tư – càng rõ số đo (mm) và mũi tên chỉ Bắc thì AI quét càng đúng.'),
_o17),
h('div', { class: 'g5-row' },
K.button('🤖 AI quét layout', () => scan(false), { kind: _ot ? 'primary' : 'secondary', testid: 'c3-scan' }),
G.canChat() ? K.button('Làm qua chat Claude/Gemini (miễn phí)', () => scan(true), { testid: 'c3-scan-chat', icon: 'chat' }) : null,
K.button('✍️ Tự nhập kích thước phòng', () => _ox(), { testid: 'c3-manual' })),
h('p', { class: 'bds-muted g5-small', 'data-testid': 'c3-scan-fee' }, '💰 AI quét layout có thể mất phí Gemini – app báo chi phí và hỏi trước khi gửi. AI chỉ điền sẵn: anh/chị soát từng số đo.'),
why1, scanOut,
h('details', { 'data-testid': 'c3-demo' }, h('summary', null, 'Chưa có layout? Xem mặt bằng mẫu (minh hoạ, không phải căn thật)'), _o1w)] });
}
async function scan(viaChat) {
if (_o1p.busy) return;
if (!_o1p.layout || !_o1p.layoutBlob) return _o11(why1, 'Cần tải layout trước: bấm "📂 Tải ảnh/PDF layout căn" (ảnh hoặc PDF mặt bằng của chủ đầu tư), rồi bấm lại "AI quét layout".');
if (!viaChat && !G.aiReady()) return _o11(why1, 'Chưa nối AI tự động (dán khoá Gemini ở Cài đặt › Kết nối; nhân viên: nhờ Quản trị).' + (G.canChat() ? ' Bấm "Làm qua chat Claude/Gemini (miễn phí)",' : '') + ' hoặc bấm "✍️ Tự nhập kích thước phòng" và nhập theo số đo trên layout.');
why1.replaceChildren();
_o1p.busy = true;
scanOut.replaceChildren(h('p', { class: 'bds-muted g5-small', 'data-testid': 'c3-scan-busy' }, viaChat ? 'Đang chờ anh/chị dán kết quả từ chat…' : 'Đang tính chi phí…'));
try {
const prompt = L.layoutPrompt({ unit: _o1p.unit, project: _o1p.project });
let text = null, cost = null;
if (viaChat) text = await G.aiChat(prompt);
else {
const img = _o1p.layout.ai || await fileForAi(_o1p.layoutBlob);
const r = await G.aiRead({ title: '🤖 AI quét layout căn hộ', prompt, images: [img], testid: 'c3-scan-cost', what: _o1p.layout.mime === 'application/pdf' ? `PDF ${img.pages} trang` : '1 ảnh layout' });
if (r) { scanOut.replaceChildren(h('p', { class: 'bds-muted g5-small', 'data-testid': 'c3-scan-busy' }, 'AI đang quét layout… (thường 10–40 giây)')); text = r.text; cost = r; }
}
if (!text) { scanOut.replaceChildren(); return; }
let _oz = L.normalizeLayout3d(text), demo = false;
if (!_oz.ok && _oz.reason === 'demo') { _oz = L.normalizeLayout3d(L.DEMO_SCAN); demo = true; }
if (!_oz.ok) { scanOut.replaceChildren(G.note(_oz.warnings[_oz.warnings.length - 1] + '. Thử lại, làm qua chat, hoặc bấm "✍️ Tự nhập kích thước phòng".', 'danger', 'c3-scan-error')); return; }
_o1p.plan = _oz.plan; _o1p.mode = 'layout'; _o1p.illustrative = false; _o1p.confirmed = false; _o1p.built = false;
_o1p.scan = { at: Date.now(), demo, facing: _oz.facing, northDeg: _oz.northDeg, estimated: _oz.estimated, warnings: _oz.warnings, confidence: _oz.summary.confidence,
summary: { area_m2: _oz.summary.area_m2, area_kind: _oz.summary.area_kind, bedrooms: _oz.summary.bedrooms, wc: _oz.summary.wc, unit_code: _oz.summary.unit_code },
cost: cost ? { usd: cost.cost_usd, model: cost.model } : null, via: viaChat ? 'chat' : 'gemini' };
if (!_o1p.unit && _oz.summary.unit_code) _o1p.unit = _oz.summary.unit_code;
scanOut.replaceChildren(G.note(`AI đã điền ${_oz.plan.rooms.length} phòng – soát từng số đo ở bước 2 bên dưới.`, 'success', 'c3-scan-ok'));
_o1o();
const _o1k = _o1i.querySelector('[data-testid="c3-review"]'); scrollToEl(_o1k, 'start');
} catch (e) {
scanOut.replaceChildren(G.note('AI chưa quét được: ' + ((e && e.message) || 'lỗi') + '. Bấm "✍️ Tự nhập kích thước phòng" để nhập theo layout.', 'danger', 'c3-scan-error'));
} finally { _o1p.busy = false; }
}
function _ox() {
if (!_o1p.layout) return _o11(why1, 'Cần tải layout trước – anh/chị nhập số đo theo đúng layout đó (bấm "📂 Tải ảnh/PDF layout căn").');
why1.replaceChildren();
_o1p.mode = 'layout'; _o1p.illustrative = false; _o1p.built = false; _o1p.confirmed = false;
if (!_o1p.scan) _o1p.scan = { at: Date.now(), via: 'tay', warnings: [] };
_o1o();
const _o19 = _o1i.querySelector('[data-testid="c3-q-w"]'); if (_o19) { _o19.focus(); if (_o19.scrollIntoView) _o19.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
}
const _o1f = { kind: 'ngu', name: '', w: '', d: '' };
let _o4 = false;
function _ok() {
const parts = [_ou()];
if (_o1p.mode !== 'none') parts.push(_o1h());
parts.push(_o9());
_o1x.replaceChildren(...parts);
_oh();
const _ow = !_o1p.built;
const _ov = _o20 ? K.button(stage.classList.contains('g5-locked') ? '✋ Xoay 3D bằng tay: Tắt' : '✋ Xoay 3D bằng tay: Bật', () => { stage.classList.toggle('g5-locked'); _ok(); }, { testid: 'c3-touch' }) : null;
const _oo = (fn) => () => { if (_ow) { _oc.replaceChildren(G.note(!_o1p.layout && _o1p.mode !== 'demo' ? 'Chưa có căn để xem: tải layout (bước 1), quét hoặc nhập số đo, soát rồi bấm "🧱 Dựng 3D".' : 'Chưa dựng 3D: soát số đo (bước 2), tick "đã đối chiếu" rồi bấm "🧱 Dựng 3D" (bước 3).', 'warn')); return; } _oc.replaceChildren(); fn(); };
ctrl.replaceChildren(
K.button(_o1p.furn ? '✓ Nội thất 3D' : 'Nội thất 3D', _oo(() => { _o1p.furn = !_o1p.furn; _o1o(); }), { testid: 'c3-furn' }),
K.button(_o1p.cut ? '✓ Hạ tường' : 'Hạ tường', _oo(() => { _o1p.cut = !_o1p.cut; _o1g(); _o1o(); }), { testid: 'c3-cut', icon: _o1p.cut ? undefined : 'down' }),
K.button('Nhìn từ trên', _oo(() => _o20 && _o20.view('top')), { testid: 'c3-top', icon: 'layout' }),
K.button('Phối cảnh', _oo(() => _o20 && _o20.view('persp')), { testid: 'c3-persp', icon: 'eye' }),
K.button('▶ Dẫn tour', _oo(() => tour()), { kind: 'primary', testid: 'c3-tour' }),
K.button('Dừng tour', () => { if (_o20) _o20.stopTour(); caption.textContent = ''; }, { testid: 'c3-stop', icon: 'close' }),
_ov);
}
function _o1h() {
const sc = _o1p.scan;
const rows = _o1p.plan.rooms.map((r, i) => h('tr', null,
h('td', null, h('input', { value: r.name, 'aria-label': 'Tên phòng', 'data-testid': 'c3-rname-' + i, onchange: (e) => { r.name = e.target.value; _oa(); } })),
h('td', null, G.select(Object.entries(P.KINDS).map(([_os, v]) => [_os, v.vi]), r.kind, { 'aria-label': 'Loại phòng', 'data-testid': 'c3-rkind-' + i, onchange: (e) => { r.kind = e.target.value; _oa(); } })),
...['w', 'd', 'x', 'y'].map((_ol) => h('td', null, h('input', { type: 'number', step: 0.1, value: r[_ol], 'aria-label': { w: 'Rộng (m)', d: 'Sâu (m)', x: 'x (m)', y: 'y (m)' }[_ol], 'data-testid': `c3-r${_ol}-${i}`, onchange: (e) => { r[_ol] = G.num(e.target.value, r[_ol]); delete r.src; if (_ol === 'x' || _ol === 'y') _o4 = false; _oa(); } }))),
h('td', { class: 'num' }, vn(r.w * r.d) + ' m²', r.src === 'uoc' ? h('div', { class: 'g5-small', title: 'AI ước lượng – không có số đo trên ảnh' }, '⚠ ước lượng') : null),
h('td', null, K.button('✕', () => { _o1p.plan.rooms.splice(i, 1); _o1p.plan.links = _o1p.plan.links.filter((l) => l.every((id) => _o1p.plan.rooms.some((_o19) => _o19.id === id))); _oa(); }, { title: 'Xoá phòng', testid: 'c3-rdel-' + i }))));
const _o1b = G.select(Object.entries(P.KINDS).map(([_os, v]) => [_os, v.vi]), _o1f.kind, { 'data-testid': 'c3-q-kind', 'aria-label': 'Loại phòng mới', onchange: (e) => { _o1f.kind = e.target.value; } });
const _o1c = G.input({ value: _o1f.name, placeholder: 'Tên (vd Phòng ngủ 2)', 'data-testid': 'c3-q-name', oninput: (e) => { _o1f.name = e.target.value; } });
const _o1d = G.input({ type: 'number', step: 0.1, min: 0.5, value: _o1f.w, placeholder: 'Rộng (m)', 'data-testid': 'c3-q-w', oninput: (e) => { _o1f.w = e.target.value; } });
const _o1a = G.input({ type: 'number', step: 0.1, min: 0.5, value: _o1f.d, placeholder: 'Sâu (m)', 'data-testid': 'c3-q-d', oninput: (e) => { _o1f.d = e.target.value; } });
const qErr = h('div', { 'data-testid': 'c3-q-err', 'aria-live': 'polite' });
const addRoom = () => {
const r = { name: _o1f.name.trim() || P.KINDS[_o1f.kind].vi, kind: _o1f.kind, w: String(_o1f.w).trim() === '' ? NaN : G.num(_o1f.w, NaN), d: String(_o1f.d).trim() === '' ? NaN : G.num(_o1f.d, NaN) };
const _o6 = L.checkRoom(r);
if (_o6) { qErr.replaceChildren(G.note(_o6 + ' Đọc số đo trên layout (mm ÷ 1000 = m).', 'warn')); return; }
const _o1z = new Set(_o1p.plan.rooms.map((x) => x.id));
let id = 'p' + (_o1p.plan.rooms.length + 1); for (let _os = 2; _o1z.has(id); _os++) id = 'p' + (_o1p.plan.rooms.length + _os);
const _o5 = P.bounds(_o1p.plan.rooms);
_o1p.plan.rooms.push({ id, ...r, x: _o1p.plan.rooms.length ? Math.round((_o5.x + _o5.w) * 100) / 100 : 0, y: 0 });
if (_o4 || _o1p.plan.rooms.length === 1) { _o4 = true; _o1p.plan.rooms = L.autoArrange(P.cleanRooms(_o1p.plan.rooms)); }
Object.assign(_o1f, { name: '', w: '', d: '' });
_oa();
};
const _o1q = sc && sc.summary ? [
sc.summary.area_m2 ? `Diện tích ghi trên layout: ${vn(sc.summary.area_m2)} m²${sc.summary.area_kind === 'thong_thuy' ? ' (thông thuỷ)' : sc.summary.area_kind === 'tim_tuong' ? ' (tim tường)' : ''}` : '',
sc.summary.bedrooms != null ? `${sc.summary.bedrooms} phòng ngủ` : '', sc.summary.wc != null ? `${sc.summary.wc} WC` : '',
sc.facing ? `ban công/lô gia nhìn hướng ${sc.facing} (theo mũi tên Bắc trên ảnh)` : '',
sc.confidence != null ? `AI tự đánh giá độ tin ${Math.round(sc.confidence * 100)}%` : ''].filter(Boolean).join(' · ') : '';
return K.card({ testid: 'c3-review', title: '2. Soát số đo các phòng', body: [
sc && sc.demo ? G.note('Chế độ Dùng thử: AI giả không đọc ảnh – đây là KẾT QUẢ MẪU, không phải số đo layout của anh/chị.', 'warn', 'c3-scan-demo') : null,
sc && sc.via === 'tay' && !_o1p.plan.rooms.length ? G.note('Nhập từng phòng theo layout: chọn loại, gõ rộng × sâu (mét), bấm "+ Thêm phòng". App xếp tạm vị trí – sửa x, y nếu muốn đúng hình dạng.', 'info', 'c3-manual-help') : null,
_o1q ? h('p', { class: 'g5-small', 'data-testid': 'c3-scan-sum' }, _o1q) : null,
sc && sc.warnings && sc.warnings.length ? h('div', { class: 'g5-list', 'data-testid': 'c3-scan-warn' }, ...sc.warnings.map((w) => G.note(w, 'warn'))) : null,
h('div', { class: 'g5-table-wrap' }, h('table', { class: 'g5-table g5-rooms' },
h('thead', null, h('tr', null, ...['Phòng', 'Loại', 'Rộng (m)', 'Sâu (m)', 'x (m)', 'y (m)', 'Diện tích', ''].map((x) => h('th', null, x)))),
h('tbody', null, ...rows))),
h('div', { class: 'g5-form', 'data-testid': 'c3-quick' }, G.field('Loại phòng', _o1b), G.field('Tên', _o1c), G.field('Rộng (m)', _o1d), G.field('Sâu (m)', _o1a)),
qErr,
h('div', { class: 'g5-row' }, K.button('+ Thêm phòng', addRoom, { testid: 'c3-add-room' }),
K.button('Xếp lại tự động', () => { if (!_o1p.plan.rooms.length) { qErr.replaceChildren(G.note('Chưa có phòng nào để xếp – thêm phòng trước.', 'warn')); return; } _o4 = true; _o1p.plan.rooms = L.autoArrange(P.cleanRooms(_o1p.plan.rooms)); _oa(); }, { testid: 'c3-arrange', icon: 'refresh', title: 'Giữ nguyên rộng × sâu, xếp lại vị trí cho không chồng nhau' }),
K.button('Cửa tự động', () => { _o1p.plan.links = []; _oa(); K.toast('Đã đặt cửa theo phòng khách / sảnh / hành lang.', 'success'); }, { testid: 'c3-autolinks', icon: 'link', title: 'Bỏ danh sách cửa đọc được, tự nối phòng kề phòng trung tâm' })),
errBox, areaBox, plan2dBox,
_o1p.mode === 'layout' ? h('label', { class: 'g5-row g5-small' }, h('input', { type: 'checkbox', checked: _o1p.confirmed, 'data-testid': 'c3-confirm', onchange: (e) => { _o1p.confirmed = e.target.checked; why3.replaceChildren(); _oj(); } }),
'Tôi đã đối chiếu từng số đo với layout (AI có thể đọc sai)') : null] });
}
function _o9() {
const _o10 = G.input({ value: _o1p.name, placeholder: 'vd Căn A-12-05', 'data-testid': 'c3-name', oninput: (e) => { _o1p.name = e.target.value; } });
const _o1y = G.input({ value: _o1p.unit, placeholder: 'Mã căn', 'data-testid': 'c3-unit', oninput: (e) => { _o1p.unit = e.target.value; _of(); } });
return K.card({ testid: 'c3-build-card', title: '3. Dựng 3D & lưu', body: [
h('div', { class: 'g5-row' }, K.button(_o1p.built ? '🧱 Dựng lại 3D' : '🧱 Dựng 3D từ số đo này', () => _o7(), { kind: 'primary', testid: 'c3-build' })),
why3,
h('div', { class: 'g5-form' }, G.field('Tên', _o10), G.field('Mã căn', _o1y)),
h('div', { class: 'g5-row' }, K.button('Lưu căn', () => _o1l(), { kind: 'primary', testid: 'c3-save' }),
_od() ? K.button('Dùng cho video dẫn tour (mức 3)', () => _o1v(), { testid: 'c3-to-video', icon: 'film' }) : null)] });
}
function _o8() {
if (_o1p.mode === 'none') return 'Chưa có layout: bấm "📂 Tải ảnh/PDF layout căn" ở bước 1 (bắt buộc), rồi cho AI quét hoặc tự nhập kích thước phòng.';
if (!_op()) return 'Chưa có phòng nào: bấm "🤖 AI quét layout" hoặc nhập từng phòng (rộng × sâu) ở bước 2.';
const errs = L.planErrors(_o1p.plan.rooms);
if (errs.length) return 'Sửa lỗi số đo trước: ' + errs.slice(0, 3).join('; ') + (errs.length > 3 ? '…' : '') + '.';
if (_o1p.mode === 'layout' && !_o1p.confirmed) return 'Tick ô "Tôi đã đối chiếu từng số đo với layout" ở cuối bước 2 rồi bấm lại.';
return '';
}
function _o7() {
const _o21 = _o8();
if (_o21) { _o11(why3, _o21); return; }
why3.replaceChildren(); _o1p.built = true; _o1o();
K.toast(_o20 ? 'Đã dựng 3D – kéo để xoay, bấm "▶ Dẫn tour".' : 'Đã dựng mặt bằng 2D (máy không có WebGL).', 'success');
if (stage.scrollIntoView && !stage.hidden) stage.scrollIntoView({ block: 'center', behavior: 'smooth' });
}
function _oa() {
_o1p.plan.rooms = P.cleanRooms(_o1p.plan.rooms).map((r, i) => ({ ...r, src: _o1p.plan.rooms[i] && _o1p.plan.rooms[i].src }));
if (_o1p.built && _o8()) _o1p.built = false;
_o1o();
}
function _oh() {
const errs = _o1p.plan.rooms.length ? L.planErrors(_o1p.plan.rooms) : [];
errBox.replaceChildren(...errs.map((e) => G.note(e, 'danger')));
const _o3 = P.areas(_o1p.plan.rooms);
areaBox.replaceChildren(_o1p.plan.rooms.length ? h('p', { class: 'g5-small' }, `Trong nhà ${String(_o3.indoor).replace('.', ',')} m² · lô gia/ban công ${String(_o3.outdoor).replace('.', ',')} m² · ${_o3.bedrooms} phòng ngủ · ${_o3.baths} vệ sinh`) : '');
plan2dBox.replaceChildren(_o1p.plan.rooms.length ? plan2d(_o1p.plan, { furnitureOn: _o1p.furn }) : '');
_o1t.textContent = !_o1p.built ? 'Chưa dựng' : _o1p.illustrative ? 'Mặt bằng minh hoạ' : _o1p.scan && _o1p.scan.demo ? 'Kết quả mẫu (dùng thử)' : 'Theo layout đã soát';
}
function _o1g() {
empty.hidden = _o1p.built || _o1p.step !== 'can';
if (!_o20 || _o1p.step !== 'can') return;
_o20.showPlan(_o1p.built ? _o1p.plan : { rooms: [], links: [], entry: null }, { withFurniture: _o1p.furn, cutaway: _o1p.cut });
}
function tour() {
const path = P.walkPath(_o1p.plan);
if (path.length < 2) { _oc.replaceChildren(G.note('Mặt bằng chưa có cửa nối các phòng – bấm "Cửa tự động" ở bước 2 hoặc kiểm lại các phòng có kề nhau không.', 'warn')); return; }
plan2dBox.replaceChildren(plan2d(_o1p.plan, { furnitureOn: _o1p.furn, path }));
if (!_o20) { caption.textContent = ''; fallback.querySelectorAll('[data-testid="c3-tour-list"]').forEach((x) => x.remove()); fallback.append(h('ol', { class: 'g5-small', 'data-testid': 'c3-tour-list' }, ...path.filter((_o14) => _o14.stop).map((_o14) => h('li', null, `${_o14.name}: ${_o14.say}`)))); return; }
_o20.showPlan(_o1p.plan, { withFurniture: _o1p.furn, cutaway: true, labels: false });
_o20.tour(path, { onStep: (_o14) => { caption.textContent = (_o14.name ? _o14.name + ' – ' : '') + (_o14.say || ''); }, onDone: () => { caption.textContent = 'Kết thúc tour. Cảm ơn anh chị đã theo dõi.'; } });
}
async function _o1l() {
if (!_op()) return _o11(why3, 'Chưa có mặt bằng để lưu: tải layout và quét/nhập số đo trước (bước 1–2).');
const errs = L.planErrors(_o1p.plan.rooms);
if (errs.length) return _o11(why3, 'Sửa lỗi số đo trước khi lưu: ' + errs.slice(0, 2).join('; ') + '.');
const name = _o1p.name || _o1p.unit || 'Căn ' + new Date().toLocaleDateString('vi-VN');
const plan = { rooms: _o1p.plan.rooms.map(({ src, ...r }) => r), links: _o1p.plan.links, entry: _o1p.plan.entry };
const layout = _o1p.layout ? { name: _o1p.layout.name, mime: _o1p.layout.mime, pages: _o1p.layout.pages, w: _o1p.layout.w || null, h: _o1p.layout.h || null } : null;
const _o1n = _o1p.scan ? { at: _o1p.scan.at, via: _o1p.scan.via, demo: !!_o1p.scan.demo, facing: _o1p.scan.facing || null, confidence: _o1p.scan.confidence ?? null, summary: _o1p.scan.summary || null, estimated: !!_o1p.scan.estimated } : null;
let _o1j;
try {
_o1j = await G.saveDoc(KIND, { id: _o1p.id, name, data: { project: _o1p.project, unit: _o1p.unit, tower: _o1p.tower, floor: _o1p.floor, towers: _o1p.towers, plan, illustrative: _o1p.illustrative || _o1p.mode === 'demo', layout, scan: _o1n, confirmed: _o1p.confirmed } });
} catch (e) { return _o11(why3, 'Chưa lưu được: ' + ((e && e.message) || 'lỗi')); }
_o1p.id = _o1j.id; _o1p.name = name;
if (_o1p.layoutBlob) { try { await files.put(_o1j.id, _o1p.layoutBlob, { name: _o1p.layout.name }); } catch { K.toast('Không lưu được tệp layout trên máy này – số đo vẫn được lưu.', 'warn'); } }
K.toast('Đã lưu căn.', 'success'); _oi();
return _o1j;
}
function _od() {
const _o14 = ctx.user && ctx.user.perms;
if (_o14 && _o14.video === false) return false;
try { return !ctx.packs || ctx.packs.moduleOn('g5_dandan'); } catch { return true; }
}
async function _o1v() {
if (!_o1p.built) return _o11(why3, 'Dựng 3D trước (bấm "🧱 Dựng 3D") rồi mới dùng cho video dẫn tour.');
const _o1j = _o1p.id ? { id: _o1p.id } : await _o1l();
if (_o1j && _o1j.id) K.nav('content/g5_dandan?plan=' + _o1j.id);
}
async function _oi() {
const _oe = await G.listDocs(KIND);
_o1m.replaceChildren(...(_oe.length ? _oe.slice(0, 30).map((d) => h('div', { class: 'g5-li' }, h('div', null, h('b', null, d.name), h('div', { class: 'bds-muted g5-small' }, [d.data.project, d.data.unit, d.data.layout ? 'có layout' : '', d.data.illustrative ? 'minh hoạ' : ''].filter(Boolean).join(' · '))),
h('div', { class: 'g5-row' }, K.button('Mở', () => _o13(d), { testid: 'c3-open-' + d.id }), K.button('Xoá', async () => { if (!(await G.confirmDel(d.name, 'c3-del-c'))) return; await G.removeDoc(d.id); await files.del(d.id).catch(() => {}); _oi(); }, { kind: 'danger', testid: 'c3-del-' + d.id })))) : [K.empty('Chưa lưu căn nào.')]));
}
async function _o13(d) {
Object.assign(_o1p, { id: d.id, name: d.name, project: d.data.project || '', unit: d.data.unit || '', tower: d.data.tower || 0, floor: d.data.floor || 1, towers: d.data.towers || _o1p.towers, illustrative: !!d.data.illustrative });
_o1p.plan = { rooms: P.cleanRooms((d.data.plan || {}).rooms || []), links: ((d.data.plan || {}).links || []), entry: (d.data.plan || {}).entry || null };
_o1p.scan = d.data.scan ? { warnings: [], ...d.data.scan } : null; _o1p.confirmed = !!d.data.confirmed;
_o1p.layout = null; _o1p.layoutBlob = null;
const _ol = d.data.layout ? await files.get(d.id).catch(() => null) : null;
if (_ol && _ol.blob) await _o15(_ol.blob, { keepPlan: true });
if (d.data.layout && !_o1p.layout) _o1p.layout = { ...d.data.layout };
_o1p.mode = d.data.illustrative && !d.data.layout ? 'demo' : 'layout';
_o1p.built = !L.planErrors(_o1p.plan.rooms).length && (_o1p.mode === 'demo' || _o1p.confirmed || !d.data.layout);
_o1p.step = 'can'; tabs.set('can'); _o1o();
}
_o1o(); _oi();
if (_o1e.get('open')) { const d = await G.getDoc(KIND, _o1e.get('open')); if (d) await _o13(d); }
const _o12 = new MutationObserver(() => { if (!_o1i.isConnected) { if (_o20) _o20.dispose(); if (_o1p.layoutUrl) URL.revokeObjectURL(_o1p.layoutUrl); _o12.disconnect(); } });
_o12.observe(document.body, { childList: true, subtree: true });
return _o1i;
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

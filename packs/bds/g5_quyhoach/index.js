import { g5, h, files, shrinkImage, scrollToEl, selftestWith, FONT, wrapText, fileForAi } from '../g5_lib/ui.js';
import * as Geo from '../g5_lib/geo.js';
import * as V from '../g5_lib/vitri.js';
import * as Q from '../g5_lib/qhai.js';
import * as P from '../g5_lib/pdfmap.js';
const KIND = 'g5_quyhoach';
export const OSM_TILES = '';
const _o0 = { lat: 21.0285, lng: 105.8542 };
const COLORS = ['#C0392B', '#2F5D8A', '#2E7D4F', '#8E44AD', '#D35400', '#16A085', '#7F8C8D', '#C9A24A'];
const _o1p = (u) => { try { window.open(u, '_blank', 'noopener'); } catch { } };
let _oc = null;
export function unmount() { const _o7 = _oc; _oc = null; if (_o7) { try { _o7(); } catch { } } }
export async function mount(el, ctx) {
unmount();
const G = g5(ctx), K = G.K;
const st = {
id: null, name: '', source: '', points: [], img: null, imgBlob: null, imgName: '', opacity: 0.6, pin: null, tap: 'point', ai: null,
rubric: { scores: {}, sources: {}, flags: {} }, view: { cx: Geo.mercX(_o0.lng), cy: Geo.mercY(_o0.lat), z: 14 },
};
let fit = null, aiBusy = false;
const _o2c = h('div', { class: 'g5', 'data-testid': 'g5-quyhoach' });
el.replaceChildren(_o2c);
const _oe = (() => { try { return matchMedia('(pointer: coarse)').matches; } catch { return false; } })();
const _o2t = h('div', { class: 'g5-steps', 'data-testid': 'qh-steps' });
const _o1n = h('div', { 'data-testid': 'qh-next', 'aria-live': 'polite' });
const _o8 = {};
const _o30 = (i) => h('div', { 'data-testid': 'qh-why-' + i, 'aria-live': 'polite' });
const _o31 = { 1: _o30(1), 2: _o30(2), 3: _o30(3), 4: _o30(4) };
function _o1l(at, msg, goStep) {
const _o5 = _o31[at];
_o5.replaceChildren(G.note(msg, 'warn'), goStep && goStep !== at ? K.button('Tới bước ' + goStep, () => goTo(goStep), { testid: 'qh-why-go-' + at, icon: 'next' }) : null);
scrollToEl(_o5, 'nearest');
}
const _od = (at) => _o31[at].replaceChildren();
function goTo(n) { scrollToEl(_o8[n], 'start'); }
const _o2i = h('div', { class: 'g5-list', 'data-testid': 'qh-saved' });
async function _oq() {
const _oh = await G.listDocs(KIND);
_o2i.replaceChildren(...(_oh.length ? _oh.map((d) => h('div', { class: 'g5-li' },
h('div', null, h('b', null, d.name || 'Chưa đặt tên'), h('div', { class: 'bds-muted g5-small' }, (d.data.points || []).length + ' điểm khống chế · ' + (d.data.source ? 'có nguồn' : 'chưa ghi nguồn'))),
h('div', { class: 'g5-row' }, K.button('Mở', () => open(d), { testid: 'qh-open-' + d.id }), K.button('Xoá', async () => { if (!(await G.confirmDel(d.name || 'khu đất chưa đặt tên', 'qh-del-c'))) return; await G.removeDoc(d.id); await files.del(d.id).catch(() => {}); _oq(); }, { kind: 'danger', testid: 'qh-del-' + d.id })))) : [K.empty('Chưa lưu khu đất nào.')]));
}
const _o1m = G.note(V.NEED_SOURCE + ' App không có sẵn dữ liệu quy hoạch.', 'warn', 'qh-need-source');
const _o1k = G.input({ placeholder: 'Ví dụ: Ô đất A3 – phường X', 'data-testid': 'qh-name', oninput: (e) => { st.name = e.target.value; } });
const srcIn = G.input({ placeholder: 'Cơ quan ban hành, số quyết định, ngày – vd: QĐ số …/QĐ-UBND ngày …', 'data-testid': 'qh-source', oninput: (e) => { st.source = e.target.value; _o27(); } });
const _ov = h('input', { type: 'file', hidden: true, accept: 'image/png,image/jpeg,image/webp,application/pdf', 'data-testid': 'qh-file', onchange: (e) => { const _ou = e.target.files && e.target.files[0]; _o1a(_ou); } });
const imgInfo = h('p', { class: 'bds-muted g5-small', 'data-testid': 'qh-img-info', 'aria-live': 'polite' });
const pdfBox = h('div', { class: 'g5-list', hidden: true, 'data-testid': 'qh-pdf' });
const _o20 = G.select(Q.PORTALS.map((_o1q) => [_o1q.id, _o1q.label]), Q.PORTALS[0].id, { 'data-testid': 'qh-portal', 'aria-label': 'Cổng quy hoạch chính thức' });
const _o1y = G.input({ placeholder: 'Tỉnh/thành khác – vd: Đà Nẵng', 'data-testid': 'qh-place' });
const _o1 = h('div', { class: 'g5-list', 'data-testid': 'qh-ai-result', 'aria-live': 'polite' });
const aiBtn = K.button('🤖 AI đọc bản đồ', () => aiRead(), { kind: 'secondary', testid: 'qh-ai-read' });
const _ob = G.canChat() ? K.button('Làm qua chat Claude/Gemini (miễn phí)', () => aiRead(true), { testid: 'qh-ai-chat', icon: 'chat' }) : null;
const imgCv = h('canvas', { class: 'g5-canvas g5-scrollable', 'data-testid': 'qh-img', width: 800, height: 600, 'aria-label': 'Ảnh bản đồ quy hoạch – chạm để thêm điểm khống chế hoặc đặt vị trí cần chấm' });
const ptsBox = h('div', { class: 'g5-pts', 'data-testid': 'qh-points' });
const _ow = h('div', { 'data-testid': 'qh-fit', 'aria-live': 'polite' });
const tapTabs = G.tabs([['point', '➕ Chạm ảnh = thêm điểm khống chế'], ['pin', '📍 Chạm ảnh = đặt vị trí cần chấm']], st.tap, (_o2y) => {
if (_o2y === 'pin' && !(fit && fit.ok)) { tapTabs.set('point'); _o1l(2, 'Chưa đặt vị trí trên ảnh được: cần nắn ảnh trước (ít nhất 3 điểm có toạ độ) để app biết vị trí thật của từng điểm ảnh.'); return; }
st.tap = _o2y; _od(2);
}, 'qh-tapmode');
imgCv.addEventListener('click', (e) => {
if (!st.img) { _ov.click(); return; }
const r = imgCv.getBoundingClientRect();
const px = ((e.clientX - r.left) / r.width) * st.img.naturalWidth, py = ((e.clientY - r.top) / r.height) * st.img.naturalHeight;
if (st.tap === 'pin') {
if (!(fit && fit.ok)) return _o1l(2, 'Cần nắn ảnh trước khi đặt vị trí trên ảnh.');
const ll = Geo.pixelToLatLng(fit.T, px, py);
return _o1z(ll.lat, ll.lng, true);
}
if (st.points.length >= 12) return _o1l(2, 'Tối đa 12 điểm khống chế – xoá bớt điểm (✕) trước khi thêm.');
st.points.push({ px: Math.round(px * 10) / 10, py: Math.round(py * 10) / 10, lat: null, lng: null });
_od(2); _oo(); _ol(); _o25();
});
const mapCv = h('canvas', { 'data-testid': 'qh-map-canvas' });
const attrib = h('span', { class: 'g5-attrib', 'data-testid': 'qh-attrib' }, 'Lưới toạ độ (WGS84)');
const hint = h('div', { class: 'g5-maphint', hidden: true, 'data-testid': 'qh-map-hint' });
const mapBox = h('div', { class: 'g5-mapbox' + (_oe ? ' g5-locked' : ''), 'data-testid': 'qh-map', dataset: { fit: 'none', base: 'grid' } }, mapCv, h('div', { class: 'g5-cross', 'aria-hidden': 'true' }), attrib, hint);
const _o9 = h('span', { class: 'bds-muted g5-small', 'data-testid': 'qh-center' });
const _o11 = G.input({ placeholder: 'Dán toạ độ hoặc link Google Maps: 21.0285, 105.8542', 'data-testid': 'qh-goto-in' });
const opacity = h('input', { type: 'range', min: 0, max: 100, value: 60, 'data-testid': 'qh-opacity', 'aria-label': 'Độ đậm của lớp quy hoạch', oninput: (e) => { st.opacity = Number(e.target.value) / 100; _o1o.textContent = e.target.value + '%'; if (!(fit && fit.ok)) _o1l(3, 'Độ đậm chỉ thấy khi ảnh đã được nắn và chồng lên bản đồ (bước 2).', 2); _om(); } });
const _o1o = h('span', { class: 'g5-small' }, '60%');
const _o1t = G.input({ placeholder: 'Toạ độ vị trí cần chấm (hoặc link Google Maps)', 'data-testid': 'qh-pin-ll' });
const _o1w = h('div', { 'data-testid': 'qh-pin-info' });
const _o2 = h('div', { class: 'g5-list', 'data-testid': 'qh-base' });
const _o1c = h('span', { class: 'bds-muted g5-small' });
const lockBtn = K.button('✋ Kéo bản đồ bằng tay: Tắt', () => _o2m(!mapBox.classList.contains('g5-locked')), { testid: 'qh-map-lock' });
function _o2m(on) {
mapBox.classList.toggle('g5-locked', on);
const _o17 = on ? '✋ Kéo bản đồ bằng tay: Tắt' : '✋ Kéo bản đồ bằng tay: Bật';
const _o2p = lockBtn.querySelector('span'); if (_o2p) _o2p.textContent = _o17; else lockBtn.textContent = _o17;
_o1c.textContent = on ? 'Đang tắt: vuốt trên bản đồ là cuộn trang. Bật để kéo/chụm phóng bản đồ bằng ngón tay.' : 'Đang bật: kéo để di chuyển, chụm 2 ngón để phóng to/thu nhỏ.';
lockBtn.setAttribute('aria-pressed', on ? 'false' : 'true');
}
_o2m(_oe);
const scoreBox = h('div', { 'data-testid': 'qh-score', 'aria-live': 'polite' });
const _o2f = h('div', { class: 'g5-list' });
_o8[1] = K.card({ testid: 'qh-card-1', title: '1. Ảnh bản đồ quy hoạch (nguồn chính thức)', body: [_o1m,
h('div', { class: 'g5-upload' },
h('div', { class: 'g5-row' }, K.button('📂 Chọn ảnh/PDF bản đồ quy hoạch', () => _ov.click(), { kind: 'primary', testid: 'qh-pick' }), _ov),
imgInfo, pdfBox,
h('p', { class: 'bds-muted g5-small', 'data-testid': 'qh-pick-help' }, `Nhận ảnh PNG/JPG/WebP hoặc PDF (tối đa ${P.PDF_MAX_MB} MB, ${P.PDF_MAX_PAGES} trang – PDF nhiều trang thì chọn trang cần dùng). PDF được đọc ngay trên máy của anh/chị, không gửi đi đâu; app vẽ trang đó thành ảnh rồi làm tiếp như ảnh thường.`)),
h('details', { 'data-testid': 'qh-portals' }, h('summary', null, 'Chưa có ảnh? Mở cổng thông tin quy hoạch chính thức'),
h('div', { class: 'g5-list' },
h('div', { class: 'g5-row' }, h('div', { class: 'g5-full' }, _o20), K.button('Mở cổng', () => _o1p((Q.PORTALS.find((_o1q) => _o1q.id === _o20.value) || Q.PORTALS[0]).url), { testid: 'qh-portal-open' })),
h('div', { class: 'g5-row' }, h('div', { class: 'g5-full' }, _o1y), K.button('Tìm cổng quy hoạch', () => { if (!_o1y.value.trim()) return _o1l(1, 'Gõ tên tỉnh/thành cần tìm (vd: Đà Nẵng) rồi bấm lại.'); _od(1); _o1p(Q.portalSearchUrl(_o1y.value)); }, { testid: 'qh-portal-search', icon: 'external' })),
h('p', { class: 'bds-muted g5-small' }, 'Địa chỉ cổng là tham khảo, có thể đổi theo địa phương. Trên cổng: tìm khu đất → tải/chụp ảnh bản đồ kèm chú giải và số quyết định → quay lại app bấm "Chọn ảnh/PDF bản đồ quy hoạch".'))),
h('div', { class: 'g5-form' },
h('div', { class: 'g5-full' }, G.field('Tên khu đất / dự án', _o1k)),
h('div', { class: 'g5-full' }, G.field('Nguồn bản đồ (bắt buộc để chấm mục quy hoạch)', srcIn, 'Chỉ dùng bản đồ do cơ quan nhà nước công bố (cổng quy hoạch địa phương, bản sao quyết định phê duyệt). Không dùng ảnh trên mạng không rõ nguồn.'))),
h('div', { class: 'g5-list' }, h('div', { class: 'g5-row' }, aiBtn, _ob),
h('p', { class: 'bds-muted g5-small', 'data-testid': 'qh-ai-fee' }, '💰 AI đọc ảnh có thể mất phí Gemini – app báo chi phí và hỏi trước khi gửi. AI chỉ gợi ý, không chấm điểm thay anh/chị.')),
_o31[1], _o1] });
_o8[2] = K.card({ testid: 'qh-card-2', title: '2. Nắn ảnh – điểm khống chế (≥ 3 điểm)', body: [
G.note('Chạm vào một điểm dễ nhận trên ảnh (ngã tư, góc công trình, mốc ranh). Sau đó dán toạ độ của đúng điểm đó: trên Google Maps bấm giữ vào điểm → chép số (hoặc chép link), dán vào ô của điểm. Nên chọn 4–6 điểm rải đều các góc. Vuốt trên ảnh vẫn cuộn trang.', 'info'),
tapTabs, imgCv,
h('div', { class: 'g5-row' }, K.button('↶ Bỏ điểm vừa thêm', () => { if (!st.points.length) return _o1l(2, 'Chưa có điểm nào để bỏ.'); st.points.pop(); _oo(); _ol(); _o25(); }, { testid: 'qh-undo-pt' })),
_o31[2], ptsBox, _ow] });
_o8[3] = K.card({ testid: 'qh-card-3', title: '3. Chồng lên bản đồ & đặt vị trí cần chấm', body: [_o2, mapBox, G.note(V.NOT_OFFICIAL, 'warn', 'qh-not-official'),
h('div', { class: 'g5-row' }, K.button('', () => _o32(-1), { testid: 'qh-zoom-out', title: 'Thu nhỏ', icon: 'minus' }), K.button('', () => _o32(1), { testid: 'qh-zoom-in', title: 'Phóng to', icon: 'plus' }), _o9),
h('div', { class: 'g5-row' }, lockBtn, _o1c),
h('div', { class: 'g5-row' }, h('div', { class: 'g5-full' }, _o11), K.button('Đến', () => _o10(), { testid: 'qh-goto', icon: 'next' }), K.button('Vừa khung ảnh', () => _ox(), { testid: 'qh-fitview', icon: 'layout' }),
K.button('Mở Google Maps tại tâm', () => _o1p(Q.mapsUrl({ lat: _o2d(Geo.latOf(st.view.cy)), lng: _o2d(Geo.lngOf(st.view.cx)) })), { testid: 'qh-gmaps' })),
G.field('Độ đậm lớp quy hoạch', h('div', { class: 'g5-row' }, h('div', { class: 'g5-full' }, opacity), _o1o)),
h('div', { class: 'g5-row' }, K.button('📍 Đặt vị trí cần chấm = tâm bản đồ', () => _o2n(), { kind: 'primary', testid: 'qh-pin' })),
h('div', { class: 'g5-row' }, h('div', { class: 'g5-full' }, _o1t), K.button('Đặt theo toạ độ', () => _o1s(), { testid: 'qh-pin-set', icon: 'check' })),
_o31[3], _o1w] });
_o8[4] = K.card({ testid: 'qh-card-4', title: '4. Đọc ô đất & chấm điểm vị trí', body: [_o2f, scoreBox, _o31[4]] });
_o2c.append(
G.head('Chồng bản đồ quy hoạch', 'Nạp ảnh bản đồ quy hoạch từ nguồn chính thức, nắn khớp lên bản đồ nền, rồi chấm điểm vị trí theo thang có trọng số.', 'qh-head'),
K.card({ title: 'Các bước', testid: 'qh-steps-card', body: [_o2t, _o1n] }),
K.card({ title: 'Khu đất đã lưu', body: _o2i, actions: K.button('+ Khu đất mới', () => _o29(), { kind: 'primary', testid: 'qh-new' }) }),
_o8[1], _o8[2], _o8[3], _o8[4],
h('div', { class: 'g5-row' },
K.button('Lưu khu đất', () => save(), { kind: 'primary', testid: 'qh-save' }),
K.button('Tải ảnh kết quả (PNG)', () => _ot(), { testid: 'qh-export-png', icon: 'download' }),
K.button('Tải tệp điểm khống chế (để mở lại)', () => _os(), { testid: 'qh-export-json', icon: 'download' })),
);
function _o28() {
const r = V.scoreLocation(st.rubric);
const withLL = st.points.filter((_o1q) => _o1q.lat != null).length;
const s = Q.qhSteps({ hasImg: !!st.img, hasSource: st.source.trim().length >= 4, points: st.points.length, withLL, fitOk: !!(fit && fit.ok), fitMsg: fit && !fit.ok ? Geo.fitVerdict(fit).text : '', hasPin: !!st.pin, scored: r.max > 0 });
_o2t.replaceChildren(...s.steps.map((x) => h('button', { type: 'button', class: 'g5-stepchip' + (x.done ? ' done' : s.next && s.next.id === x.id ? ' next' : ''), 'data-testid': 'qh-step-' + x.n, 'data-done': x.done ? '1' : '0', onclick: () => goTo(x.n) },
h('b', null, x.done ? '✓' : String(x.n)), x.label)));
_o1n.replaceChildren(s.next
? h('div', { class: 'g5-row' }, h('p', { class: 'g5-small', style: { margin: 0, flex: '1 1 240px' } }, h('b', null, `Việc tiếp theo (bước ${s.next.n}): `), s.next.hint), K.button('Tới bước ' + s.next.n, () => goTo(s.next.n), { kind: 'primary', testid: 'qh-next-go', icon: 'next' }))
: G.note('Đã xong cả 4 bước. Bấm "Lưu khu đất" hoặc "Tải ảnh kết quả".', 'success'));
}
function _o27() {
const ok = st.img && st.source.trim().length >= 4;
_o1m.hidden = !!ok;
_o28();
}
async function _o1a(file, { keepPoints = false, savedDims = null } = {}) {
if (!file) return;
if (P.isPdfFile(file)) return _o1b(file);
_ov.value = '';
if (file.size > 25 * 1024 * 1024) return _o1l(1, 'Ảnh lớn hơn 25 MB – hãy thu nhỏ (hoặc chụp màn hình phần khu đất) rồi chọn lại.');
closePdf();
return _o2w(file, { keepPoints, savedDims });
}
async function _o2w(file, { keepPoints = false, from = '', savedDims = null } = {}) {
try {
const w = await shrinkImage(file, P.PDF_MAX_PIXELS);
st.img = w.img; st.imgBlob = w.file; st.imgName = file.name || st.imgName || 'ban-do';
if (!keepPoints) { st.points = []; st.ai = null; _o1.replaceChildren(); }
else if (savedDims && savedDims.w) st.points = P.rescalePoints(st.points, savedDims.w, st.img.naturalWidth);
imgInfo.textContent = `${st.imgName} – ${st.img.naturalWidth} × ${st.img.naturalHeight} px${from ? ' (' + from + ')' : ''}${w.k < 1 ? ' – ảnh lớn đã được thu nhỏ cho nhẹ máy, vẫn đủ nét để nắn và đọc màu' : ''}. Ảnh chỉ lưu trên máy này.`;
_od(1); _ol(); _oo(); _o25(); _o27();
} catch (e) { _o1l(1, (e && e.message) || 'Không đọc được ảnh – thử ảnh PNG/JPG khác.'); }
}
let _o1r = null, pdfName = '', pdfBusy = false, pdfSeq = 0, pdfPage = 1;
function closePdf() {
pdfSeq++;
if (_o1r) { P.closePdf(_o1r); _o1r = null; }
pdfBox.replaceChildren(); pdfBox.hidden = true;
}
async function _o1b(file) {
if (pdfBusy) return _o1l(1, 'Đang đọc PDF trước đó – chờ xong rồi chọn lại.');
_ov.value = '';
closePdf();
const _o4 = P.pdfSizeProblem(file.size);
if (_o4) return _o1l(1, _o4);
pdfBusy = true; _od(1);
const _o2l = pdfSeq;
const _o21 = imgInfo.textContent;
imgInfo.textContent = `Đang đọc PDF "${file.name || 'ban-do.pdf'}"… (lần đầu app nạp bộ đọc PDF, mất vài giây)`;
try {
const _o6 = new Uint8Array(await file.arrayBuffer());
if (!P.looksLikePdf(_o6)) throw Object.assign(new Error('không phải PDF'), { name: 'InvalidPDFException' });
const _og = await P.openPdf(_o6);
if (_o2l !== pdfSeq) { P.closePdf(_og); return; }
const _o1e = P.pdfPagesProblem(_og.numPages);
if (_o1e) { P.closePdf(_og); imgInfo.textContent = _o21; return _o1l(1, _o1e); }
_o1r = _og; pdfName = file.name || 'ban-do.pdf'; pdfPage = 1;
if (_og.numPages === 1) { await _o2x(1); closePdf(); } else { imgInfo.textContent = `PDF "${pdfName}" có ${_og.numPages} trang – chọn trang bản đồ ở khung bên dưới.`; _on(); }
} catch (e) {
if (_o2l !== pdfSeq && !_o1r) return;
closePdf(); imgInfo.textContent = _o21;
_o1l(1, P.pdfErrorMessage(e));
} finally { pdfBusy = false; }
}
async function _o2x(n) {
if (!_o1r) return;
const _og = _o1r, total = _og.numPages;
imgInfo.textContent = `Đang vẽ trang ${n}/${total} của PDF thành ảnh… (trang lớn có thể mất vài chục giây)`;
try {
const r = await P.renderPagePng(_og, n, pdfName);
if (_og !== _o1r) return;
if (r.blob.size > 30 * 1024 * 1024) return _o1l(1, `Ảnh vẽ từ trang ${n} nặng ${(r.blob.size / 2 ** 20).toFixed(0)} MB – thử trang khác hoặc xuất lại PDF nhẹ hơn.`);
const _ou = new File([r.blob], r.name, { type: 'image/png' });
await _o2w(_ou, { from: `trang ${n}/${total} của PDF` });
K.toast(`Đã vẽ trang ${n}/${total} của PDF thành ảnh bản đồ.`, 'success');
} catch (e) { if (_og !== _o1r) return; _o1l(1, P.pdfErrorMessage(e)); }
}
function _on() {
const _og = _o1r; if (!_og) return;
const total = _og.numPages;
pdfSeq++;
const thumb = h('canvas', { class: 'g5-pdf-thumb', 'data-testid': 'qh-pdf-thumb', 'aria-label': 'Xem trước trang PDF đang chọn' });
const msg = h('p', { class: 'bds-muted g5-small', 'data-testid': 'qh-pdf-msg', 'aria-live': 'polite' });
const num = h('input', { type: 'number', min: 1, max: total, value: pdfPage, inputmode: 'numeric', 'data-testid': 'qh-pdf-page', 'aria-label': 'Số trang PDF (1 tới ' + total + ')' });
let _oa = Promise.resolve();
const _o2o = () => {
const _o1i = ++pdfSeq;
msg.textContent = 'Đang vẽ xem trước…';
_oa = _oa.then(async () => {
if (_o1i !== pdfSeq || _og !== _o1r) return;
try {
await P.renderPageTo(_og, pdfPage, thumb, { maxSide: 420, maxPixels: 600000, timeoutMs: 30000 });
if (_o1i === pdfSeq) msg.textContent = `Trang ${pdfPage}/${total}. Đúng trang bản đồ khu đất (có chú giải) thì bấm "Dùng trang này".`;
} catch (e) { if (_o1i === pdfSeq) msg.textContent = 'Không xem trước được trang này: ' + P.pdfErrorMessage(e); }
});
};
const _oz = (_o2y) => { const n = P.parsePageNumber(_o2y, total); if (!n) { num.value = pdfPage; msg.textContent = `Số trang phải từ 1 tới ${total}.`; return; } pdfPage = n; num.value = n; _o2o(); };
num.addEventListener('change', () => _oz(num.value));
pdfBox.hidden = false;
pdfBox.replaceChildren(
G.note(`PDF "${pdfName}" có ${total} trang. Chọn trang chứa bản đồ quy hoạch cần chồng (mỗi lần dùng một trang).`, 'info', 'qh-pdf-note'),
h('div', { class: 'g5-row' }, K.button('Trang trước', () => _oz(pdfPage - 1), { testid: 'qh-pdf-prev', icon: 'back' }), num, h('span', { class: 'g5-small' }, `/ ${total}`), K.button('Trang sau', () => _oz(pdfPage + 1), { testid: 'qh-pdf-next', icon: 'next' })),
thumb, msg,
h('div', { class: 'g5-row' }, K.button('Dùng trang này làm ảnh bản đồ', async () => { if (pdfBusy) return; pdfBusy = true; try { await _o2x(pdfPage); } finally { pdfBusy = false; } }, { kind: 'primary', testid: 'qh-pdf-use', icon: 'check' }),
K.button('Bỏ PDF', () => { closePdf(); imgInfo.textContent = st.img ? `${st.imgName} – ${st.img.naturalWidth} × ${st.img.naturalHeight} px.` : ''; }, { testid: 'qh-pdf-close', icon: 'close' })));
_o2o();
}
function _ol() {
const _o7 = imgCv.getContext('2d');
if (!st.img) {
imgCv.width = 360; imgCv.height = 180; _o7.fillStyle = '#EDE7DA'; _o7.fillRect(0, 0, 360, 180); _o7.fillStyle = '#5F6979'; _o7.textAlign = 'center';
_o7.font = 'bold 18px ' + FONT; _o7.fillText('Chưa có ảnh bản đồ quy hoạch', 180, 72);
_o7.font = '15px ' + FONT; _o7.fillText('Chạm vào đây để chọn ảnh/PDF', 180, 104); _o7.fillText('(hoặc dùng nút ở bước 1)', 180, 126); return;
}
const W = Math.min(1600, st.img.naturalWidth), k = W / st.img.naturalWidth;
imgCv.width = Math.round(W); imgCv.height = Math.round(st.img.naturalHeight * k);
_o7.drawImage(st.img, 0, 0, imgCv.width, imgCv.height);
st.points.forEach((_o1q, i) => _o1f(_o7, _o1q.px * k, _o1q.py * k, i, Math.max(10, imgCv.width / 60)));
if (st.pin && fit && fit.ok) { const q = Geo.latLngToPixel(fit.T, st.pin.lat, st.pin.lng); if (q) _o1v(_o7, q.px * k, q.py * k, Math.max(10, imgCv.width / 60)); }
}
function _o1f(_o7, x, y, i, r = 10) {
_o7.save(); _o7.fillStyle = COLORS[i % COLORS.length]; _o7.strokeStyle = '#fff'; _o7.lineWidth = Math.max(2, r / 5);
_o7.beginPath(); _o7.arc(x, y, r, 0, Math.PI * 2); _o7.fill(); _o7.stroke();
_o7.fillStyle = '#fff'; _o7.font = `bold ${Math.round(r * 1.1)}px ${FONT}`; _o7.textAlign = 'center'; _o7.textBaseline = 'middle'; _o7.fillText(String(i + 1), x, y + 1); _o7.restore();
}
function _o1v(_o7, x, y, r = 9) {
_o7.save(); _o7.fillStyle = '#0F1E33'; _o7.strokeStyle = '#C9A24A'; _o7.lineWidth = 3; _o7.beginPath(); _o7.arc(x, y - r * 1.5, r, 0, Math.PI * 2); _o7.moveTo(x, y); _o7.lineTo(x - r * 0.7, y - r); _o7.lineTo(x + r * 0.7, y - r); _o7.closePath(); _o7.fill(); _o7.stroke(); _o7.restore();
}
function _oo() {
ptsBox.replaceChildren(...st.points.map((_o1q, i) => {
const ll = h('input', { type: 'text', inputmode: 'decimal', placeholder: 'Dán toạ độ / link Google Maps', value: _o1q.lat != null ? `${_o1q.lat}, ${_o1q.lng}` : '', 'data-testid': 'qh-ll-' + (i + 1), 'aria-label': 'Toạ độ điểm ' + (i + 1),
onchange: (e) => { const _o2y = Geo.parseLatLng(e.target.value); if (!_o2y && e.target.value.trim()) _o1l(2, `Điểm ${i + 1}: toạ độ chưa đúng dạng "21.0285, 105.8542" (hoặc dán nguyên link Google Maps có dạng …/@21.0285,105.8542,17z).`); else _od(2); _o1q.lat = _o2y ? _o2d(_o2y.lat) : null; _o1q.lng = _o2y ? _o2d(_o2y.lng) : null; _o25(); } });
return h('div', { class: 'g5-pt' }, h('b', { style: { background: COLORS[i % COLORS.length] } }, String(i + 1)),
h('div', null, _o1q.label ? h('div', { class: 'g5-small' }, _o1q.label) : null, ll, h('div', { class: 'bds-muted g5-small' }, `Ảnh: x ${Math.round(_o1q.px)}, y ${Math.round(_o1q.py)}`)),
h('div', { class: 'g5-row' },
_o1q.label ? K.button('Tìm trên Google Maps', () => _o1p(Q.mapsUrl({ q: _o1q.label + (st.name ? ' ' + st.name : '') })), { testid: 'qh-find-' + (i + 1), icon: 'external' }) : null,
K.button('Lấy tâm bản đồ', () => { _o1q.lat = _o2d(Geo.latOf(st.view.cy)); _o1q.lng = _o2d(Geo.lngOf(st.view.cx)); _oo(); _o25(); }, { testid: 'qh-center-' + (i + 1), icon: 'check', title: 'Dùng toạ độ dấu + ở giữa bản đồ bước 3' }),
K.button('✕', () => { st.points.splice(i, 1); _oo(); _ol(); _o25(); }, { title: 'Xoá điểm', testid: 'qh-del-pt-' + (i + 1) })));
}));
if (!st.points.length) ptsBox.append(h('p', { class: 'bds-muted g5-small' }, st.img ? 'Chưa có điểm nào – chạm vào ảnh ở trên để thêm điểm 1.' : 'Chưa có điểm nào – cần ảnh bản đồ ở bước 1.'));
}
const _o2d = (n) => Math.round(n * 1e6) / 1e6;
function _o25() {
const _o22 = st.points.filter((_o1q) => _o1q.lat != null && _o1q.lng != null);
fit = st.img && _o22.length ? Geo.fitAffine(_o22) : null;
const _o2y = Geo.fitVerdict(fit || { ok: false, message: st.img ? 'Cần ít nhất 3 điểm có toạ độ.' : 'Chưa có ảnh.' });
_ow.replaceChildren(G.note(_o2y.text, _o2y.tone === 'success' ? 'success' : _o2y.tone === 'warn' ? 'warn' : 'info'),
fit && fit.ok ? h('p', { class: 'bds-muted g5-small' }, `Tỷ lệ ≈ ${fit.mPerPx.toFixed(2).replace('.', ',')} m/px ảnh · ảnh lệch hướng Bắc ${Math.round(fit.rotation)}°`) : null,
fit && fit.ok && fit.n > 3 ? h('p', { class: 'bds-muted g5-small', 'data-testid': 'qh-residuals' }, 'Lệch từng điểm: ' + st.points.map((_o1q, i) => [_o1q, i]).filter(([_o1q]) => _o1q.lat != null).map(([, i], k) => `điểm ${i + 1}: ${fit.residuals[k].toFixed(1).replace('.', ',')} m`).join(' · ')) : null);
mapBox.dataset.fit = fit && fit.ok ? 'ok' : 'none';
if (!(fit && fit.ok) && st.tap === 'pin') { st.tap = 'point'; tapTabs.set('point'); }
if (fit && fit.ok) _od(3);
_om(); _o1u(); _o28();
}
const _oi = () => Math.min(2, window.devicePixelRatio || 1);
function _o2z() { const w = mapCv.clientWidth || 400, hgt = mapCv.clientHeight || 300; return { cx: st.view.cx, cy: st.view.cy, res: Geo.resAt(st.view.z), w, h: hgt }; }
function _om() {
const w = mapCv.clientWidth || 400, hh = mapCv.clientHeight || 300, d = _oi();
if (mapCv.width !== Math.round(w * d) || mapCv.height !== Math.round(hh * d)) { mapCv.width = Math.round(w * d); mapCv.height = Math.round(hh * d); }
const _o7 = mapCv.getContext('2d'); const _o2y = _o2z();
_o7.setTransform(d, 0, 0, d, 0, 0);
_o7.fillStyle = '#ECE7DC'; _o7.fillRect(0, 0, w, hh);
_ok(_o7, _o2y);
if (fit && fit.ok && st.img) {
const _o1d = Geo.canvasMatrix(fit.T, _o2y);
_o7.save(); _o7.globalAlpha = st.opacity; _o7.setTransform(_o1d[0] * d, _o1d[1] * d, _o1d[2] * d, _o1d[3] * d, _o1d[4] * d, _o1d[5] * d); _o7.drawImage(st.img, 0, 0); _o7.restore();
_o7.setTransform(d, 0, 0, d, 0, 0);
}
st.points.forEach((_o1q, i) => { if (_o1q.lat == null) return; const s = Geo.mercToScreen(_o2y, Geo.mercX(_o1q.lng), Geo.mercY(_o1q.lat)); _o1f(_o7, s.sx, s.sy, i, 9); });
if (st.pin) { const s = Geo.mercToScreen(_o2y, Geo.mercX(st.pin.lng), Geo.mercY(st.pin.lat)); _o7.save(); _o7.fillStyle = '#0F1E33'; _o7.strokeStyle = '#C9A24A'; _o7.lineWidth = 3; _o7.beginPath(); _o7.arc(s.sx, s.sy - 14, 9, 0, Math.PI * 2); _o7.moveTo(s.sx, s.sy); _o7.lineTo(s.sx - 6, s.sy - 8); _o7.lineTo(s.sx + 6, s.sy - 8); _o7.closePath(); _o7.fill(); _o7.stroke(); _o7.restore(); }
if (!(fit && fit.ok)) { _o7.save(); _o7.fillStyle = 'rgba(15,30,51,.7)'; _o7.font = '13px ' + FONT; _o7.textAlign = 'center'; _o7.fillText(st.img ? 'Ảnh chưa nắn – nhập toạ độ ≥ 3 điểm ở bước 2' : 'Chưa có ảnh quy hoạch – làm bước 1', w / 2, hh - 28); _o7.restore(); }
const ll = { lat: Geo.latOf(st.view.cy), lng: Geo.lngOf(st.view.cx) };
_o9.textContent = `Tâm: ${ll.lat.toFixed(6)}, ${ll.lng.toFixed(6)} · mức ${st.view.z.toFixed(1)}`;
}
function _o26() {
mapBox.dataset.base = 'grid';
attrib.replaceChildren('Lưới toạ độ (WGS84)');
_o2.replaceChildren(
G.note('Nền bản đồ (lưới toạ độ) chỉ để ĐỊNH VỊ – KHÔNG phải ranh quy hoạch. Ranh và chức năng sử dụng đất chỉ lấy từ ảnh/PDF bản đồ quy hoạch chính thức ở bước 1; AI không đọc hay chấm điểm từ nền này.', 'warn', 'qh-base-disclaimer'),
h('p', { class: 'bds-muted g5-small', 'data-testid': 'qh-base-note' }, 'Bản đồ là lưới toạ độ – app không gọi mạng ngoài. Nắn ảnh bằng toạ độ (hoặc link Google Maps) của từng điểm khống chế; bấm "Mở Google Maps tại tâm" để đối chiếu đường phố.'));
}
function _ok(_o7, _o2y) {
const _o2u = Geo.screenToMerc(_o2y, 0, 0), br = Geo.screenToMerc(_o2y, _o2y.w, _o2y.h);
const _o16 = Geo.latOf(br.my), lat1 = Geo.latOf(_o2u.my), lng0 = Geo.lngOf(_o2u.mx), lng1 = Geo.lngOf(br.mx);
const _o2q = Math.max(lat1 - _o16, lng1 - lng0);
const steps = [0.0005, 0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5];
const _o2s = steps.find((s) => _o2q / s <= 8) || 10;
_o7.save(); _o7.strokeStyle = 'rgba(15,30,51,.18)'; _o7.fillStyle = 'rgba(15,30,51,.6)'; _o7.lineWidth = 1; _o7.font = '11px ' + FONT;
for (let _o15 = Math.ceil(_o16 / _o2s) * _o2s; _o15 <= lat1; _o15 += _o2s) { const y = Geo.mercToScreen(_o2y, 0, Geo.mercY(_o15)).sy; _o7.beginPath(); _o7.moveTo(0, y); _o7.lineTo(_o2y.w, y); _o7.stroke(); _o7.fillText(_o15.toFixed(4), 4, y - 3); }
for (let _o19 = Math.ceil(lng0 / _o2s) * _o2s; _o19 <= lng1; _o19 += _o2s) { const x = Geo.mercToScreen(_o2y, Geo.mercX(_o19), 0).sx; _o7.beginPath(); _o7.moveTo(x, 0); _o7.lineTo(x, _o2y.h); _o7.stroke(); _o7.fillText(_o19.toFixed(4), x + 3, 12); }
_o7.restore();
}
let _o24 = 0;
function _o2j() { if (_o24) return; _o24 = requestAnimationFrame(() => { _o24 = 0; if (mapCv.isConnected) _om(); }); }
function _o33(z, at) {
const _o2y = _o2z();
z = Math.max(2, Math.min(20, z));
if (at) { const _o3 = Geo.screenToMerc(_o2y, at.x, at.y); const res = Geo.resAt(z); st.view.cx = _o3.mx - (at.x - _o2y.w / 2) * res; st.view.cy = _o3.my + (at.y - _o2y.h / 2) * res; }
st.view.z = z;
}
function _o32(dz, at) { _o33(st.view.z + dz, at); _om(); }
function _o10() {
const _o1q = Geo.parseLatLng(_o11.value);
if (!_o1q) return _o1l(3, _o11.value.trim() ? 'Toạ độ chưa đúng dạng "21.0285, 105.8542" (hoặc link Google Maps có …/@vĩ độ,kinh độ…).' : 'Dán toạ độ hoặc link Google Maps vào ô bên trái rồi bấm "Đến".');
_od(3);
st.view.cx = Geo.mercX(_o1q.lng); st.view.cy = Geo.mercY(_o1q.lat); st.view.z = Math.max(st.view.z, 16); _om();
}
function _ox() {
if (!(fit && fit.ok && st.img)) return _o1l(3, st.img ? 'Chưa nắn ảnh: cần ít nhất 3 điểm khống chế có toạ độ ở bước 2.' : 'Chưa có ảnh bản đồ quy hoạch – làm bước 1 trước.', st.img ? 2 : 1);
_od(3);
const corners = [[0, 0], [st.img.naturalWidth, 0], [0, st.img.naturalHeight], [st.img.naturalWidth, st.img.naturalHeight]].map(([x, y]) => Geo.apply(fit.T, x, y));
const _o1j = Math.min(...corners.map((q) => q.mx)), mx1 = Math.max(...corners.map((q) => q.mx)), my0 = Math.min(...corners.map((q) => q.my)), my1 = Math.max(...corners.map((q) => q.my));
const _o2y = _o2z();
st.view.cx = (_o1j + mx1) / 2; st.view.cy = (my0 + my1) / 2;
const res = Math.max((mx1 - _o1j) / _o2y.w, (my1 - my0) / _o2y.h) * 1.1;
st.view.z = Math.max(2, Math.min(20, Math.log2((2 * Math.PI * Geo.R_EARTH) / (Geo.TILE * res))));
_om();
}
let _o13 = 0;
function _oy(text) { hint.textContent = text; hint.hidden = false; clearTimeout(_o13); _o13 = setTimeout(() => { hint.hidden = true; }, 2200); }
const ptrs = new Map(); let _o1x = null, mapActive = false;
mapCv.addEventListener('pointerdown', (e) => {
if (e.pointerType === 'touch' && mapBox.classList.contains('g5-locked')) { _oy('Bấm "✋ Kéo bản đồ bằng tay" dưới bản đồ để kéo/phóng bằng ngón tay. Vuốt lên/xuống để cuộn trang.'); return; }
mapActive = true;
try { mapCv.setPointerCapture(e.pointerId); } catch { }
ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; _o1x = { d: Math.hypot(a.x - b.x, a.y - b.y), z: st.view.z }; }
});
mapCv.addEventListener('pointermove', (e) => {
const _o1q = ptrs.get(e.pointerId); if (!_o1q) return;
if (ptrs.size === 1) { const res = Geo.resAt(st.view.z); st.view.cx -= (e.clientX - _o1q.x) * res; st.view.cy += (e.clientY - _o1q.y) * res; _o1q.x = e.clientX; _o1q.y = e.clientY; _o2j(); return; }
_o1q.x = e.clientX; _o1q.y = e.clientY;
if (ptrs.size === 2 && _o1x) {
const [a, b] = [...ptrs.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y); const r = mapCv.getBoundingClientRect();
const z = Math.max(2, Math.min(20, _o1x.z + Math.log2(Math.max(1, d) / Math.max(1, _o1x.d))));
_o33(z, { x: (a.x + b.x) / 2 - r.left, y: (a.y + b.y) / 2 - r.top }); _o2j();
}
});
const _o2v = (e) => { ptrs.delete(e.pointerId); if (ptrs.size < 2) _o1x = null; };
mapCv.addEventListener('pointerup', _o2v); mapCv.addEventListener('pointercancel', _o2v);
mapCv.addEventListener('pointerleave', () => { if (!ptrs.size) mapActive = false; });
mapCv.addEventListener('wheel', (e) => {
if (!(e.ctrlKey || mapActive)) { _oy('Bấm vào bản đồ (hoặc giữ Ctrl) rồi lăn chuột để phóng to/thu nhỏ.'); return; }
e.preventDefault(); const r = mapCv.getBoundingClientRect(); _o32(e.deltaY < 0 ? 0.5 : -0.5, { x: e.clientX - r.left, y: e.clientY - r.top });
}, { passive: false });
function _o1z(lat, lng, center = false) {
st.pin = { lat: _o2d(lat), lng: _o2d(lng) };
if (center) { st.view.cx = Geo.mercX(st.pin.lng); st.view.cy = Geo.mercY(st.pin.lat); }
_od(3); _o1t.value = `${st.pin.lat}, ${st.pin.lng}`;
_om(); _ol(); _o1u(); _o28();
}
function _o2n() { _o1z(Geo.latOf(st.view.cy), Geo.lngOf(st.view.cx)); }
function _o1s() {
const _o1q = Geo.parseLatLng(_o1t.value);
if (!_o1q) return _o1l(3, _o1t.value.trim() ? 'Toạ độ vị trí chưa đúng dạng "21.0285, 105.8542" (hoặc link Google Maps).' : 'Dán toạ độ (hoặc link Google Maps) của vị trí cần chấm vào ô rồi bấm "Đặt theo toạ độ". Cách khác: chạm ảnh ở chế độ "📍 đặt vị trí" (bước 2), hoặc kéo bản đồ rồi bấm "📍 Đặt vị trí cần chấm = tâm bản đồ".');
_o1z(_o1q.lat, _o1q.lng, true);
}
function _o1u() {
if (!st.pin) { _o1w.replaceChildren(); return; }
const parts = [h('p', { class: 'g5-small' }, `Vị trí cần chấm: ${st.pin.lat}, ${st.pin.lng}`)];
if (fit && fit.ok && st.img) {
const q = Geo.latLngToPixel(fit.T, st.pin.lat, st.pin.lng);
const _o14 = q && q.px >= 0 && q.py >= 0 && q.px < st.img.naturalWidth && q.py < st.img.naturalHeight;
if (_o14) {
const _of = _o2g(q.px, q.py);
parts.push(h('div', { class: 'g5-row g5-small', 'data-testid': 'qh-pin-color' }, h('span', { style: { display: 'inline-block', width: '28px', height: '20px', borderRadius: '4px', border: '1px solid #0003', background: _of } }),
`Màu ô đất trên bản đồ quy hoạch tại vị trí này: ${_of} – đối chiếu chú giải của chính bản đồ để biết chức năng sử dụng đất.`));
if (st.ai && st.ai.legend && st.ai.legend.length) {
const _o1d = Q.nearestLegend(_of, st.ai.legend);
parts.push(G.note(_o1d ? `Gợi ý theo chú giải AI đọc (độ tin ${Math.round(st.ai.confidence * 100)}%): màu gần với "${_o1d.label}". Chỉ là gợi ý – đối chiếu bản đồ gốc trước khi chấm mục quy hoạch.`
: 'Màu này không khớp mục chú giải nào AI đọc được – tự đối chiếu chú giải trên bản đồ gốc.', _o1d ? 'info' : 'warn', 'qh-pin-legend'));
}
} else parts.push(h('p', { class: 'bds-muted g5-small' }, 'Vị trí nằm ngoài phạm vi ảnh quy hoạch đã nạp.'));
} else parts.push(h('p', { class: 'bds-muted g5-small' }, 'Nắn ảnh (bước 2) để app đọc màu ô đất tại vị trí này.'));
_o1w.replaceChildren(...parts);
}
const _o2h = document.createElement('canvas'); _o2h.width = 1; _o2h.height = 1;
function _o2g(px, py) {
try {
const x = _o2h.getContext('2d', { willReadFrequently: true });
x.imageSmoothingEnabled = false; x.clearRect(0, 0, 1, 1);
x.drawImage(st.img, Math.floor(px), Math.floor(py), 1, 1, 0, 0, 1, 1);
const d = x.getImageData(0, 0, 1, 1).data;
if (d[3] === 0) return '—';
return '#' + [d[0], d[1], d[2]].map((n) => n.toString(16).padStart(2, '0')).join('').toUpperCase();
} catch { return '—'; }
}
async function aiRead(viaChat = false) {
if (aiBusy) return;
if (!st.img) return _o1l(1, 'Cần ảnh bản đồ trước: bấm "📂 Chọn ảnh/PDF bản đồ quy hoạch". AI đọc chú giải, số quyết định và tìm điểm mốc trên chính ảnh đó.');
if (!viaChat && !G.aiReady()) return _o1l(1, 'Chưa nối AI tự động (dán khoá Gemini ở Cài đặt › Kết nối; nhân viên: nhờ Quản trị).' + (G.canChat() ? ' Trong lúc chờ: bấm "Làm qua chat Claude/Gemini (miễn phí)".' : '') + ' Vẫn làm tay được: ghi nguồn, chạm ảnh để thêm điểm khống chế.');
_od(1);
aiBusy = true; aiBtn.classList.add('g5-wait');
_o1.replaceChildren(h('p', { class: 'bds-muted g5-small', 'data-testid': 'qh-ai-busy' }, viaChat ? 'Đang chờ anh/chị dán kết quả từ chat…' : 'Đang tính chi phí…'));
try {
const prompt = Q.qhPrompt({ name: st.name });
let text = null, cost = null;
if (viaChat) text = await G.aiChat(prompt);
else {
if (!st.imgBlob) { _o1.replaceChildren(); return _o1l(1, 'Ảnh chưa nằm trong máy này – chọn lại ảnh bản đồ rồi bấm lại.'); }
const img = await fileForAi(st.imgBlob);
_o1.replaceChildren(h('p', { class: 'bds-muted g5-small', 'data-testid': 'qh-ai-busy' }, 'Chờ anh/chị đồng ý chi phí…'));
const r = await G.aiRead({ title: '🤖 AI đọc bản đồ quy hoạch', prompt, images: [img], testid: 'qh-ai-cost', what: '1 ảnh bản đồ' });
if (r) { _o1.replaceChildren(h('p', { class: 'bds-muted g5-small', 'data-testid': 'qh-ai-busy' }, 'AI đang đọc ảnh… (thường 10–30 giây)')); text = r.text; cost = r; }
}
if (!text) { _o1.replaceChildren(); return; }
let n = Q.normalizeQhRead(text), demo = false;
if (!n.ok && n.reason === 'demo') { n = Q.normalizeQhRead(Q.DEMO_QH); demo = true; }
if (!n.ok) { _o1.replaceChildren(G.note(n.warnings[0] + '. Thử lại, làm qua chat, hoặc làm tay (ghi nguồn, chạm ảnh để thêm điểm).', 'danger', 'qh-ai-error')); return; }
st.ai = { ...n, at: Date.now(), demo };
_oj(cost); _o1u();
} catch (e) {
_o1.replaceChildren(G.note('AI chưa đọc được: ' + ((e && e.message) || 'lỗi') + '. Vẫn làm tay được: ghi nguồn, chạm ảnh để thêm điểm khống chế.', 'danger', 'qh-ai-error'));
} finally { aiBusy = false; aiBtn.classList.remove('g5-wait'); }
}
function _oj(cost) {
const a = st.ai; if (!a) { _o1.replaceChildren(); return; }
const k = st.img ? { w: st.img.naturalWidth, h: st.img.naturalHeight } : null;
_o1.replaceChildren(
h('b', null, '🤖 AI đọc được (gợi ý – anh/chị đối chiếu bản đồ gốc)'),
a.demo ? G.note('Chế độ Xem thử: đây là KẾT QUẢ MẪU, không đọc từ ảnh của anh/chị.', 'warn', 'qh-ai-demo') : null,
a.title || a.scale ? h('p', { class: 'g5-small' }, [a.title, a.scale ? 'tỉ lệ ' + a.scale : ''].filter(Boolean).join(' · ')) : null,
a.source ? h('div', { class: 'g5-row g5-small' }, h('span', null, 'Nguồn AI thấy trên ảnh: ', h('b', null, a.source)),
a.trusted ? K.button('Dùng làm nguồn (đã đối chiếu)', () => { st.source = a.source; srcIn.value = a.source; _o27(); K.toast('Đã điền nguồn – nhớ đối chiếu văn bản gốc.', 'success'); }, { testid: 'qh-ai-use-source', icon: 'check' }) : null) : null,
a.legend.length ? h('div', { class: 'g5-legend', 'data-testid': 'qh-ai-legend' }, ...a.legend.map((l) => h('span', { class: 'bds-chip g5-small' }, h('i', { class: 'g5-sw', style: { background: l.color } }), l.label))) : null,
a.landmarks.length && k ? h('div', { class: 'g5-row' }, h('span', { class: 'g5-small' }, `${a.landmarks.length} điểm mốc gợi ý để nắn ảnh: ` + a.landmarks.map((_o1q) => _o1q.label).join('; ')),
K.button(`Thêm ${a.landmarks.length} điểm mốc vào ảnh`, () => {
const _o2b = 12 - st.points.length;
if (_o2b <= 0) return _o1l(2, 'Đã đủ 12 điểm – xoá bớt điểm trước khi thêm điểm mốc AI gợi ý.');
a.landmarks.slice(0, _o2b).forEach((_o1q) => st.points.push({ px: Math.round(_o1q.x * k.w * 10) / 10, py: Math.round(_o1q.y * k.h * 10) / 10, lat: null, lng: null, label: _o1q.label }));
_oo(); _ol(); _o25(); goTo(2);
K.toast('Đã thêm điểm mốc – dán toạ độ từng điểm (nút "Tìm trên Google Maps" giúp tìm nhanh).', 'success');
}, { testid: 'qh-ai-add-points' })) : null,
...a.warnings.map((w) => G.note(w, 'warn')),
a.notes ? h('p', { class: 'bds-muted g5-small' }, 'Ghi chú của AI: ' + a.notes) : null,
cost ? h('p', { class: 'bds-muted g5-small' }, cost.cost_usd ? `Đã tốn ≈ ${cost.cost_usd.toLocaleString('vi-VN', { maximumFractionDigits: 4 })} USD (${cost.model || 'Gemini'}).` : `Lần đọc này: 0 USD (${cost.model || 'Gemini'} trong hạn mức miễn phí).`) : null,
h('p', { class: 'bds-muted g5-small' }, 'AI không chấm điểm vị trí. Điểm ở bước 4 do anh/chị chấm từ tài liệu có nguồn. Kết quả AI đọc không phải ranh quy hoạch chính thức.'));
}
function _op() {
_o2f.replaceChildren(...V.CRITERIA.map((_o7) => {
const _o2k = G.select(V.SCALE.map((l, i) => [i, `${i} – ${l}`]), st.rubric.scores[_o7.id] || 0, { 'data-testid': 'qh-s-' + _o7.id, onchange: (e) => { st.rubric.scores[_o7.id] = Number(e.target.value); _or(); } });
const _o2r = _o7.needSource ? G.input({ placeholder: 'Nguồn văn bản (số quyết định, ngày, cơ quan)', value: st.rubric.sources[_o7.id] || '', 'data-testid': 'qh-src-' + _o7.id, oninput: (e) => { st.rubric.sources[_o7.id] = e.target.value; _or(); } }) : null;
return h('div', { class: 'g5-li g5-stack' }, h('div', null, h('b', null, `${_o7.label} (${_o7.weight})`), h('div', { class: 'bds-muted g5-small' }, _o7.hint), _o2r), _o2k);
}), h('div', null, h('b', null, 'Điểm cần kiểm tra kỹ'), ...V.RED_FLAGS.map((_ou) => h('label', { class: 'g5-row g5-small' },
h('input', { type: 'checkbox', checked: !!st.rubric.flags[_ou.id], 'data-testid': 'qh-f-' + _ou.id, onchange: (e) => { st.rubric.flags[_ou.id] = e.target.checked; _or(); } }), _ou.label))));
_or();
}
function _or() {
const r = V.scoreLocation(st.rubric);
const _o12 = r.max > 0 && !r.trusted;
scoreBox.replaceChildren(
_o12 ? h('div', { class: 'g5-row', 'data-testid': 'qh-untrusted' }, h('div', { class: 'g5-stat' }, h('b', { 'data-testid': 'qh-total' }, '—'), h('span', null, V.UNTRUSTED)),
h('div', { class: 'g5-stat' }, h('span', null, r.label)))
: h('div', { class: 'g5-row' }, h('div', { class: 'g5-stat' }, h('b', { 'data-testid': 'qh-total' }, r.max ? r.total + '/100' : '—'), h('span', null, 'Điểm vị trí')),
h('div', { class: 'g5-stat' }, h('b', null, r.grade), h('span', null, r.label))),
...r.rows.filter((q) => q.score && !q.counted).map((q) => G.note(`${q.label}: ${q.reason}.`, 'warn')),
...r.flags.map((_ou) => G.note('⚠ ' + _ou.label, 'danger')),
...r.warnings.map((w) => G.note(w, 'warn')),
h('p', { class: 'bds-muted g5-small' }, 'Điểm do anh/chị tự chấm từ tài liệu có nguồn – app không tự đánh giá thay. Trọng số là gợi ý.'));
_o28();
return r;
}
async function save() {
const ai = st.ai ? { title: st.ai.title, scale: st.ai.scale, source: st.ai.source, legend: st.ai.legend, confidence: st.ai.confidence, trusted: st.ai.trusted, demo: !!st.ai.demo, at: st.ai.at } : null;
const data = { name: st.name, source: st.source, points: st.points, pin: st.pin, rubric: st.rubric, view: st.view, opacity: st.opacity, ai, img: st.img ? { name: st.imgName, w: st.img.naturalWidth, h: st.img.naturalHeight } : null };
let _o2e;
try { _o2e = await G.saveDoc(KIND, { id: st.id, name: st.name || 'Khu đất chưa đặt tên', data }); } catch (e) { return _o1l(4, 'Chưa lưu được: ' + ((e && e.message) || 'lỗi')); }
st.id = _o2e.id;
if (st.imgBlob) { try { await files.put(_o2e.id, st.imgBlob, { name: st.imgName }); } catch { K.toast('Không lưu được ảnh trên máy này – điểm khống chế vẫn được lưu.', 'warn'); } }
K.toast('Đã lưu khu đất.', 'success');
_oq();
}
async function open(d) {
_o29(false);
st.id = d.id; Object.assign(st, { name: d.data.name || d.name, source: d.data.source || '', points: d.data.points || [], pin: d.data.pin || null, rubric: { scores: {}, sources: {}, flags: {}, ...(d.data.rubric || {}) }, opacity: d.data.opacity ?? 0.6 });
st.ai = d.data.ai ? { legend: [], landmarks: [], warnings: [], ...d.data.ai } : null;
if (d.data.view) st.view = { ...st.view, ...d.data.view };
_o1k.value = st.name; srcIn.value = st.source; opacity.value = Math.round(st.opacity * 100); _o1o.textContent = opacity.value + '%';
_o1t.value = st.pin ? `${st.pin.lat}, ${st.pin.lng}` : '';
const _ou = await files.get(d.id).catch(() => null);
if (_ou && _ou.blob) { st.imgName = _ou.name || ''; await _o1a(_ou.blob, { keepPoints: true, savedDims: d.data.img }); }
else { imgInfo.textContent = d.data.img ? `Ảnh "${d.data.img.name}" không có trên máy này – nạp lại đúng ảnh đó để xem chồng lớp (điểm khống chế giữ nguyên).` : ''; _ol(); _oo(); _o25(); }
_oj(); _op(); _o27();
}
function _o29(redraw = true) {
Object.assign(st, { id: null, name: '', source: '', points: [], img: null, imgBlob: null, imgName: '', pin: null, ai: null, tap: 'point', rubric: { scores: {}, sources: {}, flags: {} } });
fit = null; _o1k.value = ''; srcIn.value = ''; _ov.value = ''; imgInfo.textContent = ''; _o1t.value = ''; tapTabs.set('point');
_o1.replaceChildren(); [1, 2, 3, 4].forEach(_od);
if (redraw) { _ol(); _oo(); _o25(); _op(); _o27(); }
}
async function _ot() {
const _o23 = V.scoreLocation(st.rubric);
const _o18 = _o23.rows.filter((q) => q.score).length + _o23.flags.length;
_om();
const _o1h = Math.min(760, Math.round((1080 - 96) * mapCv.height / Math.max(1, mapCv.width)));
const W = 1080, H = Math.max(1350, 180 + _o1h + 50 + 44 + _o18 * 30 + 150), _o7 = document.createElement('canvas'); _o7.width = W; _o7.height = H;
const x = _o7.getContext('2d');
x.fillStyle = '#F7F3EA'; x.fillRect(0, 0, W, H);
x.fillStyle = '#0F1E33'; x.font = `bold 44px ${FONT}`; x.fillText(st.name || 'Khu đất', 48, 80);
x.font = `24px ${FONT}`; x.fillStyle = '#5F6979'; wrapText(x, 'Nguồn bản đồ: ' + (st.source || 'CHƯA GHI NGUỒN – cần nguồn bản đồ quy hoạch chính thức'), 48, 120, W - 96, 30);
_om();
const _o1g = Math.round((W - 96) * mapCv.height / Math.max(1, mapCv.width));
try { x.drawImage(mapCv, 48, 180, W - 96, Math.min(_o1g, 760)); } catch { }
const r = V.scoreLocation(st.rubric);
let y = 180 + Math.min(_o1g, 760) + 50;
x.fillStyle = '#0F1E33'; x.font = `bold 34px ${FONT}`; x.fillText(r.max && !r.trusted ? `Điểm vị trí: ${V.UNTRUSTED} · ${r.label}` : `Điểm vị trí: ${r.max ? r.total + '/100' : '—'} · ${r.grade} · ${r.label}`, 48, y); y += 44;
x.font = `22px ${FONT}`;
r.rows.filter((q) => q.score).forEach((q) => { x.fillText(`• ${q.label}: ${q.score}/5${q.counted ? '' : ' (chưa tính – ' + q.reason + ')'}`, 48, y); y += 30; });
r.flags.forEach((_ou) => { x.fillStyle = '#B4423A'; x.fillText('⚠ ' + _ou.label, 48, y); y += 30; });
x.fillStyle = '#F7F3EA'; x.fillRect(0, H - 118, W, 118);
x.fillStyle = '#B4423A'; x.font = `bold 21px ${FONT}`;
wrapText(x, '⚠ ' + V.NOT_OFFICIAL, 48, H - 86, W - 96, 28);
try { await G.savePng(_o7, 'vi-tri-' + G.slug(st.name)); } catch { K.toast('Không xuất được ảnh (nền bản đồ chặn sao chép).', 'warn'); }
}
function _os() {
if (!st.points.length) return _o1l(2, 'Chưa có điểm khống chế để tải – chạm vào ảnh để thêm điểm trước.', st.img ? 2 : 1);
const data = { name: st.name, source: st.source, crs: 'EPSG:3857', points: st.points, affine: fit && fit.ok ? fit.T : null, rms_m: fit && fit.ok ? fit.rms : null, image: st.imgName };
G.download('diem-khong-che-' + G.slug(st.name) + '.json', JSON.stringify(data, null, 2), 'application/json');
}
_oq(); _ol(); _oo(); _o25(); _op(); _o27();
const _o2a = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => _o2j()) : null;
if (_o2a) _o2a.observe(mapBox);
_oc = () => { closePdf(); if (_o2a) _o2a.disconnect(); };
setTimeout(_om, 50);
_o26();
_om();
return _o2c;
}
export default {
manifest: {
id: 'g5_quyhoach', title: 'Chồng bản đồ quy hoạch', icon: '🗺️', screen: 'sales', order: 510, version: '0.1.0', status: 'ready',
desc: 'Thử nghiệm · nguồn chính thức, chấm điểm vị trí',
help: 'Làm theo 4 bước: 1) chọn ảnh bản đồ quy hoạch tải từ cổng chính thức và ghi nguồn; 2) chạm ảnh chọn ≥ 3 điểm khống chế, dán toạ độ từ Google Maps để nắn ảnh; 3) chỉnh độ đậm lớp quy hoạch, đặt vị trí cần chấm; 4) đọc màu ô đất và chấm điểm có nguồn. Nút "AI đọc bản đồ" (báo phí trước) gợi ý nguồn, chú giải và điểm mốc – AI không chấm điểm. App không có sẵn dữ liệu quy hoạch.',
},
mount,
unmount,
async selftest(ctx) {
return selftestWith(ctx, () => {
const _ou = Geo.fitAffine([{ px: 0, py: 0, lat: 21.03, lng: 105.85 }, { px: 100, py: 0, lat: 21.03, lng: 105.86 }, { px: 0, py: 100, lat: 21.02, lng: 105.85 }]);
return _ou.ok && V.scoreLocation({ scores: { giaothong: 5 } }).total === 100 && Q.qhSteps({}).next.id === 'nguon';
});
},
};

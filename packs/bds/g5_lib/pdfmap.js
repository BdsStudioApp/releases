export const PDFJS_VERSION = '6.5.438';
export const PDF_MAX_MB = 20;
export const PDF_MAX_BYTES = PDF_MAX_MB * 1024 * 1024;
export const PDF_MAX_PAGES = 30;
export const PDF_MAX_SIDE = 3600;
export const PDF_MAX_PIXELS = 12_000_000;
export const PDF_MAX_IMAGE_PIXELS = 160_000_000;
export const PDF_OPEN_TIMEOUT_MS = 45000;
export const PDF_RENDER_TIMEOUT_MS = 60000;
export function isPdfFile(file) {
return !!file && (/pdf/i.test(file.type || '') || /\.pdf$/i.test(file.name || ''));
}
export function pdfSizeProblem(size) {
if (!(size > 0)) return 'Tệp PDF rỗng – chọn lại đúng tệp bản đồ.';
if (size > PDF_MAX_BYTES) return `PDF lớn ${(size / 2 ** 20).toFixed(1).replace('.', ',')} MB, vượt mức ${PDF_MAX_MB} MB. Hãy xuất lại PDF nhỏ hơn (chỉ trang có khu đất) hoặc chụp màn hình phần khu đất rồi chọn ảnh chụp.`;
return '';
}
export function pdfPagesProblem(n) {
if (!(n >= 1)) return 'PDF không có trang nào.';
if (n > PDF_MAX_PAGES) return `PDF có ${n} trang, vượt mức ${PDF_MAX_PAGES} trang. Hãy tách riêng trang bản đồ cần dùng (trình đọc PDF: In → Lưu thành PDF, chọn đúng trang) rồi chọn lại.`;
return '';
}
export function looksLikePdf(bytes) {
if (!bytes || !bytes.length) return false;
const n = Math.min(bytes.length, 1024);
for (let _o7 = 0; _o7 + 4 < n; _o7++) if (bytes[_o7] === 0x25 && bytes[_o7 + 1] === 0x50 && bytes[_o7 + 2] === 0x44 && bytes[_o7 + 3] === 0x46 && bytes[_o7 + 4] === 0x2D) return true;
return false;
}
export function parsePageNumber(v, total) {
const _of = String(v == null ? '' : v).trim().replace(',', '.');
if (!/^\d+(\.0+)?$/.test(_of)) return null;
const n = Math.floor(Number(_of));
return n >= 1 && n <= total ? n : null;
}
export function renderScale(wPt, hPt, { maxSide = PDF_MAX_SIDE, maxPixels = PDF_MAX_PIXELS, maxZoom = 4 } = {}) {
const w = Number(wPt), h = Number(hPt);
if (!(w > 0) || !(h > 0)) return 1;
let k = Math.min(maxZoom, maxSide / Math.max(w, h));
if (w * k * h * k > maxPixels) k = Math.sqrt(maxPixels / (w * h));
return k;
}
export function workSize(w, h, { maxPixels = PDF_MAX_PIXELS, maxSide = 8192 } = {}) {
const W = Number(w), H = Number(h);
if (!(W > 0) || !(H > 0)) return { w: 0, h: 0, k: 1 };
const k = Math.min(1, Math.sqrt(maxPixels / (W * H)), maxSide / Math.max(W, H));
return { w: Math.max(1, Math.round(W * k)), h: Math.max(1, Math.round(H * k)), k };
}
export function rescalePoints(points, fromW, toW) {
const k = Number(toW) / Number(fromW);
if (!Array.isArray(points) || !(k > 0) || !Number.isFinite(k) || Math.abs(k - 1) < 1e-9) return points || [];
return points.map((p) => ({ ...p, px: Math.round(p.px * k * 10) / 10, py: Math.round(p.py * k * 10) / 10 }));
}
export function isMostlyBlank(rgba, { tol = 16, maxOther = 0.002 } = {}) {
const n = Math.floor(((rgba && rgba.length) || 0) / 4);
if (!n) return false;
const _ob = (_o7) => { const _o0 = rgba[_o7 * 4 + 3] / 255; return [rgba[_o7 * 4] * _o0 + 255 * (1 - _o0), rgba[_o7 * 4 + 1] * _o0 + 255 * (1 - _o0), rgba[_o7 * 4 + 2] * _o0 + 255 * (1 - _o0)]; };
const _og = Math.max(1, Math.floor(n / 1000)), seen = new Map();
let _o3 = null, best = 0;
for (let _o7 = 0; _o7 < n; _o7 += _og) { const p = _ob(_o7), k = p.map((v) => v >> 3).join(','); const _o4 = (seen.get(k) || 0) + 1; seen.set(k, _o4); if (_o4 > best) { best = _o4; _o3 = p; } }
const _oa = Math.floor(n * maxOther);
let _oc = 0;
for (let _o7 = 0; _o7 < n; _o7++) {
const _o0 = rgba[_o7 * 4 + 3] / 255;
if (Math.abs(rgba[_o7 * 4] * _o0 + 255 * (1 - _o0) - _o3[0]) > tol || Math.abs(rgba[_o7 * 4 + 1] * _o0 + 255 * (1 - _o0) - _o3[1]) > tol || Math.abs(rgba[_o7 * 4 + 2] * _o0 + 255 * (1 - _o0) - _o3[2]) > tol) { if (++_oc > _oa) return false; }
}
return true;
}
export function pdfImageName(fileName, _od = 1) {
const _o1 = String(fileName || 'ban-do').replace(/\.pdf$/i, '').replace(/[\\/:*?"<>|]+/g, '-').trim().slice(0, 80) || 'ban-do';
return `${_o1}-trang-${_od}.png`;
}
export function pdfErrorMessage(_o6) {
const name = String((_o6 && _o6.name) || ''), msg = String((_o6 && _o6.message) || _o6 || '');
if (name === 'PasswordException' || /password/i.test(msg)) return 'PDF này đặt mật khẩu nên app không đọc được. Mở PDF bằng trình đọc PDF, nhập mật khẩu, rồi chọn In → Lưu thành PDF (bản không mật khẩu) hoặc chụp màn hình phần khu đất, rồi chọn lại.';
if (name === 'PdfOpenTimeout') return 'Mở PDF quá lâu (hơn ' + Math.round(PDF_OPEN_TIMEOUT_MS / 1000) + ' giây) nên app dừng. Tệp có thể hỏng hoặc quá nặng – xuất lại PDF nhẹ hơn, hoặc chụp màn hình phần khu đất rồi chọn ảnh chụp.';
if (name === 'PdfBlank') return 'Trang PDF vẽ ra gần như trắng: trang chứa ảnh quét quá lớn hoặc trống – hãy chụp màn hình bản đồ rồi chọn ảnh (hoặc thử trang khác).';
if (name === 'PdfTimeout' || name === 'RenderingCancelledException') return 'Trang PDF này quá nặng nên app dừng vẽ sau ' + Math.round(PDF_RENDER_TIMEOUT_MS / 1000) + ' giây. Thử trang khác, xuất lại PDF nhẹ hơn, hoặc chụp màn hình phần khu đất rồi chọn ảnh chụp.';
if (name === 'InvalidPDFException' || name === 'FormatError' || name === 'MissingPDFException' || /invalid pdf|missing pdf|not a pdf|xref|stream must have data/i.test(msg)) return 'Tệp PDF bị hỏng hoặc không đúng định dạng PDF – tải lại tệp từ cổng quy hoạch (hoặc xuất lại PDF) rồi chọn lại.';
if (name === 'PdfLibLoad' || /dynamically imported module|Failed to fetch|Importing a module script failed|NetworkError|Load failed/i.test(msg)) return 'Không nạp được bộ đọc PDF của app (mất mạng khi mở lần đầu hoặc tệp app chưa tải đủ). Kết nối mạng rồi thử lại; hoặc chụp màn hình phần khu đất rồi chọn ảnh chụp.';
if (/memory|allocation|array buffer|canvas/i.test(msg)) return 'Máy hết bộ nhớ khi vẽ trang PDF. Đóng bớt thẻ trình duyệt rồi thử lại, hoặc chụp màn hình phần khu đất rồi chọn ảnh chụp.';
return 'Không đọc được PDF này (' + (msg.slice(0, 120) || 'lỗi không rõ') + '). Thử xuất lại PDF, hoặc chụp màn hình phần khu đất rồi chọn ảnh chụp.';
}
const _o2 = () => new URL('../../../vendor/pdfjs/' + PDFJS_VERSION + '/', import.meta.url);
let _o9 = null;
export function loadPdfjs() {
if (!_o9) {
_o9 = (async () => {
const _o1 = _o2();
const _o8 = await import(new URL('pdf.min.mjs', _o1).href);
_o8.GlobalWorkerOptions.workerSrc = new URL('pdf.worker.min.mjs', _o1).href;
return _o8;
})().catch((e) => { _o9 = null; const _o6 = new Error((e && e.message) || 'không nạp được pdf.js'); _o6.name = 'PdfLibLoad'; throw _o6; });
}
return _o9;
}
function _oi(name = 'PdfTimeout') { const e = new Error('quá thời gian'); e.name = name; return e; }
export async function openPdf(bytes, { timeoutMs = PDF_OPEN_TIMEOUT_MS } = {}) {
const _o8 = await loadPdfjs();
const _o1 = _o2();
const _oh = _o8.getDocument({
data: bytes, isEvalSupported: false, useWasm: false, enableXfa: false, useSystemFonts: false,
maxImageSize: PDF_MAX_IMAGE_PIXELS,
standardFontDataUrl: new URL('standard_fonts/', _o1).href, wasmUrl: new URL('wasm/', _o1).href, verbosity: 0,
});
let _oj = 0;
try {
return await Promise.race([_oh.promise, new Promise((_, rej) => { _oj = setTimeout(() => rej(_oi('PdfOpenTimeout')), timeoutMs); })]);
} catch (e) { try { _oh.destroy(); } catch { } throw e; } finally { clearTimeout(_oj); }
}
export async function closePdf(doc) { try { if (doc && doc.loadingTask) await doc.loadingTask.destroy(); } catch { } }
export async function renderPageTo(doc, pageNo, canvas, { maxSide = PDF_MAX_SIDE, maxPixels = PDF_MAX_PIXELS, timeoutMs = PDF_RENDER_TIMEOUT_MS } = {}) {
const _od = await doc.getPage(pageNo);
try {
const _ok = _od.getViewport({ scale: 1 });
const scale = renderScale(_ok.width, _ok.height, { maxSide, maxPixels });
const _ol = _od.getViewport({ scale });
canvas.width = Math.max(1, Math.round(_ol.width)); canvas.height = Math.max(1, Math.round(_ol.height));
const _oh = _od.render({ canvas, viewport: _ol });
const _oj = setTimeout(() => { try { _oh.cancel(); } catch { } }, timeoutMs);
try { await _oh.promise; } catch (e) { if (e && e.name === 'RenderingCancelledException') throw _oi(); throw e; } finally { clearTimeout(_oj); }
if (_o5(canvas)) { const e = new Error('trang trắng'); e.name = 'PdfBlank'; throw e; }
return { width: canvas.width, height: canvas.height, scale };
} finally { try { _od.cleanup(); } catch { } }
}
function _o5(canvas) {
try { return isMostlyBlank(canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height).data); } catch { return false; }
}
export async function renderPagePng(doc, pageNo, fileName) {
const canvas = document.createElement('canvas');
const _oe = await renderPageTo(doc, pageNo, canvas);
const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
canvas.width = canvas.height = 1;
if (!blob) { const e = new Error('canvas không tạo được ảnh (hết bộ nhớ)'); e.name = 'PdfMemory'; throw e; }
return { blob, width: _oe.width, height: _oe.height, name: pdfImageName(fileName, pageNo) };
}

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
for (let _o8 = 0; _o8 + 4 < n; _o8++) if (bytes[_o8] === 0x25 && bytes[_o8 + 1] === 0x50 && bytes[_o8 + 2] === 0x44 && bytes[_o8 + 3] === 0x46 && bytes[_o8 + 4] === 0x2D) return true;
return false;
}
export function parsePageNumber(v, total) {
const _og = String(v == null ? '' : v).trim().replace(',', '.');
if (!/^\d+(\.0+)?$/.test(_og)) return null;
const n = Math.floor(Number(_og));
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
const _o0 = Number(w), H = Number(h);
if (!(_o0 > 0) || !(H > 0)) return { w: 0, h: 0, k: 1 };
const k = Math.min(1, Math.sqrt(maxPixels / (_o0 * H)), maxSide / Math.max(_o0, H));
return { w: Math.max(1, Math.round(_o0 * k)), h: Math.max(1, Math.round(H * k)), k };
}
export function rescalePoints(points, fromW, toW) {
const k = Number(toW) / Number(fromW);
if (!Array.isArray(points) || !(k > 0) || !Number.isFinite(k) || Math.abs(k - 1) < 1e-9) return points || [];
return points.map((p) => ({ ...p, px: Math.round(p.px * k * 10) / 10, py: Math.round(p.py * k * 10) / 10 }));
}
export function isMostlyBlank(rgba, { tol = 16, maxOther = 0.002 } = {}) {
const n = Math.floor(((rgba && rgba.length) || 0) / 4);
if (!n) return false;
const _oc = (_o8) => { const _o1 = rgba[_o8 * 4 + 3] / 255; return [rgba[_o8 * 4] * _o1 + 255 * (1 - _o1), rgba[_o8 * 4 + 1] * _o1 + 255 * (1 - _o1), rgba[_o8 * 4 + 2] * _o1 + 255 * (1 - _o1)]; };
const _oh = Math.max(1, Math.floor(n / 1000)), seen = new Map();
let _o4 = null, best = 0;
for (let _o8 = 0; _o8 < n; _o8 += _oh) { const p = _oc(_o8), k = p.map((v) => v >> 3).join(','); const _o5 = (seen.get(k) || 0) + 1; seen.set(k, _o5); if (_o5 > best) { best = _o5; _o4 = p; } }
const _ob = Math.floor(n * maxOther);
let _od = 0;
for (let _o8 = 0; _o8 < n; _o8++) {
const _o1 = rgba[_o8 * 4 + 3] / 255;
if (Math.abs(rgba[_o8 * 4] * _o1 + 255 * (1 - _o1) - _o4[0]) > tol || Math.abs(rgba[_o8 * 4 + 1] * _o1 + 255 * (1 - _o1) - _o4[1]) > tol || Math.abs(rgba[_o8 * 4 + 2] * _o1 + 255 * (1 - _o1) - _o4[2]) > tol) { if (++_od > _ob) return false; }
}
return true;
}
export function pdfImageName(fileName, _oe = 1) {
const _o2 = String(fileName || 'ban-do').replace(/\.pdf$/i, '').replace(/[\\/:*?"<>|]+/g, '-').trim().slice(0, 80) || 'ban-do';
return `${_o2}-trang-${_oe}.png`;
}
export function pdfErrorMessage(_o7) {
const name = String((_o7 && _o7.name) || ''), msg = String((_o7 && _o7.message) || _o7 || '');
if (name === 'PasswordException' || /password/i.test(msg)) return 'PDF này đặt mật khẩu nên app không đọc được. Mở PDF bằng trình đọc PDF, nhập mật khẩu, rồi chọn In → Lưu thành PDF (bản không mật khẩu) hoặc chụp màn hình phần khu đất, rồi chọn lại.';
if (name === 'PdfOpenTimeout') return 'Mở PDF quá lâu (hơn ' + Math.round(PDF_OPEN_TIMEOUT_MS / 1000) + ' giây) nên app dừng. Tệp có thể hỏng hoặc quá nặng – xuất lại PDF nhẹ hơn, hoặc chụp màn hình phần khu đất rồi chọn ảnh chụp.';
if (name === 'PdfBlank') return 'Trang PDF vẽ ra gần như trắng: trang chứa ảnh quét quá lớn hoặc trống – hãy chụp màn hình bản đồ rồi chọn ảnh (hoặc thử trang khác).';
if (name === 'PdfTimeout' || name === 'RenderingCancelledException') return 'Trang PDF này quá nặng nên app dừng vẽ sau ' + Math.round(PDF_RENDER_TIMEOUT_MS / 1000) + ' giây. Thử trang khác, xuất lại PDF nhẹ hơn, hoặc chụp màn hình phần khu đất rồi chọn ảnh chụp.';
if (name === 'InvalidPDFException' || name === 'FormatError' || name === 'MissingPDFException' || /invalid pdf|missing pdf|not a pdf|xref|stream must have data/i.test(msg)) return 'Tệp PDF bị hỏng hoặc không đúng định dạng PDF – tải lại tệp từ cổng quy hoạch (hoặc xuất lại PDF) rồi chọn lại.';
if (name === 'PdfLibLoad' || /dynamically imported module|Failed to fetch|Importing a module script failed|NetworkError|Load failed/i.test(msg)) return 'Không nạp được bộ đọc PDF của app (mất mạng khi mở lần đầu hoặc tệp app chưa tải đủ). Kết nối mạng rồi thử lại; hoặc chụp màn hình phần khu đất rồi chọn ảnh chụp.';
if (/memory|allocation|array buffer|canvas/i.test(msg)) return 'Máy hết bộ nhớ khi vẽ trang PDF. Đóng bớt thẻ trình duyệt rồi thử lại, hoặc chụp màn hình phần khu đất rồi chọn ảnh chụp.';
return 'Không đọc được PDF này (' + (msg.slice(0, 120) || 'lỗi không rõ') + '). Thử xuất lại PDF, hoặc chụp màn hình phần khu đất rồi chọn ảnh chụp.';
}
const _o3 = () => new URL('../../../vendor/pdfjs/' + PDFJS_VERSION + '/', import.meta.url);
let _oa = null;
export function loadPdfjs() {
if (!_oa) {
_oa = (async () => {
const _o2 = _o3();
const _o9 = await import(new URL('pdf.min.mjs', _o2).href);
_o9.GlobalWorkerOptions.workerSrc = new URL('pdf.worker.min.mjs', _o2).href;
return _o9;
})().catch((e) => { _oa = null; const _o7 = new Error((e && e.message) || 'không nạp được pdf.js'); _o7.name = 'PdfLibLoad'; throw _o7; });
}
return _oa;
}
function _oj(name = 'PdfTimeout') { const e = new Error('quá thời gian'); e.name = name; return e; }
export async function openPdf(bytes, { timeoutMs = PDF_OPEN_TIMEOUT_MS } = {}) {
const _o9 = await loadPdfjs();
const _o2 = _o3();
const _oi = _o9.getDocument({
data: bytes, isEvalSupported: false, useWasm: false, enableXfa: false, useSystemFonts: false,
maxImageSize: PDF_MAX_IMAGE_PIXELS,
standardFontDataUrl: new URL('standard_fonts/', _o2).href, wasmUrl: new URL('wasm/', _o2).href, verbosity: 0,
});
let _ok = 0;
try {
return await Promise.race([_oi.promise, new Promise((_, rej) => { _ok = setTimeout(() => rej(_oj('PdfOpenTimeout')), timeoutMs); })]);
} catch (e) { try { _oi.destroy(); } catch { } throw e; } finally { clearTimeout(_ok); }
}
export async function closePdf(doc) { try { if (doc && doc.loadingTask) await doc.loadingTask.destroy(); } catch { } }
export async function renderPageTo(doc, pageNo, canvas, { maxSide = PDF_MAX_SIDE, maxPixels = PDF_MAX_PIXELS, timeoutMs = PDF_RENDER_TIMEOUT_MS } = {}) {
const _oe = await doc.getPage(pageNo);
try {
const _ol = _oe.getViewport({ scale: 1 });
const scale = renderScale(_ol.width, _ol.height, { maxSide, maxPixels });
const _om = _oe.getViewport({ scale });
canvas.width = Math.max(1, Math.round(_om.width)); canvas.height = Math.max(1, Math.round(_om.height));
const _oi = _oe.render({ canvas, viewport: _om });
const _ok = setTimeout(() => { try { _oi.cancel(); } catch { } }, timeoutMs);
try { await _oi.promise; } catch (e) { if (e && e.name === 'RenderingCancelledException') throw _oj(); throw e; } finally { clearTimeout(_ok); }
if (_o6(canvas)) { const e = new Error('trang trắng'); e.name = 'PdfBlank'; throw e; }
return { width: canvas.width, height: canvas.height, scale };
} finally { try { _oe.cleanup(); } catch { } }
}
function _o6(canvas) {
try { return isMostlyBlank(canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height).data); } catch { return false; }
}
export async function renderPagePng(doc, pageNo, fileName) {
const canvas = document.createElement('canvas');
const _of = await renderPageTo(doc, pageNo, canvas);
const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
canvas.width = canvas.height = 1;
if (!blob) { const e = new Error('canvas không tạo được ảnh (hết bộ nhớ)'); e.name = 'PdfMemory'; throw e; }
return { blob, width: _of.width, height: _of.height, name: pdfImageName(fileName, pageNo) };
}

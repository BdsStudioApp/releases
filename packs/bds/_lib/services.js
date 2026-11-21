import { PROVIDERS as SCENE_AI, PRICE_PAGES } from './videoai.js';
import { VBEE_VOICES } from './characters.js';
import { sceneSeconds } from './render_plan.js';
export const PAID_NOTE = 'Dịch vụ của bên thứ ba – anh/chị trả phí riêng theo gói của hãng, app không thu thêm';
export const OLD_SERVER_TEXT = 'Cần cập nhật máy chủ một lần (Cài đặt › Phiên bản) để dùng dịch vụ này';
export const TASKS = { render: 'Dựng video', voice: 'Giọng đọc', scene: 'Cảnh AI' };
export const SERVICES = [
{ id: 'shotstack', task: 'render', mode: 'server', paid: true, verified: true, label: 'Shotstack – dựng MP4 trên mạng',
docs_url: 'https://shotstack.io/docs/api/', pricing_url: 'https://shotstack.io/pricing/', unit: 'seconds',
key_label: 'Khoá API Shotstack (x-api-key)', extra: { label: 'Môi trường', options: [['v1', 'v1 – bản chính thức (không watermark)'], ['stage', 'stage – bản thử (có watermark)']] },
hint: 'Dựng MP4 từ dàn cảnh (bản đồ, thẻ chữ, phụ đề, giọng đọc) trên máy của Shotstack. Đăng ký tài khoản ở shotstack.io, lấy khoá API ở trang quản lý của hãng.' },
{ id: 'claude', task: 'render', mode: 'manual', paid: false, verified: true, label: 'Chuyển cho Claude dựng bằng skill',
hint: 'App tạo gói đề bài (config JSON / dàn cảnh đã duyệt) để anh/chị dán vào Claude – Claude dựng bằng skill của anh/chị. Không tốn phí app.' },
{ id: 'vbee', task: 'voice', mode: 'server', paid: true, verified: true, label: 'Vbee – giọng Việt AI', docs_url: 'https://vbee.vn', pricing_url: 'https://vbee.vn', unit: 'chars',
key_label: 'Token Vbee', extra: { label: 'App ID Vbee', placeholder: 'App ID trong trang nhà phát triển Vbee' },
hint: 'Giọng tiếng Việt (giọng mặc định của skill: Mạnh Dũng – nam Hà Nội đọc tin). Tính theo ký tự theo gói của Vbee.' },
{ id: 'elevenlabs', task: 'voice', mode: 'server', paid: true, verified: false, label: 'ElevenLabs – giọng AI đa ngôn ngữ',
docs_url: 'https://elevenlabs.io/docs/api-reference/text-to-speech/convert', pricing_url: 'https://elevenlabs.io/pricing', unit: 'chars',
key_label: 'Khoá API ElevenLabs (xi-api-key)', extra: { label: 'Voice ID mặc định (tuỳ chọn)', placeholder: 'Mã giọng trong thư viện giọng ElevenLabs' },
hint: 'Giọng đa ngôn ngữ (có tiếng Việt ở mô hình đa ngôn ngữ). Tính theo ký tự theo gói của ElevenLabs.' },
{ id: 'self', task: 'voice', mode: 'manual', paid: false, verified: true, label: 'Tự thu âm',
hint: 'Anh/chị tự thu lời đọc (điện thoại, máy ghi âm), đưa tệp lên Google Drive hoặc nơi có link https công khai rồi dán link.' },
...SCENE_AI.map((p) => ({ id: p.id, task: 'scene', mode: p.mode === 'manual' ? 'manual' : 'videoai', paid: true, verified: p.verified, label: p.label, short: p.short,
docs_url: PRICE_PAGES[p.id] || '', hint: p.hint })),
];
export const SERVER_IDS = SERVICES.filter((s) => s.mode === 'server').map((s) => s.id);
export const byId = (id) => SERVICES.find((s) => s.id === id) || null;
export const forTask = (task) => SERVICES.filter((s) => s.task === task);
export function isOldServer(e) {
if (!e || typeof e !== 'object') return false;
if (e.missingAction === true || e.code === 'UNKNOWN_ACTION') return true;
return e.code === 'BAD_INPUT' && /không được hỗ trợ|not supported|unknown action/i.test(String(e.serverMessage || e.message || ''));
}
const _o2 = (u) => { const s = String(u || '').trim(); try { return new URL(s).protocol === 'https:' ? s : ''; } catch { return ''; } };
export function normStatus(resp) {
const S = (resp && resp.services) || {};
const _o4 = {};
for (const id of SERVER_IDS) {
const _o7 = S[id] || {}, _o1 = byId(id);
_o4[id] = { connected: _o7.connected === true, verified: typeof _o7.verified === 'boolean' ? _o7.verified : _o1.verified, docs_url: _o2(_o7.docs_url) || _o1.docs_url,
hint: String(_o7.hint || '').slice(0, 300), at: Number(_o7.at) || 0 };
}
return _o4;
}
export const ELEVEN_VOICES = [{ code: '', label: 'Giọng mặc định đã chọn khi kết nối (hoặc dán Voice ID bên dưới)', verified: false }];
export function voicesFor(provider) {
if (provider === 'vbee') return VBEE_VOICES.map((_o6) => ({ code: _o6.code, label: _o6.label + (_o6.verified ? '' : ' · kiểm mã giọng'), verified: _o6.verified }));
if (provider === 'elevenlabs') return ELEVEN_VOICES.slice();
return [];
}
export const PRICE_UNITS = [['usd_per_minute', 'USD / phút video'], ['usd_per_second', 'USD / giây video'], ['usd_per_1000_chars', 'USD / 1.000 ký tự']];
export function usage(task, scenes = [], { seconds } = {}) {
if (task === 'voice') return { task, chars: (scenes || []).reduce((a, s) => a + String((s && s.say) || '').trim().length, 0) };
const _o5 = Number.isFinite(Number(seconds)) && seconds !== null && seconds !== undefined ? Number(seconds) : (scenes || []).reduce((a, s) => a + sceneSeconds(s), 0);
return { task, seconds: Math.round(_o5 * 100) / 100 };
}
const vn = (_o7) => String(Math.round(_o7 * 10000) / 10000).replace('.', ',');
export const usageText = (u) => (u && u.chars !== undefined ? `≈ ${u.chars.toLocaleString('vi-VN')} ký tự` : u ? `≈ ${vn(u.seconds)} giây video` : '');
export function costOf(id, u, prices = []) {
const row = (prices || []).find((p) => p && p.id === id && Number.isFinite(Number(p.value)) && p.value !== '' && p.value !== null);
if (!row || !u) return null;
const _o6 = Number(row.value);
let usd = null;
if (row.unit === 'usd_per_minute' && u.seconds !== undefined) usd = (u.seconds / 60) * _o6;
else if (row.unit === 'usd_per_second' && u.seconds !== undefined) usd = u.seconds * _o6;
else if (row.unit === 'usd_per_1000_chars' && u.chars !== undefined) usd = (u.chars / 1000) * _o6;
return usd === null ? null : { usd: Math.round(usd * 10000) / 10000, row };
}
export function costLine(id, u, prices = []) {
const _o1 = costOf(id, u, prices);
const _o0 = 'Ước tính dùng: ' + usageText(u);
if (!_o1) return _o0 + ' · chưa nhập giá – app không hiện tiền (xem giá trên trang của hãng)';
return _o0 + ` · ≈ ${vn(_o1.usd)} USD theo bảng giá anh/chị nhập${_o1.row.checked_at ? ' ngày ' + _o1.row.checked_at : ''}`;
}
export function priceProblem(rows) {
for (let _o3 = 0; _o3 < (rows || []).length; _o3++) {
const r = rows[_o3] || {};
if (!byId(r.id)) return `Dòng ${_o3 + 1}: dịch vụ không có`;
if (!PRICE_UNITS.some(([u]) => u === r.unit)) return `Dòng ${_o3 + 1}: đơn vị giá không hợp lệ`;
const _o6 = String(r.value ?? '').trim().replace(',', '.');
if (_o6 !== '' && !(Number.isFinite(Number(_o6)) && Number(_o6) >= 0)) return `Dòng ${_o3 + 1}: giá phải là số từ 0 trở lên`;
const u = String(r.source_url || '').trim();
if (u && !/^https:\/\//i.test(u)) return `Dòng ${_o3 + 1}: link trang giá phải bắt đầu bằng https://`;
}
return '';
}
export function priceRow(r) {
const _o6 = String(r.value ?? '').trim().replace(',', '.');
return { id: r.id, unit: r.unit, value: _o6 === '' ? null : Number(_o6), source_url: /^https:\/\//i.test(String(r.source_url || '')) ? String(r.source_url).slice(0, 500) : '', checked_at: String(r.checked_at || '').slice(0, 20) };
}
export function defaultPrices() {
return [{ id: 'shotstack', unit: 'usd_per_minute' }, { id: 'vbee', unit: 'usd_per_1000_chars' }, { id: 'elevenlabs', unit: 'usd_per_1000_chars' }]
.map((r) => ({ ...r, value: null, source_url: byId(r.id).pricing_url || '', checked_at: '' }));
}
export function ttsResult(r) {
if (!r || typeof r !== 'object') return { state: 'error', error: 'Máy chủ không trả kết quả giọng đọc' };
if (r.status === 'failed' || r.error) return { state: 'error', error: String(r.error || 'Tạo giọng lỗi') };
const url = _o2(r.url);
if (url) return { state: 'done', url };
if (r.id && (!r.status || ['queued', 'processing', 'rendering', 'pending'].includes(r.status))) return { state: 'pending', id: String(r.id) };
if (r.audio || r.b64) return { state: 'done', url: '', noLink: true };
return { state: 'error', error: 'Máy chủ không trả link giọng đọc' };
}

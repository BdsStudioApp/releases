export const PROVIDERS = [
{ id: 'flow', label: 'Flow / Veo (tín dụng gói Google AI Pro)', short: 'Flow', mode: 'manual', verified: true,
hint: 'Mặc định. Cần gói Google AI Pro trở lên. App đóng gói lời nhắn + ảnh tham chiếu, anh/chị tạo clip trong Flow bằng tín dụng AI hằng tháng của gói rồi nhập clip vào app. Flow hiện số tín dụng trước khi bấm tạo.' },
{ id: 'veo_api', label: 'Veo API (Gemini API – trả phí theo giây)', short: 'Veo API', mode: 'api', verified: true, hidden: true,
hint: 'Tự động qua máy chủ bằng khoá Gemini đã lưu. Tắt mặc định; bật + nhập giá ở Video AI › Cài đặt; trần mỗi video.' },
{ id: 'kling', label: 'Kling (tài khoản riêng – chưa xác minh)', short: 'Kling', mode: 'api', verified: false,
hint: 'CHƯA XÁC MINH tài liệu chính thức của Kling. Đối chiếu tài liệu Kling rồi tích xác nhận mới bật được.' },
{ id: 'runway', label: 'Runway (tài khoản riêng – trả phí)', short: 'Runway', mode: 'api', verified: true,
hint: 'Tự động qua máy chủ bằng khoá Runway của anh/chị. Tắt mặc định; bật + nhập giá ở Video AI › Cài đặt.' },
{ id: 'local', label: 'Ngay trên máy (máy hạng Mạnh)', short: 'Trên máy', mode: 'local', verified: true,
hint: 'Mô hình mã nguồn mở có giấy phép thương mại chạy ngay trên máy dựng – 0 đồng, chỉ mở cho máy hạng Mạnh.' },
];
export const providerById = (id) => PROVIDERS.find((_o8) => _o8.id === id) || null;
export const isHidden = (id) => !!(providerById(id) || {}).hidden;
export const visibleProviders = () => PROVIDERS.filter((_o8) => !_o8.hidden);
export const HIDDEN_TEXT = 'Veo qua Gemini API tạm ẩn: Google đã tắt mô hình veo-3.1-generate-preview (22/10/2026), mô hình thay thế chưa được xác minh. Muốn dùng Veo: chọn Runway (mô hình veo3…) hoặc dùng Kling / Flow.';
export const KINDS = [
{ id: 'presenter', label: 'Nhân vật dẫn', label3d: false },
{ id: 'perspective', label: 'Phối cảnh 3D dự án', label3d: true },
{ id: 'fengshui', label: 'Phong thủy', label3d: true },
{ id: 'illustration', label: 'Minh hoạ', label3d: false },
{ id: 'broll', label: 'B-roll (cảnh quay phụ)', label3d: false },
];
export const LABEL_TEXT = 'ẢNH MINH HOẠ';
export const needsLabel = (kind) => !!(KINDS.find((k) => k.id === kind) || {}).label3d;
export const ENGINE_ONLY = ['map', 'stat', 'compare', 'timeline', 'doc', 'checklist'];
const _o0 = ['camera', 'show', 'pop', 'draw', 'measure', 'card', 'panel', 'spotlight', 'labels', 'focus'];
export const UNITS = [
['usd_per_second', 'USD / giây'], ['usd_per_clip', 'USD / clip'],
['credits_per_second', 'tín dụng / giây'], ['credits_per_clip', 'tín dụng / clip'],
];
export const PRICE_PAGES = {
veo_api: 'https://ai.google.dev/gemini-api/docs/pricing',
runway: 'https://docs.dev.runwayml.com/guides/pricing/',
kling: '',
flow: 'https://labs.google/fx/tools/flow',
};
export function defaultPriceRows() {
return [
{ provider: 'flow', model: '', quality: 'fast', unit: 'credits_per_clip', value: null, credit_usd: null, source_url: PRICE_PAGES.flow, checked_at: '', note: 'Flow Fast (bản nháp) – xem số tín dụng Flow hiện' },
{ provider: 'flow', model: '', quality: 'quality', unit: 'credits_per_clip', value: null, credit_usd: null, source_url: PRICE_PAGES.flow, checked_at: '', note: 'Flow Quality (bản cuối)' },
{ provider: 'runway', model: '', quality: '', unit: 'credits_per_second', value: null, credit_usd: null, source_url: PRICE_PAGES.runway, checked_at: '', note: '' },
{ provider: 'kling', model: '', quality: '', unit: 'usd_per_clip', value: null, credit_usd: null, source_url: '', checked_at: '', note: 'Xem giá trong tài khoản nhà phát triển Kling' },
];
}
export function durations(provider, model = '') {
const _o6 = String(model || '').toLowerCase();
if (provider === 'veo_api') return [4, 6, 8];
if (provider === 'kling') return [5, 10];
if (provider === 'runway') return /^veo3/.test(_o6) ? [4, 6, 8] : /^gen4_turbo/.test(_o6) ? [5, 10] : [2, 3, 4, 5, 6, 7, 8, 9, 10];
return null;
}
export function snapSeconds(provider, seconds, model = '') {
const _of = Number(seconds) || 8;
const ok = durations(provider, model);
if (!ok) return _of;
return ok.reduce((best, x) => (Math.abs(x - _of) < Math.abs(best - _of) || (Math.abs(x - _of) === Math.abs(best - _of) && x > best) ? x : best), ok[0]);
}
export const RETIRED_MODELS = {
veo_api: ['veo-3.1-generate-preview', 'veo-3.1-fast-generate-preview', 'veo-3.1-lite-generate-preview', 'veo-3.0-generate-preview', 'veo-3.0-fast-generate-preview',
'veo-3.0-generate-001', 'veo-3.0-fast-generate-001', 'veo-2.0-generate-001'],
};
export const modelRetired = (provider, model) => (RETIRED_MODELS[provider] || []).includes(String(model || '').trim());
export const RETIRED_TEXT = 'Google đã tắt mô hình này trên Gemini API – Veo API chưa tạo được. Nhập mô hình video còn chạy (xem trang mô hình của Google) hoặc dùng Runway / Flow.';
const num = (_ok, d = 0) => { const n = Number(_ok); return Number.isFinite(n) && _ok !== '' && _ok !== null && _ok !== undefined ? n : d; };
const _oc = (x) => (x === null ? null : Math.round(x * 10000) / 10000);
const _o4 = (_ok) => !!_ok && typeof _ok === 'object' && !Array.isArray(_ok);
export function priceRow(_ob) {
if (!_o4(_ob) || !PROVIDERS.some((_o8) => _o8.id === _ob.provider)) return null;
const unit = UNITS.some(([_oj]) => _oj === _ob.unit) ? _ob.unit : 'usd_per_second';
const _ol = (x) => { if (x === null || x === undefined || x === '') return null; const n = Number(x); return Number.isFinite(n) && n >= 0 ? n : null; };
return { provider: _ob.provider, model: String(_ob.model || '').slice(0, 80), quality: String(_ob.quality || '').slice(0, 20), unit,
value: _ol(_ob.value), credit_usd: _ol(_ob.credit_usd), source_url: /^https:\/\//.test(String(_ob.source_url || '')) ? String(_ob.source_url).slice(0, 500) : '',
checked_at: String(_ob.checked_at || '').slice(0, 20), note: String(_ob.note || '').slice(0, 200) };
}
export function priceProblem(_oe) {
for (let i = 0; i < (_oe || []).length; i++) {
const _ob = _oe[i] || {};
for (const [k, name] of [['value', 'giá'], ['credit_usd', 'giá 1 tín dụng']]) {
const _ok = _ob[k];
if (_ok === null || _ok === undefined || String(_ok).trim() === '') continue;
const n = Number(String(_ok).replace(',', '.'));
if (!Number.isFinite(n) || n < 0) return `Dòng ${i + 1}: ${name} phải là số từ 0 trở lên.`;
}
const _oj = String(_ob.source_url || '').trim();
if (_oj && !/^https:\/\//i.test(_oj)) return `Dòng ${i + 1}: link trang giá phải bắt đầu bằng https://.`;
}
return '';
}
export function parseCap(text) {
const t = String(text ?? '').trim().replace(',', '.');
const n = t === '' ? NaN : Number(t);
return Number.isFinite(n) && n >= 0 && n <= 1000 ? { ok: true, value: n } : { ok: false, error: 'Trần chi phí là số USD từ 0 đến 1000, ví dụ 5.' };
}
export function estimate(prices, q = {}) {
const provider = q.provider;
const seconds = Math.max(1, Math.min(60, num(q.seconds, 8)));
const count = Math.max(1, Math.min(10, Math.floor(num(q.count, 1))));
const base = { provider, model: String(q.model || '').slice(0, 80), quality: String(q.quality || '').slice(0, 20), seconds, count };
if (provider === 'local') return { ...base, ok: true, free: true, usd: 0, credits: 0, unit: 'free' };
const _oe = (prices || []).map(priceRow).filter((_ob) => _ob && _ob.provider === provider);
const _od = _oe.find((_ob) => _ob.model === base.model && _ob.quality === base.quality) ||
_oe.find((_ob) => _ob.model === base.model && !_ob.quality) ||
_oe.find((_ob) => (!_ob.model || _ob.model === '*') && (!_ob.quality || _ob.quality === base.quality));
if (!_od || _od.value === null) return { ...base, ok: false, missing: true };
const _oa = /per_second$/.test(_od.unit) ? _od.value * seconds : _od.value;
const _oi = _oa * count;
let usd = null; let credits = null;
if (/^usd/.test(_od.unit)) usd = _oi; else { credits = _oi; if (_od.credit_usd !== null) usd = _oi * _od.credit_usd; }
return { ...base, ok: true, unit: _od.unit, usd: _oc(usd), credits: credits === null ? null : _oc(credits), source_url: _od.source_url, checked_at: _od.checked_at };
}
const vnNum = (x) => String(_oc(x)).replace('.', ',');
export function costText(e, { flowIncluded = true } = {}) {
if (!e) return '';
if (e.free) return '0 đồng – chạy trên máy của anh/chị (chỉ tốn điện, thời gian đo thật khi chạy).';
if (!e.ok) return e.provider === 'flow'
? 'Chưa nhập số tín dụng Flow trong bảng giá – Flow hiện số tín dụng ngay trước khi anh/chị bấm tạo.'
: 'Chưa có giá trong bảng giá – mở "Bảng giá", nhập theo trang giá chính thức rồi tạo lại.';
const _o9 = [];
if (e.credits !== null) _o9.push(`≈ ${vnNum(e.credits)} tín dụng`);
if (e.usd !== null) _o9.push(`≈ ${vnNum(e.usd)} USD`);
let _of = _o9.join(' · ') + ` (${e.count > 1 ? e.count + ' clip × ' : ''}${e.seconds} giây)`;
if (e.provider === 'flow' && flowIncluded) _of += ' – trừ vào tín dụng AI hằng tháng của gói Google AI Pro (cần có gói), không tính thêm ngoài phí gói';
if (e.checked_at || e.source_url) _of += ` · theo bảng giá${e.checked_at ? ' kiểm ngày ' + e.checked_at : ''}`;
return _of;
}
export function providerReady(id, { status, gate, engineOn, est, role } = {}) {
const P = (status && status.providers) || {};
if (id === 'flow') return { ok: true, why: '' };
if (id === 'local') {
if (!engineOn) return { ok: false, why: 'Bật máy dựng trên máy tính để dùng AI trên máy.' };
if (!gate || !gate.allowed) return { ok: false, why: (gate && gate.reason) || 'Cần máy hạng Mạnh.' };
return { ok: true, why: '' };
}
const _o8 = P[id];
if (!_o8) return { ok: false, why: 'Máy chủ chưa có Video AI – cập nhật máy chủ.' };
if (modelRetired(id, _o8.model)) return { ok: false, why: 'Mô hình ' + _o8.model + ' đã bị Google tắt – ' + (role === 'owner' ? 'đổi mô hình trong Video AI › Cài đặt.' : 'nhờ Quản trị đổi mô hình.') };
if (id === 'kling' && !_o8.ack) return { ok: false, why: 'Kling chưa xác minh tài liệu – tích "Đã đối chiếu" trong Video AI › Cài đặt.' };
if (!_o8.enabled) return { ok: false, why: role === 'owner' ? 'Đang tắt – bật trong Cài đặt gói bên dưới.' : 'Chưa bật – bật trong Video AI › Cài đặt.' };
if (!_o8.key) return { ok: false, why: id === 'veo_api' ? 'Chưa có khoá Gemini (Cài đặt › Kết nối).' : 'Chưa nhập khoá.' };
if (est && !est.ok) return { ok: false, why: 'Chưa có giá – nhập bảng giá trước.' };
if (est && est.usd === null) return { ok: false, why: 'Giá tính bằng tín dụng – nhập giá 1 tín dụng (USD) để app kiểm trần.' };
return { ok: true, why: '' };
}
export function engineMade(_og) {
if (!_o4(_og) || _og.type === 'ai_clip') return false;
return _o0.some((k) => { const _ok = _og[k]; return Array.isArray(_ok) ? _ok.length > 0 : !!_ok; });
}
export function sceneList(cfg) {
const _og = (cfg && Array.isArray(cfg.scenes)) ? cfg.scenes : [];
return _og.map((_of, i) => {
const _oh = (_of.subs || []).map((x) => (_o4(x) ? x.text || '' : String(x || ''))).join(' ');
const title = (_of.title && (_of.title.text || _of.title)) || (_of.hook && _of.hook.text) || (_of.card && _of.card.title) || _oh.slice(0, 50) || `Cảnh ${i + 1}`;
const type = _of.type === 'ai_clip' ? 'ai' : _of.camera || _of.show ? 'map' : _of.card || _of.panel ? 'figure' : _of.hook ? 'hook' : 'other';
return { i, n: i + 1, title: String(title).slice(0, 60), type, engine: engineMade(_of), label: !!(_of.media && _of.media.label), dur: num(_of.dur, 0) };
});
}
export const LS_MAP = 'bds.video.map';
export function readDraft(storage) {
try {
const _ok = JSON.parse(storage.getItem(LS_MAP) || 'null');
if (!_ok || !_ok.cfg) return { cfg: null, ref: '', raw: _ok };
const cfg = JSON.parse(_ok.cfg);
return { cfg: cfg && Array.isArray(cfg.scenes) ? cfg : null, ref: String(_ok.script_id || cfg.title || 'chung').slice(0, 80), raw: _ok };
} catch { return { cfg: null, ref: '', raw: null }; }
}
export function writeDraft(storage, cfg) {
let _ok = {};
try { _ok = JSON.parse(storage.getItem(LS_MAP) || 'null') || {}; } catch { _ok = {}; }
_ok.cfg = JSON.stringify(cfg, null, 1);
storage.setItem(LS_MAP, JSON.stringify(_ok));
return _ok;
}
const _o3 = (_of) => String(_of || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
const _o1 = {
presenter: 'A friendly Vietnamese real-estate presenter speaks calmly to camera, natural gestures, medium shot',
perspective: 'Architectural 3D perspective visualisation of a residential project, slow cinematic camera move',
fengshui: 'Calm illustrative feng-shui interior scene, balanced composition, soft natural light',
illustration: 'Illustrative lifestyle scene for a real-estate video',
broll: 'Cinematic B-roll footage',
};
export function buildPrompt({ kind = 'broll', subject = '', setting = '', character = null, aspect = '9:16', seconds = 8 } = {}) {
const _o5 = [
`${aspect === '16:9' ? 'Horizontal 16:9' : 'Vertical 9:16'} video, ${seconds} seconds, photorealistic, smooth stabilised camera.`,
`${_o1[kind] || _o1.broll}${_o3(subject) ? ': ' + _o3(subject) : ''}.`,
];
if (_o3(setting)) _o5.push(`SETTING: ${_o3(setting)}.`);
if (kind === 'presenter' && character && _o3(character.lock_en)) {
_o5.push(`CHARACTER LOCK (identical to the reference images): ${_o3(character.lock_en)}.`);
}
_o5.push('LIGHT & SOUND: soft natural daylight; quiet ambience, no music.');
_o5.push('AVOID: no on-screen text, no captions, no subtitles, no logos, no watermarks, no readable signs, no maps, no numbers or charts, no distorted hands or faces.');
return { prompt: _o5.join('\n'), negative: 'text, subtitles, watermark, logo, distorted face, extra fingers, low quality, blurry' };
}
export function flowPayload({ title, prompt, seconds, aspect, kind, images = [] }) {
return { title: String(title || 'Video AI').slice(0, 80), scenes: [{ title: (KINDS.find((k) => k.id === kind) || {}).label || 'Cảnh AI', prompt, seconds, aspect }], images };
}
export function b64ToBytes(b64) {
const _o2 = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
const _o7 = new Uint8Array(_o2.length);
for (let i = 0; i < _o2.length; i++) _o7[i] = _o2.charCodeAt(i);
return _o7;
}

export const PROVIDERS = [
{ id: 'flow', label: 'Flow / Veo (tín dụng gói Gemini AI Pro)', short: 'Flow', mode: 'manual', verified: true,
hint: 'Mặc định. App chép lời nhắn, anh/chị tạo clip trong Flow bằng tín dụng gói AI Pro, tải clip lên Google Drive rồi dán link vào app. Flow hiện số tín dụng trước khi bấm tạo.' },
{ id: 'veo_api', label: 'Veo API (Gemini API – trả phí theo giây)', short: 'Veo API', mode: 'api', verified: true,
hint: 'Tự động qua máy chủ bằng khoá Gemini đã lưu. Tắt mặc định; Chủ bật + nhập giá; trần mỗi video.' },
{ id: 'kling', label: 'Kling (tài khoản riêng – chưa xác minh)', short: 'Kling', mode: 'api', verified: false,
hint: 'CHƯA XÁC MINH tài liệu API chính thức. Chủ đối chiếu tài liệu Kling rồi tích xác nhận mới bật được.' },
{ id: 'runway', label: 'Runway (tài khoản riêng – trả phí)', short: 'Runway', mode: 'api', verified: true,
hint: 'Tự động qua máy chủ bằng khoá Runway của anh/chị. Tắt mặc định; Chủ bật + nhập giá.' },
];
export const providerById = (id) => PROVIDERS.find((_oa) => _oa.id === id) || null;
export const KINDS = [
{ id: 'presenter', label: 'Nhân vật dẫn', label3d: false },
{ id: 'perspective', label: 'Phối cảnh 3D dự án', label3d: true },
{ id: 'fengshui', label: 'Phong thủy', label3d: true },
{ id: 'illustration', label: 'Minh hoạ', label3d: false },
{ id: 'broll', label: 'B-roll (cảnh quay phụ)', label3d: false },
];
export const LABEL_TEXT = 'ẢNH MINH HOẠ';
export const needsLabel = (kind) => !!(KINDS.find((k) => k.id === kind) || {}).label3d;
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
{ provider: 'veo_api', model: '', quality: '', unit: 'usd_per_second', value: null, credit_usd: null, source_url: PRICE_PAGES.veo_api, checked_at: '', note: '' },
{ provider: 'runway', model: '', quality: '', unit: 'credits_per_second', value: null, credit_usd: null, source_url: PRICE_PAGES.runway, checked_at: '', note: '' },
{ provider: 'kling', model: '', quality: '', unit: 'usd_per_clip', value: null, credit_usd: null, source_url: '', checked_at: '', note: 'Xem giá trong tài khoản nhà phát triển Kling' },
];
}
const num = (_ok, _o4 = 0) => { const n = Number(_ok); return Number.isFinite(n) && _ok !== '' && _ok !== null && _ok !== undefined ? n : _o4; };
const _of = (_on) => (_on === null ? null : Math.round(_on * 10000) / 10000);
const _o7 = (_ok) => !!_ok && typeof _ok === 'object' && !Array.isArray(_ok);
export function priceRow(_oe) {
if (!_o7(_oe) || !PROVIDERS.some((_oa) => _oa.id === _oe.provider)) return null;
const unit = UNITS.some(([_oj]) => _oj === _oe.unit) ? _oe.unit : 'usd_per_second';
const _ol = (_on) => { if (_on === null || _on === undefined || _on === '') return null; const n = Number(_on); return Number.isFinite(n) && n >= 0 ? n : null; };
return { provider: _oe.provider, model: String(_oe.model || '').slice(0, 80), quality: String(_oe.quality || '').slice(0, 20), unit,
value: _ol(_oe.value), credit_usd: _ol(_oe.credit_usd), source_url: /^https:\/\//.test(String(_oe.source_url || '')) ? String(_oe.source_url).slice(0, 500) : '',
checked_at: String(_oe.checked_at || '').slice(0, 20), note: String(_oe.note || '').slice(0, 200) };
}
export function priceProblem(_og) {
for (let _o6 = 0; _o6 < (_og || []).length; _o6++) {
const _oe = _og[_o6] || {};
for (const [k, name] of [['value', 'giá'], ['credit_usd', 'giá 1 tín dụng']]) {
const _ok = _oe[k];
if (_ok === null || _ok === undefined || String(_ok).trim() === '') continue;
const n = Number(String(_ok).replace(',', '.'));
if (!Number.isFinite(n) || n < 0) return `Dòng ${_o6 + 1}: ${name} phải là số từ 0 trở lên.`;
}
const _oj = String(_oe.source_url || '').trim();
if (_oj && !/^https:\/\//i.test(_oj)) return `Dòng ${_o6 + 1}: link trang giá phải bắt đầu bằng https://.`;
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
const _og = (prices || []).map(priceRow).filter((_oe) => _oe && _oe.provider === provider);
const row = _og.find((_oe) => _oe.model === base.model && _oe.quality === base.quality) ||
_og.find((_oe) => _oe.model === base.model && !_oe.quality) ||
_og.find((_oe) => (!_oe.model || _oe.model === '*') && (!_oe.quality || _oe.quality === base.quality));
if (!row || row.value === null) return { ...base, ok: false, missing: true };
const _od = /per_second$/.test(row.unit) ? row.value * seconds : row.value;
const _oi = _od * count;
let usd = null; let credits = null;
if (/^usd/.test(row.unit)) usd = _oi; else { credits = _oi; if (row.credit_usd !== null) usd = _oi * row.credit_usd; }
return { ...base, ok: true, unit: row.unit, usd: _of(usd), credits: credits === null ? null : _of(credits), source_url: row.source_url, checked_at: row.checked_at };
}
const _om = (_on) => String(_of(_on)).replace('.', ',');
export function costText(e, { flowIncluded = true } = {}) {
if (!e) return '';
if (!e.ok) return e.provider === 'flow'
? 'Chưa nhập số tín dụng Flow trong bảng giá – Flow hiện số tín dụng ngay trước khi anh/chị bấm tạo.'
: 'Chưa có giá trong bảng giá – Chủ mở "Bảng giá" nhập theo trang giá chính thức rồi mới tạo được.';
const _oc = [];
if (e.credits !== null) _oc.push(`≈ ${_om(e.credits)} tín dụng`);
if (e.usd !== null) _oc.push(`≈ ${_om(e.usd)} USD`);
let _oh = _oc.join(' · ') + ` (${e.count > 1 ? e.count + ' clip × ' : ''}${e.seconds} giây)`;
if (e.provider === 'flow' && flowIncluded) _oh += ' – trừ vào tín dụng hằng tháng của gói Gemini AI Pro, không phát sinh tiền';
if (e.checked_at || e.source_url) _oh += ` · theo bảng giá${e.checked_at ? ' kiểm ngày ' + e.checked_at : ''}`;
return _oh;
}
export function providerReady(id, { status, est, role } = {}) {
const P = (status && status.providers) || {};
if (!providerById(id)) return { ok: false, why: 'AI này không còn dùng – chọn Flow, Veo API, Kling hoặc Runway.' };
if (id === 'flow') return { ok: true, why: '' };
const _oa = P[id];
if (!_oa) return { ok: false, why: 'Máy chủ chưa có Video AI – cập nhật máy chủ.' };
if (id === 'kling' && !_oa.ack) return { ok: false, why: 'Kling chưa xác minh tài liệu API – Chủ tích "Đã đối chiếu" trong Cài đặt gói.' };
if (!_oa.enabled) return { ok: false, why: role === 'owner' ? 'Đang tắt – bật trong Cài đặt gói bên dưới.' : 'Chủ app chưa bật.' };
if (!_oa.key) return { ok: false, why: id === 'veo_api' ? 'Chưa có khoá Gemini (Cài đặt › Kết nối).' : 'Chưa nhập khoá.' };
if (est && !est.ok) return { ok: false, why: 'Chưa có giá – nhập bảng giá trước.' };
if (est && est.usd === null) return { ok: false, why: 'Giá tính bằng tín dụng – nhập giá 1 tín dụng (USD) để app kiểm trần.' };
return { ok: true, why: '' };
}
const _o3 = (_oh) => String(_oh || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
const _o0 = {
presenter: 'A friendly Vietnamese real-estate presenter speaks calmly to camera, natural gestures, medium shot',
perspective: 'Architectural 3D perspective visualisation of a residential project, slow cinematic camera move',
fengshui: 'Calm illustrative feng-shui interior scene, balanced composition, soft natural light',
illustration: 'Illustrative lifestyle scene for a real-estate video',
broll: 'Cinematic B-roll footage',
};
export function buildPrompt({ kind = 'broll', subject = '', setting = '', character = null, aspect = '9:16', seconds = 8 } = {}) {
const _o8 = [
`${aspect === '16:9' ? 'Horizontal 16:9' : 'Vertical 9:16'} video, ${seconds} seconds, photorealistic, smooth stabilised camera.`,
`${_o0[kind] || _o0.broll}${_o3(subject) ? ': ' + _o3(subject) : ''}.`,
];
if (_o3(setting)) _o8.push(`SETTING: ${_o3(setting)}.`);
if (kind === 'presenter' && character && _o3(character.lock_en)) {
_o8.push(`CHARACTER LOCK (identical to the reference images): ${_o3(character.lock_en)}.`);
}
_o8.push('LIGHT & SOUND: soft natural daylight; quiet ambience, no music.');
_o8.push('AVOID: no on-screen text, no captions, no subtitles, no logos, no watermarks, no readable signs, no maps, no numbers or charts, no distorted hands or faces.');
return { prompt: _o8.join('\n'), negative: 'text, subtitles, watermark, logo, distorted face, extra fingers, low quality, blurry' };
}
export function b64ToBytes(b64) {
const _o1 = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
const out = new Uint8Array(_o1.length);
for (let _o6 = 0; _o6 < _o1.length; _o6++) out[_o6] = _o1.charCodeAt(_o6);
return out;
}
export const CLIP_TYPE = 'video_ai';
const _ob = (_ok) => { if (_o7(_ok)) return _ok; try { const o = JSON.parse(_ok || '{}'); return _o7(o) ? o : {}; } catch { return {}; } };
export function linkOk(_oj) {
const _oh = String(_oj || '').trim();
if (!/^https:\/\//i.test(_oh)) return '';
try { const _on = new URL(_oh); return _on.protocol === 'https:' ? _oh.slice(0, 2000) : ''; } catch { return ''; }
}
const costOf = (_o2) => ({ usd: _o2 && _o2.usd !== null && _o2.usd !== undefined && Number.isFinite(Number(_o2.usd)) ? _of(Number(_o2.usd)) : null,
credits: _o2 && _o2.credits !== null && _o2.credits !== undefined && Number.isFinite(Number(_o2.credits)) ? _of(Number(_o2.credits)) : null });
export function clipRow({ provider = 'flow', prompt = '', kind = 'broll', seconds = 8, aspect = '9:16', url = '', cost = null, idea_id = '', title = '', task_id = '', at = Date.now(), extra = null } = {}) {
const _o9 = linkOk(url);
const ex = _o5(extra);
const _o2 = costOf(cost);
const name = String(title || (KINDS.find((k) => k.id === kind) || {}).label || 'Clip AI').replace(/\s+/g, ' ').trim().slice(0, 120);
return {
type: CLIP_TYPE, title: name, status: 'done', cost_estimate: _o2.usd || 0,
input: JSON.stringify({ provider: String(provider).slice(0, 20), prompt: String(prompt || '').slice(0, 4000), kind, seconds: num(seconds, 8), aspect: aspect === '16:9' ? '16:9' : '9:16',
idea_id: String(idea_id || '').slice(0, 80), task_id: String(task_id || '').slice(0, 300) }),
output: JSON.stringify({ url: _o9, drive_url: _o9, provider: String(provider).slice(0, 20), cost: _o2, created_at: num(at, Date.now()), ...ex }),
};
}
function _o5(_on) {
if (!_o7(_on)) return {};
const out = {};
if (['map', 'news', 'walk', 'market', 'home'].includes(_on.func)) out.func = _on.func;
if (_on.caption) out.caption = String(_on.caption).slice(0, 2000);
if (Array.isArray(_on.sources)) out.sources = _on.sources.map((_oh) => (_o7(_oh) && linkOk(_oh.url) ? { name: String(_oh.name || '').slice(0, 80), url: linkOk(_oh.url) } : null)).filter(Boolean).slice(0, 20);
return out;
}
export function withLink(row, url) {
const out = _ob(row && row.output);
const _o9 = linkOk(url);
return { ...row, output: JSON.stringify({ ...out, url: _o9, drive_url: _o9 }) };
}
export function clipView(row) {
const _o6 = _ob(row && row.input), o = _ob(row && row.output);
return { id: row && row.id, title: (row && row.title) || 'Clip AI', provider: o.provider || _o6.provider || '', prompt: _o6.prompt || '', kind: _o6.kind || '', seconds: num(_o6.seconds, 0),
aspect: _o6.aspect || '', idea_id: _o6.idea_id || '', url: linkOk(o.url || o.drive_url), cost: costOf(o.cost), created_at: num(o.created_at, num(row && row.updated_at, 0)),
func: o.func || '', caption: typeof o.caption === 'string' ? o.caption : '', sources: _o5({ sources: o.sources }).sources || [], row };
}
export function clipList(jobs) {
return (jobs || []).filter((j) => j && j.type === CLIP_TYPE && !Number(j.deleted)).map(clipView).sort((a, b) => b.created_at - a.created_at);
}
export function fmtWhen(ms) {
if (!ms) return '';
const _o4 = new Date(ms), _oa = (n) => String(n).padStart(2, '0');
return `${_oa(_o4.getDate())}/${_oa(_o4.getMonth() + 1)}/${_o4.getFullYear()} ${_oa(_o4.getHours())}:${_oa(_o4.getMinutes())}`;
}

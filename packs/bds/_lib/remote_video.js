export const OFFLINE_MS = 5 * 60 * 1000;
export const POLL_ACTIVE_MS = 20000;
export const POLL_IDLE_MS = 60000;
export const POLL_AI_MS = 8000;
export const AI_PROVIDERS = ['runway', 'kling'];
export const AI_PROVIDER_LABEL = { veo_api: 'Veo API', runway: 'Runway', kling: 'Kling' };
export function providerLabel(id) { const _o3 = String(id || ''); return AI_PROVIDER_LABEL[_o3] || (_o3 ? _o3.replace(/_/g, ' ') : ''); }
export const TYPES = { remote: 'video_remote', ai: 'video_ai_online' };
export const vnNum = (x) => { const _o6 = Number(x); return Number.isFinite(_o6) ? String(Math.round(_o6 * 10000) / 10000).replace('.', ',') : ''; };
export function requestId(now = Date.now(), rnd = Math.random) { return 'r' + Number(now).toString(36) + Math.floor(rnd() * 1e9).toString(36); }
export function uncertainSend(err) { return !!err && (err.code === 'NETWORK' || err.code === 'TIMEOUT' || err.name === 'AbortError'); }
export function clipLink(job) { const u = String((_o1(job) && job.clip_url) || ''); return /^https:\/\/[^\s"'<>]+$/.test(u) ? u : null; }
const _o1 = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const _oa = (_o6) => String(_o6).padStart(2, '0');
export function hhmm(ms) { if (!ms) return ''; const _o0 = new Date(Number(ms)); return _oa(_o0.getHours()) + ':' + _oa(_o0.getMinutes()) + ' ' + _oa(_o0.getDate()) + '/' + _oa(_o0.getMonth() + 1); }
export function ago(ms, now = Date.now()) {
const _oc = Math.max(0, Math.round((now - Number(ms)) / 1000));
if (_oc < 90) return 'vừa xong';
const _o5 = Math.round(_oc / 60);
if (_o5 < 60) return _o5 + ' phút trước';
const h = Math.round(_o5 / 60);
if (h < 48) return h + ' giờ trước';
return Math.round(h / 24) + ' ngày trước';
}
export function engineInfo(engine, now = Date.now()) {
const e = _o1(engine) ? engine : {};
if (!e.linked) {
return { state: 'none', tone: 'warn', text: e.revoked
? 'Máy tính đã bị gỡ liên kết (thu hồi ở Thiết bị). Mở BDS Studio trên máy tính › Video › "Liên kết máy dựng với tài khoản".'
: 'Chưa liên kết máy tính. Mở BDS Studio trên máy tính có máy dựng › Video › bấm "Liên kết máy dựng với tài khoản" (1 lần).' };
}
const _oe = Number(e.seen_at) || 0;
const _o8 = !!_oe && now - _oe <= (Number(e.offline_after_ms) || OFFLINE_MS);
const name = e.name ? ' (' + e.name + ')' : '';
if (_o8) return { state: 'on', tone: 'success', text: '🟢 Máy tính đang bật' + name + ' – thấy ' + ago(_oe, now) + (e.busy ? ', đang dựng việc khác' : '') + '.' };
return { state: 'off', tone: 'muted', text: '⚪ Máy tính đang tắt' + name + (_oe ? ' – lần cuối thấy ' + ago(_oe, now) + ' (' + hhmm(_oe) + ')' : '') + '. Video tự dựng khi máy tính bật và mở BDS Studio.' };
}
export function jobInfo(job, engine, now = Date.now()) {
const _o2 = _o1(job) ? job : {};
const pct = Math.round(Math.max(0, Math.min(1, Number(_o2.progress) || 0)) * 100);
if (_o2.status === 'done') return { key: 'done', label: 'Xong', tone: 'success', note: _o2.file ? 'Đã lưu Google Drive' + (_o2.telegram === 'video' || _o2.telegram === 'link' ? ' + gửi Telegram' : '') + '.' : '', pct: 100 };
if (_o2.status === 'error') {
if (_o2.state === 'cancelled') return { key: 'cancelled', label: 'Đã huỷ', tone: 'muted', note: '', pct: 0 };
return { key: 'error', label: 'Lỗi', tone: 'danger', note: _o2.error || 'Không rõ lý do', pct: 0 };
}
if (_o2.type === TYPES.ai) {
if (_o2.state === 'saving') return { key: 'ai', label: 'Đang lưu Drive', tone: 'info', note: 'Clip AI đã xong – máy chủ đang lưu vào Google Drive.', pct: 95 };
return { key: 'ai', label: 'AI trên mạng đang tạo', tone: 'info', note: 'Nhà cung cấp đang tạo clip – thường vài phút. Đóng app vẫn chạy; xong sẽ báo Telegram.', pct };
}
if (_o2.status === 'running') return { key: 'rendering', label: 'Đang dựng', tone: 'info', note: 'Máy tính đang dựng' + (pct ? ' · ' + pct + '%' : '') + '.', pct };
const e = engineInfo(engine, now);
return { key: 'waiting', label: 'Đang chờ máy tính', tone: 'warn', note: e.state === 'on' ? 'Máy tính đang bật – sẽ nhận trong ít phút.' : e.text, pct: 0, engine: e.state };
}
export function driveLinks(file) {
if (!_o1(file) || !/^[A-Za-z0-9_-]{6,200}$/.test(String(file.id || ''))) return null;
const view = /^https:\/\/(drive|docs)\.google\.com\//.test(String(file.url || '')) ? String(file.url) : 'https://drive.google.com/file/d/' + file.id + '/view';
return { view, download: 'https://drive.google.com/uc?export=download&id=' + encodeURIComponent(file.id) };
}
export function submitPayload({ outline, title, voice, ref, scriptId, captionText, tgCaption } = {}) {
if (!_o1(outline) || !Array.isArray(outline.scenes) || !outline.scenes.length) return null;
const _o7 = { kind: 'map', outline, title: String(title || outline.title || 'Video từ điện thoại').slice(0, 120), voice: voice === true, ref: String(ref || '').slice(0, 64), script_id: String(scriptId || '').slice(0, 64) };
if (captionText) _o7.caption_text = String(captionText).slice(0, 8000);
if (tgCaption) _o7.tg_caption = String(tgCaption).slice(0, 2000);
return _o7;
}
export function aiPrompt(VA, outline, { seconds = 8, aspect = '9:16' } = {}) {
const _o7 = _o1(outline) ? outline : {};
const _o4 = (_o7.scenes || []).flatMap((_oc) => (_oc.narration || []).map((l) => (_o1(l) ? l.text : l))).filter(Boolean).slice(0, 3).join(' ');
return VA.buildPrompt({ kind: 'broll', subject: [_o7.title, _o4].filter(Boolean).join('. ').slice(0, 600), setting: 'Vietnam, modern city, real-estate context', aspect, seconds });
}
export function aiChoices(VA, status, { seconds = 8, role = 'owner' } = {}) {
const prices = (status && status.prices) || [];
return AI_PROVIDERS.map((id) => {
const _o9 = VA.providerById(id);
const model = (status && status.providers && status.providers[id] && status.providers[id].model) || '';
const _od = typeof VA.snapSeconds === 'function' ? VA.snapSeconds(id, seconds, model) : seconds;
const est = VA.estimate(prices, { provider: id, model, seconds: _od, count: 1 });
const _ob = VA.providerReady(id, { status, est, role });
return { id, label: _o9.short, ok: _ob.ok, why: _ob.why, est };
});
}
export function costLine(VA, choice, { owner = true } = {}) {
if (!choice || !choice.est) return '';
return `${choice.label}: ${VA.costText(choice.est)} – thu phí riêng, tính trên tài khoản ${choice.label} ${owner ? 'của anh/chị' : 'Quản trị đã nối'} (ngoài BDS Studio).`;
}
export function nextPollMs(jobs) { return (jobs || []).some((_o2) => _o2.status === 'queued' || _o2.status === 'running') ? POLL_ACTIVE_MS : POLL_IDLE_MS; }

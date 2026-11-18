import { findForbidden } from './video.js';
import { landingUrl as instanceLandingUrl } from '../../../core/instance.0601c79adf.js';
export const LANDING = instanceLandingUrl() || '/';
export const LANDING_HOST = String(LANDING || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
export const VIDEO_TYPES = ['video_map', 'video_flow'];
export const POST_STATUS = { draft: ['Nháp', 'warn'], approved: ['Đã duyệt', 'success'], posted: ['Đã đăng', 'info'] };
export const PLATFORMS = {
tiktok: {
id: 'tiktok', label: 'TikTok', icon: '🎵', aspect: '9:16', size: '1080×1920', maxSeconds: 600,
captionMax: 4000, titleMax: 0, hashtagMax: 5, schedule: false, utm: 'tiktok',
openUrl: 'https://www.tiktok.com/tiktokstudio/upload',
tip: 'Đăng trong app TikTok: + → Tải lên → chọn video → dán chú thích → Cài đặt khác → bật "Nội dung do AI tạo".',
},
facebook: {
id: 'facebook', label: 'Reels / Facebook', icon: '📘', aspect: '9:16', size: '1080×1920', maxSeconds: 90,
captionMax: 2200, titleMax: 0, hashtagMax: 5, schedule: true, utm: 'facebook',
openUrl: 'https://business.facebook.com/latest/reels_composer',
tip: 'Meta Business Suite → Tạo thước phim → tải video, dán mô tả → mục "Tuỳ chọn lên lịch" chọn ngày giờ → Lên lịch. Bật nhãn "Thông tin AI" nếu có.',
},
youtube: {
id: 'youtube', label: 'YouTube Shorts', icon: '▶️', aspect: '9:16', size: '1080×1920', maxSeconds: 180,
captionMax: 5000, titleMax: 100, hashtagMax: 5, schedule: true, utm: 'youtube',
openUrl: 'https://studio.youtube.com/',
tip: 'YouTube Studio → Tạo → Tải video lên → Chi tiết: tiêu đề + mô tả → "Nội dung bị thay đổi/tổng hợp": chọn Có → Chế độ hiển thị → Lên lịch → chọn giờ.',
},
zalo: {
id: 'zalo', label: 'Zalo', icon: '💬', aspect: '9:16', size: '1080×1920', maxSeconds: 600,
captionMax: 2000, titleMax: 0, hashtagMax: 3, schedule: false, utm: 'zalo',
openUrl: 'https://zalo.me/',
tip: 'Zalo → Nhật ký → Đăng video (hoặc gửi vào nhóm khách) → dán nội dung. Zalo không hẹn giờ – app nhắc đúng giờ để anh/chị đăng tay.',
},
};
export const PLATFORM_IDS = Object.keys(PLATFORMS);
export const canAutoSchedule = _or => !!(PLATFORMS[_or] && PLATFORMS[_or].schedule);
export const DEFAULT_SLOTS = [{ start: '11:30', end: '13:00', label: 'Trưa' }, { start: '19:30', end: '22:00', label: 'Tối' }];
const _o1 = /^([01]?\d|2[0-3]):([0-5]\d)$/;
export const toMin = s => { const _ol = _o1.exec(String(s || '').trim()); return _ol ? Number(_ol[1]) * 60 + Number(_ol[2]) : null; };
export const fromMin = _ol => String(Math.floor(_ol / 60)).padStart(2, '0') + ':' + String(_ol % 60).padStart(2, '0');
export function normalizeSlots(v) {
const _o6 = Array.isArray(v) ? v : (v && Array.isArray(v.slots) ? v.slots : null);
const out = [];
for (const s of _o6 || []) {
const _o5 = toMin(s && s.start), b = toMin(s && s.end);
if (_o5 === null || b === null || b <= _o5) continue;
out.push({ start: fromMin(_o5), end: fromMin(b), label: String((s && s.label) || '').slice(0, 20) || (_o5 < 15 * 60 ? 'Trưa' : 'Tối') });
}
out.sort((x, y) => toMin(x.start) - toMin(y.start));
return out.length ? out : DEFAULT_SLOTS.map(s => ({ ...s }));
}
export function parseSlotsText(text) {
const out = [];
for (const _ot of String(text || '').split(/[,;\n]+/)) {
const _ol = /(\d{1,2}:\d{2})\s*[-–—]\s*(\d{1,2}:\d{2})/.exec(_ot);
if (_ol) out.push({ start: _ol[1], end: _ol[2] });
}
return out;
}
export const slotsText = slots => normalizeSlots(slots).map(s => s.start + '–' + s.end).join(', ');
const _os = n => String(n).padStart(2, '0');
export const ymd = _od => { _od = new Date(_od); return _od.getFullYear() + '-' + _os(_od.getMonth() + 1) + '-' + _os(_od.getDate()); };
export const hm = _od => { _od = new Date(_od); return _os(_od.getHours()) + ':' + _os(_od.getMinutes()); };
export const at = (_oe, hhmm) => { const _od = new Date(String(_oe) + 'T00:00:00'); const _ol = toMin(hhmm) || 0; _od.setHours(Math.floor(_ol / 60), _ol % 60, 0, 0); return _od.getTime(); };
export function weekStart(_on) { const _od = new Date(_on); _od.setHours(0, 0, 0, 0); const _o19 = (_od.getDay() + 6) % 7; _od.setDate(_od.getDate() - _o19); return _od.getTime(); }
export function weekDays(_on) { const s = new Date(weekStart(_on)); return Array.from({ length: 7 }, (_, i) => { const _od = new Date(s); _od.setDate(s.getDate() + i); return ymd(_od); }); }
const _o4 = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
export const dayLabel = _oe => { const _od = new Date(_oe + 'T00:00:00'); return _o4[_od.getDay()] + ' ' + _os(_od.getDate()) + '/' + _os(_od.getMonth() + 1); };
export const fmtWhen = _on => _on ? dayLabel(ymd(_on)) + ' ' + hm(_on) : 'chưa xếp';
export function slotIndex(_on, slots) {
const _ol = new Date(_on).getHours() * 60 + new Date(_on).getMinutes();
return normalizeSlots(slots).findIndex(s => _ol >= toMin(s.start) && _ol < toMin(s.end));
}
export function parse(s) { if (s && typeof s === 'object') return s; try { return JSON.parse(s || '{}') || {}; } catch { return {}; } }
export function postView(row) {
const input = parse(row.input), output = parse(row.output);
return { ...row, input, output, platform: input.platform, scheduled_at: Number(input.scheduled_at) || 0, video_job_id: input.video_job_id };
}
export function postRow(view) {
const { input, output } = view;
const keep = {};
for (const _oh of ['id', 'type', 'title', 'status', 'cost_estimate', 'deleted', 'updated_at']) if (view[_oh] !== undefined) keep[_oh] = view[_oh];
return { ...keep, type: 'post', input: JSON.stringify(input || {}), output: JSON.stringify(output || {}) };
}
export function videoCode(job) {
const id = String((job && (job.id || job)) || '');
const _oa = id.replace(/[^0-9a-z]/gi, '').toLowerCase();
return _oa.slice(-6) || 'v0';
}
export function landingUrl(code, platform) {
const _o16 = LANDING + '?v=' + encodeURIComponent(code);
const _or = PLATFORMS[platform];
return _or ? _o16 + '&utm_source=' + _or.utm : _o16;
}
export function unaccent(s) {
return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
}
export function normTag(t) {
const s = unaccent(t).replace(/^#+/, '').replace(/[^0-9a-zA-Z_]/g, '').toLowerCase();
return s ? '#' + s : '';
}
export const BASE_TAGS = {
tiktok: ['#batdongsan', '#bdshanoi', '#canho', '#xuhuong'],
facebook: ['#batdongsan', '#canho', '#reels'],
youtube: ['#shorts', '#batdongsan', '#canho'],
zalo: ['#batdongsan'],
};
export function hashtagsFor(platform, extra = [], { max } = {}) {
const _or = PLATFORMS[platform] || PLATFORMS.tiktok;
const _oj = max || _or.hashtagMax;
const _oz = String(extra || '');
const _ou = Array.isArray(extra) ? extra : /[,;#\n]/.test(_oz) ? _oz.split(/[,;\n]+|\s+(?=#)/) : _oz.split(/\s+/);
const list = _ou.map(normTag).filter(Boolean);
const out = [];
const _op = platform === 'youtube' ? ['#shorts', ...list, ...BASE_TAGS.youtube] : [...list, ...(BASE_TAGS[platform] || [])];
for (const t of _op) if (!out.includes(t) && out.length < _oj) out.push(t);
return out;
}
export function buildCaption(platform, { title = '', caption = '', hashtags = [], code = '' } = {}) {
const _or = PLATFORMS[platform] || PLATFORMS.tiktok;
const _o12 = hashtagsFor(platform, hashtags);
const link = code ? landingUrl(code, platform) : '';
const _ok = link ? (platform === 'tiktok' ? 'Xem bảng giá & đăng ký: ' + link.replace(/^https:\/\//, '') : 'Xem bảng giá & đăng ký: ' + link) : '';
const _o13 = [_ok, _o12.join(' ')].filter(Boolean).join('\n');
let _o8 = String(caption || title || '').trim();
const _o10 = _or.captionMax - (_o13 ? _o13.length + 2 : 0);
let truncated = false;
if (_o8.length > _o10) { _o8 = _o8.slice(0, Math.max(0, _o10 - 1)).replace(/\s+\S*$/, '') + '…'; truncated = true; }
const text = [_o8, _o13].filter(Boolean).join('\n\n');
const _o1b = _or.titleMax ? (String(title || _o8).split('\n')[0].slice(0, _or.titleMax - 9).trim() + ' #shorts').slice(0, _or.titleMax) : '';
return { text, title: _o1b, length: text.length, max: _or.captionMax, truncated, hashtags: _o12, link };
}
export const CHECKLIST = [
{ id: 'ai_label', label: 'Bật nhãn "Nội dung do AI tạo" trên nền tảng', help: 'TikTok: Cài đặt khác → Nội dung do AI tạo. YouTube: "Nội dung bị thay đổi" → Có. Meta: nhãn "Thông tin AI".' },
{ id: 'music', label: 'Nhạc trend lấy trong thư viện nhạc của nền tảng (có bản quyền)', help: 'Không ghép nhạc tải ngoài – dễ bị tắt tiếng/gỡ video.' },
{ id: 'pin', label: 'Ghim bình luận đầu: link landing + "nhắn em để nhận bảng giá"', help: 'Đăng xong vào bình luận của chính mình → Ghim.' },
{ id: 'link', label: 'Link landing đúng mã video (' + (LANDING_HOST || 'landing') + '/?v=…)', help: 'Để app đếm được khách đến từ video này.', auto: true },
{ id: 'legal', label: 'Không hứa lợi nhuận, không cam kết tăng giá; tiến độ hạ tầng ghi "dự kiến" (Luật Kinh doanh BĐS 2023, Luật Quảng cáo)', help: 'App tự soát từ cấm trong chú thích; anh/chị xem lại lời đọc trong video.', auto: true },
];
export function checkPost(post, { code } = {}) {
const input = post.input || post;
const _om = input.checklist || {};
const _ob = String(input.caption || '');
const _o7 = findForbidden(_ob).concat(profitClaims(_ob));
const items = CHECKLIST.map(_oa => {
let ok = !!_om[_oa.id], note = '';
if (_oa.id === 'link') {
const _o18 = code ? '?v=' + code : '?v=';
const has = !LANDING_HOST || _ob.includes(LANDING_HOST + '/' + _o18) || _ob.includes(LANDING_HOST + _o18);
ok = has; if (!has) note = 'Chú thích chưa có link landing có mã video';
}
if (_oa.id === 'legal' && _o7.length) { ok = false; note = 'Có từ cần bỏ: ' + [...new Set(_o7)].join(', '); }
return { id: _oa.id, label: _oa.label, ok, auto: !!_oa.auto, note };
});
const missing = items.filter(i => !i.ok);
return { items, ready: !missing.length, missing };
}
const _o2 = [/cam kết (lợi nhuận|lãi|tăng giá|sinh lời)/i, /lợi nhuận\s*\d+\s*%/i, /lãi\s*\d+\s*%\s*\/?\s*năm/i, /chắc chắn (lãi|lời|tăng)/i, /bảo đảm (lợi nhuận|tăng giá)/i, /không lo lỗ/i, /x\s?[2-9]\s*tài sản/i];
export function profitClaims(text) { return _o2.filter(r => r.test(String(text || ''))).map(r => (String(text).match(r) || [''])[0].trim()); }
export function autoPlace(posts, { slots, now = Date.now(), perSlot = 1, gapMin = 30, leadMin = 30, days = 14 } = {}) {
const S = normalizeSlots(slots);
const _o17 = {};
const _o14 = new Set();
const _oi = (_on, _or) => ymd(_on) + '|' + slotIndex(_on, S) + '|' + _or;
for (const _or of posts || []) if (_or.scheduled_at) { _o17[_oi(_or.scheduled_at, _or.platform)] = (_o17[_oi(_or.scheduled_at, _or.platform)] || 0) + 1; _o14.add(_or.scheduled_at); }
const _o15 = (posts || []).filter(_or => !_or.scheduled_at && _or.status !== 'posted');
const out = {};
const start = new Date(now); start.setHours(0, 0, 0, 0);
for (const _or of _o15) {
let _ov = 0;
for (let _od = 0; _od < days && !_ov; _od++) {
const _oe = new Date(start); _oe.setDate(start.getDate() + _od);
const _of = ymd(_oe);
for (let _o11 = 0; _o11 < S.length && !_ov; _o11++) {
const _oh = _of + '|' + _o11 + '|' + _or.platform;
if ((_o17[_oh] || 0) >= perSlot) continue;
for (let _ol = toMin(S[_o11].start); _ol < toMin(S[_o11].end); _ol += gapMin) {
const _on = at(_of, fromMin(_ol));
if (_on < now + leadMin * 60000 || _o14.has(_on)) continue;
out[_or.id] = _on; _o17[_oh] = (_o17[_oh] || 0) + 1; _o14.add(_on); _ov = _on; break;
}
}
}
}
return out;
}
export function dropTime(_oe, slot, { slots, posts = [], id, keepMs } = {}) {
const S = normalizeSlots(slots);
const _o14 = new Set(posts.filter(_or => _or.id !== id && _or.scheduled_at).map(_or => _or.scheduled_at));
if (slot < 0 || !S[slot]) {
const t = keepMs ? hm(keepMs) : '09:00';
return at(_oe, t);
}
for (let _ol = toMin(S[slot].start); _ol < toMin(S[slot].end); _ol += 15) { const _on = at(_oe, fromMin(_ol)); if (!_o14.has(_on)) return _on; }
return at(_oe, S[slot].start);
}
export function canApprove(post, { code } = {}) {
if (!post.platform || !PLATFORMS[post.platform]) return { ok: false, reason: 'Chưa chọn nền tảng' };
if (!post.scheduled_at) return { ok: false, reason: 'Chưa xếp giờ đăng' };
const _oc = checkPost(post, { code });
if (!_oc.ready) return { ok: false, reason: 'Còn ' + _oc.missing.length + ' mục kiểm tra: ' + _oc.missing.map(_ol => _ol.note || _ol.label).join('; ') };
const _or = PLATFORMS[post.platform];
if (String(post.input.caption || '').length > _or.captionMax) return { ok: false, reason: 'Chú thích dài quá ' + _or.captionMax + ' ký tự' };
return { ok: true, reason: '' };
}
export function reminderFor(post, { title } = {}) {
const _or = PLATFORMS[post.platform] || {};
const auto = canAutoSchedule(post.platform);
return {
object_id: '', kind: 'custom', due_at: post.scheduled_at, remind_before_days: 0, amount: 0, installment: 0, done: 0, notified_at: 0,
title: (auto ? 'Kiểm tra bài đã hẹn trên ' : 'Đến giờ đăng ') + (_or.label || post.platform) + ': ' + String(title || post.title || 'video').slice(0, 80),
data: JSON.stringify({ source: 'calendar', post_id: post.id, platform: post.platform, auto_schedule: auto }),
};
}
export function scheduleGuide(platform, _on) {
const _o1a = _on ? fmtWhen(_on) : '';
if (platform === 'youtube') return ['Mở YouTube Studio → Tạo → Tải video lên.', 'Dán tiêu đề + mô tả (đã chép sẵn).', 'Mục "Nội dung bị thay đổi hoặc tổng hợp" → Có.', `Chế độ hiển thị → Lên lịch → ${_o1a} (GMT+7) → Lên lịch.`];
if (platform === 'facebook') return ['Mở Meta Business Suite → Tạo thước phim (Reels) cho Trang.', 'Tải video, dán mô tả (đã chép sẵn), chọn ảnh bìa.', `Tuỳ chọn lên lịch → ${_o1a} → Lên lịch.`, 'Trình lập kế hoạch sẽ hiện bài đã hẹn.'];
return [`App nhắc qua Telegram + Bảng tin lúc ${_o1a}.`, 'Đến giờ: mở app, dán chú thích, đăng tay.'];
}
export function sendToPhoneSteps(job, { os = 'mac' } = {}) {
const out = parse(job && job.output);
const _oq = out.outputs || out;
const _og = out.drive_url || out.drive_link || _oq.drive_url || (job && job.drive_url) || '';
const steps = [];
if (_og) steps.push({ kind: 'drive', text: 'Mở link Drive trên điện thoại → Tải xuống → Lưu video.', url: _og });
else steps.push({ kind: 'drive', text: 'Kéo file video vào Google Drive (thư mục "BDS Studio – Video"), mở Drive trên điện thoại → ⋮ → Gửi bản sao → Lưu video.' });
if (os === 'mac') steps.push({ kind: 'airdrop', text: 'Trên Mac: Finder → chuột phải file video → Chia sẻ → AirDrop → chọn iPhone (bật Bluetooth + Wi-Fi, iPhone mở khoá).' });
steps.push({ kind: 'zalo', text: 'Hoặc gửi file vào Zalo "Cloud của tôi" rồi lưu về máy (Zalo nén nhẹ – ưu tiên Drive/AirDrop cho chất lượng gốc).' });
return steps;
}
const _o0 = ['v', 'video', 'video_code', 'utm_content', 'utm_campaign'];
const _o3 = ['utm_source', 'platform', 'src', 'nguon'];
function _oy(url) { try { return new URL(String(url)).searchParams; } catch { return null; } }
export function leadOrigin(_oa) {
const _od = parse(_oa && _oa.data);
let code = '', platform = '';
for (const _oh of _o0) if (!code && _od[_oh]) code = String(_od[_oh]);
for (const _oh of _o3) if (!platform && _od[_oh]) platform = String(_od[_oh]);
for (const _oh of ['landing_url', 'url', 'ref_url', 'page', 'referrer']) {
const _ox = _od[_oh] && _oy(_od[_oh]);
if (_ox) { if (!code) code = _ox.get('v') || _ox.get('utm_content') || ''; if (!platform) platform = _ox.get('utm_source') || ''; }
}
const _or = platform.toLowerCase();
const _ow = /tik/.test(_or) ? 'tiktok' : /(fb|face|meta|insta|ig|reel)/.test(_or) ? 'facebook' : /(yt|youtube|short)/.test(_or) ? 'youtube' : /zalo/.test(_or) ? 'zalo' : (_or ? 'other' : '');
return { code: code.trim().toLowerCase(), platform: _ow };
}
export function leadStats({ customers = [], posts = [], videos = [] } = {}) {
const _o9 = {};
for (const v of videos) _o9[videoCode(v)] = { video_id: v.id, code: videoCode(v), title: v.title || 'Video', total: 0, by: {}, views: 0, likes: 0, comments: 0, platforms: [] };
for (const _or of posts) {
const v = videos.find(x => x.id === _or.video_job_id);
const code = v ? videoCode(v) : videoCode(_or.video_job_id || '');
const r = _o9[code] || (_o9[code] = { video_id: _or.video_job_id, code, title: _or.title || 'Video', total: 0, by: {}, views: 0, likes: 0, comments: 0, platforms: [] });
r.views += Number(_or.output.views) || 0; r.likes += Number(_or.output.likes) || 0; r.comments += Number(_or.output.comments) || 0;
if (_or.status === 'posted' && !r.platforms.includes(_or.platform)) r.platforms.push(_or.platform);
}
for (const _oa of customers) {
if (Number(_oa.deleted)) continue;
const _oo = leadOrigin(_oa);
if (!_oo.code || !_o9[_oo.code]) continue;
const r = _o9[_oo.code];
r.total++; const _oh = _oo.platform || 'other'; r.by[_oh] = (r.by[_oh] || 0) + 1;
}
return Object.values(_o9).map(r => ({ ...r, rate: r.views ? Math.round((r.total / r.views) * 10000) / 100 : 0 }))
.sort((_o5, b) => b.total - _o5.total || b.views - _o5.views);
}
export function reuseIdeas(stats, { minLeads = 2, top = 3 } = {}) {
const out = [];
for (const r of (stats || []).filter(s => s.total >= minLeads).slice(0, top)) {
const best = Object.entries(r.by).sort((_o5, b) => b[1] - _o5[1])[0];
const missing = PLATFORM_IDS.filter(_or => !r.platforms.includes(_or));
const items = [
{ kind: 'cut', text: 'Cắt bản 15–20 giây chỉ giữ đoạn nhiều thông tin nhất (giá, khoảng cách, tiến độ) – đăng lại sau 5–7 ngày.' },
{ kind: 'hook', text: 'Đổi 3 giây đầu: mở bằng con số/ câu hỏi ("Từ đây ra Hồ Gươm mất bao lâu?") thay vì cảnh toàn.' },
];
if (missing.length) items.push({ kind: 'platform', platforms: missing, text: 'Đăng thêm lên ' + missing.map(_or => PLATFORMS[_or].label).join(', ') + ' (cùng mã video để đếm khách).' });
out.push({ video_id: r.video_id, code: r.code, title: r.title, leads: r.total, best: best ? best[0] : '', items });
}
return out;
}
export function readyVideos(jobs) {
return (jobs || []).filter(j => !Number(j.deleted) && VIDEO_TYPES.includes(j.type) && j.status === 'done')
.sort((_o5, b) => (Number(b.updated_at) || 0) - (Number(_o5.updated_at) || 0));
}
export function newPosts(video, platforms, { caption = '', hashtags = [] } = {}) {
const code = videoCode(video);
const out = parse(video.output); const _oq = out.outputs || {};
return (platforms || PLATFORM_IDS).filter(_or => PLATFORMS[_or]).map(_or => {
const _oa = buildCaption(_or, { title: video.title, caption: caption || video.title, hashtags, code });
return {
type: 'post', title: video.title || 'Video', status: 'draft', cost_estimate: 0,
input: { video_job_id: video.id, platform: _or, scheduled_at: 0, caption: _oa.text, yt_title: _oa.title, hashtags: _oa.hashtags, code,
cover: _oq.cover ? { job: video.id, name: 'cover' } : (out.cover_url ? { url: out.cover_url } : null), checklist: {} },
output: {},
};
});
}

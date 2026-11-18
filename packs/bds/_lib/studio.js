import { FLOW_URL, FLOW_SECONDS, FLOW_CREDITS, findForbidden, sanitize } from './video.js';
export const AI_LABEL_REMINDER = 'Khi đăng, tự bật nhãn nội dung AI trên mạng xã hội (app không chèn chữ "AI" lên video).';
export const SAFE_916 = { W: 1080, H: 1920, top: 288, bottom: 1250, right: 150 };
export const KIND_LABEL = {
ban_do: 'Bản đồ vị trí', metro: 'Metro / tuyến', khoanh_phuong: 'Khoanh phường', the_so_lieu: 'Thẻ số liệu', so_sanh: 'So sánh',
danh_sach: 'Danh sách', bang_tin: 'Bảng tin', mo_dau: 'Mở đầu / phụ đề', anh: 'Ảnh / clip', nhan_vat: 'Nhân vật',
noi_that: 'Nội thất chuyển động', flycam: 'Flycam', doi_thuong: 'Cảnh đời thường',
};
export const MACHINE_KINDS = ['ban_do', 'metro', 'khoanh_phuong', 'the_so_lieu', 'so_sanh', 'danh_sach', 'bang_tin', 'mo_dau'];
export const AI_KINDS = ['nhan_vat', 'noi_that', 'flycam', 'doi_thuong'];
const _o0 = [
['flycam', /flycam|từ trên cao|toàn cảnh dự án|drone/i],
['noi_that', /nội thất|phòng khách|phòng ngủ|bếp|căn mẫu|ban công/i],
['doi_thuong', /đời thường|cư dân|gia đình|trẻ em|dạo bộ|cuộc sống/i],
];
export function sceneKind(scene = {}, engineKind = '') {
const _os = scene.studio || {};
if (_os.kind && KIND_LABEL[_os.kind]) return _os.kind;
if ((scene.media || {}).flow || (scene.media || {}).character) return 'nhan_vat';
const text = [(scene.title || {}).text, (scene.title || {}).kicker, (scene.hook || {}).text, ...(scene.subs || []).map(s => (s && s.text) || s)].join(' ');
const _oi = !scene.camera && !(scene.show || []).length && !(scene.draw || []).length;
if (!engineKind || engineKind === 'anh' || engineKind === 'mo_dau' || (engineKind === 'ban_do' && _oi)) {
for (const [_of, re] of _o0) if (re.test(text)) return _of;
}
return engineKind && KIND_LABEL[engineKind] ? engineKind : 'ban_do';
}
export const defaultEngine = kind => (AI_KINDS.includes(kind) ? 'ai' : 'machine');
export const ENGINE_LABEL = { machine: '🖥 Dựng trên máy', ai: '✨ AI cao cấp' };
export const VEO_API_USD_PER_SEC = 0.5;
export const VEO_API_DEFAULT_CAP = 5;
export const PROVIDERS = {
flow: {
id: 'flow', label: 'Flow / Veo (gói Gemini AI Pro)', url: FLOW_URL, paid: false, auto: false, default: true,
cost: 'Tín dụng gói AI Pro – không tốn thêm tiền', time: '2–5 phút/clip 8 giây',
note: 'Nháp bằng Veo Fast (~' + FLOW_CREDITS.fast + ' tín dụng), duyệt xong mới tạo bản Quality (~' + FLOW_CREDITS.quality + ').',
},
gemini_image: {
id: 'gemini_image', label: 'Gemini tạo ảnh (gói AI Pro) + chuyển động nhẹ', url: 'https://gemini.google.com/app', paid: false, auto: false,
cost: 'Trong gói AI Pro – không tốn thêm', time: '~1 phút/ảnh; máy làm Ken Burns',
note: 'Ảnh phối cảnh/bìa/ảnh tĩnh → máy dựng phóng chậm (Ken Burns), ghi "Ảnh minh hoạ".',
},
kling: { id: 'kling', label: 'Kling', url: 'https://klingai.com', paid: true, auto: false, cost: 'Giá theo gói dịch vụ – kiểm giá khi bật', time: '3–10 phút/clip', note: 'Trả phí riêng: soạn lời nhắn + mở trang, bắt buộc bấm Duyệt trước.' },
runway: { id: 'runway', label: 'Runway', url: 'https://app.runwayml.com', paid: true, auto: false, cost: 'Giá theo gói dịch vụ – kiểm giá khi bật', time: '2–6 phút/clip', note: 'Trả phí riêng: soạn lời nhắn + mở trang, bắt buộc bấm Duyệt trước.' },
hailuo: { id: 'hailuo', label: 'Hailuo', url: 'https://hailuoai.video', paid: true, auto: false, cost: 'Giá theo gói dịch vụ – kiểm giá khi bật', time: '3–8 phút/clip', note: 'Trả phí riêng: soạn lời nhắn + mở trang, bắt buộc bấm Duyệt trước.' },
veo_api: {
id: 'veo_api', label: 'Veo qua API (tự động)', url: '', paid: true, auto: true, off_by_default: true, hidden: true,
cost: `~${VEO_API_USD_PER_SEC} USD/giây (chưa đối chiếu giá chính thức)`, time: '1–3 phút/clip',
note: 'TẮT mặc định – cần khoá API trả phí; chạm trần USD/video thì dừng và hỏi.',
},
};
export const PROVIDER_ORDER = ['flow', 'gemini_image', 'kling', 'runway', 'hailuo', 'veo_api'];
const _o9 = dur => Math.max(1, Math.ceil((Number(dur) || FLOW_SECONDS) / FLOW_SECONDS));
export function suggest(scene = {}, { engineKind = '', enabled = {} } = {}) {
const kind = sceneKind(scene, engineKind);
const engine = defaultEngine(kind);
const dur = Number(scene.dur) || FLOW_SECONDS;
const _ot = kind === 'anh' || /bìa|ảnh tĩnh|phối cảnh/i.test(JSON.stringify(scene.title || '') + JSON.stringify(scene.studio || ''));
const _on = _ot && engine === 'machine' ? 'gemini_image' : (kind === 'anh' ? 'gemini_image' : 'flow');
const _op = {
machine: `${KIND_LABEL[kind]}: máy dựng từ dữ liệu bản đồ/số liệu – chính xác, miễn phí, sửa chữ lúc nào cũng được.`,
flow: `${KIND_LABEL[kind]} cần người/không gian chuyển động thật – Flow/Veo trong gói AI Pro, không tốn thêm tiền.`,
gemini_image: 'Ảnh tĩnh/phối cảnh: Gemini tạo ảnh trong gói, máy làm chuyển động nhẹ – rẻ và nhanh.',
};
const list = PROVIDER_ORDER.filter(id => !PROVIDERS[id].hidden && (!PROVIDERS[id].off_by_default || enabled[id])).map(id => {
const _ol = PROVIDERS[id];
return { id, label: _ol.label, paid: _ol.paid, cost: costLine(id, dur), time: _ol.time, note: _ol.note, recommended: id === _on };
});
return { kind, engine, provider: _on, reason: engine === 'machine' && _on !== 'gemini_image' ? _op.machine : _op[_on], list,
cost: costLine(_on, dur), time: PROVIDERS[_on].time };
}
export function costLine(id, dur = FLOW_SECONDS) {
const n = _o9(dur);
if (id === 'flow') return `${n} clip: nháp Fast ~${n * FLOW_CREDITS.fast} + bản nét Quality ~${n * FLOW_CREDITS.quality} tín dụng (gói AI Pro)`;
if (id === 'gemini_image') return '1 ảnh trong gói AI Pro – 0 đồng thêm';
if (id === 'veo_api') return `~${(Number(dur) * VEO_API_USD_PER_SEC).toFixed(2)} USD (chưa đối chiếu giá chính thức)`;
return PROVIDERS[id] ? PROVIDERS[id].cost : '';
}
export function choiceOf(scene = {}, engineKind = '') {
const _os = scene.studio || {};
const s = suggest(scene, { engineKind });
const engine = _os.engine === 'ai' || _os.engine === 'machine' ? _os.engine : s.engine;
return { engine, provider: engine === 'ai' ? (PROVIDERS[_os.provider] ? _os.provider : s.provider) : null, kind: s.kind, paid_approved: !!_os.paid_approved };
}
export function estimateTotal(list = [], { budget = {} } = {}) {
const _o6 = Number(budget.video_char_usd ?? VEO_API_DEFAULT_CAP) || VEO_API_DEFAULT_CAP;
const t = { machine: 0, ai: 0, flow_clips: 0, flow_draft_credits: 0, flow_final_credits: 0, gemini_images: 0, paid_scenes: [], usd: 0, cap_usd: _o6, over_cap: false, blocked: [] };
list.forEach(({ scene, kind }, i) => {
const _o5 = choiceOf(scene, kind);
if (_o5.engine === 'machine') { t.machine++; return; }
t.ai++;
const dur = Number(scene.dur) || FLOW_SECONDS;
if (_o5.provider === 'flow') { const n = _o9(dur); t.flow_clips += n; t.flow_draft_credits += n * FLOW_CREDITS.fast; t.flow_final_credits += n * FLOW_CREDITS.quality; }
else if (_o5.provider === 'gemini_image') t.gemini_images++;
else if (_o5.provider === 'veo_api') t.usd += dur * VEO_API_USD_PER_SEC;
if (PROVIDERS[_o5.provider] && PROVIDERS[_o5.provider].paid) {
t.paid_scenes.push({ index: i, provider: _o5.provider });
if (!_o5.paid_approved) t.blocked.push({ index: i, provider: _o5.provider, reason: 'Chưa duyệt chi phí dịch vụ trả phí' });
}
});
t.usd = Math.round(t.usd * 100) / 100;
t.over_cap = t.usd > _o6;
t.credits_total = t.flow_draft_credits + t.flow_final_credits;
t.percent_of_month = Math.round(t.credits_total / FLOW_CREDITS.monthly * 100);
const _om = [`${t.machine} cảnh dựng trên máy (0 đồng)`];
if (t.flow_clips) _om.push(`Flow ${t.flow_clips} clip ~${t.credits_total} tín dụng (~${t.percent_of_month}% tháng)`);
if (t.gemini_images) _om.push(`${t.gemini_images} ảnh Gemini (trong gói)`);
if (t.paid_scenes.filter(_ol => _ol.provider !== 'veo_api').length) _om.push(`${t.paid_scenes.filter(_ol => _ol.provider !== 'veo_api').length} cảnh dịch vụ trả phí – giá theo gói dịch vụ`);
if (t.usd) _om.push(`Veo API ~${t.usd} USD / trần ${_o6} USD (chưa đối chiếu giá chính thức)`);
t.text = _om.join(' · ');
return t;
}
export function canRunAi(scene = {}, { enabled = {}, budget = {}, spentUsd = 0 } = {}) {
const _os = scene.studio || {};
const _ol = PROVIDERS[_os.provider];
if (!_ol) return { ok: false, reason: 'Chưa chọn dịch vụ AI' };
if (_ol.off_by_default && !enabled[_ol.id]) return { ok: false, reason: 'Veo qua API đang TẮT – bật trong Kết nối và cài khoá trả phí' };
if (_ol.paid && !_os.paid_approved) return { ok: false, reason: 'Dịch vụ trả phí riêng – bấm "Duyệt" chi phí trước' };
if (_ol.auto) {
const _o6 = Number(budget.video_char_usd ?? VEO_API_DEFAULT_CAP) || VEO_API_DEFAULT_CAP;
const _oj = (Number(scene.dur) || FLOW_SECONDS) * VEO_API_USD_PER_SEC;
if (spentUsd + _oj > _o6) return { ok: false, reason: `Chạm trần ${_o6} USD/video – dừng, hỏi anh/chị trước khi chi thêm`, ask: true };
}
return { ok: true, reason: '' };
}
export function setChoice(scene = {}, engine, provider) {
const _os = { ...(scene.studio || {}) };
_os.engine = engine === 'ai' ? 'ai' : 'machine';
if (_os.engine === 'ai') {
const _oo = PROVIDERS[provider] ? provider : (PROVIDERS[_os.provider] ? _os.provider : 'flow');
if (_oo !== _os.provider) delete _os.paid_approved;
_os.provider = _oo;
}
return { ...scene, studio: _os };
}
export function approvePaid(scene = {}) { return { ...scene, studio: { ...(scene.studio || {}), paid_approved: true, approved_at: Date.now() } }; }
export function applyToAll(scenes = [], kinds = [], { group, engine, provider } = {}) {
return scenes.map((sc, i) => {
const _of = sceneKind(sc, kinds[i]);
const _oe = group === 'all' || (group === 'map' ? MACHINE_KINDS.includes(_of) : group === 'people' ? AI_KINDS.includes(_of) : false);
return _oe ? setChoice(sc, engine, provider) : sc;
});
}
const _ou = sc => [...(sc.subs || []).map(s => (s && s.say) || (s && s.text) || s)].map(s => String(s || '').replace(/\*\*/g, '')).join(' ');
export function aiPrompt(scene = {}, { kind = '', character = null, apartment = '', provider = 'flow', stage = 'draft' } = {}) {
const _of = sceneKind(scene, kind);
const _oq = {
nhan_vat: 'the character walks naturally through the space, calm and confident, eye-level gimbal tracking shot',
noi_that: 'slow cinematic dolly through a furnished interior, soft natural daylight, no people',
flycam: 'aerial drone shot slowly rising and orbiting over the residential area, golden hour, smooth motion',
doi_thuong: 'candid everyday life of Vietnamese residents in a green residential park, natural light, handheld but steady',
anh: 'photorealistic still image, wide angle', ban_do: 'establishing aerial shot of Hanoi',
}[_of] || 'cinematic establishing shot';
const lock = character && character.lock_en ? `CHARACTER LOCK (identical in every clip): ${character.lock_en}\nUse the "${character.name || 'character'}" reference images.` : '';
const _og = [
stage === 'final' ? 'FINAL QUALITY render (Veo Quality) of the APPROVED draft – same framing and action.' : 'DRAFT (Veo Fast) – low cost preview for approval.',
`Vertical 9:16, ${FLOW_SECONDS} seconds, 1080x1920.`,
`SHOT: ${_oq}.`, apartment ? `SETTING: ${sanitize(apartment)}.` : '', lock,
`CONTEXT (Vietnamese voice-over, do not render as text): ${sanitize(_ou(scene)).slice(0, 300)}`,
'NO on-screen text, NO subtitles, NO logos, NO watermarks, NO "AI" labels. Realistic, no distorted hands or faces.',
];
if (provider === 'gemini_image') _og[1] = 'Vertical 9:16 image, 1080x1920, photorealistic architectural visualisation.';
return _og.filter(Boolean).join('\n');
}
export function attachClip(scene = {}, { path, provider = 'flow', stage = 'draft', model, room } = {}) {
if (!path) throw new Error('Chưa có tệp clip');
const _od = /\.(jpe?g|png|webp)$/i.test(path);
const media = { ...(scene.media || {}), src: path, ai: true, fit: 'cover' };
if (_od) { media.zoom = 'in'; delete media.flow; media.ai_image = { provider }; }
else media.flow = { stage: stage === 'final' ? 'final' : 'draft', provider, model: model || (stage === 'final' ? 'quality' : 'fast'), room: room || '' };
const _os = { ...(scene.studio || {}), engine: 'ai', provider };
return { ...scene, media, studio: _os, min_dur: Math.max(scene.min_dur || 0, 4.5) };
}
export function detachClip(scene = {}) { const s = { ...scene }; delete s.media; return s; }
export function rewritePrompt(scene = {}, { topic = '' } = {}) {
const _oa = (scene.subs || []).map(s => (s && s.text) || s).join('\n');
return [
'Viết lại phụ đề cho 1 cảnh video dọc TikTok về bất động sản (giọng đọc Vbee).',
topic ? 'Chủ đề video: ' + topic : '', (scene.title || {}).text ? 'Tiêu đề cảnh: ' + scene.title.text : '',
'Phụ đề hiện tại:\n' + _oa,
'Yêu cầu: 2–3 câu, mỗi câu ≤ 75 ký tự, giọng chuyên gia trung tính, có số liệu thì giữ nguyên số và nguồn.',
'Không giật tít, không hứa lợi nhuận, không "mua ngay", không chữ "AI". Có thể đặt **…** quanh 1 cụm cần nhấn.',
'Chỉ trả về các câu, mỗi câu một dòng.',
].filter(Boolean).join('\n');
}
export function parseRewrite(text) {
return String(text || '').split(/\r?\n/).map(s => s.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').replace(/^["“]|["”]$/g, '').trim())
.filter(s => s && !/^(dưới đây|sau đây|phụ đề)/i.test(s)).map(s => sanitize(s)).filter(Boolean).slice(0, 5);
}
export function applyEdit(scene = {}, { title, kicker, subs, dur, hook } = {}) {
const s = JSON.parse(JSON.stringify(scene));
if (title !== undefined || kicker !== undefined) {
const t = { ...(typeof s.title === 'object' && s.title ? s.title : {}) };
if (title !== undefined) t.text = String(title).trim();
if (kicker !== undefined) t.kicker = String(kicker).trim();
if (t.text || t.kicker) s.title = t; else delete s.title;
}
if (hook !== undefined && s.hook) s.hook = { ...s.hook, text: String(hook).trim() };
if (Array.isArray(subs)) {
s.subs = subs.map(x => ({ text: String((x && x.text) ?? x ?? '').trim(), say: String((x && x.say) || '').trim() }))
.filter(x => x.text).map(x => (x.say && x.say !== x.text.replace(/\*\*/g, '') ? { text: x.text, say: x.say } : x.text));
}
if (dur !== undefined && dur !== '' && dur !== null) {
const _ob = Number(dur);
if (!(_ob >= 0.5 && _ob <= 60)) throw new Error('Độ dài cảnh 0,5–60 giây');
s.dur = Math.round(_ob * 10) / 10;
}
return s;
}
export function liveIssues(text) {
const t = String(text || '');
const _ok = [];
if (t.replace(/\*\*/g, '').length > 75) _ok.push('dài hơn 75 ký tự (dễ thành 3 dòng)');
if (/(^|[^\p{L}\p{N}])AI($|[^\p{L}\p{N}])/u.test(t)) _ok.push('có chữ "AI" trên hình');
const _o3 = findForbidden(t); if (_o3.length) _ok.push('nên bỏ: ' + _o3.join(', '));
return _ok;
}
export function dragToOffset(label, bx, by) {
const box = label.box || [label.x + 60, label.y - 60, label.x + 260, label.y];
const _o4 = box[2] - box[0], hh = box[3] - box[1];
const _o8 = bx + _o4 / 2;
const _or = _o8 >= label.x ? 'right' : 'left';
const _oh = by + hh / 2 + (hh > 60 ? (hh - 50) / 2 : 0);
const _oc = _or === 'right' ? bx - label.x : label.x - (bx + _o4);
return { label_side: _or, label_offset: [Math.round(Math.max(10, Math.min(900, _oc))), Math.round(Math.max(-900, Math.min(900, _oh - label.y)))] };
}
export const scaleBox = (box, _of) => box.map(v => v * _of);
export const STATUS_ICON = { ok: '✓', warn: '⚠', error: '✗' };
export function summarize(check) {
const rows = (check && check.rows) || [];
const errors = rows.filter(r => r.status === 'error').length, warnings = rows.filter(r => r.status === 'warn').length;
return { rows, errors, warnings, canExport: !!check && rows.length > 0 && errors === 0,
text: !check ? 'Chưa kiểm tra' : errors ? `${errors} lỗi đỏ – chưa xuất được` : warnings ? `Đạt, ${warnings} lưu ý` : 'Đạt hết' };
}
export const QUEUE_MODE = { busy: 'Anh/chị đang dùng máy – chạy từng job một', idle: 'Máy rảnh – chạy liên tục', night: 'Ban đêm 23h–6h – chạy liên tục' };
export const QUEUE_STATE = { queued: 'Đang chờ', running: 'Đang dựng', done: 'Xong', error: 'Lỗi' };
export function moveId(ids, from, to) {
const _o1 = [...ids]; if (from < 0 || from >= _o1.length || to < 0 || to >= _o1.length) return _o1;
_o1.splice(to, 0, _o1.splice(from, 1)[0]); return _o1;
}
export function fmtBytes(n) {
n = Number(n) || 0;
if (n >= 2 ** 30) return (n / 2 ** 30).toFixed(2).replace('.', ',') + ' GB';
if (n >= 2 ** 20) return (n / 2 ** 20).toFixed(1).replace('.', ',') + ' MB';
return Math.round(n / 1024) + ' KB';
}
const uid = (_ol, cfg) => { const ids = new Set((cfg.items || []).map(i => i.id)); let _of = 1; while (ids.has(_ol + _of)) _of++; return _ol + _of; };
const _o2 = cfg => (cfg.items || []).find(i => i.ll && i.kind === 'star') || (cfg.items || []).find(i => i.ll);
const _o7 = cfg => (_o2(cfg) || {}).ll || cfg.origin || [21.0287, 105.8524];
export const TEMPLATES = [
{ id: 'vi_tri', icon: '📍', label: 'Bản đồ vị trí', desc: 'Ghim dự án + mốc trung tâm, đo khoảng cách',
make(cfg) { const _o1 = _o2(cfg); const _ol = uid('moc', cfg); const ll = _o7(cfg);
const items = [{ id: _ol, name: 'Mốc gần đó', kind: 'star', color: '#FFD54F', ll: [ll[0] + 0.02, ll[1] - 0.03], always_label: true }];
const fit = _o1 ? [_o1.id, _ol] : [_ol];
return { items, scene: { camera: { fit, pad: 0.6, min_km: 4 }, show: fit, pop: [_ol], measure: _o1 ? [[_o1.id, _ol]] : [], title: { kicker: 'Vị trí', text: 'Cách trung tâm bao xa?' }, subs: ['Từ dự án tới mốc gần đó chỉ vài phút di chuyển.'], dur: 6, studio: { kind: 'ban_do' } } }; } },
{ id: 'metro', icon: '🚇', label: 'Tuyến metro', desc: 'Vẽ tuyến + ga, tàu chạy',
make(cfg) { const ll = _o7(cfg); const _ol = uid('metro', cfg);
const items = [{ id: _ol, name: 'Tuyến metro', color: '#2ED3E6', status: 'planned', marker: false, path_ll: [[ll[0] + 0.03, ll[1] - 0.05], [ll[0], ll[1]], [ll[0] - 0.02, ll[1] + 0.04]], train: { n: 1, speed: 150, cars: 3, size: 1.4 }, stations: [] }];
return { items, scene: { camera: { fit: [_ol], pad: 0.5, min_km: 6 }, show: [_ol], draw: [_ol], draw_time: 2.5, title: { kicker: 'Hạ tầng', text: 'Tuyến metro đi qua' }, subs: ['Tuyến metro theo quy hoạch đi qua khu vực.'], dur: 7, studio: { kind: 'metro' } } }; } },
{ id: 'phuong', icon: '⭕', label: 'Khoanh phường', desc: 'Làm nổi ranh giới phường/xã',
make(cfg) { const ll = _o7(cfg); const _ol = uid('phuong', cfg); const _ob = 0.012;
const items = [{ id: _ol, name: 'Phường mới', color: '#FF8A3D', area_ll: [[ll[0] + _ob, ll[1] - _ob], [ll[0] + _ob, ll[1] + _ob], [ll[0] - _ob, ll[1] + _ob], [ll[0] - _ob, ll[1] - _ob]] }];
return { items, scene: { camera: { fit: [_ol], pad: 0.8, min_km: 3 }, show: [_ol], spotlight: _ol, title: { kicker: 'Sáp nhập 2025', text: 'Phường mới gồm những đâu?' }, subs: ['Phường mới hình thành từ các phường cũ.'], dur: 6, source: '', studio: { kind: 'khoanh_phuong' } } }; } },
{ id: 'so_lieu', icon: '🔢', label: 'Thẻ số liệu', desc: 'Một con số lớn + vài dòng',
make() { return { items: [], scene: { card: { title: 'Con số chính', big: { value: '0', unit: 'tỷ', note: 'Nguồn: (ghi nguồn)' }, rows: [['Mục', 'Giá trị']] }, title: { kicker: 'Số liệu', text: 'Con số đáng chú ý' }, subs: ['Con số chính kèm nguồn công bố.'], dur: 6, source: '', studio: { kind: 'the_so_lieu' } } }; } },
{ id: 'so_sanh', icon: '⚖️', label: 'So sánh', desc: 'Trước / sau, A / B',
make() { return { items: [], scene: { panel: { type: 'compare', title: 'So sánh', left: 'TRƯỚC', right: 'SAU', rows: [['Tiêu chí', '—', '—']], note: 'Nguồn: (ghi nguồn)' }, title: { kicker: 'So sánh', text: 'Thay đổi những gì?' }, subs: ['Hai cột so sánh trước và sau.'], dur: 7, studio: { kind: 'so_sanh' } } }; } },
{ id: 'danh_sach', icon: '✅', label: 'Danh sách', desc: 'Checklist cuối video + mời theo dõi',
make() { return { items: [], scene: { card: { title: 'Cần nhớ', list: ['Điều thứ nhất', 'Điều thứ hai', 'Điều thứ ba'], list_from_sub: 0 }, subs: ['Điều thứ nhất.', 'Điều thứ hai.', 'Điều thứ ba. Theo dõi kênh để xem tiếp.'], dur: 8, studio: { kind: 'danh_sach' } } }; } },
{ id: 'nhan_vat', icon: '🧑‍💼', label: 'Nhân vật', desc: 'Cảnh người đi trong căn (Flow/Veo)',
make() { return { items: [], scene: { title: { kicker: 'Căn mẫu', text: 'Đi một vòng căn hộ' }, subs: ['Cùng xem không gian thực tế của căn hộ.'], dur: 8, studio: { kind: 'nhan_vat', engine: 'ai', provider: 'flow' } } }; } },
];
export function makeTemplate(id, cfg = {}) {
const t = TEMPLATES.find(x => x.id === id);
if (!t) throw new Error('Không có mẫu ' + id);
const r = t.make(cfg);
return { scene: { ...r.scene, id: id + '_' + Date.now().toString(36) }, items: r.items };
}
export const SCENE_TEMPLATES_KEY = 'scene_templates';

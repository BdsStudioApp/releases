export const ENGINE_URL = 'http://127.0.0.1:8765';
export const FLOW_URL = 'https://labs.google/fx/tools/flow';
export const INSTALLER_URLS = { windows: 'downloads/BDS_Studio_Video_Windows.zip', mac: 'downloads/BDS_Studio_Video_Mac.zip' };
export const INSTALLER_URL = INSTALLER_URLS.windows;
export const FLOW_SECONDS = 8;
export const MAX_SCENES = 12;
export const CHANNEL = 'Kênh của bạn';
export const AI_LABEL_REMINDER = 'Khi đăng, tự bật nhãn nội dung AI trên mạng xã hội.';
export const ILLUSTRATIVE_LABEL = 'Ảnh minh hoạ';
export const FLOW_CREDITS = { fast: 20, quality: 100, monthly: 1000 };
export const WORDS_PER_SEC = 3.0;
export const FORBIDDEN = [
'x2', 'x3', 'gấp đôi', 'đón sóng', 'cơ hội vàng', 'mua ngay', 'chốt ngay', 'cam kết lợi nhuận', 'lợi nhuận cam kết',
'chắc chắn tăng', 'tăng giá chắc', 'đầu tư sinh lời', 'sinh lời cao', 'lãi thấp nhất', 'vay ngay', 'nên vay', 'đáo hạn',
'guaranteed', 'double your money', 'profit', 'best investment', 'ai-generated', 'ai generated', 'made with ai', 'nội dung ai', 'video ai', 'ảnh ai',
];
const strip = _o19 => String(_o19 ?? '').normalize('NFC');
const _ov = _o19 => strip(_o19).toLowerCase();
const _on = _o19 => _o19.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export function findForbidden(text) {
const t = _ov(text);
return FORBIDDEN.filter(_o1g => new RegExp('(^|[^\\p{L}\\p{N}])' + _on(_o1g) + '($|[^\\p{L}\\p{N}])', 'u').test(t));
}
export function sanitize(text) {
let t = strip(text);
for (const _o1g of FORBIDDEN) t = t.replace(new RegExp('(^|[^\\p{L}\\p{N}])' + _on(_o1g) + '(?=$|[^\\p{L}\\p{N}])', 'giu'), '$1');
return t.replace(/\s{2,}/g, ' ').replace(/\s+([,.!?])/g, '$1').replace(/[,;:]+\s*([!?.])/g, '$1')
.replace(/^[\s,;:.]+|[\s,;:]+$/g, '').trim();
}
export const wordCount = _o19 => strip(_o19).replace(/\*\*/g, '').split(/\s+/).filter(Boolean).length;
const _o2 = {
entrance: { vi: 'Sảnh vào', en: 'the front door and entrance hall',
act: 'opens the front door and steps inside, pausing to take in the space',
cam: 'camera starts behind the character at the doorway and follows them in with a slow forward dolly',
say: _o4 => `Mời anh chị cùng xem căn ${_o4.typeArea}${_o4.project ? ' tại ' + _o4.project : ''}.` },
living: { vi: 'Phòng khách', en: 'the living room',
act: 'walks slowly into the living room, runs a hand along the back of the sofa and looks out of the large window',
cam: 'smooth gimbal tracking shot at eye level, slight arc around the character',
say: () => 'Phòng khách thoáng, ánh sáng tự nhiên vào gần như cả ngày.' },
kitchen: { vi: 'Bếp & phòng ăn', en: 'the kitchen and dining area',
act: 'moves to the kitchen island, lightly touches the countertop and glances toward the dining table',
cam: 'slow lateral tracking shot following the character along the counter',
say: () => 'Bếp liền phòng ăn, lối đi gọn, tiện cho cả gia đình.' },
master: { vi: 'Phòng ngủ chính', en: 'the master bedroom',
act: 'enters the master bedroom, sits briefly on the edge of the bed and looks around calmly',
cam: 'gentle push-in from the doorway at eye level',
say: () => 'Phòng ngủ chính yên tĩnh, đủ chỗ cho giường đôi và tủ áo lớn.' },
bedroom2: { vi: 'Phòng ngủ 2', en: 'the second bedroom',
act: 'opens the door of the second bedroom, steps in and looks at the desk by the window',
cam: 'slow forward dolly through the doorway',
say: () => 'Phòng ngủ thứ hai hợp làm phòng cho con hoặc góc làm việc.' },
bedroom3: { vi: 'Phòng ngủ 3', en: 'the third bedroom',
act: 'looks into the third bedroom from the doorway, then walks to the window',
cam: 'static wide shot, then a slow pan following the character',
say: () => 'Phòng ngủ thứ ba linh hoạt cho ông bà hoặc khách.' },
bathroom: { vi: 'Phòng tắm', en: 'the bathroom',
act: 'opens the bathroom door and looks at the vanity and the glass shower screen',
cam: 'slow pan from the vanity to the shower area',
say: () => 'Phòng tắm khô ướt tách biệt, thiết bị gọn gàng.' },
balcony: { vi: 'Ban công / lô gia', en: 'the balcony',
act: 'slides open the balcony door, steps out and rests both hands on the railing, looking at the view',
cam: 'camera follows from inside, then rises slightly to reveal the view beyond the railing',
say: _o4 => `Ban công${_o4.balcony ? ' hướng ' + _o4.balcony : ''}, đứng đây nhìn ra toàn cảnh khu đô thị.` },
closing: { vi: 'Cảnh kết', en: 'the living room seen from the balcony door',
act: 'turns back toward the camera with a relaxed, natural smile and walks back inside',
cam: 'slow pull-back wide shot showing the whole living space',
say: _o4 => `Video minh hoạ căn ${_o4.typeShort}. Theo dõi kênh để xem thêm căn hộ thực tế.` },
};
const _o3 = ['entrance', 'living', 'kitchen', 'master', 'bedroom2', 'bedroom3', 'bathroom', 'balcony', 'closing'];
const _o1 = ['entrance', 'living', 'balcony', 'master', 'closing', 'kitchen', 'bedroom2', 'bathroom', 'bedroom3'];
export function roomsFor(n, bedrooms = 2) {
n = Math.max(1, Math.min(MAX_SCENES, Math.round(Number(n) || 1)));
const _od = Math.max(1, Math.min(3, Math.round(Number(bedrooms) || 2)));
const _o9 = _o3.filter(_o16 => !(_o16 === 'bedroom2' && _od < 2) && !(_o16 === 'bedroom3' && _od < 3));
if (n >= _o9.length) {
const _oo = [];
const _ol = ['living', 'kitchen', 'master', 'balcony'];
for (let i = 0; _oo.length < n - _o9.length; i++) _oo.push(_ol[i % _ol.length]);
const _o10 = [];
for (const _o16 of _o9) { _o10.push(_o16); for (const e of _oo.filter(x => x === _o16)) _o10.push(_o16 + ':detail'); }
return _o10.slice(0, n);
}
const _o14 = new Set(_o1.filter(_o16 => _o9.includes(_o16)).slice(0, n));
return _o9.filter(_o16 => _o14.has(_o16));
}
function _o7(_o4 = {}) {
const type = strip(_o4.type || (_o4.bedrooms ? _o4.bedrooms + ' phòng ngủ' : 'căn hộ')).trim();
const area = Number(_o4.area) ? String(_o4.area).replace('.', ',') + ' m²' : '';
return {
project: strip(_o4.project).trim(), balcony: strip(_o4.balcony).trim(),
typeShort: type, typeArea: [type, area].filter(Boolean).join(' '),
};
}
const _of = _o19 => sanitize(String(_o19 ?? '').replace(/\s+/g, ' ').trim());
export function buildFlowPlan({ apartment = {}, person = {}, character = null, scenes = 6, model = 'fast' } = {}) {
const _o4 = _o7(apartment);
const _o18 = roomsFor(scenes, apartment.bedrooms);
const _oe = character && String(character.lock_en || '').trim() ? { name: strip(character.name).trim() || 'the character', lock_en: strip(character.lock_en).trim() } : null;
const _o1i = _oe ? _oe.lock_en : (_of(person.description) || 'a well-dressed Vietnamese adult in smart-casual clothes');
const style = _of(apartment.style) || 'modern, warm and minimal interior';
const _o6 = _of(apartment.description);
const photos = Number(apartment.photos) || 0;
const characterLock = _oe
? `CHARACTER LOCK (keep 100% identical in every scene): ${_oe.lock_en}\n` +
`REFERENCE: use the "${_oe.name}" character reference images from Ingredients – exactly the same person, same face, hairstyle, skin tone, outfit, shoes and body proportions; calm, natural walking pace; never looks into the lens except in the final scene.`
: `CHARACTER LOCK (keep 100% identical in every scene): ${_o1i}` +
(person.has_photo !== false ? '; exactly the same person as in the uploaded reference portrait – same face, hairstyle, skin tone, outfit, shoes and body proportions' : '') +
'; calm, natural walking pace; never looks into the lens except in the final scene.';
const settingLock = `SETTING LOCK (same apartment in every scene): a ${_o4.typeArea || 'city apartment'}` +
`${_o4.project ? ' in a high-rise residential project in Hanoi' : ''}, ${style}` + (_o6 ? `; ${_o6}` : '') +
(photos ? `; layout, furniture, materials and colours must match the ${photos} uploaded apartment reference photo${photos > 1 ? 's' : ''}` : '') +
'; the same furniture, flooring, wall colours and daylight direction (soft late-morning sun) in every scene.';
const list = _o18.map((_ot, i) => {
const [base, variant] = _ot.split(':');
const R = _o2[base];
const _o15 = i > 0 ? _o2[_o18[i - 1].split(':')[0]].en : null;
const next = i < _o18.length - 1 ? _o2[_o18[i + 1].split(':')[0]].en : null;
const _o5 = variant === 'detail'
? `stays in ${R.en} and slowly looks at the details – textures, light on the walls, the view – moving a few steps`
: R.act;
const prompt = [
`Vertical 9:16 video, ${FLOW_SECONDS} seconds, photorealistic cinematic real-estate walkthrough, 1080x1920.`,
characterLock,
settingLock,
`SCENE ${i + 1}/${_o18.length} – ${R.en}: the character ${_o5}.`,
`CAMERA: ${R.cam}; steady gimbal movement, 24mm lens, eye level, no cuts, no shaky motion.`,
`CONTINUITY: ${_o15 ? `starts exactly where scene ${i} ended (coming from ${_o15})` : 'first scene of a continuous single-take tour'}` +
`${next ? `; ends with the character heading toward ${next}` : '; ends on a calm wide shot of the apartment'}.`,
'LIGHT & SOUND: soft natural daylight, realistic reflections; quiet room ambience and footsteps only, no music, no speech.',
'AVOID: no on-screen text, no captions, no subtitles, no logos, no watermarks, no readable signs, no extra people, no distorted hands or faces.',
].join('\n');
let voice = _of(variant === 'detail' ? `Thêm một góc ${R.vi.toLowerCase()}, vật liệu và ánh sáng được hoàn thiện kỹ.` : R.say(_o4));
return { index: i, room: base, title: R.vi + (variant === 'detail' ? ' (chi tiết)' : ''), seconds: FLOW_SECONDS, prompt, voice };
});
return {
scenes: list, character_lock: characterLock, setting_lock: settingLock,
character: _oe ? { name: _oe.name, lock_en: _oe.lock_en } : null,
reference_hint: _oe ? `Dùng ảnh tham chiếu "${_oe.name}" trong Ingredients (cùng bộ ảnh cho mọi cảnh).` : '',
total_seconds: list.length * FLOW_SECONDS, credits: estimateFlowCredits(list.length, { model }),
};
}
export function estimateFlowCredits(clips, { model = 'fast', retries = 1.5 } = {}) {
const _o13 = FLOW_CREDITS[model] || FLOW_CREDITS.fast;
const n = Math.max(0, Math.round(Number(clips) || 0));
const low = n * _o13; const high = Math.ceil(n * retries) * _o13;
const _o12 = Math.round(high / FLOW_CREDITS.monthly * 100);
return {
model, per_clip: _o13, clips: n, low, high, monthly: FLOW_CREDITS.monthly, percent_of_month: _o12, cost_vnd: 0,
text: `${n} cảnh × ${_o13} = ${low}–${high} tín dụng (tính cả làm lại), khoảng ${_o12}% tín dụng tháng – dùng tín dụng gói Gemini AI Pro, không tốn thêm tiền.`,
};
}
export function flowScriptLines(voices) {
return (voices || []).map((t, i) => ({ text: _of(t), clip: i })).filter(l => l.text);
}
export function voiceFits(text, seconds = FLOW_SECONDS) {
const _oy = wordCount(text) / WORDS_PER_SEC;
return { ok: _oy <= seconds - 0.6, seconds_needed: Math.round(_oy * 10) / 10 };
}
export function orderClips(names) {
const num = _o19 => { const _ow = String(_o19).replace(/\.[a-z0-9]{2,5}$/i, '').match(/(\d+)/); return _ow ? Number(_ow[1]) : Infinity; };
const _og = (x, y) => (x === y ? 0 : x < y ? -1 : 1);
return [...(names || [])].map((n, i) => ({ n, i, k: num(n.name || n) })).sort((_o4, _oa) => _og(_o4.k, _oa.k) || _o4.i - _oa.i).map(x => x.n);
}
export function buildClaudeMapRequest(input, { channel = CHANNEL } = {}) {
const src = strip(input).trim();
return [
'Dùng skill bds-quyhoach-video để làm kịch bản video dọc TikTok/Reels cho kênh "' + channel + '" từ nguồn sau:',
src || '(chưa có link – hỏi tôi chủ đề)',
'',
'Làm theo đúng quy trình của skill: đọc nguồn, kiểm chứng số liệu (nguồn + tháng), gửi bản phân tích ngắn để tôi duyệt.',
'Sau khi tôi trả lời "ok": KHÔNG dựng video, KHÔNG gọi Vbee, KHÔNG lưu Drive – máy dựng trên máy tôi sẽ làm việc đó.',
'Chỉ trả về MỘT khối ```json chứa cfg.json đúng định dạng của render_map.py (references/config.md), với các điều kiện:',
'- "format": "9:16"; "brand": {"channel": "' + channel + '", "accent": "#FF8A3D"}; "footer" có "© OpenStreetMap contributors" + nguồn số liệu.',
'- Nền bản đồ Hà Nội có sẵn trên máy: "geo": "hn_region_geo.txt", "names": "hn_region_names.txt", "origin": [21.0, 105.85]' +
' (hoặc "hn_dong_z14_geo.txt"/"hn_dong_z14_names.txt" cho phía Đông). Toạ độ công trình dùng "ll"/"path_ll"/"area_ll".',
'- Phụ đề dạng {"text": "...", "say": "..."} khi số/viết tắt khó đọc; cảnh 1 có "hook"; cảnh cuối là checklist 3 câu + mời theo dõi.',
'- Không dùng ảnh/video có bản quyền; ảnh minh hoạ (nếu có) ghi chú để tôi tự thêm sau, không chèn chữ nhãn "AI" lên hình.',
'- Không hứa tăng giá, không khuyên đầu tư/vay; dự thảo ghi "DỰ THẢO".',
'Sau khối JSON, thêm caption TikTok (tiêu đề dòng đầu, 5–8 hashtag) trong một khối ```text riêng.',
].join('\n');
}
export function extractJson(text) {
const _o19 = strip(text).trim();
const _ow = _o19.match(/```(?:json)?\s*([\s\S]*?)```/i);
if (_ow) return _ow[1].trim();
const _o4 = _o19.indexOf('{'); const _oa = _o19.lastIndexOf('}');
return _o4 >= 0 && _oa > _o4 ? _o19.slice(_o4, _oa + 1) : _o19;
}
function _ou(src, pos) {
const _oc = src.slice(0, pos); const line = _oc.split('\n').length; const col = pos - _oc.lastIndexOf('\n');
return { line, col };
}
export function validateMapCfg(text) {
const errors = []; const warnings = [];
const src = extractJson(text);
let cfg = null;
if (!src) return { ok: false, errors: ['Chưa dán cfg.json.'], warnings, cfg: null, scenes: 0, seconds: 0 };
try { cfg = JSON.parse(src); } catch (e) {
const _ow = String(e.message).match(/position (\d+)/);
const _o1h = _ow ? _ou(src, Number(_ow[1])) : null;
errors.push('JSON lỗi' + (_o1h ? ` ở dòng ${_o1h.line}, cột ${_o1h.col}` : '') + ': kiểm tra dấu phẩy, ngoặc, dấu nháy.');
return { ok: false, errors, warnings, cfg: null, scenes: 0, seconds: 0 };
}
if (!cfg || typeof cfg !== 'object' || Array.isArray(cfg)) { errors.push('cfg.json phải là một đối tượng { … }.'); return { ok: false, errors, warnings, cfg: null, scenes: 0, seconds: 0 }; }
if (cfg.format && !['9:16', '16:9'].includes(cfg.format)) errors.push('"format" chỉ nhận "9:16" hoặc "16:9".');
if (!Array.isArray(cfg.scenes) || !cfg.scenes.length) errors.push('Thiếu "scenes" (danh sách cảnh).');
const ids = new Set();
for (const _os of Array.isArray(cfg.items) ? cfg.items : []) {
if (!_os || !_os.id) { errors.push('Có item thiếu "id".'); continue; }
if (ids.has(_os.id)) errors.push(`Trùng id item "${_os.id}".`);
ids.add(_os.id);
}
let seconds = 0;
const _o1b = [];
(Array.isArray(cfg.scenes) ? cfg.scenes : []).forEach((sc, i) => {
const n = i + 1;
if (!sc || typeof sc !== 'object') { errors.push(`Cảnh ${n} không hợp lệ.`); return; }
const _o17 = [...(sc.show || []), ...(sc.pop || []), ...(sc.draw || []), ...((sc.camera && sc.camera.fit) || []), ...((sc.measure || []).flat())];
for (const _o16 of _o17) if (typeof _o16 === 'string' && !ids.has(_o16)) errors.push(`Cảnh ${n}: không có item "${_o16}".`);
const subs = (sc.subs || []).map(_o19 => (_o19 && typeof _o19 === 'object') ? (_o19.text || '') : String(_o19 || ''));
_o1b.push(...subs, ...(sc.subs || []).map(_o19 => (_o19 && typeof _o19 === 'object') ? (_o19.say || '') : ''));
const words = subs.reduce((k, _o19) => k + wordCount(_o19), 0);
seconds += Number(sc.dur) || Math.max(3, words / 3.3 + 1);
if (sc.media && sc.media.src && sc.type !== 'ai_clip' && !/^https?:/.test(sc.media.src)) warnings.push(`Cảnh ${n}: ảnh/video "${sc.media.src}" phải có trên máy dựng (tải lên trước).`);
if (sc.media && sc.media.src && !sc.media.credit && !sc.media.own && !sc.media.ai) warnings.push(`Cảnh ${n}: ảnh thiếu "credit" (nguồn ảnh).`);
});
const _oq = String(cfg.footer || '');
if ((cfg.geo || cfg.names) && !/openstreetmap/i.test(_oq)) warnings.push('Chân hình nên ghi "© OpenStreetMap contributors".');
if (!cfg.brand || !cfg.brand.channel) warnings.push('Thiếu tên kênh (brand.channel).');
const _ob = [...new Set(_o1b.flatMap(findForbidden))];
if (_ob.length) warnings.push('Phụ đề có từ nên tránh: ' + _ob.join(', ') + '.');
if (seconds > 180) warnings.push('Video dài hơn 3 phút.');
return { ok: !errors.length, errors, warnings, cfg: errors.length ? null : cfg, scenes: (cfg.scenes || []).length, seconds: Math.round(seconds) };
}
export async function engineCall(path, { method = 'GET', body, timeout = 8000, base = ENGINE_URL, fetchImpl, raw = false, headers } = {}) {
const _op = fetchImpl || (typeof fetch !== 'undefined' ? fetch : null);
if (!_op) throw Object.assign(new Error('Không gọi được máy dựng'), { code: 'OFFLINE' });
const _oh = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _o1c = _oh && timeout ? setTimeout(() => _oh.abort(), timeout) : null;
const _oz = { method, signal: _oh ? _oh.signal : undefined, headers: { ...(headers || {}) } };
if (body !== undefined) {
if (typeof body === 'string' || (typeof Blob !== 'undefined' && body instanceof Blob) || body instanceof ArrayBuffer) _oz.body = body;
else { _oz.body = JSON.stringify(body); _oz.headers['Content-Type'] = 'text/plain;charset=utf-8'; }
}
let _o16;
try { _o16 = await _op(base.replace(/\/$/, '') + path, _oz); }
catch (e) { throw Object.assign(new Error('Máy dựng chưa bật hoặc trình duyệt chặn kết nối tới 127.0.0.1'), { code: 'OFFLINE', cause: e }); }
finally { if (_o1c) clearTimeout(_o1c); }
if (raw) return _o16;
let _ok = null;
try { _ok = await _o16.json(); } catch { _ok = null; }
if (!_o16.ok || (_ok && _ok.ok === false)) {
const _om = (_ok && _ok.error) || {};
throw Object.assign(new Error(_om.message || ('Máy dựng trả lỗi ' + _o16.status)), { code: _om.code || 'ENGINE_' + _o16.status, status: _o16.status, eta_s: _om.eta_s });
}
return _ok;
}
export function engineState(health) {
if (!health) return { tone: 'warn', label: 'Chưa bật máy dựng', ready: false };
const _ox = [];
if (!health.ffmpeg && health.video_pack && health.video_pack.wanted === false) return { tone: 'info', label: 'Chưa cài Bộ công cụ dựng video', ready: false, pack: false };
if (!health.ffmpeg) _ox.push('ffmpeg');
if (_ox.length) return { tone: 'warn', label: 'Thiếu ' + _ox.join(', '), ready: false };
if (health.busy) return { tone: 'info', label: 'Đang dựng video', ready: true };
return { tone: 'success', label: 'Máy dựng sẵn sàng', ready: true };
}
export function osFamily(ua) {
const _o1e = String(ua || '');
if (/Windows/i.test(_o1e)) return 'windows';
if (/Mac OS X|Macintosh/i.test(_o1e) && !/iPhone|iPad/i.test(_o1e)) return 'mac';
if (/iPhone|iPad|Android/i.test(_o1e)) return 'mobile';
return 'other';
}
export const JOB_STATE = { queued: 'Đang xếp hàng', running: 'Đang dựng', done: 'Xong', error: 'Lỗi', waiting_approval: 'Chờ duyệt' };
export const jobLabel = _o19 => JOB_STATE[_o19] || _o19 || '';
export function fmtEta(sec) {
const _o19 = Math.max(0, Math.round(Number(sec) || 0));
if (_o19 < 60) return _o19 + ' giây';
return Math.round(_o19 / 60) + ' phút';
}
export const IDEA_TOPICS = [
'quy hoạch – hạ tầng khu vực đang bán (vành đai, metro, cầu, trục động lực)',
'dự án đang phân phối trong Bảng hàng (tiến độ, chính sách bán hàng)', 'khu đô thị lớn đang hình thành (hạ tầng, tiện ích, bàn giao)',
'dự án mới mở bán (pháp lý, điều kiện mua)', 'chính sách/thuế/phí ảnh hưởng nhà ở (chỉ giải thích chính sách)',
];
const _o0 = ['quy hoạch', 'vành đai', 'metro', 'đường sắt', 'cầu', 'sông hồng', 'chu dau tu mau a', 'du an mau', 'dự án mẫu', 'chu dau tu mau c', 'khu mau b',
'khu mau d', 'khu mau a', 'chu dau tu mau b', 'du an mau', 'phê duyệt', 'khởi công', 'thông xe', 'bảng giá đất', 'sáp nhập', 'phường'];
export function buildIdeasPrompt({ existing = [], count = 8, today } = {}) {
const _oi = today || new Date().toISOString().slice(0, 10);
return [
`Hôm nay ${_oi}. Gợi ý ${count} ý tưởng video dọc TikTok/Reels (60–90 giây) cho kênh BĐS "${CHANNEL}".`,
'Chủ đề ưu tiên: ' + IDEA_TOPICS.join('; ') + '.',
'Mỗi ý tưởng phải dựa trên tin/văn bản có thật, mới (ghi nguồn hoặc link nếu biết), có thể làm bằng video bản đồ quy hoạch hoặc video đi trong căn hộ.',
'Không giật tít, không hứa tăng giá, không khuyên đầu tư/vay, không so sánh lãi suất ngân hàng.',
existing.length ? 'Tránh trùng các ý tưởng đã có: ' + existing.slice(0, 30).map(_o19 => '"' + _o19 + '"').join(', ') + '.' : '',
'Trả về DUY NHẤT một mảng JSON, mỗi phần tử: {"title": "≤ 70 ký tự", "summary": "1–2 câu: nói gì, vì sao người xem quan tâm",' +
' "source": "tên báo/cơ quan", "url": "link hoặc rỗng", "kind": "map|flow|news", "score": 0-100}.',
].filter(Boolean).join('\n');
}
export function parseIdeas(text) {
let _o8 = null;
const _o19 = strip(text).trim();
const _ow = _o19.match(/```(?:json)?\s*([\s\S]*?)```/i);
const body = _ow ? _ow[1] : _o19;
try { _o8 = JSON.parse(body); } catch {
const _o4 = body.indexOf('['); const _oa = body.lastIndexOf(']');
if (_o4 >= 0 && _oa > _o4) { try { _o8 = JSON.parse(body.slice(_o4, _oa + 1)); } catch { _o8 = null; } }
}
if (_o8 && !Array.isArray(_o8) && Array.isArray(_o8.ideas)) _o8 = _o8.ideas;
if (!Array.isArray(_o8)) return [];
return _o8.filter(x => x && x.title).map(x => ({
title: _of(x.title).slice(0, 120), summary: _of(x.summary || ''), source: _of(x.source || ''),
url: /^https?:\/\//.test(String(x.url || '')) ? String(x.url) : '', kind: ['map', 'flow', 'news'].includes(x.kind) ? x.kind : 'map',
ai_score: Math.max(0, Math.min(100, Number(x.score) || 0)),
}));
}
export function scoreIdea(idea, { existing = [] } = {}) {
const text = _ov([idea.title, idea.summary].join(' '));
let _o19 = 30;
const _or = _o0.filter(k => text.includes(k)).length;
_o19 += Math.min(30, _or * 10);
if (idea.url) _o19 += 10;
if (idea.source) _o19 += 5;
if (/\b20\d\d\b|tháng|\d+\/\d+/.test(text)) _o19 += 5;
if (findForbidden(text).length) _o19 -= 40;
const t = _ov(idea.title);
if (existing.some(e => _ov(e) === t)) _o19 -= 50;
if (Number(idea.ai_score)) _o19 = Math.round(_o19 * 0.5 + Number(idea.ai_score) * 0.5);
return Math.max(0, Math.min(100, Math.round(_o19)));
}
export function titleFromUrl(url) {
try {
const _o1e = new URL(url);
const _o1a = decodeURIComponent(_o1e.pathname.split('/').filter(Boolean).pop() || _o1e.hostname)
.replace(/\.(html?|aspx?|php)$/i, '').replace(/-?\d{5,}.*$/, '').replace(/[-_]+/g, ' ').trim();
return _o1a ? _o1a.charAt(0).toUpperCase() + _o1a.slice(1) : _o1e.hostname;
} catch { return ''; }
}
export function planSchedule(ideas, { start, perDay = 1, days = 30, skip = [] } = {}) {
const _oj = start ? new Date(start + 'T00:00:00') : new Date();
const ymd = _oi => _oi.getFullYear() + '-' + String(_oi.getMonth() + 1).padStart(2, '0') + '-' + String(_oi.getDate()).padStart(2, '0');
const _o1f = {};
for (const i of ideas || []) { const _o11 = i.plan_date; if (_o11) _o1f[_o11] = (_o1f[_o11] || 0) + 1; }
const _o10 = {};
const _o1d = (ideas || []).filter(i => i.status === 'approved' && !i.plan_date).sort((_o4, _oa) => (Number(_oa.score) || 0) - (Number(_o4.score) || 0));
let k = 0;
for (let i = 0; i < days && k < _o1d.length; i++) {
const _oi = new Date(_oj); _oi.setDate(_oj.getDate() + i);
const _ot = ymd(_oi);
if (skip.includes(_oi.getDay())) continue;
while ((_o1f[_ot] || 0) < perDay && k < _o1d.length) { _o10[_o1d[k].id] = _ot; _o1f[_ot] = (_o1f[_ot] || 0) + 1; k++; }
}
return _o10;
}
export function parseData(_o19) {
if (_o19 && typeof _o19 === 'object') return _o19;
try { return JSON.parse(_o19 || '{}') || {}; } catch { return {}; }
}

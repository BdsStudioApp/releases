export const GEMINI_URL = 'https://gemini.google.com/app';
export const FLOW_URL = 'https://labs.google/fx/tools/flow';
export const MAX_IMAGE_PX = 2048;
export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const DRIVE_FOLDER = 'BDS Studio – Nhân vật';
export const LAW_WARNING = 'Không dùng mặt người nổi tiếng/người khác khi chưa đồng ý – vi phạm pháp luật về quyền hình ảnh (Điều 32 Bộ luật Dân sự 2015).';
export const AI_LABEL_REMINDER = 'Khi đăng, tự bật nhãn nội dung AI trên mạng xã hội.';
export const VBEE_VOICES = [
{ code: 'hn_male_manhdung_news_48k-fhg', label: 'Mạnh Dũng – nam Hà Nội, đọc tin', gender: 'male', styles: ['expert', 'luxury'], verified: true },
{ code: 'hn_male_phuthang_stor80dt_48k-fhg', label: 'Phú Thắng – nam Hà Nội, kể chuyện ấm', gender: 'male', styles: ['friendly', 'youthful'], verified: false },
{ code: 'sg_male_minhhoang_full_48k-fhg', label: 'Minh Hoàng – nam Sài Gòn, trẻ', gender: 'male', styles: ['youthful'], verified: false },
{ code: 'hn_female_ngochuyen_full_48k-fhg', label: 'Ngọc Huyền – nữ Hà Nội, rõ ràng', gender: 'female', styles: ['expert', 'luxury'], verified: false },
{ code: 'hn_female_maiphuong_vdts_48k-fhg', label: 'Mai Phương – nữ Hà Nội, nhẹ nhàng', gender: 'female', styles: ['friendly', 'luxury'], verified: false },
{ code: 'sg_female_thaotrinh_full_48k-fhg', label: 'Thảo Trinh – nữ Sài Gòn, trẻ trung', gender: 'female', styles: ['youthful', 'friendly'], verified: false },
];
export const DEFAULT_VOICE = { male: 'hn_male_manhdung_news_48k-fhg', female: 'hn_female_ngochuyen_full_48k-fhg' };
export function suggestVoice({ gender = 'male', style } = {}, voices = VBEE_VOICES) {
const _o6 = gender === 'female' ? 'female' : 'male';
const _od = voices.filter(_oj => _oj.gender === _o6);
const _o8 = _od.find(_oj => _oj.verified && (_oj.styles || []).includes(style)) || _od.find(_oj => (_oj.styles || []).includes(style));
return (_o8 && _o8.code) || DEFAULT_VOICE[_o6];
}
export const voiceLabel = (code, voices = VBEE_VOICES) => { const _oj = voices.find(_ol => _ol.code === code); return _oj ? _oj.label : (code || ''); };
export const GENDERS = { male: { vi: 'Nam', en: 'man', shoes: 'polished dark leather oxford shoes', face: 'clean-shaven' },
female: { vi: 'Nữ', en: 'woman', shoes: 'low-heeled closed-toe nude pumps', face: 'light natural makeup' } };
export const AGES = { '25-30': { vi: '25–30', n: 28 }, '30-35': { vi: '30–35', n: 32 }, '35-45': { vi: '35–45', n: 40 }, '45-55': { vi: '45–55', n: 50 } };
export const BUILDS = { slim: { vi: 'Thon gọn', en: 'slim build' }, average: { vi: 'Cân đối', en: 'medium, well-proportioned build' },
athletic: { vi: 'Săn chắc', en: 'fit, athletic build' }, sturdy: { vi: 'Đậm người', en: 'solid, broad-shouldered build' } };
export const STYLES = { luxury: { vi: 'Sang trọng', en: 'refined, elegant and quietly confident' }, youthful: { vi: 'Trẻ trung', en: 'fresh, energetic and approachable' },
expert: { vi: 'Chuyên gia', en: 'composed, knowledgeable and trustworthy' }, friendly: { vi: 'Thân thiện', en: 'warm, friendly and easy-going' } };
export const OUTFITS = {
vest: { vi: 'Vest (bộ suit)', en: 'a tailored two-piece suit with a single-breasted jacket and matching trousers over a crisp white shirt' },
ao_dai: { vi: 'Áo dài', en: 'a traditional Vietnamese ao dai (long fitted silk tunic over loose silk trousers)' },
somi: { vi: 'Sơ mi + quần tây', en: 'a crisp long-sleeved shirt neatly tucked into slim tailored trousers with a thin belt' },
blazer: { vi: 'Blazer + áo len mỏng', en: 'an unstructured blazer over a fine-knit top with tailored trousers' },
dam: { vi: 'Đầm công sở', en: 'a knee-length tailored sheath dress with a matching cropped blazer' },
polo: { vi: 'Polo + chinos', en: 'a smart knit polo shirt with slim chino trousers' },
};
export const COLORS = {
navy_gold: { vi: 'Xanh than + điểm vàng', en: 'deep navy blue with subtle muted-gold accents' },
navy_white: { vi: 'Xanh than + trắng', en: 'deep navy blue paired with clean white' },
ivory_gold: { vi: 'Kem ngà + vàng', en: 'warm ivory cream with subtle muted-gold accents' },
charcoal_gold: { vi: 'Xám than + vàng', en: 'charcoal grey with subtle muted-gold accents' },
champagne: { vi: 'Vàng champagne nhạt', en: 'soft champagne beige with deep navy details' },
white_navy: { vi: 'Trắng + viền xanh than', en: 'clean white with deep navy trim' },
};
export const HAIRS = {
male: {
side_part: { vi: 'Ngắn rẽ ngôi', en: 'short, neatly side-parted black hair' },
textured: { vi: 'Ngắn tỉa gọn hai bên', en: 'short textured black hair with tapered sides' },
slick_back: { vi: 'Vuốt ngược', en: 'medium-length black hair combed back neatly' },
crop: { vi: 'Cắt sát', en: 'very short cropped black hair' },
},
female: {
long_straight: { vi: 'Dài thẳng', en: 'long straight black hair falling just past the shoulders' },
bob: { vi: 'Bob ngang cằm', en: 'a sleek chin-length black bob' },
low_bun: { vi: 'Búi thấp', en: 'black hair pulled back into a neat low bun' },
soft_wave: { vi: 'Uốn sóng nhẹ ngang vai', en: 'shoulder-length softly waved dark brown hair' },
},
};
export const ACCESSORIES = {
watch: { vi: 'Đồng hồ mặt trơn', en: 'a slim minimalist wristwatch with a plain dial' },
glasses: { vi: 'Kính gọng mảnh', en: 'thin metal-frame eyeglasses' },
pearl: { vi: 'Hoa tai ngọc trai', en: 'small pearl stud earrings' },
pocket: { vi: 'Khăn cài túi áo', en: 'a neatly folded pocket square' },
pin: { vi: 'Ghim cài áo vàng', en: 'a small plain gold lapel pin' },
folder: { vi: 'Cầm bìa hồ sơ', en: 'carrying a plain dark leather document folder' },
};
export const VIEWS = { front: 'Chính diện', left45: 'Nghiêng trái 45°', right45: 'Nghiêng phải 45°', half: 'Nửa người', full: 'Toàn thân' };
export const KINDS = { ai: 'Nhân vật AI', real: 'Người thật' };
export const DEFAULT_SPEC = { gender: 'male', age: '35-45', build: 'average', style: 'expert', outfit: 'vest', color: 'navy_gold', hair: 'side_part', accessories: ['watch'], extra: '' };
export const PRESETS = [
{ id: 'p_khang', name: 'Minh Khang', spec: { gender: 'male', age: '35-45', build: 'athletic', style: 'expert', outfit: 'vest', color: 'navy_gold', hair: 'side_part', accessories: ['watch', 'pin'] }, note: 'Chuyên gia tư vấn cao cấp, vest xanh than.' },
{ id: 'p_linh', name: 'Thảo Linh', spec: { gender: 'female', age: '30-35', build: 'slim', style: 'luxury', outfit: 'ao_dai', color: 'ivory_gold', hair: 'long_straight', accessories: ['pearl'] }, note: 'Áo dài kem ngà, hợp dự án hàng hiệu.' },
{ id: 'p_quan', name: 'Đức Quân', spec: { gender: 'male', age: '25-30', build: 'slim', style: 'youthful', outfit: 'somi', color: 'navy_white', hair: 'textured', accessories: ['watch'] }, note: 'Trẻ trung, sơ mi – hợp căn 1–2 phòng ngủ.' },
{ id: 'p_ha', name: 'Ngọc Hà', spec: { gender: 'female', age: '35-45', build: 'average', style: 'expert', outfit: 'dam', color: 'navy_gold', hair: 'low_bun', accessories: ['watch', 'folder'] }, note: 'Chuyên gia tài chính nhà ở, đầm công sở.' },
{ id: 'p_son', name: 'Hoàng Sơn', spec: { gender: 'male', age: '45-55', build: 'sturdy', style: 'luxury', outfit: 'vest', color: 'charcoal_gold', hair: 'slick_back', accessories: ['pocket', 'watch'] }, note: 'Lịch lãm, hợp biệt thự/penthouse.' },
{ id: 'p_an', name: 'Bảo An', spec: { gender: 'female', age: '25-30', build: 'slim', style: 'friendly', outfit: 'blazer', color: 'champagne', hair: 'soft_wave', accessories: ['glasses'] }, note: 'Thân thiện, gần gũi – hợp video giới thiệu căn.' },
];
export const BANNED_NAMES = [
'Sơn Tùng', 'Son Tung M-TP', 'Mỹ Tâm', 'Hồ Ngọc Hà', 'Trấn Thành', 'Hà Anh Tuấn', 'Đen Vâu', 'Ngô Thanh Vân', 'Tóc Tiên', 'Hoài Linh', 'Chi Pu',
'Ninh Dương Lan Ngọc', 'Kỳ Duyên', "H'Hen Niê", 'Phạm Nhật Vượng', 'Đàm Vĩnh Hưng', 'Noo Phước Thịnh', 'Isaac', 'Hari Won', 'Thủy Tiên', 'Công Vinh',
'Taylor Swift', 'Tom Cruise', 'Brad Pitt', 'Leonardo DiCaprio', 'Keanu Reeves', 'Elon Musk', 'Jennie Kim', 'Lisa Manobal', 'Jisoo', 'Song Hye Kyo',
'Hyun Bin', 'Lee Min Ho', 'Jack Ma', 'Donald Trump', 'Barack Obama', 'Scarlett Johansson', 'Angelina Jolie', 'Jackie Chan', 'Lưu Diệc Phi', 'Tom Hanks',
'Johnny Depp', 'Henry Cavill', 'Gal Gadot', 'Zendaya', 'Beyoncé', 'Rihanna', 'Bill Gates', 'Mark Zuckerberg', 'Jeff Bezos', 'Cristiano Ronaldo', 'Messi',
];
export const BANNED_BRANDS = [
'Gucci', 'Louis Vuitton', 'Chanel', 'Rolex', 'Hermès', 'Hermes', 'Prada', 'Dior', 'Versace', 'Burberry', 'Cartier', 'Patek Philippe', 'Armani',
'Balenciaga', 'Nike', 'Adidas', 'Zara', 'Uniqlo', 'Tiffany', 'Bvlgari', 'Bulgari', 'Montblanc', 'Ray-Ban', 'Hublot', 'Omega watch', 'Audemars Piguet',
'Mercedes', 'BMW', 'Porsche', 'Lexus', 'iPhone', 'MacBook', 'Apple Watch', 'Samsung', 'Vinhomes', 'Vingroup', 'Masterise', 'Sun Group', 'Ecopark',
];
export const BANNED_PHRASES = ['looks like', 'look like', 'lookalike', 'look-alike', 'resembling', 'resembles', 'similar to', 'in the style of', 'giống', 'trông như'];
export const BANNED = [...BANNED_NAMES, ...BANNED_BRANDS];
const _oe = _oi => String(_oi ?? '').normalize('NFC');
const fold = _oi => _oe(_oi).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
const _o4 = _oi => _oi.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const B = '(^|[^\\p{L}\\p{N}])';
const _o0 = '(?=$|[^\\p{L}\\p{N}])';
export function findBanned(text) {
const t = fold(text);
return [...BANNED, ...BANNED_PHRASES].filter(_ok => new RegExp(B + _o4(fold(_ok)) + _o0, 'u').test(t));
}
export function stripBanned(text) {
let _oi = _oe(text);
for (const _ok of [...BANNED_PHRASES, ...BANNED]) {
const _oh = new RegExp(B + _o4(fold(_ok)) + _o0, 'gu');
for (;;) {
const _o5 = fold(_oi);
_oh.lastIndex = 0;
const _oc = _oh.exec(_o5);
if (!_oc || _o5.length !== _oi.length) break;
const start = _oc.index + _oc[1].length;
_oi = _oi.slice(0, start) + _oi.slice(start + _oc[0].length - _oc[1].length);
}
}
return _oi.replace(/\s{2,}/g, ' ').replace(/\s+([,.;:])/g, '$1').replace(/([,;:])\s*(?=[,;:.]|$)/g, '').replace(/^[\s,;:.]+|[\s,;:]+$/g, '').trim();
}
const _og = (obj, k, fb) => (k && Object.prototype.hasOwnProperty.call(obj, k) ? k : fb);
export function normalizeSpec(spec = {}) {
const gender = _og(GENDERS, spec.gender, DEFAULT_SPEC.gender);
const _o7 = HAIRS[gender];
const _o2 = (Array.isArray(spec.accessories) ? spec.accessories : String(spec.accessories || '').split(','))
.map(_ol => String(_ol).trim()).filter(_ol => ACCESSORIES[_ol]);
return {
gender,
age: _og(AGES, spec.age, DEFAULT_SPEC.age),
build: _og(BUILDS, spec.build, DEFAULT_SPEC.build),
style: _og(STYLES, spec.style, DEFAULT_SPEC.style),
outfit: _og(OUTFITS, spec.outfit, gender === 'female' ? 'dam' : DEFAULT_SPEC.outfit),
color: _og(COLORS, spec.color, DEFAULT_SPEC.color),
hair: _og(_o7, spec.hair, Object.keys(_o7)[0]),
accessories: [...new Set(_o2)].sort((_o1, b) => Object.keys(ACCESSORIES).indexOf(_o1) - Object.keys(ACCESSORIES).indexOf(b)),
extra: stripBanned(String(spec.extra || '').replace(/\s+/g, ' ')).replace(/[.]+$/, '').slice(0, 300),
};
}
export function buildLockEn(specIn = {}, { real = false } = {}) {
const _oi = normalizeSpec(specIn);
const G = GENDERS[_oi.gender]; const age = AGES[_oi.age].n;
const face = [
'an oval face with warm medium-tan skin, dark brown almond-shaped eyes and natural straight eyebrows',
G.face,
age >= 45 ? 'a few soft smile lines around the eyes' : 'smooth, healthy skin texture',
].join(', ');
let hair = HAIRS[_oi.gender][_oi.hair].en;
if (age >= 45 && _oi.gender === 'male') hair += ' with a few grey strands at the temples';
const _o2 = _oi.accessories.length ? _oi.accessories.map(_o1 => ACCESSORIES[_o1].en).join(', ') : 'no accessories';
const _of = [
`A ${age}-year-old Vietnamese ${G.en} with Southeast Asian features`,
face,
hair,
`${BUILDS[_oi.build].en}, average height`,
`wearing ${OUTFITS[_oi.outfit].en}, colour palette ${COLORS[_oi.color].en}, with ${G.shoes}`,
`accessories: ${_o2}`,
_oi.extra ? `details: ${_oi.extra}` : '',
`${STYLES[_oi.style].en} demeanour, relaxed upright posture and a natural, closed-mouth smile`,
real ? 'face, identity and body proportions must match the reference photos exactly, no beautification, no face changes' : '',
'no logos or brand marks on clothing or accessories',
].filter(Boolean);
return _of.join('; ') + '.';
}
export function buildPortraitPrompt(lockEn, { name } = {}) {
const _ob = _oe(lockEn).trim();
return [
'Create a photorealistic CHARACTER REFERENCE SHEET of ONE fictional person (not a real, famous or existing person), to be used as a consistent reference for AI video generation.',
`CHARACTER${name ? ` ("${stripBanned(name)}")` : ''}: ${_ob}`,
'VIEWS (same person, same outfit, same lighting in every view): (1) front view, head and shoulders, looking at the camera; (2) three-quarter view, head and body turned 45 degrees; (3) full-body standing view from head to toe, shoes visible.',
'BACKGROUND: plain seamless light warm-grey studio backdrop, no props, no furniture.',
'LIGHT & CAMERA: soft, even studio lighting (large softbox key light with gentle fill), true-to-life skin tones and natural skin texture, sharp focus, 85mm portrait lens look, eye-level camera.',
'OUTPUT: two images – one vertical 9:16 and one square 1:1 – with the identical person, face, hairstyle, outfit and lighting in both.',
'AVOID: no text, no labels, no captions, no logos, no brand marks, no watermark, no sunglasses, no hat, no extra people, no distorted hands or face, no heavy retouching.',
].join('\n');
}
export function parseJson(_oj, fb) {
if (_oj && typeof _oj === 'object') return _oj;
try { const _ol = JSON.parse(_oj || ''); return _ol ?? fb; } catch { return fb; }
}
export const parseImages = _oj => { const _o1 = parseJson(_oj, []); return Array.isArray(_o1) ? _o1.filter(_ol => _ol && typeof _ol === 'object') : []; };
export const parseConsent = _oj => { const c = parseJson(_oj, null); return c && typeof c === 'object' && !Array.isArray(c) ? c : null; };
const _oa = _oi => /^\d{4}-\d{2}-\d{2}$/.test(String(_oi || '')) && !Number.isNaN(Date.parse(_oi + 'T00:00:00Z'));
export function consentOk(c, { today } = {}) {
const _ol = parseConsent(c);
if (!_ol) return false;
if (!_ol.owner_is_subject && !_ol.written_consent) return false;
if (!_oa(_ol.signed_at)) return false;
if (today && _oa(today) && _ol.signed_at > today) return false;
return true;
}
export function validateCharacter(c = {}, { today } = {}) {
const errors = [];
if (!_oe(c.name).trim()) errors.push('Nhập tên nhân vật.');
if (!KINDS[c.kind]) errors.push('Chọn loại nhân vật (AI hoặc Người thật).');
if (!_oe(c.lock_en).trim()) errors.push('Thiếu mô tả khoá nhân vật (lock_en).');
const _o3 = findBanned([c.name, c.lock_en].join(' '));
if (_o3.length) errors.push('Bỏ tên người nổi tiếng/thương hiệu: ' + _o3.join(', ') + '.');
if (c.kind === 'real' && !consentOk(c.consent, { today })) {
errors.push('Chưa lưu: nhân vật mặt thật cần tick một ô xác nhận đồng ý và ghi ngày đồng ý (quyền hình ảnh – Điều 32 BLDS 2015).');
}
return { ok: !errors.length, errors };
}
export function toRow(c = {}) {
const images = parseImages(c.images).map(i => ({ drive_id: i.drive_id || '', url: i.url || '', view: VIEWS[i.view] ? i.view : 'front', ...(i.local ? { local: i.local } : {}), ...(i.pending ? { pending: true } : {}) }));
const consent = c.kind === 'real' ? parseConsent(c.consent) : null;
return {
id: c.id, name: _oe(c.name).trim(), kind: c.kind === 'real' ? 'real' : 'ai',
gender: GENDERS[c.gender] ? c.gender : '', age_range: AGES[c.age_range] ? c.age_range : '', style: STYLES[c.style] ? c.style : '',
outfit: OUTFITS[c.outfit] ? c.outfit : '', lock_en: _oe(c.lock_en).trim(), voice: String(c.voice || '').trim(),
images: JSON.stringify(images), consent: consent ? JSON.stringify(consent) : '',
notes: typeof c.notes === 'string' ? c.notes : JSON.stringify(c.notes || {}), created_by: c.created_by || '', deleted: Number(c.deleted) ? 1 : 0,
};
}
export function mainImage(c) {
const _o9 = parseImages(c && c.images);
return _o9.find(i => i.view === 'front') || _o9[0] || null;
}
export const pendingImages = c => parseImages(c && c.images).filter(i => i.pending);
export function forFlow(c) {
if (!c) return null;
return { id: c.id, name: _oe(c.name).trim(), lock_en: _oe(c.lock_en).trim(), voice: c.voice || '', has_photo: parseImages(c.images).length > 0 };
}
export function fitSize(_ok, h, max = MAX_IMAGE_PX) {
_ok = Math.max(1, Math.round(Number(_ok) || 1)); h = Math.max(1, Math.round(Number(h) || 1));
const k = Math.min(1, max / Math.max(_ok, h));
return { width: Math.max(1, Math.round(_ok * k)), height: Math.max(1, Math.round(h * k)) };
}
export function isNotSupported(e) {
const code = e && (e.code || (e.error && e.error.code));
return code === 'BAD_INPUT' || code === 'NOT_FOUND' || code === 'NETWORK' || code === 'INTERNAL' || code === 'NOT_SETUP';
}
export function initials(name) {
const _ok = _oe(name).trim().split(/\s+/).filter(Boolean);
return ((_ok.length > 1 ? _ok[_ok.length - 2][0] : '') + (_ok.length ? _ok[_ok.length - 1][0] : '?')).toUpperCase();
}
export function specFromCharacter(c = {}) {
const n = parseJson(c.notes, {});
return normalizeSpec({ ...(n.spec || {}), gender: c.gender || (n.spec || {}).gender, age: c.age_range || (n.spec || {}).age, style: c.style || (n.spec || {}).style, outfit: c.outfit || (n.spec || {}).outfit });
}

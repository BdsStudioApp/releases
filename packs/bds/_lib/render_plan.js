export const SHOTSTACK_DOCS = 'https://shotstack.io/docs/api/';
export const SIZES = { vertical: { width: 1080, height: 1920 }, horizontal: { width: 1920, height: 1080 } };
export const DEFAULT_BRAND = { bg: '#0E2A3B', primary: '#C8A15A', accent: '#3FB6C9', text: '#FFFFFF' };
export const EFFECTS = ['zoomIn', 'zoomInSlow', 'zoomInFast', 'zoomOut', 'zoomOutSlow', 'zoomOutFast', 'slideLeft', 'slideLeftSlow', 'slideLeftFast', 'slideRight',
'slideRightSlow', 'slideRightFast', 'slideUp', 'slideUpSlow', 'slideUpFast', 'slideDown', 'slideDownSlow', 'slideDownFast'];
export const TRANSITIONS = ['none', 'fade', 'fadeSlow', 'fadeFast', 'reveal', 'revealSlow', 'revealFast', 'wipeLeft', 'wipeLeftSlow', 'wipeLeftFast', 'wipeRight',
'wipeRightSlow', 'wipeRightFast', 'slideLeft', 'slideLeftSlow', 'slideLeftFast', 'slideRight', 'slideRightSlow', 'slideRightFast', 'slideUp', 'slideUpSlow',
'slideUpFast', 'slideDown', 'slideDownSlow', 'slideDownFast', 'zoom'];
export const FITS = ['cover', 'contain', 'crop', 'none'];
export const FORMATS = ['mp4', 'gif', 'mp3', 'jpg', 'png', 'bmp'];
export const FPS = [12, 15, 23.976, 24, 25, 29.97, 30, 48, 50, 59.94, 60];
export const ASSET_TYPES = ['video', 'image', 'text', 'rich-text', 'audio', 'luma', 'caption', 'rich-caption', 'html', 'html5', 'title', 'shape', 'svg'];
const _o1 = new Set(['video', 'image', 'audio', 'luma']);
const _o10 = (x) => Math.round(x * 100) / 100;
const clamp = (x, a, _o5) => Math.max(a, Math.min(_o5, x));
const _o7 = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const _om = (c) => /^#[0-9a-f]{6}$/i.test(String(c || ''));
export const httpsUrl = (u) => { const s = String(u || '').trim(); try { return new URL(s).protocol === 'https:' ? s : ''; } catch { return ''; } };
export const words = (s) => _o7(s).split(' ').filter(Boolean).length;
const escXml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function sceneSeconds(s = {}) {
const set = Number(s.seconds);
if (Number.isFinite(set) && set > 0) return _o10(clamp(set, 1, 30));
const w = words(s.say || s.text);
if (s.kind === 'checklist') return _o10(clamp(w / 3.2 + 1.2, 4, 20));
if (s.kind === 'intro') return _o10(clamp(w / 3.75 + 0.6, 3, 4));
if (s.kind === 'outro') return _o10(clamp(w / 3.75 + 0.8, 3, 4.5));
return _o10(clamp(w / 3.75 + 0.6, 2.5, 4));
}
export function haversineKm(a, _o5) {
const R = 6371, rad = (_o9) => (_o9 * Math.PI) / 180;
const [la1, lo1, la2, lo2] = [a.lat, a.lon, _o5.lat, _o5.lon].map(rad);
const _o9 = Math.sin((la2 - la1) / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin((lo2 - lo1) / 2) ** 2;
return 2 * R * Math.asin(Math.sqrt(_o9));
}
export const kmText = (km) => '~' + (Math.round(km * 10) / 10).toFixed(1).replace('.', ',') + ' km';
const _oj = (p) => p && Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lon)) && Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180 && !(Number(p.lat) === 0 && Number(p.lon) === 0);
function _oq(lat, lon) {
const s = Math.sin((lat * Math.PI) / 180);
return { x: (lon + 180) / 360, y: 0.5 - Math.log((1 + s) / (1 - s)) / (4 * Math.PI) };
}
function _o1a(_oy, W, H, lat, minKm = 1.2) {
const km = 1 / (40075 * Math.cos((lat * Math.PI) / 180));
const xs = _oy.map((p) => p.x), ys = _oy.map((p) => p.y);
const w = Math.max(Math.max(...xs) - Math.min(...xs), km * minKm), h = Math.max(Math.max(...ys) - Math.min(...ys), km * minKm);
const s = Math.min((W * 0.7) / w, (H * 0.34) / h);
const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
return { cx, cy: cy + (H * 0.5 - H * 0.28) / s, s, km, W, H };
}
const _o16 = (v, p) => ({ x: v.W / 2 + (p.x - v.cx) * v.s, y: v.H / 2 + (p.y - v.cy) * v.s });
export function mapGeometry(scene, map, W, H) {
const P = map && map.project;
if (!_oj(P)) return null;
const pois = (map.pois || []).map((q, i) => ({ ...q, i, w: _oj(q) ? _oq(+q.lat, +q.lon) : null }));
const _oz = _oq(+P.lat, +P.lon);
const cur = scene.kind === 'poi' ? pois[scene.poi] : null;
let _oy = [_oz];
if (scene.kind === 'poi' && cur && cur.w) _oy = [_oz, cur.w];
if (scene.kind === 'outro') _oy = [_oz, ...pois.filter((q) => q.w).map((q) => q.w)];
const v = _o1a(_oy, W, H, +P.lat, scene.kind === 'intro' ? 6 : 1.2);
const shown = pois.filter((q) => q.w && (scene.kind === 'outro' || (scene.kind === 'poi' && q.i <= scene.poi)));
return { v, p: _o16(v, _oz), shown: shown.map((q) => ({ ...q, s: _o16(v, q.w) })), cur: cur && cur.w ? { ...cur, s: _o16(v, cur.w) } : null,
rings: [1, 3, 5, 10, 20, 30].map((k) => ({ k, r: k * v.km * v.s })).filter((x) => x.r > 40 && x.r < Math.max(W, H) * 1.4) };
}
const _o8 = (a, _o5) => {
const _or = (a.x + _o5.x) / 2, my = (a.y + _o5.y) / 2, nx = -(_o5.y - a.y), ny = _o5.x - a.x;
return { c: { x: _or + nx * 0.12, y: my + ny * 0.12 } };
};
const _oc = (n) => Math.round(n * 10) / 10;
export function mapSvgLayers(scene, map, W, H, brand = DEFAULT_BRAND) {
const _og = mapGeometry(scene, map, W, H);
if (!_og) return [];
const _ok = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
let _o13 = 1; while (_og.v.km * _o13 * _og.v.s < 90) _o13 *= 2;
const _oi = _og.v.km * _o13 * _og.v.s;
const grid = [];
for (let x = ((_og.p.x % _oi) + _oi) % _oi; x < W; x += _oi) grid.push(`M${_oc(x)} 0L${_oc(x)} ${H}`);
for (let y = ((_og.p.y % _oi) + _oi) % _oi; y < H; y += _oi) grid.push(`M0 ${_oc(y)}L${W} ${_oc(y)}`);
const out = [];
out.push({ id: 'grid', svg: _ok + `<path d="${grid.join('')}" fill="none" stroke="${brand.text}" stroke-width="1" opacity="0.08"/>` +
_og.rings.map((x) => `<circle cx="${_oc(_og.p.x)}" cy="${_oc(_og.p.y)}" r="${_oc(x.r)}" fill="none" stroke="${brand.primary}" stroke-width="2" opacity="0.35"/>`).join('') + '</svg>' });
if (_og.shown.length) {
out.push({ id: 'routes', svg: _ok + `<path d="${_og.shown.map((q) => { const { c } = _o8(_og.p, q.s); return `M${_oc(_og.p.x)} ${_oc(_og.p.y)}Q${_oc(c.x)} ${_oc(c.y)} ${_oc(q.s.x)} ${_oc(q.s.y)}`; }).join('')}" fill="none" stroke="${brand.primary}" stroke-width="8" opacity="0.95"/></svg>` });
out.push({ id: 'pins', svg: _ok + _og.shown.map((q) => `<circle cx="${_oc(q.s.x)}" cy="${_oc(q.s.y)}" r="${q === _og.cur || (_og.cur && q.i === _og.cur.i) ? 30 : 20}" fill="${brand.accent}"/>`).join('') + '</svg>' });
}
out.push({ id: 'project', svg: _ok + `<circle cx="${_oc(_og.p.x)}" cy="${_oc(_og.p.y)}" r="34" fill="${brand.primary}"/></svg>` });
return out;
}
function _o11(text, _ot = {}) {
const a = { type: 'rich-text', text: String(text).slice(0, 5000), font: { family: _ot.family || 'Open Sans', size: Math.round(_ot.size || 48), color: _ot.color || '#FFFFFF', weight: _ot.weight || 600 },
align: { horizontal: _ot.align || 'center', vertical: _ot.valign || 'middle' } };
if (_ot.bg) { a.background = { color: _ot.bg, opacity: _ot.bgOpacity ?? 0.88, borderRadius: 28 }; a.padding = 28; }
return a;
}
function _ox(asset, start, length, W, H, { cx = W / 2, cy = H / 2, w, h, transition, effect, opacity, fit } = {}) {
const c = { asset, start: _o10(start), length: _o10(length) };
if (fit) c.fit = fit;
if (w) c.width = Math.round(w);
if (h) c.height = Math.round(h);
c.position = 'center';
const _ov = _o10((cx - W / 2) / W * 1000) / 1000, oy = _o10(-(cy - H / 2) / H * 1000) / 1000;
if (_ov || oy) c.offset = { x: Math.round(_ov * 1000) / 1000, y: Math.round(oy * 1000) / 1000 };
if (transition) c.transition = transition;
if (effect) c.effect = effect;
if (opacity !== undefined) c.opacity = opacity;
return c;
}
const _o0 = { in: 'fade', out: 'fade' };
export function buildShotstackTimeline(scenes, options = {}) {
const { width: W, height: H } = SIZES[options.format === 'horizontal' ? 'horizontal' : 'vertical'];
const _o19 = H > W;
const _o5 = { ...DEFAULT_BRAND };
for (const k of Object.keys(DEFAULT_BRAND)) if (options.brand && _om(options.brand[k])) _o5[k] = options.brand[k];
const _od = _o7(options.font_family) || 'Open Sans';
const T = { sub: [], card: [], label: [], ppin: [], pin: [], route: [], grid: [], bg: [], audio: [], foot: [] };
const _oe = (n) => (_o19 ? n : n * 0.75);
const map = options.map || null;
let t = 0;
(scenes || []).forEach((s, idx) => {
const len = sceneSeconds(s);
const _oh = map && ['intro', 'poi', 'outro'].includes(s.kind) ? mapGeometry(s, map, W, H) : null;
const _ol = httpsUrl(s.image_url);
if (_ol) T.bg.push(_ox({ type: 'image', src: _ol }, t, len, W, H, { fit: 'cover', effect: idx % 2 ? 'zoomOutSlow' : 'zoomInSlow', transition: _o0, opacity: _oh ? 0.35 : 1 }));
if (_oh) {
const _oo = mapSvgLayers(s, map, W, H, _o5);
const _oa = s.kind === 'outro' ? 'zoomOutSlow' : 'zoomInSlow';
for (const L of _oo) {
const _o17 = L.id === 'grid' ? T.grid : L.id === 'routes' ? T.route : T.pin;
if (L.id === 'project') { T.ppin.push(_ox({ type: 'svg', src: L.svg }, t, len, W, H, { w: W, h: H, effect: _oa, transition: { in: 'fade' } })); continue; }
_o17.push(_ox({ type: 'svg', src: L.svg }, t, len, W, H, { w: W, h: H, effect: _oa, transition: idx === 0 ? { in: 'fade' } : undefined }));
}
}
const P = map && map.project;
if (s.kind === 'intro' && P) {
T.card.push(_ox(_o11([P.kicker || 'Vị trí & kết nối', P.name, P.address].filter(Boolean).join('\n'), { family: _od, size: _oe(62), bg: _o5.bg, color: _o5.text }), t, len, W, H,
{ cx: W / 2, cy: H * 0.56, w: W * 0.86, h: H * 0.2, transition: _o0 }));
} else if (s.kind === 'poi') {
const q = (map && map.pois && map.pois[s.poi]) || {};
const body = [q.name || s.title || s.text, s.dist_text || q.dist_text || '', q.line || s.line || ''].filter(Boolean).join('\n');
T.card.push(_ox(_o11(body, { family: _od, size: _oe(52), bg: _o5.bg, color: _o5.text }), t, len, W, H, { cx: W / 2, cy: H * 0.56, w: W * 0.86, h: H * 0.17, transition: { in: 'slideUp', out: 'fade' } }));
} else if (s.kind === 'checklist') {
const list = (s.list && s.list.length ? s.list : []).slice(0, 5);
T.card.push(_ox(_o11([s.text || s.title, ...list.map((x, i) => `${i + 1}. ${x}`)].filter(Boolean).join('\n'), { family: _od, size: _oe(50), bg: _o5.bg, color: _o5.text, align: 'left' }), t, len, W, H,
{ cx: W / 2, cy: H * 0.4, w: W * 0.86, h: H * 0.34, transition: _o0 }));
} else {
const _o6 = s.kind === 'hook' || s.kind === 'outro';
T.card.push(_ox(_o11(s.text || s.title || '', { family: _od, size: _oe(_o6 ? 76 : 60), weight: 700, bg: _o5.bg, color: _o6 ? _o5.primary : _o5.text }), t, len, W, H,
{ cx: W / 2, cy: H * (_oh ? 0.56 : 0.36), w: W * 0.86, h: H * (_o6 ? 0.22 : 0.18), transition: _o0 }));
}
if (_oh && P && s.kind !== 'intro') {
const _on = (P.short_name || P.name || '').slice(0, 24);
if (_on) T.label.push(_ox(_o11(_on, { family: _od, size: _oe(34), bg: _o5.bg, color: _o5.text }), t, len, W, H,
{ cx: clamp(_oh.p.x, W * 0.2, W * 0.8), cy: clamp(_oh.p.y - 80, H * 0.08, H * 0.5), w: W * 0.4, h: 90 }));
}
if (options.subtitles !== false && _o7(s.say)) {
T.sub.push(_ox(_o11(_o7(s.say), { family: _od, size: _oe(44), color: '#FFFFFF', bg: '#000000', bgOpacity: 0.55 }), t, len, W, H, { cx: W / 2, cy: H * (_o19 ? 0.65 : 0.86), w: W * 0.9, h: H * 0.09 }));
}
const _o4 = httpsUrl(s.audio_url);
if (_o4) T.audio.push({ asset: { type: 'audio', src: _o4, volume: 1 }, start: _o10(t), length: _o10(len) });
t += len;
});
const total = _o10(t);
const _o2 = map && (map.pois || []).some((q) => q.measure === 'chim_bay');
const _os = [_o7(options.footer), map ? _o7(map.map_note) || (_o2 ? 'Khoảng cách đường chim bay – bản đồ minh hoạ' : 'Bản đồ minh hoạ – vị trí tương đối') : ''].filter(Boolean).join(' · ');
if (_os && total > 0) T.foot.push(_ox(_o11(_os, { family: _od, size: _oe(26), weight: 400, color: _o5.text }), 0, total, W, H, { cx: W / 2, cy: H * 0.965, w: W * 0.92, h: 70 }));
const _ou = ['sub', 'foot', 'card', 'label', 'ppin', 'pin', 'route', 'grid', 'bg'];
const tracks = _ou.filter((k) => T[k].length).map((k) => ({ clips: T[k] }));
if (T.audio.length) tracks.push({ clips: T.audio });
const timeline = { background: _o5.bg, tracks };
const _o1b = httpsUrl(options.voice_url);
if (_o1b) timeline.soundtrack = { src: _o1b, volume: 1 };
const _of = httpsUrl(options.font_src);
if (_of) timeline.fonts = [{ src: _of }];
const fps = FPS.includes(Number(options.fps)) ? Number(options.fps) : 30;
return { timeline, output: { format: 'mp4', size: { width: W, height: H }, fps } };
}
export function timelineSeconds(edit) {
let _ob = 0;
for (const tr of (edit && edit.timeline && edit.timeline.tracks) || []) for (const c of tr.clips || []) _ob = Math.max(_ob, Number(c.start) + Number(c.length));
return _o10(_ob);
}
export function validateEdit(edit) {
const out = [];
if (!edit || typeof edit !== 'object') return ['Thiếu bản dựng'];
const _ot = edit.output;
if (!_ot) out.push('Thiếu output (định dạng video)');
else {
if (!FORMATS.includes(_ot.format)) out.push('output.format không hợp lệ');
if (_ot.size) {
for (const k of ['width', 'height']) {
const n = _ot.size[k];
if (!Number.isInteger(n) || n < 2 || n > 4096) out.push(`output.size.${k} phải là số nguyên 2–4096`);
else if (n % 2) out.push(`output.size.${k} phải chia hết cho 2`);
}
if (_ot.resolution || _ot.aspectRatio) out.push('Có size riêng thì bỏ resolution/aspectRatio');
}
if (_ot.fps !== undefined && !FPS.includes(_ot.fps)) out.push('output.fps không hợp lệ');
}
const _o15 = edit.timeline;
if (!_o15 || !Array.isArray(_o15.tracks) || !_o15.tracks.length) { out.push('timeline.tracks trống'); return out; }
if (_o15.background !== undefined && !_om(_o15.background)) out.push('timeline.background phải là mã màu #rrggbb');
if (_o15.soundtrack && !httpsUrl(_o15.soundtrack.src)) out.push('soundtrack.src phải là link https công khai');
_o15.tracks.forEach((tr, ti) => {
const clips = (tr && tr.clips) || [];
if (!clips.length) out.push(`Track ${ti + 1} không có clip`);
clips.forEach((c, ci) => {
const _o3 = `Track ${ti + 1} clip ${ci + 1}`;
if (!c.asset || !ASSET_TYPES.includes(c.asset.type)) out.push(_o3 + ': asset.type không hợp lệ');
else if (_o1.has(c.asset.type) && !httpsUrl(c.asset.src)) out.push(_o3 + ': src phải là link https công khai');
else if (c.asset.type === 'svg' && !/^<svg[\s>]/.test(String(c.asset.src || ''))) out.push(_o3 + ': svg cần mã <svg>');
else if ((c.asset.type === 'rich-text' || c.asset.type === 'text') && !_o7(c.asset.text)) out.push(_o3 + ': chữ trống');
if (!(Number.isFinite(c.start) && c.start >= 0)) out.push(_o3 + ': start phải là số giây ≥ 0');
if (!(Number.isFinite(c.length) && c.length > 0)) out.push(_o3 + ': length phải > 0');
if (c.effect !== undefined && !EFFECTS.includes(c.effect)) out.push(_o3 + ': effect "' + c.effect + '" không có');
if (c.transition) for (const k of ['in', 'out']) if (c.transition[k] !== undefined && !TRANSITIONS.includes(c.transition[k])) out.push(_o3 + ': transition.' + k + ' "' + c.transition[k] + '" không có');
if (c.fit !== undefined && !FITS.includes(c.fit)) out.push(_o3 + ': fit không hợp lệ');
if (c.offset) for (const k of ['x', 'y']) if (c.offset[k] !== undefined && !(c.offset[k] >= -10 && c.offset[k] <= 10)) out.push(_o3 + ': offset.' + k + ' ngoài -10..10');
});
const s = [...clips].filter((c) => Number.isFinite(c.start) && Number.isFinite(c.length)).sort((a, _o5) => a.start - _o5.start);
for (let i = 1; i < s.length; i++) if (s[i].start < s[i - 1].start + s[i - 1].length - 1e-6) { out.push(`Track ${ti + 1}: clip chồng nhau (${s[i - 1].start}s và ${s[i].start}s)`); break; }
});
return out;
}
function wrapText(_og, text, maxW) {
const out = [];
for (const _ow of String(text || '').split('\n')) {
let cur = '';
for (const w of _ow.split(/\s+/).filter(Boolean)) {
const _o18 = cur ? cur + ' ' + w : w;
if (cur && Number((_og.measureText(_o18) || {}).width || 0) > maxW) { out.push(cur); cur = w; } else cur = _o18;
}
if (cur) out.push(cur);
}
return out;
}
export function drawSceneCanvas(_og, scene = {}, { map = null, brand = {}, width = 270, height = 480 } = {}) {
const _o5 = { ...DEFAULT_BRAND };
for (const k of Object.keys(DEFAULT_BRAND)) if (_om(brand[k])) _o5[k] = brand[k];
const W = width, H = height, k = W / (H > W ? 1080 : 1920);
_og.fillStyle = _o5.bg; _og.fillRect(0, 0, W, H);
const _oh = map && ['intro', 'poi', 'outro'].includes(scene.kind) ? mapGeometry(scene, map, W, H) : null;
if (_oh) {
let _o13 = 1; while (_oh.v.km * _o13 * _oh.v.s < 22) _o13 *= 2;
const _oi = _oh.v.km * _o13 * _oh.v.s;
_og.strokeStyle = 'rgba(255,255,255,0.08)'; _og.lineWidth = 1; _og.beginPath();
for (let x = ((_oh.p.x % _oi) + _oi) % _oi; x < W; x += _oi) { _og.moveTo(x, 0); _og.lineTo(x, H); }
for (let y = ((_oh.p.y % _oi) + _oi) % _oi; y < H; y += _oi) { _og.moveTo(0, y); _og.lineTo(W, y); }
_og.stroke();
_og.strokeStyle = _o5.primary; _og.globalAlpha = 0.35;
for (const r of _oh.rings) { _og.beginPath(); _og.arc(_oh.p.x, _oh.p.y, r.r, 0, Math.PI * 2); _og.stroke(); }
_og.globalAlpha = 1; _og.lineWidth = Math.max(2, 8 * k);
for (const q of _oh.shown) { const { c } = _o8(_oh.p, q.s); _og.beginPath(); _og.moveTo(_oh.p.x, _oh.p.y); _og.quadraticCurveTo(c.x, c.y, q.s.x, q.s.y); _og.lineTo(q.s.x, q.s.y); _og.stroke(); }
_og.fillStyle = _o5.accent;
for (const q of _oh.shown) { _og.beginPath(); _og.arc(q.s.x, q.s.y, (_oh.cur && q.i === _oh.cur.i ? 30 : 20) * k, 0, Math.PI * 2); _og.fill(); }
_og.fillStyle = _o5.primary; _og.beginPath(); _og.arc(_oh.p.x, _oh.p.y, 34 * k, 0, Math.PI * 2); _og.fill();
_og.font = `600 ${Math.round(28 * k)}px sans-serif`; _og.fillStyle = _o5.text; _og.textAlign = 'center';
for (const q of _oh.shown) _og.fillText(String(q.dist_text || '').trim() || q.name, q.s.x, q.s.y - 34 * k);
}
const q = scene.kind === 'poi' && map && map.pois ? map.pois[scene.poi] || {} : {};
const P = map && map.project;
const body = scene.kind === 'intro' && P ? [P.name, P.address].filter(Boolean).join('\n')
: scene.kind === 'poi' ? [q.name || scene.title, scene.dist_text || q.dist_text, q.line].filter(Boolean).join('\n')
: [scene.text || scene.title, ...(scene.kind === 'checklist' ? (scene.list || []).map((x, i) => `${i + 1}. ${x}`) : [])].filter(Boolean).join('\n');
const size = Math.round((scene.kind === 'hook' ? 66 : 50) * k);
_og.font = `700 ${size}px sans-serif`;
const _op = wrapText(_og, body, W * 0.8);
const cy = H * (_oh ? 0.56 : 0.38), lh = size * 1.25, top = cy - (_op.length * lh) / 2;
_og.globalAlpha = 0.88; _og.fillStyle = '#000000'; _og.fillRect(W * 0.06, top - lh * 0.6, W * 0.88, _op.length * lh + lh * 0.5); _og.globalAlpha = 1;
_og.fillStyle = scene.kind === 'hook' ? _o5.primary : _o5.text; _og.textAlign = 'center';
_op.forEach((l, i) => _og.fillText(l, W / 2, top + i * lh + size * 0.4));
if (_o7(scene.say)) {
const _o14 = Math.round(40 * k); _og.font = `600 ${_o14}px sans-serif`;
const _o12 = wrapText(_og, _o7(scene.say), W * 0.86).slice(0, 3);
_og.fillStyle = '#FFFFFF';
_o12.forEach((l, i) => _og.fillText(l, W / 2, H * 0.65 + i * _o14 * 1.25));
}
}

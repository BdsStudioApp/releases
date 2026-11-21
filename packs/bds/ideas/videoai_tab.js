import { h } from '../_lib/kit.js';
import * as F from '../_lib/video_flow.js';
import * as V3 from '../_lib/video3.js';
import * as VA from '../_lib/videoai.js';
import { SOURCE_LABEL, withRules } from '../../../shared/ai_rules.js';
import { mountCharStep, charImage, fileB64, b64ToBytes } from './flow_char.js';
const _o0 = (_ov) => 'bds.vflow.' + _ov;
const _o2 = 4000;
const _o10 = (_ov) => { try { return JSON.parse(localStorage.getItem(_ov) || 'null'); } catch { return null; } };
const _o11 = (_ov, _o25) => { try { localStorage.setItem(_ov, JSON.stringify(_o25)); } catch { } };
const safeHref = (u) => { try { const _o2a = new URL(String(u || '')); return _o2a.protocol === 'https:' ? _o2a.href : null; } catch { return null; } };
const today = () => new Date().toISOString().slice(0, 10);
const _o19 = (e) => (e && (e.userMessage || e.message)) || String(e || 'Lỗi');
const STAGES = { market: ['input', 'review', 'char', 'make'], map: ['input', 'review', 'char', 'make'], home: ['input', 'char', 'review', 'make'] };
let _o15 = null;
async function _oy() {
try { if (!_o15) _o15 = import('../_lib/map_osm.js'); return await _o15; } catch (e) { _o15 = null; throw e; }
}
export async function mountVideoAi(el, ctx, K, { onSaved = () => {}, openClips = () => {}, fn = '' } = {}) {
const role = (ctx.user && ctx.user.role) || 'owner';
const _o1g = role === 'owner';
const alive = () => el.isConnected;
const _o4 = () => !!(ctx.ai && typeof ctx.ai.run === 'function');
const _o22 = { kind: '', d: null, idea: null, busy: '', status: null, timers: [], mem: {} };
const mem = (_ov) => (_o22.mem[_ov] = _o22.mem[_ov] || { photos: [], mapPng: null, mapImg: null, charImg: null, files: {} });
el.innerHTML = '';
const _o1u = h('div', { class: 'vf', 'data-testid': 'videoai-screen' });
el.appendChild(_o1u);
const blank = (kind) => ({ kind, stage: 'input', input: { link: '', numbers: 'link', info: '' }, plan: null, noNet: '', ideaIdx: 0, facts: [],
map: null, master: '', masterTouched: false, char: { mode: kind === 'home' ? 'char' : 'faceless', id: '', name: '', lock_en: '' }, scenes: [], mode: 'manual', clips: {} });
const _o1w = () => { if (_o22.d) _o11(_o0(_o22.d.kind), _o22.d); };
const _o23 = (s) => STAGES[_o22.d.kind].indexOf(s) <= STAGES[_o22.d.kind].indexOf(_o22.d.stage);
const _om = (s) => { _o22.d.stage = s; _o1w(); _oc(); };
function _o1e(kind, { fresh = false } = {}) {
_o22.kind = kind;
_o22.d = fresh ? blank(kind) : { ...blank(kind), ...(_o10(_o0(kind)) || {}), kind };
_oc();
try { _o1u.scrollIntoView({ block: 'start' }); } catch { }
}
function back() { _o22.kind = ''; _o22.d = null; _oc(); }
function _op() {
const box = h('div', { class: 'bds-stack' });
box.appendChild(h('p', { class: 'vf-pay', 'data-testid': 'vf-pay-line' }, '💳 ' + F.PAY_LINE));
if (F.needGeminiLink(ctx.ai)) box.appendChild(h('p', { class: 'vf-warn', 'data-testid': 'vf-link-gemini' }, F.LINK_GEMINI + ' ', _o1g ? h('a', { href: '#/settings/connection' }, 'Mở Kết nối') : null));
if (_o22.idea) box.appendChild(h('div', { class: 'bds-note', 'data-testid': 'vf-from-idea' }, '💡 Từ ý tưởng: ', h('b', null, _o22.idea.title), ' – clip tạo ra sẽ gắn với ý tưởng này. ',
K.button('Bỏ gắn', () => { _o22.idea = null; _oc(); }, { testid: 'vf-idea-clear' })));
return box;
}
function _oc() {
_o1u.innerHTML = '';
if (!_o22.d) {
_o1u.appendChild(h('h3', { class: 'vf-q', 'data-testid': 'vf-question' }, F.QUESTION));
_o1u.appendChild(_op());
_o1u.appendChild(h('div', { class: 'vf-kinds', 'data-testid': 'vf-kinds' }, F.KINDS.map((_ov) => h('section', { class: 'vf-kind', 'data-testid': 'vf-card-' + _ov.id },
h('h3', null, h('span', { class: 'vf-i', 'aria-hidden': 'true' }, _ov.icon), _ov.label), h('p', null, _ov.desc),
(() => { const b = K.button('▶ Bắt đầu làm video', () => _o1e(_ov.id), { kind: 'primary', testid: 'vf-start-' + _ov.id }); b.classList.add('vf-go'); b.setAttribute('aria-label', 'Bắt đầu làm video ' + _ov.label); return b; })()))));
return;
}
const _ov = F.kindById(_o22.d.kind);
_o1u.appendChild(h('div', { class: 'bds-row bds-wrap' }, K.button('← Chọn dạng khác', back, { testid: 'vf-back' }), h('b', { 'data-testid': 'vf-kind-title' }, _ov.icon + ' ' + _ov.label),
K.button('Làm lại từ đầu', () => _o1e(_o22.d.kind, { fresh: true }), { testid: 'vf-reset' })));
_o1u.appendChild(_op());
const block = h('div', { class: 'vf-block', 'data-testid': 'vf-block', 'data-kind': _o22.d.kind });
_o1u.appendChild(block);
const step = (title, body, testid) => block.appendChild(h('section', { class: 'vf-step', 'data-testid': testid }, h('h4', null, title), body));
const _o1a = (s) => STAGES[_o22.d.kind].indexOf(s) + 1;
if (_o22.d.kind === 'market') step(_o1a('input') + '. Link bài báo và số liệu', _o18(), 'vf-step-input');
if (_o22.d.kind === 'map') step(_o1a('input') + '. Link về khu / tuyến', _o14(), 'vf-step-input');
if (_o22.d.kind === 'home') step(_o1a('input') + '. Thông tin căn và ảnh căn', _oq(), 'vf-step-input');
if (_o23('review') && _o22.d.kind !== 'home') step(_o1a('review') + (_o22.d.kind === 'map' ? '. Bản đồ, prompt tổng' : '. Phân tích, ý tưởng, prompt tổng'), _o1t(), 'vf-step-review');
if (_o23('char')) step(_o1a('char') + (_o22.d.kind === 'home' ? '. Nhân vật ảo đi dạo trong căn' : '. Nhân vật hoặc không người'), _o8(), 'vf-step-char');
if (_o23('review') && _o22.d.kind === 'home') step(_o1a('review') + '. Cảnh đi dạo, prompt tổng', _o1t(), 'vf-step-review');
if (_o23('make')) { step(_o1a('make') + '. Tạo clip', _o12(), 'vf-step-make'); step('Bộ mảnh cho CapCut', _ox(), 'vf-step-kit'); }
}
const _o7 = (b, key) => { if (_o22.busy) { b.disabled = true; if (_o22.busy === key) b.textContent = 'Đang làm…'; } return b; };
const _o6 = (_o2a, obj, key) => { _o2a.addEventListener('input', () => { obj[key] = _o2a.value; _o1w(); }); return _o2a; };
function _o18() {
const d = _o22.d, I = d.input;
const link = _o6(h('textarea', { rows: 3, value: I.link, 'data-testid': 'vf-link', placeholder: 'https://vnexpress.net/… (dán thêm nội dung bài nếu link cần đăng nhập)' }), I, 'link');
const _o1p = (_o25, label, tid) => { const r = h('input', { type: 'radio', name: 'vf-num', value: _o25, checked: I.numbers === _o25, 'data-testid': tid }); r.addEventListener('change', () => { I.numbers = _o25; _o1w(); }); return h('label', null, r, label); };
const box = h('div', { class: 'bds-stack' }, K.field('Link bài báo hoặc nội dung', link),
h('div', { class: 'vf-choice', role: 'radiogroup', 'aria-label': 'Số liệu' }, _o1p('link', 'Dùng số trong link', 'vf-num-link'), _o1p('fresh', 'Hỏi Gemini lấy số mới', 'vf-num-fresh')),
h('small', { class: 'bds-muted' }, '"Hỏi Gemini lấy số mới" cần khoá Gemini tra được Google – khoá miễn phí thường chưa tra được, app sẽ báo và quay về số trong link / anh/chị tự nhập.'));
if (d.noNet) box.appendChild(h('p', { class: 'vf-warn', 'data-testid': 'vf-no-net' }, F.NO_NET_TEXT + '.' + (d.noNet === 'old_server' ? ' (Máy chủ chưa có chức năng tra mạng – cần cập nhật máy chủ một lần.)' : '')));
box.appendChild(h('div', { class: 'bds-row bds-wrap' }, _o7(K.button(d.plan ? '↻ Phân tích lại' : '✨ Phân tích', analyzeMarket, { kind: 'primary', testid: 'vf-analyze' }), 'analyze'),
_o4() ? null : h('small', { class: 'bds-muted' }, 'Chưa bật AI – app dựng khung để anh/chị tự điền.')));
return box;
}
async function analyzeMarket() {
const d = _o22.d, input = d.input.link.trim();
if (!input) { K.toast('Dán link bài báo hoặc nội dung trước', 'warn'); return; }
if (_o22.busy) return;
_o22.busy = 'analyze'; d.noNet = ''; _oc();
let text = '', extra = [];
if (d.input.numbers === 'fresh') {
try {
const r = await ctx.ai.run('ideas', { provider: 'gemini', prompt: withRules(F.buildMarketPrompt({ input, numbers: 'fresh', today: today() })), json: true, grounding: true });
const _oi = F.groundingResult(r);
if (_oi.ok) { text = _oi.text; extra = _oi.sources; } else d.noNet = _oi.reason;
} catch (e) {
const why = F.groundingError(e);
if (!why) { _o22.busy = ''; _oc(); K.toast('AI chưa trả lời: ' + _o19(e), 'error'); return; }
d.noNet = why;
}
if (d.noNet) d.input.numbers = 'link';
}
if (!text && _o4()) {
try { const r = await ctx.ai.run('ideas', { prompt: withRules(F.buildMarketPrompt({ input, numbers: 'link', today: today() })), json: true }); text = (r && (r.text ?? r)) || ''; }
catch (e) { K.toast('AI chưa trả lời (' + _o19(e) + ') – dùng khung có sẵn', 'warn'); }
}
const plan = F.parseMarket(text, { input });
if (plan.fallback && text) K.toast('AI chưa trả về đúng định dạng – dùng khung có sẵn để anh/chị tự điền', 'warn');
const _o21 = new Set(plan.sources.map((s) => s.url));
plan.sources = [...plan.sources, ...extra.filter((s) => !_o21.has(s.url))];
d.plan = plan; d.ideaIdx = 0; d.facts = plan.facts.length ? plan.facts : [{ label: '', text: '', source: '', month: '', by: '' }];
d.scenes = plan.scenes.map((s) => ({ kind: s.kind, text: s.text, say: s.say }));
d.masterTouched = false; d.clips = {}; mem(d.kind).files = {};
_o1s(); _o22.busy = ''; d.stage = 'review'; _o1w(); _oc();
}
function _og() {
const d = _o22.d;
const list = h('div', { class: 'vf-facts', 'data-testid': 'vf-facts' });
d.facts.forEach((_of, i) => {
const badge = h('span', { 'data-testid': 'vf-fact-state-' + i });
const _o1i = () => { badge.replaceChildren(K.badge(F.factLabel(_of), F.factLabel(_of) === SOURCE_LABEL.sourced ? 'success' : F.factLabel(_of) === SOURCE_LABEL.manual ? 'info' : 'warn')); };
const _ot = (key, attrs) => { const _o2a = h('input', { ...attrs, value: _of[key] || '', 'data-testid': `vf-fact-${key}-${i}` }); _o2a.addEventListener('input', () => { _of[key] = _o2a.value; if (key === 'text') _of.by = _o2a.value.trim() ? 'sale' : ''; _o1i(); _o1w(); }); return _o2a; };
_o1i();
list.appendChild(h('div', { class: 'vf-fact', 'data-testid': 'vf-fact-' + i }, h('div', { class: 'vf-fact-row' },
_ot('label', { type: 'text', placeholder: 'Mục (vd Lãi suất điều hành)', 'aria-label': 'Mục số liệu ' + (i + 1) }),
_ot('text', { type: 'text', placeholder: 'Số (vd 4,5%)', 'aria-label': 'Số liệu ' + (i + 1) }),
_ot('source', { type: 'url', placeholder: 'https://… link nguồn', 'aria-label': 'Nguồn số liệu ' + (i + 1) }),
_ot('month', { type: 'text', placeholder: 'Tháng (11/2026)', 'aria-label': 'Tháng số liệu ' + (i + 1) })), badge));
});
return h('div', { class: 'bds-stack' }, list, h('div', { class: 'bds-row bds-wrap' },
K.button('＋ Thêm số liệu', () => { d.facts.push({ label: '', text: '', source: '', month: '', by: '' }); _o1w(); _oc(); }, { testid: 'vf-fact-add' })),
h('small', { class: 'bds-muted' }, `Mỗi số có trạng thái: "${SOURCE_LABEL.sourced}" · "${SOURCE_LABEL.manual}" · "${SOURCE_LABEL.empty}". Số không nguồn không đưa vào video như số thật.`));
}
function _o14() {
const d = _o22.d, I = d.input;
const link = _o6(h('textarea', { rows: 3, value: I.link, 'data-testid': 'vf-link', placeholder: 'https://… bài về metro, đường mới, quy hoạch khu – hoặc gõ "Metro số 5 Văn Cao – Hoà Lạc"' }), I, 'link');
return h('div', { class: 'bds-stack' }, K.field('Link hoặc chủ đề', link, 'AI hiểu đây là video giới thiệu khu/tuyến, rút tên địa điểm rồi app tra toạ độ trên OpenStreetMap.'),
h('div', { class: 'bds-row bds-wrap' }, _o7(K.button(d.map ? '↻ Tìm lại' : '✨ Tìm khu trên bản đồ', extractMap, { kind: 'primary', testid: 'vf-extract' }), 'extract')));
}
async function extractMap() {
const d = _o22.d, input = d.input.link.trim();
if (!input) { K.toast('Dán link hoặc gõ chủ đề trước', 'warn'); return; }
if (_o22.busy) return;
_o22.busy = 'extract'; _oc();
let r = F.parseMapExtract('');
if (_o4()) {
try { const _o2a = await ctx.ai.run('ideas', { prompt: withRules(F.buildMapPrompt({ input, today: today() })), json: true }); r = F.parseMapExtract((_o2a && (_o2a.text ?? _o2a)) || ''); }
catch (e) { K.toast('AI chưa trả lời (' + _o19(e) + ') – anh/chị gõ tên địa điểm', 'warn'); }
}
const names = r.mode === 'route' && r.route.length ? r.route : r.places;
d.map = { ...r, names, places: [], notFound: [], ok: false, fail: '', attribution: '', note: names.length ? '' : F.NOT_FOUND_TEXT };
mem(d.kind).mapPng = null; mem(d.kind).mapImg = null;
_o22.busy = ''; d.stage = 'review'; _o1w();
if (names.length) await locate(); else _oc();
}
async function locate() {
const d = _o22.d, M = d.map;
if (!M.names.length) { M.fail = F.NO_MAP_TEXT; _o1w(); _oc(); return; }
_o22.busy = 'locate'; M.fail = ''; M.failDetail = ''; M.ok = false; _oc();
try {
const _o1 = await _oy();
const r = await _o1.locate(M.names, { geocodeUrl: ctx.config && ctx.config.MAP_GEOCODE_URL });
M.places = (r && Array.isArray(r.places) ? r.places : []).filter((_o1h) => _o1h && Number.isFinite(Number(_o1h.lat)) && Number.isFinite(Number(_o1h.lon)));
M.notFound = (r && Array.isArray(r.notFound) ? r.notFound : []).map(String);
if (!M.places.length) { M.fail = F.NO_MAP_TEXT; M.failDetail = String((r && r.error) || '').slice(0, 300); }
} catch (e) { M.places = []; M.fail = F.NO_MAP_TEXT; M.failDetail = String((e && e.message) || '').slice(0, 300); }
_o22.busy = ''; _o1w(); _oc();
}
async function _o1j(cv, M) {
try {
const _o1 = await _oy();
const route = M.mode === 'route' ? M.places.map((_o1h) => ({ name: _o1h.name, lat: _o1h.lat, lon: _o1h.lon })) : undefined;
const r = await _o1.drawArea(cv, { places: M.places, bbox: M.places.length === 1 ? M.places[0].bbox : undefined, mode: M.mode === 'route' ? 'route' : 'area', route, lang: 'vi' });
if (!r || !r.ok) throw new Error((r && (r.error || r.note)) || '');
M.attribution = r.attribution || _o1.attribution || '© OpenStreetMap contributors';
try { mem(_o22.d.kind).mapPng = cv.toDataURL('image/png').split(',')[1] || null; } catch { mem(_o22.d.kind).mapPng = null; }
const _o3 = cv.parentElement && cv.parentElement.querySelector('[data-testid="vf-map-attrib"]');
if (_o3) _o3.textContent = M.attribution + (r.note ? ' · ' + r.note : '');
} catch (e) { M.places = []; M.fail = F.NO_MAP_TEXT; M.failDetail = String((e && e.message) || '').slice(0, 300); _o1w(); _oc(); }
}
function _o17() {
const d = _o22.d, M = d.map;
const box = h('div', { class: 'bds-stack', 'data-testid': 'vf-map' });
if (M.title || M.summary) box.appendChild(h('div', { class: 'bds-note', 'data-testid': 'vf-analysis' }, h('b', null, M.title || 'Khu vực'), M.summary ? h('p', null, M.summary) : null,
safeHref(M.source) ? h('a', { href: safeHref(M.source), target: '_blank', rel: 'noopener noreferrer' }, 'Nguồn ↗') : h('small', { class: 'bds-muted' }, SOURCE_LABEL.empty + ' (chưa có link nguồn)')));
if (M.note) box.appendChild(h('p', { class: 'vf-warn', 'data-testid': 'vf-map-note' }, M.note));
const names = h('textarea', { rows: 3, value: M.names.join('\n'), 'data-testid': 'vf-places', 'aria-label': 'Tên địa điểm' });
names.addEventListener('change', () => { M.names = F.splitPlaces(names.value); _o1w(); });
box.appendChild(K.field('Tên địa điểm (mỗi dòng một nơi – sửa được)', names, M.mode === 'route' ? 'Tuyến: các điểm theo thứ tự trên tuyến.' : null));
box.appendChild(h('div', { class: 'bds-row bds-wrap' }, _o7(K.button('🔎 Tìm lại trên bản đồ', () => { M.names = F.splitPlaces(names.value); locate(); }, { testid: 'vf-locate' }), 'locate')));
if (M.places.length && !M.fail) {
const cv = h('canvas', { width: 1080, height: 1920, class: 'vf-map', 'data-testid': 'vf-map-canvas', 'aria-label': 'Bản đồ ' + (M.title || 'khu vực') });
box.appendChild(h('div', { class: 'bds-stack' }, cv, h('small', { class: 'bds-muted', 'data-testid': 'vf-map-attrib' }, '© OpenStreetMap contributors')));
_o1j(cv, M);
if (M.notFound.length) box.appendChild(h('p', { class: 'vf-warn', 'data-testid': 'vf-map-notfound' }, 'Chưa tìm thấy: ' + M.notFound.join(', ') + ' – sửa tên rồi tìm lại, hoặc bỏ qua.'));
if (M.ok) box.appendChild(h('p', { class: 'bds-ok', 'data-testid': 'vf-map-done' }, '✓ Anh/chị đã duyệt khu trên bản đồ.'));
else box.appendChild(h('div', { class: 'bds-stack' }, h('p', { 'data-testid': 'vf-map-ask' }, h('b', null, F.MAP_ASK)),
h('div', { class: 'bds-row bds-wrap' }, K.button('✓ Đúng khu này', () => _o16(), { kind: 'primary', testid: 'vf-map-ok' }),
h('small', { class: 'bds-muted' }, 'Chưa đúng: sửa tên địa điểm ở trên rồi bấm "Tìm lại".'))));
} else if (M.fail) {
const up = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', 'data-testid': 'vf-map-upload', 'aria-label': 'Tải ảnh bản đồ' });
up.addEventListener('change', async () => {
const _of = up.files && up.files[0]; up.value = '';
if (!_of || !/^image\//.test(_of.type)) return;
if (_of.size > 8 * 1024 * 1024) { K.toast('Ảnh bản đồ tối đa 8 MB', 'warn'); return; }
mem(d.kind).mapImg = { mime: _of.type, b64: await fileB64(_of), name: _of.name }; _oc();
});
const _or = mem(d.kind).mapImg;
box.appendChild(h('div', { class: 'bds-stack' }, h('p', { class: 'vf-warn', 'data-testid': 'vf-map-fail' }, F.NO_MAP_TEXT + '.'), M.failDetail && M.failDetail !== F.NO_MAP_TEXT ? h('small', { class: 'bds-muted', 'data-testid': 'vf-map-fail-detail' }, M.failDetail) : null,
K.field('Ảnh bản đồ của anh/chị', up, 'Ảnh anh/chị tự chụp/tải (anh/chị chịu trách nhiệm quyền dùng).'),
_or ? h('img', { src: 'data:' + _or.mime + ';base64,' + _or.b64, alt: 'Ảnh bản đồ', class: 'vf-map-img', 'data-testid': 'vf-map-img' }) : null,
M.ok ? h('p', { class: 'bds-ok', 'data-testid': 'vf-map-done' }, '✓ Đã dùng ' + (_or ? 'ảnh bản đồ của anh/chị.' : 'tên địa điểm nhập tay.'))
: K.button(_or ? '✓ Dùng ảnh bản đồ này' : '✓ Tiếp tục với tên địa điểm nhập tay', () => _o16(), { kind: 'primary', testid: 'vf-map-ok' })));
}
return box;
}
function _o16() {
const d = _o22.d, M = d.map;
M.ok = true;
const places = M.places.length ? M.places : M.names.map((name) => ({ name }));
d.scenes = F.mapScenes({ title: M.title || M.names[0] || '', places, mode: M.mode, status: M.status });
d.masterTouched = false; d.clips = {}; mem(d.kind).files = {};
_o1s(); _o1w(); _oc();
}
function _oq() {
const d = _o22.d, I = d.input, M = mem(d.kind);
const info = _o6(h('textarea', { rows: 4, value: I.info, 'data-testid': 'vf-home-info', placeholder: 'vd Căn 2PN 70 m² thông thuỷ, tầng 15, ban công hướng Đông Nam, view hồ, giá 4,2 tỷ, sổ hồng lâu dài' }), I, 'info');
const _o1k = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', multiple: true, 'data-testid': 'vf-home-photos', 'aria-label': 'Ảnh căn' });
_o1k.addEventListener('change', async () => {
const files = [...(_o1k.files || [])].slice(0, 6); _o1k.value = '';
const out = [];
for (const _of of files) { if (_of.size > 5 * 1024 * 1024) { K.toast('Ảnh ' + _of.name + ' quá 5 MB – bỏ qua', 'warn'); continue; } out.push({ name: _of.name, mime: _of.type || 'image/jpeg', b64: await fileB64(_of) }); }
M.photos = out; _oc();
});
const _on = K.button('Tiếp: chọn nhân vật ảo', () => { if (!I.info.trim()) { K.toast('Nhập thông tin căn trước', 'warn'); return; } if (_o22.d.stage === 'input') _om('char'); }, { kind: 'primary', testid: 'vf-home-next' });
return h('div', { class: 'bds-stack' },
K.field('Thông tin căn, diện tích, giá bán (gộp một ô)', info, 'AI tự tách diện tích, số phòng, giá… đưa vào lời thoại – số anh/chị không ghi thì AI không thêm.'),
K.field('Ảnh căn (tối đa 6 ảnh)', _o1k), h('small', { class: 'bds-muted', 'data-testid': 'vf-home-photo-count' }, M.photos.length ? `Đã chọn ${M.photos.length} ảnh.` : 'Chưa chọn ảnh.'),
_o22.d.stage === 'input' ? h('div', { class: 'bds-row bds-wrap' }, _on) : null);
}
async function composeHome() {
const d = _o22.d;
if (_o22.busy) return;
if (!d.char.lock_en) { K.toast('Chọn hoặc tạo nhân vật ảo trước', 'warn'); return; }
_o22.busy = 'compose'; _oc();
const photos = mem(d.kind).photos;
let text = '';
if (_o4()) {
try { const r = await ctx.ai.run('ideas', { prompt: withRules(F.buildHomePrompt({ info: d.input.info, character: d.char, photos: photos.length })), images: photos.slice(0, 4).map((_o1h) => ({ mime: _o1h.mime, b64: _o1h.b64 })), json: true }); text = (r && (r.text ?? r)) || ''; }
catch (e) { K.toast('AI chưa trả lời (' + _o19(e) + ') – dùng khung có sẵn', 'warn'); }
}
const r = F.parseHome(text, { info: d.input.info, character: d.char });
d.plan = { title: 'Giới thiệu căn hộ', summary: r.summary };
d.scenes = r.scenes; d.masterTouched = false; d.clips = {}; mem(d.kind).files = {};
_o1s(); _o22.busy = ''; d.stage = 'review'; _o1w(); _oc();
}
function _o1s() {
const d = _o22.d;
if (d.masterTouched) return;
const idea = d.plan && d.plan.ideas ? d.plan.ideas[d.ideaIdx] || null : null;
const title = d.kind === 'map' ? (d.map && (d.map.title || d.map.names[0])) || '' : (d.plan && d.plan.title) || '';
d.master = F.buildMasterPrompt({ kind: d.kind, title, idea, scenes: d.scenes, character: d.char.mode === 'char' && d.char.lock_en ? d.char : null, summary: (d.plan && d.plan.summary) || (d.map && d.map.summary) || '' });
}
function _o1t() {
const d = _o22.d;
const box = h('div', { class: 'bds-stack' });
if (d.kind === 'market' && d.plan) {
const _o1h = d.plan;
box.appendChild(h('div', { class: 'bds-note', 'data-testid': 'vf-analysis' }, h('b', null, _o1h.title || 'Phân tích thị trường'), _o1h.summary ? h('p', null, _o1h.summary) : null,
_o1h.factors.length ? h('ul', { 'data-testid': 'vf-factors' }, _o1h.factors.map((_o2a) => h('li', null, h('b', null, _o2a.name + ': '), _o2a.effect || '', ' ',
safeHref(_o2a.source) ? h('a', { href: safeHref(_o2a.source), target: '_blank', rel: 'noopener noreferrer' }, 'nguồn ↗') : K.badge(SOURCE_LABEL.empty, 'warn'))))
: h('p', { class: 'bds-muted', 'data-testid': 'vf-factors' }, F.NOT_FOUND_TEXT + ' (chưa thấy yếu tố có nguồn).'),
_o1h.sources.length ? h('small', null, 'Nguồn: ', _o1h.sources.map((s, i) => [i ? ', ' : '', h('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer' }, s.name || s.url)])) : null));
box.appendChild(K.field('Số liệu (có trạng thái nguồn)', _og()));
if (_o1h.ideas.length) {
const ideas = h('div', { class: 'vf-choice', role: 'radiogroup', 'aria-label': 'Ý tưởng quay', 'data-testid': 'vf-ideas' }, _o1h.ideas.map((_o2a, i) => {
const r = h('input', { type: 'radio', name: 'vf-idea', checked: d.ideaIdx === i, 'data-testid': 'vf-idea-' + i });
r.addEventListener('change', () => { d.ideaIdx = i; _o1s(); _o1w(); _oc(); });
return h('label', null, r, h('span', null, h('b', null, _o2a.title), _o2a.angle ? ' – ' + _o2a.angle : ''));
}));
box.appendChild(K.field('Ý tưởng quay', ideas));
}
}
if (d.kind === 'map' && d.map) box.appendChild(_o17());
if (d.kind === 'map' && !(d.map && d.map.ok)) return box;
if (d.kind === 'market' && !d.plan) return box;
box.appendChild(_o20());
const ta = h('textarea', { rows: 10, value: d.master, 'data-testid': 'vf-master', spellcheck: false, style: { fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12px' } });
ta.addEventListener('input', () => { d.master = ta.value; d.masterTouched = true; _o1w(); });
box.appendChild(K.field('PROMPT TỔNG (sửa được)', ta, 'Bản tóm toàn video: ý tưởng, nhân vật, lời đọc từng cảnh. Có trong bộ mảnh (prompt_tong.txt).'));
if (d.masterTouched) box.appendChild(K.button('↺ Soạn lại prompt tổng theo cảnh', () => { d.masterTouched = false; _o1s(); _o1w(); _oc(); }, { testid: 'vf-master-reset' }));
const _o1o = V3.contentProblems({ fn: 'news', status: (d.plan && d.plan.status) || 'existing', finance: !!(d.plan && d.plan.finance), sources: [{ url: 'x' }], scenes: d.scenes });
const _oe = _o1o.filter((_o2a) => _o2a.level === 'error');
if (_o1o.length) box.appendChild(h('ul', { class: 'v3-probs', 'data-testid': 'vf-problems' }, _o1o.map((_o2a) => h('li', { class: _o2a.level === 'error' ? 'v3-err' : 'v3-warn' }, (_o2a.level === 'error' ? '⛔ ' : '⚠ ') + _o2a.msg))));
const next = d.kind === 'home' ? 'make' : 'char';
if (STAGES[d.kind].indexOf(d.stage) < STAGES[d.kind].indexOf(next)) {
const b = K.button(d.kind === 'home' ? 'Tiếp: tạo clip' : 'Tiếp: chọn nhân vật', () => _om(next), { kind: 'primary', testid: 'vf-review-next' });
b.disabled = !!_oe.length;
box.appendChild(h('div', { class: 'bds-row bds-wrap' }, b, _oe.length ? h('small', { class: 'bds-error' }, 'Sửa các dòng ⛔ trước khi tiếp.') : null));
}
return box;
}
function _o20() {
const d = _o22.d;
const list = h('div', { class: 'vf-scenes', 'data-testid': 'vf-scenes' });
d.scenes.forEach((s, i) => {
const text = h('input', { type: 'text', value: s.text || '', 'data-testid': 'vf-text-' + i, 'aria-label': 'Chữ trên hình cảnh ' + (i + 1) });
const say = h('textarea', { rows: 2, value: s.say || '', 'data-testid': 'vf-say-' + i, 'aria-label': 'Lời đọc cảnh ' + (i + 1) });
text.addEventListener('change', () => { s.text = text.value; _o1s(); _o1w(); _oc(); });
say.addEventListener('change', () => { s.say = say.value; _o1s(); _o1w(); _oc(); });
list.appendChild(h('div', { class: 'vf-scene', 'data-testid': 'vf-scene-' + i }, h('div', { class: 'bds-row bds-wrap' }, h('b', null, 'Cảnh ' + (i + 1)),
K.button('Xoá', () => { d.scenes.splice(i, 1); _o1s(); _o1w(); _oc(); }, { kind: 'danger', testid: 'vf-scene-del-' + i })),
K.field('Chữ trên hình', text), K.field('Lời đọc', say)));
});
return h('div', { class: 'bds-stack' }, h('b', null, 'Cảnh và lời đọc'), list,
K.button('＋ Thêm cảnh', () => { d.scenes.push({ kind: 'stat', text: 'Cảnh mới', say: '' }); _o1s(); _o1w(); _oc(); }, { testid: 'vf-scene-add' }));
}
function _o8() {
const d = _o22.d;
const box = h('div', { class: 'bds-stack', 'data-testid': 'vf-char' });
const _os = h('div', { class: 'bds-stack' });
box.appendChild(_os);
mountCharStep(_os, ctx, K, { value: d.char, allowFaceless: d.kind !== 'home', onChange: (_o25, _or) => {
mem(d.kind).charImg = _or || null;
if (d.kind !== 'home' && !d.masterTouched) { _o1s(); const ta = _o1u.querySelector('[data-testid="vf-master"]'); if (ta) ta.value = d.master; }
_o1w(); _od();
} })
.catch((e) => _os.replaceChildren(K.empty('Chưa mở được bước nhân vật: ' + _o19(e))));
const _o1b = h('div', { class: 'bds-row bds-wrap' });
box.appendChild(_o1b);
const _od = () => {
_o1b.innerHTML = '';
const _o1q = d.char.mode === 'faceless' || !!d.char.lock_en;
if (d.kind === 'home') {
const b = _o7(K.button(d.stage === 'char' ? '✨ AI soạn cảnh đi dạo trong căn' : '↻ Soạn lại cảnh đi dạo', composeHome, { kind: 'primary', testid: 'vf-home-compose' }), 'compose');
b.disabled = b.disabled || !_o1q; _o1b.appendChild(b);
} else if (d.stage === 'char') {
const b = K.button('Tiếp: tạo clip', () => _om('make'), { kind: 'primary', testid: 'vf-char-next' });
b.disabled = !_o1q; _o1b.appendChild(b);
}
if (!_o1q) _o1b.appendChild(h('small', { class: 'bds-muted' }, 'Chọn nhân vật có sẵn, tạo mới hoặc tải ảnh lên.'));
};
_od();
return box;
}
function _o1z(s) {
if (s.prompt) return s.prompt;
const d = _o22.d;
return VA.buildPrompt({ kind: 'broll', subject: (d.kind === 'map' ? 'generic aerial or street view of a Vietnamese urban area related to: ' : 'generic Vietnamese city or residential scene illustrating: ') + String(s.text || '').replace(/\n/g, ' '), aspect: '9:16', seconds: 8 }).prompt;
}
async function _oz() { try { _o22.status = await K.api('videoai.status', {}); } catch (e) { _o22.status = { error: _o19(e), providers: {}, prices: [] }; } }
const _o28 = () => (_o22.status && _o22.status.providers && _o22.status.providers.veo_api && _o22.status.providers.veo_api.model) || '';
const _o26 = () => VA.estimate((_o22.status && _o22.status.prices) || [], { provider: 'veo_api', model: _o28(), seconds: 8 });
function _o12() {
const d = _o22.d, M = mem(d.kind);
const box = h('div', { class: 'bds-stack' });
const _o1p = (_o25, label, tid) => { const r = h('input', { type: 'radio', name: 'vf-mode', value: _o25, checked: d.mode === _o25, 'data-testid': tid }); r.addEventListener('change', async () => { d.mode = _o25; _o1w(); if (_o25 === 'auto' && !_o22.status) await _oz(); _oc(); }); return h('label', null, r, label); };
box.appendChild(h('div', { class: 'vf-choice', role: 'radiogroup', 'aria-label': 'Cách tạo clip' }, _o1p('manual', 'Thủ công qua Flow', 'vf-mode-manual'), _o1p('auto', 'Tự động qua khoá Gemini', 'vf-mode-auto')));
if (d.kind !== 'home') box.appendChild(h('p', { class: 'vf-note' }, 'Clip là tuỳ chọn: video ' + (d.kind === 'map' ? 'bản đồ' : 'phân tích') + ' có thể chỉ cần ' + (d.kind === 'map' ? 'ảnh bản đồ' : 'thẻ chữ/ảnh') + (d.char.mode === 'char' ? ' + ảnh nhân vật' : '') + ' + giọng đọc. Thêm clip minh hoạ cho cảnh nào cần.'));
let _o1q = { ok: true, why: '' };
if (d.mode === 'manual') {
box.appendChild(h('ol', { class: 'bds-note' }, h('li', null, 'Bấm "Chép prompt" của cảnh, mở ', h('a', { href: F.FLOW_URL, target: '_blank', rel: 'noopener', 'data-testid': 'vf-open-flow' }, 'Google Flow'), ', dán và tạo clip (Flow hiện số tín dụng trước khi tạo).'),
h('li', null, 'Tải clip về máy rồi chọn tệp ở cảnh đó, hoặc đưa lên Google Drive và dán link.'), h('li', null, 'Xong các cảnh cần clip → tải bộ mảnh ở dưới.')));
} else {
if (!_o22.status) { box.appendChild(h('p', { class: 'bds-muted', 'data-testid': 'vf-veo-loading' }, 'Đang kiểm khoá Gemini…')); _oz().then(() => { if (alive() && _o22.d === d) _oc(); }); return box; }
const est = _o26();
_o1q = VA.providerReady('veo_api', { status: _o22.status, est, role });
if (_o1q.ok) box.appendChild(h('p', { class: 'vf-note', 'data-testid': 'vf-veo-ok' }, `Veo qua khoá Gemini của anh/chị: ${VA.costText(est)} mỗi cảnh 8 giây. App hỏi đồng ý trước mỗi lần tạo.`));
else {
box.appendChild(h('div', { class: 'bds-stack' }, h('p', { class: 'vf-warn', 'data-testid': 'vf-veo-not-ready' }, 'Khoá Gemini hiện chưa tạo clip tự động được: ' + (_o22.status.error || _o1q.why) + ' Anh/chị dùng "Thủ công qua Flow" (tín dụng gói Gemini của anh/chị).'),
K.button('Dùng Thủ công qua Flow', () => { d.mode = 'manual'; _o1w(); _oc(); }, { kind: 'primary', testid: 'vf-auto-to-manual' })));
if (_o1g && !_o22.status.error) box.appendChild(_o29());
}
}
const list = h('div', { class: 'vf-scenes', 'data-testid': 'vf-clips' });
d.scenes.forEach((s, i) => {
const _o1m = h('textarea', { rows: 4, value: _o1z(s), 'data-testid': 'vf-prompt-' + i, spellcheck: false, 'aria-label': 'Prompt cảnh ' + (i + 1), style: { fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12px' } });
_o1m.addEventListener('change', () => { s.prompt = _o1m.value; _o1w(); });
const _oo = M.files[i] ? '✓ Đã có tệp clip: ' + M.files[i].name : d.clips[i] && d.clips[i].url ? '✓ Đã có link clip' : 'Chưa có clip';
const _o1v = h('div', { class: 'vf-scene', 'data-testid': 'vf-clip-' + i }, h('div', { class: 'bds-row bds-wrap' }, h('b', null, 'Cảnh ' + (i + 1)), h('small', { class: 'bds-muted' }, s.say || s.text || ''),
h('small', { class: M.files[i] || (d.clips[i] && d.clips[i].url) ? 'bds-ok' : 'bds-muted', 'data-testid': 'vf-clip-state-' + i }, _oo)),
h('details', null, h('summary', null, 'Prompt cảnh (tiếng Anh – sửa được)'), _o1m));
if (d.mode === 'manual') {
const link = h('input', { type: 'url', value: (d.clips[i] && d.clips[i].url) || '', placeholder: 'https://drive.google.com/… link clip', 'data-testid': 'vf-clip-link-' + i, 'aria-label': 'Link clip cảnh ' + (i + 1) });
const _oh = h('input', { type: 'file', accept: 'video/mp4,video/quicktime,video/webm', 'data-testid': 'vf-clip-file-' + i, 'aria-label': 'Tệp clip cảnh ' + (i + 1) });
_oh.addEventListener('change', async () => {
const _of = _oh.files && _oh.files[0]; _oh.value = '';
if (!_of) return;
if (_of.size > 200 * 1024 * 1024) { K.toast('Clip tối đa 200 MB', 'warn'); return; }
M.files[i] = { name: _of.name, bytes: new Uint8Array(await _of.arrayBuffer()) }; _oc();
});
_o1v.appendChild(h('div', { class: 'bds-row bds-wrap' }, K.button('📋 Chép prompt', async () => { await K.copy(_o1m.value); K.toast('Đã chép prompt cảnh ' + (i + 1) + ' – dán vào Flow', 'success'); }, { testid: 'vf-copy-' + i })));
_o1v.appendChild(K.field('Tệp clip đã tải về', _oh));
_o1v.appendChild(h('div', { class: 'bds-row bds-wrap' }, link, K.button('Lưu link', () => _o1y(i, link.value, _o1m.value), { testid: 'vf-clip-save-' + i })));
} else if (_o1q.ok) {
_o1v.appendChild(h('div', { class: 'bds-row bds-wrap' }, _o7(K.button('✨ Tạo clip bằng Veo', () => _o27(i, _o1m.value), { kind: 'primary', testid: 'vf-veo-' + i }), 'veo' + i)));
}
list.appendChild(_o1v);
});
box.appendChild(list);
box.appendChild(h('div', { 'data-testid': 'vf-out', 'aria-live': 'polite' }, _o22.out ? h('p', { class: _o22.out.tone === 'error' ? 'bds-error' : _o22.out.tone === 'ok' ? 'bds-ok' : 'bds-muted', 'data-testid': 'vf-out-text' }, _o22.out.text) : null));
return box;
}
function _o29() {
const en = h('input', { type: 'checkbox', checked: !!(_o22.status.providers.veo_api && _o22.status.providers.veo_api.enabled), 'data-testid': 'vf-veo-en', 'aria-label': 'Bật Veo tự động' });
const cur = ((_o22.status.prices || []).find((_o1h) => _o1h.provider === 'veo_api') || {});
const _o1n = h('input', { type: 'number', min: 0, step: 'any', value: cur.value ?? '', placeholder: 'USD / giây', 'data-testid': 'vf-veo-price', 'aria-label': 'Giá Veo USD mỗi giây', size: 8 });
return h('details', { 'data-testid': 'vf-veo-setup' }, h('summary', null, 'Chủ app: bật Veo tự động'),
h('p', { class: 'vf-note' }, 'Veo dùng khoá Gemini đã lưu ở Cài đặt › Kết nối (khoá phải bật thanh toán ở Google). Nhập giá theo ', h('a', { href: VA.PRICE_PAGES.veo_api, target: '_blank', rel: 'noopener noreferrer' }, 'trang giá của Google'), ' để app báo chi phí trước mỗi lần tạo – app không ghi sẵn giá.'),
h('label', { class: 'bds-row' }, en, ' Bật Veo tự động'), K.field('Giá Veo (USD / giây)', _o1n),
K.button('Lưu', async () => {
const _o25 = String(_o1n.value).trim().replace(',', '.');
if (_o25 === '' || !(Number(_o25) >= 0)) { K.toast('Nhập giá là số USD từ 0 trở lên', 'warn'); return; }
const others = (_o22.status.prices || []).filter((_o1h) => _o1h.provider !== 'veo_api');
try {
_o22.status = await K.api('videoai.config', { enabled: { veo_api: en.checked }, prices: [...others, { provider: 'veo_api', model: '', quality: '', unit: 'usd_per_second', value: Number(_o25), credit_usd: null, source_url: VA.PRICE_PAGES.veo_api, checked_at: today() }].map(VA.priceRow).filter(Boolean) });
K.toast('Đã lưu', 'success'); _oc();
} catch (e) { K.toast(_o19(e), 'error'); }
}, { kind: 'primary', testid: 'vf-veo-save' }));
}
const out = (text, tone) => { _o22.out = { text, tone }; const _o1c = _o1u.querySelector('[data-testid="vf-out"]'); if (_o1c) _o1c.replaceChildren(h('p', { class: tone === 'error' ? 'bds-error' : tone === 'ok' ? 'bds-ok' : 'bds-muted', 'data-testid': 'vf-out-text' }, text)); };
const _oa = (i) => { const d = _o22.d; return ((_o22.idea && _o22.idea.title) || (d.kind === 'map' ? (d.map && d.map.title) : d.plan && d.plan.title) || F.kindById(d.kind).label) + ' – cảnh ' + (i + 1); };
async function _o1x({ provider, url = '', cost = null, task_id = '', prompt = '', i }) {
const _o1v = await K.put('jobs', VA.clipRow({ provider, prompt, kind: _o22.d.kind === 'home' ? 'presenter' : 'broll', seconds: 8, aspect: '9:16', url, cost, idea_id: _o22.idea ? _o22.idea.id : '', title: _oa(i), task_id, extra: { func: _o22.d.kind } }));
if (_o22.idea && _o22.idea.id) {
try {
const cur = await K.get('ideas', _o22.idea.id);
if (cur) { let _ob = {}; try { _ob = JSON.parse(cur.data || '{}') || {}; } catch { _ob = {}; } _ob.clip_ids = [...new Set([...(Array.isArray(_ob.clip_ids) ? _ob.clip_ids : []), _o1v.id])].slice(-20); await K.put('ideas', { ...cur, data: JSON.stringify(_ob) }); }
} catch { }
}
try { onSaved(_o1v); } catch { }
return _o1v;
}
async function _o1y(i, value, prompt) {
const url = VA.linkOk(value);
if (!url) { K.toast('Dán link https:// của clip (vd link Google Drive)', 'warn'); return; }
_o22.d.clips[i] = { url }; _o1w();
await _o1x({ provider: 'flow', url, prompt, i });
out('✓ Đã lưu link clip cảnh ' + (i + 1) + ' (xem ở thẻ "Clip đã có").', 'ok'); _oc();
}
async function _o27(i, prompt) {
if (_o22.busy) return;
const d = _o22.d, M = mem(d.kind), est = _o26();
const ok = await K.confirm({ title: 'Tạo clip bằng Veo – tốn phí', text: `Cảnh ${i + 1}, 8 giây: ${VA.costText(est)}. Tính vào khoá Gemini của anh/chị theo gói của Google. Tạo clip này?`, ok: 'Đồng ý – tạo clip', testid: 'vf-veo-confirm' });
if (!ok) return;
_o22.busy = 'veo' + i; _oc(); out('Đang gửi yêu cầu tạo clip…');
const _o1r = d.kind === 'home' ? (M.charImg || (d.char.id ? await charImage(ctx, d.char.id) : null)) : null;
try {
const r = await K.api('videoai.start', { provider: 'veo_api', prompt, seconds: 8, aspect: '9:16', image: _o1r && /^image\/(jpeg|png|webp)$/.test(_o1r.mime) ? { mime: _o1r.mime, b64: _o1r.b64 } : undefined,
video_ref: (_o22.idea && _o22.idea.id) || 'vflow-' + d.kind, confirm: { usd: est.usd, credits: est.credits } });
out(`Đã gửi Veo (≈ ${r.estimate.usd} USD). Đang chờ tạo clip – có thể mất vài phút…`);
await _o1l(r.task, { usd: r.estimate.usd, credits: r.estimate.credits }, i, prompt);
} catch (e) { out('✗ ' + _o19(e), 'error'); }
_o22.busy = ''; if (alive()) _oc();
}
async function _o1l(task, cost, i, prompt) {
const M = mem(_o22.d.kind);
for (let _o1a = 0; _o1a < 150; _o1a++) {
await new Promise((res) => _o22.timers.push(setTimeout(res, _o2)));
if (!alive()) return;
const r = await K.api('videoai.poll', { provider: task.provider, id: task.id });
if (r.state === 'running') { out(`Veo đang tạo clip${r.progress ? ' · ' + Math.round(r.progress * 100) + '%' : ''}…`); continue; }
if (r.state === 'error') throw new Error(r.message || 'Veo báo lỗi');
if (r.download === 'server') {
const _of = await K.api('videoai.fetch', { uri: r.uri });
M.files[i] = { name: 'veo_canh_' + (i + 1) + '.mp4', bytes: b64ToBytes(_of.b64) };
await _o1x({ provider: task.provider, cost, task_id: task.id, prompt, i });
} else {
const url = VA.linkOk(r.url);
if (url) _o22.d.clips[i] = { url };
await _o1x({ provider: task.provider, url, cost, task_id: task.id, prompt, i });
}
_o1w(); out('✓ Clip cảnh ' + (i + 1) + ' xong – đã vào bộ mảnh và thẻ "Clip đã có".', 'ok');
return;
}
throw new Error('Veo tạo quá lâu – xem lại sau ở thẻ "Clip đã có"');
}
async function kitFiles() {
const d = _o22.d, M = mem(d.kind);
const images = [];
if (M.mapPng) images.push({ name: 'ban_do.png', bytes: b64ToBytes(M.mapPng) });
if (M.mapImg) images.push({ name: 'ban_do_cua_anh.' + (M.mapImg.mime === 'image/png' ? 'png' : M.mapImg.mime === 'image/webp' ? 'webp' : 'jpg'), bytes: b64ToBytes(M.mapImg.b64) });
if (d.char.mode === 'char' && d.char.id) {
const _o9 = M.charImg || await charImage(ctx, d.char.id);
if (_o9) images.push({ name: 'nhan_vat.' + (_o9.mime === 'image/png' ? 'png' : _o9.mime === 'image/webp' ? 'webp' : 'jpg'), bytes: b64ToBytes(_o9.b64) });
}
M.photos.forEach((_o1h, i) => images.push({ name: 'anh_can_' + String(i + 1).padStart(2, '0') + '.' + (_o1h.mime === 'image/png' ? 'png' : _o1h.mime === 'image/webp' ? 'webp' : 'jpg'), bytes: b64ToBytes(_o1h.b64) }));
const clips = d.scenes.map((_, i) => (M.files[i] ? { scene: i, name: M.files[i].name, bytes: M.files[i].bytes } : d.clips[i] && d.clips[i].url ? { scene: i, url: d.clips[i].url } : null)).filter(Boolean);
const sources = d.kind === 'market' ? [...((d.plan && d.plan.sources) || []), ...d.facts.filter((_of) => _of.source).map((_of) => ({ name: _of.label || _of.text, url: _of.source }))]
: d.kind === 'map' && d.map && d.map.source ? [{ name: 'Nguồn tin', url: d.map.source }] : [];
const title = d.kind === 'map' ? (d.map && (d.map.title || d.map.names[0])) || 'Bản đồ' : (d.plan && d.plan.title) || F.kindById(d.kind).label;
const files = F.kitFiles({ title, scenes: d.scenes, master: d.master + (d.kind === 'map' && d.map && d.map.attribution ? '\nBản đồ: ' + d.map.attribution : ''), sources, images, clips });
return { title, files };
}
function download(name, bytes, mime) {
const url = URL.createObjectURL(new Blob([bytes], { type: mime || 'application/octet-stream' }));
const _o3 = h('a', { href: url, download: name, style: { display: 'none' } });
document.body.appendChild(_o3); _o3.click(); _o3.remove();
setTimeout(() => URL.revokeObjectURL(url), 60000);
}
function _ox() {
const d = _o22.d;
const list = h('div', { class: 'vf-kit-files', 'data-testid': 'vf-kit-files' });
const box = h('div', { class: 'bds-stack', 'data-testid': 'vf-kit' },
h('div', { class: 'bds-row bds-wrap' }, K.badge(F.KIT_LABEL, 'warn'), h('span', { class: 'vf-note' }, 'Ghép nhanh ra MP4 ngay trên máy này (Chrome/Edge), hoặc tải bộ mảnh đã sắp sẵn rồi ghép trong CapCut.')),
h('ol', { class: 'bds-note', 'data-testid': 'vf-kit-guide' }, F.CAPCUT_GUIDE.map((l) => h('li', null, l.replace(/^\d+\.\s*/, '')))),
h('p', { class: 'vf-note', 'data-testid': 'vf-voice-note' }, 'Giọng đọc: tự thu âm theo tệp lời đọc từng cảnh (hoặc giọng đọc có sẵn trong CapCut). Giọng tiếng Việt của Gemini: chưa xác minh.'),
h('div', { class: 'bds-row bds-wrap' },
K.button('⬇ Tải bộ mảnh (.zip)', async () => {
if (!d.scenes.length) { K.toast('Chưa có cảnh nào', 'warn'); return; }
const _ov = await kitFiles();
download(F.kitName(_ov.title), F.zipStore(_ov.files), 'application/zip');
K.toast(`Đã tạo bộ mảnh ${_ov.files.length} tệp`, 'success');
}, { kind: 'primary', testid: 'vf-kit-zip' }),
K.button('🎬 Ghép nhanh ra MP4', () => _o1f(), { kind: 'primary', testid: 'vf-ghep-open' }),
K.button('Tải từng tệp', async () => {
const _ov = await kitFiles();
list.innerHTML = '';
for (const _of of _ov.files) list.appendChild(K.button('⬇ ' + _of.name, () => download(_of.name, _of.bytes), { testid: 'vf-kit-file-' + _of.name.replace(/[^a-z0-9_.-]/gi, '_') }));
}, { testid: 'vf-kit-list' })),
list, _ok);
return box;
}
const _ok = h('div', { 'data-testid': 'vf-ghep' });
let _ol = null;
function _oj() {
const d = _o22.d, M = mem(d.kind), out = {};
const _o5 = (b64, mime) => new Blob([b64ToBytes(b64)], { type: mime || 'image/png' });
const _o13 = M.mapImg ? _o5(M.mapImg.b64, M.mapImg.mime) : M.mapPng ? _o5(M.mapPng, 'image/png') : null;
const photos = (M.photos || []).map((_o1h) => ({ name: _o1h.name, blob: _o5(_o1h.b64, _o1h.mime) }));
let _ou = 0;
d.scenes.forEach((s, i) => {
const _of = M.files[i];
if (_of && _of.bytes) out[i] = { name: _of.name, blob: new Blob([_of.bytes], { type: /\.mov$/i.test(_of.name) ? 'video/quicktime' : /\.webm$/i.test(_of.name) ? 'video/webm' : 'video/mp4' }) };
else if (d.kind === 'map' && _o13) out[i] = { name: 'ban-do.png', blob: _o13 };
else if (photos.length) out[i] = photos[_ou++ % photos.length];
});
return out;
}
async function _o1f() {
const d = _o22.d;
if (!d.scenes.length) { K.toast('Chưa có cảnh nào', 'warn'); return; }
try { if (_ol) _ol.destroy(); } catch { }
const box = h('div');
_ok.replaceChildren(box);
const { mountGhep } = await import('../_lib/ghep_ui.js');
const t = (_o22.idea && _o22.idea.title) || (d.kind === 'map' ? d.map && d.map.title : d.plan && d.plan.title) || F.kindById(d.kind).label;
_ol = mountGhep(box, { scenes: d.scenes, clips: _oj(), title: t, ctx,
kitExport: async () => { const _ov = await kitFiles(); download(F.kitName(_ov.title), F.zipStore(_ov.files), 'application/zip'); } });
box.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function prefill({ idea = null, text = '' } = {}) {
_o22.idea = idea && idea.id ? { id: idea.id, title: idea.title || '' } : null;
const t = String(text || (idea ? [idea.title, idea.summary, idea.url].filter(Boolean).join('\n') : '')).slice(0, 3000);
if (!t) { _oc(); return; }
_o1e('market', { fresh: true });
_o22.d.input.link = t; _o1w(); _oc();
}
const _ow = F.kindFromParam(fn);
if (_ow) _o1e(_ow); else _oc();
const _o24 = () => _o22.timers.forEach(clearTimeout);
const _o1d = setInterval(() => { if (!alive()) { _o24(); clearInterval(_o1d); } }, 5000);
return { prefill };
}
export function videoAiSelftest() {
const d = [];
try {
if (F.KINDS.length !== 3) d.push('Thiếu dạng video');
if (F.buildSrt([{ say: 'a', seconds: 2 }]) !== '1\n00:00:00,000 --> 00:00:02,000\na\n') d.push('Phụ đề .srt sai');
if (F.unzipStore(F.zipStore([{ name: 'a.txt', bytes: new TextEncoder().encode('x') }]))[0].name !== 'a.txt') d.push('Bộ mảnh .zip sai');
const e = VA.estimate([{ provider: 'veo_api', unit: 'usd_per_second', value: 0.5 }], { provider: 'veo_api', seconds: 8 });
if (!e.ok || e.usd !== 4) d.push('Ước tính chi phí sai');
if (VA.clipView(VA.clipRow({ provider: 'flow', prompt: 'p', url: 'https://a.b/c' })).url !== 'https://a.b/c') d.push('Bản ghi clip sai');
} catch (err) { d.push('Lỗi: ' + (err && err.message)); }
return d;
}

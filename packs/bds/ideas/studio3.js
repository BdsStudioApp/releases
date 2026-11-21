import { h } from '../_lib/kit.js';
import * as V3 from '../_lib/video3.js';
import * as SV from '../_lib/services.js';
import * as RP from '../_lib/render_plan.js';
import * as VA from '../_lib/videoai.js';
import { withRules } from '../../../shared/ai_rules.js';
const _o0 = (fn) => 'bds.video3.' + fn;
const _o1 = 2500;
const _o10 = (_ov) => { try { return JSON.parse(localStorage.getItem(_ov) || 'null'); } catch { return null; } };
const _o11 = (_ov, v) => { try { localStorage.setItem(_ov, JSON.stringify(v)); } catch { } };
const safeHref = (u) => { try { const _o2g = new URL(String(u || '')); return _o2g.protocol === 'https:' ? _o2g.href : null; } catch { return null; } };
const today = () => new Date().toISOString().slice(0, 10);
const _o16 = (e) => (e && (e.userMessage || e.message)) || String(e || 'Lỗi');
export async function mountStudio3(el, ctx, K, { usePrompt = () => {}, onSaved = () => {}, openClips = () => {}, initial = '' } = {}) {
const _o1d = ((ctx.user && ctx.user.role) || 'owner') === 'owner';
const alive = () => el.isConnected;
const _o1x = { fn: '', d: null, svc: { status: null, old: false, error: '' }, prices: [], chars: [], timers: [], busy: false };
const _o3 = () => !!(ctx.ai && typeof ctx.ai.run === 'function');
el.innerHTML = '';
const fnBar = h('div', { class: 'v3-fns', role: 'group', 'aria-label': 'Chọn chức năng', 'data-testid': 'v3-fns' });
const _o1f = h('div', { class: 'v3-panel', 'data-testid': 'v3-panel' });
el.appendChild(K.card({ title: '🎬 Làm video theo 3 chức năng', testid: 'v3', body: h('div', null,
h('p', { class: 'bds-muted' }, 'Chọn một chức năng → AI đề xuất ý tưởng và dàn cảnh → anh/chị duyệt, sửa, chọn nhân vật → chọn dịch vụ dựng / giọng đọc / cảnh AI → kết nối và dựng. Dịch vụ ngoài trả phí riêng theo gói của từng hãng.'),
fnBar, _o1f) }));
for (const _oq of V3.FUNCS) {
fnBar.appendChild(h('button', { type: 'button', class: 'v3-fn', 'aria-pressed': 'false', 'data-v': _oq.id, 'data-testid': 'v3-fn-' + _oq.id, onclick: () => _od(_oq.id) },
h('span', { class: 'v3-fn-i', 'aria-hidden': 'true' }, _oq.icon), h('b', null, _oq.label), h('small', null, _oq.desc)));
}
const blank = (fn) => ({ fn, input: { name: '', extras: '', contact: '', format: 'vertical', text: '', desc: '', style: 'modern', people: 'couple', action: 'living', seconds: 8 },
plan: null, scenes: [], approved: false, edited: false, char: '', render: 'shotstack', voice: 'vbee', voiceCode: '', voiceId: '', speed: '1.1', selfUrl: '', sceneAi: fn === 'walk' ? 'flow' : 'none',
walk: null, image: null, renderId: '', clipId: '' });
const _o1p = () => { if (_o1x.d) { const { image, ...rest } = _o1x.d; _o11(_o0(_o1x.d.fn), rest); } };
function _od(fn) {
_o1x.fn = fn;
_o1x.d = { ...blank(fn), ...(_o10(_o0(fn)) || {}), fn, image: null };
for (const b of fnBar.children) b.setAttribute('aria-pressed', String(b.dataset.v === fn));
_ol();
}
async function _oz() {
try { _o1x.svc = { status: SV.normStatus(await K.api('svc.status', {})), old: false, error: '' }; }
catch (e) { _o1x.svc = { status: SV.normStatus({}), old: SV.isOldServer(e), error: SV.isOldServer(e) ? '' : _o16(e) }; }
}
async function _oy() { const v = await K.setting('svc_prices', null); _o1x.prices = Array.isArray(v) ? v : []; }
async function _ox() { _o1x.chars = (await K.list('characters')).filter((_o9) => _o9.lock_en || _o9.voice); }
const _of = (id) => !!(_o1x.svc.status && _o1x.svc.status[id] && _o1x.svc.status[id].connected);
const verified = (id) => { const s = _o1x.svc.status && _o1x.svc.status[id]; return s ? s.verified !== false : SV.byId(id).verified !== false; };
const step = (_o17, title, body, testid) => h('section', { class: 'v3-step', 'data-testid': testid }, h('h4', null, h('span', { class: 'v3-n' }, _o17), ' ', title), body);
function _ol() { _om(); _o1x.outEl = _o1f.querySelector('[data-testid="v3-out"]'); }
function _om() {
_o1f.innerHTML = '';
if (!_o1x.d) { _o1f.appendChild(K.empty('Chọn một trong ba chức năng ở trên để bắt đầu.')); return; }
const d = _o1x.d;
if (d.fn === 'walk') return _on();
_o1f.appendChild(step(1, d.fn === 'map' ? 'Dự án và tiện ích' : 'Link bài báo / chủ đề', _ot(), 'v3-step1'));
_o1f.appendChild(step(2, 'AI đề xuất ý tưởng + dàn cảnh (anh/chị duyệt – chưa tốn tiền)', _o1k(), 'v3-step2'));
if (d.plan) {
_o1f.appendChild(step(3, 'Sửa nội dung từng cảnh, chọn nhân vật', _oo(), 'v3-step3'));
_o1f.appendChild(step(4, 'Chọn dịch vụ cho từng việc', _o1u(), 'v3-step4'));
_o1f.appendChild(step(5, 'Kết nối & dựng', _oi(), 'v3-step5'));
}
}
function _ot() {
const d = _o1x.d, I = d.input;
const _o6 = (_o2g, _ov) => { _o2g.addEventListener('input', () => { I[_ov] = _o2g.value; _o1p(); }); return _o2g; };
if (d.fn === 'map') {
return h('div', { class: 'bds-stack' },
K.field('Tên dự án', _o6(h('input', { type: 'text', value: I.name, 'data-testid': 'v3-map-name', placeholder: 'vd Chủ đầu tư Khu đô thị 2' }), 'name')),
K.field('Tiện ích muốn thêm (tuỳ chọn)', _o6(h('textarea', { rows: 2, value: I.extras, 'data-testid': 'v3-map-extras', placeholder: 'vd trường Dự án, bệnh viện Dự án, ga metro…' }), 'extras'),
`Tối đa ${V3.MAX_POIS} tiện ích. Khoảng cách không có nguồn ghi "đường chim bay"; hạ tầng chưa xong ghi "theo quy hoạch".`),
h('div', { class: 'bds-grid2' },
K.field('Số liên hệ cảnh kết', _o6(h('input', { type: 'tel', value: I.contact, 'data-testid': 'v3-contact', placeholder: 'SĐT của anh/chị' }), 'contact')),
K.field('Khung hình', (() => { const s = K.select([['vertical', 'Dọc 1080x1920 (TikTok/Reels)'], ['horizontal', 'Ngang 1920x1080']], I.format, { 'data-testid': 'v3-format' }); s.addEventListener('change', () => { I.format = s.value; _o1p(); }); return s; })())));
}
return h('div', { class: 'bds-stack' },
K.field('Link bài báo, văn bản hoặc chủ đề', _o6(h('textarea', { rows: 3, value: I.text, 'data-testid': 'v3-news-input', placeholder: 'https://vnexpress.net/… hoặc "Metro số 5 Văn Cao – Hoà Lạc"' }), 'text'),
'AI đọc link, kiểm chứng rồi đưa bản phân tích ngắn + dàn cảnh để anh/chị duyệt. Tin tài chính chỉ giải thích chính sách, không ví dụ trả góp.'));
}
function _o1k() {
const d = _o1x.d;
const box = h('div', { class: 'bds-stack' });
box.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button(d.plan ? '↻ Đề xuất lại' : '✨ AI đề xuất ý tưởng + dàn cảnh', () => _o1j(), { kind: 'primary', testid: 'v3-propose' }),
_o3() ? null : h('small', { class: 'bds-muted' }, 'Chưa bật AI – app dựng khung có sẵn để anh/chị tự điền.')));
if (!d.plan) return box;
box.appendChild(_o4());
const _o1i = V3.contentProblems({ ...d.plan, scenes: d.scenes });
if (_o1i.length) {
box.appendChild(h('ul', { class: 'v3-probs', 'data-testid': 'v3-problems' }, _o1i.map((_o1e) => h('li', { class: _o1e.level === 'error' ? 'v3-err' : 'v3-warn', 'data-level': _o1e.level }, (_o1e.level === 'error' ? '⛔ ' : '⚠ ') + _o1e.msg))));
if (d.fn === 'news' && _o1i.some((_o1e) => _o1e.level === 'error' && /theo quy hoạch/.test(_o1e.msg))) {
box.appendChild(K.button('Thêm "theo quy hoạch / dự kiến" vào cảnh hạ tầng', () => { const _oq = V3.fixPlanned({ ...d.plan, scenes: d.scenes }); d.scenes = _oq.scenes; _o26(); _ol(); }, { testid: 'v3-fix-planned' }));
}
}
const ok = V3.canApprove({ ...d.plan, scenes: d.scenes }).ok;
if (d.approved) box.appendChild(h('p', { class: 'bds-ok', 'data-testid': 'v3-approved' }, '✓ Anh/chị đã duyệt dàn cảnh – sửa thêm thì phải duyệt lại.'));
else {
if (d.edited) box.appendChild(h('p', { class: 'bds-muted', 'data-testid': 'v3-reapprove' }, 'Dàn cảnh đã sửa – xem lại rồi bấm Duyệt.'));
const b = K.button('✓ Duyệt dàn cảnh', () => { d.approved = true; d.edited = false; _o1p(); _ol(); }, { kind: 'primary', testid: 'v3-approve' });
b.disabled = !ok;
box.appendChild(h('div', { class: 'bds-row bds-wrap' }, b, ok ? null : h('small', { class: 'bds-error' }, 'Sửa các dòng ⛔ trước khi duyệt.')));
}
return box;
}
function _o4() {
const d = _o1x.d, _o1e = d.plan;
if (d.fn === 'map') {
const P = _o1e.project || {};
const rows = (_o1e.pois || []).map((q, i) => h('div', { class: 'v3-poi', 'data-testid': 'v3-poi-' + i },
h('b', null, q.name), h('span', null, q.dist_text || 'chưa có khoảng cách'), q.line ? h('small', { class: 'bds-muted' }, q.line) : null, K.badge(V3.measureLabel(q), q.measure === 'chim_bay' ? 'warn' : 'info'),
q.status !== 'existing' ? K.badge(V3.STATUSES[q.status], 'warn') : null,
safeHref(q.source) ? h('a', { href: safeHref(q.source), target: '_blank', rel: 'noopener noreferrer' }, 'Nguồn ↗') : h('small', { class: 'bds-muted' }, 'chưa có nguồn'),
K.button('✕', () => { _o1e.pois.splice(i, 1); d.plan = V3.normalizeMapPlan(_o1e); d.scenes = V3.mapScenes(d.plan, { contact: d.input.contact }); _o26(); _ol(); }, { testid: 'v3-poi-del-' + i, title: 'Bỏ tiện ích này' })));
return h('div', { class: 'bds-note v3-analysis', 'data-testid': 'v3-analysis' },
h('div', null, h('b', null, P.name || 'Dự án'), P.address ? ' – ' + P.address : '', P.source && safeHref(P.source) ? h('a', { href: safeHref(P.source), target: '_blank', rel: 'noopener noreferrer' }, ' (nguồn ↗)') : null),
h('small', { class: 'bds-muted' }, _o1e.map_note),
rows.length ? h('div', { class: 'v3-pois' }, rows) : h('p', { class: 'bds-muted' }, 'Chưa có tiện ích – thêm ở bước 1 rồi đề xuất lại.'));
}
return h('div', { class: 'bds-note v3-analysis', 'data-testid': 'v3-analysis' },
h('div', null, h('b', null, _o1e.title || 'Tin BĐS'), _o1e.date ? ' · ' + _o1e.date : ''),
_o1e.summary ? h('p', null, _o1e.summary) : null,
h('div', { class: 'bds-row bds-wrap' }, K.badge(_o1e.kind === 'map' ? 'Bản đồ quy hoạch' : 'Bản tin đồ hoạ', 'info'), K.badge(V3.STATUSES[_o1e.status] || '', _o1e.status === 'existing' ? 'muted' : 'warn'),
_o1e.hook_type ? K.badge('Mở đầu kiểu ' + _o1e.hook_type, 'muted') : null, _o1e.finance ? K.badge('Tin tài chính – chỉ giải thích chính sách', 'danger') : null),
(_o1e.sources || []).length ? h('small', null, 'Nguồn: ', (_o1e.sources || []).map((s, i) => [i ? ', ' : '', h('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer' }, s.name || s.url)])) : null);
}
async function _o1j() {
const d = _o1x.d;
if (_o1x.busy) return;
if (d.fn === 'map' && !d.input.name.trim()) { K.toast('Nhập tên dự án trước', 'warn'); return; }
if (d.fn === 'news' && !d.input.text.trim()) { K.toast('Dán link bài báo hoặc gõ chủ đề trước', 'warn'); return; }
_o1x.busy = true;
let plan = null;
if (_o3()) {
try {
const prompt = d.fn === 'map' ? V3.buildMapPrompt({ name: d.input.name, extras: d.input.extras, today: today() }) : V3.buildNewsPrompt({ input: d.input.text, today: today() });
const r = await ctx.ai.run('ideas', { prompt: withRules(prompt), json: true });
const text = (r && (r.text ?? r)) || '';
plan = d.fn === 'map' ? V3.parseMapPlan(text) : V3.parseNewsPlan(text, { input: d.input.text });
if (d.fn === 'map' && !plan.project.name) plan = null;
if (d.fn === 'news' && plan.scenes.length < 2) plan = null;
if (!plan) K.toast('AI chưa trả về dàn cảnh đúng định dạng – dùng khung có sẵn', 'warn');
} catch (e) { K.toast('AI chưa trả lời (' + _o16(e) + ') – dùng khung có sẵn', 'warn'); }
}
if (!plan) plan = d.fn === 'map' ? V3.mapFallback({ name: d.input.name, extras: d.input.extras }) : V3.newsFallback({ input: d.input.text });
if (d.fn === 'map' && !plan.project.name) plan.project.name = d.input.name.trim();
d.plan = plan;
d.scenes = d.fn === 'map' ? V3.mapScenes(plan, { contact: d.input.contact }) : plan.scenes;
d.approved = false; d.edited = false; d.renderId = ''; d.clipId = '';
_o1x.busy = false; _o1p(); _ol();
}
function _o26() { const d = _o1x.d; if (d.approved) { d.approved = false; d.edited = true; } _o1p(); }
function _oo() {
const d = _o1x.d;
const list = h('div', { class: 'v3-scenes', 'data-testid': 'v3-scenes' });
const _ow = d.fn === 'map' ? { intro: 'Mở đầu', poi: 'Tiện ích', outro: 'Kết' } : V3.NEWS_KINDS;
d.scenes.forEach((s, i) => {
const text = h('textarea', { rows: 2, value: s.text || '', 'data-testid': 'v3-sc-text-' + i, 'aria-label': 'Chữ trên hình cảnh ' + (i + 1) });
const say = h('textarea', { rows: 2, value: s.say || '', 'data-testid': 'v3-sc-say-' + i, 'aria-label': 'Lời đọc cảnh ' + (i + 1) });
const wc = h('small', { class: 'bds-muted', 'data-testid': 'v3-sc-wc-' + i });
const _o29 = () => { const _o17 = V3.words(say.value); wc.textContent = `${_o17} chữ ≈ ${String(RP.sceneSeconds({ ...s, say: say.value, seconds: undefined })).replace('.', ',')} giây` + (_o17 > V3.MAX_SAY_WORDS && s.kind !== 'checklist' ? ' – dài hơn 4 giây' : ''); };
text.addEventListener('change', () => { s.text = text.value; _o26(); _ol(); });
say.addEventListener('input', _o29);
say.addEventListener('change', () => { s.say = say.value; _o26(); _ol(); });
_o29();
const facts = d.fn === 'news' ? (() => {
const ta = h('textarea', { rows: 2, 'data-testid': 'v3-sc-facts-' + i, 'aria-label': 'Số liệu cảnh ' + (i + 1), placeholder: 'Mỗi dòng: số liệu | link nguồn | tháng (vd 4,8 km | https://… | 11/2026)',
value: (s.facts || []).map((_oq) => [_oq.text, _oq.source, _oq.month].join(' | ')).join('\n') });
ta.addEventListener('change', () => { s.facts = ta.value.split('\n').map((l) => l.split('|').map((_o2g) => _o2g.trim())).filter((_o2g) => _o2g[0]).map(([t, src, _o12]) => ({ text: t, source: safeHref(src) || '', month: _o12 || '' })); _o26(); _ol(); });
return K.field('Số liệu + nguồn + tháng', ta);
})() : null;
const _o15 = (dir) => { const _ou = i + dir; if (_ou < 0 || _ou >= d.scenes.length) return; [d.scenes[i], d.scenes[_ou]] = [d.scenes[_ou], d.scenes[i]]; _o26(); _ol(); };
const cv = h('canvas', { width: 135, height: 240, class: 'v3-prev', 'aria-label': 'Xem trước cảnh ' + (i + 1), 'data-testid': 'v3-prev-' + i });
try { const _or = cv.getContext && cv.getContext('2d'); if (_or) RP.drawSceneCanvas(_or, s, { map: d.fn === 'map' ? d.plan : null, brand: d.plan.brand, width: 135, height: 240 }); } catch { }
list.appendChild(h('div', { class: 'v3-scene', 'data-testid': 'v3-scene-' + i }, cv,
h('div', { class: 'v3-scene-b' },
h('div', { class: 'bds-row bds-wrap' }, h('b', null, 'Cảnh ' + (i + 1)), K.badge(_ow[s.kind] || s.kind, 'muted'),
K.button('↑', () => _o15(-1), { testid: 'v3-sc-up-' + i, title: 'Lên' }), K.button('↓', () => _o15(1), { testid: 'v3-sc-down-' + i, title: 'Xuống' }),
K.button('Xoá', () => { d.scenes.splice(i, 1); _o26(); _ol(); }, { kind: 'danger', testid: 'v3-sc-del-' + i })),
K.field('Chữ trên hình', text), K.field('Lời đọc (≤ ' + V3.MAX_SAY_WORDS + ' chữ ≈ 4 giây)', say, null), wc, facts)));
});
const _o2 = d.fn === 'map' ? 'poi' : 'stat';
const charSel = h('select', { 'data-testid': 'v3-char' }, h('option', { value: '' }, _o1x.chars.length ? '— Không dùng nhân vật —' : 'Chưa có nhân vật trong thư viện'),
_o1x.chars.map((_o9) => h('option', { value: _o9.id, selected: _o9.id === d.char }, _o9.name)));
charSel.addEventListener('change', () => {
d.char = charSel.value;
const _o9 = _o1x.chars.find((_o2g) => _o2g.id === d.char);
if (_o9 && _o9.voice && d.voice === 'vbee') d.voiceCode = _o9.voice;
_o1p(); _ol();
});
return h('div', { class: 'bds-stack' }, list,
h('div', { class: 'bds-row bds-wrap' }, K.button('+ Thêm cảnh', () => { d.scenes.splice(Math.max(0, d.scenes.length - 1), 0, { kind: _o2, text: 'Cảnh mới', say: '', facts: [] }); _o26(); _ol(); }, { testid: 'v3-sc-add' })),
K.field('Nhân vật (thư viện Nhân vật)', charSel, 'Đổi nhân vật: giọng đọc gợi ý theo nhân vật (Vbee), câu khoá ngoại hình dùng cho cảnh AI.'));
}
function _o21(task, value, testid, extraOpts = []) {
const _o1b = [...extraOpts, ...SV.forTask(task).map((s) => [s.id, s.label + (verified(s.id) ? '' : ' (chưa xác minh)')])];
return K.select(_o1b, value, { 'data-testid': testid });
}
function _o1z(id) {
const s = SV.byId(id);
if (!s) return null;
return h('div', { class: 'v3-svc-note', 'data-testid': 'v3-note-' + id },
h('small', { class: 'bds-muted' }, s.hint || ''),
s.paid ? h('small', { class: 'v3-paid' }, '💳 ' + SV.PAID_NOTE + '.') : h('small', { class: 'bds-ok' }, 'Không tốn phí app.'),
verified(id) ? null : K.badge('chưa xác minh', 'danger'));
}
function _o1u() {
const d = _o1x.d;
const _o1n = _o21('render', d.render, 'v3-svc-render');
_o1n.addEventListener('change', () => { d.render = _o1n.value; _o1p(); _ol(); });
const _o2e = _o21('voice', d.voice, 'v3-svc-voice');
_o2e.addEventListener('change', () => { d.voice = _o2e.value; _o1p(); _ol(); });
const _oj = _o21('scene', d.sceneAi, 'v3-svc-scene', [['none', 'Không dùng cảnh AI']]);
_oj.addEventListener('change', () => { d.sceneAi = _oj.value; _o1p(); _ol(); });
return h('div', { class: 'bds-stack' },
K.field('Dựng video bằng', _o1n), _o1z(d.render),
K.field('Giọng đọc', _o2e), _o1z(d.voice), _o2a(),
K.field('Cảnh AI (B-roll, người xem nhà – tuỳ chọn)', _oj), d.sceneAi !== 'none' ? _o1z(d.sceneAi) : null,
d.sceneAi !== 'none' ? K.button('Mở "Tạo cảnh AI" với cảnh chung cho video này', () => _o1t(), { testid: 'v3-scene-ai' }) : null);
}
function _o2a() {
const d = _o1x.d;
if (d.voice === 'self') {
const u = h('input', { type: 'url', value: d.selfUrl, 'data-testid': 'v3-self-url', placeholder: 'https://… link tệp âm thanh (mp3/m4a/wav) đã thu', style: { width: '100%' } });
u.addEventListener('change', () => { d.selfUrl = safeHref(u.value) || ''; if (u.value && !d.selfUrl) K.toast('Link phải bắt đầu bằng https://', 'warn'); _o1p(); });
return h('div', { class: 'bds-stack' }, K.field('Link tệp lời đọc tự thu (cả bài)', u, 'Thu theo lời đọc ở bước 3, đưa tệp lên Google Drive (chia sẻ công khai) hoặc nơi có link https rồi dán vào đây.'),
K.button('Chép toàn bộ lời đọc', async () => { await K.copy(d.scenes.map((s, i) => `${i + 1}. ${s.say}`).join('\n')); K.toast('Đã chép lời đọc', 'success'); }, { testid: 'v3-copy-say' }));
}
const _o2d = SV.voicesFor(d.voice);
const cur = d.voiceCode || (_o2d[0] && _o2d[0].code) || '';
const _o1s = K.select(_o2d.map((v) => [v.code, v.label]), cur, { 'data-testid': 'v3-voice' });
_o1s.addEventListener('change', () => { d.voiceCode = _o1s.value; _o1p(); });
const _o1w = K.select([['0.9', 'Chậm 0,9'], ['1', 'Thường 1,0'], ['1.1', 'Nhanh 1,1 (mặc định skill)'], ['1.2', 'Nhanh 1,2']], d.speed, { 'data-testid': 'v3-voice-speed' });
_o1w.addEventListener('change', () => { d.speed = _o1w.value; _o1p(); });
const vid = d.voice === 'elevenlabs' ? (() => { const _o2g = h('input', { type: 'text', value: d.voiceId, 'data-testid': 'v3-voice-id', placeholder: 'Voice ID (tuỳ chọn)' }); _o2g.addEventListener('change', () => { d.voiceId = _o2g.value.trim(); _o1p(); }); return K.field('Voice ID ElevenLabs', _o2g); })() : null;
const _o1c = h('div', { 'data-testid': 'v3-voice-out' });
return h('div', { class: 'bds-stack' }, h('div', { class: 'bds-grid2' }, K.field('Giọng', _o1s), K.field('Tốc độ', _o1w)), vid,
h('div', { class: 'bds-row bds-wrap' }, K.button('▶ Nghe thử (đoạn ngắn – tốn phí)', () => _o27(_o1c), { testid: 'v3-voice-try' })), _o1c);
}
const _o2b = () => { const d = _o1x.d; return d.voice === 'elevenlabs' ? (d.voiceId || d.voiceCode || '') : (d.voiceCode || (SV.voicesFor(d.voice)[0] || {}).code || ''); };
async function _o27(_o1c) {
const d = _o1x.d;
if (!_o20(d.voice)) return;
const text = (d.scenes.find((s) => s.say) || {}).say || 'Xin chào, đây là giọng đọc thử.';
const _o1o = text.slice(0, 120);
const u = { task: 'voice', chars: _o1o.length };
if (!(await K.confirm({ title: 'Nghe thử giọng – tốn phí', text: `${SV.byId(d.voice).label}: ${SV.costLine(d.voice, u, _o1x.prices)}. ${SV.PAID_NOTE}.`, ok: 'Đồng ý – nghe thử', testid: 'v3-confirm-try' }))) return;
_o1c.textContent = 'Đang tạo giọng thử…';
try {
const r = await _o28(_o1o);
_o1c.innerHTML = '';
if (r.url) _o1c.appendChild(h('audio', { controls: true, preload: 'none', src: r.url, 'data-testid': 'v3-voice-audio' }));
else _o1c.appendChild(h('p', { class: 'bds-muted' }, 'Máy chủ tạo được giọng nhưng chưa có link công khai để nghe/dựng (cần máy chủ lưu tệp).'));
} catch (e) { _o1c.innerHTML = ''; _o1c.appendChild(h('p', { class: 'bds-error', 'data-testid': 'v3-voice-err' }, '✗ ' + (SV.isOldServer(e) ? SV.OLD_SERVER_TEXT : _o16(e)))); }
}
async function _o28(text) {
const d = _o1x.d;
let r = SV.ttsResult(await K.api('svc.tts', { provider: d.voice, text, voice: _o2b(), speed: Number(d.speed) || 1 }));
for (let _o17 = 0; r.state === 'pending' && _o17 < 60; _o17++) {
await new Promise((_o1l) => _o1x.timers.push(setTimeout(_o1l, _o1)));
if (!alive()) throw new Error('Đã rời màn');
r = SV.ttsResult(await K.api('svc.tts.status', { id: r.id, provider: d.voice }));
}
if (r.state === 'error') throw new Error(r.error);
if (r.state === 'pending') throw new Error('Tạo giọng quá lâu – thử lại sau');
return r;
}
function _o20(id) {
if (_o1x.svc.old) { K.toast(SV.OLD_SERVER_TEXT, 'warn'); return false; }
if (!_of(id)) { K.toast(`Chưa kết nối ${SV.byId(id).label} – bấm "Kết nối" ở bước 5`, 'warn'); return false; }
return true;
}
function _o1t() {
const d = _o1x.d;
const title = d.fn === 'map' ? (d.plan.project.name || 'Dự án') : (d.plan.title || 'Tin BĐS');
const _o9 = _o1x.chars.find((_o2g) => _o2g.id === d.char);
const _o1e = VA.buildPrompt({ kind: _o9 ? 'presenter' : 'broll', subject: d.fn === 'map' ? 'establishing shot of a generic modern residential neighbourhood with parks and roads (not a real, identifiable project)' : 'generic city street, construction site or residential area related to: ' + title,
character: _o9 || null, aspect: d.input.format === 'horizontal' ? '16:9' : '9:16', seconds: 8 });
usePrompt({ prompt: _o1e.prompt, negative: _o1e.negative, seconds: 8, aspect: d.input.format === 'horizontal' ? '16:9' : '9:16', provider: d.sceneAi, title: 'Cảnh AI – ' + title, kind: _o9 ? 'presenter' : 'broll' });
}
function _oi() {
const d = _o1x.d;
const box = h('div', { class: 'bds-stack' });
if (_o1x.svc.old) box.appendChild(h('p', { class: 'bds-note v3-old', 'data-testid': 'v3-old-server' }, '⬆ ' + SV.OLD_SERVER_TEXT + '. Trong lúc chờ, anh/chị vẫn dùng được "Chuyển cho Claude dựng", cảnh AI và chép lời đọc.'));
else if (_o1x.svc.error) box.appendChild(h('p', { class: 'bds-error', 'data-testid': 'v3-svc-error' }, '✗ Chưa đọc được trạng thái dịch vụ: ' + _o1x.svc.error));
box.appendChild(h('p', { class: 'v3-paid', 'data-testid': 'v3-paid-note' }, '💳 ' + SV.PAID_NOTE + '.'));
const rows = h('div', { class: 'v3-conns', 'data-testid': 'v3-conns' });
for (const id of SV.SERVER_IDS) rows.appendChild(_og(id));
box.appendChild(rows);
box.appendChild(_o1h());
const _o1c = h('div', { 'data-testid': 'v3-out', 'aria-live': 'polite' });
const act = h('div', { class: 'bds-row bds-wrap' });
if (!d.approved) act.appendChild(h('small', { class: 'bds-muted', 'data-testid': 'v3-need-approve' }, 'Duyệt dàn cảnh ở bước 2 trước khi tạo giọng / dựng.'));
if (['vbee', 'elevenlabs'].includes(d.voice)) {
const b = K.button('🎙 Tạo giọng đọc ' + d.scenes.filter((s) => s.say).length + ' cảnh', () => _o13(_o1c), { testid: 'v3-tts' });
b.disabled = !d.approved; act.appendChild(b);
}
if (d.render === 'shotstack') {
const b = K.button('🎬 Dựng video (Shotstack)', () => render(_o1c), { kind: 'primary', testid: 'v3-render' });
b.disabled = !d.approved; act.appendChild(b);
}
const _oc = K.button('📋 Chuyển cho Claude dựng bằng skill', () => _o7(), { testid: 'v3-brief' });
_oc.disabled = !d.approved; act.appendChild(_oc);
box.appendChild(act);
const _o2c = d.scenes.filter((s) => s.audio_url).length;
if (_o2c) box.appendChild(h('small', { class: 'bds-ok', 'data-testid': 'v3-voiced' }, `✓ Đã có giọng ${_o2c}/${d.scenes.filter((s) => s.say).length} cảnh.`));
box.appendChild(_o1c);
if (d.renderId && !d.clipId && !_o1x.busy) _o1c.appendChild(h('p', { class: 'bds-muted' }, 'Lần dựng trước: ' + d.renderId + ' – bấm Dựng lại nếu chưa thấy clip.'));
return box;
}
function _og(id) {
const s = SV.byId(id), stt = _o1x.svc.status && _o1x.svc.status[id];
const _o19 = _of(id);
const _o1l = h('small', { class: 'bds-muted', 'data-testid': 'v3-test-result-' + id });
const _ok = safeHref((stt && stt.docs_url) || s.docs_url);
return h('div', { class: 'v3-conn', 'data-testid': 'v3-conn-row-' + id },
h('div', { class: 'v3-conn-h' }, h('b', null, s.label),
K.badge(_o1x.svc.old ? 'Cần cập nhật máy chủ' : _o19 ? 'Đã nối' : 'Chưa nối', _o1x.svc.old ? 'warn' : _o19 ? 'success' : 'muted'),
verified(id) ? null : K.badge('chưa xác minh', 'danger')),
h('div', { class: 'bds-row bds-wrap' },
_o1d ? K.button(_o19 ? 'Đổi khoá' : 'Kết nối', () => _oh(id), { kind: _o19 ? 'ghost' : 'primary', testid: 'v3-conn-' + id }) : null,
_o19 ? K.button('Thử', () => _o23(id, _o1l), { testid: 'v3-test-' + id }) : null,
_o19 && _o1d ? K.button('Gỡ', () => _oe(id), { kind: 'danger', testid: 'v3-clear-' + id }) : null,
_ok ? h('a', { href: _ok, target: '_blank', rel: 'noopener noreferrer', class: 'v3-link' }, 'Tài liệu ↗') : null,
safeHref(s.pricing_url) ? h('a', { href: safeHref(s.pricing_url), target: '_blank', rel: 'noopener noreferrer', class: 'v3-link' }, 'Bảng giá hãng ↗') : null),
stt && stt.hint ? h('small', { class: 'bds-muted' }, stt.hint) : null, _o1l);
}
function _oh(id) {
if (_o1x.svc.old) { K.toast(SV.OLD_SERVER_TEXT, 'warn'); return; }
const s = SV.byId(id);
const key = h('input', { type: 'password', autocomplete: 'off', 'data-testid': 'v3-key', placeholder: s.key_label, 'aria-label': s.key_label, style: { width: '100%' } });
const extra = s.extra ? (s.extra.options ? K.select(s.extra.options, s.extra.options[0][0], { 'data-testid': 'v3-extra' })
: h('input', { type: 'text', 'data-testid': 'v3-extra', placeholder: s.extra.placeholder || '', style: { width: '100%' } })) : null;
const err = h('p', { class: 'bds-error', 'data-testid': 'v3-key-err' });
let _o12;
const _o1q = K.button('Lưu khoá trên máy chủ', async () => {
const _ov = key.value.trim();
if (!_ov) { err.textContent = 'Dán khoá trước khi lưu.'; return; }
_o1q.disabled = true;
try {
await K.api('svc.set', { id, key: _ov, extra: extra ? String(extra.value || '').trim() || undefined : undefined });
key.value = '';
_o12.close(); K.toast('Đã lưu khoá ' + s.label + ' trên máy chủ (không hiện lại)', 'success');
await _oz(); _ol();
} catch (e) { _o1q.disabled = false; err.textContent = '✗ ' + (SV.isOldServer(e) ? SV.OLD_SERVER_TEXT : _o16(e)); }
}, { kind: 'primary', testid: 'v3-key-save' });
_o12 = K.modal({ title: 'Kết nối ' + s.label, testid: 'v3-conn-dialog', body: [
h('p', { class: 'v3-paid' }, '💳 ' + SV.PAID_NOTE + '.'),
verified(id) ? null : h('p', { class: 'bds-error' }, 'Chưa xác minh: app chưa đối chiếu được tài liệu API chính thức của hãng này – anh/chị tự kiểm trước khi dùng.'),
h('p', { class: 'bds-muted' }, s.hint || ''),
safeHref(s.docs_url) ? h('p', null, h('a', { href: safeHref(s.docs_url), target: '_blank', rel: 'noopener noreferrer' }, 'Tài liệu của hãng ↗')) : null,
K.field(s.key_label, key, 'Khoá chỉ lưu trên máy chủ của anh/chị – app không đọc lại được.'),
extra ? K.field(s.extra.label, extra) : null, err,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _o12.close(), { testid: 'v3-key-cancel' }), _o1q)] });
}
async function _o23(id, _o1l) {
_o1l.textContent = 'Đang thử…';
try { const r = await K.api('svc.test', { id }); _o1l.textContent = (r && r.ok ? '✓ ' : '✗ ') + ((r && r.msg) || (r && r.ok ? 'Kết nối được' : 'Chưa kết nối được')); _o1l.className = r && r.ok ? 'bds-ok' : 'bds-error'; }
catch (e) { _o1l.textContent = '✗ ' + (SV.isOldServer(e) ? SV.OLD_SERVER_TEXT : _o16(e)); _o1l.className = 'bds-error'; }
}
async function _oe(id) {
const s = SV.byId(id);
if (!(await K.confirm({ title: 'Gỡ kết nối ' + s.label + '?', text: 'Khoá trên máy chủ bị xoá – app không dùng dịch vụ này cho tới khi anh/chị nhập khoá mới. Gói/tài khoản ở hãng giữ nguyên.', ok: 'Gỡ', kind: 'danger', testid: 'v3-clear-confirm' }))) return;
try { await K.api('svc.clear', { id }); K.toast('Đã gỡ ' + s.label, 'success'); await _oz(); _ol(); }
catch (e) { K.toast(SV.isOldServer(e) ? SV.OLD_SERVER_TEXT : _o16(e), 'error'); }
}
function _o1h() {
const rows = SV.defaultPrices().map((r) => ({ ...r, ...((_o1x.prices || []).find((_o1e) => _o1e.id === r.id) || {}) }));
const list = h('div', { class: 'bds-list' }, rows.map((r, i) => {
const _os = (_ov, attrs) => { const _o2g = h('input', { ...attrs, value: r[_ov] === null || r[_ov] === undefined ? '' : r[_ov], 'data-testid': `v3-price-${r.id}-${_ov}`, disabled: !_o1d }); _o2g.addEventListener('input', () => { r[_ov] = _o2g.value; }); return _o2g; };
const unit = K.select(SV.PRICE_UNITS, r.unit, { 'data-testid': `v3-price-${r.id}-unit`, 'aria-label': 'Đơn vị', disabled: !_o1d });
unit.addEventListener('change', () => { r.unit = unit.value; });
return h('div', { class: 'v3-price', 'data-testid': 'v3-price-' + i }, h('b', null, SV.byId(r.id).label.split(' – ')[0]),
_os('value', { type: 'number', min: 0, step: 'any', placeholder: 'giá', 'aria-label': 'Giá', size: 6 }), unit,
_os('source_url', { type: 'url', placeholder: 'https://… trang giá', 'aria-label': 'Link trang giá', size: 18 }), _os('checked_at', { type: 'date', 'aria-label': 'Ngày kiểm giá' }));
}));
return h('details', { 'data-testid': 'v3-prices' }, h('summary', null, 'Bảng giá dịch vụ (anh/chị nhập – app không ghi sẵn giá)'),
h('p', { class: 'bds-muted' }, 'Nhập giá theo trang giá chính thức của hãng để app ước tính tiền trước khi gọi. Chưa nhập → app chỉ báo lượng dùng (ký tự, giây video).'),
list, _o1d ? K.button('Lưu bảng giá dịch vụ', async () => {
const _o5 = SV.priceProblem(rows);
if (_o5) { K.toast(_o5, 'warn'); return; }
_o1x.prices = rows.map(SV.priceRow); await K.setSetting('svc_prices', _o1x.prices); K.toast('Đã lưu bảng giá dịch vụ', 'success'); _ol();
}, { kind: 'primary', testid: 'v3-price-save' }) : null);
}
async function _o13(_o1c) {
const d = _o1x.d;
if (!d.approved) { K.toast('Duyệt dàn cảnh trước', 'warn'); return; }
if (!_o20(d.voice)) return;
const _o25 = d.scenes.filter((s) => s.say && !s.audio_url);
if (!_o25.length) { K.toast('Các cảnh đã có giọng', 'info'); return; }
const u = SV.usage('voice', _o25);
if (!(await K.confirm({ title: 'Tạo giọng đọc – tốn phí', text: `${SV.byId(d.voice).label}, ${_o25.length} cảnh: ${SV.costLine(d.voice, u, _o1x.prices)}. ${SV.PAID_NOTE}.`, ok: 'Đồng ý – tạo giọng', testid: 'v3-confirm-tts' }))) return;
_o1x.busy = true;
let ok = 0, noLink = 0;
for (const s of _o25) {
_o1v(_o1c, `Đang tạo giọng ${ok + 1}/${_o25.length}…`);
try { const r = await _o28(s.say); if (r.url) { s.audio_url = r.url; ok++; } else noLink++; }
catch (e) { _o1x.busy = false; _o1p(); _ol(); _o1v(_o1c, '✗ ' + (SV.isOldServer(e) ? SV.OLD_SERVER_TEXT : _o16(e)), 'error'); return; }
}
_o1x.busy = false; _o1p(); _ol();
_o1v(_o1c, noLink ? `Tạo được ${ok} cảnh có link; ${noLink} cảnh máy chủ chưa trả link công khai (cần máy chủ lưu tệp) – Shotstack chỉ dùng được link https.` : `✓ Đã tạo giọng ${ok} cảnh.`, noLink ? '' : 'ok');
}
function _o1v(_o1c, text, tone, extra) {
if (!_o1c || !_o1c.isConnected) _o1c = _o1x.outEl;
if (!_o1c) return;
_o1c.innerHTML = '';
_o1c.appendChild(h('p', { class: tone === 'error' ? 'bds-error' : tone === 'ok' ? 'bds-ok' : 'bds-muted', 'data-testid': tone === 'error' ? 'v3-error' : tone === 'ok' ? 'v3-ok' : 'v3-progress' }, text));
if (extra) _o1c.appendChild(extra);
}
const _op = () => {
const d = _o1x.d;
return { format: d.input.format, map: d.fn === 'map' ? d.plan : null, brand: d.plan.brand, voice_url: d.voice === 'self' ? d.selfUrl : '',
footer: d.fn === 'news' ? ['Số liệu: ' + ((d.plan.sources || []).map((s) => s.name || s.url).join(', ') || 'xem caption')].join(' · ') : '' };
};
async function render(_o1c) {
const d = _o1x.d;
if (_o1x.busy) return;
if (!d.approved) { K.toast('Duyệt dàn cảnh trước', 'warn'); return; }
if (!_o20('shotstack')) return;
const edit = RP.buildShotstackTimeline(d.scenes, _op());
const _o5 = RP.validateEdit(edit);
if (_o5.length) { _o1v(_o1c, '✗ Bản dựng chưa hợp lệ: ' + _o5.slice(0, 3).join('; '), 'error'); return; }
const _o14 = d.voice !== 'self' && d.scenes.some((s) => s.say && !s.audio_url);
const u = SV.usage('render', d.scenes, { seconds: RP.timelineSeconds(edit) });
const ok = await K.confirm({ title: 'Dựng video – tốn phí', testid: 'v3-confirm-render', ok: 'Đồng ý – dựng',
text: `Shotstack: ${SV.costLine('shotstack', u, _o1x.prices)}. ${_o14 ? 'Chưa có giọng đọc ở một số cảnh – video sẽ có phụ đề, không tiếng ở cảnh đó. ' : ''}${SV.PAID_NOTE}.` });
if (!ok) return;
_o1x.busy = true;
_o1v(_o1c, 'Đang gửi bản dựng tới Shotstack…');
try {
const r = await K.api('svc.shotstack.render', { timeline: edit.timeline, output: edit.output });
d.renderId = String((r && r.id) || ''); _o1p();
if (!d.renderId) throw new Error('Máy chủ không trả mã bản dựng');
_o1g(_o1c, edit, u);
} catch (e) { _o1x.busy = false; _o1v(_o1c, '✗ ' + (SV.isOldServer(e) ? SV.OLD_SERVER_TEXT : _o16(e)), 'error'); }
}
function _o1g(_o1c, edit, u) {
const d = _o1x.d, id = d.renderId;
const _o24 = async () => {
if (!alive()) return;
let r;
try { r = await K.api('svc.shotstack.status', { id }); } catch (e) { _o1x.busy = false; _o1v(_o1c, '✗ ' + _o16(e), 'error'); return; }
const s = r && r.status;
if (s === 'failed') { _o1x.busy = false; _o1v(_o1c, '✗ Shotstack báo lỗi: ' + ((r && r.error) || 'không rõ'), 'error'); return; }
const url = s === 'done' ? VA.linkOk(r.url) : '';
if (s !== 'done' || !url) { _o1v(_o1c, s === 'done' ? 'Đã dựng xong, đang chờ link…' : `Shotstack đang ${s === 'queued' ? 'xếp hàng' : 'dựng'}… (có thể mất vài phút)`); _o1x.timers.push(setTimeout(_o24, _o1)); return; }
try { await _o1r(url, edit, u, _o1c); } catch (e) { _o1v(_o1c, '✗ ' + _o16(e), 'error'); }
_o1x.busy = false;
};
_o1x.timers.push(setTimeout(_o24, _o1));
}
function _ob() {
const d = _o1x.d, _o1e = d.plan;
if (d.fn === 'map') {
const P = _o1e.project || {};
return V3.buildCaption({ fn: 'map', title: `${P.short_name || P.name} – vị trí & kết nối`, keyword: P.short_name || P.name, area: String(P.address || '').split(',').pop(),
facts: (_o1e.pois || []).slice(0, 2).map((q) => `${q.name} ${q.dist_text}${q.measure === 'chim_bay' ? ' (đường chim bay)' : ''}`), sources: _o1e.sources });
}
return V3.buildCaption({ fn: 'news', title: _o1e.title, keyword: _o1e.title, facts: d.scenes.flatMap((s) => s.facts || []).filter((_oq) => _oq.source).map((_oq) => _oq.text + (_oq.month ? ` (${_oq.month})` : '')), sources: _o1e.sources });
}
async function _o1r(url, edit, u, _o1c) {
const d = _o1x.d;
const _oa = _ob();
const title = d.fn === 'map' ? 'Video bản đồ – ' + (d.plan.project.short_name || d.plan.project.name) : 'Video tin – ' + (d.plan.title || 'BĐS');
const _o9 = SV.costOf('shotstack', u, _o1x.prices);
const _o1m = await K.put('jobs', VA.clipRow({ provider: 'shotstack', kind: d.fn, title, url, seconds: u.seconds, aspect: d.input.format === 'horizontal' ? '16:9' : '9:16', task_id: d.renderId,
cost: _o9 ? { usd: _o9.usd } : null, prompt: d.scenes.map((s, i) => `${i + 1}. ${String(s.text || '').replace(/\n/g, ' / ')}${s.say ? ' — ' + s.say : ''}`).join('\n'),
extra: { func: d.fn, caption: _oa.full, sources: d.plan.sources || [] } }));
d.clipId = _o1m.id; _o1p();
try { onSaved(_o1m); } catch { }
_ol();
_o1v(_o1c, '✓ Đã dựng xong và lưu clip ở thẻ "Clip đã có". Link của Shotstack có thể hết hạn – tải về và lưu Google Drive. App không tự đăng: anh/chị tự đăng và bật nhãn AI nếu có giọng/ảnh AI.', 'ok',
h('div', { class: 'bds-stack' },
h('div', { class: 'bds-row bds-wrap' }, h('a', { class: 'bds-btn bds-btn-x bds-btn-primary', href: url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'v3-open-mp4' }, '▶ Xem / tải MP4'),
K.button('Xem Clip đã có', () => openClips(), { testid: 'v3-go-clips' })),
K.field('Caption gợi ý', h('textarea', { rows: 7, readonly: true, value: _oa.full, 'data-testid': 'v3-caption' })),
K.button('Chép caption', async () => { await K.copy(_oa.full); K.toast('Đã chép caption', 'success'); }, { testid: 'v3-caption-copy' })));
}
function _o7() {
const d = _o1x.d;
if (!d.approved) { K.toast('Duyệt dàn cảnh trước', 'warn'); return; }
const _o9 = _o1x.chars.find((_o2g) => _o2g.id === d.char);
const voice = d.voice === 'self' ? 'tự thu âm' + (d.selfUrl ? ' – ' + d.selfUrl : '') : `${SV.byId(d.voice).label}, giọng ${_o2b() || 'mặc định'}, tốc độ ${d.speed}`;
const text = V3.claudeBrief(d.fn, { plan: d.plan, scenes: d.scenes, contact: d.input.contact, format: d.input.format, voice, character: _o9 || null });
const ta = h('textarea', { rows: 14, readonly: true, value: text, 'data-testid': 'v3-brief-text', style: { width: '100%', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12px' } });
const _o12 = K.modal({ title: 'Gói đề bài cho Claude', testid: 'v3-brief-dialog', wide: true, body: [
h('p', { class: 'bds-muted' }, 'Chép rồi dán vào Claude (có skill ' + (V3.funcById(d.fn).skill || '') + '). Claude dựng bằng skill của anh/chị – không tốn phí app (gói Claude của anh/chị tính riêng).'),
ta, h('div', { class: 'bds-row bds-end' }, K.button('Đóng', () => _o12.close(), { testid: 'v3-brief-close' }),
K.button('📋 Chép', async () => { await K.copy(text); K.toast('Đã chép gói đề bài', 'success'); }, { kind: 'primary', testid: 'v3-brief-copy' }))] });
}
function _on() {
const d = _o1x.d, I = d.input;
const _o1a = (o) => Object.entries(o).map(([_ov, v]) => [_ov, v[0]]);
const desc = h('textarea', { rows: 3, value: I.desc, 'data-testid': 'v3-walk-desc', placeholder: 'vd căn 2 phòng ngủ 70 m², phòng khách nhìn ra hồ, ban công rộng' });
const style = K.select(_o1a(V3.WALK_STYLES), I.style, { 'data-testid': 'v3-walk-style' });
const people = K.select(_o1a(V3.WALK_PEOPLE), I.people, { 'data-testid': 'v3-walk-people' });
const action = K.select(_o1a(V3.WALK_ACTIONS), I.action, { 'data-testid': 'v3-walk-action' });
const secs = K.select([[4, '4 giây'], [6, '6 giây'], [8, '8 giây (tối đa)']], I.seconds, { 'data-testid': 'v3-walk-seconds' });
const img = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', 'data-testid': 'v3-walk-image', style: { maxWidth: '100%' } });
const charSel = h('select', { 'data-testid': 'v3-char' }, h('option', { value: '' }, _o1x.chars.length ? '— Người xem chung (không chọn nhân vật) —' : 'Chưa có nhân vật trong thư viện'),
_o1x.chars.filter((_o9) => _o9.lock_en).map((_o9) => h('option', { value: _o9.id, selected: _o9.id === d.char }, _o9.name)));
const _o22 = () => { I.desc = desc.value; I.style = style.value; I.people = people.value; I.action = action.value; I.seconds = Number(secs.value); d.char = charSel.value; _o1p(); };
[desc, style, people, action, secs, charSel].forEach((_o2g) => _o2g.addEventListener('change', () => { _o22(); if (d.walk) _o8(); }));
img.addEventListener('change', async () => {
d.image = null;
const _oq = img.files && img.files[0];
if (!_oq) return;
if (_oq.size > 5 * 1024 * 1024) { K.toast('Ảnh tham chiếu tối đa 5 MB', 'warn'); img.value = ''; return; }
d.image = { name: _oq.name, mime: _oq.type || 'image/jpeg', b64: await fileB64(_oq) };
if (d.walk) _o8();
});
const _o8 = () => {
_o22();
const _o9 = _o1x.chars.find((_o2g) => _o2g.id === d.char);
d.walk = V3.buildWalkPrompt({ desc: I.desc, style: I.style, people: I.people, action: I.action, seconds: I.seconds, character: _o9 || null, hasImage: !!d.image });
d.approved = false; _o1p(); _ol();
};
_o1f.appendChild(step(1, 'Mô tả căn hộ / phong cách', h('div', { class: 'bds-stack' },
K.field('Mô tả căn hộ', desc, 'Chỉ mô tả chung – không ghi tên dự án/chủ đầu tư thật, không đòi "giống ảnh thật".'),
h('div', { class: 'bds-grid2' }, K.field('Phong cách', style), K.field('Người xem', people), K.field('Hành động', action), K.field('Thời lượng', secs)),
K.field('Ảnh tham chiếu (tuỳ chọn)', img, 'Ảnh của anh/chị (anh/chị chịu trách nhiệm quyền dùng) – AI chỉ bám phong cách, bố cục.')), 'v3-step1'));
const s2 = h('div', { class: 'bds-stack' }, K.button(d.walk ? '↻ Soạn lại câu lệnh' : '✨ Soạn câu lệnh Veo / Flow', () => _o8(), { kind: 'primary', testid: 'v3-walk-build' }));
for (const _o2f of V3.walkProblems(I.desc)) s2.appendChild(h('p', { class: 'v3-warn', 'data-testid': 'v3-walk-warn' }, '⚠ ' + _o2f));
s2.appendChild(h('ul', { class: 'v3-notes', 'data-testid': 'v3-walk-notes' }, V3.WALK_NOTES.map((_o17) => h('li', null, _o17))));
if (d.walk) {
const ta = h('textarea', { rows: 8, value: d.walk.prompt, 'data-testid': 'v3-walk-prompt', spellcheck: false, style: { width: '100%', fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '12px' } });
ta.addEventListener('change', () => { d.walk.prompt = ta.value; d.approved = false; _o1p(); _ol(); });
s2.appendChild(K.field('Câu lệnh (tiếng Anh – sửa được)', ta));
if (d.approved) s2.appendChild(h('p', { class: 'bds-ok', 'data-testid': 'v3-approved' }, '✓ Anh/chị đã duyệt câu lệnh.'));
else s2.appendChild(K.button('✓ Duyệt câu lệnh', () => { d.approved = true; _o1p(); _ol(); }, { kind: 'primary', testid: 'v3-approve' }));
}
_o1f.appendChild(step(2, 'Câu lệnh cảnh người xem nhà (anh/chị duyệt – chưa tốn tiền)', s2, 'v3-step2'));
_o1f.appendChild(step(3, 'Nhân vật', K.field('Nhân vật (thư viện Nhân vật – giữ đúng ngoại hình)', charSel), 'v3-step3'));
const _oj = _o21('scene', d.sceneAi === 'none' ? 'flow' : d.sceneAi, 'v3-svc-scene');
_oj.addEventListener('change', () => { d.sceneAi = _oj.value; _o1p(); _ol(); });
_o1f.appendChild(step(4, 'Chọn AI tạo cảnh', h('div', { class: 'bds-stack' }, K.field('Cảnh AI', _oj), _o1z(d.sceneAi === 'none' ? 'flow' : d.sceneAi),
h('small', { class: 'bds-muted' }, 'Giọng đọc: không cần (cảnh không lời). Ghép vào video dài: dùng chức năng bản đồ / tin hoặc Claude.')), 'v3-step4'));
const go = K.button('➡ Đưa sang "Tạo cảnh AI" (báo chi phí trước khi tạo)', () => {
if (!d.walk || !d.approved) { K.toast('Soạn và duyệt câu lệnh trước', 'warn'); return; }
usePrompt({ prompt: d.walk.prompt, negative: d.walk.negative, seconds: d.walk.seconds, aspect: '9:16', provider: d.sceneAi === 'none' ? 'flow' : d.sceneAi, title: 'Người xem căn hộ – ' + (V3.WALK_STYLES[I.style] || [''])[0], image: d.image, kind: 'broll' });
}, { kind: 'primary', testid: 'v3-walk-send' });
go.disabled = !(d.walk && d.approved);
const _oc = K.button('📋 Chép câu lệnh cho Claude / Flow', async () => { if (!d.walk) return; await K.copy(V3.claudeBrief('walk', { walk: d.walk })); K.toast('Đã chép', 'success'); }, { testid: 'v3-walk-copy' });
_oc.disabled = !(d.walk && d.approved);
_o1f.appendChild(step(5, 'Tạo cảnh', h('div', { class: 'bds-stack' }, h('p', { class: 'v3-paid', 'data-testid': 'v3-paid-note' }, '💳 ' + SV.PAID_NOTE + '.'),
h('div', { class: 'bds-row bds-wrap' }, go, _oc)), 'v3-step5'));
}
_ol();
await Promise.all([_oz(), _oy(), _ox()]);
if (!alive()) return { prefillNews: () => {} };
if (V3.funcById(initial)) _od(initial); else _ol();
const _o1y = () => _o1x.timers.forEach(clearTimeout);
const _o18 = setInterval(() => { if (!alive()) { _o1y(); clearInterval(_o18); } }, 5000);
return {
prefillNews(text) { const cur = _o10(_o0('news')) || blank('news'); if (!cur.plan) { cur.input = { ...blank('news').input, ...(cur.input || {}), text: String(text || '').slice(0, 3000) }; _o11(_o0('news'), cur); } if (_o1x.fn === 'news' && !_o1x.d.plan) { _o1x.d.input.text = String(text || '').slice(0, 3000); _ol(); } },
};
}
function fileB64(file) {
return new Promise((_o1l, rej) => {
const r = new FileReader();
r.onload = () => _o1l(String(r.result).split(',')[1] || '');
r.onerror = () => rej(new Error('Không đọc được ảnh'));
r.readAsDataURL(file);
});
}

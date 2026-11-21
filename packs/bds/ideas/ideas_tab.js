import { h } from '../_lib/kit.js';
import * as V from '../_lib/video.js';
import * as I from '../_lib/ideas.js';
import { withRules } from '../../../shared/ai_rules.js';
const _o1 = 'bds-ideas-css';
function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o1)) return;
document.head.appendChild(h('link', { id: _o1, rel: 'stylesheet', href: new URL('./ideas.css', import.meta.url).href }));
}
const STATUS = { new: ['Chờ duyệt', 'warn'], approved: ['Đã duyệt', 'success'], rejected: ['Đã bỏ', 'muted'], done: ['Đã đăng', 'info'] };
const FILTERS = [['open', 'Đang mở'], ['new', 'Chờ duyệt'], ['approved', 'Đã duyệt'], ['done', 'Đã đăng'], ['rejected', 'Đã bỏ'], ['all', 'Tất cả']];
const _o0 = ['id', 'title', 'source', 'url', 'summary', 'status', 'score', 'deleted'];
const _o2 = 'Kéo ảnh chụp bài báo / văn bản vào đây, hoặc bấm "Chọn ảnh".';
const _o4 = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const _o3 = e => ['NOT_FOUND', 'BAD_INPUT'].includes(e && e.code) || /không được hỗ trợ|Không có đường dẫn/i.test((e && e.message) || '');
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const _oo = ymd => { const [, m, d] = String(ymd).split('-'); return d && m ? `${d}/${m}` : ymd; };
const _o22 = s => (s >= 70 ? 'ix-hi' : s >= 45 ? 'ix-mid' : 'ix-lo');
const _o8 = ms => { const m = Math.round((Date.now() - ms) / 60000); return m < 60 ? m + ' phút trước' : m < 1440 ? Math.round(m / 60) + ' giờ trước' : Math.round(m / 1440) + ' ngày trước'; };
export async function mountIdeas(el, ctx, K, { onMakeVideo = () => {} } = {}) {
ensureCss();
const st = { filter: 'open', candidates: [], picked: new Set(), fetching: false, clips: new Set() };
el.innerHTML = '';
const _o19 = h('div', { 'data-testid': 'idea-list' });
const candBox = h('div', { 'data-testid': 'idea-candidates' });
const _of = h('div', { 'data-testid': 'idea-calendar' });
const _od = h('div', { 'data-testid': 'idea-batch-list' });
const _o1r = h('div', { class: 'ix-result', 'data-testid': 'idea-intake-result' });
const driveBox = h('div', { 'data-testid': 'idea-drive-box' });
const _ox = h('div', { 'data-testid': 'idea-follow-box' });
const withData = r => { const d = V.parseData(r.data); return { ...d, ...r, _data: d }; };
const _ob = async () => (await K.list('ideas')).map(withData);
const _ok = async () => ({ ideas: await K.listAll('ideas').then(x => x.filter(_o13 => !Number(_o13.deleted))), jobs: await K.list('jobs') });
const _o1u = async (_o1t, patch = {}, dataPatch = null) => {
const base = {};
for (const _o16 of _o0) if (_o1t[_o16] !== undefined) base[_o16] = _o1t[_o16];
const data = { ...(_o1t._data || {}), ...(dataPatch || {}) };
for (const _o16 of Object.keys(data)) if (data[_o16] === null || data[_o16] === '' || data[_o16] === undefined) delete data[_o16];
return K.put('ideas', { ...base, ...patch, data: JSON.stringify(data) });
};
const _oa = () => !!(ctx.ai && typeof ctx.ai.run === 'function' && (typeof ctx.ai.connected !== 'function' || ctx.ai.connected()));
function _o1b(x, extra = {}) {
const text = [x.title, x.summary].filter(Boolean).join(' ');
const _oi = x.category ? { category: x.category } : I.classify(text);
const sc = I.score({ ...x, published: x.published }, { now: Date.now() });
const data = { category: _oi.category || '', topic_key: I.topicKey(x.title), score_parts: sc.parts, published: x.published || null,
sources: x.url ? [{ url: x.url, name: x.source || '' }] : [], ...extra };
return { title: x.title, url: x.url || '', summary: x.summary || '', source: x.source || 'manual', status: x.status || 'new', score: sc.score, data: JSON.stringify(data) };
}
const input = h('textarea', { rows: 3, 'data-testid': 'idea-input', 'aria-label': 'Dán link, gõ chủ đề',
placeholder: 'Dán link bài báo (nhiều link mỗi dòng một link) hoặc gõ chủ đề, vd: Vành đai 4 đoạn qua Gia Lâm' });
const _ov = h('input', { type: 'file', accept: 'image/*', multiple: true, class: 'ix-file', 'data-testid': 'idea-file', 'aria-label': 'Chọn ảnh',
onchange: e => { _o7([...e.target.files]); e.target.value = ''; } });
const _o1h = [];
const imgNote = h('span', { class: 'ix-drop-hint', 'data-testid': 'idea-img-note' }, _o2);
const drop = h('div', { class: 'ix-drop', 'data-testid': 'idea-drop' }, input, imgNote, _ov);
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('ix-over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('ix-over'));
drop.addEventListener('drop', e => {
e.preventDefault(); drop.classList.remove('ix-over');
const files = [...(e.dataTransfer && e.dataTransfer.files || [])].filter(f => /^image\//.test(f.type));
if (files.length) _o7(files);
const _o23 = e.dataTransfer && e.dataTransfer.getData('text/plain');
if (_o23) input.value = (input.value ? input.value + '\n' : '') + _o23;
});
function _o7(files) {
for (const f of files) if (/^image\//.test(f.type)) _o1h.push(f);
imgNote.textContent = _o1h.length ? `${_o1h.length} ảnh chờ phân loại: ${_o1h.map(f => f.name).join(', ')}` : _o2;
}
const _o1m = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1] || ''); r.onerror = rej; r.readAsDataURL(f); });
async function _o9(text, images) {
if (!_oa()) return null;
try {
const r = await ctx.ai.run('ideas', { prompt: withRules(I.buildClassifyPrompt(text)), images, json: true });
const p = I.parseClassify((r && (r.text ?? r)) || '');
return p.category || p.title ? p : null;
} catch { return null; }
}
function _o1s(x, { dup, series, saved }) {
const _og = I.CATEGORIES[x.category];
const box = h('div', { class: 'ix-res ' + (dup ? 'ix-dup' : 'ix-ok'), 'data-testid': dup ? 'intake-dup' : 'intake-ok' },
h('div', { class: 'ix-title' }, x.title),
h('div', { class: 'ix-tags' }, _og ? K.badge(_og.icon + ' ' + _og.label, 'info') : K.badge('Chưa rõ nhóm', 'muted'),
saved ? K.badge('Đã lưu · điểm ' + saved.score, 'success') : null),
dup ? h('div', { class: 'ix-sub' }, `Trùng ${dup.by === 'url' ? 'link' : 'chủ đề'} với ${dup.kind === 'job' ? 'video' : 'ý tưởng'} "${dup.match.title || ''}"`) : null,
series ? h('div', { class: 'ix-sub', 'data-testid': 'intake-series' }, '💡 ' + series.why) : null);
if (dup) {
const _o6 = h('div', { class: 'ix-btns' },
series ? K.button(`Làm phần ${series.part}`, async () => { await K.put('ideas', _o1b({ ...x, title: series.title }, { series: { part: series.part, of: series.of.id } })); done('Đã lưu phần ' + series.part); }, { kind: 'primary', testid: 'intake-part' }) : null,
K.button('Vẫn lưu', async () => { await K.put('ideas', _o1b(x)); done('Đã lưu'); }, { testid: 'intake-force' }),
K.button('Bỏ', () => box.remove()));
const done = msg => { K.toast(msg, 'success'); box.remove(); render(); };
box.appendChild(_o6);
}
return box;
}
async function _o14(btn) {
const items = I.detectInput(input.value);
if (!items.length && !_o1h.length) { K.toast('Dán link, gõ chủ đề hoặc kéo ảnh vào ô', 'warn'); return; }
if (btn) btn.disabled = true;
_o1r.innerHTML = '';
let saved = 0;
try {
const _o1k = await _ok();
const handle = async x => {
if (!x.category) {
const _o18 = I.classify([x.title, x.summary].join(' '));
x.category = _o18.category;
if (_o18.confidence < 0.5 && _oa() && x.ai !== false) { const _o5 = await _o9([x.title, x.url, x.summary].filter(Boolean).join('\n')); if (_o5 && _o5.category) x.category = _o5.category; }
}
const dup = I.findDuplicate(x, _o1k);
const series = I.seriesHint(x, _o1k);
if (dup.match || series) { _o1r.appendChild(_o1s(x, { dup: dup.match ? dup : { by: 'keywords', kind: 'idea', match: series.of }, series })); return; }
const _o1t = await K.put('ideas', _o1b(x));
_o1k.ideas.push(_o1t); saved++;
_o1r.appendChild(_o1s(x, { saved: _o1t }));
};
for (const _o15 of items) {
if (_o15.type === 'link') {
const _o5 = _oa() ? await _o9(_o15.url) : null;
await handle({ title: (_o5 && _o5.title) || V.titleFromUrl(_o15.url) || _o15.url, summary: (_o5 && _o5.summary) || '', url: _o15.url, source: (_o5 && _o5.source) || _o12(_o15.url), category: _o5 && _o5.category, ai: false });
}
else await handle({ title: _o15.text.slice(0, 160), source: 'manual' });
}
for (const f of _o1h.splice(0)) {
let _o5 = null;
if (f.size <= 6 * 2 ** 20) { try { _o5 = await _o9('(ảnh chụp – đọc chữ trong ảnh)', [{ mime: f.type, b64: await _o1m(f) }]); } catch { _o5 = null; } }
await handle({ title: (_o5 && _o5.title) || 'Ảnh: ' + f.name.replace(/\.[a-z0-9]+$/i, ''), summary: (_o5 && _o5.summary) || '', source: (_o5 && _o5.source) || 'ảnh', category: _o5 && _o5.category, ai: false });
}
_o7([]);
input.value = '';
if (saved) K.toast(`Đã lưu ${saved} ý tưởng`, 'success');
render();
} finally { if (btn) btn.disabled = false; }
}
const _o12 = _o24 => { try { return new URL(_o24).hostname.replace(/^(www|m)\./, ''); } catch { return ''; } };
async function _oz(btn) {
driveBox.innerHTML = '';
if (btn) btn.disabled = true;
try {
const since = Number(await K.setting('ideas_drive_since', 0)) || 0;
const r = await K.api('inbox.drive_list', { since });
const files = (r && (r.files || r.items)) || (Array.isArray(r) ? r : []);
if (!files.length) { driveBox.appendChild(h('p', { class: 'ix-status' }, 'Thư mục "Gửi BDS Studio" chưa có tệp mới.')); return; }
const _o1k = await _ok(); let _o1c = 0;
for (const f of files) {
const x = { title: String(f.name || 'Tệp Drive').replace(/\.[a-z0-9]+$/i, ''), url: f.link || f.url || '', source: 'Drive', summary: f.mime ? 'Tệp ' + f.mime : '' };
if (I.findDuplicate(x, _o1k).match) continue;
_o1k.ideas.push(await K.put('ideas', _o1b(x, { drive_id: f.id }))); _o1c++;
try { await K.api('inbox.drive_mark', { id: f.id }); } catch { }
}
await K.setSetting('ideas_drive_since', Date.now());
driveBox.appendChild(h('p', { class: 'ix-status' }, `Đã lấy ${_o1c} tệp mới từ thư mục "Gửi BDS Studio" vào hộp ý tưởng.`));
K.toast(`Đã lấy ${_o1c} tệp từ Drive`, 'success'); render();
} catch (e) {
driveBox.appendChild(h('div', { class: 'ix-help', 'data-testid': 'idea-drive-help' },
h('strong', null, _o3(e) ? 'Chờ máy chủ cập nhật (inbox.drive_list).' : 'Chưa đọc được thư mục Drive.'),
h('ol', null,
h('li', null, 'Trong Google Drive của anh/chị, tạo thư mục tên đúng "Gửi BDS Studio".'),
h('li', null, 'Trên điện thoại: Chia sẻ ảnh/bài báo → Drive → chọn thư mục đó.'),
h('li', null, 'Khi máy chủ cập nhật xong, bấm lại nút này – app tự lấy tệp mới và phân loại.'),
h('li', null, 'Trong lúc chờ: tải ảnh về máy rồi kéo vào ô ở trên.'))));
} finally { if (btn) btn.disabled = false; }
}
async function _oy() {
const v = await K.setting('followed_topics', null);
const _o1e = Array.isArray(v) ? { topics: v } : (v && typeof v === 'object' ? v : {});
return { topics: I.followedFrom(_o1e), feeds: Array.isArray(_o1e.feeds) ? _o1e.feeds : [], last_fetch: Number(_o1e.last_fetch) || 0, last_note: _o1e.last_note || '' };
}
const _o1v = async patch => { const c = await _oy(); await K.setSetting('followed_topics', { ...c, ...patch }); };
async function _o10(feeds, since) {
try {
const r = await K.api('news.fetch', { feeds, since });
const _o1x = { items: (r && r.items) || (Array.isArray(r) ? r : []), via: 'máy chủ', errors: (r && r.errors) || [] };
if (_o1x.items.length || _o1x.errors.length < feeds.length) return _o1x;
return { items: null, allFailed: true };
} catch (e) { return { items: null, server: _o3(e) }; }
}
async function _ou({ quiet = false } = {}) {
if (st.fetching) return;
const c = await _oy();
if (!c.topics.length) { if (!quiet) K.toast('Thêm ít nhất một chủ đề để theo dõi', 'warn'); return; }
st.fetching = true; _o1q(c, 'Đang lấy tin…');
try {
const since = Math.max(c.last_fetch - 3600e3, Date.now() - 7 * 864e5);
const r = await _o10(I.feedsFrom({ feeds: c.feeds }), since);
if (!r.items) {
const _o1d = r.server ? 'Chờ máy chủ cập nhật (news.fetch) rồi bấm lại "Lấy tin mới".'
: r.allFailed ? 'Chưa lấy được tin: máy chủ không tải được nguồn RSS nào (kiểm link ở "Nguồn tin").' : 'Chưa lấy được tin: máy chủ chưa trả lời – thử lại sau.';
await _o1v({ last_note: _o1d }); _o1q(await _oy()); if (!quiet) K.toast(_o1d, 'warn'); return;
}
const { ideas, jobs } = await _ok();
const rows = I.newsToIdeas(r.items, { topics: c.topics, ideas, jobs, now: Date.now(), since });
for (const _o1t of rows) await K.put('ideas', _o1t);
const _o1d = `Lấy ${r.items.length} tin qua ${r.via} – ${rows.length} tin khớp chủ đề đã vào hộp ý tưởng.` + (r.errors && r.errors.length ? ` ${r.errors.length} nguồn lỗi.` : '');
await _o1v({ last_fetch: Date.now(), last_note: _o1d });
if (!quiet || rows.length) K.toast(_o1d, rows.length ? 'success' : 'info');
render();
} finally { st.fetching = false; _o1q(await _oy()); }
}
const followIn = h('input', { type: 'text', placeholder: 'Chủ đề, vd: cầu Tứ Liên', 'data-testid': 'follow-input', 'aria-label': 'Chủ đề theo dõi',
onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); addFollow(); } } });
async function addFollow() {
const t = followIn.value.trim();
if (t.length < 2) { K.toast('Gõ chủ đề muốn theo dõi', 'warn'); return; }
const c = await _oy();
await _o1v({ topics: I.followedFrom([...c.topics, t]) });
followIn.value = ''; K.toast('Đã theo dõi "' + t + '"', 'success'); _o1q(await _oy());
}
function _o1q(c, busy) {
_ox.innerHTML = '';
_ox.appendChild(h('div', { class: 'ix-chips', 'data-testid': 'follow-chips' },
c.topics.length ? c.topics.map(t => h('span', { class: 'ix-chip', 'data-testid': 'follow-chip' }, h('span', null, t),
h('button', { type: 'button', 'aria-label': 'Bỏ theo dõi ' + t, onclick: async () => { await _o1v({ topics: c.topics.filter(x => x !== t) }); _o1q(await _oy()); } }, '✕')))
: h('span', { class: 'bds-muted' }, 'Chưa theo dõi chủ đề nào.')));
_ox.appendChild(h('div', { class: 'ix-inline' }, followIn, K.button('Theo dõi', addFollow, { kind: 'primary', testid: 'follow-add' })));
const custom = h('textarea', { rows: 3, 'aria-label': 'Nguồn RSS thêm', placeholder: 'Mỗi dòng một link RSS (để trống = dùng danh sách mặc định)', 'data-testid': 'follow-feeds' }, c.feeds.join('\n'));
_ox.appendChild(h('details', { class: 'ix-feeds' }, h('summary', null, `Nguồn tin (${I.feedsFrom({ feeds: c.feeds }).length})`),
h('ul', null, I.DEFAULT_FEEDS.map(f => h('li', null, f.name + (f.verify ? ' (cần kiểm link)' : '')))),
custom, h('div', { class: 'bds-row bds-end' }, K.button('Lưu nguồn', async () => {
const feeds = custom.value.split(/\s+/).map(s => s.trim()).filter(s => /^https?:\/\//i.test(s));
await _o1v({ feeds }); K.toast(feeds.length ? `Dùng ${feeds.length} nguồn riêng` : 'Dùng danh sách mặc định', 'success'); _o1q(await _oy());
}))));
const _o1d = busy || (c.last_note ? c.last_note + (c.last_fetch ? ' · ' + _o8(c.last_fetch) : '') : 'Tin mới khớp chủ đề sẽ tự vào hộp ý tưởng (kiểm mỗi lần mở màn này, tối đa 6 giờ/lần).');
_ox.appendChild(h('p', { class: 'ix-status' + (/Chờ máy chủ|Chưa lấy/.test(_o1d) ? ' ix-warn' : ''), 'data-testid': 'follow-status' }, _o1d));
}
async function _o1y(btn) {
if (!_oa()) { K.toast('Chưa bật AI trong Cài đặt', 'warn'); return; }
const existing = (await _ob()).map(_o13 => _o13.title);
candBox.innerHTML = ''; candBox.appendChild(h('p', { class: 'bds-muted' }, 'AI đang gợi ý…'));
if (btn) btn.disabled = true;
try {
const r = await ctx.ai.run('ideas', { prompt: withRules(V.buildIdeasPrompt({ existing, today: today() })), json: true });
const _o1k = await _ok();
st.candidates = V.parseIdeas((r && (r.text ?? r)) || '').filter(x => !I.findDuplicate(x, _o1k).match)
.map(x => ({ ...x, score: I.score(x).score })).sort((_o5, b) => b.score - _o5.score);
if (!st.candidates.length) K.toast('AI chưa trả về ý tưởng mới đúng định dạng – thử lại', 'warn');
} catch (e) { K.toast((e && e.message) || 'AI chưa trả lời', 'warn'); st.candidates = []; }
finally { if (btn) btn.disabled = false; }
_o1p();
}
function _o1p() {
candBox.innerHTML = '';
if (!st.candidates.length) return;
candBox.appendChild(K.card({ title: `Gợi ý của AI (${st.candidates.length})`, actions: [
K.button('Lưu tất cả', async () => { for (const c of [...st.candidates]) await _o17(c, false); _o1p(); render(); }),
K.button('Bỏ hết', () => { st.candidates = []; _o1p(); })], body: h('div', null, st.candidates.map(c =>
h('div', { class: 'ix-item', 'data-testid': 'cand' },
h('div', { class: 'ix-item-top' }, h('div', { class: 'ix-score ' + _o22(c.score) }, c.score, h('small', null, 'điểm')),
h('div', { class: 'ix-main' }, h('div', { class: 'ix-title' }, c.title), h('div', { class: 'ix-sub' }, [c.source, c.summary].filter(Boolean).join(' · ')))),
h('div', { class: 'ix-btns' }, c.url ? K.linkBtn('Mở nguồn', c.url, null, { target: '_blank' }) : h('small', { class: 'bds-muted' }, 'chưa có link – kiểm chứng trước khi làm'),
K.button('Lưu chờ duyệt', () => _o17(c, true), { kind: 'primary' }),
K.button('Bỏ', () => { st.candidates = st.candidates.filter(x => x !== c); _o1p(); }))))) }));
}
async function _o17(c, rerender = true) {
await K.put('ideas', _o1b({ ...c, source: c.source || 'ai' }, { kind: c.kind, ai_score: c.ai_score }));
st.candidates = st.candidates.filter(x => x !== c);
if (rerender) { K.toast('Đã lưu ý tưởng', 'success'); _o1p(); render(); }
}
function _o1f(_o13) {
let _o1j = Array.isArray(_o13._data.scenes_outline) && _o13._data.scenes_outline.length
? { template: _o13._data.template || null, label: _o13._data.template ? (I.TEMPLATES[_o13._data.template] || {}).label : 'Dàn cảnh đã lưu', need_ai: false, scenes: _o13._data.scenes_outline }
: I.buildScenes(_o13);
const body = h('div', { class: 'bds-form' });
const sheet = K.sheet({ title: 'Dàn cảnh: ' + _o13.title, body, testid: 'idea-scenes' });
const _op = () => {
body.innerHTML = '';
const _o20 = I.factsSummary(_o1j.scenes);
body.appendChild(h('div', { class: 'bds-row' }, K.badge(_o1j.template ? 'Mẫu: ' + _o1j.label : _o1j.label, _o1j.template ? 'success' : 'warn'),
K.badge(`${_o20.ok}/${_o20.total} số có nguồn`, _o20.missing ? 'warn' : 'success')));
body.appendChild(h('div', { class: 'ix-legend' }, h('span', null, h('i', { class: 'ix-dot ix-ok' }), 'có nguồn'), h('span', null, h('i', { class: 'ix-dot ix-miss' }), 'chưa có nguồn – dán link để kiểm chứng')));
if (_o1j.need_ai) body.appendChild(h('div', { class: 'ix-help' }, 'Tin chưa có mẫu sẵn. App dựng khung 4 cảnh; bấm "Nhờ AI dàn cảnh" để AI đề xuất cảnh theo nội dung tin.',
h('div', { class: 'bds-row bds-end' }, K.button('✨ Nhờ AI dàn cảnh', aiScenes, { kind: 'primary', testid: 'scenes-ai', ai: true }))));
body.appendChild(h('div', { class: 'ix-scenes' }, _o1j.scenes.map((s, si) => h('div', { class: 'ix-scene', 'data-testid': 'scene' },
h('div', { class: 'ix-scene-h' }, h('b', null, s.title), h('span', { class: 'ix-kind' }, I.SCENE_KINDS[s.kind] || s.kind)),
s.facts.length ? h('div', { class: 'ix-facts' }, s.facts.map((f, fi) => _os(f, si, fi))) : null))));
const ta = h('textarea', { rows: 3, placeholder: 'Dán lời thoại / phụ đề để kiểm: "đã phê duyệt", "đã khởi công"… có đúng nguồn không', 'data-testid': 'claim-input' });
const _o1g = h('div', { class: 'ix-claims', 'data-testid': 'claim-result' });
body.appendChild(h('div', { class: 'ix-claims' }, h('strong', null, 'Kiểm câu chữ: chặn ghi "dự kiến" thành "đã"'), ta,
h('div', { class: 'bds-row bds-end' }, K.button('Kiểm tra', () => {
const r = I.checkClaims(ta.value, [_o13.title, _o13.summary, _o13._data.source_text].filter(Boolean).join('. '));
_o1g.innerHTML = '';
if (r.ok) _o1g.appendChild(h('div', { class: 'ix-issue ix-pass' }, '✓ Không thấy câu khẳng định sai mức (đề xuất/dự kiến/đã phê duyệt).'));
for (const x of r.issues) _o1g.appendChild(h('div', { class: 'ix-issue ' + (x.level === 'block' ? 'ix-block' : 'ix-warnx') }, (x.level === 'block' ? '⛔ ' : '⚠️ ') + x.message, h('div', { class: 'ix-sub' }, x.sentence)));
}, { testid: 'claim-check' })), _o1g));
body.appendChild(h('div', { class: 'bds-row bds-end' },
K.button('Đóng', () => sheet.close()),
K.button('Lưu dàn cảnh', async () => { _o13 = withData(await _o1u(_o13, {}, { scenes_outline: _o1j.scenes, template: _o1j.template || null })); K.toast('Đã lưu dàn cảnh', 'success'); sheet.close(); render(); }, { kind: 'primary', testid: 'scenes-save' })));
};
const _os = (f, si, fi) => {
const ok = f.status === 'ok';
const _o1w = h('input', { type: 'url', placeholder: 'Dán link nguồn của số này', value: ok ? '' : '', 'aria-label': 'Nguồn cho ' + f.text, 'data-testid': 'fact-src',
onchange: e => { const _o24 = e.target.value.trim(); if (/^https?:\/\/\S+$/i.test(_o24)) { _o1j.scenes[si].facts[fi] = { ...f, source: _o24, status: 'ok' }; _op(); } } });
return h('div', { class: 'ix-fact ' + (ok ? 'ix-ok' : 'ix-miss'), 'data-testid': ok ? 'fact-ok' : 'fact-missing' },
h('b', null, f.text), ok ? K.linkBtn('Nguồn ↗', f.source, null, { target: '_blank' }) : _o1w);
};
async function aiScenes() {
if (!_oa()) { K.toast('Chưa bật AI trong Cài đặt', 'warn'); return; }
try {
const r = await ctx.ai.run('ideas', { prompt: withRules(I.buildScenesPrompt(_o13)), json: true });
const sc = I.parseScenes((r && (r.text ?? r)) || '');
if (sc.length >= 3) { _o1j = { template: null, label: 'AI dàn cảnh – kiểm từng số', need_ai: false, scenes: sc }; _op(); }
else K.toast('AI chưa trả về dàn cảnh đúng định dạng – dùng khung có sẵn', 'warn');
} catch (e) { K.toast((e && e.message) || 'AI chưa trả lời', 'warn'); }
}
_op();
}
async function _or(count) {
if (!count) return;
const r = I.batchReminder(Date.now(), count);
const old = await K.get('reminders', r.id);
if (old && (Number(old.done) || old.title === r.title)) return;
await K.put('reminders', old ? { ...old, title: r.title } : r);
}
function _o1n(ideas) {
_od.innerHTML = '';
const _o1i = I.batchPick(ideas, 10);
for (const id of [...st.picked]) if (!_o1i.some(p => p.id === id)) st.picked.delete(id);
if (!_o1i.length) { _od.appendChild(K.empty('Không có ý tưởng chờ duyệt. Dán link hoặc theo dõi chủ đề để có thêm.')); return; }
const _oj = () => `Duyệt ${st.picked.size} ý tưởng`;
const _o11 = K.button(_oj(), () => _oc(_o1i.filter(p => st.picked.has(p.id))), { kind: 'primary', testid: 'batch-approve' });
const _o21 = () => { _o11.textContent = _oj(); _o11.disabled = !st.picked.size; };
_o1i.forEach(_o13 => {
const cb = h('input', { type: 'checkbox', checked: st.picked.has(_o13.id), 'data-testid': 'batch-check-' + _o13.id, 'aria-label': 'Chọn ' + _o13.title,
onchange: e => { e.target.checked ? st.picked.add(_o13.id) : st.picked.delete(_o13.id); _o21(); } });
const _og = I.CATEGORIES[_o13.category];
_od.appendChild(h('label', { class: 'ix-batch-row' }, cb,
h('div', { class: 'ix-score ' + _o22(Number(_o13.score) || 0) }, Number(_o13.score) || 0, h('small', null, 'điểm')),
h('div', { class: 'ix-main' }, h('div', { class: 'ix-title' }, _o13.title), h('div', { class: 'ix-sub' }, [_og ? _og.label : '', _o13.source && _o13.source !== 'manual' ? _o13.source : ''].filter(Boolean).join(' · ')))));
});
_od.appendChild(h('div', { class: 'ix-batch-bar' },
K.button('Chọn tất cả', () => { _o1i.forEach(p => st.picked.add(p.id)); _o1n(ideas); }, { testid: 'batch-all' }), _o11));
_o21();
}
async function _oc(list) {
if (!list.length) return;
for (const _o13 of list) await _o1u(_o13, { status: 'approved' }, { batch_at: Date.now() });
st.picked.clear();
const rem = await K.get('reminders', I.batchReminder(Date.now()).id);
if (rem && !Number(rem.done)) await K.put('reminders', { ...rem, done: 1 });
K.toast(`Đã duyệt ${list.length} ý tưởng – bấm "Làm video AI từ ý tưởng này" ở từng ý tưởng`, 'success');
render();
}
function _o1t(_o13) {
const [lab, tn] = STATUS[_o13.status] || [_o13.status, 'muted'];
const sc = Number(_o13.score) || 0;
const parts = Array.isArray(_o13.score_parts) && _o13.score_parts.length ? _o13.score_parts : I.score(_o13).parts;
const _og = I.CATEGORIES[_o13.category];
const date = h('input', { type: 'date', value: _o13.plan_date || '', 'aria-label': 'Ngày dự kiến đăng', 'data-testid': 'idea-date-' + _o13.id,
onchange: async e => { await _o1u(_o13, {}, { plan_date: e.target.value || null }); render(); } });
const _o20 = Array.isArray(_o13.scenes_outline) ? I.factsSummary(_o13.scenes_outline) : null;
return h('div', { class: 'ix-item', 'data-testid': 'idea-' + _o13.id },
h('div', { class: 'ix-item-top' },
h('div', { class: 'ix-score ' + _o22(sc), title: 'Điểm 0–100' }, sc, h('small', null, 'điểm')),
h('div', { class: 'ix-main' },
h('div', { class: 'ix-title' }, _o13.title),
h('div', { class: 'ix-tags' }, K.badge(lab, tn), _og ? K.badge(_og.icon + ' ' + _og.label, 'info') : null,
_o13.followed ? K.badge('Theo dõi: ' + _o13.followed, 'muted') : null, _o13.series ? K.badge('Phần ' + _o13.series.part, 'warn') : null,
_o20 ? K.badge(`${_o20.ok}/${_o20.total} số có nguồn`, _o20.missing ? 'warn' : 'success') : null,
_o1a(_o13) ? K.badge('Đã có ' + _o1a(_o13) + ' clip AI', 'success') : null),
_o13.summary ? h('div', { class: 'ix-sub' }, _o13.summary) : null,
h('details', { class: 'ix-why', 'data-testid': 'idea-why-' + _o13.id }, h('summary', null, 'Vì sao ' + sc + ' điểm?'),
h('ul', null, parts.map(p => h('li', null, `${p.label}: ${p.points > 0 ? '+' : ''}${p.points}${p.max ? '/' + p.max : ''} – ${p.why}`)))))),
h('div', { class: 'ix-btns' },
_o13.url ? K.linkBtn('Nguồn ↗', _o13.url, null, { target: '_blank' }) : null,
_o13.status === 'new' ? K.button('Duyệt', async () => { await _o1u(_o13, { status: 'approved' }); render(); }, { kind: 'primary', testid: 'idea-approve-' + _o13.id }) : null,
_o13.status !== 'rejected' ? K.button('Dàn cảnh', () => _o1f(_o13), { testid: 'idea-scenes-' + _o13.id }) : null,
_o13.status === 'approved' ? K.button('🎬 Làm video AI từ ý tưởng này', () => onMakeVideo(_o13), { kind: 'primary', testid: 'idea-make-video-' + _o13.id }) : null,
_o13.status === 'approved' ? K.button('Đã đăng', async () => { await _o1u(_o13, { status: 'done' }, { posted_at: today() }); render(); }) : null,
_o13.status !== 'rejected' && _o13.status !== 'done' ? K.button('Bỏ', async () => { await _o1u(_o13, { status: 'rejected' }); render(); }) : null,
_o13.status === 'rejected' ? K.button('Mở lại', async () => { await _o1u(_o13, { status: 'new' }); render(); }) : null),
_o13.status === 'approved' || _o13.status === 'new' ? h('label', { class: 'ix-date' }, 'Ngày đăng TikTok', date) : null);
}
function _o1o(ideas) {
_of.innerHTML = '';
const _oe = {};
for (const _o13 of ideas) if (_o13.plan_date && _o13.status !== 'rejected') (_oe[_o13.plan_date] = _oe[_o13.plan_date] || []).push(_o13);
const _ol = new Date(); const _om = [];
for (let _o16 = 0; _o16 < 14; _o16++) {
const d = new Date(_ol); d.setDate(_ol.getDate() + _o16);
const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
_om.push(h('div', { class: 'bds-item', style: { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '4px' } },
h('strong', null, `${_o4[d.getDay()]} ${_oo(key)}`),
(_oe[key] || []).map(_o13 => h('div', { class: 'bds-sub' }, (_o13.status === 'done' ? '✓ ' : '• ') + _o13.title))));
}
_of.appendChild(h('div', { class: 'bds-grid2' }, _om));
}
async function autoSchedule() {
const ideas = await _ob();
const _o1j = V.planSchedule(ideas, { start: today() });
const ids = Object.keys(_o1j);
if (!ids.length) { K.toast('Không có ý tưởng đã duyệt nào chưa có ngày', 'info'); return; }
for (const _o13 of ideas) if (_o1j[_o13.id]) await _o1u(_o13, {}, { plan_date: _o1j[_o13.id] });
K.toast(`Đã xếp lịch ${ids.length} video`, 'success'); render();
}
const _ow = K.select(FILTERS, st.filter, { 'aria-label': 'Lọc', class: 'bds-snooze', onchange: e => { st.filter = e.target.value; render(); } });
const _o1a = _o13 => (Array.isArray(_o13.clip_ids) ? _o13.clip_ids.filter(id => st.clips.has(id)).length : 0);
async function render() {
st.clips = new Set((await K.list('jobs')).filter(j => j.type === 'video_ai').map(j => j.id));
const ideas = (await _ob()).sort((_o5, b) => (Number(b.score) || 0) - (Number(_o5.score) || 0));
const rows = ideas.filter(_o13 => st.filter === 'all' ? true : st.filter === 'open' ? (_o13.status === 'new' || _o13.status === 'approved') : _o13.status === st.filter);
_o19.innerHTML = '';
if (!rows.length) _o19.appendChild(K.empty(ideas.length ? 'Không có ý tưởng khớp bộ lọc.' : 'Chưa có ý tưởng. Dán link bài báo ở ô trên, hoặc theo dõi chủ đề.'));
rows.forEach(_o13 => _o19.appendChild(_o1t(_o13)));
_o1n(ideas);
_o1o(ideas);
await _or(ideas.filter(_o13 => _o13.status === 'new').length);
}
const _o1z = K.button('✨ Gợi ý bằng AI', () => _o1y(_o1z), { testid: 'idea-suggest', ai: true });
const newsBtn = K.button('📰 Lấy tin mới', () => _ou(), { testid: 'idea-fetch-news' });
const saveBtn = K.button('Phân loại & lưu', () => _o14(saveBtn), { kind: 'primary', icon: 'check', testid: 'idea-save', aiBadge: 'ideas_classify', aiOptional: true, title: 'Phân loại bằng từ khoá trên máy; chỉ nhờ AI khi từ khoá chưa đủ rõ (app hỏi trước)' });
const _oq = K.button('📁 Lấy từ Drive "Gửi BDS Studio"', () => _oz(_oq), { testid: 'idea-drive' });
const pickBtn = K.button('🖼️ Chọn ảnh', () => _ov.click(), { testid: 'idea-pick-img' });
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'ideas-screen' },
h('div', { class: 'bds-head' }, h('h2', null, 'Nguồn ý tưởng'), h('div', { class: 'bds-row' }, newsBtn, _o1z)),
K.card({ title: 'Hộp nhận việc', testid: 'idea-add', body: h('div', null,
h('p', { class: 'ix-lead' }, 'Dán link, gõ chủ đề hoặc kéo ảnh – app tự phân loại (quy hoạch, hạ tầng, lãi suất, chính sách, dự án, thị trường), chặn trùng và chấm điểm.'),
drop, h('div', { class: 'ix-actions', style: { marginTop: '8px' } }, saveBtn, pickBtn, _oq), driveBox, _o1r) }),
candBox,
K.card({ title: 'Duyệt hàng loạt 21h', testid: 'idea-batch', actions: h('span', { class: 'ix-clock', title: 'Nhắc lúc 21h ở Bảng tin' }, '🕘 nhắc 21h'),
body: h('div', null, h('p', { class: 'ix-lead' }, '10 ý tưởng điểm cao nhất đang chờ. Tick nhiều rồi bấm Duyệt một lần – ý tưởng đã duyệt có nút "Làm video AI từ ý tưởng này".'), _od) }),
K.card({ title: 'Danh sách ý tưởng', actions: _ow, body: _o19 }),
K.card({ title: 'Theo dõi chủ đề', testid: 'idea-follow', body: h('div', null,
h('p', { class: 'ix-lead' }, 'Đánh dấu chủ đề – tin mới từ báo uy tín khớp chủ đề sẽ tự vào hộp ý tưởng.'), _ox) }),
K.card({ title: 'Lịch đăng 14 ngày', actions: K.button('Tự xếp lịch', autoSchedule, { testid: 'idea-autoplan' }), body: h('div', null,
h('p', { class: 'bds-muted' }, `${(() => { const _oh = V.channelFrom(ctx.config, ctx.settings); return _oh ? 'Kênh "' + _oh + '". ' : ''; })()}App không tự đăng – anh/chị tự đăng tay. ${V.AI_LABEL_REMINDER}`), _of) }),
));
const _ot = await _oy();
_o1q(_ot);
await render();
K.on(el, ['ideas', 'jobs'], render);
const _o1l = ctx.route && ctx.route.query;
const id = _o1l && _o1l.get && _o1l.get('id');
if (id) { st.filter = 'all'; _ow.value = 'all'; await render(); document.querySelector(`[data-testid="idea-${CSS.escape(id)}"]`)?.scrollIntoView({ block: 'center' }); }
if (_o1l && _o1l.get && _o1l.get('batch')) el.querySelector('[data-testid="idea-batch"]')?.scrollIntoView({ block: 'start' });
if (_ot.topics.length && Date.now() - _ot.last_fetch > 6 * 3600e3) _ou({ quiet: true });
return { render, approved: async () => (await _ob()).filter(_o13 => _o13.status === 'approved') };
}
export function ideasSelftest() {
const _on = [];
try {
if (I.classify('Khởi công cầu Tứ Liên').category !== 'ha_tang') _on.push('Phân loại sai');
if (I.buildScenes({ title: 'Khởi công cầu', summary: 'dài 5 km' }).scenes.length < 4) _on.push('Dàn cảnh sai');
if (V.parseIdeas('[{"title":"A"}]').length !== 1) _on.push('Đọc kết quả AI sai');
} catch (e) { _on.push(e.message); }
return _on;
}

import { kit, h } from '../_lib/kit.js';
import * as V from '../_lib/video.js';
import * as I from '../_lib/ideas.js';
const _o1 = 'bds-ideas-css';
function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o1)) return;
document.head.appendChild(h('link', { id: _o1, rel: 'stylesheet', href: new URL('./ideas.css', import.meta.url).href }));
}
const _o5 = { new: ['Chờ duyệt', 'warn'], approved: ['Đã duyệt', 'success'], rejected: ['Đã bỏ', 'muted'], done: ['Đã đăng', 'info'] };
const FILTERS = [['open', 'Đang mở'], ['new', 'Chờ duyệt'], ['approved', 'Đã duyệt'], ['done', 'Đã đăng'], ['rejected', 'Đã bỏ'], ['all', 'Tất cả']];
const _o0 = ['id', 'title', 'source', 'url', 'summary', 'status', 'score', 'deleted'];
const _o2 = 'Kéo ảnh chụp bài báo / văn bản vào đây, hoặc bấm "Chọn ảnh".';
const _o6 = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const _o4 = e => ['NOT_FOUND', 'BAD_INPUT'].includes(e && e.code) || /không được hỗ trợ|Không có đường dẫn/i.test((e && e.message) || '');
const today = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const _op = ymd => { const [, m, d] = String(ymd).split('-'); return d && m ? `${d}/${m}` : ymd; };
const _o27 = _o1y => (_o1y >= 70 ? 'ix-hi' : _o1y >= 45 ? 'ix-mid' : 'ix-lo');
const _oa = ms => { const m = Math.round((Date.now() - ms) / 60000); return m < 60 ? m + ' phút trước' : m < 1440 ? Math.round(m / 60) + ' giờ trước' : Math.round(m / 1440) + ' ngày trước'; };
export async function mount(el, ctx) {
ensureCss();
const _o3 = kit(ctx);
const _o2a = () => !!(ctx.packs && typeof ctx.packs.moduleOn === 'function' && !ctx.packs.moduleOn('video'));
const noVideo = () => _o2a() || !!(ctx.video && ctx.video.hidden());
const noEngine = () => _o2a() || !!(ctx.video && (typeof ctx.video.engineOff === 'function' ? ctx.video.engineOff() : ctx.video.hidden()));
const st = { filter: 'open', candidates: [], picked: new Set(), fetching: false };
el.innerHTML = '';
const _o1b = h('div', { 'data-testid': 'idea-list' });
const candBox = h('div', { 'data-testid': 'idea-candidates' });
const _oi = h('div', { 'data-testid': 'idea-calendar' });
const _of = h('div', { 'data-testid': 'idea-batch-list' });
const _o1v = h('div', { class: 'ix-result', 'data-testid': 'idea-intake-result' });
const driveBox = h('div', { 'data-testid': 'idea-drive-box' });
const _oz = h('div', { 'data-testid': 'idea-follow-box' });
const withData = r => { const d = V.parseData(r.data); return { ...d, ...r, _data: d }; };
const _od = async () => (await _o3.list('ideas')).map(withData);
const _om = async () => ({ ideas: await _o3.listAll('ideas').then(x => x.filter(_o15 => !Number(_o15.deleted))), jobs: await _o3.list('jobs') });
const _o1z = async (_o1x, patch = {}, dataPatch = null) => {
const base = {};
for (const _o18 of _o0) if (_o1x[_o18] !== undefined) base[_o18] = _o1x[_o18];
const data = { ...(_o1x._data || {}), ...(dataPatch || {}) };
for (const _o18 of Object.keys(data)) if (data[_o18] === null || data[_o18] === '' || data[_o18] === undefined) delete data[_o18];
return _o3.put('ideas', { ...base, ...patch, data: JSON.stringify(data) });
};
const _oc = () => !!(ctx.ai && typeof ctx.ai.run === 'function' && (typeof ctx.ai.connected !== 'function' || ctx.ai.connected()));
function _o1c(x, extra = {}) {
const text = [x.title, x.summary].filter(Boolean).join(' ');
const _ok = x.category ? { category: x.category } : I.classify(text);
const sc = I.score({ ...x, published: x.published }, { now: Date.now() });
const data = { category: _ok.category || '', topic_key: I.topicKey(x.title), score_parts: sc.parts, published: x.published || null,
sources: x.url ? [{ url: x.url, name: x.source || '' }] : [], ...extra };
return { title: x.title, url: x.url || '', summary: x.summary || '', source: x.source || 'manual', status: x.status || 'new', score: sc.score, data: JSON.stringify(data) };
}
const input = h('textarea', { rows: 3, 'data-testid': 'idea-input', 'aria-label': 'Dán link, gõ chủ đề',
placeholder: 'Dán link bài báo (nhiều link mỗi dòng một link) hoặc gõ chủ đề, vd: Vành đai 4 đoạn qua Gia Lâm' });
const _ox = h('input', { type: 'file', accept: 'image/*', multiple: true, class: 'ix-file', 'data-testid': 'idea-file', 'aria-label': 'Chọn ảnh',
onchange: e => { _o9([...e.target.files]); e.target.value = ''; } });
const _o1k = [];
const imgNote = h('span', { class: 'ix-drop-hint', 'data-testid': 'idea-img-note' }, _o2);
const drop = h('div', { class: 'ix-drop', 'data-testid': 'idea-drop' }, input, imgNote, _ox);
drop.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('ix-over'); });
drop.addEventListener('dragleave', () => drop.classList.remove('ix-over'));
drop.addEventListener('drop', e => {
e.preventDefault(); drop.classList.remove('ix-over');
const files = [...(e.dataTransfer && e.dataTransfer.files || [])].filter(f => /^image\//.test(f.type));
if (files.length) _o9(files);
const _o28 = e.dataTransfer && e.dataTransfer.getData('text/plain');
if (_o28) input.value = (input.value ? input.value + '\n' : '') + _o28;
});
function _o9(files) {
for (const f of files) if (/^image\//.test(f.type)) _o1k.push(f);
imgNote.textContent = _o1k.length ? `${_o1k.length} ảnh chờ phân loại: ${_o1k.map(f => f.name).join(', ')}` : _o2;
}
const _o1p = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1] || ''); r.onerror = rej; r.readAsDataURL(f); });
async function _ob(text, images) {
if (!_oc()) return null;
try {
const r = await ctx.ai.run('ideas', { prompt: I.buildClassifyPrompt(text, { channel: V.channelFrom(ctx.config, ctx.settings) }), images, json: true, feature: 'ideas_classify' });
const p = I.parseClassify((r && (r.text ?? r)) || '');
return p.category || p.title ? p : null;
} catch { return null; }
}
function _o1w(x, { dup, series, saved }) {
const _oj = I.CATEGORIES[x.category];
const _og = h('div', { class: 'ix-res ' + (dup ? 'ix-dup' : 'ix-ok'), 'data-testid': dup ? 'intake-dup' : 'intake-ok' },
h('div', { class: 'ix-title' }, x.title),
h('div', { class: 'ix-tags' }, _oj ? _o3.badge(_oj.icon + ' ' + _oj.label, 'info') : _o3.badge('Chưa rõ nhóm', 'muted'),
saved ? _o3.badge('Đã lưu · điểm ' + saved.score, 'success') : null),
dup ? h('div', { class: 'ix-sub' }, `Trùng ${dup.by === 'url' ? 'link' : 'chủ đề'} với ${dup.kind === 'job' ? 'video' : 'ý tưởng'} "${dup.match.title || ''}"`) : null,
series ? h('div', { class: 'ix-sub', 'data-testid': 'intake-series' }, '💡 ' + series.why) : null);
if (dup) {
const _o8 = h('div', { class: 'ix-btns' },
series ? _o3.button(`Làm phần ${series.part}`, async () => { await _o3.put('ideas', _o1c({ ...x, title: series.title }, { series: { part: series.part, of: series.of.id } })); done('Đã lưu phần ' + series.part); }, { kind: 'primary', testid: 'intake-part' }) : null,
_o3.button('Vẫn lưu', async () => { await _o3.put('ideas', _o1c(x)); done('Đã lưu'); }, { testid: 'intake-force' }),
_o3.button('Bỏ', () => _og.remove()));
const done = msg => { _o3.toast(msg, 'success'); _og.remove(); _o1q(); };
_og.appendChild(_o8);
}
return _og;
}
async function _o16(btn) {
const items = I.detectInput(input.value);
if (!items.length && !_o1k.length) { _o3.toast('Dán link, gõ chủ đề hoặc kéo ảnh vào ô', 'warn'); return; }
if (btn) btn.disabled = true;
_o1v.innerHTML = '';
let saved = 0;
try {
const _o1n = await _om();
const handle = async x => {
if (!x.category) {
const _o1a = I.classify([x.title, x.summary].join(' '));
x.category = _o1a.category;
if (_o1a.confidence < 0.5 && _oc() && x.ai !== false) { const _o7 = await _ob([x.title, x.url, x.summary].filter(Boolean).join('\n')); if (_o7 && _o7.category) x.category = _o7.category; }
}
const dup = I.findDuplicate(x, _o1n);
const series = I.seriesHint(x, _o1n);
if (dup.match || series) { _o1v.appendChild(_o1w(x, { dup: dup.match ? dup : { by: 'keywords', kind: 'idea', match: series.of }, series })); return; }
const _o1x = await _o3.put('ideas', _o1c(x));
_o1n.ideas.push(_o1x); saved++;
_o1v.appendChild(_o1w(x, { saved: _o1x }));
};
for (const _o17 of items) {
if (_o17.type === 'link') {
const _o7 = _oc() ? await _ob(_o17.url) : null;
await handle({ title: (_o7 && _o7.title) || V.titleFromUrl(_o17.url) || _o17.url, summary: (_o7 && _o7.summary) || '', url: _o17.url, source: (_o7 && _o7.source) || _o14(_o17.url), category: _o7 && _o7.category, ai: false });
}
else await handle({ title: _o17.text.slice(0, 160), source: 'manual' });
}
for (const f of _o1k.splice(0)) {
let _o7 = null;
if (f.size <= 6 * 2 ** 20) { try { _o7 = await _ob('(ảnh chụp – đọc chữ trong ảnh)', [{ mime: f.type, b64: await _o1p(f) }]); } catch { _o7 = null; } }
await handle({ title: (_o7 && _o7.title) || 'Ảnh: ' + f.name.replace(/\.[a-z0-9]+$/i, ''), summary: (_o7 && _o7.summary) || '', source: (_o7 && _o7.source) || 'ảnh', category: _o7 && _o7.category, ai: false });
}
_o9([]);
input.value = '';
if (saved) _o3.toast(`Đã lưu ${saved} ý tưởng (vào Chờ duyệt)`, 'success');
_o1q();
} finally { if (btn) btn.disabled = false; }
}
const _o14 = _o29 => { try { return new URL(_o29).hostname.replace(/^(www|m)\./, ''); } catch { return ''; } };
async function _o11(btn) {
driveBox.innerHTML = '';
if (btn) btn.disabled = true;
try {
const since = Number(await _o3.setting('ideas_drive_since', 0)) || 0;
const r = await _o3.api('inbox.drive_list', { since });
const files = (r && (r.files || r.items)) || (Array.isArray(r) ? r : []);
if (!files.length) { driveBox.appendChild(h('p', { class: 'ix-status' }, 'Thư mục "Gửi BDS Studio" chưa có tệp mới.')); return; }
const _o1n = await _om(); let _o1e = 0;
for (const f of files) {
const x = { title: String(f.name || 'Tệp Drive').replace(/\.[a-z0-9]+$/i, ''), url: f.link || f.url || '', source: 'Drive', summary: f.mime ? 'Tệp ' + f.mime : '' };
if (I.findDuplicate(x, _o1n).match) continue;
_o1n.ideas.push(await _o3.put('ideas', _o1c(x, { drive_id: f.id }))); _o1e++;
try { await _o3.api('inbox.drive_mark', { id: f.id }); } catch { }
}
await _o3.setSetting('ideas_drive_since', Date.now());
driveBox.appendChild(h('p', { class: 'ix-status' }, `Đã lấy ${_o1e} tệp mới từ thư mục "Gửi BDS Studio" vào hộp ý tưởng.`));
_o3.toast(`Đã lấy ${_o1e} tệp từ Drive`, 'success'); _o1q();
} catch (e) {
driveBox.appendChild(h('div', { class: 'ix-help', 'data-testid': 'idea-drive-help' },
h('strong', null, _o4(e) ? 'Chờ máy chủ cập nhật (inbox.drive_list).' : 'Chưa đọc được thư mục Drive.'),
h('ol', null,
h('li', null, 'Trong Google Drive của anh/chị, tạo thư mục tên đúng "Gửi BDS Studio".'),
h('li', null, 'Trên điện thoại: Chia sẻ ảnh/bài báo → Drive → chọn thư mục đó.'),
h('li', null, 'Khi máy chủ cập nhật xong, bấm lại nút này – app tự lấy tệp mới và phân loại.'),
h('li', null, 'Trong lúc chờ: tải ảnh về máy rồi kéo vào ô ở trên.'))));
} finally { if (btn) btn.disabled = false; }
}
async function _o10() {
const v = await _o3.setting('followed_topics', null);
const _o1g = Array.isArray(v) ? { topics: v } : (v && typeof v === 'object' ? v : {});
return { topics: I.followedFrom(_o1g), feeds: Array.isArray(_o1g.feeds) ? _o1g.feeds : [], last_fetch: Number(_o1g.last_fetch) || 0, last_note: _o1g.last_note || '' };
}
const _o20 = async patch => { const c = await _o10(); await _o3.setSetting('followed_topics', { ...c, ...patch }); };
async function _o12(feeds, since) {
let _o22 = null; let _ot = null;
try {
const r = await _o3.api('news.fetch', { feeds, since });
_o22 = { items: (r && r.items) || (Array.isArray(r) ? r : []), via: 'máy chủ', errors: (r && r.errors) || [] };
if (_o22.items.length || _o22.errors.length < feeds.length) return _o22;
} catch (e) { _ot = e; }
if (noEngine()) return { items: null, server: !_o22 && _o4(_ot), allFailed: !!_o22, noEngine: true };
try {
const _o1o = new URLSearchParams({ feeds: feeds.join(','), since: String(since || 0) });
const r = await V.engineCall('/news?' + _o1o, { timeout: 25000 });
return { items: r.items || [], via: 'máy dựng', errors: r.errors || [] };
} catch { return { items: null, server: !_o22 && _o4(_ot), allFailed: !!_o22 }; }
}
async function _ow({ quiet = false } = {}) {
if (st.fetching) return;
const c = await _o10();
if (!c.topics.length) { if (!quiet) _o3.toast('Thêm ít nhất một chủ đề để theo dõi', 'warn'); return; }
st.fetching = true; _o1u(c, 'Đang lấy tin…');
try {
const since = Math.max(c.last_fetch - 3600e3, Date.now() - 7 * 864e5);
const r = await _o12(I.feedsFrom({ feeds: c.feeds }), since);
if (!r.items) {
const _o1f = r.noEngine ? (r.server ? 'Chờ máy chủ cập nhật (news.fetch).' : 'Chưa lấy được tin: máy chủ không tải được nguồn RSS nào (kiểm link ở "Nguồn tin").')
: r.server ? 'Chờ máy chủ cập nhật (news.fetch). Bật máy dựng trên máy tính để lấy tin qua máy dựng.'
: r.allFailed ? 'Chưa lấy được tin: máy chủ không tải được nguồn RSS nào (kiểm link ở "Nguồn tin"), máy dựng đang tắt.' : 'Chưa lấy được tin: máy chủ và máy dựng đều chưa trả lời.';
await _o20({ last_note: _o1f }); _o1u(await _o10()); if (!quiet) _o3.toast(_o1f, 'warn'); return;
}
const { ideas, jobs } = await _om();
const rows = I.newsToIdeas(r.items, { topics: c.topics, ideas, jobs, now: Date.now(), since });
for (const _o1x of rows) await _o3.put('ideas', _o1x);
const _o1f = `Lấy ${r.items.length} tin qua ${r.via} – ${rows.length} tin khớp chủ đề đã vào hộp ý tưởng.` + (r.errors && r.errors.length ? ` ${r.errors.length} nguồn lỗi.` : '')
+ (r.via === 'máy dựng' && (r.errors || []).some(e => /ngoài danh sách báo chính thống/.test(String(e && e.message || ''))) ? ' Máy dựng chỉ tải tin từ báo/cơ quan chính thống – nguồn tự dán ngoài danh sách cần máy chủ cập nhật mới tải được.' : '');
await _o20({ last_fetch: Date.now(), last_note: _o1f });
if (!quiet || rows.length) _o3.toast(_o1f, rows.length ? 'success' : 'info');
_o1q();
} finally { st.fetching = false; _o1u(await _o10()); }
}
const followIn = h('input', { type: 'text', placeholder: 'Chủ đề, vd: cầu Tứ Liên', 'data-testid': 'follow-input', 'aria-label': 'Chủ đề theo dõi',
onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); addFollow(); } } });
async function addFollow() {
const t = followIn.value.trim();
if (t.length < 2) { _o3.toast('Gõ chủ đề muốn theo dõi', 'warn'); return; }
const c = await _o10();
await _o20({ topics: I.followedFrom([...c.topics, t]) });
followIn.value = ''; _o3.toast('Đã theo dõi "' + t + '"', 'success'); _o1u(await _o10());
}
function _o1u(c, busy) {
_oz.innerHTML = '';
_oz.appendChild(h('div', { class: 'ix-chips', 'data-testid': 'follow-chips' },
c.topics.length ? c.topics.map(t => h('span', { class: 'ix-chip', 'data-testid': 'follow-chip' }, h('span', null, t),
h('button', { type: 'button', 'aria-label': 'Bỏ theo dõi ' + t, onclick: async () => { await _o20({ topics: c.topics.filter(x => x !== t) }); _o1u(await _o10()); } }, '✕')))
: h('span', { class: 'bds-muted' }, 'Chưa theo dõi chủ đề nào.')));
_oz.appendChild(h('div', { class: 'ix-inline' }, followIn, _o3.button('Theo dõi', addFollow, { kind: 'primary', icon: 'eye', testid: 'follow-add' })));
const custom = h('textarea', { rows: 3, 'aria-label': 'Nguồn RSS thêm', placeholder: 'Mỗi dòng một link RSS (để trống = dùng danh sách mặc định)', 'data-testid': 'follow-feeds' }, c.feeds.join('\n'));
_oz.appendChild(h('details', { class: 'ix-feeds' }, h('summary', null, `Nguồn tin (${I.feedsFrom({ feeds: c.feeds }).length})`),
h('ul', null, I.DEFAULT_FEEDS.map(f => h('li', null, f.name + (f.verify ? ' (cần kiểm link)' : '')))),
custom, h('div', { class: 'bds-row bds-end' }, _o3.button('Lưu nguồn', async () => {
const feeds = custom.value.split(/\s+/).map(_o1y => _o1y.trim()).filter(_o1y => /^https?:\/\//i.test(_o1y));
await _o20({ feeds }); _o3.toast(feeds.length ? `Dùng ${feeds.length} nguồn riêng` : 'Dùng danh sách mặc định', 'success'); _o1u(await _o10());
}))));
const _o1f = busy || (c.last_note ? c.last_note + (c.last_fetch ? ' · ' + _oa(c.last_fetch) : '') : 'Tin mới khớp chủ đề sẽ tự vào hộp ý tưởng (kiểm mỗi lần mở màn này, tối đa 6 giờ/lần).');
_oz.appendChild(h('p', { class: 'ix-status' + (/Chờ máy chủ|Chưa lấy/.test(_o1f) ? ' ix-warn' : ''), 'data-testid': 'follow-status' }, _o1f));
}
async function _o23(btn) {
if (!_oc()) { _o3.toast('Chưa bật AI trong Cài đặt', 'warn'); return; }
const existing = (await _od()).map(_o15 => _o15.title);
candBox.innerHTML = ''; candBox.appendChild(h('p', { class: 'bds-muted' }, 'AI đang gợi ý…'));
if (btn) btn.disabled = true;
try {
const r = await ctx.ai.run('ideas', { prompt: V.buildIdeasPrompt({ existing, today: today(), channel: V.channelFrom(ctx.config, ctx.settings) }), json: true, feature: 'ideas_suggest' });
const _o1n = await _om();
st.candidates = V.parseIdeas((r && (r.text ?? r)) || '').filter(x => !I.findDuplicate(x, _o1n).match)
.map(x => ({ ...x, score: I.score(x).score })).sort((_o7, b) => b.score - _o7.score);
if (!st.candidates.length) _o3.toast('AI chưa trả về ý tưởng mới đúng định dạng – thử lại', 'warn');
} catch (e) { if (!_o3.isAiCancel(e)) _o3.toast((e && e.message) || 'AI chưa trả lời', 'warn'); st.candidates = []; }
finally { if (btn) btn.disabled = false; }
_o1t();
}
function _o1t() {
candBox.innerHTML = '';
if (!st.candidates.length) return;
candBox.appendChild(_o3.card({ title: `Gợi ý của AI (${st.candidates.length})`, actions: [
_o3.button('Lưu tất cả', async () => { for (const c of [...st.candidates]) await _o19(c, false); _o1t(); _o1q(); }),
_o3.button('Bỏ hết', () => { st.candidates = []; _o1t(); })], body: h('div', null, st.candidates.map(c =>
h('div', { class: 'ix-item', 'data-testid': 'cand' },
h('div', { class: 'ix-item-top' }, h('div', { class: 'ix-score ' + _o27(c.score) }, c.score, h('small', null, 'điểm')),
h('div', { class: 'ix-main' }, h('div', { class: 'ix-title' }, c.title), h('div', { class: 'ix-sub' }, [c.source, c.summary].filter(Boolean).join(' · ')))),
h('div', { class: 'ix-btns' }, c.url ? _o3.linkBtn('Mở nguồn', c.url, null, { target: '_blank' }) : h('small', { class: 'bds-muted' }, 'chưa có link – kiểm chứng trước khi làm'),
_o3.button('Lưu chờ duyệt', () => _o19(c, true), { kind: 'primary' }),
_o3.button('Bỏ', () => { st.candidates = st.candidates.filter(x => x !== c); _o1t(); }))))) }));
}
async function _o19(c, rerender = true) {
await _o3.put('ideas', _o1c({ ...c, source: c.source || 'ai' }, { kind: c.kind, ai_score: c.ai_score }));
st.candidates = st.candidates.filter(x => x !== c);
if (rerender) { _o3.toast('Đã lưu vào Chờ duyệt', 'success'); _o1t(); _o1q(); }
}
function _o1h(_o15) {
let _o1m = Array.isArray(_o15._data.scenes_outline) && _o15._data.scenes_outline.length
? { template: _o15._data.template || null, label: _o15._data.template ? (I.TEMPLATES[_o15._data.template] || {}).label : 'Dàn ý đã lưu', need_ai: false, scenes: _o15._data.scenes_outline }
: I.buildScenes(_o15);
const body = h('div', { class: 'bds-form' });
const sheet = _o3.sheet({ title: 'Dàn ý: ' + _o15.title, body, testid: 'idea-scenes' });
const _oq = () => {
body.innerHTML = '';
const _o25 = I.factsSummary(_o1m.scenes);
body.appendChild(h('div', { class: 'bds-row' }, _o3.badge(_o1m.template ? 'Mẫu: ' + _o1m.label : _o1m.label, _o1m.template ? 'success' : 'warn'),
_o3.badge(`${_o25.ok}/${_o25.total} số có nguồn`, _o25.missing ? 'warn' : 'success')));
body.appendChild(h('div', { class: 'ix-legend' }, h('span', null, h('i', { class: 'ix-dot ix-ok' }), 'có nguồn'), h('span', null, h('i', { class: 'ix-dot ix-miss' }), 'chưa có nguồn – dán link để kiểm chứng')));
if (_o1m.need_ai) body.appendChild(h('div', { class: 'ix-help' }, 'Tin chưa có mẫu sẵn. App dựng khung 4 phần; bấm "Nhờ AI dàn ý" để AI đề xuất các phần theo nội dung tin.',
h('div', { class: 'bds-row bds-end' }, _o3.button('✨ Nhờ AI dàn ý', aiScenes, { kind: 'primary', testid: 'scenes-ai', ai: 'ideas_scenes' }))));
body.appendChild(h('div', { class: 'ix-scenes' }, _o1m.scenes.map((_o1y, si) => h('div', { class: 'ix-scene', 'data-testid': 'scene' },
h('div', { class: 'ix-scene-h' }, h('b', null, _o1y.title), h('span', { class: 'ix-kind' }, I.SCENE_KINDS[_o1y.kind] || _o1y.kind)),
_o1y.facts.length ? h('div', { class: 'ix-facts' }, _o1y.facts.map((f, fi) => _ou(f, si, fi))) : null))));
const ta = h('textarea', { rows: 3, placeholder: 'Dán nội dung bài đăng để kiểm: "đã phê duyệt", "đã khởi công"… có đúng nguồn không', 'data-testid': 'claim-input' });
const _o1j = h('div', { class: 'ix-claims', 'data-testid': 'claim-result' });
body.appendChild(h('div', { class: 'ix-claims' }, h('strong', null, 'Kiểm câu chữ: chặn ghi "dự kiến" thành "đã"'), ta,
h('div', { class: 'bds-row bds-end' }, _o3.button('Kiểm tra', () => {
const r = I.checkClaims(ta.value, [_o15.title, _o15.summary, _o15._data.source_text].filter(Boolean).join('. '));
_o1j.innerHTML = '';
if (r.ok) _o1j.appendChild(h('div', { class: 'ix-issue ix-pass' }, '✓ Không thấy câu khẳng định sai mức (đề xuất/dự kiến/đã phê duyệt).'));
for (const x of r.issues) _o1j.appendChild(h('div', { class: 'ix-issue ' + (x.level === 'block' ? 'ix-block' : 'ix-warnx') }, (x.level === 'block' ? '⛔ ' : '⚠️ ') + x.message, h('div', { class: 'ix-sub' }, x.sentence)));
}, { testid: 'claim-check' })), _o1j));
body.appendChild(h('div', { class: 'bds-row bds-end' },
_o3.button('Đóng', () => sheet.close()),
_o3.button('Lưu dàn ý', async () => { _o15 = withData(await _o1z(_o15, {}, { scenes_outline: _o1m.scenes, template: _o1m.template || null })); _o3.toast('Đã lưu dàn ý', 'success'); sheet.close(); _o1q(); }, { kind: 'primary', testid: 'scenes-save' })));
};
const _ou = (f, si, fi) => {
const ok = f.status === 'ok';
const _o21 = h('input', { type: 'url', placeholder: 'Dán link nguồn của số này', value: ok ? '' : '', 'aria-label': 'Nguồn cho ' + f.text, 'data-testid': 'fact-src',
onchange: e => { const _o29 = e.target.value.trim(); if (/^https?:\/\/\S+$/i.test(_o29)) { _o1m.scenes[si].facts[fi] = { ...f, source: _o29, status: 'ok' }; _oq(); } } });
return h('div', { class: 'ix-fact ' + (ok ? 'ix-ok' : 'ix-miss'), 'data-testid': ok ? 'fact-ok' : 'fact-missing' },
h('b', null, f.text), ok ? _o3.linkBtn('Nguồn ↗', f.source, null, { target: '_blank' }) : _o21);
};
async function aiScenes() {
if (!_oc()) { _o3.toast('Chưa bật AI trong Cài đặt', 'warn'); return; }
try {
const r = await ctx.ai.run('ideas', { prompt: I.buildScenesPrompt(_o15, { channel: V.channelFrom(ctx.config, ctx.settings) }), json: true, feature: 'ideas_scenes' });
const sc = I.parseScenes((r && (r.text ?? r)) || '');
if (sc.length >= 3) { _o1m = { template: null, label: 'AI dàn ý – kiểm từng số', need_ai: false, scenes: sc }; _oq(); }
else _o3.toast('AI chưa trả về dàn ý đúng định dạng – dùng khung có sẵn', 'warn');
} catch (e) { if (!_o3.isAiCancel(e)) _o3.toast((e && e.message) || 'AI chưa trả lời', 'warn'); }
}
_oq();
}
async function _os(count) {
if (!count || noEngine()) return;
const r = I.batchReminder(Date.now(), count);
const old = await _o3.get('reminders', r.id);
if (old && (Number(old.done) || old.title === r.title)) return;
await _o3.put('reminders', old ? { ...old, title: r.title } : r);
}
function _o1r(ideas) {
_of.innerHTML = '';
const _o1l = I.batchPick(ideas, 10);
for (const id of [...st.picked]) if (!_o1l.some(p => p.id === id)) st.picked.delete(id);
if (!_o1l.length) { _of.appendChild(_o3.empty('Không có ý tưởng chờ duyệt. Dán link hoặc theo dõi chủ đề để có thêm.')); return; }
const _ol = () => `Duyệt ${st.picked.size} ý tưởng → máy dựng làm qua đêm`;
const _o13 = _o3.button(_ol(), () => _oe(_o1l.filter(p => st.picked.has(p.id))), { kind: 'primary', testid: 'batch-approve' });
const _o26 = () => { _o13.textContent = _ol(); _o13.disabled = !st.picked.size; };
_o1l.forEach(_o15 => {
const cb = h('input', { type: 'checkbox', checked: st.picked.has(_o15.id), 'data-testid': 'batch-check-' + _o15.id, 'aria-label': 'Chọn ' + _o15.title,
onchange: e => { e.target.checked ? st.picked.add(_o15.id) : st.picked.delete(_o15.id); _o26(); } });
const _oj = I.CATEGORIES[_o15.category];
_of.appendChild(h('label', { class: 'ix-batch-row' }, cb,
h('div', { class: 'ix-score ' + _o27(Number(_o15.score) || 0) }, Number(_o15.score) || 0, h('small', null, 'điểm')),
h('div', { class: 'ix-main' }, h('div', { class: 'ix-title' }, _o15.title), h('div', { class: 'ix-sub' }, [_oj ? _oj.label : '', _o15.source && _o15.source !== 'manual' ? _o15.source : ''].filter(Boolean).join(' · ')))));
});
_of.appendChild(h('div', { class: 'ix-batch-bar' },
_o3.button('Chọn tất cả', () => { _o1l.forEach(p => st.picked.add(p.id)); _o1r(ideas); }, { testid: 'batch-all' }), _o13));
_o26();
}
async function _oe(list) {
if (!list.length) return;
const jobs = I.batchJobs(list, { now: Date.now() });
for (let _o18 = 0; _o18 < list.length; _o18++) {
const job = await _o3.put('jobs', jobs[_o18]);
await _o1z(list[_o18], { status: 'approved' }, { job_id: job.id, batch_at: Date.now() });
}
st.picked.clear();
const rem = await _o3.get('reminders', I.batchReminder(Date.now()).id);
if (rem && !Number(rem.done)) await _o3.put('reminders', { ...rem, done: 1 });
_o3.toast(`Đã duyệt ${list.length} ý tưởng – ${list.length} việc dựng video đã xếp hàng cho máy dựng`, 'success');
_o1q();
}
async function _o1d(_o15) {
const [job] = I.batchJobs([_o15]);
const _o1x = await _o3.put('jobs', { ...job, status: 'waiting_approval' });
await _o1z(_o15, { status: _o15.status === 'new' ? 'approved' : _o15.status }, { job_id: _o1x.id });
_o3.toast('Đã tạo việc video (vào Chờ duyệt)', 'success'); _o1q();
}
function _o1i(_o15) {
try { sessionStorage.setItem('bds.video.prefill', [_o15.title, _o15.url].filter(Boolean).join('\n')); } catch { }
_o3.nav('content/video');
}
function _o1x(_o15) {
const [lab, tn] = _o5[_o15.status] || [_o15.status, 'muted'];
const sc = Number(_o15.score) || 0;
const parts = Array.isArray(_o15.score_parts) && _o15.score_parts.length ? _o15.score_parts : I.score(_o15).parts;
const _oj = I.CATEGORIES[_o15.category];
const date = h('input', { type: 'date', value: _o15.plan_date || '', 'aria-label': 'Ngày dự kiến đăng', 'data-testid': 'idea-date-' + _o15.id,
onchange: async e => { await _o1z(_o15, {}, { plan_date: e.target.value || null }); _o1q(); } });
const _o25 = Array.isArray(_o15.scenes_outline) ? I.factsSummary(_o15.scenes_outline) : null;
return h('div', { class: 'ix-item', 'data-testid': 'idea-' + _o15.id },
h('div', { class: 'ix-item-top' },
h('div', { class: 'ix-score ' + _o27(sc), title: 'Điểm 0–100' }, sc, h('small', null, 'điểm')),
h('div', { class: 'ix-main' },
h('div', { class: 'ix-title' }, _o15.title),
h('div', { class: 'ix-tags' }, _o3.badge(lab, tn), _oj ? _o3.badge(_oj.icon + ' ' + _oj.label, 'info') : null,
_o15.followed ? _o3.badge('Theo dõi: ' + _o15.followed, 'muted') : null, _o15.series ? _o3.badge('Phần ' + _o15.series.part, 'warn') : null,
_o25 ? _o3.badge(`${_o25.ok}/${_o25.total} số có nguồn`, _o25.missing ? 'warn' : 'success') : null,
_o15.job_id ? _o3.badge('Đã có việc dựng', 'muted') : null),
_o15.summary ? h('div', { class: 'ix-sub' }, _o15.summary) : null,
h('details', { class: 'ix-why', 'data-testid': 'idea-why-' + _o15.id }, h('summary', null, 'Vì sao ' + sc + ' điểm?'),
h('ul', null, parts.map(p => h('li', null, `${p.label}: ${p.points > 0 ? '+' : ''}${p.points}${p.max ? '/' + p.max : ''} – ${p.why}`)))))),
h('div', { class: 'ix-btns' },
_o15.url ? _o3.linkBtn('Nguồn ↗', _o15.url, null, { target: '_blank' }) : null,
_o15.status === 'new' ? _o3.button('Duyệt', async () => { await _o1z(_o15, { status: 'approved' }); _o1q(); }, { kind: 'primary', testid: 'idea-approve-' + _o15.id }) : null,
_o15.status !== 'rejected' ? _o3.button('Dàn ý', () => _o1h(_o15), { testid: 'idea-scenes-' + _o15.id }) : null,
_o15.status === 'approved' && !_o15.job_id && !noEngine() ? _o3.button('Tạo việc video', () => _o1d(_o15), { testid: 'idea-job-' + _o15.id }) : null,
_o15.status === 'approved' && !noVideo() ? _o3.button('Làm video', () => _o1i(_o15), { kind: 'primary', testid: 'idea-video-' + _o15.id }) : null,
_o15.status === 'approved' ? _o3.button('Đã đăng', async () => { await _o1z(_o15, { status: 'done' }, { posted_at: today() }); _o1q(); }) : null,
_o15.status !== 'rejected' && _o15.status !== 'done' ? _o3.button('Bỏ', async () => { await _o1z(_o15, { status: 'rejected' }); _o1q(); }) : null,
_o15.status === 'rejected' ? _o3.button('Mở lại', async () => { await _o1z(_o15, { status: 'new' }); _o1q(); }) : null),
_o15.status === 'approved' || _o15.status === 'new' ? h('label', { class: 'ix-date' }, 'Ngày đăng TikTok', date) : null);
}
function _o1s(ideas) {
_oi.innerHTML = '';
const _oh = {};
for (const _o15 of ideas) if (_o15.plan_date && _o15.status !== 'rejected') (_oh[_o15.plan_date] = _oh[_o15.plan_date] || []).push(_o15);
const _on = new Date(); const _oo = [];
for (let _o18 = 0; _o18 < 14; _o18++) {
const d = new Date(_on); d.setDate(_on.getDate() + _o18);
const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
_oo.push(h('div', { class: 'bds-item', style: { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '4px' } },
h('strong', null, `${_o6[d.getDay()]} ${_op(key)}`),
(_oh[key] || []).map(_o15 => h('div', { class: 'bds-sub' }, (_o15.status === 'done' ? '✓ ' : '• ') + _o15.title))));
}
_oi.appendChild(h('div', { class: 'bds-grid2' }, _oo));
}
async function autoSchedule() {
const ideas = await _od();
const _o1m = V.planSchedule(ideas, { start: today() });
const ids = Object.keys(_o1m);
if (!ids.length) { _o3.toast('Không có ý tưởng đã duyệt nào chưa có ngày', 'info'); return; }
for (const _o15 of ideas) if (_o1m[_o15.id]) await _o1z(_o15, {}, { plan_date: _o1m[_o15.id] });
_o3.toast(`Đã xếp lịch đăng ${ids.length} ý tưởng`, 'success'); _o1q();
}
const _oy = _o3.select(FILTERS, st.filter, { 'aria-label': 'Lọc', class: 'bds-snooze', onchange: e => { st.filter = e.target.value; _o1q(); } });
async function _o1q() {
const ideas = (await _od()).sort((_o7, b) => (Number(b.score) || 0) - (Number(_o7.score) || 0));
const rows = ideas.filter(_o15 => st.filter === 'all' ? true : st.filter === 'open' ? (_o15.status === 'new' || _o15.status === 'approved') : _o15.status === st.filter);
_o1b.innerHTML = '';
if (!rows.length) _o1b.appendChild(_o3.empty(ideas.length ? 'Không có ý tưởng khớp bộ lọc.' : 'Chưa có ý tưởng. Dán link bài báo ở ô trên, hoặc theo dõi chủ đề.'));
rows.forEach(_o15 => _o1b.appendChild(_o1x(_o15)));
_o1r(ideas);
_o1s(ideas);
await _os(ideas.filter(_o15 => _o15.status === 'new').length);
}
const _o24 = _o3.button('✨ Gợi ý bằng AI', () => _o23(_o24), { testid: 'idea-suggest', ai: 'ideas_suggest' });
const newsBtn = _o3.button('📰 Lấy tin mới', () => _ow(), { testid: 'idea-fetch-news' });
const saveBtn = _o3.button('Phân loại & lưu', () => _o16(saveBtn), { kind: 'primary', icon: 'check', testid: 'idea-save', aiBadge: 'ideas_classify', aiOptional: true, title: 'Phân loại bằng từ khoá trên máy; chỉ nhờ AI khi từ khoá chưa đủ rõ (app hỏi trước)' });
const _or = _o3.button('📁 Lấy từ Drive "Gửi BDS Studio"', () => _o11(_or), { testid: 'idea-drive' });
const pickBtn = _o3.button('🖼️ Chọn ảnh', () => _ox.click(), { testid: 'idea-pick-img' });
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'ideas-screen' },
h('div', { class: 'bds-head' }, h('h2', null, 'Nguồn ý tưởng'), h('div', { class: 'bds-row' }, newsBtn, _o24)),
_o3.card({ title: 'Hộp nhận việc', testid: 'idea-add', body: h('div', null,
h('p', { class: 'ix-lead' }, 'Dán link, gõ chủ đề hoặc kéo ảnh – app tự phân loại (quy hoạch, hạ tầng, lãi suất, chính sách, dự án, thị trường), chặn trùng và chấm điểm.'),
drop, h('div', { class: 'ix-actions', style: { marginTop: '8px' } }, saveBtn, pickBtn, _or), driveBox, _o1v) }),
candBox,
noEngine() ? null : _o3.card({ title: 'Duyệt hàng loạt 21h', testid: 'idea-batch', actions: h('span', { class: 'ix-clock', title: 'Nhắc lúc 21h ở Bảng tin' }, '🕘 nhắc 21h'),
body: h('div', null, h('p', { class: 'ix-lead' }, '10 ý tưởng điểm cao nhất đang chờ. Tick nhiều rồi bấm Duyệt một lần – máy dựng xếp hàng làm qua đêm, sáng ra xem ở Chờ duyệt.'), _of) }),
_o3.card({ title: 'Danh sách ý tưởng', actions: h('label', { class: 'bds-sel-ico', title: 'Lọc ý tưởng' }, _o3.icon('filter', 18), _oy), body: _o1b }),
_o3.card({ title: 'Theo dõi chủ đề', testid: 'idea-follow', body: h('div', null,
h('p', { class: 'ix-lead' }, 'Đánh dấu chủ đề – tin mới từ báo uy tín khớp chủ đề sẽ tự vào hộp ý tưởng.'), _oz) }),
_o3.card({ title: 'Lịch đăng 14 ngày', actions: _o3.button('Tự xếp lịch', autoSchedule, { icon: 'clock', testid: 'idea-autoplan' }), body: h('div', null,
h('p', { class: 'bds-muted' }, `App không tự đăng – anh/chị tự đăng tay lên kênh của mình theo lịch này. ${V.AI_LABEL_REMINDER}`), _oi) }),
));
const _ov = await _o10();
_o1u(_ov);
await _o1q();
_o3.on(el, ['ideas', 'jobs'], _o1q);
const _o1o = ctx.route && ctx.route.query;
const id = _o1o && _o1o.get && _o1o.get('id');
if (id) { st.filter = 'all'; _oy.value = 'all'; await _o1q(); document.querySelector(`[data-testid="idea-${CSS.escape(id)}"]`)?.scrollIntoView({ block: 'center' }); }
if (_o1o && _o1o.get && _o1o.get('batch')) el.querySelector('[data-testid="idea-batch"]')?.scrollIntoView({ block: 'start' });
if (_ov.topics.length && Date.now() - _ov.last_fetch > 6 * 3600e3) _ow({ quiet: true });
}
export default {
manifest: {
id: 'ideas', title: 'Nguồn ý tưởng', icon: '💡', screen: 'content', order: 20, version: '1.0.1', status: 'ready', requires: 'ideas' ,
help: 'Hộp nhận link/chủ đề/ảnh: tự phân loại, chặn trùng, chấm điểm, gắn nguồn từng số liệu; theo dõi chủ đề từ báo uy tín.',
},
mount,
async selftest(ctx) {
const details = [];
const _o1y = ctx && ctx.store;
for (const f of ['list', 'get', 'put']) if (!_o1y || typeof _o1y[f] !== 'function') details.push('Thiếu store.' + f);
try {
if (I.classify('Khởi công cầu Tứ Liên').category !== 'ha_tang') details.push('Phân loại sai');
if (I.buildScenes({ title: 'Khởi công cầu', summary: 'dài 5 km' }).scenes.length < 4) details.push('Dàn ý sai');
if (V.parseIdeas('[{"title":"A"}]').length !== 1) details.push('Đọc kết quả AI sai');
} catch (e) { details.push(e.message); }
return { ok: !details.length, details };
},
};

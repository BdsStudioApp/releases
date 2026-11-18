import { kit, h } from '../_lib/kit.js';
import * as C from '../_lib/calendar.js';
import { ENGINE_URL } from '../_lib/video.js';
const _o0 = `
.cal-week{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}
.cal-day{display:flex;flex-direction:column;gap:4px;min-width:0}
.cal-dh{font-weight:600;font-size:.86rem;padding:4px 6px;border-radius:10px;color:var(--muted)}
.cal-day.is-today .cal-dh{background:var(--gold-soft);color:var(--text)}
.cal-cell{min-height:92px;border:1px dashed var(--line-2);border-radius:12px;padding:4px;display:flex;flex-direction:column;gap:4px;background:var(--surface-2);transition:background .15s,border-color .15s}
.cal-cell.is-gold{border-style:solid;border-color:var(--gold-line);background:linear-gradient(180deg,var(--gold-soft),transparent 70%)}
.cal-cell.is-over{background:var(--gold-soft);border-color:var(--gold);box-shadow:inset 0 0 0 2px var(--gold)}
.cal-sl{font-size:.7rem;color:var(--faint);line-height:1.1}
.cal-chip{all:unset;box-sizing:border-box;display:grid;grid-template-columns:auto 1fr;grid-template-areas:"i tm" "t t";column-gap:4px;row-gap:1px;align-items:center;min-height:44px;padding:4px 8px;border-radius:10px;background:var(--card);border:1px solid var(--line-2);box-shadow:var(--shadow-sm);font-size:.8rem;line-height:1.15;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;overflow:hidden}
.cal-chip:focus-visible{outline:2px solid var(--gold)}
.cal-chip .i{grid-area:i}
.cal-chip .t{grid-area:t;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;min-width:0;word-break:break-word}
.cal-chip .tm{grid-area:tm;font-variant-numeric:tabular-nums;color:var(--muted);font-size:.72rem;justify-self:end}
.cal-tray .cal-chip{grid-template-columns:auto 1fr auto;grid-template-areas:"i t tm"}
.cal-chip.st-approved{border-left:4px solid var(--ok)}.cal-chip.st-posted{opacity:.62;border-left:4px solid var(--info)}.cal-chip.st-draft{border-left:4px solid var(--warn)}
.cal-ghost{position:fixed;left:0;top:0;z-index:9999;pointer-events:none;opacity:.92;box-shadow:var(--shadow-lg);transform-origin:0 0;width:150px}
.cal-tray{display:flex;flex-wrap:wrap;gap:6px;min-height:52px;padding:6px;border:1px dashed var(--line-2);border-radius:12px}
.cal-tray .cal-chip{max-width:240px}
.cal-nav{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.cal-legend{display:flex;gap:12px;flex-wrap:wrap;font-size:.8rem;color:var(--muted)}
.cal-legend i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:4px;vertical-align:-1px}
.cal-pk{display:flex;flex-direction:column;gap:10px}
.cal-cover{width:120px;aspect-ratio:9/16;object-fit:cover;border-radius:12px;background:var(--navy);border:1px solid var(--line-2)}
.cal-cover-ph{width:120px;aspect-ratio:9/16;border-radius:12px;background:linear-gradient(160deg,var(--navy),var(--navy-3));color:var(--gold-3);display:flex;align-items:center;justify-content:center;text-align:center;font-size:.75rem;padding:8px}
.cal-top{display:flex;gap:12px;align-items:flex-start}
.cal-count{font-size:.78rem;color:var(--muted);text-align:right}.cal-count.over{color:var(--danger);font-weight:600}
.cal-ck{display:flex;gap:10px;align-items:flex-start;min-height:44px;padding:6px 0;border-bottom:1px solid var(--line)}
.cal-ck input{width:22px!important;height:22px!important;min-height:0!important;flex:none;margin:2px 0 0;accent-color:var(--gold-2)}
.cal-ck small{display:block;color:var(--muted)}.cal-ck .bad{color:var(--danger)}
.cal-steps{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px}
.cal-tbl{width:100%;min-width:560px;border-collapse:collapse;font-size:.88rem}.cal-tbl td:first-child{min-width:160px}.cal-tbl th{white-space:nowrap}.cal-tbl th,.cal-tbl td{padding:8px 6px;border-bottom:1px solid var(--line);text-align:left;vertical-align:middle}
.cal-tbl th{color:var(--muted);font-weight:600;font-size:.78rem}.cal-tbl td.n{text-align:right;font-variant-numeric:tabular-nums}
.cal-tbl input{width:90px;min-height:40px}
.cal-scroll{overflow-x:auto;-webkit-overflow-scrolling:touch}
.cal-plats{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.cal-plats label{display:flex;gap:10px;align-items:center;justify-content:flex-start;min-height:48px;padding:6px 12px;border:1px solid var(--line-2);border-radius:12px;cursor:pointer;text-align:left}
.cal-plats input{width:22px!important;height:22px!important;min-height:0!important;flex:none;margin:0;accent-color:var(--gold-2)}
@media (max-width:760px){
  .cal-week{grid-template-columns:1fr;gap:8px}
  .cal-day{display:grid;grid-template-columns:58px repeat(var(--n,3),minmax(0,1fr));gap:4px;align-items:stretch}
  .cal-dh{display:flex;align-items:center;justify-content:center;text-align:center;font-size:.78rem}
  .cal-cell{min-height:56px}
}
`;
let _oc = false;
function ensureCss() {
if (_oc || typeof document === 'undefined') return;
_oc = true;
try { const _o1i = new CSSStyleSheet(); _o1i.replaceSync(_o0); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _o1i]; return; } catch { }
const _o1g = document.createElement('style'); _o1g.textContent = _o0; document.head.appendChild(_o1g);
}
const _o10 = () => { const _o1t = typeof navigator !== 'undefined' ? navigator.userAgent : ''; return /iPhone|iPad|Android/i.test(_o1t) ? 'mobile' : /Mac/i.test(_o1t) ? 'mac' : /Win/i.test(_o1t) ? 'windows' : 'other'; };
const _o1o = _ou => _ou ? C.ymd(_ou) + 'T' + C.hm(_ou) : '';
const _ol = _o1u => { const _os = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/.exec(_o1u || ''); return _os ? C.at(_os[1], _os[2]) : 0; };
export async function mount(el, ctx) {
ensureCss();
const _o1 = kit(ctx);
const _oj = (ctx.config && ctx.config.ENGINE_URL) || ENGINE_URL;
const st = { week: C.weekStart(Date.now()), slots: C.normalizeSlots(await _o1.setting('calendar_slots', null)), jobs: [], posts: [], customers: [] };
el.innerHTML = '';
const _or = async () => {
st.jobs = await _o1.list('jobs');
st.posts = st.jobs.filter(j => j.type === 'post').map(C.postView);
st.videos = C.readyVideos(st.jobs);
st.customers = await _o1.list('objects');
};
const _o1v = p => st.jobs.find(j => j.id === p.video_job_id) || null;
const _o9 = p => p.input.code || C.videoCode(p.video_job_id || p.id);
const _o1h = async (p, patch = {}) => {
const _o1u = { ...p, ...patch, input: { ...p.input, ...(patch.input || {}) }, output: { ...p.output, ...(patch.output || {}) } };
const r = await _o1.put('jobs', C.postRow(_o1u));
return C.postView(r);
};
const weekBox = h('div', { 'data-testid': 'cal-week' });
const _o1r = h('div', { class: 'cal-tray', 'data-testid': 'cal-tray', 'data-cell': 'tray' });
const _o17 = h('div', { class: 'bds-list', 'data-testid': 'cal-ready' });
const _o1k = h('div', { 'data-testid': 'cal-stats' });
const _o1f = h('div', { 'data-testid': 'cal-reuse' });
const weekLabel = h('strong', { 'data-testid': 'cal-week-label' });
function _og(_o8, post) {
_o8.addEventListener('pointerdown', e => {
if (e.button !== undefined && e.button !== 0) return;
const _o1l = e.clientX, sy = e.clientY;
let _om = null, over = null, moved = false;
try { _o8.setPointerCapture(e.pointerId); } catch { }
const target = (x, y) => { const _ov = document.elementFromPoint(x, y); return _ov && _ov.closest ? _ov.closest('[data-cell]') : null; };
const _ot = ev => {
if (!moved && Math.hypot(ev.clientX - _o1l, ev.clientY - sy) < 8) return;
ev.preventDefault();
moved = true;
if (!_om) { _om = _o8.cloneNode(true); _om.classList.add('cal-ghost'); document.body.appendChild(_om); _o8.style.opacity = '.35'; }
_om.style.transform = `translate(${ev.clientX - 30}px, ${ev.clientY - 22}px)`;
const t = target(ev.clientX, ev.clientY);
if (t !== over) { if (over) over.classList.remove('is-over'); over = t; if (over) over.classList.add('is-over'); }
};
const end = async ev => {
_o8.removeEventListener('pointermove', _ot); _o8.removeEventListener('pointerup', end); _o8.removeEventListener('pointercancel', end);
if (_om) _om.remove();
_o8.style.opacity = '';
if (over) over.classList.remove('is-over');
if (!moved) return;
_o8._dragged = true; setTimeout(() => { _o8._dragged = false; }, 50);
const t = ev.type === 'pointerup' ? target(ev.clientX, ev.clientY) : null;
if (t) await _oi(post, t.dataset.cell === 'tray' ? null : t.dataset.day, Number(t.dataset.slot));
};
_o8.addEventListener('pointermove', _ot); _o8.addEventListener('pointerup', end); _o8.addEventListener('pointercancel', end);
});
}
async function _oi(post, day, slot) {
if (post.status === 'posted') { _o1.toast('Bài đã đăng – không dời được', 'info'); return; }
const _ou = day ? C.dropTime(day, slot, { slots: st.slots, posts: st.posts, id: post.id, keepMs: post.scheduled_at }) : 0;
const p = await _o1h(post, { input: { scheduled_at: _ou } });
await _o1m(p);
_o1.toast(_ou ? 'Đã dời sang ' + C.fmtWhen(_ou) : 'Đã bỏ giờ đăng', 'success');
await _o1a();
}
function _o8(p) {
const P = C.PLATFORMS[p.platform] || { icon: '•', label: p.platform };
const _o3 = h('button', { type: 'button', class: 'cal-chip st-' + p.status, 'data-testid': 'post-' + p.id, 'data-platform': p.platform,
'aria-label': `${P.label}: ${p.title} – ${C.fmtWhen(p.scheduled_at)} (kéo để dời giờ)`,
onclick: () => { if (!_o3._dragged) _oz(p.id); } },
h('span', { class: 'i', 'aria-hidden': 'true' }, P.icon), p.scheduled_at ? h('span', { class: 'tm' }, C.hm(p.scheduled_at)) : null, h('span', { class: 't' }, p.title || 'Video'));
_og(_o3, p);
return _o3;
}
function _o1d() {
const _of = C.weekDays(st.week);
const _o1p = C.ymd(Date.now());
weekLabel.textContent = C.dayLabel(_of[0]).slice(3) + ' – ' + C.dayLabel(_of[6]).slice(3);
const S = st.slots;
const _oa = [...S.map((_o1g, i) => ({ i, label: _o1g.label + ' ' + _o1g.start + '–' + _o1g.end, gold: true })), { i: -1, label: 'Giờ khác', gold: false }];
weekBox.innerHTML = '';
const _on = h('div', { class: 'cal-week' });
_on.style.setProperty('--n', String(_oa.length));
for (const _od of _of) {
const _oe = st.posts.filter(p => p.scheduled_at && C.ymd(p.scheduled_at) === _od);
_on.appendChild(h('div', { class: 'cal-day' + (_od === _o1p ? ' is-today' : ''), 'data-day': _od },
h('div', { class: 'cal-dh' }, C.dayLabel(_od)),
_oa.map(_o5 => h('div', { class: 'cal-cell' + (_o5.gold ? ' is-gold' : ''), 'data-cell': '1', 'data-day': _od, 'data-slot': String(_o5.i), 'data-testid': `cell-${_od}-${_o5.i}` },
h('span', { class: 'cal-sl' }, _o5.label),
_oe.filter(p => C.slotIndex(p.scheduled_at, S) === _o5.i).sort((a, _o3) => a.scheduled_at - _o3.scheduled_at).map(_o8)))));
}
weekBox.appendChild(_on);
_o1r.innerHTML = '';
const _o1q = st.posts.filter(p => !p.scheduled_at && p.status !== 'posted');
if (!_o1q.length) _o1r.appendChild(h('span', { class: 'bds-muted' }, 'Không có bài chờ xếp giờ. Kéo bài vào đây để bỏ giờ.'));
_o1q.forEach(p => _o1r.appendChild(_o8(p)));
}
function _o1b() {
_o17.innerHTML = '';
if (!st.videos.length) _o17.appendChild(_o1.empty('Chưa có video làm xong. Dựng ở mục Video, hoặc bấm "Thêm video làm ngoài app".'));
for (const _o1u of st.videos.slice(0, 12)) {
const posts = st.posts.filter(p => p.video_job_id === _o1u.id);
const done = new Set(posts.map(p => p.platform));
_o17.appendChild(h('div', { class: 'bds-item', 'data-testid': 'ready-' + _o1u.id, style: { display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' } },
h('div', { class: 'bds-row-main', style: { flex: '1 1 200px' } }, h('strong', null, _o1u.title || 'Video'),
h('span', { class: 'bds-sub' }, 'Mã ' + C.videoCode(_o1u) + ' · ' + (posts.length ? posts.length + ' gói đăng (' + [...done].map(x => C.PLATFORMS[x] ? C.PLATFORMS[x].label : x).join(', ') + ')' : 'chưa có gói đăng'))),
_o1.button(posts.length ? 'Thêm nền tảng' : 'Tạo gói đăng', () => _ox(_o1u), { kind: posts.length ? 'ghost' : 'primary', testid: 'make-posts-' + _o1u.id })));
}
}
function _ox(_o1u) {
const _oo = new Set(st.posts.filter(p => p.video_job_id === _o1u.id).map(p => p.platform));
const _o4 = C.PLATFORM_IDS.map(id => h('input', { type: 'checkbox', value: id, checked: !_oo.has(id), disabled: _oo.has(id), 'data-testid': 'plat-' + id }));
const tags = h('input', { type: 'text', placeholder: 'vd: vanhdai4, gialam', 'data-testid': 'post-tags' });
const _o6 = h('textarea', { rows: 3, placeholder: 'Lời chú thích chính (để trống = tiêu đề video)', 'data-testid': 'post-cap' });
const _os = _o1.modal({ title: 'Tạo gói đăng: ' + (_o1u.title || 'Video'), testid: 'create-posts', body: h('div', { class: 'bds-form' },
h('div', { class: 'cal-plats' }, C.PLATFORM_IDS.map((id, i) => h('label', null, _o4[i], C.PLATFORMS[id].icon + ' ' + C.PLATFORMS[id].label, _oo.has(id) ? h('small', { class: 'bds-muted' }, ' (đã có)') : null))),
_o1.field('Chú thích', _o6), _o1.field('Hashtag riêng của video', tags, 'App tự bỏ dấu, thêm thẻ chung và cắt đúng giới hạn từng nền tảng.'),
h('p', { class: 'bds-muted' }, 'Gói mới tự xếp vào khung giờ vàng gần nhất (' + C.slotsText(st.slots) + '); kéo thả trên lịch để dời.'),
h('div', { class: 'bds-row bds-end' }, _o1.button('Huỷ', () => _os.close()), _o1.button('Tạo + tự xếp giờ', async () => {
const plats = _o4.filter(_o3 => _o3.checked && !_o3.disabled).map(_o3 => _o3.value);
if (!plats.length) { _o1.toast('Chọn ít nhất một nền tảng', 'warn'); return; }
const rows = C.newPosts(_o1u, plats, { caption: _o6.value.trim(), hashtags: tags.value });
const created = [];
for (const r of rows) created.push(C.postView(await _o1.put('jobs', C.postRow(r))));
const _o14 = C.autoPlace([...st.posts, ...created], { slots: st.slots });
for (const p of created) if (_o14[p.id]) await _o1h(p, { input: { scheduled_at: _o14[p.id] } });
_os.close(); _o1.toast(`Đã tạo ${created.length} gói đăng, xếp vào giờ vàng`, 'success');
if (Object.values(_o14)[0]) st.week = C.weekStart(Math.min(...Object.values(_o14)));
await _o1a();
}, { kind: 'primary', testid: 'create-posts-ok' }))) });
}
function openManualVideo() {
const title = h('input', { type: 'text', placeholder: 'Tên video', 'data-testid': 'mv-title' });
const link = h('input', { type: 'url', placeholder: 'Link Google Drive (nếu có)', 'data-testid': 'mv-link' });
const _os = _o1.modal({ title: 'Thêm video làm ngoài app', testid: 'manual-video', body: h('div', { class: 'bds-form' },
_o1.field('Tên video', title), _o1.field('Link Drive', link, 'Dùng để gửi sang điện thoại. Video dựng bằng máy dựng thì tự có ở đây.'),
h('div', { class: 'bds-row bds-end' }, _o1.button('Huỷ', () => _os.close()), _o1.button('Lưu', async () => {
const t = title.value.trim(); if (!t) { _o1.toast('Nhập tên video', 'warn'); return; }
const u = link.value.trim();
await _o1.put('jobs', { type: 'video_map', title: t, status: 'done', cost_estimate: 0, input: JSON.stringify({ manual: true }),
output: JSON.stringify({ manual: true, drive_url: /^https:\/\//.test(u) ? u : '' }) });
_os.close(); _o1.toast('Đã thêm video', 'success'); await _o1a();
}, { kind: 'primary', testid: 'mv-save' }))) });
}
async function _o1m(p) {
if (!p.output.reminder_id) return;
const r = await _o1.get('reminders', p.output.reminder_id);
if (!r) return;
if (p.status === 'posted' || !p.scheduled_at) await _o1.put('reminders', { ...r, done: 1 });
else await _o1.put('reminders', { ...r, due_at: p.scheduled_at, done: 0, notified_at: 0 });
}
async function _oz(id) {
await _or();
let p = st.posts.find(x => x.id === id);
if (!p) return;
const P = C.PLATFORMS[p.platform] || C.PLATFORMS.tiktok;
const _o1u = _o1v(p);
const code = _o9(p);
const _o1w = C.parse(_o1u && _o1u.output); const _o11 = _o1w.outputs || {};
const body = h('div', { class: 'cal-pk', 'data-testid': 'post-sheet' });
const _o1g = _o1.sheet({ title: P.icon + ' ' + P.label + ' · ' + (p.title || 'Video'), testid: 'post-pack', body, onClose: () => _o1a() });
const _oh = () => {
body.innerHTML = '';
const [lab, tone] = C.POST_STATUS[p.status] || [p.status, 'muted'];
const cover = _o11.cover && _o1u && !(ctx.video && (typeof ctx.video.engineOff === 'function' ? ctx.video.engineOff() : ctx.video.hidden())) ? h('img', { class: 'cal-cover', alt: 'Ảnh bìa', src: `${_oj}/files/${encodeURIComponent(_o1u.id)}/cover`, onerror: e => { e.target.replaceWith(h('div', { class: 'cal-cover-ph' }, 'Ảnh bìa trên máy dựng (Mac đang tắt)')); } })
: h('div', { class: 'cal-cover-ph' }, 'Ảnh bìa: chọn khung có chữ to, mặt người/bản đồ rõ');
body.appendChild(h('div', { class: 'cal-top' }, cover, h('div', { class: 'bds-row-main', style: { display: 'flex', flexDirection: 'column', gap: '6px' } },
h('div', { class: 'bds-row bds-wrap' }, _o1.badge(lab, tone), _o1.badge('Khung ' + P.aspect + ' · ' + P.size, 'muted')),
h('span', null, '🕒 ' + C.fmtWhen(p.scheduled_at)),
h('span', { class: 'bds-muted' }, 'Mã video ' + code + ' · tối đa ' + (P.maxSeconds >= 600 ? '10 phút' : P.maxSeconds + ' giây')),
h('small', { class: 'bds-muted' }, P.tip))));
const when = h('input', { type: 'datetime-local', value: _o1o(p.scheduled_at), 'data-testid': 'post-when', disabled: p.status === 'posted',
onchange: async e => { p = await _o1h(p, { input: { scheduled_at: _ol(e.target.value) } }); await _o1m(p); _oh(); } });
body.appendChild(_o1.field('Giờ đăng', when, C.slotIndex(p.scheduled_at || 0, st.slots) >= 0 ? 'Đang trong khung giờ vàng ✓' : 'Ngoài khung giờ vàng (' + C.slotsText(st.slots) + ')'));
if (P.titleMax) {
const _o1x = h('input', { type: 'text', maxlength: String(P.titleMax), value: p.input.yt_title || '', 'data-testid': 'post-yt-title',
onchange: async e => { p = await _o1h(p, { input: { yt_title: e.target.value } }); } });
body.appendChild(_o1.field('Tiêu đề YouTube (≤ ' + P.titleMax + ' ký tự)', _o1x));
}
const _ob = h('div', { class: 'cal-count', 'data-testid': 'post-count' });
const _o1n = h('textarea', { rows: 8, 'data-testid': 'post-caption', value: p.input.caption || '' });
_o1n.value = p.input.caption || '';
const _o18 = () => { const _ov = _o1n.value.length; _ob.textContent = _ov + ' / ' + P.captionMax + ' ký tự'; _ob.classList.toggle('over', _ov > P.captionMax); };
_o1n.addEventListener('input', _o18);
_o1n.addEventListener('change', async () => { p = await _o1h(p, { input: { caption: _o1n.value } }); _oh(); });
_o18();
body.appendChild(h('div', null, _o1.field('Chú thích + hashtag (' + P.label + ')', _o1n), _ob));
body.appendChild(h('div', { class: 'bds-row bds-wrap' },
_o1.button('📋 Chép caption', async () => {
const _o1s = P.titleMax ? (p.input.yt_title ? 'Tiêu đề: ' + p.input.yt_title + '\n\n' : '') + _o1n.value : _o1n.value;
_o1.toast((await _o1.copy(_o1s)) ? 'Đã chép chú thích' : 'Chưa chép được – giữ và chọn chữ để chép', 'success');
}, { kind: 'primary', testid: 'copy-caption' }),
_o1.linkBtn('📱 Mở app ' + P.label.split(' ')[0], P.openUrl, null, { target: '_blank', testid: 'open-app' }),
_o1.button('📲 Gửi video sang điện thoại', () => _oy(_o1u), { testid: 'send-phone' }),
_o1.button('↻ Soạn lại', async () => {
const _o5 = C.buildCaption(p.platform, { title: p.title, caption: p.title, hashtags: p.input.hashtags || [], code });
p = await _o1h(p, { input: { caption: _o5.text, yt_title: _o5.title || p.input.yt_title } }); _oh();
}, { testid: 'regen-caption' })));
const _o7 = C.checkPost(p, { code });
body.appendChild(h('div', { 'data-testid': 'post-checklist' }, h('h4', null, 'Kiểm tra trước khi đăng'),
C.CHECKLIST.map(_o5 => {
const _oq = _o7.items.find(i => i.id === _o5.id);
const box = h('input', { type: 'checkbox', checked: _o5.id === 'link' ? _oq.ok : !!(p.input.checklist || {})[_o5.id], disabled: _o5.id === 'link' || p.status === 'posted', 'data-testid': 'ck-' + _o5.id,
onchange: async e => { p = await _o1h(p, { input: { checklist: { ...(p.input.checklist || {}), [_o5.id]: e.target.checked } } }); _oh(); } });
return h('label', { class: 'cal-ck' }, box, h('span', null, _o5.label, h('small', null, _o5.help), _oq.note ? h('small', { class: 'bad' }, '⚠ ' + _oq.note) : null));
})));
const _o2 = h('div', { class: 'bds-row bds-wrap' });
if (p.status === 'draft') {
_o2.appendChild(_o1.button(C.canAutoSchedule(p.platform) ? '✅ Duyệt và hẹn lịch' : '✅ Duyệt (nhắc giờ đăng)', async () => {
const ok = C.canApprove(p, { code });
if (!ok.ok) { _o1.toast(ok.reason, 'warn'); return; }
const _o19 = await _o1.put('reminders', C.reminderFor(p, { title: p.title }));
p = await _o1h(p, { status: 'approved', output: { reminder_id: _o19.id, approved_at: Date.now() } });
_o1.toast(C.canAutoSchedule(p.platform) ? 'Đã duyệt – hẹn lịch trong ' + (p.platform === 'youtube' ? 'YouTube Studio' : 'Meta Business Suite') + ' theo hướng dẫn' : 'Đã duyệt – app nhắc đúng giờ', 'success');
_oh();
}, { kind: 'primary', testid: 'approve-post' }));
}
if (p.status === 'approved') {
_o2.appendChild(_o1.button('Đã đăng', async () => {
p = await _o1h(p, { status: 'posted', output: { posted_at: Date.now() } }); await _o1m(p); _oh();
}, { kind: 'primary', testid: 'mark-posted' }));
_o2.appendChild(_o1.button('Bỏ duyệt', async () => { p = await _o1h(p, { status: 'draft' }); await _o1m({ ...p, status: 'posted' }); _oh(); }));
}
if (p.status !== 'posted') _o2.appendChild(_o1.button('Xoá gói', async () => {
if (!(await _o1.confirm({ title: 'Xoá gói đăng?', text: 'Chỉ xoá gói đăng trong app, video vẫn giữ.', ok: 'Xoá', kind: 'danger' }))) return;
await _o1h(p, { deleted: 1 }); await _o1m({ ...p, status: 'posted' }); _o1g.close(); _o1a();
}, { kind: 'danger', testid: 'delete-post' }));
body.appendChild(_o2);
if (p.status !== 'draft') {
body.appendChild(h('div', { 'data-testid': 'schedule-guide' }, h('h4', null, C.canAutoSchedule(p.platform) ? 'Hẹn giờ trong ' + (p.platform === 'youtube' ? 'YouTube Studio' : 'Meta Business Suite') : 'Đăng tay đúng giờ'),
h('ol', { class: 'cal-steps' }, C.scheduleGuide(p.platform, p.scheduled_at).map(x => h('li', null, x))),
h('small', { class: 'bds-muted' }, 'Bản 1.0 không tự đăng và không lưu mật khẩu mạng xã hội. Nhắc qua Telegram + Bảng tin đúng giờ.')));
}
if (p.status === 'posted') {
const num = (k, label) => h('label', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, label),
h('input', { type: 'number', min: '0', inputmode: 'numeric', value: String(p.output[k] || ''), 'data-testid': 'stat-' + k,
onchange: async e => { p = await _o1h(p, { output: { [k]: Math.max(0, Number(e.target.value) || 0) } }); } }));
const url = h('input', { type: 'url', placeholder: 'Link bài đã đăng', value: p.output.post_url || '', onchange: async e => { p = await _o1h(p, { output: { post_url: e.target.value.trim() } }); } });
body.appendChild(h('div', null, h('h4', null, 'Số liệu (nhập tay)'), h('div', { class: 'bds-grid2' }, num('views', 'Lượt xem'), num('likes', 'Thích'), num('comments', 'Bình luận'), num('shares', 'Chia sẻ')), _o1.field('Link bài', url)));
}
};
_oh();
}
function _oy(_o1u) {
const steps = C.sendToPhoneSteps(_o1u || {}, { os: _o10() });
const _os = _o1.modal({ title: 'Gửi video sang điện thoại', testid: 'phone-modal', body: h('div', null,
h('ol', { class: 'cal-steps' }, steps.map(x => h('li', null, x.text, x.url ? h('div', null, _o1.linkBtn('Mở link Drive', x.url, null, { target: '_blank' }), ' ', _o1.button('Chép link', async () => { await _o1.copy(x.url); _o1.toast('Đã chép link', 'success'); })) : null))),
h('p', { class: 'bds-muted' }, 'Video gốc nằm trong thư mục "BDS Studio/Video" trên máy dựng.'),
h('div', { class: 'bds-row bds-end' }, _o1.button('Đóng', () => _os.close()))) });
}
function _o1c() {
const stats = C.leadStats({ customers: st.customers, posts: st.posts, videos: st.jobs.filter(j => C.VIDEO_TYPES.includes(j.type)) })
.filter(r => r.total || st.posts.some(p => p.video_job_id === r.video_id));
_o1k.innerHTML = '';
if (!stats.length) { _o1k.appendChild(_o1.empty('Chưa có số liệu. Khách vào landing qua link có mã video (' + (C.LANDING_HOST || 'landing') + '/?v=…) sẽ được đếm ở đây.')); }
else {
_o1k.appendChild(h('div', { class: 'cal-scroll' }, h('table', { class: 'cal-tbl', 'data-testid': 'stats-table' },
h('thead', null, h('tr', null, h('th', null, 'Video'), h('th', { class: 'n' }, 'Khách'), ...C.PLATFORM_IDS.map(id => h('th', { class: 'n', title: C.PLATFORMS[id].label }, C.PLATFORMS[id].icon)), h('th', { class: 'n' }, 'Lượt xem'), h('th', { class: 'n', title: 'Số khách trên 100 lượt xem' }, 'Khách/100'))),
h('tbody', null, stats.map(r => h('tr', { 'data-testid': 'stat-row-' + r.code },
h('td', null, h('strong', null, r.title), h('br'), h('small', { class: 'bds-muted' }, 'mã ' + r.code)),
h('td', { class: 'n' }, h('strong', null, String(r.total))),
...C.PLATFORM_IDS.map(id => h('td', { class: 'n' }, String(r.by[id] || 0))),
h('td', { class: 'n' }, r.views ? r.views.toLocaleString('vi-VN') : '–'),
h('td', { class: 'n' }, r.views ? String(r.rate).replace('.', ',') + '%' : '–')))))));
}
const _o15 = st.posts.filter(p => p.status === 'posted');
if (_o15.length) {
const inp = (p, k) => h('input', { type: 'number', min: '0', inputmode: 'numeric', 'aria-label': k, value: String(p.output[k] || ''), 'data-testid': `in-${k}-${p.id}`,
onchange: async e => { await _o1h(p, { output: { [k]: Math.max(0, Number(e.target.value) || 0) } }); await _or(); _o1c(); } });
_o1k.appendChild(h('details', { class: 'bds-note' }, h('summary', null, 'Nhập tay lượt xem / tương tác (' + _o15.length + ' bài đã đăng)'),
h('div', { class: 'cal-scroll' }, h('table', { class: 'cal-tbl' }, h('thead', null, h('tr', null, h('th', null, 'Bài'), h('th', null, 'Xem'), h('th', null, 'Thích'), h('th', null, 'Bình luận'))),
h('tbody', null, _o15.map(p => h('tr', null, h('td', null, (C.PLATFORMS[p.platform] || {}).icon || '', ' ', p.title), h('td', null, inp(p, 'views')), h('td', null, inp(p, 'likes')), h('td', null, inp(p, 'comments')))))))));
}
_o1f.innerHTML = '';
const _op = C.reuseIdeas(stats);
if (!_op.length) { _o1f.appendChild(h('p', { class: 'bds-muted' }, 'Video nào có từ 2 khách trở lên sẽ được gợi ý làm biến thể (cắt ngắn, đổi hook, đăng nền tảng khác).')); return; }
for (const r of _op) {
_o1f.appendChild(h('div', { class: 'bds-item', 'data-testid': 'reuse-' + r.code, style: { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '6px' } },
h('strong', null, '🔥 ' + r.title + ' – ' + r.leads + ' khách'),
h('ul', { class: 'cal-steps' }, r.items.map(i => h('li', null, i.text))),
h('div', { class: 'bds-row bds-wrap' },
_o1.button('Lưu ý tưởng biến thể', async () => {
for (const i of r.items.filter(x => x.kind !== 'platform')) {
await _o1.put('ideas', { title: (i.kind === 'cut' ? 'Bản cắt ngắn: ' : 'Đổi hook: ') + r.title, summary: i.text, url: '', source: 'Lịch & Đăng', status: 'new', score: 70,
data: JSON.stringify({ variant_of: r.video_id, variant: i.kind }) });
}
_o1.toast('Đã lưu ý tưởng biến thể vào Chờ duyệt', 'success');
}, { testid: 'reuse-save-' + r.code }),
r.items.some(i => i.kind === 'platform') ? _o1.button('Đăng nền tảng khác', () => { const _o1u = st.jobs.find(j => j.id === r.video_id); if (_o1u) _ox(_o1u); }) : null)));
}
}
function openSlots() {
const inp = h('input', { type: 'text', value: C.slotsText(st.slots), 'data-testid': 'slots-input' });
const _os = _o1.modal({ title: 'Khung giờ vàng', testid: 'slots-modal', body: h('div', { class: 'bds-form' },
_o1.field('Các khung (giờ VN)', inp, 'Ví dụ: 11:30-13:00, 19:30-22:00 (mặc định TikTok VN). Dùng cho tự xếp và tô vàng trên lịch.'),
h('div', { class: 'bds-row bds-end' },
_o1.button('Mặc định', () => { inp.value = C.slotsText(C.DEFAULT_SLOTS); }),
_o1.button('Lưu', async () => {
const _o12 = C.parseSlotsText(inp.value);
if (!_o12.length) { _o1.toast('Ghi theo dạng 11:30-13:00, 19:30-22:00', 'warn'); return; }
st.slots = C.normalizeSlots(_o12);
await _o1.setSetting('calendar_slots', st.slots);
_os.close(); _o1.toast('Đã lưu khung giờ vàng', 'success'); _o1a();
}, { kind: 'primary', testid: 'slots-save' }))) });
}
async function autoAll() {
const _o14 = C.autoPlace(st.posts.filter(p => p.status !== 'posted'), { slots: st.slots });
const ids = Object.keys(_o14);
if (!ids.length) { _o1.toast('Không có bài nào chưa xếp giờ', 'info'); return; }
for (const p of st.posts) if (_o14[p.id]) { const _ow = await _o1h(p, { input: { scheduled_at: _o14[p.id] } }); await _o1m(_ow); }
_o1.toast(`Đã xếp ${ids.length} bài vào khung giờ vàng`, 'success');
await _o1a();
}
async function _o1a() {
if (!el.isConnected && _o1e) return;
_o1e = true;
await _or();
_o1d(); _o1b(); _o1c();
}
let _o1e = false;
const _o1j = _ov => { const _od = new Date(st.week); _od.setDate(_od.getDate() + 7 * _ov); st.week = C.weekStart(_od.getTime()); _o1d(); };
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'calendar-screen' },
h('div', { class: 'bds-head' }, h('h2', null, 'Lịch & Đăng'), h('div', { class: 'bds-row bds-wrap' },
_o1.button('⚡ Tự xếp giờ vàng', autoAll, { kind: 'primary', testid: 'cal-auto' }), _o1.button('Khung giờ vàng', openSlots, { testid: 'cal-slots' }))),
_o1.card({ title: 'Lịch tuần', testid: 'cal-card', actions: h('div', { class: 'cal-nav' },
_o1.button('‹', () => _o1j(-1), { title: 'Tuần trước', testid: 'cal-prev' }), weekLabel, _o1.button('›', () => _o1j(1), { title: 'Tuần sau', testid: 'cal-next' }),
_o1.button('Tuần này', () => { st.week = C.weekStart(Date.now()); _o1d(); })),
body: h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
h('div', { class: 'cal-legend' }, h('span', null, h('i', { style: { background: 'var(--gold)' } }), 'Giờ vàng'), h('span', null, h('i', { style: { background: 'var(--warn)' } }), 'Nháp'),
h('span', null, h('i', { style: { background: 'var(--ok)' } }), 'Đã duyệt'), h('span', null, h('i', { style: { background: 'var(--info)' } }), 'Đã đăng'), h('span', null, 'Giữ và kéo bài để dời giờ')),
weekBox, h('strong', null, 'Chưa xếp giờ'), _o1r) }),
_o1.card({ title: 'Video sẵn sàng đăng', testid: 'cal-ready-card', actions: _o1.button('+ Video làm ngoài app', openManualVideo, { testid: 'cal-manual' }), body: _o17 }),
_o1.card({ title: 'Hiệu quả theo video (khách thật)', testid: 'cal-stats-card', body: _o1k }),
_o1.card({ title: 'Tái sử dụng video hiệu quả', testid: 'cal-reuse-card', body: _o1f }),
));
await _o1a();
_o1.on(el, ['jobs', 'objects', 'settings'], () => { if (!document.querySelector('.cal-ghost')) _o1a(); });
const _o16 = ctx.route && ctx.route.query; const _o13 = _o16 && _o16.get && _o16.get('post');
if (_o13) _oz(_o13);
}
export default {
manifest: {
id: 'calendar', title: 'Lịch & Đăng', icon: '🗓️', screen: 'content', order: 30, version: '1.0.0', status: 'ready', requires: 'video',
help: 'Lịch tuần kéo thả theo khung giờ vàng; gói đăng TikTok/Reels/YouTube Shorts/Zalo (chú thích đúng giới hạn, link landing có mã video); duyệt rồi app nhắc đúng giờ. App không tự đăng.',
},
mount,
async selftest(ctx) {
const details = [];
const _o1g = ctx && ctx.store;
for (const _ok of ['list', 'get', 'put']) if (!_o1g || typeof _o1g[_ok] !== 'function') details.push('Thiếu store.' + _ok);
try { if (C.buildCaption('tiktok', { caption: 'a', code: 'x' }).length > C.PLATFORMS.tiktok.captionMax) details.push('Caption sai'); } catch (e) { details.push(e.message); }
return { ok: !details.length, details: details.join('; ') || 'Đạt' };
},
};

import { g4kit, g4selftest, manifest as mf, h, G } from '../_lib/g4_ui.js';
export const manifest = mf('g4_congtruong', 'Nhật ký công trường', '🏗️', 160, 'Ghi tiến độ công trường theo ngày, có ảnh và nguồn; AI tự tìm tin có nguồn, anh/chị duyệt mới lưu.');
export async function mount(el, ctx) {
const K = g4kit(ctx);
await K.loadDir();
const _ol = { project: '' };
el.innerHTML = '';
const _o1 = h('div', { class: 'bds-screen', 'data-testid': 'g4-congtruong' });
el.appendChild(_o1);
async function _oh() {
const [objs, _of] = await Promise.all([K.list('objects'), K.projectsAll()]);
const list = G.siteTimeline(objs, _ol.project, _of);
_o1.innerHTML = '';
_o1.appendChild(K.head('Nhật ký công trường', 'Tiến độ thi công theo ngày – mỗi mục có ảnh hoặc nguồn để gửi khách yên tâm.',
K.button('+ Ghi mới', () => openEntry(ctx, K, null, _ol.project, _oh), { kind: 'primary', testid: 'g4-site-add' }),
K.button('🔎 Tự tìm tin', () => openSearch(ctx, K, _ol.project, _oh), { testid: 'g4-site-search' })));
_o1.appendChild(h('div', { class: 'g4-filters' }, K.projectSelect(_of, _ol.project, { 'aria-label': 'Dự án', 'data-testid': 'g4-site-project', onchange: (e) => { _ol.project = e.target.value; _oh(); } })));
_o1.appendChild(K.card({ title: 'Nhật ký (' + list.length + ')', testid: 'g4-site-list', body: list.length
? h('div', { class: 'bds-list' }, list.map((_oi) => h('div', { class: 'bds-item', 'data-testid': 'g4-site-' + _oi.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => openEntry(ctx, K, objs.find((o) => o.id === _oi.id), _ol.project, _oh) },
h('strong', null, G.ymdLabel(_oi.date) + ' · ' + G.projectName(_of, _oi.project)),
h('span', null, _oi.text),
h('span', { class: 'bds-row bds-wrap' }, K.badge(_oi.origin === 'ai' ? 'AI tìm – đã duyệt' : 'Tự ghi', _oi.origin === 'ai' ? 'info' : 'muted'))),
h('div', null, K.links(_oi.photos, { prefix: 'Ảnh' }), K.links(_oi.sources.map((x) => ({ url: x.url, title: x.title || G.hostOf(x.url) })), { prefix: 'Nguồn' })))))
: K.empty('Chưa có mục nào. Bấm "+ Ghi mới" hoặc "🔎 Tự tìm tin".') }));
}
await _oh();
K.on(el, ['objects'], _oh);
}
export async function openEntry(ctx, K, row, project, refresh) {
const _of = await K.projectsAll();
const _oi = row ? G.siteView(row) : { project: project || '', date: G.msToYmd(Date.now()), text: '', photos: [], sources: [], origin: 'manual' };
const _o6 = {
project: K.projectSelect(_of, _oi.project, { 'data-testid': 'g4-s-project' }),
date: K.date(_oi.date, { max: G.todayYmd(), 'data-testid': 'g4-s-date' }),
text: K.textarea(_oi.text, { rows: 4, placeholder: 'Ví dụ: Tháp A lên tầng 20, đang đổ sàn tầng 21.', 'data-testid': 'g4-s-text' }),
photos: K.linksInput(_oi.photos, { 'data-testid': 'g4-s-photos', placeholder: 'Link ảnh công trường trên Google Drive, mỗi dòng một link' }),
sources: K.linksInput(_oi.sources.map((x) => x.url), { 'data-testid': 'g4-s-sources', placeholder: 'Link nguồn (bài báo, fanpage CĐT…) – không bắt buộc với ảnh tự chụp' }),
};
const err = K.errorBox();
const save = async () => {
err.textContent = '';
if (!_o6.project.value) { err.textContent = 'Chọn dự án.'; return; }
if (!G.YMD_RE.test(_o6.date.value)) { err.textContent = 'Chọn ngày.'; return; }
const _o3 = G.dateProblem(_o6.date.value, 'Ngày ghi', { notFuture: true });
if (_o3) { err.textContent = _o3; return; }
if (!_o6.text.value.trim()) { err.textContent = 'Ghi nội dung tiến độ.'; return; }
const _o9 = G.linkProblem(_o6.photos.value) || G.linkProblem(_o6.sources.value);
if (_o9) { err.textContent = _o9; return; }
const photos = G.parseLinks(_o6.photos.value), srcUrls = G.parseLinks(_o6.sources.value);
if (_oi.origin === 'ai' && !srcUrls.length) { err.textContent = 'Mục AI tìm phải giữ ít nhất 1 link nguồn.'; return; }
const _o8 = new Map(_oi.sources.map((x) => [x.url, x]));
const sources = srcUrls.map((u) => _o8.get(u) || { url: u, title: G.hostOf(u) });
const _o0 = row || G.newRow(G.KIND.site, K.user);
await K.put('objects', G.withData(_o0, { date: _o6.date.value, text: _o6.text.value.trim().slice(0, 2000), photos, sources }, {
name: ('Công trường ' + G.projectName(_of, _o6.project.value) + ' ' + G.ymdLabel(_o6.date.value)).slice(0, 200), project: _o6.project.value, status: 'active',
}));
const _oa = G.linkNote(_o6.photos.value, _o6.sources.value);
K.toast('Đã lưu nhật ký' + _oa, _oa ? 'warn' : 'success'); _oj.close(); refresh && refresh();
};
const remove = async () => { const ok = await K.confirm({ title: K.canErase ? 'Xoá mục?' : 'Ẩn mục?', text: 'Mục nhật ký sẽ không hiện nữa.', ok: K.canErase ? 'Xoá' : 'Ẩn', kind: 'danger' }); if (!ok) return; await K.removeOrArchive(row); _oj.close(); refresh && refresh(); };
const _oj = K.sheet({ title: row ? 'Sửa nhật ký' : 'Ghi nhật ký công trường', testid: 'g4-site-form', body: [
h('div', { class: 'g4-grid' }, K.field('Dự án', _o6.project), K.field('Ngày', _o6.date)),
K.field('Tiến độ', _o6.text), K.field('Ảnh (link Drive)', _o6.photos), K.field('Nguồn', _o6.sources), err,
h('div', { class: 'bds-row bds-end bds-wrap' }, row ? K.button(K.canErase ? 'Xoá' : 'Ẩn', remove, { kind: 'danger', icon: K.canErase ? 'x' : 'eye', testid: 'g4-s-delete' }) : null, K.button('Lưu', save, { kind: 'primary', testid: 'g4-s-save' })),
] });
}
export async function openSearch(ctx, K, project, refresh) {
const _of = await K.projectsAll();
const _od = K.projectSelect(_of, project, { 'data-testid': 'g4-q-project' });
const since = K.date('', { max: G.todayYmd(), 'data-testid': 'g4-q-since' });
const place = K.input('', { placeholder: 'Khu vực (giúp tìm đúng dự án), ví dụ: Đông Anh, Hà Nội' });
const status = h('div', { 'data-testid': 'g4-q-status', role: 'status', class: 'bds-muted' });
const out = h('div', { 'data-testid': 'g4-q-drafts' });
const _oe = () => G.projectName(_of, _od.value);
const _oc = () => place.value.trim() || ((_of.find((p) => p.id === _od.value) || {}).loc || '');
const _ok = async (_o4, sources, queries, via) => {
out.innerHTML = '';
const _o5 = G.siteTimeline(await K.list('objects'), _od.value, _of);
const _o7 = _o4.filter((e) => !_o5.some((x) => x.date === e.date && x.sources.some((_oi) => _oi.url === e.source_url)));
if (!_o7.length) { out.appendChild(K.empty(_o4.length ? 'Các tin tìm được đã có trong nhật ký.' : 'Không thấy tin công trường có nguồn. Thử thêm khu vực hoặc bỏ ngày bắt đầu.')); return; }
const _o2 = _o7.map((e) => ({ e, cb: h('input', { type: 'checkbox', checked: e.grounded, 'aria-label': 'Chọn tin ' + e.date, 'data-testid': 'g4-q-pick' }) }));
out.appendChild(h('p', { class: 'bds-muted' }, via === 'chat'
? 'Kết quả dán từ chat: app không đối chiếu được nguồn – mở từng link kiểm tra rồi mới tick.'
: 'Đã tick sẵn tin có tên miền trùng nguồn Google tìm được. Mở link kiểm tra trước khi lưu.'));
out.appendChild(h('div', null, _o2.map(({ e, cb }) => h('label', { class: 'g4-draft', 'data-testid': 'g4-q-draft' }, cb,
h('span', null, h('strong', null, G.ymdLabel(e.date)), ' – ', e.text, h('br'),
h('a', { href: e.source_url, target: '_blank', rel: 'noopener noreferrer' }, '🔗 ' + (e.source_title || G.hostOf(e.source_url))), ' ',
e.grounded ? K.badge('khớp nguồn tìm được', 'success') : K.badge('chưa khớp nguồn – tự kiểm', 'warn'))))));
if (sources && sources.length) out.appendChild(h('details', null, h('summary', null, 'Nguồn Google đã dùng (' + sources.length + ')' + (queries && queries.length ? ' · từ khoá: ' + queries.join('; ') : '')),
K.links(sources.map((_oi) => ({ url: _oi.url, title: _oi.title || G.hostOf(_oi.url) })), { prefix: 'Nguồn' })));
out.appendChild(h('div', { class: 'bds-row bds-end' }, K.button('Lưu mục đã chọn', async () => {
const _ob = _o2.filter((x) => x.cb.checked).map((x) => x.e);
if (!_ob.length) { K.toast('Chưa chọn mục nào', 'warn'); return; }
const now = Date.now();
for (const e of _ob) {
await K.put('objects', G.newRow(G.KIND.site, K.user, { name: ('Công trường ' + _oe() + ' ' + G.ymdLabel(e.date)).slice(0, 200), project: _od.value, status: 'active' },
{ date: e.date, text: e.text, photos: [], sources: [{ url: e.source_url, title: e.source_title }], origin: 'ai', via, approved_by: (K.user && K.user.id) || '', approved_at: now }));
}
K.toast('Đã lưu ' + _ob.length + ' mục', 'success'); _oj.close(); refresh && refresh();
}, { kind: 'primary', testid: 'g4-q-save' })));
};
const run = async () => {
if (!_od.value) { status.textContent = 'Chọn dự án.'; return; }
out.innerHTML = '';
status.textContent = 'Đang xem chi phí…';
let est = null;
try { est = (await K.api('g4.site_search', { project: _oe(), place: _oc(), since: since.value, estimate_only: true })).estimate; }
catch (e) { status.textContent = K.apiErrorText(e); return; }
if (!est.enabled) { status.textContent = 'Cần khoá Gemini: dán khoá ở Cài đặt › Kết nối (nhân viên: nhờ Quản trị). Trong lúc chờ, dùng "Làm qua chat Gemini".'; return; }
const ok = await K.aiConfirm('g4_site', { est, testid: 'g4-q-cost', title: 'Tìm tin công trường?' });
if (!ok) { status.textContent = ''; return; }
status.textContent = 'Gemini đang tìm trên Google…';
try {
const _og = await K.api('g4.site_search', { project: _oe(), place: _oc(), since: since.value });
const _o4 = G.parseSiteEntries(_og.text, _og.sources);
status.textContent = 'Tìm được ' + _o4.length + ' tin có ngày + nguồn' + (_og.cost_usd ? ' · chi phí ' + (Math.round(_og.cost_usd * 10000) / 10000) + ' USD' : '') + '.';
await _ok(_o4, _og.sources, _og.queries, 'gemini');
} catch (e) { status.textContent = K.apiErrorText(e); }
};
const viaChat = async () => {
if (!_od.value) { status.textContent = 'Chọn dự án.'; return; }
if (!ctx.ai || typeof ctx.ai.handoff !== 'function') { status.textContent = 'Bản app này chưa có "Làm qua chat".'; return; }
const text = await ctx.ai.handoff('summarize', G.buildSitePrompt({ project: _oe(), place: _oc(), since: since.value }), { target: 'gemini' });
if (!text) return;
const _o4 = G.parseSiteEntries(text, []);
status.textContent = _o4.length ? 'Đọc được ' + _o4.length + ' tin có ngày + nguồn.' : 'Không đọc được tin nào – kết quả cần đúng mẫu, mỗi tin có ngày + link nguồn. Nhờ AI làm lại.';
await _ok(_o4, [], [], 'chat');
};
const _oj = K.sheet({ title: 'Tự tìm tin công trường', testid: 'g4-search-form', body: [
h('p', { class: 'bds-muted' }, 'AI chỉ soạn nháp từ nguồn tìm được – anh/chị duyệt từng mục, app không tự lưu.'),
h('div', { class: 'g4-grid' }, K.field('Dự án', _od), K.field('Từ ngày (không bắt buộc)', since)), K.field('Khu vực', place),
h('div', { class: 'bds-row bds-wrap' }, K.button('🔎 Tìm bằng Gemini', run, { kind: 'primary', ai: 'g4_site', testid: 'g4-q-run' }), K.button('Làm qua chat Gemini', viaChat, { icon: 'chat', testid: 'g4-q-chat', aiBadge: 'handoff' })),
status, out,
] });
}
export async function selftest(ctx) { return g4selftest(ctx, (div) => mount(div, ctx)); }
export default { manifest, mount, selftest };

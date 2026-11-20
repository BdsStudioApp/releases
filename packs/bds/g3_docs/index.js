import { g3kit, h, parseData, selftestG3 } from '../g3_lib/ui.js';
import { docPage } from '../g3_lib/page.js';
import { slugify } from '../g3_lib/seo.js';
import { taggedLink } from '../g3_lib/attribution.js';
import * as B from '../g3_lib/bridge.js';
import * as MG from '../_lib/magnet.js';
import { checkCopy } from '../g3_lib/ads.js';
import { readNews, NEWS_KEY } from '../_lib/freshnews.js';
import { gasPageUrl } from '../_lib/landing.js';
export const LANDING_NOTE = 'Dùng cho trang landing của từng dự án: khách để lại số Zalo trên trang mới nhận tài liệu (mặt bằng, bảng giá, brochure). ' +
'Cách gắn: bấm "Trang & link" → "Tạo trang trong Trình tạo landing" (hoặc tải trang tài liệu riêng .html).';
export function docView(o) {
const _o8 = parseData(o.data);
return { id: o.id, title: o.name || '', project: o.project || '', published: o.status === 'published', file_url: _o8.file_url || '', description: _o8.description || '',
video_code: _o8.video_code || '', slug: _o8.slug || slugify(o.name || o.id), host_url: _o8.host_url || '', magnet: MG.templateById(_o8.magnet) ? _o8.magnet : '',
pub: _o8.pub && typeof _o8.pub === 'object' ? _o8.pub : null, raw: o };
}
export function docLeads(doc, customers) {
return customers.filter(c => {
const _o8 = parseData(c.data);
if (_o8.g3 && _o8.g3.kind === 'doc' && _o8.g3.ref_id === doc.id) return true;
if (Array.isArray(_o8.g3_hist) && _o8.g3_hist.some(_o15 => _o15 && _o15.ref_id === doc.id)) return true;
return B.landingIdOf(_o8) === B.PREFIX.doc + doc.id || (_o8.lp_last && _o8.lp_last.landing_id === B.PREFIX.doc + doc.id);
}).sort((a, _o2) => (Number(_o2.created_at) || 0) - (Number(a.created_at) || 0));
}
export async function mount(el, ctx) {
const G = g3kit(ctx), K = G.K;
el.innerHTML = '';
const _ot = h('div', { class: 'g3', 'data-testid': 'g3-docs' });
el.appendChild(_ot);
async function _os() {
const [docs, customers] = await Promise.all([G.objs('g3_doc'), G.customers()]);
_ot.innerHTML = '';
_ot.appendChild(G.head('Tài liệu đổi số Zalo (landing dự án)', 'Mặt bằng, bảng giá, brochure cho từng dự án/video: khách để lại số mới nhận link – khách về app kèm nguồn.',
[K.button('🎣 Kho mồi câu', () => _od(), { kind: 'primary', testid: 'magnet-open' }), K.button('+ Tài liệu mới', () => _ob(null), { testid: 'doc-add' })]));
_ot.appendChild(h('div', { class: 'g3-note', 'data-testid': 'doc-landing-note' }, LANDING_NOTE));
if (!docs.length) { _ot.appendChild(K.empty('Chưa có tài liệu. Bấm "+ Tài liệu mới", dán link Google Drive (chia sẻ "Bất kỳ ai có đường liên kết").')); return; }
for (const o of docs.sort((a, _o2) => (_o2.updated_at || 0) - (a.updated_at || 0))) {
const _o8 = docView(o), leads = docLeads(_o8, customers);
_ot.appendChild(h('div', { class: 'g3-item', 'data-testid': 'doc-' + _o8.id },
h('div', { class: 'g3-row' }, h('strong', null, _o8.title), h('span', { class: 'g3-row' }, _o8.magnet ? K.badge('Mồi câu', 'info') : null, K.badge(_o8.published ? 'Đang chia sẻ' : 'Nháp', _o8.published ? 'success' : 'muted'))),
h('span', { class: 'g3-sub' }, [_o8.magnet && MG.sourceLabel(_o8.magnet), K.projectName(_o8.project), _o8.video_code && 'video ' + _o8.video_code, leads.length + ' khách để lại số'].filter(Boolean).join(' · ')),
h('div', { class: 'g3-row' },
_o8.magnet ? K.button('Đăng nhóm', () => _oi(o), { kind: 'primary', testid: 'magnet-share-' + _o8.id }) : null,
K.button(_o8.published ? 'Ngừng chia sẻ' : 'Bật chia sẻ', async () => { await K.put('objects', { ...o, status: _o8.published ? 'draft' : 'published' }); _os(); }, { testid: 'doc-toggle-' + _o8.id }),
K.button('Sửa', () => _ob(o), { testid: 'doc-edit-' + _o8.id }),
K.button('Trang & link', () => _ow(o), { kind: _o8.magnet ? 'secondary' : 'primary', testid: 'doc-share-' + _o8.id }),
K.button('Khách (' + leads.length + ')', () => _ox(_o8, leads), { testid: 'doc-leads-' + _o8.id }),
G.canErase ? K.button('Xoá', async () => { if (await G.deleteRow(o, { title: 'Xoá tài liệu?', text: 'Xoá "' + _o8.title + '". Khách đã để lại số vẫn giữ nguyên; trang .html đã đưa lên mạng sẽ không còn trả link tài liệu.' })) _os(); }, { kind: 'danger', testid: 'doc-del-' + _o8.id }) : null)));
}
}
function _ob(o) {
const _o8 = o ? docView(o) : { title: '', project: '', file_url: '', description: '', video_code: '' };
const title = G.input({ value: _o8.title, maxlength: 120, 'data-testid': 'doc-title', placeholder: 'VD: Mặt bằng + bảng giá toà A 11/2026' });
const _oq = K.select([['', '– Không gắn dự án –'], ...K.projects().map(_ol => [_ol.id, _ol.name])], _o8.project, { 'data-testid': 'doc-project' });
const url = G.input({ value: _o8.file_url, inputmode: 'url', 'data-testid': 'doc-url', placeholder: 'https://drive.google.com/file/d/…' });
const _o13 = G.input({ value: _o8.video_code, maxlength: 60, 'data-testid': 'doc-video', placeholder: 'Mã video (tuỳ chọn) – khớp tham số v= trong link' });
const _oa = G.area({ rows: 3, maxlength: 400, 'data-testid': 'doc-desc' }); _oa.value = _o8.description;
const _ov = K.sheet({ title: o ? 'Sửa tài liệu' : 'Tài liệu mới', testid: 'doc-form', body: [
G.field('Tên tài liệu', title), G.field('Dự án', _oq), G.field('Link tài liệu (https)', url, 'Google Drive: Chia sẻ → Bất kỳ ai có đường liên kết → Người xem. Link chỉ gửi cho khách SAU khi để lại số.'),
G.field('Mã video', _o13), G.field('Mô tả ngắn trên trang', _oa),
h('div', { class: 'g3-row' }, K.button('Lưu', async () => {
const t = title.value.trim(), _o12 = url.value.trim();
if (t.length < 3) return K.toast('Nhập tên tài liệu', 'warn');
if (!/^https:\/\/[^\s"'<>]+$/i.test(_o12)) return K.toast('Link tài liệu phải bắt đầu bằng https://', 'warn');
const prev = o ? parseData(o.data) : {};
await G.save('g3_doc', { ...(o || {}), name: t, project: _oq.value, status: o ? o.status : 'published' },
{ ...prev, file_url: _o12, video_code: _o13.value.trim(), description: _oa.value.trim(), slug: prev.slug || slugify(t) });
_ov.close(); K.toast('Đã lưu tài liệu', 'success'); _os();
}, { kind: 'primary', testid: 'doc-save' })),
] });
}
async function _ow(o) {
const _o8 = docView(o), agent = await G.agent(), _oc = G.endpoint();
const html = docPage({ id: _o8.id, title: _o8.title, description: _o8.description || 'Để lại số Zalo để nhận tài liệu ngay.' }, { agent, endpoint: _oc });
const hostIn = G.input({ value: _o8.host_url, inputmode: 'url', placeholder: 'https://tenmien.vn/tai-lieu/' + _o8.slug, 'data-testid': 'doc-host' });
const _of = B.available() ? B.landingById(ctx, B.PREFIX.doc + _o8.id) : null;
const _og = _of ? B.pageUrl(_of, _oc) : '';
const link = (_o3) => taggedLink(_o3, { v: _o8.video_code || undefined });
const _o4 = (_o12) => `📄 ${_o8.title} – để lại số Zalo nhận ngay: ${_o12}`;
const _ov = K.sheet({ title: 'Trang & link: ' + _o8.title, testid: 'doc-share', body: [
_o8.published ? null : G.note('Tài liệu đang ở trạng thái Nháp – bật chia sẻ thì khách mới nhận được.'),
h('h4', null, 'Cách 1 – Trang khoá thật của app (khuyên dùng)'),
h('p', { class: 'g3-sub' }, 'Link tài liệu không nằm trong trang; máy chủ chỉ trả link sau khi khách để lại số + tick đồng ý.'),
_oc ? null : G.note('Xem thử: trang tải về chưa nhận khách thật (cần nối máy chủ Google ở Cài đặt).'),
K.button('Tải trang tài liệu (.html)', () => G.download(_o8.slug + '.html', html, 'text/html;charset=utf-8'), { kind: 'primary', testid: 'doc-dl' }),
G.field('Địa chỉ trang sau khi đưa lên mạng', hostIn, 'Đưa tệp .html lên tên miền của anh/chị (Cloudflare Pages kéo thả) rồi dán địa chỉ vào đây để app tạo link gắn mã video.'),
K.button('Lưu địa chỉ', async () => {
const _o12 = hostIn.value.trim();
if (_o12 && !/^https:\/\//i.test(_o12)) return K.toast('Địa chỉ phải bắt đầu bằng https://', 'warn');
await G.save('g3_doc', o, { ...parseData(o.data), host_url: _o12 }); K.toast('Đã lưu', 'success'); _ov.close(); _os();
}, { testid: 'doc-host-save' }),
_o8.host_url ? h('div', { class: 'g3-item' }, h('span', { class: 'g3-code', 'data-testid': 'doc-link' }, link(_o8.host_url)),
h('div', { class: 'g3-row' }, K.button('Chép link', () => G.copy(link(_o8.host_url)), { testid: 'doc-copy-link' }), K.button('Chép câu cho mô tả video', () => G.copy(_o4(link(_o8.host_url))), { testid: 'doc-copy-caption' }))) : null,
h('h4', null, 'Cách 2 – Gắn vào trang của Trình tạo landing'),
h('p', { class: 'g3-sub' }, 'Trang landing đầy đủ (bảng giá, vay, ảnh) có thêm mục "Tài liệu đổi số Zalo". Khách vẫn về app; link tài liệu hiện ra sau khi gửi form.'),
_og ? h('div', { class: 'g3-item' }, h('span', { class: 'g3-code' }, link(_og)), K.button('Chép link', () => G.copy(link(_og)), { testid: 'doc-copy-lp' })) : null,
G.isOwner && B.available() ? K.button(_of ? 'Cập nhật trang landing' : 'Tạo trang trong Trình tạo landing', async () => {
const _o0 = await B.env(ctx); const prof = await B.profile(ctx);
await B.saveLanding(ctx, B.docLanding(_o8, { project: _o0.project(_o8.project), prof, existing: _of }));
K.toast(_of ? 'Đã cập nhật trang' : 'Đã tạo trang – mở Trình tạo landing để xuất bản', 'success'); _ov.close();
}, { testid: 'doc-to-landing' }) : (B.available() ? h('p', { class: 'g3-sub' }, 'Chỉ Quản trị (Admin) tạo được trang landing.') : null),
] });
}
const _o14 = (testid) => h('div', { class: 'g3-note', 'data-testid': testid }, h('strong', null, '⚠️ Trước khi phát tài liệu'),
h('ul', { style: 'margin:4px 0 0;padding-left:18px' }, MG.WARNINGS.map((w) => h('li', null, w))));
function _od() {
const _ov = K.sheet({ title: 'Kho mồi câu tài liệu', testid: 'magnet-gallery', body: [
h('p', { class: 'g3-sub' }, 'Chọn 1 mẫu: app dựng sẵn tài liệu từ dữ liệu trong app, ảnh bìa và 3 caption đăng nhóm. Khách để lại số Zalo mới mở được tài liệu và về thẳng danh sách của người chia sẻ link.'),
_o14('magnet-warn'),
h('div', { class: 'g3-grid' }, MG.TEMPLATES.map((t) => h('button', { type: 'button', class: 'g3-item', style: 'text-align:left;cursor:pointer;background:transparent;color:inherit;font:inherit;min-height:44px',
'data-testid': 'magnet-tpl-' + t.id, onclick: () => { _ov.close(); K.afterClose(() => _o7(t.id)); } }, h('strong', null, t.icon + ' ' + t.name), h('span', { class: 'g3-sub' }, t.benefit)))),
] });
}
async function _oh(_o0, pid) {
const _ol = pid ? _o0.project(pid) : null;
const plans = _ol ? _o0.plansFor(_ol).plans : [];
const planning = (await G.objs('g5_quyhoach')).filter((o) => !Number(o.deleted) && o.status !== 'archived')
.map((o) => { const _o15 = parseData(o.data); return { title: o.name || _o15.name || '', note: _o15.source || '' }; }).slice(0, 8);
const _ok = readNews(await K.setting(NEWS_KEY, null));
const rate = Number(_o0.cfg && _o0.cfg.RATE) || 10, years = Number(_o0.cfg && _o0.cfg.LOAN_YEARS) || 25;
const _oz = _ol && _ol.price && (_ol.types || []).find((_o15) => !_o15.ask && _o15.a);
const price = _oz ? Math.round(_oz.a[0] * _ol.price[0] * 1e6 / 1e7) * 1e7 : 3e9;
return { project: _ol, plans, planning, news: _ok ? _ok.items : [], price, loan: { price, ratio: (plans[0] && plans[0].loan) || 0.7, rate, years } };
}
async function _o7(tplId) {
const t = MG.templateById(tplId);
if (!t) return;
let _o0;
try { _o0 = await B.env(ctx); } catch { _o0 = { project: () => null, plansFor: () => ({ plans: [] }), cfg: {} }; }
const projList = K.projects() || [];
const _oq = K.select([['', '– Không gắn dự án –'], ...projList.map((_ol) => [_ol.id, _ol.name])], t.needs === 'project' && projList[0] ? projList[0].id : '', { 'data-testid': 'magnet-project' });
const title = G.input({ maxlength: 120, 'data-testid': 'magnet-title' });
const _oa = G.area({ rows: 3, maxlength: 400, 'data-testid': 'magnet-desc' }); _oa.value = t.benefit;
const url = G.input({ inputmode: 'url', 'data-testid': 'magnet-url', placeholder: 'https://drive.google.com/file/d/…' });
const pre = h('pre', { class: 'g3-pre', 'data-testid': 'magnet-preview' });
const cover = h('img', { alt: 'Ảnh bìa', 'data-testid': 'magnet-cover', style: 'width:100%;max-width:480px;height:auto;border-radius:10px;display:block' });
const titleWarn = h('div', { 'data-testid': 'magnet-title-warn' });
const perm = t.needsPermission ? h('input', { type: 'checkbox', 'data-testid': 'magnet-perm' }) : null;
let _o6 = null, touched = false;
const _o5 = () => {
const w = [...MG.hypeCheck(title.value), ...checkCopy(title.value)];
titleWarn.replaceChildren(...w.map((_o15) => h('small', { class: 'g3-warn', style: 'display:block' }, '⚠️ Tiêu đề: ' + _o15)));
return w;
};
const _oo = async () => {
const data = await _oh(_o0, _oq.value);
if (!touched) title.value = MG.magnetTitle(tplId, { project: data.project });
_o6 = MG.buildContent(tplId, data);
_o6.title = title.value.trim() || _o6.title;
pre.textContent = MG.contentText(_o6);
cover.src = MG.coverDataUri(tplId, { title: _o6.title });
_o5();
};
_oq.addEventListener('change', _oo);
title.addEventListener('input', () => { touched = true; _o5(); if (_o6) _o6.title = title.value.trim() || _o6.title; });
const _ov = K.sheet({ title: t.icon + ' ' + t.name, testid: 'magnet-form', body: [
t.needsPermission ? h('div', { class: 'g3-note' }, 'Bảng giá, mặt bằng thường là tài liệu của chủ đầu tư – chỉ phát khi được phép, ghi rõ mình là môi giới.') : null,
G.field('Dự án', _oq), G.field('Tiêu đề trên trang', title, 'Hấp dẫn nhưng đúng sự thật: không hứa lợi nhuận, không nói chắc tăng giá.'), titleWarn,
G.field('Lợi ích (mô tả trên trang)', _oa), cover,
h('h4', null, 'Nội dung dựng sẵn từ dữ liệu app'), pre,
K.button('Tải tài liệu dựng sẵn (.html → In → Lưu PDF)', async () => { G.download(slugify(_o6.title || t.name) + '.html', MG.contentHtml(_o6, await G.agent()), 'text/html;charset=utf-8'); }, { testid: 'magnet-doc-dl' }),
G.field('Link tài liệu (https)', url, 'Lưu PDF rồi đưa lên Google Drive (Chia sẻ → Bất kỳ ai có đường liên kết → Người xem), hoặc dán link tệp của anh/chị. Link chỉ mở cho khách SAU khi để lại số.'),
perm ? h('label', { class: 'g3-chk' }, perm, h('span', null, 'Tôi có quyền phát tài liệu này (được chủ đầu tư/đại lý cho phép).')) : null,
h('div', { class: 'g3-row' }, K.button('Lưu & lấy link đăng nhóm', async () => {
const _o10 = title.value.trim(), _o12 = url.value.trim();
if (_o10.length < 5) return K.toast('Nhập tiêu đề tài liệu', 'warn');
if (MG.hypeCheck(_o10).length) return K.toast('Tiêu đề có câu nói quá – sửa lại cho đúng sự thật', 'warn');
if (!/^https:\/\/[^\s"'<>]+$/i.test(_o12)) return K.toast('Link tài liệu phải bắt đầu bằng https://', 'warn');
if (perm && !perm.checked) return K.toast('Tích xác nhận có quyền phát tài liệu này', 'warn');
const _ou = await G.save('g3_doc', { name: _o10, project: _oq.value, status: 'published' },
{ file_url: _o12, description: _oa.value.trim(), video_code: '', slug: slugify(_o10), magnet: tplId, bullets: _o6 ? _o6.sections.map((s) => s.h) : [] });
_ov.close(); K.toast('Đã lưu tài liệu mồi câu', 'success'); await _os();
K.afterClose(() => _oi(_ou));
}, { kind: 'primary', testid: 'magnet-save' })),
] });
await _oo();
}
const _o9 = () => 'bds.magnet.posts.' + new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
const _op = () => { try { return Number(localStorage.getItem(_o9())) || 0; } catch { return 0; } };
const _o1 = () => { try { localStorage.setItem(_o9(), String(_op() + 1)); } catch { } };
async function _oi(o) {
if (!o) return;
const _o8 = docView(o), t = MG.templateById(_o8.magnet);
if (!t) return _ow(o);
const _oc = G.endpoint(), agent = await G.agent(), me = (ctx.user && ctx.user.id) || '';
const [customers, groups] = await Promise.all([G.customers(), G.objs('g3_group')]);
const _oy = MG.magnetStats(o, customers, { me });
let code = '';
try { code = String((await K.api('landing.my_code')).code || ''); } catch { code = ''; }
const _on = (_o8.pub && _o8.pub.slug) || ('mc-' + _o8.slug).slice(0, 50).replace(/-+$/, '').replace(/-{2,}/g, '-');
const _o3 = () => (_o8.pub && (_o8.pub.url || gasPageUrl(_oc, _o8.pub.slug))) || _o8.host_url || '';
const project = K.projects().find((_ol) => _ol.id === _o8.project) || null;
const _oe = K.select([['', '– Không gắn nhóm –'], ...groups.filter((g) => g.status !== 'paused' && !Number(g.deleted) && parseData(g.data).code).map((g) => [parseData(g.data).code, g.name || ''])], '', { 'data-testid': 'magnet-group' });
const hostIn = G.input({ value: _o8.host_url, inputmode: 'url', placeholder: 'https://tenmien.vn/tai-lieu/' + _o8.slug, 'data-testid': 'magnet-host' });
const linkBox = h('div', { class: 'g3-item' }), capBox = h('div', { class: 'g3' }), quota = h('p', { class: 'g3-sub', 'data-testid': 'magnet-quota' });
const pubStatus = h('span', { class: 'g3-sub', 'data-testid': 'magnet-pub-status' });
const _oj = () => { const _o2 = _o3(); return _o2 ? MG.magnetLink(_o2, { tplId: t.id, saleCode: code, group: _oe.value }) : ''; };
const _om = () => docPage({ id: _o8.id, title: _o8.title, description: _o8.description || t.benefit, cover: MG.coverDataUri(t.id, { title: _o8.title }), bullets: parseData(o.data).bullets || [],
purpose: MG.CONSENT_PURPOSE, withdraw: MG.withdrawText(agent), noindex: true }, { agent, endpoint: _oc, quick: true });
function _oo() {
const link = _oj();
pubStatus.textContent = _o8.pub ? 'Đã xuất bản nhanh' + (_o3() ? '' : ' (Dùng thử – chưa có địa chỉ thật)') : 'Chưa xuất bản';
linkBox.replaceChildren(
h('strong', null, 'Link của tôi'),
link ? h('span', { class: 'g3-code', 'data-testid': 'magnet-link' }, link)
: h('p', { class: 'g3-sub', 'data-testid': 'magnet-nolink' }, G.isOwner ? 'Chưa có địa chỉ trang: bấm "Xuất bản nhanh" hoặc dán địa chỉ trang tự đưa lên mạng.' : 'Chủ app chưa xuất bản trang khoá của tài liệu này.'),
code ? h('span', { class: 'g3-sub' }, 'Mã sale của tôi: ', h('b', { 'data-testid': 'magnet-code' }, code), ' – khách MỚI để lại số qua link này tự vào danh sách của anh/chị.')
: G.note('Máy chủ chưa cấp mã sale: khách vẫn vào app nhưng chưa tự giao người phụ trách.'),
groups.length ? G.field('Đăng ở nhóm (tuỳ chọn – biết nhóm nào ra khách)', _oe) : null,
link ? K.button('Chép link', () => G.copy(link), { testid: 'magnet-copy-link' }) : null);
capBox.replaceChildren(...MG.captions(t.id, { title: _o8.title, link: link || '[link]', project }).map((c, i) => h('div', { class: 'g3-item' },
h('pre', { class: 'g3-pre', 'data-testid': 'magnet-cap-' + i }, c),
K.button('Chép caption ' + (i + 1), async () => { await G.copy(c, 'Đã chép – tự dán vào nhóm'); _o1(); quota.textContent = MG.postQuota(_op()).message; }, { testid: 'magnet-cap-copy-' + i }))));
quota.textContent = MG.postQuota(_op()).message;
}
_oe.addEventListener('change', _oo);
const aiOut = h('div');
const _ov = K.sheet({ title: 'Đăng nhóm: ' + _o8.title, testid: 'magnet-share', body: [
_o8.published ? null : G.note('Tài liệu đang ở trạng thái Nháp – bật chia sẻ thì khách mới mở được.'),
h('div', { class: 'g3-grid' }, G.kpi('Khách để lại số', String(_oy.leads), 'magnet-stat-leads'), G.kpi('Khách của tôi', String(_oy.mine), 'magnet-stat-mine'),
G.kpi('Lượt mở trang', _oy.opens == null ? 'Chưa đếm' : String(_oy.opens), 'magnet-stat-opens')),
_oy.opens == null ? h('p', { class: 'g3-sub' }, 'Lượt mở: máy chủ hiện chưa ghi lượt xem trang nên app không đếm (không gắn mã theo dõi khách).') : null,
h('h4', null, '1. Trang khoá (để lại số mới mở tài liệu)'),
h('p', { class: 'g3-sub' }, 'Form chỉ hỏi họ tên + số Zalo, ô đồng ý bắt buộc, ghi rõ mục đích và cách rút lại. Link tài liệu không nằm trong trang.'),
G.isOwner ? K.button(_o8.pub ? 'Xuất bản lại trang khoá' : 'Xuất bản nhanh qua máy chủ Google', async () => {
try {
const _or = await K.api('landing.publish', { slug: _on, html: _om(), landing_id: B.PREFIX.doc + _o8.id, title: _o8.title });
_o8.pub = { slug: (_or && _or.slug) || _on, url: (_or && _or.url) || gasPageUrl(_oc, _on), at: Date.now() };
o = await G.save('g3_doc', o, { ...parseData(o.data), pub: _o8.pub });
K.toast('Đã xuất bản trang khoá', 'success'); _oo();
} catch (e) { K.toast('Chưa xuất bản được: ' + ((e && e.message) || e), 'warn'); }
}, { kind: 'primary', icon: 'send', testid: 'magnet-publish' }) : null,
pubStatus,
_oc ? null : G.note('Xem thử: trang chưa nhận khách thật – nối máy chủ Google ở Cài đặt.'),
h('details', null, h('summary', null, 'Tự đưa trang lên tên miền riêng'),
K.button('Tải trang khoá (.html)', () => G.download(_on + '.html', _om(), 'text/html;charset=utf-8'), { icon: 'download', testid: 'magnet-page-dl' }),
G.field('Địa chỉ trang sau khi đưa lên mạng', hostIn),
K.button('Lưu địa chỉ', async () => {
const _o12 = hostIn.value.trim();
if (_o12 && !/^https:\/\//i.test(_o12)) return K.toast('Địa chỉ phải bắt đầu bằng https://', 'warn');
_o8.host_url = _o12; o = await G.save('g3_doc', o, { ...parseData(o.data), host_url: _o12 }); K.toast('Đã lưu', 'success'); _oo();
}, { testid: 'magnet-host-save' })),
h('h4', null, '2. Link riêng để đăng'), linkBox,
h('p', { class: 'g3-sub' }, MG.SALE_LIMIT),
h('h4', null, '3. Caption đăng nhóm (chép rồi tự đăng)'), capBox,
K.button('AI viết thêm caption', async () => {
try {
const _or = await ctx.ai.run('script', { prompt: MG.aiCaptionPrompt(t.id, { title: _o8.title, project }), feature: 'ads_ai' });
const _o11 = String((_or && _or.text) || '').replace(/\[LINK\]/g, _oj() || '[link]').trim();
if (!_o11) return;
const w = [...MG.hypeCheck(_o11), ...checkCopy(_o11)];
aiOut.replaceChildren(h('div', { class: 'g3-item', 'data-testid': 'magnet-ai-out' }, h('strong', null, 'AI gợi ý (đọc lại trước khi đăng)'), h('pre', { class: 'g3-pre' }, _o11), ...w.map((_o15) => h('small', { class: 'g3-warn' }, '⚠️ ' + _o15))));
} catch (e) { if (!K.isAiCancel(e)) K.toast('AI lỗi: ' + ((e && e.message) || e), 'warn'); }
}, { ai: 'ads_ai', icon: 'sparkle', testid: 'magnet-ai' }), aiOut,
h('h4', null, 'Đăng sao cho không thành spam'), quota,
h('ul', { class: 'g3-sub', 'data-testid': 'magnet-tips', style: 'padding-left:18px;margin:0' }, MG.POSTING_TIPS.map((_o15) => h('li', null, _o15))),
_o14('magnet-share-warn'),
] });
_oo();
return _ov;
}
function _ox(_o8, leads) {
K.sheet({ title: 'Khách nhận "' + _o8.title + '"', testid: 'doc-leads', body: leads.length ? h('div', { class: 'g3' }, leads.slice(0, 200).map(c => h('div', { class: 'g3-item' },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => K.openProfile(c.id) }, h('strong', null, c.name), h('span', { class: 'g3-sub' }, ' ' + K.phone(c.phone) + ' · ' + K.date(Number(c.created_at) || Number(c.updated_at)) + (_o8.magnet ? ' · ' + MG.sourceLabel(_o8.magnet) : ''))),
h('div', { class: 'g3-row' }, K.zaloBtn(c), K.callBtn(c))))) : K.empty('Chưa có khách nào để lại số cho tài liệu này.') });
}
await _os();
K.on(el, ['objects'], _os);
}
export default {
manifest: { id: 'g3_docs', title: 'Tài liệu đổi số Zalo (landing dự án)', icon: '📄', screen: 'customers', order: 52, version: '0.1.0', status: 'ready',
help: 'Dùng cho trang landing của từng dự án: tạo tài liệu (mặt bằng, bảng giá, brochure) cho từng dự án/video; khách để lại họ tên + số Zalo mới nhận link; khách về app kèm nguồn, Telegram báo ngay.' },
mount,
async selftest(ctx) {
const html = docPage({ id: 'x', title: 'T' }, { endpoint: '' });
if (/drive\.google/.test(html) || !/data-kind="doc"/.test(html)) return { ok: false, details: 'Trang tài liệu lộ link hoặc thiếu form' };
if (MG.TEMPLATES.length !== 8) return { ok: false, details: 'Kho mồi câu thiếu mẫu' };
return selftestG3(ctx);
},
};

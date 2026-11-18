import { g3kit, h, parseData, selftestG3 } from '../g3_lib/ui.js';
import { docPage } from '../g3_lib/page.js';
import { slugify } from '../g3_lib/seo.js';
import { taggedLink } from '../g3_lib/attribution.js';
import * as B from '../g3_lib/bridge.js';
export function docView(o) {
const _o2 = parseData(o.data);
return { id: o.id, title: o.name || '', project: o.project || '', published: o.status === 'published', file_url: _o2.file_url || '', description: _o2.description || '',
video_code: _o2.video_code || '', slug: _o2.slug || slugify(o.name || o.id), host_url: _o2.host_url || '', raw: o };
}
export function docLeads(doc, customers) {
return customers.filter(c => {
const _o2 = parseData(c.data);
if (_o2.g3 && _o2.g3.kind === 'doc' && _o2.g3.ref_id === doc.id) return true;
if (Array.isArray(_o2.g3_hist) && _o2.g3_hist.some(x => x && x.ref_id === doc.id)) return true;
return B.landingIdOf(_o2) === B.PREFIX.doc + doc.id || (_o2.lp_last && _o2.lp_last.landing_id === B.PREFIX.doc + doc.id);
}).sort((a, b) => (Number(b.created_at) || 0) - (Number(a.created_at) || 0));
}
export async function mount(el, ctx) {
const G = g3kit(ctx), K = G.K;
el.innerHTML = '';
const _oa = h('div', { class: 'g3', 'data-testid': 'g3-docs' });
el.appendChild(_oa);
async function _o9() {
const [docs, customers] = await Promise.all([G.objs('g3_doc'), G.customers()]);
_oa.innerHTML = '';
_oa.appendChild(G.head('Tài liệu đổi số Zalo', 'Mặt bằng, bảng giá, brochure cho từng dự án/video: khách để lại số mới nhận link – khách về app kèm nguồn.',
K.button('+ Tài liệu mới', () => _o4(null), { kind: 'primary', testid: 'doc-add' })));
if (!docs.length) { _oa.appendChild(K.empty('Chưa có tài liệu. Bấm "+ Tài liệu mới", dán link Google Drive (chia sẻ "Bất kỳ ai có đường liên kết").')); return; }
for (const o of docs.sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0))) {
const _o2 = docView(o), leads = docLeads(_o2, customers);
_oa.appendChild(h('div', { class: 'g3-item', 'data-testid': 'doc-' + _o2.id },
h('div', { class: 'g3-row' }, h('strong', null, _o2.title), K.badge(_o2.published ? 'Đang chia sẻ' : 'Nháp', _o2.published ? 'success' : 'muted')),
h('span', { class: 'g3-sub' }, [K.projectName(_o2.project), _o2.video_code && 'video ' + _o2.video_code, leads.length + ' khách để lại số'].filter(Boolean).join(' · ')),
h('div', { class: 'g3-row' },
K.button(_o2.published ? 'Ngừng chia sẻ' : 'Bật chia sẻ', async () => { await K.put('objects', { ...o, status: _o2.published ? 'draft' : 'published' }); _o9(); }, { testid: 'doc-toggle-' + _o2.id }),
K.button('Sửa', () => _o4(o), { testid: 'doc-edit-' + _o2.id }),
K.button('Trang & link', () => _oc(o), { kind: 'primary', testid: 'doc-share-' + _o2.id }),
K.button('Khách (' + leads.length + ')', () => _od(_o2, leads), { testid: 'doc-leads-' + _o2.id }),
G.canErase ? K.button('Xoá', async () => { if (await G.deleteRow(o, { title: 'Xoá tài liệu?', text: 'Xoá "' + _o2.title + '". Khách đã để lại số vẫn giữ nguyên; trang .html đã đưa lên mạng sẽ không còn trả link tài liệu.' })) _o9(); }, { kind: 'danger', testid: 'doc-del-' + _o2.id }) : null)));
}
}
function _o4(o) {
const _o2 = o ? docView(o) : { title: '', project: '', file_url: '', description: '', video_code: '' };
const title = G.input({ value: _o2.title, maxlength: 120, 'data-testid': 'doc-title', placeholder: 'VD: Mặt bằng + bảng giá toà A 11/2026' });
const _o8 = K.select([['', '– Không gắn dự án –'], ...K.projects().map(p => [p.id, p.name])], _o2.project, { 'data-testid': 'doc-project' });
const url = G.input({ value: _o2.file_url, inputmode: 'url', 'data-testid': 'doc-url', placeholder: 'https://drive.google.com/file/d/…' });
const _of = G.input({ value: _o2.video_code, maxlength: 60, 'data-testid': 'doc-video', placeholder: 'Mã video (tuỳ chọn) – khớp tham số v= trong link' });
const _o3 = G.area({ rows: 3, maxlength: 400, 'data-testid': 'doc-desc' }); _o3.value = _o2.description;
const _ob = K.sheet({ title: o ? 'Sửa tài liệu' : 'Tài liệu mới', testid: 'doc-form', body: [
G.field('Tên tài liệu', title), G.field('Dự án', _o8), G.field('Link tài liệu (https)', url, 'Google Drive: Chia sẻ → Bất kỳ ai có đường liên kết → Người xem. Link chỉ gửi cho khách SAU khi để lại số.'),
G.field('Mã video', _of), G.field('Mô tả ngắn trên trang', _o3),
h('div', { class: 'g3-row' }, K.button('Lưu', async () => {
const t = title.value.trim(), _oe = url.value.trim();
if (t.length < 3) return K.toast('Nhập tên tài liệu', 'warn');
if (!/^https:\/\/[^\s"'<>]+$/i.test(_oe)) return K.toast('Link tài liệu phải bắt đầu bằng https://', 'warn');
const prev = o ? parseData(o.data) : {};
await G.save('g3_doc', { ...(o || {}), name: t, project: _o8.value, status: o ? o.status : 'published' },
{ ...prev, file_url: _oe, video_code: _of.value.trim(), description: _o3.value.trim(), slug: prev.slug || slugify(t) });
_ob.close(); K.toast('Đã lưu tài liệu', 'success'); _o9();
}, { kind: 'primary', testid: 'doc-save' })),
] });
}
async function _oc(o) {
const _o2 = docView(o), agent = await G.agent(), ep = G.endpoint();
const html = docPage({ id: _o2.id, title: _o2.title, description: _o2.description || 'Để lại số Zalo để nhận tài liệu ngay.' }, { agent, endpoint: ep });
const hostIn = G.input({ value: _o2.host_url, inputmode: 'url', placeholder: 'https://tenmien.vn/tai-lieu/' + _o2.slug, 'data-testid': 'doc-host' });
const _o6 = B.available() ? B.landingById(ctx, B.PREFIX.doc + _o2.id) : null;
const _o7 = _o6 ? B.pageUrl(_o6, ep) : '';
const _o5 = (base) => taggedLink(base, { v: _o2.video_code || undefined });
const _o1 = (_oe) => `📄 ${_o2.title} – để lại số Zalo nhận ngay: ${_oe}`;
const _ob = K.sheet({ title: 'Trang & link: ' + _o2.title, testid: 'doc-share', body: [
_o2.published ? null : G.note('Tài liệu đang ở trạng thái Nháp – bật chia sẻ thì khách mới nhận được.'),
h('h4', null, 'Cách 1 – Trang khoá thật của app (khuyên dùng)'),
h('p', { class: 'g3-sub' }, 'Link tài liệu không nằm trong trang; máy chủ chỉ trả link sau khi khách để lại số + tick đồng ý.'),
ep ? null : G.note('Xem thử: trang tải về chưa nhận khách thật (cần nối máy chủ Google ở Cài đặt).'),
K.button('Tải trang tài liệu (.html)', () => G.download(_o2.slug + '.html', html, 'text/html;charset=utf-8'), { kind: 'primary', testid: 'doc-dl' }),
G.field('Địa chỉ trang sau khi đưa lên mạng', hostIn, 'Đưa tệp .html lên tên miền của anh/chị (Cloudflare Pages kéo thả) rồi dán địa chỉ vào đây để app tạo link gắn mã video.'),
K.button('Lưu địa chỉ', async () => {
const _oe = hostIn.value.trim();
if (_oe && !/^https:\/\//i.test(_oe)) return K.toast('Địa chỉ phải bắt đầu bằng https://', 'warn');
await G.save('g3_doc', o, { ...parseData(o.data), host_url: _oe }); K.toast('Đã lưu', 'success'); _ob.close(); _o9();
}, { testid: 'doc-host-save' }),
_o2.host_url ? h('div', { class: 'g3-item' }, h('span', { class: 'g3-code', 'data-testid': 'doc-link' }, _o5(_o2.host_url)),
h('div', { class: 'g3-row' }, K.button('Chép link', () => G.copy(_o5(_o2.host_url)), { testid: 'doc-copy-link' }), K.button('Chép câu cho mô tả video', () => G.copy(_o1(_o5(_o2.host_url))), { testid: 'doc-copy-caption' }))) : null,
h('h4', null, 'Cách 2 – Gắn vào trang của Trình tạo landing'),
h('p', { class: 'g3-sub' }, 'Trang landing đầy đủ (bảng giá, vay, ảnh) có thêm mục "Tài liệu đổi số Zalo". Khách vẫn về app; link tài liệu hiện ra sau khi gửi form.'),
_o7 ? h('div', { class: 'g3-item' }, h('span', { class: 'g3-code' }, _o5(_o7)), K.button('Chép link', () => G.copy(_o5(_o7)), { testid: 'doc-copy-lp' })) : null,
G.isOwner && B.available() ? K.button(_o6 ? 'Cập nhật trang landing' : 'Tạo trang trong Trình tạo landing', async () => {
const _o0 = await B.env(ctx); const prof = await B.profile(ctx);
await B.saveLanding(ctx, B.docLanding(_o2, { project: _o0.project(_o2.project), prof, existing: _o6 }));
K.toast(_o6 ? 'Đã cập nhật trang' : 'Đã tạo trang – mở Trình tạo landing để xuất bản', 'success'); _ob.close();
}, { testid: 'doc-to-landing' }) : (B.available() ? h('p', { class: 'g3-sub' }, 'Chỉ Quản trị (Admin) tạo được trang landing.') : null),
] });
}
function _od(_o2, leads) {
K.sheet({ title: 'Khách nhận "' + _o2.title + '"', testid: 'doc-leads', body: leads.length ? h('div', { class: 'g3' }, leads.slice(0, 200).map(c => h('div', { class: 'g3-item' },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => K.openProfile(c.id) }, h('strong', null, c.name), h('span', { class: 'g3-sub' }, ' ' + K.phone(c.phone) + ' · ' + K.date(Number(c.created_at) || Number(c.updated_at)))),
h('div', { class: 'g3-row' }, K.zaloBtn(c), K.callBtn(c))))) : K.empty('Chưa có khách nào để lại số cho tài liệu này.') });
}
await _o9();
K.on(el, ['objects'], _o9);
}
export default {
manifest: { id: 'g3_docs', title: 'Tài liệu đổi số Zalo', icon: '📄', screen: 'customers', order: 52, version: '0.1.0', status: 'ready',
help: 'Tạo tài liệu (mặt bằng, bảng giá, brochure) cho từng dự án/video; khách để lại họ tên + số Zalo mới nhận link; khách về app kèm nguồn, Telegram báo ngay.' },
mount,
async selftest(ctx) {
const html = docPage({ id: 'x', title: 'T' }, { endpoint: '' });
if (/drive\.google/.test(html) || !/data-kind="doc"/.test(html)) return { ok: false, details: 'Trang tài liệu lộ link hoặc thiếu form' };
return selftestG3(ctx);
},
};

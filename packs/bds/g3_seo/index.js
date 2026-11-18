import { g3kit, h, selftestG3 } from '../g3_lib/ui.js';
import * as SEO from '../g3_lib/seo.js';
import * as B from '../g3_lib/bridge.js';
import { projectPage } from '../g3_lib/page.js';
const CFG_ID = 'g3seo-config';
const _o1 = { ok: 'g3-ok', warn: 'g3-warn', fail: 'g3-fail', manual: 'g3-manual' };
const _o0 = { ok: '✅', warn: '⚠️', fail: '❌', manual: '📝' };
const _o2 = {
gsc: 'https://search.google.com/search-console',
psi: 'https://pagespeed.web.dev/',
rich: 'https://search.google.com/test/rich-results',
};
export function seoGuide(G) {
const K = G.K;
const _og = (strong, rest) => h('li', { style: 'margin:4px 0' }, strong ? h('strong', null, strong) : null, strong && rest ? ' ' : null, rest || null);
const _oy = (id, title, body, open) => h('details', { 'data-testid': 'seo-guide-' + id, open: open ? '' : null, style: 'border-top:1px solid rgba(127,127,127,.2);padding:4px 0' },
h('summary', { style: 'min-height:44px;cursor:pointer;display:flex;align-items:center;font-weight:600' }, title), h('div', { class: 'g3', style: 'padding:4px 0 8px' }, body));
const _o12 = (label, href, id) => K.linkBtn(label, href, null, { target: '_blank', testid: 'seo-tool-' + id });
return K.card({ title: 'Hướng dẫn: trước và sau khi đưa trang lên Google', testid: 'seo-guide', body: [
G.note('Mục này chỉ hỗ trợ ĐƯA TRANG LÊN Google (chuẩn bị trang đúng chuẩn, sitemap, các bước gửi Google). Đây không phải công cụ SEO: app không theo dõi thứ hạng, không phân tích đối thủ, không mua/đặt link ngoài.'),
_oy('which', '1. Nên đưa trang nào lên?', [
h('ul', { style: 'margin:0;padding-left:20px' },
_og('Chính trang landing đang chạy:', 'trang anh/chị đã làm ở Trình tạo landing – xem điểm ở tab "Chấm trang landing", bấm "Áp tiêu đề/mô tả gợi ý".'),
_og('Trang riêng từng dự án:', 'ở tab "Trang dự án" – mỗi dự án một trang, tải về .html hoặc tạo luôn trong Trình tạo landing. Hợp khi khách hay tìm đúng tên dự án.'),
_og('Gợi ý:', 'bắt đầu với trang landing đang có khách, rồi thêm trang riêng cho 2–3 dự án bán chạy nhất. Không cần làm cho mọi dự án.'),
_og('Tên miền nào cũng được:', '.com, .vn, .net… đều lên Google như nhau – không bắt buộc đuôi .vn. Trang viết tiếng Việt, nói về dự án ở Việt Nam là Google hiểu trang dành cho người Việt. Nên dùng tên miền riêng, dễ nhớ để khách tin hơn.')),
], true),
_oy('before', '2. TRƯỚC khi đưa trang lên', [
h('ul', { style: 'margin:0;padding-left:20px' },
_og('Chọn 2–3 dự án bán chạy', 'mà anh/chị nắm chắc thông tin – làm kỹ ít trang tốt hơn làm nhiều trang sơ sài.'),
_og('Viết nội dung riêng 300–500 chữ', 'cho mỗi trang: vị trí thực tế, tiện ích, pháp lý, tiến độ, chính sách, nhận xét của chính anh/chị. Không chép nguyên brochure hay trang chủ đầu tư – Google bỏ qua nội dung trùng.'),
_og('Chọn từ khoá ngách,', 'cụ thể, ít người làm: "căn 2 phòng ngủ [tên dự án] giá bán", "[tên dự án] bàn giao [quý/năm]" – thay vì từ chung chung như "căn hộ Hà Nội".'),
_og('Ảnh nhẹ:', 'mỗi ảnh nên dưới khoảng 300 KB (thu nhỏ trước khi đưa lên), có mô tả ảnh. Trang nặng mở chậm trên điện thoại, khách thoát.'),
_og('Điểm SEO từ 80/100 trở lên', 'ở "Bảng kiểm SEO" (tab Trang dự án) hoặc "Chấm trang landing" – sửa các mục ❌ trước.'),
_og('Có form để lại số điện thoại', '(trang tải từ app và trang Trình tạo landing đã có sẵn) – khách vào từ Google mới thành khách của anh/chị.')),
]),
_oy('after', '3. SAU khi đưa trang lên', [
h('ol', { style: 'margin:0;padding-left:20px' },
_og('Xác minh tên miền ở Google Search Console', '(miễn phí): thêm tên miền → làm theo cách xác minh Google đưa (thường là thêm bản ghi TXT ở nơi mua tên miền / Cloudflare).'),
_og('Gửi sitemap.xml:', 'tải ở tab "Sitemap & Google", đặt ở thư mục gốc tên miền, rồi vào Search Console → "Sơ đồ trang web" → nhập sitemap.xml → Gửi.'),
_og('Kiểm tra đã được lập chỉ mục chưa:', 'Search Console → dán link trang vào ô "Kiểm tra URL" (URL Inspection) ở trên cùng → nếu chưa có, bấm "Yêu cầu lập chỉ mục".'),
_og('Đo tốc độ', 'bằng PageSpeed Insights – xem điểm trên điện thoại; chậm thì giảm dung lượng ảnh.'),
_og('Kiểm tra dữ liệu có cấu trúc', 'bằng công cụ Kiểm tra kết quả nhiều định dạng (Rich Results Test).'),
_og('Mỗi tháng xem lại một lần:', 'Search Console → "Hiệu suất": khách tìm từ khoá gì, bao nhiêu lượt hiện, bao nhiêu lượt bấm. Từ khoá có lượt hiện mà ít bấm → sửa tiêu đề/mô tả cho hấp dẫn hơn.'),
_og('Cập nhật giá, chính sách, tiến độ định kỳ', '(ít nhất mỗi tháng) và ghi ngày cập nhật – trang mới, đúng giúp giữ vị trí và khách tin hơn.')),
h('div', { class: 'g3-row' }, _o12('Google Search Console', _o2.gsc, 'gsc'), _o12('PageSpeed Insights', _o2.psi, 'psi'), _o12('Rich Results Test', _o2.rich, 'rich')),
]),
_oy('expect', '4. Nói trước để khỏi kỳ vọng sai', [
h('ul', { style: 'margin:0;padding-left:20px' },
_og('', 'Google thường mất vài tuần tới vài tháng mới đưa trang mới lên và ổn định vị trí – không lên ngay sau khi gửi.'),
_og('', 'Không ai hứa chắc được lên top Google – kể cả dịch vụ trả tiền. Cẩn thận với lời hứa "top 1 trong 7 ngày".'),
_og('', 'Muốn có khách ngay trong lúc chờ: dùng thêm quảng cáo (mục Hỗ trợ quảng cáo) và đăng nhóm cộng đồng.')),
]),
] });
}
function _oh() { const d = new Date(Date.now() + 7 * 3600e3); return String(d.getUTCMonth() + 1).padStart(2, '0') + '/' + d.getUTCFullYear(); }
function _od(faq) { return (faq || []).map(_oc => _oc.q + ' | ' + _oc.a).join('\n'); }
function _ol(t) { return String(t || '').split(/\r?\n/).map(l => l.split('|')).filter(x => x.length >= 2 && x[0].trim() && x.slice(1).join('|').trim()).map(x => ({ q: x[0].trim(), a: x.slice(1).join('|').trim() })).slice(0, 10); }
export function checklistView(G, list, testid) {
const score = SEO.checklistScore(list);
return h('div', { 'data-testid': testid },
h('p', null, h('strong', { 'data-testid': testid + '-score' }, 'Điểm SEO: ' + score + '/100'), ' – ', list.filter(x => x.status === 'ok').length + '/' + list.length + ' mục đạt'),
h('ul', { class: 'g3-list', style: 'padding-left:0;list-style:none;margin:0' }, list.map(x => h('li', { class: _o1[x.status], style: 'margin:6px 0', 'data-status': x.status, 'data-id': x.id },
_o0[x.status] + ' ', h('strong', null, x.label), ': ', x.detail, x.fix ? h('div', { class: 'g3-sub' }, '→ ' + x.fix) : null))));
}
export async function mount(el, ctx) {
const G = g3kit(ctx), K = G.K;
el.innerHTML = '';
const _ou = h('div', { class: 'g3', 'data-testid': 'g3-seo' });
el.appendChild(_ou);
const _o11 = { tab: 'project', pid: '', m: null, body: '', E: null };
try { _o11.E = await B.env(ctx); } catch { _o11.E = null; }
const projects = () => (_o11.E ? _o11.E.projects : K.projects());
const _o7 = async () => (await G.objs('g3_seo')).find(o => o.id === CFG_ID) || null;
const _o6 = async () => { const _on = await _o7(); return _on ? G.view(_on).d : { base: '', brand: '' }; };
async function _oq() {
const _o5 = await _o6();
_ou.innerHTML = '';
_ou.appendChild(G.head('Đưa trang của bạn lên Google (SEO)', 'Chỉ hỗ trợ đưa trang lên Google: chuẩn bị trang dự án hoặc chính trang landing đúng chuẩn, tạo sitemap, hướng dẫn gửi Google. Không phải công cụ SEO (không theo dõi thứ hạng, không phân tích đối thủ). Anh/chị tự viết nội dung riêng – app lo phần kỹ thuật.'));
_ou.appendChild(seoGuide(G));
const base = G.input({ value: _o5.base || '', placeholder: 'https://tenmien-cua-anh.com', 'data-testid': 'seo-base', inputmode: 'url' });
const brand = G.input({ value: _o5.brand || '', placeholder: 'Tên thương hiệu / tên anh chị', 'data-testid': 'seo-brand' });
_ou.appendChild(K.card({ title: 'Tên miền trang', testid: 'seo-config', body: [h('div', { class: 'g3-two' }, G.field('Tên miền (https://…)', base, 'Đuôi nào cũng được (.com, .vn, .net…). Dùng cho link chính thức (canonical), sitemap.xml.'), G.field('Thương hiệu', brand)),
G.isStaff ? h('div', { class: 'g3-row' }, K.button('Lưu', async () => {
const _o3 = base.value.trim();
if (_o3 && !/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(_o3)) return K.toast('Tên miền phải bắt đầu bằng https://', 'warn');
const _ob = await _o7();
await G.save('g3_seo', { ...(_ob || {}), id: CFG_ID, name: 'Cài đặt SEO', status: 'config' }, { base: _o3.replace(/\/+$/, ''), brand: brand.value.trim() });
K.toast('Đã lưu', 'success'); _oq();
}, { kind: 'primary', testid: 'seo-config-save' })) : h('p', { class: 'g3-sub', 'data-testid': 'seo-config-ro' }, 'Chủ hoặc Quản lý đổi tên miền.')] }));
if (!G.isStaff) { base.disabled = true; brand.disabled = true; }
_ou.appendChild(G.tabs([['project', 'Trang dự án'], ['landing', 'Chấm trang landing'], ['sitemap', 'Sitemap & Google']], _o11.tab, k => { _o11.tab = k; _oq(); }, 'seo-tab'));
const _o4 = h('div', { class: 'g3' });
_ou.appendChild(_o4);
if (_o11.tab === 'project') await _os(_o4, _o5);
else if (_o11.tab === 'landing') await _or(_o4, _o5);
else await _ot(_o4, _o5);
}
async function _os(_o4, _o5) {
const _ox = (await G.objs('g3_seo')).filter(o => o.id !== CFG_ID);
const _oz = K.select([['', '– Chọn dự án –'], ...projects().map(_oi => [_oi.id, _oi.name + (_ox.some(s => s.project === _oi.id) ? ' ✓' : '')])], _o11.pid, { 'data-testid': 'seo-project' });
_oz.onchange = () => { _o11.pid = _oz.value; _o11.m = null; _oq(); };
_o4.appendChild(G.field('Dự án', _oz));
if (!_o11.pid) { _o4.appendChild(K.empty('Chọn dự án để soạn trang. Dự án đã có trang SEO có dấu ✓.')); return; }
const _oi = projects().find(x => x.id === _o11.pid);
const _ov = _ox.find(s => s.project === _o11.pid);
if (!_o11.m) {
const auto = SEO.projectSeo(_oi, { brand: _o5.brand, base: _o5.base, month: _oh() });
_o11.m = _ov ? { ...auto, ...G.view(_ov).d.m, canonical: _o5.base ? SEO.joinUrl(_o5.base, (G.view(_ov).d.m || {}).slug || auto.slug) : '' } : auto;
_o11.body = _ov ? G.view(_ov).d.body || '' : '';
}
const m = _o11.m;
const agent = await G.agent();
const title = G.input({ value: m.title, maxlength: 90, 'data-testid': 'seo-title' });
const desc = G.area({ maxlength: 220, 'data-testid': 'seo-desc', rows: 3 }); desc.value = m.description;
const slug = G.input({ value: m.slug, maxlength: 60, 'data-testid': 'seo-slug' });
const kw = G.input({ value: m.keyword, 'data-testid': 'seo-keyword' });
const faq = G.area({ rows: 4, 'data-testid': 'seo-faq' }); faq.value = _od(m.faq);
const faqHint = h('small', { class: 'g3-sub', 'data-testid': 'seo-faq-hint' });
const _o14 = () => { const n = faq.value.split(/\r?\n/).filter(l => l.trim()).length, ok = _ol(faq.value).length; faqHint.textContent = n ? `${ok}/${n} dòng đúng dạng "Câu hỏi | Trả lời"` + (ok < n ? ' – dòng thiếu dấu | sẽ bị bỏ' : '') : ''; faqHint.className = ok < n ? 'g3-warn' : 'g3-sub'; };
faq.addEventListener('input', _o14); _o14();
const body = G.area({ rows: 8, 'data-testid': 'seo-body', placeholder: 'Viết nội dung riêng: vị trí thực tế, tiện ích, pháp lý, chính sách, nhận xét của anh/chị… (mỗi đoạn một dòng)' }); body.value = _o11.body;
const _o9 = (inp, a, _o3) => { const s = h('small', { class: 'g3-sub' }); const _oc = () => { const n = inp.value.length; s.textContent = n + ' ký tự (nên ' + a + '–' + _o3 + ')'; s.className = n >= a && n <= _o3 ? 'g3-ok' : 'g3-warn'; }; inp.addEventListener('input', _oc); _oc(); return s; };
const _o8 = h('div');
const _of = h('pre', { class: 'g3-pre', 'data-testid': 'seo-ld' });
const _oo = () => {
const _o10 = SEO.slugify(slug.value) || m.slug;
Object.assign(m, { title: title.value.trim(), description: desc.value.trim(), slug: _o10, keyword: kw.value.trim(), faq: _ol(faq.value), canonical: _o5.base ? SEO.joinUrl(_o5.base, _o10) : '' });
_o11.body = body.value;
return m;
};
const facts = () => [_oi.dev && 'Chủ đầu tư: ' + _oi.dev, _oi.loc && 'Vị trí: ' + _oi.loc, (_oi.types || []).length && 'Loại căn: ' + _oi.types.map(t => t.n).join(', '), _oi.handover && 'Bàn giao dự kiến: ' + String(_oi.handover).split('-').reverse().join('/')].filter(Boolean);
const _oe = () => projectPage(_oo(), { agent, base: _o5.base, endpoint: G.endpoint(), facts: facts(), body: _o11.body });
const _op = () => {
const _oj = SEO.auditHtml(_oe());
const list = SEO.seoChecklist(_oj, { keyword: m.keyword, inSitemap: !!_ov, disclaimer: true });
_o8.innerHTML = '';
_o8.appendChild(checklistView(G, list, 'seo-check'));
_of.textContent = SEO.jsonLdScripts([SEO.projectLd(m, agent), SEO.faqLd(m.faq)]);
};
[title, desc, slug, kw, faq, body].forEach(i => i.addEventListener('input', _op));
const _ow = async () => {
_oo();
const _ob = (await G.objs('g3_seo')).find(s => s.project === _o11.pid);
await G.save('g3_seo', { ...(_ob || {}), name: _oi.name, project: _oi.id, status: 'ready' }, { m: { title: m.title, description: m.description, slug: m.slug, keyword: m.keyword, faq: m.faq }, body: _o11.body, saved_at: Date.now() });
};
_o4.appendChild(K.card({ title: 'Nội dung SEO – ' + _oi.name, testid: 'seo-editor', body: [
G.field('Tiêu đề trang (hiện trên Google)', title), _o9(title, SEO.LIMITS.titleMin, SEO.LIMITS.titleMax),
G.field('Mô tả (dòng dưới tiêu đề trên Google)', desc), _o9(desc, SEO.LIMITS.descMin, SEO.LIMITS.descMax),
h('div', { class: 'g3-two' }, G.field('Đường dẫn (không dấu)', slug), G.field('Từ khoá chính', kw)),
G.field('Câu hỏi thường gặp (mỗi dòng: Câu hỏi | Trả lời)', faq, 'Giá ghi "tham khảo", nói rõ nguồn: phiếu tính giá của chủ đầu tư.'), faqHint,
G.field('Nội dung riêng của anh/chị', body, 'Google ưu tiên nội dung tự viết, hữu ích; không chép nguyên văn từ trang chủ đầu tư.'),
h('div', { class: 'g3-row' },
K.button('Lưu', async () => { await _ow(); K.toast('Đã lưu trang SEO', 'success'); _oq(); }, { kind: 'primary', testid: 'seo-save' }),
K.button('Tải trang .html', async () => { await _ow(); G.download(m.slug + '.html', _oe(), 'text/html;charset=utf-8'); }, { testid: 'seo-download' }),
K.button('Chép JSON-LD', () => G.copy(_of.textContent, 'Đã chép khối JSON-LD'), { testid: 'seo-copy-ld' }),
G.isOwner && B.available() ? K.button('Tạo/cập nhật trang landing', async () => {
await _ow();
const prof = await B.profile(ctx);
const _ob = B.landingById(ctx, B.PREFIX.seo + _oi.id);
await B.saveLanding(ctx, B.seoLanding(m, { project: _oi, prof, existing: _ob }));
K.toast(_ob ? 'Đã áp tiêu đề/mô tả vào trang landing' : 'Đã tạo trang trong Trình tạo landing – mở Trình tạo landing để sửa ảnh và xuất bản', 'success');
}, { testid: 'seo-to-landing' }) : null),
G.endpoint() ? null : G.note('Trang tải về có form để lại số. Form gửi về máy chủ Google của anh/chị khi app đã nối máy chủ (chế độ Xem thử chưa nhận khách thật).'),
] }));
_o4.appendChild(K.card({ title: 'Bảng kiểm SEO', testid: 'seo-check-card', body: _o8 }));
_o4.appendChild(K.card({ title: 'Dữ liệu có cấu trúc (schema.org JSON-LD)', body: [h('p', { class: 'g3-sub' }, 'Đã có sẵn trong trang tải về. Kiểm tra tại search.google.com/test/rich-results. Google chỉ hiện FAQ dạng mở rộng cho một số trang chính phủ/y tế – khối FAQ vẫn giúp Google hiểu nội dung.'), _of] }));
_op();
}
async function _or(_o4, _o5) {
if (!B.available()) { _o4.appendChild(K.empty('Cần Trình tạo landing (gói Tìm khách & Landing).')); return; }
const _ok = B.landingPages(ctx);
if (!_ok.length) { _o4.appendChild(K.empty('Chưa có trang nào trong Trình tạo landing. Tạo trang ở đó hoặc ở tab "Trang dự án".')); return; }
if (!_o11.E) { _o4.appendChild(K.empty('Chưa đọc được Bảng hàng.')); return; }
const server = G.endpoint();
for (const cfgL of _ok) {
let list = [], _oe = '';
try { _oe = B.renderHtml(_o11.E, cfgL, { server }); list = SEO.seoChecklist(SEO.auditHtml(B.injectSeo(_oe, cfgL, B.dataFor(_o11.E, cfgL))), { keyword: SEO.slugify(cfgL.s.hero.heading).replace(/-/g, ' ') }); } catch (e) { list = [{ id: 'err', label: 'Dựng trang', status: 'fail', detail: String(e && e.message || e), fix: '' }]; }
const score = SEO.checklistScore(list);
const _oa = h('details', null, h('summary', { style: 'min-height:44px;cursor:pointer' }, 'Xem bảng kiểm'), checklistView(G, list, 'lp-check-' + cfgL.id));
const _oi = _o11.E.project(cfgL.project_id);
_o4.appendChild(h('div', { class: 'g3-item', 'data-testid': 'lp-seo-' + cfgL.id },
h('div', { class: 'g3-row' }, h('strong', null, cfgL.name || cfgL.slug), K.badge(score + '/100', score >= 80 ? 'success' : score >= 60 ? 'warn' : 'danger')),
h('span', { class: 'g3-sub' }, (B.pageUrl(cfgL, server) || 'Chưa có tên miền/chưa xuất bản') + ' · mẫu ' + cfgL.template),
h('div', { class: 'g3-row' },
G.isOwner && _oi ? K.button('Áp tiêu đề/mô tả gợi ý', async () => {
const m = SEO.projectSeo(_oi, { brand: _o5.brand, base: B.pageUrl(cfgL, '') || (_o5.base ? SEO.joinUrl(_o5.base, cfgL.slug) : ''), month: _oh() });
await B.saveLanding(ctx, B.applySeo(cfgL, m)); K.toast('Đã áp vào trang', 'success'); _oq();
}, { testid: 'lp-apply-' + cfgL.id }) : null,
K.button('Tải trang kèm JSON-LD', () => G.download((cfgL.slug || 'trang') + '.html', B.injectSeo(_oe, cfgL, B.dataFor(_o11.E, cfgL)), 'text/html;charset=utf-8'), { testid: 'lp-dl-' + cfgL.id })),
_oa));
}
}
async function _ot(_o4, _o5) {
const _ox = (await G.objs('g3_seo')).filter(o => o.id !== CFG_ID).map(G.view);
const _o15 = [];
if (_o5.base) _o15.push({ loc: SEO.joinUrl(_o5.base, ''), lastmod: Date.now(), src: 'Trang chủ' });
for (const s of _ox) if (_o5.base && s.d.m && s.d.m.slug) _o15.push({ loc: SEO.joinUrl(_o5.base, s.d.m.slug), lastmod: s.updated_at, src: 'Trang SEO: ' + s.name });
if (B.available()) for (const cfgL of B.landingPages(ctx)) { const _o13 = B.pageUrl(cfgL, ''); if (_o13 && /^https?:\/\//.test(_o13)) _o15.push({ loc: _o13, lastmod: cfgL.updated_at, src: 'Trình tạo landing: ' + (cfgL.name || cfgL.slug) }); }
const _om = await G.objs('g3_profile');
if (_o5.base && _om.length) _o15.push({ loc: SEO.joinUrl(_o5.base, 'ho-so'), lastmod: _om[0].updated_at, src: 'Hồ sơ năng lực' });
const xml = SEO.sitemapXml(_o15);
_o4.appendChild(K.card({ title: 'sitemap.xml (' + _o15.length + ' trang)', testid: 'seo-sitemap', body: [
_o5.base ? null : G.note('Nhập tên miền ở trên để có link đầy đủ.'),
_o15.length ? h('ul', null, _o15.map(_o13 => h('li', { class: 'g3-code' }, _o13.loc, h('span', { class: 'g3-sub' }, ' – ' + _o13.src)))) : K.empty('Chưa có trang nào có tên miền.'),
h('div', { class: 'g3-row' },
K.button('Tải sitemap.xml', () => G.download('sitemap.xml', xml, 'application/xml;charset=utf-8'), { kind: 'primary', testid: 'seo-dl-sitemap' }),
K.button('Tải robots.txt', () => G.download('robots.txt', SEO.robotsTxt(_o5.base)), { testid: 'seo-dl-robots' })),
h('pre', { class: 'g3-pre', 'data-testid': 'seo-sitemap-xml' }, xml),
h('ol', { class: 'g3-sub' }, h('li', null, 'Đặt sitemap.xml và robots.txt ở thư mục gốc tên miền (cùng chỗ trang chủ).'),
h('li', null, 'Mở Google Search Console (search.google.com/search-console) → thêm tên miền → xác minh.'),
h('li', null, 'Mục "Sơ đồ trang web" → nhập sitemap.xml → Gửi. Google thường mất vài ngày tới vài tuần để lập chỉ mục.'),
h('li', null, 'Dán từng link trang vào ô "Kiểm tra URL" ở trên cùng Search Console để xem đã lên Google chưa – chưa thì bấm "Yêu cầu lập chỉ mục".')),
] }));
}
await _oq();
}
export default {
manifest: { id: 'g3_seo', title: 'Đưa trang của bạn lên Google (SEO)', icon: '🔎', screen: 'customers', order: 51, version: '0.1.0', status: 'ready',
help: 'Chỉ hỗ trợ đưa trang lên Google, không phải công cụ SEO: soạn trang dự án hoặc chuẩn hoá chính trang landing (tiêu đề, mô tả, câu hỏi thường gặp, JSON-LD), bảng kiểm SEO, tải sitemap.xml, hướng dẫn việc nên làm trước và sau khi đưa trang lên.' },
mount,
async selftest(ctx) {
const m = SEO.projectSeo({ id: 'x', name: 'Dự án Mẫu', loc: 'Quận 1, TP.HCM', price: [80, 100], types: [{ n: '2N' }] }, { base: 'https://vd.vn' });
const list = SEO.seoChecklist(SEO.auditHtml(projectPage(m, { agent: { name: 'A', phone: '0912345678' } })), { keyword: m.keyword });
if (!list.length || list.find(x => x.id === 'h1').status !== 'ok' || !/<urlset/.test(SEO.sitemapXml([{ loc: 'https://vd.vn/' }]))) return { ok: false, details: 'SEO tự kiểm sai' };
return selftestG3(ctx);
},
};

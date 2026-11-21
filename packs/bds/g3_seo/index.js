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
const _of = (strong, rest) => h('li', { style: 'margin:4px 0' }, strong ? h('strong', null, strong) : null, strong && rest ? ' ' : null, rest || null);
const _ox = (id, title, body, open) => h('details', { 'data-testid': 'seo-guide-' + id, open: open ? '' : null, style: 'border-top:1px solid rgba(127,127,127,.2);padding:4px 0' },
h('summary', { style: 'min-height:44px;cursor:pointer;display:flex;align-items:center;font-weight:600' }, title), h('div', { class: 'g3', style: 'padding:4px 0 8px' }, body));
const _o11 = (label, href, id) => K.linkBtn(label, href, null, { target: '_blank', testid: 'seo-tool-' + id });
return K.card({ title: 'Hướng dẫn: trước và sau khi đưa trang lên Google', testid: 'seo-guide', body: [
G.note('Mục này chỉ hỗ trợ ĐƯA TRANG LÊN Google (chuẩn bị trang đúng chuẩn, sitemap, các bước gửi Google). Đây không phải công cụ SEO: app không theo dõi thứ hạng, không phân tích đối thủ, không mua/đặt link ngoài.'),
_ox('which', '1. Nên đưa trang nào lên?', [
h('ul', { style: 'margin:0;padding-left:20px' },
_of('Chính trang landing đang chạy:', 'trang anh/chị đã làm ở Trình tạo landing – xem điểm ở tab "Chấm trang landing", bấm "Áp tiêu đề/mô tả gợi ý".'),
_of('Trang riêng từng dự án:', 'ở tab "Trang dự án" – mỗi dự án một trang, tải về .html hoặc tạo luôn trong Trình tạo landing. Hợp khi khách hay tìm đúng tên dự án.'),
_of('Gợi ý:', 'bắt đầu với trang landing đang có khách, rồi thêm trang riêng cho 2–3 dự án bán chạy nhất. Không cần làm cho mọi dự án.'),
_of('Tên miền nào cũng được:', '.com, .vn, .net… đều lên Google như nhau – không bắt buộc đuôi .vn. Trang viết tiếng Việt, nói về dự án ở Việt Nam là Google hiểu trang dành cho người Việt. Nên dùng tên miền riêng, dễ nhớ để khách tin hơn.')),
], true),
_ox('before', '2. TRƯỚC khi đưa trang lên', [
h('ul', { style: 'margin:0;padding-left:20px' },
_of('Chọn 2–3 dự án bán chạy', 'mà anh/chị nắm chắc thông tin – làm kỹ ít trang tốt hơn làm nhiều trang sơ sài.'),
_of('Viết nội dung riêng 300–500 chữ', 'cho mỗi trang: vị trí thực tế, tiện ích, pháp lý, tiến độ, chính sách, nhận xét của chính anh/chị. Không chép nguyên brochure hay trang chủ đầu tư – Google bỏ qua nội dung trùng.'),
_of('Chọn từ khoá ngách,', 'cụ thể, ít người làm: "căn 2 phòng ngủ [tên dự án] giá bán", "[tên dự án] bàn giao [quý/năm]" – thay vì từ chung chung như "căn hộ Hà Nội".'),
_of('Ảnh nhẹ:', 'mỗi ảnh nên dưới khoảng 300 KB (thu nhỏ trước khi đưa lên), có mô tả ảnh. Trang nặng mở chậm trên điện thoại, khách thoát.'),
_of('Điểm SEO từ 80/100 trở lên', 'ở "Bảng kiểm SEO" (tab Trang dự án) hoặc "Chấm trang landing" – sửa các mục ❌ trước.'),
_of('Có form để lại số điện thoại', '(trang tải từ app và trang Trình tạo landing đã có sẵn) – khách vào từ Google mới thành khách của anh/chị.')),
]),
_ox('after', '3. SAU khi đưa trang lên', [
h('ol', { style: 'margin:0;padding-left:20px' },
_of('Xác minh tên miền ở Google Search Console', '(miễn phí): thêm tên miền → làm theo cách xác minh Google đưa (thường là thêm bản ghi TXT ở nơi mua tên miền / Cloudflare).'),
_of('Gửi sitemap.xml:', 'tải ở tab "Sitemap & Google", đặt ở thư mục gốc tên miền, rồi vào Search Console → "Sơ đồ trang web" → nhập sitemap.xml → Gửi.'),
_of('Kiểm tra đã được lập chỉ mục chưa:', 'Search Console → dán link trang vào ô "Kiểm tra URL" (URL Inspection) ở trên cùng → nếu chưa có, bấm "Yêu cầu lập chỉ mục".'),
_of('Đo tốc độ', 'bằng PageSpeed Insights – xem điểm trên điện thoại; chậm thì giảm dung lượng ảnh.'),
_of('Kiểm tra dữ liệu có cấu trúc', 'bằng công cụ Kiểm tra kết quả nhiều định dạng (Rich Results Test).'),
_of('Mỗi tháng xem lại một lần:', 'Search Console → "Hiệu suất": khách tìm từ khoá gì, bao nhiêu lượt hiện, bao nhiêu lượt bấm. Từ khoá có lượt hiện mà ít bấm → sửa tiêu đề/mô tả cho hấp dẫn hơn.'),
_of('Cập nhật giá, chính sách, tiến độ định kỳ', '(ít nhất mỗi tháng) và ghi ngày cập nhật – trang mới, đúng giúp giữ vị trí và khách tin hơn.')),
h('div', { class: 'g3-row' }, _o11('Google Search Console', _o2.gsc, 'gsc'), _o11('PageSpeed Insights', _o2.psi, 'psi'), _o11('Rich Results Test', _o2.rich, 'rich')),
]),
_ox('expect', '4. Nói trước để khỏi kỳ vọng sai', [
h('ul', { style: 'margin:0;padding-left:20px' },
_of('', 'Google thường mất vài tuần tới vài tháng mới đưa trang mới lên và ổn định vị trí – không lên ngay sau khi gửi.'),
_of('', 'Không ai hứa chắc được lên top Google – kể cả dịch vụ trả tiền. Cẩn thận với lời hứa "top 1 trong 7 ngày".'),
_of('', 'Muốn có khách ngay trong lúc chờ: dùng thêm quảng cáo (mục Hỗ trợ quảng cáo) và đăng nhóm cộng đồng.')),
]),
] });
}
function _og() { const d = new Date(Date.now() + 7 * 3600e3); return String(d.getUTCMonth() + 1).padStart(2, '0') + '/' + d.getUTCFullYear(); }
function _oc(faq) { return (faq || []).map(_ob => _ob.q + ' | ' + _ob.a).join('\n'); }
function _ok(t) { return String(t || '').split(/\r?\n/).map(l => l.split('|')).filter(x => x.length >= 2 && x[0].trim() && x.slice(1).join('|').trim()).map(x => ({ q: x[0].trim(), a: x.slice(1).join('|').trim() })).slice(0, 10); }
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
const _ot = h('div', { class: 'g3', 'data-testid': 'g3-seo' });
el.appendChild(_ot);
const _o10 = { tab: 'project', pid: '', m: null, body: '', E: null };
try { _o10.E = await B.env(ctx); } catch { _o10.E = null; }
const projects = () => (_o10.E ? _o10.E.projects : K.projects());
const _o6 = async () => (await G.objs('g3_seo')).find(o => o.id === CFG_ID) || null;
const _o5 = async () => { const _om = await _o6(); return _om ? G.view(_om).d : { base: '', brand: '' }; };
async function _op() {
const _o4 = await _o5();
_ot.innerHTML = '';
_ot.appendChild(G.head('Đưa trang của bạn lên Google (SEO)', 'Chỉ hỗ trợ đưa trang lên Google: chuẩn bị trang dự án hoặc chính trang landing đúng chuẩn, tạo sitemap, hướng dẫn gửi Google. Không phải công cụ SEO (không theo dõi thứ hạng, không phân tích đối thủ). Anh/chị tự viết nội dung riêng – app lo phần kỹ thuật.'));
_ot.appendChild(seoGuide(G));
const base = G.input({ value: _o4.base || '', placeholder: 'https://tenmien-cua-anh.com', 'data-testid': 'seo-base', inputmode: 'url' });
const brand = G.input({ value: _o4.brand || '', placeholder: 'Tên thương hiệu / tên anh chị', 'data-testid': 'seo-brand' });
_ot.appendChild(K.card({ title: 'Tên miền trang', testid: 'seo-config', body: [h('div', { class: 'g3-two' }, G.field('Tên miền (https://…)', base, 'Đuôi nào cũng được (.com, .vn, .net…). Dùng cho link chính thức (canonical), sitemap.xml.'), G.field('Thương hiệu', brand)),
G.isStaff ? h('div', { class: 'g3-row' }, K.button('Lưu', async () => {
const _o3 = base.value.trim();
if (_o3 && !/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(_o3)) return K.toast('Tên miền phải bắt đầu bằng https://', 'warn');
const _oa = await _o6();
await G.save('g3_seo', { ...(_oa || {}), id: CFG_ID, name: 'Cài đặt SEO', status: 'config' }, { base: _o3.replace(/\/+$/, ''), brand: brand.value.trim() });
K.toast('Đã lưu', 'success'); _op();
}, { kind: 'primary', testid: 'seo-config-save' })) : h('p', { class: 'g3-sub', 'data-testid': 'seo-config-ro' }, 'Chủ hoặc Quản lý đổi tên miền.')] }));
if (!G.isStaff) { base.disabled = true; brand.disabled = true; }
_ot.appendChild(G.tabs([['project', 'Trang dự án'], ['landing', 'Chấm trang landing'], ['sitemap', 'Sitemap & Google']], _o10.tab, k => { _o10.tab = k; _op(); }, 'seo-tab'));
const box = h('div', { class: 'g3' });
_ot.appendChild(box);
if (_o10.tab === 'project') await _or(box, _o4);
else if (_o10.tab === 'landing') await _oq(box, _o4);
else await _os(box, _o4);
}
async function _or(box, _o4) {
const _ow = (await G.objs('g3_seo')).filter(o => o.id !== CFG_ID);
const _oy = K.select([['', '– Chọn dự án –'], ...projects().map(_oh => [_oh.id, _oh.name + (_ow.some(s => s.project === _oh.id) ? ' ✓' : '')])], _o10.pid, { 'data-testid': 'seo-project' });
_oy.onchange = () => { _o10.pid = _oy.value; _o10.m = null; _op(); };
box.appendChild(G.field('Dự án', _oy));
if (!_o10.pid) { box.appendChild(K.empty('Chọn dự án để soạn trang. Dự án đã có trang SEO có dấu ✓.')); return; }
const _oh = projects().find(x => x.id === _o10.pid);
const _ou = _ow.find(s => s.project === _o10.pid);
if (!_o10.m) {
const auto = SEO.projectSeo(_oh, { brand: _o4.brand, base: _o4.base, month: _og() });
_o10.m = _ou ? { ...auto, ...G.view(_ou).d.m, canonical: _o4.base ? SEO.joinUrl(_o4.base, (G.view(_ou).d.m || {}).slug || auto.slug) : '' } : auto;
_o10.body = _ou ? G.view(_ou).d.body || '' : '';
}
const m = _o10.m;
const agent = await G.agent();
const title = G.input({ value: m.title, maxlength: 90, 'data-testid': 'seo-title' });
const desc = G.area({ maxlength: 220, 'data-testid': 'seo-desc', rows: 3 }); desc.value = m.description;
const slug = G.input({ value: m.slug, maxlength: 60, 'data-testid': 'seo-slug' });
const kw = G.input({ value: m.keyword, 'data-testid': 'seo-keyword' });
const faq = G.area({ rows: 4, 'data-testid': 'seo-faq' }); faq.value = _oc(m.faq);
const faqHint = h('small', { class: 'g3-sub', 'data-testid': 'seo-faq-hint' });
const _o13 = () => { const n = faq.value.split(/\r?\n/).filter(l => l.trim()).length, ok = _ok(faq.value).length; faqHint.textContent = n ? `${ok}/${n} dòng đúng dạng "Câu hỏi | Trả lời"` + (ok < n ? ' – dòng thiếu dấu | sẽ bị bỏ' : '') : ''; faqHint.className = ok < n ? 'g3-warn' : 'g3-sub'; };
faq.addEventListener('input', _o13); _o13();
const body = G.area({ rows: 8, 'data-testid': 'seo-body', placeholder: 'Viết nội dung riêng: vị trí thực tế, tiện ích, pháp lý, chính sách, nhận xét của anh/chị… (mỗi đoạn một dòng)' }); body.value = _o10.body;
const _o8 = (inp, a, _o3) => { const s = h('small', { class: 'g3-sub' }); const _ob = () => { const n = inp.value.length; s.textContent = n + ' ký tự (nên ' + a + '–' + _o3 + ')'; s.className = n >= a && n <= _o3 ? 'g3-ok' : 'g3-warn'; }; inp.addEventListener('input', _ob); _ob(); return s; };
const _o7 = h('div');
const _oe = h('pre', { class: 'g3-pre', 'data-testid': 'seo-ld' });
const _on = () => {
const _oz = SEO.slugify(slug.value) || m.slug;
Object.assign(m, { title: title.value.trim(), description: desc.value.trim(), slug: _oz, keyword: kw.value.trim(), faq: _ok(faq.value), canonical: _o4.base ? SEO.joinUrl(_o4.base, _oz) : '' });
_o10.body = body.value;
return m;
};
const facts = () => [_oh.dev && 'Chủ đầu tư: ' + _oh.dev, _oh.loc && 'Vị trí: ' + _oh.loc, (_oh.types || []).length && 'Loại căn: ' + _oh.types.map(t => t.n).join(', '), _oh.handover && 'Bàn giao dự kiến: ' + String(_oh.handover).split('-').reverse().join('/')].filter(Boolean);
const _od = () => projectPage(_on(), { agent, base: _o4.base, endpoint: G.endpoint(), facts: facts(), body: _o10.body });
const _oo = () => {
const _oi = SEO.auditHtml(_od());
const list = SEO.seoChecklist(_oi, { keyword: m.keyword, inSitemap: !!_ou, disclaimer: true });
_o7.innerHTML = '';
_o7.appendChild(checklistView(G, list, 'seo-check'));
_oe.textContent = SEO.jsonLdScripts([SEO.projectLd(m, agent), SEO.faqLd(m.faq)]);
};
[title, desc, slug, kw, faq, body].forEach(i => i.addEventListener('input', _oo));
const _ov = async () => {
_on();
const _oa = (await G.objs('g3_seo')).find(s => s.project === _o10.pid);
await G.save('g3_seo', { ...(_oa || {}), name: _oh.name, project: _oh.id, status: 'ready' }, { m: { title: m.title, description: m.description, slug: m.slug, keyword: m.keyword, faq: m.faq }, body: _o10.body, saved_at: Date.now() });
};
box.appendChild(K.card({ title: 'Nội dung SEO – ' + _oh.name, testid: 'seo-editor', body: [
G.field('Tiêu đề trang (hiện trên Google)', title), _o8(title, SEO.LIMITS.titleMin, SEO.LIMITS.titleMax),
G.field('Mô tả (dòng dưới tiêu đề trên Google)', desc), _o8(desc, SEO.LIMITS.descMin, SEO.LIMITS.descMax),
h('div', { class: 'g3-two' }, G.field('Đường dẫn (không dấu)', slug), G.field('Từ khoá chính', kw)),
G.field('Câu hỏi thường gặp (mỗi dòng: Câu hỏi | Trả lời)', faq, 'Giá ghi "tham khảo", nói rõ nguồn: phiếu tính giá của chủ đầu tư.'), faqHint,
G.field('Nội dung riêng của anh/chị', body, 'Google ưu tiên nội dung tự viết, hữu ích; không chép nguyên văn từ trang chủ đầu tư.'),
h('div', { class: 'g3-row' },
K.button('Lưu', async () => { await _ov(); K.toast('Đã lưu trang SEO', 'success'); _op(); }, { kind: 'primary', testid: 'seo-save' }),
K.button('Tải trang .html', async () => { await _ov(); G.download(m.slug + '.html', _od(), 'text/html;charset=utf-8'); }, { testid: 'seo-download' }),
K.button('Chép JSON-LD', () => G.copy(_oe.textContent, 'Đã chép khối JSON-LD'), { testid: 'seo-copy-ld' }),
G.isOwner && B.available() ? K.button('Tạo/cập nhật trang landing', async () => {
await _ov();
const prof = await B.profile(ctx);
const _oa = B.landingById(ctx, B.PREFIX.seo + _oh.id);
await B.saveLanding(ctx, B.seoLanding(m, { project: _oh, prof, existing: _oa }));
K.toast(_oa ? 'Đã áp tiêu đề/mô tả vào trang landing' : 'Đã tạo trang trong Trình tạo landing – mở Trình tạo landing để sửa ảnh và xuất bản', 'success');
}, { testid: 'seo-to-landing' }) : null),
G.endpoint() ? null : G.note('Trang tải về có form để lại số. Form gửi về máy chủ Google của anh/chị khi app đã nối máy chủ (chế độ Xem thử chưa nhận khách thật).'),
] }));
box.appendChild(K.card({ title: 'Bảng kiểm SEO', testid: 'seo-check-card', body: _o7 }));
box.appendChild(K.card({ title: 'Dữ liệu có cấu trúc (schema.org JSON-LD)', body: [h('p', { class: 'g3-sub' }, 'Đã có sẵn trong trang tải về. Kiểm tra tại search.google.com/test/rich-results. Google chỉ hiện FAQ dạng mở rộng cho một số trang chính phủ/y tế – khối FAQ vẫn giúp Google hiểu nội dung.'), _oe] }));
_oo();
}
async function _oq(box, _o4) {
if (!B.available()) { box.appendChild(K.empty('Cần Trình tạo landing (Gói 1 · Tìm khách online).')); return; }
const _oj = B.landingPages(ctx);
if (!_oj.length) { box.appendChild(K.empty('Chưa có trang nào trong Trình tạo landing. Tạo trang ở đó hoặc ở tab "Trang dự án".')); return; }
if (!_o10.E) { box.appendChild(K.empty('Chưa đọc được Thông tin dự án.')); return; }
const server = G.endpoint();
for (const cfgL of _oj) {
let list = [], _od = '';
try { _od = B.renderHtml(_o10.E, cfgL, { server }); list = SEO.seoChecklist(SEO.auditHtml(B.injectSeo(_od, cfgL, B.dataFor(_o10.E, cfgL))), { keyword: SEO.slugify(cfgL.s.hero.heading).replace(/-/g, ' ') }); } catch (e) { list = [{ id: 'err', label: 'Dựng trang', status: 'fail', detail: String(e && e.message || e), fix: '' }]; }
const score = SEO.checklistScore(list);
const _o9 = h('details', null, h('summary', { style: 'min-height:44px;cursor:pointer' }, 'Xem bảng kiểm'), checklistView(G, list, 'lp-check-' + cfgL.id));
const _oh = _o10.E.project(cfgL.project_id);
box.appendChild(h('div', { class: 'g3-item', 'data-testid': 'lp-seo-' + cfgL.id },
h('div', { class: 'g3-row' }, h('strong', null, cfgL.name || cfgL.slug), K.badge(score + '/100', score >= 80 ? 'success' : score >= 60 ? 'warn' : 'danger')),
h('span', { class: 'g3-sub' }, (B.pageUrl(cfgL, server) || 'Chưa có tên miền/chưa xuất bản') + ' · mẫu ' + cfgL.template),
h('div', { class: 'g3-row' },
G.isOwner && _oh ? K.button('Áp tiêu đề/mô tả gợi ý', async () => {
const m = SEO.projectSeo(_oh, { brand: _o4.brand, base: B.pageUrl(cfgL, '') || (_o4.base ? SEO.joinUrl(_o4.base, cfgL.slug) : ''), month: _og() });
await B.saveLanding(ctx, B.applySeo(cfgL, m)); K.toast('Đã áp vào trang', 'success'); _op();
}, { testid: 'lp-apply-' + cfgL.id }) : null,
K.button('Tải trang kèm JSON-LD', () => G.download((cfgL.slug || 'trang') + '.html', B.injectSeo(_od, cfgL, B.dataFor(_o10.E, cfgL)), 'text/html;charset=utf-8'), { testid: 'lp-dl-' + cfgL.id })),
_o9));
}
}
async function _os(box, _o4) {
const _ow = (await G.objs('g3_seo')).filter(o => o.id !== CFG_ID).map(G.view);
const _o14 = [];
if (_o4.base) _o14.push({ loc: SEO.joinUrl(_o4.base, ''), lastmod: Date.now(), src: 'Trang chủ' });
for (const s of _ow) if (_o4.base && s.d.m && s.d.m.slug) _o14.push({ loc: SEO.joinUrl(_o4.base, s.d.m.slug), lastmod: s.updated_at, src: 'Trang SEO: ' + s.name });
if (B.available()) for (const cfgL of B.landingPages(ctx)) { const _o12 = B.pageUrl(cfgL, ''); if (_o12 && /^https?:\/\//.test(_o12)) _o14.push({ loc: _o12, lastmod: cfgL.updated_at, src: 'Trình tạo landing: ' + (cfgL.name || cfgL.slug) }); }
const _ol = await G.objs('g3_profile');
if (_o4.base && _ol.length) _o14.push({ loc: SEO.joinUrl(_o4.base, 'ho-so'), lastmod: _ol[0].updated_at, src: 'Hồ sơ năng lực' });
const xml = SEO.sitemapXml(_o14);
box.appendChild(K.card({ title: 'sitemap.xml (' + _o14.length + ' trang)', testid: 'seo-sitemap', body: [
_o4.base ? null : G.note('Nhập tên miền ở trên để có link đầy đủ.'),
_o14.length ? h('ul', null, _o14.map(_o12 => h('li', { class: 'g3-code' }, _o12.loc, h('span', { class: 'g3-sub' }, ' – ' + _o12.src)))) : K.empty('Chưa có trang nào có tên miền.'),
h('div', { class: 'g3-row' },
K.button('Tải sitemap.xml', () => G.download('sitemap.xml', xml, 'application/xml;charset=utf-8'), { kind: 'primary', testid: 'seo-dl-sitemap' }),
K.button('Tải robots.txt', () => G.download('robots.txt', SEO.robotsTxt(_o4.base)), { testid: 'seo-dl-robots' })),
h('pre', { class: 'g3-pre', 'data-testid': 'seo-sitemap-xml' }, xml),
h('ol', { class: 'g3-sub' }, h('li', null, 'Đặt sitemap.xml và robots.txt ở thư mục gốc tên miền (cùng chỗ trang chủ).'),
h('li', null, 'Mở Google Search Console (search.google.com/search-console) → thêm tên miền → xác minh.'),
h('li', null, 'Mục "Sơ đồ trang web" → nhập sitemap.xml → Gửi. Google thường mất vài ngày tới vài tuần để lập chỉ mục.'),
h('li', null, 'Dán từng link trang vào ô "Kiểm tra URL" ở trên cùng Search Console để xem đã lên Google chưa – chưa thì bấm "Yêu cầu lập chỉ mục".')),
] }));
}
await _op();
}
export default {
manifest: { id: 'g3_seo', title: 'Đưa trang của bạn lên Google (SEO)', icon: '🔎', screen: 'customers', order: 51, version: '0.1.0', status: 'ready',
help: 'Chỉ hỗ trợ đưa trang lên Google, không phải công cụ SEO: soạn trang dự án hoặc chuẩn hoá chính trang landing (tiêu đề, mô tả, câu hỏi thường gặp, JSON-LD), bảng kiểm SEO, tải sitemap.xml, hướng dẫn việc nên làm trước và sau khi đưa trang lên.' },
mount,
async selftest(ctx) {
const m = SEO.projectSeo({ id: 'x', name: 'Dự án Thử', loc: 'Quận 1, TP.HCM', price: [80, 100], types: [{ n: '2N' }] }, { base: 'https://vd.vn' });
const list = SEO.seoChecklist(SEO.auditHtml(projectPage(m, { agent: { name: 'A', phone: '0912345678' } })), { keyword: m.keyword });
if (!list.length || list.find(x => x.id === 'h1').status !== 'ok' || !/<urlset/.test(SEO.sitemapXml([{ loc: 'https://vd.vn/' }]))) return { ok: false, details: 'SEO tự kiểm sai' };
return selftestG3(ctx);
},
};

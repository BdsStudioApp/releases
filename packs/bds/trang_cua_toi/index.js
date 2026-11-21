import { kit, h } from '../_lib/kit.js';
import * as SL from '../../../shared/site_logic.js';
const _o2 = 320;
const _o0 = `
.tct{display:flex;flex-direction:column;gap:14px;min-width:0}
.tct h2{margin:0;font-size:1.2rem}.tct h3{margin:0 0 6px;font-size:1.02rem}
.tct-muted{color:rgba(127,127,127,.95);font-size:.88rem}
.tct-card{border:1px solid rgba(127,127,127,.25);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:10px;min-width:0}
.tct-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.tct-f{display:flex;flex-direction:column;gap:4px;font-size:.9rem;min-width:0}
.tct-f input,.tct-f textarea{min-height:44px;padding:8px 10px;border-radius:10px;border:1px solid rgba(127,127,127,.3);background:transparent;color:inherit;font:inherit;width:100%;box-sizing:border-box;min-width:0}
.tct-f input[type=color]{padding:2px;width:64px}
.tct-f textarea{min-height:90px}
.tct-two{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (max-width:600px){.tct-two{grid-template-columns:1fr}}
.tct-err{color:#b91c1c;font-size:.85rem}
.tct-ok{color:#15803d}
.tct-photo{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.tct-photo img{width:72px;height:72px;border-radius:50%;object-fit:cover;background:rgba(127,127,127,.15)}
.tct-pj{display:flex;flex-direction:column;gap:6px}
.tct-pj label{display:flex;gap:10px;align-items:center;min-height:40px;cursor:pointer}
.tct-pj input{width:22px;height:22px}
.tct-phone{border:8px solid #111;border-radius:28px;overflow:hidden;background:#fff;width:380px;max-width:100%;height:680px;max-height:75vh}
.tct-phone iframe{border:0;width:100%;height:100%;display:block}
.tct-url{font-family:ui-monospace,Menlo,monospace;word-break:break-all}
.tct-list{display:flex;flex-direction:column;gap:8px}
.tct-item{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(127,127,127,.18);padding:6px 0}
.tct-pill{display:inline-block;font-size:.75rem;border-radius:999px;padding:2px 8px;background:rgba(127,127,127,.15)}
.tct-pill.on{background:#dcfce7;color:#14532d}.tct-pill.off{background:#fee2e2;color:#7f1d1d}
`;
function ensureCss() {
if (typeof document === 'undefined' || document.getElementById('bds-tct-css')) return;
const _ok = document.createElement('meta'); _ok.id = 'bds-tct-css'; document.head.appendChild(_ok);
try { const _o11 = new CSSStyleSheet(); _o11.replaceSync(_o0); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _o11]; } catch { }
}
export async function shrinkPhoto(file, { px = _o2, max = SL.SITE_LIMITS.photoChars } = {}) {
const url = URL.createObjectURL(file);
try {
const _og = await new Promise((res, rej) => { const _of = new Image(); _of.onload = () => res(_of); _of.onerror = () => rej(new Error('Không đọc được ảnh')); _of.src = url; });
const s = Math.min(_og.naturalWidth, _og.naturalHeight);
const c = document.createElement('canvas'); c.width = c.height = Math.min(px, s);
c.getContext('2d').drawImage(_og, (_og.naturalWidth - s) / 2, (_og.naturalHeight - s) / 2, s, s, 0, 0, c.width, c.height);
for (const _ov of [0.85, 0.75, 0.65, 0.55, 0.45]) { const d = c.toDataURL('image/jpeg', _ov); if (d.length <= max) return d; }
throw new Error('Ảnh quá chi tiết – chọn ảnh khác.');
} finally { URL.revokeObjectURL(url); }
}
export async function mount(el, ctx) {
ensureCss();
const _o1 = kit(ctx);
const ui = ctx.ui;
const _o5 = (label, fn, o = {}) => ui.button(label, fn, o);
const _ol = ctx.user || {};
const _o13 = _ol.role === 'owner' || _ol.role === 'manager';
el.replaceChildren();
const _oy = h('div', { class: 'tct', 'data-testid': 'my-site' });
el.appendChild(_oy);
let info = null, projects = [], form = null;
async function _oj() {
_oy.replaceChildren(h('p', { class: 'tct-muted' }, 'Đang tải…'));
try { info = await ctx.api.call('site.my_get'); } catch (e) { _oy.replaceChildren(ui.empty((e && (e.userMessage || e.message)) || 'Chưa tải được.')); return; }
projects = (await _o1.list('projects')).filter((p) => p && p.id && p.name).map((p) => {
let d = {}; try { d = typeof p.data === 'string' ? JSON.parse(p.data || '{}') : (p.data || {}); } catch { d = {}; }
return { id: p.id, name: p.name, dev: p.dev, hidden: !!(d.hidden || d.internal || d.private), ...d };
}).filter((p) => !p.hidden);
_ox();
}
function _ox() {
_oy.replaceChildren();
_oy.appendChild(h('div', null, h('h2', null, 'Trang của tôi'),
h('p', { class: 'tct-muted' }, 'Trang riêng giới thiệu anh/chị và dự án đang bán. Khách để lại số ở đây vào thẳng danh sách khách của anh/chị – người khác trong công ty không thấy.')));
if (!info.allowed) { _oy.appendChild(ui.empty('Quản trị chưa cấp quyền "Landing / phễu khách" cho tài khoản này.', 'lock')); if (_o13) _oy.appendChild(_o4()); return; }
if (info.disabled) _oy.appendChild(h('p', { class: 'wiz-warn', 'data-testid': 'site-disabled' }, '⚠️ Quản trị đã tạm tắt trang riêng của anh/chị – trang không hiện với khách. Liên hệ Quản trị để bật lại.'));
if (!info.domain) _oy.appendChild(_on());
_oy.appendChild(_o3());
if (info.slug_ok) { _oy.appendChild(_ob()); _oy.appendChild(_op()); }
if (info.intake_url) _oy.appendChild(h('details', { class: 'tct-card', 'data-testid': 'site-intake' }, h('summary', null, 'Nối form ở trang khác vào danh sách của tôi (nâng cao)'),
h('p', { class: 'tct-muted' }, 'Địa chỉ nhận khách RIÊNG của anh/chị (dán vào form của trình dựng landing khác, Google Forms, Zapier…). Khách gửi qua đây cũng vào danh sách của anh/chị.'),
h('div', { class: 'tct-row' }, h('code', { class: 'tct-url' }, info.intake_url), _o5('Chép', () => ui.copy(info.intake_url), { kind: 'ghost', small: true, icon: 'copy', testid: 'site-intake-copy' }))));
if (_o13) _oy.appendChild(_o4());
}
function _on() {
const _oq = _ol.role === 'owner';
const _o18 = typeof window !== 'undefined' && window.__bds && window.__bds.wizard;
const go = () => { if (_o18 && typeof _o18.open === 'function') _o18.open({ step: 'domain' }); else _o1.nav('settings/wizard'); };
return h('div', { class: 'wiz-note tct-card', 'data-testid': 'site-no-domain' },
h('p', null, h('strong', null, '⚠️ Cần xong bước Tên miền công ty'), ' – trang riêng của nhân viên chạy ở <địa chỉ riêng>.<tên miền công ty>, nên chưa mở được với khách.'),
h('p', { class: 'tct-muted' }, _oq ? 'Anh/chị vẫn soạn và lưu nháp được; xong bước này là bấm Xuất bản được.' : 'Báo Quản trị làm bước này. Anh/chị vẫn soạn và lưu nháp được; xong bước này là bấm Xuất bản được.'),
_oq ? h('div', { class: 'tct-row' }, _o5('Làm bước Tên miền công ty', go, { kind: 'primary', small: true, icon: 'link', testid: 'site-go-domain' })) : null);
}
function _o3() {
const card = h('section', { class: 'tct-card', 'data-testid': 'site-addr' }, h('h3', null, 'Địa chỉ trang'));
if (info.slug_ok) {
const url = info.url || ('https://' + info.slug + '.' + (info.domain || '<tên miền công ty>'));
card.append(h('div', { class: 'tct-row' }, h('span', { class: 'tct-url', 'data-testid': 'site-url' }, url),
info.published ? h('span', { class: 'tct-pill on', 'data-testid': 'site-state' }, 'Đã xuất bản') : h('span', { class: 'tct-pill', 'data-testid': 'site-state' }, 'Chưa xuất bản')),
h('div', { class: 'tct-row' },
_o5('Chép link', () => ui.copy(url), { kind: 'secondary', small: true, icon: 'copy', testid: 'site-copy' }),
info.url && info.published ? h('a', { class: 'btn btn-ghost btn-sm', href: info.url, target: '_blank', rel: 'noopener', 'data-testid': 'site-open' }, ui.icon('external', 18), h('span', null, 'Mở trang')) : null),
h('p', { class: 'tct-muted' }, 'Đổi địa chỉ: nhờ Quản trị (Cài đặt › Nhân sự).'));
return card;
}
const status = h('p', { class: 'tct-muted', 'aria-live': 'polite', 'data-testid': 'site-slug-status' });
const _oi = h('input', { type: 'text', inputmode: 'url', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', maxlength: '40', 'data-testid': 'site-slug', placeholder: 'vd lan' });
const _o10 = _o5('Lưu địa chỉ', async () => {
const _o16 = SL.normalizeMemberSlug(_oi.value).replace(/-+$/, '');
const _ot = SL.memberSlugProblem(_o16);
if (!_ot.ok) { status.textContent = '❌ ' + _ot.msg; return; }
try { await ctx.api.call('site.my_slug', { slug: _o16 }); _o1.toast('Đã lưu địa chỉ riêng', 'success'); await _oj(); } catch (e) { status.textContent = '❌ ' + (e.userMessage || e.message); }
}, { kind: 'primary', small: true, icon: 'check', testid: 'site-slug-save' });
_oi.addEventListener('input', () => {
const _om = SL.normalizeMemberSlug(_oi.value); if (_om !== _oi.value) _oi.value = _om;
const _ot = SL.memberSlugProblem(_om.replace(/-+$/, ''));
status.textContent = _ot.ok ? '✅ ' + _om + '.' + (info.domain || '<tên miền công ty>') : _ot.code === 'EMPTY' ? '' : '❌ ' + _ot.msg;
});
const _o14 = SL.suggestMemberSlugs(_ol.full_name || _ol.username || '');
card.append(h('p', null, 'Chọn địa chỉ riêng (chỉ 1 lần): chữ thường không dấu, số, dấu "-".'),
h('label', { class: 'tct-f' }, 'Địa chỉ riêng', _oi), status,
_o14.length ? h('div', { class: 'tct-row' }, h('span', { class: 'tct-muted' }, 'Gợi ý:'), _o14.map((s) => _o5(s, () => { _oi.value = s; _oi.dispatchEvent(new Event('input')); }, { kind: 'ghost', small: true, icon: 'sparkle', testid: 'site-sugg-' + s }))) : null,
h('div', { class: 'tct-row' }, _o10));
return card;
}
function _ob() {
const cur = { ...(info.draft || {}) };
if (!cur.name) cur.name = info.defaults && info.defaults.name || _ol.full_name || '';
if (!cur.phone) cur.phone = info.defaults && info.defaults.phone || '';
cur.colors = { ...SL.DEFAULT_COLORS, ...(cur.colors || {}) };
cur.projects = Array.isArray(cur.projects) ? cur.projects.slice() : [];
const errBox = h('div', { class: 'tct-err', 'aria-live': 'polite', 'data-testid': 'site-errors' });
const _oh = (key, label, o = {}) => {
const _o15 = o.area ? 'textarea' : 'input';
const x = h(_o15, { 'data-testid': 'site-' + key, maxlength: String(SL.SITE_LIMITS[key] || 40), ...(o.attrs || {}) });
x.value = cur[key] || '';
x.addEventListener('input', () => { cur[key] = x.value; _o9(); });
return h('label', { class: 'tct-f' }, label, x, o.hint ? h('small', { class: 'tct-muted' }, o.hint) : null);
};
const _o6 = (key, label) => {
const x = h('input', { type: 'color', 'data-testid': 'site-color-' + key, value: cur.colors[key] });
x.addEventListener('input', () => { cur.colors = { ...cur.colors, [key]: x.value }; _o9(); });
return h('label', { class: 'tct-f' }, label, x);
};
const photoImg = h('img', { alt: 'Ảnh chân dung', src: cur.photo || 'assets/icon.svg', 'data-testid': 'site-photo-preview' });
const _os = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', 'data-testid': 'site-photo-file' });
_os.addEventListener('change', async () => {
const _oc = _os.files && _os.files[0]; if (!_oc) return;
try { cur.photo = await shrinkPhoto(_oc); photoImg.src = cur.photo; _o9(); } catch (e) { _o1.toast(e.message || String(e), 'warn'); }
});
const pj = h('div', { class: 'tct-pj', 'data-testid': 'site-projects' }, projects.length ? projects.map((p) => {
const c = h('input', { type: 'checkbox', checked: cur.projects.includes(p.id), 'data-testid': 'site-pj-' + p.id });
c.addEventListener('change', () => {
if (c.checked && cur.projects.length >= SL.SITE_LIMITS.projects) { c.checked = false; _o1.toast('Chọn tối đa ' + SL.SITE_LIMITS.projects + ' dự án.', 'warn'); return; }
cur.projects = c.checked ? [...cur.projects, p.id] : cur.projects.filter((x) => x !== p.id); _o9();
});
return h('label', null, c, h('span', null, p.name + (p.loc || p.location ? ' · ' + (p.loc || p.location) : '')));
}) : h('p', { class: 'tct-muted' }, 'Chưa có dự án nào – thêm ở Thông tin dự án.'));
const _od = h('iframe', { title: 'Xem trước trang của tôi', 'data-testid': 'site-preview' });
const phone = h('div', { class: 'tct-phone', hidden: true }, _od);
let _ou = false, timer = 0;
function preview() {
const _or = SL.renderSitePage({ page: cur, company: _o7(), projects: projects.filter((p) => cur.projects.includes(p.id)), now: Date.now(), preview: true });
const _o8 = (/<style>([\s\S]*?)<\/style>/.exec(_or) || [])[1] || '';
_od.onload = () => { const _o17 = _od.contentWindow, d = _od.contentDocument; if (!_o17 || !d) return; try { const _o11 = new _o17.CSSStyleSheet(); _o11.replaceSync(_o8); d.adoptedStyleSheets = [_o11]; } catch { }
const _oc = d.querySelector('form'); if (_oc) _oc.addEventListener('submit', (e) => { e.preventDefault(); _o1.toast('Xem trước – form không gửi thật. Xuất bản rồi thử ở trang thật.', 'info'); });
_od.dataset.ready = String(Date.now()); };
_od.srcdoc = _or.replace(/<style>[\s\S]*?<\/style>/, '');
}
function _o9() { if (_ou) { clearTimeout(timer); timer = setTimeout(preview, 300); } errBox.textContent = ''; }
const _o12 = (errs) => { errBox.replaceChildren(...errs.map((e) => h('div', null, '❌ ' + e.msg))); };
const _oa = async (publish) => {
const _ow = SL.cleanSiteConfig(cur);
if (publish && !_ow.ok) { _o12(_ow.errors); _o1.toast('Sửa các ô đỏ rồi xuất bản lại.', 'warn'); return; }
try {
const _oo = await ctx.api.call('site.my_save', { page: cur, publish });
if (publish) { _o1.toast('Đã xuất bản – trang cập nhật trong khoảng 1 phút.', 'success'); info = { ...info, published: 1, pub_at: _oo.pub_at, draft: _ow.value }; }
else _o1.toast('Đã lưu nháp', 'success');
if (publish) _ox();
} catch (e) { _o12([{ msg: e.userMessage || e.message }]); }
};
form = h('section', { class: 'tct-card', 'data-testid': 'site-editor' }, h('h3', null, 'Nội dung trang'),
h('div', { class: 'tct-two' }, _oh('name', 'Tên hiển thị *'), _oh('title', 'Chức danh', { attrs: { placeholder: 'vd Chuyên viên tư vấn căn hộ' } })),
h('div', { class: 'tct-two' }, _oh('phone', 'Số điện thoại *', { attrs: { inputmode: 'tel', autocomplete: 'tel' } }), _oh('zalo', 'Số Zalo (trống = số điện thoại)', { attrs: { inputmode: 'tel' } })),
_oh('area', 'Khu vực tư vấn', { attrs: { placeholder: 'vd Thủ Đức, Quận 9' } }),
_oh('intro', 'Lời giới thiệu', { area: true, hint: 'Vài câu về anh/chị: kinh nghiệm, cam kết với khách. Tối đa ' + SL.SITE_LIMITS.intro + ' ký tự.' }),
_oh('cta', 'Tiêu đề phần để lại số', { attrs: { placeholder: 'Nhận tư vấn' } }),
h('div', { class: 'tct-photo' }, photoImg, h('label', { class: 'tct-f' }, 'Ảnh chân dung (app tự cắt vuông, thu nhỏ)', _os),
_o5('Bỏ ảnh', () => { cur.photo = ''; photoImg.src = 'assets/icon.svg'; _o9(); }, { kind: 'ghost', small: true, icon: 'x', testid: 'site-photo-remove' })),
h('div', { class: 'tct-row' }, _o6('primary', 'Màu chính'), _o6('accent', 'Màu nhấn')),
h('h3', null, 'Dự án tôi đang bán (tối đa ' + SL.SITE_LIMITS.projects + ', từ Thông tin dự án)'), pj,
errBox,
h('div', { class: 'tct-row' },
_o5('Xem trước', () => { _ou = !_ou; phone.hidden = !_ou; if (_ou) preview(); }, { kind: 'secondary', icon: 'layout', testid: 'site-preview-btn' }),
_o5('Lưu nháp', () => _oa(false), { kind: 'ghost', icon: 'disk', testid: 'site-save' }),
_o5('Xuất bản', () => _oa(true), { kind: 'primary', icon: 'check', testid: 'site-publish', disabled: !!info.disabled || !info.domain, title: info.domain ? '' : 'Cần xong bước Tên miền công ty' }),
!info.domain ? h('small', { class: 'bds-muted', 'data-testid': 'site-publish-why' }, 'Cần xong bước Tên miền công ty – vẫn lưu nháp được.') : null,
info.published ? _o5('Gỡ trang', async () => {
if (!(await ui.confirm('Gỡ trang? Khách mở link sẽ thấy "Không tìm thấy trang". Bản nháp vẫn giữ.'))) return;
await ctx.api.call('site.my_unpublish'); _o1.toast('Đã gỡ trang', 'success'); await _oj();
}, { kind: 'ghost', icon: 'x', testid: 'site-unpublish' }) : null),
h('p', { class: 'tct-muted' }, 'Trang chỉ hiện thông tin của anh/chị và dự án anh/chị chọn. Form có ô đồng ý theo Luật Bảo vệ dữ liệu cá nhân (Luật số 91/2025/QH15) và chống máy quét.'),
phone);
return form;
}
function _o7() { try { const c = ctx.settings && ctx.settings.get('company', null); return { name: (c && c.name) || '', logo: (c && c.logo) || '' }; } catch { return { name: '', logo: '' }; } }
function _op() {
const own = info.own;
const card = h('details', { class: 'tct-card', 'data-testid': 'site-own', open: !!own }, h('summary', null, 'Gán tên miền riêng (tuỳ chọn) – vd nguyenvanlan.com'));
const _oo = h('p', { class: 'tct-muted', 'aria-live': 'polite', 'data-testid': 'site-own-result' });
card.append(h('p', null, 'Chi phí: phía Cloudflare ', h('strong', null, '0 đ'), ' (tên miền được thêm làm "vùng" gói Free trong tài khoản Cloudflare của công ty). Anh/chị ', h('strong', null, 'tự trả tiền tên miền'),
' ở nơi mua (vd .com khoảng 10–15 USD/năm, .vn theo bảng giá nhà đăng ký Việt Nam). Không dùng gói trả phí nào khác.'));
if (!own) {
const x = h('input', { type: 'text', inputmode: 'url', autocomplete: 'off', placeholder: 'nguyenvanlan.com', 'data-testid': 'site-own-input' });
card.append(h('ol', null,
h('li', null, 'Chưa có tên miền: ', _o5('Mua tên miền', async () => {
if (!(await ui.confirm('Mua tên miền là việc CÓ PHÍ (anh/chị tự trả nhà đăng ký, vd .com khoảng 10–15 USD/năm). Mở trang mua tên miền?', { ok: 'Mở trang mua' }))) return;
window.open(String((ctx.config && ctx.config.AFFILIATE_DOMAIN_URL) || 'https://www.cloudflare.com/products/registrar/'), '_blank', 'noopener');
}, { kind: 'ghost', small: true, icon: 'external', testid: 'site-own-buy' })),
h('li', null, 'Gõ tên miền rồi bấm ', h('strong', null, 'Gửi Quản trị'), ': Quản trị thêm tên miền vào Cloudflare của công ty và gửi lại 2 nameserver.'),
h('li', null, 'Ở nơi mua tên miền, thay nameserver bằng 2 tên đó → chờ 5 phút–24 giờ → bấm ', h('strong', null, 'Kiểm tra'), '.')),
h('label', { class: 'tct-f' }, 'Tên miền riêng', x),
h('div', { class: 'tct-row' }, _o5('Gửi Quản trị', async () => {
try { await ctx.api.call('site.my_domain', { host: x.value }); _o1.toast('Đã gửi Quản trị', 'success'); await _oj(); } catch (e) { _oo.textContent = '❌ ' + (e.userMessage || e.message); }
}, { kind: 'primary', small: true, icon: 'mail', testid: 'site-own-send' })), _oo);
return card;
}
card.append(h('p', null, h('span', { class: 'tct-url' }, own.host), ' ', h('span', { class: 'tct-pill ' + (own.status === 'ok' ? 'on' : ''), 'data-testid': 'site-own-state' }, own.status === 'ok' ? 'Đang chạy' : 'Chờ nameserver / Quản trị')),
own.status !== 'ok' ? h('ol', null,
h('li', null, 'Quản trị: Cloudflare của công ty › Add a domain › ' + own.host + ' › gói Free; DNS: thêm AAAA ', h('code', null, '@'), ' và ', h('code', null, 'www'), ' → ', h('code', null, '100::'), ' (đám mây cam); Workers Routes: ', h('code', null, own.host + '/*'), ' và ', h('code', null, 'www.' + own.host + '/*'), ' → bds-trang.'),
h('li', null, 'Anh/chị: đổi nameserver ở nơi mua sang 2 tên Quản trị gửi.')) : null,
h('div', { class: 'tct-row' },
_o5('Kiểm tra', async () => {
ui.mountTo(_oo, ui.spinner(), ' Đang kiểm…');
try { const _ow = await ctx.api.call('site.my_domain_check'); _oo.textContent = (_ow.ok ? '✅ ' : '❌ ') + _ow.message; if (_ow.ok) setTimeout(_oj, 800); } catch (e) { _oo.textContent = '❌ ' + (e.userMessage || e.message); }
}, { kind: 'secondary', small: true, icon: 'pulse', testid: 'site-own-check' }),
_o5('Gỡ tên miền', async () => { await ctx.api.call('site.my_domain_remove'); await _oj(); }, { kind: 'ghost', small: true, icon: 'x', testid: 'site-own-remove' })), _oo);
return card;
}
function _o4() {
const card = h('section', { class: 'tct-card', 'data-testid': 'site-admin' }, h('h3', null, 'Trang của nhân viên'), h('p', { class: 'tct-muted' }, 'Đang tải…'));
(async () => {
let _ow;
try { _ow = await ctx.api.call('site.admin_list'); } catch (e) { card.lastChild.textContent = e.userMessage || e.message; return; }
const _oz = (_ow.members || []).filter((_ok) => _ok.status !== 'locked');
card.lastChild.remove();
card.append(h('div', { class: 'tct-list' }, _oz.map((_ok) => h('div', { class: 'tct-item', 'data-testid': 'site-admin-' + _ok.username },
h('div', null, h('strong', null, _ok.full_name || _ok.username), ' ', h('span', { class: 'tct-muted' }, _ok.url || (_ok.slug ? _ok.slug + '.<tên miền>' : 'chưa có địa chỉ')),
' ', h('span', { class: 'tct-pill ' + (_ok.disabled ? 'off' : _ok.published ? 'on' : '') }, _ok.disabled ? 'Đã tắt' : _ok.published ? 'Đang chạy' : 'Chưa xuất bản'),
!_ok.landing ? h('span', { class: 'tct-pill off' }, 'Không có quyền Landing') : null,
_ok.own ? h('span', { class: 'tct-pill' }, _ok.own.host + (_ok.own.status === 'ok' ? '' : ' (chờ)')) : null),
_ol.role === 'owner' && _ok.role !== 'owner' ? _o5(_ok.disabled ? 'Bật lại' : 'Tắt trang', async () => {
await ctx.api.call('site.admin_set', { user_id: _ok.user_id, disabled: !_ok.disabled }); _o1.toast(_ok.disabled ? 'Đã bật lại trang' : 'Đã tắt trang', 'success'); await _oj();
}, { kind: 'ghost', small: true, icon: _ok.disabled ? 'check' : 'lock', testid: 'site-admin-toggle-' + _ok.username }) : null))));
})();
return card;
}
await _oj();
}
export default {
manifest: {
id: 'trang_cua_toi', title: 'Trang của tôi', icon: '🪪', screen: 'customers', order: 45, version: '1.0.0', status: 'ready', requires: 'landing',
company: true,
help: 'Trang riêng của từng nhân viên ở <địa chỉ riêng>.<tên miền công ty>: sửa chữ, ảnh, dự án, màu → Xem trước → Xuất bản. Khách để lại số vào thẳng danh sách của chính người đó.'
},
mount,
async selftest() {
const _oe = SL.renderSitePage({ page: { name: 'Thử', phone: '0912345678' } });
return { ok: /91\/2025\/QH15/.test(_oe), details: [] };
}
};

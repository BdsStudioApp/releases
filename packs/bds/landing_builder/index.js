import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as L from '../_lib/landing.js';
import * as R from '../_lib/landing_runtime.js';
import { projectGaps } from '../catalog/research_new_logic.js';
import { zipStore } from '../../../core/upgrade.4730f76a5c.js';
import { connectSection } from '../_lib/lead_connect_ui.js';
import * as AP from '../_lib/landing_app.js';
import { setNotify } from '../../../core/packs.603a1dc003.js';
import { roleLabel } from '../../../core/users.56f7da9390.js';
import { ADD_PHONE, askMyPhone } from '../_lib/my_phone.js';
import config from '../../../config.js';
const _o1 = 'bds.landing.view';
export const BASIC_MAX = 1;
export const BASIC_MSG = 'Gói Cơ bản tạo được 1 landing. Muốn thêm trang: Gói 3 · Tìm khách & Landing (sắp có).';
const _o2 = 1600;
const _o0 = `
.lb{display:flex;flex-direction:column;gap:14px;min-width:0}
.lb h2{margin:0;font-size:1.25rem}.lb h3{margin:0;font-size:1.02rem}
.lb-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.lb-sp{justify-content:space-between}
.lb-muted{color:rgba(127,127,127,.95);font-size:.88rem}
.lb-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:12px}
.lb-card{border:1px solid rgba(127,127,127,.25);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:8px;min-width:0}
.lb-card b{font-size:1.02rem;word-break:break-word}
.lb-tpl{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.lb-tpl button{text-align:left;border:1px solid rgba(127,127,127,.3);border-radius:14px;padding:12px;background:transparent;color:inherit;font:inherit;cursor:pointer;min-height:44px}
.lb-tpl button.on{outline:3px solid var(--gold,#C9A24A)}
.lb-split{display:flex;flex-direction:column;gap:14px;min-width:0}
.lb-tabs{display:flex;gap:6px}
.lb-tabs button,.lb-seg button{min-height:44px;padding:0 14px;border-radius:999px;border:1px solid rgba(127,127,127,.3);background:transparent;color:inherit;font:inherit;cursor:pointer}
.lb-tabs button.on,.lb-seg button.on{background:var(--navy,#0F1E33);color:#fff;border-color:var(--navy,#0F1E33)}
.lb-seg{display:flex;gap:6px}
.lb-ed{display:flex;flex-direction:column;gap:8px;min-width:0}
.lb-ed details{border:1px solid rgba(127,127,127,.25);border-radius:14px;padding:0 12px;min-width:0}
.lb-ed summary{min-height:48px;display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:600;list-style:none}
.lb-ed summary::-webkit-details-marker{display:none}
.lb-ed details[open]{padding-bottom:12px}
.lb-f{display:flex;flex-direction:column;gap:4px;font-size:.9rem;margin-top:8px;min-width:0}
.lb-f input,.lb-f textarea,.lb-f select{min-height:44px;padding:8px 10px;border-radius:10px;border:1px solid rgba(127,127,127,.3);background:transparent;color:inherit;font:inherit;width:100%;box-sizing:border-box;min-width:0}
.lb-f input[type=color]{padding:2px;width:64px}
.lb-f textarea{min-height:84px}
.lb-f small{color:rgba(127,127,127,.95)}
.lb-two{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.lb-sec{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.lb-sec .lb-t{flex:1;min-width:120px}
.lb-ic[disabled]{opacity:.35;cursor:default}
.lb-ic{min-width:40px;min-height:40px;border-radius:10px;border:1px solid rgba(127,127,127,.3);background:transparent;color:inherit;cursor:pointer;font:inherit}
.lb-sw{display:inline-flex;align-items:center;gap:6px;min-height:40px;cursor:pointer}
.lb-sw input{width:22px;height:22px}
.lb-mau{display:inline-block;font-size:.7rem;font-weight:700;text-transform:uppercase;background:#FFE7A8;color:#5A4300;border-radius:999px;padding:3px 8px}
.lb-img{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:8px}
.lb-img .lb-thumb{width:96px;height:60px;border-radius:10px;overflow:hidden;background:rgba(127,127,127,.15);position:relative;flex:none;display:flex;align-items:center;justify-content:center;font-size:.7rem;text-align:center}
.lb-img .lb-thumb img{width:100%;height:100%;object-fit:cover}
.lb-img .lb-thumb .lb-mau{position:absolute;left:4px;top:4px}
.lb-pv{display:flex;flex-direction:column;gap:10px;min-width:0}
.lb-stage{display:flex;justify-content:center;background:rgba(127,127,127,.08);border-radius:18px;padding:12px;overflow:hidden;min-width:0}
.lb-phone{border:10px solid #111;border-radius:34px;overflow:hidden;background:#fff;width:390px;max-width:100%;height:720px;max-height:72vh;box-shadow:0 10px 30px rgba(0,0,0,.25)}
.lb-phone iframe{border:0;width:100%;height:100%;display:block}
@media (max-width:600px){.lb-stage{padding:0;background:none}.lb-phone{border-width:2px;border-radius:14px;box-shadow:none;max-height:none;height:70vh}}
.lb-desk{width:100%;overflow:hidden;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.2);background:#fff}
.lb-desk iframe{border:0;width:1280px;height:800px;transform-origin:0 0;display:block}
.lb-checks{margin:0;padding-left:18px}.lb-checks li.e{color:#B3261E}.lb-checks li.w{color:#9a7a2e}
.lb-links{display:flex;flex-direction:column;gap:8px}
.lb-link{display:flex;gap:8px;align-items:center;flex-wrap:wrap;border:1px solid rgba(127,127,127,.25);border-radius:12px;padding:8px 10px;min-width:0}
.lb-link code{flex:1 1 14em;min-width:0;overflow-wrap:anywhere;font-size:.82rem}
.lb-link>b{min-width:0;overflow-wrap:anywhere}
.lb-note{border-left:4px solid var(--gold,#C9A24A);padding:8px 12px;background:rgba(201,162,74,.10);border-radius:8px;font-size:.88rem}
.lb-gap{border-left:4px solid #B3261E;padding:8px 12px;background:rgba(179,38,30,.07);border-radius:8px;font-size:.88rem}
.lb-okl{border-left:4px solid #1E7A4F;padding:8px 12px;background:rgba(30,122,79,.08);border-radius:8px;font-size:.88rem}
.lb pre{white-space:pre-wrap;font-size:.82rem;margin:0}
.lb-app{border:2px solid var(--gold,#C9A24A);border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:8px;min-width:0}
.lb-app .lb-row .btn,.lb-app .lb-row button{min-height:44px}
.lb-more{border:1px solid rgba(127,127,127,.25);border-radius:14px;padding:0 12px}
.lb-more>summary{min-height:48px;display:flex;align-items:center;cursor:pointer;font-weight:600}
.lb-more[open]{padding-bottom:12px}
@media (min-width:1000px){.lb-split{display:grid;grid-template-columns:minmax(340px,420px) minmax(0,1fr);align-items:start}.lb-pv{position:sticky;top:8px}.lb-tabs{display:none}.lb-split>.lb-hide{display:flex !important}}
/* ── 18/11 QA Cá nhân: ô vừa nhảy tới từ danh sách cần sửa ── */
.lb-flash{outline:3px solid var(--gold,#C9A24A);outline-offset:3px;border-radius:12px;transition:outline-color .3s}
.lb-checks li{margin:4px 0}
`;
let _oj = false;
function ensureCss() {
if (_oj || typeof document === 'undefined') return;
_oj = true;
try { const _o2r = new CSSStyleSheet(); _o2r.replaceSync(_o0); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _o2r]; } catch { }
}
const mem = new Map();
let _ol = null;
function _o1c() {
if (_ol) return _ol;
_ol = new Promise((_o2g) => {
try {
const _o2d = indexedDB.open('bds-landing-img', 1);
_o2d.onupgradeneeded = () => _o2d.result.createObjectStore('img');
_o2d.onsuccess = () => _o2g(_o2d.result);
_o2d.onerror = () => _o2g(null);
} catch { _o2g(null); }
});
return _ol;
}
async function _o1f(id) {
if (mem.has(id)) return mem.get(id);
const _ok = await _o1c(); if (!_ok) return null;
return new Promise((_o2g) => { try { const _o2b = _ok.transaction('img').objectStore('img').get(id); _o2b.onsuccess = () => { if (_o2b.result) mem.set(id, _o2b.result); _o2g(_o2b.result || null); }; _o2b.onerror = () => _o2g(null); } catch { _o2g(null); } });
}
async function _o1h(id, _o2f) {
mem.set(id, _o2f);
const _ok = await _o1c(); if (!_ok) return;
await new Promise((_o2g) => { try { const _o2y = _ok.transaction('img', 'readwrite'); _o2y.objectStore('img').put(_o2f, id); _o2y.oncomplete = _o2g; _o2y.onerror = _o2g; } catch { _o2g(); } });
}
function _o2e(_oa) { return new Promise((_o2g, rej) => { const _o13 = new FileReader(); _o13.onload = () => _o2g(_o13.result); _o13.onerror = () => rej(_o13.error); _o13.readAsDataURL(_oa); }); }
async function _o2s(_oz) {
const url = URL.createObjectURL(_oz);
try {
const _o1d = await new Promise((_o2g, rej) => { const _o1b = new Image(); _o1b.onload = () => _o2g(_o1b); _o1b.onerror = () => rej(new Error('Không đọc được ảnh')); _o1b.src = url; });
const _o1m = Math.min(1, _o2 / Math.max(_o1d.naturalWidth, _o1d.naturalHeight));
const _oe = document.createElement('canvas'); _oe.width = Math.round(_o1d.naturalWidth * _o1m); _oe.height = Math.round(_o1d.naturalHeight * _o1m);
_oe.getContext('2d').drawImage(_o1d, 0, 0, _oe.width, _oe.height);
let _oa = await new Promise((_o2g) => _oe.toBlob(_o2g, 'image/webp', 0.82));
if (!_oa || _oa.type !== 'image/webp') _oa = await new Promise((_o2g) => _oe.toBlob(_o2g, 'image/jpeg', 0.85));
const mime = _oa.type || 'image/jpeg';
return { dataUrl: await _o2e(_oa), mime, ext: mime === 'image/webp' ? 'webp' : 'jpg', size: _oa.size };
} finally { URL.revokeObjectURL(url); }
}
const _o9 = (dataUrl) => { const _o8 = atob(String(dataUrl).split(',')[1] || ''); const _o1x = new Uint8Array(_o8.length); for (let _o1b = 0; _o1b < _o8.length; _o1b++) _o1x[_o1b] = _o8.charCodeAt(_o1b); return _o1x; };
async function _o23(cfg) { for (const _o33 of L.allImages(cfg)) if (_o33.img.kind === 'local') await _o1f(_o33.img.id); }
export async function mount(el, ctx) {
ensureCss();
S.ensureSalesCss();
const K = kit(ctx);
const _o2i = h('div', { class: 'lb', 'data-testid': 'landing-builder' });
el.innerHTML = '';
el.appendChild(_o2i);
const role = (ctx.user && ctx.user.role) || 'owner';
const _o1j = role === 'owner';
const api = ctx.api || {};
const serverUrl = api.mode === 'gas' && api.url ? String(api.url) : '';
const _om = api.mode === 'demo';
let env = await S.loadEnv(ctx);
const profile = await S.getProfile(ctx);
const _o1z = () => {
const all = (ctx.settings && typeof ctx.settings.all === 'function') ? ctx.settings.all() : {};
return Object.keys(all).filter((_o1m) => _o1m.startsWith(L.KEY_PREFIX)).map((_o1m) => L.normalizeLanding(all[_o1m])).filter((_oe) => _oe && _oe.id)
.sort((_o3, _o8) => (_o8.updated_at || 0) - (_o3.updated_at || 0));
};
const dataFor = (cfg) => {
const _o1y = env.project(cfg.project_id);
const { plans, policy } = env.plansFor(_o1y);
return { project: _o1y, plans, policy, projects: (cfg.projects || []).map((id) => env.project(id)).filter(Boolean), cfg: env.cfg, today: env.today };
};
const _o2l = (cfg) => K.setSetting(L.KEY_PREFIX + cfg.id, { ...cfg, updated_at: Date.now() });
const _o30 = () => !!(ctx.packs && typeof ctx.packs.enabled === 'function' && ctx.packs.enabled('leads'));
const _o7 = () => !_o30() && _o1z().length >= BASIC_MAX;
const _o5 = AP.appTarget(typeof location !== 'undefined' ? location.hostname : '', config);
function _o1p(text) {
const _o11 = _o1z()[0];
const _o1u = K.modal({ title: 'Gói Cơ bản: 1 landing', testid: 'lp-limit', body: [
h('p', { 'data-testid': 'lp-limit-msg' }, text || BASIC_MSG),
h('p', { class: 'lb-muted' }, 'Trang đang có vẫn sửa, đăng lại, gỡ được bình thường. Muốn làm trang khác: sửa trang đang có, hoặc xoá trang đó rồi tạo trang mới.'),
h('div', { class: 'lb-row' },
K.button('Báo tôi khi có', () => { setNotify('leads', true); K.toast('Đã ghi nhớ trên máy này – khi Gói 3 · Tìm khách & Landing sẵn sàng, app sẽ báo.', 'ok'); _o1u.close(); }, { kind: 'primary', icon: '🔔', testid: 'lp-limit-notify' }),
_o11 ? K.button('Sửa trang đang có', () => { _o1u.close(); _ou(_o11); }, { kind: 'ghost', icon: '✏️', testid: 'lp-limit-edit' }) : null)] });
return _o1u;
}
const _o1i = (e) => !!e && (e.code === 'PACK_LIMIT');
async function _o6(slug) {
let _o26 = null;
try { _o26 = await K.api('landing.app_proof'); } catch { _o26 = null; }
await K.api('landing.unpublish', { slug });
if (!_o5 || !_o26) return { worker: false };
try { await AP.workerCall(_o5, 'go', { page: slug, id_token: _o26.id_token }); return { worker: true }; } catch { return { worker: false }; }
}
if (!_o1j) return _o1s();
const _o2c = S.hashParams();
const open = _o2c.get('id') && _o1z().find((_oe) => _oe.id === _o2c.get('id'));
if (open) _ou(open); else _o1t();
return _o2i;
function _o1t() {
const list = _o1z();
const _of = list.map((_oe) => {
const T = L.TEMPLATES[_oe.template];
const _o27 = _oe.published || {};
return h('div', { class: 'lb-card', 'data-testid': 'lp-card-' + _oe.id },
h('b', null, _oe.name || 'Trang chưa đặt tên'),
h('span', { class: 'lb-muted' }, `${T.icon} ${T.title} · /${_oe.slug}`),
h('span', { class: 'lb-muted' }, [_o27.app && _o27.app.at ? 'Đã đăng lên địa chỉ app ' + S.todayISO(new Date(_o27.app.at)).split('-').reverse().join('/') : '', _o27.gas && _o27.gas.at ? 'Xuất bản nhanh ' + S.todayISO(new Date(_o27.gas.at)).split('-').reverse().join('/') : '', _o27.zip && _o27.zip.at ? 'Tải .zip ' + S.todayISO(new Date(_o27.zip.at)).split('-').reverse().join('/') : ''].filter(Boolean).join(' · ') || 'Bản nháp'),
h('div', { class: 'lb-row' },
K.button('Sửa', () => _ou(_oe), { kind: 'primary', testid: 'lp-edit-' + _oe.id }),
K.button('Xoá', () => remove(_oe), { kind: 'ghost', testid: 'lp-del-' + _oe.id })));
});
_o2i.replaceChildren(
h('div', { class: 'lb-row lb-sp' }, h('h2', null, 'Trình tạo landing'), K.button('Tạo trang mới', () => (_o7() ? _o1p() : _oi()), { kind: 'primary', icon: 'plus', testid: 'lp-new' })),
_o30() ? null : h('p', { class: 'lb-muted', 'data-testid': 'lp-plan' }, `Gói Cơ bản: ${Math.min(list.length, BASIC_MAX)}/${BASIC_MAX} landing. Thêm trang: Gói 3 · Tìm khách & Landing (sắp có).`),
h('p', { class: 'lb-muted' }, 'Trang giới thiệu dự án / căn ký gửi / sự kiện / trang cá nhân: tự điền từ Bảng hàng, khách để lại số là về thẳng app của anh/chị (máy chủ Google riêng) + báo Telegram.'),
h('div', { class: 'lb-note' }, 'Thông tin dự án trên trang do anh/chị chịu trách nhiệm: kiểm tra giá, chính sách, pháp lý với tài liệu của chủ đầu tư trước khi xuất bản. Ảnh mẫu là ảnh minh hoạ trung tính – nên thay bằng ảnh tự chụp.'),
list.length ? h('div', { class: 'lb-cards' }, _of) : K.empty('Chưa có trang nào. Bấm "Tạo trang mới".'),
ctx.solo ? null : _o2k(),
connectSection(ctx, K, { org: profile && (profile.company || profile.name) }));
}
async function remove(_oe) {
const ok = await K.confirm({ title: 'Xoá trang', text: `Xoá trang "${_oe.name}"? Trang Xuất bản nhanh (nếu có) cũng được gỡ. Khách đã để lại số vẫn giữ nguyên.`, ok: 'Xoá', kind: 'danger', testid: 'lp-del-confirm' });
if (!ok) return;
if (_oe.published && _oe.published.gas && _oe.published.gas.slug) { try { await K.api('landing.unpublish', { slug: _oe.published.gas.slug }); } catch { } }
if (_oe.published && _oe.published.app && _oe.published.app.slug) await _o6(_oe.published.app.slug).catch(() => null);
await K.setSetting(L.KEY_PREFIX + _oe.id, null);
K.toast('Đã xoá trang', 'ok');
_o1t();
}
function _oi() {
let _o2x = 'project';
const tplBox = h('div', { class: 'lb-tpl', role: 'radiogroup' });
const _ot = () => tplBox.replaceChildren(...L.TEMPLATE_IDS.map((id) => {
const T = L.TEMPLATES[id];
return h('button', { type: 'button', class: _o2x === id ? 'on' : '', role: 'radio', 'aria-checked': String(_o2x === id), 'data-testid': 'lp-tpl-' + id, onclick: () => { _o2x = id; _ot(); } },
h('b', null, T.icon + ' ' + T.title), h('div', { class: 'lb-muted' }, T.desc));
}));
_ot();
const _o2q = K.select([['', '— Không gắn dự án —'], ...env.projects.map((_o1y) => [_o1y.id, _o1y.name + (_o1y.price ? ' · ' + L.priceLabel(_o1y) : '')])], (env.projects.find(S.sellable) || {}).id || '', { 'data-testid': 'lp-new-project' });
const gapBox = h('div', { 'aria-live': 'polite' });
const _o18 = (hash) => { _o1u.close(); K.nav(hash); };
const _op = () => {
const _o1y = env.project(_o2q.value);
const _od = h('div', { class: 'lb-row' },
K.button(_o1y ? '🏢 Mở dự án trong Bảng hàng' : '🏢 Mở Bảng hàng', () => _o18(_o1y ? '#/sales/catalog?open=' + encodeURIComponent(_o1y.id) : '#/sales/catalog'), { testid: 'lp-new-open-catalog' }));
if (!_o1y) { gapBox.replaceChildren(_od); return; }
const { plans, policy } = env.plansFor(_o1y);
const _o16 = projectGaps(_o1y, { policy, plans, staleDays: policy ? S.staleDays(policy) : 0 });
gapBox.replaceChildren(_o16.length
? h('div', { class: 'lb-gap', role: 'status', 'data-testid': 'lp-new-gaps', 'data-gaps': _o16.map((_o15) => _o15.key).join(' ') },
`⚠️ "${_o1y.name}" trong Bảng hàng còn thiếu: ${_o16.map((_o15) => _o15.label).join('; ')}. Trang sẽ thiếu hoặc ẩn các mục này – nên cập nhật dự án trước khi tạo trang.`)
: h('div', { class: 'lb-okl', 'data-testid': 'lp-new-gaps', 'data-gaps': '' }, `✓ "${_o1y.name}" đã có giá, loại căn, chính sách đang áp dụng và vị trí trong Bảng hàng.`), _od);
};
_o2q.addEventListener('change', _op);
const _o1u = K.modal({
title: 'Tạo trang mới', testid: 'lp-new-modal', wide: true,
body: [h('h3', null, '1. Chọn mẫu'), tplBox, h('label', { class: 'lb-f' }, h('span', null, '2. Dự án trong Bảng hàng (tự điền giá, chính sách, vị trí)'), _o2q),
h('p', { class: 'lb-note', 'data-testid': 'lp-new-catalog-note' }, 'Trang lấy giá, chính sách, vị trí, loại căn ĐÚNG như trong Bảng hàng. Để thông tin trên trang chuẩn, anh/chị thêm hoặc cập nhật dự án ở Bảng hàng (gõ tên dự án mới vào ô tìm để thêm; mở dự án → "AI tìm thông tin" / "Sửa thông tin"; chính sách ở "Cập nhật chính sách") rồi mới tạo trang.'),
gapBox,
h('div', { class: 'lb-row' }, K.button('Tạo trang', async () => {
if (_o7()) { _o1u.close(); _o1p(); return; }
const _o1y = env.project(_o2q.value);
const { plans } = env.plansFor(_o1y);
const cfg = L.newLanding({ id: K.newId(), template: _o2x, project: _o1y, profile, data: { plans, cfg: env.cfg } });
await _o2l(cfg);
_o1u.close();
_ou(cfg);
}, { kind: 'primary', testid: 'lp-new-create' }))]
});
_op();
}
function _o2k() {
const _oc = h('div', { class: 'lb-card', 'data-testid': 'lp-sale-codes' }, h('h3', null, 'Mã riêng từng sale'), h('span', { class: 'lb-muted' }, 'Đang tải…'));
K.api('landing.sale_codes').then((list) => {
_oc.replaceChildren(h('h3', null, 'Mã riêng từng sale'),
h('p', { class: 'lb-muted' }, 'Thêm ?s=<mã> vào cuối địa chỉ trang → khách để lại số qua link đó tự giao cho sale đó (Telegram báo cả Quản trị và sale). Sale xem link của mình trong mục này trên máy của họ.'),
h('div', { class: 'lb-links' }, (list || []).map((_o2z) => h('div', { class: 'lb-link' }, h('b', null, _o2z.full_name || _o2z.username), h('span', { class: 'lb-muted' }, roleLabel(_o2z.role)), h('code', { 'data-testid': 'lp-code-' + _o2z.username }, 's=' + _o2z.code)))));
}).catch(() => _oc.replaceChildren(h('h3', null, 'Mã riêng từng sale'), h('p', { class: 'lb-muted' }, 'Máy chủ chưa có chức năng này – cần cập nhật máy chủ.')));
return _oc;
}
async function _o1s() {
_o2i.replaceChildren(h('h2', null, 'Link riêng của tôi'), h('p', { class: 'lb-muted' }, 'Đang tải…'));
let code = '', list = [];
try { code = (await K.api('landing.my_code')).code; list = await K.api('landing.published'); } catch { _o2i.replaceChildren(h('h2', null, 'Link riêng của tôi'), K.empty('Máy chủ chưa có chức năng này – cần cập nhật máy chủ.')); return; }
const url = (_o33) => (_o33.app && _o5 ? AP.pageUrl(_o5, _o33.slug) : '') || _o33.url || L.gasPageUrl(serverUrl, _o33.slug);
_o2i.replaceChildren(
h('h2', null, 'Link riêng của tôi'),
h('p', { class: 'lb-muted' }, 'Gửi link này cho khách / gắn vào bài đăng: khách để lại số qua link này tự giao cho anh/chị, Telegram báo ngay.'),
h('div', { class: 'lb-card' }, h('span', null, 'Mã của tôi: ', h('b', { 'data-testid': 'lp-my-code' }, code)),
h('span', { class: 'lb-muted' }, 'Trang đặt ở tên miền riêng: thêm ?s=' + code + ' vào cuối địa chỉ trang.')),
list.length ? h('div', { class: 'lb-links' }, list.map((_o33) => {
const _o1q = L.saleLink(url(_o33), code);
return h('div', { class: 'lb-link' }, h('b', null, _o33.title || _o33.slug), h('code', null, _o1q || '(xem thử – chưa có địa chỉ thật)'), _o1q ? K.button('Chép', async () => { await K.copy(_o1q); K.toast('Đã chép link', 'ok'); }, { kind: 'ghost', icon: 'copy' }) : null);
})) : K.empty('Chưa có trang nào được Xuất bản nhanh.'));
if (role === 'manager') _o2i.appendChild(connectSection(ctx, K, { org: profile && (profile.company || profile.name) }));
}
async function _ou(start) {
let cfg = L.normalizeLanding(start);
await _o23(cfg);
let _o2m = 0, paintT = 0;
let _on = 'phone';
try { const v = localStorage.getItem(_o1); if (v === 'desk') _on = 'desk'; } catch { }
const _o2w = (section) => {
if (section && (cfg.samples || []).includes(section)) cfg = L.clearSample(cfg, section);
clearTimeout(_o2m); _o2m = setTimeout(() => _o2l(cfg), 600);
clearTimeout(paintT); paintT = setTimeout(() => { _o20(); if (_o29) _oq(); }, 200);
};
let _o29 = false;
const set = (path, v, section) => { const _o1n = path.split('.'); let o = cfg; for (let _o1b = 0; _o1b < _o1n.length - 1; _o1b++) o = o[_o1n[_o1b]]; o[_o1n.at(-1)] = v; _o2w(section); };
const get = (path) => path.split('.').reduce((o, _o1m) => (o == null ? o : o[_o1m]), cfg);
const _o14 = h('iframe', { title: 'Xem trước trang', 'data-testid': 'lp-frame' });
const stage = h('div', { class: 'lb-stage' });
const _o2p = (id, label) => h('button', { type: 'button', class: _on === id ? 'on' : '', 'data-testid': 'lp-view-' + id, onclick: () => { _on = id; try { localStorage.setItem(_o1, id); } catch { } _o1o(); } }, label);
const _o2o = h('div', { class: 'lb-seg' });
const _o2a = h('div', { class: 'lb-pv lb-hide' }, h('div', { class: 'lb-row lb-sp' }, h('h3', null, 'Xem trước'), _o2o), stage,
h('p', { class: 'lb-muted' }, 'Bản xem trước: bấm Gửi trên form = gửi thử vào app (khách có nhãn "thử"). Ảnh dán link chỉ hiện ở trang thật.'));
let _o2h = null;
const _oc = h('div', { class: 'lb-phone' }, _o14);
stage.replaceChildren(_oc);
let _o21 = null;
function _o1o() {
_o2o.replaceChildren(_o2p('phone', '📱 Điện thoại'), _o2p('desk', '🖥️ Máy tính'));
if (_o2h) { _o2h.disconnect(); _o2h = null; }
if (_on === 'phone') { _oc.className = 'lb-phone'; _oc.style.height = ''; _o14.style.transform = ''; }
else {
_oc.className = 'lb-desk';
const _o12 = () => { const _o32 = _oc.clientWidth || 600; const _o1m = Math.min(1, _o32 / 1280); _o14.style.transform = `scale(${_o1m})`; _oc.style.height = Math.round(800 * _o1m) + 'px'; };
_o12();
if (typeof ResizeObserver !== 'undefined') { _o2h = new ResizeObserver(_o12); _o2h.observe(_oc); }
}
_o20();
}
function _o20() {
if (!_o14.isConnected) return;
const data = dataFor(cfg);
const { html, css, cfgJson } = L.renderPage(cfg, data, { target: 'preview', imgSrc: (_o1d) => (mem.get(_o1d.id) || {}).dataUrl || '' });
const _o2t = html + '\u0000' + css + '\u0000' + cfgJson;
if (_o21 === _o2t) return;
_o21 = _o2t;
let _o34 = 0;
try { _o34 = _o14.contentWindow ? _o14.contentWindow.scrollY : 0; } catch { _o34 = 0; }
_o14.onload = () => {
const _o32 = _o14.contentWindow, d = _o14.contentDocument;
if (!_o32 || !d) return;
try { const _o2r = new _o32.CSSStyleSheet(); _o2r.replaceSync(css); d.adoptedStyleSheets = [_o2r]; } catch { }
try {
R.lpBoot(_o32, d, cfgJson, { preview: true, notify: (t) => K.toast(t), send: (_o1y) => K.api('landing.lead', _o1y).then((_o2d) => { K.toast('Đã gửi thử – khách nằm trong danh sách Khách hàng (nhãn "thử")', 'ok'); return _o2d; }) });
} catch (e) { ctx.errors && ctx.errors.report && ctx.errors.report('warn', 'landing.preview', String(e && e.message || e)); }
try { _o32.scrollTo(0, _o34); } catch { }
_o14.dataset.ready = String(Date.now());
};
_o14.srcdoc = html;
}
const _ox = (label, path, section, o = {}) => {
const inp = h(o.area ? 'textarea' : 'input', { type: o.type || 'text', value: get(path) ?? '', maxlength: o.max || (o.area ? 2000 : 200), placeholder: o.ph || '', 'data-testid': 'lp-f-' + path.replace(/\./g, '-'), inputmode: o.inputmode, autocomplete: o.autocomplete });
if (o.area) inp.value = get(path) ?? '';
const _o1a = o.count ? h('small', null) : (o.help ? h('small', null, o.help) : null);
const _o31 = () => { if (o.count) _o1a.textContent = `${inp.value.length}/${o.count} ký tự` + (o.help ? ' · ' + o.help : ''); };
inp.addEventListener('input', () => { set(path, o.num ? Number(String(inp.value).replace(',', '.')) || 0 : inp.value, section); _o31(); if (o.on) o.on(inp.value); });
_o31();
return h('label', { class: 'lb-f' }, h('span', null, label), inp, _o1a);
};
const _ow = (label, path) => {
const inp = h('input', { type: 'color', value: get(path), 'data-testid': 'lp-f-' + path.replace(/\./g, '-') });
inp.addEventListener('input', () => { if (L.validColor(inp.value)) set(path, inp.value); });
return h('label', { class: 'lb-f' }, h('span', null, label), inp);
};
const _oy = (label, path, testid) => {
const cb = h('input', { type: 'checkbox', checked: !!get(path), 'data-testid': testid });
cb.addEventListener('change', () => set(path, cb.checked));
return h('label', { class: 'lb-sw' }, cb, h('span', null, label));
};
const _o1g = (label, path, { allowSample = true } = {}) => {
const _oc = h('div', { class: 'lb-img', 'data-testid': 'lp-img-' + path.replace(/\./g, '-') });
const _oz = h('input', { type: 'file', accept: 'image/*', hidden: true, 'data-testid': 'lp-file-' + path.replace(/\./g, '-') });
_oz.addEventListener('change', async () => {
const _ov = _oz.files && _oz.files[0]; if (!_ov) return;
try {
const _o2f = await _o2s(_ov);
const id = 'i' + K.newId().slice(-10);
await _o1h(id, _o2f);
set(path, { kind: 'local', id, name: String(_ov.name || '').slice(0, 80) });
_oo();
K.toast('Đã thêm ảnh (' + Math.round(_o2f.size / 1024) + ' KB) – ảnh lưu trên máy này', 'ok');
} catch (e) { K.toast('Không đọc được ảnh: ' + (e && e.message || ''), 'warn'); }
_oz.value = '';
});
function _oo() {
const _o1d = get(path);
let _o2v;
if (!_o1d) _o2v = h('div', { class: 'lb-thumb' }, 'Chưa có ảnh');
else if (_o1d.kind === 'local' && mem.get(_o1d.id)) _o2v = h('div', { class: 'lb-thumb' }, h('img', { src: mem.get(_o1d.id).dataUrl, alt: '' }));
else if (_o1d.kind === 'local') _o2v = h('div', { class: 'lb-thumb' }, 'Ảnh ở máy khác');
else if (_o1d.kind === 'url') _o2v = h('div', { class: 'lb-thumb', title: _o1d.url }, '🔗 Ảnh từ link');
else _o2v = h('div', { class: 'lb-thumb' }, h('img', { src: L.sampleSvg(_o1d.seed, (env.project(cfg.project_id) || {}).hue, _o1d.look || 'city'), alt: '' }), h('span', { class: 'lb-mau' }, 'Mẫu'));
_oc.replaceChildren(_o2v, h('div', { class: 'lb-row' },
K.button('Tải ảnh lên', () => _oz.click(), { kind: 'ghost' }),
K.button('Dán link', () => {
const inp = h('input', { type: 'url', value: _o1d && _o1d.kind === 'url' ? _o1d.url : '', placeholder: 'https://…', 'data-testid': 'lp-url-input' });
const err = h('p', { class: 'sl-bad', role: 'alert' });
const _o1u = K.modal({ title: 'Ảnh từ đường link', testid: 'lp-url-modal', body: [
h('p', { class: 'lb-muted' }, 'Ảnh trên Google Drive: bấm Chia sẻ → "Bất kỳ ai có đường liên kết" → Sao chép đường liên kết rồi dán vào đây. Link https khác cũng dùng được.'),
h('label', { class: 'lb-f' }, h('span', null, 'Link ảnh'), inp), err,
h('div', { class: 'lb-row' }, K.button('Dùng ảnh này', () => {
const _o2z = L.imageUrl(inp.value);
if (!_o2z) { err.textContent = 'Link ảnh phải bắt đầu bằng https://'; return; }
set(path, { kind: 'url', url: _o2z }); _oo(); _o1u.close();
}, { kind: 'primary', testid: 'lp-url-ok' }))] });
}, { kind: 'ghost' }),
allowSample ? K.button('Ảnh mẫu', () => { set(path, { kind: 'sample', seed: path + Date.now().toString(36).slice(-3), look: (_o1d && _o1d.look) || 'city' }); _oo(); }, { kind: 'ghost' }) : null,
_o1d ? K.button('Bỏ ảnh', () => { set(path, null); _oo(); }, { kind: 'ghost', icon: 'x', testid: 'lp-img-del-' + path.replace(/\./g, '-') }) : null), _oz);
}
_oo();
return h('div', null, h('span', { class: 'lb-f' }, label), _oc);
};
const group = (title, body, { open = false, testid } = {}) => h('details', { open, 'data-testid': testid }, h('summary', null, title), ...[].concat(body));
const sectionFields = {
hero: () => [_ox('Dòng nhỏ trên tiêu đề', 's.hero.eyebrow'), _ox('Tiêu đề lớn', 's.hero.heading', null, { max: 120 }), _ox('Mô tả ngắn', 's.hero.sub', null, { area: true, max: 300 }), _ox('Chữ trên nút', 's.hero.cta', null, { max: 40 }), _o1g('Ảnh bìa', 's.hero.image')],
location: () => [_ox('Vị trí', 's.location.text', 'location', { area: true }), _ox('Tiện ích – mỗi dòng 1 mục', 's.location.items', 'location', { area: true, help: 'Chỉ ghi khoảng cách đã kiểm tra.' })],
price: () => [h('p', { class: 'lb-muted' }, _o24()), _ox('Ghi chú thêm', 's.price.note', null, { max: 300 })],
policy: () => [h('p', { class: 'lb-muted' }, 'Lấy từ chính sách đang áp dụng trong Bảng hàng (Cập nhật chính sách).'), _ox('Ghi chú thêm', 's.policy.note', null, { max: 300 })],
loan: () => [h('div', { class: 'lb-two' }, _ox('Giá căn (tỷ)', 's.loan.price', null, { type: 'number', num: true, inputmode: 'decimal' }), _ox('Vay (% giá)', 's.loan.ltv', null, { type: 'number', num: true }), _ox('Lãi suất (%/năm)', 's.loan.rate', null, { type: 'number', num: true, inputmode: 'decimal' }), _ox('Thời hạn (năm)', 's.loan.years', null, { type: 'number', num: true }))],
gallery: () => {
const _oc = h('div');
const _oo = () => {
const imgs = cfg.s.gallery.images || [];
_oc.replaceChildren(...imgs.map((_, _o1b) => h('div', null, _o1g('Ảnh ' + (_o1b + 1), 's.gallery.images.' + _o1b), K.button('Bỏ ảnh ' + (_o1b + 1), () => { cfg.s.gallery.images.splice(_o1b, 1); _o2w(); _oo(); }, { kind: 'ghost' }))),
imgs.length < 9 ? K.button('＋ Thêm ảnh', () => { cfg.s.gallery.images.push({ kind: 'sample', seed: 'g' + Date.now().toString(36), look: 'city' }); _o2w(); _oo(); }, { kind: 'ghost', testid: 'lp-gal-add' }) : null);
};
_oo();
return [_oc];
},
form: () => [h('p', { class: 'lb-note' }, 'Ô "Tôi đồng ý…" (đồng ý lưu dữ liệu cá nhân – theo Luật Bảo vệ dữ liệu cá nhân 2025 (Luật số 91/2025/QH15)) luôn có và bắt buộc tick – không tắt được.'), _ox('Tiêu đề form', 's.form.heading'), _ox('Dòng giải thích', 's.form.sub', null, { max: 200 }), _ox('Chữ trên nút gửi', 's.form.button', null, { max: 40 }), _oy('Hỏi thêm loại căn / nhu cầu / số người', 's.form.interest', 'lp-f-form-interest')],
contact: () => [h('p', { class: 'lb-muted' }, 'Nút Zalo + Gọi dính cuối màn hình điện thoại. Số lấy ở nhóm "Liên hệ".')],
doc: () => [_ox('Tên tài liệu', 's.doc.title', 'doc', { max: 160 }), _ox('Mô tả', 's.doc.desc', 'doc', { max: 200 }), _ox('Chữ trên nút', 's.doc.button', 'doc', { max: 40 }),
_ox('Link tài liệu (tuỳ chọn, https://…)', 's.doc.url', 'doc', { help: 'Hiện sau khi khách gửi số. Link nằm trong mã trang – tài liệu nhạy cảm thì để trống, chuyên viên gửi qua Zalo.' })],
facts: () => [_ox('Thông tin căn – mỗi dòng "Tên: giá trị"', 's.facts.items', 'facts', { area: true })],
event: () => [h('div', { class: 'lb-two' }, _ox('Ngày', 's.event.date', 'event', { type: 'date' }), _ox('Giờ', 's.event.time', 'event', { type: 'time' })), _ox('Địa điểm', 's.event.place', 'event', { area: true, max: 300 }), _ox('Chương trình – mỗi dòng 1 mục', 's.event.agenda', 'event', { area: true })],
agent: () => [_ox('Giới thiệu', 's.agent.bio', 'agent', { area: true }), _ox('Điểm mạnh – mỗi dòng 1 ý', 's.agent.bullets', 'agent', { area: true })],
projects: () => [h('div', { class: 'lb-col' }, env.projects.map((_o1y) => {
const cb = h('input', { type: 'checkbox', checked: cfg.projects.includes(_o1y.id), 'data-testid': 'lp-proj-' + _o1y.id });
cb.addEventListener('change', () => { cfg.projects = cb.checked ? [...new Set([...cfg.projects, _o1y.id])].slice(0, 12) : cfg.projects.filter((_o33) => _o33 !== _o1y.id); _o2w(); });
return h('label', { class: 'lb-sw' }, cb, h('span', null, _o1y.name));
}))]
};
function _o24() {
const d = dataFor(cfg);
const _o2j = L.priceRows(d.project, d.plans);
if (!d.project) return 'Chưa gắn dự án – chọn dự án ở nhóm "Mẫu & dự án".';
return _o2j.length ? `Lấy tự động từ Bảng hàng: ${d.project.name} · ${L.priceLabel(d.project)} · ${d.policy ? S.policyLabel(d.policy) : 'Giá tham khảo'} (${_o2j.length} loại căn).` : 'Dự án chưa có giá trong Bảng hàng – mục này sẽ ẩn trên trang.';
}
const _o2n = h('div', { class: 'lb-ed' });
function _or() {
_o2n.replaceChildren(...cfg.order.map((id, _o1b) => {
const cb = h('input', { type: 'checkbox', checked: !!cfg.on[id], disabled: id === 'hero', 'aria-label': 'Bật ' + L.SECTIONS[id], 'data-testid': 'lp-on-' + id });
cb.addEventListener('change', () => { cfg.on[id] = cb.checked; _o2w(); });
const _o1v = (d) => { const _o1k = _o1b + d; if (_o1k < 1 || _o1k >= cfg.order.length || _o1b === 0) return; const o = cfg.order.slice(); [o[_o1b], o[_o1k]] = [o[_o1k], o[_o1b]]; cfg.order = o; _o2w(); _or(); };
const _o19 = h('div', { class: 'lb-sec' }, h('label', { class: 'lb-sw' }, cb), h('span', { class: 'lb-t' }, L.SECTIONS[id]),
(cfg.samples || []).includes(id) ? h('span', { class: 'lb-mau', 'data-testid': 'lp-mau-' + id }, 'Mẫu') : null,
_o1b > 0 ? h('button', { type: 'button', class: 'lb-ic', 'aria-label': 'Đưa lên', disabled: _o1b < 2, title: _o1b < 2 ? 'Mục đầu trang (ảnh bìa) đứng yên' : 'Đưa lên', onclick: (e) => { e.preventDefault(); _o1v(-1); } }, K.icon('up', 18) || '↑') : null,
_o1b > 0 ? h('button', { type: 'button', class: 'lb-ic', 'aria-label': 'Đưa xuống', disabled: _o1b >= cfg.order.length - 1, title: _o1b >= cfg.order.length - 1 ? 'Đã ở cuối trang' : 'Đưa xuống', onclick: (e) => { e.preventDefault(); _o1v(1); } }, K.icon('down', 18) || '↓') : null);
const d = h('details', { 'data-testid': 'lp-sec-' + id }, h('summary', null, _o19));
let _o10 = false;
d.addEventListener('toggle', () => { if (d.open && !_o10) { _o10 = true; d.append(...sectionFields[id]()); } });
return d;
}));
}
_or();
const _o28 = h('div', { 'data-testid': 'lp-publish' });
const _o1e = async () => {
const _o1x = {};
for (const _o33 of L.allImages(cfg)) if (_o33.img.kind === 'local') { const _o2d = await _o1f(_o33.img.id); if (_o2d) _o1x[_o33.img.id] = _o2d; }
return _o1x;
};
const _o1l = async (fix, close) => {
if (close) close();
const _o15 = fix.group && _o2i.querySelector('[data-testid="' + fix.group + '"]');
if (_o15 && !_o15.open) _o15.open = true;
if (fix.sec) { const d = _o2i.querySelector('[data-testid="lp-sec-' + fix.sec + '"]'); if (d && !d.open) { d.open = true; d.dispatchEvent(new Event('toggle')); } }
await new Promise((_o2d) => setTimeout(_o2d, 30));
const el = (fix.field && _o2i.querySelector('[data-testid="' + fix.field + '"]')) || (fix.sec && _o2i.querySelector('[data-testid="lp-sec-' + fix.sec + '"]')) || _o15;
if (!el) return;
try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch { el.scrollIntoView(); }
const _ov = /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) ? el : el.querySelector('input:not([type=file]), textarea, select, button');
if (_ov) try { _ov.focus({ preventScroll: true }); } catch { }
el.classList.add('lb-flash'); setTimeout(() => el.classList.remove('lb-flash'), 1600);
};
const _oh = (list, close) => list.length ? h('div', null,
list.some((_oe) => _oe.level === 'error') ? h('p', { class: 'lb-muted', 'data-testid': 'lp-checks-lead' }, 'Sửa các mục ⛔ trước khi đăng (xem trước vẫn dùng được):') : null,
h('ul', { class: 'lb-checks', 'data-testid': 'lp-checks' }, list.map((_oe, _o1b) => h('li', { class: _oe.level === 'error' ? 'e' : 'w', dataset: _oe.fix ? { fixSec: _oe.fix.sec || '', fixField: _oe.fix.field || '' } : undefined }, (_oe.level === 'error' ? '⛔ ' : '⚠️ ') + _oe.text, ' ',
_oe.fix ? K.button('Sửa', () => _o1l(_oe.fix, close), { kind: 'ghost', small: true, icon: 'next', testid: 'lp-fix-' + _o1b }) : null,
_oe.fix && _oe.fix.phone && !profile.phone ? K.button(ADD_PHONE, () => askMyPhone(K, { onSaved: (ph) => { profile.phone = ph; set('contact.phone', ph); if (!get('contact.zalo')) set('contact.zalo', ph); if (close) close(); _oq(); } }), { kind: 'primary', small: true, icon: 'phone', testid: 'lp-add-phone' }) : null))))
: h('p', { class: 'sl-ok' }, '✅ Trang sẵn sàng.');
async function exportZip() {
const imgs = await _o1e();
const _og = L.checkLanding(cfg, dataFor(cfg), { server: serverUrl, mode: 'zip', images: imgs });
if (_og.some((_oe) => _oe.level === 'error')) { const _ob = K.modal({ title: 'Chưa tải được', body: _oh(_og, () => _ob.close()), testid: 'lp-zip-blocked' }); return; }
const images = {};
for (const [id, _o2d] of Object.entries(imgs)) images[id] = { bytes: _o9(_o2d.dataUrl), ext: _o2d.ext };
const { files } = L.exportFiles(cfg, dataFor(cfg), { server: serverUrl, images });
const bytes = zipStore(files.map((_ov) => ({ name: cfg.slug + '/' + _ov.name, data: _ov.data })));
const _oa = new Blob([bytes], { type: 'application/zip' });
const _o3 = document.createElement('a'); _o3.href = URL.createObjectURL(_oa); _o3.download = cfg.slug + '.zip'; _o3.rel = 'noopener';
document.body.appendChild(_o3); _o3.click(); _o3.remove(); setTimeout(() => URL.revokeObjectURL(_o3.href), 4000);
cfg.published = { ...cfg.published, zip: { at: Date.now() } }; _o2w();
K.toast('Đã tải ' + cfg.slug + '.zip – làm theo hướng dẫn trong tệp HUONG_DAN_DUA_LEN_MANG.txt', 'ok');
}
async function quickPublish() {
const imgs = await _o1e();
const _og = L.checkLanding(cfg, dataFor(cfg), { server: serverUrl || (_om ? 'demo' : ''), mode: 'gas', images: imgs });
if (_og.some((_oe) => _oe.level === 'error')) { const _ob = K.modal({ title: 'Chưa xuất bản được', body: _oh(_og, () => _ob.close()), testid: 'lp-gas-blocked' }); return; }
const dataUrls = {}; for (const [id, _o2d] of Object.entries(imgs)) dataUrls[id] = _o2d.dataUrl;
const html = L.gasHtml(cfg, dataFor(cfg), { server: serverUrl, dataUrls });
try {
const _o1w = cfg.published && cfg.published.gas && cfg.published.gas.slug;
const _o2d = await K.api('landing.publish', { slug: cfg.slug, html, landing_id: cfg.id, title: cfg.name });
if (_o1w && _o1w !== cfg.slug) { try { await K.api('landing.unpublish', { slug: _o1w }); } catch { } }
cfg.published = { ...cfg.published, gas: { slug: _o2d.slug, at: _o2d.at, url: _o2d.url || L.gasPageUrl(serverUrl, _o2d.slug) } };
_o2w(); _oq();
K.toast('Đã xuất bản nhanh', 'ok');
} catch (e) { if (_o1i(e)) _o1p(e.message); else K.toast((e && e.message) || 'Chưa xuất bản được', 'warn'); }
}
async function appPublish() {
if (!_o5) return;
if (!AP.validPage(cfg.slug)) { K.toast('Đường dẫn trang chỉ gồm chữ thường không dấu, số và dấu gạch nối (3–50 ký tự) – sửa ở mục SEO.', 'warn'); return; }
const imgs = await _o1e();
const _og = L.checkLanding(cfg, dataFor(cfg), { server: serverUrl || (_om ? 'demo' : ''), mode: 'gas', images: imgs });
if (_og.some((_oe) => _oe.level === 'error')) { const _ob = K.modal({ title: 'Chưa đăng được', body: _oh(_og, () => _ob.close()), testid: 'lp-app-blocked' }); return; }
let _o26;
try { _o26 = await K.api('landing.app_proof'); } catch (e) { K.toast((e && e.message) || 'Máy chủ chưa hỗ trợ – cập nhật máy chủ rồi thử lại.', 'warn'); return; }
const exec = AP.EXEC_RE.test(String(_o26.exec || '')) ? _o26.exec : (AP.EXEC_RE.test(serverUrl) ? serverUrl : '');
if (!exec) { K.toast('Chưa nối máy chủ Google thật (đang xem thử) – kết nối máy chủ ở Cài đặt › Kết nối rồi đăng.', 'warn'); return; }
const url = AP.pageUrl(_o5, cfg.slug);
const dataUrls = {}; for (const [id, _o2d] of Object.entries(imgs)) dataUrls[id] = _o2d.dataUrl;
const html = L.appHtml(cfg, dataFor(cfg), { server: exec, dataUrls, pageUrl: url });
const _o1w = cfg.published && cfg.published.app && cfg.published.app.slug;
let _o2d;
try { _o2d = await K.api('landing.publish', { slug: cfg.slug, html, landing_id: cfg.id, title: cfg.name, app: true }); }
catch (e) { if (_o1i(e)) _o1p(e.message); else K.toast((e && e.message) || 'Chưa đăng được', 'warn'); return; }
try { await AP.workerCall(_o5, 'dang', { page: _o2d.slug, exec, id_token: _o26.id_token }); }
catch (e) { K.toast('Đã lưu trang trong máy chủ của anh/chị nhưng chưa bật được địa chỉ trang: ' + ((e && e.message) || 'lỗi') + ' Bấm đăng lại sau ít phút.', 'warn'); return; }
if (_o1w && _o1w !== _o2d.slug) {
const _o17 = cfg.published && cfg.published.gas && cfg.published.gas.slug;
try { if (_o17 !== _o1w) await K.api('landing.unpublish', { slug: _o1w }); await AP.workerCall(_o5, 'go', { page: _o1w, id_token: _o26.id_token }); } catch { }
}
cfg.published = { ...cfg.published, app: { slug: _o2d.slug, at: _o2d.at, url } };
_o2w(); _oq();
K.toast(_o1w ? 'Đã cập nhật trang – nơi khác thấy bản mới trong tối đa ' + AP.CACHE_MIN + ' phút' : 'Đã đăng trang lên địa chỉ app', 'ok');
}
async function appUnpublish() {
const slug = cfg.published && cfg.published.app && cfg.published.app.slug; if (!slug) return;
const ok = await K.confirm({ title: 'Gỡ trang', text: 'Gỡ trang khỏi địa chỉ app? Ai mở link sẽ thấy "Không tìm thấy trang" (chậm nhất ' + AP.CACHE_MIN + ' phút). Thiết kế và khách đã để lại số vẫn giữ nguyên.', ok: 'Gỡ trang', kind: 'danger', testid: 'lp-app-remove-confirm' });
if (!ok) return;
let _o2g;
try { _o2g = await _o6(slug); } catch (e) { K.toast((e && e.message) || 'Chưa gỡ được', 'warn'); return; }
const _o1y = { ...cfg.published }; delete _o1y.app; if (_o1y.gas && _o1y.gas.slug === slug) delete _o1y.gas; cfg.published = _o1y;
_o2w(); _oq();
K.toast(_o2g.worker ? 'Đã gỡ trang' : 'Đã gỡ trang trong máy chủ của anh/chị – link ngừng chạy chậm nhất sau ' + AP.CACHE_MIN + ' phút', 'ok');
}
function _o4() {
const _o27 = cfg.published && cfg.published.app;
const url = _o27 ? (_o27.url || AP.pageUrl(_o5, _o27.slug)) : AP.pageUrl(_o5, cfg.slug);
return h('div', { class: 'lb-app', 'data-testid': 'lp-app' },
h('h3', null, 'Cách 3 – Đăng lên địa chỉ app của tôi · khuyên dùng'),
h('p', { class: 'lb-muted' }, 'Một bấm là trang chạy ở địa chỉ app của anh/chị – không cần tài khoản Cloudflare, không kéo thả. Chia sẻ Facebook/Zalo hiện tiêu đề, mô tả, ảnh (ảnh chia sẻ dán qua link). Khách để lại số về thẳng máy chủ Google của anh/chị + Telegram như Xuất bản nhanh.'),
_om ? h('p', { class: 'lb-note' }, 'Đang xem thử: kết nối máy chủ Google ở Cài đặt › Kết nối rồi mới đăng trang thật được.') : null,
h('div', { class: 'lb-row' }, K.button(_o27 ? 'Cập nhật trang' : 'Đăng lên địa chỉ app của tôi', appPublish, { kind: 'primary', icon: _o27 ? 'refresh' : 'cloud', testid: 'lp-app-publish' })),
_o27 ? h('p', { class: 'lb-ok', 'data-testid': 'lp-app-status' }, '✅ Đã đăng ' + S.todayISO(new Date(_o27.at)).split('-').reverse().join('/') + (_o27.slug !== cfg.slug ? ' (đường dẫn cũ: ' + _o27.slug + ' – bấm Cập nhật trang)' : '') + '. Sửa xong bấm "Cập nhật trang"; nơi khác thấy bản mới trong tối đa ' + AP.CACHE_MIN + ' phút.') : null,
_o27 ? h('div', { class: 'lb-link' }, h('code', { 'data-testid': 'lp-app-url' }, url)) : h('p', { class: 'lb-muted' }, 'Địa chỉ sẽ là: ' + url),
_o27 ? h('div', { class: 'lb-row' },
K.button('Chép link', async () => { await K.copy(url); K.toast('Đã chép link', 'ok'); }, { kind: 'ghost', icon: 'copy', testid: 'lp-app-copy' }),
K.button('Mở trang', () => { try { window.open(url, '_blank', 'noopener'); } catch { } }, { kind: 'ghost', icon: 'external', testid: 'lp-app-open' }),
K.button('Gỡ trang', appUnpublish, { kind: 'ghost', icon: 'x', testid: 'lp-app-remove' })) : null,
_o27 ? h('p', { class: 'lb-muted' }, 'Link riêng từng sale: thêm ?s=<mã sale> vào cuối địa chỉ (mã ở danh sách trang → "Mã riêng từng sale"). Pixel quảng cáo đo kém chính xác hơn trên địa chỉ này – chạy quảng cáo nên dùng Cách 1 với tên miền riêng.') : null);
}
async function unpublish() {
const slug = cfg.published && cfg.published.gas && cfg.published.gas.slug; if (!slug) return;
try { await K.api('landing.unpublish', { slug }); } catch (e) { K.toast((e && e.message) || 'Chưa gỡ được', 'warn'); return; }
const _o1y = { ...cfg.published }; delete _o1y.gas; cfg.published = _o1y; _o2w(); _oq(); K.toast('Đã gỡ trang Xuất bản nhanh', 'ok');
}
function _oq() {
const gas = cfg.published && cfg.published.gas;
const gasUrl = gas ? (gas.url || L.gasPageUrl(serverUrl, gas.slug)) : '';
const ownUrl = L.normBaseUrl(cfg.seo.base_url) || ('https://' + cfg.slug + '.pages.dev/');
const _o1r = (label, url, testid) => h('div', { class: 'lb-link' }, h('b', null, label), h('code', { 'data-testid': testid }, url), K.button('Chép', async () => { await K.copy(url); K.toast('Đã chép link', 'ok'); }, { kind: 'ghost', icon: 'copy' }));
const others = [
h('h3', null, _o5 ? 'Cách 1 – Tải gói trang (.zip) · tên miền riêng' : 'Cách 1 – Tải gói trang (.zip) · khuyên dùng'),
h('p', { class: 'lb-muted' }, 'Trang tĩnh, nhanh, chạy ở tên miền con miễn phí <tên-trang>.pages.dev hoặc tên miền riêng. Anh/chị tự kéo thả lên Cloudflare Pages (tài khoản của mình, miễn phí) hoặc host bất kỳ.'),
h('div', { class: 'lb-row' }, K.button('⬇️ Tải gói trang (.zip)', exportZip, { kind: 'primary', testid: 'lp-zip' })),
h('details', null, h('summary', null, 'Hướng dẫn đưa lên mạng / gắn tên miền riêng'), h('pre', { 'data-testid': 'lp-guide' }, L.DEPLOY_GUIDE.replace(/\{slug\}/g, cfg.slug))),
_o1r('Địa chỉ sau khi đưa lên', ownUrl, 'lp-own-url'),
h('h3', null, 'Cách 2 – Xuất bản nhanh (máy chủ Google của anh/chị)'),
h('p', { class: 'lb-muted' }, 'Không cần Cloudflare: trang chạy ngay trên máy chủ Apps Script đã nối. Hạn chế: địa chỉ dài dạng script.google.com/…/exec?p=' + cfg.slug + ', Google hiện dải chữ "Ứng dụng do người dùng Google Apps Script tạo" ở đầu trang, tải chậm hơn (~1–3 giây), chia sẻ Facebook/Zalo không hiện ảnh xem trước, SEO và pixel quảng cáo kém chính xác. Hợp để chạy thử, gửi Zalo nhanh; quảng cáo/SEO nên dùng Cách 1.'),
_om ? h('p', { class: 'lb-note' }, 'Đang xem thử: trang lưu trong máy chủ giả, chưa có địa chỉ thật.') : null,
h('div', { class: 'lb-row' }, K.button(gas ? '🔄 Cập nhật trang xuất bản nhanh' : '⚡ Xuất bản nhanh', quickPublish, { kind: gas ? 'ghost' : 'primary', testid: 'lp-gas' }),
gas ? K.button('Gỡ trang', unpublish, { kind: 'ghost', testid: 'lp-gas-remove' }) : null),
gas ? h('p', { class: 'lb-ok', 'data-testid': 'lp-gas-status' }, '✅ Đã xuất bản nhanh ' + S.todayISO(new Date(gas.at)).split('-').reverse().join('/') + (gas.slug !== cfg.slug ? ' (đường dẫn cũ: ' + gas.slug + ' – bấm Cập nhật)' : '')) : null,
gasUrl ? _o1r('Địa chỉ xuất bản nhanh', gasUrl, 'lp-gas-url') : null,
h('h3', null, 'Link gắn nguồn'),
h('p', { class: 'lb-muted' }, 'Thêm vào cuối địa chỉ trang: ?v=<mã video>&utm_source=tiktok&utm_campaign=<chiến dịch> – khách để lại số sẽ ghi rõ đến từ video/kênh nào. ?s=<mã sale> – tự giao khách cho sale (mã ở danh sách trang).')].filter(Boolean);
const _og = _oh(L.checkLanding(cfg, dataFor(cfg), _o5 ? { server: serverUrl || (_om ? 'demo' : ''), mode: 'gas', images: Object.fromEntries([...mem.entries()]) } : { server: serverUrl, mode: 'zip', images: Object.fromEntries([...mem.entries()]) }));
if (_o5) _o28.replaceChildren(_og, _o4(), h('details', { class: 'lb-more', 'data-testid': 'lp-more' }, h('summary', null, 'Cách khác: tên miền riêng (.zip) · Xuất bản nhanh'), ...others));
else _o28.replaceChildren(_og, ...others);
}
_oq(); _o29 = true;
const _o25 = K.select([['', '— Không gắn dự án —'], ...env.projects.map((_o1y) => [_o1y.id, _o1y.name])], cfg.project_id, { 'data-testid': 'lp-project' });
_o25.addEventListener('change', async () => {
cfg.project_id = _o25.value;
const _o1y = env.project(_o25.value);
if (_o1y && await K.confirm({ title: 'Điền lại từ Bảng hàng', text: `Điền lại tiêu đề, vị trí, khoản vay, SEO theo "${_o1y.name}"? Nội dung khác giữ nguyên.`, ok: 'Điền lại', testid: 'lp-refill' })) {
const fresh = L.newLanding({ id: cfg.id, template: cfg.template, project: _o1y, profile, data: { plans: env.plansFor(_o1y).plans, cfg: env.cfg } });
cfg.s.hero = { ...fresh.s.hero, image: cfg.s.hero.image }; cfg.s.location = fresh.s.location; cfg.s.loan = fresh.s.loan; cfg.seo = { ...cfg.seo, title: fresh.seo.title, description: fresh.seo.description };
if (!cfg.samples.includes('location')) cfg.samples = [...cfg.samples, 'location'];
_or();
}
_o2w(); _oq();
});
const _o22 = (_o1m) => h('div', { class: 'lb-two' }, _oy(L.PIXEL_NAMES[_o1m], `pixels.${_o1m}.on`, 'lp-px-' + _o1m), _ox('Mã ID', `pixels.${_o1m}.id`, null, { max: 40, ph: _o1m === 'fb' ? '123456789012345' : _o1m === 'tiktok' ? 'C1ABCD2EFGH3IJ' : 'G-XXXXXXX' }));
const T = L.TEMPLATES[cfg.template];
const nameIn = _ox('Tên trang (chỉ trong app)', 'name', null, { max: 80 });
const ed = h('div', { class: 'lb-ed lb-hide' },
group('🧩 Mẫu & dự án', [h('p', null, `Mẫu: ${T.icon} ${T.title}`), nameIn, h('label', { class: 'lb-f' }, h('span', null, 'Dự án trong Bảng hàng'), _o25)], { open: true, testid: 'lp-g-base' }),
group('🎨 Màu & chữ', [_ox('Tên thương hiệu (thanh trên cùng)', 'brand.name', null, { max: 60 }), h('div', { class: 'lb-two' }, _ow('Màu chính', 'brand.c1'), _ow('Màu nhấn', 'brand.c2')),
(() => { const s = K.select([['serif', 'Sang trọng (chữ có chân)'], ['sans', 'Hiện đại (không chân)']], cfg.brand.font, { 'data-testid': 'lp-font' }); s.addEventListener('change', () => set('brand.font', s.value)); return h('label', { class: 'lb-f' }, h('span', null, 'Kiểu chữ tiêu đề'), s); })()]),
group('🧱 Các mục trên trang (bật/tắt, thứ tự, nội dung)', [_o2n], { testid: 'lp-g-sections' }),
group('📞 Liên hệ', [_ox('Họ tên', 'contact.name', null, { max: 80 }), _ox('Chức danh', 'contact.title', null, { max: 80 }), h('div', { class: 'lb-two' }, _ox('Số điện thoại', 'contact.phone', null, { type: 'tel', inputmode: 'tel', autocomplete: 'tel', max: 20 }), _ox('Số Zalo', 'contact.zalo', null, { type: 'tel', inputmode: 'tel', autocomplete: 'tel', max: 20 })),
_ox('Số chứng chỉ hành nghề', 'contact.cert', null, { max: 40 }), _ox('Nơi hành nghề (công ty)', 'contact.company', null, { max: 120 }), _o1g('Ảnh đại diện', 'contact.avatar')], { testid: 'lp-g-contact' }),
group('🔎 SEO & chia sẻ', [
_ox('Đường dẫn trang', 'slug', null, { max: 50, help: 'chữ thường không dấu, số, gạch nối – cũng là tên dự án Cloudflare Pages', on: () => _oq() }),
_ox('Tiêu đề (Google, Facebook)', 'seo.title', null, { max: 90, count: 70 }), _ox('Mô tả', 'seo.description', null, { area: true, max: 300, count: 160 }),
_ox('Địa chỉ trang (tên miền) – điền sau khi gắn', 'seo.base_url', null, { max: 200, ph: 'https://duan-abc.vn/', on: () => _oq() }),
_o1g('Ảnh khi chia sẻ (1200×630, ảnh tự chụp)', 'seo.og_image', { allowSample: false })], { testid: 'lp-g-seo' }),
group('📈 Đo lường quảng cáo (tắt sẵn)', [h('p', { class: 'lb-muted' }, 'Chỉ dán MÃ ID – app tự chèn đoạn mã chuẩn. Bật pixel = trang có thêm dòng thông báo đo lường trong chính sách dữ liệu. Không gửi họ tên/SĐT khách cho pixel.'), _o22('fb'), _o22('tiktok'), _o22('google')], { testid: 'lp-g-pixels' }),
group('🚀 Xuất bản', [_o28], { testid: 'lp-g-publish' }));
const tabs = h('div', { class: 'lb-tabs', role: 'tablist' });
const split = h('div', { class: 'lb-split' }, ed, _o2a);
let _o2u = 'edit';
const _os = () => {
tabs.replaceChildren(
h('button', { type: 'button', role: 'tab', class: _o2u === 'edit' ? 'on' : '', 'aria-selected': String(_o2u === 'edit'), 'data-testid': 'lp-tab-edit', onclick: () => { _o2u = 'edit'; _os(); } }, '✏️ Sửa'),
h('button', { type: 'button', role: 'tab', class: _o2u === 'view' ? 'on' : '', 'aria-selected': String(_o2u === 'view'), 'data-testid': 'lp-tab-view', onclick: () => { _o2u = 'view'; _os(); _o20(); } }, '👁️ Xem trước'));
ed.style.display = _o2u === 'edit' ? 'flex' : 'none';
_o2a.style.display = _o2u === 'view' ? 'flex' : 'none';
};
_o2i.replaceChildren(
h('div', { class: 'lb-row lb-sp' }, K.button('← Danh sách trang', async () => { clearTimeout(_o2m); await _o2l(cfg); if (_o2h) _o2h.disconnect(); _o1t(); }, { kind: 'ghost', testid: 'lp-back' }),
h('span', { class: 'lb-muted' }, 'Tự lưu')),
tabs, split);
_os();
_o1o();
}
}
export default {
manifest: {
id: 'landing_builder', title: 'Trình tạo landing', icon: '🌐', screen: 'customers', order: 50, version: '0.2.0', status: 'ready', pack: 'core',
help: 'Tạo trang landing theo 4 mẫu (dự án, ký gửi, sự kiện, trang cá nhân), tự điền từ Bảng hàng, xem trước điện thoại/máy tính; đăng lên địa chỉ app bằng 1 bấm, tải gói .zip hoặc Xuất bản nhanh; khách để lại số về app + Telegram, tự giao sale theo link riêng. Gói Cơ bản: 1 landing; Gói 3 · Tìm khách & Landing: không giới hạn.',
},
mount,
async selftest(ctx) {
const details = [];
try {
const env = await S.loadEnv(ctx || {});
const _o1y = env.projects.find(S.sellable);
if (!_o1y) details.push('Không có dự án mẫu đang bán');
for (const t of L.TEMPLATE_IDS) {
const { plans, policy } = env.plansFor(_o1y);
const cfg = L.newLanding({ id: 'selftest', template: t, project: _o1y, profile: { name: 'A', phone: '0912345678' }, data: { plans, cfg: env.cfg } });
const { html } = L.renderPage(cfg, { project: _o1y, plans, policy, projects: [_o1y], cfg: env.cfg }, { target: 'static' });
if (!/name="consent"/.test(html) || !/<\/html>/.test(html)) details.push('Mẫu ' + t + ' dựng thiếu');
}
if (R.lpPhone('+84 912 345 678') !== '0912345678') details.push('Chuẩn hoá SĐT sai');
} catch (e) { details.push('Lỗi: ' + (e && e.message)); }
return { ok: !details.length, details: details.join('; ') || 'Đạt' };
},
};

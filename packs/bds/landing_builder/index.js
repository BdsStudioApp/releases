import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as L from '../_lib/landing.js';
import * as R from '../_lib/landing_runtime.js';
import { projectGaps } from '../catalog/research_new_logic.js';
import { zipStore } from '../../../core/upgrade.4730f76a5c.js';
import { connectSection } from '../_lib/lead_connect_ui.js';
import * as AP from '../_lib/landing_app.js';
import { roleLabel } from '../../../core/users.be5fcb9ddb.js';
import { ADD_PHONE, askMyPhone } from '../_lib/my_phone.js';
import config from '../../../config.js';
const _o1 = 'bds.landing.view';
export const BASIC_MAX = 1;
export const LEADS_PACK = 'Gói 1 · Tìm khách & Landing';
export const ENABLE_TEXT = 'Bật ' + LEADS_PACK;
export const BASIC_MSG = 'Gói Cơ bản đăng được 1 landing. Muốn thêm trang: bật ' + LEADS_PACK + '.';
export const BASIC_ONLY_MSG = 'Gói Cơ bản đăng được 1 landing.';
export function planText(n, max = BASIC_MAX) {
return n > max ? n + ' trang, Gói Cơ bản đăng được ' + max + '.' : 'Gói Cơ bản: ' + n + '/' + max + ' landing.';
}
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
try { const _o2s = new CSSStyleSheet(); _o2s.replaceSync(_o0); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _o2s]; } catch { }
}
const mem = new Map();
let _ol = null;
function _o1c() {
if (_ol) return _ol;
_ol = new Promise((_o2h) => {
try {
const _o2e = indexedDB.open('bds-landing-img', 1);
_o2e.onupgradeneeded = () => _o2e.result.createObjectStore('img');
_o2e.onsuccess = () => _o2h(_o2e.result);
_o2e.onerror = () => _o2h(null);
} catch { _o2h(null); }
});
return _ol;
}
async function _o1f(id) {
if (mem.has(id)) return mem.get(id);
const _ok = await _o1c(); if (!_ok) return null;
return new Promise((_o2h) => { try { const _o2c = _ok.transaction('img').objectStore('img').get(id); _o2c.onsuccess = () => { if (_o2c.result) mem.set(id, _o2c.result); _o2h(_o2c.result || null); }; _o2c.onerror = () => _o2h(null); } catch { _o2h(null); } });
}
async function _o1h(id, _o2g) {
mem.set(id, _o2g);
const _ok = await _o1c(); if (!_ok) return;
await new Promise((_o2h) => { try { const _o2z = _ok.transaction('img', 'readwrite'); _o2z.objectStore('img').put(_o2g, id); _o2z.oncomplete = _o2h; _o2z.onerror = _o2h; } catch { _o2h(); } });
}
function _o2f(_oa) { return new Promise((_o2h, rej) => { const _o13 = new FileReader(); _o13.onload = () => _o2h(_o13.result); _o13.onerror = () => rej(_o13.error); _o13.readAsDataURL(_oa); }); }
async function _o2t(_oz) {
const url = URL.createObjectURL(_oz);
try {
const _o1d = await new Promise((_o2h, rej) => { const _o1b = new Image(); _o1b.onload = () => _o2h(_o1b); _o1b.onerror = () => rej(new Error('Không đọc được ảnh')); _o1b.src = url; });
const _o1m = Math.min(1, _o2 / Math.max(_o1d.naturalWidth, _o1d.naturalHeight));
const _oe = document.createElement('canvas'); _oe.width = Math.round(_o1d.naturalWidth * _o1m); _oe.height = Math.round(_o1d.naturalHeight * _o1m);
_oe.getContext('2d').drawImage(_o1d, 0, 0, _oe.width, _oe.height);
let _oa = await new Promise((_o2h) => _oe.toBlob(_o2h, 'image/webp', 0.82));
if (!_oa || _oa.type !== 'image/webp') _oa = await new Promise((_o2h) => _oe.toBlob(_o2h, 'image/jpeg', 0.85));
const mime = _oa.type || 'image/jpeg';
return { dataUrl: await _o2f(_oa), mime, ext: mime === 'image/webp' ? 'webp' : 'jpg', size: _oa.size };
} finally { URL.revokeObjectURL(url); }
}
const _o9 = (dataUrl) => { const _o8 = atob(String(dataUrl).split(',')[1] || ''); const _o1y = new Uint8Array(_o8.length); for (let _o1b = 0; _o1b < _o8.length; _o1b++) _o1y[_o1b] = _o8.charCodeAt(_o1b); return _o1y; };
async function _o24(cfg) { for (const _o34 of L.allImages(cfg)) if (_o34.img.kind === 'local') await _o1f(_o34.img.id); }
export async function mount(el, ctx) {
ensureCss();
S.ensureSalesCss();
const K = kit(ctx);
const _o2j = h('div', { class: 'lb', 'data-testid': 'landing-builder' });
el.innerHTML = '';
el.appendChild(_o2j);
const role = (ctx.user && ctx.user.role) || 'owner';
const _o1j = role === 'owner';
const api = ctx.api || {};
const serverUrl = api.mode === 'gas' && api.url ? String(api.url) : '';
const _om = api.mode === 'demo';
let env = await S.loadEnv(ctx);
const profile = await S.getProfile(ctx);
const _o20 = () => {
const all = (ctx.settings && typeof ctx.settings.all === 'function') ? ctx.settings.all() : {};
return Object.keys(all).filter((_o1m) => _o1m.startsWith(L.KEY_PREFIX)).map((_o1m) => L.normalizeLanding(all[_o1m])).filter((_oe) => _oe && _oe.id)
.sort((_o3, _o8) => (_o8.updated_at || 0) - (_o3.updated_at || 0));
};
const dataFor = (cfg) => {
const _o1z = env.project(cfg.project_id);
const { plans, policy } = env.plansFor(_o1z);
return { project: _o1z, plans, policy, projects: (cfg.projects || []).map((id) => env.project(id)).filter(Boolean), cfg: env.cfg, today: env.today };
};
const _o2m = (cfg) => K.setSetting(L.KEY_PREFIX + cfg.id, { ...cfg, updated_at: Date.now() });
const _o31 = () => !!(ctx.packs && typeof ctx.packs.enabled === 'function' && ctx.packs.enabled('leads'));
const _o7 = () => !_o31() && _o20().length >= BASIC_MAX;
const _o1p = () => !!(ctx.packs && typeof ctx.packs.def === 'function' && (ctx.packs.def('leads') || {}).hidden);
const _o5 = AP.appTarget(typeof location !== 'undefined' ? location.hostname : '', config);
function _o1q(text) {
const _o11 = _o20()[0];
const _o1v = K.modal({ title: 'Gói Cơ bản: 1 landing', testid: 'lp-limit', body: [
h('p', { 'data-testid': 'lp-limit-msg' }, _o1p() ? BASIC_ONLY_MSG : text || BASIC_MSG),
h('p', { class: 'lb-muted' }, 'Trang đang có vẫn sửa, đăng lại, gỡ được bình thường. Muốn làm trang khác: sửa trang đang có, hoặc xoá trang đó rồi tạo trang mới.'),
h('div', { class: 'lb-row' },
_o1p() ? null : K.button(ENABLE_TEXT, () => { _o1v.close(); K.nav('settings/packs'); }, { kind: 'primary', icon: 'puzzle', testid: 'lp-limit-enable' }),
_o11 ? K.button('Sửa trang đang có', () => { _o1v.close(); _ou(_o11); }, { kind: 'ghost', icon: '✏️', testid: 'lp-limit-edit' }) : null)] });
return _o1v;
}
const _o1i = (e) => !!e && (e.code === 'PACK_LIMIT');
async function _o6(slug) {
let _o27 = null;
try { _o27 = await K.api('landing.app_proof'); } catch { _o27 = null; }
await K.api('landing.unpublish', { slug });
if (!_o5 || !_o27) return { worker: false };
try { await AP.workerCall(_o5, 'go', { page: slug, id_token: _o27.id_token }); return { worker: true }; } catch { return { worker: false }; }
}
if (!_o1j) return _o1t();
const _o2d = S.hashParams();
const open = _o2d.get('id') && _o20().find((_oe) => _oe.id === _o2d.get('id'));
if (open) _ou(open); else _o1u();
return _o2j;
function _o1u() {
const list = _o20();
const _of = list.map((_oe) => {
const T = L.TEMPLATES[_oe.template];
const _o28 = _oe.published || {};
return h('div', { class: 'lb-card', 'data-testid': 'lp-card-' + _oe.id },
h('b', null, _oe.name || 'Trang chưa đặt tên'),
h('span', { class: 'lb-muted' }, `${T.icon} ${T.title} · /${_oe.slug}`),
h('span', { class: 'lb-muted' }, [_o28.app && _o28.app.at ? 'Đã đăng lên địa chỉ app ' + S.todayISO(new Date(_o28.app.at)).split('-').reverse().join('/') : '', _o28.gas && _o28.gas.at ? 'Xuất bản nhanh ' + S.todayISO(new Date(_o28.gas.at)).split('-').reverse().join('/') : '', _o28.zip && _o28.zip.at ? 'Tải .zip ' + S.todayISO(new Date(_o28.zip.at)).split('-').reverse().join('/') : ''].filter(Boolean).join(' · ') || 'Bản nháp'),
h('div', { class: 'lb-row' },
K.button('Sửa', () => _ou(_oe), { kind: 'primary', testid: 'lp-edit-' + _oe.id }),
K.button('Xoá', () => remove(_oe), { kind: 'ghost', testid: 'lp-del-' + _oe.id })));
});
_o2j.replaceChildren(
h('div', { class: 'lb-row lb-sp' }, h('h2', null, 'Trình tạo landing'), K.button('Tạo trang mới', () => (_o7() ? _o1q() : _oi()), { kind: 'primary', icon: 'plus', testid: 'lp-new' })),
_o31() ? null : h('div', { class: 'lb-row', 'data-testid': 'lp-plan-row' }, h('p', { class: 'lb-muted', 'data-testid': 'lp-plan' }, planText(list.length) + (_o1p() ? '' : ' Thêm trang: bật ' + LEADS_PACK + '.')),
_o1p() ? null : K.button('Mở Gói chức năng', () => K.nav('settings/packs'), { kind: 'ghost', small: true, icon: 'puzzle', testid: 'lp-plan-enable' })),
h('p', { class: 'lb-muted' }, 'Trang giới thiệu dự án / căn ký gửi / sự kiện / trang cá nhân: tự điền từ Bảng hàng, khách để lại số là về thẳng app của anh/chị (máy chủ Google riêng) + báo Telegram.'),
h('div', { class: 'lb-note' }, 'Thông tin dự án trên trang do anh/chị chịu trách nhiệm: kiểm tra giá, chính sách, pháp lý với tài liệu của chủ đầu tư trước khi xuất bản. Ảnh mẫu là ảnh minh hoạ trung tính – nên thay bằng ảnh tự chụp.'),
list.length ? h('div', { class: 'lb-cards' }, _of) : K.empty('Chưa có trang nào. Bấm "Tạo trang mới".'),
ctx.solo ? null : _o2l(),
connectSection(ctx, K, { org: profile && (profile.company || profile.name) }));
}
async function remove(_oe) {
const ok = await K.confirm({ title: 'Xoá trang', text: `Xoá trang "${_oe.name}"? Trang Xuất bản nhanh (nếu có) cũng được gỡ. Khách đã để lại số vẫn giữ nguyên.`, ok: 'Xoá', kind: 'danger', testid: 'lp-del-confirm' });
if (!ok) return;
if (_oe.published && _oe.published.gas && _oe.published.gas.slug) { try { await K.api('landing.unpublish', { slug: _oe.published.gas.slug }); } catch { } }
if (_oe.published && _oe.published.app && _oe.published.app.slug) await _o6(_oe.published.app.slug).catch(() => null);
await K.setSetting(L.KEY_PREFIX + _oe.id, null);
K.toast('Đã xoá trang', 'ok');
_o1u();
}
function _oi() {
let _o2y = 'project';
const tplBox = h('div', { class: 'lb-tpl', role: 'radiogroup' });
const _ot = () => tplBox.replaceChildren(...L.TEMPLATE_IDS.map((id) => {
const T = L.TEMPLATES[id];
return h('button', { type: 'button', class: _o2y === id ? 'on' : '', role: 'radio', 'aria-checked': String(_o2y === id), 'data-testid': 'lp-tpl-' + id, onclick: () => { _o2y = id; _ot(); } },
h('b', null, T.icon + ' ' + T.title), h('div', { class: 'lb-muted' }, T.desc));
}));
_ot();
const _o2r = K.select([['', '— Không gắn dự án —'], ...env.projects.map((_o1z) => [_o1z.id, _o1z.name + (_o1z.price ? ' · ' + L.priceLabel(_o1z) : '')])], (env.projects.find(S.sellable) || {}).id || '', { 'data-testid': 'lp-new-project' });
const gapBox = h('div', { 'aria-live': 'polite' });
const _o18 = (hash) => { _o1v.close(); K.nav(hash); };
const _op = () => {
const _o1z = env.project(_o2r.value);
const _od = h('div', { class: 'lb-row' },
K.button(_o1z ? '🏢 Mở dự án trong Bảng hàng' : '🏢 Mở Bảng hàng', () => _o18(_o1z ? '#/sales/catalog?open=' + encodeURIComponent(_o1z.id) : '#/sales/catalog'), { testid: 'lp-new-open-catalog' }));
if (!_o1z) { gapBox.replaceChildren(_od); return; }
const { plans, policy } = env.plansFor(_o1z);
const _o16 = projectGaps(_o1z, { policy, plans, staleDays: policy ? S.staleDays(policy) : 0 });
gapBox.replaceChildren(_o16.length
? h('div', { class: 'lb-gap', role: 'status', 'data-testid': 'lp-new-gaps', 'data-gaps': _o16.map((_o15) => _o15.key).join(' ') },
`⚠️ "${_o1z.name}" trong Bảng hàng còn thiếu: ${_o16.map((_o15) => _o15.label).join('; ')}. Trang sẽ thiếu hoặc ẩn các mục này – nên cập nhật dự án trước khi tạo trang.`)
: h('div', { class: 'lb-okl', 'data-testid': 'lp-new-gaps', 'data-gaps': '' }, `✓ "${_o1z.name}" đã có giá, loại căn, chính sách đang áp dụng và vị trí trong Bảng hàng.`), _od);
};
_o2r.addEventListener('change', _op);
const _o1v = K.modal({
title: 'Tạo trang mới', testid: 'lp-new-modal', wide: true,
body: [h('h3', null, '1. Chọn mẫu'), tplBox, h('label', { class: 'lb-f' }, h('span', null, '2. Dự án trong Bảng hàng (tự điền giá, chính sách, vị trí)'), _o2r),
h('p', { class: 'lb-note', 'data-testid': 'lp-new-catalog-note' }, 'Trang lấy giá, chính sách, vị trí, loại căn ĐÚNG như trong Bảng hàng. Để thông tin trên trang chuẩn, anh/chị thêm hoặc cập nhật dự án ở Bảng hàng (gõ tên dự án mới vào ô tìm để thêm; mở dự án → "AI tìm thông tin" / "Sửa thông tin"; chính sách ở "Cập nhật chính sách") rồi mới tạo trang.'),
gapBox,
h('div', { class: 'lb-row' }, K.button('Tạo trang', async () => {
if (_o7()) { _o1v.close(); _o1q(); return; }
const _o1z = env.project(_o2r.value);
const { plans } = env.plansFor(_o1z);
const cfg = L.newLanding({ id: K.newId(), template: _o2y, project: _o1z, profile, data: { plans, cfg: env.cfg } });
await _o2m(cfg);
_o1v.close();
_ou(cfg);
}, { kind: 'primary', testid: 'lp-new-create' }))]
});
_op();
}
function _o2l() {
const _oc = h('div', { class: 'lb-card', 'data-testid': 'lp-sale-codes' }, h('h3', null, 'Mã riêng từng sale'), h('span', { class: 'lb-muted' }, 'Đang tải…'));
K.api('landing.sale_codes').then((list) => {
_oc.replaceChildren(h('h3', null, 'Mã riêng từng sale'),
h('p', { class: 'lb-muted' }, 'Thêm ?s=<mã> vào cuối địa chỉ trang → khách để lại số qua link đó tự giao cho sale đó (Telegram báo cả Quản trị và sale). Sale xem link của mình trong mục này trên máy của họ.'),
h('div', { class: 'lb-links' }, (list || []).map((_o30) => h('div', { class: 'lb-link' }, h('b', null, _o30.full_name || _o30.username), h('span', { class: 'lb-muted' }, roleLabel(_o30.role)), h('code', { 'data-testid': 'lp-code-' + _o30.username }, 's=' + _o30.code)))));
}).catch(() => _oc.replaceChildren(h('h3', null, 'Mã riêng từng sale'), h('p', { class: 'lb-muted' }, 'Máy chủ chưa có chức năng này – cần cập nhật máy chủ.')));
return _oc;
}
async function _o1t() {
_o2j.replaceChildren(h('h2', null, 'Link riêng của tôi'), h('p', { class: 'lb-muted' }, 'Đang tải…'));
let code = '', list = [];
try { code = (await K.api('landing.my_code')).code; list = await K.api('landing.published'); } catch { _o2j.replaceChildren(h('h2', null, 'Link riêng của tôi'), K.empty('Máy chủ chưa có chức năng này – cần cập nhật máy chủ.')); return; }
const url = (_o34) => (_o34.app && _o5 ? AP.pageUrl(_o5, _o34.slug) : '') || _o34.url || L.gasPageUrl(serverUrl, _o34.slug);
_o2j.replaceChildren(
h('h2', null, 'Link riêng của tôi'),
h('p', { class: 'lb-muted' }, 'Gửi link này cho khách / gắn vào bài đăng: khách để lại số qua link này tự giao cho anh/chị, Telegram báo ngay.'),
h('div', { class: 'lb-card' }, h('span', null, 'Mã của tôi: ', h('b', { 'data-testid': 'lp-my-code' }, code)),
h('span', { class: 'lb-muted' }, 'Trang đặt ở tên miền riêng: thêm ?s=' + code + ' vào cuối địa chỉ trang.')),
list.length ? h('div', { class: 'lb-links' }, list.map((_o34) => {
const _o1r = L.saleLink(url(_o34), code);
return h('div', { class: 'lb-link' }, h('b', null, _o34.title || _o34.slug), h('code', null, _o1r || '(xem thử – chưa có địa chỉ thật)'), _o1r ? K.button('Chép', async () => { await K.copy(_o1r); K.toast('Đã chép link', 'ok'); }, { kind: 'ghost', icon: 'copy' }) : null);
})) : K.empty('Chưa có trang nào được Xuất bản nhanh.'));
if (role === 'manager') _o2j.appendChild(connectSection(ctx, K, { org: profile && (profile.company || profile.name) }));
}
async function _ou(start) {
let cfg = L.normalizeLanding(start);
await _o24(cfg);
let _o2n = 0, paintT = 0;
let _on = 'phone';
try { const v = localStorage.getItem(_o1); if (v === 'desk') _on = 'desk'; } catch { }
const _o2x = (section) => {
if (section && (cfg.samples || []).includes(section)) cfg = L.clearSample(cfg, section);
clearTimeout(_o2n); _o2n = setTimeout(() => _o2m(cfg), 600);
clearTimeout(paintT); paintT = setTimeout(() => { _o21(); if (_o2a) _oq(); }, 200);
};
let _o2a = false;
const set = (path, v, section) => { const _o1n = path.split('.'); let o = cfg; for (let _o1b = 0; _o1b < _o1n.length - 1; _o1b++) o = o[_o1n[_o1b]]; o[_o1n.at(-1)] = v; _o2x(section); };
const get = (path) => path.split('.').reduce((o, _o1m) => (o == null ? o : o[_o1m]), cfg);
const _o14 = h('iframe', { title: 'Xem trước trang', 'data-testid': 'lp-frame' });
const stage = h('div', { class: 'lb-stage' });
const _o2q = (id, label) => h('button', { type: 'button', class: _on === id ? 'on' : '', 'data-testid': 'lp-view-' + id, onclick: () => { _on = id; try { localStorage.setItem(_o1, id); } catch { } _o1o(); } }, label);
const _o2p = h('div', { class: 'lb-seg' });
const _o2b = h('div', { class: 'lb-pv lb-hide' }, h('div', { class: 'lb-row lb-sp' }, h('h3', null, 'Xem trước'), _o2p), stage,
h('p', { class: 'lb-muted' }, 'Bản xem trước: bấm Gửi trên form = gửi thử vào app (khách có nhãn "thử"). Ảnh dán link chỉ hiện ở trang thật.'));
let _o2i = null;
const _oc = h('div', { class: 'lb-phone' }, _o14);
stage.replaceChildren(_oc);
let _o22 = null;
function _o1o() {
_o2p.replaceChildren(_o2q('phone', '📱 Điện thoại'), _o2q('desk', '🖥️ Máy tính'));
if (_o2i) { _o2i.disconnect(); _o2i = null; }
if (_on === 'phone') { _oc.className = 'lb-phone'; _oc.style.height = ''; _o14.style.transform = ''; }
else {
_oc.className = 'lb-desk';
const _o12 = () => { const _o33 = _oc.clientWidth || 600; const _o1m = Math.min(1, _o33 / 1280); _o14.style.transform = `scale(${_o1m})`; _oc.style.height = Math.round(800 * _o1m) + 'px'; };
_o12();
if (typeof ResizeObserver !== 'undefined') { _o2i = new ResizeObserver(_o12); _o2i.observe(_oc); }
}
_o21();
}
function _o21() {
if (!_o14.isConnected) return;
const data = dataFor(cfg);
const { html, css, cfgJson } = L.renderPage(cfg, data, { target: 'preview', imgSrc: (_o1d) => (mem.get(_o1d.id) || {}).dataUrl || '' });
const _o2u = html + '\u0000' + css + '\u0000' + cfgJson;
if (_o22 === _o2u) return;
_o22 = _o2u;
let _o35 = 0;
try { _o35 = _o14.contentWindow ? _o14.contentWindow.scrollY : 0; } catch { _o35 = 0; }
_o14.onload = () => {
const _o33 = _o14.contentWindow, d = _o14.contentDocument;
if (!_o33 || !d) return;
try { const _o2s = new _o33.CSSStyleSheet(); _o2s.replaceSync(css); d.adoptedStyleSheets = [_o2s]; } catch { }
try {
R.lpBoot(_o33, d, cfgJson, { preview: true, notify: (t) => K.toast(t), send: (_o1z) => K.api('landing.lead', _o1z).then((_o2e) => { K.toast('Đã gửi thử – khách nằm trong danh sách Khách hàng (nhãn "thử")', 'ok'); return _o2e; }) });
} catch (e) { ctx.errors && ctx.errors.report && ctx.errors.report('warn', 'landing.preview', String(e && e.message || e)); }
try { _o33.scrollTo(0, _o35); } catch { }
_o14.dataset.ready = String(Date.now());
};
_o14.srcdoc = html;
}
const _ox = (label, path, section, o = {}) => {
const inp = h(o.area ? 'textarea' : 'input', { type: o.type || 'text', value: get(path) ?? '', maxlength: o.max || (o.area ? 2000 : 200), placeholder: o.ph || '', 'data-testid': 'lp-f-' + path.replace(/\./g, '-'), inputmode: o.inputmode, autocomplete: o.autocomplete });
if (o.area) inp.value = get(path) ?? '';
const _o1a = o.count ? h('small', null) : (o.help ? h('small', null, o.help) : null);
const _o32 = () => { if (o.count) _o1a.textContent = `${inp.value.length}/${o.count} ký tự` + (o.help ? ' · ' + o.help : ''); };
inp.addEventListener('input', () => { set(path, o.num ? Number(String(inp.value).replace(',', '.')) || 0 : inp.value, section); _o32(); if (o.on) o.on(inp.value); });
_o32();
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
const _o2g = await _o2t(_ov);
const id = 'i' + K.newId().slice(-10);
await _o1h(id, _o2g);
set(path, { kind: 'local', id, name: String(_ov.name || '').slice(0, 80) });
_oo();
K.toast('Đã thêm ảnh (' + Math.round(_o2g.size / 1024) + ' KB) – ảnh lưu trên máy này', 'ok');
} catch (e) { K.toast('Không đọc được ảnh: ' + (e && e.message || ''), 'warn'); }
_oz.value = '';
});
function _oo() {
const _o1d = get(path);
let _o2w;
if (!_o1d) _o2w = h('div', { class: 'lb-thumb' }, 'Chưa có ảnh');
else if (_o1d.kind === 'local' && mem.get(_o1d.id)) _o2w = h('div', { class: 'lb-thumb' }, h('img', { src: mem.get(_o1d.id).dataUrl, alt: '' }));
else if (_o1d.kind === 'local') _o2w = h('div', { class: 'lb-thumb' }, 'Ảnh ở máy khác');
else if (_o1d.kind === 'url') _o2w = h('div', { class: 'lb-thumb', title: _o1d.url }, '🔗 Ảnh từ link');
else _o2w = h('div', { class: 'lb-thumb' }, h('img', { src: L.sampleSvg(_o1d.seed, (env.project(cfg.project_id) || {}).hue, _o1d.look || 'city'), alt: '' }), h('span', { class: 'lb-mau' }, 'Mẫu'));
_oc.replaceChildren(_o2w, h('div', { class: 'lb-row' },
K.button('Tải ảnh lên', () => _oz.click(), { kind: 'ghost' }),
K.button('Dán link', () => {
const inp = h('input', { type: 'url', value: _o1d && _o1d.kind === 'url' ? _o1d.url : '', placeholder: 'https://…', 'data-testid': 'lp-url-input' });
const err = h('p', { class: 'sl-bad', role: 'alert' });
const _o1v = K.modal({ title: 'Ảnh từ đường link', testid: 'lp-url-modal', body: [
h('p', { class: 'lb-muted' }, 'Ảnh trên Google Drive: bấm Chia sẻ → "Bất kỳ ai có đường liên kết" → Sao chép đường liên kết rồi dán vào đây. Link https khác cũng dùng được.'),
h('label', { class: 'lb-f' }, h('span', null, 'Link ảnh'), inp), err,
h('div', { class: 'lb-row' }, K.button('Dùng ảnh này', () => {
const _o30 = L.imageUrl(inp.value);
if (!_o30) { err.textContent = 'Link ảnh phải bắt đầu bằng https://'; return; }
set(path, { kind: 'url', url: _o30 }); _oo(); _o1v.close();
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
price: () => [h('p', { class: 'lb-muted' }, _o25()), _ox('Ghi chú thêm', 's.price.note', null, { max: 300 })],
policy: () => [h('p', { class: 'lb-muted' }, 'Lấy từ chính sách đang áp dụng trong Bảng hàng (Cập nhật chính sách).'), _ox('Ghi chú thêm', 's.policy.note', null, { max: 300 })],
loan: () => [h('div', { class: 'lb-two' }, _ox('Giá căn (tỷ)', 's.loan.price', null, { type: 'number', num: true, inputmode: 'decimal' }), _ox('Vay (% giá)', 's.loan.ltv', null, { type: 'number', num: true }), _ox('Lãi suất (%/năm)', 's.loan.rate', null, { type: 'number', num: true, inputmode: 'decimal' }), _ox('Thời hạn (năm)', 's.loan.years', null, { type: 'number', num: true }))],
gallery: () => {
const _oc = h('div');
const _oo = () => {
const imgs = cfg.s.gallery.images || [];
_oc.replaceChildren(...imgs.map((_, _o1b) => h('div', null, _o1g('Ảnh ' + (_o1b + 1), 's.gallery.images.' + _o1b), K.button('Bỏ ảnh ' + (_o1b + 1), () => { cfg.s.gallery.images.splice(_o1b, 1); _o2x(); _oo(); }, { kind: 'ghost' }))),
imgs.length < 9 ? K.button('＋ Thêm ảnh', () => { cfg.s.gallery.images.push({ kind: 'sample', seed: 'g' + Date.now().toString(36), look: 'city' }); _o2x(); _oo(); }, { kind: 'ghost', testid: 'lp-gal-add' }) : null);
};
_oo();
return [_oc];
},
form: () => [h('p', { class: 'lb-note' }, 'Ô "Tôi đồng ý…" (đồng ý lưu dữ liệu cá nhân – theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15) luôn có và bắt buộc tick – không tắt được.'), _ox('Tiêu đề form', 's.form.heading'), _ox('Dòng giải thích', 's.form.sub', null, { max: 200 }), _ox('Chữ trên nút gửi', 's.form.button', null, { max: 40 }), _oy('Hỏi thêm loại căn / nhu cầu / số người', 's.form.interest', 'lp-f-form-interest')],
contact: () => [h('p', { class: 'lb-muted' }, 'Nút Zalo + Gọi dính cuối màn hình điện thoại. Số lấy ở nhóm "Liên hệ".')],
doc: () => [h('p', { class: 'lb-note', 'data-testid': 'lp-doc-note' }, 'Dành cho trang landing dự án: khách để lại số Zalo trên trang mới nhận tài liệu (mặt bằng, bảng giá, brochure).'
+ (_o1p() ? '' : ' Muốn đếm khách nhận từng tài liệu: dùng mục "Tài liệu đổi số Zalo (landing dự án)" (Gói 1 · Tìm khách & Landing).')),
_ox('Tên tài liệu', 's.doc.title', 'doc', { max: 160 }), _ox('Mô tả', 's.doc.desc', 'doc', { max: 200 }), _ox('Chữ trên nút', 's.doc.button', 'doc', { max: 40 }),
_ox('Link tài liệu (tuỳ chọn, https://…)', 's.doc.url', 'doc', { help: 'Hiện sau khi khách gửi số. Link nằm trong mã trang – tài liệu nhạy cảm thì để trống, chuyên viên gửi qua Zalo.' })],
facts: () => [_ox('Thông tin căn – mỗi dòng "Tên: giá trị"', 's.facts.items', 'facts', { area: true })],
event: () => [h('div', { class: 'lb-two' }, _ox('Ngày', 's.event.date', 'event', { type: 'date' }), _ox('Giờ', 's.event.time', 'event', { type: 'time' })), _ox('Địa điểm', 's.event.place', 'event', { area: true, max: 300 }), _ox('Chương trình – mỗi dòng 1 mục', 's.event.agenda', 'event', { area: true })],
agent: () => [_ox('Giới thiệu', 's.agent.bio', 'agent', { area: true }), _ox('Điểm mạnh – mỗi dòng 1 ý', 's.agent.bullets', 'agent', { area: true })],
projects: () => [h('div', { class: 'lb-col' }, env.projects.map((_o1z) => {
const cb = h('input', { type: 'checkbox', checked: cfg.projects.includes(_o1z.id), 'data-testid': 'lp-proj-' + _o1z.id });
cb.addEventListener('change', () => { cfg.projects = cb.checked ? [...new Set([...cfg.projects, _o1z.id])].slice(0, 12) : cfg.projects.filter((_o34) => _o34 !== _o1z.id); _o2x(); });
return h('label', { class: 'lb-sw' }, cb, h('span', null, _o1z.name));
}))]
};
function _o25() {
const d = dataFor(cfg);
const _o2k = L.priceRows(d.project, d.plans);
if (!d.project) return 'Chưa gắn dự án – chọn dự án ở nhóm "Mẫu & dự án".';
return _o2k.length ? `Lấy tự động từ Bảng hàng: ${d.project.name} · ${L.priceLabel(d.project)} · ${d.policy ? S.policyLabel(d.policy) : 'Giá tham khảo'} (${_o2k.length} loại căn).` : 'Dự án chưa có giá trong Bảng hàng – mục này sẽ ẩn trên trang.';
}
const _o2o = h('div', { class: 'lb-ed' });
function _or() {
_o2o.replaceChildren(...cfg.order.map((id, _o1b) => {
const cb = h('input', { type: 'checkbox', checked: !!cfg.on[id], disabled: id === 'hero', 'aria-label': 'Bật ' + L.SECTIONS[id], 'data-testid': 'lp-on-' + id });
cb.addEventListener('change', () => { cfg.on[id] = cb.checked; _o2x(); });
const _o1w = (d) => { const _o1k = _o1b + d; if (_o1k < 1 || _o1k >= cfg.order.length || _o1b === 0) return; const o = cfg.order.slice(); [o[_o1b], o[_o1k]] = [o[_o1k], o[_o1b]]; cfg.order = o; _o2x(); _or(); };
const _o19 = h('div', { class: 'lb-sec' }, h('label', { class: 'lb-sw' }, cb), h('span', { class: 'lb-t' }, L.SECTIONS[id]),
(cfg.samples || []).includes(id) ? h('span', { class: 'lb-mau', 'data-testid': 'lp-mau-' + id }, 'Mẫu') : null,
_o1b > 0 ? h('button', { type: 'button', class: 'lb-ic', 'aria-label': 'Đưa lên', disabled: _o1b < 2, title: _o1b < 2 ? 'Mục đầu trang (ảnh bìa) đứng yên' : 'Đưa lên', onclick: (e) => { e.preventDefault(); _o1w(-1); } }, K.icon('up', 18) || '↑') : null,
_o1b > 0 ? h('button', { type: 'button', class: 'lb-ic', 'aria-label': 'Đưa xuống', disabled: _o1b >= cfg.order.length - 1, title: _o1b >= cfg.order.length - 1 ? 'Đã ở cuối trang' : 'Đưa xuống', onclick: (e) => { e.preventDefault(); _o1w(1); } }, K.icon('down', 18) || '↓') : null);
const d = h('details', { 'data-testid': 'lp-sec-' + id }, h('summary', null, _o19));
let _o10 = false;
d.addEventListener('toggle', () => { if (d.open && !_o10) { _o10 = true; d.append(...sectionFields[id]()); } });
return d;
}));
}
_or();
const _o29 = h('div', { 'data-testid': 'lp-publish' });
const _o1e = async () => {
const _o1y = {};
for (const _o34 of L.allImages(cfg)) if (_o34.img.kind === 'local') { const _o2e = await _o1f(_o34.img.id); if (_o2e) _o1y[_o34.img.id] = _o2e; }
return _o1y;
};
const _o1l = async (fix, close) => {
if (close) close();
const _o15 = fix.group && _o2j.querySelector('[data-testid="' + fix.group + '"]');
if (_o15 && !_o15.open) _o15.open = true;
if (fix.sec) { const d = _o2j.querySelector('[data-testid="lp-sec-' + fix.sec + '"]'); if (d && !d.open) { d.open = true; d.dispatchEvent(new Event('toggle')); } }
await new Promise((_o2e) => setTimeout(_o2e, 30));
const el = (fix.field && _o2j.querySelector('[data-testid="' + fix.field + '"]')) || (fix.sec && _o2j.querySelector('[data-testid="lp-sec-' + fix.sec + '"]')) || _o15;
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
for (const [id, _o2e] of Object.entries(imgs)) images[id] = { bytes: _o9(_o2e.dataUrl), ext: _o2e.ext };
const { files } = L.exportFiles(cfg, dataFor(cfg), { server: serverUrl, images });
const bytes = zipStore(files.map((_ov) => ({ name: cfg.slug + '/' + _ov.name, data: _ov.data })));
const _oa = new Blob([bytes], { type: 'application/zip' });
const _o3 = document.createElement('a'); _o3.href = URL.createObjectURL(_oa); _o3.download = cfg.slug + '.zip'; _o3.rel = 'noopener';
document.body.appendChild(_o3); _o3.click(); _o3.remove(); setTimeout(() => URL.revokeObjectURL(_o3.href), 4000);
cfg.published = { ...cfg.published, zip: { at: Date.now() } }; _o2x();
K.toast('Đã tải ' + cfg.slug + '.zip – làm theo hướng dẫn trong tệp HUONG_DAN_DUA_LEN_MANG.txt', 'ok');
}
async function quickPublish() {
const imgs = await _o1e();
const _og = L.checkLanding(cfg, dataFor(cfg), { server: serverUrl || (_om ? 'demo' : ''), mode: 'gas', images: imgs });
if (_og.some((_oe) => _oe.level === 'error')) { const _ob = K.modal({ title: 'Chưa xuất bản được', body: _oh(_og, () => _ob.close()), testid: 'lp-gas-blocked' }); return; }
const dataUrls = {}; for (const [id, _o2e] of Object.entries(imgs)) dataUrls[id] = _o2e.dataUrl;
const html = L.gasHtml(cfg, dataFor(cfg), { server: serverUrl, dataUrls });
try {
const _o1x = cfg.published && cfg.published.gas && cfg.published.gas.slug;
const _o2e = await K.api('landing.publish', { slug: cfg.slug, html, landing_id: cfg.id, title: cfg.name });
if (_o1x && _o1x !== cfg.slug) { try { await K.api('landing.unpublish', { slug: _o1x }); } catch { } }
cfg.published = { ...cfg.published, gas: { slug: _o2e.slug, at: _o2e.at, url: _o2e.url || L.gasPageUrl(serverUrl, _o2e.slug) } };
_o2x(); _oq();
K.toast('Đã xuất bản nhanh', 'ok');
} catch (e) { if (_o1i(e)) _o1q(e.message); else K.toast((e && e.message) || 'Chưa xuất bản được', 'warn'); }
}
async function appPublish() {
if (!_o5) return;
if (!AP.validPage(cfg.slug)) { K.toast('Đường dẫn trang chỉ gồm chữ thường không dấu, số và dấu gạch nối (3–50 ký tự) – sửa ở mục SEO.', 'warn'); return; }
const imgs = await _o1e();
const _og = L.checkLanding(cfg, dataFor(cfg), { server: serverUrl || (_om ? 'demo' : ''), mode: 'gas', images: imgs });
if (_og.some((_oe) => _oe.level === 'error')) { const _ob = K.modal({ title: 'Chưa đăng được', body: _oh(_og, () => _ob.close()), testid: 'lp-app-blocked' }); return; }
let _o27;
try { _o27 = await K.api('landing.app_proof'); } catch (e) { K.toast((e && e.message) || 'Máy chủ chưa hỗ trợ – cập nhật máy chủ rồi thử lại.', 'warn'); return; }
const exec = AP.EXEC_RE.test(String(_o27.exec || '')) ? _o27.exec : (AP.EXEC_RE.test(serverUrl) ? serverUrl : '');
if (!exec) { K.toast('Chưa nối máy chủ Google thật (đang xem thử) – kết nối máy chủ ở Cài đặt › Kết nối rồi đăng.', 'warn'); return; }
const url = AP.pageUrl(_o5, cfg.slug);
const dataUrls = {}; for (const [id, _o2e] of Object.entries(imgs)) dataUrls[id] = _o2e.dataUrl;
const html = L.appHtml(cfg, dataFor(cfg), { server: exec, dataUrls, pageUrl: url });
const _o1x = cfg.published && cfg.published.app && cfg.published.app.slug;
let _o2e;
try { _o2e = await K.api('landing.publish', { slug: cfg.slug, html, landing_id: cfg.id, title: cfg.name, app: true }); }
catch (e) { if (_o1i(e)) _o1q(e.message); else K.toast((e && e.message) || 'Chưa đăng được', 'warn'); return; }
try { await AP.workerCall(_o5, 'dang', { page: _o2e.slug, exec, id_token: _o27.id_token }); }
catch (e) { K.toast('Đã lưu trang trong máy chủ của anh/chị nhưng chưa bật được địa chỉ trang: ' + ((e && e.message) || 'lỗi') + ' Bấm đăng lại sau ít phút.', 'warn'); return; }
if (_o1x && _o1x !== _o2e.slug) {
const _o17 = cfg.published && cfg.published.gas && cfg.published.gas.slug;
try { if (_o17 !== _o1x) await K.api('landing.unpublish', { slug: _o1x }); await AP.workerCall(_o5, 'go', { page: _o1x, id_token: _o27.id_token }); } catch { }
}
cfg.published = { ...cfg.published, app: { slug: _o2e.slug, at: _o2e.at, url } };
_o2x(); _oq();
K.toast(_o1x ? 'Đã cập nhật trang – nơi khác thấy bản mới trong tối đa ' + AP.CACHE_MIN + ' phút' : 'Đã đăng trang lên địa chỉ app', 'ok');
}
async function appUnpublish() {
const slug = cfg.published && cfg.published.app && cfg.published.app.slug; if (!slug) return;
const ok = await K.confirm({ title: 'Gỡ trang', text: 'Gỡ trang khỏi địa chỉ app? Ai mở link sẽ thấy "Không tìm thấy trang" (chậm nhất ' + AP.CACHE_MIN + ' phút). Thiết kế và khách đã để lại số vẫn giữ nguyên.', ok: 'Gỡ trang', kind: 'danger', testid: 'lp-app-remove-confirm' });
if (!ok) return;
let _o2h;
try { _o2h = await _o6(slug); } catch (e) { K.toast((e && e.message) || 'Chưa gỡ được', 'warn'); return; }
const _o1z = { ...cfg.published }; delete _o1z.app; if (_o1z.gas && _o1z.gas.slug === slug) delete _o1z.gas; cfg.published = _o1z;
_o2x(); _oq();
K.toast(_o2h.worker ? 'Đã gỡ trang' : 'Đã gỡ trang trong máy chủ của anh/chị – link ngừng chạy chậm nhất sau ' + AP.CACHE_MIN + ' phút', 'ok');
}
function _o4() {
const _o28 = cfg.published && cfg.published.app;
const url = _o28 ? (_o28.url || AP.pageUrl(_o5, _o28.slug)) : AP.pageUrl(_o5, cfg.slug);
return h('div', { class: 'lb-app', 'data-testid': 'lp-app' },
h('h3', null, 'Cách 3 – Đăng lên địa chỉ app của tôi · khuyên dùng'),
h('p', { class: 'lb-muted' }, 'Một bấm là trang chạy ở địa chỉ app của anh/chị – không cần tài khoản Cloudflare, không kéo thả. Chia sẻ Facebook/Zalo hiện tiêu đề, mô tả, ảnh (ảnh chia sẻ dán qua link). Khách để lại số về thẳng máy chủ Google của anh/chị + Telegram như Xuất bản nhanh.'),
_om ? h('p', { class: 'lb-note' }, 'Đang xem thử: kết nối máy chủ Google ở Cài đặt › Kết nối rồi mới đăng trang thật được.') : null,
h('div', { class: 'lb-row' }, K.button(_o28 ? 'Cập nhật trang' : 'Đăng lên địa chỉ app của tôi', appPublish, { kind: 'primary', icon: _o28 ? 'refresh' : 'cloud', testid: 'lp-app-publish' })),
_o28 ? h('p', { class: 'lb-ok', 'data-testid': 'lp-app-status' }, '✅ Đã đăng ' + S.todayISO(new Date(_o28.at)).split('-').reverse().join('/') + (_o28.slug !== cfg.slug ? ' (đường dẫn cũ: ' + _o28.slug + ' – bấm Cập nhật trang)' : '') + '. Sửa xong bấm "Cập nhật trang"; nơi khác thấy bản mới trong tối đa ' + AP.CACHE_MIN + ' phút.') : null,
_o28 ? h('div', { class: 'lb-link' }, h('code', { 'data-testid': 'lp-app-url' }, url)) : h('p', { class: 'lb-muted' }, 'Địa chỉ sẽ là: ' + url),
_o28 ? h('div', { class: 'lb-row' },
K.button('Chép link', async () => { await K.copy(url); K.toast('Đã chép link', 'ok'); }, { kind: 'ghost', icon: 'copy', testid: 'lp-app-copy' }),
K.button('Mở trang', () => { try { window.open(url, '_blank', 'noopener'); } catch { } }, { kind: 'ghost', icon: 'external', testid: 'lp-app-open' }),
K.button('Gỡ trang', appUnpublish, { kind: 'ghost', icon: 'x', testid: 'lp-app-remove' })) : null,
_o28 ? h('p', { class: 'lb-muted' }, 'Link riêng từng sale: thêm ?s=<mã sale> vào cuối địa chỉ (mã ở danh sách trang → "Mã riêng từng sale"). Pixel quảng cáo đo kém chính xác hơn trên địa chỉ này – chạy quảng cáo nên dùng Cách 1 với tên miền riêng.') : null);
}
async function unpublish() {
const slug = cfg.published && cfg.published.gas && cfg.published.gas.slug; if (!slug) return;
try { await K.api('landing.unpublish', { slug }); } catch (e) { K.toast((e && e.message) || 'Chưa gỡ được', 'warn'); return; }
const _o1z = { ...cfg.published }; delete _o1z.gas; cfg.published = _o1z; _o2x(); _oq(); K.toast('Đã gỡ trang Xuất bản nhanh', 'ok');
}
function _oq() {
const gas = cfg.published && cfg.published.gas;
const gasUrl = gas ? (gas.url || L.gasPageUrl(serverUrl, gas.slug)) : '';
const ownUrl = L.normBaseUrl(cfg.seo.base_url) || ('https://' + cfg.slug + '.pages.dev/');
const _o1s = (label, url, testid) => h('div', { class: 'lb-link' }, h('b', null, label), h('code', { 'data-testid': testid }, url), K.button('Chép', async () => { await K.copy(url); K.toast('Đã chép link', 'ok'); }, { kind: 'ghost', icon: 'copy' }));
const others = [
h('h3', null, _o5 ? 'Cách 1 – Tải gói trang (.zip) · tên miền riêng' : 'Cách 1 – Tải gói trang (.zip) · khuyên dùng'),
h('p', { class: 'lb-muted' }, 'Trang tĩnh, nhanh, chạy ở tên miền con miễn phí <tên-trang>.pages.dev hoặc tên miền riêng. Anh/chị tự kéo thả lên Cloudflare Pages (tài khoản của mình, miễn phí) hoặc host bất kỳ.'),
h('div', { class: 'lb-row' }, K.button('⬇️ Tải gói trang (.zip)', exportZip, { kind: 'primary', testid: 'lp-zip' })),
h('details', null, h('summary', null, 'Hướng dẫn đưa lên mạng / gắn tên miền riêng'), h('pre', { 'data-testid': 'lp-guide' }, L.DEPLOY_GUIDE.replace(/\{slug\}/g, cfg.slug))),
_o1s('Địa chỉ sau khi đưa lên', ownUrl, 'lp-own-url'),
h('h3', null, 'Cách 2 – Xuất bản nhanh (máy chủ Google của anh/chị)'),
h('p', { class: 'lb-muted' }, 'Không cần Cloudflare: trang chạy ngay trên máy chủ Apps Script đã nối. Hạn chế: địa chỉ dài dạng script.google.com/…/exec?p=' + cfg.slug + ', Google hiện dải chữ "Ứng dụng do người dùng Google Apps Script tạo" ở đầu trang, tải chậm hơn (~1–3 giây), chia sẻ Facebook/Zalo không hiện ảnh xem trước, SEO và pixel quảng cáo kém chính xác. Hợp để chạy thử, gửi Zalo nhanh; quảng cáo/SEO nên dùng Cách 1.'),
_om ? h('p', { class: 'lb-note' }, 'Đang xem thử: trang lưu trong máy chủ giả, chưa có địa chỉ thật.') : null,
h('div', { class: 'lb-row' }, K.button(gas ? '🔄 Cập nhật trang xuất bản nhanh' : '⚡ Xuất bản nhanh', quickPublish, { kind: gas ? 'ghost' : 'primary', testid: 'lp-gas' }),
gas ? K.button('Gỡ trang', unpublish, { kind: 'ghost', testid: 'lp-gas-remove' }) : null),
gas ? h('p', { class: 'lb-ok', 'data-testid': 'lp-gas-status' }, '✅ Đã xuất bản nhanh ' + S.todayISO(new Date(gas.at)).split('-').reverse().join('/') + (gas.slug !== cfg.slug ? ' (đường dẫn cũ: ' + gas.slug + ' – bấm Cập nhật)' : '')) : null,
gasUrl ? _o1s('Địa chỉ xuất bản nhanh', gasUrl, 'lp-gas-url') : null,
h('h3', null, 'Link gắn nguồn'),
h('p', { class: 'lb-muted' }, 'Thêm vào cuối địa chỉ trang: ?v=<mã video>&utm_source=tiktok&utm_campaign=<chiến dịch> – khách để lại số sẽ ghi rõ đến từ video/kênh nào. ?s=<mã sale> – tự giao khách cho sale (mã ở danh sách trang).')].filter(Boolean);
const _og = _oh(L.checkLanding(cfg, dataFor(cfg), _o5 ? { server: serverUrl || (_om ? 'demo' : ''), mode: 'gas', images: Object.fromEntries([...mem.entries()]) } : { server: serverUrl, mode: 'zip', images: Object.fromEntries([...mem.entries()]) }));
if (_o5) _o29.replaceChildren(_og, _o4(), h('details', { class: 'lb-more', 'data-testid': 'lp-more' }, h('summary', null, 'Cách khác: tên miền riêng (.zip) · Xuất bản nhanh'), ...others));
else _o29.replaceChildren(_og, ...others);
}
_oq(); _o2a = true;
const _o26 = K.select([['', '— Không gắn dự án —'], ...env.projects.map((_o1z) => [_o1z.id, _o1z.name])], cfg.project_id, { 'data-testid': 'lp-project' });
_o26.addEventListener('change', async () => {
cfg.project_id = _o26.value;
const _o1z = env.project(_o26.value);
if (_o1z && await K.confirm({ title: 'Điền lại từ Bảng hàng', text: `Điền lại tiêu đề, vị trí, khoản vay, SEO theo "${_o1z.name}"? Nội dung khác giữ nguyên.`, ok: 'Điền lại', testid: 'lp-refill' })) {
const fresh = L.newLanding({ id: cfg.id, template: cfg.template, project: _o1z, profile, data: { plans: env.plansFor(_o1z).plans, cfg: env.cfg } });
cfg.s.hero = { ...fresh.s.hero, image: cfg.s.hero.image }; cfg.s.location = fresh.s.location; cfg.s.loan = fresh.s.loan; cfg.seo = { ...cfg.seo, title: fresh.seo.title, description: fresh.seo.description };
if (!cfg.samples.includes('location')) cfg.samples = [...cfg.samples, 'location'];
_or();
}
_o2x(); _oq();
});
const _o23 = (_o1m) => h('div', { class: 'lb-two' }, _oy(L.PIXEL_NAMES[_o1m], `pixels.${_o1m}.on`, 'lp-px-' + _o1m), _ox('Mã ID', `pixels.${_o1m}.id`, null, { max: 40, ph: _o1m === 'fb' ? '123456789012345' : _o1m === 'tiktok' ? 'C1ABCD2EFGH3IJ' : 'G-XXXXXXX' }));
const T = L.TEMPLATES[cfg.template];
const nameIn = _ox('Tên trang (chỉ trong app)', 'name', null, { max: 80 });
const ed = h('div', { class: 'lb-ed lb-hide' },
group('🧩 Mẫu & dự án', [h('p', null, `Mẫu: ${T.icon} ${T.title}`), nameIn, h('label', { class: 'lb-f' }, h('span', null, 'Dự án trong Bảng hàng'), _o26)], { open: true, testid: 'lp-g-base' }),
group('🎨 Màu & chữ', [_ox('Tên thương hiệu (thanh trên cùng)', 'brand.name', null, { max: 60 }), h('div', { class: 'lb-two' }, _ow('Màu chính', 'brand.c1'), _ow('Màu nhấn', 'brand.c2')),
(() => { const s = K.select([['serif', 'Sang trọng (chữ có chân)'], ['sans', 'Hiện đại (không chân)']], cfg.brand.font, { 'data-testid': 'lp-font' }); s.addEventListener('change', () => set('brand.font', s.value)); return h('label', { class: 'lb-f' }, h('span', null, 'Kiểu chữ tiêu đề'), s); })()]),
group('🧱 Các mục trên trang (bật/tắt, thứ tự, nội dung)', [_o2o], { testid: 'lp-g-sections' }),
group('📞 Liên hệ', [_ox('Họ tên', 'contact.name', null, { max: 80 }), _ox('Chức danh', 'contact.title', null, { max: 80 }), h('div', { class: 'lb-two' }, _ox('Số điện thoại', 'contact.phone', null, { type: 'tel', inputmode: 'tel', autocomplete: 'tel', max: 20 }), _ox('Số Zalo', 'contact.zalo', null, { type: 'tel', inputmode: 'tel', autocomplete: 'tel', max: 20 })),
_ox('Số chứng chỉ hành nghề', 'contact.cert', null, { max: 40 }), _ox('Nơi hành nghề (công ty)', 'contact.company', null, { max: 120 }), _o1g('Ảnh đại diện', 'contact.avatar')], { testid: 'lp-g-contact' }),
group('🔎 SEO & chia sẻ', [
_ox('Đường dẫn trang', 'slug', null, { max: 50, help: 'chữ thường không dấu, số, gạch nối – cũng là tên dự án Cloudflare Pages', on: () => _oq() }),
_ox('Tiêu đề (Google, Facebook)', 'seo.title', null, { max: 90, count: 70 }), _ox('Mô tả', 'seo.description', null, { area: true, max: 300, count: 160 }),
_ox('Địa chỉ trang (tên miền) – điền sau khi gắn', 'seo.base_url', null, { max: 200, ph: 'https://duan-abc.vn/', on: () => _oq() }),
_o1g('Ảnh khi chia sẻ (1200×630, ảnh tự chụp)', 'seo.og_image', { allowSample: false })], { testid: 'lp-g-seo' }),
group('📈 Đo lường quảng cáo (tắt sẵn)', [h('p', { class: 'lb-muted' }, 'Chỉ dán MÃ ID – app tự chèn đoạn mã chuẩn. Bật pixel = trang có thêm dòng thông báo đo lường trong chính sách dữ liệu. Không gửi họ tên/SĐT khách cho pixel.'), _o23('fb'), _o23('tiktok'), _o23('google')], { testid: 'lp-g-pixels' }),
group('🚀 Xuất bản', [_o29], { testid: 'lp-g-publish' }));
const tabs = h('div', { class: 'lb-tabs', role: 'tablist' });
const split = h('div', { class: 'lb-split' }, ed, _o2b);
let _o2v = 'edit';
const _os = () => {
tabs.replaceChildren(
h('button', { type: 'button', role: 'tab', class: _o2v === 'edit' ? 'on' : '', 'aria-selected': String(_o2v === 'edit'), 'data-testid': 'lp-tab-edit', onclick: () => { _o2v = 'edit'; _os(); } }, '✏️ Sửa'),
h('button', { type: 'button', role: 'tab', class: _o2v === 'view' ? 'on' : '', 'aria-selected': String(_o2v === 'view'), 'data-testid': 'lp-tab-view', onclick: () => { _o2v = 'view'; _os(); _o21(); } }, '👁️ Xem trước'));
ed.style.display = _o2v === 'edit' ? 'flex' : 'none';
_o2b.style.display = _o2v === 'view' ? 'flex' : 'none';
};
_o2j.replaceChildren(
h('div', { class: 'lb-row lb-sp' }, K.button('← Danh sách trang', async () => { clearTimeout(_o2n); await _o2m(cfg); if (_o2i) _o2i.disconnect(); _o1u(); }, { kind: 'ghost', testid: 'lp-back' }),
h('span', { class: 'lb-muted' }, 'Tự lưu')),
tabs, split);
_os();
_o1o();
}
}
export default {
manifest: {
id: 'landing_builder', title: 'Trình tạo landing', icon: '🌐', screen: 'customers', order: 50, version: '0.2.0', status: 'ready', pack: 'core',
help: 'Tạo trang landing theo 4 mẫu (dự án, ký gửi, sự kiện, trang cá nhân), tự điền từ Bảng hàng, xem trước điện thoại/máy tính; đăng lên địa chỉ app bằng 1 bấm, tải gói .zip hoặc Xuất bản nhanh; khách để lại số về app + Telegram, tự giao sale theo link riêng. Gói Cơ bản: 1 landing; ' + LEADS_PACK + ': không giới hạn.',
},
mount,
async selftest(ctx) {
const details = [];
try {
const env = await S.loadEnv(ctx || {});
const _o1z = env.projects.find(S.sellable);
if (!_o1z) details.push('Không có dự án mẫu đang bán');
for (const t of L.TEMPLATE_IDS) {
const { plans, policy } = env.plansFor(_o1z);
const cfg = L.newLanding({ id: 'selftest', template: t, project: _o1z, profile: { name: 'A', phone: '0912345678' }, data: { plans, cfg: env.cfg } });
const { html } = L.renderPage(cfg, { project: _o1z, plans, policy, projects: [_o1z], cfg: env.cfg }, { target: 'static' });
if (!/name="consent"/.test(html) || !/<\/html>/.test(html)) details.push('Mẫu ' + t + ' dựng thiếu');
}
if (R.lpPhone('+84 912 345 678') !== '0912345678') details.push('Chuẩn hoá SĐT sai');
} catch (e) { details.push('Lỗi: ' + (e && e.message)); }
return { ok: !details.length, details: details.join('; ') || 'Đạt' };
},
};

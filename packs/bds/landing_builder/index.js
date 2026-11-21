import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as L from '../_lib/landing.js';
import * as R from '../_lib/landing_runtime.js';
import * as LM from '../_lib/landing_sample.js';
import * as LG from '../_lib/landing_goals.js';
import { projectGaps } from '../catalog/research_new_logic.js';
import { zipStore } from '../../../core/upgrade.4730f76a5c.js';
import { connectSection } from '../_lib/lead_connect_ui.js';
import * as AP from '../_lib/landing_app.js';
import { roleLabel } from '../../../core/users.897a836e5b.js';
import { ADD_PHONE, askMyPhone } from '../_lib/my_phone.js';
import config from '../../../config.js';
import { qrElement } from '../../../core/qr.aa623cdb09.js';
import * as LO from '../_lib/landing_owner.js';
import { myLinkBox, ownerTag, ownerFilter } from './my_link.js';
const _o1 = 'bds.landing.view';
export const BASIC_MAX = 1;
export const LEADS_PACK = 'Gói 1 · Tìm khách online';
export const ENABLE_TEXT = 'Bật ' + LEADS_PACK;
export const BASIC_MSG = 'Gói Cơ bản đăng được 1 landing. Muốn thêm trang: bật ' + LEADS_PACK + '.';
export const BASIC_ONLY_MSG = 'Gói Cơ bản đăng được 1 landing.';
export const UNIT_PAGE_PREFIX = 'unit_';
export const countsToLimit = (_og) => !String((_og && _og.id) || '').startsWith(UNIT_PAGE_PREFIX);
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
.lb-tpl .lb-tc-pick{text-align:left;border:0;border-radius:0;padding:12px;background:transparent;color:inherit;font:inherit;cursor:pointer;min-height:44px;flex:1}
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
/* thẻ Xuất bản: dòng ⛔/⚠ chữ bên trái, nút Sửa gọn bên phải (máy hẹp: xuống dòng dưới) – nút không đẩy giãn dòng chữ */
.lb-checks{list-style:none;padding-left:0}
.lb-checks li{display:flex;align-items:flex-start;gap:8px;flex-wrap:wrap}
.lb-checks li>.lb-ck-t{flex:1 1 16em;min-width:0;line-height:1.45;padding-top:4px}
.lb-checks li>.lb-ck-a{flex:none;display:flex;gap:6px;flex-wrap:wrap;margin-left:auto}
.lb-pub{display:flex;flex-direction:column;gap:12px;min-width:0}
.lb-pub>h3{margin-top:4px}
.lb-pub .lb-more>*+*{margin-top:10px}
.lb-now .lb-big{min-height:52px;font-size:1.05rem;padding:0 24px}
.lb-need{font-size:.88rem;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.lb-qr{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.lb-qr svg{background:#fff;border-radius:10px;flex:none}
.lb-steps{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:6px;font-size:.92rem}
/* ── 1.0.7: Tạo trang mới 3 bước (mục tiêu → mẫu → dự án) ── */
.lb-wiz{display:flex;flex-direction:column;gap:12px;min-width:0}
.lb-wiz-h{display:flex;align-items:center;gap:10px}.lb-wiz-n{font-size:.8rem;font-weight:700;border-radius:999px;padding:3px 10px;background:rgba(127,127,127,.16)}
.lb-wiz-nav{position:sticky;bottom:0;padding:10px 0 4px;background:var(--card,#fff);border-top:1px solid var(--line,rgba(127,127,127,.2));z-index:2}
.sheet-body .lb-wiz-nav{background:var(--bg,#fff)}
.lb-goals{display:grid;gap:10px}
.lb-goal{display:flex;align-items:center;gap:12px;text-align:left;border:1px solid rgba(127,127,127,.3);border-radius:14px;padding:12px;background:transparent;color:inherit;font:inherit;cursor:pointer;min-height:64px}
.lb-goal b{display:block}.lb-goal small{display:block;color:rgba(127,127,127,.95);font-size:.84rem;margin-top:2px}
.lb-goal-i{font-size:1.6rem;flex:none}.lb-goal>span:nth-child(2){flex:1;min-width:0}
.lb-goal-ck{flex:none;width:26px;height:26px;border-radius:8px;border:2px solid rgba(127,127,127,.5);display:grid;place-items:center;font-weight:800}
.lb-goal.on{outline:3px solid var(--gold,#C9A24A)}.lb-goal.on .lb-goal-ck{background:var(--gold,#C9A24A);border-color:var(--gold,#C9A24A);color:#1A1405}
.lb-fit{display:inline-block;align-self:flex-start;font-size:.75rem;font-weight:700;border-radius:999px;padding:2px 8px;background:#FFE7A8;color:#5A4300;margin:4px 0}
.lb-tpl .lb-tc-pick{display:flex;flex-direction:column;gap:2px}
.lb-swatch{display:flex;height:10px;border-radius:999px;overflow:hidden;margin-bottom:6px}.lb-swatch i{flex:1}
.lb-info{align-items:flex-start;border:1px solid rgba(127,127,127,.25);border-radius:12px;padding:8px 10px}
.lb-tc{display:flex;flex-direction:column;border:1px solid rgba(127,127,127,.3);border-radius:14px;overflow:hidden;min-width:0}
.lb-tc.on{outline:3px solid var(--gold,#C9A24A)}
.lb-tc-img{display:block;width:100%;height:auto;aspect-ratio:8/5;object-fit:cover;object-position:top;background:rgba(127,127,127,.12);border-radius:8px;margin-bottom:8px}
.lb-tc-act{display:flex;padding:0 12px 12px}
.lb-mv{display:flex;flex-direction:column;gap:10px;min-width:0}
.lb-mv .lb-phone{width:410px;height:56vh;max-height:760px;min-height:360px}
.lb-mv iframe{background:#fff}
.lb-list-ta{font-family:ui-monospace,Menlo,Consolas,monospace;font-size:.82rem;white-space:pre;overflow:auto}
`;
let _om = false;
function ensureCss() {
if (_om || typeof document === 'undefined') return;
_om = true;
try { const _o34 = new CSSStyleSheet(); _o34.replaceSync(_o0); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _o34]; } catch { }
}
const mem = new Map();
let _oo = null;
function _o1e() {
if (_oo) return _oo;
_oo = new Promise((_o2u) => {
try {
const _o2r = indexedDB.open('bds-landing-img', 1);
_o2r.onupgradeneeded = () => _o2r.result.createObjectStore('img');
_o2r.onsuccess = () => _o2u(_o2r.result);
_o2r.onerror = () => _o2u(null);
} catch { _o2u(null); }
});
return _oo;
}
async function _o1h(id) {
if (mem.has(id)) return mem.get(id);
const _on = await _o1e(); if (!_on) return null;
return new Promise((_o2u) => { try { const _o2o = _on.transaction('img').objectStore('img').get(id); _o2o.onsuccess = () => { if (_o2o.result) mem.set(id, _o2o.result); _o2u(_o2o.result || null); }; _o2o.onerror = () => _o2u(null); } catch { _o2u(null); } });
}
async function _o1j(id, _o2t) {
mem.set(id, _o2t);
const _on = await _o1e(); if (!_on) return;
await new Promise((_o2u) => { try { const _o3e = _on.transaction('img', 'readwrite'); _o3e.objectStore('img').put(_o2t, id); _o3e.oncomplete = _o2u; _o3e.onerror = _o2u; } catch { _o2u(); } });
}
function _o2s(_oe) { return new Promise((_o2u, rej) => { const _o15 = new FileReader(); _o15.onload = () => _o2u(_o15.result); _o15.onerror = () => rej(_o15.error); _o15.readAsDataURL(_oe); }); }
async function _o35(_o12) {
const url = URL.createObjectURL(_o12);
try {
const _o1f = await new Promise((_o2u, rej) => { const _o1d = new Image(); _o1d.onload = () => _o2u(_o1d); _o1d.onerror = () => rej(new Error('Không đọc được ảnh')); _o1d.src = url; });
const _o1o = Math.min(1, _o2 / Math.max(_o1f.naturalWidth, _o1f.naturalHeight));
const _og = document.createElement('canvas'); _og.width = Math.round(_o1f.naturalWidth * _o1o); _og.height = Math.round(_o1f.naturalHeight * _o1o);
_og.getContext('2d').drawImage(_o1f, 0, 0, _og.width, _og.height);
let _oe = await new Promise((_o2u) => _og.toBlob(_o2u, 'image/webp', 0.82));
if (!_oe || _oe.type !== 'image/webp') _oe = await new Promise((_o2u) => _og.toBlob(_o2u, 'image/jpeg', 0.85));
const mime = _oe.type || 'image/jpeg';
return { dataUrl: await _o2s(_oe), mime, ext: mime === 'image/webp' ? 'webp' : 'jpg', size: _oe.size };
} finally { URL.revokeObjectURL(url); }
}
const _oc = (dataUrl) => { const _ob = atob(String(dataUrl).split(',')[1] || ''); const _o27 = new Uint8Array(_ob.length); for (let _o1d = 0; _o1d < _ob.length; _o1d++) _o27[_o1d] = _ob.charCodeAt(_o1d); return _o27; };
async function _o2e(cfg) { for (const _o3j of L.allImages(cfg)) if (_o3j.img.kind === 'local') await _o1h(_o3j.img.id); }
export async function mount(el, ctx) {
ensureCss();
S.ensureSalesCss();
const K = kit(ctx);
const _o2w = h('div', { class: 'lb', 'data-testid': 'landing-builder' });
el.innerHTML = '';
el.appendChild(_o2w);
const role = (ctx.user && ctx.user.role) || 'owner';
const api = ctx.api || {};
const serverUrl = api.mode === 'gas' && api.url ? String(api.url) : '';
const _op = api.mode === 'demo';
let env = await S.loadEnv(ctx);
const profile = await S.getProfile(ctx);
let inventory = [];
const _o1x = async () => { try { inventory = LG.fromInventory(await K.list('objects'), (id) => (env.project(id) || {}).name || ''); } catch { inventory = []; } };
await _o1x();
const _o29 = () => {
const all = (ctx.settings && typeof ctx.settings.all === 'function') ? ctx.settings.all() : {};
return Object.keys(all).filter((_o1o) => _o1o.startsWith(L.KEY_PREFIX)).map((_o1o) => L.normalizeLanding(all[_o1o])).filter((_og) => _og && _og.id)
.sort((_o4, _ob) => (_ob.updated_at || 0) - (_o4.updated_at || 0)).filter((_og) => LO.visiblePages(ctx, [_og]).length);
};
const dataFor = (cfg) => {
const _o28 = env.project(cfg.project_id);
const { plans, policy } = env.plansFor(_o28);
return { project: _o28, plans, policy, projects: (cfg.projects || []).map((id) => env.project(id)).filter(Boolean), cfg: env.cfg, today: env.today, inventory };
};
const _o2y = (cfg) => K.setSetting(L.KEY_PREFIX + cfg.id, LO.stampOwner(ctx, { ...cfg, updated_at: Date.now() }));
const _o3g = () => !!(ctx.packs && typeof ctx.packs.enabled === 'function' && ctx.packs.enabled('leads'));
const _o21 = () => (LO.isAdmin(ctx) ? '' : LO.meId(ctx));
const _oa = () => !_o3g() && _o29().filter(countsToLimit).filter((_og) => LO.ownerOf(_og) === _o21()).length >= BASIC_MAX;
const _o1q = () => !!(ctx.packs && typeof ctx.packs.def === 'function' && (ctx.packs.def('leads') || {}).hidden);
const appT0 = AP.appTarget(typeof location !== 'undefined' ? location.hostname : '', config);
const appT = LO.isAdmin(ctx) ? appT0 : null;
function _o1r(text) {
const _o14 = _o29()[0];
const _o1y = K.modal({ title: 'Gói Cơ bản: 1 landing', testid: 'lp-limit', body: [
h('p', { 'data-testid': 'lp-limit-msg' }, _o1q() ? BASIC_ONLY_MSG : text || BASIC_MSG),
h('p', { class: 'lb-muted' }, 'Trang đang có vẫn sửa, đăng lại, gỡ được bình thường. Muốn làm trang khác: sửa trang đang có, hoặc xoá trang đó rồi tạo trang mới.'),
h('div', { class: 'lb-row' },
_o1q() ? null : K.button(ENABLE_TEXT, () => { _o1y.close(); K.nav('settings/packs'); }, { kind: 'primary', icon: 'puzzle', testid: 'lp-limit-enable' }),
_o14 ? K.button('Sửa trang đang có', () => { _o1y.close(); _ox(_o14); }, { kind: 'ghost', icon: '✏️', testid: 'lp-limit-edit' }) : null)] });
return _o1y;
}
const _o1k = (e) => !!e && (e.code === 'PACK_LIMIT');
async function _o9(slug) {
let _o2j = null;
try { _o2j = await K.api('landing.app_proof'); } catch { _o2j = null; }
await K.api('landing.unpublish', { slug });
if (!appT || !_o2j) return { worker: false };
try { await AP.workerCall(appT, 'go', { page: slug, id_token: _o2j.id_token }); return { worker: true }; } catch { return { worker: false }; }
}
const _o22 = () => myLinkBox(K, ctx, { appT: appT0, serverUrl, onClone: async (raw) => { const cfg = LO.cloneAsMine(ctx, L.normalizeLanding(raw), K.newId()); await _o2y(cfg); K.toast('Đã nhân bản – ảnh tải từ máy của người tạo không đi kèm, thay ảnh nếu cần', 'ok'); _ox(cfg); } });
if (!LO.canPublish(ctx)) return _o1u();
const _o2p = S.hashParams();
const open = _o2p.get('id') && _o29().find((_og) => _og.id === _o2p.get('id'));
if (open) _ox(open); else _o1w();
return _o2w;
let ownerSel = '';
function _o1w() {
const all = _o29();
if (ownerSel && !LO.ownersIn(all).includes(ownerSel)) ownerSel = '';
const list = LO.filterByOwner(all, ownerSel);
const _oh = list.map((_og) => {
const T = L.TEMPLATES[_og.template];
const _o2k = _og.published || {};
return h('div', { class: 'lb-card', 'data-testid': 'lp-card-' + _og.id },
h('b', null, _og.name || 'Trang chưa đặt tên'),
h('span', { class: 'lb-muted' }, `${T.icon} ${T.title} · /${_og.slug}`),
ownerTag(K, ctx, _og),
h('span', { class: 'lb-muted' }, [_o2k.app && _o2k.app.at ? 'Đã đăng lên địa chỉ app ' + S.todayISO(new Date(_o2k.app.at)).split('-').reverse().join('/') : '', _o2k.gas && _o2k.gas.at ? 'Xuất bản nhanh ' + S.todayISO(new Date(_o2k.gas.at)).split('-').reverse().join('/') : '', _o2k.zip && _o2k.zip.at ? 'Tải .zip ' + S.todayISO(new Date(_o2k.zip.at)).split('-').reverse().join('/') : ''].filter(Boolean).join(' · ') || 'Bản nháp'),
h('div', { class: 'lb-row' },
K.button('Sửa', () => _ox(_og), { kind: 'primary', testid: 'lp-edit-' + _og.id }),
K.button('Xoá', () => remove(_og), { kind: 'ghost', testid: 'lp-del-' + _og.id })));
});
_o2w.replaceChildren(
_o22(),
h('div', { class: 'lb-row lb-sp' }, h('h2', null, 'Trình tạo landing'), K.button('Tạo trang mới', () => (_oa() ? _o1r() : _ok()), { kind: 'primary', icon: 'plus', testid: 'lp-new' })),
_o3g() ? null : h('div', { class: 'lb-row', 'data-testid': 'lp-plan-row' }, h('p', { class: 'lb-muted', 'data-testid': 'lp-plan' }, planText(all.filter(countsToLimit).length) + (_o1q() ? '' : ' Thêm trang: bật ' + LEADS_PACK + '.')),
_o1q() ? null : K.button('Mở Gói chức năng', () => K.nav('settings/packs'), { kind: 'ghost', small: true, icon: 'puzzle', testid: 'lp-plan-enable' })),
h('p', { class: 'lb-muted' }, 'Trang giới thiệu dự án / căn ký gửi / sự kiện / trang cá nhân: tự điền từ Thông tin dự án, khách để lại số là về thẳng app của anh/chị (máy chủ Google riêng) + báo Telegram.'),
h('div', { class: 'lb-note' }, 'Thông tin dự án trên trang do anh/chị chịu trách nhiệm: kiểm tra giá, chính sách, pháp lý với tài liệu của chủ đầu tư trước khi xuất bản. Ảnh mẫu là ảnh minh hoạ trung tính – nên thay bằng ảnh tự chụp.'),
ownerFilter(K, ctx, all, ownerSel, (v) => { ownerSel = v; _o1w(); }),
list.length ? h('div', { class: 'lb-cards' }, _oh) : K.empty('Chưa có trang nào. Bấm "Tạo trang mới".'),
!LO.isStaff(ctx) ? null : ctx.solo ? null : _o2x(),
LO.isStaff(ctx) ? connectSection(ctx, K, { org: profile && (profile.company || profile.name) }) : null);
}
async function remove(_og) {
const ok = await K.confirm({ title: 'Xoá trang', text: `Xoá trang "${_og.name}"? Trang Xuất bản nhanh (nếu có) cũng được gỡ. Khách đã để lại số vẫn giữ nguyên.`, ok: 'Xoá', kind: 'danger', testid: 'lp-del-confirm' });
if (!ok) return;
if (_og.published && _og.published.gas && _og.published.gas.slug) { try { await K.api('landing.unpublish', { slug: _og.published.gas.slug }); } catch { } }
if (_og.published && _og.published.app && _og.published.app.slug) await _o9(_og.published.app.slug).catch(() => null);
await K.setSetting(L.KEY_PREFIX + _og.id, null);
K.toast('Đã xoá trang', 'ok');
_o1w();
}
function _ok() {
const st = { step: 1, goals: ['so_cap'], tpl: null, picked: false, project: (env.projects.find(S.sellable) || {}).id || '', info: null };
const body = h('div', { class: 'lb-wiz' });
const _o1y = K.modal({ title: 'Tạo trang mới', testid: 'lp-new-modal', wide: true, body });
const _o37 = (n, title) => h('div', { class: 'lb-wiz-h' }, h('span', { class: 'lb-wiz-n' }, n + '/3'), h('h3', null, title));
const nav = (back, next) => h('div', { class: 'lb-row lb-sp lb-wiz-nav' }, back || h('span'), next);
const _oq = () => { body.replaceChildren(...(st.step === 1 ? _o1b() : st.step === 2 ? _o3d() : _o2i())); try { body.scrollIntoView({ block: 'start' }); } catch { } };
function _o1b() {
const box = h('div', { class: 'lb-goals', role: 'group', 'aria-label': 'Mục tiêu trang' });
const next = K.button('Tiếp: chọn mẫu', () => { if (!st.picked) st.tpl = LG.pickTemplate(st.goals); st.step = 2; _oq(); }, { kind: 'primary', icon: 'next', testid: 'lp-new-next' });
const _o2a = () => {
box.replaceChildren(...LG.GOALS.map((_o17) => {
const I = LG.GOAL_INFO[_o17], on = st.goals.includes(_o17);
return h('button', { type: 'button', class: 'lb-goal' + (on ? ' on' : ''), role: 'checkbox', 'aria-checked': String(on), 'data-testid': 'lp-goal-' + _o17,
onclick: () => { st.goals = on ? st.goals.filter((_o3j) => _o3j !== _o17) : LG.goalsOf([...st.goals, _o17]); if (on && !st.goals.length) st.goals = []; _o2a(); } },
h('span', { class: 'lb-goal-i', 'aria-hidden': 'true' }, I.icon), h('span', null, h('b', null, I.title), h('small', null, I.desc)), h('span', { class: 'lb-goal-ck', 'aria-hidden': 'true' }, on ? '✓' : ''));
}));
next.disabled = !st.goals.length;
hint.textContent = st.goals.length >= 2 ? '✓ Chọn ' + st.goals.length + ' mục tiêu: đầu trang có thanh "Anh/chị đang tìm gì?" để khách tự chọn nhóm.' : 'Chọn 1 hoặc nhiều mục tiêu.';
};
const hint = h('p', { class: 'lb-muted', 'data-testid': 'lp-goal-hint' });
_o2a();
return [_o37(1, 'Trang này để làm gì?'), box, hint, nav(null, next)];
}
function _o3d() {
if (!st.tpl) st.tpl = LG.pickTemplate(st.goals);
const grid = h('div', { class: 'lb-tpl', role: 'radiogroup', 'aria-label': 'Mẫu trang' });
const basic = h('div', { class: 'lb-tpl', role: 'radiogroup', 'aria-label': 'Mẫu cơ bản' });
const card = (id) => {
const T = L.TEMPLATES[id], on = st.tpl === id, fit = !T.basic && LG.fitsGoals(id, st.goals);
const _o2c = () => { st.tpl = id; st.picked = true; _o2a(); };
const img = h('img', { class: 'lb-tc-img', src: LM.thumbSrc(id), alt: '', width: 480, height: 300, loading: 'lazy', decoding: 'async', 'data-testid': 'lp-tpl-img-' + id });
img.addEventListener('error', () => { img.hidden = true; });
return h('div', { class: 'lb-tc' + (on ? ' on' : ''), 'data-tpl': id },
h('button', { type: 'button', class: 'lb-tc-pick' + (on ? ' on' : ''), role: 'radio', 'aria-checked': String(on), 'data-testid': 'lp-tpl-' + id, onclick: _o2c },
img,
T.basic ? null : h('span', { class: 'lb-swatch', 'aria-hidden': 'true', dataset: { c1: T.c1, c2: T.c2 } }, h('i'), h('i')),
h('b', null, T.icon + ' ' + T.title), fit ? h('span', { class: 'lb-fit', 'data-fit': '1' }, '⭐ Hợp mục tiêu') : null,
T.fit ? h('div', { class: 'lb-muted' }, 'Hợp: ' + T.fit) : null, h('div', { class: 'lb-muted' }, T.desc)),
h('div', { class: 'lb-tc-act' }, K.button('Xem thử', () => _o2f(id, _o2c), { kind: 'ghost', small: true, icon: 'eye', testid: 'lp-tpl-pv-' + id })));
};
const _o2a = () => {
grid.replaceChildren(...LG.sortTemplates(L.MAIN_TEMPLATE_IDS, st.goals).map(card));
basic.replaceChildren(...L.BASIC_TEMPLATE_IDS.map(card));
for (const _o38 of [...grid.querySelectorAll('.lb-swatch')]) { const [_o4, _ob] = _o38.children; _o4.style.background = _o38.dataset.c1; _ob.style.background = _o38.dataset.c2; }
};
_o2a();
const more = h('details', { class: 'lb-more', 'data-testid': 'lp-tpl-basic', open: L.BASIC_TEMPLATE_IDS.includes(st.tpl) }, h('summary', null, 'Mẫu cơ bản: dự án, ký gửi 1 căn, sự kiện mở bán, trang cá nhân'), basic);
return [_o37(2, 'Chọn mẫu'), grid, more,
nav(K.button('Mục tiêu', () => { st.step = 1; _oq(); }, { kind: 'ghost', icon: 'back', testid: 'lp-new-back' }),
K.button('Tiếp: chọn dự án', () => { st.step = 3; _oq(); }, { kind: 'primary', icon: 'next', testid: 'lp-new-next' }))];
}
function _o2i() {
const _o33 = K.select([['', '— Không gắn dự án —'], ...env.projects.map((_o28) => [_o28.id, _o28.name + (_o28.price ? ' · ' + L.priceLabel(_o28) : '')])], st.project, { 'data-testid': 'lp-new-project' });
const gapBox = h('div', { 'aria-live': 'polite' });
const infoCb = h('input', { type: 'checkbox', 'data-testid': 'lp-new-info' });
const _o1z = L.isMainTemplate(st.tpl);
const infoRow = _o1z ? h('label', { class: 'lb-sw lb-info' }, infoCb, h('span', null, h('b', null, 'Chỉ giới thiệu'), ' – ẩn giá, chính sách; khách chỉ để lại số điện thoại')) : null;
const _or = () => {
st.project = _o33.value;
const _o28 = env.project(_o33.value);
if (st.info == null || !st.infoTouched) { st.info = _o1z ? !(_o28 && _o28.price) : false; infoCb.checked = st.info; }
if (!_o28) { gapBox.replaceChildren(env.projects.length ? h('p', { class: 'lb-muted' }, 'Không gắn dự án: trang giới thiệu chung, tự ẩn bảng giá.') : h('div', { class: 'lb-gap', role: 'status', 'data-testid': 'lp-new-noproj' }, 'Chưa có dự án nào – bấm "Thêm dự án bằng AI" (gõ tên dự án) hoặc thêm tay ở Thông tin dự án. Trang ký gửi / sự kiện / cá nhân tạo được ngay.', h('div', { class: 'lb-row' }, K.button('Thêm dự án', () => { _o1y.close(); K.nav('#/sales/catalog?add=1'); }, { icon: 'plus', small: true, testid: 'lp-new-add-project' })))); return; }
const { plans, policy } = env.plansFor(_o28);
const _o18 = projectGaps(_o28, { policy, plans, staleDays: policy ? S.staleDays(policy) : 0 });
gapBox.replaceChildren(_o18.length
? h('div', { class: 'lb-gap', role: 'status', 'data-testid': 'lp-new-gaps', 'data-gaps': _o18.map((_o17) => _o17.key).join(' ') },
`⚠️ "${_o28.name}" còn thiếu: ${_o18.map((_o17) => _o17.label).join('; ')}. Mục thiếu dữ liệu tự ẩn trên trang.`,
h('div', { class: 'lb-row' }, K.button('Mở dự án trong Thông tin dự án', () => { _o1y.close(); K.nav('#/sales/catalog?open=' + encodeURIComponent(_o28.id)); }, { icon: 'building', small: true, testid: 'lp-new-open-catalog' })))
: h('div', { class: 'lb-okl', 'data-testid': 'lp-new-gaps', 'data-gaps': '' }, `✓ "${_o28.name}" đã có giá, loại căn, chính sách và vị trí.`));
};
infoCb.addEventListener('change', () => { st.info = infoCb.checked; st.infoTouched = true; });
_o33.addEventListener('change', _or);
const _o7 = K.button('Thêm dự án bằng AI', () => _o26((pid) => { st.project = pid; st.infoTouched = false; _oq(); }), { icon: 'sparkle', testid: 'lp-ai-add' });
const listNote = st.goals.includes('thu_cap') ? h('p', { class: 'lb-note', 'data-testid': 'lp-new-listnote' }, inventory.length
? `🔑 Rổ hàng lấy sẵn ${inventory.length} căn đang chào trong Giỏ hàng thứ cấp. Dán thêm căn từ Excel trong trình sửa (nhóm "Rổ hàng").`
: '🔑 Rổ hàng: dán danh sách căn từ Excel trong trình sửa (nhóm "Rổ hàng"). Chưa có căn thì trang hiện ô nhận nhu cầu.') : null;
const _ol = K.button('Tạo trang', async () => {
if (_oa()) { _o1y.close(); _o1r(); return; }
const _o28 = env.project(_o33.value);
const { plans } = env.plansFor(_o28);
const cfg = L.newLanding({ id: K.newId(), template: st.tpl, project: _o28, profile, data: { plans, cfg: env.cfg }, goals: st.goals, infoOnly: _o1z ? st.info : null });
await _o2y(cfg);
_o1y.close();
_ox(cfg);
}, { kind: 'primary', icon: 'check', testid: 'lp-new-create' });
_or();
return [_o37(3, 'Dự án trên trang'),
h('label', { class: 'lb-f' }, h('span', null, 'Dự án (tự điền giá, chính sách, vị trí)'), _o33),
h('div', { class: 'lb-row' }, _o7), gapBox, infoRow, listNote,
nav(K.button('Mẫu', () => { st.step = 2; _oq(); }, { kind: 'ghost', icon: 'back', testid: 'lp-new-back' }), _ol)];
}
_oq();
}
function _o2f(id, onUse) {
const T = L.TEMPLATES[id];
const { cfg, data } = LM.sampleLanding(id);
const { html, css } = L.renderPage(cfg, data, { target: 'preview' });
let src = 'packs/bds/landing_builder/xem_mau_frame.js';
try { src = new URL('./xem_mau_frame.js', import.meta.url).href; } catch { }
const doc = html.replace('</head>', '<script src="' + L.esc(src) + '"></script>\n</head>');
const _o16 = h('iframe', { title: 'Xem thử mẫu ' + T.title, sandbox: 'allow-scripts', referrerpolicy: 'no-referrer', 'data-testid': 'lp-mau-frame' });
_o16.addEventListener('load', () => { try { _o16.contentWindow.postMessage({ t: 'lp-mau-css', css }, '*'); } catch { } _o16.dataset.ready = String(Date.now()); });
const box = h('div', { class: 'lb-phone' }, _o16);
const stage = h('div', { class: 'lb-stage' }, box);
let device = 'phone', _o2v = null;
const seg = h('div', { class: 'lb-seg', role: 'group', 'aria-label': 'Khung xem' });
const _o32 = (d, label) => h('button', { type: 'button', class: device === d ? 'on' : '', 'aria-pressed': String(device === d), 'data-testid': 'lp-mau-view-' + d, onclick: () => { device = d; layout(); } }, label);
function layout() {
seg.replaceChildren(_o32('phone', '📱 Điện thoại'), _o32('desk', '🖥️ Máy tính'));
if (_o2v) { _o2v.disconnect(); _o2v = null; }
box.dataset.device = device;
if (device === 'phone') { box.className = 'lb-phone'; box.style.height = ''; _o16.style.transform = ''; return; }
box.className = 'lb-desk';
const fit = () => { const _o3i = box.clientWidth || 600; const _o1o = Math.min(1, _o3i / 1280); _o16.style.transform = `scale(${_o1o})`; box.style.height = Math.round(800 * _o1o) + 'px'; };
fit();
if (typeof ResizeObserver !== 'undefined') { _o2v = new ResizeObserver(fit); _o2v.observe(box); }
}
const _o1y = K.modal({ title: 'Xem thử: ' + T.icon + ' ' + T.title, testid: 'lp-mau-modal', wide: true, body: h('div', { class: 'lb-mv' },
h('div', { class: 'lb-row lb-sp' }, h('span', { class: 'lb-muted' }, 'Dữ liệu mẫu (dự án giả) – trang thật tự điền từ dự án anh/chị chọn ở bước sau.'), seg),
stage,
h('div', { class: 'lb-row lb-sp' },
K.button('Đóng', () => close(), { kind: 'ghost', icon: 'close', testid: 'lp-mau-close' }),
K.button('Dùng mẫu này', () => { onUse(); close(); }, { kind: 'primary', icon: 'check', testid: 'lp-mau-use' }))) });
function close() { if (_o2v) { _o2v.disconnect(); _o2v = null; } _o1y.close(); }
layout();
_o16.srcdoc = doc;
return _o1y;
}
async function _o26(onPid) {
let A;
try {
A = await import('./ai_project.js');
const L = await import('../catalog/project_lookup.js');
A.setProjectLookup(L.projectLookup(A.serverLookup));
} catch { K.toast('Chưa mở được – kiểm tra mạng rồi thử lại.', 'warn'); return; }
A.openAiProject(K, ctx, { onSaved: async (pid) => { env = await S.loadEnv(ctx); await onPid(pid); } });
}
function _o2x() {
const box = h('div', { class: 'lb-card', 'data-testid': 'lp-sale-codes' }, h('h3', null, 'Mã riêng từng sale'), h('span', { class: 'lb-muted' }, 'Đang tải…'));
K.api('landing.sale_codes').then((list) => {
box.replaceChildren(h('h3', null, 'Mã riêng từng sale'),
h('p', { class: 'lb-muted' }, 'Thêm ?s=<mã> vào cuối địa chỉ trang → khách để lại số qua link đó tự giao cho sale đó (Telegram báo cả Quản trị và sale). Sale xem link của mình trong mục này trên máy của họ.'),
h('div', { class: 'lb-links' }, (list || []).map((_o3f) => h('div', { class: 'lb-link' }, h('b', null, _o3f.full_name || _o3f.username), h('span', { class: 'lb-muted' }, roleLabel(_o3f.role)), h('code', { 'data-testid': 'lp-code-' + _o3f.username }, 's=' + _o3f.code)))));
}).catch(() => box.replaceChildren(h('h3', null, 'Mã riêng từng sale'), h('p', { class: 'lb-muted' }, 'Máy chủ chưa có chức năng này – cần cập nhật máy chủ.')));
return box;
}
async function _o1u() {
_o2w.replaceChildren(h('h2', null, 'Link riêng của tôi'), h('p', { class: 'lb-muted' }, 'Đang tải…'));
let code = '';
try { code = (await K.api('landing.my_code')).code; } catch { _o2w.replaceChildren(h('h2', null, 'Link riêng của tôi'), K.empty('Máy chủ chưa có chức năng này – cần cập nhật máy chủ.')); return; }
_o2w.replaceChildren(
h('h2', null, 'Link riêng của tôi'),
h('p', { class: 'lb-muted' }, 'Gửi link này cho khách / gắn vào bài đăng: khách để lại số qua link này tự giao cho anh/chị, Telegram báo ngay.'),
h('div', { class: 'lb-card' }, h('span', null, 'Mã của tôi: ', h('b', { 'data-testid': 'lp-my-code' }, code)),
h('span', { class: 'lb-muted' }, 'Trang đặt ở tên miền riêng: thêm ?s=' + code + ' vào cuối địa chỉ trang.')),
_o22());
if (role === 'manager') _o2w.appendChild(connectSection(ctx, K, { org: profile && (profile.company || profile.name) }));
}
async function _ox(start) {
let cfg = L.normalizeLanding(start);
await _o2e(cfg);
let _o2z = 0, paintT = 0;
let device = 'phone';
try { const v = localStorage.getItem(_o1); if (v === 'desk') device = 'desk'; } catch { }
const _o3b = (section) => {
if (section && (cfg.samples || []).includes(section)) cfg = L.clearSample(cfg, section);
clearTimeout(_o2z); _o2z = setTimeout(() => _o2y(cfg), 600);
clearTimeout(paintT); paintT = setTimeout(() => { _o2a(); if (_o2m) _ou(); }, 200);
};
let _o2m = false;
const set = (path, v, section) => { const _o1p = path.split('.'); let o = cfg; for (let _o1d = 0; _o1d < _o1p.length - 1; _o1d++) o = o[_o1p[_o1d]]; o[_o1p.at(-1)] = v; _o3b(section); };
const get = (path) => path.split('.').reduce((o, _o1o) => (o == null ? o : o[_o1o]), cfg);
const _o16 = h('iframe', { title: 'Xem trước trang', 'data-testid': 'lp-frame' });
const stage = h('div', { class: 'lb-stage' });
const _o32 = (id, label) => h('button', { type: 'button', class: device === id ? 'on' : '', 'data-testid': 'lp-view-' + id, onclick: () => { device = id; try { localStorage.setItem(_o1, id); } catch { } layout(); } }, label);
const seg = h('div', { class: 'lb-seg' });
const _o2n = h('div', { class: 'lb-pv lb-hide' }, h('div', { class: 'lb-row lb-sp' }, h('h3', null, 'Xem trước'), seg), stage,
h('p', { class: 'lb-muted' }, 'Bản xem trước: bấm Gửi trên form = gửi thử vào app (khách có nhãn "thử"). Ảnh dán link chỉ hiện ở trang thật.'));
let _o2v = null;
const box = h('div', { class: 'lb-phone' }, _o16);
stage.replaceChildren(box);
let _o2b = null;
function layout() {
seg.replaceChildren(_o32('phone', '📱 Điện thoại'), _o32('desk', '🖥️ Máy tính'));
if (_o2v) { _o2v.disconnect(); _o2v = null; }
if (device === 'phone') { box.className = 'lb-phone'; box.style.height = ''; _o16.style.transform = ''; }
else {
box.className = 'lb-desk';
const fit = () => { const _o3i = box.clientWidth || 600; const _o1o = Math.min(1, _o3i / 1280); _o16.style.transform = `scale(${_o1o})`; box.style.height = Math.round(800 * _o1o) + 'px'; };
fit();
if (typeof ResizeObserver !== 'undefined') { _o2v = new ResizeObserver(fit); _o2v.observe(box); }
}
_o2a();
}
function _o2a() {
if (!_o16.isConnected) return;
const data = dataFor(cfg);
const { html, css, cfgJson } = L.renderPage(cfg, data, { target: 'preview', imgSrc: (_o1f) => (mem.get(_o1f.id) || {}).dataUrl || '' });
const _o36 = html + '\u0000' + css + '\u0000' + cfgJson;
if (_o2b === _o36) return;
_o2b = _o36;
let _o3k = 0;
try { _o3k = _o16.contentWindow ? _o16.contentWindow.scrollY : 0; } catch { _o3k = 0; }
_o16.onload = () => {
const _o3i = _o16.contentWindow, d = _o16.contentDocument;
if (!_o3i || !d) return;
try { const _o34 = new _o3i.CSSStyleSheet(); _o34.replaceSync(css); d.adoptedStyleSheets = [_o34]; } catch { }
try {
R.lpBoot(_o3i, d, cfgJson, { preview: true, notify: (t) => K.toast(t), send: (_o28) => K.api('landing.lead', _o28).then((_o2r) => { K.toast('Đã gửi thử – khách nằm trong danh sách Khách hàng (nhãn "thử")', 'ok'); return _o2r; }) });
} catch (e) { ctx.errors && ctx.errors.report && ctx.errors.report('warn', 'landing.preview', String(e && e.message || e)); }
try { _o3i.scrollTo(0, _o3k); } catch { }
_o16.dataset.ready = String(Date.now());
};
_o16.srcdoc = html;
}
const _o10 = (label, path, section, o = {}) => {
const inp = h(o.area ? 'textarea' : 'input', { type: o.type || 'text', value: get(path) ?? '', maxlength: o.max || (o.area ? 2000 : 200), placeholder: o.ph || '', 'data-testid': 'lp-f-' + path.replace(/\./g, '-'), inputmode: o.inputmode, autocomplete: o.autocomplete });
if (o.area) inp.value = get(path) ?? '';
const hint = o.count ? h('small', null) : (o.help ? h('small', null, o.help) : null);
const _o3h = () => { if (o.count) hint.textContent = `${inp.value.length}/${o.count} ký tự` + (o.help ? ' · ' + o.help : ''); };
inp.addEventListener('input', () => { set(path, o.num ? Number(String(inp.value).replace(',', '.')) || 0 : inp.value, section); _o3h(); if (o.on) o.on(inp.value); });
_o3h();
return h('label', { class: 'lb-f' }, h('span', null, label), inp, hint);
};
const _oz = (label, path) => {
const inp = h('input', { type: 'color', value: get(path), 'data-testid': 'lp-f-' + path.replace(/\./g, '-') });
inp.addEventListener('input', () => { if (L.validColor(inp.value)) set(path, inp.value); });
return h('label', { class: 'lb-f' }, h('span', null, label), inp);
};
const _o11 = (label, path, testid) => {
const cb = h('input', { type: 'checkbox', checked: !!get(path), 'data-testid': testid });
cb.addEventListener('change', () => set(path, cb.checked));
return h('label', { class: 'lb-sw' }, cb, h('span', null, label));
};
const _o1i = (label, path, { allowSample = true } = {}) => {
const box = h('div', { class: 'lb-img', 'data-testid': 'lp-img-' + path.replace(/\./g, '-') });
const _o12 = h('input', { type: 'file', accept: 'image/*', hidden: true, 'data-testid': 'lp-file-' + path.replace(/\./g, '-') });
_o12.addEventListener('change', async () => {
const _oy = _o12.files && _o12.files[0]; if (!_oy) return;
try {
const _o2t = await _o35(_oy);
const id = 'i' + K.newId().slice(-10);
await _o1j(id, _o2t);
set(path, { kind: 'local', id, name: String(_oy.name || '').slice(0, 80) });
_oq();
K.toast('Đã thêm ảnh (' + Math.round(_o2t.size / 1024) + ' KB) – ảnh lưu trên máy này', 'ok');
} catch (e) { K.toast('Không đọc được ảnh: ' + (e && e.message || ''), 'warn'); }
_o12.value = '';
});
function _oq() {
const _o1f = get(path);
let _o3a;
if (!_o1f) _o3a = h('div', { class: 'lb-thumb' }, 'Chưa có ảnh');
else if (_o1f.kind === 'local' && mem.get(_o1f.id)) _o3a = h('div', { class: 'lb-thumb' }, h('img', { src: mem.get(_o1f.id).dataUrl, alt: '' }));
else if (_o1f.kind === 'local') _o3a = h('div', { class: 'lb-thumb' }, 'Ảnh ở máy khác');
else if (_o1f.kind === 'url') _o3a = h('div', { class: 'lb-thumb', title: _o1f.url }, '🔗 Ảnh từ link');
else _o3a = h('div', { class: 'lb-thumb' }, h('img', { src: L.sampleSvg(_o1f.seed, (env.project(cfg.project_id) || {}).hue, _o1f.look || 'city'), alt: '' }), h('span', { class: 'lb-mau' }, 'Mẫu'));
box.replaceChildren(_o3a, h('div', { class: 'lb-row' },
K.button('Tải ảnh lên', () => _o12.click(), { kind: 'ghost' }),
K.button('Dán link', () => {
const inp = h('input', { type: 'url', value: _o1f && _o1f.kind === 'url' ? _o1f.url : '', placeholder: 'https://…', 'data-testid': 'lp-url-input' });
const err = h('p', { class: 'sl-bad', role: 'alert' });
const _o1y = K.modal({ title: 'Ảnh từ đường link', testid: 'lp-url-modal', body: [
h('p', { class: 'lb-muted' }, 'Ảnh trên Google Drive: bấm Chia sẻ → "Bất kỳ ai có đường liên kết" → Sao chép đường liên kết rồi dán vào đây. Link https khác cũng dùng được.'),
h('label', { class: 'lb-f' }, h('span', null, 'Link ảnh'), inp), err,
h('div', { class: 'lb-row' }, K.button('Dùng ảnh này', () => {
const _o3f = L.imageUrl(inp.value);
if (!_o3f) { err.textContent = 'Link ảnh phải bắt đầu bằng https://'; return; }
set(path, { kind: 'url', url: _o3f }); _oq(); _o1y.close();
}, { kind: 'primary', testid: 'lp-url-ok' }))] });
}, { kind: 'ghost' }),
allowSample ? K.button('Ảnh mẫu', () => { set(path, { kind: 'sample', seed: path + Date.now().toString(36).slice(-3), look: (_o1f && _o1f.look) || 'city' }); _oq(); }, { kind: 'ghost' }) : null,
_o1f ? K.button('Bỏ ảnh', () => { set(path, null); _oq(); }, { kind: 'ghost', icon: 'x', testid: 'lp-img-del-' + path.replace(/\./g, '-') }) : null), _o12);
}
_oq();
return h('div', null, h('span', { class: 'lb-f' }, label), box);
};
const group = (title, body, { open = false, testid } = {}) => h('details', { open, 'data-testid': testid }, h('summary', null, title), ...[].concat(body));
const sectionFields = {
hero: () => [_o10('Dòng nhỏ trên tiêu đề', 's.hero.eyebrow'), _o10('Tiêu đề lớn', 's.hero.heading', null, { max: 120 }), _o10('Mô tả ngắn', 's.hero.sub', null, { area: true, max: 300 }), _o10('Chữ trên nút', 's.hero.cta', null, { max: 40 }), _o1i('Ảnh bìa', 's.hero.image')],
location: () => [_o10('Vị trí', 's.location.text', 'location', { area: true }), _o10('Tiện ích – mỗi dòng 1 mục', 's.location.items', 'location', { area: true, help: 'Chỉ ghi khoảng cách đã kiểm tra.' })],
price: () => [h('p', { class: 'lb-muted' }, _o2g()), _o10('Ghi chú thêm', 's.price.note', null, { max: 300 })],
policy: () => [h('p', { class: 'lb-muted' }, 'Lấy từ chính sách đang áp dụng trong Thông tin dự án.'), _o10('Ghi chú thêm', 's.policy.note', null, { max: 300 })],
loan: () => [h('div', { class: 'lb-two' }, _o10('Giá căn (tỷ)', 's.loan.price', null, { type: 'number', num: true, inputmode: 'decimal' }), _o10('Vay (% giá)', 's.loan.ltv', null, { type: 'number', num: true }), _o10('Lãi suất (%/năm)', 's.loan.rate', null, { type: 'number', num: true, inputmode: 'decimal' }), _o10('Thời hạn (năm)', 's.loan.years', null, { type: 'number', num: true }))],
gallery: () => {
const box = h('div');
const _oq = () => {
const imgs = cfg.s.gallery.images || [];
box.replaceChildren(...imgs.map((_, _o1d) => h('div', null, _o1i('Ảnh ' + (_o1d + 1), 's.gallery.images.' + _o1d), K.button('Bỏ ảnh ' + (_o1d + 1), () => { cfg.s.gallery.images.splice(_o1d, 1); _o3b(); _oq(); }, { kind: 'ghost' }))),
imgs.length < 9 ? K.button('＋ Thêm ảnh', () => { cfg.s.gallery.images.push({ kind: 'sample', seed: 'g' + Date.now().toString(36), look: 'city' }); _o3b(); _oq(); }, { kind: 'ghost', testid: 'lp-gal-add' }) : null);
};
_oq();
return [box];
},
form: () => [h('p', { class: 'lb-note' }, 'Ô "Tôi đồng ý…" (đồng ý lưu dữ liệu cá nhân – theo Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15) luôn có và bắt buộc tick – không tắt được.'), _o10('Tiêu đề form', 's.form.heading'), _o10('Dòng giải thích', 's.form.sub', null, { max: 200 }), _o10('Chữ trên nút gửi', 's.form.button', null, { max: 40 }), _o11('Hỏi thêm loại căn / nhu cầu / số người', 's.form.interest', 'lp-f-form-interest')],
contact: () => [h('p', { class: 'lb-muted' }, 'Nút Zalo + Gọi dính cuối màn hình điện thoại. Số lấy ở nhóm "Liên hệ".')],
doc: () => [h('p', { class: 'lb-note', 'data-testid': 'lp-doc-note' }, 'Dành cho trang landing dự án: khách để lại số Zalo trên trang mới nhận tài liệu (mặt bằng, bảng giá, brochure).'
+ (_o1q() ? '' : ' Muốn đếm khách nhận từng tài liệu: dùng mục "Tài liệu đổi số Zalo (landing dự án)" (Gói 1 · Tìm khách online).')),
_o10('Tên tài liệu', 's.doc.title', 'doc', { max: 160 }), _o10('Mô tả', 's.doc.desc', 'doc', { max: 200 }), _o10('Chữ trên nút', 's.doc.button', 'doc', { max: 40 }),
_o10('Link tài liệu (tuỳ chọn, https://…)', 's.doc.url', 'doc', { help: 'Hiện sau khi khách gửi số. Link nằm trong mã trang – tài liệu nhạy cảm thì để trống, chuyên viên gửi qua Zalo.' })],
facts: () => [_o10('Thông tin căn – mỗi dòng "Tên: giá trị"', 's.facts.items', 'facts', { area: true })],
event: () => [h('div', { class: 'lb-two' }, _o10('Ngày', 's.event.date', 'event', { type: 'date' }), _o10('Giờ', 's.event.time', 'event', { type: 'time' })), _o10('Địa điểm', 's.event.place', 'event', { area: true, max: 300 }), _o10('Chương trình – mỗi dòng 1 mục', 's.event.agenda', 'event', { area: true })],
agent: () => [_o10('Giới thiệu', 's.agent.bio', 'agent', { area: true }), _o10('Điểm mạnh – mỗi dòng 1 ý', 's.agent.bullets', 'agent', { area: true })],
intro: () => [h('p', { class: 'lb-muted' }, 'Chủ đầu tư, quy mô, pháp lý, tiến độ, tiện ích tự lấy từ dự án trong Thông tin dự án – mục nào chưa có dữ liệu tự ẩn.'), _o10('Đoạn giới thiệu thêm', 's.intro.text', null, { area: true, max: 800 })],
usps: () => [_o10('Điểm nổi bật – mỗi dòng 1 ý', 's.usps.items', null, { area: true, max: 900, help: 'Chỉ ghi điều có nguồn. Để trống thì mục tự ẩn.' })],
cashflow: () => [h('p', { class: 'lb-muted' }, 'Các đợt thanh toán của phương án vay cao nhất trong chính sách đang áp dụng (Thông tin dự án). Chưa có giá/chính sách thì mục tự ẩn.'), _o10('Ghi chú thêm', 's.cashflow.note', null, { max: 300 })],
reasons: () => [_o10('Ngày ra mắt dự kiến (có thì hiện đếm ngược)', 's.reasons.date', null, { type: 'date' }), _o10('Lý do – mỗi dòng 1 ý', 's.reasons.items', null, { area: true, max: 600 })],
steps: () => [_o10('Các bước – mỗi dòng 1 bước', 's.steps.items', null, { area: true, max: 600 })],
booking: () => [h('p', { class: 'lb-note' }, 'Form booking hỏi dự án, loại căn, tầng, hướng, cách thanh toán. Trang không thu tiền – khách về danh sách Khách hàng kèm nhu cầu.'),
_o10('Tiêu đề', 's.booking.heading', null, { max: 120 }), _o10('Dòng giải thích', 's.booking.sub', null, { area: true, max: 300 }), _o10('Chữ trên nút', 's.booking.button', null, { max: 40 }),
_o10('Cách thanh toán – mỗi dòng 1 lựa chọn', 's.booking.pay', null, { area: true, max: 300 })],
listings: () => [_o10('Tiêu đề', 's.listings.heading', null, { max: 120 }), _o10('Dòng giải thích', 's.listings.sub', null, { area: true, max: 300 }), h('p', { class: 'lb-muted' }, 'Danh sách căn: nhóm "🔑 Rổ hàng" bên dưới.')],
kygui: () => [_o10('Tiêu đề', 's.kygui.heading', null, { max: 120 }), _o10('Dòng giải thích', 's.kygui.sub', null, { area: true, max: 300 }), _o10('Chữ trên nút', 's.kygui.button', null, { max: 40 })],
projects: () => [h('div', { class: 'lb-col' }, env.projects.length ? null : h('p', { class: 'lb-note', 'data-testid': 'lp-proj-none' }, 'Chưa có dự án nào – thêm ở Thông tin dự án rồi tick ở đây.'), env.projects.map((_o28) => {
const cb = h('input', { type: 'checkbox', checked: cfg.projects.includes(_o28.id), 'data-testid': 'lp-proj-' + _o28.id });
cb.addEventListener('change', () => { cfg.projects = cb.checked ? [...new Set([...cfg.projects, _o28.id])].slice(0, 12) : cfg.projects.filter((_o3j) => _o3j !== _o28.id); _o3b(); });
return h('label', { class: 'lb-sw' }, cb, h('span', null, _o28.name));
}))]
};
function _o2g() {
const d = dataFor(cfg);
const rows = L.priceRows(d.project, d.plans);
if (!d.project) return 'Chưa gắn dự án – chọn dự án ở nhóm "Mẫu & dự án".';
return rows.length ? `Lấy tự động từ Thông tin dự án: ${d.project.name} · ${L.priceLabel(d.project)} · ${d.policy ? S.policyLabel(d.policy) : 'Giá tham khảo'} (${rows.length} loại căn).` : 'Dự án chưa có giá trong Thông tin dự án – mục này sẽ ẩn trên trang.';
}
const _o30 = h('div', { class: 'lb-ed' });
const _o3 = ['price', 'policy', 'loan', 'cashflow'];
const _o31 = (id) => LG.goalSectionOn(id, cfg.goals) !== false && !(cfg.infoOnly && _o3.includes(id));
function _ov() {
_o30.replaceChildren(...cfg.order.map((id, _o1d) => {
if (!_o31(id)) return null;
const cb = h('input', { type: 'checkbox', checked: !!cfg.on[id], disabled: id === 'hero', 'aria-label': 'Bật ' + L.SECTIONS[id], 'data-testid': 'lp-on-' + id });
cb.addEventListener('change', () => { cfg.on[id] = cb.checked; _o3b(); });
const _o20 = (d) => { let _o1m = _o1d + d; while (_o1m > 0 && _o1m < cfg.order.length && !_o31(cfg.order[_o1m])) _o1m += d; if (_o1m < 1 || _o1m >= cfg.order.length || _o1d === 0) return; const o = cfg.order.slice(); [o[_o1d], o[_o1m]] = [o[_o1m], o[_o1d]]; cfg.order = o; _o3b(); _ov(); };
const _o1c = h('div', { class: 'lb-sec' }, h('label', { class: 'lb-sw' }, cb), h('span', { class: 'lb-t' }, L.SECTIONS[id]),
(cfg.samples || []).includes(id) ? h('span', { class: 'lb-mau', 'data-testid': 'lp-mau-' + id }, 'Mẫu') : null,
_o1d > 0 ? h('button', { type: 'button', class: 'lb-ic', 'aria-label': 'Đưa lên', disabled: _o1d < 2, title: _o1d < 2 ? 'Mục đầu trang (ảnh bìa) đứng yên' : 'Đưa lên', onclick: (e) => { e.preventDefault(); _o20(-1); } }, K.icon('up', 18) || '↑') : null,
_o1d > 0 ? h('button', { type: 'button', class: 'lb-ic', 'aria-label': 'Đưa xuống', disabled: _o1d >= cfg.order.length - 1, title: _o1d >= cfg.order.length - 1 ? 'Đã ở cuối trang' : 'Đưa xuống', onclick: (e) => { e.preventDefault(); _o20(1); } }, K.icon('down', 18) || '↓') : null);
const d = h('details', { 'data-testid': 'lp-sec-' + id }, h('summary', null, _o1c));
let _o13 = false;
d.addEventListener('toggle', () => { if (d.open && !_o13) { _o13 = true; d.append(...sectionFields[id]()); } });
return d;
}).filter(Boolean));
}
_ov();
const _o2l = h('div', { class: 'lb-pub', 'data-testid': 'lp-publish' });
const _o1g = async () => {
const _o27 = {};
for (const _o3j of L.allImages(cfg)) if (_o3j.img.kind === 'local') { const _o2r = await _o1h(_o3j.img.id); if (_o2r) _o27[_o3j.img.id] = _o2r; }
return _o27;
};
const _o1n = async (fix, close) => {
if (close) close();
const _o17 = fix.group && _o2w.querySelector('[data-testid="' + fix.group + '"]');
if (_o17 && !_o17.open) _o17.open = true;
if (fix.sec) { const d = _o2w.querySelector('[data-testid="lp-sec-' + fix.sec + '"]'); if (d && !d.open) { d.open = true; d.dispatchEvent(new Event('toggle')); } }
await new Promise((_o2r) => setTimeout(_o2r, 30));
const el = (fix.field && _o2w.querySelector('[data-testid="' + fix.field + '"]')) || (fix.sec && _o2w.querySelector('[data-testid="lp-sec-' + fix.sec + '"]')) || _o17;
if (!el) return;
try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch { el.scrollIntoView(); }
const _oy = /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) ? el : el.querySelector('input:not([type=file]), textarea, select, button');
if (_oy) try { _oy.focus({ preventScroll: true }); } catch { }
el.classList.add('lb-flash'); setTimeout(() => el.classList.remove('lb-flash'), 1600);
};
const _oj = (list, close, testid = 'lp-checks') => list.length ? h('div', null,
list.some((_og) => _og.level === 'error') ? h('p', { class: 'lb-muted', 'data-testid': testid + '-lead' }, 'Sửa các mục ⛔ trước khi đăng (xem trước vẫn dùng được):') : null,
h('ul', { class: 'lb-checks', 'data-testid': testid }, list.map((_og, _o1d) => h('li', { class: _og.level === 'error' ? 'e' : 'w', dataset: _og.fix ? { fixSec: _og.fix.sec || '', fixField: _og.fix.field || '' } : undefined },
h('span', { class: 'lb-ck-t' }, (_og.level === 'error' ? '⛔ ' : '⚠️ ') + _og.text),
_og.fix ? h('span', { class: 'lb-ck-a' },
K.button('Sửa', () => _o1n(_og.fix, close), { kind: 'ghost', small: true, icon: 'next', testid: (testid === 'lp-checks' ? 'lp-fix-' : testid + '-fix-') + _o1d }),
_og.fix.phone && !profile.phone ? K.button(ADD_PHONE, () => askMyPhone(K, { onSaved: (ph) => { profile.phone = ph; set('contact.phone', ph); if (!get('contact.zalo')) set('contact.zalo', ph); if (close) close(); _ou(); } }), { kind: 'primary', small: true, icon: 'phone', testid: 'lp-add-phone' }) : null) : null))))
: h('p', { class: 'sl-ok' }, '✅ Trang sẵn sàng.');
async function exportZip() {
const imgs = await _o1g();
const _oi = L.checkLanding(cfg, dataFor(cfg), { server: serverUrl, mode: 'zip', images: imgs });
if (_oi.some((_og) => _og.level === 'error')) { const _of = K.modal({ title: 'Chưa tải được', body: _oj(_oi, () => _of.close()), testid: 'lp-zip-blocked' }); return; }
const images = {};
for (const [id, _o2r] of Object.entries(imgs)) images[id] = { bytes: _oc(_o2r.dataUrl), ext: _o2r.ext };
const { files } = L.exportFiles(cfg, dataFor(cfg), { server: serverUrl, images });
const bytes = zipStore(files.map((_oy) => ({ name: cfg.slug + '/' + _oy.name, data: _oy.data })));
const _oe = new Blob([bytes], { type: 'application/zip' });
const _o4 = document.createElement('a'); _o4.href = URL.createObjectURL(_oe); _o4.download = cfg.slug + '.zip'; _o4.rel = 'noopener';
document.body.appendChild(_o4); _o4.click(); _o4.remove(); setTimeout(() => URL.revokeObjectURL(_o4.href), 4000);
cfg.published = { ...cfg.published, zip: { at: Date.now() } }; _o3b();
K.toast('Đã tải ' + cfg.slug + '.zip – làm theo hướng dẫn trong tệp HUONG_DAN_DUA_LEN_MANG.txt', 'ok');
}
async function quickPublish() {
const imgs = await _o1g();
const _oi = L.checkLanding(cfg, dataFor(cfg), { server: serverUrl || (_op ? 'demo' : ''), mode: 'gas', images: imgs });
if (_oi.some((_og) => _og.level === 'error')) { const _of = K.modal({ title: 'Chưa xuất bản được', body: _oj(_oi, () => _of.close()), testid: 'lp-gas-blocked' }); return; }
const dataUrls = {}; for (const [id, _o2r] of Object.entries(imgs)) dataUrls[id] = _o2r.dataUrl;
const html = L.gasHtml(cfg, dataFor(cfg), { server: serverUrl, dataUrls });
try {
const _o25 = cfg.published && cfg.published.gas && cfg.published.gas.slug;
const _o2r = await K.api('landing.publish', { slug: cfg.slug, html, landing_id: cfg.id, title: cfg.name });
if (_o25 && _o25 !== cfg.slug) { try { await K.api('landing.unpublish', { slug: _o25 }); } catch { } }
cfg.published = { ...cfg.published, gas: { slug: _o2r.slug, at: _o2r.at, url: _o2r.url || L.gasPageUrl(serverUrl, _o2r.slug) } };
_o3b(); _ou();
K.toast('Đã xuất bản nhanh', 'ok');
} catch (e) { if (_o1k(e)) _o1r(e.message); else K.toast((e && e.message) || 'Chưa xuất bản được', 'warn'); }
}
async function appPublish() {
if (!appT) return;
if (!AP.validPage(cfg.slug)) { K.toast('Đường dẫn trang chỉ gồm chữ thường không dấu, số và dấu gạch nối (3–50 ký tự) – sửa ở mục SEO.', 'warn'); return; }
const imgs = await _o1g();
const _oi = L.checkLanding(cfg, dataFor(cfg), { server: serverUrl || (_op ? 'demo' : ''), mode: 'gas', images: imgs });
if (_oi.some((_og) => _og.level === 'error')) { const _of = K.modal({ title: 'Chưa đăng được', body: _oj(_oi, () => _of.close()), testid: 'lp-app-blocked' }); return; }
let _o2j;
try { _o2j = await K.api('landing.app_proof'); } catch (e) { K.toast((e && e.message) || 'Máy chủ chưa hỗ trợ – cập nhật máy chủ rồi thử lại.', 'warn'); return; }
const exec = AP.EXEC_RE.test(String(_o2j.exec || '')) ? _o2j.exec : (AP.EXEC_RE.test(serverUrl) ? serverUrl : '');
if (!exec) { K.toast('Chưa nối máy chủ Google thật (đang xem thử) – kết nối máy chủ ở Cài đặt › Kết nối rồi đăng.', 'warn'); return; }
const url = AP.pageUrl(appT, cfg.slug);
const dataUrls = {}; for (const [id, _o2r] of Object.entries(imgs)) dataUrls[id] = _o2r.dataUrl;
const html = L.appHtml(cfg, dataFor(cfg), { server: exec, dataUrls, pageUrl: url });
const _o25 = cfg.published && cfg.published.app && cfg.published.app.slug;
let _o2r;
try { _o2r = await K.api('landing.publish', { slug: cfg.slug, html, landing_id: cfg.id, title: cfg.name, app: true }); }
catch (e) { if (_o1k(e)) _o1r(e.message); else K.toast((e && e.message) || 'Chưa đăng được', 'warn'); return; }
try { await AP.workerCall(appT, 'dang', { page: _o2r.slug, exec, id_token: _o2j.id_token }); }
catch (e) { K.toast('Đã lưu trang trong máy chủ của anh/chị nhưng chưa bật được địa chỉ trang: ' + ((e && e.message) || 'lỗi') + ' Bấm đăng lại sau ít phút.', 'warn'); return; }
if (_o25 && _o25 !== _o2r.slug) {
const _o19 = cfg.published && cfg.published.gas && cfg.published.gas.slug;
try { if (_o19 !== _o25) await K.api('landing.unpublish', { slug: _o25 }); await AP.workerCall(appT, 'go', { page: _o25, id_token: _o2j.id_token }); } catch { }
}
cfg.published = { ...cfg.published, app: { slug: _o2r.slug, at: _o2r.at, url } };
if (!L.normBaseUrl(cfg.seo.base_url) && L.normBaseUrl(url)) { cfg.seo.base_url = url; const _od = _o2w.querySelector('[data-testid="lp-f-seo-base_url"]'); if (_od) _od.value = url; }
_o3b(); _ou();
K.toast(_o25 ? 'Đã cập nhật trang – nơi khác thấy bản mới trong tối đa ' + AP.CACHE_MIN + ' phút' : 'Đã đăng trang lên địa chỉ app', 'ok');
}
async function _o8() {
const slug = cfg.published && cfg.published.app && cfg.published.app.slug; if (!slug) return;
const ok = await K.confirm({ title: 'Gỡ trang', text: 'Gỡ trang khỏi địa chỉ app? Ai mở link sẽ thấy "Không tìm thấy trang" (chậm nhất ' + AP.CACHE_MIN + ' phút). Thiết kế và khách đã để lại số vẫn giữ nguyên.', ok: 'Gỡ trang', kind: 'danger', testid: 'lp-app-remove-confirm' });
if (!ok) return;
let _o2u;
try { _o2u = await _o9(slug); } catch (e) { K.toast((e && e.message) || 'Chưa gỡ được', 'warn'); return; }
const _o28 = { ...cfg.published }; delete _o28.app; if (_o28.gas && _o28.gas.slug === slug) delete _o28.gas; cfg.published = _o28;
_o3b(); _ou();
K.toast(_o2u.worker ? 'Đã gỡ trang' : 'Đã gỡ trang trong máy chủ của anh/chị – link ngừng chạy chậm nhất sau ' + AP.CACHE_MIN + ' phút', 'ok');
}
async function unpublish() {
const slug = cfg.published && cfg.published.gas && cfg.published.gas.slug; if (!slug) return;
try { await K.api('landing.unpublish', { slug }); } catch (e) { K.toast((e && e.message) || 'Chưa gỡ được', 'warn'); return; }
const _o28 = { ...cfg.published }; delete _o28.gas; cfg.published = _o28; _o3b(); _ou(); K.toast('Đã gỡ trang Xuất bản nhanh', 'ok');
}
const goConnect = () => K.nav('#/settings/connection/server');
const fmtDay = (at) => S.todayISO(new Date(at)).split('-').reverse().join('/');
function _o1s(url, prefix, remove) {
let _o2q = null;
try { _o2q = qrElement(url, { scale: 3, title: 'Mã QR mở trang' }); } catch { _o2q = null; }
return h('div', { class: 'lb-qr', 'data-testid': 'lp-now-result' },
_o2q ? h('span', { 'data-testid': 'lp-now-qr' }, _o2q) : null,
h('div', { style: 'display:flex;flex-direction:column;flex:1 1 16em;min-width:0;gap:8px' },
h('div', { class: 'lb-link' }, h('code', { 'data-testid': prefix + '-url' }, url)),
h('div', { class: 'lb-row' },
K.button('Chép link', async () => { await K.copy(url); K.toast('Đã chép link', 'ok'); }, { kind: 'primary', icon: 'copy', testid: prefix + '-copy' }),
K.button('Mở trang', () => { try { window.open(url, '_blank', 'noopener'); } catch { } }, { kind: 'ghost', icon: 'external', testid: prefix + '-open' }),
remove ? K.button('Gỡ trang', remove, { kind: 'ghost', icon: 'x', testid: prefix + '-remove' }) : null),
h('span', { class: 'lb-muted' }, 'Quét mã QR bằng điện thoại để mở thử trang.')));
}
function _o23() {
if (appT) {
const _o2k = cfg.published && cfg.published.app;
const url = _o2k ? (_o2k.url || AP.pageUrl(appT, _o2k.slug)) : AP.pageUrl(appT, cfg.slug);
return h('div', { class: 'lb-app lb-now', 'data-testid': 'lp-now', 'data-way': 'app' },
h('h3', null, '🚀 Đăng ngay · khuyên dùng'),
h('p', { class: 'lb-muted' }, 'Một bấm là trang chạy ở địa chỉ app của anh/chị – không cần tài khoản Cloudflare, không kéo thả. Khách để lại số về thẳng máy chủ Google của anh/chị + Telegram.'),
h('div', { class: 'lb-row' }, K.button(_o2k ? 'Cập nhật trang' : 'Đăng ngay', appPublish, { kind: 'primary', icon: _o2k ? 'refresh' : 'cloud', cls: 'lb-big', testid: 'lp-app-publish' })),
h('div', { class: _op || !serverUrl ? 'lb-gap lb-need' : 'lb-muted lb-need', 'data-testid': 'lp-now-need' },
_op || !serverUrl ? h('span', null, 'Cần: nối máy chủ Google của anh/chị (Cài đặt › Kết nối) – đang xem thử nên chưa đăng trang thật được.') : h('span', null, 'Cần: máy chủ Google đã nối ✓ và là bản mới (báo "máy chủ chưa hỗ trợ" → cập nhật máy chủ ở Cài đặt › Kết nối).'),
K.button(_op || !serverUrl ? 'Nối máy chủ' : 'Mở Kết nối', goConnect, { kind: 'ghost', small: true, icon: 'next', testid: 'lp-now-fix' })),
_o2k ? h('p', { class: 'lb-ok', 'data-testid': 'lp-app-status' }, '✅ Đã đăng ' + fmtDay(_o2k.at) + (_o2k.slug !== cfg.slug ? ' (đường dẫn cũ: ' + _o2k.slug + ' – bấm Cập nhật trang)' : '') + '. Sửa xong bấm "Cập nhật trang"; nơi khác thấy bản mới trong tối đa ' + AP.CACHE_MIN + ' phút.') : h('p', { class: 'lb-muted' }, 'Địa chỉ sẽ là: ' + url),
_o2k ? _o1s(url, 'lp-app', _o8) : null,
_o2k ? h('p', { class: 'lb-muted' }, 'Link riêng từng sale: thêm ?s=<mã sale> vào cuối địa chỉ. Chạy quảng cáo, cần tên miền riêng: xem Nâng cao.') : null);
}
const gas = cfg.published && cfg.published.gas;
const gasUrl = gas ? (gas.url || L.gasPageUrl(serverUrl, gas.slug)) : '';
const ready = !!serverUrl && !_op;
return h('div', { class: 'lb-app lb-now', 'data-testid': 'lp-now', 'data-way': 'gas' },
h('h3', null, '🚀 Đăng ngay · khuyên dùng'),
h('p', { class: 'lb-muted' }, 'Một bấm là trang chạy trên máy chủ Google của anh/chị – không cần tài khoản Cloudflare, không kéo thả, không tải tệp. Khách để lại số về thẳng app + Telegram.'),
h('div', { class: 'lb-row' }, K.button(gas ? 'Cập nhật trang' : 'Đăng ngay', quickPublish, { kind: 'primary', icon: gas ? 'refresh' : 'cloud', cls: 'lb-big', testid: 'lp-gas' })),
h('div', { class: ready ? 'lb-muted lb-need' : 'lb-gap lb-need', 'data-testid': 'lp-now-need' },
h('span', null, ready ? 'Cần: máy chủ Google đã nối ✓' : _op ? 'Cần: nối máy chủ Google của anh/chị (Cài đặt › Kết nối). Đang xem thử – trang lưu trong máy chủ giả, chưa có địa chỉ thật.' : 'Cần: nối máy chủ Google của anh/chị (Cài đặt › Kết nối) – chưa nối thì chưa đăng được.'),
ready ? null : K.button('Nối máy chủ', goConnect, { kind: 'ghost', small: true, icon: 'next', testid: 'lp-now-fix' })),
h('p', { class: 'lb-muted' }, 'Lưu ý: địa chỉ dài dạng script.google.com/…, đầu trang có dải chữ nhỏ của Google, Facebook/Zalo không hiện ảnh xem trước. Chạy quảng cáo / tên miền riêng: xem Nâng cao.'),
gas ? h('p', { class: 'lb-ok', 'data-testid': 'lp-gas-status' }, '✅ Đã xuất bản nhanh ' + fmtDay(gas.at) + (gas.slug !== cfg.slug ? ' (đường dẫn cũ: ' + gas.slug + ' – bấm Cập nhật trang)' : '') + '. Sửa xong bấm "Cập nhật trang".') : null,
gasUrl ? _o1s(gasUrl, 'lp-gas', unpublish) : null);
}
const _o3m = () => h('ol', { class: 'lb-steps', 'data-testid': 'lp-zip-steps' },
h('li', null, 'Bấm "Tải gói trang (.zip)" ở trên, rồi giải nén tệp ', h('b', null, cfg.slug + '.zip'), ' (ra thư mục ', h('b', null, cfg.slug), ').'),
h('li', null, 'Mở ', h('b', null, 'dash.cloudflare.com'), ', đăng nhập (hoặc đăng ký miễn phí) bằng email CỦA ANH/CHỊ.'),
h('li', null, 'Vào ', h('b', null, 'Workers & Pages'), ' → ', h('b', null, 'Create'), ' → chọn ', h('b', null, 'Pages'), ' → chọn cách tải tệp lên (', h('b', null, 'Upload assets'), ' / kéo thả tệp). Tên nút có thể hơi khác theo giao diện Cloudflare.'),
h('li', null, 'Đặt tên dự án đúng bằng đường dẫn trang: ', h('b', null, cfg.slug), ' → tạo dự án.'),
h('li', null, 'Kéo thả thư mục ', h('b', null, cfg.slug), ' đã giải nén (chắc chắn nhất; hoặc tệp .zip) vào ô tải lên → bấm ', h('b', null, 'Deploy'), '.'),
h('li', null, 'Xong: trang chạy ở ', h('b', null, 'https://' + cfg.slug + '.pages.dev'), '. Điền địa chỉ này (hoặc tên miền riêng) vào SEO › Địa chỉ trang rồi tải lại .zip để ảnh chia sẻ Facebook đúng.'));
let _o5 = false;
function _ou() {
const ownUrl = L.normBaseUrl(cfg.seo.base_url) || ('https://' + cfg.slug + '.pages.dev/');
const _o1t = (label, url, testid) => h('div', { class: 'lb-link' }, h('b', null, label), h('code', { 'data-testid': testid }, url), K.button('Chép', async () => { await K.copy(url); K.toast('Đã chép link', 'ok'); }, { kind: 'ghost', icon: 'copy' }));
const imgs = Object.fromEntries([...mem.entries()]);
const _o24 = L.checkLanding(cfg, dataFor(cfg), { server: serverUrl || (_op ? 'demo' : ''), mode: 'gas', images: imgs });
const _o3l = L.checkLanding(cfg, dataFor(cfg), { server: serverUrl, mode: 'zip', images: imgs }).filter((_og) => !_o24.some((_o3j) => _o3j.text === _og.text) && !/máy chủ Google/.test(_og.text));
const gas = cfg.published && cfg.published.gas;
const gasUrl = gas ? (gas.url || L.gasPageUrl(serverUrl, gas.slug)) : '';
const adv = [
h('h3', null, 'Tải gói trang (.zip) – Cloudflare Pages / tên miền riêng'),
h('p', { class: 'lb-muted' }, 'Trang tĩnh, nhanh, hợp chạy quảng cáo: chạy ở <tên-trang>.pages.dev miễn phí hoặc tên miền riêng, trên tài khoản Cloudflare của anh/chị.'),
_o3l.length ? _oj(_o3l, null, 'lp-zip-checks') : null,
h('div', { class: 'lb-row' }, K.button('Tải gói trang (.zip)', exportZip, { kind: 'primary', icon: 'download', testid: 'lp-zip' })),
_o3m(),
h('details', null, h('summary', null, 'Gắn tên miền riêng / host khác (hướng dẫn đầy đủ)'), h('pre', { 'data-testid': 'lp-guide' }, L.DEPLOY_GUIDE.replace(/\{slug\}/g, cfg.slug))),
_o1t('Địa chỉ sau khi đưa lên', ownUrl, 'lp-own-url'),
appT ? h('h3', null, 'Xuất bản nhanh (máy chủ Google của anh/chị)') : null,
appT ? h('p', { class: 'lb-muted' }, 'Địa chỉ dài dạng script.google.com/…/exec?p=' + cfg.slug + ', đầu trang có dải chữ của Google, tải chậm hơn; hợp để chạy thử, gửi Zalo nhanh.') : null,
appT ? h('div', { class: 'lb-row' }, K.button(gas ? 'Cập nhật trang xuất bản nhanh' : 'Xuất bản nhanh', quickPublish, { kind: 'ghost', icon: gas ? 'refresh' : 'cloud', testid: 'lp-gas' }),
gas ? K.button('Gỡ trang', unpublish, { kind: 'ghost', icon: 'x', testid: 'lp-gas-remove' }) : null) : null,
appT && gas ? h('p', { class: 'lb-ok', 'data-testid': 'lp-gas-status' }, '✅ Đã xuất bản nhanh ' + fmtDay(gas.at)) : null,
appT && gasUrl ? _o1t('Địa chỉ xuất bản nhanh', gasUrl, 'lp-gas-url') : null].filter(Boolean);
const more = h('details', { class: 'lb-more', 'data-testid': 'lp-more', open: _o5 }, h('summary', null, 'Nâng cao: tải gói .zip (Cloudflare Pages, tên miền riêng)' + (appT ? ' · Xuất bản nhanh' : '')), ...adv);
more.addEventListener('toggle', () => { _o5 = more.open; });
_o2l.replaceChildren(_oj(_o24), _o23(),
more,
h('h3', null, 'Link gắn nguồn'),
h('p', { class: 'lb-muted' }, 'Thêm vào cuối địa chỉ trang: ?v=<mã video>&utm_source=tiktok&utm_campaign=<chiến dịch> – khách để lại số sẽ ghi rõ đến từ video/kênh nào. ?s=<mã sale> – tự giao khách cho sale (mã ở danh sách trang).'));
}
_ou(); _o2m = true;
const projOpts = () => [['', '— Không gắn dự án —'], ...env.projects.map((_o28) => [_o28.id, _o28.name])].map(([v, l]) => h('option', { value: v, selected: v === cfg.project_id }, l));
const _o2h = h('select', { 'data-testid': 'lp-project' }, projOpts());
_o2h.addEventListener('change', async () => {
cfg.project_id = _o2h.value;
const _o28 = env.project(_o2h.value);
if (_o28 && await K.confirm({ title: 'Điền lại từ Thông tin dự án', text: `Điền lại tiêu đề, vị trí, khoản vay, SEO theo "${_o28.name}"? Nội dung khác giữ nguyên.`, ok: 'Điền lại', testid: 'lp-refill' })) {
const fresh = L.newLanding({ id: cfg.id, template: cfg.template, project: _o28, profile, data: { plans: env.plansFor(_o28).plans, cfg: env.cfg }, goals: cfg.goals, infoOnly: cfg.infoOnly });
cfg.s.hero = { ...fresh.s.hero, image: cfg.s.hero.image }; cfg.s.location = fresh.s.location; cfg.s.loan = fresh.s.loan; cfg.seo = { ...cfg.seo, title: fresh.seo.title, description: fresh.seo.description };
if (L.isMainTemplate(cfg.template)) { cfg.s.usps = fresh.s.usps; cfg.on.location = !!_o28.loc; if (!cfg.projects.includes(_o28.id)) cfg.projects = [_o28.id, ...cfg.projects].slice(0, 12); }
else if (!cfg.samples.includes('location')) cfg.samples = [...cfg.samples, 'location'];
_ov();
}
_o3b(); _ou();
});
const _o2d = (_o1o) => h('div', { class: 'lb-two' }, _o11(L.PIXEL_NAMES[_o1o], `pixels.${_o1o}.on`, 'lp-px-' + _o1o), _o10('Mã ID', `pixels.${_o1o}.id`, null, { max: 40, ph: _o1o === 'fb' ? '123456789012345' : _o1o === 'tiktok' ? 'C1ABCD2EFGH3IJ' : 'G-XXXXXXX' }));
const _o3c = K.select([...L.MAIN_TEMPLATE_IDS, ...L.BASIC_TEMPLATE_IDS].map((id) => [id, L.TEMPLATES[id].icon + ' ' + L.TEMPLATES[id].title + (L.isMainTemplate(id) && LG.fitsGoals(id, cfg.goals) ? ' ⭐' : '')]), cfg.template, { 'data-testid': 'lp-tpl-switch' });
_o3c.addEventListener('change', () => { cfg = L.switchTemplate(cfg, _o3c.value); _ov(); _o3b(); });
const _o1a = h('div', { class: 'lb-col', role: 'group', 'aria-label': 'Mục tiêu trang' });
const _os = () => _o1a.replaceChildren(...LG.GOALS.map((_o17) => {
const cb = h('input', { type: 'checkbox', checked: cfg.goals.includes(_o17), 'data-testid': 'lp-ed-goal-' + _o17 });
cb.addEventListener('change', () => {
const next = cb.checked ? [...cfg.goals, _o17] : cfg.goals.filter((_o3j) => _o3j !== _o17);
if (!next.length) { cb.checked = true; K.toast('Trang cần ít nhất 1 mục tiêu', 'warn'); return; }
cfg = L.applyGoals(cfg, next); _ov(); _ot(); _o3b();
});
return h('label', { class: 'lb-sw' }, cb, h('span', null, LG.GOAL_INFO[_o17].icon + ' ' + LG.GOAL_INFO[_o17].title));
}));
_os();
const infoCb = h('input', { type: 'checkbox', checked: !!cfg.infoOnly, 'data-testid': 'lp-ed-info' });
infoCb.addEventListener('change', () => { cfg.infoOnly = infoCb.checked; _ov(); _o3b(); });
const _o6 = K.button('Thêm dự án bằng AI', () => _o26(async (pid) => { _o2h.replaceChildren(...projOpts()); _o2h.value = pid; _o2h.dispatchEvent(new Event('change')); }), { icon: 'sparkle', small: true, testid: 'lp-ed-ai-add' });
const _o1v = h('div', { class: 'lb-col' });
const listGroup = group('🔑 Rổ hàng (Đang bán / Cho thuê)', [_o1v], { testid: 'lp-g-list' });
function _ot() {
listGroup.hidden = !cfg.goals.includes('thu_cap');
const state = h('p', { class: 'lb-muted', 'data-testid': 'lp-list-state' });
const _o3h = () => { const _o1l = LG.listingItems(cfg, inventory); const _ob = _o1l.filter((_o3j) => _o3j.loai === 'ban').length; state.textContent = _o1l.length ? `${_o1l.length} căn trên trang (${_ob} đang bán · ${_o1l.length - _ob} cho thuê).` : 'Chưa có căn nào – trang hiện ô nhận nhu cầu.'; };
const inv = h('input', { type: 'checkbox', checked: cfg.useInventory !== false, disabled: !inventory.length, 'data-testid': 'lp-list-inv' });
inv.addEventListener('change', () => { cfg.useInventory = inv.checked; _o3b(); _o3h(); });
const ta = h('textarea', { class: 'lb-list-ta', rows: 6, 'data-testid': 'lp-list-paste', placeholder: LG.LIST_HEAD.join('\t') + '\nBán\tDự án A\tA1.1205\tA1\t12\t2PN\t65\tĐông Nam\t3,2 tỷ\tCơ bản\tCăn góc' });
ta.value = LG.listingsText(cfg.listings);
_o1v.replaceChildren(
h('label', { class: 'lb-sw' }, inv, h('span', null, inventory.length ? `Lấy ${inventory.length} căn đang chào từ Giỏ hàng thứ cấp` : 'Giỏ hàng thứ cấp chưa có căn đang chào')),
h('label', { class: 'lb-f' }, h('span', null, 'Dán thêm từ Excel / Google Sheet – mỗi dòng 1 căn'), ta,
h('small', null, 'Cột: ' + LG.LIST_HEAD.join(' | ') + '. Mã căn tự che 2 ký tự cuối trên trang.')),
h('div', { class: 'lb-row' }, K.button('Cập nhật rổ hàng', () => { cfg.listings = LG.parseListings(ta.value); ta.value = LG.listingsText(cfg.listings); _o3b(); _o3h(); K.toast('Đã cập nhật rổ hàng: ' + cfg.listings.length + ' căn dán', 'ok'); }, { kind: 'primary', icon: 'refresh', testid: 'lp-list-apply' })),
state);
_o3h();
}
_ot();
const T = L.TEMPLATES[cfg.template];
const nameIn = _o10('Tên trang (chỉ trong app)', 'name', null, { max: 80 });
const ed = h('div', { class: 'lb-ed lb-hide' },
group('🧩 Mẫu, mục tiêu & dự án', [h('label', { class: 'lb-f' }, h('span', null, 'Mẫu'), _o3c), h('div', { class: 'lb-f' }, h('span', null, 'Mục tiêu trang'), _o1a), nameIn,
h('label', { class: 'lb-f' }, h('span', null, 'Dự án trong Thông tin dự án'), _o2h), h('div', { class: 'lb-row' }, _o6),
h('label', { class: 'lb-sw lb-info' }, infoCb, h('span', null, h('b', null, 'Chỉ giới thiệu'), ' – ẩn giá, chính sách, tính vay; khách chỉ để lại số điện thoại'))], { open: true, testid: 'lp-g-base' }),
group('🎨 Màu & chữ', [_o10('Tên thương hiệu (thanh trên cùng)', 'brand.name', null, { max: 60 }), h('div', { class: 'lb-two' }, _oz('Màu chính', 'brand.c1'), _oz('Màu nhấn', 'brand.c2')),
(() => { const s = K.select([['serif', 'Sang trọng (chữ có chân)'], ['sans', 'Hiện đại (không chân)']], cfg.brand.font, { 'data-testid': 'lp-font' }); s.addEventListener('change', () => set('brand.font', s.value)); return h('label', { class: 'lb-f' }, h('span', null, 'Kiểu chữ tiêu đề'), s); })()]),
group('🧱 Các mục trên trang (bật/tắt, thứ tự, nội dung)', [_o30], { testid: 'lp-g-sections' }),
listGroup,
group('📞 Liên hệ', [_o10('Họ tên', 'contact.name', null, { max: 80 }), _o10('Chức danh', 'contact.title', null, { max: 80 }), h('div', { class: 'lb-two' }, _o10('Số điện thoại', 'contact.phone', null, { type: 'tel', inputmode: 'tel', autocomplete: 'tel', max: 20 }), _o10('Số Zalo', 'contact.zalo', null, { type: 'tel', inputmode: 'tel', autocomplete: 'tel', max: 20 })),
_o10('Số chứng chỉ hành nghề', 'contact.cert', null, { max: 40 }), _o10('Nơi hành nghề (công ty)', 'contact.company', null, { max: 120 }), _o1i('Ảnh đại diện', 'contact.avatar')], { testid: 'lp-g-contact' }),
group('🔎 SEO & chia sẻ', [
_o10('Đường dẫn trang', 'slug', null, { max: 50, help: 'chữ thường không dấu, số, gạch nối – cũng là tên dự án Cloudflare Pages', on: () => _ou() }),
_o10('Tiêu đề (Google, Facebook)', 'seo.title', null, { max: 90, count: 70 }), _o10('Mô tả', 'seo.description', null, { area: true, max: 300, count: 160 }),
_o10('Địa chỉ trang (tên miền) – điền sau khi gắn', 'seo.base_url', null, { max: 200, ph: 'https://duan-abc.vn/', on: () => _ou() }),
_o1i('Ảnh khi chia sẻ (1200×630, ảnh tự chụp)', 'seo.og_image', { allowSample: false })], { testid: 'lp-g-seo' }),
group('📈 Đo lường quảng cáo (tắt sẵn)', [h('p', { class: 'lb-muted' }, 'Chỉ dán MÃ ID – app tự chèn đoạn mã chuẩn. Bật pixel = trang có thêm dòng thông báo đo lường trong chính sách dữ liệu. Không gửi họ tên/SĐT khách cho pixel.'), _o2d('fb'), _o2d('tiktok'), _o2d('google')], { testid: 'lp-g-pixels' }),
group('🚀 Xuất bản', [_o2l], { testid: 'lp-g-publish' }));
const tabs = h('div', { class: 'lb-tabs', role: 'tablist' });
const split = h('div', { class: 'lb-split' }, ed, _o2n);
let _o39 = 'edit';
const _ow = () => {
tabs.replaceChildren(
h('button', { type: 'button', role: 'tab', class: _o39 === 'edit' ? 'on' : '', 'aria-selected': String(_o39 === 'edit'), 'data-testid': 'lp-tab-edit', onclick: () => { _o39 = 'edit'; _ow(); } }, '✏️ Sửa'),
h('button', { type: 'button', role: 'tab', class: _o39 === 'view' ? 'on' : '', 'aria-selected': String(_o39 === 'view'), 'data-testid': 'lp-tab-view', onclick: () => { _o39 = 'view'; _ow(); _o2a(); } }, '👁️ Xem trước'));
ed.style.display = _o39 === 'edit' ? 'flex' : 'none';
_o2n.style.display = _o39 === 'view' ? 'flex' : 'none';
};
_o2w.replaceChildren(
h('div', { class: 'lb-row lb-sp' }, K.button('← Danh sách trang', async () => { clearTimeout(_o2z); await _o2y(cfg); if (_o2v) _o2v.disconnect(); _o1w(); }, { kind: 'ghost', testid: 'lp-back' }),
h('span', { class: 'lb-muted' }, 'Tự lưu')),
...(cfg.from_unit ? [h('p', { class: 'lb-note', 'data-testid': 'lp-from-unit' }, `Trang tạo từ Lên căn${cfg.from_unit.code ? ' (căn ' + cfg.from_unit.code + ')' : ''}: đã điền thông tin căn và ảnh chọn "Dùng đăng trang". Anh/chị xem lại, sửa nếu cần rồi tự bấm xuất bản ở nhóm "🚀 Xuất bản" – app không tự xuất bản.`)] : []),
tabs, split);
_ow();
layout();
}
}
export default {
manifest: {
id: 'landing_builder', title: 'Trình tạo landing', icon: '🌐', screen: 'customers', order: 50, version: '0.3.0', status: 'ready', pack: 'core',
help: 'Tạo trang landing: chọn mục tiêu (phễu khách dự án mới, gom booking, mua bán – cho thuê chuyển nhượng) rồi 1 trong 10 mẫu (hoặc 4 mẫu cơ bản), thêm dự án bằng AI, tự điền từ Thông tin dự án, xem trước điện thoại/máy tính; đăng lên địa chỉ app bằng 1 bấm, tải gói .zip hoặc Xuất bản nhanh; khách để lại số về app + Telegram, tự giao sale theo link riêng. Gói Cơ bản: 1 landing công ty, mỗi sale được quyền thêm 1 trang riêng; ' + LEADS_PACK + ': không giới hạn.',
},
mount,
async selftest(ctx) {
const details = [];
try {
const env = await S.loadEnv(ctx || {});
const { project: _o28, plans, own } = S.selftestSubject(env);
const policy = own ? env.plansFor(_o28).policy : null;
for (const t of L.TEMPLATE_IDS) {
const cfg = L.newLanding({ id: 'selftest', template: t, project: _o28, profile: { name: 'A', phone: '0912345678' }, data: { plans, cfg: env.cfg }, goals: LG.GOALS });
const { html } = L.renderPage(cfg, { project: _o28, plans, policy, projects: [_o28], cfg: env.cfg }, { target: 'static' });
if (!/name="consent"/.test(html) || !/<\/html>/.test(html)) details.push('Mẫu ' + t + ' dựng thiếu');
}
if (R.lpPhone('+84 912 345 678') !== '0912345678') details.push('Chuẩn hoá SĐT sai');
} catch (e) { details.push('Lỗi: ' + (e && e.message)); }
return { ok: !details.length, details: details.join('; ') || 'Đạt' };
},
};

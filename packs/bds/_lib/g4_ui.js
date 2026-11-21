import { kit, h } from './kit.js';
import { mergeProjects } from './sales.js';
import * as G from './g4_logic.js';
import { addDefaults } from '../../../core/xkit.71d637c634.js';
try {
addDefaults({
'ask.kind.g4_partner': 'Đối tác', 'ask.path.g4_partner': 'customers/g4_doitac?open={id}',
'ask.kind.g4_listing': 'Căn thứ cấp (dữ liệu cũ)', 'ask.kind.g4_booking': 'Giữ chỗ (dữ liệu cũ)',
'ask.kind.g4_priceref': 'Giá tham chiếu (dữ liệu cũ)', 'ask.kind.g4_sitelog': 'Nhật ký công trường (dữ liệu cũ)',
});
} catch { }
const _o0 = 'bds-g4-css';
function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
const _od = document.createElement('link');
_od.id = _o0; _od.rel = 'stylesheet'; _od.href = new URL('./g4.css', import.meta.url).href;
document.head.appendChild(_od);
}
let _oh = false;
let _oe = null;
export { h, G };
export function inCorePack(pack, id) {
const core = pack && Array.isArray(pack.packs) ? pack.packs.find((p) => p && p.id === 'core') : null;
return !!(id && core && Array.isArray(core.modules) && core.modules.includes(id));
}
export function g4kit(ctx, moduleId) {
ensureCss();
const _o1 = kit(ctx);
const core = inCorePack(ctx.pack, moduleId || (ctx.module && ctx.module.id));
const user = ctx.user || null;
const perms = (user && user.perms) || null;
const staff = G.isStaff(user);
let _o7 = [];
const _o2 = Object.assign(_o1, {
G, user, perms, staff, canErase: G.canErase(perms), core,
async loadDir() { if (staff && ctx.users && user && !user.legacy) { try { _o7 = await ctx.users.directory(); } catch { _o7 = []; } } return _o7; },
ownerLabel(id) { if (!id) return ''; if (user && id === user.id) return 'Tôi'; try { return (ctx.users && ctx.users.label(id, _o7)) || ''; } catch { return ''; } },
multiUser: !!(user && !user.legacy && ctx.users && !ctx.solo),
async projectsAll() {
const _o6 = (ctx.data && Array.isArray(ctx.data.projects)) ? ctx.data.projects : [];
try { return mergeProjects(_o6, await _o1.listAll('projects')); } catch { return _o6; }
},
async objects(kind) { return G.ofKind(await _o1.list('objects'), kind); },
head(title, sub, ...actions) {
return h('div', { class: 'bds-head g4-head' },
h('div', null, h('h2', null, title, core ? null : ' ', core ? null : _o1.badge('Thử nghiệm', 'warn')), sub ? h('p', { class: 'bds-muted g4-sub' }, sub) : null),
h('div', { class: 'bds-row bds-wrap' }, actions.filter(Boolean)));
},
scopeSelect(value, onchange) {
if (!staff || !_o2.multiUser) return null;
return _o1.select([['all', 'Tất cả'], ['mine', 'Của tôi']], value, { 'aria-label': 'Phạm vi', 'data-testid': 'g4-scope', onchange: (e) => onchange(e.target.value) });
},
search(value, oninput, placeholder = 'Tìm…') {
const i = h('input', { type: 'search', placeholder, value: value || '', 'aria-label': placeholder, 'data-testid': 'g4-search', class: 'g4-search' });
let t = 0;
const _ob = () => {
i.__typedAt = Date.now(); clearTimeout(t);
t = setTimeout(() => { if (!i.isConnected) return; _oh = typeof document !== 'undefined' && document.activeElement === i; _oe = i; oninput(i.value); }, 200);
};
const _og = _oe;
const _o9 = typeof document !== 'undefined' ? document : null;
const _o4 = !!_og && _og !== i && _og.placeholder === i.placeholder
&& (_oh || (_o9 && _o9.activeElement === _og) || Date.now() - (_og.__typedAt || 0) < 2000);
_oh = false;
_oe = i;
if (_o4) {
const _o5 = (n) => {
try {
if (!i.isConnected) { if (n < 40) setTimeout(() => _o5(n + 1), 50); return; }
if (_og.value !== i.value) { i.value = _og.value; _ob(); }
const _o3 = _o9 && _o9.activeElement;
if (!_o3 || _o3 === _o9.body || _o3 === _og || _o3 === i) { i.focus(); const _of = i.value.length; i.setSelectionRange(_of, _of); }
} catch { }
};
if (typeof queueMicrotask === 'function') queueMicrotask(() => _o5(0)); else setTimeout(() => _o5(0), 0);
}
i.addEventListener('input', _ob);
return i;
},
input(value, attrs = {}) { return h('input', { type: 'text', value: value ?? '', ...attrs }); },
textarea(value, attrs = {}) { const t = h('textarea', { rows: 3, ...attrs }); t.value = value ?? ''; return t; },
date(value, attrs = {}) { return h('input', { type: 'date', value: value || '', ...attrs }); },
moneyInput(value, attrs = {}) {
const i = h('input', { type: 'text', inputmode: 'decimal', value: value ? G.moneyText(value) : '', ...attrs });
const _oc = h('small', { class: 'bds-field-h' });
const _oj = () => { const _ok = G.parseMoney(i.value); _oc.textContent = i.value ? (_ok ? '= ' + G.moneyExact(_ok) : 'Chưa hiểu số tiền, ví dụ: 2,5 tỷ, 800tr') : ''; };
i.addEventListener('input', _oj);
return { el: h('span', { class: 'g4-money' }, i, _oc), input: i, get value() { return G.parseMoney(i.value); } };
},
projectSelect(projects, value, attrs = {}) {
return _o1.select([['', projects.length ? '– Chọn dự án –' : '– Chưa có dự án (thêm ở Thông tin dự án) –'], ...projects.map((p) => [p.id, p.name || p.id])], G.projectKey(projects, value) || value, attrs);
},
links(list, { prefix = 'Link', testid } = {}) {
const ok = (list || []).map((x) => (typeof x === 'string' ? { url: x } : x)).filter((x) => G.safeUrl(x.url));
if (!ok.length) return null;
return h('div', { class: 'g4-links', 'data-testid': testid }, ok.map((x, i) => h('a', { href: G.safeUrl(x.url), target: '_blank', rel: 'noopener noreferrer', class: 'bds-chip' },
(G.isDriveLink(x.url) ? '📎 ' : '🔗 ') + (x.title || (prefix + ' ' + (i + 1))))));
},
linksInput(list, attrs = {}) { return _o2.textarea((list || []).join('\n'), { rows: 2, placeholder: 'Dán link Google Drive / link ảnh, mỗi dòng một link', ...attrs }); },
errorBox() { return h('div', { class: 'bds-error', role: 'alert', 'data-testid': 'g4-form-error' }); },
async removeOrArchive(row, archivedStatus = 'luu_tru') {
if (_o2.canErase) await _o1.put('objects', { ...row, deleted: 1 });
else await _o1.put('objects', { ...row, status: archivedStatus });
},
openQuery() { try { return (ctx.route && ctx.route.query && ctx.route.query.get('open')) || ''; } catch { return ''; } },
apiErrorText(e) {
if (!e) return 'Chưa làm được.';
if (e.missingAction || e.code === 'UNKNOWN_ACTION') return 'Máy chủ chưa có chức năng này – cập nhật máy chủ ở Cài đặt › Phiên bản (nhân viên: nhờ Quản trị). Trong lúc chờ, dùng nút "Làm qua chat Gemini".';
if (e.code === 'NETWORK') return 'Mất mạng – thử lại khi có mạng.';
return e.userMessage || e.message || 'Chưa làm được.';
},
});
return _o2;
}
export async function g4selftest(ctx, render) {
const details = [];
let ok = true;
const _oi = ctx && ctx.store;
for (const _oa of ['list', 'get', 'put']) if (!_oi || typeof _oi[_oa] !== 'function') { ok = false; details.push('Thiếu store.' + _oa); }
if (typeof G.inventoryRows !== 'function') { ok = false; details.push('Thiếu g4_logic'); }
if (ok && render && typeof document !== 'undefined') {
const _o8 = document.createElement('div');
_o8.style.display = 'none';
document.body.appendChild(_o8);
try { await render(_o8); if (!_o8.childNodes.length) { ok = false; details.push('Vẽ thử không ra nội dung'); } }
catch (e) { ok = false; details.push('Vẽ thử lỗi: ' + (e && e.message)); }
finally { _o8.remove(); }
}
return { ok, details: details.length ? details.join('; ') : 'Đạt' };
}
const MODULE_PACK = { g4_phaply: 'closing', g4_giucho: 'closing' };
export function manifest(id, title, icon, order, help) {
return { id, title, icon, screen: 'sales', order, version: '0.1.0', status: 'thu-nghiem', pack: MODULE_PACK[id] || G.PACK, label: 'Thử nghiệm', help };
}

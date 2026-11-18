import { kit, h } from './kit.js';
import { mergeProjects } from './sales.js';
import * as G from './g4_logic.js';
import { addDefaults } from '../../../core/xkit.f03faf0986.js';
try {
addDefaults({
'ask.kind.g4_partner': 'Đối tác', 'ask.path.g4_partner': 'sales/g4_doitac?open={id}',
'ask.kind.g4_listing': 'Căn thứ cấp', 'ask.path.g4_listing': 'sales/g4_giohang?open={id}',
'ask.kind.g4_booking': 'Giữ chỗ', 'ask.path.g4_booking': 'sales/g4_giucho?open={id}',
'ask.kind.g4_priceref': 'Giá tham chiếu', 'ask.path.g4_priceref': 'sales/g4_banggia',
'ask.kind.g4_sitelog': 'Nhật ký công trường', 'ask.path.g4_sitelog': 'sales/g4_congtruong',
});
} catch { }
const _o0 = 'bds-g4-css';
function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
const _oc = document.createElement('link');
_oc.id = _o0; _oc.rel = 'stylesheet'; _oc.href = new URL('./g4.css', import.meta.url).href;
document.head.appendChild(_oc);
}
let _og = false;
let _od = null;
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
let _o6 = [];
const _o2 = Object.assign(_o1, {
G, user, perms, staff, canErase: G.canErase(perms), core,
async loadDir() { if (staff && ctx.users && user && !user.legacy) { try { _o6 = await ctx.users.directory(); } catch { _o6 = []; } } return _o6; },
ownerLabel(id) { if (!id) return ''; if (user && id === user.id) return 'Tôi'; try { return (ctx.users && ctx.users.label(id, _o6)) || ''; } catch { return ''; } },
multiUser: !!(user && !user.legacy && ctx.users && !ctx.solo),
async projectsAll() {
const _o5 = (ctx.data && Array.isArray(ctx.data.projects)) ? ctx.data.projects : [];
try { return mergeProjects(_o5, await _o1.listAll('projects')); } catch { return _o5; }
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
const _oa = () => {
i.__typedAt = Date.now(); clearTimeout(t);
t = setTimeout(() => { if (!i.isConnected) return; _og = typeof document !== 'undefined' && document.activeElement === i; _od = i; oninput(i.value); }, 200);
};
const _of = _od;
const _o8 = typeof document !== 'undefined' ? document : null;
const _o4 = !!_of && _of !== i && _of.placeholder === i.placeholder
&& (_og || (_o8 && _o8.activeElement === _of) || Date.now() - (_of.__typedAt || 0) < 2000);
_og = false;
_od = i;
if (_o4) {
setTimeout(() => {
try {
if (!i.isConnected) return;
if (_of.value !== i.value) { i.value = _of.value; _oa(); }
const _o3 = _o8 && _o8.activeElement;
if (!_o3 || _o3 === _o8.body || _o3 === _of || _o3 === i) { i.focus(); const _oe = i.value.length; i.setSelectionRange(_oe, _oe); }
} catch { }
}, 0);
}
i.addEventListener('input', _oa);
return i;
},
input(value, attrs = {}) { return h('input', { type: 'text', value: value ?? '', ...attrs }); },
textarea(value, attrs = {}) { const t = h('textarea', { rows: 3, ...attrs }); t.value = value ?? ''; return t; },
date(value, attrs = {}) { return h('input', { type: 'date', value: value || '', ...attrs }); },
moneyInput(value, attrs = {}) {
const i = h('input', { type: 'text', inputmode: 'decimal', value: value ? G.moneyText(value) : '', ...attrs });
const _ob = h('small', { class: 'bds-field-h' });
const _oi = () => { const _oj = G.parseMoney(i.value); _ob.textContent = i.value ? (_oj ? '= ' + G.moneyExact(_oj) : 'Chưa hiểu số tiền, ví dụ: 2,5 tỷ, 800tr') : ''; };
i.addEventListener('input', _oi);
return { el: h('span', { class: 'g4-money' }, i, _ob), input: i, get value() { return G.parseMoney(i.value); } };
},
projectSelect(projects, value, attrs = {}) {
return _o1.select([['', '– Chọn dự án –'], ...projects.map((p) => [p.id, p.name || p.id])], G.projectKey(projects, value) || value, attrs);
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
const _oh = ctx && ctx.store;
for (const _o9 of ['list', 'get', 'put']) if (!_oh || typeof _oh[_o9] !== 'function') { ok = false; details.push('Thiếu store.' + _o9); }
if (typeof G.compareListing !== 'function') { ok = false; details.push('Thiếu g4_logic'); }
if (ok && render && typeof document !== 'undefined') {
const _o7 = document.createElement('div');
_o7.style.display = 'none';
document.body.appendChild(_o7);
try { await render(_o7); if (!_o7.childNodes.length) { ok = false; details.push('Vẽ thử không ra nội dung'); } }
catch (e) { ok = false; details.push('Vẽ thử lỗi: ' + (e && e.message)); }
finally { _o7.remove(); }
}
return { ok, details: details.length ? details.join('; ') : 'Đạt' };
}
export function manifest(id, title, icon, order, help) {
return { id, title, icon, screen: 'sales', order, version: '0.1.0', status: 'thu-nghiem', pack: G.PACK, label: 'Thử nghiệm', help };
}

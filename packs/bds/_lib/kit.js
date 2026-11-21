import * as crm from './crm.js';
import * as AC from '../../../core/ai_cost.9624f9fc85.js';
import { mergeProjects } from './sales.js';
const _o2 = new WeakMap();
const _o3 = new WeakSet();
const _o0 = 'bds-crm-css';
export function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
const _oh = document.createElement('link');
_oh.id = _o0; _oh.rel = 'stylesheet';
_oh.href = new URL('./crm.css', import.meta.url).href;
document.head.appendChild(_oh);
}
export function h(tag, attrs, ...kids) {
const el = document.createElement(tag);
if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
for (const [_og, _ot] of Object.entries(attrs || {})) {
if (_ot === undefined || _ot === null || _ot === false) continue;
if (_og === 'class' || _og === 'className') el.className = _ot;
else if (_og === 'style') { if (typeof _ot === 'string') el.style.cssText = _ot; else Object.assign(el.style, _ot); }
else if (_og === 'dataset') Object.assign(el.dataset, _ot);
else if (_og.startsWith('on') && typeof _ot === 'function') el.addEventListener(_og.slice(2).toLowerCase(), _ot);
else if (_og === 'value' || _og === 'checked' || _og === 'selected' || _og === 'disabled') el[_og] = _ot;
else el.setAttribute(_og, _ot === true ? '' : _ot);
}
const add = c => {
if (c === null || c === undefined || c === false) return;
if (Array.isArray(c)) return c.forEach(add);
el.appendChild(c instanceof Node ? c : document.createTextNode(String(c)));
};
kids.forEach(add);
return el;
}
export const kids = (...a) => a.flat(Infinity).filter((c) => c != null && c !== false && c !== true);
const _os = r => (r && typeof r === 'object' && 'ok' in r && 'data' in r) ? (r.ok ? r.data : Promise.reject(r.error || r)) : r;
export function kit(ctx) {
ensureCss();
const ui = ctx.ui || {};
const L = ctx.logic || (typeof window !== 'undefined' ? window.BDSLogic : null) || {};
const store = ctx.store;
const now = () => Date.now();
const _o7 = () => (ctx.data && Array.isArray(ctx.data.projects)) ? ctx.data.projects : [];
const _o1 = {
ctx, crm, h, L, now,
projects: () => (store && typeof store === 'object' && _o2.get(store)) || _o7(),
async loadProjects() {
let rows = [];
try { rows = store ? await store.list('projects') : []; } catch { rows = []; }
let list;
try { list = mergeProjects(_o7(), Array.isArray(rows) ? rows : []); } catch { list = _o7(); }
if (store && typeof store === 'object') _o2.set(store, list);
return list;
},
project: id => _o1.projects().find(_ol => _ol.id === id) || null,
projectName: id => crm.projectName(_o1.projects(), id),
newId: () => { try { const id = L.ids.new(Date.now(), Math.random); if (/^[0-9a-z]{8,}$/.test(id)) return id; } catch { } return crm.fallbackId(); },
money: n => { try { const _oo = L.fmt.money(n); if (_oo) return _oo; } catch { } return crm.moneyFallback(n); },
date: ms => { try { const _oo = L.fmt.date(ms); if (_oo) return _oo; } catch { } return ms ? crm.dmy(ms) : ''; },
phone: _ol => { try { const _oo = L.fmt.phone(_ol); if (_oo) return _oo; } catch { } return crm.normPhone(_ol); },
tel: _ol => { try { const _oo = L.link.tel(_ol); if (_oo) return _oo; } catch { } return 'tel:' + crm.normPhone(_ol); },
zaloLink: _ol => { try { const _oo = L.link.zalo(_ol); if (_oo) return _oo; } catch { } return 'https://zalo.me/' + crm.normPhone(_ol); },
statuses: need => crm.statusList(L, need),
t: (key, fb) => { try { const _ot = ctx.t && ctx.t(key); if (_ot && _ot !== key) return _ot; } catch { } return fb || key; },
async list(table) { try { const r = await store.list(table); return Array.isArray(r) ? r.filter(x => !Number(x.deleted)) : []; } catch { return []; } },
async listAll(table) { try { const r = await store.list(table); return Array.isArray(r) ? r : []; } catch { return []; } },
async get(table, id) { try { return (await store.get(table, id)) || null; } catch { return null; } },
async put(table, row) {
const r = { deleted: 0, ...row, updated_at: now() };
if (!r.id && table !== 'settings') r.id = _o1.newId();
await store.put(table, r);
return r;
},
on(el, tables, cb) {
if (!store || typeof store.on !== 'function') return;
let t = 0;
const _oj = [];
const _oc = () => {
if (!el.isConnected) { _oj.forEach(_oa => { try { typeof _oa === 'function' && _oa(); } catch { } }); return; }
clearTimeout(t); t = setTimeout(cb, 60);
};
for (const _oq of tables) { try { _oj.push(store.on(_oq, _oc)); } catch { } }
},
async setting(key, fb) {
try {
const _oo = ctx.settings;
if (_oo && typeof _oo.get === 'function') { const _ot = await _oo.get(key); if (_ot !== undefined && _ot !== null) return _ot; }
else if (_oo && _oo[key] !== undefined) return _oo[key];
} catch { }
try {
const row = await store.get('settings', key);
if (row) return typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
} catch { }
return fb;
},
async setSetting(key, value) {
try { if (ctx.settings && typeof ctx.settings.set === 'function') { await ctx.settings.set(key, value); return; } } catch { }
await store.put('settings', { id: key, key, value: JSON.stringify(value), updated_at: now() });
},
async me() {
const _or = ctx.user;
if (_or && _or.role && _or.role !== 'owner') return { name: _or.full_name || _or.username || '', phone: _or.phone || '', staff: true };
for (const _og of ['profile', 'owner', 'me']) {
const _ot = await _o1.setting(_og, null);
if (_ot && (_ot.name || _ot.phone)) return { name: _ot.name || '', phone: _ot.phone || '' };
}
return { name: '', phone: '' };
},
async api(action, payload = {}) {
const a = ctx.api;
if (!a) throw new Error('Chưa kết nối máy chủ');
const _od = typeof a.call === 'function' ? a.call.bind(a) : typeof a.request === 'function' ? a.request.bind(a)
: typeof a.post === 'function' ? a.post.bind(a) : typeof a.run === 'function' ? a.run.bind(a) : typeof a === 'function' ? a : null;
if (!_od) throw new Error('Chưa kết nối máy chủ');
return _os(await _od(action, payload));
},
toast(text, kind) { try { if (ui.toast) return ui.toast(text, kind); } catch { } console.info('[toast]', text); },
async copy(text) {
try { if (ui.copy) { const ok = await ui.copy(text, { silent: true }); if (ok !== false) return true; } } catch { }
try { await navigator.clipboard.writeText(text); return true; } catch { }
try { const _op = h('textarea', { style: 'position:fixed;opacity:0' }, text); document.body.appendChild(_op); _op.select(); document.execCommand('copy'); _op.remove(); return true; } catch { return false; }
},
badge(text, tone = 'info') {
const _o6 = { info: 'info', warn: 'warn', success: 'ok', muted: 'neutral', danger: 'danger' }[tone] || 'neutral';
let _o4 = null;
try { if (ui.badge) _o4 = ui.badge(text, _o6); } catch { _o4 = null; }
if (!(_o4 instanceof Node)) _o4 = h('span', null, text);
_o4.classList.add('bds-badge', 'bds-tone-' + tone);
return _o4;
},
button(label, onClick, opts = {}) {
if (!opts.icon && typeof label === 'string' && /^\+\s/.test(label) && ui.icon) { label = label.replace(/^\+\s+/, ''); opts = { ...opts, icon: 'plus' }; }
let _o4 = null;
try { if (ui.button) _o4 = ui.button(label, onClick, opts); } catch { _o4 = null; }
if (!(_o4 instanceof Node)) {
_o4 = h('button', { type: 'button', class: 'bds-btn bds-btn-' + (opts.kind || 'ghost'), onclick: onClick }, opts.icon ? opts.icon + ' ' : '', label);
}
_o4.classList.add('bds-btn-x');
if (opts.testid) _o4.dataset.testid = opts.testid;
if (opts.title) _o4.title = opts.title;
if (opts.ai) _o4.dataset.ai = 'auto';
if (opts.aiOptional) _o4.dataset.aiOptional = '1';
const _ob = typeof opts.aiBadge === 'string' || (opts.aiBadge && typeof opts.aiBadge === 'object') ? opts.aiBadge : opts.ai;
if (_ob) { try { AC.markAi(_o4, _ob === true ? 'ai' : _ob, _o1.aiEnv()); } catch { } }
return _o4;
},
aiEnv() { return AC.envFrom(ctx.settings); },
aiBadge(feature) { return AC.aiBadge(feature, _o1.aiEnv()); },
aiNote(feature) { return AC.aiNote(feature, _o1.aiEnv()); },
aiConfirm(feature, opts = {}) { return AC.aiConfirm(feature, { env: _o1.aiEnv(), ...opts }); },
isAiCancel: AC.isCancel,
linkBtn(label, href, onClick, opts = {}) {
let _of = null;
if (opts.icon) { try { if (ui.icon) _of = ui.icon(opts.icon, 18); } catch { _of = null; } }
const kids = _of ? [_of, label ? h('span', null, label) : null] : [(opts.glyph ? opts.glyph + (label ? ' ' : '') : '') + (label || '')];
return h('a', { class: 'bds-btn bds-btn-x bds-btn-' + (opts.kind || 'ghost'), href, target: opts.target, rel: opts.target ? 'noopener' : null, onclick: onClick, 'data-testid': opts.testid, 'aria-label': opts.aria, title: opts.aria }, kids);
},
icon(name, size = 18) { try { if (ui.icon) return ui.icon(name, size); } catch { } return null; },
empty(text) {
try { if (ui.empty) { const e = ui.empty(text); if (e instanceof Node) return e; } } catch { }
return h('div', { class: 'bds-empty' }, text);
},
noSellable(hasProjects, opts = {}) {
if (!hasProjects) return _o1.noProjects(opts);
return _o1.noProjects({ title: 'Dự án chưa có giá', text: 'Mở Thông tin dự án, bấm vào dự án, điền giá (triệu/m²) và loại căn – xong quay lại đây.',
label: 'Mở Thông tin dự án', icon: 'building', onAdd: () => _o1.nav('#/sales/catalog'), testid: opts.testid });
},
noProjects(opts = {}) {
let _of = null;
try { if (ui.icon) _of = ui.icon('building', 28); } catch { _of = null; }
const _o5 = canAddProjects(ctx);
const add = () => (opts.onAdd ? opts.onAdd() : _o1.nav('#/sales/catalog?add=1'));
return h('div', { class: 'empty bds-noproj', style: 'padding:24px 16px', 'data-testid': opts.testid || 'no-projects' },
h('div', { class: 'empty-ico', 'aria-hidden': 'true' }, _of || '🏢'),
h('h3', { class: 'bds-noproj-t', style: 'margin:0;color:var(--text,inherit);font-size:1.05rem' }, opts.title || 'Chưa có dự án nào'),
h('p', { style: 'margin:0;max-width:34em' }, opts.text || 'Thêm dự án anh/chị đang bán (tên, giá, loại căn) – app dùng cho báo giá, landing, máy tính vay.'),
_o5 || opts.label ? _o1.button(opts.label || 'Thêm dự án', add, { kind: 'primary', icon: opts.icon || 'plus', testid: (opts.testid || 'no-projects') + '-add' })
: h('p', { class: 'bds-noproj-ask' }, 'Nhờ Quản trị thêm dự án ở Thông tin dự án.'));
},
help(key) { try { if (ui.help) { const e = ui.help(key); if (e instanceof Node) return e; } } catch { } return null; },
card({ title, actions, body, testid, cls }) {
return h('section', { class: 'bds-card ' + (cls || ''), 'data-testid': testid },
h('header', { class: 'bds-card-h' }, h('h3', null, title), actions ? h('div', { class: 'bds-card-a' }, actions) : null),
h('div', { class: 'bds-card-b' }, body));
},
field(label, input, help) {
return h('label', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, label), input, help ? h('small', { class: 'bds-field-h' }, help) : null);
},
select(options, value, attrs = {}) {
return h('select', attrs, options.map(o => {
const [_ot, _oh] = Array.isArray(o) ? o : [o, o];
return h('option', { value: _ot, selected: String(_ot) === String(value ?? '') }, _oh);
}));
},
afterClose(_od) {
return new Promise(res => {
let _o9 = false;
const _oe = () => { if (_o9) return; _o9 = true; window.removeEventListener('popstate', _oe); res(_od && _od()); };
window.addEventListener('popstate', _oe);
setTimeout(_oe, 300);
});
},
sheet({ title, body, testid, onClose }) {
const _ou = h('div', { class: 'bds-sheet-body', 'data-testid': testid }, body);
let _on = null;
try { if (ui.sheet) _on = ui.sheet({ title, body: _ou, onClose }); } catch { _on = null; }
if (_on === null || _on === undefined) {
const _ok = h('div', { class: 'bds-overlay', onclick: e => { if (e.target === _ok) close(); } },
h('div', { class: 'bds-sheet', role: 'dialog', 'aria-label': title },
h('header', { class: 'bds-sheet-h' }, h('h2', null, title), h('button', { type: 'button', class: 'bds-x', 'aria-label': 'Đóng', onclick: () => close() }, '✕')),
_ou));
const close = () => { if (_ok.isConnected) { _ok.remove(); try { onClose && onClose(); } catch { } } };
document.body.appendChild(_ok);
return { el: _ou, close };
}
const close = () => {
try { if (typeof _on.close === 'function') return _on.close(); } catch { }
if (_on instanceof Node) _on.remove(); else _ou.closest('[role=dialog],.sheet,.ui-sheet')?.remove();
};
return { el: _ou, close };
},
modal({ title, body, testid, wide }) {
const _ou = h('div', { class: 'bds-modal-body', 'data-testid': testid }, body);
let _on = null;
try { if (ui.modal) _on = ui.modal({ title, body: _ou, actions: [], wide }); } catch { _on = null; }
if (_on === null || _on === undefined) {
const _ok = h('div', { class: 'bds-overlay bds-center' },
h('div', { class: 'bds-modal' + (wide ? ' bds-modal-wide' : ''), role: 'dialog', 'aria-label': title },
h('div', { class: 'bds-sheet-h' }, h('h2', null, title), h('button', { type: 'button', class: 'bds-x', 'aria-label': 'Đóng', onclick: () => _ok.remove() }, '✕')), _ou));
document.body.appendChild(_ok);
return { el: _ou, close: () => _ok.remove() };
}
return {
el: _ou,
close: () => {
try { if (typeof _on.close === 'function') return _on.close(); } catch { }
if (_on instanceof Node) _on.remove(); else _ou.closest('[role=dialog],dialog,.modal,.ui-modal')?.remove();
},
};
},
confirm({ title, text, ok = 'Đồng ý', kind = 'primary', testid }) {
return new Promise(res => {
let _oi;
const _o9 = _ot => { _oi.close(); res(_ot); };
_oi = _o1.modal({ title, testid, body: [h('p', null, text), h('div', { class: 'bds-row bds-end' },
_o1.button('Huỷ', () => _o9(false), { icon: 'close' }), _o1.button(ok, () => _o9(true), { kind, icon: 'check', testid: (testid || 'confirm') + '-ok' }))] });
});
},
async logEvent(object_id, type, text, data) {
return _o1.put('events', { object_id, type, text: text || '', at: now(), data: data ? JSON.stringify(data) : '' });
},
callBtn(c, opts = {}) {
if (!c.phone) return null;
return _o1.linkBtn(opts.short ? '' : 'Gọi', _o1.tel(c.phone), (e) => {
_o1.logEvent(c.id, 'call', 'Gọi ' + _o1.phone(c.phone));
const _o4 = e && e.currentTarget, avoid = _o4 && _o4.getBoundingClientRect ? (_o4.closest('.bds-acts') || _o4).getBoundingClientRect() : null;
if (!c.kind || c.kind === 'customer') import('./callcard.js').then(_oi => _oi.openCallCard(ctx, c, { avoid })).catch(() => { });
}, { kind: 'primary', icon: 'phone', glyph: '📞', aria: opts.short ? 'Gọi ' + (c.name || '') : null, testid: 'call-' + c.id });
},
zaloBtn(c, opts = {}) {
const _ol = [c.zalo, c.phone].find((x) => x && crm.normPhone(x)) || '';
if (!_ol) return null;
return _o1.linkBtn('Zalo', _o1.zaloLink(_ol), () => { _o1.logEvent(c.id, 'zalo', 'Mở Zalo ' + _o1.phone(_ol)); }, { target: '_blank', icon: 'chat', glyph: '💬', testid: 'zalo-' + c.id });
},
async openProfile(id) {
const _oi = await import('../customers/index.js');
return _oi.openProfile(ctx, id);
},
nav(_om) { try { if (ctx.nav) return ctx.nav(_om); } catch { } location.hash = _om; },
};
if (store && typeof store === 'object' && !_o3.has(store)) {
_o3.add(store);
_o1.loadProjects().catch(() => { });
try { if (typeof store.on === 'function') store.on('projects', () => { _o1.loadProjects().catch(() => { }); }); } catch { }
}
return _o1;
}
export function canAddProjects(ctx) {
const _or = ctx && ctx.user, _ol = _or && _or.perms;
if (_ol && typeof _ol.project_edit === 'boolean') return _ol.project_edit;
const role = _or && _or.role;
return !role || role === 'owner' || role === 'manager';
}
export function inSelftest(el) { return !!(el && el.closest && el.closest('[data-bds-selftest]')); }
export async function selftestCommon(ctx, needLogic, render) {
const details = [];
let ok = true;
const _oo = ctx && ctx.store;
for (const _oa of ['list', 'get', 'put']) if (!_oo || typeof _oo[_oa] !== 'function') { ok = false; details.push('Thiếu store.' + _oa); }
const L = ctx && ctx.logic;
for (const _om of needLogic) {
const _od = _om.split('.').reduce((o, _og) => (o ? o[_og] : undefined), L);
if (_od === undefined) { ok = false; details.push('Thiếu logic.' + _om); }
}
if (ok && render) {
const _o8 = document.createElement('div');
_o8.style.display = 'none';
_o8.dataset.bdsSelftest = '1';
document.body.appendChild(_o8);
try { await render(_o8); if (!_o8.childNodes.length) { ok = false; details.push('Vẽ thử không ra nội dung'); } }
catch (e) { ok = false; details.push('Vẽ thử lỗi: ' + (e && e.message)); }
finally { _o8.remove(); }
}
return { ok, details: details.length ? details.join('; ') : 'Đạt' };
}

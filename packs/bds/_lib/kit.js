import * as crm from './crm.js';
import * as AC from '../../../core/ai_cost.2fb10e6822.js';
const _o0 = 'bds-crm-css';
export function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
const _od = document.createElement('link');
_od.id = _o0; _od.rel = 'stylesheet';
_od.href = new URL('./crm.css', import.meta.url).href;
document.head.appendChild(_od);
}
export function h(tag, attrs, ...kids) {
const el = document.createElement(tag);
if (attrs && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
for (const [_oc, _op] of Object.entries(attrs || {})) {
if (_op === undefined || _op === null || _op === false) continue;
if (_oc === 'class' || _oc === 'className') el.className = _op;
else if (_oc === 'style') { if (typeof _op === 'string') el.style.cssText = _op; else Object.assign(el.style, _op); }
else if (_oc === 'dataset') Object.assign(el.dataset, _op);
else if (_oc.startsWith('on') && typeof _op === 'function') el.addEventListener(_oc.slice(2).toLowerCase(), _op);
else if (_oc === 'value' || _oc === 'checked' || _oc === 'selected' || _oc === 'disabled') el[_oc] = _op;
else el.setAttribute(_oc, _op === true ? '' : _op);
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
const _oo = r => (r && typeof r === 'object' && 'ok' in r && 'data' in r) ? (r.ok ? r.data : Promise.reject(r.error || r)) : r;
export function kit(ctx) {
ensureCss();
const ui = ctx.ui || {};
const L = ctx.logic || (typeof window !== 'undefined' ? window.BDSLogic : null) || {};
const store = ctx.store;
const now = () => Date.now();
const _o1 = {
ctx, crm, h, L, now,
projects: () => (ctx.data && Array.isArray(ctx.data.projects)) ? ctx.data.projects : [],
project: id => _o1.projects().find(_oh => _oh.id === id) || null,
projectName: id => crm.projectName(_o1.projects(), id),
newId: () => { try { const id = L.ids.new(Date.now(), Math.random); if (/^[0-9a-z]{8,}$/.test(id)) return id; } catch { } return crm.fallbackId(); },
money: n => { try { const _ok = L.fmt.money(n); if (_ok) return _ok; } catch { } return crm.moneyFallback(n); },
date: ms => { try { const _ok = L.fmt.date(ms); if (_ok) return _ok; } catch { } return ms ? crm.dmy(ms) : ''; },
phone: _oh => { try { const _ok = L.fmt.phone(_oh); if (_ok) return _ok; } catch { } return crm.normPhone(_oh); },
tel: _oh => { try { const _ok = L.link.tel(_oh); if (_ok) return _ok; } catch { } return 'tel:' + crm.normPhone(_oh); },
zaloLink: _oh => { try { const _ok = L.link.zalo(_oh); if (_ok) return _ok; } catch { } return 'https://zalo.me/' + crm.normPhone(_oh); },
statuses: need => crm.statusList(L, need),
t: (key, fb) => { try { const _op = ctx.t && ctx.t(key); if (_op && _op !== key) return _op; } catch { } return fb || key; },
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
const _of = [];
const _o8 = () => {
if (!el.isConnected) { _of.forEach(_o6 => { try { typeof _o6 === 'function' && _o6(); } catch { } }); return; }
clearTimeout(t); t = setTimeout(cb, 60);
};
for (const _om of tables) { try { _of.push(store.on(_om, _o8)); } catch { } }
},
async setting(key, fb) {
try {
const _ok = ctx.settings;
if (_ok && typeof _ok.get === 'function') { const _op = await _ok.get(key); if (_op !== undefined && _op !== null) return _op; }
else if (_ok && _ok[key] !== undefined) return _ok[key];
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
const _on = ctx.user;
if (_on && _on.role && _on.role !== 'owner') return { name: _on.full_name || _on.username || '', phone: _on.phone || '', staff: true };
for (const _oc of ['profile', 'owner', 'me']) {
const _op = await _o1.setting(_oc, null);
if (_op && (_op.name || _op.phone)) return { name: _op.name || '', phone: _op.phone || '' };
}
return { name: '', phone: '' };
},
async api(action, payload = {}) {
const a = ctx.api;
if (!a) throw new Error('Chưa kết nối máy chủ');
const _o9 = typeof a.call === 'function' ? a.call.bind(a) : typeof a.request === 'function' ? a.request.bind(a)
: typeof a.post === 'function' ? a.post.bind(a) : typeof a.run === 'function' ? a.run.bind(a) : typeof a === 'function' ? a : null;
if (!_o9) throw new Error('Chưa kết nối máy chủ');
return _oo(await _o9(action, payload));
},
toast(text, kind) { try { if (ui.toast) return ui.toast(text, kind); } catch { } console.info('[toast]', text); },
async copy(text) {
try { if (ui.copy) { const ok = await ui.copy(text, { silent: true }); if (ok !== false) return true; } } catch { }
try { await navigator.clipboard.writeText(text); return true; } catch { }
try { const _ol = h('textarea', { style: 'position:fixed;opacity:0' }, text); document.body.appendChild(_ol); _ol.select(); document.execCommand('copy'); _ol.remove(); return true; } catch { return false; }
},
badge(text, tone = 'info') {
const _o3 = { info: 'info', warn: 'warn', success: 'ok', muted: 'neutral', danger: 'danger' }[tone] || 'neutral';
let _o2 = null;
try { if (ui.badge) _o2 = ui.badge(text, _o3); } catch { _o2 = null; }
if (!(_o2 instanceof Node)) _o2 = h('span', null, text);
_o2.classList.add('bds-badge', 'bds-tone-' + tone);
return _o2;
},
button(label, onClick, opts = {}) {
if (!opts.icon && typeof label === 'string' && /^\+\s/.test(label) && ui.icon) { label = label.replace(/^\+\s+/, ''); opts = { ...opts, icon: 'plus' }; }
let _o2 = null;
try { if (ui.button) _o2 = ui.button(label, onClick, opts); } catch { _o2 = null; }
if (!(_o2 instanceof Node)) {
_o2 = h('button', { type: 'button', class: 'bds-btn bds-btn-' + (opts.kind || 'ghost'), onclick: onClick }, opts.icon ? opts.icon + ' ' : '', label);
}
_o2.classList.add('bds-btn-x');
if (opts.testid) _o2.dataset.testid = opts.testid;
if (opts.title) _o2.title = opts.title;
if (opts.ai) _o2.dataset.ai = 'auto';
if (opts.aiOptional) _o2.dataset.aiOptional = '1';
const _o7 = typeof opts.aiBadge === 'string' || (opts.aiBadge && typeof opts.aiBadge === 'object') ? opts.aiBadge : opts.ai;
if (_o7) { try { AC.markAi(_o2, _o7 === true ? 'ai' : _o7, _o1.aiEnv()); } catch { } }
return _o2;
},
aiEnv() { return AC.envFrom(ctx.settings); },
aiBadge(feature) { return AC.aiBadge(feature, _o1.aiEnv()); },
aiNote(feature) { return AC.aiNote(feature, _o1.aiEnv()); },
aiConfirm(feature, opts = {}) { return AC.aiConfirm(feature, { env: _o1.aiEnv(), ...opts }); },
isAiCancel: AC.isCancel,
linkBtn(label, href, onClick, opts = {}) {
let _ob = null;
if (opts.icon) { try { if (ui.icon) _ob = ui.icon(opts.icon, 18); } catch { _ob = null; } }
const kids = _ob ? [_ob, label ? h('span', null, label) : null] : [(opts.glyph ? opts.glyph + (label ? ' ' : '') : '') + (label || '')];
return h('a', { class: 'bds-btn bds-btn-x bds-btn-' + (opts.kind || 'ghost'), href, target: opts.target, rel: opts.target ? 'noopener' : null, onclick: onClick, 'data-testid': opts.testid, 'aria-label': opts.aria, title: opts.aria }, kids);
},
icon(name, size = 18) { try { if (ui.icon) return ui.icon(name, size); } catch { } return null; },
empty(text) {
try { if (ui.empty) { const e = ui.empty(text); if (e instanceof Node) return e; } } catch { }
return h('div', { class: 'bds-empty' }, text);
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
const [_op, _od] = Array.isArray(o) ? o : [o, o];
return h('option', { value: _op, selected: String(_op) === String(value ?? '') }, _od);
}));
},
afterClose(_o9) {
return new Promise(res => {
let _o5 = false;
const _oa = () => { if (_o5) return; _o5 = true; window.removeEventListener('popstate', _oa); res(_o9 && _o9()); };
window.addEventListener('popstate', _oa);
setTimeout(_oa, 300);
});
},
sheet({ title, body, testid, onClose }) {
const _oq = h('div', { class: 'bds-sheet-body', 'data-testid': testid }, body);
let _oj = null;
try { if (ui.sheet) _oj = ui.sheet({ title, body: _oq, onClose }); } catch { _oj = null; }
if (_oj === null || _oj === undefined) {
const _og = h('div', { class: 'bds-overlay', onclick: e => { if (e.target === _og) close(); } },
h('div', { class: 'bds-sheet', role: 'dialog', 'aria-label': title },
h('header', { class: 'bds-sheet-h' }, h('h2', null, title), h('button', { type: 'button', class: 'bds-x', 'aria-label': 'Đóng', onclick: () => close() }, '✕')),
_oq));
const close = () => { if (_og.isConnected) { _og.remove(); try { onClose && onClose(); } catch { } } };
document.body.appendChild(_og);
return { el: _oq, close };
}
const close = () => {
try { if (typeof _oj.close === 'function') return _oj.close(); } catch { }
if (_oj instanceof Node) _oj.remove(); else _oq.closest('[role=dialog],.sheet,.ui-sheet')?.remove();
};
return { el: _oq, close };
},
modal({ title, body, testid, wide }) {
const _oq = h('div', { class: 'bds-modal-body', 'data-testid': testid }, body);
let _oj = null;
try { if (ui.modal) _oj = ui.modal({ title, body: _oq, actions: [], wide }); } catch { _oj = null; }
if (_oj === null || _oj === undefined) {
const _og = h('div', { class: 'bds-overlay bds-center' },
h('div', { class: 'bds-modal' + (wide ? ' bds-modal-wide' : ''), role: 'dialog', 'aria-label': title },
h('div', { class: 'bds-sheet-h' }, h('h2', null, title), h('button', { type: 'button', class: 'bds-x', 'aria-label': 'Đóng', onclick: () => _og.remove() }, '✕')), _oq));
document.body.appendChild(_og);
return { el: _oq, close: () => _og.remove() };
}
return {
el: _oq,
close: () => {
try { if (typeof _oj.close === 'function') return _oj.close(); } catch { }
if (_oj instanceof Node) _oj.remove(); else _oq.closest('[role=dialog],dialog,.modal,.ui-modal')?.remove();
},
};
},
confirm({ title, text, ok = 'Đồng ý', kind = 'primary', testid }) {
return new Promise(res => {
let _oe;
const _o5 = _op => { _oe.close(); res(_op); };
_oe = _o1.modal({ title, testid, body: [h('p', null, text), h('div', { class: 'bds-row bds-end' },
_o1.button('Huỷ', () => _o5(false), { icon: 'close' }), _o1.button(ok, () => _o5(true), { kind, icon: 'check', testid: (testid || 'confirm') + '-ok' }))] });
});
},
async logEvent(object_id, type, text, data) {
return _o1.put('events', { object_id, type, text: text || '', at: now(), data: data ? JSON.stringify(data) : '' });
},
callBtn(c, opts = {}) {
if (!c.phone) return null;
return _o1.linkBtn(opts.short ? '' : 'Gọi', _o1.tel(c.phone), (e) => {
_o1.logEvent(c.id, 'call', 'Gọi ' + _o1.phone(c.phone));
const _o2 = e && e.currentTarget, avoid = _o2 && _o2.getBoundingClientRect ? (_o2.closest('.bds-acts') || _o2).getBoundingClientRect() : null;
if (!c.kind || c.kind === 'customer') import('./callcard.js').then(_oe => _oe.openCallCard(ctx, c, { avoid })).catch(() => { });
}, { kind: 'primary', icon: 'phone', glyph: '📞', aria: opts.short ? 'Gọi ' + (c.name || '') : null, testid: 'call-' + c.id });
},
zaloBtn(c, opts = {}) {
const _oh = c.zalo || c.phone;
if (!_oh) return null;
return _o1.linkBtn('Zalo', _o1.zaloLink(_oh), () => { _o1.logEvent(c.id, 'zalo', 'Mở Zalo ' + _o1.phone(_oh)); }, { target: '_blank', icon: 'chat', glyph: '💬', testid: 'zalo-' + c.id });
},
async openProfile(id) {
const _oe = await import('../customers/index.js');
return _oe.openProfile(ctx, id);
},
nav(_oi) { try { if (ctx.nav) return ctx.nav(_oi); } catch { } location.hash = _oi; },
};
return _o1;
}
export function inSelftest(el) { return !!(el && el.closest && el.closest('[data-bds-selftest]')); }
export async function selftestCommon(ctx, needLogic, render) {
const details = [];
let ok = true;
const _ok = ctx && ctx.store;
for (const _o6 of ['list', 'get', 'put']) if (!_ok || typeof _ok[_o6] !== 'function') { ok = false; details.push('Thiếu store.' + _o6); }
const L = ctx && ctx.logic;
for (const _oi of needLogic) {
const _o9 = _oi.split('.').reduce((o, _oc) => (o ? o[_oc] : undefined), L);
if (_o9 === undefined) { ok = false; details.push('Thiếu logic.' + _oi); }
}
if (ok && render) {
const _o4 = document.createElement('div');
_o4.style.display = 'none';
_o4.dataset.bdsSelftest = '1';
document.body.appendChild(_o4);
try { await render(_o4); if (!_o4.childNodes.length) { ok = false; details.push('Vẽ thử không ra nội dung'); } }
catch (e) { ok = false; details.push('Vẽ thử lỗi: ' + (e && e.message)); }
finally { _o4.remove(); }
}
return { ok, details: details.length ? details.join('; ') : 'Đạt' };
}

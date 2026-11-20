import { t } from './i18n.c64f4bc3eb.js';
import { saveScriptUrl, scriptUrl } from './api.8a9774059d.js';
import { PROVIDERS, TASKS, DEFAULT_OLLAMA_MODEL } from './ai.8d26d4c959.js';
import { memo as aiAskMemo } from './ai_cost.2fb10e6822.js';
import { renderVersionPanel } from './updates.7f3d23ce57.js';
import { privacyLine } from './instance.087c1b328a.js';
import { renderConnections, renderBudgetPanel } from './connections.6d87e72b72.js';
import { userSections } from './users.be5fcb9ddb.js';
import { renderFullCheck } from './fullcheck.133fdf2db7.js';
import { renderTfaPanel, renameBlock } from './tfa.34d52e1fe4.js';
import { renderDeviceSlots } from './device_slots.eec0ddd1cc.js';
import { emailCodeBox, purposeFor } from './email_verify.c44911bb1b.js';
import { settingsRow as a2hsRow } from './a2hs.dd832a10b4.js';
import { hwEnabled, hwSection } from './hwscan.29d759fe0b.js';
const P = 'bds:pref:';
export const prefs = {
get(_ol, def) { try { const _o1n = localStorage.getItem(P + _ol); return _o1n == null ? def : JSON.parse(_o1n); } catch { return def; } },
set(_ol, _o1n) { try { localStorage.setItem(P + _ol, JSON.stringify(_o1n)); } catch { } return _o1n; }
};
export const SIZES = ['m', 'l', 'xl'];
export const THEMES = ['light', 'dark', 'auto'];
export function applyPrefs(doc = document) {
const size = prefs.get('size', 'm'); const theme = prefs.get('theme', 'auto');
doc.documentElement.dataset.size = SIZES.includes(size) ? size : 'm';
if (theme === 'light' || theme === 'dark') doc.documentElement.dataset.theme = theme;
else delete doc.documentElement.dataset.theme;
const _oq = doc.querySelector('meta[name="theme-color"]');
if (_oq) _oq.setAttribute('content', theme === 'dark' || (theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches) ? '#0B1626' : '#0F1E33');
}
export function densityFor(screen) {
try { const _o1n = localStorage.getItem('density:' + screen); if (_o1n === 'compact' || _o1n === 'detail') return _o1n; } catch { }
return prefs.get('density', 'compact') === 'detail' ? 'detail' : 'compact';
}
export function setDensityFor(screen, _o1n) { try { localStorage.setItem('density:' + screen, _o1n); } catch { } }
export function parseValue(_o1n) {
if (typeof _o1n !== 'string') return _o1n;
try { return JSON.parse(_o1n); } catch { return _o1n; }
}
export function createSettings(store) {
const _o5 = new Map(); const _o1i = new Map();
const _og = (key, _o1n) => { for (const _ol of [key, '*']) for (const _o6 of _o1i.get(_ol) || []) { try { _o6(_o1n, key); } catch { } } };
const s = {
local: prefs,
async init() {
const _o1e = await store.list('settings');
for (const _o11 of _o1e) _o5.set(_o11.key, parseValue(_o11.value));
store.on('settings', ({ row }) => {
if (!row) return;
if (Number(row.deleted)) _o5.delete(row.key); else _o5.set(row.key, parseValue(row.value));
_og(row.key, _o5.get(row.key));
});
return s;
},
get(key, def) { return _o5.has(key) ? _o5.get(key) : def; },
async set(key, value) {
_o5.set(key, value);
await store.put('settings', { key, value: JSON.stringify(value) });
return value;
},
all() { return Object.fromEntries(_o5); },
on(key, _o6) { if (!_o1i.has(key)) _o1i.set(key, new Set()); _o1i.get(key).add(_o6); return () => _o1i.get(key).delete(_o6); }
};
return s;
}
export const SKILL_KINDS = ['templates', 'prompts', 'statuses', 'policy_parser'];
export function validateSkill(obj) {
if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return { ok: false, error: 'không phải object JSON' };
const _o1 = new Set(['name', 'version', 'kind', 'items', 'description', 'author']);
for (const _ol of Object.keys(obj)) if (!_o1.has(_ol)) return { ok: false, error: 'trường lạ "' + _ol + '"' };
if (typeof obj.name !== 'string' || !obj.name.trim() || obj.name.length > 80) return { ok: false, error: 'thiếu name' };
if (typeof obj.version !== 'string' || !/^\d+\.\d+(\.\d+)?$/.test(obj.version)) return { ok: false, error: 'version dạng 1.0.0' };
if (!SKILL_KINDS.includes(obj.kind)) return { ok: false, error: 'kind phải là ' + SKILL_KINDS.join('/') };
if (!Array.isArray(obj.items) || !obj.items.length || obj.items.length > 500) return { ok: false, error: 'items phải là mảng 1–500 phần tử' };
const size = JSON.stringify(obj).length;
if (size > 256 * 1024) return { ok: false, error: 'file quá lớn (> 256KB)' };
const _o2 = (_o1n, depth = 0) => {
if (depth > 6) return true;
if (typeof _o1n === 'function') return true;
if (typeof _o1n === 'string') return /<\s*script|javascript:/i.test(_o1n);
if (_o1n && typeof _o1n === 'object') return Object.values(_o1n).some((_o1r) => _o2(_o1r, depth + 1));
return false;
};
for (const _ok of obj.items) {
if (_ok == null || (typeof _ok !== 'object' && typeof _ok !== 'string')) return { ok: false, error: 'phần tử items không hợp lệ' };
if (_o2(_ok)) return { ok: false, error: 'items chứa mã' };
}
return { ok: true };
}
function _oi(n) {
n = Number(n) || 0;
if (n >= 1e12) return (n / 1e12).toFixed(2).replace('.', ',') + ' TB';
if (n >= 1e9) return (n / 1e9).toFixed(1).replace('.', ',') + ' GB';
if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.', ',') + ' MB';
return Math.round(n / 1e3) + ' KB';
}
const usd = (n) => '$' + (Number(n) || 0).toFixed(2);
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export async function mountSettings(el, ctx, app) {
const { ui, api, store, ai, settings } = ctx;
const auth = app.auth || ctx.auth;
const { h, card, field, button, segmented, help, toast, status: st, progress, badge, empty, table } = ui;
const _o1g = [
['connection', 'link', t('set.conn'), _o15],
['profile', 'user', t('set.profile'), _o18],
['look', 'layout', t('set.look'), _o17],
['security', 'shield', t('set.security'), _o19],
['ai', 'sparkle', t('set.ai'), _o12],
['budget', 'wallet', t('set.budget'), _o14],
['storage', 'disk', t('set.storage'), _o1b],
['selftest', 'pulse', t('set.selftest'), _o1a],
['version', 'refresh', t('set.version'), _o1c],
['errors', 'log', t('set.errors'), _o16]
];
if (typeof app.extraSections === 'function') _o1g.push(...app.extraSections(ctx));
if (hwEnabled(app.config) && !(ctx.video && ctx.video.engineOff())) _o1g.push(hwSection(ctx, app));
_o1g.splice(0, _o1g.length, ...userSections(_o1g, ctx, app));
if (typeof app.lateSections === 'function') _o1g.push(...app.lateSections(ctx));
const _o1q = h('div', { class: 'settings', 'data-testid': 'settings' });
for (const [key, ic, title, render] of _o1g) {
const _o4 = h('div', { class: 'set-body' });
const _oc = h('details', { class: 'set-sec card', id: 'set-' + key, dataset: { sec: key } },
h('summary', { class: 'set-sum' },
h('span', { class: 'card-ico' }, ui.icon(ic, 20)),
h('span', { class: 'set-sum-title' }, title),
typeof app.sectionBadge === 'function' ? app.sectionBadge(key) : null,
help(key === 'connection' ? 'connection' : key === 'look' ? 'density' : key === 'security' ? 'lock' : key, title),
h('span', { class: 'set-chev' }, ui.icon('next', 18))),
_o4);
let _o1d = false;
_oc.addEventListener('toggle', async () => {
if (_oc.open && !_o1d) {
_o1d = true;
try { await render(_o4); } catch (e) {
_o4.appendChild(empty(t('err.generic')));
app.errors.report('warn', 'settings.' + key, String(e && e.message || e), e && e.stack);
}
}
});
_o1q.appendChild(_oc);
}
el.appendChild(_o1q);
const asked = String((ctx.route && ctx.route.module) || '');
const want = _o1g.some(([_ol]) => _ol === asked) ? asked : ({ upgrade: 'feedback', skills: 'feedback', onboarding: 'wizard' }[asked] || asked);
const target = _o1q.querySelector('#set-' + (_o1g.some(([_ol]) => _ol === want) ? want : 'connection'));
if (target) {
target.open = true;
if (want && want !== 'settings') requestAnimationFrame(() => {
try {
const _o3 = document.querySelector('.topbar');
const _ou = _o3 ? Math.max(0, _o3.getBoundingClientRect().bottom) : 0;
window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - _ou - 8), behavior: 'smooth' });
} catch { try { target.scrollIntoView({ block: 'start' }); } catch { } }
});
}
return _o1q;
function _o18(_o4) {
const _ox = settings.get('profile', {}) || {};
if (!_oj()) {
const _o1l = me() || {};
const _oh = (label, value, testid, more) => { const _o1r = field({ label, value: value || '', id: 'profile-' + testid, ...(more || {}) }); _o1r.input.setAttribute('data-testid', 'profile-' + testid); return _o1r; };
const nm = _oh(t('set.profile.name'), _o1l.full_name || _o1l.username, 'name', { autocomplete: 'name' });
const ph = _oh(t('set.profile.phone'), _o1l.phone, 'phone', { type: 'tel', autocomplete: 'tel', inputmode: 'tel' });
const _o8 = _oh(t('set.profile.company'), _ox.company, 'company'); _o8.input.readOnly = true;
const say = h('p', { class: 'form-err', role: 'alert', 'data-testid': 'profile-staff-err' });
_o4.append(h('div', { class: 'grid-2', 'data-testid': 'profile-staff' }, nm, ph, _o8),
h('p', { class: 'muted small' }, 'Tên và số điện thoại này đi kèm tin nhắn, báo giá anh/chị gửi khách. Tên công ty do Quản trị đặt.'), say,
h('div', { class: 'btn-row' }, button(t('common.save'), async () => {
say.textContent = '';
try {
await api.call('me.update', { full_name: String(nm.getValue() || '').trim(), phone: String(ph.getValue() || '').trim() });
if (auth && typeof auth.me === 'function') await auth.me().catch(() => null);
toast(t('common.saved'), 'ok');
} catch (e) { say.textContent = (e && (e.userMessage || e.message)) || t('err.generic'); }
}, { kind: 'primary', icon: 'check', id: 'profile-staff-save', testid: 'profile-staff-save' })));
_o4.append(_of());
return;
}
const f = {
name: field({ label: t('set.profile.name'), value: _ox.name || '', autocomplete: 'name' }),
title: field({ label: t('set.profile.title'), value: _ox.title || '' }),
company: field({ label: t('set.profile.company'), value: _ox.company || '', autocomplete: 'organization' }),
license: field({ label: t('set.profile.license'), value: _ox.license || '' }),
phone: field({ label: t('set.profile.phone'), type: 'tel', value: _ox.phone || '', autocomplete: 'tel', inputmode: 'tel' }),
zalo: field({ label: t('set.profile.zalo'), type: 'tel', value: _ox.zalo || '', autocomplete: 'tel', inputmode: 'tel' })
};
_o4.append(h('div', { class: 'grid-2' }, Object.values(f)),
h('div', { class: 'btn-row' }, button(t('common.save'), async () => {
const _o1n = Object.fromEntries(Object.entries(f).map(([_ol, _o1r]) => [_ol, String(_o1r.getValue() || '').trim()]));
await settings.set('profile', _o1n);
toast(t('common.saved'), 'ok');
}, { kind: 'primary', icon: 'check', id: 'profile-save' })));
_o4.append(_of());
}
function me() { return (auth && auth.user) || ctx.user || null; }
function _oj() { const _o1l = me(); return !_o1l || !_o1l.role || _o1l.role === 'owner' || !!_o1l.legacy; }
function _of() {
const _o1m = me();
if (!_o1m || !_o1m.email_gate || !auth || typeof auth.emailStart !== 'function') return _om();
const owner = _oj();
const _o1q = h('div', { class: 'sub-block secret', id: 'profile-email', 'data-testid': 'profile-email', dataset: { owner: owner ? '1' : '0', verify: '1' } });
const _oe = () => {
const _o1l = me() || {};
const _oa = String(_o1l.email || (_o1l.email_gate && _o1l.email_gate.email) || '').trim();
const _o1o = !!Number(_o1l.email_verified);
const tag = h('span', { class: 'secret-badge', 'data-testid': 'profile-email-badge' },
badge(!_oa ? t('set.profile.email.unset') : _o1o ? 'Đã xác nhận' : 'Chưa xác nhận', !_oa ? 'neutral' : _o1o ? 'ok' : 'warn'));
const box = emailCodeBox({
ui, api, testid: 'profile-ev', email: _oa, label: t('set.profile.email'),
hint: (owner ? t('set.profile.email.hint_owner') : t('set.profile.email.hint')) + ' Đổi email: gõ email mới → "Gửi mã" → nhập mã 6 số gửi tới email mới. Email cũ giữ nguyên tới khi xác nhận xong.',
send: (em) => {
if (_o1o && em.toLowerCase() === _oa.toLowerCase()) throw Object.assign(new Error('Email này đã xác nhận rồi. Muốn đổi thì gõ email mới.'), { userMessage: 'Email này đã xác nhận rồi. Muốn đổi thì gõ email mới.' });
return auth.emailStart(em, purposeFor(em, _oa));
},
verify: (em, code) => (purposeFor(em, _oa) === 'user' ? auth.verifyEmail(code) : auth.setMyEmail(em, code)),
allowAccountEmail: owner, useAccountEmail: () => auth.verifyEmail('', true),
onVerified: (_o1n) => {
toast('Đã xác nhận email ' + _o1n.email, 'ok', 4000);
const _on = owner && typeof window !== 'undefined' && window.__bds && window.__bds.license;
if (_on && _on.enabled && typeof _on.check === 'function') _on.check({ force: true }).catch(() => null);
setTimeout(_oe, 1200);
}
});
const test = owner ? button('Gửi thử', async () => {
const _ob = await api.call('connections.test', { target: 'email' });
toast((_ob && _ob.message) || (_ob && _ob.ok ? 'Đã gửi thư thử' : 'Chưa gửi được thư'), _ob && _ob.ok ? 'ok' : 'warn', _ob && _ob.ok ? 3200 : 6000);
}, { kind: 'secondary', small: true, icon: 'pulse', testid: 'profile-email-test' }) : null;
ui.mountTo(_o1q, h('h4', { class: 'section-title' }, t('set.profile.email.title')), box, h('div', { class: 'secret-foot' }, tag, h('div', { class: 'btn-row' }, test)));
};
_oe();
return _o1q;
}
function _om() {
const owner = _oj();
let _oa = String((me() && me().email) || '').trim();
const f = field({ label: t('set.profile.email'), type: 'email', value: _oa, autocomplete: 'email', inputmode: 'email', id: 'profile-email-input',
hint: owner ? t('set.profile.email.hint_owner') : t('set.profile.email.hint'), placeholder: 'Email của anh/chị' });
f.input.setAttribute('data-testid', 'profile-email-input');
f.input.setAttribute('spellcheck', 'false');
const tag = h('span', { class: 'secret-badge', 'data-testid': 'profile-email-badge' });
const _oy = () => ui.mountTo(tag, badge(_oa ? t('set.profile.email.saved') : t('set.profile.email.unset'), _oa ? 'ok' : 'neutral'));
const save = button(t('common.save'), async () => {
const _o1n = String(f.getValue() || '').trim();
if (_o1n && !EMAIL_RE.test(_o1n)) { toast('Email chưa đúng dạng', 'warn'); f.input.focus(); return; }
if (!_o1n && !_oa) { toast('Chưa nhập email để lưu', 'warn'); f.input.focus(); return; }
if (auth && typeof auth.setMyEmail === 'function') await auth.setMyEmail(_o1n);
else await api.call('me.update', { email: _o1n });
_oa = _o1n; f.setValue(_o1n); _oy();
toast(_o1n ? (owner ? 'Đã lưu email lên máy chủ – bấm Gửi thử để chắc chắn' : 'Đã lưu email') : 'Đã xoá email', 'ok');
const _on = owner && _o1n && typeof window !== 'undefined' && window.__bds && window.__bds.license;
if (_on && _on.enabled && typeof _on.check === 'function') _on.check({ force: true }).catch(() => null);
}, { kind: 'primary', small: true, icon: 'check', testid: 'profile-email-save' });
const test = owner ? button('Gửi thử', async () => {
const _ob = await api.call('connections.test', { target: 'email' });
toast((_ob && _ob.message) || (_ob && _ob.ok ? 'Đã gửi thư thử' : 'Chưa gửi được thư'), _ob && _ob.ok ? 'ok' : 'warn', _ob && _ob.ok ? 3200 : 6000);
}, { kind: 'secondary', small: true, icon: 'pulse', testid: 'profile-email-test' }) : null;
_oy();
return h('div', { class: 'sub-block secret', id: 'profile-email', 'data-testid': 'profile-email', dataset: { owner: owner ? '1' : '0' } },
h('h4', { class: 'section-title' }, t('set.profile.email.title')),
f, h('div', { class: 'secret-foot' }, tag, h('div', { class: 'btn-row' }, save, test)));
}
function _o17(_o4) {
_o4.append(
h('div', { class: 'field' }, h('span', { class: 'field-label' }, t('set.look.size')),
segmented(['m', 'l', 'xl'].map((_o1n) => ({ value: _o1n, label: t('set.look.size.' + _o1n) })), settings.local.get('size', 'm'),
(_o1n) => { settings.local.set('size', _o1n); app.applyPrefs(); }, { label: t('set.look.size'), name: 'size' })),
h('div', { class: 'field' }, h('span', { class: 'field-label' }, t('set.look.theme')),
segmented(['light', 'dark', 'auto'].map((_o1n) => ({ value: _o1n, label: t('set.look.theme.' + _o1n) })), settings.local.get('theme', 'auto'),
(_o1n) => { settings.local.set('theme', _o1n); app.applyPrefs(); }, { label: t('set.look.theme'), name: 'theme' })),
h('div', { class: 'field' }, h('span', { class: 'field-label' }, t('set.look.density'), help('density')),
segmented([{ value: 'compact', label: t('common.compact') }, { value: 'detail', label: t('common.detail') }], settings.local.get('density', 'compact'),
(_o1n) => { settings.local.set('density', _o1n); app.setDensityDefault(_o1n); }, { label: t('set.look.density'), name: 'density-default' })));
}
async function _o19(_o4) {
const oldF = field({ label: t('set.security.old'), type: 'password', autocomplete: 'current-password' });
const newF = field({ label: t('set.security.new'), type: 'password', autocomplete: 'new-password' });
const _ot = field({ label: t('auth.password2'), type: 'password', autocomplete: 'new-password' });
const _oo = field({
label: t('set.security.lock'), type: 'number', value: auth.lockMinutes(), min: 1, max: 240, inputmode: 'numeric', help: 'lock', id: 'lock-minutes',
onChange: (_o1n) => { const n = auth.setLockMinutes(_o1n); _oo.setValue(n); app.restartIdle(); toast(t('common.saved'), 'ok'); }
});
const _od = h('div', { class: 'devices' }, ui.spinner());
const _o1j = h('div', { class: 'tfa-box' });
renderTfaPanel(_o1j, { ui, auth, nav: ctx.nav }).catch(() => { });
_o4.append(
h('div', { class: 'sub-block' }, h('h4', { class: 'section-title' }, t('set.security.change')),
h('div', { class: 'grid-3' }, oldF, newF, _ot),
h('div', { class: 'btn-row' }, button(t('set.security.change'), async () => {
const _o0 = oldF.getValue(), b = newF.getValue(), c = _ot.getValue();
if (String(b).length < 8) return toast(t('auth.err.short'), 'warn');
if (b !== c) return toast(t('auth.err.mismatch'), 'warn');
await auth.changePassword(_o0, b);
oldF.setValue(''); newF.setValue(''); _ot.setValue('');
toast(t('set.security.changed'), 'ok');
}, { kind: 'secondary', icon: 'lock' }))),
renameBlock({ ui, auth }),
h('div', { class: 'sub-block', id: 'tfa-block', 'data-testid': 'tfa-block' }, h('h4', { class: 'section-title' }, 'Xác thực 2 lớp'), _o1j),
h('div', { class: 'sub-block' }, _oo),
h('div', { class: 'sub-block' }, h('h4', { class: 'section-title' }, t('set.security.devices')), _od),
h('div', { class: 'btn-row' },
button(t('auth.lock.now'), () => app.lockNow(), { kind: 'secondary', icon: 'lock', id: 'lock-now' }),
button(t('auth.logout'), () => app.logout(), { kind: 'danger', icon: 'logout', id: 'logout' })));
await renderDeviceSlots(_od, { ui, api, deviceId: api.deviceId, fallback: _ov });
async function _ov(box) {
try {
const res = await api.call('devices.list');
const _o1e = (Array.isArray(res) ? res : (res && (res.devices || res.items)) || []).filter((_ob) => !Number(_ob.revoked));
ui.mountTo(box, ui.list(_o1e, (_ob) => h('div', { class: 'row-main' },
h('div', { class: 'row-text' }, h('strong', null, _ob.name || _ob.id), h('span', { class: 'muted small' }, _ob.last_seen ? ui.date(_ob.last_seen, true) : '')),
(_ob.current || _ob.id === api.deviceId) ? badge(t('set.security.this'), 'gold') : button(t('set.security.revoke'), async () => {
await api.call('devices.revoke', { device_id: _ob.id }); toast(t('set.security.revoked'), 'ok'); _o13();
}, { kind: 'ghost', small: true, icon: 'logout' }))));
} catch (e) { ui.mountTo(box, h('p', { class: 'muted' }, e.userMessage || t('err.network'))); }
}
function _o13() { ui.clear(_o4); _o19(_o4); }
}
function _o15(_o4) { return renderConnections(_o4, ctx, app); }
function _o1f(keys) {
const box = h('div', { class: 'secrets grid-2' });
const state = {};
const _oe = () => ui.mountTo(box, keys.map((_ol) => {
const f = field({ label: t('set.secret.' + _ol), type: _ol === 'owner_email' ? 'email' : 'password', placeholder: state[_ol] ? '••••••••  ' + t('set.secret.set') : t('set.secret.unset'), autocomplete: 'off' });
const save = button(t('common.save'), async () => {
const _o1n = String(f.getValue() || '').trim(); if (!_o1n) return;
await api.call('settings.set', { key: _ol, value: _o1n });
state[_ol] = true; toast(t('common.saved'), 'ok'); _oe();
}, { kind: 'secondary', small: true });
return h('div', { class: 'secret' }, f, h('div', { class: 'secret-foot' }, badge(state[_ol] ? t('set.secret.set') : t('set.secret.unset'), state[_ol] ? 'ok' : 'neutral'), save));
}));
_oe();
api.call('settings.get', { keys: [] }).then((_ob) => { Object.assign(state, (_ob && _ob._secrets) || {}); _oe(); }).catch(() => {});
return box;
}
function _o12(_o4) {
const routes = ai.routes();
const _o1e = TASKS.map((task) => {
const _o1h = field({
label: t('ai.task.' + task), type: 'select', value: routes[task],
options: PROVIDERS.map((_ox) => ({ value: _ox, label: t('ai.provider.' + _ox) })),
onChange: async (_o1n) => { await ai.setRoute(task, _o1n); toast(t('common.saved'), 'ok'); }
});
return _o1h;
});
const _ow = h('p', { class: 'muted', 'aria-live': 'polite' });
const modelF = field({
label: t('set.ai.ollama_model'), value: settings.get('ai.ollama_model', '') || DEFAULT_OLLAMA_MODEL, help: 'ai',
onChange: async (_o1n) => { await settings.set('ai.ollama_model', String(_o1n || '').trim() || DEFAULT_OLLAMA_MODEL); toast(t('common.saved'), 'ok'); }
});
const claudeF = field({
label: t('set.ai.claude'), type: 'toggle', value: !!settings.get('ai.claude_api_enabled', false),
onChange: async (_o1n) => { await settings.set('ai.claude_api_enabled', !!_o1n); toast(t('common.saved'), 'ok'); }
});
const secrets = _o1f(['gemini_key', 'claude_key']);
_o4.append(h('div', { class: 'grid-2' }, _o1e),
h('div', { class: 'sub-block' }, modelF,
h('div', { class: 'btn-row' }, button(t('set.ai.ollama_check'), async () => {
const _o11 = await ai.checkOllama();
_ow.textContent = _o11.ok ? t('set.ai.ollama_ok', { n: _o11.models.length }) + (_o11.models.length ? ' ' + _o11.models.slice(0, 6).join(', ') : '') : t('set.ai.ollama_fail');
}, { kind: 'secondary', icon: 'chip' })), _ow),
claudeF, secrets,
h('div', { class: 'sub-block' },
h('p', { class: 'muted small', 'data-testid': 'ai-ask-note' }, 'Mỗi tính năng AI hỏi trước khi gửi dữ liệu: ghi rõ gửi tới đâu, chi phí ước tính. Việc tốn tiền (Claude) luôn hỏi mỗi lần.'),
h('div', { class: 'btn-row' }, button('Hỏi lại trước mọi tính năng AI', () => { aiAskMemo.clear(); toast(t('common.saved'), 'ok'); }, { kind: 'secondary', icon: 'refresh', testid: 'ai-ask-reset' }))));
}
async function _o14(_o4) { return renderBudgetPanel(_o4, ctx, app); }
async function _o1b(_o4) {
const box = h('div', { class: 'stack' }, ui.spinner());
_o4.append(box);
const items = [];
try {
const _ob = await api.call('drive.usage');
items.push([t('set.storage.drive'), Number(_ob.used) || 0, Number(_ob.total) || 0]);
} catch (e) { items.push([t('set.storage.drive'), null, null, e.userMessage || t('err.network')]); }
try {
if (navigator.storage && navigator.storage.estimate) {
const e = await navigator.storage.estimate();
items.push([t('set.storage.browser'), e.usage || 0, e.quota || 0]);
}
} catch { }
ui.mountTo(box, items.map(([label, used, total, err]) => {
if (used == null) return h('div', { class: 'meter' }, h('div', { class: 'meter-head' }, h('span', null, label), h('span', { class: 'muted' }, err)));
const _oz = total ? used / total * 100 : 0;
const _op = total && (100 - _oz) < 20;
return h('div', { class: 'meter' },
h('div', { class: 'meter-head' }, h('span', null, label), h('strong', { class: 'num' }, _oi(used) + ' / ' + _oi(total))),
h('div', { class: ['meter-bar', _op && 'warn'] }, progress(_oz)),
_op ? h('p', { class: 'warn-text' }, t('set.storage.low')) : null);
}));
}
function _o1a(_o4) {
const _o1l = ctx.user;
const owner = !_o1l || _o1l.role === 'owner' || _o1l.legacy;
if (owner && typeof app.runFullCheck === 'function') renderFullCheck(_o4, ctx, app);
const box = h('div', { class: 'checks' });
if (owner && typeof app.runFullCheck === 'function') _o4.append(h('h4', { class: 'section-title' }, 'Kiểm tra nhanh trên máy này'));
_o4.append(box, h('div', { class: 'btn-row' }, button(t('set.selftest.run'), run, { kind: 'secondary', icon: 'refresh', id: 'selftest-run' })));
const _o1p = () => !!(ctx.video && ctx.video.engineOff());
async function run() {
const _o1e = [
['browser', t('set.selftest.browser'), async () => {
const _or = [];
if (!('indexedDB' in window)) _or.push('IndexedDB');
if (!(window.crypto && crypto.subtle)) _or.push('WebCrypto');
if (!('serviceWorker' in navigator)) _or.push('Service Worker');
if (!('fetch' in window)) _or.push('fetch');
return { ok: !_or.length, text: _or.length ? 'Thiếu ' + _or.join(', ') : 'IndexedDB · WebCrypto · Service Worker' };
}],
['server', t('set.selftest.server'), async () => { const _ob = await api.call('status'); return { ok: true, text: (api.mode === 'demo' ? 'Xem thử · ' : '') + 'v' + (_ob.version || '?') }; }],
['token', t('set.selftest.token'), async () => ({ ok: api.hasValidToken(), text: api.expiresAt ? 'hết hạn ' + ui.date(api.expiresAt) : '' })],
['sync', t('set.selftest.sync'), async () => { const s = await store.syncNow(); return { ok: !s.error && s.online, text: (s.lastSync ? ui.date(s.lastSync, true) : t('sync.never')) + ' · ' + s.pending + ' chờ' + (s.error ? ' · ' + s.error : '') }; }],
['ollama', t('set.selftest.ollama'), async () => { const _o11 = await ai.checkOllama({ bridge: !_o1p() }); return { ok: _o11.ok, text: _o11.ok ? _o11.models.length + ' model' : t('set.ai.ollama_fail') }; }],
['engine', t('set.selftest.engine'), async () => {
const _o9 = new AbortController(); const _o1k = setTimeout(() => _o9.abort(), 2500);
try { const _o11 = await fetch((app.config.ENGINE_URL || 'http://127.0.0.1:8765') + '/health', { signal: _o9.signal }); return { ok: _o11.ok, text: _o11.ok ? 'đang chạy' : 'HTTP ' + _o11.status }; } finally { clearTimeout(_o1k); }
}]
].filter(([id]) => !(id === 'engine' && _o1p()) && !(id === 'ollama' && ctx.video && typeof ctx.video.online === 'function' && ctx.video.online()));
const _o7 = _o1e.map(([id, label]) => {
const s = h('span', { class: 'check-st' }, st(null)); const txt = h('span', { class: 'muted small' });
return { id, row: h('div', { class: 'check', dataset: { check: id } }, h('span', { class: 'check-label' }, label), txt, s), s, txt };
});
const _os = h('div', { class: 'check-mods' });
ui.mountTo(box, _o7.map((c) => c.row), h('h4', { class: 'section-title' }, t('set.selftest.modules')), _os);
ui.mountTo(_os, table(app.registry.entries.filter((e) => !e.core && !(ctx.video && ctx.video.moduleHidden(e.id))), [
{ label: 'Chức năng', render: (e) => (/^[a-z]/i.test(e.manifest.icon || '') ? '' : (e.manifest.icon || '') + ' ') + e.manifest.title },
{ label: 'Phiên bản', render: (e) => (e.state === 'off' ? '—' : 'v' + e.manifest.version) },
{ label: '', render: (e) => (e.state === 'off' ? h('span', { class: 'muted small' }, t('module.off')) : st(e.state === 'ready', e.state === 'ready' ? '' : e.state === 'building' ? t('module.building') : t('module.error'))) }
]));
await Promise.all(_o1e.map(async ([, , fn], i) => {
try { const _o11 = await fn(); ui.mountTo(_o7[i].s, st(!!_o11.ok)); _o7[i].txt.textContent = _o11.text || ''; } catch (e) {
ui.mountTo(_o7[i].s, st(false)); _o7[i].txt.textContent = (e && (e.userMessage || e.message)) || '';
}
}));
}
run();
}
async function _o1c(_o4) {
await renderVersionPanel(_o4, { ui, api, app, user: ctx.user || null, engine: !(ctx.video && ctx.video.engineOff()) });
try { _o4.appendChild(a2hsRow(ui)); } catch (e) { app.errors.report('warn', 'settings.a2hs', String(e && e.message || e)); }
const _o10 = privacyLine(h, { testid: 'set-privacy', lead: 'BDS Studio · ', cfg: app.config || undefined });
if (_o10) _o4.appendChild(_o10);
}
function _o16(_o4) {
const items = app.errors.recent().slice().reverse().slice(0, 30);
_o4.append(items.length ? ui.list(items, (e) => h('div', { class: 'row-text' },
h('div', { class: 'row-line' }, badge(e.level, e.level === 'critical' ? 'danger' : 'warn'), h('span', { class: 'muted small num' }, ui.date(e.at, true))),
h('strong', { class: 'small' }, e.where), h('span', { class: 'small break' }, e.message))) : h('p', { class: 'muted' }, t('set.errors.none')));
}
}
export default { createSettings, mountSettings, applyPrefs, prefs, validateSkill };

import { t } from './i18n.39c909b69c.js';
import { saveScriptUrl, scriptUrl } from './api.024f831cb4.js';
import { PROVIDERS, TASKS, DEFAULT_OLLAMA_MODEL } from './ai.67f02dae48.js';
import { memo as aiAskMemo } from './ai_cost.4e4e8b66f1.js';
import { renderVersionPanel } from './updates.9704b81308.js';
import { privacyLine } from './instance.0601c79adf.js';
import { renderConnections, renderBudgetPanel } from './connections.168a50551f.js';
import { userSections } from './users.56f7da9390.js';
import { renderFullCheck } from './fullcheck.d487e88d66.js';
import { renderTfaPanel, renameBlock } from './tfa.1fd07d9b62.js';
import { renderDeviceSlots } from './device_slots.63f82dd117.js';
import { emailCodeBox, purposeFor } from './email_verify.c44911bb1b.js';
import { settingsRow as a2hsRow } from './a2hs.6e7a288a0e.js';
import { hwEnabled, hwSection } from './hwscan.1f5790e3c8.js';
const P = 'bds:pref:';
export const prefs = {
get(_oj, def) { try { const _o1k = localStorage.getItem(P + _oj); return _o1k == null ? def : JSON.parse(_o1k); } catch { return def; } },
set(_oj, _o1k) { try { localStorage.setItem(P + _oj, JSON.stringify(_o1k)); } catch { } return _o1k; }
};
export const SIZES = ['m', 'l', 'xl'];
export const THEMES = ['light', 'dark', 'auto'];
export function applyPrefs(doc = document) {
const size = prefs.get('size', 'm'); const theme = prefs.get('theme', 'auto');
doc.documentElement.dataset.size = SIZES.includes(size) ? size : 'm';
if (theme === 'light' || theme === 'dark') doc.documentElement.dataset.theme = theme;
else delete doc.documentElement.dataset.theme;
const _oo = doc.querySelector('meta[name="theme-color"]');
if (_oo) _oo.setAttribute('content', theme === 'dark' || (theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches) ? '#0B1626' : '#0F1E33');
}
export function densityFor(screen) {
try { const _o1k = localStorage.getItem('density:' + screen); if (_o1k === 'compact' || _o1k === 'detail') return _o1k; } catch { }
return prefs.get('density', 'compact') === 'detail' ? 'detail' : 'compact';
}
export function setDensityFor(screen, _o1k) { try { localStorage.setItem('density:' + screen, _o1k); } catch { } }
export function parseValue(_o1k) {
if (typeof _o1k !== 'string') return _o1k;
try { return JSON.parse(_o1k); } catch { return _o1k; }
}
export function createSettings(store) {
const _o4 = new Map(); const _o1f = new Map();
const _of = (key, _o1k) => { for (const _oj of [key, '*']) for (const _o5 of _o1f.get(_oj) || []) { try { _o5(_o1k, key); } catch { } } };
const s = {
local: prefs,
async init() {
const _o1b = await store.list('settings');
for (const _oy of _o1b) _o4.set(_oy.key, parseValue(_oy.value));
store.on('settings', ({ row }) => {
if (!row) return;
if (Number(row.deleted)) _o4.delete(row.key); else _o4.set(row.key, parseValue(row.value));
_of(row.key, _o4.get(row.key));
});
return s;
},
get(key, def) { return _o4.has(key) ? _o4.get(key) : def; },
async set(key, value) {
_o4.set(key, value);
await store.put('settings', { key, value: JSON.stringify(value) });
return value;
},
all() { return Object.fromEntries(_o4); },
on(key, _o5) { if (!_o1f.has(key)) _o1f.set(key, new Set()); _o1f.get(key).add(_o5); return () => _o1f.get(key).delete(_o5); }
};
return s;
}
export const SKILL_KINDS = ['templates', 'prompts', 'statuses', 'policy_parser'];
export function validateSkill(obj) {
if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return { ok: false, error: 'không phải object JSON' };
const _o1 = new Set(['name', 'version', 'kind', 'items', 'description', 'author']);
for (const _oj of Object.keys(obj)) if (!_o1.has(_oj)) return { ok: false, error: 'trường lạ "' + _oj + '"' };
if (typeof obj.name !== 'string' || !obj.name.trim() || obj.name.length > 80) return { ok: false, error: 'thiếu name' };
if (typeof obj.version !== 'string' || !/^\d+\.\d+(\.\d+)?$/.test(obj.version)) return { ok: false, error: 'version dạng 1.0.0' };
if (!SKILL_KINDS.includes(obj.kind)) return { ok: false, error: 'kind phải là ' + SKILL_KINDS.join('/') };
if (!Array.isArray(obj.items) || !obj.items.length || obj.items.length > 500) return { ok: false, error: 'items phải là mảng 1–500 phần tử' };
const size = JSON.stringify(obj).length;
if (size > 256 * 1024) return { ok: false, error: 'file quá lớn (> 256KB)' };
const _o2 = (_o1k, depth = 0) => {
if (depth > 6) return true;
if (typeof _o1k === 'function') return true;
if (typeof _o1k === 'string') return /<\s*script|javascript:/i.test(_o1k);
if (_o1k && typeof _o1k === 'object') return Object.values(_o1k).some((_o1o) => _o2(_o1o, depth + 1));
return false;
};
for (const _oi of obj.items) {
if (_oi == null || (typeof _oi !== 'object' && typeof _oi !== 'string')) return { ok: false, error: 'phần tử items không hợp lệ' };
if (_o2(_oi)) return { ok: false, error: 'items chứa mã' };
}
return { ok: true };
}
function fmtBytes(n) {
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
const _o1d = [
['connection', 'link', t('set.conn'), _o12],
['profile', 'user', t('set.profile'), _o15],
['look', 'layout', t('set.look'), _o14],
['security', 'shield', t('set.security'), _o16],
['ai', 'sparkle', t('set.ai'), _oz],
['budget', 'wallet', t('set.budget'), _o11],
['storage', 'disk', t('set.storage'), _o18],
['selftest', 'pulse', t('set.selftest'), _o17],
['version', 'refresh', t('set.version'), _o19],
['errors', 'log', t('set.errors'), _o13]
];
if (typeof app.extraSections === 'function') _o1d.push(...app.extraSections(ctx));
if (hwEnabled(app.config) && !(ctx.video && ctx.video.engineOff())) _o1d.push(hwSection(ctx, app));
_o1d.splice(0, _o1d.length, ...userSections(_o1d, ctx, app));
if (typeof app.lateSections === 'function') _o1d.push(...app.lateSections(ctx));
const _o1n = h('div', { class: 'settings', 'data-testid': 'settings' });
for (const [key, ic, title, render] of _o1d) {
const _o3 = h('div', { class: 'set-body' });
const _ob = h('details', { class: 'set-sec card', id: 'set-' + key, dataset: { sec: key } },
h('summary', { class: 'set-sum' },
h('span', { class: 'card-ico' }, ui.icon(ic, 20)),
h('span', { class: 'set-sum-title' }, title),
typeof app.sectionBadge === 'function' ? app.sectionBadge(key) : null,
help(key === 'connection' ? 'connection' : key === 'look' ? 'density' : key === 'security' ? 'lock' : key, title),
h('span', { class: 'set-chev' }, ui.icon('next', 18))),
_o3);
let _o1a = false;
_ob.addEventListener('toggle', async () => {
if (_ob.open && !_o1a) {
_o1a = true;
try { await render(_o3); } catch (e) {
_o3.appendChild(empty(t('err.generic')));
app.errors.report('warn', 'settings.' + key, String(e && e.message || e), e && e.stack);
}
}
});
_o1n.appendChild(_ob);
}
el.appendChild(_o1n);
const want = { upgrade: 'feedback', skills: 'feedback' }[String((ctx.route && ctx.route.module) || '')] || String((ctx.route && ctx.route.module) || '');
const target = _o1n.querySelector('#set-' + (_o1d.some(([_oj]) => _oj === want) ? want : 'connection'));
if (target) {
target.open = true;
if (want && want !== 'settings') requestAnimationFrame(() => { try { target.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch { } });
}
return _o1n;
function _o15(_o3) {
const _ou = settings.get('profile', {}) || {};
if (!_oh()) {
const _o1i = me() || {};
const _og = (label, value, testid, more) => { const _o1o = field({ label, value: value || '', id: 'profile-' + testid, ...(more || {}) }); _o1o.input.setAttribute('data-testid', 'profile-' + testid); return _o1o; };
const nm = _og(t('set.profile.name'), _o1i.full_name || _o1i.username, 'name', { autocomplete: 'name' });
const ph = _og(t('set.profile.phone'), _o1i.phone, 'phone', { type: 'tel', autocomplete: 'tel', inputmode: 'tel' });
const _o7 = _og(t('set.profile.company'), _ou.company, 'company'); _o7.input.readOnly = true;
const say = h('p', { class: 'form-err', role: 'alert', 'data-testid': 'profile-staff-err' });
_o3.append(h('div', { class: 'grid-2', 'data-testid': 'profile-staff' }, nm, ph, _o7),
h('p', { class: 'muted small' }, 'Tên và số điện thoại này đi kèm tin nhắn, báo giá anh/chị gửi khách. Tên công ty do Quản trị đặt.'), say,
h('div', { class: 'btn-row' }, button(t('common.save'), async () => {
say.textContent = '';
try {
await api.call('me.update', { full_name: String(nm.getValue() || '').trim(), phone: String(ph.getValue() || '').trim() });
if (auth && typeof auth.me === 'function') await auth.me().catch(() => null);
toast(t('common.saved'), 'ok');
} catch (e) { say.textContent = (e && (e.userMessage || e.message)) || t('err.generic'); }
}, { kind: 'primary', icon: 'check', id: 'profile-staff-save', testid: 'profile-staff-save' })));
_o3.append(_oe());
return;
}
const f = {
name: field({ label: t('set.profile.name'), value: _ou.name || '', autocomplete: 'name' }),
title: field({ label: t('set.profile.title'), value: _ou.title || '' }),
company: field({ label: t('set.profile.company'), value: _ou.company || '', autocomplete: 'organization' }),
license: field({ label: t('set.profile.license'), value: _ou.license || '' }),
phone: field({ label: t('set.profile.phone'), type: 'tel', value: _ou.phone || '', autocomplete: 'tel', inputmode: 'tel' }),
zalo: field({ label: t('set.profile.zalo'), type: 'tel', value: _ou.zalo || '', autocomplete: 'tel', inputmode: 'tel' })
};
_o3.append(h('div', { class: 'grid-2' }, Object.values(f)),
h('div', { class: 'btn-row' }, button(t('common.save'), async () => {
const _o1k = Object.fromEntries(Object.entries(f).map(([_oj, _o1o]) => [_oj, String(_o1o.getValue() || '').trim()]));
await settings.set('profile', _o1k);
toast(t('common.saved'), 'ok');
}, { kind: 'primary', icon: 'check', id: 'profile-save' })));
_o3.append(_oe());
}
function me() { return (auth && auth.user) || ctx.user || null; }
function _oh() { const _o1i = me(); return !_o1i || !_o1i.role || _o1i.role === 'owner' || !!_o1i.legacy; }
function _oe() {
const _o1j = me();
if (!_o1j || !_o1j.email_gate || !auth || typeof auth.emailStart !== 'function') return _ok();
const owner = _oh();
const _o1n = h('div', { class: 'sub-block secret', id: 'profile-email', 'data-testid': 'profile-email', dataset: { owner: owner ? '1' : '0', verify: '1' } });
const _od = () => {
const _o1i = me() || {};
const _o9 = String(_o1i.email || (_o1i.email_gate && _o1i.email_gate.email) || '').trim();
const _o1l = !!Number(_o1i.email_verified);
const tag = h('span', { class: 'secret-badge', 'data-testid': 'profile-email-badge' },
badge(!_o9 ? t('set.profile.email.unset') : _o1l ? 'Đã xác nhận' : 'Chưa xác nhận', !_o9 ? 'neutral' : _o1l ? 'ok' : 'warn'));
const box = emailCodeBox({
ui, api, testid: 'profile-ev', email: _o9, label: t('set.profile.email'),
hint: (owner ? t('set.profile.email.hint_owner') : t('set.profile.email.hint')) + ' Đổi email: gõ email mới → "Gửi mã" → nhập mã 6 số gửi tới email mới. Email cũ giữ nguyên tới khi xác nhận xong.',
send: (em) => {
if (_o1l && em.toLowerCase() === _o9.toLowerCase()) throw Object.assign(new Error('Email này đã xác nhận rồi. Muốn đổi thì gõ email mới.'), { userMessage: 'Email này đã xác nhận rồi. Muốn đổi thì gõ email mới.' });
return auth.emailStart(em, purposeFor(em, _o9));
},
verify: (em, code) => (purposeFor(em, _o9) === 'user' ? auth.verifyEmail(code) : auth.setMyEmail(em, code)),
allowAccountEmail: owner, useAccountEmail: () => auth.verifyEmail('', true),
onVerified: (_o1k) => {
toast('Đã xác nhận email ' + _o1k.email, 'ok', 4000);
const _ol = owner && typeof window !== 'undefined' && window.__bds && window.__bds.license;
if (_ol && _ol.enabled && typeof _ol.check === 'function') _ol.check({ force: true }).catch(() => null);
setTimeout(_od, 1200);
}
});
const test = owner ? button('Gửi thử', async () => {
const _oa = await api.call('connections.test', { target: 'email' });
toast((_oa && _oa.message) || (_oa && _oa.ok ? 'Đã gửi thư thử' : 'Chưa gửi được thư'), _oa && _oa.ok ? 'ok' : 'warn', _oa && _oa.ok ? 3200 : 6000);
}, { kind: 'secondary', small: true, icon: 'pulse', testid: 'profile-email-test' }) : null;
ui.mountTo(_o1n, h('h4', { class: 'section-title' }, t('set.profile.email.title')), box, h('div', { class: 'secret-foot' }, tag, h('div', { class: 'btn-row' }, test)));
};
_od();
return _o1n;
}
function _ok() {
const owner = _oh();
let _o9 = String((me() && me().email) || '').trim();
const f = field({ label: t('set.profile.email'), type: 'email', value: _o9, autocomplete: 'email', inputmode: 'email', id: 'profile-email-input',
hint: owner ? t('set.profile.email.hint_owner') : t('set.profile.email.hint'), placeholder: 'Email của anh/chị' });
f.input.setAttribute('data-testid', 'profile-email-input');
f.input.setAttribute('spellcheck', 'false');
const tag = h('span', { class: 'secret-badge', 'data-testid': 'profile-email-badge' });
const _ov = () => ui.mountTo(tag, badge(_o9 ? t('set.profile.email.saved') : t('set.profile.email.unset'), _o9 ? 'ok' : 'neutral'));
const save = button(t('common.save'), async () => {
const _o1k = String(f.getValue() || '').trim();
if (_o1k && !EMAIL_RE.test(_o1k)) { toast('Email chưa đúng dạng', 'warn'); f.input.focus(); return; }
if (!_o1k && !_o9) { toast('Chưa nhập email để lưu', 'warn'); f.input.focus(); return; }
if (auth && typeof auth.setMyEmail === 'function') await auth.setMyEmail(_o1k);
else await api.call('me.update', { email: _o1k });
_o9 = _o1k; f.setValue(_o1k); _ov();
toast(_o1k ? (owner ? 'Đã lưu email lên máy chủ – bấm Gửi thử để chắc chắn' : 'Đã lưu email') : 'Đã xoá email', 'ok');
const _ol = owner && _o1k && typeof window !== 'undefined' && window.__bds && window.__bds.license;
if (_ol && _ol.enabled && typeof _ol.check === 'function') _ol.check({ force: true }).catch(() => null);
}, { kind: 'primary', small: true, icon: 'check', testid: 'profile-email-save' });
const test = owner ? button('Gửi thử', async () => {
const _oa = await api.call('connections.test', { target: 'email' });
toast((_oa && _oa.message) || (_oa && _oa.ok ? 'Đã gửi thư thử' : 'Chưa gửi được thư'), _oa && _oa.ok ? 'ok' : 'warn', _oa && _oa.ok ? 3200 : 6000);
}, { kind: 'secondary', small: true, icon: 'pulse', testid: 'profile-email-test' }) : null;
_ov();
return h('div', { class: 'sub-block secret', id: 'profile-email', 'data-testid': 'profile-email', dataset: { owner: owner ? '1' : '0' } },
h('h4', { class: 'section-title' }, t('set.profile.email.title')),
f, h('div', { class: 'secret-foot' }, tag, h('div', { class: 'btn-row' }, save, test)));
}
function _o14(_o3) {
_o3.append(
h('div', { class: 'field' }, h('span', { class: 'field-label' }, t('set.look.size')),
segmented(['m', 'l', 'xl'].map((_o1k) => ({ value: _o1k, label: t('set.look.size.' + _o1k) })), settings.local.get('size', 'm'),
(_o1k) => { settings.local.set('size', _o1k); app.applyPrefs(); }, { label: t('set.look.size'), name: 'size' })),
h('div', { class: 'field' }, h('span', { class: 'field-label' }, t('set.look.theme')),
segmented(['light', 'dark', 'auto'].map((_o1k) => ({ value: _o1k, label: t('set.look.theme.' + _o1k) })), settings.local.get('theme', 'auto'),
(_o1k) => { settings.local.set('theme', _o1k); app.applyPrefs(); }, { label: t('set.look.theme'), name: 'theme' })),
h('div', { class: 'field' }, h('span', { class: 'field-label' }, t('set.look.density'), help('density')),
segmented([{ value: 'compact', label: t('common.compact') }, { value: 'detail', label: t('common.detail') }], settings.local.get('density', 'compact'),
(_o1k) => { settings.local.set('density', _o1k); app.setDensityDefault(_o1k); }, { label: t('set.look.density'), name: 'density-default' })));
}
async function _o16(_o3) {
const oldF = field({ label: t('set.security.old'), type: 'password', autocomplete: 'current-password' });
const newF = field({ label: t('set.security.new'), type: 'password', autocomplete: 'new-password' });
const _or = field({ label: t('auth.password2'), type: 'password', autocomplete: 'new-password' });
const _om = field({
label: t('set.security.lock'), type: 'number', value: auth.lockMinutes(), min: 1, max: 240, inputmode: 'numeric', help: 'lock', id: 'lock-minutes',
onChange: (_o1k) => { const n = auth.setLockMinutes(_o1k); _om.setValue(n); app.restartIdle(); toast(t('common.saved'), 'ok'); }
});
const _oc = h('div', { class: 'devices' }, ui.spinner());
const _o1g = h('div', { class: 'tfa-box' });
renderTfaPanel(_o1g, { ui, auth, nav: ctx.nav }).catch(() => { });
_o3.append(
h('div', { class: 'sub-block' }, h('h4', { class: 'section-title' }, t('set.security.change')),
h('div', { class: 'grid-3' }, oldF, newF, _or),
h('div', { class: 'btn-row' }, button(t('set.security.change'), async () => {
const _o0 = oldF.getValue(), b = newF.getValue(), c = _or.getValue();
if (String(b).length < 8) return toast(t('auth.err.short'), 'warn');
if (b !== c) return toast(t('auth.err.mismatch'), 'warn');
await auth.changePassword(_o0, b);
oldF.setValue(''); newF.setValue(''); _or.setValue('');
toast(t('set.security.changed'), 'ok');
}, { kind: 'secondary', icon: 'lock' }))),
renameBlock({ ui, auth }),
h('div', { class: 'sub-block', id: 'tfa-block', 'data-testid': 'tfa-block' }, h('h4', { class: 'section-title' }, 'Xác thực 2 lớp'), _o1g),
h('div', { class: 'sub-block' }, _om),
h('div', { class: 'sub-block' }, h('h4', { class: 'section-title' }, t('set.security.devices')), _oc),
h('div', { class: 'btn-row' },
button(t('auth.lock.now'), () => app.lockNow(), { kind: 'secondary', icon: 'lock', id: 'lock-now' }),
button(t('auth.logout'), () => app.logout(), { kind: 'danger', icon: 'logout', id: 'logout' })));
await renderDeviceSlots(_oc, { ui, api, deviceId: api.deviceId, fallback: _os });
async function _os(box) {
try {
const res = await api.call('devices.list');
const _o1b = (Array.isArray(res) ? res : (res && (res.devices || res.items)) || []).filter((_oa) => !Number(_oa.revoked));
ui.mountTo(box, ui.list(_o1b, (_oa) => h('div', { class: 'row-main' },
h('div', { class: 'row-text' }, h('strong', null, _oa.name || _oa.id), h('span', { class: 'muted small' }, _oa.last_seen ? ui.date(_oa.last_seen, true) : '')),
(_oa.current || _oa.id === api.deviceId) ? badge(t('set.security.this'), 'gold') : button(t('set.security.revoke'), async () => {
await api.call('devices.revoke', { device_id: _oa.id }); toast(t('set.security.revoked'), 'ok'); _o10();
}, { kind: 'ghost', small: true, icon: 'logout' }))));
} catch (e) { ui.mountTo(box, h('p', { class: 'muted' }, e.userMessage || t('err.network'))); }
}
function _o10() { ui.clear(_o3); _o16(_o3); }
}
function _o12(_o3) { return renderConnections(_o3, ctx, app); }
function _o1c(keys) {
const box = h('div', { class: 'secrets grid-2' });
const state = {};
const _od = () => ui.mountTo(box, keys.map((_oj) => {
const f = field({ label: t('set.secret.' + _oj), type: _oj === 'owner_email' ? 'email' : 'password', placeholder: state[_oj] ? '••••••••  ' + t('set.secret.set') : t('set.secret.unset'), autocomplete: 'off' });
const save = button(t('common.save'), async () => {
const _o1k = String(f.getValue() || '').trim(); if (!_o1k) return;
await api.call('settings.set', { key: _oj, value: _o1k });
state[_oj] = true; toast(t('common.saved'), 'ok'); _od();
}, { kind: 'secondary', small: true });
return h('div', { class: 'secret' }, f, h('div', { class: 'secret-foot' }, badge(state[_oj] ? t('set.secret.set') : t('set.secret.unset'), state[_oj] ? 'ok' : 'neutral'), save));
}));
_od();
api.call('settings.get', { keys: [] }).then((_oa) => { Object.assign(state, (_oa && _oa._secrets) || {}); _od(); }).catch(() => {});
return box;
}
function _oz(_o3) {
const routes = ai.routes();
const _o1b = TASKS.map((task) => {
const _o1e = field({
label: t('ai.task.' + task), type: 'select', value: routes[task],
options: PROVIDERS.map((_ou) => ({ value: _ou, label: t('ai.provider.' + _ou) })),
onChange: async (_o1k) => { await ai.setRoute(task, _o1k); toast(t('common.saved'), 'ok'); }
});
return _o1e;
});
const _ot = h('p', { class: 'muted', 'aria-live': 'polite' });
const modelF = field({
label: t('set.ai.ollama_model'), value: settings.get('ai.ollama_model', '') || DEFAULT_OLLAMA_MODEL, help: 'ai',
onChange: async (_o1k) => { await settings.set('ai.ollama_model', String(_o1k || '').trim() || DEFAULT_OLLAMA_MODEL); toast(t('common.saved'), 'ok'); }
});
const claudeF = field({
label: t('set.ai.claude'), type: 'toggle', value: !!settings.get('ai.claude_api_enabled', false),
onChange: async (_o1k) => { await settings.set('ai.claude_api_enabled', !!_o1k); toast(t('common.saved'), 'ok'); }
});
const secrets = _o1c(['gemini_key', 'claude_key']);
_o3.append(h('div', { class: 'grid-2' }, _o1b),
h('div', { class: 'sub-block' }, modelF,
h('div', { class: 'btn-row' }, button(t('set.ai.ollama_check'), async () => {
const _oy = await ai.checkOllama();
_ot.textContent = _oy.ok ? t('set.ai.ollama_ok', { n: _oy.models.length }) + (_oy.models.length ? ' ' + _oy.models.slice(0, 6).join(', ') : '') : t('set.ai.ollama_fail');
}, { kind: 'secondary', icon: 'chip' })), _ot),
claudeF, secrets,
h('div', { class: 'sub-block' },
h('p', { class: 'muted small', 'data-testid': 'ai-ask-note' }, 'Mỗi tính năng AI hỏi trước khi gửi dữ liệu: ghi rõ gửi tới đâu, chi phí ước tính. Việc tốn tiền (Claude, Video AI) luôn hỏi mỗi lần.'),
h('div', { class: 'btn-row' }, button('Hỏi lại trước mọi tính năng AI', () => { aiAskMemo.clear(); toast(t('common.saved'), 'ok'); }, { kind: 'secondary', icon: 'refresh', testid: 'ai-ask-reset' }))));
}
async function _o11(_o3) { return renderBudgetPanel(_o3, ctx, app); }
async function _o18(_o3) {
const box = h('div', { class: 'stack' }, ui.spinner());
_o3.append(box);
const items = [];
try {
const _oa = await api.call('drive.usage');
items.push([t('set.storage.drive'), Number(_oa.used) || 0, Number(_oa.total) || 0]);
} catch (e) { items.push([t('set.storage.drive'), null, null, e.userMessage || t('err.network')]); }
try {
if (navigator.storage && navigator.storage.estimate) {
const e = await navigator.storage.estimate();
items.push([t('set.storage.browser'), e.usage || 0, e.quota || 0]);
}
} catch { }
ui.mountTo(box, items.map(([label, used, total, err]) => {
if (used == null) return h('div', { class: 'meter' }, h('div', { class: 'meter-head' }, h('span', null, label), h('span', { class: 'muted' }, err)));
const _ow = total ? used / total * 100 : 0;
const _on = total && (100 - _ow) < 20;
return h('div', { class: 'meter' },
h('div', { class: 'meter-head' }, h('span', null, label), h('strong', { class: 'num' }, fmtBytes(used) + ' / ' + fmtBytes(total))),
h('div', { class: ['meter-bar', _on && 'warn'] }, progress(_ow)),
_on ? h('p', { class: 'warn-text' }, t('set.storage.low')) : null);
}));
}
function _o17(_o3) {
const _o1i = ctx.user;
const owner = !_o1i || _o1i.role === 'owner' || _o1i.legacy;
if (owner && typeof app.runFullCheck === 'function') renderFullCheck(_o3, ctx, app);
const box = h('div', { class: 'checks' });
if (owner && typeof app.runFullCheck === 'function') _o3.append(h('h4', { class: 'section-title' }, 'Kiểm tra nhanh trên máy này'));
_o3.append(box, h('div', { class: 'btn-row' }, button(t('set.selftest.run'), run, { kind: 'secondary', icon: 'refresh', id: 'selftest-run' })));
const _o1m = () => !!(ctx.video && ctx.video.engineOff());
async function run() {
const _o1b = [
['browser', t('set.selftest.browser'), async () => {
const _op = [];
if (!('indexedDB' in window)) _op.push('IndexedDB');
if (!(window.crypto && crypto.subtle)) _op.push('WebCrypto');
if (!('serviceWorker' in navigator)) _op.push('Service Worker');
if (!('fetch' in window)) _op.push('fetch');
return { ok: !_op.length, text: _op.length ? 'Thiếu ' + _op.join(', ') : 'IndexedDB · WebCrypto · Service Worker' };
}],
['server', t('set.selftest.server'), async () => { const _oa = await api.call('status'); return { ok: true, text: (api.mode === 'demo' ? 'Xem thử · ' : '') + 'v' + (_oa.version || '?') }; }],
['token', t('set.selftest.token'), async () => ({ ok: api.hasValidToken(), text: api.expiresAt ? 'hết hạn ' + ui.date(api.expiresAt) : '' })],
['sync', t('set.selftest.sync'), async () => { const s = await store.syncNow(); return { ok: !s.error && s.online, text: (s.lastSync ? ui.date(s.lastSync, true) : t('sync.never')) + ' · ' + s.pending + ' chờ' + (s.error ? ' · ' + s.error : '') }; }],
['ollama', t('set.selftest.ollama'), async () => { const _oy = await ai.checkOllama({ bridge: !_o1m() }); return { ok: _oy.ok, text: _oy.ok ? _oy.models.length + ' model' : t('set.ai.ollama_fail') }; }],
['engine', t('set.selftest.engine'), async () => {
const _o8 = new AbortController(); const _o1h = setTimeout(() => _o8.abort(), 2500);
try { const _oy = await fetch((app.config.ENGINE_URL || 'http://127.0.0.1:8765') + '/health', { signal: _o8.signal }); return { ok: _oy.ok, text: _oy.ok ? 'đang chạy' : 'HTTP ' + _oy.status }; } finally { clearTimeout(_o1h); }
}]
].filter(([id]) => !(id === 'engine' && _o1m()) && !(id === 'ollama' && ctx.video && typeof ctx.video.online === 'function' && ctx.video.online()));
const _o6 = _o1b.map(([id, label]) => {
const s = h('span', { class: 'check-st' }, st(null)); const txt = h('span', { class: 'muted small' });
return { id, row: h('div', { class: 'check', dataset: { check: id } }, h('span', { class: 'check-label' }, label), txt, s), s, txt };
});
const _oq = h('div', { class: 'check-mods' });
ui.mountTo(box, _o6.map((c) => c.row), h('h4', { class: 'section-title' }, t('set.selftest.modules')), _oq);
ui.mountTo(_oq, table(app.registry.entries.filter((e) => !e.core && !(ctx.video && ctx.video.moduleHidden(e.id))), [
{ label: 'Module', render: (e) => (e.manifest.icon || '') + ' ' + e.manifest.title },
{ label: 'Phiên bản', render: (e) => 'v' + e.manifest.version },
{ label: '', render: (e) => st(e.state === 'ready', e.state === 'ready' ? '' : e.state === 'building' ? t('module.building') : t('module.error')) }
]));
await Promise.all(_o1b.map(async ([, , fn], i) => {
try { const _oy = await fn(); ui.mountTo(_o6[i].s, st(!!_oy.ok)); _o6[i].txt.textContent = _oy.text || ''; } catch (e) {
ui.mountTo(_o6[i].s, st(false)); _o6[i].txt.textContent = (e && (e.userMessage || e.message)) || '';
}
}));
}
run();
}
async function _o19(_o3) {
await renderVersionPanel(_o3, { ui, api, app, user: ctx.user || null, engine: !(ctx.video && ctx.video.engineOff()) });
try { _o3.appendChild(a2hsRow(ui)); } catch (e) { app.errors.report('warn', 'settings.a2hs', String(e && e.message || e)); }
const _ox = privacyLine(h, { testid: 'set-privacy', lead: 'BDS Studio · ', cfg: app.config || undefined });
if (_ox) _o3.appendChild(_ox);
}
function _o13(_o3) {
const items = app.errors.recent().slice().reverse().slice(0, 30);
_o3.append(items.length ? ui.list(items, (e) => h('div', { class: 'row-text' },
h('div', { class: 'row-line' }, badge(e.level, e.level === 'critical' ? 'danger' : 'warn'), h('span', { class: 'muted small num' }, ui.date(e.at, true))),
h('strong', { class: 'small' }, e.where), h('span', { class: 'small break' }, e.message))) : h('p', { class: 'muted' }, t('set.errors.none')));
}
}
export default { createSettings, mountSettings, applyPrefs, prefs, validateSkill };

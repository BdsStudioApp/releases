import { t } from './i18n.17f01a0b54.js';
import { saveScriptUrl, scriptUrl } from './api.e356e031da.js';
import { PROVIDERS, TASKS } from './ai.9ec2d0ad23.js';
import { mapLegacyRoutes, PAID_NOTE } from './ai_providers.596b40a694.js';
import { memo as aiAskMemo } from './ai_cost.e55e3f489e.js';
import { renderVersionPanel } from './updates.a1be44bf9a.js';
import { privacyLine } from './instance.1eceeeedc8.js';
const _od = () => import('./connections.7bec5a6011.js');
import { userSections } from './users.897a836e5b.js';
import { renderFullCheck } from './fullcheck.41b5664ebd.js';
import { renderBioControl } from './maintenance.ddac84e4e0.js';
import { renderTfaPanel, renameBlock } from './tfa.741f96ece0.js';
import { renderDeviceSlots } from './device_slots.ecfe7d8f57.js';
import { emailCodeBox, purposeFor } from './email_verify.4f5a65756b.js';
import { settingsRow as a2hsRow } from './a2hs.1403f674ce.js';
import { hwEnabled, hwSection } from './hwscan.6fd75f9ede.js';
const P = 'bds:pref:';
export const prefs = {
get(_or, def) { try { const _o1u = localStorage.getItem(P + _or); return _o1u == null ? def : JSON.parse(_o1u); } catch { return def; } },
set(_or, _o1u) { try { localStorage.setItem(P + _or, JSON.stringify(_o1u)); } catch { } return _o1u; }
};
export const SIZES = ['m', 'l', 'xl'];
export const THEMES = ['light', 'dark', 'auto'];
export function applyPrefs(doc = document) {
const size = prefs.get('size', 'm'); const theme = prefs.get('theme', 'auto');
doc.documentElement.dataset.size = SIZES.includes(size) ? size : 'm';
if (theme === 'light' || theme === 'dark') doc.documentElement.dataset.theme = theme;
else delete doc.documentElement.dataset.theme;
const _ow = doc.querySelector('meta[name="theme-color"]');
if (_ow) _ow.setAttribute('content', theme === 'dark' || (theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches) ? '#0B1626' : '#0F1E33');
}
export function densityFor(screen) {
try { const _o1u = localStorage.getItem('density:' + screen); if (_o1u === 'compact' || _o1u === 'detail') return _o1u; } catch { }
return prefs.get('density', 'compact') === 'detail' ? 'detail' : 'compact';
}
export function setDensityFor(screen, _o1u) { try { localStorage.setItem('density:' + screen, _o1u); } catch { } }
export function parseValue(_o1u) {
if (typeof _o1u !== 'string') return _o1u;
try { return JSON.parse(_o1u); } catch { return _o1u; }
}
export function createSettings(store) {
const _o8 = new Map(); const _o1p = new Map();
const _om = (key, _o1u) => { for (const _or of [key, '*']) for (const _o9 of _o1p.get(_or) || []) { try { _o9(_o1u, key); } catch { } } };
const s = {
local: prefs,
async init() {
const _o1k = await store.list('settings');
for (const _o17 of _o1k) _o8.set(_o17.key, parseValue(_o17.value));
store.on('settings', ({ row }) => {
if (!row) return;
if (Number(row.deleted)) _o8.delete(row.key); else _o8.set(row.key, parseValue(row.value));
_om(row.key, _o8.get(row.key));
});
return s;
},
get(key, def) { return _o8.has(key) ? _o8.get(key) : def; },
async set(key, value) {
_o8.set(key, value);
await store.put('settings', { key, value: JSON.stringify(value) });
return value;
},
all() { return Object.fromEntries(_o8); },
on(key, _o9) { if (!_o1p.has(key)) _o1p.set(key, new Set()); _o1p.get(key).add(_o9); return () => _o1p.get(key).delete(_o9); }
};
return s;
}
export const SKILL_KINDS = ['templates', 'prompts', 'statuses', 'policy_parser'];
export function validateSkill(obj) {
if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return { ok: false, error: 'không phải object JSON' };
const _o4 = new Set(['name', 'version', 'kind', 'items', 'description', 'author']);
for (const _or of Object.keys(obj)) if (!_o4.has(_or)) return { ok: false, error: 'trường lạ "' + _or + '"' };
if (typeof obj.name !== 'string' || !obj.name.trim() || obj.name.length > 80) return { ok: false, error: 'thiếu name' };
if (typeof obj.version !== 'string' || !/^\d+\.\d+(\.\d+)?$/.test(obj.version)) return { ok: false, error: 'version dạng 1.0.0' };
if (!SKILL_KINDS.includes(obj.kind)) return { ok: false, error: 'kind phải là ' + SKILL_KINDS.join('/') };
if (!Array.isArray(obj.items) || !obj.items.length || obj.items.length > 500) return { ok: false, error: 'items phải là mảng 1–500 phần tử' };
const size = JSON.stringify(obj).length;
if (size > 256 * 1024) return { ok: false, error: 'file quá lớn (> 256KB)' };
const _o5 = (_o1u, depth = 0) => {
if (depth > 6) return true;
if (typeof _o1u === 'function') return true;
if (typeof _o1u === 'string') return /<\s*script|javascript:/i.test(_o1u);
if (_o1u && typeof _o1u === 'object') return Object.values(_o1u).some((_o1y) => _o5(_o1y, depth + 1));
return false;
};
for (const _oq of obj.items) {
if (_oq == null || (typeof _oq !== 'object' && typeof _oq !== 'string')) return { ok: false, error: 'phần tử items không hợp lệ' };
if (_o5(_oq)) return { ok: false, error: 'items chứa mã' };
}
return { ok: true };
}
function _oo(_oz) {
_oz = Number(_oz) || 0;
if (_oz >= 1e12) return (_oz / 1e12).toFixed(2).replace('.', ',') + ' TB';
if (_oz >= 1e9) return (_oz / 1e9).toFixed(1).replace('.', ',') + ' GB';
if (_oz >= 1e6) return (_oz / 1e6).toFixed(1).replace('.', ',') + ' MB';
return Math.round(_oz / 1e3) + ' KB';
}
const usd = (_oz) => '$' + (Number(_oz) || 0).toFixed(2);
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const ADVANCED_KEYS = ['memory', 'persona', 'budget', 'storage', 'selftest', 'errors', 'hw', 'archive'];
export function advancedGroup(app, settings) {
const _ob = String((app && app.config && app.config.edition) || 'owner');
const _ok = String((app && app.status && app.status.edition) || '');
if (_ok === 'ca-nhan') return true;
if (_ob === 'owner' || _ok === 'cong-ty' || _ob === 'cong-ty') return false;
return _ob === 'ca-nhan' || !!(settings && settings.get && settings.get('install.mode', '') === 'personal');
}
export async function mountSettings(el, ctx, app) {
const { ui, api, store, ai, settings } = ctx;
const auth = app.auth || ctx.auth;
const { h, card, field, button, segmented, help, toast, status: st, progress, badge, empty, table } = ui;
const _o1n = [
['connection', 'link', t('set.conn'), _o1b],
['profile', 'user', t('set.profile'), _o1e],
['look', 'layout', t('set.look'), _o1d],
['security', 'shield', t('set.security'), _o1f],
['ai', 'sparkle', t('set.ai'), _o18],
['budget', 'wallet', t('set.budget'), _o1a],
['storage', 'disk', t('set.storage'), _o1h],
['selftest', 'pulse', t('set.selftest'), _o1g],
['version', 'refresh', t('set.version'), _o1i],
['errors', 'log', t('set.errors'), _o1c]
];
if (typeof app.extraSections === 'function') _o1n.push(...app.extraSections(ctx));
if (hwEnabled(app.config) && !(ctx.video && ctx.video.engineOff())) _o1n.push(hwSection(ctx, app));
_o1n.splice(0, _o1n.length, ...userSections(_o1n, ctx, app));
if (typeof app.lateSections === 'function') _o1n.push(...app.lateSections(ctx));
const _o1x = h('div', { class: 'settings', 'data-testid': 'settings' });
const _o3 = advancedGroup(app, settings) ? _o1n.map((_o1y) => _o1y[0]).filter((_or) => ADVANCED_KEYS.includes(_or)) : [];
const _o1 = _o3.length >= 2 ? h('div', { class: 'set-body set-adv-body' },
h('p', { class: 'muted small', 'data-testid': 'set-advanced-note' }, 'Các mục ít dùng: ' + _o1n.filter((_o1y) => _o3.includes(_o1y[0])).map((_o1y) => _o1y[2]).join(', ') + '.')) : null;
const _o2 = _o1 ? h('details', { class: 'set-sec set-adv card', id: 'set-advanced', dataset: { sec: 'advanced' }, 'data-testid': 'set-advanced' },
h('summary', { class: 'set-sum' }, h('span', { class: 'card-ico' }, ui.icon('settings', 20)), h('span', { class: 'set-sum-title' }, 'Nâng cao'),
h('span', { class: 'set-sum-count muted small' }, _o3.length + ' mục'), h('span', { class: 'set-chev' }, ui.icon('next', 18))), _o1) : null;
for (const [key, ic, title, render] of _o1n) {
const _o7 = h('div', { class: 'set-body' });
const _oh = h('details', { class: 'set-sec card', id: 'set-' + key, dataset: { sec: key } },
h('summary', { class: 'set-sum' },
h('span', { class: 'card-ico' }, ui.icon(ic, 20)),
h('span', { class: 'set-sum-title' }, title),
typeof app.sectionBadge === 'function' ? app.sectionBadge(key) : null,
help(key === 'connection' ? 'connection' : key === 'look' ? 'density' : key === 'security' ? 'lock' : key, title),
h('span', { class: 'set-chev' }, ui.icon('next', 18))),
_o7);
let _o1j = false;
_oh.addEventListener('toggle', async () => {
if (_oh.open && !_o1j) {
_o1j = true;
try { await render(_o7); } catch (e) {
_o7.appendChild(empty(t('err.generic')));
app.errors.report('warn', 'settings.' + key, String(e && e.message || e), e && e.stack);
}
}
});
if (_o2 && _o3.includes(key)) _o1.appendChild(_oh); else _o1x.appendChild(_oh);
}
if (_o2) _o1x.appendChild(_o2);
el.appendChild(_o1x);
const asked = String((ctx.route && ctx.route.module) || '');
const want = _o1n.some(([_or]) => _or === asked) ? asked : ({ upgrade: 'feedback', skills: 'feedback', onboarding: 'wizard' }[asked] || asked);
const target = _o1x.querySelector('#set-' + (_o1n.some(([_or]) => _or === want) || (_o2 && want === 'advanced') ? want : 'connection'));
if (target) {
target.open = true;
if (_o2 && _o2 !== target && _o2.contains(target)) _o2.open = true;
if (want && want !== 'settings') requestAnimationFrame(() => {
try {
const _o6 = document.querySelector('.topbar');
const _o11 = _o6 ? Math.max(0, _o6.getBoundingClientRect().bottom) : 0;
window.scrollTo({ top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - _o11 - 8), behavior: 'smooth' });
} catch { try { target.scrollIntoView({ block: 'start' }); } catch { } }
});
}
return _o1x;
function _o1e(_o7) {
const _o13 = settings.get('profile', {}) || {};
if (!_op()) {
const _o1s = me() || {};
const _on = (label, value, testid, more) => { const _o1y = field({ label, value: value || '', id: 'profile-' + testid, ...(more || {}) }); _o1y.input.setAttribute('data-testid', 'profile-' + testid); return _o1y; };
const nm = _on(t('set.profile.name'), _o1s.full_name || _o1s.username, 'name', { autocomplete: 'name' });
const ph = _on(t('set.profile.phone'), _o1s.phone, 'phone', { type: 'tel', autocomplete: 'tel', inputmode: 'tel' });
const _oc = _on(t('set.profile.company'), _o13.company, 'company'); _oc.input.readOnly = true;
const say = h('p', { class: 'form-err', role: 'alert', 'data-testid': 'profile-staff-err' });
_o7.append(h('div', { class: 'grid-2', 'data-testid': 'profile-staff' }, nm, ph, _oc),
h('p', { class: 'muted small' }, 'Tên và số điện thoại này đi kèm tin nhắn, báo giá anh/chị gửi khách. Tên công ty do Quản trị đặt.'), say,
h('div', { class: 'btn-row' }, button(t('common.save'), async () => {
say.textContent = '';
try {
await api.call('me.update', { full_name: String(nm.getValue() || '').trim(), phone: String(ph.getValue() || '').trim() });
if (auth && typeof auth.me === 'function') await auth.me().catch(() => null);
toast(t('common.saved'), 'ok');
} catch (e) { say.textContent = (e && (e.userMessage || e.message)) || t('err.generic'); }
}, { kind: 'primary', icon: 'check', id: 'profile-staff-save', testid: 'profile-staff-save' })));
_o7.append(_ol());
return;
}
const f = {
name: field({ label: t('set.profile.name'), value: _o13.name || '', autocomplete: 'name' }),
title: field({ label: t('set.profile.title'), value: _o13.title || '' }),
company: field({ label: t('set.profile.company'), value: _o13.company || '', autocomplete: 'organization' }),
license: field({ label: t('set.profile.license'), value: _o13.license || '' }),
phone: field({ label: t('set.profile.phone'), type: 'tel', value: _o13.phone || '', autocomplete: 'tel', inputmode: 'tel' }),
zalo: field({ label: t('set.profile.zalo'), type: 'tel', value: _o13.zalo || '', autocomplete: 'tel', inputmode: 'tel' })
};
_o7.append(h('div', { class: 'grid-2' }, Object.values(f)),
h('div', { class: 'btn-row' }, button(t('common.save'), async () => {
const _o1u = Object.fromEntries(Object.entries(f).map(([_or, _o1y]) => [_or, String(_o1y.getValue() || '').trim()]));
await settings.set('profile', _o1u);
toast(t('common.saved'), 'ok');
}, { kind: 'primary', icon: 'check', id: 'profile-save' })));
_o7.append(_ol());
}
function me() { return (auth && auth.user) || ctx.user || null; }
function _op() { const _o1s = me(); return !_o1s || !_o1s.role || _o1s.role === 'owner' || !!_o1s.legacy; }
function _ol() {
const _o1t = me();
if (!_o1t || !_o1t.email_gate || !auth || typeof auth.emailStart !== 'function') return _os();
const owner = _op();
const _o1x = h('div', { class: 'sub-block secret', id: 'profile-email', 'data-testid': 'profile-email', dataset: { owner: owner ? '1' : '0', verify: '1' } });
const _oj = () => {
const _o1s = me() || {};
const _of = String(_o1s.email || (_o1s.email_gate && _o1s.email_gate.email) || '').trim();
const _o1v = !!Number(_o1s.email_verified);
const tag = h('span', { class: 'secret-badge', 'data-testid': 'profile-email-badge' },
badge(!_of ? t('set.profile.email.unset') : _o1v ? 'Đã xác nhận' : 'Chưa xác nhận', !_of ? 'neutral' : _o1v ? 'ok' : 'warn'));
const box = emailCodeBox({
ui, api, testid: 'profile-ev', email: _of, label: t('set.profile.email'),
hint: (owner ? t('set.profile.email.hint_owner') : t('set.profile.email.hint')) + ' Đổi email: gõ email mới → "Gửi mã" → nhập mã 6 số gửi tới email mới. Email cũ giữ nguyên tới khi xác nhận xong.',
send: (em) => {
if (_o1v && em.toLowerCase() === _of.toLowerCase()) throw Object.assign(new Error('Email này đã xác nhận rồi. Muốn đổi thì gõ email mới.'), { userMessage: 'Email này đã xác nhận rồi. Muốn đổi thì gõ email mới.' });
return auth.emailStart(em, purposeFor(em, _of));
},
verify: (em, code) => (purposeFor(em, _of) === 'user' ? auth.verifyEmail(code) : auth.setMyEmail(em, code)),
allowAccountEmail: owner, useAccountEmail: () => auth.verifyEmail('', true),
onVerified: (_o1u) => {
toast('Đã xác nhận email ' + _o1u.email, 'ok', 4000);
const _ot = owner && typeof window !== 'undefined' && window.__bds && window.__bds.license;
if (_ot && _ot.enabled && typeof _ot.check === 'function') _ot.check({ force: true }).catch(() => null);
setTimeout(_oj, 1200);
}
});
const test = owner ? button('Gửi thử', async () => {
const _og = await api.call('connections.test', { target: 'email' });
toast((_og && _og.message) || (_og && _og.ok ? 'Đã gửi thư thử' : 'Chưa gửi được thư'), _og && _og.ok ? 'ok' : 'warn', _og && _og.ok ? 3200 : 6000);
}, { kind: 'secondary', small: true, icon: 'pulse', testid: 'profile-email-test' }) : null;
ui.mountTo(_o1x, h('h4', { class: 'section-title' }, t('set.profile.email.title')), box, h('div', { class: 'secret-foot' }, tag, h('div', { class: 'btn-row' }, test)));
};
_oj();
return _o1x;
}
function _os() {
const owner = _op();
let _of = String((me() && me().email) || '').trim();
const f = field({ label: t('set.profile.email'), type: 'email', value: _of, autocomplete: 'email', inputmode: 'email', id: 'profile-email-input',
hint: owner ? t('set.profile.email.hint_owner') : t('set.profile.email.hint'), placeholder: 'Email của anh/chị' });
f.input.setAttribute('data-testid', 'profile-email-input');
f.input.setAttribute('spellcheck', 'false');
const tag = h('span', { class: 'secret-badge', 'data-testid': 'profile-email-badge' });
const _o14 = () => ui.mountTo(tag, badge(_of ? t('set.profile.email.saved') : t('set.profile.email.unset'), _of ? 'ok' : 'neutral'));
const save = button(t('common.save'), async () => {
const _o1u = String(f.getValue() || '').trim();
if (_o1u && !EMAIL_RE.test(_o1u)) { toast('Email chưa đúng dạng', 'warn'); f.input.focus(); return; }
if (!_o1u && !_of) { toast('Chưa nhập email để lưu', 'warn'); f.input.focus(); return; }
if (auth && typeof auth.setMyEmail === 'function') await auth.setMyEmail(_o1u);
else await api.call('me.update', { email: _o1u });
_of = _o1u; f.setValue(_o1u); _o14();
toast(_o1u ? (owner ? 'Đã lưu email lên máy chủ – bấm Gửi thử để chắc chắn' : 'Đã lưu email') : 'Đã xoá email', 'ok');
const _ot = owner && _o1u && typeof window !== 'undefined' && window.__bds && window.__bds.license;
if (_ot && _ot.enabled && typeof _ot.check === 'function') _ot.check({ force: true }).catch(() => null);
}, { kind: 'primary', small: true, icon: 'check', testid: 'profile-email-save' });
const test = owner ? button('Gửi thử', async () => {
const _og = await api.call('connections.test', { target: 'email' });
toast((_og && _og.message) || (_og && _og.ok ? 'Đã gửi thư thử' : 'Chưa gửi được thư'), _og && _og.ok ? 'ok' : 'warn', _og && _og.ok ? 3200 : 6000);
}, { kind: 'secondary', small: true, icon: 'pulse', testid: 'profile-email-test' }) : null;
_o14();
return h('div', { class: 'sub-block secret', id: 'profile-email', 'data-testid': 'profile-email', dataset: { owner: owner ? '1' : '0' } },
h('h4', { class: 'section-title' }, t('set.profile.email.title')),
f, h('div', { class: 'secret-foot' }, tag, h('div', { class: 'btn-row' }, save, test)));
}
function _o1d(_o7) {
_o7.append(
h('div', { class: 'field' }, h('span', { class: 'field-label' }, t('set.look.size')),
segmented(['m', 'l', 'xl'].map((_o1u) => ({ value: _o1u, label: t('set.look.size.' + _o1u) })), settings.local.get('size', 'm'),
(_o1u) => { settings.local.set('size', _o1u); app.applyPrefs(); }, { label: t('set.look.size'), name: 'size' })),
h('div', { class: 'field' }, h('span', { class: 'field-label' }, t('set.look.theme')),
segmented(['light', 'dark', 'auto'].map((_o1u) => ({ value: _o1u, label: t('set.look.theme.' + _o1u) })), settings.local.get('theme', 'auto'),
(_o1u) => { settings.local.set('theme', _o1u); app.applyPrefs(); }, { label: t('set.look.theme'), name: 'theme' })),
h('div', { class: 'field' }, h('span', { class: 'field-label' }, t('set.look.density'), help('density')),
segmented([{ value: 'compact', label: t('common.compact') }, { value: 'detail', label: t('common.detail') }], settings.local.get('density', 'compact'),
(_o1u) => { settings.local.set('density', _o1u); app.setDensityDefault(_o1u); }, { label: t('set.look.density'), name: 'density-default' })));
}
async function _o1f(_o7) {
const oldF = field({ label: t('set.security.old'), type: 'password', autocomplete: 'current-password' });
const newF = field({ label: t('set.security.new'), type: 'password', autocomplete: 'new-password' });
const _o10 = field({ label: t('auth.password2'), type: 'password', autocomplete: 'new-password' });
const _ou = field({
label: t('set.security.lock'), type: 'number', value: auth.lockMinutes(), min: 1, max: 240, inputmode: 'numeric', help: 'lock', id: 'lock-minutes',
onChange: (_o1u) => { const _oz = auth.setLockMinutes(_o1u); _ou.setValue(_oz); app.restartIdle(); toast(t('common.saved'), 'ok'); }
});
const _oi = h('div', { class: 'devices' }, ui.spinner());
const _o1q = h('div', { class: 'tfa-box' });
renderTfaPanel(_o1q, { ui, auth, nav: ctx.nav }).catch(() => { });
const bioBox = h('div', { class: 'sub-block', 'data-testid': 'sec-bio' });
renderBioControl(bioBox, { ui, app: { auth }, prefix: 'sec-bio' });
_o7.append(
h('div', { class: 'sub-block' }, h('h4', { class: 'section-title' }, t('set.security.change')),
h('div', { class: 'grid-3' }, oldF, newF, _o10),
h('div', { class: 'btn-row' }, button(t('set.security.change'), async () => {
const _o0 = oldF.getValue(), b = newF.getValue(), c = _o10.getValue();
if (String(b).length < 8) return toast(t('auth.err.short'), 'warn');
if (b !== c) return toast(t('auth.err.mismatch'), 'warn');
await auth.changePassword(_o0, b);
oldF.setValue(''); newF.setValue(''); _o10.setValue('');
toast(t('set.security.changed'), 'ok');
}, { kind: 'secondary', icon: 'lock' }))),
renameBlock({ ui, auth }),
h('div', { class: 'sub-block', id: 'tfa-block', 'data-testid': 'tfa-block' }, h('h4', { class: 'section-title' }, 'Xác thực 2 lớp'), _o1q),
h('div', { class: 'sub-block' }, _ou),
bioBox,
h('div', { class: 'sub-block' }, h('h4', { class: 'section-title' }, t('set.security.devices')), _oi),
h('div', { class: 'btn-row' },
button(t('auth.lock.now'), () => app.lockNow(), { kind: 'secondary', icon: 'lock', id: 'lock-now' }),
button(t('auth.logout'), () => app.logout(), { kind: 'danger', icon: 'logout', id: 'logout' })));
await renderDeviceSlots(_oi, { ui, api, deviceId: api.deviceId, fallback: _o12 });
async function _o12(box) {
try {
const res = await api.call('devices.list');
const _o1k = (Array.isArray(res) ? res : (res && (res.devices || res.items)) || []).filter((_og) => !Number(_og.revoked));
ui.mountTo(box, ui.list(_o1k, (_og) => h('div', { class: 'row-main' },
h('div', { class: 'row-text' }, h('strong', null, _og.name || _og.id), h('span', { class: 'muted small' }, _og.last_seen ? ui.date(_og.last_seen, true) : '')),
(_og.current || _og.id === api.deviceId) ? badge(t('set.security.this'), 'gold') : button(t('set.security.revoke'), async () => {
await api.call('devices.revoke', { device_id: _og.id }); toast(t('set.security.revoked'), 'ok'); _o19();
}, { kind: 'ghost', small: true, icon: 'logout' }))));
} catch (e) { ui.mountTo(box, h('p', { class: 'muted' }, e.userMessage || t('err.network'))); }
}
function _o19() { ui.clear(_o7); _o1f(_o7); }
}
function _o1b(_o7) { return _od().then((m) => m.renderConnections(_o7, ctx, app)); }
function _o1m(keys) {
const box = h('div', { class: 'secrets grid-2' });
const state = {};
const _oj = () => ui.mountTo(box, keys.map((_or) => {
const f = field({ label: t('set.secret.' + _or), type: _or === 'owner_email' ? 'email' : 'password', placeholder: state[_or] ? '••••••••  ' + t('set.secret.set') : t('set.secret.unset'), autocomplete: 'off' });
const save = button(t('common.save'), async () => {
const _o1u = String(f.getValue() || '').trim(); if (!_o1u) return;
await api.call('settings.set', { key: _or, value: _o1u });
state[_or] = true; toast(t('common.saved'), 'ok'); _oj();
}, { kind: 'secondary', small: true });
return h('div', { class: 'secret' }, f, h('div', { class: 'secret-foot' }, badge(state[_or] ? t('set.secret.set') : t('set.secret.unset'), state[_or] ? 'ok' : 'neutral'), save));
}));
_oj();
api.call('settings.get', { keys: [] }).then((_og) => { Object.assign(state, (_og && _og._secrets) || {}); _oj(); }).catch(() => {});
return box;
}
function _o18(_o7) {
const routes = mapLegacyRoutes(ai.routes(), ai.availability ? ai.availability() : null);
const _o1k = TASKS.map((task) => {
const _o1o = field({
label: t('ai.task.' + task), type: 'select', value: routes[task],
options: PROVIDERS.map((_o13) => ({ value: _o13, label: t('ai.provider.' + _o13) })),
onChange: async (_o1u) => { await ai.setRoute(task, _o1u); toast(t('common.saved'), 'ok'); }
});
return _o1o;
});
const claudeF = field({
label: t('set.ai.claude'), type: 'toggle', value: !!settings.get('ai.claude_api_enabled', false),
onChange: async (_o1u) => { await settings.set('ai.claude_api_enabled', !!_o1u); toast(t('common.saved'), 'ok'); }
});
const secrets = _o1m(['gemini_key', 'claude_key']);
_o7.append(h('p', { class: 'muted small', 'data-testid': 'ai-paid-note' }, PAID_NOTE),
h('div', { class: 'grid-2' }, _o1k), claudeF, secrets,
h('div', { class: 'sub-block' },
h('p', { class: 'muted small', 'data-testid': 'ai-ask-note' }, 'Mỗi tính năng AI hỏi trước khi gửi dữ liệu: ghi rõ gửi tới đâu, chi phí ước tính. Việc tốn tiền (Claude, Video AI) luôn hỏi mỗi lần.'),
h('div', { class: 'btn-row' }, button('Hỏi lại trước mọi tính năng AI', () => { aiAskMemo.clear(); toast(t('common.saved'), 'ok'); }, { kind: 'secondary', icon: 'refresh', testid: 'ai-ask-reset' }))));
}
async function _o1a(_o7) { return (await _od()).renderBudgetPanel(_o7, ctx, app); }
async function _o1h(_o7) {
const box = h('div', { class: 'stack' }, ui.spinner());
_o7.append(box);
const items = [];
try {
const _og = await api.call('drive.usage');
items.push([t('set.storage.drive'), Number(_og.used) || 0, Number(_og.total) || 0]);
} catch (e) { items.push([t('set.storage.drive'), null, null, e.userMessage || t('err.network')]); }
try {
if (navigator.storage && navigator.storage.estimate) {
const e = await navigator.storage.estimate();
items.push([t('set.storage.browser'), e.usage || 0, e.quota || 0]);
}
} catch { }
ui.mountTo(box, items.map(([label, used, total, err]) => {
if (used == null) return h('div', { class: 'meter' }, h('div', { class: 'meter-head' }, h('span', null, label), h('span', { class: 'muted' }, err)));
const _o15 = total ? used / total * 100 : 0;
const _ov = total && (100 - _o15) < 20;
return h('div', { class: 'meter' },
h('div', { class: 'meter-head' }, h('span', null, label), h('strong', { class: 'num' }, _oo(used) + ' / ' + _oo(total))),
h('div', { class: ['meter-bar', _ov && 'warn'] }, progress(_o15)),
_ov ? h('p', { class: 'warn-text' }, t('set.storage.low')) : null);
}));
}
function _o1g(_o7) {
const _o1s = ctx.user;
const owner = !_o1s || _o1s.role === 'owner' || _o1s.legacy;
if (owner && typeof app.runFullCheck === 'function') renderFullCheck(_o7, ctx, app);
const box = h('div', { class: 'checks' });
if (owner && typeof app.runFullCheck === 'function') _o7.append(h('h4', { class: 'section-title' }, 'Kiểm tra nhanh trên máy này'));
_o7.append(box, h('div', { class: 'btn-row' }, button(t('set.selftest.run'), () => _o1l(), { kind: 'secondary', icon: 'refresh', id: 'selftest-run' })));
const _o1w = () => !!(ctx.video && ctx.video.engineOff());
async function _o1l() {
const _o1k = [
['browser', t('set.selftest.browser'), async () => {
const _ox = [];
if (!('indexedDB' in window)) _ox.push('IndexedDB');
if (!(window.crypto && crypto.subtle)) _ox.push('WebCrypto');
if (!('serviceWorker' in navigator)) _ox.push('Service Worker');
if (!('fetch' in window)) _ox.push('fetch');
return { ok: !_ox.length, text: _ox.length ? 'Thiếu ' + _ox.join(', ') : 'IndexedDB · WebCrypto · Service Worker' };
}],
['server', t('set.selftest.server'), async () => { const _og = await api.call('status'); return { ok: true, text: (api.mode === 'demo' ? 'Xem thử · ' : '') + 'v' + (_og.version || '?') }; }],
['token', t('set.selftest.token'), async () => ({ ok: api.hasValidToken(), text: api.expiresAt ? 'hết hạn ' + ui.date(api.expiresAt) : '' })],
['sync', t('set.selftest.sync'), async () => { const s = await store.syncNow(); return { ok: !s.error && s.online, text: (s.lastSync ? ui.date(s.lastSync, true) : t('sync.never')) + ' · ' + s.pending + ' chờ' + (s.error ? ' · ' + s.error : '') }; }],
['engine', t('set.selftest.engine'), async () => {
const _oe = new AbortController(); const _o1r = setTimeout(() => _oe.abort(), 2500);
try { const _o17 = await fetch((app.config.ENGINE_URL || 'http://127.0.0.1:8765') + '/health', { signal: _oe.signal }); return { ok: _o17.ok, text: _o17.ok ? 'đang chạy' : 'HTTP ' + _o17.status }; } finally { clearTimeout(_o1r); }
}]
].filter(([id]) => !(id === 'engine' && _o1w()));
const _oa = _o1k.map(([id, label]) => {
const s = h('span', { class: 'check-st' }, st(null)); const txt = h('span', { class: 'muted small' });
return { id, row: h('div', { class: 'check', dataset: { check: id } }, h('span', { class: 'check-label' }, label), txt, s), s, txt };
});
const _oy = h('div', { class: 'check-mods' });
ui.mountTo(box, _oa.map((c) => c.row), h('h4', { class: 'section-title' }, t('set.selftest.modules')), _oy);
ui.mountTo(_oy, table(app.registry.entries.filter((e) => !e.core && !(ctx.video && ctx.video.moduleHidden(e.id))), [
{ label: 'Chức năng', render: (e) => (/^[a-z]/i.test(e.manifest.icon || '') ? '' : (e.manifest.icon || '') + ' ') + e.manifest.title },
{ label: 'Phiên bản', render: (e) => (e.state === 'off' ? '—' : 'v' + e.manifest.version) },
{ label: '', render: (e) => (e.state === 'off' ? h('span', { class: 'muted small' }, t('module.off')) : st(e.state === 'ready', e.state === 'ready' ? '' : e.state === 'building' ? t('module.building') : t('module.error'))) }
]));
await Promise.all(_o1k.map(async ([, , fn], i) => {
try { const _o17 = await fn(); ui.mountTo(_oa[i].s, st(_o17.ok === null ? null : !!_o17.ok)); _oa[i].txt.textContent = _o17.text || ''; } catch (e) {
ui.mountTo(_oa[i].s, st(false)); _oa[i].txt.textContent = (e && (e.userMessage || e.message)) || '';
}
}));
}
_o1l();
}
async function _o1i(_o7) {
await renderVersionPanel(_o7, { ui, api, app, user: ctx.user || null, engine: !(ctx.video && ctx.video.engineOff()) });
try { _o7.appendChild(a2hsRow(ui)); } catch (e) { app.errors.report('warn', 'settings.a2hs', String(e && e.message || e)); }
const _o16 = privacyLine(h, { testid: 'set-privacy', lead: 'BDS Studio · ', cfg: app.config || undefined });
if (_o16) _o7.appendChild(_o16);
}
function _o1c(_o7) {
const items = app.errors.recent().slice().reverse().slice(0, 30);
_o7.append(items.length ? ui.list(items, (e) => h('div', { class: 'row-text' },
h('div', { class: 'row-line' }, badge(e.level, e.level === 'critical' ? 'danger' : 'warn'), h('span', { class: 'muted small num' }, ui.date(e.at, true))),
h('strong', { class: 'small' }, e.where), h('span', { class: 'small break' }, e.message))) : h('p', { class: 'muted' }, t('set.errors.none')));
}
}
export default { createSettings, mountSettings, applyPrefs, prefs, validateSkill };

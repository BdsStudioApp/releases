import { t } from './i18n.17f01a0b54.js';
import ui from './ui.efd703fd85.js';
import { addDefaults, ensureCss, word, words, ls } from './xkit.71d637c634.js';
import * as memoryMod from './memory.0e46c2fde6.js';
import * as personaMod from './persona.bfd2018cff.js';
import * as packsMod from './packs.a4fe44641f.js';
import * as onbMod from './onboarding.38818cd6f0.js';
import * as mntMod from './maintenance.7e804063ae.js';
import * as askMod from './ask.17ec9e4c47.js';
import { helpDocLink, helpPageForRoute } from './help_links.2d1b2d6d34.js';
import { allowedBy } from './registry.dd6202705b.js';
import { screenAllowed, settingsKeysFor } from './users.897a836e5b.js';
import { hwEnabled } from './hwscan.6fd75f9ede.js';
import * as slots from './slots.f531f1a378.js';
export const SECTION_KEYS = ['memory', 'persona', 'onboarding', 'maintenance'];
export function installExtras({ S, appHooks, ctxFor, nav, config = {} }) {
addDefaults({ ...memoryMod.WORDS, ...personaMod.WORDS, ...packsMod.WORDS, ...onbMod.WORDS, ...mntMod.WORDS, ...askMod.WORDS,
'set.memory': memoryMod.WORDS['mem.title'], 'set.persona': personaMod.WORDS['persona.title'], 'set.onboarding': onbMod.WORDS['onb.title'], 'set.maintenance': mntMod.WORDS['mnt.title'] });
ensureCss(new URL('./extras.2f7945fadc.css', import.meta.url).href, 'bds-extras-css');
const settings = S.settings;
const memory = memoryMod.createMemory({ settings, ui });
const persona = personaMod.createPersona({ settings, memory, getUser: () => S.user || null });
const openFeedback = (o) => (typeof appHooks.openFeedback === 'function' ? appHooks.openFeedback(o) : nav('settings/feedback'));
const submitFeedback = (o) => {
if (typeof appHooks.submitFeedback !== 'function') throw new Error(t('ask.fb.missing'));
return appHooks.submitFeedback(o);
};
if (S.ai) S.ai.prefix = (task, o) => persona.prefixFor(task, o);
const isOwner = () => !S.user || !S.user.role || S.user.role === 'owner';
if (isOwner()) memory.ensureSeeds().then(() => memory.monthly()).catch((e) => report('memory.seed', e));
const _o8 = () => { try { document.documentElement.dataset.ai = S.ai && S.ai.connected && !S.ai.connected() ? 'off' : 'on'; } catch { } };
const _o9 = () => { if (isOwner() && S.ai && S.ai.refreshAvailability) S.ai.refreshAvailability().then(_o8).catch(() => { }); };
_o8();
for (const _o2 of ['ai.available', 'ai.claude_api_enabled', 'ai.routes']) settings.on(_o2, _o8);
_o9();
let _o4 = '';
S.routeSubs.add((r) => { if (_o4 === 'settings' && r.screen !== 'settings') _o9(); _o4 = r.screen; });
const add = (id, mod) => S.registry.add({ id, core: false, manifest: mod.manifest, mod, state: 'ready' });
add('packs', packsMod.packsModule({ submitFeedback, openFeedback, getPacks: () => S.packs, isOwner, getScreenToggle: () => S.video,
deviceOnly: (def) => (def.modules || []).filter((id) => S.registry.deviceBlocked(id)).map((id) => { const e = S.registry.get(id); return (e && e.manifest && e.manifest.title) || ((S.pack && S.pack.meta && S.pack.meta[id]) || {}).title || id; }) }));
appHooks.extraSections = (ctx) => [
['memory', 'user', t('set.memory'), (body) => memoryMod.renderMemoryPanel(body, { ui: ctx.ui, memory, persona })],
['persona', 'sparkle', t('set.persona'), (body) => personaMod.renderPersonaPanel(body, { ui: ctx.ui, persona })],
...(onbMod.useWizard(config) ? [] : [['onboarding', 'check', t('set.onboarding'), (body) => onbMod.renderOnboarding(body, { ui: ctx.ui, api: S.api, settings, config, nav, video: S.video })]]),
['maintenance', 'wrench', t('set.maintenance'), (body) => mntMod.renderMaintenancePanel(body, { ui: ctx.ui, api: S.api, store: S.store, app: appHooks, config, settings,
engineOff: () => !!(S.video && (typeof S.video.engineOff === 'function' ? S.video.engineOff() : S.video.hidden())) || !!(S.packs && S.packs.moduleOn && !S.packs.moduleOn('video')) })]
];
const shown = (e) => !!(e && S.registry.allowed(e) && !(S.video && e.manifest && S.video.pathHidden((e.manifest.screen || '') + '/' + e.manifest.id)));
const _ob = askMod.CORE_KW.open.map(([kws, path]) => ({ id: path, path, screen: 'settings', title: word('set.' + path.split('/')[1]) || kws.split(';')[0] }));
const getFeatures = () => { const L = askMod.askLibs(); return L ? L.AP.featureMap((S.registry ? S.registry.entries : []).filter(shown), { screenLabel: (s) => t('screen.' + s), extra: _ob }) : []; };
const hasModule = (id) => { const e = S.registry && S.registry.get(id); return !!(e && e.state === 'ready' && shown(e)); };
let _o3 = { at: 0, kb: null };
const getKb = () => {
if (_o3.kb && Date.now() - _o3.at < 1500) return _o3.kb;
const pack = S.registry && S.registry.pack;
const L = askMod.askLibs();
if (!pack || !L) return null;
const _o0 = L.KB;
const perms = S.user && S.user.perms;
const availOf = (id, e) => {
if (S.registry.deviceBlocked(id)) return 'device';
if (id !== 'packs' && S.packs && !S.packs.moduleOn(id)) return 'pack';
if (S.video && e && e.manifest && S.video.pathHidden((e.manifest.screen || '') + '/' + id)) return 'pack';
const m = e && e.manifest;
if (m && !(allowedBy(m, perms) && screenAllowed(m.screen, perms))) return 'perm';
if (!e || e.state === 'off') return 'pack';
return e.state === 'ready' ? 'ok' : e.state;
};
const _oa = settingsKeysFor(_o0.SETTINGS_SECTIONS.filter((_o2) => _o2 !== 'users' && _o2 !== 'mytg'), S.user);
const _o1 = (_o2) => (_o2 === 'hw' ? (hwEnabled(config) ? 'ok' : 'perm') : (_o2 === 'feedback' || _o2 === 'license' || _oa.includes(_o2) ? 'ok' : 'perm'));
const kb = _o0.buildKb({
modules: _o0.kbModules(pack, S.packs ? S.packs.defs() : [], { entries: S.registry.entries, availOf }),
settings: _o0.kbSettings(_o0.SETTINGS_SECTIONS, { one: (_o2) => word(_o2), availOf: _o1 }),
screens: _o0.kbScreens((_o2) => word(_o2)), lines: words('ask.kb'), steps: words('ask.kb.steps'),
shipped: new Set([...(Array.isArray(pack.modules) ? pack.modules : []).map((m) => String(typeof m === 'string' ? m : m && m.id)), 'packs']),
screenLabel: (s) => t('screen.' + s), packsLabel: t('xpack.title')
});
if (!_o3.warned && (kb.missing.length || kb.bad.length)) report('ask.kb', 'thiếu/lệch: ' + [...kb.missing, ...kb.bad].join(', ').slice(0, 400));
_o3 = { at: Date.now(), kb, warned: _o3.warned || !!(kb.missing.length || kb.bad.length) };
return kb;
};
const ask = askMod.createAsk({ ui, store: S.store, ai: S.ai, nav, memory, persona, openFeedback, get data() { return S.data; },
getScreens: () => ['home', 'customers', 'sales', 'content', 'settings'].map((s) => t('screen.' + s)), getFeatures, getKb, getRoute: () => S.route, hasModule,
helpLink: (hh) => helpDocLink(hh, helpPageForRoute(S.route || {}) || 'README'),
allowPath: (p) => !S.video || !S.video.pathHidden(p),
deviceBlocked: (path) => { const m = /^#?\/?[a-z]+\/([a-z0-9_-]+)/i.exec(String(path || '')); return !!(m && S.registry.deviceBlocked(m[1])); } });
S.ask = ask;
const _o5 = () => ask.mountButton(document.querySelector('.topbar .top-actions'));
_o5();
if (!window.__bdsAskKey) {
window.__bdsAskKey = true;
document.addEventListener('keydown', (e) => {
if (!askMod.isAskShortcut(e)) return;
const _oh = window.__bds && window.__bds.extras;
if (!_oh || !_oh.S.shellReady || _oh.S.lockEl) return;
e.preventDefault(); _oh.ask.open();
});
}
const _o7 = { ui, api: S.api, settings, config, nav, get video() { return S.video; } };
const _oc = () => mntMod.backupDueInfo({ settings, store: S.store }).then((info) => {
const _of = document.getElementById('view');
if (!info.due || !_of || _of.querySelector('[data-testid="backup-due"]') || !S.route || S.route.screen !== 'home' || S.route.module) return;
_of.insertBefore(mntMod.dueBanner(info, { ui, nav }), _of.children[1] || null);
}).catch(() => { });
const _od = () => {
if (!onbMod.useWizard(config) || !S.user) return;
const _o2 = String(S.user.id || S.user.username || 'me'), r = isOwner() ? settings.get('first3.' + _o2, null) : ls.get('bds:first3:' + _o2, null);
if (!r || !(r.done || r.later >= 2)) import('./first_steps.25f6c0736c.js').then((m) => m.maybeShow({ S, ui, nav, hasModule, owner: isOwner() })).catch((e) => report('first3', e));
};
const _o6 = (r) => {
_o5();
if (r.screen === 'home' && !r.module) _od();
if (!isOwner() || r.screen !== 'home' || r.module) return;
if (S.api.mode !== 'demo') _oc();
const _oe = onbMod.state();
if (!onbMod.shouldAutoShow(_oe, { role: S.user && S.user.role })) return;
const _og = onbMod.useWizard(config);
if (_og && !_oe.shown) onbMod.saveState({ shown: true });
if (_og && settings.get('install.mode', '')) return;
const _of = document.getElementById('view');
if (_of && !_of.querySelector('[data-testid="onb-banner"]')) _of.insertBefore(onbMod.banner(_o7), _of.children[1] || null);
if (!_og && S.api.mode !== 'demo' && !_oe.shown) { onbMod.saveState({ shown: true }); onbMod.openOnboarding(_o7); }
};
S.routeSubs.add(_o6);
if (S.auth && !S.__bioHook) {
S.__bioHook = true;
S.afterLockShown = () => {
if (!S.lockEl) return;
mntMod.attachLockScreen(S.lockEl, async () => {
if (typeof S.auth.unlockVerified !== 'function' || !S.auth.unlockVerified()) return false;
if (S.lockEl) { S.lockEl.remove(); S.lockEl = null; }
document.getElementById('app')?.classList.remove('is-locked');
S.auth.startIdle();
return true;
}, ui);
};
if (S.lockEl) S.afterLockShown();
}
if (S.auth && !S.__bioOffer) {
S.__bioOffer = true;
S.auth.on('unlock', () => setTimeout(() => { mntMod.offerBio({ ui, app: { auth: S.auth } }).catch(() => {}); }, 700));
}
if (mntMod.cleanDue()) (window.requestIdleCallback || ((f) => setTimeout(f, 3000)))(() => mntMod.cleanBrowser().catch(() => {}));
const extras = { S, memory, persona, ask, slots, onboarding: { open: () => onbMod.openOnboarding(_o7) }, maintenance: mntMod };
window.__bds = { ...(window.__bds || {}), extras };
return extras;
function report(where, e) { try { appHooks.errors.report('warn', where, String(e && e.message || e)); } catch { } }
}
export default installExtras;

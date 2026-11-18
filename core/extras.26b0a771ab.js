import { t } from './i18n.39c909b69c.js';
import ui from './ui.6d9018bbdb.js';
import { addDefaults, ensureCss } from './xkit.f03faf0986.js';
import * as memoryMod from './memory.3d288471ae.js';
import * as personaMod from './persona.bc87a5e5ff.js';
import * as packsMod from './packs.603a1dc003.js';
import * as onbMod from './onboarding.d7e34c3f18.js';
import * as mntMod from './maintenance.1c57cc1a0b.js';
import * as askMod from './ask.8c8d5b228d.js';
import * as slots from './slots.f531f1a378.js';
export const SECTION_KEYS = ['memory', 'persona', 'onboarding', 'maintenance'];
export function installExtras({ S, appHooks, ctxFor, nav, config = {} }) {
addDefaults({ ...memoryMod.WORDS, ...personaMod.WORDS, ...packsMod.WORDS, ...onbMod.WORDS, ...mntMod.WORDS, ...askMod.WORDS,
'set.memory': memoryMod.WORDS['mem.title'], 'set.persona': personaMod.WORDS['persona.title'], 'set.onboarding': onbMod.WORDS['onb.title'], 'set.maintenance': mntMod.WORDS['mnt.title'] });
ensureCss(new URL('./extras.46f0657278.css', import.meta.url).href, 'bds-extras-css');
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
const _o5 = () => { try { document.documentElement.dataset.ai = S.ai && S.ai.connected && !S.ai.connected() ? 'off' : 'on'; } catch { } };
const _o6 = () => { if (isOwner() && S.ai && S.ai.refreshAvailability) S.ai.refreshAvailability().then(_o5).catch(() => { }); };
_o5();
for (const _o0 of ['ai.available', 'ai.claude_api_enabled', 'ai.ollama_model', 'ai.routes']) settings.on(_o0, _o5);
_o6();
let _o1 = '';
S.routeSubs.add((r) => { if (_o1 === 'settings' && r.screen !== 'settings') _o6(); _o1 = r.screen; });
const add = (id, mod) => S.registry.add({ id, core: false, manifest: mod.manifest, mod, state: 'ready' });
add('packs', packsMod.packsModule({ submitFeedback, openFeedback, getPacks: () => S.packs, isOwner, getScreenToggle: () => S.video }));
appHooks.extraSections = (ctx) => [
['memory', 'user', t('set.memory'), (body) => memoryMod.renderMemoryPanel(body, { ui: ctx.ui, memory, persona })],
['persona', 'sparkle', t('set.persona'), (body) => personaMod.renderPersonaPanel(body, { ui: ctx.ui, persona })],
['onboarding', 'check', t('set.onboarding'), (body) => onbMod.renderOnboarding(body, { ui: ctx.ui, api: S.api, settings, config, nav, video: S.video })],
['maintenance', 'wrench', t('set.maintenance'), (body) => mntMod.renderMaintenancePanel(body, { ui: ctx.ui, api: S.api, store: S.store, app: appHooks, config,
engineOff: () => !!(S.video && (typeof S.video.engineOff === 'function' ? S.video.engineOff() : S.video.hidden())) || !!(S.packs && S.packs.moduleOn && !S.packs.moduleOn('video')) })]
];
const ask = askMod.createAsk({ ui, store: S.store, ai: S.ai, nav, memory, openFeedback, get data() { return S.data; }, getScreens: () => ['home', 'customers', 'sales', 'content', 'inbox', 'settings'].map((s) => t('screen.' + s)),
allowPath: (p) => !S.video || !S.video.pathHidden(p) });
const _o2 = () => ask.mountButton(document.querySelector('.topbar .top-actions'));
_o2();
if (!window.__bdsAskKey) {
window.__bdsAskKey = true;
document.addEventListener('keydown', (e) => {
if (!askMod.isAskShortcut(e)) return;
const _o9 = window.__bds && window.__bds.extras;
if (!_o9 || !_o9.S.shellReady || _o9.S.lockEl) return;
e.preventDefault(); _o9.ask.open();
});
}
const _o4 = { ui, api: S.api, settings, config, nav, get video() { return S.video; } };
const _o3 = (r) => {
_o2();
if (!isOwner() || r.screen !== 'home' || r.module) return;
const _o7 = onbMod.state();
if (!onbMod.shouldAutoShow(_o7, { role: S.user && S.user.role })) return;
const _o8 = document.getElementById('view');
if (_o8 && !_o8.querySelector('[data-testid="onb-banner"]')) _o8.insertBefore(onbMod.banner(_o4), _o8.children[1] || null);
if (S.api.mode !== 'demo' && !_o7.shown) { onbMod.saveState({ shown: true }); onbMod.openOnboarding(_o4); }
};
S.routeSubs.add(_o3);
if (S.auth && !S.__bioHook) {
S.__bioHook = true;
S.auth.on('lock', () => setTimeout(() => {
if (!S.lockEl) return;
mntMod.attachLockScreen(S.lockEl, async () => {
if (typeof S.auth.unlockVerified !== 'function' || !S.auth.unlockVerified()) return false;
if (S.lockEl) { S.lockEl.remove(); S.lockEl = null; }
document.getElementById('app')?.classList.remove('is-locked');
S.auth.startIdle();
return true;
}, ui);
}, 0));
}
if (mntMod.cleanDue()) (window.requestIdleCallback || ((f) => setTimeout(f, 3000)))(() => mntMod.cleanBrowser().catch(() => {}));
const extras = { S, memory, persona, ask, slots, onboarding: { open: () => onbMod.openOnboarding(_o4) }, maintenance: mntMod };
window.__bds = { ...(window.__bds || {}), extras };
return extras;
function report(where, e) { try { appHooks.errors.report('warn', where, String(e && e.message || e)); } catch { } }
}
export default installExtras;

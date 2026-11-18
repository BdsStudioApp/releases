import { t } from './i18n.39c909b69c.js';
import { words, word } from './xkit.f03faf0986.js';
export const SETTINGS_KEY = 'packs';
export const SCHEMA = 2;
export const KINDS = ['core', 'optional', 'extension'];
export const FILTERS = ['all', 'installed', 'notinstalled', 'dev'];
export const ACTIONS = ['install', 'enable', 'disable', 'update', 'uninstall', 'request'];
export const EXPERIMENTAL = 'thu_nghiem';
export const WORDS = {
'xpack.title': 'Gói chức năng',
'xpack.desc': 'Cài, bật/tắt gói chức năng của app',
'xpack.lead': 'Gói Cơ bản luôn có. Các gói khác: cài và bật/tắt ở đây, áp dụng cho mọi tài khoản trong app. Tắt hoặc gỡ gói chỉ ẩn menu của gói – dữ liệu giữ nguyên, bật lại là dùng tiếp. Gói "🧪 Thử nghiệm – sắp có" hiện để anh/chị biết trước, chưa tải về được.',
'xpack.lead.member': 'Các gói đang dùng trong công ty. Quản trị (Admin) quyết định cài, bật hoặc tắt gói.',
'xpack.st.core': 'Luôn có',
'xpack.st.dev': 'Đang phát triển',
'xpack.st.trial': 'Thử nghiệm',
'xpack.st.experimental': '🧪 Thử nghiệm – dùng thử miễn phí & góp ý',
'xpack.exp.note': 'Gói thử nghiệm mở miễn phí cho máy đang dùng thử app hoặc đã có bản quyền – dùng và góp ý giúp hoàn thiện gói.',
'xpack.exp.disabled': 'Mua bản quyền để dùng thử gói này',
'xpack.exp.download': 'Tải về',
'xpack.exp.safe': 'Bản thử nghiệm có thể còn lỗi – dữ liệu của anh/chị vẫn an toàn.',
'xpack.feedback': 'Góp ý gói này',
'xpack.notify': 'Báo tôi khi có',
'xpack.notify.on': 'Sẽ báo khi có',
'xpack.notify.done': 'Đã ghi nhớ trên máy này – khi gói "{p}" sẵn sàng, app sẽ báo.',
'xpack.notify.ready': 'Gói "{p}" đã sẵn sàng – vào Cài đặt › Gói chức năng để cài.',
'xpack.err.experimental': 'Gói thử nghiệm chỉ mở cho máy đang dùng thử hoặc đã có bản quyền – mua bản quyền để dùng thử gói này.',
'xpack.trial.note': 'Gói thử nghiệm: dùng được nhưng còn đang hoàn thiện. Chưa cài thì app không tải gói này; gỡ ra dữ liệu vẫn giữ.',
'xpack.st.notinstalled': 'Chưa cài',
'xpack.st.on': 'Đã cài – Đang bật',
'xpack.st.off': 'Đã cài – Đang tắt',
'xpack.st.update': 'Có bản mới',
'xpack.st.requested': 'Đã gửi yêu cầu',
'xpack.f.all': 'Tất cả',
'xpack.f.installed': 'Đã cài',
'xpack.f.notinstalled': 'Chưa cài',
'xpack.f.dev': 'Đang phát triển',
'xpack.need': 'Tôi cần gói này',
'xpack.view': 'Xem yêu cầu',
'xpack.need.sent': 'Đã gửi vào Góp ý: "Cần gói: {p}".',
'xpack.need.queued': 'Đã lưu Góp ý "Cần gói: {p}" – có mạng sẽ tự gửi.',
'xpack.install': 'Cài',
'xpack.update': 'Cập nhật',
'xpack.changes': 'Xem thay đổi',
'xpack.remove': 'Gỡ',
'xpack.switch.on': 'Đang bật',
'xpack.switch.off': 'Đang tắt',
'xpack.no': 'Gói {n}',
'xpack.version': 'Phiên bản {v}',
'xpack.version.new': 'bản mới {v}',
'xpack.needs': 'Cần cài và bật gói "{p}" trước.',
'xpack.module.needs': '{m}: cần bật gói "{p}".',
'xpack.remove.confirm': 'Gỡ gói "{p}"? Menu của gói sẽ ẩn với mọi người trong công ty. Dữ liệu giữ nguyên – cài lại là dùng tiếp.',
'xpack.done.install': 'Đã cài gói "{p}" – menu của gói đã hiện.',
'xpack.done.enable': 'Đã bật gói "{p}".',
'xpack.done.disable': 'Đã tắt gói "{p}" – dữ liệu giữ nguyên.',
'xpack.done.update': 'Đã cập nhật gói "{p}" lên bản {v}.',
'xpack.done.uninstall': 'Đã gỡ gói "{p}" – dữ liệu giữ nguyên.',
'xpack.err.owner': 'Chỉ Quản trị (Admin) được cài, bật hoặc tắt gói.',
'xpack.err.entitled': 'Bản quyền chưa gồm gói này.',
'xpack.err.state': 'Gói đang ở trạng thái khác – tải lại màn này.',
'xpack.none': 'Không có gói nào trong mục này.',
'xpack.changes.none': 'Chưa có ghi chú thay đổi.',
'help.packs': 'Mỗi gói là một nhóm chức năng. "Luôn có": Gói Cơ bản. "Đang phát triển": chưa có code – bấm "Tôi cần gói này" để gửi yêu cầu (kèm ước tính thời gian, chi phí). "🧪 Thử nghiệm – sắp có": gói đang thử nghiệm, chưa tải về được – bấm "Báo tôi khi có" để được nhắc khi gói sẵn sàng. "Chưa cài": bấm Cài. "Đã cài": công tắc bật/tắt cho cả công ty; tắt hoặc Gỡ chỉ ẩn menu, dữ liệu giữ nguyên. "Có bản mới": xem thay đổi rồi bấm Cập nhật.'
};
let _oh = null;
export function entitled(packId, rec = null) {
if (packId === 'core') return true;
try { return _oh ? _oh(packId, rec) !== false : true; } catch { return true; }
}
export function setEntitlement(fn) { _oh = typeof fn === 'function' ? fn : null; }
const _o1a = (k, p) => { const _o12 = t(k, p); return _o12 === k && WORDS[k] ? WORDS[k] : _o12; };
let _o8 = null;
export function setBetaGate(fn) { _o8 = typeof fn === 'function' ? fn : null; }
export function betaAllowed() { try { return _o8 ? _o8() === true : false; } catch { return false; } }
let _ob = null, cardExtraSig = '';
const _oc = new Set();
export function setPackCardExtra(fn, sig = '') {
const _ok = typeof fn === 'function' ? fn : null, _o12 = String(sig || '');
if (_ok === _ob && _o12 === cardExtraSig) return;
_ob = _ok; cardExtraSig = _o12;
for (const _od of _oc) { try { _od(); } catch { } }
}
export function onPackCardExtra(_od) { _oc.add(_od); return () => _oc.delete(_od); }
export function packCardExtra(def, ctx) { try { return _ob ? _ob(def, ctx) || null : null; } catch { return null; } }
const _o5 = (v) => (Array.isArray(v) ? v.filter((x) => x != null && x !== '') : []);
const _o2 = /^\d+\.\d+(\.\d+)?$/;
const _oo = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
export function cmpVer(a, b) {
const _ow = String(a || '0').split('.').map((x) => parseInt(x, 10) || 0);
const _oy = String(b || '0').split('.').map((x) => parseInt(x, 10) || 0);
for (let _om = 0; _om < Math.max(_ow.length, _oy.length); _om++) { const d = (_ow[_om] || 0) - (_oy[_om] || 0); if (d) return d > 0 ? 1 : -1; }
return 0;
}
export function buildDefs(pack, read = words, one = word) {
const list = _o5(pack && pack.packs).filter(_oo);
const _op = new Set(list.map((p) => p.id));
const extra = read('xpack.ids').filter((id) => !_op.has(id)).map((id) => ({ id, kind: 'extension', status: 'dev' }));
return [...list, ...extra].filter((p) => typeof p.id === 'string' && /^[a-z0-9_-]+$/i.test(p.id)).map((p) => {
const kind = p.id === 'core' ? 'core' : (KINDS.includes(p.kind) ? p.kind : 'extension');
const experimental = kind !== 'core' && p.status === EXPERIMENTAL;
return {
id: p.id, kind, no: Number(p.no) || 0,
version: _o2.test(String(p.version || '')) ? String(p.version) : '0.0.0',
status: kind === 'core' || p.status === 'ready' || experimental ? 'ready' : 'dev',
experimental,
modules: _o5(p.modules).map(String), features: _o5(p.features).map(String), requires: _o5(p.requires).map(String),
defaultInstalled: !!p.default_installed,
trial: kind !== 'core' && !!p.trial,
moduleRequires: Object.fromEntries(Object.entries(_oo(p.module_requires) ? p.module_requires : {}).map(([m, r]) => [String(m), _o5(Array.isArray(r) ? r : [r]).map(String)])),
changelog: _o5(p.changelog).filter((c) => _oo(c) && c.version).map((c) => ({ version: String(c.version), date: String(c.date || ''), items: _o5(c.items).map(String) }))
.sort((a, b) => cmpVer(b.version, a.version)),
title: one('xpack.' + p.id + '.title') || p.title || p.id,
desc: one('xpack.' + p.id + '.desc') || p.desc || '',
items: read('xpack.' + p.id + '.items')
};
});
}
export const PACK_ICONS = { core: 'home', video: 'film', sales: 'calculator', care: 'heart', leads: 'megaphone', source: 'building', learn: 'cap', videoai: 'sparkle' };
export function packIcon(def) { return PACK_ICONS[def && def.id] || 'puzzle'; }
export function packTitle(def) {
const title = String((def && def.title) || '');
const no = (n) => { const _o12 = t('xpack.no', { n }); return _o12 === 'xpack.no' ? WORDS['xpack.no'].replace('{n}', n) : _o12; };
if (def && def.no) return no(def.no) + ' · ' + title;
return /^gói\s/i.test(title) ? title : no(title);
}
export function recordOf(state, def) {
const r = _oo(state) ? state[def.id] : null;
if (_oo(r) && typeof r.installed === 'boolean') return { enabled: r.installed, ...r };
const _o7 = { installed: false, enabled: false, version: '' };
if (def.kind === 'optional' && def.defaultInstalled && def.status === 'ready' && !def.experimental) Object.assign(_o7, { installed: true, enabled: true, version: def.version, legacy: true });
if (_oo(r) && (r.status === 'requested' || r.requested)) Object.assign(_o7, { requested: true, request_id: String(r.request_id || '') });
return _o7;
}
export function cardStatus(def, rec, ent = entitled) {
if (def.kind === 'core') return 'core';
if (def.experimental && !betaAllowed()) return 'experimental';
if (def.status !== 'ready') return 'dev';
if (!rec || !rec.installed) return 'notinstalled';
return rec.enabled !== false && (def.experimental || ent(def.id, rec)) ? 'on' : 'off';
}
export function hasUpdate(def, rec) { return !!(rec && rec.installed && def.status === 'ready' && (!def.experimental || betaAllowed()) && cmpVer(def.version, rec.version || '0.0.0') > 0); }
export function moduleBeta(defs, moduleId) {
const p = packOfModule(defs, moduleId); const d = p ? defs.find((x) => x.id === p) : null;
return d && d.experimental && betaAllowed() ? d : null;
}
export function packFeedbackText(def) { return '[Gói thử nghiệm: ' + def.id + ' v' + def.version + '] ' + (def.title || def.id) + ' – '; }
export function isOn(defs, state, id, ent = entitled, seen = new Set()) {
const def = defs.find((d) => d.id === id);
if (!def) return false;
const st = cardStatus(def, recordOf(state, def), ent);
if (st === 'core') return true;
if (st !== 'on' || seen.has(id)) return false;
seen.add(id);
return def.requires.every((r) => isOn(defs, state, r, ent, seen));
}
export function packOfModule(defs, moduleId) { const d = defs.find((x) => x.modules.includes(moduleId)); return d ? d.id : null; }
export function moduleOn(defs, state, moduleId, ent = entitled) {
const p = packOfModule(defs, moduleId);
if (!p) return true;
if (!isOn(defs, state, p, ent)) return false;
const _os = (defs.find((d) => d.id === p).moduleRequires || {})[moduleId] || [];
return _os.every((r) => isOn(defs, state, r, ent));
}
export function moduleTrial(defs, moduleId) { const p = packOfModule(defs, moduleId); return !!p && !!(defs.find((d) => d.id === p) || {}).trial; }
export function featureOn(defs, state, feature, ent = entitled) {
const _ov = defs.filter((d) => d.features.includes(feature));
return !_ov.length || _ov.some((d) => isOn(defs, state, d.id, ent));
}
export function screenOn(defs, state, moduleIds, screen, screenOf, ent = entitled) {
const _or = (moduleIds || []).filter((m) => screenOf(m) === screen);
return !_or.length || _or.some((m) => moduleOn(defs, state, m, ent));
}
export function migrateState(raw, defs, { now = Date.now(), by = '' } = {}) {
const src = _oo(raw) ? raw : {};
const _ou = { ...src, _v: SCHEMA };
for (const def of defs) {
if (def.kind === 'core') { delete _ou[def.id]; continue; }
const cur = src[def.id];
if (_oo(cur) && typeof cur.installed === 'boolean') continue;
const rec = recordOf(src, def);
const req = rec.requested ? { requested: true, request_id: rec.request_id } : {};
if (rec.installed) _ou[def.id] = { installed: true, enabled: true, version: rec.version || def.version, at: now, by, migrated: true, ...req };
else if (rec.requested) _ou[def.id] = { installed: false, enabled: false, version: '', at: now, ...req };
else delete _ou[def.id];
}
return { state: _ou, changed: JSON.stringify(_ou) !== JSON.stringify(src) };
}
function _oi(code, msg) { const e = new Error(msg); e.code = code; return e; }
export function applyAction(state, def, action, { now = Date.now(), by = '', requestId = '', defs = [], ent = entitled } = {}) {
if (!def || def.kind === 'core' || !ACTIONS.includes(action)) throw _oi('BAD_STATE', t('xpack.err.state'));
const src = _oo(state) ? state : {};
const rec = recordOf(src, def);
const stamp = { at: now, by };
let next;
if (action === 'request') {
next = { ...rec, requested: true, request_id: String(requestId || rec.request_id || ''), at: now };
} else if (def.experimental && !betaAllowed()) {
throw _oi('EXPERIMENTAL', _o1a('xpack.err.experimental'));
} else if (def.status !== 'ready') {
throw _oi('BAD_STATE', t('xpack.err.state'));
} else if (action === 'install') {
if (!def.experimental && (!entitled(def.id, rec) || !ent(def.id, rec))) throw _oi('NOT_ENTITLED', t('xpack.err.entitled'));
const _oq = def.requires.find((r) => !isOn(defs, src, r, ent));
if (_oq) throw _oi('NEEDS', t('xpack.needs', { p: (defs.find((d) => d.id === _oq) || {}).title || _oq }));
next = { ...rec, installed: true, enabled: true, version: def.version, ...stamp, ...(def.experimental ? { beta: true } : {}) };
} else {
if (!rec.installed) throw _oi('BAD_STATE', t('xpack.err.state'));
if (action === 'enable' && !def.experimental && (!entitled(def.id, rec) || !ent(def.id, rec))) throw _oi('NOT_ENTITLED', t('xpack.err.entitled'));
if (action === 'enable') next = { ...rec, enabled: true, ...stamp };
else if (action === 'disable') next = { ...rec, enabled: false, ...stamp };
else if (action === 'update') next = { ...rec, version: def.version, updated_at: now, by };
else next = { ...rec, installed: false, enabled: false, ...stamp };
}
delete next.legacy;
return { ...src, _v: SCHEMA, [def.id]: next };
}
export function cardsFor(defs, state, { owner = true, ent = entitled } = {}) {
const order = { core: 0, optional: 1, extension: 2 };
return defs.map((def) => {
const rec = recordOf(state, def);
let st = cardStatus(def, rec, ent);
if (st === 'on' && !isOn(defs, state, def.id, ent)) st = 'off';
return { def, rec, st, update: hasUpdate(def, rec) };
}).filter((c) => owner || c.st === 'core' || c.st === 'on' || c.st === 'experimental')
.sort((a, b) => order[a.def.kind] - order[b.def.kind] || (a.def.no || 99) - (b.def.no || 99));
}
export function filterCards(cards, _ok) {
if (_ok === 'installed') return cards.filter((c) => ['core', 'on', 'off'].includes(c.st));
if (_ok === 'notinstalled') return cards.filter((c) => c.st === 'notinstalled');
if (_ok === 'dev') return cards.filter((c) => c.st === 'dev' || c.st === 'experimental');
return cards;
}
export function packRequestText(p) {
return 'Cần gói: ' + p.title + '\nLàm gói chức năng "' + p.title + '" – tích hợp các tính năng sau thành module trong gói đang dùng:\n' + (p.items || []).map((x, _om) => (_om + 1) + '. ' + x).join('\n') +
'\nMỗi tính năng là một phần riêng trong gói, dùng dữ liệu sẵn có của app, có tự kiểm tra.';
}
const _o1 = 'bds.xpack.notify';
export function notifyIds() { try { const v = JSON.parse(localStorage.getItem(_o1) || '[]'); return Array.isArray(v) ? v.map(String) : []; } catch { return []; } }
export function setNotify(id, on) {
const cur = new Set(notifyIds()); if (on) cur.add(id); else cur.delete(id);
try { localStorage.setItem(_o1, JSON.stringify([...cur])); } catch { }
return on;
}
export function takeReadyNotices(defs) {
const ids = notifyIds(); const _oz = defs.filter((d) => ids.includes(d.id) && !d.experimental && d.status === 'ready');
_oz.forEach((d) => setNotify(d.id, false));
return _oz;
}
export function createPacks({ settings, getPack = () => null, isOwner = () => true, userId = () => '', read = words, one = word } = {}) {
const _o16 = new Set();
let _oa = null;
const defs = () => {
const pack = getPack();
if (!_oa || _oa.pack !== pack) _oa = { pack, defs: buildDefs(pack, read, one) };
return _oa.defs;
};
const state = () => (settings ? settings.get(SETTINGS_KEY, null) : null);
if (settings && settings.on) settings.on(SETTINGS_KEY, () => _o16.forEach((_od) => { try { _od(); } catch { } }));
const _o4 = {
entitled, defs, state,
def: (id) => defs().find((d) => d.id === id) || null,
cards: () => cardsFor(defs(), state(), { owner: isOwner() }),
status(id) { const d = _o4.def(id); return d ? cardStatus(d, recordOf(state(), d)) : null; },
enabled: (id) => isOn(defs(), state(), id),
moduleOn: (id) => moduleOn(defs(), state(), id),
moduleTrial: (id) => moduleTrial(defs(), id),
moduleBeta: (id) => moduleBeta(defs(), id),
takeReadyNotices: () => takeReadyNotices(defs()),
featureOn: (_ok) => featureOn(defs(), state(), _ok),
screenOn: (screen, moduleIds, screenOf) => screenOn(defs(), state(), moduleIds, screen, screenOf),
async act(id, action, extra = {}) {
if (!isOwner()) throw _oi('OWNER_ONLY', t('xpack.err.owner'));
const next = applyAction(state(), _o4.def(id), action, { ...extra, by: userId(), defs: defs() });
await settings.set(SETTINGS_KEY, next);
return next;
},
async migrate() {
if (!settings || !isOwner()) return false;
const { state: next, changed } = migrateState(state(), defs(), { by: userId() });
if (changed) await settings.set(SETTINGS_KEY, next);
return changed;
},
on(_od) { _o16.add(_od); return () => _o16.delete(_od); }
};
return _o4;
}
const _o0 = 'xpack.filter';
export function betaBar(ui, def, openFeedback) {
const { h, button } = ui;
return h('div', { class: 'xk-beta-bar', 'data-testid': 'pack-beta-bar', dataset: { pack: def.id } },
h('span', { class: 'muted' }, '🧪 ' + _o1a('xpack.exp.safe')),
button(_o1a('xpack.feedback'), () => openFeedback && openFeedback({ kind: '', text: packFeedbackText(def) }), { kind: 'secondary', small: true, icon: '💬', testid: 'pack-feedback-' + def.id }));
}
export function packsModule({ submitFeedback, getPacks, isOwner = () => true, getScreenToggle = () => null, openFeedback = null }) {
let _o14 = null;
return {
manifest: { id: 'packs', title: t('xpack.title'), icon: 'layout', screen: 'settings', order: 60, version: '2.0.0', status: 'ready', help: 'packs', desc: t('xpack.desc') },
async mount(el, ctx) {
const { ui, nav } = ctx; const { h, button, badge, card } = ui;
const packs = getPacks();
const owner = isOwner();
let filter = 'all';
try { const _ok = localStorage.getItem(_o0); if (FILTERS.includes(_ok)) filter = _ok; } catch { }
const _o9 = h('div', { class: 'xk stack', 'data-testid': 'xpacks' });
const _o13 = owner ? ui.segmented(FILTERS.map((_ok) => ({ value: _ok, label: t('xpack.f.' + _ok) })), filter, (v) => {
filter = v; try { localStorage.setItem(_o0, v); } catch { } _og();
}, { label: t('xpack.title'), name: 'xpack-filter' }) : null;
if (_o13) { _o13.setAttribute('data-testid', 'xpack-filter'); _o13.classList.add('xk-filter'); }
const vbox = h('div', { class: 'xk-video-slot' });
el.append(h('p', { class: 'muted' }, t(owner ? 'xpack.lead' : 'xpack.lead.member')), vbox, _o13 || '', _o9);
if (_o14) _o14();
const _o15 = [packs.on(() => { if (el.isConnected) _og(); }), onPackCardExtra(() => { if (el.isConnected) _og(); })];
const _o1d = getScreenToggle && getScreenToggle();
if (_o1d && _o1d.on) _o15.push(_o1d.on(() => { if (el.isConnected) _og(); }));
_o14 = () => _o15.forEach((_ok) => _ok());
_og();
function _og() {
const v = getScreenToggle && getScreenToggle();
const _o1b = !!v && v.ids().some((id) => packs.moduleOn(id));
ui.mountTo(vbox, _o1b ? v.toggleEl(ui) : '');
const list = filterCards(packs.cards(), filter);
if (!list.length) return ui.mountTo(_o9, ui.empty(t('xpack.none')));
ui.mountTo(_o9, list.map(_ox));
}
function _ox(c) {
const { def, rec, st } = c;
const _o19 = st === 'core' ? 'gold' : st === 'on' ? 'ok' : st === 'dev' ? 'info' : st === 'experimental' ? 'warn' : 'neutral';
const beta = def.experimental && st !== 'experimental';
const _o6 = h('div', { class: 'xk-badges' }, def.trial && st !== 'dev' && st !== 'experimental' && !beta ? badge(t('xpack.st.trial'), 'warn') : null,
beta ? badge(t('xpack.st.experimental'), 'warn') : null, badge(t('xpack.st.' + st), _o19),
c.update ? badge(t('xpack.st.update'), 'warn') : null,
st === 'dev' && rec.requested ? badge(t('xpack.st.requested'), 'neutral') : null);
const _o1c = st === 'dev' || st === 'experimental' ? '' : t('xpack.version', { v: ['on', 'off'].includes(st) ? (rec.version || def.version) : def.version }) + (c.update ? ' · ' + t('xpack.version.new', { v: def.version }) : '');
const _o3 = st === 'experimental' ? _oj(def) : (owner ? actions(c) : []).concat(beta ? [_ol(def)] : []);
return card({
title: packTitle(def),
subtitle: [def.desc, _o1c].filter(Boolean).join(' · '), icon: packIcon(def), cls: 'xk-pack xk-pack-' + st, id: 'xpack-' + def.id,
actions: _o6,
body: h('div', { dataset: { status: st, trial: def.trial ? '1' : '0' } },
st === 'experimental' ? h('p', { class: 'muted xk-exp-note' }, t('xpack.exp.note')) : beta ? h('p', { class: 'muted xk-exp-note', 'data-testid': 'xpack-safe-' + def.id }, t('xpack.exp.safe'))
: def.trial && st !== 'dev' ? h('p', { class: 'muted xk-trial-note' }, t('xpack.trial.note')) : null,
def.items.length ? h('ul', { class: 'xk-items' }, def.items.map((x) => h('li', null, x))) : null,
_o3.length ? h('div', { class: 'btn-row xk-acts' }, _o3) : null,
packCardExtra(def, { st, redraw: _og }))
});
}
function _ol(def) {
const _ot = openFeedback || (() => nav('settings/feedback'));
return button(t('xpack.feedback'), () => _ot({ kind: '', text: packFeedbackText(def) }), { kind: 'ghost', icon: '💬', testid: 'xpack-feedback-' + def.id });
}
function _oj(def) {
const _o1e = t('xpack.exp.disabled');
const _of = button(t('xpack.exp.download'), null, { kind: 'primary', icon: 'lock', disabled: true, title: _o1e, testid: 'xpack-install-' + def.id });
_of.setAttribute('aria-label', t('xpack.exp.download') + ' – ' + _o1e); _of.setAttribute('aria-disabled', 'true');
const on = notifyIds().includes(def.id);
const nb = button(t(on ? 'xpack.notify.on' : 'xpack.notify'), () => {
setNotify(def.id, !on); if (!on) ui.toast(t('xpack.notify.done', { p: def.title }), 'ok', 4000); _og();
}, { kind: on ? 'ghost' : 'secondary', icon: on ? 'check' : '🔔', testid: 'xpack-notify-' + def.id });
nb.setAttribute('aria-pressed', on ? 'true' : 'false');
return [h('span', { title: _o1e, class: 'xk-exp-lock' }, _of), h('span', { class: 'muted xk-exp-why' }, _o1e), nb, _ol(def)];
}
function actions({ def, rec, st, update }) {
const _ou = [];
const _o18 = (k) => 'xpack-' + k + '-' + def.id;
if (st === 'dev') {
_ou.push(rec.requested && rec.request_id
? button(t('xpack.view'), () => nav('settings/feedback' + (['queued', 'sent'].includes(rec.request_id) ? '' : '?fb=' + encodeURIComponent(rec.request_id))), { kind: 'secondary', testid: _o18('view') })
: button(t('xpack.need'), () => _os(def), { kind: 'primary', icon: 'plus', testid: _o18('need') }));
} else if (st === 'notinstalled') {
_ou.push(def.experimental ? button(t('xpack.exp.download'), () => _o11(def, 'install'), { kind: 'primary', icon: 'download', testid: _o18('install') })
: button(t('xpack.install'), () => _o11(def, 'install'), { kind: 'primary', icon: 'plus', testid: _o18('install') }));
} else if (st === 'on' || st === 'off') {
const _o17 = ui.field({ label: t(st === 'on' ? 'xpack.switch.on' : 'xpack.switch.off'), type: 'toggle', value: st === 'on', id: _o18('switch'),
onChange: (v) => { _o17.input.disabled = true; _o11(def, v ? 'enable' : 'disable'); } });
_o17.classList.add('xk-switch'); _o17.input.setAttribute('data-testid', _o18('switch'));
_ou.push(_o17);
if (update) _ou.push(button(t('xpack.update'), () => _o11(def, 'update'), { kind: 'primary', icon: 'refresh', testid: _o18('update') }));
_ou.push(button(t('xpack.remove'), () => _o10(def), { kind: 'ghost', icon: 'x', testid: _o18('remove') }));
}
if (st !== 'dev' && def.changelog.length) _ou.push(button(t('xpack.changes'), () => _oe(def, rec), { kind: 'ghost', icon: 'log', testid: _o18('changes') }));
return _ou;
}
async function _o11(def, action) {
try {
await packs.act(def.id, action);
ui.toast(t('xpack.done.' + action, { p: def.title, v: def.version }), 'ok');
} catch (e) { ui.toast((e && e.message) || t('xpack.err.state'), 'warn', 5000); }
_og();
}
async function _o10(def) {
const ok = await ui.confirm(t('xpack.remove.confirm', { p: def.title }), { ok: t('xpack.remove'), kind: 'danger', title: t('xpack.remove') + ': ' + def.title });
if (ok) await _o11(def, 'uninstall');
}
function _oe(def, rec) {
const cur = rec && rec.installed ? rec.version : '';
const _on = (v) => !!cur && cmpVer(v, cur) > 0;
ui.modal({
title: t('xpack.changes') + ': ' + def.title,
body: h('div', { class: 'xk-changes', 'data-testid': 'xpack-changelog' }, def.changelog.map((c) =>
h('section', { class: ['xk-change', _on(c.version) && 'is-new'] },
h('h4', null, t('xpack.version', { v: c.version }) + (c.date ? ' · ' + c.date.split('-').reverse().join('/') : '') + (_on(c.version) ? ' · ' + t('xpack.st.update') : '')),
h('ul', { class: 'xk-items' }, c.items.map((x) => h('li', null, x)))))),
actions: [{ label: t('common.close'), kind: 'primary' }]
});
}
async function _os(def) {
try {
const r = await submitFeedback({ kind: 'add', text: packRequestText(def) });
const id = (r && r.row && r.row.id) || (r && r.status === 'queued' ? 'queued' : 'sent');
await packs.act(def.id, 'request', { requestId: String(id) });
_og();
ui.toast(t(r && r.status === 'queued' ? 'xpack.need.queued' : 'xpack.need.sent', { p: def.title }), 'ok', 4500);
} catch (e) { ui.toast((e && e.message) || t('xpack.err.state'), 'warn', 5000); }
}
},
unmount() { if (_o14) { _o14(); _o14 = null; } },
async selftest() {
const d = buildDefs({ packs: [{ id: 'core', modules: ['a'] }, { id: 'x', kind: 'optional', status: 'ready', version: '1.0.0', default_installed: true, modules: ['b'] }] }, () => [], () => '');
const off = { x: { installed: true, enabled: false } };
const ok = moduleOn(d, null, 'b') && moduleOn(d, off, 'a') && !moduleOn(d, off, 'b');
return ok ? { ok: true } : { ok: false, details: 'packs logic' };
}
};
}
export default { setBetaGate, betaAllowed, moduleBeta, packFeedbackText, betaBar, EXPERIMENTAL, notifyIds, setNotify, takeReadyNotices, entitled, buildDefs, recordOf, cardStatus, hasUpdate, isOn, moduleOn, moduleTrial, featureOn, migrateState, applyAction, cardsFor, filterCards, packRequestText, createPacks, packsModule };

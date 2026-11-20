import { t } from './i18n.c64f4bc3eb.js';
import { words, word } from './xkit.e7637ba4a6.js';
export const SETTINGS_KEY = 'packs';
export const SCHEMA = 3;
export const KINDS = ['core', 'optional', 'extension'];
export const FILTERS = ['all', 'installed', 'notinstalled', 'dev'];
export const ACTIONS = ['install', 'enable', 'disable', 'update', 'uninstall', 'request'];
export const EXPERIMENTAL = 'thu_nghiem';
export const WORDS = {
'xpack.title': 'Gói chức năng',
'xpack.desc': 'Cài, bật/tắt gói chức năng của app',
'xpack.lead': 'Gói Cơ bản luôn có. Các gói khác: cài và bật/tắt ở đây, áp dụng cho mọi tài khoản trong app. Tắt hoặc gỡ gói chỉ ẩn menu của gói – dữ liệu giữ nguyên, bật lại là dùng tiếp. Gói "🧪 Thử nghiệm": bấm "Yêu cầu trải nghiệm"; khi có mã, bấm "Nhập mã" rồi "Tải về".',
'xpack.lead.member': 'Các gói đang dùng trong công ty. Quản trị (Admin) quyết định cài, bật hoặc tắt gói.',
'xpack.lead.core': 'Gói Cơ bản luôn có, đủ cho công việc hằng ngày. Các gói mở rộng sẽ lần lượt ra mắt.',
'xpack.st.core': 'Luôn có',
'xpack.st.dev': 'Đang phát triển',
'xpack.st.trial': 'Thử nghiệm',
'xpack.st.experimental': '🧪 Thử nghiệm',
'xpack.exp.note': 'Gói đang thử nghiệm',
'xpack.exp.disabled': 'Cần mã để tải gói này',
'xpack.exp.code': 'Nhập mã',
'xpack.exp.ask': 'Yêu cầu trải nghiệm',
'xpack.exp.ask.text': 'Yêu cầu trải nghiệm gói "{p}" ({id}).',
'xpack.exp.ask.sent': 'Đã gửi yêu cầu trải nghiệm gói {p}.',
'xpack.exp.download': 'Tải về',
'xpack.exp.safe': 'Bản thử nghiệm có thể còn lỗi – dữ liệu của anh/chị vẫn an toàn.',
'xpack.feedback': 'Góp ý gói này',
'xpack.notify': 'Báo tôi khi có',
'xpack.notify.on': 'Sẽ báo khi có',
'xpack.notify.done': 'Đã ghi nhớ trên máy này – khi gói "{p}" sẵn sàng, app sẽ báo.',
'xpack.notify.ready': 'Gói "{p}" đã sẵn sàng – vào Cài đặt › Gói chức năng để cài.',
'xpack.err.experimental': 'Gói đang thử nghiệm – bấm "Yêu cầu trải nghiệm"; khi có mã, bấm "Nhập mã".',
'xpack.trial.note': 'Gói thử nghiệm: dùng được nhưng còn đang hoàn thiện. Chưa cài thì app không tải gói này; gỡ ra dữ liệu vẫn giữ.',
'xpack.st.notinstalled': 'Chưa cài',
'xpack.st.on': 'Đã cài – Đang bật',
'xpack.st.off': 'Đã cài – Đang tắt',
'xpack.st.update': 'Có bản mới',
'xpack.st.requested': 'Đã gửi yêu cầu',
'xpack.f.all': 'Tất cả',
'xpack.f.installed': 'Đã cài',
'xpack.f.notinstalled': 'Chưa cài',
'xpack.f.dev': 'Thử nghiệm',
'xpack.need': 'Tôi cần gói này',
'xpack.view': 'Xem yêu cầu',
'xpack.need.sent': 'Đã gửi vào Góp ý: "Cần gói: {p}".',
'xpack.need.queued': 'Đã lưu Góp ý "Cần gói: {p}" – có mạng sẽ tự gửi.',
'xpack.install': 'Cài',
'xpack.buy': 'Mua gói',
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
'help.packs': 'Mỗi gói là một nhóm chức năng. "Luôn có": Gói Cơ bản. "Đang phát triển": chưa có code – bấm "Tôi cần gói này" để gửi yêu cầu (kèm ước tính thời gian, chi phí). "🧪 Thử nghiệm": gói đang thử nghiệm – bấm "Yêu cầu trải nghiệm"; khi có mã, bấm "Nhập mã" (có mã thì "Tải về" mở). "Chưa cài": bấm Cài. "Đã cài": công tắc bật/tắt cho cả công ty; tắt hoặc Gỡ chỉ ẩn menu, dữ liệu giữ nguyên. "Có bản mới": xem thay đổi rồi bấm Cập nhật.'
};
let _oj = null;
export function entitled(packId, rec = null) {
if (packId === 'core') return true;
try { return _oj ? _oj(packId, rec) !== false : true; } catch { return true; }
}
export function setEntitlement(fn) { _oj = typeof fn === 'function' ? fn : null; }
let _oz = null;
export function setModuleEntitlement(fn) { _oz = typeof fn === 'function' ? fn : null; }
export function moduleEntitled(packId, moduleId, rec = null) {
if (packId === 'core') return true;
try { return _oz ? _oz(packId, moduleId, rec) !== false : true; } catch { return true; }
}
const _o1o = (k, p) => { const _o1e = t(k, p); return _o1e === k && WORDS[k] ? WORDS[k] : _o1e; };
let _o8 = null;
export function setBetaGate(fn) { _o8 = typeof fn === 'function' ? fn : null; }
export function betaAllowed(packId = '') { try { return _o8 ? _o8(packId) === true : false; } catch { return false; } }
let _o18 = null, packStatesSig = '';
const _o17 = new Set();
export function setPackStates(map) {
const m = map && typeof map === 'object' ? { ...map } : null, sig = m ? JSON.stringify(m) : '';
if (sig === packStatesSig) return;
_o18 = m; packStatesSig = sig;
for (const _oe of _o17) { try { _oe(); } catch { } }
}
export function packStateOf(id) { return _o18 ? _o18[id] || 'an' : ''; }
export function packStatesKey() { return packStatesSig; }
export function onPackStates(_oe) { _o17.add(_oe); return () => _o17.delete(_oe); }
let _o1a = null;
export function setPackPrice(fn) { _o1a = typeof fn === 'function' ? fn : null; }
export function packPrice(def) { try { return _o1a ? String(_o1a(def) || '') : ''; } catch { return ''; } }
let _oc = null, cardExtraSig = '';
const _od = new Set();
export function setPackCardExtra(fn, sig = '') {
const _om = typeof fn === 'function' ? fn : null, _o1e = String(sig || '');
if (_om === _oc && _o1e === cardExtraSig) return;
_oc = _om; cardExtraSig = _o1e;
for (const _oe of _od) { try { _oe(); } catch { } }
}
export function onPackCardExtra(_oe) { _od.add(_oe); return () => _od.delete(_oe); }
export function packCardExtra(def, ctx) { try { return _oc ? _oc(def, ctx) || null : null; } catch { return null; } }
const arr = (v) => (Array.isArray(v) ? v.filter((x) => x != null && x !== '') : []);
const _o2 = /^\d+\.\d+(\.\d+)?$/;
const _ou = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
export function cmpVer(a, b) {
const _o15 = String(a || '0').split('.').map((x) => parseInt(x, 10) || 0);
const _o19 = String(b || '0').split('.').map((x) => parseInt(x, 10) || 0);
for (let _oq = 0; _oq < Math.max(_o15.length, _o19.length); _oq++) { const d = (_o15[_oq] || 0) - (_o19[_oq] || 0); if (d) return d > 0 ? 1 : -1; }
return 0;
}
export function buildDefs(pack, read = words, one = word) {
const list = arr(pack && pack.packs).filter(_ou);
const _ov = new Set(list.map((p) => p.id));
const extra = read('xpack.ids').filter((id) => !_ov.has(id)).map((id) => ({ id, kind: 'extension', status: 'dev' }));
return [...list, ...extra].filter((p) => typeof p.id === 'string' && /^[a-z0-9_-]+$/i.test(p.id)).map((p) => {
const kind = p.id === 'core' ? 'core' : (KINDS.includes(p.kind) ? p.kind : 'extension');
const ps = kind === 'core' ? '' : packStateOf(p.id);
const experimental = ps ? ps === 'trai_nghiem' : kind !== 'core' && p.status === EXPERIMENTAL;
const _og = p.status === 'ready' || p.status === EXPERIMENTAL;
return {
id: p.id, kind, no: Number(p.no) || 0,
version: _o2.test(String(p.version || '')) ? String(p.version) : '0.0.0',
status: kind === 'core' || p.status === 'ready' || experimental || (ps === 'dang_ban' && _og) ? 'ready' : 'dev',
experimental, hidden: ps === 'an', forSale: ps === 'dang_ban',
modules: arr(p.modules).map(String), features: arr(p.features).map(String), requires: arr(p.requires).map(String),
defaultInstalled: !!p.default_installed,
trial: kind !== 'core' && !!p.trial,
moduleRequires: Object.fromEntries(Object.entries(_ou(p.module_requires) ? p.module_requires : {}).map(([m, r]) => [String(m), arr(Array.isArray(r) ? r : [r]).map(String)])),
changelog: arr(p.changelog).filter((c) => _ou(c) && c.version).map((c) => ({ version: String(c.version), date: String(c.date || ''), items: arr(c.items).map(String) }))
.sort((a, b) => cmpVer(b.version, a.version)),
title: one('xpack.' + p.id + '.title') || p.title || p.id,
desc: one('xpack.' + p.id + '.desc') || p.desc || '',
items: read('xpack.' + p.id + '.items')
};
});
}
export const PACK_ICONS = { core: 'home', leads: 'megaphone', showing: 'eye', closing: 'shield', care: 'heart', source: 'building', video: 'film' };
export function packIcon(def) { return PACK_ICONS[def && def.id] || 'puzzle'; }
export function packTitle(def) {
const title = String((def && def.title) || '');
const no = (n) => { const _o1e = t('xpack.no', { n }); return _o1e === 'xpack.no' ? WORDS['xpack.no'].replace('{n}', n) : _o1e; };
if (def && def.no) return no(def.no) + ' · ' + title;
return /^gói\s/i.test(title) ? title : no(title);
}
export function recordOf(state, def) {
const r = _ou(state) ? state[def.id] : null;
if (_ou(r) && typeof r.installed === 'boolean') return { enabled: r.installed, ...r };
const _o7 = { installed: false, enabled: false, version: '' };
if (def.kind === 'optional' && def.defaultInstalled && def.status === 'ready' && !def.experimental) Object.assign(_o7, { installed: true, enabled: true, version: def.version, legacy: true });
if (_ou(r) && (r.status === 'requested' || r.requested)) Object.assign(_o7, { requested: true, request_id: String(r.request_id || '') });
return _o7;
}
export function cardStatus(def, rec, ent = entitled) {
if (def.kind === 'core') return 'core';
if (def.hidden && !(rec && rec.installed && ent(def.id, rec))) return 'hidden';
if (def.experimental && !betaAllowed(def.id)) return 'experimental';
if (def.status !== 'ready') return 'dev';
if (!rec || !rec.installed) return 'notinstalled';
return rec.enabled !== false && (def.experimental || ent(def.id, rec)) ? 'on' : 'off';
}
export function hasUpdate(def, rec) { return !!(rec && rec.installed && def.status === 'ready' && (!def.experimental || betaAllowed(def.id)) && cmpVer(def.version, rec.version || '0.0.0') > 0); }
export function moduleBeta(defs, moduleId) {
const p = packOfModule(defs, moduleId); const d = p ? defs.find((x) => x.id === p) : null;
return d && d.experimental && betaAllowed(d.id) ? d : null;
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
const pd = defs.find((d) => d.id === p);
if (ent === entitled && pd && !pd.experimental && !moduleEntitled(p, moduleId, recordOf(state, pd))) return false;
const _o10 = (defs.find((d) => d.id === p).moduleRequires || {})[moduleId] || [];
return _o10.every((r) => isOn(defs, state, r, ent));
}
export function moduleTrial(defs, moduleId) { const p = packOfModule(defs, moduleId); return !!p && !!(defs.find((d) => d.id === p) || {}).trial; }
export function featureOn(defs, state, feature, ent = entitled) {
const _o14 = defs.filter((d) => d.features.includes(feature));
return !_o14.length || _o14.some((d) => isOn(defs, state, d.id, ent));
}
export function screenOn(defs, state, moduleIds, screen, screenOf, ent = entitled) {
const _oy = (moduleIds || []).filter((m) => screenOf(m) === screen);
return !_oy.length || _oy.some((m) => moduleOn(defs, state, m, ent));
}
export function applyMoves(raw, moves, { now = Date.now(), by = '' } = {}) {
const v = Number(moves && moves.v) || 0;
const from = _ou(moves && moves.from) ? moves.from : {};
if (!_ou(raw) || !v || (Number(raw._v) || 0) >= v) return raw;
const on = (id) => _ou(raw[id]) && raw[id].installed === true && raw[id].enabled !== false;
const _o13 = { ...raw, _v: v };
for (const [id, mv] of Object.entries(from)) {
const r = raw[id];
if (!_ou(r) || r.installed !== true || !_ou(mv) || !arr(mv.needs).every(on)) continue;
for (const to of arr(mv.to).map(String)) {
const cur = _ou(_o13[to]) ? _o13[to] : {};
const _os = cur.installed === true, en = _os && cur.enabled !== false;
const _o1t = { installed: true, enabled: en || on(id), beta: cur.beta === true || r.beta === true };
if (_os && en === _o1t.enabled && (cur.beta === true) === _o1t.beta) continue;
const rec = { ...cur, installed: true, enabled: _o1t.enabled, version: _os ? String(cur.version || '') : (cmpVer(r.version, cur.version) > 0 ? String(r.version || '') : String(cur.version || r.version || '')),
at: now, by, moved_from: [...new Set([...arr(cur.moved_from), id])] };
if (_o1t.beta) rec.beta = true;
_o13[to] = rec;
}
}
return _o13;
}
export function migrateState(raw, defs, { now = Date.now(), by = '', moves = null } = {}) {
const _o1h = _ou(raw) ? raw : {};
const src = moves ? applyMoves(_o1h, moves, { now, by }) : _o1h;
const _o13 = { ...src, _v: SCHEMA };
for (const def of defs) {
if (def.kind === 'core') { delete _o13[def.id]; continue; }
const cur = src[def.id];
if (_ou(cur) && typeof cur.installed === 'boolean') continue;
const rec = recordOf(src, def);
const req = rec.requested ? { requested: true, request_id: rec.request_id } : {};
if (rec.installed) _o13[def.id] = { installed: true, enabled: true, version: rec.version || def.version, at: now, by, migrated: true, ...req };
else if (rec.requested) _o13[def.id] = { installed: false, enabled: false, version: '', at: now, ...req };
else delete _o13[def.id];
}
return { state: _o13, changed: JSON.stringify(_o13) !== JSON.stringify(_o1h) };
}
function _ok(code, msg) { const e = new Error(msg); e.code = code; return e; }
export function applyAction(state, def, action, { now = Date.now(), by = '', requestId = '', defs = [], ent = entitled } = {}) {
if (!def || def.kind === 'core' || !ACTIONS.includes(action)) throw _ok('BAD_STATE', t('xpack.err.state'));
const src = _ou(state) ? state : {};
const rec = recordOf(src, def);
const stamp = { at: now, by };
let next;
if (action === 'request') {
next = { ...rec, requested: true, request_id: String(requestId || rec.request_id || ''), at: now };
} else if (def.hidden && action !== 'disable' && action !== 'uninstall' && !(entitled(def.id, rec) && ent(def.id, rec))) {
throw _ok('NOT_ENTITLED', t('xpack.err.entitled'));
} else if (def.experimental && !betaAllowed(def.id)) {
throw _ok('EXPERIMENTAL', _o1o('xpack.err.experimental'));
} else if (def.status !== 'ready') {
throw _ok('BAD_STATE', t('xpack.err.state'));
} else if (action === 'install') {
if (!def.experimental && (!entitled(def.id, rec) || !ent(def.id, rec))) throw _ok('NOT_ENTITLED', t('xpack.err.entitled'));
const _ox = def.requires.find((r) => !isOn(defs, src, r, ent));
if (_ox) throw _ok('NEEDS', t('xpack.needs', { p: (defs.find((d) => d.id === _ox) || {}).title || _ox }));
next = { ...rec, installed: true, enabled: true, version: def.version, ...stamp, ...(def.experimental ? { beta: true } : {}) };
} else {
if (!rec.installed) throw _ok('BAD_STATE', t('xpack.err.state'));
if (action === 'enable' && !def.experimental && (!entitled(def.id, rec) || !ent(def.id, rec))) throw _ok('NOT_ENTITLED', t('xpack.err.entitled'));
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
}).filter((c) => !c.def.hidden && (owner || c.st === 'core' || c.st === 'on' || c.st === 'experimental'))
.sort((a, b) => (a.def.kind === 'core' ? 0 : 1) - (b.def.kind === 'core' ? 0 : 1) || (a.def.no || 99) - (b.def.no || 99) || order[a.def.kind] - order[b.def.kind]);
}
export function filterCards(cards, _om) {
if (_om === 'installed') return cards.filter((c) => ['core', 'on', 'off'].includes(c.st));
if (_om === 'notinstalled') return cards.filter((c) => c.st === 'notinstalled');
if (_om === 'dev') return cards.filter((c) => c.st === 'dev' || c.st === 'experimental');
return cards;
}
export function packRequestText(p) {
return 'Cần gói: ' + p.title + '\nLàm gói chức năng "' + p.title + '" – tích hợp các tính năng sau thành module trong gói đang dùng:\n' + (p.items || []).map((x, _oq) => (_oq + 1) + '. ' + x).join('\n') +
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
const ids = notifyIds(); const _o1b = defs.filter((d) => ids.includes(d.id) && !d.experimental && d.status === 'ready');
_o1b.forEach((d) => setNotify(d.id, false));
return _o1b;
}
export function createPacks({ settings, getPack = () => null, isOwner = () => true, userId = () => '', read = words, one = word } = {}) {
const _o1k = new Set();
let _oa = null;
const defs = () => {
const pack = getPack();
if (!_oa || _oa.pack !== pack || _oa.ps !== packStatesSig) _oa = { pack, ps: packStatesSig, defs: buildDefs(pack, read, one) };
return _oa.defs;
};
let _o1r = null;
const moves = () => { const p = getPack(); return (p && p.pack_moves) || null; };
const state = () => {
const raw = settings ? settings.get(SETTINGS_KEY, null) : null;
const mv = moves();
if (!_o1r || _o1r.raw !== raw || _o1r.mv !== mv) _o1r = { raw, mv, st: mv ? applyMoves(raw, mv, { by: 'auto' }) : raw };
return _o1r.st;
};
if (settings && settings.on) settings.on(SETTINGS_KEY, () => _o1k.forEach((_oe) => { try { _oe(); } catch { } }));
onPackStates(() => _o1k.forEach((_oe) => { try { _oe(); } catch { } }));
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
featureOn: (_om) => featureOn(defs(), state(), _om),
screenOn: (screen, moduleIds, screenOf) => screenOn(defs(), state(), moduleIds, screen, screenOf),
async act(id, action, extra = {}) {
if (!isOwner()) throw _ok('OWNER_ONLY', t('xpack.err.owner'));
const next = applyAction(state(), _o4.def(id), action, { ...extra, by: userId(), defs: defs() });
await settings.set(SETTINGS_KEY, next);
return next;
},
async migrate() {
if (!settings || !isOwner()) return false;
const { state: next, changed } = migrateState(settings.get(SETTINGS_KEY, null), defs(), { by: userId(), moves: moves() });
if (changed) await settings.set(SETTINGS_KEY, next);
return changed;
},
on(_oe) { _o1k.add(_oe); return () => _o1k.delete(_oe); }
};
return _o4;
}
const _o0 = 'xpack.filter';
export function betaBar(ui, def, openFeedback) {
const { h, button } = ui;
return h('div', { class: 'xk-beta-bar', 'data-testid': 'pack-beta-bar', dataset: { pack: def.id } },
h('span', { class: 'muted' }, '🧪 ' + _o1o('xpack.exp.safe')),
button(_o1o('xpack.feedback'), () => openFeedback && openFeedback({ kind: '', text: packFeedbackText(def) }), { kind: 'secondary', small: true, icon: '💬', testid: 'pack-feedback-' + def.id }));
}
export function packsModule({ submitFeedback, getPacks, isOwner = () => true, getScreenToggle = () => null, openFeedback = null }) {
let _o1i = null;
return {
manifest: { id: 'packs', title: t('xpack.title'), icon: 'layout', screen: 'settings', order: 60, version: '2.0.0', status: 'ready', help: 'packs', desc: t('xpack.desc') },
async mount(el, ctx) {
const { ui, nav } = ctx; const { h, button, badge, card } = ui;
const packs = getPacks();
const owner = isOwner();
let filter = 'all';
try { const _om = localStorage.getItem(_o0); if (FILTERS.includes(_om)) filter = _om; } catch { }
const _o9 = h('div', { class: 'xk stack', 'data-testid': 'xpacks' });
const _o1g = owner ? ui.segmented(FILTERS.map((_om) => ({ value: _om, label: t('xpack.f.' + _om) })), filter, (v) => {
filter = v; try { localStorage.setItem(_o0, v); } catch { } _oi();
}, { label: t('xpack.title'), name: 'xpack-filter' }) : null;
if (_o1g) { _o1g.setAttribute('data-testid', 'xpack-filter'); _o1g.classList.add('xk-filter'); }
const vbox = h('div', { class: 'xk-video-slot' });
const _ow = h('p', { class: 'muted', 'data-testid': 'xpack-lead' }, t(owner ? 'xpack.lead' : 'xpack.lead.member'));
el.append(_ow, vbox, _o1g || '', _o9);
if (_o1i) _o1i();
const _o1j = [packs.on(() => { if (el.isConnected) _oi(); }), onPackCardExtra(() => { if (el.isConnected) _oi(); })];
const _o1s = getScreenToggle && getScreenToggle();
if (_o1s && _o1s.on) _o1j.push(_o1s.on(() => { if (el.isConnected) _oi(); }));
_o1i = () => _o1j.forEach((_om) => _om());
_oi();
function _oi() {
const _o1f = document.scrollingElement;
const _o1v = _o1f ? _o1f.scrollTop : 0;
const v = getScreenToggle && getScreenToggle();
const _o1p = !!v && v.ids().some((id) => packs.moduleOn(id));
vbox.style.overflowAnchor = 'none';
ui.mountTo(vbox, _o1p ? v.toggleEl(ui) : '');
const all = packs.cards();
const _o11 = all.every((c) => c.def.kind === 'core');
if (_o1g) { _o1g.hidden = _o11; _o1g.style.display = _o11 ? 'none' : ''; }
_ow.textContent = _o11 ? _o1o('xpack.lead.core') : t(owner ? 'xpack.lead' : 'xpack.lead.member');
const list = _o11 ? all : filterCards(all, filter);
_o9.style.overflowAnchor = 'none';
if (!list.length) ui.mountTo(_o9, ui.empty(t('xpack.none')));
else ui.mountTo(_o9, list.map(_o16));
if (_o1f && _o1v > 0) {
_o1f.scrollTop = _o1v;
requestAnimationFrame(() => { if (Math.abs(_o1f.scrollTop - _o1v) > 2) _o1f.scrollTop = _o1v; });
}
}
function _o16(c) {
const { def, rec, st } = c;
const _o1n = st === 'core' ? 'gold' : st === 'on' ? 'ok' : st === 'dev' ? 'info' : st === 'experimental' ? 'warn' : 'neutral';
const beta = def.experimental && st !== 'experimental';
const _o6 = h('div', { class: 'xk-badges' }, def.trial && st !== 'dev' && st !== 'experimental' && !beta ? badge(t('xpack.st.trial'), 'warn') : null,
beta ? badge(t('xpack.st.experimental'), 'warn') : null, badge(t('xpack.st.' + st), _o1n),
c.update ? badge(t('xpack.st.update'), 'warn') : null,
st === 'dev' && rec.requested ? badge(t('xpack.st.requested'), 'neutral') : null);
const _o1q = st === 'dev' || st === 'experimental' ? '' : t('xpack.version', { v: ['on', 'off'].includes(st) ? (rec.version || def.version) : def.version }) + (c.update ? ' · ' + t('xpack.version.new', { v: def.version }) : '');
const _o3 = st === 'experimental' ? _ol(def) : (owner ? actions(c) : []).concat(beta ? [_oo(def)] : []);
return card({
title: packTitle(def),
subtitle: [def.desc, _o1q].filter(Boolean).join(' · '), icon: packIcon(def), cls: 'xk-pack xk-pack-' + st, id: 'xpack-' + def.id,
actions: _o6,
body: h('div', { dataset: { status: st, trial: def.trial ? '1' : '0' } },
st === 'experimental' ? h('p', { class: 'muted xk-exp-note' }, t('xpack.exp.note')) : beta ? h('p', { class: 'muted xk-exp-note', 'data-testid': 'xpack-safe-' + def.id }, t('xpack.exp.safe'))
: def.trial && st !== 'dev' ? h('p', { class: 'muted xk-trial-note' }, t('xpack.trial.note')) : null,
def.items.length ? h('ul', { class: 'xk-items' }, def.items.map((x) => h('li', null, x))) : null,
def.forSale && st === 'notinstalled' && packPrice(def) ? h('p', { class: 'xk-price', 'data-testid': 'xpack-price-' + def.id }, packPrice(def)) : null,
_o3.length ? h('div', { class: 'btn-row xk-acts' }, _o3) : null,
packCardExtra(def, { st, redraw: _oi }))
});
}
function _oo(def) {
const _o12 = openFeedback || (() => nav('settings/feedback'));
return button(t('xpack.feedback'), () => _o12({ kind: '', text: packFeedbackText(def) }), { kind: 'ghost', icon: '💬', testid: 'xpack-feedback-' + def.id });
}
function _ol(def) {
const _o1u = t('xpack.exp.disabled');
const _oh = button(t('xpack.exp.download'), null, { kind: 'primary', icon: 'lock', disabled: true, title: _o1u, testid: 'xpack-install-' + def.id });
_oh.setAttribute('aria-label', t('xpack.exp.download') + ' – ' + _o1u); _oh.setAttribute('aria-disabled', 'true');
const code = button(t('xpack.exp.code'), (ev) => {
const _ob = ev && ev.target && ev.target.closest ? ev.target.closest('.xk-pack') : null;
const _op = _ob ? _ob.querySelector('.lic-gift-form') : null;
if (!_op) return nav('settings/license');
_op.hidden = false;
const ask = _ob.querySelector('[data-testid$="-ask"]'); if (ask) ask.setAttribute('aria-expanded', 'true');
const _or = _op.querySelector('input'); if (_or) _or.focus();
}, { kind: 'secondary', icon: 'key', testid: 'xpack-code-' + def.id });
const ask = button(t('xpack.exp.ask'), () => _o5(def), { kind: 'ghost', icon: '✉️', testid: 'xpack-ask-' + def.id });
return [h('span', { title: _o1u, class: 'xk-exp-lock' }, _oh), owner ? code : null, ask, _oo(def)].filter(Boolean);
}
async function _o5(def) {
const name = packTitle(def) || def.title || def.id;
const text = _o1o('xpack.exp.ask.text').replace('{p}', name).replace('{id}', def.id);
try { await submitFeedback({ kind: 'add', text }); } catch (e) { ui.toast((e && e.message) || t('xpack.err.state'), 'warn', 5000); return; }
ui.toast(_o1o('xpack.exp.ask.sent').replace('{p}', name), 'ok', 4500);
try { const _on = typeof window !== 'undefined' && window.__bds && window.__bds.feedback; if (_on && typeof _on.sendSeller === 'function') _on.sendSeller({ kind: 'add', text }); } catch { }
}
function actions({ def, rec, st, update }) {
const _o13 = [];
const _o1m = (k) => 'xpack-' + k + '-' + def.id;
if (st === 'dev') {
_o13.push(rec.requested && rec.request_id
? button(t('xpack.view'), () => nav('settings/feedback' + (['queued', 'sent'].includes(rec.request_id) ? '' : '?fb=' + encodeURIComponent(rec.request_id))), { kind: 'secondary', testid: _o1m('view') })
: button(t('xpack.need'), () => _o10(def), { kind: 'primary', icon: 'plus', testid: _o1m('need') }));
} else if (st === 'notinstalled') {
if (def.forSale && !entitled(def.id, rec)) _o13.push(button(_o1o('xpack.buy'), () => nav('settings/license'), { kind: 'primary', icon: 'wallet', testid: _o1m('buy') }));
else _o13.push(def.experimental ? button(t('xpack.exp.download'), () => _o1d(def, 'install'), { kind: 'primary', icon: 'download', testid: _o1m('install') })
: button(t('xpack.install'), () => _o1d(def, 'install'), { kind: 'primary', icon: 'plus', testid: _o1m('install') }));
} else if (st === 'on' || st === 'off') {
const _o1l = ui.field({ label: t(st === 'on' ? 'xpack.switch.on' : 'xpack.switch.off'), type: 'toggle', value: st === 'on', id: _o1m('switch'),
onChange: (v) => { _o1l.input.disabled = true; _o1d(def, v ? 'enable' : 'disable'); } });
_o1l.classList.add('xk-switch'); _o1l.input.setAttribute('data-testid', _o1m('switch'));
_o13.push(_o1l);
if (update) _o13.push(button(t('xpack.update'), () => _o1d(def, 'update'), { kind: 'primary', icon: 'refresh', testid: _o1m('update') }));
_o13.push(button(t('xpack.remove'), () => _o1c(def), { kind: 'ghost', icon: 'x', testid: _o1m('remove') }));
}
if (st !== 'dev' && def.changelog.length) _o13.push(button(t('xpack.changes'), () => _of(def, rec), { kind: 'ghost', icon: 'log', testid: _o1m('changes') }));
return _o13;
}
async function _o1d(def, action) {
try {
await packs.act(def.id, action);
ui.toast(t('xpack.done.' + action, { p: def.title, v: def.version }), 'ok');
} catch (e) { ui.toast((e && e.message) || t('xpack.err.state'), 'warn', 5000); }
_oi();
}
async function _o1c(def) {
const ok = await ui.confirm(t('xpack.remove.confirm', { p: def.title }), { ok: t('xpack.remove'), kind: 'danger', title: t('xpack.remove') + ': ' + def.title });
if (ok) await _o1d(def, 'uninstall');
}
function _of(def, rec) {
const cur = rec && rec.installed ? rec.version : '';
const _ot = (v) => !!cur && cmpVer(v, cur) > 0;
ui.modal({
title: t('xpack.changes') + ': ' + def.title,
body: h('div', { class: 'xk-changes', 'data-testid': 'xpack-changelog' }, def.changelog.map((c) =>
h('section', { class: ['xk-change', _ot(c.version) && 'is-new'] },
h('h4', null, t('xpack.version', { v: c.version }) + (c.date ? ' · ' + c.date.split('-').reverse().join('/') : '') + (_ot(c.version) ? ' · ' + t('xpack.st.update') : '')),
h('ul', { class: 'xk-items' }, c.items.map((x) => h('li', null, x)))))),
actions: [{ label: t('common.close'), kind: 'primary' }]
});
}
async function _o10(def) {
try {
const r = await submitFeedback({ kind: 'add', text: packRequestText(def) });
const id = (r && r.row && r.row.id) || (r && r.status === 'queued' ? 'queued' : 'sent');
await packs.act(def.id, 'request', { requestId: String(id) });
_oi();
ui.toast(t(r && r.status === 'queued' ? 'xpack.need.queued' : 'xpack.need.sent', { p: def.title }), 'ok', 4500);
} catch (e) { ui.toast((e && e.message) || t('xpack.err.state'), 'warn', 5000); }
}
},
unmount() { if (_o1i) { _o1i(); _o1i = null; } },
async selftest() {
const d = buildDefs({ packs: [{ id: 'core', modules: ['a'] }, { id: 'x', kind: 'optional', status: 'ready', version: '1.0.0', default_installed: true, modules: ['b'] }] }, () => [], () => '');
const off = { x: { installed: true, enabled: false } };
const ok = moduleOn(d, null, 'b') && moduleOn(d, off, 'a') && !moduleOn(d, off, 'b');
return ok ? { ok: true } : { ok: false, details: 'packs logic' };
}
};
}
export default { setPackStates, packStateOf, setPackPrice, applyMoves, setBetaGate, betaAllowed, moduleBeta, packFeedbackText, betaBar, EXPERIMENTAL, notifyIds, setNotify, takeReadyNotices, entitled, buildDefs, recordOf, cardStatus, hasUpdate, isOn, moduleOn, moduleTrial, featureOn, migrateState, applyAction, cardsFor, filterCards, packRequestText, createPacks, packsModule };

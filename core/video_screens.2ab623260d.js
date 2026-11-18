import { engineDownload, detectOs } from './engine_dl.18c8a720c5.js';
export const SETTINGS_KEY = 'video.screens';
export const LOCAL_KEY = 'video.screens';
export const FLAG = 'video_only';
export const EVENT = 'bds:video-screens';
export const CONN_LOCAL_KEY = 'bds:conn:local';
export const VIDEO_CONN = ['engine', 'vbee', 'flow', 'map'];
export const ONLINE_CONN_HIDDEN = ['engine', 'vbee', 'map'];
export const MODES = ['off', 'online', 'machine'];
export const DEFAULT_MODE = 'machine';
export const BASIC_MODE = 'off';
export function videoOffered(config) {
const _o5 = (config && config.FEATURES) || {};
if (_o5.video === true) return true;
if (_o5.video === false) return false;
return String((config && config.edition) || 'owner') === 'owner';
}
export function defaultModeFor(config) { return videoOffered(config) ? DEFAULT_MODE : BASIC_MODE; }
export const ONLINE_FLAG = 'video_online';
export const MODE_TEXT = {
off: { label: 'Không làm video', short: 'Không làm video', icon: 'x',
cost: 'Ẩn các màn Video – Ý tưởng & nội dung vẫn dùng bình thường. Không cài gì.' },
online: { label: 'Chỉ dùng AI trên mạng – không cài gì', short: 'AI trên mạng', icon: 'cloud',
cost: 'AI tính phí theo nhà cung cấp, mỗi lần hỏi trước; chỉ ra clip ngắn minh hoạ, không làm video bản đồ.' },
machine: { label: 'Dựng trên máy', short: 'Dựng trên máy', icon: 'monitor',
cost: 'Miễn phí cho video bản đồ; cần tải bộ cài ~150–300 MB.' }
};
export const TEXT = {
toggle: 'Hiện các màn Video',
toggleHelp: 'Tắt: ẩn Video bản đồ, Dựng & Sửa, Nhân vật, Video AI – phần Ý tưởng & nội dung vẫn dùng bình thường trên web. Bật lại bất cứ lúc nào.',
toggleLocal: 'Lựa chọn này lưu trên máy này.',
hiddenTitle: 'Màn Video đang ẩn',
hiddenLead: 'Anh/chị đã chọn không làm video trên máy tính nên các màn Video đang ẩn. Ý tưởng & nội dung vẫn dùng bình thường.',
showAgain: 'Bật lại',
openIdeas: 'Mở Ý tưởng',
doneShow: 'Đã hiện lại các màn Video.',
doneHide: 'Đã ẩn các màn Video – Ý tưởng & nội dung vẫn dùng bình thường.',
engineTitle: 'Đã thấy Máy dựng video',
engineAsk: 'Đã thấy Máy dựng video – hiện lại các màn Video?',
engineYes: 'Hiện lại',
engineNo: 'Để sau',
engineAskOnline: 'Đã thấy Máy dựng video trên máy này – chuyển sang "Dựng trên máy" để làm video bản đồ?',
engineYesOnline: 'Chuyển sang Dựng trên máy',
modeTitle: 'Cách làm video',
modeLocal: 'Lựa chọn này lưu trên máy này.',
modeDone: { off: 'Đã chọn Không làm video – Ý tưởng & nội dung vẫn dùng bình thường.', online: 'Đã chọn Chỉ dùng AI trên mạng – không cài gì trên máy.', machine: 'Đã chọn Dựng trên máy – các màn Video hiện đủ.' },
installTitle: 'Video bản đồ cần dựng trên máy tính – Cài máy dựng',
installLead: 'Đang dùng "Chỉ dùng AI trên mạng – không cài gì": video bản đồ/quy hoạch, Dựng & Sửa, Nhân vật cần máy dựng trên máy tính Windows/Mac (miễn phí cho video bản đồ; tải bộ cài ~150–300 MB).',
installAfter: 'Cài xong: Cài đặt › Gói chức năng › Video › chọn "Dựng trên máy".',
installBtn: 'Cài máy dựng',
installOther: 'Máy {os}? Tải bộ cài cho {os}',
openPacks: 'Đổi cách làm video',
suggestStrong: 'Máy này đủ mạnh để dựng video bản đồ/quy hoạch miễn phí ngay trên máy.',
suggestSoft: 'Máy này cấu hình Khá – dựng được video bản đồ/quy hoạch trên máy (chậm hơn máy mạnh).',
suggestPick: 'Chọn Dựng trên máy',
suggestWeak: 'Máy này cấu hình Cơ bản – video dựng trên máy sẽ chậm và giật. Nên chọn AI trên mạng, hoặc cài bộ tạo video trên một máy tính mạnh hơn rồi "Gửi máy tính dựng".',
suggestPhone: 'Đang mở trên điện thoại: điện thoại không dựng video. Soạn kịch bản ở màn Video rồi bấm "Gửi máy tính dựng" – máy tính Windows/Mac của anh/chị (đã cài bộ tạo video) tự dựng khi bật; hoặc "Làm bằng AI trên mạng ngay" (thu phí riêng).'
};
export function machineSuggestion({ os = null, tier = null, mode = DEFAULT_MODE } = {}) {
const m = toMode(mode);
if (os === 'mobile') return m === 'off' ? null : { kind: 'phone', text: TEXT.suggestPhone };
if (os !== 'windows' && os !== 'mac') return null;
if ((tier === 'manh' || tier === 'kha') && m !== 'machine') return { kind: tier === 'manh' ? 'strong' : 'soft', text: tier === 'manh' ? TEXT.suggestStrong : TEXT.suggestSoft };
if (tier === 'co_ban' && m === 'machine') return { kind: 'weak', text: TEXT.suggestWeak };
return null;
}
export const OFF_WORDS = {
'nav.content': 'Ý tưởng',
'screen.content': 'Ý tưởng & nội dung',
'screen.content.sub': 'Ý tưởng, kịch bản, chú thích và tin thị trường – chạy trên web',
'screen.inbox.sub': 'Khách mới, tin Zalo, chính sách và ý tưởng đang chờ duyệt',
'help.screen.content': 'Thu thập ý tưởng, soạn kịch bản, chú thích và theo dõi tin thị trường – chạy trên web. Các màn Video đang ẩn (đã chọn Không làm video): chọn lại ở Cài đặt › Gói chức năng › Cách làm video (AI trên mạng hoặc Dựng trên máy).'
};
const _o8 = (_oq) => !!_oq && typeof _oq === 'object' && !Array.isArray(_oq);
export function normMode(_oq) {
const _ok = String(_oq == null ? '' : _oq);
if (MODES.includes(_ok)) return _ok;
return { skip: 'off', install: 'machine', hidden: 'off', shown: 'machine' }[_ok] || null;
}
export function toMode(x) { return typeof x === 'boolean' ? (x ? 'off' : 'machine') : (normMode(x) || DEFAULT_MODE); }
export function recordMode(rec) {
if (!_o8(rec)) return null;
if (MODES.includes(rec.mode)) return rec.mode;
return typeof rec.hidden === 'boolean' ? (rec.hidden ? 'off' : 'machine') : null;
}
export function modeOf(rec, def = DEFAULT_MODE) { return recordMode(rec) || def; }
export function engineOffMode(mode) { return toMode(mode) !== 'machine'; }
const _oj = (mode, extra) => ({ ...extra, mode, hidden: mode === 'off' });
export function videoModules(pack) {
const meta = _o8(pack && pack.meta) ? pack.meta : {};
const _oc = Array.isArray(pack && pack.modules) ? pack.modules.map((m) => (typeof m === 'string' ? m : m && m.id)).filter(Boolean) : Object.keys(meta);
return _oc.filter((id) => _o8(meta[id]) && meta[id][FLAG] === true);
}
export function videoOnlineModules(pack) {
const meta = _o8(pack && pack.meta) ? pack.meta : {};
return videoModules(pack).filter((id) => meta[id][ONLINE_FLAG] === true);
}
export function effectiveRecord({ synced = null, local = null, owner = true } = {}) {
const pick = owner ? synced : local;
return recordMode(pick) ? pick : null;
}
export function isHidden(rec) { return modeOf(rec) === 'off'; }
export function moduleHidden(id, videoIds, modeOrHidden, onlineIds = []) {
const m = toMode(modeOrHidden); const _o9 = String(id || '');
if (m === 'machine' || !(videoIds || []).includes(_o9)) return false;
return m === 'off' || !(onlineIds || []).includes(_o9);
}
export function pathHidden(path, videoIds, modeOrHidden, onlineIds = []) {
if (toMode(modeOrHidden) === 'machine') return false;
const _oh = String(path || '').replace(/^#?\/?/, '').split('?')[0];
const _og = _oh.split('/').filter(Boolean);
return _og.length >= 2 && moduleHidden(_og[1], videoIds, modeOrHidden, onlineIds);
}
export function screenAllHidden(screenModuleIds, videoIds, modeOrHidden, onlineIds = []) {
const ids = screenModuleIds || [];
return toMode(modeOrHidden) !== 'machine' && ids.length > 0 && ids.every((id) => moduleHidden(id, videoIds, modeOrHidden, onlineIds));
}
export function fromWizard(ev, { now = Date.now(), by = '' } = {}) {
const e = _o8(ev) ? ev : {};
const _om = { at: now, by, source: 'wizard' };
if (e.type === 'engine_ok') return _oj('machine', _om);
if (e.type === 'choice') return _oj(normMode(e.mode) || 'off', _om);
if (e.type === 'skip') { const m = normMode(e.mode) || 'off'; return m === 'machine' ? null : _oj(m, _om); }
return null;
}
export function fromToggle(prev, show, { now = Date.now(), by = '' } = {}) {
return fromMode(prev, show ? 'machine' : 'off', { now, by });
}
export function fromMode(prev, mode, { now = Date.now(), by = '', source = 'toggle' } = {}) {
const m = normMode(mode) || DEFAULT_MODE;
return { ...(_o8(prev) ? prev : {}), mode: m, hidden: m === 'off', source, at: now, by };
}
export function shouldPromptEngine(rec, engineOk) { return !!recordMode(rec) && engineOffMode(modeOf(rec)) && !!engineOk && !rec.engine_prompted; }
export function afterEnginePrompt(rec, accept, { now = Date.now(), by = '' } = {}) {
const base = _o8(rec) ? rec : { hidden: true, mode: 'off' };
return accept ? { ...base, mode: 'machine', hidden: false, source: 'engine', at: now, by, engine_prompted: now } : { ...base, engine_prompted: now };
}
export function filterShortcuts(list, allowPath) { return (list || []).filter((_ok) => !allowPath || allowPath(_ok.path)); }
export function connHidden(id, modeOrHidden) {
const m = toMode(modeOrHidden);
return (m === 'off' ? VIDEO_CONN : m === 'online' ? ONLINE_CONN_HIDDEN : []).includes(String(id || ''));
}
export function visibleConn(items, modeOrHidden) { return (items || []).filter((it) => it && !connHidden(it.id, modeOrHidden)); }
export function engineSeen({ config = {}, loc = null, local = null, since = 0 } = {}) {
const base = String(config.ENGINE_URL || 'http://127.0.0.1:8765').replace(/\/$/, '');
if (loc && loc.origin && (loc.origin === base || (/^(127\.0\.0\.1|localhost)$/.test(loc.hostname || '') && String(loc.port) === '8765'))) return true;
const e = _o8(local) ? local.engine : null;
return !!(e && e.ok === true && Number(e.at) > Number(since || 0));
}
function _oi() { try { return JSON.parse(localStorage.getItem(CONN_LOCAL_KEY) || '{}') || {}; } catch { return {}; } }
export const VIDEO_FEATURES = ['engine', 'brief_video', 'ideas21h'];
export function isVideoJob(j) { return /^(video|ai_clip|scene|studio|render)/.test(String((j && j.type) || '')); }
export function packsView(packs, _or) {
if (!packs || !_or) return packs;
return new Proxy(packs, {
get(target, key) {
if (key === 'moduleOn') return (id) => !_or.moduleHidden(id) && target.moduleOn(id);
if (key === 'featureOn') return (_o5) => !((_or.engineOff ? _or.engineOff() : _or.hidden()) && VIDEO_FEATURES.includes(_o5)) && target.featureOn(_o5);
const _oq = target[key];
return typeof _oq === 'function' ? _oq.bind(target) : _oq;
}
});
}
export function createVideoScreens({ settings = null, prefs = null, getPack = () => null, isOwner = () => true, userId = () => '', config = null, packOn = null } = {}) {
const _o7 = config ? videoOffered(config) : true;
const _od = () => _o7 || (typeof packOn === 'function' && (() => { try { return packOn('video') === true; } catch { return false; } })());
const _o2 = () => (config ? (_od() ? DEFAULT_MODE : BASIC_MODE) : DEFAULT_MODE);
const _oo = new Set();
let _o1 = null;
let _o0 = false;
const _oa = () => { const p = getPack(); if (!_o1 || _o1.p !== p) _o1 = { p, ids: videoModules(p), online: videoOnlineModules(p) }; return _o1; };
const ids = () => _oa().ids;
const onlineIds = () => _oa().online;
const _ob = () => { try { return prefs ? prefs.get(LOCAL_KEY, null) : null; } catch { return null; } };
const record = () => effectiveRecord({ synced: settings ? settings.get(SETTINGS_KEY, null) : null, local: _ob(), owner: !!isOwner() });
const _o6 = () => _oo.forEach((cb) => { try { cb(); } catch { } });
if (settings && settings.on) settings.on(SETTINGS_KEY, _o6);
async function _os(rec) {
if (!rec) return record();
if (isOwner() && settings) await settings.set(SETTINGS_KEY, rec);
else { if (prefs) prefs.set(LOCAL_KEY, rec); _o6(); }
return rec;
}
const _or = {
TEXT, MODE_TEXT,
ids, onlineIds, record,
owner: () => !!isOwner(),
offered: () => _od(),
mode: () => modeOf(record(), _o2()),
online: () => _or.mode() === 'online',
engineOff: () => engineOffMode(_or.mode()),
hidden: () => _or.mode() === 'off',
moduleHidden: (id) => moduleHidden(id, ids(), _or.mode(), onlineIds()),
pathHidden: (path) => pathHidden(path, ids(), _or.mode(), onlineIds()),
screenAllHidden: (screenIds) => screenAllHidden(screenIds, ids(), _or.mode(), onlineIds()),
connHidden: (id) => connHidden(id, _or.mode()),
isVideoJob,
setMode: (mode, source = 'toggle') => _os(fromMode(record(), mode, { by: userId(), source })),
setShown: (show, source = 'toggle') => _or.setMode(show ? 'machine' : 'off', source),
fromWizard: (ev) => _os(fromWizard(ev, { by: userId() })),
on(cb) { _oo.add(cb); return () => _oo.delete(cb); },
modeEl(ui) {
const { h } = ui;
const cur = _or.mode();
const help = h('p', { class: 'muted small', 'data-testid': 'video-mode-help' });
const _oe = (m) => { help.textContent = MODE_TEXT[m].label + ': ' + MODE_TEXT[m].cost + (_or.owner() ? '' : ' ' + TEXT.modeLocal); };
const seg = ui.segmented(MODES.map((m) => ({ value: m, label: MODE_TEXT[m].short, icon: MODE_TEXT[m].icon })), cur, async (_oq) => {
_oe(_oq);
try { await _or.setMode(_oq); ui.toast(TEXT.modeDone[_oq], 'ok'); } catch (e) { ui.toast((e && e.message) || String(e), 'warn'); seg.setValue(_or.mode()); _oe(_or.mode()); }
}, { label: TEXT.modeTitle, name: 'video-mode' });
seg.setAttribute('data-testid', 'video-mode');
_oe(cur);
const suggest = h('div', { class: 'xk-vs-suggest', 'data-testid': 'video-mode-suggest', 'aria-live': 'polite' });
const os = detectOs(typeof navigator !== 'undefined' ? navigator : null);
let tier = null;
const _of = (m) => {
const _ol = machineSuggestion({ os, tier, mode: m });
suggest.dataset.kind = _ol ? _ol.kind : '';
if (!_ol) { suggest.replaceChildren(); return; }
const kids = [h('p', { class: 'small', 'data-testid': 'video-mode-suggest-text' }, _ol.text)];
if (_ol.kind === 'strong' || _ol.kind === 'soft') {
const _o4 = engineDownload(typeof navigator !== 'undefined' ? navigator : null);
kids.push(h('div', { class: 'btn-row' },
ui.button(TEXT.suggestPick, async () => { await _or.setMode('machine'); seg.setValue('machine'); _oe('machine'); _of('machine'); ui.toast(TEXT.modeDone.machine, 'ok'); },
{ kind: 'primary', icon: 'monitor', testid: 'video-mode-suggest-pick' }),
h('a', { class: 'btn btn-ghost', href: _o4.primary.path, download: _o4.primary.file, 'data-testid': 'video-mode-suggest-dl', dataset: { os: _o4.primary.os } },
ui.icon('download', 20), h('span', null, 'Tải bộ cài (' + _o4.primary.label + ')'))));
}
suggest.replaceChildren(...kids);
};
if (os === 'windows' || os === 'mac') {
import('./video_machine.611ebd965d.js').then(async (VM) => {
let _on = null; try { _on = localStorage; } catch { _on = null; }
tier = VM.cachedTier(_on);
if (!tier) { try { tier = ((await import('./wizard/hwcheck.js')).runCheck() || {}).tier || 'unknown'; } catch { tier = 'unknown'; } VM.saveTier(_on, tier); }
_of(_or.mode());
}).catch(() => { });
} else _of(cur);
const _op = _or.on(() => { if (!suggest.isConnected) { _op(); return; } _of(_or.mode()); });
return h('section', { class: 'card xk-video-screens', 'data-testid': 'video-screens', dataset: { mode: cur, hidden: cur === 'off' ? '1' : '0' } },
h('div', { class: 'card-body' },
h('div', { class: 'xk-vs-row', style: { display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' } },
h('span', { class: 'xk-vs-ico', 'data-testid': 'video-screens-icon', 'aria-hidden': 'true' }, ui.icon('content', 22)),
h('strong', null, TEXT.modeTitle)),
seg, help, suggest));
},
toggleEl(ui) { return !_od() && _or.mode() === 'off' ? '' : _or.modeEl(ui); },
installCard(ui, { title = '', testid = 'video-install-card' } = {}) {
const { h } = ui;
const _o4 = engineDownload(typeof navigator !== 'undefined' ? navigator : null);
const _o3 = (d, main) => h('a', { class: 'btn ' + (main ? 'btn-primary' : 'btn-ghost btn-sm'), href: d.path, download: d.file, dataset: { os: d.os },
'data-testid': main ? 'video-install-dl' : 'video-install-dl-other' },
ui.icon('download', main ? 20 : 18), h('span', null, main ? TEXT.installBtn + ' (' + d.label + ')' : TEXT.installOther.replace(/\{os\}/g, d.label)));
return h('section', { class: 'card card-info xk-video-install', 'data-testid': testid, role: 'note' },
h('div', { class: 'card-body' },
h('h3', { class: 'card-title' }, TEXT.installTitle),
title ? h('p', { class: 'small', 'data-testid': 'video-install-screen' }, 'Màn "' + title + '" cần máy dựng trên máy tính.') : null,
h('p', { class: 'muted' }, TEXT.installLead),
h('div', { class: 'btn-row' }, _o3(_o4.primary, true), _o3(_o4.other, false)),
h('p', { class: 'muted small' }, TEXT.installAfter),
h('div', { class: 'btn-row' }, h('a', { class: 'btn btn-ghost btn-sm', href: '#/settings/packs', 'data-testid': 'video-install-packs' }, ui.icon('puzzle', 18), h('span', null, TEXT.openPacks)))));
},
hiddenCard(ui, { nav = () => {}, title = '' } = {}) {
if (_or.online() && _od()) return _or.installCard(ui, { title });
const { h, button } = ui;
return h('section', { class: 'card card-info xk-video-hidden', 'data-testid': 'video-hidden-card', role: 'status' },
h('div', { class: 'card-body' },
h('h3', { class: 'card-title' }, TEXT.hiddenTitle + (title ? ' – ' + title : '')),
h('p', { class: 'muted' }, TEXT.hiddenLead),
h('div', { class: 'btn-row' },
_od() ? button(TEXT.showAgain, async () => { await _or.setShown(true); ui.toast(TEXT.doneShow, 'ok'); }, { kind: 'primary', icon: 'content', testid: 'video-hidden-show' }) : null,
ids().includes('ideas') ? null : button(TEXT.openIdeas, () => nav('content/ideas'), { kind: 'ghost', icon: 'sparkle', testid: 'video-hidden-ideas' }))));
},
async checkEngine({ ui, config = {}, loc = (typeof location !== 'undefined' ? location : null), local = null } = {}) {
const rec = record();
if (!_od() || !rec || !engineOffMode(modeOf(rec)) || rec.engine_prompted || !isOwner()) return 'skip';
return engineSeen({ config, loc, local: local || _oi(), since: Number(rec.at) || 0 }) ? _or.askEngine(ui) : 'none';
},
async askEngine(ui) {
if (_o0 || !shouldPromptEngine(record(), true)) return 'skip';
_o0 = true;
const on = _or.online();
const ok = await ui.modal({
title: TEXT.engineTitle,
body: ui.h('p', { class: 'lead', 'data-testid': 'video-engine-ask' }, on ? TEXT.engineAskOnline : TEXT.engineAsk),
actions: [{ label: TEXT.engineNo, kind: 'ghost', icon: 'clock', value: false, id: 'video-engine-later' }, { label: on ? TEXT.engineYesOnline : TEXT.engineYes, kind: 'primary', icon: 'content', value: true, id: 'video-engine-show' }]
}).done.then((_oq) => _oq === true);
_o0 = false;
await _os(afterEnginePrompt(record(), ok, { by: userId() }));
if (ok) ui.toast(TEXT.doneShow, 'ok');
return 'asked';
}
};
return _or;
}
export default { machineSuggestion, videoOffered, defaultModeFor, BASIC_MODE, SETTINGS_KEY, LOCAL_KEY, FLAG, ONLINE_FLAG, EVENT, TEXT, MODE_TEXT, MODES, DEFAULT_MODE, VIDEO_CONN, ONLINE_CONN_HIDDEN, VIDEO_FEATURES, isVideoJob, packsView, connHidden, visibleConn, engineSeen, videoModules, videoOnlineModules, normMode, toMode, recordMode, modeOf, engineOffMode, effectiveRecord, isHidden, moduleHidden, pathHidden, screenAllHidden, fromWizard, fromToggle, fromMode, shouldPromptEngine, afterEnginePrompt, filterShortcuts, createVideoScreens };

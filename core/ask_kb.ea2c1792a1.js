import { fold } from './xkit.71d637c634.js';
import { SCREENS } from './registry.dd6202705b.js';
export const SETTINGS_SECTIONS = ['connection', 'profile', 'look', 'security', 'users', 'mytg', 'ai', 'budget', 'storage', 'selftest', 'version', 'errors',
'memory', 'persona', 'onboarding', 'maintenance', 'hw', 'feedback', 'license'];
export const SETTINGS_HELP = { connection: 'connection', look: 'density', security: 'lock' };
export const PACKS_PATH = 'settings/packs';
export const KB_LIMITS = { hits: 6, rag: 4, alt: 3, instant: 60, medium: 45, shortWords: 5, mapDesc: 80, ragText: 260 };
const _o4 = (_om) => String(_om == null ? '' : _om).normalize('NFC').replace(/\s+/g, ' ').trim();
const _or = (_om, max) => { const v = _o4(_om); return v.length > max ? v.slice(0, max - 1).trimEnd() + '…' : v; };
const norm = (_om) => fold(_om).replace(/[^a-z0-9]+/g, ' ').trim();
const esc = (_om) => _om.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const _o8 = (hay, _ob) => !!_ob && new RegExp('(^| )' + esc(_ob) + '( |$)').test(hay);
export function parseKbLines(lines) {
const _oj = new Map();
for (const l of lines || []) {
const _ok = String(l).split('|').map((x) => _o4(x));
const id = _ok[0];
if (!id || !/^[a-z0-9_]+$/.test(id)) continue;
_oj.set(id, { id, kind: _ok[1] || '', title: _ok[2] || '', path: (_ok[3] || '').replace(/^#?\/?/, ''), does: _ok[4] || '', input: _ok[5] || '', output: _ok[6] || '',
cond: _ok[7] || '', keys: (_ok[8] || '').split(';').map(_o4).filter(Boolean), where: _ok[9] || '' });
}
return _oj;
}
export function parseKbSteps(lines) {
const _oj = new Map();
for (const l of lines || []) {
const [id, ...steps] = String(l).split('|').map((x) => _o4(x));
if (!id || !steps.length) continue;
_oj.set(id, steps.filter(Boolean).map((_om) => { const _oa = _om.lastIndexOf('>'); return _oa > 0 ? { text: _om.slice(0, _oa).trim(), ref: _om.slice(_oa + 1).trim() } : { text: _om, ref: '' }; }));
}
return _oj;
}
export function splitPath(path) {
const [_ok, q] = String(path || '').replace(/^#?\/?/, '').split('?');
const [screen, sub] = _ok.split('/').filter(Boolean);
return { screen: screen || '', sub: sub || '', query: q || '' };
}
export function buildKb({ modules = [], settings = [], screens = [], lines = [], steps = [], screenLabel = (_om) => _om, packsLabel = '', shipped = null } = {}) {
const hand = parseKbLines(lines);
const _ot = parseKbSteps(steps);
const entries = []; const missing = []; const bad = []; const _ov = new Set();
const _oo = (_om) => _o4(screenLabel(_om) || _om);
for (const _om of screens) {
if (!_om || !_om.id) continue;
const id = 'scr_' + _om.id; const l = hand.get(id); if (l) _ov.add(id);
entries.push(_of({ id, kind: 'screen', title: (l && l.title) || _om.title || _oo(_om.id), path: _om.id, where: _oo(_om.id), does: (l && l.does) || _om.help, l, screen: _om.id, avail: 'ok', titleKey: false }));
}
for (const _od of modules) {
if (!_od || !_od.id) continue;
const l = hand.get(_od.id); if (l) _ov.add(_od.id); else missing.push(_od.id);
const screen = _od.screen || 'home';
const title = (l && l.title) || _od.title || _od.id;
const path = (l && l.path) || (_od.core && _od.id === screen ? screen : screen + '/' + _od.id);
const cond = [l && l.cond, _od.packId && _od.packId !== 'core' && _od.packTitle ? 'Thuộc gói "' + _od.packTitle + '"' + (packsLabel ? ' – cài ở ' + _oo('settings') + ' → ' + packsLabel : '') : ''].filter(Boolean).join('. ');
entries.push(_of({ id: _od.id, kind: 'module', title, path, where: (l && l.where) || (title === _oo(screen) ? _oo(screen) : _oo(screen) + ' → ' + title), does: (l && l.does) || _od.desc || _od.help, l, cond,
screen, avail: _od.avail || 'ok', packId: _od.packId || '', packTitle: _od.packTitle || '', auto: !l }));
}
for (const _om of settings) {
if (!_om || !_om.key) continue;
const id = 'set_' + _om.key; const l = hand.get(id); if (l) _ov.add(id); else missing.push(id);
const title = (l && l.title) || _om.title || _om.key;
entries.push(_of({ id, kind: 'setting', title, path: (l && l.path) || 'settings/' + _om.key, where: (l && l.where) || _oo('settings') + ' → ' + title, does: (l && l.does) || _om.help, l,
screen: 'settings', avail: _om.avail || 'ok', auto: !l }));
}
const byId = new Map(entries.map((e) => [e.id, e]));
const _o7 = (path) => {
const { screen, sub } = splitPath(path);
if (screen === 'settings' && sub) return byId.get('set_' + sub) || byId.get(sub) || null;
return (sub && byId.get(sub)) || byId.get('scr_' + screen) || null;
};
for (const l of hand.values()) {
if (_ov.has(l.id)) continue;
if (l.kind !== 'nut' && l.kind !== 'go') continue;
_ov.add(l.id);
if (!l.title || !l.path) { bad.push(l.id + ': nút cần tên và đường dẫn'); continue; }
if (shipped && (() => { const { screen: _on, sub } = splitPath(l.path); return !!sub && _on !== 'settings' && !shipped.has(sub); })()) { _ov.delete(l.id); continue; }
const parent = _o7(l.path);
if (!parent) { bad.push(l.id + ': đường dẫn #/' + l.path + ' không tới màn/mục nào'); continue; }
const screen = splitPath(l.path).screen;
const where = l.where || [_oo(screen), parent.kind !== 'screen' && parent.title !== _oo(screen) ? parent.title : '', l.title].filter(Boolean).join(' → ');
entries.push(_of({ id: l.id, kind: l.kind === 'go' ? 'removed' : 'action', title: l.title, path: l.path, where, does: l.does, l, screen, parent: parent.id,
cond: [l.cond, parent.kind === 'module' && parent.packId && parent.packId !== 'core' ? parent.cond.split('. ').find((x) => x.startsWith('Thuộc gói')) : ''].filter(Boolean).join('. '),
avail: parent.avail, packId: parent.packId || '', packTitle: parent.packTitle || '' }));
}
const orphans = [...hand.keys()].filter((id) => !_ov.has(id));
for (const e of entries) {
const _os = _ot.get(e.id);
e.steps = _os ? _os.map((x) => ({ text: x.text, ref: x.ref })) : _o3(e, byId, _oo);
byId.set(e.id, e);
}
for (const e of entries) for (const _om of e.steps) if (_om.ref && !byId.get(_om.ref) && !SCREENS.includes(splitPath(_om.ref).screen)) bad.push(e.id + ': bước trỏ tới "' + _om.ref + '" không có');
return { entries, byId, missing, orphans, bad };
function _of({ id, kind, title, path, where, does, l, cond, screen, avail, packId = '', packTitle = '', parent = '', auto = false, titleKey = true }) {
const keys = [titleKey ? title : '', ...((l && l.keys) || [])].map(_o4).filter(Boolean);
return {
id, kind, title: _o4(title), path, where: _o4(where), does: _or(does || '', 400), input: (l && l.input) || '', output: (l && l.output) || '',
cond: cond != null ? _o4(cond) : _o4((l && l.cond) || ''), keys, screen, avail: avail || 'ok', packId, packTitle, parent, auto,
_k: [...new Set(keys.map(norm).filter(Boolean))], _w: new Set(keys.map(norm).join(' ').split(' ').filter(Boolean))
};
}
}
function _o3(e, byId, _oo) {
const _oj = [];
if (e.kind === 'screen') { _oj.push({ text: 'Mở màn ' + e.title, ref: e.id }); }
else if (e.kind === 'removed') {
_oj.push({ text: 'Mở màn ' + _oo(e.screen), ref: 'scr_' + e.screen });
const _ok = byId.get(e.parent);
if (_ok && _ok.kind !== 'screen') _oj.push({ text: (_ok.kind === 'setting' ? 'Mở mục ' : 'Chọn ô ') + _ok.title, ref: _ok.id });
return _oj;
}
else {
_oj.push({ text: 'Mở màn ' + _oo(e.screen), ref: 'scr_' + e.screen });
if (e.kind === 'action') {
const _ok = byId.get(e.parent);
if (_ok && _ok.kind !== 'screen') _oj.push({ text: (_ok.kind === 'setting' ? 'Mở mục ' : 'Chọn ô ') + _ok.title, ref: _ok.id });
_oj.push({ text: 'Bấm "' + e.title + '"', ref: e.id });
} else _oj.push({ text: (e.kind === 'setting' ? 'Mở mục ' : 'Chọn ô ') + e.title, ref: e.id });
}
if (e.input) _oj.push({ text: 'Nhập / chuẩn bị: ' + e.input, ref: '' });
if (e.output) _oj.push({ text: 'Kết quả: ' + e.output, ref: '' });
return _oj;
}
export function validateKb(kb, { moduleIds = [], moduleScreen = {}, settingKeys = [] } = {}) {
const _o6 = [...(kb.bad || [])];
const _oh = new Set(moduleIds); const _oq = new Set(settingKeys);
const _op = new Set();
for (const e of kb.entries) {
if (_op.has(e.id)) _o6.push(e.id + ': trùng mã'); _op.add(e.id);
const { screen, sub } = splitPath(e.path);
if (!SCREENS.includes(screen)) { _o6.push(e.id + ': màn "' + screen + '" không có'); continue; }
if (!sub) continue;
if (screen === 'settings' && (_oq.has(sub) || _oh.has(sub))) continue;
if (!_oh.has(sub)) { _o6.push(e.id + ': #/' + e.path + ' – không có module "' + sub + '"'); continue; }
if (moduleScreen[sub] && moduleScreen[sub] !== screen) _o6.push(e.id + ': module "' + sub + '" ở màn ' + moduleScreen[sub] + ', không phải ' + screen);
}
return _o6;
}
export const SETTINGS_TITLE_KEY = { connection: 'set.conn' };
export const SETTINGS_TITLE = { hw: 'Máy của tôi', feedback: 'Góp ý', license: 'Bản quyền' };
export function kbSettings(keys = SETTINGS_SECTIONS, { one = () => '', availOf = () => 'ok' } = {}) {
return keys.map((_ob) => ({ key: _ob, title: one(SETTINGS_TITLE_KEY[_ob] || 'set.' + _ob) || SETTINGS_TITLE[_ob] || _ob, help: one('help.' + (SETTINGS_HELP[_ob] || _ob)), avail: availOf(_ob) }));
}
export function kbScreens(one = () => '') { return SCREENS.map((_om) => ({ id: _om, title: one('screen.' + _om) || _om, help: one('help.screen.' + _om) })); }
export function kbModules(pack, defs = [], { entries = [], availOf = () => 'ok' } = {}) {
const meta = (pack && pack.meta) || {};
const byId = new Map((entries || []).map((e) => [e.id, e]));
const _oj = [];
const helpText = (v) => (v && String(v).length > 24 ? v : '');
for (const raw of (pack && pack.modules) || []) {
const id = typeof raw === 'string' ? raw : raw && raw.id;
if (!id) continue;
const e = byId.get(id); const _og = (e && e.manifest) || {}; const _oe = meta[id] || {};
const _o5 = (defs || []).find((x) => (x.modules || []).includes(id));
_oj.push({ id, title: _og.title || _oe.title || id, screen: _og.screen || _oe.screen || 'home', desc: _og.desc || _oe.desc || '', help: helpText(_og.help || _oe.help),
packId: _o5 ? _o5.id : '', packTitle: _o5 ? _o5.title : '', avail: availOf(id, e) });
}
for (const e of entries || []) {
if (!e || !e.id || e.id === 'settings' || _oj.some((x) => x.id === e.id)) continue;
const _og = e.manifest || {};
_oj.push({ id: e.id, core: true, title: _og.title || e.id, screen: _og.screen || 'settings', desc: _og.desc || '', help: helpText(_og.help), packId: 'core', packTitle: '', avail: availOf(e.id, e) });
}
return _oj;
}
export const KB_STOP = ['o dau', 'nam o dau', 'nam o', 'la gi', 'de lam gi', 'dung the nao', 'dung sao', 'nhu the nao', 'the nao', 'lam sao de', 'lam sao', 'lam the nao',
'huong dan', 'cach dung', 'cach', 'chuc nang', 'tinh nang', 'muc', 'man', 'nut', 'phan', 'cai', 'cho', 'giup', 'minh', 'toi', 'em', 'anh', 'chi', 'oi', 'a', 'nhe',
'voi', 've', 'cua', 'co', 'khong', 'nao', 'duoc', 'de', 'muon', 'can', 'tim', 'dau', 'gi', 'sao', 'app', 'trong', 'thi'];
const _o0 = /^(lam sao|lam the nao|cach|huong dan|chi (em|anh|toi|minh|chi) cach)( de| ma)?( |$)|lam sao de |lam the nao de /;
const _o1 = /(^| )(o dau|la gi|nam o|dung the nao|dung sao|de lam gi|chuc nang|tinh nang)( |$)/;
export function kbQuery(text, stop = []) {
const raw = norm(text);
const list = [...new Set([...KB_STOP, ...stop.map(norm)])].sort((a, b) => b.length - a.length);
let q = ' ' + raw + ' ';
for (const _ow of list) q = q.replace(new RegExp(' ' + esc(_ow) + '(?= )', 'g'), ' ');
q = q.replace(/\s+/g, ' ').trim();
return { raw, q, tokens: q ? q.split(' ') : [], howto: _o0.test(raw), question: _o1.test(raw) };
}
export function kbScore(e, Q) {
let _om = 0;
for (const _ob of e._k) {
if (_ob === Q.q || _ob === Q.raw) return 100;
if (_ob.length >= 3 && _o8(Q.raw, _ob)) _om = Math.max(_om, Math.min(95, 50 + 5 * _ob.split(' ').length));
else if (Q.q.length >= 3 && _o8(_ob, Q.q)) _om = Math.max(_om, 45);
}
if (Q.tokens.length) {
const _o9 = Q.tokens.filter((tk) => e._w.has(tk)).length;
if (_o9 === Q.tokens.length) _om = Math.max(_om, 55);
else if (_o9) _om = Math.max(_om, Math.round(30 * _o9 / Q.tokens.length));
}
return _om;
}
export function searchKb(text, kb, { stop = [], limit = KB_LIMITS.hits, min = 20, skipDevice = false } = {}) {
const Q = typeof text === 'object' && text && 'raw' in text ? text : kbQuery(text, stop);
if (!Q.raw) return [];
const _ol = { action: 3, module: 2, setting: 1, screen: 0 };
const _oj = [];
for (const e of (kb && kb.entries) || kb || []) { if (skipDevice && e.avail === 'device') continue; const _on = kbScore(e, Q); if (_on >= min) _oj.push({ entry: e, score: _on }); }
return _oj.sort((a, b) => b.score - a.score || (_ol[b.entry.kind] || 0) - (_ol[a.entry.kind] || 0) || a.entry.title.localeCompare(b.entry.title, 'vi')).slice(0, limit);
}
export function kbRoute(text, kb, { stop = [] } = {}) {
const Q = kbQuery(text, stop);
if (!Q.raw) return null;
const hits = searchKb(Q, kb, { stop });
if (!hits.length) return null;
const [a, b] = hits;
const _oi = Q.tokens.length;
const _o2 = Q.howto || Q.question;
const instant = (a.score >= KB_LIMITS.instant && (_oi <= KB_LIMITS.shortWords || _o2)) || (a.score >= KB_LIMITS.medium && (_o2 || _oi <= 2));
if (!instant) return null;
const ambiguous = !!b && b.score > a.score - 5 && !(a.score === 100 && b.score < 100);
return { intent: 'kb', entry: a.entry, hits, alts: hits.slice(1, 1 + KB_LIMITS.alt), ambiguous, howto: Q.howto, query: Q.q || Q.raw };
}
export function kbFeatures(kb, screenLabel = (_om) => _om) {
const ok = []; const off = [];
for (const e of (kb && kb.entries) || []) {
if (e.kind === 'screen' || e.kind === 'removed') continue;
const f = { id: e.id, title: e.title, screen: e.screen, screenLabel: screenLabel(e.screen), path: e.path, desc: _or(e.does, KB_LIMITS.mapDesc), where: e.where };
if (e.avail === 'ok') ok.push(f); else if (e.avail === 'pack') off.push({ ...f, pack: e.packTitle });
}
return { ok, off };
}
export function kbLine(e) {
return ['- ' + e.title + ' (mã ' + e.id + ')', 'ở: ' + e.where, e.does && 'làm gì: ' + _or(e.does, KB_LIMITS.ragText), e.input && 'vào: ' + _or(e.input, 200),
e.output && 'ra: ' + _or(e.output, 200), e.cond && 'điều kiện: ' + _or(e.cond, 200), e.avail === 'pack' ? 'CHƯA CÀI gói "' + e.packTitle + '"' : '',
e.avail === 'perm' ? 'tài khoản này chưa có quyền' : '', e.avail === 'device' ? 'CHỈ DÙNG TRÊN MÁY TÍNH (Windows/Mac) – máy đang dùng là điện thoại/máy tính bảng, không mở được ở đây' : ''].filter(Boolean).join(' | ');
}
export const MO_RE = /\[\[\s*mo\s*:\s*([a-z0-9_/.-]+)\s*\]\]/gi;
export function parseMo(text, kb) {
const parts = []; const refs = [];
const _om = String(text == null ? '' : text);
let _oc = 0;
for (const _od of _om.matchAll(MO_RE)) {
if (_od.index > _oc) parts.push(_om.slice(_oc, _od.index));
const e = kbGet(kb, _od[1]);
if (e) { parts.push({ ref: e.id, entry: e }); if (!refs.includes(e)) refs.push(e); }
_oc = _od.index + _od[0].length;
}
if (_oc < _om.length) parts.push(_om.slice(_oc));
return { parts, refs };
}
export function moPlain(text, kb) {
const { parts } = parseMo(text, kb);
let _oj = '';
for (const _ok of parts) {
if (typeof _ok === 'string') { _oj += _ok; continue; }
const _ou = fold(_oj.slice(-80));
_oj += _ou.includes(fold(_ok.entry.title)) ? '' : '"' + _ok.entry.title + '"';
}
return _oj.replace(/[ \t]+\n/g, '\n').replace(/[ \t]{2,}/g, ' ').replace(/\(\s*\)/g, '').trim();
}
export function kbGet(kb, key) {
const _ob = String(key || '').trim().replace(/^#?\/?/, '');
if (!_ob || !kb) return null;
const list = kb.entries || [];
return (kb.byId && kb.byId.get(_ob)) || list.find((e) => e.path === _ob) || null;
}
export default { SETTINGS_SECTIONS, buildKb, validateKb, kbQuery, kbScore, searchKb, kbRoute, kbFeatures, kbLine, parseMo, moPlain, kbGet, parseKbLines, parseKbSteps, splitPath };

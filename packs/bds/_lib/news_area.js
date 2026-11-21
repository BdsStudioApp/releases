import { norm, canonUrl, DEFAULT_FEEDS, MORE_FEEDS } from './ideas.js';
import { AREAS, projectsIn } from './market.js';
import { PROVINCES, provinceOf, localsOf } from './vn_places.js';
export const ALL = 'all';
export const LS_AREAS = 'bds.news.areas';
export const MAX_ITEMS = 60;
const has = (_od, kw) => !!kw && (' ' + _od + ' ').includes(' ' + kw + ' ');
export const areaList = custom => (custom && custom.id ? [...AREAS, custom] : [...AREAS]);
export function readSel(raw, { custom = null } = {}) {
let _om = null;
try { _om = JSON.parse(raw || 'null'); } catch { _om = null; }
if (!Array.isArray(_om)) return [ALL];
if (_om.includes(ALL)) return [ALL];
const _oe = new Set(areaList(custom).map(a => a.id));
const out = [...new Set(_om.filter(id => typeof id === 'string' && _oe.has(id)))];
return out.length ? out : [ALL];
}
export function toggleSel(sel, id) {
if (id === ALL) return [ALL];
const cur = (sel || []).filter(_on => _on !== ALL);
const next = cur.includes(id) ? cur.filter(_on => _on !== id) : [...cur, id];
return next.length ? next : [ALL];
}
export function areaKeywords(area, projects = []) {
const kw = [...(area.kw || area.keywords || [])].map(norm);
if (!area.custom) for (const _of of projectsIn(area, projects || [])) if (_of.name) kw.push(norm(_of.name));
return [...new Set(kw.filter(Boolean))];
}
export function matchAreas(text, areas, projects = []) {
const _od = norm(text);
return (areas || []).filter(a => areaKeywords(a, projects).some(k => has(_od, k))).map(a => a.label);
}
const _o1 = new Set([...DEFAULT_FEEDS, ...MORE_FEEDS].filter(_o8 => _o8.tag === 'bds').map(_o8 => _o8.url));
const _o2 = ['bat dong san', 'bds', 'nha dat', 'dia oc', 'can ho', 'chung cu', 'dat nen', 'nha o', 'nha pho', 'biet thu', 'du an',
'khu do thi', 'quy hoach', 'ha tang', 'gia dat', 'bang gia dat', 'tien su dung dat', 'so do', 'so hong', 'giay chung nhan', 'luat dat dai',
'chu dau tu', 'mo ban', 'ban giao', 'nha o xa hoi', 'khu cong nghiep', 'cho thue', 'vanh dai', 'cao toc', 'metro', 'duong sat do thi',
'khoi cong', 'thong xe', 'giai phong mat bang', 'thu hoi dat', 'dau gia dat', 'mua nha', 'vay mua nha'];
export function isBds(item) {
if (item && _o1.has(String(item.feed || ''))) return true;
const _od = norm([item && item.title, item && item.summary].join(' '));
return _o2.some(k => has(_od, k));
}
export function safeHref(_ol) {
const s = String(_ol ?? '').trim();
if (!/^https?:\/\//i.test(s)) return '';
try { const _on = new URL(s); return /^https?:$/.test(_on.protocol) && _on.hostname ? s : ''; } catch { return ''; }
}
const _o3 = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', hellip: '…', ndash: '–', mdash: '—' };
export function cleanSummary(s) {
return String(s ?? '')
.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
.replace(/<[^>]*>/g, ' ')
.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, e) => {
if (e[0] === '#') { const _o5 = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return _o5 > 0 && _o5 < 0x110000 ? String.fromCodePoint(_o5) : ' '; }
return _o3[e.toLowerCase()] ?? m;
})
.replace(/\s+/g, ' ').trim().slice(0, 400);
}
export function pickNews(items, { sel = [ALL], custom = null, projects = [], max = MAX_ITEMS } = {}) {
const _o4 = !sel || !sel.length || sel.includes(ALL);
const areas = areaList(custom);
const chosen = _o4 ? areas : areas.filter(a => sel.includes(a.id));
const _oi = new Set(); const out = [];
for (const _o9 of Array.isArray(items) ? items : []) {
if (!_o9 || typeof _o9 !== 'object') continue;
const title = String(_o9.title || '').replace(/\s+/g, ' ').trim().slice(0, 300);
const href = safeHref(_o9.link);
if (!title || !href || !isBds(_o9)) continue;
const summary = cleanSummary(_o9.summary);
const _ok = matchAreas(title + ' ' + summary, chosen, projects);
if (!_o4 && !_ok.length) continue;
const _oa = canonUrl(href), k2 = norm(title);
if ((_oa && _oi.has(_oa)) || _oi.has(k2)) continue;
if (_oa) _oi.add(_oa);
_oi.add(k2);
out.push({ title, href, source: String(_o9.source || '').trim().slice(0, 120), published: Number(_o9.published) || 0,
summary: norm(summary) === k2 ? '' : summary, areas: _ok });
}
out.sort((a, b) => (b.published || 0) - (a.published || 0));
return out.slice(0, max);
}
const _og = _od => String(_od).padStart(2, '0');
export function relTime(ms, now = Date.now()) {
const t = Number(ms) || 0;
if (!t) return '';
const _o7 = Math.max(0, now - t);
if (_o7 < 60e3) return 'vừa xong';
if (_o7 < 3600e3) return Math.floor(_o7 / 60e3) + ' phút trước';
if (_o7 < 24 * 3600e3) return Math.floor(_o7 / 3600e3) + ' giờ trước';
if (_o7 < 48 * 3600e3) return 'hôm qua';
if (_o7 < 7 * 24 * 3600e3) return Math.floor(_o7 / (24 * 3600e3)) + ' ngày trước';
const _on = new Date(t);
return _og(_on.getDate()) + '/' + _og(_on.getMonth() + 1) + '/' + _on.getFullYear();
}
export function errorInfo(e) {
if (e && e.allFailed) return { old: false, text: 'Các nguồn tin chưa trả lời – thử lại sau ít phút.' };
const code = String((e && e.code) || '');
const _oc = String((e && (e.userMessage || e.message)) || '');
if (code === 'UNKNOWN_ACTION' || code === 'NOT_FOUND' || (e && e.missingAction) || /không được hỗ trợ|not supported|unknown action/i.test(_oc)) {
return { old: true, text: 'Máy chủ chưa có chức năng lấy tin (news.fetch) – Chủ app cập nhật máy chủ ở Cài đặt › Phiên bản rồi bấm Thử lại.' };
}
if (code === 'FORBIDDEN' || code === 'NO_PERMISSION' || /quyền/i.test(_oc)) {
return { old: false, text: 'Tài khoản này chưa được lấy tin qua máy chủ – nhờ Chủ app hoặc Quản lý lấy tin.' };
}
return { old: false, text: 'Chưa lấy được tin: ' + (_oc.replace(/\.$/, '') || 'mạng chậm hoặc mất kết nối') + '.' };
}
export function videoHash(link) {
const _ol = safeHref(link);
return _ol ? '#/content/ideas?' + new URLSearchParams({ tab: 'video', from: 'hot', input: _ol }).toString() : '';
}
export const LS_PLACE = 'bds.news.place';
export const NATION = '';
export const DEFAULT_PLACE = { tinh: 'Hà Nội', khu: '', q: '' };
const _o0 = /^(thanh pho|tp|tinh|quan|huyen|thi xa|thi tran|phuong|xa|khu do thi|kdt)\s+/;
const _o6 = (_om, _od) => String(_om ?? '').replace(/\s+/g, ' ').trim().slice(0, _od);
export function readPlace(raw) {
let _om = null;
try { _om = JSON.parse(raw || 'null'); } catch { _om = null; }
if (!_om || typeof _om !== 'object') return { ...DEFAULT_PLACE };
const tinh = _om.tinh === NATION ? NATION : (provinceOf(_om.tinh) || {}).label;
if (tinh === undefined) return { ...DEFAULT_PLACE };
const khu = tinh && localsOf(tinh).some(_on => _on.label === _om.khu) ? _om.khu : '';
return { tinh, khu, q: _o6(_om.q, 60) };
}
export function provinceOptions() {
const first = ['Hà Nội', 'TP Hồ Chí Minh'];
return [{ value: NATION, label: 'Cả nước' }, ...first.map(_on => ({ value: _on, label: _on })),
...PROVINCES.filter(_of => !first.includes(_of.label)).map(_of => ({ value: _of.label, label: _of.label }))];
}
const _ob = s => { const _od = norm(s); const _oj = _od.replace(_o0, ''); return [...new Set([_od, _oj].filter(_on => _on && _on.length >= 2))]; };
export function placeFilter(place) {
const _oh = place || DEFAULT_PLACE;
const q = _o6(_oh.q, 60);
if (q) return { label: q, groups: [{ label: q, kw: _ob(q) }] };
if (_oh.khu) return { label: _oh.khu, groups: [{ label: _oh.khu, kw: _ob(_oh.khu) }] };
const _of = provinceOf(_oh.tinh);
if (!_of) return { label: 'Cả nước', groups: [] };
const groups = [{ label: _of.label, kw: [...new Set([_of.label, ...(_of.alias || [])].flatMap(_ob))] },
...localsOf(_of.label).map(_on => ({ label: _on.label, kw: _ob(_on.label) }))];
return { label: _of.label, groups };
}
export function pickNewsByPlace(items, place, { max = MAX_ITEMS } = {}) {
const _o8 = placeFilter(place);
const _oi = new Set(); const out = [];
for (const _o9 of Array.isArray(items) ? items : []) {
if (!_o9 || typeof _o9 !== 'object') continue;
const title = String(_o9.title || '').replace(/\s+/g, ' ').trim().slice(0, 300);
const href = safeHref(_o9.link);
if (!title || !href || !isBds(_o9)) continue;
const summary = cleanSummary(_o9.summary);
const _od = norm(title + ' ' + summary);
const _ok = _o8.groups.filter(g => g.kw.some(k => has(_od, k))).map(g => g.label).slice(0, 2);
if (_o8.groups.length && !_ok.length) continue;
const _oa = canonUrl(href), k2 = norm(title);
if ((_oa && _oi.has(_oa)) || _oi.has(k2)) continue;
if (_oa) _oi.add(_oa);
_oi.add(k2);
out.push({ title, href, source: String(_o9.source || '').trim().slice(0, 120), published: Number(_o9.published) || 0,
summary: norm(summary) === k2 ? '' : summary, areas: _ok });
}
out.sort((a, b) => (b.published || 0) - (a.published || 0));
return out.slice(0, max);
}

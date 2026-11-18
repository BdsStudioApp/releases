import { freshPrompt, freshStamp, safeUrl } from './fresh.js';
import { h } from './kit.js';
export const NEWS_KEY = 'fresh.news';
export const NEWS_MAX = 12;
export const NEWS_SHAPE = '{"items":[{"title":"tiêu đề tin","summary":"tóm tắt 1–2 câu","source_name":"tên báo","source_url":"https://… (link bài gốc)","date":"YYYY-MM-DD (ngày đăng)"}]}';
const _o0 = 45000;
export const DEFAULT_MARKET = 'Việt Nam';
export function newsWhere({ area, province, projects } = {}) {
const _oa = String(province || '').trim();
const _o9 = projects && projects.length ? ', các dự án ' + projects.slice(0, 8).join(', ') : '';
if (area) return `liên quan khu vực ${area}${_oa ? ' (' + _oa + ')' : ''}${_o9}`;
return _oa ? `tại ${_oa}${_o9}` : `tại ${DEFAULT_MARKET}${_o9}`;
}
export function newsPrompt({ now, area, province, projects, max = NEWS_MAX } = {}) {
const _of = newsWhere({ area, province, projects });
const ask = `Tìm ${Math.min(max, 12)} TIN THỊ TRƯỜNG BẤT ĐỘNG SẢN MỚI NHẤT (ưu tiên 7 ngày gần đây) ${_of}: chính sách – pháp luật đất đai, ` +
'tín dụng/lãi suất mua nhà, hạ tầng – quy hoạch, nguồn cung – giá bán, dự án mới. Mỗi tin: tiêu đề, tóm tắt 1–2 câu (giữ nguyên chữ "đề xuất/dự kiến/dự thảo" nếu bài ghi vậy), ' +
'tên báo, link bài gốc, ngày đăng. Không lặp một sự kiện ở nhiều tin.';
return freshPrompt('news', { ask, shape: NEWS_SHAPE, now });
}
export function chatPrompt(prompt) { return String(prompt || '').split('\n').filter((l) => !/^BDS_AI_FRESH\b/.test(l)).join('\n'); }
const _o3 = (s, n) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim().slice(0, n);
export function hostOf(url) { const _o6 = /^https?:\/\/([^/?#]+)/i.exec(String(url || '')); return _o6 ? _o6[1].toLowerCase().replace(/^www\./, '') : ''; }
export function isoDay(s) {
const _o6 = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || '').trim());
if (!_o6) return '';
const _o4 = new Date(Date.UTC(+_o6[1], +_o6[2] - 1, +_o6[3]));
return _o4.getUTCFullYear() === +_o6[1] && _o4.getUTCMonth() === +_o6[2] - 1 && _o4.getUTCDate() === +_o6[3] ? _o6[0] : '';
}
export function newsDate(s) { const _o4 = isoDay(s); return _o4 ? _o4.slice(8, 10) + '/' + _o4.slice(5, 7) + '/' + _o4.slice(0, 4) : ''; }
export function normalizeNews(parsed, { max = NEWS_MAX } = {}) {
const list = Array.isArray(parsed) ? parsed : (parsed && Array.isArray(parsed.items) ? parsed.items : []);
const _oc = new Set(); const _o8 = [];
for (const _og of list) {
if (!_og || typeof _og !== 'object') continue;
const title = _o3(_og.title, 200);
if (!title) continue;
const url = safeUrl(_og.source_url || _og.url || _og.link);
const _o5 = (url || title).toLowerCase();
if (_oc.has(_o5)) continue;
_oc.add(_o5);
_o8.push({ title, summary: _o3(_og.summary, 400), source_name: _o3(_og.source_name || _og.source, 80) || hostOf(url), source_url: url, date: isoDay(_og.date || _og.published) });
}
_o8.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
return _o8.slice(0, max);
}
export function distinctHosts(items) { return new Set((items || []).map((i) => hostOf(i.source_url)).filter(Boolean)).size; }
export function newsRecord(parsed, meta = {}) {
const items = normalizeNews(parsed);
const _o6 = { at: Number(meta.at) || Date.now(), model: _o3(meta.model, 60), reputable: Number(meta.reputable) || 0, distinct: Number(meta.distinct) || 0 };
_o6.stamp = meta.stamp || freshStamp(_o6);
_o6.sources = (meta.sources || []).filter((s) => s && safeUrl(s.url)).slice(0, 20)
.map((s) => ({ domain: _o3(s.domain, 80), url: safeUrl(s.url), title: _o3(s.title, 120), reputable: !!s.reputable }));
const _ob = { v: 1, items, meta: _o6 };
while (JSON.stringify(_ob).length > _o0 && (_ob.meta.sources.length || _ob.items.length > 1)) {
if (_ob.meta.sources.length) _ob.meta.sources = []; else _ob.items = _ob.items.slice(0, -1);
}
return _ob;
}
export function readNews(v) {
let _o7 = v;
if (typeof _o7 === 'string') { try { _o7 = JSON.parse(_o7); } catch { return null; } }
if (!_o7 || typeof _o7 !== 'object' || !Array.isArray(_o7.items)) return null;
const items = normalizeNews(_o7.items, { max: NEWS_MAX });
if (!items.length) return null;
const meta = _o7.meta && typeof _o7.meta === 'object' ? _o7.meta : {};
const at = Number(meta.at) || 0;
return { items, meta: { at, model: _o3(meta.model, 60), reputable: Number(meta.reputable) || 0, distinct: Number(meta.distinct) || 0,
stamp: at ? freshStamp({ at, reputable: Number(meta.reputable) || 0 }) : 'Chỉ mang tính tham khảo',
sources: (Array.isArray(meta.sources) ? meta.sources : []).filter((s) => s && safeUrl(s.url)).slice(0, 20)
.map((s) => ({ domain: _o3(s.domain, 80), url: safeUrl(s.url), title: _o3(s.title, 120), reputable: !!s.reputable })) } };
}
export function canUpdateNews(user) { return !user || !user.role || user.role === 'owner' || user.role === 'manager'; }
const _o1 = ':is([data-testid="brief-news"],[data-testid="market-screen"],[data-testid$="fresh-modal"])';
export const FRESH_CSS = `
${_o1} .sl-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${_o1} .sl-col{display:flex;flex-direction:column;gap:6px}
${_o1} .sl-end{justify-content:flex-end}
${_o1} .sl-muted{color:var(--sl-muted,var(--muted,rgba(127,127,127,.95)));font-size:.9em}
${_o1} .sl-small{font-size:.85em}
${_o1} .sl-chips{display:flex;flex-wrap:wrap;gap:6px}
${_o1} .sl-chip{display:inline-flex;align-items:center;padding:2px 10px;border-radius:999px;border:1px solid rgba(127,127,127,.3);font-size:.85em}
${_o1} .sl-chip.on{border-color:#1E7A4F;color:#1E7A4F}
${_o1} .g1-warn{border-left:4px solid #C9A24A;background:rgba(201,162,74,.10);padding:8px 12px;border-radius:10px;font-size:.92em}
${_o1} .g1-err{border-left:4px solid #B3261E;background:rgba(179,38,30,.07);padding:8px 12px;border-radius:10px;font-size:.92em}
${_o1} .g1-okbox{border-left:4px solid #1E7A4F;background:rgba(30,122,79,.08);padding:8px 12px;border-radius:10px;font-size:.92em}
.bds-news{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.bds-news li{display:flex;flex-direction:column;gap:2px;padding-bottom:10px;border-bottom:1px solid rgba(127,127,127,.18);min-width:0}
.bds-news li:last-child{border-bottom:0;padding-bottom:0}
.bds-news p{margin:0;overflow-wrap:anywhere}
.bds-news small{opacity:.85;overflow-wrap:anywhere}
.bds-news a{color:inherit;text-decoration:underline}
.mk-ai-sel{min-height:44px;padding:8px 10px;border-radius:10px;border:1px solid rgba(127,127,127,.35);background:transparent;color:inherit;font:inherit;max-width:100%;box-sizing:border-box}
.mk-ai-sel option{color:#111;background:#fff}
.mk-ai-lab{display:flex;flex-direction:column;gap:2px;min-width:0}
.mk-ai-lab .mk-ai-sel{width:100%}
.mk-ai{align-items:flex-end}
.mk-news-bar{display:flex;flex-direction:column;gap:4px;min-width:0;max-width:100%}
@media (max-width:599px){.mk-news-bar{flex:1 1 100%}}
`;
let _o2 = false;
export function ensureFreshCss() {
if (_o2 || typeof document === 'undefined') return;
_o2 = true;
try { const _od = new CSSStyleSheet(); _od.replaceSync(FRESH_CSS); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _od]; } catch { }
}
export function newsListView(items, { testid = 'news' } = {}) {
return h('ul', { class: 'bds-news', 'data-testid': testid + '-list' }, (items || []).map((n) => {
const url = safeUrl(n.source_url);
const _oe = n.source_name || hostOf(url) || 'Nguồn';
return h('li', { 'data-testid': testid + '-item' },
h('strong', null, n.title),
n.summary ? h('p', null, n.summary) : null,
h('small', null,
url ? h('a', { href: url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': testid + '-src' }, _oe + ' ↗') : h('span', null, _oe + ' (chưa có link)'),
n.date ? ' · ' + newsDate(n.date) : ''));
}));
}

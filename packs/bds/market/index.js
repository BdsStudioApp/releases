import { kit, h } from '../_lib/kit.js';
import * as I from '../_lib/ideas.js';
import * as T from '../_lib/news_area.js';
import * as P from '../_lib/vn_places.js';
const _od = k => { try { return localStorage.getItem(k); } catch { return null; } };
const _oe = (k, v) => { try { localStorage.setItem(k, v); } catch { } };
const ROW = { display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' };
export async function mount(el, ctx) {
const _o1 = kit(ctx);
let place = T.readPlace(_od(T.LS_PLACE));
const _ol = { raw: null, loading: false, error: null, at: 0, open: new Set() };
const _o2 = 'bds.news.last';
try { const _ob = JSON.parse(_od(_o2) || 'null'); if (_ob && Array.isArray(_ob.items) && Date.now() - Number(_ob.at) < 24 * 3600e3) { _ol.raw = _ob.items; _ol.at = Number(_ob.at); } } catch { }
const _oc = h('div', { 'data-testid': 'tn-result', 'aria-live': 'polite' });
const _ok = () => _oe(T.LS_PLACE, JSON.stringify(place));
const _o0 = { width: '100%', minHeight: '44px', boxSizing: 'border-box' };
const _on = h('select', { 'data-testid': 'tn-tinh', 'aria-label': 'Tỉnh/Thành', style: _o0 },
...T.provinceOptions().map(o => h('option', { value: o.value }, o.label)));
const _o9 = h('select', { 'data-testid': 'tn-khu', 'aria-label': 'Khu vực trong tỉnh', style: _o0 });
const _og = h('input', { type: 'search', 'data-testid': 'tn-q', 'aria-label': 'Tên địa phương', placeholder: 'Hoặc gõ tên địa phương, vd: Thủ Đức, Hội An…', autocomplete: 'off', maxlength: 60, style: _o0 });
const _oa = h('label', { style: { display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 200px', minWidth: 0 } }, h('small', null, 'Khu vực (không bắt buộc)'), _o9);
function _oi() {
const list = P.localsOf(place.tinh);
_o9.replaceChildren(h('option', { value: '' }, 'Toàn ' + (place.tinh || 'quốc')),
...list.map(x => h('option', { value: x.label }, x.label + (x.note ? ' (' + x.note + ')' : ''))));
_o9.value = place.khu || '';
_oa.style.display = list.length ? 'flex' : 'none';
}
function _o4() { _ok(); _oj(); }
_on.addEventListener('change', () => { place = { ...place, tinh: _on.value, khu: '' }; _oi(); _o4(); });
_o9.addEventListener('change', () => { place = { ...place, khu: _o9.value }; _o4(); });
let _oh = 0;
_og.addEventListener('input', () => { clearTimeout(_oh); _oh = setTimeout(() => { place = { ...place, q: _og.value.trim().slice(0, 60) }; _o4(); }, 250); });
_on.value = place.tinh; _og.value = place.q || ''; _oi();
const placeBox = h('div', { 'data-testid': 'tn-place', style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
h('div', { style: { ...ROW, gap: '8px', alignItems: 'flex-end' } },
h('label', { style: { display: 'flex', flexDirection: 'column', gap: '4px', flex: '1 1 200px', minWidth: 0 } }, h('small', null, 'Tỉnh/Thành'), _on),
_oa),
_og);
async function _o7(fresh = false) {
if (_ol.loading) return;
_ol.loading = true; _ol.error = null; _oj();
try {
const v = await _o1.setting('followed_topics', null);
const feeds = I.feedsFrom(v && !Array.isArray(v) ? v : null);
const r = await _o1.api('news.fetch', { feeds, since: Date.now() - 7 * 864e5, fresh: fresh === true });
const items = (r && r.items) || (Array.isArray(r) ? r : []);
if (!items.length && ((r && r.errors) || []).length >= feeds.length) _ol.error = T.errorInfo({ allFailed: true });
else { _ol.raw = items; _ol.at = Date.now(); _ol.open.clear(); _oe(_o2, JSON.stringify({ at: _ol.at, items: items.slice(0, 200) })); }
} catch (e) { _ol.error = T.errorInfo(e); }
finally { _ol.loading = false; _oj(); }
}
const _o6 = _o1.button('📰 Lấy tin', () => _o7(), { kind: 'primary', testid: 'tn-fetch' });
function _o8(n, i) {
const sum = n.summary ? h('p', { class: 'bds-sub', 'data-testid': 'tn-sum', id: 'tn-sum-' + i, hidden: !_ol.open.has(n.href), style: { margin: '4px 0 0', whiteSpace: 'normal' } }, n.summary) : null;
const _om = n.summary ? h('button', { type: 'button', class: 'bds-chip', 'data-testid': 'tn-sum-btn', 'aria-expanded': String(_ol.open.has(n.href)), 'aria-controls': 'tn-sum-' + i,
onclick: () => { const open = !_ol.open.has(n.href); if (open) _ol.open.add(n.href); else _ol.open.delete(n.href); sum.hidden = !open; _om.setAttribute('aria-expanded', String(open)); _om.textContent = open ? 'Ẩn tóm tắt' : 'Tóm tắt'; } },
_ol.open.has(n.href) ? 'Ẩn tóm tắt' : 'Tóm tắt') : null;
const _oo = T.relTime(n.published, Date.now());
return h('li', { 'data-testid': 'tn-item', style: { padding: '10px 0', borderBottom: '1px solid var(--line, rgba(127,127,127,.25))', minWidth: 0 } },
h('a', { href: n.href, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'tn-link', style: { fontWeight: '600', overflowWrap: 'anywhere', display: 'block' } }, n.title),
sum,
h('div', { style: { ...ROW, marginTop: '4px' } },
h('small', { class: 'bds-muted', 'data-testid': 'tn-meta' }, [n.source, _oo].filter(Boolean).join(' · ')),
...n.areas.map(a => h('span', { class: 'bds-badge', 'data-testid': 'tn-tag', style: { fontSize: '12px' } }, a)),
_om));
}
function _oj() {
_o6.disabled = _ol.loading;
const _o3 = _ol.loading ? h('p', { class: 'bds-muted', 'data-testid': 'tn-loading', role: 'status', style: { margin: '0 0 6px' } }, _ol.raw ? 'Đang cập nhật tin mới…' : 'Đang lấy tin mới…') : null;
if (_ol.loading && !_ol.raw) { _oc.replaceChildren(_o3); return; }
const _o5 = _ol.error ? h('div', { class: 'ix-help', role: 'alert', 'data-testid': 'tn-error', style: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' } },
h('span', null, _ol.error.text), h('div', null, _o1.button('Thử lại', () => _o7(), { kind: 'primary', testid: 'tn-retry' }))) : null;
if (_o5 && !_ol.raw) { _oc.replaceChildren(_o5); return; }
if (_ol.raw === null) { _oc.replaceChildren(h('div', { 'data-testid': 'tn-hint' }, _o1.empty('Chọn địa phương rồi bấm "📰 Lấy tin" – app lấy tin bất động sản mới từ các báo uy tín, bấm tiêu đề là đọc bài gốc.'))); return; }
const _of = T.pickNewsByPlace(_ol.raw, place);
const head = h('div', { style: { ...ROW, justifyContent: 'space-between' } },
h('small', { class: 'bds-muted', 'data-testid': 'tn-count' }, _of.length + ' tin · lấy lúc ' + new Date(_ol.at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })),
_o1.button('↻ Làm mới', () => _o7(true), { testid: 'tn-refresh' }));
_oc.replaceChildren(...[_o3, _o5].filter(Boolean), head, _of.length
? h('ul', { 'data-testid': 'tn-list', style: { listStyle: 'none', padding: 0, margin: 0 } }, _of.map(_o8))
: h('div', { 'data-testid': 'tn-empty' }, _o1.empty('Chưa có tin mới cho ' + T.placeFilter(place).label + '. Thử chọn "Cả nước", tỉnh khác hoặc bấm Làm mới sau.')));
}
el.innerHTML = '';
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'market-screen' },
h('div', { class: 'bds-head' }, h('h2', null, 'Lấy tin Bất động sản mới')),
h('p', { class: 'bds-muted', style: { margin: '0 0 8px' } }, 'Tin 7 ngày từ các báo uy tín (VnExpress, Tuổi Trẻ, CafeF…), lọc theo địa phương anh/chị chọn. Không dùng AI.'),
_o1.card({ title: 'Địa phương', testid: 'tn-area-card', body: h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }, placeBox, h('div', null, _o6)) }),
_o1.card({ title: 'Tin mới', testid: 'tn-news-card', body: _oc }),
));
_oj();
if (_ol.raw && Date.now() - _ol.at > 10 * 60e3) _o7();
}
export default {
manifest: {
id: 'market', title: 'Lấy tin Bất động sản mới', icon: '📰', screen: 'home', order: 20, version: '2.0.0', status: 'ready', requires: 'video',
help: 'Lấy tin bất động sản mới từ các báo uy tín theo địa phương (chọn Tỉnh/Thành, khu vực trong tỉnh, hoặc gõ tên địa phương; có "Cả nước"): danh sách tiêu đề mới nhất trước, bấm là mở bài gốc; "Tóm tắt" xem nhanh mô tả. Không dùng AI.',
},
mount,
async selftest() {
const details = [];
try {
const r = T.pickNewsByPlace([{ title: 'Giá căn hộ Gia Lâm', link: 'https://vnexpress.net/x.html', published: 1 }, { title: 'Nhà đất', link: 'javascript:x' }, { title: 'Căn hộ Thủ Đức', link: 'https://vnexpress.net/y.html' }], { tinh: 'Hà Nội', khu: '', q: '' });
if (r.length !== 1 || r[0].href !== 'https://vnexpress.net/x.html') details.push('Lọc tin theo địa phương sai');
} catch (e) { details.push(e.message); }
return { ok: !details.length, details };
},
};

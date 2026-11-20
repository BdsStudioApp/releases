import { kit, h } from '../_lib/kit.js';
import * as V from '../_lib/video.js';
import * as I from '../_lib/ideas.js';
import * as M from '../_lib/market.js';
import { openFresh, parseFreshJson } from '../_lib/fresh.js';
import * as N from '../_lib/freshnews.js';
import * as P from '../_lib/vn_places.js';
const _o0 = 'bds-ideas-css';
function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
document.head.appendChild(h('link', { id: _o0, rel: 'stylesheet', href: new URL('../ideas/ideas.css', import.meta.url).href }));
}
const _o2 = 'bds.market.area';
const _ov = k => { try { return localStorage.getItem(k); } catch { return null; } };
const _ow = (k, v) => { try { localStorage.setItem(k, v); } catch { } };
const aiOff = () => typeof document !== 'undefined' && document.documentElement.dataset.ai === 'off';
export async function mount(el, ctx) {
ensureCss(); N.ensureFreshCss();
const _o1 = kit(ctx);
const noVideo = () => !!(ctx.video && ctx.video.hidden());
const _o13 = () => !!(ctx.video && (typeof ctx.video.engineOff === 'function' ? ctx.video.engineOff() : ctx.video.hidden()));
let custom = (() => { try { return M.customArea(JSON.parse(_ov(M.LS_CUSTOM_AREA) || 'null')); } catch { return null; } })();
let area = _ov(_o2) || M.AREAS[0].id;
if (area.startsWith(M.CUSTOM_PREFIX) && !(custom && custom.id === area)) area = M.AREAS[0].id;
const _oh = () => (custom && area === custom.id ? custom : M.areaOf(area));
const _o1p = { feedItems: [], report: null, g: null, provider: '', busy: false, placeOpen: false, aiPlaces: null };
el.innerHTML = '';
const areaBox = h('div', { class: 'mk-areas', role: 'tablist', 'data-testid': 'mk-areas' });
const otherBox = h('div', { 'data-testid': 'mk-areas-other', style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } });
const placeBox = h('div', { class: 'ix-help', 'data-testid': 'mk-place', style: { display: 'none', flexDirection: 'column', gap: '8px' } });
const statBox = h('div', { 'data-testid': 'mk-stats' });
const _o1j = h('div', { 'data-testid': 'mk-report' });
const _oo = h('div', { 'data-testid': 'mk-history' });
const noteBox = h('p', { class: 'ix-status', 'data-testid': 'mk-note' });
async function gather() {
const [ideas, policies, customers, jobs] = await Promise.all([_o1.list('ideas'), _o1.list('policies'), _o1.list('objects'), _o1.list('jobs')]);
return M.gather({ area: _oh(), ideas, policies, customers, jobs, projects: _o1.projects(), feedItems: _o1p.feedItems, now: Date.now() });
}
const _oc = (id, label, testid, onclick) => h('button', { type: 'button', role: 'tab', 'aria-selected': String(id === area), class: 'bds-chip' + (id === area ? ' bds-on' : ''), 'data-testid': testid, onclick }, label);
const _o17 = (id) => { area = id; _ow(_o2, area); _o1p.report = null; render(); };
function _o1e() {
areaBox.innerHTML = '';
for (const _o3 of M.AREAS) areaBox.appendChild(_oc(_o3.id, _o3.label, 'mk-area-' + _o3.id, () => _o17(_o3.id)));
otherBox.innerHTML = '';
if (custom) otherBox.appendChild(_oc(custom.id, '📍 ' + custom.label, 'mk-area-custom', () => _o17(custom.id)));
otherBox.appendChild(h('button', { type: 'button', class: 'bds-chip' + (_o1p.placeOpen ? ' bds-on' : ''), 'aria-expanded': String(_o1p.placeOpen), 'data-testid': 'mk-area-other',
onclick: () => { _o1p.placeOpen = !_o1p.placeOpen; _o1e(); _o1g(); if (_o1p.placeOpen) placeQ.focus(); } }, '＋ Khu vực khác'));
}
const placeQ = h('input', { type: 'search', 'data-testid': 'mk-place-q', 'aria-label': 'Tên địa phương', placeholder: 'Gõ tên địa phương, vd: Thủ Đức, Hội An…', autocomplete: 'off', style: { width: '100%', minHeight: '44px', boxSizing: 'border-box' } });
const placeList = h('div', { 'data-testid': 'mk-place-list', style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } });
const _o1a = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } });
placeBox.append(h('small', null, 'Chọn địa phương ngoài danh sách dự án – app lọc tin theo tên địa phương (không dấu), không gắn dự án.'), placeQ, placeList, _o1a);
placeQ.addEventListener('input', () => { _o1p.aiPlaces = null; _o1g(); });
function _of(p) {
const _o3 = M.customArea(p);
if (!_o3) return;
custom = _o3; _ow(M.LS_CUSTOM_AREA, JSON.stringify({ label: _o3.label, tinh_thanh: _o3.tinh_thanh }));
_o1p.placeOpen = false; _o1p.aiPlaces = null; placeQ.value = '';
_o1g(); _o17(_o3.id);
_o1.toast('Đã chọn khu vực: ' + _o3.label, 'success');
}
const _o18 = (p, testid) => h('button', { type: 'button', class: 'bds-chip', 'data-testid': testid, title: p.ghi_chu || '', onclick: () => _of(p) },
p.label + (p.tinh_thanh && p.tinh_thanh !== p.label ? ' · ' + p.tinh_thanh : ''));
function _o1g() {
placeBox.style.display = _o1p.placeOpen ? 'flex' : 'none';
const _o1c = placeQ.value.trim();
const _ou = _o1c ? P.suggestPlaces(_o1c) : [];
placeList.replaceChildren(...(_o1p.aiPlaces || _ou).map(p => _o18(p, _o1p.aiPlaces ? 'mk-place-ai-opt' : 'mk-place-opt')));
_o1a.replaceChildren();
if (!_o1c) return;
if (_o1p.aiPlaces) {
_o1a.append(h('small', { class: 'bds-muted', 'data-testid': 'mk-place-ai-note' }, _o1p.aiPlaces.length ? 'AI gợi ý – anh/chị kiểm lại tên trước khi chọn.' : 'AI chưa gợi ý được tên nào.'));
} else if (!_ou.length) {
_o1a.append(h('small', { 'data-testid': 'mk-place-none' }, 'Không thấy "' + _o1c + '" trong danh bạ có sẵn.'),
h('div', { class: 'mk-ai' }, _ot('AI gợi ý bằng', _o1b), _o8), _o19);
}
_o1a.append(h('div', null, _o1.button('Dùng đúng tên "' + _o1c.slice(0, 40) + '"', () => _of({ label: _o1c, tinh_thanh: '' }), { testid: 'mk-place-use' })));
}
async function _o9() {
const _o1c = placeQ.value.trim();
if (!_o1c || _o1p.busy) return;
const _od = _o1b.value;
const prompt = M.placePrompt(_o1c);
let text = null;
if (_od === 'handoff_claude' || _od === 'handoff_gemini') {
const target = _od === 'handoff_claude' ? 'claude' : 'gemini';
try {
if (ctx.ai && typeof ctx.ai.handoff === 'function') text = await ctx.ai.handoff('summarize', prompt, { target });
else { await _o1.copy(prompt); window.open(target === 'claude' ? 'https://claude.ai/new' : 'https://gemini.google.com/app', '_blank', 'noopener'); _o1.toast('Đã chép lời nhắn – dán vào ' + (target === 'claude' ? 'Claude' : 'Gemini'), 'info'); return; }
} catch { text = null; }
if (!text) return;
} else {
if (!ctx.ai || typeof ctx.ai.run !== 'function') { _o1.toast('Chưa bật AI tự động – chọn "Claude qua chat" (0 đồng)', 'info'); return; }
if (_od === 'claude_api') {
if (!_o1q) { _o1.toast('Chỉ Chủ/Quản lý dùng được AI trả phí – chọn "qua chat" (0 đồng)', 'warn'); return; }
const e = M.claudeEstimate(prompt);
const ok = await _o1.confirm({ title: 'Claude API – báo phí trước', testid: 'mk-place-cost', ok: 'Hỏi (có phí)',
text: `Mất phí AI: ước tính ≈ ${e.usd.toLocaleString('vi-VN', { maximumFractionDigits: 4 })} USD cho lần hỏi này, tính vào ngân sách AI tháng của Chủ. Muốn 0 đồng: chọn "Claude qua chat".` });
if (!ok) return;
}
_o1p.busy = true; _o8.disabled = true;
try { const _o1d = await ctx.ai.run('summarize', { prompt, json: true, provider: _od, feature: 'market_report' }); text = (_o1d && (_o1d.text ?? _o1d)) || ''; }
catch (e) { if (_o1.isAiCancel(e)) return; _o1.toast(((e && e.message) || 'AI chưa trả lời') + ' – thử "qua chat" hoặc gõ tên khác', 'warn'); return; }
finally { _o1p.busy = false; _o8.disabled = false; }
}
_o1p.aiPlaces = M.parsePlaceSuggestions(text);
if (!_o1p.aiPlaces.length) _o1.toast('AI chưa trả về gợi ý đúng định dạng JSON', 'warn');
_o1g();
}
async function render() {
_o1e();
_o1p.g = await gather();
const g = _o1p.g;
statBox.replaceChildren(
h('p', { 'data-testid': 'mk-summary', style: { margin: '0 0 4px', fontWeight: '600' } }, M.dataSummary(g)),
h('small', { class: 'bds-muted', 'data-testid': 'mk-demand-note' }, M.DEMAND_NOTE));
noteBox.textContent = `${g.week.label} · ` + (g.custom ? `Khu vực tự chọn "${g.area_label}"${g.province && g.province !== g.area_label ? ' (' + g.province + ')' : ''}: lọc tin theo tên địa phương, không gắn dự án`
: g.projects.length ? `${g.projects.length} dự án: ${g.projects.slice(0, 3).join(', ')}${g.projects.length > 3 ? '…' : ''}` : 'chưa có dự án trong bảng hàng') + '.';
noteBox.title = g.projects.join(', ');
_o1h();
await _o1f();
}
async function _on(report, provider) {
_o1p.report = report; _o1p.provider = provider;
await _o1.put('jobs', M.jobRow(report, _o1p.g, { provider }));
_o1h(); await _o1f();
}
async function _o1v(_od = _o7.value) {
if (_o1p.busy) return;
if (_od === 'app') { _o1p.g = await gather(); await _on(M.fallbackReport(_o1p.g), 'app'); _o1.toast('Đã viết bản tin nhanh từ dữ liệu app', 'success'); return; }
if (_od === 'handoff_claude' || _od === 'handoff_gemini') return _o1m(_od === 'handoff_claude' ? 'claude' : 'gemini');
return _o1k(_od);
}
async function _o1k(provider) {
_o1p.g = await gather();
if (!ctx.ai || typeof ctx.ai.run !== 'function') { await _on(M.fallbackReport(_o1p.g), 'app'); _o1.toast('Chưa bật AI – bản tin lấy từ dữ liệu app', 'info'); return; }
const prompt = M.buildPrompt(_o1p.g, { channel: V.channelFrom(ctx.config, ctx.settings) });
if (provider === 'claude_api') {
const e = M.claudeEstimate(prompt);
const ok = await _o1.confirm({ title: 'Claude API – báo phí trước', testid: 'mk-claude-cost', ok: 'Viết (có phí)',
text: `Mất phí AI: ước tính ≈ ${e.usd.toLocaleString('vi-VN', { maximumFractionDigits: 4 })} USD cho lần viết này (~${e.tokens_in.toLocaleString('vi-VN')} token vào, ~${e.tokens_out.toLocaleString('vi-VN')} token ra), tính vào ngân sách AI tháng của Chủ. Muốn 0 đồng: chọn "Claude qua chat".` });
if (!ok) return;
}
const name = M.PROVIDER_NAME[provider] || provider;
_o1p.busy = true; _o1l.disabled = true;
_o1j.innerHTML = ''; _o1j.appendChild(h('p', { class: 'bds-muted', 'data-testid': 'mk-busy' }, name + ' đang viết bản tin…'));
try {
const _o1d = await ctx.ai.run('summarize', { prompt, json: true, provider, feature: 'market_report' });
const _o1i = M.parseReport((_o1d && (_o1d.text ?? _o1d)) || '');
if (_o1i) await _on(_o1i, (_o1d && _o1d.provider) || provider);
else { await _on(M.fallbackReport(_o1p.g), 'app'); _o1.toast('AI chưa trả lời đúng định dạng – bản tin lấy từ dữ liệu app', 'warn'); }
} catch (e) {
if (_o1.isAiCancel(e)) { _o1j.innerHTML = ''; _o1h(); return; }
await _on(M.fallbackReport(_o1p.g), 'app');
_o1.toast(((e && e.message) || 'AI chưa trả lời') + ' – bản tin lấy từ dữ liệu app', 'warn');
} finally { _o1p.busy = false; _o1l.disabled = false; }
}
async function _o1m(target) {
_o1p.g = await gather();
const prompt = M.buildPrompt(_o1p.g, { channel: V.channelFrom(ctx.config, ctx.settings) });
let text = null;
try {
if (ctx.ai && typeof ctx.ai.handoff === 'function') text = await ctx.ai.handoff('summarize', prompt, { target });
else { await _o1.copy(prompt); window.open(target === 'claude' ? 'https://claude.ai/new' : 'https://gemini.google.com/app', '_blank', 'noopener'); _o1.toast('Đã chép lời nhắn – dán vào ' + (target === 'claude' ? 'Claude' : 'Gemini') + ' để viết bản tin', 'info'); return; }
} catch { text = null; }
if (!text) return;
const _o1i = M.parseReport(text);
if (!_o1i) { _o1.toast('Kết quả dán vào chưa đúng định dạng JSON của bản tin', 'warn'); return; }
await _on(_o1i, target === 'claude' ? 'handoff_claude' : 'handoff_gemini');
_o1.toast('Đã lưu bản tin', 'success');
}
function _or(x) {
const t = String(x.text || '');
const _oq = t.indexOf('(' + M.UNVERIFIED + ')');
return _oq < 0 ? h('span', null, t) : h('span', null, t.slice(0, _oq), h('span', { class: 'mk-unv' }, '(' + M.UNVERIFIED + ')'), t.slice(_oq + M.UNVERIFIED.length + 2));
}
function _o1o(icon, title, list, rowFn, testid) {
return h('section', { class: 'mk-sec', 'data-testid': testid }, h('h4', null, icon + ' ' + title + ' (' + list.length + ')'),
list.length ? h('ul', null, list.map(rowFn)) : h('p', { class: 'bds-muted' }, 'Không có.'));
}
async function _o1u(_o1n, btn) {
const { ideas, jobs } = { ideas: await _o1.listAll('ideas'), jobs: await _o1.list('jobs') };
if (I.findDuplicate({ title: _o1n.title }, { ideas: ideas.filter(_oq => !Number(_oq.deleted)), jobs }).match) { _o1.toast('Chủ đề này đã có trong Nguồn ý tưởng', 'info'); return; }
await _o1.put('ideas', M.ideaFromSuggestion(_o1n, { area, week: _o1p.g.week.key }));
if (btn) { btn.disabled = true; btn.textContent = '✓ Đã đưa vào'; }
_o1.toast('Đã đưa vào Nguồn ý tưởng (Chờ duyệt)', 'success');
}
async function _o1t(_ob, btn) {
await _o1.put('reminders', M.reminderFromReason(_ob, { now: Date.now() }));
if (btn) { btn.disabled = true; btn.textContent = '✓ Đã nhắc'; }
_o1.toast('Đã thêm nhắc gọi lại vào Chăm sóc (sáng mai 9h)', 'success');
}
function _o1h() {
_o1j.innerHTML = '';
const _o1d = _o1p.report;
if (!_o1d) { _o1j.appendChild(_o1.empty('Chọn khu vực, chọn AI rồi bấm "✨ Viết bản tin". Không có AI: chọn "Không dùng AI – từ dữ liệu app" vẫn ra bản tin.')); return; }
_o1j.appendChild(h('div', { class: 'mk-report' },
h('p', { class: 'mk-headline' }, _o1d.headline || (_o1p.g.area_label + ' – ' + _o1p.g.week.label)),
_o1d.note ? h('div', { class: 'ix-help' }, _o1d.note) : null,
_o1o('📰', 'Tin chính', _o1d.main, x => h('li', null, _or(x), x.url ? _o1.linkBtn('Nguồn ↗', x.url, null, { target: '_blank' }) : h('small', { class: 'mk-unv' }, 'chưa có link')), 'mk-sec-main'),
_o1o('📜', 'Chính sách mới', _o1d.policies, x => h('li', null, _or(x)), 'mk-sec-policies'),
_o1o('👥', 'Nhu cầu khách', _o1d.demand, x => h('li', null, _or(x)), 'mk-sec-demand'),
_o1o('💡', 'Gợi ý nội dung đăng', _o1d.video_ideas, x => {
const _oa = _o1.button('→ Nguồn ý tưởng', () => _o1u(x, _oa), { testid: 'mk-to-idea' });
return h('li', null, h('span', null, h('strong', null, x.title), x.why ? h('div', { class: 'ix-sub' }, x.why) : null), _oa);
}, 'mk-sec-video'),
_o1o('📞', 'Lý do để gọi lại khách', _o1d.call_reasons, x => {
const _oa = _o1.button('→ Chăm sóc', () => _o1t(x, _oa), { testid: 'mk-to-care' });
return h('li', null, h('span', null, x.project ? h('strong', null, x.project + ': ') : null, x.reason), _oa);
}, 'mk-sec-call'),
h('div', { class: 'bds-row bds-end' }, h('small', { class: 'bds-muted', 'data-testid': 'mk-by' }, 'Viết bởi: ' + (M.PROVIDER_NAME[_o1p.provider] || _o1p.provider)),
_o1.button('Chép bản tin', async () => { if (await _o1.copy(M.reportText(_o1d, _o1p.g))) _o1.toast('Đã chép', 'success'); }, { testid: 'mk-copy' }))));
}
async function _o1f() {
const jobs = (await _o1.list('jobs')).filter(j => j.type === 'market_report').sort((_o3, _oa) => (_oa.updated_at || 0) - (_o3.updated_at || 0));
const _ox = jobs.filter(j => V.parseData(j.input).area === area).slice(0, 6);
_oo.innerHTML = '';
if (!_ox.length) { _oo.appendChild(_o1.empty('Chưa có bản tin nào cho khu vực này.')); return; }
_oo.appendChild(h('ul', { class: 'mk-sec mk-hist', style: { listStyle: 'none', padding: 0, margin: 0 } }, _ox.map(j => h('li', null,
h('span', null, j.title, h('div', { class: 'ix-sub' }, _o1.date(j.updated_at))),
_o1.button('Xem', () => { const _o14 = V.parseData(j.output); if (_o14.report) { _o1p.report = _o14.report; _o1p.provider = _o14.provider || ''; _o1h(); _o1j.scrollIntoView({ block: 'start' }); } })))));
}
async function _om(btn) {
if (btn) btn.disabled = true;
try {
const v = await _o1.setting('followed_topics', null);
const feeds = I.feedsFrom(v && !Array.isArray(v) ? v : null);
const since = Date.now() - 7 * 864e5;
let items = null; let via = '';
try { const _o1d = await _o1.api('news.fetch', { feeds, since }); if ((_o1d && _o1d.items || []).length || (_o1d && _o1d.errors || []).length < feeds.length) { items = (_o1d && _o1d.items) || []; via = 'máy chủ'; } } catch { }
if (!items && !_o13()) { try { const _o1d = await V.engineCall('/news?' + new URLSearchParams({ feeds: feeds.join(','), since: String(since) }), { timeout: 25000 }); items = _o1d.items || []; via = 'máy dựng'; } catch { items = null; } }
if (!items) { _o1.toast(_o13() ? 'Chưa lấy được tin: máy chủ chưa tải được nguồn RSS' : 'Chưa lấy được tin: máy chủ chưa tải được nguồn RSS, máy dựng đang tắt', 'warn'); return; }
_o1p.feedItems = M.mergeFeed(_o1p.feedItems.filter(_oq => _oq.via === 'ai'), items);
_o1.toast(`Lấy ${items.length} tin qua ${via}`, 'success');
await render();
} finally { if (btn) btn.disabled = false; }
}
const areaInfo = () => { const _o3 = _oh(); return _o3.custom ? { area: _o3.label, province: _o3.province && _o3.province !== _o3.label ? _o3.province : '', projects: [] } : { area: _o3.label, province: M.areaProvince(_o3.id), projects: (_o1p.g && _o1p.g.projects) || [] }; };
const _o5 = async (_o16, at) => {
const _o4 = M.feedFromFresh(_o16, { area, at });
_o1p.feedItems = M.mergeFeed(_o1p.feedItems, _o4);
await render();
return _o4.length;
};
function _ok() {
openFresh(_o1, ctx, {
topic: 'news', title: 'Lấy tin mới qua AI – ' + _oh().label, testid: 'mk-fresh',
prompt: () => N.newsPrompt({ now: Date.now(), ...areaInfo() }),
render: (_o16) => { const items = N.normalizeNews(_o16); return items.length ? N.newsListView(items, { testid: 'mk-fresh-news' }) : null; },
onSave: async (_o16, meta) => {
const _oz = await _o5(_o16, meta.at);
if (!_oz) throw new Error('AI chưa trả về tin nào đọc được');
},
});
}
async function _oj(target) {
const prompt = N.chatPrompt(N.newsPrompt({ now: Date.now(), ...areaInfo() }));
let text = null;
try {
if (ctx.ai && typeof ctx.ai.handoff === 'function') text = await ctx.ai.handoff('summarize', prompt, { target });
else { await _o1.copy(prompt); window.open(target === 'claude' ? 'https://claude.ai/new' : 'https://gemini.google.com/app', '_blank', 'noopener'); _o1.toast('Đã chép lời nhắn tìm tin – dán vào ' + (target === 'claude' ? 'Claude' : 'Gemini'), 'info'); return; }
} catch { text = null; }
if (!text) return;
const _o16 = parseFreshJson(text);
const items = N.normalizeNews(_o16);
if (!items.length) { _o1.toast('Kết quả dán vào chưa đúng định dạng JSON tin (cần {"items":[…]})', 'warn'); return; }
const _oz = await _o5(_o16, Date.now());
const _op = N.distinctHosts(items);
_o1.toast(`Đã thêm ${_oz} tin từ ${target === 'claude' ? 'Claude' : 'Gemini'} (chat)` + (_op < 10 ? ` – chỉ ${_op} trang khác nhau (nên ≥ 10), anh/chị mở link kiểm lại nguồn` : ''), _op < 10 ? 'warn' : 'success');
}
function _ol(btn) {
const _ob = _o12.value;
if (_ob === 'gemini') return _ok();
if (_ob === 'handoff_claude' || _ob === 'handoff_gemini') return _oj(_ob === 'handoff_claude' ? 'claude' : 'gemini');
return _om(btn);
}
const _og = !!(await _o1.setting('ai.claude_api_enabled', false));
const _oe = (list, testid, label) => h('select', { class: 'mk-ai-sel', 'data-testid': testid, 'aria-label': label, title: label },
list.map(_o3 => h('option', { value: _o3.id, 'data-ai': _o3.auto ? 'auto' : null, disabled: _o3.id === 'claude_api' && !_og },
_o3.label + (_o3.id === 'claude_api' && !_og ? ' (đang tắt – bật ở Cài đặt › Bộ chọn AI)' : ''))));
const _o7 = _oe(M.WRITE_AI, 'mk-ai', 'AI viết bản tin');
const _o12 = _oe(M.NEWS_AI, 'mk-news-ai', 'Lấy tin bằng');
const _o1q = N.canUpdateNews(ctx.user);
const _o1b = _oe(M.PLACE_AI, 'mk-place-ai', 'AI gợi ý tên địa phương');
if (!_o1q) for (const _o14 of _o1b.options) if (_o14.value === 'claude_api') { _o14.disabled = true; _o14.textContent = M.choiceOf(M.PLACE_AI, 'claude_api').label + ' (chỉ Chủ/Quản lý)'; }
const _o19 = h('small', { class: 'bds-muted', 'data-testid': 'mk-place-fee' });
const _o8 = _o1.button('✨ Hỏi AI gợi ý tên địa phương', () => _o9(), { testid: 'mk-place-ask', ai: 'market_report' });
const _ot = (text, sel) => h('label', { class: 'mk-ai-lab' }, h('small', { class: 'bds-muted' }, text), sel);
const _o6 = h('small', { class: 'bds-muted', 'data-testid': 'mk-ai-hint' });
const _o11 = h('small', { class: 'bds-muted', 'data-testid': 'mk-news-fee' });
const _o1l = _o1.button('✨ Viết bản tin', () => _o1v(), { kind: 'primary', testid: 'mk-run', ai: 'market_report' });
const _o10 = _o1.button('📰 Lấy tin mới', () => _ol(_o10), { testid: 'mk-news' });
const _o1s = (btn, list, id) => { if (M.choiceOf(list, id).auto) btn.dataset.ai = 'auto'; else delete btn.dataset.ai; };
const _o15 = () => {
_o1s(_o1l, M.WRITE_AI, _o7.value); _o1s(_o10, M.NEWS_AI, _o12.value); _o1s(_o8, M.PLACE_AI, _o1b.value);
_o19.textContent = M.choiceOf(M.PLACE_AI, _o1b.value).hint;
_o6.textContent = M.choiceOf(M.WRITE_AI, _o7.value).hint;
_o11.textContent = M.choiceOf(M.NEWS_AI, _o12.value).hint;
_o11.hidden = !_o11.textContent;
};
const _o1r = () => {
_o7.value = M.pickWriteAi(_ov(M.LS_WRITE_AI), { claudeEnabled: _og, aiOff: aiOff() });
_o12.value = M.pickNewsAi(_ov(M.LS_NEWS_AI), { claudeEnabled: _og, aiOff: aiOff() });
_o1b.value = M.pickPlaceAi(_ov(M.LS_PLACE_AI), { claudeEnabled: _og && _o1q, aiOff: aiOff() });
_o15();
};
_o7.addEventListener('change', () => { _ow(M.LS_WRITE_AI, _o7.value); _o15(); });
_o1b.addEventListener('change', () => { _ow(M.LS_PLACE_AI, _o1b.value); _o15(); });
_o12.addEventListener('change', () => { _ow(M.LS_NEWS_AI, _o12.value); _o15(); });
_o1r();
if (typeof MutationObserver === 'function' && typeof document !== 'undefined') {
const _oy = new MutationObserver(() => { if (!el.isConnected) { _oy.disconnect(); return; } _o1r(); });
_oy.observe(document.documentElement, { attributes: true, attributeFilter: ['data-ai'] });
}
const _os = (text, sel) => h('label', { class: 'mk-ai-lab' }, h('small', { class: 'bds-muted' }, text), sel);
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'market-screen' },
h('div', { class: 'bds-head' }, h('h2', null, 'Phân tích thị trường'),
h('div', { class: 'mk-news-bar' }, h('div', { class: 'mk-ai' }, _os('Lấy tin bằng', _o12), _o10), _o11)),
areaBox, otherBox, placeBox,
_o1.card({ title: 'Dữ liệu 7 ngày', testid: 'mk-data', body: h('div', null, statBox, noteBox,
h('p', { class: 'ix-lead' }, 'Khách chỉ được đếm theo dự án – không gửi tên hay số điện thoại cho AI. Mọi số trong bản tin phải có nguồn, không thì ghi "chưa kiểm chứng".'),
h('div', { class: 'mk-ai' }, _os('AI viết bản tin', _o7), _o1l), _o6) }),
_o1.card({ title: 'Bản tin tuần', testid: 'mk-report-card', body: _o1j }),
_o1.card({ title: 'Bản tin đã lưu', body: _oo }),
));
await render();
_o1.on(el, ['ideas', 'policies', 'objects', 'jobs'], () => { if (!_o1p.busy) render(); });
}
export default {
manifest: {
id: 'market', title: 'Phân tích thị trường', icon: '📊', screen: 'home', order: 20, version: '1.0.1', status: 'ready', requires: 'video',
help: 'Bản tin thị trường tuần theo khu vực (Gia Lâm, Cổ Loa/Đông Anh, Tây Hồ, Tây Mỗ, nội đô… hoặc "Khu vực khác" bất kỳ): tin chính có nguồn, chính sách mới, nhu cầu khách (chỉ đếm), gợi ý nội dung đăng, lý do gọi lại khách.',
},
mount,
async selftest(ctx) {
const details = [];
const _o1n = ctx && ctx.store;
for (const _oi of ['list', 'get', 'put']) if (!_o1n || typeof _o1n[_oi] !== 'function') details.push('Thiếu store.' + _oi);
try {
const g = M.gather({ area: 'ocean_park', projects: [{ id: 'x', name: 'X', area: 'Khu Mẫu B' }], now: Date.now() });
if (!M.reportText(M.fallbackReport(g), g).includes('Tin chính')) details.push('Bản tin dự phòng sai');
} catch (e) { details.push(e.message); }
return { ok: !details.length, details };
},
};

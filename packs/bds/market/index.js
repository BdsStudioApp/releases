import { kit, h } from '../_lib/kit.js';
import * as V from '../_lib/video.js';
import * as I from '../_lib/ideas.js';
import * as M from '../_lib/market.js';
import { openFresh, parseFreshJson } from '../_lib/fresh.js';
import * as N from '../_lib/freshnews.js';
const _o0 = 'bds-ideas-css';
function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
document.head.appendChild(h('link', { id: _o0, rel: 'stylesheet', href: new URL('../ideas/ideas.css', import.meta.url).href }));
}
const _o2 = 'bds.market.area';
const _on = k => { try { return localStorage.getItem(k); } catch { return null; } };
const _oo = (k, v) => { try { localStorage.setItem(k, v); } catch { } };
const aiOff = () => typeof document !== 'undefined' && document.documentElement.dataset.ai === 'off';
export async function mount(el, ctx) {
ensureCss(); N.ensureFreshCss();
const _o1 = kit(ctx);
const _ow = () => !!(ctx.video && ctx.video.hidden());
const _ov = () => !!(ctx.video && (typeof ctx.video.engineOff === 'function' ? ctx.video.engineOff() : ctx.video.hidden()));
let area = (() => { try { return localStorage.getItem(_o2) || M.AREAS[0].id; } catch { return M.AREAS[0].id; } })();
const _o1b = { feedItems: [], report: null, g: null, provider: '', busy: false };
el.innerHTML = '';
const areaBox = h('div', { class: 'mk-areas', role: 'tablist', 'data-testid': 'mk-areas' });
const statBox = h('div', { class: 'mk-stats', 'data-testid': 'mk-stats' });
const _o15 = h('div', { 'data-testid': 'mk-report' });
const _oi = h('div', { 'data-testid': 'mk-history' });
const noteBox = h('p', { class: 'ix-status', 'data-testid': 'mk-note' });
async function gather() {
const [ideas, policies, customers, jobs] = await Promise.all([_o1.list('ideas'), _o1.list('policies'), _o1.list('objects'), _o1.list('jobs')]);
return M.gather({ area, ideas, policies, customers, jobs, projects: _o1.projects(), feedItems: _o1b.feedItems, now: Date.now() });
}
function _o11() {
areaBox.innerHTML = '';
for (const _o3 of M.AREAS) areaBox.appendChild(h('button', { type: 'button', role: 'tab', 'aria-selected': String(_o3.id === area), class: 'bds-chip' + (_o3.id === area ? ' bds-on' : ''),
'data-testid': 'mk-area-' + _o3.id, onclick: () => { area = _o3.id; try { localStorage.setItem(_o2, area); } catch { } _o1b.report = null; render(); } }, _o3.label));
}
const _o1c = (_or, label) => h('div', { class: 'mk-stat' }, h('strong', null, String(_or)), h('span', null, label));
async function render() {
_o11();
_o1b.g = await gather();
const g = _o1b.g;
statBox.innerHTML = '';
statBox.append(_o1c(g.news.length, 'tin 7 ngày'), _o1c(g.policies.length, 'chính sách'), _o1c(g.demand.reduce((_o19, d) => _o19 + d.count, 0), 'khách mới'), _ow() ? '' : _o1c(g.videos.done, 'video xong'));
noteBox.textContent = `${g.week.label} · ` + (g.projects.length ? `${g.projects.length} dự án: ${g.projects.slice(0, 3).join(', ')}${g.projects.length > 3 ? '…' : ''}` : 'chưa có dự án trong bảng hàng') + '.';
noteBox.title = g.projects.join(', ');
_o13();
await _o12();
}
async function _oh(report, provider) {
_o1b.report = report; _o1b.provider = provider;
await _o1.put('jobs', M.jobRow(report, _o1b.g, { provider }));
_o13(); await _o12();
}
async function _o1h(choice = _o7.value) {
if (_o1b.busy) return;
if (choice === 'app') { _o1b.g = await gather(); await _oh(M.fallbackReport(_o1b.g), 'app'); _o1.toast('Đã viết bản tin nhanh từ dữ liệu app', 'success'); return; }
if (choice === 'handoff_claude' || choice === 'handoff_gemini') return _o18(choice === 'handoff_claude' ? 'claude' : 'gemini');
return _o16(choice);
}
async function _o16(provider) {
_o1b.g = await gather();
if (!ctx.ai || typeof ctx.ai.run !== 'function') { await _oh(M.fallbackReport(_o1b.g), 'app'); _o1.toast('Chưa bật AI – bản tin lấy từ dữ liệu app', 'info'); return; }
const prompt = M.buildPrompt(_o1b.g);
if (provider === 'claude_api') {
const e = M.claudeEstimate(prompt);
const ok = await _o1.confirm({ title: 'Claude API – báo phí trước', testid: 'mk-claude-cost', ok: 'Viết (có phí)',
text: `Mất phí AI: ước tính ≈ ${e.usd.toLocaleString('vi-VN', { maximumFractionDigits: 4 })} USD cho lần viết này (~${e.tokens_in.toLocaleString('vi-VN')} token vào, ~${e.tokens_out.toLocaleString('vi-VN')} token ra), tính vào ngân sách AI tháng của Chủ. Muốn 0 đồng: chọn "Claude qua chat".` });
if (!ok) return;
}
const name = M.PROVIDER_NAME[provider] || provider;
_o1b.busy = true; _o17.disabled = true;
_o15.innerHTML = ''; _o15.appendChild(h('p', { class: 'bds-muted', 'data-testid': 'mk-busy' }, name + ' đang viết bản tin…'));
try {
const _o10 = await ctx.ai.run('summarize', { prompt, json: true, provider, feature: 'market_report' });
const _o14 = M.parseReport((_o10 && (_o10.text ?? _o10)) || '');
if (_o14) await _oh(_o14, (_o10 && _o10.provider) || provider);
else { await _oh(M.fallbackReport(_o1b.g), 'app'); _o1.toast('AI chưa trả lời đúng định dạng – bản tin lấy từ dữ liệu app', 'warn'); }
} catch (e) {
if (_o1.isAiCancel(e)) { _o15.innerHTML = ''; _o13(); return; }
await _oh(M.fallbackReport(_o1b.g), 'app');
_o1.toast(((e && e.message) || 'AI chưa trả lời') + ' – bản tin lấy từ dữ liệu app', 'warn');
} finally { _o1b.busy = false; _o17.disabled = false; }
}
async function _o18(target) {
_o1b.g = await gather();
const prompt = M.buildPrompt(_o1b.g);
let text = null;
try {
if (ctx.ai && typeof ctx.ai.handoff === 'function') text = await ctx.ai.handoff('summarize', prompt, { target });
else { await _o1.copy(prompt); window.open(target === 'claude' ? 'https://claude.ai/new' : 'https://gemini.google.com/app', '_blank', 'noopener'); _o1.toast('Đã chép lời nhắn – dán vào ' + (target === 'claude' ? 'Claude' : 'Gemini') + ' để viết bản tin', 'info'); return; }
} catch { text = null; }
if (!text) return;
const _o14 = M.parseReport(text);
if (!_o14) { _o1.toast('Kết quả dán vào chưa đúng định dạng JSON của bản tin', 'warn'); return; }
await _oh(_o14, target === 'claude' ? 'handoff_claude' : 'handoff_gemini');
_o1.toast('Đã lưu bản tin', 'success');
}
function _ol(x) {
const t = String(x.text || '');
const _ok = t.indexOf('(' + M.UNVERIFIED + ')');
return _ok < 0 ? h('span', null, t) : h('span', null, t.slice(0, _ok), h('span', { class: 'mk-unv' }, '(' + M.UNVERIFIED + ')'), t.slice(_ok + M.UNVERIFIED.length + 2));
}
function _o1a(icon, title, list, rowFn, testid) {
return h('section', { class: 'mk-sec', 'data-testid': testid }, h('h4', null, icon + ' ' + title + ' (' + list.length + ')'),
list.length ? h('ul', null, list.map(rowFn)) : h('p', { class: 'bds-muted' }, 'Không có.'));
}
async function _o1g(_o19, btn) {
const { ideas, jobs } = { ideas: await _o1.listAll('ideas'), jobs: await _o1.list('jobs') };
if (I.findDuplicate({ title: _o19.title }, { ideas: ideas.filter(_ok => !Number(_ok.deleted)), jobs }).match) { _o1.toast('Chủ đề này đã có trong Nguồn ý tưởng', 'info'); return; }
await _o1.put('ideas', M.ideaFromSuggestion(_o19, { area, week: _o1b.g.week.key }));
if (btn) { btn.disabled = true; btn.textContent = '✓ Đã đưa vào'; }
_o1.toast('Đã đưa vào Nguồn ý tưởng (Chờ duyệt)', 'success');
}
async function _o1f(_o9, btn) {
await _o1.put('reminders', M.reminderFromReason(_o9, { now: Date.now() }));
if (btn) { btn.disabled = true; btn.textContent = '✓ Đã nhắc'; }
_o1.toast('Đã thêm nhắc gọi lại vào Chăm sóc (sáng mai 9h)', 'success');
}
function _o13() {
_o15.innerHTML = '';
const _o10 = _o1b.report;
if (!_o10) { _o15.appendChild(_o1.empty('Chọn khu vực, chọn AI rồi bấm "✨ Viết bản tin". Không có AI: chọn "Không dùng AI – từ dữ liệu app" vẫn ra bản tin.')); return; }
_o15.appendChild(h('div', { class: 'mk-report' },
h('p', { class: 'mk-headline' }, _o10.headline || (_o1b.g.area_label + ' – ' + _o1b.g.week.label)),
_o10.note ? h('div', { class: 'ix-help' }, _o10.note) : null,
_o1a('📰', 'Tin chính', _o10.main, x => h('li', null, _ol(x), x.url ? _o1.linkBtn('Nguồn ↗', x.url, null, { target: '_blank' }) : h('small', { class: 'mk-unv' }, 'chưa có link')), 'mk-sec-main'),
_o1a('📜', 'Chính sách mới', _o10.policies, x => h('li', null, _ol(x)), 'mk-sec-policies'),
_o1a('👥', 'Nhu cầu khách', _o10.demand, x => h('li', null, _ol(x)), 'mk-sec-demand'),
_o1a('🎬', 'Gợi ý chủ đề video', _o10.video_ideas, x => {
const _o8 = _o1.button('→ Nguồn ý tưởng', () => _o1g(x, _o8), { testid: 'mk-to-idea' });
return h('li', null, h('span', null, h('strong', null, x.title), x.why ? h('div', { class: 'ix-sub' }, x.why) : null), _o8);
}, 'mk-sec-video'),
_o1a('📞', 'Lý do để gọi lại khách', _o10.call_reasons, x => {
const _o8 = _o1.button('→ Chăm sóc', () => _o1f(x, _o8), { testid: 'mk-to-care' });
return h('li', null, h('span', null, x.project ? h('strong', null, x.project + ': ') : null, x.reason), _o8);
}, 'mk-sec-call'),
h('div', { class: 'bds-row bds-end' }, h('small', { class: 'bds-muted', 'data-testid': 'mk-by' }, 'Viết bởi: ' + (M.PROVIDER_NAME[_o1b.provider] || _o1b.provider)),
_o1.button('Chép bản tin', async () => { if (await _o1.copy(M.reportText(_o10, _o1b.g))) _o1.toast('Đã chép', 'success'); }, { testid: 'mk-copy' }))));
}
async function _o12() {
const jobs = (await _o1.list('jobs')).filter(j => j.type === 'market_report').sort((_o3, _o8) => (_o8.updated_at || 0) - (_o3.updated_at || 0));
const _op = jobs.filter(j => V.parseData(j.input).area === area).slice(0, 6);
_oi.innerHTML = '';
if (!_op.length) { _oi.appendChild(_o1.empty('Chưa có bản tin nào cho khu vực này.')); return; }
_oi.appendChild(h('ul', { class: 'mk-sec mk-hist', style: { listStyle: 'none', padding: 0, margin: 0 } }, _op.map(j => h('li', null,
h('span', null, j.title, h('div', { class: 'ix-sub' }, _o1.date(j.updated_at))),
_o1.button('Xem', () => { const _ox = V.parseData(j.output); if (_ox.report) { _o1b.report = _ox.report; _o1b.provider = _ox.provider || ''; _o13(); _o15.scrollIntoView({ block: 'start' }); } })))));
}
async function _og(btn) {
if (btn) btn.disabled = true;
try {
const v = await _o1.setting('followed_topics', null);
const feeds = I.feedsFrom(v && !Array.isArray(v) ? v : null);
const since = Date.now() - 7 * 864e5;
let items = null; let via = '';
try { const _o10 = await _o1.api('news.fetch', { feeds, since }); if ((_o10 && _o10.items || []).length || (_o10 && _o10.errors || []).length < feeds.length) { items = (_o10 && _o10.items) || []; via = 'máy chủ'; } } catch { }
if (!items && !_ov()) { try { const _o10 = await V.engineCall('/news?' + new URLSearchParams({ feeds: feeds.join(','), since: String(since) }), { timeout: 25000 }); items = _o10.items || []; via = 'máy dựng'; } catch { items = null; } }
if (!items) { _o1.toast(_ov() ? 'Chưa lấy được tin: máy chủ chưa tải được nguồn RSS' : 'Chưa lấy được tin: máy chủ chưa tải được nguồn RSS, máy dựng đang tắt', 'warn'); return; }
_o1b.feedItems = M.mergeFeed(_o1b.feedItems.filter(_ok => _ok.via === 'ai'), items);
_o1.toast(`Lấy ${items.length} tin qua ${via}`, 'success');
await render();
} finally { if (btn) btn.disabled = false; }
}
const areaInfo = () => ({ area: M.areaOf(area).label, province: M.areaProvince(area), projects: (_o1b.g && _o1b.g.projects) || [] });
const _o5 = async (_oz, at) => {
const _o4 = M.feedFromFresh(_oz, { area, at });
_o1b.feedItems = M.mergeFeed(_o1b.feedItems, _o4);
await render();
return _o4.length;
};
function _oe() {
openFresh(_o1, ctx, {
topic: 'news', title: 'Lấy tin mới qua AI – ' + M.areaOf(area).label, testid: 'mk-fresh',
prompt: () => N.newsPrompt({ now: Date.now(), ...areaInfo() }),
render: (_oz) => { const items = N.normalizeNews(_oz); return items.length ? N.newsListView(items, { testid: 'mk-fresh-news' }) : null; },
onSave: async (_oz, meta) => {
const _or = await _o5(_oz, meta.at);
if (!_or) throw new Error('AI chưa trả về tin nào đọc được');
},
});
}
async function _od(target) {
const prompt = N.chatPrompt(N.newsPrompt({ now: Date.now(), ...areaInfo() }));
let text = null;
try {
if (ctx.ai && typeof ctx.ai.handoff === 'function') text = await ctx.ai.handoff('summarize', prompt, { target });
else { await _o1.copy(prompt); window.open(target === 'claude' ? 'https://claude.ai/new' : 'https://gemini.google.com/app', '_blank', 'noopener'); _o1.toast('Đã chép lời nhắn tìm tin – dán vào ' + (target === 'claude' ? 'Claude' : 'Gemini'), 'info'); return; }
} catch { text = null; }
if (!text) return;
const _oz = parseFreshJson(text);
const items = N.normalizeNews(_oz);
if (!items.length) { _o1.toast('Kết quả dán vào chưa đúng định dạng JSON tin (cần {"items":[…]})', 'warn'); return; }
const _or = await _o5(_oz, Date.now());
const _oj = N.distinctHosts(items);
_o1.toast(`Đã thêm ${_or} tin từ ${target === 'claude' ? 'Claude' : 'Gemini'} (chat)` + (_oj < 10 ? ` – chỉ ${_oj} trang khác nhau (nên ≥ 10), anh/chị mở link kiểm lại nguồn` : ''), _oj < 10 ? 'warn' : 'success');
}
function _of(btn) {
const _o9 = _ou.value;
if (_o9 === 'gemini') return _oe();
if (_o9 === 'handoff_claude' || _o9 === 'handoff_gemini') return _od(_o9 === 'handoff_claude' ? 'claude' : 'gemini');
return _og(btn);
}
const _ob = !!(await _o1.setting('ai.claude_api_enabled', false));
const _oa = (list, testid, label) => h('select', { class: 'mk-ai-sel', 'data-testid': testid, 'aria-label': label, title: label },
list.map(_o3 => h('option', { value: _o3.id, 'data-ai': _o3.auto ? 'auto' : null, disabled: _o3.id === 'claude_api' && !_ob },
_o3.label + (_o3.id === 'claude_api' && !_ob ? ' (đang tắt – bật ở Cài đặt › Bộ chọn AI)' : ''))));
const _o7 = _oa(M.WRITE_AI, 'mk-ai', 'AI viết bản tin');
const _ou = _oa(M.NEWS_AI, 'mk-news-ai', 'Lấy tin bằng');
const _o6 = h('small', { class: 'bds-muted', 'data-testid': 'mk-ai-hint' });
const _ot = h('small', { class: 'bds-muted', 'data-testid': 'mk-news-fee' });
const _o17 = _o1.button('✨ Viết bản tin', () => _o1h(), { kind: 'primary', testid: 'mk-run', ai: 'market_report' });
const _os = _o1.button('📰 Lấy tin mới', () => _of(_os), { testid: 'mk-news' });
const _o1e = (btn, list, id) => { if (M.choiceOf(list, id).auto) btn.dataset.ai = 'auto'; else delete btn.dataset.ai; };
const _oy = () => {
_o1e(_o17, M.WRITE_AI, _o7.value); _o1e(_os, M.NEWS_AI, _ou.value);
_o6.textContent = M.choiceOf(M.WRITE_AI, _o7.value).hint;
_ot.textContent = M.choiceOf(M.NEWS_AI, _ou.value).hint;
_ot.hidden = !_ot.textContent;
};
const _o1d = () => {
_o7.value = M.pickWriteAi(_on(M.LS_WRITE_AI), { claudeEnabled: _ob, aiOff: aiOff() });
_ou.value = M.pickNewsAi(_on(M.LS_NEWS_AI), { claudeEnabled: _ob, aiOff: aiOff() });
_oy();
};
_o7.addEventListener('change', () => { _oo(M.LS_WRITE_AI, _o7.value); _oy(); });
_ou.addEventListener('change', () => { _oo(M.LS_NEWS_AI, _ou.value); _oy(); });
_o1d();
if (typeof MutationObserver === 'function' && typeof document !== 'undefined') {
const _oq = new MutationObserver(() => { if (!el.isConnected) { _oq.disconnect(); return; } _o1d(); });
_oq.observe(document.documentElement, { attributes: true, attributeFilter: ['data-ai'] });
}
const _om = (text, sel) => h('label', { class: 'mk-ai-lab' }, h('small', { class: 'bds-muted' }, text), sel);
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'market-screen' },
h('div', { class: 'bds-head' }, h('h2', null, 'Phân tích thị trường'),
h('div', { class: 'mk-news-bar' }, h('div', { class: 'mk-ai' }, _om('Lấy tin bằng', _ou), _os), _ot)),
areaBox,
_o1.card({ title: 'Dữ liệu 7 ngày', testid: 'mk-data', body: h('div', null, statBox, noteBox,
h('p', { class: 'ix-lead' }, 'Khách chỉ được đếm theo dự án – không gửi tên hay số điện thoại cho AI. Mọi số trong bản tin phải có nguồn, không thì ghi "chưa kiểm chứng".'),
h('div', { class: 'mk-ai' }, _om('AI viết bản tin', _o7), _o17), _o6) }),
_o1.card({ title: 'Bản tin tuần', testid: 'mk-report-card', body: _o15 }),
_o1.card({ title: 'Bản tin đã lưu', body: _oi }),
));
await render();
_o1.on(el, ['ideas', 'policies', 'objects', 'jobs'], () => { if (!_o1b.busy) render(); });
}
export default {
manifest: {
id: 'market', title: 'Phân tích thị trường', icon: '📊', screen: 'customers', order: 40, version: '1.0.0', status: 'ready', requires: 'video',
help: 'Bản tin thị trường tuần theo khu vực (Gia Lâm, Cổ Loa/Đông Anh, Tây Hồ, Tây Mỗ, nội đô…): tin chính có nguồn, chính sách mới, nhu cầu khách (chỉ đếm), gợi ý nội dung đăng, lý do gọi lại khách.',
},
mount,
async selftest(ctx) {
const details = [];
const _o19 = ctx && ctx.store;
for (const _oc of ['list', 'get', 'put']) if (!_o19 || typeof _o19[_oc] !== 'function') details.push('Thiếu store.' + _oc);
try {
const g = M.gather({ area: 'ocean_park', projects: [{ id: 'x', name: 'X', area: 'Khu Mẫu B' }], now: Date.now() });
if (!M.reportText(M.fallbackReport(g), g).includes('Tin chính')) details.push('Bản tin dự phòng sai');
} catch (e) { details.push(e.message); }
return { ok: !details.length, details };
},
};

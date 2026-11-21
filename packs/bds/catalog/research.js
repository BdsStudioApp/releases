import { h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as U from '../g1_lib/ui.js';
import { NO_WEB_TEXT } from './structure_logic.js';
export const ACTION = 'catalog.research';
export const ST_TXT = { grounded: 'Có nguồn Google', ai_only: '', missing: 'Thiếu link nguồn' };
export const stChip = (status, txt = ST_TXT) => (txt[status] ? h('span', { class: 'g1-st ' + status }, txt[status]) : null);
export function pickBox(cb, text = 'Lưu') {
return h('label', { class: 'crs-pick' }, cb, h('span', null, text));
}
const _o0 = { ai: 'AI tìm', file: 'Từ tệp', manual: 'Sửa tay' };
const _oi = (_o7) => String(_o7.quote || '').replace(/^["“']+|["”']+$/g, '').trim();
const dmy = (iso) => String(iso || '').split('-').reverse().join('/');
const _o1 = '.crs-lbl{display:none;font-size:.78em;font-weight:700;letter-spacing:.02em;color:var(--sl-muted,rgba(127,127,127,.95));margin-right:6px}' +
'[data-testid=crs-result] td{overflow-wrap:anywhere;word-break:break-word}[data-testid=crs-result] .g1-src{min-width:8em}' +
'@media (max-width:600px){.crs-lbl{display:inline}}' +
'.crs-pick{display:inline-flex;align-items:center;gap:8px;min-height:44px;cursor:pointer;font-size:.9rem;user-select:none}' +
'.crs-pick input[type=checkbox]{-webkit-appearance:checkbox;appearance:auto;width:22px;height:22px;margin:0;flex:0 0 auto;accent-color:var(--gold,#C9A24A);background:transparent;border:0;box-shadow:none;border-radius:4px;color-scheme:light dark}' +
'.crs-pick input[type=checkbox]:disabled{opacity:.45}.crs-pick input:disabled+span{opacity:.55}';
export function ensureCss() {
S.ensureSalesCss(); U.ensureCss();
if (typeof document === 'undefined' || ensureCss.done) return;
ensureCss.done = true;
try { const _or = new CSSStyleSheet(); _or.replaceSync(_o1); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _or]; } catch { }
}
const _o5 = (ms) => { try { return ms ? new Date(Number(ms)).toLocaleDateString('vi-VN') : ''; } catch { return ''; } };
export function canEditProjects(ctx) {
const _ou = ctx && ctx.user, p = _ou && _ou.perms;
if (p && typeof p.project_edit === 'boolean') return p.project_edit;
const role = _ou && _ou.role;
return !role || role === 'owner' || role === 'manager';
}
export function canResearch(ctx) {
const p = ctx && ctx.user && ctx.user.perms;
return canEditProjects(ctx) && !(p && p.ai === false);
}
export function rowData(env, id) {
const row = (env.projectRows || []).find((_oj) => String(_oj.id) === String(id) && !Number(_oj.deleted));
let d = row ? row.data : null;
if (typeof d === 'string') { try { d = JSON.parse(d); } catch { d = null; } }
return { row: row || null, data: d && typeof d === 'object' ? d : {} };
}
export function manualSources(project, data, ctx, fields = ['price', 'handover', 'types']) {
const d = G.markManual(project, data, fields, { now: Date.now(), by: (ctx && ctx.user && ctx.user.id) || '' });
const _og = {};
if (d.sources) _og.sources = d.sources;
if (d.g1_sources) _og.g1_sources = d.g1_sources;
return _og;
}
export function sourceTag(data, field, testid) {
const _op = G.fieldSource(data, field);
if (!_op) return null;
const by = _o0[_op.by] || 'Cập nhật';
const url = G.safeUrl(_op.url);
const link = url ? h('a', { href: url, target: '_blank', rel: 'noopener', 'data-testid': testid ? testid + '-link' : null }, _op.title || G.hostOf(url) || 'nguồn') : null;
return h('span', { class: 'sl-small sl-muted crs-src', 'data-testid': testid, 'data-by': _op.by || '' },
link ? ['Nguồn: ', link, ' · '] : null, `${by}${_op.at ? ' ' + _o5(_op.at) : ''}`, _op.date ? ` · bài ngày ${dmy(_op.date)}` : '');
}
export function infoBlock(env, p) {
U.ensureCss();
const { data } = rowData(env, p.id);
const _o9 = Object.entries(G.RESEARCH_FIELDS).map(([k, _o7]) => {
const _ov = p[k], has = !(_ov == null || _ov === '' || (Array.isArray(_ov) && !_ov.length));
const _ot = sourceTag(data, k, 'src-' + k);
if (!has && !_ot) return null;
return h('li', { 'data-testid': 'info-' + k },
h('b', null, _o7.label), ': ', has ? G.showFieldValue(k, _ov) : '—', ' ',
_ot || h('span', { class: 'sl-small sl-muted' }, '· chưa ghi nguồn'));
}).filter(Boolean);
if (!_o9.length) return null;
return h('div', { class: 'sl-col', 'data-testid': 'project-info' }, h('h3', null, 'Thông tin dự án & nguồn'), h('ul', { class: 'sl-issues crs-info' }, _o9));
}
export function lastUpdate(env, p) {
if (!env || !p) return '';
const { data } = rowData(env, p.id);
let at = Number(data.g1_research_at) || 0;
for (const _op of Object.values((data.sources && typeof data.sources === 'object') ? data.sources : {})) at = Math.max(at, Number(_op && _op.at) || 0);
return at ? _o5(at) : '';
}
export function estimateText(e, estErr) {
if (estErr) return { txt: estErr, cls: 'g1-err' };
if (!e) return { txt: 'Đang tính chi phí ước tính…', cls: 'sl-muted' };
if (!e.enabled) return { txt: 'Chưa có khoá Gemini trên máy chủ – chưa chạy tự động được. Dùng "Làm qua chat Gemini/Claude" (dán kết quả về đây).', cls: 'g1-warn' };
if (e.free) return { txt: `Chi phí ước tính: 0 USD – trong hạn mức miễn phí của khoá Gemini (mẫu ${e.model}, có tìm Google).`, cls: 'g1-okbox' };
const _oh = Number(e.budget_cap_usd) > 0 && Number(e.budget_spent_usd) + Number(e.usd) > Number(e.budget_cap_usd);
return { txt: `Chi phí ước tính: ≈ ${S.fmtNum(e.usd, 3)} USD / lần (mẫu ${e.model} + tìm Google), cộng vào ngân sách AI` +
(e.budget_cap_usd ? ` – tháng này đã dùng ${S.fmtNum(e.budget_spent_usd, 2)}/${S.fmtNum(e.budget_cap_usd, 0)} USD.` : '.') + (_oh ? ' Lần này sẽ VƯỢT trần – làm qua chat.' : ''), cls: _oh ? 'g1-warn' : 'g1-okbox' };
}
export function errText(e, lead) {
const code = e && e.code;
if (code === 'UNKNOWN_ACTION') return 'Máy chủ chưa có chức năng này – cập nhật máy chủ ở Cài đặt › Phiên bản (nhân viên: nhờ Quản trị). Trong lúc chờ, dùng "Làm qua chat Gemini/Claude".';
if (code === 'NO_GROUNDING') return NO_WEB_TEXT + '.';
return `${lead}: ${(e && e.message) || 'lỗi'}` + (code === 'AI_ERROR' || code === 'QUOTA' ? ' Có thể dùng "Làm qua chat Gemini/Claude".' : '');
}
const _of = (g) => (g.sources || []).some((x) => x && G.safeUrl(x.url));
export function noWebBox(testid, extra) {
return h('div', { class: 'g1-warn sl-col', 'data-testid': testid }, h('b', null, NO_WEB_TEXT + '.'), extra || null);
}
export function aiRunner(K, ctx, o) {
const st = { est: null, estErr: '', busy: false, seq: 0 };
const t = (x) => o.tid + '-' + x;
const _o6 = () => { const _o7 = o.estFactor ? Number(o.estFactor()) || 1 : 1; const e = st.est; return e && _o7 > 1 && !e.free ? { ...e, usd: Math.round(Number(e.usd) * _o7 * 10000) / 10000 } : e; };
function render() {
const { txt, cls } = estimateText(_o6(), st.estErr);
o.estBox.replaceChildren(h('div', { class: cls, 'data-testid': t('est-text') }, txt));
const e = st.est;
const run = K.button(o.hasResult() ? 'Tìm lại' : (o.runText || 'Chạy tìm (Gemini + Google)'), runIt, { kind: 'primary', testid: t('run'), icon: o.hasResult() ? 'refresh' : 'sparkle' });
run.disabled = !(o.staff && e && e.enabled && !st.busy);
const _o3 = K.button('Làm qua chat Gemini/Claude', handoff, { testid: t('handoff'), aiBadge: 'handoff', icon: 'external' });
_o3.disabled = !o.staff;
o.acts.replaceChildren(run, _o3);
}
async function estimate() {
st.est = null; st.estErr = '';
if (!o.staff) { render(); return; }
const seq = ++st.seq;
render();
try {
const _oj = await K.api(ACTION, { prompt: o.prompt(), project_id: o.projectId(), estimate_only: true, grounding: true });
if (seq !== st.seq) return;
st.est = (_oj && _oj.estimate) || null;
if (!st.est) st.estErr = 'Máy chủ không trả chi phí ước tính.';
} catch (e) { if (seq !== st.seq) return; st.estErr = errText(e, 'Chưa tính được chi phí'); }
render();
}
async function runIt() {
if (st.busy || !o.staff) return;
st.busy = true; render();
o.res.replaceChildren(h('div', { class: 'sl-box sl-muted', 'data-testid': t('busy') }, o.busyText || 'Gemini đang tìm trên Google…'));
const asked = o.snapshot ? o.snapshot() : undefined;
try {
if (o.onStart) { try { o.onStart(asked); } catch { } }
const _oj = await K.api(ACTION, { prompt: (o.runPrompt || o.prompt)(), project_id: o.projectId(), grounding: true });
const g = { sources: _oj.sources || [], segments: _oj.segments || [] };
if (o.onNoWeb && !_of(g)) { o.onNoWeb(); return; }
o.onResult(_oj.text, g, { queries: _oj.queries || [], cost: Number(_oj.cost_usd) || 0, by: 'Gemini + Google', asked });
} catch (e) {
if (e && e.code === 'NO_GROUNDING' && o.onNoWeb) { o.onNoWeb(); return; }
o.res.replaceChildren(h('div', { class: 'g1-err', 'data-testid': t('error') }, errText(e, 'Chưa tìm được')));
} finally { st.busy = false; render(); }
}
async function handoff() {
if (!o.staff) return;
let text = null;
const asked = o.snapshot ? o.snapshot() : undefined;
try { if (ctx.ai && typeof ctx.ai.handoff === 'function') text = await ctx.ai.handoff('summarize', o.prompt(), { target: 'gemini' }); } catch { text = null; }
if (!text) { if (!(ctx.ai && ctx.ai.handoff)) K.toast('Máy này chưa mở được chat AI.', 'warn'); return; }
o.onResult(text, { sources: [], segments: [] }, { queries: [], cost: 0, by: 'chat', asked });
}
return { render, estimate, run: runIt, handoff, state: st };
}
export function openResearch(K, ctx, p, opts = {}) {
ensureCss();
const st = { fields: new Set(Object.keys(G.RESEARCH_FIELDS)), est: null, estErr: '', result: null, picks: new Set(), opened: new Set(), busy: false };
const staff = canResearch(ctx);
const chips = h('div', { class: 'sl-chips g1-wrap', role: 'group', 'aria-label': 'Thông tin cần tìm' });
const estBox = h('div', { class: 'sl-col', 'aria-live': 'polite', 'data-testid': 'crs-estimate' });
const acts = h('div', { class: 'sl-row' });
const res = h('div', { class: 'sl-col', 'aria-live': 'polite' });
const _oq = h('div', { class: 'sl-row sl-end' });
const prompt = () => G.researchPrompt(p, [...st.fields]);
const _oa = lastUpdate(opts.env, p);
const _oc = K.modal({ title: '🔄 Cập nhật dự án – ' + p.name, wide: true, testid: 'catalog-research', body: h('div', { class: 'sl g1' },
h('p', { class: 'g1-lead' }, 'Cập nhật thông tin MỚI NHẤT tại thời điểm bấm: Gemini tìm trên Google, mỗi thông tin kèm link nguồn; anh/chị xem bảng CŨ → MỚI, tick dòng muốn lưu.'),
_oa ? h('p', { class: 'sl-small sl-muted', 'data-testid': 'crs-last' }, 'Lần cập nhật trước: ' + _oa) : null,
K.aiNote ? K.aiNote('catalog_research') : null, chips, estBox, acts, res) });
function _ok() {
chips.replaceChildren(...Object.entries(G.RESEARCH_FIELDS).map(([k, _o7]) => h('button', {
type: 'button', class: 'sl-chip' + (st.fields.has(k) ? ' on' : ''), 'aria-pressed': String(st.fields.has(k)), 'data-testid': 'crs-f-' + k,
onclick: () => { if (st.fields.has(k)) { if (st.fields.size > 1) st.fields.delete(k); } else st.fields.add(k); _ok(); } }, _o7.label)));
}
function _ol() {
const e = st.est;
let txt, cls = 'g1-okbox';
if (st.estErr) { txt = st.estErr; cls = 'g1-err'; }
else if (!e) { txt = 'Đang tính chi phí ước tính…'; cls = 'sl-muted'; }
else if (!e.enabled) { txt = 'Chưa có khoá Gemini trên máy chủ – chưa chạy tự động được. Dùng "Làm qua chat Gemini/Claude" (miễn phí, dán kết quả về đây).'; cls = 'g1-warn'; }
else if (e.free) txt = `Chi phí ước tính: 0 USD – trong hạn mức miễn phí của khoá Gemini (mẫu ${e.model}, có tìm Google).`;
else {
const _oh = Number(e.budget_cap_usd) > 0 && Number(e.budget_spent_usd) + Number(e.usd) > Number(e.budget_cap_usd);
txt = `Chi phí ước tính: ≈ ${S.fmtNum(e.usd, 3)} USD / lần (mẫu ${e.model} + tìm Google), cộng vào ngân sách AI` +
(e.budget_cap_usd ? ` – tháng này đã dùng ${S.fmtNum(e.budget_spent_usd, 2)}/${S.fmtNum(e.budget_cap_usd, 0)} USD.` : '.') + (_oh ? ' Lần này sẽ VƯỢT trần – làm qua chat.' : '');
if (_oh) cls = 'g1-warn';
}
estBox.replaceChildren(h('div', { class: cls, 'data-testid': 'crs-est-text' }, txt));
const _oo = staff && e && e.enabled && !st.busy;
const run = K.button(st.result ? 'Tìm lại' : 'Chạy tìm (Gemini + Google)', runIt, { kind: 'primary', testid: 'crs-run', ai: 'catalog_research', icon: st.result ? 'refresh' : 'sparkle' });
run.disabled = !_oo;
acts.replaceChildren(run, K.button('Làm qua chat Gemini/Claude', handoff, { testid: 'crs-handoff', aiBadge: 'handoff', icon: 'external' }));
}
async function estimate() {
try {
const _oj = await K.api(ACTION, { prompt: prompt(), project_id: p.id, estimate_only: true, grounding: true });
st.est = (_oj && _oj.estimate) || null;
if (!st.est) st.estErr = 'Máy chủ không trả chi phí ước tính.';
} catch (e) { st.estErr = errText(e, 'Chưa tính được chi phí'); }
_ol();
}
const _oe = () => { st.result = null; res.replaceChildren(noWebBox('crs-noweb', h('span', { class: 'sl-small' }, 'Dán link vào "🤖 Làm qua chat Gemini/Claude", gửi tài liệu ở "📎 Gửi file cập nhật", hoặc sửa tay ở "✏️ Sửa thông tin".'))); };
async function runIt() {
if (st.busy || !staff) return;
st.busy = true; _ol();
res.replaceChildren(h('div', { class: 'sl-box sl-muted', 'data-testid': 'crs-busy' }, 'Gemini đang tìm trên Google…'));
try {
const _oj = await K.api(ACTION, { prompt: prompt(), project_id: p.id, grounding: true });
const g = { sources: _oj.sources || [], segments: _oj.segments || [] };
if (!_of(g)) { _oe(); return; }
_os(_oj.text, g, { queries: _oj.queries || [], cost: Number(_oj.cost_usd) || 0, by: 'Gemini + Google' });
} catch (e) {
if (e && e.code === 'NO_GROUNDING') { _oe(); return; }
res.replaceChildren(h('div', { class: 'g1-err', 'data-testid': 'crs-error' }, errText(e, 'Chưa tìm được')));
} finally { st.busy = false; _ol(); }
}
async function handoff() {
let text = null;
try { if (ctx.ai && typeof ctx.ai.handoff === 'function') text = await ctx.ai.handoff('summarize', prompt(), { target: 'gemini' }); } catch { text = null; }
if (!text) { if (!(ctx.ai && ctx.ai.handoff)) K.toast('Máy này chưa mở được chat AI.', 'warn'); return; }
_os(text, { sources: [], segments: [] }, { queries: [], cost: 0, by: 'chat' });
}
function _os(text, grounding, meta) {
const _o8 = G.matchSources(G.parseFacts(text), text, grounding);
const diff = G.researchDiff(p, _o8);
st.result = { diff, meta };
st.picks = new Set(diff.filter((d) => d.ok && d.changed && d.fact.status === 'grounded').map((d) => d.field));
st.opened = new Set();
_om(); _ol();
}
const canPick = (d) => d.ok && (d.fact.status === 'grounded' || (d.fact.status === 'ai_only' && !!G.safeUrl(d.fact.url)) || st.opened.has(d.field));
function _om() {
const _oj = st.result;
if (!_oj) { res.replaceChildren(); return; }
if (!_oj.diff.length) { res.replaceChildren(h('div', { class: 'g1-warn', 'data-testid': 'crs-empty' }, 'AI không tìm được thông tin có nguồn đáng tin. Thử lại sau hoặc sửa tay ở "✏️ Sửa thông tin".')); return; }
const rows = _oj.diff.map((d) => {
const _o7 = d.fact, can = canPick(d);
const cb = h('input', { type: 'checkbox', checked: st.picks.has(d.field) && can, disabled: !can || !staff, 'aria-label': 'Chọn lưu ' + d.label, 'data-testid': 'crs-pick-' + d.field,
onchange: (e) => { if (e.target.checked) st.picks.add(d.field); else st.picks.delete(d.field); _on(); } });
const _ob = [...(_o7.sources || []).slice(0, 3).map((_op, i) => h('a', { href: _op.url, target: '_blank', rel: 'noopener', 'data-testid': `crs-src-${d.field}-${i}` }, _op.title || G.hostOf(_op.url) || 'Nguồn')),
G.safeUrl(_o7.url) && !(_o7.sources || []).length ? h('a', { href: G.safeUrl(_o7.url), target: '_blank', rel: 'noopener', 'data-testid': 'crs-ailink-' + d.field }, G.hostOf(_o7.url) || _o7.url) : null].filter(Boolean);
return h('tr', { 'data-testid': 'crs-row-' + d.field, 'data-status': _o7.status },
h('td', null, pickBox(cb)), h('td', null, h('b', null, d.label)),
h('td', null, h('span', { class: 'crs-lbl' }, 'CŨ'), d.old),
h('td', { class: d.changed && d.ok ? 'sl-ok' : '' }, h('span', { class: 'crs-lbl' }, 'MỚI'), d.new, !d.changed && d.ok ? h('div', { class: 'sl-small sl-muted' }, '(trùng dữ liệu đang có)') : null,
d.error ? h('div', { class: 'sl-bad sl-small' }, d.error + (_o7.status === 'missing' ? ' – không lưu được' : '')) : null,
_oi(_o7) ? h('div', { class: 'sl-small sl-muted' }, '“' + _oi(_o7) + '”') : null),
h('td', { class: 'g1-src' }, stChip(_o7.status), h('div', { class: 'sl-col sl-small' }, _ob),
_o7.date ? h('div', { class: 'sl-small sl-muted' }, 'Ngày nguồn ' + dmy(_o7.date)) : null));
});
res.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'crs-result' },
h('h3', null, `CŨ → MỚI (${_oj.diff.length} mục · ${_oj.meta.by}${_oj.meta.cost ? ` · ${S.fmtNum(_oj.meta.cost, 4)} USD` : ''})`),
_oj.meta.queries.length ? h('div', { class: 'sl-small sl-muted', 'data-testid': 'crs-queries' }, 'Đã tìm: ' + _oj.meta.queries.join(' · ')) : null,
h('div', { class: 'sl-scroll table-wrap', 'data-testid': 'crs-table-wrap' }, h('table', { class: 'sl-tbl g1-tbl g1-stack' },
h('thead', null, h('tr', null, h('th', null, 'Lưu'), h('th', null, 'Mục'), h('th', null, 'CŨ (đang có)'), h('th', null, 'MỚI (AI tìm được)'), h('th', null, 'Nguồn'))), h('tbody', null, rows))),
h('p', { class: 'g1-legal' }, 'Bấm link để đọc nguồn trước khi lưu. Dòng không có link nguồn không lưu được.'),
_oq));
_on();
}
const _o4 = () => (st.result ? st.result.diff.filter((d) => st.picks.has(d.field) && canPick(d)) : []);
function _on() {
const _od = _o4().length;
const _o2 = K.button(`Lưu ${_od} mục vào dự án`, save, { kind: 'primary', testid: 'crs-save', icon: 'check' });
_o2.disabled = !_od || !staff;
_oq.replaceChildren(_o2);
}
async function save() {
const rows = _o4();
if (!rows.length || !staff) return;
const env = await S.loadEnv(ctx);
const { row, data } = rowData(env, p.id);
const next = G.applyResearch(data, rows, { now: Date.now(), by: (ctx.user && ctx.user.id) || '' });
await K.put('projects', { ...(row || {}), id: p.id, name: row && row.name ? row.name : p.name, dev: next.dev || (row && row.dev) || p.dev || '', data: JSON.stringify(next), deleted: 0 });
K.toast(`Đã cập nhật ${rows.length} mục cho ${p.name} (kèm nguồn + ngày).`, 'ok');
_oc.close();
try { if (opts.onSaved) await opts.onSaved(next); } catch { }
}
_ok(); _ol(); estimate();
return { close: () => _oc.close() };
}
export function selftest() {
const t = 'FACT | handover | 06/2029 | https://a.example.vn/x | "q" |\nFACT | legal | GPXD 01 | | "" |';
const _oc = G.matchSources(G.parseFacts(t), t, { sources: [{ title: 'a.example.vn', url: 'https://g.example/r' }], segments: [] });
const d = G.researchDiff({ handover: '2027-12' }, _oc);
const _og = G.applyResearch({ keep: 1 }, d, { now: 1, by: 'u' });
const ok = _oc[0].status === 'grounded' && _oc[1].status === 'missing' && _og.keep === 1 && _og.handover === '2029-06' && !_og.legal && _og.sources.handover.by === 'ai';
return ok ? { ok: true } : { ok: false, details: 'Luật nguồn AI tìm thông tin lỗi' };
}

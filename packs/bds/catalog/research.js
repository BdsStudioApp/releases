import { h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as U from '../g1_lib/ui.js';
export const ACTION = 'catalog.research';
const _o2 = { grounded: 'Có nguồn Google', ai_only: 'Link AI ghi – mở kiểm', missing: 'Thiếu link nguồn' };
const _o0 = { ai: 'AI tìm', file: 'Từ tệp', manual: 'Sửa tay' };
const _og = (_o8) => String(_o8.quote || '').replace(/^["“']+|["”']+$/g, '').trim();
const dmy = (iso) => String(iso || '').split('-').reverse().join('/');
const _o1 = '.crs-lbl{display:none;font-size:.78em;font-weight:700;letter-spacing:.02em;color:var(--sl-muted,rgba(127,127,127,.95));margin-right:6px}' +
'[data-testid=crs-result] td{overflow-wrap:anywhere;word-break:break-word}[data-testid=crs-result] .g1-src{min-width:8em}' +
'@media (max-width:600px){.crs-lbl{display:inline}}';
function ensureCss() {
S.ensureSalesCss(); U.ensureCss();
if (typeof document === 'undefined' || ensureCss.done) return;
ensureCss.done = true;
try { const _or = new CSSStyleSheet(); _or.replaceSync(_o1); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _or]; } catch { }
}
const _o6 = (ms) => { try { return ms ? new Date(Number(ms)).toLocaleDateString('vi-VN') : ''; } catch { return ''; } };
export function canEditProjects(ctx) {
const _ow = ctx && ctx.user, p = _ow && _ow.perms;
if (p && typeof p.project_edit === 'boolean') return p.project_edit;
const role = _ow && _ow.role;
return !role || role === 'owner' || role === 'manager';
}
export function canResearch(ctx) {
const p = ctx && ctx.user && ctx.user.perms;
return canEditProjects(ctx) && !(p && p.ai === false);
}
export function rowData(env, id) {
const row = (env.projectRows || []).find((_oh) => String(_oh.id) === String(id) && !Number(_oh.deleted));
let d = row ? row.data : null;
if (typeof d === 'string') { try { d = JSON.parse(d); } catch { d = null; } }
return { row: row || null, data: d && typeof d === 'object' ? d : {} };
}
export function manualSources(project, data, ctx, fields = ['price', 'handover', 'types']) {
const d = G.markManual(project, data, fields, { now: Date.now(), by: (ctx && ctx.user && ctx.user.id) || '' });
const _oe = {};
if (d.sources) _oe.sources = d.sources;
if (d.g1_sources) _oe.g1_sources = d.g1_sources;
return _oe;
}
export function sourceTag(data, field, testid) {
const _op = G.fieldSource(data, field);
if (!_op) return null;
const by = _o0[_op.by] || 'Cập nhật';
const url = G.safeUrl(_op.url);
const link = url ? h('a', { href: url, target: '_blank', rel: 'noopener', 'data-testid': testid ? testid + '-link' : null }, _op.title || G.hostOf(url) || 'nguồn') : null;
return h('span', { class: 'sl-small sl-muted crs-src', 'data-testid': testid, 'data-by': _op.by || '' },
link ? ['Nguồn: ', link, ' · '] : null, `${by}${_op.at ? ' ' + _o6(_op.at) : ''}`, _op.date ? ` · bài ngày ${dmy(_op.date)}` : '');
}
export function infoBlock(env, p) {
U.ensureCss();
const { data } = rowData(env, p.id);
const _oa = Object.entries(G.RESEARCH_FIELDS).map(([k, _o8]) => {
const _ox = p[k], has = !(_ox == null || _ox === '' || (Array.isArray(_ox) && !_ox.length));
const _ou = sourceTag(data, k, 'src-' + k);
if (!has && !_ou) return null;
return h('li', { 'data-testid': 'info-' + k },
h('b', null, _o8.label), ': ', has ? G.showFieldValue(k, _ox) : '—', ' ',
_ou || h('span', { class: 'sl-small sl-muted' }, '· chưa ghi nguồn'));
}).filter(Boolean);
if (!_oa.length) return null;
return h('div', { class: 'sl-col', 'data-testid': 'project-info' }, h('h3', null, 'Thông tin dự án & nguồn'), h('ul', { class: 'sl-issues crs-info' }, _oa));
}
export function openResearch(K, ctx, p, opts = {}) {
ensureCss();
const st = { fields: new Set(Object.keys(G.RESEARCH_FIELDS)), est: null, estErr: '', result: null, picks: new Set(), opened: new Set(), busy: false };
const _ot = canResearch(ctx);
const chips = h('div', { class: 'sl-chips', role: 'group', 'aria-label': 'Thông tin cần tìm' });
const estBox = h('div', { class: 'sl-col', 'aria-live': 'polite', 'data-testid': 'crs-estimate' });
const acts = h('div', { class: 'sl-row' });
const _om = h('div', { class: 'sl-col', 'aria-live': 'polite' });
const _oq = h('div', { class: 'sl-row sl-end' });
const prompt = () => G.researchPrompt(p, [...st.fields]);
const _oc = K.modal({ title: '🔍 AI tìm thông tin – ' + p.name, wide: true, testid: 'catalog-research', body: h('div', { class: 'sl g1' },
h('p', { class: 'g1-lead' }, 'Gemini tìm trên Google thông tin mới nhất của dự án. Mỗi thông tin kèm link nguồn; anh/chị xem bảng CŨ → MỚI, tick dòng muốn lưu.'),
K.aiNote ? K.aiNote('catalog_research') : null, chips, estBox, acts, _om) });
function _oi() {
chips.replaceChildren(...Object.entries(G.RESEARCH_FIELDS).map(([k, _o8]) => h('button', {
type: 'button', class: 'sl-chip' + (st.fields.has(k) ? ' on' : ''), 'aria-pressed': String(st.fields.has(k)), 'data-testid': 'crs-f-' + k,
onclick: () => { if (st.fields.has(k)) { if (st.fields.size > 1) st.fields.delete(k); } else st.fields.add(k); _oi(); } }, _o8.label)));
}
function _oj() {
const e = st.est;
let _ov, cls = 'g1-okbox';
if (st.estErr) { _ov = st.estErr; cls = 'g1-err'; }
else if (!e) { _ov = 'Đang tính chi phí ước tính…'; cls = 'sl-muted'; }
else if (!e.enabled) { _ov = 'Chưa có khoá Gemini trên máy chủ – chưa chạy tự động được. Dùng "Làm qua chat Gemini/Claude" (miễn phí, dán kết quả về đây).'; cls = 'g1-warn'; }
else if (e.free) _ov = `Chi phí ước tính: 0 USD – trong hạn mức miễn phí của khoá Gemini (mẫu ${e.model}, có tìm Google).`;
else {
const _of = Number(e.budget_cap_usd) > 0 && Number(e.budget_spent_usd) + Number(e.usd) > Number(e.budget_cap_usd);
_ov = `Chi phí ước tính: ≈ ${S.fmtNum(e.usd, 3)} USD / lần (mẫu ${e.model} + tìm Google), cộng vào ngân sách AI` +
(e.budget_cap_usd ? ` – tháng này đã dùng ${S.fmtNum(e.budget_spent_usd, 2)}/${S.fmtNum(e.budget_cap_usd, 0)} USD.` : '.') + (_of ? ' Lần này sẽ VƯỢT trần – làm qua chat.' : '');
if (_of) cls = 'g1-warn';
}
estBox.replaceChildren(h('div', { class: cls, 'data-testid': 'crs-est-text' }, _ov));
const _oo = _ot && e && e.enabled && !st.busy;
const _on = K.button(st.result ? 'Tìm lại' : 'Chạy tìm (Gemini + Google)', runIt, { kind: 'primary', testid: 'crs-run', ai: 'catalog_research', icon: st.result ? 'refresh' : 'sparkle' });
_on.disabled = !_oo;
acts.replaceChildren(_on, K.button('Làm qua chat Gemini/Claude', handoff, { testid: 'crs-handoff', aiBadge: 'handoff', icon: 'external' }));
}
async function estimate() {
try {
const _oh = await K.api(ACTION, { prompt: prompt(), project_id: p.id, estimate_only: true });
st.est = (_oh && _oh.estimate) || null;
if (!st.est) st.estErr = 'Máy chủ không trả chi phí ước tính.';
} catch (e) { st.estErr = _o7(e, 'Chưa tính được chi phí'); }
_oj();
}
function _o7(e, lead) {
const code = e && e.code;
if (code === 'UNKNOWN_ACTION') return 'Máy chủ chưa có chức năng này – cập nhật máy chủ ở Cài đặt › Phiên bản (nhân viên: nhờ Quản trị). Trong lúc chờ, dùng "Làm qua chat Gemini/Claude".';
return `${lead}: ${(e && e.message) || 'lỗi'}` + (code === 'AI_ERROR' || code === 'QUOTA' ? ' Có thể dùng "Làm qua chat Gemini/Claude".' : '');
}
async function runIt() {
if (st.busy || !_ot) return;
st.busy = true; _oj();
_om.replaceChildren(h('div', { class: 'sl-box sl-muted', 'data-testid': 'crs-busy' }, 'Gemini đang tìm trên Google…'));
try {
const _oh = await K.api(ACTION, { prompt: prompt(), project_id: p.id });
_os(_oh.text, { sources: _oh.sources || [], segments: _oh.segments || [] }, { queries: _oh.queries || [], cost: Number(_oh.cost_usd) || 0, by: 'Gemini + Google' });
} catch (e) {
_om.replaceChildren(h('div', { class: 'g1-err', 'data-testid': 'crs-error' }, _o7(e, 'Chưa tìm được')));
} finally { st.busy = false; _oj(); }
}
async function handoff() {
let text = null;
try { if (ctx.ai && typeof ctx.ai.handoff === 'function') text = await ctx.ai.handoff('summarize', prompt(), { target: 'gemini' }); } catch { text = null; }
if (!text) { if (!(ctx.ai && ctx.ai.handoff)) K.toast('Máy này chưa mở được chat AI.', 'warn'); return; }
_os(text, { sources: [], segments: [] }, { queries: [], cost: 0, by: 'chat' });
}
function _os(text, grounding, meta) {
const _o9 = G.matchSources(G.parseFacts(text), text, grounding);
const diff = G.researchDiff(p, _o9);
st.result = { diff, meta };
st.picks = new Set(diff.filter((d) => d.ok && d.changed && d.fact.status === 'grounded').map((d) => d.field));
st.opened = new Set();
_ok(); _oj();
}
const canPick = (d) => d.ok && (d.fact.status === 'grounded' || st.opened.has(d.field));
function _ok() {
const _oh = st.result;
if (!_oh) { _om.replaceChildren(); return; }
if (!_oh.diff.length) { _om.replaceChildren(h('div', { class: 'g1-warn', 'data-testid': 'crs-empty' }, 'AI không tìm được thông tin có nguồn đáng tin. Thử lại sau hoặc sửa tay ở "✏️ Sửa thông tin".')); return; }
const rows = _oh.diff.map((d) => {
const _o8 = d.fact, can = canPick(d);
const _o4 = h('input', { type: 'checkbox', checked: st.picks.has(d.field) && can, disabled: !can || !_ot, 'aria-label': 'Chọn lưu ' + d.label, 'data-testid': 'crs-pick-' + d.field,
onchange: (e) => { if (e.target.checked) st.picks.add(d.field); else st.picks.delete(d.field); _ol(); } });
const _ob = [...(_o8.sources || []).slice(0, 3).map((_op, i) => h('a', { href: _op.url, target: '_blank', rel: 'noopener', 'data-testid': `crs-src-${d.field}-${i}` }, _op.title || G.hostOf(_op.url) || 'Nguồn Google')),
_o8.url ? h('a', { href: _o8.url, target: '_blank', rel: 'noopener', 'data-testid': 'crs-ailink-' + d.field,
onclick: () => { if (!st.opened.has(d.field)) { st.opened.add(d.field); setTimeout(_ok, 50); } } }, (_o8.sources || []).length ? 'Link AI ghi' : G.hostOf(_o8.url) || _o8.url) : null].filter(Boolean);
return h('tr', { 'data-testid': 'crs-row-' + d.field, 'data-status': _o8.status },
h('td', null, _o4), h('td', null, h('b', null, d.label)),
h('td', null, h('span', { class: 'crs-lbl' }, 'CŨ'), d.old),
h('td', { class: d.changed && d.ok ? 'sl-ok' : '' }, h('span', { class: 'crs-lbl' }, 'MỚI'), d.new, !d.changed && d.ok ? h('div', { class: 'sl-small sl-muted' }, '(trùng dữ liệu đang có)') : null,
d.error ? h('div', { class: 'sl-bad sl-small' }, d.error + (_o8.status === 'missing' ? ' – không lưu được' : '')) : null,
_og(_o8) ? h('div', { class: 'sl-small sl-muted' }, '“' + _og(_o8) + '”') : null),
h('td', { class: 'g1-src' }, h('span', { class: 'g1-st ' + _o8.status }, _o2[_o8.status]), h('div', { class: 'sl-col sl-small' }, _ob),
_o8.date ? h('div', { class: 'sl-small sl-muted' }, 'Ngày nguồn ' + dmy(_o8.date)) : null));
});
_om.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'crs-result' },
h('h3', null, `CŨ → MỚI (${_oh.diff.length} mục · ${_oh.meta.by}${_oh.meta.cost ? ` · ${S.fmtNum(_oh.meta.cost, 4)} USD` : ''})`),
_oh.meta.queries.length ? h('div', { class: 'sl-small sl-muted', 'data-testid': 'crs-queries' }, 'Đã tìm: ' + _oh.meta.queries.join(' · ')) : null,
h('div', { class: 'sl-scroll table-wrap', 'data-testid': 'crs-table-wrap' }, h('table', { class: 'sl-tbl g1-tbl g1-stack' },
h('thead', null, h('tr', null, h('th', null, 'Lưu'), h('th', null, 'Mục'), h('th', null, 'CŨ (đang có)'), h('th', null, 'MỚI (AI tìm được)'), h('th', null, 'Nguồn'))), h('tbody', null, rows))),
h('p', { class: 'g1-legal' }, '"Link AI ghi": tên miền không nằm trong kết quả Google – bấm mở link, đọc đúng nội dung rồi mới tick. Dòng không có link nguồn không lưu được.'),
_oq));
_ol();
}
const _o5 = () => (st.result ? st.result.diff.filter((d) => st.picks.has(d.field) && canPick(d)) : []);
function _ol() {
const _od = _o5().length;
const _o3 = K.button(`Lưu ${_od} mục vào dự án`, save, { kind: 'primary', testid: 'crs-save', icon: 'check' });
_o3.disabled = !_od || !_ot;
_oq.replaceChildren(_o3);
}
async function save() {
const rows = _o5();
if (!rows.length || !_ot) return;
const env = await S.loadEnv(ctx);
const { row, data } = rowData(env, p.id);
const next = G.applyResearch(data, rows, { now: Date.now(), by: (ctx.user && ctx.user.id) || '' });
await K.put('projects', { ...(row || {}), id: p.id, name: row && row.name ? row.name : p.name, dev: next.dev || (row && row.dev) || p.dev || '', data: JSON.stringify(next), deleted: 0 });
K.toast(`Đã cập nhật ${rows.length} mục cho ${p.name} (kèm nguồn + ngày).`, 'ok');
_oc.close();
try { if (opts.onSaved) await opts.onSaved(next); } catch { }
}
_oi(); _oj(); estimate();
return { close: () => _oc.close() };
}
export function selftest() {
const t = 'FACT | handover | 06/2029 | https://a.example.vn/x | "q" |\nFACT | legal | GPXD 01 | | "" |';
const _oc = G.matchSources(G.parseFacts(t), t, { sources: [{ title: 'a.example.vn', url: 'https://g.example/r' }], segments: [] });
const d = G.researchDiff({ handover: '2027-12' }, _oc);
const _oe = G.applyResearch({ keep: 1 }, d, { now: 1, by: 'u' });
const ok = _oc[0].status === 'grounded' && _oc[1].status === 'missing' && _oe.keep === 1 && _oe.handover === '2029-06' && !_oe.legal && _oe.sources.handover.by === 'ai';
return ok ? { ok: true } : { ok: false, details: 'Luật nguồn AI tìm thông tin lỗi' };
}

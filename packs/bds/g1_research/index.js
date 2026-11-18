import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as U from '../g1_lib/ui.js';
import * as CR from '../catalog/research.js';
const _oc = (_o5) => String(_o5.quote || '').replace(/^["“']+|["”']+$/g, '').trim();
const _o1 = { grounded: 'Có nguồn Google', ai_only: 'Link AI ghi – mở kiểm', missing: 'Thiếu nguồn' };
export async function mount(el, ctx) {
S.ensureSalesCss(); U.ensureCss();
const _o0 = kit(ctx);
let env = await S.loadEnv(ctx);
const _on = CR.canResearch(ctx);
const _ob = S.hashParams();
const st = { project: _ob.get('project') || (env.projects[0] || {}).id, fields: new Set(Object.keys(G.RESEARCH_FIELDS)), result: null, picks: new Set(), opened: new Set(), busy: false };
const _oi = h('div', { class: 'sl g1', 'data-testid': 'g1-research' });
el.innerHTML = ''; el.appendChild(_oi);
const head = h('div', { class: 'sl-box sl-col' }), res = h('div', { class: 'sl-col', 'aria-live': 'polite' }), known = h('div', { class: 'sl-col' });
_oi.append(U.title('AI cập nhật thông tin dự án'),
h('p', { class: 'g1-lead' }, 'Gemini tìm trên Google thông tin mới nhất của dự án. Mỗi thông tin kèm link nguồn; anh/chị duyệt từng dòng CŨ → MỚI rồi mới lưu.'), head, res, known);
const project = () => env.project(st.project);
function _oe() {
head.replaceChildren(
h('label', { class: 'sl-f' }, 'Dự án', _o0.select(env.projects.map((_oa) => [_oa.id, `${_oa.name} · ${_oa.dev || ''}`]), st.project, { 'data-testid': 'g1-rs-project',
onchange: (e) => { st.project = e.target.value; st.result = null; _og(); _of(); } })),
h('div', { class: 'sl-chips g1-wrap', role: 'group', 'aria-label': 'Thông tin cần tìm' }, Object.entries(G.RESEARCH_FIELDS).map(([k, _o5]) => h('button', {
type: 'button', class: 'sl-chip' + (st.fields.has(k) ? ' on' : ''), 'aria-pressed': String(st.fields.has(k)), 'data-testid': 'g1-rs-f-' + k,
onclick: () => { if (st.fields.has(k)) st.fields.delete(k); else st.fields.add(k); _oe(); } }, _o5.label))),
_on ? h('div', { class: 'sl-row' },
_o0.button('🔎 Tìm bằng Gemini + Google', run, { kind: 'primary', testid: 'g1-rs-run', ai: 'catalog_research' }),
_o0.button('🤖 Làm bằng Gemini qua chat', handoff, { testid: 'g1-rs-handoff', aiBadge: 'handoff' }))
: h('p', { class: 'g1-warn' }, 'Chỉ Quản trị hoặc Quản lý được cho AI tìm và cập nhật thông tin dự án.'),
h('p', { class: 'g1-legal' }, 'Gemini miễn phí theo hạn mức của khoá; vượt hạn mức hoặc tắt "miễn phí" thì mỗi lần tìm ~0,04 USD, cộng vào ngân sách AI.'));
}
async function run() {
if (st.busy) return;
const _oa = project(); if (!_oa) return;
let est = null;
try { est = (await _o0.api('g1.research', { prompt: G.researchPrompt(_oa, [...st.fields]), project_id: _oa.id, estimate_only: true })).estimate || null; } catch { est = null; }
if (est && est.enabled === false) { res.replaceChildren(h('div', { class: 'g1-warn', 'data-testid': 'g1-rs-error' }, 'Chưa có khoá Gemini trên máy chủ – dùng "Làm bằng Gemini qua chat" (miễn phí, dán kết quả về đây).')); return; }
if (!(await _o0.aiConfirm('catalog_research', { est, testid: 'g1-rs-cost' }))) return;
st.busy = true;
res.replaceChildren(h('div', { class: 'sl-box sl-muted', 'data-testid': 'g1-rs-busy' }, 'Gemini đang tìm trên Google…'));
try {
const _od = await _o0.api('g1.research', { prompt: G.researchPrompt(_oa, [...st.fields]), project_id: _oa.id });
_ol(_od.text, { sources: _od.sources || [], segments: _od.segments || [] }, { queries: _od.queries || [], cost: _od.cost_usd || 0, by: 'Gemini + Google' });
} catch (e) {
const code = e && e.code;
res.replaceChildren(h('div', { class: 'g1-err', 'data-testid': 'g1-rs-error' },
code === 'UNKNOWN_ACTION' ? 'Máy chủ chưa có chức năng này – cập nhật máy chủ ở Cài đặt › Phiên bản (nhân viên: nhờ Quản trị). Trong lúc chờ, dùng "Làm bằng Gemini qua chat".'
: 'Chưa tìm được: ' + ((e && e.message) || 'lỗi') + (code === 'AI_ERROR' || code === 'QUOTA' ? ' Có thể dùng "Làm bằng Gemini qua chat".' : '')));
} finally { st.busy = false; }
}
async function handoff() {
const _oa = project(); if (!_oa) return;
const prompt = G.researchPrompt(_oa, [...st.fields]);
let text = null;
try { if (ctx.ai && typeof ctx.ai.handoff === 'function') text = await ctx.ai.handoff('summarize', prompt, { target: 'gemini' }); } catch { text = null; }
if (!text) return;
_ol(text, { sources: [], segments: [] }, { queries: [], cost: 0, by: 'chat' });
}
function _ol(text, grounding, meta) {
const _oa = project();
const _o6 = G.matchSources(G.parseFacts(text), text, grounding);
const diff = G.researchDiff(_oa, _o6);
st.result = { diff, meta, at: Date.now() };
st.picks = new Set(diff.filter((_o4) => _o4.ok && _o4.changed && _o4.fact.status === 'grounded').map((_o4) => _o4.field));
st.opened = new Set();
_og();
}
function _og() {
const _od = st.result;
if (!_od) { res.replaceChildren(); return; }
if (!_od.diff.length) { res.replaceChildren(h('div', { class: 'g1-warn', 'data-testid': 'g1-rs-empty' }, 'AI không tìm được thông tin có nguồn đáng tin. Thử lại sau hoặc tự cập nhật ở Bảng hàng.')); return; }
const rows = _od.diff.map((_o4) => {
const _o5 = _o4.fact, can = _o4.ok && (_o5.status === 'grounded' || st.opened.has(_o4.field));
const _o3 = h('input', { type: 'checkbox', checked: st.picks.has(_o4.field) && can, disabled: !can, 'aria-label': 'Chọn lưu ' + _o4.label, 'data-testid': 'g1-rs-pick-' + _o4.field,
onchange: (e) => { if (e.target.checked) st.picks.add(_o4.field); else st.picks.delete(_o4.field); _oh(); } });
const _o7 = [...(_o5.sources || []).filter((s) => G.safeUrl(s.url)).slice(0, 3).map((s, i) => h('a', { href: G.safeUrl(s.url), target: '_blank', rel: 'noopener', 'data-testid': `g1-rs-src-${_o4.field}-${i}` }, s.title || G.hostOf(s.url) || 'Nguồn Google')),
G.safeUrl(_o5.url) ? h('a', { href: G.safeUrl(_o5.url), target: '_blank', rel: 'noopener', 'data-testid': 'g1-rs-ailink-' + _o4.field, onclick: () => { st.opened.add(_o4.field); setTimeout(_og, 50); } }, (_o5.sources || []).length ? 'Link AI ghi' : G.hostOf(_o5.url) || _o5.url) : null].filter(Boolean);
return h('tr', { 'data-testid': 'g1-rs-row-' + _o4.field, 'data-status': _o5.status },
h('td', null, h('label', { class: 'g1-pick' }, _o3)), h('td', null, h('b', null, _o4.label)),
h('td', { 'data-l': 'Đang có' }, _o4.old), h('td', { class: _o4.changed && _o4.ok ? 'sl-ok' : '', 'data-l': 'AI tìm được' }, _o4.new, _o4.error ? h('div', { class: 'sl-bad sl-small' }, _o4.error) : null, _oc(_o5) ? h('div', { class: 'sl-small sl-muted' }, '“' + _oc(_o5) + '”') : null),
h('td', { class: 'g1-src', 'data-l': 'Nguồn' }, h('span', { class: 'g1-st ' + _o5.status }, _o1[_o5.status]), h('div', { class: 'sl-col sl-small' }, _o7), _o5.date ? h('div', { class: 'sl-small sl-muted' }, 'Ngày nguồn ' + _o5.date.split('-').reverse().join('/')) : null));
});
res.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'g1-rs-result' },
h('h3', null, `CŨ → MỚI (${_od.diff.length} mục · ${_od.meta.by})`),
_od.meta.queries.length ? h('div', { class: 'sl-small sl-muted', 'data-testid': 'g1-rs-queries' }, 'Đã tìm: ' + _od.meta.queries.join(' · ')) : null,
h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl g1-tbl g1-stack' },
h('thead', null, h('tr', null, h('th', null, 'Lưu'), h('th', null, 'Mục'), h('th', null, 'Đang có'), h('th', null, 'AI tìm được'), h('th', null, 'Nguồn'))), h('tbody', null, rows))),
h('p', { class: 'g1-legal' }, '"Link AI ghi": tên miền không nằm trong kết quả Google – bấm mở link, đọc đúng nội dung rồi mới tick chọn.'),
_ok));
_oh();
}
const _ok = h('div', { class: 'sl-row sl-end' });
function _oh() {
const _o9 = st.result ? st.result.diff.filter((_o4) => st.picks.has(_o4.field) && _o4.ok).length : 0;
const _o2 = _o0.button(`💾 Lưu ${_o9} mục vào dự án`, save, { kind: 'primary', testid: 'g1-rs-save' });
_o2.disabled = !_o9 || !_on;
_ok.replaceChildren(_o2);
}
async function save() {
const _oa = project(); if (!_oa || !st.result) return;
const rows = st.result.diff.filter((_o4) => st.picks.has(_o4.field) && _o4.ok && (_o4.fact.status === 'grounded' || st.opened.has(_o4.field)));
if (!rows.length) return;
const old = env.projectRows.find((_od) => String(_od.id) === _oa.id);
let data = old && !Number(old.deleted) ? old.data : {};
if (typeof data === 'string') { try { data = JSON.parse(data); } catch { data = {}; } }
const next = G.applyResearch(data, rows, { now: Date.now(), by: (ctx.user && ctx.user.id) || '' });
const _oj = { ...(old && !Number(old.deleted) ? old : {}), id: _oa.id, name: _oa.name, dev: next.dev || _oa.dev || '', data: JSON.stringify(next), deleted: 0 };
await _o0.put('projects', _oj);
_o0.toast(`Đã cập nhật ${rows.length} mục cho ${_oa.name} (kèm nguồn).`, 'ok');
env = await S.loadEnv(ctx);
st.result = null; _og(); _of();
}
function _of() {
const _oj = env.projectRows.find((_od) => String(_od.id) === st.project && !Number(_od.deleted));
let _o4 = _oj ? _oj.data : null; if (typeof _o4 === 'string') { try { _o4 = JSON.parse(_o4); } catch { _o4 = null; } }
const _om = (_o4 && _o4.g1_sources) || {};
const keys = Object.keys(_om);
known.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'g1-rs-known' },
h('h3', null, 'Nguồn của thông tin đã lưu'),
keys.length ? h('ul', { class: 'sl-issues' }, keys.map((k) => h('li', { 'data-testid': 'g1-rs-known-' + k },
h('b', null, (G.RESEARCH_FIELDS[k] || {}).label || k), ': ', String(Array.isArray(_o4[k]) ? (k === 'price' ? _o4[k].join('–') + ' triệu/m²' : S.typesToText(_o4[k]).replace(/\n/g, '; ')) : _o4[k] ?? ''), ' · ',
G.safeUrl(_om[k] && _om[k].url) ? h('a', { href: G.safeUrl(_om[k].url), target: '_blank', rel: 'noopener' }, _om[k].title || 'nguồn') : ((_om[k] && _om[k].title) || 'nguồn'), _om[k].at ? ` · lưu ${new Date(_om[k].at).toLocaleDateString('vi-VN')}` : '')))
: h('p', { class: 'sl-muted' }, 'Chưa có thông tin nào do AI cập nhật cho dự án này.')));
}
_oe(); _og(); _of();
return _oi;
}
export default {
manifest: { id: 'g1_research', title: 'AI cập nhật dự án', icon: '🔎', screen: 'sales', order: 120, version: '0.1.0', status: 'ready',
help: 'Gemini tìm trên Google thông tin mới của dự án (CĐT, vị trí, bàn giao, giá, loại căn, pháp lý…), mỗi thông tin kèm link nguồn; duyệt CŨ → MỚI rồi mới lưu.' },
mount,
async selftest() {
const t = 'FACT | handover | 06/2029 | https://a.example.vn/x | "q" |';
const _o8 = G.matchSources(G.parseFacts(t), t, { sources: [{ title: 'a.example.vn', url: 'https://g.example/r' }], segments: [] });
return _o8[0] && _o8[0].status === 'grounded' ? { ok: true } : { ok: false, details: 'Gắn nguồn lỗi' };
},
};

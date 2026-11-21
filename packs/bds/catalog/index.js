import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as R from './research.js';
import * as CU from './upload.js';
import * as AD from './add.js';
import * as A from './add_logic.js';
import * as AN from './add_new.js';
import * as N from './research_new_logic.js';
import * as LU from '../_lib/layout_units.js';
import * as TS from './structure.js';
import * as T from './structure_logic.js';
const _o1 = [
['all', 'Mọi mức giá', null, null], ['lt70', 'Dưới 70 tr/m²', null, 70], ['70-100', '70–100 tr/m²', 70, 100],
['100-150', '100–150 tr/m²', 100, 150], ['gt150', 'Trên 150 tr/m²', 150, null],
];
const STATUS = { sale: 'Đang bán', soon: 'Sắp mở bán', done: 'Đã bàn giao', ask: 'Nhận bảng giá', low: 'Thấp tầng' };
const _o0 = 'bds.catalog.filter';
const loadF = () => { try { return JSON.parse(localStorage.getItem(_o0)) || {}; } catch { return {}; } };
const _o13 = (_o9) => { try { localStorage.setItem(_o0, JSON.stringify(_o9)); } catch { } };
const _og = (p) => p.handover ? 'Bàn giao ' + S.ymLabel(p.handover) : 'Bàn giao: chưa công bố';
const priceLabel = (p) => p.price ? `${S.fmtNum(p.price[0], 1)}–${S.fmtNum(p.price[1], 1)} triệu/m²` : 'Chưa có giá';
const _oh = (p) => p.img || (p.added || p.created || (p.overridden && !p.hue) ? '' : `assets/projects/${p.id}.webp`);
export async function mount(_o7, ctx) {
S.ensureSalesCss();
AN.ensureCss(); AD.ensureCss();
const K = kit(ctx);
const _o9 = { dev: 'all', area: 'all', band: 'all', q: '', ...loadF() };
const _o10 = h('div', { class: 'sl', 'data-testid': 'catalog' });
_o7.innerHTML = '';
_o7.appendChild(_o10);
let env = await S.loadEnv(ctx);
const _ow = S.hashParams();
if (_ow.get('tab') === 'layout') {
const _or = _ow.get('project') || _ow.get('open') || (env.projects.find(S.sellable) || env.projects[0] || {}).id;
const _oq = env.project(_or);
if (_oq) {
const _o1b = await TS.mountStructure(_o10, { K, ctx, env, project: _oq, staff: AD.canAdd(ctx), canEdit: R.canEditProjects(ctx), canErase: !(ctx.user && ctx.user.perms && ctx.user.perms.erase === false),
onBack: () => K.nav('#/sales/catalog'), onProject: (id) => K.nav('#/sales/catalog?project=' + encodeURIComponent(id) + '&tab=layout') });
K.on(_o10, ['projects', 'objects'], () => _o1b.reload());
return _o10;
}
}
let _o16 = Number(await S.getSetting(ctx, 'policy_stale_days', 30)) || 30;
const chipsBox = h('div', { class: 'sl-col' });
const _oc = h('div', { class: 'sl-grid', 'data-testid': 'catalog-grid' });
const count = h('span', { class: 'sl-muted' });
let _o18 = 0;
const search = h('input', { class: 'sl-in', type: 'search', placeholder: 'Tìm dự án, CĐT, khu vực…', 'aria-label': 'Tìm dự án', value: _o9.q, 'data-testid': 'catalog-search', oninput: (e) => {
_o9.q = e.target.value; _oy();
clearTimeout(_o18); _o18 = setTimeout(_oz, A.SUGGEST_DEBOUNCE_MS);
} });
const staff = AD.canAdd(ctx);
const canEdit = R.canEditProjects(ctx);
const sugBox = h('div', { class: 'sl-col', 'aria-live': 'polite', 'data-testid': 'catalog-suggest-box' });
const _o19 = h('div', { class: 'sl-row' }, count,
staff ? K.button('🔄 Cập nhật dự án', () => _op(), { testid: 'catalog-update', title: 'Cập nhật thông tin mới nhất tại thời điểm này cho một dự án' }) : null,
canEdit ? K.button('➕ Thêm dự án', () => openAdd(), { kind: 'primary', testid: 'catalog-add', title: staff ? 'Thêm dự án mới: AI tìm thông tin, từ file hoặc thêm tay' : 'Thêm dự án mới bằng tay' }) : null);
_o10.append(h('div', { class: 'sl-row sl-sp' }, h('h2', null, 'Thông tin dự án'), _o19), search, sugBox, chipsBox, _oc);
function _oz() {
const _o11 = A.suggestNewProject(_o9.q, env.projects);
if (!_o11.show || !canEdit || !env.projects.length) { sugBox.replaceChildren(); return; }
sugBox.replaceChildren(h('div', { class: 'sl-suggest', role: 'status', 'data-testid': 'catalog-suggest', 'data-name': _o11.name },
h('div', null, 'Chưa có dự án “', h('b', { class: 'sl-qname', 'data-testid': 'catalog-suggest-name' }, _o11.name), '”'),
staff ? h('div', { class: 'sl-row' },
K.button('✨ Để AI tìm thông tin dự án này', () => openAdd(_o11.name, 'ai'), { kind: 'primary', testid: 'catalog-suggest-ai', aiBadge: 'catalog_research' }),
h('span', { class: 'sl-ai', 'data-testid': 'catalog-suggest-aitag' }, '✨ AI · có thể tốn phí')) : null,
h('div', { class: 'sl-row' },
K.button('✏️ Thêm tay', () => openAdd(_o11.name, 'manual'), { testid: 'catalog-suggest-manual' }),
staff ? K.button('📎 Thêm từ file', () => openAdd(_o11.name, 'file'), { testid: 'catalog-suggest-file' }) : null)));
}
function _o8() {
const card = K.noProjects({ testid: 'catalog-empty', onAdd: () => openAdd(),
text: 'Thêm dự án anh/chị đang bán: gõ tên để AI tìm thông tin, nhập tay, hoặc đọc từ file bảng giá. Có dự án rồi mới báo giá, làm landing, tính vay được.' });
if (staff && CU.canUpload(ctx)) card.append(K.button('📎 Thêm dự án từ file', () => openAdd('', 'file'), { testid: 'catalog-empty-file', aiBadge: 'catalog_extract' }));
return card;
}
function _o4(key, opts) {
return h('div', { class: 'sl-chips', role: 'group' }, opts.map(([v, label]) => h('button', {
type: 'button', class: 'sl-chip' + (_o9[key] === v ? ' on' : ''), 'aria-pressed': String(_o9[key] === v), 'data-testid': `filter-${key}-${v}`,
onclick: () => { _o9[key] = v; _o13({ dev: _o9.dev, area: _o9.area, band: _o9.band }); _ox(); _oy(); },
}, label)));
}
function _ox() {
const devs = [...new Set(env.projects.map((p) => p.dev).filter(Boolean))];
const areas = [...new Set(env.projects.map((p) => p.area).filter(Boolean))];
chipsBox.replaceChildren(
_o4('dev', [['all', 'Mọi CĐT'], ...devs.map((d) => [d, d])]),
_o4('area', [['all', 'Mọi khu vực'], ...areas.map((a) => [a, a])]),
_o4('band', _o1.map(([v, l]) => [v, l])));
}
function _ou(p) {
const _ot = env.active(p.id);
const _o6 = _ot ? S.staleDays(_ot) : Infinity;
let _o15 = false;
if (_ot) {
try { _o15 = env.L && env.L.policy && typeof env.L.policy.isStale === 'function' ? !!env.L.policy.isStale(_ot, env.today, _o16) : _o6 > _o16; }
catch { _o15 = _o6 > _o16; }
}
return h('span', { class: 'sl-tag' + (_ot ? '' : ' ref'), 'data-testid': 'policy-label-' + p.id, title: _o15 ? `Chính sách đã ${_o6} ngày, nên cập nhật` : '' },
_o15 ? h('i', { class: 'sl-dot', 'data-testid': 'stale-' + p.id, 'aria-label': 'Chính sách cũ' }) : null,
S.policyLabel(_ot));
}
function _oy() {
const band = _o1.find((b) => b[0] === _o9.band) || _o1[0];
const list = S.filterProjects(env.projects, { dev: _o9.dev, area: _o9.area, q: _o9.q, priceMin: band[2] ?? undefined, priceMax: band[3] ?? undefined });
count.textContent = `${list.length}/${env.projects.length} dự án`;
const _ol = !env.projects.length;
for (const _o7 of [_o19, search, chipsBox]) _o7.style.display = _ol ? 'none' : '';
_oc.classList.toggle('sl-grid', !_ol);
_oc.replaceChildren(...(_ol ? [_o8()] : list.length ? list.map(_o3) : [K.empty('Không có dự án khớp bộ lọc.')]));
}
const _o12 = (p) => N.isSample(p) ? h('span', { class: 'sl-mau', 'data-testid': 'sample-badge-' + p.id, title: 'Dữ liệu mẫu – sửa hoặc xoá thoải mái' }, 'Mẫu') : null;
const _o2 = (p) => A.aiUnverified(p) ? h('span', { class: 'sl-ai', 'data-testid': 'ai-unverified-' + p.id, title: 'Dự án do AI tìm – đối chiếu tài liệu chủ đầu tư rồi bấm "Đã kiểm lại"' }, '✨ ' + A.AI_UNVERIFIED_TEXT) : null;
function _o3(p) {
const name = N.displayName(p), src = _oh(p);
const img = src ? h('img', { src, alt: 'Phối cảnh ' + name, loading: 'lazy' }) : null;
const cover = h('div', { class: 'sl-cover', 'data-baked': N.hasBakedLabel(src) ? '1' : null }, img,
h('div', { class: 'sl-badges' }, p.dev ? h('span', { class: 'sl-dev', 'data-testid': 'card-dev-' + p.id }, p.dev) : null));
if (img) img.addEventListener('error', () => { img.remove(); cover.removeAttribute('data-baked'); });
return h('button', { type: 'button', class: 'sl-pcard', 'data-testid': 'project-card-' + p.id, onclick: () => _on(p.id) },
cover,
h('div', { class: 'sl-pb' },
h('span', { class: 'sl-ttl' }, h('b', { 'data-testid': 'card-name-' + p.id }, name), _o12(p)),
_o2(p),
h('span', { class: 'sl-muted sl-small' }, [STATUS[p.status] || '', p.area].filter(Boolean).join(' · ')),
h('span', null, priceLabel(p)),
h('span', { class: 'sl-muted sl-small' }, _og(p)),
_ou(p)));
}
async function reload() { env = await S.loadEnv(ctx); _ox(); _oy(); _oz(); }
function openAdd(name, mode) {
if (!canEdit) return;
AD.openAdd(K, ctx, { env, name: name || '', mode: mode || '', onSaved: async (_or) => { _o9.q = ''; search.value = ''; await reload(); _on(_or); },
onFileSaved: () => { _o9.q = ''; search.value = ''; return reload(); }, openProject: (id) => _on(id), updateProject: (id) => research(env.project(id)) });
}
function _op(id) {
AD.openUpdatePicker(K, ctx, { env, project: id, research: (_or) => research(env.project(_or)),
upload: (_or) => { const p = env.project(_or); if (p) CU.openUpload(ctx, { K, env, project: p, onSaved: () => reload() }); }, openProject: (_or) => _on(_or) });
}
function research(p) {
if (!p || !R.canResearch(ctx)) return;
R.openResearch(K, ctx, p, { env, onSaved: async () => { await reload(); _on(p.id); } });
}
function _on(id) {
const p = env.project(id);
if (!p) return;
const { plans, policy } = env.plansFor(p);
const money = env.money;
const _o1a = p.types.map((t) => {
const _oj = t.ask || !p.price || !plans[0] ? null : t.a[0] * p.price[0] * 1e6 * Math.min(...plans.map((x) => x.factor));
const _oe = t.ask || !p.price || !plans[0] ? null : t.a[1] * p.price[1] * 1e6 * Math.max(...plans.map((x) => x.factor));
return h('tr', null,
h('td', null, h('b', null, t.n)),
h('td', { class: 'sl-nw', 'data-label': 'Diện tích' }, t.ask ? 'Liên hệ' : `${S.fmtNum(t.a[0])}–${S.fmtNum(t.a[1])} m²`),
h('td', { class: 'n rng', 'data-label': 'Giá' }, _oj ? [h('span', { class: 'sl-nw' }, `~${money(_oj)} –`), ' ', h('span', { class: 'sl-nw' }, money(_oe))] : '–'),
h('td', { class: 'n' }, t.ask || !p.price ? null : K.button('Báo giá', () => _ob(p, t.n), { kind: 'ghost', testid: `quote-type-${t.n}` })));
});
const _os = plans.map((pl) => h('tr', null,
h('td', null, h('b', null, pl.name), pl.sub ? h('div', { class: 'sl-muted sl-small' }, pl.sub) : null),
h('td', { class: 'n', 'data-label': 'Chiết khấu' }, S.fmtNum((1 - pl.factor) * 100, 1) + '%'),
h('td', { class: 'n', 'data-label': 'Vay' }, pl.loan ? S.fmtNum(pl.loan * 100, 1) + '%' : '–'),
h('td', { class: 'n', 'data-label': 'HTLS' }, pl.loan ? S.htlsTxt(pl.htls) : '–'),
h('td', { class: 'n', 'data-label': 'Số đợt' }, String(pl.steps.length))));
const unitsBox = h('div', { class: 'sl-col' });
const _o17 = T.structStats(T.readStructure(R.rowData(env, p.id).data));
const openStruct = () => { _o14.close(); K.afterClose(() => K.nav('#/sales/catalog?project=' + encodeURIComponent(p.id) + '&tab=layout')); };
const structBox = h('div', { class: 'sl-box sl-col', 'data-testid': 'detail-struct' },
h('b', null, '🏗️ Phân khu · Toà · Trục căn'),
h('span', { class: 'sl-small sl-muted', 'data-testid': 'detail-struct-stats' }, _o17.zones ? `${_o17.zones} phân khu · ${_o17.towers} toà · ${_o17.axes} trục` : 'Chưa nhập phân khu / toà / trục.'),
unitsBox,
h('div', { class: 'sl-row' }, K.button('🏗️ Mở phân khu · toà · trục', openStruct, { kind: 'primary', testid: 'detail-struct-open' })));
_oi(p).then((list) => {
if (!list.length) return;
const ai = list.filter((u) => u.status === LU.REVIEW.ai).length;
unitsBox.replaceChildren(h('span', { class: 'sl-small', 'data-testid': 'catalog-layout-units' }, `Danh sách căn: ${list.length} căn${ai ? ` (${ai} chưa soát)` : ''}`));
}).catch(() => { });
const body = h('div', { class: 'sl', 'data-testid': 'project-detail' },
h('div', { class: 'sl-row' }, _o12(p), _o2(p), h('span', { class: 'sl-muted' }, [p.dev, p.loc].filter(Boolean).join(' · '))),
A.aiUnverified(p) ? h('div', { class: 'g1-warn sl-col', 'data-testid': 'detail-ai-note' },
h('span', null, 'Dự án này do AI tìm (' + (p.created && p.created.via === 'chat' ? 'dán từ chat AI' : 'Gemini + Google') + '): mỗi thông tin có link nguồn, nhưng anh/chị cần đối chiếu tài liệu chủ đầu tư trước khi báo khách..'),
canEdit ? K.button('✅ Đã kiểm lại', () => { _o14.close(); markChecked(p); }, { testid: 'detail-ai-checked' }) : null) : null,
h('div', { class: 'sl-kpis' },
h('div', { class: 'sl-kpi' }, h('small', null, 'Giá niêm yết'), h('b', null, priceLabel(p))),
h('div', { class: 'sl-kpi' }, h('small', null, 'Bàn giao'), h('b', null, p.handover ? S.ymLabel(p.handover) : 'Chưa công bố')),
h('div', { class: 'sl-kpi' }, h('small', null, 'Trạng thái'), h('b', null, STATUS[p.status] || '–'))),
h('div', { class: 'sl-row' },
p.price && p.types.some((t) => !t.ask) ? K.button('🧾 Báo giá căn này', () => _ob(p, (p.types.find((t) => !t.ask) || {}).n), { kind: 'primary', testid: 'detail-quote' }) : null,
R.canResearch(ctx) ? K.button('🔄 Cập nhật dự án', () => _o5(() => research(p)), { testid: 'detail-research', aiBadge: 'catalog_research', title: 'AI tìm thông tin mới nhất tại thời điểm này (kèm link nguồn)' }) : null,
CU.canUpload(ctx) ? K.button('📎 Gửi file cập nhật', () => _o5(() => CU.openUpload(ctx, { K, env, project: p, onSaved: () => reload() })), { testid: 'detail-upload', aiBadge: 'catalog_extract' }) : null,
K.button('✏️ Sửa thông tin', () => _o5(() => _oo(p)), { kind: 'ghost', testid: 'detail-edit' })),
R.lastUpdate(env, p) ? h('p', { class: 'sl-small sl-muted', 'data-testid': 'detail-last' }, 'Cập nhật thông tin lần trước: ' + R.lastUpdate(env, p)) : null,
R.infoBlock(env, p),
CU.docsBlock(ctx, K, p),
h('h3', null, 'Loại căn & diện tích'),
p.types.length ? h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl sl-stack', 'data-testid': 'detail-types' },
h('thead', null, h('tr', null, h('th', null, 'Loại'), h('th', null, 'Diện tích'), h('th', { class: 'n' }, 'Giá tham khảo'), h('th', null, ''))),
h('tbody', null, _o1a))) : K.empty('Chưa có dữ liệu loại căn.'),
structBox,
h('h3', null, policy ? `${S.policyLabel(policy)} (hiệu lực ${policy.effective_from ? policy.effective_from.split('-').reverse().join('/') : S.ymLabel(policy.month)})` : 'Chính sách tham khảo (mặc định)'),
plans.length ? h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl sl-stack', 'data-testid': 'detail-plans' },
h('thead', null, h('tr', null, h('th', null, 'Phương án'), h('th', { class: 'n' }, 'Chiết khấu'), h('th', { class: 'n' }, 'Vay'), h('th', { class: 'n' }, 'HTLS'), h('th', { class: 'n' }, 'Số đợt'))),
h('tbody', null, _os))) : K.empty('Chưa có chính sách.'),
p.overridden ? h('p', { class: 'sl-muted sl-small' }, 'Thông tin dự án đã được sửa tay (ưu tiên hơn dữ liệu mặc định).') : null);
const _o14 = K.sheet({ title: N.displayName(p), body, testid: 'project-sheet' });
function _o5(fn) { _o14.close(); setTimeout(fn, 260); }
function _ob(pp, type) { _o14.close(); K.nav(`#/sales/quote?project=${encodeURIComponent(pp.id)}${type ? '&type=' + encodeURIComponent(type) : ''}`); }
}
async function markChecked(p) {
if (!canEdit) return;
try {
const _oa = await S.loadEnv(ctx);
const { row, data } = R.rowData(_oa, p.id);
if (!row) return;
await K.put('projects', { ...row, data: JSON.stringify(A.markCheckedData(data, { now: Date.now(), by: (ctx.user && ctx.user.id) || '' })), deleted: 0 });
} catch (e) { K.toast('Chưa đánh dấu được: ' + ((e && e.message) || e), 'error'); return; }
K.toast('Đã đánh dấu kiểm lại.', 'ok');
await reload();
_on(p.id);
}
async function _oi(p) { return LU.projectUnits(await K.list('objects'), p.id); }
function _oo(p) {
const _oj = h('input', { type: 'text', inputmode: 'decimal', value: p.price ? S.fmtNum(p.price[0], 2) : '', 'data-testid': 'edit-price-lo' });
const _oe = h('input', { type: 'text', inputmode: 'decimal', value: p.price ? S.fmtNum(p.price[1], 2) : '', 'data-testid': 'edit-price-hi' });
const _of = h('input', { type: 'month', value: p.handover || '', 'data-testid': 'edit-handover' });
const _od = h('input', { type: 'number', min: 0, step: 1, value: p.hdmb || '', placeholder: '3' });
const types = h('textarea', { rows: 8, 'data-testid': 'edit-types' }, S.typesToText(p.types));
const err = h('div', { class: 'sl-bad', role: 'alert' });
const body = h('div', { class: 'sl' },
h('div', { class: 'sl-form' },
h('label', { class: 'sl-f' }, 'Giá thấp (triệu/m²)', _oj),
h('label', { class: 'sl-f' }, 'Giá cao (triệu/m²)', _oe),
h('label', { class: 'sl-f' }, 'Bàn giao (tháng)', _of),
h('label', { class: 'sl-f' }, 'Số tháng đến ký HĐMB', _od)),
h('label', { class: 'sl-f' }, 'Loại căn – mỗi dòng "Tên: m² nhỏ-m² lớn" (hoặc "liên hệ")', types),
err,
h('div', { class: 'sl-row sl-end' },
p.overridden ? (() => {
const act = A.restoreAction(p, env);
return K.button(act.label, async () => {
if (!(await K.confirm({ title: act.title, text: act.text, ok: act.ok, kind: 'danger', testid: 'edit-restore-confirm' }))) return;
const row = env.projectRows.find((r) => String(r.id) === p.id);
try { await K.put('projects', { ...(row || { id: p.id }), deleted: 1 }); } catch (e) { K.toast('Chưa lưu được: ' + ((e && e.message) || e), 'error'); return; }
_ok.close(); K.toast(act.done, 'ok'); await reload();
}, { kind: 'danger', testid: 'edit-restore' });
})() : null,
K.button('Lưu', save, { kind: 'primary', testid: 'edit-save' })));
const _ok = K.modal({ title: 'Sửa ' + p.name, body, testid: 'project-edit' });
async function save() {
const a = S.parseNum(_oj.value), b = S.parseNum(_oe.value);
const price = isFinite(a) ? [a, isFinite(b) ? b : a] : null;
if (price && (price[0] <= 0 || price[1] < price[0])) { err.textContent = 'Giá thấp phải > 0 và không lớn hơn giá cao.'; return; }
const t = S.parseTypesText(types.value);
if (t.some((x) => !x.ask && (x.a[0] <= 0 || x.a[1] < x.a[0]))) { err.textContent = 'Diện tích loại căn chưa hợp lệ.'; return; }
const _om = env.projectRows.find((r) => String(r.id) === p.id);
let prev = {};
try { prev = _om && _om.data ? (typeof _om.data === 'string' ? JSON.parse(_om.data) : _om.data) : {}; } catch { prev = {}; }
const data = { ...(prev && typeof prev === 'object' ? prev : {}), price, handover: _of.value || null, types: t };
if (_od.value) data.hdmb = Number(_od.value); else delete data.hdmb;
Object.assign(data, R.manualSources(p, data, ctx));
await K.put('projects', { ...(_om || {}), id: p.id, name: p.name, dev: p.dev || '', data: JSON.stringify(data), deleted: 0 });
_ok.close(); K.toast('Đã lưu thông tin dự án', 'ok'); await reload();
}
}
_ox();
_oy();
_oz();
const _ov = S.hashParams();
if (_ov.get('tab') === 'update' && _ov.get('project') && staff) { const p = env.project(_ov.get('project')); if (p) research(p); else _op(); }
else if (_ov.get('open') || _ov.get('project')) _on(_ov.get('open') || _ov.get('project'));
else if (_ov.get('add')) openAdd(_ov.get('name') || '', _ov.get('mode') || '');
else if (_ov.get('update') && staff) { const p = env.project(_ov.get('update')); if (p) research(p); else _op(); }
K.on(_o10, ['policies', 'projects'], reload);
return _o10;
}
export default {
manifest: {
id: 'catalog', title: 'Thông tin dự án', icon: '🏢', screen: 'sales', order: 10, version: '1.1.0', status: 'ready',
help: 'Thông tin dự án (trước gọi là Bảng hàng): lưới dự án – giá từ–đến, bàn giao, chính sách đang áp dụng; lọc theo chủ đầu tư, khu vực, giá; ➕ Thêm dự án (AI tìm dự án mới, từ file, nhập tay); 🔄 Cập nhật dự án (thông tin mới nhất kèm nguồn); sửa giá/loại căn; 🏗️ Phân khu · Toà · Trục căn (nhập tay, AI tìm có nguồn, đọc ảnh layout tầng) và Tạo danh sách căn.',
},
mount,
async selftest(ctx) { return S.selftestSales(ctx, ['policy.isStale']); },
};

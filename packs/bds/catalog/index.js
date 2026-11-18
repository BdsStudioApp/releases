import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as R from './research.js';
import * as CU from './upload.js';
import * as AN from './add_new.js';
import * as N from './research_new_logic.js';
const _o1 = [
['all', 'Mọi mức giá', null, null], ['lt70', 'Dưới 70 tr/m²', null, 70], ['70-100', '70–100 tr/m²', 70, 100],
['100-150', '100–150 tr/m²', 100, 150], ['gt150', 'Trên 150 tr/m²', 150, null],
];
const _o2 = { sale: 'Đang bán', soon: 'Sắp mở bán', done: 'Đã bàn giao', ask: 'Nhận bảng giá', low: 'Thấp tầng' };
const _o0 = 'bds.catalog.filter';
const loadF = () => { try { return JSON.parse(localStorage.getItem(_o0)) || {}; } catch { return {}; } };
const _oz = (_oa) => { try { localStorage.setItem(_o0, JSON.stringify(_oa)); } catch { } };
const _oi = (p) => p.handover ? 'Bàn giao ' + S.ymLabel(p.handover) : 'Bàn giao: chưa công bố';
const priceLabel = (p) => p.price ? `${S.fmtNum(p.price[0], 1)}–${S.fmtNum(p.price[1], 1)} triệu/m²` : 'Chưa có giá';
const _oj = (p) => p.img || (p.added ? '' : `assets/projects/${p.id}.webp`);
export async function mount(el, ctx) {
S.ensureSalesCss();
AN.ensureCss();
const K = kit(ctx);
const _oa = { dev: 'all', area: 'all', band: 'all', q: '', ...loadF() };
const _oy = h('div', { class: 'sl', 'data-testid': 'catalog' });
el.innerHTML = '';
el.appendChild(_oy);
let env = await S.loadEnv(ctx);
let _o12 = Number(await S.getSetting(ctx, 'policy_stale_days', 30)) || 30;
const chipsBox = h('div', { class: 'sl-col' });
const _oe = h('div', { class: 'sl-grid', 'data-testid': 'catalog-grid' });
const count = h('span', { class: 'sl-muted' });
const search = h('input', { class: 'sl-in', type: 'search', placeholder: 'Tìm dự án, CĐT, khu vực…', 'aria-label': 'Tìm dự án', value: _oa.q, 'data-testid': 'catalog-search', oninput: (e) => { _oa.q = e.target.value; _ow(); } });
const suggestBox = h('div', { class: 'sl-col', 'aria-live': 'polite', 'data-testid': 'catalog-suggest-box' });
const _ob = () => CU.openUpload(ctx, { K, env, project: null, onSaved: () => { _oa.q = ''; search.value = ''; return _ou(); } });
const addOn = {
ai: (name) => AN.openAiNew(K, ctx, { name, onSaved: (pid) => _o4(pid), onManual: (n) => AN.openManual(K, ctx, { name: n, onSaved: (pid) => _o4(pid) }) }),
manual: (name) => AN.openManual(K, ctx, { name, onSaved: (pid) => _o4(pid) }),
file: CU.canUpload(ctx) ? () => _ob() : null,
};
_oy.append(h('div', { class: 'sl-row sl-sp' }, h('h2', null, 'Bảng hàng dự án'), h('div', { class: 'sl-row' }, count,
AN.canAdd(ctx) ? K.button('Thêm dự án', () => AN.openChooser(K, ctx, { name: N.unknownName(env.projects, _oa.q), ...addOn }), { testid: 'catalog-add', icon: 'plus' }) : null,
CU.canUpload(ctx) ? K.button('Thêm dự án từ file', () => _ob(), { testid: 'catalog-add-file', aiBadge: 'catalog_extract', icon: 'inbox' }) : null)), search, suggestBox, chipsBox, _oe);
function _o6(key, opts) {
return h('div', { class: 'sl-chips', role: 'group' }, opts.map(([v, label]) => h('button', {
type: 'button', class: 'sl-chip' + (_oa[key] === v ? ' on' : ''), 'aria-pressed': String(_oa[key] === v), 'data-testid': `filter-${key}-${v}`,
onclick: () => { _oa[key] = v; _oz({ dev: _oa.dev, area: _oa.area, band: _oa.band }); _ov(); _ow(); },
}, label)));
}
function _ov() {
const devs = [...new Set(env.projects.map((p) => p.dev).filter(Boolean))];
const areas = [...new Set(env.projects.map((p) => p.area).filter(Boolean))];
chipsBox.replaceChildren(
_o6('dev', [['all', 'Mọi CĐT'], ...devs.map((d) => [d, d])]),
_o6('area', [['all', 'Mọi khu vực'], ...areas.map((a) => [a, a])]),
_o6('band', _o1.map(([v, l]) => [v, l])));
}
function _os(p) {
const _or = env.active(p.id);
const _o9 = _or ? S.staleDays(_or) : Infinity;
let _o11 = false;
if (_or) {
try { _o11 = env.L && env.L.policy && typeof env.L.policy.isStale === 'function' ? !!env.L.policy.isStale(_or, env.today, _o12) : _o9 > _o12; }
catch { _o11 = _o9 > _o12; }
}
return h('span', { class: 'sl-tag' + (_or ? '' : ' ref'), 'data-testid': 'policy-label-' + p.id, title: _o11 ? `Chính sách đã ${_o9} ngày, nên cập nhật` : '' },
_o11 ? h('i', { class: 'sl-dot', 'data-testid': 'stale-' + p.id, 'aria-label': 'Chính sách cũ' }) : null,
S.policyLabel(_or));
}
function _ow() {
const band = _o1.find((b) => b[0] === _oa.band) || _o1[0];
const list = S.filterProjects(env.projects, { dev: _oa.dev, area: _oa.area, q: _oa.q, priceMin: band[2] ?? undefined, priceMax: band[3] ?? undefined });
count.textContent = `${list.length}/${env.projects.length} dự án`;
_oe.replaceChildren(...(list.length ? list.map(_o5) : [K.empty('Không có dự án khớp bộ lọc.')]));
_ox();
}
function _ox() {
const name = N.unknownName(env.projects, _oa.q);
if (!name) { suggestBox.replaceChildren(); return; }
const _o8 = suggestBox.firstChild;
if (_o8 && _o8.dataset && _o8.dataset.name === name) return;
const card = AN.suggestCard(K, ctx, name, addOn);
card.dataset.name = name;
suggestBox.replaceChildren(card);
}
async function _o4(pid) {
_oa.q = ''; search.value = '';
await _ou();
if (pid && env.project(pid)) _oo(pid);
}
function _o5(p) {
const name = N.displayName(p), src = _oj(p);
const img = src ? h('img', { src, alt: 'Phối cảnh ' + name, loading: 'lazy' }) : null;
const cover = h('div', { class: 'sl-cover', 'data-baked': N.hasBakedLabel(src) ? '1' : null }, img,
h('div', { class: 'sl-badges' }, p.dev ? h('span', { class: 'sl-dev', 'data-testid': 'card-dev-' + p.id }, p.dev) : null));
if (img) img.addEventListener('error', () => { img.remove(); cover.removeAttribute('data-baked'); });
return h('button', { type: 'button', class: 'sl-pcard', 'data-testid': 'project-card-' + p.id, onclick: () => _oo(p.id) },
cover,
h('div', { class: 'sl-pb' },
h('b', { 'data-testid': 'card-name-' + p.id }, name, N.isSample(p) ? h('span', { class: 'sl-mau', 'data-testid': 'card-mau-' + p.id }, 'Mẫu') : null),
N.needsReview(p) ? h('span', { class: 'sl-aireview', 'data-testid': 'ai-review-' + p.id }, '✨ ' + N.AI_REVIEW_NOTE) : null,
h('span', { class: 'sl-muted sl-small' }, [_o2[p.status] || '', p.area].filter(Boolean).join(' · ')),
h('span', null, priceLabel(p)),
h('span', { class: 'sl-muted sl-small' }, _oi(p)),
_os(p)));
}
async function _ou() { env = await S.loadEnv(ctx); _ov(); _ow(); }
function _oo(id) {
const p = env.project(id);
if (!p) return;
const { plans, policy } = env.plansFor(p);
const money = env.money;
const _o13 = p.types.map((t) => {
const _ok = t.ask || !p.price || !plans[0] ? null : t.a[0] * p.price[0] * 1e6 * Math.min(...plans.map((x) => x.factor));
const _og = t.ask || !p.price || !plans[0] ? null : t.a[1] * p.price[1] * 1e6 * Math.max(...plans.map((x) => x.factor));
return h('tr', null,
h('td', null, h('b', null, t.n)),
h('td', { class: 'sl-nw', 'data-label': 'Diện tích' }, t.ask ? 'Liên hệ' : `${S.fmtNum(t.a[0])}–${S.fmtNum(t.a[1])} m²`),
h('td', { class: 'n rng', 'data-label': 'Giá' }, _ok ? [h('span', { class: 'sl-nw' }, `~${money(_ok)} –`), ' ', h('span', { class: 'sl-nw' }, money(_og))] : '–'),
h('td', { class: 'n' }, t.ask || !p.price ? null : K.button('Báo giá', () => _od(p, t.n), { kind: 'ghost', testid: `quote-type-${t.n}` })));
});
const _oq = plans.map((pl) => h('tr', null,
h('td', null, h('b', null, pl.name), pl.sub ? h('div', { class: 'sl-muted sl-small' }, pl.sub) : null),
h('td', { class: 'n', 'data-label': 'Chiết khấu' }, S.fmtNum((1 - pl.factor) * 100, 1) + '%'),
h('td', { class: 'n', 'data-label': 'Vay' }, pl.loan ? S.fmtNum(pl.loan * 100, 1) + '%' : '–'),
h('td', { class: 'n', 'data-label': 'HTLS' }, pl.loan ? S.htlsTxt(pl.htls) : '–'),
h('td', { class: 'n', 'data-label': 'Số đợt' }, String(pl.steps.length))));
const body = h('div', { class: 'sl', 'data-testid': 'project-detail' },
h('div', { class: 'sl-muted' }, [p.dev, p.loc].filter(Boolean).join(' · ')),
h('div', { class: 'sl-kpis' },
h('div', { class: 'sl-kpi' }, h('small', null, 'Giá niêm yết'), h('b', null, priceLabel(p))),
h('div', { class: 'sl-kpi' }, h('small', null, 'Bàn giao'), h('b', null, p.handover ? S.ymLabel(p.handover) : 'Chưa công bố')),
h('div', { class: 'sl-kpi' }, h('small', null, 'Trạng thái'), h('b', null, _o2[p.status] || '–'))),
h('div', { class: 'sl-row' },
p.price && p.types.some((t) => !t.ask) ? K.button('Báo giá căn này', () => _od(p, (p.types.find((t) => !t.ask) || {}).n), { kind: 'primary', testid: 'detail-quote', icon: 'sales' }) : null,
K.button('Cập nhật chính sách', () => { _o10.close(); K.nav('#/sales/policy?project=' + encodeURIComponent(p.id)); }, { testid: 'detail-policy', icon: 'log' }),
K.button('Sửa thông tin', () => _o7(() => _op(p)), { kind: 'ghost', testid: 'detail-edit', icon: 'tag' }),
R.canResearch(ctx) ? K.button('AI tìm thông tin', () => _o7(() => R.openResearch(K, ctx, p, { onSaved: async () => { await _ou(); _oo(p.id); } })), { aiBadge: 'catalog_research', testid: 'detail-research', icon: 'sparkle' }) : null,
CU.canUpload(ctx) ? K.button('Gửi file cập nhật', () => _o7(() => CU.openUpload(ctx, { K, env, project: p, onSaved: () => _ou() })), { testid: 'detail-upload', aiBadge: 'catalog_extract', icon: 'inbox' }) : null),
N.needsReview(p) ? h('div', { class: 'g1-warn sl-col', 'data-testid': 'detail-ai-review' },
h('span', null, `⚠️ Thông tin dự án do AI tìm (${N.AI_REVIEW_NOTE}). Mở link nguồn ở từng mục bên dưới để đối chiếu trước khi báo khách.`),
AN.canAdd(ctx) ? h('div', { class: 'sl-row' }, K.button('Đã kiểm lại', () => _om(p), { testid: 'detail-ai-checked', icon: 'check' })) : null) : null,
R.infoBlock(env, p),
CU.docsBlock(ctx, K, p),
h('h3', null, 'Loại căn & diện tích'),
p.types.length ? h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl sl-stack', 'data-testid': 'detail-types' },
h('thead', null, h('tr', null, h('th', null, 'Loại'), h('th', null, 'Diện tích'), h('th', { class: 'n' }, 'Giá tham khảo'), h('th', null, ''))),
h('tbody', null, _o13))) : K.empty('Chưa có dữ liệu loại căn.'),
h('h3', null, policy ? `${S.policyLabel(policy)} (hiệu lực ${policy.effective_from ? policy.effective_from.split('-').reverse().join('/') : S.ymLabel(policy.month)})` : 'Chính sách tham khảo (mặc định)'),
plans.length ? h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl sl-stack', 'data-testid': 'detail-plans' },
h('thead', null, h('tr', null, h('th', null, 'Phương án'), h('th', { class: 'n' }, 'Chiết khấu'), h('th', { class: 'n' }, 'Vay'), h('th', { class: 'n' }, 'HTLS'), h('th', { class: 'n' }, 'Số đợt'))),
h('tbody', null, _oq))) : K.empty('Chưa có chính sách.'),
p.overridden ? h('p', { class: 'sl-muted sl-small' }, 'Thông tin dự án đã được sửa tay (ưu tiên hơn dữ liệu mặc định).') : null);
const _o10 = K.sheet({ title: N.displayName(p), body, testid: 'project-sheet' });
function _o7(fn) { _o10.close(); setTimeout(fn, 260); }
async function _om(pp) {
try {
const _oc = await S.loadEnv(ctx);
const { row, data } = R.rowData(_oc, pp.id);
if (!row || !data.ai_review) return;
data.ai_review = { ...data.ai_review, checked_at: Date.now(), checked_by: (ctx.user && ctx.user.id) || '' };
await K.put('projects', { ...row, data: JSON.stringify(data), deleted: 0 });
} catch (e) { K.toast('Chưa đánh dấu được: ' + ((e && e.message) || e), 'error'); return; }
_o10.close(); K.toast('Đã đánh dấu đã kiểm lại', 'ok'); await _ou(); _oo(pp.id);
}
function _od(pp, type) { _o10.close(); K.nav(`#/sales/quote?project=${encodeURIComponent(pp.id)}${type ? '&type=' + encodeURIComponent(type) : ''}`); }
}
function _op(p) {
const _ok = h('input', { type: 'text', inputmode: 'decimal', value: p.price ? S.fmtNum(p.price[0], 2) : '', 'data-testid': 'edit-price-lo' });
const _og = h('input', { type: 'text', inputmode: 'decimal', value: p.price ? S.fmtNum(p.price[1], 2) : '', 'data-testid': 'edit-price-hi' });
const _oh = h('input', { type: 'month', value: p.handover || '', 'data-testid': 'edit-handover' });
const _of = h('input', { type: 'number', min: 0, step: 1, value: p.hdmb || '', placeholder: '3' });
const types = h('textarea', { rows: 8, 'data-testid': 'edit-types' }, S.typesToText(p.types));
const err = h('div', { class: 'sl-bad', role: 'alert' });
const body = h('div', { class: 'sl' },
h('div', { class: 'sl-form' },
h('label', { class: 'sl-f' }, 'Giá thấp (triệu/m²)', _ok),
h('label', { class: 'sl-f' }, 'Giá cao (triệu/m²)', _og),
h('label', { class: 'sl-f' }, 'Bàn giao (tháng)', _oh),
h('label', { class: 'sl-f' }, 'Số tháng đến ký HĐMB', _of)),
h('label', { class: 'sl-f' }, 'Loại căn – mỗi dòng "Tên: m² nhỏ-m² lớn" (hoặc "liên hệ")', types),
err,
h('div', { class: 'sl-row sl-end' },
p.overridden ? (() => {
const _o3 = N.restoreAction(p, env);
return K.button(_o3.label, async () => {
if (!(await K.confirm({ title: _o3.title, text: _o3.text, ok: _o3.ok, kind: 'danger', testid: 'edit-restore-confirm' }))) return;
const row = env.projectRows.find((r) => String(r.id) === p.id);
try { await K.put('projects', { ...(row || { id: p.id }), deleted: 1 }); } catch (e) { K.toast('Chưa lưu được: ' + ((e && e.message) || e), 'error'); return; }
_ol.close(); K.toast(_o3.done, 'ok'); await _ou();
}, { kind: 'danger', testid: 'edit-restore' });
})() : null,
K.button('Lưu', save, { kind: 'primary', testid: 'edit-save' })));
const _ol = K.modal({ title: 'Sửa ' + p.name, body, testid: 'project-edit' });
async function save() {
const a = S.parseNum(_ok.value), b = S.parseNum(_og.value);
const price = isFinite(a) ? [a, isFinite(b) ? b : a] : null;
if (price && (price[0] <= 0 || price[1] < price[0])) { err.textContent = 'Giá thấp phải > 0 và không lớn hơn giá cao.'; return; }
const t = S.parseTypesText(types.value);
if (t.some((x) => !x.ask && (x.a[0] <= 0 || x.a[1] < x.a[0]))) { err.textContent = 'Diện tích loại căn chưa hợp lệ.'; return; }
const _on = env.projectRows.find((r) => String(r.id) === p.id);
let prev = {};
try { prev = _on && _on.data ? (typeof _on.data === 'string' ? JSON.parse(_on.data) : _on.data) : {}; } catch { prev = {}; }
const data = { ...(prev && typeof prev === 'object' ? prev : {}), price, handover: _oh.value || null, types: t };
if (_of.value) data.hdmb = Number(_of.value); else delete data.hdmb;
Object.assign(data, R.manualSources(p, data, ctx));
await K.put('projects', { ...(_on || {}), id: p.id, name: p.name, dev: p.dev || '', data: JSON.stringify(data), deleted: 0 });
_ol.close(); K.toast('Đã lưu thông tin dự án', 'ok'); await _ou();
}
}
_ov();
_ow();
const _ot = S.hashParams();
if (_ot.get('open')) _oo(_ot.get('open'));
K.on(_oy, ['policies', 'projects'], _ou);
return _oy;
}
export default {
manifest: {
id: 'catalog', title: 'Bảng hàng dự án', icon: '🏢', screen: 'sales', order: 10, version: '1.0.0', status: 'ready',
help: 'Lưới dự án: giá từ–đến, bàn giao, chính sách đang áp dụng; lọc theo chủ đầu tư, khu vực, giá; sửa giá/loại căn. Gõ tên dự án chưa có → AI tìm thông tin (kèm nguồn), thêm tay hoặc thêm từ file.',
},
mount,
async selftest(ctx) { return S.selftestSales(ctx, ['policy.isStale']); },
};

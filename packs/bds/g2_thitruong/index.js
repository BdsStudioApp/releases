import { g2kit, h, g2Selftest } from '../g2_lib/ui.js';
import * as C from '../g2_lib/core.js';
import * as O from '../g2_lib/ops.js';
import * as M from '../_lib/market.js';
export const OBS_TYPES = [['gia_ban', 'Giá bán (triệu/m²)'], ['gia_thue', 'Giá thuê (triệu/tháng)'], ['ha_tang', 'Hạ tầng mới'], ['tien_do', 'Tiến độ dự án']];
const _o0 = 'bds.g2mkt.project';
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
let pid = (() => { try { return localStorage.getItem(_o0) || ''; } catch { return ''; } })();
el.innerHTML = '';
const _o2 = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-thitruong' }, G.head('Thị trường quanh dự án'), _o2));
async function _oi() {
const env = await G.env();
const projects = env.projects;
if (!projects.some(_og => _og.id === pid)) pid = (projects.find(_og => _og.status === 'sale') || projects[0] || {}).id || '';
const _og = env.project(pid);
const [ideas, policies, objects, jobs] = await Promise.all([K.list('ideas'), K.list('policies'), K.list('objects'), K.list('jobs')]);
const area = M.AREAS.find(a => M.projectsIn(a.id, projects).some(x => x.id === pid));
const _o7 = area ? M.gather({ area: area.id, ideas, policies, customers: objects, jobs, projects, now: Date.now(), days: 30 }) : null;
const _o9 = C.projectKeywords(_og, M.AREAS);
const _oh = _og ? C.fold(_og.name) : '';
_o2.innerHTML = '';
_o2.appendChild(K.field('Dự án', K.select(projects.map(x => [x.id, x.name]), pid, { 'data-testid': 'g2-mkt-project', onchange: e => { pid = e.target.value; try { localStorage.setItem(_o0, pid); } catch { } _oi(); } })));
if (!_og) { _o2.appendChild(K.empty('Chưa có dự án trong Bảng hàng.')); return; }
_o2.appendChild(h('p', { class: 'bds-muted' }, [_og.dev, _og.loc, area ? 'Khu vực: ' + area.label : 'Chưa gắn khu vực theo dõi', _og.handover ? 'Bàn giao ' + _og.handover.split('-').reverse().join('/') : ''].filter(Boolean).join(' · ')));
const _o3 = G.perms().video !== false;
const news = _o7 ? _o7.news : [];
const _of = news.filter(n => _oh && C.fold(n.title).includes(_oh));
const _ol = news.filter(n => !_of.includes(n)).slice(0, 10);
const _od = n => h('li', null, h('span', null, C.safeUrl(n.url) ? h('a', { href: C.safeUrl(n.url), target: '_blank', rel: 'noopener' }, n.title) : n.title), h('small', null, [n.source, M.fmtDate(n.published)].filter(Boolean).join(' · ')));
_o2.appendChild(K.card({ title: 'Tin 30 ngày', testid: 'g2-mkt-news', body: !_o3 ? h('p', { class: 'bds-muted' }, 'Tin tức nằm trong Nguồn ý tưởng – cần quyền Video & Ý tưởng (Quản trị/Quản lý).')
: news.length ? [_of.length ? h('h4', null, 'Nhắc tới ' + _og.name) : null, h('ul', { class: 'g2-parts' }, _of.map(_od)), _ol.length ? h('h4', null, 'Trong khu vực') : null, h('ul', { class: 'g2-parts' }, _ol.map(_od))]
: h('p', { class: 'bds-muted' }, 'Chưa có tin khớp. Lấy tin ở Thị trường hoặc Nguồn ý tưởng.') }));
const _o8 = env.history(pid).slice(0, 6);
_o2.appendChild(K.card({ title: 'Chính sách bán hàng', testid: 'g2-mkt-policy', body: _o8.length ? h('ul', { class: 'g2-parts' }, _o8.map(x => h('li', null, h('span', null, (x.month ? 'Tháng ' + x.month.split('-').reverse().join('/') : 'Chính sách') + (x.note ? ': ' + String(x.note).slice(0, 120) : '')), h('small', null, x.status === 'active' ? 'đang áp dụng' : 'nháp'))))
: h('p', { class: 'bds-muted' }, 'Chưa có chính sách đã lưu – đang dùng giá tham khảo của Bảng hàng (' + (_og.price ? _og.price[0] + '–' + _og.price[1] + ' triệu/m²' : 'chưa có giá') + ').') }));
const _o6 = _o7 ? _o7.demand.find(_o4 => _o4.project_id === pid) : null;
const _oc = G.crm.activeCustomers(objects).filter(c => c.project === pid && !C.pd(c.data).erased);
_o2.appendChild(K.card({ title: 'Nhu cầu khách', body: h('p', null, (_o6 ? _o6.count + ' khách landing mới 30 ngày (tổng ' + _o6.total + ')' : 'Chưa có khách landing') + ' · ' + _oc.length + ' khách trong danh sách quan tâm dự án này.') }));
const _ok = jobs.filter(j => j.type === 'market_report' && area && C.pd(j.input).area === area.id).sort((a, b) => b.updated_at - a.updated_at);
const _oj = _ok[0] ? C.pd(_ok[0].output).report : null;
if (_oj) _o2.appendChild(K.card({ title: 'Bản tin thị trường tuần gần nhất', body: [h('p', null, _oj.headline || ''), h('ul', { class: 'g2-parts' }, (_oj.call_reasons || []).map(r => h('li', null, (r.project ? r.project + ': ' : '') + r.reason)))] }));
const _oe = (await G.objectsOf('g2_mkt')).filter(o => o.project === pid && !C.pd(o.data).hidden).sort((a, b) => (C.pd(b.data).at || 0) - (C.pd(a.data).at || 0));
const _oa = O.latestObs(_oe, pid);
_o2.appendChild(K.card({ title: 'Ghi nhận thị trường (' + _oe.length + ')', testid: 'g2-mkt-obs', actions: [K.button('+ Ghi nhận', () => _o1(_og), { kind: 'primary', testid: 'g2-obs-add' })],
body: [h('p', { class: 'bds-muted' }, 'Số liệu tự ghi kèm nguồn (tin đăng, sàn, báo). Mới nhất: ' + [_oa.price ? 'giá bán ' + _oa.price.value + ' tr/m²' : '', _oa.rent ? 'giá thuê ' + _oa.rent.value + ' tr/tháng' : ''].filter(Boolean).join(', ') || 'chưa có'),
_oe.length ? h('ul', { class: 'g2-parts' }, _oe.slice(0, 30).map(o => { const _o4 = C.pd(o.data); return h('li', null, h('span', null, (OBS_TYPES.find(t => t[0] === _o4.type) || ['', ''])[1] + ': ' + (_o4.value !== undefined && _o4.value !== '' ? _o4.value + ' ' : '') + (_o4.note || '')),
h('small', { class: 'g2-src' }, G.date(_o4.at) + ' · ', C.safeUrl(_o4.url) ? h('a', { href: C.safeUrl(_o4.url), target: '_blank', rel: 'noopener' }, 'nguồn') : 'không có nguồn'),
G.perms().erase === false ? null : K.button('Xoá', () => _o5(o, _o4), { kind: 'ghost', testid: 'g2-obs-del-' + o.id, title: 'Xoá ghi nhận này', icon: 'x' })); })) : K.empty('Chưa có ghi nhận.')] }));
_o2.appendChild(h('div', { class: 'bds-row bds-wrap' }, K.button('Dùng tin làm cớ chăm sóc khách', () => K.nav('#/customers/g2_chamsoc'), { icon: 'next', testid: 'g2-mkt-to-care' })));
}
async function _o5(o, _o4) {
const _on = (OBS_TYPES.find(t => t[0] === _o4.type) || ['', 'Ghi nhận'])[1] + (_o4.value !== undefined && _o4.value !== '' ? ' ' + _o4.value : '');
if (!(await K.confirm({ title: 'Xoá ghi nhận thị trường', text: 'Xoá "' + _on + '"? Sổ tài sản sẽ không còn lấy số này.', ok: 'Xoá', kind: 'danger', testid: 'g2-obs-del-c' }))) return;
await K.put('objects', { ...o, deleted: 1 });
K.toast('Đã xoá ghi nhận', 'success'); _oi();
}
function _o1(_og) {
const type = K.select(OBS_TYPES, 'gia_ban', { 'data-testid': 'g2-obs-type' });
const value = h('input', { inputmode: 'decimal', placeholder: 'VD: 72,5', 'data-testid': 'g2-obs-value' });
const note = h('input', { placeholder: 'VD: căn 2N tầng trung, tin rao 3 sàn', 'data-testid': 'g2-obs-note' });
const url = h('input', { type: 'url', placeholder: 'https://… (bắt buộc)', 'data-testid': 'g2-obs-url' });
const date = h('input', { type: 'date', value: C.vnYmd(Date.now()), 'data-testid': 'g2-obs-date' });
let _ob;
_ob = K.modal({ title: 'Ghi nhận thị trường – ' + _og.name, testid: 'g2-obs-modal', body: [K.field('Loại', type), K.field('Số liệu (để trống nếu là hạ tầng/tiến độ)', value), K.field('Mô tả', note), K.field('Link nguồn', url), K.field('Ngày ghi nhận', date),
h('div', { class: 'bds-row bds-end' }, K.button('Lưu', async () => {
if (!O.validLink(url.value)) { K.toast('Cần link nguồn https://', 'warn'); return; }
const _om = String(value.value).replace(',', '.').trim();
if (['gia_ban', 'gia_thue'].includes(type.value) && !(Number(_om) > 0)) { K.toast('Nhập số liệu', 'warn'); return; }
if (!['gia_ban', 'gia_thue'].includes(type.value) && !note.value.trim()) { K.toast('Nhập mô tả', 'warn'); return; }
await K.put('objects', { kind: 'g2_mkt', name: (OBS_TYPES.find(t => t[0] === type.value) || [])[1] + ' – ' + _og.name, project: _og.id,
data: JSON.stringify({ type: type.value, value: _om ? Number(_om) : '', note: note.value.trim().slice(0, 300), url: url.value.trim(), at: C.vnFromInput(date.value, '12:00') || Date.now() }) });
_ob.close(); K.toast('Đã ghi nhận', 'success'); _oi();
}, { kind: 'primary', testid: 'g2-obs-save' }))] });
}
await _oi();
}
export default {
manifest: { id: 'g2_thitruong', title: 'Thị trường quanh dự án', icon: '📈', screen: 'customers', order: 260, version: '0.1.0', status: 'thu-nghiem', pack: 'care',
help: 'Theo dõi một dự án: tin 30 ngày, chính sách, nhu cầu khách, bản tin tuần; sổ ghi nhận giá bán/giá thuê/hạ tầng/tiến độ có nguồn.' },
mount,
async selftest(ctx) { return g2Selftest(ctx, mount); },
};

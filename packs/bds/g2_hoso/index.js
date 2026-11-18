import { g2kit, h, g2Selftest } from '../g2_lib/ui.js';
import * as O from '../g2_lib/ops.js';
import * as C from '../g2_lib/core.js';
const _oi = _o5 => (O.DEAL_STATUS[_o5.status] ? _o5.status : 'open');
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
let filter = 'open';
el.innerHTML = '';
const _o0 = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-hoso' }, G.head('Hồ sơ giao dịch', K.button('+ Hồ sơ mới', () => _o3(), { kind: 'primary', testid: 'g2-deal-add' })), _o0));
async function _oe() {
const [deals, customers] = await Promise.all([G.objectsOf('g2_deal'), G.customers()]);
const _o1 = new Map(customers.map(_o2 => [_o2.id, _o2]));
_o0.innerHTML = '';
_o0.appendChild(h('div', { class: 'bds-chips' }, Object.entries(O.DEAL_STATUS).map(([id, l]) => h('button', { type: 'button', class: 'bds-chip' + (filter === id ? ' bds-on' : ''), 'data-testid': 'g2-deal-f-' + id, onclick: () => { filter = id; _oe(); } }, l + ' (' + deals.filter(_o5 => _oi(_o5) === id).length + ')'))));
const list = deals.filter(_o5 => _oi(_o5) === filter).sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0));
const _o9 = h('div', { class: 'bds-list', 'data-testid': 'g2-deals' });
for (const _o5 of list) {
const _o8 = O.dealInfo(_o5);
const _o2 = _o1.get(_o8.customer_id);
_o9.appendChild(h('div', { class: 'bds-item', 'data-testid': 'g2-deal-' + _o5.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => _ob(_o5.id) }, h('strong', null, _o5.name),
h('span', { class: 'bds-sub' }, [_o2 ? _o2.name : '', K.projectName(_o5.project), _o8.done + '/' + _o8.total + ' bước', _o8.next ? 'tiếp: ' + _o8.next.label : 'đủ bước'].filter(Boolean).join(' · ')),
h('div', { class: 'g2-bar' }, h('i', { style: { width: _o8.pct + '%' } })))));
}
if (!list.length) _o9.appendChild(K.empty(filter === 'open' ? 'Chưa có hồ sơ đang làm. Bấm "+ Hồ sơ mới" khi khách đặt cọc/giữ chỗ.' : 'Không có hồ sơ.'));
_o0.appendChild(_o9);
}
async function _o3() {
const customers = await G.customers();
const _o4 = G.customerSelect(customers, '', { 'data-testid': 'g2-deal-customer' });
const _od = K.select([['', '— Dự án —'], ...K.projects().map(p => [p.id, p.name])], '', { 'data-testid': 'g2-deal-project' });
_o4.addEventListener('change', () => { const _o2 = customers.find(x => x.id === _o4.value); if (_o2 && _o2.project) _od.value = _o2.project; });
const unit = h('input', { placeholder: 'VD: Căn 1208 toà A', 'data-testid': 'g2-deal-unit' });
const price = h('input', { placeholder: 'VD: 3,2 tỷ' });
const tpl = await K.setting('g2.deal_steps', null);
const steps = h('textarea', { rows: 8, 'data-testid': 'g2-deal-steps' }, (Array.isArray(tpl) && tpl.length ? tpl : O.DEAL_STEPS).join('\n'));
let _oa;
_oa = K.modal({ title: 'Hồ sơ giao dịch mới', testid: 'g2-deal-new', body: [K.field('Khách', _o4), K.field('Dự án', _od), h('div', { class: 'bds-grid2' }, K.field('Căn', unit), K.field('Giá', price)),
K.field('Các bước (mỗi dòng 1 bước – sửa được)', steps),
h('div', { class: 'bds-row bds-end' }, G.isStaff() ? K.button('Lưu làm mẫu cho cả đội', async () => { await K.setSetting('g2.deal_steps', steps.value.split('\n').map(s => s.trim()).filter(Boolean)); K.toast('Đã lưu mẫu các bước', 'success'); }) : null,
K.button('Tạo hồ sơ', async () => {
const _o2 = customers.find(x => x.id === _o4.value);
if (!_o2) { K.toast('Chọn khách', 'warn'); return; }
const _oj = steps.value.split('\n').map(s => s.trim()).filter(Boolean);
if (!_oj.length) { K.toast('Nhập ít nhất 1 bước (mỗi dòng 1 bước)', 'warn'); return; }
const _oc = price.value.trim() ? G.crm.parseMoney(price.value) : 0;
if (price.value.trim() && !_oc) { K.toast('Giá chưa đọc được – nhập như "3,2 tỷ" hoặc "850 triệu"', 'warn'); return; }
const _of = await K.put('objects', O.newDeal({ customer: _o2, project: _od.value, unit: unit.value.trim(), price: _oc || 0, steps: _oj }));
await K.logEvent(_o2.id, 'note', 'Mở hồ sơ giao dịch: ' + _of.name);
_oa.close(); _oe(); _ob(_of.id);
}, { kind: 'primary', testid: 'g2-deal-create' }))] });
}
async function _ob(id) {
const body = h('div', { 'data-testid': 'g2-deal-detail' });
const _oh = K.sheet({ title: 'Hồ sơ giao dịch', body, testid: 'g2-deal-sheet' });
const dir = await G.dir();
async function _o6() {
const _o5 = await K.get('objects', id);
if (!_o5) { _oh.close(); return; }
const _o8 = O.dealInfo(_o5);
const _o2 = _o8.customer_id ? await K.get('objects', _o8.customer_id) : null;
const comments = O.commentsOf(await K.list('events'), _o5.id);
body.innerHTML = '';
const _og = async patch => { const fresh = await K.get('objects', id); await K.put('objects', { ...fresh, ...patch }); _o6(); _oe(); };
const fLabel = h('input', { placeholder: 'Tên tệp, VD: HĐMB bản ký', 'data-testid': 'g2-file-label' });
const _o7 = h('input', { type: 'url', placeholder: 'https://drive.google.com/…', 'data-testid': 'g2-file-url' });
const cm = h('textarea', { rows: 2, placeholder: 'Ghi chú nội bộ cho cả nhóm (khách không thấy)…', 'data-testid': 'g2-deal-comment' });
body.append(
h('h3', null, _o5.name), h('p', { class: 'bds-muted' }, [_o2 ? _o2.name : '', K.projectName(_o5.project), _o8.price ? K.money(_o8.price) : '', O.DEAL_STATUS[_oi(_o5)]].filter(Boolean).join(' · ')),
h('div', { class: 'g2-bar' }, h('i', { style: { width: _o8.pct + '%' } })), h('p', { 'data-testid': 'g2-deal-pct' }, 'Đã xong ' + _o8.done + '/' + _o8.total + ' bước (' + _o8.pct + '%)'),
h('ul', { class: 'g2-steps', 'data-testid': 'g2-deal-steps-list' }, _o8.steps.map(s => h('li', { class: Number(s.done) ? 'done' : '' },
h('label', { 'data-testid': 'g2-step-row-' + s.id },
h('input', { type: 'checkbox', checked: !!Number(s.done), 'data-testid': 'g2-step-' + s.id, onchange: () => _og({ data: O.toggleStep(_o5, s.id, { by: G.user().id }) }) }),
h('span', null, s.label, Number(s.done) ? h('small', { class: 'bds-muted' }, ' · ' + G.date(s.at) + (s.by ? ' · ' + G.who(s.by, dir) : '')) : null))))),
h('h4', null, 'Tệp đính kèm (link)'),
_o8.files.length ? h('ul', { class: 'g2-parts' }, _o8.files.map(f => h('li', null, C.safeUrl(f.url) ? h('a', { href: C.safeUrl(f.url), target: '_blank', rel: 'noopener' }, f.label) : h('span', null, f.label), K.button('Bỏ link này', () => _og({ data: O.removeFile(_o5, f.id) }), { title: 'Bỏ link ' + f.label, testid: 'g2-file-del-' + f.id, icon: 'x' })))) : h('p', { class: 'bds-muted' }, 'Chưa có tệp. Tải tệp lên Drive rồi dán link vào đây.'),
h('div', { class: 'bds-grid2' }, fLabel, _o7),
K.button('+ Thêm link tệp', () => { try { _og({ data: O.addFile(_o5, { label: fLabel.value, url: _o7.value }) }); } catch (e) { K.toast(e.message, 'warn'); } }, { testid: 'g2-file-add' }),
h('h4', null, 'Trao đổi nội bộ'),
...comments.map(x => h('div', { class: 'g2-comment' }, h('small', null, G.who(C.pd(x.data).by, dir) + ' · ' + G.dt(x.at)), x.text)),
cm, K.button('Gửi ghi chú', async () => { if (!cm.value.trim()) return; await K.put('events', { object_id: _o5.id, type: 'g2_comment', text: cm.value.trim().slice(0, 2000), at: Date.now(), data: JSON.stringify({ by: G.user().id }) }); _o6(); }, { testid: 'g2-deal-comment-send' }),
h('div', { class: 'bds-row bds-wrap' },
_o2 ? K.button('Mở hồ sơ khách', () => { _oh.close(); K.afterClose(() => K.openProfile(_o2.id)); }) : null,
_oi(_o5) === 'open' ? K.button('Đánh dấu xong', () => _og({ status: 'done' }), { kind: 'primary', testid: 'g2-deal-done', icon: 'check' }) : K.button('Mở lại', () => _og({ status: 'open' }), { icon: 'undo' }),
_oi(_o5) === 'open' ? K.button('Huỷ giao dịch', async () => {
if (!(await K.confirm({ title: 'Huỷ giao dịch', text: 'Huỷ hồ sơ "' + (_o5.name || 'giao dịch') + '"? Hồ sơ chuyển sang mục "Đã huỷ", anh/chị vẫn mở lại được.', ok: 'Huỷ giao dịch', kind: 'danger', testid: 'g2-deal-cancel-c' }))) return;
await _og({ status: 'cancel' });
}, { kind: 'danger', testid: 'g2-deal-cancel' }) : null));
}
await _o6();
}
await _oe();
K.on(el, ['objects'], _oe);
}
export default {
manifest: { id: 'g2_hoso', title: 'Hồ sơ giao dịch', icon: '📁', screen: 'customers', order: 240, version: '0.1.0', status: 'thu-nghiem', pack: 'care',
help: 'Mỗi giao dịch một hồ sơ: danh sách bước cần làm, link tệp (Drive), ghi chú nội bộ cho nhóm, tiến độ %.' },
mount,
async selftest(ctx) { return g2Selftest(ctx, mount); },
};

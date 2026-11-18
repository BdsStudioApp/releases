import { g3kit, h, parseData, selftestG3, mktConfig, MKT_CFG_ID as CFG_ID } from '../g3_lib/ui.js';
import * as R from '../g3_lib/referral.js';
import { makeCode, cleanCode, referralLink, codePart, readAttribution } from '../g3_lib/attribution.js';
import { isDeal } from '../g3_lib/roi.js';
import * as B from '../g3_lib/bridge.js';
import { qrElement } from '../../../core/qr.aa623cdb09.js';
export async function mount(el, ctx) {
const G = g3kit(ctx), K = G.K;
el.innerHTML = '';
const _of = h('div', { class: 'g3', 'data-testid': 'g3-referral' });
el.appendChild(_of);
const _o6 = ctx.user || { id: '', role: 'owner', full_name: '' };
let _oj = null;
async function _oi(uid) {
if (!uid) return '';
if (!_oj) {
_oj = {};
try { if (G.isStaff) (await K.api('landing.sale_codes', {})).forEach(x => { _oj[x.user_id] = x.code; }); else { const r = await K.api('landing.my_code', {}); if (r && r.code) _oj[_o6.id] = r.code; } } catch { }
}
return _oj[uid] || '';
}
const _o9 = () => {
const _o8 = [];
try { for (const c of B.landingPages(ctx)) { const _oo = B.pageUrl(c, G.endpoint()); if (_oo) _o8.push([_oo, (c.name || c.slug) + ' – ' + _oo]); } } catch { }
return _o8;
};
async function _oe() {
const [refsRaw, customers, cfg] = await Promise.all([G.objs('g3_ref'), G.customers(), mktConfig(G)]);
const refs = refsRaw.map(R.refView);
const _oc = Number(cfg.rate_pct) || 0;
_of.innerHTML = '';
_of.appendChild(G.head('Chương trình giới thiệu', 'Link gắn mã riêng cho khách cũ, cộng tác viên: khách mới bấm link để lại số là biết ai giới thiệu, theo dõi tới khi chốt và trả thưởng.',
K.button('+ Mã giới thiệu', () => _o3(null, refs), { kind: 'primary', testid: 'ref-add' })));
const all = refs.map(r => ({ r, s: R.refStats(r, customers, _oc) }));
const _on = all.reduce((t, x) => ({ leads: t.leads + x.s.leads, deals: t.deals + x.s.deals, owed: t.owed + x.s.owed }), { leads: 0, deals: 0, owed: 0 });
_of.appendChild(h('div', { class: 'g3-grid' }, G.kpi('mã đang dùng', String(refs.filter(r => r.active).length)), G.kpi('khách được giới thiệu', String(_on.leads), 'ref-total-leads'),
G.kpi('đã chốt', String(_on.deals), 'ref-total-deals'), G.kpi('thưởng còn phải trả', G.vnd(_on.owed), 'ref-total-owed')));
if (G.isStaff) {
const _od = G.input({ value: _oc || '', inputmode: 'decimal', 'data-testid': 'ref-rate', placeholder: 'VD 1.5' });
_of.appendChild(h('details', null, h('summary', { style: 'min-height:44px;cursor:pointer' }, 'Tỷ lệ hoa hồng mặc định (để tính thưởng theo %)'),
G.field('Hoa hồng của anh/chị (% giá căn) – dùng khi khách chưa ghi số hoa hồng cụ thể', _od),
K.button('Lưu', async () => { const _op = Number(String(_od.value).replace(',', '.')) || 0; if (_op < 0 || _op > 10) return K.toast('Tỷ lệ 0–10%', 'warn'); await G.save('g3_config', { ...(cfg.row || {}), id: CFG_ID, name: 'Cài đặt marketing', status: 'config' }, { ...(cfg.row ? parseData(cfg.row.data) : {}), rate_pct: _op }); K.toast('Đã lưu', 'success'); _oe(); }, { testid: 'ref-rate-save' })));
}
if (!refs.length) { _of.appendChild(K.empty('Chưa có mã nào. Tạo mã cho khách đã mua hài lòng hoặc cộng tác viên.')); return; }
for (const { r, s } of all.sort((a, _o1) => _o1.s.leads - a.s.leads)) {
_of.appendChild(h('div', { class: 'g3-item', 'data-testid': 'ref-' + r.code },
h('div', { class: 'g3-row' }, h('strong', null, r.name + ' · ', h('span', { class: 'g3-code' }, r.code)), K.badge(R.WHO[r.who], r.active ? 'info' : 'muted')),
h('span', { class: 'g3-sub', 'data-testid': 'ref-stats-' + r.code }, `${s.leads} khách · ${s.deals} chốt · thưởng ${G.vnd(s.due)} (đã trả ${G.vnd(s.paid)}, còn ${G.vnd(s.owed)})`),
h('div', { class: 'g3-row' }, K.button('Link & theo dõi', () => _o2(r, customers, _oc), { kind: 'primary', testid: 'ref-open-' + r.code }), K.button('Sửa', () => _o3(r, refs), { testid: 'ref-edit-' + r.code }))));
}
}
function _o3(r, refs) {
const who = K.select(Object.entries(R.WHO), r ? r.who : (_o6.role === 'ctv' ? 'ctv' : 'customer'), { 'data-testid': 'ref-who' });
const name = G.input({ value: r ? r.name : (_o6.role === 'ctv' || _o6.role === 'sale' ? _o6.full_name || '' : ''), 'data-testid': 'ref-name', maxlength: 80 });
const phone = G.input({ value: r ? r.phone : '', inputmode: 'tel', 'data-testid': 'ref-phone' });
const code = G.input({ value: r ? r.code : '', 'data-testid': 'ref-code', placeholder: 'Tự tạo nếu để trống' });
const _og = K.select([['fixed', 'Số tiền cố định / căn'], ['percent', '% hoa hồng của anh/chị']], r ? r.reward.type : 'fixed', { 'data-testid': 'ref-reward-type' });
const rval = G.input({ value: r ? (r.reward.value || '') : '', inputmode: 'decimal', 'data-testid': 'ref-reward', placeholder: 'VD 5.000.000 hoặc 5tr (cố định); 10 (%)' });
const pages = _o9();
const base = G.input({ value: r ? parseData(r.raw.data).base || '' : (pages[0] ? pages[0][0] : ''), inputmode: 'url', 'data-testid': 'ref-base', placeholder: 'https://… trang landing khách sẽ mở' });
const _oa = pages.length ? K.select([['', '– Chọn trang đã xuất bản –'], ...pages], '', { onchange: e => { if (e.target.value) base.value = e.target.value; } }) : null;
const _ol = K.sheet({ title: r ? 'Sửa mã giới thiệu' : 'Mã giới thiệu mới', testid: 'ref-form', body: [
G.field('Người giới thiệu là', who), h('div', { class: 'g3-two' }, G.field('Họ tên', name), G.field('Số điện thoại', phone)),
G.field('Mã (chữ in hoa, số)', code), h('div', { class: 'g3-two' }, G.field('Cách thưởng', _og), G.field('Mức thưởng', rval, 'Thoả thuận trước bằng văn bản/Zalo với người giới thiệu.')),
_oa ? G.field('Trang landing', _oa) : null, G.field('Link trang khách sẽ mở', base),
h('div', { class: 'g3-row' }, K.button('Lưu', async () => {
const _o7 = name.value.trim();
if (_o7.length < 2) return K.toast('Nhập họ tên người giới thiệu', 'warn');
const c = cleanCode(code.value) || makeCode(codePart(_o7));
if (R.codeTaken(c, refs, r ? r.id : '')) return K.toast('Mã ' + c + ' đã dùng – chọn mã khác', 'warn');
const _o1 = base.value.trim();
if (_o1 && !/^https?:\/\//i.test(_o1)) return K.toast('Link trang phải bắt đầu bằng https://', 'warn');
const _oh = R.parseReward(_og.value, rval.value);
if (!_oh.ok) return K.toast(_oh.error, 'warn');
const _op = _oh.value;
const prev = r ? parseData(r.raw.data) : {};
const uid = prev.user_id || ((who.value === 'ctv' || who.value === 'sale') && (_o6.role === 'ctv' || _o6.role === 'sale') ? _o6.id : '');
await G.save('g3_ref', { ...(r ? r.raw : {}), name: _o7, phone: K.crm.normPhone(phone.value), status: r && !r.active ? 'paused' : 'active' },
{ ...prev, code: c, who: who.value, user_id: uid, base: _o1, reward: { type: _og.value, value: _op } });
_ol.close(); K.toast('Đã lưu mã ' + c, 'success'); _oe();
}, { kind: 'primary', testid: 'ref-save' }),
r ? K.button(r.active ? 'Tạm dừng mã' : 'Dùng lại mã', async () => { await K.put('objects', { ...r.raw, status: r.active ? 'paused' : 'active' }); _ol.close(); _oe(); }, { testid: 'ref-pause' }) : null,
r && G.canErase ? K.button('Xoá mã', async () => { if (await G.deleteRow(r.raw, { title: 'Xoá mã giới thiệu?', text: 'Xoá mã ' + r.code + '. Khách đã vào bằng mã này vẫn giữ nguyên nhưng không còn tính thưởng cho ai; link cũ vẫn mở được.' })) { _ol.close(); _oe(); } }, { kind: 'danger', testid: 'ref-del' }) : null),
] });
}
async function _o2(r, customers, _oc) {
const d = parseData(r.raw.data);
const s = R.refStats(r, customers, _oc);
let _o5 = d.base ? referralLink(d.base, r.code) : '';
const _ok = await _oi(r.user_id);
if (_o5 && _ok) _o5 += '&s=' + _ok;
const agent = await G.agent();
const _o4 = R.inviteText(r, _o5 || '(chưa có link trang)', { agent: agent.name });
const _o0 = K.select([['', '– Chọn khách để gắn vào mã –'], ...customers.filter(c => !readAttribution(c).ref).slice(0, 300).map(c => [c.id, c.name + (c.phone ? ' · ' + K.phone(c.phone) : '')])], '', { 'data-testid': 'ref-attach-pick' });
let _ob = null;
try { if (_o5) _ob = qrElement(_o5, { scale: 4, title: 'Mã QR link giới thiệu' }); } catch { _ob = null; }
const _ol = K.sheet({ title: 'Mã ' + r.code + ' – ' + r.name, testid: 'ref-detail', body: [
_o5 ? h('div', { class: 'g3-item' }, h('span', { class: 'g3-code', 'data-testid': 'ref-link' }, _o5), h('div', { class: 'g3-row' }, K.button('Chép link', () => G.copy(_o5), { testid: 'ref-copy-link' }), K.button('Chép lời mời gửi Zalo', () => G.copy(_o4), { testid: 'ref-copy-invite' })), _ob) :
G.note('Chưa có link trang – bấm Sửa để chọn trang landing.'),
h('p', null, `${s.leads} khách · ${s.deals} chốt · thưởng phải trả ${G.vnd(s.due)} · đã trả ${G.vnd(s.paid)} · còn ${G.vnd(s.owed)}`),
s.list.length ? h('div', { class: 'g3-scroll' }, h('table', { class: 'g3-tbl' }, h('thead', null, h('tr', null, h('th', null, 'Khách'), h('th', null, 'Giai đoạn'), h('th', { class: 'n' }, 'Thưởng'))),
h('tbody', null, s.list.map(c => h('tr', null, h('td', null, h('button', { type: 'button', class: 'bds-row-main', onclick: () => K.openProfile(c.id) }, c.name)), h('td', null, c.status || 'Mới'), h('td', { class: 'n' }, isDeal(c) ? G.vnd(R.rewardFor(r, c, _oc)) : '–')))))) : K.empty('Chưa có khách nào qua mã này.'),
G.isStaff && s.owed > 0 ? K.button('Ghi đã trả thưởng ' + G.vnd(s.owed), async () => {
await G.save('g3_ref', r.raw, { ...d, payouts: [...(d.payouts || []), { amount: s.owed, at: Date.now(), by: _o6.id }] }); K.toast('Đã ghi trả thưởng', 'success'); _ol.close(); _oe();
}, { kind: 'primary', testid: 'ref-pay' }) : null,
h('h4', null, 'Khách giới thiệu qua điện thoại / gặp trực tiếp'),
G.field('Gắn khách có sẵn vào mã này', _o0),
K.button('Gắn vào mã', async () => {
const c = customers.find(x => x.id === _o0.value); if (!c) return K.toast('Chọn khách', 'warn');
await K.put('objects', { ...c, data: R.attachRef(c, r.code) }); await K.logEvent(c.id, 'note', 'Gắn mã giới thiệu ' + r.code + ' (' + r.name + ')');
K.toast('Đã gắn ' + c.name + ' vào mã ' + r.code, 'success'); _ol.close(); _oe();
}, { testid: 'ref-attach' }),
] });
}
await _oe();
K.on(el, ['objects'], _oe);
}
export default {
manifest: { id: 'g3_referral', title: 'Chương trình giới thiệu', icon: '🤝', screen: 'customers', order: 54, version: '0.1.0', status: 'ready',
help: 'Tạo mã giới thiệu cho khách cũ/CTV: link gắn mã + mã QR, tự ghi ai giới thiệu khi khách để lại số, theo dõi tới khi chốt, tính và ghi trả thưởng.' },
mount,
async selftest(ctx) {
const ref = R.refView({ id: 'r', name: 'A', data: JSON.stringify({ code: 'AB-12345', reward: { type: 'fixed', value: 1e6 } }) });
const _om = R.refStats(ref, [{ id: 'c', kind: 'customer', status: 'Đã mua', data: JSON.stringify({ landing_url: 'https://x.vn/?ref=AB-12345' }) }]);
if (_om.deals !== 1 || _om.due !== 1e6) return { ok: false, details: 'Tính thưởng giới thiệu sai' };
return selftestG3(ctx);
},
};

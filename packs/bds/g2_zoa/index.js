import { g2kit, h, selftestCommon } from '../g2_lib/ui.js';
import * as C from '../g2_lib/core.js';
import * as T from '../g2_lib/talk.js';
const STEPS = [
'Đăng ký Zalo Official Account (OA) tại oa.zalo.me – cần giấy tờ doanh nghiệp/hộ kinh doanh hoặc tài khoản cá nhân đã xác thực theo quy định của Zalo.',
'Tạo ứng dụng tại developers.zalo.me, liên kết ứng dụng với OA, bật quyền gửi tin và quản lý người quan tâm.',
'Lấy App ID, Secret key, Access token và Refresh token của OA (trang Zalo for Developers → Official Account API) rồi dán vào đây.',
'Dán địa chỉ Webhook (địa chỉ để Zalo gửi tin khách về app) bên dưới vào mục Webhook của ứng dụng, chọn sự kiện "người dùng gửi tin nhắn", "quan tâm", "bỏ quan tâm".',
];
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
el.innerHTML = '';
const _o0 = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-zoa' }, G.head('Zalo OA'), _o0));
const st = { followers: null, picked: new Map() };
async function _oi() {
_o0.innerHTML = '';
_o0.appendChild(h('div', { class: 'g2-guard', 'data-testid': 'g2-zoa-policy' }, 'Chỉ dùng API chính thức của Zalo Official Account. App KHÔNG đăng nhập, KHÔNG điều khiển và KHÔNG gửi tin tự động từ Zalo cá nhân. Mọi tin gửi qua OA phải do anh/chị bấm gửi.'));
if (!G.isStaff()) { _o0.appendChild(h('p', { class: 'bds-muted', 'data-testid': 'g2-zoa-staff' }, 'Zalo OA do Quản trị/Quản lý phụ trách. Tin khách nhắn OA đã gắn với khách của anh/chị sẽ hiện trong lịch sử khách.')); await _o9(); return; }
let _oj;
try { _oj = await K.api('g2.zoa.status', {}); }
catch (e) { _o0.appendChild(h('p', { class: 'bds-warn' }, (e && (e.message || e.userMessage)) || 'Chưa đọc được trạng thái Zalo OA – kiểm tra kết nối máy chủ.')); return; }
if (!_oj.configured) {
_o0.appendChild(h('div', { class: 'g2-need', 'data-testid': 'g2-zoa-need' }, h('strong', null, 'Cần đăng ký Zalo OA'), h('p', null, 'Chưa có App ID và Access token của Zalo OA. Các bước:'), h('ol', null, STEPS.map(x => h('li', null, x))),
h('p', { class: 'bds-muted' }, 'Chi phí: dùng OA và tin tư vấn trả lời khách không mất phí theo chính sách hiện hành của Zalo; tin ZNS (tin mẫu gửi theo số điện thoại) Zalo tính phí từng tin – xem bảng giá trên trang ZNS của Zalo trước khi dùng.')));
} else {
_o0.appendChild(K.card({ title: 'Kết nối', testid: 'g2-zoa-status', body: [
h('p', null, 'App ID ' + _oj.app_id + (_oj.last ? ' · ' + (_oj.last.ok ? '✓ ' : '✕ ') + _oj.last.message + ' (' + G.dt(_oj.last.at) + ')' : ' · chưa kiểm tra')),
_oj.token_expires_at ? h('p', { class: _oj.token_expires_at < Date.now() ? 'bds-danger' : 'bds-muted' }, 'Access token hết hạn: ' + G.dt(_oj.token_expires_at)) : null,
G.isOwner() ? h('div', { class: 'bds-row bds-wrap' }, K.button('Kiểm tra kết nối', async () => { const _oh = await K.api('g2.zoa.test', {}); K.toast(_oh.message, _oh.ok ? 'success' : 'warn'); _oi(); }, { testid: 'g2-zoa-test' }),
K.button('Làm mới token', async () => { try { await K.api('g2.zoa.refresh', {}); K.toast('Đã làm mới Access token', 'success'); _oi(); } catch (e) { K.toast(e.message, 'warn'); } }, { testid: 'g2-zoa-refresh' })) : null,
_oj.webhook_url ? h('div', null, h('p', null, 'Địa chỉ Webhook (dán vào trang ứng dụng Zalo):'), h('code', { class: 'g2-src', 'data-testid': 'g2-zoa-hook' }, _oj.webhook_url), ' ', K.button('Chép', async () => { await K.copy(_oj.webhook_url); K.toast('Đã chép', 'success'); }),
h('p', { class: 'g2-src' }, 'Địa chỉ có mã bí mật – không chia sẻ. ' + (_oj.webhook_last ? 'Lần nhận gần nhất: ' + G.dt(_oj.webhook_last) + '.' : 'Chưa nhận sự kiện nào.') + ' Nếu Zalo yêu cầu xác thực tên miền cho Webhook, địa chỉ script.google.com không xác thực được – khi đó cần một tên miền riêng chuyển tiếp (chưa có trong bản thử nghiệm này).'))
: G.isOwner() ? h('p', { class: 'g2-src', 'data-testid': 'g2-zoa-hook-none' }, 'Địa chỉ Webhook chỉ có khi máy chủ chạy trên Apps Script (chế độ Xem thử không nhận được tin từ Zalo).') : null] }));
}
if (G.isOwner()) _o0.appendChild(_o3(_oj));
if (_oj.configured) { _o0.appendChild(_o8()); }
await _o9();
if (_oj.configured && G.isOwner()) _o0.appendChild(_op());
}
function _o3(_oj) {
const _o7 = { app_id: h('input', { placeholder: _oj.has.app_id ? 'Đã lưu – nhập để thay' : 'Dãy số', inputmode: 'numeric', 'data-testid': 'g2-zoa-appid' }), app_secret: h('input', { type: 'password', autocomplete: 'off', placeholder: _oj.has.app_secret ? 'Đã lưu – nhập để thay' : '', 'data-testid': 'g2-zoa-secret' }),
access_token: h('input', { type: 'password', autocomplete: 'off', placeholder: _oj.has.access_token ? 'Đã lưu – nhập để thay' : '', 'data-testid': 'g2-zoa-access' }), refresh_token: h('input', { type: 'password', autocomplete: 'off', placeholder: _oj.has.refresh_token ? 'Đã lưu – nhập để thay' : '', 'data-testid': 'g2-zoa-refresh-token' }) };
return h('details', { class: 'bds-sample', open: !_oj.configured, 'data-testid': 'g2-zoa-config' }, h('summary', null, 'Cài đặt Zalo OA (chỉ Quản trị)'),
h('div', { class: 'bds-grid2' }, K.field('App ID', _o7.app_id), K.field('Secret key', _o7.app_secret), K.field('Access token', _o7.access_token), K.field('Refresh token', _o7.refresh_token)),
h('p', { class: 'g2-src' }, 'Khoá lưu trên máy chủ của anh/chị (Apps Script), không lưu trên điện thoại, không hiện lại sau khi lưu.'),
h('div', { class: 'bds-row bds-wrap' },
K.button('Lưu', async () => {
const _og = {}; for (const _oa in _o7) if (_o7[_oa].value.trim()) _og[_oa] = _o7[_oa].value.trim();
if (!Object.keys(_og).length) { K.toast('Chưa nhập gì', 'warn'); return; }
try { await K.api('g2.zoa.config', _og); K.toast('Đã lưu khoá Zalo OA', 'success'); _oi(); } catch (e) { K.toast(e.message, 'warn'); }
}, { kind: 'primary', testid: 'g2-zoa-save' }),
_oj.configured ? K.button('Đổi mã Webhook', async () => {
if (!(await K.confirm({ title: 'Đổi mã Webhook', text: 'Địa chỉ Webhook cũ sẽ ngừng nhận tin. Anh/chị phải dán địa chỉ mới vào trang ứng dụng Zalo thì tin khách nhắn OA mới về lại app. Đổi mã?', ok: 'Đổi mã', kind: 'danger', testid: 'g2-zoa-newhook-c' }))) return;
await K.api('g2.zoa.config', { new_hook: true }); K.toast('Đã đổi mã Webhook – dán địa chỉ mới vào Zalo for Developers', 'success'); _oi();
}, { testid: 'g2-zoa-newhook', icon: 'key' }) : null,
_oj.configured ? K.button('Ngắt Zalo OA', async () => { if (await K.confirm({ title: 'Ngắt Zalo OA', text: 'Xoá mọi khoá Zalo OA khỏi máy chủ?', ok: 'Ngắt', kind: 'danger' })) { await K.api('g2.zoa.config', { clear: true }); _oi(); } }, { kind: 'danger', icon: 'plug', testid: 'g2-zoa-clear' }) : null));
}
function _o8() {
const list = h('div', { class: 'bds-list', 'data-testid': 'g2-zoa-followers' });
const _on = h('select', { 'data-testid': 'g2-zoa-tpl' });
const ta = h('textarea', { rows: 5, 'data-testid': 'g2-zoa-text', placeholder: 'Nội dung tin tư vấn – {ten} = tên người nhận' });
const _o4 = h('strong', null, '0');
const card = K.card({ title: 'Người quan tâm OA', testid: 'g2-zoa-fcard', actions: [K.button('Tải danh sách', () => _od(), { testid: 'g2-zoa-load', icon: 'refresh' })], body: [list,
h('h4', null, 'Gửi tin tư vấn'), K.field('Mẫu', _on), ta,
h('p', { class: 'g2-src' }, 'Zalo chỉ cho OA gửi tin tư vấn tới người đã tương tác với OA trong khoảng thời gian Zalo quy định; ngoài khoảng đó Zalo báo lỗi và app hiện nguyên văn. Tối đa 30 người mỗi lần.'),
h('div', { class: 'bds-row' }, h('span', null, 'Đã chọn ', _o4), K.button('Gửi tin', send, { kind: 'primary', testid: 'g2-zoa-send' }))] });
(async () => {
const [cfg, mine, zcfg, skills] = await Promise.all([K.setting('g2.scripts', null), G.objectsOf('g2_script'), K.setting('zalo_templates', {}), K.setting('skills', [])]);
const z = G.crm.mergeTemplates(G.crm.TEMPLATES, zcfg, G.crm.skillTemplates(skills));
const all = [...z.map(t => ({ id: 'z:' + t.id, title: 'Mẫu Zalo: ' + t.title, text: t.text })), ...T.mergeScripts(cfg, mine).map(_oj => ({ id: 's:' + _oj.id, title: 'Kịch bản: ' + _oj.title, text: _oj.text }))];
_on.appendChild(h('option', { value: '' }, '— Chọn mẫu —'));
all.forEach(t => _on.appendChild(h('option', { value: t.id }, t.title)));
_on.addEventListener('change', async () => { const t = all.find(x => x.id === _on.value); if (t) { const me = await K.me(); ta.value = G.crm.fillTemplate(t.text, { ten: '{ten}', ten_toi: me.name, sdt_toi: me.phone }).replace(/\s+\{/g, ' {'); } });
})();
async function _od() {
try { st.followers = await K.api('g2.zoa.followers', {}); } catch (e) { K.toast(e.message, 'warn'); return; }
_o6();
}
async function _o6() {
const customers = await G.customers();
const _oc = new Map(customers.filter(_o2 => C.g2Of(_o2).zoa_uid).map(_o2 => [C.g2Of(_o2).zoa_uid, _o2]));
list.innerHTML = '';
if (!st.followers) { list.appendChild(K.empty('Bấm "Tải danh sách" để lấy người quan tâm OA.')); return; }
list.appendChild(h('p', { class: 'bds-muted' }, 'Tổng ' + st.followers.total + ' người quan tâm (đang hiện ' + st.followers.users.length + ').'));
for (const _oo of st.followers.users) {
const _o2 = _oc.get(_oo.user_id);
list.appendChild(h('div', { class: 'bds-item bds-selecting g2-zoa-u', 'data-testid': 'g2-zoa-u-' + _oo.user_id },
h('label', { class: 'bds-pick-wrap', 'aria-label': 'Chọn ' + (_o2 ? _o2.name : (_oo.name || _oo.user_id)) }, h('input', { type: 'checkbox', class: 'bds-pick', checked: st.picked.has(_oo.user_id), 'data-testid': 'g2-zoa-pick-' + _oo.user_id, onchange: e => { if (e.target.checked) st.picked.set(_oo.user_id, { user_id: _oo.user_id, name: _o2 ? G.crm.givenName(_o2.name) : (_oo.name || ''), customer_id: _o2 ? _o2.id : '' }); else st.picked.delete(_oo.user_id); _o4.textContent = String(st.picked.size); } })),
h('div', { class: 'bds-row-main' }, h('strong', null, _oo.name || _oo.user_id), h('span', { class: 'bds-sub' }, _o2 ? 'Khách: ' + _o2.name : 'Chưa liên kết khách')),
h('div', { class: 'bds-acts' }, K.button(_o2 ? 'Đổi khách' : 'Liên kết khách', () => _ob(_oo, customers, _o2), { testid: 'g2-zoa-link-' + _oo.user_id, icon: 'link' }))));
}
_o4.textContent = String(st.picked.size);
}
async function send() {
const _om = [...st.picked.values()];
if (!_om.length) { K.toast('Chọn người nhận', 'warn'); return; }
if (!ta.value.trim()) { K.toast('Nhập nội dung', 'warn'); return; }
if (_om.length > 30) { K.toast('Tối đa 30 người mỗi lần', 'warn'); return; }
const ok = await K.confirm({ title: 'Gửi tin qua Zalo OA', text: 'Gửi tin tư vấn tới ' + _om.length + ' người? Tin gửi đi không thu hồi được.', ok: 'Gửi', testid: 'g2-zoa-confirm' });
if (!ok) return;
try {
const _oh = await K.api('g2.zoa.send', { text: ta.value.trim(), recipients: _om });
K.toast('Đã gửi ' + _oh.sent + '/' + _om.length + (_oh.failed ? ' – ' + _oh.results.filter(x => !x.ok).map(x => x.message).slice(0, 1).join('') : ''), _oh.failed ? 'warn' : 'success');
st.picked.clear(); _o6();
} catch (e) { K.toast(e.message, 'warn'); }
}
async function _ob(_oo, customers, cur) {
const _ok = G.customerSelect(customers, cur ? cur.id : '', { 'data-testid': 'g2-zoa-link-sel' });
let _oe;
_oe = K.modal({ title: 'Liên kết ' + (_oo.name || _oo.user_id), body: [h('p', { class: 'bds-muted' }, 'Gắn người quan tâm OA với hồ sơ khách để tin nhắn tới/đi hiện trong lịch sử khách.'), K.field('Khách', _ok),
h('div', { class: 'bds-row bds-end' }, K.button('Lưu', async () => {
if (cur && cur.id !== _ok.value) await G.patchG2(cur.id, { zoa_uid: '' });
if (_ok.value) await G.patchG2(_ok.value, { zoa_uid: _oo.user_id, zoa_name: _oo.name || '' });
_oe.close(); _o6();
}, { kind: 'primary', testid: 'g2-zoa-link-save' }))] });
}
_o6();
return card;
}
async function _o9() {
const [events, customers] = await Promise.all([K.list('events'), G.customers()]);
const _o1 = new Map(customers.map(_o2 => [_o2.id, _o2]));
const _of = events.filter(e => e.type === 'g2_zoa_in').sort((a, b) => b.at - a.at).slice(0, 30);
_o0.appendChild(K.card({ title: 'Tin nhắn tới OA (' + _of.length + ')', testid: 'g2-zoa-inbox', body: _of.length ? h('div', { class: 'bds-list' }, _of.map(e => {
const _o2 = _o1.get(e.object_id);
return h('div', { class: 'bds-item' }, h('div', { class: 'bds-row-main' }, h('strong', null, _o2 ? _o2.name : 'Người quan tâm ' + (C.pd(e.data).uid || '')), h('span', { class: 'bds-sub' }, G.dt(e.at) + ' · ' + String(e.text || '').slice(0, 160))),
h('div', { class: 'bds-acts' }, K.button('Gợi ý trả lời', () => K.nav('#/customers/g2_tuvan?tab=reply'), { icon: 'sparkle' })));
})) : K.empty('Chưa có tin. Tin khách nhắn OA về qua Webhook sẽ hiện ở đây.') }));
}
function _op() {
const phone = h('input', { type: 'tel', placeholder: '09xxxxxxxx' });
const _ol = h('input', { inputmode: 'numeric', placeholder: 'Mã mẫu ZNS do Zalo duyệt' });
const data = h('textarea', { rows: 3, placeholder: '{"ten_khach": "Hoa", "ngay": "20/11/2026"}' });
const paid = h('input', { type: 'checkbox' });
return h('details', { class: 'bds-sample', 'data-testid': 'g2-zoa-zns' }, h('summary', null, 'Tin ZNS theo mẫu (Zalo tính phí từng tin)'),
h('p', { class: 'bds-muted' }, 'ZNS gửi theo số điện thoại bằng mẫu Zalo đã duyệt (vd xác nhận lịch hẹn). Chỉ gửi khi khách đã đồng ý nhận tin.'),
h('div', { class: 'bds-grid2' }, K.field('Số điện thoại', phone), K.field('Mã mẫu', _ol)), K.field('Thông tin điền vào mẫu', data, 'Mỗi mục: "tên ô trong mẫu": "nội dung", cách nhau dấu phẩy, đặt trong { }'),
h('label', { class: 'bds-check' }, paid, ' Tôi biết tin này bị Zalo tính phí'),
K.button('Gửi ZNS', async () => {
let _o5 = {}; try { _o5 = data.value.trim() ? JSON.parse(data.value) : {}; } catch { K.toast('Thông tin điền vào mẫu chưa đúng dạng – xem ví dụ trong ô', 'warn'); return; }
try { await K.api('g2.zoa.zns', { phone: phone.value, template_id: _ol.value.trim(), template_data: _o5, confirm_paid: paid.checked }); K.toast('Đã gửi ZNS', 'success'); } catch (e) { K.toast(e.message, 'warn'); }
}));
}
await _oi();
}
export default {
manifest: { id: 'g2_zoa', title: 'Zalo OA', icon: '🟦', screen: 'customers', order: 290, version: '0.1.0', status: 'thu-nghiem', pack: 'care',
help: 'Kết nối Zalo Official Account bằng API chính thức: gửi tin tư vấn theo mẫu tới người quan tâm, nhận tin nhắn qua Webhook. Không tự động hoá Zalo cá nhân.' },
mount,
async selftest(ctx) { return selftestCommon(ctx, ['fmt.money']); },
};

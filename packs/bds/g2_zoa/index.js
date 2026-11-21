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
const box = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-zoa' }, G.head('Zalo OA'), box));
const st = { followers: null, picked: new Map() };
async function _og() {
box.innerHTML = '';
box.appendChild(h('div', { class: 'g2-guard', 'data-testid': 'g2-zoa-policy' }, 'Chỉ dùng API chính thức của Zalo Official Account. App KHÔNG đăng nhập, KHÔNG điều khiển và KHÔNG gửi tin tự động từ Zalo cá nhân. Mọi tin gửi qua OA phải do anh/chị bấm gửi.'));
if (!G.isStaff()) { box.appendChild(h('p', { class: 'bds-muted', 'data-testid': 'g2-zoa-staff' }, 'Zalo OA do Quản trị/Quản lý phụ trách. Tin khách nhắn OA đã gắn với khách của anh/chị sẽ hiện trong lịch sử khách.')); await _o7(); return; }
let _oh;
try { _oh = await K.api('g2.zoa.status', {}); }
catch (e) { box.appendChild(h('p', { class: 'bds-warn' }, (e && (e.message || e.userMessage)) || 'Chưa đọc được trạng thái Zalo OA – kiểm tra kết nối máy chủ.')); return; }
if (!_oh.configured) {
box.appendChild(h('div', { class: 'g2-need', 'data-testid': 'g2-zoa-need' }, h('strong', null, 'Cần đăng ký Zalo OA'), h('p', null, 'Chưa có App ID và Access token của Zalo OA. Các bước:'), h('ol', null, STEPS.map(x => h('li', null, x))),
h('p', { class: 'bds-muted' }, 'Chi phí (chính sách Zalo, kiểm 18/11/2026 – xem lại trang chính sách OA của Zalo): tin tư vấn miễn phí 8 tin đầu trong 48 giờ sau lần khách tương tác cuối, quá mức đó Zalo tính phí; tin ZNS (tin mẫu gửi theo số điện thoại) Zalo tính phí từng tin – xem bảng giá trên trang ZNS của Zalo trước khi dùng.')));
} else {
box.appendChild(K.card({ title: 'Kết nối', testid: 'g2-zoa-status', body: [
h('p', null, 'App ID ' + _oh.app_id + (_oh.last ? ' · ' + (_oh.last.ok ? '✓ ' : '✕ ') + _oh.last.message + ' (' + G.dt(_oh.last.at) + ')' : ' · chưa kiểm tra')),
_oh.token_expires_at ? h('p', { class: _oh.token_expires_at < Date.now() ? 'bds-danger' : 'bds-muted' }, 'Access token hết hạn: ' + G.dt(_oh.token_expires_at)) : null,
G.isOwner() ? h('div', { class: 'bds-row bds-wrap' }, K.button('Kiểm tra kết nối', async () => { const _of = await K.api('g2.zoa.test', {}); K.toast(_of.message, _of.ok ? 'success' : 'warn'); _og(); }, { testid: 'g2-zoa-test' }),
K.button('Làm mới token', async () => { try { await K.api('g2.zoa.refresh', {}); K.toast('Đã làm mới Access token', 'success'); _og(); } catch (e) { K.toast(e.message, 'warn'); } }, { testid: 'g2-zoa-refresh' })) : null,
_oh.webhook_url ? h('div', null, h('p', null, 'Địa chỉ Webhook (dán vào trang ứng dụng Zalo):'), h('code', { class: 'g2-src', 'data-testid': 'g2-zoa-hook' }, _oh.webhook_url), ' ', K.button('Chép', async () => { await K.copy(_oh.webhook_url); K.toast('Đã chép', 'success'); }),
h('p', { class: 'g2-src' }, 'Địa chỉ có mã bí mật – không chia sẻ. ' + (_oh.webhook_last ? 'Lần nhận gần nhất: ' + G.dt(_oh.webhook_last) + '.' : 'Chưa nhận sự kiện nào.') + ' Nếu Zalo yêu cầu xác thực tên miền cho Webhook, địa chỉ script.google.com không xác thực được – khi đó cần một tên miền riêng chuyển tiếp (chưa có trong bản thử nghiệm này).'))
: G.isOwner() ? h('p', { class: 'g2-src', 'data-testid': 'g2-zoa-hook-none' }, 'Địa chỉ Webhook chỉ có khi máy chủ chạy trên Apps Script (chế độ Xem thử không nhận được tin từ Zalo).') : null] }));
}
if (G.isOwner()) box.appendChild(_o1(_oh));
if (_oh.configured) { box.appendChild(_o6()); }
await _o7();
if (_oh.configured && G.isOwner()) box.appendChild(_on());
}
function _o1(_oh) {
const _o5 = { app_id: h('input', { placeholder: _oh.has.app_id ? 'Đã lưu – nhập để thay' : 'Dãy số', inputmode: 'numeric', 'data-testid': 'g2-zoa-appid' }), app_secret: h('input', { type: 'password', autocomplete: 'off', placeholder: _oh.has.app_secret ? 'Đã lưu – nhập để thay' : '', 'data-testid': 'g2-zoa-secret' }),
access_token: h('input', { type: 'password', autocomplete: 'off', placeholder: _oh.has.access_token ? 'Đã lưu – nhập để thay' : '', 'data-testid': 'g2-zoa-access' }), refresh_token: h('input', { type: 'password', autocomplete: 'off', placeholder: _oh.has.refresh_token ? 'Đã lưu – nhập để thay' : '', 'data-testid': 'g2-zoa-refresh-token' }) };
return h('details', { class: 'bds-sample', open: !_oh.configured, 'data-testid': 'g2-zoa-config' }, h('summary', null, 'Cài đặt Zalo OA (chỉ Quản trị)'),
h('div', { class: 'bds-grid2' }, K.field('App ID', _o5.app_id), K.field('Secret key', _o5.app_secret), K.field('Access token', _o5.access_token), K.field('Refresh token', _o5.refresh_token)),
h('p', { class: 'g2-src' }, 'Khoá lưu trên máy chủ của anh/chị (Apps Script), không lưu trên điện thoại, không hiện lại sau khi lưu.'),
h('div', { class: 'bds-row bds-wrap' },
K.button('Lưu', async () => {
const _oe = {}; for (const _o8 in _o5) if (_o5[_o8].value.trim()) _oe[_o8] = _o5[_o8].value.trim();
if (!Object.keys(_oe).length) { K.toast('Chưa nhập gì', 'warn'); return; }
try { await K.api('g2.zoa.config', _oe); K.toast('Đã lưu khoá Zalo OA', 'success'); _og(); } catch (e) { K.toast(e.message, 'warn'); }
}, { kind: 'primary', testid: 'g2-zoa-save' }),
_oh.configured ? K.button('Đổi mã Webhook', async () => {
if (!(await K.confirm({ title: 'Đổi mã Webhook', text: 'Địa chỉ Webhook cũ sẽ ngừng nhận tin. Anh/chị phải dán địa chỉ mới vào trang ứng dụng Zalo thì tin khách nhắn OA mới về lại app. Đổi mã?', ok: 'Đổi mã', kind: 'danger', testid: 'g2-zoa-newhook-c' }))) return;
await K.api('g2.zoa.config', { new_hook: true }); K.toast('Đã đổi mã Webhook – dán địa chỉ mới vào Zalo for Developers', 'success'); _og();
}, { testid: 'g2-zoa-newhook', icon: 'key' }) : null,
_oh.configured ? K.button('Ngắt Zalo OA', async () => { if (await K.confirm({ title: 'Ngắt Zalo OA', text: 'Xoá mọi khoá Zalo OA khỏi máy chủ?', ok: 'Ngắt', kind: 'danger' })) { await K.api('g2.zoa.config', { clear: true }); _og(); } }, { kind: 'danger', icon: 'plug', testid: 'g2-zoa-clear' }) : null));
}
function _o6() {
const list = h('div', { class: 'bds-list', 'data-testid': 'g2-zoa-followers' });
const _ol = h('select', { 'data-testid': 'g2-zoa-tpl' });
const ta = h('textarea', { rows: 5, 'data-testid': 'g2-zoa-text', placeholder: 'Nội dung tin tư vấn – {ten} = tên người nhận' });
const _o2 = h('strong', null, '0');
const card = K.card({ title: 'Người quan tâm OA', testid: 'g2-zoa-fcard', actions: [K.button('Tải danh sách', () => _ob(), { testid: 'g2-zoa-load', icon: 'refresh' })], body: [list,
h('h4', null, 'Gửi tin tư vấn'), K.field('Mẫu', _ol), ta,
h('p', { class: 'g2-src' }, 'Zalo chỉ cho OA gửi tin tư vấn (qua API) tới người quan tâm trong 7 ngày kể từ lần cuối người đó nhắn tin hoặc tương tác với OA – không nhắn được bất cứ lúc nào. Quá hạn: chờ khách nhắn lại OA, hoặc dùng tin ZNS theo mẫu đã duyệt (tính phí). Zalo từ chối thì app hiện nguyên văn lỗi. Tối đa 30 người mỗi lần.'),
h('div', { class: 'bds-row' }, h('span', null, 'Đã chọn ', _o2), K.button('Gửi tin', send, { kind: 'primary', testid: 'g2-zoa-send' }))] });
(async () => {
const [cfg, mine, zcfg, skills] = await Promise.all([K.setting('g2.scripts', null), G.objectsOf('g2_script'), K.setting('zalo_templates', {}), K.setting('skills', [])]);
const z = G.crm.mergeTemplates(G.crm.TEMPLATES, zcfg, G.crm.skillTemplates(skills));
const all = [...z.map(t => ({ id: 'z:' + t.id, title: 'Mẫu Zalo: ' + t.title, text: t.text })), ...T.mergeScripts(cfg, mine).map(_oh => ({ id: 's:' + _oh.id, title: 'Kịch bản: ' + _oh.title, text: _oh.text }))];
_ol.appendChild(h('option', { value: '' }, '— Chọn mẫu —'));
all.forEach(t => _ol.appendChild(h('option', { value: t.id }, t.title)));
_ol.addEventListener('change', async () => { const t = all.find(x => x.id === _ol.value); if (t) { const me = await K.me(); ta.value = G.crm.fillTemplate(t.text, { ten: '{ten}', ten_toi: me.name, sdt_toi: me.phone }).replace(/\s+\{/g, ' {'); } });
})();
async function _ob() {
try { st.followers = await K.api('g2.zoa.followers', {}); } catch (e) { K.toast(e.message, 'warn'); return; }
_o4();
}
async function _o4() {
const customers = await G.customers();
const _oa = new Map(customers.filter(_o0 => C.g2Of(_o0).zoa_uid).map(_o0 => [C.g2Of(_o0).zoa_uid, _o0]));
list.innerHTML = '';
if (!st.followers) { list.appendChild(K.empty('Bấm "Tải danh sách" để lấy người quan tâm OA.')); return; }
list.appendChild(h('p', { class: 'bds-muted' }, 'Tổng ' + st.followers.total + ' người quan tâm (đang hiện ' + st.followers.users.length + ').'));
for (const _om of st.followers.users) {
const _o0 = _oa.get(_om.user_id);
list.appendChild(h('div', { class: 'bds-item bds-selecting g2-zoa-u', 'data-testid': 'g2-zoa-u-' + _om.user_id },
h('label', { class: 'bds-pick-wrap', 'aria-label': 'Chọn ' + (_o0 ? _o0.name : (_om.name || _om.user_id)) }, h('input', { type: 'checkbox', class: 'bds-pick', checked: st.picked.has(_om.user_id), 'data-testid': 'g2-zoa-pick-' + _om.user_id, onchange: e => { if (e.target.checked) st.picked.set(_om.user_id, { user_id: _om.user_id, name: _o0 ? G.crm.givenName(_o0.name) : (_om.name || ''), customer_id: _o0 ? _o0.id : '' }); else st.picked.delete(_om.user_id); _o2.textContent = String(st.picked.size); } })),
h('div', { class: 'bds-row-main' }, h('strong', null, _om.name || _om.user_id), h('span', { class: 'bds-sub' }, _o0 ? 'Khách: ' + _o0.name : 'Chưa liên kết khách')),
h('div', { class: 'bds-acts' }, K.button(_o0 ? 'Đổi khách' : 'Liên kết khách', () => _o9(_om, customers, _o0), { testid: 'g2-zoa-link-' + _om.user_id, icon: 'link' }))));
}
_o2.textContent = String(st.picked.size);
}
async function send() {
const _ok = [...st.picked.values()];
if (!_ok.length) { K.toast('Chọn người nhận', 'warn'); return; }
if (!ta.value.trim()) { K.toast('Nhập nội dung', 'warn'); return; }
if (_ok.length > 30) { K.toast('Tối đa 30 người mỗi lần', 'warn'); return; }
const ok = await K.confirm({ title: 'Gửi tin qua Zalo OA', text: 'Gửi tin tư vấn tới ' + _ok.length + ' người? Tin gửi đi không thu hồi được.', ok: 'Gửi', testid: 'g2-zoa-confirm' });
if (!ok) return;
try {
const _of = await K.api('g2.zoa.send', { text: ta.value.trim(), recipients: _ok });
K.toast('Đã gửi ' + _of.sent + '/' + _ok.length + (_of.failed ? ' – ' + _of.results.filter(x => !x.ok).map(x => x.message).slice(0, 1).join('') : ''), _of.failed ? 'warn' : 'success');
st.picked.clear(); _o4();
} catch (e) { K.toast(e.message, 'warn'); }
}
async function _o9(_om, customers, cur) {
const _oi = G.customerSelect(customers, cur ? cur.id : '', { 'data-testid': 'g2-zoa-link-sel' });
let _oc;
_oc = K.modal({ title: 'Liên kết ' + (_om.name || _om.user_id), body: [h('p', { class: 'bds-muted' }, 'Gắn người quan tâm OA với hồ sơ khách để tin nhắn tới/đi hiện trong lịch sử khách.'), K.field('Khách', _oi),
h('div', { class: 'bds-row bds-end' }, K.button('Lưu', async () => {
if (cur && cur.id !== _oi.value) await G.patchG2(cur.id, { zoa_uid: '' });
if (_oi.value) await G.patchG2(_oi.value, { zoa_uid: _om.user_id, zoa_name: _om.name || '' });
_oc.close(); _o4();
}, { kind: 'primary', testid: 'g2-zoa-link-save' }))] });
}
_o4();
return card;
}
async function _o7() {
const [events, customers] = await Promise.all([K.list('events'), G.customers()]);
const byId = new Map(customers.map(_o0 => [_o0.id, _o0]));
const _od = events.filter(e => e.type === 'g2_zoa_in').sort((a, b) => b.at - a.at).slice(0, 30);
box.appendChild(K.card({ title: 'Tin nhắn tới OA (' + _od.length + ')', testid: 'g2-zoa-inbox', body: _od.length ? h('div', { class: 'bds-list' }, _od.map(e => {
const _o0 = byId.get(e.object_id);
return h('div', { class: 'bds-item' }, h('div', { class: 'bds-row-main' }, h('strong', null, _o0 ? _o0.name : 'Người quan tâm ' + (C.pd(e.data).uid || '')), h('span', { class: 'bds-sub' }, G.dt(e.at) + ' · ' + String(e.text || '').slice(0, 160))),
h('div', { class: 'bds-acts' }, K.button('Gợi ý trả lời', () => K.nav('#/home/g2_tuvan?tab=reply'), { icon: 'sparkle' })));
})) : K.empty('Chưa có tin. Tin khách nhắn OA về qua Webhook sẽ hiện ở đây.') }));
}
function _on() {
const phone = h('input', { type: 'tel', placeholder: '09xxxxxxxx' });
const _oj = h('input', { inputmode: 'numeric', placeholder: 'Mã mẫu ZNS do Zalo duyệt' });
const data = h('textarea', { rows: 3, placeholder: '{"ten_khach": "Hoa", "ngay": "20/11/2026"}' });
const paid = h('input', { type: 'checkbox' });
return h('details', { class: 'bds-sample', 'data-testid': 'g2-zoa-zns' }, h('summary', null, 'Tin ZNS theo mẫu (Zalo tính phí từng tin)'),
h('p', { class: 'bds-muted' }, 'ZNS gửi theo số điện thoại bằng mẫu Zalo đã duyệt (vd xác nhận lịch hẹn). Chỉ gửi khi khách đã đồng ý nhận tin.'),
h('div', { class: 'bds-grid2' }, K.field('Số điện thoại', phone), K.field('Mã mẫu', _oj)), K.field('Thông tin điền vào mẫu', data, 'Mỗi mục: "tên ô trong mẫu": "nội dung", cách nhau dấu phẩy, đặt trong { }'),
h('label', { class: 'bds-check' }, paid, ' Tôi biết tin này bị Zalo tính phí'),
K.button('Gửi ZNS', async () => {
let _o3 = {}; try { _o3 = data.value.trim() ? JSON.parse(data.value) : {}; } catch { K.toast('Thông tin điền vào mẫu chưa đúng dạng – xem ví dụ trong ô', 'warn'); return; }
try { await K.api('g2.zoa.zns', { phone: phone.value, template_id: _oj.value.trim(), template_data: _o3, confirm_paid: paid.checked }); K.toast('Đã gửi ZNS', 'success'); } catch (e) { K.toast(e.message, 'warn'); }
}));
}
await _og();
}
export default {
manifest: { id: 'g2_zoa', title: 'Zalo OA', icon: '🟦', screen: 'customers', order: 290, version: '0.1.0', status: 'thu-nghiem', pack: 'leads',
help: 'Kết nối Zalo Official Account bằng API chính thức: nhận tin nhắn qua Webhook, trả lời bằng tin tư vấn theo mẫu cho người quan tâm trong 7 ngày kể từ lần cuối người đó nhắn tin hoặc tương tác với OA (quy định Zalo). Không tự động hoá Zalo cá nhân.' },
mount,
async selftest(ctx) { return selftestCommon(ctx, ['fmt.money']); },
};

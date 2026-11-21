import * as M from './machine.js';
import * as P from './provision.js';
import * as SL from '../../shared/site_logic.js';
export const WORKER_FILE = 'downloads/bds_trang_worker.js';
export function buyAdvice(ui, cfg, { testid = 'cty-advice' } = {}) {
const { h } = ui;
const L = P.domainLinks(cfg || {});
const _o0 = (href, label, tid) => h('a', { class: 'btn btn-secondary btn-sm', href, target: '_blank', rel: P.SPONSORED_REL, 'data-testid': tid }, ui.icon('external', 18), h('span', null, label));
return h('div', { class: 'wiz-note wiz-advice', 'data-testid': testid },
h('p', null, h('strong', null, 'Nên mua và giữ tên miền ở Cloudflare:')),
h('ul', null,
h('li', null, 'Bán đúng giá gốc, gia hạn không tăng giá; DNS, https và Worker (trang nhân viên) miễn phí trong cùng tài khoản.'),
h('li', null, 'Đuôi .vn: Cloudflare KHÔNG bán – mua ở nhà đăng ký Việt Nam được cấp phép, rồi đổi nameserver về Cloudflare.')),
h('div', { class: 'btn-row' }, _o0(L.url, 'Mua tên miền', testid + '-buy'), L.vnUrl ? _o0(L.vnUrl, 'Mua tên miền .vn', testid + '-buy-vn') : null),
L.affiliate || L.vnAffiliate
? h('p', { class: 'muted small', 'data-testid': testid + '-disclosure' }, P.DISCLOSURE + ' – bên bán có thể nhận hoa hồng nếu mua qua link này; giá không đổi. Mua ở đâu cũng được.')
: h('p', { class: 'muted small', 'data-testid': testid + '-disclosure' }, 'Link tới Cloudflare Registrar – Cloudflare không có chương trình giới thiệu, bên bán không nhận hoa hồng.'));
}
export async function workerCode({ fetchFn, domain, server, siteKey, appOrigin = '' }) {
const code = await fetchFn(WORKER_FILE);
return SL.fillWorkerConfig(code, { DOMAIN: domain, SERVER_URL: server, SITE_KEY: siteKey, APP_HOST: SL.appHostOf(domain), APP_ORIGIN: appOrigin });
}
export function companyDomainWidget(ctl, { ui, rerender }) {
const { h, button } = ui;
const cfg = ctl.config || {};
const data = () => (((ctl.state && ctl.state.data) || {}).coDomain) || {};
const _oj = (p) => ctl.set(M.setData(ctl.state, { coDomain: { ...data(), ...p } }));
const _oh = h('div', { class: 'wiz-box wiz-cty', 'data-testid': 'cty-domain' });
const _ol = h('div', { class: 'wiz-cty-subs' });
const _o9 = async (u) => { const _og = await fetch(u, { cache: 'no-store' }); if (!_og.ok) throw new Error('Không tải được ' + u + ' (' + _og.status + ')'); return _og.text(); };
_oc();
return _oh;
function _oc() {
ui.clear(_oh);
const _o5 = data();
const has = _o5.has === 'yes' || _o5.has === 'no' ? _o5.has : '';
_oh.append(h('p', null, h('strong', null, 'Công ty đã có tên miền chưa?')),
ui.segmented([{ value: 'yes', label: 'Có, đã có tên miền', icon: 'link' }, { value: 'no', label: 'Chưa có', icon: 'plus' }], has,
(v) => { _oj({ has: v }); _oc(); }, { label: 'Công ty đã có tên miền chưa?', name: 'cty-has' }));
if (!has) return;
if (has === 'yes') {
_oh.append(h('p', { class: 'wiz-note', 'data-testid': 'cty-separate' }, h('strong', null, 'Khuyên dùng: mua THÊM 1 tên miền riêng cho app'),
' (vd tencongty-app.vn) – app và dữ liệu khách tách khỏi website cũ: sửa website không làm hỏng app, đổi nameserver không đụng thư/website đang chạy.'));
const use = _o5.use === 'old' ? 'old' : 'new';
_oh.append(ui.segmented([{ value: 'new', label: 'Mua thêm tên miền cho app (khuyên dùng)', icon: 'plus' }, { value: 'old', label: 'Dùng tên miền đang có', icon: 'link' }], use,
(v) => { _oj({ use: v }); _oc(); }, { label: 'Tên miền cho app', name: 'cty-use' }));
if (use === 'new') _oh.append(buyAdvice(ui, cfg));
else _oh.append(h('p', { class: 'wiz-warn', 'data-testid': 'cty-old-warn' }, '⚠️ Cloudflare sẽ quản lý DNS của cả tên miền: khi thêm vào Cloudflare, kiểm đủ bản ghi website và thư (MX) Cloudflare tự quét được TRƯỚC khi đổi nameserver. Mỗi tên con website đang dùng (www, blog…) cần 1 tuyến Worker "None" (mục ③) để trang nhân viên không chiếm chỗ; nhân viên không đặt địa chỉ riêng trùng các tên đó.'));
} else _oh.append(h('p', { class: 'wiz-note', 'data-testid': 'cty-trial' }, h('strong', null, 'Dùng thử trước? '),
'Bấm "Làm tiếp sau" ở cuối bước – app vẫn chạy ở địa chỉ miễn phí đang mở. Mua tên miền công ty trước khi dùng thật.'), buyAdvice(ui, cfg));
_oh.append(_o8(), _ol);
_od();
}
function _od() { ui.mountTo(_ol, _o3(), _om()); }
function _o8() {
const _o5 = data();
const err = h('p', { class: 'small form-err', 'aria-live': 'polite', 'data-testid': 'cty-domain-err' });
const _of = h('div', { class: 'wiz-cty-preview', 'data-testid': 'cty-preview' });
const f = ui.field({ label: 'Tên miền dùng cho app (tên miền gốc, không có app.)', id: 'cty-domain-input', value: _o5.domain || '', placeholder: 'tencongty.vn', inputmode: 'url', autocomplete: 'off',
onInput: () => _ok() });
f.input.setAttribute('data-testid', 'cty-domain-input'); f.input.setAttribute('spellcheck', 'false'); f.input.setAttribute('autocapitalize', 'off');
function _ok() {
const _oe = SL.companyDomainProblem(f.getValue());
ui.clear(_of); err.textContent = '';
if (!_oe.ok) { if (String(f.getValue() || '').trim()) err.textContent = _oe.msg; if (_oe.code === 'SUBDOMAIN' && _oe.domain) _of.append(button('Dùng ' + _oe.domain, () => { f.setValue(_oe.domain); _ok(); }, { kind: 'ghost', small: true, icon: 'check', testid: 'cty-use-zone' })); return; }
if (_oe.domain !== data().domain) { _oj({ domain: _oe.domain }); _od(); }
const _oi = 'lan';
_of.append(ui.table([{ k: 'App công ty', v: 'https://' + SL.appHostOf(_oe.domain) }, { k: 'Trang riêng nhân viên (vd Lan)', v: SL.memberUrl(_oi, _oe.domain) }],
[{ label: 'Dùng cho', key: 'k' }, { label: 'Địa chỉ', key: 'v', render: (_og) => h('code', { class: 'mono', 'data-testid': 'cty-addr-' + (_og.k.startsWith('App') ? 'app' : 'member') }, _og.v) }]));
}
if (_o5.domain) setTimeout(_ok, 0);
return h('div', { class: 'wiz-cty-sec', 'data-testid': 'cty-domain-box' }, h('h3', { class: 'wiz-h3' }, '① Tên miền'), f, err, _of);
}
function _o3() {
const _o7 = () => data().domain || '<tên miền>';
const _ob = h('div', { class: 'small', 'aria-live': 'polite', 'data-testid': 'cty-zone-result' });
const target = (ctl.cnameTarget && ctl.cnameTarget()) || '';
const _o2 = button('Kiểm tra tên miền', async () => {
const _o5 = data().domain;
if (!_o5) { ui.toast('Gõ tên miền ở mục ① trước.', 'warn'); return; }
ui.mountTo(_ob, ui.spinner(), ' Đang kiểm ' + _o5 + '…');
let _og;
try { _og = await ctl.api.call('setup.wizard_check', { kind: 'zone', domain: _o5 }); } catch (e) { _og = { ok: false, message: e.userMessage || e.message }; }
_ob.className = 'small ' + (_og && _og.ok ? 'wiz-ok' : 'form-err');
_ob.dataset.state = _og && _og.ok ? 'ok' : 'bad';
ui.mountTo(_ob, (_og && _og.ok ? '✅ ' : '❌ ') + ((_og && _og.message) || 'Chưa kiểm được.'));
}, { kind: 'secondary', small: true, icon: 'pulse', testid: 'cty-zone-check' });
return h('div', { class: 'wiz-cty-sec', 'data-testid': 'cty-cf-box' }, h('h3', { class: 'wiz-h3' }, '② Đưa tên miền vào Cloudflare (gói Free)'),
h('ol', { class: 'wiz-actions' },
h('li', null, 'Đăng nhập ', h('a', { href: 'https://dash.cloudflare.com/', target: '_blank', rel: 'noopener' }, 'dash.cloudflare.com'), ' bằng tài khoản Cloudflare CỦA CÔNG TY → ', h('strong', null, 'Add a domain'), ' → gõ ', h('code', null, _o7()), ' → chọn gói ', h('strong', null, 'Free'), '. (Mua ở Cloudflare thì đã có sẵn – bỏ qua dòng này và dòng sau.)'),
h('li', null, 'Cloudflare đưa 2 nameserver (dạng ana.ns.cloudflare.com) → vào nơi mua tên miền, thay nameserver bằng đúng 2 tên đó. Cloudflare gửi thư "… is now active" khi xong (thường dưới 1 giờ, lâu nhất 24 giờ; gói Free chờ quá 28 ngày thì Cloudflare tự xoá).'),
h('li', null, 'Gắn ', h('code', null, 'app.' + _o7()), ' vào app: Workers & Pages › dự án app › ', h('strong', null, 'Custom domains'), ' › ', h('strong', null, 'Set up a custom domain'), '.',
target ? [' App do bên bán giữ: thêm bản ghi ', h('strong', null, 'CNAME app → '), h('code', { 'data-testid': 'cty-cname-target' }, target), ' rồi báo bên bán.'] : ' App do bên bán giữ: báo bên bán tên miền, bên bán gửi lại dòng CNAME cần thêm.'),
h('li', { 'data-testid': 'cty-back-zone' }, 'Đổi nameserver xong → ', h('strong', null, 'QUAY LẠI tab BDS Studio này'), ' → bấm ', h('strong', null, 'Kiểm tra tên miền'), ' ngay dưới.')),
h('div', { class: 'btn-row' }, _o2), _ob);
}
function _om() {
const _o5 = data();
const how = _o5.how === 'seller' ? 'seller' : 'paste';
const box = h('div', { class: 'wiz-cty-sec', 'data-testid': 'cty-worker-box' }, h('h3', { class: 'wiz-h3' }, '③ Bật trang riêng cho nhân viên (1 lần)'),
h('p', { class: 'muted small' }, 'Một Worker (chương trình nhỏ chạy trên Cloudflare, miễn phí 100.000 lượt/ngày) phục vụ mọi trang ten.' + (_o5.domain || '<tên miền>') + '. Form khách gửi thẳng về máy chủ của công ty, vào đúng danh sách của nhân viên đó.'),
ui.segmented([{ value: 'paste', label: 'Tự dán (khoảng 5 phút)', icon: 'copy' }, { value: 'seller', label: 'Nhờ bên bán làm giúp', icon: 'user' }], how,
(v) => { _oj({ how: v }); _od(); }, { label: 'Cách bật Worker', name: 'cty-how' }));
const _o7 = _o5.domain || '<tên miền>';
const _o4 = (label, text, tid) => button(label, () => ui.copy(typeof text === 'function' ? text() : text), { kind: 'ghost', small: true, icon: 'copy', testid: tid });
if (how === 'paste') {
const _oa = async () => {
const _o6 = data().domain;
if (!_o6) throw new Error('Gõ tên miền ở mục ① trước.');
const _o1 = await ctl.api.call('site.cfg_get');
const target = (ctl.cnameTarget && ctl.cnameTarget()) || '';
return workerCode({ fetchFn: _o9, domain: _o6, server: _o1.server_url || '', siteKey: _o1.site_key || '', appOrigin: /\.pages\.dev$/.test(target) ? 'https://' + target : '' });
};
box.append(h('ol', { class: 'wiz-actions', 'data-testid': 'cty-paste-guide' },
h('li', null, 'Cloudflare › Workers & Pages › ', h('strong', null, 'Create'), ' › ', h('strong', null, 'Create Worker'), ' → đặt tên ', h('code', null, SL.WORKER_NAME), ' → ', h('strong', null, 'Deploy'), ' → ', h('strong', null, 'Edit code'), '.'),
h('li', null, 'Bấm ', h('strong', null, 'Chép mã Worker'), ' (đã điền sẵn tên miền, địa chỉ máy chủ, mã trang) → xoá hết mã mẫu → dán → ', h('strong', null, 'Deploy'), '. Mã có mã trang bí mật: chỉ dán vào Cloudflare, không gửi ai.'),
h('li', null, 'Trang tên miền ', h('code', null, _o7), ' › ', h('strong', null, 'Workers Routes'), ' › ', h('strong', null, 'Add route'), ': ', h('code', { 'data-testid': 'cty-route-star' }, '*.' + _o7 + '/*'), ' → Worker ', h('code', null, SL.WORKER_NAME),
'. Thêm tiếp ', h('code', { 'data-testid': 'cty-route-app' }, 'app.' + _o7 + '/*'), ' → Worker ', h('strong', null, 'None'), ' (app chạy thẳng, không tốn lượt Worker).',
_o5.has === 'yes' && _o5.use === 'old' ? [' Tên miền đang có website: thêm tuyến ', h('code', { 'data-testid': 'cty-route-keep' }, 'www.' + _o7 + '/*'), ' → None, và như vậy cho từng tên con website đang dùng.'] : null),
h('li', null, 'Trang tên miền › ', h('strong', null, 'DNS'), ' › ', h('strong', null, 'Add record'), ': Type ', h('strong', null, 'AAAA'), ', Name ', h('strong', null, '*'), ', IPv6 ', h('strong', null, '100::'), ', Proxy ', h('strong', null, 'bật (đám mây cam)'), ' → Save.'),
h('li', { 'data-testid': 'cty-back-worker' }, 'Xong ở Cloudflare → ', h('strong', null, 'QUAY LẠI tab BDS Studio này'), ' → bấm ', h('strong', null, 'Kiểm tra bước này'), ' ở chân trợ lý.')),
h('div', { class: 'btn-row' },
button('Chép mã Worker', async () => { const code = await _oa(); await ui.copy(code); }, { kind: 'primary', small: true, icon: 'copy', testid: 'cty-copy-worker' }),
button('Tải tệp Worker', async () => {
const code = await _oa();
const _o0 = h('a', { href: URL.createObjectURL(new Blob([code], { type: 'text/javascript' })), download: 'bds-trang.js' }); document.body.append(_o0); _o0.click(); _o0.remove();
}, { kind: 'ghost', small: true, icon: 'download', testid: 'cty-download-worker' }),
_o4('Chép tuyến', '*.' + _o7 + '/*', 'cty-copy-route')),
h('details', { class: 'wiz-manual', 'data-testid': 'cty-turnstile' }, h('summary', null, 'Chống spam nâng cao (tuỳ chọn, miễn phí): Cloudflare Turnstile'),
h('p', { class: 'small' }, 'Form đã có ô bẫy máy quét + giới hạn 5 lượt/10 phút mỗi máy. Muốn chắc hơn: Cloudflare › Turnstile › Add widget (Hostname: ' + _o7 + ') → Worker bds-trang › Settings › Variables and Secrets: thêm TURNSTILE_SITE_KEY và TURNSTILE_SECRET (loại Secret). Gói Free: không giới hạn lượt kiểm, tối đa 20 widget.')));
} else {
box.append(h('ol', { class: 'wiz-actions', 'data-testid': 'cty-seller-guide' },
h('li', null, 'Cloudflare › My Profile › API Tokens › Create Token › ', h('strong', null, 'Create Custom Token'), ', đặt tên "BDS Studio – trang nhân viên".'),
h('li', null, 'Permissions (đúng 4 dòng): ', h('strong', null, 'Account › Workers Scripts › Edit'), ' · ', h('strong', null, 'Zone › Workers Routes › Edit'), ' · ', h('strong', null, 'Zone › DNS › Edit'), ' · ', h('strong', null, 'Zone › Zone › Read'), '.'),
h('li', null, 'Zone Resources: ', h('strong', null, 'Include › Specific zone › ' + _o7), '. Nên đặt ngày hết hạn. Create Token → Copy.'),
h('li', null, 'Gửi token + mã trang cho bên bán qua kênh riêng (tin nhắn tự huỷ hoặc đọc qua điện thoại) – không gửi nhóm chat, không email công khai. Xong việc có thể thu hồi token ở trang API Tokens.')),
h('div', { class: 'btn-row' }, button('Chép mã trang', async () => { const _o1 = await ctl.api.call('site.cfg_get'); await ui.copy(_o1.site_key || ''); }, { kind: 'secondary', small: true, icon: 'copy', testid: 'cty-copy-sitekey' })),
h('p', { class: 'muted small' }, 'Bên bán cài sẵn Worker, bản ghi * và 2 tuyến giúp anh/chị. Token (mã quyền giới hạn) chỉ sửa được DNS/Worker của đúng tên miền này, không đọc được dữ liệu khách.'));
}
return box;
}
}
export default { companyDomainWidget, buyAdvice, workerCode, WORKER_FILE };

import * as M from './machine.js';
import * as P from './provision.js';
import { supportEmail } from './steps.js';
const STEP = 'diachi';
export function diachiWidget(ctl, { ui, rerender }) {
const { h, button } = ui;
const _o6 = ctl.config || {};
const base = P.baseDomain(_o6);
const flow = (ctl.state && ctl.state.flow) || 'personal';
const company = flow === 'company';
const _o8 = ctl.provision || P.createProvisionClient({ url: _o6.PROVISION_URL });
const data = () => ((ctl.state && ctl.state.data) || {}).diachi || {};
const _o10 = (p) => ctl.set(M.setData(ctl.state, { diachi: { ...data(), ...p } }));
const _oy = h('div', { class: 'wiz-box wiz-diachi', 'data-testid': 'diachi' });
const _on = h('div', { class: 'wiz-diachi-live', 'aria-live': 'polite', 'data-testid': 'diachi-live' });
let _o2 = false;
if (!_o8.configured) {
_oy.append(h('div', { 'data-testid': 'diachi-noservice' }, wishBox(ctl, ui, { company })));
return _oy;
}
const _of = data();
if (_of.slug && _of.sent) { _oy.append(_on); setTimeout(() => _oj(_of.slug, _of.domain || '', _of.mode || 'tu-do'), 0); return _oy; }
_os();
return _oy;
function _os() {
ui.clear(_oy);
const _oe = data();
if (!company) {
const choice = _oe.choice === 'custom' ? 'custom' : 'free';
_oy.append(ui.segmented([{ value: 'free', label: 'Dùng địa chỉ miễn phí' }, { value: 'custom', label: 'Gán tên miền riêng' }], choice,
(v) => { _o10({ choice: v }); _os(); }, { label: 'Địa chỉ app', name: 'diachi-choice' }));
_oy.append(choice === 'free' ? _ok() : _od({ mode: 'ten-mien' }));
} else {
const has = _oe.coHas === 'yes' ? 'yes' : _oe.coHas === 'no' ? 'no' : '';
_oy.append(h('p', null, h('strong', null, 'Công ty đã có tên miền chưa?')),
ui.segmented([{ value: 'yes', label: 'Có, đã có tên miền' }, { value: 'no', label: 'Chưa có' }], has, (v) => { _o10({ coHas: v }); _os(); }, { label: 'Công ty đã có tên miền chưa?', name: 'diachi-co-has' }));
if (has === 'yes') {
_oy.append(h('p', { class: 'wiz-note', 'data-testid': 'diachi-co-separate' }, 'Đã có website? Nên mua THÊM 1 tên miền riêng cho app (vd tencongty-app.vn): app và dữ liệu khách tách khỏi website cũ – sửa website không làm hỏng app, app không đụng thư và website đang chạy.'));
const how = _oe.coHow === 'seller' ? 'seller' : 'cf';
_oy.append(h('p', { class: 'muted small' }, 'Đặt app ở đâu?'),
ui.segmented([{ value: 'cf', label: 'Trong Cloudflare của công ty' }, { value: 'seller', label: 'Bên bán đặt giúp (trỏ CNAME)' }], how, (v) => { _o10({ coHow: v }); _os(); }, { label: 'Đặt app ở đâu', name: 'diachi-co-how' }));
_oy.append(how === 'cf' ? _o5() : _od({ mode: 'ten-mien', withAdvice: false }));
} else if (has === 'no') {
_oy.append(_o1(), h('p', { class: 'wiz-warn', 'data-testid': 'diachi-co-required' }, 'Bản Công ty bắt buộc dùng tên miền của công ty (app ở app.tencongty.vn, trang riêng nhân viên ở ten.tencongty.vn). Mua xong tên miền thì chọn "Có, đã có tên miền" ở trên.'));
}
}
_oy.append(_on);
}
function _ok() {
const _oe = data();
const _o1d = (ctl.getUser && ctl.getUser()) || {};
const _oa = ((ctl.state && ctl.state.data && ctl.state.data.company) || {}).name || '';
const _o13 = P.suggestSlugs(company ? _oa || _o1d.full_name || '' : _o1d.full_name || _o1d.username || '', { extra: _o1d.username ? [_o1d.username] : [] });
const status = h('p', { class: 'small', 'data-testid': 'diachi-slug-status', 'aria-live': 'polite', dataset: { state: 'idle' } });
const create = button('Tạo ngay', () => start({ slug: input.value, domain: '', mode: 'tu-do' }), { kind: 'primary', testid: 'diachi-create', disabled: true });
const input = h('input', { id: 'diachi-slug', type: 'text', inputmode: 'url', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', maxlength: String(P.SLUG_MAX + 5),
placeholder: _o13[0] || 'ten-cua-ban', value: _oe.slug || '', 'aria-describedby': 'diachi-rules', 'data-testid': 'diachi-slug' });
let _o17 = 0, seq = 0, last = '';
const _o7 = () => {
const v = P.normalizeSlug(input.value).replace(/-+$/, '');
if (v !== input.value && document.activeElement !== input) input.value = v;
if (v === last) return;
last = v;
const _ou = P.slugProblem(v);
create.disabled = true;
clearTimeout(_o17);
if (!_ou.ok) { _o15(_ou.code === 'EMPTY' ? '' : '❌ ' + _ou.msg, _ou.code === 'EMPTY' ? 'idle' : 'bad'); return; }
_o15('… Đang kiểm ' + v + '.' + base, 'checking');
const _op = ++seq;
_o17 = setTimeout(async () => {
let _ov;
try { _ov = await _o8.slug(v); } catch (e) { if (_op === seq) _o15('⚠️ ' + (e.message || P.ERROR_TEXT.NETWORK), 'bad'); return; }
if (_op !== seq) return;
if (_ov.available) { _o15('✅ Còn trống: ' + v + '.' + base, 'ok'); create.disabled = false; _o10({ slug: v }); } else _o15('❌ ' + (_ov.message || P.ERROR_TEXT.TAKEN), 'bad');
}, 350);
};
function _o15(msg, state) { status.textContent = msg; status.dataset.state = state; status.className = 'small ' + (state === 'ok' ? 'wiz-ok' : state === 'bad' ? 'form-err' : 'muted'); }
input.addEventListener('input', () => { const _o3 = input.selectionStart; const n = P.normalizeSlug(input.value); if (n !== input.value) { input.value = n; try { input.setSelectionRange(_o3, _o3); } catch { } } _o7(); });
input.addEventListener('blur', _o7);
if (input.value) setTimeout(_o7, 0);
return h('div', { class: 'wiz-diachi-free', 'data-testid': 'diachi-free' },
h('label', { for: 'diachi-slug', class: 'field-label' }, 'Dùng địa chỉ miễn phí:'),
h('div', { class: 'wiz-slug-row' }, h('span', { class: 'wiz-slug-pre' }, 'https://'), input, h('span', { class: 'wiz-slug-suf', 'data-testid': 'diachi-suffix' }, '.' + base)),
status,
h('p', { class: 'muted small', id: 'diachi-rules' }, 'Chữ thường không dấu (a-z), số (0-9) và dấu "-"; ' + P.SLUG_MIN + '–' + P.SLUG_MAX + ' ký tự; không bắt đầu/kết thúc bằng "-". Tên đã chọn không đổi được sau này.'),
_o13.length ? h('div', { class: 'wiz-sugg', 'data-testid': 'diachi-suggest' }, h('span', { class: 'muted small' }, 'Gợi ý: '),
_o13.map((_oz) => button(_oz, () => { input.value = _oz; _o7(); input.focus(); }, { kind: 'ghost', small: true, testid: 'diachi-sugg-' + _oz }))) : null,
h('div', { class: 'btn-row' }, create));
}
function _o1() {
const L = P.domainLinks(_o6);
const _o0 = (href, label, tid) => h('a', { class: 'btn btn-secondary btn-sm', href, target: '_blank', rel: P.SPONSORED_REL, 'data-testid': tid }, label);
return h('div', { class: 'wiz-note wiz-advice', 'data-testid': 'diachi-advice' },
h('p', null, h('strong', null, 'Nên mua và giữ tên miền ở Cloudflare – vì sao:')),
h('ul', null,
h('li', null, 'Bán tên miền đúng giá gốc của nhà quản lý tên miền, gia hạn không tăng giá, không bán thêm dịch vụ.'),
h('li', null, 'Miễn phí: DNS (trỏ tên miền) nhanh, chứng chỉ bảo mật https (SSL), mạng phân phối (CDN) giúp app mở nhanh.'),
h('li', null, 'Hộp thư theo tên miền MIỄN PHÍ để NHẬN thư: bật Email Routing → thư gửi tới hotro@(tên miền của anh/chị) tự chuyển về Gmail của anh/chị. Muốn GỬI thư bằng địa chỉ tên miền thì cần thêm dịch vụ khác (vd Google Workspace, Zoho Mail).'),
h('li', null, 'Đuôi .vn: Cloudflare KHÔNG bán .vn – mua ở nhà đăng ký tên miền Việt Nam (được Bộ TT&TT cấp phép), rồi đổi nameserver về Cloudflare để dùng các phần miễn phí trên.')),
h('div', { class: 'btn-row' }, _o0(L.url, 'Mua tên miền', 'diachi-buy'), L.vnUrl ? _o0(L.vnUrl, 'Mua tên miền .vn', 'diachi-buy-vn') : null),
L.affiliate || L.vnAffiliate ? h('p', { class: 'muted small', 'data-testid': 'diachi-disclosure' }, DISCLOSURE_TEXT)
: h('p', { class: 'muted small', 'data-testid': 'diachi-no-affiliate' }, NO_AFFILIATE_TEXT));
}
function _od({ mode = 'ten-mien', withAdvice = true, takeCf = null } = {}) {
const _oe = data();
const cname = h('div', { class: 'wiz-cname', 'data-testid': 'diachi-cname' });
const err = h('p', { class: 'small form-err', 'aria-live': 'polite', 'data-testid': 'diachi-domain-err' });
const create = button('Tạo ngay', () => go(), { kind: 'primary', testid: 'diachi-create', disabled: true });
const dom = ui.field({ label: company ? 'Tên miền của công ty cho app' : 'Tên miền riêng của anh/chị', id: 'diachi-domain', value: _oe.domain || '', placeholder: company ? 'app.tencongty.vn' : 'app.tencuaban.com', inputmode: 'url', autocomplete: 'off',
hint: 'Nên dùng tên con, vd app.tencuaban.com (tên miền gốc tencuaban.com chỉ gắn được khi tên miền nằm ở Cloudflare).', onInput: () => _ot() });
dom.input.setAttribute('data-testid', 'diachi-domain');
let slug = '', seq = 0;
async function _ot() {
const _ou = P.domainProblem(dom.getValue(), { base });
ui.clear(cname); create.disabled = true; err.textContent = '';
if (!_ou.ok) { if (String(dom.getValue() || '').trim()) err.textContent = _ou.msg; return; }
const _op = ++seq;
slug = await _ol(_ou.host);
if (_op !== seq) return;
if (!slug) { err.textContent = P.ERROR_TEXT.NETWORK; return; }
_o10({ domain: _ou.host });
ui.mountTo(cname, _o9(_ou.host, slug));
create.disabled = false;
}
async function go() {
const _ou = P.domainProblem(dom.getValue(), { base });
if (!_ou.ok || !slug) return;
const cf = takeCf ? takeCf() : null;
if (takeCf && !cf) return;
await start({ slug, domain: _ou.host, mode, cf });
}
if (dom.getValue()) setTimeout(_ot, 0);
return h('div', { class: 'wiz-diachi-custom', 'data-testid': 'diachi-custom' }, withAdvice ? _o1() : null, dom, err, cname, h('div', { class: 'btn-row' }, create));
}
async function _ol(host) {
for (let _om = 0; _om < 4; _om++) {
const _oz = P.hiddenSlug(host, _om);
if (!_oz) return '';
try { const _ov = await _o8.slug(_oz); if (_ov.available) return _oz; } catch { return ''; }
}
return '';
}
function _o9(host, slug, target = '') {
const _o3 = P.cnameFor(host, slug, { target });
return h('div', null,
h('p', null, h('strong', null, 'Thêm đúng 1 bản ghi ở nơi quản lý tên miền ' + _o3.zone + ':')),
ui.table([{ k: 'Loại (Type)', v: 'CNAME' }, { k: 'Tên (Name/Host)', v: _o3.name }, { k: 'Trỏ tới (Target/Value)', v: _o3.target }, { k: 'TTL', v: 'Tự động (Auto)' },
{ k: 'Proxy (chỉ ở Cloudflare)', v: 'Bật (đám mây cam)' }], [{ label: 'Ô cần điền', key: 'k' }, { label: 'Giá trị', key: 'v', render: (_ov) => h('code', { class: 'mono', 'data-testid': 'diachi-cname-' + (_ov.k.startsWith('Tên') ? 'name' : _ov.k.startsWith('Trỏ') ? 'target' : 'x') }, _ov.v) }]),
_o3.apex ? h('p', { class: 'wiz-warn' }, '⚠️ Đây là tên miền GỐC: chỉ gắn được khi tên miền đã nằm ở Cloudflare (nameserver Cloudflare). Dễ nhất: dùng tên con, vd app.' + host + '.') : null,
h('p', { class: 'muted small' }, 'Thêm xong có thể mất 5 phút đến 24 giờ (thường dưới 30 phút) mới chạy. Cloudflare tự cấp https.'));
}
function _o5() {
const guide = h('ol', { class: 'wiz-actions', 'data-testid': 'diachi-cf-guide' },
h('li', null, 'Đăng nhập dash.cloudflare.com bằng tài khoản Cloudflare của công ty → góc trên phải: biểu tượng người › ', h('strong', null, 'My Profile'), ' › ', h('strong', null, 'API Tokens'), ' › ', h('strong', null, 'Create Token'), '.'),
h('li', null, 'Chọn ', h('strong', null, 'Create Custom Token'), ' → đặt tên "BDS Studio" → Permissions: ', h('strong', null, 'Account › Cloudflare Pages › Edit'), ' (CHỈ quyền này).'),
h('li', null, 'Account Resources: ', h('strong', null, 'Include › tài khoản của công ty'), ' → (nên) đặt ngày hết hạn → ', h('strong', null, 'Continue to summary › Create Token'), ' → bấm Copy.'),
h('li', null, 'Account ID: trang Workers & Pages của tài khoản đó, cột phải "Account ID" (32 ký tự).'),
h('li', null, 'Dán vào 2 ô dưới (chỉ 1 lần): mã gửi thẳng tới dịch vụ tạo app, được mã hoá ngay, KHÔNG lưu trên trình duyệt, không hiện lại. Thu hồi bất kỳ lúc nào ở trang API Tokens (khi đó bên bán không đưa được bản cập nhật lên nữa).'));
const acct = ui.field({ label: 'Account ID của Cloudflare công ty', id: 'diachi-cf-account', autocomplete: 'off', placeholder: '32 ký tự 0-9 a-f' });
acct.input.setAttribute('data-testid', 'diachi-cf-account');
const _o1a = ui.field({ label: 'Mã Cloudflare (API token)', id: 'diachi-cf-token', type: 'password', autocomplete: 'off', placeholder: 'dán mã vừa tạo' });
_o1a.input.setAttribute('data-testid', 'diachi-cf-token'); _o1a.input.setAttribute('autocomplete', 'off'); _o1a.input.setAttribute('spellcheck', 'false');
const _oc = _od({ mode: 'cf-khach', withAdvice: false, takeCf: () => {
const cf = { token: String(_o1a.getValue() || '').trim(), account: String(acct.getValue() || '').trim().toLowerCase() };
if (!/^[A-Za-z0-9_-]{30,80}$/.test(cf.token) || !/^[a-f0-9]{32}$/.test(cf.account)) { ui.toast(P.ERROR_TEXT.BAD_CF + ' Account ID: 32 ký tự 0-9 a-f.', 'warn', 6000); return null; }
_o1a.setValue(''); acct.setValue('');
return cf;
} });
return h('div', { class: 'wiz-diachi-cf', 'data-testid': 'diachi-cf' }, h('p', { class: 'wiz-note' }, 'App nằm trong tài khoản Cloudflare CỦA CÔNG TY: công ty giữ toàn quyền; bên bán chỉ dùng mã giới hạn (chỉ Cloudflare Pages) để đưa bản cập nhật đã ký lên.'),
guide, h('div', { class: 'grid-2' }, acct, _o1a), _oc);
}
let _o1c = null, tsId = null;
async function _o4() {
const key = String(_o6.TURNSTILE_SITEKEY || '').trim();
if (!key) return '';
const _o1b = await P.loadTurnstile();
if (!_o1b) throw new P.ProvisionError('CAPTCHA', 'Không tải được ô kiểm tra chống máy (Cloudflare Turnstile) – kiểm tra mạng rồi thử lại.');
if (!_o1c || !_o1c.isConnected) { _o1c = h('div', { class: 'wiz-turnstile', 'data-testid': 'diachi-turnstile' }); _oy.appendChild(_o1c); tsId = null; }
return new Promise((resolve, reject) => {
const _or = { sitekey: key, language: 'vi', callback: (t) => resolve(t), 'error-callback': () => reject(new P.ProvisionError('CAPTCHA', P.ERROR_TEXT.CAPTCHA)) };
if (tsId === null) tsId = _o1b.render(_o1c, _or); else { _o1b.reset(tsId); _o1b.remove(tsId); tsId = _o1b.render(_o1c, _or); }
});
}
async function start({ slug, domain = '', mode = 'tu-do', cf = null }) {
if (_o2) return;
slug = P.normalizeSlug(slug);
const _ou = P.slugProblem(slug);
if (!_ou.ok) { ui.toast(_ou.msg, 'warn'); return; }
_o2 = true;
ui.mountTo(_on, h('p', { 'data-testid': 'diachi-progress' }, ui.spinner(), ' Đang xác minh tài khoản Google và xin vé tạo app…'));
let _o18;
try { _o18 = await ctl.provisionTicket(slug); } catch (e) { _o2 = false; cf = null; return _oh(e.message || P.ERROR_TEXT.BAD_TICKET, () => start({ slug, domain, mode })); }
let _ov;
try {
const turnstile = await _o4();
_ov = await _o8.create({ slug, edition: company ? 'cong-ty' : 'ca-nhan', ticket: _o18.ticket, ...(turnstile ? { turnstile } : {}), domain: domain || undefined, mode, ...(cf ? { cf } : {}) });
} catch (e) {
cf = null; _o2 = false;
if (e.code === 'HAS_APP' && e.data && e.data.slug) {
_o10({ slug: e.data.slug, sent: Date.now(), domain: '', mode: 'tu-do' });
return _oj(e.data.slug, '', 'tu-do', 'Máy chủ này đã có app ở ' + (e.data.url || e.data.slug + '.' + base) + ' – chuyển sang đó.');
}
return _oh(e.message || P.ERROR_TEXT.INTERNAL, e.code === 'TAKEN' ? null : () => start({ slug, domain, mode }));
}
cf = null;
_o2 = false;
_o10({ slug, domain, mode, sent: Date.now(), ...(_ov && _ov.req ? { req: _ov.req } : {}) });
return _oj(slug, domain, mode, _ov && _ov.reused ? 'Đã có yêu cầu tạo app này – đang theo dõi.' : '');
}
async function _oj(slug, domain, mode, note = '') {
if (_o8.remember) _o8.remember(slug, data().req);
const _o14 = Number(data().sent) || Date.now();
const alive = () => { if (!_oy.isConnected) throw new P.ProvisionError('DETACHED', ''); };
const _o12 = (st, el) => ui.mountTo(_on, h('div', { class: 'wiz-diachi-wait', 'data-testid': 'diachi-progress', dataset: { status: st } },
note ? h('p', { class: 'muted small' }, note) : null, ui.spinner(), ' ', P.progressText(st, Date.now() - _o14), el || null));
_o12('cho');
let _ox;
try {
_ox = await P.waitReady(_o8, slug, { intervalMs: ctl.pollMs || Number(_o6.PROVISION_POLL_MS) || 5000, timeoutMs: 8 * 60000, until: domain ? ['ok', 'cho_dns'] : ['ok'],
onTick: (x) => { alive(); _o12(x.status); } });
if (_ox.cname_target && _ox.cname_target !== data().cname_target) _o10({ cname_target: _ox.cname_target });
if (_ox.status === 'cho_dns') {
const _o16 = _ox.url || P.freeUrl(slug, _o6);
const _o1g = () => h('div', null, _o9(domain, slug, _ox.cname_target || ''),
h('div', { class: 'btn-row' }, button('Dùng tạm ' + _o16.replace(/^https:\/\//, '') + ' (chuyển ngay)', () => _og({ url: _o16, domain: '' }), { kind: 'secondary', small: true, testid: 'diachi-use-temp' })));
_o12('cho_dns', _o1g());
_ox = await P.waitReady(_o8, slug, { intervalMs: ctl.pollMsDns || Number(_o6.PROVISION_POLL_MS) || 15000, timeoutMs: 24 * 3600000, until: ['ok'], onTick: (x) => { alive(); _o12(x.status, _o1g()); } });
}
} catch (e) {
if (e.code === 'DETACHED') return null;
return _oh(e.message || P.ERROR_TEXT.INTERNAL, () => { _o10({ sent: 0 }); _os(); }, 'Chọn lại');
}
return _og({ url: _ox.url || (domain ? 'https://' + domain : P.freeUrl(slug, _o6)), domain: domain && _ox.status === 'ok' ? domain : '' });
}
function _og({ url, domain }) {
if (!_oy.isConnected) return;
const _oi = !ctl._diachiDone;
ctl._diachiDone = true;
ctl.set(M.record(ctl.state, STEP, { ok: true, msg: url.replace(/^https:\/\//, '') }));
_o10({ url, status: 'ok' });
let n = ctl.redirectDelay != null ? ctl.redirectDelay : _o6.PROVISION_REDIRECT_S != null ? Number(_o6.PROVISION_REDIRECT_S) : 5;
const left = h('span', { 'data-testid': 'diachi-countdown' }, String(n));
let _o19 = 0;
const go = () => { clearInterval(_o19); ctl.finishPortal({ url, domain }).catch((e) => ui.toast(e.message || String(e), 'warn', 6000)); };
ui.mountTo(_on, h('div', { class: 'wiz-result is-ok', 'data-testid': 'diachi-done' },
h('p', { class: 'wiz-res-main' }, '✅ App riêng của anh/chị đã sẵn sàng: ', h('a', { href: url, rel: 'noopener', 'data-testid': 'diachi-url' }, url.replace(/^https:\/\//, ''))),
h('p', null, 'Tự chuyển sang app sau ', left, ' giây. Trang cài đặt tự xoá dữ liệu tạm trước khi chuyển; ở app mới anh/chị đăng nhập bằng tên + mật khẩu vừa tạo.'),
h('div', { class: 'btn-row' }, button('Mở app ngay', go, { kind: 'primary', testid: 'diachi-open' }))));
if (!_oi) { left.parentElement.textContent = 'Bấm "Mở app ngay" để chuyển sang app.'; return; }
_o19 = setInterval(() => { n--; left.textContent = String(Math.max(0, n)); if (n <= 0) go(); }, 1000);
if (n <= 0) go();
}
function _oh(msg, retry, retryLabel = 'Thử lại') {
ui.mountTo(_on, h('div', { class: 'wiz-result is-bad', 'data-testid': 'diachi-error' }, h('p', { class: 'wiz-res-main' }, '❌ ', msg),
h('div', { class: 'btn-row' }, retry ? button(retryLabel, retry, { kind: 'secondary', small: true, testid: 'diachi-retry' }) : null)));
if (typeof rerender === 'function' && !_oy.isConnected) rerender();
}
}
export function wishBox(ctl, ui, { company = false, showDefer = true } = {}) {
const { h, button } = ui;
const _o6 = ctl.config || {};
const base = P.baseDomain(_o6);
const _oo = supportEmail(_o6);
const _ob = () => ((ctl.state && ctl.state.data) || {}).wish || {};
const status = h('p', { class: 'small muted', 'data-testid': 'wish-status', 'aria-live': 'polite', dataset: { state: 'idle' } });
const _o15 = (msg, st) => { status.textContent = msg; status.dataset.state = st; status.className = 'small ' + (st === 'ok' || st === 'sent' ? 'wiz-ok' : st === 'bad' ? 'form-err' : 'muted'); };
const _o1f = _ob();
const input = h('input', { id: 'wish-name', type: 'text', inputmode: 'url', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false',
maxlength: company ? '253' : String(P.SLUG_MAX + 5), placeholder: company ? 'app.tencongty.vn' : 'ten-cua-ban', value: _o1f.name || '', 'aria-describedby': 'wish-rules', 'data-testid': 'wish-name' });
const full = (n) => (company ? n : n + '.' + base);
const _oq = () => {
const v = String(input.value || '').trim();
if (!v) return { ok: false, code: 'EMPTY', msg: '' };
if (company) { const _ou = P.domainProblem(v, { base }); return _ou.ok ? { ok: true, name: _ou.host } : _ou; }
const _oz = P.normalizeSlug(v).replace(/-+$/, ''); const _ou = P.slugProblem(_oz); return _ou.ok ? { ok: true, name: _oz } : _ou;
};
const _o11 = button('Gửi tên cho bên bán', async () => {
const _ow = _oq(); if (!_ow.ok) { _o7(); return; }
_o15('… Đang kiểm tên và gửi cho bên bán…', 'checking');
try {
if (typeof ctl.sendWish !== 'function') throw new P.ProvisionError('NO_SERVICE', 'Chưa gửi tự động được.');
const _ov = await ctl.sendWish(company ? { domain: _ow.name } : { slug: _ow.name });
ctl.set(M.setData(ctl.state, { wish: { name: _ow.name, full: (_ov && _ov.wish) || full(_ow.name), sent: (_ov && _ov.at) || Date.now() } }));
_o15('✅ Đã gửi cho bên bán: ' + full(_ow.name) + '. Bên bán tạo và gửi email trong vòng 24 giờ – bấm "Làm sau" để dùng app ngay.', 'sent');
} catch (e) { _o15('❌ ' + (e.message || 'Chưa gửi được.') + ' Hoặc gửi email cho bên bán: ' + _oo + ' (kèm tên ' + full(_ow.name) + ').', 'bad'); }
}, { kind: 'primary', small: true, icon: 'mail', testid: 'wish-send', disabled: true });
function _o7() {
const _ov = _oq();
_o11.disabled = !_ov.ok;
if (_ov.code === 'EMPTY') return _o15('', 'idle');
if (!_ov.ok) return _o15('❌ ' + _ov.msg, 'bad');
const _o1e = _ob();
if (_o1e.sent && _o1e.name === _ov.name) return _o15('✅ Đã gửi cho bên bán: ' + (_o1e.full || full(_ov.name)) + ' – chờ email trong vòng 24 giờ.', 'sent');
return _o15('✅ Tên đúng quy tắc: ' + full(_ov.name) + ' – bấm "Gửi tên cho bên bán" để giữ tên.', 'ok');
}
input.addEventListener('input', () => {
if (!company) { const _o3 = input.selectionStart; const n = P.normalizeSlug(input.value); if (n !== input.value) { input.value = n; try { input.setSelectionRange(_o3, _o3); } catch { } } }
_o7();
});
if (input.value) setTimeout(_o7, 0);
return h('div', { class: 'wiz-wish', 'data-testid': 'wish' },
showDefer ? h('p', { class: 'wiz-note', 'data-testid': 'wish-defer' }, '⏳ ' + P.deferText(_o6, { company })) : null,
h('label', { for: 'wish-name', class: 'field-label' }, company ? 'Tên miền công ty muốn dùng cho app:' : 'Tên anh/chị muốn dùng (gửi trước để giữ tên):'),
company ? input : h('div', { class: 'wiz-slug-row' }, h('span', { class: 'wiz-slug-pre' }, 'https://'), input, h('span', { class: 'wiz-slug-suf' }, '.' + base)),
status,
h('p', { class: 'muted small', id: 'wish-rules' }, company ? 'Vd app.tencongty.vn. Bên bán gửi lại cách trỏ tên miền qua email.'
: 'Chữ thường không dấu (a-z), số (0-9) và dấu "-"; ' + P.SLUG_MIN + '–' + P.SLUG_MAX + ' ký tự; không bắt đầu/kết thúc bằng "-".'),
h('div', { class: 'btn-row' }, _o11),
h('p', { class: 'muted small' }, 'Cần gấp: email ', h('a', { href: 'mailto:' + _oo + '?subject=' + encodeURIComponent('Địa chỉ app BDS Studio'), 'data-testid': 'wish-mail' }, _oo), '.'));
}
export const DISCLOSURE_TEXT = P.DISCLOSURE + ' – bên bán có thể nhận hoa hồng nếu anh/chị mua qua link này; giá anh/chị trả không đổi. Mua ở đâu cũng được.';
export const NO_AFFILIATE_TEXT = 'Link tới trang Cloudflare Registrar: Cloudflare không có chương trình giới thiệu cho tên miền – bên bán không nhận hoa hồng, anh/chị trả đúng giá gốc.';
export default { diachiWidget, wishBox, DISCLOSURE_TEXT, NO_AFFILIATE_TEXT };

import * as G from './gcai.js';
import { DRIVE_ABOUT, accountId, captchaToken, slotsLabel, slotsLeftText, slotStateOf, gcaiPlan } from './gcai_slots.js';
import { setSetupToken, setupToken } from '../setup_gate.d66104e8e0.js';
import { privacyUrl } from '../instance.1eceeeedc8.js';
const STEPS = [
{ n: 1, title: 'Đăng nhập Google', sub: 'Chọn tài khoản → Cho phép. Trang tự tạo Sheet + máy chủ trong Drive của anh/chị.' },
{ n: 2, title: 'Bật Apps Script API', sub: 'Chỉ khi Google hỏi: gạt 1 nút sang Bật rồi quay lại.' },
{ n: 3, title: 'Cho phép máy chủ chạy', sub: 'Mở máy chủ 1 lần → Cho phép. Xong là sang bước tạo tài khoản.' }
];
const _o0 = 15000, API_RETRY_MAX = 40;
const _o1 = 4000, AUTH_POLL_MAX = 225;
export function gcaiWidget(ctl, opts = {}) {
const S = ctl.__gcai || (ctl.__gcai = _ox(ctl, opts));
return S.mount(opts);
}
function _ox(ctl, { ui, deps = {} } = {}) {
const { h, button } = ui;
let onDone = null, onSwitch = null, onFull = null, switchLabel = 'Cài trên máy tính (cách cũ)';
const cfg = ctl.config || {};
const slots = deps.slots || ctl.gcaiSvc || null;
const _ob = G.clientIdOf(cfg);
const fetchFn = deps.fetchFn || ((u, o) => fetch(u, o));
let _ov = null, inner = null, tsHost = null;
let prog = G.loadProgress();
let _oe = null, busy = false, stepText = '', broker = null, gisErr = null;
let _o4 = null, apiTries = 0, authTimer = null, authTries = 0, finished = false;
const client = G.googleClient({ fetchFn, getToken: () => (broker ? broker.token() : '') });
const _oh = (deps.loadGis || G.loadGis)().then((oauth2) => { broker = G.tokenBroker(oauth2, _ob); return broker; }).catch((e) => { gisErr = e; return null; });
const stage = () => G.stageOf(prog, _oe);
const _o11 = () => { if (_o4) clearTimeout(_o4); if (authTimer) clearTimeout(authTimer); _o4 = authTimer = null; };
const alive = () => !!(_ov && _ov.isConnected);
function _ok(prompt) {
if (busy) return;
_oe = null;
const _oi = (b) => b.requestToken(prompt ? { prompt } : {}).then(() => _oj(), (e) => { _oe = e instanceof G.GError ? e : new G.GError('POPUP', { detail: String(e && e.message || e) }); _oo(); });
if (broker) { _oi(broker); return; }
busy = true; stepText = 'Đang mở trang đăng nhập Google…'; _oo();
_oh.then((b) => { busy = false; if (b) _oi(b); else { _oe = gisErr instanceof G.GError ? gisErr : new G.GError('NETWORK', { detail: 'GIS' }); _oo(); } });
}
async function _oj() {
if (busy) return;
busy = true; _oe = null; stepText = 'Đang lấy tệp máy chủ đã kiểm chữ ký…'; _oo();
try {
if (slots && slots.configured && !prog.claimed) await _oa();
let files = null;
if (!prog.contentDone) {
const _os = await ctl.installer.load();
if (!_os || !_os.ok) throw new G.GError('FILES', { detail: (_os && (_os.code + ': ' + _os.message)) || 'không tải được', stage: 'files' });
const t = (p) => (_os.files[p] && _os.files[p].text) || '';
files = { tatca: t(G.RELEASE_FILES.tatca), caidat: t(G.RELEASE_FILES.caidat), manifest: t(G.RELEASE_FILES.manifest) };
}
const _ot = await G.runInstall({ client, files, ticket: prog.contentDone ? '' : G.newTicket(), progress: prog,
save: (p) => { prog = G.saveProgress(p); }, onStep: (s) => { stepText = s; _oo(); }, sleep: deps.sleep });
prog = G.saveProgress(_ot.progress);
setSetupToken(_ot.ticket);
busy = false; _oe = null;
if (await G.execAuthorized(prog.execUrl, { fetchFn })) { prog = G.saveProgress({ ...prog, authorized: true }); return _og(); }
_oo();
} catch (e) {
busy = false;
if (e && e.full) {
_o11();
if (broker) broker.revoke(fetchFn);
ctl.gslots = { st: 'het', con: 0, tong: Number(e.tong) || (ctl.gslots && ctl.gslots.tong) || gcaiPlan(cfg).slots };
if (onFull) { onFull(); return; }
}
_oe = e instanceof G.GError ? e : new G.GError('OTHER', { detail: String(e && e.message || e) });
if (e && e.progress) prog = G.saveProgress(e.progress);
if (_oe.code === 'API_OFF') _ow();
_oo();
}
}
async function _oa() {
stepText = 'Đang giữ chỗ ưu tiên cho tài khoản Google này…'; _oo();
const _ol = await client.json('GET', DRIVE_ABOUT, undefined, { stage: 'slot' });
let id;
try { id = await accountId(_ol && _ol.user && _ol.user.permissionId); } catch { throw new G.GError('OTHER', { stage: 'slot', detail: 'Drive about: không có permissionId' }); }
let turnstile = '';
try {
if (String(cfg.TURNSTILE_SITEKEY || '').trim()) { stepText = 'Đang giữ chỗ ưu tiên – nếu trang hỏi, đánh dấu ô kiểm tra bên dưới…'; _oo(); }
turnstile = await captchaToken(tsHost, cfg, { action: 'giu-cho' });
} catch { throw new G.GError('SLOT_CAPTCHA', { stage: 'slot' }); }
let _os;
try { _os = await slots.claim({ id, turnstile }); } catch (e) {
if (e && e.code === 'HET_CHO') throw Object.assign(new G.GError('NO_SLOT', { stage: 'slot', status: e.status || 409 }), { full: true, tong: e.data && e.data.tong });
if (e && e.code === 'CAPTCHA') throw new G.GError('SLOT_CAPTCHA', { stage: 'slot', status: e.status || 403 });
throw new G.GError('SLOT_NET', { stage: 'slot', status: (e && e.status) || 0, detail: (e && e.code) || '' });
}
ctl.gslots = slotStateOf(_os);
prog = G.saveProgress({ ...prog, claimed: true });
}
function _ow() {
if (_o4 || apiTries >= API_RETRY_MAX) return;
_o4 = setTimeout(() => {
_o4 = null;
if (!alive() || finished) return;
apiTries++;
if (!broker || !broker.token()) { _oe = new G.GError('AUTH', { stage: 'project' }); _oo(); return; }
if (typeof document !== 'undefined' && document.hidden) { _ow(); return; }
_oj();
}, (deps.apiRetryMs || _o0));
}
function _oq(now) {
if (authTimer || finished) return;
const _o12 = async () => {
authTimer = null;
if (!alive() || finished) return;
if (await G.execAuthorized(prog.execUrl, { fetchFn })) { prog = G.saveProgress({ ...prog, authorized: true }); _og(); return; }
authTries++;
_op();
if (authTries < AUTH_POLL_MAX) authTimer = setTimeout(_o12, deps.authPollMs || _o1);
};
authTimer = setTimeout(_o12, now ? 0 : (deps.authPollMs || _o1));
}
async function _og() {
if (finished) return;
if (!setupToken()) {
if (!broker || !broker.token()) { _oe = new G.GError('AUTH', { stage: 'ticket' }); _oo(); return; }
try { const _os = await G.runInstall({ client, files: null, ticket: '', progress: prog, save: (p) => { prog = G.saveProgress(p); } }); setSetupToken(_os.ticket); } catch (e) {
_oe = e instanceof G.GError ? e : new G.GError('NO_TICKET'); _oo(); return;
}
}
finished = true; _o11();
if (broker) broker.revoke(fetchFn);
_oo();
if (onDone) onDone({ url: prog.execUrl });
}
function retry() {
_oe = null;
if (prog.execUrl && setupToken()) { _oo(); _oq(true); return; }
if (broker && broker.token()) _oj(); else _ok('');
}
function _ou() {
_o11();
const _on = prog.fileId;
const _o13 = broker && broker.token();
if (_on && _o13) client.json('PATCH', G.DRIVE_FILES + '/' + encodeURIComponent(_on) + '?fields=id', { appProperties: { [G.APP_PROP]: 'bo' } }).catch(() => null);
prog = G.saveProgress({}); _oe = null; setSetupToken('');
if (_o13) _oj(); else _oo();
}
function _or(lead, testid, hash = '') {
const href = privacyUrl(cfg);
if (!href) return null;
return h('span', { class: 'muted small', 'data-testid': testid }, lead,
h('a', { href: href + hash, target: '_blank', rel: 'noopener' }, 'Chính sách quyền riêng tư'), '.');
}
function _o10() {
const _oc = stage();
return h('ol', { class: 'gcai-steps', 'aria-label': 'Tiến độ cài bằng Google', 'data-testid': 'gcai-steps' }, STEPS.map((s) => {
const state = _oc > s.n || (s.n === 2 && _oc > 2 && prog.apiOk) ? 'done' : _oc === s.n ? 'now' : 'todo';
return h('li', { class: 'gcai-st is-' + state, dataset: { step: String(s.n), state }, 'aria-current': state === 'now' ? 'step' : null },
h('span', { class: 'gcai-n', 'aria-hidden': 'true' }, state === 'done' ? '✓' : String(s.n)),
h('span', { class: 'gcai-st-t' }, h('strong', null, s.title), h('span', { class: 'muted small' }, s.n === 2 && _oc > 2 && prog.apiOk && !_oe ? 'Apps Script API đã bật ✓' : s.sub)));
}));
}
const _o8 = (href, label, icon, testid, onClick) => {
const _o2 = h('a', { class: 'btn btn-primary btn-block gcai-big', href, target: '_blank', rel: 'noopener noreferrer', 'data-testid': testid }, ui.icon(icon, 22), h('span', null, label));
if (onClick) _o2.addEventListener('click', onClick);
return _o2;
};
const _o7 = (label, fn, icon, testid, kind = 'primary') => button(label, fn, { kind, block: true, icon, testid, cls: 'gcai-big' });
function _of() {
if (!_oe || _oe.code === 'API_OFF') return null;
const again = _oe.retry === 'login' ? _o7(_oe.code === 'AUTH' ? 'Đăng nhập Google lại' : 'Cài bằng tài khoản Google', () => _ok(_oe.code === 'PARTIAL' ? 'consent' : ''), 'key', 'gcai-relogin')
: _oe.retry === 'restart' ? _o7('Tạo máy chủ mới', () => _ou(), 'refresh', 'gcai-restart')
: _oe.retry === 'auto' ? null
: _o7('Thử lại', () => retry(), 'refresh', 'gcai-retry');
return h('div', { class: 'wiz-result is-bad gcai-err', role: 'alert', 'data-testid': 'gcai-err', dataset: { code: _oe.code } },
h('p', { class: 'wiz-res-main' }, '❌ ', _oe.cause_ || _oe.message),
h('p', { class: 'wiz-fix' }, h('strong', null, 'Cách sửa: '), _oe.fix),
again,
h('details', { class: 'wiz-tech' }, h('summary', { class: 'small' }, 'Chi tiết kỹ thuật'),
h('p', { class: 'small mono', 'data-testid': 'gcai-tech' }, ['Mã: ' + _oe.code, _oe.stage && 'Bước: ' + _oe.stage, _oe.status && 'HTTP ' + _oe.status, _oe.detail && 'Google: ' + _oe.detail].filter(Boolean).join(' · '))));
}
function _o9() {
const _oc = stage();
if (finished || _oc === 4) return h('div', { class: 'wiz-result is-ok', 'data-testid': 'gcai-done' }, h('p', { class: 'wiz-res-main' }, '✅ Máy chủ đã tạo xong trong Google của anh/chị – đang kiểm tra và sang bước tạo tài khoản…'));
if (busy) return h('div', { class: 'gcai-busy', 'aria-live': 'polite', 'data-testid': 'gcai-busy' }, ui.spinner(), ' ', stepText || 'Đang làm…', h('p', { class: 'muted small' }, 'Khoảng 10–30 giây. Đừng đóng trang.'));
if (_oc === 2) {
return h('div', { class: 'gcai-act', 'data-testid': 'gcai-api' },
h('p', null, 'Google cần anh/chị tự bật ', h('strong', null, 'Google Apps Script API'), ' một lần (Google không cho trang nào bật thay):'),
_o8(G.USERSETTINGS_URL, 'Mở trang bật Apps Script API', 'external', 'gcai-api-open', () => { apiTries = 0; _ow(); }),
_o3(),
h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'gcai-api-wait' }, '⏳ Bật xong quay lại đây – trang tự thử lại mỗi 15 giây (Google cần 1–5 phút để áp dụng).'),
_o7('Tôi đã bật – thử lại ngay', () => { if (_o4) clearTimeout(_o4); _o4 = null; (broker && broker.token()) ? _oj() : _ok(''); }, 'refresh', 'gcai-api-retry', 'secondary'));
}
if (_oc === 3) {
return h('div', { class: 'gcai-act', 'data-testid': 'gcai-auth' },
h('p', null, 'Máy chủ đã tạo xong. Bước cuối: mở máy chủ ', h('strong', null, '1 lần'), ' bằng chính tài khoản Google này và bấm ', h('strong', null, 'Cho phép'), ' – để máy chủ được ghi vào Sheet, gửi thư mã xác nhận.'),
_o8(prog.execUrl, 'Cho phép máy chủ chạy', 'shield', 'gcai-auth-open', () => { authTries = 0; _oq(false); }),
_o5(),
h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'gcai-auth-wait' }, _o6()),
_o7('Tôi đã bấm Cho phép – kiểm tra', () => { if (authTimer) clearTimeout(authTimer); authTimer = null; _oq(true); }, 'pulse', 'gcai-auth-check', 'secondary'));
}
return h('div', { class: 'gcai-act', 'data-testid': 'gcai-start' },
_o7(prog.fileId ? 'Tiếp tục cài bằng Google' : 'Cài bằng tài khoản Google', () => _ok(''), 'key', 'gcai-login'),
h('p', { class: 'muted small' }, prog.fileId ? 'Lần trước đang làm dở – trang làm tiếp đúng chỗ, không tạo máy chủ thứ hai.' : 'Dùng tài khoản Google sẽ giữ dữ liệu khách (Gmail của anh/chị, hoặc Google CÔNG TY).'),
_or('Bấm nút là anh/chị đã đọc ', 'gcai-privacy-link'));
}
const _o6 = () => (authTries ? '⏳ Đang chờ Google xác nhận… (đã kiểm ' + authTries + ' lần). Cho phép xong, trang Google hiện một dòng chữ kỹ thuật {"ok":true…} – vậy là xong, quay lại thẻ này.'
: 'Cho phép xong, trang Google hiện một dòng chữ kỹ thuật {"ok":true…} – vậy là xong, quay lại thẻ này. Trang tự nhận ra.');
function _op() { const _od = _ov && _ov.querySelector('[data-testid="gcai-auth-wait"]'); if (_od) _od.textContent = _o6(); }
const _om = (n, lines, testid) => h('div', { class: 'gcai-mock', 'aria-hidden': 'true', 'data-testid': testid },
h('span', { class: 'gcai-mock-n' }, String(n)), ...lines.map(([k, t]) => h(k === 'h' ? 'b' : 'span', { class: 'gcai-mock-' + k }, t)));
function _o14() {
return h('div', { class: 'gcai-mocks' },
_om(1, [['h', 'Google chưa xác minh ứng dụng này'], ['p', 'Google hasn\'t verified this app'], ['b2', 'Quay lại nơi an toàn'], ['hl', 'Nâng cao (Advanced)']], 'gcai-mock-1'),
h('span', { class: 'gcai-arrow', 'aria-hidden': 'true' }, '→'),
_om(2, [['p', 'Chỉ tiếp tục nếu anh/chị tin nhà phát triển…'], ['hl', 'Đi tới BDS Studio (không an toàn)'], ['p', 'Go to BDS Studio (unsafe)']], 'gcai-mock-2'),
h('span', { class: 'gcai-arrow', 'aria-hidden': 'true' }, '→'),
_om(3, [['h', 'BDS Studio muốn truy cập…'], ['p', '☑ Drive · ☑ Apps Script'], ['hl', 'Tiếp tục / Cho phép (Allow)']], 'gcai-mock-3'));
}
function _o3() {
return h('div', { class: 'gcai-mocks' },
_om(1, [['h', 'Cài đặt (Settings)'], ['p', 'Google Apps Script API'], ['hl', 'Tắt → Bật (Off → On)']], 'gcai-mock-api'),
h('span', { class: 'gcai-arrow', 'aria-hidden': 'true' }, '→'),
_om(2, [['p', 'Quay lại thẻ BDS Studio'], ['hl', 'Trang tự thử lại']], 'gcai-mock-api2'));
}
function _o5() {
return h('div', { class: 'gcai-mocks' },
_om(1, [['h', 'Cần cấp quyền'], ['p', 'Authorization required'], ['hl', 'Xem lại quyền (Review permissions)']], 'gcai-mock-a1'),
h('span', { class: 'gcai-arrow', 'aria-hidden': 'true' }, '→'),
_om(2, [['p', 'Chọn đúng tài khoản → Nâng cao (Advanced)'], ['hl', 'Đi tới BDS Studio – Máy chủ (không an toàn)']], 'gcai-mock-a2'),
h('span', { class: 'gcai-arrow', 'aria-hidden': 'true' }, '→'),
_om(3, [['h', 'BDS Studio – Máy chủ muốn truy cập…'], ['hl', 'Cho phép (Allow)']], 'gcai-mock-a3'));
}
function _oo() {
if (typeof document === 'undefined' || !_ov || !inner) return;
const _oc = stage();
const _o15 = cfg.GOOGLE_OAUTH_VERIFIED === true;
const _oy = ctl.gslots || null;
ui.mountTo(inner,
h('div', { class: 'gcai-head' },
h('h3', { class: 'wiz-h3' }, '📱 Cài bằng tài khoản Google – 3 bước'),
slots && slots.configured ? h('p', { class: 'wiz-gcai-prio', 'data-testid': 'gcai-prio' }, '⭐ ' + slotsLabel((_oy && _oy.tong) || gcaiPlan(cfg).slots)
+ (prog.claimed ? ' · đã giữ chỗ cho anh/chị ✓' : _oy && _oy.st === 'con' ? ' · ' + slotsLeftText(_oy.con) : '')) : null,
h('p', { class: 'muted small' }, 'Không cần máy tính, không chép dán gì. Máy chủ (Sheet + Apps Script) nằm trong Google Drive của anh/chị – bên bán không xem được.')),
_o10(),
_of(),
_oe && _oe.retry !== 'auto' && _oc !== 2 ? null : _o9(),
_oc === 1 && !_o15 && !finished ? h('details', { class: 'gcai-warn', open: !prog.fileId, 'data-testid': 'gcai-unverified' },
h('summary', null, '⚠️ Google ghi "chưa xác minh ứng dụng này"? Bình thường – làm thế này'),
h('p', { class: 'small' }, 'Ứng dụng BDS Studio đang chờ Google duyệt. Trong lúc chờ, Google hiện màn cảnh báo: bấm ', h('strong', null, 'Nâng cao'), ' → ', h('strong', null, 'Đi tới BDS Studio (không an toàn)'), ' → tick đủ các ô → ', h('strong', null, 'Tiếp tục'), '.'),
_o14()) : null,
h('details', { class: 'gcai-privacy', 'data-testid': 'gcai-privacy' },
h('summary', { class: 'small' }, '🔒 Trang này được làm gì với tài khoản Google?'),
h('ul', { class: 'small' },
h('li', null, 'Chỉ 3 quyền: tạo tệp mới trong Drive (không đọc tệp khác của anh/chị), tạo dự án Apps Script và bản triển khai của nó.'),
h('li', null, 'Mã đăng nhập Google chỉ nằm trong thẻ trình duyệt này, chỉ gửi tới Google – không gửi về bên bán. Xong là tự thu hồi.'),
h('li', null, 'Gỡ quyền bất cứ lúc nào: myaccount.google.com › Bảo mật › Ứng dụng bên thứ ba.'),
h('li', null, _or('Chi tiết: ', 'gcai-privacy-more', '#google')))),
onSwitch ? h('div', { class: 'btn-row gcai-alt' }, button(switchLabel, () => { _o11(); onSwitch(); }, { kind: 'ghost', small: true, icon: 'monitor', testid: 'gcai-switch-old' })) : null);
}
let _oz = false;
function mount(o = {}) {
onDone = o.onDone || onDone; onSwitch = o.onSwitch || onSwitch; onFull = o.onFull || onFull; switchLabel = o.switchLabel || switchLabel;
inner = h('div', { class: 'gcai-in' });
tsHost = h('div', { class: 'wiz-turnstile', 'data-testid': 'gcai-turnstile' });
_ov = h('div', { class: 'wiz-box gcai', 'data-testid': 'gcai' }, inner, tsHost);
_oo();
if (!_oz) {
_oz = true;
if (prog.execUrl && !prog.authorized) _oq(true);
else if (prog.execUrl && prog.authorized) setTimeout(() => _og(), 0);
if (typeof document !== 'undefined') {
document.addEventListener('visibilitychange', () => { if (alive() && !document.hidden && prog.execUrl && !finished && !authTimer) _oq(true); });
}
} else if (prog.execUrl && !finished && !authTimer && !busy) _oq(true);
else if (_oe && _oe.code === 'API_OFF' && !_o4 && !busy) _ow();
return _ov;
}
return { mount };
}
export default { gcaiWidget };

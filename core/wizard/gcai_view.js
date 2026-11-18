import * as G from './gcai.js';
import { setSetupToken, setupToken } from '../setup_gate.d66104e8e0.js';
const STEPS = [
{ n: 1, title: 'Đăng nhập Google', sub: 'Chọn tài khoản → Cho phép. Trang tự tạo Sheet + máy chủ trong Drive của anh/chị.' },
{ n: 2, title: 'Bật Apps Script API', sub: 'Chỉ khi Google hỏi: gạt 1 nút sang Bật rồi quay lại.' },
{ n: 3, title: 'Cho phép máy chủ chạy', sub: 'Mở máy chủ 1 lần → Cho phép. Xong là sang bước tạo tài khoản.' }
];
const _o0 = 15000, API_RETRY_MAX = 40;
const _o1 = 4000, AUTH_POLL_MAX = 225;
export function gcaiWidget(ctl, opts = {}) {
const S = ctl.__gcai || (ctl.__gcai = _ov(ctl, opts));
return S.mount(opts);
}
function _ov(ctl, { ui, deps = {} } = {}) {
const { h, button } = ui;
let onDone = null, onSwitch = null;
const _oa = ctl.config || {};
const _ob = G.clientIdOf(_oa);
const fetchFn = deps.fetchFn || ((u, o) => fetch(u, o));
let _ot = null;
let prog = G.loadProgress();
let _oe = null, busy = false, stepText = '', broker = null, gisErr = null;
let _o4 = null, apiTries = 0, authTimer = null, authTries = 0, finished = false;
const client = G.googleClient({ fetchFn, getToken: () => (broker ? broker.token() : '') });
const _oh = (deps.loadGis || G.loadGis)().then((oauth2) => { broker = G.tokenBroker(oauth2, _ob); return broker; }).catch((e) => { gisErr = e; return null; });
const stage = () => G.stageOf(prog, _oe);
const _oy = () => { if (_o4) clearTimeout(_o4); if (authTimer) clearTimeout(authTimer); _o4 = authTimer = null; };
const alive = () => !!(_ot && _ot.isConnected);
function _ok(prompt) {
if (busy) return;
_oe = null;
const _oi = (b) => b.requestToken(prompt ? { prompt } : {}).then(() => _oj(), (e) => { _oe = e instanceof G.GError ? e : new G.GError('POPUP', { detail: String(e && e.message || e) }); _on(); });
if (broker) { _oi(broker); return; }
busy = true; stepText = 'Đang mở trang đăng nhập Google…'; _on();
_oh.then((b) => { busy = false; if (b) _oi(b); else { _oe = gisErr instanceof G.GError ? gisErr : new G.GError('NETWORK', { detail: 'GIS' }); _on(); } });
}
async function _oj() {
if (busy) return;
busy = true; _oe = null; stepText = 'Đang lấy tệp máy chủ đã kiểm chữ ký…'; _on();
try {
let files = null;
if (!prog.contentDone) {
const _oq = await ctl.installer.load();
if (!_oq || !_oq.ok) throw new G.GError('FILES', { detail: (_oq && (_oq.code + ': ' + _oq.message)) || 'không tải được', stage: 'files' });
const t = (p) => (_oq.files[p] && _oq.files[p].text) || '';
files = { tatca: t(G.RELEASE_FILES.tatca), caidat: t(G.RELEASE_FILES.caidat), manifest: t(G.RELEASE_FILES.manifest) };
}
const _or = await G.runInstall({ client, files, ticket: prog.contentDone ? '' : G.newTicket(), progress: prog,
save: (p) => { prog = G.saveProgress(p); }, onStep: (s) => { stepText = s; _on(); }, sleep: deps.sleep });
prog = G.saveProgress(_or.progress);
setSetupToken(_or.ticket);
busy = false; _oe = null;
if (await G.execAuthorized(prog.execUrl, { fetchFn })) { prog = G.saveProgress({ ...prog, authorized: true }); return _og(); }
_on();
} catch (e) {
busy = false;
_oe = e instanceof G.GError ? e : new G.GError('OTHER', { detail: String(e && e.message || e) });
if (e && e.progress) prog = G.saveProgress(e.progress);
if (_oe.code === 'API_OFF') _ou();
_on();
}
}
function _ou() {
if (_o4 || apiTries >= API_RETRY_MAX) return;
_o4 = setTimeout(() => {
_o4 = null;
if (!alive() || finished) return;
apiTries++;
if (!broker || !broker.token()) { _oe = new G.GError('AUTH', { stage: 'project' }); _on(); return; }
if (typeof document !== 'undefined' && document.hidden) { _ou(); return; }
_oj();
}, (deps.apiRetryMs || _o0));
}
function _op(now) {
if (authTimer || finished) return;
const _oz = async () => {
authTimer = null;
if (!alive() || finished) return;
if (await G.execAuthorized(prog.execUrl, { fetchFn })) { prog = G.saveProgress({ ...prog, authorized: true }); _og(); return; }
authTries++;
_oo();
if (authTries < AUTH_POLL_MAX) authTimer = setTimeout(_oz, deps.authPollMs || _o1);
};
authTimer = setTimeout(_oz, now ? 0 : (deps.authPollMs || _o1));
}
async function _og() {
if (finished) return;
if (!setupToken()) {
if (!broker || !broker.token()) { _oe = new G.GError('AUTH', { stage: 'ticket' }); _on(); return; }
try { const _oq = await G.runInstall({ client, files: null, ticket: '', progress: prog, save: (p) => { prog = G.saveProgress(p); } }); setSetupToken(_oq.ticket); } catch (e) {
_oe = e instanceof G.GError ? e : new G.GError('NO_TICKET'); _on(); return;
}
}
finished = true; _oy();
if (broker) broker.revoke(fetchFn);
_on();
if (onDone) onDone({ url: prog.execUrl });
}
function retry() {
_oe = null;
if (prog.execUrl && setupToken()) { _on(); _op(true); return; }
if (broker && broker.token()) _oj(); else _ok('');
}
function _os() {
_oy();
const _om = prog.fileId;
const _o10 = broker && broker.token();
if (_om && _o10) client.json('PATCH', G.DRIVE_FILES + '/' + encodeURIComponent(_om) + '?fields=id', { appProperties: { [G.APP_PROP]: 'bo' } }).catch(() => null);
prog = G.saveProgress({}); _oe = null; setSetupToken('');
if (_o10) _oj(); else _on();
}
function _ox() {
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
: _oe.retry === 'restart' ? _o7('Tạo máy chủ mới', () => _os(), 'refresh', 'gcai-restart')
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
_o8(G.USERSETTINGS_URL, 'Mở trang bật Apps Script API', 'external', 'gcai-api-open', () => { apiTries = 0; _ou(); }),
_o3(),
h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'gcai-api-wait' }, '⏳ Bật xong quay lại đây – trang tự thử lại mỗi 15 giây (Google cần 1–5 phút để áp dụng).'),
_o7('Tôi đã bật – thử lại ngay', () => { if (_o4) clearTimeout(_o4); _o4 = null; (broker && broker.token()) ? _oj() : _ok(''); }, 'refresh', 'gcai-api-retry', 'secondary'));
}
if (_oc === 3) {
return h('div', { class: 'gcai-act', 'data-testid': 'gcai-auth' },
h('p', null, 'Máy chủ đã tạo xong. Bước cuối: mở máy chủ ', h('strong', null, '1 lần'), ' bằng chính tài khoản Google này và bấm ', h('strong', null, 'Cho phép'), ' – để máy chủ được ghi vào Sheet, gửi thư mã xác nhận.'),
_o8(prog.execUrl, 'Cho phép máy chủ chạy', 'shield', 'gcai-auth-open', () => { authTries = 0; _op(false); }),
_o5(),
h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'gcai-auth-wait' }, _o6()),
_o7('Tôi đã bấm Cho phép – kiểm tra', () => { if (authTimer) clearTimeout(authTimer); authTimer = null; _op(true); }, 'pulse', 'gcai-auth-check', 'secondary'));
}
return h('div', { class: 'gcai-act', 'data-testid': 'gcai-start' },
_o7(prog.fileId ? 'Tiếp tục cài bằng Google' : 'Cài bằng tài khoản Google', () => _ok(''), 'key', 'gcai-login'),
h('p', { class: 'muted small' }, prog.fileId ? 'Lần trước đang làm dở – trang làm tiếp đúng chỗ, không tạo máy chủ thứ hai.' : 'Dùng tài khoản Google sẽ giữ dữ liệu khách (Gmail của anh/chị, hoặc Google CÔNG TY).'));
}
const _o6 = () => (authTries ? '⏳ Đang chờ Google xác nhận… (đã kiểm ' + authTries + ' lần). Cho phép xong, trang Google hiện một dòng chữ kỹ thuật {"ok":true…} – vậy là xong, quay lại thẻ này.'
: 'Cho phép xong, trang Google hiện một dòng chữ kỹ thuật {"ok":true…} – vậy là xong, quay lại thẻ này. Trang tự nhận ra.');
function _oo() { const _od = _ot && _ot.querySelector('[data-testid="gcai-auth-wait"]'); if (_od) _od.textContent = _o6(); }
const _ol = (n, lines, testid) => h('div', { class: 'gcai-mock', 'aria-hidden': 'true', 'data-testid': testid },
h('span', { class: 'gcai-mock-n' }, String(n)), ...lines.map(([k, t]) => h(k === 'h' ? 'b' : 'span', { class: 'gcai-mock-' + k }, t)));
function _o11() {
return h('div', { class: 'gcai-mocks' },
_ol(1, [['h', 'Google chưa xác minh ứng dụng này'], ['p', 'Google hasn\'t verified this app'], ['b2', 'Quay lại nơi an toàn'], ['hl', 'Nâng cao (Advanced)']], 'gcai-mock-1'),
h('span', { class: 'gcai-arrow', 'aria-hidden': 'true' }, '→'),
_ol(2, [['p', 'Chỉ tiếp tục nếu anh/chị tin nhà phát triển…'], ['hl', 'Đi tới BDS Studio (không an toàn)'], ['p', 'Go to BDS Studio (unsafe)']], 'gcai-mock-2'),
h('span', { class: 'gcai-arrow', 'aria-hidden': 'true' }, '→'),
_ol(3, [['h', 'BDS Studio muốn truy cập…'], ['p', '☑ Drive · ☑ Apps Script'], ['hl', 'Tiếp tục / Cho phép (Allow)']], 'gcai-mock-3'));
}
function _o3() {
return h('div', { class: 'gcai-mocks' },
_ol(1, [['h', 'Cài đặt (Settings)'], ['p', 'Google Apps Script API'], ['hl', 'Tắt → Bật (Off → On)']], 'gcai-mock-api'),
h('span', { class: 'gcai-arrow', 'aria-hidden': 'true' }, '→'),
_ol(2, [['p', 'Quay lại thẻ BDS Studio'], ['hl', 'Trang tự thử lại']], 'gcai-mock-api2'));
}
function _o5() {
return h('div', { class: 'gcai-mocks' },
_ol(1, [['h', 'Cần cấp quyền'], ['p', 'Authorization required'], ['hl', 'Xem lại quyền (Review permissions)']], 'gcai-mock-a1'),
h('span', { class: 'gcai-arrow', 'aria-hidden': 'true' }, '→'),
_ol(2, [['p', 'Chọn đúng tài khoản → Nâng cao (Advanced)'], ['hl', 'Đi tới BDS Studio – Máy chủ (không an toàn)']], 'gcai-mock-a2'),
h('span', { class: 'gcai-arrow', 'aria-hidden': 'true' }, '→'),
_ol(3, [['h', 'BDS Studio – Máy chủ muốn truy cập…'], ['hl', 'Cho phép (Allow)']], 'gcai-mock-a3'));
}
function _on() {
if (typeof document === 'undefined' || !_ot) return;
const _oc = stage();
const _o12 = _oa.GOOGLE_OAUTH_VERIFIED === true;
ui.mountTo(_ot,
h('div', { class: 'gcai-head' },
h('h3', { class: 'wiz-h3' }, '📱 Cài bằng tài khoản Google – 3 bước'),
h('p', { class: 'muted small' }, 'Không cần máy tính, không chép dán gì. Máy chủ (Sheet + Apps Script) nằm trong Google Drive của anh/chị – bên bán không xem được.')),
_ox(),
_of(),
_oe && _oe.retry !== 'auto' && _oc !== 2 ? null : _o9(),
_oc === 1 && !_o12 && !finished ? h('details', { class: 'gcai-warn', open: !prog.fileId, 'data-testid': 'gcai-unverified' },
h('summary', null, '⚠️ Google ghi "chưa xác minh ứng dụng này"? Bình thường – làm thế này'),
h('p', { class: 'small' }, 'Ứng dụng BDS Studio đang chờ Google duyệt. Trong lúc chờ, Google hiện màn cảnh báo: bấm ', h('strong', null, 'Nâng cao'), ' → ', h('strong', null, 'Đi tới BDS Studio (không an toàn)'), ' → tick đủ các ô → ', h('strong', null, 'Tiếp tục'), '.'),
_o11()) : null,
h('details', { class: 'gcai-privacy', 'data-testid': 'gcai-privacy' },
h('summary', { class: 'small' }, '🔒 Trang này được làm gì với tài khoản Google?'),
h('ul', { class: 'small' },
h('li', null, 'Chỉ 3 quyền: tạo tệp mới trong Drive (không đọc tệp khác của anh/chị), tạo dự án Apps Script và bản triển khai của nó.'),
h('li', null, 'Mã đăng nhập Google chỉ nằm trong thẻ trình duyệt này, chỉ gửi tới Google – không gửi về bên bán. Xong là tự thu hồi.'),
h('li', null, 'Gỡ quyền bất cứ lúc nào: myaccount.google.com › Bảo mật › Ứng dụng bên thứ ba.'))),
onSwitch ? h('div', { class: 'btn-row gcai-alt' }, button('Cài trên máy tính (cách cũ)', () => { _oy(); onSwitch(); }, { kind: 'ghost', small: true, icon: 'monitor', testid: 'gcai-switch-old' })) : null);
}
let _ow = false;
function mount(o = {}) {
onDone = o.onDone || onDone; onSwitch = o.onSwitch || onSwitch;
_ot = h('div', { class: 'wiz-box gcai', 'data-testid': 'gcai' });
_on();
if (!_ow) {
_ow = true;
if (prog.execUrl && !prog.authorized) _op(true);
else if (prog.execUrl && prog.authorized) setTimeout(() => _og(), 0);
if (typeof document !== 'undefined') {
document.addEventListener('visibilitychange', () => { if (alive() && !document.hidden && prog.execUrl && !finished && !authTimer) _op(true); });
}
} else if (prog.execUrl && !finished && !authTimer && !busy) _op(true);
else if (_oe && _oe.code === 'API_OFF' && !_o4 && !busy) _ou();
return _ot;
}
return { mount };
}
export default { gcaiWidget };

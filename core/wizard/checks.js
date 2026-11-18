import { CHECKLIST, NOT_PUBLIC_TEXT, NOT_PUBLIC_FIX, URL_FIELD_LABEL, isSaleEdition, supportEmail, stepsFor } from './steps.js';
import { companyDomainProblem, appHostOf } from '../../shared/site_logic.js';
export const SCRIPT_URL_RE = /^https:\/\/script\.google(usercontent)?\.com\/(?:macros|a\/macros\/[A-Za-z0-9.-]{2,253}|a\/[A-Za-z0-9.-]{2,253}\/macros)\/s\/[A-Za-z0-9_-]{20,}\/exec(\?.*)?$/;
export const MIN_DISK_GB = 5;
export function urlProblem(raw) {
const _o1h = String(raw || '').trim();
if (!_o1h) return { cause: 'Chưa dán địa chỉ máy chủ vào ô "' + URL_FIELD_LABEL + '".', fix: 'Trong Sheet máy chủ: menu BDS Studio › Lấy URL máy chủ → bấm Chép URL, rồi dán vào ô (Ctrl+V).' };
if (/^https:\/\/docs\.google\.com\/spreadsheets\//.test(_o1h)) return { cause: 'Đây là địa chỉ của Sheet, không phải địa chỉ máy chủ.', fix: 'Trong Sheet bấm menu BDS Studio › Lấy URL máy chủ: chép địa chỉ bắt đầu bằng https://script.google.com/macros/s/… kết thúc bằng /exec.' };
if (/^https:\/\/script\.google\.com\/(home|d\/)/.test(_o1h)) return { cause: 'Đây là trang soạn mã Apps Script, không phải địa chỉ máy chủ.', fix: 'Lấy địa chỉ trong Sheet: menu BDS Studio › Lấy URL máy chủ → Chép URL (kết thúc bằng /exec).' };
if (/\/dev(\?.*)?$/.test(_o1h)) return { cause: 'Đây là địa chỉ chạy thử (/dev) – chỉ người soạn mã mở được.', fix: 'Dùng địa chỉ kết thúc bằng /exec (menu BDS Studio › Lấy URL máy chủ → Chép URL).' };
if (!/^https:\/\//.test(_o1h)) return { cause: 'Địa chỉ phải bắt đầu bằng https://', fix: 'Chép lại nguyên địa chỉ, đừng gõ tay.' };
if (!SCRIPT_URL_RE.test(_o1h)) return { cause: 'Địa chỉ chưa đúng dạng máy chủ BDS Studio (thiếu một đoạn hoặc thừa ký tự).', fix: 'Chép lại nguyên địa chỉ từ menu BDS Studio › Lấy URL máy chủ; địa chỉ đúng kết thúc bằng /exec.' };
return null;
}
export function validTaxId(s) { return /^\d{10}(-\d{3})?$/.test(String(s || '').replace(/\s+/g, '')); }
export function normHost(s) {
let _o1h = String(s || '').trim().toLowerCase();
_o1h = _o1h.replace(/^[a-z]+:\/\//, '').split(/[/?#]/)[0].replace(/:\d+$/, '').replace(/\.$/, '');
if (_o1h.length > 253 || !/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(_o1h)) return '';
return _o1h;
}
const SETUP_FIX = 'Mở Sheet máy chủ → menu BDS Studio › Cài đặt → Cho phép (hoặc Apps Script → chọn hàm bdsCaiDat → Chạy), đợi khoảng 30 giây rồi kiểm lại.';
export function explain(e, { flow = '', config = null } = {}) {
const code = (e && e.code) || '';
const who = flow === 'personal' ? 'bên bán (' + supportEmail(config || {}) + ')' : 'bên cài đặt';
const _ou = String((e && (e.userMessage || e.message)) || '');
if (code === 'SETUP_REQUIRED') return { cause: 'Máy chủ chưa cài xong trong Sheet' + (e && e.installing ? ' (đang tự cài lần đầu)' : '') + '.', fix: SETUP_FIX, img: 'sheet-menu' };
if (code === 'NOT_PUBLIC') return { cause: NOT_PUBLIC_TEXT + '.', fix: NOT_PUBLIC_FIX, img: 'deploy-config' };
if (code === 'UNKNOWN_ACTION' || code === 'NOT_FOUND') return { cause: 'Máy chủ đang chạy bản cũ, chưa có chức năng kiểm này.', fix: 'Vào Cài đặt › Phiên bản → bấm "Cập nhật máy chủ", rồi kiểm lại.' };
if (code === 'FORBIDDEN') { const own = flow === 'company' ? 'Quản trị (Admin)' : 'Chủ'; return { cause: 'Chỉ tài khoản ' + own + ' làm được bước này.', fix: 'Đăng nhập bằng tài khoản ' + own + ' rồi mở lại Trợ lý cài đặt.' }; }
if (code === 'AUTH_REQUIRED' || code === 'AUTH_INVALID') return { cause: 'Phiên đăng nhập đã hết.', fix: 'Đăng nhập lại rồi bấm kiểm lại.' };
const _ok = e && /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(String(e.account_email || '')) ? String(e.account_email) : '';
const link = (_o1g, label) => (typeof _o1g === 'string' && /^https:\/\//.test(_o1g) ? { url: _o1g, label } : {});
if (/^API_/.test(code)) return { cause: 'Máy chủ bản cũ chưa tự cập nhật được.', fix: 'Không cần làm gì trên trang Google. App vẫn dùng bình thường; cập nhật máy chủ một lần ở Cài đặt › Phiên bản – các bản sau máy chủ tự cập nhật (bản có chữ ký số). Cần gấp thì bấm "Cần giúp?".' };
if (code === 'NOT_OWNER') return { cause: 'Tài khoản chạy máy chủ' + (_ok ? ' (' + _ok + ')' : '') + ' không phải chủ sở hữu/người chỉnh sửa dự án Apps Script.', fix: 'Mở Apps Script bằng tài khoản chủ sở hữu → Chia sẻ quyền Chỉnh sửa cho tài khoản chạy máy chủ, hoặc triển khai lại Web app bằng chính tài khoản chủ sở hữu, rồi kiểm lại.', ...link(e && e.url, 'Mở Apps Script') };
if (code === 'SCOPE_MISSING') return { cause: 'Máy chủ thiếu quyền Google.', fix: 'Mở Sheet → menu BDS Studio → Cài đặt → Cho phép lại, rồi kiểm lại.' };
if (code === 'DNS') return { cause: 'Không mở được tên miền – bản ghi CNAME (dòng trỏ tên miền sang app) chưa có hoặc chưa cập nhật xong.', fix: 'Kiểm bản ghi CNAME ở trang quản lý tên miền. Vừa thêm thì đợi 5 phút đến 24 giờ rồi kiểm lại (bấm Làm sau để đi tiếp).' };
if (code === 'NOT_APP') return { cause: 'Tên miền đang mở một trang khác, không phải BDS Studio.', fix: 'Bản ghi CNAME đang trỏ sai chỗ, hoặc ' + (flow === 'personal' ? 'bên bán' : 'bên bán/bên cài đặt') + ' chưa gắn tên miền vào app – liên hệ ' + (flow === 'personal' ? who : 'bên bán (email ở khung tên miền)') + '.' };
if (code === 'HTTP') return { cause: 'Tên miền trả lỗi: ' + _ou, fix: 'Đợi vài phút rồi kiểm lại; vẫn lỗi thì báo ' + who + ' (bấm "Cần giúp?").' };
if (code === 'BAD_INPUT') return { cause: _ou || 'Thông tin nhập chưa đúng.', fix: 'Sửa lại ô nhập theo gợi ý rồi kiểm lại.' };
if (code === 'TIMEOUT' || /timeout|hết giờ|quá lâu/i.test(_ou)) return { cause: 'Máy chủ trả lời quá lâu.', fix: 'Kiểm tra mạng rồi bấm kiểm lại. Google đôi lúc chậm vài giây ở lần gọi đầu.' };
if (code === 'NETWORK' || /network|failed to fetch|mạng|kết nối/i.test(_ou)) return { cause: 'Không kết nối được tới máy chủ.', fix: 'Kiểm tra mạng (Wi-Fi/4G). Nếu mạng công ty chặn Google Apps Script, thử bằng 4G.' };
const tech = e && (e.ref || e.reason) ? { ref: String(e.ref || ''), reason: String(e.reason || '') } : undefined;
return { cause: (_ou || 'Có lỗi chưa rõ nguyên nhân.') + (tech && tech.ref ? ' (mã lỗi ' + tech.ref + ')' : ''), fix: 'Thử lại sau ít phút. Vẫn lỗi: bấm "Cần giúp?" để gửi báo cáo (kèm mã lỗi) cho bên hỗ trợ.', ...(tech ? { tech } : {}) };
}
const bad = (cause, fix, extra = {}) => ({ ok: false, msg: cause, cause, fix, ...extra });
const _on = (x) => ({ ...(x && x.img ? { img: x.img } : {}), ...(x && x.tech ? { tech: x.tech } : {}) });
const _oq = (msg, extra = {}) => ({ ok: true, msg, ...extra });
export const LOCAL_HOST_RE = /^(127\.\d{1,3}\.\d{1,3}\.\d{1,3}|localhost|\[?::1\]?)$/i;
export function parseUa(ua = '') {
const s = String(ua);
const ios = /iPhone|iPad|iPod/.test(s) ? Number((/OS (\d+)_/.exec(s) || [])[1]) || 0 : 0;
let _ou;
if ((_ou = /Edg\/(\d+)/.exec(s))) return { name: 'Edge', major: +_ou[1], ios };
if ((_ou = /(?:Chrome|CriOS)\/(\d+)/.exec(s))) return { name: 'Chrome', major: +_ou[1], ios };
if ((_ou = /(?:Firefox|FxiOS)\/(\d+)/.exec(s))) return { name: 'Firefox', major: +_ou[1], ios };
if ((_ou = /Version\/(\d+)[\d.]* .*Safari/.exec(s))) return { name: 'Safari', major: +_ou[1], ios };
return { name: '', major: 0, ios };
}
const _o1 = { Chrome: 100, Edge: 100, Firefox: 100, Safari: 15 };
export function browserProblems(env = {}) {
const _o11 = [];
const _o5 = parseUa(env.ua);
const _oz = (_o5.name && _o1[_o5.name] && _o5.major && _o5.major < _o1[_o5.name]) || (_o5.ios && _o5.ios < 15);
if (_oz) _o11.push({ id: 'browser_old', cause: 'Trình duyệt quá cũ (' + (_o5.ios ? 'iOS ' + _o5.ios : _o5.name + ' ' + _o5.major) + ').', fix: _o5.ios ? 'Cập nhật iPhone/iPad lên iOS 15 trở lên (Cài đặt → Cài đặt chung → Cập nhật phần mềm).' : 'Cập nhật ' + _o5.name + ' lên bản mới nhất, hoặc dùng Chrome mới.' });
if (env.fetch === false || env.crypto === false) _o11.push({ id: 'browser_features', cause: 'Trình duyệt thiếu chức năng bảo mật app cần.', fix: 'Dùng Chrome, Edge hoặc Safari bản mới.' });
if (env.indexedDB === false || env.storage === false) _o11.push({ id: 'storage_blocked', cause: 'Trình duyệt đang chặn lưu dữ liệu (chế độ ẩn danh hoặc đã tắt lưu trữ trang web).', fix: 'Mở app trong cửa sổ thường (không ẩn danh) và cho phép trang lưu dữ liệu.' });
if (env.online === false) _o11.push({ id: 'offline', cause: 'Máy đang không có mạng.', fix: 'Bật Wi-Fi hoặc 4G rồi tải lại trang.' });
return _o11;
}
export function browserEnv(g = globalThis) {
let storage = true;
try { g.localStorage.setItem('bds:probe', '1'); g.localStorage.removeItem('bds:probe'); } catch { storage = false; }
return {
ua: (g.navigator && g.navigator.userAgent) || '', fetch: typeof g.fetch === 'function', indexedDB: typeof g.indexedDB !== 'undefined',
crypto: !!(g.crypto && g.crypto.subtle), storage, online: !(g.navigator && g.navigator.onLine === false)
};
}
export function engineVerdict(_or, { minDisk = MIN_DISK_GB } = {}) {
if (!_or) return bad('Máy dựng chưa chạy, hoặc Chrome đang chặn "Truy cập mạng cục bộ".', 'Đã cài: bấm biểu tượng "BDS Studio" (hình ngôi nhà vàng) trên màn hình nền – Mac cũng có trong Launchpad, Windows có trong Start Menu. Chưa cài: làm theo thẻ Mac/Windows ở trên (Mac chạy bộ cài bằng Terminal, Windows bỏ chặn tệp zip trước). Chrome hỏi "Truy cập mạng cục bộ" thì bấm Cho phép, rồi kiểm lại.');
if (_or.ffmpeg === null) return bad('Máy dựng chưa có Bộ công cụ dựng video (ffmpeg – công cụ ghép video). Bộ cài chỉ cài bộ công cụ này khi ở bước B8 chọn [4] Dựng video trên máy hoặc [2] Dựng + AI ngay trên máy ([1] Thôi – chỉ AI trên mạng thì không cài).', 'Cài gói khi cần: trong app mở Video › Bộ công cụ dựng video › Cài ngay, hoặc chạy lại bộ cài với --chon-video (Mac: Terminal gõ "bash " rồi kéo "Cai dat voi 1 click.command" vào; Windows: bấm đúp "Cai dat voi 1 click") và chọn [4] Dựng video trên máy. Máy yếu: video dựng trên máy sẽ chậm/giật – nên dùng AI trên mạng.');
const _op = Number(_or.free_disk_gb);
if (Number.isFinite(_op) && _op < minDisk) return bad('Ổ đĩa chỉ còn ' + _op + ' GB trống – cần ít nhất ' + minDisk + ' GB để dựng video.', 'Xoá bớt video cũ trong thư mục "BDS Studio/Video" hoặc dọn Thùng rác, rồi kiểm lại.');
const _o13 = ['Máy dựng v' + (_or.version || '?')];
if (Number.isFinite(_op)) _o13.push('ổ trống ' + _op + ' GB');
if (_or.ram_gb) _o13.push('RAM ' + _or.ram_gb + ' GB');
return _oq(_o13.join(' · '), _or.vbee_configured ? {} : { warn: 'Chưa có khoá Vbee (giọng đọc) – video vẫn dựng được, nhưng chưa có giọng Vbee.' });
}
export function makeChecks(deps = {}) {
const { api, apiFor, settings, auth, config = {}, fetchFn = (_o1g, o) => globalThis.fetch(_o1g, o), appHooks = {}, getState = () => ({ data: {} }), timeoutMs = 3000,
sleep = (ms) => new Promise((_o18) => setTimeout(_o18, ms)), installWaitMs = 120000, pollMs = 5000, now = () => Date.now() } = deps;
const _o19 = isSaleEdition(config);
const _om = (e) => explain(e, { flow: (getState() || {}).flow, config });
const _ox = () => typeof navigator !== 'undefined' && navigator.onLine === false;
const _o16 = async (url) => {
if (_ox()) return 'offline';
const opt = { method: 'GET', credentials: 'omit', cache: 'no-store' };
try {
const _o18 = await fetchFn(url, { ...opt, mode: 'cors', redirect: 'manual' });
if (_o18 && (_o18.type === 'opaqueredirect' || (_o18.status >= 300 && _o18.status < 400))) return 'login';
if (_o18 && _o18.status === 404) return 'wrong';
} catch { }
let _of = false;
const _oj = typeof document !== 'undefined' ? document : null;
const _o7 = String(url).split(/[?#]/)[0];
const _o10 = (ev) => { const _o5 = String((ev && ev.blockedURI) || ''); if (/^https:\/\/accounts\.google\.com\b/.test(_o5) || _o5.split(/[?#]/)[0] === _o7) _of = true; };
if (_oj) _oj.addEventListener('securitypolicyviolation', _o10);
try {
await fetchFn(url, { ...opt, mode: 'no-cors', redirect: 'follow' });
return 'wrong';
} catch {
await sleep(80);
return _of ? 'login' : _ox() ? 'offline' : 'network';
} finally { if (_oj) _oj.removeEventListener('securitypolicyviolation', _o10); }
};
const _ol = String(config.ENGINE_URL || 'http://127.0.0.1:8765').replace(/\/$/, '');
const _od = async (target, label) => {
try {
const _oh = await api.call('connections.test', { target });
return _oh && _oh.ok ? _oq(_oh.message || label + ' trả lời tốt') : bad((_oh && _oh.message) || label + ' chưa nối.', target === 'telegram'
? 'Mở Cài đặt › Kết nối › Telegram: dán mã bot, nhắn "chào" cho bot, bấm "Tự tìm chat id" (mã số cuộc trò chuyện với bot) → Lưu.'
: 'Mở Cài đặt › Kết nối › Gemini: dán khoá tạo ở aistudio.google.com ("Get API key" = Lấy khoá API) → Lưu.');
} catch (e) { return bad(_om(e).cause, _om(e).fix); }
};
const _o1l = async (payload) => {
try { return await api.call('setup.wizard_check', payload); } catch (e) { return { ok: false, code: e.code, message: e.userMessage || e.message, _err: e }; }
};
const _o0 = {
BAD_INPUT: 'Gõ tên miền gốc ở mục ①, vd tencongty.vn (không có app., không dấu cách).',
NXDOMAIN: 'Kiểm lại chính tả. Tên miền vừa mua có thể cần vài phút mới tra được.',
NS: 'Ở nơi mua tên miền, thay nameserver bằng đúng 2 tên Cloudflare đưa (dạng ana.ns.cloudflare.com). Chờ 5 phút–24 giờ rồi kiểm lại.',
NET: 'Thử lại sau ít phút.',
APP_DNS: 'Gắn app.<tên miền> vào app (mục ②, dòng 3): Workers & Pages › dự án app › Custom domains, hoặc bản ghi CNAME bên bán gửi.',
HTTPS: 'Chờ 5–30 phút cho Cloudflare cấp chứng chỉ https rồi kiểm lại.',
NOT_APP: 'app.<tên miền> đang trỏ chỗ khác: xoá bản ghi cũ của app rồi gắn lại vào dự án app.',
WILDCARD: 'Cloudflare › DNS › Add record: Type AAAA, Name *, IPv6 100::, Proxy bật (đám mây cam).',
NO_WORKER: 'Workers Routes › Add route: *.<tên miền>/* → Worker bds-trang.',
WORKER_CONFIG: 'Bấm "Chép mã Worker" (đã điền sẵn) và dán lại vào Worker bds-trang → Deploy.',
WORKER_DOMAIN: 'Bấm "Chép mã Worker" (đã điền sẵn đúng tên miền) và dán lại → Deploy.'
};
const _o3 = ' Chờ lâu? Bấm "Làm tiếp sau" – làm các bước còn lại trước, bước này vẫn ghi "chưa xong".';
async function _oc() {
const _o9 = (getState().data || {}).coDomain || {};
const _o15 = companyDomainProblem(_o9.domain || '');
if (!_o9.has) return bad('Chưa trả lời "Công ty đã có tên miền chưa?".', 'Chọn Có / Chưa có ở đầu bước, gõ tên miền dùng cho app. Bản Công ty bắt buộc tên miền riêng.');
if (!_o15.ok) return bad(_o15.msg, _o0.BAD_INPUT);
const _oo = (_o18) => String(_o0[_o18 && _o18.code] || 'Thử lại; vẫn lỗi thì bấm "Cần giúp?".').replace(/<tên miền>/g, _o15.domain);
const _o1m = await _o1l({ kind: 'zone', domain: _o15.domain });
if (_o1m && _o1m._err) { const x = _om(_o1m._err); return bad(x.cause, x.fix, _on(x)); }
if (!_o1m || !_o1m.ok) return bad((_o1m && _o1m.message) || 'Chưa kiểm được tên miền.', _oo(_o1m) + _o3);
const _o1j = await _o1l({ kind: 'site', domain: _o15.domain });
if (_o1j && _o1j._err) { const x = _om(_o1j._err); return bad(x.cause, x.fix, _on(x)); }
if (!_o1j || !_o1j.ok) return bad('Tên miền ' + _o15.domain + ' và app đã chạy; ' + ((_o1j && _o1j.message) || 'trang nhân viên chưa chạy.'), _oo(_o1j) + _o3);
return _oq(_o15.domain + ' chạy trên Cloudflare · ' + appHostOf(_o15.domain) + ' mở đúng app' + (_o1m.version ? ' (v' + _o1m.version + ')' : '') + ' · trang nhân viên chạy ở <tên>.' + _o15.domain);
}
return {
async prepare() {
const _ov = (getState().data || {}).checklist || {};
const _ow = CHECKLIST.filter((_o8) => _o8.required && !_ov[_o8.id]);
if (_ow.length) return bad('Còn thiếu: ' + _ow.map((_o8) => _o8.label.split(' (')[0].split(',')[0]).join('; ') + '.', 'Chuẩn bị đủ các mục bắt buộc (có dấu *) rồi đánh dấu. Chưa có thì hẹn lại buổi cài.');
const opt = CHECKLIST.filter((_o8) => !_o8.required && !_ov[_o8.id]).length;
return _oq('Đã đủ mục bắt buộc' + (opt ? ' · ' + opt + ' mục tuỳ chọn chưa có (làm sau được)' : ''));
},
async company() {
const _o8 = (getState().data || {}).company || {};
if (!String(_o8.name || '').trim()) return bad('Chưa nhập tên công ty.', 'Gõ tên công ty đúng như trên giấy phép kinh doanh.');
if (!validTaxId(_o8.tax)) return bad('Mã số thuế chưa đúng: cần 10 số (chi nhánh: 10 số + "-" + 3 số).', 'Xem mã số thuế trên giấy phép kinh doanh hoặc hoá đơn, gõ lại không có dấu cách.');
return _oq(_o8.name + ' · MST ' + _o8.tax + (_o8.logo ? ' · có logo' : ' · chưa có logo (thêm sau được)'));
},
async copy() {
const _o1b = getState(); const _oh = _o1b.data || {};
if (!_oh.copied) return bad('Chưa xác nhận đã tạo máy chủ.', 'Làm theo các bước ở trên (Tạo bản sao, hoặc dán tay 3 tệp) tới khi Sheet máy chủ có menu "BDS Studio", rồi đánh dấu ô xác nhận.');
if (_o1b.flow === 'company' && !_oh.companyAccount) return bad('Chưa xác nhận đang dùng tài khoản Google CÔNG TY.', 'Đăng xuất Gmail cá nhân, đăng nhập tài khoản Workspace công ty rồi làm lại bước tạo máy chủ. Xong thì đánh dấu ô xác nhận.');
return _oq('Đã tạo máy chủ');
},
async allow({ url, onProgress } = {}) {
const _o1h = String(url || '').trim();
const _o1c = getState() || {};
if (_o1c.flow === 'company' && !((_o1c.data || {}).companyAccount)) return bad('Chưa xác nhận đang dùng tài khoản Google CÔNG TY.', 'Đăng nhập tài khoản Workspace công ty (không dùng Gmail cá nhân của nhân viên), tạo máy chủ bằng tài khoản đó, rồi đánh dấu ô xác nhận và kiểm lại.');
let _oa = api;
if (_o1h || !api || api.mode !== 'demo' || _o19) {
if (!_o1h && _o19 && api && api.mode === 'demo') return bad('Chưa dán địa chỉ máy chủ thật vào ô "' + URL_FIELD_LABEL + '".', 'Làm bước "Tạo máy chủ" + các mục ở trên để có địa chỉ …/exec rồi dán vào ô. Chỉ muốn xem app trước: bấm "Xem thử trước (chưa cài thật)" – bước này sẽ ghi "bỏ qua", dữ liệu nhập khi xem thử chỉ nằm trong trình duyệt này.');
const _o12 = urlProblem(_o1h);
if (_o12) return bad(_o12.cause, _o12.fix);
_oa = apiFor ? apiFor(_o1h) : api;
}
try {
const _o4 = async () => {
try { return await _oa.call('status'); } catch (e) {
if (e && e.code === 'SETUP_REQUIRED' && e.installing) return { installed: false, install_error: { installing: true, message: e.userMessage || e.message || '' } };
throw e;
}
};
let s = await _o4();
const _o1d = now();
while (s && s.installed === false && s.install_error && s.install_error.installing && now() - _o1d < installWaitMs) {
if (typeof onProgress === 'function') onProgress('Máy chủ đang tự cài lần đầu (khoảng 30 giây) – đang chờ, đừng đóng trang…');
await sleep(pollMs);
s = await _o4();
}
if (s && s.installed === false && s.install_error && s.install_error.installing) return bad('Máy chủ vẫn đang tự cài lần đầu (quá 2 phút).', 'Đợi thêm 1–2 phút rồi bấm kiểm lại. Lâu quá: mở Sheet máy chủ → menu BDS Studio › Cài đặt.', { img: 'sheet-menu' });
if (!s || !s.version) return bad('Địa chỉ trả lời nhưng không phải máy chủ BDS Studio.', 'Kiểm lại địa chỉ: chép từ menu BDS Studio › Lấy URL máy chủ trong Sheet.');
if (s.installed === false) {
const _ot = s.install_error || {};
if (_ot.installing) return bad('Máy chủ vẫn đang tự cài lần đầu (quá 2 phút).', 'Đợi thêm 1–2 phút rồi bấm kiểm lại. Lâu quá: mở Sheet máy chủ → menu BDS Studio › Cài đặt.', { img: 'sheet-menu' });
return bad('Máy chủ chưa cài xong trong Sheet' + (_ot.message ? ' (' + String(_ot.message).slice(0, 160) + ')' : '') + '.', SETUP_FIX, { img: 'sheet-menu' });
}
const demo = _oa.mode === 'demo';
const msg = (demo ? 'Máy chủ xem thử (trong trình duyệt)' : 'Máy chủ') + ' trả lời · v' + s.version + (s.setup ? ' · đã có tài khoản – đăng nhập để tiếp tục' : '');
const _oz = config.APP_VERSION && _ob(s.version, config.APP_VERSION) < 0;
return _oq(msg, { version: s.version, setup: !!s.setup, demo, warn: _oz ? 'Máy chủ bản ' + s.version + ' cũ hơn app – sau khi tạo tài khoản, máy chủ tự cập nhật lên bản mới (bản có chữ ký số).' : '' });
} catch (e) {
const x = _om(e);
if (e && (e.code === 'NOT_PUBLIC' || e.code === 'SETUP_REQUIRED')) return bad(x.cause, x.fix, { img: x.img });
if (e && (e.code === 'NETWORK' || _ox())) {
const _o1k = _o1h ? await _o16(_o1h) : _ox() ? 'offline' : 'network';
if (_o1k === 'offline') return bad('Máy đang không có mạng.', 'Bật Wi-Fi hoặc 4G rồi bấm kiểm lại.', { net: 'offline' });
if (_o1k === 'login') return bad(NOT_PUBLIC_TEXT + '.', NOT_PUBLIC_FIX, { img: 'deploy-config', net: 'login' });
if (_o1k === 'wrong') return bad('Google trả lời nhưng địa chỉ này không phải máy chủ đang chạy – địa chỉ chép thiếu/sai, hoặc bản triển khai đã bị xoá.', 'Trong hộp của Sheet bấm "Chép URL" rồi dán lại (đừng gõ tay). Vẫn lỗi: Triển khai › Tuỳ chọn triển khai mới (nhớ chọn Truy cập: Bất kỳ ai), chép địa chỉ mới.', { net: 'wrong' });
return bad('Không tới được Google Apps Script – mạng đang chặn.', 'Kiểm tra mạng (Wi-Fi/4G; mạng công ty có thể chặn script.google.com – thử 4G), tắt VPN/tiện ích chặn quảng cáo cho trang này, rồi bấm kiểm lại.', { net: 'network' });
}
return bad(x.cause, x.fix, _on(x));
}
},
async account() {
const _o1g = auth && auth.user;
if (_o1g && _o1g.username) return _oq('Đã đăng nhập: @' + _o1g.username);
return bad('Chưa tạo tài khoản.', 'Bấm "Tạo tài khoản", đặt tên đăng nhập + mật khẩu.');
},
telegram: () => _od('telegram', 'Telegram'),
ai: () => _od('gemini', 'Gemini'),
async tfa() {
try {
const _o1b = auth && typeof auth.tfaStatus === 'function' ? await auth.tfaStatus() : await api.call('tfa.status');
if (!_o1b || !_o1b.enabled) return bad('Chưa bật xác thực 2 lớp.', 'Bấm "Bật xác thực 2 lớp" trong khung bên dưới (cần nối Telegram trước) hoặc "Cài ứng dụng xác thực".');
if (_o1b.setup_needed) return bad('2 lớp đã bắt buộc nhưng chưa có cách nhận mã.', 'Nối Telegram (bước trước) hoặc bấm "Cài ứng dụng xác thực" trong khung bên dưới, quét mã QR bằng Google Authenticator.');
const _o1i = (_o1b.methods || []).filter((_ou) => _ou !== 'backup').map((_ou) => (_ou === 'totp' ? 'ứng dụng xác thực' : 'Telegram')).join(' + ');
return _oq('Đang bật 2 lớp qua ' + _o1i, _o1b.backup_left ? {} : { warn: 'Chưa có mã dự phòng – nên bấm "Tạo mã dự phòng" và in ra cất kỹ.' });
} catch (e) { const x = _om(e); return bad(x.cause, x.fix, _on(x)); }
},
async backup() {
try {
const _o1b = auth && typeof auth.tfaStatus === 'function' ? await auth.tfaStatus() : await api.call('tfa.status');
const _o1i = ((_o1b && _o1b.methods) || []).filter((_ou) => _ou !== 'backup');
if (!_o1i.length) return _oq('Chưa nối Telegram/ứng dụng xác thực – app chưa hỏi mã 2 lớp, chưa cần mã dự phòng', { warn: 'Sau này nối Telegram thì vào Cài đặt › Bảo mật › "Tạo mã dự phòng" ngay (mất Telegram mà không có mã dự phòng là không đăng nhập được ở máy mới).' });
if (Number(_o1b.backup_left) > 0) return _oq('Đã có ' + _o1b.backup_left + ' mã dự phòng · 2 lớp qua ' + _o1i.map((_ou) => (_ou === 'totp' ? 'ứng dụng xác thực' : 'Telegram')).join(' + '));
return bad('Đã bật 2 lớp qua ' + _o1i.map((_ou) => (_ou === 'totp' ? 'ứng dụng xác thực' : 'Telegram')).join(' + ') + ' nhưng chưa có mã dự phòng – mất điện thoại/Telegram là không đăng nhập được ở máy mới.', 'Bấm "Tạo mã dự phòng" trong khung bên dưới, nhập mật khẩu + mã gửi qua Telegram, rồi In hoặc Tải tệp 10 mã, cất nơi an toàn.');
} catch (e) { const x = _om(e); return bad(x.cause, x.fix, _on(x)); }
},
async domain() {
if ((getState().flow) === 'company') return _oc();
const _oh = (getState().data || {}).domain || {};
if (_oh.mode === 'shared') {
const _oi = typeof deps.defaultAddress === 'function' ? deps.defaultAddress() : null;
if (_oi && !_oi.own && LOCAL_HOST_RE.test(String(_oi.host || ''))) {
return _oq('Đang mở thử trên máy này (' + _oi.host + ') – địa chỉ thật được kiểm khi mở app ở địa chỉ riêng (vd tenkhach.' + (config.APP_DOMAIN || 'bdsstudio.app') + ')', { local: true });
}
if (_oi && !_oi.own) {
const _o1j = (getState().data || {}).wish || {};
return bad(_o1j.sent ? 'Đã gửi tên ' + (_o1j.full || _o1j.name) + ' – chờ bên bán tạo địa chỉ riêng (trong vòng 24 giờ).' : 'Chưa có địa chỉ riêng – bên bán tạo giúp.',
(_o1j.sent ? '' : 'Gõ tên muốn dùng ở trên → bấm "Gửi tên cho bên bán". ') + 'Bấm "Làm sau" để dùng app ngay ở địa chỉ này; dữ liệu không mất khi chuyển.', { wait: true });
}
return _oq('Địa chỉ mặc định ' + ((_oi && _oi.host) || config.SHARED_HOST || 'bên bán đã gửi') + ' – bản app riêng, miễn phí, tự cập nhật');
}
const host = normHost(_oh.host);
if (!host) return bad('Chưa nhập tên miền, hoặc tên miền viết sai (vd app.congty.vn).', 'Gõ tên miền không có https://, không có dấu cách. Chưa có tên miền riêng thì chọn "Địa chỉ mặc định (miễn phí)".');
const _o18 = await _o1l({ kind: 'domain', domain: host });
if (_o18 && _o18.ok) return _oq(host + ' mở đúng app' + (_o18.version ? ' (v' + _o18.version + ')' : ''));
if (_o18 && _o18._err) { const x = _om(_o18._err); return bad(x.cause, x.fix, _on(x)); }
const x = _om({ code: _o18 && _o18.code, message: _o18 && _o18.message });
return bad(x.cause, x.fix, _on(x));
},
async engine() {
let _or = null;
const _og = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _o1f = _og ? setTimeout(() => _og.abort(), timeoutMs) : null;
try { const _o18 = await fetchFn(_ol + '/health', _og ? { signal: _og.signal } : {}); _or = _o18 && _o18.ok ? await _o18.json() : null; } catch { _or = null; } finally { if (_o1f) clearTimeout(_o1f); }
if (!_or) {
const _o17 = await import('../engine_pair.1fc01ffec5.js').then((_ou) => _ou.pairStatus(_ol, { fetchFn })).catch(() => null);
if (_o17 && _o17.running && !_o17.trusted) return bad('Máy dựng đang chạy nhưng CHƯA ghép nối với app này.', 'Mở Cài đặt › Máy của tôi › bấm "Ghép nối máy dựng" → bấm "Mở trang xác nhận của máy dựng" → kiểm đúng địa chỉ app + đúng mã 6 số → bấm "Cho phép". Xong quay lại bấm Kiểm tra.');
}
return engineVerdict(_or);
},
async finish() {
if (appHooks && typeof appHooks.runFullCheck === 'function') {
try {
const res = await appHooks.runFullCheck({ auto: false, probeLocal: true });
const _o1b = getState() || {}, res0 = _o1b.res || {};
const _o2 = { 'srv.telegram': 'telegram', 'srv.ai_gemini': 'ai', 'srv.gemini': 'ai', 'app.engine': 'engine', 'app.vbee': 'engine' };
const _o1a = (x) => { const id = _o2[x.id]; const _o18 = id && res0[id]; return !!(_o18 && (_o18.s === 'skip' || _o18.s === 'later') && !(_o1b.flow === 'company' && id === 'telegram')); };
const items = ((res && res.items) || []).map((x) => (x && (x.skipped || (x.ok === false && _o1a(x))) ? { ...x, ok: null, skipped: true, fix: '' } : x));
const _oe = new Set(items.map((x) => x && _o2[x.id]).filter(Boolean));
const owe = _o14(_o1b).filter((x) => !_oe.has(x.id));
items.unshift(...owe.map((x) => ({ id: 'wiz.' + x.id, label: x.title, ok: null, pending: true, step: x.id, detail: 'Bắt buộc – chưa xong (đã chọn "' + x.laterLabel + '"). Làm nốt khi sẵn sàng.' })));
const _oy = items.filter((x) => x.ok === true).length, skipN = items.filter((x) => x.skipped).length;
const _o6 = items.filter((x) => x.ok === false);
const _o1e = (_o6.length ? _o6.length + ' mục cần sửa · ' : owe.length ? '' : 'Mọi phần bắt buộc đều tốt · ') + (owe.length ? owe.length + ' bước bắt buộc chưa xong · ' : '') + _oy + ' đạt' + (skipN ? ' · ' + skipN + ' bỏ qua (không bắt buộc)' : '');
return _oq(_o1e, { items, bad: _o6.length, pending: owe.length,
warn: [_o6.length ? _o6.length + ' mục chưa đạt – đọc "Cách sửa" ở từng dòng ❌ bên dưới, sửa xong bấm kiểm lại.' : '',
owe.length ? 'Còn bước bắt buộc chưa xong: ' + owe.map((x) => x.title).join(', ') + ' – app vẫn dùng được, làm nốt khi sẵn sàng.' : ''].filter(Boolean).join(' ') });
} catch (e) { const x = _om(e); return bad(x.cause, x.fix, _on(x)); }
}
try { const s = await api.call('status'); const owe = _o14(getState() || {}); if (owe.length) return _oq('Máy chủ v' + ((s && s.version) || '?') + ' trả lời · ' + owe.length + ' bước bắt buộc chưa xong', { stub: true, pending: owe.length, items: owe.map((x) => ({ id: 'wiz.' + x.id, label: x.title, ok: null, pending: true, step: x.id, detail: 'Bắt buộc – chưa xong. Làm nốt khi sẵn sàng.' })) }); return _oq('Máy chủ v' + ((s && s.version) || '?') + ' trả lời · (bản này chưa có "Kiểm tra toàn bộ" – đã kiểm từng bước ở trên)', { stub: true, items: [] }); } catch (e) { const x = _om(e); return bad(x.cause, x.fix, _on(x)); }
},
async handover() {
const _oh = (getState().data || {});
if (!_oh.handoverSigned) return bad('Chưa xác nhận đã in và ký biên bản.', 'Bấm "In / Lưu PDF", hai bên ký, rồi đánh dấu "Đã in và hai bên đã ký".');
return _oq('Đã bàn giao' + (_oh.handoverAt ? ' ngày ' + new Date(_oh.handoverAt).toLocaleDateString('vi-VN') : ''));
}
};
}
function _o14(_o1b) {
if (!_o1b || !_o1b.flow) return [];
return stepsFor(_o1b.flow, { portal: !!_o1b.portal }).filter((s) => s.required && _o1b.res && _o1b.res[s.id] && _o1b.res[s.id].s === 'later' && s.id !== 'finish');
}
function _ob(a, _o5) {
const x = String(a || '').split('.'), y = String(_o5 || '').split('.');
for (let _os = 0; _os < Math.max(x.length, y.length); _os++) { const _oh = (Number(x[_os]) || 0) - (Number(y[_os]) || 0); if (_oh) return _oh > 0 ? 1 : -1; }
return 0;
}
export default { makeChecks, urlProblem, validTaxId, normHost, explain, browserProblems, browserEnv, parseUa, engineVerdict };

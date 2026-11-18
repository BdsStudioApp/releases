/**
 * BDS Studio – CaiDat.gs  ("Cài 1 chạm" – Sheet MẪU cho người mua Cá nhân)
 * Tệp này nằm CẠNH TatCa.gs trong Apps Script gắn với Sheet mẫu (Tiện ích mở rộng › Apps Script). Không sửa TatCa.gs.
 *
 * Khách bấm link "Tạo bản sao" → Google chép Sheet + toàn bộ script này vào Google của khách → khách mở Sheet:
 *   menu  BDS Studio › Cài đặt
 *     1) bản sao mới: xoá cấu hình còn sót của Sheet mẫu (nếu có), dùng CHÍNH Sheet này làm Sheet dữ liệu
 *     2) đặt phiên bản 'ca-nhan' + nguồn cập nhật = kho phát hành đã ký (chỉ khi chưa đặt)
 *     3) chạy setup() của TatCa.gs: tạo tab/cột, khoá bí mật, thư mục Drive, hẹn giờ
 *     4) tìm URL máy chủ (Web App). Chưa triển khai → hiện HƯỚNG DẪN TRIỂN KHAI 1 LẦN (làm tay, 6 bước). KHÔNG dùng Apps Script API:
 *        17/11 (thử thật): bản sao Sheet KHÔNG mang theo bản triển khai ("Quản lý triển khai" trống) nhưng CÓ mang Script Properties của Sheet mẫu
 *        → DEPLOYMENT_ID cũ của Sheet mẫu KHÔNG được tin (bdsKitPrepare_ xoá, bdsKitFindUrl_ chỉ tin khi props thuộc chính Sheet này).
 *        Nút "Mở BDS Studio và kết nối" CHỈ hiện khi có địa chỉ …/exec thật (getUrl() null / '' / …/dev = chưa triển khai → hướng dẫn).
 *        Nhận cả dạng Google Workspace: /a/macros/<tên miền>/s/<mã>/exec và /a/<tên miền>/macros/s/<mã>/exec (BDS_KIT_EXEC_RE = web/core/exec_url.js).
 *        dự án Google Cloud mặc định do Google giữ, khách không bật được API → bỏ nút "Tự triển khai" (17/11).
 *     5) đã triển khai → nút to "Mở BDS Studio và kết nối" (<địa chỉ app RIÊNG của khách>/#/ket-noi?may_chu=<…/exec>, Trợ lý tự điền + tự kiểm).
 *        17/11 app riêng từng khách: KHÔNG có địa chỉ app dùng chung. Địa chỉ app = prop app_url (Trợ lý ghi qua instance.set, hoặc khách
 *        gõ vào ô "Địa chỉ app riêng của anh/chị (vd tenkhach.bdsstudio.app)" ngay trong hộp thoại – lưu lại cho lần sau);
 *        chưa → 6 cú bấm Triển khai (có ảnh) + "Tôi đã triển khai xong" kiểm lại. Chép URL chỉ là lối dự phòng.
 *   menu  BDS Studio › Lấy URL máy chủ        (sau khi đã Triển khai bằng tay)
 *   menu  BDS Studio › Hướng dẫn triển khai Web App
 * Sau lần "Cập nhật máy chủ" đầu tiên trong app, tệp này được thay bằng TatCa.gs mới (menu biến mất) – bình thường, cài đặt đã xong.
 * Hàm gọi từ hộp thoại (google.script.run) KHÔNG được kết thúc bằng "_" (Apps Script coi là hàm riêng).
 */

var BDS_KIT_VERSION = '1';
var BDS_KIT_EDITION = 'ca-nhan';
// Kho phát hành CÔNG KHAI đã ký (sale_kit/sale.config.json › RELEASES_REPO, bỏ dấu / cuối) – tools/sale_build.mjs --kit điền,
// tools/sale_release_check.mjs kiểm khớp. DAN_… = chưa tạo tổ chức GitHub trung tính (docs/chu_cai_dat/00_DANH_SACH.md).
var BDS_KIT_RELEASE_ORIGIN = 'https://raw.githubusercontent.com/BdsStudioApp/releases/main';
// Địa chỉ app DÙNG CHUNG (tools/sale_build.mjs --kit điền từ sale.config.json › WEB_APP_URL). Bản thương mại để TRỐNG: mỗi khách 1 app riêng
// (https://<slug>.bdsstudio.app – tools/khach_app.mjs) → dùng prop app_url của chính máy chủ này (docs/APP_RIENG_TUNG_KHACH.md).
var BDS_KIT_APP_URL = '';
// Tên miền app riêng của người bán (sale.config.json › APP_DOMAIN): khách gõ "tenkhach" → https://tenkhach.<APP_DOMAIN>.
var BDS_KIT_APP_DOMAIN = 'bdsstudio.app';
// Địa chỉ máy chủ …/exec – CÙNG mẫu với web/core/exec_url.js › EXEC_URL_RE (tests/unit/exec_url.test.mjs đối chiếu). /dev KHÔNG nhận.
var BDS_KIT_EXEC_RE = /^https:\/\/script\.google\.com\/(?:macros|a\/macros\/[A-Za-z0-9.-]{2,253}|a\/[A-Za-z0-9.-]{2,253}\/macros)\/s\/[A-Za-z0-9_-]{20,}\/exec$/;

// Menu "BDS Studio" LUÔN có: TatCa.gs (phần khởi động gas/Boot.gs) dựng menu bằng BDS_menu_ – vẫn còn sau khi máy chủ tự cập nhật / khi tệp
// này bị bỏ. Hai tệp cùng có onOpen → tệp nào thắng cũng gọi BDS_menu_ (menu y hệt). TatCa.gs cũ (chưa có BDS_menu_) → menu riêng như trước.
function onOpen(e) {
  if (typeof BDS_menu_ === 'function') return BDS_menu_(e);
  SpreadsheetApp.getUi().createMenu('BDS Studio')
    .addItem('Cài đặt', 'bdsCaiDat')
    .addItem('Lấy URL máy chủ', 'bdsLayUrlMayChu')
    .addItem('Hướng dẫn triển khai Web App', 'bdsHuongDanTrienKhai')
    .addToUi();
}

/**
 * Hàm hộp thoại gọi qua google.script.run là hàm TOÀN CỤC → trang web công khai của máy chủ (web app "Thực thi: Tôi") cũng gọi được bằng
 * quyền chủ. Hàm GHI (địa chỉ app, URL máy chủ) chỉ chạy khi người gọi = chủ: cùng quy tắc ownerGuard_ / BDS_callerIsOwner_ (TatCa.gs).
 */
function bdsKitIsOwner_() {
  if (typeof BDS_callerIsOwner_ === 'function') return BDS_callerIsOwner_();
  var a = '', f = '';
  try { a = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase(); } catch (e) { a = ''; }
  try { f = String(Session.getEffectiveUser().getEmail() || '').trim().toLowerCase(); } catch (e) { f = ''; }
  return !!a && a === f;
}
var BDS_KIT_NOT_OWNER = 'Chỉ tài khoản Google đã cài máy chủ này (chủ Sheet) làm được việc này.';

/** Bản sao mới của Sheet mẫu mang theo Script Properties của Sheet gốc (nếu chủ lỡ chạy Cài đặt trên Sheet mẫu) → xoá để cài sạch. */
function bdsKitPrepare_(ss, props, ui) {
  var id = ss.getId(), bound = props.getProperty('bound_sheet_id'), data = props.getProperty('DATA_SHEET_ID');
  if (bound && bound !== id) {
    props.deleteAllProperties();                       // chắc chắn là bản sao của một máy chủ khác → cài mới hoàn toàn
  } else if (!bound && data && data !== id) {
    var a = ui.alert('BDS Studio', 'Script này đang trỏ tới một Sheet dữ liệu khác (có thể là cấu hình sót lại từ Sheet mẫu).\n\n'
      + 'Bấm "Có" để XOÁ cấu hình cũ và cài mới trên Sheet này (khuyên dùng với bản sao mới).\n'
      + 'Bấm "Không" để giữ nguyên Sheet dữ liệu cũ.', ui.ButtonSet.YES_NO_CANCEL);
    if (a === ui.Button.CANCEL || a === ui.Button.CLOSE) return false;
    if (a === ui.Button.YES) props.deleteAllProperties();
  }
  // bản sao Sheet KHÔNG mang theo bản triển khai → mã triển khai nhớ trong props chỉ đúng khi props là của CHÍNH Sheet này
  // (DATA_SHEET_ID = Sheet này: tự cài / dán tay rồi mới bấm Cài đặt). Còn lại (sót từ Sheet mẫu, giữ Sheet dữ liệu cũ…) → xoá, tìm lại.
  if (bound !== id && props.getProperty('DATA_SHEET_ID') !== id) bdsKitForgetDeployment_(props);
  props.setProperty('bound_sheet_id', id);
  if (!props.getProperty('DATA_SHEET_ID')) props.setProperty('DATA_SHEET_ID', id); // dữ liệu nằm ngay trong Sheet khách vừa sao
  if (!props.getProperty('edition')) props.setProperty('edition', BDS_KIT_EDITION);
  if (!props.getProperty('release_origin')) props.setProperty('release_origin', BDS_KIT_RELEASE_ORIGIN);
  if (BDS_KIT_APP_URL && !props.getProperty('app_url')) props.setProperty('app_url', BDS_KIT_APP_URL);
  props.setProperty('kit_version', BDS_KIT_VERSION);
  bdsKitAdoptTicket_(props);
  return true;
}

/**
 * 18/11 "Cài bằng Google" (trang cài đặt – web/core/wizard/gcai.js): trang tạo dự án này qua Apps Script API và thêm tệp CaiGoogle.gs chứa
 * BDS_KIT_INSTALL_TICKET (vé 48 ký tự, trang giữ bản sao trong thẻ trình duyệt). Lần máy chủ tự cài đầu tiên (gasSelfInstall_ → bdsKitPrepare_)
 * chép vé vào setup_token → app gửi vé kèm lệnh tạo tài khoản Chủ (server_core › setupGate), không phải hỏi mã 6 số.
 * Chỉ khi máy chủ CHƯA có tài khoản và chưa có vé nào (hộp thoại BDS Studio › Cài đặt cấp vé mới thì giữ vé của hộp thoại). Sheet mẫu/cài tay: không có tệp → bỏ qua.
 */
function bdsKitAdoptTicket_(props) {
  var t = typeof BDS_KIT_INSTALL_TICKET === 'string' ? BDS_KIT_INSTALL_TICKET : '';
  if (!/^[a-f0-9]{48}$/.test(t) || props.getProperty('setup_done') === '1' || props.getProperty('setup_token')) return false;
  props.setProperty('setup_token', t);
  props.setProperty('setup_code_fails', '0');
  return true;
}

function bdsCaiDat() {
  if (!bdsKitIsOwner_()) throw new Error('bdsCaiDat: ' + BDS_KIT_NOT_OWNER); // C1: bdsKitPrepare_ có thể xoá Script Properties – không để trang web gọi
  var ui = SpreadsheetApp.getUi(), ss = SpreadsheetApp.getActiveSpreadsheet(), props = PropertiesService.getScriptProperties();
  if (typeof setup !== 'function' || typeof ServerCore === 'undefined') {
    ui.alert('BDS Studio', 'Thiếu tệp máy chủ TatCa.gs trong Apps Script của Sheet này. Liên hệ bên bán để nhận Sheet mẫu đúng.', ui.ButtonSet.OK);
    return;
  }
  if (!bdsKitPrepare_(ss, props, ui)) return;
  // Google đặt tên bản sao là "Copy of …" / "Bản sao của …" → đổi về tên gọn (chỉ tên tệp, không ảnh hưởng dữ liệu)
  try { var nm = ss.getName(), gon = nm.replace(/^(Copy of |Bản sao của |Bản sao )/i, ''); if (gon !== nm && gon) ss.rename(gon); } catch (eRen) { /* không đổi được tên – bỏ qua */ }
  ss.toast('Đang cài đặt máy chủ (tạo bảng, cột, hẹn giờ)… khoảng 30 giây.', 'BDS Studio', 60);
  try { setup(); } catch (err) {
    ui.alert('BDS Studio – Cài đặt chưa xong', 'Máy chủ báo: ' + (err && err.message ? err.message : err) + '\n\nBấm lại BDS Studio › Cài đặt. Nếu vẫn lỗi, chụp màn hình gửi bên bán.', ui.ButtonSet.OK);
    return;
  }
  var found = bdsKitFindUrl_(props);
  if (found.url) bdsKitShowUrl_(found.url, true); else bdsKitShowDeploy_();
}

function bdsLayUrlMayChu() {
  var found = bdsKitFindUrl_(PropertiesService.getScriptProperties());
  if (found.url) bdsKitShowUrl_(found.url, false); else bdsKitShowDeploy_();
}
function bdsHuongDanTrienKhai() { bdsKitShowDeploy_(); }

/** Chuỗi bất kỳ → địa chỉ máy chủ …/exec hợp lệ (bỏ ?…/#…) hoặc ''. null / '' / …/dev / trang soạn mã → '' (chưa có bản triển khai). */
function bdsKitExecUrl_(u) {
  var s = String(u == null ? '' : u).trim().replace(/[?#].*$/, '');
  return BDS_KIT_EXEC_RE.test(s) ? s : '';
}
function bdsKitDepId_(execUrl) { var m = /\/s\/([A-Za-z0-9_-]{20,})\/exec$/.exec(execUrl || ''); return m ? m[1] : ''; }
function bdsKitForgetDeployment_(props) { try { props.deleteProperty('DEPLOYMENT_ID'); props.deleteProperty('kit_exec_url'); } catch (e) { /* bỏ qua */ } }
function bdsKitRemember_(props, execUrl) { props.setProperty('DEPLOYMENT_ID', bdsKitDepId_(execUrl)); props.setProperty('kit_exec_url', execUrl); }
/** Props thuộc CHÍNH Sheet đang mở (không phải bản sót từ Sheet mẫu – bản sao mang theo Script Properties nhưng KHÔNG mang bản triển khai). */
function bdsKitOwnProps_(props) {
  var sid = '';
  try { sid = SpreadsheetApp.getActiveSpreadsheet().getId(); } catch (e) { sid = ''; }
  var b = props.getProperty('bound_sheet_id');
  return !!sid && (b ? b === sid : props.getProperty('DATA_SHEET_ID') === sid);
}
/**
 * URL máy chủ (…/exec) → {url} | {url: ''} (không dùng Apps Script API):
 *   1) Apps Script tự báo (ScriptApp.getService().getUrl()) – null / '' / …/dev = CHƯA có bản triển khai → không nhận;
 *   2) địa chỉ đã nhớ (Apps Script báo trước đó / khách dán ở hộp Triển khai) – CHỈ khi props thuộc chính Sheet này.
 */
function bdsKitFindUrl_(props) {
  var u = '';
  try { u = ScriptApp.getService().getUrl() || ''; } catch (e) { u = ''; }
  var ex = bdsKitExecUrl_(u);
  if (ex) { bdsKitRemember_(props, ex); return { url: ex }; }
  var dep = props.getProperty('DEPLOYMENT_ID');
  if (dep && /^[A-Za-z0-9_-]{20,}$/.test(dep) && bdsKitOwnProps_(props)) {
    var saved = bdsKitExecUrl_(props.getProperty('kit_exec_url'));
    return { url: saved && bdsKitDepId_(saved) === dep ? saved : 'https://script.google.com/macros/s/' + dep + '/exec' };
  }
  return { url: '' };
}
/** Nút "Tôi đã triển khai xong – lấy URL". */
function bdsLayUrlJson() {
  if (!bdsKitIsOwner_()) return { ok: false, url: '', message: BDS_KIT_NOT_OWNER };
  var f = bdsKitFindUrl_(PropertiesService.getScriptProperties()); return { ok: !!f.url, url: f.url };
}
/** Ô "Dán URL ứng dụng web vừa Sao chép" trong hộp Triển khai (khi Google chưa tự báo địa chỉ) → {ok, url} | {ok:false, message}. */
function bdsLuuUrlMayChu(v) {
  if (!bdsKitIsOwner_()) return { ok: false, message: BDS_KIT_NOT_OWNER };
  var raw = String(v == null ? '' : v).trim(), ex = bdsKitExecUrl_(raw);
  if (!ex) {
    var why = !raw ? 'Chưa dán URL.' : /\/dev([?#].*)?$/.test(raw) ? 'Đây là địa chỉ chạy thử (/dev) – cần URL ứng dụng web kết thúc bằng /exec.'
      : 'URL chưa đúng dạng https://script.google.com/macros/s/…/exec (Workspace: …/a/macros/<tên miền>/s/…/exec).';
    return { ok: false, message: why + ' Trong hộp "Tuỳ chọn triển khai mới" đã xong: bấm Sao chép ở ô "URL ứng dụng web".' };
  }
  bdsKitRemember_(PropertiesService.getScriptProperties(), ex);
  return { ok: true, url: ex };
}

/* ───────────── hộp thoại ───────────── */
var BDS_KIT_CSS = '<style>body{font:14px/1.5 Arial,sans-serif;color:#1b2533;margin:0 4px}h3{margin:6px 0 8px;color:#0F1E33}'
  + 'ol{padding-left:20px;margin:6px 0}li{margin:4px 0}b{color:#0F1E33}code{background:#eef2f7;padding:1px 4px;border-radius:3px}'
  + '.url{width:100%;box-sizing:border-box;padding:8px;font:13px monospace;border:1px solid #9fb0c6;border-radius:6px}'
  + 'button{padding:8px 14px;margin:8px 6px 0 0;border:0;border-radius:6px;background:#0F1E33;color:#fff;cursor:pointer}'
  + 'button.alt{background:#e3e9f1;color:#0F1E33}.note{color:#5b6b80;font-size:12px}.err{color:#b3261e}'
  // luật 17/11: nút khách bấm khi cài đặt đều có biểu tượng – data-ic="<biểu tượng>" hiện trước chữ (không cần thư viện)
  + '[data-ic]::before{content:attr(data-ic) "\\00a0\\00a0"}'
  + '.warn{background:#fff6e0;border:1px solid #e8c56a;border-radius:6px;padding:8px 10px;margin:6px 0}'
  + 'a.big{display:block;text-align:center;margin:12px 0 6px;padding:14px 16px;border-radius:10px;background:#0F1E33;color:#fff;font-size:17px;font-weight:bold;text-decoration:none}'
  + 'li img{display:block;max-width:100%;margin:6px 0;border:1px solid #d5dbe3;border-radius:6px}</style>';

/**
 * Địa chỉ app khách nhập → https://tên-máy (không đường dẫn) hoặc '' nếu không hợp lệ. "tenkhach" → https://tenkhach.<BDS_KIT_APP_DOMAIN>.
 * Không nhận địa chỉ máy chủ Google (dán nhầm …/exec), 127.0.0.1/localhost (đã có link riêng), http://.
 */
function bdsKitNormAppUrl_(v) {
  var s = String(v == null ? '' : v).trim().toLowerCase().replace(/\/+$/, '');
  if (!s) return '';
  if (/^[a-z0-9](?:[a-z0-9-]{1,28})[a-z0-9]$/.test(s) && BDS_KIT_APP_DOMAIN) s = s + '.' + BDS_KIT_APP_DOMAIN;
  if (!/^https?:\/\//.test(s)) s = 'https://' + s;
  var m = /^https:\/\/((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63})(:\d{1,5})?$/.exec(s);
  if (!m) return '';
  if (/(^|\.)(google\.com|googleusercontent\.com|localhost)$/.test(m[1])) return '';
  return 'https://' + m[1] + (m[2] && m[2] !== ':443' ? m[2] : '');
}
/** Địa chỉ app RIÊNG của máy chủ này: prop app_url (https) → BDS_KIT_APP_URL (bản có app dùng chung) → ''. */
function bdsKitAppUrl_(props) {
  var p = props || PropertiesService.getScriptProperties();
  return bdsKitNormAppUrl_(p.getProperty('app_url') || '') || bdsKitNormAppUrl_(BDS_KIT_APP_URL) || '';
}
/** Hộp thoại gọi (google.script.run): lưu địa chỉ app riêng khách gõ → {ok, app_url, href} (href: mở app + tự nối máy chủ). */
function bdsLuuDiaChiApp(v, serverUrl) {
  if (!bdsKitIsOwner_()) return { ok: false, message: BDS_KIT_NOT_OWNER };
  var app = bdsKitNormAppUrl_(v);
  if (!app) return { ok: false, message: 'Địa chỉ chưa đúng. Nhập địa chỉ app riêng của anh/chị, vd tenkhach.' + (BDS_KIT_APP_DOMAIN || 'bdsstudio.app') + ' hoặc app.tenmiencuaban.com.' };
  PropertiesService.getScriptProperties().setProperty('app_url', app);
  var srv = bdsKitExecUrl_(serverUrl);
  // KHÔNG BAO GIỜ tạo link mở app thiếu địa chỉ máy chủ (app sẽ mở #/home, Trợ lý không nối được) → chưa có …/exec: chỉ lưu + nhắc Triển khai
  if (!srv) return { ok: true, app_url: app, href: '', message: 'Đã lưu địa chỉ app. Máy chủ CHƯA triển khai: làm các bước Triển khai → Tuỳ chọn triển khai mới ở trên rồi bấm "Tôi đã triển khai xong".' };
  return { ok: true, app_url: app, href: bdsKitOpenHref_(app, srv) };
}

function bdsKitEsc_(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

/** Địa chỉ mở app kèm địa chỉ máy chủ: <app>/#/ket-noi?may_chu=<…/exec> – Trợ lý cài đặt tự điền, tự kiểm, tự sang bước kế. */
var BDS_KIT_PH = 'bds:URL'; // chỗ giữ địa chỉ máy chủ trong mẫu HTML của hộp Triển khai (thay ở trình duyệt khi "Tôi đã triển khai xong" đạt)
function bdsKitOpenHref_(base, url) {
  if (url !== BDS_KIT_PH && !bdsKitExecUrl_(url)) return ''; // không có …/exec thật → không có link
  var tk = bdsKitSetupTicket_(null, false).tok;
  return String(base).replace(/\/+$/, '') + '/#/ket-noi?may_chu=' + encodeURIComponent(url) + (tk ? '&ma_cai=' + tk : '');
}
/**
 * R3 (18/11) VÉ CÀI ĐẶT: máy chủ CHƯA có tài khoản Chủ → người lạ biết địa chỉ /exec không được tạo tài khoản Chủ trước anh/chị.
 * Script Properties (cùng dự án với TatCa.gs): setup_token (vé dài, đi kèm link "Mở BDS Studio và kết nối" – 1 chạm, không gõ gì) +
 * setup_code (6 số, hiện ở lối "Chép URL" – app hỏi 1 lần). fresh = true: mỗi lần mở hộp thoại cấp vé MỚI (link / mã cũ hết hiệu lực,
 * đếm số lần nhập sai về 0). Máy chủ đã có tài khoản → không cấp (setup() của máy chủ xoá vé sau khi tạo tài khoản). → {tok, code}
 */
function bdsKitSetupTicket_(props, fresh) {
  var p = props || PropertiesService.getScriptProperties();
  if (p.getProperty('setup_done') === '1') return { tok: '', code: '' };
  var tok = p.getProperty('setup_token') || '', code = p.getProperty('setup_code') || '';
  if (fresh || !/^[a-f0-9]{32,64}$/.test(tok) || !/^\d{6}$/.test(code)) {
    var h = (Utilities.getUuid() + Utilities.getUuid()).replace(/[^a-f0-9]/gi, '').toLowerCase();
    tok = h.slice(0, 48);
    code = ('00000' + (parseInt(h.slice(48, 56), 16) % 1000000)).slice(-6);
    p.setProperty('setup_token', tok); p.setProperty('setup_code', code); p.setProperty('setup_code_fails', '0');
  }
  return { tok: tok, code: code };
}
/**
 * Máy chủ đã triển khai. Đã biết địa chỉ app riêng (prop app_url) → nút to "Mở BDS Studio và kết nối" (app tự điền + tự kiểm).
 * 17/11 (QA khách mới): CHƯA biết địa chỉ app (khách mới, bên bán chưa tạo app riêng) → cách CHÍNH là "Chép URL" rồi dán vào ô "Địa chỉ máy
 * chủ" ở bước "Tạo máy chủ" của Trợ lý cài đặt (trang đang mở); ô "Địa chỉ app của anh/chị" là cách phụ (Trợ lý ghi sẵn địa chỉ này ở cùng bước).
 * Bản bán không có link máy dựng 127.0.0.1:8765 (khách mới chưa cài máy dựng).
 */
function bdsKitUrlBlock_(url, appUrl) {
  var ex = 'tenkhach.' + (BDS_KIT_APP_DOMAIN || 'bdsstudio.app');
  var copy = '<input class="url" id="u" readonly value="' + bdsKitEsc_(url) + '" onclick="this.select()">'
    + '<button data-ic="📋" onclick="var u=document.getElementById(\'u\');u.select();document.execCommand(\'copy\');this.textContent=\'Đã chép ✓\'">Chép URL</button>'
    + '<p class="note">Dán vào ô <b>"Địa chỉ máy chủ (kết thúc bằng /exec)"</b> ở bước <b>"Tạo máy chủ"</b> của Trợ lý cài đặt → <b>Kiểm tra bước này</b>. '
    + 'Máy khác đã có tài khoản: màn đăng nhập › <b>Đổi máy chủ kết nối</b>.</p>';
  var sc = bdsKitSetupTicket_(null, false).code;
  if (sc) copy += '<p>Mã cài đặt: <b style="font-size:18px;letter-spacing:2px">' + sc.slice(0, 3) + ' ' + sc.slice(3) + '</b> – app hỏi mã này 1 lần khi tạo tài khoản (chống người lạ dùng máy chủ của anh/chị).</p>';
  var keep = '<p class="note">Giữ địa chỉ này riêng tư. Dữ liệu nằm trong chính Sheet này, trong Google của anh/chị.</p>';
  if (appUrl) {
    return '<p>Máy chủ đã sẵn sàng. Bấm nút dưới – app tự nối, không cần chép gì:</p>'
      + '<a class="big" data-ic="🚀" target="_blank" rel="noopener" href="' + bdsKitEsc_(bdsKitOpenHref_(appUrl, url)) + '">Mở BDS Studio và kết nối</a>'
      + '<p class="note">Địa chỉ app riêng của anh/chị: <b>' + bdsKitEsc_(appUrl.replace(/^https:\/\//, '')) + '</b></p>'
      + '<details><summary>Không mở được? Chép địa chỉ máy chủ</summary>' + copy + '</details>' + keep;
  }
  return '<p>Máy chủ đã sẵn sàng. <b>Bấm "Chép URL"</b> rồi dán vào Trợ lý cài đặt (trang BDS Studio đang mở):</p>' + copy
    + '<p class="note">Hoặc nhập <b>địa chỉ app riêng của anh/chị</b> (vd <b>' + bdsKitEsc_(ex) + '</b> – Trợ lý cài đặt ghi ở bước "Tạo máy chủ", dòng "Địa chỉ app của anh/chị") để lần sau có nút mở app tự nối:</p>'
    + '<input class="url" id="appu" placeholder="' + bdsKitEsc_(ex) + '" autocomplete="off">'
    + '<button class="alt" data-ic="💾" data-srv="' + bdsKitEsc_(url) + '" onclick="bdsSaveApp(this)">Lưu và mở BDS Studio</button><div id="appo"></div>' + keep;
}
/** Script của hộp thoại: nút "Lưu và mở" (ô địa chỉ app riêng) – tạo link bằng DOM, không chèn HTML từ máy chủ. */
var BDS_KIT_SAVE_JS = 'function bdsSaveApp(b){var v=document.getElementById("appu").value,o=document.getElementById("appo");b.disabled=true;o.textContent="Đang lưu…";'
  + 'google.script.run.withSuccessHandler(function(r){b.disabled=false;o.textContent="";if(r&&r.ok&&r.href&&r.href.indexOf("/#/ket-noi?may_chu=https")>0){var a=document.createElement("a");a.className="big";a.target="_blank";a.rel="noopener";'
  + 'a.href=r.href;a.setAttribute("data-ic","🚀");a.textContent="Mở BDS Studio và kết nối";o.appendChild(a);}else{var p=document.createElement("p");p.className=r&&r.ok?"note":"err";p.textContent=(r&&r.message)||"Địa chỉ chưa đúng.";o.appendChild(p);}})'
  + '.withFailureHandler(function(e){b.disabled=false;o.textContent=String(e&&e.message||e);}).bdsLuuDiaChiApp(v,b.getAttribute("data-srv"));}';

function bdsKitShowUrl_(url, justInstalled) {
  if (!bdsKitExecUrl_(url)) return bdsKitShowDeploy_(); // không có …/exec thật → KHÔNG có nút mở app, hiện hướng dẫn Triển khai
  bdsKitSetupTicket_(null, true); // R3: vé cài đặt mới cho hộp thoại này
  var html = BDS_KIT_CSS + '<h3>' + (justInstalled ? 'Cài đặt xong ✓' : 'Máy chủ BDS Studio') + '</h3>' + bdsKitUrlBlock_(url, bdsKitAppUrl_())
    + '<button class="alt" data-ic="✖" onclick="google.script.host.close()">Đóng</button><script>' + BDS_KIT_SAVE_JS + '</script>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(600).setHeight(440), 'BDS Studio – Mở app');
}

/** 6 cú bấm Triển khai – mỗi dòng 1 việc, tên nút đúng như Google hiện (Việt + Anh), có ảnh khi biết địa chỉ web app. */
function bdsKitDeployStepsHtml_() {
  // ảnh minh hoạ: từ app riêng của khách (nếu đã biết), không thì từ kho phát hành công khai đã ký (cùng cây tệp với bản bán)
  var base = bdsKitAppUrl_() || BDS_KIT_RELEASE_ORIGIN;
  var img = function (k) { return '<img src="' + bdsKitEsc_(base.replace(/\/+$/, '') + '/assets/wizard/google/' + k + '.png') + '" alt="Ảnh minh hoạ" loading="lazy">'; };
  // 17/11 (thử thật): khách mở "Quản lý triển khai" thấy trống, tưởng hỏng → nói rõ: bấm "Tuỳ chọn triển khai mới"; trống là bình thường
  return '<p class="warn"><b>Mục "Quản lý triển khai" trống là bình thường</b> – bản sao Sheet không mang theo triển khai, '
    + 'mỗi máy chủ phải tạo triển khai mới 1 lần. Đừng tìm trong đó: bấm <b>Tuỳ chọn triển khai mới</b>.</p><ol>'
    + '<li>Bấm <b>Tiện ích mở rộng › Apps Script</b> (Extensions › Apps Script).</li>'
    + '<li>Góc phải: <b>Triển khai → Tuỳ chọn triển khai mới (New deployment)</b>.' + img('deploy-menu') + '</li>'
    + '<li>Bấm <b>⚙</b> cạnh <b>Chọn loại</b> → <b>Ứng dụng web</b> (Web app).' + img('deploy-type') + '</li>'
    + '<li><b>Thực thi: Tôi</b> (Me) · <b>Truy cập: Bất kỳ ai</b> (Who has access: Anyone).' + img('deploy-config') + '</li>'
    + '<li>Bấm <b>Triển khai</b> (Deploy) → <b>Cho phép</b> (Allow) → <b>Sao chép URL</b> (Copy).</li>'
    + '<li>Quay lại đây → bấm <b>Tôi đã triển khai xong</b>.</li>'
    + '</ol><p class="note">Chỉ làm 1 lần. Google ghi "chưa xác minh": bấm <b>Nâng cao</b> (Advanced) → <b>Đi tới…</b> (Go to) → <b>Cho phép</b>. '
    + 'Workspace công ty không cho chọn "Bất kỳ ai": nhờ quản trị viên cho phép.</p>';
}
function bdsKitShowDeploy_() {
  bdsKitSetupTicket_(null, true); // R3: vé cài đặt mới (link / mã trong khối URL sau khi "Tôi đã triển khai xong")
  var html = BDS_KIT_CSS + '<h3>Bước cuối: Triển khai máy chủ (6 cú bấm, 1 lần)</h3>'
    + '<p>Google cần anh/chị bấm <b>Triển khai → Tuỳ chọn triển khai mới (New deployment)</b> một lần:</p>'
    + bdsKitDeployStepsHtml_() + '<div id="out"></div>'
    + '<button data-ic="✅" onclick="go(\'bdsLayUrlJson\',this)">Tôi đã triển khai xong</button>'
    + '<button class="alt" data-ic="✖" onclick="google.script.host.close()">Đóng</button>'
    // dự phòng: Google chưa tự báo địa chỉ (getUrl() trả …/dev hoặc trống) → khách dán URL vừa "Sao chép" ở hộp Tuỳ chọn triển khai mới
    + '<details id="paste"><summary>Đã triển khai mà vẫn chưa thấy nút? Dán URL ứng dụng web vừa Sao chép</summary>'
    + '<input class="url" id="srvu" placeholder="https://script.google.com/macros/s/…/exec" autocomplete="off">'
    + '<button data-ic="🔗" onclick="go(\'bdsLuuUrlMayChu\',this,document.getElementById(\'srvu\').value)">Dùng URL này</button></details>'
    + '<script>' + BDS_KIT_SAVE_JS + 'var PH=' + JSON.stringify(BDS_KIT_PH) + ',URLBLOCK=' + JSON.stringify(bdsKitUrlBlock_(BDS_KIT_PH, bdsKitAppUrl_()))
    + ',ENC=' + JSON.stringify(encodeURIComponent(BDS_KIT_PH)) + ',EXRE=new RegExp(' + JSON.stringify(BDS_KIT_EXEC_RE.source) + ');'
    + 'function go(fn,b,arg){b.disabled=true;var o=document.getElementById("out");o.innerHTML="Đang kiểm…";var run=google.script.run.withSuccessHandler(function(r){b.disabled=false;'
    // CHỈ hiện nút "Mở BDS Studio và kết nối" khi máy chủ trả địa chỉ …/exec thật (kiểm lại cả ở trình duyệt)
    + 'if(r&&r.url&&EXRE.test(r.url)){var u=r.url.replace(/[<>"\'&]/g,"");o.innerHTML=URLBLOCK.split(ENC).join(encodeURIComponent(u)).split(PH).join(u);document.getElementById("paste").open=false;}'
    + 'else{o.innerHTML="";var p=document.createElement("p");p.className="err";p.textContent=(r&&r.message)||"Chưa thấy bản triển khai Web App. Mục \\"Quản lý triển khai\\" trống là bình thường – phải bấm Triển khai → Tuỳ chọn triển khai mới (New deployment), làm đủ các bước trên (nhớ chọn Bất kỳ ai) rồi bấm lại. Hoặc dán URL vừa Sao chép vào ô bên dưới.";o.appendChild(p);document.getElementById("paste").open=true;}})'
    + '.withFailureHandler(function(e){b.disabled=false;o.innerHTML="";var p=document.createElement("p");p.className="err";p.textContent=String(e&&e.message||e);o.appendChild(p);});'
    + 'if(arg===undefined)run[fn]();else run[fn](arg);}</script>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(640).setHeight(680), 'BDS Studio – Triển khai máy chủ');
}

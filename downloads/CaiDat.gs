/**
 * BDS Studio – CaiDat.gs  ("Cài 1 chạm" – Sheet MẪU cho người mua Cá nhân)
 * Tệp này nằm CẠNH TatCa.gs trong Apps Script gắn với Sheet mẫu (Tiện ích mở rộng › Apps Script). Không sửa TatCa.gs.
 *
 * Khách bấm link "Tạo bản sao" → Google chép Sheet + toàn bộ script này vào Google của khách → khách mở Sheet:
 *   ô A1 (tab "Bắt đầu", onOpen tự ghi + tô màu): ① Chờ 10–20 giây → BDS Studio › ⚙️ Cài đặt ② Google hỏi quyền → Cho phép → bấm LẦN NỮA ③ chờ ~30 giây.
 *     (20/11 – chủ thử như khách: lần bấm menu ĐẦU chỉ để Google xin quyền, sau đó không chạy gì → khách tưởng hỏng. onOpen còn nhắc bằng toast.)
 *   menu  BDS Studio › ⚙️ Cài đặt
 *     1) bản sao mới (Script Properties không thuộc Sheet này): XOÁ HẾT cấu hình sót của Sheet mẫu (app_url, release_origin trỏ kho riêng tư,
 *        vé cài đặt, DEPLOYMENT_ID…), dùng CHÍNH Sheet này làm Sheet dữ liệu; luôn ÉP release_origin = kho phát hành bán (BDS_KIT_RELEASE_ORIGIN)
 *     2) HIỆN HỘP THOẠI NGAY ("Đang cài đặt máy chủ… khoảng 30 giây – đừng tải lại trang") rồi từ trong hộp gọi bdsCaiDatChay (google.script.run):
 *        setup() của TatCa.gs (tab/cột, khoá bí mật, thư mục Drive, hẹn giờ) → kết quả hiện ngay trong hộp đó (20/11: trước đây toast + chờ 30 giây
 *        rồi mới mở hộp → khách tải lại trang / có lần hộp không hiện).
 *     3) tìm địa chỉ máy chủ …/exec rồi GỌI THẬT tới nó (BDS_probeExec_ ở phần khởi động gas/Boot.gs): CHỈ khi nó trả lời đúng là máy chủ BDS Studio
 *        của CHÍNH dự án này mới hiện "Cài đặt xong ✓". 20/11 (lỗi thật): bản sao CHƯA có bản triển khai mà getUrl() vẫn trả …/exec "ma"
 *        (AKfycbyBEHac… → trang Google "Không thể mở tệp") → hộp báo "Cài đặt xong" + nút kết nối, khách bỏ qua bước Triển khai.
 *        Chưa đạt → nói ĐÚNG lý do (chưa triển khai / không phải Ứng dụng web / chưa "Bất kỳ ai" / mã cũ / máy chủ khác) + cách sửa + 7 bước Triển khai.
 *        KHÔNG dùng Apps Script API (dự án Google Cloud mặc định do Google giữ, khách không bật được API – 17/11).
 *     4) đạt → nút to "Quay lại trang cài đặt và kết nối" (trang cài đặt của người bán) hoặc "Mở BDS Studio và kết nối" (đã biết app riêng),
 *        LUÔN mang vé cài đặt (&ma_cai=) → app không hỏi mã ở đường thường. Ngay cạnh: địa chỉ máy chủ + MÃ CÀI ĐẶT 6 số (to, không gấp).
 *   menu  BDS Studio › 🔗 Mở lại hộp kết nối (địa chỉ + mã cài đặt) – kiểm lại máy chủ, luôn có mã hợp lệ (cấp mới khi chưa có / đã khoá)
 *   menu  BDS Studio › 📘 Hướng dẫn
 * Mã cài đặt KHÔNG BAO GIỜ ghi vào ô Sheet (chỉ hiện trong hộp thoại của chủ).
 * Hàm gọi từ hộp thoại (google.script.run) KHÔNG được kết thúc bằng "_" (Apps Script coi là hàm riêng) – và đều tự kiểm người gọi = chủ.
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
// gflow (18/11): TRANG CÀI ĐẶT của người bán (sale.config.json › PORTAL, vd https://cai.bdsstudio.app – tools/sale_build.mjs --kit điền).
// Khách mới (chưa có app riêng) → hộp thoại có nút to "Quay lại trang cài đặt và kết nối": Trợ lý ở trang cài đặt tự điền địa chỉ máy chủ +
// vé cài đặt, tự kiểm, mở thẳng màn đặt mật khẩu – không chép/dán …/exec, không gõ mã 6 số. Trống → như cũ (Chép URL).
var BDS_KIT_PORTAL_URL = 'https://cai.bdsstudio.app';
// Địa chỉ máy chủ …/exec – CÙNG mẫu với web/core/exec_url.js › EXEC_URL_RE (tests/unit/exec_url.test.mjs đối chiếu). /dev KHÔNG nhận.
var BDS_KIT_EXEC_RE = /^https:\/\/script\.google\.com\/(?:macros|a\/macros\/[A-Za-z0-9.-]{2,253}|a\/[A-Za-z0-9.-]{2,253}\/macros)\/s\/[A-Za-z0-9_-]{20,}\/exec$/;
// Số lần nhập sai mã tối đa của máy chủ (gas/server_core.js › SETUP_CODE_MAX) – tới mức này mã bị khoá → hộp thoại cấp mã mới.
var BDS_KIT_CODE_MAX = 10;
// 3 bước khách làm trong Sheet (ô A1 + hộp thoại + toast) – một chỗ, đúng chữ chủ duyệt 20/11.
var BDS_KIT_STEPS = [
  '① Chờ 10–20 giây → bấm menu BDS Studio › ⚙️ Cài đặt.',
  '② Google hỏi quyền → Cho phép → bấm ⚙️ Cài đặt LẦN NỮA.',
  '③ Chờ ~30 giây, đừng tải lại trang.'
];
var BDS_KIT_A1_TODO = 'BDS Studio – máy chủ của anh/chị (dữ liệu nằm trong Google của anh/chị)\n' + BDS_KIT_STEPS.join('\n');
var BDS_KIT_A1_DONE = 'BDS Studio – máy chủ đã cài ✓ (dữ liệu nằm trong Google của anh/chị)\n'
  + 'Cần địa chỉ máy chủ / mã cài đặt: bấm menu BDS Studio › 🔗 Mở lại hộp kết nối.\nĐừng xoá, đổi tên các tab dữ liệu.';
var BDS_KIT_START_TAB = 'Bắt đầu';

// Menu "BDS Studio" LUÔN có: TatCa.gs (phần khởi động gas/Boot.gs) dựng menu bằng BDS_menu_ – vẫn còn sau khi máy chủ tự cập nhật / khi tệp
// này bị bỏ. Hai tệp cùng có onOpen → tệp nào thắng cũng gọi BDS_menu_ (menu y hệt; BDS_menu_ gọi lại bdsKitOnOpen_). TatCa.gs cũ → menu riêng.
function onOpen(e) {
  if (typeof BDS_menu_ === 'function') return BDS_menu_(e);
  SpreadsheetApp.getUi().createMenu('BDS Studio')
    .addItem('⚙️ Cài đặt', 'bdsCaiDat')
    .addItem('🔗 Mở lại hộp kết nối (địa chỉ + mã cài đặt)', 'bdsLayUrlMayChu')
    .addItem('📘 Hướng dẫn', 'bdsHuongDanTrienKhai')
    .addToUi();
  try { bdsKitOnOpen_(e); } catch (x) { /* không chặn menu */ }
}

/* ───────────── lúc mở Sheet (hẹn giờ đơn giản onOpen – quyền hạn chế: chỉ đọc/ghi CHÍNH Sheet này, toast, Script Properties) ───────────── */
function bdsKitInstalled_(props, id) {
  try { return !!id && props.getProperty('bound_sheet_id') === id && !!props.getProperty('installed_version'); } catch (e) { return false; }
}
/** Google đã cấp quyền cho script này chưa (true / false / null = không biết). */
function bdsKitAuthorized_() {
  try { return ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL).getAuthorizationStatus() === ScriptApp.AuthorizationStatus.NOT_REQUIRED; } catch (e) { return null; }
}
/** Tên tệp Google đặt cho bản sao ("Bản sao của …" / "Copy of …", có thể lặp) → tên gọn (vd "BDS Studio – Dữ liệu"). */
function bdsKitCleanName_(nm) {
  var s = String(nm == null ? '' : nm), prev;
  do { prev = s; s = s.replace(/^\s*(?:Copy of|Bản sao của|Bản sao)\s+/i, ''); } while (s !== prev);
  return s.trim() || String(nm == null ? '' : nm);
}
function bdsKitIsFreshCopyName_(nm) { return bdsKitCleanName_(nm) !== String(nm == null ? '' : nm); }
/** Ô A1 của tab "Bắt đầu": chữ to, tô màu, gộp cả dòng. Chỉ ghi khi chữ khác (mở Sheet không tốn thời gian). → true nếu đã ghi. */
function bdsKitStartSheet_(ss, installed) {
  var sh = ss.getSheetByName(BDS_KIT_START_TAB);
  if (!sh) {
    var first = ss.getSheets()[0];
    if (!first || !/^BDS Studio –/.test(String(first.getRange(1, 1).getValue() || ''))) return false; // không phải Sheet mẫu – không đụng
    sh = first;
  }
  var want = installed ? BDS_KIT_A1_DONE : BDS_KIT_A1_TODO, a1 = sh.getRange(1, 1);
  if (String(a1.getValue() || '') === want) return false;
  var cols = Math.max(8, Math.min(12, sh.getMaxColumns()));
  try { sh.getRange(1, 1, 1, cols).merge(); } catch (e) { /* đã gộp / không gộp được – vẫn ghi chữ */ }
  a1.setValue(want).setFontSize(15).setFontWeight('bold').setFontColor('#0F1E33').setBackground(installed ? '#E3F4E8' : '#FFF1C9')
    .setWrap(true).setVerticalAlignment('middle');
  try { sh.setRowHeight(1, installed ? 96 : 132); } catch (e) { /* bỏ qua */ }
  // Sheet mẫu cũ ghi 3 bước ở A2–A4 ("1) …", "2) …", "3) …") → dọn (A1 đã đủ)
  try {
    var old = sh.getRange(2, 1, 3, 1).getValues();
    for (var i = 0; i < old.length; i++) if (/^[1-3]\)\s/.test(String(old[i][0] || ''))) sh.getRange(i + 2, 1).setValue('');
  } catch (e) { /* bỏ qua */ }
  return true;
}
/** Gọi từ onOpen (BDS_menu_ của phần khởi động hoặc onOpen ở trên). Không bao giờ ném lỗi. */
function bdsKitOnOpen_(e) {
  var ss = null, props = null, id = '';
  try { ss = (e && e.source) || SpreadsheetApp.getActiveSpreadsheet(); id = ss ? String(ss.getId()) : ''; } catch (x) { ss = null; }
  if (!ss) return;
  try { props = PropertiesService.getScriptProperties(); } catch (x) { props = null; }
  var installed = !!props && bdsKitInstalled_(props, id);
  try { bdsKitStartSheet_(ss, installed); } catch (x) { /* Sheet chỉ xem – bỏ qua */ }
  if (installed) return;
  var nm = '';
  try { nm = ss.getName(); } catch (x) { nm = ''; }
  if (!bdsKitIsFreshCopyName_(nm) && !(props && props.getProperty('bound_sheet_id'))) return; // Sheet mẫu của người bán: không nhắc bấm Cài đặt
  var auth = bdsKitAuthorized_();
  try {
    ss.toast(auth === true ? 'Đã cấp quyền – bấm BDS Studio › ⚙️ Cài đặt để làm tiếp.' : BDS_KIT_STEPS[0] + ' ' + BDS_KIT_STEPS[1], 'BDS Studio', 20);
  } catch (x) { /* bỏ qua */ }
}

/**
 * Hàm hộp thoại gọi qua google.script.run là hàm TOÀN CỤC → trang web công khai của máy chủ (web app "Thực thi: Tôi") cũng gọi được bằng
 * quyền chủ. Hàm GHI / hàm trả mã cài đặt chỉ chạy khi người gọi = chủ: cùng quy tắc ownerGuard_ / BDS_callerIsOwner_ (TatCa.gs).
 */
function bdsKitIsOwner_() {
  if (typeof BDS_callerIsOwner_ === 'function') return BDS_callerIsOwner_();
  var a = '', f = '';
  try { a = String(Session.getActiveUser().getEmail() || '').trim().toLowerCase(); } catch (e) { a = ''; }
  try { f = String(Session.getEffectiveUser().getEmail() || '').trim().toLowerCase(); } catch (e) { f = ''; }
  return !!a && a === f;
}
var BDS_KIT_NOT_OWNER = 'Chỉ tài khoản Google đã cài máy chủ này (chủ Sheet) làm được việc này.';

/**
 * Chuẩn bị Script Properties trước setup(). Bản sao Sheet mang theo Script Properties của Sheet mẫu nhưng KHÔNG mang bản triển khai.
 *  - bound_sheet_id khác Sheet này → chắc chắn sót từ máy chủ khác → xoá hết.
 *  - chưa có bound_sheet_id lẫn DATA_SHEET_ID → bản sao mới: MỌI prop đều sót từ Sheet mẫu (20/11 lỗi thật: app_url của bản demo người bán,
 *    release_origin trỏ kho riêng tư, vé, DEPLOYMENT_ID) → xoá hết.
 *  - DATA_SHEET_ID trỏ Sheet khác (không có bound) → hỏi (có thể là cài tay giữ Sheet dữ liệu cũ).
 * Sau đó luôn ép release_origin = kho phát hành bán.
 */
function bdsKitPrepare_(ss, props, ui) {
  var id = ss.getId(), bound = props.getProperty('bound_sheet_id'), data = props.getProperty('DATA_SHEET_ID');
  if (bound && bound !== id) {
    props.deleteAllProperties();                       // chắc chắn là bản sao của một máy chủ khác → cài mới hoàn toàn
  } else if (!bound && !data) {
    props.deleteAllProperties();                       // bản sao mới: mọi thứ còn lại là của Sheet mẫu
  } else if (!bound && data && data !== id) {
    var a = ui.alert('BDS Studio', 'Script này đang trỏ tới một Sheet dữ liệu khác (có thể là cấu hình sót lại từ Sheet mẫu).\n\n'
      + 'Bấm "Có" để XOÁ cấu hình cũ và cài mới trên Sheet này (khuyên dùng với bản sao mới).\n'
      + 'Bấm "Không" để giữ nguyên Sheet dữ liệu cũ.', ui.ButtonSet.YES_NO_CANCEL);
    if (a === ui.Button.CANCEL || a === ui.Button.CLOSE) return false;
    if (a === ui.Button.YES) props.deleteAllProperties();
  }
  // mã triển khai nhớ trong props chỉ đúng khi props là của CHÍNH Sheet này (DATA_SHEET_ID = Sheet này: dán tay rồi mới bấm Cài đặt)
  if (bound !== id && props.getProperty('DATA_SHEET_ID') !== id) bdsKitForgetDeployment_(props);
  props.setProperty('bound_sheet_id', id);
  if (!props.getProperty('DATA_SHEET_ID')) props.setProperty('DATA_SHEET_ID', id); // dữ liệu nằm ngay trong Sheet khách vừa sao
  if (!props.getProperty('edition')) props.setProperty('edition', BDS_KIT_EDITION);
  if (BDS_KIT_RELEASE_ORIGIN) props.setProperty('release_origin', BDS_KIT_RELEASE_ORIGIN); // 20/11: LUÔN ép về kho phát hành bán
  if (BDS_KIT_APP_URL && !props.getProperty('app_url')) props.setProperty('app_url', BDS_KIT_APP_URL);
  props.setProperty('kit_version', BDS_KIT_VERSION);
  bdsKitAdoptTicket_(props);
  return true;
}

/**
 * 18/11 "Cài bằng Google" (trang cài đặt – web/core/wizard/gcai.js): trang tạo dự án này qua Apps Script API và thêm tệp CaiGoogle.gs chứa
 * BDS_KIT_INSTALL_TICKET (vé 48 ký tự, trang giữ bản sao trong thẻ trình duyệt). Lần máy chủ tự cài đầu tiên (gasSelfInstall_ → bdsKitPrepare_)
 * chép vé vào setup_token → app gửi vé kèm lệnh tạo tài khoản Chủ (server_core › setupGate), không phải hỏi mã 6 số.
 * Chỉ khi máy chủ CHƯA có tài khoản và chưa có vé nào. Sheet mẫu/cài tay: không có tệp → bỏ qua.
 */
function bdsKitAdoptTicket_(props) {
  var t = typeof BDS_KIT_INSTALL_TICKET === 'string' ? BDS_KIT_INSTALL_TICKET : '';
  if (!/^[a-f0-9]{48}$/.test(t) || props.getProperty('setup_done') === '1' || props.getProperty('setup_token')) return false;
  props.setProperty('setup_token', t);
  props.setProperty('setup_code_fails', '0');
  return true;
}

/* ───────────── mục menu ───────────── */
/** Menu ⚙️ Cài đặt: dọn cấu hình sót, đổi tên bản sao, HIỆN HỘP THOẠI NGAY; setup() chạy từ trong hộp (bdsCaiDatChay). */
function bdsCaiDat() {
  if (!bdsKitIsOwner_()) throw new Error('bdsCaiDat: ' + BDS_KIT_NOT_OWNER); // C1: bdsKitPrepare_ có thể xoá Script Properties – không để trang web gọi
  var ui = SpreadsheetApp.getUi(), ss = SpreadsheetApp.getActiveSpreadsheet(), props = PropertiesService.getScriptProperties();
  if (typeof setup !== 'function' || typeof ServerCore === 'undefined') {
    ui.alert('BDS Studio', 'Thiếu tệp máy chủ TatCa.gs trong Apps Script của Sheet này. Liên hệ bên bán để nhận Sheet mẫu đúng.', ui.ButtonSet.OK);
    return;
  }
  if (!bdsKitPrepare_(ss, props, ui)) return;
  // Google đặt tên bản sao là "Copy of …" / "Bản sao của …" → đổi về tên gọn (chỉ tên tệp, không ảnh hưởng dữ liệu)
  try { var nm = ss.getName(), gon = bdsKitCleanName_(nm); if (gon !== nm && gon) ss.rename(gon); } catch (eRen) { /* không đổi được tên – bỏ qua */ }
  bdsKitShowShell_('bdsCaiDatChay', 'BDS Studio – Cài đặt máy chủ', '<h3>Đang cài đặt máy chủ…</h3>'
    + '<p class="wait"><span class="spin"></span><b>Khoảng 30 giây – đừng tải lại trang</b>, đừng đóng hộp này.</p>'
    + '<p class="note">Đang tạo bảng, cột, hẹn giờ rồi tự kiểm địa chỉ máy chủ. Xong, kết quả hiện ngay tại đây.</p>');
}
/** Hộp thoại (google.script.run) của ⚙️ Cài đặt: chạy setup() → kết quả (đã kiểm …/exec thật) → {ok, state, url, html}. */
function bdsCaiDatChay() {
  if (!bdsKitIsOwner_()) return { ok: false, message: BDS_KIT_NOT_OWNER };
  var props = PropertiesService.getScriptProperties();
  if (!bdsKitOwnProps_(props)) return { ok: false, html: '<h3>Chưa cài được</h3><p class="err">Cấu hình máy chủ chưa gắn với Sheet này. Đóng hộp này rồi bấm lại menu <b>BDS Studio › ⚙️ Cài đặt</b>.</p>' + BDS_KIT_CLOSE };
  try { setup(); } catch (err) {
    return { ok: false, state: 'error', html: '<h3>Cài đặt chưa xong</h3><p class="err">Máy chủ báo: ' + bdsKitEsc_(err && err.message ? err.message : err) + '</p>'
      + '<p>Bấm <b>Chạy lại</b>. Vẫn lỗi: chụp màn hình gửi bên bán.</p>'
      + '<button data-ic="🔁" onclick="again(this,\'bdsCaiDatChay\',SPIN_SETUP)">Chạy lại</button>' + BDS_KIT_CLOSE };
  }
  try { bdsKitStartSheet_(SpreadsheetApp.getActiveSpreadsheet(), true); } catch (eA1) { /* ô A1 chỉ là hướng dẫn – bỏ qua */ }
  return bdsKitState_(true);
}
/** Menu 🔗 Mở lại hộp kết nối: hộp hiện ngay, tự kiểm máy chủ, hiện địa chỉ + mã cài đặt (cấp mã mới khi cần). */
function bdsLayUrlMayChu() {
  bdsKitShowShell_('bdsKetNoiJson', 'BDS Studio – Kết nối máy chủ', BDS_KIT_SPIN_CHECK);
}
/** Hộp thoại (google.script.run) của 🔗: → {ok, state, url, html}. */
function bdsKetNoiJson() {
  if (!bdsKitIsOwner_()) return { ok: false, message: BDS_KIT_NOT_OWNER };
  return bdsKitState_(false);
}
/** Menu 📘 Hướng dẫn: 3 bước trong Sheet + 7 bước Triển khai + nút kiểm. */
function bdsHuongDanTrienKhai() {
  bdsKitShowShell_('', 'BDS Studio – Hướng dẫn', '<h3>📘 Hướng dẫn cài máy chủ</h3>' + bdsKitStepsHtml_()
    + '<h3>Triển khai máy chủ (7 bước, 1 lần)</h3>' + bdsKitDeployStepsHtml_()
    + '<button data-ic="✅" onclick="again(this,\'bdsLayUrlJson\',SPIN_CHECK)">Tôi đã triển khai xong – kiểm tra</button>' + BDS_KIT_CLOSE);
}
/** Nút "Tôi đã triển khai xong – kiểm tra" / "Kiểm tra lại" → {ok, state, url, html}. */
function bdsLayUrlJson() {
  if (!bdsKitIsOwner_()) return { ok: false, url: '', message: BDS_KIT_NOT_OWNER };
  return bdsKitState_(false);
}
/** Ô "Dán URL ứng dụng web vừa Sao chép" (khi Google chưa tự báo địa chỉ) → kiểm thật → {ok, url, html} | {ok:false, message}. */
function bdsLuuUrlMayChu(v) {
  if (!bdsKitIsOwner_()) return { ok: false, message: BDS_KIT_NOT_OWNER };
  var raw = String(v == null ? '' : v).trim(), ex = bdsKitExecUrl_(raw);
  if (!ex) {
    var why = !raw ? 'Chưa dán URL.' : /\/dev([?#].*)?$/.test(raw) ? 'Đây là địa chỉ chạy thử (/dev) – cần URL ứng dụng web kết thúc bằng /exec.'
      : 'URL chưa đúng dạng https://script.google.com/macros/s/…/exec (Workspace: …/a/macros/<tên miền>/s/…/exec).';
    return { ok: false, message: why + ' Trong hộp "Tuỳ chọn triển khai mới" đã xong: bấm Sao chép ở ô "URL ứng dụng web".' };
  }
  var pr = bdsKitProbe_(ex);
  if (!pr.ok) return { ok: false, url: '', kind: pr.kind, message: bdsKitPlain_(pr.problem + ' Cách sửa: ' + pr.fix) };
  bdsKitRemember_(PropertiesService.getScriptProperties(), ex);
  return bdsKitReady_(ex, false);
}

/* ───────────── địa chỉ máy chủ ───────────── */
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
 * Địa chỉ …/exec CÓ THỂ là của máy chủ này (chưa tin – phải qua bdsKitProbe_), theo thứ tự:
 *   1) Apps Script tự báo (ScriptApp.getService().getUrl()) – null / '' / …/dev = chưa có bản triển khai; …/exec vẫn có thể là "ma" (20/11);
 *   2) địa chỉ đã nhớ (khách dán ở hộp Triển khai / lần kiểm đạt trước) – CHỈ khi props thuộc chính Sheet này.
 */
function bdsKitCandidates_(props) {
  var out = [], u = '';
  try { u = ScriptApp.getService().getUrl() || ''; } catch (e) { u = ''; }
  var ex = bdsKitExecUrl_(u);
  if (ex) out.push(ex);
  var dep = props.getProperty('DEPLOYMENT_ID');
  if (dep && /^[A-Za-z0-9_-]{20,}$/.test(dep) && bdsKitOwnProps_(props)) {
    var saved = bdsKitExecUrl_(props.getProperty('kit_exec_url'));
    var s2 = saved && bdsKitDepId_(saved) === dep ? saved : 'https://script.google.com/macros/s/' + dep + '/exec';
    if (out.indexOf(s2) < 0) out.push(s2);
  }
  return out;
}
/** Gọi thật tới …/exec – phần khởi động (TatCa.gs › BDS_probeExec_) phân loại câu trả lời. TatCa.gs cũ (chưa có) → không tin. */
function bdsKitProbe_(url) {
  if (typeof BDS_probeExec_ === 'function') return BDS_probeExec_(url);
  return { ok: false, kind: 'old_tatca', url: url, problem: 'Tệp TatCa.gs trong Apps Script là bản cũ, chưa tự kiểm được địa chỉ máy chủ.', fix: 'Liên hệ bên bán để nhận Sheet mẫu mới.' };
}
/** Tìm + kiểm: → {url, pr} (url = '' khi chưa có địa chỉ nào trả lời đúng; pr = kết quả kiểm của địa chỉ đầu tiên hỏng, để nói lý do). */
function bdsKitFindUrl_(props) {
  var list = bdsKitCandidates_(props), first = null;
  for (var i = 0; i < list.length; i++) {
    var pr = bdsKitProbe_(list[i]);
    if (pr && pr.ok) { bdsKitRemember_(props, list[i]); return { url: list[i], pr: pr }; }
    if (!first) first = pr;
  }
  if (first && first.kind !== 'unreachable') bdsKitForgetDeployment_(props); // địa chỉ ma / của Sheet mẫu – không nhớ (lỗi mạng tạm: giữ)
  return { url: '', pr: first };
}
/** Trạng thái cho hộp thoại: đã kiểm đạt → khối kết nối; chưa → lý do + 7 bước Triển khai. */
function bdsKitState_(justInstalled) {
  var props = PropertiesService.getScriptProperties(), f = bdsKitFindUrl_(props);
  if (f.url) return bdsKitReady_(f.url, justInstalled);
  return { ok: false, state: 'deploy', url: '', kind: f.pr ? f.pr.kind : 'none', html: bdsKitDeployHtml_(f.pr, justInstalled) };
}
function bdsKitReady_(url, justInstalled) {
  bdsKitSetupTicket_(null, false); // vé + mã hợp lệ (cấp mới khi chưa có / đã khoá) – giữ vé cũ để link đã mở vẫn dùng được
  var html = '<h3>' + (justInstalled ? 'Cài đặt xong ✓' : 'Máy chủ BDS Studio ✓') + '</h3>'
    + '<p class="okline">✓ Đã kiểm: địa chỉ máy chủ trả lời đúng là BDS Studio của Sheet này.</p>' + bdsKitUrlBlock_(url, bdsKitAppUrl_()) + BDS_KIT_CLOSE;
  return { ok: true, state: 'ready', url: url, html: html };
}

/* ───────────── hộp thoại ───────────── */
var BDS_KIT_CSS = '<style>body{font:14px/1.5 Arial,sans-serif;color:#1b2533;margin:0 4px}h3{margin:6px 0 8px;color:#0F1E33}'
  + 'ol{padding-left:20px;margin:6px 0}li{margin:6px 0}b{color:#0F1E33}code{background:#eef2f7;padding:1px 4px;border-radius:3px}'
  + '.url{width:100%;box-sizing:border-box;padding:10px 8px;font:13px monospace;border:1px solid #9fb0c6;border-radius:6px}'
  + 'button{min-height:44px;padding:8px 14px;margin:8px 6px 0 0;border:0;border-radius:6px;background:#0F1E33;color:#fff;cursor:pointer;font-size:14px}'
  + 'button.alt{background:#e3e9f1;color:#0F1E33}button:disabled{opacity:.6}.note{color:#5b6b80;font-size:12px}.err{color:#b3261e}.okline{color:#1e7a3c;font-weight:bold}'
  // luật 17/11: nút khách bấm khi cài đặt đều có biểu tượng – data-ic="<biểu tượng>" hiện trước chữ (không cần thư viện)
  + '[data-ic]::before{content:attr(data-ic) "\\00a0\\00a0"}'
  + '.warn{background:#fff6e0;border:1px solid #e8c56a;border-radius:6px;padding:8px 10px;margin:6px 0}'
  + '.steps3{background:#FFF1C9;border-radius:8px;padding:8px 12px;margin:6px 0;font-size:15px;font-weight:bold;color:#0F1E33}.steps3 p{margin:4px 0}'
  + 'a.big{display:block;text-align:center;margin:12px 0 6px;padding:14px 16px;border-radius:10px;background:#0F1E33;color:#fff;font-size:17px;font-weight:bold;text-decoration:none}'
  + '.pair{display:flex;flex-wrap:wrap;gap:10px;align-items:stretch;margin:8px 0}.pair .addr{flex:1 1 300px;min-width:0}'
  + '.pair .code{flex:0 0 auto;background:#eef6ff;border:2px solid #0F1E33;border-radius:10px;padding:6px 14px;text-align:center}'
  + '.code .lbl{font-size:12px;color:#5b6b80}.code .num{font:bold 30px/1.2 monospace;letter-spacing:3px;color:#0F1E33}'
  + '.spin{display:inline-block;width:22px;height:22px;border:4px solid #d5dbe3;border-top-color:#0F1E33;border-radius:50%;animation:sp 1s linear infinite;vertical-align:middle;margin-right:10px}'
  + '@keyframes sp{to{transform:rotate(360deg)}}.wait{font-size:16px}'
  + 'li img{display:block;max-width:100%;margin:6px 0;border:1px solid #d5dbe3;border-radius:6px}</style>';
var BDS_KIT_CLOSE = '<button class="alt" data-ic="✖" onclick="google.script.host.close()">Đóng</button>';
var BDS_KIT_SPIN_CHECK = '<h3>Đang kiểm máy chủ…</h3><p class="wait"><span class="spin"></span><b>Vài giây – đừng tải lại trang.</b></p>';
var BDS_KIT_SPIN_SETUP = '<h3>Đang cài đặt máy chủ…</h3><p class="wait"><span class="spin"></span><b>Khoảng 30 giây – đừng tải lại trang.</b></p>';

/** 3 bước trong Sheet (giống ô A1). */
function bdsKitStepsHtml_() {
  return '<div class="steps3">' + BDS_KIT_STEPS.map(function (s) { return '<p>' + bdsKitEsc_(s) + '</p>'; }).join('') + '</div>';
}
/** HTML (đã thoát) → chữ thường cho thông báo lỗi ngắn. */
function bdsKitPlain_(h) { return String(h || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'); }

/**
 * Khung hộp thoại hiện NGAY (20/11): chữ chờ + vòng quay; run = tên hàm google.script.run gọi ngay khi mở (trống = nội dung tĩnh).
 * Kết quả (r.html do máy chủ dựng, mọi giá trị đã thoát) thay vào #main – nút trong đó gọi again()/paste()/bdsSaveApp() ở đây.
 */
function bdsKitShowShell_(run, title, firstHtml) {
  var js = 'var RUN=' + JSON.stringify(run || '') + ',SPIN_CHECK=' + JSON.stringify(BDS_KIT_SPIN_CHECK) + ',SPIN_SETUP=' + JSON.stringify(BDS_KIT_SPIN_SETUP) + ';'
    + 'function main(){return document.getElementById("main");}'
    + 'function errBox(msg,fn){var m=main();m.innerHTML="";var h=document.createElement("h3");h.textContent="Chưa xong";m.appendChild(h);var p=document.createElement("p");p.className="err";p.textContent=msg;m.appendChild(p);'
    + 'if(fn){var b=document.createElement("button");b.setAttribute("data-ic","🔁");b.textContent="Thử lại";b.onclick=function(){again(b,fn,fn==="bdsCaiDatChay"?SPIN_SETUP:SPIN_CHECK);};m.appendChild(b);}'
    + 'var c=document.createElement("button");c.className="alt";c.setAttribute("data-ic","✖");c.textContent="Đóng";c.onclick=function(){google.script.host.close();};m.appendChild(c);}'
    + 'function show(r,fn){if(r&&r.html){main().innerHTML=r.html;}else{errBox((r&&r.message)||"Máy chủ chưa trả lời. Bấm Thử lại.",fn);}}'
    + 'function call(fn){google.script.run.withSuccessHandler(function(r){show(r,fn);}).withFailureHandler(function(e){errBox("Google báo: "+String(e&&e.message||e)+" – bấm Thử lại (không cần tải lại trang).",fn);})[fn]();}'
    + 'function again(b,fn,spin){if(b)b.disabled=true;main().innerHTML=spin||SPIN_CHECK;call(fn);}'
    + 'function paste(b){var v=document.getElementById("srvu").value,o=document.getElementById("pout");b.disabled=true;o.textContent="Đang kiểm…";'
    + 'google.script.run.withSuccessHandler(function(r){b.disabled=false;if(r&&r.ok&&r.html){show(r);}else{o.textContent="";var p=document.createElement("p");p.className="err";p.textContent=(r&&r.message)||"URL chưa đúng.";o.appendChild(p);}})'
    + '.withFailureHandler(function(e){b.disabled=false;o.textContent=String(e&&e.message||e);}).bdsLuuUrlMayChu(v);}'
    + BDS_KIT_SAVE_JS + 'if(RUN)call(RUN);';
  var html = BDS_KIT_CSS + '<div id="main">' + firstHtml + '</div><script>' + js + '</script>';
  SpreadsheetApp.getUi().showModalDialog(HtmlService.createHtmlOutput(html).setWidth(640).setHeight(700), title);
}

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

/** Địa chỉ mở app kèm địa chỉ máy chủ + vé: <app>/#/ket-noi?may_chu=<…/exec>&ma_cai=<vé> – Trợ lý tự điền, tự kiểm, không hỏi mã. */
function bdsKitOpenHref_(base, url) {
  if (!bdsKitExecUrl_(url)) return ''; // không có …/exec thật → không có link
  var tk = bdsKitSetupTicket_(null, false).tok;
  return String(base).replace(/\/+$/, '') + '/#/ket-noi?may_chu=' + encodeURIComponent(url) + (tk ? '&ma_cai=' + tk : '');
}
/**
 * R3 (18/11) VÉ CÀI ĐẶT: máy chủ CHƯA có tài khoản Chủ → người lạ biết địa chỉ /exec không được tạo tài khoản Chủ trước anh/chị.
 * Script Properties (cùng dự án với TatCa.gs): setup_token (vé dài, đi kèm nút kết nối – 1 chạm, không gõ gì) + setup_code (6 số, hiện TO
 * cạnh địa chỉ máy chủ). 20/11: GIỮ vé đang hợp lệ khi mở lại hộp thoại (trước: mỗi lần mở = vé mới → link khách đã mở ở trang cài đặt hết
 * hiệu lực, app hỏi mã); chỉ cấp mới khi chưa có / sai định dạng / đã nhập sai ≥ BDS_KIT_CODE_MAX lần (máy chủ khoá mã) / fresh = true.
 * Máy chủ đã có tài khoản → không cấp (setup() của máy chủ xoá vé sau khi tạo tài khoản). → {tok, code}
 */
function bdsKitSetupTicket_(props, fresh) {
  var p = props || PropertiesService.getScriptProperties();
  if (p.getProperty('setup_done') === '1') return { tok: '', code: '' };
  var tok = p.getProperty('setup_token') || '', code = p.getProperty('setup_code') || '';
  var locked = (Number(p.getProperty('setup_code_fails')) || 0) >= BDS_KIT_CODE_MAX;
  if (fresh || locked || !/^[a-f0-9]{32,64}$/.test(tok) || !/^\d{6}$/.test(code)) {
    var h = (Utilities.getUuid() + Utilities.getUuid()).replace(/[^a-f0-9]/gi, '').toLowerCase();
    // vé từ "Cài bằng Google" (CaiGoogle.gs – trang cài đặt giữ bản sao) giữ nguyên khi chỉ thiếu mã
    if (fresh || locked || !/^[a-f0-9]{32,64}$/.test(tok)) tok = h.slice(0, 48);
    code = ('00000' + (parseInt(h.slice(48, 56), 16) % 1000000)).slice(-6);
    p.setProperty('setup_token', tok); p.setProperty('setup_code', code); p.setProperty('setup_code_fails', '0');
  }
  return { tok: tok, code: code };
}
/**
 * Máy chủ ĐÃ KIỂM ĐẠT. Nút to (LUÔN mang vé): trang cài đặt (khách mới) / app riêng (đã biết). Ngay dưới: địa chỉ máy chủ + mã cài đặt TO,
 * không gấp (20/11: trước đây nằm trong <details> đóng). Không trang cài đặt, không app riêng → "Chép URL" là cách chính + ô địa chỉ app.
 * Bản bán không có link máy dựng 127.0.0.1:8765 (khách mới chưa cài máy dựng).
 */
function bdsKitUrlBlock_(url, appUrl) {
  var ex = 'tenkhach.' + (BDS_KIT_APP_DOMAIN || 'bdsstudio.app');
  var sc = bdsKitSetupTicket_(null, false).code;
  var pair = '<div class="pair"><div class="addr"><b>Địa chỉ máy chủ (kết thúc bằng /exec)</b>'
    + '<input class="url" id="u" readonly value="' + bdsKitEsc_(url) + '" onclick="this.select()">'
    + '<button data-ic="📋" onclick="var u=document.getElementById(\'u\');u.select();document.execCommand(\'copy\');this.textContent=\'Đã chép ✓\'">Chép URL</button></div>'
    + (sc ? '<div class="code"><div class="lbl">Mã cài đặt</div><div class="num">' + sc.slice(0, 3) + ' ' + sc.slice(3) + '</div></div>' : '') + '</div>'
    + (sc ? '<p class="note">Trang cài đặt hỏi <b>mã cài đặt</b> thì nhập 6 số này (chống người lạ dùng máy chủ của anh/chị). Bấm nút trên thì không phải nhập.</p>' : '')
    + '<p class="note">Cách dán tay: dán địa chỉ vào ô <b>"Địa chỉ máy chủ (kết thúc bằng /exec)"</b> ở bước <b>"Tạo máy chủ"</b> của Trợ lý cài đặt → <b>Kiểm tra bước này</b>. '
    + 'Máy khác đã có tài khoản: màn đăng nhập › <b>Đổi máy chủ kết nối</b>.</p>';
  var keep = '<p class="note">Giữ địa chỉ + mã này riêng tư. Dữ liệu nằm trong chính Sheet này, trong Google của anh/chị.</p>';
  var portal = appUrl ? '' : bdsKitNormAppUrl_(BDS_KIT_PORTAL_URL);
  if (portal) {
    return '<p>Bấm nút dưới – Trợ lý cài đặt tự nối máy chủ và mở màn đặt mật khẩu, không cần chép gì:</p>'
      + '<a class="big" data-ic="🚀" target="_blank" rel="noopener" href="' + bdsKitEsc_(bdsKitOpenHref_(portal, url)) + '">Quay lại trang cài đặt và kết nối</a>'
      + '<p class="note">Mở bằng đúng trình duyệt đang mở trang cài đặt ' + bdsKitEsc_(portal.replace(/^https:\/\//, '')) + '. App riêng của anh/chị được tạo ngay sau bước đặt mật khẩu.</p>'
      + pair + keep;
  }
  if (appUrl) {
    return '<p>Bấm nút dưới – app tự nối, không cần chép gì:</p>'
      + '<a class="big" data-ic="🚀" target="_blank" rel="noopener" href="' + bdsKitEsc_(bdsKitOpenHref_(appUrl, url)) + '">Mở BDS Studio và kết nối</a>'
      + '<p class="note">Địa chỉ app riêng của anh/chị: <b>' + bdsKitEsc_(appUrl.replace(/^https:\/\//, '')) + '</b></p>' + pair + keep;
  }
  return '<p><b>Bấm "Chép URL"</b> rồi dán vào Trợ lý cài đặt (trang BDS Studio đang mở):</p>' + pair
    + '<p class="note">Hoặc nhập <b>địa chỉ app riêng của anh/chị</b> (vd <b>' + bdsKitEsc_(ex) + '</b> – Trợ lý cài đặt ghi ở bước "Tạo máy chủ", dòng "Địa chỉ app của anh/chị") để lần sau có nút mở app tự nối:</p>'
    + '<input class="url" id="appu" placeholder="' + bdsKitEsc_(ex) + '" autocomplete="off">'
    + '<button class="alt" data-ic="💾" data-srv="' + bdsKitEsc_(url) + '" onclick="bdsSaveApp(this)">Lưu và mở BDS Studio</button><div id="appo"></div>' + keep;
}
/** Script của hộp thoại: nút "Lưu và mở" (ô địa chỉ app riêng) – tạo link bằng DOM, không chèn HTML từ máy chủ. */
var BDS_KIT_SAVE_JS = 'function bdsSaveApp(b){var v=document.getElementById("appu").value,o=document.getElementById("appo");b.disabled=true;o.textContent="Đang lưu…";'
  + 'google.script.run.withSuccessHandler(function(r){b.disabled=false;o.textContent="";if(r&&r.ok&&r.href&&r.href.indexOf("/#/ket-noi?may_chu=https")>0){var a=document.createElement("a");a.className="big";a.target="_blank";a.rel="noopener";'
  + 'a.href=r.href;a.setAttribute("data-ic","🚀");a.textContent="Mở BDS Studio và kết nối";o.appendChild(a);}else{var p=document.createElement("p");p.className=r&&r.ok?"note":"err";p.textContent=(r&&r.message)||"Địa chỉ chưa đúng.";o.appendChild(p);}})'
  + '.withFailureHandler(function(e){b.disabled=false;o.textContent=String(e&&e.message||e);}).bdsLuuDiaChiApp(v,b.getAttribute("data-srv"));}';

/**
 * 7 bước Triển khai – mỗi dòng 1 việc, tên nút đúng như Google hiện (Việt + Anh), có ảnh. 20/11: thêm bước Google hỏi quyền
 * (Uỷ quyền truy cập → chọn Gmail → Nâng cao → Đi tới … (không an toàn) → Cho phép) + 2 dòng vì sao Google cảnh báo.
 */
var BDS_KIT_WARN_WHY = 'Vì sao Google cảnh báo "chưa xác minh"? Đây là bản sao của CHÍNH anh/chị, nằm trong Drive của anh/chị – Google chỉ xác minh ứng dụng phát hành cho nhiều người.<br>'
  + 'Kiểm tra email Google hiện ra là email của anh/chị. Bên bán không xem được dữ liệu của anh/chị.';
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
    + '<li>Bấm <b>Triển khai</b> (Deploy) → <b>Uỷ quyền truy cập</b> (Authorize access) → chọn Gmail của anh/chị.</li>'
    + '<li><b>Nâng cao</b> (Advanced) → <b>Đi tới … (không an toàn)</b> (Go to … unsafe) → <b>Cho phép</b> (Allow).</li>'
    + '<li>Bấm <b>Xong</b> (Done) → quay lại tab Sheet này → bấm <b>Tôi đã triển khai xong</b>.</li>'
    + '</ol><p class="note">' + BDS_KIT_WARN_WHY + '</p>'
    + '<p class="note">Chỉ làm 1 lần. Workspace công ty không cho chọn "Bất kỳ ai": nhờ quản trị viên cho phép.</p>';
}
/** Chưa có máy chủ trả lời đúng → lý do (nếu đã thử 1 địa chỉ) + 7 bước + kiểm lại + dán URL (dự phòng). */
function bdsKitDeployHtml_(pr, justInstalled) {
  var why = pr && !pr.ok && pr.problem ? '<div class="warn"><b>⚠️ Chưa xong:</b> ' + pr.problem + '<br><b>Cách sửa:</b> ' + pr.fix + '</div>' : '';
  return '<h3>Bước cuối: Triển khai máy chủ (7 bước, 1 lần)</h3>'
    + (justInstalled ? '<p class="okline">✓ Đã tạo bảng, cột, hẹn giờ.</p>' : '') + why
    + '<p>Google cần anh/chị bấm <b>Triển khai → Tuỳ chọn triển khai mới (New deployment)</b> một lần:</p>'
    + bdsKitDeployStepsHtml_()
    + '<button data-ic="✅" onclick="again(this,\'bdsLayUrlJson\',SPIN_CHECK)">Tôi đã triển khai xong</button>' + BDS_KIT_CLOSE
    // dự phòng: Google chưa tự báo địa chỉ (getUrl() trả …/dev hoặc trống) → khách dán URL vừa "Sao chép" ở hộp Tuỳ chọn triển khai mới
    + '<details id="paste"><summary>Đã triển khai mà vẫn chưa thấy nút? Dán URL ứng dụng web vừa Sao chép</summary>'
    + '<input class="url" id="srvu" placeholder="https://script.google.com/macros/s/…/exec" autocomplete="off">'
    + '<button data-ic="🔗" onclick="paste(this)">Dùng URL này</button><div id="pout"></div></details>';
}

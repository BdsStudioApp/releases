import { isMissingAction } from './xkit.71d637c634.js';
import { collectBackup, allTablesXlsx, toB64 } from './backup_logic.81990d6dfc.js';
export const W = {
title: 'Sao lưu tự động lên Drive',
lead: 'Máy chủ tự chép toàn bộ Sheet dữ liệu vào thư mục "{f}" trên Google Drive của anh/chị (Chủ nhật, 2 giờ sáng).',
freq: 'Nhịp sao lưu tự động',
weekly: 'Hằng tuần (mỗi Chủ nhật)',
monthly: 'Hằng tháng (Chủ nhật đầu tháng)',
off: 'Tắt sao lưu tự động',
keep: 'Số bản giữ lại',
keep_n: '{n} bản gần nhất',
saved: 'Đã lưu tuỳ chọn sao lưu.',
last: 'Lần sao lưu tự động gần nhất: {d}',
never: 'Chưa có lần sao lưu tự động nào.',
off_warn: 'Đang tắt sao lưu tự động – nhớ sao lưu tay thường xuyên.',
xlsx: 'Xuất toàn bộ ra Excel lên Drive',
xlsx_lead: 'Một tệp Excel gồm khách, lịch sử chăm sóc, nhắc việc, chính sách, báo giá, dự án… (không gồm mật khẩu, khoá API).',
xlsx_warn: 'Tệp Excel KHÔNG mã hoá: ai mở được thư mục Drive này là đọc được toàn bộ khách. Không chia sẻ thư mục, xoá tệp cũ khi không cần. Khách đã xoá theo yêu cầu vẫn còn trong các tệp Excel đã xuất trước đó. Tiếp tục?',
xlsx_done: 'Đã lưu "{n}" vào thư mục "{f}" trên Drive (giữ {k} tệp Excel gần nhất).',
xlsx_last: 'Lần xuất Excel gần nhất: {d}',
waiting: 'Máy chủ chưa có chức năng này – cập nhật máy chủ ở Cài đặt › Cập nhật rồi thử lại.',
big: 'Dữ liệu quá lớn để gửi lên Drive (tối đa 25 MB) – dùng "Xuất Excel danh sách khách" hoặc "Tải tệp sao lưu về máy".',
};
const fill = (s, o = {}) => String(s).replace(/\{(\w+)\}/g, (_, k) => (o[k] == null ? '' : String(o[k])));
const _o0 = 25 * 1024 * 1024;
export async function buildExport(store, opts = {}) {
const _o1 = await collectBackup(store, opts);
const bytes = allTablesXlsx(_o1.tables);
return { b64: toB64(bytes), bytes: bytes.length, counts: _o1.counts };
}
export async function renderBackupOptions(box, { ui, api, store, config = {} }) {
const { h, button, field, toast } = ui;
let info;
try { info = await api.call('backup.config_get', {}); } catch (e) {
if (isMissingAction(e)) { box.append(h('h4', { class: 'section-title' }, W.title), h('p', { class: 'muted small' }, W.waiting)); return null; }
throw e;
}
info = info || {};
const lastEl = h('p', { class: 'muted small', 'data-testid': 'mnt-auto-last' });
const _o5 = h('p', { class: 'muted small', 'data-testid': 'mnt-xlsx-last' });
const _o2 = () => {
lastEl.textContent = info.freq === 'off' ? W.off_warn + (info.last_auto_at ? ' ' + fill(W.last, { d: ui.date(info.last_auto_at, true) }) : '')
: (info.last_auto_at ? fill(W.last, { d: ui.date(info.last_auto_at, true) }) : W.never);
_o5.textContent = info.last_xlsx_at ? fill(W.xlsx_last, { d: ui.date(info.last_xlsx_at, true) }) : '';
};
const _o4 = async (patch) => {
try { info = (await api.call('backup.config_set', patch)) || info; toast(W.saved, 'ok'); } catch (e) { toast(e.userMessage || e.message, 'error', 5000); }
_o2();
};
const freq = field({ label: W.freq, type: 'select', id: 'mnt-auto-freq', value: info.freq || 'weekly',
options: (info.freqs || ['weekly', 'monthly', 'off']).map((v) => ({ value: v, label: W[v] || v })), onChange: (v) => _o4({ freq: v }) });
const keep = field({ label: W.keep, type: 'select', id: 'mnt-auto-keep', value: String(info.keep || 8),
options: (info.keeps || [4, 8, 12]).map((n) => ({ value: String(n), label: fill(W.keep_n, { n }) })), onChange: (v) => _o4({ keep: Number(v) }) });
async function exportDrive() {
if (!(await ui.confirm(W.xlsx_warn, { ok: W.xlsx, kind: 'danger', title: W.xlsx }))) return;
const _o3 = await buildExport(store, { appVersion: config.APP_VERSION || '' });
if (_o3.b64.length > _o0) { toast(W.big, 'warn', 7000); return; }
try {
const d = await api.call('backup.export_xlsx', { b64: _o3.b64 });
info.last_xlsx_at = (d && d.at) || Date.now(); _o2();
toast(fill(W.xlsx_done, { n: d && d.name, f: (d && d.folder) || info.folder, k: (d && d.keep) || info.keep }), 'ok', 7000);
} catch (e) { toast(isMissingAction(e) ? W.waiting : (e.userMessage || e.message), 'error', 6000); }
}
box.append(h('h4', { class: 'section-title' }, W.title), h('p', { class: 'muted small' }, fill(W.lead, { f: info.folder || 'BDS Studio – Sao lưu' })),
freq, keep, lastEl,
h('p', { class: 'muted small' }, W.xlsx_lead),
h('div', { class: 'btn-row' }, button(W.xlsx, exportDrive, { kind: 'secondary', icon: 'cloud', testid: 'mnt-export-drive' })), _o5);
_o2();
return { info, exportDrive };
}
export default { renderBackupOptions, buildExport, W };

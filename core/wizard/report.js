import { scrubObject, scrubText, looksSecret } from './scrub.js';
import { stepsFor, FLOW_LABEL, CHECKLIST } from './steps.js';
import { progress } from './machine.js';
const _o0 = { ok: '✅', fail: '❌', skip: '⏭', later: '⏳' };
export const ROLE_VI = { owner: 'Chủ', manager: 'Quản lý', sale: 'Sale', ctv: 'Cộng tác viên' };
export const roleVi = (_o8) => ROLE_VI[String(_o8 || '').toLowerCase()] || String(_o8 || '');
const _o9 = (_o8) => (String(_o8 || '').toLowerCase() === 'owner' ? 'Quản trị (Admin)' : roleVi(_o8));
const _o2 = (ms) => { if (!ms) return '—'; const _o1 = new Date(ms); const _o7 = (_o5) => String(_o5).padStart(2, '0'); return _o7(_o1.getDate()) + '/' + _o7(_o1.getMonth() + 1) + '/' + _o1.getFullYear() + ' ' + _o7(_o1.getHours()) + ':' + _o7(_o1.getMinutes()); };
export function diagnosticData({ state, app = {}, env = {}, problems = [], last = {}, errors = [], engine = null, now = Date.now() } = {}) {
const flow = state && state.flow;
const steps = flow ? stepsFor(flow).map((s) => {
const _o8 = (state.res || {})[s.id];
const _o4 = last[s.id];
return { id: s.id, title: s.title, required: !!s.required, status: _o8 ? _o8.s : 'todo', msg: (_o8 && _o8.msg) || '', cause: (_o4 && _o4.cause) || '', fix: (_o4 && _o4.fix) || '' };
}) : [];
return scrubObject({
at: now, app: { version: app.version || '', mode: app.mode || '', server_version: app.server_version || '', server_host: app.server_host || '' },
flow: flow || '', current: (state && state.cur) || '', progress: state && state.flow ? progress(state) : null, demo: !!(state && state.demo),
browser: { ua: env.ua || '', online: env.online !== false, screen: env.screen || '', lang: env.lang || '' },
problems: problems.map((_o7) => ({ id: _o7.id, cause: _o7.cause })),
engine: engine ? { running: !!engine.running, version: engine.version || '', free_disk_gb: engine.free_disk_gb ?? '', os: engine.os_family || '' } : null,
steps,
errors: (errors || []).slice(-10).map((e) => ({ at: e.at, level: e.level, where: e.where, message: e.message }))
});
}
export function diagnosticText(data) {
const _o1 = data || {};
const L = [];
L.push('BÁO CÁO CÀI ĐẶT BDS STUDIO – ' + _o2(_o1.at));
L.push('(Không chứa mật khẩu, mã bot, khoá AI. Email/số điện thoại đã che bớt.)');
L.push('');
L.push('App: v' + ((_o1.app && _o1.app.version) || '?') + ' · chế độ ' + ((_o1.app && _o1.app.mode) || '?') + (_o1.app && _o1.app.server_version ? ' · máy chủ v' + _o1.app.server_version : '') + (_o1.app && _o1.app.server_host ? ' · ' + _o1.app.server_host : ''));
if (_o1.demo) L.push('⚠️ XEM THỬ – CHƯA CÀI THẬT (2 bước cài máy chủ đang bỏ qua, dữ liệu chỉ nằm trong trình duyệt)');
L.push('Luồng: ' + (FLOW_LABEL[_o1.flow] || 'chưa chọn') + (_o1.current ? ' · đang ở bước "' + _o1.current + '"' : '') + (_o1.progress ? ' · xong ' + _o1.progress.done + '/' + _o1.progress.total : ''));
L.push('Trình duyệt: ' + ((_o1.browser && _o1.browser.ua) || '?') + (_o1.browser && _o1.browser.online === false ? ' · ĐANG MẤT MẠNG' : '') + (_o1.browser && _o1.browser.screen ? ' · màn ' + _o1.browser.screen : ''));
if (_o1.engine) L.push('Máy dựng: ' + (_o1.engine.running ? 'đang chạy v' + _o1.engine.version + ' · ổ trống ' + _o1.engine.free_disk_gb + ' GB · ' + _o1.engine.os : 'không chạy'));
if (_o1.problems && _o1.problems.length) { L.push(''); L.push('Vấn đề của máy:'); for (const _o7 of _o1.problems) L.push('  ❌ ' + _o7.cause); }
if (_o1.steps && _o1.steps.length) {
L.push(''); L.push('Các bước:');
for (const s of _o1.steps) {
L.push('  ' + (_o0[s.status] || '▫️') + ' ' + s.title + (s.required ? ' (bắt buộc)' : '') + (s.msg ? ' – ' + s.msg : ''));
if (s.status === 'fail' && s.cause) L.push('      Nguyên nhân: ' + s.cause + (s.fix ? ' · Cách sửa: ' + s.fix : ''));
}
}
if (_o1.errors && _o1.errors.length) { L.push(''); L.push('Lỗi gần đây:'); for (const e of _o1.errors) L.push('  ' + _o2(e.at) + ' [' + e.level + '] ' + e.where + ': ' + e.message); }
let text = scrubText(L.join('\n'));
if (looksSecret(text)) text = text.split('\n').filter((_o4) => !looksSecret(_o4)).join('\n') + '\n(Đã bỏ 1 số dòng nghi chứa khoá.)';
return text;
}
export function handoverData({ state, company = {}, owner = {}, users = [], domain = '', versions = {}, check = null, license = null, now = Date.now() } = {}) {
const steps = state ? stepsFor(state.flow).filter((s) => s.id !== 'handover').map((s) => {
const _o8 = (state.res || {})[s.id];
return { title: s.title, status: _o8 ? _o8.s : 'todo', msg: (_o8 && _o8.msg) || '', required: !!s.required };
}) : [];
return {
at: now, date: new Date(now).toLocaleDateString('vi-VN'),
company: { name: String(company.name || ''), tax: String(company.tax || ''), logo: company.logo || '' },
owner: { username: String(owner.username || ''), full_name: String(owner.full_name || '') },
users: (users || []).map((_ob) => ({ username: _ob.username, full_name: _ob.full_name || '', role: _ob.role, role_label: _o9(_ob.role), tfa: _ob.tfa_on ? 'có' : (_ob.tfa_required ? 'bắt buộc – chưa có cách nhận mã' : 'không') })),
domain: String(domain || ''), versions: { web: versions.web || '', server: versions.server || '', engine: versions.engine || '' },
check: check ? { text: check.text || '', bad: Number(check.bad) || 0 } : null,
steps,
pending: steps.filter((s) => s.status !== 'ok').map((s) => s.title),
notDone: notDoneItems(state),
license: licenseLine(license, now),
notes: [
'Bên nhận đã đổi mật khẩu tài khoản Quản trị (Admin); bên cài đặt không giữ mật khẩu, mã bot, khoá AI của công ty.',
'Dữ liệu nằm trong tài khoản Google của công ty. Hết hạn bản quyền: ngừng cập nhật/chức năng mới, KHÔNG khoá dữ liệu.',
trialNote(license)
]
};
}
export function notDoneItems(state) {
if (!state || state.flow !== 'company') return [];
const _o1 = state.data || {}, res = state.res || {};
const ok = (id) => !!(res[id] && res[id].s === 'ok');
const _o6 = [];
if (!_o1.companyAccount) _o6.push('Máy chủ trong tài khoản Google công ty – email theo tên miền công ty (đang dùng thử bằng Gmail cá nhân)');
if (!ok('domain')) _o6.push(CHECKLIST.find((c) => c.id === 'domain').short);
if (!ok('telegram')) _o6.push(CHECKLIST.find((c) => c.id === 'telegram').short);
return _o6;
}
const dmy = (ms) => { const _o1 = new Date(Number(ms)); const _o7 = (_o5) => String(_o5).padStart(2, '0'); return _o7(_o1.getDate()) + '/' + _o7(_o1.getMonth() + 1) + '/' + _o1.getFullYear(); };
export function licenseLine(lic, now = Date.now()) {
if (!lic || !lic.enabled || !lic.state) return '';
const _oa = lic.state, exp = Number(_oa.exp) || 0;
const _o3 = lic.install_id ? ' · mã cài đặt ' + String(lic.install_id) : '';
if (_oa.kind === 'trial') return 'Dùng thử' + (exp ? ' đến hết ' + dmy(exp) + (exp > now ? ' (còn ' + Math.max(0, Math.ceil((exp - now) / 86400000)) + ' ngày)' : ' (đã hết)') : '') + _o3;
return 'Đã có mã bản quyền' + (exp ? ' đến ' + dmy(exp) : '') + _o3;
}
export function trialNote(lic) {
if (lic && lic.enabled === false) return 'Bản này không dùng bản quyền theo thời hạn.';
return 'Dùng thử 7 ngày tính từ lần đầu app mở sau khi tạo tài khoản Quản trị (ngày hết hạn ở dòng "Bản quyền" / Cài đặt › Bản quyền) – không tự tính lại theo ngày ký biên bản. '
+ 'Muốn tính từ ngày bàn giao: bên bán bấm "Bàn giao: tính dùng thử từ hôm nay" trên trang quản lý bản quyền' + (lic && lic.install_id ? ' (mã cài đặt ' + String(lic.install_id) + ')' : '') + '.';
}
export function handoverText(_o1) {
const L = [];
L.push('BIÊN BẢN BÀN GIAO CÀI ĐẶT BDS STUDIO');
L.push('Ngày: ' + _o1.date);
L.push('');
L.push('Bên nhận: ' + (_o1.company.name || '…') + ' · Mã số thuế: ' + (_o1.company.tax || '…'));
L.push('Tài khoản Quản trị (Admin): @' + (_o1.owner.username || '…') + (_o1.owner.full_name ? ' (' + _o1.owner.full_name + ')' : ''));
L.push('Địa chỉ mở app: ' + (_o1.domain || '…'));
L.push('Phiên bản: web ' + (_o1.versions.web || '?') + ' · máy chủ ' + (_o1.versions.server || '?') + (_o1.versions.engine ? ' · máy dựng ' + _o1.versions.engine : ''));
if (_o1.check) L.push('Kiểm tra toàn bộ: ' + _o1.check.text);
if (_o1.license) L.push('Bản quyền: ' + _o1.license);
L.push('');
L.push('Người dùng (' + _o1.users.length + '):');
for (const _ob of _o1.users) L.push('  @' + _ob.username + ' · ' + _ob.full_name + ' · ' + (_ob.role_label || roleVi(_ob.role)) + ' · 2 lớp: ' + _ob.tfa);
L.push('');
L.push('Các bước:');
for (const s of _o1.steps) L.push('  ' + (_o0[s.status] || '▫️') + ' ' + s.title + (s.msg ? ' – ' + s.msg : ''));
if (_o1.pending.length) { L.push(''); L.push('Còn để sau: ' + _o1.pending.join('; ')); }
if (_o1.notDone && _o1.notDone.length) { L.push(''); L.push('Chưa làm (cần trước khi dùng thật): ' + _o1.notDone.join('; ')); }
L.push('');
for (const _o5 of _o1.notes) L.push('• ' + _o5);
L.push('');
L.push('BÊN CÀI ĐẶT (ký, ghi rõ họ tên)                    BÊN NHẬN (ký, ghi rõ họ tên, đóng dấu)');
return L.join('\n');
}
export default { diagnosticData, diagnosticText, handoverData, handoverText, licenseLine, trialNote, notDoneItems, roleVi, ROLE_VI };

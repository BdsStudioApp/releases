export const FEATURES = [];
export function registerFeature(_o2) {
if (!_o2 || !/^[a-z][a-z0-9_]{1,30}$/.test(String(_o2.key || ''))) throw new Error('registerFeature: khoá sai');
const _o7 = { key: _o2.key, label: String(_o2.label || _o2.key), hint: String(_o2.hint || ''), modules: (_o2.modules || []).map(String) };
const _o3 = FEATURES.findIndex((y) => y.key === _o7.key);
if (_o3 >= 0) FEATURES[_o3] = _o7; else FEATURES.push(_o7);
return _o7;
}
registerFeature({ key: 'customers_all', label: 'Xem khách toàn công ty', hint: 'Tắt: chỉ thấy khách của mình.' });
registerFeature({ key: 'assign', label: 'Chia khách cho người khác' });
registerFeature({ key: 'erase', label: 'Xoá dữ liệu khách' });
registerFeature({ key: 'export', label: 'Xuất file danh sách khách' });
registerFeature({ key: 'video', label: 'Video', hint: 'Ý tưởng & Video AI, Nhân vật, Nhân vật dẫn, Nhân viên AI.', modules: ['ideas', 'characters', 'g5_dandan'] });
registerFeature({ key: 'ideas', label: 'Ý tưởng', hint: 'Nguồn ý tưởng nội dung (không cần quyền Video).', modules: ['ideas'] });
registerFeature({ key: 'catalog', label: 'Thông tin dự án', modules: ['catalog', 'g4_doitac'] });
registerFeature({ key: 'quote', label: 'Báo giá, khoản vay', modules: ['quote', 'loan', 'g1_banks'] });
registerFeature({ key: 'landing', label: 'Landing / phễu khách', modules: ['landing_builder', 'g3_ads', 'g3_docs', 'g3_events', 'g3_groups', 'g3_profile', 'g3_roi', 'g3_seo', 'trang_cua_toi'] });
registerFeature({ key: 'landing_publish', label: 'Tự tạo & đăng landing', hint: 'Tạo, sửa, đăng trang riêng; khách để lại số về thẳng người đó. Trang của người khác chỉ xem.' });
registerFeature({ key: 'ai', label: 'Dùng AI (soạn tin, tóm tắt…)' });
registerFeature({ key: 'lead_pool', label: 'Kho lead công ty', hint: 'Xem kho lead, nhập lead (Excel, landing công ty, khoá nhận khách chung).' });
registerFeature({ key: 'lead_push', label: 'Đẩy số (cấp / thu hồi lead)', hint: 'Trưởng nhóm có quyền này chỉ đẩy số cho nhóm mình.' });
registerFeature({ key: 'lead_report', label: 'Báo cáo nguồn lead' });
registerFeature({ key: 'project_edit', label: 'Thêm/sửa dự án (Thông tin dự án)', hint: 'Ghi bảng projects; cùng quyền AI thì dùng được "Để AI tìm thông tin dự án".' });
export const EXPERIMENTAL_STATUS = 'thu_nghiem';
export const EXPERIMENTAL_NOTE = '🧪 Thử nghiệm';
export const EXPERIMENTAL_HINT = 'Gói chứa phần này đang thử nghiệm – đã mở cho app này (Quản trị bật gói ở Cài đặt › Gói chức năng).';
export const EXPERIMENTAL_LOCKED_HINT = 'Gói chứa phần này đang thử nghiệm (Cài đặt › Gói chức năng › Yêu cầu trải nghiệm; khi có mã, bấm Nhập mã).';
let _o0 = new Set();
export function experimentalModulesOf(pack) {
const list = pack && Array.isArray(pack.packs) ? pack.packs : [];
return list.filter((p) => p && p.id !== 'core' && p.status === EXPERIMENTAL_STATUS).flatMap((p) => (Array.isArray(p.modules) ? p.modules.map(String) : []));
}
let _o1 = null;
export function setPackInfo(pack) {
_o0 = new Set(experimentalModulesOf(pack));
const _o5 = pack && Array.isArray(pack.modules) ? pack.modules.map((m) => String(typeof m === 'string' ? m : m && m.id)) : null;
_o1 = _o5 && _o5.length ? new Set(_o5) : null;
}
export function featureShipped(_o2, _o5 = _o1) {
const m = (_o2 && Array.isArray(_o2.modules)) ? _o2.modules : [];
return !_o5 || !m.length || m.some((_o7) => _o5.has(String(_o7)));
}
export function featureExperimental(_o2, _o5 = _o0) {
const m = (_o2 && Array.isArray(_o2.modules)) ? _o2.modules : [];
return m.length > 0 && m.every((_o7) => _o5.has(String(_o7)));
}
export function featureOf(moduleId) { return FEATURES.find((_o2) => _o2.modules.includes(moduleId)) || null; }
export function featureAllowed(moduleId, perms) {
if (!perms) return true;
const _o2 = featureOf(moduleId);
return !_o2 || perms[_o2.key] !== false;
}
export function screenPermitted(moduleIdsOnScreen, perms) {
const ids = (moduleIdsOnScreen || []).filter(Boolean);
return !ids.length || ids.some((id) => featureAllowed(id, perms));
}
export function diffPerms(chosen, preset, keys = FEATURES.map((_o2) => _o2.key)) {
const _o6 = {};
for (const _o4 of keys) if (chosen && typeof chosen[_o4] === 'boolean' && !!(preset || {})[_o4] !== chosen[_o4]) _o6[_o4] = chosen[_o4];
return _o6;
}
export default { featureShipped, FEATURES, registerFeature, featureOf, featureAllowed, screenPermitted, diffPerms, experimentalModulesOf, setPackInfo, featureExperimental, EXPERIMENTAL_NOTE, EXPERIMENTAL_HINT, EXPERIMENTAL_LOCKED_HINT };

export const FEATURES = [];
export function registerFeature(_o1) {
if (!_o1 || !/^[a-z][a-z0-9_]{1,30}$/.test(String(_o1.key || ''))) throw new Error('registerFeature: khoá sai');
const _o6 = { key: _o1.key, label: String(_o1.label || _o1.key), hint: String(_o1.hint || ''), modules: (_o1.modules || []).map(String) };
const _o2 = FEATURES.findIndex((y) => y.key === _o6.key);
if (_o2 >= 0) FEATURES[_o2] = _o6; else FEATURES.push(_o6);
return _o6;
}
registerFeature({ key: 'customers_all', label: 'Xem khách toàn công ty', hint: 'Tắt: chỉ thấy khách của mình.' });
registerFeature({ key: 'assign', label: 'Chia khách cho người khác' });
registerFeature({ key: 'erase', label: 'Xoá dữ liệu khách' });
registerFeature({ key: 'export', label: 'Xuất file danh sách khách' });
registerFeature({ key: 'video', label: 'Video', hint: 'Màn Video, Dựng & Sửa, Nhân vật, Lịch đăng, Video AI.', modules: ['video', 'studio', 'characters', 'staff', 'calendar', 'videoai_taocanh', 'g5_dandan'] });
registerFeature({ key: 'ideas', label: 'Ý tưởng', hint: 'Nguồn ý tưởng nội dung (không cần quyền Video).', modules: ['ideas'] });
registerFeature({ key: 'catalog', label: 'Bảng hàng dự án', modules: ['catalog', 'g1_layout', 'g1_research', 'g4_banggia', 'g4_congtruong', 'g4_doitac', 'g4_giohang', 'g4_giucho', 'g4_phaply'] });
registerFeature({ key: 'quote', label: 'Báo giá, khoản vay', modules: ['quote', 'loan', 'g1_banks', 'g1_policycalc', 'g1_tax'] });
registerFeature({ key: 'landing', label: 'Landing / phễu khách', modules: ['landing_builder', 'g3_ads', 'g3_docs', 'g3_events', 'g3_groups', 'g3_profile', 'g3_referral', 'g3_roi', 'g3_seo', 'trang_cua_toi'] });
registerFeature({ key: 'ai', label: 'Dùng AI (soạn tin, tóm tắt…)' });
registerFeature({ key: 'lead_pool', label: 'Kho lead công ty', hint: 'Xem kho lead, nhập lead (Excel, landing công ty, khoá nhận khách chung).' });
registerFeature({ key: 'lead_push', label: 'Đẩy số (cấp / thu hồi lead)', hint: 'Trưởng nhóm có quyền này chỉ đẩy số cho nhóm mình.' });
registerFeature({ key: 'lead_report', label: 'Báo cáo nguồn lead' });
registerFeature({ key: 'project_edit', label: 'Thêm/sửa dự án (Bảng hàng)', hint: 'Ghi bảng projects; cùng quyền AI thì dùng được "Để AI tìm thông tin dự án".' });
export const EXPERIMENTAL_STATUS = 'thu_nghiem';
export const EXPERIMENTAL_NOTE = '🧪 Thử nghiệm – sắp có';
export const EXPERIMENTAL_HINT = 'Gói chứa phần này đang thử nghiệm, chưa dùng được – khi gói sẵn sàng sẽ tick được.';
let _o0 = new Set();
export function experimentalModulesOf(pack) {
const list = pack && Array.isArray(pack.packs) ? pack.packs : [];
return list.filter((p) => p && p.id !== 'core' && p.status === EXPERIMENTAL_STATUS).flatMap((p) => (Array.isArray(p.modules) ? p.modules.map(String) : []));
}
export function setPackInfo(pack) { _o0 = new Set(experimentalModulesOf(pack)); }
export function featureExperimental(_o1, mods = _o0) {
const _o4 = (_o1 && Array.isArray(_o1.modules)) ? _o1.modules : [];
return _o4.length > 0 && _o4.every((_o6) => mods.has(String(_o6)));
}
export function featureOf(moduleId) { return FEATURES.find((_o1) => _o1.modules.includes(moduleId)) || null; }
export function featureAllowed(moduleId, perms) {
if (!perms) return true;
const _o1 = featureOf(moduleId);
return !_o1 || perms[_o1.key] !== false;
}
export function screenPermitted(moduleIdsOnScreen, perms) {
const ids = (moduleIdsOnScreen || []).filter(Boolean);
return !ids.length || ids.some((id) => featureAllowed(id, perms));
}
export function diffPerms(chosen, preset, keys = FEATURES.map((_o1) => _o1.key)) {
const _o5 = {};
for (const _o3 of keys) if (chosen && typeof chosen[_o3] === 'boolean' && !!(preset || {})[_o3] !== chosen[_o3]) _o5[_o3] = chosen[_o3];
return _o5;
}
export default { FEATURES, registerFeature, featureOf, featureAllowed, screenPermitted, diffPerms, experimentalModulesOf, setPackInfo, featureExperimental, EXPERIMENTAL_NOTE };

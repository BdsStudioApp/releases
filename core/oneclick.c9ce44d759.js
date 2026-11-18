export const WORDS = {
unofficial: 'Bản không chính thức – không được hỗ trợ/cập nhật',
unofficialHow: 'Mã máy chủ đang chạy không khớp bản đã ký số. Có thể mã đã bị sửa tay. Cài lại máy chủ từ kho phát hành chính thức (Cài đặt › Phiên bản › Cập nhật máy chủ) để được hỗ trợ và cập nhật.',
official: 'Bản chính thức',
unknown: 'Chưa kiểm được bản máy chủ'
};
export function shouldStartWizard(status, config = {}) {
if (!status || typeof status !== 'object') return false;
const _o1 = status.first_run === true || status.setup === false;
if (!_o1) return false;
const _o0 = status.edition || config.edition || 'owner';
if (_o0 === 'owner') return !!(config.FEATURES && config.FEATURES.wizard === true);
return true;
}
export function officialState(status, release, knownIds = []) {
const _o2 = status && status.build_id ? String(status.build_id) : '';
const signed = release && release.signed === true ? release : null;
const _o5 = signed && signed.release ? signed.release.gas_build_id : (signed && signed.gas_build_id) || null;
const _o3 = new Set([_o5, ...knownIds].filter(Boolean).map(String));
if (!_o2 || !_o3.size) return { state: 'unknown', label: WORDS.unknown };
const norm = (v) => String(v || '').trim().replace(/^v/i, '');
const _o4 = norm(status.version), rel = norm((signed.release && signed.release.parts && signed.release.parts.gas) || signed.gas);
if (_o4 && rel && _o4 !== rel && !_o3.has(_o2)) return { state: 'unknown', label: WORDS.unknown, reason: 'version' };
if (_o3.has(_o2)) return { state: 'official', label: WORDS.official };
return { state: 'unofficial', label: WORDS.unofficial, how: WORDS.unofficialHow };
}
export function copyLink(templateId) {
const _o2 = String(templateId || '').trim();
if (!/^[A-Za-z0-9_-]{20,}$/.test(_o2)) return '';
return 'https://docs.google.com/spreadsheets/d/' + _o2 + '/copy';
}
export default { WORDS, shouldStartWizard, officialState, copyLink };

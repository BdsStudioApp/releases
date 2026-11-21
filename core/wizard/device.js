import { platformOf } from '../a2hs.1403f674ce.js';
export function installDevice(nav = typeof navigator !== 'undefined' ? navigator : {}) {
const _o1 = nav || {};
const _o2 = platformOf(_o1);
if (!_o2) return '';
const _o3 = String(_o1.userAgent || '');
if (/iPad/i.test(_o3) || (/Macintosh/i.test(_o3) && Number(_o1.maxTouchPoints) > 1)) return 'tablet';
if (_o2 === 'android' && !/Mobile/i.test(_o3)) return 'tablet';
return 'phone';
}
export function installUrl({ portal = false, origin = '', _o0 = '' } = {}) {
if (portal && /^https?:\/\//.test(String(origin))) return String(origin).replace(/\/+$/, '') + '/';
return 'https://' + String(_o0 || 'cai.bdsstudio.app').replace(/^https?:\/\//, '').replace(/\/+$/, '') + '/';
}
export function needsPcText(url) {
const _o0 = String(url || '').replace(/^https?:\/\//, '').replace(/\/+$/, '') || 'cai.bdsstudio.app';
return 'Bước cài cần máy tính, khoảng 10–15 phút. Mở ' + _o0 + ' trên máy tính để cài; cài xong dùng app trên điện thoại bình thường.';
}
export const DEVICE_LABEL = { phone: 'điện thoại', tablet: 'máy tính bảng' };
export default { installDevice, installUrl, needsPcText, DEVICE_LABEL };

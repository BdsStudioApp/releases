export const DESKTOP_ONLY_TEXT = 'Chức năng này chỉ dùng trên máy tính (Windows/Mac). Anh/chị mở app trên máy tính để dùng.';
export const DESKTOP_ONLY_SHORT = 'Chỉ dùng trên máy tính';
const _o1 = /iPhone|iPod|iPad|Android|Mobile|Silk\/|Kindle|webOS|BlackBerry|BB10|IEMobile|Windows Phone|Opera Mini/i;
const _o0 = /^(Android|iOS|iPhone|iPad|iPod)/i;
export function isDesktop({ ua = '', platform = '', userAgentData = null, maxTouchPoints = 0 } = {}) {
const _o7 = userAgentData && typeof userAgentData === 'object' ? userAgentData : null;
if (_o7 && _o7.mobile === true) return false;
const _o5 = String(ua || '');
const _o4 = String((_o7 && _o7.platform) || platform || '');
if (_o1.test(_o5) || _o0.test(_o4) || /iPhone|iPad|iPod/i.test(String(platform || ''))) return false;
const _o6 = Number(maxTouchPoints) || 0;
if (/Win/i.test(_o4) || /Windows/i.test(_o5)) return true;
if (/Mac/i.test(_o4) || /Macintosh|Mac OS X/i.test(_o5)) return _o6 <= 1;
return _o6 === 0;
}
export function deviceKind(win = typeof globalThis !== 'undefined' ? globalThis : null) {
if (!win) return 'desktop';
const _o2 = win.__bdsDevice;
if (_o2 === 'mobile' || _o2 === 'desktop') return _o2;
const _o3 = win.navigator || {};
return isDesktop({ ua: _o3.userAgent, platform: _o3.platform, userAgentData: _o3.userAgentData, maxTouchPoints: _o3.maxTouchPoints }) ? 'desktop' : 'mobile';
}
export function desktopOnlyBlocked(manifest, kind) {
return !!(manifest && manifest.desktop_only === true) && kind === 'mobile';
}
export default { isDesktop, deviceKind, desktopOnlyBlocked, DESKTOP_ONLY_TEXT, DESKTOP_ONLY_SHORT };

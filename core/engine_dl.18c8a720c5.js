export const ENGINE_DOWNLOADS = {
windows: { os: 'windows', file: 'BDS_Studio_Video_Windows.zip', path: 'downloads/BDS_Studio_Video_Windows.zip', label: 'Windows' },
mac: { os: 'mac', file: 'BDS_Studio_Video_Mac.zip', path: 'downloads/BDS_Studio_Video_Mac.zip', label: 'Mac' }
};
export function detectOs(nav = (typeof navigator !== 'undefined' ? navigator : null)) {
if (!nav) return null;
const _o2 = String(nav.userAgent || '');
const _o3 = nav.userAgentData && typeof nav.userAgentData === 'object' ? nav.userAgentData : null;
if (_o3 && _o3.mobile === true) return 'mobile';
const _o1 = String((_o3 && _o3.platform) || nav.platform || '');
if (/iPhone|iPad|iPod|Android/i.test(_o1 + ' ' + _o2)) return 'mobile';
if (/^Mac/i.test(_o1) || /Macintosh|Mac OS X/i.test(_o2)) return Number(nav.maxTouchPoints) > 1 ? 'mobile' : 'mac';
if (/^Win/i.test(_o1) || /Windows/i.test(_o2)) return 'windows';
return null;
}
export function engineDownload(nav, pub = '') {
const os = detectOs(nav);
const _o0 = os === 'mac' ? 'mac' : 'windows';
const _o4 = (d) => ({ ...d, href: pub + d.path });
return { os, primary: _o4(ENGINE_DOWNLOADS[_o0]), other: _o4(ENGINE_DOWNLOADS[_o0 === 'mac' ? 'windows' : 'mac']), guessed: os !== 'windows' && os !== 'mac' };
}

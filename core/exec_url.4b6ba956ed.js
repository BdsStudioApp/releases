export const EXEC_URL_RE = /^https:\/\/script\.google\.com\/(?:macros|a\/macros\/[A-Za-z0-9.-]{2,253}|a\/[A-Za-z0-9.-]{2,253}\/macros)\/s\/[A-Za-z0-9_-]{20,}\/exec$/;
export function isExecUrl(_o4) { return EXEC_URL_RE.test(String(_o4 == null ? '' : _o4).trim()); }
export function execDeploymentId(_o4) {
const _o3 = String(_o4 == null ? '' : _o4).trim();
if (!EXEC_URL_RE.test(_o3)) return '';
return /\/s\/([A-Za-z0-9_-]{20,})\/exec$/.exec(_o3)[1];
}
export function serverFromInput(text) {
const _o2 = String(text == null ? '' : text).trim();
if (!_o2) return null;
if (isExecUrl(_o2)) return { url: _o2, ma: '' };
const _o0 = (_o4) => { try { return decodeURIComponent(_o4); } catch { return _o4; } };
const ma = _o0((/[?&#]ma=([^&#\s]+)/.exec(_o2) || [])[1] || '').replace(/[^A-Za-z0-9_-]/g, '');
const _o1 = /[?&#]may_chu=([^&#\s]+)/.exec(_o2);
if (_o1) { const _o4 = _o0(_o1[1]).trim(); if (isExecUrl(_o4)) return { url: _o4, ma }; }
const e = /https:\/\/script\.google\.com\/[^\s"'<>?#]+?\/exec(?=$|[\s"'<>?#])/.exec(_o2);
if (e && isExecUrl(e[0])) return { url: e[0], ma: '' };
return null;
}
export default { EXEC_URL_RE, isExecUrl, execDeploymentId, serverFromInput };

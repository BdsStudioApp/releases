export function parseCsp(text) {
const _o4 = {};
String(text || '').split(';').forEach((part) => {
const t = part.trim().split(/\s+/).filter(Boolean);
if (t.length) _o4[t[0].toLowerCase()] = t.slice(1);
});
return _o4;
}
export function cspAllows(cspText, directive, url, selfOrigin = '') {
if (!cspText) return true;
const _o0 = parseCsp(cspText);
const list = _o0[directive] || _o0['default-src'];
if (!list) return true;
let _o7;
try { _o7 = new URL(url, selfOrigin || undefined); } catch { return false; }
return list.some((src) => {
const _o6 = src.replace(/^'|'$/g, '').toLowerCase();
if (_o6 === 'none') return false;
if (_o6 === '*') return _o7.protocol === 'http:' || _o7.protocol === 'https:';
if (_o6 === 'self') return !!selfOrigin && _o7.origin === selfOrigin;
if (/^[a-z][a-z0-9+.-]*:$/.test(_o6)) return _o7.protocol === _o6;
const _o3 = _o6.match(/^(?:([a-z][a-z0-9+.-]*):\/\/)?(\*\.)?([^/:]+)(?::(\d+|\*))?(\/.*)?$/);
if (!_o3) return false;
const [, scheme, wild, host, port, path] = _o3;
if (scheme && _o7.protocol !== scheme + ':') return false;
if (!scheme && _o7.protocol !== 'https:' && !(selfOrigin.startsWith('http:') && _o7.protocol === 'http:')) return false;
const _o2 = _o7.hostname.toLowerCase();
if (wild ? !(_o2.endsWith('.' + host)) : _o2 !== host) return false;
const _o1 = _o7.protocol === 'https:' ? '443' : '80';
if (port && port !== '*' && (_o7.port || _o1) !== port) return false;
if (!port && _o7.port && _o7.port !== _o1) return false;
if (path && !(path.endsWith('/') ? _o7.pathname.startsWith(path) : _o7.pathname === path)) return false;
return true;
});
}
export async function currentCsp() {
try {
const _o5 = await fetch(location.pathname || '/', { method: 'HEAD', cache: 'no-store' });
return _o5.headers.get('content-security-policy') || '';
} catch { return ''; }
}

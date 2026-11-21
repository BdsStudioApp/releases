export const DEFAULT_LOGO = 'assets/icon.svg';
const _o0 = 'bds.brand';
const _o1 = /^brand-logo\.(png|jpg|webp)$/;
export function cleanBrand(b) {
if (!b || typeof b !== 'object') return null;
const name = typeof b.name === 'string' ? b.name.replace(/\s+/g, ' ').trim().slice(0, 80) : '';
const _o6 = name && !/[<>"`\\]/.test(name) ? name : '';
const logo = typeof b.logo === 'string' && _o1.test(b.logo) ? b.logo : '';
return _o6 || logo ? { name: _o6, logo } : null;
}
function _o8() {
try { const _o9 = JSON.parse(localStorage.getItem(_o0) || 'null'); return cleanBrand(_o9); } catch { return null; }
}
function _oa(b) {
try { if (b) localStorage.setItem(_o0, JSON.stringify(b)); else localStorage.removeItem(_o0); } catch { }
}
let _o2 = _o8();
export function brandLogo() { return (_o2 && _o2.logo) || DEFAULT_LOGO; }
export function brandName(fallback) { return (_o2 && _o2.name) || fallback; }
export function hasBrand() { return !!_o2; }
export function applyBrand(root = (typeof document !== 'undefined' ? document : null)) {
if (!root || !root.querySelectorAll) return;
for (const _o4 of root.querySelectorAll('img[data-brand-logo]')) _o4.setAttribute('src', brandLogo());
for (const _o3 of root.querySelectorAll('[data-brand-name]')) _o3.textContent = brandName(_o3.getAttribute('data-brand-default') || _o3.textContent);
}
export async function refreshBrand({ fetchFn = (u, o) => fetch(u, o), loc = (typeof location !== 'undefined' ? location : null) } = {}) {
if (!(loc && loc.protocol === 'https:' && !/^(127\.0\.0\.1|localhost)$/.test(loc.hostname))) return _o2;
let next = null;
try {
const _o7 = await fetchFn('instance.json', { cache: 'no-store' });
if (!_o7 || !_o7.ok) return _o2;
const _o5 = await _o7.json();
next = cleanBrand(_o5 && _o5.brand);
} catch { return _o2; }
if (JSON.stringify(next) !== JSON.stringify(_o2)) { _o2 = next; _oa(next); applyBrand(); }
return _o2;
}
export function _setBrandForTest(b) { _o2 = cleanBrand(b); }

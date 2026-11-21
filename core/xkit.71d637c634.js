import { t, has, addWords } from './i18n.17f01a0b54.js';
export function fold(s) {
return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
.toLowerCase().replace(/\s+/g, ' ').trim();
}
export function addDefaults(dict) {
const _o1 = {};
for (const [k, _o6] of Object.entries(dict || {})) if (!has(k)) _o1[k] = _o6;
addWords(_o1);
}
export function words(key) {
if (!has(key)) return [];
return String(t(key)).split('\n').map((s) => s.trim()).filter(Boolean);
}
export function word(key, vars) { return has(key) ? t(key, vars) : ''; }
export function uid(prefix = '') { return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
export function ensureCss(href, id) {
if (typeof document === 'undefined' || document.getElementById(id)) return;
const _o3 = document.createElement('link'); _o3.id = id; _o3.rel = 'stylesheet'; _o3.href = href;
document.head.appendChild(_o3);
}
export function download(name, data, mime = 'text/plain;charset=utf-8') {
const _o2 = data instanceof Blob ? data : new Blob([data], { type: mime });
const _o5 = URL.createObjectURL(_o2);
const _o0 = document.createElement('a'); _o0.href = _o5; _o0.download = name; _o0.rel = 'noopener';
document.body.appendChild(_o0); _o0.click(); _o0.remove();
setTimeout(() => URL.revokeObjectURL(_o5), 4000);
}
export function isMissingAction(e) { return !!e && (e.code === 'NOT_FOUND' || e.code === 'BAD_INPUT' || e.code === 'UNKNOWN_ACTION'); }
export const ls = {
get(k, d) { try { const _o6 = localStorage.getItem(k); return _o6 == null ? d : JSON.parse(_o6); } catch { return d; } },
set(k, _o6) { try { if (_o6 == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(_o6)); } catch { } return _o6; }
};
export function dmy(ms) {
const d = new Date(Number(ms)); const _o4 = (x) => String(x).padStart(2, '0');
return _o4(d.getDate()) + '/' + _o4(d.getMonth() + 1);
}
export default { fold, addDefaults, words, word, uid, ensureCss, download, isMissingAction, ls, dmy };

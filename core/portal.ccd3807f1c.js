import { portalHost } from './wizard/provision.js';
import { EXEC_URL_RE } from './exec_url.4b6ba956ed.js';
export const PORTAL_IDLE_MS = 6 * 3600000;
export const LAST_KEY = 'bds:portal:last';
export const HANDOFF_KEY = 'bds:wizard:handoff';
export const CLEAR_ROUTE = '#/xoa-tam';
export function isPortal(config = {}, loc = (typeof location !== 'undefined' ? location : null)) {
const P = config && config.PORTAL;
if (P === true) return true;
if (!P || !loc) return false;
const host = (typeof P === 'object' && P.host) || (typeof P === 'string' ? P : '');
return !!host && String(loc.hostname || '').toLowerCase() === String(host).toLowerCase();
}
export const clearUrl = (config = {}) => 'https://' + portalHost(config) + '/' + CLEAR_ROUTE;
const _ob = (fn, d) => { try { return fn(); } catch { return d; } };
export async function clearPortalData(deps = {}) {
const _o1 = globalThis;
const local = 'local' in deps ? deps.local : _ob(() => _o1.localStorage, null);
const session = 'session' in deps ? deps.session : _ob(() => _o1.sessionStorage, null);
const idb = 'idb' in deps ? deps.idb : _ob(() => _o1.indexedDB, null);
const _o0 = 'caches' in deps ? deps.caches : _ob(() => _o1.caches, null);
const sw = 'sw' in deps ? deps.sw : _ob(() => _o1.navigator && _o1.navigator.serviceWorker, null);
const _o6 = { ls: 0, ss: 0, dbs: 0, caches: 0 };
if (local) { _o6.ls = _ob(() => local.length, 0); _ob(() => local.clear()); }
if (session) { _o6.ss = _ob(() => session.length, 0); _ob(() => session.clear()); }
if (idb) {
let names = ['bds'];
try { if (typeof idb.databases === 'function') names = [...new Set([...names, ...((await idb.databases()) || []).map((d) => d && d.name).filter(Boolean)])]; } catch { }
await Promise.all(names.map((n) => new Promise((res) => { try { const _o8 = idb.deleteDatabase(n); _o8.onsuccess = _o8.onerror = _o8.onblocked = () => res(); setTimeout(res, 3000); } catch { res(); } })));
_o6.dbs = names.length;
}
if (_o0) { try { const keys = await _o0.keys(); await Promise.all(keys.map((k) => _o0.delete(k))); _o6.caches = keys.length; } catch { } }
if (sw && typeof sw.getRegistrations === 'function') { try { for (const _o8 of await sw.getRegistrations()) await _o8.unregister(); } catch { } }
return _o6;
}
export async function portalGuard({ config = {}, loc, now = Date.now(), local, clear = clearPortalData, every = 300000 } = {}) {
if (!isPortal(config, loc)) return false;
const _oc = local !== undefined ? local : _ob(() => globalThis.localStorage, null);
const _o3 = Number(_ob(() => _oc && _oc.getItem(LAST_KEY), 0)) || 0;
let _od = false;
if (_o3 && now - _o3 > PORTAL_IDLE_MS) { await clear(); _od = true; }
_ob(() => _oc && _oc.setItem(LAST_KEY, String(now)));
if (every && typeof setInterval !== 'undefined') setInterval(() => _ob(() => _oc && _oc.setItem(LAST_KEY, String(Date.now()))), every);
return _od;
}
const EXEC_RE = EXEC_URL_RE;
export function parseConnectHash(hash) {
const _o4 = /^#\/ket-noi\?(.*)$/.exec(String(hash || ''));
if (!_o4) return null;
let _o7;
try { _o7 = new URLSearchParams(_o4[1]); } catch { return null; }
const url = String(_o7.get('may_chu') || '').trim();
const dom = String(_o7.get('ten_mien') || '').trim().toLowerCase();
return { url: EXEC_RE.test(url) ? url : '', fromPortal: _o7.get('tu') === 'cai', flow: _o7.get('luong') === 'company' ? 'company' : 'personal',
domain: /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/.test(dom) ? dom : '' };
}
export function saveHandoff(h, session = _ob(() => globalThis.sessionStorage, null)) {
_ob(() => session && session.setItem(HANDOFF_KEY, JSON.stringify({ flow: h.flow, domain: h.domain || '', at: Date.now() })));
}
export function takeHandoff(session = _ob(() => globalThis.sessionStorage, null), now = Date.now()) {
const _o9 = _ob(() => session && session.getItem(HANDOFF_KEY), null);
_ob(() => session && session.removeItem(HANDOFF_KEY));
let _o2 = null;
try { _o2 = JSON.parse(_o9 || 'null'); } catch { _o2 = null; }
if (!_o2 || !['personal', 'company'].includes(_o2.flow) || !(now - Number(_o2.at) < 3600000)) return null;
return { flow: _o2.flow, domain: String(_o2.domain || '') };
}
export async function renderClearPage(root, { clear = clearPortalData } = {}) {
const _o8 = await clear();
root.className = 'app app-auth';
root.innerHTML = '';
const _o5 = document.createElement('main'); _o5.className = 'auth';
const card = document.createElement('div'); card.className = 'auth-card'; card.setAttribute('data-testid', 'portal-cleared');
const h = document.createElement('h1'); h.textContent = 'Đã xoá dữ liệu tạm trên trang cài đặt';
const p = document.createElement('p'); p.textContent = 'Trình duyệt này không còn giữ gì của lần cài đặt (địa chỉ máy chủ, phiên đăng nhập, bộ đệm). Dữ liệu của anh/chị vẫn nằm nguyên trong Google của anh/chị và trong app riêng.';
const _oa = document.createElement('p'); _oa.className = 'muted small'; _oa.textContent = 'Đã xoá: ' + (_o8.ls + _o8.ss) + ' mục lưu tạm, ' + _o8.dbs + ' kho dữ liệu, ' + _o8.caches + ' bộ đệm. Có thể đóng thẻ này.';
card.append(h, p, _oa); _o5.append(card); root.append(_o5);
return _o8;
}
export default { isPortal, clearUrl, clearPortalData, portalGuard, parseConnectHash, saveHandoff, takeHandoff, renderClearPage, PORTAL_IDLE_MS, HANDOFF_KEY, CLEAR_ROUTE };

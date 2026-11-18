import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as U from '../g1_lib/ui.js';
const _o1 = 'bds.g1.guest', LS_PIN = 'bds.g1.guest_pin', LS_FAIL = 'bds.g1.guest_fail', LS_LOCK = 'bds.g1.guest_lock';
const ls = { get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } }, set(k, _ot) { try { localStorage.setItem(k, JSON.stringify(_ot)); } catch { } } };
async function _op(text) {
try {
const _o3 = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
return [...new Uint8Array(_o3)].map((_ou) => _ou.toString(16).padStart(2, '0')).join('');
} catch {
let _ou = 0x811c9dc5; for (let _ol = 0; _ol < 2000; _ol++) for (let _od = 0; _od < text.length; _od++) { _ou ^= text.charCodeAt(_od) + _ol; _ou = Math.imul(_ou, 16777619) >>> 0; }
return 'f' + _ou.toString(16);
}
}
const _oc = () => { const _oj = ls.get(LS_PIN); return !!(_oj && _oj.hash); };
export const guestOn = () => !!(ls.get(_o1) || {}).on;
async function _o8(pin) { const _oj = ls.get(LS_PIN); return !!_oj && (await _op(_oj.salt + ':' + pin)) === _oj.hash; }
async function _on(pin) { const salt = Math.random().toString(36).slice(2) + Date.now().toString(36); ls.set(LS_PIN, { salt, hash: await _op(salt + ':' + pin) }); }
const _of = new Set();
let _o5 = null;
export function packOn(c = _o5) {
const _oj = c && c.packs;
if (!_oj || typeof _oj.moduleOn !== 'function') return !!c;
try { return !!_oj.moduleOn('g1_guest'); } catch { return false; }
}
const _o2 = () => guestOn() && packOn();
function _or() {
if (typeof document === 'undefined') return;
document.querySelectorAll('.g1-guest-fab, .g1-guest-bar').forEach((_ou) => _ou.remove());
if (document.documentElement.dataset.g1Guest) delete document.documentElement.dataset.g1Guest;
if (guestOn()) ls.set(_o1, { on: 0 });
if (apply.last) { apply.last = false; _of.forEach((f) => { try { f(false); } catch { } }); }
}
function apply() {
if (typeof document === 'undefined') return;
if (!packOn()) { _or(); return; }
const on = guestOn();
document.documentElement.dataset.g1Guest = on ? '1' : '0';
const _o4 = document.querySelector('.g1-guest-bar');
if (on && !_o4) document.body.appendChild(h('div', { class: 'g1-guest-bar', 'data-testid': 'g1-guest-bar', role: 'status' }, '👁 Chế độ khách xem – đã ẩn thông tin nội bộ'));
if (!on && _o4) _o4.remove();
const _ob = document.querySelector('.g1-guest-fab');
if (_ob && _ob.dataset.on !== String(on)) { _ob.dataset.on = String(on); _ob.replaceChildren(h('span', { 'aria-hidden': 'true' }, on ? '🔓' : '👁'), h('span', { class: 'g1-fab-l' }, on ? ' Mở khoá' : ' Khách xem')); _ob.setAttribute('aria-pressed', String(on)); _ob.setAttribute('aria-label', on ? 'Mở khoá chế độ khách xem' : 'Bật chế độ khách xem'); }
if (on && G.guestBlocked(location.hash)) location.hash = '#/sales';
if (apply.last !== on) { apply.last = on; _of.forEach((f) => { try { f(on); } catch { } }); }
}
function _oo(_ot) { ls.set(_o1, _ot ? { on: 1, at: Date.now() } : { on: 0 }); apply(); }
function _ok(mode) {
return new Promise((res) => {
const pin = h('input', { type: 'password', inputmode: 'numeric', autocomplete: 'off', maxlength: 8, 'data-testid': 'g1-pin', style: 'min-height:44px;font-size:1.3rem;letter-spacing:.3em;text-align:center;width:100%;box-sizing:border-box;border-radius:10px;border:1px solid #ccc' });
const pin2 = mode === 'set' ? h('input', { type: 'password', inputmode: 'numeric', autocomplete: 'off', maxlength: 8, 'data-testid': 'g1-pin2', placeholder: 'Nhập lại', style: pin.getAttribute('style') }) : null;
const err = h('div', { role: 'alert', 'data-testid': 'g1-pin-err', style: 'color:#B3261E;min-height:1.2em' });
const _o9 = (_ot) => { _oi.remove(); res(_ot); };
const ok = async () => {
const _ot = pin.value.trim();
if (!G.pinValid(_ot)) { err.textContent = 'Mã PIN gồm 4–8 chữ số.'; return; }
if (mode === 'set') { if (_ot !== pin2.value.trim()) { err.textContent = 'Hai lần nhập không khớp.'; return; } await _on(_ot); _o9(true); return; }
const _og = G.pinLock(ls.get(LS_FAIL), Date.now());
if (_og.locked) { err.textContent = `Nhập sai nhiều lần – thử lại sau ${_og.wait} giây.`; return; }
if (await _o8(_ot)) { ls.set(LS_FAIL, { fails: 0, until: 0 }); _o9(true); return; }
ls.set(LS_FAIL, G.pinFail(ls.get(LS_FAIL), Date.now()));
pin.value = ''; err.textContent = 'Mã PIN không đúng.';
};
const _o7 = (ic, t, f, primary, tid) => h('button', { type: 'button', 'data-testid': tid, onclick: f, style: `min-height:44px;padding:0 18px;border-radius:12px;font:inherit;cursor:pointer;border:1px solid #0F1E33;${primary ? 'background:#0F1E33;color:#fff' : 'background:transparent;color:inherit'}` }, h('span', { class: 'emoji', 'aria-hidden': 'true' }, ic), ' ' + t);
const _oi = h('div', { class: 'bds-overlay bds-center', style: 'position:fixed;inset:0;z-index:1000;background:rgba(15,30,51,.55);display:flex;align-items:center;justify-content:center;padding:16px' },
h('div', { role: 'dialog', 'aria-label': 'Mã PIN', 'data-testid': 'g1-pin-dialog', style: 'background:var(--card,#fff);color:inherit;border-radius:18px;padding:18px;max-width:340px;width:100%;display:flex;flex-direction:column;gap:10px;box-shadow:0 10px 40px rgba(0,0,0,.3)' },
h('h3', { style: 'margin:0' }, mode === 'set' ? 'Đặt mã PIN mở khoá' : 'Nhập mã PIN để mở khoá'),
h('p', { style: 'margin:0;font-size:.9em;opacity:.8' }, mode === 'set' ? 'Dùng để thoát chế độ khách xem. Mã chỉ lưu trên máy này.' : 'Thông tin nội bộ đang ẩn với khách. Quên mã: bấm 🔒 khoá app rồi nhập lại mật khẩu tài khoản.'),
pin, pin2, err, h('div', { style: 'display:flex;gap:8px;justify-content:flex-end' }, _o7('✕', 'Huỷ', () => _o9(false), false, 'g1-pin-cancel'), _o7('✓', 'Xác nhận', ok, true, 'g1-pin-ok'))));
pin.addEventListener('keydown', (e) => { if (e.key === 'Enter') ok(); });
_oi.addEventListener('keydown', (e) => { if (e.key === 'Escape') _o9(false); });
document.body.appendChild(_oi);
setTimeout(() => pin.focus(), 30);
});
}
export async function toggleGuest() {
if (!guestOn()) {
if (!_oc() && !(await _ok('set'))) return false;
_oo(true); return true;
}
if (await _ok('unlock')) { _oo(false); return true; }
return false;
}
function _oe() {
if (typeof window === 'undefined' || window.__g1GuestInstalled) return;
window.__g1GuestInstalled = true;
U.ensureGuestCss();
window.addEventListener('hashchange', () => { if (_o2() && G.guestBlocked(location.hash)) location.hash = '#/sales'; });
window.addEventListener('storage', (e) => { if (e.key === _o1) apply(); });
window.addEventListener('keydown', (e) => { if (_o2() && (e.ctrlKey || e.metaKey) && String(e.key).toLowerCase() === 'k') { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
const _os = () => {
if (!packOn()) { _or(); return; }
const _oq = document.querySelector('.nav, .topbar');
let _ob = document.querySelector('.g1-guest-fab');
if (_oq && !_ob) {
_ob = h('button', { type: 'button', class: 'g1-guest-fab', 'data-testid': 'g1-guest-fab', title: 'Chế độ khách xem: ẩn hoa hồng, giá nét, ghi chú nội bộ', onclick: () => toggleGuest() });
document.body.appendChild(_ob);
} else if (!_oq && _ob) _ob.remove();
const locked = !!document.querySelector('#app.is-locked, [data-testid="lock-form"]');
if (locked && guestOn()) ls.set(LS_LOCK, 1);
else if (!locked && _oq && ls.get(LS_LOCK)) { ls.set(LS_LOCK, 0); if (guestOn()) _oo(false); }
apply();
};
_os();
setInterval(_os, 1500);
try { const _oj = _o5 && _o5.packs; if (_oj && typeof _oj.on === 'function') _oj.on(() => _os()); } catch { }
}
export function bind(ctx) {
if (!ctx || typeof ctx !== 'object') return;
_o5 = ctx;
_oe();
}
export async function mount(el, ctx) {
bind(ctx);
S.ensureSalesCss(); U.ensureCss();
const _o0 = kit(ctx);
const _om = h('div', { class: 'sl g1', 'data-testid': 'g1-guest' });
el.innerHTML = ''; el.appendChild(_om);
const _o6 = h('div', { class: 'sl-col' });
_om.append(U.title('Chế độ khách xem'),
h('p', { class: 'g1-lead' }, 'Đưa máy cho khách xem bảng hàng, báo giá mà không lộ thông tin nội bộ. Bật bằng một chạm (nút "👁 Khách xem" góc màn hình), mở lại bằng mã PIN.'), _o6);
function _oa() {
const on = guestOn();
_o6.replaceChildren(
h('div', { class: on ? 'g1-warn' : 'g1-okbox', 'data-testid': 'g1-guest-state' }, on ? 'Đang ở chế độ khách xem.' : 'Đang hiện đầy đủ thông tin nội bộ.'),
h('div', { class: 'sl-row' },
_o0.button(on ? '🔓 Mở khoá (nhập PIN)' : '👁 Bật chế độ khách xem', async () => { await toggleGuest(); _oa(); }, { kind: 'primary', testid: 'g1-guest-toggle' }),
!on ? _o0.button(_oc() ? 'Đổi mã PIN' : 'Đặt mã PIN', async () => {
if (_oc() && !(await _ok('unlock'))) return;
if (await _ok('set')) _o0.toast('Đã lưu mã PIN trên máy này.', 'ok');
_oa();
}, { testid: 'g1-guest-pin', icon: 'key' }) : null),
h('div', { class: 'sl-box' }, h('h3', null, 'Khi bật sẽ ẩn'), h('ul', null,
h('li', null, 'Hoa hồng, giá nét, ghi chú nội bộ ở mọi màn (ô có nhãn 🔒 Nội bộ)'),
h('li', null, 'Ghi chú của khách hàng'),
h('li', null, 'Các màn Bảng tin, Khách hàng, Chờ duyệt, Cài đặt (có thông tin khách khác) – chỉ còn Bán hàng và Video'),
h('li', null, 'Trong Bán hàng: màn Theo dõi chính sách, ô chọn khách và danh sách báo giá đã gửi (có tên, SĐT khách)'),
h('li', null, 'Menu tài khoản, ô "Hỏi app" (tìm được tên, SĐT khách)'))),
h('p', { class: 'g1-legal' }, 'Mã PIN lưu dạng băm trên máy này; nhập sai 5 lần khoá 60 giây. Quên mã: bấm nút khoá 🔒 trên thanh trên rồi nhập lại mật khẩu tài khoản – chế độ khách tự tắt, vào đây đặt mã mới.'));
}
_oa();
const _oh = (_ot) => { if (!_om.isConnected) { _of.delete(_oh); return; } _oa(); };
_of.add(_oh);
return _om;
}
export default {
manifest: { id: 'g1_guest', title: 'Chế độ khách xem', icon: '👁', screen: 'sales', order: 150, version: '0.1.0', status: 'ready',
help: 'Một chạm ẩn hoa hồng, giá nét, ghi chú nội bộ và các màn có dữ liệu khách; mở lại bằng mã PIN.' },
mount,
async selftest(ctx) { bind(ctx); return G.guestBlocked('#/customers') && !G.guestBlocked('#/sales/quote') ? { ok: true } : { ok: false, details: 'Chặn màn sai' }; },
};

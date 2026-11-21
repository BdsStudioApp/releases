import { ls } from './xkit.71d637c634.js';
import * as A from './a2hs.1403f674ce.js';
export const SEEN_KEY = A.DONE_KEY;
export const MAX_SHOWS = A.MAX_SHOWS;
export const TEXT = {
title: A.TITLE,
ios: A.stepText(A.STEPS.ios[1]) + ' ' + A.stepText(A.STEPS.ios[2]) + ' ' + A.stepText(A.STEPS.ios[3]),
android: A.stepText(A.STEPS.android[1]) + ' ' + A.stepText(A.STEPS.android[2]) + ' ' + A.stepText(A.STEPS.android[3]),
install: 'Cài ngay',
done: 'Đã làm xong',
later: 'Để sau',
never: 'Không nhắc nữa'
};
export const platformOf = A.platformOf;
export const isStandalone = A.isStandalone;
export function shouldShow({ nav, win, rec, setupDone = true, hasCustomer = true } = {}) { return !!hasCustomer && A.shouldShowHint({ nav, win, rec, setupDone }); }
const _o0 = /^(mau_|demo)/;
export function realCustomerCount(rows) {
return (Array.isArray(rows) ? rows : []).filter((r) => r && typeof r === 'object' && !Number(r.deleted) && (!r.kind || r.kind === 'customer')
&& !_o0.test(String(r.id || '')) && !/^demo-/.test(String(r.lead_ref || ''))).length;
}
export const ONE_LINE = '📲 Cài app ra màn hình chính';
export function installPwaHint({ ui, nav, win, store = ls, setupDone = true, hasCustomer = true, now = Date.now() } = {}) {
const _o2 = nav || (typeof navigator !== 'undefined' ? navigator : {});
const _o5 = win || (typeof window !== 'undefined' ? window : {});
const rec = store.get(SEEN_KEY, null);
if (A.platformOf(_o2) && A.isStandalone(_o5)) { if (!A.readRec(rec).done) store.set(SEEN_KEY, { ...A.markDone(rec, now), installed: 1 }); return null; }
if (!shouldShow({ nav: _o2, win: _o5, rec, setupDone, hasCustomer })) return null;
store.set(SEEN_KEY, { ...A.afterShow(rec, now), platform: A.platformOf(_o2) });
const { h } = ui;
let _o3 = true;
const card = A.a2hsCard(ui, { compact: true, nav: _o2, win: _o5, appUrl: A.appUrlFor(), testid: 'pwa-hint-card',
onDone: () => { store.set(SEEN_KEY, A.markDone(store.get(SEEN_KEY, null))); close(); },
onLater: () => close(),
onNever: () => { store.set(SEEN_KEY, A.markNever(store.get(SEEN_KEY, null))); close(); } });
const x = h('button', { type: 'button', class: 'pwa-hint-x', 'aria-label': 'Đóng gợi ý', title: 'Không nhắc nữa trên máy này', 'data-testid': 'pwa-hint-x',
onclick: () => { store.set(SEEN_KEY, A.markNever(store.get(SEEN_KEY, null))); close(); } }, ui.icon ? ui.icon('close', 20) : '×');
const _o1 = h('button', { type: 'button', class: 'btn btn-secondary btn-sm pwa-hint-more', 'aria-expanded': 'false', 'data-testid': 'pwa-hint-more',
onclick: () => { el.classList.add('is-open'); _o1.setAttribute('aria-expanded', 'true'); } }, ui.icon ? ui.icon('next', 18) : null, h('span', null, ONE_LINE));
const el = h('aside', { class: ['pwa-hint', 'is-compact'], role: 'note', 'aria-label': TEXT.title, 'data-testid': 'pwa-hint', dataset: { platform: A.platformOf(_o2), shows: String(A.readRec(store.get(SEEN_KEY, null)).shows) } }, x, card, _o1);
function close() { _o3 = false; el.remove(); }
function attach(parent) {
if (!_o3 || !parent) return;
const _o4 = parent.querySelector(':scope > .panes');
if (_o4) parent.insertBefore(el, _o4); else parent.prepend(el);
}
return { el, attach, close, isOpen: () => _o3 };
}
export default { installPwaHint, shouldShow, realCustomerCount, platformOf, isStandalone, SEEN_KEY, TEXT, MAX_SHOWS };

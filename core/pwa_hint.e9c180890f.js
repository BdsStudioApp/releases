import { ls } from './xkit.f03faf0986.js';
import * as A from './a2hs.6e7a288a0e.js';
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
export function shouldShow({ nav, win, rec, setupDone = true } = {}) { return A.shouldShowHint({ nav, win, rec, setupDone }); }
export const ONE_LINE = '📲 Cài app ra màn hình chính';
export function installPwaHint({ ui, nav, win, store = ls, setupDone = true, now = Date.now() } = {}) {
const _o1 = nav || (typeof navigator !== 'undefined' ? navigator : {});
const _o5 = win || (typeof window !== 'undefined' ? window : {});
const rec = store.get(SEEN_KEY, null);
const _o4 = A.readRec(rec).shows >= 1;
if (A.platformOf(_o1) && A.isStandalone(_o5)) { if (!A.readRec(rec).done) store.set(SEEN_KEY, { ...A.markDone(rec, now), installed: 1 }); return null; }
if (!shouldShow({ nav: _o1, win: _o5, rec, setupDone })) return null;
store.set(SEEN_KEY, { ...A.afterShow(rec, now), platform: A.platformOf(_o1) });
const { h } = ui;
let _o2 = true;
const card = A.a2hsCard(ui, { compact: true, nav: _o1, win: _o5, appUrl: A.appUrlFor(), testid: 'pwa-hint-card',
onDone: () => { store.set(SEEN_KEY, A.markDone(store.get(SEEN_KEY, null))); close(); },
onLater: () => close(),
onNever: () => { store.set(SEEN_KEY, A.markNever(store.get(SEEN_KEY, null))); close(); } });
const x = h('button', { type: 'button', class: 'pwa-hint-x', 'aria-label': 'Đóng gợi ý', title: 'Để sau', 'data-testid': 'pwa-hint-x', onclick: () => close() }, ui.icon ? ui.icon('close', 20) : '×');
const _o0 = h('button', { type: 'button', class: 'btn btn-secondary btn-sm pwa-hint-more', 'aria-expanded': 'false', 'data-testid': 'pwa-hint-more',
onclick: () => { el.classList.add('is-open'); _o0.setAttribute('aria-expanded', 'true'); } }, ui.icon ? ui.icon('next', 18) : null, h('span', null, ONE_LINE));
const el = h('aside', { class: ['pwa-hint', _o4 && 'is-compact'], role: 'note', 'aria-label': TEXT.title, 'data-testid': 'pwa-hint', dataset: { platform: A.platformOf(_o1), shows: String(A.readRec(store.get(SEEN_KEY, null)).shows) } }, x, card, _o0);
function close() { _o2 = false; el.remove(); }
function attach(parent) {
if (!_o2 || !parent) return;
const _o3 = parent.querySelector(':scope > .panes');
if (_o3) parent.insertBefore(el, _o3); else parent.prepend(el);
}
return { el, attach, close, isOpen: () => _o2 };
}
export default { installPwaHint, shouldShow, platformOf, isStandalone, SEEN_KEY, TEXT, MAX_SHOWS };

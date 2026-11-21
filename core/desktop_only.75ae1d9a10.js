import { DESKTOP_ONLY_TEXT } from '../shared/device.js';
export function desktopOnlyNote({ ui, nav, title = '', link = '', compact = false } = {}) {
const { h, button } = ui;
if (compact) return h('p', { class: 'muted small desk-only-note', 'data-testid': 'desktop-only-note' }, DESKTOP_ONLY_TEXT);
const href = link || (typeof location !== 'undefined' ? location.href : '');
return h('section', { class: 'card desk-only', 'data-testid': 'desktop-only' },
h('div', { class: 'desk-only-ico', 'aria-hidden': 'true' }, '💻'),
title ? h('h2', { class: 'desk-only-title' }, title) : null,
h('p', { class: 'desk-only-text', 'data-testid': 'desktop-only-text' }, DESKTOP_ONLY_TEXT),
h('div', { class: 'btn-row desk-only-acts' },
button('Về Bảng tin', () => nav && nav('home'), { kind: 'primary', icon: 'home', testid: 'desktop-only-home' }),
href ? button('Chép link', () => ui.copy(href), { kind: 'secondary', icon: 'link', testid: 'desktop-only-copy' }) : null));
}
export default { desktopOnlyNote };

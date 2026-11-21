import { h } from './kit.js';
export const COLLAPSE_PREFIX = 'bds.brief.collapsed.';
const _o8 = (_o7) => { if (_o7 !== undefined) return _o7; try { return globalThis.localStorage || null; } catch { return null; } };
export function isCollapsed(id, storage) {
try { const _o7 = _o8(storage); return !!_o7 && _o7.getItem(COLLAPSE_PREFIX + id) === '1'; } catch { return false; }
}
export function setCollapsed(id, on, storage) {
try { const _o7 = _o8(storage); if (!_o7) return; if (on) _o7.setItem(COLLAPSE_PREFIX + id, '1'); else _o7.removeItem(COLLAPSE_PREFIX + id); } catch { }
}
export function donePlan(r) {
if (!r) return [];
if (r.virtual) return r.object_id ? [{ op: 'event', object_id: r.object_id, type: 'note', text: 'Đã gọi chăm sóc (đánh dấu xong ở Bảng tin)' }] : [];
const _o5 = [{ op: 'put', table: 'reminders', row: { ...r, done: 1 } }];
if (r.object_id) _o5.push({ op: 'event', object_id: r.object_id, type: 'note', text: 'Đã xong: ' + (r.title || 'việc cần gọi') });
return _o5;
}
export async function markDone(K, r) {
for (const _o7 of donePlan(r)) {
if (_o7.op === 'put') await K.put(_o7.table, _o7.row);
else await K.logEvent(_o7.object_id, _o7.type, _o7.text);
}
}
export function dueActs(K, c, r, done) {
const _o9 = h('div', { class: 'bds-acts' });
const _o0 = () => {
if (_o9.querySelector('[data-ask]')) return;
_o9.appendChild(h('span', { class: 'bds-sub', 'data-ask': '1', 'data-testid': 'due-ask-' + r.id }, 'Đã gọi xong? ',
K.button('✓ Xong', () => done(r), { kind: 'primary', testid: 'due-ask-done-' + r.id })));
};
const _o4 = c ? K.callBtn(c, { short: true }) : null, zalo = c ? K.zaloBtn(c, { short: true }) : null;
for (const _o1 of [_o4, zalo]) if (_o1 && _o1.addEventListener) _o1.addEventListener('click', _o0);
_o9.append(...[_o4, zalo, K.button('✓ Xong', () => done(r), { title: 'Đánh dấu đã gọi xong', testid: 'due-done-' + r.id })].filter(Boolean));
return _o9;
}
export function collapsibleCard(K, { id, title, testid, body, storage }) {
let shut = isCollapsed(id, storage);
const _o2 = h('div', { class: 'bds-card-b', 'data-testid': testid + '-body' }, body);
const _o3 = h('button', { type: 'button', class: 'bds-btn bds-btn-ghost bds-btn-x', 'data-testid': testid + '-toggle' });
const _o6 = () => {
_o2.hidden = shut;
_o3.textContent = shut ? '▸' : '▾';
_o3.setAttribute('aria-expanded', shut ? 'false' : 'true');
_o3.setAttribute('aria-label', shut ? 'Mở rộng' : 'Thu gọn');
_o3.title = shut ? 'Mở rộng' : 'Thu gọn';
};
_o3.addEventListener('click', () => { shut = !shut; setCollapsed(id, shut, storage); _o6(); });
_o6();
return h('section', { class: 'bds-card', 'data-testid': testid },
h('header', { class: 'bds-card-h' }, h('h3', null, title), h('div', { class: 'bds-card-a' }, _o3)), _o2);
}

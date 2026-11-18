export const DEFAULT_SLOTS = [7, 21];
const _o0 = 3600000;
function at(dayMs, hour) { const _o1 = new Date(dayMs); _o1.setHours(hour, 0, 0, 0); return _o1.getTime(); }
export function slotOf(ts, slots = DEFAULT_SLOTS) {
const s = [...slots].map(Number).filter((x) => x >= 0 && x < 24).sort((a, b) => a - b);
const t = Number(ts) || 0;
for (const _o3 of s) { const due = at(t, _o3); if (t < due) return _o5(_o3, due); }
const next = at(t + 24 * _o0, s[0]);
return _o5(s[0], next);
function _o5(hour, due) { const _o1 = new Date(due); return { hour, due, key: _o1.getFullYear() + '-' + String(_o1.getMonth() + 1).padStart(2, '0') + '-' + String(_o1.getDate()).padStart(2, '0') + '@' + hour }; }
}
export function nextSlot(now = Date.now(), slots = DEFAULT_SLOTS) { return slotOf(now, slots); }
export function slotLabel(g, now = Date.now()) {
const _o1 = new Date(g.due); const _o6 = (x) => String(x).padStart(2, '0');
const _o2 = _o6(_o1.getDate()) + '/' + _o6(_o1.getMonth() + 1);
const _o7 = g.hour < 12 ? 'sáng' : g.hour < 18 ? 'chiều' : 'tối';
return 'Khung ' + g.hour + 'h ' + _o7 + ' ' + _o2 + (g.due <= now ? ' · đến giờ duyệt' : ' · sắp tới');
}
export function groupBySlot(items, now = Date.now(), { timeOf = (x) => x.at || x.updated_at || x.created_at, slots = DEFAULT_SLOTS } = {}) {
const map = new Map();
for (const _o4 of items || []) {
const s = slotOf(Number(timeOf(_o4)) || now, slots);
if (!map.has(s.key)) map.set(s.key, { ...s, items: [] });
map.get(s.key).items.push(_o4);
}
return [...map.values()].sort((a, b) => a.due - b.due).map((g) => ({ ...g, isDue: g.due <= now, label: slotLabel(g, now) }));
}
export function slotHeader(h, g) {
return h('h3', { class: 'bds-slot ' + (g.isDue ? 'is-due' : 'is-next'), 'data-testid': 'slot-' + g.hour, dataset: { slot: g.key } }, g.label + ' (' + g.items.length + ')');
}
export default { slotOf, nextSlot, groupBySlot, slotLabel, slotHeader, DEFAULT_SLOTS };

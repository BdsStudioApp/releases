import { kit, h, selftestCommon } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import * as S from '../_lib/sales.js';
import { withG2, g2Of, vnDate } from './core.js';
export { h, crm, selftestCommon };
const _o0 = 'bds-g2-css';
export function ensureG2Css() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
document.head.appendChild(h('link', { id: _o0, rel: 'stylesheet', href: new URL('./g2.css', import.meta.url).href }));
}
export function g2kit(ctx) {
ensureG2Css();
const K = kit(ctx);
const G = {
K, h, crm,
user: () => ctx.user || { id: '', role: 'owner', perms: { customers_scope: 'all', assign: true, export: true } },
perms: () => (ctx.user && ctx.user.perms) || { customers_scope: 'all', assign: true, erase: true, export: true },
isStaff: () => !ctx.user || ['owner', 'manager'].includes(ctx.user.role),
isOwner: () => !ctx.user || ctx.user.role === 'owner' || !ctx.user.role,
async env() { return S.loadEnv(ctx); },
async customers() { return crm.activeCustomers(await K.list('objects')).filter(c => !crm.parseData(c.data).erased); },
async objectsOf(kind) { return (await K.list('objects')).filter(o => o.kind === kind); },
async patchG2(id, patch, rowPatch = {}) {
const fresh = await K.get('objects', id);
if (!fresh) throw new Error('Không thấy khách');
return K.put('objects', { ...fresh, ...rowPatch, data: withG2(fresh, patch) });
},
g2Of,
badgeTest: () => h('span', { class: 'g2-test', title: 'Gói thử nghiệm: dùng miễn phí, đang hoàn thiện – góp ý qua nút 💬' }, 'Thử nghiệm'),
head(title, ...actions) { return h('div', { class: 'bds-head' }, h('h2', null, title, ' ', G.badgeTest()), actions.length ? h('div', { class: 'bds-row bds-wrap' }, actions) : null); },
tabs(list, cur, onPick, testid) {
return h('div', { class: 'g2-tabs', role: 'tablist', 'data-testid': testid }, list.map(([id, label]) => h('button', {
type: 'button', role: 'tab', class: 'g2-tab' + (id === cur ? ' on' : ''), 'aria-selected': String(id === cur), 'data-testid': (testid || 'tab') + '-' + id, onclick: () => onPick(id),
}, label)));
},
customerSelect(list, value, attrs = {}) {
return K.select([['', '— Chọn khách —'], ...list.map(c => [c.id, (c.name || '(chưa có tên)') + (c.phone ? ' · ' + K.phone(c.phone) : '')])], value || '', attrs);
},
async aiText(task, prompt, json = false, feature) {
if (!ctx.ai || typeof ctx.ai.run !== 'function') throw new Error('Chưa bật AI trong Cài đặt');
const r = await ctx.ai.run(task, { prompt, json, feature });
const t = r && (typeof r === 'string' ? r : (r.text || r.output || (r.data && r.data.text) || ''));
if (!t) throw new Error('AI chưa trả lời');
return t;
},
async handoff(task, prompt) {
if (ctx.ai && typeof ctx.ai.handoff === 'function') { try { return await ctx.ai.handoff(task, prompt, { target: 'claude' }); } catch { } }
await K.copy(prompt); K.toast('Đã chép lời nhắn – dán vào Claude hoặc Gemini', 'info');
return null;
},
async compose(customer, text, opts = {}) {
const _o3 = await import('../zalo/index.js');
return _o3.openComposer(ctx, customer, { text, ...opts });
},
download(name, text, type = 'text/plain;charset=utf-8') {
const _o2 = text instanceof Blob ? text : new Blob([text], { type });
const _o1 = h('a', { href: URL.createObjectURL(_o2), download: name });
document.body.appendChild(_o1); _o1.click(); _o1.remove(); setTimeout(() => URL.revokeObjectURL(_o1.href), 4000);
},
dt(ms) { return vnDate(ms, true); },
date(ms) { return vnDate(ms); },
async dir() { if (!ctx.users || typeof ctx.users.directory !== 'function') return []; try { return await ctx.users.directory(); } catch { return []; } },
who(id, dir) { if (!id) return ''; if (ctx.user && id === ctx.user.id) return 'Tôi'; const _o4 = (dir || []).find(x => x.id === id); return _o4 ? (_o4.full_name || _o4.username) : (ctx.users && ctx.users.label ? ctx.users.label(id, dir) : ''); },
};
return G;
}
export async function g2Selftest(ctx, mount) { return selftestCommon(ctx, ['fmt.money'], div => mount(div, ctx)); }

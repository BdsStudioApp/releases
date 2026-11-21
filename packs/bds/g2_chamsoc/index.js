import { g2kit, h, g2Selftest } from '../g2_lib/ui.js';
import * as C from '../g2_lib/core.js';
import * as M from '../_lib/market.js';
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
const _o8 = new URLSearchParams(location.hash.split('?')[1] || '');
let tab = _o8.get('tab') || 'news';
let bucket = 30;
el.innerHTML = '';
const tabsBox = h('div');
const body = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-chamsoc' }, G.head('Cớ chăm sóc khách cũ'), tabsBox, body));
async function _o5() {
const [objects, events, ideas, policies, jobs, env, careCfg] = await Promise.all([K.list('objects'), K.list('events'), K.list('ideas'), K.list('policies'), K.list('jobs'), G.env(), K.setting('g2.care', null)]);
const customers = G.crm.activeCustomers(objects).filter(c => !C.pd(c.data).erased);
return { customers, events, ideas, policies, jobs, env, cfg: C.careConfig(careCfg), me: await K.me() };
}
async function _oa() {
tabsBox.innerHTML = '';
tabsBox.appendChild(G.tabs([['news', 'Tin tức thành cớ chăm sóc'], ['cold', 'Khách nguội 30/60/90 ngày']], tab, t => { tab = t; _oa(); }, 'g2cs-tab'));
const D = await _o5();
body.innerHTML = '';
if (tab === 'cold') return _ob(D);
return _oc(D);
}
async function _oe(c, text) {
const uid = C.g2Of(c).zoa_uid;
const _o9 = await K.api('g2.zoa.send', { text, recipients: [{ user_id: uid, customer_id: c.id, name: G.crm.givenName(c.name) }] });
if (!_o9 || !_o9.sent) throw new Error((_o9 && _o9.results && _o9.results[0] && _o9.results[0].message) || 'Zalo OA chưa gửi được');
}
function _oc(D) {
const hooks = C.newsHooks({ ideas: D.ideas, policies: D.policies, projects: D.env.projects, now: Date.now(), days: 21 });
const { rows, noConsent } = C.careMatches(D.customers, D.events, hooks, { projects: D.env.projects, areas: M.AREAS, cfg: D.cfg });
body.append(
h('p', { class: 'bds-muted', 'data-testid': 'g2-care-rule' }, 'Giới hạn: mỗi khách cách nhau tối thiểu ' + D.cfg.min_days + ' ngày, tối đa ' + D.cfg.max_per_30 + ' tin trong 30 ngày. Chỉ hiện khách đã đồng ý nhận tin.' + (noConsent ? ' Có ' + noConsent + ' khách hợp tin nhưng chưa đồng ý – không hiện.' : ''),
G.isStaff() ? [' ', K.button('Đổi giới hạn', () => _o3(D.cfg), { testid: 'g2-care-cap', icon: 'settings' })] : null),
h('p', { class: 'bds-muted' }, hooks.length + ' tin/chính sách trong 21 ngày' + (G.perms().video === false ? ' (tin tức cần quyền Video & Ý tưởng – đang chỉ dùng chính sách)' : '') + '.'));
const box = h('div', { class: 'bds-list', 'data-testid': 'g2-care-list' });
for (const _o9 of rows.slice(0, 100)) {
const c = _o9.c;
const _od = K.select(_o9.hooks.slice(0, 8).map((hk, i) => [i, (hk.kind === 'policy' ? '📄 ' : '📰 ') + hk.title.slice(0, 90)]), 0, { 'aria-label': 'Chọn tin', 'data-testid': 'g2-care-hook-' + c.id });
const _o4 = () => _o9.hooks[Number(_od.value) || 0];
const _of = () => C.careText(c, _o4(), D.me, K.projectName(c.project));
const _o6 = async (via) => { await K.put('events', { object_id: c.id, type: 'g2_news', text: _o4().title.slice(0, 300), at: Date.now(), data: JSON.stringify({ hook: _o4().id, url: _o4().url, via }) }); _oa(); };
const _o7 = C.g2Of(c).zoa_uid && G.isStaff();
box.appendChild(h('div', { class: 'bds-item', 'data-testid': 'g2-care-' + c.id },
h('div', { class: 'bds-row-main' }, h('strong', null, c.name), h('span', { class: 'bds-sub' + (_o9.cap.ok ? '' : ' bds-danger') }, K.projectName(c.project) + ' · ' + (_o9.cap.ok ? 'được gửi' + (_o9.cap.last ? ' (lần trước ' + G.date(_o9.cap.last) + ')' : '') : _o9.cap.why + ' → gửi được từ ' + G.date(_o9.cap.next))), _od),
h('div', { class: 'bds-acts bds-wrap' },
_o9.cap.ok ? K.button('Soạn tin', () => G.compose(c, _of(), { onSent: () => _o6('zalo') }), { kind: 'primary', testid: 'g2-care-compose-' + c.id, icon: 'chat' }) : null,
_o9.cap.ok && _o7 ? K.button('Gửi qua Zalo OA', async () => { try { await _oe(c, _of()); await _o6('oa'); K.toast('Đã gửi qua Zalo OA', 'success'); } catch (e) { K.toast(e.message, 'warn'); } }, { icon: 'send' }) : null)));
}
if (!rows.length) box.appendChild(K.empty(hooks.length ? 'Không có khách (đã đồng ý nhận tin) quan tâm dự án/khu vực trong các tin này.' : 'Chưa có tin/chính sách mới trong 21 ngày. Lấy tin ở Thị trường hoặc cập nhật chính sách.'));
body.appendChild(box);
}
function _o3(cfg) {
const _o0 = h('input', { type: 'number', min: 1, value: cfg.min_days, 'data-testid': 'g2-cap-days' });
const _o1 = h('input', { type: 'number', min: 1, value: cfg.max_per_30, 'data-testid': 'g2-cap-max' });
let m;
m = K.modal({ title: 'Giới hạn tần suất chăm sóc', body: [K.field('Cách nhau tối thiểu (ngày)', _o0), K.field('Tối đa số tin trong 30 ngày', _o1),
h('div', { class: 'bds-row bds-end' }, K.button('Lưu', async () => {
if (!(Number(_o0.value) >= 1) || !(Number(_o1.value) >= 1)) { K.toast('Nhập số ngày và số tin từ 1 trở lên', 'warn'); return; }
await K.setSetting('g2.care', C.careConfig({ min_days: _o0.value, max_per_30: _o1.value })); m.close(); _oa();
}, { kind: 'primary', testid: 'g2-cap-save' }))] });
}
function _ob(D) {
const reports = D.jobs.filter(j => j.type === 'market_report').map(j => ({ at: Number(j.updated_at), ...(C.pd(j.output).report || {}) }));
const matches = c => C.matchUnits(c, D.env.projects, { policyFresh: pid => !!D.env.active(pid), limit: 3 }).list;
const rows = C.coldList(D.customers, D.events, { projects: D.env.projects, policies: D.policies, ideas: D.ideas, reports, areas: M.AREAS, matches, now: Date.now() });
body.appendChild(h('div', { class: 'bds-chips' }, C.COLD_BUCKETS.map(_o1 => h('button', { type: 'button', class: 'bds-chip' + (bucket === _o1 ? ' bds-on' : ''), 'data-testid': 'g2-cold-b-' + _o1, onclick: () => { bucket = _o1; _oa(); } },
(_o1 === 90 ? 'Trên 90' : _o1 + '–' + (_o1 + 29)) + ' ngày (' + rows.filter(_o9 => _o9.bucket === _o1).length + ')'))));
body.appendChild(h('p', { class: 'bds-muted' }, 'Khách chưa chốt, lâu chưa gọi/nhắn/gặp. "Lý do mới" chỉ lấy việc xảy ra SAU lần liên hệ cuối, có nguồn – để cuộc gọi có giá trị cho khách, không phải gọi cho có.'));
const box = h('div', { class: 'bds-list', 'data-testid': 'g2-cold-list' });
for (const _o9 of rows.filter(x => x.bucket === bucket).slice(0, 100)) {
const c = _o9.c;
const top = _o9.reasons[0] || null;
box.appendChild(h('div', { class: 'bds-item', 'data-testid': 'g2-cold-' + c.id },
h('div', { class: 'bds-row-main' }, h('strong', null, c.name), h('span', { class: 'bds-sub', 'data-testid': 'g2-cold-days-' + c.id }, _o9.days + ' ngày chưa liên hệ'), h('span', { class: 'bds-sub' }, [c.status, K.projectName(c.project), 'liên hệ cuối ' + G.date(_o9.last)].filter(Boolean).join(' · ')),
_o9.reasons.length ? h('ul', { class: 'g2-parts' }, _o9.reasons.slice(0, 3).map(x => h('li', null, h('span', null, x.text), h('small', { class: 'g2-src' }, x.source)))) : h('small', { class: 'bds-muted' }, 'Chưa có lý do mới – hỏi thăm nhu cầu hiện tại.')),
h('div', { class: 'bds-acts bds-wrap' }, K.callBtn(c, { short: true }),
K.button('Soạn tin', () => G.compose(c, C.callbackText(c, top, D.me)), { kind: 'primary', testid: 'g2-cold-compose-' + c.id, icon: 'chat' }),
K.button('Nhắc gọi mai', async () => {
const t = C.vnParts(Date.now() + C.DAY), due = C.vnStamp(t.y, t.m, t.d, 9, 0);
const _o2 = (await K.list('reminders')).some(x => x.object_id === c.id && x.kind === 'followup' && !Number(x.done) && C.pd(x.data).g2 === 'cold' && Number(x.due_at) === due);
if (_o2) { K.toast('Đã có nhắc gọi ' + (c.name || 'khách') + ' lúc 9h sáng mai', 'info'); return; }
await K.put('reminders', { object_id: c.id, kind: 'followup', title: ('Gọi lại ' + c.name + (top ? ': ' + top.text : '')).slice(0, 200), due_at: due, remind_before_days: 0, amount: 0, installment: 0, done: 0, notified_at: 0, data: JSON.stringify({ g2: 'cold', days: _o9.days }) });
K.toast('Đã tạo nhắc 9h sáng mai', 'success');
}, { testid: 'g2-cold-remind-' + c.id, icon: 'clock' }),
K.button('Hoãn 30 ngày', async () => { await G.patchG2(c.id, { cold_snooze_until: Date.now() + 30 * C.DAY }); _oa(); }, { icon: 'undo', testid: 'g2-cold-snooze-' + c.id }))));
}
if (!rows.some(x => x.bucket === bucket)) box.appendChild(K.empty('Không có khách trong nhóm này.'));
body.appendChild(box);
}
await _oa();
K.on(el, ['objects', 'events'], _oa);
}
export default {
manifest: { id: 'g2_chamsoc', title: 'Cớ chăm sóc khách cũ', icon: '📰', screen: 'customers', order: 270, version: '0.1.0', status: 'thu-nghiem', pack: 'care',
help: 'Biến tin tức/chính sách mới thành cớ nhắn khách cũ (có giới hạn tần suất, chỉ khách đồng ý), gọi lại khách nguội 30/60/90 ngày với lý do mới có nguồn.' },
mount,
async selftest(ctx) {
const cap = C.capState('a', [{ object_id: 'a', type: 'g2_news', at: Date.now() - C.DAY }], { min_days: 14 });
if (cap.ok) return { ok: false, details: 'Giới hạn tần suất không chạy' };
return g2Selftest(ctx, mount);
},
};

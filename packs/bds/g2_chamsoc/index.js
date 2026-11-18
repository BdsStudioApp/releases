import { g2kit, h, g2Selftest } from '../g2_lib/ui.js';
import * as C from '../g2_lib/core.js';
import * as M from '../_lib/market.js';
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
const _oa = new URLSearchParams(location.hash.split('?')[1] || '');
let tab = _oa.get('tab') || 'news';
let bucket = 30;
el.innerHTML = '';
const tabsBox = h('div');
const body = h('div');
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-chamsoc' }, G.head('Cớ chăm sóc khách cũ'), tabsBox, body));
async function _o7() {
const [objects, events, ideas, policies, jobs, env, careCfg] = await Promise.all([K.list('objects'), K.list('events'), K.list('ideas'), K.list('policies'), K.list('jobs'), G.env(), K.setting('g2.care', null)]);
const customers = G.crm.activeCustomers(objects).filter(c => !C.pd(c.data).erased);
return { customers, events, ideas, policies, jobs, env, cfg: C.careConfig(careCfg), me: await K.me() };
}
async function _oc() {
tabsBox.innerHTML = '';
tabsBox.appendChild(G.tabs([['news', 'Tin tức thành cớ chăm sóc'], ['cold', 'Khách nguội 30/60/90 ngày']], tab, t => { tab = t; _oc(); }, 'g2cs-tab'));
const _o0 = await _o7();
body.innerHTML = '';
if (tab === 'cold') return _od(_o0);
return _oe(_o0);
}
async function _og(c, text) {
const uid = C.g2Of(c).zoa_uid;
const _ob = await K.api('g2.zoa.send', { text, recipients: [{ user_id: uid, customer_id: c.id, name: G.crm.givenName(c.name) }] });
if (!_ob || !_ob.sent) throw new Error((_ob && _ob.results && _ob.results[0] && _ob.results[0].message) || 'Zalo OA chưa gửi được');
}
function _oe(_o0) {
const hooks = C.newsHooks({ ideas: _o0.ideas, policies: _o0.policies, projects: _o0.env.projects, now: Date.now(), days: 21 });
const { rows, noConsent } = C.careMatches(_o0.customers, _o0.events, hooks, { projects: _o0.env.projects, areas: M.AREAS, cfg: _o0.cfg });
body.append(
h('p', { class: 'bds-muted', 'data-testid': 'g2-care-rule' }, 'Giới hạn: mỗi khách cách nhau tối thiểu ' + _o0.cfg.min_days + ' ngày, tối đa ' + _o0.cfg.max_per_30 + ' tin trong 30 ngày. Chỉ hiện khách đã đồng ý nhận tin.' + (noConsent ? ' Có ' + noConsent + ' khách hợp tin nhưng chưa đồng ý – không hiện.' : ''),
G.isStaff() ? [' ', K.button('Đổi giới hạn', () => _o5(_o0.cfg), { testid: 'g2-care-cap', icon: 'settings' })] : null),
h('p', { class: 'bds-muted' }, hooks.length + ' tin/chính sách trong 21 ngày' + (G.perms().video === false ? ' (tin tức cần quyền Video & Ý tưởng – đang chỉ dùng chính sách)' : '') + '.'));
const _o3 = h('div', { class: 'bds-list', 'data-testid': 'g2-care-list' });
for (const _ob of rows.slice(0, 100)) {
const c = _ob.c;
const _of = K.select(_ob.hooks.slice(0, 8).map((hk, i) => [i, (hk.kind === 'policy' ? '📄 ' : '📰 ') + hk.title.slice(0, 90)]), 0, { 'aria-label': 'Chọn tin', 'data-testid': 'g2-care-hook-' + c.id });
const _o6 = () => _ob.hooks[Number(_of.value) || 0];
const _oh = () => C.careText(c, _o6(), _o0.me, K.projectName(c.project));
const _o8 = async (via) => { await K.put('events', { object_id: c.id, type: 'g2_news', text: _o6().title.slice(0, 300), at: Date.now(), data: JSON.stringify({ hook: _o6().id, url: _o6().url, via }) }); _oc(); };
const _o9 = C.g2Of(c).zoa_uid && G.isStaff();
_o3.appendChild(h('div', { class: 'bds-item', 'data-testid': 'g2-care-' + c.id },
h('div', { class: 'bds-row-main' }, h('strong', null, c.name), h('span', { class: 'bds-sub' + (_ob.cap.ok ? '' : ' bds-danger') }, K.projectName(c.project) + ' · ' + (_ob.cap.ok ? 'được gửi' + (_ob.cap.last ? ' (lần trước ' + G.date(_ob.cap.last) + ')' : '') : _ob.cap.why + ' → gửi được từ ' + G.date(_ob.cap.next))), _of),
h('div', { class: 'bds-acts bds-wrap' },
_ob.cap.ok ? K.button('Soạn tin', () => G.compose(c, _oh(), { onSent: () => _o8('zalo') }), { kind: 'primary', testid: 'g2-care-compose-' + c.id, icon: 'chat' }) : null,
_ob.cap.ok && _o9 ? K.button('Gửi qua Zalo OA', async () => { try { await _og(c, _oh()); await _o8('oa'); K.toast('Đã gửi qua Zalo OA', 'success'); } catch (e) { K.toast(e.message, 'warn'); } }, { icon: 'send' }) : null)));
}
if (!rows.length) _o3.appendChild(K.empty(hooks.length ? 'Không có khách (đã đồng ý nhận tin) quan tâm dự án/khu vực trong các tin này.' : 'Chưa có tin/chính sách mới trong 21 ngày. Lấy tin ở Thị trường hoặc cập nhật chính sách.'));
body.appendChild(_o3);
}
function _o5(cfg) {
const _o1 = h('input', { type: 'number', min: 1, value: cfg.min_days, 'data-testid': 'g2-cap-days' });
const _o2 = h('input', { type: 'number', min: 1, value: cfg.max_per_30, 'data-testid': 'g2-cap-max' });
let m;
m = K.modal({ title: 'Giới hạn tần suất chăm sóc', body: [K.field('Cách nhau tối thiểu (ngày)', _o1), K.field('Tối đa số tin trong 30 ngày', _o2),
h('div', { class: 'bds-row bds-end' }, K.button('Lưu', async () => {
if (!(Number(_o1.value) >= 1) || !(Number(_o2.value) >= 1)) { K.toast('Nhập số ngày và số tin từ 1 trở lên', 'warn'); return; }
await K.setSetting('g2.care', C.careConfig({ min_days: _o1.value, max_per_30: _o2.value })); m.close(); _oc();
}, { kind: 'primary', testid: 'g2-cap-save' }))] });
}
function _od(_o0) {
const reports = _o0.jobs.filter(j => j.type === 'market_report').map(j => ({ at: Number(j.updated_at), ...(C.pd(j.output).report || {}) }));
const matches = c => C.matchUnits(c, _o0.env.projects, { policyFresh: pid => !!_o0.env.active(pid), limit: 3 }).list;
const rows = C.coldList(_o0.customers, _o0.events, { projects: _o0.env.projects, policies: _o0.policies, ideas: _o0.ideas, reports, areas: M.AREAS, matches, now: Date.now() });
body.appendChild(h('div', { class: 'bds-chips' }, C.COLD_BUCKETS.map(_o2 => h('button', { type: 'button', class: 'bds-chip' + (bucket === _o2 ? ' bds-on' : ''), 'data-testid': 'g2-cold-b-' + _o2, onclick: () => { bucket = _o2; _oc(); } },
(_o2 === 90 ? 'Trên 90' : _o2 + '–' + (_o2 + 29)) + ' ngày (' + rows.filter(_ob => _ob.bucket === _o2).length + ')'))));
body.appendChild(h('p', { class: 'bds-muted' }, 'Khách chưa chốt, lâu chưa gọi/nhắn/gặp. "Lý do mới" chỉ lấy việc xảy ra SAU lần liên hệ cuối, có nguồn – để cuộc gọi có giá trị cho khách, không phải gọi cho có.'));
const _o3 = h('div', { class: 'bds-list', 'data-testid': 'g2-cold-list' });
for (const _ob of rows.filter(x => x.bucket === bucket).slice(0, 100)) {
const c = _ob.c;
const top = _ob.reasons[0] || null;
_o3.appendChild(h('div', { class: 'bds-item', 'data-testid': 'g2-cold-' + c.id },
h('div', { class: 'bds-row-main' }, h('strong', null, c.name), h('span', { class: 'bds-sub', 'data-testid': 'g2-cold-days-' + c.id }, _ob.days + ' ngày chưa liên hệ'), h('span', { class: 'bds-sub' }, [c.status, K.projectName(c.project), 'liên hệ cuối ' + G.date(_ob.last)].filter(Boolean).join(' · ')),
_ob.reasons.length ? h('ul', { class: 'g2-parts' }, _ob.reasons.slice(0, 3).map(x => h('li', null, h('span', null, x.text), h('small', { class: 'g2-src' }, x.source)))) : h('small', { class: 'bds-muted' }, 'Chưa có lý do mới – hỏi thăm nhu cầu hiện tại.')),
h('div', { class: 'bds-acts bds-wrap' }, K.callBtn(c, { short: true }),
K.button('Soạn tin', () => G.compose(c, C.callbackText(c, top, _o0.me)), { kind: 'primary', testid: 'g2-cold-compose-' + c.id, icon: 'chat' }),
K.button('Nhắc gọi mai', async () => {
const t = C.vnParts(Date.now() + C.DAY), due = C.vnStamp(t.y, t.m, t.d, 9, 0);
const _o4 = (await K.list('reminders')).some(x => x.object_id === c.id && x.kind === 'followup' && !Number(x.done) && C.pd(x.data).g2 === 'cold' && Number(x.due_at) === due);
if (_o4) { K.toast('Đã có nhắc gọi ' + (c.name || 'khách') + ' lúc 9h sáng mai', 'info'); return; }
await K.put('reminders', { object_id: c.id, kind: 'followup', title: ('Gọi lại ' + c.name + (top ? ': ' + top.text : '')).slice(0, 200), due_at: due, remind_before_days: 0, amount: 0, installment: 0, done: 0, notified_at: 0, data: JSON.stringify({ g2: 'cold', days: _ob.days }) });
K.toast('Đã tạo nhắc 9h sáng mai', 'success');
}, { testid: 'g2-cold-remind-' + c.id, icon: 'clock' }),
K.button('Hoãn 30 ngày', async () => { await G.patchG2(c.id, { cold_snooze_until: Date.now() + 30 * C.DAY }); _oc(); }, { icon: 'undo', testid: 'g2-cold-snooze-' + c.id }))));
}
if (!rows.some(x => x.bucket === bucket)) _o3.appendChild(K.empty('Không có khách trong nhóm này.'));
body.appendChild(_o3);
}
await _oc();
K.on(el, ['objects', 'events'], _oc);
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

import { g2kit, h, g2Selftest } from '../g2_lib/ui.js';
import * as C from '../g2_lib/core.js';
const _o1 = 'bds.g2crm.tab';
const _oq = (t, score) => h('span', { class: 'g2-tier g2-tier-' + t, 'data-testid': 'tier' }, C.TIER_LABEL[t] + (score !== undefined && t !== 'done' ? ' · ' + score : ''));
async function _oc(G) {
const K = G.K;
const [objects, events, reminders, quotes, env, cfg] = await Promise.all([K.list('objects'), K.list('events'), K.list('reminders'), K.list('quotes'), G.env(), K.setting('g2.score', null)]);
const customers = G.crm.activeCustomers(objects).filter(c => !C.pd(c.data).erased);
const config = C.scoreConfig(cfg);
const scored = new Map(customers.map(c => [c.id, C.scoreCustomer(c, { events, reminders, quotes, config })]));
return { customers, events, reminders, quotes, env, cfg, config, scored };
}
export async function mount(el, ctx) {
const G = g2kit(ctx);
const K = G.K;
let tab = (() => { try { return localStorage.getItem(_o1) || 'funnel'; } catch { return 'funnel'; } })();
const _og = new URLSearchParams(location.hash.split('?')[1] || '');
if (_og.get('tab')) tab = _og.get('tab');
let pickId = _og.get('customer') || '';
let _or = '';
el.innerHTML = '';
const tabsBox = h('div');
const body = h('div', { 'data-testid': 'g2crm-body' });
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-crm' }, G.head('CRM: Phễu & Ghép căn'), tabsBox, body));
async function _oi() {
tabsBox.innerHTML = '';
tabsBox.appendChild(G.tabs([['funnel', 'Phễu 6 bước'], ['match', 'Ghép căn'], ['score', 'Nóng / Ấm / Lạnh']], tab, t => { tab = t; try { localStorage.setItem(_o1, t); } catch { } _oi(); }, 'g2crm-tab'));
const _o0 = await _oc(G);
body.innerHTML = '';
if (tab === 'match') return _ok(_o0);
if (tab === 'score') return _ol(_o0);
return _oj(_o0);
}
function _oj(_o0) {
const _o3 = C.funnelBoard(_o0.customers);
body.appendChild(h('p', { class: 'bds-muted' }, 'Bước của khách lấy theo trạng thái trong hồ sơ. Bấm vào khách để chuyển bước – trạng thái và lịch sử khách được cập nhật theo. Tỉ lệ dưới mỗi bước = % khách đi tiếp từ bước trước.'));
const board = h('div', { class: 'g2-board', 'data-testid': 'g2-board' });
for (const _o5 of _o3.cols) {
const items = _o5.items.slice().sort((x, y) => (_o0.scored.get(y.id).score - _o0.scored.get(x.id).score));
board.appendChild(h('div', { class: 'g2-col', 'data-testid': 'g2-col-' + _o5.n },
h('h4', null, h('span', null, _o5.n + '. ' + _o5.label), h('small', null, String(_o5.items.length))),
h('small', null, _o5.n === 1 ? _o5.hint : _o5.rate + '% đi tiếp'),
items.slice(0, 40).map(c => h('button', { type: 'button', class: 'g2-card', 'data-testid': 'g2-card-' + c.id, onclick: () => _oe(c.id) },
h('strong', null, c.name || '(chưa có tên)'),
h('span', null, [K.projectName(c.project), c.unit_type].filter(Boolean).join(' · ') || c.status || ''), ' ', _oq(_o0.scored.get(c.id).tier, _o0.scored.get(c.id).score))),
items.length > 40 ? h('small', null, '+' + (items.length - 40) + ' khách') : null));
}
body.appendChild(board);
if (_o3.out.length) body.appendChild(h('p', { class: 'bds-muted' }, 'Ngoài phễu (tạm dừng / không tiềm năng): ' + _o3.out.length + ' khách.'));
if (!_o3.total) body.appendChild(K.empty('Chưa có khách. Thêm khách ở màn Khách hàng.'));
}
async function _oe(id) {
const _o0 = await _oc(G);
const c = _o0.customers.find(x => x.id === id);
if (!c) return;
const _o4 = h('div');
const _op = K.sheet({ title: c.name || 'Khách', body: _o4, testid: 'g2-cust-sheet' });
const _o6 = C.stageOf(c.status);
const list = K.statuses(c.need);
const _on = _o0.scored.get(c.id);
_o4.append(
h('p', null, 'Trạng thái: ', K.badge(c.status || 'Mới', G.crm.statusTone(c.status)), ' ', _oq(_on.tier, _on.score)),
h('div', { class: 'g2-pills', 'data-testid': 'g2-stages' }, C.FUNNEL.map(f => {
const st = C.statusForStage(f.n, list);
return K.button(f.n + '. ' + f.label, async () => {
if (!st) { K.toast('Khách nhu cầu "' + (c.need || 'mua') + '" không có bước ' + f.label + ' – chọn bước khác', 'warn'); return; }
const fresh = await K.get('objects', c.id);
await K.put('objects', { ...fresh, status: st });
await K.logEvent(c.id, 'status', 'Chuyển bước phễu: ' + f.label + ' (' + st + ')');
K.toast('Đã chuyển sang "' + f.label + '"', 'success');
_op.close(); _oi();
}, { kind: f.n === _o6 ? 'primary' : 'ghost', icon: f.n === _o6 ? 'check' : st ? 'next' : 'x', testid: 'g2-stage-' + f.n, title: st ? 'Trạng thái: ' + st : 'Nhu cầu "' + (c.need || 'mua') + '" không có bước này' });
})),
h('h4', null, 'Vì sao ' + C.TIER_LABEL[_on.tier].toLowerCase() + ' (' + _on.score + ' điểm)'), _of(_on.parts),
h('div', { class: 'bds-row bds-wrap' },
K.button('Mở hồ sơ khách', () => { _op.close(); K.afterClose(() => K.openProfile(c.id)); }, { testid: 'g2-open-profile' }),
K.button('Ghép căn', () => { _op.close(); pickId = c.id; tab = 'match'; _oi(); }, { kind: 'primary', testid: 'g2-to-match', icon: 'link' })));
}
function _ok(_o0) {
if (!pickId || !_o0.customers.some(c => c.id === pickId)) pickId = (_o0.customers.find(c => c.budget || c.unit_type) || _o0.customers[0] || {}).id || '';
const _oo = G.customerSelect(_o0.customers, pickId, { 'aria-label': 'Khách', 'data-testid': 'g2-match-customer', onchange: e => { pickId = e.target.value; _oi(); } });
body.appendChild(K.field('Ghép cho khách', _oo));
const c = _o0.customers.find(x => x.id === pickId);
if (!c) { body.appendChild(K.empty('Chưa có khách để ghép.')); return; }
body.appendChild(h('p', { class: 'bds-muted' }, 'Nhu cầu: ', [c.need || 'mua', c.budget ? 'vốn ' + K.money(c.budget) : 'chưa có vốn', c.unit_type || 'chưa chọn loại căn', c.project ? K.projectName(c.project) : 'chưa chọn dự án'].join(' · '),
'. Điểm = Ngân sách 40 + Loại căn 25 + Dự án/khu vực 20 + Tình trạng bán 10 + Độ mới của giá 5.'));
const _oh = C.matchUnits(c, _o0.env.projects, { policyFresh: pid => !!_o0.env.active(pid), limit: 8 });
if (_oh.note) body.appendChild(h('p', { class: 'bds-warn', 'data-testid': 'g2-match-note' }, _oh.note));
const _o4 = h('div', { class: 'bds-list', 'data-testid': 'g2-match-list' });
for (const _ot of _oh.list) {
_o4.appendChild(K.card({ title: _ot.project.name + ' · ' + _ot.type + ' — ' + _ot.score + ' điểm', testid: 'g2-unit-' + _ot.key.replace(/[^a-z0-9]/gi, '_'),
body: [
h('div', { class: 'g2-bar' }, h('i', { style: { width: _ot.score + '%' } })),
h('p', { class: 'bds-sub' }, _ot.area[0] + '–' + _ot.area[1] + ' m² · ' + _ot.price_m2[0] + '–' + _ot.price_m2[1] + ' triệu/m² · ước ' + C.moneyShort(_ot.total[0]) + '–' + C.moneyShort(_ot.total[1])),
h('ul', { class: 'g2-parts' }, _ot.parts.map(p => h('li', null, h('span', null, p.label + ': ' + p.text), h('b', null, p.pts + '/' + p.max)))),
h('div', { class: 'bds-row bds-wrap' },
K.linkBtn('Báo giá căn này', '#/sales/quote?customer=' + encodeURIComponent(c.id) + '&project=' + encodeURIComponent(_ot.project.id) + '&type=' + encodeURIComponent(_ot.type), null, { kind: 'primary', icon: 'calculator', glyph: '🧾' }),
K.button('Ẩn căn này', async () => { const hidden = new Set(C.g2Of(c).hidden_matches || []); hidden.add(_ot.key); await G.patchG2(c.id, { hidden_matches: [...hidden] }); _oi(); }, { testid: 'g2-hide-unit', icon: 'x' })),
] }));
}
if (!_oh.list.length && !_oh.note) _o4.appendChild(K.empty('Không có căn nào trong Bảng hàng hợp vốn của khách (đã loại ' + _oh.excluded + ' căn vượt vốn quá 30%).'));
body.appendChild(_o4);
if (_oh.list.length) {
body.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('Soạn tin gửi khách 3 căn hợp nhất', async () => {
const me = await K.me();
const _ob = _oh.list.slice(0, 3).map((_ot, i) => (i + 1) + '. ' + _ot.project.name + ' – ' + _ot.type + ' (' + _ot.area[0] + '–' + _ot.area[1] + ' m², khoảng ' + C.moneyShort(_ot.total[0]) + '–' + C.moneyShort(_ot.total[1]) + ')');
await G.compose(c, 'Dạ em chào anh/chị ' + G.crm.givenName(c.name) + ', theo nhu cầu anh/chị chia sẻ, em lọc được các căn phù hợp:\n' + _ob.join('\n') + '\nGiá trên là giá tham khảo, em gửi bảng tính chi tiết theo chính sách hiện hành khi anh/chị chọn căn ạ. Em ' + (me.name || '') + '.');
}, { testid: 'g2-match-compose', icon: 'chat' }),
C.g2Of(c).hidden_matches && C.g2Of(c).hidden_matches.length ? K.button('Hiện lại căn đã ẩn', async () => { await G.patchG2(c.id, { hidden_matches: [] }); _oi(); }, { icon: 'eye' }) : null));
}
}
function _ol(_o0) {
const _om = _o0.customers.map(c => ({ c, s: _o0.scored.get(c.id) })).sort((a, _o3) => _o3.s.score - a.s.score);
const count = t => _om.filter(_oh => _oh.s.tier === t).length;
body.appendChild(h('div', { class: 'bds-stats' }, ['hot', 'warm', 'cold', 'done'].map(t => h('button', { type: 'button', class: 'bds-stat bds-chip' + (_or === t ? ' bds-on' : ''), 'data-testid': 'g2-tier-f-' + t, onclick: () => { _or = _or === t ? '' : t; _oi(); } },
h('strong', null, String(count(t))), ' ', C.TIER_LABEL[t]))));
body.appendChild(h('p', { class: 'bds-muted' }, 'Nóng ≥ ' + _o0.config.tiers.hot + ' điểm · Ấm ≥ ' + _o0.config.tiers.warm + ' điểm · còn lại Lạnh. Điểm chỉ dựa trên hành vi đã ghi trong app (gọi, nhắn, lịch xem, báo giá, bước phễu) – bấm vào khách để xem từng phần.'));
const _o4 = h('div', { class: 'bds-list', 'data-testid': 'g2-score-list' });
for (const { c, s } of _om.filter(_oh => !_or || _oh.s.tier === _or).slice(0, 200)) {
const _o7 = h('div', { hidden: true }, _of(s.parts));
_o4.appendChild(h('div', { class: 'bds-item', 'data-testid': 'g2-score-' + c.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => { _o7.hidden = !_o7.hidden; } },
h('strong', null, c.name || '(chưa có tên)'), h('span', { class: 'bds-sub' }, (c.status || 'Mới') + (s.silent ? ' · im lặng ' + s.silent + ' ngày' : ''))),
_oq(s.tier, s.score), h('div', { class: 'bds-acts' }, K.callBtn(c, { short: true })), _o7));
}
if (!_om.length) _o4.appendChild(K.empty('Chưa có khách.'));
body.appendChild(_o4);
const _o2 = h('div', { class: 'bds-row bds-wrap' },
K.button('Ghi điểm vào hồ sơ khách', async () => {
let n = 0;
for (const { c, s } of _om) {
if (Number(c.score) === s.score) continue;
const fresh = await K.get('objects', c.id);
if (fresh) { await K.put('objects', { ...fresh, score: s.score }); n++; }
}
K.toast(n ? 'Đã ghi điểm cho ' + n + ' khách – Bảng tin dùng điểm này để lọc khách nóng' : 'Điểm đã khớp, không cần ghi', 'success');
}, { testid: 'g2-score-save', title: 'Bảng tin 7h coi khách ≥ 70 điểm là khách nóng', icon: 'disk' }),
G.isStaff() ? K.button('Sửa luật chấm điểm', () => _o8(_o0), { testid: 'g2-weights', icon: 'settings' }) : null);
body.appendChild(_o2);
}
function _o8(_o0) {
const _oa = {};
const _os = { hot: h('input', { type: 'number', value: _o0.config.tiers.hot, min: 1, max: 100, 'data-testid': 'g2-w-hot' }), warm: h('input', { type: 'number', value: _o0.config.tiers.warm, min: 0, max: 100, 'data-testid': 'g2-w-warm' }) };
const _o9 = h('div', { class: 'g2-weights' },
h('p', { class: 'bds-muted' }, 'Điểm mỗi lần (số lần tối đa được tính ghi trong ngoặc). Đổi xong cả đội dùng chung.'),
C.SCORE_RULES.map(_oh => h('label', null, h('span', null, _oh.label + ' (tối đa ' + _oh.cap + ')'), _oa[_oh.id] = h('input', { type: 'number', step: 1, value: _o0.config.rules.find(x => x.id === _oh.id).w, 'data-testid': 'g2-w-' + _oh.id }))),
h('label', null, h('span', null, 'Ngưỡng Nóng'), _os.hot), h('label', null, h('span', null, 'Ngưỡng Ấm'), _os.warm));
let _od;
const save = async () => {
const weights = {};
for (const _oh of C.SCORE_RULES) { const _ou = Number(_oa[_oh.id].value); if (Number.isFinite(_ou)) weights[_oh.id] = Math.max(-50, Math.min(50, _ou)); }
await K.setSetting('g2.score', { weights, tiers: { hot: Number(_os.hot.value) || 70, warm: Number(_os.warm.value) || 40 }, by: G.user().id, at: Date.now() });
_od.close(); K.toast('Đã lưu luật chấm điểm', 'success'); _oi();
};
_od = K.modal({ title: 'Luật chấm điểm khách', testid: 'g2-weights-modal', body: [_o9, h('div', { class: 'bds-row bds-end' },
K.button('Về mặc định', async () => { await K.setSetting('g2.score', null); _od.close(); _oi(); }, { icon: 'undo' }),
K.button('Lưu', save, { kind: 'primary', testid: 'g2-weights-save' }))] });
}
await _oi();
K.on(el, ['objects', 'events', 'reminders', 'settings'], _oi);
}
function _of(parts) {
if (!parts.length) return h('p', { class: 'bds-muted' }, 'Chưa có hành vi nào được ghi.');
return h('ul', { class: 'g2-parts' }, parts.map(p => h('li', null, h('span', null, p.label + (p.count > 1 ? ' × ' + p.count : '')), h('b', null, (p.pts > 0 ? '+' : '') + p.pts))));
}
export default {
manifest: { id: 'g2_crm', title: 'CRM: Phễu & Ghép căn', icon: '🎯', screen: 'customers', order: 210, version: '0.1.0', status: 'thu-nghiem', pack: 'care',
help: 'Phễu 6 bước theo trạng thái khách, tự ghép nhu cầu với căn trong Bảng hàng (có giải thích điểm), chấm điểm khách Nóng/Ấm/Lạnh theo hành vi.' },
mount,
async selftest(ctx) {
const c = { id: 'x', need: 'mua', budget: 3e9, unit_type: '2N' };
const _oh = C.matchUnits(c, [{ id: 'p', name: 'P', price: [60, 70], types: [{ n: '2N', a: [50, 60] }], status: 'sale' }]);
if (!_oh.list.length || _oh.list[0].score < 80) return { ok: false, details: 'Ghép căn không ra kết quả mẫu' };
return g2Selftest(ctx, mount);
},
};

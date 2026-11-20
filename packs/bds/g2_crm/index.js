import { g2kit, h, g2Selftest } from '../g2_lib/ui.js';
import * as C from '../g2_lib/core.js';
const _o0 = 'bds.g2crm.tab';
const _op = (t, score) => h('span', { class: 'g2-tier g2-tier-' + t, 'data-testid': 'tier' }, C.TIER_LABEL[t] + (score !== undefined && t !== 'done' ? ' · ' + score : ''));
async function _ob(G) {
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
let tab = (() => { try { return localStorage.getItem(_o0) || 'funnel'; } catch { return 'funnel'; } })();
const _of = new URLSearchParams(location.hash.split('?')[1] || '');
if (_of.get('tab')) tab = _of.get('tab');
let pickId = _of.get('customer') || '';
let _oq = '';
el.innerHTML = '';
const tabsBox = h('div');
const body = h('div', { 'data-testid': 'g2crm-body' });
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'g2-crm' }, G.head('Khách & Phễu bán hàng'), tabsBox, body));
async function _oh() {
tabsBox.innerHTML = '';
tabsBox.appendChild(G.tabs([['funnel', 'Phễu 6 bước'], ['match', 'Ghép căn'], ['score', 'Nóng / Ấm / Lạnh']], tab, t => { tab = t; try { localStorage.setItem(_o0, t); } catch { } _oh(); }, 'g2crm-tab'));
const D = await _ob(G);
body.innerHTML = '';
if (tab === 'match') return _oj(D);
if (tab === 'score') return _ok(D);
return _oi(D);
}
function _oi(D) {
const _o2 = C.funnelBoard(D.customers);
body.appendChild(h('p', { class: 'bds-muted' }, 'Bước của khách lấy theo trạng thái trong hồ sơ. Bấm vào khách để chuyển bước – trạng thái và lịch sử khách được cập nhật theo. Tỉ lệ dưới mỗi bước = % khách đi tiếp từ bước trước.'));
const board = h('div', { class: 'g2-board', 'data-testid': 'g2-board' });
for (const _o4 of _o2.cols) {
const items = _o4.items.slice().sort((x, y) => (D.scored.get(y.id).score - D.scored.get(x.id).score));
board.appendChild(h('div', { class: 'g2-col', 'data-testid': 'g2-col-' + _o4.n },
h('h4', null, h('span', null, _o4.n + '. ' + _o4.label), h('small', null, String(_o4.items.length))),
h('small', null, _o4.n === 1 ? _o4.hint : _o4.rate + '% đi tiếp'),
items.slice(0, 40).map(c => h('button', { type: 'button', class: 'g2-card', 'data-testid': 'g2-card-' + c.id, onclick: () => _od(c.id) },
h('strong', null, c.name || '(chưa có tên)'),
h('span', null, [K.projectName(c.project), c.unit_type].filter(Boolean).join(' · ') || c.status || ''), ' ', _op(D.scored.get(c.id).tier, D.scored.get(c.id).score))),
items.length > 40 ? h('small', null, '+' + (items.length - 40) + ' khách') : null));
}
body.appendChild(board);
if (_o2.out.length) body.appendChild(h('p', { class: 'bds-muted' }, 'Ngoài phễu (tạm dừng / không tiềm năng): ' + _o2.out.length + ' khách.'));
if (!_o2.total) body.appendChild(K.empty('Chưa có khách. Thêm khách ở màn Khách hàng.'));
}
async function _od(id) {
const D = await _ob(G);
const c = D.customers.find(x => x.id === id);
if (!c) return;
const _o3 = h('div');
const _oo = K.sheet({ title: c.name || 'Khách', body: _o3, testid: 'g2-cust-sheet' });
const _o5 = C.stageOf(c.status);
const list = K.statuses(c.need);
const _om = D.scored.get(c.id);
_o3.append(
h('p', null, 'Trạng thái: ', K.badge(c.status || 'Mới', G.crm.statusTone(c.status)), ' ', _op(_om.tier, _om.score)),
h('div', { class: 'g2-pills', 'data-testid': 'g2-stages' }, C.FUNNEL.map(f => {
const st = C.statusForStage(f.n, list);
return K.button(f.n + '. ' + f.label, async () => {
if (!st) { K.toast('Khách nhu cầu "' + (c.need || 'mua') + '" không có bước ' + f.label + ' – chọn bước khác', 'warn'); return; }
const fresh = await K.get('objects', c.id);
await K.put('objects', { ...fresh, status: st });
await K.logEvent(c.id, 'status', 'Chuyển bước phễu: ' + f.label + ' (' + st + ')');
K.toast('Đã chuyển sang "' + f.label + '"', 'success');
_oo.close(); _oh();
}, { kind: f.n === _o5 ? 'primary' : 'ghost', icon: f.n === _o5 ? 'check' : st ? 'next' : 'x', testid: 'g2-stage-' + f.n, title: st ? 'Trạng thái: ' + st : 'Nhu cầu "' + (c.need || 'mua') + '" không có bước này' });
})),
h('h4', null, 'Vì sao ' + C.TIER_LABEL[_om.tier].toLowerCase() + ' (' + _om.score + ' điểm)'), _oe(_om.parts),
h('div', { class: 'bds-row bds-wrap' },
K.button('Mở hồ sơ khách', () => { _oo.close(); K.afterClose(() => K.openProfile(c.id)); }, { testid: 'g2-open-profile' }),
K.button('Ghép căn', () => { _oo.close(); pickId = c.id; tab = 'match'; _oh(); }, { kind: 'primary', testid: 'g2-to-match', icon: 'link' })));
}
function _oj(D) {
if (!pickId || !D.customers.some(c => c.id === pickId)) pickId = (D.customers.find(c => c.budget || c.unit_type) || D.customers[0] || {}).id || '';
const _on = G.customerSelect(D.customers, pickId, { 'aria-label': 'Khách', 'data-testid': 'g2-match-customer', onchange: e => { pickId = e.target.value; _oh(); } });
body.appendChild(K.field('Ghép cho khách', _on));
const c = D.customers.find(x => x.id === pickId);
if (!c) { body.appendChild(K.empty('Chưa có khách để ghép.')); return; }
body.appendChild(h('p', { class: 'bds-muted' }, 'Nhu cầu: ', [c.need || 'mua', c.budget ? 'vốn ' + K.money(c.budget) : 'chưa có vốn', c.unit_type || 'chưa chọn loại căn', c.project ? K.projectName(c.project) : 'chưa chọn dự án'].join(' · '),
'. Điểm = Ngân sách 40 + Loại căn 25 + Dự án/khu vực 20 + Tình trạng bán 10 + Độ mới của giá 5.'));
const _og = C.matchUnits(c, D.env.projects, { policyFresh: pid => !!D.env.active(pid), limit: 8 });
if (_og.note) body.appendChild(h('p', { class: 'bds-warn', 'data-testid': 'g2-match-note' }, _og.note));
const _o3 = h('div', { class: 'bds-list', 'data-testid': 'g2-match-list' });
for (const _os of _og.list) {
_o3.appendChild(K.card({ title: _os.project.name + ' · ' + _os.type + ' — ' + _os.score + ' điểm', testid: 'g2-unit-' + _os.key.replace(/[^a-z0-9]/gi, '_'),
body: [
h('div', { class: 'g2-bar' }, h('i', { style: { width: _os.score + '%' } })),
h('p', { class: 'bds-sub' }, _os.area[0] + '–' + _os.area[1] + ' m² · ' + _os.price_m2[0] + '–' + _os.price_m2[1] + ' triệu/m² · ước ' + C.moneyShort(_os.total[0]) + '–' + C.moneyShort(_os.total[1])),
h('ul', { class: 'g2-parts' }, _os.parts.map(p => h('li', null, h('span', null, p.label + ': ' + p.text), h('b', null, p.pts + '/' + p.max)))),
h('div', { class: 'bds-row bds-wrap' },
K.linkBtn('Báo giá căn này', '#/sales/quote?customer=' + encodeURIComponent(c.id) + '&project=' + encodeURIComponent(_os.project.id) + '&type=' + encodeURIComponent(_os.type), null, { kind: 'primary', icon: 'calculator', glyph: '🧾' }),
K.button('Ẩn căn này', async () => { const hidden = new Set(C.g2Of(c).hidden_matches || []); hidden.add(_os.key); await G.patchG2(c.id, { hidden_matches: [...hidden] }); _oh(); }, { testid: 'g2-hide-unit', icon: 'x' })),
] }));
}
if (!_og.list.length && !_og.note) _o3.appendChild(K.empty('Không có căn nào trong Bảng hàng hợp vốn của khách (đã loại ' + _og.excluded + ' căn vượt vốn quá 30%).'));
body.appendChild(_o3);
if (_og.list.length) {
body.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('Soạn tin gửi khách 3 căn hợp nhất', async () => {
const me = await K.me();
const _oa = _og.list.slice(0, 3).map((_os, i) => (i + 1) + '. ' + _os.project.name + ' – ' + _os.type + ' (' + _os.area[0] + '–' + _os.area[1] + ' m², khoảng ' + C.moneyShort(_os.total[0]) + '–' + C.moneyShort(_os.total[1]) + ')');
await G.compose(c, 'Dạ em chào anh/chị ' + G.crm.givenName(c.name) + ', theo nhu cầu anh/chị chia sẻ, em lọc được các căn phù hợp:\n' + _oa.join('\n') + '\nGiá trên là giá tham khảo, em gửi bảng tính chi tiết theo chính sách hiện hành khi anh/chị chọn căn ạ. Em ' + (me.name || '') + '.');
}, { testid: 'g2-match-compose', icon: 'chat' }),
C.g2Of(c).hidden_matches && C.g2Of(c).hidden_matches.length ? K.button('Hiện lại căn đã ẩn', async () => { await G.patchG2(c.id, { hidden_matches: [] }); _oh(); }, { icon: 'eye' }) : null));
}
}
function _ok(D) {
const _ol = D.customers.map(c => ({ c, s: D.scored.get(c.id) })).sort((a, _o2) => _o2.s.score - a.s.score);
const count = t => _ol.filter(_og => _og.s.tier === t).length;
body.appendChild(h('div', { class: 'bds-stats' }, ['hot', 'warm', 'cold', 'done'].map(t => h('button', { type: 'button', class: 'bds-stat bds-chip' + (_oq === t ? ' bds-on' : ''), 'data-testid': 'g2-tier-f-' + t, onclick: () => { _oq = _oq === t ? '' : t; _oh(); } },
h('strong', null, String(count(t))), ' ', C.TIER_LABEL[t]))));
body.appendChild(h('p', { class: 'bds-muted' }, 'Nóng ≥ ' + D.config.tiers.hot + ' điểm · Ấm ≥ ' + D.config.tiers.warm + ' điểm · còn lại Lạnh. Điểm chỉ dựa trên hành vi đã ghi trong app (gọi, nhắn, lịch xem, báo giá, bước phễu) – bấm vào khách để xem từng phần.'));
const _o3 = h('div', { class: 'bds-list', 'data-testid': 'g2-score-list' });
for (const { c, s } of _ol.filter(_og => !_oq || _og.s.tier === _oq).slice(0, 200)) {
const _o6 = h('div', { hidden: true }, _oe(s.parts));
_o3.appendChild(h('div', { class: 'bds-item', 'data-testid': 'g2-score-' + c.id },
h('button', { type: 'button', class: 'bds-row-main', onclick: () => { _o6.hidden = !_o6.hidden; } },
h('strong', null, c.name || '(chưa có tên)'), h('span', { class: 'bds-sub' }, (c.status || 'Mới') + (s.silent ? ' · im lặng ' + s.silent + ' ngày' : ''))),
_op(s.tier, s.score), h('div', { class: 'bds-acts' }, K.callBtn(c, { short: true })), _o6));
}
if (!_ol.length) _o3.appendChild(K.empty('Chưa có khách.'));
body.appendChild(_o3);
const _o1 = h('div', { class: 'bds-row bds-wrap' },
K.button('Ghi điểm vào hồ sơ khách', async () => {
let n = 0;
for (const { c, s } of _ol) {
if (Number(c.score) === s.score) continue;
const fresh = await K.get('objects', c.id);
if (fresh) { await K.put('objects', { ...fresh, score: s.score }); n++; }
}
K.toast(n ? 'Đã ghi điểm cho ' + n + ' khách – Bảng tin dùng điểm này để lọc khách nóng' : 'Điểm đã khớp, không cần ghi', 'success');
}, { testid: 'g2-score-save', title: 'Bảng tin 7h coi khách ≥ 70 điểm là khách nóng', icon: 'disk' }),
G.isStaff() ? K.button('Sửa luật chấm điểm', () => _o7(D), { testid: 'g2-weights', icon: 'settings' }) : null);
body.appendChild(_o1);
}
function _o7(D) {
const _o9 = {};
const _or = { hot: h('input', { type: 'number', value: D.config.tiers.hot, min: 1, max: 100, 'data-testid': 'g2-w-hot' }), warm: h('input', { type: 'number', value: D.config.tiers.warm, min: 0, max: 100, 'data-testid': 'g2-w-warm' }) };
const _o8 = h('div', { class: 'g2-weights' },
h('p', { class: 'bds-muted' }, 'Điểm mỗi lần (số lần tối đa được tính ghi trong ngoặc). Đổi xong cả đội dùng chung.'),
C.SCORE_RULES.map(_og => h('label', null, h('span', null, _og.label + ' (tối đa ' + _og.cap + ')'), _o9[_og.id] = h('input', { type: 'number', step: 1, value: D.config.rules.find(x => x.id === _og.id).w, 'data-testid': 'g2-w-' + _og.id }))),
h('label', null, h('span', null, 'Ngưỡng Nóng'), _or.hot), h('label', null, h('span', null, 'Ngưỡng Ấm'), _or.warm));
let _oc;
const save = async () => {
const weights = {};
for (const _og of C.SCORE_RULES) { const _ot = Number(_o9[_og.id].value); if (Number.isFinite(_ot)) weights[_og.id] = Math.max(-50, Math.min(50, _ot)); }
await K.setSetting('g2.score', { weights, tiers: { hot: Number(_or.hot.value) || 70, warm: Number(_or.warm.value) || 40 }, by: G.user().id, at: Date.now() });
_oc.close(); K.toast('Đã lưu luật chấm điểm', 'success'); _oh();
};
_oc = K.modal({ title: 'Luật chấm điểm khách', testid: 'g2-weights-modal', body: [_o8, h('div', { class: 'bds-row bds-end' },
K.button('Về mặc định', async () => { await K.setSetting('g2.score', null); _oc.close(); _oh(); }, { icon: 'undo' }),
K.button('Lưu', save, { kind: 'primary', testid: 'g2-weights-save' }))] });
}
await _oh();
K.on(el, ['objects', 'events', 'reminders', 'settings'], _oh);
}
function _oe(parts) {
if (!parts.length) return h('p', { class: 'bds-muted' }, 'Chưa có hành vi nào được ghi.');
return h('ul', { class: 'g2-parts' }, parts.map(p => h('li', null, h('span', null, p.label + (p.count > 1 ? ' × ' + p.count : '')), h('b', null, (p.pts > 0 ? '+' : '') + p.pts))));
}
export default {
manifest: { id: 'g2_crm', title: 'Khách & Phễu bán hàng', icon: '🎯', screen: 'customers', order: 210, version: '0.1.0', status: 'thu-nghiem', pack: 'care',
help: 'Phễu 6 bước theo trạng thái khách, tự ghép nhu cầu với căn trong Bảng hàng (có giải thích điểm), chấm điểm khách Nóng/Ấm/Lạnh theo hành vi.' },
mount,
async selftest(ctx) {
const c = { id: 'x', need: 'mua', budget: 3e9, unit_type: '2N' };
const _og = C.matchUnits(c, [{ id: 'p', name: 'P', price: [60, 70], types: [{ n: '2N', a: [50, 60] }], status: 'sale' }]);
if (!_og.list.length || _og.list[0].score < 80) return { ok: false, details: 'Ghép căn không ra kết quả mẫu' };
return g2Selftest(ctx, mount);
},
};

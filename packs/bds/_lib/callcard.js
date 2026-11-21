import { kit, h } from './kit.js';
import * as L from './callcard_logic.js';
const _o0 = 'bds-callcard-css';
let _oa = null;
function ensureCss() {
if (_oa) return _oa;
_oa = new Promise(res => {
if (typeof document === 'undefined' || document.getElementById(_o0)) return res();
const _oh = h('link', { id: _o0, rel: 'stylesheet', href: new URL('./callcard.css', import.meta.url).href });
_oh.addEventListener('load', () => res()); _oh.addEventListener('error', () => res());
setTimeout(res, 1500);
document.head.appendChild(_oh);
});
return _oa;
}
const _o2 = [['anh', 'Anh'], ['chị', 'Chị'], ['cô', 'Cô'], ['chú', 'Chú'], ['anh/chị', 'Anh/chị']];
const _oj = ms => { const _ob = new Date(ms); return new Date(_ob.getTime() - _ob.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
let current = null;
function _oq(box, a) {
box.classList.remove('cc-top'); box.style.maxHeight = '';
if (!a || !(a.width || a.height)) return;
const _of = () => { const _o8 = box.getBoundingClientRect(); return !(_o8.bottom <= a.top || _o8.top >= a.bottom || _o8.right <= a.left || _o8.left >= a.right); };
if (!_of()) return;
box.classList.add('cc-top');
if (!_of()) return;
const top = box.getBoundingClientRect().top;
box.classList.remove('cc-top');
const bottom = box.getBoundingClientRect().bottom;
const _o3 = a.top - 8 - top, below = bottom - a.bottom - 8;
box.classList.toggle('cc-top', _o3 >= below);
box.style.maxHeight = Math.max(140, Math.max(_o3, below)) + 'px';
}
async function _oi(ctx, _o1) {
try { if (ctx.packs && typeof ctx.packs.moduleOn === 'function' && !ctx.packs.moduleOn('g2_tuvan')) return null; } catch { return null; }
try {
const [O, T] = await Promise.all([import('../g2_lib/objection_stats.js'), import('../g2_lib/talk.js')]);
const [cfg, objs] = await Promise.all([_o1.setting('g2.scripts', null), _o1.list('objects')]);
const _o11 = ctx.user;
const _om = objs.filter(o => o.kind === 'g2_script' && (!_o11 || o.owner === _o11.id || o.created_by === _o11.id || !o.owner));
const uses = objs.filter(o => o.kind === O.USE_KIND);
return { O, list: T.mergeScripts(cfg, _om), uses, stats: O.useStats(O.parseUses(uses)) };
} catch { return null; }
}
export function closeCallCard() {
if (!current) return;
try { current.off && current.off(); } catch { }
current.remove(); current = null;
}
const _ox = () => ((typeof location !== 'undefined' && location.hash.match(/^#\/([^/?]+)/)) || [])[1] || '';
export async function openCallCard(ctx, customer, { avoid = null } = {}) {
if (!L.isCallable(customer) || typeof document === 'undefined') return null;
const _o1 = kit(ctx);
await ensureCss();
closeCallCard();
const box = h('aside', { class: 'cc', role: 'dialog', 'aria-modal': 'false', 'aria-label': 'Thẻ gợi ý cuộc gọi', 'data-testid': 'callcard' });
current = box;
document.body.appendChild(box);
const _ow = _ox();
const _on = () => { if (current === box && _ox() !== _ow) closeCallCard(); };
window.addEventListener('hashchange', _on);
box.off = () => window.removeEventListener('hashchange', _on);
let c = (await _o1.get('objects', customer.id)) || customer;
const [prof, bank] = await Promise.all([_o1.me(), _oi(ctx, _o1)]);
if (current !== box) return null;
const me = { name: (ctx.user && ctx.user.full_name) || prof.name || '' };
const opts = () => ({ me, projectName: _o1.projectName, now: Date.now() });
let xh = L.salutation(c);
let lines = L.openers(c, { ...opts(), xh });
let _og = 0, rx = '', logOpen = false, outcome = '';
const _ot = async () => { c = (await _o1.get('objects', c.id)) || c; };
const head = h('div', { class: 'cc-h' },
h('strong', { 'data-testid': 'cc-name' }, '📞 ' + (c.name || 'Khách') + ' · ' + _o1.phone(c.phone)),
_o1.linkBtn('📞 Gọi', _o1.tel(c.phone), () => { _o1.logEvent(c.id, 'call', 'Gọi ' + _o1.phone(c.phone)); }, { kind: 'primary', testid: 'cc-call' }),
h('button', { type: 'button', class: 'cc-x', 'aria-label': 'Thu gọn', 'aria-expanded': 'true', 'data-testid': 'cc-min', onclick: e => {
const _ol = box.classList.toggle('cc-min'); e.currentTarget.setAttribute('aria-expanded', String(!_ol)); e.currentTarget.textContent = _ol ? '▴' : '▾';
} }, '▾'),
h('button', { type: 'button', class: 'cc-x', 'aria-label': 'Đóng', 'data-testid': 'cc-close', onclick: closeCallCard }, '✕'));
const body = h('div', { class: 'cc-b' });
box.append(head, body);
const _o9 = (label, on, onclick, testid) => h('button', { type: 'button', class: 'bds-chip' + (on ? ' bds-on' : ''), 'aria-pressed': String(!!on), 'data-testid': testid, onclick }, label);
const _oy = (title, ...kids) => h('section', { class: 'cc-s' }, h('h4', null, title), ...kids);
function _oc() {
const _o5 = L.answersOf(c);
const nodes = [];
nodes.push(h('div', { class: 'cc-row', role: 'group', 'aria-label': 'Xưng hô' }, h('span', { class: 'cc-small' }, 'Xưng hô:'),
_o2.map(([id, _oh]) => _o9(_oh, xh === id, () => _oz(id), 'cc-xh-' + (id === 'anh/chị' ? 'any' : id)))));
nodes.push(_oy('① Mở đầu 10 giây',
h('p', { class: 'cc-say', 'data-testid': 'cc-opener' }, lines[_og] || ''),
h('div', { class: 'cc-row' },
_o1.button('↻ Câu khác (' + (_og + 1) + '/' + lines.length + ')', () => { _og = (_og + 1) % lines.length; _oc(); }, { testid: 'cc-next' }),
_o1.button('✨ AI biến tấu', aiVary, { ai: 'zalo_draft', testid: 'cc-ai', title: 'AI chỉ nhận câu mẫu có chỗ trống – không nhận tên, số điện thoại hay dự án của khách' }))));
nodes.push(_oy('② Hỏi nhu cầu (bấm là ghi vào hồ sơ)', ...L.QUESTIONS.map(q => h('div', { 'data-testid': 'cc-q-' + q.id },
h('p', { class: 'cc-q' }, L.questionText(q, xh)),
h('div', { class: 'cc-chips' }, q.chips.map(ch => _o9(ch.label, _o5[q.id] === ch.id, () => _o6(q, ch), 'cc-a-' + q.id + '-' + ch.id)))))));
const _oo = h('div', { 'data-testid': 'cc-rx-out' });
if (rx) _oo.appendChild(_os(rx));
nodes.push(_oy('③ Khách nói…',
h('div', { class: 'cc-chips', role: 'group', 'aria-label': 'Câu từ chối' }, L.REFLEXES.map(r => _o9(r.label, rx === r.id, () => { rx = rx === r.id ? '' : r.id; _oc(); }, 'cc-rx-' + r.id))),
_oo));
nodes.push(logOpen ? _ok() : h('div', { class: 'cc-row' }, _o1.button('📝 Ghi nhanh sau cuộc gọi', () => { logOpen = true; _oc(); }, { kind: 'primary', testid: 'cc-log' })));
body.replaceChildren(...nodes);
_oq(box, avoid);
}
async function _oz(id) {
xh = id; lines = L.openers(c, { ...opts(), xh }); _og = 0; _oc();
try { await _ot(); await _o1.put('objects', { ...c, data: _o1.crm.patchData(c, { xung_ho: id === 'anh/chị' ? null : id }) }); await _ot(); } catch { }
}
async function _o6(q, ch) {
try {
await _ot();
const _ou = L.answerRow(c, q.id, ch.id, { now: Date.now() });
await _o1.put('objects', _ou);
c = _ou;
_o1.toast('Đã ghi vào hồ sơ: ' + q.label + ' – ' + ch.label, 'success');
} catch (e) { _o1.toast((e && e.message) || 'Chưa ghi được', 'warn'); }
_oc();
}
function _os(id) {
const r = L.REFLEXES.find(x => x.id === id);
let best = null;
if (bank && r.objection) {
try {
const _o8 = bank.O.bestFor(r.objection, bank.list, bank.stats).best;
if (_o8) best = { id: _o8.id, text: bank.O.personalize(_o8, c, { projectName: _o1.projectName, money: _o1.money, me }).text };
} catch { best = null; }
}
const rep = L.reflexReply(id, { xh, bank: best });
const _o10 = bank ? bank.stats[rep.scriptId] : null;
return h('div', { class: 'cc-s', 'data-testid': 'cc-rx-reply' },
...rep.lines.map(t => h('p', { class: 'cc-say' }, t)),
h('p', { class: 'cc-small', 'data-testid': 'cc-rx-src' }, rep.source === 'kho' ? '📚 Kịch bản hiệu quả nhất trong kho · ' + bank.O.statLine(_o10) : '📝 Mẫu có sẵn' + (bank && _o10 ? ' · ' + bank.O.statLine(_o10) : '')),
bank ? h('div', { class: 'cc-row', role: 'group', 'aria-label': 'Ghi kết quả câu trả lời' },
_o1.button('Khách mở lòng', () => _or(rep, r, 'open'), { testid: 'cc-rx-open' }),
_o1.button('Vẫn từ chối', () => _or(rep, r, 'no'), { testid: 'cc-rx-no' })) : null);
}
async function _or(rep, r, result) {
try {
const _od = (await _o1.list('objects')).filter(o => o.kind === bank.O.USE_KIND);
const _ou = bank.O.useRow({ scriptId: rep.scriptId, customerId: c.id, result, by: (ctx.user && ctx.user.id) || '', now: Date.now(), objection: r.objection }, _od);
const _o4 = !!_ou.id;
const _ov = await _o1.put('objects', _ou);
bank.uses = _od.filter(o => o.id !== _ov.id).concat(_ov);
bank.stats = bank.O.useStats(bank.O.parseUses(bank.uses));
_o1.toast(_o4 ? 'Đã sửa kết quả lần dùng vừa rồi' : 'Đã ghi kết quả vào thống kê kịch bản', 'success');
} catch (e) { _o1.toast((e && e.message) || 'Chưa ghi được', 'warn'); }
_oc();
}
async function aiVary() {
if (!ctx.ai || typeof ctx.ai.run !== 'function') { _o1.toast('Chưa bật AI trong Cài đặt – dùng 3 câu mẫu có sẵn', 'info'); return; }
try {
const r = await ctx.ai.run('zalo_draft', { prompt: L.aiOpenerPrompt({ xh }), json: true, feature: 'zalo_draft' });
const t = r && (typeof r === 'string' ? r : (r.text || r.output || (r.data && r.data.text) || ''));
const _oe = L.parseAiOpeners(t, c, { ...opts(), xh });
if (!_oe.length) { _o1.toast('AI chưa trả lời được – dùng câu mẫu', 'warn'); return; }
lines = _oe; _og = 0; _oc();
_o1.toast('Đã có ' + _oe.length + ' câu mới (AI không nhận dữ liệu khách)', 'success');
} catch (e) { if (!(_o1.isAiCancel && _o1.isAiCancel(e))) _o1.toast((e && e.message) || 'AI chưa trả lời được', 'warn'); }
}
function _ok() {
const note = h('textarea', { rows: 2, placeholder: 'Ghi chú ngắn (khách nói gì, cần gửi gì…)', 'data-testid': 'cc-note', 'aria-label': 'Ghi chú cuộc gọi' });
const _o7 = h('input', { type: 'datetime-local', 'data-testid': 'cc-remind-at', 'aria-label': 'Thời gian hẹn' });
const chk = h('input', { type: 'checkbox', 'data-testid': 'cc-remind' });
const remindRow = h('div', { class: 'cc-s' }, h('label', { class: 'cc-chk' }, chk, h('span', { 'data-testid': 'cc-remind-label' }, '')), _o7);
const _op = o => {
outcome = o;
for (const _o8 of outs.querySelectorAll('button')) { const on = _o8.dataset.o === o; _o8.classList.toggle('bds-on', on); _o8.setAttribute('aria-pressed', String(on)); }
chk.checked = L.suggestRemind(o);
remindRow.querySelector('[data-testid="cc-remind-label"]').textContent = o === 'viewing' ? 'Tạo lịch hẹn xem nhà' : 'Tạo nhắc gọi lại';
_o7.value = _oj(L.defaultRemindAt(o, Date.now()));
remindRow.hidden = false;
};
const outs = h('div', { class: 'cc-chips', role: 'group', 'aria-label': 'Kết quả cuộc gọi' }, L.OUTCOMES.map(([id, _oh]) => {
const _o8 = _o9(_oh, false, () => _op(id), 'cc-out-' + id); _o8.dataset.o = id; return _o8;
}));
remindRow.hidden = true;
const save = async () => {
try {
const { event, reminder } = L.callLog({ customer: c, outcome, note: note.value, remind: chk.checked, remindAt: new Date(_o7.value).getTime(), now: Date.now(), projectName: _o1.projectName });
await _o1.put('events', event);
if (reminder) await _o1.put('reminders', reminder);
_o1.toast(reminder ? 'Đã ghi cuộc gọi và tạo ' + (reminder.kind === 'meeting' ? 'lịch hẹn' : 'nhắc gọi lại') : 'Đã ghi cuộc gọi', 'success');
closeCallCard();
} catch (e) { _o1.toast((e && e.message) || 'Chưa ghi được', 'warn'); }
};
return h('div', { class: 'cc-log', 'data-testid': 'cc-log-form' }, h('p', { class: 'cc-q' }, 'Kết quả cuộc gọi'), outs, note, remindRow,
h('div', { class: 'cc-row' }, _o1.button('Lưu vào dòng thời gian', save, { kind: 'primary', testid: 'cc-log-save' }), _o1.button('Để sau', () => { logOpen = false; outcome = ''; _oc(); }, { testid: 'cc-log-cancel' })));
}
_oc();
return { el: box, close: closeCallCard };
}

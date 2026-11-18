import { g5, h, selftestWith } from '../g5_lib/ui.js';
import * as R from '../g5_lib/roleplay.js';
const KIND = 'g5_luyen';
const _o0 = 12;
export async function mount(el, ctx) {
const G = g5(ctx), K = G.K;
const st = { persona: null, history: [], scripted: !G.aiReady(), busy: false, done: false, local: null, ai: null };
const _og = h('div', { class: 'g5', 'data-testid': 'g5-luyentuvan' });
el.replaceChildren(_og);
const _od = h('div', { class: 'g5-grid g5-grid-3', 'data-testid': 'lt-personas' });
const modeCb = h('input', { type: 'checkbox', checked: st.scripted, 'data-testid': 'lt-scripted', onchange: (e) => { st.scripted = e.target.checked; } });
const _o4 = h('div', { class: 'g5-chat', 'data-testid': 'lt-chat', 'aria-live': 'polite' });
const input = h('textarea', { rows: 3, placeholder: 'Anh/chị trả lời khách…', 'data-testid': 'lt-input', onkeydown: (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); _oj(); } } });
const scoreBox = h('div', { 'data-testid': 'lt-score' });
const _ob = h('div', { class: 'g5-list', 'data-testid': 'lt-history' });
const talk = K.card({ title: 'Hội thoại', body: [_o4, input, h('div', { class: 'g5-row' },
K.button('Gửi', () => _oj(), { kind: 'primary', testid: 'lt-send', aiBadge: st.scripted ? null : 'g5_practice' }),
K.button('Kết thúc & chấm điểm', () => _o9(), { testid: 'lt-finish', icon: 'check' }),
K.button('Làm lại', () => start(st.persona), { testid: 'lt-restart', icon: 'refresh' }))] });
talk.hidden = true;
_og.append(
G.head('Luyện tư vấn với AI', 'Chọn một vị khách khó tính, trò chuyện như thật, rồi xem điểm theo 7 tiêu chí: mở đầu, hỏi nhu cầu, lắng nghe, xử lý từ chối, thông tin đúng, chốt bước tiếp theo, thái độ.', 'lt-head'),
G.note(R.NOTE, 'info'),
K.card({ title: 'Chọn khách để luyện', body: [_od, h('label', { class: 'g5-row g5-small' }, modeCb, 'Dùng kịch bản có sẵn (không cần AI, không tốn phí)'),
G.aiReady() ? null : G.note('Chưa nối AI – đang dùng kịch bản có sẵn. Nối Gemini/Ollama ở Cài đặt để khách phản ứng linh hoạt hơn.', 'info', 'lt-no-ai')] }),
talk, scoreBox,
K.card({ title: 'Lịch sử luyện tập', body: _ob }),
);
_od.replaceChildren(...R.PERSONAS.map((p) => h('button', { type: 'button', class: 'bds-card g5-li', 'data-testid': 'lt-persona-' + p.id, onclick: () => start(p) },
h('div', null, h('b', null, p.avatar + ' ' + p.name), h('div', { class: 'bds-muted g5-small' }, p.brief)), K.badge(p.level, p.level === 'Khó' ? 'danger' : 'warn'))));
function _o3(m) { return h('div', { class: 'g5-msg g5-msg-' + m.role, 'data-testid': 'lt-msg-' + m.role }, m.text); }
function _o6() { _o4.replaceChildren(...st.history.map(_o3)); _o4.scrollTop = _o4.scrollHeight; }
function start(p) {
if (!p) return;
_ok = null;
Object.assign(st, { persona: p, history: [{ role: 'customer', text: p.opening, kind: 'opening' }], done: false, local: null, ai: null });
talk.hidden = false; scoreBox.replaceChildren(); input.value = ''; _o6();
talk.querySelector('.bds-card-h h3').textContent = 'Hội thoại với ' + p.name;
input.focus();
}
async function _oj() {
const text = input.value.trim();
if (!st.persona || st.busy) return;
if (st.done) { if (text) K.toast('Phiên này đã chấm điểm xong – bấm "Luyện lại khách này" để luyện phiên mới.', 'warn'); return; }
if (!text) return;
st.history.push({ role: 'sale', text }); input.value = ''; _o6();
st.busy = true;
try {
let _of, end = false, kind = 'ai';
if (st.scripted) { const _oe = R.scriptedReply(st.persona, st.history); _of = _oe.text; end = _oe.end; kind = _oe.kind; }
else {
try { const t = await G.ai(R.personaPrompt(st.persona, st.history), { feature: 'g5_practice' }); end = R.isEnd(t); _of = R.stripEnd(t) || '…'; }
catch (e) { const _oe = R.scriptedReply(st.persona, st.history); _of = _oe.text; end = _oe.end; kind = _oe.kind; if (K.isAiCancel(e)) st.scripted = true; else K.toast('AI chưa trả lời được – dùng kịch bản có sẵn cho lượt này.', 'warn'); }
}
st.history.push({ role: 'customer', text: _of, kind }); _o6();
const _ol = st.history.filter((m) => m.role === 'sale').length;
if (end || _ol >= _o0) await _o9();
} finally { st.busy = false; }
}
async function _o9() {
if (!st.persona || st.done) return;
if (!st.history.some((m) => m.role === 'sale')) return K.toast('Hãy trả lời khách ít nhất một lần.', 'warn');
st.done = true;
st.local = R.localScore(st.history);
_o8();
await _oi();
}
function _o2(scores) {
return h('div', { class: 'g5-score' }, ...R.RUBRIC.map((_oe) => h('div', { 'data-testid': 'lt-crit-' + _oe.id },
h('div', { class: 'g5-row g5-small' }, h('span', null, _oe.label), h('b', null, `${scores[_oe.id] || 0}/${_oe.max}`)),
h('div', { class: 'g5-bar' }, h('i', { style: { width: Math.round(100 * (scores[_oe.id] || 0) / _oe.max) + '%' } })))));
}
function _o8() {
const L = st.local; if (!L) return;
const _oc = [
h('div', { class: 'g5-row' }, h('div', { class: 'g5-stat' }, h('b', { 'data-testid': 'lt-total' }, L.total + '/100'), h('span', null, 'Chấm máy · ' + R.gradeLabel(L.total))),
st.ai ? h('div', { class: 'g5-stat' }, h('b', { 'data-testid': 'lt-ai-total' }, st.ai.total + '/100'), h('span', null, 'AI chấm · ' + R.gradeLabel(st.ai.total))) : null),
_o2(st.ai ? st.ai.scores : L.scores),
...L.flags.map((f) => G.note('⚠ ' + f, 'danger')),
L.strengths.length ? h('p', { class: 'g5-small' }, h('b', null, 'Làm tốt: '), L.strengths.join(', ')) : null,
L.improve.length ? h('ul', { class: 'g5-small' }, ...L.improve.map((x) => h('li', null, x))) : null,
st.ai ? h('div', { class: 'g5-small' }, st.ai.improve.length ? h('p', null, h('b', null, 'AI góp ý: '), st.ai.improve.join(' · ')) : null,
st.ai.better.length ? h('p', null, h('b', null, 'Câu nói mẫu: '), st.ai.better.join(' · ')) : null) : null,
h('div', { class: 'g5-row' }, !st.ai ? K.button('✨ Nhờ AI chấm kỹ', () => _o1(), { ai: 'g5_practice', testid: 'lt-ai-grade' }) : null,
K.button('Luyện lại khách này', () => start(st.persona), { kind: 'primary', testid: 'lt-again', icon: 'refresh' })),
h('p', { class: 'bds-muted g5-small' }, 'Chấm máy dựa trên dấu hiệu câu chữ (câu hỏi, nhắc lại ý khách, dẫn chứng, hẹn có thời gian, từ ngữ hứa hẹn) – là gợi ý luyện tập.'),
];
scoreBox.replaceChildren(K.card({ title: 'Kết quả – ' + st.persona.name, body: _oc }));
}
async function _o1() {
try {
const t = await G.ai(R.gradePrompt(st.persona, st.history), { json: true, feature: 'g5_practice' });
const _oa = R.parseAiGrade(t);
if (!_oa) return K.toast('AI trả lời chưa đúng mẫu chấm điểm – giữ điểm chấm máy.', 'warn');
st.ai = _oa; _o8(); await _oi();
} catch (e) { if (!K.isAiCancel(e)) K.toast('AI chưa chấm được: ' + (e.message || ''), 'warn'); }
}
let _ok = null;
async function _oi() {
const _oh = await G.saveDoc(KIND, { id: _ok, name: st.persona.name, data: { persona: st.persona.id, history: st.history.slice(-40), local: st.local && { total: st.local.total, scores: st.local.scores }, ai: st.ai && { total: st.ai.total, scores: st.ai.scores }, at: Date.now() } });
_ok = _oh.id; _o7();
}
async function _o7() {
const _o5 = await G.listDocs(KIND);
_ob.replaceChildren(...(_o5.length ? _o5.slice(0, 20).map((d) => h('div', { class: 'g5-li' },
h('div', null, h('b', null, d.name), h('div', { class: 'bds-muted g5-small' }, new Date(d.data.at || d.updated_at).toLocaleString('vi-VN') + ` · ${(d.data.history || []).filter((m) => m.role === 'sale').length} lượt`)),
K.badge(((d.data.ai && d.data.ai.total) ?? (d.data.local && d.data.local.total) ?? 0) + '/100', 'info'))) : [K.empty('Chưa có phiên luyện nào.')]));
}
_o7();
return _og;
}
export default {
manifest: {
id: 'g5_luyentuvan', title: 'Luyện tư vấn với AI', icon: '🎭', screen: 'home', order: 510, version: '0.1.0', status: 'ready',
desc: 'Thử nghiệm · khách khó tính, chấm điểm 7 tiêu chí',
help: 'AI (hoặc kịch bản có sẵn khi chưa nối AI) đóng vai khách khó tính: nhà đầu tư kỹ tính, người sợ vay, khách nghi pháp lý, khách bận, khách đang được sàn khác chào. Kết thúc là có điểm và góp ý.',
},
mount,
async selftest(ctx) { return selftestWith(ctx, () => R.localScore([{ role: 'sale', text: 'Dạ em chào anh, anh cần căn mấy phòng ạ?' }]).total > 0); },
};

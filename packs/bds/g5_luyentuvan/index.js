import { g5, h, selftestWith } from '../g5_lib/ui.js';
import * as R from '../g5_lib/roleplay.js';
const KIND = 'g5_luyen';
const _o1 = 12;
export async function mount(el, ctx) {
const G = g5(ctx), K = G.K;
const st = { persona: null, history: [], busy: false, done: false, local: null, ai: null };
const _o0 = '#/settings/connection/gemini';
const _om = h('div', { class: 'g5', 'data-testid': 'g5-luyentuvan' });
el.replaceChildren(_om);
const _ok = h('div', { class: 'g5-grid g5-grid-3', 'data-testid': 'lt-personas' });
const _o5 = h('div', { class: 'g5-chat', 'data-testid': 'lt-chat', 'aria-live': 'polite' });
const input = h('textarea', { rows: 3, placeholder: 'Anh/chị trả lời khách…', 'data-testid': 'lt-input', onkeydown: (e) => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); _oq(); } } });
const scoreBox = h('div', { 'data-testid': 'lt-score' });
const _of = h('div', { class: 'g5-list', 'data-testid': 'lt-history' });
const talk = K.card({ title: 'Hội thoại', body: [_o5, input, h('div', { class: 'g5-row' },
K.button('Gửi', () => _oq(), { kind: 'primary', testid: 'lt-send', aiBadge: 'g5_practice' }),
K.button('Kết thúc & chấm điểm', () => _od(), { testid: 'lt-finish', icon: 'check' }),
K.button('Làm lại', () => start(st.base), { testid: 'lt-restart', icon: 'refresh' }),
K.button('Xoá hội thoại', () => _o6(), { kind: 'ghost', testid: 'lt-clear-chat', icon: 'x' }))] });
talk.hidden = true;
_om.append(
G.head('Luyện tư vấn với AI', 'Chọn một vị khách khó tính, trò chuyện như thật, rồi xem điểm theo 7 tiêu chí: mở đầu, hỏi nhu cầu, lắng nghe, xử lý từ chối, thông tin đúng, chốt bước tiếp theo, thái độ.', 'lt-head', false),
G.note(R.NOTE, 'info'),
K.card({ title: 'Chọn khách để luyện', body: [_ok, _oh()] }),
talk, scoreBox,
K.card({ title: 'Lịch sử luyện tập', body: _of }),
);
_ok.replaceChildren(h('button', { type: 'button', class: 'bds-card g5-li', 'data-testid': 'lt-persona-rand', onclick: () => _os() },
h('div', null, h('b', null, '🎲 Khách ngẫu nhiên'), h('div', { class: 'bds-muted g5-small' }, 'Mỗi lần một vị khách mới: hoàn cảnh, khu vực, băn khoăn khác nhau.'))),
...R.PERSONAS.map((_oi) => h('button', { type: 'button', class: 'bds-card g5-li', 'data-testid': 'lt-persona-' + _oi.id, onclick: () => start(_oi) },
h('div', null, h('b', null, _oi.avatar + ' ' + _oi.name), h('div', { class: 'bds-muted g5-small' }, _oi.brief)), K.badge(_oi.level, _oi.level === 'Khó' ? 'danger' : 'warn'))));
function _oh() {
if (G.aiReady()) return null;
return h('div', { class: 'bds-warn', 'data-testid': 'lt-no-ai' },
h('p', null, 'Luyện tư vấn cần AI: công ty chưa có khoá Gemini. Chủ/Quản lý thêm khoá ở Cài đặt › Kết nối › Gemini rồi mở lại màn này.'),
K.button('Mở Cài đặt › Kết nối', () => { location.hash = _o0; }, { kind: 'primary', icon: 'key', testid: 'lt-open-conn' }));
}
function _og() {
if (G.aiReady()) return true;
K.toast('Chưa có khoá Gemini – thêm ở Cài đặt › Kết nối để luyện với AI.', 'warn');
return false;
}
function _o4(m) { return h('div', { class: 'g5-msg g5-msg-' + m.role, 'data-testid': 'lt-msg-' + m.role }, m.text); }
function _oa() { _o5.replaceChildren(...st.history.map(_o4)); _o5.scrollTop = _o5.scrollHeight; }
async function _os() {
if (st.busy || !_og()) return;
const _op = R.randomSeed();
let _oi = R.localPersona(_op);
st.busy = true; talk.hidden = false; scoreBox.replaceChildren();
_o5.replaceChildren(h('div', { class: 'g5-msg g5-msg-customer bds-muted', 'data-testid': 'lt-wait' }, '…'));
try { _oi = R.parsePersona(await G.ai(R.newPersonaPrompt(_op), { json: true, feature: 'g5_practice' }), _op) || _oi; }
catch (e) { if (K.isAiCancel(e)) { st.busy = false; talk.hidden = true; return; } }
finally { st.busy = false; }
start(_oi);
}
function start(base) {
if (!base || !_og()) return;
const _oi = R.varyPersona(base);
_or = null;
st.base = base;
Object.assign(st, { persona: _oi, history: [{ role: 'customer', text: _oi.opening, kind: 'opening' }], done: false, local: null, ai: null });
talk.hidden = false; scoreBox.replaceChildren(); input.value = ''; _oa();
talk.querySelector('.bds-card-h h3').textContent = 'Hội thoại với ' + _oi.name;
input.focus();
}
function _o6() {
_or = null;
Object.assign(st, { persona: null, history: [], done: false, local: null, ai: null });
_o5.replaceChildren(); scoreBox.replaceChildren(); input.value = ''; talk.hidden = true;
}
async function _o9(_o7) {
if (!(await G.confirmDel(_o7.name + ' (' + new Date(_o7.data.at || _o7.updated_at).toLocaleDateString('vi-VN') + ')', 'lt-del-confirm'))) return;
await G.removeDoc(_o7.id);
if (_or === _o7.id) _o6();
K.toast('Đã xoá phiên luyện', 'ok'); _ob();
}
async function _o8(docs) {
if (!(await K.confirm({ title: 'Xoá toàn bộ lịch sử luyện', text: `Xoá ${docs.length} phiên luyện đã lưu? Không hoàn tác được.`, ok: 'Xoá tất cả', kind: 'danger', testid: 'lt-clear-all-confirm' }))) return;
for (const _o7 of docs) await G.removeDoc(_o7.id);
_o6(); K.toast('Đã xoá lịch sử luyện', 'ok'); _ob();
}
async function _oq() {
const text = input.value.trim();
if (!st.persona || st.busy) return;
if (st.done) { if (text) K.toast('Phiên này đã chấm điểm xong – bấm "Luyện lại khách này" để luyện phiên mới.', 'warn'); return; }
if (!text) return;
st.history.push({ role: 'sale', text }); input.value = ''; _oa();
st.busy = true;
try {
let _ol, end = false;
try { const t = await G.ai(R.personaPrompt(st.persona, st.history), { feature: 'g5_practice' }); end = R.isEnd(t); _ol = R.stripEnd(t) || '…'; }
catch (e) {
st.history.pop(); input.value = text; _oa();
if (!K.isAiCancel(e)) K.toast(G.aiReady() ? 'AI chưa trả lời được – bấm Gửi lại.' : 'Chưa có khoá Gemini – thêm ở Cài đặt › Kết nối.', 'warn');
return;
}
const kind = 'ai';
st.history.push({ role: 'customer', text: _ol, kind }); _oa();
const _ot = st.history.filter((m) => m.role === 'sale').length;
if (end || _ot >= _o1) await _od();
} finally { st.busy = false; }
}
async function _od() {
if (!st.persona || st.done) return;
if (!st.history.some((m) => m.role === 'sale')) return K.toast('Hãy trả lời khách ít nhất một lần.', 'warn');
st.done = true;
st.local = R.localScore(st.history);
_oc();
await _oo();
}
function _o3(scores) {
return h('div', { class: 'g5-score' }, ...R.RUBRIC.map((r) => h('div', { 'data-testid': 'lt-crit-' + r.id },
h('div', { class: 'g5-row g5-small' }, h('span', null, r.label), h('b', null, `${scores[r.id] || 0}/${r.max}`)),
h('div', { class: 'g5-bar' }, h('i', { style: { width: Math.round(100 * (scores[r.id] || 0) / r.max) + '%' } })))));
}
function _oc() {
const L = st.local; if (!L) return;
const _oj = [
h('div', { class: 'g5-row' }, h('div', { class: 'g5-stat' }, h('b', { 'data-testid': 'lt-total' }, L.total + '/100'), h('span', null, 'Chấm máy · ' + R.gradeLabel(L.total))),
st.ai ? h('div', { class: 'g5-stat' }, h('b', { 'data-testid': 'lt-ai-total' }, st.ai.total + '/100'), h('span', null, 'AI chấm · ' + R.gradeLabel(st.ai.total))) : null),
_o3(st.ai ? st.ai.scores : L.scores),
...L.flags.map((f) => G.note('⚠ ' + f, 'danger')),
L.strengths.length ? h('p', { class: 'g5-small' }, h('b', null, 'Làm tốt: '), L.strengths.join(', ')) : null,
L.improve.length ? h('ul', { class: 'g5-small' }, ...L.improve.map((x) => h('li', null, x))) : null,
st.ai ? h('div', { class: 'g5-small' }, st.ai.improve.length ? h('p', null, h('b', null, 'AI góp ý: '), st.ai.improve.join(' · ')) : null,
st.ai.better.length ? h('p', null, h('b', null, 'Câu nói mẫu: '), st.ai.better.join(' · ')) : null) : null,
h('div', { class: 'g5-row' }, !st.ai ? K.button('✨ Nhờ AI chấm kỹ', () => _o2(), { ai: 'g5_practice', testid: 'lt-ai-grade' }) : null,
K.button('Luyện lại khách này', () => start(st.base), { kind: 'primary', testid: 'lt-again', icon: 'refresh' })),
h('p', { class: 'bds-muted g5-small' }, 'Chấm máy dựa trên dấu hiệu câu chữ (câu hỏi, nhắc lại ý khách, dẫn chứng, hẹn có thời gian, từ ngữ hứa hẹn) – là gợi ý luyện tập.'),
];
scoreBox.replaceChildren(K.card({ title: 'Kết quả – ' + st.persona.name, body: _oj }));
}
async function _o2() {
try {
const t = await G.ai(R.gradePrompt(st.persona, st.history), { json: true, feature: 'g5_practice' });
const _oe = R.parseAiGrade(t);
if (!_oe) return K.toast('AI trả lời chưa đúng mẫu chấm điểm – giữ điểm chấm máy.', 'warn');
st.ai = _oe; _oc(); await _oo();
} catch (e) { if (!K.isAiCancel(e)) K.toast('AI chưa chấm được: ' + (e.message || ''), 'warn'); }
}
let _or = null;
async function _oo() {
const _on = await G.saveDoc(KIND, { id: _or, name: st.persona.name, data: { persona: st.persona.id, history: st.history.slice(-40), local: st.local && { total: st.local.total, scores: st.local.scores }, ai: st.ai && { total: st.ai.total, scores: st.ai.scores }, at: Date.now() } });
_or = _on.id; _ob();
}
async function _ob() {
const docs = await G.listDocs(KIND);
_of.replaceChildren(...(docs.length ? [
...docs.slice(0, 20).map((_o7) => h('div', { class: 'g5-li', 'data-testid': 'lt-hist-row-' + _o7.id },
h('div', null, h('b', null, _o7.name), h('div', { class: 'bds-muted g5-small' }, new Date(_o7.data.at || _o7.updated_at).toLocaleString('vi-VN') + ` · ${(_o7.data.history || []).filter((m) => m.role === 'sale').length} lượt`)),
h('div', { class: 'g5-row' }, K.badge(((_o7.data.ai && _o7.data.ai.total) ?? (_o7.data.local && _o7.data.local.total) ?? 0) + '/100', 'info'),
K.button('Xoá', () => _o9(_o7), { kind: 'ghost', icon: 'x', testid: 'lt-hist-del-' + _o7.id, title: 'Xoá phiên luyện này' })))),
h('div', { class: 'g5-row' }, K.button('Xoá toàn bộ lịch sử', () => _o8(docs), { kind: 'ghost', icon: 'x', testid: 'lt-hist-clear-all' }))
] : [K.empty('Chưa có phiên luyện nào.')]));
}
_ob();
return _om;
}
export default {
manifest: {
id: 'g5_luyentuvan', title: 'Luyện tư vấn với AI', icon: '🎭', screen: 'home', order: 510, version: '0.1.0', status: 'ready',
desc: 'Khách khó tính, chấm điểm 7 tiêu chí', pack: 'core',
help: 'AI đóng vai khách khó tính (cần khoá Gemini ở Cài đặt › Kết nối) – chọn Khách ngẫu nhiên để mỗi lần gặp một vị khách mới, hoặc khách có sẵn (mỗi phiên mở đầu và băn khoăn khác nhau): nhà đầu tư kỹ tính, người sợ vay, khách nghi pháp lý, khách bận, khách đang được sàn khác chào. Kết thúc là có điểm và góp ý.',
},
mount,
async selftest(ctx) { return selftestWith(ctx, () => R.localScore([{ role: 'sale', text: 'Dạ em chào anh, anh cần căn mấy phòng ạ?' }]).total > 0); },
};

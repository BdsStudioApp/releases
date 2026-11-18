import { g5, h, selftestWith } from '../g5_lib/ui.js';
import * as L from '../g5_lib/lessons.js';
const KIND = 'g5_hoc';
const _o0 = [['', 'Chưa đọc'], ['doing', 'Đang đọc'], ['done', 'Đã đọc']];
export async function mount(el, ctx) {
const G = g5(ctx), K = G.K;
const uid = (ctx.user && ctx.user.id) || 'me';
const _og = h('div', { class: 'g5', 'data-testid': 'g5-hoc' });
el.replaceChildren(_og);
const mine = (await G.listDocs(KIND)).find((d) => (d.data.user || 'me') === uid);
let _o4 = mine ? mine.id : null;
let _od = mine && mine.data.progress ? { ...L.emptyProgress(), ...mine.data.progress } : L.emptyProgress();
let tab = 'today', current = null;
const statBox = h('div', { class: 'g5-row', 'data-testid': 'hoc-stats' });
const tabs = G.tabs([['today', 'Bài hôm nay'], ['review', 'Ôn tập'], ['all', 'Tất cả bài'], ['shelf', 'Tủ sách']], tab, (v) => { tab = v; current = null; _o5(); }, 'hoc-tab');
const body = h('div');
_og.append(G.head('Học, học nữa, học mãi', 'Mỗi ngày một bài 5–10 phút về kỹ năng tư vấn bất động sản, câu hỏi ôn đúng lúc sắp quên, và tủ sách gợi ý.', 'hoc-head'), statBox, tabs, body);
let _oi = Promise.resolve();
function _oc() {
_oi = _oi.catch(() => {}).then(async () => {
const _oh = await G.saveDoc(KIND, { id: _o4, name: 'Tiến độ học' + (ctx.user && ctx.user.full_name ? ' – ' + ctx.user.full_name : ''), data: { user: uid, progress: _od } });
_o4 = _oh.id;
});
return _oi;
}
function _o6() {
const s = L.stats(_od), _o7 = L.dueCards(_od, Date.now(), L.LESSONS, 99).length;
statBox.replaceChildren(
h('div', { class: 'g5-stat' }, h('b', { 'data-testid': 'hoc-streak' }, String(L.streak(_od))), h('span', null, 'ngày học liên tiếp')),
h('div', { class: 'g5-stat' }, h('b', { 'data-testid': 'hoc-done' }, `${s.done}/${s.total}`), h('span', null, 'bài đã học')),
h('div', { class: 'g5-stat' }, h('b', null, s.done ? s.avg + '%' : '—'), h('span', null, 'điểm trung bình')),
h('div', { class: 'g5-stat' }, h('b', { 'data-testid': 'hoc-due' }, String(_o7)), h('span', null, 'câu cần ôn')));
}
function _o5() {
_o6();
if (tab === 'today') { const t = current ? { lesson: current, review: false } : L.todayLesson(_od); body.replaceChildren(_oa(t.lesson, t.review)); }
else if (tab === 'review') body.replaceChildren(_of());
else if (tab === 'all') body.replaceChildren(current ? _oa(current, !!_od.done[current.id]) : _o1());
else body.replaceChildren(_ok());
}
function _oa(lesson, review) {
const _o2 = [];
const _oe = h('div', { 'data-testid': 'hoc-result', 'aria-live': 'polite' });
const qs = lesson.quiz.map((q, qi) => h('fieldset', { class: 'g5-q', 'data-testid': 'hoc-q-' + qi },
h('legend', null, h('b', null, `${qi + 1}. ${q.q}`)),
...q.options.map((o, oi) => h('label', { class: 'g5-opt', 'data-testid': `hoc-opt-${qi}-${oi}` },
h('input', { type: 'radio', name: lesson.id + '_q' + qi, value: oi, onchange: () => { _o2[qi] = oi; } }), h('span', null, o)))));
const submit = K.button('Nộp bài', async () => {
if (_o2.filter((x) => x != null).length < lesson.quiz.length) return K.toast('Trả lời đủ ' + lesson.quiz.length + ' câu trước khi nộp.', 'warn');
const _o9 = L.gradeQuiz(lesson, _o2);
_o9.results.forEach((r, qi) => {
const _o3 = qs[qi];
_o3.querySelectorAll('.g5-opt').forEach((o, oi) => { o.classList.toggle('ok', oi === r.answer); o.classList.toggle('bad', oi === _o2[qi] && !r.ok); });
_o3.querySelectorAll('input').forEach((i) => { i.disabled = true; });
_o3.append(h('p', { class: 'g5-small ' + (r.ok ? '' : 'bds-muted') }, (r.ok ? '✓ ' : '✗ ') + r.why));
});
_od = L.recordLesson(_od, lesson, _o9);
await _oc();
_oe.replaceChildren(G.note(`Đúng ${_o9.correct}/${_o9.total} (${_o9.pct}%). ` + (_o9.pct === 100 ? 'Xuất sắc! ' : 'Các câu sai sẽ được hỏi lại trong phần Ôn tập. ') + 'Bài tiếp theo mở vào lần học sau.', _o9.pct >= 67 ? 'success' : 'warn', 'hoc-grade'));
submit.disabled = true; _o6();
}, { kind: 'primary', testid: 'hoc-submit', icon: 'check' });
return h('article', { class: 'g5-lesson', 'data-testid': 'hoc-lesson', dataset: { lesson: lesson.id } },
K.card({ title: lesson.title, body: [
h('p', { class: 'bds-muted g5-small' }, `${lesson.topic} · khoảng ${lesson.minutes} phút` + (review ? ' · ôn lại bài cũ' : '') + (_od.done[lesson.id] ? ` · lần trước ${_od.done[lesson.id].score}%` : '')),
h('p', null, h('b', null, lesson.intro)),
...lesson.sections.flatMap((s) => [h('h4', null, s.h), h('p', null, s.p)]),
G.note('Bài tập hôm nay: ' + lesson.exercise, 'info'),
h('h4', null, 'Ghi nhớ'), h('ul', null, ...lesson.takeaways.map((t) => h('li', null, t)))] }),
K.card({ title: 'Câu hỏi ôn', body: [h('div', { class: 'g5-quiz' }, ...qs), submit, _oe] }),
tab === 'all' ? K.button('← Danh sách bài', () => { current = null; _o5(); }, { testid: 'hoc-back' }) : null);
}
function _of() {
const _o7 = L.dueCards(_od, Date.now());
if (!_o7.length) return K.card({ title: 'Ôn tập', body: [K.empty('Chưa có câu nào đến hạn ôn. Học bài hôm nay để có câu ôn.')] });
return K.card({ title: `Ôn tập – ${_o7.length} câu`, body: _o7.map((c, i) => {
const _o8 = h('p', { class: 'g5-small' });
const _o3 = h('div', { class: 'g5-q', 'data-testid': 'hoc-card-' + i }, h('b', null, c.q.q),
...c.q.options.map((o, oi) => h('button', { type: 'button', class: 'g5-opt', 'data-testid': `hoc-card-${i}-${oi}`, onclick: async (e) => {
const ok = oi === c.q.answer;
_o3.querySelectorAll('button').forEach((b, bi) => { b.disabled = true; b.classList.toggle('ok', bi === c.q.answer); });
if (!ok) e.currentTarget.classList.add('bad');
_o8.textContent = (ok ? '✓ ' : '✗ ') + c.q.why;
_od = L.answerCard(_od, c.lessonId, c.idx, ok); await _oc(); _o6();
} }, o)), _o8);
return _o3;
}) });
}
function _o1() {
return K.card({ title: 'Tất cả bài học', body: h('div', { class: 'g5-list' }, ...L.LESSONS.map((l, i) => h('div', { class: 'g5-li' },
h('div', null, h('b', null, `${i + 1}. ${l.title}`), h('div', { class: 'bds-muted g5-small' }, `${l.topic} · ${l.minutes} phút` + (_od.done[l.id] ? ` · đã học (${_od.done[l.id].best ?? _od.done[l.id].score}%)` : ''))),
K.button(_od.done[l.id] ? 'Học lại' : 'Học', () => { current = l; _o5(); }, { testid: 'hoc-open-' + l.id })))) });
}
function _ok() {
const books = [...L.SHELF, ...(_od.custom || [])];
const titleIn = G.input({ placeholder: 'Tên sách / tài liệu', 'data-testid': 'hoc-book-title' }), authorIn = G.input({ placeholder: 'Tác giả', 'data-testid': 'hoc-book-author' });
return K.card({ title: 'Tủ sách', body: [
G.note('Sách gợi ý là sách đã xuất bản (ghi đúng tên, tác giả) và văn bản pháp luật gốc – tìm đọc bản chính thức. App không chép nội dung sách.', 'info'),
h('div', { class: 'g5-list', 'data-testid': 'hoc-shelf' }, ...books.map((b) => {
const s = (_od.shelf || {})[b.id] || {};
const _ob = (_od.custom || []).some((x) => x.id === b.id);
return h('div', { class: 'g5-li' }, h('div', null, h('b', null, (b.kind === 'luat' ? '⚖️ ' : '📘 ') + b.title), h('div', { class: 'bds-muted g5-small' }, [b.author, b.why].filter(Boolean).join(' · '))),
h('div', { class: 'g5-row' },
G.select(_o0, s.status || '', { 'aria-label': 'Trạng thái đọc: ' + b.title, 'data-testid': 'hoc-book-' + b.id, onchange: async (e) => { _od.shelf = { ...(_od.shelf || {}), [b.id]: { ...s, status: e.target.value, at: Date.now() } }; await _oc(); } }),
_ob ? K.button('Xoá', async () => { if (!(await G.confirmDel(b.title, 'hoc-book-del-c'))) return; _od.custom = (_od.custom || []).filter((x) => x.id !== b.id); const _oj = { ...(_od.shelf || {}) }; delete _oj[b.id]; _od.shelf = _oj; await _oc(); _o5(); }, { kind: 'danger', title: 'Xoá sách tự thêm: ' + b.title, testid: 'hoc-book-del-' + b.id }) : null));
})),
h('div', { class: 'g5-form' }, titleIn, authorIn),
K.button('+ Thêm vào tủ sách', async () => {
const t = titleIn.value.trim(); if (!t) return K.toast('Nhập tên sách.', 'warn');
_od.custom = [...(_od.custom || []), { id: 'u' + Date.now().toString(36), title: t, author: authorIn.value.trim(), kind: 'sach' }];
await _oc(); _o5();
}, { testid: 'hoc-book-add' })] });
}
_o5();
return _og;
}
export default {
manifest: {
id: 'g5_hoc', title: 'Học mỗi ngày', icon: '📚', screen: 'home', order: 520, version: '0.1.0', status: 'ready',
desc: 'Thử nghiệm · bài 5–10 phút, câu hỏi ôn, tủ sách',
help: 'Mỗi ngày một bài ngắn về kỹ năng tư vấn, pháp lý, tài chính, chăm sóc khách; làm 3 câu hỏi; câu sai được hỏi lại đúng lúc sắp quên. Tủ sách gợi ý sách và văn bản pháp luật gốc.',
},
mount,
async selftest(ctx) { return selftestWith(ctx, () => L.LESSONS.length >= 10 && L.LESSONS.every((l) => l.quiz.length === 3)); },
};

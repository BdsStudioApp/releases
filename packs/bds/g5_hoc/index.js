import { g5, h, selftestWith } from '../g5_lib/ui.js';
import * as L from '../g5_lib/lessons.js';
import * as D from '../g5_lib/drill.js';
import * as RT from '../g5_lib/route.js';
const KIND = 'g5_hoc';
export async function mount(el, ctx) {
const G = g5(ctx), K = G.K;
const uid = (ctx.user && ctx.user.id) || 'me';
const _ov = h('div', { class: 'g5', 'data-testid': 'g5-hoc' });
el.replaceChildren(_ov);
const _ok = (await G.listDocs(KIND)).find((d) => (d.data.user || 'me') === uid);
let _o4 = _ok ? _ok.id : null;
let _on = _ok && _ok.data.progress ? { ...L.emptyProgress(), ...RT.unpackProgress(_ok.data.progress) } : L.emptyProgress();
let tab = 'today', current = null;
const statBox = h('div', { class: 'g5-row', 'data-testid': 'hoc-stats' });
const tabs = G.tabs([['today', 'Bài hôm nay'], ['drill', 'Luyện tình huống'], ['review', 'Ôn tập'], ['proj', 'Theo dự án'], ['all', 'Lộ trình']], tab, (v) => { tab = v; current = null; _o5(); }, 'hoc-tab');
const body = h('div');
_ov.append(G.head('Học, học nữa, học mãi', `Lộ trình ${L.LESSONS.length} bài, mỗi ngày một bài 5–10 phút: tư vấn, xử lý từ chối, pháp lý, tài chính, thuế phí, quy hoạch, marketing, phân tích dự án. Câu ôn hỏi lại đúng lúc sắp quên.`, 'hoc-head', false), statBox, tabs, body);
let _oy = Promise.resolve();
function _om() {
_oy = _oy.catch(() => {}).then(async () => {
_on = RT.fitSize(_on);
const _ow = await G.saveDoc(KIND, { id: _o4, name: 'Tiến độ học' + (ctx.user && ctx.user.full_name ? ' – ' + ctx.user.full_name : ''), data: { user: uid, progress: RT.packProgress(_on) } });
_o4 = _ow.id;
});
return _oy;
}
function _o6() {
const _ox = L.stats(_on), due = L.dueCards(_on, Date.now(), L.LESSONS, 999).length + D.dueDrill(_on).length + RT.dueProject(_on).length;
statBox.replaceChildren(
h('div', { class: 'g5-stat' }, h('b', { 'data-testid': 'hoc-streak' }, String(L.streak(_on))), h('span', null, 'ngày học liên tiếp')),
h('div', { class: 'g5-stat' }, h('b', { 'data-testid': 'hoc-done' }, `${_ox.done}/${_ox.total}`), h('span', null, 'bài đã học')),
h('div', { class: 'g5-stat' }, h('b', null, _ox.done ? _ox.avg + '%' : '—'), h('span', null, 'điểm trung bình')),
h('div', { class: 'g5-stat' }, h('b', { 'data-testid': 'hoc-due' }, String(due)), h('span', null, 'câu cần ôn')));
}
function _o5() {
_o6();
if (tab === 'today') { const t = current ? { lesson: current, review: false } : L.todayLesson(_on, _ob()); body.replaceChildren(_oc(), _og(t.lesson, t.review)); }
else if (tab === 'proj') body.replaceChildren(_op());
else if (tab === 'drill') body.replaceChildren(_o9());
else if (tab === 'review') body.replaceChildren(_ou());
else body.replaceChildren(current ? _og(current, !!_on.done[current.id]) : _o0());
}
function _og(lesson, review) {
const _o1 = [];
const _ot = h('div', { 'data-testid': 'hoc-result', 'aria-live': 'polite' });
const qs = lesson.quiz.map((q, qi) => h('fieldset', { class: 'g5-q', 'data-testid': 'hoc-q-' + qi, dataset: q.ref ? { ref: q.ref } : {} },
h('legend', null, h('b', null, `${qi + 1}. ${q.q}`)),
...q.options.map((o, oi) => h('label', { class: 'g5-opt', 'data-testid': `hoc-opt-${qi}-${oi}` },
h('input', { type: 'radio', name: lesson.id + '_q' + qi, value: oi, onchange: () => { _o1[qi] = oi; } }), h('span', null, o)))));
const submit = K.button('Nộp bài', async () => {
if (_o1.filter((x) => x != null).length < lesson.quiz.length) return K.toast('Trả lời đủ ' + lesson.quiz.length + ' câu trước khi nộp.', 'warn');
const _od = L.gradeQuiz(lesson, _o1);
_od.results.forEach((_or, qi) => {
const box = qs[qi];
box.querySelectorAll('.g5-opt').forEach((o, oi) => { o.classList.toggle('ok', oi === _or.answer); o.classList.toggle('bad', oi === _o1[qi] && !_or.ok); });
box.querySelectorAll('input').forEach((i) => { i.disabled = true; });
const ref = lesson.quiz[qi].ref;
box.append(h('p', { class: 'g5-small ' + (_or.ok ? '' : 'bds-muted') }, (_or.ok ? '✓ ' : '✗ ') + _or.why + (ref ? ' (' + ref + ')' : '')));
});
_on = L.recordLesson(_on, lesson, _od);
await _om();
_ot.replaceChildren(G.note(`Đúng ${_od.correct}/${_od.total} (${_od.pct}%). ` + (_od.pct === 100 ? 'Xuất sắc! ' : 'Các câu sai sẽ được hỏi lại trong phần Ôn tập. ') + 'Bài tiếp theo mở vào lần học sau.', _od.pct >= 67 ? 'success' : 'warn', 'hoc-grade'));
submit.disabled = true; _o6();
_ot.append(_oe());
}, { kind: 'primary', testid: 'hoc-submit', icon: 'check' });
return h('article', { class: 'g5-lesson', 'data-testid': 'hoc-lesson', dataset: { lesson: lesson.id } },
K.card({ title: lesson.title, body: [
h('p', { class: 'bds-muted g5-small', 'data-testid': 'hoc-lesson-meta' }, `${RT.groupLabel(lesson.group) || lesson.topic} · cấp ${lesson.level || 1} · khoảng ${lesson.minutes} phút · ${lesson.quiz.length} câu ôn` + (review ? ' · ôn lại bài cũ' : '') + (_on.done[lesson.id] ? ` · lần trước ${_on.done[lesson.id].score}%` : '')),
h('p', null, h('b', null, lesson.intro)),
...lesson.sections.flatMap((_ox) => [h('h4', null, _ox.h), h('p', null, _ox.p)]),
G.note('Bài tập hôm nay: ' + lesson.exercise, 'info'),
h('h4', null, 'Ghi nhớ'), h('ul', null, ...lesson.takeaways.map((t) => h('li', null, t))),
_os(lesson)] }),
K.card({ title: 'Câu hỏi ôn', body: [h('div', { class: 'g5-quiz' }, ...qs), submit, _ot] }),
tab === 'all' ? K.button('← Danh sách bài', () => { current = null; _o5(); }, { testid: 'hoc-back' }) : null);
}
function _ob() { const f = RT.focusLessons(L.LESSONS, _on.focus); return f.length ? f : L.LESSONS; }
function _oc() {
const gs = RT.groupStats(_on, L.LESSONS);
const _ol = [['', `Cả lộ trình (${L.stats(_on).done}/${L.LESSONS.length})`], ...gs.map((_od) => [_od.id, `${_od.icon} ${_od.label} (${_od.done}/${_od.total})`])];
return h('div', { class: 'g5-row', 'data-testid': 'hoc-focus-row' }, h('span', { class: 'bds-muted g5-small' }, 'Học theo nhóm:'),
G.select(_ol, _on.focus || '', { 'aria-label': 'Chọn nhóm bài muốn học', 'data-testid': 'hoc-focus', onchange: async (e) => { _on.focus = e.target.value; current = null; _o5(); await _om(); } }));
}
function _os(lesson) {
const refs = lesson.refs || [];
if (!refs.length) return null;
return h('div', { class: 'g5-refs', 'data-testid': 'hoc-refs' }, h('h4', null, 'Nguồn đối chiếu'),
h('ul', { class: 'g5-small' }, ...refs.map((_or) => { const _o11 = RT.safeRefUrl(_or.url); return h('li', null, _or.t, ...(_o11 ? [' · ', h('a', { href: _o11, target: '_blank', rel: 'noopener noreferrer' }, 'Đọc văn bản ↗')] : [])); })),
h('p', { class: 'bds-muted g5-small' }, 'Tóm ý để học, không thay văn bản gốc. Trước khi tư vấn trường hợp cụ thể, đọc lại điều luật và văn bản hướng dẫn đang hiệu lực.'));
}
let _oq = null, projId = '', projBusy = false;
async function _oh() {
try { _oq = (await K.loadProjects()).filter((p) => p && p.id && p.name && !p.hidden); } catch { _oq = []; }
if (!projId && _oq.length) projId = (_on.pq && Object.keys(_on.pq).find((id) => _oq.some((p) => p.id === id))) || _oq[0].id;
_o5();
}
async function _oi() {
const p = (_oq || []).find((x) => x.id === projId);
if (!p || projBusy) return;
if (!G.aiReady()) return K.toast('Chưa nối AI – nhờ Quản trị dán khoá Gemini ở Cài đặt › Kết nối.', 'warn');
projBusy = true; _o5();
try {
const t = await G.ai(RT.projectQuizPrompt(p, { avoid: RT.projectItems(_on, p.id).map((x) => x.q) }), { json: true, feature: 'g5_proj_quiz' });
const _of = RT.parseProjectQuiz(t);
if (_of.length < 3) K.toast('AI soạn chưa đúng mẫu hoặc thông tin dự án còn ít – bổ sung ở Thông tin dự án rồi thử lại.', 'warn');
else { _on = RT.addProjectQuiz(_on, p, _of); await _om(); }
} catch (e) { if (!K.isAiCancel(e)) K.toast('AI chưa soạn được: ' + ((e && (e.userMessage || e.message)) || ''), 'warn'); }
finally { projBusy = false; _o5(); }
}
function _oo(it, testid) {
const _oa = h('p', { class: 'g5-small', 'data-testid': testid + '-fb' });
const box = h('div', { class: 'g5-q', 'data-testid': testid, dataset: { item: it.id } }, h('b', null, it.q),
...it.options.map((o, oi) => h('button', { type: 'button', class: 'g5-opt', 'data-testid': `${testid}-${oi}`, onclick: async (e) => {
const ok = oi === it.answer;
box.querySelectorAll('button').forEach((b, bi) => { b.disabled = true; b.classList.toggle('ok', bi === it.answer); });
if (!ok) e.currentTarget.classList.add('bad');
_oa.textContent = (ok ? '✓ ' : '✗ ') + (it.why || '');
_on = RT.answerProject(_on, it.id, ok, L.BOX_DAYS); await _om(); _o6();
} }, o)), _oa);
return box;
}
function _op() {
if (_oq == null) { setTimeout(_oh, 0); return K.card({ title: 'Câu hỏi theo dự án', body: [G.note('Đang tải dự án…', 'info')] }); }
if (!_oq.length) return K.card({ title: 'Câu hỏi theo dự án', body: [K.empty('Chưa có dự án nào. Thêm dự án ở Thông tin dự án để AI soạn câu ôn theo dự án công ty đang bán.')] });
const _of = RT.projectItems(_on, projId), cards = _on.cards || {};
const fresh = _of.filter((it) => !cards[RT.PQ + it.id + '#0']);
return K.card({ title: 'Câu hỏi theo dự án', body: [
h('p', { class: 'bds-muted g5-small' }, 'AI soạn câu ôn CHỈ từ thông tin dự án đã nhập trong app (giá, loại căn, bàn giao, pháp lý, tiện ích…). Câu đã làm vào lịch ôn như bài học. Thông tin dự án sai thì câu hỏi cũng sai – sửa ở Thông tin dự án.'),
h('div', { class: 'g5-row' }, G.select(_oq.map((p) => [p.id, p.name + (RT.projectItems(_on, p.id).length ? ` (${RT.projectItems(_on, p.id).length} câu)` : '')]), projId, { 'aria-label': 'Chọn dự án', 'data-testid': 'hoc-proj-pick', onchange: (e) => { projId = e.target.value; _o5(); } }),
K.button(projBusy ? 'Đang soạn…' : (_of.length ? 'AI soạn thêm câu' : 'AI soạn câu hỏi'), () => _oi(), { kind: 'primary', testid: 'hoc-proj-make', icon: 'sparkle', ai: 'g5_proj_quiz', disabled: projBusy })),
G.aiReady() ? null : G.note('Chưa nối AI – nhờ Quản trị dán khoá Gemini ở Cài đặt › Kết nối. Lộ trình bài học vẫn dùng được, không cần AI.', 'info', 'hoc-proj-noai'),
fresh.length ? h('div', { class: 'g5-quiz', 'data-testid': 'hoc-proj-list' }, ...fresh.map((it, i) => _oo(it, 'hoc-pq-' + i))) :
_of.length ? G.note(`Đã làm hết ${_of.length} câu của dự án này – câu sẽ quay lại trong Ôn tập đúng lịch. Bấm "AI soạn thêm câu" để có câu mới.`, 'success', 'hoc-proj-done') : null] });
}
function _ou() {
const now = Date.now();
const due = L.dueCards(_on, now, L.LESSONS, 12);
const dd = D.dueDrill(_on, now, 5);
const dp = RT.dueProject(_on, now, 5);
const total = L.dueCards(_on, now, L.LESSONS, 999).length + D.dueDrill(_on, now).length + RT.dueProject(_on, now).length;
if (!due.length && !dd.length && !dp.length) return K.card({ title: 'Ôn tập', body: [K.empty('Chưa có câu nào đến hạn ôn. Học bài hôm nay để có câu ôn.')] });
const _oz = due.length + dd.length + dp.length;
return K.card({ title: `Ôn tập – ${_oz}/${total} câu`, body: [
...dp.map((c, i) => _oo(c.item, 'hoc-rp-' + i)),
...dd.map((c, i) => _o7(c.id, c.item, 'hoc-rd-' + i, () => _o6())), ...due.map((c, i) => {
const _oa = h('p', { class: 'g5-small' });
const box = h('div', { class: 'g5-q', 'data-testid': 'hoc-card-' + i }, h('b', null, c.q.q),
...c.q.options.map((o, oi) => h('button', { type: 'button', class: 'g5-opt', 'data-testid': `hoc-card-${i}-${oi}`, onclick: async (e) => {
const ok = oi === c.q.answer;
box.querySelectorAll('button').forEach((b, bi) => { b.disabled = true; b.classList.toggle('ok', bi === c.q.answer); });
if (!ok) e.currentTarget.classList.add('bad');
_oa.textContent = (ok ? '✓ ' : '✗ ') + c.q.why;
_on = L.answerCard(_on, c.lessonId, c.idx, ok); await _om(); _o6();
} }, o)), _oa);
return box;
}), K.button(total > _oz ? 'Ôn tiếp' : 'Tải lại', () => _o5(), { testid: 'hoc-review-more', icon: 'refresh' })] });
}
function _oe() { return K.button('Luyện thêm tình huống', () => { tab = 'drill'; tabs.set('drill'); _o5(); }, { testid: 'hoc-go-drill', icon: 'refresh' }); }
let _o8 = false;
function _o7(id, it, testid, onDone) {
const _oa = h('div', { class: 'g5-small', 'data-testid': testid + '-fb' });
const box = h('div', { class: 'g5-q', 'data-testid': testid, dataset: { item: id } },
h('p', null, h('b', null, '🗣 “' + it.say + '”')),
it.ctx ? h('p', { class: 'bds-muted g5-small' }, it.ctx) : null,
...it.options.map((o, oi) => h('button', { type: 'button', class: 'g5-opt', 'data-testid': `${testid}-${oi}`, onclick: async (e) => {
const ok = oi === it.answer;
box.querySelectorAll('button.g5-opt').forEach((b, bi) => { b.disabled = true; b.classList.toggle('ok', bi === it.answer); });
if (!ok) e.currentTarget.classList.add('bad');
_oa.replaceChildren(h('p', null, (ok ? '✓ ' : '✗ ') + (it.why || '')), it.model ? h('p', null, h('b', null, 'Câu mẫu: '), it.model) : null);
_on = D.answerDrill(_on, id, ok); await _om();
if (onDone) onDone(ok);
} }, o)), _oa);
return box;
}
async function _oj(more) {
if (_o8) return;
_o8 = true; _o5();
let fresh = [];
try {
if (G.aiReady()) {
const _o3 = L.ymd(Date.now()), ex = D.drillState(_on).extra[_o3] || 0;
try {
const t = await G.ai(D.setPrompt({ topics: D.topicsFor(_o3, ex + (more ? 1 : 0)), avoid: D.recentSays(_on) }), { json: true, feature: 'g5_drill' });
fresh = D.parseSet(t);
if (fresh.length < 3) { fresh = []; K.toast('AI soạn chưa đúng mẫu – dùng tình huống có sẵn.', 'warn'); }
} catch (e) { if (!K.isAiCancel(e)) K.toast('AI chưa soạn được – dùng tình huống có sẵn.', 'warn'); }
}
if (!fresh.length) {
const _o10 = new Set(D.todaySet(_on).map((x) => x.id));
fresh = D.bankPick(_on, D.SET_SIZE).filter((b) => !_o10.has(b.id));
if (!fresh.length) fresh = D.bankPick(_on, D.SET_SIZE);
}
const _or = D.addSet(_on, fresh, { more });
if (!_or.ids.length) K.toast('Hôm nay đã luyện hết tình huống có sẵn. Nối AI ở Cài đặt để có tình huống mới không giới hạn.', 'info');
else { _on = _or.progress; await _om(); }
} finally { _o8 = false; _o5(); }
}
function _o9() {
if (_o8) return K.card({ title: 'Luyện tình huống', body: [G.note('Đang soạn tình huống mới…', 'info', 'hoc-drill-wait')] });
const set = D.todaySet(_on);
if (!set.length) { setTimeout(() => _oj(false), 0); return K.card({ title: 'Luyện tình huống', body: [G.note('Đang soạn tình huống mới…', 'info', 'hoc-drill-wait')] }); }
const _o2 = set.find((x) => !x.answered), done = set.filter((x) => x.answered).length;
const head = h('p', { class: 'bds-muted g5-small', 'data-testid': 'hoc-drill-count' }, `${Math.min(done + 1, set.length)}/${set.length}`);
if (!_o2) {
const ok = set.filter((x) => x.ok).length;
return K.card({ title: 'Luyện tình huống', body: [
G.note(`Đúng ${ok}/${set.length}. ` + (ok === set.length ? 'Xuất sắc!' : 'Câu sai sẽ được hỏi lại vào ngày mai.'), ok >= set.length * 0.7 ? 'success' : 'warn', 'hoc-drill-sum'),
K.button('Luyện thêm', () => _oj(true), { kind: 'primary', testid: 'hoc-drill-more', icon: 'refresh', ai: G.aiReady() ? 'g5_drill' : null })] });
}
const next = h('div');
const box = _o7(_o2.id, _o2.item, 'hoc-drill', () => {
_o6();
next.replaceChildren(K.button(set.filter((x) => !x.answered && x.id !== _o2.id).length ? 'Tiếp' : 'Xem kết quả', () => _o5(), { kind: 'primary', testid: 'hoc-drill-next' }));
});
return K.card({ title: 'Luyện tình huống', body: [head, box, next] });
}
function _o0() {
const gs = RT.groupStats(_on, L.LESSONS);
const order = new Map(L.LESSONS.map((l, i) => [l.id, i]));
return K.card({ title: `Lộ trình ${L.LESSONS.length} bài`, body: [
h('p', { class: 'bds-muted g5-small' }, 'Bài hôm nay đi lần lượt theo lộ trình (xen kẽ các nhóm, từ cơ bản đến nâng cao). Muốn học một nhóm trước thì chọn ở "Học theo nhóm" trong Bài hôm nay, hoặc bấm Học ở bài bất kỳ.'),
...gs.map((_od) => h('details', { class: 'g5-group', 'data-testid': 'hoc-group-' + _od.id, open: _od.id === (_on.focus || (gs.find((x) => x.done < x.total) || gs[0]).id) },
h('summary', null, h('b', null, `${_od.icon} ${_od.label}`), h('span', { class: 'bds-muted g5-small' }, ` · ${_od.done}/${_od.total} bài`)),
h('div', { class: 'g5-list' }, ...L.LESSONS.filter((l) => l.group === _od.id).map((l) => h('div', { class: 'g5-li' },
h('div', null, h('b', null, `${order.get(l.id) + 1}. ${l.title}`), h('div', { class: 'bds-muted g5-small' }, `Cấp ${l.level || 1} · ${l.minutes} phút · ${l.quiz.length} câu` + (_on.done[l.id] ? ` · đã học (${_on.done[l.id].best ?? _on.done[l.id].score}%)` : ''))),
K.button(_on.done[l.id] ? 'Học lại' : 'Học', () => { current = l; _o5(); }, { testid: 'hoc-open-' + l.id }))))))] });
}
_o5();
return _ov;
}
export default {
manifest: {
id: 'g5_hoc', title: 'Học mỗi ngày', icon: '📚', screen: 'home', order: 520, version: '0.1.0', status: 'ready',
desc: 'Lộ trình ~90 bài 5–10 phút, câu ôn lặp lại', pack: 'core',
help: 'Lộ trình khoảng 90 bài chia 8 nhóm: tư vấn và chốt, xử lý từ chối, pháp lý BĐS (Luật Đất đai 2024, Luật Kinh doanh BĐS 2023, Luật Nhà ở 2023), tài chính và vay, thuế phí, đọc quy hoạch, marketing và nguồn khách, phân tích dự án. Mỗi ngày một bài 5–10 phút, 5–8 câu ôn; câu ôn hỏi lại theo lịch ngắt quãng (1, 3, 7, 16, 35, 80 ngày), câu sai hỏi lại hôm sau. Bài pháp lý, thuế, tài chính, quy hoạch ghi rõ văn bản, số hiệu, điều khoản để đối chiếu. Nội dung có sẵn, không tốn AI; có khoá Gemini thì tab Theo dự án cho AI soạn thêm câu ôn từ thông tin dự án công ty đang bán. Luyện tình huống: mỗi ngày một bộ câu khách hỏi / phản đối mới (AI soạn khi đã nối AI), bấm Luyện thêm để làm tiếp.',
},
mount,
async selftest(ctx) { return selftestWith(ctx, () => L.LESSONS.length >= 80 && L.LESSONS.every((l) => l.quiz.length >= 5 && l.quiz.length <= 10 && l.group) && D.BANK.every((b) => b.options.length === 4)); },
};

import { h } from '../_lib/kit.js';
import * as T from '../_lib/hot_topics.js';
import { NEWS_KEY } from '../_lib/freshnews.js';
const _o0 = { whiteSpace: 'normal', overflow: 'visible', textOverflow: 'clip', overflowWrap: 'anywhere' };
async function _o3(K, ctx) {
try { if (ctx.settings && typeof ctx.settings.get === 'function') return await ctx.settings.get(NEWS_KEY, null); } catch { }
return K.setting(NEWS_KEY, null);
}
export async function drawHotTopics(box, K, ctx) {
const _o9 = (box._hotSeq = (box._hotSeq || 0) + 1);
try {
const [ideas, customers, fresh] = await Promise.all([K.listAll('ideas'), K.list('objects'), _o3(K, ctx)]);
const now = Date.now();
const projects = K.projects();
const topics = T.pickTopics({ ideas, fresh, projects, customers, now });
const interest = T.interestStats(customers, projects, { now });
if (_o9 !== box._hotSeq) return;
const _oa = JSON.stringify(topics.map(t => [t.key, t.score, t.why, t.sources.length, t.can_make]));
if (box._hotSig === _oa && box.firstChild) { box._hotIdeas = ideas; return; }
box._hotSig = _oa; box._hotIdeas = ideas;
box.replaceChildren(card(K, ctx, topics, { ideas: () => box._hotIdeas, interest, redraw: () => drawHotTopics(box, K, ctx) }));
} catch { if (_o9 === box._hotSeq) { box._hotSig = ''; box.replaceChildren(); } }
}
function card(K, ctx, topics, { ideas, interest, redraw }) {
const _o5 = async (t, action, btns) => {
btns.forEach(b => { b.disabled = true; });
try {
for (const _o8 of T.markRows(t, action, { ideas: ideas(), now: Date.now() })) await K.put('ideas', _o8);
K.toast(action === 'done' ? 'Đã ghi: chủ đề này đã làm video' : `Đã bỏ qua – ${T.SKIP_DAYS} ngày tới không đề xuất lại`, 'success');
} catch (e) { K.toast((e && e.message) || 'Chưa lưu được', 'warn'); }
await redraw();
};
const _o4 = (t, i) => {
const _oc = { angle: '' };
const angleBox = h('div', { class: 'bds-sub', 'data-testid': 'brief-hot-angle', style: _o0 });
const _o2 = T.defaultAngle(t);
const _o6 = () => angleBox.replaceChildren(h('span', null, '💡 Góc kể gợi ý: ', h('strong', null, _o2.title), ' – ' + _o2.angle));
_o6();
const _o1 = async (b) => {
if (!ctx.ai || typeof ctx.ai.run !== 'function') { K.toast('Chưa bật AI – dùng góc kể gợi ý sẵn', 'info'); return; }
b.disabled = true; angleBox.replaceChildren(h('span', { class: 'bds-muted' }, 'AI đang gợi ý góc kể…'));
try {
const _o7 = await ctx.ai.run('ideas', { prompt: T.anglePrompt(t, { interest }), json: true });
const list = T.parseAngles((_o7 && (_o7.text ?? _o7)) || '', t);
if (!list.length) { _o6(); K.toast('AI chưa trả lời đúng mẫu – dùng góc kể gợi ý sẵn', 'warn'); return; }
angleBox.replaceChildren(h('small', { class: 'bds-muted' }, 'AI gợi ý – chỉ để tham khảo, số liệu phải theo nguồn:'),
h('ul', { 'data-testid': 'brief-hot-ai-list', style: { margin: '4px 0', paddingLeft: '18px' } }, list.map(a => {
const _od = K.button('Dùng', () => { _oc.angle = a.title + (a.angle ? ' – ' + a.angle : ''); K.toast('Sẽ điền góc kể này khi bấm Làm video', 'info'); }, { testid: 'brief-hot-ai-use' });
return h('li', { 'data-testid': 'brief-hot-ai-item' }, h('strong', null, a.title), a.angle ? ' – ' + a.angle : '', ' ', _od);
})));
} catch (e) { _o6(); K.toast(((e && e.message) || 'AI chưa trả lời') + ' – dùng góc kể gợi ý sẵn', 'warn'); }
finally { b.disabled = false; }
};
const make = t.can_make ? K.button('🎬 Làm video', () => K.nav(T.videoHash(t, { angle: _oc.angle })), { kind: 'primary', testid: 'brief-hot-make', title: 'Mở Ý tưởng & Video AI, thẻ Video AI, điền sẵn link – anh/chị tự bấm tạo cảnh' }) : null;
const aiBtn = K.button('✨ Gợi ý góc kể', () => _o1(aiBtn), { ai: true, testid: 'brief-hot-ai' });
const doneBtn = K.button('Đã làm', () => _o5(t, 'done', [doneBtn, _ob]), { testid: 'brief-hot-done' });
const _ob = K.button('Bỏ qua chủ đề này', () => _o5(t, 'skip', [doneBtn, _ob]), { testid: 'brief-hot-skip' });
const srcs = t.sources.length ? t.sources.slice(0, 4).map((s, k) => [k ? ' · ' : '', h('a', { href: s.url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'brief-hot-src' }, (s.name || s.host || 'Nguồn') + ' ↗')])
: [h('span', null, 'chưa có link nguồn')];
return h('li', { class: 'bds-hot-item', 'data-testid': 'brief-hot-item', 'data-key': t.key,
style: { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '6px', minWidth: 0, padding: '8px 0', borderBottom: i < topics.length - 1 ? '1px solid rgba(127,127,127,.18)' : '0' } },
h('div', { style: { minWidth: 0 } }, h('strong', { 'data-testid': 'brief-hot-title', style: { overflowWrap: 'anywhere' } }, (i + 1) + '. ' + t.title),
t.needs_check ? [' ', h('span', { class: 'bds-badge bds-tone-warn', 'data-testid': 'brief-hot-unv' }, T.UNVERIFIED)] : null),
h('div', { class: 'bds-sub', 'data-testid': 'brief-hot-why', style: _o0 }, 'Vì sao nên làm: ' + (t.why || '—')),
h('small', { class: 'bds-muted', style: { overflowWrap: 'anywhere' } }, 'Nguồn: ', ...srcs.flat(), ' · ', h('span', { 'data-testid': 'brief-hot-date' }, T.fmtDay(t.published))),
angleBox,
t.can_make ? null : h('small', { class: 'bds-muted', 'data-testid': 'brief-hot-check-note' }, 'Chỉ một nguồn chưa rõ uy tín – mở nguồn đọc kỹ, chờ báo lớn đưa tin rồi mới làm video.'),
h('div', { class: 'bds-row bds-wrap' }, make, aiBtn, doneBtn, _ob));
};
return K.card({
title: 'Chủ đề đáng làm video tuần này' + (topics.length ? ' (' + topics.length + ')' : ''), testid: 'brief-hot',
body: h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
h('small', { class: 'bds-muted' }, 'App chọn từ tin 7 ngày theo dự án/khu vực đang bán, số khách quan tâm, tin quy hoạch – hạ tầng – chính sách, độ mới và số báo cùng đưa. Video chỉ nêu số liệu có trong nguồn.'),
topics.length ? h('ul', { 'data-testid': 'brief-hot-list', style: { listStyle: 'none', margin: 0, padding: 0 } }, topics.map(_o4))
: h('div', { 'data-testid': 'brief-hot-empty' }, K.empty('Tuần này chưa có chủ đề đủ điểm. Lấy tin ở "Tin mới cập nhật", Phân tích thị trường hoặc Nguồn ý tưởng rồi quay lại.'))),
});
}

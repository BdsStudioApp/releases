import { h } from '../_lib/kit.js';
import * as W from './wingman.js';
const _o2 = { chat: '', me: '', facts: '', project: '', slots: null, last: null };
const ls = () => { try { return globalThis.localStorage || null; } catch { return null; } };
const _o5 = new Map();
const _of = () => ls() || { getItem: k => (_o5.has(k) ? _o5.get(k) : null), setItem: (k, v) => _o5.set(k, String(v)) };
export function renderWingman(body, { G }) {
const K = G.K;
if (!_o2.slots) _o2.slots = W.suggestSlots(Date.now());
const chat = h('textarea', { rows: 7, placeholder: 'Dán đoạn chat Zalo với khách (chép cả tên người nói nếu có)…', 'data-testid': 'wm-chat', oninput: e => { _o2.chat = e.target.value; } }, _o2.chat);
const me = h('input', { value: _o2.me, placeholder: 'VD: Minh Sale', 'data-testid': 'wm-me', oninput: e => { _o2.me = e.target.value; } });
const facts = h('textarea', { rows: 3, placeholder: 'Mỗi dòng 1 ý có thật – VD: Chính sách chiết khấu áp dụng đến 30/11', 'data-testid': 'wm-facts', oninput: e => { _o2.facts = e.target.value; } }, _o2.facts);
const _o9 = K.select([['', '— Dự án (tuỳ chọn) —'], ...K.projects().map(p => [p.id, p.name])], _o2.project, { 'aria-label': 'Dự án', 'data-testid': 'wm-project', onchange: e => { _o2.project = e.target.value; } });
const _od = i => h('input', { value: _o2.slots[i], 'aria-label': 'Mốc hẹn ' + (i + 1), 'data-testid': 'wm-slot' + (i + 1), oninput: e => { _o2.slots[i] = e.target.value; } });
const _o8 = h('div', { 'data-testid': 'wm-out' });
const go = () => {
const r = W.analyze(_o2.chat, { me: _o2.me, facts: _o2.facts, slots: _o2.slots, project: K.projectName(_o2.project), now: Date.now() });
if (r.empty) { K.toast('Dán đoạn chat của khách trước', 'warn'); return; }
_o2.last = r; _oc(r);
};
function _oc(r, ai = null) {
_o8.innerHTML = '';
const stats = W.loadStats(_of());
if (r.truncated) _o8.appendChild(h('p', { class: 'bds-warn', 'data-testid': 'wm-truncated' }, 'Đoạn chat dài – chỉ phân tích phần cuối (mới nhất).'));
_o8.appendChild(h('details', { class: 'bds-sample', 'data-testid': 'wm-masked-box', open: r.maskedCount > 0 },
h('summary', null, r.maskedCount ? 'Bản đã che ' + r.maskedCount + ' thông tin cá nhân (bản này mới được gửi AI)' : 'Bản dùng để phân tích (không thấy số điện thoại/email/số tài khoản/CCCD)'),
h('p', { class: 'bds-pre', 'data-testid': 'wm-masked' }, r.masked)));
const _o1 = ai && ai.concern ? { ...r.concern, id: ai.concern, label: (W.CONCERNS.find(x => x.id === ai.concern) || {}).label, reason: ai.reason || r.concern.reason } : r.concern;
_o8.appendChild(K.card({ title: 'Khách đang lăn tăn', testid: 'wm-concern', body: [
h('div', { class: 'g2-pills' }, h('span', { class: 'g2-pill', 'data-testid': 'wm-concern-main' }, _o1.label),
...r.concerns.filter(x => x.id !== _o1.id).slice(0, 3).map(x => h('span', { class: 'g2-pill bds-muted' }, x.label))),
h('p', { class: 'bds-muted', 'data-testid': 'wm-reason' }, 'Vì: ' + _o1.reason + (ai && ai.concern ? ' (AI)' : ''))] }));
const _o7 = ai && ai.concern && ai.concern !== r.concern.id
? W.buildOptions(ai.concern, { facts: W.parseFacts(_o2.facts), slots: r.slots, project: K.projectName(_o2.project) }) : r.options;
const byId = new Map(_o7.map(_o6 => [_o6.id, _o6]));
for (const id of W.rankOptions(_o7.map(_o6 => _o6.id), stats, _o1.id)) {
const _o6 = byId.get(id);
const text = (ai && ai[id]) || _o6.text;
const _og = h('textarea', { rows: 5, 'data-testid': 'wm-text-' + id }, text);
const warn = h('small', { class: 'bds-warn', 'data-testid': 'wm-risk-' + id });
const _o4 = () => { const _o0 = W.riskyPhrases(_og.value); warn.textContent = _o0.length ? 'Nên sửa: ' + _o0.join(', ') + '.' : ''; };
_og.addEventListener('input', _o4); _o4();
const _oe = h('small', { class: 'bds-muted', 'data-testid': 'wm-stat-' + id }, W.statLabel(stats, _o1.id, id));
const note = id === 'urgency' && !_o6.factual ? h('small', { class: 'bds-muted' }, 'Chưa nhập "Điều có thật" nên chỉ nhắc chung – không nêu số căn, hạn, giá.') : null;
_o8.appendChild(K.card({ title: _o6.label, testid: 'wm-opt-' + id, body: [_og, warn, note,
h('div', { class: 'bds-row bds-wrap' },
K.button('Chép', async () => { await K.copy(_og.value); K.toast('Đã chép – dán vào Zalo, đọc lại trước khi gửi', 'success'); }, { kind: 'primary', testid: 'wm-copy-' + id })),
h('div', { class: 'bds-row bds-wrap' }, h('span', { class: 'bds-muted' }, 'Ghi kết quả:'),
...W.RESULTS.map(([rid, rl]) => K.button(rl, () => {
const _ob = W.recordOutcome(W.loadStats(_of()), _o1.id, id, rid);
W.saveStats(_of(), _ob);
_oe.textContent = W.statLabel(_ob, _o1.id, id);
K.toast('Đã ghi kết quả (lưu trên máy này)', 'success');
}, { testid: 'wm-res-' + id + '-' + rid }))), _oe] }));
}
_o8.appendChild(h('div', { class: 'g2-guard', 'data-testid': 'wm-avoid' }, h('strong', null, 'Cảnh báo – câu nên tránh'), h('ul', null, r.avoid.map(a => h('li', null, a)))));
_o8.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('✨ Hiểu sâu hơn bằng AI', async () => {
try {
const t = await G.aiText('zalo_draft', _oa(r), true);
const _o3 = W.parseAiJson(t, { facts: _o2.facts });
if (!_o3) { K.toast('AI trả lời không đúng mẫu – giữ gợi ý theo luật', 'warn'); return; }
_oc(r, _o3); K.toast('AI đã gợi ý – đọc kỹ trước khi gửi', 'info');
} catch (e) { if (!K.isAiCancel(e)) K.toast(e.message || 'AI chưa trả lời', 'warn'); }
}, { ai: 'zalo_draft', testid: 'wm-ai', title: 'Chỉ gửi bản đã che ở trên' }),
K.button('Làm bằng Claude/Gemini', () => G.handoff('zalo_draft', _oa(r)), { testid: 'wm-handoff', icon: 'external' })));
}
const _oa = r => W.buildPrompt({ chat: r.masked, facts: _o2.facts, me: _o2.me, project: K.projectName(_o2.project), slots: r.slots });
body.append(
h('div', { class: 'g2-guard' }, h('strong', null, 'Chat Wingman'), h('p', null, 'Dán đoạn chat, app đoán khách đang lăn tăn gì và gợi ý 3 cách trả lời. Chạy được không cần AI, không tự gửi tin cho khách.')),
K.field('Đoạn chat Zalo', chat, 'Có ảnh chụp màn hình? iPhone: mở ảnh, giữ ngón tay lên chữ → Chép; Android: Google Ống kính → Sao chép văn bản, rồi dán vào đây. Ảnh không rời máy.'),
h('div', { class: 'bds-grid2' }, K.field('Tên của anh/chị trong đoạn chat (để tách lời khách)', me), K.field('Dự án', _o9)),
K.field('Điều có thật cần nêu (tuỳ chọn)', facts, 'Chỉ ghi điều kiểm tra được: hạn chính sách, số căn còn, giá ưu đãi đến ngày… Để trống thì app không nêu con số nào.'),
h('div', { class: 'bds-grid2' }, K.field('Mốc hẹn 1', _od(0)), K.field('Mốc hẹn 2', _od(1))),
h('div', { class: 'bds-row' }, K.button('Phân tích', go, { kind: 'primary', testid: 'wm-go' })),
_o8);
if (_o2.chat.trim() && _o2.last) _oc(_o2.last);
}

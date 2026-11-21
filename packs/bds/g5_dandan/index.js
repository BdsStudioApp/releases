import { g5, h, selftestWith } from '../g5_lib/ui.js';
import { kids } from '../_lib/kit.js';
import * as Sc from '../g5_lib/scenes.js';
import { TEMPLATES, cleanRooms } from '../g5_lib/plan3d.js';
import { FLOW_URL } from '../_lib/video.js';
import { withRules } from '../../../shared/ai_rules.js';
const KIND = 'g5_canh';
export async function mount(el, ctx) {
const G = g5(ctx), K = G.K;
const _oe = new URLSearchParams((location.hash.split('?')[1] || ''));
const _ok = { level: _oe.get('plan') ? 3 : 1, charId: '', project: '', backdrop: '', script: '', planId: _oe.get('plan') || '', type: '', style: '' };
const _og = h('div', { class: 'g5', 'data-testid': 'g5-dandan' });
el.replaceChildren(_og);
const chars = (await K.list('characters')).filter((c) => c.name);
const plans = await G.listDocs('g5_can3d');
const projects = K.projects();
const _o2 = G.select([['', '— không chọn (mô tả chung) —'], ...chars.map((c) => [c.id, c.name + (c.kind === 'real' ? ' (người thật)' : '')])], _ok.charId, { 'data-testid': 'dd-char', onchange: (e) => { _ok.charId = e.target.value; _o5(); } });
const levelTabs = G.tabs([['1', 'Mức 1 – Người dẫn giới thiệu'], ['3', 'Mức 3 – Dẫn tour căn 3D']], String(_ok.level), (v) => { _ok.level = Number(v); _o7(); _o5(); }, 'dd-level');
const _o8 = h('div');
const _o9 = h('div', { 'data-testid': 'dd-out', 'aria-live': 'polite' });
const _oi = h('div', { class: 'g5-list', 'data-testid': 'dd-saved' });
_og.append(...kids(
G.head('Nhân vật dẫn', 'Tạo cảnh nhân vật đứng giới thiệu (mức 1) hoặc đi dẫn tour căn theo mặt bằng 3D (mức 3) – lời nhắn Flow/Veo từng cảnh, khoá ngoại hình lấy từ Thư viện nhân vật.', 'dd-head'),
G.note('Cảnh do AI tạo ghi "' + Sc.LABEL + '". ' + Sc.AI_REMINDER + ' Nhân vật người thật cần giấy đồng ý (đã kiểm ở Thư viện nhân vật).', 'info'),
chars.length ? null : G.note('Chưa có nhân vật trong Thư viện nhân vật (hoặc tài khoản chưa có quyền xem). Vẫn tạo được cảnh với mô tả chung; muốn giữ đúng mặt nhân vật hãy tạo nhân vật trước.', 'warn', 'dd-no-char'),
K.card({ title: 'Thiết lập', body: [G.field('Nhân vật', _o2), levelTabs, _o8] }),
K.card({ title: 'Cảnh tạo ra', body: _o9 }),
K.card({ title: 'Bộ cảnh đã lưu', body: _oi }),
));
function _o7() {
if (_ok.level === 1) {
const _od = G.select([['', '— chọn dự án hoặc gõ bên dưới —'], ...projects.map((p) => [p.name, p.name])], _ok.project, { 'data-testid': 'dd-project', onchange: (e) => { _ok.project = e.target.value; _oc.value = _ok.project; _o5(); } });
const _oc = G.input({ value: _ok.project, placeholder: 'Tên dự án', 'data-testid': 'dd-project-in', oninput: (e) => { _ok.project = e.target.value; _o5(); } });
const _o0 = G.input({ value: _ok.backdrop, placeholder: 'Phông nền (tiếng Việt hoặc Anh) – để trống: sảnh dự án', 'data-testid': 'dd-backdrop', oninput: (e) => { _ok.backdrop = e.target.value; _o5(); } });
const _oj = h('textarea', { rows: 4, placeholder: 'Lời dẫn (khoảng 20–60 từ). Để trống: lời mẫu.', 'data-testid': 'dd-script', oninput: (e) => { _ok.script = e.target.value; _o5(); } }, _ok.script);
_o8.replaceChildren(h('div', { class: 'g5-form' }, G.field('Dự án', _od), G.field('Hoặc gõ tên', _oc), h('div', { class: 'g5-full' }, G.field('Phông nền', _o0)), h('div', { class: 'g5-full' }, G.field('Lời dẫn', _oj))),
h('div', { class: 'g5-row' }, K.button('✨ AI gợi ý lời dẫn', () => _om(_oj), { ai: 'g5_dandan', testid: 'dd-ai' }), K.button('Làm bằng Claude/Gemini', () => handoff(_oj), { testid: 'dd-handoff', icon: 'chat' })));
} else {
const _ob = G.select([['', '— chọn căn đã lưu ở Căn hộ 3D —'], ...plans.map((_o3) => [_o3.id, _o3.name]), ...TEMPLATES.map((t) => ['tpl:' + t.id, t.vi])], _ok.planId, { 'data-testid': 'dd-plan', onchange: (e) => { _ok.planId = e.target.value; _o5(); } });
const _on = G.input({ value: _ok.type, placeholder: 'vd căn 2 phòng ngủ 70 m²', 'data-testid': 'dd-type', oninput: (e) => { _ok.type = e.target.value; _o5(); } });
const _ol = G.input({ value: _ok.style, placeholder: 'Phong cách nội thất (tiếng Anh càng tốt) – vd modern Japandi, light oak', 'data-testid': 'dd-style', oninput: (e) => { _ok.style = e.target.value; _o5(); } });
_o8.replaceChildren(h('div', { class: 'g5-form' }, h('div', { class: 'g5-full' }, G.field('Mặt bằng căn', _ob)), G.field('Loại căn', _on), G.field('Phong cách', _ol)),
plans.length ? null : G.note('Chưa lưu căn nào ở "Căn hộ 3D" – có thể dùng mặt bằng mẫu (minh hoạ).', 'info'));
}
}
const character = () => chars.find((c) => c.id === _ok.charId) || null;
function _oa() {
if (_ok.planId.startsWith('tpl:')) { const t = TEMPLATES.find((x) => 'tpl:' + x.id === _ok.planId); return t ? { rooms: cleanRooms(t.rooms), links: t.links, entry: t.entry, illustrative: true } : null; }
const _o3 = plans.find((x) => x.id === _ok.planId);
return _o3 && _o3.data.plan ? { rooms: cleanRooms(_o3.data.plan.rooms || []), links: _o3.data.plan.links || [], entry: _o3.data.plan.entry || null, project: _o3.data.project } : null;
}
function _of() {
if (_ok.level === 1) return Sc.presenterIntro({ character: character(), project: _ok.project, backdrop: _ok.backdrop, script: _ok.script });
const plan = _oa();
if (!plan) return null;
return Sc.tour3d({ character: character(), plan, apartment: { project: plan.project || _ok.project, type: _ok.type, style: _ok.style } });
}
function _o5() {
const r = _of();
if (!r || !r.scenes.length) { _o9.replaceChildren(h('p', { class: 'bds-muted' }, _ok.level === 3 ? 'Chọn mặt bằng căn để tạo cảnh dẫn tour.' : 'Nhập lời dẫn.')); return; }
const _o1 = character();
_o9.replaceChildren(
h('p', null, h('b', { 'data-testid': 'dd-count' }, `${r.scenes.length} cảnh × ${Sc.FLOW_SECONDS} giây`), _o1 ? ` · nhân vật ${_o1.name}` + (_o1.voice ? ` · giọng ${_o1.voice}` : '') : ' · nhân vật mô tả chung'),
...r.scenes.map((s, i) => h('details', { class: 'g5-li', open: i === 0, 'data-testid': 'dd-scene-' + (i + 1) },
h('summary', null, `Cảnh ${i + 1}: ${s.title.text || ''} – "${s.subs[0] || ''}"`),
h('pre', { class: 'g5-pre', 'data-testid': 'dd-prompt-' + (i + 1) }, r.prompts[i]),
K.button('Chép lời nhắn', () => K.copy(r.prompts[i]).then(() => K.toast('Đã chép lời nhắn cảnh ' + (i + 1), 'success')), { testid: 'dd-copy-' + (i + 1) }))),
h('div', { class: 'g5-row' },
K.button('Chép lời đọc', () => K.copy(r.lines.map((l, i) => `${i + 1}. ${l}`).join('\n')).then(() => K.toast('Đã chép lời đọc', 'success')), { testid: 'dd-copy-voice' }),
K.button('Chép JSON cảnh', () => K.copy(JSON.stringify(r.scenes, null, 2)).then(() => K.toast('Đã chép JSON cảnh', 'success')), { testid: 'dd-copy-json' }),
K.button('Mở Flow', () => window.open(FLOW_URL, '_blank', 'noopener'), { testid: 'dd-flow' }),
K.button('Lưu bộ cảnh', () => _oh(r), { kind: 'primary', testid: 'dd-save' })));
}
async function _om(ta) {
const p = withRules(`Viết lời dẫn tiếng Việt khoảng 40 từ cho người dẫn đứng giới thiệu dự án bất động sản "${_ok.project || 'dự án'}" trên video dọc. Giọng thân thiện, chuyên nghiệp. Không hứa lợi nhuận, không nói "chắc chắn tăng giá", không bịa số liệu. Chỉ trả về lời dẫn.`);
try { const t = (await G.ai(p, { feature: 'g5_dandan' })).trim(); if (t) { ta.value = t; _ok.script = t; _o5(); } } catch (e) { if (!K.isAiCancel(e)) K.toast('AI chưa trả lời được: ' + (e.message || ''), 'warn'); }
}
async function handoff(ta) {
const p = withRules(`Viết lời dẫn tiếng Việt khoảng 40 từ cho người dẫn đứng giới thiệu dự án bất động sản "${_ok.project || 'dự án'}" trên video dọc. Không hứa lợi nhuận, không bịa số liệu. Chỉ trả về lời dẫn.`);
if (!ctx.ai || typeof ctx.ai.handoff !== 'function') return K.copy(p);
try {
const t = await ctx.ai.handoff('script', p, { target: 'claude' });
if (t) { ta.value = t; _ok.script = t; _o5(); }
} catch (e) { K.toast('Chưa mở được trang AI: ' + ((e && e.message) || 'lỗi') + '. Lời nhắn đã chép – dán vào Claude/Gemini.', 'warn'); K.copy(p); }
}
async function _oh(r) {
const name = _ok.level === 1 ? `Mức 1 – ${_ok.project || 'giới thiệu'}` : `Mức 3 – tour ${(plans.find((_o3) => _o3.id === _ok.planId) || {}).name || 'căn mẫu'}`;
await G.saveDoc(KIND, { name, data: { level: _ok.level, character_id: _ok.charId, scenes: r.scenes, prompts: r.prompts, lines: r.lines, voice: r.voice } });
K.toast('Đã lưu bộ cảnh.', 'success'); _o6();
}
async function _o6() {
const _o4 = await G.listDocs(KIND);
_oi.replaceChildren(...(_o4.length ? _o4.slice(0, 30).map((_o3) => h('div', { class: 'g5-li' }, h('div', null, h('b', null, _o3.name), h('div', { class: 'bds-muted g5-small' }, `${(_o3.data.scenes || []).length} cảnh`)),
h('div', { class: 'g5-row' }, K.button('Xoá', async () => { if (!(await G.confirmDel(_o3.name, 'dd-del-c'))) return; await G.removeDoc(_o3.id); _o6(); }, { kind: 'danger', testid: 'dd-del-' + _o3.id })))) : [K.empty('Chưa lưu bộ cảnh nào.')]));
}
_o7(); _o5(); _o6();
return _og;
}
export default {
manifest: {
id: 'g5_dandan', title: 'Nhân vật dẫn', icon: '🎙️', screen: 'content', order: 510, version: '0.1.0', status: 'ready', requires: 'video',
desc: 'Thử nghiệm · mức 1 giới thiệu, mức 3 dẫn tour căn 3D',
help: 'Tạo cảnh nhân vật (từ Thư viện nhân vật) đứng giới thiệu dự án hoặc đi dẫn tour căn theo mặt bằng 3D: lời nhắn Flow/Veo từng cảnh (dán vào Flow hoặc thẻ Video AI), lời đọc, JSON cảnh.',
},
mount,
async selftest(ctx) { return selftestWith(ctx, () => Sc.presenterIntro({ script: 'Xin chào anh chị.' }).scenes.length === 1 && Sc.G5_SCENE_TEMPLATES.length === 2); },
};

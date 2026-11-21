import { h } from '../_lib/kit.js';
import * as SK from '../_lib/staff_skills.js';
import * as T from '../_lib/staff_templates.js';
import * as F from './flow.js';
import * as Store from './skill_store.js';
const _o0 = SK.SKILL_LIMITS;
export const SKILL_EXPLAIN = 'Kỹ năng = hướng dẫn nhân viên làm theo khi việc khớp; không chạy mã.';
const SOURCE = { manual: 'Tự soạn', file: 'Từ tệp', ai: 'AI soạn', edit: 'Học từ chỗ anh/chị sửa', builtin: 'Có sẵn' };
const _of = (lib, s) => SK.findSameSkill(lib, s);
const _oz = (_o1, _o4) => SK.updateSkill(_o1, _o4);
export const canErase = ctx => !(ctx && ctx.user && ctx.user.perms) || ctx.user.perms.erase === true;
function _or(_od) {
return new Promise((res, rej) => {
const _oq = new FileReader();
_oq.onload = () => res(String(_oq.result || ''));
_oq.onerror = () => rej(new Error('Không đọc được tệp – thử lại hoặc dán nội dung.'));
_oq.readAsText(_od, 'utf-8');
});
}
export async function attach(D, staffId, skillId, on) {
const list = await D.loadStaff();
const _ow = list.find(s => s.id === staffId);
if (!_ow) return 'Không thấy nhân viên';
const _oq = F.setStaffSkill(_ow, skillId, on, _o0.maxPerStaff);
if (!_oq.ok) return _oq.error;
await D.saveStaff(list.map(s => (s.id === staffId ? _oq.staff : s)));
return '';
}
function _o2(K, same, u) {
return new Promise(res => {
let _oi = null;
const _o9 = v => { if (_oi) _oi.close(); res(v); };
_oi = K.modal({ title: 'Kỹ năng đã có', testid: 'skill-update', body: [
h('p', { 'data-testid': 'skill-update-title' }, `Cập nhật kỹ năng «${same.name}» (v${same.version || 1} → v${u.skill.version || (same.version || 1) + 1})?`),
h('ul', { class: 'stf-iss', 'data-testid': 'skill-update-summary' }, (u.summary || []).map(x => h('li', null, x))),
h('small', { class: 'bds-muted' }, 'Cập nhật giữ nguyên bật/tắt và các nhân viên đang gắn.'),
h('div', { class: 'bds-row bds-end' },
K.button('Huỷ', () => _o9(null), { testid: 'skill-update-cancel' }),
K.button('Lưu thành kỹ năng mới', () => _o9('new'), { testid: 'skill-update-new' }),
K.button('Cập nhật', () => _o9('update'), { kind: 'primary', testid: 'skill-update-ok' }))] });
});
}
export async function commitSkill(D, incoming, { attachTo = '', replace = null } = {}) {
const { K } = D;
const inc = SK.normalizeSkill(incoming);
if (!inc) return { saved: false, error: 'Kỹ năng cần có tên và nội dung.' };
const lib = await D.loadLib();
const same = replace ? lib.find(s => s.id === replace.id) || replace : _of(lib, inc);
let skill = null;
if (same) {
const u = _oz(same, { ...inc, id: same.id });
if (!u.changed) {
K.toast(`Kỹ năng «${same.name}» không có thay đổi`, 'info');
if (attachTo) { const e = await attach(D, attachTo, same.id, true); if (e) K.toast(e, 'warn'); }
return { saved: false, unchanged: true, skill: same };
}
const _on = await _o2(K, same, u);
if (!_on) return { saved: false, cancel: true };
if (_on === 'update') skill = { ...u.skill, id: same.id, enabled: same.enabled !== false, builtin: undefined };
else {
const _o6 = F.canAddSkill(lib, _o0.maxSkills);
if (!_o6.ok) { K.toast(_o6.error, 'warn'); return { saved: false, error: _o6.error }; }
const _ol = (inc.name + ' (mới)').slice(0, _o0.nameMax);
skill = SK.normalizeSkill({ ...inc, id: undefined, name: _ol, version: 1, created: Date.now(), updated: Date.now() });
}
} else {
const _o6 = F.canAddSkill(lib, _o0.maxSkills);
if (!_o6.ok) { K.toast(_o6.error, 'warn'); return { saved: false, error: _o6.error }; }
skill = inc;
}
const saved = await Store.saveSkill(K, skill);
let _ok = same && saved.id === same.id ? `Đã cập nhật «${saved.name}» lên v${saved.version}` : `Đã lưu kỹ năng «${saved.name}»`;
if (attachTo) {
const e = await attach(D, attachTo, saved.id, true);
if (e) K.toast(e, 'warn'); else _ok += ' và gắn cho nhân viên';
}
K.toast(_ok, 'success');
D.refresh();
return { saved: true, skill: saved };
}
export function openUpgradeSkills(D, staff, mySkills, staffList = []) {
const { K } = D;
let _ou;
const rows = (mySkills || []).map(k => {
const _om = (staffList || []).filter(x => x.id !== staff.id && (x.skills || []).includes(k.id)).map(x => x.name);
return h('div', { class: 'stf-card', 'data-testid': 'skill-upgrade-row-' + k.id },
h('strong', null, '📘 ' + k.name + ' v' + (k.version || 1)),
k.description ? h('small', { class: 'bds-muted' }, k.description) : null,
_om.length ? h('small', { class: 'stf-warn' }, 'Kỹ năng này cũng đang gắn cho: ' + _om.join(', ') + ' – cập nhật sẽ áp dụng cho cả họ.') : null,
h('div', { class: 'bds-row bds-wrap' }, K.button('⬆ Cập nhật bằng tệp mới', () => { _ou.close(); openAddSkill(D, { replace: k, way: 'file' }); }, { kind: 'primary', testid: 'skill-upgrade-go-' + k.id })));
});
const body = h('div', { class: 'bds-form' },
rows.length ? h('p', { class: 'bds-muted' }, `Chọn kỹ năng của ${staff.name} cần nâng cấp, rồi chọn tệp SKILL.md mới.`)
: h('p', { class: 'bds-muted', 'data-testid': 'skill-upgrade-empty' }, `Chưa gắn kỹ năng nào cho ${staff.name}. Tải kỹ năng mới để nâng cấp nhân viên này.`),
...rows,
h('div', { class: 'bds-row bds-end' }, K.button('⬆ Tải kỹ năng mới cho ' + staff.name, () => { _ou.close(); openAddSkill(D, { staff, way: 'file' }); }, { testid: 'skill-upgrade-new' })));
_ou = K.sheet({ title: 'Nâng cấp kỹ năng – ' + staff.name, testid: 'skill-upgrade', body });
return _ou;
}
export function openAddSkill(D, { staff = null, replace = null, way = '' } = {}) {
const { K, ctx } = D;
const body = h('div', { class: 'bds-form' });
const _ou = K.sheet({ title: replace ? `Cập nhật kỹ năng «${replace.name}»` : staff ? `Tải kỹ năng cho ${staff.name}` : 'Thêm kỹ năng', testid: 'skill-add', body });
const _oc = h('p', { class: 'bds-error', 'data-testid': 'skill-err', role: 'alert' });
const _op = { name: h('input', { type: 'text', maxlength: String(_o0.nameMax), 'data-testid': 'skill-pv-name' }),
desc: h('input', { type: 'text', maxlength: String(_o0.descMax), 'data-testid': 'skill-pv-desc' }),
body: h('textarea', { rows: 10, maxlength: String(_o0.bodyMax), 'data-testid': 'skill-pv-body' }) };
let _oa = null;
const _oo = h('div', { class: 'bds-form', 'data-testid': 'skill-preview', hidden: true },
h('strong', null, 'Xem trước – sửa được trước khi lưu'),
K.field('Tên kỹ năng', _op.name), K.field('Khi nào dùng (mô tả)', _op.desc), K.field('Hướng dẫn', _op.body),
h('div', { class: 'bds-row bds-end' }, K.button(replace ? 'Cập nhật kỹ năng' : 'Lưu kỹ năng', async () => {
const s = { ...(_oa || {}), name: _op.name.value, description: _op.desc.value, body: _op.body.value };
const _oq = await commitSkill(D, s, { attachTo: staff ? staff.id : '', replace });
if (_oq.saved || _oq.unchanged) _ou.close();
else if (_oq.error) _oc.textContent = _oq.error;
}, { kind: 'primary', testid: 'skill-save' })));
const _ov = s => { _oa = s; _op.name.value = s.name || ''; _op.desc.value = s.description || ''; _op.body.value = s.body || ''; _oo.hidden = false; _oc.textContent = ''; };
const _og = (text, source) => {
const _o5 = F.checkSkillText(text);
if (!_o5.ok) { _oc.textContent = _o5.error; _oo.hidden = true; return; }
const _oq = SK.parseSkillMd(text, { source });
if (!_oq.ok) { _oc.textContent = _oq.error; _oo.hidden = true; return; }
_ov(_oq.skill);
};
const file = h('input', { type: 'file', accept: '.md,.markdown,.txt,text/markdown,text/plain', 'data-testid': 'skill-file', 'aria-label': 'Chọn tệp SKILL.md / .md / .txt',
onchange: async e => {
const _od = e.target.files && e.target.files[0];
const _o5 = F.checkSkillFile(_od);
if (!_o5.ok) { _oc.textContent = _o5.error; _oo.hidden = true; return; }
try { _og(await _or(_od), 'file'); } catch (x) { _oc.textContent = x.message; }
e.target.value = '';
} });
const _o13 = h('div', { class: 'bds-form', 'data-way': 'file' }, K.field('Chọn tệp SKILL.md, .md hoặc .txt (≤ 8.000 ký tự)', file));
const paste = h('textarea', { rows: 8, 'data-testid': 'skill-paste', placeholder: '---\nname: Tên kỹ năng\ndescription: Khi nào dùng\n---\n# Cách làm\n1. …' });
const _o14 = h('div', { class: 'bds-form', 'data-way': 'paste' }, K.field('Dán văn bản hoặc SKILL.md', paste),
h('div', { class: 'bds-row bds-end' }, K.button('Đọc kỹ năng', () => _og(paste.value, 'manual'), { kind: 'primary', testid: 'skill-paste-read' })));
const idea = h('textarea', { rows: 4, maxlength: '2000', 'data-testid': 'skill-ai-idea', placeholder: 'Ví dụ: trả lời khách hỏi "căn này có sổ chưa" – lịch sự, có nguồn, hẹn gửi giấy tờ' });
const _oe = T.FIELD_TEMPLATES.map(t => [t.id, t.icon + ' ' + t.label]);
const field = K.select(_oe, (staff && staff.field) || (_oe[0] && _oe[0][0]), { 'data-testid': 'skill-ai-field', 'aria-label': 'Mảng' });
const fieldLabel = () => (T.FIELD_TEMPLATES.find(t => t.id === field.value) || {}).label || '';
const prompt = () => SK.draftSkillPrompt({ idea: idea.value, field: fieldLabel(), staffName: staff ? staff.name : '' });
const _ox = (text, source) => { const _oq = SK.parseDraftReply(String(text || ''), { source }); if (!_oq.ok) { _oc.textContent = _oq.error; _oo.hidden = true; return; } _ov(_oq.skill); };
const aiBtn = K.button('✨ Soạn bằng Gemini (miễn phí)', async () => {
if (!idea.value.trim()) { _oc.textContent = 'Gõ ý tưởng kỹ năng trước.'; return; }
if (!ctx.ai || typeof ctx.ai.run !== 'function') { _oc.textContent = 'Chưa bật AI – dùng nút "Nhờ Claude/Gemini qua chat".'; return; }
aiBtn.disabled = true; _oc.textContent = '';
try { const _oq = await ctx.ai.run('staff', { prompt: prompt(), provider: 'gemini' }); _ox((_oq && (_oq.text ?? _oq)) || '', 'ai'); }
catch (x) { _oc.textContent = (x && x.message) || 'AI chưa trả lời'; } finally { aiBtn.disabled = false; }
}, { kind: 'primary', testid: 'skill-ai-run', ai: true });
const _o7 = target => K.button(target === 'claude' ? 'Nhờ Claude (tự dán)' : 'Nhờ Gemini chat (tự dán)', async () => {
if (!idea.value.trim()) { _oc.textContent = 'Gõ ý tưởng kỹ năng trước.'; return; }
if (!ctx.ai || typeof ctx.ai.handoff !== 'function') { _oc.textContent = 'Chưa có AI qua chat'; return; }
const _oy = await ctx.ai.handoff('staff', prompt(), { target });
if (_oy) _ox(_oy, 'ai');
}, { testid: 'skill-ai-' + target, title: 'Mở chat với lời nhắn soạn sẵn – dán kết quả về, không tốn gói' });
const _o12 = h('div', { class: 'bds-form', 'data-way': 'ai' }, K.field('Ý tưởng kỹ năng', idea), K.field('Mảng', field),
h('div', { class: 'bds-row bds-wrap' }, aiBtn, _o7('claude'), _o7('gemini')), h('small', { class: 'bds-muted' }, 'AI soạn xong anh/chị xem trước, sửa rồi mới lưu.'));
const _o15 = { file: ['📄 Chọn tệp', _o13], paste: ['📋 Dán', _o14], ai: ['✨ Nhờ AI soạn', _o12] };
const _ot = h('div', { class: 'stf-seg', role: 'group', 'aria-label': 'Cách thêm' });
const _on = w => {
for (const [k, [, el]] of Object.entries(_o15)) el.hidden = k !== w;
for (const _o4 of _ot.children) _o4.setAttribute('aria-pressed', String(_o4.dataset.v === w));
};
for (const [k, [label]] of Object.entries(_o15)) _ot.appendChild(h('button', { type: 'button', 'data-v': k, 'data-testid': 'skill-way-' + k, onclick: () => _on(k) }, label));
body.appendChild(h('p', { class: 'bds-muted' }, SKILL_EXPLAIN + (staff ? ' Kỹ năng mới tự gắn cho ' + staff.name + '.' : '')));
body.appendChild(_ot);
body.appendChild(_o13); body.appendChild(_o14); body.appendChild(_o12);
body.appendChild(_oc); body.appendChild(_oo);
_on(way || (replace ? 'file' : 'paste'));
if (replace && way === 'edit') { for (const [, el] of Object.values(_o15)) el.hidden = true; _ot.hidden = true; _ov(replace); }
return _ou;
}
export function openSkillFromEdit(D, staff) {
const { K, ctx } = D;
const e = (staff.edits || []).slice(-1)[0];
if (!e) { K.toast('Chưa có lần sửa nào – sửa kết quả rồi Duyệt để app học', 'info'); return; }
const _ou = openAddSkill(D, { staff, way: 'ai' });
const p = SK.skillFromEditPrompt({ staffName: staff.name, before: e.before, after: e.after });
const box = _ou.el.querySelector('[data-way="ai"]');
if (!box) return;
box.innerHTML = '';
const _oc = _ou.el.querySelector('[data-testid="skill-err"]');
const fill = _oy => {
const _oq = SK.parseDraftReply(String(_oy || ''), { source: 'edit' });
if (!_oq.ok) { _oc.textContent = _oq.error; return; }
const _op = _ou.el.querySelector('[data-testid="skill-preview"]');
_ou.el.querySelector('[data-testid="skill-pv-name"]').value = _oq.skill.name;
_ou.el.querySelector('[data-testid="skill-pv-desc"]').value = _oq.skill.description;
_ou.el.querySelector('[data-testid="skill-pv-body"]').value = _oq.skill.body;
_op.hidden = false; _oc.textContent = '';
};
box.appendChild(h('p', { class: 'bds-muted' }, `AI so sánh bản trước/sau lần anh/chị sửa gần nhất của ${staff.name} và soạn thành kỹ năng (đã che sđt/email).`));
box.appendChild(h('details', null, h('summary', null, 'Lời nhắn sẽ gửi'), h('pre', { class: 'bds-pre bds-scroll stf-pre' }, p)));
const run = K.button('✨ Soạn bằng Gemini (miễn phí)', async () => {
if (!ctx.ai || typeof ctx.ai.run !== 'function') { _oc.textContent = 'Chưa bật AI'; return; }
run.disabled = true;
try { const _oq = await ctx.ai.run('staff', { prompt: p, provider: 'gemini' }); fill((_oq && (_oq.text ?? _oq)) || ''); }
catch (x) { _oc.textContent = (x && x.message) || 'AI chưa trả lời'; } finally { run.disabled = false; }
}, { kind: 'primary', testid: 'skill-edit-run', ai: true });
const _o8 = K.button('Nhờ Claude (tự dán)', async () => {
if (!ctx.ai || typeof ctx.ai.handoff !== 'function') return;
const _oy = await ctx.ai.handoff('staff', p, { target: 'claude' }); if (_oy) fill(_oy);
}, { testid: 'skill-edit-claude' });
box.appendChild(h('div', { class: 'bds-row bds-wrap' }, run, _o8));
const seg = _ou.el.querySelector('.stf-seg'); if (seg) seg.hidden = true;
}
function download(name, text) {
try {
const _o10 = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
const _o1 = h('a', { href: _o10, download: name, style: 'display:none' });
document.body.appendChild(_o1); _o1.click(); _o1.remove();
setTimeout(() => URL.revokeObjectURL(_o10), 2000);
return true;
} catch { return false; }
}
export function skillsPanel(D, lib, staffList) {
const { K } = D;
const box = h('div', { class: 'bds-form', 'data-testid': 'skills-panel' });
const _oj = F.mineCount(lib);
box.appendChild(h('p', { class: 'bds-muted', 'data-testid': 'skills-explain' }, SKILL_EXPLAIN + ` Của anh/chị: ${_oj}/${_o0.maxSkills} · mỗi nhân viên tối đa ${_o0.maxPerStaff}.`));
box.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('+ Thêm kỹ năng', () => openAddSkill(D), { kind: 'primary', testid: 'skill-add-open' }),
K.button('⬆ Tải tệp kỹ năng', () => openAddSkill(D, { way: 'file' }), { testid: 'skill-upload-open' }),
K.button('✨ Nhờ AI soạn kỹ năng', () => openAddSkill(D, { way: 'ai' }), { testid: 'skill-ai-open' })));
const _oh = h('div', { class: 'stf-staff', 'data-testid': 'skill-list' });
const _os = async s => { await Store.saveSkill(K, s); D.refresh(); };
for (const s of lib) {
const _o11 = F.staffUsingSkill(staffList, s.id);
const _o16 = Number(s.updated) > 1e11 ? ' · cập nhật ' + K.date(Number(s.updated)) : '';
const _o3 = h('div', { class: 'stf-checks' }, staffList.filter(_ow => _ow.enabled !== false).map(_ow => {
const cb = h('input', { type: 'checkbox', checked: (_ow.skills || []).includes(s.id), 'data-testid': `skill-attach-${s.id}-${_ow.id}`,
onchange: async e => { const _ob = await attach(D, _ow.id, s.id, e.target.checked); if (_ob) { K.toast(_ob, 'warn'); e.target.checked = !e.target.checked; } else D.refresh(); } });
return h('label', { class: 'stf-check' }, cb, h('span', null, (_ow.icon || '🤖') + ' ' + _ow.name));
}));
_oh.appendChild(h('div', { class: 'stf-card' + (s.enabled === false ? ' off' : ''), 'data-testid': 'skill-' + s.id },
h('h4', null, '📘 ' + s.name),
h('div', { class: 'bds-row bds-wrap' }, K.badge('v' + (s.version || 1), 'muted'), K.badge(SOURCE[s.source] || 'Tự soạn', s.builtin ? 'info' : 'muted'),
s.always ? K.badge('Luôn dùng', 'warn') : null, s.enabled === false ? K.badge('Đang tắt', 'danger') : null),
h('small', { class: 'bds-muted', 'data-testid': 'skill-meta-' + s.id }, 'v' + (s.version || 1) + _o16 + (_o11.length ? ' · gắn cho ' + _o11.map(u => u.name).join(', ') : ' · chưa gắn nhân viên')),
s.description ? h('small', null, s.description) : null,
h('details', null, h('summary', null, 'Gắn cho nhân viên'), _o3),
h('div', { class: 'bds-row bds-wrap' },
K.button(s.enabled === false ? 'Bật' : 'Tắt', () => _os({ ...s, enabled: s.enabled === false }), { testid: 'skill-toggle-' + s.id }),
K.button('Xem', () => { K.sheet({ title: s.name, testid: 'skill-view', body: h('pre', { class: 'bds-pre bds-scroll stf-pre', 'data-testid': 'skill-view-md' }, SK.skillToMd(s)) }); }, { testid: 'skill-view-' + s.id }),
K.button('Sửa', () => openAddSkill(D, { replace: s, way: 'edit' }), { testid: 'skill-edit-' + s.id }),
K.button('Xuất SKILL.md', () => { if (download(F.skillFileName(s), SK.skillToMd(s))) K.toast('Đã tải ' + F.skillFileName(s), 'success'); }, { testid: 'skill-export-' + s.id }),
s.builtin || !canErase(D.ctx) ? null : K.button('Xoá', async () => {
const ok = await K.confirm({ title: 'Xoá kỹ năng?', text: `Xoá «${s.name}»${_o11.length ? ' (đang gắn cho ' + _o11.map(u => u.name).join(', ') + ')' : ''}? Không hoàn tác được.`, ok: 'Xoá', kind: 'danger', testid: 'skill-del-confirm' });
if (!ok) return;
await Store.deleteSkill(K, s.id);
const list = await D.loadStaff();
if (list.some(x => (x.skills || []).includes(s.id))) await D.saveStaff(list.map(x => ({ ...x, skills: (x.skills || []).filter(i => i !== s.id) })));
K.toast('Đã xoá kỹ năng', 'success'); D.refresh();
}, { testid: 'skill-del-' + s.id }))));
}
box.appendChild(_oh);
return box;
}

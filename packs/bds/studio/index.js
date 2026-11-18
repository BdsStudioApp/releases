import { kit, h } from '../_lib/kit.js';
import * as V from '../_lib/video.js';
import * as S from '../_lib/studio.js';
import { forFlow } from '../_lib/characters.js';
const add = (box, ...kids) => { for (const _os of kids) if (_os !== null && _os !== undefined && _os !== false) box.appendChild(_os); };
const _o1 = { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '8px' };
const _o3 = 'bds.studio';
const ls = (_o2c) => { try { if (_o2c === undefined) return JSON.parse(localStorage.getItem(_o3) || '{}'); localStorage.setItem(_o3, JSON.stringify(_o2c)); } catch { } return {}; };
export async function mount(el, ctx) {
const _o2 = kit(ctx);
const base = (ctx.config && ctx.config.ENGINE_URL) || V.ENGINE_URL;
const _o0 = (path, opts = {}) => V.engineCall(path, { base, ...opts });
const url = _o16 => base.replace(/\/$/, '') + _o16;
const alive = () => el.isConnected;
const st = { health: null, projects: [], name: ls().name || '', view: null, queue: null, maps: null, layouts: {}, previewId: null,
voice: ls().voice !== false, busyIds: new Set(), characters: [], budget: {}, enabled: {}, lastPing: 0, timer: 0 };
el.innerHTML = '';
const _oh = h('div', { 'data-testid': 'studio-engine' });
const projBox = h('div', { class: 'bds-form' });
const _od = h('div', { 'data-testid': 'studio-cost' });
const sceneList = h('div', { class: 'bds-list', 'data-testid': 'studio-scenes' });
const _o19 = h('div', { 'data-testid': 'studio-preview' });
const _oc = h('div', { 'data-testid': 'studio-check' });
const _o29 = h('div', { class: 'bds-row bds-wrap', 'data-testid': 'studio-templates' });
const _o1c = h('div', { 'data-testid': 'studio-queue' });
const _o11 = h('div', { 'data-testid': 'studio-maps' });
const _o17 = () => { if (!st.health || Date.now() - st.lastPing < 60000) return; st.lastPing = Date.now(); _o0('/scenes/ping', { method: 'POST', body: {} }).catch(() => {}); };
el.addEventListener('pointerdown', _o17); el.addEventListener('keydown', _o17);
const _oi = e => _o2.toast(e && e.code === 'BUSY' ? 'Máy đang bận dựng' : (e && e.message) || 'Máy dựng chưa trả lời', 'warn');
async function _o1f() {
try { st.health = await _o0('/health', { timeout: 2500 }); } catch { st.health = null; }
const s = V.engineState(st.health);
_oh.innerHTML = '';
_oh.appendChild(h('div', { class: 'bds-row bds-wrap' }, _o2.badge(s.label, s.tone),
st.health ? h('span', { class: 'bds-muted' }, `Bản ${st.health.version} · RAM ${st.health.ram_gb} GB · Ollama tạm nghỉ khi dựng`) : null));
if (!st.health) {
_oh.appendChild(h('p', { class: 'bds-muted' }, 'Dựng & Sửa chạy trên máy dựng (Mac/Windows). Bấm đúp "BDS Studio" trên Desktop rồi thử lại. Cách cài: màn Video → Máy dựng trên máy.'));
_oh.appendChild(h('div', { class: 'bds-row bds-wrap' },
_o2.button('Thử kết nối lại', () => start(), { testid: 'studio-retry' }),
_o2.button('Mở màn Video', () => _o2.nav('#/content/video'), { testid: 'studio-go-video' })));
}
return st.health;
}
async function _ow() {
const _o1e = await _o0('/scenes/projects'); st.projects = _o1e.projects || [];
if (!st.name || !st.projects.includes(st.name)) st.name = st.projects.find(_o13 => _o13 !== '_mau_moi') || st.projects[0] || '';
}
async function _ox(view) {
if (!st.name) return;
st.view = view || await _o0('/scenes/project?name=' + encodeURIComponent(st.name));
ls({ ...ls(), name: st.name, voice: st.voice });
_o1k(); _o1m(); _o1i(); _o1j();
}
function _o1k() {
projBox.innerHTML = '';
const _o20 = _o2.select(st.projects.map(_o13 => [_o13, _o13 === '_mau_moi' ? '_mau_moi (mẫu)' : _o13]), st.name, { 'data-testid': 'studio-project' });
_o20.addEventListener('change', async () => { st.name = _o20.value; st.layouts = {}; try { await _ox(); } catch (e) { _oi(e); } });
const voice = h('input', { type: 'checkbox', checked: st.voice, 'data-testid': 'studio-voice' });
voice.addEventListener('change', () => { st.voice = voice.checked; ls({ ...ls(), voice: st.voice }); });
const _o26 = S.summarize(st.view && st.view.check);
const _ob = !!(st.view && st.view.final_allowed && _o26.canExport);
const _ol = _o2.button('Xuất bản nét 1080p', () => _o24('final'), { kind: 'primary', testid: 'studio-final' });
_ol.disabled = !_ob;
_ol.title = _ob ? 'Xếp hàng dựng bản nét (chạy khi máy rảnh hoặc ban đêm, bấm "Chạy ngay" để chạy luôn)' : 'Cần "Kiểm tra" đạt (không còn lỗi đỏ) cho bản đang sửa';
const _o2c = st.view;
add(projBox,
h('div', { class: 'bds-row bds-wrap' }, _o2.field('Dự án', _o20),
_o2.button('+ Dự án mới', newProject, { testid: 'studio-new' })),
_o2c ? h('p', { class: 'bds-muted' }, `${_o2c.scenes.length} cảnh · ~${Math.round(_o2c.duration)} giây` + (_o2c.preview ? ` · bản xem trước ${_o2c.preview.width}×${_o2c.preview.height}` : '')) : null,
h('label', { class: 'bds-check' }, voice, ' Giọng Vbee (chỉ đọc lại câu đã sửa – câu cũ dùng lại)'),
h('div', { class: 'bds-row bds-wrap' },
_o2.button('▶ Xem trước 480p', () => _o24('preview'), { kind: 'primary', testid: 'studio-preview-btn' }),
_o2.button('Kiểm tra trước khi xuất', () => _o24('check'), { testid: 'studio-check-btn' }),
_ol),
!_ob ? h('p', { class: 'bds-muted', 'data-testid': 'studio-final-why' }, '🔒 ' + (!_o2c || !_o2c.check ? 'Bấm "Kiểm tra trước khi xuất" cho bản đang sửa.' : _o26.text)) : null,
h('p', { class: 'bds-muted' }, '📌 ' + S.AI_LABEL_REMINDER));
}
async function newProject() {
const _o13 = (prompt('Tên dự án (không dấu, vd: ocean_park_3pn):') || '').trim();
if (!_o13) return;
try { st.name = _o13; await _ox(await _o0('/scenes/project', { method: 'POST', body: { name: _o13, create: true } })); await _ow(); _o1k(); }
catch (e) { _oi(e); }
}
function _ot() { return (st.view ? st.view.scenes : []).map(s => s.kind); }
function _o1j() {
_od.innerHTML = '';
if (!st.view) return;
const _o1z = st.view.cfg.scenes;
const t = S.estimateTotal(_o1z.map((scene, i) => ({ scene, kind: _ot()[i] })), { budget: st.budget });
add(_od,
h('p', { 'data-testid': 'studio-cost-text' }, _o2.badge('Ước tính', 'info'), ' ', t.text),
t.blocked.length ? h('p', { class: 'bds-muted', 'data-testid': 'studio-cost-blocked' }, '🔒 ' + t.blocked.map(_o8 => `Cảnh ${_o8.index + 1}: ${_o8.reason}`).join(' · ')) : null,
t.over_cap ? h('p', { class: 'bds-muted' }, `⚠ Vượt trần ${t.cap_usd} USD/video – app dừng và hỏi trước khi chi thêm.`) : null,
h('small', { class: 'bds-muted' }, 'Áp dụng cho cả video:'),
h('div', { class: 'bds-row bds-wrap' },
_o2.button('Bản đồ/số liệu → 🖥 máy', () => _o7({ group: 'map', engine: 'machine' }), { testid: 'apply-map-machine' }),
_o2.button('Cảnh người → ✨ Flow', () => _o7({ group: 'people', engine: 'ai', provider: 'flow' }), { testid: 'apply-people-flow' })));
}
async function _o7(rule) {
const cfg = JSON.parse(JSON.stringify(st.view.cfg));
cfg.scenes = S.applyToAll(cfg.scenes, _ot(), rule);
await _o1u(cfg, 'Đã áp dụng cho cả video');
}
async function _o1u(cfg, msg) {
try { await _ox(await _o0('/scenes/project', { method: 'POST', body: { name: st.name, cfg } })); if (msg) _o2.toast(msg, 'success'); }
catch (e) { _oi(e); }
}
async function _o1v(i, scene, items, msg) {
try { await _ox(await _o0('/scenes/scene', { method: 'POST', body: { name: st.name, index: i, scene, items } })); if (msg) _o2.toast(msg, 'success'); return true; }
catch (e) { _oi(e); return false; }
}
function _o1m() {
sceneList.innerHTML = '';
if (!st.view) { sceneList.appendChild(_o2.empty('Chưa có dự án')); return; }
st.view.scenes.forEach((s, i) => sceneList.appendChild(_o1y(s, i)));
}
function _o1y(s, i) {
const scene = st.view.cfg.scenes[i];
const ch = S.choiceOf(scene, s.kind);
const _o25 = S.suggest(scene, { engineKind: s.kind, enabled: st.enabled });
const thumb = s.thumb ? h('img', { src: url(s.thumb), alt: 'Khung cảnh ' + (i + 1), loading: 'lazy', style: { width: '72px', height: '128px', objectFit: 'cover', borderRadius: '8px', flex: '0 0 auto' } })
: h('div', { class: 'bds-empty', style: { width: '72px', height: '128px', flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' } }, 'Chưa có ảnh');
const toggle = h('div', { class: 'bds-row bds-wrap', role: 'group', 'aria-label': 'Cách dựng cảnh ' + (i + 1) },
...['machine', 'ai'].map(eng => {
const _o8 = _o2.button(S.ENGINE_LABEL[eng], () => _o1v(i, S.setChoice(scene, eng, eng === 'ai' ? (ch.provider || _o25.provider) : null)),
{ kind: ch.engine === eng ? 'primary' : 'ghost', testid: `engine-${eng}-${i}` });
_o8.setAttribute('aria-pressed', String(ch.engine === eng)); return _o8;
}));
const _o1r = h('div', { class: 'bds-item', style: _o1, 'data-testid': 'scene-' + i },
h('div', { class: 'bds-row', style: { alignItems: 'flex-start', gap: '12px', flexWrap: 'nowrap' } }, thumb,
h('div', { style: { minWidth: 0, flex: '1 1 auto' } },
h('div', { class: 'bds-row bds-wrap' }, h('strong', null, `Cảnh ${i + 1}`), _o2.badge(S.KIND_LABEL[ch.kind] || s.kind_label, 'muted'),
h('span', { class: 'bds-muted' }, `${s.dur.toFixed(1).replace('.', ',')} giây`), s.cached ? _o2.badge('đã dựng', 'success') : null),
s.title ? h('div', null, s.title) : null,
h('div', { class: 'bds-muted', style: { overflowWrap: 'anywhere' } }, s.subs.map(x => x.text.replace(/\*\*/g, '')).join(' · ') || s.hook || '—'))),
toggle,
ch.engine === 'ai' ? _o6(scene, s, i, ch, _o25) : h('small', { class: 'bds-muted' }, 'Gợi ý: ' + (_o25.engine === 'machine' ? _o25.reason : S.ENGINE_LABEL.ai + ' – ' + _o25.reason)),
h('div', { class: 'bds-row bds-wrap' },
_o2.button('✎ Sửa', () => _o15(i), { kind: 'primary', testid: 'edit-' + i }),
_o2.button('↑', () => _o12(i, i - 1), { title: 'Lên', testid: 'up-' + i }),
_o2.button('↓', () => _o12(i, i + 1), { title: 'Xuống', testid: 'down-' + i }),
_o2.button('✕', () => _oe(i), { title: 'Xoá cảnh', testid: 'del-' + i })));
return _o1r;
}
function _o6(scene, s, i, ch, _o25) {
const _o20 = _o2.select(_o25.list.map(_o16 => [_o16.id, _o16.label + (_o16.recommended ? ' (gợi ý)' : '') + (_o16.paid ? ' – trả phí riêng' : '')]), ch.provider, { 'data-testid': 'provider-' + i });
_o20.addEventListener('change', () => _o1v(i, S.setChoice(scene, 'ai', _o20.value)));
const P = S.PROVIDERS[ch.provider];
const _oa = S.canRunAi(scene, { enabled: st.enabled, budget: st.budget });
const character = st.characters[0] ? forFlow(st.characters[0]) : null;
const flow = (scene.media || {}).flow;
const stage = flow && flow.stage === 'draft' && (scene.studio || {}).draft_ok ? 'final' : (flow ? flow.stage : 'draft');
const prompt = () => S.aiPrompt(scene, { kind: s.kind, character, provider: ch.provider, stage });
const _ok = h('input', { type: 'file', accept: 'video/*,image/*', style: { display: 'none' }, 'data-testid': 'clip-input-' + i });
_ok.addEventListener('change', async () => {
const _oj = _ok.files[0]; _ok.value = ''; if (!_oj) return;
try {
_o2.toast('Đang gửi clip…', 'info');
const _o2a = await _o0('/upload?name=' + encodeURIComponent(_oj.name), { method: 'POST', body: _oj, timeout: 15 * 60000, headers: { 'Content-Type': _oj.type || 'application/octet-stream' } });
const _o23 = flow && (scene.studio || {}).draft_ok ? 'final' : 'draft';
const next = S.attachClip(scene, { path: _o2a.path, provider: ch.provider, stage: _o23, room: s.kind });
if (await _o1v(i, next, null, _o23 === 'final' ? 'Đã gắn bản nét' : 'Đã gắn clip nháp – xem trước rồi duyệt')) {
_o0('/scenes/clips', { method: 'POST', body: { path: _o2a.path, project: st.name, unit_type: (scene.studio || {}).unit_type || '', room: s.kind, stage: _o23, model: _o23 === 'final' ? 'quality' : 'fast' } }).catch(() => {});
}
} catch (e) { _oi(e); }
});
const box = h('div', { class: 'bds-form', 'data-testid': 'ai-panel-' + i },
_o2.field('Dịch vụ AI', _o20),
h('p', { class: 'bds-muted', 'data-testid': 'ai-suggest-' + i }, `💡 ${_o25.reason} · ${S.costLine(ch.provider, scene.dur)} · ${P.time}`),
P.paid ? h('p', { class: 'bds-muted' }, '💳 ' + P.cost + '. ' + P.note) : null,
h('div', { class: 'bds-row bds-wrap' },
_o2.button('Chép lời nhắn' + (ch.provider === 'flow' ? (stage === 'final' ? ' (Quality)' : ' (nháp Fast)') : ''), async () => {
if (!_oa.ok) { _o2.toast(_oa.reason, 'warn'); return; }
await _o2.copy(prompt()); _o2.toast('Đã chép lời nhắn', 'success');
}, { testid: 'ai-copy-' + i }),
P.url ? _o2.button('Mở ' + P.label.split(' (')[0], () => {
if (!_oa.ok) { _o2.toast(_oa.reason, 'warn'); return; }
window.open(P.url, '_blank', 'noopener');
}, { testid: 'ai-open-' + i }) : null,
P.paid && !(scene.studio || {}).paid_approved ? _o2.button('Duyệt chi phí', async () => {
if (await _o2.aiConfirm({ id: 'studio_paid', provider: 'video_api', providerLabel: P.label }, { est: { text: `${P.label}: ${P.cost}. Anh/chị tự kiểm giá trên trang dịch vụ trước khi tạo.` }, title: 'Duyệt dịch vụ trả phí', testid: 'paid-confirm' }))
await _o1v(i, S.approvePaid(scene), null, 'Đã duyệt');
}, { kind: 'primary', testid: 'ai-approve-' + i, aiBadge: { id: 'studio_paid', providerLabel: P.label } }) : null,
_o2.button((scene.media || {}).src ? 'Đổi clip' : 'Gắn clip đã tải', () => _ok.click(), { testid: 'ai-attach-' + i }),
_o2.button('Dùng lại clip', () => _o1q(scene, s, i), { testid: 'ai-reuse-' + i }),
flow && flow.stage === 'draft' && !(scene.studio || {}).draft_ok ? _o2.button('Duyệt nháp → tạo bản nét', () =>
_o1v(i, { ...scene, studio: { ...(scene.studio || {}), draft_ok: true } }, null, 'Đã duyệt nháp – chép lời nhắn Quality rồi gắn bản nét'), { testid: 'ai-draft-ok-' + i }) : null),
!_oa.ok ? h('small', { class: 'bds-muted', 'data-testid': 'ai-blocked-' + i }, '🔒 ' + _oa.reason) : null,
flow ? h('small', { class: 'bds-muted' }, flow.stage === 'final' ? '✓ Bản nét đã gắn' : '◐ Đang dùng bản nháp (Veo Fast) – duyệt rồi mới tạo bản Quality') : null,
(scene.media || {}).src && !flow ? h('small', { class: 'bds-muted' }, '✓ Đã gắn ảnh – máy làm chuyển động nhẹ, ghi "Ảnh minh hoạ"') : null,
_ok);
return box;
}
async function _o1q(scene, s, i) {
try {
const _o1e = await _o0('/scenes/clips?project=' + encodeURIComponent(st.name) + '&room=' + encodeURIComponent(s.kind));
const list = _o1e.clips || [];
if (!list.length) { _o2.toast('Chưa có clip cùng dự án/loại căn trong thư viện', 'info'); return; }
let _oy;
_oy = _o2.modal({ title: 'Dùng lại clip', testid: 'reuse-modal', body: [h('div', { class: 'bds-list' }, list.slice(0, 12).map(_o9 => h('div', { class: 'bds-item' },
h('div', { class: 'bds-row-main' }, h('strong', null, _o9.name), h('span', { class: 'bds-sub' }, [_o9.project, _o9.unit_type, _o9.stage === 'final' ? 'bản nét' : 'nháp'].filter(Boolean).join(' · '))),
_o2.button('Dùng', async () => { _oy.close(); await _o1v(i, S.attachClip(scene, { path: _o9.path, provider: 'flow', stage: _o9.stage, room: _o9.room }), null, 'Đã dùng lại clip'); }))))] });
} catch (e) { _oi(e); }
}
async function _o12(i, j) {
if (j < 0 || j >= st.view.scenes.length) return;
try { await _ox(await _o0('/scenes/move', { method: 'POST', body: { name: st.name, from: i, to: j } })); } catch (e) { _oi(e); }
}
async function _oe(i) {
if (!(await _o2.confirm({ title: 'Xoá cảnh', text: `Xoá cảnh ${i + 1}?`, ok: 'Xoá', kind: 'danger', testid: 'del-confirm' }))) return;
try { await _ox(await _o0('/scenes/delete', { method: 'POST', body: { name: st.name, index: i } })); } catch (e) { _oi(e); }
}
function _o15(i) {
const scene = JSON.parse(JSON.stringify(st.view.cfg.scenes[i]));
const _oo = st.view.scenes[i];
const title = h('input', { value: _oo.title, 'data-testid': 'ed-title' });
const kicker = h('input', { value: _oo.kicker, 'data-testid': 'ed-kicker' });
const dur = h('input', { type: 'number', min: '0.5', max: '60', step: '0.5', value: _oo.dur, inputmode: 'decimal', 'data-testid': 'ed-dur' });
let subs = _oo.subs.map(x => ({ ...x }));
const subsBox = h('div', { class: 'bds-form', 'data-testid': 'ed-subs' });
const _o1n = () => {
subsBox.innerHTML = '';
subs.forEach((x, _os) => {
const t = h('input', { value: x.text, 'data-testid': 'ed-sub-' + _os, 'aria-label': 'Phụ đề ' + (_os + 1) });
const say = h('input', { value: x.say, placeholder: 'Lời đọc (để trống = đọc như phụ đề)', 'data-testid': 'ed-say-' + _os, 'aria-label': 'Lời đọc ' + (_os + 1) });
const warn = h('small', { class: 'bds-muted' });
const _o2b = () => { x.text = t.value; x.say = say.value; const _oq = S.liveIssues(t.value); warn.textContent = _oq.length ? '⚠ ' + _oq.join('; ') : ''; };
t.addEventListener('input', _o2b); say.addEventListener('input', _o2b); _o2b();
subsBox.appendChild(h('div', { class: 'bds-item', style: _o1 }, _o2.field(`Câu ${_os + 1}`, t), say, warn,
_o2.button('Bỏ câu', () => { subs.splice(_os, 1); _o1n(); }, { testid: 'ed-sub-del-' + _os })));
});
subsBox.appendChild(_o2.button('+ Thêm câu', () => { subs.push({ text: '', say: '' }); _o1n(); }, { testid: 'ed-sub-add' }));
};
_o1n();
const labelPatch = {};
const _ou = st.layouts[i];
const labs = _oo.labels.map(l => ({ ...l, ...((_ou && _ou.labels || []).find(x => x.id === l.id) || {}) }));
const labBox = h('div', { class: 'bds-form', 'data-testid': 'ed-labels' });
const _op = {};
labs.forEach(l => {
const dx = h('input', { type: 'number', value: l.label_offset[0], step: '10', 'data-testid': 'ed-dx-' + l.id, 'aria-label': 'Lệch ngang ' + l.name });
const dy = h('input', { type: 'number', value: l.label_offset[1], step: '10', 'data-testid': 'ed-dy-' + l.id, 'aria-label': 'Lệch dọc ' + l.name });
const side = _o2.select([['right', 'Bên phải'], ['left', 'Bên trái']], l.label_side, { 'data-testid': 'ed-side-' + l.id });
const set = () => { labelPatch[l.id] = { label_offset: [Number(dx.value) || 0, Number(dy.value) || 0], label_side: side.value }; };
[dx, dy, side].forEach(x => x.addEventListener('change', set));
_op[l.id] = { dx, dy, side, set };
labBox.appendChild(h('div', { class: 'bds-grid2' }, h('strong', null, l.name), side, _o2.field('Lệch ngang (px)', dx), _o2.field('Lệch dọc (px)', dy)));
});
const dragArea = _oo.thumb ? _of(_oo, labs, (id, patch) => {
labelPatch[id] = patch; const x = _op[id];
if (x) { x.dx.value = patch.label_offset[0]; x.dy.value = patch.label_offset[1]; x.side.value = patch.label_side; }
}) : h('p', { class: 'bds-muted' }, 'Bấm "Kiểm tra" để có ảnh khung – khi đó kéo nhãn trực tiếp trên ảnh.');
const _on = h('input', { type: 'file', accept: 'image/*,video/*', 'data-testid': 'ed-image' });
const illus = h('input', { type: 'checkbox', checked: !!(scene.media && scene.media.ai), 'data-testid': 'ed-illus' });
let _o14 = null;
_on.addEventListener('change', async () => {
const _oj = _on.files[0]; if (!_oj) return;
try { const _o2a = await _o0('/upload?name=' + encodeURIComponent(_oj.name), { method: 'POST', body: _oj, timeout: 15 * 60000 }); _o14 = _o2a.path; _o2.toast('Đã tải ảnh lên máy dựng', 'success'); }
catch (e) { _oi(e); }
});
const rewrite = async () => {
const _o16 = S.rewritePrompt({ ...scene, subs: subs.map(x => x.text), title: { text: title.value } }, { topic: st.name });
try {
let text = null;
try { const _o1e = await ctx.ai.run('script', { prompt: _o16, feature: 'studio_rewrite' }); text = _o1e && _o1e.text; } catch (e) { if (_o2.isAiCancel(e)) return; text = null; }
if (!text && ctx.ai && ctx.ai.handoff) text = await ctx.ai.handoff('script', _o16);
const _ov = S.parseRewrite(text);
if (!_ov.length) { _o2.toast('AI chưa trả lời', 'warn'); return; }
subs = _ov.map(t => ({ text: t, say: '' })); _o1n(); _o2.toast('Đã viết lại – anh/chị soát rồi lưu', 'success');
} catch (e) { _oi(e); }
};
const _o1t = async andPreview => {
let next;
try { next = S.applyEdit(scene, { title: title.value, kicker: kicker.value, subs, dur: dur.value, hook: scene.hook ? _oo.hook : undefined }); }
catch (e) { _o2.toast(e.message, 'warn'); return; }
if (_o14) next.media = { ...(next.media || {}), src: _o14, ai: illus.checked };
else if (next.media) next.media.ai = illus.checked;
if (await _o1v(i, next, Object.keys(labelPatch).length ? labelPatch : null, 'Đã lưu cảnh ' + (i + 1) + ' – chỉ cảnh này dựng lại')) {
_o21.close();
if (andPreview) _o24('preview');
}
};
const _o21 = _o2.sheet({ title: `Sửa cảnh ${i + 1}`, testid: 'edit-sheet', body: h('div', { class: 'bds-form' },
h('div', { class: 'bds-grid2' }, _o2.field('Dòng nhỏ trên tiêu đề', kicker), _o2.field('Tiêu đề', title)),
_o2.field('Độ dài (giây – có giọng thì tự theo giọng)', dur),
h('h4', null, 'Phụ đề & lời đọc'), subsBox,
h('div', { class: 'bds-row bds-wrap' }, _o2.button('✨ AI viết lại', rewrite, { testid: 'ed-rewrite', aiBadge: 'studio_rewrite' })),
labs.length ? h('h4', null, 'Vị trí nhãn') : null, labs.length ? dragArea : null, labBox,
h('h4', null, 'Ảnh / clip của cảnh'), _o2.field('Đổi ảnh', _on),
h('label', { class: 'bds-check' }, illus, ' Ảnh 3D/phối cảnh/AI → ghi "Ảnh minh hoạ" (không ghi chữ "AI")'),
h('div', { class: 'bds-row bds-wrap' },
_o2.button('Lưu', () => _o1t(false), { testid: 'ed-save' }),
_o2.button('Lưu & xem trước', () => _o1t(true), { kind: 'primary', testid: 'ed-save-preview' }))) });
}
function _of(_oo, labs, onMove) {
const _o5 = 270, _os = _o5 / 1080;
const _o2d = h('div', { 'data-testid': 'ed-drag', style: { position: 'relative', width: _o5 + 'px', height: Math.round(1920 * _os) + 'px', touchAction: 'none', maxWidth: '100%' } },
h('img', { src: url(_oo.thumb), alt: 'Khung cảnh', style: { width: '100%', height: '100%', borderRadius: '8px', display: 'block' } }),
h('div', { style: { position: 'absolute', left: '0', right: Math.round(150 * _os) + 'px', top: Math.round(288 * _os) + 'px', height: Math.round((1250 - 288) * _os) + 'px', border: '1px dashed rgba(201,162,74,.8)', pointerEvents: 'none' }, title: 'Vùng an toàn TikTok' }));
for (const l of labs) {
if (!l.box) continue;
const [x0, y0, x1, y1] = l.box;
const _o27 = h('div', { 'data-testid': 'drag-' + l.id, role: 'button', tabindex: '0', 'aria-label': 'Kéo nhãn ' + l.name,
style: { position: 'absolute', left: x0 * _os + 'px', top: y0 * _os + 'px', width: Math.max(24, (x1 - x0) * _os) + 'px', height: Math.max(14, (y1 - y0) * _os) + 'px', border: '2px solid #C9A24A', borderRadius: '4px', cursor: 'move', background: 'rgba(201,162,74,.15)' } });
let start = null;
_o27.addEventListener('pointerdown', e => { start = { x: e.clientX, y: e.clientY, l: parseFloat(_o27.style.left), t: parseFloat(_o27.style.top) }; _o27.setPointerCapture && _o27.setPointerCapture(e.pointerId); e.preventDefault(); });
_o27.addEventListener('pointermove', e => { if (!start) return; _o27.style.left = (start.l + e.clientX - start.x) + 'px'; _o27.style.top = (start.t + e.clientY - start.y) + 'px'; });
const _og = () => { if (!start) return; start = null; onMove(l.id, S.dragToOffset(l, parseFloat(_o27.style.left) / _os, parseFloat(_o27.style.top) / _os)); };
_o27.addEventListener('pointerup', _og); _o27.addEventListener('pointercancel', _og);
_o2d.appendChild(_o27);
}
return _o2d;
}
function _o1o() {
_o29.innerHTML = '';
for (const t of S.TEMPLATES) {
_o29.appendChild(_o2.button(`${t.icon} ${t.label}`, async () => {
if (!st.view) { _o2.toast('Chọn dự án trước', 'warn'); return; }
const _o1e = S.makeTemplate(t.id, st.view.cfg);
try { await _ox(await _o0('/scenes/insert', { method: 'POST', body: { name: st.name, at: null, scene: _o1e.scene, items: _o1e.items } })); _o2.toast('Đã chèn mẫu "' + t.label + '" vào cuối – bấm Sửa để điền', 'success'); }
catch (e) { _oi(e); }
}, { testid: 'tpl-' + t.id, title: t.desc }));
}
}
function _o1i(res) {
_oc.innerHTML = '';
const _o9 = res || (st.view && st.view.check);
const _o26 = S.summarize(_o9);
_oc.appendChild(h('p', null, _o2.badge(_o26.text, !_o9 ? 'muted' : _o26.errors ? 'danger' : _o26.warnings ? 'warn' : 'success')));
if (!_o9) { _oc.appendChild(h('p', { class: 'bds-muted' }, st.view && st.view.check_stale ? 'Đã sửa sau lần kiểm tra trước – kiểm tra lại.' : 'Bấm "Kiểm tra trước khi xuất".')); return; }
const _o28 = h('table', { 'data-testid': 'check-table', style: { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' } },
h('tbody', null, _o26.rows.map(_o1e => h('tr', { 'data-testid': 'check-' + _o1e.id, 'data-status': _o1e.status },
h('td', { style: { padding: '6px', width: '28px', verticalAlign: 'top', fontWeight: '700', color: _o1e.status === 'error' ? '#d9534f' : _o1e.status === 'warn' ? '#C9A24A' : '#3aa76d' } }, S.STATUS_ICON[_o1e.status]),
h('td', { style: { padding: '6px', whiteSpace: 'normal', overflowWrap: 'anywhere' } }, h('div', null, _o1e.label), _o1e.detail ? h('small', { class: 'bds-muted', style: { overflowWrap: 'anywhere' } }, _o1e.detail) : null)))));
_oc.appendChild(_o28);
}
async function _o24(kind) {
if (!st.view) return;
try {
const _o1e = await _o0('/scenes/' + kind, { method: 'POST', body: { name: st.name, voice: st.voice } });
st.busyIds.add(_o1e.id);
_o2.toast(kind === 'final' ? 'Đã xếp hàng bản nét – chạy khi máy rảnh/ban đêm (hoặc "Chạy ngay")' : 'Đã xếp hàng – đang dựng', 'info');
await _o1h();
} catch (e) { _oi(e); }
}
async function _o1h() {
try { st.queue = await _o0('/scenes/queue'); } catch { st.queue = null; }
_o1l();
for (const id of [...st.busyIds]) {
const _or = st.queue && st.queue.items.find(x => x.id === id);
if (!_or || (_or.state !== 'done' && _or.state !== 'error')) continue;
st.busyIds.delete(id);
if (_or.state === 'error') { _o2.toast(_or.error || 'Dựng lỗi', 'warn'); continue; }
if (_or.kind === 'preview') _o22(_or);
if (_or.kind === 'check' || _or.kind === 'thumbs') { await _ox(); _o1i(); }
if (_or.kind === 'final') _o2.toast('Đã xuất bản nét – xem trong thư mục BDS Studio/Video', 'success');
if (_or.kind === 'preview') await _ox();
}
clearTimeout(st.timer);
if (alive() && st.queue && st.queue.items.some(x => x.state === 'running' || (x.state === 'queued' && st.busyIds.has(x.id)))) st.timer = setTimeout(_o1h, 1500);
}
function _o22(_or) {
_o19.innerHTML = '';
const _o1e = _or.result || {};
add(_o19,
h('video', { src: url(`/scenes/file/${_or.id}/mp4?t=${Date.now()}`), controls: true, playsinline: true, autoplay: true, muted: true, loop: true, 'data-testid': 'studio-video', style: { width: '100%', maxWidth: '300px', borderRadius: '10px', background: '#000' } }),
h('p', { class: 'bds-muted', 'data-testid': 'studio-preview-info' }, `${_o1e.width}×${_o1e.height} · ${Number(_o1e.duration || 0).toFixed(1).replace('.', ',')} giây · dựng lại ${(_o1e.rendered || []).length} cảnh, dùng lại ${(_o1e.cached || []).length} cảnh` + (_o1e.lufs != null ? ` · ${_o1e.lufs.toFixed(1).replace('.', ',')} LUFS` : '')));
}
function _o1l() {
_o1c.innerHTML = '';
const _o1a = st.queue;
if (!_o1a) { _o1c.appendChild(_o2.empty('Chưa kết nối máy dựng')); return; }
_o1c.appendChild(h('p', { 'data-testid': 'queue-mode', 'data-mode': _o1a.mode }, _o2.badge(S.QUEUE_MODE[_o1a.mode] || _o1a.reason, _o1a.mode === 'busy' ? 'warn' : 'success'),
_o1a.held ? h('span', { class: 'bds-muted' }, ' · job khác chờ máy rảnh') : null));
const items = _o1a.items.filter(x => x.state === 'queued' || x.state === 'running' || Date.now() - (x.finished || 0) < 3600000).slice(0, 15);
if (!items.length) { _o1c.appendChild(_o2.empty('Hàng đợi trống')); return; }
const _o1d = items.filter(x => x.state === 'queued').map(x => x.id);
const list = h('div', { class: 'bds-list', 'data-testid': 'queue-list' });
items.forEach(_or => {
const qi = _o1d.indexOf(_or.id);
const _o1r = h('div', { class: 'bds-item', style: _o1, 'data-testid': 'q-' + _or.id, draggable: _or.state === 'queued' ? 'true' : null },
h('div', { class: 'bds-row-main' }, h('strong', null, (_or.state === 'queued' ? '⠿ ' : '') + _or.title),
h('span', { class: 'bds-sub' }, (S.QUEUE_STATE[_or.state] || _or.state) + (_or.state === 'running' ? ` ${Math.round((_or.progress || 0) * 100)}%` : '') + (_or.approved ? ' · đã duyệt' : ''))),
_or.state === 'queued' ? h('div', { class: 'bds-row bds-wrap' },
_o2.button('↑', () => _o1p(_o4(_o1d, qi, qi - 1)), { title: 'Lên', testid: 'q-up-' + _or.id }),
_o2.button('↓', () => _o1p(_o4(_o1d, qi, qi + 1)), { title: 'Xuống', testid: 'q-down-' + _or.id }),
_o2.button(_or.approved ? 'Bỏ duyệt' : 'Duyệt', () => _o1b('approve', { id: _or.id, approved: !_or.approved }), { testid: 'q-approve-' + _or.id }),
_o2.button('Chạy ngay', () => { st.busyIds.add(_or.id); _o1b('run_now', { id: _or.id }); }, { testid: 'q-now-' + _or.id }),
_o2.button('✕', () => _o1b('remove', { id: _or.id }), { title: 'Bỏ khỏi hàng đợi', testid: 'q-del-' + _or.id })) : null,
_or.state === 'done' && _or.kind === 'preview' ? _o2.button('Xem', () => _o22(_or), { testid: 'q-view-' + _or.id }) : null,
_or.state === 'error' ? h('small', { class: 'bds-muted' }, '✗ ' + (_or.error || '')) : null);
if (_or.state === 'queued') {
_o1r.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', _or.id); });
_o1r.addEventListener('dragover', e => e.preventDefault());
_o1r.addEventListener('drop', e => { e.preventDefault(); const from = _o1d.indexOf(e.dataTransfer.getData('text/plain')); if (from >= 0) _o1p(_o4(_o1d, from, qi)); });
}
list.appendChild(_o1r);
});
_o1c.appendChild(list);
}
const _o4 = S.moveId;
async function _o1p(ids) { await _o1b('order', { ids }); }
async function _o1b(what, body) {
try { st.queue = await _o0('/scenes/queue/' + what, { method: 'POST', body }); _o1l(); _o1h(); } catch (e) { _oi(e); }
}
async function _o1g() {
try { st.maps = await _o0('/scenes/maps'); } catch { st.maps = null; }
_o11.innerHTML = '';
const _oy = st.maps;
if (!_oy) return;
const allowed = _oy.allowed === true;
_o11.appendChild(h('p', { 'data-testid': 'maps-usage' }, `Bộ nhớ đệm chung: ${S.fmtBytes(_oy.cache_bytes)} / ${S.fmtBytes(_oy.limit_bytes)} · bản đồ tải sẵn ${S.fmtBytes(_oy.tiles_bytes)} · mức zoom ${_oy.zoom[0]}–${_oy.zoom[1]} · nguồn ${allowed ? _oy.source : 'chưa cấu hình'}`));
if (!allowed) _o11.appendChild(_o10(_oy));
const list = h('div', { class: 'bds-list' });
let _o1s = false;
for (const _o1e of _oy.regions) {
const _o18 = _o1e.progress && _o1e.progress.state === 'running' ? _o1e.progress : null; _o1s = _o1s || !!_o18;
list.appendChild(h('div', { class: 'bds-item', style: _o1, 'data-testid': 'map-' + _o1e.id },
h('div', { class: 'bds-row-main' }, h('strong', null, _o1e.name),
h('span', { class: 'bds-sub' }, _o18 ? `Đang tải ${_o18.done}/${_o18.total}` : _o1e.tiles_have >= _o1e.tiles_total ? `✓ Đã tải · ${S.fmtBytes(_o1e.bytes)}` : _o1e.tiles_have ? `${_o1e.tiles_have}/${_o1e.tiles_total} ô · ${S.fmtBytes(_o1e.bytes)}` : allowed ? `Chưa tải · ~${S.fmtBytes(_o1e.est_bytes)}` : 'Chưa tải')),
h('div', { class: 'bds-row bds-wrap' },
allowed && _o1e.tiles_have < _o1e.tiles_total && !_o18 ? _o2.button('⬇ Tải sẵn', () => _oz('prefetch', _o1e.id), { testid: 'map-get-' + _o1e.id }) : null,
_o1e.tiles_have ? _o2.button('Dùng làm nền cho dự án', () => _oz('use', _o1e.id), { testid: 'map-use-' + _o1e.id }) : null,
_o1e.tiles_have ? _o2.button('Xoá', () => _oz('delete', _o1e.id), { testid: 'map-del-' + _o1e.id }) : null)));
}
_o11.appendChild(list);
_o11.appendChild(h('p', { class: 'bds-muted' }, 'Video bản đồ dựng bằng dữ liệu OSM có sẵn trong máy dựng (không cần mạng, không cần kho này). Kho này chỉ tải thêm ảnh nền theo vùng từ nguồn tile anh/chị có giấy phép.'));
if (allowed) _o11.appendChild(h('div', { class: 'bds-row bds-wrap' }, h('small', { class: 'bds-muted', style: { overflowWrap: 'anywhere', minWidth: '0' } }, 'Nguồn: ' + (_oy.url_masked || _oy.source)),
_o2.button('Đổi / bỏ nguồn', () => _o1w({ url: '' }), { testid: 'map-src-clear' })));
if (_o1s && alive()) setTimeout(_o1g, 2000);
}
function _o10(_oy) {
const _om = _oy.help || {};
const url = h('input', { type: 'url', inputmode: 'url', placeholder: 'https://…/{z}/{x}/{y}.png?key=…', 'data-testid': 'map-src-url', style: { width: '100%' } });
const lic = h('input', { type: 'checkbox', 'data-testid': 'map-src-licensed' });
return h('div', { class: 'bds-conn-note', role: 'note', 'data-testid': 'maps-why', style: { flexDirection: 'column', alignItems: 'stretch', gap: '8px' } },
h('strong', null, 'Tải sẵn ảnh nền đang tắt'),
h('span', { class: 'bds-sub' }, _om.why || 'Máy chủ tile công cộng của OpenStreetMap không cho tải trước hàng loạt.'),
h('span', { class: 'bds-sub' }, _om.how || ''),
h('ul', { style: { margin: '0', paddingLeft: '18px' } }, (_om.providers || []).map(x => h('li', null,
h('a', { href: x.url, target: '_blank', rel: 'noopener' }, x.name), ' – ', x.note || 'kiểm điều khoản gói'))),
url,
h('label', { style: { display: 'flex', gap: '8px', alignItems: 'center', minHeight: '44px' } }, lic, 'Tôi có quyền dùng nguồn này (đã đọc điều khoản gói, cho phép lưu đệm)'),
h('div', null, _o2.button('Lưu nguồn tile', () => {
if (!url.value.trim()) return _o2.toast('Dán đường dẫn nguồn tile trước', 'warn');
if (!lic.checked) return _o2.toast('Đánh dấu "Tôi có quyền dùng nguồn này" trước', 'warn');
_o1w({ url: url.value.trim(), licensed: true });
}, { kind: 'primary', testid: 'map-src-save' })));
}
async function _o1w(body) {
try { await _o0('/scenes/maps/settings', { method: 'POST', body }); _o2.toast(body.url ? 'Đã lưu nguồn tile' : 'Đã bỏ nguồn tile', 'success'); _o1g(); } catch (e) { _oi(e); }
}
async function _oz(what, region) {
try {
const _o1e = await _o0('/scenes/maps/' + what, { method: 'POST', body: { region, name: st.name } });
if (what === 'use') { await _ox(_o1e); _o2.toast('Đã đặt ảnh nền cho dự án', 'success'); }
_o1g();
} catch (e) { _oi(e); }
}
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'studio-screen' },
h('div', { class: 'bds-head' }, h('h2', null, 'Dựng & Sửa')),
_o2.card({ title: 'Máy dựng', testid: 'card-studio-engine', body: _oh }),
_o2.card({ title: 'Dự án video', testid: 'card-studio-project', body: h('div', null, projBox, _od) }),
_o2.card({ title: 'Các cảnh', testid: 'card-studio-scenes', body: sceneList }),
_o2.card({ title: 'Xem trước', testid: 'card-studio-preview', body: _o19 }),
_o2.card({ title: 'Kiểm tra trước khi xuất', testid: 'card-studio-check', body: _oc }),
_o2.card({ title: 'Thư viện mẫu cảnh', testid: 'card-studio-templates', body: h('div', null, h('p', { class: 'bds-muted' }, 'Chèn mẫu vào cuối dự án rồi bấm Sửa để điền chữ, số liệu, nguồn.'), _o29) }),
_o2.card({ title: 'Hàng đợi thông minh', testid: 'card-studio-queue', actions: _o2.button('Làm mới', () => _o1h()), body: _o1c }),
_o2.card({ title: 'Kho bản đồ tải sẵn', testid: 'card-studio-maps', body: _o11 })));
_o1o();
async function start() {
try { st.characters = (await _o2.list('characters')).filter(_o9 => _o9.lock_en); } catch { st.characters = []; }
st.budget = (await _o2.setting('budget_limits', {})) || {};
st.enabled = (await _o2.setting('video_ai', {})) || {};
if (!(await _o1f())) { sceneList.innerHTML = ''; sceneList.appendChild(_o2.empty('Bật máy dựng để xem các cảnh')); _o1i(); return; }
try { await _ow(); await _ox(); } catch (e) { _oi(e); }
await _o1h(); await _o1g();
if (st.view && st.view.scenes.some(s => !s.thumb)) _o0('/scenes/thumbs', { method: 'POST', body: { name: st.name } }).then(_o1e => { st.busyIds.add(_o1e.id); _o1h(); }).catch(() => {});
}
await start();
}
export default {
manifest: {
id: 'studio', title: 'Dựng & Sửa', icon: '✂️', screen: 'content', order: 12, version: '1.0.0', status: 'ready', requires: 'video',
help: 'Dựng video theo từng cảnh: xem trước 480p nhanh, sửa cảnh nào chỉ dựng lại cảnh đó, kiểm tra trước khi xuất, hàng đợi thông minh. Cảnh người/nội thất dùng Flow/Veo (gói AI Pro).',
},
mount,
async selftest() {
const details = [];
try {
const _o1x = { subs: ['Phòng khách rộng'], dur: 8 };
if (S.suggest({ camera: { fit: ['a'] }, show: ['a'] }, { engineKind: 'ban_do' }).engine !== 'machine') details.push('Gợi ý cảnh bản đồ sai');
if (S.suggest(_o1x, { engineKind: 'nhan_vat' }).provider !== 'flow') details.push('Gợi ý cảnh nhân vật sai');
if (S.canRunAi({ studio: { provider: 'kling' } }).ok) details.push('Chưa chặn dịch vụ trả phí');
if (!S.makeTemplate('vi_tri', { items: [] }).scene) details.push('Mẫu cảnh lỗi');
} catch (e) { details.push('Lỗi: ' + (e && e.message)); }
return { ok: !details.length, details: details.length ? details : ['Dựng & Sửa: logic OK (máy dựng kiểm tra khi mở màn)'] };
},
};

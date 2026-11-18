import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as U from '../g1_lib/ui.js';
const AI_KEY = 'bds.g1.layout_ai';
export async function mount(el, ctx) {
S.ensureSalesCss(); U.ensureCss();
const _o0 = kit(ctx);
const canErase = !(ctx.user && ctx.user.perms && ctx.user.perms.erase === false);
const env = await S.loadEnv(ctx);
const _oc = S.hashParams();
const _ol = { project: _oc.get('project') || (env.projects.find(S.sellable) || env.projects[0] || {}).id, code: '', image: null, imgName: '', fields: null, warnings: [], provider: '', busy: false };
const _oi = h('div', { class: 'sl g1', 'data-testid': 'g1-layout' });
el.innerHTML = ''; el.appendChild(_oi);
const top = h('div', { class: 'sl-box sl-col' }), form = h('div', { class: 'sl-col' }), saved = h('div', { class: 'sl-col' });
_oi.append(U.title('Đọc layout căn từ ảnh'), h('p', { class: 'g1-lead' }, 'Chụp/chọn ảnh mặt bằng căn → AI điền sẵn diện tích, số phòng, hướng, view. Anh/chị soát lại rồi xác nhận.'), top, form, saved);
const _o8 = h('input', { type: 'file', accept: 'image/*', hidden: true, 'data-testid': 'g1-layout-file', onchange: (e) => _ob(e.target.files[0]) });
const _ok = U.aiSelect(_o0, ctx, AI_KEY, 'g1-layout-ai');
const preview = h('div');
top.append(
h('div', { class: 'sl-form' },
h('label', { class: 'sl-f' }, 'Dự án', _o0.select(env.projects.map((_oa) => [_oa.id, _oa.name]), _ol.project, { 'data-testid': 'g1-layout-project', onchange: (e) => { _ol.project = e.target.value; _oh(); } })),
h('label', { class: 'sl-f' }, 'Mã căn (nếu biết)', h('input', { value: '', 'data-testid': 'g1-layout-code', oninput: (e) => { _ol.code = e.target.value; } })),
h('label', { class: 'sl-f' }, 'AI đọc ảnh', _ok)),
h('div', { class: 'sl-row' },
_o0.button('📷 Chọn ảnh layout', () => _o8.click(), { kind: 'primary', testid: 'g1-layout-pick', aiBadge: 'layout_read', aiOptional: true }),
_o0.button('✍️ Tự nhập không cần AI', () => { _ol.fields = _o3(); _ol.warnings = []; _ol.provider = 'tay'; _og(); }, { kind: 'ghost', testid: 'g1-layout-manual' })),
preview, _o8);
const _o1 = () => {
if (ctx.user && ctx.user.perms && ctx.user.perms.ai === false) return false;
try { return !(ctx.ai && typeof ctx.ai.connected === 'function' && !ctx.ai.connected()); } catch { return true; }
};
const _o3 = () => ({ unit_code: _ol.code, area_m2: null, area_kind: 'khong_ro', bedrooms: null, wc: null, corner: null, north_arrow: false, balcony_dir: null, door_dir: null, view: '', notes: '', confidence: 1 });
async function _ob(file) {
_o8.value = '';
if (!file) return;
try {
const _o4 = await U.fileToCanvas(file, 1600);
_ol.image = { mime: 'image/jpeg', b64: U.canvasB64(_o4, 'image/jpeg', 0.85) }; _ol.imgName = file.name || 'layout.jpg';
preview.replaceChildren(h('img', { class: 'g1-preview', style: 'max-height:280px', src: 'data:image/jpeg;base64,' + _ol.image.b64, alt: 'Ảnh layout' }));
if (_ok.value !== 'handoff' && !_o1()) {
_ol.fields = _o3(); _ol.warnings = ['Chưa bật AI đọc ảnh – nhìn ảnh bên trên và tự điền (hoặc chọn "Làm bằng Claude/Gemini qua chat")']; _ol.provider = 'tay'; _og(); return;
}
await _oe();
} catch (e) { _o0.toast('Không đọc được ảnh: ' + ((e && e.message) || 'lỗi'), 'error'); }
}
async function _oe() {
const _oa = env.project(_ol.project), prompt = G.layoutPrompt(_oa, _ol.code);
const _o5 = _ok.value;
form.replaceChildren(h('div', { class: 'sl-box sl-muted', 'data-testid': 'g1-layout-busy' }, 'AI đang đọc ảnh…'));
let text = null;
try {
if (_o5 === 'handoff') {
if (!ctx.ai || typeof ctx.ai.handoff !== 'function') throw new Error('Chưa có trợ lý AI');
text = await ctx.ai.handoff('read_policy', prompt + '\n\n(Đính kèm ảnh layout vào khung chat.)');
if (!text) { form.replaceChildren(); return; }
_ol.provider = 'chat';
} else {
if (!ctx.ai || typeof ctx.ai.run !== 'function') throw new Error('Chưa nối AI – chọn "Làm bằng Claude/Gemini qua chat"');
const _od = await ctx.ai.run('read_layout', { prompt, images: [_ol.image], json: true, provider: _o5, feature: 'layout_read' });
text = _od && (_od.text ?? _od); _ol.provider = (_od && _od.provider) || _o5;
}
} catch (e) {
if (_o0.isAiCancel(e)) { form.replaceChildren(); return; }
form.replaceChildren(h('div', { class: 'g1-err', 'data-testid': 'g1-layout-error' }, 'AI chưa đọc được: ' + ((e && e.message) || 'lỗi') + '. Thử AI khác hoặc tự nhập.'));
return;
}
const n = G.normalizeLayout(text);
if (!n.ok) { form.replaceChildren(h('div', { class: 'g1-err', 'data-testid': 'g1-layout-error' }, n.warnings[0] + '. Thử AI khác hoặc tự nhập.')); return; }
_ol.fields = { ...n.fields, unit_code: n.fields.unit_code || _ol.code }; _ol.warnings = n.warnings;
_og();
}
function _og() {
const _o7 = _ol.fields; if (!_o7) { form.replaceChildren(); return; }
const _o6 = [['', '— chưa rõ —'], ...G.DIRS.map((d) => [d, d])];
const _om = [['', '— chưa rõ —'], ['1', 'Có'], ['0', 'Không']];
const _o9 = {
unit_code: h('input', { value: _o7.unit_code || '', 'data-testid': 'g1-lf-code' }),
area_m2: h('input', { value: _o7.area_m2 != null ? S.fmtNum(_o7.area_m2, 2) : '', inputmode: 'decimal', 'data-testid': 'g1-lf-area' }),
area_kind: _o0.select([['thong_thuy', 'Thông thuỷ'], ['tim_tuong', 'Tim tường'], ['khong_ro', 'Chưa rõ']], _o7.area_kind, { 'data-testid': 'g1-lf-kind' }),
bedrooms: h('input', { value: _o7.bedrooms ?? '', inputmode: 'numeric', 'data-testid': 'g1-lf-bed' }),
wc: h('input', { value: _o7.wc ?? '', inputmode: 'numeric', 'data-testid': 'g1-lf-wc' }),
corner: _o0.select(_om, _o7.corner == null ? '' : _o7.corner ? '1' : '0', { 'data-testid': 'g1-lf-corner' }),
balcony_dir: _o0.select(_o6, _o7.balcony_dir || '', { 'data-testid': 'g1-lf-balcony' }),
door_dir: _o0.select(_o6, _o7.door_dir || '', { 'data-testid': 'g1-lf-door' }),
view: h('input', { value: _o7.view || '', 'data-testid': 'g1-lf-view' }),
notes: h('textarea', { rows: 2 }, _o7.notes || ''),
};
const L = (label, el) => h('label', { class: 'sl-f' }, label, el);
const err = h('div', { class: 'sl-bad', role: 'alert', 'data-testid': 'g1-layout-err' });
form.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'g1-layout-form' },
h('h3', null, _ol.provider === 'tay' ? 'Nhập thông tin căn' : `AI (${U.AI_NAME[_ol.provider] || _ol.provider}) đã điền – soát từng ô`),
_ol.warnings.length ? h('ul', { class: 'sl-issues', 'data-testid': 'g1-layout-warn' }, _ol.warnings.map((w) => h('li', { class: 'w' }, '⚠️ ' + w))) : null,
h('div', { class: 'sl-form' }, L('Mã căn', _o9.unit_code), L('Diện tích (m²)', _o9.area_m2), L('Loại diện tích', _o9.area_kind), L('Phòng ngủ', _o9.bedrooms), L('WC', _o9.wc),
L('Căn góc', _o9.corner), L('Hướng ban công', _o9.balcony_dir), L('Hướng cửa chính', _o9.door_dir), L('View', _o9.view)),
L('Ghi chú', _o9.notes), err,
h('label', { class: 'g1-check' }, h('input', { type: 'checkbox', 'data-testid': 'g1-layout-confirm-check' }), h('span', null, 'Tôi đã đối chiếu với ảnh layout / hồ sơ căn')),
h('div', { class: 'sl-row sl-end' }, _o0.button('Bỏ', () => { _ol.fields = null; _og(); }, { kind: 'ghost', icon: 'close', testid: 'g1-layout-discard' }), _o0.button('✅ Xác nhận & lưu', save, { kind: 'primary', testid: 'g1-layout-save' }))));
async function save() {
if (!form.querySelector('[data-testid="g1-layout-confirm-check"]').checked) { err.textContent = 'Tick ô "đã đối chiếu" trước khi lưu – AI có thể đọc sai.'; return; }
const _o2 = G.numDec(_o9.area_m2.value), bed = S.parseNum(_o9.bedrooms.value), wc = S.parseNum(_o9.wc.value);
if (!(_o2 >= 10 && _o2 <= 1000)) { err.textContent = 'Diện tích phải từ 10 đến 1.000 m².'; return; }
if (!(bed >= 0 && bed <= 10) || !(wc >= 0 && wc <= 10)) { err.textContent = 'Nhập số phòng ngủ và số WC (từ 0 đến 10; studio ghi 0 phòng ngủ).'; return; }
const fields = { unit_code: _o9.unit_code.value.trim(), area_m2: _o2, area_kind: _o9.area_kind.value, bedrooms: bed, wc, corner: _o9.corner.value === '' ? null : _o9.corner.value === '1',
north_arrow: !!_o7.north_arrow, balcony_dir: _o9.balcony_dir.value || null, door_dir: _o9.door_dir.value || null, view: _o9.view.value.trim(), notes: _o9.notes.value.trim(), confidence: _o7.confidence };
const _oj = G.unitRow({ id: _o0.newId(), project: env.project(_ol.project), fields, imageName: _ol.imgName, provider: _ol.provider, now: Date.now(), confirmedBy: (ctx.user && ctx.user.id) || '' });
await _o0.put('objects', _oj);
_o0.toast('Đã lưu thông tin căn ' + (fields.unit_code || ''), 'ok');
_ol.fields = null; _og(); _oh();
}
}
async function _oh() {
const _oa = env.project(_ol.project);
const rows = (await _o0.list('objects')).filter((o) => o.kind === 'g1_unit').map((o) => { let d = o.data; try { d = typeof d === 'string' ? JSON.parse(d) : d; } catch { d = {}; } return { o, d: d || {} }; })
.filter((x) => !_oa || x.d.project_id === _oa.id).sort((a, b) => (Number(b.o.updated_at) || 0) - (Number(a.o.updated_at) || 0));
saved.replaceChildren(h('div', { class: 'sl-box' }, h('h3', null, `Căn đã xác nhận (${rows.length})`),
rows.length ? h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl g1-tbl g1-stack', 'data-testid': 'g1-layout-saved' },
h('thead', null, h('tr', null, ...['Căn', 'Diện tích', 'PN/WC', 'Góc', 'Ban công / Cửa', 'View', ''].map((x) => h('th', null, x)))),
h('tbody', null, rows.map(({ o, d }) => h('tr', { 'data-testid': 'g1-layout-row-' + o.id },
h('td', { 'data-l': 'Căn' }, h('b', null, d.unit_code || o.name || 'Căn')),
h('td', { 'data-l': 'Diện tích' }, d.area_m2 ? S.fmtNum(d.area_m2) + ' m²' + (d.area_kind === 'thong_thuy' ? ' TT' : d.area_kind === 'tim_tuong' ? ' tim tường' : '') : '—'),
h('td', { 'data-l': 'PN/WC' }, `${d.bedrooms ?? '?'}PN / ${d.wc ?? '?'}WC`), h('td', { 'data-l': 'Góc' }, d.corner == null ? '—' : d.corner ? 'Có' : 'Không'),
h('td', { 'data-l': 'Ban công / Cửa' }, `${d.balcony_dir || '—'} / ${d.door_dir || '—'}`), h('td', { 'data-l': 'View' }, d.view || '—'),
h('td', null, !canErase ? null : _o0.button('Xoá', () => _of(o, d), { kind: 'ghost', icon: '🗑️', testid: 'g1-layout-del-' + o.id, title: 'Xoá căn ' + (d.unit_code || o.name || '') }))))))) : _o0.empty('Chưa có căn nào.')));
}
async function _of(o, d) {
const name = d.unit_code || o.name || 'căn này';
if (!(await _o0.confirm({ title: 'Xoá căn đã xác nhận', text: `Xoá "${name}" khỏi danh sách căn đã xác nhận?`, ok: 'Xoá', kind: 'danger', testid: 'g1-layout-del-confirm' }))) return;
await _o0.put('objects', { ...o, deleted: 1 });
_o0.toast('Đã xoá ' + name, 'ok'); _oh();
}
_oh();
return _oi;
}
export default {
manifest: { id: 'g1_layout', title: 'Đọc layout căn', icon: '📐', screen: 'sales', order: 130, version: '0.1.0', status: 'ready',
help: 'Chụp ảnh mặt bằng căn, AI điền sẵn m², phòng ngủ, WC, căn góc, hướng ban công/cửa, view – anh/chị soát và xác nhận rồi mới lưu.' },
mount,
async selftest() {
const n = G.normalizeLayout('{"area_m2":70,"bedrooms":2,"wc":2,"north_arrow":false,"balcony_dir":"Nam","confidence":0.9}');
return n.ok && n.fields.balcony_dir === null ? { ok: true } : { ok: false, details: 'Chuẩn hoá layout lỗi' };
},
};

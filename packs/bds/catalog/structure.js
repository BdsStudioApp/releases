import { h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as LU from '../_lib/layout_units.js';
import * as G from '../g1_lib/logic.js';
import * as U from '../g1_lib/ui.js';
import * as R from './research.js';
import * as T from './structure_logic.js';
const LAYOUT_AI = 'bds.catalog.layout_ai';
const _o0 = `.tt{gap:12px}.tt-zone{border:1px solid rgba(127,127,127,.3);border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:8px;min-width:0}
.tt-tower{border-left:3px solid #C9A24A;padding:4px 0 4px 10px;display:flex;flex-direction:column;gap:6px;min-width:0}
.tt-head{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:flex-start;min-width:0}
.tt-kv{display:flex;flex-direction:column;min-width:0;overflow-wrap:anywhere}.tt-kv>small{opacity:.7;font-size:.78em}
.tt-st{display:inline-block;font-size:.72em;line-height:1.5;padding:0 6px;border-radius:999px;white-space:nowrap;text-decoration:none}
.tt-st.sourced{background:rgba(30,122,79,.14);color:#1E7A4F}.tt-st.manual{background:rgba(40,90,170,.14);color:#2a5aa8}
.tt-st.empty{background:rgba(127,127,127,.16);color:inherit;opacity:.85}
.tt-c{display:flex;flex-direction:column;gap:2px;align-items:flex-start;min-width:0}
.tt-tbl td,.tt-tbl th{vertical-align:top}.tt-tbl td{white-space:nowrap}.tt-tbl td.v{white-space:normal;min-width:90px;max-width:180px;overflow-wrap:anywhere}
.tt-acts{display:flex;flex-wrap:wrap;gap:6px}.tt-legend{display:flex;flex-wrap:wrap;gap:6px;align-items:center}
.tt-in{width:100%;min-width:58px;box-sizing:border-box}.tt-gen td{white-space:nowrap}
.tt-form{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px}`;
let _o9 = false;
function ensureCss() {
S.ensureSalesCss(); U.ensureCss();
if (_o9 || typeof document === 'undefined') return;
_o9 = true;
try { const _o1j = new CSSStyleSheet(); _o1j.replaceSync(_o0); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _o1j]; } catch { }
}
const _oi = (f, _o1w) => {
if (_o1w == null || _o1w === '') return '';
if (f === 'area_carpet_m2' || f === 'area_gross_m2') return S.fmtNum(_o1w, 2);
return String(_o1w);
};
const _o1v = (ctx) => (ctx.user && ctx.user.id) || '';
export function stateChip(ent, field, testid) {
const st = T.cellState(ent, field), _o1g = T.cellSource(ent, field);
const label = T.SOURCE_LABEL[st];
const url = _o1g && _o1g.url ? G.safeUrl(_o1g.url) : '';
const _o1o = _o1g ? [_o1g.title, _o1g.url].filter(Boolean).join(' · ') : '';
return url && st === 'sourced'
? h('a', { class: 'tt-st ' + st, href: url, target: '_blank', rel: 'noopener', title: _o1o || label, 'data-testid': testid, 'data-state': st }, label + ' ↗')
: h('span', { class: 'tt-st ' + st, title: _o1o || label, 'data-testid': testid, 'data-state': st }, label);
}
function _o8(ent, field, testid) {
const _o1w = _oi(field, ent[field]);
return h('span', { class: 'tt-c', 'data-testid': testid, 'data-state': T.cellState(ent, field) }, _o1w ? h('b', null, _o1w) : null, stateChip(ent, field));
}
export async function mountStructure(root, o) {
ensureCss();
const { K, ctx } = o;
let env = o.env;
const _o13 = o.project;
const staff = !!o.staff;
const canEdit = o.canEdit !== false;
let st = T.readStructure(R.rowData(env, _o13.id).data);
const _o14 = h('div', { class: 'sl sl-col tt', 'data-testid': 'tt-page', 'data-project': _o13.id });
root.replaceChildren(_o14);
const _o17 = K.select(env.projects.map((x) => [x.id, x.name]), _o13.id, { class: 'sl-in', 'data-testid': 'tt-project', 'aria-label': 'Dự án', onchange: (e) => o.onProject && o.onProject(e.target.value) });
const _o1m = h('span', { class: 'sl-muted sl-small', 'data-testid': 'tt-stats' });
const tree = h('div', { class: 'sl-col', 'data-testid': 'tt-tree' });
const _o1u = h('div', { class: 'sl-col' });
_o14.append(
h('div', { class: 'sl-row sl-sp' }, K.button('← Danh sách dự án', () => o.onBack && o.onBack(), { kind: 'ghost', testid: 'tt-back' }), _o1m),
h('h2', null, '🏗️ ' + _o13.name),
h('label', { class: 'sl-f' }, 'Dự án', _o17),
_o18(),
h('p', { class: 'sl-small sl-muted' }, 'Dự án → Phân khu → Toà → Trục căn. Lưu bảng TRỤC làm gốc; danh sách căn từng tầng chỉ tạo khi anh/chị bấm "Tạo danh sách căn" ở từng toà.'),
h('div', { class: 'tt-legend', 'data-testid': 'tt-legend' }, h('span', { class: 'sl-small' }, 'Mỗi ô:'),
h('span', { class: 'tt-st sourced' }, T.SOURCE_LABEL.sourced), h('span', { class: 'tt-st manual' }, T.SOURCE_LABEL.manual), h('span', { class: 'tt-st empty' }, T.SOURCE_LABEL.empty)),
canEdit && h('div', { class: 'tt-acts' },
K.button('➕ Thêm phân khu', () => _of('zone', null), { kind: 'primary', testid: 'tt-add-zone' }),
staff ? K.button('✨ Để AI tìm phân khu, toà, trục', () => _oy(), { testid: 'tt-ai', title: 'AI tìm trên Google – chỉ điền ô có nguồn; báo phí, chờ đồng ý' }) : null,
K.button('📷 Đọc ảnh layout tầng', () => _o10(null), { testid: 'tt-layout' })),
staff ? h('span', { class: 'sl-ai sl-small' }, '✨ AI · có thể tốn phí – chỉ điền ô có nguồn, ô không có nguồn để trống chờ anh/chị nhập') : null,
tree, _o1u);
function _o18() {
const { data } = R.rowData(env, _o13.id);
const rows = [['dev', 'Chủ đầu tư'], ['loc', 'Vị trí'], ['scale', 'Quy mô'], ['legal', 'Pháp lý'], ['handover', 'Bàn giao']].map(([_op, label]) => {
const _o1w = _o13[_op];
const _o1g = G.fieldSource(data, _op);
const ent = { [_op]: _o1w == null || _o1w === '' ? null : G.showFieldValue(_op, _o1w), src: _o1g ? { [_op]: { url: _o1g.url, title: _o1g.title || (_o1g.by === 'file' ? 'tài liệu' : ''), by: _o1g.by === 'manual' ? 'sale' : _o1g.by === 'file' ? 'file' : 'ai' } } : {} };
if (!_o1g && ent[_op] != null) ent.src[_op] = { by: 'sale' };
return h('div', { class: 'tt-kv', 'data-testid': 'tt-info-' + _op }, h('small', null, label), _o8(ent, _op));
});
return h('div', { class: 'sl-box tt-head', 'data-testid': 'tt-info' }, ...rows);
}
async function _o1h(next, msg) {
try {
const _oj = await S.loadEnv(ctx);
const { row, data } = R.rowData(_oj, _o13.id);
const _oa = T.writeStructure(data, next);
await K.put('projects', { ...(row || {}), id: _o13.id, name: row && row.name ? row.name : _o13.name, dev: (row && row.dev) || _o13.dev || '', data: JSON.stringify(_oa), deleted: 0 });
st = T.readStructure(_oa);
env = await S.loadEnv(ctx);
if (msg) K.toast(msg, 'ok');
render();
return true;
} catch (e) { K.toast('Chưa lưu được: ' + ((e && e.message) || e), 'error'); return false; }
}
function render() {
const _o1g = T.structStats(st);
_o1m.textContent = `${_o1g.zones} phân khu · ${_o1g.towers} toà · ${_o1g.axes} trục`;
if (!st.zones.length) {
tree.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'tt-empty' },
h('b', null, 'Chưa có phân khu nào.'),
h('span', { class: 'sl-small sl-muted' }, 'Bấm "➕ Thêm phân khu" để nhập tay (dự án chỉ có một khu thì đặt tên chung, vd "Toàn dự án"), hoặc để AI tìm / đọc ảnh layout.')));
return;
}
tree.replaceChildren(...st.zones.map((z, zi) => h('div', { class: 'tt-zone', 'data-testid': 'tt-zone-' + zi, 'data-id': z.id },
h('div', { class: 'tt-head' },
h('div', { class: 'tt-kv' }, h('small', null, 'Phân khu'), _o8(z, 'name', `tt-zone-${zi}-name`)),
h('div', { class: 'tt-kv' }, h('small', null, 'Số toà'), _o8(z, 'towers_count', `tt-zone-${zi}-towers_count`))),
canEdit && h('div', { class: 'tt-acts' },
K.button('➕ Thêm toà', () => _of('tower', null, z.id), { testid: `tt-zone-${zi}-add-tower` }),
K.button('✏️ Sửa', () => _of('zone', z), { kind: 'ghost', testid: `tt-zone-${zi}-edit` }),
K.button('🗑 Xoá', () => _o1a(z, 'phân khu ' + (z.name || '')), { kind: 'ghost', testid: `tt-zone-${zi}-del` })),
...z.towers.map((t, ti) => _o1r(z, t, `tt-tower-${zi}-${ti}`)))));
}
function _o1r(z, t, pre) {
return h('div', { class: 'tt-tower', 'data-testid': pre, 'data-id': t.id },
h('div', { class: 'tt-head' },
h('div', { class: 'tt-kv' }, h('small', null, 'Toà'), _o8(t, 'name', pre + '-name')),
h('div', { class: 'tt-kv' }, h('small', null, 'Số tầng'), _o8(t, 'floors', pre + '-floors')),
h('div', { class: 'tt-kv' }, h('small', null, 'Số căn/tầng'), _o8(t, 'units_per_floor', pre + '-units_per_floor'))),
canEdit && h('div', { class: 'tt-acts' },
K.button('➕ Thêm trục', () => _of('axis', null, t.id), { testid: pre + '-add-axis' }),
K.button('📷 Đọc ảnh layout', () => _o10(t.id), { testid: pre + '-layout' }),
K.button('🏢 Tạo danh sách căn', () => _oz(t.id), { kind: 'primary', testid: pre + '-gen' }),
K.button('✏️ Sửa', () => _of('tower', t), { kind: 'ghost', testid: pre + '-edit' }),
K.button('🗑 Xoá', () => _o1a(t, 'toà ' + (t.name || '')), { kind: 'ghost', testid: pre + '-del' })),
t.axes.length ? h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl tt-tbl', 'data-testid': pre + '-axes' },
h('thead', null, h('tr', null, ...T.AXIS_FIELDS.map((f) => h('th', null, T.FIELD_LABEL[f])), h('th', null, ''))),
h('tbody', null, t.axes.map((a, ai) => h('tr', { 'data-testid': `${pre}-axis-${ai}`, 'data-id': a.id },
...T.AXIS_FIELDS.map((f) => h('td', { class: f === 'view' ? 'v' : null }, _o8(a, f, `${pre}-axis-${ai}-${f}`))),
h('td', null, canEdit && h('div', { class: 'tt-acts' },
K.button('Sửa', () => _of('axis', a), { kind: 'ghost', testid: `${pre}-axis-${ai}-edit` }),
K.button('Xoá', () => _o1a(a, 'trục ' + (a.axis || '')), { kind: 'ghost', icon: 'x', testid: `${pre}-axis-${ai}-del` })))))))) :
h('p', { class: 'sl-small sl-muted' }, 'Chưa có trục căn – thêm tay, đọc ảnh layout hoặc để AI tìm.'));
}
async function _o1a(ent, what) {
if (!(await K.confirm({ title: 'Xoá ' + what, text: `Xoá ${what} khỏi thông tin dự án? (căn đã tạo trong danh sách căn vẫn giữ)`, ok: 'Xoá', kind: 'danger', testid: 'tt-del-confirm' }))) return;
await _o1h(T.removeEntity(st, ent.id), 'Đã xoá ' + what);
}
function _of(kind, ent, parentId) {
const fields = kind === 'zone' ? T.ZONE_FIELDS : kind === 'tower' ? T.TOWER_FIELDS : T.AXIS_FIELDS;
const label = (f) => kind !== 'axis' && f === 'name' ? (kind === 'zone' ? 'Tên phân khu' : 'Tên toà') : T.FIELD_LABEL[f];
const _ob = [['', '— chưa rõ —'], ...G.DIRS.map((_oa) => [_oa, _oa])];
const ins = {};
for (const f of fields) {
const _o1w = ent ? ent[f] : null;
ins[f] = f === 'balcony_dir' || f === 'door_dir'
? K.select(_ob, _o1w || '', { class: 'sl-in tt-in', 'data-testid': 'tt-f-' + f })
: h('input', { class: 'sl-in tt-in', type: 'text', value: _o1w == null ? '' : _oi(f, _o1w), 'data-testid': 'tt-f-' + f,
inputmode: ['towers_count', 'floors', 'units_per_floor', 'bedrooms'].includes(f) ? 'numeric' : f.startsWith('area') ? 'decimal' : null,
placeholder: f === 'unit_type' ? '1N, 1N+1, 2N…' : f === 'axis' ? 'vd 01, 05' : null });
}
const _o1l = h('input', { class: 'sl-in', type: 'text', maxlength: 300, 'data-testid': 'tt-f-source', placeholder: 'link https://… hoặc tên tài liệu (không bắt buộc)' });
const err = h('div', { class: 'sl-bad', role: 'alert', 'data-testid': 'tt-f-err' });
const title = (ent ? 'Sửa ' : 'Thêm ') + ({ zone: 'phân khu', tower: 'toà', axis: 'trục căn' }[kind]);
const _or = K.modal({ title, testid: 'tt-form', body: h('div', { class: 'sl sl-col' },
h('div', { class: 'tt-form' }, ...fields.map((f) => h('label', { class: 'sl-f' }, label(f), ins[f]))),
h('label', { class: 'sl-f' }, 'Nguồn (anh/chị lấy số ở đâu)', _o1l),
h('p', { class: 'sl-small sl-muted' }, 'Ô anh/chị nhập hoặc sửa mang nhãn "' + T.SOURCE_LABEL.manual + '". Ô để trống hiện "' + T.SOURCE_LABEL.empty + '".'),
err,
h('div', { class: 'sl-row sl-end' }, K.button('Lưu', submit, { kind: 'primary', testid: 'tt-f-save' }))) });
async function submit() {
const patch = Object.fromEntries(fields.map((f) => [f, ins[f].value]));
const _o5 = fields.filter((f) => String(patch[f] || '').trim() && T.cleanValue(f, patch[f]) == null);
if (_o5.length) { err.textContent = 'Chưa hợp lệ: ' + _o5.map((f) => label(f)).join(', ') + ' (số tầng 1–120, m² 10–1.000, phòng ngủ 0–10).'; return; }
if (kind === 'axis' && !T.cleanValue('axis', patch.axis)) { err.textContent = 'Nhập số trục (vd 01, 05).'; return; }
const src = _o1l.value.trim();
const _ov = { by: 'sale', url: G.safeUrl(src), title: G.safeUrl(src) ? G.hostOf(src) : src, at: Date.now() };
let r;
if (ent) r = T.updateEntity(st, ent.id, patch, _ov);
else if (kind === 'zone') r = T.addZone(st, patch, _ov);
else if (kind === 'tower') r = T.addTower(st, parentId, patch, _ov);
else r = T.addAxis(st, parentId, patch, _ov);
if (r.error) { err.textContent = r.error; return; }
_or.close();
await _o1h(r.st, ent ? 'Đã lưu' : 'Đã thêm');
}
}
function _oy() {
if (!staff) return;
const ask = { zones: true, towers: true, floors: true, axes: true };
const _om = h('input', { class: 'sl-in', type: 'text', maxlength: 300, 'data-testid': 'tts-hint', placeholder: 'VD: dự án có 3 phân khu, toà cao 35 tầng (nếu anh/chị biết)' });
const chips = h('div', { class: 'sl-chips', role: 'group', 'aria-label': 'Cần tìm' });
const estBox = h('div', { class: 'sl-col', 'aria-live': 'polite' });
const acts = h('div', { class: 'sl-row' });
const res = h('div', { class: 'sl-col', 'aria-live': 'polite' });
let _o1f = null;
const _or = K.modal({ title: '✨ AI tìm phân khu, toà, trục – ' + _o13.name, wide: true, testid: 'tts-modal', body: h('div', { class: 'sl g1 sl-col', 'data-testid': 'tts' },
h('p', { class: 'g1-lead' }, 'Gemini tìm trên Google. CHỈ ô có link nguồn mới được điền; ô không có nguồn để trống chờ anh/chị nhập.'),
h('b', null, 'Bước 1 – Tìm gì? (ghi thêm điều anh/chị biết để AI tìm đúng)'), chips,
h('label', { class: 'sl-f' }, 'Ghi thêm (không bắt buộc)', _om),
h('b', null, 'Bước 2 – Chi phí ước tính: đồng ý thì app mới chạy'), estBox, acts, res) });
const ai = R.aiRunner(K, ctx, { tid: 'tts', prompt: () => T.structurePrompt(_o13, ask, _om.value), projectId: () => _o13.id, staff, estBox, acts, res,
hasResult: () => !!_o1f, onResult: _o1k, onNoWeb: () => noWeb(), busyText: 'Gemini đang tìm phân khu, toà, trục trên Google…', runText: '✅ Đồng ý chi phí – chạy tìm (Gemini + Google)' });
function _o1c() {
chips.replaceChildren(...Object.entries(T.ASK_KEYS).map(([_op, label]) => h('button', { type: 'button', class: 'sl-chip' + (ask[_op] ? ' on' : ''), 'aria-pressed': String(!!ask[_op]), 'data-testid': 'tts-ask-' + _op,
onclick: () => { ask[_op] = !ask[_op]; if (!Object.values(ask).some(Boolean)) ask[_op] = true; _o1c(); } }, label)));
}
function noWeb() {
_o1f = null; ai.render();
res.replaceChildren(_oh('tts-noweb', T.NO_WEB_TEXT + '.'));
}
function _oh(testid, text) {
return h('div', { class: 'g1-warn sl-col', 'data-testid': testid }, h('b', null, text),
h('div', { class: 'sl-row' },
K.button('📷 Tải ảnh / tài liệu layout', () => { _or.close(); _o10(null); }, { testid: testid + '-layout' }),
K.button('✏️ Tự nhập', () => { _or.close(); _of('zone', null); }, { kind: 'ghost', testid: testid + '-manual' })),
h('span', { class: 'sl-small sl-muted' }, 'Có link trang chủ đầu tư? Dùng "🤖 Làm qua chat Gemini/Claude" và dán link vào chat, kết quả dán về vẫn chỉ nhận dòng có link.'));
}
function _o1k(text, grounding, _ov) {
const r = T.parseStructureLines(text, grounding, { via: _ov && _ov.by === 'chat' ? 'chat' : 'api', now: Date.now() });
if (r.noWeb) { noWeb(); return; }
if (!r.kept) { _o1f = null; ai.render(); res.replaceChildren(_oh('tts-none', T.NO_FOUND_TEXT + '.')); return; }
_o1f = r; ai.render();
const _oq = [];
for (const z of r.st.zones) {
_oq.push(_oo('Phân khu', z, T.ZONE_FIELDS));
for (const t of z.towers) {
_oq.push(_oo('Toà', t, T.TOWER_FIELDS));
for (const a of t.axes) _oq.push(_oo('Trục', a, T.AXIS_FIELDS));
}
}
res.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'tts-result' },
h('b', null, `AI tìm được ${r.kept} dòng có nguồn${r.dropped ? ` · bỏ ${r.dropped} dòng không có link nguồn` : ''}${_ov && _ov.cost ? ` · ${S.fmtNum(_ov.cost, 4)} USD` : ''}`),
h('ul', { class: 'sl-issues' }, _oq),
h('p', { class: 'g1-legal' }, 'Lưu: chỉ điền ô CÓ NGUỒN vào dự án; ô anh/chị đã nhập ("Sale nhập") giữ nguyên. Đối chiếu tài liệu chủ đầu tư trước khi báo khách.'),
h('div', { class: 'sl-row sl-end' }, K.button('💾 Lưu vào dự án', async () => {
const _ow = T.mergeStructure(st, _o1f.st);
_or.close();
await _o1h(_ow.st, `Đã điền ${_ow.filled} ô có nguồn`);
}, { kind: 'primary', testid: 'tts-save' }))));
}
function _oo(kind, ent, fields) {
const _o15 = fields.filter((f) => ent[f] != null).map((f) => `${T.FIELD_LABEL[f]}: ${_oi(f, ent[f])}`);
const _o1g = fields.map((f) => T.cellSource(ent, f)).find(Boolean);
const url = _o1g && G.safeUrl(_o1g.url);
return h('li', { 'data-testid': 'tts-item' }, h('b', null, kind + ' '), _o15.join(' · ') || '(chưa có ô nào)', ' ',
url ? h('a', { href: url, target: '_blank', rel: 'noopener', class: 'tt-st sourced' }, 'Nguồn: ' + (G.hostOf(url) || 'link') + ' ↗') : null);
}
_o1c(); ai.render(); ai.estimate();
}
function _o1q() {
const _o12 = [];
for (const z of st.zones) for (const t of z.towers) _o12.push([t.id, `${z.name || 'Phân khu ?'} › ${t.name || 'Toà ?'}`]);
return _o12;
}
function _o10(towerId) {
const _o11 = _o1q();
if (!_o11.length) {
const _os = K.modal({ title: '📷 Đọc ảnh layout', testid: 'ttl-modal', body: h('div', { class: 'sl sl-col', 'data-testid': 'ttl-need-tower' },
h('p', null, 'Chọn phân khu và toà trước để app biết bảng trục thuộc toà nào (AI không tự đoán toà).'),
h('div', { class: 'sl-row' }, K.button('➕ Thêm phân khu', () => { _os.close(); _of('zone', null); }, { kind: 'primary', testid: 'ttl-add-zone' }))) });
return;
}
const _o1n = K.select(_o11, towerId || _o11[0][0], { class: 'sl-in', 'data-testid': 'ttl-tower', 'aria-label': 'Toà' });
const _o2 = U.aiSelect(K, ctx, LAYOUT_AI, 'ttl-ai');
const fileIn = h('input', { type: 'file', accept: 'image/*', hidden: true, 'data-testid': 'ttl-file', onchange: (e) => _o16(e.target.files[0]) });
const preview = h('div');
const res = h('div', { class: 'sl-col', 'aria-live': 'polite' });
let _on = null, imgName = '', rows = [];
const _or = K.modal({ title: '📷 Đọc ảnh layout tầng điển hình – ' + _o13.name, wide: true, testid: 'ttl-modal', body: h('div', { class: 'sl g1 sl-col', 'data-testid': 'ttl' },
h('p', { class: 'g1-lead' }, 'Chụp/chọn ảnh mặt bằng tầng điển hình hoặc trang catalogue: AI đọc mỗi căn thành một TRỤC (loại căn, m² thông thuỷ, m² tim tường, hướng, view). Anh/chị soát từng dòng rồi lưu.'),
h('div', { class: 'sl-form' }, h('label', { class: 'sl-f' }, 'Phân khu › Toà', _o1n), h('label', { class: 'sl-f' }, 'AI đọc ảnh', _o2)),
h('div', { class: 'sl-row' }, K.button('📷 Chọn ảnh layout', () => fileIn.click(), { kind: 'primary', testid: 'ttl-pick' })),
fileIn, preview, res) });
async function _o16(file) {
fileIn.value = '';
if (!file) return;
try {
const _o6 = await U.fileToCanvas(file, 2000);
_on = { mime: 'image/jpeg', b64: U.canvasB64(_o6, 'image/jpeg', 0.85) }; imgName = file.name || 'layout.jpg';
preview.replaceChildren(h('img', { class: 'g1-preview', style: 'max-height:220px;max-width:100%', src: 'data:image/jpeg;base64,' + _on.b64, alt: 'Ảnh layout' }));
await _o19();
} catch (e) { K.toast('Không đọc được ảnh: ' + ((e && e.message) || 'lỗi'), 'error'); }
}
async function _o19() {
const f = T.findEntity(st, _o1n.value);
if (!f) return;
const prompt = G.layoutPrompt(_o13, '', { axes: true, zone: f.zone.name || '', tower: f.tower.name || '' });
res.replaceChildren(h('div', { class: 'sl-box sl-muted', 'data-testid': 'ttl-busy' }, 'AI đang đọc ảnh…'));
let text = null;
try {
if (_o2.value === 'handoff') {
if (!ctx.ai || typeof ctx.ai.handoff !== 'function') throw new Error('Chưa có trợ lý AI');
text = await ctx.ai.handoff('read_policy', prompt + '\n\n(Đính kèm ảnh layout vào khung chat.)');
if (!text) { res.replaceChildren(); return; }
} else {
if (!ctx.ai || typeof ctx.ai.run !== 'function') throw new Error('Chưa nối AI – chọn "Làm bằng Claude/Gemini qua chat"');
const r = await ctx.ai.run('read_layout', { prompt, images: [_on], json: true, provider: _o2.value });
text = r && (r.text ?? r);
}
} catch (e) { res.replaceChildren(h('div', { class: 'g1-err', 'data-testid': 'ttl-error' }, 'AI chưa đọc được: ' + ((e && e.message) || 'lỗi') + '. Thử AI khác hoặc tự nhập.')); return; }
const _ox = G.normalizeLayout(text);
if (!_ox.ok) { res.replaceChildren(h('div', { class: 'g1-err', 'data-testid': 'ttl-error' }, _ox.warnings[0] + '. Thử ảnh rõ hơn hoặc tự nhập.')); return; }
rows = T.layoutToAxes(_ox, { imageName: imgName, now: Date.now() }).map((a) => ({ a, keep: true, ins: {} }));
if (!rows.length) { res.replaceChildren(h('div', { class: 'g1-warn', 'data-testid': 'ttl-error' }, T.NO_FOUND_TEXT + ' (không thấy số căn/số trục trên ảnh).')); return; }
_o1d(_ox);
}
function _o1d(_ox) {
const _ob = [['', '—'], ...G.DIRS.map((_oa) => [_oa, _oa])];
const tr = rows.map((r, i) => {
const cells = T.AXIS_FIELDS.map((f) => {
const _o1w = r.a[f];
r.ins[f] = f === 'balcony_dir' || f === 'door_dir'
? K.select(_ob, _o1w || '', { class: 'sl-in tt-in', 'data-testid': `ttl-${i}-${f}` })
: h('input', { class: 'sl-in tt-in', type: 'text', value: _o1w == null ? '' : _oi(f, _o1w), 'data-testid': `ttl-${i}-${f}` });
return h('td', null, r.ins[f]);
});
const _o7 = h('input', { type: 'checkbox', checked: true, 'data-testid': `ttl-${i}-keep`, 'aria-label': 'Lưu trục ' + r.a.axis, onchange: (e) => { r.keep = e.target.checked; _od(); } });
return h('tr', { 'data-testid': 'ttl-row-' + i }, h('td', null, _o7), ...cells);
});
const _o1i = h('div', { class: 'sl-row sl-end' });
const _od = () => { const _op = rows.filter((r) => r.keep).length; const _o1s = T.findEntity(st, _o1n.value); _o1i.replaceChildren(K.button(`💾 Lưu ${_op} trục vào ${_o1s ? _o1s.tower.name || 'toà' : 'toà'}`, saveRows, { kind: 'primary', testid: 'ttl-save' })); _o1i.firstChild.disabled = !_op; };
res.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'ttl-result' },
h('b', null, `AI đọc được ${rows.length} trục từ ảnh “${imgName}” – soát từng dòng, sửa ô sai, bỏ tick dòng không lưu.`),
_ox.warnings.length ? h('ul', { class: 'sl-issues', 'data-testid': 'ttl-warn' }, _ox.warnings.map((w) => h('li', { class: 'w' }, '⚠️ ' + w))) : null,
h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl tt-tbl', 'data-testid': 'ttl-table' },
h('thead', null, h('tr', null, h('th', null, 'Lưu'), ...T.AXIS_FIELDS.map((f) => h('th', null, T.FIELD_LABEL[f])))), h('tbody', null, tr))),
h('p', { class: 'sl-small sl-muted' }, `Ô giữ nguyên ghi nguồn "${imgName}" (Có nguồn); ô anh/chị sửa ghi "Sale nhập". Ô đã nhập tay trước đó trong toà giữ nguyên.`),
_o1i));
_od();
}
async function saveRows() {
const now = Date.now();
const axes = rows.filter((r) => r.keep).map((r) => {
const _o12 = { ...r.a, src: { ...r.a.src } };
for (const f of T.AXIS_FIELDS) {
const _o1t = T.cleanValue(f, r.ins[f].value);
if (JSON.stringify(_o1t) === JSON.stringify(r.a[f] ?? null)) continue;
_o12[f] = _o1t;
if (_o1t == null) delete _o12.src[f]; else _o12.src[f] = { url: '', title: '', by: 'sale', at: now };
}
return _o12;
}).filter((a) => a.axis);
const _o3 = T.applyAxes(st, _o1n.value, axes);
_or.close();
await _o1h(_o3.st, `Đã lưu ${axes.length} trục (${_o3.filled} ô)`);
}
}
function _oz(towerId) {
const f = T.findEntity(st, towerId);
if (!f) return;
const t = f.tower;
const _ok = h('input', { class: 'sl-in', type: 'text', inputmode: 'numeric', value: '1', 'data-testid': 'ttg-from' });
const _o1p = h('input', { class: 'sl-in', type: 'text', inputmode: 'numeric', value: t.floors ? String(t.floors) : '', 'data-testid': 'ttg-to' });
const _og = h('input', { class: 'sl-in', type: 'text', 'data-testid': 'ttg-exclude', placeholder: 'vd 1-3, 13, 35 (thương mại, kỹ thuật, penthouse)' });
const err = h('div', { class: 'sl-bad', role: 'alert', 'data-testid': 'ttg-err' });
const res = h('div', { class: 'sl-col' });
let list = [];
const _or = K.modal({ title: '🏢 Tạo danh sách căn – toà ' + (t.name || '?'), wide: true, testid: 'ttg-modal', body: h('div', { class: 'sl sl-col', 'data-testid': 'ttg' },
h('p', { class: 'sl-small' }, `Căn = tầng điển hình × ${t.axes.length} trục của toà. Chọn khoảng tầng điển hình, ghi các tầng khác (thương mại, kỹ thuật, penthouse…) vào ô "Bỏ tầng". Xem trước → soát → mới lưu.`),
h('div', { class: 'sl-form' }, h('label', { class: 'sl-f' }, 'Từ tầng', _ok), h('label', { class: 'sl-f' }, 'Đến tầng', _o1p), h('label', { class: 'sl-f' }, 'Bỏ tầng', _og)),
err, h('div', { class: 'sl-row' }, K.button('👀 Xem trước', previewIt, { kind: 'primary', testid: 'ttg-preview' })), res) });
async function previewIt() {
err.textContent = '';
const _ol = T.generateUnits(f.zone, t, { from: S.parseNum(_ok.value), to: S.parseNum(_o1p.value), exclude: _og.value });
if (_ol.error) { err.textContent = _ol.error; res.replaceChildren(); return; }
list = T.markExisting(_ol.units, await K.listAll('objects'), _o13.id).map((u) => ({ ...u, keep: !u.dup }));
_oc();
}
function _oc() {
const _o1i = h('div', { class: 'sl-row sl-end' });
const _od = () => { const _op = list.filter((u) => u.keep && !u.dup).length; const _o4 = K.button(`💾 Lưu ${_op} căn`, saveAll, { kind: 'primary', testid: 'ttg-save' }); _o4.disabled = !_op; _o1i.replaceChildren(_o4); };
const _oe = list.filter((u) => u.dup).length;
res.replaceChildren(h('div', { class: 'sl-col', 'data-testid': 'ttg-result' },
h('b', { 'data-testid': 'ttg-count' }, `${list.length} căn (${list.length - _oe} mới${_oe ? `, ${_oe} đã có – bỏ qua` : ''}). Chưa lưu – soát rồi bấm Lưu.`),
h('div', { class: 'sl-scroll', style: 'max-height:50vh' }, h('table', { class: 'sl-tbl tt-tbl tt-gen', 'data-testid': 'ttg-table' },
h('thead', null, h('tr', null, ...['Lưu', 'Số căn', 'Tầng', 'Trục', 'Loại', 'TT m²', 'Tim tường m²'].map((x) => h('th', null, x)))),
h('tbody', null, list.map((u, i) => {
const _o7 = h('input', { type: 'checkbox', checked: u.keep, disabled: u.dup, 'data-testid': 'ttg-keep-' + i, 'aria-label': 'Lưu căn ' + u.unit_code, onchange: (e) => { u.keep = e.target.checked; _od(); } });
const code = h('input', { class: 'sl-in tt-in', type: 'text', value: u.unit_code, disabled: u.dup, 'data-testid': 'ttg-code-' + i, oninput: (e) => { u.unit_code = e.target.value.trim(); } });
return h('tr', { 'data-testid': 'ttg-row-' + i, 'data-dup': u.dup ? '1' : '' }, h('td', null, _o7), h('td', null, code, u.dup ? h('div', { class: 'sl-small sl-muted' }, 'Đã có – bỏ qua') : null),
h('td', null, String(u.floor)), h('td', null, u.axis), h('td', null, u.unit_type || '—'), h('td', null, _oi('area_carpet_m2', u.area_carpet_m2) || '—'), h('td', null, _oi('area_gross_m2', u.area_gross_m2) || '—'));
})))),
_o1i));
_od();
}
async function saveAll() {
const _o16 = list.filter((u) => u.keep && !u.dup && u.unit_code);
const _o1 = T.markExisting(_o16, await K.listAll('objects'), _o13.id);
const now = Date.now(), by = _o1v(ctx);
let _ox = 0, skip = 0;
for (const u of _o1) {
if (u.dup) { skip++; continue; }
const row = LU.unitRecord({ id: K.newId(), project: _o13, unit: { unit_code: u.unit_code, unit_type: u.unit_type, bedrooms: u.bedrooms, area_carpet_m2: u.area_carpet_m2, area_gross_m2: u.area_gross_m2,
balcony_dir: u.balcony_dir, door_dir: u.door_dir, view: u.view }, imageName: '', provider: 'tay', now, by, status: LU.REVIEW.ok,
extra: { zone: u.zone, tower: u.tower, floor: u.floor, axis: u.axis, origin: 'generated' } });
try { await K.put('objects', row); _ox++; } catch (e) { K.toast(`Chưa lưu hết: ${_ox} căn (${(e && e.message) || e})`, 'error'); break; }
}
_or.close();
K.toast(`Đã lưu ${_ox} căn vào danh sách căn${skip ? ` (bỏ ${skip} căn trùng số)` : ''}`, 'ok');
_o1e();
}
}
async function _o1e() {
const list = LU.projectUnits(await K.list('objects'), _o13.id);
const _ot = (_o1w) => (_o1w == null ? '—' : S.fmtNum(_o1w, 2));
_o1u.replaceChildren(h('details', { class: 'sl-box', 'data-testid': 'catalog-layout-units', open: list.length && list.length <= 40 ? true : null },
h('summary', null, h('b', null, `Danh sách căn (${list.length})`)),
list.length ? h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl tt-tbl' },
h('thead', null, h('tr', null, ...['Số căn', 'Toà', 'Tầng', 'Loại', 'TT m²', 'Tim tường m²', 'Trạng thái', ''].map((x) => h('th', null, x)))),
h('tbody', null, list.map((u) => h('tr', { 'data-testid': 'catalog-unit-' + u.id },
h('td', null, h('b', null, u.unit_code || (u.row && u.row.name) || 'Căn ?')), h('td', null, u.tower || '—'), h('td', null, u.floor == null ? '—' : String(u.floor)),
h('td', null, u.unit_type || '—'),
h('td', null, u.area_carpet_m2 != null ? _ot(u.area_carpet_m2) : u.area_m2 != null ? _ot(u.area_m2) + ' (?)' : '—'), h('td', null, _ot(u.area_gross_m2)),
h('td', null, h('span', { class: 'sl-tag' + (u.status === LU.REVIEW.ai ? ' ref' : '') }, LU.STATUS_LABEL[u.status] || u.status)),
h('td', null, h('div', { class: 'tt-acts' },
u.status === LU.REVIEW.ai ? K.button('✓ Đã soát', () => _ou(u), { testid: 'tt-unit-ok-' + u.id }) : null,
o.canErase ? K.button('Xoá', () => _o1b(u), { kind: 'ghost', icon: 'x', testid: 'tt-unit-del-' + u.id }) : null))))))) :
h('p', { class: 'sl-small sl-muted' }, 'Chưa có căn nào. Bấm "🏢 Tạo danh sách căn" ở từng toà khi đã có bảng trục.')));
}
async function _ou(u) {
const fields = Object.fromEntries(LU.UNIT_FIELDS.map((_op) => [_op, u[_op] === undefined ? null : u[_op]]));
await K.put('objects', G.unitRow({ id: u.id, project: _o13, fields, imageName: u.image_name, provider: u.data.ai, now: Date.now(), confirmedBy: _o1v(ctx), prev: u.row }));
K.toast('Đã soát căn ' + (u.unit_code || ''), 'ok');
_o1e();
}
async function _o1b(u) {
const name = u.unit_code || 'căn này';
if (!(await K.confirm({ title: 'Xoá căn', text: `Xoá "${name}" khỏi danh sách căn của dự án?`, ok: 'Xoá', kind: 'danger', testid: 'tt-unit-del-confirm' }))) return;
await K.put('objects', { ...u.row, deleted: 1 });
K.toast('Đã xoá ' + name, 'ok');
_o1e();
}
render();
await _o1e();
return { reload: async () => { env = await S.loadEnv(ctx); st = T.readStructure(R.rowData(env, _o13.id).data); render(); await _o1e(); } };
}

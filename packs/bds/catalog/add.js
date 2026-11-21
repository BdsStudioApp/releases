import { h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as A from './add_logic.js';
import * as R from './research.js';
import * as CU from './upload.js';
import * as T from './structure_logic.js';
export const canAdd = R.canResearch;
const _o0 = '.sl-ttl{display:flex;flex-wrap:wrap;align-items:center;gap:6px}' +
'.sl-ai{display:inline-flex;align-items:center;gap:4px;font-size:.72rem;font-weight:600;line-height:1.2;padding:3px 8px;border-radius:999px;background:rgba(201,162,74,.18);color:inherit;border:1px solid rgba(201,162,74,.5);width:max-content;max-width:100%}' +
'.sl-suggest{border:1px dashed rgba(201,162,74,.8);border-radius:14px;padding:10px 12px;background:rgba(201,162,74,.08);display:flex;flex-direction:column;gap:8px}' +
'.sl-suggest .sl-qname{overflow-wrap:anywhere}' +
'[data-testid=catalog-add-modal] .btn,[data-testid=catalog-update-modal] .btn,[data-testid=catalog-suggest] .btn{flex-wrap:wrap;white-space:normal;height:auto;text-align:center}';
export function ensureCss() {
S.ensureSalesCss(); R.ensureCss();
if (typeof document === 'undefined' || ensureCss.done) return;
ensureCss.done = true;
try { const _o1e = new CSSStyleSheet(); _o1e.replaceSync(_o0); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _o1e]; }
catch { const st = document.createElement('style'); st.textContent = _o0; document.head.appendChild(st); }
}
const ST_TXT = { ...R.ST_TXT, manual: 'Anh/chị sửa' };
const _o1 = [['', '— Chưa rõ —'], ['sale', 'Đang bán'], ['soon', 'Sắp mở bán'], ['done', 'Đã bàn giao']];
const _o1l = (ctx) => (ctx.user && ctx.user.id) || '';
const _o3 = (env) => [...env.projects.map((_oz) => _oz.id), ...env.projectRows.map((r) => String(r.id))];
let _or = null;
function _o1g(_ot) {
if (_or && _or !== _ot) { try { _or.close(); } catch { } }
_or = _ot;
return _ot;
}
export function openAdd(K, ctx, opts = {}) {
ensureCss();
const env = opts.env;
const staff = canAdd(ctx);
if (opts.mode === 'file' && staff) {
_o1g(null);
CU.openUpload(ctx, { K, env, project: null, name: String(opts.name || '').trim(), onSaved: () => opts.onFileSaved && opts.onFileSaved() });
return { close: () => {} };
}
const st = { mode: '', result: null, opened: new Set(), busy: false, run: 0, structP: null, structWait: false };
const _ow = h('input', { class: 'sl-in', type: 'text', value: opts.name || '', maxlength: 120, placeholder: 'VD: Chủ đầu tư Cổ Loa, Dự án…', 'aria-label': 'Tên dự án', 'data-testid': 'cadd-name',
oninput: () => { _o17(); _o16(); if (st.result) { st.result = null; _o18(); _o2.render(); } } });
let _o7 = 0;
const _o13 = () => { clearTimeout(_o7); _o7 = setTimeout(() => { if (st.mode === 'ai') _o2.estimate(); }, 400); };
const _o4 = h('input', { class: 'sl-in', type: 'text', maxlength: 80, placeholder: 'VD: Đông Anh, Khu đô thị, Thủ Đức…', 'aria-label': 'Khu vực (không bắt buộc)', 'data-testid': 'cadd-area-hint', oninput: _o13 });
const _oi = h('input', { class: 'sl-in', type: 'text', maxlength: 120, placeholder: 'VD: Chủ đầu tư, Chủ đầu tư…', 'aria-label': 'Chủ đầu tư (không bắt buộc)', 'data-testid': 'cadd-dev-hint', oninput: _o13 });
const dupBox = h('div', { class: 'sl-col', 'aria-live': 'polite' });
const choices = h('div', { class: 'sl-col', 'data-testid': 'cadd-choices' });
const _o10 = h('div', { class: 'sl-col' });
const estBox = h('div', { class: 'sl-col', 'aria-live': 'polite', 'data-testid': 'cadd-estimate' });
const acts = h('div', { class: 'sl-row' });
const res = h('div', { class: 'sl-col', 'aria-live': 'polite' });
const _ot = K.modal({ title: '➕ Thêm dự án', wide: true, testid: 'catalog-add-modal', body: h('div', { class: 'sl g1', 'data-testid': 'catalog-add' },
h('p', { class: 'g1-lead' }, staff
? 'Nhập tên dự án mới. App kiểm tra trùng với Thông tin dự án; dự án chưa có thì AI (Gemini + tìm Google) tìm chủ đầu tư, vị trí, loại căn, giá, pháp lý, tiến độ, bàn giao… kèm link nguồn để anh/chị tick/sửa rồi lưu.'
: 'Nhập tên dự án mới rồi bấm "Thêm tay" để tự điền thông tin.'),
h('label', { class: 'sl-f' }, 'Tên dự án', _ow),
dupBox, choices, _o10) });
_o1g(_ot);
const ask = { zones: true, towers: true, floors: true, axes: false };
const _o5 = h('div', { class: 'sl-chips', role: 'group', 'aria-label': 'Tìm thêm', 'data-testid': 'cadd-struct-ask' });
function _o15() {
_o5.replaceChildren(...Object.entries(T.ASK_KEYS).map(([k, label]) => h('button', { type: 'button', class: 'sl-chip' + (ask[k] ? ' on' : ''), 'aria-pressed': String(!!ask[k]), 'data-testid': 'cadd-ask-' + k,
onclick: () => { ask[k] = !ask[k]; _o15(); _o13(); } }, label)));
}
_o15();
const _o6 = () => Object.values(ask).some(Boolean);
const _o2 = R.aiRunner(K, ctx, { tid: 'cadd', prompt: () => A.newProjectPrompt(_ow.value, { area: _o4.value, dev: _oi.value, structure: ask }), projectId: () => 'moi', staff,
runPrompt: () => A.newProjectPrompt(_ow.value, { area: _o4.value, dev: _oi.value, structure: null }),
estFactor: () => (_o6() ? 2 : 1),
onStart: () => {
const run = ++st.run;
st.structP = _o6() ? K.api(R.ACTION, { prompt: T.structurePrompt({ name: _ow.value.trim(), dev: _oi.value.trim(), loc: _o4.value.trim() }, { ...ask }), project_id: 'moi', grounding: true })
.then((x) => ({ run, x }), () => ({ run, x: null })) : null;
},
snapshot: () => _ow.value.trim(), estBox, acts, res, hasResult: () => !!st.result, onResult: _o1f, busyText: 'Gemini đang tìm dự án trên Google…', runText: '✅ Đồng ý chi phí – chạy tìm (Gemini + Google)',
onNoWeb: () => { st.result = null; _o2.render(); res.replaceChildren(R.noWebBox('cadd-noweb', h('div', { class: 'sl-row' },
K.button('✏️ Thêm tay', startManual, { testid: 'cadd-noweb-manual' }), K.button('📎 Thêm từ file', fromFile, { testid: 'cadd-noweb-file' })))); } });
const similar = (name) => A.findSimilar(name, env.projects);
const _op = (name) => similar(name).some((x) => x.kind === 'exact');
function _ok(list, testid) {
if (!list.length) return null;
const _ol = list.some((x) => x.kind === 'exact');
return h('div', { class: 'g1-warn sl-col', role: 'status', 'data-testid': testid, 'data-kind': _ol ? 'exact' : 'near' },
h('b', null, _ol ? '⚠️ Dự án này đã có trong Thông tin dự án:' : 'Có thể trùng với dự án đã có:'),
h('ul', { class: 'sl-issues' }, list.map((x) => h('li', { 'data-testid': testid + '-' + x.id },
h('b', null, x.name), [x.dev, x.area].filter(Boolean).length ? ' · ' + [x.dev, x.area].filter(Boolean).join(' · ') : '', ' ',
K.button('Mở dự án', () => { _ot.close(); opts.openProject && opts.openProject(x.id); }, { kind: 'ghost', testid: 'cadd-open-' + x.id }),
staff ? K.button('🔄 Cập nhật dự án này', () => { _ot.close(); opts.updateProject && opts.updateProject(x.id); }, { kind: 'ghost', testid: 'cadd-update-' + x.id }) : null))),
h('span', { class: 'sl-small' }, _ol
? 'Muốn lấy thông tin mới nhất, bấm "🔄 Cập nhật dự án này". Nếu đúng là dự án KHÁC, ghi tên rõ hơn (thêm phân khu, khu vực…).'
: 'Nếu là dự án khác, cứ chọn cách thêm bên dưới.'));
}
function _o17() { dupBox.replaceChildren(...[_ok(similar(_ow.value), 'cadd-dup')].filter(Boolean)); }
function _o16() {
const name = _ow.value.trim(), _ol = _op(name);
const _ou = K.button('✏️ Thêm tay', startManual, { kind: st.mode === 'manual' ? 'ghost' : staff ? 'ghost' : 'primary', testid: 'cadd-manual' });
_ou.disabled = !name || _ol;
if (!staff) {
choices.replaceChildren(h('div', { class: 'sl-row' }, _ou),
h('p', { class: 'g1-warn sl-small', 'data-testid': 'cadd-staff-only' }, 'AI tìm dự án và Thêm từ file chỉ dành cho Chủ / Quản lý. Anh/chị có thể thêm tay; máy chủ hiện chỉ nhận dự án mới từ Chủ / Quản lý, nếu bị từ chối thì nhờ Chủ / Quản lý thêm.'));
return;
}
const aiB = K.button('✨ Để AI tìm thông tin dự án', startAi, { kind: st.mode === 'ai' ? 'ghost' : 'primary', testid: 'cadd-ai' });
const fileB = K.button('📎 Thêm từ file (bảng giá, brochure…)', fromFile, { testid: 'catalog-add-file' });
aiB.disabled = !name || _ol;
choices.replaceChildren(
h('div', { class: 'sl-row' }, aiB, fileB, _ou),
h('span', { class: 'sl-ai', 'data-testid': 'cadd-ai-tag' }, '✨ AI · có thể tốn phí'),
h('p', { class: 'sl-small sl-muted' }, 'AI tìm: hỏi thêm khu vực / chủ đầu tư (không bắt buộc), báo chi phí ước tính và chờ anh/chị đồng ý mới chạy; chưa có khoá Gemini thì làm qua chat Gemini/Claude (miễn phí). Từ file: AI đọc bảng giá / chính sách / brochure. Thêm tay: tự điền giá, loại căn, bàn giao.'));
}
function startAi() {
if (!staff || !_ow.value.trim() || _op(_ow.value)) return;
st.mode = 'ai'; st.result = null;
_o10.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'cadd-ai-panel' },
h('div', { class: 'sl-row' }, h('h3', null, '✨ AI tìm thông tin dự án mới'), h('span', { class: 'sl-ai' }, '✨ AI · có thể tốn phí')),
h('div', { class: 'sl-col', 'data-testid': 'cadd-ask' },
h('b', null, 'Bước 1 – Giúp AI tìm đúng dự án (không bắt buộc)'),
h('span', { class: 'sl-small sl-muted' }, 'Nhiều dự án trùng tên – ghi khu vực và chủ đầu tư nếu anh/chị biết để AI không tìm nhầm. Bỏ trống cũng được.'),
h('div', { class: 'sl-form' }, h('label', { class: 'sl-f' }, 'Khu vực', _o4), h('label', { class: 'sl-f' }, 'Chủ đầu tư', _oi)),
h('span', { class: 'sl-small' }, 'Tìm thêm (chỉ lấy thông tin có link nguồn):'), _o5),
h('b', null, 'Bước 2 – Chi phí ước tính: đồng ý thì app mới chạy'), estBox, acts, res));
_o16(); _o18(); _o2.render(); _o2.estimate();
}
function _o1f(text, grounding, meta) {
const asked = meta && meta.asked != null ? meta.asked : _ow.value.trim();
if (A.askChanged(asked, _ow.value)) {
st.result = null; _o2.render();
res.replaceChildren(h('div', { class: 'g1-warn', 'data-testid': 'cadd-stale' },
`Kết quả AI là cho tên cũ "${asked}" nên đã bỏ (ô Tên đã đổi thành "${_ow.value.trim()}"). Bấm chạy lại để tìm theo tên mới.`));
return;
}
const r = A.newProjectRows(text, grounding);
const _od = meta && meta.by === 'chat';
const _o1h = (t, g, via) => { const sr = _o6() ? T.parseStructureLines(t, g, { via, now: Date.now() }) : null; return sr && !sr.noWeb && sr.kept ? sr : null; };
const _o11 = !_od && st.structP ? st.structP : null;
st.structP = null;
r.struct = _o11 ? null : _o1h(text, grounding, _od ? 'chat' : 'api');
st.structWait = !!_o11;
if (_o11) _o11.then(({ run, x }) => {
if (run !== st.run || st.result !== _og) return;
st.structWait = false;
_og.struct = x ? _o1h(x.text, { sources: x.sources || [], segments: x.segments || [] }, 'api') : null;
_o18();
});
const loc = r.rows.find((x) => x.field === 'loc');
const _og = { ...r, meta, name: r.name || asked, area: r.area || A.areaFromLoc(loc && loc.ok ? loc.value : '') };
st.result = _og;
st.opened = new Set();
_o18(); _o2.render();
}
function _o18() {
const r = st.result;
if (!r) { res.replaceChildren(); return; }
const _ob = r.candidates.length >= 2 ? h('div', { class: 'g1-warn sl-col', 'data-testid': 'cadd-cands' },
h('b', null, 'AI thấy nhiều dự án có tên gần giống – chọn đúng dự án rồi tìm lại:'),
h('ul', { class: 'sl-issues' }, r.candidates.map((c, i) => h('li', { 'data-testid': 'cadd-cand-' + i },
h('b', null, c.name), [c.dev, c.loc].filter(Boolean).length ? ' · ' + [c.dev, c.loc].filter(Boolean).join(' · ') : '', ' ',
c.url ? h('a', { href: c.url, target: '_blank', rel: 'noopener' }, G.hostOf(c.url) || 'nguồn') : null, ' ',
K.button('Chọn dự án này', () => _o12(c), { kind: 'ghost', testid: 'cadd-cand-pick-' + i }))))) : null;
if (!r.rows.length) {
res.replaceChildren(...[_ob, h('div', { class: 'g1-warn', 'data-testid': 'cadd-empty' },
`AI chưa tìm được thông tin có nguồn đáng tin cho "${_ow.value.trim()}". Ghi thêm khu vực / chủ đầu tư ở Bước 1 rồi bấm Tìm lại, hoặc chọn ✏️ Thêm tay.`), _o1i(r.struct)].filter(Boolean));
return;
}
const _oy = h('input', { class: 'sl-in', type: 'text', value: r.name, maxlength: 160, 'data-testid': 'cadd-new-name', 'aria-label': 'Tên dự án mới',
oninput: () => { r.name = _oy.value; dup2.replaceChildren(...[_ok(similar(_oy.value), 'cadd-dup2')].filter(Boolean)); _o19(); } });
const _ox = h('input', { class: 'sl-in', type: 'text', value: r.area, maxlength: 60, 'data-testid': 'cadd-new-area', 'aria-label': 'Khu vực', placeholder: 'VD: Khu đô thị, Đông Anh',
oninput: () => { r.area = _ox.value; } });
const dup2 = h('div', { class: 'sl-col' }, ...[_ok(similar(r.name), 'cadd-dup2')].filter(Boolean));
const rows = r.rows.map(_o1a);
res.replaceChildren(...[_ob, h('div', { class: 'sl-col', 'data-testid': 'cadd-result' },
h('h3', null, `Gợi ý cho dự án mới (${r.rows.length} mục · ${r.meta.by}${r.meta.cost ? ` · ${S.fmtNum(r.meta.cost, 4)} USD` : ''})`),
r.meta.queries.length ? h('div', { class: 'sl-small sl-muted', 'data-testid': 'cadd-queries' }, 'Đã tìm: ' + r.meta.queries.join(' · ')) : null,
h('div', { class: 'sl-form' }, h('label', { class: 'sl-f' }, 'Tên dự án (lưu vào Thông tin dự án)', _oy), h('label', { class: 'sl-f' }, 'Khu vực (để lọc)', _ox)),
dup2,
h('div', { class: 'sl-scroll table-wrap' }, h('table', { class: 'sl-tbl g1-tbl g1-stack' },
h('thead', null, h('tr', null, h('th', null, 'Lưu'), h('th', null, 'Mục'), h('th', null, 'Giá trị (sửa được)'), h('th', null, 'Nguồn'))), h('tbody', null, rows))),
h('p', { class: 'g1-ai-note sl-small', 'data-testid': 'cadd-ai-note' }, '✨ Lưu xong, dự án mang nhãn "' + A.AI_UNVERIFIED_TEXT + '" cho tới khi anh/chị bấm "Đã kiểm lại". Chính sách thanh toán không lấy từ AI – chỉ nhập sau ở "Cập nhật chính sách" và luôn lưu dạng nháp.'),
h('p', { class: 'g1-legal' }, 'Dòng có nguồn Google được tick sẵn; bấm link để đọc nguồn trước khi lưu. Dòng không có link chỉ lưu được khi anh/chị tự sửa giá trị (ghi nguồn "Sửa tay"). Số liệu AI tìm – đối chiếu tài liệu chủ đầu tư trước khi báo khách.'),
_o1i(r.struct),
_o1c)].filter(Boolean));
_o19();
}
function _o1i(sr) {
if (st.structWait) return h('p', { class: 'sl-small sl-muted', 'data-testid': 'cadd-struct-wait' }, 'Đang tìm thêm phân khu / toà / trục…');
if (!sr) return Object.values(ask).some(Boolean) ? h('p', { class: 'sl-small sl-muted', 'data-testid': 'cadd-struct-none' }, 'Phân khu / toà / trục: ' + T.NO_FOUND_TEXT + ' (lưu dự án xong, mở "🏗️ Phân khu · Toà · Trục" để nhập hoặc đọc ảnh layout).') : null;
const _o1b = T.structStats(sr.st);
return h('div', { class: 'sl-box sl-col', 'data-testid': 'cadd-struct' },
h('b', null, `Cấu trúc dự án có nguồn: ${_o1b.zones} phân khu · ${_o1b.towers} toà · ${_o1b.axes} trục`),
h('span', { class: 'sl-small sl-muted' }, `Lưu kèm dự án (chỉ ô có link nguồn${sr.dropped ? `; bỏ ${sr.dropped} dòng không có link` : ''}). Ô không có nguồn để trống chờ anh/chị nhập.`));
}
function _o1a(row) {
const _oc = h('input', { type: 'checkbox', 'aria-label': 'Chọn lưu ' + row.label, 'data-testid': 'cadd-pick-' + row.field,
onchange: (e) => { row.picked = e.target.checked; _o19(); } });
const _o9 = row.field === 'types' || row.field === 'amenities' || row.field === 'legal' || row.field === 'progress';
const val = h(_o9 ? 'textarea' : 'input', { class: 'sl-in', rows: _o9 ? 2 : null, type: _o9 ? null : 'text', 'aria-label': row.label, 'data-testid': 'cadd-val-' + row.field,
oninput: () => { row.text = val.value; if (A.isEdited(row) && A.normValue(row.field, row.text).ok) row.picked = true; _o14(); _o19(); } });
val.value = row.text;
const err = h('div', { class: 'sl-bad sl-small' });
const chip = h('span', { class: 'g1-st' });
const quote = String(row.quote || '').replace(/^["“']+|["”']+$/g, '').trim();
const _oq = [...row.sources.slice(0, 3).map((_o1b, i) => h('a', { href: G.safeUrl(_o1b.url), target: '_blank', rel: 'noopener', 'data-testid': `cadd-src-${row.field}-${i}` }, _o1b.title || G.hostOf(_o1b.url) || 'Nguồn')),
row.url && !row.sources.length ? h('a', { href: row.url, target: '_blank', rel: 'noopener', 'data-testid': 'cadd-ailink-' + row.field,
onclick: () => { st.opened.add(row.field); setTimeout(_o14, 30); } }, G.hostOf(row.url) || row.url) : null].filter(Boolean);
const tr = h('tr', { 'data-testid': 'cadd-row-' + row.field, 'data-status': row.status },
h('td', null, R.pickBox(_oc)), h('td', null, h('b', null, row.label)),
h('td', null, val, err, quote ? h('div', { class: 'sl-small sl-muted' }, '“' + quote + '”') : null),
h('td', { class: 'g1-src' }, chip, h('div', { class: 'sl-col sl-small' }, _oq), row.date ? h('div', { class: 'sl-small sl-muted' }, 'Ngày nguồn ' + row.date.split('-').reverse().join('/')) : null));
function _o14() {
const _oa = A.canPickRow(row, { opened: st.opened.has(row.field) });
const edited = A.isEdited(row);
_oc.disabled = !_oa || !staff;
_oc.checked = !!row.picked && _oa;
const _ov = edited ? A.normValue(row.field, row.text) : null;
err.textContent = edited ? (_ov.ok ? '' : _ov.error) : row.error ? row.error + (row.status === 'missing' ? ' – sửa giá trị nếu anh/chị chắc chắn' : '') : '';
chip.className = 'g1-st ' + (edited ? 'grounded' : row.status);
chip.textContent = edited ? ST_TXT.manual : ST_TXT[row.status];
chip.style.display = chip.textContent ? '' : 'none';
tr.dataset.edited = edited ? '1' : '';
}
_o14();
return tr;
}
function _o12(c) {
_ow.value = c.name;
_oi.value = c.dev || '';
_o4.value = A.areaFromLoc(c.loc) || '';
st.result = null; _o17(); _o16(); _o18();
if (_op(c.name)) { _o2.render(); return; }
startAi();
}
const _o1c = h('div', { class: 'sl-row sl-end' });
function _oe() { const r = st.result; return r ? r.rows.filter((x) => x.picked && A.canPickRow(x, { opened: st.opened.has(x.field) })) : []; }
function _o19() {
const r = st.result;
const _ov = _oe().length;
const _o8 = K.button(`💾 Lưu dự án (${_ov} mục)`, saveAi, { kind: 'primary', testid: 'cadd-save' });
_o8.disabled = !staff || !r || !String(r.name || '').trim() || _op(r.name) || st.busy;
_o1c.replaceChildren(_o8);
}
async function saveAi() {
const r = st.result;
if (!r || !staff || st.busy) return;
if (_op(r.name)) { K.toast('Tên trùng dự án đã có – mở dự án đó để cập nhật.', 'warn'); return; }
const out = A.buildNewProject({ name: r.name, area: r.area, rows: r.rows, opened: st.opened, existingIds: _o3(await S.loadEnv(ctx)), now: Date.now(), by: _o1l(ctx), via: r.meta.by === 'chat' ? 'chat' : 'ai' });
if (out.ok && r.struct) out.row.data = T.writeStructure(out.row.data, r.struct.st);
await _of(out);
}
async function _of(out) {
if (!out.ok) { K.toast(out.error, 'warn'); return false; }
st.busy = true;
try {
await K.put('projects', { ...out.row, data: JSON.stringify(out.row.data) });
try { await K.put('audit', { at: Date.now(), action: 'catalog.project_add', object_id: out.id, detail: JSON.stringify({ via: out.row.data.created.via, fields: out.saved }) }); } catch { }
K.toast(`Đã thêm dự án ${out.row.name}${out.saved.length ? ` (${out.saved.length} mục kèm nguồn)` : ''}.`, 'ok');
_ot.close();
try { if (opts.onSaved) await opts.onSaved(out.id); } catch { }
return true;
} catch (e) {
K.toast('Chưa lưu được: ' + ((e && e.message) || 'lỗi'), 'error');
return false;
} finally { st.busy = false; }
}
function fromFile() {
if (!staff) return;
const name = _ow.value.trim();
_ot.close();
CU.openUpload(ctx, { K, env, project: null, name, onSaved: () => opts.onFileSaved && opts.onFileSaved() });
}
function startManual() {
if (!_ow.value.trim() || _op(_ow.value)) return;
st.mode = 'manual';
const _om = (tid, attrs = {}) => h('input', { class: 'sl-in', type: 'text', 'data-testid': tid, ...attrs });
const dev = _om('cadd-m-dev'), loc = _om('cadd-m-loc'), area = _om('cadd-m-area', { placeholder: 'VD: Khu đô thị, Đông Anh' });
const _os = _om('cadd-m-price-lo', { inputmode: 'decimal' }), hi = _om('cadd-m-price-hi', { inputmode: 'decimal' });
const _oo = h('input', { class: 'sl-in', type: 'month', 'data-testid': 'cadd-m-handover' });
const _o1j = K.select(_o1, '', { class: 'sl-in', 'data-testid': 'cadd-m-status' });
const _o1k = h('textarea', { class: 'sl-in', rows: 4, 'data-testid': 'cadd-m-types', placeholder: '1N: 45-50\n2N: 65-75\nPenthouse: liên hệ' });
const err = h('div', { class: 'sl-bad', role: 'alert', 'data-testid': 'cadd-m-err' });
_o10.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'cadd-manual-form' },
h('h3', null, '✏️ Thêm tay dự án mới'),
h('div', { class: 'sl-form' },
h('label', { class: 'sl-f' }, 'Chủ đầu tư', dev), h('label', { class: 'sl-f' }, 'Vị trí', loc),
h('label', { class: 'sl-f' }, 'Khu vực (để lọc)', area), h('label', { class: 'sl-f' }, 'Trạng thái', _o1j),
h('label', { class: 'sl-f' }, 'Giá thấp (triệu/m²)', _os), h('label', { class: 'sl-f' }, 'Giá cao (triệu/m²)', hi),
h('label', { class: 'sl-f' }, 'Bàn giao (tháng)', _oo)),
h('label', { class: 'sl-f' }, 'Loại căn – mỗi dòng "Tên: m² nhỏ-m² lớn" (hoặc "liên hệ")', _o1k),
err,
h('div', { class: 'sl-row sl-end' }, K.button('💾 Lưu dự án mới', async () => {
const out = A.buildManualProject({ name: _ow.value, dev: dev.value, loc: loc.value, area: area.value, status: _o1j.value, priceLo: _os.value, priceHi: hi.value, handover: _oo.value, typesText: _o1k.value },
{ existingIds: _o3(await S.loadEnv(ctx)), now: Date.now(), by: _o1l(ctx) });
if (!out.ok) { err.textContent = out.error; return; }
err.textContent = '';
await _of(out);
}, { kind: 'primary', testid: 'cadd-manual-save' }))));
_o16();
}
_o17(); _o16();
if (opts.mode === 'ai' && staff) startAi(); else if (opts.mode === 'manual') startManual();
else setTimeout(() => { try { _ow.focus(); } catch { } }, 50);
return { close: () => _ot.close() };
}
export function openUpdatePicker(K, ctx, opts = {}) {
ensureCss();
const env = opts.env;
const list = [...env.projects].sort((a, _o8) => String(a.name).localeCompare(String(_o8.name), 'vi'));
const _o1d = K.select(list.map((_oz) => [_oz.id, _oz.name + (_oz.dev ? ' · ' + _oz.dev : '')]), opts.project || (list[0] || {}).id || '', { class: 'sl-in', 'data-testid': 'cupd-project', 'aria-label': 'Dự án' });
const last = h('p', { class: 'sl-small sl-muted', 'data-testid': 'cupd-last' });
const _oj = () => { const _oz = env.project(_o1d.value); const _oh = R.lastUpdate(env, _oz); last.textContent = _oz ? (_oh ? `Lần cập nhật thông tin trước: ${_oh}.` : 'Dự án chưa được cập nhật lần nào (đang dùng dữ liệu mặc định).') : ''; };
_o1d.addEventListener('change', _oj);
const _on = (fn) => () => { const id = _o1d.value; if (!id) return; _ot.close(); fn && fn(id); };
const _ot = K.modal({ title: '🔄 Cập nhật dự án', testid: 'catalog-update-modal', body: h('div', { class: 'sl', 'data-testid': 'catalog-update' },
h('p', { class: 'sl-muted' }, 'Cập nhật thông tin MỚI NHẤT tại thời điểm bấm cho dự án đã có trong Thông tin dự án: AI tìm trên Google (kèm link nguồn, anh/chị duyệt CŨ → MỚI) hoặc gửi file bảng giá / chính sách mới.'),
h('label', { class: 'sl-f' }, 'Dự án', _o1d), last,
h('div', { class: 'sl-row' },
K.button('🔍 AI tìm thông tin mới nhất', _on(opts.research), { kind: 'primary', testid: 'cupd-ai' }),
K.button('📎 Gửi file cập nhật', _on(opts.upload), { testid: 'cupd-file' }),
K.button('Mở dự án', _on(opts.openProject), { kind: 'ghost', testid: 'cupd-open' }))) });
_o1g(_ot);
_oj();
return { close: () => _ot.close() };
}

import { h, kids } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as U from '../g1_lib/ui.js';
import * as R from './research.js';
import * as N from './research_new_logic.js';
import { newProjectId } from './upload_logic.js';
import * as T from './structure_logic.js';
const ST_TXT = R.ST_TXT;
const _ot = (_od) => String(_od.quote || '').replace(/^["“']+|["”']+$/g, '').trim();
const _o3 = [['', '— chưa rõ —'], ['sale', 'Đang bán'], ['soon', 'Sắp mở bán'], ['done', 'Đã bàn giao'], ['ask', 'Nhận bảng giá']];
const _o2 = '#/settings/connection/gemini';
const _o0 = ['[data-testid=catalog]', '[data-testid=project-detail]', '[data-testid=catalog-research]', '[data-testid=catalog-research-new]', '[data-testid=catalog-add-modal]', '[data-testid=catalog-upload]', '[data-testid=project-new]'];
const _o1 = '.sl-cover .sl-badges{position:absolute;left:8px;top:8px;right:8px;display:flex;flex-direction:column;align-items:flex-start;gap:4px;pointer-events:none}' +
'.sl-cover .sl-badges .sl-dev{position:static;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
`.sl-cover[data-baked="1"] .sl-badges{left:3%;top:calc(${(N.BAKED_LABEL.y1 * 100).toFixed(2)}% + 6px)}` +
'.sl-mau{display:inline-block;margin-left:6px;font-size:.68rem;font-weight:700;line-height:1.5;padding:0 7px;border-radius:999px;background:rgba(201,162,74,.22);color:#8a6a1e;vertical-align:middle}' +
'.sl-aireview{display:inline-block;font-size:.75rem;padding:1px 8px;border-radius:999px;background:rgba(201,162,74,.18);color:#8a6a1e;align-self:flex-start}' +
'.crn-suggest{margin:6px 0;gap:8px}.crn-sg-t{display:flex;flex-wrap:wrap;gap:6px;align-items:center;overflow-wrap:anywhere}' +
'.crn-cands{display:flex;flex-direction:column;gap:8px}.crn-cand{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between}' +
'.crn-cand>div{min-width:0;flex:1 1 200px;overflow-wrap:anywhere}[data-testid=crn-result] td{overflow-wrap:anywhere;word-break:break-word}' +
'.crn-conf{display:inline-block;font-size:.78em;padding:1px 8px;border-radius:999px;background:rgba(127,127,127,.14)}.crn-conf.cao{background:rgba(30,122,79,.14);color:#1E7A4F}' +
'.crn-conf.thap{background:rgba(179,38,30,.12);color:#B3261E}' +
_o0.map((s) => s + ' .btn').join(',') + '{flex-wrap:wrap;white-space:normal;row-gap:2px;height:auto;padding-top:6px;padding-bottom:6px;text-align:center}' +
_o0.map((s) => s + ' .btn>span').join(',') + '{overflow-wrap:anywhere}' +
_o0.map((s) => s + ' .btn .ai-badge').join(',') + '{margin-left:0!important;white-space:nowrap}' +
'.crn-pick{display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:.9em}.crn-pick input{width:22px;height:22px;margin:0;accent-color:#C9A24A;color-scheme:light}' +
'.crn-pick-t{display:none}@media (max-width:600px){.crn-pick-t{display:inline}}' +
'.crn-hint{font-size:.88em}.crn-lbl{display:none;font-size:.85em;margin-right:6px;color:var(--sl-muted,rgba(127,127,127,.95))}@media (max-width:600px){.crn-lbl{display:inline}}';
export function ensureCss() {
S.ensureSalesCss(); U.ensureCss(); R.ensureCss();
if (typeof document === 'undefined' || ensureCss.done) return;
ensureCss.done = true;
try { const _o13 = new CSSStyleSheet(); _o13.replaceSync(_o1); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _o13]; }
catch { const st = document.createElement('style'); st.textContent = _o1; document.head.appendChild(st); }
}
export const canAdd = (ctx) => R.canEditProjects(ctx);
const _o1a = (ctx) => (ctx && ctx.user && (ctx.user.id || ctx.user.username)) || '';
export function aiPaidBadge(K) {
let b = null;
try { b = K.aiBadge(N.FEATURE); } catch { b = null; }
if (!(b instanceof Node)) b = h('span', { class: 'badge badge-warn ai-badge' });
if (!/tốn phí/.test(b.textContent)) {
b.textContent = '✨ AI · có thể tốn phí';
b.classList.remove('badge-gold'); b.classList.add('badge-warn');
b.title = (b.title ? b.title + ' ' : '') + 'Vượt hạn mức miễn phí của Google thì mỗi lần tìm có tính phí, app báo trước.';
b.setAttribute('aria-label', 'AI · có thể tốn phí. ' + b.title);
}
b.dataset.testid = 'crn-ai-badge';
return b;
}
export function suggestCard(K, ctx, name, on = {}) {
ensureCss();
if (!canAdd(ctx)) {
const text = `Nhờ anh/chị thêm dự án "${name}" vào Thông tin dự án giúp em.`;
return h('div', { class: 'sl-box sl-col crn-suggest', 'data-testid': 'catalog-suggest', 'data-staff': '0', role: 'status' },
h('div', { class: 'crn-sg-t' }, `Chưa có dự án "${name}" trong Thông tin dự án.`),
h('p', { class: 'sl-muted sl-small' }, 'Anh/chị chưa được cấp quyền thêm dự án – nhờ Quản trị. Chép lời nhờ rồi gửi qua Zalo cho Quản trị.'),
h('div', { class: 'sl-row' }, K.button('Chép lời nhờ thêm dự án', async () => {
const ok = await K.copy(text);
K.toast(ok ? 'Đã chép – dán gửi Quản trị.' : 'Chưa chép được – nhắn Quản trị: ' + text, ok ? 'ok' : 'warn');
}, { testid: 'suggest-request', icon: 'copy' })));
}
const ai = K.button('Để AI tìm thông tin dự án này', () => on.ai && on.ai(name), { kind: 'primary', testid: 'suggest-ai', icon: 'sparkle' });
return h('div', { class: 'sl-box sl-col crn-suggest', 'data-testid': 'catalog-suggest', 'data-staff': '1', role: 'status' },
h('div', { class: 'crn-sg-t' }, h('span', { 'data-testid': 'suggest-text' }, `Chưa có dự án "${name}" –`), ai, aiPaidBadge(K)),
h('div', { class: 'sl-row' },
K.button('Thêm tay', () => on.manual && on.manual(name), { testid: 'suggest-manual', icon: 'plus' }),
on.file ? K.button('Thêm từ file', () => on.file(name), { testid: 'suggest-file', icon: 'inbox' }) : null));
}
export function openChooser(K, ctx, on = {}) {
ensureCss();
const _on = h('input', { class: 'sl-in', type: 'text', value: on.name || '', placeholder: 'Tên dự án, ví dụ: Khu căn hộ Ven Sông', 'aria-label': 'Tên dự án mới', 'data-testid': 'add-name', maxlength: 120 });
const _oe = (fn, needName) => {
const name = N.cleanName(_on.value);
if (needName && name.length < N.MIN_Q) { K.toast('Nhập tên dự án (ít nhất 3 ký tự) để AI tìm.', 'warn'); _on.focus(); return; }
_ok.close(); fn(name);
};
const ai = K.button('Để AI tìm thông tin dự án này', () => _oe(on.ai, true), { kind: 'primary', testid: 'add-ai', icon: 'sparkle' });
const body = h('div', { class: 'sl sl-col' },
h('label', { class: 'sl-f' }, 'Tên dự án', _on),
h('div', { class: 'crn-sg-t' }, ai, aiPaidBadge(K)),
h('p', { class: 'sl-muted sl-small' }, 'AI tìm trên Google chủ đầu tư, vị trí, giá, bàn giao, pháp lý… kèm link nguồn; anh/chị tick mục nào mới lưu mục đó.'),
h('div', { class: 'sl-row' },
K.button('Thêm tay', () => _oe(on.manual, false), { testid: 'add-manual', icon: 'plus' }),
on.file ? K.button('Thêm từ file', () => _oe(on.file, false), { testid: 'add-file', icon: 'inbox' }) : null));
const _ok = K.modal({ title: '+ Thêm dự án', body, testid: 'catalog-add-modal' });
try { _on.focus(); } catch { }
return _ok;
}
export function openManual(K, ctx, opts = {}) {
ensureCss();
const _oh = (tid, attrs = {}) => h('input', { class: 'sl-in', type: 'text', 'data-testid': tid, ...attrs });
const name = _oh('new-name', { value: opts.name || '', maxlength: 120 });
const dev = _oh('new-dev', { maxlength: 120 });
const area = _oh('new-area', { maxlength: 80, placeholder: 'VD: Thủ Đức, Hà Đông…' });
const loc = _oh('new-loc', { maxlength: 300 });
const status = K.select(_o3, '', { 'data-testid': 'new-status', class: 'sl-in' });
const _oj = _oh('new-price-lo', { inputmode: 'decimal' });
const _of = _oh('new-price-hi', { inputmode: 'decimal' });
const _og = h('input', { class: 'sl-in', type: 'month', 'data-testid': 'new-handover' });
const types = h('textarea', { rows: 5, 'data-testid': 'new-types', placeholder: '1N: 45-50\n2N: 65-75\nShophouse: liên hệ' });
const err = h('div', { class: 'sl-bad', role: 'alert', 'data-testid': 'new-error' });
const body = h('div', { class: 'sl', 'data-testid': 'project-new' },
h('div', { class: 'sl-form' },
h('label', { class: 'sl-f' }, 'Tên dự án', name),
h('label', { class: 'sl-f' }, 'Chủ đầu tư', dev),
h('label', { class: 'sl-f' }, 'Khu vực', area),
h('label', { class: 'sl-f' }, 'Vị trí', loc),
h('label', { class: 'sl-f' }, 'Trạng thái', status),
h('label', { class: 'sl-f' }, 'Giá thấp (triệu/m²)', _oj),
h('label', { class: 'sl-f' }, 'Giá cao (triệu/m²)', _of),
h('label', { class: 'sl-f' }, 'Bàn giao (tháng)', _og)),
h('label', { class: 'sl-f' }, 'Loại căn – mỗi dòng "Tên: m² nhỏ-m² lớn" (hoặc "liên hệ")', types),
err,
h('div', { class: 'sl-row sl-end' }, K.button('Lưu dự án', save, { kind: 'primary', testid: 'new-save', icon: 'check' })));
const _ok = K.modal({ title: '➕ Thêm dự án (nhập tay)', body, testid: 'project-new-modal' });
async function save() {
const _oo = N.cleanName(name.value);
if (_oo.length < 2) { err.textContent = 'Nhập tên dự án.'; name.focus(); return; }
const a = S.parseNum(_oj.value), b = S.parseNum(_of.value);
const price = isFinite(a) ? [a, isFinite(b) ? b : a] : null;
if (price && (price[0] <= 0 || price[1] < price[0])) { err.textContent = 'Giá thấp phải > 0 và không lớn hơn giá cao.'; return; }
const t = S.parseTypesText(types.value);
if (t.some((x) => !x.ask && (x.a[0] <= 0 || x.a[1] < x.a[0]))) { err.textContent = 'Diện tích loại căn chưa hợp lệ.'; return; }
const env = await S.loadEnv(ctx);
const _oa = env.projects.find((p) => S.fold(N.displayName(p)) === S.fold(_oo));
if (_oa) { err.textContent = `Đã có dự án "${N.displayName(_oa)}" trong Thông tin dự án – mở dự án đó để sửa.`; return; }
const _os = newProjectId(_oo, [...env.projects.map((p) => p.id), ...env.projectRows.map((_ou) => _ou.id)]);
const data = { price, handover: _og.value || null, types: t, added: 'manual' };
for (const [k, el] of [['area', area], ['loc', loc], ['status', status]]) { const _o1b = String(el.value || '').trim(); if (_o1b) data[k] = _o1b; }
Object.assign(data, R.manualSources({}, { ...data, dev: dev.value.trim() || null }, ctx, ['dev', 'loc', 'price', 'handover', 'types']));
await K.put('projects', { id: _os, name: _oo, dev: dev.value.trim(), data: JSON.stringify(data), deleted: 0 });
_ok.close(); K.toast('Đã thêm dự án ' + _oo, 'ok');
try { if (opts.onSaved) await opts.onSaved(_os); } catch { }
}
try { (opts.name ? dev : name).focus(); } catch { }
return _ok;
}
export function openAiNew(K, ctx, opts = {}) {
ensureCss();
const _o15 = canAdd(ctx);
const st = { est: null, estErr: '', legacy: false, busy: false, res: null, rows: [], picks: new Set(), opened: new Set(), query: null, struct: null, run: 0, structWait: false };
const ask = { zones: true, towers: true, floors: true, axes: false };
const askBox = h('div', { class: 'sl-chips', role: 'group', 'aria-label': 'Tìm thêm', 'data-testid': 'crn-struct-ask' });
function _ov() {
askBox.replaceChildren(...Object.entries(T.ASK_KEYS).map(([k, label]) => h('button', { type: 'button', class: 'sl-chip' + (ask[k] ? ' on' : ''), 'aria-pressed': String(!!ask[k]), 'data-testid': 'crn-ask-' + k,
onclick: () => { ask[k] = !ask[k]; _ov(); if (st.est) _ox(); } }, label)));
}
_ov();
const _on = h('input', { class: 'sl-in', type: 'text', value: opts.name || '', maxlength: 120, 'data-testid': 'crn-name' });
const _o4 = h('input', { class: 'sl-in', type: 'text', maxlength: 80, placeholder: 'VD: Thủ Đức, TP.HCM', 'data-testid': 'crn-area' });
const _o9 = h('input', { class: 'sl-in', type: 'text', maxlength: 120, placeholder: 'VD: tên chủ đầu tư', 'data-testid': 'crn-dev' });
const estBox = h('div', { class: 'sl-col', 'aria-live': 'polite', 'data-testid': 'crn-estimate' });
const acts = h('div', { class: 'sl-row' });
const _oq = h('div', { class: 'sl-col', 'aria-live': 'polite' });
const _ok = K.modal({ title: '✨ AI tìm dự án mới', wide: true, testid: 'catalog-research-new', body: h('div', { class: 'sl g1' },
h('p', { class: 'g1-lead' }, 'Gemini tìm trên Google thông tin dự án chưa có trong Thông tin dự án. Mỗi thông tin kèm link nguồn và độ tin cậy; anh/chị tick mục muốn lưu.'),
K.aiNote ? K.aiNote(N.FEATURE) : null,
h('div', { class: 'sl-form' },
h('label', { class: 'sl-f' }, 'Tên dự án', _on),
h('label', { class: 'sl-f' }, 'Khu vực / tỉnh (không bắt buộc)', _o4),
h('label', { class: 'sl-f' }, 'Chủ đầu tư (không bắt buộc)', _o9)),
h('p', { class: 'sl-muted crn-hint' }, 'Gợi ý khu vực, chủ đầu tư giúp AI phân biệt các dự án trùng tên.'),
h('span', { class: 'sl-small' }, 'Tìm thêm (chỉ lấy thông tin có link nguồn):'), askBox,
estBox, acts, _oq) });
const manual = (testid) => K.button('Thêm tay', () => { _ok.close(); if (opts.onManual) opts.onManual(N.cleanName(_on.value) || opts.name || ''); }, { testid, icon: 'plus' });
const hints = () => ({ area: N.cleanName(_o4.value).slice(0, 80), dev: N.cleanName(_o9.value).slice(0, 120) });
const _o1d = () => (Object.values(ask).some(Boolean) ? { ...ask } : null);
const _o14 = () => !!(st.est && st.est.split && _o1d());
const _oc = () => (st.est && _o14() && !st.est.free ? { ...st.est, usd: Math.round(Number(st.est.usd) * 2 * 10000) / 10000 } : st.est);
const _or = (e) => !!(e && !e.free && Number(e.budget_cap_usd) > 0 && Number(e.budget_spent_usd) + Number(e.usd) > Number(e.budget_cap_usd));
function _op(testid = 'crn-nokey') {
return h('div', { class: 'g1-warn sl-col', 'data-testid': testid },
h('span', null, 'Chưa có khoá Gemini trên máy chủ nên AI chưa tìm được. Dán khoá ở Cài đặt › Kết nối › Gemini (nhân viên: nhờ Quản trị) (khoá miễn phí trong hạn mức của Google), hoặc thêm dự án bằng tay.'),
h('div', { class: 'sl-row' }, K.button('Mở Kết nối › Gemini', () => { _ok.close(); K.nav(_o2); }, { kind: 'primary', testid: 'crn-open-gemini', icon: 'link' }), manual('crn-nokey-manual')));
}
function _o6(e, testid = 'crn-over') {
return h('div', { class: 'g1-warn sl-col', 'data-testid': testid },
h('span', null, `Lần tìm này (≈ ${S.fmtNum(Number(e && e.usd) || 0, 3)} USD) sẽ vượt trần ngân sách AI tháng` +
(e && e.budget_cap_usd ? ` (đã dùng ${S.fmtNum(e.budget_spent_usd, 2)}/${S.fmtNum(e.budget_cap_usd, 0)} USD)` : '') + '. Nâng trần ở Cài đặt › Ngân sách (nhân viên: nhờ Quản trị) hoặc thêm dự án bằng tay.'),
h('div', { class: 'sl-row' }, manual('crn-over-manual')));
}
function _ox() {
const e = _oc();
let box;
if (!_o15) box = h('div', { class: 'g1-warn', 'data-testid': 'crn-est-text' }, 'Chỉ Quản trị hoặc Quản lý dùng được AI tìm dự án.');
else if (st.estErr) box = h('div', { class: 'g1-err', 'data-testid': 'crn-est-text' }, st.estErr);
else if (!e) box = h('div', { class: 'sl-muted', 'data-testid': 'crn-est-text' }, 'Đang tính chi phí ước tính…');
else if (!e.enabled) box = _op();
else if (_or(e)) box = _o6(e);
else box = h('div', { class: 'g1-okbox', 'data-testid': 'crn-est-text' }, e.free
? `Chi phí ước tính: 0 USD – trong hạn mức miễn phí của khoá Gemini (mẫu ${e.model}, có tìm Google).`
: `Chi phí ước tính: ≈ ${S.fmtNum(e.usd, 3)} USD / lần (mẫu ${e.model} + tìm Google), cộng vào ngân sách AI` + (e.budget_cap_usd ? ` – tháng này đã dùng ${S.fmtNum(e.budget_spent_usd, 2)}/${S.fmtNum(e.budget_cap_usd, 0)} USD.` : '.'));
estBox.replaceChildren(box);
const run = K.button(st.res ? 'Tìm lại' : 'Tìm (Gemini + Google)', () => _o11(null), { kind: 'primary', testid: 'crn-run', icon: st.res ? 'refresh' : 'sparkle' });
run.appendChild(aiPaidBadge(K));
run.disabled = !(_o15 && e && e.enabled && !_or(e) && !st.busy);
acts.replaceChildren(run, manual('crn-manual'));
}
async function estimate() {
if (!_o15) { _ox(); return; }
const name = N.cleanName(_on.value) || 'du an';
try {
const _ou = await K.api(N.ACTION_NEW, { name: name.length >= N.MIN_Q ? name : 'du an moi', hints: hints(), estimate_only: true });
st.est = (_ou && _ou.estimate) || null;
} catch (e) {
if (e && e.code === 'UNKNOWN_ACTION') {
st.legacy = true;
try { const _ou = await K.api(R.ACTION, { prompt: G.researchPrompt({ name }), estimate_only: true }); st.est = (_ou && _ou.estimate) || null; } catch { st.est = null; }
} else st.estErr = 'Chưa tính được chi phí: ' + ((e && e.message) || 'lỗi');
}
if (!st.est && !st.estErr) st.estErr = 'Máy chủ không trả chi phí ước tính.';
_ox();
}
function _ob(e) {
const code = e && e.code, msg = (e && e.message) || 'lỗi';
if (code === 'AI_ERROR' && /khoá Gemini/i.test(msg)) return _op('crn-error');
if (code === 'QUOTA') return _o6(st.est, 'crn-error');
const _o19 = code === 'UNKNOWN_ACTION' ? 'Máy chủ chưa có chức năng tìm dự án mới – cập nhật máy chủ ở Cài đặt › Phiên bản (nhân viên: nhờ Quản trị). Trong lúc chờ, thêm dự án bằng tay.'
: code === 'FORBIDDEN' ? 'Chỉ Quản trị hoặc Quản lý dùng được AI tìm dự án.'
: 'Chưa tìm được: ' + msg + (code === 'NETWORK' ? ' (mạng chậm – thử lại).' : '');
return h('div', { class: 'g1-err sl-col', 'data-testid': 'crn-error' }, h('span', null, _o19), h('div', { class: 'sl-row' }, manual('crn-err-manual')));
}
async function _o11(pick) {
if (st.busy || !_o15) return;
const name = N.cleanName(_on.value);
if (name.length < N.MIN_Q) { K.toast('Nhập tên dự án (ít nhất 3 ký tự).', 'warn'); _on.focus(); return; }
if (st.legacy) { _oq.replaceChildren(_ob({ code: 'UNKNOWN_ACTION' })); return; }
const ok = await K.aiConfirm(N.FEATURE, { est: _oc(), testid: 'crn-cost', lead: `AI tìm thông tin dự án "${pick ? pick.name : name}" trên Google.` });
if (!ok) return;
st.busy = true; _ox();
_oq.replaceChildren(h('div', { class: 'sl-box sl-muted', 'data-testid': 'crn-busy' }, 'Gemini đang tìm trên Google…'));
const _o1c = _o1d();
const split = _o14();
const run = ++st.run;
st.res = null; st.struct = null; st.askedStruct = !!_o1c; st.structWait = false;
const _o17 = split ? K.api(N.ACTION_NEW, { name, hints: hints(), pick: pick || null, structure: _o1c, part: 'structure' }).catch(() => null) : null;
try {
const _ou = await K.api(N.ACTION_NEW, { name, hints: hints(), pick: pick || null, structure: split ? null : _o1c });
if (N.askChanged(name, _on.value)) {
st.res = null; st.run++;
_oq.replaceChildren(h('div', { class: 'g1-warn', 'data-testid': 'crn-stale' },
`Kết quả AI là cho tên cũ "${name}" nên đã bỏ (ô Tên đã đổi thành "${N.cleanName(_on.value)}"). Bấm tìm lại để tìm theo tên mới.`));
return;
}
st.res = _ou; st.query = _ou.query || { name, hints: hints(), pick: pick || null };
if (split && _o1c) st.query = { ...st.query, structure: _o1c };
st.rows = N.reviewRows(_ou); st.opened = new Set(); st.picks = N.prePicked(st.rows);
if (!split) st.struct = _o16(_ou, _o1c);
if (N.needPick(_ou, st.rows)) { st.run++; _ow(N.candidatesOf(_ou)); }
else if (!st.rows.length) { st.run++; renderNotFound(name); }
else {
st.structWait = !!_o17;
_oy();
if (_o17) _o17.then((sr) => {
if (run !== st.run || !st.res) return;
st.structWait = false; st.struct = sr ? _o16(sr, _o1c) : null;
_oz();
});
}
} catch (e) {
st.run++;
_oq.replaceChildren(_ob(e));
} finally { st.busy = false; _ox(); }
}
function _o16(_ou, _o1c) {
const sr = _o1c && _ou ? T.parseStructureLines(_ou.text, { sources: _ou.sources || [] }, { via: 'api', now: Date.now() }) : null;
return sr && !sr.noWeb && sr.kept ? sr : null;
}
function _ow(list) {
_oq.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'crn-cands' },
h('h3', null, `Có ${list.length} dự án khớp tên – chọn đúng dự án`),
h('div', { class: 'crn-cands' }, list.map((_o5, i) => h('div', { class: 'crn-cand sl-box', 'data-testid': 'crn-cand-' + i },
h('div', null, h('b', null, _o5.name), h('div', { class: 'sl-small sl-muted' }, [_o5.dev, _o5.loc].filter(Boolean).join(' · ') || '—'),
_o5.url ? h('a', { class: 'sl-small', href: _o5.url, target: '_blank', rel: 'noopener' }, G.hostOf(_o5.url) || 'nguồn') : null),
K.button('Chọn dự án này', () => { _on.value = _o5.name; if (_o5.dev && !_o9.value) _o9.value = _o5.dev; _o11({ name: _o5.name, dev: _o5.dev, loc: _o5.loc }); }, { kind: 'primary', testid: 'crn-pick-cand-' + i, icon: 'check' })))),
h('div', { class: 'sl-row' }, h('span', { class: 'sl-muted sl-small' }, 'Không có dự án đúng?'), manual('crn-cands-manual'))));
}
function renderNotFound(name) {
_oq.replaceChildren(h('div', { class: 'g1-warn sl-col', 'data-testid': 'crn-notfound' },
h('span', null, `AI không tìm thấy dự án "${name}" có nguồn đáng tin. Kiểm lại tên, thêm khu vực/chủ đầu tư rồi tìm lại, hoặc thêm bằng tay.`),
h('div', { class: 'sl-row' }, manual('crn-nf-manual'))));
}
const _o8 = () => st.rows.filter((d) => st.picks.has(d.field) && N.canPick(d, st.opened));
let _o12 = null, saveBox = null;
function _oy() {
const _ou = st.res;
_o12 = h('input', { class: 'sl-in', type: 'text', maxlength: 120, value: _ou.official_name || N.cleanName(_on.value), 'data-testid': 'crn-save-name' });
saveBox = h('div', { class: 'sl-row sl-end' });
const rows = st.rows.map((d) => {
const _od = d.fact, can = N.canPick(d, st.opened);
const _o7 = h('input', { type: 'checkbox', checked: st.picks.has(d.field) && can, disabled: !can, 'aria-label': 'Chọn lưu ' + d.label, 'data-testid': 'crn-pick-' + d.field,
onchange: (e) => { if (e.target.checked) st.picks.add(d.field); else st.picks.delete(d.field); _o10(); } });
const _oi = [...(_od.sources || []).slice(0, 3).map((s, i) => h('a', { href: s.url, target: '_blank', rel: 'noopener', 'data-testid': `crn-src-${d.field}-${i}` }, s.title || G.hostOf(s.url) || 'Nguồn')),
G.safeUrl(_od.url) && !(_od.sources || []).length ? h('a', { href: G.safeUrl(_od.url), target: '_blank', rel: 'noopener', 'data-testid': 'crn-ailink-' + d.field }, G.hostOf(_od.url) || _od.url) : null].filter(Boolean);
return h('tr', { 'data-testid': 'crn-row-' + d.field, 'data-status': _od.status },
h('td', null, R.pickBox(_o7)), h('td', null, h('b', null, d.label)),
h('td', { class: d.ok ? 'sl-ok' : '' }, d.new,
d.error ? h('div', { class: 'sl-bad sl-small' }, d.error + (_od.status === 'missing' ? ' – không lưu được' : '')) : null,
_ot(_od) ? h('div', { class: 'sl-small sl-muted' }, '“' + _ot(_od) + '”') : null),
h('td', null, h('span', { class: 'crn-lbl' }, 'Độ tin cậy:'), h('span', { class: 'crn-conf ' + d.conf, 'data-testid': 'crn-conf-' + d.field }, N.CONF_TXT[d.conf] || '—')),
h('td', { class: 'g1-src' }, R.stChip(_od.status, ST_TXT), h('div', { class: 'sl-col sl-small' }, _oi),
_od.date ? h('div', { class: 'sl-small sl-muted' }, 'Ngày nguồn ' + String(_od.date).split('-').reverse().join('/')) : null));
});
_oq.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'crn-result' },
h('h3', null, `AI tìm được ${st.rows.length} mục${_ou.cost_usd ? ` · ${S.fmtNum(_ou.cost_usd, 4)} USD` : ''}`),
(_ou.queries || []).length ? h('div', { class: 'sl-small sl-muted', 'data-testid': 'crn-queries' }, 'Đã tìm: ' + _ou.queries.join(' · ')) : null,
h('label', { class: 'sl-f' }, 'Tên dự án sẽ lưu', _o12),
_o18(st.struct),
h('div', { class: 'sl-scroll table-wrap' }, h('table', { class: 'sl-tbl g1-tbl g1-stack' },
h('thead', null, h('tr', null, h('th', null, 'Lưu'), h('th', null, 'Mục'), h('th', null, 'AI tìm được'), h('th', null, 'Tin cậy'), h('th', null, 'Nguồn'))), h('tbody', null, rows))),
h('p', { class: 'g1-legal' }, 'Bấm link để đọc nguồn trước khi lưu. Dòng không có link nguồn không lưu được. ' +
`Dự án lưu kèm nhãn "${N.AI_REVIEW_NOTE}" và danh sách nguồn.`),
saveBox));
_o10();
}
function _o18(sr) {
if (st.structWait) return h('p', { class: 'sl-small sl-muted', 'data-testid': 'crn-struct-wait' }, 'Đang tìm thêm phân khu / toà / trục…');
if (!sr) return st.askedStruct ? h('p', { class: 'sl-small sl-muted', 'data-testid': 'crn-struct-none' }, 'Phân khu / toà / trục: ' + T.NO_FOUND_TEXT + ' (lưu dự án xong, mở "🏗️ Phân khu · Toà · Trục" để nhập hoặc đọc ảnh layout).') : null;
const _o5 = T.structStats(sr.st);
return h('div', { class: 'sl-box sl-col', 'data-testid': 'crn-struct' },
h('b', null, `Cấu trúc dự án có nguồn: ${_o5.zones} phân khu · ${_o5.towers} toà · ${_o5.axes} trục`),
h('span', { class: 'sl-small sl-muted' }, `Lưu kèm dự án (chỉ ô có link nguồn${sr.dropped ? `; bỏ ${sr.dropped} dòng không có link` : ''}). Ô không có nguồn để trống chờ anh/chị nhập.`));
}
function _oz() { const _o1b = _o12 ? _o12.value : ''; _oy(); if (_o1b) _o12.value = _o1b; }
function _o10() {
if (!saveBox) return;
const _om = _o8().length;
const b = K.button(`Lưu dự án (${_om} mục)`, save, { kind: 'primary', testid: 'crn-save', icon: 'check' });
b.disabled = !_om || !_o15;
saveBox.replaceChildren(...kids(_om ? null : h('span', { class: 'sl-muted sl-small' }, 'Tick ít nhất 1 mục có nguồn, hoặc'), _om ? null : manual('crn-save-manual'), b));
}
async function save() {
const rows = _o8();
if (!rows.length || !_o15 || st.busy) return;
const name = N.cleanName(_o12.value);
if (name.length < 2) { K.toast('Nhập tên dự án.', 'warn'); _o12.focus(); return; }
st.busy = true;
try {
const env = await S.loadEnv(ctx);
const _oa = env.projects.find((p) => S.fold(N.displayName(p)) === S.fold(name));
if (_oa) { K.toast(`Đã có dự án "${N.displayName(_oa)}" – mở dự án đó và dùng "🔍 AI tìm thông tin" để cập nhật.`, 'warn'); return; }
const now = Date.now();
const _os = newProjectId(name, [...env.projects.map((p) => p.id), ...env.projectRows.map((x) => x.id)]);
const _ol = N.newProjectData(rows, { now, by: _o1a(ctx), query: st.query, area: (st.query && st.query.hints && st.query.hints.area) || '' });
const data = st.struct ? T.writeStructure(_ol.data, st.struct.st) : _ol.data;
const saved = _ol.saved;
await K.put('projects', { id: _os, name, dev: data.dev || '', data: JSON.stringify(data), deleted: 0 });
try { await K.put('audit', { at: now, action: 'catalog.research_new', object_id: _os, detail: JSON.stringify({ name, fields: saved, sources: data.ai_review.sources.length }) }); } catch { }
st.run++;
K.toast(`Đã tạo dự án ${name} (${saved.length} mục, ${N.AI_REVIEW_NOTE}).`, 'ok');
_ok.close();
try { if (opts.onSaved) await opts.onSaved(_os); } catch { }
} catch (e) {
K.toast('Chưa lưu được: ' + ((e && e.message) || 'lỗi'), 'error');
} finally { st.busy = false; }
}
_ox(); estimate();
return { close: () => _ok.close() };
}

import { h, kids } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as U from '../g1_lib/ui.js';
import * as R from './research.js';
import * as N from './research_new_logic.js';
import { newProjectId } from './upload_logic.js';
const _o4 = { grounded: 'Có nguồn Google', ai_only: 'Link AI ghi – mở kiểm', missing: 'Thiếu link nguồn' };
const _os = (_od) => String(_od.quote || '').replace(/^["“']+|["”']+$/g, '').trim();
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
'.crn-hint{font-size:.88em}.crn-lbl{display:none;font-size:.85em;margin-right:6px;color:var(--sl-muted,rgba(127,127,127,.95))}@media (max-width:600px){.crn-lbl{display:inline}}';
export function ensureCss() {
S.ensureSalesCss(); U.ensureCss();
if (typeof document === 'undefined' || ensureCss.done) return;
ensureCss.done = true;
try { const _o12 = new CSSStyleSheet(); _o12.replaceSync(_o1); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _o12]; }
catch { const _o13 = document.createElement('style'); _o13.textContent = _o1; document.head.appendChild(_o13); }
}
export const canAdd = (ctx) => R.canEditProjects(ctx);
const _o17 = (ctx) => (ctx && ctx.user && (ctx.user.id || ctx.user.username)) || '';
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
const _o15 = `Nhờ anh/chị thêm dự án "${name}" vào Bảng hàng giúp em.`;
return h('div', { class: 'sl-box sl-col crn-suggest', 'data-testid': 'catalog-suggest', 'data-staff': '0', role: 'status' },
h('div', { class: 'crn-sg-t' }, `Chưa có dự án "${name}" trong Bảng hàng.`),
h('p', { class: 'sl-muted sl-small' }, 'Anh/chị chưa được cấp quyền thêm dự án – nhờ Quản trị. Chép lời nhờ rồi gửi qua Zalo cho Quản trị.'),
h('div', { class: 'sl-row' }, K.button('Chép lời nhờ thêm dự án', async () => {
const ok = await K.copy(_o15);
K.toast(ok ? 'Đã chép – dán gửi Quản trị.' : 'Chưa chép được – nhắn Quản trị: ' + _o15, ok ? 'ok' : 'warn');
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
const _om = h('input', { class: 'sl-in', type: 'text', value: on.name || '', placeholder: 'Tên dự án, ví dụ: Khu căn hộ Ven Sông', 'aria-label': 'Tên dự án mới', 'data-testid': 'add-name', maxlength: 120 });
const _oe = (fn, needName) => {
const name = N.cleanName(_om.value);
if (needName && name.length < N.MIN_Q) { K.toast('Nhập tên dự án (ít nhất 3 ký tự) để AI tìm.', 'warn'); _om.focus(); return; }
_ok.close(); fn(name);
};
const ai = K.button('Để AI tìm thông tin dự án này', () => _oe(on.ai, true), { kind: 'primary', testid: 'add-ai', icon: 'sparkle' });
const body = h('div', { class: 'sl sl-col' },
h('label', { class: 'sl-f' }, 'Tên dự án', _om),
h('div', { class: 'crn-sg-t' }, ai, aiPaidBadge(K)),
h('p', { class: 'sl-muted sl-small' }, 'AI tìm trên Google chủ đầu tư, vị trí, giá, bàn giao, pháp lý… kèm link nguồn; anh/chị tick mục nào mới lưu mục đó.'),
h('div', { class: 'sl-row' },
K.button('Thêm tay', () => _oe(on.manual, false), { testid: 'add-manual', icon: 'plus' }),
on.file ? K.button('Thêm từ file', () => _oe(on.file, false), { testid: 'add-file', icon: 'inbox' }) : null));
const _ok = K.modal({ title: '+ Thêm dự án', body, testid: 'catalog-add-modal' });
try { _om.focus(); } catch { }
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
h('p', { class: 'sl-muted sl-small' }, 'Chính sách thanh toán nhập ở "📝 Cập nhật chính sách" của dự án (lưu nháp, duyệt rồi mới áp dụng).'),
err,
h('div', { class: 'sl-row sl-end' }, K.button('Lưu dự án', save, { kind: 'primary', testid: 'new-save', icon: 'check' })));
const _ok = K.modal({ title: '➕ Thêm dự án (nhập tay)', body, testid: 'project-new-modal' });
async function save() {
const _on = N.cleanName(name.value);
if (_on.length < 2) { err.textContent = 'Nhập tên dự án.'; name.focus(); return; }
const a = S.parseNum(_oj.value), b = S.parseNum(_of.value);
const price = isFinite(a) ? [a, isFinite(b) ? b : a] : null;
if (price && (price[0] <= 0 || price[1] < price[0])) { err.textContent = 'Giá thấp phải > 0 và không lớn hơn giá cao.'; return; }
const t = S.parseTypesText(types.value);
if (t.some((x) => !x.ask && (x.a[0] <= 0 || x.a[1] < x.a[0]))) { err.textContent = 'Diện tích loại căn chưa hợp lệ.'; return; }
const env = await S.loadEnv(ctx);
const _ob = env.projects.find((p) => S.fold(N.displayName(p)) === S.fold(_on));
if (_ob) { err.textContent = `Đã có dự án "${N.displayName(_ob)}" trong Bảng hàng – mở dự án đó để sửa.`; return; }
const _or = newProjectId(_on, [...env.projects.map((p) => p.id), ...env.projectRows.map((_ot) => _ot.id)]);
const data = { price, handover: _og.value || null, types: t, added: 'manual' };
for (const [k, el] of [['area', area], ['loc', loc], ['status', status]]) { const _o18 = String(el.value || '').trim(); if (_o18) data[k] = _o18; }
Object.assign(data, R.manualSources({}, { ...data, dev: dev.value.trim() || null }, ctx, ['dev', 'loc', 'price', 'handover', 'types']));
await K.put('projects', { id: _or, name: _on, dev: dev.value.trim(), data: JSON.stringify(data), deleted: 0 });
_ok.close(); K.toast('Đã thêm dự án ' + _on, 'ok');
try { if (opts.onSaved) await opts.onSaved(_or); } catch { }
}
try { (opts.name ? dev : name).focus(); } catch { }
return _ok;
}
export function openAiNew(K, ctx, opts = {}) {
ensureCss();
const _o14 = canAdd(ctx);
const _o13 = { est: null, estErr: '', legacy: false, busy: false, res: null, rows: [], picks: new Set(), opened: new Set(), query: null };
const _om = h('input', { class: 'sl-in', type: 'text', value: opts.name || '', maxlength: 120, 'data-testid': 'crn-name' });
const _o5 = h('input', { class: 'sl-in', type: 'text', maxlength: 80, placeholder: 'VD: Thủ Đức, TP.HCM', 'data-testid': 'crn-area' });
const _oa = h('input', { class: 'sl-in', type: 'text', maxlength: 120, placeholder: 'VD: tên chủ đầu tư', 'data-testid': 'crn-dev' });
const estBox = h('div', { class: 'sl-col', 'aria-live': 'polite', 'data-testid': 'crn-estimate' });
const acts = h('div', { class: 'sl-row' });
const _op = h('div', { class: 'sl-col', 'aria-live': 'polite' });
const _ok = K.modal({ title: '✨ AI tìm dự án mới', wide: true, testid: 'catalog-research-new', body: h('div', { class: 'sl g1' },
h('p', { class: 'g1-lead' }, 'Gemini tìm trên Google thông tin dự án chưa có trong Bảng hàng. Mỗi thông tin kèm link nguồn và độ tin cậy; anh/chị tick mục muốn lưu.'),
K.aiNote ? K.aiNote(N.FEATURE) : null,
h('div', { class: 'sl-form' },
h('label', { class: 'sl-f' }, 'Tên dự án', _om),
h('label', { class: 'sl-f' }, 'Khu vực / tỉnh (không bắt buộc)', _o5),
h('label', { class: 'sl-f' }, 'Chủ đầu tư (không bắt buộc)', _oa)),
h('p', { class: 'sl-muted crn-hint' }, 'Gợi ý khu vực, chủ đầu tư giúp AI phân biệt các dự án trùng tên.'),
estBox, acts, _op) });
const manual = (testid) => K.button('Thêm tay', () => { _ok.close(); if (opts.onManual) opts.onManual(N.cleanName(_om.value) || opts.name || ''); }, { testid, icon: 'plus' });
const hints = () => ({ area: N.cleanName(_o5.value).slice(0, 80), dev: N.cleanName(_oa.value).slice(0, 120) });
const _oq = (e) => !!(e && !e.free && Number(e.budget_cap_usd) > 0 && Number(e.budget_spent_usd) + Number(e.usd) > Number(e.budget_cap_usd));
function _oo(testid = 'crn-nokey') {
return h('div', { class: 'g1-warn sl-col', 'data-testid': testid },
h('span', null, 'Chưa có khoá Gemini trên máy chủ nên AI chưa tìm được. Dán khoá ở Cài đặt › Kết nối › Gemini (nhân viên: nhờ Quản trị) (khoá miễn phí trong hạn mức của Google), hoặc thêm dự án bằng tay.'),
h('div', { class: 'sl-row' }, K.button('Mở Kết nối › Gemini', () => { _ok.close(); K.nav(_o2); }, { kind: 'primary', testid: 'crn-open-gemini', icon: 'link' }), manual('crn-nokey-manual')));
}
function _o7(e, testid = 'crn-over') {
return h('div', { class: 'g1-warn sl-col', 'data-testid': testid },
h('span', null, `Lần tìm này (≈ ${S.fmtNum(Number(e && e.usd) || 0, 3)} USD) sẽ vượt trần ngân sách AI tháng` +
(e && e.budget_cap_usd ? ` (đã dùng ${S.fmtNum(e.budget_spent_usd, 2)}/${S.fmtNum(e.budget_cap_usd, 0)} USD)` : '') + '. Nâng trần ở Cài đặt › Ngân sách (nhân viên: nhờ Quản trị) hoặc thêm dự án bằng tay.'),
h('div', { class: 'sl-row' }, manual('crn-over-manual')));
}
function _ov() {
const e = _o13.est;
let _o6;
if (!_o14) _o6 = h('div', { class: 'g1-warn', 'data-testid': 'crn-est-text' }, 'Chỉ Quản trị hoặc Quản lý dùng được AI tìm dự án.');
else if (_o13.estErr) _o6 = h('div', { class: 'g1-err', 'data-testid': 'crn-est-text' }, _o13.estErr);
else if (!e) _o6 = h('div', { class: 'sl-muted', 'data-testid': 'crn-est-text' }, 'Đang tính chi phí ước tính…');
else if (!e.enabled) _o6 = _oo();
else if (_oq(e)) _o6 = _o7(e);
else _o6 = h('div', { class: 'g1-okbox', 'data-testid': 'crn-est-text' }, e.free
? `Chi phí ước tính: 0 USD – trong hạn mức miễn phí của khoá Gemini (mẫu ${e.model}, có tìm Google).`
: `Chi phí ước tính: ≈ ${S.fmtNum(e.usd, 3)} USD / lần (mẫu ${e.model} + tìm Google), cộng vào ngân sách AI` + (e.budget_cap_usd ? ` – tháng này đã dùng ${S.fmtNum(e.budget_spent_usd, 2)}/${S.fmtNum(e.budget_cap_usd, 0)} USD.` : '.'));
estBox.replaceChildren(_o6);
const _oz = K.button(_o13.res ? 'Tìm lại' : 'Tìm (Gemini + Google)', () => _o10(null), { kind: 'primary', testid: 'crn-run', icon: _o13.res ? 'refresh' : 'sparkle' });
_oz.appendChild(aiPaidBadge(K));
_oz.disabled = !(_o14 && e && e.enabled && !_oq(e) && !_o13.busy);
acts.replaceChildren(_oz, manual('crn-manual'));
}
async function estimate() {
if (!_o14) { _ov(); return; }
const name = N.cleanName(_om.value) || 'du an';
try {
const _ot = await K.api(N.ACTION_NEW, { name: name.length >= N.MIN_Q ? name : 'du an moi', hints: hints(), estimate_only: true });
_o13.est = (_ot && _ot.estimate) || null;
} catch (e) {
if (e && e.code === 'UNKNOWN_ACTION') {
_o13.legacy = true;
try { const _ot = await K.api(R.ACTION, { prompt: G.researchPrompt({ name }), estimate_only: true }); _o13.est = (_ot && _ot.estimate) || null; } catch { _o13.est = null; }
} else _o13.estErr = 'Chưa tính được chi phí: ' + ((e && e.message) || 'lỗi');
}
if (!_o13.est && !_o13.estErr) _o13.estErr = 'Máy chủ không trả chi phí ước tính.';
_ov();
}
function _oc(e) {
const code = e && e.code, msg = (e && e.message) || 'lỗi';
if (code === 'AI_ERROR' && /khoá Gemini/i.test(msg)) return _oo('crn-error');
if (code === 'QUOTA') return _o7(_o13.est, 'crn-error');
const _o16 = code === 'UNKNOWN_ACTION' ? 'Máy chủ chưa có chức năng tìm dự án mới – cập nhật máy chủ ở Cài đặt › Phiên bản (nhân viên: nhờ Quản trị). Trong lúc chờ, thêm dự án bằng tay.'
: code === 'FORBIDDEN' ? 'Chỉ Quản trị hoặc Quản lý dùng được AI tìm dự án.'
: 'Chưa tìm được: ' + msg + (code === 'NETWORK' ? ' (mạng chậm – thử lại).' : '');
return h('div', { class: 'g1-err sl-col', 'data-testid': 'crn-error' }, h('span', null, _o16), h('div', { class: 'sl-row' }, manual('crn-err-manual')));
}
async function _o10(pick) {
if (_o13.busy || !_o14) return;
const name = N.cleanName(_om.value);
if (name.length < N.MIN_Q) { K.toast('Nhập tên dự án (ít nhất 3 ký tự).', 'warn'); _om.focus(); return; }
if (_o13.legacy) { _op.replaceChildren(_oc({ code: 'UNKNOWN_ACTION' })); return; }
const ok = await K.aiConfirm(N.FEATURE, { est: _o13.est, testid: 'crn-cost', lead: `AI tìm thông tin dự án "${pick ? pick.name : name}" trên Google.` });
if (!ok) return;
_o13.busy = true; _ov();
_op.replaceChildren(h('div', { class: 'sl-box sl-muted', 'data-testid': 'crn-busy' }, 'Gemini đang tìm trên Google…'));
try {
const _ot = await K.api(N.ACTION_NEW, { name, hints: hints(), pick: pick || null });
if (N.askChanged(name, _om.value)) {
_o13.res = null;
_op.replaceChildren(h('div', { class: 'g1-warn', 'data-testid': 'crn-stale' },
`Kết quả AI là cho tên cũ "${name}" nên đã bỏ (ô Tên đã đổi thành "${N.cleanName(_om.value)}"). Bấm tìm lại để tìm theo tên mới.`));
return;
}
_o13.res = _ot; _o13.query = _ot.query || { name, hints: hints(), pick: pick || null };
_o13.rows = N.reviewRows(_ot); _o13.opened = new Set(); _o13.picks = N.prePicked(_o13.rows);
if (N.needPick(_ot, _o13.rows)) _ou(N.candidatesOf(_ot));
else if (!_o13.rows.length) renderNotFound(name);
else _ow();
} catch (e) {
_op.replaceChildren(_oc(e));
} finally { _o13.busy = false; _ov(); }
}
function _ou(list) {
_op.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'crn-cands' },
h('h3', null, `Có ${list.length} dự án khớp tên – chọn đúng dự án`),
h('div', { class: 'crn-cands' }, list.map((c, i) => h('div', { class: 'crn-cand sl-box', 'data-testid': 'crn-cand-' + i },
h('div', null, h('b', null, c.name), h('div', { class: 'sl-small sl-muted' }, [c.dev, c.loc].filter(Boolean).join(' · ') || '—'),
c.url ? h('a', { class: 'sl-small', href: c.url, target: '_blank', rel: 'noopener' }, G.hostOf(c.url) || 'nguồn') : null),
K.button('Chọn dự án này', () => { _om.value = c.name; if (c.dev && !_oa.value) _oa.value = c.dev; _o10({ name: c.name, dev: c.dev, loc: c.loc }); }, { kind: 'primary', testid: 'crn-pick-cand-' + i, icon: 'check' })))),
h('div', { class: 'sl-row' }, h('span', { class: 'sl-muted sl-small' }, 'Không có dự án đúng?'), manual('crn-cands-manual'))));
}
function renderNotFound(name) {
_op.replaceChildren(h('div', { class: 'g1-warn sl-col', 'data-testid': 'crn-notfound' },
h('span', null, `AI không tìm thấy dự án "${name}" có nguồn đáng tin. Kiểm lại tên, thêm khu vực/chủ đầu tư rồi tìm lại, hoặc thêm bằng tay.`),
h('div', { class: 'sl-row' }, manual('crn-nf-manual'))));
}
const _o9 = () => _o13.rows.filter((d) => _o13.picks.has(d.field) && N.canPick(d, _o13.opened));
let _o11 = null, saveBox = null;
function _ow() {
const _ot = _o13.res;
_o11 = h('input', { class: 'sl-in', type: 'text', maxlength: 120, value: _ot.official_name || N.cleanName(_om.value), 'data-testid': 'crn-save-name' });
saveBox = h('div', { class: 'sl-row sl-end' });
const rows = _o13.rows.map((d) => {
const _od = d.fact, can = N.canPick(d, _o13.opened);
const _o8 = h('input', { type: 'checkbox', checked: _o13.picks.has(d.field) && can, disabled: !can, 'aria-label': 'Chọn lưu ' + d.label, 'data-testid': 'crn-pick-' + d.field,
onchange: (e) => { if (e.target.checked) _o13.picks.add(d.field); else _o13.picks.delete(d.field); _oy(); } });
const _oi = [...(_od.sources || []).slice(0, 3).map((s, i) => h('a', { href: s.url, target: '_blank', rel: 'noopener', 'data-testid': `crn-src-${d.field}-${i}` }, s.title || G.hostOf(s.url) || 'Nguồn Google')),
G.safeUrl(_od.url) ? h('a', { href: G.safeUrl(_od.url), target: '_blank', rel: 'noopener', 'data-testid': 'crn-ailink-' + d.field,
onclick: () => { if (!_o13.opened.has(d.field)) { _o13.opened.add(d.field); setTimeout(_ox, 50); } } }, (_od.sources || []).length ? 'Link AI ghi' : G.hostOf(_od.url) || _od.url) : null].filter(Boolean);
return h('tr', { 'data-testid': 'crn-row-' + d.field, 'data-status': _od.status },
h('td', null, _o8), h('td', null, h('b', null, d.label)),
h('td', { class: d.ok ? 'sl-ok' : '' }, d.new,
d.error ? h('div', { class: 'sl-bad sl-small' }, d.error + (_od.status === 'missing' ? ' – không lưu được' : '')) : null,
_os(_od) ? h('div', { class: 'sl-small sl-muted' }, '“' + _os(_od) + '”') : null),
h('td', null, h('span', { class: 'crn-lbl' }, 'Độ tin cậy:'), h('span', { class: 'crn-conf ' + d.conf, 'data-testid': 'crn-conf-' + d.field }, N.CONF_TXT[d.conf] || '—')),
h('td', { class: 'g1-src' }, h('span', { class: 'g1-st ' + _od.status }, _o4[_od.status]), h('div', { class: 'sl-col sl-small' }, _oi),
_od.date ? h('div', { class: 'sl-small sl-muted' }, 'Ngày nguồn ' + String(_od.date).split('-').reverse().join('/')) : null));
});
_op.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'crn-result' },
h('h3', null, `AI tìm được ${_o13.rows.length} mục${_ot.cost_usd ? ` · ${S.fmtNum(_ot.cost_usd, 4)} USD` : ''}`),
(_ot.queries || []).length ? h('div', { class: 'sl-small sl-muted', 'data-testid': 'crn-queries' }, 'Đã tìm: ' + _ot.queries.join(' · ')) : null,
h('label', { class: 'sl-f' }, 'Tên dự án sẽ lưu', _o11),
h('div', { class: 'sl-scroll table-wrap' }, h('table', { class: 'sl-tbl g1-tbl g1-stack' },
h('thead', null, h('tr', null, h('th', null, 'Lưu'), h('th', null, 'Mục'), h('th', null, 'AI tìm được'), h('th', null, 'Tin cậy'), h('th', null, 'Nguồn'))), h('tbody', null, rows))),
h('p', { class: 'g1-legal' }, '"Link AI ghi": tên miền không nằm trong kết quả Google – bấm mở link, đọc đúng nội dung rồi mới tick. Dòng không có link nguồn không lưu được. ' +
`Dự án lưu kèm nhãn "${N.AI_REVIEW_NOTE}" và danh sách nguồn. Chính sách thanh toán không lấy từ AI tìm – nhập ở "Cập nhật chính sách" (lưu nháp, duyệt rồi mới áp dụng).`),
saveBox));
_oy();
}
function _ox() { const _o18 = _o11 ? _o11.value : ''; _ow(); if (_o18) _o11.value = _o18; }
function _oy() {
if (!saveBox) return;
const _ol = _o9().length;
const b = K.button(`Lưu dự án (${_ol} mục)`, save, { kind: 'primary', testid: 'crn-save', icon: 'check' });
b.disabled = !_ol || !_o14;
saveBox.replaceChildren(...kids(_ol ? null : h('span', { class: 'sl-muted sl-small' }, 'Tick ít nhất 1 mục có nguồn, hoặc'), _ol ? null : manual('crn-save-manual'), b));
}
async function save() {
const rows = _o9();
if (!rows.length || !_o14 || _o13.busy) return;
const name = N.cleanName(_o11.value);
if (name.length < 2) { K.toast('Nhập tên dự án.', 'warn'); _o11.focus(); return; }
_o13.busy = true;
try {
const env = await S.loadEnv(ctx);
const _ob = env.projects.find((p) => S.fold(N.displayName(p)) === S.fold(name));
if (_ob) { K.toast(`Đã có dự án "${N.displayName(_ob)}" – mở dự án đó và dùng "🔍 AI tìm thông tin" để cập nhật.`, 'warn'); return; }
const now = Date.now();
const _or = newProjectId(name, [...env.projects.map((p) => p.id), ...env.projectRows.map((x) => x.id)]);
const { data, saved } = N.newProjectData(rows, { now, by: _o17(ctx), query: _o13.query, area: (_o13.query && _o13.query.hints && _o13.query.hints.area) || '' });
await K.put('projects', { id: _or, name, dev: data.dev || '', data: JSON.stringify(data), deleted: 0 });
try { await K.put('audit', { at: now, action: 'catalog.research_new', object_id: _or, detail: JSON.stringify({ name, fields: saved, sources: data.ai_review.sources.length }) }); } catch { }
K.toast(`Đã tạo dự án ${name} (${saved.length} mục, ${N.AI_REVIEW_NOTE}).`, 'ok');
_ok.close();
try { if (opts.onSaved) await opts.onSaved(_or); } catch { }
} catch (e) {
K.toast('Chưa lưu được: ' + ((e && e.message) || 'lỗi'), 'error');
} finally { _o13.busy = false; }
}
_ov(); estimate();
return { close: () => _ok.close() };
}

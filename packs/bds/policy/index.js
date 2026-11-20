import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
const _oc = (x) => JSON.parse(JSON.stringify(x));
const _o7 = (i) => ({ name: 'Đợt ' + (i + 1), pct: NaN, at: i ? null : 0, mo: i ? null : 0, bank: false, when: '' });
const _o6 = (i) => ({ id: 'pa' + (i + 1) + '-' + Date.now().toString(36).slice(-3), name: '', sub: '', factor: 1, loan: 0, htls: 0, steps: [_o7(0)] });
const _o4 = (at) => at == null ? '' : at === 'H' ? 'H' : String(at).replace('.', ',');
const _o1 = { active: 'Đã duyệt', draft: 'Nháp' };
async function _oi(file) {
const _ox = await new Promise((res, rej) => { const _ow = new FileReader(); _ow.onload = () => res(_ow.result); _ow.onerror = rej; _ow.readAsDataURL(file); });
const _o5 = String(_ox).split(',')[1] || '';
if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) return { mime: 'application/pdf', b64: _o5 };
try {
const _o8 = await createImageBitmap(file);
const k = Math.min(1, 1600 / Math.max(_o8.width, _o8.height));
const _oa = document.createElement('canvas');
_oa.width = Math.round(_o8.width * k); _oa.height = Math.round(_o8.height * k);
_oa.getContext('2d').drawImage(_o8, 0, 0, _oa.width, _oa.height);
return { mime: 'image/jpeg', b64: _oa.toDataURL('image/jpeg', 0.85).split(',')[1] };
} catch { return { mime: file.type || 'image/jpeg', b64: _o5 }; }
}
export async function mount(el, ctx) {
S.ensureSalesCss();
const _o0 = kit(ctx);
let env = await S.loadEnv(ctx);
const _ov = S.hashParams();
const _ou = (ctx.user && ctx.user.perms && ctx.user.perms.policy) || 'approve';
const _ob = _ou !== 'view', canApprove = _ou === 'approve';
const _o1a = { project: _ov.get('project') || (env.projects.find(S.sellable) || env.projects[0] || {}).id, draft: null, draftId: null, source: 'manual', effective: env.today, note: '', aiErrors: [] };
const _or = _ov.get('draft') || _ov.get('id');
if (_or && _ob) { const _od = env.policies.find((_os) => _os.id === _or); if (_od) { _o1a.project = _od.project_id; _on(_od); } }
const _o15 = h('div', { class: 'sl', 'data-testid': 'policy' });
el.innerHTML = '';
el.appendChild(_o15);
const head = h('div', { class: 'sl-col' });
const editor = h('div', { class: 'sl-col', 'data-testid': 'policy-editor' });
const checks = h('div', { class: 'sl-col' });
const _oj = h('div', { class: 'sl-col' });
_o15.append(h('h2', null, 'Cập nhật chính sách'), head, editor, checks, _oj);
function project() { return env.project(_o1a.project); }
function current() { const _os = project(); return _os ? env.plansFor(_os) : { plans: [], policy: null }; }
function _on(_o16) {
_o1a.draft = S.parsePlans(_o16.plans);
_o1a.draftId = _o16.status === 'draft' ? _o16.id : null;
_o1a.source = _o16.source || 'manual';
_o1a.effective = _o16.effective_from || env.today;
_o1a.note = _o16.note || '';
}
function _o13() {
const _os = project(), { plans, policy } = current();
head.replaceChildren(
h('div', { class: 'sl-box sl-col' },
h('label', { class: 'sl-f' }, 'Dự án', _o0.select(env.projects.map((x) => [x.id, `${x.name} · ${x.dev || ''}`]), _o1a.project, {
'data-testid': 'policy-project', onchange: (e) => { _o1a.project = e.target.value; _o1a.draft = null; _o1a.draftId = null; _o1a.aiErrors = []; _o10(); },
})),
_os ? h('div', { class: 'sl-muted' }, `Đang áp dụng: ${S.policyLabel(policy)}${policy ? '' : ' (chính sách mặc định)'} · ${plans.length} phương án`) : null,
!_ob ? h('p', { class: 'sl-muted', 'data-testid': 'policy-readonly' }, 'Anh/chị xem được chính sách đang áp dụng và lịch sử. Việc cập nhật chính sách do Quản trị (Admin) hoặc Quản lý làm – cần đổi thì nhờ họ.') : null,
!_ob ? null : h('div', { class: 'sl-tabs' },
_o0.button('✍️ Gõ tay', () => { _o1a.draft = _oc(plans.length ? plans : [_o6(0)]); _o1a.source = 'manual'; _o1a.draftId = null; _o1a.aiErrors = []; _o10(); }, { testid: 'policy-manual' }),
_o0.button('📷 Ảnh/PDF phiếu tính giá', () => _oh.click(), { testid: 'policy-ai-file', ai: 'policy_read' }),
_o0.button('🤖 Làm bằng Claude/Gemini', handoff, { testid: 'policy-handoff', aiBadge: 'handoff' }),
_o0.button('📋 Dán kết quả AI', () => _ot(), { kind: 'ghost', testid: 'policy-paste' }))));
}
const _oh = h('input', { type: 'file', accept: 'image/*,application/pdf', multiple: true, hidden: true, 'data-testid': 'policy-file', onchange: (e) => _oy([...e.target.files]) });
_o15.appendChild(_oh);
async function _oy(files) {
if (!files.length) return;
const _os = project();
if (!ctx.ai || typeof ctx.ai.run !== 'function') { _o0.toast('Chưa bật AI. Dùng "Làm bằng Claude/Gemini" rồi dán kết quả về.', 'warn'); return; }
_o0.toast('Đang đọc phiếu…', 'info');
try {
const images = [];
for (const _og of files.slice(0, 6)) images.push(await _oi(_og));
const _ow = await ctx.ai.run('read_policy', { images, json: true, prompt: S.readPolicyPrompt(_os), feature: 'policy_read' });
_o1g(_ow && (_ow.text ?? _ow), 'ai');
} catch (e) {
if (_o0.isAiCancel(e)) return;
_o0.toast('Chưa đọc được phiếu: ' + ((e && e.message) || 'lỗi AI') + '. Thử "Làm bằng Claude/Gemini".', 'error');
} finally { _oh.value = ''; }
}
async function handoff() {
const prompt = S.readPolicyPrompt(project()) + '\n\n(Đính kèm ảnh/PDF phiếu tính giá vào khung chat.)';
if (ctx.ai && typeof ctx.ai.handoff === 'function') {
try { const text = await ctx.ai.handoff('read_policy', prompt); if (text) _o1g(text, 'ai'); return; } catch { }
}
await _o0.copy(prompt);
_o0.toast('Đã chép lời nhắn. Dán vào Claude/Gemini cùng ảnh phiếu, rồi chép nguyên câu trả lời của AI dán về đây.', 'info');
_ot();
}
function _ot() {
const _o1d = h('textarea', { rows: 10, 'data-testid': 'policy-json', placeholder: '{"plans":[…]}' });
const _oo = _o0.modal({ title: 'Dán kết quả AI – chính sách', testid: 'policy-json-modal', body: [_o1d, h('div', { class: 'sl-row sl-end' },
_o0.button('Dùng kết quả này', () => { if (_o1g(_o1d.value, 'ai')) _oo.close(); }, { kind: 'primary', testid: 'policy-json-use' }))] });
}
function _o1g(text, source) {
const _ow = S.normalizePlans(text);
if (!_ow.plans.length) { _o0.toast(_ow.errors[0] || 'Kết quả chưa đúng mẫu – chép lại nguyên câu trả lời của AI rồi dán.', 'error'); return false; }
_o1a.draft = _ow.plans; _o1a.source = source; _o1a.draftId = null; _o1a.aiErrors = _ow.errors;
_o10();
_o0.toast(`Đã nạp ${_ow.plans.length} phương án – kiểm tra kỹ trước khi Duyệt.`, 'ok');
return true;
}
function _o12() {
if (!_o1a.draft) { editor.replaceChildren(); return; }
const _o1f = (fn) => (e) => { fn(e.target); _o11(); _oz(); };
const _o1c = [];
function _oz() { _o1a.draft.forEach((pl, i) => { if (_o1c[i]) { const _o17 = S.pctSum(pl); _o1c[i].textContent = `Tổng: ${S.fmtNum(_o17)}%`; _o1c[i].className = Math.abs(_o17 - 100) <= 0.01 ? 'sl-ok' : 'sl-bad'; } }); _op(); }
function _op() {
const _ol = _om().mine;
editor.querySelectorAll('[data-k]').forEach((inp) => {
const [pi, field, si] = inp.dataset.k.split(':');
const _ok = _ol.filter((i) => i.plan === Number(pi) && i.field === field && (si === '' || si === undefined ? i.step === undefined : i.step === Number(si)));
inp.classList.toggle('sl-err', _ok.some((i) => i.level === 'error'));
inp.classList.toggle('sl-warn', !_ok.some((i) => i.level === 'error') && _ok.length > 0);
});
}
const cards = _o1a.draft.map((pl, pi) => {
const sum = h('b');
_o1c[pi] = sum;
const _o1b = pl.steps.map((_o17, si) => h('tr', null,
h('td', null, h('input', { value: _o17.name, 'aria-label': 'Tên đợt', 'data-k': `${pi}:name:${si}`, oninput: _o1f((t) => { _o17.name = t.value; }) })),
h('td', { class: 'w-pct' }, h('input', { value: isFinite(_o17.pct) ? S.fmtNum(_o17.pct, 4) : '', inputmode: 'decimal', 'aria-label': 'Tỷ lệ %', 'data-testid': `step-pct-${pi}-${si}`, 'data-k': `${pi}:pct:${si}`, oninput: _o1f((t) => { _o17.pct = S.parseNum(t.value); }) })),
h('td', { class: 'w-at' }, h('input', { value: _o4(_o17.at), placeholder: '0 · 3 · HD · HD+1 · H', 'aria-label': 'Mốc', 'data-k': `${pi}:at:${si}`, oninput: _o1f((t) => { _o17.at = S.parseAt(t.value.trim()); _o17.mo = S.atToMo(_o17.at); }) })),
h('td', { class: 'w-x' }, h('input', { type: 'checkbox', checked: !!_o17.bank, 'aria-label': 'Ngân hàng giải ngân', title: 'Ngân hàng giải ngân', onchange: _o1f((t) => { _o17.bank = t.checked; }) })),
h('td', { class: 'w-x' }, h('button', { type: 'button', class: 'sl-btn', 'aria-label': 'Xoá đợt', onclick: () => { pl.steps.splice(si, 1); _o10(); } }, '✕'))));
const card = h('div', { class: 'sl-box sl-col', 'data-testid': 'plan-' + pi },
h('div', { class: 'sl-row sl-sp' }, h('h3', null, `Phương án ${pi + 1}`), h('div', { class: 'sl-row' }, sum,
h('button', { type: 'button', class: 'sl-btn', onclick: () => { _o1a.draft.splice(pi, 1); _o10(); } }, 'Xoá phương án'))),
h('div', { class: 'sl-form' },
h('label', { class: 'sl-f' }, 'Tên', h('input', { value: pl.name, 'data-testid': `plan-name-${pi}`, 'data-k': `${pi}:name:`, oninput: _o1f((t) => { pl.name = t.value; }) })),
h('label', { class: 'sl-f' }, 'Mô tả', h('input', { value: pl.sub || '', oninput: _o1f((t) => { pl.sub = t.value; }) })),
h('label', { class: 'sl-f' }, 'Chiết khấu (%)', h('input', { value: S.fmtNum((1 - pl.factor) * 100, 3), inputmode: 'decimal', 'data-k': `${pi}:factor:`, oninput: _o1f((t) => { const _od = S.parseNum(t.value); pl.factor = isFinite(_od) ? Math.round((1 - _od / 100) * 1e6) / 1e6 : NaN; }) })),
h('label', { class: 'sl-f' }, 'Vay (% tổng giá)', h('input', { value: S.fmtNum((pl.loan || 0) * 100, 2), inputmode: 'decimal', 'data-k': `${pi}:loan:`, oninput: _o1f((t) => { const _o1h = S.parseNum(t.value); pl.loan = isFinite(_o1h) ? _o1h / 100 : 0; }) })),
h('label', { class: 'sl-f' }, 'Hỗ trợ lãi (tháng / "H")', h('input', { value: pl.htls === 'HANDOVER' || pl.htls === 'H' ? 'H' : (pl.htls || ''), oninput: _o1f((t) => { const _o2 = S.parseAt(t.value.trim()); pl.htls = _o2 === 'H' ? 'HANDOVER' : (Number(_o2) || 0); }) }))),
h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl sl-steps' },
h('thead', null, h('tr', null, h('th', null, 'Đợt'), h('th', null, '%'), h('th', null, 'Mốc'), h('th', null, 'NH'), h('th', null, ''))),
h('tbody', null, _o1b))),
h('div', null, h('button', { type: 'button', class: 'sl-btn', 'data-testid': `add-step-${pi}`, onclick: () => { pl.steps.push(_o7(pl.steps.length)); _o10(); } }, '+ Thêm đợt')));
return card;
});
editor.replaceChildren(
h('div', { class: 'sl-row sl-sp' }, h('h3', null, `Bản nháp (${_o1a.source === 'ai' ? 'AI đọc – cần soát' : 'gõ tay'})`),
h('button', { type: 'button', class: 'sl-btn', onclick: () => { _o1a.draft.push(_o6(_o1a.draft.length)); _o10(); } }, '+ Thêm phương án')),
h('p', { class: 'sl-muted sl-small' }, 'Mốc: 0 = khi ký thoả thuận; số = số tháng sau khi ký; HD = ký HĐMB; HD+1 = 1 tháng sau HĐMB; H = bàn giao. NH = ngân hàng giải ngân.'),
...cards);
_oz();
}
function _om() {
const mine = S.checkPlans(_o1a.draft || [], { months: project() ? S.projectMonths(project()) : undefined });
let _o1e = { errors: [], warnings: [] };
try { if (env.L && env.L.policy && env.L.policy.validate) _o1e = env.L.policy.validate(S.toStorePlans(_o1a.draft || [])) || _o1e; } catch (e) { _o1e = { errors: [], warnings: ['Không chạy được kiểm tra BDSLogic: ' + (e && e.message)] }; }
const name = (i) => i.plan >= 0 && _o1a.draft[i.plan] ? `${_o1a.draft[i.plan].name || 'Phương án ' + (i.plan + 1)}: ` : '';
const errors = [...mine.filter((i) => i.level === 'error').map((i) => name(i) + i.msg), ...(_o1e.errors || [])];
const warnings = [...mine.filter((i) => i.level === 'warn').map((i) => name(i) + i.msg), ...(_o1e.warnings || [])];
return { mine, errors: [...new Set(errors)], warnings: [...new Set(warnings)] };
}
function _o11() {
if (!_o1a.draft) { checks.replaceChildren(); return; }
const _ol = _om(), blocked = _ol.errors.length > 0;
const { plans: oldPlans, policy } = current();
let _oe = [];
try { if (env.L && env.L.policy && env.L.policy.diff) _oe = env.L.policy.diff(S.toStorePlans(oldPlans), S.toStorePlans(_o1a.draft)).map((_od) => ({ text: _od.text || `${_od.label}: ${_od.old} → ${_od.new}` })); }
catch { _oe = []; }
if (!_oe.length) _oe = S.diffPlans(oldPlans, _o1a.draft).map((_od) => ({ text: `${_od.plan} – ${_od.label}: ${_od.old || '—'} → ${_od.new || '—'}` }));
const _of = h('input', { type: 'date', value: _o1a.effective, 'data-testid': 'policy-effective', onchange: (e) => { _o1a.effective = e.target.value; } });
const note = h('input', { value: _o1a.note, placeholder: 'Ghi chú (nguồn, đợt mở bán…)', oninput: (e) => { _o1a.note = e.target.value; } });
const _o3 = _o0.button('✅ Duyệt', () => _o18('active'), { kind: 'primary', testid: 'policy-approve' });
_o3.disabled = blocked || !canApprove;
if (!canApprove) _o3.title = 'Chỉ Quản trị (Admin) được duyệt – anh/chị bấm "Lưu nháp", Quản trị sẽ thấy ở mục Chờ duyệt';
else if (blocked) _o3.title = 'Sửa hết lỗi đỏ trước khi Duyệt';
checks.replaceChildren(
h('div', { class: 'sl-box sl-col', 'data-testid': 'policy-checks' },
h('h3', null, 'Kiểm tra'),
_o1a.aiErrors.length ? h('ul', { class: 'sl-issues' }, _o1a.aiErrors.map((t) => h('li', { class: 'w' }, 'Đọc phiếu: ' + t))) : null,
_ol.errors.length || _ol.warnings.length
? h('ul', { class: 'sl-issues', 'data-testid': 'policy-issues' }, _ol.errors.map((t) => h('li', { class: 'e' }, '⛔ ' + t)), _ol.warnings.map((t) => h('li', { class: 'w' }, '⚠️ ' + t)))
: h('p', { class: 'sl-ok' }, 'Đã đối chiếu: mỗi phương án đủ 100%, hệ số và tỷ lệ vay hợp lệ.'),
h('h3', null, `CŨ → MỚI (so với ${S.policyLabel(policy).toLowerCase()})`),
_oe.length ? h('ul', { class: 'sl-issues', 'data-testid': 'policy-diff' }, _oe.map((_od) => h('li', null, _od.text))) : h('p', { class: 'sl-muted' }, 'Không có thay đổi.'),
h('div', { class: 'sl-form' }, h('label', { class: 'sl-f' }, 'Ngày hiệu lực', _of), h('label', { class: 'sl-f' }, 'Ghi chú', note)),
h('div', { class: 'sl-row sl-end' },
_o0.button('Huỷ bản nháp', () => { _o1a.draft = null; _o1a.draftId = null; _o10(); }, { kind: 'ghost' }),
_o0.button('💾 Lưu nháp', () => _o18('draft'), { testid: 'policy-save-draft' }),
_o3)));
}
async function _o18(status) {
const _os = project();
if (!_os || !_o1a.draft) return;
if (status === 'active' && _om().errors.length) { _o0.toast('Còn lỗi đỏ – chưa Duyệt được.', 'error'); _o11(); return; }
if (!/^\d{4}-\d{2}-\d{2}$/.test(_o1a.effective || '')) { _o0.toast('Chọn ngày hiệu lực.', 'warn'); return; }
const now = Date.now();
const _o16 = {
id: _o1a.draftId || undefined, project_id: _os.id, month: _o1a.effective.slice(0, 7), effective_from: _o1a.effective, status,
source: _o1a.source, plans: JSON.stringify(S.toStorePlans(_o1a.draft)), note: _o1a.note || '', approved_at: status === 'active' ? now : 0,
};
const _o19 = await _o0.put('policies', _o16);
try {
await _o0.put('audit', { at: now, action: status === 'active' ? 'policy.approve' : 'policy.draft', object_id: _o19.id,
detail: JSON.stringify({ project_id: _os.id, month: _o16.month, plans: _o1a.draft.length, source: _o1a.source }) });
} catch { }
_o0.toast(status === 'active' ? `Đã duyệt ${S.policyLabel(_o16)} cho ${_os.name}` : 'Đã lưu nháp – xem ở Chờ duyệt', 'ok');
_o1a.draft = null; _o1a.draftId = null; _o1a.aiErrors = [];
env = await S.loadEnv(ctx);
_o10();
}
function _o14() {
const rows = env.history(_o1a.project), active = env.active(_o1a.project);
if (!rows.length) { _oj.replaceChildren(h('div', { class: 'sl-box sl-muted' }, 'Chưa có lịch sử chính sách cho dự án này (đang dùng chính sách mặc định).')); return; }
const _o9 = {};
rows.forEach((_ow) => { (_o9[_ow.month || '—'] = _o9[_ow.month || '—'] || []).push(_ow); });
_oj.replaceChildren(h('div', { class: 'sl-box sl-col', 'data-testid': 'policy-history' }, h('h3', null, 'Lịch sử theo tháng'),
...Object.entries(_o9).map(([_oo, list]) => h('div', { class: 'sl-col' }, h('b', null, 'Tháng ' + S.ymLabel(_oo)),
...list.map((_ow) => h('div', { class: 'sl-row sl-sp' },
h('span', null, `${_o1[_ow.status] || _ow.status}${active && active.id === _ow.id ? ' · đang áp dụng' : ''} · hiệu lực ${_ow.effective_from ? _ow.effective_from.split('-').reverse().join('/') : '—'} · ${S.parsePlans(_ow.plans).length} phương án${_ow.source === 'ai' ? ' · AI' : ''}`),
h('span', { class: 'sl-row' },
_o0.button('Xem', () => _o1i(_ow), { kind: 'ghost', testid: 'policy-view-' + _ow.id }),
!_ob ? null : _o0.button(_ow.status === 'draft' ? 'Sửa nháp' : 'Dùng làm nháp', () => { _on(_ow); if (_ow.status !== 'draft') { _o1a.draftId = null; _o1a.effective = env.today; } _o10(); }, { kind: 'ghost' }))))))));
}
function _o1i(_ow) {
const plans = S.parsePlans(_ow.plans);
_o0.modal({ title: `${S.policyLabel(_ow)} · ${_o1[_ow.status] || _ow.status}`, testid: 'policy-view', wide: true, body: plans.map((pl) => h('div', { class: 'sl-col' },
h('b', null, `${pl.name} – chiết khấu ${S.fmtNum((1 - pl.factor) * 100, 2)}%${pl.loan ? ` · vay ${S.fmtNum(pl.loan * 100)}% · HTLS ${S.htlsTxt(pl.htls)}` : ''}`),
h('table', { class: 'sl-tbl' }, h('tbody', null, pl.steps.map((_o17) => h('tr', { class: _o17.bank ? 'bank' : '' }, h('td', null, _o17.name), h('td', null, _o17.when || S.atLabel(_o17.at)), h('td', { class: 'n' }, S.fmtNum(_o17.pct) + '%'))))))) });
}
function _o10() { _o13(); _o12(); _o11(); _o14(); }
_o10();
_o0.on(_o15, ['policies'], async () => { if (!_o1a.draft) { env = await S.loadEnv(ctx); _o10(); } });
return _o15;
}
export default {
manifest: {
id: 'policy', title: 'Cập nhật chính sách', icon: '📝', screen: 'sales', order: 40, version: '1.0.0', status: 'ready',
help: 'Nạp chính sách bán hàng mới: gõ tay, chụp phiếu tính giá cho AI đọc, hoặc nhờ Claude/Gemini rồi dán kết quả về. Tổng các đợt phải đủ 100% mới Duyệt được.',
},
mount,
async selftest(ctx) {
const _ow = await S.selftestSales(ctx, ['policy.validate', 'policy.diff']);
try {
const _oq = S.normalizePlans('{"plans":[{"ten":"A","cac_dot":[{"ten":"x","ty_le":"40%","moc":0},{"ten":"y","ty_le":"60%","moc":"H"}]}]}');
if (_oq.errors.length || S.hasBlocking(S.checkPlans(_oq.plans))) return { ok: false, details: 'Chuẩn hoá JSON mẫu lỗi' };
} catch (e) { return { ok: false, details: 'Chuẩn hoá lỗi: ' + (e && e.message) }; }
return _ow;
},
};

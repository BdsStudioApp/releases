import { kit, h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as U from '../g1_lib/ui.js';
import { freshButton, freshPrompt } from '../_lib/fresh.js';
const _o2 = 'g1.pub.banks';
const _o0 = [
['bank', 'Ngân hàng', 'text'], ['promo_rate', 'Lãi ưu đãi (%/năm)', 'dec'], ['promo_months', 'Ưu đãi (tháng)', 'dec'],
['floating_rate', 'Lãi thả nổi dự kiến (%/năm)', 'dec'], ['base_label', 'Cách tính thả nổi (vd: lãi cơ sở + 3,5%)', 'text'],
['ref_rate', 'Lãi cơ sở tham chiếu (%/năm)', 'dec'], ['margin', 'Biên độ (%)', 'dec'],
['prepay', 'Phí trả trước hạn theo năm (vd 3,3,2,1,0)', 'text'], ['max_ltv', 'Cho vay tối đa (% giá)', 'dec'], ['max_years', 'Thời hạn tối đa (năm)', 'dec'],
['source_name', 'Tên nguồn (vd trang ngân hàng)', 'text'], ['source_url', 'Link nguồn (biểu lãi của ngân hàng)', 'url'], ['updated', 'Ngày cập nhật', 'date'], ['note', 'Ghi chú', 'text'],
];
const _ok = (btn, label) => { btn.setAttribute('aria-label', label); return btn; };
const _ol = (v) => (v == null ? '—' : S.fmtNum(v, 3) + '%');
const hostOf = (u) => G.hostOf(u) || 'Nguồn';
export async function mount(el, ctx) {
S.ensureSalesCss(); U.ensureCss();
const _o1 = kit(ctx);
const env = await S.loadEnv(ctx);
const money = env.money;
const role = ctx.user && ctx.user.role;
const canEdit = !role || role === 'owner' || role === 'manager';
let rows = (await _o1.setting(_o2, [])) || [];
if (!Array.isArray(rows)) rows = [];
let _oh = null;
const _ow = { amount: '2', years: '20', prepayYear: '0', method: 'annuity' };
const _os = h('div', { class: 'sl g1', 'data-testid': 'g1-banks' });
el.innerHTML = ''; el.appendChild(_os);
const stampBox = h('div', { class: 'sl-col', 'aria-live': 'polite' });
const _ox = h('div', { class: 'sl-col' }), cmpBox = h('div', { class: 'sl-col', 'aria-live': 'polite' });
const formBox = h('div', { class: 'sl-box sl-col', 'data-testid': 'g1-bank-form' });
_os.append(U.title('So sánh ngân hàng'),
h('p', { class: 'g1-lead' }, 'Bảng lãi lấy từ biểu lãi của ngân hàng (kèm ngày, link nguồn): anh/chị nhập tay, hoặc Quản trị/Quản lý bấm "Cập nhật thông tin mới nhất qua AI" để AI quét biểu lãi các ngân hàng rồi duyệt trước khi lưu.'),
stampBox, formBox, cmpBox, _ox);
function _op() {
const _ou = G.banksStamp(rows);
stampBox.replaceChildren(
h('p', { class: 'g1-warn', 'data-testid': 'g1-bank-stamp', 'data-ai': String(_ou.ai) }, '📅 ' + _ou.text),
_oh ? h('p', { class: 'g1-okbox sl-small', 'data-testid': 'g1-bank-merged' },
`Đã lưu kết quả AI: cập nhật ${_oh.updated.length}, thêm ${_oh.added.length} ngân hàng; giữ nguyên ${_oh.kept.length} dòng AI không tìm thấy` +
(_oh.kept.length ? ` (${_oh.kept.slice(0, 6).join(', ')}${_oh.kept.length > 6 ? '…' : ''})` : '') + '.') : null);
}
const _od = (key, label, tid) => h('label', { class: 'sl-f' }, label, h('input', { type: 'text', inputmode: 'decimal', value: _ow[key], 'data-testid': tid, oninput: (e) => { _ow[key] = e.target.value; _o7(); } }));
const _oe = () => h('div', { class: 'sl-form' }, _od('amount', 'Số tiền vay (tỷ)', 'g1-bank-amount'), _od('years', 'Vay bao nhiêu năm', 'g1-bank-years'),
_od('prepayYear', 'Dự định trả hết sau (năm, 0 = không)', 'g1-bank-prepay'),
h('label', { class: 'sl-f' }, 'Cách trả', _o1.select([['annuity', 'Trả đều mỗi tháng'], ['equal', 'Gốc đều, lãi giảm dần']], _ow.method, { onchange: (e) => { _ow.method = e.target.value; _o7(); } })));
formBox.append(_oe());
function _o7() {
const _o3 = G.numDec(_ow.amount), P = isFinite(_o3) ? (_o3 < 1e5 ? _o3 * 1e9 : _o3) : NaN;
const _o8 = (k) => (String(_ow[k]).trim() === '' ? '' : G.numDec(_ow[k]));
const _o5 = G.rangeErrors([['Số tiền vay', String(_ow.amount).trim() === '' ? '' : P / 1e9, 0.001, 100000, 'tỷ'], ['Số năm vay', _o8('years'), 1, 50, 'năm'], ['Dự định trả hết sau', _o8('prepayYear'), 0, 50, 'năm']]);
if (_o5.length) {
cmpBox.replaceChildren(h('div', { class: 'g1-err', role: 'alert', 'data-testid': 'g1-bank-errors' }, h('b', null, 'Có ô nhập chưa hợp lý – sửa rồi hệ thống tính lại:'), h('ul', null, _o5.map((x) => h('li', null, x)))));
return;
}
const _or = G.compareBanks(rows, { principal: P, years: G.numDec(_ow.years) || 20, prepayYear: G.numDec(_ow.prepayYear) || 0, method: _ow.method, todayISO: env.today, staleDays: 30 });
const _o6 = _or.length ? _or.map((_o4, i) => h('div', { class: 'g1-card' + (_o4.best ? ' best' : ''), 'data-testid': 'g1-bank-res-' + i },
h('div', { class: 'sl-row sl-sp' }, h('b', null, _o4.bank || '(chưa có tên)'), _o4.best ? h('span', { class: 'sl-ok', 'data-testid': 'g1-bank-best' }, '✓ Chi phí thấp nhất') : null),
_o4.ok ? [
h('div', null, `Trả tháng đầu: ${S.fmtVnd(_o4.first)}${_o4.promo_months ? ` (ưu đãi ${S.fmtNum(_o4.promo_rate)}% × ${S.fmtNum(_o4.promo_months)} tháng)` : ''}`),
_o4.after != null ? h('div', null, `Hết ưu đãi (thả nổi ~${S.fmtNum(_o4.floating_rate)}%): ${S.fmtVnd(_o4.after)}/tháng`) : null,
h('div', null, `Tổng lãi${G.numDec(_ow.prepayYear) > 0 ? ' đến lúc trả hết' : ''}: ${G.moneyFine(_o4.interest)}`),
_o4.penalty ? h('div', null, `Phí trả trước hạn: ${G.moneyFine(_o4.penalty)}`) : null,
h('div', null, h('b', { 'data-testid': 'g1-bank-cost-' + i }, `Tổng chi phí vay: ${G.moneyFine(_o4.cost)}`), _o4.extra ? h('span', { class: 'sl-muted', 'data-testid': 'g1-bank-extra-' + i }, ` (+${G.moneyFine(_o4.extra)})`) : null),
] : null,
_o4.issues.length ? h('ul', { class: 'sl-issues' }, _o4.issues.map((x) => h('li', { class: 'w' }, x))) : null,
h('div', { class: 'sl-small ' + (_o4.stale ? 'sl-bad' : 'sl-muted'), 'data-testid': 'g1-bank-date-' + i },
_o4.updated ? `Cập nhật ${G.dmy(_o4.updated)}${_o4.origin === 'ai' ? ' (AI quét ngày ' + G.dmy(_o4.ai_at) + ')' : ''}${_o4.stale ? ' – đã quá 30 ngày, hỏi lại ngân hàng' : ''}` : 'Chưa ghi ngày cập nhật'),
G.safeUrl(_o4.source_url) ? h('a', { href: G.safeUrl(_o4.source_url), target: '_blank', rel: 'noopener', class: 'sl-small g1-tap' }, 'Nguồn: ' + (_o4.source_name || hostOf(_o4.source_url))) : null))
: [_o1.empty('Chưa có ngân hàng nào. ' + (canEdit ? 'Bấm "+ Thêm ngân hàng" và nhập theo biểu lãi mới nhất, hoặc "Cập nhật thông tin mới nhất qua AI".' : 'Chờ Quản trị/Quản lý cập nhật bảng lãi.'))];
cmpBox.replaceChildren(h('div', { class: 'g1-cards' }, _o6),
h('p', { class: 'g1-legal' }, 'Lãi thả nổi là dự kiến theo bảng lãi; thực tế thay đổi theo ngân hàng từng kỳ. Không phải cam kết của ngân hàng – bảng tính chỉ mang tính tham khảo, nên gọi nhân viên ngân hàng để có số chính xác.'));
}
let _om = null;
function _ob(parsed) {
const list = G.normFreshBanks(parsed, { todayISO: env.today });
_om = new Set(list.filter((r) => r.ok && !r.stale).map((r) => r.key));
if (!list.length) return h('p', { class: 'g1-warn', 'data-testid': 'g1-bank-fresh-empty' }, 'AI chưa trả về ngân hàng nào đọc được – bấm "Chạy lại" sau ít phút.');
const _oj = list.filter((r) => r.ok).length;
const body = list.map((r, i) => {
const at = G.findBankRow(rows, r.key);
const box = h('input', { type: 'checkbox', checked: _om.has(r.key), disabled: !r.ok, 'aria-label': 'Lưu ' + r.bank, 'data-testid': 'g1-bank-fresh-pick-' + i,
onchange: (e) => { if (e.target.checked) _om.add(r.key); else _om.delete(r.key); } });
return h('tr', { 'data-testid': 'g1-bank-fresh-row-' + i },
h('td', null, h('label', { class: 'g1-pick' }, box)),
h('td', null, h('b', null, r.bank), r.note ? h('div', { class: 'sl-small sl-muted' }, r.note) : null,
h('div', { class: 'sl-small ' + (at >= 0 ? 'sl-muted' : 'sl-ok') }, at >= 0 ? 'Thay dòng "' + rows[at].bank + '" trong bảng' : 'Ngân hàng mới – thêm dòng')),
h('td', { 'data-l': 'Ưu đãi' }, r.promo_rate != null ? _ol(r.promo_rate) + (r.promo_months ? ' × ' + r.promo_months + ' th' : '') : '—'),
h('td', { 'data-l': 'Sau ưu đãi' }, _ol(r.floating_rate), r.base_label ? h('div', { class: 'sl-small sl-muted' }, r.base_label + (r.ref_rate != null ? ' (cơ sở ' + _ol(r.ref_rate) + ')' : '')) : null),
h('td', { 'data-l': 'Hạn mức' }, [r.max_ltv != null ? 'Tối đa ' + S.fmtNum(r.max_ltv) + '%' : '', r.max_years != null ? S.fmtNum(r.max_years) + ' năm' : ''].filter(Boolean).join(' · ') || '—',
r.prepay ? h('div', { class: 'sl-small sl-muted' }, 'Phạt trả trước: ' + r.prepay + '%') : null),
h('td', { class: 'g1-src', 'data-l': 'Nguồn' }, r.source_url ? h('a', { href: r.source_url, target: '_blank', rel: 'noopener' }, r.source_name || hostOf(r.source_url)) : h('span', { class: 'sl-bad' }, 'Không có link'),
h('div', { class: 'sl-small ' + (r.stale ? 'sl-bad' : 'sl-muted') }, r.date ? 'Ngày ' + G.dmy(r.date) : 'Không ghi ngày')),
h('td', null, [...r.issues.map((x) => h('div', { class: 'sl-small sl-bad' }, x)), ...r.warns.map((x) => h('div', { class: 'sl-small sl-muted' }, x))]));
});
return h('div', { class: 'sl-col', 'data-testid': 'g1-bank-fresh-table' },
h('p', { class: 'sl-small' }, `AI tìm được ${list.length} ngân hàng (${_oj} dòng đủ nguồn để lưu). Bỏ tích dòng nào không muốn lưu. Ngân hàng đang có trong bảng mà AI không tìm thấy sẽ được GIỮ NGUYÊN.`),
h('div', { class: 'sl-scroll' }, h('table', { class: 'sl-tbl g1-tbl g1-stack' },
h('thead', null, h('tr', null, ...['Lưu', 'Ngân hàng', 'Ưu đãi', 'Sau ưu đãi', 'Hạn mức', 'Nguồn · ngày', 'Ghi chú'].map((t) => h('th', null, t)))),
h('tbody', null, body))),
h('p', { class: 'g1-legal' }, 'Số do AI đọc từ trang nguồn – bảng tính chỉ mang tính tham khảo, nên gọi nhân viên ngân hàng để có số chính xác.'));
}
async function _oa(parsed, meta) {
const list = G.normFreshBanks(parsed, { todayISO: env.today });
const chosen = list.filter((r) => r.ok && (_om ? _om.has(r.key) : !r.stale));
if (!chosen.length) throw new Error('Chưa chọn ngân hàng nào có link nguồn để lưu');
const cur = (await _o1.setting(_o2, [])) || [];
const _or = G.mergeFreshBanks(Array.isArray(cur) ? cur : [], chosen, { atISO: G.isoVN(meta.at), reputable: meta.reputable, newId: (i) => Date.now().toString(36) + 'a' + i });
await _o1.setSetting(_o2, _or.rows);
rows = _or.rows; _oh = _or;
_oo();
}
const freshBox = canEdit ? freshButton(_o1, ctx, {
topic: 'bank_rates', title: 'Cập nhật bảng lãi vay mua nhà qua AI', testid: 'g1-bank-fresh', mergeKey: G.bankKey,
prompt: () => freshPrompt('bank_rates', { ask: G.BANK_FRESH_ASK, shape: G.BANK_FRESH_SHAPE }),
render: (parsed) => _ob(parsed), onSave: _oa,
}) : null;
function _oq() {
const list = rows.map((r, i) => {
const _o4 = G.normBank(r);
const _og = G.bankIssues(_o4, env.today);
const _ov = G.safeUrl(_o4.source_url);
return h('div', { class: 'sl-box sl-col', 'data-testid': 'g1-bank-row-' + i },
h('div', { class: 'sl-row sl-sp' }, h('span', { class: 'sl-row' }, h('b', null, _o4.bank || 'Ngân hàng ' + (i + 1)),
_o4.origin === 'ai' ? h('span', { class: 'g1-st grounded', 'data-testid': 'g1-bank-ai-' + i, title: 'Dòng do AI cập nhật, người dùng đã duyệt' }, '🤖 AI ' + G.dmy(_o4.ai_at)) : h('span', { class: 'g1-st ai_only' }, 'Nhập tay')),
canEdit ? h('span', { class: 'sl-row' }, _ok(_o1.button('Sửa', () => _o9(i), { kind: 'ghost', icon: '✏️', testid: 'g1-bank-edit-' + i }), 'Sửa ' + (_o4.bank || 'ngân hàng ' + (i + 1))), _ok(_o1.button('Xoá', () => _on(i), { kind: 'ghost', icon: '🗑️', testid: 'g1-bank-remove-' + i }), 'Xoá ' + (_o4.bank || 'ngân hàng ' + (i + 1)))) : null),
h('div', { class: 'sl-small sl-muted' }, [_o4.promo_rate != null ? `Ưu đãi ${S.fmtNum(_o4.promo_rate)}%/${S.fmtNum(_o4.promo_months || 0)} th` : '', _o4.floating_rate != null ? `thả nổi ${S.fmtNum(_o4.floating_rate)}%` : '',
_o4.base_label || '', _o4.max_ltv != null ? `vay tối đa ${S.fmtNum(_o4.max_ltv)}%` : '', _o4.max_years != null ? `${S.fmtNum(_o4.max_years)} năm` : '', _o4.prepay ? `phạt trả trước ${_o4.prepay}` : ''].filter(Boolean).join(' · ')),
h('div', { class: 'sl-small sl-muted g1-src' }, _o4.updated ? 'Ngày ' + G.dmy(_o4.updated) : 'Chưa ghi ngày', _ov ? [' · ', h('a', { href: _ov, target: '_blank', rel: 'noopener' }, _o4.source_name || hostOf(_ov))] : _o4.source_name ? ' · ' + _o4.source_name : null),
_og.errors.length ? h('div', { class: 'sl-small sl-bad' }, _og.errors.join('; ')) : null);
});
_ox.replaceChildren(h('div', { class: 'sl-row sl-sp' }, h('h3', null, `Bảng lãi (${rows.length})`), canEdit ? _o1.button('+ Thêm ngân hàng', () => _o9(-1), { kind: 'primary', testid: 'g1-bank-add' }) : null),
freshBox, ...list);
}
function _o9(i) {
const cur = i >= 0 ? { ...rows[i] } : { id: Date.now().toString(36), updated: env.today };
const _of = {};
const err = h('div', { class: 'sl-bad', role: 'alert' });
const body = h('div', { class: 'sl g1-banks' },
cur.origin === 'ai' ? h('p', { class: 'g1-warn sl-small' }, 'Dòng này do AI cập nhật ngày ' + G.dmy(cur.ai_at) + '. Sửa số rồi Lưu → thành dòng nhập tay.') : null,
h('div', { class: 'sl-form' }, _o0.map(([k, label, kind]) => {
_of[k] = h('input', { type: kind === 'date' ? 'date' : 'text', inputmode: kind === 'dec' ? 'decimal' : undefined, value: cur[k] ?? '', 'data-testid': 'g1-bank-f-' + k });
return h('label', { class: 'sl-f' }, label, _of[k]);
})), err, h('div', { class: 'sl-row sl-end' }, _o1.button('Lưu', save, { kind: 'primary', testid: 'g1-bank-save' })));
const _oi = _o1.modal({ title: i >= 0 ? 'Sửa ngân hàng' : 'Thêm ngân hàng', body, testid: 'g1-bank-modal' });
async function save() {
let _ot = { ...cur };
_o0.forEach(([k]) => { _ot[k] = _of[k].value.trim(); });
const _o4 = G.normBank(_ot), _og = G.bankIssues(_o4, env.today);
const _oc = _og.errors.filter((x) => /tên|ngày cập nhật|http/i.test(x)).concat(G.bankFieldErrors(_o4));
if (_oc.length) { err.textContent = _oc.join('; ') + '.'; return; }
if (_o4.updated > env.today) { err.textContent = 'Ngày cập nhật không được sau hôm nay.'; return; }
if (_o0.some(([k]) => String(cur[k] ?? '').trim() !== _ot[k])) _ot = G.markBankManual(_ot);
const next = rows.slice();
if (i >= 0) next[i] = _ot; else next.push(_ot);
try { await _o1.setSetting(_o2, next); } catch (e) { err.textContent = 'Chưa lưu được: ' + ((e && e.message) || 'lỗi'); return; }
rows = next; _oi.close(); _o1.toast('Đã lưu bảng lãi cho cả công ty.', 'ok'); _oo();
}
}
async function _on(i) {
if (!(await _o1.confirm({ title: 'Xoá ngân hàng', text: `Xoá "${rows[i].bank}" khỏi bảng lãi?`, ok: 'Xoá', kind: 'danger', testid: 'g1-bank-del' }))) return;
rows = rows.filter((_, j) => j !== i);
await _o1.setSetting(_o2, rows); _oo();
}
function _oo() { _op(); _oq(); _o7(); }
_oo();
return _os;
}
export default {
manifest: { id: 'g1_banks', title: 'So sánh ngân hàng', icon: '🏦', screen: 'sales', order: 160, version: '0.1.0', status: 'ready',
help: 'So khoản vay giữa các ngân hàng: lãi ưu đãi, thả nổi, biên độ, phí trả trước hạn. Bảng lãi nhập tay hoặc cập nhật qua AI (ghi ngày, nguồn) – chỉ mang tính tham khảo.' },
mount,
async selftest() {
const r = G.compareBanks([{ bank: 'A', floating_rate: 10, updated: '2026-01-01' }], { principal: 1e9, years: 10 });
return r[0].ok && r[0].interest > 0 ? { ok: true } : { ok: false, details: 'So sánh ngân hàng lỗi' };
},
};

import { kit, h } from '../_lib/kit.js';
import * as CS from '../_lib/consent.js';
import * as crm from '../_lib/crm.js';
import { csvCellSafe } from '../_lib/import_logic.js';
const _o0 = { export: true };
const _oh = ctx => (ctx.user && ctx.user.perms) || _o0;
const _od = ctx => { const _op = ctx.user; return !_op || _op.legacy || !_op.role || _op.role === 'owner'; };
const _oa = (_o1, ms) => (ms ? _o1.date(ms) + ' ' + crm.hm(ms) : '');
async function _or(_o1, ctx) {
const _op = ctx.user || {};
const me = await _o1.me();
return { by: _op.id || '', by_name: _op.full_name || _op.username || me.name || 'Chủ app' };
}
async function _of(_o1) { return CS.noticeConfig(await _o1.setting(CS.NOTICE_KEY, null)); }
export async function record(ctx, id, input) {
const _o1 = kit(ctx);
const fresh = await _o1.get('objects', id);
if (!fresh) { _o1.toast('Không tìm thấy hồ sơ khách', 'warn'); return null; }
const _oi = CS.makeEntry({ ...(await _or(_o1, ctx)), ...input }, { now: Date.now() });
if (!_oi.ok) { _o1.toast(_oi.error, 'warn'); return null; }
const _oj = await _o1.put('objects', { ...fresh, ...CS.withEntry(fresh, _oi.entry) });
const e = _oi.entry;
await _o1.logEvent(id, 'note', (e.act === 'grant' ? 'Ghi nhận đồng ý' : 'Khách rút lại đồng ý') + ': ' + e.scopes.map(CS.scopeLabel).join(', ').toLowerCase() +
' (' + CS.channelLabel(e.channel) + (e.notice_version ? ', thông báo ' + e.notice_version : '') + ')', { consent: e.act, scopes: e.scopes });
return _oj;
}
export function consentBox(ctx, c, { onChange } = {}) {
const _o1 = kit(ctx);
const s = CS.stateOf(c);
const _oo = CS.statusText(c);
return h('div', { class: 'cu-consent cu-consent-' + _oo.tone, 'data-testid': 'consent-box', 'data-state': s.withdrawn ? 'withdrawn' : s.source },
s.withdrawn ? h('p', { class: 'cu-consent-ban', role: 'alert', 'data-testid': 'consent-withdrawn-banner' },
'⛔ Khách đã rút lại đồng ý' + (s.withdrawnAt ? ' ngày ' + _o1.date(s.withdrawnAt) : '') + '. App đã khoá: không gửi AI, không soạn tin, không nhắc/gợi ý liên hệ.') : null,
s.recheck ? h('p', { class: 'cu-consent-ban', 'data-testid': 'consent-recheck' }, 'Máy chủ ghi khách vừa tick đồng ý lại (form landing). Hỏi lại khách rồi bấm "Ghi nhận đồng ý" nếu đúng.') : null,
h('div', { class: 'cu-consent-row' },
h('span', null, '🛡️ ', h('strong', { 'data-testid': 'consent-status' }, _oo.text)),
_o1.button('Nhật ký đồng ý', () => openLog(ctx, c.id, { onChange }), { testid: 'consent-open', icon: 'shield' })));
}
export async function openLog(ctx, id, { onChange } = {}) {
const _o1 = kit(ctx);
const body = h('div', { class: 'cu-consent-log' });
const _oe = _o1.modal({ title: 'Nhật ký đồng ý', wide: true, testid: 'consent-log', body });
const _o7 = () => { _o9(); if (onChange) onChange(); };
async function _o9() {
const c = await _o1.get('objects', id);
if (!c || Number(c.deleted)) { _oe.close(); return; }
const s = CS.stateOf(c), _oo = CS.statusText(c), cfg = await _of(_o1);
body.innerHTML = '';
body.append(
h('p', null, h('strong', null, c.name || 'Khách'), ' · ', _o1.badge(_oo.text, _oo.tone)),
h('ul', { class: 'cu-consent-scopes', 'data-testid': 'consent-scopes' }, CS.SCOPES.map(x => h('li', { 'data-scope': x.id, 'data-on': String(s.scopes[x.id].on) },
s.scopes[x.id].on ? '✅ ' : '— ', x.label))),
s.source === 'legacy' ? h('p', { class: 'bds-muted' }, 'Khách cũ chỉ có cờ "đã đồng ý" (chưa rõ ai ghi, kênh nào). App tạm hiểu là: lưu dữ liệu, nhận tin chăm sóc, để AI xử lý rút gọn. Nên hỏi lại khách và ghi nhận rõ ràng.') : null);
const log = [...s.log].reverse();
body.appendChild(log.length
? h('ol', { class: 'bds-timeline cu-consent-list', 'data-testid': 'consent-entries' }, log.map(e => h('li', { 'data-testid': 'consent-entry', 'data-act': e.act },
h('span', { class: 'bds-ti' }, e.act === 'grant' ? '✅' : '⛔'),
h('div', null,
h('small', { class: 'bds-muted' }, _oa(_o1, e.at) + ' · ' + CS.channelLabel(e.channel) + (e.by_name ? ' · ghi bởi ' + e.by_name : '')),
h('div', null, h('strong', null, e.act === 'grant' ? 'Đồng ý: ' : 'Rút lại: '), e.scopes.map(CS.scopeLabel).join(', ').toLowerCase()),
e.notice_version ? h('button', { type: 'button', class: 'cu-linkbtn', 'data-testid': 'consent-entry-notice', onclick: () => _on(_o1, cfg, e.notice_version) }, 'Đã đọc/gửi thông báo bản ' + e.notice_version) : null,
e.note ? h('div', { class: 'bds-note' }, e.note) : null))))
: _o1.empty('Chưa có mục nào trong nhật ký.'));
const _o3 = CS.SCOPE_IDS.some(k => s.scopes[k].on);
body.appendChild(h('div', { class: 'bds-row bds-wrap bds-end' },
_o1.button('Thông báo mẫu', () => openNotice(ctx, { customer: c }), { kind: 'ghost', icon: 'log', testid: 'consent-notice' }),
_oh(ctx).export ? _o1.button('Xuất CSV', () => _oc(_o1, [c], 'nhat-ky-dong-y-' + (c.id || 'khach')), { kind: 'ghost', testid: 'consent-export-one' }) : null,
_o3 ? _o1.button('Khách rút lại đồng ý', () => openWithdraw(ctx, c, _o7), { kind: 'danger', icon: 'undo', testid: 'consent-withdraw' }) : null,
_o1.button('+ Ghi nhận đồng ý', () => openGrant(ctx, c, _o7), { kind: 'primary', testid: 'consent-grant' })));
}
await _o9();
return _oe;
}
function _ol(prefix, on) {
const _o5 = Object.fromEntries(CS.SCOPES.map(x => [x.id, h('input', { type: 'checkbox', checked: on.includes(x.id), 'data-testid': prefix + x.id })]));
const el = h('div', { class: 'cu-consent-checks' }, CS.SCOPES.map(x => h('label', { class: 'bds-check' }, _o5[x.id], h('span', null, h('strong', null, x.label), ' – ', h('small', null, x.hint)))));
return { el, picked: () => CS.SCOPE_IDS.filter(id => _o5[id].checked) };
}
const _o8 = (testid, v = 'truc_tiep') => {
const _om = h('select', { 'data-testid': testid, 'aria-label': 'Kênh' }, CS.CHANNELS.map(c => h('option', { value: c.id }, c.label)));
_om.value = v;
return _om;
};
export async function openGrant(ctx, c, onDone) {
const _o1 = kit(ctx);
const cfg = await _of(_o1);
const _o6 = _o8('cg-channel');
const _ok = _ol('cg-scope-', ['luu', 'cham_soc']);
const notice = h('input', { type: 'checkbox', 'data-testid': 'cg-notice' });
const note = h('textarea', { rows: 2, maxlength: CS.LIMITS.note, placeholder: 'VD: khách trả lời "Đồng ý" qua Zalo lúc 9h, đã chụp màn hình', 'data-testid': 'cg-note' });
const err = h('div', { class: 'bds-error', role: 'alert' });
const _oe = _o1.modal({ title: 'Ghi nhận đồng ý – ' + (c.name || 'khách'), testid: 'consent-grant-modal', body: [
_o1.field('Kênh khách đồng ý', _o6), _o1.field('Phạm vi khách đồng ý', _ok.el),
h('label', { class: 'bds-check' }, notice, h('span', null, 'Đã đọc/gửi cho khách thông báo mẫu bản ', h('strong', null, cfg.version))),
_o1.field('Ghi chú', note), err,
h('div', { class: 'bds-row bds-end' }, _o1.button('Huỷ', () => _oe.close()), _o1.button('Lưu', async () => {
const scopes = _ok.picked();
if (!scopes.length) { err.textContent = 'Chọn ít nhất một phạm vi.'; return; }
if (!scopes.includes('luu')) { err.textContent = 'Các phạm vi khác cần kèm "Lưu dữ liệu".'; return; }
const _oj = await record(ctx, c.id, { act: 'grant', scopes, channel: _o6.value, notice_version: notice.checked ? cfg.version : '', note: note.value });
if (!_oj) return;
_oe.close(); _o1.toast('Đã ghi nhận đồng ý', 'success'); if (onDone) onDone(_oj);
}, { kind: 'primary', testid: 'cg-save' }))] });
return _oe;
}
export function openWithdraw(ctx, c, onDone) {
const _o1 = kit(ctx);
const s = CS.stateOf(c);
const _ok = _ol('cw-scope-', CS.SCOPE_IDS.filter(k => s.scopes[k].on));
const _o6 = _o8('cw-channel');
const note = h('textarea', { rows: 2, maxlength: CS.LIMITS.note, placeholder: 'VD: khách nhắn Zalo "đừng gửi tin nữa"', 'data-testid': 'cw-note' });
const err = h('div', { class: 'bds-error', role: 'alert' });
const _oe = _o1.modal({ title: 'Khách rút lại đồng ý – ' + (c.name || 'khách'), testid: 'consent-withdraw-modal', body: [
h('p', { class: 'bds-muted' }, 'Rút "Lưu dữ liệu" hoặc "Nhận tin chăm sóc" → app khoá ngay: không gửi AI, ẩn nút soạn tin, bỏ khỏi danh sách nhắc/gợi ý liên hệ. Lịch đóng tiền, lịch hẹn vẫn giữ. Khách muốn xoá hẳn → dùng "Xoá dữ liệu khách".'),
_o1.field('Phạm vi khách rút lại', _ok.el), _o1.field('Kênh khách báo', _o6), _o1.field('Ghi chú', note), err,
h('div', { class: 'bds-row bds-end' }, _o1.button('Huỷ', () => _oe.close()), _o1.button('Ghi nhận rút lại', async () => {
const scopes = _ok.picked();
if (!scopes.length) { err.textContent = 'Chọn ít nhất một phạm vi.'; return; }
const _oj = await record(ctx, c.id, { act: 'withdraw', scopes, channel: _o6.value, note: note.value });
if (!_oj) return;
_oe.close(); _o1.toast('Đã ghi nhận khách rút lại đồng ý – app đã khoá', 'success'); if (onDone) onDone(_oj);
}, { kind: 'danger', testid: 'cw-save' }))] });
return _oe;
}
function _on(_o1, cfg, version) {
const t = CS.noticeText(cfg, version);
_o1.modal({ title: 'Thông báo bản ' + version, testid: 'consent-version', body: [
t ? h('pre', { class: 'cu-notice-text' }, t) : h('p', { class: 'bds-muted' }, 'Bản này không còn lưu trong app (chỉ giữ ' + CS.LIMITS.noticeVersions + ' bản gần nhất).')] });
}
export async function openNotice(ctx, { customer } = {}) {
const _o1 = kit(ctx);
let cfg = await _of(_o1);
const me = await _o1.me();
const _og = _od(ctx);
const ver = h('strong', { 'data-testid': 'notice-version' }, cfg.version);
const ta = h('textarea', { rows: 12, class: 'cu-notice-ta', readonly: true, 'data-testid': 'notice-text' }, CS.fillNotice(cfg.text, me));
let _ob = false;
const editBtn = _og ? _o1.button('Sửa mẫu', () => {
_ob = !_ob;
ta.readOnly = !_ob;
ta.value = _ob ? cfg.text : CS.fillNotice(cfg.text, me);
saveBtn.hidden = !_ob;
editBtn.textContent = _ob ? 'Thôi sửa' : 'Sửa mẫu';
if (_ob) ta.focus();
}, { kind: 'ghost', testid: 'notice-edit' }) : null;
const saveBtn = _o1.button('Lưu bản mới', async () => {
const next = CS.saveNotice(cfg, ta.value, { now: Date.now() });
if (next.version === cfg.version) { _o1.toast('Nội dung chưa đổi', 'info'); return; }
await _o1.setSetting(CS.NOTICE_KEY, next);
cfg = next; ver.textContent = cfg.version; _ob = false; ta.readOnly = true; ta.value = CS.fillNotice(cfg.text, me);
saveBtn.hidden = true; editBtn.textContent = 'Sửa mẫu';
_o1.toast('Đã lưu thông báo bản ' + cfg.version, 'success');
}, { kind: 'primary', testid: 'notice-save' });
saveBtn.hidden = true;
const _oe = _o1.modal({ title: 'Văn bản thông báo mẫu', wide: true, testid: 'consent-notice-modal', body: [
h('p', { class: 'cu-consent-ban', 'data-testid': 'notice-disclaimer' }, CS.DISCLAIMER),
h('p', { class: 'bds-muted' }, 'Bản ', ver, '. Đọc cho khách hoặc chép gửi qua Zalo – app không tự gửi. Ghi nhận đồng ý thì tick "đã đọc/gửi thông báo" để lưu mã bản này.',
_og ? ' Khi sửa: {ten}, {sdt} tự điền tên/số của anh/chị.' : ''),
ta,
h('div', { class: 'bds-row bds-wrap bds-end' }, editBtn, saveBtn,
_o1.button('Chép', async () => { await _o1.copy(_ob ? CS.fillNotice(ta.value, me) : ta.value); _o1.toast('Đã chép – dán vào Zalo để gửi khách', 'success'); }, { testid: 'notice-copy' }),
customer && (customer.zalo || customer.phone) ? _o1.linkBtn('💬 Mở Zalo', _o1.zaloLink(customer.zalo || customer.phone), () => { _o1.copy(ta.value); }, { target: '_blank', testid: 'notice-zalo' }) : null)] });
return _oe;
}
function _oc(_o1, customers, name) {
const text = CS.logCsv(customers, { cell: csvCellSafe, fmt: ms => _oa(_o1, ms) });
const _o4 = new Blob([text], { type: 'text/csv;charset=utf-8' });
const _o2 = h('a', { href: URL.createObjectURL(_o4), download: name + '-' + new Date().toISOString().slice(0, 10) + '.csv' });
document.body.appendChild(_o2); _o2.click(); _o2.remove(); setTimeout(() => URL.revokeObjectURL(_o2.href), 4000);
_o1.toast('Đã xuất nhật ký đồng ý của ' + customers.length + ' khách', 'success');
}
export function consentTools(ctx, { shown, filterUnclear }) {
const _o1 = kit(ctx);
return _o1.button('Đồng ý dữ liệu', async () => {
const list = shown();
const _oq = list.filter(CS.needsExplicit).length;
const _oe = _o1.modal({ title: 'Đồng ý dữ liệu cá nhân', testid: 'consent-center', body: [
h('p', null, 'Trong danh sách đang hiện: ', h('strong', { 'data-testid': 'consent-unclear-count' }, String(_oq)), ' khách chưa có đồng ý rõ ràng.'),
h('div', { class: 'bds-row bds-wrap' },
_oq ? _o1.button('Lọc khách chưa có đồng ý rõ ràng', () => { _oe.close(); filterUnclear(); }, { testid: 'consent-filter-unclear' }) : null,
_o1.button('Văn bản thông báo mẫu', () => { _oe.close(); _o1.afterClose(() => openNotice(ctx)); }, { testid: 'consent-center-notice' }),
_oh(ctx).export ? _o1.button('Xuất CSV nhật ký đồng ý', () => _oc(_o1, list, 'nhat-ky-dong-y'), { kind: 'primary', testid: 'consent-export' }) : null),
h('p', { class: 'bds-muted' }, CS.DISCLAIMER)] });
}, { kind: 'ghost', icon: 'shield', testid: 'consent-center-open', title: 'Thông báo mẫu, xuất nhật ký đồng ý, lọc khách chưa có đồng ý rõ ràng' });
}

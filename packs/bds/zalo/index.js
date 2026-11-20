import { kit, h, selftestCommon } from '../_lib/kit.js';
import * as crm from '../_lib/crm.js';
import { phonePrompt, askMyPhone } from '../_lib/my_phone.js';
export const PHONE_MARK = '[SĐT của anh/chị]';
export const NAME_MARK = '[Tên của anh/chị]';
import { gate } from '../_lib/consent.js';
export async function allTemplates(_o0) {
const _os = await _o0.setting('skills', []);
const cfg = await _o0.setting('zalo_templates', {});
return crm.mergeTemplates(crm.TEMPLATES, cfg, crm.skillTemplates(_os));
}
const PROFILE_HINT = 'Chưa có tên/số điện thoại của anh/chị trong Cài đặt › Thông tin cá nhân – tin gửi khách sẽ thiếu chữ ký.';
function _o2(_og) {
if (!_og) return '';
if (typeof _og === 'string') return _og;
if (_og.ok === true && _og.data) return _o2(_og.data);
return _og.text || _og.output || _og.result || '';
}
export function buildPrompt({ customer, me, vars, purpose, current }) {
return [
'Bạn là chuyên viên tư vấn bất động sản chuyên nghiệp tại Việt Nam.',
'Viết MỘT tin nhắn Zalo gửi khách, tiếng Việt có dấu, lịch sự, xưng "em", gọi khách là "anh/chị".',
'Yêu cầu: ngắn gọn (dưới 120 chữ), thân thiện, rõ ràng; không hứa hẹn lợi nhuận hay cam kết tăng giá; không dùng chữ "xin lỗi"; không bịa số liệu; tối đa 1 biểu tượng cảm xúc.',
'Chỉ trả về nội dung tin nhắn, không giải thích.',
'',
'Mục đích: ' + (purpose || 'chăm sóc khách'),
'Tên khách: ' + (vars.ten || customer.name || ''),
vars.du_an ? 'Dự án: ' + vars.du_an : '',
vars.loai_can ? 'Loại căn: ' + vars.loai_can : '',
vars.so_tien_text ? 'Số tiền: ' + vars.so_tien_text : '',
vars.ngay ? 'Ngày: ' + vars.ngay : '',
customer.status ? 'Tình trạng khách: ' + customer.status : '',
'Người gửi: ' + (me.name || 'chuyên viên tư vấn') + (me.phone ? ' – ' + me.phone : ''),
current ? '\nBản nháp hiện có (có thể dựa vào để viết lại tốt hơn):\n' + current : '',
].filter(x => x !== '').join('\n');
}
export async function openComposer(ctx, customer, opts = {}) {
const _o0 = kit(ctx);
const _o9 = customer && customer.id ? (await _o0.get('objects', customer.id)) || customer : customer;
const _o5 = gate(_o9, 'contact');
if (!_o5.ok) { _o0.toast(_o5.reason, 'warn'); return null; }
const _o1 = gate(_o9, 'ai').ok;
let me = await _o0.me();
const templates = await allTemplates(_o0);
let current = templates.find(t => t.id === opts.templateId) || (opts.text ? null : templates[0]);
const extra = opts.extra || {};
const _o3 = h('input', { value: extra.so_tien ? _o0.money(extra.so_tien) : (customer.budget ? _o0.money(customer.budget) : ''), placeholder: 'VD: 300tr', 'data-testid': 'z-amount' });
const _o6 = h('input', { value: extra.ngay || '', placeholder: 'VD: 20/11/2026 lúc 9h', 'data-testid': 'z-date' });
const ta = h('textarea', { rows: 8, class: 'bds-zalo-text', 'data-testid': 'z-text' }, opts.text || '');
const status = h('small', { class: 'bds-muted', role: 'status' });
const vars = () => {
const _ov = crm.templateVars(customer, me, { projects: _o0.projects() }, {});
const n = crm.parseMoney(_o3.value);
_ov.so_tien = n || '';
_ov.so_tien_text = n ? _o0.money(n) : '';
_ov.ngay = _o6.value.trim();
if (!me.phone) _ov.sdt_toi = PHONE_MARK;
if (!me.name) _ov.ten_toi = NAME_MARK;
return _ov;
};
const apply = t => {
current = t;
ta.value = crm.fillTemplate(t.text, vars(), { money: _o0.money });
chips.querySelectorAll('button').forEach(b => b.classList.toggle('bds-on', b.dataset.tid === t.id));
};
const chips = h('div', { class: 'bds-chips', 'data-testid': 'z-templates' }, templates.map(t =>
h('button', { type: 'button', class: 'bds-chip', 'data-tid': t.id, onclick: () => apply(t) }, t.title, t.skill ? ' ·' : '')));
[_o3, _o6].forEach(i => i.addEventListener('change', () => { if (current) apply(current); }));
const prompt = () => buildPrompt({ customer, me, vars: vars(), purpose: current ? current.title : 'chăm sóc khách', current: ta.value.trim() });
const runAI = async () => {
if (!ctx.ai || typeof ctx.ai.run !== 'function') { _o0.toast('Chưa bật AI trong Cài đặt', 'warn'); return; }
status.textContent = 'AI đang viết…';
try {
const _og = await ctx.ai.run('zalo_draft', { prompt: prompt(), json: false, feature: 'zalo_draft' });
const t = _o2(_og).trim();
if (t) { ta.value = t.replace(/^["“]|["”]$/g, ''); status.textContent = 'AI đã viết xong – đọc lại trước khi gửi.'; }
else status.textContent = 'AI chưa trả lời. Thử "Làm bằng Claude" hoặc "Làm bằng Gemini".';
} catch (e) {
if (_o0.isAiCancel(e)) { status.textContent = ''; return; }
status.textContent = (e && e.message) || 'AI chưa trả lời. Thử "Làm bằng Claude" hoặc "Làm bằng Gemini".';
}
};
const handoff = async provider => {
if (!ctx.ai || typeof ctx.ai.handoff !== 'function') { await _o0.copy(prompt()); _o0.toast('Đã chép lời nhắn cho AI', 'info'); return; }
try {
const _og = await ctx.ai.handoff('zalo_draft', prompt(), { target: /gemini/.test(provider) ? 'gemini' : 'claude', provider });
const t = _o2(_og).trim();
if (t) ta.value = t;
} catch (e) { _o0.toast((e && e.message) || 'Chưa mở được trang AI', 'warn'); }
};
const send = async () => {
const text = ta.value.trim();
if (!text) { _o0.toast('Chưa có nội dung tin', 'warn'); return; }
if (text.includes(PHONE_MARK)) { _o0.toast('Tin còn chỗ trống ' + PHONE_MARK + ' – thêm số điện thoại của anh/chị trước khi gửi.', 'warn'); askMyPhone(_o0, { onSaved: _of }); return; }
const phone = customer.zalo || customer.phone;
await _o0.copy(text);
if (phone) { try { window.open(_o0.zaloLink(phone), '_blank', 'noopener'); } catch { } }
await _o0.logEvent(customer.id, 'zalo', 'Tin Zalo' + (current ? ' (' + current.title + ')' : '') + ': ' + text.slice(0, 300), { template: current ? current.id : '', full: text });
if (opts.draftId) await markDraft(_o0, opts.draftId, 'sent');
_o0.toast('Đã chép tin. Dán vào Zalo rồi bấm Gửi.', 'success');
_or.close();
if (opts.onSent) opts.onSent();
};
const saveDraft = async () => {
const text = ta.value.trim();
if (!text) return;
if (opts.draftId) {
const d = await _o0.get('events', opts.draftId);
if (d) await _o0.put('events', { ...d, text });
} else {
await _o0.put('events', { object_id: customer.id, type: 'zalo_draft', text, at: Date.now(), data: JSON.stringify({ status: 'pending', template: current ? current.id : '' }) });
}
_o0.toast('Đã lưu nháp ở mục Chờ duyệt', 'success');
_or.close();
};
async function _of() {
me = await _o0.me();
if (phoneBox) phoneBox.remove();
if (current) apply(current); else if (me.phone) ta.value = ta.value.split(PHONE_MARK).join(me.phone);
}
const phoneBox = me.phone ? null : phonePrompt(_o0, { onSaved: _of, testid: 'z-add-phone' });
const _or = _o0.modal({ wide: true, title: 'Soạn tin Zalo – ' + (customer.name || ''), testid: 'zalo-composer', body: h('div', { class: 'bds-form' },
h('p', { class: 'bds-muted' }, 'Chọn mẫu, sửa lại cho hợp. App chỉ chép tin và mở Zalo – anh/chị tự dán và bấm Gửi.'),
!me.name ? h('p', { class: 'bds-warn', 'data-testid': 'z-profile-warn' }, PROFILE_HINT, ' ', h('a', { href: '#/settings/profile' }, 'Mở Cài đặt')) : null,
phoneBox,
chips,
h('div', { class: 'bds-grid2' }, _o0.field('Số tiền (điền vào tin)', _o3), _o0.field('Ngày (điền vào tin)', _o6)),
ta, status,
_o1 ? h('div', { class: 'bds-acts bds-wrap' },
_o0.button('✨ Viết bằng AI', runAI, { testid: 'z-ai', ai: 'zalo_draft' }),
_o0.button('Làm bằng Claude', () => handoff('handoff_claude'), { testid: 'z-claude', aiBadge: 'handoff' }),
_o0.button('Làm bằng Gemini', () => handoff('handoff_gemini'), { testid: 'z-gemini', aiBadge: 'handoff' }))
: h('p', { class: 'bds-muted', 'data-testid': 'z-ai-off' }, 'Khách chưa đồng ý để AI xử lý thông tin – soạn tay, không dùng AI.'),
h('div', { class: 'bds-row bds-end' },
_o0.button('Lưu nháp', saveDraft, { testid: 'z-draft' }),
_o0.button('Chép & mở Zalo', send, { kind: 'primary', testid: 'z-send' }))) });
if (current && !opts.text) apply(current);
return _or;
}
export async function markDraft(_o0, id, status) {
const d = await _o0.get('events', id);
if (d) { await _o0.put('events', { ...d, data: JSON.stringify({ ...crm.parseData(d.data), status }) }); return; }
const list = await _o0.setting('zalo_drafts', []);
if (Array.isArray(list) && list.some(x => x.id === id)) await _o0.setSetting('zalo_drafts', list.map(x => x.id === id ? { ...x, status } : x));
}
export async function mount(el, ctx) {
const _o0 = kit(ctx);
const me = await _o0.me();
const projects = _o0.projects();
const _o7 = projects.find(_oe => Array.isArray(_oe.types) && _oe.types.some(t => Array.isArray(t.a))) || projects[0] || {};
const _o8 = ((_o7.types || []).find(t => Array.isArray(t.a)) || {}).n || '2N';
const _op = { ten: 'Hoa', project: _o7.id || '', loai_can: _o8, so_tien: crm.fromPrice(_o7, _o8), ngay: crm.dmy(Date.now() + 2 * 86400000) };
const _oq = () => {
const _oe = projects.find(x => x.id === _op.project) || {};
return { ten: _op.ten, du_an: _oe.name || '', loai_can: _op.loai_can, so_tien: _op.so_tien || '', ngay: _op.ngay,
ten_toi: me.name || '[Tên của anh/chị]', sdt_toi: me.phone || '[SĐT của anh/chị]' };
};
const _ob = h('div', { class: 'bds-list' });
async function _oj() {
const templates = await allTemplates(_o0);
_ob.innerHTML = '';
templates.forEach(t => _ob.appendChild(_o0.card({
title: t.title + (t.skill ? ' (' + t.skill + ')' : t.custom ? ' · mẫu riêng' : t.edited ? ' · đã sửa' : ''),
body: h('p', { class: 'bds-pre' }, crm.fillTemplate(t.text, _oq(), { money: _o0.money })),
actions: [
t.skill ? null : _o0.button('✎ Sửa', () => _od(t), { testid: 'z-edit-' + t.id }),
_o0.button('Chép mẫu', async () => { await _o0.copy(t.text); _o0.toast('Đã chép mẫu', 'success'); }),
].filter(Boolean),
})));
}
function _od(t) {
const title = h('input', { value: t ? t.title : '', placeholder: 'VD: Mời xem nhà mẫu cuối tuần', 'data-testid': 'z-ed-title' });
const ta = h('textarea', { rows: 7, 'data-testid': 'z-ed-text' }, t ? t.text : 'Dạ em chào anh/chị {ten}, ');
const preview = h('p', { class: 'bds-pre bds-preview', 'data-testid': 'z-ed-preview' });
const warn = h('p', { class: 'bds-warn', role: 'status' });
const _oi = () => {
preview.textContent = crm.fillTemplate(ta.value, _oq(), { money: _o0.money });
const _o4 = crm.unknownVars(ta.value);
warn.textContent = _o4.length ? 'Biến không có trong danh sách (sẽ bị bỏ trống): ' + _o4.map(b => '{' + b + '}').join(', ') : '';
};
const _oa = key => {
const _ou = '{' + key + '}'; const _ot = ta.selectionStart ?? ta.value.length, en = ta.selectionEnd ?? ta.value.length;
ta.value = ta.value.slice(0, _ot) + _ou + ta.value.slice(en); ta.focus(); ta.selectionStart = ta.selectionEnd = _ot + _ou.length; _oi();
};
ta.addEventListener('input', _oi);
const chips = h('div', { class: 'bds-chips', 'data-testid': 'z-ed-vars' }, crm.TEMPLATE_VARS.map(_ov =>
h('button', { type: 'button', class: 'bds-chip', 'data-var': _ov.key, onclick: () => _oa(_ov.key), title: 'Chèn {' + _ov.key + '}' }, '+ ' + _ov.label)));
const save = async () => {
try {
const cfg = await _o0.setting('zalo_templates', {});
await _o0.setSetting('zalo_templates', crm.saveTemplateEdit(cfg, t, { title: title.value, text: ta.value }));
_o0.toast('Đã lưu mẫu', 'success'); _oc.close(); _oj();
} catch (e) { warn.textContent = (e && e.message) || 'Chưa lưu được'; }
};
const reset = async () => {
const cfg = await _o0.setting('zalo_templates', {});
await _o0.setSetting('zalo_templates', crm.resetTemplate(cfg, t.id)); _o0.toast('Đã khôi phục mẫu gốc', 'success'); _oc.close(); _oj();
};
const del = async () => {
if (!(await _o0.confirm({ title: 'Xoá mẫu riêng?', text: 'Xoá mẫu "' + t.title + '". Không ảnh hưởng tin đã gửi.', ok: 'Xoá', kind: 'danger' }))) return;
const cfg = await _o0.setting('zalo_templates', {});
await _o0.setSetting('zalo_templates', crm.removeTemplate(cfg, t.id)); _oc.close(); _oj();
};
const _oc = _o0.modal({ wide: true, title: t ? 'Sửa mẫu tin' : 'Thêm mẫu tin', testid: 'z-editor', body: h('div', { class: 'bds-form' },
_o0.field('Tên mẫu', title),
h('p', { class: 'bds-muted' }, 'Bấm để chèn biến vào chỗ con trỏ – app tự điền theo từng khách:'), chips,
_o0.field('Nội dung', ta), warn,
h('p', { class: 'bds-muted' }, 'Xem trước:'), preview,
h('div', { class: 'bds-row bds-end bds-wrap' },
t && t.edited ? _o0.button('Khôi phục mẫu gốc', reset, { testid: 'z-ed-reset' }) : null,
t && t.custom ? _o0.button('Xoá mẫu', del, { kind: 'danger', testid: 'z-ed-del' }) : null,
_o0.button('Huỷ', () => _oc.close()),
_o0.button('Lưu mẫu', save, { kind: 'primary', testid: 'z-ed-save' }))) });
_oi();
}
const _on = h('input', { value: _op.ten, 'data-testid': 'z-s-ten' });
const _om = h('select', { 'data-testid': 'z-s-project' }, projects.map(_oe => h('option', { value: _oe.id, selected: _oe.id === _op.project }, _oe.name)));
const _oo = h('input', { value: _op.loai_can, 'data-testid': 'z-s-type' });
const _ol = h('input', { value: _op.so_tien ? _o0.money(_op.so_tien) : '', 'data-testid': 'z-s-money' });
const _ok = h('input', { value: _op.ngay, 'data-testid': 'z-s-day' });
const _oh = () => { const _oe = projects.find(x => x.id === _op.project); const _ov = crm.fromPrice(_oe, _op.loai_can); _op.so_tien = _ov; _ol.value = _ov ? _o0.money(_ov) : ''; };
_on.addEventListener('input', () => { _op.ten = _on.value; _oj(); });
_om.addEventListener('change', () => { _op.project = _om.value; _oh(); _oj(); });
_oo.addEventListener('change', () => { _op.loai_can = _oo.value.trim(); _oh(); _oj(); });
_ol.addEventListener('change', () => { _op.so_tien = crm.parseMoney(_ol.value) || ''; _oj(); });
_ok.addEventListener('input', () => { _op.ngay = _ok.value; _oj(); });
el.innerHTML = '';
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'zalo-library' },
h('div', { class: 'bds-head' }, h('h2', null, 'Mẫu tin Zalo'), _o0.button('+ Thêm mẫu', () => _od(null), { kind: 'primary', testid: 'z-add' })),
h('p', { class: 'bds-muted' }, 'Bấm ✎ Sửa để đổi câu chữ và biến. Soạn cho từng khách trong hồ sơ khách – app tự điền tên, dự án, số tiền.'),
(!me.name || !me.phone) ? h('p', { class: 'bds-warn', 'data-testid': 'z-profile-warn' }, PROFILE_HINT, ' ', h('a', { href: '#/settings' }, 'Mở Cài đặt')) : null,
h('details', { class: 'bds-sample' }, h('summary', null, 'Giá trị xem thử (đổi được)'),
h('div', { class: 'bds-grid2' }, _o0.field('Tên khách', _on), _o0.field('Dự án', _om), _o0.field('Loại căn', _oo),
_o0.field('Số tiền – mặc định = giá tham khảo thấp nhất của loại căn', _ol), _o0.field('Ngày', _ok))),
_ob));
await _oj();
}
export default {
manifest: {
id: 'zalo', title: 'Mẫu tin Zalo', icon: '💬', screen: 'customers', order: 30, version: '1.0.0', status: 'ready',
help: 'Mẫu tin lịch sự cho từng tình huống; AI viết giúp; app chép tin và mở Zalo, anh/chị tự bấm Gửi.',
},
mount,
async selftest(ctx) {
const _og = await selftestCommon(ctx, ['fmt.money', 'link.zalo'], div => mount(div, ctx));
if (crm.TEMPLATES.length < 8) return { ok: false, details: 'Thiếu mẫu tin' };
return _og;
},
};

import { dmy, isPerpetual, scopeCovers } from './license_logic.16b4f5bd9e.js';
export const GIFT_ASK = 'Có mã tặng?';
export const GIFT_GO = 'Nhận quà';
const _o1 = /^G[0-9A-Z]{8}$/;
export const isGiftPayload = (_oa) => !!_oa && _oa.k === 'k' && _o1.test(String(_oa.id || ''));
export function giftFor(payloads, packId, now = Date.now()) {
let _o2 = null;
for (const _oa of payloads || []) {
if (isGiftPayload(_oa) && scopeCovers(_oa.sc, packId) && Number(_oa.exp) > now && (!_o2 || Number(_oa.exp) > Number(_o2.exp))) _o2 = _oa;
}
return _o2 ? { id: String(_o2.id), exp: Number(_o2.exp), perpetual: isPerpetual(_o2.exp), sc: String(_o2.sc || '') } : null;
}
export function giftText(_o6, fmt = dmy) { return !_o6 ? '' : _o6.perpetual ? '🎁 Tặng vĩnh viễn' : '🎁 Tặng tới ' + fmt(_o6.exp); }
export function normGiftCode(v) {
return String(v == null ? '' : v).slice(0, 100).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
.toUpperCase().replace(/[\s\-_.–—]+/g, '');
}
export const giftCodeOk = (c) => /^[A-Z0-9]{4,24}$/.test(String(c || '')) && /[A-Z]/.test(String(c || ''));
export const GIFT_ERR_KIND = { GIFT_FORMAT: 'format', GIFT_INVALID: 'invalid', GIFT_USED: 'used', GIFT_FULL: 'full', NEEDS_BASE: 'base', GIFT_EDITION: 'edition',
RATE_LIMIT: 'rate', NETWORK: 'network', NEED_IDENTITY: 'identity', NOT_REGISTERED: 'register', UNKNOWN_ACTION: 'old_server' };
export const GIFT_FALLBACK = {
format: 'Mã tặng gõ chưa đúng – mã gồm 4–24 chữ cái hoặc số, không dấu (vd TANGVIDEO).',
invalid: 'Mã tặng không đúng hoặc đã hết hạn. Kiểm tra lại từng chữ hoặc hỏi lại người tặng.',
used: 'Tài khoản Google này đã nhận mã tặng này rồi – mỗi tài khoản nhận 1 lần.',
full: 'Mã tặng này đã hết lượt nhận – hỏi người tặng mã khác.',
base: 'Quà tặng gói chỉ dùng được khi app đang dùng thử hoặc đã có Gói Cơ bản – mua Gói Cơ bản trước rồi nhập lại mã.',
edition: 'Mã tặng này dành cho bản khác (Cá nhân / Công ty) với app của anh/chị.',
rate: 'Anh/chị đã nhập mã quá nhiều lần – thử lại sau 1 giờ.',
network: 'Không kết nối được máy chủ bản quyền – kiểm tra mạng rồi thử lại.',
old_server: 'Người bán chưa bật mã tặng gói – liên hệ người bán.',
other: 'Chưa nhận được quà – thử lại sau ít phút.'
};
export function giftErrorView(e) {
const kind = GIFT_ERR_KIND[e && e.code] || 'other';
if (kind === 'network') return { kind, text: GIFT_FALLBACK.network };
return { kind, text: (e && e.userMessage) || GIFT_FALLBACK[kind] || (e && e.message) || GIFT_FALLBACK.other };
}
export function giftOkText(_oc, fmt = dmy) {
const _od = (_oc && _oc.packs_label) || 'gói được tặng';
return '🎁 Đã nhận quà: ' + _od + (_oc && _oc.perpetual ? ' – tặng vĩnh viễn' : ' – tặng tới ' + fmt(_oc && _oc.until)) + '. Dùng được ngay: ở Cài đặt › Gói chức năng bấm Cài hoặc bật công tắc của gói.';
}
export function giftCardView({ state = null, payloads = [], def = null, st = '', owner = true, now = Date.now() } = {}) {
const _o9 = { show: false, badge: '' };
if (!state || state.enabled === false || !owner || !def || def.kind === 'core' || def.experimental || st === 'dev' || st === 'experimental') return _o9;
if (state.model === 'whole_app' || state.mode === 'unconfigured' || state.misconfigured) return _o9;
const _o6 = giftFor(payloads, def.id, now);
const _ob = (payloads || []).some((_oa) => _oa && _oa.k === 'k' && !isGiftPayload(_oa) && isPerpetual(_oa.exp) && scopeCovers(_oa.sc, def.id));
return { show: !_ob, badge: giftText(_o6), gift: _o6 };
}
const _o0 = new Map();
function _o4(id) { const f = _o0.get(id); if (f && Date.now() - f.at < 20000) return f; _o0.delete(id); return null; }
export function giftBox(ui, { testid = 'gift', badge = '', onRedeem, onDone, open = false, lead = '' } = {}) {
const { h, button, field } = ui;
const _o8 = h('div', { class: 'lic-gift-msg', 'aria-live': 'polite' });
const f = field({ label: 'Mã tặng', type: 'text', placeholder: 'VD: TANGVIDEO', id: testid + '-input' });
if (f.input) { f.input.setAttribute('autocomplete', 'off'); f.input.setAttribute('autocapitalize', 'characters'); f.input.setAttribute('spellcheck', 'false'); f.input.setAttribute('data-testid', testid + '-input'); }
const show = (m) => {
ui.clear(_o8);
if (!m) return;
_o8.appendChild(m.ok ? h('p', { class: 'lic-okbox', 'data-testid': testid + '-ok' }, m.text)
: h('p', { class: 'lic-err', role: 'alert', 'data-testid': testid + '-err', dataset: { kind: m.kind || '' } }, m.text));
};
const _o7 = button(GIFT_GO, async () => {
show(null);
const code = normGiftCode(f.getValue ? f.getValue() : f.input.value);
if (!giftCodeOk(code)) { const m = { kind: 'format', text: GIFT_FALLBACK.format }; _o0.set(testid, { ...m, at: Date.now() }); show(m); return; }
let _oc;
try { _oc = await onRedeem(code); } catch (e) { const v = giftErrorView(e); _o0.set(testid, { ...v, at: Date.now() }); show(v); return; }
const m = { ok: true, text: giftOkText(_oc) };
_o0.set(testid, { ...m, at: Date.now() });
show(m);
if (f.setValue) f.setValue('');
try { ui.toast(m.text, 'ok', 6000); } catch { }
if (typeof onDone === 'function') { try { onDone(_oc); } catch { } }
}, { kind: 'primary', small: true, icon: '🎁', testid: testid + '-go' });
const _o5 = h('div', { class: 'lic-gift-form', 'data-testid': testid + '-form' }, lead ? h('p', { class: 'muted' }, lead) : null, f, h('div', { class: 'btn-row' }, _o7), _o8);
const _o3 = _o4(testid);
_o5.hidden = !(open || _o3);
const ask = button(GIFT_ASK, () => { _o5.hidden = !_o5.hidden; ask.setAttribute('aria-expanded', String(!_o5.hidden)); if (!_o5.hidden && f.input) f.input.focus(); },
{ kind: 'ghost', small: true, icon: '🎁', testid: testid + '-ask' });
ask.setAttribute('aria-expanded', String(!_o5.hidden));
show(_o3);
return h('div', { class: 'lic-gift', 'data-testid': testid }, badge ? h('span', { class: 'lic-gift-badge', 'data-testid': testid + '-badge' }, badge) : null, ask, _o5);
}
export default { GIFT_ASK, GIFT_GO, isGiftPayload, giftFor, giftText, normGiftCode, giftCodeOk, giftErrorView, giftOkText, giftCardView, giftBox, GIFT_FALLBACK, GIFT_ERR_KIND };

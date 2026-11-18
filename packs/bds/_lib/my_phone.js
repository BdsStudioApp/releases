import { h } from './kit.js';
import * as crm from './crm.js';
export const ADD_PHONE = 'Thêm số điện thoại của anh/chị';
export async function saveMyPhone(K, raw) {
const phone = crm.normPhone(raw);
if (!crm.validPhone(phone)) throw new Error('Số điện thoại chưa đúng (10 số, bắt đầu bằng 0).');
const _o2 = K.ctx && K.ctx.user;
if (_o2 && _o2.role && _o2.role !== 'owner') {
await K.api('me.update', { phone });
_o2.phone = phone;
} else {
const p = (await K.setting('profile', {})) || {};
await K.setSetting('profile', { ...p, phone });
}
return phone;
}
export function askMyPhone(K, { onSaved } = {}) {
const _o0 = h('input', { type: 'tel', inputmode: 'tel', autocomplete: 'tel', placeholder: 'VD: 0912 345 678', 'data-testid': 'my-phone-input' });
const err = h('p', { class: 'bds-error', role: 'alert', 'data-testid': 'my-phone-err' });
const save = async () => {
err.textContent = '';
try {
const phone = await saveMyPhone(K, _o0.value);
_o1.close();
K.toast('Đã lưu số điện thoại ' + K.phone(phone), 'success');
if (onSaved) await onSaved(phone);
} catch (e) { err.textContent = (e && (e.userMessage || e.message)) || 'Chưa lưu được – thử lại.'; _o0.focus(); }
};
_o0.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); save(); } });
const _o1 = K.modal({ title: ADD_PHONE, testid: 'my-phone-modal', body: [
h('p', { class: 'bds-muted' }, 'Số này in trên tin nhắn Zalo, trang landing và ảnh báo giá gửi khách. Sửa lại được ở Cài đặt › Thông tin cá nhân.'),
K.field('Số điện thoại', _o0), err,
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _o1.close(), { icon: 'close' }), K.button('Lưu số', save, { kind: 'primary', icon: 'check', testid: 'my-phone-save' }))] });
setTimeout(() => { try { _o0.focus(); } catch { } }, 50);
return _o1;
}
export function phonePrompt(K, { onSaved, testid = 'add-my-phone', text } = {}) {
return h('div', { class: 'bds-warn', 'data-testid': testid + '-box' },
h('span', null, text || 'Chưa có số điện thoại của anh/chị – tin gửi khách sẽ thiếu số liên hệ. '),
K.button(ADD_PHONE, () => askMyPhone(K, { onSaved }), { kind: 'primary', icon: 'phone', testid }));
}

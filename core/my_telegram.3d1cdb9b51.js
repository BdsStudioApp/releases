import { t } from './i18n.17f01a0b54.js';
export async function renderMyTelegram(body, ctx, app) {
const { ui, api } = ctx;
const { h, button, badge, field } = ui;
const me = ctx.user || {};
const state = { token: !!Number(me.telegram_token_set), chat: me.telegram_chat_id || '' };
const _oa = () => { try { const _o0 = app && app.auth; if (_o0 && typeof _o0.me === 'function') _o0.me().catch(() => { }); } catch { } };
const stBox = h('div', { class: 'chips', 'data-testid': 'mytg-status' });
const _o5 = h('p', { class: 'muted', 'aria-live': 'polite', 'data-testid': 'mytg-out' });
const _o7 = () => ui.mountTo(stBox,
badge(state.token ? 'Đã có mã bot' : 'Chưa có mã bot', state.token ? 'ok' : 'neutral'),
badge(state.chat ? 'Chat id: ' + state.chat : 'Chưa có chat id', state.chat ? 'ok' : 'neutral'));
_o7();
const _ob = (n, ...c) => h('li', null, h('span', { class: 'step-n' }, String(n)), h('div', null, ...c));
const tokenF = field({ label: 'Mã bot', type: 'password', name: 'tg_token', autocomplete: 'off', placeholder: state.token ? '••••••••  đã lưu – dán mã bot mới để thay' : '123456789:AA…' });
tokenF.input.setAttribute('data-testid', 'mytg-token');
const _o1 = (e, box = _o5) => { box.textContent = (e && (e.userMessage || e.message)) || t('err.generic'); ui.toast(box.textContent, 'error'); };
const chatF = field({ label: 'Chat id (nếu tự biết)', name: 'tg_chat', inputmode: 'numeric', autocomplete: 'off' });
const own = [
h('p', { class: 'lead mytg-why' }, 'Tạo bot Telegram riêng (miễn phí). Khi được chia khách, bot này báo ngay cho riêng anh/chị.'),
h('ol', { class: 'steps', 'data-testid': 'mytg-steps' },
_ob(1, 'Mở Telegram, tìm ', h('strong', null, '@BotFather'), ' (có dấu tích xanh).'),
_ob(2, 'Bấm ', h('strong', null, 'Start'), '.'),
_ob(3, 'Gửi ', h('code', null, '/newbot'), '.'),
_ob(4, 'Đặt tên hiển thị (vd "Báo khách – Lan").'),
_ob(5, 'Đặt tên bot kết thúc bằng ', h('code', null, 'bot'), ' (vd ', h('code', null, 'baokhach_lan_bot'), ').'),
_ob(6, 'Chép ', h('strong', null, 'mã bot'), ' (token) BotFather gửi về, dạng ', h('code', null, '123456789:AA…'), '.'),
_ob(7, 'Dán mã bot vào ô dưới, bấm ', h('strong', null, 'Lưu mã bot'), '.'),
_ob(8, 'Mở bot vừa tạo (link t.me/… trong tin của BotFather), bấm ', h('strong', null, 'Start'), '.'),
_ob(9, 'Bấm ', h('strong', null, 'Tự tìm chat id'), '.'),
_ob(10, 'Bấm ', h('strong', null, 'Gửi thử'), ' – thấy tin nhắn là xong.')),
h('div', { class: 'sub-block' }, tokenF,
h('div', { class: 'btn-row' },
button('Lưu mã bot', async () => {
const _oc = String(tokenF.getValue() || '').trim();
if (!/^\d{5,}:[A-Za-z0-9_-]{20,}$/.test(_oc)) { _o5.textContent = 'Mã bot chưa đúng dạng 123456789:AA… (chép nguyên dòng từ BotFather).'; return; }
try { await api.call('telegram.set_mine', { token: _oc }); } catch (e) { return _o1(e); }
tokenF.setValue(''); tokenF.input.placeholder = '••••••••  đã lưu – dán mã bot mới để thay';
state.token = true; _o7(); _o5.textContent = 'Đã lưu mã bot. Làm tiếp bước 8.'; ui.toast(t('common.saved'), 'ok');
}, { kind: 'primary', icon: 'check', testid: 'mytg-save' }),
button('Tự tìm chat id', async () => {
try {
const _o9 = await api.call('telegram.find_chat_id_mine', {});
const id = _o9 && (_o9.chat_id || _o9.id);
if (id) { state.chat = String(id); _o7(); _o5.textContent = 'Đã tìm thấy chat id ' + id + '. Bấm "Gửi thử".'; _oa(); }
else _o5.textContent = 'Chưa thấy tin nhắn. Mở bot, bấm Start rồi thử lại.';
} catch (e) { _o1(e); }
}, { kind: 'secondary', icon: 'pulse', testid: 'mytg-find' }),
button('Gửi thử', async () => {
try { await api.call('telegram.test', { mine: true }); _o5.textContent = 'Đã gửi tin thử. Mở Telegram để xem.'; ui.toast(t('set.conn.telegram.sent'), 'ok'); _oa(); } catch (e) { _o1(e); }
}, { kind: 'secondary', icon: 'sparkle', testid: 'mytg-test' })),
stBox, _o5),
h('details', { class: 'mytg-manual' }, h('summary', null, 'Nhập chat id thủ công'),
h('div', { class: 'stack' }, chatF, h('div', { class: 'btn-row' }, button(t('common.save'), async () => {
const _oc = String(chatF.getValue() || '').trim();
if (!/^-?\d{3,}$/.test(_oc)) { _o5.textContent = 'Chat id là dãy số.'; return; }
try { await api.call('telegram.set_mine', { chat_id: _oc }); } catch (e) { return _o1(e); }
state.chat = _oc; _o7(); ui.toast(t('common.saved'), 'ok'); _oa();
}, { kind: 'secondary', small: true }))))
];
if (!me.tg_company || me.legacy) { body.append(...own); return; }
const _o6 = h('details', { class: 'mytg-own', 'data-testid': 'mytg-own' }, h('summary', null, 'Cách 2: Tự tạo bot riêng'), ...own);
_o6.open = true;
const _o2 = h('p', { class: 'muted', 'aria-live': 'polite', 'data-testid': 'mytg-join-out' }, 'Đang lấy link nối…');
const jBody = h('div', { class: 'stack' });
const _o3 = h('section', { class: 'mytg-join sub-block', 'data-testid': 'mytg-join' },
h('p', { class: 'lead mytg-why' }, h('strong', null, 'Cách nhanh (1 phút): nối qua bot của công ty.'), ' Không cần tạo bot.'),
jBody, _o2);
body.append(_o3, _o6);
let _o9;
try { _o9 = await api.call('telegram.join_link', {}); } catch (e) { _o9 = { available: false, message: (e && (e.userMessage || e.message)) || t('err.generic') }; }
if (!_o9 || !_o9.available) {
_o2.textContent = (_o9 && _o9.message) || 'Bot công ty chưa dùng được để nối nhanh. Anh/chị làm theo cách "Tự tạo bot riêng" bên dưới.';
_o6.open = true;
return;
}
const _o4 = !!_o9.connected || me.tg_via === 'company';
const jSteps = h('ol', { class: 'steps', 'data-testid': 'mytg-join-steps' },
_ob(1, 'Bấm ', h('strong', null, 'Mở Telegram'), ' (mở bot @' + _o9.bot + ').'),
_ob(2, 'Trong Telegram bấm ', h('strong', null, 'Start'), ' (Bắt đầu).'),
_ob(3, 'Quay lại app, bấm ', h('strong', null, 'Kiểm tra'), '.'));
const status = h('div', { class: 'chips' });
const _o8 = (_oc) => ui.mountTo(status, badge(_oc ? 'Đã nối qua bot công ty' : 'Chưa nối', _oc ? 'ok' : 'neutral'));
_o8(_o4);
ui.mountTo(jBody, jSteps,
h('div', { class: 'btn-row' },
h('a', { class: 'btn btn-primary', href: _o9.url, target: '_blank', rel: 'noopener', 'data-testid': 'mytg-join-open' }, 'Mở Telegram'),
button('Kiểm tra', async () => {
try {
const c = await api.call('telegram.join_check', {});
if (c && c.connected) {
_o8(true); _o2.textContent = c.sent === false ? 'Đã nối. Tin thử chưa tới – bấm "Kiểm tra" lại sau ít phút.' : 'Đã nối. Mở Telegram xem tin thử.';
ui.toast('Đã nối Telegram', 'ok'); _o6.open = false; _oa();
} else {
_o2.textContent = (c && c.message) || 'Chưa thấy anh/chị bấm Start. Mở link, bấm Start rồi bấm lại "Kiểm tra".';
if (c && c.reason === 'webhook') _o6.open = true;
}
} catch (e) { _o1(e, _o2); }
}, { kind: 'secondary', icon: 'check', testid: 'mytg-join-check' })),
status);
_o2.textContent = _o4 ? 'Telegram đã nối. Muốn đổi sang tài khoản Telegram khác thì làm lại 3 bước.' : '';
_o6.open = me.tg_via === 'mine';
}

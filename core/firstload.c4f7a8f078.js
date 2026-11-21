import { contactFor, mailtoLink, supportDiagnosticText, isSaleEdition } from './support.818cd992ae.js';
export const SLOW_MS = 60000;
export const TABLE_LABEL = [['objects', 'khách hàng'], ['projects', 'dự án'], ['reminders', 'nhắc việc'], ['quotes', 'báo giá'], ['events', 'ghi chú'], ['settings', 'cài đặt']];
export function words(you = 'anh') {
return {
title: 'Đang tải dữ liệu lần đầu',
lead: 'Đang tải dữ liệu lần đầu từ Google Sheet của ' + you + ': khách hàng, dự án, cài đặt… (thường 10–30 giây). ' + you.charAt(0).toUpperCase() + you.slice(1) + ' vẫn xem được các màn trong lúc chờ.',
steps: { local: 'Mở dữ liệu trên máy này', screens: 'Tải các màn của app', sheet: 'Tải dữ liệu từ Google Sheet của ' + you },
slow: 'Lâu hơn bình thường – mạng chậm, hoặc Google đang bận. Bấm Thử lại; vẫn chậm thì Gửi cho hỗ trợ.',
done: 'Đã tải xong',
failed: 'Chưa tải được dữ liệu: '
};
}
export function countsText(counts = {}) {
return TABLE_LABEL.filter(([k]) => Number(counts[k]) > 0).map(([k, l]) => l + ' ' + Number(counts[k])).join(' · ');
}
export function showFirstLoad({ ui, store, config = {}, versions = {}, errors = () => [], slowMs = SLOW_MS, showAfterMs = 1500 } = {}) {
const { h, button } = ui;
const W = words(isSaleEdition(config) ? 'anh/chị' : 'anh');
const _o8 = {};
const _o7 = (k) => (_o8[k] = h('li', { 'data-step': k, 'data-state': 'wait' }, h('span', { class: 'fl-ico', 'aria-hidden': 'true' }, '…'), ' ', W.steps[k], h('span', { class: 'muted small fl-detail' })));
const slowBox = h('div', { class: 'fl-slow', hidden: true, 'data-testid': 'firstload-slow' });
const status = h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'firstload-status' });
const el = h('div', { class: 'firstload card', role: 'status', 'data-testid': 'firstload' },
h('h3', { class: 'fl-title' }, W.title),
h('p', { class: 'fl-lead' }, W.lead),
h('ol', { class: 'fl-steps', 'data-testid': 'firstload-steps' }, ['local', 'screens', 'sheet'].map(_o7)),
status, slowBox,
h('div', { class: 'btn-row' }, button('Ẩn', () => close(), { kind: 'ghost', small: true, icon: 'x', testid: 'firstload-hide' })));
let _o2 = false, finished = false, shown = false;
const mount = () => { const _o5 = document.querySelector('#app .panes'); if (_o5 && _o5.parentElement) { el.classList.add('fl-inline'); _o5.parentElement.insertBefore(el, _o5); } else document.body.appendChild(el); shown = true; };
const _ob = setTimeout(() => { if (!_o2 && !finished) mount(); }, showAfterMs);
const _o9 = (k, state, detail) => {
const _o6 = _o8[k]; if (!_o6) return;
_o6.dataset.state = state;
_o6.querySelector('.fl-ico').textContent = state === 'ok' ? '✓' : state === 'fail' ? '✗' : state === 'run' ? '⏳' : '…';
if (detail !== undefined) _o6.querySelector('.fl-detail').textContent = detail ? ' – ' + detail : '';
};
_o9('local', 'ok'); _o9('screens', 'run');
const _oc = setTimeout(() => { if (!finished) _oa(); }, slowMs);
function _oa() {
slowBox.hidden = false;
const _o1 = contactFor(config);
const _o3 = supportDiagnosticText({ versions, screen: 'Tải dữ liệu lần đầu', device: typeof navigator !== 'undefined' ? navigator.userAgent : '', errors: (errors() || []).slice(-5) });
const _o4 = _o1.email ? mailtoLink(_o1.email, 'BDS Studio – tải dữ liệu lần đầu quá lâu', 'Tải dữ liệu lần đầu quá 60 giây.\r\n\r\n' + _o3) : '';
ui.mountTo(slowBox, h('p', { class: 'fl-warn' }, '⚠️ ' + W.slow),
h('div', { class: 'btn-row' },
button('Thử lại', async () => {
_o9('sheet', 'run');
let _od = null; try { _od = await store.syncNow(); } catch { _od = null; }
if (_od && _od.lastSync) _o0.done(); else if (_od) _o9('sheet', 'fail', _od.error || 'chưa kết nối được');
}, { kind: 'primary', small: true, testid: 'firstload-retry' }),
_o4 ? h('a', { class: 'btn btn-secondary btn-sm', href: _o4, 'data-testid': 'firstload-support' }, 'Gửi cho hỗ trợ')
: button('Chép thông tin cho hỗ trợ', () => ui.copy(_o3), { kind: 'secondary', small: true, testid: 'firstload-support' })));
}
function close() { if (_o2) return; _o2 = true; clearTimeout(_oc); clearTimeout(_ob); el.remove(); }
const _o0 = {
el, close,
mark(step) {
if (step === 'screens') { _o9('screens', 'ok'); _o9('sheet', 'run'); }
},
async done() {
finished = true; clearTimeout(_oc);
if (!shown) { close(); return; }
_o9('screens', 'ok');
const counts = {};
for (const [k] of TABLE_LABEL) { try { counts[k] = (await store.list(k)).length; } catch { counts[k] = 0; } }
_o9('sheet', 'ok', countsText(counts));
status.textContent = W.done + '.';
slowBox.hidden = true;
setTimeout(close, 2500);
},
fail(msg) {
if (!shown && !_o2) { clearTimeout(_ob); mount(); }
_o9('sheet', 'fail', msg || '');
status.textContent = W.failed + (msg || '');
if (slowBox.hidden) _oa();
}
};
return _o0;
}
export default { showFirstLoad, words, countsText, TABLE_LABEL, SLOW_MS };

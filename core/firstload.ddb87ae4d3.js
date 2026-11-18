import { contactFor, mailtoLink, supportDiagnosticText, isSaleEdition } from './support.4921a97342.js';
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
const _o0 = words(isSaleEdition(config) ? 'anh/chị' : 'anh');
const _o9 = {};
const _o8 = (k) => (_o9[k] = h('li', { 'data-step': k, 'data-state': 'wait' }, h('span', { class: 'fl-ico', 'aria-hidden': 'true' }, '…'), ' ', _o0.steps[k], h('span', { class: 'muted small fl-detail' })));
const slowBox = h('div', { class: 'fl-slow', hidden: true, 'data-testid': 'firstload-slow' });
const status = h('p', { class: 'muted small', 'aria-live': 'polite', 'data-testid': 'firstload-status' });
const el = h('div', { class: 'firstload card', role: 'status', 'data-testid': 'firstload' },
h('h3', { class: 'fl-title' }, _o0.title),
h('p', { class: 'fl-lead' }, _o0.lead),
h('ol', { class: 'fl-steps', 'data-testid': 'firstload-steps' }, ['local', 'screens', 'sheet'].map(_o8)),
status, slowBox,
h('div', { class: 'btn-row' }, button('Ẩn', () => close(), { kind: 'ghost', small: true, icon: 'x', testid: 'firstload-hide' })));
let _o3 = false, finished = false, shown = false;
const mount = () => { const _o6 = document.querySelector('#app .panes'); if (_o6 && _o6.parentElement) { el.classList.add('fl-inline'); _o6.parentElement.insertBefore(el, _o6); } else document.body.appendChild(el); shown = true; };
const _oc = setTimeout(() => { if (!_o3 && !finished) mount(); }, showAfterMs);
const _oa = (k, state, detail) => {
const _o7 = _o9[k]; if (!_o7) return;
_o7.dataset.state = state;
_o7.querySelector('.fl-ico').textContent = state === 'ok' ? '✓' : state === 'fail' ? '✗' : state === 'run' ? '⏳' : '…';
if (detail !== undefined) _o7.querySelector('.fl-detail').textContent = detail ? ' – ' + detail : '';
};
_oa('local', 'ok'); _oa('screens', 'run');
const _od = setTimeout(() => { if (!finished) _ob(); }, slowMs);
function _ob() {
slowBox.hidden = false;
const _o2 = contactFor(config);
const _o4 = supportDiagnosticText({ versions, screen: 'Tải dữ liệu lần đầu', device: typeof navigator !== 'undefined' ? navigator.userAgent : '', errors: (errors() || []).slice(-5) });
const _o5 = _o2.email ? mailtoLink(_o2.email, 'BDS Studio – tải dữ liệu lần đầu quá lâu', 'Tải dữ liệu lần đầu quá 60 giây.\r\n\r\n' + _o4) : '';
ui.mountTo(slowBox, h('p', { class: 'fl-warn' }, '⚠️ ' + _o0.slow),
h('div', { class: 'btn-row' },
button('Thử lại', async () => {
_oa('sheet', 'run');
let _oe = null; try { _oe = await store.syncNow(); } catch { _oe = null; }
if (_oe && _oe.lastSync) _o1.done(); else if (_oe) _oa('sheet', 'fail', _oe.error || 'chưa kết nối được');
}, { kind: 'primary', small: true, testid: 'firstload-retry' }),
_o5 ? h('a', { class: 'btn btn-secondary btn-sm', href: _o5, 'data-testid': 'firstload-support' }, 'Gửi cho hỗ trợ')
: button('Chép thông tin cho hỗ trợ', () => ui.copy(_o4), { kind: 'secondary', small: true, testid: 'firstload-support' })));
}
function close() { if (_o3) return; _o3 = true; clearTimeout(_od); clearTimeout(_oc); el.remove(); }
const _o1 = {
el, close,
mark(step) {
if (step === 'screens') { _oa('screens', 'ok'); _oa('sheet', 'run'); }
},
async done() {
finished = true; clearTimeout(_od);
if (!shown) { close(); return; }
_oa('screens', 'ok');
const counts = {};
for (const [k] of TABLE_LABEL) { try { counts[k] = (await store.list(k)).length; } catch { counts[k] = 0; } }
_oa('sheet', 'ok', countsText(counts));
status.textContent = _o0.done + '.';
slowBox.hidden = true;
setTimeout(close, 2500);
},
fail(msg) {
if (!shown && !_o3) { clearTimeout(_oc); mount(); }
_oa('sheet', 'fail', msg || '');
status.textContent = _o0.failed + (msg || '');
if (slowBox.hidden) _ob();
}
};
return _o1;
}
export default { showFirstLoad, words, countsText, TABLE_LABEL, SLOW_MS };

async function _o2(fetchFn, url, opts = {}, ms = 4000) {
const _o0 = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _o9 = _o0 ? setTimeout(() => _o0.abort(), ms) : null;
try {
const _o4 = await fetchFn(url, { ...opts, signal: _o0 ? _o0.signal : undefined });
const _o1 = await _o4.json().catch(() => ({}));
if (!_o4.ok || _o1.ok === false) { const e = new Error((_o1.error && _o1.error.message) || 'Máy dựng trả lỗi ' + _o4.status); e.code = _o1.error && _o1.error.code; e.status = _o4.status; throw e; }
return _o1;
} finally { if (_o9) clearTimeout(_o9); }
}
const F = (fetchFn) => fetchFn || ((...a) => globalThis.fetch(...a));
export async function pairStatus(base, { fetchFn, id = '' } = {}) {
try {
const _o1 = await _o2(F(fetchFn), base + '/pair/status' + (id ? '?id=' + encodeURIComponent(id) : ''));
return { running: true, trusted: _o1.trusted === true, state: _o1.state || '' };
} catch (e) { return { running: !!e.status, trusted: false, error: e }; }
}
export async function pairStart(base, { fetchFn } = {}) {
return _o2(F(fetchFn), base + '/pair/start', { method: 'POST', body: '{}', headers: { 'Content-Type': 'text/plain;charset=utf-8' } });
}
export const fmtCode = (c) => String(c || '').replace(/^(\d{3})(\d{3})$/, '$1 $2');
export function pairBox(ui, base, { onPaired, fetchFn, pollMs = 2000 } = {}) {
const { h, button } = ui;
const _o3 = h('div', { class: 'hw-pair-out', 'aria-live': 'polite' });
let _o8 = null;
const _o6 = () => { if (_o8) clearTimeout(_o8); _o8 = null; };
const start = async () => {
_o6();
let _o1;
try { _o1 = await pairStart(base, { fetchFn }); } catch (e) {
_o3.replaceChildren(h('p', { class: 'form-error', role: 'alert' }, e.code === 'ORIGIN_DENIED' ? e.message : 'Chưa xin ghép được: ' + (e.message || 'máy dựng không trả lời') + '. Kiểm máy dựng đang chạy rồi thử lại.'));
return;
}
if (_o1.trusted) { if (onPaired) onPaired(); return; }
const _oa = Date.now() + (Number(_o1.expires_in) || 300) * 1000;
_o3.replaceChildren(
h('p', null, 'Mã ghép nối của app này:'),
h('p', { class: 'hw-pair-code', 'data-testid': 'engine-pair-code' }, fmtCode(_o1.code)),
h('p', { class: 'muted small' }, 'Mở trang của máy dựng, kiểm địa chỉ ', h('strong', null, typeof location !== 'undefined' ? location.origin : ''),
' và mã giống hệt mã trên, rồi bấm "Cho phép". Mã hết hạn sau 5 phút.'),
h('a', { class: 'btn btn-primary', href: _o1.confirm_url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'engine-pair-open' },
ui.icon ? ui.icon('external', 20) : null, h('span', null, 'Mở trang xác nhận của máy dựng')),
h('p', { class: 'muted small', 'data-testid': 'engine-pair-wait' }, 'Đang chờ anh/chị bấm "Cho phép" trên trang máy dựng…'));
const _o7 = async () => {
const _o5 = await pairStatus(base, { fetchFn, id: _o1.id });
if (_o5.trusted) { _o6(); if (ui.toast) ui.toast('Đã ghép nối máy dựng với app này', 'success', 4000); if (onPaired) onPaired(); return; }
if (_o5.state === 'denied' || _o5.state === 'expired' || _o5.state === 'unknown' || Date.now() > _oa) {
_o6();
_o3.replaceChildren(h('p', { class: 'form-error', role: 'alert' }, _o5.state === 'denied' ? 'Yêu cầu ghép đã bị từ chối trên máy dựng.' : 'Mã đã hết hạn – bấm "Ghép nối" lại.'));
return;
}
_o8 = setTimeout(_o7, pollMs);
};
_o8 = setTimeout(_o7, pollMs);
};
return h('div', { class: 'hw-pair', 'data-testid': 'engine-pair' },
h('h4', { class: 'section-title' }, 'Ghép nối máy dựng với app này'),
h('p', { class: 'muted small' }, 'Máy dựng đang chạy nhưng CHƯA tin địa chỉ app này. Vì an toàn, máy dựng chỉ nhận lệnh từ app đã ghép nối – mỗi địa chỉ app ghép 1 lần.'),
h('div', { class: 'btn-row' }, button('Ghép nối máy dựng', start, { kind: 'primary', icon: 'link', testid: 'engine-pair-start' })),
_o3);
}

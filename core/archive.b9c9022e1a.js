import { addDefaults } from './xkit.f03faf0986.js';
export const ARCHIVE_SECTION = 'archive';
export function archiveSummary(_of) {
const _o7 = (v) => (Number(v) || 0).toLocaleString('vi-VN');
if (!_of || _of.available === false) return { tone: 'neutral', text: 'Máy chủ này chưa có Sổ khách lưu trữ – cập nhật máy chủ lên bản 1.0.6 trở lên.', rows: [] };
const main = _of.main || {};
const rows = [['Khách trong Sheet chính', _o7(main.alive) + ' đang dùng · ' + _o7(main.deleted) + ' đã xoá trong app']];
if (!_of.exists) {
return { tone: _of.lost ? 'danger' : 'info', rows,
text: _of.lost ? 'Không thấy file sổ trên Drive (đã bị xoá hoặc nằm trong thùng rác). Bấm "Đồng bộ ngay" để tạo sổ mới.' : 'Chưa có sổ. Máy chủ sẽ tự tạo trong vòng 1 giờ, hoặc bấm "Đồng bộ ngay".' };
}
const _o1 = _of.book || {};
rows.unshift(['Khách trong sổ', _o7(_o1.total)]);
rows.push(['Mất khỏi Sheet chính', _o7(_o1.missing)]);
rows.push(['Đã xoá theo yêu cầu khách', _o7(_o1.erased)]);
if (Number(_of.not_in_book) > 0) rows.push(['Chưa vào sổ', _o7(_of.not_in_book) + ' khách (lần đồng bộ tới sẽ chép)']);
if (Number(_of.scrub_pending) > 0) rows.push(['Đang dọn bản sao lưu tuần', _o7(_of.scrub_pending) + ' khách xoá theo yêu cầu (máy chủ tự làm mỗi giờ)']);
const tone = Number(_o1.missing) > 0 || Number(_of.fail_count) >= 3 ? 'danger' : Number(_of.fail_count) > 0 ? 'warn' : 'ok';
const text = Number(_o1.missing) > 0 ? _o7(_o1.missing) + ' khách không còn trong Sheet chính – dữ liệu vẫn giữ trong sổ.'
: Number(_of.fail_count) > 0 ? 'Lần đồng bộ gần nhất chưa được: ' + (_of.last_error || 'lỗi không rõ') : 'Sổ đang đủ khách.';
return { tone, text, rows };
}
export function installArchive({ S, appHooks, ui }) {
const { h, button, badge, kv, toast } = ui;
addDefaults({ 'help.archive': 'Sổ khách lưu trữ: file Google Sheet riêng "BDS Studio – Sổ khách lưu trữ" trong Drive của anh/chị, không chia sẻ cho ai.\nMỗi giờ máy chủ chép mọi khách vào tab Danh bạ (cả khách đã xoá) và ghi mỗi thay đổi vào tab Lịch sử. Dòng khách lỡ bị xoá thẳng trên Google Sheet vẫn còn trong sổ, đánh dấu "Mất khỏi Sheet chính".\nKhi khách yêu cầu xoá dữ liệu (Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15), dùng nút "Xoá theo yêu cầu khách" trong hồ sơ khách: dữ liệu bị xoá khỏi cả Sheet chính lẫn sổ; bản sao lưu Sheet hằng tuần được máy chủ tự dọn trong khoảng 1 giờ. Bản sao lưu mã hoá anh/chị tự tạo (tệp "sao-luu-…") máy chủ không mở được – nếu cần, tự xoá các tệp đó.\nKhông sửa tay file sổ – máy chủ ghi theo vị trí cột.' });
const _o4 = () => !S.user || !S.user.role || S.user.role === 'owner';
const _oa = appHooks.lateSections;
appHooks.lateSections = (ctx) => [...(typeof _oa === 'function' ? _oa(ctx) : []),
...(_o4() ? [[ARCHIVE_SECTION, 'customers', 'Sổ khách lưu trữ', (body) => _oc(body)]] : [])];
async function _oc(body) {
const _o2 = h('div', { class: 'arc', 'data-testid': 'arc-panel' }, ui.spinner());
const result = h('div', { class: 'arc-check', 'data-testid': 'arc-check-result', hidden: true });
body.appendChild(_o2);
body.appendChild(result);
let _of = null;
const call = (action, payload) => S.api.call(action, payload || {}, { timeoutMs: 120000 });
function _o8() {
ui.clear(_o2);
const _od = archiveSummary(_of);
_o2.appendChild(h('p', { class: 'muted' }, 'Lưu mọi khách từng có – kể cả khách đã xoá – trong một file Google Sheet riêng trên Drive của anh/chị. Máy chủ tự chép mỗi giờ.'));
_o2.appendChild(h('p', { 'data-testid': 'arc-state' }, badge(_od.tone === 'ok' ? 'Ổn' : _od.tone === 'danger' ? 'Cần xem' : _od.tone === 'warn' ? 'Chú ý' : 'Thông tin', _od.tone), ' ', _od.text));
const rows = _od.rows.map(([k, v]) => [k, k === 'Mất khỏi Sheet chính' && _of.book && Number(_of.book.missing) > 0 ? badge(v, 'danger') : v]);
if (_of && _of.available !== false) rows.push(['Đồng bộ gần nhất', _of.last_sync_at ? ui.date(_of.last_sync_at, true) : 'chưa']);
if (_of && _of.recreated_at) rows.push(['Sổ được tạo lại lúc', ui.date(_of.recreated_at, true)]);
if (rows.length) { const _o3 = kv(rows); _o3.dataset.testid = 'arc-counts'; _o2.appendChild(_o3); }
if (S.api && S.api.mode === 'demo') _o2.appendChild(h('p', { class: 'muted small' }, 'Chế độ xem thử: sổ là bản giả trong máy này, nút "Mở sổ" không mở được file thật.'));
const _o0 = h('div', { class: 'arc-acts', style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } });
if (_of && _of.exists && _of.url) _o0.appendChild(h('a', { class: 'btn btn-secondary', href: _of.url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'arc-open' }, h('span', null, 'Mở sổ')));
if (_of && _of.available !== false) {
_o0.appendChild(button('Đồng bộ ngay', syncNow, { kind: 'primary', testid: 'arc-sync' }));
_o0.appendChild(button('Kiểm sổ', check, { testid: 'arc-check' }));
}
_o2.appendChild(_o0);
}
async function _o5(opts) {
try { _of = await call('archive.status', opts || {}); }
catch (e) { _of = e && e.missingAction ? { available: false } : _of; if (!(e && e.missingAction)) toast((e && (e.userMessage || e.message)) || 'Chưa xem được sổ', 'error'); }
_o8();
return _of;
}
async function syncNow() {
const _ob = await call('archive.sync_now', {});
if (_ob && _ob.busy) toast('Máy chủ đang chép sổ – chờ ít phút rồi xem lại.', 'info');
else {
const _og = (_ob && _ob.result) || {};
const _o9 = [];
if (_og.added) _o9.push('thêm ' + _og.added);
if (_og.updated) _o9.push('cập nhật ' + _og.updated);
if (_og.missing) _o9.push(_og.missing + ' khách mất khỏi Sheet chính');
if (_og.erased) _o9.push('xoá theo yêu cầu ' + _og.erased);
toast('Đã đồng bộ sổ' + (_o9.length ? ': ' + _o9.join(', ') : ' – không có gì mới') + (_og.more ? '. Còn khách chưa chép, bấm lại hoặc chờ máy chủ tự chép.' : '.'), _og.missing ? 'warn' : 'ok');
if (_og.recreated) toast('Sổ cũ không còn trên Drive – đã tạo sổ mới.', 'warn', 6000);
}
_of = (_ob && _ob.status) || _of;
_o8();
if (!result.hidden) await check();
}
async function check() {
const _od = await _o5({ check: true });
ui.clear(result);
result.hidden = false;
if (!_od || !_od.exists) { result.appendChild(h('p', { class: 'muted' }, 'Chưa có sổ để kiểm.')); return; }
const main = _od.main || {}, _o1 = _od.book || {};
const _oe = _od.match !== undefined ? !!_od.match : Number(_o1.live) + Number(_o1.deleted) === Number(main.alive) + Number(main.deleted) && !Number(_o1.missing);
result.appendChild(h('h4', null, 'Kết quả kiểm sổ'));
result.appendChild(kv([
['Sheet chính', (Number(main.alive) + Number(main.deleted)) + ' khách'],
['Trong sổ (còn trong Sheet chính)', (Number(_o1.live) + Number(_o1.deleted)) + ' khách'],
['Sổ và Sheet chính', _oe && !Number(_od.not_in_book) ? badge('Khớp', 'ok') : badge('Chưa khớp', 'warn')],
['Chưa vào sổ', String(Number(_od.not_in_book) || 0)],
['Mất khỏi Sheet chính', Number(_o1.missing) ? badge(String(_o1.missing), 'danger') : '0'],
]));
const _o6 = _od.missing_list || [];
if (_o6.length) {
result.appendChild(h('p', { class: 'arc-miss-note' }, 'Các khách dưới đây không còn trong Sheet chính (có thể dòng đã bị xoá thẳng trên Google Sheet). Dữ liệu vẫn còn trong sổ, tab Danh bạ.'));
result.appendChild(h('ul', { class: 'arc-miss', 'data-testid': 'arc-missing-list', style: { display: 'grid', gap: '6px', paddingLeft: '0', listStyle: 'none', overflowWrap: 'anywhere' } }, _o6.map((m) => h('li', { class: 'arc-miss-item' }, badge('Mất', 'danger'), ' ', m.name || 'Khách', h('small', { class: 'muted' }, ' · mã ' + (m.id || ''))))));
} else result.appendChild(h('p', { class: 'muted', 'data-testid': 'arc-missing-none' }, 'Không có khách nào mất khỏi Sheet chính.'));
if ((_od.not_in_book_list || []).length) result.appendChild(h('p', { class: 'muted' }, 'Chưa vào sổ: ' + _od.not_in_book_list.slice(0, 10).map((_og) => _og.name || 'Khách').join(', ') + (_od.not_in_book > 10 ? '…' : '') + '. Bấm "Đồng bộ ngay" để chép.'));
}
await _o5();
}
return { enabled: true };
}

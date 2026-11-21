import { addDefaults } from './xkit.71d637c634.js';
export const ARCHIVE_SECTION = 'archive';
export function archiveSummary(_oe) {
const _o6 = (v) => (Number(v) || 0).toLocaleString('vi-VN');
if (!_oe || _oe.available === false) return { tone: 'neutral', text: 'Máy chủ này chưa có Sổ khách lưu trữ – cập nhật máy chủ lên bản 1.0.6 trở lên.', rows: [] };
const main = _oe.main || {};
const rows = [['Khách trong Sheet chính', _o6(main.alive) + ' đang dùng · ' + _o6(main.deleted) + ' đã xoá trong app']];
if (!_oe.exists) {
return { tone: _oe.lost ? 'danger' : 'info', rows,
text: _oe.lost ? 'Không thấy file sổ trên Drive (đã bị xoá hoặc nằm trong thùng rác). Bấm "Đồng bộ ngay" để tạo sổ mới.' : 'Chưa có sổ. Máy chủ sẽ tự tạo trong vòng 1 giờ, hoặc bấm "Đồng bộ ngay".' };
}
const _o1 = _oe.book || {};
rows.unshift(['Khách trong sổ', _o6(_o1.total)]);
rows.push(['Mất khỏi Sheet chính', _o6(_o1.missing)]);
rows.push(['Đã xoá theo yêu cầu khách', _o6(_o1.erased)]);
if (Number(_oe.not_in_book) > 0) rows.push(['Chưa vào sổ', _o6(_oe.not_in_book) + ' khách (lần đồng bộ tới sẽ chép)']);
if (Number(_oe.scrub_pending) > 0) rows.push(['Đang dọn bản sao lưu tuần', _o6(_oe.scrub_pending) + ' khách xoá theo yêu cầu (máy chủ tự làm mỗi giờ)']);
const tone = Number(_o1.missing) > 0 || Number(_oe.fail_count) >= 3 ? 'danger' : Number(_oe.fail_count) > 0 ? 'warn' : 'ok';
const text = Number(_o1.missing) > 0 ? _o6(_o1.missing) + ' khách không còn trong Sheet chính – dữ liệu vẫn giữ trong sổ.'
: Number(_oe.fail_count) > 0 ? 'Lần đồng bộ gần nhất chưa được: ' + (_oe.last_error || 'lỗi không rõ') : 'Sổ đang đủ khách.';
return { tone, text, rows };
}
export function installArchive({ S, appHooks, ui }) {
const { h, button, badge, kv, toast } = ui;
addDefaults({ 'help.archive': 'Sổ khách lưu trữ: file Google Sheet riêng "BDS Studio – Sổ khách lưu trữ" trong Drive của anh/chị, không chia sẻ cho ai.\nMỗi giờ máy chủ chép mọi khách vào tab Danh bạ (cả khách đã xoá) và ghi mỗi thay đổi vào tab Lịch sử. Dòng khách lỡ bị xoá thẳng trên Google Sheet vẫn còn trong sổ, đánh dấu "Mất khỏi Sheet chính".\nKhi khách yêu cầu xoá dữ liệu (Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15), dùng nút "Xoá theo yêu cầu khách" trong hồ sơ khách: dữ liệu bị xoá khỏi cả Sheet chính lẫn sổ; bản sao lưu Sheet hằng tuần được máy chủ tự dọn trong khoảng 1 giờ. Bản sao lưu mã hoá anh/chị tự tạo (tệp "sao-luu-…") máy chủ không mở được – nếu cần, tự xoá các tệp đó.\nKhông sửa tay file sổ – máy chủ ghi theo vị trí cột.' });
const _o3 = () => !S.user || !S.user.role || S.user.role === 'owner';
const _o9 = appHooks.lateSections;
appHooks.lateSections = (ctx) => [...(typeof _o9 === 'function' ? _o9(ctx) : []),
...(_o3() ? [[ARCHIVE_SECTION, 'customers', 'Sổ khách lưu trữ', (body) => _ob(body)]] : [])];
async function _ob(body) {
const box = h('div', { class: 'arc', 'data-testid': 'arc-panel' }, ui.spinner());
const result = h('div', { class: 'arc-check', 'data-testid': 'arc-check-result', hidden: true });
body.appendChild(box);
body.appendChild(result);
let _oe = null;
const call = (action, payload) => S.api.call(action, payload || {}, { timeoutMs: 120000 });
function _o7() {
ui.clear(box);
const _oc = archiveSummary(_oe);
box.appendChild(h('p', { class: 'muted' }, 'Lưu mọi khách từng có – kể cả khách đã xoá – trong một file Google Sheet riêng trên Drive của anh/chị. Máy chủ tự chép mỗi giờ.'));
box.appendChild(h('p', { 'data-testid': 'arc-state' }, badge(_oc.tone === 'ok' ? 'Ổn' : _oc.tone === 'danger' ? 'Cần xem' : _oc.tone === 'warn' ? 'Chú ý' : 'Thông tin', _oc.tone), ' ', _oc.text));
const rows = _oc.rows.map(([k, v]) => [k, k === 'Mất khỏi Sheet chính' && _oe.book && Number(_oe.book.missing) > 0 ? badge(v, 'danger') : v]);
if (_oe && _oe.available !== false) rows.push(['Đồng bộ gần nhất', _oe.last_sync_at ? ui.date(_oe.last_sync_at, true) : 'chưa']);
if (_oe && _oe.recreated_at) rows.push(['Sổ được tạo lại lúc', ui.date(_oe.recreated_at, true)]);
if (rows.length) { const _o2 = kv(rows); _o2.dataset.testid = 'arc-counts'; box.appendChild(_o2); }
if (S.api && S.api.mode === 'demo') box.appendChild(h('p', { class: 'muted small' }, 'Chế độ xem thử: sổ là bản giả trong máy này, nút "Mở sổ" không mở được file thật.'));
const _o0 = h('div', { class: 'arc-acts', style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } });
if (_oe && _oe.exists && _oe.url) _o0.appendChild(h('a', { class: 'btn btn-secondary', href: _oe.url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'arc-open' }, h('span', null, 'Mở sổ')));
if (_oe && _oe.available !== false) {
_o0.appendChild(button('Đồng bộ ngay', syncNow, { kind: 'primary', testid: 'arc-sync' }));
_o0.appendChild(button('Kiểm sổ', check, { testid: 'arc-check' }));
}
box.appendChild(_o0);
}
async function _o4(opts) {
try { _oe = await call('archive.status', opts || {}); }
catch (e) { _oe = e && e.missingAction ? { available: false } : _oe; if (!(e && e.missingAction)) toast((e && (e.userMessage || e.message)) || 'Chưa xem được sổ', 'error'); }
_o7();
return _oe;
}
async function syncNow() {
const _oa = await call('archive.sync_now', {});
if (_oa && _oa.busy) toast('Máy chủ đang chép sổ – chờ ít phút rồi xem lại.', 'info');
else {
const _of = (_oa && _oa.result) || {};
const _o8 = [];
if (_of.added) _o8.push('thêm ' + _of.added);
if (_of.updated) _o8.push('cập nhật ' + _of.updated);
if (_of.missing) _o8.push(_of.missing + ' khách mất khỏi Sheet chính');
if (_of.erased) _o8.push('xoá theo yêu cầu ' + _of.erased);
toast('Đã đồng bộ sổ' + (_o8.length ? ': ' + _o8.join(', ') : ' – không có gì mới') + (_of.more ? '. Còn khách chưa chép, bấm lại hoặc chờ máy chủ tự chép.' : '.'), _of.missing ? 'warn' : 'ok');
if (_of.recreated) toast('Sổ cũ không còn trên Drive – đã tạo sổ mới.', 'warn', 6000);
}
_oe = (_oa && _oa.status) || _oe;
_o7();
if (!result.hidden) await check();
}
async function check() {
const _oc = await _o4({ check: true });
ui.clear(result);
result.hidden = false;
if (!_oc || !_oc.exists) { result.appendChild(h('p', { class: 'muted' }, 'Chưa có sổ để kiểm.')); return; }
const main = _oc.main || {}, _o1 = _oc.book || {};
const _od = _oc.match !== undefined ? !!_oc.match : Number(_o1.live) + Number(_o1.deleted) === Number(main.alive) + Number(main.deleted) && !Number(_o1.missing);
result.appendChild(h('h4', null, 'Kết quả kiểm sổ'));
result.appendChild(kv([
['Sheet chính', (Number(main.alive) + Number(main.deleted)) + ' khách'],
['Trong sổ (còn trong Sheet chính)', (Number(_o1.live) + Number(_o1.deleted)) + ' khách'],
['Sổ và Sheet chính', _od && !Number(_oc.not_in_book) ? badge('Khớp', 'ok') : badge('Chưa khớp', 'warn')],
['Chưa vào sổ', String(Number(_oc.not_in_book) || 0)],
['Mất khỏi Sheet chính', Number(_o1.missing) ? badge(String(_o1.missing), 'danger') : '0'],
]));
const _o5 = _oc.missing_list || [];
if (_o5.length) {
result.appendChild(h('p', { class: 'arc-miss-note' }, 'Các khách dưới đây không còn trong Sheet chính (có thể dòng đã bị xoá thẳng trên Google Sheet). Dữ liệu vẫn còn trong sổ, tab Danh bạ.'));
result.appendChild(h('ul', { class: 'arc-miss', 'data-testid': 'arc-missing-list', style: { display: 'grid', gap: '6px', paddingLeft: '0', listStyle: 'none', overflowWrap: 'anywhere' } }, _o5.map((m) => h('li', { class: 'arc-miss-item' }, badge('Mất', 'danger'), ' ', m.name || 'Khách', h('small', { class: 'muted' }, ' · mã ' + (m.id || ''))))));
} else result.appendChild(h('p', { class: 'muted', 'data-testid': 'arc-missing-none' }, 'Không có khách nào mất khỏi Sheet chính.'));
if ((_oc.not_in_book_list || []).length) result.appendChild(h('p', { class: 'muted' }, 'Chưa vào sổ: ' + _oc.not_in_book_list.slice(0, 10).map((_of) => _of.name || 'Khách').join(', ') + (_oc.not_in_book > 10 ? '…' : '') + '. Bấm "Đồng bộ ngay" để chép.'));
}
await _o4();
}
return { enabled: true };
}

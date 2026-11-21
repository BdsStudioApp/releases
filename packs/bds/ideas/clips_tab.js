import { h } from '../_lib/kit.js';
import * as L from '../_lib/videoai.js';
const _o5 = (id) => (L.providerById(id) || {}).short || ({ shotstack: 'Shotstack' })[id] || id || 'AI';
const _o0 = { map: 'Video bản đồ', news: 'Video tin BĐS', walk: 'Người xem căn hộ', market: 'Phân tích thị trường', home: 'Giới thiệu căn hộ' };
export function costLine(c) {
const _o4 = [];
if (c && c.credits !== null && c.credits !== undefined) _o4.push('≈ ' + String(c.credits).replace('.', ',') + ' tín dụng');
if (c && c.usd !== null && c.usd !== undefined) _o4.push('≈ ' + String(c.usd).replace('.', ',') + ' USD');
return _o4.length ? _o4.join(' · ') : 'chưa rõ chi phí';
}
export async function mountClips(el, ctx, K, { openVideo = () => {} } = {}) {
el.innerHTML = '';
const list = h('div', { class: 'bds-list', 'data-testid': 'va-clips' });
el.appendChild(h('div', { class: 'bds-stack', 'data-testid': 'clips-screen' },
K.card({ title: 'Clip AI đã có', testid: 'va-card-clips', actions: K.button('+ Tạo clip mới', () => openVideo(), { testid: 'va-clips-new' }), body: h('div', null,
h('p', { class: 'bds-muted' }, 'Mỗi clip lưu link, AI đã dùng, câu lệnh, chi phí và ngày tạo. Bấm "Xem / tải" để mở clip; link của nhà cung cấp có thể hết hạn – nên lưu clip lên Google Drive rồi dán link Drive.'),
list) })));
async function render() {
if (!el.isConnected && list.childElementCount) return;
const _o1 = L.clipList(await K.list('jobs'));
list.innerHTML = '';
if (!_o1.length) { list.appendChild(K.empty('Chưa có clip AI nào. Mở thẻ "Video AI" để tạo cảnh, hoặc bấm "Làm video AI từ ý tưởng này" ở một ý tưởng đã duyệt.')); return; }
for (const c of _o1.slice(0, 100)) list.appendChild(_o3(c));
}
function _o3(c) {
const linkIn = h('input', { type: 'url', value: c.url, placeholder: 'https://drive.google.com/… (link clip)', 'aria-label': 'Link clip ' + c.title, 'data-testid': 'va-clip-link-' + c.id, style: { flex: '1 1 220px', minWidth: 0 } });
const _o6 = K.button('Lưu link', async () => {
const url = L.linkOk(linkIn.value);
if (!url) { K.toast('Link phải bắt đầu bằng https:// (vd link Google Drive)', 'warn'); return; }
await K.put('jobs', L.withLink(c.row, url)); K.toast('Đã lưu link clip', 'success'); render();
}, { testid: 'va-clip-save-' + c.id });
const _o2 = K.button('Xoá', async () => {
if (!(await K.confirm({ title: 'Xoá bản ghi clip?', text: 'Chỉ xoá bản ghi trong app – tệp trên Google Drive / nhà cung cấp giữ nguyên.', ok: 'Xoá', kind: 'danger', testid: 'va-clip-del-confirm' }))) return;
await K.put('jobs', { ...c.row, deleted: 1 }); K.toast('Đã xoá bản ghi clip', 'success'); render();
}, { kind: 'danger', testid: 'va-clip-del-' + c.id });
const kind = (L.KINDS.find((k) => k.id === c.kind) || {}).label;
return h('div', { class: 'bds-item', 'data-testid': 'va-clip-' + c.id, style: { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '6px' } },
h('div', { class: 'bds-row bds-wrap' }, h('strong', { style: { overflowWrap: 'anywhere' } }, c.title),
K.badge(_o5(c.provider), 'info'), kind ? K.badge(kind, 'muted') : null, c.idea_id ? K.badge('Từ ý tưởng', 'success') : null, c.func ? K.badge(_o0[c.func] || c.func, 'muted') : null,
c.url ? null : K.badge('Chưa có link', 'warn')),
h('small', { class: 'bds-muted', 'data-testid': 'va-clip-meta-' + c.id }, [L.fmtWhen(c.created_at), c.seconds ? c.seconds + ' giây' : '', c.aspect, costLine(c.cost)].filter(Boolean).join(' · ')),
c.caption ? h('details', { 'data-testid': 'va-clip-caption-' + c.id }, h('summary', null, 'Caption gợi ý (anh/chị tự đăng)'),
h('pre', { style: { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: '12px' } }, c.caption),
K.button('Chép caption', async () => { await K.copy(c.caption); K.toast('Đã chép caption', 'success'); }, { testid: 'va-clip-capcopy-' + c.id })) : null,
c.sources && c.sources.length ? h('small', { class: 'bds-muted', 'data-testid': 'va-clip-sources-' + c.id, style: { overflowWrap: 'anywhere' } }, 'Nguồn số liệu: ',
c.sources.map((x, i) => [i ? ', ' : '', h('a', { href: x.url, target: '_blank', rel: 'noopener noreferrer' }, x.name || x.url)])) : null,
h('details', null, h('summary', null, c.func && ['map', 'news'].includes(c.func) && c.provider === 'shotstack' ? 'Dàn cảnh đã dựng' : 'Câu lệnh đã gửi AI'), h('pre', { style: { whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', fontSize: '12px' }, 'data-testid': 'va-clip-prompt-' + c.id }, c.prompt)),
h('div', { class: 'bds-row bds-wrap' },
c.url ? h('a', { class: 'bds-btn bds-btn-x bds-btn-primary', href: c.url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'va-clip-open-' + c.id }, '▶ Xem / tải') : null,
K.button('Chép câu lệnh', async () => { await K.copy(c.prompt); K.toast('Đã chép câu lệnh', 'success'); }, { testid: 'va-clip-copy-' + c.id }),
_o2),
h('div', { class: 'bds-row bds-wrap' }, linkIn, _o6));
}
await render();
K.on(el, ['jobs'], render);
return { render };
}

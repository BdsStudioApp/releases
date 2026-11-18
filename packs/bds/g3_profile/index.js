import { g3kit, h, parseData, selftestG3 } from '../g3_lib/ui.js';
import * as P from '../g3_lib/profile.js';
import { profilePage } from '../g3_lib/page.js';
const PROFILE_ID = 'g3-profile';
export function profileIdFor(user) { const role = user && user.role; return !role || role === 'owner' ? PROFILE_ID : (PROFILE_ID + '-' + String(user.id || 'x')).slice(0, 64); }
function ymd(ms) { return ms ? new Date(ms + 7 * 3600e3).toISOString().slice(0, 10) : ''; }
function _o4(v) { const _o6 = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})$/); return _o6 ? Date.UTC(+_o6[1], +_o6[2] - 1, +_o6[3]) : 0; }
export async function mount(el, ctx) {
const G = g3kit(ctx), K = G.K;
el.innerHTML = '';
const _ob = h('div', { class: 'g3', 'data-testid': 'g3-profile' });
el.appendChild(_ob);
async function _oa() {
const [profRows, storiesRaw, customers] = await Promise.all([G.objs('g3_profile'), G.objs('g3_story'), G.customers()]);
const _o8 = profileIdFor(ctx.user);
const _o9 = profRows.find(o => o.id === _o8) || null;
const prof = P.profileView(_o9);
const agent = await G.agent();
const _oe = storiesRaw.map(P.storyView);
_ob.innerHTML = '';
_ob.appendChild(G.head('Hồ sơ năng lực & câu chuyện khách', 'Giới thiệu bản thân bằng số liệu thật và câu chuyện khách đã đồng ý chia sẻ.',
K.button('Tải trang hồ sơ (.html)', () => {
const pub = P.publicStories(_oe.map(s => ({ ...s, project_name: K.projectName(s.project) })));
G.download('ho-so-nang-luc.html', profilePage({ ...prof, name: prof.name || agent.name, stats: P.stats(prof, customers, id => K.projectName(id)) }, pub, { agent: { ...agent, license: prof.license || agent.license } }), 'text/html;charset=utf-8');
K.toast('Đã tải trang với ' + pub.length + ' câu chuyện đủ điều kiện đăng', 'success');
}, { kind: 'primary', testid: 'pf-download' })));
const name = G.input({ value: prof.name || agent.name, 'data-testid': 'pf-name' });
const title = G.input({ value: prof.title, 'data-testid': 'pf-title', placeholder: 'VD: Chuyên viên tư vấn căn hộ khu Đông Hà Nội' });
const years = G.input({ value: prof.years || '', inputmode: 'numeric', 'data-testid': 'pf-years' });
const _o5 = G.input({ value: prof.license || agent.license, 'data-testid': 'pf-license', placeholder: 'Số chứng chỉ hành nghề môi giới' });
const areas = G.input({ value: prof.areas.join(', '), 'data-testid': 'pf-areas', placeholder: 'Khu vực, dự án (cách nhau bằng dấu phẩy)' });
const intro = G.area({ rows: 4, 'data-testid': 'pf-intro' }); intro.value = prof.intro;
const photo = G.input({ value: prof.photo, inputmode: 'url', 'data-testid': 'pf-photo', placeholder: 'https://… ảnh chân dung' });
const showDeals = h('input', { type: 'checkbox', checked: prof.show_deals, 'data-testid': 'pf-show-deals' });
const _od = P.stats(prof, customers, id => K.projectName(id));
_ob.appendChild(K.card({ title: 'Hồ sơ', testid: 'pf-form', body: [h('div', { class: 'g3-two' }, G.field('Họ tên', name), G.field('Chức danh', title)),
h('div', { class: 'g3-two' }, G.field('Số năm kinh nghiệm', years), G.field('Chứng chỉ hành nghề', _o5)), G.field('Khu vực, dự án', areas), G.field('Giới thiệu', intro), G.field('Ảnh chân dung (link https)', photo),
h('label', { class: 'g3-chk' }, showDeals, 'Hiện số giao dịch đã hỗ trợ (chỉ đếm số, không tên khách)'),
_od.length ? h('ul', { class: 'g3-sub', 'data-testid': 'pf-stats' }, _od.map(s => h('li', null, s.value + ' ' + s.label))) : null,
K.button('Lưu hồ sơ', async () => {
const _o7 = photo.value.trim(); if (_o7 && !/^https:\/\//i.test(_o7)) return K.toast('Link ảnh phải bắt đầu bằng https://', 'warn');
await G.save('g3_profile', { ...(_o9 || {}), id: _o8, name: name.value.trim() || 'Hồ sơ', status: 'ready' }, { name: name.value.trim(), title: title.value.trim(), years: Number(years.value) || 0, license: _o5.value.trim(),
areas: areas.value.split(',').map(s => s.trim()).filter(Boolean), intro: intro.value.trim(), photo: _o7, show_deals: showDeals.checked });
K.toast('Đã lưu hồ sơ', 'success'); _oa();
}, { kind: 'primary', testid: 'pf-save' })] }));
_ob.appendChild(h('div', { class: 'g3-row', style: 'justify-content:space-between' }, h('h3', null, 'Câu chuyện khách hàng (' + _oe.length + ')'), K.button('+ Câu chuyện', () => _o2(null, customers), { testid: 'st-add' })));
if (!_oe.length) _ob.appendChild(K.empty('Chưa có câu chuyện. Chọn khách đã mua hài lòng, ghi câu chuyện, xin đồng ý qua Zalo rồi mới đăng.'));
for (const s of _oe) {
const _o0 = P.canPublish(s);
_ob.appendChild(h('div', { class: 'g3-item', 'data-testid': 'st-' + s.id },
h('div', { class: 'g3-row' }, h('strong', null, s.title || s.name), K.badge(s.status === 'published' ? (_o0.ok ? 'Đang đăng' : 'Đã gỡ – ' + _o0.why) : 'Nháp', s.status === 'published' && _o0.ok ? 'success' : s.status === 'published' ? 'danger' : 'muted')),
h('span', { class: 'g3-sub' }, 'Hiển thị: ' + P.displayName(s.name, s.consent.display) + ' · ' + P.consentLine(s.consent, ms => K.date(ms))),
h('div', { class: 'g3-row' },
s.status === 'published' ? K.button('Gỡ khỏi trang', async () => { await K.put('objects', { ...s.raw, status: 'draft' }); _oa(); }, { testid: 'st-unpub-' + s.id })
: K.button('Đăng lên hồ sơ', async () => { if (!_o0.ok) return K.toast('Chưa đăng được: ' + _o0.why, 'warn'); await K.put('objects', { ...s.raw, status: 'published' }); K.toast('Đã đăng', 'success'); _oa(); }, { kind: 'primary', testid: 'st-pub-' + s.id }),
K.button('Chép tin xin đồng ý', () => G.copy(P.consentRequest(s, { agent: agent.name })), { testid: 'st-ask-' + s.id }),
K.button('Sửa', () => _o2(s, customers), { testid: 'st-edit-' + s.id }))));
}
}
function _o2(s, customers) {
const deals = customers.filter(_o0 => /đặt cọc|đã mua|đã thuê|đã bán|đã cho thuê/i.test(_o0.status || ''));
const _o1 = K.select([['', '– Chọn khách –'], ...deals.concat(customers.filter(_o0 => !deals.includes(_o0))).slice(0, 300).map(_o0 => [_o0.id, _o0.name + ' · ' + (_o0.status || '')])], s ? s.customer_id : '', { 'data-testid': 'st-customer' });
const title = G.input({ value: s ? s.title : '', 'data-testid': 'st-title', placeholder: 'VD: Gia đình trẻ mua căn đầu tiên nhờ vay 70%' });
const story = G.area({ rows: 5, 'data-testid': 'st-story' }); story.value = s ? s.story : '';
const quote = G.area({ rows: 2, 'data-testid': 'st-quote', placeholder: 'Câu khách nói (nguyên văn, khách đã duyệt)' }); quote.value = s ? s.quote : '';
const given = h('input', { type: 'checkbox', checked: s ? s.consent.given : false, 'data-testid': 'st-consent' });
const method = K.select([['', '– Cách khách đồng ý –'], ...Object.entries(P.METHODS)], s ? s.consent.method : '', { 'data-testid': 'st-method' });
const at = G.input({ type: 'date', value: s && s.consent.at ? ymd(s.consent.at) : '', 'data-testid': 'st-consent-at' });
const _o3 = G.input({ value: s ? s.consent.evidence : '', 'data-testid': 'st-evidence', placeholder: 'Lưu ở đâu: ảnh chụp Zalo ngày…, giấy ký lưu hồ sơ…' });
const display = K.select(Object.entries(P.DISPLAY), s ? s.consent.display : 'initials', { 'data-testid': 'st-display' });
const withdrawn = h('input', { type: 'checkbox', checked: s ? !!s.consent.withdrawn_at : false, 'data-testid': 'st-withdrawn' });
const _oc = K.sheet({ title: s ? 'Sửa câu chuyện' : 'Câu chuyện mới', testid: 'st-form', body: [
G.field('Khách', _o1), G.field('Tiêu đề', title), G.field('Câu chuyện', story, 'Không ghi số điện thoại, giá căn, số căn, thông tin vay cụ thể của khách.'), G.field('Câu nói của khách', quote),
h('h4', null, 'Đồng ý của khách (bắt buộc trước khi đăng)'),
h('label', { class: 'g3-chk' }, given, 'Khách đã đồng ý cho đăng câu chuyện này'), h('div', { class: 'g3-two' }, G.field('Cách đồng ý', method), G.field('Ngày đồng ý', at)),
G.field('Bằng chứng lưu ở đâu', _o3), G.field('Hiển thị tên khách', display),
s ? h('label', { class: 'g3-chk' }, withdrawn, 'Khách đã rút đồng ý (gỡ khỏi trang)') : null,
s && G.canErase ? K.button('Xoá câu chuyện', async () => { if (await G.deleteRow(s.raw, { title: 'Xoá câu chuyện?', text: 'Câu chuyện bị gỡ khỏi hồ sơ và trang công khai ở lần xuất sau.' })) { _oc.close(); _oa(); } }, { kind: 'danger', testid: 'st-del' }) : null,
K.button('Lưu', async () => {
const _o0 = customers.find(x => x.id === _o1.value);
if (!_o0) return K.toast('Chọn khách', 'warn');
if (!story.value.trim() && !quote.value.trim()) return K.toast('Nhập câu chuyện hoặc câu nói của khách', 'warn');
if (/(?:\+?84|0)(?:[\s.-]?\d){9}/.test(story.value + ' ' + quote.value)) return K.toast('Bỏ số điện thoại khỏi câu chuyện', 'warn');
const prev = s ? parseData(s.raw.data) : {};
const _of = s ? s.consent.withdrawn_at : 0;
const consent = { given: given.checked, method: method.value, at: _o4(at.value), evidence: _o3.value.trim(), display: display.value, withdrawn_at: withdrawn.checked ? (_of || Date.now()) : 0 };
const status = s && s.status === 'published' && P.canPublish({ ...s, story: story.value, quote: quote.value, consent }).ok ? 'published' : (s && s.status === 'published' ? 'draft' : (s ? s.status : 'draft'));
await G.save('g3_story', { ...(s ? s.raw : {}), name: _o0.name, project: _o0.project || '', status }, { ...prev, customer_id: _o0.id, title: title.value.trim(), story: story.value.trim(), quote: quote.value.trim(), consent });
if (consent.given && (!s || !s.consent.given)) await K.logEvent(_o0.id, 'note', 'Khách đồng ý đăng câu chuyện trên hồ sơ năng lực (' + (P.METHODS[consent.method] || '') + ').');
if (consent.withdrawn_at && !_of) await K.logEvent(_o0.id, 'note', 'Khách rút đồng ý đăng câu chuyện – đã gỡ.');
_oc.close(); K.toast(status === 'draft' && s && s.status === 'published' ? 'Đã lưu và gỡ khỏi trang (thiếu đồng ý)' : 'Đã lưu', 'success'); _oa();
}, { kind: 'primary', testid: 'st-save' })] });
}
await _oa();
K.on(el, ['objects'], () => { if (!_ob.querySelector('input:focus, textarea:focus, select:focus')) _oa(); });
}
export default {
manifest: { id: 'g3_profile', title: 'Hồ sơ năng lực & câu chuyện khách', icon: '🏅', screen: 'customers', order: 59, version: '0.1.0', status: 'ready',
help: 'Hồ sơ năng lực (kinh nghiệm, chứng chỉ, số giao dịch) + câu chuyện khách thật; câu chuyện chỉ đăng khi có đồng ý của khách, rút đồng ý là gỡ; tải trang hồ sơ .html.' },
mount,
async selftest(ctx) {
const s = P.storyView({ id: 's', name: 'Lê Văn A', status: 'published', data: JSON.stringify({ story: 'x', consent: { given: false } }) });
if (P.publicStories([s]).length || P.displayName('Lê Văn An', 'initials') !== 'Anh/chị A.') return { ok: false, details: 'Lọc đồng ý câu chuyện sai' };
return selftestG3(ctx);
},
};

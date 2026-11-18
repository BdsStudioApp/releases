import { g3kit, h, parseData, selftestG3 } from '../g3_lib/ui.js';
import * as GR from '../g3_lib/groups.js';
import { readAttribution } from '../g3_lib/attribution.js';
import { isDeal } from '../g3_lib/roi.js';
import * as B from '../g3_lib/bridge.js';
const DAY = 86400000;
export function groupsGuide(G) {
const K = G.K;
const _oc = (strong, rest) => h('li', { style: 'margin:4px 0' }, strong ? h('strong', null, strong) : null, strong && rest ? ' ' : null, rest || null);
const _or = (id, title, body) => h('details', { 'data-testid': 'grp-guide-' + id, style: 'border-top:1px solid rgba(127,127,127,.2);padding:4px 0' },
h('summary', { style: 'min-height:44px;cursor:pointer;display:flex;align-items:center;font-weight:600' }, title), h('div', { class: 'g3', style: 'padding:4px 0 8px' }, body));
const _ox = (...items) => h('ul', { style: 'margin:0;padding-left:20px' }, items);
const _oj = (...items) => h('ol', { style: 'margin:0;padding-left:20px' }, items);
return K.card({ title: 'Kết nối với Facebook / Zalo thế nào?', testid: 'grp-guide', body: [
G.note('Ngắn gọn: app KHÔNG đăng nhập và KHÔNG tự đăng vào nhóm Facebook hay nhóm Zalo – vì các nền tảng không cho. App soạn bài, nhắc nội quy, chép nội dung và mở nhóm; anh/chị dán và bấm Đăng (mất khoảng 1 phút mỗi nhóm). Link trong bài có mã riêng từng nhóm nên app vẫn đếm được nhóm nào ra khách.'),
_or('why', 'Vì sao app không tự đăng vào nhóm?', _ox(
_oc('Nhóm Facebook:', 'Meta (Facebook) đã gỡ chức năng cho ứng dụng bên ngoài đăng bài vào Nhóm (Groups API) từ năm 2024. Hiện không còn cách chính thức nào để phần mềm tự đăng vào nhóm.'),
_oc('Nhóm Zalo:', 'Zalo không có API đăng bài vào nhóm cho tài khoản cá nhân.'),
_oc('Công cụ "tự đăng nhóm hàng loạt"', '(tiện ích trình duyệt, phần mềm giả lập đăng nhập, nhờ người khác giữ tài khoản…) trái điều khoản của Facebook/Zalo – dễ bị khoá tài khoản, bị đuổi khỏi nhóm, mất cả nick bán hàng lâu năm. App không làm và khuyên không dùng.'))),
_or('fb', 'Đăng vào Nhóm Facebook – từng bước', _oj(
_oc('Bấm "+ Nhóm":', 'nhập tên nhóm, dán link nhóm (dạng https://www.facebook.com/groups/…), dán nội quy nhóm, tích "Nhóm cho phép để link" nếu nhóm cho, điền tối đa bài/tuần và ngày được đăng.'),
_oc('Bấm "+ Bài đăng":', 'viết nội dung, chọn trang landing – app tự gắn mã nhóm vào link (utm_content=mã nhóm).'),
_oc('Đến giờ, bấm "Đăng tay":', 'đọc nội quy, tích đủ các ô kiểm tra.'),
_oc('"1. Chép nội dung"', 'rồi "2. Mở nhóm" → trong nhóm bấm ô "Bạn viết gì đi…" → giữ ngón tay/chuột phải → Dán → thêm ảnh nếu có → Đăng. Nhóm không cho link: đăng bài không link, rồi dán link vào bình luận khi có người hỏi.'),
_oc('Quay lại app,', 'dán link bài vừa đăng (tuỳ chọn) → "3. Đã đăng xong". Tab "Nhóm" cho thấy mỗi nhóm bao nhiêu bài, bao nhiêu khách, bao nhiêu căn chốt.'))),
_or('page', 'Fanpage (trang của anh/chị) thì sao?', _ox(
_oc('Lên lịch đăng Fanpage miễn phí, chính chủ:', 'vào Meta Business Suite (business.facebook.com) → "Bài viết và tin" → "Tạo bài viết" → chọn "Lên lịch". Đây là cách an toàn nhất, không cần phần mềm ngoài.'),
_oc('Đăng tự động từ phần mềm khác', 'vào Fanpage thì Facebook có cho qua Graph API, nhưng cần tạo ứng dụng Meta, cấp quyền quản lý trang (pages_manage_posts) và thường phải qua Meta xét duyệt. App này chưa làm phần đó – hiện anh/chị dùng Meta Business Suite.'),
_oc('Quảng cáo/bài được "đẩy" trên Fanpage:', 'xem số liệu và tải về ở mục "Đo hiệu quả tiền marketing" → tab "Theo từng quảng cáo".'))),
_or('zalo', 'Zalo: nhóm Zalo và Zalo OA', _ox(
_oc('Nhóm/cộng đồng Zalo:', 'làm giống nhóm Facebook – "+ Nhóm", chọn nền tảng "Nhóm/cộng đồng Zalo", dán link mời nhóm (dạng https://zalo.me/g/…). Khi đăng: "Chép nội dung" → "Mở nhóm" (mở ứng dụng Zalo) → dán → gửi.'),
_oc('Zalo cá nhân:', 'không dùng phần mềm tự kết bạn, tự gửi tin hàng loạt – Zalo có thể hạn chế hoặc khoá tài khoản.'),
_oc('Zalo OA (tài khoản chính thức):', 'có API chính thức để gửi tin tư vấn tới người ĐÃ quan tâm OA (theo chính sách và bảng phí tin của Zalo tại thời điểm dùng). App đã có kết nối ở mục "Zalo OA" (gói Khách hàng & Chăm sóc) và nhắc lịch sự kiện qua ZNS ở mục "Sự kiện & livestream". OA không đăng được vào nhóm Zalo.'),
h('div', { class: 'g3-row' }, K.linkBtn('Mở mục Zalo OA', '#/customers/g2_zoa', null, { testid: 'grp-guide-zoa' })))),
] });
}
function _o4(ms) { return new Date(ms + 7 * 3600e3).toISOString().slice(0, 10); }
function dayLabel(ms) { return new Date(ms).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', weekday: 'short', day: '2-digit', month: '2-digit' }); }
function _ov(ms) { return new Date(ms + 7 * 3600e3).toISOString().slice(0, 16); }
function _o7(v) { const _of = String(v || '').match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/); return _of ? Date.UTC(+_of[1], +_of[2] - 1, +_of[3], +_of[4] - 7, +_of[5]) : 0; }
export async function mount(el, ctx) {
const G = g3kit(ctx), K = G.K;
el.innerHTML = '';
const _op = h('div', { class: 'g3', 'data-testid': 'g3-groups' });
el.appendChild(_op);
const _ot = { tab: 'calendar' };
async function _oe() {
const [gs, ps, customers] = await Promise.all([G.objs('g3_group'), G.objs('g3_post'), G.customers()]);
return { groups: gs.map(GR.groupView), posts: ps.map(GR.postView), customers };
}
async function _on() {
const { groups, posts, customers } = await _oe();
_op.innerHTML = '';
_op.appendChild(G.head('Đăng nhóm cộng đồng', 'Lịch đăng + nội quy từng nhóm, link gắn mã riêng mỗi nhóm để biết nhóm nào ra khách. Anh/chị tự đăng tay.',
h('div', { class: 'g3-row' }, K.button('+ Nhóm', () => _o5(null, groups), { testid: 'grp-add' }), K.button('+ Bài đăng', () => _o6(null, groups, posts), { kind: 'primary', testid: 'post-add' }))));
_op.appendChild(groupsGuide(G));
_op.appendChild(G.tabs([['calendar', 'Lịch đăng'], ['groups', 'Nhóm (' + groups.length + ')']], _ot.tab, _oa => { _ot.tab = _oa; _on(); }, 'grp-tab'));
if (_ot.tab === 'groups') return _oo(groups, posts, customers);
const from = Date.now() - DAY;
const _oy = posts.filter(p => p.status === 'planned' || (p.posted_at || p.at) >= from).sort((_o0, b) => _o0.at - b.at);
if (!groups.length) { _op.appendChild(K.empty('Thêm nhóm trước: tên nhóm, link nhóm, nội quy (có cho link không, mấy bài/tuần, ngày nào được đăng).')); return; }
const _ou = GR.suggestSlots(groups, posts, { from: Date.now(), days: 7 });
if (_ou.length) _op.appendChild(K.card({ title: 'Gợi ý lịch tuần này', testid: 'grp-suggest', body: [h('ul', null, _ou.map(_oq => h('li', null, dayLabel(_oq.at) + ' 20:00 – ' + (groups.find(g => g.id === _oq.group_id) || {}).name))),
K.button('Thêm các khung giờ gợi ý', async () => { for (const _oq of _ou) await G.save('g3_post', { name: 'Bài nhóm ' + (groups.find(g => g.id === _oq.group_id) || {}).name, status: 'planned' }, { group_id: _oq.group_id, at: _oq.at, text: '', link: '' }); _on(); }, { testid: 'grp-suggest-add' })] }));
const _o2 = new Map();
for (const p of _oy) { const _oa = _o4(p.at); if (!_o2.has(_oa)) _o2.set(_oa, []); _o2.get(_oa).push(p); }
if (!_o2.size) _op.appendChild(K.empty('Chưa có bài nào trong lịch.'));
for (const [, list] of _o2) {
_op.appendChild(h('h4', null, dayLabel(list[0].at)));
for (const p of list) {
const g = groups.find(x => x.id === p.group_id) || { name: '(nhóm đã xoá)', id: '', days: [], allow_links: true, active: false };
const chk = GR.checkPost(g, p, posts);
_op.appendChild(h('div', { class: 'g3-item', 'data-testid': 'post-' + p.id, 'data-status': p.status },
h('div', { class: 'g3-row' }, h('strong', null, new Date(p.at).toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit' }) + ' · ' + g.name),
K.badge(p.status === 'posted' ? 'Đã đăng' : p.status === 'skipped' ? 'Bỏ qua' : 'Chờ đăng', p.status === 'posted' ? 'success' : p.status === 'skipped' ? 'muted' : 'warn')),
p.text ? h('div', { class: 'g3-sub' }, p.text.slice(0, 200) + (p.text.length > 200 ? '…' : '')) : h('div', { class: 'g3-sub' }, '(chưa có nội dung)'),
p.status === 'planned' && chk.warnings.length ? h('div', null, chk.warnings.map(w => h('small', { class: chk.ok ? 'g3-warn' : 'g3-fail', style: 'display:block' }, '⚠️ ' + w))) : null,
h('div', { class: 'g3-row' },
p.status === 'planned' ? K.button('Đăng tay', () => _om(p, g, posts), { kind: 'primary', testid: 'post-go-' + p.id }) : null,
K.button('Sửa', () => _o6(p, groups, posts), { testid: 'post-edit-' + p.id }),
p.status === 'planned' ? K.button('Bỏ qua', async () => { await K.put('objects', { ...p.raw, status: 'skipped' }); _on(); }, { testid: 'post-skip-' + p.id }) : null)));
}
}
}
function _oo(groups, posts, customers) {
if (!groups.length) { _op.appendChild(K.empty('Chưa có nhóm.')); return; }
for (const g of groups) {
const _ob = customers.filter(_o3 => { const _o0 = readAttribution(_o3); return _o0.channel === 'group' && _o0.utm_content === g.code; });
const _oi = posts.filter(p => p.group_id === g.id && p.status === 'posted').length;
_op.appendChild(h('div', { class: 'g3-item', 'data-testid': 'grp-' + g.code },
h('div', { class: 'g3-row' }, h('strong', null, g.name), K.badge(GR.PLATFORMS[g.platform], g.active ? 'info' : 'muted')),
h('span', { class: 'g3-sub', 'data-testid': 'grp-stats-' + g.code }, `Mã ${g.code} · ${_oi} bài đã đăng · ${_ob.length} khách · ${_ob.filter(isDeal).length} chốt` + (g.members ? ' · ' + g.members.toLocaleString('vi-VN') + ' thành viên' : '')),
h('span', { class: 'g3-sub' }, 'Nội quy: ' + GR.rulesReminder(g).slice(3).join(' ') || ''),
h('div', { class: 'g3-row' }, g.url ? K.linkBtn('Mở nhóm', g.url, null, { target: '_blank' }) : null, K.button('Sửa', () => _o5(g, groups), { testid: 'grp-edit-' + g.code }))));
}
}
function _o5(g, groups) {
const name = G.input({ value: g ? g.name : '', 'data-testid': 'grp-name', maxlength: 100 });
const url = G.input({ value: g ? g.url : '', inputmode: 'url', 'data-testid': 'grp-url', placeholder: 'https://www.facebook.com/groups/… hoặc https://zalo.me/g/…' });
const _ol = K.select(Object.entries(GR.PLATFORMS), g ? g.platform : 'facebook', { 'data-testid': 'grp-platform' });
const rules = G.area({ rows: 4, 'data-testid': 'grp-rules', placeholder: 'Dán nội quy nhóm (để app nhắc trước mỗi lần đăng)' }); rules.value = g ? g.rules : '';
const links = h('input', { type: 'checkbox', checked: g ? g.allow_links : true, 'data-testid': 'grp-links' });
const _og = G.input({ value: g && g.max_per_week ? g.max_per_week : '', inputmode: 'numeric', 'data-testid': 'grp-max', placeholder: 'VD 2' });
const members = G.input({ value: g && g.members ? g.members : '', inputmode: 'numeric', 'data-testid': 'grp-members' });
const days = GR.DAYS.map((d, i) => h('label', { class: 'g3-chk g3-day' }, h('input', { type: 'checkbox', checked: g ? g.days.includes(i) : false, 'data-day': i, 'data-testid': 'grp-day-' + i }), d));
const active = h('input', { type: 'checkbox', checked: g ? g.active : true, 'data-testid': 'grp-active' });
const _os = K.sheet({ title: g ? 'Sửa nhóm' : 'Nhóm mới', testid: 'grp-form', body: [
G.field('Tên nhóm', name), h('div', { class: 'g3-two' }, G.field('Link nhóm', url), G.field('Nền tảng', _ol)), G.field('Nội quy', rules),
h('label', { class: 'g3-chk' }, links, 'Nhóm cho phép để link trong bài'), h('div', { class: 'g3-two' }, G.field('Tối đa bài/tuần (0 = không giới hạn)', _og), G.field('Số thành viên', members)),
h('div', null, h('span', null, 'Ngày được đăng (bỏ trống = mọi ngày)'), h('div', { class: 'g3-row' }, days)),
h('label', { class: 'g3-chk' }, active, 'Đang đăng ở nhóm này'),
g && G.canErase ? K.button('Xoá nhóm', async () => {
if (await G.deleteRow(g.raw, { title: 'Xoá nhóm?', text: 'Xoá nhóm "' + g.name + '" và các bài trong lịch của nhóm này. Khách đã về từ nhóm vẫn giữ nguyên.',
after: async () => { for (const p of (await G.objs('g3_post')).map(GR.postView).filter(x => x.group_id === g.id)) await G.remove(p.raw); } })) { _os.close(); _on(); }
}, { kind: 'danger', testid: 'grp-del' }) : null,
K.button('Lưu', async () => {
const _oi = name.value.trim(); if (_oi.length < 2) return K.toast('Nhập tên nhóm', 'warn');
const _ow = url.value.trim(); if (_ow && !/^https:\/\//i.test(_ow)) return K.toast('Link nhóm phải bắt đầu bằng https://', 'warn');
const prev = g ? parseData(g.raw.data) : {};
const code = prev.code || GR.groupCode(_oi, groups.map(x => x.code));
await G.save('g3_group', { ...(g ? g.raw : {}), name: _oi, status: active.checked ? 'active' : 'paused' }, { ...prev, code, url: _ow, platform: _ol.value, rules: rules.value.trim(),
allow_links: links.checked, max_per_week: Number(_og.value) || 0, members: Number(String(members.value).replace(/\D/g, '')) || 0, days: days.map(l => l.querySelector('input')).filter(i => i.checked).map(i => Number(i.dataset.day)) });
_os.close(); K.toast('Đã lưu nhóm (mã ' + code + ')', 'success'); _on();
}, { kind: 'primary', testid: 'grp-save' })] });
}
function _o6(p, groups, posts) {
if (!groups.length) return K.toast('Thêm nhóm trước', 'warn');
const _o9 = K.select(groups.map(g => [g.id, g.name]), p ? p.group_id : groups[0].id, { 'data-testid': 'post-group' });
const at = G.input({ type: 'datetime-local', value: _ov(p && p.at ? p.at : Math.ceil((Date.now() + 3600e3) / 3600e3) * 3600e3), 'data-testid': 'post-at' });
const text = G.area({ rows: 6, 'data-testid': 'post-text', placeholder: 'Nội dung hữu ích: thông tin, số liệu có nguồn, câu hỏi mở… Tránh đăng y hệt ở nhiều nhóm.' }); text.value = p ? p.text : '';
const camp = G.input({ value: p ? p.campaign : '', 'data-testid': 'post-campaign', placeholder: 'Chiến dịch (VD: lakeside-t11)' });
const _ok = []; try { for (const _o3 of B.landingPages(ctx)) { const _ow = B.pageUrl(_o3, G.endpoint()); if (_ow) _ok.push([_ow, _o3.name || _o3.slug]); } } catch { }
const _o1 = G.input({ value: p && p.link ? p.link.replace(/\?.*$/, '') : (_ok[0] ? _ok[0][0] : ''), inputmode: 'url', 'data-testid': 'post-base', placeholder: 'https://… trang landing (tuỳ chọn)' });
const _od = h('span', { class: 'g3-code', 'data-testid': 'post-link' });
const warn = h('div');
const _oz = () => {
const g = groups.find(x => x.id === _o9.value);
const link = _o1.value.trim() ? GR.postLink(_o1.value.trim(), g, camp.value) : '';
_od.textContent = link;
const chk = GR.checkPost(g, { id: p ? p.id : '_new', group_id: g.id, at: _o7(at.value), text: text.value, link }, posts);
warn.innerHTML = ''; chk.warnings.forEach(w => warn.appendChild(h('small', { class: chk.ok ? 'g3-warn' : 'g3-fail', style: 'display:block' }, '⚠️ ' + w)));
return { g, link, chk };
};
[_o9, at, text, camp, _o1].forEach(i => { i.addEventListener('input', _oz); i.addEventListener('change', _oz); });
const _os = K.sheet({ title: p ? 'Sửa bài đăng' : 'Bài đăng mới', testid: 'post-form', body: [
h('div', { class: 'g3-two' }, G.field('Nhóm', _o9), G.field('Thời gian', at)), G.field('Nội dung', text), h('div', { class: 'g3-two' }, G.field('Trang landing', _o1), G.field('Chiến dịch', camp)),
h('div', null, h('small', null, 'Link gắn mã nhóm: '), _od), warn,
p && G.canErase ? K.button('Xoá bài', async () => { if (await G.deleteRow(p.raw, { title: 'Xoá bài đăng?', text: 'Bài này bị gỡ khỏi lịch.' })) { _os.close(); _on(); } }, { kind: 'danger', testid: 'post-del' }) : null,
K.button('Lưu vào lịch', async () => {
const { g, link } = _oz(); const t = _o7(at.value);
if (!t) return K.toast('Chọn thời gian', 'warn');
await G.save('g3_post', { ...(p ? p.raw : {}), name: (text.value.trim().slice(0, 60) || 'Bài nhóm ' + g.name), status: p ? p.status : 'planned' }, { ...(p ? parseData(p.raw.data) : {}), group_id: g.id, at: t, text: text.value.trim(), link, campaign: camp.value.trim() });
_os.close(); K.toast('Đã lưu bài', 'success'); _on();
}, { kind: 'primary', testid: 'post-save' })] });
_oz();
}
function _om(p, g, posts) {
const chk = GR.checkPost(g, p, posts);
const boxes = GR.rulesReminder(g).map((r, i) => h('label', { class: 'g3-chk' }, h('input', { type: 'checkbox', 'data-testid': 'rule-' + i }), r));
const _o8 = (p.text || '') + (p.link && g.allow_links ? '\n👉 ' + p.link : '');
const url = h('input', { type: 'url', class: 'g3-f', placeholder: 'Dán link bài đã đăng (tuỳ chọn)', 'data-testid': 'post-url', style: 'min-height:44px;width:100%' });
const _os = K.sheet({ title: 'Đăng tay vào ' + g.name, testid: 'post-now', body: [
chk.warnings.length ? h('div', null, chk.warnings.map(w => h('p', { class: chk.ok ? 'g3-warn' : 'g3-fail' }, '⚠️ ' + w))) : null,
g.rules ? h('details', { open: true }, h('summary', null, 'Nội quy nhóm'), h('pre', { class: 'g3-pre' }, g.rules)) : null,
h('strong', null, 'Trước khi đăng:'), ...boxes,
h('div', { class: 'g3-row' }, K.button('1. Chép nội dung', () => G.copy(_o8, 'Đã chép nội dung'), { testid: 'post-copy' }), !g.allow_links && p.link ? K.button('Chép link (để bình luận)', () => G.copy(p.link), { testid: 'post-copy-link' }) : null,
g.url ? K.linkBtn('2. Mở nhóm', g.url, null, { target: '_blank', testid: 'post-open' }) : null),
url,
K.button('3. Đã đăng xong', async () => {
if (!chk.ok) return K.toast('Bài này phạm nội quy nhóm (' + chk.warnings[0] + ') – đổi ngày hoặc nhóm.', 'warn');
if (boxes.some(b => !b.querySelector('input').checked)) return K.toast('Tích đủ các mục kiểm tra trước khi đăng', 'warn');
await G.save('g3_post', { ...p.raw, status: 'posted' }, { ...parseData(p.raw.data), posted_at: Date.now(), post_url: String(url.value || '').trim().slice(0, 500) });
_os.close(); K.toast('Đã ghi bài đăng', 'success'); _on();
}, { kind: 'primary', testid: 'post-done' })] });
}
await _on();
K.on(el, ['objects'], () => { if (!_op.querySelector('input:focus, textarea:focus, select:focus')) _on(); });
}
export default {
manifest: { id: 'g3_groups', title: 'Đăng nhóm cộng đồng', icon: '👥', screen: 'customers', order: 152, version: '0.1.0', status: 'ready',
help: 'Danh sách nhóm + nội quy, lịch đăng tự giãn cách, link gắn mã riêng từng nhóm để đếm khách; trước khi đăng app nhắc nội quy. Anh/chị tự đăng tay – app không tự đăng.' },
mount,
async selftest(ctx) {
const g = GR.groupView({ id: 'g', name: 'N', data: JSON.stringify({ code: 'G-N', days: [1], max_per_week: 1 }) });
const _oh = Date.UTC(2026, 10, 16, 13);
if (!GR.checkPost(g, { id: 'x', group_id: 'g', at: _oh, text: '' }, []).ok || GR.checkPost(g, { id: 'x', group_id: 'g', at: _oh + 86400000, text: '' }, []).ok) return { ok: false, details: 'Kiểm nội quy nhóm sai' };
return selftestG3(ctx);
},
};

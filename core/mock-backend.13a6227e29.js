const DAY = 86400000;
const _o1 = '(chế độ xem thử)';
export const DEMO_USER_PW = 'dungthu123';
export const DEMO_USERS = { sale: 'lan.demo', ctv: 'minh.demo' };
const PBKDF2_ITER = 150000;
async function _ok(pw, salt) {
const subtle = globalThis.crypto && globalThis.crypto.subtle;
if (!subtle) return null;
const _oq = (x) => new TextEncoder().encode(String(x));
const key = await subtle.importKey('raw', _oq(pw), 'PBKDF2', false, ['deriveBits']);
const _od = new Uint8Array(await subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: _oq(salt), iterations: PBKDF2_ITER }, key, 256));
let _oa = ''; for (let _o17 = 0; _o17 < _od.length; _o17++) _oa += String.fromCharCode(_od[_o17]);
return btoa(_oa);
}
const _o2 = (url) => `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Tin mẫu ${_o1}</title>
<item><title>Khởi công cầu mới nối hai bờ sông</title><link>https://example.com/tin-1</link><pubDate>${new Date(Date.now() - 3600000).toUTCString()}</pubDate><description>Tin mẫu từ ${String(url).replace(/[<&>]/g, '')}</description></item>
<item><title>Ngân hàng giảm lãi suất cho vay mua nhà</title><link>https://example.com/tin-2</link><pubDate>${new Date(Date.now() - 7200000).toUTCString()}</pubDate><description>Tin mẫu</description></item>
</channel></rss>`;
let _oh = null;
function _o1d(explicit) {
if (explicit) return Promise.resolve(explicit);
if (globalThis.ServerCore) return Promise.resolve(globalThis.ServerCore);
if (_oh) return _oh;
_oh = new Promise((resolve, reject) => {
if (typeof document === 'undefined') { reject(new Error('Không nạp được server_core.js (không có document)')); return; }
const _o1x = document.createElement('script');
_o1x.src = new URL('./server_core.js', import.meta.url).href;
_o1x.onload = () => (globalThis.ServerCore ? resolve(globalThis.ServerCore) : reject(new Error('server_core.js không tạo ServerCore')));
_o1x.onerror = () => { _oh = null; reject(new Error('Không tải được server_core.js')); };
document.head.appendChild(_o1x);
});
return _oh;
}
function _o1f() {
const _o1e = new Map();
return { getItem: (_o19) => (_o1e.has(_o19) ? _o1e.get(_o19) : null), setItem: (_o19, v) => _o1e.set(_o19, String(v)), removeItem: (_o19) => _o1e.delete(_o19) };
}
function _o1p(_o1x) {
if (_o1x) return _o1x;
try { if (globalThis.localStorage) { globalThis.localStorage.getItem('_'); return globalThis.localStorage; } } catch (e) { }
return _o1f();
}
function readJSON(_o1z, key, d) { try { const v = _o1z.getItem(key); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
function randomBytes(n) {
const _o8 = new Uint8Array(n);
if (globalThis.crypto && globalThis.crypto.getRandomValues) globalThis.crypto.getRandomValues(_o8);
else for (let _o17 = 0; _o17 < n; _o17++) _o8[_o17] = Math.floor(Math.random() * 256);
return Array.from(_o8);
}
const _o1v = (_o1m) => _o1m + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const _o3 = 'https://example.com/tin-mau-cau-moi';
export const DEMO_OUTLINE = {
title: 'Cầu mẫu nối hai bờ sông (xem thử)', video_kind: 'map', hook_type: 'b', stage: 'construction',
sources: [{ title: 'Tin mẫu ' + _o1, url: _o3, date: '2026-11-10' }],
scenes: [
{ kind: 'hook', title: 'Cầu mẫu dài 4,8 km', narration: ['Cầu mẫu dài 4,8 km vừa khởi công.', 'Cuối video có 3 câu nên kiểm tra.'], places: [], figures: [{ label: 'Chiều dài', value: '4,8 km', month: '10/2026', source_url: _o3 }] },
{ kind: 'map', title: 'Vị trí', narration: ['Cầu nối Hồ Hoàn Kiếm với bờ bên kia.'], places: ['Hồ Hoàn Kiếm, Hà Nội', 'Địa điểm không có thật XYZ'], figures: [] },
{ kind: 'stat', title: 'Vốn đầu tư', narration: ['Tổng vốn khoảng 19.000 tỷ đồng.', 'Dự kiến xong năm 2029.'], places: [], figures: [{ label: 'Tổng vốn', value: '19.000 tỷ đồng', month: '10/2026', source_url: _o3 }, { label: 'Hoàn thành', value: '2029', month: '', source_url: '' }] },
{ kind: 'stat', title: 'Kết nối', narration: ['Cầu giúp giảm tải cho các cầu cũ.'], places: [], figures: [] },
{ kind: 'checklist', title: '3 câu nên kiểm tra', narration: ['Trước khi quyết định, hãy tự hỏi ba câu.', 'Một: văn bản đã được duyệt chưa?', 'Hai: tiến độ thật ra sao?', 'Ba: nguồn tin từ đâu?', 'Lưu video lại để đối chiếu.'], places: [], figures: [] },
],
notes: 'Dàn cảnh mẫu ' + _o1,
};
const _o0 = {
tiktok: { title: 'Cầu mẫu 4,8 km khởi công', caption: '📍 Cầu mẫu dài 4,8 km (10/2026) vừa khởi công. 📊 Tổng vốn 19.000 tỷ đồng (10/2026). ✅ Anh chị thấy tuyến này thế nào? Nguồn: tin mẫu. Thông tin tham khảo, hãy tự kiểm chứng.', hashtags: ['#quyhoach', '#batdongsan', '#hanoi', '#caumoi', '#hatang', '#tintuc'] },
reels: { caption: 'Cầu mẫu dài 4,8 km vừa khởi công 👇\nTổng vốn 19.000 tỷ đồng (10/2026).\nNguồn: tin mẫu. Thông tin tham khảo.', hashtags: ['#quyhoach', '#batdongsan', '#hanoi'] },
shorts: { title: 'Cầu mẫu 4,8 km nối hai bờ sông – vốn 19.000 tỷ đồng', caption: 'Cầu mẫu dài 4,8 km vừa khởi công, tổng vốn 19.000 tỷ đồng (10/2026). Nguồn: tin mẫu.', hashtags: ['#quyhoach', '#hanoi', '#batdongsan'] },
};
function _o11(_o1r) {
if (_o1r.includes('BDS_DAN_CANH_JSON')) return '```json\n' + JSON.stringify(DEMO_OUTLINE) + '\n```';
if (_o1r.includes('BDS_CAPTION_JSON')) return JSON.stringify(_o0);
return null;
}
function _ou(_o1r, json, who) {
if (json) return JSON.stringify({ demo: true, note: `${who} ${_o1}`, summary: 'Nội dung mẫu ' + _o1, items: [] });
const _o1m = String(_o1r || '').toLowerCase();
if (_o1m.includes('zalo')) return `Dạ em chào anh/chị, em gửi anh/chị thông tin dự án và chính sách mới nhất. Anh/chị tiện nghe máy lúc nào để em tư vấn chi tiết ạ? ${_o1}`;
if (_o1m.includes('tóm tắt') || _o1m.includes('summar')) return `Tóm tắt: khách quan tâm căn 2 phòng ngủ, ngân sách khoảng 3 tỷ, muốn xem nhà cuối tuần. ${_o1}`;
if (_o1m.includes('kịch bản') || _o1m.includes('script')) return `Cảnh 1: Toàn cảnh dự án lúc hoàng hôn. Cảnh 2: Tiện ích nội khu. Cảnh 3: Kết nối giao thông. ${_o1}`;
return `${who} trả lời mẫu cho yêu cầu của anh/chị. ${_o1}`;
}
function _o10(_o1r, body) {
if (!String(_o1r).includes('BDS_G4_CONGTRUONG') || !body.tools) return null;
const src = 'https://example.com/tin-mau-cong-truong';
const entries = [
{ date: '2026-11-08', text: 'Tin mẫu: dự án đã cất nóc tháp A, đang hoàn thiện mặt ngoài ' + _o1 + '.', source_url: src, source_title: 'example.com' },
{ date: '2026-10-20', text: 'Tin mẫu: thi công tầng 25 tháp B ' + _o1 + '.', source_url: src + '-2', source_title: 'example.com' },
{ date: '2026-09-30', text: 'Tin mẫu không khớp nguồn tìm được ' + _o1 + '.', source_url: 'https://example.org/khong-co-trong-nguon', source_title: 'example.org' },
];
return { text: '```json\n' + JSON.stringify({ entries }) + '\n```',
grounding: { groundingMetadata: { webSearchQueries: ['tiến độ dự án mẫu'], groundingChunks: [{ web: { uri: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/mau', title: 'example.com' } }] } } };
}
function _oy(url, opts, body, push) {
const _o18 = url.startsWith('https://openapi.zalo.me/'), isAuth = url.startsWith('https://oauth.zaloapp.com/'), isZns = url.startsWith('https://business.openapi.zalo.me/');
if (!_o18 && !isAuth && !isZns) return null;
const ok = (data) => ({ status: 200, text: JSON.stringify({ error: 0, message: 'Success', data }) });
if (isAuth) return { status: 200, text: JSON.stringify({ access_token: 'demo-' + Date.now().toString(36), refresh_token: 'demo-refresh', expires_in: '90000' }) };
const _o21 = String((opts.headers || {}).access_token || '');
if (!/^demo/.test(_o21)) return { status: 200, text: JSON.stringify({ error: -216, message: 'Access token is invalid ' + _o1 }) };
if (isZns) { push({ channel: 'zalo_zns', text: JSON.stringify(body) }); return ok({ msg_id: 'zns-demo' }); }
if (url.includes('/v2.0/oa/getoa')) return ok({ oa_id: '1000000001', name: 'OA mẫu ' + _o1 });
if (url.includes('/v3.0/oa/user/getlist')) return ok({ total: 3, users: [{ user_id: '8000000001' }, { user_id: '8000000002' }, { user_id: '8000000003' }] });
if (url.includes('/v3.0/oa/user/detail')) {
let id = ''; try { id = JSON.parse(decodeURIComponent(url.split('data=')[1] || '')).user_id; } catch (e) { id = ''; }
return ok({ user_id: id, display_name: { 8000000001: 'Thu Trang', 8000000002: 'Minh Khoa', 8000000003: 'Hoàng Yến' }[id] || 'Người quan tâm' });
}
if (url.includes('/v3.0/oa/message/cs')) { push({ channel: 'zalo_oa', to: body.recipient && body.recipient.user_id, text: body.message && body.message.text }); return ok({ message_id: 'demo-' + Date.now().toString(36) }); }
return { status: 200, text: JSON.stringify({ error: -201, message: 'Chưa có bản giả cho ' + url }) };
}
function _oz(url, opts, body, push) {
if (!url.startsWith('https://business.openapi.zalo.me/message/template')) return null;
if (!/^demo/.test(String((opts.headers || {}).access_token || ''))) return { status: 200, text: JSON.stringify({ error: -124, message: 'Access token is invalid ' + _o1 }) };
push({ channel: 'g3_zns', text: JSON.stringify(body) });
return { status: 200, text: JSON.stringify({ error: 0, message: 'Success', data: { msg_id: 'g3-demo-' + Date.now().toString(36) } }) };
}
function _ox(_o1r, body) {
const _o1m = String(_o1r || '');
if (_o1m.includes('BDS_G1_RESEARCH') && body.tools) {
const text = [
'FACT | handover | 06/2029 | https://example.com/cdt-du-an-mau | "Bàn giao dự kiến tháng 6/2029 ' + _o1 + '" | 2026-11-01',
'FACT | scale | 3 toà 35 tầng, khoảng 1.800 căn ' + _o1 + ' | https://example.com/cdt-du-an-mau | "3 toà 35 tầng" | 2026-11-01',
'FACT | legal | Giấy phép xây dựng mẫu số 01/GPXD ' + _o1 + ' | https://example.org/tin-chua-kiem | "đã có giấy phép xây dựng" |',
'FACT | amenities | Hồ bơi, công viên nội khu ' + _o1 + ' | | "" |',
].join('\n');
return { text, grounding: { groundingMetadata: { webSearchQueries: ['dự án mẫu bàn giao'], groundingChunks: [{ web: { uri: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/g1mau', title: 'example.com' } }],
groundingSupports: [{ segment: { text: '06/2029' }, groundingChunkIndices: [0] }, { segment: { text: '3 toà 35 tầng' }, groundingChunkIndices: [0] }] } } };
}
if (_o1m.includes('BDS_G1_LAYOUT')) {
return { text: JSON.stringify({ unit_code: 'A-12.05', area_m2: 68.5, area_kind: 'thong_thuy', bedrooms: 2, wc: 2, corner: true, north_arrow: false, balcony_dir: 'Đông Nam', door_dir: null, view: 'hồ điều hoà (mẫu)', confidence: 0.82, notes: 'Layout mẫu ' + _o1 }) };
}
if (/BDS_AI_FRESH topic=news\b/.test(_o1m) && body.tools) {
const _o1w = Number((_o1m.match(/LƯỢT TÌM THÊM SỐ (\d)/) || [])[1]) || 1;
const _oj = (n) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
const _op = { 1: ['vnexpress.net', 'tuoitre.vn', 'thanhnien.vn', 'dantri.com.vn', 'cafef.vn'], 2: ['vietnamnet.vn', 'vneconomy.vn', 'baochinhphu.vn'],
3: ['nhandan.vn', 'laodong.vn', 'tienphong.vn', 'baodautu.vn'] }[_o1w] || [];
const items = _op.map((d, _o17) => ({ title: 'Tin mẫu từ ' + d + ' ' + _o1, summary: 'Nội dung mẫu ' + _o1, source_name: d, source_url: 'https://' + d + '/tin-mau.html', date: _oj(_o17 + _o1w) }));
if (_o1w === 2) items.push({ title: 'Tin mẫu từ vnexpress.net ' + _o1, summary: 'Bản cập nhật mới hơn ' + _o1, source_name: 'vnexpress.net', source_url: 'https://www.vnexpress.net/tin-mau.html?utm_source=x', date: _oj(0) });
return { text: 'Kết quả MẪU lượt ' + _o1w + ' ' + _o1 + ' – không phải tin thật.\n```json\n' + JSON.stringify({ items }) + '\n```',
grounding: { groundingMetadata: { webSearchQueries: ['mẫu tin lượt ' + _o1w], groundingChunks: _op.map((d, _o17) => ({ web: { uri: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/news' + _o1w + _o17, title: d } })) } } };
}
const _o13 = /BDS_AI_FRESH topic=(bank_rates|tax)\b/.exec(_o1m);
if (_o13 && body.tools) {
const _oj = new Date(Date.now() - 3 * 864e5).toISOString().slice(0, 10);
const src = (n) => ({ source_name: 'Trang mẫu ' + n, source_url: 'https://example.com/' + _o13[1] + '-' + n, date: _oj });
const law = (_o1x) => ({ legal: _o1x + ' ' + _o1, effective: '2026-07-01', ...src('luat') });
const data = _o13[1] === 'bank_rates' ? { banks: [
{ bank: 'Ngân hàng A (mẫu)', package: 'Gói mua nhà mẫu', promo_rate: 6.2, promo_months: 24, ref_rate: 7, margin: 3.5, floating_rate: null, prepay: [3, 2, 1, 0], max_ltv: 70, max_years: 30, note: _o1, ...src('a') },
{ bank: 'Ngân hàng D (mẫu)', promo_rate: 5.9, promo_months: 12, floating_rate: 10.5, base_label: 'lãi cơ sở + 3,8%', margin: 3.8, prepay: [2, 1, 0], max_ltv: 75, max_years: 25, note: _o1, ...src('d') },
{ bank: 'Ngân hàng E (mẫu)', promo_rate: 6.8, promo_months: 18, floating_rate: 10, note: 'Không có link nguồn ' + _o1 },
] } : {
pit: { rate_pct: 2, basis: 'price', basis_text: '2% × giá chuyển nhượng', ...law('Luật Thuế TNCN mẫu') },
lptb: { rate_pct: 0.5, ...law('Nghị định lệ phí trước bạ mẫu') },
lptb_online: { discount_pct: 10, ...law('Thông tư mẫu') },
notary: { tiers: [{ from: 0, to: 5e7, fixed: 5e4, pct: 0 }, { from: 0, to: 1e8, fixed: 1e5, pct: 0 }, { from: 0, to: 1e9, fixed: 0, pct: 0.1 }, { from: 1e9, to: 3e9, fixed: 1e6, pct: 0.06 },
{ from: 3e9, to: 5e9, fixed: 2.2e6, pct: 0.05 }, { from: 5e9, to: 1e10, fixed: 3.2e6, pct: 0.04 }, { from: 1e10, to: 1e11, fixed: 5.2e6, pct: 0.03 }, { from: 1e11, to: null, fixed: 32.2e6, pct: 0.02 }],
max: 7e7, ...law('Thông tư phí công chứng mẫu') },
appraisal: { text: 'Theo Nghị quyết HĐND tỉnh, khoảng 0,15% giá trị, tối đa vài triệu đồng ' + _o1, ...law('Nghị quyết HĐND mẫu') },
};
const _op = _o13[1] === 'bank_rates'
? ['vietcombank.com.vn', 'bidv.com.vn', 'vietinbank.vn', 'agribank.com.vn', 'techcombank.com', 'vpbank.com.vn', 'mbbank.com.vn', 'acb.com.vn', 'tpb.vn', 'sbv.gov.vn', 'cafef.vn']
: ['thuvienphapluat.vn', 'luatvietnam.vn', 'vbpl.vn', 'chinhphu.vn', 'mof.gov.vn', 'gdt.gov.vn', 'quochoi.vn', 'hanoi.gov.vn', 'vnexpress.net', 'tuoitre.vn', 'thanhnien.vn'];
return { text: 'Kết quả MẪU ' + _o1 + ' – không phải số liệu thật.\n```json\n' + JSON.stringify(data) + '\n```',
grounding: { groundingMetadata: { webSearchQueries: ['mẫu ' + _o13[1]], groundingChunks: _op.map((d, _o17) => ({ web: { uri: 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/fresh' + _o17, title: d } })) } } };
}
return null;
}
function _ov(_o1r) {
const _o1m = String(_o1r || '');
if (!_o1m.includes('BDS_CATALOG_DOC')) return null;
const _o8 = _o1m.lastIndexOf('<<<TAI_LIEU_BAT_DAU>>>'), _oa = _o1m.lastIndexOf('<<<TAI_LIEU_KET_THUC>>>');
const _on = _o8 >= 0 && _oa > _o8 ? _o1m.slice(_o8 + 22, _oa) : '';
const num = (_o1x) => { const t = String(_o1x).replace(/[^\d.,]/g, ''); if (!t) return NaN; return /^\d{1,3}([.,]\d{3})+$/.test(t) ? Number(t.replace(/[.,]/g, '')) : Number(t.replace(',', '.')); };
const units = [];
for (const _o1c of _on.split('\n')) {
const _of = _o1c.split(/\t|\s*\|\s*|;|,(?=\s*\S)/).map((c) => c.trim()).filter(Boolean);
if (!_of.length || !/^[A-Z]{1,3}\d{0,2}[-.]\d{1,2}([-.]\d{1,3})?$/.test(_of[0])) continue;
const _o1i = _of.slice(1).map(num).filter((n) => isFinite(n));
units.push({ code: _of[0], type: _of.find((c) => /pn|studio|duplex/i.test(c)) || '', area: _o1i.find((n) => n >= 10 && n < 2000) || null,
price: _o1i.find((n) => n >= 1e8) || null, area_kind: 'thong_thuy' });
}
const _o1y = {
project: { name: 'Dự án mẫu từ file', dev: 'Chủ đầu tư mẫu ' + _o1, loc: 'Phường mẫu, Hà Nội', status: 'đang bán', handover: 'Quý 4/2028',
legal: 'Đã có giấy phép xây dựng (mẫu) ' + _o1, price_from: null, price_to: null },
types: [{ name: '2PN', bedrooms: 2, area_from: 65, area_to: 75, area_kind: 'thong_thuy', unit_price_from: 72, unit_price_to: 80 },
{ name: '3PN', bedrooms: 3, area_from: 90, area_to: 110, area_kind: 'thong_thuy', unit_price_from: 70, unit_price_to: 78 }],
units,
plans: units.length ? [] : [{ name: 'Theo tiến độ (mẫu)', sub: 'Chiết khấu 5% ' + _o1, discount: 5, loan: 0, htls: 0, steps: [
{ name: 'Đặt cọc & đợt 1', pct: 20, at: 0, bank: false, when: 'Khi ký thoả thuận' }, { name: 'Ký HĐMB', pct: 10, at: 'HD', bank: false, when: '' },
{ name: 'Theo tiến độ xây dựng', pct: 40, at: 12, bank: false, when: '' }, { name: 'Bàn giao', pct: 30, at: 'H', bank: false, when: 'Khi bàn giao' }] }],
payment_note: units.length ? '' : 'Tiến độ mẫu: 20% – 10% – 40% – 30% ' + _o1,
notes: 'Kết quả mẫu ' + _o1, injection: /bo qua|bỏ qua|ignore/i.test(_on), confidence: 0.7,
};
return JSON.stringify(_o1y);
}
const _o7 = 'AAAAGGZ0eXBtcDQyAAAAAG1wNDJpc29tAAAACGZyZWU=';
function _o12(url, opts, body) {
const json = (o, status = 200) => ({ status, text: JSON.stringify(o) });
if (/^https:\/\/generativelanguage\.googleapis\.com\/v1beta\/models\/[\w.-]+:predictLongRunning$/.test(url)) {
return json({ name: 'models/' + url.split('/models/')[1].split(':')[0] + '/operations/demo' + String(Date.now()).slice(-6) });
}
if (/^https:\/\/generativelanguage\.googleapis\.com\/v1beta\/models\/[\w.-]+\/operations\//.test(url)) {
return json({ done: true, response: { generateVideoResponse: { generatedSamples: [{ video: { uri: 'https://generativelanguage.googleapis.com/v1beta/files/demo:download?alt=media' } }] } } });
}
if (url.startsWith('https://generativelanguage.googleapis.com/v1beta/files/')) return { status: 200, b64: _o7, mime: 'video/mp4' };
if (/^https:\/\/example\.com\/videoai\/demo-(runway|kling)\.mp4$/.test(url)) return { status: 200, b64: _o7, mime: 'video/mp4' };
if (url.startsWith('https://api.dev.runwayml.com/v1/') && /_to_video$/.test(url)) return json({ id: 'demo-runway-' + String(Date.now()).slice(-6) });
if (url.startsWith('https://api.dev.runwayml.com/v1/tasks/')) return json({ id: url.split('/').pop(), status: 'SUCCEEDED', output: ['https://example.com/videoai/demo-runway.mp4'], cost: { credits: 0 } });
if (/^https:\/\/[a-z0-9.-]+\.klingai\.com\/v1\/videos\/(text2video|image2video)$/.test(url)) return json({ code: 0, data: { task_id: 'demo' + String(Date.now()).slice(-6) } });
if (/^https:\/\/[a-z0-9.-]+\.klingai\.com\/v1\/videos\//.test(url)) return json({ code: 0, data: { task_status: 'succeed', task_result: { videos: [{ url: 'https://example.com/videoai/demo-kling.mp4' }] } } });
return null;
}
export function createMockBackend({ storageKey = 'bds_mock', storage, core, now } = {}) {
const _o1z = _o1p(storage);
const secretKey = storageKey + '_secret';
const driveKey = storageKey + '_drive';
const archiveKey = storageKey + '_archive';
const booksKey = storageKey + '_books';
const state = { tables: readJSON(_o1z, storageKey, {}) || {}, props: readJSON(_o1z, secretKey, {}) || {}, drive: readJSON(_o1z, driveKey, null) || { folders: {}, seq: 0 },
archive: readJSON(_o1z, archiveKey, null) || { seq: 0, file: null }, books: readJSON(_o1z, booksKey, null) || undefined };
if (!state.tables || typeof state.tables !== 'object') state.tables = {};
let _o1n = false;
const _o1o = () => {
try {
_o1z.setItem(storageKey, JSON.stringify(state.tables));
_o1z.setItem(secretKey, JSON.stringify(state.props));
} catch (e) { }
try { _o1z.setItem(driveKey, JSON.stringify(state.drive)); } catch (e) { }
try { _o1z.setItem(archiveKey, JSON.stringify(state.archive)); } catch (e) { }
try { if (state.books) _o1z.setItem(booksKey, JSON.stringify(state.books)); } catch (e) { }
};
const onChange = () => {
if (_o1n) return;
_o1n = true;
Promise.resolve().then(() => { _o1n = false; _o1o(); });
};
const _og = now || (() => Date.now());
const _o1j = (row) => {
const t = state.tables._outbox || (state.tables._outbox = []);
t.push({ id: _o1v('ob_'), at: _og(), ...row });
if (t.length > 300) t.splice(0, t.length - 300);
onChange();
};
const _ow = (url, opts = {}) => {
const body = (() => { try { return JSON.parse(opts.body || '{}'); } catch (e) { return {}; } })();
const _o22 = _o12(url, opts, body); if (_o22) return _o22;
const _o15 = _oy(url, opts, body, _o1j); if (_o15) return _o15;
const _o16 = _oz(url, opts, body, _o1j); if (_o16) return _o16;
if (url.startsWith('https://api.telegram.org/') && url.includes('/getUpdates')) {
return { status: 200, text: JSON.stringify({ ok: true, result: [{ update_id: 1, message: { chat: { id: 100200300, type: 'private', first_name: 'Chủ app (xem thử)' }, text: 'chào' } }] }) };
}
if (url.startsWith('https://generativelanguage.googleapis.com/v1beta/models?')) {
return { status: 200, text: JSON.stringify({ models: [{ name: 'models/gemini-3.8-flash' }] }) };
}
if (/^https:\/\/example\.com\//.test(url) && /rss|feed|atom|\.xml/i.test(url)) return { status: 200, text: _o2(url) };
if (url === 'https://api.anthropic.com/v1/models') {
return { status: 200, text: JSON.stringify({ data: [{ id: 'claude-sonnet-5-5' }] }) };
}
if (url.startsWith('https://api.telegram.org/')) {
_o1j({ channel: 'telegram', text: body.text || body.caption || '', buttons: body.reply_markup || null, file: body.video || body.photo || null });
return { status: 200, text: '{"ok":true,"result":{}}' };
}
if (url.includes('generativelanguage.googleapis.com')) {
const parts = (body.contents && body.contents[0] && body.contents[0].parts) || [];
const _o1r = parts.map((x) => x.text || '').join(' ');
const json = !!(body.generationConfig && body.generationConfig.responseMimeType === 'application/json');
const g4 = _o10(_o1r, body);
const _o14 = _ox(_o1r, body);
const _oe = _ov(_o1r);
if (_oe) return { status: 200, text: JSON.stringify({ candidates: [{ content: { parts: [{ text: _oe }] }, finishReason: 'STOP' }], usageMetadata: { promptTokenCount: 800, candidatesTokenCount: 400 } }) };
if (_o14) return { status: 200, text: JSON.stringify({ candidates: [{ content: { parts: [{ text: _o14.text }] }, finishReason: 'STOP', ...(_o14.grounding || {}) }], usageMetadata: { promptTokenCount: 300, candidatesTokenCount: 150 } }) };
if (g4) return { status: 200, text: JSON.stringify({ candidates: [{ content: { parts: [{ text: g4.text }] }, finishReason: 'STOP', ...g4.grounding }], usageMetadata: { promptTokenCount: 200, candidatesTokenCount: 120 } }) };
const _o23 = _o11(_o1r);
const grounding = _o23 && body.tools ? { groundingMetadata: { webSearchQueries: ['cầu mẫu khởi công 2026'], groundingChunks: [{ web: { uri: _o3, title: 'example.com' } }],
groundingSupports: [{ segment: { text: 'Cầu mẫu dài 4,8 km vừa khởi công' }, groundingChunkIndices: [0] }] } } : {};
return { status: 200, text: JSON.stringify({ candidates: [{ content: { parts: [{ text: _o23 || _ou(_o1r, json, 'Gemini') }] }, finishReason: 'STOP', ...grounding }], usageMetadata: { promptTokenCount: Math.ceil(_o1r.length / 4), candidatesTokenCount: 60 } }) };
}
if (url === 'https://api.anthropic.com/v1/messages') {
const c = (body.messages && body.messages[0] && body.messages[0].content) || [];
const _o1r = (Array.isArray(c) ? c : [{ type: 'text', text: c }]).filter((x) => x.type === 'text').map((x) => x.text).join(' ');
const json = !!(body.system && /JSON/.test(body.system));
return { status: 200, text: JSON.stringify({ content: [{ type: 'text', text: _o11(_o1r) || _ou(_o1r, json, 'Claude') }], stop_reason: 'end_turn', usage: { input_tokens: Math.ceil(_o1r.length / 4), output_tokens: 60 } }) };
}
{ const _om = /^https:\/\/(?:cloudflare-dns\.com\/dns-query|dns\.google\/resolve)\?name=([^&]+)&type=(\w+)/.exec(url);
if (_om) {
const name = decodeURIComponent(_om[1]);
if (_om[2] === 'NS') return { status: 200, text: JSON.stringify(/chua-ns/.test(name) ? { Status: 0, Answer: [{ type: 2, data: 'ns1.nhadangky.vn.' }] } : { Status: 0, Answer: [{ type: 2, data: 'ana.ns.cloudflare.com.' }, { type: 2, data: 'bob.ns.cloudflare.com.' }] }) };
return { status: 200, text: JSON.stringify({ Status: 0, Answer: [{ type: 1, data: '104.21.0.1' }] }) };
}
const _o1q = /^https:\/\/([a-z0-9.-]+)\/__bds\/ping/.exec(url);
if (_o1q) {
if (/chua-worker/.test(_o1q[1])) throw new Error('DNS ' + _o1q[1]);
const _oo = _o1q[1].replace(/^kiemtra-[0-9a-f]+\./, '');
return { status: 200, text: JSON.stringify({ ok: true, worker: 'bds-trang', v: '1.0.0', host: _o1q[1], domain: _oo, ready: true }) };
} }
{ const _o24 = /^https:\/\/([a-z0-9.-]+)\/version\.json\?wizcheck=/.exec(url);
if (_o24) { if (/chua-tro|\.invalid$/.test(_o24[1])) throw new Error('DNS ' + _o24[1]); if (/trang-khac/.test(_o24[1])) return { status: 200, text: '<html>trang khác</html>' }; return { status: 200, text: JSON.stringify({ web: (globalThis.ServerCore && (globalThis.ServerCore.version || globalThis.ServerCore.VERSION)) || '' }) }; } }
return { status: 404, text: '{}' };
};
const _ol = { gemini_key: 'demo', telegram_token: 'demo', telegram_chat_id: 'demo', owner_email: 'demo@dungthu.local' };
for (const _o19 in _ol) if (!state.props[_o19]) state.props[_o19] = _ol[_o19];
if (!state.props.demo_landing_base) state.props.demo_landing_base = String(_og());
const _o1b = () => {
const _ob = Number(state.props.demo_landing_base);
return [
{ lead_id: 'demo-L1', ten: 'Nguyễn Thu Trang', sdt: '0912345678', du_an: 'Dự án Mẫu 04', nhu_cau: 'mua', ngan_sach: 4200000000, ghi_chu: 'Quan tâm căn 2N view hồ', consent: 1, ts: _ob - 3 * 3600000 },
{ lead_id: 'demo-L2', ten: 'Trần Minh Khoa', sdt: '0987654321', du_an: 'Dự án Mẫu 05', nhu_cau: 'mua', ngan_sach: 6500000000, ghi_chu: 'Muốn nhận báo giá 3N', consent: 1, ts: _ob - 2 * 3600000 },
{ lead_id: 'demo-L3', ten: 'Lê Hoàng Yến', sdt: '0901112233', du_an: 'Dự án Mẫu 10', nhu_cau: 'thuê', ghi_chu: 'Hỏi giá thuê studio', consent: 0, ts: _ob - 3600000 },
];
};
let _o9 = null;
let _o6 = null;
const ready = _o1d(core).then((_o5) => {
_o6 = _o5;
_o9 = _o5.memoryAdapter({
state,
now: _og,
random: randomBytes,
fetch: _ow,
mail: (to, subject, body) => _o1j({ channel: 'mail', to, subject, text: body }),
landing: { rowsSince: (ms) => _o1b().filter((_o1s) => _o1s.ts > ms) },
backup: () => { _o1j({ channel: 'backup', text: 'Sao lưu giả ' + _o1 }); const _o1s = _o9.backupCopies ? _o9.backupCopies.snapshot('BDS Studio – Sao lưu ' + new Date(_og()).toISOString().slice(0, 16).replace('T', ' ')) : null; return { file: 'demo-backup', ...(_o1s || {}) }; },
drive: true,
archive: true,
cache: true,
denyBase: () => { try { return String(location.href).split('#')[0].split('?')[0]; } catch (e) { return ''; } },
identityToken: () => String(state.props.demo_id_token || ''),
driveUsage: () => { let used = 0; try { used = (_o1z.getItem(storageKey) || '').length * 2; } catch (e) { } return { used, total: 15 * 1024 * 1024 * 1024 }; },
onChange,
});
return _o5;
});
async function call(req) {
const _o5 = await ready;
if (req && req.action === 'system.check') { state.props.landing_ok_at = String(_og() - 2 * 60000); state.props.cron_ok_reminders = String(_og() - 20 * 60000); }
const _o1u = _o5.handle(JSON.parse(JSON.stringify(req || {})), _o9);
return JSON.parse(JSON.stringify(_o1u));
}
async function cron(name) { const _o5 = await ready; return _o5.cron(name, _o9); }
async function seedDemo({ force = false } = {}) {
await ready;
if (state.props.demo_seeded && !force) return { seeded: false };
const t = _og();
const _o4 = 3600000;
const _o1g = (_o17, name, phone, status, extra = {}) => ({
id: 'demo_c' + String(_o17).padStart(2, '0'), kind: 'customer', name, phone, zalo: phone, email: '', source: extra.source || 'manual',
status, owner: '', project: extra.project || '', unit_type: extra.unit_type || '', budget: extra.budget || '', need: extra.need || 'mua',
note: extra.note || '', tags: extra.tags || '', birthday: extra.birthday || '', consent: 1, lead_ref: '', score: extra.score || 0,
data: JSON.stringify(extra.data || {}), created_at: t - (extra.age || 10) * DAY, updated_at: t, deleted: 0,
});
const _o20 = new Date(t + 7 * _o4);
const _oc = `1988-${String(_o20.getUTCMonth() + 1).padStart(2, '0')}-${String(_o20.getUTCDate()).padStart(2, '0')}`;
const _oi = [
_o1g(1, 'Phạm Quốc Bảo', '0903000001', 'Mới', { source: 'landing', project: 'Dự án Mẫu 04', budget: 3500000000, age: 0.1, note: 'Để lại số trên landing' }),
_o1g(2, 'Đỗ Thị Mai', '0903000002', 'Mới', { source: 'landing', project: 'Dự án Mẫu 05', budget: 5000000000, age: 0.5 }),
_o1g(3, 'Vũ Đức Anh', '0903000003', 'Đã liên hệ', { project: 'Dự án Mẫu 10', budget: 2800000000, age: 4, score: 45 }),
_o1g(4, 'Hoàng Lan Chi', '0903000004', 'Đang chăm sóc', { project: 'Dự án Mẫu 04', unit_type: '2N', budget: 4100000000, age: 6, score: 72, tags: 'nóng' }),
_o1g(5, 'Bùi Văn Hùng', '0903000005', 'Hẹn xem nhà', { project: 'Dự án Mẫu 11', unit_type: '3N', budget: 7200000000, age: 8, score: 80 }),
_o1g(6, 'Ngô Thanh Hà', '0903000006', 'Đang đàm phán', { project: 'Dự án Mẫu 10', unit_type: '2N+', budget: 3900000000, age: 12, score: 88 }),
_o1g(7, 'Đặng Minh Tuấn', '0903000007', 'Đã đặt cọc', { project: 'Dự án Mẫu 05', unit_type: '1N', budget: 2600000000, age: 20, score: 90 }),
_o1g(8, 'Lý Thu Hằng', '0903000008', 'Đã mua', { project: 'Dự án Mẫu 04', unit_type: '2N', budget: 4500000000, age: 60, score: 95, birthday: _oc, note: 'Đã ký HĐMB, đóng tiền theo tiến độ' }),
_o1g(9, 'Trịnh Gia Huy', '0903000009', 'Đang chăm sóc', { need: 'thuê', project: 'Dự án Mẫu 10', budget: 18000000, age: 3, score: 50 }),
_o1g(10, 'Mai Phương Thảo', '0903000010', 'Không tiềm năng', { project: 'Dự án Mẫu 11', age: 90, note: 'Đã mua chỗ khác' }),
_o1g(11, 'Cao Văn Lộc', '0903000011', 'Đang chào bán', { need: 'bán', project: 'Dự án Mẫu 04', budget: 5200000000, age: 15, score: 60 }),
_o1g(12, 'Phan Ngọc Ánh', '0903000012', 'Đã liên hệ', { project: 'Dự án Mẫu 05', age: 2, score: 30 }),
];
const _or = (_o17, oid, type, text, ago) => ({ id: 'demo_e' + _o17, object_id: oid, type, text, at: t - ago, data: '{}', updated_at: t, deleted: 0 });
const _os = [
_or(1, 'demo_c03', 'call', 'Gọi lần đầu, khách hẹn gửi bảng giá', 3 * DAY),
_or(2, 'demo_c04', 'zalo', 'Đã gửi bảng giá 2N qua Zalo', 2 * DAY),
_or(3, 'demo_c05', 'meeting', 'Hẹn xem nhà mẫu thứ Bảy', DAY),
_or(4, 'demo_c06', 'quote', 'Gửi báo giá căn 2N+ tầng 18', 2 * DAY),
_or(5, 'demo_c07', 'payment', 'Khách đặt cọc 100 triệu', 5 * DAY),
_or(6, 'demo_c08', 'status', 'Chuyển trạng thái: Đã mua', 30 * DAY),
];
const _o1t = (_o17, oid, kind, title, due, extra = {}) => ({
id: 'demo_r' + String(_o17).padStart(2, '0'), object_id: oid, kind, title, due_at: due, remind_before_days: extra.before || 0,
amount: extra.amount || '', installment: extra.installment || '', done: extra.done || 0, notified_at: extra.done ? due : '', data: '{}', updated_at: t, deleted: 0,
});
const reminders = [
_o1t(1, 'demo_c01', 'followup', 'Gọi chào khách mới', t + 2 * _o4),
_o1t(2, 'demo_c03', 'followup', 'Gọi lại gửi bảng giá', t - DAY),
_o1t(3, 'demo_c05', 'meeting', 'Dẫn khách xem nhà mẫu', t + 2 * DAY),
_o1t(4, 'demo_c06', 'followup', 'Chốt phương án thanh toán', t + 5 * _o4),
_o1t(5, 'demo_c08', 'birthday', 'Chúc mừng sinh nhật khách', t + _o4),
_o1t(6, 'demo_c08', 'payment', 'Đóng tiền đợt 1', t - 30 * DAY, { amount: 450000000, installment: 1, done: 1 }),
_o1t(7, 'demo_c08', 'payment', 'Đóng tiền đợt 2', t + 4 * DAY, { amount: 675000000, installment: 2, before: 7 }),
_o1t(8, 'demo_c08', 'payment', 'Đóng tiền đợt 3', t + 64 * DAY, { amount: 675000000, installment: 3, before: 7 }),
_o1t(9, 'demo_c08', 'payment', 'Đóng tiền đợt 4', t + 124 * DAY, { amount: 1350000000, installment: 4, before: 7 }),
_o1t(10, 'demo_c08', 'handover', 'Bàn giao căn hộ', t + 240 * DAY, { before: 14 }),
];
const users = _o9.table('users').all();
const _o1l = users.find((u) => u.role === 'owner' && Number(u.deleted) !== 1);
const _o1h = async (username, full_name, role) => {
const _ot = users.find((u) => u.username === username);
if (_ot) return _ot;
const salt = btoa(String.fromCharCode(...randomBytes(16)));
const pw_hash = await _ok(DEMO_USER_PW, salt);
if (!pw_hash) return null;
return _o6.tools.createUser(_o9, { username, full_name, email: username + '@dungthu.local', email_verified: true, phone: '', role, pw_hash, salt, must_change_pw: false });
};
let _o1a = null, minh = null;
try { _o1a = await _o1h(DEMO_USERS.sale, 'Nguyễn Thị Lan', 'sale'); minh = await _o1h(DEMO_USERS.ctv, 'Trần Văn Minh', 'ctv'); } catch (e) { }
const _o1k = _o1l ? _o1l.id : '';
for (const c of _oi) { c.owner = _o1k; c.created_by = _o1k; }
if (_o1a) for (const _o17 of [3, 4, 9, 12]) { const c = _oi[_o17 - 1]; c.owner = _o1a.id; }
if (minh) for (const _o17 of [11, 12]) { const c = _oi[_o17 - 1]; c.created_by = minh.id; if (_o17 === 11) c.owner = ''; }
for (const _o17 of [1, 2]) _oi[_o17 - 1].owner = '';
const characters = [
{ id: 'demo_ch1', name: 'Mai – tư vấn viên', kind: 'ai', gender: 'nữ', age_range: '25-30', style: 'chuyên nghiệp, thân thiện', outfit: 'áo vest kem, sơ mi trắng',
lock_en: 'Vietnamese woman, 27 years old, shoulder-length black hair, oval face, warm smile, cream blazer over white shirt, natural makeup', voice: 'hn_female_ngochuyen_full_48k-fhg',
images: '[]', consent: JSON.stringify({ owner_is_subject: false }), notes: 'Nhân vật mẫu ' + _o1, created_by: _o1k, updated_at: t, deleted: 0 },
{ id: 'demo_ch2', name: 'Anh Hùng – chuyên gia', kind: 'ai', gender: 'nam', age_range: '40-45', style: 'điềm đạm, đáng tin', outfit: 'sơ mi xanh navy, quần âu',
lock_en: 'Vietnamese man, 42 years old, short neat black hair with slight grey at temples, rectangular glasses, navy shirt, calm confident expression', voice: 'hn_male_manhdung_news_48k-fhg',
images: '[]', consent: JSON.stringify({ owner_is_subject: false }), notes: 'Nhân vật mẫu ' + _o1, created_by: _o1k, updated_at: t, deleted: 0 },
];
_o9.table('characters').upsert(characters);
_o9.table('objects').upsert(_oi);
_o9.table('events').upsert(_os);
_o9.table('reminders').upsert(reminders);
_o9.props.set('demo_seeded', '1');
_o1o();
return { seeded: true, customers: _oi.length, reminders: reminders.length, users: [_o1a, minh].filter(Boolean).map((u) => u.username), characters: characters.length };
}
function outbox() { return (state.tables._outbox || []).slice(); }
function reset() {
for (const _o19 of Object.keys(state.tables)) delete state.tables[_o19];
for (const _o19 of Object.keys(state.props)) delete state.props[_o19];
for (const _o19 in _ol) state.props[_o19] = _ol[_o19];
state.props.demo_landing_base = String(_og());
state.drive.folders = {}; state.drive.seq = 0;
state.archive.file = null; state.archive.seq = 0; state.archive.copies = [];
if (state.books) { state.books.files = {}; state.books.index = []; state.books.moved = []; state.books.seq = 0; }
try { _o1z.removeItem(storageKey); _o1z.removeItem(secretKey); _o1z.removeItem(driveKey); _o1z.removeItem(archiveKey); } catch (e) { }
_o1o();
}
async function driveDrop(folder, name, mime, b64) { await ready; return _o9.drive.saveFile(folder, name, mime, b64, 'base64'); }
return { call, cron, seedDemo, outbox, reset, ready, driveDrop, mock: true };
}
export default createMockBackend;

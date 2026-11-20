import { strip } from '../_lib/crm.js';
export const PLATFORMS = {
facebook: { name: 'Facebook / Instagram', fields: { primary: 125, headline: 40, description: 30 }, counts: { primary: 3, headline: 3, description: 2 }, src: 'https://www.facebook.com/business/ads-guide' },
google: { name: 'Google tìm kiếm', fields: { headline: 30, description: 90, path: 15 }, counts: { headline: 15, description: 4, path: 2 }, src: 'https://support.google.com/google-ads/answer/7684791' },
tiktok: { name: 'TikTok', fields: { text: 100 }, counts: { text: 3 }, src: 'https://ads.tiktok.com/help/' },
zalo: { name: 'Zalo Ads', fields: { title: 40, text: 90 }, counts: { title: 2, text: 2 }, src: 'https://ads.zalo.me/' },
};
export const FIELD_NAMES = { primary: 'Văn bản chính', headline: 'Dòng tiêu đề', description: 'Mô tả', path: 'Đường dẫn hiển thị', text: 'Nội dung', title: 'Tiêu đề' };
const _o0 = [
[/\b(duy nhat|so 1|so mot|top 1|dau tien|re nhat|tot nhat|dep nhat|(?<!cap |thong |hop |dong |moi |chu |sinh )nhat(?! ban))\b/, 'Từ so sánh tuyệt đối ("nhất", "số 1"…) cần tài liệu chứng minh – Luật Quảng cáo Điều 8.'],
[/\b(cam ket loi nhuan|loi nhuan cam ket|lai \d+ ?%|chac chan (tang|lai|loi)|bao loi|x2 tai san|tang gia \d+ ?%)\b/, 'Hứa lợi nhuận/tăng giá – dễ bị coi là sai sự thật, nền tảng cũng hạn chế.'],
[/\b(so do trao tay|so hong rieng)\b/, 'Chỉ ghi khi pháp lý đúng như vậy tại thời điểm quảng cáo.'],
[/\b(sap het|chi con \d+|cuoi cung|duy nhat hom nay)\b/, 'Khan hiếm phải đúng thật, có số liệu.'],
[/\b(0 dong|mien phi 100|khong can von)\b/, 'Câu dễ gây hiểu lầm về chi phí – ghi rõ điều kiện.'],
];
export function checkCopy(text) {
const _od = ' ' + strip(text).replace(/[^a-z0-9%\s]/g, ' ').replace(/\s+/g, ' ') + ' ';
return _o0.filter(([re]) => re.test(_od)).map(([, why]) => why);
}
function _o5(_od, n) {
_od = String(_od || '').replace(/\s+/g, ' ').trim(); if (_od.length <= n) return _od;
const _o2 = _od.slice(0, n + 1);
const sent = Math.max(_o2.lastIndexOf('. '), _o2.lastIndexOf('? '), _o2.lastIndexOf(' – '), _o2.lastIndexOf(': '));
const _o1 = sent >= n * 0.5 ? sent : _o2.lastIndexOf(', ');
if (_o1 >= n * 0.5 && _o1 <= n) return _od.slice(0, _o1).replace(/[,.;:–-]+$/, '').trim();
const _oh = _od.slice(0, n), i = _oh.lastIndexOf(' ');
let _oa = (i > n * 0.5 ? _oh.slice(0, i) : _oh).replace(/[,.;:–-]+$/, '').trim();
for (let _o8 = 0; _o8 < 3; _o8++) { const t = _oa.replace(/[,\s]+(từ|giá|tham khảo|khu|và|tại|ở|cho|của|với|tháng|căn|chỉ)$/i, '').replace(/[,.;:–-]+$/, '').trim(); if (t === _oa || t.length < n * 0.4) break; _oa = t; }
return _oa;
}
function _og(a) { return [...new Set(a.filter(Boolean))]; }
export function adInputs(p = {}, extra = {}) {
const _ob = Array.isArray(p.price) ? p.price.filter(x => Number(x) > 0) : [];
const _o7 = String(p.handover || '').match(/^(\d{4})-(\d{2})/);
return { name: p.name || '', loc: p.area || p.loc || '', dev: p.dev || '', price: _ob.length ? (_ob.length > 1 && _ob[0] !== _ob[1] ? `${_ob[0]}–${_ob[1]} tr/m²` : `${_ob[0]} tr/m²`) : '',
types: (p.types || []).map(t => t && t.n).filter(Boolean).slice(0, 4).join(', '), handover: _o7 ? `${_o7[2]}/${_o7[1]}` : '',
usp: (extra.usp || []).map(_od => String(_od).trim()).filter(Boolean), offer: String(extra.offer || '').trim(), audience: String(extra.audience || '').trim(), cta: extra.cta || 'Nhận bảng giá' };
}
export function generateCopy(platform, x) {
const P = PLATFORMS[platform];
if (!P) return null;
const n = x.name || 'Dự án';
const _of = x.usp.length ? x.usp : _og([x.loc && 'Vị trí ' + x.loc, x.types && 'Căn ' + x.types, x.handover && 'Bàn giao ' + x.handover]);
const _oc = {
primary: [
`${n}${x.loc ? ' – ' + x.loc : ''}. ${_of.slice(0, 2).join('. ')}. ${x.offer ? x.offer + '. ' : ''}Để lại số để nhận bảng giá, chính sách tháng này.`,
`Đang tìm căn ${x.types || 'hộ'}${x.loc ? ' khu ' + x.loc : ''}? ${n}${x.price ? ' giá tham khảo ' + x.price : ''}. Nhắn ngay để xem mặt bằng còn trống.`,
`${x.audience ? x.audience + ': ' : ''}${n} ${_of[0] ? _of[0].toLowerCase() : ''}. Tư vấn vay, lịch thanh toán rõ ràng – bấm để nhận tài liệu.`,
],
headline: [`${n}: bảng giá mới`, `${n}${x.handover ? ' – bàn giao ' + x.handover : ''}`, `Nhận chính sách ${n}`, `${n}${x.price ? ' từ ' + x.price : ''}`, `Xem nhà mẫu ${n}`,
`Căn ${x.types || 'đẹp'} ${n}`, `${x.loc || n} – xem mặt bằng`, 'Nhận bảng giá qua Zalo', `Tư vấn vay ${n}`, 'Lịch thanh toán chi tiết'],
description: [`${_of.slice(0, 2).join('. ') || n}. Nhận bảng giá, chính sách và tài liệu qua Zalo trong 5 phút.`, `${n}${x.price ? ', giá tham khảo ' + x.price : ''}. Tư vấn vay, lịch thanh toán, xem nhà mẫu.`,
`${x.offer || 'Chính sách bán hàng tháng này'}. Để lại số để được gửi chi tiết.`, `Môi giới có chứng chỉ, thông tin theo công bố chính thức của chủ đầu tư.`],
path: [strip(n).split(' ').slice(0, 2).join('-'), 'bang-gia'],
text: [`${n}${x.loc ? ' ' + x.loc : ''} – bấm nhận bảng giá & chính sách mới`, `Căn ${x.types || 'hộ'} ${n}${x.price ? ' từ ' + x.price : ''}, xem ngay`, `${x.offer || 'Tài liệu ' + n} – để lại số nhận qua Zalo`],
title: [`${n}`, `Bảng giá ${n}`],
};
if (platform === 'google') _oc.description[0] = `${_of.slice(0, 2).join('. ') || n}. Nhận bảng giá và chính sách qua Zalo.`;
if (platform === 'zalo') _oc.text = [`${n}${x.loc ? ' – ' + x.loc : ''}. Nhận bảng giá, chính sách qua Zalo.`, `${x.offer || 'Chính sách mới'} – nhắn để nhận tài liệu ${n}.`];
const fields = {};
for (const [f, max] of Object.entries(P.fields)) {
const list = _og((_oc[f] || []).map(_od => f === 'path' ? _o5(_od, max) : _o5(_od, max))).slice(0, P.counts[f]);
fields[f] = list.map(text => ({ text, len: text.length, max, over: text.length > max, risks: checkCopy(text) }));
}
return { platform, name: P.name, src: P.src, fields };
}
export function creativeBrief(platform, x, { objective = 'Thu số điện thoại khách quan tâm', budget = 0, days = 0, link = '' } = {}) {
const _o6 = { facebook: 'Ảnh vuông 1080×1080 hoặc dọc 1080×1350; video dọc 9:16 dưới 30 giây có phụ đề', tiktok: 'Video dọc 9:16 (1080×1920), 15–30 giây, 3 giây đầu nêu điều khách được', google: 'Chữ (tìm kiếm); nếu chạy hiển thị: ảnh ngang 1200×628 và vuông 1200×1200', zalo: 'Ảnh 1200×628 hoặc vuông, chữ trên ảnh ít' }[platform] || '';
return [
`BẢN YÊU CẦU QUẢNG CÁO – ${PLATFORMS[platform] ? PLATFORMS[platform].name : platform}`,
`Dự án: ${x.name}${x.dev ? ' (' + x.dev + ')' : ''}${x.loc ? ' – ' + x.loc : ''}`,
`Mục tiêu: ${objective}`,
x.audience ? `Khách hướng tới: ${x.audience}` : 'Khách hướng tới: (điền độ tuổi, khu vực, thu nhập, nhu cầu ở/đầu tư)',
`Thông điệp chính: ${(x.usp.length ? x.usp : [x.types && 'Căn ' + x.types, x.handover && 'Bàn giao ' + x.handover].filter(Boolean)).join(' · ') || '(điền 2–3 điểm mạnh)'}`,
x.offer ? `Ưu đãi: ${x.offer}` : '',
`Kêu gọi: ${x.cta}`,
`Định dạng: ${_o6}`,
link ? `Link đích (đã gắn mã đo): ${link}` : '',
budget ? `Ngân sách: ${Math.round(budget).toLocaleString('vi-VN')}đ${days ? ' trong ' + days + ' ngày' : ''}` : '',
'Bắt buộc: ảnh/video đúng thực tế hoặc ghi "Ảnh minh hoạ"; giá ghi "tham khảo"; không hứa lợi nhuận; không dùng "nhất/số 1" khi không có chứng minh.',
].filter(Boolean).join('\n');
}
export function budgetPlan({ mode = 'target', deals = 0, budget = 0, conv = 0, channels = [], commission = 0 } = {}) {
const _o3 = channels.filter(_o2 => Number(_o2.share) > 0 && Number(_o2.cpl) > 0);
const _oe = _o3.reduce((_od, _o2) => _od + Number(_o2.share), 0);
if (!_o3.length || !_oe || !(conv > 0)) return { ok: false, reason: 'Cần ít nhất 1 kênh có tỷ lệ chia và chi phí/khách, và tỷ lệ chốt > 0.' };
const avgCpl = _o3.reduce((_od, _o2) => _od + Number(_o2.cpl) * Number(_o2.share) / _oe, 0);
const _o9 = _o3.reduce((_od, _o2) => _od + (Number(_o2.share) / _oe) / Number(_o2.cpl), 0);
let total, leads;
if (mode === 'target') { leads = Math.ceil(deals / (conv / 100)); total = Math.round(leads / _o9); }
else { total = Math.round(budget); leads = Math.floor(total * _o9); }
const rows = _o3.map(_o2 => { const money = Math.round(total * Number(_o2.share) / _oe); return { key: _o2.key, share: Math.round(Number(_o2.share) / _oe * 1000) / 10, cpl: Number(_o2.cpl), money, leads: Math.floor(money / Number(_o2.cpl)) }; });
const _o4 = Math.floor(leads * conv / 100 * 10) / 10;
return { ok: true, total, leads, deals: _o4, avgCpl: Math.round(avgCpl), rows, cpa: _o4 ? Math.round(total / _o4) : null,
roi: commission && total ? Math.round((_o4 * commission - total) / total * 1000) / 10 : null };
}

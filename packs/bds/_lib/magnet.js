import { taggedLink, readAttribution, cleanCode } from '../g3_lib/attribution.js';
import { parseData, strip } from './crm.js';
import { fmtMoney, atLabel } from './sales.js';
import { withRules } from '../../../shared/ai_rules.js';
export const CAMPAIGN_PREFIX = 'moi-cau-';
export const DAILY_GROUP_LIMIT = 5;
export const TEMPLATES = [
{ id: 'banggia', icon: '🏢', hue: 32, name: 'Bảng giá & mặt bằng', needs: 'project', needsPermission: true,
benefit: 'Khoảng giá tham khảo, loại căn, diện tích và các phương án thanh toán của dự án – xem nhanh trên điện thoại.' },
{ id: 'vay', icon: '🏦', hue: 205, name: 'Bảng tính làm sổ & vay', needs: 'loan',
benefit: 'Tự ước số tiền trả góp mỗi tháng và các khoản phí làm sổ trước khi xuống tiền.' },
{ id: 'phaply', icon: '✅', hue: 150, name: 'Checklist pháp lý 10 điểm',
benefit: '10 giấy tờ cần hỏi trước khi đặt cọc – tránh cọc nhầm dự án chưa đủ điều kiện bán.' },
{ id: 'thue', icon: '🧾', hue: 280, name: 'Cẩm nang thuế phí',
benefit: 'Các khoản thuế, lệ phí khi mua mới và khi chuyển nhượng – ai thường nộp, nộp bao nhiêu.' },
{ id: 'tiendo', icon: '📅', hue: 12, name: 'Lịch thanh toán & dòng tiền', needs: 'project',
benefit: 'Mỗi đợt đóng bao nhiêu, vào lúc nào – để chuẩn bị dòng tiền cho một căn mẫu.' },
{ id: 'quyhoach', icon: '🗺️', hue: 95, name: 'Tóm tắt quy hoạch & hạ tầng', needs: 'planning',
benefit: 'Các công trình hạ tầng, quy hoạch đã công bố quanh khu vực – kèm nguồn để tự đối chiếu.' },
{ id: 'thuemua', icon: '⚖️', hue: 180, name: 'So sánh thuê hay mua', needs: 'loan',
benefit: 'Bảng so sánh chi phí hằng tháng khi thuê và khi vay mua, theo số của chính mình.' },
{ id: 'tintuan', icon: '📰', hue: 225, name: 'Tin thị trường tuần này', needs: 'news',
benefit: 'Điểm tin bất động sản đáng chú ý trong tuần, có ghi nguồn báo.' },
];
const _o0 = new Map(TEMPLATES.map((t) => [t.id, t]));
export const templateById = (id) => _o0.get(String(id || '')) || null;
export const sourceLabel = (id) => { const t = templateById(id); return t ? 'Mồi câu: ' + t.name : ''; };
export const magnetCampaign = (id) => (templateById(id) ? CAMPAIGN_PREFIX + id : '');
export function magnetLabel(campaign) {
const _oc = /^moi-cau-([a-z]+)$/.exec(String(campaign || '').trim().toLowerCase());
return _oc ? sourceLabel(_oc[1]) : '';
}
export const WARNINGS = [
'Chỉ phát tài liệu mình có quyền phát: bảng giá, mặt bằng, brochure của chủ đầu tư thường cần được chủ đầu tư/đại lý cho phép.',
'Không dùng tên, logo chủ đầu tư hay thương hiệu dự án để khách hiểu lầm mình là đại diện chính thức – ghi rõ mình là môi giới.',
'Thu dữ liệu cá nhân phải minh bạch: form ghi rõ dùng số để làm gì, khách tự tích đồng ý và rút lại được bất cứ lúc nào.',
];
export const POSTING_TIPS = [
'Đọc nội quy từng nhóm trước khi đăng; nhóm cấm link thì để link ở bình luận hoặc thôi không đăng.',
`Mỗi ngày đăng tối đa ${DAILY_GROUP_LIMIT} nhóm, mỗi nhóm một bài khác nhau – đăng dồn dập dễ bị coi là spam và bị khoá.`,
'Viết như chia sẻ tài liệu hữu ích, trả lời câu hỏi trong bình luận; không nhắn tin làm phiền người không hỏi.',
'App không tự đăng bài hay nhắn tin thay anh/chị – chép caption rồi tự đăng.',
];
export function postQuota(countToday, limit = DAILY_GROUP_LIMIT) {
const n = Math.max(0, Number(countToday) || 0), left = Math.max(0, limit - n);
return { ok: left > 0, left, message: left > 0 ? `Hôm nay còn đăng được ${left}/${limit} nhóm.` : `Hôm nay đã đăng ${limit} nhóm – để mai đăng tiếp cho an toàn.` };
}
const _o1 = [
[/loi nhuan/, 'hứa lợi nhuận'], [/tang gia/, 'nói về tăng giá'], [/sinh loi/, 'hứa sinh lời'], [/\bx ?[2-9]\b/, 'nhân tài sản'], [/nhan doi/, 'nhân đôi'],
[/cam ket/, 'cam kết'], [/chac chan/, 'chắc chắn'], [/dam bao/, 'đảm bảo'], [/lai khung|lai cao/, 'lãi khủng'], [/sieu pham/, 'siêu phẩm'],
[/co hoi vang/, 'cơ hội vàng'], [/chay hang|sot/, 'cháy hàng/sốt'], [/\bnhat\b/, 'so sánh tuyệt đối'],
];
export function hypeCheck(text) {
const s = ' ' + strip(text).replace(/[^a-z0-9%\s]/g, ' ').replace(/\s+/g, ' ').replace(/\bcap nhat\b/g, 'cap_nhat') + ' ';
return _o1.filter(([re]) => re.test(s)).map(([, why]) => why);
}
const _od = (iso) => { const _oc = /^(\d{4})-(\d{2})/.exec(String(iso || '')); return _oc ? _oc[2] + '/' + _oc[1] : ''; };
const _o4 = (iso) => { const _oc = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || '')); return _oc ? _oc[3] + '/' + _oc[2] : ''; };
const _op = () => { const _o3 = new Date(Date.now() + 7 * 3600e3); return _o3.toISOString().slice(0, 10); };
const _oj = (_of) => String((_of && _of.name) || '').trim();
export function magnetTitle(id, { project = null, today = '' } = {}) {
const n = _oj(project), at = today || _op();
switch (id) {
case 'banggia': return `Bảng giá & mặt bằng ${n || 'dự án'} (tham khảo, cập nhật ${_od(at)})`;
case 'vay': return 'Bảng tính chi phí làm sổ & vay ngân hàng – tự điền số của mình';
case 'phaply': return 'Checklist pháp lý 10 điểm cần hỏi trước khi đặt cọc';
case 'thue': return 'Cẩm nang thuế, phí khi mua và chuyển nhượng nhà đất';
case 'tiendo': return `Lịch tiến độ thanh toán & dòng tiền mẫu${n ? ' ' + n : ''}`;
case 'quyhoach': return `Tóm tắt quy hoạch & hạ tầng khu vực ${String((project && (project.loc || project.area)) || n || 'dự án').split('·').pop().trim()}`;
case 'thuemua': return 'Thuê hay mua? Bảng so sánh chi phí theo số của anh/chị';
case 'tintuan': return `Điểm tin thị trường bất động sản tuần ${_o4(at)}`;
default: return '';
}
}
export function captions(id, { title = '', link = '', project = null } = {}) {
const t = templateById(id);
if (!t) return [];
const n = _oj(project), ttl = title || magnetTitle(id, { project });
const ask = {
banggia: `Nhà mình ai đang tìm hiểu ${n || 'dự án này'} mà chưa có bảng giá, mặt bằng để so các loại căn không?`,
vay: 'Có ai từng bất ngờ vì tiền trả góp và phí làm sổ cao hơn mình tính không?',
phaply: 'Trước khi đặt cọc, nhà mình thường kiểm tra những giấy tờ gì?',
thue: 'Mua nhà, bán nhà thì ai nộp thuế, ai nộp lệ phí – nhiều bạn hỏi mình câu này.',
tiendo: `Mua${n ? ' ' + n : ''} thì mỗi đợt đóng bao nhiêu, đóng lúc nào?`,
quyhoach: 'Khu này sắp có những công trình hạ tầng nào đã được công bố?',
thuemua: 'Đang thuê nhà, có nên vay mua không – tính sao cho đúng với túi tiền mình?',
tintuan: 'Tuần này thị trường có tin gì đáng chú ý?',
}[id];
const _on = '(Đăng theo nội quy nhóm; nếu không phù hợp, nhờ admin gỡ giúp mình.)';
const _o8 = link ? `\n👉 ${link}` : '';
return [
`Mình vừa tổng hợp "${ttl}" để gửi khách quen, thấy hữu ích nên chia sẻ lại cho mọi người. ${t.benefit}\nAi cần thì tải miễn phí ở link dưới, để lại số Zalo là mở được tài liệu.${_o8}\n${_on}`,
`${ask}\nMình có soạn sẵn tài liệu "${ttl}" – ${t.benefit.charAt(0).toLowerCase() + t.benefit.slice(1)} Bạn nào cần cứ lấy, có thắc mắc thì hỏi ngay dưới bình luận, mình trả lời.${_o8}\n${_on}`,
`📄 Chia sẻ tài liệu miễn phí: ${ttl}.\nSố liệu mang tính tham khảo, có ghi nguồn.${_o8}\n${_on}`,
];
}
export function aiCaptionPrompt(id, { title = '', project = null } = {}) {
const t = templateById(id);
if (!t) return '';
return withRules(`Viết 3 caption tiếng Việt ngắn (dưới 400 ký tự) để chia sẻ tài liệu miễn phí "${title || magnetTitle(id, { project })}" vào hội nhóm bất động sản${_oj(project) ? ' (dự án ' + _oj(project) + ')' : ''}. ` +
`Lợi ích: ${t.benefit} Giọng chia sẻ như người trong nhóm, không bán thẳng, không hứa lợi nhuận hay tăng giá, không dùng "nhất", "số 1", nhắc đăng theo nội quy nhóm. Để chỗ [LINK] cho đường link. Không nêu số liệu, giá, tiến độ nếu không có trong tài liệu.`);
}
export const DISCLAIMER = 'Tài liệu mang tính tham khảo, do môi giới tổng hợp – không phải tài liệu chính thức của chủ đầu tư hay cơ quan nhà nước. Giá, chính sách, thuế phí theo công bố/quy định tại thời điểm giao dịch.';
const _om = (a) => (Array.isArray(a) && a.length ? (a[0] === a[1] || a[1] == null ? String(a[0]) : `${a[0]}–${a[1]}`) : '');
function _oi(P, ratePct, years) {
const _ol = (Number(ratePct) || 0) / 1200, n = Math.max(1, Math.round((Number(years) || 0) * 12));
return _ol ? P * _ol / (1 - Math.pow(1 + _ol, -n)) : P / n;
}
function _ob(loan = {}, price) {
const _of = Number(loan.price || price) || 3e9, ratio = Math.min(0.9, Math.max(0, Number(loan.ratio ?? 0.7))), rate = Number(loan.rate ?? 10) || 10, years = Number(loan.years ?? 25) || 25;
return { price: _of, ratio, rate, years, amount: _of * ratio };
}
export function buildContent(id, data = {}) {
const t = templateById(id);
if (!t) return null;
const _of = data.project || null, n = _oj(_of);
const _oe = { id, title: magnetTitle(id, { project: _of, today: data.today }), sections: [], sources: [], disclaimer: DISCLAIMER };
const _oo = (h, lines) => _oe.sections.push({ h, lines: lines.filter(Boolean) });
if (id === 'banggia') {
const _ok = _of && Array.isArray(_of.price) ? _of.price : null;
_oo('Thông tin chung', [n ? 'Dự án: ' + n : 'Dự án: (chọn dự án trong Thông tin dự án)', _of && _of.dev ? 'Chủ đầu tư: ' + _of.dev : '', _of && _of.loc ? 'Vị trí: ' + _of.loc : '',
_ok ? `Giá tham khảo: ${_om(_ok)} triệu/m² (đã gồm VAT, phí bảo trì – ước tính)` : 'Giá: liên hệ để nhận bảng giá mới', _of && _of.handover ? 'Bàn giao dự kiến: ' + _od(_of.handover) : '']);
_oo('Loại căn & diện tích', (_of && _of.types || []).map((_ou) => _ou.ask || !_ou.a ? `${_ou.n}: liên hệ` : `${_ou.n}: ${_om(_ou.a)} m²` + (_ok ? ` · ước ${fmtMoney(_ou.a[0] * _ok[0] * 1e6)} – ${fmtMoney((_ou.a[1] ?? _ou.a[0]) * (_ok[1] ?? _ok[0]) * 1e6)}` : '')));
if ((data.plans || []).length) _oo('Phương án thanh toán', data.plans.map((pl) => `${pl.name}${pl.loan ? ` · vay tới ${Math.round(pl.loan * 100)}%` : ''}${pl.factor && pl.factor < 1 ? ` · tổng phải trả ≈ ${Math.round(pl.factor * 1000) / 10}% giá niêm yết` : ''}`));
_oo('Mặt bằng', ['Mặt bằng tầng/căn: đính kèm tệp do Chủ tải lên (nếu được chủ đầu tư cho phép phát).']);
_oe.sources.push('Thông tin dự án trong app (giá tham khảo)', 'Chính sách bán hàng đang áp dụng');
} else if (id === 'vay') {
const L = _ob(data.loan, data.price), _oc = _oi(L.amount, L.rate, L.years), first = L.amount / (L.years * 12) + L.amount * L.rate / 1200;
_oo('Khoản vay mẫu (tự thay số của mình)', [`Giá căn: ${fmtMoney(L.price)}`, `Vay ${Math.round(L.ratio * 100)}%: ${fmtMoney(L.amount)}`, `Lãi suất giả định: ${L.rate}%/năm · thời hạn ${L.years} năm`,
`Trả góp đều: ≈ ${fmtMoney(_oc)}/tháng`, `Trả gốc đều: tháng đầu ≈ ${fmtMoney(first)}, các tháng sau giảm dần`, `Tổng lãi nếu trả đều hết hạn: ≈ ${fmtMoney(_oc * L.years * 12 - L.amount)}`]);
_oo('Chi phí làm sổ (tham khảo)', [`Lệ phí trước bạ: 0,5% giá tính lệ phí (≈ ${fmtMoney(L.price * 0.005)} với giá trên)`, 'Phí thẩm định hồ sơ cấp giấy chứng nhận: theo mức của HĐND tỉnh/thành',
'Phí công chứng hợp đồng (nếu có): theo biểu phí công chứng', 'Căn hộ mới: 2% phí bảo trì thường đã nằm trong lịch thanh toán', 'Chi phí vay: phí định giá tài sản, bảo hiểm khoản vay – tuỳ ngân hàng']);
_oo('Lưu ý', ['Lãi suất ưu đãi thường chỉ trong thời gian đầu, sau đó thả nổi – hỏi ngân hàng biên độ cộng thêm.', 'Nên giữ tiền trả góp dưới khoảng 40–50% thu nhập hằng tháng.']);
_oe.sources.push('Máy tính vay trong app', 'Nghị định 10/2022/NĐ-CP về lệ phí trước bạ');
} else if (id === 'phaply') {
_oo('10 điểm cần hỏi trước khi đặt cọc', [
'1. Giấy chứng nhận quyền sử dụng đất hoặc quyết định giao/cho thuê đất của dự án.', '2. Quyết định phê duyệt quy hoạch chi tiết 1/500.', '3. Giấy phép xây dựng (hoặc văn bản miễn phép).',
'4. Văn bản của Sở Xây dựng xác nhận nhà ở hình thành trong tương lai đủ điều kiện được bán.', '5. Biên bản nghiệm thu phần móng (với nhà chưa xây xong).',
'6. Bảo lãnh ngân hàng cho nghĩa vụ bàn giao nhà của chủ đầu tư.', '7. Dự án/căn có đang thế chấp không – nếu có, hỏi văn bản giải chấp.',
'8. Hợp đồng mẫu: tiến độ, phạt chậm bàn giao, cách tính diện tích (thông thủy).', '9. Bên nhận cọc là ai, có quyền nhận cọc không; tiền cọc với chủ đầu tư không quá 5% giá bán (Luật Kinh doanh BĐS 2023).',
'10. Chuyển tiền vào tài khoản đứng tên chủ đầu tư/bên bán, giữ đủ chứng từ.']);
_oe.sources.push('Luật Kinh doanh bất động sản 2023', 'Luật Nhà ở 2023');
} else if (id === 'thue') {
_oo('Khi chuyển nhượng (mua bán lại)', ['Bên bán: thuế thu nhập cá nhân 2% giá chuyển nhượng (theo quy định hiện hành).', 'Bên mua: lệ phí trước bạ 0,5% giá tính lệ phí.',
'Phí công chứng hợp đồng theo biểu phí; phí thẩm định hồ sơ theo mức của tỉnh/thành.', 'Ai nộp khoản nào do hai bên thoả thuận và ghi rõ trong hợp đồng.']);
_oo('Khi mua mới từ chủ đầu tư', ['Giá bán thường đã gồm thuế giá trị gia tăng (phần không tính tiền đất).', 'Phí bảo trì 2% (căn hộ chung cư) – đóng theo tiến độ.', 'Khi làm sổ: lệ phí trước bạ 0,5% và phí thẩm định hồ sơ.']);
_oo('Lưu ý', ['Kê khai, nộp đúng hạn để tránh tiền phạt chậm nộp.', 'Quy định có thể thay đổi – hỏi lại cơ quan thuế/văn phòng công chứng trước khi ký.']);
_oe.sources.push('Luật Thuế thu nhập cá nhân', 'Nghị định 10/2022/NĐ-CP về lệ phí trước bạ');
} else if (id === 'tiendo') {
const _oh = (data.plans || [])[0] || null, price = Number(data.price) || (_of && _of.price && _of.types && _of.types.find((_ou) => !_ou.ask && _ou.a) ? _of.types.find((_ou) => !_ou.ask && _ou.a).a[0] * _of.price[0] * 1e6 : 3e9);
const _oq = price * (_oh && _oh.factor ? _oh.factor : 1);
_oo('Căn mẫu', [n ? 'Dự án: ' + n : '', `Giá căn mẫu: ${fmtMoney(price)}`, _oh ? 'Phương án: ' + _oh.name : 'Phương án: chọn chính sách trong Thông tin dự án']);
_oo('Các đợt thanh toán', _oh ? (_oh.steps || []).map((s) => `${s.name} – ${atLabel(s.at)}: ${Math.round(s.pct * 1000) / 10}% ≈ ${fmtMoney(_oq * s.pct)}${s.bank ? ' (ngân hàng giải ngân nếu vay)' : ''}`) : ['Chưa có phương án – Chủ bổ sung chính sách bán hàng.']);
_oe.sources.push('Chính sách bán hàng trong app');
} else if (id === 'quyhoach') {
const list = (data.planning || []).filter((_ou) => _ou && _ou.title);
_oo('Khu vực', [n ? 'Dự án: ' + n : '', _of && _of.loc ? 'Vị trí: ' + _of.loc : 'Vị trí: Chủ bổ sung']);
_oo('Hạ tầng, quy hoạch đã ghi nhận', list.length ? list.map((_ou) => _ou.title + (_ou.note ? ' – ' + _ou.note : '')) : ['Chủ bổ sung các công trình đã được công bố (đường, cầu, metro, trường, bệnh viện) kèm nguồn.']);
_oo('Cách tự kiểm tra', ['Tra cứu bản đồ quy hoạch trên cổng thông tin của tỉnh/thành hoặc hỏi Sở Quy hoạch – Kiến trúc.', 'Phân biệt "đã phê duyệt", "đang triển khai" và "đề xuất" – chỉ tin vào văn bản đã ban hành.']);
_oe.sources.push('Nguồn: văn bản quy hoạch đã công bố, đối chiếu trước khi dùng');
} else if (id === 'thuemua') {
const L = _ob(data.loan, data.price), rent = Number(data.rent) || Math.round(L.price * 0.004 / 1e5) * 1e5, _oc = _oi(L.amount, L.rate, L.years);
_oo('Giả định (thay bằng số của mình)', [`Giá căn: ${fmtMoney(L.price)} · vốn tự có ${fmtMoney(L.price - L.amount)}`, `Vay ${fmtMoney(L.amount)}, ${L.rate}%/năm, ${L.years} năm`, `Tiền thuê căn tương tự: ${fmtMoney(rent)}/tháng`]);
_oo('So sánh mỗi tháng', [`Thuê: ≈ ${fmtMoney(rent)}`, `Mua (trả góp đều): ≈ ${fmtMoney(_oc)}`, `Tiền lãi tháng đầu: ≈ ${fmtMoney(L.amount * L.rate / 1200)} – phần còn lại là trả gốc`]);
_oo('Lưu ý', ['Bảng tính không giả định tăng giá nhà – chỉ so chi phí bỏ ra.', 'Nên tính thêm chi phí cơ hội của vốn tự có, phí quản lý, sửa chữa.']);
_oe.sources.push('Máy tính vay trong app');
} else if (id === 'tintuan') {
const _o9 = (data.news || []).filter((_ou) => _ou && _ou.title).slice(0, 6);
_oo('Tin đáng chú ý', _o9.length ? _o9.map((_ou) => `${_ou.title}${_ou.summary ? ' – ' + _ou.summary : ''} (${[_ou.source_name, _o4(_ou.date) && _o4(_ou.date) + '/' + String(_ou.date).slice(0, 4)].filter(Boolean).join(', ')})`) : ['Chưa có tin – Chủ bấm "Cập nhật tin" ở mục Thị trường hoặc tự thêm tin kèm nguồn.']);
_oe.sources.push('Tin tổng hợp trong app, có link bài gốc');
}
return _oe;
}
export function contentText(c) {
if (!c) return '';
return [c.title.toUpperCase(), '', ...c.sections.flatMap((s) => [s.h, ...s.lines.map((l) => '- ' + l), '']), c.sources.length ? 'Nguồn: ' + c.sources.join('; ') : '', c.disclaimer].join('\n');
}
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
export function contentHtml(c, agent = {}) {
if (!c) return '';
const _ot = [agent.name, agent.license ? 'CCHN ' + agent.license : '', agent.phone].filter(Boolean).map(esc).join(' · ');
return `<!doctype html>\n<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(c.title)}</title>
<style>body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;max-width:760px;margin:0 auto;padding:24px 16px;color:#1d2433;line-height:1.55}h1{font-size:1.5rem;color:#0f1e33}h2{font-size:1.1rem;margin-top:1.4em;color:#0f1e33}li{margin:4px 0}footer{margin-top:24px;font-size:.85rem;color:#5b6475;border-top:1px solid #ddd;padding-top:10px}@media print{.np{display:none}}</style></head>
<body><p class="np" style="background:#fff6dd;padding:8px;border-radius:8px">Lưu thành PDF: bấm In → chọn "Lưu thành PDF", rồi đưa tệp lên Google Drive.</p><h1>${esc(c.title)}</h1>
${c.sections.map((s) => `<h2>${esc(s.h)}</h2><ul>${s.lines.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`).join('\n')}
<footer>${c.sources.length ? `<p>Nguồn: ${esc(c.sources.join('; '))}</p>` : ''}<p>${esc(c.disclaimer)}</p>${_ot ? `<p>Môi giới: ${_ot}</p>` : ''}</footer></body></html>\n`;
}
export function coverSvg(id, { title = '', subtitle = 'Tài liệu miễn phí · số liệu tham khảo' } = {}) {
const t = templateById(id) || { hue: 210, icon: '📄' };
const words = String(title || '').split(/\s+/).filter(Boolean), lines = [];
for (const _os of words) { if (lines.length && (lines[lines.length - 1] + ' ' + _os).length <= 30) lines[lines.length - 1] += ' ' + _os; else lines.push(_os); }
if (lines.length > 4) { lines.length = 4; lines[3] += '…'; }
const h = t.hue;
return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},55%,22%)"/><stop offset="1" stop-color="hsl(${(h + 40) % 360},50%,38%)"/></linearGradient></defs>` +
`<rect width="1200" height="630" fill="url(#g)"/><rect x="40" y="40" width="1120" height="550" rx="28" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="3"/>` +
`<text x="80" y="150" font-size="84">${esc(t.icon)}</text>` +
lines.map((l, i) => `<text x="80" y="${250 + i * 78}" font-family="system-ui,Segoe UI,Roboto,sans-serif" font-size="62" font-weight="700" fill="#fff">${esc(l)}</text>`).join('') +
`<text x="80" y="555" font-family="system-ui,Segoe UI,Roboto,sans-serif" font-size="30" fill="rgba(255,255,255,.85)">${esc(subtitle)}</text></svg>`;
}
export const coverDataUri = (id, o) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coverSvg(id, o));
export const CONSENT_PURPOSE = 'Tên và số điện thoại/Zalo chỉ dùng để gửi tài liệu này và liên hệ tư vấn bất động sản; không bán, không chia sẻ cho bên khác.';
export function withdrawText(agent = {}) {
const _og = String((agent && agent.phone) || '').replace(/[^\d+]/g, '');
return _og ? `Muốn rút lại đồng ý hoặc xoá số: gọi/nhắn Zalo ${_og} nội dung "XOÁ SỐ".` : 'Muốn rút lại đồng ý hoặc xoá số: trả lời tin nhắn Zalo gửi tài liệu với nội dung "XOÁ SỐ".';
}
export function normPhone(raw) {
let s = String(raw ?? '').replace(/[\s.\-()]/g, '');
if (/^\+84/.test(s)) s = '0' + s.slice(3); else if (/^84\d{9,10}$/.test(s)) s = '0' + s.slice(2);
return /^0[35789]\d{8}$/.test(s) || /^02\d{9}$/.test(s) ? s : '';
}
export function validateLead(f = {}) {
const name = String(f.name ?? '').replace(/\s+/g, ' ').trim().slice(0, 80), phone = normPhone(f.phone), consent = f.consent === true || f.consent === 1;
const errors = {};
if (name.length < 2) errors.name = 'Anh/chị nhập giúp họ tên.';
if (!phone) errors.phone = 'Số điện thoại chưa đúng (10 số, ví dụ 0912 345 678).';
if (!consent) errors.consent = 'Anh/chị tích ô đồng ý để nhận tài liệu.';
return { ok: !Object.keys(errors).length, errors, value: { name, phone, consent } };
}
export const SALE_CODE_RE = /^[a-z2-7]{8}$/;
export const validSaleCode = (c) => SALE_CODE_RE.test(String(c || ''));
export const SALE_LIMIT = 'Mã sale (s=) do máy chủ tạo bằng khoá bí mật, không đoán được; app luôn gắn mã của chính người đang đăng nhập và thay mã lạ trong link dán vào. ' +
'Giới hạn: ai cầm được link của sale khác vẫn gửi form qua link đó; máy chủ chỉ tự giao KHÁCH MỚI – số đã có trong app giữ người phụ trách cũ (Chủ giao lại trong app).';
export function magnetLink(base, { tplId, saleCode = '', group = '' } = {}) {
if (!templateById(tplId)) return '';
const _o2 = taggedLink(base, {});
if (!_o2) return '';
const _or = new URL(_o2);
_or.searchParams.delete('s');
if (validSaleCode(saleCode)) _or.searchParams.set('s', saleCode);
_or.searchParams.set('utm_source', 'group');
_or.searchParams.set('utm_medium', 'community');
_or.searchParams.set('utm_campaign', magnetCampaign(tplId));
const _o7 = cleanCode(group);
if (_o7) _or.searchParams.set('utm_content', _o7); else _or.searchParams.delete('utm_content');
return _or.toString();
}
export function linkSale(url) { try { return new URL(url).searchParams.get('s') || ''; } catch { return ''; } }
export const linkOwnedBy = (url, code) => validSaleCode(code) && linkSale(url) === code;
const _o5 = (o) => { const _o3 = parseData(o && o.data); return templateById(_o3.magnet) ? _o3.magnet : ''; };
function _o6(c) {
const _o3 = parseData(c && c.data), ids = [];
if (_o3.g3 && _o3.g3.kind === 'doc' && _o3.g3.ref_id) ids.push(String(_o3.g3.ref_id));
if (Array.isArray(_o3.g3_hist)) for (const _ou of _o3.g3_hist) if (_ou && _ou.ref_id) ids.push(String(_ou.ref_id));
for (const _oa of [_o3.landing_id, _o3.landing && _o3.landing.id, _o3.lp_last && _o3.lp_last.landing_id]) if (_oa && String(_oa).startsWith('g3doc_')) ids.push(String(_oa).slice(6));
return ids;
}
export function magnetOfCustomer(c, docs = []) {
const byId = new Map(docs.map((o) => [String(o.id), o]));
for (const id of _o6(c)) { const _oc = _o5(byId.get(id)); if (_oc) return _oc; }
const _oc = /^moi-cau-([a-z]+)$/.exec(String(readAttribution(c).utm_campaign || '').toLowerCase());
return _oc && templateById(_oc[1]) ? _oc[1] : '';
}
export const customerSource = (c, docs) => sourceLabel(magnetOfCustomer(c, docs));
export function magnetStats(doc, customers = [], { me = '' } = {}) {
const id = String(doc && doc.id);
const list = customers.filter((c) => (!c.kind || c.kind === 'customer') && !Number(c.deleted) && _o6(c).includes(id));
return { leads: list.length, mine: me ? list.filter((c) => c.owner === me || c.created_by === me).length : 0, opens: null };
}

import { gate, readLog, stateOf, statusText, scopeLabel, channelLabel, dmy, LIMITS } from '../../../shared/consent.js';
export * from '../../../shared/consent.js';
export const NOTICE_KEY = 'consent.notice';
export const CONTRACT_KINDS = ['payment', 'meeting', 'handover'];
export const DISCLAIMER = 'MẪU THAM KHẢO, không phải tư vấn pháp lý. Chủ app cần đối chiếu Nghị định 13/2023/NĐ-CP, Luật Bảo vệ dữ liệu cá nhân và các văn bản hướng dẫn hiện hành, hoặc hỏi luật sư trước khi dùng.';
export const DEFAULT_NOTICE = {
version: 'TB-MAU-1',
text: [
'THÔNG BÁO VỀ DỮ LIỆU CÁ NHÂN',
'Em là {ten}, chuyên viên tư vấn bất động sản. Em xin phép lưu họ tên, số điện thoại, Zalo và nhu cầu nhà đất anh/chị đã cung cấp.',
'• Mục đích: liên hệ tư vấn, gửi thông tin dự án anh/chị quan tâm. Chỉ khi anh/chị đồng ý thêm: gửi tin ưu đãi; dùng công cụ AI tóm tắt nhu cầu (không gửi số điện thoại).',
'• Thời hạn lưu: đến khi anh/chị yêu cầu xoá, tối đa 24 tháng kể từ lần liên hệ cuối.',
'• Không bán, không chia sẻ thông tin cho bên khác khi chưa được anh/chị đồng ý.',
'• Anh/chị có quyền xem, sửa, rút lại đồng ý hoặc yêu cầu xoá bất cứ lúc nào – chỉ cần nhắn hoặc gọi em.',
'• Liên hệ: {ten} – {sdt}.',
'Anh/chị đồng ý cho em lưu thông tin để tư vấn không ạ?',
].join('\n'),
};
export function visibleReminders(reminders, customers) {
const _o0 = new Set((customers || []).filter(c => c && !gate(c, 'contact').ok).map(c => c.id));
if (!_o0.size) return reminders || [];
return (reminders || []).filter(r => !r || !_o0.has(r.object_id) || CONTRACT_KINDS.includes(r.kind));
}
const _o7 = (v, max) => String(v == null ? '' : v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);
const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
function _o1(t) { return String(t == null ? '' : t).replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, LIMITS.noticeText); }
export function noticeConfig(v) {
const _o9 = v && typeof v === 'object' ? v : {};
const text = _o1(_o9.text);
if (!text) return { version: DEFAULT_NOTICE.version, text: DEFAULT_NOTICE.text, at: 0, custom: false, history: [] };
const history = (Array.isArray(_o9.history) ? _o9.history : []).map(_o4 => ({ version: _o7(_o4 && _o4.version, LIMITS.notice), text: _o1(_o4 && _o4.text), at: num(_o4 && _o4.at) }))
.filter(_o4 => _o4.version && _o4.text).slice(-LIMITS.noticeVersions);
return { version: _o7(_o9.version, LIMITS.notice) || 'TB-?', text, at: num(_o9.at), custom: true, history };
}
export function saveNotice(cur, text, { now = Date.now() } = {}) {
const c = noticeConfig(cur && cur.custom === false ? null : cur);
const t = _o1(text);
if (!t || t === c.text) return c;
const _o2 = new Date(now + 7 * 3600e3).toISOString().slice(0, 10).replace(/-/g, '');
const _o8 = new Set([c.version, ...c.history.map(_o9 => _o9.version)]);
let version = 'TB-' + _o2, n = 1;
while (_o8.has(version)) version = 'TB-' + _o2 + '-' + (++n);
const history = [...c.history.filter(_o9 => _o9.version !== c.version), { version: c.version, text: c.text, at: c.at }].slice(-(LIMITS.noticeVersions - 1));
return { version, text: t, at: now, custom: true, history };
}
export function noticeText(cfg, version) {
const c = noticeConfig(cfg && cfg.custom === false ? null : cfg);
if (version === c.version) return c.text;
if (version === DEFAULT_NOTICE.version) return DEFAULT_NOTICE.text;
const _o4 = c.history.find(_o9 => _o9.version === version);
return _o4 ? _o4.text : '';
}
export function fillNotice(text, me = {}) {
return String(text || '').replace(/\{ten\}/g, me.name || 'em').replace(/\{sdt\}/g, me.phone || '(số điện thoại của em)');
}
export const CSV_HEAD = ['Khách', 'Điện thoại', 'Thời điểm', 'Hành động', 'Phạm vi', 'Kênh', 'Người ghi nhận', 'Bản thông báo', 'Ghi chú', 'Trạng thái hiện tại'];
export function logCsv(customers, { cell, fmt } = {}) {
if (typeof cell !== 'function') throw new Error('logCsv cần cell (csvCellSafe) để chống công thức Excel');
const _o3 = typeof fmt === 'function' ? fmt : ms => dmy(ms);
const _o6 = [CSV_HEAD];
for (const c of customers || []) {
if (!c) continue;
const now = statusText(c).text;
const _o5 = readLog(c);
if (!_o5.length) { _o6.push([c.name, c.phone, '', '', '', '', '', '', stateOf(c).source === 'legacy' ? 'Chưa có nhật ký (chỉ có cờ đồng ý cũ)' : 'Chưa có nhật ký', now]); continue; }
for (const e of _o5) _o6.push([c.name, c.phone, _o3(e.at), e.act === 'grant' ? 'Đồng ý' : 'Rút lại', e.scopes.map(scopeLabel).join('; '), channelLabel(e.channel), e.by_name || e.by, e.notice_version, e.note, now]);
}
return '﻿' + _o6.map(r => r.map(cell).join(',')).join('\r\n');
}

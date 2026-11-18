import { parseData } from '../_lib/crm.js';
import { isDeal, isCustomer } from './roi.js';
export const METHODS = { zalo: 'Tin nhắn Zalo (đã chụp màn hình)', paper: 'Giấy đồng ý có chữ ký', email: 'Email', recorded: 'Ghi âm/ghi hình có đồng ý' };
export const DISPLAY = { full: 'Họ tên đầy đủ', initials: 'Viết tắt (Chị H.)', anonymous: 'Ẩn danh (Một khách hàng)' };
export function storyView(o) {
const _o1 = parseData(o && o.data);
const _o0 = _o1.consent && typeof _o1.consent === 'object' ? _o1.consent : {};
return { id: o.id, name: o.name || '', project: o.project || '', status: o.status === 'published' ? 'published' : 'draft', customer_id: _o1.customer_id || '',
title: _o1.title || '', story: _o1.story || '', quote: _o1.quote || '', year: _o1.year || '', photo: _o1.photo || '',
consent: { given: _o0.given === true, at: Number(_o0.at) || 0, method: METHODS[_o0.method] ? _o0.method : '', evidence: _o0.evidence || '', display: DISPLAY[_o0.display] ? _o0.display : 'initials', withdrawn_at: Number(_o0.withdrawn_at) || 0 },
raw: o };
}
export function canPublish(s) {
const _o0 = s.consent;
if (!_o0.given) return { ok: false, why: 'Chưa có đồng ý của khách.' };
if (_o0.withdrawn_at) return { ok: false, why: 'Khách đã rút đồng ý – không được đăng.' };
if (!_o0.method) return { ok: false, why: 'Chưa ghi cách khách đồng ý (Zalo, giấy, email…).' };
if (!_o0.at) return { ok: false, why: 'Chưa ghi ngày khách đồng ý.' };
if (!String(s.story || s.quote).trim()) return { ok: false, why: 'Chưa có nội dung câu chuyện.' };
if (s.photo && _o0.display === 'anonymous') return { ok: false, why: 'Ẩn danh thì không dùng ảnh khách.' };
return { ok: true, why: '' };
}
export function consentLine(_o0, fmtDate) {
if (!_o0 || !_o0.given) return 'chưa có đồng ý';
if (_o0.withdrawn_at) return 'đã rút đồng ý';
const _o5 = _o0.at ? fmtDate(_o0.at) : '', how = _o0.method && METHODS[_o0.method] ? METHODS[_o0.method] : '';
if (_o5 && how) return 'đã đồng ý ' + _o5 + ' qua ' + how;
if (_o5) return 'đã đồng ý ' + _o5 + ' – chưa ghi cách đồng ý';
return 'đã đồng ý – chưa ghi ngày' + (how ? ', qua ' + how : ', chưa ghi cách đồng ý');
}
export function displayName(name, mode) {
const _o4 = String(name || '').trim().split(/\s+/).filter(Boolean);
if (mode === 'full' && _o4.length) return _o4.join(' ');
if (mode === 'anonymous' || !_o4.length) return 'Một khách hàng';
return 'Anh/chị ' + _o4[_o4.length - 1].charAt(0).toUpperCase() + '.';
}
export function publicStories(stories) {
return stories.filter(s => s.status === 'published' && canPublish(s).ok)
.map(s => ({ title: s.title, story: s.story, quote: s.quote || s.story, project: s.project_name || s.project, year: s.year, photo: s.consent.display === 'anonymous' ? '' : s.photo, display_name: displayName(s.name, s.consent.display) }));
}
export function profileView(o) {
const _o1 = parseData(o && o.data);
return { id: o ? o.id : '', name: _o1.name || '', title: _o1.title || '', intro: _o1.intro || '', photo: _o1.photo || '', years: Number(_o1.years) || 0,
areas: Array.isArray(_o1.areas) ? _o1.areas : String(_o1.areas || '').split(',').map(s => s.trim()).filter(Boolean), license: _o1.license || '', show_deals: _o1.show_deals !== false };
}
export function stats(profile, customers, projectName = x => x) {
const _o2 = (customers || []).filter(_o0 => isCustomer(_o0) && isDeal(_o0));
const projects = new Set(_o2.map(_o0 => _o0.project).filter(Boolean));
const _o3 = [];
if (profile.years) _o3.push({ value: profile.years + ' năm', label: 'kinh nghiệm môi giới' });
if (profile.show_deals && _o2.length) _o3.push({ value: String(_o2.length), label: 'giao dịch đã hỗ trợ khách (ghi nhận trong app)' });
if (projects.size) _o3.push({ value: String(projects.size), label: 'dự án đã giao dịch: ' + [...projects].slice(0, 6).map(projectName).join(', ') });
if (profile.license) _o3.push({ value: 'CCHN', label: 'chứng chỉ hành nghề môi giới số ' + profile.license });
return _o3;
}
export function consentRequest(s, { agent = '' } = {}) {
const _o6 = s.name ? 'anh/chị ' + s.name.split(/\s+/).slice(-1)[0] : 'anh/chị';
return `Dạ em chào ${_o6}, em là ${agent || 'môi giới'}. Em xin phép chia sẻ câu chuyện giao dịch của ${_o6}${s.project ? ' tại ' + s.project : ''} trên hồ sơ năng lực của em, ` +
`hiển thị tên dạng "${displayName(s.name, s.consent.display)}", không kèm số điện thoại hay giá căn. ${_o6.charAt(0).toUpperCase() + _o6.slice(1)} trả lời "Đồng ý" nếu cho phép; ` +
`${_o6} có thể yêu cầu gỡ bất cứ lúc nào. Em cảm ơn ạ!`;
}

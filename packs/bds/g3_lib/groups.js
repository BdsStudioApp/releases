import { parseData, strip } from '../_lib/crm.js';
import { groupLink, codePart } from './attribution.js';
export const PLATFORMS = { facebook: 'Nhóm Facebook', zalo: 'Nhóm/cộng đồng Zalo', telegram: 'Nhóm Telegram', other: 'Khác' };
export const safeUrl = (u) => { const s = String(u ?? '').trim(); return /^https?:\/\/[^\s"'<>\\]+$/i.test(s) && s.length <= 2000 ? s : ''; };
export const DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const DAY = 86400000, VN = 7 * 3600e3;
export function groupView(o) {
const _o2 = parseData(o && o.data);
return { id: o.id, name: o.name || '', active: o.status !== 'paused', url: safeUrl(_o2.url), platform: PLATFORMS[_o2.platform] ? _o2.platform : 'facebook', code: _o2.code || '',
rules: _o2.rules || '', allow_links: _o2.allow_links !== false, max_per_week: Number(_o2.max_per_week) || 0, days: Array.isArray(_o2.days) ? _o2.days.map(Number) : [],
members: Number(_o2.members) || 0, note: _o2.note || '', raw: o };
}
export function postView(o) {
const _o2 = parseData(o && o.data);
return { id: o.id, title: o.name || '', status: ['planned', 'posted', 'skipped'].includes(o.status) ? o.status : 'planned', group_id: _o2.group_id || '', at: Number(_o2.at) || 0,
text: _o2.text || '', link: _o2.link || '', campaign: _o2.campaign || '', posted_at: Number(_o2.posted_at) || 0, post_url: safeUrl(_o2.post_url), raw: o };
}
export function groupCode(name, taken = []) {
const _o0 = ('G-' + (codePart(name) || 'NHOM')).slice(0, 10);
let _o1 = _o0, _o6 = 2;
while (taken.includes(_o1)) _o1 = _o0 + _o6++;
return _o1;
}
export function postLink(_o0, group, campaign) { return groupLink(_o0, { group: group.code, campaign }); }
function vnDay(ms) { return new Date(ms + VN).getUTCDay(); }
function weekStart(ms) { const _o2 = new Date(ms + VN); const _o4 = (_o2.getUTCDay() + 6) % 7; return Date.UTC(_o2.getUTCFullYear(), _o2.getUTCMonth(), _o2.getUTCDate()) - _o4 * DAY - VN; }
export function checkPost(group, post, posts) {
const _oc = []; let ok = true;
const at = post.at || Date.now();
if (!group.active) { _oc.push('Nhóm đang tạm dừng đăng.'); ok = false; }
if (group.days.length && !group.days.includes(vnDay(at))) { _oc.push(`Nội quy chỉ cho đăng ${group.days.map(_o2 => DAYS[_o2]).join(', ')}.`); ok = false; }
const _od = weekStart(at);
const _oa = posts.filter(p => p.id !== post.id && p.group_id === group.id && p.status !== 'skipped' && (p.posted_at || p.at) >= _od && (p.posted_at || p.at) < _od + 7 * DAY);
if (group.max_per_week && _oa.length >= group.max_per_week) { _oc.push(`Tuần này đã có ${_oa.length}/${group.max_per_week} bài trong nhóm.`); ok = false; }
const _o8 = posts.filter(p => p.id !== post.id && p.group_id === group.id && p.status !== 'skipped' && Math.abs((p.posted_at || p.at) - at) < DAY);
if (_o8.length) _oc.push('Đã có bài trong nhóm này trong vòng 24 giờ – nên giãn cách.');
if (!group.allow_links && /https?:\/\//i.test(post.text + ' ' + (post.link || ''))) _oc.push('Nhóm không cho đăng link: để link trong bình luận hoặc bỏ link.');
const _ob = posts.filter(p => p.id !== post.id && p.status !== 'skipped' && p.group_id !== group.id && Math.abs((p.posted_at || p.at) - at) < DAY && similar(p.text, post.text));
if (_ob.length) _oc.push(`Cùng nội dung đăng ${_ob.length + 1} nhóm trong 24 giờ – nền tảng dễ coi là spam, nên viết khác đi.`);
return { ok, warnings: _oc };
}
export function similar(a, b) {
const A = new Set(strip(a).split(/\s+/).filter(_oe => _oe.length > 2)), B = new Set(strip(b).split(/\s+/).filter(_oe => _oe.length > 2));
if (A.size < 5 || B.size < 5) return false;
let _o7 = 0; for (const _oe of A) if (B.has(_oe)) _o7++;
return _o7 / Math.min(A.size, B.size) > 0.8;
}
export function suggestSlots(groups, posts, { from = Date.now(), days = 7, hour = 20 } = {}) {
const _o9 = [];
for (const _o5 of groups.filter(_oe => _oe.active)) {
for (let _o6 = 0; _o6 < days; _o6++) {
const _o3 = Math.floor((from + VN) / DAY) * DAY - VN + _o6 * DAY;
const at = _o3 + hour * 3600e3;
if (at < from) continue;
const _o1 = checkPost(_o5, { id: '_new', group_id: _o5.id, at, text: '' }, posts.concat(_o9));
if (_o1.ok && !_o1.warnings.length) { _o9.push({ id: '_s' + _o5.id + _o6, group_id: _o5.id, at, status: 'planned', text: '' }); break; }
}
}
return _o9;
}
export function rulesReminder(group) {
const _o0 = ['Đọc lại nội quy nhóm trước khi đăng.', 'Viết nội dung hữu ích (thông tin, số liệu có nguồn), không đăng dồn dập.', 'Ghi "Ảnh minh hoạ" khi dùng ảnh phối cảnh; giá ghi "tham khảo".'];
if (!group.allow_links) _o0.push('Nhóm KHÔNG cho link trong bài.');
if (group.max_per_week) _o0.push(`Tối đa ${group.max_per_week} bài/tuần.`);
if (group.days.length) _o0.push(`Chỉ đăng ${group.days.map(_o2 => DAYS[_o2]).join(', ')}.`);
return _o0;
}

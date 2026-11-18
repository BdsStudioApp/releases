export const TZ = 'Asia/Ho_Chi_Minh';
const _o0 = 7 * 3600000;
export function vnHour(ms = Date.now()) {
try {
const _o6 = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hourCycle: 'h23' }).format(new Date(ms));
const _o3 = parseInt(_o6, 10);
if (_o3 >= 0 && _o3 < 24) return _o3;
} catch { }
return new Date(ms + _o0).getUTCHours();
}
export function greetWord(hour) {
if (hour >= 4 && hour < 11) return 'Chào buổi sáng';
if (hour >= 11 && hour < 14) return 'Chào buổi trưa';
if (hour >= 14 && hour < 18) return 'Chào buổi chiều';
return 'Chào buổi tối';
}
export function givenName(full) {
const _o5 = String(full || '').replace(/[(（][^)）]*[)）]/g, ' ').trim().split(/\s+/).filter(Boolean);
return _o5.length ? _o5[_o5.length - 1] : '';
}
export function greeting(name, ms = Date.now()) {
const g = givenName(name);
return greetWord(vnHour(ms)) + (g ? ', ' + g : '');
}
const _o1 = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
export function vnDay(ms = Date.now()) {
const _o2 = new Date(ms + _o0);
const _o4 = (_o3) => String(_o3).padStart(2, '0');
return { weekday: _o1[_o2.getUTCDay()], date: _o4(_o2.getUTCDate()) + '/' + _o4(_o2.getUTCMonth() + 1) + '/' + _o2.getUTCFullYear() };
}
export function vnDayText(ms = Date.now()) { const _o2 = vnDay(ms); return _o2.weekday + ', ' + _o2.date; }

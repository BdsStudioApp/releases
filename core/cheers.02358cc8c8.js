const _o0 = 10 * 60 * 1000;
function ensureCss() {
if (typeof document === 'undefined' || document.getElementById('bds-cheer-css')) return;
const _o9 = document.createElement('link'); _o9.id = 'bds-cheer-css'; _o9.rel = 'stylesheet'; _o9.href = new URL('./cheers.fc553c5a11.css', import.meta.url).href; document.head.appendChild(_o9);
}
export function reducedMotion() { try { return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); } catch { return false; } }
export function confetti(parent) {
if (reducedMotion() || typeof document === 'undefined') return null;
const _o5 = document.createElement('canvas'); _o5.className = 'cheer-cv'; _o5.setAttribute('aria-hidden', 'true');
const W = _o5.width = window.innerWidth, H = _o5.height = window.innerHeight, g = _o5.getContext && _o5.getContext('2d');
if (!g) return null;
parent.appendChild(_o5);
const _o4 = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#a855f7'];
const _o2 = Array.from({ length: 70 }, () => ({ x: Math.random() * W, y: -20 - Math.random() * H * 0.4, vx: (Math.random() - 0.5) * 2, vy: 2 + Math.random() * 3, s: 4 + Math.random() * 5, c: _o4[Math.floor(Math.random() * _o4.length)], r: Math.random() * 6 }));
const _oi = performance.now();
const _oh = (t) => {
if (!_o5.isConnected) return;
g.clearRect(0, 0, W, H);
for (const _o1 of _o2) { _o1.x += _o1.vx; _o1.y += _o1.vy; _o1.r += 0.1; g.fillStyle = _o1.c; g.save(); g.translate(_o1.x, _o1.y); g.rotate(_o1.r); g.fillRect(-_o1.s / 2, -_o1.s / 4, _o1.s, _o1.s / 2); g.restore(); }
if (t - _oi < 1800) requestAnimationFrame(_oh); else _o5.remove();
};
requestAnimationFrame(_oh);
return _o5;
}
export function installCheers({ S, appHooks, ui }) {
const { h, button, toast } = ui;
ensureCss();
const _ob = () => !!(S.status && S.status.edition === 'cong-ty' && S.api && S.user);
const call = (a, p) => S.api.call(a, p || {});
let _oj = 0, showing = false, stopped = false;
const _og = new Set();
function banner(list) {
if (showing || !list.length) return;
showing = true;
const c = list[0];
_og.add(c.id);
const count = h('span', { 'data-testid': 'cheer-count' }, c.reacts ? ' ' + c.reacts : '');
const _od = h('div', { class: 'cheer-ov', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Chúc mừng chốt đơn', 'data-testid': 'cheer-banner' });
const close = () => { _od.remove(); showing = false; call('cheer.seen', { ids: [c.id] }).catch(() => {}); if (list.length > 1) setTimeout(() => banner(list.slice(1)), 400); };
_od.appendChild(h('div', { class: 'cheer-card' },
h('div', { style: { fontSize: '44px' }, 'aria-hidden': 'true' }, '🎉'),
h('h2', null, 'Chúc mừng chốt đơn!'),
h('p', { class: 'cheer-text', 'data-testid': 'cheer-text' }, c.text),
h('div', { class: 'cheer-acts' },
button('Khen', async () => { try { const r = await call('cheer.react', { id: c.id }); count.textContent = r.reacts ? ' ' + r.reacts : ''; toast('Đã gửi 👏 tới ' + (c.seller_name || 'đồng nghiệp'), 'success'); } catch { toast('Chưa gửi được 👏', 'warn'); } }, { kind: 'primary', icon: '👏', testid: 'cheer-react' }),
count,
button('Đóng', close, { icon: 'close', testid: 'cheer-close' }))));
_od.addEventListener('click', (e) => { if (e.target === _od) close(); });
document.body.appendChild(_od);
confetti(_od);
}
async function check() {
if (stopped || !_ob() || (typeof document !== 'undefined' && document.hidden)) return;
try {
const _o6 = await call('cheer.feed');
const list = ((_o6 && _o6.show) || []).filter((c) => !_og.has(c.id));
if (list.length) banner(list);
} catch { }
}
async function _of(body) {
const _o3 = h('div', { 'data-testid': 'cheer-panel' }, ui.spinner());
body.appendChild(_o3);
let _o6;
try { _o6 = await call('cheer.feed'); } catch { _o3.replaceChildren(h('p', { class: 'muted' }, 'Chưa tải được – thử lại sau.')); return; }
const _o8 = (c, canReact) => {
const n = h('span', { 'data-testid': 'cheer-n-' + c.id }, '👏 ' + (c.reacts || 0));
return h('li', null, h('div', null, c.text), h('small', { class: 'muted' }, ui.date(c.at, true)), ' ', n, ' ',
canReact ? button(c.reacted ? 'Đã khen' : 'Khen', async () => { const r = await call('cheer.react', { id: c.id }); n.textContent = '👏 ' + (r.reacts || 0); }, { small: true, icon: '👏', testid: 'cheer-react-' + c.id }) : null);
};
_o3.replaceChildren(
(_o6.mine || []).length ? h('div', { 'data-testid': 'cheer-mine' }, h('h4', null, 'Anh/chị vừa được chúc mừng'), h('ul', { class: 'cheer-list' }, _o6.mine.map((c) => _o8(c, false)))) : null,
h('h4', null, 'Thông báo chốt đơn trong công ty'),
(_o6.list || []).filter((c) => !c.mine).length ? h('ul', { class: 'cheer-list', 'data-testid': 'cheer-list' }, _o6.list.filter((c) => !c.mine).map((c) => _o8(c, true))) : h('p', { class: 'muted' }, 'Chưa có lời chúc mừng nào.'),
S.user && S.user.role === 'owner' ? h('p', { class: 'muted small' }, 'Bật/tắt, chọn ai nhận, hiện dự án/giá trị, xác nhận trước: Khách hàng › Kho lead › Cài đặt.') : null);
}
const _oe = appHooks.lateSections;
appHooks.lateSections = (ctx) => [...(typeof _oe === 'function' ? _oe(ctx) : []), ...(_ob() ? [['cheers', 'sparkle', '🎉 Chúc mừng chốt đơn', (body) => _of(body)]] : [])];
const _oc = () => { if (!document.hidden) check(); };
document.addEventListener('visibilitychange', _oc);
setTimeout(check, 1200);
_oj = setInterval(check, _o0);
const _oa = S.store && typeof S.store.onPull === 'function' ? S.store.onPull((x) => onPulled(x && x.cheers)) : () => {};
function onPulled(list) {
if (stopped || !_ob() || !Array.isArray(list)) return;
const _o7 = list.filter((c) => c && c.id && !_og.has(c.id));
if (_o7.length) banner(_o7);
}
return { check, onPulled, stop() { stopped = true; clearInterval(_oj); _oa(); document.removeEventListener('visibilitychange', _oc); } };
}
export default { installCheers, confetti, reducedMotion };

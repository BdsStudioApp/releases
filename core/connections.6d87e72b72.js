import { t } from './i18n.c64f4bc3eb.js';
import { saveScriptUrl, scriptUrl, NOT_PUBLIC_MSG } from './api.8a9774059d.js';
import { ITEMS, PROFILE_EMAIL_HASH, LINKS, MAP_PROVIDERS, itemVisibleFor, lightFor, pillFor, routeItem, requiredSummary, usd, intVi, budgetRows, budgetTone, claudeCostText, loadLocal, saveLocal, serverOldText, canDisconnect, needsFix, forgetLocal } from './connections_logic.cff3dbca52.js';
import { cmpVersion } from './updates.7f3d23ce57.js';
import { needServerUpdate, isMissingActionError } from './health_logic.7f3d23ce57.js';
import { GEMINI_PRIVACY, GEMINI_PRIVACY_SHORT } from './connections_logic.cff3dbca52.js';
const openDiagnosis = (o) => import('./offline_ui.7f7c8e35dd.js').then((_o10) => _o10.openDiagnosis(o));
const _o1 = 'bds-conn-css';
function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o1)) return;
const _ow = document.createElement('link');
_ow.id = _o1; _ow.rel = 'stylesheet';
_ow.href = new URL('./connections.d220090bcc.css', import.meta.url).href;
document.head.appendChild(_ow);
}
const _o2 = {
gemini_key: 'Khoá Gemini API', claude_key: 'Khoá Claude API', telegram_token: 'Mã bot Telegram (token)',
telegram_chat_id: 'Chat id (để trống – bấm Tự tìm)'
};
const _o3 = 'http://www.w3.org/2000/svg';
const _o0 = {
server: 'M5 5.5C5 4.1 8.1 3 12 3s7 1.1 7 2.5S15.9 8 12 8 5 6.9 5 5.5Zm0 0v13C5 19.9 8.1 21 12 21s7-1.1 7-2.5v-13M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5',
sparkle: 'M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.5l-1.9-5.7L4.5 10.9 10.1 9zM18.5 3v3m-1.5-1.5h3',
send: 'M21 3 3 10.5l7 2.5m11-10-7.5 18-3.5-8m11-10L10 13',
spark4: 'M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4',
chip: 'M7 7h10v10H7zM10 10h4v4h-4zM9 3v4m6-4v4M9 17v4m6-4v4M3 9h4m-4 6h4m10-6h4m-4 6h4',
film: 'M4 5h16v14H4zM4 9h16M4 15h16M8 5v4m0 6v4m8-14v4m0 6v4',
mic: 'M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Zm-6 8a6 6 0 0 0 12 0m-6 6v4m-3 0h6',
camera: 'M4 7h11v10H4zM15 10.5 20 7.5v9l-5-3',
chev: 'm7 10 5 5 5-5',
eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
eyeOff: 'M3 3l18 18M10.6 6.1A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.6 7.5A16.5 16.5 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4.2-1M9.9 9.9a3 3 0 0 0 4.2 4.2',
ext: 'M14 4h6v6m0-6-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
unlink: 'M10 14 7.5 16.5a3 3 0 0 1-4.2-4.2L5.8 9.8M14 10l2.5-2.5a3 3 0 0 0-4.2-4.2L9.8 5.8M4 4l16 16',
book: 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zm0 15A2.5 2.5 0 0 0 6.5 23H20v-5M8 7.5h8M8 11h6',
copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
map: 'M9 4 3 6.5V20l6-2.5 6 2.5 6-2.5V4l-6 2.5zm0 0v13.5m6-11V20'
};
function _o9(name, size = 20) {
const _o1x = document.createElementNS(_o3, 'svg');
for (const [k, v] of Object.entries({ viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.7', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', class: 'ico' })) _o1x.setAttribute(k, v);
const _o18 = document.createElementNS(_o3, 'path'); _o18.setAttribute('d', _o0[name] || _o0.sparkle); _o1x.appendChild(_o18);
return _o1x;
}
function _o1v(h, step, copy) {
const _o19 = Array.isArray(step) ? step : [step];
return h('li', null, _o19.map((_o18) => {
if (typeof _o18 === 'string') return _o18;
if (_o18.b) return h('strong', null, _o18.b);
if (_o18.a) return h('a', { href: _o18.a, target: '_blank', rel: 'noopener noreferrer', class: 'conn-link' }, _o18.t || _o18.a);
if (_o18.code) return h('button', { type: 'button', class: 'conn-code', title: 'Bấm để chép', onclick: () => copy(_o18.code) }, _o9('copy', 14), h('span', null, _o18.code));
return '';
}));
}
const _o1t = (el, on) => { if (el) { el.hidden = !on; el.style.display = on ? '' : 'none'; } };
const _o1f = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
async function _oh(base, path, opts = {}, ms = 2500) {
const _ob = new AbortController(); const _o20 = setTimeout(() => _ob.abort(), ms);
try {
const _o1e = await fetch(base.replace(/\/$/, '') + path, { ...opts, signal: _ob.signal });
let _ot = null; try { _ot = await _o1e.json(); } catch { _ot = null; }
if (!_o1e.ok || (_ot && _ot.ok === false)) throw new Error((_ot && _ot.error && _ot.error.message) || ('Máy dựng trả lỗi ' + _o1e.status));
return _ot || {};
} finally { clearTimeout(_o20); }
}
export function renderConnections(body, ctx, app = {}) {
ensureCss();
const { ui, api, ai } = ctx;
const { h, button, badge, toast, modal, copy } = ui;
const config = app.config || ctx.config || {};
const _og = config.ENGINE_URL || 'http://127.0.0.1:8765';
const st = { mode: api.mode, serverOk: null, serverMsg: '', version: '', serverOld: null, secrets: {}, last: {}, local: loadLocal(), prices: null, loaded: false, solo: !!ctx.solo };
const user = ctx.user || null;
const owner = !user || user.role === 'owner' || !!user.legacy;
const _o1z = () => { const _o2c = typeof app.whatsNew === 'function' ? app.whatsNew() : null; return (_o2c && _o2c.latest && _o2c.latest.gas) || ''; };
const _o15 = (v) => (v && _o1z() && cmpVersion(v, _o1z()) < 0 ? { server: v, target: _o1z() } : null);
const summary = h('div', { class: 'conn-summary', 'data-testid': 'conn-summary', 'aria-live': 'polite' });
const _oy = h('div', { class: 'conn-list', 'data-testid': 'conn-list' });
const _o2b = ctx.video || null;
const _o29 = !!(_o2b && _o2b.hidden());
const _o2a = _o2b && typeof _o2b.mode === 'function' ? _o2b.mode() : (_o29 ? 'off' : 'machine');
const engineOff = _o2b && typeof _o2b.engineOff === 'function' ? _o2b.engineOff() : _o29;
const _os = ITEMS.filter((it) => !(_o2b && _o2b.connHidden(it.id)) && itemVisibleFor(it, { edition: config.edition }));
const _o1i = new Map();
let _o25 = null;
let _o17 = '';
body.append(summary, _oy);
if (owner) body.append(h('p', { class: 'conn-foot', 'data-testid': 'conn-email-moved' }, 'Email nhận mã đặt lại mật khẩu nay nằm ở ',
h('a', { href: PROFILE_EMAIL_HASH, 'data-testid': 'conn-email-moved-link' }, 'Cài đặt › Thông tin cá nhân'), '.'));
if (_o29 && !(_o2b && typeof _o2b.offered === 'function' && !_o2b.offered())) body.append(h('p', { class: 'conn-foot', 'data-testid': 'conn-video-off' }, 'Làm video? ',
h('a', { class: 'btn btn-ghost btn-sm', href: '#/settings/packs', 'data-testid': 'conn-video-off-link' }, ui.icon('content', 18), h('span', null, 'Bật trong Gói chức năng'))));
if (_o2a !== 'off' && owner) {
const _o26 = !(ctx.packs && typeof ctx.packs.moduleOn === 'function') || ctx.packs.moduleOn('videoai_taocanh') !== false;
body.append(h('p', { class: 'conn-foot', 'data-testid': 'conn-videoai-keys' }, 'Khoá Video AI (Runway – có Veo, Kling – thu phí theo nhà cung cấp): ',
_o26 ? h('a', { class: 'btn btn-ghost btn-sm', href: '#/content/videoai_taocanh', 'data-testid': 'conn-videoai-keys-link' }, ui.icon('key', 18), h('span', null, 'Mở Video AI › Cài đặt'))
: h('a', { class: 'btn btn-ghost btn-sm', href: '#/settings/packs', 'data-testid': 'conn-videoai-keys-link' }, ui.icon('puzzle', 18), h('span', null, 'Bật trong Gói chức năng'))));
}
if (_o2a === 'online') body.append(h('p', { class: 'conn-foot', 'data-testid': 'conn-video-online' }, 'Đang chỉ dùng AI trên mạng – không cài gì trên máy. Video bản đồ cần máy dựng: ',
h('a', { class: 'btn btn-ghost btn-sm', href: '#/settings/packs', 'data-testid': 'conn-video-online-link' }, ui.icon('monitor', 18), h('span', null, 'Đổi cách làm video'))));
for (const it of _os) {
const _o1e = _o11(it);
_o1i.set(it.id, _o1e);
_oy.appendChild(_o1e.el);
}
paint();
refresh();
const _o2d = routeItem(ctx.route);
if (_o2d && _o1i.has(_o2d)) {
_o1s(_o2d, { instant: true });
let _o23 = false;
const mark = () => { _o23 = true; };
const _ok = ['pointerdown', 'keydown', 'focusin'];
for (const _oj of _ok) body.addEventListener(_oj, mark, true);
setTimeout(() => {
for (const _oj of _ok) body.removeEventListener(_oj, mark, true);
const _o1e = _o1i.get(_o2d); if (!_o1e || !_o1e.el.isConnected || _o23) return;
_o1o(_o1e, 'start');
try { _o1e.panel.focus({ preventScroll: true }); } catch { }
}, 420);
}
const _o16 = () => { if (body.isConnected) { st.local = loadLocal(); refresh(); } else window.removeEventListener('bds:connections-healed', _o16); };
window.addEventListener('bds:connections-healed', _o16);
const _o1w = _o2b && _o2b.on ? _o2b.on(() => {
if (!body.isConnected) return _o1w();
if ((typeof _o2b.mode === 'function' ? _o2b.mode() : (_o2b.hidden() ? 'off' : 'machine')) !== _o2a) { _o1w(); ui.clear(body); renderConnections(body, ctx, app); }
}) : null;
return { refresh, state: st, open: (id) => _o1s(id, { focus: true }) };
async function refresh() {
try {
const _oc = await api.call('connections.status');
st.secrets = (_oc && _oc.secrets) || {}; st.last = (_oc && _oc.last) || {}; st.prices = (_oc && _oc.prices) || null;
st.serverOk = true; st.version = (_oc && _oc.version) || ''; st.serverMsg = '';
if (api.mode !== 'demo') st.serverOld = (st.serverOld && st.serverOld.legacy) ? st.serverOld : _o15(st.version);
} catch (e) {
st.serverOk = false; st.serverMsg = (e && e.userMessage) || t('err.network');
}
st.loaded = true;
paint();
}
function _o1s(id, { focus = false, instant = false } = {}) {
_o17 = id && _o1i.has(id) ? id : '';
for (const [k, _o1e] of _o1i) {
const on = k === _o17;
_o1e.el.classList.toggle('is-open', on);
_o1e.el.classList.toggle('no-anim', !!instant);
_o1e.head.setAttribute('aria-expanded', on ? 'true' : 'false');
_o1e.panel.setAttribute('aria-hidden', on ? 'false' : 'true');
if (on) _o1e.panel.removeAttribute('inert'); else _o1e.panel.setAttribute('inert', '');
}
if (instant) requestAnimationFrame(() => requestAnimationFrame(() => { for (const _o1e of _o1i.values()) _o1e.el.classList.remove('no-anim'); }));
if (focus && _o17) {
const _o1e = _o1i.get(_o17);
try { _o1e.panel.focus({ preventScroll: true }); } catch { }
setTimeout(() => _o1o(_o1e, 'nearest'), _o1f() ? 0 : 260);
}
}
function _o1o(_o1e, block) {
const _o6 = document.querySelector('.topbar');
const _o22 = _o6 ? Math.max(0, Math.round(_o6.getBoundingClientRect().bottom)) : 0;
_o1e.el.style.scrollMarginTop = (_o22 + 12) + 'px';
_o1e.el.style.scrollMarginBottom = '96px';
try { _o1e.el.scrollIntoView({ block, behavior: _o1f() ? 'auto' : 'smooth' }); } catch { }
}
function toggle(id) { if (_o17 === id) { _o1s(''); try { _o1i.get(id).head.focus({ preventScroll: true }); } catch { } } else _o1s(id, { focus: true }); }
function paint() {
let done = 0;
for (const it of _os) {
const L = lightFor(it, st);
const P = pillFor(it, st);
if (P.kind === 'ok') done++;
const _o1e = _o1i.get(it.id);
_o1e.el.dataset.light = L.tone;
_o1e.el.dataset.status = P.kind;
_o1e.pill.className = 'conn-pill conn-pill-' + P.kind;
_o1e.pillText.textContent = P.text;
const last = it.target && st.last[it.target];
const _oz = it.local && st.local[it.local === 'vbee' ? 'engine' : it.local];
const at = (last && last.at) || (_oz && _oz.at);
_o1e.state.textContent = L.text + (at && (L.tone !== 'bad' || last) ? ' · ' + ui.date(at, true) : '');
_o1e.state.className = 'conn-state conn-state-' + L.tone;
_o1t(_o1e.state, !/^(Đã lưu – chưa kiểm tra|Chưa nhập|Chưa kiểm tra)/.test(L.text) || !!at);
if (it.id === 'claude' && _o1e.costText) _o1e.costText.textContent = 'Có phí theo lượt: ' + claudeCostText(st.prices) + '. Ước tính theo bảng giá công khai.';
for (const [k, s] of _o1e.secretUi) s.paint(!!st.secrets[k]);
if (_o1e.map) _o1e.map.paint(st.local.map || null);
const raw = [last && last.detail ? String(last.detail) : '', it.id === 'server' && st.version ? 'Phiên bản máy chủ: ' + st.version : '', it.id === 'server' && st.serverMsg ? st.serverMsg : ''].filter(Boolean).join('\n');
_o1e.raw.textContent = raw; _o1t(_o1e.raw, !!raw);
if (_o1e.fixBtn) {
_o1t(_o1e.fixBtn, needsFix(it, st) && st.loaded);
_o1e.fixBtn.querySelector('span:last-child').textContent = st.serverOld && owner ? 'Cập nhật máy chủ' : 'Cách sửa';
}
_o1t(_o1e.discBtn, canDisconnect(it, st, { owner }));
}
const _o1g = requiredSummary(_os, st), miss = _o1g.miss;
ui.mountTo(summary,
h('div', { class: 'conn-sum-main' },
h('strong', { class: 'conn-sum-num num' }, done + '/' + _os.length),
h('span', { class: 'conn-sum-label' }, 'đã kết nối')),
h('p', { class: ['conn-sum-text', miss.length ? 'is-bad' : 'is-ok'], 'data-testid': 'conn-sum-text' },
!st.loaded ? 'Đang đọc trạng thái…'
: miss.length ? 'Còn thiếu: ' + miss.map((x) => x.name).join(', ') + ' (bắt buộc ' + _o1g.done + '/' + _o1g.total + ')'
: 'Mục bắt buộc đã xong (' + _o1g.done + '/' + _o1g.total + ')' + (st.solo ? ' · các mục khác là tuỳ chọn' : '')),
h('div', { class: 'conn-sum-acts' },
button('Kiểm tra tất cả', testAll, { kind: 'ghost', icon: 'pulse', small: true, testid: 'conn-test-all' }),
button(t('net.diag'), () => { openDiagnosis({ ui, api, config }); }, { kind: 'ghost', icon: 'monitor', small: true, testid: 'conn-diag' })));
}
async function testAll() {
const _ou = _os.filter((it) => it.id === 'server' || (it.target && it.secrets.every((k) => st.secrets[k])) || it.local === 'ollama' || it.local === 'engine' || it.local === 'map')
.map((it) => _o1k(it, { quiet: true }).catch(() => null));
await Promise.all(_ou);
toast('Đã kiểm tra xong', 'ok');
}
function _o11(it) {
const _op = 'conn-head-' + it.id, pid = 'conn-panel-' + it.id;
const dot = h('span', { class: 'conn-pill-dot', 'aria-hidden': 'true', 'data-testid': 'conn-dot-' + it.id });
const pillText = h('span', null, '');
const pill = h('span', { class: 'conn-pill', 'data-testid': 'conn-pill-' + it.id }, dot, pillText);
const head = h('button', { type: 'button', class: 'conn-head', id: _op, 'aria-expanded': 'false', 'aria-controls': pid, 'data-testid': 'conn-toggle-' + it.id, onclick: () => toggle(it.id) },
h('span', { class: 'conn-ico' }, _o9(it.icon, 20)),
h('span', { class: 'conn-titles' },
h('span', { class: 'conn-name' }, it.name),
h('span', { class: 'conn-hint' }, it.hint)),
pill,
h('span', { class: 'conn-chev' }, _o9('chev', 18)));
const state = h('p', { class: 'conn-state' });
const _or = h('div', { class: 'conn-panel-body' });
const panel = h('div', { class: 'conn-panel', id: pid, role: 'region', 'aria-labelledby': _op, tabindex: '-1', inert: '', 'aria-hidden': 'true' }, h('div', { class: 'conn-panel-in' }, _or));
const el = h('article', { class: 'conn-row', dataset: { conn: it.id }, 'data-testid': 'conn-' + it.id }, h('h4', { class: 'conn-h' }, head), panel);
const raw = h('pre', { class: 'conn-raw', 'data-testid': 'conn-raw-' + it.id });
const _o1e = { el, head, panel, pill, pillText, dot, state, raw, costText: null, secretUi: new Map(), fixBtn: null, discBtn: null, primary: null };
_or.appendChild(state);
if (it.id === 'server') _or.appendChild(_o1r());
if (it.secrets) {
const _o7 = h('div', { class: 'conn-fields' });
for (const k of it.secrets) { const s = _o1p(k, it, _o1e); _o1e.secretUi.set(k, s); _o7.appendChild(s.el); }
_or.appendChild(_o7);
}
if (it.id === 'vbee') _or.appendChild(_o27(_o1e));
if (it.id === 'map') _or.appendChild(_o12(_o1e));
if (it.id === 'claude') _or.appendChild(h('p', { class: 'conn-note' }, 'Khác gói Claude Pro/Max – gói chat không có API. Không bắt buộc.'));
if (it.id === 'gemini') _or.appendChild(h('div', { class: 'conn-note conn-privacy', 'data-testid': 'conn-gemini-privacy' },
h('p', null, GEMINI_PRIVACY_SHORT),
h('details', { class: 'conn-privacy-full' }, h('summary', null, 'Đọc đủ'), h('p', null, GEMINI_PRIVACY))));
const _o4 = h('div', { class: 'btn-row conn-acts' });
if (!it.linkOnly) {
const _oo = it.id === 'server' || !!it.secrets || it.id === 'vbee' || it.id === 'map';
_o1e.primary = button(_oo ? 'Lưu và kiểm tra' : 'Kiểm tra', () => _o1l(it, _o1e), { kind: 'primary', icon: _oo ? 'check' : 'pulse', small: true, testid: 'conn-test-' + it.id });
_o4.appendChild(_o1e.primary);
} else _o4.appendChild(h('a', { class: 'btn btn-primary btn-sm', href: LINKS.flow, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'conn-open-flow' }, _o9('ext', 18), h('span', null, 'Mở Flow')));
if (it.findChat) _o4.appendChild(button('Tự tìm chat id', findChat, { kind: 'secondary', icon: 'sparkle', small: true, testid: 'conn-findchat' }));
if (it.id === 'server') { _o1e.fixBtn = button('Cách sửa', () => _om(it), { kind: 'secondary', icon: 'refresh', small: true, testid: 'conn-fix-' + it.id }); _o4.appendChild(_o1e.fixBtn); }
if (!it.linkOnly && it.local !== 'vbee') {
_o1e.discBtn = button('Ngắt kết nối', () => _oe(it), { kind: 'danger', small: true, cls: 'conn-disc', testid: 'conn-disconnect-' + it.id });
_o1e.discBtn.prepend(_o9('unlink', 18));
_o4.appendChild(_o1e.discBtn);
}
_or.appendChild(_o4);
_or.appendChild(h('div', { class: 'conn-how-mini' },
h('p', { class: 'conn-sub' }, it.linkOnly ? 'Cách dùng' : 'Cách lấy'),
h('ol', { class: 'conn-quick' }, (it.quick || []).map((s) => _o1v(h, s, copy))),
h('div', { class: 'conn-how-acts' },
it.link && !it.linkOnly ? h('a', { class: 'btn btn-secondary btn-sm conn-ext', href: it.link.href, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'conn-ext-' + it.id }, h('span', null, it.link.label), _o9('ext', 16)) : null,
h('button', { type: 'button', class: 'conn-more', 'data-testid': 'conn-how-' + it.id, onclick: () => _oq(it) }, _o9('book', 16), h('span', null, 'Hướng dẫn đầy đủ')))));
_o1e.costText = h('span', { class: 'conn-cost-text' }, it.cost.detail + '.');
_or.appendChild(h('p', { class: 'conn-cost' }, badge(it.cost.label, it.paid ? 'warn' : 'ok'), _o1e.costText));
_or.appendChild(h('details', { class: 'conn-tech', 'data-testid': 'conn-tech-' + it.id },
h('summary', null, 'Chi tiết'),
h('p', { class: 'conn-tech-use' }, 'Dùng cho: ' + it.use + '.'),
it.id === 'vbee' || it.id === 'map' ? h('p', null, 'Khoá lưu trong Keychain/Credential Manager của máy tính chạy máy dựng – không lên máy chủ, không lưu trong app.') : null,
it.id === 'server' && api.mode === 'demo' ? h('p', null, t('set.conn.demo')) : null,
raw));
return _o1e;
}
function _o1q(id, extra = {}) {
const input = h('input', { id, type: 'password', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', 'data-testid': id, ...extra });
const eye = h('button', { type: 'button', class: 'conn-eye', 'aria-label': 'Hiện', 'aria-pressed': 'false', 'aria-controls': id, 'data-testid': id + '-eye' }, _o9('eye', 18));
eye.addEventListener('click', () => {
const on = input.type === 'password';
input.type = on ? 'text' : 'password';
eye.setAttribute('aria-pressed', on ? 'true' : 'false'); eye.setAttribute('aria-label', on ? 'Ẩn' : 'Hiện');
eye.replaceChildren(_o9(on ? 'eyeOff' : 'eye', 18));
});
return { input, wrap: h('div', { class: 'conn-inwrap' }, input, eye) };
}
function _oi(input, _o1e) { input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && _o1e.primary) { e.preventDefault(); _o1e.primary.click(); } }); }
function _o1p(k, it, _o1e) {
const id = 'conn-in-' + k;
const { input, wrap } = _o1q(id, { inputmode: k === 'telegram_chat_id' ? 'numeric' : undefined });
_oi(input, _o1e);
const _o1y = h('span', { class: 'conn-saved' });
const el = h('div', { class: 'conn-field' }, h('label', { for: id, class: 'field-label' }, _o2[k] || k, _o1y), wrap);
return {
el, input,
paint(set) {
input.placeholder = set ? '•••••••• đã lưu – nhập để thay' : 'Chưa nhập';
_o1y.textContent = set ? '✓ đã lưu' : '';
}
};
}
function _o1r() {
const id = 'conn-in-url';
const input = h('input', { id, type: 'url', inputmode: 'url', autocomplete: 'off', spellcheck: 'false', placeholder: 'https://script.google.com/macros/s/…/exec', 'data-testid': id });
input.value = scriptUrl(config);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); const _o1e = _o1i.get('server'); if (_o1e && _o1e.primary) _o1e.primary.click(); } });
_o25 = input;
return h('div', { class: 'conn-field' }, h('label', { for: id, class: 'field-label' }, t('set.conn.url')), input);
}
function _o27(_o1e) {
const appIn = h('input', { id: 'conn-in-vbee-app', type: 'text', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', placeholder: 'App-Id', 'data-testid': 'conn-in-vbee-app' });
const _o21 = _o1q('conn-in-vbee-token', { placeholder: 'Token' });
_oi(appIn, _o1e); _oi(_o21.input, _o1e);
_o1e.vbee = { appIn, tokIn: _o21.input };
return h('div', { class: 'conn-fields' },
h('div', { class: 'conn-field' }, h('label', { for: 'conn-in-vbee-app', class: 'field-label' }, 'Vbee App-Id'), appIn),
h('div', { class: 'conn-field' }, h('label', { for: 'conn-in-vbee-token', class: 'field-label' }, 'Vbee Token'), _o21.wrap));
}
function _o12(_o1e) {
const sel = h('select', { id: 'conn-in-map-provider', 'data-testid': 'conn-in-map-provider' },
MAP_PROVIDERS.map((_o18) => h('option', { value: _o18.id }, _o18.name + (_o18.recommended ? ' (khuyên dùng)' : ''))));
const key = _o1q('conn-in-map-key', { placeholder: 'API key' });
_oi(key.input, _o1e);
const _o1y = h('span', { class: 'conn-saved' });
_o1e.map = {
sel, keyIn: key.input,
paint(_o10) {
const set = !!(_o10 && _o10.key);
key.input.placeholder = set ? '•••••••• đã lưu – nhập để thay' : 'Chưa nhập';
_o1y.textContent = set ? '✓ đã lưu' : '';
if (_o10 && _o10.provider && [...sel.options].some((o) => o.value === _o10.provider)) sel.value = _o10.provider;
}
};
return h('div', { class: 'conn-fields' },
h('div', { class: 'conn-field' }, h('label', { for: 'conn-in-map-provider', class: 'field-label' }, 'Nhà cung cấp bản đồ'), sel),
h('div', { class: 'conn-field' }, h('label', { for: 'conn-in-map-key', class: 'field-label' }, 'Khoá API bản đồ', _o1y), key.wrap));
}
function _o13(_ot, fallback = {}) {
const _o8 = (_ot && _ot.check) || (_ot && _ot.last_check) || null;
return { engine: true, key: !!(_ot && _ot.key_set), provider: (_ot && _ot.provider) || '', ok: _ot && _ot.key_set && _o8 ? !!_o8.ok : (_ot && _ot.key_set ? undefined : false), msg: (_o8 && _o8.message) || '', ...fallback };
}
async function _o1l(it, _o1e) {
if (it.id === 'server') {
const url = String((_o25 && _o25.value) || '').trim();
if (url && url !== scriptUrl(config)) return _o1m(url);
return _o1k(it);
}
if (it.secrets) {
let _o1n = 0;
for (const [k, s] of _o1e.secretUi) {
const v = String(s.input.value || '').trim();
if (!v) continue;
await api.call('settings.set', { key: k, value: v });
s.input.value = ''; st.secrets[k] = true; _o1n++;
}
if (_o1n && it.target) delete st.last[it.target];
if (_o1n) paint();
const _ol = it.secrets.find((k) => !st.secrets[k]);
if (_ol) {
const s = _o1e.secretUi.get(_ol);
toast(_ol === 'telegram_chat_id' ? 'Nhắn "chào" cho bot rồi bấm Tự tìm chat id.' : 'Dán ' + (_o2[_ol] || 'khoá').toLowerCase() + ' rồi bấm Lưu và kiểm tra.', 'info', 5000);
if (s) s.input.focus();
return false;
}
if (_o1n) toast('Đã lưu lên máy chủ – đang kiểm tra…', 'ok', 2000);
return _o1k(it);
}
if (it.id === 'map' && _o1e.map) return _o1k(it, { live: true, body: { provider: _o1e.map.sel.value, key: _o1e.map.keyIn.value.trim() } });
if (it.id === 'vbee' && _o1e.vbee) {
const b = {};
if (_o1e.vbee.appIn.value.trim()) b.VBEE_APP_ID = _o1e.vbee.appIn.value.trim();
if (_o1e.vbee.tokIn.value.trim()) b.VBEE_TOKEN = _o1e.vbee.tokIn.value.trim();
if (Object.keys(b).length) {
let _o1h;
try { _o1h = await _oh(_og, '/secrets', { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(b) }, 6000); } catch {
toast('Máy dựng chưa bật hoặc Chrome chặn "Truy cập mạng cục bộ"', 'warn', 5000); return false;
}
_o1e.vbee.appIn.value = ''; _o1e.vbee.tokIn.value = '';
toast(_o1h.stored === 'keychain' ? 'Đã lưu khoá Vbee vào Keychain của máy' : 'Đã lưu khoá Vbee (tệp riêng của máy)', 'ok');
}
}
return _o1k(it);
}
async function _o1m(url) {
if (!/^https:\/\/script\.google(usercontent)?\.com\/.+\/exec$/.test(url)) { toast('URL phải có dạng https://script.google.com/macros/s/…/exec', 'warn', 6000); return false; }
if (api.mode === 'demo') {
const ok = await import('./wizard/demodata.js').then((_o10) => _o10.confirmLeaveDemo({ ui, api })).catch(() => true);
if (!ok) return false;
}
const _o1b = await _o1c(url);
if (_o1b.notPublic) { toast(NOT_PUBLIC_MSG, 'warn', 8000); return false; }
saveScriptUrl(url); toast(t('set.conn.saved') + (_o1b.version ? ' – máy chủ phiên bản ' + _o1b.version : ''), 'ok');
setTimeout(() => location.reload(), 700);
return true;
}
async function _o1c(url) {
try {
const _o1h = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'status', payload: {} }) });
const _o24 = await _o1h.text();
if ((_o1h.redirected && /^https:\/\/accounts\.google\.com\//.test(String(_o1h.url || ''))) || /^\s*</.test(_o24)) return { notPublic: true };
const _ot = JSON.parse(_o24);
return { ok: !!_ot.ok, version: (_ot.data && _ot.data.version) || '' };
} catch { return {}; }
}
async function _o1k(it, { quiet, live = false, body = null } = {}) {
let ok = false, msg = '', detail = '';
if (it.id === 'server') {
try {
const _oc = await api.call('status');
ok = true;
st.serverOld = api.mode === 'demo' ? null : _o15(_oc && _oc.version);
if (api.mode !== 'demo' && owner) {
try {
const v = await api.call('server.version');
const n = needServerUpdate({ actions: v && Array.isArray(v.actions) ? v.actions : null });
if (!st.serverOld && n.missing.length) st.serverOld = { server: _oc && _oc.version, target: _o1z(), missing: n.missing };
} catch (e) { if (isMissingActionError(e)) st.serverOld = { server: _oc && _oc.version, target: _o1z(), legacy: !st.serverOld }; }
}
if (st.serverOld) { ok = false; msg = serverOldText(st.serverOld) + (owner ? ' – bấm "Cập nhật máy chủ", app tự làm.' : ' – chờ Quản trị (Admin) cập nhật.'); }
else msg = api.mode === 'demo' ? 'Máy chủ xem thử trả lời. Dán địa chỉ máy chủ thật để dùng thật.' : t('set.conn.ok', { v: (_oc && _oc.version) || '?' });
const _ov = st.serverOld;
await refresh();
if (_ov && _ov.legacy) st.serverOld = _ov;
} catch (e) { ok = false; msg = (e && e.userMessage) || t('err.network'); st.serverOk = false; st.serverMsg = msg; paint(); }
} else if (it.target) {
const _oc = await api.call('connections.test', { target: it.target });
st.last[it.target] = { ok: !!_oc.ok, at: _oc.at, message: _oc.message };
if (_oc.detail) st.last[it.target].detail = _oc.detail;
ok = !!_oc.ok; msg = _oc.message || ''; detail = _oc.detail || '';
} else if (it.local === 'ollama') {
const _o1e = await ai.checkOllama({ bridge: !engineOff });
st.local = saveLocal('ollama', { ok: !!_o1e.ok, n: (_o1e.models || []).length });
ok = !!_o1e.ok; msg = _o1e.ok ? t('set.ai.ollama_ok', { n: _o1e.models.length }) : t('set.ai.ollama_fail') + ' Mở Ollama rồi thử lại.';
} else if (it.local === 'map') {
try {
const _ot = live
? await _oh(_og, '/video/map_source/test', { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body || {}) }, 30000)
: await _oh(_og, '/video/map_source');
const _o1j = _o1i.get('map'); if (_o1j && _o1j.map) _o1j.map.keyIn.value = '';
st.local = saveLocal('map', _o13(_ot));
const _o10 = st.local.map;
ok = !!_o10.ok; msg = !_o10.key ? 'Chưa có khoá bản đồ – dán khoá rồi bấm Lưu và kiểm tra.' : _o10.msg || (_o10.ok ? 'Nền bản đồ và tìm địa chỉ chạy.' : 'Đã lưu khoá – bấm Lưu và kiểm tra để thử thật.');
} catch (e) {
const _o5 = /khoá|key|dạng/i.test(String((e && e.message) || ''));
if (!_o5) st.local = saveLocal('map', { ...(st.local.map || {}), engine: false, ok: (st.local.map || {}).ok });
ok = false; msg = _o5 ? e.message : 'Chưa gọi được máy dựng: bật "BDS Studio" trên máy tính; Chrome hỏi "Truy cập mạng cục bộ" thì bấm Cho phép.';
}
} else if (it.local === 'engine' || it.local === 'vbee') {
try {
const _ot = await _oh(_og, '/health');
const _on = _ot.app === 'bds-studio-engine' || _ot.ok === true;
st.local = saveLocal('engine', { ok: _on, vbee: !!_ot.vbee_configured });
ok = it.local === 'vbee' ? _on && !!_ot.vbee_configured : _on;
msg = !_on ? 'Cổng 8765 không phải máy dựng BDS Studio.' : it.local === 'vbee' ? (_ot.vbee_configured ? 'Máy dựng đã có khoá Vbee.' : 'Máy dựng chưa có khoá Vbee – dán App-Id và Token.') : 'Máy dựng đang chạy' + (_ot.version ? ' – phiên bản ' + _ot.version : '') + '.';
} catch {
st.local = saveLocal('engine', { ok: false, vbee: false });
ok = false; msg = 'Chưa gọi được máy dựng: bật "BDS Studio" trên máy tính; Chrome hỏi "Truy cập mạng cục bộ" thì bấm Cho phép.';
}
}
paint();
if (!quiet) toast(msg || (ok ? 'Đạt' : 'Chưa đạt'), ok ? 'ok' : 'warn', ok ? 3200 : 6000, { detail: ok ? '' : detail });
return ok;
}
async function _om(it) {
if (it.id === 'server' && st.serverOld && owner && app.selfHeal) {
const _o1e = await app.selfHeal.updateServer({ auto: false });
if (_o1e) { st.serverOld = null; await _o1k(it, { quiet: true }); }
return;
}
_oq(it);
}
async function _oe(it) {
const Q = {
server: 'Ngắt máy chủ trên máy này? App quên đường dẫn máy chủ, xoá dữ liệu tạm trên máy và về màn kết nối. Dữ liệu trên Google Sheet giữ nguyên.',
engine: 'Ngắt máy dựng? App quên vé máy dựng (máy dựng thôi tự chạy qua đêm) rồi dò lại.',
map: 'Xoá khoá bản đồ khỏi máy dựng? Video bản đồ sẽ tạm dừng tới khi dán khoá mới.',
ollama: 'Ngắt Ollama? App quên kết quả dò Ollama trên máy này rồi dò lại.'
};
const _o1d = Q[it.id] || ('Ngắt ' + it.name + '? Khoá đã lưu trên máy chủ sẽ bị xoá; muốn dùng lại thì dán khoá mới rồi bấm Lưu và kiểm tra.');
if (!(await ui.confirm(_o1d, { ok: 'Ngắt kết nối', kind: 'danger', title: 'Ngắt kết nối – ' + it.name }))) return;
if (it.id === 'server') {
if (typeof app.disconnectServer === 'function') await app.disconnectServer();
return;
}
if (it.target) {
let _oc = null;
try { _oc = await api.call('connections.disconnect', { target: it.target }); } catch (e) {
toast((e && e.userMessage) || t('err.network'), 'warn', 6000); return;
}
for (const k of it.secrets || []) st.secrets[k] = false;
if (_oc && _oc.status && _oc.status.secrets) { st.secrets = _oc.status.secrets; st.last = _oc.status.last || st.last; }
delete st.last[it.target];
paint();
toast('Đã ngắt ' + it.name + '. Dán khoá mới rồi bấm Lưu và kiểm tra để kết nối lại.', 'ok', 5000);
return;
}
if (it.local === 'map') {
try { await _oh(_og, '/video/map_source', { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ forget: true }) }, 4000); } catch {
toast('Máy dựng chưa bật – bật "BDS Studio" rồi ngắt lại', 'warn', 5000); return;
}
st.local = saveLocal('map', { engine: true, key: false, ok: false, msg: '' });
paint();
toast('Đã xoá khoá bản đồ khỏi máy dựng. Video bản đồ tạm dừng tới khi dán khoá mới.', 'ok', 5000);
return;
}
if (it.local === 'engine') {
try { await _oh(_og, '/staff/run', { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ forget: true }) }, 4000); } catch { }
st.local = forgetLocal('engine'); forgetLocal('vbee');
paint();
toast('Đã quên vé máy dựng. Đang dò lại…', 'ok');
await _o1k(it, { quiet: false });
return;
}
if (it.local === 'ollama') {
st.local = forgetLocal('ollama');
paint();
await _o1k(it, { quiet: false });
}
}
async function findChat() {
const _oc = await api.call('telegram.find_chat_id');
st.secrets.telegram_chat_id = true; delete st.last.telegram;
paint();
toast('Đã tìm thấy và lưu chat id' + (_oc && _oc.name ? ' của ' + _oc.name : '') + '. Bấm Lưu và kiểm tra để nhận tin thử.', 'ok', 5000);
}
function _oq(it) {
const body = h('div', { class: 'conn-how' },
h('p', { class: 'conn-how-use' }, h('strong', null, 'Dùng cho: '), it.use + '.'),
h('p', { class: 'conn-how-cost' }, h('strong', null, it.cost.label + ': '), it.id === 'claude' ? claudeCostText(st.prices) + '.' : it.cost.detail + '.'),
h('ol', { class: 'conn-steps' }, it.steps.map((s) => _o1v(h, s, copy))),
h('p', { class: 'muted small' }, 'Liên kết mở ở tab mới. Không gửi khoá qua chat/Zalo – chỉ dán vào ô trong app.'));
modal({ title: 'Cách lấy – ' + it.name, body, wide: true, cls: 'conn-modal', actions: [{ label: t('common.close'), kind: 'primary', id: 'conn-how-close' }] });
}
}
export async function renderBudgetPanel(body, ctx) {
ensureCss();
const { ui, api, ai, settings } = ctx;
const { h, field, button, toast } = ui;
const _ox = { cap_usd: 100, video_char_usd: 5, warn_pct: 80, ...(settings.get('budget_limits', {}) || {}) };
const capF = field({ label: t('set.budget.cap'), type: 'number', value: _ox.cap_usd, min: 0, step: 1, inputmode: 'decimal', id: 'budget-cap' });
const warnF = field({ label: t('set.budget.warn'), type: 'number', value: _ox.warn_pct, min: 10, max: 100, step: 5, inputmode: 'numeric', id: 'budget-warn' });
const _o28 = field({ label: 'Trần mỗi video nhân vật (USD)', type: 'number', value: _ox.video_char_usd, min: 0, step: 0.5, inputmode: 'decimal', id: 'budget-video' });
const _o14 = h('div', { class: 'bud-meter', 'data-testid': 'budget-meter' }, ui.spinner());
const table = h('div', { class: 'bud-table', 'data-testid': 'budget-table' });
const note = h('p', { class: 'bud-note' },
'Số ước tính theo bảng giá công khai – hoá đơn thật xem ở trang nhà cung cấp: ',
h('a', { href: LINKS.aistudio, target: '_blank', rel: 'noopener noreferrer' }, 'Google AI Studio'), ' (gói trả phí: ',
h('a', { href: LINKS.gcpBilling, target: '_blank', rel: 'noopener noreferrer' }, 'Google Cloud Billing'), ') · ',
h('a', { href: LINKS.anthropicBilling, target: '_blank', rel: 'noopener noreferrer' }, 'Anthropic Console'), '.');
body.append(_o14, table, note,
h('div', { class: 'grid-3' }, capF, warnF, ctx.video && ctx.video.hidden() ? null : _o28),
h('div', { class: 'btn-row' }, button(t('common.save'), async () => {
const v = { cap_usd: Math.max(0, Number(capF.getValue()) || 0), video_char_usd: Math.max(0, Number(_o28.getValue()) || 0), warn_pct: Math.min(100, Math.max(10, Number(warnF.getValue()) || 80)) };
await settings.set('budget_limits', { video_char_usd: v.video_char_usd, warn_pct: v.warn_pct });
try { await api.call('settings.set', { key: 'budget', value: { cap_usd: v.cap_usd } }); } catch (e) { toast(e.userMessage || t('err.network'), 'warn'); }
toast(t('common.saved'), 'ok'); _of();
}, { kind: 'primary', icon: 'check', id: 'budget-save' })));
async function _of() {
try {
const _oc = await api.call('budget.get');
const _oa = Number(_oc.cap_usd) || 0;
const _o1u = Number(_oc.spent_usd) || 0;
const _o1a = _oa ? Math.min(100, _o1u / _oa * 100) : (_o1u > 0 ? 100 : 0);
const _o2e = Number((settings.get('budget_limits', {}) || {}).warn_pct) || 80;
const tone = budgetTone(_o1a, _o2e);
ai.overBudget = _oa > 0 && _o1u >= _oa;
const [y, _o10] = String(_oc.month || '').split('-');
ui.mountTo(_o14,
h('div', { class: 'bud-head' },
h('span', { class: 'bud-month' }, 'Tháng ' + (_o10 && y ? _o10 + '/' + y : _oc.month || '')),
h('strong', { class: 'bud-num num' }, usd(_o1u), h('span', { class: 'bud-cap' }, ' / ' + usd(_oa)))),
h('div', { class: 'bud-bar bud-' + tone }, ui.progress(_o1a, 'Đã dùng ' + Math.round(_o1a) + '% trần tháng')),
h('p', { class: 'bud-sub' }, 'Đã dùng ' + _o1a.toFixed(1).replace('.', ',') + '% trần · cảnh báo ở ' + _o2e + '%' +
(tone === 'bad' ? ' · đã chạm trần: chỉ còn Gemini miễn phí, Ollama và chuyển sang chat' : tone === 'warn' ? ' · sắp chạm trần' : '')));
const _o1i = budgetRows(_oc);
const _od = (v) => (v == null ? '—' : intVi(v));
ui.mountTo(table,
h('div', { class: 'bud-row bud-th', 'aria-hidden': 'true' }, h('span', null, 'AI'), h('span', null, 'Lần gọi'), h('span', null, 'Token vào'), h('span', null, 'Token ra'), h('span', null, 'Chi phí')),
_o1i.map((_o1e) => h('div', { class: 'bud-row', dataset: { provider: _o1e.id } },
h('span', { class: 'bud-name' }, _o1e.label),
h('span', { class: 'bud-c', dataset: { k: 'Lần gọi' } }, _od(_o1e.calls)),
h('span', { class: 'bud-c', dataset: { k: 'Token vào' } }, _od(_o1e.tokens_in)),
h('span', { class: 'bud-c', dataset: { k: 'Token ra' } }, _od(_o1e.tokens_out)),
h('strong', { class: 'bud-usd num' }, _o1e.usdText))));
} catch (e) { ui.mountTo(_o14, h('p', { class: 'muted' }, e.userMessage || t('err.network'))); }
}
await _of();
}
export default { renderConnections, renderBudgetPanel };

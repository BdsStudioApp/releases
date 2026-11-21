import { t } from './i18n.17f01a0b54.js';
import { saveScriptUrl, scriptUrl, NOT_PUBLIC_MSG } from './api.e356e031da.js';
import { ITEMS, PROFILE_EMAIL_HASH, LINKS, MAP_PROVIDERS, itemVisibleFor, lightFor, pillFor, routeItem, requiredSummary, usd, intVi, budgetRows, budgetTone, claudeCostText, loadLocal, saveLocal, serverOldText, canDisconnect, needsFix } from './connections_logic.5d678ff0de.js';
import { cmpVersion } from './updates.a1be44bf9a.js';
import { deviceKind } from '../shared/device.js';
import { needServerUpdate, isMissingActionError } from './health_logic.a1be44bf9a.js';
import { GEMINI_PRIVACY, GEMINI_PRIVACY_SHORT } from './connections_logic.5d678ff0de.js';
const openDiagnosis = (o) => import('./offline_ui.3e17e84ba2.js').then((_o11) => _o11.openDiagnosis(o));
const _o1 = 'bds-conn-css';
function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o1)) return;
const _ox = document.createElement('link');
_ox.id = _o1; _ox.rel = 'stylesheet';
_ox.href = new URL('./connections.2166e3a79b.css', import.meta.url).href;
document.head.appendChild(_ox);
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
const _o20 = document.createElementNS(_o3, 'svg');
for (const [k, v] of Object.entries({ viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.7', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', class: 'ico' })) _o20.setAttribute(k, v);
const _o1b = document.createElementNS(_o3, 'path'); _o1b.setAttribute('d', _o0[name] || _o0.sparkle); _o20.appendChild(_o1b);
return _o20;
}
function _o1y(h, step, copy) {
const _o1c = Array.isArray(step) ? step : [step];
return h('li', null, _o1c.map((_o1b) => {
if (typeof _o1b === 'string') return _o1b;
if (_o1b.b) return h('strong', null, _o1b.b);
if (_o1b.a) return h('a', { href: _o1b.a, target: '_blank', rel: 'noopener noreferrer', class: 'conn-link' }, _o1b.t || _o1b.a);
if (_o1b.code) return h('button', { type: 'button', class: 'conn-code', title: 'Bấm để chép', onclick: () => copy(_o1b.code) }, _o9('copy', 14), h('span', null, _o1b.code));
return '';
}));
}
const _o1w = (el, on) => { if (el) { el.hidden = !on; el.style.display = on ? '' : 'none'; } };
const _o1i = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
async function _oi(base, path, opts = {}, ms = 2500) {
const _ob = new AbortController(); const _o23 = setTimeout(() => _ob.abort(), ms);
try {
const _o1h = await fetch(base.replace(/\/$/, '') + path, { ...opts, signal: _ob.signal });
let _ou = null; try { _ou = await _o1h.json(); } catch { _ou = null; }
if (!_o1h.ok || (_ou && _ou.ok === false)) throw new Error((_ou && _ou.error && _ou.error.message) || ('Máy dựng trả lỗi ' + _o1h.status));
return _ou || {};
} finally { clearTimeout(_o23); }
}
export function renderConnections(body, ctx, app = {}) {
ensureCss();
const { ui, api, ai } = ctx;
const { h, button, badge, toast, modal, copy } = ui;
const config = app.config || ctx.config || {};
const _oh = config.ENGINE_URL || 'http://127.0.0.1:8765';
const st = { mode: api.mode, serverOk: null, serverMsg: '', version: '', serverOld: null, secrets: {}, last: {}, local: loadLocal(), prices: null, loaded: false, solo: !!ctx.solo };
const user = ctx.user || null;
const owner = !user || user.role === 'owner' || !!user.legacy;
const _o22 = () => { const _o2f = typeof app.whatsNew === 'function' ? app.whatsNew() : null; return (_o2f && _o2f.latest && _o2f.latest.gas) || ''; };
const _o18 = (v) => (v && _o22() && cmpVersion(v, _o22()) < 0 ? { server: v, target: _o22() } : null);
const summary = h('div', { class: 'conn-summary', 'data-testid': 'conn-summary', 'aria-live': 'polite' });
const _oz = h('div', { class: 'conn-list', 'data-testid': 'conn-list' });
const _o2e = ctx.video || null;
const _o2c = !!(_o2e && _o2e.hidden());
const _o2d = _o2e && typeof _o2e.mode === 'function' ? _o2e.mode() : (_o2c ? 'off' : 'machine');
const device = (ctx.device && ctx.device.kind) || deviceKind();
const _o16 = device === 'mobile';
const _or = !(ctx.packs && typeof ctx.packs.moduleOn === 'function') || ctx.packs.moduleOn('ideas') !== false;
const _ot = ITEMS.filter((it) => !(_o2e && _o2e.connHidden(it.id)) && itemVisibleFor(it, { edition: config.edition, device })
&& !(it.ext === 'videoai' && (_o2d === 'off' || !_or)));
const _o1l = new Map();
let _o28 = null;
let _o1a = '';
body.append(summary, _oz);
if (owner) body.append(h('p', { class: 'conn-foot', 'data-testid': 'conn-email-moved' }, 'Email nhận mã đặt lại mật khẩu nay nằm ở ',
h('a', { href: PROFILE_EMAIL_HASH, 'data-testid': 'conn-email-moved-link' }, 'Cài đặt › Thông tin cá nhân'), '.'));
if (!_o16 && _o2c && !(_o2e && typeof _o2e.offered === 'function' && !_o2e.offered())) body.append(h('p', { class: 'conn-foot', 'data-testid': 'conn-video-off' }, 'Làm video? ',
h('a', { class: 'btn btn-ghost btn-sm', href: '#/settings/packs', 'data-testid': 'conn-video-off-link' }, ui.icon('content', 18), h('span', null, 'Bật trong Gói chức năng'))));
if (!_o16 && _o2d !== 'off' && owner) {
const _o29 = !(ctx.packs && typeof ctx.packs.moduleOn === 'function') || ctx.packs.moduleOn('ideas') !== false;
body.append(h('p', { class: 'conn-foot', 'data-testid': 'conn-videoai-keys' }, 'Khoá Video AI (Runway – có Veo, Kling – thu phí theo nhà cung cấp): ',
_o29 ? h('a', { class: 'btn btn-ghost btn-sm', href: '#/content/ideas?tab=video', 'data-testid': 'conn-videoai-keys-link' }, ui.icon('key', 18), h('span', null, 'Mở Video AI › Cài đặt'))
: h('a', { class: 'btn btn-ghost btn-sm', href: '#/settings/packs', 'data-testid': 'conn-videoai-keys-link' }, ui.icon('puzzle', 18), h('span', null, 'Bật trong Gói chức năng'))));
}
if (!_o16 && _o2d === 'online') body.append(h('p', { class: 'conn-foot', 'data-testid': 'conn-video-online' }, 'Đang chỉ dùng AI trên mạng – không cài gì trên máy. Video bản đồ cần máy dựng: ',
h('a', { class: 'btn btn-ghost btn-sm', href: '#/settings/packs', 'data-testid': 'conn-video-online-link' }, ui.icon('monitor', 18), h('span', null, 'Đổi cách làm video'))));
for (const it of _ot) {
const _o1h = _o12(it);
_o1l.set(it.id, _o1h);
_oz.appendChild(_o1h.el);
}
paint();
refresh();
const _o2g = routeItem(ctx.route);
if (_o2g && _o1l.has(_o2g)) {
_o1v(_o2g, { instant: true });
let _o26 = false;
const mark = () => { _o26 = true; };
const _ol = ['pointerdown', 'keydown', 'focusin'];
for (const _ok of _ol) body.addEventListener(_ok, mark, true);
setTimeout(() => {
for (const _ok of _ol) body.removeEventListener(_ok, mark, true);
const _o1h = _o1l.get(_o2g); if (!_o1h || !_o1h.el.isConnected || _o26) return;
_o1r(_o1h, 'start');
try { _o1h.panel.focus({ preventScroll: true }); } catch { }
}, 420);
}
const _o19 = () => { if (body.isConnected) { st.local = loadLocal(); refresh(); } else window.removeEventListener('bds:connections-healed', _o19); };
window.addEventListener('bds:connections-healed', _o19);
const _o1z = _o2e && _o2e.on ? _o2e.on(() => {
if (!body.isConnected) return _o1z();
if ((typeof _o2e.mode === 'function' ? _o2e.mode() : (_o2e.hidden() ? 'off' : 'machine')) !== _o2d) { _o1z(); ui.clear(body); renderConnections(body, ctx, app); }
}) : null;
return { refresh, state: st, open: (id) => _o1v(id, { focus: true }) };
async function refresh() {
try {
const _od = await api.call('connections.status');
st.secrets = (_od && _od.secrets) || {}; st.last = (_od && _od.last) || {}; st.prices = (_od && _od.prices) || null;
st.serverOk = true; st.version = (_od && _od.version) || ''; st.serverMsg = '';
if (api.mode !== 'demo') st.serverOld = (st.serverOld && st.serverOld.legacy) ? st.serverOld : _o18(st.version);
} catch (e) {
st.serverOk = false; st.serverMsg = (e && e.userMessage) || t('err.network');
}
if (_ot.some((it) => it.svc)) {
try { const v = await api.call('svc.status', {}); st.svc = (v && v.services) || {}; st.svcOld = false; }
catch (e) { st.svc = {}; st.svcOld = isMissingActionError(e); }
}
if (_ot.some((it) => it.ext === 'videoai')) {
try { const v = await api.call('videoai.status', {}); st.ext = { ...(st.ext || {}), videoai: (v && v.providers) || null }; } catch { }
}
st.loaded = true;
paint();
}
function _o1v(id, { focus = false, instant = false } = {}) {
_o1a = id && _o1l.has(id) ? id : '';
for (const [k, _o1h] of _o1l) {
const on = k === _o1a;
_o1h.el.classList.toggle('is-open', on);
_o1h.el.classList.toggle('no-anim', !!instant);
_o1h.head.setAttribute('aria-expanded', on ? 'true' : 'false');
_o1h.panel.setAttribute('aria-hidden', on ? 'false' : 'true');
if (on) _o1h.panel.removeAttribute('inert'); else _o1h.panel.setAttribute('inert', '');
}
if (instant) requestAnimationFrame(() => requestAnimationFrame(() => { for (const _o1h of _o1l.values()) _o1h.el.classList.remove('no-anim'); }));
if (focus && _o1a) {
const _o1h = _o1l.get(_o1a);
try { _o1h.panel.focus({ preventScroll: true }); } catch { }
setTimeout(() => _o1r(_o1h, 'nearest'), _o1i() ? 0 : 260);
}
}
function _o1r(_o1h, block) {
const _o7 = document.querySelector('.topbar');
const _o25 = _o7 ? Math.max(0, Math.round(_o7.getBoundingClientRect().bottom)) : 0;
_o1h.el.style.scrollMarginTop = (_o25 + 12) + 'px';
_o1h.el.style.scrollMarginBottom = '96px';
try { _o1h.el.scrollIntoView({ block, behavior: _o1i() ? 'auto' : 'smooth' }); } catch { }
}
function toggle(id) { if (_o1a === id) { _o1v(''); try { _o1l.get(id).head.focus({ preventScroll: true }); } catch { } } else _o1v(id, { focus: true }); }
function paint() {
let done = 0;
for (const it of _ot) {
const L = lightFor(it, st);
const P = pillFor(it, st);
if (P.kind === 'ok') done++;
const _o1h = _o1l.get(it.id);
_o1h.el.dataset.light = L.tone;
_o1h.el.dataset.status = P.kind;
_o1h.pill.className = 'conn-pill conn-pill-' + P.kind;
_o1h.pillText.textContent = P.text;
const last = it.target ? st.last[it.target] : it.svc ? st.last['svc_' + it.svc] : null;
const _o10 = it.local && st.local[it.local];
const at = (last && last.at) || (_o10 && _o10.at);
_o1h.state.textContent = L.text + (at && (L.tone !== 'bad' || last) ? ' · ' + ui.date(at, true) : '');
_o1h.state.className = 'conn-state conn-state-' + L.tone;
_o1w(_o1h.state, !/^(Đã lưu – chưa kiểm tra|Chưa nhập|Chưa kiểm tra)/.test(L.text) || !!at);
if (it.id === 'claude' && _o1h.costText) _o1h.costText.textContent = 'Có phí theo lượt: ' + claudeCostText(st.prices) + '. Ước tính theo bảng giá công khai.';
for (const [k, s] of _o1h.secretUi) s.paint(!!st.secrets[k]);
if (_o1h.map) _o1h.map.paint(st.local.map || null);
const raw = [last && last.detail ? String(last.detail) : '', it.id === 'server' && st.version ? 'Phiên bản máy chủ: ' + st.version : '', it.id === 'server' && st.serverMsg ? st.serverMsg : ''].filter(Boolean).join('\n');
_o1h.raw.textContent = raw; _o1w(_o1h.raw, !!raw); _o1w(_o1h.tech, !!raw);
if (_o1h.fixBtn) {
_o1w(_o1h.fixBtn, needsFix(it, st) && st.loaded);
_o1h.fixBtn.querySelector('span:last-child').textContent = st.serverOld && owner ? 'Cập nhật máy chủ' : 'Cách sửa';
}
_o1w(_o1h.discBtn, canDisconnect(it, st, { owner }));
}
const _o1j = requiredSummary(_ot, st), miss = _o1j.miss;
ui.mountTo(summary,
h('div', { class: 'conn-sum-main' },
h('strong', { class: 'conn-sum-num num' }, done + '/' + _ot.length),
h('span', { class: 'conn-sum-label' }, 'đã kết nối')),
h('p', { class: ['conn-sum-text', miss.length ? 'is-bad' : 'is-ok'], 'data-testid': 'conn-sum-text' },
!st.loaded ? 'Đang đọc trạng thái…'
: miss.length ? 'Còn thiếu: ' + miss.map((x) => x.name).join(', ') + ' (bắt buộc ' + _o1j.done + '/' + _o1j.total + ')'
: 'Mục bắt buộc đã xong (' + _o1j.done + '/' + _o1j.total + ')' + (st.solo ? ' · các mục khác là tuỳ chọn' : '')),
h('div', { class: 'conn-sum-acts' },
button('Kiểm tra tất cả', testAll, { kind: 'ghost', icon: 'pulse', small: true, testid: 'conn-test-all' }),
button(t('net.diag'), () => { openDiagnosis({ ui, api, config }); }, { kind: 'ghost', icon: 'monitor', small: true, testid: 'conn-diag' })));
}
async function testAll() {
const _ov = _ot.filter((it) => it.id === 'server' || (it.target && it.secrets.every((k) => st.secrets[k])) || it.local === 'map' || (it.svc && st.svc && st.svc[it.svc] && st.svc[it.svc].connected))
.map((it) => _o1n(it, { quiet: true }).catch(() => null));
await Promise.all(_ov);
toast('Đã kiểm tra xong', 'ok');
}
function _o12(it) {
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
const _os = h('div', { class: 'conn-panel-body' });
const panel = h('div', { class: 'conn-panel', id: pid, role: 'region', 'aria-labelledby': _op, tabindex: '-1', inert: '', 'aria-hidden': 'true' }, h('div', { class: 'conn-panel-in' }, _os));
const el = h('article', { class: 'conn-row', dataset: { conn: it.id }, 'data-testid': 'conn-' + it.id }, h('h4', { class: 'conn-h' }, head), panel);
const raw = h('pre', { class: 'conn-raw', 'data-testid': 'conn-raw-' + it.id });
const _o1h = { el, head, panel, pill, pillText, dot, state, raw, costText: null, secretUi: new Map(), fixBtn: null, discBtn: null, primary: null };
_os.appendChild(state);
if (it.id === 'server') _os.appendChild(_o1u());
if (it.secrets) {
const box = h('div', { class: 'conn-fields' });
for (const k of it.secrets) { const s = _o1s(k, it, _o1h); _o1h.secretUi.set(k, s); box.appendChild(s.el); }
_os.appendChild(box);
}
if (it.id === 'vbee') _os.appendChild(_o2a(_o1h));
if (it.id === 'map') _os.appendChild(_o13(_o1h));
if (it.id === 'claude') _os.appendChild(h('p', { class: 'conn-note' }, 'Khác gói Claude Pro/Max – gói chat không có API. Không bắt buộc.'));
if (it.id === 'gemini') _os.appendChild(h('div', { class: 'conn-note conn-privacy', 'data-testid': 'conn-gemini-privacy' },
h('p', null, GEMINI_PRIVACY_SHORT),
h('details', { class: 'conn-privacy-full' }, h('summary', null, 'Đọc đủ'), h('p', null, GEMINI_PRIVACY))));
const _o4 = h('div', { class: 'btn-row conn-acts' });
if (it.ext) {
_o4.appendChild(h('a', { class: 'btn btn-primary btn-sm', href: it.goto, 'data-testid': 'conn-goto-' + it.id }, _o9('ext', 18), h('span', null, 'Mở Video AI')));
} else if (!it.linkOnly) {
const _oo = it.id === 'server' || !!it.secrets || it.id === 'vbee' || it.id === 'map';
_o1h.primary = button(_oo ? 'Lưu và kiểm tra' : 'Kiểm tra', () => _o1o(it, _o1h), { kind: 'primary', icon: _oo ? 'check' : 'pulse', small: true, testid: 'conn-test-' + it.id });
_o4.appendChild(_o1h.primary);
} else _o4.appendChild(h('a', { class: 'btn btn-primary btn-sm', href: LINKS.flow, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'conn-open-flow' }, _o9('ext', 18), h('span', null, 'Mở Flow')));
if (it.findChat) _o4.appendChild(button('Tự tìm chat id', findChat, { kind: 'secondary', icon: 'sparkle', small: true, testid: 'conn-findchat' }));
if (it.id === 'server') { _o1h.fixBtn = button('Cách sửa', () => _on(it), { kind: 'secondary', icon: 'refresh', small: true, testid: 'conn-fix-' + it.id }); _o4.appendChild(_o1h.fixBtn); }
if (!it.linkOnly && !it.ext) {
_o1h.discBtn = button('Ngắt kết nối', () => _of(it), { kind: 'danger', small: true, cls: 'conn-disc', testid: 'conn-disconnect-' + it.id });
_o1h.discBtn.prepend(_o9('unlink', 18));
_o4.appendChild(_o1h.discBtn);
}
_os.appendChild(_o4);
_os.appendChild(h('div', { class: 'conn-how-mini' },
h('p', { class: 'conn-sub' }, it.linkOnly ? 'Cách dùng' : 'Cách lấy'),
h('ol', { class: 'conn-quick' }, (it.quick || []).map((s) => _o1y(h, s, copy))),
h('div', { class: 'conn-how-acts' },
it.link && !it.linkOnly ? h('a', { class: 'btn btn-secondary btn-sm conn-ext', href: it.link.href, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'conn-ext-' + it.id }, h('span', null, it.link.label), _o9('ext', 16)) : null,
h('button', { type: 'button', class: 'conn-more', 'data-testid': 'conn-how-' + it.id, onclick: () => _oq(it) }, _o9('book', 16), h('span', null, 'Hướng dẫn đầy đủ')))));
_o1h.costText = h('span', { class: 'conn-cost-text' }, it.cost.detail + '.');
_os.appendChild(h('p', { class: 'conn-cost' }, badge(it.cost.label, it.paid ? 'warn' : 'ok'), _o1h.costText));
_os.appendChild(h('p', { class: 'conn-tech-use', 'data-testid': 'conn-use-' + it.id }, 'Dùng cho: ' + it.use + '.'));
if (it.id === 'map') _os.appendChild(h('p', { class: 'conn-tech-use' }, 'Khoá lưu trong Keychain/Credential Manager của máy tính chạy máy dựng – không lên máy chủ, không lưu trong app.'));
if (it.svc) _os.appendChild(h('p', { class: 'conn-tech-use' }, 'Khoá lưu trên máy chủ của anh/chị (Google Apps Script) – không bao giờ trả về trình duyệt.'));
if (it.id === 'server' && api.mode === 'demo') _os.appendChild(h('p', { class: 'conn-tech-use' }, t('set.conn.demo')));
_o1h.tech = h('details', { class: 'conn-tech', 'data-testid': 'conn-tech-' + it.id }, h('summary', null, 'Chi tiết kỹ thuật'), raw);
_o1w(_o1h.tech, false);
_os.appendChild(_o1h.tech);
return _o1h;
}
function _o1t(id, extra = {}) {
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
function _oj(input, _o1h) { input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && _o1h.primary) { e.preventDefault(); _o1h.primary.click(); } }); }
function _o1s(k, it, _o1h) {
const id = 'conn-in-' + k;
const { input, wrap } = _o1t(id, { inputmode: k === 'telegram_chat_id' ? 'numeric' : undefined });
_oj(input, _o1h);
const _o21 = h('span', { class: 'conn-saved' });
const el = h('div', { class: 'conn-field' }, h('label', { for: id, class: 'field-label' }, _o2[k] || k, _o21), wrap);
return {
el, input,
paint(set) {
input.placeholder = set ? '•••••••• đã lưu – nhập để thay' : 'Chưa nhập';
_o21.textContent = set ? '✓ đã lưu' : '';
}
};
}
function _o1u() {
const id = 'conn-in-url';
const input = h('input', { id, type: 'url', inputmode: 'url', autocomplete: 'off', spellcheck: 'false', placeholder: 'https://script.google.com/macros/s/…/exec', 'data-testid': id });
input.value = scriptUrl(config);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); const _o1h = _o1l.get('server'); if (_o1h && _o1h.primary) _o1h.primary.click(); } });
_o28 = input;
return h('div', { class: 'conn-field' }, h('label', { for: id, class: 'field-label' }, t('set.conn.url')), input);
}
function _o2a(_o1h) {
const appIn = h('input', { id: 'conn-in-vbee-app', type: 'text', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', placeholder: 'App ID', 'data-testid': 'conn-in-vbee-app' });
const _o24 = _o1t('conn-in-vbee-token', { placeholder: 'Token' });
_oj(appIn, _o1h); _oj(_o24.input, _o1h);
_o1h.vbee = { appIn, tokIn: _o24.input };
return h('div', { class: 'conn-fields' },
h('div', { class: 'conn-field' }, h('label', { for: 'conn-in-vbee-app', class: 'field-label' }, 'Vbee App ID'), appIn),
h('div', { class: 'conn-field' }, h('label', { for: 'conn-in-vbee-token', class: 'field-label' }, 'Vbee Token'), _o24.wrap));
}
function _o13(_o1h) {
const sel = h('select', { id: 'conn-in-map-provider', 'data-testid': 'conn-in-map-provider' },
MAP_PROVIDERS.map((_o1b) => h('option', { value: _o1b.id }, _o1b.name + (_o1b.recommended ? ' (khuyên dùng)' : ''))));
const key = _o1t('conn-in-map-key', { placeholder: 'API key' });
_oj(key.input, _o1h);
const _o21 = h('span', { class: 'conn-saved' });
_o1h.map = {
sel, keyIn: key.input,
paint(_o11) {
const set = !!(_o11 && _o11.key);
key.input.placeholder = set ? '•••••••• đã lưu – nhập để thay' : 'Chưa nhập';
_o21.textContent = set ? '✓ đã lưu' : '';
if (_o11 && _o11.provider && [...sel.options].some((o) => o.value === _o11.provider)) sel.value = _o11.provider;
}
};
return h('div', { class: 'conn-fields' },
h('div', { class: 'conn-field' }, h('label', { for: 'conn-in-map-provider', class: 'field-label' }, 'Nhà cung cấp bản đồ'), sel),
h('div', { class: 'conn-field' }, h('label', { for: 'conn-in-map-key', class: 'field-label' }, 'Khoá API bản đồ', _o21), key.wrap));
}
function _o14(_ou, fallback = {}) {
const _o8 = (_ou && _ou.check) || (_ou && _ou.last_check) || null;
return { engine: true, key: !!(_ou && _ou.key_set), provider: (_ou && _ou.provider) || '', ok: _ou && _ou.key_set && _o8 ? !!_o8.ok : (_ou && _ou.key_set ? undefined : false), msg: (_o8 && _o8.message) || '', ...fallback };
}
async function _o1o(it, _o1h) {
if (it.id === 'server') {
const url = String((_o28 && _o28.value) || '').trim();
if (url && url !== scriptUrl(config)) return _o1p(url);
return _o1n(it);
}
if (it.secrets) {
let _o1q = 0;
for (const [k, s] of _o1h.secretUi) {
const v = String(s.input.value || '').trim();
if (!v) continue;
await api.call('settings.set', { key: k, value: v });
s.input.value = ''; st.secrets[k] = true; _o1q++;
}
if (_o1q && it.target) delete st.last[it.target];
if (_o1q) paint();
const _om = it.secrets.find((k) => !st.secrets[k]);
if (_om) {
const s = _o1h.secretUi.get(_om);
toast(_om === 'telegram_chat_id' ? 'Nhắn "chào" cho bot rồi bấm Tự tìm chat id.' : 'Dán ' + (_o2[_om] || 'khoá').toLowerCase() + ' rồi bấm Lưu và kiểm tra.', 'info', 5000);
if (s) s.input.focus();
return false;
}
if (_o1q) toast('Đã lưu lên máy chủ – đang kiểm tra…', 'ok', 2000);
return _o1n(it);
}
if (it.id === 'map' && _o1h.map) return _o1n(it, { live: true, body: { provider: _o1h.map.sel.value, key: _o1h.map.keyIn.value.trim() } });
if (it.svc && _o1h.vbee) {
const _o5 = _o1h.vbee.appIn.value.trim(), key = _o1h.vbee.tokIn.value.trim();
const _oc = (st.svc || {})[it.svc];
if (!key && !(_oc && _oc.connected)) { toast('Dán App ID và Token Vbee rồi bấm Lưu và kiểm tra.', 'info', 5000); _o1h.vbee.tokIn.focus(); return false; }
if (key || _o5) {
try {
const _od = await api.call('svc.set', { id: it.svc, key, extra: _o5 ? { app_id: _o5 } : undefined });
st.svc = (_od && _od.services) || st.svc; st.svcOld = false;
} catch (e) {
if (isMissingActionError(e)) { st.svcOld = true; paint(); toast('Cần cập nhật máy chủ một lần (Cài đặt › Phiên bản) để lưu khoá Vbee', 'warn', 6000); return false; }
toast((e && e.userMessage) || t('err.network'), 'warn', 6000); return false;
}
_o1h.vbee.appIn.value = ''; _o1h.vbee.tokIn.value = '';
toast('Đã lưu khoá Vbee lên máy chủ – đang kiểm tra…', 'ok', 2000);
}
}
return _o1n(it);
}
async function _o1p(url) {
if (!/^https:\/\/script\.google(usercontent)?\.com\/.+\/exec$/.test(url)) { toast('URL phải có dạng https://script.google.com/macros/s/…/exec', 'warn', 6000); return false; }
if (api.mode === 'demo') {
const ok = await import('./wizard/demodata.js').then((_o11) => _o11.confirmLeaveDemo({ ui, api })).catch(() => true);
if (!ok) return false;
}
const _o1e = await _o1f(url);
if (_o1e.notPublic) { toast(NOT_PUBLIC_MSG, 'warn', 8000); return false; }
saveScriptUrl(url); toast(t('set.conn.saved') + (_o1e.version ? ' – máy chủ phiên bản ' + _o1e.version : ''), 'ok');
setTimeout(() => location.reload(), 700);
return true;
}
async function _o1f(url) {
try {
const _o1k = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'status', payload: {} }) });
const _o27 = await _o1k.text();
if ((_o1k.redirected && /^https:\/\/accounts\.google\.com\//.test(String(_o1k.url || ''))) || /^\s*</.test(_o27)) return { notPublic: true };
const _ou = JSON.parse(_o27);
return { ok: !!_ou.ok, version: (_ou.data && _ou.data.version) || '' };
} catch { return {}; }
}
async function _o1n(it, { quiet, live = false, body = null } = {}) {
let ok = false, msg = '', detail = '';
if (it.id === 'server') {
try {
const _od = await api.call('status');
ok = true;
st.serverOld = api.mode === 'demo' ? null : _o18(_od && _od.version);
if (api.mode !== 'demo' && owner) {
try {
const v = await api.call('server.version');
const _o17 = needServerUpdate({ actions: v && Array.isArray(v.actions) ? v.actions : null });
if (!st.serverOld && _o17.missing.length) st.serverOld = { server: _od && _od.version, target: _o22(), missing: _o17.missing };
} catch (e) { if (isMissingActionError(e)) st.serverOld = { server: _od && _od.version, target: _o22(), legacy: !st.serverOld }; }
}
if (st.serverOld) { ok = false; msg = serverOldText(st.serverOld) + (owner ? ' – bấm "Cập nhật máy chủ", app tự làm.' : ' – chờ Quản trị (Admin) cập nhật.'); }
else msg = api.mode === 'demo' ? 'Máy chủ xem thử trả lời. Dán địa chỉ máy chủ thật để dùng thật.' : t('set.conn.ok', { v: (_od && _od.version) || '?' });
const _ow = st.serverOld;
await refresh();
if (_ow && _ow.legacy) st.serverOld = _ow;
} catch (e) { ok = false; msg = (e && e.userMessage) || t('err.network'); st.serverOk = false; st.serverMsg = msg; paint(); }
} else if (it.target) {
const _od = await api.call('connections.test', { target: it.target });
st.last[it.target] = { ok: !!_od.ok, at: _od.at, message: _od.message };
if (_od.detail) st.last[it.target].detail = _od.detail;
ok = !!_od.ok; msg = _od.message || ''; detail = _od.detail || '';
} else if (it.local === 'map') {
try {
const _ou = live
? await _oi(_oh, '/video/map_source/test', { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body || {}) }, 30000)
: await _oi(_oh, '/video/map_source');
const _o1m = _o1l.get('map'); if (_o1m && _o1m.map) _o1m.map.keyIn.value = '';
st.local = saveLocal('map', _o14(_ou));
const _o11 = st.local.map;
ok = !!_o11.ok; msg = !_o11.key ? 'Chưa có khoá bản đồ – dán khoá rồi bấm Lưu và kiểm tra.' : _o11.msg || (_o11.ok ? 'Nền bản đồ và tìm địa chỉ chạy.' : 'Đã lưu khoá – bấm Lưu và kiểm tra để thử thật.');
} catch (e) {
const _o6 = /khoá|key|dạng/i.test(String((e && e.message) || ''));
if (!_o6) st.local = saveLocal('map', { ...(st.local.map || {}), engine: false, ok: (st.local.map || {}).ok });
ok = false; msg = _o6 ? e.message : 'Chưa gọi được máy dựng: bật "BDS Studio" trên máy tính; Chrome hỏi "Truy cập mạng cục bộ" thì bấm Cho phép.';
}
} else if (it.svc) {
try {
const _od = await api.call('svc.test', { id: it.svc });
ok = !!(_od && _od.ok); msg = (_od && _od.msg) || (ok ? 'Đạt' : 'Kiểm tra chưa đạt');
st.last['svc_' + it.svc] = { ok, message: msg, at: Date.now() };
} catch (e) {
if (isMissingActionError(e)) st.svcOld = true;
ok = false; msg = isMissingActionError(e) ? 'Cần cập nhật máy chủ một lần (Cài đặt › Phiên bản) để dùng Vbee.' : (e && e.userMessage) || t('err.network');
}
}
paint();
if (!quiet) toast(msg || (ok ? 'Đạt' : 'Chưa đạt'), ok ? 'ok' : 'warn', ok ? 3200 : 6000, { detail: ok ? '' : detail });
return ok;
}
async function _on(it) {
if (it.id === 'server' && st.serverOld && owner && app.selfHeal) {
const _o1h = await app.selfHeal.updateServer({ auto: false });
if (_o1h) { st.serverOld = null; await _o1n(it, { quiet: true }); }
return;
}
_oq(it);
}
async function _of(it) {
const Q = {
server: 'Ngắt máy chủ trên máy này? App quên đường dẫn máy chủ, xoá dữ liệu tạm trên máy và về màn kết nối. Dữ liệu trên Google Sheet giữ nguyên.',
map: 'Xoá khoá bản đồ khỏi máy dựng? Video bản đồ sẽ tạm dừng tới khi dán khoá mới.'
};
const _o1g = Q[it.id] || ('Ngắt ' + it.name + '? Khoá đã lưu trên máy chủ sẽ bị xoá; muốn dùng lại thì dán khoá mới rồi bấm Lưu và kiểm tra.');
if (!(await ui.confirm(_o1g, { ok: 'Ngắt kết nối', kind: 'danger', title: 'Ngắt kết nối – ' + it.name }))) return;
if (it.id === 'server') {
if (typeof app.disconnectServer === 'function') await app.disconnectServer();
return;
}
if (it.target) {
let _od = null;
try { _od = await api.call('connections.disconnect', { target: it.target }); } catch (e) {
toast((e && e.userMessage) || t('err.network'), 'warn', 6000); return;
}
for (const k of it.secrets || []) st.secrets[k] = false;
if (_od && _od.status && _od.status.secrets) { st.secrets = _od.status.secrets; st.last = _od.status.last || st.last; }
delete st.last[it.target];
paint();
toast('Đã ngắt ' + it.name + '. Dán khoá mới rồi bấm Lưu và kiểm tra để kết nối lại.', 'ok', 5000);
return;
}
if (it.svc) {
try { const _od = await api.call('svc.clear', { id: it.svc }); st.svc = (_od && _od.services) || {}; } catch (e) { toast((e && e.userMessage) || t('err.network'), 'warn', 6000); return; }
delete st.last['svc_' + it.svc];
paint();
toast('Đã xoá khoá ' + it.name + ' khỏi máy chủ.', 'ok', 5000);
return;
}
if (it.local === 'map') {
try { await _oi(_oh, '/video/map_source', { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ forget: true }) }, 4000); } catch {
toast('Máy dựng chưa bật – bật "BDS Studio" rồi ngắt lại', 'warn', 5000); return;
}
st.local = saveLocal('map', { engine: true, key: false, ok: false, msg: '' });
paint();
toast('Đã xoá khoá bản đồ khỏi máy dựng. Video bản đồ tạm dừng tới khi dán khoá mới.', 'ok', 5000);
return;
}
}
async function findChat() {
const _od = await api.call('telegram.find_chat_id');
st.secrets.telegram_chat_id = true; delete st.last.telegram;
paint();
toast('Đã tìm thấy và lưu chat id' + (_od && _od.name ? ' của ' + _od.name : '') + '. Bấm Lưu và kiểm tra để nhận tin thử.', 'ok', 5000);
}
function _oq(it) {
const body = h('div', { class: 'conn-how' },
h('p', { class: 'conn-how-use' }, h('strong', null, 'Dùng cho: '), it.use + '.'),
h('p', { class: 'conn-how-cost' }, h('strong', null, it.cost.label + ': '), it.id === 'claude' ? claudeCostText(st.prices) + '.' : it.cost.detail + '.'),
h('ol', { class: 'conn-steps' }, it.steps.map((s) => _o1y(h, s, copy))),
h('p', { class: 'muted small' }, 'Liên kết mở ở tab mới. Không gửi khoá qua chat/Zalo – chỉ dán vào ô trong app.'));
modal({ title: 'Cách lấy – ' + it.name, body, wide: true, cls: 'conn-modal', actions: [{ label: t('common.close'), kind: 'primary', id: 'conn-how-close' }] });
}
}
export async function renderBudgetPanel(body, ctx) {
ensureCss();
const { ui, api, ai, settings } = ctx;
const { h, field, button, toast } = ui;
const _oy = { cap_usd: 100, video_char_usd: 5, warn_pct: 80, ...(settings.get('budget_limits', {}) || {}) };
const capF = field({ label: t('set.budget.cap'), type: 'number', value: _oy.cap_usd, min: 0, step: 1, inputmode: 'decimal', id: 'budget-cap' });
const warnF = field({ label: t('set.budget.warn'), type: 'number', value: _oy.warn_pct, min: 10, max: 100, step: 5, inputmode: 'numeric', id: 'budget-warn' });
const _o2b = field({ label: 'Trần mỗi video nhân vật (USD)', type: 'number', value: _oy.video_char_usd, min: 0, step: 0.5, inputmode: 'decimal', id: 'budget-video' });
const _o15 = h('div', { class: 'bud-meter', 'data-testid': 'budget-meter' }, ui.spinner());
const table = h('div', { class: 'bud-table', 'data-testid': 'budget-table' });
const note = h('p', { class: 'bud-note' },
'Số ước tính theo bảng giá công khai – hoá đơn thật xem ở trang nhà cung cấp: ',
h('a', { href: LINKS.aistudio, target: '_blank', rel: 'noopener noreferrer' }, 'Google AI Studio'), ' (gói trả phí: ',
h('a', { href: LINKS.gcpBilling, target: '_blank', rel: 'noopener noreferrer' }, 'Google Cloud Billing'), ') · ',
h('a', { href: LINKS.anthropicBilling, target: '_blank', rel: 'noopener noreferrer' }, 'Anthropic Console'), '.');
body.append(_o15, table, note,
h('div', { class: 'grid-3' }, capF, warnF, ctx.video && ctx.video.hidden() ? null : _o2b),
h('div', { class: 'btn-row' }, button(t('common.save'), async () => {
const v = { cap_usd: Math.max(0, Number(capF.getValue()) || 0), video_char_usd: Math.max(0, Number(_o2b.getValue()) || 0), warn_pct: Math.min(100, Math.max(10, Number(warnF.getValue()) || 80)) };
await settings.set('budget_limits', { video_char_usd: v.video_char_usd, warn_pct: v.warn_pct });
try { await api.call('settings.set', { key: 'budget', value: { cap_usd: v.cap_usd } }); } catch (e) { toast(e.userMessage || t('err.network'), 'warn'); }
toast(t('common.saved'), 'ok'); _og();
}, { kind: 'primary', icon: 'check', id: 'budget-save' })));
async function _og() {
try {
const _od = await api.call('budget.get');
const _oa = Number(_od.cap_usd) || 0;
const _o1x = Number(_od.spent_usd) || 0;
const _o1d = _oa ? Math.min(100, _o1x / _oa * 100) : (_o1x > 0 ? 100 : 0);
const _o2h = Number((settings.get('budget_limits', {}) || {}).warn_pct) || 80;
const tone = budgetTone(_o1d, _o2h);
ai.overBudget = _oa > 0 && _o1x >= _oa;
const [y, _o11] = String(_od.month || '').split('-');
ui.mountTo(_o15,
h('div', { class: 'bud-head' },
h('span', { class: 'bud-month' }, 'Tháng ' + (_o11 && y ? _o11 + '/' + y : _od.month || '')),
h('strong', { class: 'bud-num num' }, usd(_o1x), h('span', { class: 'bud-cap' }, ' / ' + usd(_oa)))),
h('div', { class: 'bud-bar bud-' + tone }, ui.progress(_o1d, 'Đã dùng ' + Math.round(_o1d) + '% trần tháng')),
h('p', { class: 'bud-sub' }, 'Đã dùng ' + _o1d.toFixed(1).replace('.', ',') + '% trần · cảnh báo ở ' + _o2h + '%' +
(tone === 'bad' ? ' · đã chạm trần: chỉ còn Gemini miễn phí và chuyển sang chat' : tone === 'warn' ? ' · sắp chạm trần' : '')));
const _o1l = budgetRows(_od);
const _oe = (v) => (v == null ? '—' : intVi(v));
ui.mountTo(table,
h('div', { class: 'bud-row bud-th', 'aria-hidden': 'true' }, h('span', null, 'AI'), h('span', null, 'Lần gọi'), h('span', null, 'Token vào'), h('span', null, 'Token ra'), h('span', null, 'Chi phí')),
_o1l.map((_o1h) => h('div', { class: 'bud-row', dataset: { provider: _o1h.id } },
h('span', { class: 'bud-name' }, _o1h.label),
h('span', { class: 'bud-c', dataset: { k: 'Lần gọi' } }, _oe(_o1h.calls)),
h('span', { class: 'bud-c', dataset: { k: 'Token vào' } }, _oe(_o1h.tokens_in)),
h('span', { class: 'bud-c', dataset: { k: 'Token ra' } }, _oe(_o1h.tokens_out)),
h('strong', { class: 'bud-usd num' }, _o1h.usdText))));
} catch (e) { ui.mountTo(_o15, h('p', { class: 'muted' }, e.userMessage || t('err.network'))); }
}
await _og();
}
export default { renderConnections, renderBudgetPanel };

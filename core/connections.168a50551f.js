import { t } from './i18n.39c909b69c.js';
import { saveScriptUrl, scriptUrl, NOT_PUBLIC_MSG } from './api.024f831cb4.js';
import { ITEMS, PROFILE_EMAIL_HASH, LINKS, MAP_PROVIDERS, itemVisibleFor, lightFor, pillFor, routeItem, requiredSummary, usd, intVi, budgetRows, budgetTone, claudeCostText, loadLocal, saveLocal, serverOldText, canDisconnect, needsFix, forgetLocal } from './connections_logic.cff3dbca52.js';
import { cmpVersion } from './updates.9704b81308.js';
import { needServerUpdate, isMissingActionError } from './health_logic.9704b81308.js';
import { GEMINI_PRIVACY, GEMINI_PRIVACY_SHORT } from './connections_logic.cff3dbca52.js';
const _o1 = 'bds-conn-css';
function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o1)) return;
const _ou = document.createElement('link');
_ou.id = _o1; _ou.rel = 'stylesheet';
_ou.href = new URL('./connections.d6e8b7de51.css', import.meta.url).href;
document.head.appendChild(_ou);
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
const _o1v = document.createElementNS(_o3, 'svg');
for (const [k, v] of Object.entries({ viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', 'stroke-width': '1.7', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', class: 'ico' })) _o1v.setAttribute(k, v);
const _o16 = document.createElementNS(_o3, 'path'); _o16.setAttribute('d', _o0[name] || _o0.sparkle); _o1v.appendChild(_o16);
return _o1v;
}
function _o1t(h, step, copy) {
const _o17 = Array.isArray(step) ? step : [step];
return h('li', null, _o17.map((_o16) => {
if (typeof _o16 === 'string') return _o16;
if (_o16.b) return h('strong', null, _o16.b);
if (_o16.a) return h('a', { href: _o16.a, target: '_blank', rel: 'noopener noreferrer', class: 'conn-link' }, _o16.t || _o16.a);
if (_o16.code) return h('button', { type: 'button', class: 'conn-code', title: 'Bấm để chép', onclick: () => copy(_o16.code) }, _o9('copy', 14), h('span', null, _o16.code));
return '';
}));
}
const _o1r = (el, on) => { if (el) { el.hidden = !on; el.style.display = on ? '' : 'none'; } };
const _o1d = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; } };
async function _oh(base, path, opts = {}, ms = 2500) {
const _ob = new AbortController(); const _o1y = setTimeout(() => _ob.abort(), ms);
try {
const _o1c = await fetch(base.replace(/\/$/, '') + path, { ...opts, signal: _ob.signal });
let _or = null; try { _or = await _o1c.json(); } catch { _or = null; }
if (!_o1c.ok || (_or && _or.ok === false)) throw new Error((_or && _or.error && _or.error.message) || ('Máy dựng trả lỗi ' + _o1c.status));
return _or || {};
} finally { clearTimeout(_o1y); }
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
const _o1x = () => { const _o29 = typeof app.whatsNew === 'function' ? app.whatsNew() : null; return (_o29 && _o29.latest && _o29.latest.gas) || ''; };
const _o13 = (v) => (v && _o1x() && cmpVersion(v, _o1x()) < 0 ? { server: v, target: _o1x() } : null);
const summary = h('div', { class: 'conn-summary', 'data-testid': 'conn-summary', 'aria-live': 'polite' });
const _ow = h('div', { class: 'conn-list', 'data-testid': 'conn-list' });
const _o28 = ctx.video || null;
const _o26 = !!(_o28 && _o28.hidden());
const _o27 = _o28 && typeof _o28.mode === 'function' ? _o28.mode() : (_o26 ? 'off' : 'machine');
const engineOff = _o28 && typeof _o28.engineOff === 'function' ? _o28.engineOff() : _o26;
const _oq = ITEMS.filter((it) => !(_o28 && _o28.connHidden(it.id)) && itemVisibleFor(it, { edition: config.edition }));
const _o1g = new Map();
let _o22 = null;
let _o15 = '';
body.append(summary, _ow);
if (owner) body.append(h('p', { class: 'conn-foot', 'data-testid': 'conn-email-moved' }, 'Email nhận mã đặt lại mật khẩu nay nằm ở ',
h('a', { href: PROFILE_EMAIL_HASH, 'data-testid': 'conn-email-moved-link' }, 'Cài đặt › Thông tin cá nhân'), '.'));
if (_o26 && !(_o28 && typeof _o28.offered === 'function' && !_o28.offered())) body.append(h('p', { class: 'conn-foot', 'data-testid': 'conn-video-off' }, 'Làm video? ',
h('a', { class: 'btn btn-ghost btn-sm', href: '#/settings/packs', 'data-testid': 'conn-video-off-link' }, ui.icon('content', 18), h('span', null, 'Bật trong Gói chức năng'))));
if (_o27 !== 'off' && owner) {
const _o23 = !(ctx.packs && typeof ctx.packs.moduleOn === 'function') || ctx.packs.moduleOn('videoai_taocanh') !== false;
body.append(h('p', { class: 'conn-foot', 'data-testid': 'conn-videoai-keys' }, 'Khoá Video AI (Runway – có Veo, Kling – thu phí theo nhà cung cấp): ',
_o23 ? h('a', { class: 'btn btn-ghost btn-sm', href: '#/content/videoai_taocanh', 'data-testid': 'conn-videoai-keys-link' }, ui.icon('key', 18), h('span', null, 'Mở Video AI › Cài đặt'))
: h('a', { class: 'btn btn-ghost btn-sm', href: '#/settings/packs', 'data-testid': 'conn-videoai-keys-link' }, ui.icon('puzzle', 18), h('span', null, 'Cài gói Video AI'))));
}
if (_o27 === 'online') body.append(h('p', { class: 'conn-foot', 'data-testid': 'conn-video-online' }, 'Đang chỉ dùng AI trên mạng – không cài gì trên máy. Video bản đồ cần máy dựng: ',
h('a', { class: 'btn btn-ghost btn-sm', href: '#/settings/packs', 'data-testid': 'conn-video-online-link' }, ui.icon('monitor', 18), h('span', null, 'Đổi cách làm video'))));
for (const it of _oq) {
const _o1c = _oz(it);
_o1g.set(it.id, _o1c);
_ow.appendChild(_o1c.el);
}
paint();
refresh();
const _o2a = routeItem(ctx.route);
if (_o2a && _o1g.has(_o2a)) {
_o1q(_o2a, { instant: true });
setTimeout(() => {
const _o1c = _o1g.get(_o2a); if (!_o1c || !_o1c.el.isConnected) return;
_o1m(_o1c, 'start');
try { _o1c.panel.focus({ preventScroll: true }); } catch { }
}, 420);
}
const _o14 = () => { if (body.isConnected) { st.local = loadLocal(); refresh(); } else window.removeEventListener('bds:connections-healed', _o14); };
window.addEventListener('bds:connections-healed', _o14);
const _o1u = _o28 && _o28.on ? _o28.on(() => {
if (!body.isConnected) return _o1u();
if ((typeof _o28.mode === 'function' ? _o28.mode() : (_o28.hidden() ? 'off' : 'machine')) !== _o27) { _o1u(); ui.clear(body); renderConnections(body, ctx, app); }
}) : null;
return { refresh, state: st, open: (id) => _o1q(id, { focus: true }) };
async function refresh() {
try {
const _oc = await api.call('connections.status');
st.secrets = (_oc && _oc.secrets) || {}; st.last = (_oc && _oc.last) || {}; st.prices = (_oc && _oc.prices) || null;
st.serverOk = true; st.version = (_oc && _oc.version) || ''; st.serverMsg = '';
if (api.mode !== 'demo') st.serverOld = (st.serverOld && st.serverOld.legacy) ? st.serverOld : _o13(st.version);
} catch (e) {
st.serverOk = false; st.serverMsg = (e && e.userMessage) || t('err.network');
}
st.loaded = true;
paint();
}
function _o1q(id, { focus = false, instant = false } = {}) {
_o15 = id && _o1g.has(id) ? id : '';
for (const [k, _o1c] of _o1g) {
const on = k === _o15;
_o1c.el.classList.toggle('is-open', on);
_o1c.el.classList.toggle('no-anim', !!instant);
_o1c.head.setAttribute('aria-expanded', on ? 'true' : 'false');
_o1c.panel.setAttribute('aria-hidden', on ? 'false' : 'true');
if (on) _o1c.panel.removeAttribute('inert'); else _o1c.panel.setAttribute('inert', '');
}
if (instant) requestAnimationFrame(() => requestAnimationFrame(() => { for (const _o1c of _o1g.values()) _o1c.el.classList.remove('no-anim'); }));
if (focus && _o15) {
const _o1c = _o1g.get(_o15);
try { _o1c.panel.focus({ preventScroll: true }); } catch { }
setTimeout(() => _o1m(_o1c, 'nearest'), _o1d() ? 0 : 260);
}
}
function _o1m(_o1c, block) {
const _o6 = document.querySelector('.topbar');
const _o20 = _o6 ? Math.max(0, Math.round(_o6.getBoundingClientRect().bottom)) : 0;
_o1c.el.style.scrollMarginTop = (_o20 + 12) + 'px';
_o1c.el.style.scrollMarginBottom = '96px';
try { _o1c.el.scrollIntoView({ block, behavior: _o1d() ? 'auto' : 'smooth' }); } catch { }
}
function toggle(id) { if (_o15 === id) { _o1q(''); try { _o1g.get(id).head.focus({ preventScroll: true }); } catch { } } else _o1q(id, { focus: true }); }
function paint() {
let done = 0;
for (const it of _oq) {
const L = lightFor(it, st);
const P = pillFor(it, st);
if (P.kind === 'ok') done++;
const _o1c = _o1g.get(it.id);
_o1c.el.dataset.light = L.tone;
_o1c.el.dataset.status = P.kind;
_o1c.pill.className = 'conn-pill conn-pill-' + P.kind;
_o1c.pillText.textContent = P.text;
const last = it.target && st.last[it.target];
const _ox = it.local && st.local[it.local === 'vbee' ? 'engine' : it.local];
const at = (last && last.at) || (_ox && _ox.at);
_o1c.state.textContent = L.text + (at && (L.tone !== 'bad' || last) ? ' · ' + ui.date(at, true) : '');
_o1c.state.className = 'conn-state conn-state-' + L.tone;
_o1r(_o1c.state, !/^(Đã lưu – chưa kiểm tra|Chưa nhập|Chưa kiểm tra)/.test(L.text) || !!at);
if (it.id === 'claude' && _o1c.costText) _o1c.costText.textContent = 'Có phí theo lượt: ' + claudeCostText(st.prices) + '. Ước tính theo bảng giá công khai.';
for (const [k, s] of _o1c.secretUi) s.paint(!!st.secrets[k]);
if (_o1c.map) _o1c.map.paint(st.local.map || null);
const raw = [last && last.detail ? String(last.detail) : '', it.id === 'server' && st.version ? 'Phiên bản máy chủ: ' + st.version : '', it.id === 'server' && st.serverMsg ? st.serverMsg : ''].filter(Boolean).join('\n');
_o1c.raw.textContent = raw; _o1r(_o1c.raw, !!raw);
if (_o1c.fixBtn) {
_o1r(_o1c.fixBtn, needsFix(it, st) && st.loaded);
_o1c.fixBtn.querySelector('span:last-child').textContent = st.serverOld && owner ? 'Cập nhật máy chủ' : 'Cách sửa';
}
_o1r(_o1c.discBtn, canDisconnect(it, st, { owner }));
}
const _o1e = requiredSummary(_oq, st), miss = _o1e.miss;
ui.mountTo(summary,
h('div', { class: 'conn-sum-main' },
h('strong', { class: 'conn-sum-num num' }, done + '/' + _oq.length),
h('span', { class: 'conn-sum-label' }, 'đã kết nối')),
h('p', { class: ['conn-sum-text', miss.length ? 'is-bad' : 'is-ok'], 'data-testid': 'conn-sum-text' },
!st.loaded ? 'Đang đọc trạng thái…'
: miss.length ? 'Còn thiếu: ' + miss.map((x) => x.name).join(', ') + ' (bắt buộc ' + _o1e.done + '/' + _o1e.total + ')'
: 'Mục bắt buộc đã xong (' + _o1e.done + '/' + _o1e.total + ')' + (st.solo ? ' · các mục khác là tuỳ chọn' : '')),
button('Kiểm tra tất cả', testAll, { kind: 'ghost', icon: 'pulse', small: true, testid: 'conn-test-all' }));
}
async function testAll() {
const _os = _oq.filter((it) => it.id === 'server' || (it.target && it.secrets.every((k) => st.secrets[k])) || it.local === 'ollama' || it.local === 'engine' || it.local === 'map')
.map((it) => _o1i(it, { quiet: true }).catch(() => null));
await Promise.all(_os);
toast('Đã kiểm tra xong', 'ok');
}
function _oz(it) {
const _on = 'conn-head-' + it.id, pid = 'conn-panel-' + it.id;
const dot = h('span', { class: 'conn-pill-dot', 'aria-hidden': 'true', 'data-testid': 'conn-dot-' + it.id });
const pillText = h('span', null, '');
const pill = h('span', { class: 'conn-pill', 'data-testid': 'conn-pill-' + it.id }, dot, pillText);
const head = h('button', { type: 'button', class: 'conn-head', id: _on, 'aria-expanded': 'false', 'aria-controls': pid, 'data-testid': 'conn-toggle-' + it.id, onclick: () => toggle(it.id) },
h('span', { class: 'conn-ico' }, _o9(it.icon, 20)),
h('span', { class: 'conn-titles' },
h('span', { class: 'conn-name' }, it.name),
h('span', { class: 'conn-hint' }, it.hint)),
pill,
h('span', { class: 'conn-chev' }, _o9('chev', 18)));
const state = h('p', { class: 'conn-state' });
const _op = h('div', { class: 'conn-panel-body' });
const panel = h('div', { class: 'conn-panel', id: pid, role: 'region', 'aria-labelledby': _on, tabindex: '-1', inert: '', 'aria-hidden': 'true' }, h('div', { class: 'conn-panel-in' }, _op));
const el = h('article', { class: 'conn-row', dataset: { conn: it.id }, 'data-testid': 'conn-' + it.id }, h('h4', { class: 'conn-h' }, head), panel);
const raw = h('pre', { class: 'conn-raw', 'data-testid': 'conn-raw-' + it.id });
const _o1c = { el, head, panel, pill, pillText, dot, state, raw, costText: null, secretUi: new Map(), fixBtn: null, discBtn: null, primary: null };
_op.appendChild(state);
if (it.id === 'server') _op.appendChild(_o1p());
if (it.secrets) {
const _o7 = h('div', { class: 'conn-fields' });
for (const k of it.secrets) { const s = _o1n(k, it, _o1c); _o1c.secretUi.set(k, s); _o7.appendChild(s.el); }
_op.appendChild(_o7);
}
if (it.id === 'vbee') _op.appendChild(_o24(_o1c));
if (it.id === 'map') _op.appendChild(_o10(_o1c));
if (it.id === 'claude') _op.appendChild(h('p', { class: 'conn-note' }, 'Khác gói Claude Pro/Max – gói chat không có API. Không bắt buộc.'));
if (it.id === 'gemini') _op.appendChild(h('div', { class: 'conn-note conn-privacy', 'data-testid': 'conn-gemini-privacy' },
h('p', null, GEMINI_PRIVACY_SHORT),
h('details', { class: 'conn-privacy-full' }, h('summary', null, 'Đọc đủ'), h('p', null, GEMINI_PRIVACY))));
const _o4 = h('div', { class: 'btn-row conn-acts' });
if (!it.linkOnly) {
const _om = it.id === 'server' || !!it.secrets || it.id === 'vbee' || it.id === 'map';
_o1c.primary = button(_om ? 'Lưu và kiểm tra' : 'Kiểm tra', () => _o1j(it, _o1c), { kind: 'primary', icon: _om ? 'check' : 'pulse', small: true, testid: 'conn-test-' + it.id });
_o4.appendChild(_o1c.primary);
} else _o4.appendChild(h('a', { class: 'btn btn-primary btn-sm', href: LINKS.flow, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'conn-open-flow' }, _o9('ext', 18), h('span', null, 'Mở Flow')));
if (it.findChat) _o4.appendChild(button('Tự tìm chat id', findChat, { kind: 'secondary', icon: 'sparkle', small: true, testid: 'conn-findchat' }));
if (it.id === 'server') { _o1c.fixBtn = button('Cách sửa', () => _ok(it), { kind: 'secondary', icon: 'refresh', small: true, testid: 'conn-fix-' + it.id }); _o4.appendChild(_o1c.fixBtn); }
if (!it.linkOnly && it.local !== 'vbee') {
_o1c.discBtn = button('Ngắt kết nối', () => _oe(it), { kind: 'danger', small: true, cls: 'conn-disc', testid: 'conn-disconnect-' + it.id });
_o1c.discBtn.prepend(_o9('unlink', 18));
_o4.appendChild(_o1c.discBtn);
}
_op.appendChild(_o4);
_op.appendChild(h('div', { class: 'conn-how-mini' },
h('p', { class: 'conn-sub' }, it.linkOnly ? 'Cách dùng' : 'Cách lấy'),
h('ol', { class: 'conn-quick' }, (it.quick || []).map((s) => _o1t(h, s, copy))),
h('div', { class: 'conn-how-acts' },
it.link && !it.linkOnly ? h('a', { class: 'btn btn-secondary btn-sm conn-ext', href: it.link.href, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'conn-ext-' + it.id }, h('span', null, it.link.label), _o9('ext', 16)) : null,
h('button', { type: 'button', class: 'conn-more', 'data-testid': 'conn-how-' + it.id, onclick: () => _oo(it) }, _o9('book', 16), h('span', null, 'Hướng dẫn đầy đủ')))));
_o1c.costText = h('span', { class: 'conn-cost-text' }, it.cost.detail + '.');
_op.appendChild(h('p', { class: 'conn-cost' }, badge(it.cost.label, it.paid ? 'warn' : 'ok'), _o1c.costText));
_op.appendChild(h('details', { class: 'conn-tech', 'data-testid': 'conn-tech-' + it.id },
h('summary', null, 'Chi tiết'),
h('p', { class: 'conn-tech-use' }, 'Dùng cho: ' + it.use + '.'),
it.id === 'vbee' || it.id === 'map' ? h('p', null, 'Khoá lưu trong Keychain/Credential Manager của máy tính chạy máy dựng – không lên máy chủ, không lưu trong app.') : null,
it.id === 'server' && api.mode === 'demo' ? h('p', null, t('set.conn.demo')) : null,
raw));
return _o1c;
}
function _o1o(id, extra = {}) {
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
function _oi(input, _o1c) { input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && _o1c.primary) { e.preventDefault(); _o1c.primary.click(); } }); }
function _o1n(k, it, _o1c) {
const id = 'conn-in-' + k;
const { input, wrap } = _o1o(id, { inputmode: k === 'telegram_chat_id' ? 'numeric' : undefined });
_oi(input, _o1c);
const _o1w = h('span', { class: 'conn-saved' });
const el = h('div', { class: 'conn-field' }, h('label', { for: id, class: 'field-label' }, _o2[k] || k, _o1w), wrap);
return {
el, input,
paint(set) {
input.placeholder = set ? '•••••••• đã lưu – nhập để thay' : 'Chưa nhập';
_o1w.textContent = set ? '✓ đã lưu' : '';
}
};
}
function _o1p() {
const id = 'conn-in-url';
const input = h('input', { id, type: 'url', inputmode: 'url', autocomplete: 'off', spellcheck: 'false', placeholder: 'https://script.google.com/macros/s/…/exec', 'data-testid': id });
input.value = scriptUrl(config);
input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); const _o1c = _o1g.get('server'); if (_o1c && _o1c.primary) _o1c.primary.click(); } });
_o22 = input;
return h('div', { class: 'conn-field' }, h('label', { for: id, class: 'field-label' }, t('set.conn.url')), input);
}
function _o24(_o1c) {
const appIn = h('input', { id: 'conn-in-vbee-app', type: 'text', autocomplete: 'off', spellcheck: 'false', autocapitalize: 'off', placeholder: 'App-Id', 'data-testid': 'conn-in-vbee-app' });
const _o1z = _o1o('conn-in-vbee-token', { placeholder: 'Token' });
_oi(appIn, _o1c); _oi(_o1z.input, _o1c);
_o1c.vbee = { appIn, tokIn: _o1z.input };
return h('div', { class: 'conn-fields' },
h('div', { class: 'conn-field' }, h('label', { for: 'conn-in-vbee-app', class: 'field-label' }, 'Vbee App-Id'), appIn),
h('div', { class: 'conn-field' }, h('label', { for: 'conn-in-vbee-token', class: 'field-label' }, 'Vbee Token'), _o1z.wrap));
}
function _o10(_o1c) {
const sel = h('select', { id: 'conn-in-map-provider', 'data-testid': 'conn-in-map-provider' },
MAP_PROVIDERS.map((_o16) => h('option', { value: _o16.id }, _o16.name + (_o16.recommended ? ' (khuyên dùng)' : ''))));
const key = _o1o('conn-in-map-key', { placeholder: 'API key' });
_oi(key.input, _o1c);
const _o1w = h('span', { class: 'conn-saved' });
_o1c.map = {
sel, keyIn: key.input,
paint(_oy) {
const set = !!(_oy && _oy.key);
key.input.placeholder = set ? '•••••••• đã lưu – nhập để thay' : 'Chưa nhập';
_o1w.textContent = set ? '✓ đã lưu' : '';
if (_oy && _oy.provider && [...sel.options].some((o) => o.value === _oy.provider)) sel.value = _oy.provider;
}
};
return h('div', { class: 'conn-fields' },
h('div', { class: 'conn-field' }, h('label', { for: 'conn-in-map-provider', class: 'field-label' }, 'Nhà cung cấp bản đồ'), sel),
h('div', { class: 'conn-field' }, h('label', { for: 'conn-in-map-key', class: 'field-label' }, 'Khoá API bản đồ', _o1w), key.wrap));
}
function _o11(_or, fallback = {}) {
const _o8 = (_or && _or.check) || (_or && _or.last_check) || null;
return { engine: true, key: !!(_or && _or.key_set), provider: (_or && _or.provider) || '', ok: _or && _or.key_set && _o8 ? !!_o8.ok : (_or && _or.key_set ? undefined : false), msg: (_o8 && _o8.message) || '', ...fallback };
}
async function _o1j(it, _o1c) {
if (it.id === 'server') {
const url = String((_o22 && _o22.value) || '').trim();
if (url && url !== scriptUrl(config)) return _o1k(url);
return _o1i(it);
}
if (it.secrets) {
let _o1l = 0;
for (const [k, s] of _o1c.secretUi) {
const v = String(s.input.value || '').trim();
if (!v) continue;
await api.call('settings.set', { key: k, value: v });
s.input.value = ''; st.secrets[k] = true; _o1l++;
}
if (_o1l && it.target) delete st.last[it.target];
if (_o1l) paint();
const _oj = it.secrets.find((k) => !st.secrets[k]);
if (_oj) {
const s = _o1c.secretUi.get(_oj);
toast(_oj === 'telegram_chat_id' ? 'Nhắn "chào" cho bot rồi bấm Tự tìm chat id.' : 'Dán ' + (_o2[_oj] || 'khoá').toLowerCase() + ' rồi bấm Lưu và kiểm tra.', 'info', 5000);
if (s) s.input.focus();
return false;
}
if (_o1l) toast('Đã lưu lên máy chủ – đang kiểm tra…', 'ok', 2000);
return _o1i(it);
}
if (it.id === 'map' && _o1c.map) return _o1i(it, { live: true, body: { provider: _o1c.map.sel.value, key: _o1c.map.keyIn.value.trim() } });
if (it.id === 'vbee' && _o1c.vbee) {
const b = {};
if (_o1c.vbee.appIn.value.trim()) b.VBEE_APP_ID = _o1c.vbee.appIn.value.trim();
if (_o1c.vbee.tokIn.value.trim()) b.VBEE_TOKEN = _o1c.vbee.tokIn.value.trim();
if (Object.keys(b).length) {
let _o1f;
try { _o1f = await _oh(_og, '/secrets', { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(b) }, 6000); } catch {
toast('Máy dựng chưa bật hoặc Chrome chặn "Truy cập mạng cục bộ"', 'warn', 5000); return false;
}
_o1c.vbee.appIn.value = ''; _o1c.vbee.tokIn.value = '';
toast(_o1f.stored === 'keychain' ? 'Đã lưu khoá Vbee vào Keychain của máy' : 'Đã lưu khoá Vbee (tệp riêng của máy)', 'ok');
}
}
return _o1i(it);
}
async function _o1k(url) {
if (!/^https:\/\/script\.google(usercontent)?\.com\/.+\/exec$/.test(url)) { toast('URL phải có dạng https://script.google.com/macros/s/…/exec', 'warn', 6000); return false; }
if (api.mode === 'demo') {
const ok = await import('./wizard/demodata.js').then((_oy) => _oy.confirmLeaveDemo({ ui, api })).catch(() => true);
if (!ok) return false;
}
const _o19 = await _o1a(url);
if (_o19.notPublic) { toast(NOT_PUBLIC_MSG, 'warn', 8000); return false; }
saveScriptUrl(url); toast(t('set.conn.saved') + (_o19.version ? ' – máy chủ phiên bản ' + _o19.version : ''), 'ok');
setTimeout(() => location.reload(), 700);
return true;
}
async function _o1a(url) {
try {
const _o1f = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'status', payload: {} }) });
const _o21 = await _o1f.text();
if ((_o1f.redirected && /^https:\/\/accounts\.google\.com\//.test(String(_o1f.url || ''))) || /^\s*</.test(_o21)) return { notPublic: true };
const _or = JSON.parse(_o21);
return { ok: !!_or.ok, version: (_or.data && _or.data.version) || '' };
} catch { return {}; }
}
async function _o1i(it, { quiet, live = false, body = null } = {}) {
let ok = false, msg = '', detail = '';
if (it.id === 'server') {
try {
const _oc = await api.call('status');
ok = true;
st.serverOld = api.mode === 'demo' ? null : _o13(_oc && _oc.version);
if (api.mode !== 'demo' && owner) {
try {
const v = await api.call('server.version');
const n = needServerUpdate({ actions: v && Array.isArray(v.actions) ? v.actions : null });
if (!st.serverOld && n.missing.length) st.serverOld = { server: _oc && _oc.version, target: _o1x(), missing: n.missing };
} catch (e) { if (isMissingActionError(e)) st.serverOld = { server: _oc && _oc.version, target: _o1x(), legacy: !st.serverOld }; }
}
if (st.serverOld) { ok = false; msg = serverOldText(st.serverOld) + (owner ? ' – bấm "Cập nhật máy chủ", app tự làm.' : ' – chờ Quản trị (Admin) cập nhật.'); }
else msg = api.mode === 'demo' ? 'Máy chủ xem thử trả lời. Dán địa chỉ máy chủ thật để dùng thật.' : t('set.conn.ok', { v: (_oc && _oc.version) || '?' });
const _ot = st.serverOld;
await refresh();
if (_ot && _ot.legacy) st.serverOld = _ot;
} catch (e) { ok = false; msg = (e && e.userMessage) || t('err.network'); st.serverOk = false; st.serverMsg = msg; paint(); }
} else if (it.target) {
const _oc = await api.call('connections.test', { target: it.target });
st.last[it.target] = { ok: !!_oc.ok, at: _oc.at, message: _oc.message };
if (_oc.detail) st.last[it.target].detail = _oc.detail;
ok = !!_oc.ok; msg = _oc.message || ''; detail = _oc.detail || '';
} else if (it.local === 'ollama') {
const _o1c = await ai.checkOllama({ bridge: !engineOff });
st.local = saveLocal('ollama', { ok: !!_o1c.ok, n: (_o1c.models || []).length });
ok = !!_o1c.ok; msg = _o1c.ok ? t('set.ai.ollama_ok', { n: _o1c.models.length }) : t('set.ai.ollama_fail') + ' Mở Ollama rồi thử lại.';
} else if (it.local === 'map') {
try {
const _or = live
? await _oh(_og, '/video/map_source/test', { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body || {}) }, 30000)
: await _oh(_og, '/video/map_source');
const _o1h = _o1g.get('map'); if (_o1h && _o1h.map) _o1h.map.keyIn.value = '';
st.local = saveLocal('map', _o11(_or));
const _oy = st.local.map;
ok = !!_oy.ok; msg = !_oy.key ? 'Chưa có khoá bản đồ – dán khoá rồi bấm Lưu và kiểm tra.' : _oy.msg || (_oy.ok ? 'Nền bản đồ và tìm địa chỉ chạy.' : 'Đã lưu khoá – bấm Lưu và kiểm tra để thử thật.');
} catch (e) {
const _o5 = /khoá|key|dạng/i.test(String((e && e.message) || ''));
if (!_o5) st.local = saveLocal('map', { ...(st.local.map || {}), engine: false, ok: (st.local.map || {}).ok });
ok = false; msg = _o5 ? e.message : 'Chưa gọi được máy dựng: bật "BDS Studio" trên máy tính; Chrome hỏi "Truy cập mạng cục bộ" thì bấm Cho phép.';
}
} else if (it.local === 'engine' || it.local === 'vbee') {
try {
const _or = await _oh(_og, '/health');
const _ol = _or.app === 'bds-studio-engine' || _or.ok === true;
st.local = saveLocal('engine', { ok: _ol, vbee: !!_or.vbee_configured });
ok = it.local === 'vbee' ? _ol && !!_or.vbee_configured : _ol;
msg = !_ol ? 'Cổng 8765 không phải máy dựng BDS Studio.' : it.local === 'vbee' ? (_or.vbee_configured ? 'Máy dựng đã có khoá Vbee.' : 'Máy dựng chưa có khoá Vbee – dán App-Id và Token.') : 'Máy dựng đang chạy' + (_or.version ? ' – phiên bản ' + _or.version : '') + '.';
} catch {
st.local = saveLocal('engine', { ok: false, vbee: false });
ok = false; msg = 'Chưa gọi được máy dựng: bật "BDS Studio" trên máy tính; Chrome hỏi "Truy cập mạng cục bộ" thì bấm Cho phép.';
}
}
paint();
if (!quiet) toast(msg || (ok ? 'Đạt' : 'Chưa đạt'), ok ? 'ok' : 'warn', ok ? 3200 : 6000, { detail: ok ? '' : detail });
return ok;
}
async function _ok(it) {
if (it.id === 'server' && st.serverOld && owner && app.selfHeal) {
const _o1c = await app.selfHeal.updateServer({ auto: false });
if (_o1c) { st.serverOld = null; await _o1i(it, { quiet: true }); }
return;
}
_oo(it);
}
async function _oe(it) {
const Q = {
server: 'Ngắt máy chủ trên máy này? App quên đường dẫn máy chủ, xoá dữ liệu tạm trên máy và về màn kết nối. Dữ liệu trên Google Sheet giữ nguyên.',
engine: 'Ngắt máy dựng? App quên vé máy dựng (máy dựng thôi tự chạy qua đêm) rồi dò lại.',
map: 'Xoá khoá bản đồ khỏi máy dựng? Video bản đồ sẽ tạm dừng tới khi dán khoá mới.',
ollama: 'Ngắt Ollama? App quên kết quả dò Ollama trên máy này rồi dò lại.'
};
const _o1b = Q[it.id] || ('Ngắt ' + it.name + '? Khoá đã lưu trên máy chủ sẽ bị xoá; muốn dùng lại thì dán khoá mới rồi bấm Lưu và kiểm tra.');
if (!(await ui.confirm(_o1b, { ok: 'Ngắt kết nối', kind: 'danger', title: 'Ngắt kết nối – ' + it.name }))) return;
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
await _o1i(it, { quiet: false });
return;
}
if (it.local === 'ollama') {
st.local = forgetLocal('ollama');
paint();
await _o1i(it, { quiet: false });
}
}
async function findChat() {
const _oc = await api.call('telegram.find_chat_id');
st.secrets.telegram_chat_id = true; delete st.last.telegram;
paint();
toast('Đã tìm thấy và lưu chat id' + (_oc && _oc.name ? ' của ' + _oc.name : '') + '. Bấm Lưu và kiểm tra để nhận tin thử.', 'ok', 5000);
}
function _oo(it) {
const body = h('div', { class: 'conn-how' },
h('p', { class: 'conn-how-use' }, h('strong', null, 'Dùng cho: '), it.use + '.'),
h('p', { class: 'conn-how-cost' }, h('strong', null, it.cost.label + ': '), it.id === 'claude' ? claudeCostText(st.prices) + '.' : it.cost.detail + '.'),
h('ol', { class: 'conn-steps' }, it.steps.map((s) => _o1t(h, s, copy))),
h('p', { class: 'muted small' }, 'Liên kết mở ở tab mới. Không gửi khoá qua chat/Zalo – chỉ dán vào ô trong app.'));
modal({ title: 'Cách lấy – ' + it.name, body, wide: true, cls: 'conn-modal', actions: [{ label: t('common.close'), kind: 'primary', id: 'conn-how-close' }] });
}
}
export async function renderBudgetPanel(body, ctx) {
ensureCss();
const { ui, api, ai, settings } = ctx;
const { h, field, button, toast } = ui;
const _ov = { cap_usd: 100, video_char_usd: 5, warn_pct: 80, ...(settings.get('budget_limits', {}) || {}) };
const capF = field({ label: t('set.budget.cap'), type: 'number', value: _ov.cap_usd, min: 0, step: 1, inputmode: 'decimal', id: 'budget-cap' });
const warnF = field({ label: t('set.budget.warn'), type: 'number', value: _ov.warn_pct, min: 10, max: 100, step: 5, inputmode: 'numeric', id: 'budget-warn' });
const _o25 = field({ label: 'Trần mỗi video nhân vật (USD)', type: 'number', value: _ov.video_char_usd, min: 0, step: 0.5, inputmode: 'decimal', id: 'budget-video' });
const _o12 = h('div', { class: 'bud-meter', 'data-testid': 'budget-meter' }, ui.spinner());
const table = h('div', { class: 'bud-table', 'data-testid': 'budget-table' });
const note = h('p', { class: 'bud-note' },
'Số ước tính theo bảng giá công khai – hoá đơn thật xem ở trang nhà cung cấp: ',
h('a', { href: LINKS.aistudio, target: '_blank', rel: 'noopener noreferrer' }, 'Google AI Studio'), ' (gói trả phí: ',
h('a', { href: LINKS.gcpBilling, target: '_blank', rel: 'noopener noreferrer' }, 'Google Cloud Billing'), ') · ',
h('a', { href: LINKS.anthropicBilling, target: '_blank', rel: 'noopener noreferrer' }, 'Anthropic Console'), '.');
body.append(_o12, table, note,
h('div', { class: 'grid-3' }, capF, warnF, ctx.video && ctx.video.hidden() ? null : _o25),
h('div', { class: 'btn-row' }, button(t('common.save'), async () => {
const v = { cap_usd: Math.max(0, Number(capF.getValue()) || 0), video_char_usd: Math.max(0, Number(_o25.getValue()) || 0), warn_pct: Math.min(100, Math.max(10, Number(warnF.getValue()) || 80)) };
await settings.set('budget_limits', { video_char_usd: v.video_char_usd, warn_pct: v.warn_pct });
try { await api.call('settings.set', { key: 'budget', value: { cap_usd: v.cap_usd } }); } catch (e) { toast(e.userMessage || t('err.network'), 'warn'); }
toast(t('common.saved'), 'ok'); _of();
}, { kind: 'primary', icon: 'check', id: 'budget-save' })));
async function _of() {
try {
const _oc = await api.call('budget.get');
const _oa = Number(_oc.cap_usd) || 0;
const _o1s = Number(_oc.spent_usd) || 0;
const _o18 = _oa ? Math.min(100, _o1s / _oa * 100) : (_o1s > 0 ? 100 : 0);
const _o2b = Number((settings.get('budget_limits', {}) || {}).warn_pct) || 80;
const tone = budgetTone(_o18, _o2b);
ai.overBudget = _oa > 0 && _o1s >= _oa;
const [y, _oy] = String(_oc.month || '').split('-');
ui.mountTo(_o12,
h('div', { class: 'bud-head' },
h('span', { class: 'bud-month' }, 'Tháng ' + (_oy && y ? _oy + '/' + y : _oc.month || '')),
h('strong', { class: 'bud-num num' }, usd(_o1s), h('span', { class: 'bud-cap' }, ' / ' + usd(_oa)))),
h('div', { class: 'bud-bar bud-' + tone }, ui.progress(_o18, 'Đã dùng ' + Math.round(_o18) + '% trần tháng')),
h('p', { class: 'bud-sub' }, 'Đã dùng ' + _o18.toFixed(1).replace('.', ',') + '% trần · cảnh báo ở ' + _o2b + '%' +
(tone === 'bad' ? ' · đã chạm trần: chỉ còn Gemini miễn phí, Ollama và chuyển sang chat' : tone === 'warn' ? ' · sắp chạm trần' : '')));
const _o1g = budgetRows(_oc);
const _od = (v) => (v == null ? '—' : intVi(v));
ui.mountTo(table,
h('div', { class: 'bud-row bud-th', 'aria-hidden': 'true' }, h('span', null, 'AI'), h('span', null, 'Lần gọi'), h('span', null, 'Token vào'), h('span', null, 'Token ra'), h('span', null, 'Chi phí')),
_o1g.map((_o1c) => h('div', { class: 'bud-row', dataset: { provider: _o1c.id } },
h('span', { class: 'bud-name' }, _o1c.label),
h('span', { class: 'bud-c', dataset: { k: 'Lần gọi' } }, _od(_o1c.calls)),
h('span', { class: 'bud-c', dataset: { k: 'Token vào' } }, _od(_o1c.tokens_in)),
h('span', { class: 'bud-c', dataset: { k: 'Token ra' } }, _od(_o1c.tokens_out)),
h('strong', { class: 'bud-usd num' }, _o1c.usdText))));
} catch (e) { ui.mountTo(_o12, h('p', { class: 'muted' }, e.userMessage || t('err.network'))); }
}
await _of();
}
export default { renderConnections, renderBudgetPanel };

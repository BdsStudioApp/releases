import { qrElement } from './qr.aa623cdb09.js';
import { ls } from './xkit.f03faf0986.js';
async function copyText(text) {
const t = String(text || '');
try { if (globalThis.navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') { await navigator.clipboard.writeText(t); return 'copied'; } } catch { }
try {
const _os = document.createElement('textarea');
_os.value = t; _os.setAttribute('readonly', ''); _os.style.position = 'fixed'; _os.style.top = '0'; _os.style.opacity = '0';
document.body.appendChild(_os); _os.select();
let _oi = false; try { _oi = document.execCommand('copy'); } catch { _oi = false; }
_os.remove();
return _oi ? 'copied' : 'failed';
} catch { return 'failed'; }
}
export const TITLE = 'Đưa BDS Studio ra màn hình điện thoại';
export const DONE_KEY = 'bds:pwa-hint';
export const MAX_SHOWS = 3;
const _oh = (nav) => nav || (typeof navigator !== 'undefined' ? navigator : {});
export function platformOf(nav) {
const _og = _oh(nav);
const _ou = String(_og.userAgent || '');
if (/iPhone|iPad|iPod/i.test(_ou) || (/Macintosh/i.test(_ou) && Number(_og.maxTouchPoints) > 1)) return 'ios';
if (/Android/i.test(_ou)) return 'android';
return null;
}
export function inAppOf(nav) {
const _ou = String(_oh(nav).userAgent || '');
if (/Zalo/i.test(_ou)) return 'Zalo';
if (/Messenger|FBAN\/Messenger|FB_IAB\/MESSENGER/i.test(_ou)) return 'Messenger';
if (/FBAN|FBAV|FB_IAB|FBIOS|\[FB/i.test(_ou)) return 'Facebook';
if (/Instagram/i.test(_ou)) return 'Instagram';
if (/musical_ly|BytedanceWebview|TikTok|trill/i.test(_ou)) return 'TikTok';
if (/\bLine\//.test(_ou)) return 'LINE';
if (/; wv\)/.test(_ou) && /Android/i.test(_ou)) return 'ứng dụng';
return '';
}
export function browserOf(nav) {
const _ou = String(_oh(nav).userAgent || '');
const p = platformOf(nav);
if (p === 'ios') {
if (/CriOS/.test(_ou)) return 'chrome';
if (/FxiOS/.test(_ou)) return 'firefox';
if (/EdgiOS/.test(_ou)) return 'edge';
return /Safari/.test(_ou) && !inAppOf(nav) ? 'safari' : 'other';
}
if (/SamsungBrowser/i.test(_ou)) return 'samsung';
if (/Firefox/i.test(_ou)) return 'firefox';
if (/EdgA|Edg\//.test(_ou)) return 'edge';
if (/OPR\/|Opera/.test(_ou)) return 'opera';
if (/Chrome\//.test(_ou)) return 'chrome';
return 'other';
}
export function iosVersion(nav) {
const _of = /OS (\d+)[_.](\d+)/.exec(String(_oh(nav).userAgent || ''));
if (_of) return [Number(_of[1]), Number(_of[2])];
const _ow = /Version\/(\d+)\.(\d+)/.exec(String(_oh(nav).userAgent || ''));
return _ow && platformOf(nav) === 'ios' ? [Number(_ow[1]), Number(_ow[2])] : null;
}
export function detect(nav) {
const platform = platformOf(nav);
return { platform, device: platform || 'desktop', browser: browserOf(nav), inApp: inAppOf(nav), iosVer: iosVersion(nav) };
}
export function isStandalone(win = typeof window !== 'undefined' ? window : {}) {
try {
if (win.navigator && win.navigator.standalone === true) return true;
return !!(win.matchMedia && (win.matchMedia('(display-mode: standalone)').matches || win.matchMedia('(display-mode: fullscreen)').matches));
} catch { return false; }
}
export function appUrlFor({ portal = false, state = null, loc = typeof location !== 'undefined' ? location : null } = {}) {
if (portal) {
const d = (state && state.data && state.data.diachi) || {};
return /^https:\/\/[^\s/]+/.test(String(d.url || '')) ? String(d.url) : '';
}
if (!loc || !/^https?:$/.test(String(loc.protocol || ''))) return '';
return String(loc.origin || '') + String(loc.pathname || '/').replace(/index\.html$/, '');
}
export function readRec(raw) {
if (!raw || typeof raw !== 'object') return { shows: 0, done: 0, never: 0, last: 0 };
return { shows: Number(raw.shows) || (raw.at ? 1 : 0), done: Number(raw.done) || 0, never: Number(raw.never) || 0, last: Number(raw.last || raw.at) || 0 };
}
export function shouldShowHint({ nav, win, rec, setupDone = true } = {}) {
const r = readRec(rec);
if (!setupDone || r.done || r.never || r.shows >= MAX_SHOWS) return false;
if (!platformOf(nav)) return false;
return !isStandalone(win);
}
export const afterShow = (rec, now = Date.now()) => { const r = readRec(rec); return { ...r, shows: r.shows + 1, last: now }; };
export const markDone = (rec, now = Date.now()) => ({ ...readRec(rec), done: now });
export const markNever = (rec, now = Date.now()) => ({ ...readRec(rec), never: now });
let _o6 = null;
let _oe = false;
const _oq = new Set();
const _oa = () => { for (const _o8 of _oq) { try { _o8(_o6); } catch { } } };
if (typeof window !== 'undefined' && window.addEventListener) {
window.addEventListener('beforeinstallprompt', (e) => { _o6 = e; _oa(); });
window.addEventListener('appinstalled', () => { _o6 = null; _oe = true; _oa(); });
}
export const canPrompt = () => !!(_o6 && typeof _o6.prompt === 'function');
export function onPromptChange(_o3) { _oq.add(_o3); return () => _oq.delete(_o3); }
export async function promptInstall() {
const e = _o6;
if (!e || typeof e.prompt !== 'function') return 'unavailable';
_o6 = null; _oa();
try { await e.prompt(); const r = await e.userChoice; return (r && r.outcome) || 'dismissed'; } catch { return 'dismissed'; }
}
export const justInstalled = () => _oe;
const _o1 = 'http://www.w3.org/2000/svg';
const _o0 = {
share: [['path', { d: 'M8.5 9H7a1.5 1.5 0 0 0-1.5 1.5v8A1.5 1.5 0 0 0 7 20h10a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 17 9h-1.5M12 3.5V14M8.5 7 12 3.5 15.5 7' }]],
addhome: [['path', { d: 'M6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11A2.5 2.5 0 0 1 6.5 4ZM12 8.5v7M8.5 12h7' }]],
kebab: [['circle', { cx: 12, cy: 5.5, r: 1.7, fill: 'currentColor', stroke: 'none' }], ['circle', { cx: 12, cy: 12, r: 1.7, fill: 'currentColor', stroke: 'none' }], ['circle', { cx: 12, cy: 18.5, r: 1.7, fill: 'currentColor', stroke: 'none' }]],
dots: [['circle', { cx: 5.5, cy: 12, r: 1.7, fill: 'currentColor', stroke: 'none' }], ['circle', { cx: 12, cy: 12, r: 1.7, fill: 'currentColor', stroke: 'none' }], ['circle', { cx: 18.5, cy: 12, r: 1.7, fill: 'currentColor', stroke: 'none' }]],
menu: [['path', { d: 'M4.5 7h15M4.5 12h15M4.5 17h15' }]],
install: [['path', { d: 'M8 3.5h8A1.5 1.5 0 0 1 17.5 5v14a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 19V5A1.5 1.5 0 0 1 8 3.5ZM12 8v6.5M9.5 12l2.5 2.5 2.5-2.5' }]],
phone: [['path', { d: 'M8 3h8a1.5 1.5 0 0 1 1.5 1.5v15A1.5 1.5 0 0 1 16 21H8a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 8 3ZM11 18h2' }]],
android: [['path', { d: 'M6 9.5h12V17a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 17ZM6 9a6 6 0 0 1 12 0ZM9.5 6.5h.01M14.5 6.5h.01M8 3.5l1.3 2M16 3.5l-1.3 2M3.5 10.5v4.5M20.5 10.5v4.5M9.5 18.5v2.5M14.5 18.5v2.5' }]],
copy: [['path', { d: 'M9 9h10v11H9zM15 9V4H5v11h4' }]],
check: [['path', { d: 'M5 12.5l4.5 4.5L19 7.5' }]],
clock: [['path', { d: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v4.5l3 2' }]],
close: [['path', { d: 'M6 6l12 12M18 6 6 18' }]],
book: [['path', { d: 'M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5ZM13 4h5.5A1.5 1.5 0 0 1 20 5.5v13a1.5 1.5 0 0 1-1.5 1.5H13Z' }]],
qr: [['path', { d: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2M18 14h2' }]]
};
export function art(name, size = 20, cls = '') {
const _or = document.createElementNS(_o1, 'svg');
for (const [k, _ow] of Object.entries({ viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true', class: ('ico a2hs-art ' + cls).trim() })) _or.setAttribute(k, String(_ow));
_or.dataset.art = name;
for (const [tag, attrs] of _o0[name] || _o0.phone) {
const _o7 = document.createElementNS(_o1, tag);
for (const [k, _ow] of Object.entries(attrs)) _o7.setAttribute(k, String(_ow));
_or.appendChild(_o7);
}
return _or;
}
export const STEPS = {
ios: [
['Mở trang này bằng ', { b: 'Safari' }, '.'],
['Bấm nút ', { k: 'share', t: 'Chia sẻ' }, ' ở thanh dưới cùng (iPad: góc trên bên phải). iOS 26 không thấy nút này: bấm ', { k: 'dots', t: '' }, ' cạnh thanh địa chỉ rồi chọn Chia sẻ.'],
['Kéo xuống, chọn ', { k: 'addhome', t: 'Thêm vào MH chính' }, ' (máy khác có thể ghi “Thêm vào Màn hình chính”).'],
['Bấm ', { b: 'Thêm' }, ' ở góc trên bên phải. Có công tắc mở như ứng dụng thì cứ để bật.']
],
android: [
['Mở trang này bằng ', { b: 'Chrome' }, '.'],
['Bấm nút ', { k: 'kebab', t: '' }, ' ở góc trên bên phải.'],
['Chọn ', { k: 'install', t: 'Cài đặt ứng dụng' }, ' hoặc ', { k: 'addhome', t: 'Thêm vào màn hình chính' }, '.'],
['Bấm ', { b: 'Cài đặt' }, ' (hoặc ', { b: 'Thêm' }, ').']
]
};
export const NOTES = {
iosChrome: ['Dùng Chrome trên iPhone (iOS 16.4 trở lên)? Cũng được: bấm nút ', { k: 'share', t: 'Chia sẻ' }, ' cạnh thanh địa chỉ → ', { b: 'Thêm vào MH chính' }, ' → ', { b: 'Thêm' }, '.'],
samsung: ['Samsung Internet: bấm nút ', { k: 'menu', t: '' }, ' ở thanh dưới → ', { b: 'Thêm trang vào' }, ' → ', { b: 'Màn hình chính' }, '.'],
after: 'Xong sẽ thấy biểu tượng BDS Studio trên màn hình chính – lần sau chạm vào đó là mở app, không cần gõ địa chỉ.'
};
export function stepText(_om) { return _om.map((p) => (typeof p === 'string' ? p : p.b || (p.t ? '“' + p.t + '”' : { kebab: '⋮', dots: '…', menu: '☰' }[p.k] || ''))).join(''); }
export function a2hsCard(ui, opts = {}) {
const { h } = ui;
const { appUrl = '', portal = false, compact = false, testid = 'a2hs', showActions = true } = opts;
const env = detect(opts.nav);
const standalone = isStandalone(opts.win);
const T = (s) => testid + (s ? '-' + s : '');
const _oo = h('section', { class: ['a2hs', compact && 'a2hs-compact'], 'aria-label': TITLE, 'data-testid': T(), dataset: { device: env.device, browser: env.browser } });
const _ob = h('div', { class: 'a2hs-head' },
h('img', { src: 'assets/icon-192.png', alt: '', width: compact ? 32 : 44, height: compact ? 32 : 44, class: 'a2hs-logo' }),
h('div', { class: 'a2hs-head-text' },
h(compact ? 'strong' : 'h3', { class: 'a2hs-title' }, '📲 ' + TITLE),
compact ? null : h('p', { class: 'muted small' }, 'Mở app bằng một chạm như ứng dụng thường – không cần tải từ kho ứng dụng, không tốn phí.')));
_oo.append(_ob);
if (standalone) {
_oo.dataset.state = 'installed';
_oo.append(h('p', { class: 'a2hs-ok', 'data-testid': T('installed') }, '✅ Đã có trên màn hình chính'),
compact ? null : h('p', { class: 'muted small' }, 'Anh/chị đang mở BDS Studio từ biểu tượng trên màn hình chính – không cần làm gì thêm.'));
return _oo;
}
const body = h('div', { class: 'a2hs-body' });
_oo.append(body);
if (env.device === 'desktop') {
if (appUrl) {
const qr = qrElement(appUrl, { scale: 4, border: 3, ecl: 'M', title: 'Mã QR mở ' + appUrl.replace(/^https?:\/\//, '') });
body.append(h('div', { class: 'a2hs-qr', 'data-testid': T('qr'), dataset: { url: appUrl } },
h('div', { class: 'a2hs-qr-img' }, qr),
h('div', { class: 'a2hs-qr-text' },
h('p', null, h('strong', null, 'Quét bằng camera điện thoại để mở app, rồi làm theo hướng dẫn')),
h('p', { class: 'muted small' }, 'Địa chỉ app của anh/chị: ', h('span', { class: 'mono break', 'data-testid': T('url') }, appUrl.replace(/^https?:\/\//, '').replace(/\/$/, ''))),
_o4(appUrl, 'Chép địa chỉ app'))));
} else {
body.append(h('p', { class: 'a2hs-qr-none', 'data-testid': T('no-url') }, portal
? 'Mở app riêng của anh/chị trên điện thoại (địa chỉ có ở bước "Địa chỉ app"), rồi làm theo hướng dẫn dưới đây. Đây là trang cài đặt – đừng thêm trang này ra màn hình chính.'
: 'Mở app riêng của anh/chị trên điện thoại, rồi làm theo hướng dẫn dưới đây.'));
}
}
if (portal && env.platform) {
body.append(h('p', { class: 'a2hs-inapp', role: 'note', 'data-testid': T('portal') }, '⚠️ Làm các bước dưới ở ',
appUrl ? h('a', { href: appUrl, rel: 'noopener', 'data-testid': T('portal-url') }, 'app riêng của anh/chị (' + appUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') + ')') : h('strong', null, 'app riêng của anh/chị'),
' – đừng thêm trang cài đặt này ra màn hình chính.'));
}
if (env.platform && env.inApp) {
const href = appUrl || (typeof location !== 'undefined' ? location.href : '');
const browser = env.platform === 'ios' ? 'Safari' : 'Chrome';
body.append(h('div', { class: 'a2hs-inapp', role: 'note', 'data-testid': T('inapp') },
h('p', null, '⚠️ ', h('strong', null, 'Đang mở trong ' + env.inApp + ' – từ đây không thêm ra màn hình chính được.')),
h('p', { class: 'small' }, 'Mở trang này bằng ' + browser + ' trước: bấm nút ', key('dots', ''), ' hoặc ', key('kebab', ''), ' ở góc màn hình → chọn “Mở bằng trình duyệt” (hoặc “Mở trong ' + browser + '”). Không thấy thì chép địa chỉ rồi dán vào ' + browser + '.'),
_o4(href, 'Chép địa chỉ')));
}
const _od = h('div', { class: 'a2hs-install', 'data-testid': T('install-box') });
const _ok = () => {
ui.clear(_od);
_od.hidden = !(env.platform === 'android' && canPrompt());
if (_od.hidden) return;
_od.append(ui.button('Cài ngay', async () => {
const r = await promptInstall();
if (r === 'accepted') _o9('done');
}, { kind: 'primary', block: true, icon: 'download', testid: T('install') }),
h('p', { class: 'muted small' }, 'Bấm là Chrome hỏi cài – chọn “Cài đặt”. Hoặc làm tay theo các bước dưới.'));
};
_ok();
const _ov = onPromptChange(() => { if (!_oo.isConnected && _oo.dataset.mounted) { _ov(); return; } _ok(); });
let _o5 = env.platform || 'ios';
const tabs = h('div', { class: 'a2hs-tabs', role: 'tablist', 'aria-label': 'Chọn loại điện thoại' });
const _ol = {};
const _ot = {};
for (const [id, label, ic] of [['ios', 'iPhone / iPad', 'phone'], ['android', 'Android', 'android']]) {
_ot[id] = h('button', { type: 'button', role: 'tab', class: 'a2hs-tab', id: T('tab-' + id), 'aria-controls': T('panel-' + id), 'data-testid': T('tab-' + id), onclick: () => _on(id) }, art(ic, 18), h('span', null, label));
tabs.append(_ot[id]);
_ol[id] = h('div', { class: 'a2hs-panel', role: 'tabpanel', id: T('panel-' + id), 'aria-labelledby': T('tab-' + id), 'data-testid': T('panel-' + id) },
h('ol', { class: 'a2hs-steps', 'data-testid': T('steps-' + id) }, STEPS[id].map((s) => h('li', null, _om(s)))),
id === 'ios' && (!compact || (env.platform === 'ios' && env.browser === 'chrome')) ? h('p', { class: ['a2hs-note', env.browser === 'chrome' && env.platform === 'ios' && 'is-hot'], 'data-testid': T('note-ios-chrome') }, _om(NOTES.iosChrome)) : null,
id === 'android' && (!compact || env.browser === 'samsung') ? h('p', { class: ['a2hs-note', env.browser === 'samsung' && 'is-hot'], 'data-testid': T('note-samsung') }, _om(NOTES.samsung)) : null);
}
const _on = (id) => {
_o5 = id;
for (const k of Object.keys(_ol)) {
const _oj = k === id;
_ol[k].hidden = !_oj;
_ot[k].classList.toggle('on', _oj);
_ot[k].setAttribute('aria-selected', _oj ? 'true' : 'false');
_ot[k].tabIndex = _oj ? 0 : -1;
}
_oo.dataset.tab = id;
};
tabs.addEventListener('keydown', (e) => {
if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
const _og = _o5 === 'ios' ? 'android' : 'ios'; _on(_og); _ot[_og].focus(); e.preventDefault();
});
body.append(_od, tabs, _ol.ios, _ol.android, compact ? null : h('p', { class: 'muted small a2hs-after' }, NOTES.after));
_on(_o5);
if (showActions) {
const _o2 = h('div', { class: 'btn-row a2hs-acts' },
ui.button('Đã làm xong', () => _o9('done'), { kind: env.platform === 'android' && canPrompt() ? 'secondary' : 'primary', small: compact, icon: 'check', testid: T('done') }),
ui.button('Để sau', () => _o9('later'), { kind: 'ghost', small: compact, icon: 'clock', testid: T('later') }),
opts.onNever ? ui.button('Không nhắc nữa', () => _o9('never'), { kind: 'ghost', small: compact, icon: 'close', testid: T('never') }) : null);
body.append(_o2);
}
_oo.dataset.mounted = '1';
return _oo;
function _o9(kind) {
_ov();
const _o3 = { done: opts.onDone, later: opts.onLater, never: opts.onNever }[kind];
if (typeof _o3 === 'function') _o3(_oo);
}
function key(name, label) {
return h('span', { class: ['a2hs-key', !label && 'a2hs-key-ico'], 'data-key': name, title: label || { kebab: 'Nút ba chấm dọc', dots: 'Nút ba chấm', menu: 'Nút menu' }[name] || '' },
art(name, 16), label ? h('span', null, label) : h('span', { class: 'sr-only' }, { kebab: '⋮', dots: '…', menu: '☰' }[name] || ''));
}
function _om(list) { return list.map((p) => (typeof p === 'string' ? p : p.k ? key(p.k, p.t) : h('strong', null, p.b))); }
function _o4(text, label) {
const _op = h('span', { class: 'muted small', 'aria-live': 'polite', 'data-testid': T('copy-say') });
return h('div', { class: 'btn-row' }, ui.button(label, async () => {
const _oc = await copyText(text);
_op.textContent = _oc === 'copied' ? 'Đã chép.' : 'Chưa chép tự động được – bấm giữ địa chỉ để chép.';
}, { kind: 'secondary', small: true, icon: 'copy', testid: T('copy') }), _op);
}
}
export function finishCard(ui, { appUrl = '', portal = false, store = ls, nav, win, testid = 'a2hs', start = '', onState } = {}) {
const { h } = ui;
const _ox = h('div', { class: 'a2hs-wrap', 'data-testid': testid + '-wrap' });
const _op = (k) => { if (typeof onState === 'function') try { onState(k); } catch { } };
const full = () => { _op(''); ui.mountTo(_ox, a2hsCard(ui, { appUrl, portal, nav, win, testid,
onDone: () => { if (store) store.set(DONE_KEY, markDone(store.get(DONE_KEY, null))); small('done'); },
onLater: () => small('later') })); };
const small = (kind) => { _op(kind); ui.mountTo(_ox, h('div', { class: 'a2hs-mini', 'data-testid': testid + '-mini', dataset: { kind } },
h('p', null, kind === 'done' ? '✅ Tốt rồi! Lần sau mở BDS Studio từ biểu tượng trên màn hình chính.' : '⏳ Để sau – hướng dẫn luôn có ở Cài đặt › Phiên bản & Cập nhật › Cài app ra màn hình chính.'),
ui.button('Xem lại hướng dẫn', full, { kind: 'ghost', small: true, icon: 'help', testid: testid + '-reopen' }))); };
if (start === 'done' || start === 'later') small(start); else full();
return _ox;
}
export function openGuide(ui, { appUrl = appUrlFor(), store = ls, nav, win } = {}) {
let _of = null;
const close = () => { try { if (_of && _of.close) _of.close(); } catch { } };
const body = a2hsCard(ui, { appUrl, nav, win, testid: 'a2hs-guide',
onDone: () => { if (store) store.set(DONE_KEY, markDone(store.get(DONE_KEY, null))); close(); },
onLater: close });
_of = ui.modal({ title: 'Cài app ra màn hình chính', body, cls: 'a2hs-modal', actions: [] });
return _of;
}
export function settingsRow(ui, { store = ls, nav, win } = {}) {
const { h } = ui;
const standalone = isStandalone(win);
return h('div', { class: 'sub-block a2hs-row', 'data-testid': 'a2hs-settings' },
h('div', { class: 'a2hs-row-text' }, h('strong', null, '📲 Cài app ra màn hình chính'),
h('span', { class: 'muted small' }, standalone ? '✅ Đã có trên màn hình chính' : 'Mở app bằng một chạm như ứng dụng thường (iPhone, Android; máy tính có mã QR để quét).')),
ui.button('Xem hướng dẫn', () => openGuide(ui, { store, nav, win }), { kind: 'secondary', small: true, icon: 'phone', testid: 'a2hs-settings-open' }));
}
export default { platformOf, inAppOf, browserOf, iosVersion, detect, isStandalone, appUrlFor, readRec, shouldShowHint, afterShow, markDone, markNever, a2hsCard, finishCard, openGuide, settingsRow, TITLE, DONE_KEY, MAX_SHOWS, STEPS, NOTES, stepText };

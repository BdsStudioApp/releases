import { cmpVersion, fetchLatest, engineHealth, publicBase, scriptApiCheck } from './updates.9704b81308.js';
import { normalizeServerChecks, summarizeChecks, compactResult, isMissingActionError, MISSING_ACTION_TEXT, REQUIRED_ACTIONS } from './health_logic.9704b81308.js';
import { loadLocal, saveLocal, connHash } from './connections_logic.cff3dbca52.js';
const LAST_KEY = 'bds:fullcheck:last';
export const TG_SETTING = 'syscheck.telegram';
const _o2 = { true: '✅', false: '❌', null: '⚠️' };
export function loadLast(storage = globalThis.localStorage) {
try { const v = JSON.parse(storage.getItem(LAST_KEY) || 'null'); return v && Array.isArray(v.items) ? v : null; } catch { return null; }
}
function _or(v, storage = globalThis.localStorage) { try { storage.setItem(LAST_KEY, JSON.stringify(v)); } catch { } }
const _o9 = (...a) => globalThis.fetch(...a);
const _oo = (id, label, ok, detail, fix = '', action = '') => ({ id, label, ok, detail: detail || '', fix: ok === false ? fix : '', url: '', source: 'app', action: ok === false ? action : '' });
export async function clientChecks({ api, store, ai, config = {}, swVersion, fetchFn = _o9, probeLocal = true, engineOn = true, videoOff = false, loc = typeof location !== 'undefined' ? location : null } = {}) {
const web = config.APP_VERSION || '';
const _ol = publicBase(loc, config);
const _o1 = config.ENGINE_URL || 'http://127.0.0.1:8765';
const _oi = loadLocal();
const [latest, status, eng] = await Promise.all([
fetchLatest(fetchFn, _ol ? [_ol + 'version.json', 'version.json'] : ['version.json']).catch(() => null),
api.call('status').catch((e) => ({ error: e })),
engineOn && (probeLocal || (_oi.engine && _oi.engine.ok)) ? _oc(_o1, fetchFn) : Promise.resolve(null)
]);
const out = [];
const latestWeb = latest && latest.web;
out.push(_oo('app.web', 'Phiên bản web', latestWeb ? cmpVersion(web, latestWeb) >= 0 : true,
'v' + (web || '?') + (latestWeb ? (cmpVersion(web, latestWeb) < 0 ? ' – đã có v' + latestWeb : ' – mới nhất') : ''),
'Mở Cài đặt › Phiên bản, bấm "Tải lại để dùng bản mới".', 'web-reload'));
const gas = status && !status.error ? status.version : null;
const wantGas = (latest && latest.gas) || web;
const _ow = (latest && latest.engine) || web;
const _oe = gas ? cmpVersion(gas, wantGas) >= 0 : false;
const _ob = !eng || !eng.running || !eng.version ? true : cmpVersion(eng.version, _ow) >= 0;
const _ok = ['Web v' + (web || '?'), 'Máy chủ ' + (gas ? 'v' + gas : 'chưa gọi được'), 'Máy dựng ' + (eng && eng.running ? 'v' + (eng.version || '?') : 'chưa bật')];
out.push(_oo('app.versions', 'Phiên bản web = máy chủ = máy dựng', _oe && _ob, _ok.join(' · '),
!_oe ? 'Máy chủ chạy bản cũ – bấm "Cập nhật máy chủ" (app tự thay mã, giữ nguyên đường dẫn).' : 'Máy dựng chạy bản cũ – mở Cài đặt › Phiên bản › Máy dựng, bấm "Cập nhật tự động".',
!_oe ? 'server-update' : 'open-version'));
let _ot = null;
try { _ot = swVersion ? await swVersion() : null; } catch { _ot = null; }
const _of = typeof navigator !== 'undefined' && 'serviceWorker' in navigator;
const _ou = _ot ? String(_ot).replace(/^v/i, '').split(' ')[0] : '';
const swOk = !_of ? null : !_ot ? null : /chưa cài/.test(_ot) ? null : cmpVersion(_ou, web) === 0;
out.push(_oo('app.sw', 'Bộ nhớ đệm web (mở app khi mạng yếu)', swOk,
!_of ? 'Trình duyệt không hỗ trợ – app vẫn chạy khi có mạng' : !_ot ? 'Chưa đọc được' : /chưa cài/.test(_ot) ? 'Chưa cài (lần mở đầu hoặc đang chặn)' : 'Bản ' + _ot,
'Tải lại trang (hoặc đóng hẳn app rồi mở lại) để bộ nhớ đệm lên đúng bản.', 'web-reload'));
try {
await store.list('settings');
const s = store.status();
out.push(_oo('app.localdb', 'Dữ liệu trên máy (IndexedDB)', true, s.pending ? s.pending + ' thay đổi chờ gửi' : 'Đọc ghi được'));
} catch (e) {
out.push(_oo('app.localdb', 'Dữ liệu trên máy (IndexedDB)', false, (e && e.message) || 'Không mở được', 'Tắt chế độ ẩn danh / cho phép lưu dữ liệu trang, rồi tải lại.', 'web-reload'));
}
try {
const s = await store.syncNow();
out.push(_oo('app.sync', 'Đồng bộ với máy chủ', !!s.online && !s.error, !s.online ? 'Ngoại tuyến' : s.error ? s.error : 'Đã đồng bộ · ' + s.pending + ' chờ',
'Kiểm tra mạng; nếu báo máy chủ cũ thì bấm "Cập nhật máy chủ".', 'server-update'));
} catch (e) { out.push(_oo('app.sync', 'Đồng bộ với máy chủ', false, (e && (e.userMessage || e.message)) || '', 'Kiểm tra mạng rồi kiểm lại.', '')); }
if (eng) {
saveLocal('engine', { ok: !!eng.running, vbee: !!eng.vbee });
out.push(_oo('app.engine', 'Máy dựng video', eng.running ? true : null, eng.running ? 'Đang chạy v' + (eng.version || '?') : 'Chưa bật – không bắt buộc'));
out.push(_oo('app.vbee', 'Giọng đọc Vbee (khoá ở máy dựng)', eng.running ? (eng.vbee ? true : false) : null,
eng.running ? (eng.vbee ? 'Máy dựng đã có khoá' : 'Máy dựng chưa có khoá Vbee') : 'Cần bật máy dựng để kiểm',
'Mở Cài đặt › Kết nối › Giọng đọc Vbee, dán App-Id và Token rồi Lưu.', 'open-conn'));
} else if (!videoOff) {
out.push(_oo('app.engine', 'Máy dựng video', null, engineOn ? 'Chưa kiểm (chưa từng nối trên máy này) – không bắt buộc' : 'Gói có máy dựng đang tắt – bỏ qua'));
}
if (ai && (probeLocal || (_oi.ollama && _oi.ollama.ok))) {
let _om = { ok: false, models: [] };
try { _om = await ai.checkOllama({ bridge: engineOn }); } catch { }
saveLocal('ollama', { ok: !!_om.ok, n: (_om.models || []).length });
out.push(_oo('app.ollama', 'Ollama (AI trên máy)', _om.ok ? true : null, _om.ok ? _om.models.length + ' model' : 'Chưa thấy Ollama – không bắt buộc'));
}
return { items: out, latest, status, wantGas };
}
async function _oc(base, fetchFn) {
try {
const _o7 = typeof AbortController !== 'undefined' ? new AbortController() : null;
const _ov = _o7 ? setTimeout(() => _o7.abort(), 2500) : null;
try {
const _om = await fetchFn(base + '/health', _o7 ? { signal: _o7.signal } : {});
if (!_om.ok) return { running: false };
const _o8 = await _om.json();
return { running: true, version: (_o8 && _o8.version) || null, vbee: !!(_o8 && _o8.vbee_configured) };
} finally { if (_ov) clearTimeout(_ov); }
} catch { const _og = await engineHealth(base, fetchFn).catch(() => ({ running: false })); return { running: !!_og.running, version: _og.version, vbee: false }; }
}
export async function serverChecks(api, { telegram = false, client = [], webVersion = '' } = {}) {
try {
const _on = await api.call('system.check', { telegram: !!telegram, web_version: webVersion, required_actions: REQUIRED_ACTIONS, client: client.map((x) => ({ id: x.id, label: x.label, ok: x.ok, detail: x.detail })) });
const items = normalizeServerChecks(_on);
return { items, telegram_sent: !!(_on && (_on.telegram_sent || _on.sent)), at: _on && _on.at };
} catch (e) {
if (isMissingActionError(e)) return { items: [{ id: 'srv.system', label: 'Máy chủ có “Kiểm tra toàn bộ”', ok: false, detail: MISSING_ACTION_TEXT, fix: 'Bấm "Cập nhật máy chủ" – app tự thay mã máy chủ, đường dẫn giữ nguyên.', url: '', source: 'server', action: 'server-update' }] };
return { items: [{ id: 'srv.system', label: 'Máy chủ trả lời', ok: false, detail: (e && (e.userMessage || e.message)) || 'Không gọi được', fix: 'Kiểm tra mạng và URL máy chủ ở Cài đặt › Kết nối.', url: '', source: 'server', action: 'open-conn' }] };
}
}
export async function runFullCheck(deps = {}) {
const c = await clientChecks(deps);
const s = await serverChecks(deps.api, { telegram: deps.telegram, client: c.items, webVersion: (c.latest && c.latest.gas) || '' });
const items = [...s.items, ...c.items];
const at = Date.now();
const _on = { ...compactResult(items, at), summary: summarizeChecks(items), telegram_sent: !!s.telegram_sent, auto: !!deps.auto };
_or(_on);
try { if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('bds:fullcheck', { detail: _on })); } catch { }
return _on;
}
export function renderFullCheck(body, ctx, app = {}) {
const { ui, settings } = ctx;
const { h, button, field, toast } = ui;
const head = h('p', { class: 'fc-sum', 'data-testid': 'fullcheck-summary', 'aria-live': 'polite' });
const lastEl = h('p', { class: 'muted small', 'data-testid': 'fullcheck-last' });
const _oh = h('div', { class: 'fc-list', 'data-testid': 'fullcheck-list' });
const tg = field({
label: 'Gửi tóm tắt qua Telegram', type: 'toggle', value: !!(settings && settings.get(TG_SETTING, false)), id: 'fullcheck-telegram',
onChange: async (v) => { if (settings) await settings.set(TG_SETTING, !!v); toast(v ? 'Sẽ gửi tóm tắt qua Telegram sau mỗi lần kiểm' : 'Không gửi Telegram', 'ok'); }
});
const _oq = button('Kiểm tra toàn bộ', () => run(), { kind: 'primary', icon: 'pulse', testid: 'fullcheck-run' });
const _o5 = h('div', { class: 'sub-block fullcheck', 'data-testid': 'fullcheck' },
h('h4', { class: 'section-title' }, 'Kiểm tra toàn bộ'),
h('p', { class: 'muted small' }, 'Một lần bấm (khoảng 1 phút): phiên bản web – máy chủ – máy dựng, máy chủ đủ lệnh, Sheet, nhắc việc tự động, đồng bộ thử, Telegram, AI, Drive, landing, email, máy dựng, Ollama, Vbee và quyền từng vai trò. Tự chạy lại sau mỗi lần cập nhật.'),
h('div', { class: 'btn-row' }, _oq), tg, head, lastEl, _oh);
body.appendChild(_o5);
const _oj = (e) => { if (_o5.isConnected) _oa(e.detail); else window.removeEventListener('bds:fullcheck', _oj); };
window.addEventListener('bds:fullcheck', _oj);
_oa(loadLast());
return { run, el: _o5 };
async function run() {
ui.mountTo(head, ui.spinner(), ' Đang kiểm tra…');
const _on = await app.runFullCheck({ auto: false, telegram: !!(settings && settings.get(TG_SETTING, false)), probeLocal: true });
toast(_on.summary.text + (_on.telegram_sent ? ' Đã gửi Telegram.' : ''), _on.summary.bad ? 'warn' : 'ok', 5000);
return _on;
}
function _oa(_on) {
if (!_on) { head.textContent = 'Chưa chạy lần nào trên máy này.'; lastEl.textContent = ''; ui.clear(_oh); return; }
const _os = _on.summary || summarizeChecks(_on.items);
head.textContent = _os.text;
head.className = 'fc-sum ' + (_os.bad ? 'is-bad' : 'is-ok');
lastEl.textContent = 'Lần kiểm gần nhất: ' + ui.date(_on.at, true) + (_on.auto ? ' (tự chạy sau cập nhật)' : '') + (_on.telegram_sent ? ' · đã gửi Telegram' : '');
ui.mountTo(_oh, _on.items.map(_op));
}
function _op(x) {
const _od = h('div', { class: 'fc-fix', hidden: true, 'data-testid': 'fc-fixbox-' + x.id });
const fixBtn = x.ok === false ? button('Cách sửa', () => {
if (!_od.hidden) { _od.hidden = true; return; }
ui.mountTo(_od, h('p', { class: 'small' }, x.fix || 'Xem chi tiết lỗi bên trên; vẫn chưa được thì gửi Góp ý kèm ảnh màn hình.'), _o3(x));
_od.hidden = false;
}, { kind: 'secondary', small: true, testid: 'fc-fix-' + x.id }) : null;
return h('div', { class: 'fc-row', dataset: { check: x.id, ok: x.ok === true ? '1' : x.ok === false ? '0' : '' }, 'data-testid': 'fc-row-' + x.id },
h('span', { class: 'fc-mark', 'aria-hidden': 'true' }, x.skipped ? '⏭' : _o2[String(x.ok)]),
h('span', { class: 'fc-text' }, h('strong', null, x.label), x.skipped ? h('span', { class: 'muted small', 'data-testid': 'fc-skip-' + x.id }, 'Bỏ qua – không bắt buộc' + (x.detail ? ' · ' + x.detail : '')) : x.detail ? h('span', { class: 'muted small' }, x.detail) : null),
fixBtn, _od);
}
const _o0 = { 'app.vbee': 'vbee', 'app.engine': 'engine', 'app.ollama': 'ollama', 'srv.system': 'server', 'srv.gemini': 'gemini', 'srv.telegram': 'telegram', 'srv.claude': 'claude' };
function _o3(x) {
const _o4 = [];
if (x.url) _o4.push(h('a', { class: 'btn btn-secondary btn-sm', href: x.url, target: '_blank', rel: 'noopener noreferrer', 'data-testid': 'fc-url-' + x.id }, h('span', null, x.url_label || 'Mở trang')));
let _o6 = null;
if (x.action === 'script-api' && ctx.api) { _o6 = scriptApiCheck(ui, { api: ctx.api, testid: 'fc-api-check', small: true }); _o4.push(_o6.btn); }
if (x.action === 'server-update' && app.selfHeal) _o4.push(button('Cập nhật máy chủ', () => app.selfHeal.updateServer({ auto: false }), { kind: 'primary', small: true, testid: 'fc-act-server' }));
if (x.action === 'web-reload' && app.applyUpdate) _o4.push(button('Tải lại', () => app.applyUpdate(), { kind: 'primary', small: true }));
if (x.action === 'open-conn') _o4.push(h('a', { class: 'btn btn-secondary btn-sm', href: connHash(_o0[x.id]), 'data-testid': 'fc-act-conn' }, h('span', null, 'Mở Kết nối')));
if (x.action === 'open-profile') _o4.push(h('a', { class: 'btn btn-secondary btn-sm', href: '#/settings/profile', 'data-testid': 'fc-act-profile' }, h('span', null, 'Mở Thông tin cá nhân')));
if (x.action === 'open-version') _o4.push(h('a', { class: 'btn btn-secondary btn-sm', href: '#/settings/version' }, h('span', null, 'Mở Phiên bản')));
return _o4.length ? [h('div', { class: 'btn-row' }, _o4), _o6 ? _o6.out : null] : null;
}
}
export default { runFullCheck, clientChecks, serverChecks, renderFullCheck, loadLast, TG_SETTING };
